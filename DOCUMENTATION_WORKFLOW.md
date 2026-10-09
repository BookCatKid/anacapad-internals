# anacapad documentation workflow

A repeatable pipeline for exhaustively documenting the SOAP/UPnP surface
recovered from the `anacapad` binary.

Source of truth for behavior: **the binary**. Extractor output supplies
structural facts (addresses, names, dispatch, fault sites); humans/agents
supply semantics. SCPD XML or third-party docs may only *validate* results,
never fill semantic gaps.

## Layout

```
extract_soap_api.py            binary-only structural extractor
soap_api-86.10-80260.json      extractor output (structure + evidence)
docs/documentation.schema.json contract for documentation.json
docs/documentation.json        the documentation database (generated + human)
docs/client_text.json          hand-authored client-facing summaries overlaid
                               on services/actions at generation time (never
                               replaces the technical description fields)
tools/doclib.py                shared model + completeness rules
tools/import_extract.py        extractor JSON -> doc skeletons (never overwrites)
tools/worksheet.py             per-action RE worksheet
tools/validate.py              structural + semantic validation
tools/lint.py                  weak-documentation linter
tools/genmodel.py              normalized generator IR + consistency QA
tools/gendocs.py               Markdown reference renderer (consumes the IR;
                               also renders artifacts/*.md from
                               docs/artifacts.json and muse/spec-streams.md
                               from docs/muse_spec_streams.json)
tools/extract_artifacts.py     copies manifest files from an unpacked rootfs
                               into reference/public/files/
                               (ANACAPAD_ROOTFS env var), refreshing
                               size/sha256/kind in the manifest
tools/gensite.py               VitePress site build wrapper
reference/.vitepress/config.mts  site config (title, sidebar, search,
                               markdown rules); VitePress evaluates it
                               at build time
reference/                     generated Markdown reference tree
site/                          generated static HTML site
tests/                         unittest suite + synthetic fixture
```

## The workflow

```
1. Run binary extractor.
2. Import structural findings.          python3 tools/import_extract.py
3. Pick one record from the open-work list
   (reference/subsystems/open-work.md).
4. Generate worksheet.                  python3 tools/worksheet.py AVTransport Seek
5. Reverse the implementation path (handler -> impl vfunc -> callee).
6. Fill semantic fields in documentation.json for that action.
7. Add evidence records (address + build + type) for every non-obvious claim.
8. Verification pass (see below) BEFORE treating the entry as finished.
9. Remove or narrow the record's `todo` only when the remaining work in it
   is actually done; otherwise update the `todo` text to reflect the new
   residual.
10. Run validation.                     python3 tools/validate.py
                                        python3 tools/lint.py
11. Repeat.
```

## Verification pass

A first semantic pass produces a *candidate*, not a finished entry. Before
calling a claim proven, re-inspect the instruction/dataflow level for
the boundary assumptions that are easy to get wrong on this target:

- **PPC decode traps**: disassembler mnemonics can mislead; for example,
  `rlwinm rX,rY,0,16,31`
  renders as a shift-like op but is `rY & 0xffff`; `cmplwi` immediates are
  *zero*-extended (`0xFFFD`, not a negative); `bc bo=4/5` vs `bo=12/13` flip
  branch polarity on the same CR bit. Decode raw words at every validation
  boundary, mask, and range check.
- **Validate-vs-normalize order**: note whether a range check runs on the raw
  parsed value or a truncated/masked copy. The two produce different accepted
  lexical ranges (Seek TRACK_NR: check is on the raw `strtol` result).
- **Out-params via stack slots**: callers pass `&sp+N`; a `stbu`-computed
  pointer can alias what looks like an unrelated byte read. Trace which bytes
  a callee actually writes before reading meaning into a post-call load.
- **Return-convention splits**: a callee's byte/int result may go to an
  out-param while the return register carries only "dispatched" status
  (Seek's stream path: the session vfunc's result byte is logged, not
  propagated, so SOAP success does not mean the streamer accepted the seek).
  Distinguish *request accepted* / *operation submitted* / *operation
  actually succeeded*.
- **Branch-order quirks**: the order of sign checks, zero checks, and
  submission gates creates observable asymmetries (`-00:00:00` faults as
  REL_TIME but is a silent no-op as TIME_DELTA). Preserve the order in the
  docs; do not "clean up" semantics that differ only by check ordering.

## Documentation rules

Every externally relevant object needs at least one meaningful sentence.
"Meaningful" is enforced: placeholder text and identifier-echo
(`"Seek action"`, `"The volume"`, `"TODO"`, `"unknown"`) are rejected by
both the validator and the linter.

**Null means unassessed.** To mark a field as checked-but-empty use an
explicit sentinel: `"none"`, `"n/a"`, `"unconstrained"`, `"any"`,
`"unbounded"`. An empty list `[]` counts as unassessed; write `"none"`.

### Field requirements per object

These are the fields each object must populate (the validator and linter
enforce them). They describe what a record must *contain*, not whether it
is *finished*; see the completeness rule below.

| Object | Required fields |
|---|---|
| service | description, availability notes (what the enabled byte/flags mean), evidence |
| action | description; visibility classified (`advertised`/`hidden`/`internal`; hidden requires `reachability`); every discovered input & output documented; every fault site covered by an `errors` entry; `requirements`, `state_dependencies`, `side_effects`, `events_triggered`, `state_transitions`, `return_behavior`, `validation` all assessed; action-level evidence present |
| argument | description; `required` set (true/false/`"conditional"`); `semantic_type`, `format`, `accepted_values`, `range`, `special_values`, `default`, `validation`, `unit` all assessed |
| error entry | `meaning` + at least one `conditions[]` entry with description+evidence, or an `unresolved` block stating `proven` and `unknown` + evidence |
| capability field | description + `effect` (what it gates) |
| internal function | only counted when `required_for_behavior:true`; needs description + `why_external` |
| dispatch candidate | `assessment` written (dispatcher? dead stub? unrelated?) |
| state variable | description + `data_type` + `evented` |

## Completeness and the `todo` field

A record is finished only when **everything recoverable from the available
binaries for that record has actually been reversed and documented**. The
rule:

- If any recoverable semantic detail is still unknown, untraced, inferred,
  only structurally mapped, or otherwise incomplete, the record carries a
  `todo` field.
- A record has no `todo` only when its recoverable content is exhausted.
- Proven binary/static impossibilities (a dead dispatcher, a removed
  feature, a fault path that cannot exist) are recorded as explicit
  limitations in the record's prose and need no actionable `todo` once
  the impossibility itself is demonstrated.

Every `todo` states three things:

1. what the record already establishes,
2. exactly what remains unknown,
3. the concrete reverse-engineering work needed to close it.

A `todo` is a string or a list of strings; never a bare `TODO` and never
generic boilerplate. Narrow or remove a `todo` only when the work it names
is actually done; update the text whenever analysis narrows the residual.

### User-facing rendering

Each record renders its `todo` next to its evidence, and
`subsystems/open-work.md` collects every `todo` automatically into a work
queue grouped by record kind. `TodoPolicyTests` enforces the contract:
records with structured unknowns must carry a `todo`, `todo` text may not
be generic, and the open-work page must collect every outstanding `todo`.

Evidence records carry `type` (`firmware`, `live_test`, `network_capture`,
`runtime_trace`, `device_observation`), `binary`, `build`, `function`,
`address`, `callsite`, `notes`.

## What the importer owns vs. what you own

The importer refreshes **machine-owned** fields every run and never
overwrites human text:

- machine-owned: `handler`, `handler_func`, `dispatch`, `implementation`,
  `req_vcalls`, `fault_sites`, argument `primitive`, `registration`,
  `object`, `dispatcher`, `availability.enabled_source`/`cap_flags`,
  capability `loads`/`stores`, dispatch-candidate fields, `meta`, `routing`
- seeded-then-human-owned: `request_vtable` is initially seeded by extraction,
  then preserved once the concrete request interface/lifetime has been manually
  reverse engineered; later imports must not overwrite that semantic record
- human-owned: `description`, `meaning`, `conditions`, `requirements`,
  `side_effects`, `semantic_type`, `visibility`, `todo`, `notes`, ...

Fault sites are auto-covered by skeleton `errors` entries; matching is by
`fault_sites` membership, so a human-written entry that lists the site is
never duplicated. Doc objects that no longer exist in extractor output are
flagged `STALE` by lint, never deleted.

## Open-work inventory

`reference/subsystems/open-work.md` is generated with the docs and
collects every record that still carries a `todo`, grouped by record
kind. It is the work queue: closing a record's open items means editing
its `todo` away, and the next regeneration drops it from the page.

## Generating reference docs

`gendocs.py` renders `reference/` from `documentation.json`. It never reads
the raw JSON directly: `genmodel.normalize()` first maps every object into a
stable typed IR (`Service`, `Action`, `Argument`, `Error`, `StateVariable`,
`Event`, `Availability`, `FirmwareDifference`, `Format`, `Evidence`,
`Dispatch`, `Implementation`, `SemanticBlock`). Uncertainty survives
normalization: `unresolved` blocks, bounded unknowns, `removed/stale`
records, hidden-callable reachability, runtime-bound error domains and
firmware/model diffs are all first-class IR state and must be visible in the
output.

Every service and action carries two prose layers. `docs/client_text.json`
holds hand-authored, client-facing `summary` text keyed by control path and
action name; `normalize()` merges it onto `Service.summary`/`Action.summary`
and the renderer prints it first. The technical `description` field stays
intact and renders immediately afterwards labelled "Technical description".
Overlay keys that resolve to no record are QA errors, so the authored layer
cannot silently drift when the dataset changes. Write summaries for the
reader implementing a client (what it does, argument semantics, quirks);
never delete technical detail to make prose read better.

Generation doubles as a consistency QA pass (`genmodel.qa()`):

- declared `meta.counts` vs normalized-record counts (the declared totals
  may legitimately include non-canonical SCPD advertisements; see
  `meta.counts.removed_stale.undispatched` and `meta.terminology`)
- extractor action totals vs documented implemented records
- duplicated or conflicting action definitions across same-named services
- prose that references arguments absent from the argument model
- implementation text saying "unresolved" after an engine was resolved
- `type_tag`/`format`/`buf_cap` mismatches
- state-variable `related_action` links and argument/state-variable
  cross-links

Errors abort generation; warnings (e.g. SystemProperties state variables
whose SCPD `related_action` names a removed action) print but do not fail:
they preserve real staleness rather than hiding it.

```
python3 tools/gendocs.py            # regenerate reference/ + QA report
python3 tools/gensite.py            # regenerate site/ (VitePress build)
npm run docs:preview                # serve the built site locally
```

`gensite.py` wraps `npm run docs:build` (VitePress). The site config lives
in `reference/.vitepress/config.mts`; the sidebar is discovered from
the reference tree at config-eval time (services under `soap/`, muse
resource pages under `muse/resources/`, and so on), so new generated
pages are picked up automatically. Requires a one-time Node setup:

```
npm install
```

The site build is a second QA layer on the generated Markdown: broken
links and other doc defects fail the build.

Terminology for counts lives in `meta.terminology`/`meta.counts`:
`device_advertised` vs `scpd_defined` vs `binary_dispatched` vs
`removed_stale` vs `canonical_action_records` are distinct sets; do not
collapse them (SCPD can advertise actions with no dispatch record).

## Internal functions

Only helpers that materially explain *externally observable* protocol
behavior need docs: argument parsers/formatters (auto-seeded from
extraction as `required_for_behavior:true`), shared URI/metadata parsers,
coordinator/state validators, error-translation functions, capability
checkers, queue mutators. Allocators, thunks, logging, libc wrappers: mark
`required_for_behavior:false` or leave undeclared.

### Shared primitives

Some internals are worth characterizing *once, globally* because many
actions converge on them: document them in `internal_functions` /
`payload_formats` and reference rather than re-derive per action:

- `f_102ab830`: the `SonosSeekTime` parser (declared in `payload_formats`).
- `f_102587b4` / `f_10258ab0`: media-item capability mask derivation
  (Seek tests bits `0x400000`/`0x200000`); bit semantics reused across
  transport actions.
- `engine+0x4654`: source-mode enum `{0,1,2}` selecting indexed vs stream
  behavior; several actions likely branch on it. If two or more actions
  prove to depend on it, pause and reverse the enum's writers once rather
  than rediscovering it per action.

## Example

`docs/worksheet-AVTransport-Seek.txt` is a real generated worksheet: all
structure from the binary, semantics left unresolved.

## Testing

```
python3 -m unittest discover -s tests -v
```
