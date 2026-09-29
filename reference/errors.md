# Errors

## SOAP fault wire format

```xml
<s:Fault><faultcode>s:Client</faultcode><faultstring>UPnPError</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>%d</errorCode></UPnPError></s:Fault>
```
fault detail carries ONLY the numeric errorCode - no errorDescription element on the wire; literal detail strings (e.g. Update URL is malformed) travel via out-arg records, not this template


## Fault code vocabulary

- **status:** strong
- **extraction:** li/ori immediates in error-band scanned across all 1848 worker/impl functions referenced in the DB (tools/_errdomain2.py); per-function literal sets persisted in docs/worker_err_literals.json
- **upnp_band** (79):

  ```
  101, 102, 103, 104, 105, 106, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 400, 401, 402, 403, 404, 405, 408, 411, 501, 606, 608, 624, 640, 651, 652, 664, 680, 699, 701, 702, 705, 706, 710, 711, 712, 717, 718, 720, 728, 800, 801, 802, 803, 804, 806, 807, 808, 810, 1000, 1003, 1021, 1023, 1024, 1025, 1026, 1028, 1040, 1043, 1046, 1056, 1057, 1100, 1104, 1143, 1152, 1161, 1178, 1200, 1221, 1224, 1266, 1272, 1287
  ```
- **semantics:** every 'vret'/passthrough error domain is bounded by the union of its impl worker's exit literals + this aggregate vocabulary; concrete per-action subset requires exit-block dataflow (runtime boundary for the impl->engine delegation chains)
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: strong, notes: 1848 fn literal scan; canonical UPnP bands {101-118,400-411,501,600-730,800-813,1000-1300}

## Per-action error surface

### `AVTransport`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `AddMultipleURIsToQueue` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `AddMultipleURIsToQueue` | `vret(r5-in,+0x68)` | `strong` | nonzero engine-insert rc surfaced verbatim; recovered domain: 718 (InstanceID!=0 or missing queue record), 0x404=1028 (insert-position misma |
| `AddMultipleURIsToQueue` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked.; impl-side: worker f_102b7000 returns 402 on null/empty URI strings (s |
| `AddURIToQueue` | `718` | `confirmed` | impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1 |
| `AddURIToQueue` | `vret(r5-in,+0x64)` | `strong` | nonzero engine-insert rc surfaced verbatim; recovered domain: 718 (InstanceID!=0 or missing queue record), 0x404=1028 (insert-position misma |
| `AddURIToQueue` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `AddURIToSavedQueue` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `AddURIToSavedQueue` | `vret(r5-in,+0x88)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (gate), saved-queue worker rc fwd |
| `AddURIToSavedQueue` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `AddURIToSavedQueue` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,8 |
| `BackupQueue` | `718` | `confirmed` | Nonzero InstanceID — impl compares the parsed int against 0 before touching the session. |
| `BackupQueue` | `vret(r5-in,+0x80)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: path-builder domain {718, 0x322=802} |
| `BackupQueue` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `BackupQueue` | `802` | `strong` | worker-call rejection path |
| `BackupQueue` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,8 |
| `BecomeCoordinatorOfStandaloneGroup` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `BecomeCoordinatorOfStandaloneGroup` | `const` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: promotion-path domain {718, r29 callee-fwd} |
| `BecomeCoordinatorOfStandaloneGroup` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `BecomeCoordinatorOfStandaloneGroup` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `BecomeGroupCoordinator` | `vret(r5-in,+0xd0)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718, 800, 402 x6 sites, callee-fwd — producers at 0x102dea7c/0x102dea90/0x102deb |
| `BecomeGroupCoordinator` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `BecomeGroupCoordinatorAndSource` | `vret(r5-in,+0xd4)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: promotion worker domain {0x401=1025} |
| `BecomeGroupCoordinatorAndSource` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `ChangeCoordinator` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `ChangeCoordinator` | `vret(r5-in,+0x5c)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718, 800 — producers at 0x102af538/0x102af678 |
| `ChangeCoordinator` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `ChangeCoordinator` | `800` | `strong` | worker-call rejection path |
| `ChangeCoordinator` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `ChangeTransportSettings` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `ChangeTransportSettings` | `800` | `confirmed` | Transport mode impl+0x4654 is nonzero — settings changes require an idle engine. |
| `ChangeTransportSettings` | `vret(r5-in,+0x60)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718, 800, callee-fwd — producers at 0x102b1dd8/0x102b1e2c |
| `ChangeTransportSettings` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `ChangeTransportSettings` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `ConfigureSleepTimer` | `718` | `confirmed` | Nonzero InstanceID — impl gate on the parsed int. |
| `ConfigureSleepTimer` | `402` | `confirmed` | Non-empty NewSleepTimerDuration fails the f_10c3d2c4 duration parse. |
| `ConfigureSleepTimer` | `800` | `confirmed` | engine+0x4654 is neither 1 nor 2 — sleep timer requires a non-idle transport mode. |
| `ConfigureSleepTimer` | `vret(r5-in,+0x90)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: timer-set worker f_102b4c1c exit returns 0; internal constants {0x320=800,0x192= |
| `CreateSavedQueue` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `CreateSavedQueue` | `vret(r5-in,+0x84)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (gate), saved-queue worker rc fwd |
| `CreateSavedQueue` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `CreateSavedQueue` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,8 |
| `DelegateGroupCoordinationTo` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `DelegateGroupCoordinationTo` | `402` | `confirmed` | NewCoordinator was NULL or an empty string. |
| `DelegateGroupCoordinationTo` | `vret(r5-in,+0x58)` | `strong` | worker rc returned verbatim except 803->0 |
| `EndDirectControlSession` | `718` | `confirmed` | Nonzero InstanceID — impl gate on the parsed int before any session work. |
| `EndDirectControlSession` | `vret(r5-in,+0x50)` | `strong` | None known beyond 718 — the impl returns 0 unconditionally after teardown; this entry is a safety net for any rc the shared teardown could s |
| `EndDirectControlSession` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `EndDirectControlSession` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `GetCrossfadeMode` | `718` | `strong` | nonzero InstanceID rejected by the impl vfunc (rc 0x2ce materialised at the impl head) |
| `GetCrossfadeMode` | `402` | `confirmed` | Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs. |
| `GetCurrentTransportActions` | `718` | `strong` | nonzero InstanceID rejected by the impl vfunc (rc 0x2ce materialised at the impl head) |
| `GetDeviceCapabilities` | `402` | `strong` | request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot |
| `GetDeviceCapabilities` | `718` | `strong` | Invalid InstanceID — parsed InstanceID != 0 rejected by the impl guard (proven convention: li r3,0x2ce sites across the f_102a*/f_102d* tran |
| `GetMediaInfo` | `402` | `strong` | request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot |
| `GetMediaInfo` | `718` | `strong` | Invalid InstanceID — parsed InstanceID != 0 rejected by the impl guard (proven convention: li r3,0x2ce sites across the f_102a*/f_102d* tran |
| `GetPositionInfo` | `402` | `strong` | request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot |
| `GetPositionInfo` | `718` | `strong` | Invalid InstanceID — parsed InstanceID != 0 rejected by the impl guard (proven convention: li r3,0x2ce sites across the f_102a*/f_102d* tran |
| `GetRemainingSleepTimerDuration` | `402` | `strong` | request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot |
| `GetRemainingSleepTimerDuration` | `718` | `strong` | Invalid InstanceID — parsed InstanceID != 0 rejected by the impl guard (proven convention: li r3,0x2ce sites across the f_102a*/f_102d* tran |
| `GetRemainingSleepTimerDuration` | `800` | `strong` | 800-series store/impl fault reachable through this getter’s impl vfunc chain (only code in its reachable band); specific trigger unverified |
| `GetRunningAlarmProperties` | `402` | `strong` | request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot |
| `GetRunningAlarmProperties` | `800` | `strong` | 800-series store/impl fault reachable through this getter’s impl vfunc chain (only code in its reachable band); specific trigger unverified |
| `GetTransportInfo` | `718` | `strong` | nonzero InstanceID rejected by the impl vfunc (rc 0x2ce materialised at the impl head) |
| `GetTransportSettings` | `402` | `strong` | request arg-parse layer: handler emits no literal fault exits; InstanceID is read via the shared request-object vfuncs (slot 28 parse / slot |
| `GetTransportSettings` | `718` | `strong` | Invalid InstanceID — parsed InstanceID != 0 rejected by the impl guard (proven convention: li r3,0x2ce sites across the f_102a*/f_102d* tran |
| `Next` | `718` | `strong` | apply worker f_102b60b0 exit accumulator r30: literal {701 x2, 0, 800} plus call-derived; impl-side 718 on InstanceID!=0 stands; rc forwarde |
| `Next` | `701` | `confirmed` | Operation not currently possible - streamer vfunc returned 0 (no session/rejected) or indexed submit returned an unmapped rc. |
| `Next` | `711` | `confirmed` | Indexed submit rc==3 - request rejected by impl+0x580 (queue end / illegal target). |
| `Next` | `800` | `confirmed` | Indexed submit rc==2 - a distinct engine rejection code (exact semantics unresolved, mapped verbatim). |
| `Next` | `402` | `confirmed` | Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs. |
| `Next` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `NotifyDeletedURI` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `NotifyDeletedURI` | `vret(r5-in,+0x48)` | `strong` | impl returns 0 unconditionally after the gate |
| `NotifyDeletedURI` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `NotifyDeletedURI` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `Pause` | `718` | `strong` | impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1 |
| `Pause` | `vret(r5-in,+0x30)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: fallback worker f_102d0ac8 domain {0x2bd=701 (x7 sites), 0}; direct streamer pat |
| `Pause` | `402` | `confirmed` | Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs. |
| `Play` | `718` | `confirmed` | impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1 |
| `Play` | `717` | `confirmed` | Speed was not the exact string '1'. |
| `Play` | `vret(r5-in,+0x2c)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (InstanceID), 717 (Speed != literal "1" - strcmp gate at 0x102d4118), downst |
| `Play` | `402` | `confirmed` | Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs. |
| `Play` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `Previous` | `718` | `strong` | apply worker f_102b6214: literal {701, 0, 711} plus call-derived; impl-side 718 stands; rc forwarded verbatim |
| `Previous` | `701` | `confirmed` | Stream-mode skip failed - the streamer vfunc returned 0 (no live session or rejected). |
| `Previous` | `711` | `confirmed` | Indexed submit failed - the impl+0x580 engine rejected the track-back request. |
| `Previous` | `402` | `confirmed` | Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs. |
| `Previous` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `RemoveAllTracksFromQueue` | `718` | `confirmed` | impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1 |
| `RemoveAllTracksFromQueue` | `vret(r5-in,+0x78)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (InstanceID gate at impl head); shared engine worker f_102b3a84 domain {718  |
| `RemoveAllTracksFromQueue` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `RemoveTrackFromQueue` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `RemoveTrackFromQueue` | `1028` | `confirmed` | UpdateID argument was nonzero and did not equal the current queue update-id. |
| `RemoveTrackFromQueue` | `800` | `confirmed` | Transport mode is not 1 or 2, OR the session submission f_10255f64 returned 0 (failure). |
| `RemoveTrackFromQueue` | `vret(r5-in,+0x70)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (InstanceID), 0x404=1028, 800, 0 — producers at 0x102aa7bc/0x102aa830/0x102a |
| `RemoveTrackFromQueue` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `RemoveTrackRangeFromQueue` | `718` | `confirmed` | Nonzero InstanceID, or the "%u"-formatted selector fails the session queue-id strcmp. |
| `RemoveTrackRangeFromQueue` | `1028` | `confirmed` | UpdateID argument was nonzero and did not equal the current queue update-id. |
| `RemoveTrackRangeFromQueue` | `800` | `confirmed` | Transport mode impl+0x4654 is not 1 or 2. |
| `RemoveTrackRangeFromQueue` | `vret(r5-in,+0x74)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (InstanceID), 402 (null range record); shared worker f_102aca78 domain {402, |
| `RemoveTrackRangeFromQueue` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `ReorderTracksInQueue` | `718` | `confirmed` | Nonzero InstanceID, or shared-worker queue-selector mismatch. |
| `ReorderTracksInQueue` | `402` | `confirmed` | Any of StartingIndex/NumberOfTracks/InsertBefore is zero. |
| `ReorderTracksInQueue` | `vret(r5-in,+0x6c)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718 (InstanceID), 402 (null record args x2); shared worker f_102accf0 domain {0x |
| `ReorderTracksInSavedQueue` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `ReorderTracksInSavedQueue` | `vret(r5-in,+0x8c)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: saved-queue worker rc fwd |
| `ReorderTracksInSavedQueue` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `ReorderTracksInSavedQueue` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,8 |
| `RunAlarm` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `RunAlarm` | `vret(r5-in,+0x98)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: alarm worker f_102e17dc domain {402, 0x401=1025, 0x32a=810}; exit rc=402 site |
| `RunAlarm` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `SaveQueue` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `SaveQueue` | `800` | `confirmed` | Transport mode impl+0x4654 is not 1 or 2. |
| `SaveQueue` | `402` | `confirmed` | Title was empty after whitespace trimming, or contained a CR/LF character. |
| `SaveQueue` | `vret(r5-in,+0x7c)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718, 800, 402, callee-fwd — producers at 0x102aa910/0x102aa968/0x102aa984 |
| `SaveQueue` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,8 |
| `Seek` | `402` | `confirmed` | SOAP-level invalid-args fault when request argument parsing/validation fails. |
| `Seek` | `401` | `confirmed` | Action unreachable: the AVTransport service object has no bound implementation pointer. |
| `Seek` | `718` | `confirmed` | impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1 |
| `Seek` | `701` | `confirmed` | Seek not permitted: unit unsupported in current mode, capability bit clear, malformed target in stream mode, or the submit/streamer chain fa |
| `Seek` | `710` | `confirmed` | Unit token not recognized (indexed mode only). |
| `Seek` | `711` | `confirmed` | Illegal seek target: malformed time, negative REL_TIME, out-of-range track, or failed track submission. |
| `Seek` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `SetAVTransportURI` | `718` | `confirmed` | impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1 |
| `SetAVTransportURI` | `vret(r5-in,+0x8)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: URI-set worker f_102dc81c forwards downstream rcs (f_102ceb40, f_102cfa50); no d |
| `SetAVTransportURI` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `SetAVTransportURI` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `SetCrossfadeMode` | `718` | `strong` | impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1 |
| `SetCrossfadeMode` | `712` | `confirmed` | Crossfade rejected: transport mode !=2 (not indexed), source not crossfade-capable, HLS stream, nonzero arg on incapable source, or submit f |
| `SetCrossfadeMode` | `402` | `confirmed` | Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs. |
| `SetNextAVTransportURI` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `SetNextAVTransportURI` | `800` | `confirmed` | Transport mode impl+0x4654 is not 2 — next-URI requires indexed/queue playback. |
| `SetNextAVTransportURI` | `vret(r5-in,+0xc)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: worker f_102af1c8 domain {0x2bd=701}; exit rc=701 |
| `SetNextAVTransportURI` | `402` | `confirmed` | Request parse layer rejected an argument before the impl was invoked. |
| `SetNextAVTransportURI` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `SetPlayMode` | `718` | `strong` | impl returns 718 (Invalid InstanceID) when the handler-parsed InstanceID word is nonzero: handler parses literal InstanceID via req->v\[+0x1 |
| `SetPlayMode` | `712` | `confirmed` | Play-mode rejected: unrecognized string, no eligible source for non-NORMAL modes, capability byte impl+0x1a03 blocks it, or the streamer mod |
| `SetPlayMode` | `402` | `confirmed` | Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs. |
| `SnoozeAlarm` | `718` | `confirmed` | Nonzero InstanceID — worker gate on the parsed int. |
| `SnoozeAlarm` | `402` | `confirmed` | Duration fails the shared f_10c3d2c4 parse. |
| `SnoozeAlarm` | `800` | `confirmed` | engine+0x4654 is neither 1 nor 2 — snooze requires an active non-idle transport mode. |
| `SnoozeAlarm` | `701` | `confirmed` | byte impl+0x5a86 is 0 — no alarm is ringing, nothing to snooze. |
| `SnoozeAlarm` | `vret(r5-in,+0xa4)` | `strong` | rec+4 u16 is returned; codes 718/402/800/701 enumerated. |
| `SnoozeAlarm` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| `StartAutoplay` | `718` | `confirmed` | InstanceID is nonzero; the impl gate rejects any instance other than 0 for this engine |
| `StartAutoplay` | `402` | `confirmed` | Program fields failed the f_10c3cbfc parse inside the worker. |
| `StartAutoplay` | `vret(r5-in,+0x9c)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: autoplay worker f_102e14e0 domain {0x32a=810 (override-suppression), callee-fwd  |
| `StartAutoplay` | `810` | `confirmed` | operation overridden: autoplay suppressed because an explicit transport operation overrode it (engine+0x465c flag set) |
| `Stop` | `718` | `strong` | apply worker f_102d2bec multi-exit: literal {701 x2, 0} plus call-derived (r30/r28 accumulators); impl-side 718 stands; rc forwarded verbati |
| `Stop` | `701` | `confirmed` | The impl+0x5dc control target rejected the stop precondition (f_102931f0 cr0.eq clear). |
| `Stop` | `vret(r5-in,+0x28)` | `strong` | nonzero impl/worker rc surfaced verbatim; recovered domain: 718, downstream mode-path rc fwd (0x102d2ef0) |
| `Stop` | `402` | `confirmed` | Request-layer parse/validation failure surfaced through the request fault vfunc before the impl runs. |
| `Stop` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | session/streamer rc domain reached through transport vfuncs: propagated codes include {701,702,703,714,717,720,800,801,802,804,808,810} in a |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `AlarmClock`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `CreateAlarm` | `vret(*(r3-in+0x4),+0x34)` | `strong` | alarm-store vfunc 0x1027a980 (slot +0x34) domain: literal 402 gate (0x1027aa30) plus insert-result derived path (r31 = call result / arg-see |
| `CreateAlarm` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `CreateAlarm` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | alarmclock.xml store-commit layer (f_10283998 .tmp+rename save): {501,800,801,802} |
| `DestroyAlarm` | `vret(*(r3-in+0x4),+0x3c)` | `strong` | alarm-store vfunc 0x1027b134 (slot +0x3c) domain: accumulator r31 = remove-call result only (f_1027a8f8 / f_1027f94c) - no literal fault cod |
| `DestroyAlarm` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `DestroyAlarm` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | alarmclock.xml store-commit layer (f_10283998 .tmp+rename save): {501,800,801,802} |
| `GetDailyIndexRefreshTime` | `vret` | `strong` | alarm-store vfunc 0x102730fc (slot +0x44) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store l |
| `GetDailyIndexRefreshTime` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `GetFormat` | `vret` | `strong` | alarm-store vfunc 0x10272f90 (slot +0xc) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store le |
| `GetFormat` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `GetHouseholdTimeAtStamp` | `401` | `strong` | alarm-store vfunc 0x10272f70 (slot +0x2c) is a 4-insn stub "li r3,0x191; blr" - validly parsed calls always fault 401; malformed requests ma |
| `GetHouseholdTimeAtStamp` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `GetTimeNow` | `vret` | `strong` | alarm-store vfunc 0x10273340 (slot +0x30) has two literal exits: 800 on the household-time query failure path (li r3,0x320 at 0x102733f0) an |
| `GetTimeNow` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `GetTimeServer` | `vret` | `strong` | alarm-store vfunc 0x10273090 (slot +0x24) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store l |
| `GetTimeServer` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `GetTimeZone` | `vret` | `strong` | alarm-store vfunc 0x10273020 (slot +0x14) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store l |
| `GetTimeZone` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `GetTimeZoneAndRule` | `vret` | `strong` | alarm-store vfunc 0x102731b4 (slot +0x18) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store l |
| `GetTimeZoneAndRule` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `GetTimeZoneRule` | `vret(*(r3-in+0x4),+0x1c)` | `strong` | alarm-store vfunc 0x10273280 (slot +0x1c) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store l |
| `GetTimeZoneRule` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `ListAlarms` | `vret` | `strong` | nonzero impl rc forwarded verbatim as the fault code (CR-return convention); recovered impl-side constants {402 impl-internal fault sites ob |
| `ListAlarms` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `SetDailyIndexRefreshTime` | `vret(*(r3-in+0x4),+0x40)` | `strong` | alarm-store vfunc 0x1027d0c4 (slot +0x40) domain: literal 402 gate (0x1027d1f0) plus derived accumulator r30 |
| `SetDailyIndexRefreshTime` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `SetDailyIndexRefreshTime` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | alarmclock.xml store-commit layer (f_10283998 .tmp+rename save): {501,800,801,802} |
| `SetFormat` | `vret(*(r3-in+0x4),+0x8)` | `strong` | alarm-store vfunc 0x1027a410 (slot +0x8) domain: accumulator r31 in {0, call result} - DesiredFormat strings validated via five strcmp gates |
| `SetFormat` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `SetFormat` | `401` | `strong` | format-string validation gate |
| `SetFormat` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | alarmclock.xml store-commit layer (f_10283998 .tmp+rename save): {501,800,801,802} |
| `SetTimeNow` | `401` | `strong` | alarm-store vfunc 0x10272f60 (slot +0x28) is a 4-insn stub "li r3,0x191; blr" - validly parsed calls always fault 401; malformed requests ma |
| `SetTimeNow` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `SetTimeNow` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | alarmclock.xml store-commit layer (f_10283998 .tmp+rename save): {501,800,801,802} |
| `SetTimeServer` | `vret(*(r3-in+0x4),+0x20)` | `strong` | alarm-store vfunc 0x1027a64c (slot +0x20) domain: accumulator r29/r30 seeded from arg/call results - no literal fault exit observed |
| `SetTimeServer` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `SetTimeServer` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | alarmclock.xml store-commit layer (f_10283998 .tmp+rename save): {501,800,801,802} |
| `SetTimeZone` | `vret(*(r3-in+0x4),+0x10)` | `strong` | alarm-store vfunc 0x1027cf5c (slot +0x10) domain: literal 402 (li r3,0x192 at 0x1027cf88) plus call-derived accumulator paths (r29/r30 from  |
| `SetTimeZone` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `SetTimeZone` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | alarmclock.xml store-commit layer (f_10283998 .tmp+rename save): {501,800,801,802} |
| `UpdateAlarm` | `vret(*(r3-in+0x4),+0x38)` | `strong` | alarm-store vfunc 0x1027ac80 (slot +0x38) domain: literal 402 gate (0x1027ad34) plus accumulator r31 seeded from arg r5 / call results |
| `UpdateAlarm` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `UpdateAlarm` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | alarmclock.xml store-commit layer (f_10283998 .tmp+rename save): {501,800,801,802} |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `AudioIn`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `StartTransmissionToGroup` | `401` | `confirmed` | action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments |
| `StopTransmissionToGroup` | `401` | `confirmed` | action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments |
| `SetAudioInputAttributes` | `401` | `confirmed` | action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments |
| `GetAudioInputAttributes` | `401` | `confirmed` | action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments |
| `SetLineInLevel` | `401` | `confirmed` | action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments |
| `GetLineInLevel` | `401` | `confirmed` | action_not_authorized — AudioIn reject-all dispatcher emits literal 0x191 (401) for every action name regardless of arguments |
| _(dispatcher)_ | `401` | `confirmed` | reject-all dispatcher — every action name faults 401 including the documented AudioIn action set |

### `ConnectionManager`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `GetCurrentConnectionIDs` | `402` | `strong` | The impl->v\[+0x8\] call returned 0 — no usable connection list. \| n/a — success/failure fully determined by the impl vfunc return |
| `GetCurrentConnectionInfo` | `706` | `strong` | impl->v\[+0x1c\] rc surfaced |
| `GetCurrentConnectionInfo` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `GetProtocolInfo` | `402` | `strong` | impl->v\[+0x8\] rc gates emit \| Wrapper parse layer rejected an argument before the impl call. |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `ConnectionManager`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `GetCurrentConnectionIDs` | `402` | `strong` | The impl->v\[+0x8\] call returned 0 — no usable connection list. \| n/a — success/failure fully determined by the impl vfunc return |
| `GetCurrentConnectionInfo` | `706` | `strong` | impl->v\[+0x1c\] rc surfaced |
| `GetCurrentConnectionInfo` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `GetProtocolInfo` | `402` | `strong` | impl->v\[+0x8\] rc gates emit \| Wrapper parse layer rejected an argument before the impl call. |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `ContentDirectory`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `Browse` | `701` | `strong` | impl accumulator r31: {701 when object resolver f_1034a224 fails on ObjectID (preset 0x1030430c), 0 on success, call/lwz-derived}; rc forwar |
| `Browse` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `Browse` | `402` | `confirmed` | invalid BrowseFlag: value is neither "BrowseDirectChildren" nor "BrowseMetadata" (literal strcmp inside executor f_103042f0) |
| `CreateObject` | `402` | `strong` | impl accumulator r29: {710 literal (0x10302800), arg r7-seeded, call/lwz-derived}; rc forwarded verbatim via req v\[+0x14\] \| Wrapper parse |
| `CreateObject` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | favorites/userradio store-commit layer (dirObjFavorites vfunc -> f_10384490 userradio.xml atomic save): reachable codes {402,501,701,702,803 |
| `DestroyObject` | `402` | `strong` | impl accumulator r30: {701 on object-resolve failure (0x10302858), call/lwz-derived}; rc forwarded verbatim via req v\[+0x14\] \| Wrapper pa |
| `DestroyObject` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | favorites/userradio store-commit layer (dirObjFavorites vfunc -> f_10384490 userradio.xml atomic save): reachable codes {402,501,701,702,803 |
| `FindPrefix` | `402` | `strong` | impl accumulator r30: {701 resolver fail (0x10302da0), 800 resolved-object vfunc type check fail - vtbl\[+0x14\] != f_10113d94 (0x10302dc4), |
| `FindPrefix` | `800` | `strong` | Resolved-object capability check: vtbl\[+0x14\] must be the prefix-search impl (f_10113d94/f_10113da4); objects whose class fills that slot  |
| `GetAlbumArtistDisplayOption` | `402` | `strong` | impl single-call impl: rc = worker call result verbatim (mr r3 at 0x10307ab8 is the call arg setup; r31 exit is lwz-restored spill - real ex |
| `GetAllPrefixLocations` | `402` | `strong` | impl accumulator r30: {701 resolver fail (0x10302ce4), 800 vfunc type check fail - vtbl\[+0x18\] != f_10113da4 (0x10302d08), call-derived};  |
| `GetAllPrefixLocations` | `800` | `strong` | Resolved-object capability check: vtbl\[+0x18\] must be the prefix-search impl (f_10113d94/f_10113da4); objects whose class fills that slot  |
| `GetBrowseable` | `402` | `confirmed` | impl 0x10302470: writes byte 1 to out then returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 \| |
| `GetLastIndexChange` | `402` | `confirmed` | impl 0x1030259c: single exit returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 \| Wrapper parse |
| `GetSearchCapabilities` | `402` | `strong` | impl single-call impl: rc = worker call result verbatim; rc forwarded verbatim via req v\[+0x14\] \| Wrapper parse layer rejected an argumen |
| `GetShareIndexInProgress` | `402` | `confirmed` | impl 0x1030269c: single exit returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 \| Wrapper parse |
| `GetSortCapabilities` | `402` | `strong` | impl single-call impl: rc = worker call result verbatim; rc forwarded verbatim via req v\[+0x14\] \| Wrapper parse layer rejected an argumen |
| `GetSystemUpdateID` | `402` | `confirmed` | impl 0x10302640: single exit returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 \| Wrapper parse |
| `RefreshShareIndex` | `402` | `strong` | impl impl literal exit returns 0; two out-branches tail into sched thunks -> f_1010eafc domain {0,720}; rc forwarded verbatim via req v\[+0x |
| `RefreshShareIndex` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | worker/delegate rc domain adds \[710\] beyond the documented accumulator bound |
| `RequestResort` | `402` | `strong` | impl impl literal exit returns 0; one out-branch tail into sched thunk -> f_1010eafc domain {0,720}; rc forwarded verbatim via req v\[+0x14\ |
| `RequestResort` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | worker/delegate rc domain adds \[701, 711\] beyond the documented accumulator bound |
| `SetBrowseable` | `800` | `confirmed` | dead action: validly parsed calls always fault with this code; malformed requests may still fail earlier at the request-validation gate (402 |
| `SetBrowseable` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `UpdateObject` | `402` | `strong` | impl accumulator r30: {711 literal (0x10302e88), 701 resolver fail (0x10302ef0), arg r5-seeded, call/lwz-derived}; rc forwarded verbatim via |
| `UpdateObject` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | favorites/userradio store-commit layer (dirObjFavorites vfunc -> f_10384490 userradio.xml atomic save): reachable codes {402,501,701,702,803 |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `DeviceProperties`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `AddBondedZones` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `AddBondedZones` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band |
| `AddHTSatellite` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `AddHTSatellite` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band |
| `CreateStereoPair` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `CreateStereoPair` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band |
| `EnterConfigMode` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| impl is a returns r3+0x9d04 -> real worker member accessor \| Wrapper parse layer r |
| `ExitConfigMode` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| impl is a returns r3+0x5b60 -> real worker member accessor \| Wrapper parse layer r |
| `GetAutoplayLinkedZones` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `GetAutoplayRoomUUID` | `402` | `strong` | worker f_1074c090 (632 insns): locked settings read - f_10988564/f_10988990 lock pair + RabortIfUnlocked; value via f_10765a00/f_105ab110; e |
| `GetAutoplayVolume` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `GetButtonLockState` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| impl is a lwz pair into out -> real worker shared_ptr copy accessor \| Wrapper pars |
| `GetButtonState` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `GetHouseholdID` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| impl is a lwz *(impl+0x2901c) - returns stored ptr -> real worker member accessor \ |
| `GetLEDState` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `GetUseAutoplayVolume` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `GetZoneAttributes` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `GetZoneInfo` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `RemoveBondedZones` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| impl is a bctr through obj vfunc +0x18 -> real worker vfunc via *(r3)+0x18 \| Wrapp |
| `RemoveBondedZones` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band |
| `RemoveHTSatellite` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| impl is a real fn -> real worker worker \| Wrapper parse layer rejected an argument |
| `RemoveHTSatellite` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band |
| `RoomDetectionStartChirping` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| impl is a lwz *(r3+0x10000-0x55d0) -> real worker member accessor \| Wrapper parse  |
| `RoomDetectionStopChirping` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| impl is a lwz pair into out -> real worker shared_ptr copy accessor \| Wrapper pars |
| `SeparateStereoPair` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. \| request-validate failure (req->v\[+0x08\] returned 0) |
| `SeparateStereoPair` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band |
| `SetAutoplayLinkedZones` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `SetAutoplayRoomUUID` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `SetAutoplayVolume` | `402` | `strong` | worker f_101935f8 (264 insns): f_1068c190 apply -> persist chain f_10180794/f_1040edf4/f_10807034/f_103f7638 -> f_1068ccc4 notify; exit r3=r |
| `SetButtonLockState` | `402` | `strong` | impl worker f_1019db60 is itself a 5-insn accessor returning r3+0x3fa2c member ptr - same accessor-returns-pointer shape as the DP getter fa |
| `SetLEDState` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `SetUseAutoplayVolume` | `402` | `strong` | worker f_101953c8 (1096 insns): strcmp validation gate -> f_1068bc0c apply -> f_1055847c/f_10558000 notify-commit; exit r3=r27 accumulator ( |
| `SetZoneAttributes` | `402` | `strong` | worker f_101931a8 (1096 insns): apply chain f_10186870/f_1040e4cc/f_10740ce8/f_10749a28/f_10749b34/f_10690d44 + f_109b6fe4/f_109b72ac log pa |
| `SetZoneAttributes` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | dp_zpimpl zone-attribute/bonding rc domain {821,822,824} (f_103619c8, dp_zpimpl.cxx) beside documented 402/640-band |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `GroupManagement`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `AddMember` | `402` | `strong` | request-validate failure; impl rc passthrough also reaches req->v\[+0x14\] |
| `AddMember` | `800` | `confirmed` | gm_impl AddMember impl-level failure |
| `AddMember` | `801` | `confirmed` | gm_impl AddMember impl-level failure |
| `AddMember` | `803` | `confirmed` | gm_impl AddMember impl-level failure |
| `AddMember` | `804` | `confirmed` | gm_impl AddMember impl-level failure |
| `AddMember` | `808` | `confirmed` | gm_impl AddMember impl-level failure |
| `AddMember` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `strong` | impl f_10394d10 complete literal fault ladder {402,800,801,802,803,804,806,807,808}: documented set missed 802/806/807. Strings: 'Adding mem |
| `RemoveMember` | `402` | `strong` | request-validate failure; impl rc passthrough also reaches req->v\[+0x14\] \| empty MemberID ('Removing member failed - invalid argument') |
| `RemoveMember` | `800` | `confirmed` | MemberID not in member list ('failed (not a member before?)') |
| `RemoveMember` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | group-membership rc domain reachable {800} plus internal codes via gm_impl chain |
| `ReportTrackBufferingResult` | `402` | `strong` | request-validate failure; impl rc passthrough also reaches req->v\[+0x14\] \| impl stub — unconditional 402 regardless of args |
| `SetSourceAreaIds` | `402` | `strong` | request-validate failure; impl rc passthrough also reaches req->v\[+0x14\] |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `GroupRenderingControl`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `GetGroupMute` | `701` | `confirmed` | nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc} |
| `GetGroupMute` | `402` | `strong` | SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails |
| `GetGroupMute` | `702` | `confirmed` | nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] - |
| `GetGroupVolume` | `701` | `confirmed` | nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc} |
| `GetGroupVolume` | `402` | `strong` | SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails |
| `GetGroupVolume` | `702` | `confirmed` | nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] - |
| `SetGroupMute` | `701` | `strong` | nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc} |
| `SetGroupMute` | `402` | `strong` | SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails |
| `SetGroupMute` | `702` | `confirmed` | nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] - |
| `SetGroupMute` | `801` | `strong` | reentrancy rejection: worker f_103a2160 reads flag byte *(impl+0x258); when already set it returns 0x321 (801) without performing the mutati |
| `SetGroupVolume` | `701` | `strong` | nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc} |
| `SetGroupVolume` | `402` | `strong` | SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails |
| `SetGroupVolume` | `702` | `confirmed` | nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] - |
| `SetRelativeGroupVolume` | `701` | `strong` | nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc} |
| `SetRelativeGroupVolume` | `402` | `strong` | SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails |
| `SetRelativeGroupVolume` | `702` | `confirmed` | nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] - |
| `SnapshotGroupVolume` | `701` | `confirmed` | nonzero worker rc; resolved domain {702(InstanceID!=0), 402(DesiredVolume>100 range), 701/801(member-apply failure), member-delegate-rc} |
| `SnapshotGroupVolume` | `402` | `strong` | SOAP 402 Invalid Args — raised when req->v\[+0x08\] rejects the request state or the required-arg lookup through req->v\[+0x1c\] fails |
| `SnapshotGroupVolume` | `702` | `confirmed` | nonzero InstanceID rejected: impl receives the handler-parsed InstanceID word in r4 (handler parses literal InstanceID via req->v\[+0x1c\] - |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `HTControl`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `CommitLearnedIRCodes` | `402` | `strong` | impl-level validation/argument rejection (r3=0x192) \| Wrapper parse layer rejected an argument before the impl call. |
| `GetIRRepeaterState` | `402` | `confirmed` | impl returns 0 unconditionally (single literal-0 exit); only the handler request-gate can fault \| Wrapper parse layer rejected an argument  |
| `GetLEDFeedbackState` | `402` | `strong` | impl-level validation/argument rejection (r3=0x192) \| Wrapper parse layer rejected an argument before the impl call. |
| `IdentifyIRRemote` | `402` | `strong` | impl-level validation/argument rejection (r3=0x192) \| Wrapper parse layer rejected an argument before the impl call. |
| `IsRemoteConfigured` | `402` | `confirmed` | impl returns 0 unconditionally (single literal-0 exit); only the handler request-gate can fault \| Wrapper parse layer rejected an argument  |
| `LearnIRCode` | `402` | `strong` | impl-level validation/argument rejection (r3=0x192) \| Wrapper parse layer rejected an argument before the impl call. |
| `SetIRRepeaterState` | `402` | `strong` | impl-level validation/argument rejection (r3=0x192) \| Wrapper parse layer rejected an argument before the impl call. |
| `SetIRRepeaterState` | `401` | `strong` | IR-repeater capability absent (member obj check at impl+0x150) |
| `SetIRRepeaterState` | `501` | `strong` | IR repeater not implemented on this hardware (cntlzw flag from member) |
| `SetLEDFeedbackState` | `402` | `strong` | impl-level validation/argument rejection (r3=0x192) \| Wrapper parse layer rejected an argument before the impl call. |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `MusicServices`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `GetSessionId` | `402` | `strong` | impl->v\[+0xc\] rc surfaced \| Wrapper parse layer rejected an argument before the impl call. |
| `GetSessionId` | `401` | `strong` | capability/mode flag gate (sp byte flags tested before arg parse) |
| `ListAvailableServices` | `402` | `strong` | impl->v\[+0x8\] rc surfaced \| Wrapper parse layer rejected an argument before the impl call. |
| `UpdateAvailableServices` | `800` | `strong` | impl->v\[+0x8\] rc surfaced |
| `UpdateAvailableServices` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `UpdateAvailableServices` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | music-services list refresh rc domain adds {801} via service-catalog worker |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `QPlay`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `QPlayAuth` | `402` | `confirmed` | request-validate gate failed (req->v\[+0x08\] returned 0) |
| `QPlayAuth` | `401` | `confirmed` | unknown action name on QPlay dispatcher |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `Queue`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `AddMultipleURIs` | `vret` | `strong` | delegates to queue-engine object *(svc+0x128) vfunc +0xd8; queue-engine vfunc on resolved engine vtable 0x10e97d30; concrete code set is the |
| `AddMultipleURIs` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `AddURI` | `vret(r5-in,+0x8)` | `strong` | worker f_102b6948 exit r30 - no literal defs; rc fully call-derived (enqueue chain) |
| `AddURI` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `AddURI` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,8 |
| `AttachQueue` | `vret` | `strong` | worker f_102b2da4 - exit producer not r3-adjacent; rc fully call-derived |
| `AttachQueue` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `Backup` | `vret(r5-in,+0x10)` | `strong` | nonzero worker rc surfaced verbatim; recovered domain: 800 preloaded on path-builder failure (0x102bd338); callee rc forwarded from the pers |
| `Backup` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `Browse` | `vret` | `strong` | nonzero worker rc surfaced verbatim; recovered domain: 402 on arg-record failures; browse-op rc forwarded (DIDL emission path) |
| `Browse` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `CreateQueue` | `vret(r5-in,+0x14)` | `strong` | worker f_102dff24 exit accumulator r30 proven {402 x2 (0x102dff64/0x102e00f0), 0 (0x102e0050)} - fully bounded, no call-derived exits |
| `CreateQueue` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `RemoveAllTracks` | `vret(r5-in,+0x18)` | `strong` | worker f_102b3a84: r28 accumulator arg-seeded (r4) + literal {718 (0x102b3b88), 1028 (0x102b3be0)}; AVT session lock pair wraps the op |
| `RemoveAllTracks` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `RemoveTrackRange` | `vret(r5-in,+0x1c)` | `strong` | literal gate: r6==0 -> 402 (0x102b3960); else b-tail into worker at 0x102b396c (derived) |
| `RemoveTrackRange` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `ReorderTracks` | `vret(r5-in,+0x20)` | `strong` | literal gate: r5==0 -> 402 (0x102b3930); else b-tail into worker at 0x102b393c (derived) |
| `ReorderTracks` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `ReplaceAllTracks` | `vret` | `strong` | delegates to queue-engine object *(svc+0x128) vfunc +0xdc; queue-engine vfunc on resolved engine vtable 0x10e97d30; concrete code set is the |
| `ReplaceAllTracks` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `SaveAsSonosPlaylist` | `vret(r5-in,+0x24)` | `strong` | literal gate: r4!=0 -> 800 (0x10465f88); r4==0 -> engine vfunc +0x7c on *(svc+0x128) |
| `SaveAsSonosPlaylist` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `SaveAsSonosPlaylist` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | savedqueues store-commit layer (dirObj saved-queues vfunc -> f_1047ee0c savedqueues.xml atomic save): reachable codes {501,701,802,803,804,8 |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `RenderingControl`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `GetBass` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `GetBass` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `GetEQ` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `GetEQ` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `GetHeadphoneConnected` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `GetHeadphoneConnected` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `GetLoudness` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `GetLoudness` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `GetMute` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `GetMute` | `402` | `confirmed` | Request parse/validation failure at the wrapper (missing or malformed InstanceID/Channel), or an unrecognized Channel token rejected by the  |
| `GetMute` | `702` | `confirmed` | InstanceID was nonzero: impl checks the parsed value and returns 0x2be before touching channel state. |
| `GetOutputFixed` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `GetOutputFixed` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `GetRoomCalibrationStatus` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `GetRoomCalibrationStatus` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call. |
| `GetSupportsOutputFixed` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `GetSupportsOutputFixed` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `GetTreble` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `GetTreble` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `GetTreble` | `impl_rc` | `strong` | impl-level return surfaced as the SOAP error code |
| `GetVolume` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `GetVolume` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `GetVolume` | `501` | `confirmed` | Audio context not ready: f_102a5028(*(impl+0x3ac)) returned failure inside worker f_100e42a8. |
| `GetVolume` | `702` | `confirmed` | InstanceID nonzero at the impl shim f_100e43b4. |
| `GetVolume` | `impl_rc` | `strong` | impl-level return surfaced as the SOAP error code |
| `GetVolumeDB` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `GetVolumeDB` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `GetVolumeDBRange` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `GetVolumeDBRange` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `RampToVolume` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `RampToVolume` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `ResetBasicEQ` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `ResetBasicEQ` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call. |
| `ResetExtEQ` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `ResetExtEQ` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `RestoreVolumePriorToRamp` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `RestoreVolumePriorToRamp` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `SetBass` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `SetBass` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `SetChannelMap` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `SetChannelMap` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `SetEQ` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `SetEQ` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `SetLoudness` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `SetLoudness` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `SetMute` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `SetMute` | `402` | `confirmed` | Request parse/validation failure at the wrapper, or unrecognized Channel token (not Master/LF/RF/FocusMode) rejected by the worker. |
| `SetMute` | `702` | `confirmed` | InstanceID nonzero; checked inside worker f_100d99b0 under the mutex. |
| `SetOutputFixed` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `SetOutputFixed` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `SetRelativeVolume` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `SetRelativeVolume` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `SetRoomCalibrationStatus` | `401` | `confirmed` | Service/implementation unavailable at dispatch: *(svc+4) impl pointer null when the dispatcher selected this action. |
| `SetRoomCalibrationStatus` | `402` | `confirmed` | Request argument parse/validation failure at the wrapper before the impl call; alternatively request argument parse/validation failure: req  |
| `SetTreble` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `SetTreble` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `SetVolume` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `SetVolume` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| `SetVolumeDB` | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |
| `SetVolumeDB` | `402` | `confirmed` | Request parse/validation failure at the wrapper. |
| _(dispatcher)_ | `401` | `confirmed` | Service/implementation unavailable at dispatch: the dispatcher found the action in the sorted table but the service object's implementation  |

### `SystemProperties`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `AddAccountX` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `AddAccountX` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803 |
| `AddOAuthAccountX` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) |
| `AddOAuthAccountX` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803 |
| `DoPostUpdateTasks` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `EditAccountMd` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `EditAccountMd` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803 |
| `EditAccountPasswordX` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. \| request-validate failure (req->v\[+0x08\] returned 0) |
| `EditAccountPasswordX` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803 |
| `EnableRDM` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `GetRDM` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `GetString` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `GetWebCode` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `RefreshAccountCredentialsX` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `RefreshAccountCredentialsX` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803 |
| `Remove` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `Remove` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803 |
| `RemoveAccount` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `RemoveAccount` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803 |
| `ReplaceAccountX` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `ReplaceAccountX` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803 |
| `SetAccountNicknameX` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `SetAccountNicknameX` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803 |
| `SetString` | `402` | `strong` | request-validate failure (req->v\[+0x08\] returned 0) \| Wrapper parse layer rejected an argument before the impl call. |
| `SetString` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803 |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `VirtualLineIn`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `Next` | `402` | `strong` | request-layer parse/impl gate failure \| Wrapper parse layer rejected an argument before the impl call. |
| `Pause` | `402` | `strong` | request-layer parse/impl gate failure \| Wrapper parse layer rejected an argument before the impl call. |
| `Play` | `402` | `strong` | request-layer parse/impl gate failure \| Wrapper parse layer rejected an argument before the impl call. |
| `Previous` | `402` | `strong` | request-layer parse/impl gate failure \| Wrapper parse layer rejected an argument before the impl call. |
| `SetVolume` | `402` | `strong` | request-layer parse/impl gate failure \| Wrapper parse layer rejected an argument before the impl call. |
| `StartTransmission` | `402` | `strong` | request-layer parse/impl gate failure \| Wrapper parse layer rejected an argument before the impl call. |
| `Stop` | `402` | `strong` | request-layer parse/impl gate failure \| Wrapper parse layer rejected an argument before the impl call. |
| `StopTransmission` | `402` | `strong` | request-layer parse/impl gate failure \| Wrapper parse layer rejected an argument before the impl call. |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |

### `ZoneGroupTopology`

| Action | Code | Status | Meaning |
|---|---|---|---|
| `BeginSoftwareUpdate` | `402` | `strong` | UpdateURL does not begin with "http" (strncasecmp 4) -> 402 with detail "Update URL is malformed"; on http-URL the request delegates to laun |
| `CheckForUpdate` | `402` | `strong` | UpdateType arg != "Software" (strcmp in impl) \| Wrapper parse layer rejected an argument before the impl call. |
| `CheckForUpdate` | `801` | `confirmed` | Software update requested but capability flag impl+0x5f4 clear (feature-gated) |
| `GetZoneGroupAttributes` | `501` | `strong` | attribute serialization not-ready flag - impl returns 0x1f5 |
| `GetZoneGroupAttributes` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `GetZoneGroupAttributes` | `store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])` | `inferred` | topology rc domain adds {800} via zgt worker |
| `GetZoneGroupState` | `501` | `strong` | state serializer flag clear (builder empty/not-ready) - impl returns 0x1f5 |
| `GetZoneGroupState` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `RegisterMobileDevice` | `none` | `confirmed` | no action-level fault path exists - handler commits unconditionally (request-envelope faults only) |
| `ReportAlarmStartedRunning` | `501` | `strong` | bound impl lacks the alarm-capable vfunc: *(svc+4)->v\[+0x24\] != f_1012b9b4 -> 501 (polymorphic impl-variant check) |
| `ReportAlarmStartedRunning` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| `ReportUnresponsiveDevice` | `402` | `strong` | DeviceID lacks RINCON_ prefix (strncmp,7) - f_10121310 returns 402 \| Wrapper parse layer rejected an argument before the impl call. |
| `SubmitDiagnostics` | `1000` | `strong` | diagnostics delegate absent: global->v\[+0xcc\](*(impl+0x578))==0 -> rc 0x3e8 |
| `SubmitDiagnostics` | `402` | `confirmed` | Wrapper parse layer rejected an argument before the impl call. |
| _(dispatcher)_ | `401` | `strong` | unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler |
