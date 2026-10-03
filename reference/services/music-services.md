# `MusicServices` — `/MusicServices/Control`

**visibility** `advertised` · **status** `strong`

This service manages the player's relationship with streaming services — Spotify, Apple Music, and the dozens of others Sonos supports. It answers 'which services are available on this system', asks the cloud for a refreshed service list, and hands out session tokens: the credentials a service (or the app on its behalf) needs to keep a logged-in session alive on the speaker. It's the account/session plumbing between your speaker and your streaming subscriptions — not the commands that actually play music.

<details markdown="1"><summary><b>Technical details</b></summary>

Sonos music-service account/session service; impl member at svc+4 for the session/list vfuncs.

</details>

## Availability

- capability flags `0x200`
- enabled gate: `xor(*(r3-in+0x571c))` at `0x1019565c` (field_inverted)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x200`
- dispatcher `0x1073a11c` kind `table`
- action table `0x10f11d1c`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `GetSessionId` | advertised | callable | `strong` | virtual | 401, 402 |
| `ListAvailableServices` | advertised | callable | `strong` | virtual | 402 |
| `UpdateAvailableServices` | advertised | callable | `strong` | virtual | 402, 800 |

### `GetSessionId`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns the session token for a specific music-service account — the credential string that lets a client act on that service as you. You name the service and the account username, and the speaker hands back its stored session ID.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns the session id for a music-service account. Wrapper parses ServiceId (int via f_105614e0) and Username (string cap 0x81), then calls impl->v\[+0xc\] on the svc+4 member with an output buffer (cap 0x101) for SessionId.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ServiceId` | SonosStringArg | yes | A configured service id / length-bounded by parse-helper buffer cap | none - required argument |
| `Username` | SonosStringArg | yes | Service account name / max 128 chars | none - required argument |

- **`ServiceId`** — Numeric id of the music service (from ListAvailableServices).
  - buffer cap: `0x18`
- **`Username`** — Account username on that service, parsed into a 0x81-byte buffer.
  - buffer cap: `0x81`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `SessionId` | SonosStringArg | whatever string worker f_100c7c6c produces for a valid index (session-id token); not enumerable statically / length-bounded by parse-helper buffer cap |

- **`SessionId`** — Session-id string produced by worker f_100c7c6c for the validated service index; empty/absent when the lookup fails.
  - special values: failure -> 402 fault before emission
  - validation: input index must be < 0x100 (impl cmplwi at 0x100c8054)

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073a264 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×2, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a264 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a264 — member vfunc calls: \['*(r30+4) v\[+0xc\]'\]

</details>


#### Side effects

- Read-only session-id lookup; no persistent mutation on the impl path.

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a264 — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0xc\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a264 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a264 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl->v\[+0xc\] rc surfaced | Wrapper parse layer rejected an argument before the impl call.

- impl vfunc nonzero
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`401`** `strong`

capability/mode flag gate (sp byte flags tested before arg parse)

- *(sp+0x18)!=0 then *(sp+0x14)==0 -> 401



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073a264`
- dispatch entry `0x10f11d1c` (voff `12`)
- impl call `0x1073a314` obj `*(r3-in+0x4)` slot `12` arg4 `*(sp-0x1b0+0x10)`
- impl call `0x1073a394` obj `vret(*(sp-0x1b0+0x1ac),+0x24)` slot `16` arg4 `sp+0x98`
- impl call `0x1073a3a8` obj `*(sp-0x1b0+0x1ac)` slot `12` arg4 `?`
- req vcall `0x1073a2e8` slot `8` (parse)
- Impl f_100c7fb4: validates the requested service index/id — cmplwi value,0x100; value >= 256 returns 402; otherwise calls session-lookup worker f_100c7c6c and forwards its rc (worker vocabulary untraced).

- fn 0x1073a264 @ 0x1073a264 — action wrapper handler
- @ 0x10f11d1c — action dispatch table entry
- fn 0x100c7fb4 — Impl f_100c7fb4: validates the requested service index/id — cmplwi value,0x100; value >= 256 returns 402; otherwise call

</details>

### `ListAvailableServices`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns the full list of music services this system knows about — the catalog the app shows when you browse 'Add Music Services' or pick a source: service names, capabilities, and how to talk to each one.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns the list of available music services. Wrapper reaches the impl through *(*(sp+0x18)+0x8) — a doubly-indirect member — and calls its v\[+0x8\] which serializes the service list.

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `AvailableServiceDescriptorList` | response field | impl-produced / per the parser/emitter |
| `AvailableServiceTypeList` | response field | impl-produced / per the parser/emitter |
| `AvailableServiceListVersion` | response field | impl-produced / per the parser/emitter |

- **`AvailableServiceDescriptorList`** — music-service catalogue field emitted via the response writer inside serializer f_100c6314
  - validation: arg-name string 'out' loaded at 0x100c6770 inside f_100c6314
- **`AvailableServiceTypeList`** — music-service catalogue field emitted via the response writer inside serializer f_100c6314
  - validation: arg-name string 'out' loaded at 0x100c67d0 inside f_100c6314
- **`AvailableServiceListVersion`** — music-service catalogue field emitted via the response writer inside serializer f_100c6314
  - validation: arg-name string 'out' loaded at 0x100c67f4 inside f_100c6314

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073a424 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (validate×1); member delegates: r4 v\[+0x3c\], *(r30+8) v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a424 — req-vfunc call map: {'0x8': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x3c\], *(r30+8) v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a424 — member vfunc calls: \['r4 v\[+0x3c\]', '*(r30+8) v\[+0x8\]'\]

</details>


#### Side effects

- Read-only serialization of the impl service table via secondary-base vfunc f_100c6314.

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x3c\], *(r30+8) v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a424 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x3c\]', '*(r30+8) v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a424 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a424 — commit/fault slot usage: {'0x8': 1}

</details>


#### Errors

**`402`** `strong`

impl->v\[+0x8\] rc surfaced | Wrapper parse layer rejected an argument before the impl call.

- impl vfunc rc
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** impl->v\[+0x8\] rc surfaced
**Bounded unknown — unresolved:** none identified



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073a424`
- dispatch entry `0x10f11d28` (voff `16`)
- impl call `0x1073a4b0` obj `*(*(sp-0x20+0x18)+0x8)` slot `8` arg4 `*(sp-0x20+0x1c)`
- req vcall `0x1073a450` slot `60` (other)
- req vcall `0x1073a464` slot `8` (parse)
- Handler f_1073a424: req->v\[+0x3c\] prep, req->v\[+0x08\] gate (nonzero -> silent early return). Then *(svc+8)->v\[+0x08\] = secondary-base thunk f_100c6948 into f_100c6314 — the service-list serializer on the MS impl object (vtable 0x10e768a4, obj member ctx+0x292b8).

- fn 0x1073a424 @ 0x1073a424 — action wrapper handler
- @ 0x10f11d28 — action dispatch table entry
- fn 0x100c6948 — Handler f_1073a424: req->v\[+0x3c\] prep, req->v\[+0x08\] gate (nonzero -> silent early return). Then *(svc+8)->v\[+0x08\] = s

</details>

### `UpdateAvailableServices`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Asks the speaker to refresh its catalog of music services — re-pull the current service list so newly launched or updated services appear. Re-pulls the current service list so newly launched or updated services appear.

<details markdown="1"><summary><b>Technical details</b></summary>

Triggers a refresh of the available music-services list via impl->v\[+0x8\] on the svc+4 member.

</details>

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (proven on this service): each input is fetched by req->v\[+0x1c\] named lookup plus a typed parse helper (f_105614e0 int, f_1056157c string w/ cap, f_10561514 int, f_10561444 bool); req->v\[+0x8\] then validates the request (nonzero proceeds); the impl call impl->v\[slot\] returns a code -> cr0.eq emits outputs, nonzero goes through req->v\[+0x14\] as a SOAP fault with the impl code verbatim.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073a3b4 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, commit×1); member delegates: *(r3+4) v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a3b4 — req-vfunc call map: {'0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r3+4) v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a3b4 — member vfunc calls: \['*(r3+4) v\[+0x8\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r3+4) v\[+0x8\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r3+4) v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a3b4 — no transition-literal/store pattern; member delegates: \['*(r3+4) v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a3b4 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1073a3b4 — commit/fault slot usage: {'0x14': 1, '0xc': 1}

</details>


#### Errors

**`800`** `strong`

impl->v\[+0x8\] rc surfaced

- impl vfunc rc


**Bounded unknown — proven:** impl->v\[+0x8\] rc surfaced
**Bounded unknown — unresolved:** none identified

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

music-services list refresh rc domain adds {801} via service-catalog worker

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073a3b4`
- dispatch entry `0x10f11d34` (voff `20`)
- impl call `0x1073a3d8` obj `*(r3-in+0x4)` slot `8` arg4 `r4-in`
- impl call `0x1073a420` obj `*(*(r4-in+0x0)+0x14)` slot `12` arg4 `vret(*(r3-in+0x4),+0x8)`
- Impl f_100c997c: the service-list replace worker — ~0x1c770-byte stack frame with the parse/replace table; emits a 0x320(800) error constant on one early path; other paths forward inner rc.

- fn 0x1073a3b4 @ 0x1073a3b4 — action wrapper handler
- @ 0x10f11d34 — action dispatch table entry
- fn 0x100c997c — Impl f_100c997c: the service-list replace worker — ~0x1c770-byte stack frame with the parse/replace table; emits a 0x320
- @ 0x1073a3b4 — handler body: impl call + fault/commit only; no parse or emit arg sites

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `A_ARG_TYPE_ServiceDescriptorList` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ServiceTypeList` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `ServiceId` | ui4 | no | non-evented MusicServices state variable — read via action out-args, not pushed |
| `ServiceListVersion` | string | yes | evented state variable — appears in MusicServices LastChange/GENA event notifications |
| `SessionId` | string | no | non-evented MusicServices state variable — read via action out-args, not pushed |
| `Username` | string | no | non-evented MusicServices state variable — read via action out-args, not pushed |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /MusicServices/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `musicServices`, `musicServicesChanged`
<details markdown="1"><summary><b>Technical details</b></summary>

- **notify_path:** f_100c7084 e:property dump {ServiceListVersion} -> f_10676a44
- **payload_model:** e:property doc via f_10676a44 writer family
- **wss_registry:**
  - idx: 44, name: musicServices, id: 166, tag: 73
  - idx: 45, name: musicServicesChanged, id: 167, tag: 25

</details>


## Dispatcher-level errors

<details markdown="1"><summary><b>Technical details</b></summary>

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search



</details>

Implementation sources (recovered): `zoneplayer/zpserviceaccounts.cxx`, `zoneplayer/svcmanifestfile.cxx`, `zoneplayer/spotify/spotify_smapi.cxx`, `zoneplayer/accountsmgr.cxx`, `zoneplayer/entitlementsmanager.cxx`

<details markdown="1"><summary>Service evidence (3)</summary>

- @ 0x101953c8 — service router function
- @ 0x10f11d04 — service vtable
- @ 0x1073a11c — service dispatcher

</details>
