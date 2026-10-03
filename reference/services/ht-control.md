# `HTControl` `/HTControl/Control`

**visibility** `advertised` · **status** `strong`

This service manages the remote-control features of a home-theater product, meaning a soundbar like the Playbar that sits under your TV. It covers the infrared repeater (the feature that passes your TV remote's volume commands through to the speaker), the little light-up feedback the unit gives when it receives a remote command, and the remote-learning wizard, which is the part of setup where you point your TV remote at the soundbar and press volume-up so it learns the signal. Everything here exists because a soundbar's job is to cooperate with the remote you already own.

<details markdown="1"><summary><b>Technical details</b></summary>

Home-theater control service: IR repeater state, LED feedback, and IR-remote learning/identification.

</details>

## Availability

- capability flags `0x400`
- enabled gate: `xor(*(r3-in+0x571c))` at `0x10195698` (field_inverted)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x400`
- dispatcher `0x10739730` kind `table`
- action table `0x10f11b90`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `CommitLearnedIRCodes` | advertised | callable | `strong` | virtual | 402 |
| `GetIRRepeaterState` | advertised | callable | `strong` | virtual | 402 |
| `GetLEDFeedbackState` | advertised | callable | `strong` | virtual | 402 |
| `IdentifyIRRemote` | advertised | callable | `strong` | virtual | 402 |
| `IsRemoteConfigured` | advertised | callable | `strong` | virtual | 402 |
| `LearnIRCode` | advertised | callable | `strong` | virtual | 402 |
| `SetIRRepeaterState` | advertised | callable | `strong` | virtual | 401, 402, 501 |
| `SetLEDFeedbackState` | advertised | callable | `strong` | virtual | 402 |

### `CommitLearnedIRCodes`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Saves a set of infrared codes the speaker just learned. During remote setup the unit listens for your TV remote's signals and captures them. This command stores those captured codes under a name so the association persists, since otherwise the learning session would be forgotten.

<details markdown="1"><summary><b>Technical details</b></summary>

Commits learned codes under Name via impl->v\[+0x18\] on the svc+4 member.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Name` | SonosStringArg | yes | impl accepts only the empty string for a non-faulting path (and even that returns 402); any non-empty -> 501 / max 31 chars | none - required argument |

- **`Name`**: impl reads first byte only: 0 (empty) -> 402, nonzero -> 501; commit never proceeds in this build
  - validation: non-empty value always faults 501; empty faults 402
  - buffer cap: `0x20`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10739968; wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739968; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739968; member vfunc calls: \['*(r30+4) v\[+0x18\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x18\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739968; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x18\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739968; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739968; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl-level validation/argument rejection (r3=0x192) | Wrapper parse layer rejected an argument before the impl call.

- impl arg validation failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** HT impl rc surfaced
**Bounded unknown (unresolved):** codes for hardware/validation failures



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10739968`
- dispatch entry `0x10f11b90` (voff `28`)
- impl call `0x107399e8` obj `*(r3-in+0x4)` slot `24` arg4 `sp-0x34`
- impl call `0x10739a4c` obj `*(sp-0x50+0x4c)` slot `12` arg4 `402`
- req vcall `0x107399c8` slot `8` (parse)

- fn 0x10739968 @ 0x10739968; action wrapper handler
- @ 0x10f11b90; action dispatch table entry

</details>

### `GetIRRepeaterState`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Reports whether the infrared repeater is currently on. In other words, whether the speaker is passing your TV remote's volume and mute commands through to itself or ignoring them.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns the IR-repeater enabled state via impl->v\[+0x8\] on r4-in.

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentIRRepeaterState` | SonosBoolArg | "0" or "1" via bool-style parse helper; literal semantics under action validation / {0,1} |

- **`CurrentIRRepeaterState`**: state string copied from impl member this+0x1ec under lock this+0x150
  - validation: impl copies member string verbatim; no output validation layer

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10739d30; wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739d30; req-vfunc call map: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739d30; member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x8\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x8\], *(r30+4) v\[+0x8\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739d30; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739d30; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739d30; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `confirmed`

impl returns 0 unconditionally (single literal-0 exit); only the handler request-gate can fault | Wrapper parse layer rejected an argument before the impl call.

- impl arg validation failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10739d30`
- dispatch entry `0x10f11b9c` (voff `12`)
- impl call `0x10739d68` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10739d8c` obj `*(r3-in+0x4)` slot `8` arg4 `sp-0x20`
- impl call `0x10739da8` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0x8)`
- impl call `0x10739e0c` obj `vret(*(sp-0x30+0x2c),+0x24)` slot `16` arg4 `sp+0x10`
- req vcall `0x10739e20` slot `12` (commit)

- fn 0x10739d30 @ 0x10739d30; action wrapper handler
- @ 0x10f11b9c; action dispatch table entry

</details>

### `GetLEDFeedbackState`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Reports whether the speaker is set to flash its indicator light when it receives an infrared remote command. This is the visual 'yes, I heard you' that some people disable because they find the blink distracting.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns the LED-feedback state via impl->v\[+0x8\] on r4-in.

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `LEDFeedbackState` | SonosBoolArg | "0" or "1" via bool-style parse helper; literal semantics under action validation / {0,1} |

- **`LEDFeedbackState`**: member LED state emitted under lock this+0x200; NULL out or len==0 -> 402
  - validation: impl emits member state verbatim

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10739c34; wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0x24\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739c34; req-vfunc call map: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x24\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739c34; member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x24\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x8\], *(r30+4) v\[+0x24\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x24\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739c34; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x24\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739c34; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739c34; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl-level validation/argument rejection (r3=0x192) | Wrapper parse layer rejected an argument before the impl call.

- impl arg validation failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** HT impl rc surfaced
**Bounded unknown (unresolved):** codes for hardware/validation failures



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10739c34`
- dispatch entry `0x10f11ba8` (voff `40`)
- impl call `0x10739c6c` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10739c90` obj `*(r3-in+0x4)` slot `36` arg4 `sp-0x18`
- impl call `0x10739cac` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0x24)`
- impl call `0x10739d10` obj `vret(*(sp-0x30+0x2c),+0x24)` slot `16` arg4 `sp+0x18`
- req vcall `0x10739d24` slot `12` (commit)

- fn 0x10739c34 @ 0x10739c34; action wrapper handler
- @ 0x10f11ba8; action dispatch table entry

</details>

### `IdentifyIRRemote`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Runs the part of remote setup where the speaker tries to figure out what brand or family of remote is being pointed at it. You aim your remote and press a button within a time limit, and the speaker classifies the signal so it can respond to that remote's command set going forward.

<details markdown="1"><summary><b>Technical details</b></summary>

Identifies an IR remote with a Timeout via impl->v\[+0xc\] on the sp+0x2c member.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Timeout` | SonosUintArg | yes | \[0,0xffffea5f\] per impl cmplwi bound / \[0, 0xffffea5f\] | none - required argument |

- **`Timeout`**: u32; same <0xffffea60 gate else 402; handler ALSO parses an undocumented IRCode string arg (<=0x20 chars) not present in the declared signature
  - validation: cmplwi vs 0xffffea60 else 402
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10241f24; wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1)
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10241f24; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): none - impl works on req/inline members only
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10241f24; member vfunc calls: \[\]

</details>


#### Side effects

- impl delegates op internally (no member vfunc call captured); arg-driven, stores=0

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): none
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10241f24; no transition-literal/store pattern; member delegates: \[\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10241f24; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10241f24; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl-level validation/argument rejection (r3=0x192) | Wrapper parse layer rejected an argument before the impl call.

- impl arg validation failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** HT impl rc surfaced
**Bounded unknown (unresolved):** codes for hardware/validation failures



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10241f24`
- dispatch entry `0x10f11bb4` (voff `20`)
- impl call `0x10241ffc` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10241f80` slot `8` (parse)

- fn 0x10241f24 @ 0x10241f24; action wrapper handler
- @ 0x10f11bb4; action dispatch table entry

</details>

### `IsRemoteConfigured`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Reports whether the speaker has already been taught a remote, meaning whether the remote-learning setup has been done. The app uses this to decide whether to offer the setup wizard or go straight to settings.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns whether an IR remote is configured via impl->v\[+0x8\] on r4-in.

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `RemoteConfigured` | boolean ('0'/'1') | {0,1} byte / length-bounded by parse-helper buffer cap |

- **`RemoteConfigured`**: flag byte read from impl member this+0x218
  - validation: single byte 0/1 written to out

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10739b48; wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739b48; req-vfunc call map: {'0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739b48; member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x1c\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x8\], *(r30+4) v\[+0x1c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739b48; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x1c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739b48; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739b48; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`402`** `confirmed`

impl returns 0 unconditionally (single literal-0 exit); only the handler request-gate can fault | Wrapper parse layer rejected an argument before the impl call.

- impl arg validation failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10739b48`
- dispatch entry `0x10f11bc0` (voff `32`)
- impl call `0x10739b80` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10739ba0` obj `*(r3-in+0x4)` slot `28` arg4 `sp-0x15`
- impl call `0x10739bbc` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0x1c)`
- req vcall `0x10739c28` slot `12` (commit)

- fn 0x10739b48 @ 0x10739b48; action wrapper handler
- @ 0x10f11bc0; action dispatch table entry

</details>

### `LearnIRCode`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Captures a single infrared code: you point your remote at the speaker and press a button within a time limit, and it records the raw signal. Individual learned codes are then stored permanently by CommitLearnedIRCodes.

<details markdown="1"><summary><b>Technical details</b></summary>

Captures an IRCode within Timeout via impl->v\[+0xc\] on the sp+0x4c member.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `IRCode` | SonosStringArg | yes | unrestricted - impl never reads the value / length-bounded by parse-helper buffer cap | none - required argument |
| `Timeout` | SonosUintArg | yes | \[0,0xffffea5f\] per impl cmplwi bound / \[0, 0xffffea5f\] | none - required argument |

- **`IRCode`**: string arg; impl (f_10242dfc) does not inspect it - only Timeout is validated
  - validation: no impl-level validation observed
  - buffer cap: `0x20`
- **`Timeout`**: u32; impl requires value < 0xffffea60 (unsigned cmplwi) else 402 - effectively unrestricted
  - validation: cmplwi vs 0xffffea60; >= bound -> 402
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10242008; wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1)
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10242008; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): none - impl works on req/inline members only
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10242008; member vfunc calls: \[\]

</details>


#### Side effects

- impl delegates op internally (no member vfunc call captured); arg-driven, stores=0

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): none
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10242008; no transition-literal/store pattern; member delegates: \[\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10242008; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10242008; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl-level validation/argument rejection (r3=0x192) | Wrapper parse layer rejected an argument before the impl call.

- impl arg validation failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** HT impl rc surfaced
**Bounded unknown (unresolved):** codes for hardware/validation failures



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10242008`
- dispatch entry `0x10f11bcc` (voff `24`)
- impl call `0x1024210c` obj `*(sp-0x50+0x4c)` slot `12` arg4 `402`
- req vcall `0x1024208c` slot `8` (parse)

- fn 0x10242008 @ 0x10242008; action wrapper handler
- @ 0x10f11bcc; action dispatch table entry

</details>

### `SetIRRepeaterState`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Turns the infrared repeater on or off, which controls whether TV remote volume commands should control the soundbar at all. With it off, the soundbar ignores your TV remote's volume commands entirely.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets the IR-repeater state (DesiredIRRepeaterState) via impl->v\[+0xc\] on the svc+4 member.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredIRRepeaterState` | SonosBoolArg | yes | {On,Off} - literal strcmp / max 8 chars | none - required argument |

- **`DesiredIRRepeaterState`**: impl does literal strcmp vs 'On' then 'Off' (0x10fe55b8/0x10e739b8); any other value -> 402
  - validation: impl strcmp vs 'On'/'Off' else 402
  - buffer cap: `0x9`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10739878; wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739878; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739878; member vfunc calls: \['*(r30+4) v\[+0xc\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0xc\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739878; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0xc\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739878; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739878; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl-level validation/argument rejection (r3=0x192) | Wrapper parse layer rejected an argument before the impl call.

- impl arg validation failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** HT impl rc surfaced
**Bounded unknown (unresolved):** codes for hardware/validation failures

**`401`** `strong`

IR-repeater capability absent (member obj check at impl+0x150)

- *(impl+0x150) probe call -> 401 path

**`501`** `strong`

IR repeater not implemented on this hardware (cntlzw flag from member)

- flag null -> 501



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10739878`
- dispatch entry `0x10f11bd8` (voff `16`)
- impl call `0x107398f8` obj `*(r3-in+0x4)` slot `12` arg4 `sp-0x20`
- impl call `0x1073995c` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x107398d8` slot `8` (parse)

- fn 0x10739878 @ 0x10739878; action wrapper handler
- @ 0x10f11bd8; action dispatch table entry

</details>

### `SetLEDFeedbackState`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Turns the remote-received light flash on or off. This is the visual acknowledgement toggle: switching it off stops the flash when you use the remote.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets LED feedback (LEDFeedbackState) via impl->v\[+0x20\] on the svc+4 member.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `LEDFeedbackState` | SonosBoolArg | yes | {On,Off} - literal strcmp / max 3 chars | none - required argument |

- **`LEDFeedbackState`**: impl strcmp vs 'On'/'Off'; else 402
  - validation: impl strcmp vs 'On'/'Off' else 402
  - buffer cap: `0x4`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10739a58; wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x20\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739a58; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x20\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739a58; member vfunc calls: \['*(r30+4) v\[+0x20\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x20\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x20\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739a58; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x20\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739a58; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10739a58; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl-level validation/argument rejection (r3=0x192) | Wrapper parse layer rejected an argument before the impl call.

- impl arg validation failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** HT impl rc surfaced
**Bounded unknown (unresolved):** impl has exactly two exits: {402,0} -- 402 path follows the input-string strcmp gate, 0 on accept



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10739a58`
- dispatch entry `0x10f11be4` (voff `36`)
- impl call `0x10739ad8` obj `*(r3-in+0x4)` slot `32` arg4 `sp-0x18`
- impl call `0x10739b3c` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10739ab8` slot `8` (parse)

- fn 0x10739a58 @ 0x10739a58; action wrapper handler
- @ 0x10f11be4; action dispatch table entry

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `TOSLinkConnected` | boolean | yes | evented state variable: appears in HTControl LastChange/GENA event notifications |
| `IRRepeaterState` | string | yes | evented state variable: appears in HTControl LastChange/GENA event notifications |
| `A_ARG_TYPE_Timeout` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_IRRemoteName` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_IRCode` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `RemoteConfigured` | boolean | no | non-evented HTControl state variable: read via action out-args, not pushed |
| `LEDFeedbackState` | string | no | non-evented HTControl state variable: read via action out-args, not pushed |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /HTControl/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `htControl`
<details markdown="1"><summary><b>Technical details</b></summary>

- **notify_path:** f_10739c34/f_10782194 emit {LEDFeedbackState, RemoteConfigured}
- **wss_registry:**
  - idx: 41, name: htControl, id: 149, tag: 72

</details>


## Dispatcher-level errors

<details markdown="1"><summary><b>Technical details</b></summary>

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search



</details>

Implementation sources (recovered): `zoneplayer/htaudio.cxx`, `zoneplayer/htaudio_satellite_tx.cxx`, `audio/hometheater/htaudio_{configuration,chprocessing,chsnk_processor,chsnk_processor_stream,autoplay}.cxx`

<details markdown="1"><summary>Service evidence (3)</summary>

- @ 0x101953c8; service router function
- @ 0x10ea61d0; service vtable
- @ 0x10739730; service dispatcher

</details>
