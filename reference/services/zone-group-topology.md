# `ZoneGroupTopology` — `/ZoneGroupTopology/Control`

**visibility** `advertised` · **status** `strong`

Zone-group topology service: group membership state, attributes, software update and diagnostics reporting.

## Availability

- capability flags `0x8`
- enabled gate: `*(r2+0xffff8ff8)` at `0x1068bc70` (field)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x1068bc0c`, cap flags `0x8`
- dispatcher `0x10732ff8` kind `table`
- action table `0x10f113dc`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `BeginSoftwareUpdate` | advertised | callable | `strong` | virtual | 402 |
| `CheckForUpdate` | advertised | callable | `strong` | virtual | 402, 801 |
| `GetZoneGroupAttributes` | advertised | callable | `strong` | virtual | 402, 501 |
| `GetZoneGroupState` | advertised | callable | `strong` | virtual | 402, 501 |
| `RegisterMobileDevice` | advertised | callable | `strong` | virtual |  |
| `ReportAlarmStartedRunning` | advertised | callable | `strong` | virtual | 402, 501 |
| `ReportUnresponsiveDevice` | advertised | callable | `strong` | virtual | 402 |
| `SubmitDiagnostics` | advertised | callable | `strong` | virtual | 402, 1000 |

### `BeginSoftwareUpdate`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Kicks off a software update from UpdateURL with Flags/ExtraOptions via impl->v\[+0xc\] on the svc+4 member.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `UpdateURL` | SonosUriArg | yes | any string accepted at parse; version/updateID substrings are truncated at first char outside ".-_" / "+-_/" respectively / max 1024 chars | none - required argument |
| `Flags` | SonosStringArg | yes | not range-checked in impl wrapper / length-bounded by parse-helper buffer cap | none - required argument |
| `ExtraOptions` | SonosStringArg | yes | any string / max 127 chars | none - required argument |

- **`UpdateURL`** — URL fetched into the parsed-arg set; the impl pulls system_version/updateID keys and submits to the update worker
  - validation: parsed by request layer; impl sanitizes silently (truncation, no fault) at f_107413c8
  - buffer cap: `0x401`
- **`Flags`** — numeric/flag arg parsed by request layer, forwarded to update worker f_107412ec
  - validation: request-layer parse only
  - buffer cap: `0x18`
- **`ExtraOptions`** — optional options string forwarded to update worker
  - validation: request-layer parse only
  - buffer cap: `0x80`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x10733140 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1)
<details><summary>Evidence (1)</summary>

- fn 0x10733140 — req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): none - impl works on req/inline members only
<details><summary>Evidence (1)</summary>

- fn 0x10733140 — member vfunc calls: \[\]

</details>


#### Side effects

- impl delegates op internally (no member vfunc call captured); arg-driven, stores=1

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): none
<details><summary>Evidence (1)</summary>

- fn 0x10733140 — no transition-literal/store pattern; member delegates: \[\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10733140 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10733140 — commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1}

</details>


#### Errors

**`402`** `strong`

UpdateURL does not begin with "http" (strncasecmp 4) -> 402 with detail "Update URL is malformed"; on http-URL the request delegates to launcher f_1073f1c8 (rc forwarded verbatim) | Wrapper parse layer rejected an argument before the impl call.

- strncasecmp(UpdateURL,"http",4)!=0 in worker f_107412ec
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

launcher f_1073f1c8 performs external-update hook (write+exec); its rc is forwarded verbatim and not statically bounded - operation-submitted semantics, not guaranteed success


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10733140`
- dispatch entry `0x10f113dc` (voff `16`)
- impl call `0x107332b8` obj `*(r3-in+0x4)` slot `12` arg4 `sp+0xa8`
- req vcall `0x10733208` slot `8` (parse)
- req vcall `0x10733284` slot `64` (other)
- req vcall `0x107332d4` slot `12` (commit)

- fn 0x10733140 @ 0x10733140 — action wrapper handler
- @ 0x10f113dc — action dispatch table entry

</details>

### `CheckForUpdate`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Checks update availability (UpdateType, CachedOnly, Version) and returns UpdateItem via impl->v\[+0x8\] on the doubly-indirect member.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `UpdateType` | SonosStringArg | yes | "Software" is the only accepted value (mismatch -> 402) / max 127 chars | none - required argument |
| `CachedOnly` | SonosStringArg | yes | not impl-checked / length-bounded by parse-helper buffer cap | none - required argument |
| `Version` | SonosStringArg | yes | not impl-checked / max 64 chars | none - required argument |

- **`UpdateType`** — update-type string; impl strcmp vs literal "Software"
  - validation: impl-level strcmp at 0x10752c80
  - buffer cap: `0x80`
- **`CachedOnly`** — flag parsed by request layer, passed to worker f_10752adc
  - validation: request-layer parse only
  - buffer cap: `0x18`
- **`Version`** — version string forwarded to worker f_10752adc
  - validation: request-layer parse only
  - buffer cap: `0x41`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `UpdateItem` | SonosStringArg | populated from impl+0x5ec state / length-bounded by parse-helper buffer cap |

- **`UpdateItem`** — update record emitted on success by the worker path
  - special values: empty when no pending update record
  - validation: emitted on success

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x1073331c — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×3, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x1073331c — req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x1073331c — member vfunc calls: \['*(r30+4) v\[+0x8\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x8\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x1073331c — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073331c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073331c — commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

UpdateType arg != "Software" (strcmp in impl) | Wrapper parse layer rejected an argument before the impl call.

- UpdateType arg != "Software" (strcmp in impl)
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** topology impl rc surfaced
**Bounded unknown — unresolved:** codes for validation/state failures

**`801`** `confirmed`

Software update requested but capability flag impl+0x5f4 clear (feature-gated)

- type=="Software" and *(impl+0x5f4)==0


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073331c`
- dispatch entry `0x10f113e8` (voff `12`)
- impl call `0x1073343c` obj `*(*(sp-0xcf0+0xce8)+0x4)` slot `8` arg4 `sp+0x5c`
- impl call `0x10733478` obj `vret(*(sp-0xcf0+0xcec),+0x24)` slot `16` arg4 `sp+0xdc`
- impl call `0x1073348c` obj `*(sp-0xcf0+0xcec)` slot `12` arg4 `?`
- req vcall `0x107333c8` slot `8` (parse)

- fn 0x1073331c @ 0x1073331c — action wrapper handler
- @ 0x10f113e8 — action dispatch table entry

</details>

### `GetZoneGroupAttributes`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns zone-group identity fields. Wrapper calls impl->v\[+0x34\] on r4-in; extra capability checks precede the emit path (a 402 fault fires when the inner call returns 0).

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentZoneGroupName` | SonosBoolArg | live value / {0,1} |
| `CurrentZoneGroupID` | SonosStringArg | live value / length-bounded by parse-helper buffer cap |
| `CurrentZonePlayerUUIDsInGroup` | SonosBoolArg | live value / {0,1} |
| `CurrentMuseHouseholdId` | SonosBoolArg | live value / {0,1} |

- **`CurrentZoneGroupName`** — zone-group name string serialized from impl+0x5a8 state under topology lock
  - special values: empty string when the corresponding impl member is unset
  - validation: emitted on success only (impl rc==0); 501 when serializer flag clear
- **`CurrentZoneGroupID`** — zone-group ID string serialized under topology lock
  - special values: empty string when the corresponding impl member is unset
  - validation: emitted on success only (impl rc==0); 501 when serializer flag clear
- **`CurrentZonePlayerUUIDsInGroup`** — topology attribute serialized under impl+0x318 lock
  - special values: empty string when the corresponding impl member is unset
  - validation: emitted on success only (impl rc==0); 501 when serializer flag clear
- **`CurrentMuseHouseholdId`** — household ID string serialized under topology lock
  - special values: empty string when the corresponding impl member is unset
  - validation: emitted on success only (impl rc==0); 501 when serializer flag clear

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x10733878 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×4, raise-fault×1, out-arg write×4, validate×1, commit×1); member delegates: r4 v\[+0x34\], *(r29+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10733878 — req-vfunc call map: {'0x8': 1, '0x14': 1, '0x24': 4, '0x10': 4, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x34\], *(r29+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10733878 — member vfunc calls: \['r4 v\[+0x34\]', '*(r29+4) v\[+?\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x34\], *(r29+4) v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x34\], *(r29+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10733878 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x34\]', '*(r29+4) v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10733878 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10733878 — commit/fault slot usage: {'0x8': 1, '0x14': 1, '0x24': 4, '0x10': 4, '0xc': 1}

</details>


#### Errors

**`501`** `strong`

attribute serialization not-ready flag - impl returns 0x1f5

- attribute serialization not-ready flag - impl returns 0x1f5

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

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

- fn 0x10733878 @ 0x10733878 — action wrapper handler
- @ 0x10f113f4 — action dispatch table entry

</details>

### `GetZoneGroupState`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Serializes the full zone-group state XML via impl->v\[+0x28\] on the doubly-indirect member.

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `ZoneGroupState` | SonosBoolArg | serialized XML / {0,1} |

- **`ZoneGroupState`** — full ZoneGroupState XML document serialized by f_10743328 under the impl+0x318 topology lock; builder flag gates 501
  - validation: emitted on success; impl returns 501 if builder flag clear

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x10732ed8 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, validate×1, commit×1); member delegates: r4 v\[+0x3c\], *(r30+4) v\[+0x28\]
<details><summary>Evidence (1)</summary>

- fn 0x10732ed8 — req-vfunc call map: {'0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x3c\], *(r30+4) v\[+0x28\]
<details><summary>Evidence (1)</summary>

- fn 0x10732ed8 — member vfunc calls: \['r4 v\[+0x3c\]', '*(r30+4) v\[+0x28\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x3c\], *(r30+4) v\[+0x28\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x3c\], *(r30+4) v\[+0x28\]
<details><summary>Evidence (1)</summary>

- fn 0x10732ed8 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x3c\]', '*(r30+4) v\[+0x28\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10732ed8 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

serializes the live topology object into ZoneGroupState XML under impl+0x318 lock; faults 501 when the serializer flag is clear
<details><summary>Evidence (2)</summary>

- @ 0x10752ce4 — impl body
- @ 0x10732f9c — emit+commit

</details>


#### Errors

**`501`** `strong`

state serializer flag clear (builder empty/not-ready) - impl returns 0x1f5

- state serializer flag clear (builder empty/not-ready) - impl returns 0x1f5

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10732ed8`
- dispatch entry `0x10f11400` (voff `40`)
- impl call `0x10732f8c` obj `*(*(sp-0x69a0+0x6998)+0x4)` slot `40` arg4 `sp+0x14`
- impl call `0x10732fc8` obj `vret(*(sp-0x69a0+0x699c),+0x24)` slot `16` arg4 `sp+0x14`
- impl call `0x10732fdc` obj `*(sp-0x69a0+0x699c)` slot `12` arg4 `?`
- req vcall `0x10732f10` slot `60` (other)
- req vcall `0x10732f24` slot `8` (parse)

- fn 0x10732ed8 @ 0x10732ed8 — action wrapper handler
- @ 0x10f11400 — action dispatch table entry

</details>

### `RegisterMobileDevice`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

accepted-and-ignored: commits an empty response with no parse, no impl call, and no observable state change

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `MobileDeviceName` | SonosStringArg | yes | impl-side grammar applies / parser cap | none - required by contract (presence unenforced at parse) |
| `MobileDeviceUDN` | SonosStringArg | yes | impl-side grammar applies / parser cap | none - required by contract (presence unenforced at parse) |
| `MobileIPAndPort` | SonosStringArg | yes | impl-side grammar applies / parser cap | none - required by contract (presence unenforced at parse) |

- **`MobileDeviceName`** — mobile device display name
  - validation: consumed by the impl vfunc
- **`MobileDeviceUDN`** — mobile device UDN (uuid:...)
  - validation: consumed by the impl vfunc
- **`MobileIPAndPort`** — mobile device IP:port contact address
  - validation: consumed by the impl vfunc

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x10732ebc — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (none); member delegates: r4 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x10732ebc — req-vfunc call map: {}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x10732ebc — member vfunc calls: \['r4 v\[+0xc\]'\]

</details>


#### Side effects

- state-mutation delegate: r4 v\[+0xc\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x10732ebc — no transition-literal/store pattern; member delegates: \['r4 v\[+0xc\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10732ebc — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

unconditional empty commit - accepted-and-ignored
<details><summary>Evidence (1)</summary>

- @ 0x10732ebc — handler body

</details>


#### Errors

**`none`** `confirmed`

no action-level fault path exists - handler commits unconditionally (request-envelope faults only)

- handler is a 6-instruction accept-stub: commits an empty response with no arg parsing and no fault call; only dispatcher-level 401 for unknown action names can fire


#### Bounded unknowns

- **arg_direction:** required/optional flags and formal in/out direction unresolved: trampoline handler delegates parse+emit to generic req worker; names recovered from packed rodata record

<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10732ebc`
- dispatch entry `0x10f1140c` (voff `20`)
- req vcall `0x10732ed4` slot `12` (commit)
- Handler f_10732ebc forwards wholesale to req->v\[+0x0c\] -- the request objects own commit/worker vfunc; the argument model lives inside that request-scoped vfunc and is not statically resolvable from the handler. Arg model recovered from packed rodata record 0x10f093f0..0x10f0943c: action name followed by MobileDeviceName/MobileDeviceUDN/MobileIPAndPort. Direction recorded as inputs on name semantics (registration payload); the req-scoped worker owns parse/emit sites so per-arg required/optional and emit-vs-parse cannot be resolved from the handler alone.

- @ 0x10732ebc — handler body
- @ 0x10f1140c — action table entry
- fn 0x10732ebc @ 0x10732ebc — action wrapper handler

</details>

### `ReportAlarmStartedRunning`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Reports that an alarm started running — feeds the alarm/topology bookkeeping via impl->v\[+0x14\].

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x107337cc — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x107337cc — req-vfunc call map: {'0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x107337cc — member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x14\]'\]

</details>


#### Side effects

- state-mutation delegate: r4 v\[+0x8\], *(r30+4) v\[+0x14\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x107337cc — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x14\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x107337cc — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x107337cc — commit/fault slot usage: {'0x14': 1, '0xc': 1}

</details>


#### Errors

**`501`** `strong`

bound impl lacks the alarm-capable vfunc: *(svc+4)->v\[+0x24\] != f_1012b9b4 -> 501 (polymorphic impl-variant check)

- impl identity check at 0x10733944-0x1073395c fails


**Bounded unknown — proven:** topology impl rc surfaced
**Bounded unknown — unresolved:** codes for validation/state failures

impl itself cannot fault (unconditional 0). 402 also present for req-validate failure.

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107337cc`
- dispatch entry `0x10f11418` (voff `28`)
- impl call `0x10733840` obj `*(*(sp-0x20+0x18)+0x4)` slot `20` arg4 `402`
- impl call `0x10733874` obj `*(sp-0x20+0x1c)` slot `12` arg4 `vret(*(*(sp-0x20+0x18)+0x4),+0x14)`
- req vcall `0x107337f8` slot `8` (parse)
- Handler 0x107337cc contains no argument-parser call and no arg-name string loads; the action is verified argless (no inputs, no outputs).

- fn 0x107337cc @ 0x107337cc — action wrapper handler
- @ 0x10f11418 — action dispatch table entry
- @ 0x107337cc — handler body: gate + impl call + commit only; no parse/emit arg sites

</details>

### `ReportUnresponsiveDevice`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Reports DeviceUUID unresponsive with DesiredAction via impl->v\[+0x10\] on the svc+4 member.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DeviceUUID` | SonosStringArg | yes | must begin with "RINCON_" / max 1023 chars | none - required argument |
| `DesiredAction` | SonosBoolArg | yes | not impl-checked / max 127 chars | none - required argument |

- **`DeviceUUID`** — device UUID string; impl strncmp vs "RINCON_" (7) - non-Sonos IDs rejected
  - validation: impl-level prefix check; mismatch -> 402
  - buffer cap: `0x400`
- **`DesiredAction`** — action string forwarded to report worker f_10747b74
  - validation: request-layer parse only
  - buffer cap: `0x80`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x10733498 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, 0x34×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x10733498 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0xc': 1, '0x14': 1, '0x34': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x10733498 — member vfunc calls: \['*(r30+4) v\[+0x10\]', '*(r30+4) v\[+0x10\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x10\], *(r30+4) v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x10733498 — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x10\]', '*(r30+4) v\[+0x10\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10733498 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10733498 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0xc': 1, '0x14': 1, '0x34': 1}

</details>


#### Errors

**`402`** `strong`

DeviceID lacks RINCON_ prefix (strncmp,7) - f_10121310 returns 402 | Wrapper parse layer rejected an argument before the impl call.

- DeviceID lacks RINCON_ prefix (strncmp,7) - f_10121310 returns 402
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** topology impl rc surfaced
**Bounded unknown — unresolved:** codes for validation/state failures


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10733498`
- dispatch entry `0x10f11424` (voff `24`)
- impl call `0x10733564` obj `*(r3-in+0x4)` slot `16` arg4 `sp-0x414`
- impl call `0x107335ec` obj `*(sp-0x4b0+0x4ac)` slot `52` arg4 `?`
- impl call `0x10733648` obj `*(*(sp-0x4b0+0x4a8)+0x4)` slot `16` arg4 `sp+0x9c`
- req vcall `0x10733528` slot `8` (parse)
- req vcall `0x10733580` slot `12` (commit)

- fn 0x10733498 @ 0x10733498 — action wrapper handler
- @ 0x10f11424 — action dispatch table entry

</details>

### `SubmitDiagnostics`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Submits diagnostics (IncludeControllers, Type) returning DiagnosticID via impl->v\[+0x18\] on the doubly-indirect member.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `IncludeControllers` | SonosBoolArg | yes | not impl-checked / {0,1} | none - required argument |
| `Type` | SonosStringArg | yes | not impl-checked / max 32 chars | none - required argument |

- **`IncludeControllers`** — flag parsed by request layer, forwarded to diag worker f_105b2d6c
  - validation: request-layer parse only
  - buffer cap: `0x18`
- **`Type`** — diag type string forwarded to worker
  - validation: request-layer parse only
  - buffer cap: `0x21`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `DiagnosticID` | unsigned int32 | worker-assigned ID / length-bounded by parse-helper buffer cap |

- **`DiagnosticID`** — diag ticket ID emitted on success via f_1055fcbc
  - validation: emitted on success only

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x1073365c — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, out-arg write×1, validate×1, commit×1); member delegates: *(r28+4) v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x1073365c — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r28+4) v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x1073365c — member vfunc calls: \['*(r28+4) v\[+0x18\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r28+4) v\[+0x18\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r28+4) v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x1073365c — no transition-literal/store pattern; member delegates: \['*(r28+4) v\[+0x18\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073365c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073365c — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`1000`** `strong`

diagnostics delegate absent: global->v\[+0xcc\](*(impl+0x578))==0 -> rc 0x3e8

- diagnostics delegate absent: global->v\[+0xcc\](*(impl+0x578))==0 -> rc 0x3e8

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073365c`
- dispatch entry `0x10f11430` (voff `32`)
- impl call `0x1073377c` obj `*(*(sp-0x50+0x40)+0x4)` slot `24` arg4 `sp+0x14`
- impl call `0x107337c0` obj `*(sp-0x50+0x4c)` slot `12` arg4 `?`
- req vcall `0x10733708` slot `8` (parse)

- fn 0x1073365c @ 0x1073365c — action wrapper handler
- @ 0x10f11430 — action dispatch table entry

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `AvailableSoftwareUpdate` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |
| `ZoneGroupState` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |
| `ThirdPartyMediaServersX` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |
| `AlarmRunSequence` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |
| `MuseHouseholdId` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |
| `ZoneGroupName` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |
| `ZoneGroupID` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |
| `ZonePlayerUUIDsInGroup` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |
| `A_ARG_TYPE_UpdateType` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_CachedOnly` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UpdateItem` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UpdateURL` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UpdateFlags` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UpdateExtraOptions` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Version` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MemberID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UnresponsiveDeviceActionType` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `DiagnosticID` | ui4 | no | non-evented ZoneGroupTopology state variable — read via action out-args, not pushed |
| `A_ARG_TYPE_IncludeControllers` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Origin` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MobileDeviceName` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MobileDeviceUDN` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MobileIPAndPort` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `AreasUpdateID` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |
| `SourceAreasUpdateID` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |
| `NetsettingsUpdateID` | string | yes | evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /ZoneGroupTopology/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission decoded: f_1074d9b4 -> f_10743328 serializer -> f_10676a44 delivery
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `zoneGroupTopology`, `activeZonesChange`, `zoneDefinitionsChange`, `zoneError`
- **notify_path:** f_1074d9b4 emitter: serializes <ZoneGroupState>/<ZoneGroups> full-state doc via f_10743328 -> delivery worker f_10676a44; svc+0xe7c flag gates a secondary emit via f_1074388c; f_1074d644 produces 3 flag bytes; initial-notify caller at 0x10752d2c; second emitter f_10129888 (topology.cxx): <MediaServers><Ex CURL= EURL= T= EXT=><MediaServer Name=> section + 'informLocalPlayerChange' + 'SourceAreasUpdateID'
- **payload_model:** direct <ZoneGroupState> XML (not LastChange attribute-form) - full-state push on topology change
- **wss_registry:**
  - idx: 72, name: zoneGroupTopology, id: 322, tag: 78
  - idx: 2, name: activeZonesChange, id: 12, tag: 82
  - idx: 3, name: zoneDefinitionsChange, id: 13, tag: 82
  - idx: 4, name: zoneError, id: 14, tag: 82

## Dispatcher-level errors

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search


## Additional records

### `implementation`

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

Implementation sources (recovered): `zoneplayer/topology.cxx`, `zoneplayer/topology_events_report.cxx`, `zoneplayer/zones_{mgr,storage}.cxx`, `common/topology/topology_base.cxx`

<details><summary>Service evidence (3)</summary>

- @ 0x1068bc0c — service router function
- @ 0x10f113b0 — service vtable
- @ 0x10732ff8 — service dispatcher

</details>
