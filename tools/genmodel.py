#!/usr/bin/env python3
"""
genmodel.py -- normalized generator IR for documentation.json.

The documentation database is a rich, polymorphic JSON tree. Nothing should
render Markdown (or any future SDK surface) directly from that tree. This
module is the single normalization boundary:

    documentation.json  ->  Model (typed IR objects)  ->  renderers/QA

Every IR object keeps its uncertainty vocabulary (confirmed / strong /
inferred / unresolved), sentinel strings ("none", "n/a", "unconstrained"),
bounded-unknown blocks ({proven, unknown}), stub/removed flags and evidence
records exactly as the database states them. Extra keys that have no
dedicated IR field are preserved verbatim under `extra` so normalization
never silently drops data.

qa(model, api) implements the loud-consistency checks used as a generation
gate: contradictory counts, prose/arg-model mismatches, stale unresolved
text, unit/range/type mismatches, impossible confidence combinations,
duplicate/conflicting actions, ownership and cross-link problems.
"""
import os
import re
import sys
from dataclasses import dataclass, field, asdict
from typing import Optional

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doclib

STATUS_RANK = {"confirmed": 3, "strong": 2, "inferred": 1, "unresolved": 0}


# --------------------------------------------------------------------------
# IR objects
# --------------------------------------------------------------------------

@dataclass
class Evidence:
    type: Optional[str] = None
    status: Optional[str] = None
    binary: Optional[str] = None
    build: Optional[str] = None
    function: Optional[str] = None
    address: Optional[str] = None
    callsite: Optional[str] = None
    notes: Optional[str] = None

    @classmethod
    def from_raw(cls, raw):
        raw = raw or {}
        return cls(type=raw.get("type"), status=raw.get("status"),
                   binary=raw.get("binary"), build=raw.get("build"),
                   function=raw.get("function"), address=raw.get("address"),
                   callsite=raw.get("callsite"), notes=raw.get("notes"))

    def ref(self):
        """Short human-readable locator."""
        parts = []
        if self.function:
            parts.append("fn %s" % self.function)
        if self.address:
            parts.append("@ %s" % self.address)
        if self.callsite:
            parts.append("site %s" % self.callsite)
        return " ".join(parts) or self.type or "evidence"


@dataclass
class SemanticBlock:
    """A {description, status, evidence, ...extra} documentation unit.

    `text` is the human-readable semantics; scalar fields keep their string
    form, dict fields keep their description text and any extra keys in
    `extra`. `status` may be None when the field was a bare string.
    """
    text: Optional[str] = None
    status: Optional[str] = None
    evidence: list = field(default_factory=list)
    extra: dict = field(default_factory=dict)

    @classmethod
    def from_raw(cls, raw):
        if raw is None:
            return None
        if isinstance(raw, str):
            return cls(text=raw)
        if isinstance(raw, list):
            # list of {description, evidence} entries (e.g. side_effects)
            items = []
            for e in raw:
                if isinstance(e, dict):
                    items.append(cls(text=e.get("description"),
                                     status=e.get("status"),
                                     evidence=[Evidence.from_raw(x)
                                               for x in e.get("evidence")
                                               or []]))
                else:
                    items.append(cls(text=str(e)))
            return items
        if isinstance(raw, dict):
            known = {"description", "status", "evidence"}
            extra = {k: v for k, v in raw.items() if k not in known}
            return cls(text=raw.get("description"), status=raw.get("status"),
                       evidence=[Evidence.from_raw(x)
                                 for x in raw.get("evidence") or []],
                       extra=extra)
        return cls(text=str(raw))


@dataclass
class Primitive:
    type_tag: Optional[int] = None
    parse_helper: Optional[str] = None
    buf_cap: Optional[int] = None
    fmt: Optional[str] = None
    via_slot: Optional[object] = None
    extra: dict = field(default_factory=dict)

    @classmethod
    def from_raw(cls, raw):
        if not isinstance(raw, dict):
            return None
        known = {"type_tag", "parse_helper", "buf_cap", "fmt", "via_slot"}
        cap = raw.get("buf_cap")
        if isinstance(cap, str):
            try:
                cap = int(cap, 0)
            except ValueError:
                pass
        return cls(type_tag=raw.get("type_tag"),
                   parse_helper=raw.get("parse_helper"),
                   buf_cap=cap, fmt=raw.get("fmt"),
                   via_slot=raw.get("via_slot"),
                   extra={k: v for k, v in raw.items() if k not in known})


@dataclass
class Argument:
    name: str = ""
    direction: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    primitive: Optional[Primitive] = None
    semantic_type: Optional[str] = None
    format: Optional[str] = None
    unit: Optional[str] = None
    accepted_values: object = None
    range: object = None
    special_values: object = None
    required: object = None
    default: object = None
    validation: object = None
    evidence: list = field(default_factory=list)
    notes: Optional[str] = None
    extra: dict = field(default_factory=dict)

    KNOWN = {"description", "status", "direction", "primitive",
             "semantic_type", "format", "unit", "accepted_values", "range",
             "special_values", "required", "default", "validation",
             "evidence", "notes"}

    @classmethod
    def from_raw(cls, name, raw):
        raw = raw or {}
        prim = Primitive.from_raw(raw.get("primitive"))
        extra = {k: v for k, v in raw.items() if k not in cls.KNOWN}
        # a few records carry a stray top-level buf_cap
        if prim is None and "buf_cap" in raw:
            prim = Primitive(buf_cap=raw.get("buf_cap"))
        return cls(name=name, direction=raw.get("direction"),
                   status=raw.get("status"),
                   description=raw.get("description"), primitive=prim,
                   semantic_type=raw.get("semantic_type"),
                   format=raw.get("format"), unit=raw.get("unit"),
                   accepted_values=raw.get("accepted_values"),
                   range=raw.get("range"),
                   special_values=raw.get("special_values"),
                   required=raw.get("required"), default=raw.get("default"),
                   validation=raw.get("validation"),
                   evidence=[Evidence.from_raw(e)
                             for e in raw.get("evidence") or []],
                   notes=raw.get("notes"), extra=extra)

    @property
    def never_consumed(self):
        """Reject-all stub arguments: SCPD-declared but never parsed."""
        p = self.primitive
        return (p is None or p.type_tag is None) and bool(
            self.validation and "never" in str(self.validation).lower())


@dataclass
class Condition:
    description: Optional[str] = None
    evidence: list = field(default_factory=list)

    @classmethod
    def from_raw(cls, raw):
        raw = raw or {}
        return cls(description=raw.get("description"),
                   evidence=[Evidence.from_raw(e)
                             for e in raw.get("evidence") or []])


@dataclass
class ErrorEntry:
    code: Optional[int] = None
    code_expr: Optional[str] = None
    meaning: Optional[str] = None
    status: Optional[str] = None
    fault_sites: list = field(default_factory=list)
    conditions: list = field(default_factory=list)
    evidence: list = field(default_factory=list)
    unresolved: Optional[dict] = None   # {proven, unknown}
    notes: Optional[str] = None

    @classmethod
    def from_raw(cls, raw):
        raw = raw or {}
        return cls(code=raw.get("code"), code_expr=raw.get("code_expr"),
                   meaning=raw.get("meaning"), status=raw.get("status"),
                   fault_sites=list(raw.get("fault_sites") or []),
                   conditions=[Condition.from_raw(c)
                               for c in raw.get("conditions") or []],
                   evidence=[Evidence.from_raw(e)
                             for e in raw.get("evidence") or []],
                   unresolved=raw.get("unresolved"), notes=raw.get("notes"))

    @property
    def code_label(self):
        if self.code is not None:
            return str(self.code)
        return self.code_expr or "computed"

    @property
    def is_bounded_unknown(self):
        return isinstance(self.unresolved, dict) and (
            self.unresolved.get("proven") or self.unresolved.get("unknown"))


@dataclass
class Dispatch:
    kind: Optional[str] = None
    entry_addr: Optional[str] = None
    voff: Optional[object] = None
    extra: dict = field(default_factory=dict)

    @classmethod
    def from_raw(cls, raw):
        if not isinstance(raw, dict):
            return None
        known = {"kind", "entry_addr", "voff"}
        return cls(kind=raw.get("kind"), entry_addr=raw.get("entry_addr"),
                   voff=raw.get("voff"),
                   extra={k: v for k, v in raw.items() if k not in known})


@dataclass
class Implementation:
    calls: list = field(default_factory=list)
    req_vcalls: list = field(default_factory=list)
    impl_function: Optional[str] = None
    impl_vfunc: Optional[str] = None
    description: Optional[str] = None
    engine_status: Optional[str] = None
    engine_impl_func: Optional[str] = None
    notes: Optional[str] = None
    extra: dict = field(default_factory=dict)

    @classmethod
    def from_raw(cls, raw):
        if not isinstance(raw, dict):
            return None
        er = raw.get("engine_resolution") or {}
        known = {"calls", "req_vcalls", "impl_function", "impl_vfunc",
                 "description", "engine_resolution", "notes"}
        return cls(calls=list(raw.get("calls") or []),
                   req_vcalls=list(raw.get("req_vcalls") or []),
                   impl_function=raw.get("impl_function"),
                   impl_vfunc=raw.get("impl_vfunc"),
                   description=raw.get("description"),
                   engine_status=er.get("status"),
                   engine_impl_func=er.get("impl_func"),
                   notes=raw.get("notes"),
                   extra={k: v for k, v in raw.items() if k not in known})


@dataclass
class Action:
    service: str = ""
    control_path: str = ""
    name: str = ""
    description: Optional[str] = None
    summary: Optional[str] = None     # hand-authored client-facing text
    status: Optional[str] = None
    visibility: Optional[str] = None
    reachability: Optional[str] = None
    handler: Optional[str] = None
    req_arg: Optional[str] = None
    dispatch: Optional[Dispatch] = None
    implementation: Optional[Implementation] = None
    inputs: dict = field(default_factory=dict)
    outputs: dict = field(default_factory=dict)
    validation: object = None          # SemanticBlock | str
    requirements: object = None
    state_dependencies: object = None
    side_effects: list = field(default_factory=list)  # SemanticBlock list
    events_triggered: object = None
    state_transitions: object = None
    return_behavior: object = None
    errors: list = field(default_factory=list)
    unresolved: Optional[dict] = None
    fault_sites: list = field(default_factory=list)
    firmware_differences: list = field(default_factory=list)
    evidence: list = field(default_factory=list)
    notes: Optional[str] = None
    implementation_notes: Optional[str] = None
    args_verified_empty: object = None
    extra: dict = field(default_factory=dict)

    KNOWN = {"description", "status", "visibility", "reachability",
             "handler", "handler_func", "req_arg", "dispatch",
             "implementation", "inputs", "outputs", "validation",
             "requirements", "state_dependencies", "side_effects",
             "events_triggered", "state_transitions", "return_behavior",
             "errors", "unresolved", "fault_sites", "firmware_differences",
             "evidence", "notes", "implementation_notes",
             "args_verified_empty", "crossbuild_binary"}

    @classmethod
    def from_raw(cls, service_name, control_path, name, raw):
        raw = raw or {}
        extra = {k: v for k, v in raw.items() if k not in cls.KNOWN}
        if raw.get("crossbuild_binary"):
            extra["crossbuild_binary"] = raw["crossbuild_binary"]
        se = raw.get("side_effects") or []
        return cls(
            service=service_name, control_path=control_path, name=name,
            description=raw.get("description"), status=raw.get("status"),
            visibility=raw.get("visibility"),
            reachability=raw.get("reachability"),
            handler=raw.get("handler") or raw.get("handler_func"),
            req_arg=raw.get("req_arg"),
            dispatch=Dispatch.from_raw(raw.get("dispatch")),
            implementation=Implementation.from_raw(raw.get("implementation")),
            inputs={n: Argument.from_raw(n, a)
                    for n, a in (raw.get("inputs") or {}).items()},
            outputs={n: Argument.from_raw(n, a)
                     for n, a in (raw.get("outputs") or {}).items()},
            validation=SemanticBlock.from_raw(raw.get("validation")),
            requirements=SemanticBlock.from_raw(raw.get("requirements")),
            state_dependencies=SemanticBlock.from_raw(
                raw.get("state_dependencies")),
            side_effects=[SemanticBlock.from_raw(e) for e in se],
            events_triggered=SemanticBlock.from_raw(
                raw.get("events_triggered")),
            state_transitions=SemanticBlock.from_raw(
                raw.get("state_transitions")),
            return_behavior=SemanticBlock.from_raw(raw.get("return_behavior")),
            errors=[ErrorEntry.from_raw(e) for e in raw.get("errors") or []],
            unresolved=raw.get("unresolved"),
            fault_sites=list(raw.get("fault_sites") or []),
            firmware_differences=list(raw.get("firmware_differences") or []),
            evidence=[Evidence.from_raw(e) for e in raw.get("evidence") or []],
            notes=raw.get("notes"),
            implementation_notes=raw.get("implementation_notes"),
            args_verified_empty=raw.get("args_verified_empty"),
            extra=extra)

    @property
    def dispatch_kind(self):
        return (self.dispatch.kind if self.dispatch else None) or "none"

    @property
    def is_stub(self):
        """Dispatched to a reject-all fault stub (removed/dead surface)."""
        if self.dispatch_kind in ("strcmp_stub", "reject-all"):
            return True
        impl = self.implementation
        return bool(impl and impl.description and "reject-all"
                    in impl.description.lower())

    @property
    def is_implemented(self):
        return not self.is_stub

    @property
    def is_hidden_callable(self):
        return self.reachability == "hidden-callable" or (
            self.visibility in ("internal", "hidden"))

    def arg_names(self):
        return set(self.inputs) | set(self.outputs)


@dataclass
class Availability:
    notes: Optional[str] = None
    status: Optional[str] = None
    enabled_source: Optional[dict] = None
    cap_flags: Optional[str] = None
    evidence: list = field(default_factory=list)
    extra: dict = field(default_factory=dict)

    @classmethod
    def from_raw(cls, raw):
        if not isinstance(raw, dict):
            return cls(notes=None)
        known = {"notes", "status", "enabled_source", "cap_flags",
                 "evidence"}
        return cls(notes=raw.get("notes"), status=raw.get("status"),
                   enabled_source=raw.get("enabled_source"),
                   cap_flags=raw.get("cap_flags"),
                   evidence=[Evidence.from_raw(e)
                             for e in raw.get("evidence") or []],
                   extra={k: v for k, v in raw.items() if k not in known})


@dataclass
class EventInfo:
    status: Optional[str] = None
    mechanism: Optional[str] = None
    namespace: Optional[str] = None
    lastchange_var: Optional[str] = None
    lastchange_template: Optional[str] = None
    no_template_note: Optional[str] = None
    wss_event_names: list = field(default_factory=list)
    wss_note: Optional[str] = None
    notify_template: Optional[str] = None
    evidence: list = field(default_factory=list)
    extra: dict = field(default_factory=dict)

    @classmethod
    def from_raw(cls, raw):
        if not isinstance(raw, dict):
            return None
        known = {"status", "mechanism", "namespace", "lastchange_var",
                 "lastchange_template", "no_template_note",
                 "wss_event_names", "wss_note", "notify_template",
                 "evidence"}
        return cls(status=raw.get("status"), mechanism=raw.get("mechanism"),
                   namespace=raw.get("namespace"),
                   lastchange_var=raw.get("lastchange_var"),
                   lastchange_template=raw.get("lastchange_template"),
                   no_template_note=raw.get("no_template_note"),
                   wss_event_names=list(raw.get("wss_event_names") or []),
                   wss_note=raw.get("wss_note"),
                   notify_template=raw.get("notify_template"),
                   evidence=[Evidence.from_raw(e)
                             for e in raw.get("evidence") or []],
                   extra={k: v for k, v in raw.items() if k not in known})


@dataclass
class StateVariable:
    key: str = ""
    service: Optional[str] = None
    name: str = ""
    status: Optional[str] = None
    evented: object = None
    data_type: Optional[str] = None
    description: Optional[str] = None
    accepted_values: object = None
    range: object = None
    related_actions: list = field(default_factory=list)
    form: Optional[str] = None
    template_addr: Optional[str] = None
    emitter: Optional[str] = None
    evidence: list = field(default_factory=list)
    notes: Optional[str] = None
    extra: dict = field(default_factory=dict)

    KNOWN = {"service", "status", "evented", "data_type", "description",
             "accepted_values", "range", "related_actions", "form",
             "template_addr", "emitter", "evidence", "notes"}

    @classmethod
    def from_raw(cls, key, raw, service_name=None):
        raw = raw or {}
        name = key.split(".", 1)[1] if "." in key else key
        return cls(key=key, service=raw.get("service") or service_name,
                   name=name, status=raw.get("status"),
                   evented=raw.get("evented"),
                   data_type=raw.get("data_type"),
                   description=raw.get("description"),
                   accepted_values=raw.get("accepted_values"),
                   range=raw.get("range"),
                   related_actions=list(raw.get("related_actions") or []),
                   form=raw.get("form"),
                   template_addr=raw.get("template_addr"),
                   emitter=raw.get("emitter"),
                   evidence=[Evidence.from_raw(e)
                             for e in raw.get("evidence") or []],
                   notes=raw.get("notes"),
                   extra={k: v for k, v in raw.items()
                          if k not in cls.KNOWN})


@dataclass
class FormatSpec:
    key: str = ""
    kind: str = ""                     # "uri" | "payload"
    status: Optional[str] = None
    description: Optional[str] = None
    format: Optional[str] = None
    fields: list = field(default_factory=list)
    used_by: list = field(default_factory=list)
    evidence: list = field(default_factory=list)
    notes: Optional[str] = None
    extra: dict = field(default_factory=dict)

    KNOWN = {"status", "description", "format", "fields", "used_by",
             "evidence", "notes"}

    @classmethod
    def from_raw(cls, key, kind, raw):
        raw = raw or {}
        return cls(key=key, kind=kind, status=raw.get("status"),
                   description=raw.get("description"),
                   format=raw.get("format"),
                   fields=list(raw.get("fields") or []),
                   used_by=list(raw.get("used_by") or []),
                   evidence=[Evidence.from_raw(e)
                             for e in raw.get("evidence") or []],
                   notes=raw.get("notes"),
                   extra={k: v for k, v in raw.items()
                          if k not in cls.KNOWN})


@dataclass
class FirmwareDifference:
    item: str = ""
    detail: Optional[str] = None
    builds: dict = field(default_factory=dict)
    extra: dict = field(default_factory=dict)


@dataclass
class Capability:
    offset: str = ""
    description: Optional[str] = None
    effect: Optional[str] = None
    status: Optional[str] = None
    loads: list = field(default_factory=list)
    stores: list = field(default_factory=list)
    affected_services: list = field(default_factory=list)
    evidence: list = field(default_factory=list)
    notes: Optional[str] = None


@dataclass
class Service:
    name: str = ""
    control_path: str = ""
    description: Optional[str] = None
    summary: Optional[str] = None     # hand-authored client-facing text
    status: Optional[str] = None
    visibility: Optional[str] = None
    registration: Optional[dict] = None
    availability: Optional[Availability] = None
    object: Optional[dict] = None
    dispatcher: Optional[dict] = None
    actions: dict = field(default_factory=dict)
    state_variables: dict = field(default_factory=dict)
    events: Optional[EventInfo] = None
    errors: list = field(default_factory=list)
    evidence: list = field(default_factory=list)
    notes: object = None
    visibility_note: Optional[str] = None
    impl_files: list = field(default_factory=list)
    impl_return_pattern: Optional[str] = None
    extra: dict = field(default_factory=dict)

    KNOWN = {"name", "control_path", "description", "status", "visibility",
             "registration", "availability", "object", "dispatcher",
             "actions", "state_variables", "events", "errors", "evidence",
             "notes", "visibility_note", "impl_files",
             "impl_return_pattern"}

    @classmethod
    def from_raw(cls, control_path, raw):
        raw = raw or {}
        name = raw.get("name") or control_path.strip("/").split("/")[-1]
        extra = {k: v for k, v in raw.items() if k not in cls.KNOWN}
        return cls(
            name=name, control_path=control_path,
            description=raw.get("description"), status=raw.get("status"),
            visibility=raw.get("visibility"),
            registration=raw.get("registration"),
            availability=Availability.from_raw(raw.get("availability")),
            object=raw.get("object"), dispatcher=raw.get("dispatcher"),
            actions={n: Action.from_raw(name, control_path, n, a)
                     for n, a in (raw.get("actions") or {}).items()},
            state_variables={n: StateVariable.from_raw(n, v, name)
                             for n, v in
                             (raw.get("state_variables") or {}).items()},
            events=EventInfo.from_raw(raw.get("events")),
            errors=[ErrorEntry.from_raw(e) for e in raw.get("errors") or []],
            evidence=[Evidence.from_raw(e)
                      for e in raw.get("evidence") or []],
            notes=raw.get("notes"),
            visibility_note=raw.get("visibility_note"),
            impl_files=list(raw.get("impl_files") or []),
            impl_return_pattern=raw.get("impl_return_pattern"),
            extra=extra)

    @property
    def slug(self):
        s = re.sub(r"(?<=[A-Z])(?=[A-Z][a-z])", "-", self.name)
        s = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "-", s).lower()
        s = {"q-play": "qplay"}.get(s, s)
        parent = self.control_path.strip("/").split("/")[0].lower()
        if s == "connection-manager":
            s += "-" + {"mediarenderer": "renderer",
                        "mediaserver": "server"}.get(parent, parent)
        return s


@dataclass
class Counts:
    """Authoritative count categories. Each is computed from the normalized
    model and cross-checked against meta.counts when the dataset declares
    it."""
    canonical_action_records: int = 0
    unique_action_names: int = 0
    scpd_defined: int = 0
    device_advertised: int = 0
    binary_dispatched: int = 0
    implemented_actions: int = 0
    removed_stale: int = 0
    internal_or_hidden_callable: int = 0
    service_registrations: int = 0
    advertised_services: int = 0


@dataclass
class Model:
    meta: dict = field(default_factory=dict)
    counts: Counts = field(default_factory=Counts)
    services: list = field(default_factory=list)
    global_state_variables: dict = field(default_factory=dict)
    uri_formats: dict = field(default_factory=dict)
    payload_formats: dict = field(default_factory=dict)
    firmware_differences: list = field(default_factory=list)
    firmware_diff_meta: dict = field(default_factory=dict)
    shared_primitives: dict = field(default_factory=dict)
    routing: dict = field(default_factory=dict)
    request_vtable: dict = field(default_factory=dict)
    capabilities: dict = field(default_factory=dict)
    internal_functions: dict = field(default_factory=dict)
    dispatch_candidates: dict = field(default_factory=dict)

    def all_actions(self):
        for s in self.services:
            for a in s.actions.values():
                yield a

    def find_service(self, name):
        return [s for s in self.services if s.name == name]

    def all_state_variables(self):
        out = {}
        for s in self.services:
            for n, sv in s.state_variables.items():
                out["%s.%s" % (s.name, n)] = sv
        for k, sv in self.global_state_variables.items():
            out.setdefault(k, sv)
        return out


# --------------------------------------------------------------------------
# normalization
# --------------------------------------------------------------------------

def _compute_counts(model):
    c = Counts()
    names = []
    for s in model.services:
        c.service_registrations += 1
        if s.visibility == "advertised":
            c.advertised_services += 1
        for a in s.actions.values():
            c.canonical_action_records += 1
            names.append(a.name)
            if a.dispatch is not None:
                c.binary_dispatched += 1
            if a.is_implemented:
                c.implemented_actions += 1
            else:
                c.removed_stale += 1
            if a.visibility == "advertised":
                c.scpd_defined += 1
                if s.visibility == "advertised":
                    c.device_advertised += 1
            elif a.visibility in ("internal", "hidden"):
                c.internal_or_hidden_callable += 1
    c.unique_action_names = len(set(names))
    return c


def normalize(doc, client_text=None):
    """documentation.json dict (+ client_text.json overlay) -> Model IR."""
    m = Model()
    m.meta = doc.get("meta") or {}
    m.routing = doc.get("routing") or {}
    m.request_vtable = doc.get("request_vtable") or {}
    m.shared_primitives = doc.get("shared_primitives") or {}
    m.subsystems = doc.get("subsystems") or {}
    m.internal_functions = doc.get("internal_functions") or {}
    m.dispatch_candidates = doc.get("dispatch_candidates") or {}

    m.services = [Service.from_raw(p, s)
                  for p, s in (doc.get("services") or {}).items()]
    m.services.sort(key=lambda s: (s.name, s.control_path))

    m.global_state_variables = {
        k: StateVariable.from_raw(k, v)
        for k, v in (doc.get("state_variables") or {}).items()}

    m.uri_formats = {k: FormatSpec.from_raw(k, "uri", v)
                     for k, v in (doc.get("uri_formats") or {}).items()}
    m.payload_formats = {k: FormatSpec.from_raw(k, "payload", v)
                         for k, v in
                         (doc.get("payload_formats") or {}).items()}

    fd = doc.get("firmware_differences") or {}
    if isinstance(fd, dict):
        m.firmware_diff_meta = {k: v for k, v in fd.items()
                                if k != "entries"}
        m.firmware_differences = [
            FirmwareDifference(item=e.get("item", ""),
                               detail=e.get("detail"),
                               builds=e.get("builds") or {},
                               extra={k: v for k, v in e.items()
                                      if k not in
                                      ("item", "detail", "builds")})
            for e in fd.get("entries") or []]
    elif isinstance(fd, list):
        m.firmware_differences = [
            FirmwareDifference(item=e.get("item", ""),
                               detail=e.get("detail"),
                               builds=e.get("builds") or {})
            for e in fd]

    m.capabilities = {
        k: Capability(offset=k, description=v.get("description"),
                      effect=v.get("effect"), status=v.get("status"),
                      loads=list(v.get("loads") or []),
                      stores=list(v.get("stores") or []),
                      affected_services=list(
                          v.get("affected_services") or []),
                      evidence=[Evidence.from_raw(e)
                                for e in v.get("evidence") or []],
                      notes=v.get("notes"))
        for k, v in (doc.get("capabilities") or {}).items()}

    m.counts = _compute_counts(m)
    m.client_text_unmatched = _apply_client_text(m, client_text)
    return m


def _apply_client_text(model, overlay):
    """Merge hand-authored summaries from docs/client_text.json onto the IR.

    Returns overlay keys that resolved to no service/action - kept on the
    model so qa() can flag stale authored text loudly.
    """
    unmatched = []
    if not overlay:
        return unmatched
    by_path = {s.control_path: s for s in model.services}
    for path, blk in (overlay.get("services") or {}).items():
        svc = by_path.get(path)
        if svc is None:
            unmatched.append("service %s" % path)
            continue
        if blk.get("summary"):
            svc.summary = blk["summary"]
        for an, txt in (blk.get("actions") or {}).items():
            a = svc.actions.get(an)
            if a is None:
                unmatched.append("%s.%s" % (path, an))
                continue
            if txt:
                a.summary = txt
    return unmatched


# --------------------------------------------------------------------------
# QA -- loud consistency checks on the normalized model
# --------------------------------------------------------------------------

class QaResult:
    def __init__(self):
        self.errors = []
        self.warnings = []

    def error(self, msg):
        self.errors.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)

    @property
    def ok(self):
        return not self.errors


_ARG_NAME_RE = re.compile(r"\b[A-Z][A-Za-z0-9]+\b")
_AARG_RE = re.compile(r"\bA_ARG_TYPE_[A-Za-z0-9_]+\b")
_MAXCHARS_RE = re.compile(r"max(?:imum)?\s+(\d+)\s+char")


def _prose_args(a):
    """Arg-name-shaped tokens used in this action's prose."""
    texts = [a.description or "", a.notes or ""]
    for b in (a.validation, a.requirements, a.state_dependencies,
              a.return_behavior):
        if isinstance(b, SemanticBlock):
            texts.append(b.text or "")
            texts.extend(str(v) for v in b.extra.values()
                       if isinstance(v, str))
        elif isinstance(b, str):
            texts.append(b)
    return set(_ARG_NAME_RE.findall(" ".join(texts)))


def _check_counts(qa, model, api_total=None):
    declared = (model.meta.get("counts") or {})
    computed = model.counts

    def decl_val(key):
        d = declared.get(key)
        return d.get("value") if isinstance(d, dict) else d

    def decl_sub(key, sub):
        d = declared.get(key) or {}
        return d.get(sub, 0) if isinstance(d, dict) else 0

    # actions SCPD-advertised but absent from the dispatch surface have no
    # canonical record; the declared totals include them via sub-counts
    noncanonical = decl_sub("removed_stale", "undispatched")

    pairs = [
        ("canonical_action_records", computed.canonical_action_records, 0),
        ("scpd_defined", computed.scpd_defined, noncanonical),
        ("device_advertised", computed.device_advertised, noncanonical),
        ("binary_dispatched", computed.binary_dispatched, 0),
        ("implemented_actions", computed.implemented_actions, 0),
        ("removed_stale", computed.removed_stale, noncanonical),
        ("internal_or_hidden_callable",
         computed.internal_or_hidden_callable, 0),
    ]
    for key, val, extra in pairs:
        dv = decl_val(key)
        if dv is None:
            continue
        if dv != val + extra:
            qa.error("count contradiction: meta.counts.%s declares %s but "
                     "normalization computes %d (+%d non-canonical)"
                     % (key, dv, val, extra))
    stub_decl = decl_sub("removed_stale", "stub_dispatched")
    if stub_decl and stub_decl != computed.removed_stale:
        qa.error("count contradiction: meta.counts.removed_stale."
                 "stub_dispatched declares %d but %d stub records exist"
                 % (stub_decl, computed.removed_stale))
    if api_total is not None and api_total != computed.implemented_actions:
        qa.error("count contradiction: extractor reports %d dispatched "
                 "actions but the dataset has %d implemented records"
                 % (api_total, computed.implemented_actions))


def _check_arg_prose(qa, model):
    vocab = set()
    for a in model.all_actions():
        vocab |= a.arg_names()
    for a in model.all_actions():
        w = "%s.%s" % (a.service, a.name)
        mentioned = _prose_args(a) & vocab
        if not a.arg_names() and mentioned and not a.args_verified_empty:
            qa.error("%s: action has empty argument model but prose "
                     "references arguments %s" % (w, sorted(mentioned)))
        if not a.arg_names() and a.is_implemented \
                and not a.args_verified_empty:
            qa.warn("%s: implemented action has empty argument model and "
                    "no args_verified_empty marker" % w)


def _check_stale_unresolved(qa, model):
    pat = re.compile(r"\bunresolved\b|\bnot yet resolved\b", re.I)
    for a in model.all_actions():
        impl = a.implementation
        if impl and impl.engine_status == "resolved":
            for t in (impl.notes or "", impl.description or ""):
                if pat.search(t):
                    qa.error("%s.%s: engine_resolution.status is 'resolved' "
                             "but implementation text still says "
                             "unresolved: %r" % (a.service, a.name, t[:80]))
    for addr, c in model.dispatch_candidates.items():
        assess = (c.get("assessment") or "")
        if assess.upper().startswith("RESOLVED") \
                and c.get("status") == "unresolved":
            qa.error("dispatch_candidate %s: assessment says RESOLVED but "
                     "status is still 'unresolved'" % addr)


def _check_types(qa, model):
    for a in model.all_actions():
        for grp in (a.inputs, a.outputs):
            for n, arg in grp.items():
                w = "%s.%s arg %s" % (a.service, a.name, n)
                p = arg.primitive
                tag = p.type_tag if p else None
                fmt = (arg.format or "").lower()
                rng = arg.range
                # int-typed record claiming a free-form string wire format
                # ('decimal text' is legitimate: the record is parsed from
                # decimal lexical form)
                if tag == 4 and isinstance(fmt, str) \
                        and ("utf-8" in fmt or "string" in fmt):
                    qa.warn("%s: type_tag 4 (integer record) but format "
                            "describes text: %r" % (w, arg.format))
                # string-typed record with numeric range object
                if tag == 7 and isinstance(rng, dict) \
                        and {"min", "max"} <= set(rng):
                    qa.warn("%s: type_tag 7 (string) but range is a "
                            "numeric {min,max} object" % w)
                # enum of non-numeric strings on an integer record
                if tag == 4 and isinstance(arg.accepted_values, list) \
                        and any(not re.fullmatch(r"-?\d+", str(v))
                                for v in arg.accepted_values):
                    qa.warn("%s: integer arg lists non-numeric accepted "
                            "values %r" % (w, arg.accepted_values[:5]))
                # buffer capacity vs 'max N chars'
                if p and p.buf_cap and isinstance(rng, str):
                    mm = _MAXCHARS_RE.search(rng)
                    if mm and int(mm.group(1)) + 1 != p.buf_cap:
                        qa.warn("%s: buf_cap %s inconsistent with range %r"
                                % (w, p.buf_cap, rng))


def _check_confidence(qa, model):
    for s in model.services:
        if s.status == "unresolved":
            for a in s.actions.values():
                if a.status == "confirmed":
                    qa.error("service %s is unresolved but action %s is "
                             "confirmed (impossible parent/child confidence)"
                             % (s.name, a.name))
        for a in s.actions.values():
            if a.status in ("unresolved", "inferred"):
                for grp in (a.inputs, a.outputs):
                    for n, arg in grp.items():
                        if arg.status == "confirmed":
                            qa.error("%s.%s arg %s: confirmed child under "
                                     "%s action" % (a.service, a.name, n,
                                                    a.status))
            if a.status == "confirmed":
                # bare-string children have no status; only declared
                # statuses participate (matches lint._weakest_child)
                child_statuses = (
                    [arg.status for g in (a.inputs, a.outputs)
                     for arg in g.values()]
                    + [e.status for e in a.errors]
                    + [b.status for b in
                       (a.validation, a.requirements,
                        a.state_dependencies, a.events_triggered,
                        a.state_transitions, a.return_behavior)
                       if isinstance(b, SemanticBlock) and b.status])
                ranks = [STATUS_RANK.get(x, 2) for x in child_statuses]
                if ranks and min(ranks) < 3:
                    qa.warn("%s.%s: 'confirmed' action contains a weaker "
                            "observable child" % (a.service, a.name))


def _check_duplicates(qa, model):
    seen = {}
    for a in model.all_actions():
        key = (a.control_path, a.name)
        if key in seen:
            qa.error("duplicate action definition: %s %s"
                     % (a.control_path, a.name))
        seen[key] = True
    # same service name under multiple control paths must agree per action
    by_name = {}
    for s in model.services:
        by_name.setdefault(s.name, []).append(s)
    for name, svcs in by_name.items():
        if len(svcs) < 2:
            continue
        common = set.intersection(*[set(s.actions) for s in svcs])
        for an in common:
            recs = [s.actions[an] for s in svcs]
            hs = {r.handler for r in recs}
            if len(hs) > 1:
                qa.error("conflicting definitions of %s.%s across control "
                         "paths: handlers %s" % (name, an, sorted(hs)))


def _check_ownership(qa, model):
    for s in model.services:
        for a in s.actions.values():
            if a.control_path != s.control_path:
                qa.error("service ownership: %s.%s claims control_path %s"
                         % (s.name, a.name, a.control_path))
        for n, sv in s.state_variables.items():
            for ra in sv.related_actions:
                if ra and ra not in s.actions:
                    qa.warn("%s state variable %s: related_action %r not "
                            "an action of this service"
                            % (s.name, n, ra))
    for k, sv in model.global_state_variables.items():
        if sv.service:
            prefix = k.split(".", 1)[0]
            known = {s.name for s in model.services}
            alias = {"RCS": "RenderingControl", "AVT": "AVTransport",
                     "DP": "DeviceProperties", "AC": "AlarmClock",
                     "ZGT": "ZoneGroupTopology", "CM": "ConnectionManager",
                     "GRC": "GroupRenderingControl", "VLI": "VirtualLineIn",
                     "MS": "MusicServices", "CD": "ContentDirectory",
                     "SP": "SystemProperties", "HT": "HTControl",
                     "AI": "AudioIn", "QP": "QPlay", "GM":
                     "GroupManagement", "Q": "Queue"}
            want = alias.get(prefix, prefix)
            if sv.service not in known and sv.service != want:
                qa.warn("global state variable %s: service field %r does "
                        "not match key prefix or any service name"
                        % (k, sv.service))


def _check_crosslinks(qa, model):
    sv_names = set(model.all_state_variables())
    sv_names |= set(model.global_state_variables)
    sv_names |= {k.split(".", 1)[-1] for k in model.global_state_variables}
    for a in model.all_actions():
        texts = []
        for grp in (a.inputs, a.outputs):
            for arg in grp.values():
                texts += [arg.semantic_type or "", arg.notes or "",
                          arg.description or ""]
        blob = " ".join(texts)
        for ref in set(_AARG_RE.findall(blob)):
            if ref not in sv_names:
                svc_svs = set()
                svc = next((s for s in model.services
                            if s.name == a.service
                            and s.control_path == a.control_path), None)
                if svc:
                    svc_svs = set(svc.state_variables)
                if ref not in svc_svs:
                    qa.warn("%s.%s references state variable %s which is "
                            "not declared" % (a.service, a.name, ref))


def _check_fault_coverage(qa, model):
    for a in model.all_actions():
        raw_errs = [{"fault_sites": e.fault_sites, "code": e.code,
                     "code_expr": e.code_expr, "status": e.status,
                     "meaning": e.meaning,
                     "conditions": [{"description": c.description,
                                     "evidence": [vars(ev)
                                                  for ev in c.evidence]}
                                    for c in e.conditions],
                     "evidence": [vars(ev) for ev in e.evidence],
                     "unresolved": e.unresolved}
                    for e in a.errors]
        uncovered, incomplete = doclib._fault_coverage(
            {"fault_sites": a.fault_sites, "errors": raw_errs})
        for site in uncovered:
            qa.error("%s.%s: fault site %s has no error entry"
                     % (a.service, a.name, site))
        for site in incomplete:
            qa.warn("%s.%s: fault site %s error entry incomplete"
                    % (a.service, a.name, site))


def qa(model, api_total=None):
    r = QaResult()
    _check_counts(r, model, api_total)
    _check_arg_prose(r, model)
    _check_stale_unresolved(r, model)
    _check_types(r, model)
    _check_confidence(r, model)
    _check_duplicates(r, model)
    _check_ownership(r, model)
    _check_crosslinks(r, model)
    _check_fault_coverage(r, model)
    for key in getattr(model, "client_text_unmatched", []):
        r.error("client_text key matches no record: %s" % key)
    return r
