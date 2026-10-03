# `AudioIn` `/AudioIn/Control`

**visibility** `hidden`

On paper this service is the control point for line-in audio, the physical input jack that lets you plug a turntable or another source into a Sonos player. The product specification still advertises commands for configuring that input and for broadcasting line-in audio to other rooms. But in this particular firmware build none of it actually works: every single command in this service is routed to a 'reject everything' routine that refuses each request with an error before doing anything. Think of it as a door that was left in the spec sheet after the feature behind it was removed. The menu entries are all there, and all of them are dead.

::: details Technical details

AudioIn service on the zone player: registered, but its service object is a 4-byte stub whose dispatcher rejects EVERY action with 401. The object chain is fully traced: new(4) at f_101981f0:0x1019c218, ctor f_1073d930 installs vptr 0x10f11f70, stored into *(r3-in+0xaa6c) (r30-0x5594 where r30=r3-in+0x10000, computed at 0x10198224). No actions exist in this build.

:::

## Availability

- capability flags `0x100`
- enabled gate: `*(r3-in+0x5704)` at `0x101955d8` (field)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x100`

## Actions

| Action | Visibility | Reachability | Dispatch | Error codes |
|---|---|---|---|---|
| `StartTransmissionToGroup` | advertised | callable | strcmp_stub | 401 |
| `StopTransmissionToGroup` | advertised | callable | strcmp_stub | 401 |
| `SetAudioInputAttributes` | advertised | callable | strcmp_stub | 401 |
| `GetAudioInputAttributes` | advertised | callable | strcmp_stub | 401 |
| `SetLineInLevel` | advertised | callable | strcmp_stub | 401 |
| `GetLineInLevel` | advertised | callable | strcmp_stub | 401 |

### `StartTransmissionToGroup`

visibility `advertised` · reachability `callable` · dispatch `strcmp_stub` · **removed/stub, faults 401**

Supposed to begin broadcasting whatever is plugged into the line-in jack to a group of speakers, which is the command that turns one player's turntable into house-wide audio. In this firmware build the command is wired to a reject-everything routine instead of a real implementation: any caller receives an immediate error and nothing happens, because the whole AudioIn feature was left out of this build. The command name still appears in the advertised spec, which is why apps can see it listed.

::: details Technical details

Advertised AudioIn action: dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | string argument (A_ARG_TYPE_ObjectID) | yes | n/a: 401 fault precedes arg consumption | none |
| `CoordinatorID` | string argument (A_ARG_TYPE_MemberID) | yes | n/a: 401 fault precedes arg consumption | none |

- **`ObjectID`**: SCPD-advertised in argument (ObjectID): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - A_ARG_TYPE_ObjectID (string): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build
- **`CoordinatorID`**: SCPD-advertised in argument (CoordinatorID): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - A_ARG_TYPE_MemberID (string): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentTransportSettings` | string argument (A_ARG_TYPE_TransportSettings) | n/a: 401 fault precedes arg consumption |

- **`CurrentTransportSettings`**: SCPD-advertised out argument (CurrentTransportSettings): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - A_ARG_TYPE_TransportSettings (string): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

::: details Technical analysis

#### Validation

n/a: fault precedes any arg validation
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Requirements / preconditions

none: the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### State dependencies

none: the stub touches no service state; it only emits a fault
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Side effects

- none besides the SOAP fault emit: no state mutation, no member delegate

#### State transitions

none: no state machine touched
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Events

none: the stub emits no events
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Return behavior

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Errors

**`401`**

action_not_authorized: AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name: the dispatcher has no name table and unconditionally faults 401



:::

::: details Implementation & reverse-engineering evidence

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine impl resolved to `0x1073d8f8`
- Reject-all: loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub: SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70; AudioIn vtable slot +0x08 -> reject-all dispatcher

:::

### `StopTransmissionToGroup`

visibility `advertised` · reachability `callable` · dispatch `strcmp_stub` · **removed/stub, faults 401**

Supposed to stop a line-in broadcast that StartTransmissionToGroup had started. In this firmware build the command is wired to a reject-everything routine instead of a real implementation: any caller receives an immediate error and nothing happens, because the whole AudioIn feature was left out of this build. The command name still appears in the advertised spec, which is why apps can see it listed.

::: details Technical details

Advertised AudioIn action: dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `CoordinatorID` | string argument (A_ARG_TYPE_MemberID) | yes | n/a: 401 fault precedes arg consumption | none |

- **`CoordinatorID`**: SCPD-advertised in argument (CoordinatorID): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - A_ARG_TYPE_MemberID (string): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

::: details Technical analysis

#### Validation

n/a: fault precedes any arg validation
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Requirements / preconditions

none: the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### State dependencies

none: the stub touches no service state; it only emits a fault
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Side effects

- none besides the SOAP fault emit: no state mutation, no member delegate

#### State transitions

none: no state machine touched
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Events

none: the stub emits no events
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Return behavior

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Errors

**`401`**

action_not_authorized: AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name: the dispatcher has no name table and unconditionally faults 401



:::

::: details Implementation & reverse-engineering evidence

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine impl resolved to `0x1073d8f8`
- Reject-all: loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub: SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70; AudioIn vtable slot +0x08 -> reject-all dispatcher

:::

### `SetAudioInputAttributes`

visibility `advertised` · reachability `callable` · dispatch `strcmp_stub` · **removed/stub, faults 401**

Supposed to configure the line-in jack, for example giving the source a friendly name so 'Turntable' shows up as an input choice in the app. In this firmware build the command is wired to a reject-everything routine instead of a real implementation: any caller receives an immediate error and nothing happens, because the whole AudioIn feature was left out of this build. The command name still appears in the advertised spec, which is why apps can see it listed.

::: details Technical details

Advertised AudioIn action: dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredName` | string argument (AudioInputName) | yes | n/a: 401 fault precedes arg consumption | none |
| `DesiredIcon` | string argument (Icon) | yes | n/a: 401 fault precedes arg consumption | none |

- **`DesiredName`**: SCPD-advertised in argument (DesiredName): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - AudioInputName (string): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build
- **`DesiredIcon`**: SCPD-advertised in argument (DesiredIcon): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - Icon (string): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

::: details Technical analysis

#### Validation

n/a: fault precedes any arg validation
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Requirements / preconditions

none: the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### State dependencies

none: the stub touches no service state; it only emits a fault
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Side effects

- none besides the SOAP fault emit: no state mutation, no member delegate

#### State transitions

none: no state machine touched
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Events

none: the stub emits no events
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Return behavior

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Errors

**`401`**

action_not_authorized: AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name: the dispatcher has no name table and unconditionally faults 401



:::

::: details Implementation & reverse-engineering evidence

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine impl resolved to `0x1073d8f8`
- Reject-all: loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub: SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70; AudioIn vtable slot +0x08 -> reject-all dispatcher

:::

### `GetAudioInputAttributes`

visibility `advertised` · reachability `callable` · dispatch `strcmp_stub` · **removed/stub, faults 401**

Supposed to report how the player's line-in jack is configured, including things like the name it shows in the app and the audio format it accepts. In this firmware build the command is wired to a reject-everything routine instead of a real implementation: any caller receives an immediate error and nothing happens, because the whole AudioIn feature was left out of this build. The command name still appears in the advertised spec, which is why apps can see it listed.

::: details Technical details

Advertised AudioIn action: dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentName` | string argument (AudioInputName) | n/a: 401 fault precedes arg consumption |
| `CurrentIcon` | string argument (Icon) | n/a: 401 fault precedes arg consumption |

- **`CurrentName`**: SCPD-advertised out argument (CurrentName): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - AudioInputName (string): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build
- **`CurrentIcon`**: SCPD-advertised out argument (CurrentIcon): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - Icon (string): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

::: details Technical analysis

#### Validation

n/a: fault precedes any arg validation
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Requirements / preconditions

none: the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### State dependencies

none: the stub touches no service state; it only emits a fault
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Side effects

- none besides the SOAP fault emit: no state mutation, no member delegate

#### State transitions

none: no state machine touched
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Events

none: the stub emits no events
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Return behavior

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Errors

**`401`**

action_not_authorized: AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name: the dispatcher has no name table and unconditionally faults 401



:::

::: details Implementation & reverse-engineering evidence

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine impl resolved to `0x1073d8f8`
- Reject-all: loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub: SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70; AudioIn vtable slot +0x08 -> reject-all dispatcher

:::

### `SetLineInLevel`

visibility `advertised` · reachability `callable` · dispatch `strcmp_stub` · **removed/stub, faults 401**

Supposed to set the line-in gain, meaning how much the player amplifies the signal coming in on the jack before it plays or is sent to other rooms. In this firmware build the command is wired to a reject-everything routine instead of a real implementation: any caller receives an immediate error and nothing happens, because the whole AudioIn feature was left out of this build. The command name still appears in the advertised spec, which is why apps can see it listed.

::: details Technical details

Advertised AudioIn action: dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredLeftLineInLevel` | i4 argument (LeftLineInLevel) | yes | n/a: 401 fault precedes arg consumption | none |
| `DesiredRightLineInLevel` | i4 argument (RightLineInLevel) | yes | n/a: 401 fault precedes arg consumption | none |

- **`DesiredLeftLineInLevel`**: SCPD-advertised in argument (DesiredLeftLineInLevel): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - LeftLineInLevel (i4): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build
- **`DesiredRightLineInLevel`**: SCPD-advertised in argument (DesiredRightLineInLevel): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - RightLineInLevel (i4): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

::: details Technical analysis

#### Validation

n/a: fault precedes any arg validation
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Requirements / preconditions

none: the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### State dependencies

none: the stub touches no service state; it only emits a fault
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Side effects

- none besides the SOAP fault emit: no state mutation, no member delegate

#### State transitions

none: no state machine touched
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Events

none: the stub emits no events
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Return behavior

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Errors

**`401`**

action_not_authorized: AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name: the dispatcher has no name table and unconditionally faults 401



:::

::: details Implementation & reverse-engineering evidence

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine impl resolved to `0x1073d8f8`
- Reject-all: loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub: SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70; AudioIn vtable slot +0x08 -> reject-all dispatcher

:::

### `GetLineInLevel`

visibility `advertised` · reachability `callable` · dispatch `strcmp_stub` · **removed/stub, faults 401**

Supposed to report the current line-in signal level or the gain configured for it, the software equivalent of looking at the input meter. In this firmware build the command is wired to a reject-everything routine instead of a real implementation: any caller receives an immediate error and nothing happens, because the whole AudioIn feature was left out of this build. The command name still appears in the advertised spec, which is why apps can see it listed.

::: details Technical details

Advertised AudioIn action: dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentLeftLineInLevel` | i4 argument (LeftLineInLevel) | n/a: 401 fault precedes arg consumption |
| `CurrentRightLineInLevel` | i4 argument (RightLineInLevel) | n/a: 401 fault precedes arg consumption |

- **`CurrentLeftLineInLevel`**: SCPD-advertised out argument (CurrentLeftLineInLevel): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - LeftLineInLevel (i4): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build
- **`CurrentRightLineInLevel`**: SCPD-advertised out argument (CurrentRightLineInLevel): dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched: the reject-all dispatcher emits 401 before reading request args
  - RightLineInLevel (i4): advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

::: details Technical analysis

#### Validation

n/a: fault precedes any arg validation
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Requirements / preconditions

none: the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### State dependencies

none: the stub touches no service state; it only emits a fault
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Side effects

- none besides the SOAP fault emit: no state mutation, no member delegate

#### State transitions

none: no state machine touched
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Events

none: the stub emits no events
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Return behavior

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
::: details Evidence (1)

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)

:::


#### Errors

**`401`**

action_not_authorized: AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name: the dispatcher has no name table and unconditionally faults 401



:::

::: details Implementation & reverse-engineering evidence

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine impl resolved to `0x1073d8f8`
- Reject-all: loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub: SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8; reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70; AudioIn vtable slot +0x08 -> reject-all dispatcher

:::

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `A_ARG_TYPE_MemberID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TransportSettings` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `AudioInputName` | string | yes | evented state variable: appears in AudioIn LastChange/GENA event notifications |
| `Icon` | string | yes | evented state variable: appears in AudioIn LastChange/GENA event notifications |
| `LineInConnected` | boolean | yes | evented state variable: appears in AudioIn LastChange/GENA event notifications |
| `LeftLineInLevel` | i4 | yes | evented state variable: appears in AudioIn LastChange/GENA event notifications |
| `RightLineInLevel` | i4 | yes | evented state variable: appears in AudioIn LastChange/GENA event notifications |
| `A_ARG_TYPE_ObjectID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `Playing` | boolean | yes | evented state variable: appears in AudioIn LastChange/GENA event notifications |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /AudioIn/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `audioInput`, `lineInStatus`
::: details Technical details

- **notify_path:** f_10243170 e:property dump {TOSLinkConnected, IRRepeaterState} -> f_10676a44
- **payload_model:** e:property doc via f_10676a44 writer family
- **wss_registry:**
  - idx: 9, name: audioInput, id: 40, tag: 65
  - idx: 19, name: lineInStatus, id: 62, tag: 15
- **todo:** `Established: the GENA SUBSCRIBE acceptance path is documented; no LastChange template exists for this service (the registry only carries AVT/RCS/Queue); WSS event names attributed: `audioInput`, `lineInStatus`.`, `Still unknown: the notify emission path inside the binary is not recovered; the WSS attribution is name-based, not call-site-proven.`, `Next step: trace the service's notify emit call (GENA sender or WSS registry consumer) to recover the emission path.`

:::


## Dispatcher-level errors

::: details Technical details

**`401`**

reject-all dispatcher: every action name faults 401 including the documented AudioIn action set

- any action invocation on /AudioIn/Control; dispatcher emits 0x191 via req->v\[+0x14\] unconditionally



:::

## Additional records

### `advertised_actions_not_implemented`

::: details Technical details

- **description:** AudioIn1.xml SCPD advertises 6 actions {StartTransmissionToGroup,StopTransmissionToGroup,SetAudioInputAttributes,GetAudioInputAttributes,SetLineInLevel,GetLineInLevel} but the service is NOT in device_description's serviceList and its dispatcher 0x1073d8f8 rejects every action with 401: a registered stub (control surface present, impl removed/gated).
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, notes: AudioIn1.xml SCPD + reject-all dispatcher 0x1073d8f8

:::

### `crossbuild`

::: details Technical details

AudioIn actions dispatched to REAL handlers in 34.16 & 57.10 (name-literals referenced); in 86.8 & 86.10 the same names are str-only (present, no dispatch ref) -> the AudioIn implementation was REPLACED by the reject-all 401 stub (FUN_1073d8f8 -> req->v\[+0x14\](req,0x191)) in 86.x. Line-in audio in was deprecated for model-9; SCPD still shipped + service omitted from active serviceList.

:::

Implementation sources (recovered): `zoneplayer/ai_impl_base.cxx`, `zoneplayer/spotify/ai_spotify.cxx`, `zoneplayer/extaudiosrc.cxx`

::: details Service evidence (3)

- @ 0x101953c8; service router function
- @ 0x1019c22c; svc store into *(r3-in+0xaa6c)
- @ 0x1073d930; ctor installs reject-all vtable

:::
