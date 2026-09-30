# `AVTransport` — `/MediaRenderer/AVTransport/Control`

**visibility** `advertised` · **status** `strong`

The playback engine of the zone - the largest service. Covers transport control (Play/Pause/Stop/Next/Previous), seeking, source selection via URIs and metadata, play modes and crossfade, the implicit playback queue (add/remove/reorder/clear), saved queues, group coordination transfer (one player handing the coordinator role to another, with full state snapshots), alarms/sleep timers, and Sonos-specific extras like autoplay and direct-control sessions. InstanceID is always 0. Many mutating actions take UpdateID for optimistic concurrency: pass the last queue UpdateID you saw and the call fails if the queue changed underneath you.

**Technical description:** UPnP AVTransport service implemented by the chsrc/transport engine object (*(svc+4)). Impl vfuncs live in a large vtable (A=0x10eaf2ec standalone, B=0x10edfbb8 group-aware; identical except SetAVTransportURI and the three Become*Coordinator* ops). All impls serialize on mutex impl+0x458 and dispatch on the transport-source mode enum at impl+0x4654: 2=indexed/queue (requests submitted to impl+0x580 via f_10255f64/f_10256a84), others reach the streamer session at impl+0x5a0 via op-0x19 submission f_102aff9c on impl+0x5dc.

## Availability

- status `strong`
- capability flags `0x2000`
- enabled gate: `xor(*(r3-in+0x571c))` at `0x10195684` (field_inverted)
- Registered unconditionally at zoneplayer init (ctor f_102fc9c0 for the svc wrapper at ctx+off). Whether the engine impl is the A or B class depends on grouping state - unresolved selection point.

**Visibility note:** always advertised: Control+Event routes registered unconditionally in the static route table and the impl vtable is constructed unconditionally at ZP init; no feature-gate found anywhere in the service-registration path (same pattern as other 'advertised' services)

## Dispatch

- router `0x101953c8`, cap flags `0x2000`
- dispatcher `0x102fa5c4` kind `table`
- action table `0x10eb3018`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `AddMultipleURIsToQueue` | advertised | callable | `strong` | direct | 402, 718 |
| `AddURIToQueue` | advertised | callable | `strong` | direct | 402, 718 |
| `AddURIToSavedQueue` | advertised | callable | `strong` | direct | 402, 718 |
| `BackupQueue` | advertised | callable | `strong` | direct | 402, 718, 802 |
| `BecomeCoordinatorOfStandaloneGroup` | advertised | callable | `strong` | direct | 402, 718 |
| `BecomeGroupCoordinator` | advertised | callable | `strong` | direct | 402 |
| `BecomeGroupCoordinatorAndSource` | advertised | callable | `strong` | direct | 402 |
| `ChangeCoordinator` | advertised | callable | `strong` | direct | 402, 718, 800 |
| `ChangeTransportSettings` | advertised | callable | `strong` | direct | 402, 718, 800 |
| `ConfigureSleepTimer` | advertised | callable | `strong` | direct | 402, 718, 800 |
| `CreateSavedQueue` | advertised | callable | `strong` | direct | 402, 718 |
| `DelegateGroupCoordinationTo` | advertised | callable | `strong` | direct | 402, 718 |
| `EndDirectControlSession` | advertised | callable | `strong` | direct | 402, 718 |
| `GetCrossfadeMode` | advertised | callable | `strong` | direct | 402, 718 |
| `GetCurrentTransportActions` | advertised | callable | `strong` | direct | 718 |
| `GetDeviceCapabilities` | advertised | callable | `strong` | direct | 402, 718 |
| `GetMediaInfo` | advertised | callable | `strong` | direct | 402, 718 |
| `GetPositionInfo` | advertised | callable | `strong` | direct | 402, 718 |
| `GetRemainingSleepTimerDuration` | advertised | callable | `strong` | direct | 402, 718, 800 |
| `GetRunningAlarmProperties` | advertised | callable | `strong` | direct | 402, 800 |
| `GetTransportInfo` | advertised | callable | `strong` | direct | 718 |
| `GetTransportSettings` | advertised | callable | `strong` | direct | 402, 718 |
| `Next` | advertised | callable | `strong` | direct | 402, 701, 711, 718, 800 |
| `NotifyDeletedURI` | advertised | callable | `strong` | direct | 402, 718 |
| `Pause` | advertised | callable | `strong` | direct | 402, 718 |
| `Play` | advertised | callable | `strong` | direct | 402, 717, 718 |
| `Previous` | advertised | callable | `strong` | direct | 402, 701, 711, 718 |
| `RemoveAllTracksFromQueue` | advertised | callable | `strong` | direct | 402, 718 |
| `RemoveTrackFromQueue` | advertised | callable | `strong` | direct | 402, 718, 800, 1028 |
| `RemoveTrackRangeFromQueue` | advertised | callable | `strong` | direct | 402, 718, 800, 1028 |
| `ReorderTracksInQueue` | advertised | callable | `strong` | direct | 402, 718 |
| `ReorderTracksInSavedQueue` | advertised | callable | `strong` | direct | 402, 718 |
| `RunAlarm` | advertised | callable | `strong` | direct | 402, 718 |
| `SaveQueue` | advertised | callable | `strong` | direct | 402, 718, 800 |
| `Seek` | advertised | callable | `strong` | direct | 401, 402, 701, 710, 711, 718 |
| `SetAVTransportURI` | advertised | callable | `strong` | direct | 402, 718 |
| `SetCrossfadeMode` | advertised | callable | `strong` | direct | 402, 712, 718 |
| `SetNextAVTransportURI` | advertised | callable | `strong` | direct | 402, 718, 800 |
| `SetPlayMode` | advertised | callable | `strong` | direct | 402, 712, 718 |
| `SnoozeAlarm` | advertised | callable | `strong` | direct | 402, 701, 718, 800 |
| `StartAutoplay` | advertised | callable | `strong` | direct | 402, 718, 810 |
| `Stop` | advertised | callable | `strong` | direct | 402, 701, 718 |

### `AddMultipleURIsToQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Bulk-enqueues tracks into the implicit playback queue. EnqueuedURIs and EnqueuedURIMetaData are parallel lists (count must equal NumberOfURIs); DesiredFirstTrackNumberEnqueued positions them, EnqueueAsNext inserts after the current track. ContainerURI/ContainerMetaData describe the source list itself. UpdateID guards against concurrent queue edits. Returns where the tracks landed, how many were added, and the new length/UpdateID.

**Technical description:** Batch-enqueues a list of track URIs. Impl f_102b7170 is a thin 718-gate tail-calling worker f_102b7000, which runs the shared boilerplate (name string from impl+0x3dc, impl+0x458 lock, f_102a5718 submission check, f_100caad8 change emit) and walks the EnqueuedURIs list.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x68 with 718 | none - required argument |
| `UpdateID` | SonosStringArg | yes | 0 (skip) or current queue update-id / length-bounded by parse-helper buffer cap | none - required argument |
| `NumberOfURIs` | SonosUriArg | yes | 1..list size / length-bounded by parse-helper buffer cap | none - required argument |
| `EnqueuedURIs` | SonosUriArg | yes | Worker-parsed URI list / max 10249 chars | none - required argument |
| `EnqueuedURIsMetaData` | SonosMetaDataArg | yes | Worker-parsed metadata list / length-bounded by parse-helper buffer cap | none - required argument |
| `DesiredFirstTrackNumberEnqueued` | SonosUintArg | yes | u32 queue position; 0 = append at end (engine worker inserts relative to UpdateID track list) / parsed u32; worker clamps/validates against the queue record | none - required argument |
| `EnqueueAsNext` | SonosBoolArg | yes | Boolean-ish integer / {0,1} | none - required argument |
| `ContainerURI` | SonosUriArg | yes | Any string / max 1024 chars | none - required argument |
| `ContainerMetaData` | SonosMetaDataArg | yes | Any string / max 4096 chars | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`UpdateID`** — Queue update-id token consumed by the worker (optimistic concurrency family).
  - buffer cap: `0x18`
- **`NumberOfURIs`** — Count of URIs in the EnqueuedURIs list — bounds the worker's iteration.
  - buffer cap: `0x18`
- **`EnqueuedURIs`** — Semicolon/list-separated URIs consumed by the worker per the parser convention.
  - buffer cap: `0x280a`
- **`EnqueuedURIsMetaData`** — Parallel DIDL metadata list for the URIs.
  - buffer cap: `0xa00a`
- **`DesiredFirstTrackNumberEnqueued`** — Requested insertion position for the batch.
  - buffer cap: `0x18`
- **`EnqueueAsNext`** — Flag forwarded to the worker.
  - buffer cap: `0x18`
- **`ContainerURI`** — Container context for the enqueue, forwarded to the worker.
  - buffer cap: `0x401`
- **`ContainerMetaData`** — Metadata for the container, forwarded to the worker.
  - buffer cap: `0x1001`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `FirstTrackNumberEnqueued` | unsigned int32 | queue position actually used by the worker / 0..queue length+1 as applied |
| `NumTracksAdded` | unsigned int32 | count of entries actually enqueued by the worker/expansion / 0..N |
| `NewQueueLength` | unsigned int32 | "0" or "1" via bool-style parse helper; literal semantics under action validation / {0,1} |
| `NewUpdateID` | unsigned int32 | post-mutation queue UpdateID / length-bounded by parse-helper buffer cap |

- **`FirstTrackNumberEnqueued`** — Written by the enqueue worker on success.
  - validation: copied from the worker insert result
- **`NumTracksAdded`** — Written by the enqueue worker on success.
  - validation: worker-written count record
- **`NewQueueLength`** — Written by the enqueue worker on success.
  - validation: written from the queue record length after the mutation
- **`NewUpdateID`** — Written by the enqueue worker on success.
  - validation: copied from the queue-record update counter

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fb7e8 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×9, out-arg write×4, validate×1, commit×1); member delegates: r28 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb7e8 — req-vfunc call map: {'0x1c': 9, '0x8': 1, '0x14': 1, '0x24': 4, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r28 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb7e8 — member vfunc calls: \['r28 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r28 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r28 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb7e8 — no transition-literal/store pattern; member delegates: \['r28 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb7e8 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb7e8 — commit/fault slot usage: {'0x1c': 9, '0x8': 1, '0x14': 1, '0x24': 4, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`vret(r5-in,+0x68)`** `strong`

nonzero engine-insert rc surfaced verbatim; recovered domain: 718 (InstanceID!=0 or missing queue record), 0x404=1028 (insert-position mismatch), 800 (commit-op failure paths), record-write rcs via f_1014f808/f_1014fb34, 0 on success

- the worker produced a code not covered by the gate

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.; impl-side: worker f_102b7000 returns 402 on null/empty URI strings (strlen gate)

- Missing or unparseable input argument at the wrapper parse stage


#### Notes

URI arguments flow through the queue-manager singleton (0x11096770) and its f_104634c4 playlist classifier; playlist/metafile URIs (asx, wax, wmx, m3u8, m3u, pls, wpl, x-file-cifs://, .rsq) expand to their contents rather than enqueueing as single tracks.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fb7e8`
- dispatch entry `0x10eb3018`
- impl call `0x102fba4c` obj `r5-in` slot `104` arg4 `*(sp+0x2c)`
- impl call `0x102fbb54` obj `*(*(sp+0x0)+0xfffffffc)` slot `12` arg4 `?`
- req vcall `0x102fb9d4` slot `8` (parse)

- fn 0x102fb7e8 @ 0x102fb7e8 — action wrapper handler
- @ 0x10eb3018 — action dispatch table entry
- fn 0x102b7170 — AVT impl vtable 0x10eaf2ec slot +0x68 entry

</details>

### `AddURIToQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Adds one track URI (+DIDL-Lite metadata) to the playback queue. DesiredFirstTrackNumberEnqueued picks the position (0 = append), EnqueueAsNext inserts right after the current track. Returns the 1-based position where it landed and tracks actually added.

**Technical description:** Enqueues a single track URI. Impl f_102b6a9c is a thin 718-gate that calls shared enqueue worker f_102b6948(engine, args..., 0). The worker logs "avt_impl" "Add to queue %u; URI: %s" and "Add to queue %u; MD: %s", takes the impl+0x458 lock, and performs the enqueue through the queue/session machinery.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x64 with 718 | none - required argument |
| `EnqueuedURI` | SonosUriArg | yes | Any URI string the enqueue worker accepts / max 1024 chars | none - required argument |
| `EnqueuedURIMetaData` | SonosMetaDataArg | yes | Any DIDL-Lite string accepted by the worker / max 4096 chars | none - required argument |
| `DesiredFirstTrackNumberEnqueued` | SonosUintArg | yes | u32 queue position; 0 = append at end (engine worker inserts relative to UpdateID track list) / parsed u32; worker clamps/validates against the queue record | none - required argument |
| `EnqueueAsNext` | SonosBoolArg | yes | Boolean-ish integer / {0,1} | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`EnqueuedURI`** — URI to enqueue; logged verbatim into the avt_impl channel by the worker.
  - buffer cap: `0x401`
- **`EnqueuedURIMetaData`** — DIDL metadata for the track; logged verbatim alongside the URI.
  - buffer cap: `0x1001`
- **`DesiredFirstTrackNumberEnqueued`** — Requested 1-based insertion position; actual result reported via FirstTrackNumberEnqueued.
  - buffer cap: `0x18`
- **`EnqueueAsNext`** — Flag forwarded to the worker requesting next-track insertion.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `FirstTrackNumberEnqueued` | unsigned int32 | queue position actually used by the worker / 0..queue length+1 as applied |
| `NumTracksAdded` | unsigned int32 | count of entries actually enqueued by the worker/expansion / 0..N |
| `NewQueueLength` | unsigned int32 | "0" or "1" via bool-style parse helper; literal semantics under action validation / {0,1} |

- **`FirstTrackNumberEnqueued`** — Written by the enqueue worker on success.
  - validation: copied from the worker insert result
- **`NumTracksAdded`** — Written by the enqueue worker on success.
  - validation: worker-written count record
- **`NewQueueLength`** — Written by the enqueue worker on success.
  - validation: written from the queue record length after the mutation

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102facf8 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×5, out-arg write×3, validate×1, commit×1); member delegates: r29 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102facf8 — req-vfunc call map: {'0x1c': 5, '0x8': 1, '0x14': 1, '0x24': 3, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r29 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102facf8 — member vfunc calls: \['r29 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r29 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r29 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102facf8 — no transition-literal/store pattern; member delegates: \['r29 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102facf8 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102facf8 — commit/fault slot usage: {'0x1c': 5, '0x8': 1, '0x14': 1, '0x24': 3, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1c\] -> f_105614e0 into a stack word, passes that word in r4 to the impl vfunc; impl guard cmpwi r4,0 / beq -> body, fallthrough returns 0x2ce (718); only instance 0 exists in this build; remaining rc paths call-derived

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)

**`vret(r5-in,+0x64)`** `strong`

nonzero engine-insert rc surfaced verbatim; recovered domain: 718 (InstanceID!=0 or missing queue record), 0x404=1028 (insert-position mismatch), 800 (commit-op failure paths), record-write rcs via f_1014f808/f_1014fb34, 0 on success

- the enqueue worker produced a code not covered by the gate


**Bounded unknown — proven:** enqueue worker f_102b6948 rc returned
**Bounded unknown — unresolved:** impl entry guard returns 0x2ce (718) when r4 arg/out ptr is null (see 0x102b6a9c entry); remaining paths call-derived

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage


#### Notes

URI arguments flow through the queue-manager singleton (0x11096770) and its f_104634c4 playlist classifier; playlist/metafile URIs (asx, wax, wmx, m3u8, m3u, pls, wpl, x-file-cifs://, .rsq) expand to their contents rather than enqueueing as single tracks. The Queue service reaches the identical engine worker through queue-manager vtable 0x10ed1bcc -> *(qm+0x128).

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102facf8`
- dispatch entry `0x10eb3024`
- impl call `0x102fae44` obj `r5-in` slot `100` arg4 `*(sp-0x1450+0x20)`
- impl call `0x102faf18` obj `*(sp-0x1450+0x144c)` slot `12` arg4 `?`
- req vcall `0x102fadf8` slot `8` (parse)

- fn 0x102facf8 @ 0x102facf8 — action wrapper handler
- @ 0x10eb3024 — action dispatch table entry
- fn 0x102b6a9c — AVT impl vtable 0x10eaf2ec slot +0x64 entry

</details>

### `AddURIToSavedQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Adds a track to a saved queue identified by ObjectID at AddAtIndex. Returns counts and a NewUpdateID for that queue.

**Technical description:** Appends a URI to an existing saved queue. Impl f_102bd140 is an arg-shifting 718-gate dispatching into saved-queue worker f_10479fb8. ObjectID, UpdateID, EnqueuedURI/EnqueuedURIMetaData and AddAtIndex are forwarded positionally with the out params.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x88 with 718 | none - required argument |
| `ObjectID` | SonosStringArg | yes | saved-queue container object id string (sq: prefix family) / max 1023 chars | none - required argument |
| `UpdateID` | SonosStringArg | yes | client-held saved-queue UpdateID; stale value -> mismatch at worker level / length-bounded by parse-helper buffer cap | none - required argument |
| `EnqueuedURI` | SonosUriArg | yes | any URI string <= parse cap; playlist extensions (.asx/.m3u/.pls/.wpl/.rsq/x-file-cifs) auto-expanded by f_104634c4 at enqueue time / max 1024 chars | none - required argument |
| `EnqueuedURIMetaData` | SonosMetaDataArg | yes | DIDL-Lite XML string <= parse cap; empty permitted / max 4096 chars | none - required argument |
| `AddAtIndex` | SonosUintArg | yes | u32 insert index into the saved queue; 0/omitted = append / parsed u32; worker-clamped against the saved-queue length | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`ObjectID`** — Forwarded positionally to the f_10479fb8 subsystem worker.
  - buffer cap: `0x400`
- **`UpdateID`** — Forwarded positionally to the f_10479fb8 subsystem worker.
  - buffer cap: `0x18`
- **`EnqueuedURI`** — Forwarded positionally to the f_10479fb8 subsystem worker.
  - buffer cap: `0x401`
- **`EnqueuedURIMetaData`** — Forwarded positionally to the f_10479fb8 subsystem worker.
  - buffer cap: `0x1001`
- **`AddAtIndex`** — Forwarded positionally to the f_10479fb8 subsystem worker.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NumTracksAdded` | unsigned int32 | count of entries actually enqueued by the worker/expansion / 0..N |
| `NewQueueLength` | unsigned int32 | "0" or "1" via bool-style parse helper; literal semantics under action validation / {0,1} |
| `NewUpdateID` | unsigned int32 | post-mutation queue UpdateID / length-bounded by parse-helper buffer cap |

- **`NumTracksAdded`** — Written by the f_10479fb8 worker on success.
  - validation: worker-written count record
- **`NewQueueLength`** — Written by the f_10479fb8 worker on success.
  - validation: written from the queue record length after the mutation
- **`NewUpdateID`** — Written by the f_10479fb8 worker on success.
  - validation: copied from the queue-record update counter

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fb2d8 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×6, out-arg write×3, validate×1, commit×1); member delegates: r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb2d8 — req-vfunc call map: {'0x1c': 6, '0x8': 1, '0x14': 1, '0x24': 3, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb2d8 — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb2d8 — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb2d8 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb2d8 — commit/fault slot usage: {'0x1c': 6, '0x8': 1, '0x14': 1, '0x24': 3, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`vret(r5-in,+0x88)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (gate), saved-queue worker rc fwd

- the subsystem worker produced a code not covered by the gate


**Bounded unknown — proven:** saved-queue worker rc returned
**Bounded unknown — unresolved:** impl entry guard returns 0x2ce (718) when r4 arg/out ptr is null (see 0x102bd140 entry); remaining paths call-derived

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,805,806,807,808,810,811,812,813,814,850,899}. f_1047ee0c literal exits {501,701,802-808,810-812}; f_1047db08 (queue-add path, 'UPNP error %d adding URI to saved queue') {805,814}; f_10477fe8 reorder engine {600,812,813,850,899}; f_10476cb4 returns 899 on equal list head/tail (+0x44 count nonzero). 899 = real return (li r3;blr), 850/813 in reorder domain, 600 lone. Per-rung trigger semantics undecoded except reorder guard.

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Shim behavior: validates r4 (arg vector) non-null else returns 0x2ce (718) directly; loads queue-manager singleton 0x11096770 as worker `this`, bumps *(token+4) on session token 0x11096774, calls the 0x1047xxxx worker, then f_100c5050 release. URI arguments flow through the queue-manager singleton (0x11096770) and its f_104634c4 playlist classifier; playlist/metafile URIs (asx, wax, wmx, m3u8, m3u, pls, wpl, x-file-cifs://, .rsq) expand to their contents rather than enqueueing as single tracks.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fb2d8`
- dispatch entry `0x10eb3030`
- impl call `0x102fb43c` obj `r5-in` slot `136` arg4 `*(sp-0x1850+0x1c)`
- impl call `0x102fb50c` obj `*(sp-0x1850+0x184c)` slot `12` arg4 `?`
- req vcall `0x102fb3f4` slot `8` (parse)

- fn 0x102fb2d8 @ 0x102fb2d8 — action wrapper handler
- @ 0x10eb3030 — action dispatch table entry
- fn 0x102bd140 — AVT impl vtable 0x10eaf2ec slot +0x88 entry

</details>

### `BackupQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Persists the current playback queue to flash so it survives reboot.

**Technical description:** Persists the current queue to disk. Impl f_102ab62c locks impl+0x458 then reads a u16 queue count at session+0x2ff58: zero count unlocks and returns 0 — backing up an empty queue is a silent success no-op. Otherwise it builds the "trackqueue"/"trackqueue.rsq" path via f_10146e94, prepares the file through f_1068ab6c, calls statvfs64 on the mount, and performs a free-space check before writing the .rsq serialization.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x80 with 718 | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f8db0 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x80\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8db0 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x80\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8db0 — member vfunc calls: \['r30 v\[+0x80\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x80\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x80\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8db0 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x80\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8db0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8db0 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

Nonzero InstanceID — impl compares the parsed int against 0 before touching the session.

- InstanceID argument is nonzero

**`vret(r5-in,+0x80)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: path-builder domain {718, 0x322=802}

- file preparation or the statvfs space check returned nonzero

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`802`** `strong`

worker-call rejection path

- worker call result -> literal

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,805,806,807,808,810,811,812,813,814,850,899}. f_1047ee0c literal exits {501,701,802-808,810-812}; f_1047db08 (queue-add path, 'UPNP error %d adding URI to saved queue') {805,814}; f_10477fe8 reorder engine {600,812,813,850,899}; f_10476cb4 returns 899 on equal list head/tail (+0x44 count nonzero). 899 = real return (li r3;blr), 850/813 in reorder domain, 600 lone. Per-rung trigger semantics undecoded except reorder guard.

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None The saved-queue store file is "savedqueues.rsq" (rodata 0x10ed3104), the same .rsq container trackqueue.rsq uses for the live queue backup.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f8db0`
- dispatch entry `0x10eb303c`
- impl call `0x102f8e2c` obj `r5-in` slot `128` arg4 `*(sp-0x30+0x18)`
- impl call `0x102f8e90` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x102f8e0c` slot `8` (parse)

- fn 0x102f8db0 @ 0x102f8db0 — action wrapper handler
- @ 0x10eb303c — action dispatch table entry
- fn 0x102ab62c — AVT impl vtable 0x10eaf2ec slot +0x80 entry

</details>

### `BecomeCoordinatorOfStandaloneGroup`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Makes this player coordinate the standalone group it belongs to; returns the coordinator id and new group id. Used in group rebuild flows.

**Technical description:** Promotes this player to coordinator of its standalone group. Impl f_102d5524 logs "avt_impl" "BecomeCoordinatorOfStandaloneGroup", takes impl+0x458, enforces InstanceID==0 (718), then runs the coordinator-promotion path which builds the DelegatedGroupCoordinatorID/NewGroupID outputs. This is one of the four actions where engine classes A (vtable 0x10eaf2ec, impl 0x102d5524) and B (vtable 0x10edfbb8, impl 0x10513244) differ — B is the group-aware variant reached in grouped mode; semantics described are the A path.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x54 with 718 | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `DelegatedGroupCoordinatorID` | SonosStringArg | zone UUID string of the promoted member / length-bounded by parse-helper buffer cap |
| `NewGroupID` | SonosStringArg | group UUID assigned by the promotion path / length-bounded by parse-helper buffer cap |

- **`DelegatedGroupCoordinatorID`** — Group/coordinator identity written by the promotion path on success.
  - validation: output written by the promotion path when it selects a member
- **`NewGroupID`** — Group/coordinator identity written by the promotion path on success.
  - validation: written from the group record on success

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f8b04 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×2, raise-fault×2, required-arg fetch×1, out-arg write×2, validate×1, commit×1); member delegates: r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8b04 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x24': 2, '0x10': 2, '0xc': 1, '0x14': 2}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8b04 — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8b04 — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8b04 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8b04 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x24': 2, '0x10': 2, '0xc': 1, '0x14': 2}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`const`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: promotion-path domain {718, r29 callee-fwd}

- the promotion path produced a code not covered by the gate


**Bounded unknown — proven:** promotion-path rc surfaced
**Bounded unknown — unresolved:** concrete codes from the coordinator promotion tail

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Engine-class split: on the group-capable engine (vtable 0x10edfbb8) this action dispatches to 0x10513244 - grouped gate: topology singleton + state predicate + f_1075c4d0 precondition on impl+0x44c; error path uses 0x3ff (1023). Ungrouped zones get identical behavior to the standalone engine for the Become* actions.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f8b04`
- dispatch entry `0x10eb3048`
- impl call `0x102f8bdc` obj `r5-in` slot `84` arg4 `*(sp-0x70+0x10)`
- impl call `0x102f8c10` obj `vret(r4-in,+0x24)` slot `16` arg4 `sp-0x5c`
- impl call `0x102f8c40` obj `vret(r4-in,+0x24)` slot `16` arg4 `sp-0x38`
- impl call `0x102f8cb8` obj `xor(*(r2+0xffff8ff8))` slot `20` arg4 `*(sp-0x70+0x68)`
- req vcall `0x102f8b60` slot `8` (parse)
- req vcall `0x102f8c5c` slot `12` (commit)

- fn 0x102f8b04 @ 0x102f8b04 — action wrapper handler
- @ 0x10eb3048 — action dispatch table entry
- fn 0x102d5524 — AVT impl vtable 0x10eaf2ec (class A) / 0x10edfbb8 B-variant 0x10513244 slot +0x54 entry

</details>

### `BecomeGroupCoordinator`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Bulk state-transfer: this player takes over as group coordinator, receiving the previous coordinator's complete transport/queue/alarm/sleep state in the arguments (TransportSettings, CurrentQueueTrackList, member list, etc.). Nothing is read from arg descriptors - the handler forwards the whole blob.

**Technical description:** Makes this player the coordinator of an existing group, adopting the group source. Impl f_102de740 logs "avt_impl" "BecomeGroupCoordinator", locks impl+0x458, then requires impl+0x4654==0 OR the flag path at 0x102dea84: in mode 0 it dispatches op-1 through session helper f_10256a84, builds a request record via f_1032e270/f_1032e5d0, submits via f_10255f64, then writes group-identity outputs through a run of f_1014cdf4/f_1014ce3c calls. This is one of the four actions where engine classes A (vtable 0x10eaf2ec, impl 0x102de740) and B (vtable 0x10edfbb8, impl 0x105133e4) differ — B is the group-aware variant reached in grouped mode; semantics described are the A path.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | ui4 argument | yes | A_ARG_TYPE_InstanceID-domain value / impl-bounded (req-slot arg) | none |
| `CurrentCoordinator` | string argument | yes | A_ARG_TYPE_MemberID-domain value / impl-bounded (req-slot arg) | none |
| `CurrentGroupID` | string argument | yes | A_ARG_TYPE_GroupID-domain value / impl-bounded (req-slot arg) | none |
| `OtherMembers` | string argument | yes | A_ARG_TYPE_MemberList-domain value / impl-bounded (req-slot arg) | none |
| `TransportSettings` | string argument | yes | A_ARG_TYPE_TransportSettings-domain value / impl-bounded (req-slot arg) | none |
| `CurrentURI` | string argument | yes | AVTransportURI-domain value / impl-bounded (req-slot arg) | none |
| `CurrentURIMetaData` | string argument | yes | AVTransportURIMetaData-domain value / impl-bounded (req-slot arg) | none |
| `SleepTimerState` | string argument | yes | A_ARG_TYPE_SleepTimerState-domain value / impl-bounded (req-slot arg) | none |
| `AlarmState` | string argument | yes | A_ARG_TYPE_AlarmState-domain value / impl-bounded (req-slot arg) | none |
| `StreamRestartState` | string argument | yes | A_ARG_TYPE_StreamRestartState-domain value / impl-bounded (req-slot arg) | none |
| `CurrentQueueTrackList` | string argument | yes | A_ARG_TYPE_Queue-domain value / impl-bounded (req-slot arg) | none |
| `CurrentVLIState` | string argument | yes | A_ARG_TYPE_VLIState-domain value / impl-bounded (req-slot arg) | none |

- **`InstanceID`** — renderer instance id (always 0)
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentCoordinator`** — UDN of the current group coordinator
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentGroupID`** — group UUID of the zone group being handed off
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`OtherMembers`** — member-list blob of the other zone-group members
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`TransportSettings`** — serialized transport settings blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentURI`** — the URI the zone group is currently rendering (AVTransportURI), carried into the new coordinator so it can resume the stream
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentURIMetaData`** — DIDL-Lite metadata for CurrentURI, carried into the new coordinator for track-info continuity across the handoff
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`SleepTimerState`** — serialized sleep-timer state blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`AlarmState`** — serialized alarm state blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`StreamRestartState`** — serialized stream-restart state blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentQueueTrackList`** — serialized queue track-list blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentVLIState`** — serialized virtual-line-in state blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fc8b0 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, commit×1); member delegates: r4 v\[+?\], r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc8b0 — req-vfunc call map: {'0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+?\], r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc8b0 — member vfunc calls: \['r4 v\[+?\]', 'r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r4 v\[+?\], r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+?\], r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc8b0 — no transition-literal/store pattern; member delegates: \['r4 v\[+?\]', 'r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc8b0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc8b0 — commit/fault slot usage: {'0x14': 1, '0xc': 1}

</details>


#### Errors

**`vret(r5-in,+0xd0)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718, 800, 402 x6 sites, callee-fwd — producers at 0x102dea7c/0x102dea90/0x102deb20+

- the worker produced a code not covered by the gates

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage


#### Notes

None Engine-class split: on the group-capable engine (vtable 0x10edfbb8) this action dispatches to 0x105133e4 - delegates verbatim to class-A impl 0x102de740 when the zone is ungrouped; group path otherwise. Ungrouped zones get identical behavior to the standalone engine for the Become* actions.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fc8b0`
- dispatch entry `0x10eb3054`
- impl call `0x102fc928` obj `r5-in` slot `208` arg4 `sp-0x1c`
- impl call `0x102fc97c` obj `xor(*(r2+0xffff8ff8))` slot `12` arg4 `?`
- req vcall `0x102fc8f8` slot `52` (other)
- Handler 0x102fc8b0 contains no argument-parser call and no arg-name string loads; the action is verified argless (no inputs, no outputs).

- fn 0x102fc8b0 @ 0x102fc8b0 — action wrapper handler
- @ 0x10eb3054 — action dispatch table entry
- fn 0x102de740 — AVT impl vtable 0x10eaf2ec (class A) / 0x10edfbb8 B-variant 0x105133e4 slot +0xd0 entry
- @ 0x102fc8b0 — handler body: gate + impl call + commit only; no parse/emit arg sites

</details>

### `BecomeGroupCoordinatorAndSource`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Like BecomeGroupCoordinator but also transfers the audio source state (CurrentAVTTrackList, CurrentSourceState, ResumePlayback flag) so the new coordinator continues the same source.

**Technical description:** Makes this player group coordinator AND selects this player's source for the group. Impl f_102df410 logs via the same avt_impl preamble and runs the combined coordinator+source promotion path (structure parallel to BecomeGroupCoordinator; the worker core past the logging preamble is unresolved). This is one of the four actions where engine classes A (vtable 0x10eaf2ec, impl 0x102df410) and B (vtable 0x10edfbb8, impl 0x105134a8) differ — B is the group-aware variant reached in grouped mode; semantics described are the A path.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | ui4 argument | yes | A_ARG_TYPE_InstanceID-domain value / impl-bounded (req-slot arg) | none |
| `CurrentCoordinator` | string argument | yes | A_ARG_TYPE_MemberID-domain value / impl-bounded (req-slot arg) | none |
| `CurrentGroupID` | string argument | yes | A_ARG_TYPE_GroupID-domain value / impl-bounded (req-slot arg) | none |
| `OtherMembers` | string argument | yes | A_ARG_TYPE_MemberList-domain value / impl-bounded (req-slot arg) | none |
| `CurrentURI` | string argument | yes | AVTransportURI-domain value / impl-bounded (req-slot arg) | none |
| `CurrentURIMetaData` | string argument | yes | AVTransportURIMetaData-domain value / impl-bounded (req-slot arg) | none |
| `SleepTimerState` | string argument | yes | A_ARG_TYPE_SleepTimerState-domain value / impl-bounded (req-slot arg) | none |
| `AlarmState` | string argument | yes | A_ARG_TYPE_AlarmState-domain value / impl-bounded (req-slot arg) | none |
| `StreamRestartState` | string argument | yes | A_ARG_TYPE_StreamRestartState-domain value / impl-bounded (req-slot arg) | none |
| `CurrentAVTTrackList` | string argument | yes | A_ARG_TYPE_Queue-domain value / impl-bounded (req-slot arg) | none |
| `CurrentQueueTrackList` | string argument | yes | A_ARG_TYPE_Queue-domain value / impl-bounded (req-slot arg) | none |
| `CurrentSourceState` | string argument | yes | A_ARG_TYPE_SourceState-domain value / impl-bounded (req-slot arg) | none |
| `ResumePlayback` | boolean argument | yes | A_ARG_TYPE_ResumePlayback-domain value / impl-bounded (req-slot arg) | none |

- **`InstanceID`** — renderer instance id (always 0)
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentCoordinator`** — UDN of the current group coordinator
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentGroupID`** — group UUID of the zone group being handed off
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`OtherMembers`** — member-list blob of the other zone-group members
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentURI`** — the URI the zone group is currently rendering (AVTransportURI), carried into the new coordinator so it can resume the stream
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentURIMetaData`** — DIDL-Lite metadata for CurrentURI, carried into the new coordinator for track-info continuity across the handoff
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`SleepTimerState`** — serialized sleep-timer state blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`AlarmState`** — serialized alarm state blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`StreamRestartState`** — serialized stream-restart state blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentAVTTrackList`** — serialized AVT track-list blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentQueueTrackList`** — serialized queue track-list blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`CurrentSourceState`** — serialized source state blob
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor
- **`ResumePlayback`** — whether to resume playback after the handoff
  - validation: fetched via request-object slot; impl validates internally
  - populated from SCPD — arg read as raw value via request slot, not a typed parse-descriptor

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fc3a0 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, 0x34×1, commit×1); member delegates: r4 v\[+?\], r29 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc3a0 — req-vfunc call map: {'0x34': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+?\], r29 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc3a0 — member vfunc calls: \['r4 v\[+?\]', 'r29 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r4 v\[+?\], r29 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+?\], r29 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc3a0 — no transition-literal/store pattern; member delegates: \['r4 v\[+?\]', 'r29 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc3a0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc3a0 — commit/fault slot usage: {'0x34': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`vret(r5-in,+0xd4)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: promotion worker domain {0x401=1025}

- the worker produced a code not covered by the gates

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage


#### Notes

None Engine-class split: on the group-capable engine (vtable 0x10edfbb8) this action dispatches to 0x105134a8 - delegates verbatim to class-A impl 0x102df410 when the zone is ungrouped; group path otherwise. Ungrouped zones get identical behavior to the standalone engine for the Become* actions.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fc3a0`
- dispatch entry `0x10eb3060`
- impl call `0x102fc448` obj `r5-in` slot `212` arg4 `sp-0x1c`
- impl call `0x102fc4a0` obj `xor(*(r2+0xffff8ff8))` slot `12` arg4 `?`
- req vcall `0x102fc3ec` slot `52` (other)
- req vcall `0x102fc410` slot `52` (other)
- Handler 0x102fc3a0 contains no argument-parser call and no arg-name string loads; the action is verified argless (no inputs, no outputs).

- fn 0x102fc3a0 @ 0x102fc3a0 — action wrapper handler
- @ 0x10eb3060 — action dispatch table entry
- fn 0x102df410 — AVT impl vtable 0x10eaf2ec (class A) / 0x10edfbb8 B-variant 0x105134a8 slot +0xd4 entry
- @ 0x102fc3a0 — handler body: gate + impl call + commit only; no parse/emit arg sites

</details>

### `ChangeCoordinator`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Asks this coordinator to hand coordination to NewCoordinator, carrying the current transport settings and URI so playback continues; RestartSink controls whether the sink restarts.

**Technical description:** Reassigns group coordination from one member to another with transport-settings handover. Impl f_102af490 logs "change coordinator: old = %s, new = %s, ts = %s, uri = %s" on the avt_impl channel, then under impl+0x458 enforces InstanceID==0 (718) and runs the coordinator-change path taking CurrentCoordinator, NewCoordinator, NewTransportSettings, CurrentAVTransportURI and RestartSink.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x5c with 718 | none - required argument |
| `CurrentCoordinator` | SonosBoolArg | yes | zone-UUID / URI string <= parse cap; consumed by the coordinator-change worker / max 24 chars | none - required argument |
| `NewCoordinator` | SonosBoolArg | yes | zone-UUID / URI string <= parse cap; consumed by the coordinator-change worker / max 24 chars | none - required argument |
| `NewTransportSettings` | SonosBoolArg | yes | transport-settings record string <= parse cap / max 128 chars | none - required argument |
| `CurrentAVTransportURI` | SonosUriArg | yes | zone-UUID / URI string <= parse cap; consumed by the coordinator-change worker / max 1024 chars | none - required argument |
| `RestartSink` | SonosStringArg | yes | boolean flag parsed as u32; nonzero restarts the sink during the handoff / length-bounded by parse-helper buffer cap | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`CurrentCoordinator`** — Identifier of the member currently holding coordination.
  - buffer cap: `0x19`
- **`NewCoordinator`** — Identifier of the member to receive coordination.
  - buffer cap: `0x19`
- **`NewTransportSettings`** — Settings handed to the new coordinator (same family as ChangeTransportSettings).
  - buffer cap: `0x81`
- **`CurrentAVTransportURI`** — Source URI carried through the handover.
  - buffer cap: `0x401`
- **`RestartSink`** — Flag requesting a sink restart on the new coordinator.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fa3ec — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×6, validate×1, commit×1); member delegates: r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa3ec — req-vfunc call map: {'0x1c': 6, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa3ec — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa3ec — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa3ec — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa3ec — commit/fault slot usage: {'0x1c': 6, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`vret(r5-in,+0x5c)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718, 800 — producers at 0x102af538/0x102af678

- the worker produced a code not covered by the gate


**Bounded unknown — proven:** coordinator-change worker rc surfaced
**Bounded unknown — unresolved:** concrete codes for member validation / handover refusal

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`800`** `strong`

worker-call rejection path

- worker call result -> literal

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fa3ec`
- dispatch entry `0x10eb306c`
- impl call `0x102fa550` obj `r5-in` slot `92` arg4 `*(sp-0x4f0+0x18)`
- impl call `0x102fa5b8` obj `*(sp-0x4f0+0x4ec)` slot `12` arg4 `402`
- req vcall `0x102fa51c` slot `8` (parse)

- fn 0x102fa3ec @ 0x102fa3ec — action wrapper handler
- @ 0x10eb306c — action dispatch table entry
- fn 0x102af490 — AVT impl vtable 0x10eaf2ec slot +0x5c entry

</details>

### `ChangeTransportSettings`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Applies a new TransportSettings blob (play state, mode, etc.) to the current URI - used when a group coordinator pushes state to members.

**Technical description:** Installs new transport settings — the VLI/direct-control path. Impl f_102b1d40 logs "avt_impl" "%s: ts = %s \[%s\]" then locks impl+0x458: InstanceID!=0 -> 718 and impl+0x4654 must be 0 — this action is IDLE-ONLY, the inverse of the mode-1|2 actions; any active transport returns 800. It memcpy's a 0x38-byte settings record, parses NewTransportSettings via f_103917b4, checks source state via f_102b0a48, logs "ChangeTransportSettings(): stopping local VLI (txs=%s)" on the vli channel and stops the local VLI via f_106aa3b0, manipulates bit-flags at impl+0x5b4, logs "vli src tx settings sntp port: %u", then "ChangeTransportSettings installClock" -> f_109876d8 + f_106aa13c + a vfunc bctrl installs a clock, finishing with f_1030f7f8(0,0).

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x60 with 718 | none - required argument |
| `NewTransportSettings` | SonosBoolArg | yes | Worker-parsed settings string / max 128 chars | none - required argument |
| `CurrentAVTransportURI` | SonosUriArg | yes | Any URI string / max 1024 chars | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`NewTransportSettings`** — Opaque transport-settings descriptor parsed by f_103917b4 into the 0x38-byte record.
  - buffer cap: `0x81`
- **`CurrentAVTransportURI`** — Source URI forwarded into the settings application path.
  - buffer cap: `0x401`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f95b8 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1, commit×1); member delegates: r30 v\[+0x60\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f95b8 — req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x60\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f95b8 — member vfunc calls: \['r30 v\[+0x60\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x60\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x60\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f95b8 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x60\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f95b8 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f95b8 — commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`800`** `confirmed`

Transport mode impl+0x4654 is nonzero — settings changes require an idle engine.

- impl+0x4654 != 0 — impl/parse rc path to shared fault emitter (see evidence)

**`vret(r5-in,+0x60)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718, 800, callee-fwd — producers at 0x102b1dd8/0x102b1e2c

- the settings path produced a code not covered by the gates


**Bounded unknown — proven:** settings-application rc surfaced
**Bounded unknown — unresolved:** codes from f_103917b4 parse, VLI stop and clock-install paths

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f95b8`
- dispatch entry `0x10eb3078`
- impl call `0x102f968c` obj `r5-in` slot `96` arg4 `*(sp-0x4b0+0x10)`
- impl call `0x102f96f0` obj `*(sp-0x4b0+0x4ac)` slot `12` arg4 `402`
- req vcall `0x102f9664` slot `8` (parse)

- fn 0x102f95b8 @ 0x102f95b8 — action wrapper handler
- @ 0x10eb3078 — action dispatch table entry
- fn 0x102b1d40 — AVT impl vtable 0x10eaf2ec slot +0x60 entry

</details>

### `ConfigureSleepTimer`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Sets a sleep timer that fades playback out after NewSleepTimerDuration ('HH:MM:SS').

**Technical description:** Sets or cancels the sleep timer. Impl f_102b4de8: after the 718-gate it checks the first byte of NewSleepTimerDuration — an empty string skips parsing and passes 0 seconds (cancel semantics). A non-empty value is parsed by shared duration parser f_10c3d2c4 (the same routine SnoozeAlarm uses); parse failure returns 402. The impl locks impl+0x458 and requires engine+0x4654 in {1,2} — any other mode returns 800. On success it calls f_102b4c1c(engine,seconds,1,1,1,0) and returns its rc.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x90 with 718 | none - required argument |
| `NewSleepTimerDuration` | SonosDurationArg | yes | Empty string (cancel) or a duration that f_10c3d2c4 parses — non-empty unparseable text faults 402 / max 63 chars | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`NewSleepTimerDuration`** — Duration string parsed by shared parser f_10c3d2c4 (same routine SnoozeAlarm uses); empty string bypasses parsing and cancels the timer.
  - buffer cap: `0x40`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f9878 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r30 v\[+0x90\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9878 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x90\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9878 — member vfunc calls: \['r30 v\[+0x90\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x90\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x90\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9878 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x90\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9878 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9878 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

Nonzero InstanceID — impl gate on the parsed int.

- InstanceID argument is nonzero

**`402`** `confirmed`

Non-empty NewSleepTimerDuration fails the f_10c3d2c4 duration parse.

- f_10c3d2c4 returns 0 on the duration text
- Missing or unparseable input argument at the wrapper parse stage

**`800`** `confirmed`

engine+0x4654 is neither 1 nor 2 — sleep timer requires a non-idle transport mode.

- (impl+0x4654 - 1) unsigned > 1

**`vret(r5-in,+0x90)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: timer-set worker f_102b4c1c exit returns 0; internal constants {0x320=800,0x192=402,0x3cc} observed in body (internal fault raising), exit path returns success code

- f_102b4c1c returned nonzero


**Bounded unknown — proven:** f_102b4c1c timer-set rc is returned.
**Bounded unknown — unresolved:** concrete nonzero codes f_102b4c1c can produce for a valid mode/seconds pair


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f9878`
- dispatch entry `0x10eb3084`
- impl call `0x102f9920` obj `r5-in` slot `144` arg4 `*(sp-0x70+0x18)`
- impl call `0x102f9984` obj `*(sp-0x70+0x6c)` slot `12` arg4 `402`
- req vcall `0x102f98fc` slot `8` (parse)

- fn 0x102f9878 @ 0x102f9878 — action wrapper handler
- @ 0x10eb3084 — action dispatch table entry
- fn 0x102b4de8 — AVT impl vtable 0x10eaf2ec slot +0x90 entry

</details>

### `CreateSavedQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Creates a new named saved queue containing one initial track (EnqueuedURI + metadata) and returns its AssignedObjectID plus queue stats.

**Technical description:** Creates a new saved queue (Sonos playlist). Impl f_102bd048 is an arg-shifting 718-gate that dispatches into the saved-queue subsystem worker f_10479bb4 (via an atomic-init guarded entry). Title, EnqueuedURI/EnqueuedURIMetaData and the out params are forwarded positionally.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x84 with 718 | none - required argument |
| `Title` | SonosStringArg | yes | display title string <= parse cap; newline rejected -> 402 / max 1023 chars | none - required argument |
| `EnqueuedURI` | SonosUriArg | yes | any URI string <= parse cap; playlist extensions auto-expanded via f_104634c4 / max 1024 chars | none - required argument |
| `EnqueuedURIMetaData` | SonosMetaDataArg | yes | DIDL-Lite XML string <= parse cap; empty permitted / max 4096 chars | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`Title`** — Forwarded positionally to the f_10479bb4 subsystem worker.
  - buffer cap: `0x400`
- **`EnqueuedURI`** — Forwarded positionally to the f_10479bb4 subsystem worker.
  - buffer cap: `0x401`
- **`EnqueuedURIMetaData`** — Forwarded positionally to the f_10479bb4 subsystem worker.
  - buffer cap: `0x1001`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NumTracksAdded` | unsigned int32 | count of entries actually enqueued by the worker/expansion / 0..N |
| `NewQueueLength` | unsigned int32 | "0" or "1" via bool-style parse helper; literal semantics under action validation / {0,1} |
| `NewUpdateID` | unsigned int32 | post-create saved-queue UpdateID / length-bounded by parse-helper buffer cap |
| `AssignedObjectID` | SonosStringArg | sq:-family object id assigned by the saved-queue store / length-bounded by parse-helper buffer cap |

- **`NumTracksAdded`** — Written by the f_10479bb4 worker on success.
  - validation: worker-written count record
- **`NewQueueLength`** — Written by the f_10479bb4 worker on success.
  - validation: written from the saved-queue record track count
- **`NewUpdateID`** — Written by the f_10479bb4 worker on success.
  - validation: copied from the queue record update counter state+0xec
- **`AssignedObjectID`** — Written by the f_10479bb4 worker on success.
  - validation: output of the create path

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fb0b0 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×4, out-arg write×4, validate×1, commit×1); member delegates: r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb0b0 — req-vfunc call map: {'0x1c': 4, '0x8': 1, '0x14': 1, '0x24': 4, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb0b0 — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb0b0 — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb0b0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fb0b0 — commit/fault slot usage: {'0x1c': 4, '0x8': 1, '0x14': 1, '0x24': 4, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`vret(r5-in,+0x84)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (gate), saved-queue worker rc fwd

- the subsystem worker produced a code not covered by the gate


**Bounded unknown — proven:** saved-queue worker rc returned
**Bounded unknown — unresolved:** impl entry guard returns 0x2ce (718) when r4 arg/out ptr is null (see 0x102bd048 entry); remaining paths call-derived

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,805,806,807,808,810,811,812,813,814,850,899}. f_1047ee0c literal exits {501,701,802-808,810-812}; f_1047db08 (queue-add path, 'UPNP error %d adding URI to saved queue') {805,814}; f_10477fe8 reorder engine {600,812,813,850,899}; f_10476cb4 returns 899 on equal list head/tail (+0x44 count nonzero). 899 = real return (li r3;blr), 850/813 in reorder domain, 600 lone. Per-rung trigger semantics undecoded except reorder guard.

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Shim behavior: validates r4 (arg vector) non-null else returns 0x2ce (718) directly; loads queue-manager singleton 0x11096770 as worker `this`, bumps *(token+4) on session token 0x11096774, calls the 0x1047xxxx worker, then f_100c5050 release. Persistence: worker builds a job record (vtable 0x10ec7be0 via f_103d1aec), bumps the saved-queue update counter *(state+0xec) by +1, and serializes to "savedqueues.rsq" - the same .rsq format the queue playlist classifier loads.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fb0b0`
- dispatch entry `0x10eb3090`
- impl call `0x102fb1cc` obj `r5-in` slot `132` arg4 `*(sp-0x1c40+0x14)`
- impl call `0x102fb2b8` obj `vret(*(sp-0x1c40+0x1c3c),+0x24)` slot `16` arg4 `sp+0x424`
- impl call `0x102fb2cc` obj `*(sp-0x1c40+0x1c3c)` slot `12` arg4 `?`
- req vcall `0x102fb184` slot `8` (parse)

- fn 0x102fb0b0 @ 0x102fb0b0 — action wrapper handler
- @ 0x10eb3090 — action dispatch table entry
- fn 0x102bd048 — AVT impl vtable 0x10eaf2ec slot +0x84 entry

</details>

### `DelegateGroupCoordinationTo`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Hands the coordinator role to NewCoordinator. RejoinGroup controls whether this player stays as a member; ClearSource (added in 86.10) controls whether it drops the source.

**Technical description:** Hands group-coordinator responsibility to another member. Impl f_102de180: InstanceID!=0 -> 718; NewCoordinator must be a non-NULL, non-empty string (either fault -> 402). Under the impl+0x458 lock it calls worker f_102ddae8(engine, NewCoordinator, RejoinGroup, ClearSource), then translates the result with isel: a worker code of 0x323 (decimal 803) is remapped to 0 — that specific code is treated as success — while every other code passes through verbatim.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x58 with 718 | none - required argument |
| `NewCoordinator` | SonosStringArg | yes | Non-empty member identifier string / max 24 chars | none - required argument |
| `RejoinGroup` | SonosUintArg | yes | Boolean-ish integer forwarded uninterpreted / length-bounded by parse-helper buffer cap | none - required argument |
| `ClearSource` | SonosUintArg | yes | Boolean-ish integer forwarded uninterpreted / length-bounded by parse-helper buffer cap | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`NewCoordinator`** — Identity of the member to receive coordination; must be a non-empty string — NULL pointer or empty text faults 402 before the worker runs.
  - buffer cap: `0x19`
- **`RejoinGroup`** — Flag forwarded verbatim to f_102ddae8 — requests rejoining the group under the new coordinator.
  - buffer cap: `0x18`
- **`ClearSource`** — Flag forwarded verbatim to f_102ddae8 — requests clearing the current source during delegation.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fa26c — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×4, validate×1, commit×1); member delegates: r30 v\[+0x58\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa26c — req-vfunc call map: {'0x1c': 4, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x58\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa26c — member vfunc calls: \['r30 v\[+0x58\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x58\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x58\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa26c — no transition-literal/store pattern; member delegates: \['r30 v\[+0x58\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa26c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa26c — commit/fault slot usage: {'0x1c': 4, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`402`** `confirmed`

NewCoordinator was NULL or an empty string.

- r5==0 or *r5==0
- Missing or unparseable input argument at the wrapper parse stage

**`vret(r5-in,+0x58)`** `strong`

worker rc returned verbatim except 803->0

- f_102ddae8 returned a nonzero code other than 803


**Bounded unknown — proven:** worker rc returned verbatim except 803->0
**Bounded unknown — unresolved:** the full rc vocabulary of f_102ddae8 (delegation refusal reasons)


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fa26c`
- dispatch entry `0x10eb309c`
- impl call `0x102fa378` obj `r5-in` slot `88` arg4 `*(sp-0x50+0x1c)`
- impl call `0x102fa3e0` obj `*(sp-0x50+0x4c)` slot `12` arg4 `402`
- req vcall `0x102fa34c` slot `8` (parse)

- fn 0x102fa26c @ 0x102fa26c — action wrapper handler
- @ 0x10eb309c — action dispatch table entry
- fn 0x102de180 — AVT impl vtable 0x10eaf2ec slot +0x58 entry

</details>

### `EndDirectControlSession`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Ends a cloud/direct-control playback session, returning the player to normal UPnP control.

**Technical description:** Tears down an external direct-control or VLI playback session. Impl f_102d3824 runs the shared boilerplate, then calls f_10a0732c(impl+0xaaa4) to classify the session and f_10688070(impl+0x5dc) for stream-target liveness, choosing between the log tags "end VLI" and "end direct control". Either way it logs via f_102b8c44 and runs the shared teardown f_102d094c(impl) — the same cleanup Play/Stop use — then returns 0 unconditionally.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x50 with 718 | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f8e9c — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x50\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8e9c — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x50\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8e9c — member vfunc calls: \['r30 v\[+0x50\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x50\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x50\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8e9c — no transition-literal/store pattern; member delegates: \['r30 v\[+0x50\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8e9c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8e9c — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

Nonzero InstanceID — impl gate on the parsed int before any session work.

- InstanceID argument is nonzero

**`vret(r5-in,+0x50)`** `strong`

None known beyond 718 — the impl returns 0 unconditionally after teardown; this entry is a safety net for any rc the shared teardown could surface.

- shared teardown f_102d094c surfaced a nonzero code

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f8e9c`
- dispatch entry `0x10eb30a8`
- impl call `0x102f8f18` obj `r5-in` slot `80` arg4 `*(sp-0x30+0x18)`
- impl call `0x102f8f7c` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x102f8ef8` slot `8` (parse)

- fn 0x102f8e9c @ 0x102f8e9c — action wrapper handler
- @ 0x10eb30a8 — action dispatch table entry
- fn 0x102d3824 — AVT impl vtable 0x10eaf2ec slot +0x50 entry

</details>

### `GetCrossfadeMode`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Returns whether crossfade between tracks is enabled.

**Technical description:** Returns the current crossfade mode. Impl f_102ad370 shares the getter boilerplate: builds a scoped context from the impl+0x3dc name string, RAII-locks impl+0x458, returns 718 on InstanceID!=0; the body fills the CrossfadeMode out byte from engine state.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x24 with 718 | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CrossfadeMode` | boolean ('0'/'1') | impl-defined |

- **`CrossfadeMode`** — Current crossfade flag as a byte; which engine field feeds it is unresolved.
  - validation: impl-written out arg

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad370 @ 0x102ad370 — getter decode

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad370 @ 0x102ad424 — cmpwi r29,0 gate

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x24\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc28c — member vfunc calls: \['r30 v\[+0x24\]'\]

</details>


#### Side effects

- Read-only under impl+0x458 mutex.

#### State transitions `confirmed`

None.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad370 @ 0x102ad370 — read-only

</details>


#### Events `confirmed`

None - pure read.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad370 @ 0x102ad370 — no emit calls

</details>


#### Return behavior `confirmed`

0 on success; 718 for InstanceID!=0.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad370 @ 0x102ad428 — r30=0x2ce

</details>


#### Errors

**`718`** `strong`

nonzero InstanceID rejected by the impl vfunc (rc 0x2ce materialised at the impl head)

- InstanceID argument was nonzero (the engine only accepts instance 0)

**`402`** `confirmed`

Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs.

- typed argument parse or request-shape check failed in the wrapper


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fc28c`
- dispatch entry `0x10eb30b4`
- impl call `0x102fc30c` obj `r5-in` slot `36` arg4 `*(sp-0x30+0x18)`
- impl call `0x102fc394` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- req vcall `0x102fc2e8` slot `8` (parse)

- fn f_102ad370 @ 0x102ad370 — getter decode
- fn 0x102ad370 — AVT impl vtable 0x10eaf2ec slot +0x24 entry
- fn 0x102fc28c @ 0x102fc28c — action wrapper handler
- @ 0x10eb30b4 — action dispatch table entry

</details>

### `GetCurrentTransportActions`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Returns the actions currently legal for this source as a CSV (e.g. 'Play,Pause,Stop,Seek') - depends on the stream type and capabilities, so poll it rather than assuming.

**Technical description:** Returns the comma-separated list of currently-allowed transport actions. Impl f_102b2a8c gate (718) then body: zero-terminates the out buffer (stb 0 -> *out) and builds the action list via f_102b29d0 + f_102fcbf4 from engine capability state - the legal-action set is computed live, not static.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x4c with 718 | none - required argument |

- **`InstanceID`** — Instance index; impl returns 718 on nonzero.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Actions` | string | impl-defined engine state |

- **`Actions`** — Comma-separated transport action names currently legal for the active source.
  - validation: impl-written out arg

#### Validation `confirmed`

See inputs.
<details markdown="1"><summary>Evidence (3)</summary>

- fn f_102b2a8c @ f_102b2a8c — impl decode
- fn f_102b2a8c @ 0x102b2b94 — f_102b29d0 action-list builder
- fn f_102b2a8c @ 0x102b2ba0 — f_102fcbf4

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only (where present).
<details markdown="1"><summary>Evidence (3)</summary>

- fn f_102b2a8c @ f_102b2a8c — impl decode
- fn f_102b2a8c @ 0x102b2b94 — f_102b29d0 action-list builder
- fn f_102b2a8c @ 0x102b2ba0 — f_102fcbf4

</details>


#### State dependencies `confirmed`

Action list computed from current source capabilities via f_102b29d0/f_102fcbf4; the per-capability action mapping is unresolved.
<details markdown="1"><summary>Evidence (3)</summary>

- fn f_102b2a8c @ f_102b2a8c — impl decode
- fn f_102b2a8c @ 0x102b2b94 — f_102b29d0 action-list builder
- fn f_102b2a8c @ 0x102b2ba0 — f_102fcbf4

</details>


#### Side effects

- Read-only under impl+0x458 mutex; no engine writes.

#### State transitions `confirmed`

None.
<details markdown="1"><summary>Evidence (3)</summary>

- fn f_102b2a8c @ f_102b2a8c — impl decode
- fn f_102b2a8c @ 0x102b2b94 — f_102b29d0 action-list builder
- fn f_102b2a8c @ 0x102b2ba0 — f_102fcbf4

</details>


#### Events `confirmed`

None - pure read.
<details markdown="1"><summary>Evidence (3)</summary>

- fn f_102b2a8c @ f_102b2a8c — impl decode
- fn f_102b2a8c @ 0x102b2b94 — f_102b29d0 action-list builder
- fn f_102b2a8c @ 0x102b2ba0 — f_102fcbf4

</details>


#### Return behavior `confirmed`

0 on success; 718 for InstanceID!=0 where the arg exists.
<details markdown="1"><summary>Evidence (3)</summary>

- fn f_102b2a8c @ f_102b2a8c — impl decode
- fn f_102b2a8c @ 0x102b2b94 — f_102b29d0 action-list builder
- fn f_102b2a8c @ 0x102b2ba0 — f_102fcbf4

</details>


#### Errors

**`718`** `strong`

nonzero InstanceID rejected by the impl vfunc (rc 0x2ce materialised at the impl head)

- InstanceID argument was nonzero (the engine only accepts instance 0)


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f884c`
- dispatch entry `0x10eb30c0`
- impl call `0x102f88d0` obj `r5-in` slot `76` arg4 `*(sp-0x430+0x18)`
- impl call `0x102f8950` obj `vret(*(sp-0x430+0x42c),+0x24)` slot `16` arg4 `sp+0x1c`
- impl call `0x102f8964` obj `*(sp-0x430+0x42c)` slot `12` arg4 `?`
- req vcall `0x102f88a8` slot `8` (parse)

- fn f_102b2a8c @ f_102b2a8c — impl decode
- fn f_102b2a8c @ 0x102b2b94 — f_102b29d0 action-list builder
- fn f_102b2a8c @ 0x102b2ba0 — f_102fcbf4
- fn 0x102b2a8c — AVT impl vtable 0x10eaf2ec slot +0x4c entry
- fn 0x102f884c @ 0x102f884c — action wrapper handler
- @ 0x10eb30c0 — action dispatch table entry

</details>

### `GetDeviceCapabilities`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Returns what media this player can play/record and its recording quality modes.

**Technical description:** Returns PlayMedia, RecMedia, RecQualityModes capability strings. Impl f_102ad4a4 shares the getter boilerplate; no InstanceID input on this action per the extractor's arg map.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl guard with 718 | none - required argument |

- **`InstanceID`** — engine instance index; impl returns 718 when nonzero
  - validation: impl guard cmpwi r4,0: nonzero parsed value -> 718
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `PlayMedia` | string | impl-defined engine state |
| `RecMedia` | string | impl-defined engine state |
| `RecQualityModes` | string | impl-defined engine state |

- **`PlayMedia`** — Comma-separated playable media types.
  - validation: impl-written out arg
- **`RecMedia`** — Recordable media types (empty typical).
  - validation: impl-written out arg
- **`RecQualityModes`** — Supported record quality modes.
  - validation: impl-written out arg

#### Validation `confirmed`

See inputs.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad4a4 @ f_102ad4a4 — impl decode

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only (where present).
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad4a4 @ f_102ad4a4 — impl decode

</details>


#### State dependencies `confirmed`

Device capability strings read from static engine config; provenance unresolved.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad4a4 @ f_102ad4a4 — impl decode

</details>


#### Side effects

- Read-only under impl+0x458 mutex; no engine writes.

#### State transitions `confirmed`

None.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad4a4 @ f_102ad4a4 — impl decode

</details>


#### Events `confirmed`

None - pure read.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad4a4 @ f_102ad4a4 — impl decode

</details>


#### Return behavior `confirmed`

0 on success; 718 for InstanceID!=0 where the arg exists.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad4a4 @ f_102ad4a4 — impl decode

</details>


#### Errors

**`402`** `strong`

request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot 12 commit) whose arg-rejection path is the common 402 Invalid Args emitter

- malformed/missing SOAP arg envelope

**`718`** `strong`

Invalid InstanceID — parsed InstanceID != 0 rejected by the impl guard (proven convention: li r3,0x2ce sites across the f_102a*/f_102d* transport-object layer); rc forwarded verbatim through req vcall slot 12 commit

- InstanceID parses to nonzero / session object fails to resolve


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f8970`
- dispatch entry `0x10eb30cc`
- impl call `0x102f89b0` obj `r4-in` slot `28` arg4 `InstanceID`
- impl call `0x102f89cc` obj `r4-in` slot `8` arg4 `?`
- impl call `0x102f8a04` obj `r5-in` slot `28` arg4 `*(sp-0xc30+0x18)`
- impl call `0x102f8a20` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x1c)`
- impl call `0x102f8a84` obj `vret(*(sp-0xc30+0xc2c),+0x24)` slot `16` arg4 `sp+0x1c`
- impl call `0x102f8ab4` obj `vret(*(sp-0xc30+0xc2c),+0x24)` slot `16` arg4 `sp+0x41c`
- impl call `0x102f8ae4` obj `vret(*(sp-0xc30+0xc2c),+0x24)` slot `16` arg4 `sp+0x81c`
- req vcall `0x102f8af8` slot `12` (commit)

- fn f_102ad4a4 @ f_102ad4a4 — impl decode
- fn 0x102ad4a4 — AVT impl vtable 0x10eaf2ec slot +0x1c entry
- fn 0x102f8970 @ 0x102f8970 — action wrapper handler
- @ 0x10eb30cc — action dispatch table entry

</details>

### `GetMediaInfo`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Returns metadata about the current media source: track count and duration, current/next URIs + metadata, and the medium (queue, stream, line-in) - i.e. what container is loaded rather than where playback is within it (use GetPositionInfo for that).

**Technical description:** Returns media/session metadata: NrTracks, MediaDuration, CurrentURI, CurrentURIMetaData, NextURI, NextURIMetaData, PlayMedium, RecordMedium, WriteStatus. Impl f_102adcb4 shares the wide-arg getter boilerplate; fields come from the engine's media descriptor (impl+0x580/session for indexed, streamer otherwise).

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl guard with 718 | none - required argument |

- **`InstanceID`** — engine instance index; impl returns 718 when nonzero
  - validation: impl guard cmpwi r4,0: nonzero parsed value -> 718
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NrTracks` | unsigned int32 | impl-defined engine state |
| `MediaDuration` | string | impl-defined engine state |
| `CurrentURI` | string | impl-defined engine state |
| `CurrentURIMetaData` | string | impl-defined engine state |
| `NextURI` | string | impl-defined engine state |
| `NextURIMetaData` | string | impl-defined engine state |
| `PlayMedium` | string | impl-defined engine state |
| `RecordMedium` | string | impl-defined engine state |
| `WriteStatus` | string | impl-defined engine state |

- **`NrTracks`** — Track count of the current queue/media.
  - validation: impl-written out arg
- **`MediaDuration`** — Total media duration string.
  - validation: impl-written out arg
- **`CurrentURI`** — URI of current media.
  - validation: impl-written out arg
- **`CurrentURIMetaData`** — DIDL metadata for current media.
  - validation: impl-written out arg
- **`NextURI`** — URI of the queued next track/stream.
  - validation: impl-written out arg
- **`NextURIMetaData`** — Metadata for next media.
  - validation: impl-written out arg
- **`PlayMedium`** — Medium type being played (e.g. TRACK-N/NETWORK family).
  - validation: impl-written out arg
- **`RecordMedium`** — Recording medium (NONE typical).
  - validation: impl-written out arg
- **`WriteStatus`** — Write-protect status string.
  - validation: impl-written out arg

#### Validation `confirmed`

See inputs.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102adcb4 @ f_102adcb4 — impl decode

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only (where present).
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102adcb4 @ f_102adcb4 — impl decode

</details>


#### State dependencies `confirmed`

Media descriptor fields read from engine session state; per-field provenance unresolved.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102adcb4 @ f_102adcb4 — impl decode

</details>


#### Side effects

- Read-only under impl+0x458 mutex; no engine writes.

#### State transitions `confirmed`

None.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102adcb4 @ f_102adcb4 — impl decode

</details>


#### Events `confirmed`

None - pure read.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102adcb4 @ f_102adcb4 — impl decode

</details>


#### Return behavior `confirmed`

0 on success; 718 for InstanceID!=0 where the arg exists.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102adcb4 @ f_102adcb4 — impl decode

</details>


#### Errors

**`402`** `strong`

request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot 12 commit) whose arg-rejection path is the common 402 Invalid Args emitter

- malformed/missing SOAP arg envelope

**`718`** `strong`

Invalid InstanceID — parsed InstanceID != 0 rejected by the impl guard (proven convention: li r3,0x2ce sites across the f_102a*/f_102d* transport-object layer); rc forwarded verbatim through req vcall slot 12 commit

- InstanceID parses to nonzero / session object fails to resolve


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fa9e4`
- dispatch entry `0x10eb30d8`
- impl call `0x102faa38` obj `r4-in` slot `28` arg4 `InstanceID`
- impl call `0x102faa54` obj `r4-in` slot `8` arg4 `?`
- impl call `0x102faad0` obj `r5-in` slot `16` arg4 `*(sp-0x3870+0x44)`
- impl call `0x102faaec` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x10)`
- impl call `0x102fab88` obj `vret(*(sp-0x3870+0x386c),+0x24)` slot `16` arg4 `sp+0x4c`
- impl call `0x102fabb8` obj `vret(*(sp-0x3870+0x386c),+0x24)` slot `16` arg4 `sp+0x44c`
- impl call `0x102fabe8` obj `vret(*(sp-0x3870+0x386c),+0x24)` slot `16` arg4 `sp+0x184c`
- impl call `0x102fac18` obj `vret(*(sp-0x3870+0x386c),+0x24)` slot `16` arg4 `*(sp-0x3870+0x3854)`
- impl call `0x102fac48` obj `vret(*(sp-0x3870+0x386c),+0x24)` slot `16` arg4 `*(sp-0x3870+0x3858)`
- impl call `0x102fac78` obj `vret(*(sp-0x3870+0x386c),+0x24)` slot `16` arg4 `*(sp-0x3870+0x385c)`
- impl call `0x102faca8` obj `vret(*(sp-0x3870+0x386c),+0x24)` slot `16` arg4 `*(sp-0x3870+0x3860)`
- impl call `0x102facd8` obj `vret(*(sp-0x3870+0x386c),+0x24)` slot `16` arg4 `*(sp-0x3870+0x3864)`
- req vcall `0x102facec` slot `12` (commit)

- fn f_102adcb4 @ f_102adcb4 — impl decode
- fn 0x102adcb4 — AVT impl vtable 0x10eaf2ec slot +0x10 entry
- fn 0x102fa9e4 @ 0x102fa9e4 — action wrapper handler
- @ 0x10eb30d8 — action dispatch table entry

</details>

### `GetPositionInfo`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Returns where playback sits inside the media: current track number/URI/metadata, track duration, relative and absolute position times, and track counts.

**Technical description:** Returns position metadata for the current track: Track number, TrackDuration, TrackMetaData, TrackURI, RelTime, AbsTime, RelCount, AbsCount. Impl f_102b1a88 is the widest getter (~10 out pointers in r5-r10+stack); mode impl+0x4654 selects whether position comes from the indexed engine or the streamer session.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl guard with 718 | none - required argument |

- **`InstanceID`** — engine instance index; impl returns 718 when nonzero
  - validation: impl guard cmpwi r4,0: nonzero parsed value -> 718
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Track` | unsigned int32 | impl-defined engine state |
| `TrackDuration` | string | impl-defined engine state |
| `TrackMetaData` | string | impl-defined engine state |
| `TrackURI` | string | impl-defined engine state |
| `RelTime` | string | impl-defined engine state |
| `AbsTime` | string | impl-defined engine state |
| `RelCount` | signed int32 | impl-defined engine state |
| `AbsCount` | signed int32 | impl-defined engine state |

- **`Track`** — Current track ordinal (queue position for indexed sources).
  - validation: impl-written out arg
- **`TrackDuration`** — Duration string of current track.
  - validation: impl-written out arg
- **`TrackMetaData`** — DIDL metadata XML for the current track.
  - validation: impl-written out arg
- **`TrackURI`** — URI of the current track.
  - validation: impl-written out arg
- **`RelTime`** — Elapsed position within the track.
  - validation: impl-written out arg
- **`AbsTime`** — Absolute time position.
  - validation: impl-written out arg
- **`RelCount`** — Relative byte/frame count position.
  - validation: impl-written out arg
- **`AbsCount`** — Absolute byte/frame count.
  - validation: impl-written out arg

#### Validation `confirmed`

See inputs.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1a88 @ f_102b1a88 — impl decode

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only (where present).
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1a88 @ f_102b1a88 — impl decode

</details>


#### State dependencies `confirmed`

Mode impl+0x4654 selects the position source (indexed session vs streamer); per-field provenance unresolved.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1a88 @ f_102b1a88 — impl decode

</details>


#### Side effects

- Read-only under impl+0x458 mutex; no engine writes.

#### State transitions `confirmed`

None.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1a88 @ f_102b1a88 — impl decode

</details>


#### Events `confirmed`

None - pure read.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1a88 @ f_102b1a88 — impl decode

</details>


#### Return behavior `confirmed`

0 on success; 718 for InstanceID!=0 where the arg exists.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1a88 @ f_102b1a88 — impl decode

</details>


#### Errors

**`402`** `strong`

request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot 12 commit) whose arg-rejection path is the common 402 Invalid Args emitter

- malformed/missing SOAP arg envelope

**`718`** `strong`

Invalid InstanceID — parsed InstanceID != 0 rejected by the impl guard (proven convention: li r3,0x2ce sites across the f_102a*/f_102d* transport-object layer); rc forwarded verbatim through req vcall slot 12 commit

- InstanceID parses to nonzero / session object fails to resolve


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fbda4`
- dispatch entry `0x10eb30e4`
- impl call `0x102fbdfc` obj `r4-in` slot `28` arg4 `InstanceID`
- impl call `0x102fbe18` obj `r4-in` slot `8` arg4 `?`
- impl call `0x102fbea0` obj `r5-in` slot `24` arg4 `*(sp-0x2070+0x3c)`
- impl call `0x102fbebc` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x18)`
- impl call `0x102fbf50` obj `vret(*(sp-0x2070+0x206c),+0x24)` slot `16` arg4 `sp+0x4c`
- impl call `0x102fbf80` obj `vret(*(sp-0x2070+0x206c),+0x24)` slot `16` arg4 `sp+0x104c`
- impl call `0x102fbfb0` obj `vret(*(sp-0x2070+0x206c),+0x24)` slot `16` arg4 `sp+0x44c`
- impl call `0x102fbfe0` obj `vret(*(sp-0x2070+0x206c),+0x24)` slot `16` arg4 `*(sp-0x2070+0x205c)`
- impl call `0x102fc010` obj `vret(*(sp-0x2070+0x206c),+0x24)` slot `16` arg4 `*(sp-0x2070+0x2064)`
- req vcall `0x102fc06c` slot `12` (commit)

- fn f_102b1a88 @ f_102b1a88 — impl decode
- fn 0x102b1a88 — AVT impl vtable 0x10eaf2ec slot +0x18 entry
- fn 0x102fbda4 @ 0x102fbda4 — action wrapper handler
- @ 0x10eb30e4 — action dispatch table entry

</details>

### `GetRemainingSleepTimerDuration`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Returns the time left on the sleep timer and the timer generation counter.

**Technical description:** Returns RemainingSleepTimerDuration and CurrentSleepTimerGeneration. Impl f_102ada98 shares the getter boilerplate; reads the sleep-timer fields from the engine.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl guard with 718 | none - required argument |

- **`InstanceID`** — engine instance index; impl returns 718 when nonzero
  - validation: impl guard cmpwi r4,0: nonzero parsed value -> 718
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `RemainingSleepTimerDuration` | string | impl-defined engine state |
| `CurrentSleepTimerGeneration` | unsigned int32 | impl-defined engine state |

- **`RemainingSleepTimerDuration`** — Time left on the running sleep timer (empty/zero if none).
  - validation: impl-written out arg
- **`CurrentSleepTimerGeneration`** — Monotonic generation counter identifying the timer instance.
  - validation: impl-written out arg

#### Validation `confirmed`

See inputs.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ada98 @ f_102ada98 — impl decode

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only (where present).
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ada98 @ f_102ada98 — impl decode

</details>


#### State dependencies `confirmed`

Sleep-timer remaining time + generation counter read from engine timer state; field offsets unresolved.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ada98 @ f_102ada98 — impl decode

</details>


#### Side effects

- Read-only under impl+0x458 mutex; no engine writes.

#### State transitions `confirmed`

None.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ada98 @ f_102ada98 — impl decode

</details>


#### Events `confirmed`

None - pure read.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ada98 @ f_102ada98 — impl decode

</details>


#### Return behavior `confirmed`

0 on success; 718 for InstanceID!=0 where the arg exists.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ada98 @ f_102ada98 — impl decode

</details>


#### Errors

**`402`** `strong`

request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot 12 commit) whose arg-rejection path is the common 402 Invalid Args emitter

- malformed/missing SOAP arg envelope

**`718`** `strong`

Invalid InstanceID — parsed InstanceID != 0 rejected by the impl guard (proven convention: li r3,0x2ce sites across the f_102a*/f_102d* transport-object layer); rc forwarded verbatim through req vcall slot 12 commit

- InstanceID parses to nonzero / session object fails to resolve

**`800`** `strong`

800-series store/impl fault reachable through this getter’s impl vfunc chain (only code in its reachable band); specific trigger unverified

- impl worker returns an 800-class store/commit fault


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fb518`
- dispatch entry `0x10eb30f0`
- impl call `0x102fb558` obj `r4-in` slot `28` arg4 `InstanceID`
- impl call `0x102fb574` obj `r4-in` slot `8` arg4 `?`
- impl call `0x102fb5a0` obj `r5-in` slot `148` arg4 `*(sp-0x70+0x14)`
- impl call `0x102fb5bc` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x94)`
- impl call `0x102fb620` obj `vret(*(sp-0x70+0x6c),+0x24)` slot `16` arg4 `sp+0x1c`
- req vcall `0x102fb658` slot `12` (commit)

- fn f_102ada98 @ f_102ada98 — impl decode
- fn 0x102ada98 — AVT impl vtable 0x10eaf2ec slot +0x94 entry
- fn 0x102fb518 @ 0x102fb518 — action wrapper handler
- @ 0x10eb30f0 — action dispatch table entry

</details>

### `GetRunningAlarmProperties`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

If an alarm is currently ringing, returns its ID, group and the logged start time.

**Technical description:** Returns AlarmID, GroupID, LoggedStartTime for the currently-running alarm. Impl f_102ad8fc shares the getter boilerplate; empty outputs when no alarm is running.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl guard with 718 | none - required argument |

- **`InstanceID`** — engine instance index; impl returns 718 when nonzero
  - validation: impl guard cmpwi r4,0: nonzero parsed value -> 718
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `AlarmID` | unsigned int32 | impl-defined engine state |
| `GroupID` | string | impl-defined engine state |
| `LoggedStartTime` | string | impl-defined engine state |

- **`AlarmID`** — Identifier of the running alarm (empty if none).
  - validation: impl-written out arg
- **`GroupID`** — Group the alarm runs on.
  - validation: impl-written out arg
- **`LoggedStartTime`** — Start timestamp as logged by the alarm scheduler.
  - validation: impl-written out arg

#### Validation `confirmed`

See inputs.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad8fc @ f_102ad8fc — impl decode

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only (where present).
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad8fc @ f_102ad8fc — impl decode

</details>


#### State dependencies `confirmed`

Alarm context fields read from engine alarm state; empty when idle; provenance unresolved.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad8fc @ f_102ad8fc — impl decode

</details>


#### Side effects

- Read-only under impl+0x458 mutex; no engine writes.

#### State transitions `confirmed`

None.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad8fc @ f_102ad8fc — impl decode

</details>


#### Events `confirmed`

None - pure read.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad8fc @ f_102ad8fc — impl decode

</details>


#### Return behavior `confirmed`

0 on success; 718 for InstanceID!=0 where the arg exists.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad8fc @ f_102ad8fc — impl decode

</details>


#### Errors

**`402`** `strong`

request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot 12 commit) whose arg-rejection path is the common 402 Invalid Args emitter

- malformed/missing SOAP arg envelope

**`800`** `strong`

800-series store/impl fault reachable through this getter’s impl vfunc chain (only code in its reachable band); specific trigger unverified

- impl worker returns an 800-class store/commit fault


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fb664`
- dispatch entry `0x10eb30fc`
- impl call `0x102fb6a4` obj `r4-in` slot `28` arg4 `InstanceID`
- impl call `0x102fb6c0` obj `r4-in` slot `8` arg4 `?`
- impl call `0x102fb6f4` obj `r5-in` slot `160` arg4 `*(sp-0xb0+0x14)`
- impl call `0x102fb710` obj `r4-in` slot `20` arg4 `vret(r5-in,+0xa0)`
- impl call `0x102fb798` obj `vret(*(sp-0xb0+0xac),+0x24)` slot `16` arg4 `sp+0x1c`
- impl call `0x102fb7c8` obj `vret(*(sp-0xb0+0xac),+0x24)` slot `16` arg4 `sp+0x5c`
- req vcall `0x102fb7dc` slot `12` (commit)

- fn f_102ad8fc @ f_102ad8fc — impl decode
- fn 0x102ad8fc — AVT impl vtable 0x10eaf2ec slot +0xa0 entry
- fn 0x102fb664 @ 0x102fb664 — action wrapper handler
- @ 0x10eb30fc — action dispatch table entry

</details>

### `GetTransportInfo`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Returns transport state (PLAYING/PAUSED_PLAYBACK/STOPPED/TRANSITIONING), status and speed.

**Technical description:** Returns transport state/status/speed strings. Impl f_102b1738 gate (718) then worker f_102b1684: dispatches on mode impl+0x4654 (==2 -> indexed fill path 0x102b1a44; ==1 -> 0x102b19c8; else -> f_10308aec(impl+0x5d4,...) plus strlcpy of the impl+0x5dc source-name string into an out buffer). All outputs are filled by the worker under the impl+0x458 lock.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl guard with 718 | none - required argument |

- **`InstanceID`** — engine instance index; impl returns 718 when nonzero
  - validation: impl guard cmpwi r4,0: nonzero parsed value -> 718
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentTransportState` | string | impl-defined |
| `CurrentTransportStatus` | string | impl-defined |
| `CurrentSpeed` | string | impl-defined |

- **`CurrentTransportState`** — Transport-state string filled per mode (PLAYING/PAUSED_PLAYBACK/STOPPED family).
  - validation: impl-written out arg
- **`CurrentTransportStatus`** — Status string (OK / ERROR_OCCURRED family).
  - validation: impl-written out arg
- **`CurrentSpeed`** — Playback speed string - normally 1.
  - validation: impl-written out arg

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102b1738 @ 0x102b1738 — gate decode
- fn f_102b1684 @ 0x102b1684 — worker decode

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1738 @ 0x102b1818 — cmpwi r29,0 gate

</details>


#### State dependencies `confirmed`

mode impl+0x4654 selects which state source fills the outputs (indexed vs streamer vs default f_10308aec path).
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1684 @ 0x102b1928 — cmplwi mode,2/1 dispatch

</details>


#### Side effects

- Read-only under impl+0x458 mutex; copies engine state strings to the out pointers.

#### State transitions `confirmed`

None.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1738 @ 0x102b1738 — read-only

</details>


#### Events `confirmed`

None - pure read.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1738 @ 0x102b1738 — no emit calls

</details>


#### Return behavior `confirmed`

0 on success after filling outs; 718 only for InstanceID!=0. No other faults observed in the impl.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b1738 @ 0x102b17fc — return paths

</details>


#### Errors

**`718`** `strong`

nonzero InstanceID rejected by the impl vfunc (rc 0x2ce materialised at the impl head)

- InstanceID argument was nonzero (the engine only accepts instance 0)


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fbb60`
- dispatch entry `0x10eb3108`
- impl call `0x102fbbb4` obj `r4-in` slot `28` arg4 `InstanceID`
- impl call `0x102fbbd0` obj `r4-in` slot `8` arg4 `?`
- impl call `0x102fbc18` obj `r5-in` slot `20` arg4 `*(sp-0xc30+0x10)`
- impl call `0x102fbc34` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x14)`
- impl call `0x102fbcf0` obj `vret(*(sp-0xc30+0xc2c),+0x24)` slot `16` arg4 `sp+0x1c`
- impl call `0x102fbd20` obj `vret(*(sp-0xc30+0xc2c),+0x24)` slot `16` arg4 `sp+0x41c`
- impl call `0x102fbd50` obj `vret(*(sp-0xc30+0xc2c),+0x24)` slot `16` arg4 `*(sp-0xc30+0xc28)`
- req vcall `0x102fbc90` slot `64` (other)
- req vcall `0x102fbd64` slot `12` (commit)

- fn f_102b1738 @ 0x102b1738 — gate decode
- fn f_102b1684 @ 0x102b1684 — worker decode
- fn 0x102b1738 — AVT impl vtable 0x10eaf2ec slot +0x14 entry
- fn 0x102fbb60 @ 0x102fbb60 — action wrapper handler
- @ 0x10eb3108 — action dispatch table entry

</details>

### `GetTransportSettings`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Returns the current play mode (NORMAL/REPEAT_ALL/SHUFFLE…) and recording quality mode.

**Technical description:** Returns PlayMode and RecQualityMode. Impl f_102ad634 shares the getter boilerplate; PlayMode reflects the enum written by SetPlayMode (NORMAL..SHUFFLE_REPEAT_ONE mapped back to its string).

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl guard with 718 | none - required argument |

- **`InstanceID`** — engine instance index; impl returns 718 when nonzero
  - validation: impl guard cmpwi r4,0: nonzero parsed value -> 718
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `PlayMode` | string | impl-defined engine state |
| `RecQualityMode` | string | impl-defined engine state |

- **`PlayMode`** — Current play-mode string; maps the stored enum 0-5 back to its name.
  - validation: impl-written out arg
- **`RecQualityMode`** — Record quality mode string (NOT_IMPLEMENTED typical).
  - validation: impl-written out arg

#### Validation `confirmed`

See inputs.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad634 @ f_102ad634 — impl decode

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only (where present).
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad634 @ f_102ad634 — impl decode

</details>


#### State dependencies `confirmed`

PlayMode string derived from the stored play-mode enum; RecQualityMode from engine settings; field provenance unresolved.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad634 @ f_102ad634 — impl decode

</details>


#### Side effects

- Read-only under impl+0x458 mutex; no engine writes.

#### State transitions `confirmed`

None.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad634 @ f_102ad634 — impl decode

</details>


#### Events `confirmed`

None - pure read.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad634 @ f_102ad634 — impl decode

</details>


#### Return behavior `confirmed`

0 on success; 718 for InstanceID!=0 where the arg exists.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102ad634 @ f_102ad634 — impl decode

</details>


#### Errors

**`402`** `strong`

request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot 12 commit) whose arg-rejection path is the common 402 Invalid Args emitter

- malformed/missing SOAP arg envelope

**`718`** `strong`

Invalid InstanceID — parsed InstanceID != 0 rejected by the impl guard (proven convention: li r3,0x2ce sites across the f_102a*/f_102d* transport-object layer); rc forwarded verbatim through req vcall slot 12 commit

- InstanceID parses to nonzero / session object fails to resolve


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f8340`
- dispatch entry `0x10eb3114`
- impl call `0x102f8380` obj `r4-in` slot `28` arg4 `InstanceID`
- impl call `0x102f839c` obj `r4-in` slot `8` arg4 `?`
- impl call `0x102f83cc` obj `r5-in` slot `32` arg4 `*(sp-0x830+0x18)`
- impl call `0x102f83e8` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x20)`
- impl call `0x102f844c` obj `vret(*(sp-0x830+0x82c),+0x24)` slot `16` arg4 `sp+0x1c`
- impl call `0x102f847c` obj `vret(*(sp-0x830+0x82c),+0x24)` slot `16` arg4 `sp+0x41c`
- req vcall `0x102f8490` slot `12` (commit)

- fn f_102ad634 @ f_102ad634 — impl decode
- fn 0x102ad634 — AVT impl vtable 0x10eaf2ec slot +0x20 entry
- fn 0x102f8340 @ 0x102f8340 — action wrapper handler
- @ 0x10eb3114 — action dispatch table entry

</details>

### `Next`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Skips to the next track in the queue. Faults (typically 711/701 family) if the current source doesn't support skipping.

**Technical description:** Skips to the next track. Impl f_102b9874 gate (718) then body at 0x102b98d4: lock impl+0x458, log 'upnp'/'next', call f_102b60b0. The worker reads mode impl+0x4654: mode!=2 -> f_102b0140 (submit op-0x19 via f_102aff9c then streamer next vfunc f_106a7a34(*(impl+0x5a0)) - returns streamer result, nonzero=ok); mode==2 -> indexed path: f_102b5ddc, build a request record (f_1032e270 + f_1032e494 against impl+0x5dc), submit via f_10255f64(impl+0x580) with rc map {2->800, 3->711, else->701}; a deeper 'next-source' path calls f_102b1c5c + f_102b4b48/f_10256a84(op 5). Success clears impl+0x6ed8 and returns 0.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x38 with 718 | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102b9874 @ 0x102b9874 — gate decode
- fn f_102b60b0 @ 0x102b60b0 — worker decode

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b9874 @ 0x102b9874 — gate decode

</details>


#### State dependencies `confirmed`

mode impl+0x4654==2 selects indexed queue advance; otherwise streamer session path via impl+0x5a0.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b60b0 @ 0x102b60dc — cmplwi mode,2

</details>


#### Side effects

- Impl locks the engine mutex at impl+0x458 (f_10557cac/f_10557848) for the operation. Track-advance request submitted to impl+0x580 (indexed) or streamer vfunc (stream); impl+0x6ed8 cleared on success.

#### State transitions `confirmed`

Current track advances by one (indexed) or streamer skip issued; submission vs completion distinction preserved: stream-mode success means the streamer vfunc returned nonzero.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b60b0 @ 0x102b61f8 — f_10256a84(op5) source-activate path

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8674 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

Indexed submit rc {2->800,3->711,else->701}; stream path: streamer vfunc nonzero -> 0 else 701.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b60b0 @ 0x102b6184 — rc->800/711/701 isel map

</details>


#### Errors

**`718`** `strong`

apply worker f_102b60b0 exit accumulator r30: literal {701 x2, 0, 800} plus call-derived; impl-side 718 on InstanceID!=0 stands; rc forwarded verbatim

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)


**Bounded unknown — proven:** literal paths bounded
**Bounded unknown — unresolved:** apply-worker call-derived rc (session/track lookup chain f_102b8c44)

**`701`** `confirmed`

Operation not currently possible - streamer vfunc returned 0 (no session/rejected) or indexed submit returned an unmapped rc.

- stream mode: f_106a7a34 streamer result == 0; indexed: submit rc not in {0,2,3}

**`711`** `confirmed`

Indexed submit rc==3 - request rejected by impl+0x580 (queue end / illegal target).

- f_10255f64 submit returned 3

**`800`** `confirmed`

Indexed submit rc==2 - a distinct engine rejection code (exact semantics unresolved, mapped verbatim).

- f_10255f64 submit returned 2

**`402`** `confirmed`

Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs.

- typed argument parse or request-shape check failed in the wrapper

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f8674`
- dispatch entry `0x10eb3120`
- impl call `0x102f86f0` obj `r5-in` slot `56` arg4 `*(sp-0x30+0x18)`
- impl call `0x102f8754` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x102f86d0` slot `8` (parse)

- fn f_102b9874 @ 0x102b9874 — gate decode
- fn f_102b60b0 @ 0x102b60b0 — worker decode
- fn 0x102b9874 — AVT impl vtable 0x10eaf2ec slot +0x38 entry
- fn 0x102f8674 @ 0x102f8674 — action wrapper handler
- @ 0x10eb3120 — action dispatch table entry

</details>

### `NotifyDeletedURI`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Tells the player a URI it may have queued has been deleted from the server so it can drop or skip it.

**Technical description:** Notifies the player that a URI it may be playing has been deleted upstream. Impl f_102d5858: after the 718-gate and impl+0x458 lock it runs strcmp(DeletedURI, impl+0x5dc) — the current source URI. A mismatch is a silent success no-op: the player ignores deletion notices for URIs it is not using. On a match it logs "job"/"deleted uri", zero-fills a small request record, and submits a recovery job via f_102ceb40(impl+0xa21c, 0x10ea6a2c, 0x10ea6a2c, 0x10ea6a2c, &rec) — likely triggering source-failover or stop behavior for the deleted content.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x48 with 718 | none - required argument |
| `DeletedURI` | SonosStringArg | yes | Any string; only exact match with the active source has an effect / max 1024 chars | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`DeletedURI`** — URI that was deleted upstream; compared verbatim (strcmp) against the current source URI at impl+0x5dc. Only an exact match triggers the recovery job.
  - buffer cap: `0x401`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f912c — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r30 v\[+0x48\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f912c — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x48\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f912c — member vfunc calls: \['r30 v\[+0x48\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x48\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x48\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f912c — no transition-literal/store pattern; member delegates: \['r30 v\[+0x48\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f912c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f912c — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`vret(r5-in,+0x48)`** `strong`

impl returns 0 unconditionally after the gate

- n/a - every post-gate path returns 0


**Bounded unknown — proven:** impl returns 0 unconditionally after the gate
**Bounded unknown — unresolved:** none identified — the job-submission result is not propagated

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f912c`
- dispatch entry `0x10eb312c`
- impl call `0x102f91d4` obj `r5-in` slot `72` arg4 `*(sp-0x430+0x14)`
- impl call `0x102f9238` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x102f91b0` slot `8` (parse)

- fn 0x102f912c @ 0x102f912c — action wrapper handler
- @ 0x10eb312c — action dispatch table entry
- fn 0x102d5858 — AVT impl vtable 0x10eaf2ec slot +0x48 entry

</details>

### `Pause`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Pauses playback. Only valid while playing; faults on sources that can't pause.

**Technical description:** Pauses playback. Impl f_102d2b28 gate (718 on InstanceID!=0) then body f_102d2b38: lock impl+0x458, log 'upnp'/'pause', run f_102b00cc. That worker submits control op 0x19 via f_102aff9c(impl+0x5dc) and, on submission success, invokes the streamer pause vfunc f_106a7880(*(impl+0x5a0)). The worker returns 0 on submission failure or the streamer vfunc result on success. If the worker returned 0 the impl falls back to f_102d0ac8(impl,1,1,-1,-1) and returns its rc.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x30 with 718 | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102d2b28 @ 0x102d2b28 — gate+body decode
- fn f_102b00cc @ 0x102b00cc — worker decode

</details>


#### Requirements / preconditions `confirmed`

None beyond InstanceID==0; no mode gate in the impl entry itself.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102d2b28 @ 0x102d2b28 — gate decode

</details>


#### State dependencies `strong`

Requires a live streamer/control target for the fast path; otherwise the f_102d0ac8 fallback handles (or fails) it.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b00cc @ 0x102b0134 — f_106a7880 on *(impl+0x5a0)

</details>


#### Side effects

- Impl locks the engine mutex at impl+0x458 (f_10557cac/f_10557848) for the operation. Op-0x19 submitted to impl+0x5dc; streamer pause vfunc invoked when submission succeeds.

#### State transitions `confirmed`

Pause submitted to control target + streamer; submission vs actual pause completion is the accepted/submitted distinction - the SOAP call returns after the streamer vfunc returns, not after audio pauses.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b00cc @ 0x102b0134 — streamer vfunc path

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8588 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

Success iff worker returned nonzero (submitted + streamer accepted) OR the f_102d0ac8 fallback succeeded; impl rc = fallback rc on the zero path, else 0.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102d2bcc @ 0x102d2be0 — fallback call f_102d0ac8(impl,1,1,-1,-1)

</details>


#### Errors

**`718`** `strong`

impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1c\] -> f_105614e0 into a stack word, passes that word in r4 to the impl vfunc; impl guard cmpwi r4,0 / beq -> body, fallthrough returns 0x2ce (718); only instance 0 exists in this build; remaining rc paths call-derived

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)


**Bounded unknown — proven:** the fault path is reached when the impl call reports failure
**Bounded unknown — unresolved:** impl entry guard returns 0x2ce (718) when r4 arg/out ptr is null (see 0x102d2b28 entry); remaining paths call-derived

**`vret(r5-in,+0x30)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: fallback worker f_102d0ac8 domain {0x2bd=701 (x7 sites), 0}; direct streamer path rcs also surfaced

- f_102b00cc returned 0 AND f_102d0ac8 returned nonzero


**Bounded unknown — proven:** fallback rc returned as impl status when streamer path failed
**Bounded unknown — unresolved:** impl entry guard returns 0x2ce (718) when r4 arg/out ptr is null (see 0x102d2b28 entry); remaining paths call-derived

**`402`** `confirmed`

Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs.

- typed argument parse or request-shape check failed in the wrapper


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f8588`
- dispatch entry `0x10eb3138`
- impl call `0x102f8604` obj `r5-in` slot `48` arg4 `*(sp-0x30+0x18)`
- impl call `0x102f8668` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x102f85e4` slot `8` (parse)

- fn f_102d2b28 @ 0x102d2b28 — gate+body decode
- fn f_102b00cc @ 0x102b00cc — worker decode
- fn 0x102d2b28 — AVT impl vtable 0x10eaf2ec slot +0x30 entry
- fn 0x102f8588 @ 0x102f8588 — action wrapper handler
- @ 0x10eb3138 — action dispatch table entry

</details>

### `Play`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Starts or resumes playback. Speed selects the rate - '1' is normal; fractional rate strings select slower/faster trick-play on sources that support it.

**Technical description:** Starts playback. Impl f_102d4078: InstanceID!=0 -> 718; strcmp(Speed,'1')!=0 -> 717 (speeds other than literal '1' are rejected outright); then locks impl+0x458, logs 'upnp'/'play', and dispatches on source mode. A 'Received play for non-muse source' path rebuilds the source via f_102c350c+f_102b2ee4; the normal path runs f_102b0058 and, when it returns 0, submits play via f_102cfa50(impl,-1,-1,0). A state-changed emit via f_100caad8 follows on the submit path.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x2c with 718 | none - required argument |
| `Speed` | string | yes | literal "1" only - strcmp in impl; anything else -> 717 / max 1023 chars | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`Speed`** — Playback speed string; impl does strcmp(Speed,"1") - ONLY the exact string '1' is accepted, any other value (including '1.0' or '') returns SOAP fault 717.
  - special values: `1` = the only accepted speed
  - buffer cap: `0x400`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102d4078 @ 0x102d4078 — full impl decode

</details>


#### Requirements / preconditions `confirmed`

Speed must be exactly '1'. Engine object must be live; *(impl+0x3dc)!=0 gates the logging preamble.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102d4078 @ 0x102d4110 — strcmp(Speed,"1")

</details>


#### State dependencies `strong`

Mode-dependent behavior through f_102d39ac('upnp') and *(impl+0x3dc): a non-muse source triggers a rebuild/log path before play is submitted.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10eb145c — 'Received play for non-muse source'

</details>


#### Side effects

- Impl locks the engine mutex at impl+0x458 (f_10557cac/f_10557848) for the operation. Submit path calls f_102cfa50(impl,-1,-1,0) (track=-1,pos=-1 = resume/current).

#### State transitions `confirmed`

Play submission to the engine/session machinery; exact track-selection semantics of the -1,-1 sentinels unresolved.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102d4078 @ 0x102d4204 — -1,-1 sentinel args

</details>


#### Events `strong`

f_100caad8 is invoked on the submit path - the shared transport-changed emit used by the getter-scope boilerplate.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102d4078 @ 0x102d41e8 — f_100caad8 call

</details>


#### Return behavior `confirmed`

rc of f_102cfa50 (or the non-muse path result) is returned as the impl status; cr0.eq=success convention -> SOAP emit vs req->v\[+0x14\] fault.
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f9244 — wrapper decode

</details>


#### Errors

**`718`** `confirmed`

impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1c\] -> f_105614e0 into a stack word, passes that word in r4 to the impl vfunc; impl guard cmpwi r4,0 / beq -> body, fallthrough returns 0x2ce (718); only instance 0 exists in this build; remaining rc paths call-derived

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)

**`717`** `confirmed`

Speed was not the exact string '1'.

- strcmp(Speed,'1') != 0 - including '1.0','0','' or any other speed

**`vret(r5-in,+0x2c)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (InstanceID), 717 (Speed != literal "1" - strcmp gate at 0x102d4118), downstream submission rc

- submission helper returned a nonzero engine rc

**`402`** `confirmed`

Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs.

- typed argument parse or request-shape check failed in the wrapper

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f9244`
- dispatch entry `0x10eb3144`
- impl call `0x102f92ec` obj `r5-in` slot `44` arg4 `*(sp-0x430+0x18)`
- impl call `0x102f9350` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x102f92c8` slot `8` (parse)

- fn f_102d4078 @ 0x102d4078 — full impl decode
- fn 0x102d4078 — AVT impl vtable 0x10eaf2ec slot +0x2c entry
- fn 0x102f9244 @ 0x102f9244 — action wrapper handler
- @ 0x10eb3144 — action dispatch table entry

</details>

### `Previous`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Skips back to the previous track.

**Technical description:** Skips to the previous track. Impl f_102b9938 gate (718) then body at 0x102b9998: lock impl+0x458, log 'upnp'/'previous', call f_102b6214. mode!=2 -> f_102b01b4 (submit op-0x19 then streamer prev vfunc at *(impl+0x5a0); streamer nonzero=ok). mode==2 -> FIRST checks capability: f_10258ab0(impl+0x580,0,1) bit 0x00100000 - if the source cannot skip back, returns success WITHOUT submitting anything (silent no-op). If capable: f_102b5ddc, build rec, submit f_10255f64; nonzero rc -> 711, zero -> clear impl+0x6ed8 + return 0.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x3c with 718 | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102b9938 @ 0x102b9938 — gate decode
- fn f_102b6214 @ 0x102b6214 — worker decode

</details>


#### Requirements / preconditions `confirmed`

InstanceID==0 only.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b9938 @ 0x102b9938 — gate decode

</details>


#### State dependencies `confirmed`

Indexed path requires source capability bit 0x00100000 from f_10258ab0(impl+0x580,0,1); without it Previous is a silent success no-op.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b6214 @ 0x102b6288 — andis. caps,0x10 -> silent success

</details>


#### Side effects

- Impl locks the engine mutex at impl+0x458 (f_10557cac/f_10557848) for the operation. Track-back request submitted (indexed) or streamer vfunc; impl+0x6ed8 cleared on success.

#### State transitions `confirmed`

Moves to previous track when the source supports it; capability-gated no-op otherwise - request accepted vs operation submitted distinction is explicit in this impl.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b6214 @ 0x102b6288 — capability short-circuit

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8760 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

rc==0 on success incl. the capability no-op; 711 on indexed submit failure; 701 on streamer failure.
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102b6214 @ 0x102b62dc — li r3,0x2c7
- fn f_102b6214 @ 0x102b624c — r30=0x2bd

</details>


#### Errors

**`718`** `strong`

apply worker f_102b6214: literal {701, 0, 711} plus call-derived; impl-side 718 stands; rc forwarded verbatim

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)


**Bounded unknown — proven:** literal paths bounded
**Bounded unknown — unresolved:** apply-worker call-derived rc (session/track lookup chain f_102b8c44)

**`701`** `confirmed`

Stream-mode skip failed - the streamer vfunc returned 0 (no live session or rejected).

- mode!=2 and streamer vfunc result == 0

**`711`** `confirmed`

Indexed submit failed - the impl+0x580 engine rejected the track-back request.

- mode==2, cap bit set, and f_10255f64 returned nonzero

**`402`** `confirmed`

Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs.

- typed argument parse or request-shape check failed in the wrapper

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f8760`
- dispatch entry `0x10eb3150`
- impl call `0x102f87dc` obj `r5-in` slot `60` arg4 `*(sp-0x30+0x18)`
- impl call `0x102f8840` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x102f87bc` slot `8` (parse)

- fn f_102b9938 @ 0x102b9938 — gate decode
- fn f_102b6214 @ 0x102b6214 — worker decode
- fn 0x102b9938 — AVT impl vtable 0x10eaf2ec slot +0x3c entry
- fn 0x102f8760 @ 0x102f8760 — action wrapper handler
- @ 0x10eb3150 — action dispatch table entry

</details>

### `RemoveAllTracksFromQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Clears the implicit playback queue entirely.

**Technical description:** Removes every track from the local queue. Impl f_102b3bf4 delegates to shared worker f_102b3a84(engine,0,0): it formats its first arg with snprintf("%u") and compares it against stored queue-id strings inside the indexed session impl+0x580 (fields +0x2d8ec skip-match and +0x2fff4 match); the hardcoded selector 0 targets the default queue. When the selector matches, f_10149b24 iterates the queue-list object at session+0x2ff98 and f_102b397c performs the removal; a selector mismatch yields 718.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x78 with 718 | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f8cc4 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x78\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8cc4 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x78\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8cc4 — member vfunc calls: \['r30 v\[+0x78\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x78\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x78\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8cc4 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x78\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8cc4 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8cc4 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1c\] -> f_105614e0 into a stack word, passes that word in r4 to the impl vfunc; impl guard cmpwi r4,0 / beq -> body, fallthrough returns 0x2ce (718); only instance 0 exists in this build; remaining rc paths call-derived

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)

**`vret(r5-in,+0x78)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (InstanceID gate at impl head); shared engine worker f_102b3a84 domain {718 queue-record lookup, 0x404=1028, callee-fwd}

- shared worker returned a nonzero code not covered by the 718 selector check

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage


#### Notes

None The Queue service reaches the identical engine worker through queue-manager vtable 0x10ed1bcc -> *(qm+0x128).

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f8cc4`
- dispatch entry `0x10eb315c`
- impl call `0x102f8d40` obj `r5-in` slot `120` arg4 `*(sp-0x30+0x18)`
- impl call `0x102f8da4` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x102f8d20` slot `8` (parse)

- fn 0x102f8cc4 @ 0x102f8cc4 — action wrapper handler
- @ 0x10eb315c — action dispatch table entry
- fn 0x102b3bf4 — AVT impl vtable 0x10eaf2ec slot +0x78 entry

</details>

### `RemoveTrackFromQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Removes the queued track identified by ObjectID (track object id), guarded by UpdateID for optimistic concurrency.

**Technical description:** Removes a single track from the queue. Impl f_102aa770: after the 718-gate it fetches the queue's current update-id via f_10149b24(session+0x2d890). A nonzero UpdateID argument must equal that current id or the action returns 0x404 (decimal 1028) — optimistic concurrency; UpdateID=0 skips the check. Mode impl+0x4654 must be 1 or 2 (else 800). It then builds a request record via f_1032e270, tags it with f_1032e440(rec,1,ObjectID), and submits via f_10255f64(session). Submission returns nonzero on success: on success it probes impl+0x5dc via f_1014708c and may clear impl+0x6ed8, returning 0; on submission failure it returns 800.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x70 with 718 | none - required argument |
| `ObjectID` | SonosStringArg | yes | Any string the request-record builder accepts; no local validation beyond presence / max 1023 chars | none - required argument |
| `UpdateID` | SonosUintArg | yes | 0 (skip check) or exactly the current queue update-id - mismatch faults 1028 / 0 or current update-id | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`ObjectID`** — Identifies the queue entry to remove; stored verbatim into the request record by f_1032e440 (e.g. a queue object id).
  - buffer cap: `0x400`
- **`UpdateID`** — Optimistic-concurrency token: 0 disables the check; any nonzero value must equal the session's current queue update-id fetched via f_10149b24.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f9aa8 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1, commit×1); member delegates: r30 v\[+0x70\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9aa8 — req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x70\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9aa8 — member vfunc calls: \['r30 v\[+0x70\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x70\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x70\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9aa8 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x70\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9aa8 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9aa8 — commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`1028`** `confirmed`

UpdateID argument was nonzero and did not equal the current queue update-id.

- UpdateID!=0 and UpdateID != session update-id

**`800`** `confirmed`

Transport mode is not 1 or 2, OR the session submission f_10255f64 returned 0 (failure).

- (impl+0x4654 - 1) unsigned > 1, or submission failed

**`vret(r5-in,+0x70)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (InstanceID), 0x404=1028, 800, 0 — producers at 0x102aa7bc/0x102aa830/0x102aa840/0x102aa8a8

- a code path not covered by the enumerated checks produced a result


**Bounded unknown — proven:** impl returns the preloaded code r31
**Bounded unknown — unresolved:** any other rc the request-record builders could surface

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f9aa8`
- dispatch entry `0x10eb3168`
- impl call `0x102f9b8c` obj `r5-in` slot `112` arg4 `*(sp-0x430+0x14)`
- impl call `0x102f9bf4` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x102f9b64` slot `8` (parse)

- fn 0x102f9aa8 @ 0x102f9aa8 — action wrapper handler
- @ 0x10eb3168 — action dispatch table entry
- fn 0x102aa770 — AVT impl vtable 0x10eaf2ec slot +0x70 entry

</details>

### `RemoveTrackRangeFromQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Removes NumberOfTracks consecutive tracks starting at 1-based StartingIndex; returns the NewUpdateID.

**Technical description:** Removes a contiguous range of queue tracks. Impl f_102acca8: InstanceID!=0 -> 718; then two hard rejections BEFORE any work — StartingIndex==0 and NumberOfTracks==0 each return 402 (both arguments are 1-based). The worker f_102aca78 locks impl+0x458, formats the InstanceID-derived selector "0" via snprintf("%u") and matches it against the session queue-id strings (session+0x2d8ec skip, +0x2fff4 match — selector mismatch yields 718), fetches the current queue update-id via f_10149b24(session+0x2ff98), enforces the same optimistic UpdateID check (nonzero and != current -> 1028), requires mode 1|2 (else 800), and performs the range removal with NewUpdateID written through the out pointer.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x74 with 718 | none - required argument |
| `UpdateID` | SonosUintArg | yes | 0 (skip check) or exactly the current queue update-id / 0 or current update-id | none - required argument |
| `StartingIndex` | SonosUintArg | yes | 1..queue length - 0 faults 402 / 1..N | none - required argument |
| `NumberOfTracks` | SonosUintArg | yes | 1..queue length - 0 faults 402 / 1..N | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero. It is additionally reused by the worker as the queue selector formatted "%u" — value 0 selects the default queue.
  - buffer cap: `0x18`
- **`UpdateID`** — Optimistic-concurrency token: 0 disables the check; nonzero must equal the current queue update-id else 1028.
  - buffer cap: `0x18`
- **`StartingIndex`** — 1-based index of the first track to remove. Value 0 is rejected with 402 before any queue work — the impl treats it as invalid, not as "first element".
  - buffer cap: `0x18`
- **`NumberOfTracks`** — Count of tracks to remove starting at StartingIndex. Value 0 is rejected with 402.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NewUpdateID` | unsigned int32 | post-mutation queue UpdateID / length-bounded by parse-helper buffer cap |

- **`NewUpdateID`** — New queue update-id written by the worker through the out pointer after a successful removal.
  - validation: copied from the queue record update counter

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102faf24 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×4, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x74\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102faf24 — req-vfunc call map: {'0x1c': 4, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x74\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102faf24 — member vfunc calls: \['r30 v\[+0x74\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x74\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x74\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102faf24 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x74\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102faf24 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102faf24 — commit/fault slot usage: {'0x1c': 4, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

Nonzero InstanceID, or the "%u"-formatted selector fails the session queue-id strcmp.

- InstanceID nonzero or selector mismatch at session+0x2fff4

**`1028`** `confirmed`

UpdateID argument was nonzero and did not equal the current queue update-id.

- UpdateID!=0 and != session update-id

**`800`** `confirmed`

Transport mode impl+0x4654 is not 1 or 2.

- (impl+0x4654 - 1) unsigned > 1

**`vret(r5-in,+0x74)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (InstanceID), 402 (null range record); shared worker f_102aca78 domain {402, 800, 718}

- the removal body produced a code not covered by the enumerated gates


**Bounded unknown — proven:** worker rc surfaced
**Bounded unknown — unresolved:** the actual removal path beyond 0x102ace58 was not fully traced — additional submission codes may exist

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102faf24`
- dispatch entry `0x10eb3174`
- impl call `0x102fb01c` obj `r5-in` slot `116` arg4 `*(sp-0x40+0x18)`
- impl call `0x102fb0a4` obj `*(sp-0x40+0x3c)` slot `12` arg4 `?`
- req vcall `0x102fafec` slot `8` (parse)

- fn 0x102faf24 @ 0x102faf24 — action wrapper handler
- @ 0x10eb3174 — action dispatch table entry
- fn 0x102acca8 — AVT impl vtable 0x10eaf2ec slot +0x74 entry

</details>

### `ReorderTracksInQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Moves a run of tracks (StartingIndex + NumberOfTracks) to InsertBefore within the queue, UpdateID-guarded.

**Technical description:** Moves a contiguous block of queue tracks to a new position. Impl f_102acf60: InstanceID!=0 -> 718, then three hard zero-checks before any queue work — StartingIndex==0, NumberOfTracks==0 and InsertBefore==0 each return 402 (all positions are 1-based). Passing those, it tail-calls the shared queue-operation worker family entry f_102accf0 with an operation selector — the same machinery family used by RemoveTrackRangeFromQueue (queue-id selector match, UpdateID concurrency, impl+0x458 lock).

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x6c with 718 | none - required argument |
| `StartingIndex` | SonosUintArg | yes | 1..queue length - 0 faults 402 / u32 track index validated against queue length by the reorder worker | none - required argument |
| `NumberOfTracks` | SonosUintArg | yes | 1..queue length - 0 faults 402 / u32 count; worker validates StartingIndex+NumberOfTracks <= queue length | none - required argument |
| `InsertBefore` | SonosStringArg | yes | 1..queue length - 0 faults 402 / length-bounded by parse-helper buffer cap | none - required argument |
| `UpdateID` | SonosStringArg | yes | 0 (skip) or current queue update-id / length-bounded by parse-helper buffer cap | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`StartingIndex`** — 1-based index of the first track to move - 0 faults 402.
  - buffer cap: `0x18`
- **`NumberOfTracks`** — Size of the block to move - 0 faults 402.
  - buffer cap: `0x18`
- **`InsertBefore`** — 1-based insertion point for the moved block - 0 faults 402.
  - buffer cap: `0x18`
- **`UpdateID`** — Optimistic-concurrency token handled by the shared worker (nonzero must match current queue update-id, as in RemoveTrackRangeFromQueue).
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f8f88 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×5, validate×1, commit×1); member delegates: r30 v\[+0x6c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8f88 — req-vfunc call map: {'0x1c': 5, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x6c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8f88 — member vfunc calls: \['r30 v\[+0x6c\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x6c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x6c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8f88 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x6c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8f88 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f8f88 — commit/fault slot usage: {'0x1c': 5, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

Nonzero InstanceID, or shared-worker queue-selector mismatch.

- InstanceID nonzero or selector strcmp fails

**`402`** `confirmed`

Any of StartingIndex/NumberOfTracks/InsertBefore is zero.

- r5==0, r7==0, or r6==0 at the impl gate
- Missing or unparseable input argument at the wrapper parse stage

**`vret(r5-in,+0x6c)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (InstanceID), 402 (null record args x2); shared worker f_102accf0 domain {0x404=1028, 800, 718}

- the shared worker produced a code not covered by the impl-level gates


**Bounded unknown — proven:** shared worker rc surfaced
**Bounded unknown — unresolved:** UpdateID-mismatch and mode codes from the shared worker family (1028/800 there) — which apply here is not fully traced


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f8f88`
- dispatch entry `0x10eb3180`
- impl call `0x102f90b8` obj `r5-in` slot `108` arg4 `*(sp-0x40+0x18)`
- impl call `0x102f9120` obj `*(sp-0x40+0x3c)` slot `12` arg4 `402`
- req vcall `0x102f9088` slot `8` (parse)

- fn 0x102f8f88 @ 0x102f8f88 — action wrapper handler
- @ 0x10eb3180 — action dispatch table entry
- fn 0x102acf60 — AVT impl vtable 0x10eaf2ec slot +0x6c entry

</details>

### `ReorderTracksInSavedQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Rewrites a saved queue's ordering from TrackList/NewPositionList; returns length change and new UpdateID.

**Technical description:** Reorders tracks within a saved queue. Impl f_102bd238 is an arg-shifting 718-gate dispatching into saved-queue worker f_1047a3bc. ObjectID, UpdateID, TrackList/NewPositionList and the out params are forwarded positionally.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x8c with 718 | none - required argument |
| `ObjectID` | SonosStringArg | yes | saved-queue object id string / max 1023 chars | none - required argument |
| `UpdateID` | SonosStringArg | yes | client-held saved-queue UpdateID / length-bounded by parse-helper buffer cap | none - required argument |
| `TrackList` | SonosStringArg | yes | comma-separated u32 track indices <= parse cap / max 4096 chars | none - required argument |
| `NewPositionList` | SonosUintArg | yes | comma-separated u32 positions <= parse cap; must match TrackList arity / max 2048 chars | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`ObjectID`** — Forwarded positionally to the f_1047a3bc subsystem worker.
  - buffer cap: `0x400`
- **`UpdateID`** — Forwarded positionally to the f_1047a3bc subsystem worker.
  - buffer cap: `0x18`
- **`TrackList`** — Forwarded positionally to the f_1047a3bc subsystem worker.
  - buffer cap: `0x1001`
- **`NewPositionList`** — Forwarded positionally to the f_1047a3bc subsystem worker.
  - buffer cap: `0x801`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `QueueLengthChange` | signed int32 | signed delta applied by the reorder / length-bounded by parse-helper buffer cap |
| `NewQueueLength` | unsigned int32 | "0" or "1" via bool-style parse helper; literal semantics under action validation / {0,1} |
| `NewUpdateID` | unsigned int32 | post-mutation queue UpdateID / length-bounded by parse-helper buffer cap |

- **`QueueLengthChange`** — Written by the f_1047a3bc worker on success.
  - validation: worker-computed delta
- **`NewQueueLength`** — Written by the f_1047a3bc worker on success.
  - validation: written from the queue record length after the mutation
- **`NewUpdateID`** — Written by the f_1047a3bc worker on success.
  - validation: copied from the queue-record update counter

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fc078 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×5, out-arg write×3, validate×1, commit×1); member delegates: r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc078 — req-vfunc call map: {'0x1c': 5, '0x8': 1, '0x14': 1, '0x24': 3, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc078 — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc078 — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc078 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc078 — commit/fault slot usage: {'0x1c': 5, '0x8': 1, '0x14': 1, '0x24': 3, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`vret(r5-in,+0x8c)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: saved-queue worker rc fwd

- the subsystem worker produced a code not covered by the gate


**Bounded unknown — proven:** saved-queue worker rc returned
**Bounded unknown — unresolved:** impl entry guard returns 0x2ce (718) when r4 arg/out ptr is null (see 0x102bd238 entry); remaining paths call-derived

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,805,806,807,808,810,811,812,813,814,850,899}. f_1047ee0c literal exits {501,701,802-808,810-812}; f_1047db08 (queue-add path, 'UPNP error %d adding URI to saved queue') {805,814}; f_10477fe8 reorder engine {600,812,813,850,899}; f_10476cb4 returns 899 on equal list head/tail (+0x44 count nonzero). 899 = real return (li r3;blr), 850/813 in reorder domain, 600 lone. Per-rung trigger semantics undecoded except reorder guard.

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Shim behavior: validates r4 (arg vector) non-null else returns 0x2ce (718) directly; loads queue-manager singleton 0x11096770 as worker `this`, bumps *(token+4) on session token 0x11096774, calls the 0x1047xxxx worker, then f_100c5050 release.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fc078`
- dispatch entry `0x10eb318c`
- impl call `0x102fc1b0` obj `r5-in` slot `140` arg4 `*(sp-0x1c40+0x10)`
- impl call `0x102fc280` obj `*(sp-0x1c40+0x1c3c)` slot `12` arg4 `?`
- req vcall `0x102fc170` slot `8` (parse)

- fn 0x102fc078 @ 0x102fc078 — action wrapper handler
- @ 0x10eb318c — action dispatch table entry
- fn 0x102bd238 — AVT impl vtable 0x10eaf2ec slot +0x8c entry

</details>

### `RunAlarm`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Server-driven 'fire this alarm now' trigger carrying the full alarm definition - used internally when an alarm goes off; also useful for testing alarm playback.

**Technical description:** Immediately runs a programmed alarm. Impl f_102e1d68 is a thin 718-gate tail-calling shared alarm worker f_102e17dc — the same worker family as StartAutoplay (f_102e14e0): it builds the program record, checks the submission path via f_1053ce34, and calls f_1053db38 on the session.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x98 with 718 | none - required argument |
| `AlarmID` | SonosStringArg | yes | u32 id of a scheduled alarm record; unknown id -> 800-family / length-bounded by parse-helper buffer cap | none - required argument |
| `LoggedStartTime` | SonosStringArg | yes | HH:MM:SS start-time string <= parse cap / max 63 chars | none - required argument |
| `Duration` | SonosUintArg | yes | HH:MM:SS duration string <= parse cap / max 63 chars | none - required argument |
| `ProgramURI` | SonosUriArg | yes | program URI string <= parse cap / max 1024 chars | none - required argument |
| `ProgramMetaData` | SonosMetaDataArg | yes | DIDL-Lite XML string <= parse cap / max 4096 chars | none - required argument |
| `PlayMode` | SonosBoolArg | yes | transport play-mode enum string <= parse cap / max 31 chars | none - required argument |
| `Volume` | SonosUintArg | yes | u32 volume; applied by the alarm-run path / parsed u32; worker-clamped | none - required argument |
| `IncludeLinkedZones` | SonosBoolArg | yes | boolean flag parsed as u32 / {0,1} | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`AlarmID`** — Forwarded to shared alarm worker f_102e17dc.
  - buffer cap: `0x18`
- **`LoggedStartTime`** — Forwarded to shared alarm worker f_102e17dc.
  - buffer cap: `0x40`
- **`Duration`** — Forwarded to shared alarm worker f_102e17dc.
  - buffer cap: `0x40`
- **`ProgramURI`** — Forwarded to shared alarm worker f_102e17dc.
  - buffer cap: `0x401`
- **`ProgramMetaData`** — Forwarded to shared alarm worker f_102e17dc.
  - buffer cap: `0x1001`
- **`PlayMode`** — Forwarded to shared alarm worker f_102e17dc.
  - buffer cap: `0x20`
- **`Volume`** — Forwarded to shared alarm worker f_102e17dc.
  - buffer cap: `0x18`
- **`IncludeLinkedZones`** — Forwarded to shared alarm worker f_102e17dc.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fc4ac — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×9, validate×1, commit×1); member delegates: r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc4ac — req-vfunc call map: {'0x1c': 9, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc4ac — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc4ac — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc4ac — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc4ac — commit/fault slot usage: {'0x1c': 9, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`vret(r5-in,+0x98)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: alarm worker f_102e17dc domain {402, 0x401=1025, 0x32a=810}; exit rc=402 site

- the worker produced a code not covered by the gate

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage


#### Notes

None Impl gate: null arg vector -> 0x2ce (718). Worker resolves pending-alarm state through the duration/time helper family (0x1108b284/f_10c3eb60).

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fc4ac`
- dispatch entry `0x10eb3198`
- impl call `0x102fc684` obj `r5-in` slot `152` arg4 `*(sp-0x14e0+0x1c)`
- impl call `0x102fc6e8` obj `*(sp-0x14e0+0x14dc)` slot `12` arg4 `402`
- req vcall `0x102fc63c` slot `8` (parse)

- fn 0x102fc4ac @ 0x102fc4ac — action wrapper handler
- @ 0x10eb3198 — action dispatch table entry
- fn 0x102e1d68 — AVT impl vtable 0x10eaf2ec slot +0x98 entry

</details>

### `SaveQueue`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Saves the current playback queue as a named saved queue (Title); ObjectID selects an existing saved queue to overwrite. Returns AssignedObjectID.

**Technical description:** Saves the current queue as a named saved-queue (Sonos playlist). Impl f_102aa8b4: 718-gate, lock impl+0x458, mode impl+0x4654 must be 1 or 2 (else 800). Title is bounded-copied into a 0x400-byte buffer (f_10906304), whitespace-trimmed via sonosTrimWhitespace, then validated: empty-after-trim -> 402, and strpbrk rejects any \r or \n -> 402. On success it calls f_10146e94(session+0x2d890, title, ObjectID, out-params) — the same persistence/path helper BackupQueue uses — storing the queue under the given ObjectID and writing the assigned object id.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x7c with 718 | none - required argument |
| `Title` | SonosStringArg | yes | Non-empty after sonosTrimWhitespace, and must not contain carriage-return or line-feed characters - violations fault 402 / max 1023 chars | none - required argument |
| `ObjectID` | SonosStringArg | yes | Any string accepted by the persistence helper / max 1023 chars | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`Title`** — Saved-queue name, copied into a 0x400-byte buffer then whitespace-trimmed.
  - buffer cap: `0x400`
- **`ObjectID`** — Requested object id / parent selector passed through to f_10146e94.
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `AssignedObjectID` | SonosStringArg | sq:-family object id assigned by the saved-queue store / length-bounded by parse-helper buffer cap |

- **`AssignedObjectID`** — Object id assigned to the new saved queue, written by f_10146e94 through the out pointer.
  - validation: output of the persistence path f_10146e94

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f96fc — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×3, out-arg write×1, validate×1, commit×1); member delegates: r30 v\[+0x7c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f96fc — req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x7c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f96fc — member vfunc calls: \['r30 v\[+0x7c\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x7c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x7c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f96fc — no transition-literal/store pattern; member delegates: \['r30 v\[+0x7c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f96fc — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f96fc — commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`800`** `confirmed`

Transport mode impl+0x4654 is not 1 or 2.

- (impl+0x4654 - 1) unsigned > 1

**`402`** `confirmed`

Title was empty after whitespace trimming, or contained a CR/LF character.

- trimmed Title\[0\]==0 or strpbrk(Title,"\r\n")!=NULL
- Missing or unparseable input argument at the wrapper parse stage

**`vret(r5-in,+0x7c)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718, 800, 402, callee-fwd — producers at 0x102aa910/0x102aa968/0x102aa984

- f_10146e94 returned a nonzero code


**Bounded unknown — proven:** f_10146e94 persistence rc returned
**Bounded unknown — unresolved:** concrete codes the saved-queue persistence helper can produce (storage/duplicate errors)

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,805,806,807,808,810,811,812,813,814,850,899}. f_1047ee0c literal exits {501,701,802-808,810-812}; f_1047db08 (queue-add path, 'UPNP error %d adding URI to saved queue') {805,814}; f_10477fe8 reorder engine {600,812,813,850,899}; f_10476cb4 returns 899 on equal list head/tail (+0x44 count nonzero). 899 = real return (li r3;blr), 850/813 in reorder domain, 600 lone. Per-rung trigger semantics undecoded except reorder guard.

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f96fc`
- dispatch entry `0x10eb31a4`
- impl call `0x102f97d8` obj `r5-in` slot `124` arg4 `*(sp-0xc30+0x18)`
- impl call `0x102f9858` obj `vret(*(sp-0xc30+0xc2c),+0x24)` slot `16` arg4 `sp+0x81c`
- impl call `0x102f986c` obj `*(sp-0xc30+0xc2c)` slot `12` arg4 `?`
- req vcall `0x102f97a8` slot `8` (parse)

- fn 0x102f96fc @ 0x102f96fc — action wrapper handler
- @ 0x10eb31a4 — action dispatch table entry
- fn 0x102aa8b4 — AVT impl vtable 0x10eaf2ec slot +0x7c entry

</details>

### `Seek`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Repositions playback. Unit selects the seek mode: TRACK_NR jumps to a track number, REL_TIME seeks to 'HH:MM:SS' from track start, TIME_DELTA does a relative jump. Parsing is lenient (numeric prefixes accepted, trailing junk ignored) but the accepted Unit set and the semantics depend on whether the source is indexed or streamed - a request can be accepted yet ignored downstream, so check GetPositionInfo after seeking.

**Technical description:** Repositions playback within the current transport source, dispatched to the zone-player engine as impl vfunc +0x34 -> f_102b95a8(engine,InstanceID,Unit,Target): queue/track ordinal seek (TRACK_NR) or time seek (REL_TIME absolute / TIME_DELTA relative).

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | instance selector (integer) | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x34 with 718 | none |
| `Unit` | seek mode token | yes | `TRACK_NR`, `REL_TIME`, `TIME_DELTA` / max 1023 chars | none |
| `Target` | SonosTrackOrdinal (TRACK_NR) or SonosSeekTime (REL_TIME/TIME_DELTA) - see payload_formats | yes | TRACK_NR: textual decimal whose strtol result lies in 1..65534. REL_TIME/TIME_DELTA: three u8-wrapping decimal components; computed value = h*3600+m*60+s seconds. / max 1023 chars | none |

- **`InstanceID`** — Numeric transport-instance selector; the implementation accepts only 0 and rejects any other parsed value with error 718 before dispatching to the seek engine.
  - special values: `0` = the only instance this zone player implements; anything else faults
  - validation: Request-layer validation faults 402 if absent/malformed (req vfunc +0x08 at 0x102f9408); implementation returns 718 when the parsed value is nonzero (0x102b9660-0x102b9668); on a successful engine call the value is stored into engine+0x6ed8 (0x102b96d4) but is not otherwise interpreted.
  - The value is range-checked only; it is not forwarded as a seek operand.
  - buffer cap: `0x18`
- **`Unit`** — Seek-mode token; the engine compares it with strcmp against a fixed set and interprets Target accordingly.
  - special values: `TRACK_NR` = target is a queue/track ordinal; only reached when engine mode field (this+0x4654) == 2 and capability bit 0x400000 is set, else 701; `REL_TIME` = target is an absolute time position (H:M:S); in stream mode always allowed, in indexed mode requires capability bit 0x200000; negative target rejected with 711 in indexed mode; `TIME_DELTA` = target is a relative time delta (H:M:S); same gating as REL_TIME; a zero delta is a no-op success in indexed mode
  - validation: strcmp chain in f_102b9088: indexed mode (engine+0x4654==2) accepts TRACK_NR/REL_TIME/TIME_DELTA (unknown -> 710 at 0x102b9320-0x102b9338); stream mode accepts only REL_TIME/TIME_DELTA (anything else -> 701 at 0x102b90e0-0x102b91b0). Missing or oversized argument faults 402 at the request layer.
  - buffer cap: `0x400`
- **`Target`** — Destination operand whose syntax depends on Unit: a decimal track ordinal for TRACK_NR, or a \[-\]H:M:S time for REL_TIME/TIME_DELTA.
  - unit: track ordinal; or seconds
  - special values: `TRACK_NR text beyond 1..65534 (incl. '0', '-5', '65537', saturating input)` = rejected with 711: validation is (strtol_result - 1) <= 0xFFFD unsigned on the UNMASKED value; the u16 truncation (rlwinm r4,r30,0,16,31 at 0x102b938c) only sizes the record field and never rescues an out-of-range text - '65537' faults, it does not wrap to track 1; `TRACK_NR with trailing junk, leading whitespace, '+', or zeros (' 5', '+5', '05', '5abc')` = accepted - strtol skips ws/sign and endptr is NULL so the tail is ignored; `'--H:M:S' or signed components ('-5:00:00' after the outer sign, '+01:02:03')` = accepted: the outer '-' is consumed manually, then each %hhu applies strtoul sign/wrap rules, so '--0:1:0' parses as negative-(251:00:00 wrapped) - a quirk of layering the manual sign over %hhu; `'00:00:00' or '-00:00:00' (REL_TIME/TIME_DELTA, indexed mode)` = zero magnitude -> success WITHOUT submitting any request (0x102b92d4-0x102b9318); '-00:00:00' under REL_TIME still faults 711 because the sign check precedes the zero check; `'-H:M:S' (REL_TIME, indexed mode)` = rejected with 711 - sign flag byte nonzero and Unit != TIME_DELTA (0x102b9258-0x102b9270); `'-H:M:S' (TIME_DELTA, indexed mode)` = accepted; parser negates only the low seconds word (neg at 0x102ab920, hi word stays 0) plus a separate sign byte; submitted as a negative relative offset; `'-H:M:S' (stream mode)` = not sign-checked at all - the negated seconds word *1000 yields a negative millisecond operand passed straight to the session vfunc; outcome is downstream-determined; `'256:00:00' / '999:99:99' (either mode)` = accepted with u8 wraparound: 256->0, 999->231 etc.; there is no upper bound check on the total; `'1 :2:3' (whitespace before a colon)` = rejected - the ':' literals in the scanf format must match immediately; `'01:02:03junk'` = accepted - sscanf stops after the 3rd conversion and the tail is never inspected
  - validation: TRACK_NR (indexed mode only): strtol result must satisfy (t-1) <= 0xFFFD unsigned else 711; on success u16 field t&0xffff is recorded in the rchsrcreq tag-8 record (the truncation is field-width only; the range check ran on the raw strtol value, so no wrap-to-valid exists). REL_TIME/TIME_DELTA: f_102ab830 failure -> 711 indexed / 701 stream; indexed-mode leading '-' under REL_TIME -> 711; indexed-mode zero magnitude -> silent success no-op; stream mode performs no sign or zero gating. Missing/unparsable at the request layer -> 402.
  - Track normalization: strtol -> record field = value & 0xffff -> range check on the RAW value (raw-1 <= 0xFFFD). Ordering means the stored u16 equals the input for every accepted value; masking cannot wrap an out-of-range ordinal into range.
  - buffer cap: `0x400`

#### Validation

Request layer: all three arguments fetched by name (req vfunc +0x1c); req vfunc +0x08 must return nonzero else fault 402. Impl f_102b95a8: InstanceID must be 0 else 718. Engine f_102b9088 branches on engine+0x4654 (source mode): ==2 -> indexed path (TRACK_NR with cap 0x400000, REL_TIME/TIME_DELTA with cap 0x200000, unknown -> 710); !=2 -> stream path (only REL_TIME/TIME_DELTA, unknown -> 701, direct streamer vfunc seek). See Target validation notes for per-mode parsers.

#### Requirements / preconditions `strong`

**group coordinator:** No coordinator/group check exists in the Seek path itself (confirmed: no such test between wrapper and submission). Any group/coordinator routing happens downstream inside the chsrc transaction engine or streamer session and is not yet characterized.
**transport states:** none checked directly; behavior depends on engine source-mode field this+0x4654 (==2 indexed/queue path, otherwise direct-stream path)
**media capabilities:** Indexed path requires capability bitmask from f_10258ab0(engine+0x580,0,1): bit 0x400000 enables TRACK_NR, bit 0x200000 enables REL_TIME/TIME_DELTA (andis. at 0x102b91a8 / 0x102b9214). Stream path performs no capability check.
**service binding:** service object must have a bound implementation (svc+4 non-NULL) else dispatcher faults 401; service enable byte ctx+0x571c gates the whole service
**serialization:** engine mutex at this+0x458 is held across the operation (lock guard at 0x102b9644)
**status note:** every constraint call-derived from disassembly (0x102b91a8/0x102b9214 andis., f_10258ab0 capability mask, engine+0x4654 mode field); downstream chsrc engine checks are runtime-internal, not observable preconditions

#### State dependencies

- engine+0x4654 source-mode enum (writers store only 0/1/2 across engine code; constructor initializes 2; transitions e.g. 'if mode!=2 set 2' at 0x102ce968/0x102d50c4 when a source activates) selects the indexed/rchsrcreq path (==2) vs the direct-streamer path (!=2); exact per-value source mapping not yet fully characterized
- capability mask produced at runtime by f_10258ab0(*(engine+0x580)) from the current channel-source/media state - bit 0x200000 = time-seek permitted, bit 0x400000 = track-ordinal seek permitted (usage confirmed; bit derivation internal to chsrc.cxx logic)
- engine+0x580 = channel-source object (rchsrcreq submission target); engine+0x5a0 = streamer object used by stream-mode path; engine+0x5dc = queue object (sibling path)

#### Side effects

- Engine mutex at this+0x458 is acquired for the duration of the call (scoped lock at 0x102b9624-0x102b9674).
- On success (engine rc==0) stores the InstanceID into engine+0x6ed8.
- Indexed mode (engine+0x4654==2): builds an 'rchsrcreq' source-change record - tag 8 carries u16 track ordinal (TRACK_NR), tag 9 carries the {seconds, fraction} word pair plus flags (REL_TIME/TIME_DELTA) - and enqueues it to the channel-source transaction engine via f_10255f64(engine+0x580,rec); application is asynchronous. A zero-magnitude time target skips submission entirely and still returns success (0x102b92d4-0x102b9318).
- Stream mode (engine+0x4654!=2): f_106a7930(engine+0x5a0, seconds*1000, isDelta, &flag@sp+0x1e) locks the streamer, resolves the current stream session (streamer+0x354 -> +4 -> vfunc+0x2c) and invokes its vfunc +0x10 (absolute, REL_TIME) or +0x14 (delta, TIME_DELTA) with the signed millisecond operand. The vfunc's own byte result is written to the out-flag, which only selects a 'seek time' log line - it is NOT propagated into the SOAP result, so a streamer-side rejection still returns success.

#### State transitions

None synchronously. The accepted seek is queued/applied by the player engine after the call returns; decoder, position and track-index state change happen inside the async transaction/streamer path, not in this handler.

#### Events

No UPnP event is emitted synchronously by this path; the SOAP response is committed immediately after the engine accepts the request while the actual position/track change is applied asynchronously by the chsrc transaction or streamer session. Any LastChange/state-variable update therefore originates downstream of the async apply and is not statically proven in this path.

#### Return behavior

The impl returns an integer status. On 0 the wrapper commits an empty 200 OK via req vfunc +0x0c (0x102f9494). On nonzero the code is forwarded to the request fault path req vfunc +0x14 at 0x102f944c and surfaces as the UPnPError errorCode. Caveats: (1) the wrapper tests cr0 rather than r3 at 0x102f9440; impl epilogues' stack-canary xor. leaves cr0.eq=1 on normal return, so rc reaches the completion vfunc +0x0c with r4=rc which handles the status-bearing response - the +0x14 branch is effectively a fallback. (2) In stream mode rc==0 only proves a session object accepted the call; the session vfunc's byte result is captured to a flag that gates a log line (0x102b91d8) and is not reflected in the SOAP status - a rejected streamer seek still reports success. (3) In indexed mode rc==0 only proves the rchsrcreq was enqueued, not that the seek applied; a zero-magnitude time target returns 0 without enqueueing at all.

#### Errors

**`402`** `confirmed`

SOAP-level invalid-args fault when request argument parsing/validation fails.

- Any of InstanceID/Unit/Target missing, unparsable, or failing the request-layer validation: req vfunc +0x08 returns 0 at 0x102f9408, wrapper loads code 402 and calls req vfunc +0x14.

**`401`** `confirmed`

Action unreachable: the AVTransport service object has no bound implementation pointer.

- Dispatcher loads *(svc+4) at 0x102fa6c8; NULL -> req vfunc +0x14 with code 401.

Service-level dispatcher fault, not produced by the Seek handler itself.

**`718`** `confirmed`

impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1c\] -> f_105614e0 into a stack word, passes that word in r4 to the impl vfunc; impl guard cmpwi r4,0 / beq -> body, fallthrough returns 0x2ce (718); only instance 0 exists in this build; remaining rc paths call-derived

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)

**`701`** `confirmed`

Seek not permitted: unit unsupported in current mode, capability bit clear, malformed target in stream mode, or the submit/streamer chain failed.

- Stream mode (engine+0x4654 != 2): Unit is neither REL_TIME nor TIME_DELTA.
- Stream mode: Target fails the %hhu:%hhu:%hhu parse.
- Stream mode: f_106a7930 returns 0 (no streamer session: this+0x5a0 -> +0x354 -> +4 -> vfunc+0x2c chain broken).
- Indexed mode: Unit==TRACK_NR but capability bit 0x400000 is clear.
- Indexed mode: Unit is REL_TIME or TIME_DELTA but capability bit 0x200000 is clear.
- Indexed mode: rchsrcreq submission via f_10255f64 returns 0 for a REL_TIME/TIME_DELTA seek.

**`710`** `confirmed`

Unit token not recognized (indexed mode only).

- Indexed mode (engine+0x4654==2): Unit is none of TRACK_NR/REL_TIME/TIME_DELTA.

In stream mode unknown units produce 701, not 710.

**`711`** `confirmed`

Illegal seek target: malformed time, negative REL_TIME, out-of-range track, or failed track submission.

- Indexed mode: REL_TIME/TIME_DELTA Target fails the %hhu:%hhu:%hhu parse.
- Indexed mode: REL_TIME Target carries a leading '-' sign.
- Indexed mode: TRACK_NR Target outside 1..65534 (strtol t; rejects when (t-1) unsigned > 0xFFFD, i.e. t<=0 or t>=65535, including saturating/negative results).
- Indexed mode: rchsrcreq track submission via f_10255f64 returns 0.

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

Impl chain: svc+4 impl object -> vfunc +0x34 = f_102b95a8 (vtable entries at 0x10eaf320 and 0x10edfbec both resolve slot +0x34 to it). f_102b95a8(engine,inst,unit,target): inst!=0 -> 718; else f_102b9088(engine,unit,target). Internal callers of the same engine exist (f_102b9464 seeks REL_TIME '00:00:00' as a reset). Accepted Units are mode-dependent, not a single static enum.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f935c`
- dispatch entry `0x10eb31b0`
- impl call `0x102f9430` obj `r5-in` slot `52` arg4 `*(sp-0x830+0x18)`
- impl call `0x102f9494` obj `*(sp-0x830+0x82c)` slot `12` arg4 `402`
- req vcall `0x102f9408` slot `8` (parse)

- fn 0x102f935c @ 0x102f935c — action wrapper handler
- @ 0x10eb31b0 — action dispatch table entry
- fn 0x102f935c @ 0x102f9428 — wrapper calls impl->vfunc\[+0x34\](inst,unit,target) via bctrl
- @ 0x10eaf320 — vtable slot: vptr 0x10eaf2ec+0x34 -> f_102b95a8; identical at 0x10edfbec for vptr 0x10edfbb8
- fn 0x102b9088 @ 0x102b9088 — seek engine: Unit strcmp chains, Target parsers, cap gating, submit calls
- fn 0x102b95a8 — AVT impl vtable 0x10eaf2ec slot +0x34 entry

</details>

### `SetAVTransportURI`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Loads a new source: a track/stream URI plus its DIDL-Lite metadata. This is how a client starts a radio stream or a file URI - the previous queue position is not implied; you typically call Play afterwards.

**Technical description:** Sets the playback URI (class A impl f_102dcb58): a pure 718-gate tail-calling shared URI-set worker f_102dc81c with the URI/metadata args forwarded. This is one of the four actions where engine classes A (vtable 0x10eaf2ec, impl 0x102dcb58) and B (vtable 0x10edfbb8, impl 0x10513230) differ — B is the group-aware variant reached in grouped mode; semantics described are the A path.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x08 with 718 | none - required argument |
| `CurrentURI` | SonosUriArg | yes | Worker-validated URI string / max 1024 chars | none - required argument |
| `CurrentURIMetaData` | SonosMetaDataArg | yes | Worker-validated DIDL string / length-bounded by parse-helper buffer cap | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`CurrentURI`** — Playback URI installed by the shared worker.
  - buffer cap: `0x401`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fa71c — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1, commit×1); member delegates: r30 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa71c — req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa71c — member vfunc calls: \['r30 v\[+0x8\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x8\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa71c — no transition-literal/store pattern; member delegates: \['r30 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa71c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa71c — commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1c\] -> f_105614e0 into a stack word, passes that word in r4 to the impl vfunc; impl guard cmpwi r4,0 / beq -> body, fallthrough returns 0x2ce (718); only instance 0 exists in this build; remaining rc paths call-derived

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)

**`vret(r5-in,+0x8)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: URI-set worker f_102dc81c forwards downstream rcs (f_102ceb40, f_102cfa50); no direct constants

- the worker produced a code not covered by the gate


**Bounded unknown — proven:** shared URI-set worker f_102dc81c rc returned
**Bounded unknown — unresolved:** URI validation, source-mode and session codes inside the worker; also the class-B group variant 0x10513230 is unexplored

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Engine-class split: on the group-capable engine (vtable 0x10edfbb8) this action dispatches to 0x10513230 - group worker f_10512bc0 with extra descriptor arg 0x10ea6a2c. Ungrouped zones get identical behavior to the standalone engine for the Become* actions.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fa71c`
- dispatch entry `0x10eb31bc`
- impl call `0x102fa7fc` obj `r5-in` slot `8` arg4 `*(sp-0x1440+0x10)`
- impl call `0x102fa874` obj `*(sp-0x1440+0x143c)` slot `12` arg4 `402`
- req vcall `0x102fa7d4` slot `8` (parse)

- fn 0x102fa71c @ 0x102fa71c — action wrapper handler
- @ 0x10eb31bc — action dispatch table entry
- fn 0x102dcb58 — AVT impl vtable 0x10eaf2ec (class A) / 0x10edfbb8 B-variant 0x10513230 slot +0x08 entry

</details>

### `SetCrossfadeMode`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Turns crossfade on or off.

**Technical description:** Sets crossfade on/off. Impl f_102b99fc gate (718) then body f_102b9a0c: lock impl+0x458, log 'upnp'/'change crossfade', call f_102b26dc. The worker REQUIRES mode impl+0x4654==2 (indexed) - anything else -> 712 immediately. In indexed mode it further requires f_101471f0(impl+0x5dc)!=0 AND strncmp(current URI,'x-sonosapi-hls:',15)!=0 AND f_101475dc!=0 (crossfade-capable, non-HLS source). When the source cannot crossfade: arg==0 still succeeds silently, arg!=0 -> 712. When capable: a request record (f_1032e270 + f_1032e550(rec,arg,1)) is submitted via f_10255f64(impl+0x580); success clears impl+0x6ed8.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x44 with 718 | none - required argument |
| `CrossfadeMode` | string | yes | Parsed as a numeric byte (type-tag parser); value 0 is always accepted, nonzero requires an indexed-mode, non-HLS, crossfade-capable source. / see accepted_values | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`CrossfadeMode`** — Parsed as a numeric byte (type-tag parser); value 0 is always accepted, nonzero requires an indexed-mode, non-HLS, crossfade-capable source.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102b99fc @ 0x102b99fc — gate decode
- fn f_102b26dc @ 0x102b26dc — worker decode

</details>


#### Requirements / preconditions `confirmed`

Only meaningful when a queued/indexed source is active (mode==2); streaming sources reject nonzero crossfade.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b26dc @ 0x102b2704 — cmpwi mode,2 -> 712 otherwise

</details>


#### State dependencies `confirmed`

Source must be crossfade-capable (f_101471f0, f_101475dc) and not an 'x-sonosapi-hls:' URI - HLS streams cannot crossfade.
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102b26dc @ 0x102b2768 — strncmp(uri,'x-sonosapi-hls:',15)
- fn f_102b26dc @ 0x102b277c — f_101475dc cap check

</details>


#### Side effects

- Impl locks the engine mutex at impl+0x458 (f_10557cac/f_10557848) for the operation. Crossfade request submitted to impl+0x580; impl+0x6ed8 cleared on success.

#### State transitions `confirmed`

Crossfade mode applied through the indexed request machinery; arg==0 on an incapable source is a silent success no-op.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b26dc @ 0x102b27cc — arg==0 -> success even when blocked

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa158 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

0 on success (incl. silent no-op); 712 for wrong mode, incapable source, or submit failure.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b26dc @ 0x102b270c — li r3,0x2c8

</details>


#### Errors

**`718`** `strong`

impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1c\] -> f_105614e0 into a stack word, passes that word in r4 to the impl vfunc; impl guard cmpwi r4,0 / beq -> body, fallthrough returns 0x2ce (718); only instance 0 exists in this build; remaining rc paths call-derived

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)


**Bounded unknown — proven:** the fault path is reached when the impl call reports failure
**Bounded unknown — unresolved:** impl entry guard returns 0x2ce (718) when r4 arg/out ptr is null (see 0x102b99fc entry); remaining paths call-derived

**`712`** `confirmed`

Crossfade rejected: transport mode !=2 (not indexed), source not crossfade-capable, HLS stream, nonzero arg on incapable source, or submit failed.

- impl+0x4654 mode != 2
- f_101471f0 or f_101475dc returned 0, or URI starts with x-sonosapi-hls:, with arg != 0
- f_10255f64 submit returned nonzero

**`402`** `confirmed`

Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs.

- typed argument parse or request-shape check failed in the wrapper


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fa158`
- dispatch entry `0x10eb31c8`
- impl call `0x102fa1fc` obj `r5-in` slot `68` arg4 `*(sp-0x30+0x18)`
- impl call `0x102fa260` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x102fa1d8` slot `8` (parse)

- fn f_102b99fc @ 0x102b99fc — gate decode
- fn f_102b26dc @ 0x102b26dc — worker decode
- fn 0x102b99fc — AVT impl vtable 0x10eaf2ec slot +0x44 entry
- fn 0x102fa158 @ 0x102fa158 — action wrapper handler
- @ 0x10eb31c8 — action dispatch table entry

</details>

### `SetNextAVTransportURI`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Sets up gapless playback: the URI + metadata that should follow the current track, so the decoder can pre-buffer it.

**Technical description:** Sets the gapless next-track URI. Impl f_102af288: 718-gate, lock impl+0x458, then a hard mode gate — impl+0x4654 must equal 2 (indexed/queued mode); any other mode returns 800, so next-URI only works on queue playback. In mode 2 it calls worker f_102af1c8(engine, NextURI, NextURIMetaData), which stores the URI into the next-track record at impl+0x6edc/0x6ee0 (f_106faeb8), manages pending flags impl+0x754c/+0x75cd (cleared) and impl+0x764e (set), fetches the current source URI via f_10293270(impl+0x5dc) and compares it against the engine source name impl+0x3dc: when they differ, the URI is forwarded through the member/topology path (member obj impl+0x448 -> f_10765a00/f_10762c30/f_106fbef4, with "lookup of %s URIs for %s failed" topology logging on failure) — i.e. the next-track request can be delegated to the actual playback member.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x0c with 718 | none - required argument |
| `NextURI` | SonosStringArg | yes | Any URI string accepted by the record writer f_106faeb8 / max 1024 chars | none - required argument |
| `NextURIMetaData` | SonosStringArg | yes | Any metadata string accepted by the record writer / length-bounded by parse-helper buffer cap | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`NextURI`** — URI for the next track; stored into the next-record and, for delegated sources, forwarded through the member/topology path.
  - buffer cap: `0x401`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fa880 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1, commit×1); member delegates: r30 v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa880 — req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa880 — member vfunc calls: \['r30 v\[+0xc\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0xc\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0xc\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa880 — no transition-literal/store pattern; member delegates: \['r30 v\[+0xc\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa880 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fa880 — commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`800`** `confirmed`

Transport mode impl+0x4654 is not 2 — next-URI requires indexed/queue playback.

- impl+0x4654 != 2 — impl/parse rc path to shared fault emitter (see evidence)

**`vret(r5-in,+0xc)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: worker f_102af1c8 domain {0x2bd=701}; exit rc=701

- the delegated-URI path produced a code not covered by the enumerated gates


**Bounded unknown — proven:** worker f_102af1c8 rc returned
**Bounded unknown — unresolved:** impl entry guard returns 0x2ce (718) when r4 arg/out ptr is null (see 0x102af288 entry); remaining paths call-derived

**`402`** `confirmed`

Request parse layer rejected an argument before the impl was invoked.

- Missing or unparseable input argument at the wrapper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fa880`
- dispatch entry `0x10eb31d4`
- impl call `0x102fa960` obj `r5-in` slot `12` arg4 `*(sp-0x1440+0x10)`
- impl call `0x102fa9d8` obj `*(sp-0x1440+0x143c)` slot `12` arg4 `402`
- req vcall `0x102fa938` slot `8` (parse)

- fn 0x102fa880 @ 0x102fa880 — action wrapper handler
- @ 0x10eb31d4 — action dispatch table entry
- fn 0x102af288 — AVT impl vtable 0x10eaf2ec slot +0x0c entry

</details>

### `SetPlayMode`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Sets play mode: NORMAL, REPEAT_ALL, REPEAT_ONE, SHUFFLE, SHUFFLE_NOREPEAT, SHUFFLE_REPEAT_ONE (exact accepted set is enforced).

**Technical description:** Sets repeat/shuffle play mode. Impl f_102b9a9c gate (718) then body f_102b9aac: lock impl+0x458, log 'upnp'/'change play mode', call f_102b24dc(impl,mode-str) which maps the string to an enum {NORMAL=0,SHUFFLE_NOREPEAT=1,REPEAT_ALL=2,SHUFFLE=3,REPEAT_ONE=4,SHUFFLE_REPEAT_ONE=5}. Non-NORMAL modes require capability gates: f_10147928(impl+0x5dc)!=0 (source/queue present), f_10148308!=0 (cap), and byte impl+0x1a03 (shuffle-capable flag), else 712. Per-mode apply: mode==2 -> indexed path; mode==1 -> f_106a9e88(impl+0x5a0,1,mode_enum,0,0) streamer vfunc, its failure -> 712.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x40 with 718 | none - required argument |
| `NewPlayMode` | string | yes | Play-mode name; exact-match string table in f_102b24dc: 'NORMAL'(0),'SHUFFLE_NOREPEAT'(1),'REPEAT_ALL'(2),'SHUFFLE'(3),'REPEAT_ONE'(4),'SHUFFLE_REPEAT_ONE'(5); anything else -> 712. / max 1023 chars | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`NewPlayMode`** — Play-mode name; exact-match string table in f_102b24dc: 'NORMAL'(0),'SHUFFLE_NOREPEAT'(1),'REPEAT_ALL'(2),'SHUFFLE'(3),'REPEAT_ONE'(4),'SHUFFLE_REPEAT_ONE'(5); anything else -> 712.
  - buffer cap: `0x400`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102b9a9c @ 0x102b9a9c — gate decode
- fn f_102b24dc @ 0x102b24dc — worker decode

</details>


#### Requirements / preconditions `confirmed`

Non-NORMAL modes are capability-gated: active source must exist at impl+0x5dc and pass f_10147928/f_10148308 checks plus the impl+0x1a03 flag.
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102b24dc @ 0x102b25d4 — f_10147928 gate
- fn f_102b24dc @ 0x102b25f0 — impl+0x1a03 byte gate

</details>


#### State dependencies `confirmed`

mode impl+0x4654 selects the apply path: indexed (==2), streamer vfunc (==1); mode==0 has its own NORMAL path.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b24dc @ 0x102b2530 — cmplwi mode,2/1 dispatch

</details>


#### Side effects

- Impl locks the engine mutex at impl+0x458 (f_10557cac/f_10557848) for the operation. Play-mode enum applied to the indexed engine or forwarded to the streamer as a mode command.

#### State transitions `confirmed`

Play mode changes to the mapped enum; unknown strings rejected before any state change.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b24dc @ 0x102b25fc — string->enum table

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f94a0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

Worker rc returned as impl status: 0 on success, 712 for unknown string, missing source, capability failure, or streamer rejection.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102b24dc @ 0x102b2554 — li r3,0x2c8

</details>


#### Errors

**`718`** `strong`

impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1c\] -> f_105614e0 into a stack word, passes that word in r4 to the impl vfunc; impl guard cmpwi r4,0 / beq -> body, fallthrough returns 0x2ce (718); only instance 0 exists in this build; remaining rc paths call-derived

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)


**Bounded unknown — proven:** the fault path is reached when the impl call reports failure
**Bounded unknown — unresolved:** impl entry guard returns 0x2ce (718) when r4 arg/out ptr is null (see 0x102b9a9c entry); remaining paths call-derived

**`712`** `confirmed`

Play-mode rejected: unrecognized string, no eligible source for non-NORMAL modes, capability byte impl+0x1a03 blocks it, or the streamer mode-set vfunc failed.

- NewPlayMode not in the 6-string table
- non-NORMAL mode but f_10147928(impl+0x5dc)==0 or f_10148308 or impl+0x1a03 flag fails
- mode==1 and f_106a9e88 streamer call failed

**`402`** `confirmed`

Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs.

- typed argument parse or request-shape check failed in the wrapper


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f94a0`
- dispatch entry `0x10eb31e0`
- impl call `0x102f9548` obj `r5-in` slot `64` arg4 `*(sp-0x430+0x18)`
- impl call `0x102f95ac` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x102f9524` slot `8` (parse)

- fn f_102b9a9c @ 0x102b9a9c — gate decode
- fn f_102b24dc @ 0x102b24dc — worker decode
- fn 0x102b9a9c — AVT impl vtable 0x10eaf2ec slot +0x40 entry
- fn 0x102f94a0 @ 0x102f94a0 — action wrapper handler
- @ 0x10eb31e0 — action dispatch table entry

</details>

### `SnoozeAlarm`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Snoozes the currently ringing alarm by Duration ('HH:MM:SS').

**Technical description:** Snoozes the currently ringing alarm. Impl f_102d1fc4 is a thin shim: worker f_102d1d5c fills a status record and the impl returns the u16 at rec+4 as the SOAP rc. The worker enforces InstanceID==0 (718), parses Duration through shared parser f_10c3d2c4 (fail -> 402), requires engine+0x4654 in {1,2} (else 800), and requires byte impl+0x5a86 nonzero — the ringing-alarm flag (else 701). It then logs "upnp"/"snooze", submits a transport op via f_102d0ac8(impl,0,0,...) — the same submission helper as the Pause fallback — calls sonosClockGetTime(1), and stores the snooze timestamp/flag pair at impl+0x6ecc and impl+0x6ed0.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 only - nonzero faults 718 / 0 | none - required argument |
| `Duration` | SonosDurationArg | yes | Text that f_10c3d2c4 parses — unparseable text faults 402 / max 63 chars | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`Duration`** — Snooze duration parsed by shared parser f_10c3d2c4 — the same routine ConfigureSleepTimer uses.
  - buffer cap: `0x40`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102f9990 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: r30 v\[+0xa4\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9990 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0xa4\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9990 — member vfunc calls: \['r30 v\[+0xa4\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0xa4\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0xa4\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9990 — no transition-literal/store pattern; member delegates: \['r30 v\[+0xa4\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9990 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f9990 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

Nonzero InstanceID — worker gate on the parsed int.

- InstanceID argument is nonzero

**`402`** `confirmed`

Duration fails the shared f_10c3d2c4 parse.

- f_10c3d2c4 returns 0
- Missing or unparseable input argument at the wrapper parse stage

**`800`** `confirmed`

engine+0x4654 is neither 1 nor 2 — snooze requires an active non-idle transport mode.

- (impl+0x4654 - 1) unsigned > 1

**`701`** `confirmed`

byte impl+0x5a86 is 0 — no alarm is ringing, nothing to snooze.

- lbz impl+0x5a86 == 0

**`vret(r5-in,+0xa4)`** `strong`

rec+4 u16 is returned; codes 718/402/800/701 enumerated.

- worker wrote a code not in the enumerated set

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f9990`
- dispatch entry `0x10eb31ec`
- impl call `0x102f9a38` obj `r5-in` slot `164` arg4 `*(sp-0x70+0x18)`
- impl call `0x102f9a9c` obj `*(sp-0x70+0x6c)` slot `12` arg4 `402`
- req vcall `0x102f9a14` slot `8` (parse)

- fn 0x102f9990 @ 0x102f9990 — action wrapper handler
- @ 0x10eb31ec — action dispatch table entry
- fn 0x102d1fc4 — AVT impl vtable 0x10eaf2ec slot +0xa4 entry

</details>

### `StartAutoplay`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Starts autoplay for a source: plays ProgramURI (+metadata) at the configured autoplay volume, optionally grouping linked zones; ResetVolumeAfter restores volume afterwards.

**Technical description:** Starts an autoplay program (e.g. alarm-triggered playback). Impl f_102e17a8 is a thin 718-gate tail-calling worker f_102e14e0 — sibling of the RunAlarm worker family: it parses ProgramURI/program fields via f_10c3cbfc (parse failure -> 402), checks additional flags, and submits the autoplay session.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x9c with 718 | none - required argument |
| `ProgramURI` | SonosUriArg | yes | program URI string <= parse cap; installed via f_102da774 on mode!=0 / max 1024 chars | none - required argument |
| `ProgramMetaData` | SonosMetaDataArg | yes | DIDL-Lite XML string <= parse cap / max 4096 chars | none - required argument |
| `Volume` | SonosUintArg | yes | u32 volume 0..100 convention; impl passes to the autoplay record / parsed u32; worker-domain clamped | none - required argument |
| `IncludeLinkedZones` | SonosBoolArg | yes | boolean flag parsed as u32; nonzero extends install to the group / {0,1} | none - required argument |
| `ResetVolumeAfter` | SonosUintArg | yes | u32 seconds; volume-restore timer for the autoplay record / parsed u32 | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`
- **`ProgramURI`** — Program definition parsed by f_10c3cbfc - rejection faults 402.
  - buffer cap: `0x401`
- **`ProgramMetaData`** — Forwarded to shared autoplay worker f_102e14e0.
  - buffer cap: `0x1001`
- **`Volume`** — Forwarded to shared autoplay worker f_102e14e0.
  - buffer cap: `0x18`
- **`IncludeLinkedZones`** — Forwarded to shared autoplay worker f_102e14e0.
  - buffer cap: `0x18`
- **`ResetVolumeAfter`** — Forwarded to shared autoplay worker f_102e14e0.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102fc6f4 — wrapper + impl decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×6, validate×1, commit×1); member delegates: r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc6f4 — req-vfunc call map: {'0x1c': 6, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc6f4 — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc6f4 — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc6f4 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102fc6f4 — commit/fault slot usage: {'0x1c': 6, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`718`** `confirmed`

InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine

- InstanceID argument is nonzero

**`402`** `confirmed`

Program fields failed the f_10c3cbfc parse inside the worker.

- f_10c3cbfc returned nonzero on the program fields
- Missing or unparseable input argument at the wrapper parse stage

**`vret(r5-in,+0x9c)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: autoplay worker f_102e14e0 domain {0x32a=810 (override-suppression), callee-fwd rcs}

- the worker produced a code not covered by the gates

**`810`** `confirmed`

operation overridden: autoplay suppressed because an explicit transport operation overrode it (engine+0x465c flag set)

- engine suppression flag +0x465c nonzero; worker logs "preventing autoplay because operation is overridden" and returns 0x32a


#### Notes

None Suppression: engine+0x465c "operation overridden" flag returns 0x32a (810) with avt_impl log "preventing autoplay because operation is overridden". Mode(engine+0x4654)==0 runs a full session reset before installing the stored autoplay URI via f_102da774.

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102fc6f4`
- dispatch entry `0x10eb31f8`
- impl call `0x102fc840` obj `r5-in` slot `156` arg4 `*(sp-0x1440+0x20)`
- impl call `0x102fc8a4` obj `*(sp-0x1440+0x143c)` slot `12` arg4 `402`
- req vcall `0x102fc80c` slot `8` (parse)

- fn 0x102fc6f4 @ 0x102fc6f4 — action wrapper handler
- @ 0x10eb31f8 — action dispatch table entry
- fn 0x102e17a8 — AVT impl vtable 0x10eaf2ec slot +0x9c entry

</details>

### `Stop`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Stops playback and clears transport position.

**Technical description:** Stops playback. Impl f_102d2e54 gate (718 on InstanceID!=0) then body at 0x102d2eb4: lock impl+0x458, log 'upnp'/'stop', call f_102d2bec(impl,1). The worker zeroes impl+0x7778, calls f_102ae2d0 on the member object at impl+0xaaa0, then f_102931f0(impl+0x5dc); cr0.eq-clear -> 701. On pass it dispatches on mode (impl+0x4654): mode==2 submits op 1 via f_10256a84(impl+0x580) plus conditional f_102b4b48; mode==1 calls f_102b0a48(impl,0); then shared tail f_102b05e4(impl,1). An 'avt_impl' debug log 'restoring after stop chime' documents a chime-restore path gated by impl+0x5a7f/0x7764 flags.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `InstanceID` | SonosUintArg | yes | 0 / 0 only; nonzero InstanceID rejected by impl +0x28 with 718 | none - required argument |

- **`InstanceID`** — InstanceID is the engine instance index; every AVTransport impl returns 718 when it is nonzero.
  - buffer cap: `0x18`

#### Validation `confirmed`

See inputs/impl notes
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102d2e54 @ 0x102d2e54 — gate decode
- fn f_102d2bec @ 0x102d2bec — worker decode

</details>


#### Requirements / preconditions `confirmed`

None beyond InstanceID==0.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102d2e54 @ 0x102d2e54 — gate decode

</details>


#### State dependencies `confirmed`

Mode-field (impl+0x4654) selects indexed vs stream stop path; flags impl+0x5a86/0x5a7f/0x7764 gate the chime-restore behavior.
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102d2bec @ 0x102d2c64 — mode dispatch
- @ 0x10eb12cc — 'restoring after stop chime: ret=%d ar=%d wrca=%d pavt=%d'

</details>


#### Side effects

- Impl locks the engine mutex at impl+0x458 (f_10557cac/f_10557848) for the operation. Clears impl+0x7778, impl+0x7766/0x776c on the chime path; submits stop to indexed session (op 1) or stream path.

#### State transitions `confirmed`

Stop submitted; queue/URI fields cleared on the chime path; transport-state update run.
<details markdown="1"><summary>Evidence (1)</summary>

- fn f_102d2bec @ 0x102d2cd8 — fields cleared

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102f849c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `confirmed`

701 when f_102931f0(impl+0x5dc) fails its precondition; else mode-path rc flows through f_102b05e4's status (0=success).
<details markdown="1"><summary>Evidence (2)</summary>

- fn f_102d2bec @ 0x102d2c40 — li r3,0x2bd on f_102931f0 fail
- fn f_102d2bec @ 0x102d2d74 — f_102b05e4 rc -> r28

</details>


#### Errors

**`718`** `strong`

apply worker f_102d2bec multi-exit: literal {701 x2, 0} plus call-derived (r30/r28 accumulators); impl-side 718 stands; rc forwarded verbatim

- parsed InstanceID != 0 — impl/parse rc path to shared fault emitter (see evidence)


**Bounded unknown — proven:** literal paths bounded
**Bounded unknown — unresolved:** apply-worker call-derived rc (session/track lookup chain f_102b8c44)

**`701`** `confirmed`

The impl+0x5dc control target rejected the stop precondition (f_102931f0 cr0.eq clear).

- f_102931f0(impl+0x5dc) failed - control target not in a stoppable state

**`vret(r5-in,+0x28)`** `strong`

nonzero impl/worker rc surfaced verbatim; recovered domain: 718, downstream mode-path rc fwd (0x102d2ef0)

- f_102b05e4(impl,1) returned nonzero


**Bounded unknown — proven:** tail rc is returned
**Bounded unknown — unresolved:** concrete codes produced by the mode paths (f_10256a84/f_102b0a48) surfacing here

**`402`** `confirmed`

Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs.

- typed argument parse or request-shape check failed in the wrapper

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in addition to the documented accumulator exits; per-code trigger sites inside the session layer undecoded

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x102f849c`
- dispatch entry `0x10eb3204`
- impl call `0x102f8518` obj `r5-in` slot `40` arg4 `*(sp-0x30+0x18)`
- impl call `0x102f857c` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x102f84f8` slot `8` (parse)

- fn f_102d2e54 @ 0x102d2e54 — gate decode
- fn f_102d2bec @ 0x102d2bec — worker decode
- fn 0x102d2e54 — AVT impl vtable 0x10eaf2ec slot +0x28 entry
- fn 0x102f849c @ 0x102f849c — action wrapper handler
- @ 0x10eb3204 — action dispatch table entry

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `TransportState` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `CurrentPlayMode` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `CurrentCrossfadeMode` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `NumberOfTracks` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `CurrentTrack` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `CurrentSection` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `CurrentTrackURI` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `CurrentTrackDuration` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `CurrentTrackMetaData` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `EnqueuedTransportURI` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `EnqueuedTransportURIMetaData` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `PlaybackStorageMedium` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `AVTransportURI` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `AVTransportURIMetaData` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `NextAVTransportURI` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `NextAVTransportURIMetaData` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `CurrentTransportActions` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `CurrentValidPlayModes` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `DirectControlClientID` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `DirectControlIsSuspended` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `DirectControlAccountID` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `TransportStatus` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `TransportErrorDescription` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `TransportErrorURI` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `TransportErrorHttpCode` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `TransportErrorHttpHeaders` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `SleepTimerGeneration` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `RestartPending` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `NextTrackURI` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `NextTrackMetaData` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `AlarmRunning` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `SnoozeRunning` | string (val= attribute) | yes | evented transport state variable (r:-prefixed rincon extension where applicable) |
| `TransportPlaySpeed` | string | yes | constant evented field |
| `CurrentMediaDuration` | string | yes | constant evented field |
| `RecordStorageMedium` | string | yes | constant evented field |
| `PossiblePlaybackStorageMedia` | string | yes | constant evented field |
| `PossibleRecordStorageMedia` | string | yes | constant evented field |
| `RecordMediumWriteStatus` | string | yes | constant evented field |
| `CurrentRecordQualityMode` | string | yes | constant evented field |
| `PossibleRecordQualityModes` | string | yes | constant evented field |
| `RelativeTimePosition` | string | no | non-evented AVTransport state variable — read via action out-args, not pushed |
| `AbsoluteTimePosition` | string | no | non-evented AVTransport state variable — read via action out-args, not pushed |
| `RelativeCounterPosition` | i4 | no | non-evented AVTransport state variable — read via action out-args, not pushed |
| `AbsoluteCounterPosition` | i4 | no | non-evented AVTransport state variable — read via action out-args, not pushed |
| `AlarmIDRunning` | ui4 | no | non-evented AVTransport state variable — read via action out-args, not pushed |
| `AlarmLoggedStartTime` | string | no | non-evented AVTransport state variable — read via action out-args, not pushed |
| `LastChange` | string | yes | evented state variable — appears in AVTransport LastChange/GENA event notifications |
| `MuseSessions` | string | no | non-evented AVTransport state variable — read via action out-args, not pushed |
| `A_ARG_TYPE_SeekMode` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_SeekTarget` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_InstanceID` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MemberList` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TransportSettings` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_CurrentAVTransportURI` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_SourceState` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_VLIState` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Queue` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MemberID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_URI` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_LIST_URI` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_URIMetaData` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_LIST_URIMetaData` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ObjectID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_GroupID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_PlayerID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TrackNumber` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_NumTracks` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_NumTracksChange` | i4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_EnqueueAsNext` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_SavedQueueTitle` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ResumePlayback` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ISO8601Time` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmVolume` | ui2 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmIncludeLinkedZones` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ResetVolumeAfter` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_SleepTimerState` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmState` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_StreamRestartState` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_RejoinGroup` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_ClearSource` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `QueueUpdateID` | ui4 | no | non-evented AVTransport state variable — read via action out-args, not pushed |
| `A_ARG_TYPE_TrackList` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_RestartSink` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |

## Events

- **Mechanism:** UPnP GENA NOTIFY; LastChange carries full AVT state incl rincon r:-extensions
- **Namespace:** urn:schemas-upnp-org:metadata-1-0/AVT/ + xmlns:r=urn:schemas-rinconnetworks-com:...
- **LastChange variable:** LastChange
- **notify_path:** f_102e41a0 AVT event emitter: mutexed (f_10557cac) LastChange doc build using template 0x10eb29e8; e:property write at 0x102e519c; arg+0x3dc string source; f_102b733c doc-write

## Dispatcher-level errors

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search


## Implementation return pattern

AVT impl universal shape (Ghidra-verified across 15 impls): param_2(InstanceID-path)!=0 -> return 0x2ce=718; else return uVar(engine-vfunc rc). literals 1112=0x458 mutex-offset + 53/56/40/16=struct offsets are noise, not codes. real code vocab {402,718,1024,1025,1028} + engine-passthrough.

## Notes

- Engine impl object fields recovered: +0x458 command mutex; +0x3dc name string (nonzero gates scoped logging); +0x580 indexed/chsrc session manager (f_10255f64 submit, f_10256a84 ops); +0x5a0 streamer session object (vfuncs f_106a7880 pause, f_106a7a34 next, f_106a7930 seek, f_106a9e88 mode); +0x5dc source/URI control target (cap queries f_10147928/f_101471f0/f_101475dc/f_10148308/f_10688070, precondition f_102931f0); +0x5d4 default state source; +0x4654 transport-source mode enum {0,1,2} (2=indexed/queue); +0x6ed8 pending-op field cleared on successful track/mode ops; +0x7778 cleared by Stop; +0x1a03 shuffle-capable flag; +0x5a86/+0x5a7f/+0x7764/+0x7766/+0x776c chime-restore flags; +0xaaa0 member object touched by Stop. Engine vtables: A=0x10eaf2ec, B=0x10edfbb8 - identical for all actions except SetAVTransportURI and the three Become*Coordinator* ops (B overrides to 0x10513230/0x10513244/0x105133e4/0x105134a8, the group-aware class).
- Two engine classes implement every action: standalone (vtable 0x10eaf2ec, ctor f_102cc070) and group-capable (vtable 0x10edfbb8, ctor f_104000c4). They share all 54 vfunc slots except ctor/dtor and the four coordinator-sensitive impls (+0x08 SetAVTransportURI, +0x54 BecomeCoordinatorOfStandaloneGroup, +0xd0 BecomeGroupCoordinator, +0xd4 BecomeGroupCoordinatorAndSource). B impls gate on the zonegroup-topology singleton (global 0x110c8478 via f_1090ad44 + state predicate f_109089f0 on obj+0xcc); when ungrouped the B Become* impls tail-call the A impls verbatim.

## Additional records

### `implementation_notes`

- **source:** avt_impl.cxx literal block 0x10eafc0c-0x10eb1fcc; object RAVTMediaRenderer; locks rwlW_avt/rwlR_avt; scope scopeAvt; persistence avt.txt + avt-backup-restore; queues trackqueue/ai_tracker/load_operation_manager
- **uri_type_enum:** `rincon_uri`, `line_in`, `regular_uri`, `undefined`
- **seek_units:** `TRACK_NR`, `REL_TIME`, `TIME_DELTA`

Implementation sources (recovered): `zoneplayer/avt_impl.cxx`, `zoneplayer/trackplay{monitor,recorder}.cxx`, `zoneplayer/play_state_mgr.cxx`

<details markdown="1"><summary>Service evidence (3)</summary>

- @ 0x101953c8 — service router function
- @ 0x10eb300c — service vtable
- @ 0x102fa5c4 — service dispatcher

</details>
