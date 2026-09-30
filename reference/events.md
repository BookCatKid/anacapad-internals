# Eventing

Two update channels live side by side. GENA is the classic UPnP mechanism: a controller subscribes over HTTP and the player posts XML notifications when state changes. Alongside it is Sonos's own websocket channel (WSS), which the current app uses for newer features. This page lists which events each service can emit on each channel.

UPnP GENA eventing plus the Sonos WSS subscription surface.

## Per-service eventing

For each service: whether it emits classic UPnP notifications, whether it carries the big 'LastChange' state document, and which websocket event names it offers.

## `AVTransport`

The busiest event source - this is how an app learns the player started, paused, skipped, or changed tracks without polling. It emits the big LastChange document covering transport state, current track, and queue position.

UPnP GENA NOTIFY; LastChange carries full AVT state incl rincon r:-extensions

- **Namespace:** urn:schemas-upnp-org:metadata-1-0/AVT/ + xmlns:r=urn:schemas-rinconnetworks-com:...
- **LastChange variable:** LastChange
- **notify_path:** f_102e41a0 AVT event emitter: mutexed (f_10557cac) LastChange doc build using template 0x10eb29e8; e:property write at 0x102e519c; arg+0x3dc string source; f_102b733c doc-write

## `AlarmClock`

Announces alarm-related state: the running-alarm list and its version counter bump when alarms are added, edited, or fire.

GENA SUBSCRIBE accepted at /AlarmClock/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `alarmClock`, `alarmVersionChange`
- **notify_path:** f_10277d6c initial-state e:property dump {TimeServer, AlarmListVersion, TimeFormat, TimeGeneration, DateFormat} -> f_10676a44 writer
- **payload_model:** e:property doc via f_10676a44 writer family
- **wss_registry:**
  - idx: 5, name: alarmClock, id: 20, tag: 64
  - idx: 6, name: alarmVersionChange, id: 24, tag: 1

## `AudioIn`

Line-in streaming events - reports when a line-in transmission to the group starts or stops and the attributes of the audio input.

GENA SUBSCRIBE accepted at /AudioIn/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `audioInput`, `lineInStatus`
- **notify_path:** f_10243170 e:property dump {TOSLinkConnected, IRRepeaterState} -> f_10676a44
- **payload_model:** e:property doc via f_10676a44 writer family
- **wss_registry:**
  - idx: 9, name: audioInput, id: 40, tag: 65
  - idx: 19, name: lineInStatus, id: 62, tag: 15

## `ConnectionManager (mediarenderer)`

Renderer-side connection bookkeeping - the list of active connection IDs and the protocols the player can serve, mostly static but notified on change.

GENA SUBSCRIBE accepted at /MediaRenderer/ConnectionManager/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `connectionManager`
- **notify_path:** f_10735918 emits CurrentConnectionIDs
- **wss_registry:**
  - idx: 22, name: connectionManager, id: 77, tag: 67

## `ConnectionManager (mediaserver)`

Server-side equivalent - reports the media-server connections list and the serving protocols.

GENA SUBSCRIBE accepted at /MediaServer/ConnectionManager/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `connectionManager`
- **notify_path:** shares CurrentConnectionIDs emitter f_10735918 (CM family); SourceProtocolInfo/SinkProtocolInfo are static (GetProtocolInfo)
- **wss_registry:**
  - idx: 22, name: connectionManager, id: 77, tag: 67

## `ContentDirectory`

Fires when the music-library index changes - SystemUpdateID bumps on rescan, share index progress, and favorites/radio-location list versions.

GENA SUBSCRIBE accepted at /MediaServer/ContentDirectory/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `contentDirectory`, `indexerStatus`, `favoritesVersionChange`, `playlistsVersionChange`
- **notify_path:** f_103035c4 emits {ContainerUpdateIDs, ShareIndexInProgress} + f_10303de4 emits {FavoritesUpdateID, SavedQueuesUpdateID, ShareListUpdateID, RadioFavoritesUpdateID} via event-bus workers f_1067693c/f_1067cdd0
- **wss_registry:**
  - idx: 23, name: contentDirectory, id: 80, tag: 68
  - idx: 42, name: indexerStatus, id: 152, tag: 23
  - idx: 31, name: favoritesVersionChange, id: 115, tag: 11
  - idx: 50, name: playlistsVersionChange, id: 195, tag: 34

## `DeviceProperties`

Device-level state changes: LED on/off, button lock, household ID, linked-zone membership, autoplay settings.

GENA SUBSCRIBE accepted at /DeviceProperties/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `deviceProperties`, `extendedDeviceStatus`, `microphoneSwitchStatus`, `batteryStatus`, `speakerPresenceStatus`
- **notify_path:** settings-key event path: impl setters append key\0value\0 pairs via f_10557d70 -> member->v\[+0x10\] notify -> internal event bus (SettingsNeedsUpdateEvent pool) -> GENA/WSS delivery; no dedicated per-service e:property emitter found - event source = the settings store's change list; ResetVolumeAfter emitted via f_102fc6f4/f_106f4bac
- **payload_model:** settings-key notifications (Desired*/Current* key changes) delivered via bus; GENA initial-notify serializes current keys
- **wss_registry:**
  - idx: 24, name: deviceProperties, id: 90, tag: 69
  - idx: 29, name: extendedDeviceStatus, id: 110, tag: 7
  - idx: 14, name: microphoneSwitchStatus, id: 57, tag: 15
  - idx: 12, name: batteryStatus, id: 55, tag: 15
  - idx: 65, name: speakerPresenceStatus, id: 289, tag: 61

## `GroupManagement`

Group membership changes - when players join or leave this player's group.

GENA SUBSCRIBE accepted at /GroupManagement/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `groupManagement`, `groupCoordinatorChanged`
- **notify_path:** group-coordination event pool: 'DelegatedGroupCoordinatorID','LocalGroupUUID','VirtualLineInGroupID','ZoneNameChangedEvent' names recovered; delivered via internal bus + GENA/WSS
- **wss_registry:**
  - idx: 34, name: groupManagement, id: 136, tag: 70
  - idx: 33, name: groupCoordinatorChanged, id: 134, tag: 12

## `GroupRenderingControl`

Group volume/mute state - fires when the coordinator-side group volume, mute, or a volume snapshot changes.

GENA SUBSCRIBE accepted at /MediaRenderer/GroupRenderingControl/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `groupRendering`
- **notify_path:** internal event 'GroupVolumeChangedEvent'/'GroupVolumeSetActionEvent' pool -> GENA/WSS; evented var 'GroupVolumeChangeable' literal proven; GroupMute/GroupVolume go through the same group-volume event pool
- **wss_registry:**
  - idx: 35, name: groupRendering, id: 137, tag: 71

## `HTControl`

Home-theater control events - IR repeater state, LED feedback, remote identification results.

GENA SUBSCRIBE accepted at /HTControl/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `htControl`
- **notify_path:** f_10739c34/f_10782194 emit {LEDFeedbackState, RemoteConfigured}
- **wss_registry:**
  - idx: 41, name: htControl, id: 149, tag: 72

## `MusicServices`

Music-service account changes - the available-services list and session IDs refresh when accounts are added or reauthorized.

GENA SUBSCRIBE accepted at /MusicServices/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `musicServices`, `musicServicesChanged`
- **notify_path:** f_100c7084 e:property dump {ServiceListVersion} -> f_10676a44
- **payload_model:** e:property doc via f_10676a44 writer family
- **wss_registry:**
  - idx: 44, name: musicServices, id: 166, tag: 73
  - idx: 45, name: musicServicesChanged, id: 167, tag: 25

## `QPlay`

QPlay session events - state of the QPlay (Tencent) playback source.

GENA SUBSCRIBE accepted at /QPlay/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- No WSS registry name maps to this service in the 73-entry table; event surface likely absent or folded into another namespace
- **notify_path:** 'updateSharedTQPlayMode' worker ('...bad context!' log) is the QPlay state-update path; X_QPlay_SoftwareCapability static; no dedicated emitter recovered

## `Queue`

Queue edits - last-index changes, queue length, and save/backup results so apps can refresh their queue view.

UPnP GENA NOTIFY; custom Sonos Queue namespace (not standard UPnP metadata-1-0)

- **Namespace:** urn:schemas-sonos-com:metadata-1-0/Queue/
- **notes:** Queue uses its own event vocabulary rather than a LastChange blob: QueueOwnerID/QueueID/UpdateID/Curated elements
- **notify_path:** f_10465b54 Queue event emitter using template 0x10ed1c6c (Queue svc region, near svc ctor f_104656d0)

## `RenderingControl`

Per-player audio settings - volume, mute, EQ, loudness, fixed-output and room-calibration status changes.

UPnP GENA NOTIFY with e:propertyset -> LastChange -> Event(InstanceID=0) -> val= attributes

- **Namespace:** urn:schemas-upnp-org:metadata-1-0/RCS/
- **LastChange variable:** LastChange
- **notify_path:** f_100e27b0: builds <Event xmlns=...RCS> LastChange doc (InstanceID, Volume/Mute Master\|LF\|RF) AND writes e:property via f_10676a44 at 0x100e2ea8; notify trigger f_100e328c/f_100e32a4
- **payload_model:** e:property doc via f_10676a44 writer family

## `SystemProperties`

Household/account bookkeeping - account lists, web-code provisioning results, and RDM (remote management) state changes.

GENA SUBSCRIBE accepted at /SystemProperties/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `systemProperties`, `settingsVersionChanged`, `settingsDataChanged`, `effectiveSettingsDataChanged`, `settingsPlayerSettingsChanged`, `entitlementsVersionChanged`, `voiceAccountsVersionChange`
- **notify_path:** settings-key event path: impl setters append key\0value\0 pairs via f_10557d70 -> member->v\[+0x10\] notify -> internal event bus (SettingsNeedsUpdateEvent pool) -> GENA/WSS delivery; no dedicated per-service e:property emitter found - event source = the settings store's change list
- **payload_model:** settings-key notifications (Desired*/Current* key changes) delivered via bus; GENA initial-notify serializes current keys
- **wss_registry:**
  - idx: 62, name: systemProperties, id: 274, tag: 76
  - idx: 58, name: settingsVersionChanged, id: 252, tag: 38
  - idx: 59, name: settingsDataChanged, id: 253, tag: 38
  - idx: 27, name: effectiveSettingsDataChanged, id: 101, tag: 9
  - idx: 60, name: settingsPlayerSettingsChanged, id: 254, tag: 38
  - idx: 28, name: entitlementsVersionChanged, id: 106, tag: 10
  - idx: 71, name: voiceAccountsVersionChange, id: 313, tag: 81

## `VirtualLineIn`

Virtual line-in stream events - when a player acts as a line-in source for the group and transport state of that virtual source.

GENA SUBSCRIBE accepted at /MediaRenderer/VirtualLineIn/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `virtualLineIn`
- **notify_path:** 'setVirtualLineInGroupIDLocked'/'VirtualLineInGroupID' state + internal event bus; no dedicated emitter recovered
- **wss_registry:**
  - idx: 70, name: virtualLineIn, id: 309, tag: 77

## `ZoneGroupTopology`

The household roster - fires when zones join, leave, regroup, or change attributes, plus software-update progress events.

GENA SUBSCRIBE accepted at /ZoneGroupTopology/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission decoded: f_1074d9b4 -> f_10743328 serializer -> f_10676a44 delivery

- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS events:** `zoneGroupTopology`, `activeZonesChange`, `zoneDefinitionsChange`, `zoneError`
- **notify_path:** f_1074d9b4 emitter: serializes <ZoneGroupState>/<ZoneGroups> full-state doc via f_10743328 -> delivery worker f_10676a44; svc+0xe7c flag gates a secondary emit via f_1074388c; f_1074d644 produces 3 flag bytes; initial-notify caller at 0x10752d2c; second emitter f_10129888 (topology.cxx): <MediaServers><Ex CURL= EURL= T= EXT=><MediaServer Name=> section + 'informLocalPlayerChange' + 'SourceAreasUpdateID'
- **payload_model:** direct <ZoneGroupState> XML (not LastChange attribute-form) - full-state push on topology change
- **wss_registry:**
  - idx: 72, name: zoneGroupTopology, id: 322, tag: 78
  - idx: 2, name: activeZonesChange, id: 12, tag: 82
  - idx: 3, name: zoneDefinitionsChange, id: 13, tag: 82
  - idx: 4, name: zoneError, id: 14, tag: 82

## WSS subscription registry

The named events the player offers on its websocket channel - the modern subscription vocabulary the app actually uses (groupVolume, playbackSession, and friends). Each entry is one name a client can subscribe to.

- **name:** WSS eventing subscription-type registry
- **role:** websocket (secure) event-subscription surface; TLV frame {u16 tag@+0, u8 type@+2} mapped to {id,name} via 73-entry runtime table
- **table:** 0x110b8ce8 (.bss, stride 0x14, count 0x49)
- **populator:** f_10098d34 (unrolled name/tag/handler stores)
- **lookup:** f_109e10d8 (tag/type -> entry+0 value; cmd 0x4a compared at call site)
- **reject_paths:** `Invalid transport: WSS is required (0x10f02958)`, `Invalid namespace: UPnP renew not supported (0x10f0297c)`, `Invalid namespace: UPnP unsubscribe not supported (0x10f029a8)`
- **entry_layout:** {+0x0 id/value, +0x4 name_ptr, +0x8 u32 monotonic event-type id (3..355), +0xc u16 tag, +0xe s8 type, +0x10 u32 kind}
- **status:** confirmed
- **note:** 73 WSS event-subscription types; each {name,id,tag,type} via runtime .bss table; kind field at +0x10 (kind==2 predicate at f_109e12b0); reject paths WSS-required/renew-not-supported/unsubscribe-not-supported
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10098d34, notes: populator writes name/tag/handler triples
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x109e10d8, notes: 73-iteration lookup loop, entry stride 0x14
- **entries** (73):

  ```
  accessorySwapStatus, tvAudioSignalStatus, activeZonesChange, zoneDefinitionsChange, alarmClock, alarmVersionChange, areasVersionChange, zoneError, audioClipStatus, audioInput, availableSoftwareUpdate, avTransport, batteryStatus, wirelessNetworkStatus, microphoneSwitchStatus, waterStatus, bluetoothPairingStatus, bluetoothConnectionStatus, poeStatus, cloudRegistration, connectionManager, contentDirectory, lineInStatus, wiredSubConnectionStatus, deviceProperties, diagnosticSubmissionResults, diagnosticMetadata, effectiveSettingsDataChanged, entitlementsVersionChanged, extendedDeviceStatus, extendedPlaybackStatus, favoritesVersionChange, groups, groupCoordinatorChanged, groupManagement, groupRendering, groupVolume, hdmiStatus, historyVersionChanged, householdUpdateStatus, upgradeManager, htControl, indexerStatus, localDevices, musicServices, musicServicesChanged, playbackMetadataStatus, playbackStatus, playbackError, playerVolume, playlistsVersionChange, positioningSessionStatus, positioningSessionError, positioningDeviceStatus, queue, renderingControl, sessionError, sessionInfo, settingsVersionChanged, settingsDataChanged, settingsPlayerSettingsChanged, systemProperties, sleepTimerStatus, timers, trueplayStatus, speakerPresenceStatus, speakerPresenceRateChange, trueroomAdaptationStatusEvent, trueroomCalibrationStatus, trueroomStatusEvent, virtualLineIn, voiceAccountsVersionChange, zoneGroupTopology
  ```
- **field_notes:** slot idx=0..72; +0x8 aux = monotonic global event-type id (3..355); +0xc u16 = TLV subscription-category tag (grouped: 0xf device-status family, 0x7d-0x89 UPnP-service family, 0x5a-0x60 playback/session, 0x3d trueplay, 0x26 settings, 0x52 zone); +0xe u8 type=0; +0x10 flags/handler
- **protocol:**
  - **frame_format:**
    - **layout:** {u16 tag @+0, s8 type @+2, payload...}
    - **lookup:** f_109e10d8(tag,type): scans table 0x110b8ce8 stride 0x14 x 0x49 entries matching e+0xc==tag AND (e+0xe==-1 wildcard \| type rules); returns entry index or 0x4a=invalid
    - **evidence:** f_109e10d8; call site 0x1068e6e0
  - **subscription_lifecycle:**
    - **create:** f_109e117c: sonos_uuid_generate -> sonos_uuid_unparse = new SID
    - **record:** subscription obj: frame ptr @+0x30, flag byte @+0x34, state word @+0x38
    - **renew:** rejected: 'Invalid namespace: UPnP renew not supported' @0x1068e830
    - **transport:** 'Invalid transport: WSS is required' @0x1068e794 - WSS-only
  - **f10_field:** entry +0x10 u32 in {0,4} - flag/category; consumer semantics undecoded
  - **error_path:** f_1068c138 appends error text into a doc buffer (strlen -> f_1068c040 span-append via doc-writer adaptor) - WSS errors are doc-embedded, not HTTP-status; f_1068c190 namespace strcmp(obj+0x124) matcher used for 'UPnP renew' rejection
- **f10_field:**
  - **field:** entry +0x10 u32 kind/category
  - **consumer:** f_109e12b0(idx): bounds idx<=0x48, entry=0x110b8ce8+idx*0x14, returns (entry\[+0x10\]==2) predicate
  - **writer_semantics:** literal stores of {0,1,2} observed in the f_109d8bxx/f_109d8bxx registration-path region; kind values enumerate entry categories (0/1/2); kind==2 = the service-visible category gated by the predicate accessor
  - **status:** strong
  - **evidence:**
    - type: disassembly, locator: 0x109e12b0..0x109e12e8, note: lwz +0x10 -> xori 0x2 -> cntlzw -> rlwinm = ==2 predicate
- **name_order:** registry index order from f_10098d34 sequential stores
- **table_full:**
  - idx: 0, name: accessorySwapStatus, id: 78, tag: 18
  - idx: 1, name: tvAudioSignalStatus, id: 4, tag: 18
  - idx: 2, name: activeZonesChange, id: 12, tag: 82
  - idx: 3, name: zoneDefinitionsChange, id: 13, tag: 82
  - idx: 4, name: zoneError, id: 14, tag: 82
  - idx: 5, name: alarmClock, id: 20, tag: 64
  - idx: 6, name: alarmVersionChange, id: 24, tag: 1
  - idx: 7, name: areasVersionChange, id: 34, tag: 2
  - idx: 8, name: audioClipStatus, id: 38, tag: 3
  - idx: 9, name: audioInput, id: 40, tag: 65
  - idx: 10, name: availableSoftwareUpdate, id: 51, tag: 63
  - idx: 11, name: avTransport, id: 52, tag: 66
  - idx: 12, name: batteryStatus, id: 55, tag: 15
  - idx: 13, name: wirelessNetworkStatus, id: 56, tag: 15
  - idx: 14, name: microphoneSwitchStatus, id: 57, tag: 15
  - idx: 15, name: waterStatus, id: 58, tag: 15
  - idx: 16, name: bluetoothPairingStatus, id: 59, tag: 15
  - idx: 17, name: bluetoothConnectionStatus, id: 58, tag: 15
  - idx: 18, name: poeStatus, id: 61, tag: 15
  - idx: 19, name: lineInStatus, id: 62, tag: 15
  - idx: 20, name: wiredSubConnectionStatus, id: 63, tag: 15
  - idx: 21, name: cloudRegistration, id: 74, tag: 19
  - idx: 22, name: connectionManager, id: 77, tag: 67
  - idx: 23, name: contentDirectory, id: 80, tag: 68
  - idx: 24, name: deviceProperties, id: 90, tag: 69
  - idx: 25, name: diagnosticSubmissionResults, id: 95, tag: 8
  - idx: 26, name: diagnosticMetadata, id: 96, tag: 8
  - idx: 27, name: effectiveSettingsDataChanged, id: 101, tag: 9
  - idx: 28, name: entitlementsVersionChanged, id: 106, tag: 10
  - idx: 29, name: extendedDeviceStatus, id: 110, tag: 7
  - idx: 30, name: extendedPlaybackStatus, id: 111, tag: 30
  - idx: 31, name: favoritesVersionChange, id: 115, tag: 11
  - idx: 32, name: groups, id: 133, tag: 13
  - idx: 33, name: groupCoordinatorChanged, id: 134, tag: 12
  - idx: 34, name: groupManagement, id: 136, tag: 70
  - idx: 35, name: groupRendering, id: 137, tag: 71
  - idx: 36, name: groupVolume, id: 138, tag: 14
  - idx: 37, name: hdmiStatus, id: 140, tag: 16
  - idx: 38, name: historyVersionChanged, id: 141, tag: 17
  - idx: 39, name: householdUpdateStatus, id: 147, tag: 20
  - idx: 40, name: upgradeManager, id: 148, tag: 20
  - idx: 41, name: htControl, id: 149, tag: 72
  - idx: 42, name: indexerStatus, id: 152, tag: 23
  - idx: 43, name: localDevices, id: 160, tag: 6
  - idx: 44, name: musicServices, id: 166, tag: 73
  - idx: 45, name: musicServicesChanged, id: 167, tag: 25
  - idx: 46, name: playbackMetadataStatus, id: 181, tag: 31
  - idx: 47, name: playbackStatus, id: 184, tag: 29
  - idx: 48, name: playbackError, id: 185, tag: 29
  - idx: 49, name: playerVolume, id: 192, tag: 33
  - idx: 50, name: playlistsVersionChange, id: 195, tag: 34
  - idx: 51, name: positioningSessionStatus, id: 211, tag: 35
  - idx: 52, name: positioningSessionError, id: 212, tag: 35
  - idx: 53, name: positioningDeviceStatus, id: 213, tag: 35
  - idx: 54, name: queue, id: 223, tag: 74
  - idx: 55, name: renderingControl, id: 237, tag: 75
  - idx: 56, name: sessionError, id: 246, tag: 32
  - idx: 57, name: sessionInfo, id: 247, tag: 32
  - idx: 58, name: settingsVersionChanged, id: 252, tag: 38
  - idx: 59, name: settingsDataChanged, id: 253, tag: 38
  - idx: 60, name: settingsPlayerSettingsChanged, id: 254, tag: 38
  - idx: 61, name: sleepTimerStatus, id: 259, tag: 52
  - idx: 62, name: systemProperties, id: 274, tag: 76
  - idx: 63, name: timers, id: 276, tag: 59
  - idx: 64, name: trueplayStatus, id: 288, tag: 61
  - idx: 65, name: speakerPresenceStatus, id: 289, tag: 61
  - idx: 66, name: speakerPresenceRateChange, id: 290, tag: 61
  - idx: 67, name: trueroomAdaptationStatusEvent, id: 292, tag: 62
  - idx: 68, name: trueroomCalibrationStatus, id: 293, tag: 62
  - idx: 69, name: trueroomStatusEvent, id: 294, tag: 62
  - idx: 70, name: virtualLineIn, id: 309, tag: 77
  - idx: 71, name: voiceAccountsVersionChange, id: 313, tag: 81
  - idx: 72, name: zoneGroupTopology, id: 322, tag: 78
- **entry_semantics:** {+0x4 name, +0x8 event-type-id (3..355), +0xc u16 wire tag, +0xe s8 type, +0x10 kind} — idx==registry slot, id==internal event enum, tag==on-wire TLV tag

Event names: `accessorySwapStatus`, `tvAudioSignalStatus`, `activeZonesChange`, `zoneDefinitionsChange`, `alarmClock`, `alarmVersionChange`, `areasVersionChange`, `zoneError`, `audioClipStatus`, `audioInput`, `availableSoftwareUpdate`, `avTransport`, `batteryStatus`, `wirelessNetworkStatus`, `microphoneSwitchStatus`, `waterStatus`, `bluetoothPairingStatus`, `bluetoothConnectionStatus`, `poeStatus`, `cloudRegistration`, `connectionManager`, `contentDirectory`, `lineInStatus`, `wiredSubConnectionStatus`, `deviceProperties`, `diagnosticSubmissionResults`, `diagnosticMetadata`, `effectiveSettingsDataChanged`, `entitlementsVersionChanged`, `extendedDeviceStatus`, `extendedPlaybackStatus`, `favoritesVersionChange`, `groupCoordinatorChanged`, `groupManagement`, `groupRendering`, `hdmiStatus`, `historyVersionChanged`, `householdUpdateStatus`, `upgradeManager`, `htControl`, `indexerStatus`, `musicServices`, `musicServicesChanged`, `playbackMetadataStatus`, `playbackStatus`, `playlistsVersionChange`, `positioningSessionStatus`, `positioningSessionError`, `positioningDeviceStatus`, `renderingControl`, `sessionError`, `sessionInfo`, `settingsVersionChanged`, `settingsDataChanged`, `settingsPlayerSettingsChanged`, `systemProperties`, `sleepTimerStatus`, `trueplayStatus`, `speakerPresenceStatus`, `speakerPresenceRateChange`, `trueroomAdaptationStatusEvent`, `trueroomCalibrationStatus`, `trueroomStatusEvent`, `virtualLineIn`, `voiceAccountsVersionChange`, `zoneGroupTopology`

## GENA internals

How classic UPnP eventing is implemented here: how a subscription is validated, how the notification XML is assembled, and what happens when a subscriber stops answering.

- **status:** confirmed
- **files:** `/oc/zone/common/upnpeventing_source.cxx`, `/oc/zone/common/eventing.cxx`, `eventing.cxx`
- **name:** upnpeventing notification engine (upnpeventing_sender.cxx + upnpeventing_source.cxx)
- **sender:** thread "upnpeventing" (runOnce loop); fireNotifications/fireNotificationData; emits <e:propertyset><e:property><...></e:property></e:propertyset>; retry backoff "%d failure(s) sending event ... Now %ld Retry at %ld expires at %ld"; Initial ZGT (ZoneGroupTopology) completion tracked
- **subscription_lifecycle:** Create/updating/renewing/canceling/terminated states logged; "Removed Insecure UPnP %s" - insecure subscriptions purged; link-local subs cleared; sid format uuid:%s_sub%010u; callback URI validation chain: invalid protocol\|host lookup failure\|host on wrong subnet\|port is unintelligible
- **tls:** outbound subs via RSslConnection; mbedTLS session-ticket resumption ("Got session ticket ... during write/read"); handshake/roundtrip timing metrics
- **metrics:** countEvents{Success,Failure,SuccessFirstTry,SuccessRetry}, countFailures{Retry,Connect,Handshake,Read,Write,Timeout}, avgHandshakeTimeMsOn{Success,Failure}, avgRoundTripTimeMsOn{Success,Failure}, remoteIp/remoteUUID/localUUID/sourceName per sub
- **upnp_page_schema:** <Service name current max><Subscription><EventKey/><NotifyErrors/><SubscriptionID/><NotificationAddr>wss://%s:%u (muse)\|plain</NotificationAddr><IsSecure/></Subscription></Service>; <TruncatedConnectionList maxwebsockets connections/>
- **wshistory_page_schema:** <Connection id><RemoteEndpoint/><LocalEndpoint/><SubscribedEvents><Subscription name type/></SubscribedEvents><History/><ConnectionDetails><Command namespace cmd method credType/><Version/><Duration/><NextPing/><LastRequest/><Closed/><Key/><UserAgent/><ClientVersion/></ConnectionDetails></Connection>; <Active>; WebSocketHistory + RestHistory sections
- **channel_type_enum:** `HTSNK`, `FEEDBACK`, `EXT_VOICE+CLIP`, `EXT_CHIRP`, `SIDEBAND_FEEDBACK`, `SETUP_DISCOVERY`, `SPEAKER_DETECT`, `TV_SAT`, `CHSNK_SAT`
- **trusted_clock:** rwlW_trusted_clock/trclock; "seed set with \[%ld\], offset now \[%lld\]" - seeded by lechmere Date: header
- **evidence:** `literal block 0x10effc34-0x10f01580`
