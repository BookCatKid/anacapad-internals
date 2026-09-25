# anacapad SOAP/UPnP internals — 86.10-80260 (model 9, Playbar)

Static reverse engineering of `opt/bin/anacapad` (32-bit big-endian PowerPC,
stripped, 17 MB, .text @ 0x100698f8).  All addresses are VAs for this build.
Confirmed = directly observed in code/data; **Hypothesis** = inferred.

Verdict up front: **yes** — the SOAP layer is a generic registry of
name-sorted action tables plus per-service dispatchers, and a fully static
extractor (`extract_soap_api.py`) recovers every service, action, handler
address, most argument names, and the registration/feature-gate data with
zero per-action work and **no SCPD input**.  Run output for this build:
**17 service registrations, 199 actions** (198 table-driven + 1 strcmp
dispatched), all handler addresses resolved.

---

## 1. Request pipeline

```
TCP :1400 (anacapa.conf)          SSL :1443 / :1843 (household)
        |
  HTTP request read + header parse          func @0x105d4ff4
    - matches header names via strncasecmp @0x11098068
    - captures "SOAPACTION:" value          (str @0x10e98d74)
        |
  body read / XML parse                     func @0x105d52e0 (request body processor)
        |
  SOAP service router #1                    func @0x101953c8
    (vfunc of the zone-player server class; reached via vtable
     entry .rodata:0x10e97e24; also has a this-adjusting thunk at
     0x1019580c: addi r3,r3,-0x3a8 ; b 0x101953c8)
    - builds 13-entry service table on stack (records of 20 bytes)
    - per entry: enabled_byte ? strcmp(entry.path, req.path) == 0
      -> call svc_obj->vfunc[8](...)        @0x10195758-0x10195778
    - no match after 13 -> bl 0x1068bc0c    (router #2, see below)
        |
  SOAP service router #2                    func @0x1068bc0c
    - NOT a fallback: a second 4-entry table (16-byte records) for the
      ZonePlayer services: DeviceProperties, GroupManagement,
      SystemProperties, ZoneGroupTopology
    - service objects fetched per record via manager vfuncs:
      *(r3)+0x6c / +0x78 / +0x7c / +0x88  (r3 = ctx+0x3a8 manager member,
      passed by router #1 at the bl)
    - cap_flags ANDed against *(this+0x934) (vs ctx+0xcdc in router #1)
    - same dispatch: svc_obj->vfunc[8]
        |
  per-service action dispatcher             e.g. AVTransport @0x102fa5c4
    (always at service_vptr + 8)
    - binary search of the action table by name  (slwi*4 - slwi*2 = *12 stride)
    - strcmp @0x11098d98 against arg7 (action name)
    - miss -> req->vfunc[0x14](req, 401) then req->vfunc[0x38](req) commit
    - hit  -> member-pointer call: handler(this+adj, req, impl=svc+4)
      impl==NULL -> fault 401 (a second dead-service mechanism)
        |
  action handler                            e.g. Play @0x102f9244
    - fetch in-args:  name str -> r4, req->vfunc[0x1c]/[0x20]/[0x3c]
      (record accessor; returned record consumed by a typed parse helper:
       stores type tag @rec+4, buf @rec+8, capacity @rec+0x10)
    - set out-args:   name str -> r4, req->vfunc[0x24] then a formatter
      helper (emits "0"/"1", "%u", ...)
    - on error:       req->vfunc[0x14](req, code)
    - finish:         req->vfunc[0x38](req)   (serialize + send)
```

Key constants: `401` = Invalid Action (miss path, 17 raise sites),
`402` = Invalid Args (13 sites), `501` = Action Failed.

---

## 2. Data structures (confirmed layouts)

### Service registry record (built on stack by router, 20 bytes)

```
struct ServiceReg {              // 13 entries, stack array at r1+0x18
    Service *obj;          // +0   object inside the big ctx (ctx+0xaa78 etc.)
    char    *path;         // +4   "/MediaRenderer/AVTransport/Control"
    char    *name;         // +8   "AVTransport"
    uint32_t cap_flags;    // +12  ANDed against device-caps word ctx+0xcdc
    uint8_t  enabled;      // +16  runtime byte (const 1, or lbz ctx+0x57xx)
};
```

Extracted (extract_soap_api.py `registration_entries`):

| path | name | flags |
|---|---|---|
| /AlarmClock/Control | AlarmClock | 0x80 |
| /AudioIn/Control | AudioIn | 0x100 |
| /MusicServices/Control | MusicServices | 0x200 |
| /HTControl/Control | HTControl | 0x400 |
| /QPlay/Control | QPlay | 0x800 |
| /MediaRenderer/RenderingControl/Control | RenderingControl | 0x1000 |
| /MediaRenderer/AVTransport/Control | AVTransport | 0x2000 |
| /MediaRenderer/GroupRenderingControl/Control | GroupRenderingControl | 0x4000 |
| /MediaServer/ConnectionManager/Control | ConnectionManager | 0x10 |
| /MediaServer/ContentDirectory/Control | ContentDirectory | 0x20 |
| /MediaRenderer/ConnectionManager/Control | ConnectionManager | 0x40 |
| /MediaRenderer/Queue/Control | Queue | 0x8000 |
| /MediaRenderer/VirtualLineIn/Control | VirtualLineIn | 0x10000 |

Router #2's 4 records (16-byte stride, objects via manager vfunc getters):

| path | name | flags | getter slot |
|---|---|---|---|
| /DeviceProperties/Control | DeviceProperties | 0x1 | +0x6c |
| /GroupManagement/Control | GroupManagement | 0x2 | +0x78 |
| /SystemProperties/Control | SystemProperties | 0x4 | +0x7c |
| /ZoneGroupTopology/Control | ZoneGroupTopology | 0x8 | +0x88 |

`cap_flags` is a power-of-two bit ANDed with the device capability mask at
`ctx+0xcdc` (router #1) / `this+0x934` (router #2).  **Note:** in the
observed code path the flags word gates post-dispatch bookkeeping (the
`"<Svc>.<method>.<rc>"` statistic string appended at 0x101957b0-0x101957e8),
while *reachability* of an entry is gated by `enabled` byte (+16) — e.g.
AudioIn's byte is loaded from `ctx+0x5704`, presumably 0 on line-in-less
models like Playbar.  Most services use `!(ctx+0x571c)` (a booleanized
"disabled" flag written during master init @0x1018dd6c); AlarmClock and
RenderingControl use constant 1.  `ctx+0xcdc` is written from a `strtol`
result during init (0x10199b0c) — a config-parsed capability mask — and
constant 0x2000 at 0x10199ac8.
Whether flags also suppress registration elsewhere is **unresolved**.

### Action table (.rodata, 12-byte records, sorted by name)

```
struct ActionEntry {
    char    *name;          // +0  e.g. "SetAVTransportURI"
    union {
        void (*handler)(Service*, Request*);   // direct function pointer
        uint32_t voff | 1;                     // virtual: vtable byte offset
    } fn;                 // +4
    int32_t  this_adjust; // +8   member-ptr this adjustment (0 in practice)
};
```

Confirmed: AVT dispatcher @0x102fa5c4 computes `mid*12` as
`slwi r10,r30,4 ; slwi r9,r30,2 ; subf` and `lwzx` the name field;
`li r29, 0x2a` (=42) initializes the hi bound.

### Service object / vtable

```
struct Service {
    void **vptr;      // +0  -> .rodata func-ptr array
    ...               // subclass state
};
vptr[0]  slot +0   unknown (dtor?)
vptr[1]  slot +4   unknown
vptr[2]  slot +8   dispatchAction(service, a4, request, a6, action_name)
```

Constructor evidence (MusicServices @0x1073a4b4): `stw vptr,0(r3)` with
vptr=0x10f11d04; vptr+8 = 0x1073a11c = its dispatcher.  The router calls
`lwz r9,0(r3); lwz r9,8(r9); mtctr; bctrl` at 0x1019576c-0x10195778.

### Request/response object (vtable offsets observed)

| offset | role (confirmed by call-site context) |
|---|---|
| +0x08 | parse/validate args; nonzero rc -> fault 402 |
| +0x0c | request property getter / commit variant |
| +0x14 | `sendFault(code)` — emits SOAP-ENV:Fault, UPnPError `<errorCode>` |
| +0x1c | `getInArg(name)` — in-arg record accessor |
| +0x20 | `getInArg(name)` variant accessor (same calling pattern as +0x1c) |
| +0x24 | `getOutArg(name)` — out-arg record accessor (result serialized by formatter helpers) |
| +0x28 | `setOutArg` (string, older path) |
| +0x30 | `setOutArg` (uint/other overload, older path) |
| +0x38 | `commit()/sendResponse()` — always tail-called after dispatch |
| +0x3c | in-arg fetch (alternate) |
| +0x64 | header/prefix read into stack buf (size 8) |

---

## 3. Recovered tables (all confirmed against on-disk SCPDs)

| service | action table | dispatcher | service vptr | actions |
|---|---|---|---|---|
| AVTransport | 0x10eb3018 | 0x102fa5c4 | 0x10eb300c | 42 |
| ContentDirectory | 0x10eb4264 | 0x10307608 | 0x10eb4258 | 16 |
| Queue | 0x10ed19ec | 0x10464268 | 0x10ed19a8 | 11 |
| SystemProperties | 0x10f110f0 | 0x1073186c | 0x10f110a8 | 15 |
| ZoneGroupTopology | 0x10f113dc | 0x10732ff8 | 0x10f113b0 | 8 |
| AlarmClock | 0x10f11580 | 0x10733b44 | 0x10f11530 | 17 |
| ConnectionManager (MR) | 0x10f118d4 | 0x10735574 | 0x10f118bc | 3 |
| DeviceProperties | 0x10f1190c | 0x10735c04 | 0x10f11900 | 27 |
| GroupManagement | 0x10f11a64 | 0x10738308 | 0x10f11a58 | 4 |
| GroupRenderingControl | 0x10f11aa8 | 0x10738c58 | 0x10f11a9c | 6 |
| HTControl | 0x10f11b90 | 0x10739730 | 0x10f11b64 | 8 |
| MusicServices | 0x10f11d1c | 0x1073a11c | 0x10f11d04 | 3 |
| RenderingControl | 0x10f11d88 | 0x1073a784 | 0x10f11d7c | 27 |
| VirtualLineIn | 0x10f11ee0 | 0x1073ccc0 | 0x10f11ed4 | 8 |

Every action-name set matches its `xml/<Svc>1.xml` SCPD 100% — the tables
are exactly the implementation-side action list.  Two dispatch flavors:
`direct` (handler fn ptr, e.g. AVTransport/RenderingControl) and `virtual`
(`voff|1` entries resolved through the service vtable, e.g. the 0x10f11xxx
cluster).

### Special cases

- **QPlay**: hand-rolled strcmp dispatcher @0x1073a4f0 (compares
  "QPlayAuth", "Seed", "MID", "DID" directly); not table-driven.  QPlay1.xml
  advertises exactly QPlayAuth.
- **AudioIn**: registered (path + flag 0x100 + enabled byte ctx+0x5704) but
  the only matching dispatcher in the binary is a **reject-all stub**:
  dispatcher @0x1073d8f8 unconditionally raises fault 401 — no table, no
  name checks.  Its vptr 0x10f11f70 is stored by ctor @0x1073d930 into a
  member of the lazily created audio-subsystem object (*(ctx+0x5714) -
  0x5594, store site 0x1019c22c).  The registration cell ctx+0xaa6c is
  populated from a getter result passed as a stack argument into
  0x102c05d8 — the full inter-procedural chain to the stub is **inferred**,
  not yet proven by the extractor.  Either way `/AudioIn/Control` is a
  registered-but-dead service in this build (every action faults 401) —
  matching `AudioIn1.xml` advertising actions that are not implemented.
- **SpeakerGroup / smartspeaker-audio**: URN strings + strcmp code at
  0x1069f828 are *client-side* (outbound control of satellite devices), not
  a hosted service.
- A third registration layer at 0x1043318c/0x104340c4 pairs each /Control
  path with its `urn:schemas-upnp-org:service:X:1` URN via registrar
  0x1060b688 — service-type provenance, not dispatch.

---

## 4. Hidden / gated actions

- On this build **all extracted actions are in the SCPDs** — the SCPD is a
  complete action list; "hidden" actions in the sense of implemented-but-
  undescribed were *not found*.  Exhaustiveness argument: every dispatcher
  in the binary was found by sweeping for the `li r4,401` +
  `req->vfunc[0x14]` fault signature — exactly 16 dispatchers exist (14
  table + QPlay strcmp + AudioIn reject-all).  A loose `{name,codeptr}`
  table scan at strides 8..24 found no additional action tables, and no
  handler performs literal sub-command dispatch on argument values.
- Runtime-hidden surface instead comes from: (a) the per-entry `enabled`
  byte in the service registry (AudioIn is the poster case — registered
  but reject-all), (b) `cap_flags` vs `ctx+0xcdc`, (c) handlers that
  internally no-op/fault per state.
- Declared-but-dead: `ProvisionCredentialedTrialAccountX` (SCPD-advertised,
  string absent from the binary entirely) and `ResetThirdPartyCredentials`
  (advertised; exists only as the `@ResetThirdPartyCredentials` command
  object, not a dispatchable action).
- Hidden-adjacent actions that *are* in the binary+SCPD but rarely
  documented publicly: `BeginSoftwareUpdate`, `ReportAlarmStartedRunning`,
  `AddBondedZones`, `CreateStereoPair`, `EnterConfigMode`, `EnableRDM`,
  `GetRDM`, `DoPostUpdateTasks`, `NotifyDeletedURI`, `BackupQueue`,
  `SnoozeAlarm`, `AddMultipleURIs`, `StartAutoplay`, `BecomeGroupCoordinator*`,
  `DelegateGroupCoordinationTo`, `ChangeCoordinator`, `RunAlarm`,
  `CreateSavedQueue`, `AddURIToSavedQueue`, `ReorderTracksInSavedQueue`,
  `GetRunningAlarmProperties`.
- The real undocumented surface is **raw HTTP**, not SOAP: a second
  strcmp-chain dispatcher (@0x100aaa04) serves `/reboot`, `/devmode`,
  `/threadinfo`, `/watchdogs`, `/sonos_log?`, `/unlock`, `/devunlock`,
  `/mfgunlock`, `/getrs`, `/getsetting`, `/msprox`, `/ttm_helper`,
  `/spotifyzc`, `/support/*`, `/log` and others on the same listeners.
  Dispatch order: `/log` and `/devmode` first (ungated), then a
  per-connection gate hook (ctx+0x170) must approve `/threadinfo`,
  `/watchdogs`, `/reboot`, `/sonos_log?`, `/unlock`.  The `/unlock` family
  additionally requires the ctx+0x168 handler to be installed on the
  listener; it serves a Serial/Challenge HTML form and POST-checks a
  `2:`-prefixed response, setting a `device_unlocked` byte.

---

## 5. Arguments, validation, state variables, errors

- **Arg names + direction**: recovered per-handler — in-args via
  `req->vfunc[0x1c]/[0x20]/[0x3c]` calls, out-args via `+0x24`; each fetch
  is paired with the following parse/format helper, which yields a type
  tag (rec+4 store) and buffer capacity where the helper sets them.
  138/199 actions have in-arg sites, 83 have out-arg sites.
- **Arg descriptors**: rodata contains small `{char *name, ptr}` records
  (e.g. 0x10ec39a0: InstanceID/Channel/Master/DesiredVolume for
  SetGroupVolume) — arg-name arrays exist, but a uniform
  `{name,direction,type,default,range}` descriptor table was **not**
  confirmed; types/ranges appear enforced inside handlers and generic
  helpers (getArg @+0x1c, helper @0x105614e0) rather than in one table.
  The SCPD XML remains the authoritative type/range/enum source.
- **State variables**: no single registry table identified; eventing strings
  (`VliVolumeProcessingCompleteEvt`, `GroupVolumeSetActionEvent` at
  0x10ec39b4+) exist but var metadata is per-service code.
- **Faults**: `req->vfunc[0x14](code)`; extractor emits per-action fault
  sites with the code or its provenance expression (e.g.
  `vret(impl,+0x18)` = propagated impl return code).  155/199 actions
  have at least one fault site; non-constant codes are labeled with their
  source expression rather than dropped.
- **Response serialization**: handlers write out-args via req vfuncs;
  `+0x38` commits.  Envelope/fault templates live at 0x10eebc90-0x10eebdcc
  (reached via .sdata pointer variables, not direct lis/addi).

---

## 6. What the extractor does / doesn't recover

The v2 extractor is **binary-only**: ELF + dynsym/PLT resolution,
`.eh_frame` FDE function extents augmented with bl-target/prologue/
vtable/rodata seeding and gap starts, a symbolic PPC register/stack
emulator (calls, vcalls via mtctr/bctrl, tail calls, loads/stores,
stmw/lmw, noreturn handling), router-record extraction, constructor→vptr
resolution, dispatcher classification, handler analysis, capability-field
scanning, and an unattached-dispatcher sweep.

**Automatically (high confidence):**
service paths+names+cap flags+enable bytes; every action table; action
names; direct handler addresses; virtual handler resolution via service
vptr; dispatcher addresses+classification (table/strcmp/reject-all);
per-action arg names with direction, type tags, and buffer capacities;
fault sites with constant codes or provenance expressions; per-record
evidence addresses.

**Not static-recoverable (needs runtime or manual work):**
- enabled-byte values and the ctx+0xcdc capability mask (per-model runtime;
  `0xcdc` is written from a `strtol` result — config-driven)
- arg types/ranges/enums beyond type-tag inference (enforcement is in
  code, not tables)
- computed fault codes' numeric values, error *text* mapping (binary uses
  numeric codes)
- exact semantics of request vfuncs — offsets confirmed, names inferred
- the SOAPACTION `"urn:...#Action"` -> action-name split site (upstream of
  the router; capture point confirmed at 0x105d4ff4)
- AudioIn's object chain — ends in an out-param written by a callee;
  the reject-all-stub association is inferred, not proven

## 7. Reproducing

```
python3 sonos-research/anacapad-soap/extract_soap_api.py \
    artifacts/downloads/rootfs-86.10-80260-1-9/opt/bin/anacapad \
    --json sonos-research/anacapad-soap/soap_api-86.10-80260.json
```

Pure stdlib, no external metadata input.  For a new build: point it at the
new `anacapad`; the SCPD XMLs under `opt/htdocs/xml` can be used afterward
to validate (action sets matched 100% on this build).
