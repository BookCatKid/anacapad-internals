# `Queue` — `/MediaRenderer/Queue/Control`

**visibility** `advertised` · **status** `strong`

The multi-queue registry: explicit saved/independent queues addressed by QueueID, separate from the implicit playback queue AVTransport edits. Provides create/attach/browse/mutate operations with optimistic concurrency - every mutating action takes the queue's last UpdateID and returns the new one, and a stale UpdateID faults. AttachQueue is how a client adopts a queue owned by another context.

**Technical description:** Sonos-internal queue-management service exposing the queue-registry impl object (svc member +0x3fa74). Dispatcher 0x10464268 binary-searches the 12-byte-entry name table 0x10ed19ec; unknown action -> req->v\[+0x14\](req,401). Matched entries tail-call svc->v\[+0x38\] which invokes the action handler with (req, impl=r5-in); impl is the queue-manager singleton whose vfuncs +0x08..+0x30 back the eleven actions. Unlike AVTransport (implicit engine queue), every mutation here takes an explicit QueueID and reports back NewUpdateID for optimistic concurrency.

## Availability

- capability flags `0x8000`
- enabled gate: `xor(*(r3-in+0x571c))` at `0x1019568c` (field_inverted)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x8000`
- dispatcher `0x10464268` kind `table`
- action table `0x10ed19ec`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `AddMultipleURIs` | advertised | callable | `strong` | direct | 402 |
| `AddURI` | advertised | callable | `strong` | direct | 402 |
| `AttachQueue` | advertised | callable | `strong` | direct | 402 |
| `Backup` | advertised | callable | `strong` | direct | 402 |
| `Browse` | advertised | callable | `strong` | direct | 402 |
| `CreateQueue` | advertised | callable | `strong` | direct | 402 |
| `RemoveAllTracks` | advertised | callable | `strong` | direct | 402 |
| `RemoveTrackRange` | advertised | callable | `strong` | direct | 402 |
| `ReorderTracks` | advertised | callable | `strong` | direct | 402 |
| `ReplaceAllTracks` | advertised | callable | `strong` | direct | 402 |
| `SaveAsSonosPlaylist` | advertised | callable | `strong` | direct | 402 |

### `AddMultipleURIs`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Bulk-adds tracks to an explicit queue: EnqueuedURIsAndMetaData holds NumberOfURIs packed URI+metadata entries; positioning via DesiredFirstTrackNumberEnqueued or EnqueueAsNext. UpdateID-guarded.

**Technical description:** Batch-enqueue into an explicit queue; writes NumTracksAdded/NewQueueLength/NewUpdateID through out params. impl is the queue-manager object (r5-in); the action invokes impl->v\[+0x2c\](impl, args...) under the standard wrapper convention; QueueID selects the target queue in the registry, UpdateID is the optimistic-concurrency token (NewUpdateID is returned on mutation success). The impl vfunc is a forwarder into the shared queue-engine object *(svc+0x128) on engine vtable 0x10e97d30; the concrete enqueue/replace logic lives in that engine vfunc (bounded by worker exit-scan).

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `QueueID` | ui4 argument | yes | A_ARG_TYPE_QueueID-domain value / impl-bounded (req-slot arg) | none |
| `UpdateID` | ui4 argument | yes | A_ARG_TYPE_UpdateID-domain value / impl-bounded (req-slot arg) | none |
| `ContainerURI` | string argument | yes | A_ARG_TYPE_URI-domain value / impl-bounded (req-slot arg) | none |
| `ContainerMetaData` | string argument | yes | A_ARG_TYPE_URIMetaData-domain value / impl-bounded (req-slot arg) | none |
| `DesiredFirstTrackNumberEnqueued` | ui4 argument | yes | A_ARG_TYPE_TrackNumber-domain value / impl-bounded (req-slot arg) | none |
| `EnqueueAsNext` | boolean argument | yes | A_ARG_TYPE_EnqueueAsNext-domain value / impl-bounded (req-slot arg) | none |
| `NumberOfURIs` | ui4 argument | yes | A_ARG_TYPE_NumTracks-domain value / impl-bounded (req-slot arg) | none |
| `EnqueuedURIsAndMetaData` | string argument | yes | A_ARG_TYPE_LIST_URI_AND_METADATA-domain value / impl-bounded (req-slot arg) | none |

- **`QueueID`** — target queue id
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`UpdateID`** — optimistic-concurrency update id
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`ContainerURI`** — the container (album/playlist/service) the tracks are enqueued under — sets the queue's owning content container
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`ContainerMetaData`** — container DIDL-Lite metadata
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`DesiredFirstTrackNumberEnqueued`** — desired 1-based index for the first enqueued track
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`EnqueueAsNext`** — insert after the current track instead of appending
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`NumberOfURIs`** — count of URIs in EnqueuedURIsAndMetaData
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`EnqueuedURIsAndMetaData`** — list-of-URI-and-metadata blob (per-track URI+metadata pairs)
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NumTracksAdded` | ui4 argument | A_ARG_TYPE_NumTracks-domain value / impl-bounded (req-slot arg) |
| `NewQueueLength` | ui4 argument | A_ARG_TYPE_NumTracks-domain value / impl-bounded (req-slot arg) |
| `NewUpdateID` | ui4 argument | UpdateID-domain value / impl-bounded (req-slot arg) |
| `FirstTrackNumberEnqueued` | ui4 argument | A_ARG_TYPE_TrackNumber-domain value / impl-bounded (req-slot arg) |

- **`NumTracksAdded`** — number of tracks successfully added
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`NewQueueLength`** — queue length after the operation
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`NewUpdateID`** — queue update id after the operation
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`FirstTrackNumberEnqueued`** — index actually assigned to the first enqueued track
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10464f34 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, out-arg write×4, commit×1); member delegates: r5 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10464f34 — req-vfunc call map: {'0x14': 1, '0x24': 4, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r5 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10464f34 — member vfunc calls: \['r5 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r5 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r5 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10464f34 — no transition-literal/store pattern; member delegates: \['r5 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10464f34 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10464f34 — commit/fault slot usage: {'0x14': 1, '0x24': 4, '0xc': 1}

</details>


#### Errors

**`vret`** `strong`

delegates to queue-engine object *(svc+0x128) vfunc +0xd8; queue-engine vfunc on resolved engine vtable 0x10e97d30; concrete code set is the engine worker's return domain; impl = 7-insn forwarder

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


#### Notes

Enqueued URIs pass the f_104634c4 playlist classifier: asx/wax/wmx, m3u8/m3u, pls, wpl, x-file-cifs:// and .rsq suffixes are auto-detected and expanded by format-specific parser workers (f_10461e04/f_10462c80/f_10463164/f_10462f54/f_10460814); plain URIs enqueue directly.

<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10464f34`
- dispatch entry `0x10ed19ec`
- impl call `0x10464fa0` obj `r5-in` slot `44` arg4 `sp-0x40`
- impl call `0x10464fbc` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x2c)`
- impl call `0x10464ffc` obj `0x0` slot `36` arg4 `FirstTrackNumberEnqueued`
- req vcall `0x10465084` slot `12` (commit)

- fn 0x10464f34 @ 0x10464f34 — action wrapper handler
- @ 0x10ed19ec — action dispatch table entry

</details>

### `AddURI`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Adds a single track (+DIDL-Lite metadata) to the queue at DesiredFirstTrackNumberEnqueued (or after the current track with EnqueueAsNext). Returns its position, count added and the new UpdateID.

**Technical description:** Enqueues one track into an explicit queue. Wrapper parses QueueID (int), UpdateID (int), EnqueuedURI (string, cap 0x401), EnqueuedURIMetaData (cap 0x1001), DesiredFirstTrackNumberEnqueued (int), EnqueueAsNext (bool byte), then calls impl->v\[+0x8\](impl, QueueID, UpdateID, &URI, &MD, DesiredFirst, EnqueueAsNext, &out1,&out2,&out3,&out4) on the queue-manager — rc==0 emits the four outputs, nonzero goes to req->v\[+0x14\] as a SOAP fault. This is the Queue-service twin of AVTransport.AddURIToQueue but keyed by explicit QueueID.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `QueueID` | SonosStringArg | yes | u32 queue selector validated by the engine worker against its queue table / length-bounded by parse-helper buffer cap | none - required argument |
| `UpdateID` | SonosStringArg | yes | client-held queue UpdateID; stale -> worker rejects (mismatch semantics in engine worker) / length-bounded by parse-helper buffer cap | none - required argument |
| `EnqueuedURI` | SonosUriArg | yes | any URI <= cap; playlist extensions auto-expanded via f_104634c4 / max 1024 chars | none - required argument |
| `EnqueuedURIMetaData` | SonosMetaDataArg | yes | object-id / metadata string <= parse cap / max 4096 chars | none - required argument |
| `DesiredFirstTrackNumberEnqueued` | SonosUintArg | yes | u32 index/count; engine worker bounds-checks against the queue record / parsed u32; worker-clamped | none - required argument |
| `EnqueueAsNext` | SonosBoolArg | yes | 0 or 1 / {0,1} | none - required argument |

- **`QueueID`** — Identifier of the target queue in the manager registry — explicit, unlike the implicit AVTransport queue.
  - buffer cap: `0x18`
- **`UpdateID`** — Optimistic-concurrency token for the queue; 0 typically skips the check (family convention), nonzero must match.
  - buffer cap: `0x18`
- **`EnqueuedURI`** — Track URI, parsed into a 0x401-byte buffer.
  - buffer cap: `0x401`
- **`EnqueuedURIMetaData`** — DIDL metadata, parsed into a 0x1001-byte buffer.
  - buffer cap: `0x1001`
- **`DesiredFirstTrackNumberEnqueued`** — Requested insertion position.
  - buffer cap: `0x18`
- **`EnqueueAsNext`** — Boolean parsed by f_10561444 requesting next-track insertion.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `FirstTrackNumberEnqueued` | unsigned int32 | queue position actually used by the worker / 0..queue length+1 |
| `NumTracksAdded` | unsigned int32 | count of entries actually enqueued by the worker/expansion / 0..N |
| `NewQueueLength` | unsigned int32 | track count of the queue after mutation / {0,1} |
| `NewUpdateID` | unsigned int32 | post-mutation queue UpdateID / length-bounded by parse-helper buffer cap |

- **`FirstTrackNumberEnqueued`** — Written by the queue-manager impl on success.
  - validation: worker insert result
- **`NumTracksAdded`** — Written by the queue-manager impl on success.
  - validation: worker-written count
- **`NewQueueLength`** — Written by the queue-manager impl on success.
  - validation: written from the queue record length
- **`NewUpdateID`** — Written by the queue-manager impl on success.
  - validation: copied from the queue-record update counter

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x1046453c — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×6, out-arg write×4, validate×1, commit×1); member delegates: r30 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x1046453c — req-vfunc call map: {'0x1c': 6, '0x8': 1, '0x14': 1, '0x24': 4, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x1046453c — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x1046453c — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1046453c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1046453c — commit/fault slot usage: {'0x1c': 6, '0x8': 1, '0x14': 1, '0x24': 4, '0xc': 1}

</details>


#### Errors

**`vret(r5-in,+0x8)`** `strong`

worker f_102b6948 exit r30 - no literal defs; rc fully call-derived (enqueue chain)

- the impl vfunc produced a code not covered by the gates


**Bounded unknown — proven:** literal exits bounded
**Bounded unknown — unresolved:** call-derived worker rc

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


#### Notes

Enqueued URIs pass the f_104634c4 playlist classifier: asx/wax/wmx, m3u8/m3u, pls, wpl, x-file-cifs:// and .rsq suffixes are auto-detected and expanded by format-specific parser workers (f_10461e04/f_10462c80/f_10463164/f_10462f54/f_10460814); plain URIs enqueue directly.

<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1046453c`
- dispatch entry `0x10ed19f8`
- impl call `0x104646b8` obj `r5-in` slot `8` arg4 `*(sp-0x1460+0x28)`
- impl call `0x104647ac` obj `*(sp-0x1460+0x145c)` slot `12` arg4 `?`
- req vcall `0x10464654` slot `8` (parse)

- fn 0x1046453c @ 0x1046453c — action wrapper handler
- @ 0x10ed19f8 — action dispatch table entry

</details>

### `AttachQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Attaches to a queue owned by QueueOwnerID, returning the QueueID to use in subsequent calls plus the owner context.

**Technical description:** Attaches to an existing queue, returning QueueID and QueueOwnerContext. Note obj=r4-in — the dispatcher binds a different impl member for this action. impl is the queue-manager object (r5-in); the action invokes impl->v\[+0x1c\](impl, args...) under the standard wrapper convention; QueueID selects the target queue in the registry, UpdateID is the optimistic-concurrency token (NewUpdateID is returned on mutation success). Worker semantics inside the queue-manager vfunc are unresolved.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `QueueOwnerID` | SonosStringArg | yes | impl-side grammar applies / max 255 chars | none - required argument |

- **`QueueOwnerID`** — queue owner identifier
  - validation: consumed by the impl vfunc

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `QueueID` | unsigned int32 | queue selector assigned by the engine create path / length-bounded by parse-helper buffer cap |
| `QueueOwnerContext` | SonosStringArg | owner context recorded at attach time / length-bounded by parse-helper buffer cap |

- **`QueueID`** — Written by the queue-manager impl on success.
  - validation: engine-assigned
- **`QueueOwnerContext`** — Written by the queue-manager impl on success.
  - validation: echoed from the queue record

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x104647b8 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×2, validate×1, commit×1); member delegates: r30 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x104647b8 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x104647b8 — member vfunc calls: \['r30 v\[+0xc\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0xc\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x104647b8 — no transition-literal/store pattern; member delegates: \['r30 v\[+0xc\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x104647b8 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x104647b8 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`vret`** `strong`

worker f_102b2da4 - exit producer not r3-adjacent; rc fully call-derived

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** literal exits bounded
**Bounded unknown — unresolved:** call-derived worker rc

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


#### Notes

Enqueued URIs pass the f_104634c4 playlist classifier: asx/wax/wmx, m3u8/m3u, pls, wpl, x-file-cifs:// and .rsq suffixes are auto-detected and expanded by format-specific parser workers (f_10461e04/f_10462c80/f_10463164/f_10462f54/f_10460814); plain URIs enqueue directly.

<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x104647b8`
- dispatch entry `0x10ed1a04`
- impl call `0x104647f8` obj `r4-in` slot `28` arg4 `QueueOwnerID`
- impl call `0x10464818` obj `r4-in` slot `8` arg4 `?`
- impl call `0x10464844` obj `r5-in` slot `12` arg4 `sp-0x514`
- impl call `0x10464860` obj `r4-in` slot `20` arg4 `vret(r5-in,+0xc)`
- impl call `0x104648e8` obj `vret(*(sp-0x530+0x52c),+0x24)` slot `16` arg4 `sp+0x11c`
- req vcall `0x104648fc` slot `12` (commit)

- fn 0x104647b8 @ 0x104647b8 — action wrapper handler
- @ 0x10ed1a04 — action dispatch table entry

</details>

### `Backup`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Persists the queue registry to flash (trackqueue.rsq) so queues survive reboot.

**Technical description:** Backs up queue state — the service-level analogue of AVTransport.BackupQueue (trackqueue.rsq persistence). impl is the queue-manager object (r5-in); the action invokes impl->v\[+0x10\](impl, args...) under the standard wrapper convention; QueueID selects the target queue in the registry, UpdateID is the optimistic-concurrency token (NewUpdateID is returned on mutation success). Worker semantics inside the queue-manager vfunc are unresolved.

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10465660 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, commit×1); member delegates: r5 v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x10465660 — req-vfunc call map: {'0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r5 v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x10465660 — member vfunc calls: \['r5 v\[+0x10\]'\]

</details>


#### Side effects

- state-mutation delegate: r5 v\[+0x10\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r5 v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x10465660 — no transition-literal/store pattern; member delegates: \['r5 v\[+0x10\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10465660 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10465660 — commit/fault slot usage: {'0x14': 1, '0xc': 1}

</details>


#### Errors

**`vret(r5-in,+0x10)`** `strong`

nonzero worker rc surfaced verbatim; recovered domain: 800 preloaded on path-builder failure (0x102bd338); callee rc forwarded from the persistence path

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10465660`
- dispatch entry `0x10ed1a10`
- impl call `0x10465684` obj `r5-in` slot `16` arg4 `r4-in`
- impl call `0x104656cc` obj `*(*(r4-in+0x0)+0x14)` slot `12` arg4 `vret(r5-in,+0x10)`
- impl f_1046593c unconditionally returns 0x320. Dead-action semantics: every structurally valid call reaches the impl and faults with the fixed code; malformed requests can still fail earlier inside the wrapper (402 gate).

- fn 0x10465660 @ 0x10465660 — action wrapper handler
- @ 0x10ed1a10 — action dispatch table entry
- @ 0x1046593c — impl vfunc: li r3,0x320; blr

</details>

### `Browse`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reads back a queue's contents: starting at StartingIndex, up to RequestedCount tracks, returned as a DIDL-Lite Result document with NumberReturned/TotalMatches and the queue's UpdateID.

**Technical description:** Browses a queue's contents. impl is the queue-manager object (r5-in); the action invokes impl->v\[+0x28\](impl, args...) under the standard wrapper convention; QueueID selects the target queue in the registry, UpdateID is the optimistic-concurrency token (NewUpdateID is returned on mutation success). Worker semantics inside the queue-manager vfunc are unresolved.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `QueueID` | request field | yes | impl-defined / per the parser/emitter | none |
| `StartingIndex` | request field | yes | impl-defined / per the parser/emitter | none |
| `RequestedCount` | request field | yes | impl-defined / per the parser/emitter | none |

- **`QueueID`** — browse parameter parsed by f_105614e0 inside impl f_10466280
  - validation: arg-name string 'in' loaded at 0x104662b8 inside f_10466280
- **`StartingIndex`** — browse parameter parsed by f_105614e0 inside impl f_10466280
  - validation: arg-name string 'in' loaded at 0x104662d8 inside f_10466280
- **`RequestedCount`** — browse parameter parsed by f_105614e0 inside impl f_10466280
  - validation: arg-name string 'in' loaded at 0x104662fc inside f_10466280

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Result` | response field | impl-produced / per the parser/emitter |
| `NumberReturned` | response field | impl-produced / per the parser/emitter |
| `TotalMatches` | response field | impl-produced / per the parser/emitter |
| `UpdateID` | response field | impl-produced / per the parser/emitter |

- **`Result`** — browse result field emitted via f_10560608 inside impl f_10466280
  - validation: arg-name string 'out' loaded at 0x10466434 inside f_10466280
- **`NumberReturned`** — browse result field emitted via f_10560608 inside impl f_10466280
  - validation: arg-name string 'out' loaded at 0x10466494 inside f_10466280
- **`TotalMatches`** — browse result field emitted via f_10560608 inside impl f_10466280
  - validation: arg-name string 'out' loaded at 0x104664b8 inside f_10466280
- **`UpdateID`** — browse result field emitted via f_10560608 inside impl f_10466280
  - validation: arg-name string 'out' loaded at 0x104664dc inside f_10466280

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10464200 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (none); member delegates: r4 v\[+0x3c\]
<details><summary>Evidence (1)</summary>

- fn 0x10464200 — req-vfunc call map: {}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x3c\]
<details><summary>Evidence (1)</summary>

- fn 0x10464200 — member vfunc calls: \['r4 v\[+0x3c\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x3c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x3c\]
<details><summary>Evidence (1)</summary>

- fn 0x10464200 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x3c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10464200 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10464200 — commit/fault slot usage: {}

</details>


#### Errors

**`vret`** `strong`

nonzero worker rc surfaced verbatim; recovered domain: 402 on arg-record failures; browse-op rc forwarded (DIDL emission path)

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** queue-manager impl->v\[+0x28\] rc surfaced
**Bounded unknown — unresolved:** concrete rc vocabulary for this queue operation

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10464200`
- dispatch entry `0x10ed1a1c`
- impl call `0x10464250` obj `r5-in` slot `40` arg4 `?`
- req vcall `0x10464228` slot `60` (other)

- fn 0x10464200 @ 0x10464200 — action wrapper handler
- @ 0x10ed1a1c — action dispatch table entry

</details>

### `CreateQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Creates a new queue owned by QueueOwnerID with a policy (QueuePolicy), returning its QueueID.

**Technical description:** Creates a new queue owned by QueueOwnerID/QueueOwnerContext with QueuePolicy, returning the new QueueID. impl is the queue-manager object (r5-in); the action invokes impl->v\[+0x14\](impl, args...) under the standard wrapper convention; QueueID selects the target queue in the registry, UpdateID is the optimistic-concurrency token (NewUpdateID is returned on mutation success). Worker semantics inside the queue-manager vfunc are unresolved.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `QueueOwnerID` | SonosStringArg | yes | context string <= parse cap; recorded in the queue record / max 256 chars | none - required argument |
| `QueueOwnerContext` | SonosStringArg | yes | context string <= parse cap; recorded in the queue record / max 1024 chars | none - required argument |
| `QueuePolicy` | SonosStringArg | yes | context string <= parse cap; recorded in the queue record / max 1024 chars | none - required argument |

- **`QueueOwnerID`** — Forwarded to the queue-manager impl vfunc.
  - buffer cap: `0x101`
- **`QueueOwnerContext`** — Forwarded to the queue-manager impl vfunc.
  - buffer cap: `0x401`
- **`QueuePolicy`** — Forwarded to the queue-manager impl vfunc.
  - buffer cap: `0x401`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `QueueID` | unsigned int32 | queue selector assigned by the engine create path / length-bounded by parse-helper buffer cap |

- **`QueueID`** — Written by the queue-manager impl on success.
  - validation: engine-assigned

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10464bd0 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, out-arg write×1, validate×1, commit×1); member delegates: r29 v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x10464bd0 — req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r29 v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x10464bd0 — member vfunc calls: \['r29 v\[+0x14\]'\]

</details>


#### Side effects

- state-mutation delegate: r29 v\[+0x14\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r29 v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x10464bd0 — no transition-literal/store pattern; member delegates: \['r29 v\[+0x14\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10464bd0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10464bd0 — commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`vret(r5-in,+0x14)`** `strong`

worker f_102dff24 exit accumulator r30 proven {402 x2 (0x102dff64/0x102e00f0), 0 (0x102e0050)} - fully bounded, no call-derived exits

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10464bd0`
- dispatch entry `0x10ed1a28`
- impl call `0x10464ccc` obj `r5-in` slot `20` arg4 `sp-0x920`
- impl call `0x10464d5c` obj `*(sp-0x940+0x93c)` slot `12` arg4 `?`
- req vcall `0x10464ca0` slot `8` (parse)

- fn 0x10464bd0 @ 0x10464bd0 — action wrapper handler
- @ 0x10ed1a28 — action dispatch table entry

</details>

### `RemoveAllTracks`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Empties the queue; UpdateID-guarded.

**Technical description:** Removes all tracks from the queue identified by QueueID — explicit-id twin of AVTransport.RemoveAllTracksFromQueue; returns NewUpdateID. impl is the queue-manager object (r5-in); the action invokes impl->v\[+0x18\](impl, args...) under the standard wrapper convention; QueueID selects the target queue in the registry, UpdateID is the optimistic-concurrency token (NewUpdateID is returned on mutation success). Worker semantics inside the queue-manager vfunc are unresolved.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `QueueID` | SonosStringArg | yes | u32 queue selector validated by the engine worker against its queue table / length-bounded by parse-helper buffer cap | none - required argument |
| `UpdateID` | SonosStringArg | yes | client-held queue UpdateID; stale -> worker rejects (mismatch semantics in engine worker) / length-bounded by parse-helper buffer cap | none - required argument |

- **`QueueID`** — Target queue in the manager registry (explicit, unlike the implicit AVTransport queue).
  - buffer cap: `0x18`
- **`UpdateID`** — Optimistic-concurrency token; nonzero must match the queue's current update-id (family convention; 0 skips).
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NewUpdateID` | unsigned int32 | post-mutation queue UpdateID / length-bounded by parse-helper buffer cap |

- **`NewUpdateID`** — Written by the queue-manager impl on success.
  - validation: copied from the queue-record update counter

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10464908 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x10464908 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x10464908 — member vfunc calls: \['r30 v\[+0x18\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x18\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x10464908 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x18\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10464908 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10464908 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`vret(r5-in,+0x18)`** `strong`

worker f_102b3a84: r28 accumulator arg-seeded (r4) + literal {718 (0x102b3b88), 1028 (0x102b3be0)}; AVT session lock pair wraps the op

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** literal exits bounded
**Bounded unknown — unresolved:** call-derived worker rc

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10464908`
- dispatch entry `0x10ed1a34`
- impl call `0x104649b0` obj `r5-in` slot `24` arg4 `*(sp-0x30+0x10)`
- impl call `0x10464a38` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x10464988` slot `8` (parse)

- fn 0x10464908 @ 0x10464908 — action wrapper handler
- @ 0x10ed1a34 — action dispatch table entry

</details>

### `RemoveTrackRange`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Removes NumberOfTracks consecutive tracks starting at StartingIndex; returns NewUpdateID.

**Technical description:** Removes a contiguous range from QueueID — explicit-id twin of AVTransport.RemoveTrackRangeFromQueue (same 1-based UpdateID concurrency family); returns NewUpdateID. impl is the queue-manager object (r5-in); the action invokes impl->v\[+0x1c\](impl, args...) under the standard wrapper convention; QueueID selects the target queue in the registry, UpdateID is the optimistic-concurrency token (NewUpdateID is returned on mutation success). Worker semantics inside the queue-manager vfunc are unresolved.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `QueueID` | SonosStringArg | yes | u32 queue selector validated by the engine worker against its queue table / length-bounded by parse-helper buffer cap | none - required argument |
| `UpdateID` | SonosStringArg | yes | client-held queue UpdateID; stale -> worker rejects (mismatch semantics in engine worker) / length-bounded by parse-helper buffer cap | none - required argument |
| `StartingIndex` | SonosUintArg | yes | u32 index/count; engine worker bounds-checks against the queue record / parsed u32; worker-clamped | none - required argument |
| `NumberOfTracks` | SonosUintArg | yes | u32 index/count; engine worker bounds-checks against the queue record / parsed u32; worker-clamped | none - required argument |

- **`QueueID`** — Target queue in the manager registry (explicit, unlike the implicit AVTransport queue).
  - buffer cap: `0x18`
- **`UpdateID`** — Optimistic-concurrency token; nonzero must match the queue's current update-id (family convention; 0 skips).
  - buffer cap: `0x18`
- **`StartingIndex`** — Forwarded to the queue-manager impl vfunc.
  - buffer cap: `0x18`
- **`NumberOfTracks`** — Forwarded to the queue-manager impl vfunc.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NewUpdateID` | unsigned int32 | post-mutation queue UpdateID / length-bounded by parse-helper buffer cap |

- **`NewUpdateID`** — Written by the queue-manager impl on success.
  - validation: copied from the queue-record update counter

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10464a44 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×4, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x1c\]
<details><summary>Evidence (1)</summary>

- fn 0x10464a44 — req-vfunc call map: {'0x1c': 4, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x1c\]
<details><summary>Evidence (1)</summary>

- fn 0x10464a44 — member vfunc calls: \['r30 v\[+0x1c\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x1c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x1c\]
<details><summary>Evidence (1)</summary>

- fn 0x10464a44 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x1c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10464a44 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10464a44 — commit/fault slot usage: {'0x1c': 4, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`vret(r5-in,+0x1c)`** `strong`

literal gate: r6==0 -> 402 (0x102b3960); else b-tail into worker at 0x102b396c (derived)

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** literal exits bounded
**Bounded unknown — unresolved:** call-derived worker rc

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10464a44`
- dispatch entry `0x10ed1a40`
- impl call `0x10464b3c` obj `r5-in` slot `28` arg4 `*(sp-0x40+0x18)`
- impl call `0x10464bc4` obj `*(sp-0x40+0x3c)` slot `12` arg4 `?`
- req vcall `0x10464b0c` slot `8` (parse)

- fn 0x10464a44 @ 0x10464a44 — action wrapper handler
- @ 0x10ed1a40 — action dispatch table entry

</details>

### `ReorderTracks`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Moves a run of tracks to InsertBefore within the queue; UpdateID-guarded.

**Technical description:** Reorders a block within QueueID — explicit-id twin of AVTransport.ReorderTracksInQueue; returns NewUpdateID. impl is the queue-manager object (r5-in); the action invokes impl->v\[+0x20\](impl, args...) under the standard wrapper convention; QueueID selects the target queue in the registry, UpdateID is the optimistic-concurrency token (NewUpdateID is returned on mutation success). Worker semantics inside the queue-manager vfunc are unresolved.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `QueueID` | SonosStringArg | yes | u32 queue selector validated by the engine worker against its queue table / length-bounded by parse-helper buffer cap | none - required argument |
| `StartingIndex` | SonosUintArg | yes | u32 index/count; engine worker bounds-checks against the queue record / parsed u32; worker-clamped | none - required argument |
| `NumberOfTracks` | SonosUintArg | yes | u32 index/count; engine worker bounds-checks against the queue record / parsed u32; worker-clamped | none - required argument |
| `InsertBefore` | SonosStringArg | yes | u32 position before which the reordered block is inserted; bounds-checked by worker f_102accf0 / length-bounded by parse-helper buffer cap | none - required argument |
| `UpdateID` | SonosStringArg | yes | client-held queue UpdateID; stale -> worker rejects (mismatch semantics in engine worker) / length-bounded by parse-helper buffer cap | none - required argument |

- **`QueueID`** — Target queue in the manager registry (explicit, unlike the implicit AVTransport queue).
  - buffer cap: `0x18`
- **`StartingIndex`** — Forwarded to the queue-manager impl vfunc.
  - buffer cap: `0x18`
- **`NumberOfTracks`** — Forwarded to the queue-manager impl vfunc.
  - buffer cap: `0x18`
- **`InsertBefore`** — Forwarded to the queue-manager impl vfunc.
  - buffer cap: `0x18`
- **`UpdateID`** — Optimistic-concurrency token; nonzero must match the queue's current update-id (family convention; 0 skips).
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NewUpdateID` | unsigned int32 | post-mutation queue UpdateID / length-bounded by parse-helper buffer cap |

- **`NewUpdateID`** — Written by the queue-manager impl on success.
  - validation: copied from the queue-record update counter

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10464d68 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×5, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10464d68 — req-vfunc call map: {'0x1c': 5, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10464d68 — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10464d68 — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10464d68 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10464d68 — commit/fault slot usage: {'0x1c': 5, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`vret(r5-in,+0x20)`** `strong`

literal gate: r5==0 -> 402 (0x102b3930); else b-tail into worker at 0x102b393c (derived)

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** literal exits bounded
**Bounded unknown — unresolved:** call-derived worker rc

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10464d68`
- dispatch entry `0x10ed1a4c`
- impl call `0x10464e9c` obj `r5-in` slot `32` arg4 `*(sp-0x40+0x14)`
- impl call `0x10464f28` obj `*(sp-0x40+0x3c)` slot `12` arg4 `?`
- req vcall `0x10464e68` slot `8` (parse)

- fn 0x10464d68 @ 0x10464d68 — action wrapper handler
- @ 0x10ed1a4c — action dispatch table entry

</details>

### `ReplaceAllTracks`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Atomically replaces the whole queue contents: new tracks from ContainerURI/ContainerMetaData plus packed EnqueuedURIsAndMetaData, with CurrentTrackIndex/NewCurrentTrackIndices pointing at what should be playing. Bulk transfer - no per-arg capacity limits.

**Technical description:** Replaces a queue's entire contents; returns NewUpdateID. impl is the queue-manager object (r5-in); the action invokes impl->v\[+0x30\](impl, args...) under the standard wrapper convention; QueueID selects the target queue in the registry, UpdateID is the optimistic-concurrency token (NewUpdateID is returned on mutation success). The impl vfunc is a forwarder into the shared queue-engine object *(svc+0x128) on engine vtable 0x10e97d30; the concrete enqueue/replace logic lives in that engine vfunc (bounded by worker exit-scan).

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `QueueID` | ui4 argument | yes | A_ARG_TYPE_QueueID-domain value / impl-bounded (req-slot arg) | none |
| `UpdateID` | ui4 argument | yes | A_ARG_TYPE_UpdateID-domain value / impl-bounded (req-slot arg) | none |
| `ContainerURI` | string argument | yes | A_ARG_TYPE_URI-domain value / impl-bounded (req-slot arg) | none |
| `ContainerMetaData` | string argument | yes | A_ARG_TYPE_URIMetaData-domain value / impl-bounded (req-slot arg) | none |
| `CurrentTrackIndex` | ui4 argument | yes | A_ARG_TYPE_TrackNumber-domain value / impl-bounded (req-slot arg) | none |
| `NewCurrentTrackIndices` | string argument | yes | A_ARG_TYPE_TrackNumbersCSV-domain value / impl-bounded (req-slot arg) | none |
| `NumberOfURIs` | ui4 argument | yes | A_ARG_TYPE_NumTracks-domain value / impl-bounded (req-slot arg) | none |
| `EnqueuedURIsAndMetaData` | string argument | yes | A_ARG_TYPE_LIST_URI_AND_METADATA-domain value / impl-bounded (req-slot arg) | none |

- **`QueueID`** — target queue id
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`UpdateID`** — optimistic-concurrency update id
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`ContainerURI`** — the container (album/playlist/service) the replaced tracks belong to — re-binds the queue to its content container
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`ContainerMetaData`** — container DIDL-Lite metadata
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentTrackIndex`** — current playing track index
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`NewCurrentTrackIndices`** — CSV of new track indices
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`NumberOfURIs`** — count of URIs in EnqueuedURIsAndMetaData
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`EnqueuedURIsAndMetaData`** — list-of-URI-and-metadata blob (per-track URI+metadata pairs)
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NewUpdateID` | ui4 argument | UpdateID-domain value / impl-bounded (req-slot arg) |
| `NewQueueLength` | ui4 argument | A_ARG_TYPE_NumTracks-domain value / impl-bounded (req-slot arg) |

- **`NewUpdateID`** — queue update id after the operation
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`NewQueueLength`** — queue length after the operation
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10465090 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, out-arg write×2, commit×1); member delegates: r5 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10465090 — req-vfunc call map: {'0x14': 1, '0x24': 2, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r5 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10465090 — member vfunc calls: \['r5 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r5 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r5 v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10465090 — no transition-literal/store pattern; member delegates: \['r5 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10465090 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10465090 — commit/fault slot usage: {'0x14': 1, '0x24': 2, '0xc': 1}

</details>


#### Errors

**`vret`** `strong`

delegates to queue-engine object *(svc+0x128) vfunc +0xdc; queue-engine vfunc on resolved engine vtable 0x10e97d30; concrete code set is the engine worker's return domain

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10465090`
- dispatch entry `0x10ed1a58`
- impl call `0x104650f4` obj `r5-in` slot `48` arg4 `sp-0x38`
- impl call `0x10465110` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x30)`
- impl call `0x10465150` obj `0x0` slot `36` arg4 `NewQueueLength`
- req vcall `0x10465190` slot `12` (commit)

- fn 0x10465090 @ 0x10465090 — action wrapper handler
- @ 0x10ed1a58 — action dispatch table entry

</details>

### `SaveAsSonosPlaylist`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Saves the queue as a Sonos playlist (Title); ObjectID selects an existing playlist to overwrite. Returns AssignedObjectID.

**Technical description:** Saves QueueID as a Sonos playlist under Title/ObjectID — explicit-id twin of AVTransport.SaveQueue; returns AssignedObjectID. impl is the queue-manager object (r5-in); the action invokes impl->v\[+0x24\](impl, args...) under the standard wrapper convention; QueueID selects the target queue in the registry, UpdateID is the optimistic-concurrency token (NewUpdateID is returned on mutation success). Worker semantics inside the queue-manager vfunc are unresolved.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `QueueID` | SonosStringArg | yes | u32 queue selector validated by the engine worker against its queue table / length-bounded by parse-helper buffer cap | none - required argument |
| `Title` | SonosStringArg | yes | display title <= parse cap; newline rejected -> 402 (engine worker) / max 1023 chars | none - required argument |
| `ObjectID` | SonosStringArg | yes | object-id / metadata string <= parse cap / max 1023 chars | none - required argument |

- **`QueueID`** — Target queue in the manager registry (explicit, unlike the implicit AVTransport queue).
  - buffer cap: `0x18`
- **`Title`** — Playlist title (SaveQueue-family trimming rules may apply inside the impl).
  - buffer cap: `0x400`
- **`ObjectID`** — Saved-queue object id / parent selector.
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `AssignedObjectID` | SonosStringArg | sq:-family object id assigned by the saved-queue store / length-bounded by parse-helper buffer cap |

- **`AssignedObjectID`** — Written by the queue-manager impl on success.
  - validation: store-assigned

#### Validation `confirmed`

Wrapper-proven: args parsed via req->v\[+0x1c\] named lookup + typed helpers; impl call via impl->v\[slot\]; rc==0 -> emit, else fault through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x104643c0 — wrapper decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×3, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x24\]
<details><summary>Evidence (1)</summary>

- fn 0x104643c0 — req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x24\]
<details><summary>Evidence (1)</summary>

- fn 0x104643c0 — member vfunc calls: \['r30 v\[+0x24\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x24\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x24\]
<details><summary>Evidence (1)</summary>

- fn 0x104643c0 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x24\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x104643c0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x104643c0 — commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`vret(r5-in,+0x24)`** `strong`

literal gate: r4!=0 -> 800 (0x10465f88); r4==0 -> engine vfunc +0x7c on *(svc+0x128)

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** literal exits bounded
**Bounded unknown — unresolved:** call-derived worker rc

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input argument at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x104643c0`
- dispatch entry `0x10ed1a64`
- impl call `0x1046449c` obj `r5-in` slot `36` arg4 `*(sp-0xc30+0x18)`
- impl call `0x1046451c` obj `vret(*(sp-0xc30+0xc2c),+0x24)` slot `16` arg4 `sp+0x81c`
- impl call `0x10464530` obj `*(sp-0xc30+0xc2c)` slot `12` arg4 `?`
- req vcall `0x1046446c` slot `8` (parse)

- fn 0x104643c0 @ 0x104643c0 — action wrapper handler
- @ 0x10ed1a64 — action dispatch table entry

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `QueueOwnerID` | %.20s-ish string (val="%s") | yes | queue owner UDN |
| `QueueID` | string max 20 chars (val="%.20s") | yes | queue identifier assigned at AttachQueue/CreateQueue |
| `UpdateID` | u32 (val="%u") | yes | queue content update id |
| `Curated` | string/bool (val=) | yes | curated-queue flag |
| `LastChange` | string | yes | evented state variable — appears in Queue LastChange/GENA event notifications |
| `A_ARG_TYPE_UpdateID` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_QueueID` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_QueueOwnerID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_QueueOwnerContext` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_QueuePolicy` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_URI` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_LIST_URI` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_URIMetaData` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ObjectID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TrackNumber` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_NumTracks` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_EnqueueAsNext` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_SavedQueueTitle` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Index` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Count` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Result` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TrackNumbersCSV` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_LIST_URI_AND_METADATA` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |

## Events

- **Mechanism:** UPnP GENA NOTIFY; custom Sonos Queue namespace (not standard UPnP metadata-1-0)
- **Namespace:** urn:schemas-sonos-com:metadata-1-0/Queue/
- **notes:** Queue uses its own event vocabulary rather than a LastChange blob: QueueOwnerID/QueueID/UpdateID/Curated elements
- **notify_path:** f_10465b54 Queue event emitter using template 0x10ed1c6c (Queue svc region, near svc ctor f_104656d0)

## Dispatcher-level errors

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search


## Notes

None Impl provenance: *(svc+4) resolves to the queue-manager singleton at global 0x11096770 (the same `this` pointer passed to all 0x1047xxxx saved-queue workers by the AVTransport impl shims at 0x102bd048/0x102bd140/0x102bd238). Companion global 0x11096774 holds a refcounted session token: *(token+4) is atomically incremented (stwcx.) before each worker call and released with f_100c5050 afterwards; a null token degrades to a plain tail call. Queue-manager vtable resolved: 0x10ed1bcc (ctor f_10465fac, log tag Queue). All action vfuncs +0x08..+0x30 forward to the shared queue engine at *(qm+0x128) - the same engine workers AVTransport queue ops use (f_102b6948 AddURI, f_102b3a84 RemoveAllTracks): the two services are SOAP facades over one queue engine. All four playlist-format workers share one skeleton: playlist log tag + iterateXxxPlayList %s, fetch through the stream abstraction (f_10545064 open / f_10546520 read / f_1054103c close), per-entry job submission on shared delegate machinery. Formats: ASX (asx/wax/wmx), M3U (m3u8/m3u), PLS, WPL (logged as WLP).

Implementation sources (recovered): `zoneplayer/tqueue.cxx`, `zoneplayer/spotify/spotify_queue.cxx`

<details><summary>Service evidence (4)</summary>

- @ 0x101953c8 — service router function
- @ 0x10ed19a8 — service vtable
- @ 0x10464268 — service dispatcher
- @ 0x102bd0a4 — saved-queue shim loads singleton 0x11096770 as worker `this`

</details>
