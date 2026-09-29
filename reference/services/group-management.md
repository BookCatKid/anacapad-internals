# `GroupManagement` — `/GroupManagement/Control`

**visibility** `advertised` · **status** `strong`

Coordinator-facing group-membership service. Group members use these actions to join/leave a coordinator and to report buffering state; normal clients rarely call it, but it is advertised. Everything here operates on group members identified by MemberID.

**Technical description:** Coordinator-internal group membership service: members join/leave and report buffering state through these impl vfuncs.

## Availability

- capability flags `0x2`
- enabled gate: `vret(r3-in,+0x7c)` at `0x1068bd44` (expr)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x1068bc0c`, cap flags `0x2`
- dispatcher `0x10738308` kind `table`
- action table `0x10f11a64`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `AddMember` | advertised | callable | `strong` | direct | 402, 800, 801, 803, 804, 808 |
| `RemoveMember` | advertised | callable | `strong` | direct | 402, 800 |
| `ReportTrackBufferingResult` | advertised | callable | `strong` | direct | 402 |
| `SetSourceAreaIds` | advertised | callable | `strong` | direct | 402 |

### `AddMember`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Joins the calling member (MemberID + BootSeq) to this group. Returns the coordinator's current URI, the joined group UUID, volume/reset hints and transport settings so the new member can align playback.

**Technical description:** Joins a member to the group; returns CurrentURI, GroupUUIDJoined, ResetVolumeAfter and VolumeAVTransportURI so the joining member can align playback. Handler fully decoded: MemberID via f_1056157c (string, required), BootSeq via f_105614e0 (int, required) -> req->v\[+0x08\] validate (fail -> 402) -> impl->v\[+0x8\] -> CurrentTransportSettings + out fields via req->v\[+0x24\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `MemberID` | SonosStringArg | yes | impl-side grammar applies / max 24 chars | none - required argument |
| `BootSeq` | SonosUintArg | yes | impl-side grammar applies / parser cap | none - required argument |

- **`MemberID`** — zone member UUID to add to the group
  - validation: consumed by the impl vfunc
- **`BootSeq`** — member boot-sequence freshness token
  - validation: consumed by the impl vfunc
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentURI` | SonosUriArg | impl-produced (group-join result) / impl-produced |
| `GroupUUIDJoined` | SonosStringArg | impl-produced (group-join result) / impl-produced |
| `ResetVolumeAfter` | boolean ('0'/'1') | impl-produced (group-join result) / impl-produced |
| `VolumeAVTransportURI` | SonosUriArg | impl-produced (group-join result) / impl-produced |
| `CurrentTransportSettings` | response field | impl-produced / per the response writer |

- **`CurrentURI`** — emitted via req->v\[+0x24\] tagged emitter in handler 0x10738654 after impl->v\[+0x08\] group-join op
  - special values: impl-produced
  - validation: impl-produced
- **`GroupUUIDJoined`** — emitted via req->v\[+0x24\] tagged emitter in handler 0x10738654 after impl->v\[+0x08\] group-join op
  - special values: impl-produced
  - validation: impl-produced
- **`ResetVolumeAfter`** — emitted via req->v\[+0x24\] tagged emitter in handler 0x10738654 after impl->v\[+0x08\] group-join op
  - special values: impl-produced
  - validation: impl-produced
- **`VolumeAVTransportURI`** — emitted via req->v\[+0x24\] tagged emitter in handler 0x10738654 after impl->v\[+0x08\] group-join op
  - special values: impl-produced
  - validation: impl-produced
- **`CurrentTransportSettings`** — serialized group transport settings blob returned on success
  - validation: emitted via req->v\[+0x24/+0x28\] response writer vfunc

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x10738654 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×4, raise-fault×1, required-arg fetch×2, out-arg write×5, validate×1, commit×1); member delegates: r29 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10738654 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 5, '0x10': 4, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r29 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10738654 — member vfunc calls: \['r29 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r29 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r29 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10738654 — no transition-literal/store pattern; member delegates: \['r29 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10738654 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10738654 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 5, '0x10': 4, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure; impl rc passthrough also reaches req->v\[+0x14\]

- req->v\[+0x08\] returned 0 -> addi r4,0x192 -> ->v\[+0x14\]

**`800`** `confirmed`

gm_impl AddMember impl-level failure

- incompatible member OR proto-compat retrieval failure ('Unable to retrieve invisibility/node proto compatibility', 'incompatible member')

**`801`** `confirmed`

gm_impl AddMember impl-level failure

- MemberID equals own/coordinator ID (strcmp this+0x210)

**`803`** `confirmed`

gm_impl AddMember impl-level failure

- BootSeq out-of-sync with group manager ('out-of-sync GM')

**`804`** `confirmed`

gm_impl AddMember impl-level failure

- target member is a satellite ('Adding member to satellite is not supported')

**`808`** `confirmed`

gm_impl AddMember impl-level failure

- GC or new member is an ungroupable player


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10738654`
- dispatch entry `0x10f11a64`
- impl call `0x10738698` obj `r4-in` slot `28` arg4 `MemberID`
- impl call `0x107386c0` obj `r4-in` slot `28` arg4 `BootSeq`
- impl call `0x107386e8` obj `r4-in` slot `8` arg4 `?`
- impl call `0x1073874c` obj `r5-in` slot `8` arg4 `sp-0x8e0`
- impl call `0x10738768` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x8)`
- impl call `0x107387b0` obj `xor(*(r2+0xffff8ff8))` slot `36` arg4 `CurrentTransportSettings`
- impl call `0x107387c4` obj `vret(xor(*(r2+0xffff8ff8)),+0x24)` slot `16` arg4 `sp+0x70`
- impl call `0x107387f4` obj `vret(*(sp-0x910+0x90c),+0x24)` slot `16` arg4 `sp+0xf4`
- impl call `0x10738824` obj `vret(*(sp-0x910+0x90c),+0x24)` slot `16` arg4 `sp+0x4c`
- impl call `0x10738878` obj `vret(*(sp-0x910+0x90c),+0x24)` slot `16` arg4 `*(sp-0x910+0x908)`
- req vcall `0x1073888c` slot `12` (commit)

- fn 0x10738654 @ 0x10738654 — action wrapper handler
- @ 0x10f11a64 — action dispatch table entry

</details>

### `RemoveMember`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Removes MemberID from the group.

**Technical description:** Removes MemberID from the group via impl->v\[+0xc\] on r5-in. Handler fully decoded: MemberID via f_1056157c (string, required, 25-char capacity) -> req->v\[+0x08\] validate (fail -> 402) -> impl->v\[+0xc\] -> empty commit via req->v\[+0x0c\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `MemberID` | SonosStringArg | yes | opaque to handler (impl interprets) / max 24 chars | none - required argument |

- **`MemberID`** — string, required, 25-char capacity - parsed by f_1056157c at handler 0x10738460
  - validation: required; req->v\[+0x1c\] lookup + f_1056157c conversion; validate fail -> 402
  - buffer cap: `0x19`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x10738460 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x10738460 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x10738460 — member vfunc calls: \['r30 v\[+0xc\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0xc\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x10738460 — no transition-literal/store pattern; member delegates: \['r30 v\[+0xc\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10738460 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10738460 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure; impl rc passthrough also reaches req->v\[+0x14\] | empty MemberID ('Removing member failed - invalid argument')

- req->v\[+0x08\] returned 0 -> addi r4,0x192 -> ->v\[+0x14\]
- *(MemberID)==0 -> return 0x192

**`800`** `confirmed`

MemberID not in member list ('failed (not a member before?)')

- member-list scan this+0x288 (0x19-stride, <=0x20) found no strcmp match


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10738460`
- dispatch entry `0x10f11a70`
- impl call `0x107384e0` obj `r5-in` slot `12` arg4 `sp-0x30`
- impl call `0x10738544` obj `*(sp-0x40+0x3c)` slot `12` arg4 `402`
- req vcall `0x107384c0` slot `8` (parse)

- fn 0x10738460 @ 0x10738460 — action wrapper handler
- @ 0x10f11a70 — action dispatch table entry

</details>

### `ReportTrackBufferingResult`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Member-to-coordinator feedback of a buffering ResultCode for a track fetch. NOTE: the implementation unconditionally returns 402 in this build - effectively a non-functional stub.

**Technical description:** Member feedback path: reports MemberID's buffering ResultCode to the coordinator via impl->v\[+0x10\] on r5-in. Handler fully decoded: MemberID via f_1056157c (string, required), ResultCode via f_10561514 (int, required) -> req->v\[+0x08\] validate (fail -> 402) -> impl->v\[+0x10\] -> empty commit. Impl f_105c53d0 unconditionally returns 402 — the action is a non-functional stub in this build.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `MemberID` | SonosStringArg | yes | opaque to handler (impl interprets) / max 24 chars | none - required argument |
| `ResultCode` | SonosStringArg | yes | opaque to handler (impl interprets) / length-bounded by parse-helper buffer cap | none - required argument |

- **`MemberID`** — string, required - parsed by f_1056157c at handler 0x107388a4
  - validation: required; req->v\[+0x1c\] lookup + f_1056157c conversion; validate fail -> 402
  - buffer cap: `0x19`
- **`ResultCode`** — int, required - parsed by f_10561514 at handler 0x107388a4
  - validation: required; req->v\[+0x1c\] lookup + f_10561514 conversion; validate fail -> 402
  - buffer cap: `0x18`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x107388a4 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r30 v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x107388a4 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x107388a4 — member vfunc calls: \['r30 v\[+0x10\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x10\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x107388a4 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x10\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x107388a4 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x107388a4 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure; impl rc passthrough also reaches req->v\[+0x14\] | impl stub — unconditional 402 regardless of args

- req->v\[+0x08\] returned 0 -> addi r4,0x192 -> ->v\[+0x14\]
- impl f_105c53d0 always returns 0x192


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107388a4`
- dispatch entry `0x10f11a7c`
- impl call `0x1073894c` obj `r5-in` slot `16` arg4 `sp-0x30`
- impl call `0x107389b0` obj `*(sp-0x50+0x4c)` slot `12` arg4 `402`
- req vcall `0x10738928` slot `8` (parse)

- fn 0x107388a4 @ 0x107388a4 — action wrapper handler
- @ 0x10f11a7c — action dispatch table entry

</details>

### `SetSourceAreaIds`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Sets the group's desired source-area ids (used to steer which zone's content the group plays).

**Technical description:** Sets the group's desired source-area ids via impl->v\[+0x14\] on r5-in. Handler fully decoded: DesiredSourceAreaIds via f_1056157c (string, required) -> req->v\[+0x08\] validate (fail -> 402) -> impl->v\[+0x14\] -> empty commit.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredSourceAreaIds` | SonosBoolArg | yes | opaque to handler (impl interprets) / max 1220 chars | none - required argument |

- **`DesiredSourceAreaIds`** — string, required - parsed by f_1056157c at handler 0x10738550
  - validation: required; req->v\[+0x1c\] lookup + f_1056157c conversion; validate fail -> 402
  - buffer cap: `0x4c5`

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details><summary>Evidence (1)</summary>

- @ 0x10738550 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r29 v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x10738550 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r29 v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x10738550 — member vfunc calls: \['r29 v\[+0x14\]'\]

</details>


#### Side effects

- state-mutation delegate: r29 v\[+0x14\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r29 v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x10738550 — no transition-literal/store pattern; member delegates: \['r29 v\[+0x14\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10738550 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10738550 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

request-validate failure; impl rc passthrough also reaches req->v\[+0x14\]

- req->v\[+0x08\] returned 0 -> addi r4,0x192 -> ->v\[+0x14\]


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10738550`
- dispatch entry `0x10f11a88`
- impl call `0x107385e0` obj `r5-in` slot `20` arg4 `sp-0x4dc`
- impl call `0x10738648` obj `*(sp-0x4f0+0x4ec)` slot `12` arg4 `402`
- req vcall `0x107385c0` slot `8` (parse)

- fn 0x10738550 @ 0x10738550 — action wrapper handler
- @ 0x10f11a88 — action dispatch table entry

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `A_ARG_TYPE_MemberID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TransportSettings` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AVTransportURI` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_BufferingResultCode` | i4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_BootSeq` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `GroupCoordinatorIsLocal` | boolean | yes | evented state variable — appears in GroupManagement LastChange/GENA event notifications |
| `LocalGroupUUID` | string | yes | evented state variable — appears in GroupManagement LastChange/GENA event notifications |
| `VirtualLineInGroupID` | string | yes | evented state variable — appears in GroupManagement LastChange/GENA event notifications |
| `SourceAreaIds` | string | no | non-evented GroupManagement state variable — read via action out-args, not pushed |
| `ResetVolumeAfter` | boolean | yes | evented state variable — appears in GroupManagement LastChange/GENA event notifications |
| `VolumeAVTransportURI` | string | yes | evented state variable — appears in GroupManagement LastChange/GENA event notifications |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /GroupManagement/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `groupManagement`, `groupCoordinatorChanged`
- **notify_path:** group-coordination event pool: 'DelegatedGroupCoordinatorID','LocalGroupUUID','VirtualLineInGroupID','ZoneNameChangedEvent' names recovered; delivered via internal bus + GENA/WSS
- **wss_registry:**
  - idx: 34, name: groupManagement, id: 136, tag: 70
  - idx: 33, name: groupCoordinatorChanged, id: 134, tag: 12

## Dispatcher-level errors

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search


## Notes

Dispatcher 0x10738308 decodes fully: binary-search over action table 0x10f11a64; *(svc+4) impl NULL -> 401; handler args {svc-adj, req, impl=*(svc+4)}; impl vfuncs +0x08 AddMember / +0x0c RemoveMember / +0x10 ReportTrackBufferingResult / +0x14 SetSourceAreaIds; svc object embedded at ctx+0x3fa44 (ctor f_107389bc); px bound at runtime (group-init path), impl class unproven.

## Additional records

### `implementation_notes`

- **source:** gm_impl.cxx + grc_zpimpl.cxx literals 0x10ec300c-0x10ec45cc; scopeGm/scopeGrc; gm_events log fmt "(%2d) add\|rem %s / grp %s %s"
- **addmember_validation:** `ungroupable player rejected (gcUUID+memberID logged)`, `invalid argument`, `satellite cannot accept members`, `incompatible member`, `invisibility/node-proto compat check`, `bootseq out-of-sync GM`, `duplicate member`
- **config:** configure group %d: {fd,bgc,dgc,c,oc} tuple; ChangeCoordinator + DelegateGC ("delaying delegation by %d ms","delegating with member list %s new gc %s"); topology monitor starts on GC change
- **vli_session:** vli session end evt -> VliSessionProcessingCompleteEvent (async task)

Implementation sources (recovered): `zoneplayer/gm_impl.cxx`

<details><summary>Service evidence (3)</summary>

- @ 0x1068bc0c — service router function
- @ 0x10f11a58 — service vtable
- @ 0x10738308 — service dispatcher

</details>
