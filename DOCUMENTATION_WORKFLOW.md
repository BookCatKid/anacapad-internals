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
8. Run validation and coverage.         python3 tools/validate.py
                                        python3 tools/lint.py
                                        python3 tools/coverage.py
9. Repeat.
```

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

## Example

`docs/worksheet-AVTransport-Seek.txt` is a real generated worksheet — all
structure from the binary, semantics left unresolved.

## Testing

```
python3 -m unittest discover -s tests -v
```
