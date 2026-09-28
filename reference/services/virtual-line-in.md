# `VirtualLineIn` — `/MediaRenderer/VirtualLineIn/Control`

**visibility** `advertised` · **status** `strong`

Treats a networked line-in source as a virtual transport on this player - transport-style control (Play/Pause/Stop/Next/Previous/SetVolume) plus Start/StopTransmission to run the session. It's the 'line-in from another player' surface.

**Technical description:** Virtual Line-In sink service: a VLI playback session exposes transport-like controls; impl object is r5-in (VLI session impl).

## Availability

- capability flags `0x10000`
- enabled gate: `xor(*(r3-in+0x571c))` at `0x10195690` (field_inverted)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x10000`
- dispatcher `0x1073ccc0` kind `table`
- action table `0x10f11ee0`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `Next` | advertised | callable | `strong` | direct | 402 |
| `Pause` | advertised | callable | `strong` | direct | 402 |
| `Play` | advertised | callable | `strong` | direct | 402 |
| `Previous` | advertised | callable | `strong` | direct | 402 |
| `SetVolume` | advertised | callable | `strong` | direct | 402 |
| `StartTransmission` | advertised | callable | `strong` | direct | 402 |
| `Stop` | advertised | callable | `strong` | direct | 402 |
| `StopTransmission` | advertised | callable | `strong` | direct | 402 |

### `Next`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Advances the virtual line-in transport (context-dependent).

**Technical description:** Next-track in the VLI session via impl->v\[+0x1c\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | any u32 - impl entry does not range-check it in this build / u32 | none - required argument |

- **`InstanceID`** — u32 parsed via f_105614e0; passed to impl; no handler-side range check observed
  - validation: parse only at request layer
  - buffer cap: `0x18`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x1073ce18 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x1c\]
<details><summary>Evidence (1)</summary>

- fn 0x1073ce18 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x1c\]
<details><summary>Evidence (1)</summary>

- fn 0x1073ce18 — member vfunc calls: \['r30 v\[+0x1c\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x1c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x1c\]
<details><summary>Evidence (1)</summary>

- fn 0x1073ce18 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x1c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073ce18 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073ce18 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-layer parse/impl gate failure | Wrapper parse layer rejected an argument before the impl call.

- parse or impl arg gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073ce18`
- dispatch entry `0x10f11ee0`
- impl call `0x1073ce94` obj `r5-in` slot `28` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073cef8` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073ce74` slot `8` (parse)

- fn 0x1073ce18 @ 0x1073ce18 — action wrapper handler
- @ 0x10f11ee0 — action dispatch table entry

</details>

### `Pause`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Pauses the virtual line-in source.

**Technical description:** Pauses VLI playback via impl->v\[+0x18\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | any u32 - impl entry does not range-check it in this build / u32 | none - required argument |

- **`InstanceID`** — u32 parsed via f_105614e0; passed to impl; no handler-side range check observed
  - validation: parse only at request layer
  - buffer cap: `0x18`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x1073cf04 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x1073cf04 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x1073cf04 — member vfunc calls: \['r30 v\[+0x18\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x18\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x1073cf04 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x18\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073cf04 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073cf04 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-layer parse/impl gate failure | Wrapper parse layer rejected an argument before the impl call.

- parse or impl arg gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073cf04`
- dispatch entry `0x10f11eec`
- impl call `0x1073cf80` obj `r5-in` slot `24` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073cfe4` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073cf60` slot `8` (parse)

- fn 0x1073cf04 @ 0x1073cf04 — action wrapper handler
- @ 0x10f11eec — action dispatch table entry

</details>

### `Play`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Starts/resumes the virtual line-in source at the given Speed ('1' normal).

**Technical description:** Starts VLI playback; InstanceID+Speed parsed like AVTransport.Play, then impl->v\[+0x14\] on the r5-in VLI session impl.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | any u32 - impl entry does not range-check it in this build / u32 | none - required argument |
| `Speed` | SonosUintArg | yes | any string <=0x400 - impl entry does not enumerate it / max 1023 chars | none - required argument |

- **`InstanceID`** — u32 parsed via f_105614e0; passed to impl; no handler-side range check observed
  - validation: parse only at request layer
  - buffer cap: `0x18`
- **`Speed`** — string <=0x400 via f_1056157c; passed to impl worker
  - validation: parse only at request layer
  - buffer cap: `0x400`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x1073d2dc — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r30 v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d2dc — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d2dc — member vfunc calls: \['r30 v\[+0x14\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x14\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d2dc — no transition-literal/store pattern; member delegates: \['r30 v\[+0x14\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073d2dc — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073d2dc — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-layer parse/impl gate failure | Wrapper parse layer rejected an argument before the impl call.

- parse or impl arg gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d2dc`
- dispatch entry `0x10f11ef8`
- impl call `0x1073d384` obj `r5-in` slot `20` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073d3e8` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x1073d360` slot `8` (parse)

- fn 0x1073d2dc @ 0x1073d2dc — action wrapper handler
- @ 0x10f11ef8 — action dispatch table entry

</details>

### `Previous`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Steps the virtual line-in transport back.

**Technical description:** Previous-track via impl->v\[+0x20\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | any u32 - impl entry does not range-check it in this build / u32 | none - required argument |

- **`InstanceID`** — u32 parsed via f_105614e0; passed to impl; no handler-side range check observed
  - validation: parse only at request layer
  - buffer cap: `0x18`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x1073cff0 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x20\]
<details><summary>Evidence (1)</summary>

- fn 0x1073cff0 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x20\]
<details><summary>Evidence (1)</summary>

- fn 0x1073cff0 — member vfunc calls: \['r30 v\[+0x20\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x20\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x20\]
<details><summary>Evidence (1)</summary>

- fn 0x1073cff0 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x20\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073cff0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073cff0 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-layer parse/impl gate failure | Wrapper parse layer rejected an argument before the impl call.

- parse or impl arg gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073cff0`
- dispatch entry `0x10f11f04`
- impl call `0x1073d06c` obj `r5-in` slot `32` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073d0d0` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073d04c` slot `8` (parse)

- fn 0x1073cff0 @ 0x1073cff0 — action wrapper handler
- @ 0x10f11f04 — action dispatch table entry

</details>

### `SetVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Sets the playback volume for the line-in session.

**Technical description:** Sets VLI-session volume (DesiredVolume) via impl->v\[+0x24\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | any u32 - impl entry does not range-check it in this build / u32 | none - required argument |
| `DesiredVolume` | SonosUintArg | yes | u32 volume; no range check at impl entry (member write path under mpvlictrl guard) / impl-validated | none - required argument |

- **`InstanceID`** — u32 parsed via f_105614e0; passed to impl; no handler-side range check observed
  - validation: parse only at request layer
  - buffer cap: `0x18`
- **`DesiredVolume`** — volume value passed to session impl 0x10412b78 -> this+0x130 member write
  - validation: impl-validated
  - buffer cap: `0x18`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x1073d0dc — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r30 v\[+0x24\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d0dc — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x24\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d0dc — member vfunc calls: \['r30 v\[+0x24\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x24\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x24\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d0dc — no transition-literal/store pattern; member delegates: \['r30 v\[+0x24\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073d0dc — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073d0dc — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-layer parse/impl gate failure | Wrapper parse layer rejected an argument before the impl call.

- parse or impl arg gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d0dc`
- dispatch entry `0x10f11f10`
- impl call `0x1073d180` obj `r5-in` slot `36` arg4 `*(sp-0x30+0x14)`
- impl call `0x1073d1e4` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073d15c` slot `8` (parse)

- fn 0x1073d0dc @ 0x1073d0dc — action wrapper handler
- @ 0x10f11f10 — action dispatch table entry

</details>

### `StartTransmission`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Begins receiving the line-in stream from the given CoordinatorID; returns the resulting transport settings.

**Technical description:** Starts a VLI transmission to CoordinatorID, returning CurrentTransportSettings via impl->v\[+0x8\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | any u32 - impl entry does not range-check it in this build / u32 | none - required argument |
| `CoordinatorID` | SonosStringArg | yes | any non-empty string parseable by f_1056157c / max 1023 chars | none - required argument |

- **`InstanceID`** — u32 parsed via f_105614e0; passed to impl; no handler-side range check observed
  - validation: parse only at request layer
  - buffer cap: `0x18`
- **`CoordinatorID`** — coordinator zone UUID string via f_1056157c; parse failure -> 402
  - validation: non-empty parse required
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentTransportSettings` | SonosBoolArg | "0" or "1" via bool-style parse helper; literal semantics under action validation / {0,1} |

- **`CurrentTransportSettings`** — emitted from session impl transport settings (this+0x130 family)
  - validation: impl-produced

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x1073d3f4 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×2, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d3f4 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d3f4 — member vfunc calls: \['r30 v\[+0x8\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x8\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d3f4 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073d3f4 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073d3f4 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-layer parse/impl gate failure | Wrapper parse layer rejected an argument before the impl call.

- parse or impl arg gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d3f4`
- dispatch entry `0x10f11f1c`
- impl call `0x1073d4a4` obj `r5-in` slot `8` arg4 `*(sp-0x4b0+0x14)`
- impl call `0x1073d524` obj `vret(*(sp-0x4b0+0x4ac),+0x24)` slot `16` arg4 `sp+0x18`
- impl call `0x1073d538` obj `*(sp-0x4b0+0x4ac)` slot `12` arg4 `?`
- req vcall `0x1073d478` slot `8` (parse)

- fn 0x1073d3f4 @ 0x1073d3f4 — action wrapper handler
- @ 0x10f11f1c — action dispatch table entry

</details>

### `Stop`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Stops the virtual line-in transport.

**Technical description:** Stops VLI playback via impl->v\[+0x10\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | any u32 - impl entry does not range-check it in this build / u32 | none - required argument |

- **`InstanceID`** — u32 parsed via f_105614e0; passed to impl; no handler-side range check observed
  - validation: parse only at request layer
  - buffer cap: `0x18`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x1073d1f0 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d1f0 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d1f0 — member vfunc calls: \['r30 v\[+0x10\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x10\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d1f0 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x10\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073d1f0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073d1f0 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-layer parse/impl gate failure | Wrapper parse layer rejected an argument before the impl call.

- parse or impl arg gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** impl f_104164c4: flag-setter thunk (r4=0) tail-calling shared transport worker f_1041616c; residual = worker rc domain (call-derived)
**Bounded unknown — unresolved:** codes for session-state rejections


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d1f0`
- dispatch entry `0x10f11f28`
- impl call `0x1073d26c` obj `r5-in` slot `16` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073d2d0` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073d24c` slot `8` (parse)

- fn 0x1073d1f0 @ 0x1073d1f0 — action wrapper handler
- @ 0x10f11f28 — action dispatch table entry

</details>

### `StopTransmission`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Ends the line-in transmission from the given coordinator.

**Technical description:** Stops the VLI transmission to CoordinatorID via impl->v\[+0xc\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | any u32 - impl entry does not range-check it in this build / u32 | none - required argument |
| `CoordinatorID` | SonosStringArg | yes | any non-empty string parseable by f_1056157c / length-bounded by parse-helper buffer cap | none - required argument |

- **`InstanceID`** — u32 parsed via f_105614e0; passed to impl; no handler-side range check observed
  - validation: parse only at request layer
  - buffer cap: `0x18`
- **`CoordinatorID`** — coordinator zone UUID string via f_1056157c; parse failure -> 402
  - validation: non-empty parse required
  - buffer cap: `0x400`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x1073d544 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r30 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d544 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d544 — member vfunc calls: \['r30 v\[+0xc\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0xc\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x1073d544 — no transition-literal/store pattern; member delegates: \['r30 v\[+0xc\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073d544 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073d544 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-layer parse/impl gate failure | Wrapper parse layer rejected an argument before the impl call.

- parse or impl arg gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d544`
- dispatch entry `0x10f11f34`
- impl call `0x1073d5ec` obj `r5-in` slot `12` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073d650` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x1073d5c8` slot `8` (parse)

- fn 0x1073d544 @ 0x1073d544 — action wrapper handler
- @ 0x10f11f34 — action dispatch table entry

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `A_ARG_TYPE_InstanceID` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_PlayerID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Volume` | ui2 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_CurrentTransportSettings` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Speed` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `CurrentTrackMetaData` | string | yes | evented state variable — appears in VirtualLineIn LastChange/GENA event notifications |
| `EnqueuedTransportURIMetaData` | string | no | non-evented VirtualLineIn state variable — read via action out-args, not pushed |
| `AVTransportURIMetaData` | string | no | non-evented VirtualLineIn state variable — read via action out-args, not pushed |
| `CurrentTransportActions` | string | no | non-evented VirtualLineIn state variable — read via action out-args, not pushed |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /MediaRenderer/VirtualLineIn/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `virtualLineIn`
- **notify_path:** 'setVirtualLineInGroupIDLocked'/'VirtualLineInGroupID' state + internal event bus; no dedicated emitter recovered
- **wss_registry:**
  - idx: 70, name: virtualLineIn, id: 309, tag: 77

## Dispatcher-level errors

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search


Implementation sources (recovered): `common/vli_{sink,source_manager,playback_tracker}.cxx`, `zoneplayer/media_player_vli_ctrl.cxx`

<details><summary>Service evidence (3)</summary>

- @ 0x101953c8 — service router function
- @ 0x10f11ed4 — service vtable
- @ 0x1073ccc0 — service dispatcher

</details>
