# `GroupRenderingControl` — `/MediaRenderer/GroupRenderingControl/Control`

**visibility** `advertised` · **status** `strong`

This service controls volume and mute for a whole group at once. When several rooms are grouped and you drag the group volume slider, the app doesn't go and adjust each speaker itself — it sends one command here to the group's leader, and the leader does the fan-out: it sets its own speaker directly and relays the change to every member. It can also snapshot everyone's individual volumes — the mechanism behind 'group mute' that can later restore each room to its own previous level instead of unmuting to a flat value.

<details markdown="1"><summary><b>Technical details</b></summary>

Group-scoped rendering control service. Each action delegates to a shared group-impl object (arg5 to the wrappers, service member +0x0) via a sequential vfunc block v\[+0x08..+0x1c\]. Impl-side log strings ('SetGroupMute: local set to %d rc=%d', 'SetGroupVolume: local:%d netops:%u zones:%u') show the impls fan out to group members: the local zone is set directly while remote zones receive RenderingControl.SetMute/SetVolume UPnP operations, with a GroupVolumeSetActionEvent bookkeeping object in the path.

</details>

## Availability

- status `strong`
- capability flags `0x4000`
- enabled gate: `xor(*(r3-in+0x571c))` at `0x10195688` (field_inverted)
- Registered unconditionally at service-init like the other control services; functional usefulness requires the device to be a group coordinator (impl iterates group members), but no coordinator gate exists in the wrappers themselves.

## Dispatch

- router `0x101953c8`, cap flags `0x4000`
- dispatcher `0x10738c58` kind `table`
- action table `0x10f11aa8`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `GetGroupMute` | advertised | callable | `strong` | direct | 402, 701, 702 |
| `GetGroupVolume` | advertised | callable | `strong` | direct | 402, 701, 702 |
| `SetGroupMute` | advertised | callable | `strong` | direct | 402, 701, 702, 801 |
| `SetGroupVolume` | advertised | callable | `strong` | direct | 402, 701, 702 |
| `SetRelativeGroupVolume` | advertised | callable | `strong` | direct | 402, 701, 702 |
| `SnapshotGroupVolume` | advertised | callable | `strong` | direct | 402, 701, 702 |

### `GetGroupMute`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports the group's overall mute state — whether group audio is currently silenced. The coordinator computes a single answer from its members, so the app can show one mute button for the whole group.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns the group-level mute state as CurrentMute byte. The group impl computes it (aggregation rule across members is unresolved - any-muted vs all-muted vs coordinator's own).

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | decimal uint32 / unbounded u32 in wrapper | none - required argument |

- **`InstanceID`** — Parsed by f_105614e0 (u32). Forwarded to impl; no range/instance check proven in the wrapper.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentMute` | boolean ('0'/'1') | 0/1 expected; byte width proven only |

- **`CurrentMute`** — Group mute byte produced by impl f_103a3f28 via the shared group-session state acquired by f_106ff3b8
  - validation: impl-written out arg; no client-side validation

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

request parsing: req->v\[+0x1c\](req, name) returns the arg node; typed helpers convert text
(f_105614e0 InstanceID u32, f_10561444 DesiredMute byte, f_10561478 DesiredVolume u16, f_10561514 Adjustment i32);
req->v\[+0x08\] is a parse-status gate whose failure diverts past the impl call to the fault tail;
impl->v\[+0x08\](impl, InstanceID, ...) runs the action; on non-success cr0.eq-clear, req->v\[+0x14\](req, impl_rc)
propagates the impl return code toward a SOAP fault.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_10738e9c @ 0x10738f1c — impl->v\[+0x08\](impl,InstanceID,&byte)

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10738e9c — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10738e9c — member vfunc calls: \['r30 v\[+0x8\]'\]

</details>


#### Side effects

- Queries mute state across the group (local zone + member zones) through the group-impl object. Impl-object vtable and member iteration details unresolved

#### State transitions `confirmed`

None proven; read-only.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10738e9c — read-only path

</details>


#### Events `confirmed`

None proven in the SOAP path.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10738e9c — no event calls in wrapper

</details>


#### Return behavior `confirmed`

Impl returns an int status in r3; wrapper checks cr0.eq and, when clear, passes the code to req->v\[+0x14\] (fault propagation). Whether member-level failures are aggregated into the rc or masked (accepted-vs-succeeded) is unresolved - per-member rc is only logged ('rc=%d').
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_10738e9c @ 0x10738f1c — impl->v\[+0x08\](impl,InstanceID,&byte)

</details>


#### Errors

**`701`** `confirmed`

nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc}

- group object lookup via f_1075cf7c fails (no group bound)

**`402`** `strong`

SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails

- Required argument absent or its lookup through the request-object parse helper fails

**`702`** `confirmed`

nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] -> parse helper into a stack word, then r4=lwz from that slot); impl prologue cmpwi r4,0 / beq->body, fallthrough returns 0x2be (702 Invalid InstanceID); only instance 0 exists in this build

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10738e9c`
- dispatch entry `0x10f11aa8`
- impl call `0x10738f1c` obj `r5-in` slot `8` arg4 `*(sp-0x30+0x18)`
- impl call `0x10738fa4` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x10738ef8` slot `8` (parse)
- Adapter vfunc: installs interface vptr 0x10e97d30 on this, then tail-calls f_106ff3b8 — the shared group-session acquire worker on obj+0x272c. Impl object is *(svc+4), dynamically installed (ctor zeroes it); class vtable 0x10ec37b4. Impl domain fully bounded: {702 if out-arg r4==0; 701 on f_1075cf7c group-lookup miss; 0 on success}.

- fn f_10738e9c @ 0x10738e9c — full wrapper decode
- fn 0x103a3f28 — impl vfunc on vtable 0x10ec37b4 +0x08
- fn 0x10738e9c @ 0x10738e9c — action wrapper handler
- @ 0x10f11aa8 — action dispatch table entry

</details>

### `GetGroupVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports the group's overall volume — a single number representing the group for the app's main slider. The coordinator derives it from member levels rather than just reporting its own, though exactly how it weighs the members is internal.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns the group volume as CurrentVolume u16. Aggregation across members (average vs coordinator's own) is unresolved - the group impl computes it via v\[+0x10\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | decimal uint32 / unbounded u32 in wrapper | none - required argument |

- **`InstanceID`** — Parsed by f_105614e0 (u32); forwarded to impl.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentVolume` | unsigned int16 | 0..100 expected; width proven only |

- **`CurrentVolume`** — Group volume u16 written by impl; group aggregation rule unresolved.
  - unit: percent volume units (unproven)
  - validation: impl-written out arg; no client-side validation

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

request parsing: req->v\[+0x1c\](req, name) returns the arg node; typed helpers convert text
(f_105614e0 InstanceID u32, f_10561444 DesiredMute byte, f_10561478 DesiredVolume u16, f_10561514 Adjustment i32);
req->v\[+0x08\] is a parse-status gate whose failure diverts past the impl call to the fault tail;
impl->v\[+0x10\](impl, InstanceID, ...) runs the action; on non-success cr0.eq-clear, req->v\[+0x14\](req, impl_rc)
propagates the impl return code toward a SOAP fault.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_107390c4 @ 0x10739144 — impl->v\[+0x10\](impl,InstanceID,&u16)

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x10\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107390c4 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x10\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107390c4 — member vfunc calls: \['r30 v\[+0x10\]'\]

</details>


#### Side effects

- Queries group volume state via the group-impl object. Impl-object vtable and member iteration details unresolved

#### State transitions `confirmed`

None proven; read-only.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x107390c4 — wrapper decode

</details>


#### Events `confirmed`

None proven in the SOAP path.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x107390c4 — wrapper decode

</details>


#### Return behavior `confirmed`

Impl returns an int status in r3; wrapper checks cr0.eq and, when clear, passes the code to req->v\[+0x14\] (fault propagation). Whether member-level failures are aggregated into the rc or masked (accepted-vs-succeeded) is unresolved - per-member rc is only logged ('rc=%d').
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_107390c4 @ 0x10739144 — impl->v\[+0x10\](impl,InstanceID,&u16)

</details>


#### Errors

**`701`** `confirmed`

nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc}

- group object lookup via f_1075cf7c fails (no group bound)

**`402`** `strong`

SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails

- Required argument absent or its lookup through the request-object parse helper fails

**`702`** `confirmed`

nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] -> parse helper into a stack word, then r4=lwz from that slot); impl prologue cmpwi r4,0 / beq->body, fallthrough returns 0x2be (702 Invalid InstanceID); only instance 0 exists in this build

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107390c4`
- dispatch entry `0x10f11ab4`
- impl call `0x10739144` obj `r5-in` slot `16` arg4 `*(sp-0x30+0x18)`
- impl call `0x107391cc` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x10739120` slot `8` (parse)
- Direct impl on the impl object: 4-insn predicate — loads global 0x11097910, returns CR-flag on it (group-volume read delegated to the shared group-volume state). Impl object is *(svc+4), dynamically installed (ctor zeroes it); class vtable 0x10ec37b4. Impl domain fully bounded: {702 if out-arg r4==0; 701 on f_1075cf7c group-lookup miss; 0 on success}.

- fn f_107390c4 @ 0x107390c4 — full wrapper decode
- fn 0x106fd104 — impl vfunc on vtable 0x10ec37b4 +0x10
- fn 0x107390c4 @ 0x107390c4 — action wrapper handler
- @ 0x10f11ab4 — action dispatch table entry

</details>

### `SetGroupMute`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Mutes or unmutes the whole group at once. The coordinator applies the mute to itself and forwards the request to every member — which is what makes one tap silence all the grouped rooms together.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets mute across the group. Impl-side logging in f_103a1b8c shows member fan-out: the local zone is set directly ('SetGroupMute: local set to %d rc=%d') while remote members receive per-member UPnP RenderingControl.SetMute requests (member table of 0x2740-byte records; callback f_103a3f28; 'SetGroupMute: %s set to %d rc=%d').

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | decimal uint32 / unbounded u32 in wrapper | none - required argument |
| `DesiredMute` | Parsed by f_10561444 to a byte; passed to impl as r5. Text accepted: byte-valued numeric (parser identical in shape to the other typed helpers); exact lexical rules unresolved. | yes | byte numeric / boolean: parsed by f_10561444 byte-bool reader — nonzero literal -> 1; forwarded as the DesiredMute flag to impl f_103a3f40 | none - required argument |

- **`InstanceID`** — Parsed by f_105614e0 (u32); forwarded to impl.
  - buffer cap: `0x18`
- **`DesiredMute`** — Parsed by f_10561444 to a byte; passed to impl as r5. Text accepted: byte-valued numeric (parser identical in shape to the other typed helpers); exact lexical rules unresolved.
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

request parsing: req->v\[+0x1c\](req, name) returns the arg node; typed helpers convert text
(f_105614e0 InstanceID u32, f_10561444 DesiredMute byte, f_10561478 DesiredVolume u16, f_10561514 Adjustment i32);
req->v\[+0x08\] is a parse-status gate whose failure diverts past the impl call to the fault tail;
impl->v\[+0x0c\](impl, InstanceID, ...) runs the action; on non-success cr0.eq-clear, req->v\[+0x14\](req, impl_rc)
propagates the impl return code toward a SOAP fault.
<details markdown="1"><summary>Evidence (4)</summary>

- fn f_10738fb0 @ 0x10739054 — impl->v\[+0x0c\](impl,InstanceID,byte)
- fn f_103a1b8c @ 0x103a1c0c — 'urn:...:service:RenderingControl:1' + 'SetMute' request table built
- fn f_103a1b8c @ 0x103a1fe8 — 'SetGroupMute: local set to %d rc=%d'
- fn f_103a1b8c @ 0x103a1ea4 — 'SetGroupMute: %s set to %d rc=%d' remote member log

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r30 v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10738fb0 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10738fb0 — member vfunc calls: \['r30 v\[+0xc\]'\]

</details>


#### Side effects

- Worker f_103a1b8c applies the mute locally and builds remote renderingcontrol:setmute upnp operation records (urn:schemas-upnp-org:service:renderingcontrol:1) dispatched to each member zone; logs 'setgroupmute: local set to %d rc=%d' / '%s set to %d rc=%d'. Impl-object vtable and member iteration details unresolved

#### State transitions `strong`

Member mute bytes change (local + remote); 'GroupMute'/'GroupVolumeChangeable' names built in f_1039d11c are evented state variables.
<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x10ec39fc — 'GroupMute' state-var name
- @ 0x10ec3a08 — 'GroupVolumeChangeable'

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10738fb0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

Impl returns an int status in r3; wrapper checks cr0.eq and, when clear, passes the code to req->v\[+0x14\] (fault propagation). Whether member-level failures are aggregated into the rc or masked (accepted-vs-succeeded) is unresolved - per-member rc is only logged ('rc=%d').
<details markdown="1"><summary>Evidence (4)</summary>

- fn f_10738fb0 @ 0x10739054 — impl->v\[+0x0c\](impl,InstanceID,byte)
- fn f_103a1b8c @ 0x103a1c0c — 'urn:...:service:RenderingControl:1' + 'SetMute' request table built
- fn f_103a1b8c @ 0x103a1fe8 — 'SetGroupMute: local set to %d rc=%d'
- fn f_103a1b8c @ 0x103a1ea4 — 'SetGroupMute: %s set to %d rc=%d' remote member log

</details>


#### Errors

**`701`** `strong`

nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc}

- zone-member list empty/invalid

**`402`** `strong`

SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails

- Required argument absent or its lookup through the request-object parse helper fails

**`702`** `confirmed`

nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] -> parse helper into a stack word, then r4=lwz from that slot); impl prologue cmpwi r4,0 / beq->body, fallthrough returns 0x2be (702 Invalid InstanceID); only instance 0 exists in this build

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)

**`801`** `strong`

reentrancy rejection: worker f_103a2160 reads flag byte *(impl+0x258); when already set it returns 0x321 (801) without performing the mutation (operation-in-progress); on first entry it sets the flag and continues into setter worker f_103a1b8c

- *(impl+0x258) flag already set (nested/duplicate invocation while a group-set is active)



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10738fb0`
- dispatch entry `0x10f11ac0`
- impl call `0x10739054` obj `r5-in` slot `12` arg4 `*(sp-0x30+0x18)`
- impl call `0x107390b8` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10739030` slot `8` (parse)
- Adapter vfunc: installs 0x10e97d30, calls f_106ff3b8 (group-session acquire on +0x272c), then f_108094fc(this,0x2740) — posts the SetMute op record; f_103a1b8c builds remote RenderingControl:SetMute fan-out records per zone. Impl object is *(svc+4), dynamically installed (ctor zeroes it); class vtable 0x10ec37b4.

- fn f_10738fb0 @ 0x10738fb0 — full wrapper decode
- fn 0x103a3f40 — impl vfunc on vtable 0x10ec37b4 +0x0c
- fn 0x10738fb0 @ 0x10738fb0 — action wrapper handler
- @ 0x10f11ac0 — action dispatch table entry

</details>

### `SetGroupVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Sets the group's absolute volume level. The coordinator applies it locally and fans the change out to every member, so a single slider move re-levels all the grouped rooms.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets absolute volume across the group. Impl logs 'SetGroupVolume: local:%d netops:%u zones:%u' - local set count, pending network operations, and zone count - showing the impl fans the request out to every group member (local direct + remote RenderingControl.SetVolume UPnP ops).

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | decimal uint32 / unbounded u32 in wrapper | none - required argument |
| `DesiredVolume` | Parsed by f_10561478 (u16-width numeric); passed as r5. No range clamp proven in the wrapper; impl-side bounds unresolved. | yes | decimal / decimal integer parsed by f_10561478 (u16-width numeric reader); no wrapper bound check present | none - required argument |

- **`InstanceID`** — Parsed by f_105614e0 (u32); forwarded to impl.
  - buffer cap: `0x18`
- **`DesiredVolume`** — Parsed by f_10561478 (u16-width numeric); passed as r5. No range clamp proven in the wrapper; impl-side bounds unresolved.
  - unit: percent volume units (Sonos convention, unproven for group path)
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

request parsing: req->v\[+0x1c\](req, name) returns the arg node; typed helpers convert text
(f_105614e0 InstanceID u32, f_10561444 DesiredMute byte, f_10561478 DesiredVolume u16, f_10561514 Adjustment i32);
req->v\[+0x08\] is a parse-status gate whose failure diverts past the impl call to the fault tail;
impl->v\[+0x14\](impl, InstanceID, ...) runs the action; on non-success cr0.eq-clear, req->v\[+0x14\](req, impl_rc)
propagates the impl return code toward a SOAP fault.
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_107391d8 @ 0x1073927c — impl->v\[+0x14\](impl,InstanceID,desired)
- fn ~f_103a2430 @ 0x10ec3dc4 — 'SetGroupVolume: local:%d netops:%u zones:%u'

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r30 v\[+0x14\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107391d8 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x14\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107391d8 — member vfunc calls: \['r30 v\[+0x14\]'\]

</details>


#### Side effects

- Applies locally then fans out renderingcontrol:setvolume upnp ops to member zones; bookkeeping via groupvolumesetactionevent records; logs 'setgroupvolume: local:%d netops:%u zones:%u'. Impl-object vtable and member iteration details unresolved

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x14\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107391d8 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x14\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107391d8 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

Impl returns an int status in r3; wrapper checks cr0.eq and, when clear, passes the code to req->v\[+0x14\] (fault propagation). Whether member-level failures are aggregated into the rc or masked (accepted-vs-succeeded) is unresolved - per-member rc is only logged ('rc=%d').
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_107391d8 @ 0x1073927c — impl->v\[+0x14\](impl,InstanceID,desired)
- fn ~f_103a2430 @ 0x10ec3dc4 — 'SetGroupVolume: local:%d netops:%u zones:%u'

</details>


#### Errors

**`701`** `strong`

nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc}

- zone-member list empty/invalid


**Bounded unknown — proven:** impl rc propagated; member fan-out logged with per-member rc
**Bounded unknown — unresolved:** worker f_103a2430 proven literals {801 reentrancy (addi r3,0x321 site), 802 (0x322), 803 (0x323) member-apply accumulator}; success/seed path producer not yet isolated (blr embedded after inline data/jump-table bytes); 701 via group-lookup chain

**`402`** `strong`

SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails

- Required argument absent or its lookup through the request-object parse helper fails


**Bounded unknown — proven:** the fault path is reached when the impl call reports failure
**Bounded unknown — unresolved:** worker f_103a2430 proven literals {801 reentrancy (addi r3,0x321 site), 802 (0x322), 803 (0x323) member-apply accumulator}; success/seed path producer not yet isolated (blr embedded after inline data/jump-table bytes); 701 via group-lookup chain

**`702`** `confirmed`

nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] -> parse helper into a stack word, then r4=lwz from that slot); impl prologue cmpwi r4,0 / beq->body, fallthrough returns 0x2be (702 Invalid InstanceID); only instance 0 exists in this build

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107391d8`
- dispatch entry `0x10f11acc`
- impl call `0x1073927c` obj `r5-in` slot `20` arg4 `*(sp-0x30+0x18)`
- impl call `0x107392e0` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10739258` slot `8` (parse)
- Direct impl: reads byte impl+0x22dd then enters the group volume set path on members +0x22c4..+0x22ff. Impl object is *(svc+4), dynamically installed (ctor zeroes it); class vtable 0x10ec37b4.

- fn f_107391d8 @ 0x107391d8 — full wrapper decode
- fn 0x106fd5d4 — impl vfunc on vtable 0x10ec37b4 +0x14
- fn 0x107391d8 @ 0x107391d8 — action wrapper handler
- @ 0x10f11acc — action dispatch table entry

</details>

### `SetRelativeGroupVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Adjusts the group volume by an amount rather than to an exact level — 'turn the group up by 5'. It applies the delta across the members and reports back the group's new volume.

<details markdown="1"><summary><b>Technical details</b></summary>

Adjusts group volume by a signed delta and returns the new group volume. impl->v\[+0x18\](impl, InstanceID, Adjustment, &u16 out); the u16 out feeds NewVolume.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | decimal uint32 / unbounded u32 in wrapper | none - required argument |
| `Adjustment` | Parsed by f_10561514 - a distinct helper from the u32/u16 parsers, consistent with signed i32 intake; passed as r5. Sign/clamp semantics inside impl unresolved. | yes | signed decimal / i32-ish width via f_10561514 | none - required argument |

- **`InstanceID`** — Parsed by f_105614e0 (u32); forwarded to impl.
  - buffer cap: `0x18`
- **`Adjustment`** — Parsed by f_10561514 - a distinct helper from the u32/u16 parsers, consistent with signed i32 intake; passed as r5. Sign/clamp semantics inside impl unresolved.
  - unit: percent volume units (signed delta, unproven)
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NewVolume` | unsigned int16 | type width only |

- **`NewVolume`** — Resulting group volume written as u16 at impl out-arg (sp+0x12); fan-out/aggregation unresolved.
  - unit: percent volume units (unproven)
  - validation: impl-written out arg; no client-side validation

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

request parsing: req->v\[+0x1c\](req, name) returns the arg node; typed helpers convert text
(f_105614e0 InstanceID u32, f_10561444 DesiredMute byte, f_10561478 DesiredVolume u16, f_10561514 Adjustment i32);
req->v\[+0x08\] is a parse-status gate whose failure diverts past the impl call to the fault tail;
impl->v\[+0x18\](impl, InstanceID, ...) runs the action; on non-success cr0.eq-clear, req->v\[+0x14\](req, impl_rc)
propagates the impl return code toward a SOAP fault.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_107392ec @ 0x10739394 — impl->v\[+0x18\](impl,InstanceID,adj,&u16)

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107392ec — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107392ec — member vfunc calls: \['r30 v\[+0x18\]'\]

</details>


#### Side effects

- Relative adjustment applied through the group-impl object. Impl-object vtable and member iteration details unresolved

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107392ec — no transition-literal/store pattern; member delegates: \['r30 v\[+0x18\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107392ec — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

Impl returns an int status in r3; wrapper checks cr0.eq and, when clear, passes the code to req->v\[+0x14\] (fault propagation). Whether member-level failures are aggregated into the rc or masked (accepted-vs-succeeded) is unresolved - per-member rc is only logged ('rc=%d').
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_107392ec @ 0x10739394 — impl->v\[+0x18\](impl,InstanceID,adj,&u16)

</details>


#### Errors

**`701`** `strong`

nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc}

- zone-member list empty/invalid


**Bounded unknown — proven:** impl rc propagated to fault vfunc
**Bounded unknown — unresolved:** worker f_103a2d04->f_103a2c4c->f_103a2430 proven literals {801 reentrancy (addi r3,0x321 site), 802 (0x322), 803 (0x323) member-apply accumulator}; success/seed path producer not yet isolated (blr embedded after inline data/jump-table bytes); 701 via group-lookup chain

**`402`** `strong`

SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails

- Required argument absent or its lookup through the request-object parse helper fails


**Bounded unknown — proven:** the fault path is reached when the impl call reports failure
**Bounded unknown — unresolved:** worker f_103a2d04->f_103a2c4c->f_103a2430 proven literals {801 reentrancy (addi r3,0x321 site), 802 (0x322), 803 (0x323) member-apply accumulator}; success/seed path producer not yet isolated (blr embedded after inline data/jump-table bytes); 701 via group-lookup chain

**`702`** `confirmed`

nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] -> parse helper into a stack word, then r4=lwz from that slot); impl prologue cmpwi r4,0 / beq->body, fallthrough returns 0x2be (702 Invalid InstanceID); only instance 0 exists in this build

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107392ec`
- dispatch entry `0x10f11ad8`
- impl call `0x10739394` obj `r5-in` slot `24` arg4 `*(sp-0x30+0x14)`
- impl call `0x1073941c` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x1073936c` slot `8` (parse)
- Direct impl in the group-volume worker family (f_106ff region). Impl object is *(svc+4), dynamically installed (ctor zeroes it); class vtable 0x10ec37b4.

- fn f_107392ec @ 0x107392ec — full wrapper decode
- fn 0x106ff454 — impl vfunc on vtable 0x10ec37b4 +0x18
- fn 0x107392ec @ 0x107392ec — action wrapper handler
- @ 0x10f11ad8 — action dispatch table entry

</details>

### `SnapshotGroupVolume`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Takes a snapshot of each member's current volume before a group-wide change — most importantly before a group mute. That way, when the group is unmuted, every room can return to its own previous level instead of all coming back at some uniform value.

<details markdown="1"><summary><b>Technical details</b></summary>

Captures the group's current per-member volumes into a snapshot ('snapshot %s: %u (was %u)' bookkeeping seen in the group-mute/volume worker). impl->v\[+0x1c\](impl, InstanceID) only - no outputs.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | decimal uint32 / unbounded u32 in wrapper | none - required argument |

- **`InstanceID`** — Parsed by f_105614e0 (u32); forwarded to impl.
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

request parsing: req->v\[+0x1c\](req, name) returns the arg node; typed helpers convert text
(f_105614e0 InstanceID u32, f_10561444 DesiredMute byte, f_10561478 DesiredVolume u16, f_10561514 Adjustment i32);
req->v\[+0x08\] is a parse-status gate whose failure diverts past the impl call to the fault tail;
impl->v\[+0x1c\](impl, InstanceID, ...) runs the action; on non-success cr0.eq-clear, req->v\[+0x14\](req, impl_rc)
propagates the impl return code toward a SOAP fault.
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_10738db0 @ 0x10738e2c — impl->v\[+0x1c\](impl,InstanceID)
- fn f_103a1b8c @ 0x103a1fc8 — 'snapshot %s: %u (was %u)' log in group worker

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10738db0 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10738db0 — member vfunc calls: \['r30 v\[+0x1c\]'\]

</details>


#### Side effects

- Snapshots group volume state via the group-impl object; downstream produces groupvolumechangedevent / 'sent group volume change %u to esdk (mute %d)'. Impl-object vtable and member iteration details unresolved

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10738db0 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x1c\]'\]

</details>


#### Events `confirmed`

None proven.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10738db0 — no event calls in wrapper

</details>


#### Return behavior `confirmed`

Impl returns an int status in r3; wrapper checks cr0.eq and, when clear, passes the code to req->v\[+0x14\] (fault propagation). Whether member-level failures are aggregated into the rc or masked (accepted-vs-succeeded) is unresolved - per-member rc is only logged ('rc=%d').
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_10738db0 @ 0x10738e2c — impl->v\[+0x1c\](impl,InstanceID)
- fn f_103a1b8c @ 0x103a1fc8 — 'snapshot %s: %u (was %u)' log in group worker

</details>


#### Errors

**`701`** `confirmed`

nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc}

- group object lookup via f_1075cf7c fails (no group bound)

**`402`** `strong`

SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails

- Required argument absent or its lookup through the request-object parse helper fails

**`702`** `confirmed`

nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] -> parse helper into a stack word, then r4=lwz from that slot); impl prologue cmpwi r4,0 / beq->body, fallthrough returns 0x2be (702 Invalid InstanceID); only instance 0 exists in this build

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10738db0`
- dispatch entry `0x10f11ae4`
- impl call `0x10738e2c` obj `r5-in` slot `28` arg4 `*(sp-0x30+0x18)`
- impl call `0x10738e90` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10738e0c` slot `8` (parse)
- Direct impl in the group-volume worker family. Impl object is *(svc+4), dynamically installed (ctor zeroes it); class vtable 0x10ec37b4. Impl domain fully bounded: {702 if out-arg r4==0; 701 on f_1075cf7c group-lookup miss; 0 on success}.

- fn f_10738db0 @ 0x10738db0 — full wrapper decode
- fn 0x106ff898 — impl vfunc on vtable 0x10ec37b4 +0x1c
- fn 0x10738db0 @ 0x10738db0 — action wrapper handler
- @ 0x10f11ae4 — action dispatch table entry

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `GroupMute` | boolean | yes | evented state variable — appears in GroupRenderingControl LastChange/GENA event notifications |
| `GroupVolume` | ui2 | yes | evented state variable — appears in GroupRenderingControl LastChange/GENA event notifications |
| `GroupVolumeChangeable` | boolean | yes | evented state variable — appears in GroupRenderingControl LastChange/GENA event notifications |
| `A_ARG_TYPE_InstanceID` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_VolumeAdjustment` | i4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /MediaRenderer/GroupRenderingControl/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `groupRendering`
<details markdown="1"><summary><b>Technical details</b></summary>

- **notify_path:** internal event 'GroupVolumeChangedEvent'/'GroupVolumeSetActionEvent' pool -> GENA/WSS; evented var 'GroupVolumeChangeable' literal proven; GroupMute/GroupVolume go through the same group-volume event pool
- **wss_registry:**
  - idx: 35, name: groupRendering, id: 137, tag: 71

</details>


## Dispatcher-level errors

<details markdown="1"><summary><b>Technical details</b></summary>

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search



</details>

## Additional records

### `implementation_notes`

<details markdown="1"><summary><b>Technical details</b></summary>

- **volume_engine:** SetGroupVolume fans to member zones as netops ("local:%d netops:%u zones:%u"); normalize formula "calculateVolume %s: sg:%.4f ng:%u sv:%u nv:%.4f" + "gvd: t:%d c:%d f:%d m:%d cv:%d sv:%d"; per-zone snapshots "snapshot %s: %u (was %u)" + "snapshot sum for %u (of %u) zones"; states total/partial failure, all-fixed, operation in progress; DesiredVolume/DesiredMute; GroupVolumeSetActionEvent {vol,mute,vligrouping} -> VliVolumeProcessingCompleteEvent
- **state_vars:** `OutputFixed`, `GroupMute`, `GroupVolumeChangeable`
- **remote_rc:** remoteRC (%s) proxy logs {fixed,vol,mute} per member

</details>

Implementation sources (recovered): `zoneplayer/grc_zpimpl.cxx`

<details markdown="1"><summary>Service evidence (3)</summary>

- @ 0x101953c8 — service router function
- @ 0x10f11a9c — service vtable
- @ 0x10738c58 — service dispatcher

</details>
