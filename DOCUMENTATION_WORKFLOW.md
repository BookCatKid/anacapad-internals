# anacapad SOAP documentation workflow

A repeatable pipeline for reaching 100% semantic documentation coverage of
the SOAP/UPnP surface recovered from the `anacapad` binary.

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
tools/doclib.py                shared model + completeness rules
tools/import_extract.py        extractor JSON -> doc skeletons (never overwrites)
tools/worksheet.py             per-action RE worksheet
tools/validate.py              structural + semantic validation
tools/lint.py                  weak-documentation linter
tools/coverage.py              coverage report
tests/                         unittest suite + synthetic fixture
```

## The workflow

```
1. Run binary extractor.
2. Import structural findings.          python3 tools/import_extract.py
3. Pick one incomplete action.          python3 tools/coverage.py -- see counts
4. Generate worksheet.                  python3 tools/worksheet.py AVTransport Seek
5. Reverse the implementation path (handler -> impl vfunc -> callee).
6. Fill semantic fields in documentation.json for that action.
7. Add evidence records (address + build + status) for every non-obvious claim.
8. Verification pass (see below) BEFORE treating the entry as confirmed.
9. Run validation and coverage.         python3 tools/validate.py
                                        python3 tools/lint.py
                                        python3 tools/coverage.py
10. Repeat.
```

## Verification pass

A first semantic pass produces a *candidate*, not a finished entry. Before
accepting `confirmed` statuses, re-inspect the instruction/dataflow level for
the boundary assumptions that are easy to get wrong on this target:

- **PPC decode traps**: disassembler mnemonics can mislead — `rlwinm rX,rY,0,16,31`
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
  propagated — SOAP success does not mean the streamer accepted the seek).
  Distinguish *request accepted* / *operation submitted* / *operation
  actually succeeded*.
- **Branch-order quirks**: the order of sign checks, zero checks, and
  submission gates creates observable asymmetries (`-00:00:00` faults as
  REL_TIME but is a silent no-op as TIME_DELTA). Preserve the order in the
  docs; do not "clean up" semantics that differ only by check ordering.

## Completeness rules

Every externally relevant object needs at least one meaningful sentence.
"Meaningful" is enforced: placeholder text and identifier-echo
(`"Seek action"`, `"The volume"`, `"TODO"`, `"unknown"`) are rejected by
both the validator and the linter.

**Null means unassessed.** To mark a field as checked-but-empty use an
explicit sentinel: `"none"`, `"n/a"`, `"unconstrained"`, `"any"`,
`"unbounded"`. An empty list `[]` counts as unassessed — write `"none"`.

Unresolved is a first-class state, not a failure. An unresolved entry must
state what is **proven**, what is still **unknown**, and carry the evidence
(address) to resume from.

### Object-level requirements

| Object | Complete when |
|---|---|
| service | description, availability notes (what the enabled byte/flags mean), evidence |
| action | description; visibility classified (`advertised`/`hidden`/`internal`; hidden requires `reachability`); every discovered input & output complete; every fault site covered by an `errors` entry; `requirements`, `state_dependencies`, `side_effects`, `events_triggered`, `state_transitions`, `return_behavior`, `validation` all assessed; action-level evidence present |
| argument | description; `required` set (true/false/`"conditional"`); `semantic_type`, `format`, `accepted_values`, `range`, `special_values`, `default`, `validation`, `unit` all assessed |
| error entry | either resolved: `meaning` + ≥1 `conditions[]` each with description+evidence; or `status:"unresolved"` with `unresolved.proven` and `unresolved.unknown` filled + evidence |
| capability field | description + `effect` (what it gates) |
| internal function | only counted when `required_for_behavior:true`; needs description + `why_external` |
| dispatch candidate | `assessment` written (dispatcher? dead stub? unrelated?) + status ≠ unresolved |
| state variable | description + `data_type` + `evented` |

Statuses: `confirmed` (binary/hardware proves it), `strong` (strong
inference), `inferred` (heuristic), `unresolved`. Lint flags
`confirmed`/`strong` claims that carry no evidence records. Never silently
upgrade inferred facts.

Evidence records carry `type` (`firmware`, `live_test`, `network_capture`,
`runtime_trace`, `device_observation`), `binary`, `build`, `function`,
`address`, `callsite`, `notes`, `status`.

## What the importer owns vs. what you own

The importer refreshes **machine-owned** fields every run and never
overwrites human text:

- machine-owned: `handler`, `handler_func`, `dispatch`, `implementation`,
  `req_vcalls`, `fault_sites`, argument `primitive`, `registration`,
  `object`, `dispatcher`, `availability.enabled_source`/`cap_flags`,
  capability `loads`/`stores`, dispatch-candidate fields, `meta`,
  `routing`, `request_vtable`
- human-owned: `description`, `meaning`, `conditions`, `requirements`,
  `side_effects`, `semantic_type`, `visibility`, `status`, `notes`, ...

Fault sites are auto-covered by skeleton `errors` entries; matching is by
`fault_sites` membership, so a human-written entry that lists the site is
never duplicated. Doc objects that no longer exist in extractor output are
flagged `STALE` by lint, never deleted.

## Coverage

`coverage.py` reports discovered-vs-documented per category and an overall
percentage computed as (complete units)/(all units), where a unit is one
service, action, argument, fault path, capability field, dispatch
candidate, required internal function, or declared state variable.

## Internal functions

Only helpers that materially explain *externally observable* protocol
behavior need docs: argument parsers/formatters (auto-seeded from
extraction as `required_for_behavior:true`), shared URI/metadata parsers,
coordinator/state validators, error-translation functions, capability
checkers, queue mutators. Allocators, thunks, logging, libc wrappers: mark
`required_for_behavior:false` or leave undeclared.

### Shared primitives

Some internals are worth characterizing *once, globally* because many
actions converge on them — document them in `internal_functions` /
`payload_formats` and reference rather than re-derive per action:

- `f_102ab830` — the `SonosSeekTime` parser (declared in `payload_formats`).
- `f_102587b4` / `f_10258ab0` — media-item capability mask derivation
  (Seek tests bits `0x400000`/`0x200000`); bit semantics reused across
  transport actions.
- `engine+0x4654` — source-mode enum `{0,1,2}` selecting indexed vs stream
  behavior; several actions likely branch on it. If two or more actions
  prove to depend on it, pause and reverse the enum's writers once rather
  than rediscovering it per action.

## Example

`docs/worksheet-AVTransport-Seek.txt` is a real generated worksheet — all
structure from the binary, semantics left unresolved.

## Testing

```
python3 -m unittest discover -s tests -v
```
