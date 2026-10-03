# `ZoneGroupTopology` `/ZoneGroupTopology/Control`

**visibility** `advertised`

This service keeps track of the household's shape: which speakers exist, which rooms they're in, and how they're grouped. The zone-group state it serves is the master map of the whole Sonos system, covering every player, its name, its group membership, and its coordinator. On top of the map-reading commands, it carries system-level operations: checking for and starting software updates, reporting a speaker that has gone unresponsive, submitting diagnostic bundles to Sonos, and alarm bookkeeping. Think of it as the service that answers 'what does my Sonos system look like right now', plus the fleet-maintenance commands.

**TODO:** Established: the service's action surface, dispatch records, and state variables are fully documented.
**TODO:** Still unknown: ZGS emission and update-trigger handlers are mapped; the impl objects and the mobile-device registration semantics are untraced.
**TODO:** Next step: resolve the impl functions behind each action's handler and record them per action.

::: details Technical details

Zone-group topology service: group membership state, attributes, software update and diagnostics reporting.

:::

## Availability

- capability flags `0x8`
- enabled gate: `*(r2+0xffff8ff8)` at `0x1068bc70` (field)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x1068bc0c`, cap flags `0x8`
- dispatcher `0x10732ff8` kind `table`
- action table `0x10f113dc`

## Actions

| Action | Visibility | Reachability | Dispatch | Error codes |
|---|---|---|---|---|
| `BeginSoftwareUpdate` | advertised | callable | virtual | 402 |
| `CheckForUpdate` | advertised | callable | virtual | 402, 801 |
| `GetZoneGroupAttributes` | advertised | callable | virtual | 402, 501 |
| `GetZoneGroupState` | advertised | callable | virtual | 402, 501 |
| `RegisterMobileDevice` | advertised | callable | virtual |  |
| `ReportAlarmStartedRunning` | advertised | callable | virtual | 402, 501 |
| `ReportUnresponsiveDevice` | advertised | callable | virtual | 402 |
| `SubmitDiagnostics` | advertised | callable | virtual | 402, 1000 |

### `BeginSoftwareUpdate`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Starts a firmware update on the player. It downloads the update package from the given address and applies it, with flags and options controlling how. This is what the system sends when you tap 'update' in the app and the rollout reaches this speaker.

**TODO:** Established: virtual dispatch to handler 0x10733140; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10733140, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Kicks off a software update from UpdateURL with Flags/ExtraOptions via impl->v\[+0xc\] on the svc+4 member.

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `UpdateURL` | SonosUriArg | yes | any string accepted at parse; version/updateID substrings are truncated at first char outside ".-_" / "+-_/" respectively / max 1024 chars | none - required argument |
| `Flags` | SonosStringArg | yes | not range-checked in impl wrapper / length-bounded by parse-helper buffer cap | none - required argument |
| `ExtraOptions` | SonosStringArg | yes | any string / max 127 chars | none - required argument |

- **`UpdateURL`**: URL fetched into the parsed-arg set; the impl pulls system_version/updateID keys and submits to the update worker
  - validation: parsed by request layer; impl sanitizes silently (truncation, no fault) at f_107413c8
  - buffer cap: `0x401`
- **`Flags`**: numeric/flag arg parsed by request layer, forwarded to update worker f_107412ec
  - validation: request-layer parse only
  - buffer cap: `0x18`
- **`ExtraOptions`**: optional options string forwarded to update worker
  - validation: request-layer parse only
  - buffer cap: `0x80`

::: details Technical analysis

#### Validation

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
::: details Evidence (1)

- @ 0x10733140; wrapper decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1)
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733140; req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): none - impl works on req/inline members only
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): none - impl works on req/inline members only.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733140; member vfunc calls: \[\]

:::


#### Side effects

- impl delegates op internally (no member vfunc call captured); arg-driven, stores=1
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - impl delegates op internally (no member vfunc call captured); arg-driven, stores=1.
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): none
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): none.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733140; no transition-literal/store pattern; member delegates: \[\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733140; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733140; commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; parse/req-layer; sites: 0x10733228).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
UpdateURL does not begin with "http" (strncasecmp 4) -> 402 with detail "Update URL is malformed"; on http-URL the request delegates to launcher f_1073f1c8 (rc forwarded verbatim) | Wrapper parse layer rejected an argument before the impl call.

- strncasecmp(UpdateURL,"http",4)!=0 in worker f_107412ec
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

launcher f_1073f1c8 performs external-update hook (write+exec); its rc is forwarded verbatim and not statically bounded - operation-submitted semantics, not guaranteed success



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10733140`
- dispatch entry `0x10f113dc` (voff `16`)
- impl call `0x107332b8` obj `*(r3-in+0x4)` slot `12` arg4 `sp+0xa8`
- req vcall `0x10733208` slot `8` (parse)
- req vcall `0x10733284` slot `64` (other)
- req vcall `0x107332d4` slot `12` (commit)

- fn 0x10733140 @ 0x10733140; action wrapper handler
- @ 0x10f113dc; action dispatch table entry

:::

### `CheckForUpdate`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Asks whether a firmware update is available. It queries the update channel (or the local cache if asked) for a newer version and returns details of what it found. This is the payload behind the 'check for updates' button.

**TODO:** Established: virtual dispatch to handler 0x1073331c; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x1073331c, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Checks update availability (UpdateType, CachedOnly, Version) and returns UpdateItem via impl->v\[+0x8\] on the doubly-indirect member.

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `UpdateType` | SonosStringArg | yes | "Software" is the only accepted value (mismatch -> 402) / max 127 chars | none - required argument |
| `CachedOnly` | SonosStringArg | yes | not impl-checked / length-bounded by parse-helper buffer cap | none - required argument |
| `Version` | SonosStringArg | yes | not impl-checked / max 64 chars | none - required argument |

- **`UpdateType`**: update-type string; impl strcmp vs literal "Software"
  - validation: impl-level strcmp at 0x10752c80
  - buffer cap: `0x80`
- **`CachedOnly`**: flag parsed by request layer, passed to worker f_10752adc
  - validation: request-layer parse only
  - buffer cap: `0x18`
- **`Version`**: version string forwarded to worker f_10752adc
  - validation: request-layer parse only
  - buffer cap: `0x41`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `UpdateItem` | SonosStringArg | populated from impl+0x5ec state / length-bounded by parse-helper buffer cap |

- **`UpdateItem`**: update record emitted on success by the worker path
  - special values: empty when no pending update record
  - validation: emitted on success

::: details Technical analysis

#### Validation

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
::: details Evidence (1)

- @ 0x1073331c; wrapper decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×3, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x8\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×3, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1073331c; req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x8\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1073331c; member vfunc calls: \['*(r30+4) v\[+0x8\]'\]

:::


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x8\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: *(r30+4) v\[+0x8\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x8\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1073331c; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x8\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1073331c; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1073331c; commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; parse/req-layer; sites: 0x107333e8).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
UpdateType arg != "Software" (strcmp in impl) | Wrapper parse layer rejected an argument before the impl call.

- UpdateType arg != "Software" (strcmp in impl)
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** topology impl rc surfaced
**Bounded unknown (unresolved):** codes for validation/state failures

**`801`**

Software update requested but capability flag impl+0x5f4 clear (feature-gated)

- type=="Software" and *(impl+0x5f4)==0



:::

::: details Implementation & reverse-engineering evidence

- handler `0x1073331c`
- dispatch entry `0x10f113e8` (voff `12`)
- impl call `0x1073343c` obj `*(*(sp-0xcf0+0xce8)+0x4)` slot `8` arg4 `sp+0x5c`
- impl call `0x10733478` obj `vret(*(sp-0xcf0+0xcec),+0x24)` slot `16` arg4 `sp+0xdc`
- impl call `0x1073348c` obj `*(sp-0xcf0+0xcec)` slot `12` arg4 `?`
- req vcall `0x107333c8` slot `8` (parse)

- fn 0x1073331c @ 0x1073331c; action wrapper handler
- @ 0x10f113e8; action dispatch table entry

:::

### `GetZoneGroupAttributes`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Reports this speaker's zone-group identity fields: the descriptive attributes of its place in the household topology, meaning its name, icon, and grouping-related properties.

**TODO:** Established: virtual dispatch to handler 0x10733878; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10733878, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Returns zone-group identity fields. Wrapper calls impl->v\[+0x34\] on r4-in; extra capability checks precede the emit path (a 402 fault fires when the inner call returns 0).

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentZoneGroupName` | SonosBoolArg | live value / {0,1} |
| `CurrentZoneGroupID` | SonosStringArg | live value / length-bounded by parse-helper buffer cap |
| `CurrentZonePlayerUUIDsInGroup` | SonosBoolArg | live value / {0,1} |
| `CurrentMuseHouseholdId` | SonosBoolArg | live value / {0,1} |

- **`CurrentZoneGroupName`**: zone-group name string serialized from impl+0x5a8 state under topology lock
  - special values: empty string when the corresponding impl member is unset
  - validation: emitted on success only (impl rc==0); 501 when serializer flag clear
- **`CurrentZoneGroupID`**: zone-group ID string serialized under topology lock
  - special values: empty string when the corresponding impl member is unset
  - validation: emitted on success only (impl rc==0); 501 when serializer flag clear
- **`CurrentZonePlayerUUIDsInGroup`**: topology attribute serialized under impl+0x318 lock
  - special values: empty string when the corresponding impl member is unset
  - validation: emitted on success only (impl rc==0); 501 when serializer flag clear
- **`CurrentMuseHouseholdId`**: household ID string serialized under topology lock
  - special values: empty string when the corresponding impl member is unset
  - validation: emitted on success only (impl rc==0); 501 when serializer flag clear

::: details Technical analysis

#### Validation

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
::: details Evidence (1)

- @ 0x10733878; wrapper decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (out-arg store×4, raise-fault×1, out-arg write×4, validate×1, commit×1); member delegates: r4 v\[+0x34\], *(r29+4) v\[+?\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (out-arg store×4, raise-fault×1, out-arg write×4, validate×1, commit×1); member delegates: r4 v\[+0x34\], *(r29+4) v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x10733878; req-vfunc call map: {'0x8': 1, '0x14': 1, '0x24': 4, '0x10': 4, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0x34\], *(r29+4) v\[+?\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0x34\], *(r29+4) v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x10733878; member vfunc calls: \['r4 v\[+0x34\]', '*(r29+4) v\[+?\]'\]

:::


#### Side effects

- read-only query delegate: r4 v\[+0x34\], *(r29+4) v\[+?\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r4 v\[+0x34\], *(r29+4) v\[+?\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
  - **TODO:** Next step: resolve that target and re-derive this section's semantics.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x34\], *(r29+4) v\[+?\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x34\], *(r29+4) v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x10733878; no transition-literal/store pattern; member delegates: \['r4 v\[+0x34\]', '*(r29+4) v\[+?\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733878; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733878; commit/fault slot usage: {'0x8': 1, '0x14': 1, '0x24': 4, '0x10': 4, '0xc': 1}

:::


#### Errors

**`501`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret; sites: 0x10733878).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
attribute serialization not-ready flag - impl returns 0x1f5

- attribute serialization not-ready flag - impl returns 0x1f5

**`402`**

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
topology rc domain adds {800} via zgt worker

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10733878`
- dispatch entry `0x10f113f4` (voff `36`)
- impl call `0x107338b8` obj `r4-in` slot `52` arg4 `r4-in`
- impl call `0x107338ec` obj `r4-in` slot `8` arg4 `?`
- impl call `0x1073390c` obj `r4-in` slot `20` arg4 `402`
- impl call `0x10733990` obj `*(*(sp-0xb80+0xb74)+0x4)` slot `36` arg4 `sp+0x36c`
- impl call `0x107339c8` obj `vret(*(sp-0xb80+0xb7c),+0x24)` slot `16` arg4 `sp+0x36c`
- impl call `0x107339f8` obj `vret(*(sp-0xb80+0xb7c),+0x24)` slot `16` arg4 `sp+0x76c`
- impl call `0x10733a28` obj `vret(*(sp-0xb80+0xb7c),+0x24)` slot `16` arg4 `sp+0x4c`
- impl call `0x10733a58` obj `vret(*(sp-0xb80+0xb7c),+0x24)` slot `16` arg4 `sp+0x14`
- req vcall `0x10733a6c` slot `12` (commit)

- fn 0x10733878 @ 0x10733878; action wrapper handler
- @ 0x10f113f4; action dispatch table entry

:::

### `GetZoneGroupState`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Returns the full map of the household: the complete zone-group state covering every player the system knows, its room name, which group it belongs to, and who leads each group. This one call is how apps render the whole multi-room view, and it is also the state that updates (and re-announces) whenever rooms join or leave groups.

**TODO:** Established: virtual dispatch to handler 0x10732ed8; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10732ed8, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Serializes the full zone-group state XML via impl->v\[+0x28\] on the doubly-indirect member.

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `ZoneGroupState` | SonosBoolArg | serialized XML / {0,1} |

- **`ZoneGroupState`**: full ZoneGroupState XML document serialized by f_10743328 under the impl+0x318 topology lock; builder flag gates 501
  - validation: emitted on success; impl returns 501 if builder flag clear

::: details Technical analysis

#### Validation

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
::: details Evidence (1)

- @ 0x10732ed8; wrapper decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, validate×1, commit×1); member delegates: r4 v\[+0x3c\], *(r30+4) v\[+0x28\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, validate×1, commit×1); member delegates: r4 v\[+0x3c\], *(r30+4) v\[+0x28\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732ed8; req-vfunc call map: {'0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0x3c\], *(r30+4) v\[+0x28\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0x3c\], *(r30+4) v\[+0x28\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732ed8; member vfunc calls: \['r4 v\[+0x3c\]', '*(r30+4) v\[+0x28\]'\]

:::


#### Side effects

- read-only query delegate: r4 v\[+0x3c\], *(r30+4) v\[+0x28\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r4 v\[+0x3c\], *(r30+4) v\[+0x28\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x3c\], *(r30+4) v\[+0x28\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x3c\], *(r30+4) v\[+0x28\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732ed8; no transition-literal/store pattern; member delegates: \['r4 v\[+0x3c\]', '*(r30+4) v\[+0x28\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732ed8; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

serializes the live topology object into ZoneGroupState XML under impl+0x318 lock; faults 501 when the serializer flag is clear
::: details Evidence (2)

- @ 0x10752ce4; impl body
- @ 0x10732f9c; emit+commit

:::


#### Errors

**`501`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; sites: 0x10732f44).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
state serializer flag clear (builder empty/not-ready) - impl returns 0x1f5

- state serializer flag clear (builder empty/not-ready) - impl returns 0x1f5

**`402`**

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10732ed8`
- dispatch entry `0x10f11400` (voff `40`)
- impl call `0x10732f8c` obj `*(*(sp-0x69a0+0x6998)+0x4)` slot `40` arg4 `sp+0x14`
- impl call `0x10732fc8` obj `vret(*(sp-0x69a0+0x699c),+0x24)` slot `16` arg4 `sp+0x14`
- impl call `0x10732fdc` obj `*(sp-0x69a0+0x699c)` slot `12` arg4 `?`
- req vcall `0x10732f10` slot `60` (other)
- req vcall `0x10732f24` slot `8` (parse)

- fn 0x10732ed8 @ 0x10732ed8; action wrapper handler
- @ 0x10f11400; action dispatch table entry

:::

### `RegisterMobileDevice`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Supposed to register a phone or tablet with the system, but in this build it is a documented no-op: it accepts the request and replies success without storing anything or calling any implementation. The advertised command is a leftover; nothing is registered and no state changes.

**TODO:** Established: virtual dispatch to handler 0x10732ebc.
**TODO:** Still unknown: required/optional flags and formal in/out direction of its arguments - the record's own unresolved note: the trampoline delegates parse+emit to the generic req worker and the names were recovered from the packed rodata record.
**TODO:** Next step: decode the packed rodata arg record for this action to recover per-arg direction and optionality.

::: details Technical details

accepted-and-ignored: commits an empty response with no parse, no impl call, and no observable state change

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `MobileDeviceName` | SonosStringArg | yes | impl-side grammar applies / parser cap | none - required by contract (presence unenforced at parse) |
| `MobileDeviceUDN` | SonosStringArg | yes | impl-side grammar applies / parser cap | none - required by contract (presence unenforced at parse) |
| `MobileIPAndPort` | SonosStringArg | yes | impl-side grammar applies / parser cap | none - required by contract (presence unenforced at parse) |

- **`MobileDeviceName`**: mobile device display name
  - validation: consumed by the impl vfunc
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `MobileDeviceName` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `MobileDeviceName`'s use inside the action's impl worker.
- **`MobileDeviceUDN`**: mobile device UDN (uuid:...)
  - validation: consumed by the impl vfunc
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `MobileDeviceUDN` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `MobileDeviceUDN`'s use inside the action's impl worker.
- **`MobileIPAndPort`**: mobile device IP:port contact address
  - validation: consumed by the impl vfunc
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `MobileIPAndPort` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `MobileIPAndPort`'s use inside the action's impl worker.

::: details Technical analysis

#### Validation

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
::: details Evidence (1)

- @ 0x10732ebc; wrapper decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (none); member delegates: r4 v\[+0xc\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (none); member delegates: r4 v\[+0xc\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732ebc; req-vfunc call map: {}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0xc\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0xc\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732ebc; member vfunc calls: \['r4 v\[+0xc\]'\]

:::


#### Side effects

- state-mutation delegate: r4 v\[+0xc\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: r4 v\[+0xc\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0xc\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0xc\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732ebc; no transition-literal/store pattern; member delegates: \['r4 v\[+0xc\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732ebc; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

unconditional empty commit - accepted-and-ignored
::: details Evidence (1)

- @ 0x10732ebc; handler body

:::


#### Errors

**`none`**

no action-level fault path exists - handler commits unconditionally (request-envelope faults only)

- handler is a 6-instruction accept-stub: commits an empty response with no arg parsing and no fault call; only dispatcher-level 401 for unknown action names can fire


#### Bounded unknowns

- **arg_direction:** required/optional flags and formal in/out direction unresolved: trampoline handler delegates parse+emit to generic req worker; names recovered from packed rodata record


:::

::: details Implementation & reverse-engineering evidence

- handler `0x10732ebc`
- dispatch entry `0x10f1140c` (voff `20`)
- req vcall `0x10732ed4` slot `12` (commit)
- Handler f_10732ebc forwards wholesale to req->v\[+0x0c\] -- the request objects own commit/worker vfunc; the argument model lives inside that request-scoped vfunc and is not statically resolvable from the handler. Arg model recovered from packed rodata record 0x10f093f0..0x10f0943c: action name followed by MobileDeviceName/MobileDeviceUDN/MobileIPAndPort. Direction recorded as inputs on name semantics (registration payload); the req-scoped worker owns parse/emit sites so per-arg required/optional and emit-vs-parse cannot be resolved from the handler alone.

- @ 0x10732ebc; handler body
- @ 0x10f1140c; action table entry
- fn 0x10732ebc @ 0x10732ebc; action wrapper handler

:::

### `ReportAlarmStartedRunning`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Tells the topology that an alarm has begun ringing. It is a bookkeeping ping so the household's shared state knows which alarm is active, feeding the displays and the snooze/stop flow that follow.

**TODO:** Established: virtual dispatch to handler 0x107337cc; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x107337cc, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Reports that an alarm started running: feeds the alarm/topology bookkeeping via impl->v\[+0x14\].

:::

::: details Technical analysis

#### Validation

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
::: details Evidence (1)

- @ 0x107337cc; wrapper decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0x14\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0x14\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107337cc; req-vfunc call map: {'0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x14\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x14\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107337cc; member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x14\]'\]

:::


#### Side effects

- state-mutation delegate: r4 v\[+0x8\], *(r30+4) v\[+0x14\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: r4 v\[+0x8\], *(r30+4) v\[+0x14\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x14\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x14\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107337cc; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x14\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107337cc; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107337cc; commit/fault slot usage: {'0x14': 1, '0xc': 1}

:::


#### Errors

**`501`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; sites: 0x1073382c).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
bound impl lacks the alarm-capable vfunc: *(svc+4)->v\[+0x24\] != f_1012b9b4 -> 501 (polymorphic impl-variant check)

- impl identity check at 0x10733944-0x1073395c fails


**Bounded unknown (proven):** topology impl rc surfaced
**Bounded unknown (unresolved):** codes for validation/state failures

impl itself cannot fault (unconditional 0). 402 also present for req-validate failure.

**`402`**

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



:::

::: details Implementation & reverse-engineering evidence

- handler `0x107337cc`
- dispatch entry `0x10f11418` (voff `28`)
- impl call `0x10733840` obj `*(*(sp-0x20+0x18)+0x4)` slot `20` arg4 `402`
- impl call `0x10733874` obj `*(sp-0x20+0x1c)` slot `12` arg4 `vret(*(*(sp-0x20+0x18)+0x4),+0x14)`
- req vcall `0x107337f8` slot `8` (parse)
- Handler 0x107337cc contains no argument-parser call and no arg-name string loads; the action is verified argless (no inputs, no outputs).

- fn 0x107337cc @ 0x107337cc; action wrapper handler
- @ 0x10f11418; action dispatch table entry
- @ 0x107337cc; handler body: gate + impl call + commit only; no parse/emit arg sites

:::

### `ReportUnresponsiveDevice`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Reports that a speaker in the household has gone silent. It is used when one member notices another is not answering, so the system can mark it unresponsive and take the requested action (warn the user, drop it from the group, or retry).

**TODO:** Established: virtual dispatch to handler 0x10733498; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10733498, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Reports DeviceUUID unresponsive with DesiredAction via impl->v\[+0x10\] on the svc+4 member.

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DeviceUUID` | SonosStringArg | yes | must begin with "RINCON_" / max 1023 chars | none - required argument |
| `DesiredAction` | SonosBoolArg | yes | not impl-checked / max 127 chars | none - required argument |

- **`DeviceUUID`**: device UUID string; impl strncmp vs "RINCON_" (7) - non-Sonos IDs rejected
  - validation: impl-level prefix check; mismatch -> 402
  - buffer cap: `0x400`
- **`DesiredAction`**: action string forwarded to report worker f_10747b74
  - validation: request-layer parse only
  - buffer cap: `0x80`

::: details Technical analysis

#### Validation

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
::: details Evidence (1)

- @ 0x10733498; wrapper decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, 0x34×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, 0x34×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733498; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0xc': 1, '0x14': 1, '0x34': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733498; member vfunc calls: \['*(r30+4) v\[+0x10\]', '*(r30+4) v\[+0x10\]'\]

:::


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733498; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x10\]', '*(r30+4) v\[+0x10\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733498; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10733498; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0xc': 1, '0x14': 1, '0x34': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; parse/req-layer; sites: 0x1073359c).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
DeviceID lacks RINCON_ prefix (strncmp,7) - f_10121310 returns 402 | Wrapper parse layer rejected an argument before the impl call.

- DeviceID lacks RINCON_ prefix (strncmp,7) - f_10121310 returns 402
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** topology impl rc surfaced
**Bounded unknown (unresolved):** codes for validation/state failures



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10733498`
- dispatch entry `0x10f11424` (voff `24`)
- impl call `0x10733564` obj `*(r3-in+0x4)` slot `16` arg4 `sp-0x414`
- impl call `0x107335ec` obj `*(sp-0x4b0+0x4ac)` slot `52` arg4 `?`
- impl call `0x10733648` obj `*(*(sp-0x4b0+0x4a8)+0x4)` slot `16` arg4 `sp+0x9c`
- req vcall `0x10733528` slot `8` (parse)
- req vcall `0x10733580` slot `12` (commit)

- fn 0x10733498 @ 0x10733498; action wrapper handler
- @ 0x10f11424; action dispatch table entry

:::

### `SubmitDiagnostics`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Packages and submits a diagnostic report, the 'submit diagnostics' support feature. It gathers the player's logs and state into a bundle tagged with a diagnostic ID that Sonos support can look up. You can ask it to include data from the controllers too, and the returned ID is the reference you give to support.

**TODO:** Established: virtual dispatch to handler 0x1073365c; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x1073365c, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Submits diagnostics (IncludeControllers, Type) returning DiagnosticID via impl->v\[+0x18\] on the doubly-indirect member.

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `IncludeControllers` | SonosBoolArg | yes | not impl-checked / {0,1} | none - required argument |
| `Type` | SonosStringArg | yes | not impl-checked / max 32 chars | none - required argument |

- **`IncludeControllers`**: flag parsed by request layer, forwarded to diag worker f_105b2d6c
  - validation: request-layer parse only
  - buffer cap: `0x18`
- **`Type`**: diag type string forwarded to worker
  - validation: request-layer parse only
  - buffer cap: `0x21`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `DiagnosticID` | unsigned int32 | worker-assigned ID / length-bounded by parse-helper buffer cap |

- **`DiagnosticID`**: diag ticket ID emitted on success via f_1055fcbc
  - validation: emitted on success only

::: details Technical analysis

#### Validation

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
::: details Evidence (1)

- @ 0x1073365c; wrapper decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, out-arg write×1, validate×1, commit×1); member delegates: *(r28+4) v\[+0x18\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, out-arg write×1, validate×1, commit×1); member delegates: *(r28+4) v\[+0x18\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1073365c; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r28+4) v\[+0x18\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r28+4) v\[+0x18\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1073365c; member vfunc calls: \['*(r28+4) v\[+0x18\]'\]

:::


#### Side effects

- state-mutation delegate: *(r28+4) v\[+0x18\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: *(r28+4) v\[+0x18\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r28+4) v\[+0x18\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r28+4) v\[+0x18\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1073365c; no transition-literal/store pattern; member delegates: \['*(r28+4) v\[+0x18\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1073365c; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1073365c; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

:::


#### Errors

**`1000`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; sites: 0x10733728).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
diagnostics delegate absent: global->v\[+0xcc\](*(impl+0x578))==0 -> rc 0x3e8

- diagnostics delegate absent: global->v\[+0xcc\](*(impl+0x578))==0 -> rc 0x3e8

**`402`**

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



:::

::: details Implementation & reverse-engineering evidence

- handler `0x1073365c`
- dispatch entry `0x10f11430` (voff `32`)
- impl call `0x1073377c` obj `*(*(sp-0x50+0x40)+0x4)` slot `24` arg4 `sp+0x14`
- impl call `0x107337c0` obj `*(sp-0x50+0x4c)` slot `12` arg4 `?`
- req vcall `0x10733708` slot `8` (parse)

- fn 0x1073365c @ 0x1073365c; action wrapper handler
- @ 0x10f11430; action dispatch table entry

:::

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `AvailableSoftwareUpdate` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |
| `ZoneGroupState` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |
| `ThirdPartyMediaServersX` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |
| `AlarmRunSequence` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |
| `MuseHouseholdId` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |
| `ZoneGroupName` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |
| `ZoneGroupID` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |
| `ZonePlayerUUIDsInGroup` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |
| `A_ARG_TYPE_UpdateType` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_CachedOnly` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UpdateItem` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UpdateURL` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UpdateFlags` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UpdateExtraOptions` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Version` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MemberID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UnresponsiveDeviceActionType` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `DiagnosticID` | ui4 | no | non-evented ZoneGroupTopology state variable: read via action out-args, not pushed |
| `A_ARG_TYPE_IncludeControllers` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Origin` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MobileDeviceName` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MobileDeviceUDN` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MobileIPAndPort` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `AreasUpdateID` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |
| `SourceAreasUpdateID` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |
| `NetsettingsUpdateID` | string | yes | evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /ZoneGroupTopology/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission decoded: f_1074d9b4 -> f_10743328 serializer -> f_10676a44 delivery
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `zoneGroupTopology`, `activeZonesChange`, `zoneDefinitionsChange`, `zoneError`
::: details Technical details

- **notify_path:** f_1074d9b4 emitter: serializes <ZoneGroupState>/<ZoneGroups> full-state doc via f_10743328 -> delivery worker f_10676a44; svc+0xe7c flag gates a secondary emit via f_1074388c; f_1074d644 produces 3 flag bytes; initial-notify caller at 0x10752d2c; second emitter f_10129888 (topology.cxx): <MediaServers><Ex CURL= EURL= T= EXT=><MediaServer Name=> section + 'informLocalPlayerChange' + 'SourceAreasUpdateID'
- **payload_model:** direct <ZoneGroupState> XML (not LastChange attribute-form) - full-state push on topology change
- **wss_registry:**
  - idx: 72, name: zoneGroupTopology, id: 322, tag: 78
  - idx: 2, name: activeZonesChange, id: 12, tag: 82
  - idx: 3, name: zoneDefinitionsChange, id: 13, tag: 82
  - idx: 4, name: zoneError, id: 14, tag: 82
- **todo:** `Established: the GENA SUBSCRIBE acceptance path is documented; no LastChange template exists for this service (the registry only carries AVT/RCS/Queue); WSS event names attributed: `zoneGroupTopology`, `activeZonesChange`, `zoneDefinitionsChange`, `zoneError`.`, `Still unknown: the WSS attribution is name-based, not call-site-proven.`, `Next step: trace the service's notify emit call (GENA sender or WSS registry consumer) to recover the emission path.`

:::


## Dispatcher-level errors

::: details Technical details

**`401`**

Established: fault sites and trigger conditions for code 401 are documented with binary evidence.
Still unknown: the complete emit-site set for this code across the dispatcher is not exhaustively enumerated.
Next step: sweep the dispatcher fault table for additional emit sites of this code.
unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search



:::

## Additional records

### `implementation`

::: details Technical details

- **impl_vtable:**
  - **addr:** 0x10f113b8
  - **layout:** vfunc offset = action_id - 9; slot+0x00 = dispatcher f_10732ff8
  - **slots:**
    - **0x00:** f_10732ff8 (dispatcher)
    - **0x04:** f_1073331c CheckForUpdate (id 0xd)
    - **0x08:** f_10733140 BeginSoftwareUpdate (id 0x11)
    - **0x0c:** f_10732ebc RegisterMobileDevice (id 0x15) - req->v\[+0x0c\] trampoline
    - **0x10:** f_10733498 ReportUnresponsiveDevice (id 0x19)
    - **0x14:** f_107337cc ReportAlarmStartedRunning (id 0x1d)
    - **0x18:** f_1073365c SubmitDiagnostics (id 0x21)
    - **0x1c:** f_10733878 GetZoneGroupAttributes (id 0x25)
    - **0x20:** f_10732ed8 GetZoneGroupState (id 0x29)
  - **evidence:** disasm dispatcher 0x10732ff8 vtable-index dispatch (id odd -> *(vptr+id-9) vfunc); table dump 0x10f113b8

:::

Implementation sources (recovered): `zoneplayer/topology.cxx`, `zoneplayer/topology_events_report.cxx`, `zoneplayer/zones_{mgr,storage}.cxx`, `common/topology/topology_base.cxx`

::: details Service evidence (3)

- @ 0x1068bc0c; service router function
- @ 0x10f113b0; service vtable
- @ 0x10732ff8; service dispatcher

:::
