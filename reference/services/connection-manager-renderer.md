# `ConnectionManager` — `/MediaRenderer/ConnectionManager/Control`

**visibility** `advertised` · **status** `strong`

Standard UPnP ConnectionManager for the renderer half of the device. On Sonos this is mostly vestigial (playback isn't pull-pushed through UPnP connections), so connection ids are typically empty - but the three actions are the real spec.

**Technical description:** Standard UPnP ConnectionManager registered at /MediaRenderer/ConnectionManager/Control; identical handler pair to its sibling registration (handlers 0x10735xxx shared verbatim). impl = svc+4 member for info, r4-in arg for the ID-list/protocol getters.

## Availability

- capability flags `0x40`
- enabled gate: `xor(*(r3-in+0x571c))` at `0x10195680` (field_inverted)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x40`
- dispatcher `0x10735574` kind `table`
- action table `0x10f118d4`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `GetCurrentConnectionIDs` | advertised | callable | `strong` | virtual | 402 |
| `GetCurrentConnectionInfo` | advertised | callable | `strong` | virtual | 402, 706 |
| `GetProtocolInfo` | advertised | callable | `strong` | virtual | 402 |

### `GetCurrentConnectionIDs`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns the CSV list of active connection ids (usually empty on a zone player).

**Technical description:** Returns the CSV list of active connection ids. Wrapper calls impl->v\[+0x8\] on the r4-in impl object; a NONZERO return means success — the emit helper f_10735918 then serializes the id list — while 0 raises fault 402. This is the nonzero=success convention seen elsewhere in the streamer/getter family.

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentConnectionIDs` | response field | impl-produced / per the response writer |

- **`CurrentConnectionIDs`** — CSV of active connection IDs; impl 0x10735918 writes a NUL via the core stub f_1032e710, so it is always empty in this build
  - validation: arg-name string loaded at 0x10735968 inside impl 0x10735918; emitted via the response writer

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x107359e0 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107359e0 — req-vfunc call map: {'0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107359e0 — member vfunc calls: \['r4 v\[+0x8\]'\]

</details>


#### Side effects

- No state mutation -- core vfuncs are read-only stubs/literal copies in this build.

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107359e0 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107359e0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107359e0 — commit/fault slot usage: {'0x14': 1}

</details>


#### Errors

**`402`** `strong`

The impl->v\[+0x8\] call returned 0 — no usable connection list. | n/a — success/failure fully determined by the impl vfunc return

- impl vfunc r3==0
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage
- impl returned 0 — impl/parse rc path to shared fault emitter (see evidence)


**Bounded unknown — proven:** n/a — success/failure fully determined by the impl vfunc return
**Bounded unknown — unresolved:** none


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107359e0`
- dispatch entry `0x10f118d4` (voff `16`)
- impl call `0x10735a0c` obj `r4-in` slot `8` arg4 `r4-in`
- Request-gate req->v\[+0x08\] (nonzero else 402). Calls core->v\[+0x0c\] = f_1032e710, a stub that stores a NUL byte into the out buffer and returns 0 unconditionally -- CurrentConnectionIDs is therefore always the empty string (no connection registry in this build). req->v\[+0x0c\] commits. Outputs recovered from arg-name string loads inside the impl function (extractor missed them). Shared-handler service family: identical handler/impl addresses also registered under the sibling ConnectionManager service path; one code object serves both services.

- fn 0x107359e0 @ 0x107359e0 — action wrapper handler
- @ 0x10f118d4 — action dispatch table entry
- fn f_107359e0 — handler body traced; core vfuncs resolved on ConnectionManagerServer vtable 0x10eb86c8
- fn 0x1032e730 — Sink/conn-info vfunc: only 402/706 returns, no success path

</details>

### `GetCurrentConnectionInfo`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns per-connection detail (peer manager, protocol info, direction, status) for a ConnectionID previously returned by GetCurrentConnectionIDs.

**Technical description:** Returns the seven connection-info fields for a given ConnectionID. Wrapper parses ConnectionID (f_10561514 int), validates via req->v\[+0x8\], then calls the impl member at svc+4 ->v\[+0x1c\] with seven 0x400-byte output buffers (RcsID, AVTransportID, ProtocolInfo, PeerConnectionManager, PeerConnectionID, Direction, Status). rc==0 emits.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ConnectionID` | SonosUintArg | yes | impl-side grammar applies / parser cap | none - required argument |

- **`ConnectionID`** — connection identifier to query
  - validation: consumed by the impl vfunc
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `RcsID` | signed int32 | length-bounded by parse-helper buffer cap |
| `AVTransportID` | signed int32 | length-bounded by parse-helper buffer cap |
| `ProtocolInfo` | SonosStringArg | length-bounded by parse-helper buffer cap |
| `PeerConnectionManager` | SonosStringArg | length-bounded by parse-helper buffer cap |
| `PeerConnectionID` | signed int32 | length-bounded by parse-helper buffer cap |
| `Direction` | SonosStringArg | length-bounded by parse-helper buffer cap |
| `Status` | SonosBoolArg | {0,1} |

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x107356bc — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×4, raise-fault×1, required-arg fetch×1, out-arg write×7, validate×1, commit×1); member delegates: *(r30+4) v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107356bc — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 7, '0x10': 4, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107356bc — member vfunc calls: \['*(r30+4) v\[+?\]'\]

</details>


#### Side effects

- Always faults before emitting -- no observable effect beyond the SOAP fault.

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107356bc — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107356bc — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x107356bc — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 7, '0x10': 4, '0xc': 1}

</details>


#### Errors

**`706`** `strong`

impl->v\[+0x1c\] rc surfaced

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** impl->v\[+0x1c\] rc surfaced
**Bounded unknown — unresolved:** the specific code for an unknown/inactive ConnectionID

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107356bc`
- dispatch entry `0x10f118e0` (voff `20`)
- impl call `0x10735700` obj `r4-in` slot `28` arg4 `ConnectionID`
- impl call `0x1073571c` obj `r4-in` slot `8` arg4 `?`
- impl call `0x10735778` obj `*(r3-in+0x4)` slot `16` arg4 `*(sp-0x1050+0x2c)`
- impl call `0x10735794` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0x10)`
- impl call `0x10735844` obj `vret(*(sp-0x1050+0x104c),+0x24)` slot `16` arg4 `sp+0x3c`
- impl call `0x10735874` obj `vret(*(sp-0x1050+0x104c),+0x24)` slot `16` arg4 `sp+0x43c`
- impl call `0x107358c8` obj `vret(*(sp-0x1050+0x104c),+0x24)` slot `16` arg4 `*(sp-0x1050+0x1044)`
- impl call `0x107358f8` obj `vret(*(sp-0x1050+0x104c),+0x24)` slot `16` arg4 `*(sp-0x1050+0x1048)`
- req vcall `0x1073590c` slot `12` (commit)
- Parses required ConnectionID via req->v\[+0x1c\]+f_10561514, then req->v\[+0x08\] gate (else 402). Calls core->v\[+0x10\] = f_1032e730 which contains NO success path: cmpwi ConnectionID,0 / isel returns 402 when ConnectionID==0 and 706 otherwise. Nonzero rc raises a SOAP fault via req->v\[+0x14\]; the emit path (RcsID/AVTransportID/ProtocolInfo/PeerConnectionManager/PeerConnectionID/Direction/Status out-args written from a filled record) is dead code in this build -- no connection ever exists.

- fn 0x107356bc @ 0x107356bc — action wrapper handler
- @ 0x10f118e0 — action dispatch table entry
- fn f_107356bc — handler body traced; core vfuncs resolved on ConnectionManagerServer vtable 0x10eb86c8
- fn 0x1032e730 — Sink/conn-info vfunc: only 402/706 returns, no success path

</details>

### `GetProtocolInfo`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns the Source and Sink protocol-info CSVs - the MIME-type/protocol strings this renderer can play.

**Technical description:** Returns the supported protocol info strings (Source/Sink CSVs) via impl->v\[+0x8\] on the r4-in impl object with the same nonzero=success convention as GetCurrentConnectionIDs.

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Source` | response field | impl-produced / per the response writer |
| `Sink` | response field | impl-produced / per the response writer |

- **`Source`** — source protocol-info CSV emitted by impl 0x10735a64 via core vfunc f_1032e84c
  - validation: arg-name string loaded at 0x10735abc inside impl 0x10735a64; emitted via the response writer
- **`Sink`** — sink protocol-info CSV emitted by impl 0x10735a64
  - validation: arg-name string loaded at 0x10735ae8 inside impl 0x10735a64; emitted via the response writer

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10735b64 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735b64 — req-vfunc call map: {'0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735b64 — member vfunc calls: \['r4 v\[+0x8\]'\]

</details>


#### Side effects

- No state mutation -- core vfuncs are read-only stubs/literal copies in this build.

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735b64 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735b64 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10735b64 — commit/fault slot usage: {'0x14': 1}

</details>


#### Errors

**`402`** `strong`

impl->v\[+0x8\] rc gates emit | Wrapper parse layer rejected an argument before the impl call.

- impl vfunc rc
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** impl->v\[+0x8\] rc gates emit
**Bounded unknown — unresolved:** whether 0 faults with 402 like its sibling


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10735b64`
- dispatch entry `0x10f118ec` (voff `12`)
- impl call `0x10735b90` obj `r4-in` slot `8` arg4 `r4-in`
- Request-gate req->v\[+0x08\] (nonzero required else 402 fault). Emits Source via core(ConnectionManagerServer, vtable 0x10eb86c8)->v\[+0x08\] = f_1032e84c, a strlcpy of the literal CSV "file:*:audio/mpegurl:*,x-file-cifs:*:*:*,x-rincon:*:*:*,x-rincon-mp3radio:*:*:*,x-rincon-playlist:*:*:*,x-rincon-queue:*:*:*,x-rincon-stream:*:*:*" into a 0x400 stack buffer; emits Sink via core->v\[+0x10\] = f_1032e730, a stub that never writes the buffer and returns 706 -- the rc is discarded and Sink is emitted empty. Then req->v\[+0x0c\] commits the response. Outputs recovered from arg-name string loads inside the impl function (extractor missed them). Shared-handler service family: identical handler/impl addresses also registered under the sibling ConnectionManager service path; one code object serves both services.

- fn 0x10735b64 @ 0x10735b64 — action wrapper handler
- @ 0x10f118ec — action dispatch table entry
- fn f_10735b64 — handler body traced; core vfuncs resolved on ConnectionManagerServer vtable 0x10eb86c8
- fn 0x1032e730 — Sink/conn-info vfunc: only 402/706 returns, no success path

</details>

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /MediaRenderer/ConnectionManager/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `connectionManager`
- **notify_path:** f_10735918 emits CurrentConnectionIDs
- **wss_registry:**
  - idx: 22, name: connectionManager, id: 77, tag: 67

## Dispatcher-level errors

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search


Implementation sources (recovered): `compiled lib — no path literal (same family as MediaServer CM)`

<details markdown="1"><summary>Service evidence (3)</summary>

- @ 0x101953c8 — service router function
- @ 0x10f118bc — service vtable
- @ 0x10735574 — service dispatcher

</details>
