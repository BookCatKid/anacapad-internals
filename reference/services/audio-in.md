# `AudioIn` — `/AudioIn/Control`

**visibility** `hidden` · **status** `confirmed`

The legacy hardware line-in service. Its specification document still ships and its address is still registered, but the service is not listed in the device description and every action routes to a dead handler that always answers 'not implemented' (error 401). The feature was removed on this model - treat all six actions as dead surface, documented so clients can recognize the fault. The action entries below describe what the API used to do.

**Technical description:** AudioIn service on the zone player — registered, but its service object is a 4-byte stub whose dispatcher rejects EVERY action with 401. The object chain is fully traced: new(4) at f_101981f0:0x1019c218, ctor f_1073d930 installs vptr 0x10f11f70, stored into *(r3-in+0xaa6c) (r30-0x5594 where r30=r3-in+0x10000, computed at 0x10198224). No actions exist in this build.

## Availability

- capability flags `0x100`
- enabled gate: `*(r3-in+0x5704)` at `0x101955d8` (field)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x100`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `StartTransmissionToGroup` | advertised | callable | `confirmed` | strcmp_stub | 401 |
| `StopTransmissionToGroup` | advertised | callable | `confirmed` | strcmp_stub | 401 |
| `SetAudioInputAttributes` | advertised | callable | `confirmed` | strcmp_stub | 401 |
| `GetAudioInputAttributes` | advertised | callable | `confirmed` | strcmp_stub | 401 |
| `SetLineInLevel` | advertised | callable | `confirmed` | strcmp_stub | 401 |
| `GetLineInLevel` | advertised | callable | `confirmed` | strcmp_stub | 401 |

### `StartTransmissionToGroup`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `strcmp_stub` · **removed/stub — faults 401**

Historically started streaming this player's analog line-in to the group identified by CoordinatorID, returning the resulting transport settings. In this build it always faults 401.

**Technical description:** Advertised AudioIn action — dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | string argument (A_ARG_TYPE_ObjectID) | yes | n/a — 401 fault precedes arg consumption | none |
| `CoordinatorID` | string argument (A_ARG_TYPE_MemberID) | yes | n/a — 401 fault precedes arg consumption | none |

- **`ObjectID`** — SCPD-advertised in argument (ObjectID) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - A_ARG_TYPE_ObjectID (string) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build
- **`CoordinatorID`** — SCPD-advertised in argument (CoordinatorID) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - A_ARG_TYPE_MemberID (string) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentTransportSettings` | string argument (A_ARG_TYPE_TransportSettings) | n/a — 401 fault precedes arg consumption |

- **`CurrentTransportSettings`** — SCPD-advertised out argument (CurrentTransportSettings) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - A_ARG_TYPE_TransportSettings (string) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

#### Validation `confirmed`

n/a — fault precedes any arg validation
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Requirements / preconditions `confirmed`

none — the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### State dependencies `confirmed`

none — the stub touches no service state; it only emits a fault
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Side effects

- none besides the SOAP fault emit — no state mutation, no member delegate

#### State transitions `confirmed`

none — no state machine touched
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Events `confirmed`

none — the stub emits no events
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Return behavior `confirmed`

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Errors

**`401`** `confirmed`

action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name — the dispatcher has no name table and unconditionally faults 401


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine resolution `resolved` → `0x1073d8f8`
- Reject-all — loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub — SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70 — AudioIn vtable slot +0x08 -> reject-all dispatcher

</details>

### `StopTransmissionToGroup`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `strcmp_stub` · **removed/stub — faults 401**

Historically stopped line-in transmission to the group. In this build it always faults 401.

**Technical description:** Advertised AudioIn action — dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `CoordinatorID` | string argument (A_ARG_TYPE_MemberID) | yes | n/a — 401 fault precedes arg consumption | none |

- **`CoordinatorID`** — SCPD-advertised in argument (CoordinatorID) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - A_ARG_TYPE_MemberID (string) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

#### Validation `confirmed`

n/a — fault precedes any arg validation
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Requirements / preconditions `confirmed`

none — the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### State dependencies `confirmed`

none — the stub touches no service state; it only emits a fault
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Side effects

- none besides the SOAP fault emit — no state mutation, no member delegate

#### State transitions `confirmed`

none — no state machine touched
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Events `confirmed`

none — the stub emits no events
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Return behavior `confirmed`

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Errors

**`401`** `confirmed`

action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name — the dispatcher has no name table and unconditionally faults 401


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine resolution `resolved` → `0x1073d8f8`
- Reject-all — loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub — SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70 — AudioIn vtable slot +0x08 -> reject-all dispatcher

</details>

### `SetAudioInputAttributes`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `strcmp_stub` · **removed/stub — faults 401**

Historically renamed the line-in source and set its icon. In this build it always faults 401.

**Technical description:** Advertised AudioIn action — dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredName` | string argument (AudioInputName) | yes | n/a — 401 fault precedes arg consumption | none |
| `DesiredIcon` | string argument (Icon) | yes | n/a — 401 fault precedes arg consumption | none |

- **`DesiredName`** — SCPD-advertised in argument (DesiredName) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - AudioInputName (string) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build
- **`DesiredIcon`** — SCPD-advertised in argument (DesiredIcon) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - Icon (string) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

#### Validation `confirmed`

n/a — fault precedes any arg validation
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Requirements / preconditions `confirmed`

none — the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### State dependencies `confirmed`

none — the stub touches no service state; it only emits a fault
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Side effects

- none besides the SOAP fault emit — no state mutation, no member delegate

#### State transitions `confirmed`

none — no state machine touched
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Events `confirmed`

none — the stub emits no events
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Return behavior `confirmed`

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Errors

**`401`** `confirmed`

action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name — the dispatcher has no name table and unconditionally faults 401


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine resolution `resolved` → `0x1073d8f8`
- Reject-all — loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub — SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70 — AudioIn vtable slot +0x08 -> reject-all dispatcher

</details>

### `GetAudioInputAttributes`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `strcmp_stub` · **removed/stub — faults 401**

Historically returned the line-in source name and icon. In this build it always faults 401.

**Technical description:** Advertised AudioIn action — dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentName` | string argument (AudioInputName) | n/a — 401 fault precedes arg consumption |
| `CurrentIcon` | string argument (Icon) | n/a — 401 fault precedes arg consumption |

- **`CurrentName`** — SCPD-advertised out argument (CurrentName) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - AudioInputName (string) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build
- **`CurrentIcon`** — SCPD-advertised out argument (CurrentIcon) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - Icon (string) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

#### Validation `confirmed`

n/a — fault precedes any arg validation
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Requirements / preconditions `confirmed`

none — the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### State dependencies `confirmed`

none — the stub touches no service state; it only emits a fault
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Side effects

- none besides the SOAP fault emit — no state mutation, no member delegate

#### State transitions `confirmed`

none — no state machine touched
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Events `confirmed`

none — the stub emits no events
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Return behavior `confirmed`

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Errors

**`401`** `confirmed`

action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name — the dispatcher has no name table and unconditionally faults 401


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine resolution `resolved` → `0x1073d8f8`
- Reject-all — loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub — SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70 — AudioIn vtable slot +0x08 -> reject-all dispatcher

</details>

### `SetLineInLevel`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `strcmp_stub` · **removed/stub — faults 401**

Historically set left/right line-in gain levels. In this build it always faults 401.

**Technical description:** Advertised AudioIn action — dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredLeftLineInLevel` | i4 argument (LeftLineInLevel) | yes | n/a — 401 fault precedes arg consumption | none |
| `DesiredRightLineInLevel` | i4 argument (RightLineInLevel) | yes | n/a — 401 fault precedes arg consumption | none |

- **`DesiredLeftLineInLevel`** — SCPD-advertised in argument (DesiredLeftLineInLevel) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - LeftLineInLevel (i4) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build
- **`DesiredRightLineInLevel`** — SCPD-advertised in argument (DesiredRightLineInLevel) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - RightLineInLevel (i4) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

#### Validation `confirmed`

n/a — fault precedes any arg validation
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Requirements / preconditions `confirmed`

none — the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### State dependencies `confirmed`

none — the stub touches no service state; it only emits a fault
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Side effects

- none besides the SOAP fault emit — no state mutation, no member delegate

#### State transitions `confirmed`

none — no state machine touched
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Events `confirmed`

none — the stub emits no events
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Return behavior `confirmed`

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Errors

**`401`** `confirmed`

action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name — the dispatcher has no name table and unconditionally faults 401


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine resolution `resolved` → `0x1073d8f8`
- Reject-all — loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub — SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70 — AudioIn vtable slot +0x08 -> reject-all dispatcher

</details>

### `GetLineInLevel`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `strcmp_stub` · **removed/stub — faults 401**

Historically returned the left/right line-in gain levels. In this build it always faults 401.

**Technical description:** Advertised AudioIn action — dispatched to the reject-all dispatcher f_1073d8f8 which unconditionally emits 401 for every action name (AudioIn/line-in feature not implemented in this build; vtable 0x10f11f70\[+0x08\])

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentLeftLineInLevel` | i4 argument (LeftLineInLevel) | n/a — 401 fault precedes arg consumption |
| `CurrentRightLineInLevel` | i4 argument (RightLineInLevel) | n/a — 401 fault precedes arg consumption |

- **`CurrentLeftLineInLevel`** — SCPD-advertised out argument (CurrentLeftLineInLevel) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - LeftLineInLevel (i4) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build
- **`CurrentRightLineInLevel`** — SCPD-advertised out argument (CurrentRightLineInLevel) — dispatched to the AudioIn reject-all stub (401); value never consumed
  - validation: never fetched — the reject-all dispatcher emits 401 before reading request args
  - RightLineInLevel (i4) — advertised in AudioIn1.xml but never consumed; AudioIn is not implemented in this build

#### Validation `confirmed`

n/a — fault precedes any arg validation
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Requirements / preconditions `confirmed`

none — the dispatcher faults 401 before reading any in-arg; advertised args are never consumed
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### State dependencies `confirmed`

none — the stub touches no service state; it only emits a fault
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Side effects

- none besides the SOAP fault emit — no state mutation, no member delegate

#### State transitions `confirmed`

none — no state machine touched
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Events `confirmed`

none — the stub emits no events
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Return behavior `confirmed`

always req->v\[+0x14\] raise-fault with literal 0x191 (401); never commits success
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)

</details>


#### Errors

**`401`** `confirmed`

action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments

- any AudioIn action name — the dispatcher has no name table and unconditionally faults 401


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073d8f8`
- dispatch entry `0x10f11f70` (voff `8`)
- impl `0x1073d8f8` (vfunc `+0x08`)
- engine resolution `resolved` → `0x1073d8f8`
- Reject-all — loads *(req)+0x14 fault emitter, emits literal 0x191 (401), returns 401 for any action name; no name table, no arg parsing
- the entire AudioIn service is a stub — SCPD advertises the action but the binary dispatches every name to 401

- @ 0x1073d8f8 — reject-all dispatcher: req->v\[+0x14\](req,0x191)
- @ 0x10f11f70 — AudioIn vtable slot +0x08 -> reject-all dispatcher

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `A_ARG_TYPE_MemberID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TransportSettings` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `AudioInputName` | string | yes | evented state variable — appears in AudioIn LastChange/GENA event notifications |
| `Icon` | string | yes | evented state variable — appears in AudioIn LastChange/GENA event notifications |
| `LineInConnected` | boolean | yes | evented state variable — appears in AudioIn LastChange/GENA event notifications |
| `LeftLineInLevel` | i4 | yes | evented state variable — appears in AudioIn LastChange/GENA event notifications |
| `RightLineInLevel` | i4 | yes | evented state variable — appears in AudioIn LastChange/GENA event notifications |
| `A_ARG_TYPE_ObjectID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `Playing` | boolean | yes | evented state variable — appears in AudioIn LastChange/GENA event notifications |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /AudioIn/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `audioInput`, `lineInStatus`
- **notify_path:** f_10243170 e:property dump {TOSLinkConnected, IRRepeaterState} -> f_10676a44
- **payload_model:** e:property doc via f_10676a44 writer family
- **wss_registry:**
  - idx: 9, name: audioInput, id: 40, tag: 65
  - idx: 19, name: lineInStatus, id: 62, tag: 15

## Dispatcher-level errors

**`401`** `confirmed`

reject-all dispatcher — every action name faults 401 including the documented AudioIn action set

- any action invocation on /AudioIn/Control; dispatcher emits 0x191 via req->v\[+0x14\] unconditionally


## Additional records

### `advertised_actions_not_implemented`

- **description:** AudioIn1.xml SCPD advertises 6 actions {StartTransmissionToGroup,StopTransmissionToGroup,SetAudioInputAttributes,GetAudioInputAttributes,SetLineInLevel,GetLineInLevel} but the service is NOT in device_description's serviceList and its dispatcher 0x1073d8f8 rejects every action with 401 — a registered stub (control surface present, impl removed/gated).
- **status:** confirmed
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, notes: AudioIn1.xml SCPD + reject-all dispatcher 0x1073d8f8

### `crossbuild`

AudioIn actions dispatched to REAL handlers in 34.16 & 57.10 (name-literals referenced); in 86.8 & 86.10 the same names are str-only (present, no dispatch ref) -> the AudioIn implementation was REPLACED by the reject-all 401 stub (FUN_1073d8f8 -> req->v\[+0x14\](req,0x191)) in 86.x. Line-in audio in was deprecated for model-9; SCPD still shipped + service omitted from active serviceList.

Implementation sources (recovered): `zoneplayer/ai_impl_base.cxx`, `zoneplayer/spotify/ai_spotify.cxx`, `zoneplayer/extaudiosrc.cxx`

<details markdown="1"><summary>Service evidence (3)</summary>

- @ 0x101953c8 — service router function
- @ 0x1019c22c — svc store into *(r3-in+0xaa6c)
- @ 0x1073d930 — ctor installs reject-all vtable

</details>
