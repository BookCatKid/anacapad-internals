# `DeviceProperties` `/DeviceProperties/Control`

**visibility** `advertised` · **status** `strong`

This service manages the speaker's own settings, meaning the properties of the physical device rather than anything about music. It covers the status LED and the physical buttons on top (including locking them so kids can't press them), the room name and icon that show up in the app, and the player's identity inside the household. It is also where speaker bonding lives: turning two identical speakers into a stereo pair, attaching surround speakers or a subwoofer to a soundbar, and undoing those bonds. On top of that it owns the autoplay defaults, which decide what a player should automatically do when a familiar source comes back, and a configuration mode that apps enter during setup and diagnostics. In short: everything you would find under 'this speaker' in system settings routes through here.

<details markdown="1"><summary><b>Technical details</b></summary>

Device properties service: LED/button state, zone attributes, stereo-pair and home-theater satellite bonding, config mode, and autoplay defaults.

</details>

## Availability

- capability flags `0x1`
- enabled gate: `vret(r3-in,+0x78)` at `0x1068bd2c` (expr)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x1068bc0c`, cap flags `0x1`
- dispatcher `0x10735c04` kind `table`
- action table `0x10f1190c`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `AddBondedZones` | advertised | callable | `strong` | direct | 402 |
| `AddHTSatellite` | advertised | callable | `strong` | direct | 402 |
| `CreateStereoPair` | advertised | callable | `strong` | direct | 402 |
| `EnterConfigMode` | advertised | callable | `strong` | direct | 402 |
| `ExitConfigMode` | advertised | callable | `strong` | direct | 402 |
| `GetAutoplayLinkedZones` | advertised | callable | `strong` | direct | 402 |
| `GetAutoplayRoomUUID` | advertised | callable | `strong` | direct | 402 |
| `GetAutoplayVolume` | advertised | callable | `strong` | direct | 402 |
| `GetButtonLockState` | advertised | callable | `strong` | direct | 402 |
| `GetButtonState` | advertised | callable | `strong` | direct | 402 |
| `GetHouseholdID` | advertised | callable | `strong` | direct | 402 |
| `GetLEDState` | advertised | callable | `strong` | direct | 402 |
| `GetUseAutoplayVolume` | advertised | callable | `strong` | direct | 402 |
| `GetZoneAttributes` | advertised | callable | `strong` | direct | 402 |
| `GetZoneInfo` | advertised | callable | `strong` | direct | 402 |
| `RemoveBondedZones` | advertised | callable | `strong` | direct | 402 |
| `RemoveHTSatellite` | advertised | callable | `strong` | direct | 402 |
| `RoomDetectionStartChirping` | advertised | callable | `strong` | direct | 402 |
| `RoomDetectionStopChirping` | advertised | callable | `strong` | direct | 402 |
| `SeparateStereoPair` | advertised | callable | `strong` | direct | 402 |
| `SetAutoplayLinkedZones` | advertised | callable | `strong` | direct | 402 |
| `SetAutoplayRoomUUID` | advertised | callable | `strong` | direct | 402 |
| `SetAutoplayVolume` | advertised | callable | `strong` | direct | 402 |
| `SetButtonLockState` | advertised | callable | `strong` | direct | 402 |
| `SetLEDState` | advertised | callable | `strong` | direct | 402 |
| `SetUseAutoplayVolume` | advertised | callable | `strong` | direct | 402 |
| `SetZoneAttributes` | advertised | callable | `strong` | direct | 402 |

### `AddBondedZones`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Bonds additional speakers to this one so they behave as a single room. The argument describes which channel each added speaker should play, for example which speaker becomes left and which becomes right. This is one of the building blocks the app uses when you group speakers into a surround setup or stereo arrangement. Unlike casual grouping, a bond is a deeper hardware-level association: the bonded speakers share a room identity and split audio channels between them rather than just playing in sync.

<details markdown="1"><summary><b>Technical details</b></summary>

Adds bonded zones (ChannelMapSet) via impl->v\[+0x18\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ChannelMapSet` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 639 chars | none; required input |

- **`ChannelMapSet`**: Channel-map DSL string selecting the channels affected by the bonding operation
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x280`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10735e4c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735e4c; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735e4c; member vfunc calls: \['r30 v\[+0x18\]'\]

</details>


#### Side effects

- state mutation delegated to impl->v\[+0x18\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735e4c; no transition-literal/store pattern; member delegates: \['r30 v\[+0x18\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735e4c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735e4c; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10735e4c`
- dispatch entry `0x10f1190c`
- impl call `0x10735ecc` obj `r5-in` slot `24` arg4 `sp-0x294`
- impl call `0x10735f30` obj `*(sp-0x2b0+0x2ac)` slot `12` arg4 `402`
- req vcall `0x10735eac` slot `8` (parse)

- fn 0x10735e4c @ 0x10735e4c; action wrapper handler
- @ 0x10f1190c; action dispatch table entry
- fn 0x1068f8cc; impl vtable 0x10e98278 slot +0x18; direct impl body

</details>

### `AddHTSatellite`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Attaches one speaker to this player as a home-theater satellite, the role surround speakers or a sub play behind a soundbar. You name the room the satellite lives in and describe which channels it should carry, and the speaker integrates it into the home-theater rig. This is part of what happens when you set up 'Playbar plus surrounds' in the app.

<details markdown="1"><summary><b>Technical details</b></summary>

Adds a home-theater satellite with HTSatChanMapSet via impl->v\[+0x48\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `HTSatChanMapSet` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 639 chars | none; required input |

- **`HTSatChanMapSet`**: Home-theater satellite channel-map string
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x280`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10737e14; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×2); member delegates: r30 v\[+0x48\], r30 v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737e14; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0xc': 2, '0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x48\], r30 v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737e14; member vfunc calls: \['r30 v\[+0x48\]', 'r30 v\[+0xc\]'\]

</details>


#### Side effects

- state mutation delegated to impl->v\[+0x48\] then impl->v\[+0x0c\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x48\], r30 v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737e14; no transition-literal/store pattern; member delegates: \['r30 v\[+0x48\]', 'r30 v\[+0xc\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737e14; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737e14; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0xc': 2, '0x14': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10737e14`
- dispatch entry `0x10f11918`
- impl call `0x10737e94` obj `r5-in` slot `72` arg4 `sp-0x294`
- impl call `0x10737edc` obj `r5-in` slot `116` arg4 `?`
- impl call `0x10737f30` obj `xor(*(r2+0xffff8ff8))` slot `12` arg4 `?`
- req vcall `0x10737e74` slot `8` (parse)
- req vcall `0x10737eb8` slot `12` (commit)

- fn 0x10737e14 @ 0x10737e14; action wrapper handler
- @ 0x10f11918; action dispatch table entry
- fn 0x1017fa08; impl vtable 0x10e98278 slot +0x48; secondary-base trampoline this-0x3a8 via 0x1017fa90

</details>

### `CreateStereoPair`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Joins two matching speakers into a stereo pair: one playing the left channel, one the right, presented in the app as a single room. The argument describes which physical speaker takes which channel. After bonding, the pair behaves as one logical speaker for almost everything else, including playback, grouping, and volume.

<details markdown="1"><summary><b>Technical details</b></summary>

Bonds two players into a stereo pair with ChannelMapSet via impl->v\[+0x20\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ChannelMapSet` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 639 chars | none; required input |

- **`ChannelMapSet`**: Channel-map DSL string selecting the channels affected by the bonding operation
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x280`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10735f3c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x20\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735f3c; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x20\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735f3c; member vfunc calls: \['r30 v\[+0x20\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x20\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x20\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735f3c; no transition-literal/store pattern; member delegates: \['r30 v\[+0x20\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735f3c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735f3c; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10735f3c`
- dispatch entry `0x10f11924`
- impl call `0x10735fbc` obj `r5-in` slot `32` arg4 `sp-0x294`
- impl call `0x10736020` obj `*(sp-0x2b0+0x2ac)` slot `12` arg4 `402`
- req vcall `0x10735f9c` slot `8` (parse)

- fn 0x10735f3c @ 0x10735f3c; action wrapper handler
- @ 0x10f11924; action dispatch table entry
- fn 0x1069039c; impl vtable 0x10e98278 slot +0x20; direct impl body

</details>

### `EnterConfigMode`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Puts the speaker into a special configuration mode used during setup, diagnostics, or factory servicing. You pass a mode name plus options, and it returns the state the device ended up in. This is deliberately not a normal-day command: the app uses it for onboarding flows and support tools, and while it is active the speaker behaves differently from usual.

<details markdown="1"><summary><b>Technical details</b></summary>

Enters a device config Mode with Options, returning State via impl->v\[+0x60\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Mode` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 31 chars | none; required input |
| `Options` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 127 chars | none; required input |

- **`Mode`**: Config-mode selector string
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x20`
- **`Options`**: Config-mode options string
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x80`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `State` | response field | config-mode state string produced by the mode-context member / per the response writer |

- **`State`**: Resulting config-mode state string written to the response
  - validation: emitted via the response object vfuncs

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073611c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×2, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x60\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073611c; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x60\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073611c; member vfunc calls: \['r30 v\[+0x60\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x60\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x60\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073611c; no transition-literal/store pattern; member delegates: \['r30 v\[+0x60\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073611c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073611c; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | impl is a returns r3+0x9d04 -> real worker member accessor | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073611c`
- dispatch entry `0x10f11930`
- impl call `0x107361d0` obj `r5-in` slot `96` arg4 `sp-0x4b4`
- impl call `0x10736250` obj `vret(*(sp-0x4d0+0x4cc),+0x24)` slot `16` arg4 `sp+0xbc`
- impl call `0x10736264` obj `*(sp-0x4d0+0x4cc)` slot `12` arg4 `?`
- req vcall `0x107361a4` slot `8` (parse)

- fn 0x1073611c @ 0x1073611c; action wrapper handler
- @ 0x10f11930; action dispatch table entry
- fn 0x1012bb4c; impl vtable 0x10e98278 slot +0x60; secondary-base trampoline this-0x3a8 via 0x1012bb60; terminal returns adjusted member pointer

</details>

### `ExitConfigMode`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Takes the speaker back out of configuration mode after EnterConfigMode, restoring normal behavior. The options say how to exit, for example whether to keep or discard changes made while in that mode.

<details markdown="1"><summary><b>Technical details</b></summary>

Exits config mode with Options via impl->v\[+0x64\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Options` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 127 chars | none; required input |

- **`Options`**: Exit options string
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x80`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10736270; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x64\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736270; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x64\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736270; member vfunc calls: \['r30 v\[+0x64\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x64\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x64\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736270; no transition-literal/store pattern; member delegates: \['r30 v\[+0x64\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736270; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736270; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | impl is a returns r3+0x5b60 -> real worker member accessor | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10736270`
- dispatch entry `0x10f1193c`
- impl call `0x107362f0` obj `r5-in` slot `100` arg4 `sp-0x94`
- impl call `0x10736354` obj `*(sp-0xb0+0xac)` slot `12` arg4 `402`
- req vcall `0x107362d0` slot `8` (parse)

- fn 0x10736270 @ 0x10736270; action wrapper handler
- @ 0x10f1193c; action dispatch table entry
- fn 0x1019db48; impl vtable 0x10e98278 slot +0x64; secondary-base trampoline via 0x1019db58; returns this+0x5b60 member

</details>

### `GetAutoplayLinkedZones`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports whether autoplay is allowed to bring grouped speakers along: when a player resumes a source automatically, should it also wake up the rooms it is grouped with? A simple on/off setting read back by the app.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns IncludeLinkedZones flag via impl->v\[+0x1c\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Source` | SonosStringArg | yes | impl-side grammar applies / max 4 chars | none - required argument |

- **`Source`**: autoplay source identifier string (which line-in/source the autoplay volume applies to)
  - validation: consumed by the impl vfunc

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `IncludeLinkedZones` | boolean ('0'/'1') | 0/1 flag read from the autoplay-linked member / per the response writer |

- **`IncludeLinkedZones`**: Whether autoplay extends to linked zones
  - validation: emitted via the response object vfuncs

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10736c84; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×2, validate×1, commit×1); member delegates: r28 v\[+0x2c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736c84; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r28 v\[+0x2c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736c84; member vfunc calls: \['r28 v\[+0x2c\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate (obj->v\[+0x2c\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r28 v\[+0x2c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736c84; no transition-literal/store pattern; member delegates: \['r28 v\[+0x2c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736c84; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736c84; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10736c84`
- dispatch entry `0x10f11948`
- impl call `0x10736cdc` obj `r4-in` slot `28` arg4 `Source`
- impl call `0x10736d08` obj `r4-in` slot `8` arg4 `?`
- impl call `0x10736d2c` obj `r5-in` slot `44` arg4 `sp-0x2d`
- impl call `0x10736d48` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x2c)`
- impl call `0x10736dd8` obj `vret(*(sp-0x40+0x3c),+0x24)` slot `16` arg4 `*(sp-0x40+0x38)`
- req vcall `0x10736dc4` slot `36` (other)
- req vcall `0x10736dec` slot `12` (commit)

- fn 0x10736c84 @ 0x10736c84; action wrapper handler
- @ 0x10f11948; action dispatch table entry
- fn 0x10193708; impl vtable 0x10e98278 slot +0x2c; secondary-base trampoline via 0x1019399c

</details>

### `GetAutoplayRoomUUID`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports which room this speaker will automatically join (or treat as the source) when autoplay kicks in. Autoplay is Sonos's 'resume what this room does' feature: if the configured room starts playing, this speaker follows. This command reads which room was chosen for that.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns the configured autoplay RoomUUID via impl->v\[+0x1c\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Source` | SonosStringArg | yes | impl-side grammar applies / max 4 chars | none - required argument |

- **`Source`**: autoplay source identifier string (which line-in/source the autoplay volume applies to)
  - validation: consumed by the impl vfunc

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `RoomUUID` | response field | UUID string stored in the autoplay record / per the response writer |

- **`RoomUUID`**: Configured autoplay source room UUID
  - validation: emitted via the response object vfuncs

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10736750; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×2, raise-fault×1, required-arg fetch×1, out-arg write×2, validate×1, commit×1); member delegates: r28 v\[+0x34\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736750; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 2, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r28 v\[+0x34\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736750; member vfunc calls: \['r28 v\[+0x34\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate (obj->v\[+0x34\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r28 v\[+0x34\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736750; no transition-literal/store pattern; member delegates: \['r28 v\[+0x34\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736750; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736750; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 2, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

worker f_1074c090 (632 insns): locked settings read - f_10988564/f_10988990 lock pair + RabortIfUnlocked; value via f_10765a00/f_105ab110; exit r3=r30 (call-derived); rc forwarded to req v\[+0x14\] under nonzero-fault convention | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10736750`
- dispatch entry `0x10f11954`
- impl call `0x107367a8` obj `r4-in` slot `28` arg4 `Source`
- impl call `0x107367d4` obj `r4-in` slot `8` arg4 `?`
- impl call `0x107367fc` obj `r5-in` slot `52` arg4 `sp-0x40`
- impl call `0x10736818` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x34)`
- impl call `0x10736888` obj `vret(*(sp-0x60+0x5c),+0x24)` slot `16` arg4 `sp+0x20`
- impl call `0x107368b4` obj `vret(*(sp-0x60+0x5c),+0x24)` slot `16` arg4 `*(sp-0x60+0x58)`
- req vcall `0x107368a0` slot `36` (other)
- req vcall `0x107368c8` slot `12` (commit)

- fn 0x10736750 @ 0x10736750; action wrapper handler
- @ 0x10f11954; action dispatch table entry
- fn 0x1017fbcc; impl vtable 0x10e98278 slot +0x34; secondary-base trampoline via 0x1017fbe0 -> loads *(this+0x9d6c) then f_1074c090

</details>

### `GetAutoplayVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports the volume the speaker should use when autoplay starts it playing. This is separate from its normal volume, so a wake-up source does not blast at whatever the level happened to be.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns CurrentVolume used for autoplay via impl->v\[+0x1c\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Source` | SonosStringArg | yes | impl-side grammar applies / max 4 chars | none - required argument |

- **`Source`**: autoplay source identifier string (which line-in/source the autoplay volume applies to)
  - validation: consumed by the impl vfunc

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentVolume` | unsigned int16 | u16 volume member value / per the response writer |

- **`CurrentVolume`**: Configured autoplay volume
  - validation: emitted via the response object vfuncs

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x107370ac; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×2, validate×1, commit×1); member delegates: r28 v\[+0x3c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107370ac; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r28 v\[+0x3c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107370ac; member vfunc calls: \['r28 v\[+0x3c\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate (obj->v\[+0x3c\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r28 v\[+0x3c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107370ac; no transition-literal/store pattern; member delegates: \['r28 v\[+0x3c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107370ac; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107370ac; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107370ac`
- dispatch entry `0x10f11960`
- impl call `0x10737104` obj `r4-in` slot `28` arg4 `Source`
- impl call `0x10737130` obj `r4-in` slot `8` arg4 `?`
- impl call `0x10737154` obj `r5-in` slot `60` arg4 `sp-0x2e`
- impl call `0x10737170` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x3c)`
- impl call `0x10737200` obj `vret(*(sp-0x40+0x3c),+0x24)` slot `16` arg4 `*(sp-0x40+0x38)`
- req vcall `0x107371ec` slot `36` (other)
- req vcall `0x10737214` slot `12` (commit)

- fn 0x107370ac @ 0x107370ac; action wrapper handler
- @ 0x10f11960; action dispatch table entry
- fn 0x10188024; impl vtable 0x10e98278 slot +0x3c; secondary-base trampoline via 0x10188180

</details>

### `GetButtonLockState`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports whether the physical buttons on the speaker are locked. When locked, pressing play/pause or the volume rocker on the unit does nothing, which makes it the child-lock of the Sonos world. The app reads this to show the toggle's current position.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns CurrentButtonLockState via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentButtonLockState` | response field | enum string built from the lock-state member pair at this+0x5730/0x5734 / per the response writer |

- **`CurrentButtonLockState`**: Button-lock state string read from the impl member pair and written to the response
  - validation: emitted via the response object vfuncs

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x107377d4; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x70\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107377d4; req-vfunc call map: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x70\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107377d4; member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x70\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate (impl->v\[+0x70\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x70\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107377d4; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x70\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107377d4; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107377d4; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | impl is a lwz pair into out -> real worker shared_ptr copy accessor | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107377d4`
- dispatch entry `0x10f1196c`
- impl call `0x1073780c` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10737830` obj `r5-in` slot `112` arg4 `sp-0x18`
- impl call `0x1073784c` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x70)`
- impl call `0x107378b0` obj `vret(*(sp-0x30+0x2c),+0x24)` slot `16` arg4 `sp+0x18`
- req vcall `0x107378c4` slot `12` (commit)

- fn 0x107377d4 @ 0x107377d4; action wrapper handler
- @ 0x10f1196c; action dispatch table entry
- fn 0x101a07dc; impl vtable 0x10e98278 slot +0x70; secondary-base trampoline via 0x101a0840 (this in r4)

</details>

### `GetButtonState`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports the state of the speaker's physical buttons, meaning whether they are enabled and possibly their current pressed state. Diagnostic plumbing for the hardware controls.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns button state via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `State` | response field | impl-produced / per the response writer |

- **`State`**: button lock/panel state read from device state by impl 0x107378d0 and emitted as 'State'
  - validation: arg-name string loaded at 0x10737924 inside impl 0x107378d0; emitted via the response writer

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073799c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073799c; req-vfunc call map: {'0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073799c; member vfunc calls: \['r4 v\[+0x8\]'\]

</details>


#### Side effects

- read-only query: read-only; no delegate (inline member read; out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073799c; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073799c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073799c; commit/fault slot usage: {'0x14': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073799c`
- dispatch entry `0x10f11978`
- impl call `0x107379c8` obj `r4-in` slot `8` arg4 `r4-in`
- Outputs recovered from arg-name string loads inside the impl function (extractor missed them).

- fn 0x1073799c @ 0x1073799c; action wrapper handler
- @ 0x10f11978; action dispatch table entry
- fn 0x107378d0; impl vtable 0x10e98278 (no impl vfunc - handler-body impl); handler-body impl: parse via req v\[+0x08\] then tail f_107378d0

</details>

### `GetHouseholdID`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports the identifier of the Sonos household this speaker belongs to. Every speaker in a home shares one household ID, and it is how the system knows two players are part of the same installation rather than a neighbor's devices that happen to be reachable. Apps use this constantly behind the scenes to decide which speakers belong together.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns CurrentHouseholdID via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentHouseholdID` | response field | household UUID string from the member at this+0x901c / per the response writer |

- **`CurrentHouseholdID`**: Household identifier string
  - validation: emitted via the response object vfuncs

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10737a20; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x58\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737a20; req-vfunc call map: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x58\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737a20; member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x58\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate (impl->v\[+0x58\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x58\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737a20; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x58\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737a20; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737a20; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | impl is a lwz *(impl+0x2901c) - returns stored ptr -> real worker member accessor | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10737a20`
- dispatch entry `0x10f11984`
- impl call `0x10737a58` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10737a7c` obj `r5-in` slot `88` arg4 `sp-0x38`
- impl call `0x10737a98` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x58)`
- impl call `0x10737afc` obj `vret(*(sp-0x50+0x4c),+0x24)` slot `16` arg4 `sp+0x18`
- req vcall `0x10737b10` slot `12` (commit)

- fn 0x10737a20 @ 0x10737a20; action wrapper handler
- @ 0x10f11984; action dispatch table entry
- fn 0x1019dbb4; impl vtable 0x10e98278 slot +0x58; secondary-base trampoline via 0x1019dbc8 -> loads *(this+0x901c) member

</details>

### `GetLEDState`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports whether the speaker's status LED is on or off, which is the setting behind 'Status Light' in the app. The LED is the small indicator on the unit, and some people switch it off in bedrooms.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns CurrentLEDState via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentLEDState` | response field | enum string from the LED-state member / per the response writer |

- **`CurrentLEDState`**: Current front-LED state
  - validation: emitted via the response object vfuncs

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10737b1c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x14\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737b1c; req-vfunc call map: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x14\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737b1c; member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x14\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate (impl->v\[+0x14\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x14\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737b1c; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x14\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737b1c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737b1c; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10737b1c`
- dispatch entry `0x10f11990`
- impl call `0x10737b54` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10737b78` obj `r5-in` slot `20` arg4 `sp-0x18`
- impl call `0x10737b94` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x14)`
- impl call `0x10737bf8` obj `vret(*(sp-0x30+0x2c),+0x24)` slot `16` arg4 `sp+0x18`
- req vcall `0x10737c0c` slot `12` (commit)

- fn 0x10737b1c @ 0x10737b1c; action wrapper handler
- @ 0x10f11990; action dispatch table entry
- fn 0x10690b78; impl vtable 0x10e98278 slot +0x14; direct impl body

</details>

### `GetUseAutoplayVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports whether the speaker should apply its special autoplay volume when it starts playing automatically, or just keep whatever volume it already had. Together with the autoplay volume itself, this decides whether auto-started playback comes in at a set level or at whatever the speaker last used.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns UseVolume flag via impl->v\[+0x1c\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Source` | SonosStringArg | yes | impl-side grammar applies / max 4 chars | none - required argument |

- **`Source`**: autoplay source identifier string (which line-in/source the autoplay volume applies to)
  - validation: consumed by the impl vfunc

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `UseVolume` | boolean ('0'/'1') | 0/1 flag from the autoplay-volume member / per the response writer |

- **`UseVolume`**: Whether the autoplay volume is applied
  - validation: emitted via the response object vfuncs

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10736df8; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×2, validate×1, commit×1); member delegates: r28 v\[+0x44\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736df8; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r28 v\[+0x44\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736df8; member vfunc calls: \['r28 v\[+0x44\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate (obj->v\[+0x44\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r28 v\[+0x44\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736df8; no transition-literal/store pattern; member delegates: \['r28 v\[+0x44\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736df8; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736df8; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10736df8`
- dispatch entry `0x10f1199c`
- impl call `0x10736e50` obj `r4-in` slot `28` arg4 `Source`
- impl call `0x10736e7c` obj `r4-in` slot `8` arg4 `?`
- impl call `0x10736ea0` obj `r5-in` slot `68` arg4 `sp-0x2d`
- impl call `0x10736ebc` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x44)`
- impl call `0x10736f4c` obj `vret(*(sp-0x40+0x3c),+0x24)` slot `16` arg4 `*(sp-0x40+0x38)`
- req vcall `0x10736f38` slot `36` (other)
- req vcall `0x10736f60` slot `12` (commit)

- fn 0x10736df8 @ 0x10736df8; action wrapper handler
- @ 0x10f1199c; action dispatch table entry
- fn 0x1018a20c; impl vtable 0x10e98278 slot +0x44; secondary-base trampoline via 0x1018a570

</details>

### `GetZoneAttributes`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports this speaker's descriptive attributes: its room name, icon, and related presentation details. In other words, it is what the app shows for this device on the rooms screen.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns zone attributes via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentZoneName` | response field | impl-produced / per the response writer |
| `CurrentIcon` | response field | impl-produced / per the response writer |
| `CurrentConfiguration` | response field | impl-produced / per the response writer |
| `CurrentTargetRoomName` | response field | impl-produced / per the response writer |

- **`CurrentZoneName`**: configured room name emitted by impl 0x10737c18
  - validation: arg-name string loaded at 0x10737c88 inside impl 0x10737c18; emitted via the response writer
- **`CurrentIcon`**: configured zone icon identifier emitted by impl 0x10737c18
  - validation: arg-name string loaded at 0x10737cb4 inside impl 0x10737c18; emitted via the response writer
- **`CurrentConfiguration`**: zone configuration descriptor emitted by impl 0x10737c18
  - validation: arg-name string loaded at 0x10737ce4 inside impl 0x10737c18; emitted via the response writer
- **`CurrentTargetRoomName`**: target room name emitted by impl 0x10737c18
  - validation: arg-name string loaded at 0x10737d14 inside impl 0x10737c18; emitted via the response writer

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10737d90; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737d90; req-vfunc call map: {'0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737d90; member vfunc calls: \['r4 v\[+0x8\]'\]

</details>


#### Side effects

- read-only query: read-only; no delegate (inline member read; out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737d90; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737d90; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737d90; commit/fault slot usage: {'0x14': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10737d90`
- dispatch entry `0x10f119a8`
- impl call `0x10737dbc` obj `r4-in` slot `8` arg4 `r4-in`
- Outputs recovered from arg-name string loads inside the impl function (extractor missed them).

- fn 0x10737d90 @ 0x10737d90; action wrapper handler
- @ 0x10f119a8; action dispatch table entry
- fn 0x10737c18; impl vtable 0x10e98278 (no impl vfunc - handler-body impl); handler-body impl: parse then tail f_10737c18

</details>

### `GetZoneInfo`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports this speaker's identifying details: model, software version, and serial-related fields. This is the 'About my Sonos product' data you see in the app under the speaker's details, and it is also what support asks for when you call with a problem.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns zone info via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `SerialNumber` | response field | impl-produced / per the response writer |
| `SoftwareVersion` | response field | impl-produced / per the response writer |
| `DisplaySoftwareVersion` | response field | impl-produced / per the response writer |
| `HardwareVersion` | response field | impl-produced / per the response writer |
| `IPAddress` | response field | impl-produced / per the response writer |
| `MACAddress` | response field | impl-produced / per the response writer |
| `CopyrightInfo` | response field | impl-produced / per the response writer |
| `ExtraInfo` | response field | impl-produced / per the response writer |
| `HTAudioIn` | response field | impl-produced / per the response writer |
| `Flags` | response field | impl-produced / per the response writer |

- **`SerialNumber`**: device serial number emitted by impl 0x10737470
  - validation: arg-name string loaded at 0x10737530 inside impl 0x10737470; emitted via the response writer
- **`SoftwareVersion`**: running software version string emitted by impl 0x10737470
  - validation: arg-name string loaded at 0x1073755c inside impl 0x10737470; emitted via the response writer
- **`DisplaySoftwareVersion`**: user-facing software version emitted by impl 0x10737470
  - validation: arg-name string loaded at 0x1073758c inside impl 0x10737470; emitted via the response writer
- **`HardwareVersion`**: hardware version string emitted by impl 0x10737470
  - validation: arg-name string loaded at 0x107375bc inside impl 0x10737470; emitted via the response writer
- **`IPAddress`**: player IP address emitted by impl 0x10737470
  - validation: arg-name string loaded at 0x107375ec inside impl 0x10737470; emitted via the response writer
- **`MACAddress`**: player MAC address emitted by impl 0x10737470
  - validation: arg-name string loaded at 0x1073761c inside impl 0x10737470; emitted via the response writer
- **`CopyrightInfo`**: copyright/version notice emitted by impl 0x10737470
  - validation: arg-name string loaded at 0x1073764c inside impl 0x10737470; emitted via the response writer
- **`ExtraInfo`**: extra info blob emitted by impl 0x10737470
  - validation: arg-name string loaded at 0x1073767c inside impl 0x10737470; emitted via the response writer
- **`HTAudioIn`**: home-theater audio-in descriptor emitted by impl 0x10737470
  - validation: arg-name string loaded at 0x107376ac inside impl 0x10737470; emitted via the response writer
- **`Flags`**: capability flag word emitted by impl 0x10737470
  - validation: arg-name string loaded at 0x107376d0 inside impl 0x10737470; emitted via the response writer

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10737750; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737750; req-vfunc call map: {'0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737750; member vfunc calls: \['r4 v\[+0x8\]'\]

</details>


#### Side effects

- read-only query: read-only; no delegate (inline member read; out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737750; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737750; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737750; commit/fault slot usage: {'0x14': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10737750`
- dispatch entry `0x10f119b4`
- impl call `0x1073777c` obj `r4-in` slot `8` arg4 `r4-in`
- Outputs recovered from arg-name string loads inside the impl function (extractor missed them).

- fn 0x10737750 @ 0x10737750; action wrapper handler
- @ 0x10f119b4; action dispatch table entry
- fn 0x10737470; impl vtable 0x10e98278 (no impl vfunc - handler-body impl); handler-body impl: parse then tail f_10737470

</details>

### `RemoveBondedZones`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Breaks a hardware bond between speakers, which is the undo for AddBondedZones. You describe which bonded speakers to release and whether they should stay merely grouped (casual sync) afterward, and the speakers regain independent room identities.

<details markdown="1"><summary><b>Technical details</b></summary>

Removes bonded zones (ChannelMapSet, KeepGrouped flag) via impl->v\[+0x1c\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ChannelMapSet` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 639 chars | none; required input |
| `KeepGrouped` | boolean/numeric flag (type-tag-1, 24-byte record) | yes | nonzero = true; 0 = false (byte-width flag) / 0/1 | none; required input |

- **`ChannelMapSet`**: Channel-map DSL string selecting the channels affected by the bonding operation
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x280`
- **`KeepGrouped`**: Keep the zone grouped after unbonding
  - validation: flag consumed by the impl vfunc
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x107368d4; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r30 v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107368d4; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107368d4; member vfunc calls: \['r30 v\[+0x1c\]'\]

</details>


#### Side effects

- state mutation delegated to impl->v\[+0x1c\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107368d4; no transition-literal/store pattern; member delegates: \['r30 v\[+0x1c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107368d4; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107368d4; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | impl is a bctr through obj vfunc +0x18 -> real worker vfunc via *(r3)+0x18 | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107368d4`
- dispatch entry `0x10f119c0`
- impl call `0x10736990` obj `r5-in` slot `28` arg4 `sp-0x294`
- impl call `0x107369f8` obj `*(sp-0x2b0+0x2ac)` slot `12` arg4 `402`
- req vcall `0x1073696c` slot `8` (parse)

- fn 0x107368d4 @ 0x107368d4; action wrapper handler
- @ 0x10f119c0; action dispatch table entry
- fn 0x1068b7d0; impl vtable 0x10e98278 slot +0x1c; vtable thunk: forwards to *(this)->v\[+0x18\]

</details>

### `RemoveHTSatellite`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Detaches one home-theater satellite, such as a surround speaker or a sub, from this player's theater rig. The detached speaker goes back to being a normal standalone room.

<details markdown="1"><summary><b>Technical details</b></summary>

Removes HT satellite SatRoomUUID via impl->v\[+0x4c\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `SatRoomUUID` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 24 chars | none; required input |

- **`SatRoomUUID`**: Room UUID of the satellite to detach
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x19`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10737f3c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×2); member delegates: r30 v\[+0x4c\], r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737f3c; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0xc': 2, '0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x4c\], r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737f3c; member vfunc calls: \['r30 v\[+0x4c\]', 'r30 v\[+?\]'\]

</details>


#### Side effects

- state mutation delegated to impl->v\[+0x4c\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x4c\], r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737f3c; no transition-literal/store pattern; member delegates: \['r30 v\[+0x4c\]', 'r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737f3c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737f3c; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0xc': 2, '0x14': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | impl is a real fn -> real worker worker | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10737f3c`
- dispatch entry `0x10f119cc`
- impl call `0x10737fbc` obj `r5-in` slot `76` arg4 `sp-0x30`
- impl call `0x1073800c` obj `r5-in` slot `116` arg4 `?`
- impl call `0x10738060` obj `xor(*(r2+0xffff8ff8))` slot `12` arg4 `?`
- req vcall `0x10737f9c` slot `8` (parse)
- req vcall `0x10737fe0` slot `12` (commit)

- fn 0x10737f3c @ 0x10737f3c; action wrapper handler
- @ 0x10f119cc; action dispatch table entry
- fn 0x1068b998; impl vtable 0x10e98278 slot +0x4c; direct impl body

</details>

### `RoomDetectionStartChirping`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Makes a bonded speaker play a repeating chirp sound so the system (or you) can tell which physical box is which. This is the 'identify this speaker' feature used while arranging surrounds or pairing. You choose which channel chirps and for how long, and you can ask it to chirp even while normal audio is playing. It returns an ID you later use to stop the chirping.

<details markdown="1"><summary><b>Technical details</b></summary>

Starts room-detection chirping: Channel/DurationMilliseconds/ChirpIfPlayingSwappableAudio -> impl->v\[+0x50\], returning PlayId.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Channel` | numeric argument (type-tag-2, 24-byte record) | yes | decimal integer parsed into the argument record / full width of the parsed integer; impl-side domain applies | none; required input |
| `DurationMilliseconds` | numeric argument (type-tag-4, 24-byte record) | yes | decimal integer parsed into the argument record / full width of the parsed integer; impl-side domain applies | none; required input |
| `ChirpIfPlayingSwappableAudio` | boolean/numeric flag (type-tag-1, 24-byte record) | yes | nonzero = true; 0 = false (byte-width flag) / 0/1 | none; required input |

- **`Channel`**: Chirp channel selector
  - validation: numeric value consumed by the impl vfunc
  - buffer cap: `0x18`
- **`DurationMilliseconds`**: Chirp duration in milliseconds
  - validation: numeric value consumed by the impl vfunc
  - buffer cap: `0x18`
- **`ChirpIfPlayingSwappableAudio`**: Allow chirp while swappable audio plays
  - validation: flag consumed by the impl vfunc
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `PlayId` | unsigned int32 | u32 session id assigned by the chirp member / per the response writer |

- **`PlayId`**: Play/session id assigned to the chirp
  - validation: emitted via the response object vfuncs

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073730c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x50\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073730c; req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x50\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073730c; member vfunc calls: \['r30 v\[+0x50\]'\]

</details>


#### Side effects

- state mutation delegated to impl->v\[+0x50\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x50\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073730c; no transition-literal/store pattern; member delegates: \['r30 v\[+0x50\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073730c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073730c; commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | impl is a lwz *(r3+0x10000-0x55d0) -> real worker member accessor | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073730c`
- dispatch entry `0x10f119d8`
- impl call `0x107373dc` obj `r5-in` slot `80` arg4 `*(sp-0x30+0x12)`
- impl call `0x10737464` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x107373b0` slot `8` (parse)

- fn 0x1073730c @ 0x1073730c; action wrapper handler
- @ 0x10f119d8; action dispatch table entry
- fn 0x100c3a54; impl vtable 0x10e98278 slot +0x50; secondary-base trampoline via 0x100c3a68 -> loads *(this+0xaa30) member

</details>

### `RoomDetectionStopChirping`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Stops the identification chirp that RoomDetectionStartChirping started. You hand back the ID that the start command returned, and the targeted speaker goes quiet.

<details markdown="1"><summary><b>Technical details</b></summary>

Stops chirping for PlayId via impl->v\[+0x54\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `PlayId` | numeric argument (type-tag-4, 24-byte record) | yes | decimal integer parsed into the argument record / full width of the parsed integer; impl-side domain applies | none; required input |

- **`PlayId`**: Play/session id returned by RoomDetectionStartChirping
  - validation: numeric value consumed by the impl vfunc
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10737220; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x54\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737220; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x54\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737220; member vfunc calls: \['r30 v\[+0x54\]'\]

</details>


#### Side effects

- state mutation delegated to impl->v\[+0x54\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x54\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737220; no transition-literal/store pattern; member delegates: \['r30 v\[+0x54\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737220; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10737220; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | impl is a lwz pair into out -> real worker shared_ptr copy accessor | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10737220`
- dispatch entry `0x10f119e4`
- impl call `0x1073729c` obj `r5-in` slot `84` arg4 `*(sp-0x30+0x18)`
- impl call `0x10737300` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073727c` slot `8` (parse)

- fn 0x10737220 @ 0x10737220; action wrapper handler
- @ 0x10f119e4; action dispatch table entry
- fn 0x100c3ef0; impl vtable 0x10e98278 slot +0x54; secondary-base trampoline via 0x100c3f54 -> writes out-record from *(this+0x5b58/+0x5b5c)

</details>

### `SeparateStereoPair`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

In this firmware build this command is a documented no-op. It is supposed to split a stereo pair back into two independent speakers, but its implementation was replaced by an empty routine that accepts the request, returns success, and changes nothing. The wiring and the advert in the spec remain, and only the actual work is missing. To actually break a pair on this build, the app has to go through the bonded-zones removal path instead.

<details markdown="1"><summary><b>Technical details</b></summary>

Parses inputs, then calls impl->v\[+0x24\] = null stub f_1019d288. In this build, separating a stereo pair is a binary-proven no-op: the request is accepted and success emitted without any operation or state change.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ChannelMapSet` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 639 chars | none; required input |

- **`ChannelMapSet`**: Channel-map DSL string selecting the channels affected by the bonding operation
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x280`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073602c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x24\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073602c; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x24\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073602c; member vfunc calls: \['r30 v\[+0x24\]'\]

</details>


#### Side effects

- none - impl is a null stub

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x24\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073602c; no transition-literal/store pattern; member delegates: \['r30 v\[+0x24\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073602c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073602c; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call. | request-validate failure (req->v\[+0x08\] returned 0)

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage
- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073602c`
- dispatch entry `0x10f119f0`
- impl call `0x107360ac` obj `r5-in` slot `36` arg4 `sp-0x294`
- impl call `0x10736110` obj `*(sp-0x2b0+0x2ac)` slot `12` arg4 `402`
- req vcall `0x1073608c` slot `8` (parse)

- fn 0x1073602c @ 0x1073602c; action wrapper handler
- @ 0x10f119f0; action dispatch table entry
- fn 0x1019d288; impl vtable 0x10e98278 slot +0x24; direct impl body
- fn 0x1019d288; impl vfunc +0x24 -> null stub

</details>

### `SetAutoplayLinkedZones`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Turns the autoplay linked-zones option on or off, which controls whether automatic playback should include the speakers this one is grouped with. When the option is on, an autoplay start pulls the speaker's group members along rather than playing alone.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets IncludeLinkedZones (+Source) via impl->v\[+0x28\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `IncludeLinkedZones` | boolean/numeric flag (type-tag-1, 24-byte record) | yes | nonzero = true; 0 = false (byte-width flag) / 0/1 | none; required input |
| `Source` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 4 chars | none; required input |

- **`IncludeLinkedZones`**: Enable autoplay across linked zones
  - validation: flag consumed by the impl vfunc
  - buffer cap: `0x18`
- **`Source`**: Autoplay source identifier string
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x5`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10736a04; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r29 v\[+0x28\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736a04; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r29 v\[+0x28\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736a04; member vfunc calls: \['r29 v\[+0x28\]'\]

</details>


#### Side effects

- state-mutation delegate: r29 v\[+0x28\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r29 v\[+0x28\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736a04; no transition-literal/store pattern; member delegates: \['r29 v\[+0x28\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736a04; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736a04; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10736a04`
- dispatch entry `0x10f119fc`
- impl call `0x10736acc` obj `r5-in` slot `40` arg4 `*(sp-0x30+0x13)`
- impl call `0x10736b38` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10736aa8` slot `8` (parse)

- fn 0x10736a04 @ 0x10736a04; action wrapper handler
- @ 0x10f119fc; action dispatch table entry
- fn 0x101981f0; impl vtable 0x10e98278 slot +0x28; secondary-base trampoline via 0x1019d06c -> manager-scale worker

</details>

### `SetAutoplayRoomUUID`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Chooses which room this speaker follows when autoplay is triggered, meaning the room whose playback it will automatically join. In other words, you pick the leader for the follow-me feature and this speaker tails whatever plays there.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets the autoplay RoomUUID (+Source selector) via impl->v\[+0x30\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `RoomUUID` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 25 chars | none; required input |
| `Source` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 4 chars | none; required input |

- **`RoomUUID`**: Autoplay source room UUID to store
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x1a`
- **`Source`**: Autoplay source identifier string
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x5`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073660c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r29 v\[+0x30\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073660c; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r29 v\[+0x30\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073660c; member vfunc calls: \['r29 v\[+0x30\]'\]

</details>


#### Side effects

- state-mutation delegate: r29 v\[+0x30\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r29 v\[+0x30\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073660c; no transition-literal/store pattern; member delegates: \['r29 v\[+0x30\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073660c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073660c; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073660c`
- dispatch entry `0x10f11a08`
- impl call `0x107366d8` obj `r5-in` slot `48` arg4 `sp-0x30`
- impl call `0x10736744` obj `*(sp-0x50+0x4c)` slot `12` arg4 `402`
- req vcall `0x107366b4` slot `8` (parse)

- fn 0x1073660c @ 0x1073660c; action wrapper handler
- @ 0x10f11a08; action dispatch table entry
- fn 0x101939a4; impl vtable 0x10e98278 slot +0x30; secondary-base trampoline via 0x101953c0

</details>

### `SetAutoplayVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Sets the volume level to use specifically for autoplay starts. It is the cap that stops an auto-started source from blasting at whatever the volume happened to be when the source connected.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets the autoplay Volume (+Source) via impl->v\[+0x38\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Volume` | numeric argument (type-tag-2, 24-byte record) | yes | decimal integer parsed into the argument record / full width of the parsed integer; impl-side domain applies | none; required input |
| `Source` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 4 chars | none; required input |

- **`Volume`**: Autoplay volume level
  - validation: numeric value consumed by the impl vfunc
  - buffer cap: `0x18`
- **`Source`**: Autoplay source identifier string
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x5`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10736f6c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r29 v\[+0x38\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736f6c; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r29 v\[+0x38\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736f6c; member vfunc calls: \['r29 v\[+0x38\]'\]

</details>


#### Side effects

- state-mutation delegate: r29 v\[+0x38\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r29 v\[+0x38\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736f6c; no transition-literal/store pattern; member delegates: \['r29 v\[+0x38\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736f6c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736f6c; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

worker f_101935f8 (264 insns): f_1068c190 apply -> persist chain f_10180794/f_1040edf4/f_10807034/f_103f7638 -> f_1068ccc4 notify; exit r3=r30 = {call-derived, 1}; rc forwarded to req v\[+0x14\] under nonzero-fault convention | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10736f6c`
- dispatch entry `0x10f11a14`
- impl call `0x10737034` obj `r5-in` slot `56` arg4 `*(sp-0x30+0x12)`
- impl call `0x107370a0` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10737010` slot `8` (parse)

- fn 0x10736f6c @ 0x10736f6c; action wrapper handler
- @ 0x10f11a14; action dispatch table entry
- fn 0x10193700; impl vtable 0x10e98278 slot +0x38; secondary-base trampoline via 0x10193700

</details>

### `SetButtonLockState`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Locks or unlocks the speaker's physical buttons, which is the child-lock toggle. While locked, presses on the unit's controls are ignored, though control still works from the app.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets DesiredButtonLockState via impl->v\[+0x6c\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredButtonLockState` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 4 chars | none; required input |

- **`DesiredButtonLockState`**: Desired button-lock state enum string
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x5`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10736360; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x6c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736360; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x6c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736360; member vfunc calls: \['r30 v\[+0x6c\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x6c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x6c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736360; no transition-literal/store pattern; member delegates: \['r30 v\[+0x6c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736360; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736360; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl worker f_1019db60 is itself a 5-insn accessor returning r3+0x3fa2c member ptr - same accessor-returns-pointer shape as the DP getter family; rc forwarded to req v\[+0x14\] under nonzero-fault convention | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10736360`
- dispatch entry `0x10f11a20`
- impl call `0x107363e0` obj `r5-in` slot `108` arg4 `sp-0x1c`
- impl call `0x10736444` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x107363c0` slot `8` (parse)

- fn 0x10736360 @ 0x10736360; action wrapper handler
- @ 0x10f11a20; action dispatch table entry
- fn 0x1019db74; impl vtable 0x10e98278 slot +0x6c; secondary-base trampoline via 0x1019db74

</details>

### `SetLEDState`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Turns the speaker's status LED on or off. This is the 'Status Light' toggle you find in settings, and switching it off makes the unit dark for bedrooms.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets DesiredLEDState via impl->v\[+0x10\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredLEDState` | string argument (type-tag-7 record) | yes | any string; impl never reads it / max 3 chars | none; required input |

- **`DesiredLEDState`**: Desired LED state enum string (parsed but IGNORED: impl 0x10537870 is a 2-insn no-op)
  - buffer cap: `0x4`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10735d5c; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x10\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735d5c; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x10\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735d5c; member vfunc calls: \['r30 v\[+0x10\]'\]

</details>


#### Side effects

- state mutation delegated to impl->v\[+0x10\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x10\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735d5c; no transition-literal/store pattern; member delegates: \['r30 v\[+0x10\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735d5c; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735d5c; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; success branch tests CR0.eq (impl-side compare)
**Bounded unknown (unresolved):** the concrete rc set each impl can produce

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10735d5c`
- dispatch entry `0x10f11a2c`
- impl call `0x10735ddc` obj `r5-in` slot `16` arg4 `sp-0x18`
- impl call `0x10735e40` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10735dbc` slot `8` (parse)

- fn 0x10735d5c @ 0x10735d5c; action wrapper handler
- @ 0x10f11a2c; action dispatch table entry
- fn 0x10537870; impl vtable 0x10e98278 slot +0x10; NULL STUB: 2-insn empty function - action is a no-op in this build

</details>

### `SetUseAutoplayVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Chooses whether autoplay should use the dedicated autoplay volume (GetAutoplayVolume) or leave the speaker's current volume alone. On means autoplay uses its dedicated volume; off means it keeps the current level.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets UseVolume flag (+Source) via impl->v\[+0x40\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `UseVolume` | boolean/numeric flag (type-tag-1, 24-byte record) | yes | nonzero = true; 0 = false (byte-width flag) / 0/1 | none; required input |
| `Source` | string argument (type-tag-7 record) | yes | any string within the request parse cap / max 4 chars | none; required input |

- **`UseVolume`**: Enable applying the stored autoplay volume
  - validation: flag consumed by the impl vfunc
  - buffer cap: `0x18`
- **`Source`**: Autoplay source identifier string
  - validation: consumed by impl vfunc +0x40
  - buffer cap: `0x5`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10736b44; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r29 v\[+0x40\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736b44; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r29 v\[+0x40\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736b44; member vfunc calls: \['r29 v\[+0x40\]'\]

</details>


#### Side effects

- state-mutation delegate: r29 v\[+0x40\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r29 v\[+0x40\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736b44; no transition-literal/store pattern; member delegates: \['r29 v\[+0x40\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736b44; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736b44; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

worker f_101953c8 (1096 insns): strcmp validation gate -> f_1068bc0c apply -> f_1055847c/f_10558000 notify-commit; exit r3=r27 accumulator (call-derived); literal li r30,0 success-seed at 0x10195674; rc forwarded to req v\[+0x14\] under nonzero-fault convention | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10736b44`
- dispatch entry `0x10f11a38`
- impl call `0x10736c0c` obj `r5-in` slot `64` arg4 `*(sp-0x30+0x13)`
- impl call `0x10736c78` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10736be8` slot `8` (parse)

- fn 0x10736b44 @ 0x10736b44; action wrapper handler
- @ 0x10f11a38; action dispatch table entry
- fn 0x10195810; impl vtable 0x10e98278 slot +0x40; secondary-base trampoline via 0x10195810

</details>

### `SetZoneAttributes`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Sets this speaker's descriptive properties, meaning room name, icon, and related fields. This is what happens when you rename a room or change its icon in the app.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets DesiredZoneName/DesiredIcon/DesiredConfiguration/DesiredTargetRoomName via impl->v\[+0x8\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredZoneName` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 1023 chars | none; required input |
| `DesiredIcon` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 1023 chars | none; required input |
| `DesiredConfiguration` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 15 chars | none; required input |
| `DesiredTargetRoomName` | string argument (type-tag-7 record) | yes | any string within the request parse cap; no lexical whitelist observed at the parse layer / max 64 chars | none; required input |

- **`DesiredZoneName`**: Zone-attribute string field (DesiredZoneName)
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x400`
- **`DesiredIcon`**: Zone-attribute string field (DesiredIcon)
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x400`
- **`DesiredConfiguration`**: Zone-attribute string field (DesiredConfiguration)
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x10`
- **`DesiredTargetRoomName`**: Zone-attribute string field (DesiredTargetRoomName)
  - validation: consumed by the impl vfunc; impl-side validation as noted
  - buffer cap: `0x41`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10736450; wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×4, validate×1, commit×1); member delegates: r26 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736450; req-vfunc call map: {'0x1c': 4, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r26 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736450; member vfunc calls: \['r26 v\[+0x8\]'\]

</details>


#### Side effects

- state-mutation delegate: r26 v\[+0x8\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r26 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736450; no transition-literal/store pattern; member delegates: \['r26 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736450; bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10736450; commit/fault slot usage: {'0x1c': 4, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

worker f_101931a8 (1096 insns): apply chain f_10186870/f_1040e4cc/f_10740ce8/f_10749a28/f_10749b34/f_10690d44 + f_109b6fe4/f_109b72ac log pair; exit r3=r27 (call-derived); r28 toggles {0,1} as state flag; rc forwarded to req v\[+0x14\] under nonzero-fault convention | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10736450`
- dispatch entry `0x10f11a44`
- impl call `0x1073658c` obj `r5-in` slot `8` arg4 `sp-0x824`
- impl call `0x10736600` obj `*(sp-0x890+0x88c)` slot `12` arg4 `402`
- req vcall `0x10736560` slot `8` (parse)

- fn 0x10736450 @ 0x10736450; action wrapper handler
- @ 0x10f11a44; action dispatch table entry
- fn 0x101935f0; impl vtable 0x10e98278 slot +0x08; secondary-base trampoline via 0x101935f0

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `HouseholdID` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `SettingsReplicationState` | string | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `ZoneName` | string | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `Icon` | string | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `Configuration` | string | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `TargetRoomName` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `Invisible` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `IsZoneBridge` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `AirPlayEnabled` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `SupportsAudioIn` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `SupportsAudioClip` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `IsIdle` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `MoreInfo` | string | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `ChannelMapSet` | string | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `HTSatChanMapSet` | string | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `HTBondedZoneCommitState` | ui4 | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `Orientation` | i4 | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `LastChangedPlayState` | string | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `RoomCalibrationState` | i4 | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `AvailableRoomCalibration` | string | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `SatRoomUUID` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `LEDState` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `SerialNumber` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `SoftwareVersion` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `DisplaySoftwareVersion` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `HardwareVersion` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `IPAddress` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `MACAddress` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `CopyrightInfo` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `ExtraInfo` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `HTAudioIn` | ui4 | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `Flags` | ui4 | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `AutoplayIncludeLinkedZones` | boolean | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `AutoplayRoomUUID` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `AutoplaySource` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `AutoplayVolume` | ui2 | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `AutoplayUseVolume` | boolean | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `TVConfigurationError` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `HdmiCecAvailable` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `WirelessMode` | ui4 | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `ConnectionType` | ui4 | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `HasConfiguredSSID` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `ChannelFreq` | ui4 | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `BehindWifiExtender` | ui4 | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `WifiEnabled` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `EthLink` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `ConfigMode` | string | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `SecureRegState` | ui4 | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `A_ARG_TYPE_ConfigModeOptions` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ConfigModeState` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ButtonState` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `ButtonLockState` | string | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `VoiceConfigState` | ui4 | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `MicEnabled` | ui4 | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `SvcActive` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `AlexaCBLSupported` | boolean | yes | evented state variable: appears in DeviceProperties LastChange/GENA event notifications |
| `KeepGrouped` | boolean | no | non-evented DeviceProperties state variable: read via action out-args, not pushed |
| `A_ARG_TYPE_RoomDetectionChirpChannel` | ui2 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_RoomDetectionDurationMilliseconds` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_RoomDetectionPlayId` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_RoomDetectionChirpIfPlayingSwappableAudio` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /DeviceProperties/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `deviceProperties`, `extendedDeviceStatus`, `microphoneSwitchStatus`, `batteryStatus`, `speakerPresenceStatus`
<details markdown="1"><summary><b>Technical details</b></summary>

- **notify_path:** settings-key event path: impl setters append key\0value\0 pairs via f_10557d70 -> member->v\[+0x10\] notify -> internal event bus (SettingsNeedsUpdateEvent pool) -> GENA/WSS delivery; no dedicated per-service e:property emitter found - event source = the settings store's change list; ResetVolumeAfter emitted via f_102fc6f4/f_106f4bac
- **payload_model:** settings-key notifications (Desired*/Current* key changes) delivered via bus; GENA initial-notify serializes current keys
- **wss_registry:**
  - idx: 24, name: deviceProperties, id: 90, tag: 69
  - idx: 29, name: extendedDeviceStatus, id: 110, tag: 7
  - idx: 14, name: microphoneSwitchStatus, id: 57, tag: 15
  - idx: 12, name: batteryStatus, id: 55, tag: 15
  - idx: 65, name: speakerPresenceStatus, id: 289, tag: 61

</details>


## Dispatcher-level errors

<details markdown="1"><summary><b>Technical details</b></summary>

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search



</details>

## Notes

<details markdown="1"><summary><b>Technical details</b></summary>

Shared impl object 0x10e98278 is shared with SystemProperties: slots +0x18..+0x40 alias DP group/pair ops with SP account ops (e.g. +0x18 = AddBondedZones + AddAccountX). Same function = same operation; semantic differentiation is in the parsed record argument.

</details>

## Additional records

### `impl`

<details markdown="1"><summary><b>Technical details</b></summary>

- **desired_attrs:** action params {DesiredIcon,DesiredConfiguration,DesiredTargetRoomName,DesiredButtonLockState,DesiredLEDState,KeepGrouped}; ops {SetZoneAttributes,SetButtonLockState,SetLEDState,AddHTSatellite,RemoveHTSatellite,AddBondedZone,RemoveBondedZones}; VliPropertiesChangedEvent processing

</details>

Implementation sources (recovered): `common/dp_impl.cxx`, `zoneplayer/dp_zpimpl.cxx`, `zoneplayer/dp_zpimpl_ht.cxx`, `zoneplayer/dp_zpimpl_stp.cxx`

<details markdown="1"><summary>Service evidence (3)</summary>

- @ 0x1068bc0c; service router function
- @ 0x10f11900; service vtable
- @ 0x10735c04; service dispatcher

</details>
