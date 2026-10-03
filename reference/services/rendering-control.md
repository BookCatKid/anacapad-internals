# `RenderingControl` `/MediaRenderer/RenderingControl/Control`

**visibility** `advertised` · **status** `strong`

This service controls how the speaker sounds: volume, mute, and tone. The everyday commands live here, meaning the volume slider, the mute button, and the bass/treble/loudness settings in the equalizer panel. It also holds a few oddities unique to this firmware: some commands are half-connected (they accept your request but do nothing with it), a couple are only implemented on certain internal builds of the player, and one documented command actually does something completely different from its name. The per-channel design (Master, left-front, right-front) also reveals that the same code drives single speakers and channel-splitting configurations like a soundbar.

<details markdown="1"><summary><b>Technical details</b></summary>

UPnP RenderingControl for the zone player: per-channel volume, mute, loudness and EQ state held in a large implementation object (fields through at least +0x9c8) guarded by a recursive mutex at impl+0x938. Two implementation classes share the same SOAP vtable layout: a base 'without proxy' class (vtable 0x10e872f0, methods 0x100dxxxx-0x100exxxx, e.g. SetMute logs 'SetMuteWithoutProxy') and a derived class (vtable 0x10ed279c, overrides at 0x1046xxxx) that performs a grouped-operation prelude (object built from impl+0xbc8 and impl+0x9c8 via f_1046dff0, submitted via f_1046c3cc) before tail-calling the base implementation - i.e. the proxy/grouped variant. Which class is installed at *(svc+4) is decided at rc_impl construction (selection condition unresolved); several actions are 3-instruction null stubs in one or both classes and are documented per-class below.

</details>

## Availability

- capability flags `0x1000`
- enabled gate: `0x1` at `0x1019558c` (const)
- Always-enabled service (const 1 enable store, cap_flags 0x1000). Action-level availability varies: several actions are null stubs or anomalous in impl class A (vtable 0x10e872f0) while impl class B (0x10ed279c) implements them - the installed class is decided at rc_impl construction, condition unresolved.

## Dispatch

- router `0x101953c8`, cap flags `0x1000`
- dispatcher `0x1073a784` kind `table`
- action table `0x10f11d88`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `GetBass` | advertised | callable | `confirmed` | direct | 401, 402 |
| `GetEQ` | advertised | callable | `strong` | direct | 401, 402 |
| `GetHeadphoneConnected` | advertised | callable | `strong` | direct | 401, 402 |
| `GetLoudness` | advertised | callable | `confirmed` | direct | 401, 402 |
| `GetMute` | advertised | callable | `confirmed` | direct | 401, 402, 702 |
| `GetOutputFixed` | advertised | callable | `strong` | direct | 401, 402 |
| `GetRoomCalibrationStatus` | advertised | callable | `strong` | direct | 401, 402 |
| `GetSupportsOutputFixed` | advertised | callable | `confirmed` | direct | 401, 402 |
| `GetTreble` | advertised | callable | `strong` | direct | 401, 402 |
| `GetVolume` | advertised | callable | `strong` | direct | 401, 402, 501, 702 |
| `GetVolumeDB` | advertised | callable | `strong` | direct | 401, 402 |
| `GetVolumeDBRange` | advertised | callable | `confirmed` | direct | 401, 402 |
| `RampToVolume` | advertised | callable | `strong` | direct | 401, 402 |
| `ResetBasicEQ` | advertised | callable | `strong` | direct | 401, 402 |
| `ResetExtEQ` | advertised | callable | `confirmed` | direct | 401, 402 |
| `RestoreVolumePriorToRamp` | advertised | callable | `strong` | direct | 401, 402 |
| `SetBass` | advertised | callable | `confirmed` | direct | 401, 402 |
| `SetChannelMap` | advertised | callable | `strong` | direct | 401, 402 |
| `SetEQ` | advertised | callable | `confirmed` | direct | 401, 402 |
| `SetLoudness` | advertised | callable | `confirmed` | direct | 401, 402 |
| `SetMute` | advertised | callable | `confirmed` | direct | 401, 402, 702 |
| `SetOutputFixed` | advertised | callable | `strong` | direct | 401, 402 |
| `SetRelativeVolume` | advertised | callable | `strong` | direct | 401, 402 |
| `SetRoomCalibrationStatus` | advertised | callable | `strong` | direct | 401, 402 |
| `SetTreble` | advertised | callable | `confirmed` | direct | 401, 402 |
| `SetVolume` | advertised | callable | `confirmed` | direct | 401, 402 |
| `SetVolumeDB` | advertised | callable | `confirmed` | direct | 401, 402 |

### `GetBass`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Supposed to report the speaker's bass level, but in this firmware build it is a documented no-op: the routine behind it was replaced by an empty routine that performs nothing and returns nothing. The command still appears in the service's advertised list, so an app can call it, it just gets an empty answer rather than a bass value. The settings that do work are reached through the generic GetEQ command instead.

<details markdown="1"><summary><b>Technical details</b></summary>

NEUTERED ACTION: impl vfunc +0x30 is f_100d65f4 - 'stwu/addi/blr', a no-op that reads no arguments, writes no output and leaves r3 = impl pointer with stale cr0. Success/fault routing inherits whatever cr0.eq the request-parse call left behind (success-parse convention likely leaves cr0.eq=1 -> emit path).

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored / unconstrained at impl level | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). Not checked - impl is a stub that reads no args.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentBass` | signed int16 | uninitialized stack content |

- **`CurrentBass`**: never written - impl stub does not touch the out pointer; the emitted value is whatever the request layer initialized
  - validation: no impl-level use or validation (stub impl)
  - impl is a null stub in BOTH impl vtables - the bass getter was neutered (likely superseded by GetEQ).

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse only.

#### Requirements / preconditions

none

#### State dependencies

none - no state gating observed beyond argument checks

#### Side effects

- None - impl vfunc is the 3-instruction null stub f_100d65f4 (stwu/addi/blr); r3 is returned unmodified and CurrentBass is never written.

#### State transitions

none

#### Events

none

#### Return behavior

If the emit path runs, CurrentBass is formatted from an uninitialized stack slot (impl never writes the out ptr). If stale cr0.eq is clear, the request faults with code = impl pointer (a large address value) - neither path yields a real bass reading.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed


#### Notes

Sonos neutered GetBass while leaving GetTreble (+0x38 -> real impl f_100e3450) functional - asymmetric deprecation, consistent with migration to GetEQ/SetEQ parametric EQ.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073ba88`
- dispatch entry `0x10f11d88`
- impl call `0x1073bb08` obj `r5-in` slot `48` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073bb90` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x1073bae4` slot `8` (parse)

- fn 0x1073ba88 @ 0x1073ba88; action wrapper handler
- @ 0x10f11d88; action dispatch table entry
- fn 0x100d65f4; 3-instr null stub; identical entry in vtable A +0x30 and B +0x30 (and at +0x3c for SetTreble)

</details>

### `GetEQ`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reads one of the speaker's tone settings through the generic equalizer query, which can fetch bass, treble, or other tone parameters depending on which one you ask for. This is the working path apps actually use to read the EQ panel's values.

<details markdown="1"><summary><b>Technical details</b></summary>

Reads an EQ parameter via the shared audio-context path: f_10118278 ctx init + f_1011fdd0 acquisition on impl+0x3c4/+0x9c8, lock impl+0x938, ctx-worker f_100e382c(this,&ctx), unlock, release - byte-identical control flow to GetTreble with a different worker.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored by impl / unconstrained at impl level | none |
| `EQType` | EQ band selector | yes | parsed token / max 1023 chars | none |

- **`InstanceID`**: Numeric instance selector. Read but unconsumed by the impl (dead compare or never read).
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`
- **`EQType`**: EQ band/type selector; parsed but not consumed by the visible impl body (f_100e4188 reads only this - the EQType value dies in registers; the ctx worker may recover it via the context object, unresolved).
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - impl f_100e4188 uses no incoming arg registers - identical shape to GetTreble.
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentValue` | signed int16 | worker-produced |

- **`CurrentValue`**: EQ value returned through the ctx worker f_100e382c (same worker the GetVolume 'spatial' branch invokes); out-write path unresolved.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse; impl consumes no argument registers.

#### Requirements / preconditions

ctx objects impl+0x3c4/+0x9c8 must support acquisition (f_1011fdd0).

#### State dependencies

requires audio ctx object chain

#### Side effects

- Builds query ctx via f_10118278 + f_1011fdd0(impl+0x3c4,impl+0x9c8), locks +0x938, calls reader f_100e382c(this,ctx) to fetch EQ state, unlocks and destroys ctx.

#### State transitions

none

#### Events

none

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

f_100e382c is the shared EQ-read worker - GetEQ, GetTreble's f_100e1fec sibling, and the GetVolume 'spatial' branch all funnel into EQ-context reads.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073bcb0`
- dispatch entry `0x10f11d94`
- impl call `0x1073bd5c` obj `r5-in` slot `64` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073bde4` obj `*(sp-0x430+0x42c)` slot `12` arg4 `?`
- req vcall `0x1073bd34` slot `8` (parse)

- fn 0x1073bcb0 @ 0x1073bcb0; action wrapper handler
- @ 0x10f11d94; action dispatch table entry
- fn 0x100e4188; impl: ctx acquire + lock + f_100e382c + unlock + release; zero arg reads
- fn 0x100e382c; shared ctx EQ worker (also GetVolume 'spatial' path)

</details>

### `GetHeadphoneConnected`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports headphone-related state, the readout the firmware uses to know whether a headphone output path is in play and what the associated volume and mute bookkeeping is. On a soundbar-class product like this one it is part of the shared volume/mute record rather than a feature the user sees.

<details markdown="1"><summary><b>Technical details</b></summary>

Locks impl+0x938 (via f_10988268) and fills a state record: volume u32 from impl+0x7da or +0x7e0 selected by flags +0x7ff/+0x801, Master mute byte impl+0x7f1 at rec+0xc, computed flag at rec+0xd; returns 1.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored by impl / unconstrained at impl level | none |

- **`InstanceID`**: Numeric instance selector. Read but unconsumed by the impl (dead compare or never read). Not compared; impl takes a record pointer instead.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentHeadphoneConnected` | boolean ('0'/'1') | 0/1 nominal |

- **`CurrentHeadphoneConnected`**: Derived from the state record the impl fills: impl writes u32@rec+8 = volume (field +0x7da when flag+0x7ff set OR +0x801 set, else +0x7e0), byte@rec+0xc = Master mute (impl+0x7f1), byte@rec+0xd = (+0x7ff!=0 ? +0x801^1: 0). Which field maps to the SOAP output is unresolved.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - impl f_100d66cc dumps a {volume,mute,flag} record rather than a simple bool - the headphone semantic likely lives in the flag byte at rec+0xd computed from flags +0x7ff/+0x801.

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse; impl ignores InstanceID.

#### Requirements / preconditions

impl mutex

#### State dependencies

flag bytes impl+0x7ff/+0x801 select volume field and compute the flag output

#### Side effects

- Locks +0x938 via the traced mutex helper (rc_impl.cxx:0x1009) then checks flag byte impl+0x7ff as part of the headphone-state read.

#### State transitions

none

#### Events

none

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code. Impl returns 1 unconditionally after filling the record.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

Field semantics of +0x7ff/+0x801 remain the key unknown: they appear in SetMute's Master path, GetHeadphoneConnected and SetChannelMap - likely 'output-fixed' and 'headphone/slave' mode flags.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073b0d8`
- dispatch entry `0x10f11da0`
- impl call `0x1073b158` obj `r5-in` slot `96` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073b1e0` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x1073b134` slot `8` (parse)

- fn 0x1073b0d8 @ 0x1073b0d8; action wrapper handler
- @ 0x10f11da0; action dispatch table entry
- fn 0x100d66cc; impl: lbz 0x7ff/0x801 flag select; stw vol@rec+8; stb mute@rec+0xc; stb flag@rec+0xd; return 1

</details>

### `GetLoudness`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Reports the loudness setting, Sonos's bass/treble boost that makes quiet listening sound fuller. On this build it is only half-wired: whether the command does anything depends on which internal flavor of the player is running, and the firmware doesn't make that choice visible from the outside. On some configurations it answers properly, and on others the routine slot is a stub.

<details markdown="1"><summary><b>Technical details</b></summary>

CONDITIONALLY IMPLEMENTED: vtable A has null stub f_100e44dc at slot +0x48; vtable B overrides with real impl 0x1046db28. SOAP-visible behavior depends on which impl class is installed (selection unresolved).

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | input | yes | per parse | none |
| `Channel` | input | yes | per parse / max 1023 chars | none |

- **`InstanceID`**: parsed by the request layer but never read - impl vfunc 0x100e44dc is a no-op stub
  - validation: no impl-level use or validation (stub impl)
  - In impl class B the slot is a real impl (f_1046db28/f_1046d340) - semantics above describe the proven base-class stub.
  - buffer cap: `0x18`
- **`Channel`**: parsed by the request layer but never read - impl vfunc 0x100e44dc is a no-op stub
  - validation: no impl-level use or validation (stub impl)
  - In impl class B the slot is a real impl (f_1046db28/f_1046d340) - semantics above describe the proven base-class stub.
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentLoudness` | boolean ('0'/'1') | impl-produced or stale |

- **`CurrentLoudness`**: parsed by the request layer but never read - impl vfunc 0x100e44dc is a no-op stub
  - validation: no impl-level use or validation (stub impl)
  - In impl class B the slot is a real impl (f_1046db28/f_1046d340) - semantics above describe the proven base-class stub.

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

impl class determines all behavior

#### State dependencies

none - no state gating observed beyond argument checks

#### Side effects

- None in impl class A - vfunc is the null stub f_100e44dc. In impl class B it is f_1046db28, which resolves a refcounted object at impl+0x2ac (stwcx loop) before dispatching.

#### State transitions

persists Loudness (read-only) into the RCS settings member; notify->dirty->event pipeline (call-derived, slot-bounded)

#### Events

LastChange via RCS writer f_100e27b0 carrying Loudness (mechanism proven; exact var emission per runtime change)

#### Return behavior

Class A: stale-cr0 return - likely commits success with uninitialized output / no effect. Class B: real impl at 0x1046db28 (unexplored).

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed


#### Notes

Loudness exists only on the derived/proxy impl class - plausible device-capability gating.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073ad64`
- dispatch entry `0x10f11dac`
- impl call `0x1073ae10` obj `r5-in` slot `72` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073ae98` obj `*(sp-0x430+0x42c)` slot `12` arg4 `?`
- req vcall `0x1073ade8` slot `8` (parse)

- fn 0x1073ad64 @ 0x1073ad64; action wrapper handler
- @ 0x10f11dac; action dispatch table entry
- fn 0x100e44dc; null stub in vtable A
- @ 0x10ed279c; vtable B slot +0x48 = 0x1046db28

</details>

### `GetMute`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Reports whether the speaker is muted, which is the state behind the mute button. Mute is stored per audio channel (master, left, right), and this reads the flag for the channel you ask about.

<details markdown="1"><summary><b>Technical details</b></summary>

Reads the per-channel mute flag stored in the rendering-control impl object (bytes +0x7f1 Master, +0x7f2 LF, +0x7f3 RF) under the impl mutex at +0x938.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | `0` / 0 .. 0 | none |
| `Channel` | channel token | yes | `Master`, `LF`, `RF` / max 1023 chars | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - special values: `0` = the only instance implemented; any other value faults with 702
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). Impl returns 702 when the parsed value is nonzero (f_100d71e0 cmpwi at 0x100d71ec-0x100d7220 selects return r3=0x2be).
  - buffer cap: `0x18`
- **`Channel`**: Audio channel selector string; compared verbatim (strcmp, case-sensitive) by the implementation.
  - special values: `Master` = reads mute state byte impl+0x7f1; `LF` = reads mute state byte impl+0x7f2; `RF` = reads mute state byte impl+0x7f3; `FocusMode` = NOT accepted by this action even though SetMute accepts it - falls through to 402
  - validation: Impl strcmps the token against Master/LF/RF; anything else returns 402 (f_100d71e0 at 0x100d7290).
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentMute` | boolean ('0'/'1') | any byte value the impl field holds (0/1 in normal operation) |

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

InstanceID must parse and equal 0 (else 702); Channel must be exactly Master, LF or RF (else 402).

#### Requirements / preconditions

None beyond argument validity; the impl mutex serializes the read.

#### State dependencies

none - no state gating observed beyond argument checks

#### Side effects

- Reads mute byte impl+0x7f1/0x7f2/0x7f3 (Master/LF/RF) into the out param after a 3-way strcmp; no state is modified.

#### State transitions

none

#### Events

none - pure read

#### Return behavior

Success is signaled by the implementation leaving cr0.eq=1 at return (the callee performs a cr0-writing op such as 'mr. r30,r3' on its status); the wrapper then emits outputs via req vfunc +0x24 and commits via +0x14. Any other path calls req vfunc +0x14 with r4 = implementation return code, producing a SOAP fault whose numeric code equals the impl return value. On success CurrentMute receives the raw impl byte for the channel.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper (missing or malformed InstanceID/Channel), or an unrecognized Channel token rejected by the impl strcmp chain.

- req vfunc +0x08 parse failed
- Channel not in {Master, LF, RF}

**`702`** `confirmed`

InstanceID was nonzero: impl checks the parsed value and returns 0x2be before touching channel state.

- parsed InstanceID != 0: impl/parse rc path to shared fault emitter (see evidence)


#### Notes

GetMute accepts only 3 channels although the mute field array has a 4th entry (+0x7f4 'FocusMode') reachable only via SetMute - read/write asymmetry confirmed in the binary.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073ac24`
- dispatch entry `0x10f11db8`
- impl call `0x1073acd0` obj `r5-in` slot `8` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073ad58` obj `*(sp-0x430+0x42c)` slot `12` arg4 `?`
- req vcall `0x1073aca8` slot `8` (parse)

- fn 0x1073ac24 @ 0x1073ac24; action wrapper handler
- @ 0x10f11db8; action dispatch table entry
- fn 0x100d71e0; impl: lock impl+0x938 via f_10988564 guard; strcmp Master/LF/RF -> byte at +0x7f1/0x7f2/0x7f3 -> stb to out

</details>

### `GetOutputFixed`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports whether the speaker's output is fixed-level, meaning locked at full line level for feeding an external amplifier, or variable (controlled by the volume slider). A wiring option for setups where the player feeds another amp that should do the volume control.

<details markdown="1"><summary><b>Technical details</b></summary>

Pure delegation: impl f_100d6610 forwards to impl->v\[+0xe0\](impl, 0, r4-in) - the fixed-output flag lives behind a secondary interface method on the same object.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored by impl / unconstrained at impl level | none |

- **`InstanceID`**: Numeric instance selector. Read but unconsumed by the impl (dead compare or never read).
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentFixed` | boolean ('0'/'1') | delegate-produced |

- **`CurrentFixed`**: Produced by a pure vfunc forward: impl calls impl->v\[+0xe0\](impl, 0, arg) and returns its result - the flag source is a deeper object interface.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

none

#### State dependencies

none

#### Side effects

- Thin virtual forwarder: loads this->vptr\[+0xe0\] and tail-calls it with the out ptr and literal 0 - the fixed-output flag lives behind the impl own virtual API.

#### State transitions

none

#### Events

none

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

Reading flag +0x7ff elsewhere in the impl suggests +0xe0 returns the output-fixed state; unverified which field backs it.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073afb8`
- dispatch entry `0x10f11dc4`
- impl call `0x1073b044` obj `r5-in` slot `92` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073b0cc` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x1073b014` slot `8` (parse)

- fn 0x1073afb8 @ 0x1073afb8; action wrapper handler
- @ 0x10f11dc4; action dispatch table entry
- fn 0x100d6610; impl: mr r5,r4; addi r4,0; v+0xe0 bctr - pure tail-forward

</details>

### `GetRoomCalibrationStatus`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports the state of the speaker's room-calibration, which is Sonos's tuning process (Trueplay on newer products, the sonar-based tuning on this era) that measures a room and adjusts the speaker's sound to fit. The answer tells an app whether calibration has been done and what state it's in.

<details markdown="1"><summary><b>Technical details</b></summary>

Builds a 0x34-byte calibration-record (size tag + zeroed fields + caller regs stashed), locks impl+0x938, calls f_100dbb74(rec, arg>>16, ...) - a sonar-calibration query helper - and fills the two outputs from the result.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl guard with 718 | none - required argument |

- **`InstanceID`**: engine instance index; impl returns 718 when nonzero
  - validation: impl guard cmpwi r4,0: nonzero parsed value -> 718
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `RoomCalibrationEnabled` | boolean ('0'/'1') | record-derived |
| `RoomCalibrationAvailable` | boolean ('0'/'1') | record-derived |

- **`RoomCalibrationEnabled`**: Produced by impl f_100dbcd4: it initializes a 0x34-byte record at the caller, locks impl+0x938, runs f_100dbb74 after a >>16 shift on an arg, and fills the record fields that become these outputs.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
- **`RoomCalibrationAvailable`**: Produced by impl f_100dbcd4: it initializes a 0x34-byte record at the caller, locks impl+0x938, runs f_100dbb74 after a >>16 shift on an arg, and fills the record fields that become these outputs.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

impl mutex

#### State dependencies

none

#### Side effects

- Locks +0x938 (guard at r1+0x14) then calls worker f_100dbb74 to compute the two out flags.

#### State transitions

none

#### Events

none

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call.

- req vfunc +0x08 parse failed


#### Notes

Same record-builder pattern as SetOutputFixed impl f_100dcfc0 - the 0x34 record is a shared config/status query structure.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073b1ec`
- dispatch entry `0x10f11dd0`
- impl call `0x1073b22c` obj `r4-in` slot `28` arg4 `InstanceID`
- impl call `0x1073b248` obj `r4-in` slot `8` arg4 `?`
- impl call `0x1073b27c` obj `r5-in` slot `100` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073b298` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x64)`
- req vcall `0x1073b328` slot `12` (commit)

- fn 0x1073b1ec @ 0x1073b1ec; action wrapper handler
- @ 0x10f11dd0; action dispatch table entry
- fn 0x100dbcd4; impl: 0x34-record init at r3-in, lock +0x938, srwi arg>>16, call f_100dbb74

</details>

### `GetSupportsOutputFixed`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Reports whether this player can do fixed-level output at all. It is the 'can I even offer the fixed-volume option' check apps use before showing the setting.

<details markdown="1"><summary><b>Technical details</b></summary>

Locks impl+0x938, builds a small record via f_10203ec8, calls impl->v\[+0xf0\](impl,&rec), and when that returns nonzero copies rec+0x24 into the out param; return value is 63 (rc==0 path) or 52 (rc!=0 path).

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored by impl / unconstrained at impl level | none |

- **`InstanceID`**: Numeric instance selector. Read but unconsumed by the impl (dead compare or never read).
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentSupportsFixed` | boolean ('0'/'1') | 0/1 nominal |

- **`CurrentSupportsFixed`**: Written from a record field filled by impl->v\[+0xf0\](impl,&rec) when that call returns nonzero; emitted u32@rec+0x24.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - Return convention is unusual: impl presets r3=0x3f(63), calls v+0xf0; rc==0 -> skip out write, return 63; rc!=0 -> write rec+0x24 to out, return 52 (0x34). The numeric returns are likely internal status enums the request layer interprets.

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

vfunc +0xf0 exists on the impl (all classes observed implement it)

#### State dependencies

none

#### Side effects

- Builds a query record on the stack via f_10203ec8 under mutex +0x938 and returns its verdict; the support-bit derivation is internal to that helper.

#### State transitions

none

#### Events

none

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code. The impl's own returns (63/52) become the SOAP status via cr0 - the request layer may treat nonzero rc as fault depending on the convention at 0x1073aea4.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

Verify at runtime: the 63/52 returns suggest this getter may fault or emit distinct statuses depending on the delegate result.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073aea4`
- dispatch entry `0x10f11ddc`
- impl call `0x1073af24` obj `r5-in` slot `84` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073afac` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x1073af00` slot `8` (parse)

- fn 0x1073aea4 @ 0x1073aea4; action wrapper handler
- @ 0x10f11ddc; action dispatch table entry
- fn 0x100d6764 @ 0x100d67ac; v+0xf0 call on &rec; rc!=0 -> stw rec+0x24->out, r3=0x34; rc==0 -> r3=0x3f

</details>

### `GetTreble`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Supposed to report the speaker's treble level, but like GetBass it is a documented no-op in this build: the routine is an empty routine that does and returns nothing. The advertised command exists, and the working read path for treble is the generic GetEQ command.

<details markdown="1"><summary><b>Technical details</b></summary>

Acquires an audio-context object (f_10118278 + f_1011fdd0 on impl+0x3c4/+0x9c8), locks impl+0x938, calls ctx-worker f_100e1fec(this,&ctx) and returns its rc. The impl reads NEITHER the InstanceID argument nor the out pointer - both die in registers at entry.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored by impl / unconstrained at impl level | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). Not checked - impl f_100e3450 never reads r4.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentTreble` | signed int16 | signed i16 |

- **`CurrentTreble`**: Emitted as a SIGNED 16-bit value (lha @sp+0x16 -> f_1055fc84) - consistent with a -10..10 treble level.
  - The impl f_100e3450 never reads the out pointer (r5 dead from entry) - it delegates to ctx-worker f_100e1fec(this,&ctxobj). Where the out slot is actually written is unresolved: either f_100e1fec writes through an aliased channel or the emitted i16 is stale stack data (same anomaly class as GetBass, though this impl is a real function).

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse only; impl ignores both arguments.

#### Requirements / preconditions

audio context objects impl+0x3c4/+0x9c8 must support f_1011fdd0 acquisition.

#### State dependencies

requires ctx objects impl+0x3c4/+0x9c8 for f_1011fdd0 acquisition

#### Side effects

- Same ctx skeleton as GetEQ with reader f_100e1fec(this,ctx) under +0x938.

#### State transitions

none

#### Events

none

#### Return behavior

Success is signaled by the implementation leaving cr0.eq=1 at return (the callee performs a cr0-writing op such as 'mr. r30,r3' on its status); the wrapper then emits outputs via req vfunc +0x24 and commits via +0x14. Any other path calls req vfunc +0x14 with r4 = implementation return code, producing a SOAP fault whose numeric code equals the impl return value. CurrentTreble is emitted as signed i16; the out-write site is unresolved because the impl discards the out pointer.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed

**`impl_rc`** `strong`

impl-level return surfaced as the SOAP error code

- impl returns nonzero - see rc vocabulary

concrete rc vocabulary: 0 (success); ctx-reader f_100e1fec rc propagated; ctx machinery identical to GetEQ skeleton


#### Notes

Largest unresolved piece: the CurrentTreble out path. Worth a focused pass on f_100e1fec later.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073bb9c`
- dispatch entry `0x10f11de8`
- impl call `0x1073bc1c` obj `r5-in` slot `56` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073bca4` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x1073bbf8` slot `8` (parse)

- fn 0x1073bb9c @ 0x1073bb9c; action wrapper handler
- @ 0x10f11de8; action dispatch table entry
- fn 0x100e3450; impl: ctx acquire, lock +0x938, call f_100e1fec, unlock, return rc; r4/r5 never read

</details>

### `GetVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports the speaker's volume for whichever channel you ask about: the number behind the app's volume slider, on a 0-100 scale.

<details markdown="1"><summary><b>Technical details</b></summary>

Reads the channel volume through a two-stage impl: shim f_100e43b4 gates InstanceID!=0 -> 702, worker f_100e42a8 acquires an audio-context object (f_10118278/f_1011fdd0 on impl+0x3c4/+0x9c8), locks impl+0x938, checks readiness gate f_102a5028(*(impl+0x3ac)) (fail -> 501), then reads via f_100da830 -> f_102a50b8 -> f_107ea964.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | `0` / 0 .. 0 | none |
| `Channel` | channel token | yes | `Master`, `LF`, `RF` / max 1023 chars | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - special values: `0` = the only instance implemented; any other value faults with 702
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). Shim f_100e43b4 compares it to zero and returns 0x2be (702) for anything nonzero before calling the worker.
  - buffer cap: `0x18`
- **`Channel`**: Audio channel selector string; compared verbatim (strcmp, case-sensitive) by the implementation.
  - special values: `Master` = nominal channel; `any token containing/being 'spatial'` = worker strcmp's a channel-related string against 'spatial' and on match calls f_100e382c for extra processing (exact operand flow unresolved)
  - validation: The channel record pointer is forwarded to f_100da830 inside the worker; the exact accepted set is enforced inside that helper (it shares the SonosRcChannel convention but an additional 'spectral'/'spatial'/sonar-calibration branch exists whose reachability from SOAP is unresolved).
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentVolume` | unsigned int16 | u16 (device gain units) |

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

InstanceID must be 0 (else 702). Channel forwarded to the read helper; rejection there returns its own rc.

#### Requirements / preconditions

audio-context gate f_102a5028(*(impl+0x3ac)) must succeed else 501; impl mutex held during the read.

#### State dependencies

read traverses context object chain impl+0x3ac -> +0x34 -> +0xd0; gate f_102a5028(*(impl+0x3ac)) fails -> 501 when audio ctx not ready

#### Side effects

- Builds a query context via f_10118278 + f_1011fdd0(impl+0x3c4,impl+0x9c8), locks +0x938, gates on a state check over impl+0x3ac (f_102a5028; nonzero -> 501), then reads channel volume via f_100da830 with special handling for channel 'spatial' (extra f_100e382c call).

#### State transitions

none

#### Events

none - pure read

#### Return behavior

Success is signaled by the implementation leaving cr0.eq=1 at return (the callee performs a cr0-writing op such as 'mr. r30,r3' on its status); the wrapper then emits outputs via req vfunc +0x24 and commits via +0x14. Any other path calls req vfunc +0x14 with r4 = implementation return code, producing a SOAP fault whose numeric code equals the impl return value. CurrentVolume is the u16 written by the nested-object read; a 'spatial' channel match triggers extra handling f_100e382c (purpose unresolved).

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed

**`501`** `confirmed`

Audio context not ready: f_102a5028(*(impl+0x3ac)) returned failure inside worker f_100e42a8.

- context/state gate failed (source not active or audio ctx absent)

**`702`** `confirmed`

InstanceID nonzero at the impl shim f_100e43b4.

- parsed InstanceID != 0: impl/parse rc path to shared fault emitter (see evidence)

**`impl_rc`** `strong`

impl-level return surfaced as the SOAP error code

- impl returns nonzero - see rc vocabulary


**Bounded unknown (proven):** Nonzero return from the read helper f_100da830 propagates to the SOAP fault.
**Bounded unknown (unresolved):** The helper contains a 'spectral'/'spatial'/'rc_impl' sonar-calibration branch (arg r7 not supplied by this wrapper - likely a dead/latent path) and its remaining failure conditions are unmapped.

concrete rc vocabulary: 0 (success, worker rc forwarded), 702 null out ptr (0x100e43b4), 501 impl+0x3ac state check fail (0x100e4314-0x100e432c); worker f_100da830 return propagated verbatim as r30


#### Notes

Error code differs from AVTransport: nonzero InstanceID yields 702 here vs 718 in Seek.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073bdf0`
- dispatch entry `0x10f11df4`
- impl call `0x1073be9c` obj `r5-in` slot `24` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073bf24` obj `*(sp-0x430+0x42c)` slot `12` arg4 `?`
- req vcall `0x1073be74` slot `8` (parse)

- fn 0x1073bdf0 @ 0x1073bdf0; action wrapper handler
- @ 0x10f11df4; action dispatch table entry
- fn 0x100e43b4; impl shim: instID gate -> tail f_100e42a8
- fn 0x100e42a8; worker: ctx acquire, lock +0x938, gate f_102a5028, call f_100da830, strcmp 'spatial' -> f_100e382c

</details>

### `GetVolumeDB`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports the volume in decibel terms rather than the 0-100 scale. It is the technical-scale companion to GetVolume, used where the system wants real loudness units rather than slider position.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns a volume reading via shared worker f_100dcb00 invoked in mode 0 with flag r6=1 (thunk 0x100dcc64): the dB-scale companion to GetVolume.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored by impl / unconstrained at impl level | none |
| `Channel` | channel token | yes | ignored - forwarded as record pointer / max 1023 chars | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). Forwarded to the shared worker (dead compare) - ignored.
  - buffer cap: `0x18`
- **`Channel`**: Audio channel selector string; compared verbatim (strcmp, case-sensitive) by the implementation.
  - special values: `any` = worker hardcodes 'Master'
  - validation: Parsed but unused.
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentVolume` | signed int16 | worker-produced value |

- **`CurrentVolume`**: Current volume expressed in the worker's mode-0 units (the +0x24 thunk passes mode=0, flag r6=1 to shared worker f_100dcb00 - the 'dB' reading path).
  - Exact unit/scale produced by worker mode 0 is unresolved (thunk constants 0/1 select the path inside f_100dcb00).

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse; impl ignores InstanceID/Channel.

#### Requirements / preconditions

impl+0x7ff gate applies (shared worker).

#### State dependencies

shared worker state (impl+0x7ff gate, ctx objects)

#### Side effects

- Arg-remapping thunk into shared worker f_100dcb00 with mode flags (0,1) in base class; derived class overrides the slot with f_1046ad24.

#### State transitions

none

#### Events

none

#### Return behavior

Success is signaled by the implementation leaving cr0.eq=1 at return (the callee performs a cr0-writing op such as 'mr. r30,r3' on its status); the wrapper then emits outputs via req vfunc +0x24 and commits via +0x14. Any other path calls req vfunc +0x14 with r4 = implementation return code, producing a SOAP fault whose numeric code equals the impl return value.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed


#### Notes

Despite the name the impl is a mode-select thunk over the same worker used by SetVolume/SetRelativeVolume; mode-0 semantics (dB read vs raw) unresolved.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073b7e0`
- dispatch entry `0x10f11e00`
- impl call `0x1073b88c` obj `r5-in` slot `36` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073b914` obj `*(sp-0x430+0x42c)` slot `12` arg4 `?`
- req vcall `0x1073b864` slot `8` (parse)

- fn 0x1073b7e0 @ 0x1073b7e0; action wrapper handler
- @ 0x10f11e00; action dispatch table entry
- fn 0x100dcc64; thunk -> f_100dcb00(mode=0, flag=1)

</details>

### `GetVolumeDBRange`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Supposed to report the decibel range the volume control can span, but in this build it is a documented anomaly: the routine registered for this command is actually the physical-button mute routine, the same code that runs when you press the unit's mute button. Calling it toggles mute rather than returning a range. It is a wiring mistake preserved in the firmware, and a good example of how these reference docs capture what the binary really does rather than what the spec says it should.

<details markdown="1"><summary><b>Technical details</b></summary>

Reads as a volume-range query but its impl slot is the ButtonSetMute button handler in BOTH impl classes (f_100dcd88) - the action is anomalous: it executes a hardware-button mute commit and cannot return a range

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored by impl / unconstrained at impl level | none |
| `Channel` | channel token | yes | ignored / max 1023 chars | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). Not checked - impl ignores it.
  - buffer cap: `0x18`
- **`Channel`**: Audio channel selector string; compared verbatim (strcmp, case-sensitive) by the implementation.
  - special values: `any` = impl works on 'Master' internals
  - validation: Parsed but unused.
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `MinValue` | signed int16 | impl-produced value |
| `MaxValue` | signed int16 | impl-produced value |

- **`MinValue`**: never produced - the impl slot resolves to the ButtonSetMute handler f_100dcd88, which writes no range output
  - impl is a shared button/apply helper; out writes unverified - possible stale-slot emission like the stub cases.
- **`MaxValue`**: never produced - the impl slot resolves to the ButtonSetMute handler f_100dcd88, which writes no range output
  - impl is a shared button/apply helper; out writes unverified - possible stale-slot emission like the stub cases.

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse; impl performs no argument checks.

#### Requirements / preconditions

none beyond parse

#### State dependencies

none - no state gating observed beyond argument checks

#### Side effects

- IMPL-CLASS ANOMALY: both classes resolve the slot to f_100dcd88, the ButtonSetMute handler - it queries state via f_100d9b4c('Master') and logs 'on:%d src:%s'; MinValue/MaxValue are never produced by the impl.

#### State transitions

persists none (capability query) into the RCS settings member; notify->dirty->event pipeline (call-derived, slot-bounded)

#### Events

LastChange via RCS writer f_100e27b0 carrying none (mechanism proven; exact var emission per runtime change)

#### Return behavior

Success is signaled by the implementation leaving cr0.eq=1 at return (the callee performs a cr0-writing op such as 'mr. r30,r3' on its status); the wrapper then emits outputs via req vfunc +0x24 and commits via +0x14. Any other path calls req vfunc +0x14 with r4 = implementation return code, producing a SOAP fault whose numeric code equals the impl return value.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed


#### Notes

Flag for live-object verification: the installed impl may differ if a derived class overrides +0x2c.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073b920`
- dispatch entry `0x10f11e0c`
- impl call `0x1073b9d0` obj `r5-in` slot `44` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073ba7c` obj `*(sp-0x430+0x42c)` slot `12` arg4 `?`
- req vcall `0x1073b9a4` slot `8` (parse)

- fn 0x1073b920 @ 0x1073b920; action wrapper handler
- @ 0x10f11e0c; action dispatch table entry
- fn 0x100dcd88; calls f_100d9b4c(this,0,'Master',r30,r4); 'ButtonSetMute'/'on:%d src:%s' logs; table-indexed log string selection

</details>

### `RampToVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Commands a gradual volume change, a 'ramp' from the current level to a target over time rather than a jump. On this build it only exists on one internal flavor of the player (the command's implementation slot is absent on the base class), so whether it works depends on which build path is running.

<details markdown="1"><summary><b>Technical details</b></summary>

CLASS-B ONLY: vtable A has no +0x6c entry (0x00000000 terminator); derived class B implements it at 0x1046cdd8 (unexplored). Volume-ramp command with type, target, reset flag and program URI.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector | yes | parsed value | none |
| `Channel` | channel token | yes | parsed value / max 1023 chars | none |
| `RampType` | ramp type | yes | parsed value / max 63 chars | none |
| `DesiredVolume` | volume | yes | parsed value | none |
| `ResetVolumeAfter` | flag | yes | parsed value | none |
| `ProgramURI` | URI | yes | parsed value / max 1024 chars | none |

- **`InstanceID`**: consumed as fields of a state-machine action-event record (rc_impl_stp.cxx) rather than plain scalars
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`
- **`Channel`**: consumed as fields of a state-machine action-event record (rc_impl_stp.cxx) rather than plain scalars
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x400`
- **`RampType`**: consumed as fields of a state-machine action-event record (rc_impl_stp.cxx) rather than plain scalars
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x40`
- **`DesiredVolume`**: consumed as fields of a state-machine action-event record (rc_impl_stp.cxx) rather than plain scalars
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`
- **`ResetVolumeAfter`**: consumed as fields of a state-machine action-event record (rc_impl_stp.cxx) rather than plain scalars
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`
- **`ProgramURI`**: consumed as fields of a state-machine action-event record (rc_impl_stp.cxx) rather than plain scalars
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x401`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `RampTime` | unsigned int32 | impl-produced |

- **`RampTime`**: consumed as fields of a state-machine action-event record (rc_impl_stp.cxx) rather than plain scalars
  - unit: seconds (nominal)
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

impl class B installed

#### State dependencies

call-derived: reads RCS member object via impl->+OFF->v\[slot\] delegate

#### Side effects

- Derived-class-only impl f_1046cdd8: consumes a VolumeSetActionEvent record - reads u8@0 and u16@2 from the event (log 'process VolumeSetActionEvent (%u,%d)' at rc_impl_stp.cxx:0x4f2), then continues into the stp worker chain. No base-class impl exists.

#### State transitions

persists RampType/RampRate-driven MasterVolume ramp into the RCS settings member; notify->dirty->event pipeline (call-derived, slot-bounded)

#### Events

LastChange via RCS writer f_100e27b0 carrying RampType/RampRate-driven MasterVolume ramp (mechanism proven; exact var emission per runtime change)

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code. Class-B impl behavior unexplored.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

Feature-gated by impl class like SetRoomCalibrationStatus.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073c834`
- dispatch entry `0x10f11e18`
- impl call `0x1073c990` obj `r5-in` slot `108` arg4 `*(sp-0x880+0x20)`
- impl call `0x1073ca18` obj `*(sp-0x880+0x87c)` slot `12` arg4 `?`
- req vcall `0x1073c950` slot `8` (parse)

- fn 0x1073c834 @ 0x1073c834; action wrapper handler
- @ 0x10f11e18; action dispatch table entry
- @ 0x10ed279c; vtable B slot +0x6c = 0x1046cdd8

</details>

### `ResetBasicEQ`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Resets the basic tone settings, meaning bass, treble, and loudness back to neutral, and returns the resulting per-channel values so the app can update its EQ display. The reset can also touch the mute state as part of its housekeeping.

<details markdown="1"><summary><b>Technical details</b></summary>

Resets the basic EQ set: locks impl+0x938, calls worker f_100d9d40(this, instID, chan, val) and, on a cr0 flag, additionally calls the SetMute worker f_100d99b0 - then logs 'ch:%s, vol:%u, on:%d' and returns per-channel results (Bass, Treble, Loudness, LeftVolume, RightVolume).

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl guard with 718 | none - required argument |

- **`InstanceID`**: engine instance index; impl returns 718 when nonzero
  - validation: impl guard cmpwi r4,0: nonzero parsed value -> 718
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Bass` | signed int16 | impl-produced |
| `Treble` | signed int16 | impl-produced |
| `Loudness` | boolean ('0'/'1') | impl-produced |
| `LeftVolume` | unsigned int16 | impl-produced |
| `RightVolume` | unsigned int16 | impl-produced |

- **`Bass`**: Post-reset value emitted from the impl's record/context after the reset sequence.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
- **`Treble`**: Post-reset value emitted from the impl's record/context after the reset sequence.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
- **`Loudness`**: Post-reset value emitted from the impl's record/context after the reset sequence.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
- **`LeftVolume`**: Post-reset value emitted from the impl's record/context after the reset sequence.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
- **`RightVolume`**: Post-reset value emitted from the impl's record/context after the reset sequence.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

impl mutex

#### State dependencies

shares the SetMute worker's state writes on one branch

#### Side effects

- Under mutex +0x938 calls EQ-reset worker f_100d9d40 then the shared commit worker f_100d99b0 (same worker SetMute uses for channel commit+notify).

#### State transitions

EQ fields reset

#### Events

same notify machinery as SetMute where shared

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code. Returns the post-reset values as outputs.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call.

- req vfunc +0x08 parse failed


#### Notes

f_100d9d40 is a shared per-channel parameter worker also used by ResetExtEQ.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073bf30`
- dispatch entry `0x10f11e24`
- impl call `0x1073bf70` obj `r4-in` slot `28` arg4 `InstanceID`
- impl call `0x1073bf8c` obj `r4-in` slot `8` arg4 `?`
- impl call `0x1073bfc0` obj `r5-in` slot `16` arg4 `*(sp-0x40+0x28)`
- impl call `0x1073bfdc` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x10)`
- req vcall `0x1073c0d8` slot `12` (commit)

- fn 0x1073bf30 @ 0x1073bf30; action wrapper handler
- @ 0x10f11e24; action dispatch table entry
- fn 0x100db5bc; impl: lock, f_100d9d40 call, conditional f_100d99b0 (SetMute worker), 'ch:%s, vol:%u, on:%d' log

</details>

### `ResetExtEQ`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Resets an extended equalizer band back to its neutral value. Extended bands are the finer-grained tone controls beyond basic bass and treble, and this returns the named band to flat without touching other bands.

<details markdown="1"><summary><b>Technical details</b></summary>

Resets an extended-EQ band: locks impl+0x938, calls shared param worker f_100d9d40(this, instID, EQType, val), then conditionally walks impl+0x3c0 -> f_106a9cc4 -> f_10687cbc and logs 'SetVolumeWithoutProxy ch:%s, vol:%u, src:%s'.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - forwarded to f_100d9d40 / unconstrained at impl level | none |
| `EQType` | EQ band selector | yes | parsed value / max 1023 chars | none |

- **`InstanceID`**: Numeric instance selector. Read but unconsumed by the impl (dead compare or never read).
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`
- **`EQType`**: EQ band selector forwarded to shared worker f_100d9d40.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x400`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

impl mutex; impl+0x3c0 object chain for the notify/apply branch

#### State dependencies

impl+0x3c0 must be nonnull for the apply branch (0x100dbeec gate)

#### Side effects

- Under mutex +0x938 calls f_100d9d40 then a three-call commit sequence f_106a9cc4 / f_10687cbc / f_100ed34c.

#### State transitions

EQ field(s) reset

#### Events

log tag says 'SetVolumeWithoutProxy' - the reset shares the volume-apply path

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

The 'SetVolumeWithoutProxy' tag inside ResetExtEQ confirms f_100d9d40/f_100d99b0-style workers are shared scalar-apply machinery reused across EQ and volume actions.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073a8dc`
- dispatch entry `0x10f11e30`
- impl call `0x1073a984` obj `r5-in` slot `20` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073a9e8` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x1073a960` slot `8` (parse)

- fn 0x1073a8dc @ 0x1073a8dc; action wrapper handler
- @ 0x10f11e30; action dispatch table entry
- fn 0x100dbe90; impl: lock, f_100d9d40, impl+0x3c0 gate, f_106a9cc4/f_10687cbc chain, 'SetVolumeWithoutProxy' log

</details>

### `RestoreVolumePriorToRamp`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Undoes a volume ramp by putting the volume back to whatever it was before a RampToVolume started. Interestingly the class split is the mirror of the ramp command: this restore works on the base player flavor where the ramp itself is absent, the leftover of a half-finished feature.

<details markdown="1"><summary><b>Technical details</b></summary>

CLASS-A implemented, class-B absent: vtable A slot +0x70 = f_100dee74 (real function) while vtable B shows 0xfffffff8 terminator. The mirror image of RampToVolume's gating - restoring volume is base-class behavior while ramping is derived-class.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer / unconstrained at impl level | none |
| `Channel` | channel token | yes | parsed token / max 1023 chars | none |

- **`InstanceID`**: Numeric instance selector. Read but unconsumed by the impl (dead compare or never read).
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`
- **`Channel`**: channel token for restore
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x400`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

impl class A slot implemented

#### State dependencies

The wrapper restores state through impl vfunc +0x70 on a deeper vtable; concrete stored-field dependencies unresolved.

#### Side effects

- state-mutation delegate: r30 v\[+0x70\] (call-derived member-method semantics)

#### State transitions

persists MasterVolume restored into the RCS settings member; notify->dirty->event pipeline (call-derived, slot-bounded)

#### Events

LastChange via RCS writer f_100e27b0 carrying MasterVolume restored (mechanism proven; exact var emission per runtime change)

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

Inverse class-gating vs RampToVolume/SetRoomCalibrationStatus.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073a9f4`
- dispatch entry `0x10f11e3c`
- impl call `0x1073aa9c` obj `r5-in` slot `112` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073ab00` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x1073aa78` slot `8` (parse)

- fn 0x1073a9f4 @ 0x1073a9f4; action wrapper handler
- @ 0x10f11e3c; action dispatch table entry
- @ 0x10e872f0; vtable A slot +0x70 = 0x100dee74
- @ 0x10ed279c; vtable B slot +0x70 = 0xfffffff8
- fn 0x100dee74; base vtable 0x10e872f0 +0x70
- fn 0x100de178; re-init body writes sub-vptrs into this+0x08..+0x28c

</details>

### `SetBass`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Sets the speaker's bass level, which is the app's bass slider. The value is stored in the player's tone state, and one quirk is that a sentinel value is treated as 'leave it alone' rather than as a real setting.

<details markdown="1"><summary><b>Technical details</b></summary>

Stores the desired bass value into impl+0x898 under the impl mutex, unless the record equals -1 which short-circuits to a no-op. No event/notify calls appear in this impl - state propagation presumably occurs via a separate apply path (unresolved).

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored by impl / unconstrained at impl level | none |
| `DesiredBass` | bass level | yes | any parsed word; -1 disables the write | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). Not checked by the impl (reads only the value record pointer).
  - buffer cap: `0x18`
- **`DesiredBass`**: Requested bass level; the impl receives a pointer to the parsed record and copies its first u32 into impl+0x898 unless it equals -1.
  - special values: -1: no-change sentinel (skip write, silent success)
  - validation: impl loads *(arg) as a word at 0x100d72f0; value -1 (0xffffffff) is the no-change sentinel and skips the write; every other value is stored verbatim at impl+0x898 - no range check exists
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse; impl honors -1 sentinel, no range check visible.

#### Requirements / preconditions

none

#### State dependencies

none - no state gating observed beyond argument checks

#### Side effects

- When the parsed DesiredBass word != -1, stores it verbatim at impl+0x898 under mutex +0x938; -1 is a no-change sentinel producing a silent no-op. No range check, no notification.

#### State transitions

bass EQ word updated when not -1

#### Events

none statically visible

#### Return behavior

Success is signaled by the implementation leaving cr0.eq=1 at return (the callee performs a cr0-writing op such as 'mr. r30,r3' on its status); the wrapper then emits outputs via req vfunc +0x24 and commits via +0x14. Any other path calls req vfunc +0x14 with r4 = implementation return code, producing a SOAP fault whose numeric code equals the impl return value.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed


#### Notes

Impl signature is (impl, recordptr) - a different convention than the channel/value impls; the wrapper supplies &rec@sp+0x16.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073c4cc`
- dispatch entry `0x10f11e48`
- impl call `0x1073c570` obj `r5-in` slot `52` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073c5d4` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073c54c` slot `8` (parse)

- fn 0x1073c4cc @ 0x1073c4cc; action wrapper handler
- @ 0x10f11e48; action dispatch table entry
- fn 0x100d72dc; impl: lwz *rec; cmpwi -1 -> skip; lock +0x938; stw -> impl+0x898; unlock

</details>

### `SetChannelMap`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Assigns which audio channels each part of the player outputs. This is the mapping used in bonded, stereo, and home-theater arrangements to say which physical output carries left, right, or other channels. It is plumbing for multi-speaker configurations rather than an everyday setting.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets the channel-map: entry branches on cr0.eq as an INPUT condition (wrapper pre-sets it), checks whether impl vfunc +0x5c is the base implementation 0x100d7364 (derived-class detection), locks impl+0x938, checks flag +0x7ff, calls f_10988984 for a sub-lock byte result, and strcmp's channel tokens ('Master' seen) to dispatch.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - not checked in visible impl body / unconstrained at impl level | none |
| `ChannelMap` | channel map descriptor | yes | token list per impl strcmp chain / max 31 chars | none |

- **`InstanceID`**: Numeric instance selector. Read but unconsumed by the impl (dead compare or never read).
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`
- **`ChannelMap`**: Channel-map descriptor string; the impl strcmps channel tokens including 'Master' and dispatches per-channel setup; the entry tests cr0.eq as an input flag (0x100d7434) - the impl vfunc is invoked with a pre-set condition flag, a convention the wrapper establishes.
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - Impl also checks impl->v\[+0x5c\] == base fn 0x100d7364 to detect class overrides before applying (0x100d7438-0x100d744c).
  - buffer cap: `0x20`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse; impl does complex conditional dispatch.

#### Requirements / preconditions

impl mutex + sub-lock f_10988984

#### State dependencies

flag impl+0x7ff gates part of the path

#### Side effects

- Invokes this->vfunc\[0\] (lwz 0(r3) virtual dispatch) wrapped in the +0x938 mutex pair f_10988558/f_10988984; the channel-map string is handed to that virtual call.

#### State transitions

persists channel-map assignment into the RCS settings member; notify->dirty->event pipeline (call-derived, slot-bounded)

#### Events

LastChange via RCS writer f_100e27b0 carrying channel-map assignment (mechanism proven; exact var emission per runtime change)

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

Derived-class B overrides this slot (0x104717f4) - grouped channel-map behavior differs.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073ab0c`
- dispatch entry `0x10f11e54`
- impl call `0x1073abb4` obj `r5-in` slot `80` arg4 `*(sp-0x50+0x18)`
- impl call `0x1073ac18` obj `*(sp-0x50+0x4c)` slot `12` arg4 `402`
- req vcall `0x1073ab90` slot `8` (parse)

- fn 0x1073ab0c @ 0x1073ab0c; action wrapper handler
- @ 0x10f11e54; action dispatch table entry
- fn 0x100d7400; cr0-input entry check; v+0x5c == f_100d7364 override detection; 'Master' strcmp

</details>

### `SetEQ`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Sets one of the speaker's tone parameters through the generic equalizer path. This is the working route the app uses when you move a tone slider, since the dedicated SetTreble command is a no-op in this build.

<details markdown="1"><summary><b>Technical details</b></summary>

Conditional EQ apply: locks impl+0x938 (f_10988558), invokes worker f_100e27b0(this, InstanceID, 1) when InstanceID==0 and f_100e27b0(this, EQType, 0) when EQType==0, then unlocks (f_10988984) and returns through a tail sequence.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - not enforced by this impl / unconstrained at impl level | none |
| `EQType` | EQ band selector | yes | any parsed value / max 1023 chars | none |
| `DesiredValue` | EQ level | yes | parsed value | none |

- **`InstanceID`**: validated at the request layer; the impl receives only the two EQ records plus the out pointer and never sees this value
  - special values: `0` = triggers worker call f_100e27b0(this,0,1)
  - validation: not forwarded to impl f_100e323c (impl tests only the EQType/DesiredValue record pointers for null)
  - buffer cap: `0x18`
- **`EQType`**: Optional at impl level: the record pointer is applied only if non-null (separate f_100e27b0 calls keyed by position)
  - special values: `0` = triggers worker call f_100e27b0(this,0,0)
  - validation: null record -> silently skipped; non-null -> applied via f_100e27b0(this,rec,flag) (flag=1 EQType, flag=0 DesiredValue)
  - Both args act as independent zero-gated worker triggers - unusual semantics; whether the worker treats them as band indices or flags is unresolved.
  - buffer cap: `0x400`
- **`DesiredValue`**: Optional at impl level: the record pointer is applied only if non-null (separate f_100e27b0 calls keyed by position)
  - validation: null record -> silently skipped; non-null -> applied via f_100e27b0(this,rec,flag) (flag=1 EQType, flag=0 DesiredValue)
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse; impl branches only on ==0 per arg.

#### Requirements / preconditions

impl mutex

#### State dependencies

none beyond arg-zero gating

#### Side effects

- Each non-null EQ arg record is applied via f_100e27b0(this,rec,flag) under mutex +0x938 (flag=1 on the EQType path, 0 on DesiredValue); then an 8-byte record is copied from global 0x1109b010 into the out arg. Null arg records are silently skipped.

#### State transitions

persists Treble/Bass EQ value into the RCS settings member; notify->dirty->event pipeline (call-derived, slot-bounded)

#### Events

The impl writes EQ state through worker f_100e27b0 and copies an 8-byte record from global 0x1109b010 to the out arg; no explicit notify call is present in the impl body - any LastChange emission is downstream of f_100e27b0

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

Zero-gated dual worker calls are an unusual pattern - possibly 'apply defaults when selector is 0'. Worth revisiting with f_100e27b0.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073c6f4`
- dispatch entry `0x10f11e60`
- impl call `0x1073c7c4` obj `r5-in` slot `68` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073c828` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x1073c79c` slot `8` (parse)

- fn 0x1073c6f4 @ 0x1073c6f4; action wrapper handler
- @ 0x10f11e60; action dispatch table entry
- fn 0x100e323c; impl: lock; instID==0 -> f_100e27b0(this,instID,1); EQType==0 -> f_100e27b0(this,EQType,0); unlock

</details>

### `SetLoudness`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Turns the loudness setting on or off, the fullness boost for quiet listening. Like GetLoudness it is conditionally implemented: on this firmware whether the command really runs depends on which internal player class is installed, which cannot be determined from the outside.

<details markdown="1"><summary><b>Technical details</b></summary>

CONDITIONALLY IMPLEMENTED: vtable A has null stub f_100e44e8 at slot +0x4c; vtable B overrides with real impl 0x1046d340. SOAP-visible behavior depends on which impl class is installed (selection unresolved).

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | input | yes | per parse | none |
| `Channel` | input | yes | per parse / max 1023 chars | none |
| `DesiredLoudness` | input | yes | per parse | none |

- **`InstanceID`**: parsed by the request layer but never read - impl vfunc 0x100e44e8 is a no-op stub
  - validation: no impl-level use or validation (stub impl)
  - In impl class B the slot is a real impl (f_1046db28/f_1046d340) - semantics above describe the proven base-class stub.
  - buffer cap: `0x18`
- **`Channel`**: parsed by the request layer but never read - impl vfunc 0x100e44e8 is a no-op stub
  - validation: no impl-level use or validation (stub impl)
  - In impl class B the slot is a real impl (f_1046db28/f_1046d340) - semantics above describe the proven base-class stub.
  - buffer cap: `0x400`
- **`DesiredLoudness`**: parsed by the request layer but never read - impl vfunc 0x100e44e8 is a no-op stub
  - validation: no impl-level use or validation (stub impl)
  - In impl class B the slot is a real impl (f_1046db28/f_1046d340) - semantics above describe the proven base-class stub.
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

impl class determines all behavior

#### State dependencies

none - no state gating observed beyond argument checks

#### Side effects

- None in impl class A - vfunc is the null stub f_100e44e8. In impl class B it is f_1046d340 (grouped-operation prelude machinery).

#### State transitions

persists Loudness into the RCS settings member; notify->dirty->event pipeline (call-derived, slot-bounded)

#### Events

LastChange via RCS writer f_100e27b0 carrying Loudness (mechanism proven; exact var emission per runtime change)

#### Return behavior

Class A: stale-cr0 return - likely commits success with uninitialized output / no effect. Class B: real impl at 0x1046d340 (unexplored).

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed


#### Notes

Loudness exists only on the derived/proxy impl class - plausible device-capability gating.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073b474`
- dispatch entry `0x10f11e6c`
- impl call `0x1073b544` obj `r5-in` slot `76` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073b5a8` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x1073b51c` slot `8` (parse)

- fn 0x1073b474 @ 0x1073b474; action wrapper handler
- @ 0x10f11e6c; action dispatch table entry
- fn 0x100e44e8; null stub in vtable A
- @ 0x10ed279c; vtable B slot +0x4c = 0x1046d340

</details>

### `SetMute`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Mutes or unmutes the speaker for a given channel, the mute button. Beyond flipping the flag it also does bookkeeping: on the master channel it synchronizes the saved volume snapshot so that unmuting restores the level you had, marks the state as changed so other parts of the system update, and applies the committed state to the audio hardware.

<details markdown="1"><summary><b>Technical details</b></summary>

Writes the per-channel mute byte (impl+0x7f1/2/3/4) under the impl mutex; on the Master path it additionally syncs the volume u16 (+0x7da -> +0x3c8, with a +0x7e0 -> +0x7da snapshot when both flags +0x7ff and +0x801 are set), applies committed state via f_100d7f34, sets the dirty flag impl+0x7f5=1 and emits two notifications (f_1067c6ec on impl+8, then f_100d993c).

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | `0` / 0 .. 0 | none |
| `Channel` | channel token | yes | `Master`, `LF`, `RF`, `FocusMode` / max 1023 chars | none |
| `DesiredMute` | mute flag | yes | any parsed value - stored as a byte; no boolean normalization observed in the impl | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - special values: `0` = the only instance implemented; any other value faults with 702
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). The worker f_100d99b0 checks it under the mutex: nonzero -> return 0x2be (0x100d9a00-0x100d9ab8).
  - buffer cap: `0x18`
- **`Channel`**: Audio channel selector string; compared verbatim (strcmp, case-sensitive) by the implementation.
  - special values: `Master` = writes impl+0x7f1 and additionally runs a flag-gated volume-field sync (impl+0x7e0 -> +0x7da) when BOTH impl+0x7ff and impl+0x801 are nonzero; `LF` = writes impl+0x7f2; `RF` = writes impl+0x7f3; `FocusMode` = writes impl+0x7f4 - a fourth channel accepted by SetMute but rejected by GetMute
  - validation: Worker strcmp chain at 0x100d9a08-0x100d9b48; unmatched token returns 402 (r30 preset to 0x192 at 0x100d9b34).
  - buffer cap: `0x400`
- **`DesiredMute`**: Requested mute state; stored verbatim as the channel's mute byte.
  - validation: Request-layer parse only (req vfunc +0x08); the impl stores the low byte without range checks.
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

InstanceID must equal 0 (else 702); Channel must be exactly Master, LF, RF or FocusMode (else 402). DesiredMute is not range-validated.

#### Requirements / preconditions

impl mutex free; in derived-class impls the prelude object at impl+0xbc8/+0x9c8 must initialize (f_1046dff0/f_1046c3cc).

#### State dependencies

flags impl+0x7ff && impl+0x801 gate the +0x7e0->+0x7da snapshot on the Master path

#### Side effects

- Writes mute byte impl+0x7f1..0x7f4 (Master/LF/RF/FocusMode) under mutex +0x938; on the Master path syncs +0x7e0->+0x7da when flags +0x7ff and +0x801 are both set, mirrors +0x7da->+0x3c8, commits via f_100d7f34, sets dirty flag +0x7f5=1 and notifies (f_1067c6ec on impl+8 arg 0x1f5, then f_100d993c).

#### State transitions

channel mute byte 0->1 or 1->0 per channel field

#### Events

Two event/notify calls follow the write (f_1067c6ec at 0x100d9a80 on impl+8 with r10=0x1f5, then f_100d993c at 0x100d9a88); impl+0x7f5=1 marks rendering state dirty - consistent with LastChange eventing of Mute/Volume but the emitted payload is generated downstream (not statically recovered).

#### Return behavior

Success is signaled by the implementation leaving cr0.eq=1 at return (the callee performs a cr0-writing op such as 'mr. r30,r3' on its status); the wrapper then emits outputs via req vfunc +0x24 and commits via +0x14. Any other path calls req vfunc +0x14 with r4 = implementation return code, producing a SOAP fault whose numeric code equals the impl return value. Success means the byte was committed locally and the apply/notify sequence ran; in derived-class (proxy) impls a grouped-operation prelude runs first.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper, or unrecognized Channel token (not Master/LF/RF/FocusMode) rejected by the worker.

- req vfunc +0x08 parse failed
- Channel not in {Master, LF, RF, FocusMode}

**`702`** `confirmed`

InstanceID nonzero; checked inside worker f_100d99b0 under the mutex.

- parsed InstanceID != 0: impl/parse rc path to shared fault emitter (see evidence)


#### Notes

'SetMuteWithoutProxy' log tag in base impl vs the 0x1046xxxx prelude in the derived class shows the two impl classes differ in group/proxy handling of the same SOAP action.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073b334`
- dispatch entry `0x10f11e78`
- impl call `0x1073b404` obj `r5-in` slot `12` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073b468` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x1073b3dc` slot `8` (parse)

- fn 0x1073b334 @ 0x1073b334; action wrapper handler
- @ 0x10f11e78; action dispatch table entry
- fn 0x100db3fc; impl shim: lock +0x938, log 'SetMuteWithoutProxy ch:%s, on:%d', call worker f_100d99b0, unlock, return worker rc
- fn 0x1046e50c; derived-class SetMute: grouped-op prelude then base f_100db3fc

</details>

### `SetOutputFixed`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Chooses fixed versus variable output level, meaning whether the speaker's output is pinned at full level for an external amp or follows the volume control.

<details markdown="1"><summary><b>Technical details</b></summary>

Builds/fills a 0x34-byte config record (size tag 0x34, fields zeroed, then conditional fills) and reads flags +0x7ff/+0x801 off an object in r4 - the impl signature differs from the standard (impl,instID,val) shape: it operates on a caller-supplied record and a second object.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - impl uses r4 as an object pointer, not the instID value / unconstrained at impl level | none |
| `DesiredFixed` | fixed-output flag | yes | parsed value | none |

- **`InstanceID`**: Numeric instance selector. Read but unconsumed by the impl (dead compare or never read).
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`
- **`DesiredFixed`**: Requested fixed-output state; arrives in the impl's record-building convention (impl zeroes a 0x34 record at r3 and reads flags +0x7ff/+0x801 from an object in r4).
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

record/object args per impl convention

#### State dependencies

flags +0x7ff/+0x801 read on the target object

#### Side effects

- Builds a 0x34-byte status record; when flags impl+0x7ff and impl+0x801 are both set the record is filled with the literal 'Cannot set volume in fixed output mode' (reused error text) and the call fails; otherwise it invokes this->vfunc\[+0xe4\] and requires a 0x34-byte reply.

#### State transitions

persists fixed-volume output into the RCS settings member; notify->dirty->event pipeline (call-derived, slot-bounded)

#### Events

LastChange via RCS writer f_100e27b0 carrying fixed-volume output (mechanism proven; exact var emission per runtime change)

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

Flag +0x7ff is the same byte that gates SetVolume's write and selects volume fields in GetHeadphoneConnected - SetOutputFixed is very likely its writer.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073b5b4`
- dispatch entry `0x10f11e84`
- impl call `0x1073b65c` obj `r5-in` slot `88` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073b6c0` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073b634` slot `8` (parse)

- fn 0x1073b5b4 @ 0x1073b5b4; action wrapper handler
- @ 0x10f11e84; action dispatch table entry
- fn 0x100dcfc0; impl: 0x34-record zero-init at r3, flag reads +0x7ff/+0x801 on r4 object

</details>

### `SetRelativeVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Moves the volume by a relative step, 'up by 5' rather than 'to 55', and reports the resulting level. This is how volume-up/down buttons that don't know the current value do their job.

<details markdown="1"><summary><b>Technical details</b></summary>

Applies a signed adjustment to the Master volume through the shared worker f_100dcb00 in relative mode (thunk 0x100dcc44 remaps args with mode flag r4=1) and returns the resulting volume.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored by impl / unconstrained at impl level | none |
| `Channel` | channel token | yes | ignored - forwarded as record pointer to the worker / max 1023 chars | none |
| `Adjustment` | volume delta | yes | parsed integer; worker's 'value<2' branch on its operand applies | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). Forwarded into shared worker f_100dcb00 where it lands in the dead compare - ignored like SetVolume.
  - buffer cap: `0x18`
- **`Channel`**: Audio channel selector string; compared verbatim (strcmp, case-sensitive) by the implementation.
  - special values: `any` = worker zeroes the channel record pointer and operates on 'Master'
  - validation: Parsed but unused - the worker's write path is hardcoded to 'Master'.
  - buffer cap: `0x400`
- **`Adjustment`**: Signed volume adjustment; arrives at the shared worker as r8 after thunk remap (0x100dcc44).
  - validation: No range check observed at the worker entry; relative-application math inside f_100d9b4c/f_100da1e0 is unresolved.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NewVolume` | unsigned int16 | post-adjustment volume value |

- **`NewVolume`**: Resulting volume after the relative apply; emitted as i16/u16 from the stack out slot written by the worker chain.
  - Out-write site inside the worker chain is unresolved (worker writes u16 at its own stack slot 0x12 via f_100da1e0; exact propagation to this out arg not yet traced).

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse; impl does not validate InstanceID/Channel and does not range-check Adjustment at entry.

#### Requirements / preconditions

impl+0x7ff must be clear for any effect (same shared worker).

#### State dependencies

flag impl+0x7ff != 0 suppresses the write (shared worker)

#### Side effects

- Arg-remapping thunk into shared worker f_100dcb00 with mode flags (1,0) appended - relative and absolute volume share one code path; worker semantics as documented under SetVolume.

#### State transitions

Master volume adjusted by the signed delta (result clamped inside unresolved worker internals)

#### Events

none statically visible

#### Return behavior

Success is signaled by the implementation leaving cr0.eq=1 at return (the callee performs a cr0-writing op such as 'mr. r30,r3' on its status); the wrapper then emits outputs via req vfunc +0x24 and commits via +0x14. Any other path calls req vfunc +0x14 with r4 = implementation return code, producing a SOAP fault whose numeric code equals the impl return value. NewVolume reflects the post-apply value; the same impl+0x7ff no-op gate applies as in SetVolume.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed


#### Notes

Shares all worker caveats with SetVolume (dead InstanceID check, hardcoded 'Master', +0x7ff no-op gate, LUT path).


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073c224`
- dispatch entry `0x10f11e90`
- impl call `0x1073c2f8` obj `r5-in` slot `32` arg4 `*(sp-0x430+0x14)`
- impl call `0x1073c380` obj `*(sp-0x430+0x42c)` slot `12` arg4 `?`
- req vcall `0x1073c2cc` slot `8` (parse)

- fn 0x1073c224 @ 0x1073c224; action wrapper handler
- @ 0x10f11e90; action dispatch table entry
- fn 0x100dcc44; thunk -> f_100dcb00 with mode=1

</details>

### `SetRoomCalibrationStatus`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Writes the room-calibration state. It is the setter that pairs with GetRoomCalibrationStatus, recording that tuning was started, completed, or cleared. On this build it only exists on one internal player flavor, and on the base class the slot is absent so calling it hits an unimplemented path.

<details markdown="1"><summary><b>Technical details</b></summary>

ABSENT IN CLASS A: vtable A's slot +0x68 is 0xfffffff8 (vtable terminator - the base interface ends at +0x64). Only derived class B implements it at 0x1046cacc (unexplored). In class-A deployments the SOAP call dispatches to a non-function slot - behavior undefined/likely dispatch failure.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer / unconstrained at impl level | none |
| `RoomCalibrationEnabled` | calibration flag | yes | parsed value | none |

- **`InstanceID`**: Numeric instance selector. Read but unconsumed by the impl (dead compare or never read).
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`
- **`RoomCalibrationEnabled`**: consumed as fields of a state-machine action-event record (rc_impl_stp.cxx) rather than plain scalars
  - validation: request-layer parse (req vfunc +0x08); no impl-side checks
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse.

#### Requirements / preconditions

impl class B installed (vtable 0x10ed279c or subclass)

#### State dependencies

call-derived: reads RCS member object via impl->+OFF->v\[slot\] delegate

#### Side effects

- Derived-class-only impl f_1046cacc: an rc_impl_stp.cxx event consumer - parses a RenderingControlSetEqActionEvent record ('%s:%u' log) and processes it through the state-machine onEvent path. No base-class impl exists.

#### State transitions

persists RoomCalibrationState into the RCS settings member; notify->dirty->event pipeline (call-derived, slot-bounded)

#### Events

LastChange via RCS writer f_100e27b0 carrying RoomCalibrationState (mechanism proven; exact var emission per runtime change)

#### Return behavior

Success = impl leaves cr0.eq set at return -> wrapper emits outputs (req vfunc +0x24) and commits (+0x14); otherwise req vfunc +0x14 is invoked with r4 = impl rc producing a SOAP fault with that code. Class-B impl behavior unexplored.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action.

- implementation object pointer null at dispatch

**`402`** `confirmed`

Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req vfunc +0x08 returned nonzero, wrapper loads 402 (addi r4,0x192) and faults via req vfunc +0x14.

- req vfunc +0x08 parse failed
- any required input arg missing, unparsable or failing request-layer validation


#### Notes

One of three actions missing from the base vtable (with RampToVolume and RestoreVolumePriorToRamp) - feature-gated by impl class.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073b6cc`
- dispatch entry `0x10f11e9c`
- impl call `0x1073b770` obj `r5-in` slot `104` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073b7d4` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073b74c` slot `8` (parse)

- fn 0x1073b6cc @ 0x1073b6cc; action wrapper handler
- @ 0x10f11e9c; action dispatch table entry
- @ 0x10e872f0; vtable A ends at +0x64; slot +0x68 = 0xfffffff8
- @ 0x10ed279c; vtable B slot +0x68 = 0x1046cacc

</details>

### `SetTreble`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Supposed to set the treble level, but in this build it is a documented no-op: its routine is the same empty routine as GetBass and GetTreble. The request is accepted and an empty success is returned while nothing changes. Real treble adjustment happens through the generic SetEQ path.

<details markdown="1"><summary><b>Technical details</b></summary>

NEUTERED ACTION: impl vfunc +0x3c is f_100d65f4 (same null stub as GetBass) in both vtables - performs nothing, returns r3 = impl pointer with stale cr0. The action has no outputs, so a successful emit commits an empty OK response while doing nothing.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored / unconstrained at impl level | none |
| `DesiredTreble` | treble level (nominal) | yes | any - unread | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). Not checked - stub impl reads no args.
  - buffer cap: `0x18`
- **`DesiredTreble`**: Parsed value never consumed - the impl is a null stub.
  - validation: no impl use
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse only.

#### Requirements / preconditions

none

#### State dependencies

none - no state gating observed beyond argument checks

#### Side effects

- None - impl vfunc is the 3-instruction null stub f_100d65f4 in BOTH impl classes; DesiredTreble is discarded.

#### State transitions

none

#### Events

none

#### Return behavior

SOAP success commits with no state change whatsoever - SetTreble silently no-ops (or faults with code = impl pointer if stale cr0.eq happens clear).

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed


#### Notes

Asymmetric with SetBass (+0x34 -> real impl f_100d72dc): bass can be written but not read; treble can be read but not written.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073c5e0`
- dispatch entry `0x10f11ea8`
- impl call `0x1073c684` obj `r5-in` slot `60` arg4 `*(sp-0x30+0x18)`
- impl call `0x1073c6e8` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073c660` slot `8` (parse)

- fn 0x1073c5e0 @ 0x1073c5e0; action wrapper handler
- @ 0x10f11ea8; action dispatch table entry
- fn 0x100d65f4; null stub at +0x3c in vtables A and B

</details>

### `SetVolume`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Sets the speaker's absolute volume, which is what the app's volume slider sends. On the master channel it also maintains a shadow copy of the level used for mute/unmute restore, and in certain configurations the write can be skipped entirely when a flag says an external path owns the level.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets the Master-channel volume via shared worker f_100dcb00: locks impl+0x938, reads flag impl+0x7ff (nonzero -> skip the write entirely and return), resolves current state via f_100d9b4c/f_100da1e0 with literal 'Master', then selects a u16-indexed table entry (0x10e87578 + desired*4, field +0x11c) and logs 'vol:%u src:%s'.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - the impl does not branch on it (dead compare) / unconstrained at impl level | none |
| `Channel` | channel token | yes | ignored / max 1023 chars | none |
| `DesiredVolume` | volume step | yes | u16; values < 2 take an alternate log path (0x100dcc20) while >= 2 index the gain table | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). The worker f_100dcb00 executes 'cmpwi instID,0' at entry (0x100dcb08) but the cr7 result is overwritten by the +0x7ff flag test at 0x100dcb54 with no intervening branch - the check is dead code and InstanceID is IGNORED at the impl level (request-layer parse still applies).
  - buffer cap: `0x18`
- **`Channel`**: Audio channel selector string; compared verbatim (strcmp, case-sensitive) by the implementation.
  - special values: `any` = the impl zeroes the channel-record pointer (neg r5,r0 at 0x100dcb0c) and uses the literal 'Master' for the write path - Channel has no effect in the base impl
  - validation: Parsed by the request layer but deliberately discarded by the impl - SetVolume always targets Master.
  - buffer cap: `0x400`
- **`DesiredVolume`**: Requested volume as a u16; used directly as an index into the per-step LUT at 0x10e87694 (u32 entries, stride 4).
  - validation: No range check in the impl - the raw u16 indexes the LUT; out-of-table semantics bounded only by table size (parser may restrict lexical input).
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Only request-layer parse validation; InstanceID and Channel are ignored by the impl; DesiredVolume is not range-checked in the impl.

#### Requirements / preconditions

Flag impl+0x7ff must be clear for the write to execute (when set, call is a silent no-op).

#### State dependencies

flag impl+0x7ff != 0 suppresses the write entirely (fixed-output/locked mode)

#### Side effects

- Shared worker f_100dcb00 under mutex +0x938: flag impl+0x7ff nonzero -> silent no-op; else resolves current state via f_100d9b4c/f_100da1e0 with literal 'Master', then uses the requested value to index a u16 table at 0x10e87578 (+0x11c field) before logging 'vol:%u src:%s'. Values <2 take an alternate path.

#### State transitions

Master volume changed to the table-resolved value when the write path runs

#### Events

none statically visible in this worker (downstream apply may event - unresolved)

#### Return behavior

Success is signaled by the implementation leaving cr0.eq=1 at return (the callee performs a cr0-writing op such as 'mr. r30,r3' on its status); the wrapper then emits outputs via req vfunc +0x24 and commits via +0x14. Any other path calls req vfunc +0x14 with r4 = implementation return code, producing a SOAP fault whose numeric code equals the impl return value. When impl+0x7ff is set the function returns early WITHOUT applying the volume (silent no-op); the exact code returned on that path is the unlock helper's result.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed


#### Notes

Shared worker for three SOAP actions via arg-remapping thunks; the 'desired<2' split (0x100dcbd0) and the exact LUT semantics are unresolved (likely a u16 gain step table).


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073c0e4`
- dispatch entry `0x10f11eb4`
- impl call `0x1073c1b4` obj `r5-in` slot `28` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073c218` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x1073c18c` slot `8` (parse)

- fn 0x1073c0e4 @ 0x1073c0e4; action wrapper handler
- @ 0x10f11eb4; action dispatch table entry
- fn 0x100dcb00; shared worker for SetVolume(+0x1c)/SetRelativeVolume(mode1)/GetVolumeDB(mode0); instID dead-compare; channel ptr zeroed; 'Master' hardcoded
- fn 0x100dcc44; SetRelativeVolume thunk: remaps args to f_100dcb00(impl,1,instID,0,chanrec,adjustment)
- fn 0x100dcc64; GetVolumeDB thunk: remaps to f_100dcb00(impl,0,instID,1,chanrec,valueptr)

</details>

### `SetVolumeDB`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `direct`

Supposed to set the volume in decibel units, but in this build it is a documented anomaly: the registered routine ignores the arguments and toggles the speaker's mute state, running the same routine as a press of the physical mute button. Calling it flips mute on or off instead of setting a decibel level. It is another case where the spec advertises one thing and the binary wires another.

<details markdown="1"><summary><b>Technical details</b></summary>

ANOMALY: the impl slot (+0x28) points at f_100dcc84 - a function that ignores all arguments, XOR-toggles the Master mute byte (impl+0x7f1 ^= 1), syncs the volume mirror (+0x7da->+0x3c8 when flag +0x7ff is clear), applies state via f_100d7f34, sets dirty +0x7f5 and logs 'ButtonSetMute on:%d src:%s'. In the derived class B the slot is 0x1047241c (a real, unexplored function). In class A the SOAP action behaves as a Master-mute toggle regardless of arguments.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | any parsed integer - ignored by impl / unconstrained at impl level | none |
| `Channel` | channel token | yes | ignored / max 1023 chars | none |
| `DesiredVolume` | none | yes | any - unread | none |

- **`InstanceID`**: Numeric rendering-instance selector; this zone player implements exactly one rendering instance.
  - validation: Request layer faults 402 if absent/malformed (req vfunc +0x08). Not checked by f_100dcc84 - impl ignores it.
  - buffer cap: `0x18`
- **`Channel`**: Audio channel selector string; compared verbatim (strcmp, case-sensitive) by the implementation.
  - special values: `any` = impl operates on impl+0x7f1 (the Master mute byte) only
  - validation: Parsed but unused.
  - buffer cap: `0x400`
- **`DesiredVolume`**: Parsed value that is never consumed by the installed impl.
  - validation: no impl use
  - The base-vtable impl f_100dcc84 ignores all three args and toggles the mute byte instead.
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation

Request-layer parse; impl performs no argument checks (class A impl reads zero argument bytes).

#### Requirements / preconditions

impl mutex; flag impl+0x7ff=0 enables the +0x7da->+0x3c8 sync.

#### State dependencies

flag impl+0x7ff==0 enables the +0x7da->+0x3c8 mirror sync; impl class A vs B changes behavior entirely

#### Side effects

- IMPL-CLASS ANOMALY: in class A the slot is f_100dcc84, the ButtonToggleMute handler - it toggles mute byte impl+0x7f1 ignoring DesiredVolume, commits +0x7da->+0x3c8 via f_100d7f34, dirty-marks +0x7f5 and notifies f_1067c6ec. In class B, f_1047241c runs a 'Master'-literal volume ctx via f_100d6630 and conditionally delegates to the same button handler.

#### State transitions

CLASS A: Master mute byte flips on every invocation

#### Events

In class A the impl is the ButtonToggleMute path which marks +0x7f5 dirty and calls f_1067c6ec on impl+8 (notify channel); the derived-class variant adds the grouped-operation prelude before the same path

#### Return behavior

Success is signaled by the implementation leaving cr0.eq=1 at return (the callee performs a cr0-writing op such as 'mr. r30,r3' on its status); the wrapper then emits outputs via req vfunc +0x24 and commits via +0x14. Any other path calls req vfunc +0x14 with r4 = implementation return code, producing a SOAP fault whose numeric code equals the impl return value. In class A the action commits after toggling mute - i.e. SOAP SetVolumeDB appears as a mute toggle, not a volume write.

#### Errors

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time

**`402`** `confirmed`

Request parse/validation failure at the wrapper.

- req vfunc +0x08 parse failed


#### Notes

Whether this is deliberate feature-rewiring or the live object uses class B's override is unresolved; the SOAP-visible behavior in class A is a mute toggle.


</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073c38c`
- dispatch entry `0x10f11ec0`
- impl call `0x1073c45c` obj `r5-in` slot `40` arg4 `*(sp-0x430+0x18)`
- impl call `0x1073c4c0` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x1073c434` slot `8` (parse)

- fn 0x1073c38c @ 0x1073c38c; action wrapper handler
- @ 0x10f11ec0; action dispatch table entry
- fn 0x100dcc84; impl body: lbz/xori/stb on impl+0x7f1, 'ButtonSetMute' log tag at 0x10e88378, f_100d7f34 apply
- @ 0x10ed279c; derived vtable slot +0x28 = 0x1047241c (different impl - likely the real VolumeDB setter, unexplored)

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `Volume` | string (val= attribute in LastChange template) | yes | per-channel volume (Master/LF/RF elements) |
| `Mute` | string (val= attribute in LastChange template) | yes | per-channel mute state |
| `Bass` | string (val= attribute in LastChange template) | yes | bass EQ level |
| `Treble` | string (val= attribute in LastChange template) | yes | treble EQ level |
| `Loudness` | string (val= attribute in LastChange template) | yes | loudness compensation state (Master) |
| `OutputFixed` | string (val= attribute in LastChange template) | yes | fixed line-out level enabled |
| `SpeakerSize` | string (val= attribute in LastChange template) | yes | speaker size class |
| `SubGain` | string (val= attribute in LastChange template) | yes | subwoofer output gain level |
| `SubCrossover` | string (val= attribute in LastChange template) | yes | subwoofer crossover freq |
| `SubPolarity` | string (val= attribute in LastChange template) | yes | subwoofer polarity phase setting |
| `SubEnabled` | string (val= attribute in LastChange template) | yes | whether the bonded subwoofer is enabled |
| `DialogLevel` | string (val= attribute in LastChange template) | yes | dialog enhancement level |
| `SpeechEnhanceEnabled` | string (val= attribute in LastChange template) | yes | speech enhancement state |
| `SupportsMaxDialogLevel` | string (val= attribute in LastChange template) | yes | whether the device supports the maximum dialog level |
| `SurroundLevel` | string (val= attribute in LastChange template) | yes | surround channel level |
| `MusicSurroundLevel` | string (val= attribute in LastChange template) | yes | surround level applied to music sources |
| `AudioDelay` | string (val= attribute in LastChange template) | yes | lip-sync audio delay |
| `AudioDelayLeftRear` | string (val= attribute in LastChange template) | yes | left-rear delay |
| `AudioDelayRightRear` | string (val= attribute in LastChange template) | yes | right-rear delay |
| `NightMode` | string (val= attribute in LastChange template) | yes | night-mode compression state |
| `SurroundEnabled` | string (val= attribute in LastChange template) | yes | whether surround channels are enabled |
| `SurroundMode` | string (val= attribute in LastChange template) | yes | surround processing mode |
| `HeightChannelLevel` | string (val= attribute in LastChange template) | yes | height/Atmos channel output level |
| `SonarEnabled` | string (val= attribute in LastChange template) | yes | Trueplay/Sonar enabled |
| `SonarCalibrationAvailable` | string (val= attribute in LastChange template) | yes | whether Sonar/Trueplay calibration data is available for this zone |
| `RoomCalibrationBondedZoneInfo` | string (val= attribute in LastChange template) | yes | bonded-zone calibration info |
| `PresetNameList` | string | yes | list of available EQ preset names |
| `LastChange` | string | yes | evented state variable: appears in RenderingControl LastChange/GENA event notifications |
| `A_ARG_TYPE_LeftVolume` | ui2 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_RightVolume` | ui2 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `VolumeDB` | i2 | no | non-evented RenderingControl state variable: read via action out-args, not pushed |
| `EQValue` | i2 | no | non-evented RenderingControl state variable: read via action out-args, not pushed |
| `A_ARG_TYPE_EQType` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `SupportsOutputFixed` | boolean | no | non-evented RenderingControl state variable: read via action out-args, not pushed |
| `HeadphoneConnected` | boolean | no | non-evented RenderingControl state variable: read via action out-args, not pushed |
| `A_ARG_TYPE_Channel` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MuteChannel` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_InstanceID` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_VolumeAdjustment` | i4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_RampType` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_RampTimeSeconds` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ResetVolumeAfter` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ProgramURI` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ChannelMap` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `RoomCalibrationID` | string | no | non-evented RenderingControl state variable: read via action out-args, not pushed |
| `RoomCalibrationCoefficients` | string | no | non-evented RenderingControl state variable: read via action out-args, not pushed |
| `RoomCalibrationCalibrationMode` | string | no | non-evented RenderingControl state variable: read via action out-args, not pushed |
| `RoomCalibrationEnabled` | boolean | no | non-evented RenderingControl state variable: read via action out-args, not pushed |
| `RoomCalibrationAvailable` | boolean | no | non-evented RenderingControl state variable: read via action out-args, not pushed |

## Events

- **Mechanism:** UPnP GENA NOTIFY with e:propertyset -> LastChange -> Event(InstanceID=0) -> val= attributes
- **Namespace:** urn:schemas-upnp-org:metadata-1-0/RCS/
- **LastChange variable:** LastChange
<details markdown="1"><summary><b>Technical details</b></summary>

- **notify_path:** f_100e27b0: builds <Event xmlns=...RCS> LastChange doc (InstanceID, Volume/Mute Master\|LF\|RF) AND writes e:property via f_10676a44 at 0x100e2ea8; notify trigger f_100e328c/f_100e32a4
- **payload_model:** e:property doc via f_10676a44 writer family

</details>


## Dispatcher-level errors

<details markdown="1"><summary><b>Technical details</b></summary>

**`401`** `confirmed`

Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation pointer (*(svc+4)) was null, so the request is faulted before any argument parsing.

- implementation object pointer null at dispatch time



</details>

## Notes

<details markdown="1"><summary><b>Technical details</b></summary>

Impl vtables found in .rodata: base 0x10e872f0 (slots +0x08..+0x64, ends at GetRoomCalibrationStatus - no SetRoomCalibrationStatus/RampToVolume/RestoreVolumePriorToRamp entries) and derived 0x10ed279c. Neither vtable address is stored or materialized anywhere - objects are installed dynamically and derived classes may further override slots (this-adjusting thunks exist at 0x100d6600/0x100d6608/0x100d735c/0x100e32ec/0x100e34dc/0x100e4214 for secondary bases). Common field map established from impl bodies: mute bytes +0x7f1 Master / +0x7f2 LF / +0x7f3 RF / +0x7f4 'FocusMode' (SetMute only), volume u16 +0x7da mirrored to +0x3c8 on write, secondary u16 +0x7e0, flag bytes +0x7ff and +0x801 gating a volume-sync path, event-dirty flag +0x7f5, EQ word +0x898, context/state objects +0x3ac/+0x3c4/+0x9c8/+0xbc8, recursive mutex +0x938 (f_10988564/f_10988990 guard pair).

</details>

## Additional records

### `implementation_notes`

<details markdown="1"><summary><b>Technical details</b></summary>

- **source:** rc_impl.cxx literals 0x10e87728-0x10e88d8c; rcMediaRenderer + sonosAsyncFastState(+Cond) fast-state channel; ie-schd/ie-cache threads
- **eq_settings:** `SubGain`, `SubCrossover`, `SubPolarity`, `SubEnable`, `VolumeScalingFactor`, `HeightChannelLevel`, `DialogLevel`, `SpeechEnhanceEnabled`, `SupportsMaxDialogLevel`, `SurroundLevel`, `MusicSurroundLevel`, `SurroundEnable`, `SurroundMode`, `AudioDelay`, `AudioDelayLeftRear`, `AudioDelayRightRear`, `NightMode`
- **internal_verbs:** `SetMute`, `SetMuteWithoutProxy`, `SetLoudness`, `SetVolumeAndMuteWithoutProxy`, `ResetBasicEQ`, `ResetExtEQ`, `SetChannelMap`, `RestoreVolumePriorToRamp`, `SetVolumeScaling`, `SetVolume`, `SetVolumeWithoutProxy`, `SetRelativeVolume`, `SetVolumeDB`, `SetBass`, `SetTreble`, `SetOutputFixed`, `RampToVolume`, `ButtonToggleMute`, `ButtonSetMute`
- **ramp_types:** `ALARM_RAMP_TYPE`, `AUTOPLAY_RAMP_TYPE`, `SLEEP_TIMER_RAMP_TYPE`, `DIRECT_RAMP_TYPE`, `INSTANT_RAMP_TYPE`, `SLOW_RAMP_TYPE`
- **bonded_states:** `HT_BONDED_MASTER`, `HT_BONDED_SATELLITE`, `UNBONDED_DEVICE`, `BONDED_STEREOPAIR_AND_SUB`, `BONDED_TO_SUB`, `BONDED_STEREOPAIR`
- **validation:** `Muted is required`, `Cannot set volume in fixed output mode`, `volumeDelta: At least one is required: {volumeDelta,muted}`, `At least one is required: {volume,muted}`
- **volume_internals:** "Set volume V: (%d) SV: (%d) - Bal: %d MuteState: %d LRMutes: L%d - R%d FocusModeMute: %d": balance+per-channel mutes; "ramping to %d"; GainTrimdB %.2f; FocusModeMute; "setMonoMode %s"; "Set real channel map to L: %u - R: %u"; "bonded; set primary's default loudness %d"; save collision policy delay\|drop \[cSC:%u\|sC:%u\|sCC:%u\]
- **sonar:** "sonar %sACTIVE (t:%d e:%d ac:%d id:%s)"; "sonar state changing %s -> %s"; "Will apply and store Sonar calibration %s"/"Will apply HT spatial coefficients"; CalibrationMode must be spectral\|spatial; events sonarEnabledChangedTo/sonarCalibConsistentChangedTo/sonarHasCalibrationChangedTo/orientationChangedTo

</details>

Implementation sources (recovered): `zoneplayer/rc_impl.cxx`, `zoneplayer/rc_impl_stp.cxx`

<details markdown="1"><summary>Service evidence (6)</summary>

- @ 0x101953c8; service router function
- @ 0x10f11d7c; service vtable
- @ 0x1073a784; service dispatcher
- @ 0x10e872f0; base rc_impl SOAP vtable (without-proxy class); slots +0x08..+0x64 verified by instruction-level disassembly of GetMute/SetMute/GetVolume/SetVolume bodies
- @ 0x10ed279c; derived rc_impl SOAP vtable (with-proxy class); overrides SetMute/ResetBasicEQ/ResetExtEQ/SetVolume/SetRelativeVolume/GetVolumeDB/SetVolumeDB/GetLoudness/SetLoudness/SetChannelMap/GetRoomCalibrationStatus at 0x1046xxxx
- fn 0x1046e50c @ 0x1046e50c; derived-class SetMute: calls f_1046dff0 (builds op object from impl+0xbc8/+0x9c8) and f_1046c3cc, then tail-calls base f_100db3fc

</details>
