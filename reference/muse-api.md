# muse API (v1)

The household/player REST API the official app and cloud channel drive — recovered from the binary's route registration tables, not from public docs.

the complete muse route registration table recovered from rodata: 603 route records across 67 resources / 332 distinct operations. Each record is 24 bytes {path_template*, flags, 0, handler*, 0, csv_descriptor*}. The csv descriptor 'scope,resource,verb\[,subparam\]' names the operation; the path template carries {param} bindings. Most ops exist twice: unscoped (v1/players/{playerId}/...) and household-scoped (v1/households/{householdId}/players/{playerId}/...). All muse routes are mounted under the /api prefix — the master HTTP table registers '/api' -> f_100d2cf8 which installs the muse dispatcher (stubs f_100d36c0/f_100d36e4 -> pipeline f_100d2e18), so on the wire paths are /api/v1/... .

**flags decode:** flags low byte = HTTP method bitmask: 0x01 GET, 0x02 POST, 0x04 PUT, 0x08 DELETE, 0x10 PATCH (settings-only). Bit 0x100 set = household/settings-class routes; clear (0x2000000x) = playback/volume-class (playback, groupVolume, playerVolume, playbackMetadata). 0x20000000 = muse marker bit on all records.

**dispatch:** two stubs only: f_100d36c0 (r8=0) serves 332 records, f_100d36e4 (r8=1) 271; both tail-call f_100d2e18 which normalizes the request into a 0x2a00-byte context (header/flag block at +0x416.., buf +0x2594) and dispatches on the parsed csv op name. r6==NULL fast-path returns 0.

Registration arrays: `primary` — 0x10e7a68c.. (householdId dialect incl. protectedAdmin); `secondary` — 0x10e783f8.. ({HHID} dialect incl. protected-admin)

## Op-object vtable spine

Every op is a C++ object sharing one vtable skeleton: `+0x00`/`+0x04` destructors (per-op), `+0x08` shared run-gate (`0x109c9854`, same in all 682 vtables), `+0x0c` the per-op **execute** (unique per op class — shown as Exec in the tables below), `+0x10` shared default, and `+0x14`..`+0x60` a fixed hook ladder whose base defaults live at `0x101c0638..0x101c06ac`. Ops override subsets of the hooks: the low hooks read body params — each overridden hook is one **declared parameter**, reading exactly one named JSON member through `f_108337b0` (e.g. setVolume: `+0x1c`→`muted`, `+0x20`→`volume`; seek: `+0x1c`→`playOnCompletion`, `+0x20`→`positionMillis`, `+0x28`→`itemId`, `+0x2c`→`window`) — the Params column lists them — and higher hooks build forwarded requests (e.g. `setVolume` overrides `+0x60` to emit `v1/players/{id}/playerVolume/mute` and `v1/groups/{id}/groupVolume`). Each verb registers two op classes — a player-channel variant and a fatter household-channel variant.

**Body validation library** (`0x109c74b0..0x109ca92c`): typed validators keyed by field name — `f_109ca3b4` emits 'Missing required field: ', `f_109c9cc0` 'Unexpected type given for key: ', `f_109c8c60` 'Found unexpected array for '/'Unable to parse array for ', `f_109c90ec` 'Found object for ', `f_109ca92c` coerces strings ('Unable to coerce string to boolean for key: '/' to number for key: '), `f_109c7cb4`/`f_109c8004`/`f_109c8354`/`f_109c86dc` numeric bounds ('below minimum of '/'above maximum of '), `f_109c7954` 'Parameter '…' out of range: ', `f_109c74b0` timestamps (' failed timestamp validation'), `f_109c7740` ' not a valid Muse error code'.

## Request pipeline

**request envelope.** f_100d2e18 builds a 0x2a00-byte request context (headers/flags at +0x416.., scratch buf at +0x2594). Route lookup by path template -> 24-byte record {path*, method_flags, 0, stub*, 0, csv*}. Stubs f_100d36c0 (channel r8=0) / f_100d36e4 (r8=1) tail-call the dispatcher.

**content type.** Body-bearing requests must send Content-Type: application/json (verified by strcmp at 0x100d3230-0x100d3240); PATCH routes require application/merge-patch+json (0x10e7bd1c) instead. Violation -> error 'missing or invalid Content-Type; must be %s' (0x10e7bd3c) with status class 0x19f (415) via f_100d23d8.

**auth.** API-key check in f_106d9880 (called at 0x100d35b0 with arg 0x1058439c); failure -> 'Invalid api key' (0x10e7bd68), status class 0x190 (400), error code 0x5d (93).

**path params.** Path params parsed with strtoul(base 10) at 0x100d3210 for numeric ids.

**body.** JSON body parsed by f_106d966c/f_106d98e0 into a value store; response serialized by f_106db220 via the writer object at 0x11095f88+0xf10.

**errors.** Errors are a 0x40-byte serialized envelope built at rsp+0x8c and emitted by f_100d23d8(ctx, buf, status_class, errcode, msg).

**op dispatch.** The parsed csv verb is looked up in a per-resource op map (see find-by-name loops f_108337b0 users such as f_10b23e3c). Ops are C++ objects created by per-verb factory functions; each op class installs its own vtable (slot 0 = per-op execute; +8 = shared run trampoline f_109c9854).

## Outbound (player as muse client)

The player is also a muse CLIENT (household channel): a descriptor stream at .got2 0x1108dea4-0x1108e2e4 lists outbound ops for cloud-facing resources in order: authorization, entitlements, groups, history, playback, playerVolume, systemReporting, zones (+catalog). Entries: /pathSuffix + opName + 'k=' query params + field names.

| Outbound op | Wire shape |
|---|---|
| `activateZone` | suffix `/activate` |
| `addMissingZoneDefinition` | suffix `/missingDefinition` |
| `addZoneDefinition` | — |
| `authenticateClient` | prefix `players/` suffix `/authenticateClient` |
| `authorizeDevice` | prefix `players/` suffix `/authorizeDevice` |
| `batchTranslate` | prefix `services/` suffix `/ids` |
| `createGroup` | suffix `/createGroup` |
| `createInvite` | suffix `/invite` |
| `deactivateZone` | suffix `/deactivate` |
| `deleteInvite` | query `inviteId=` |
| `duck` | suffix `/duck` |
| `getActiveZoneList` | — |
| `getContent` | suffix `/content` |
| `getGroups` | query `includeDeviceInfo=` |
| `getGroupsEx` | suffix `/extended` |
| `getPermissions` | suffix `/permissions` query `route=`, `protocolVersion=` |
| `getPolicyKey` | suffix `/policy` |
| `getUsers` | suffix `/users` query `mainAccountId=` |
| `getZoneDefinition` | suffix `/definition` |
| `getZoneDefinitionList` | — |
| `joinZone` | prefix `players/` suffix `/join` |
| `loadContainer` | suffix `/loadContainer` |
| `loadContent` | suffix `/content` |
| `loadLineIn` | suffix `/lineIn` |
| `loadStream` | suffix `/loadStream` |
| `loadTrackList` | suffix `/trackList` |
| `modifyGroupMembers` | suffix `/modifyGroupMembers` |
| `pause` | suffix `/pause` |
| `play` | suffix `/play` |
| `redeemInvite` | suffix `/redeem` |
| `removeZoneDefinition` | — |
| `reportAccountSubscription` | suffix `/accountSubscription` |
| `reportFirmwareDownload` | suffix `/firmwareDownload` |
| `reportProductEvent` | suffix `/productEvent` |
| `reportSoftwareDownload` | suffix `/softwareDownload` |
| `resolveToken` | suffix `/tokens` |
| `seek` | suffix `/seek` |
| `seekRelative` | suffix `/seekRelative` |
| `setGroupMembers` | prefix `groups/` suffix `/setGroupMembers` |
| `setMute` | suffix `/mute` |
| `setPlayModes` | suffix `/playMode` |
| `setRelativeVolume` | suffix `/relative` |
| `skipBack` | suffix `/skipBack` |
| `skipToNextTrack` | suffix `/skipToNextTrack` |
| `skipToPreviousTrack` | suffix `/skipToPreviousTrack` |
| `skipToTrack` | suffix `/skipToTrack` |
| `subscribeUser` | suffix `/subscription` |
| `togglePlayPause` | suffix `/togglePlayPause` |
| `translate` | suffix `/id` query `accountId=`, `destinationServiceId=` |
| `unduck` | suffix `/unduck` |
| `unjoinZone` | suffix `/unjoin` |
| `unsubscribeUser` | prefix `households/` |
| `updateActiveZone` | suffix `/activeZone` |
| `updateZoneDefinition` | — |
| `updateZoneMemberSettings` | suffix `/memberSettings` |


## Event channels

The complete muse event-channel namespace emitted over /websocket/api — each channel name below is a subscription target in the muse event bus (SUBSCRIBE/NOTIFY per channel). Includes several channels with no public documentation: waterStatus, poeStatus, speakerPresenceRateChange, microphoneSwitchStatus, bluetoothPairingStatus/ConnectionStatus, wiredSubConnectionStatus, trueroomAdaptationStatusEvent.

`groups`, `groupVolume`, `localDevices`, `playbackError`, `playerVolume`, `queue`, `timers`, `accessorySwapStatus`, `tvAudioSignalStatus`, `activeZonesChange`, `zoneDefinitionsChange`, `zoneError`, `alarmClock`, `alarmVersionChange`, `areasVersionChange`, `audioClipStatus`, `audioInput`, `availableSoftwareUpdate`, `avTransport`, `batteryStatus`, `wirelessNetworkStatus`, `microphoneSwitchStatus`, `waterStatus`, `bluetoothPairingStatus`, `bluetoothConnectionStatus`, `poeStatus`, `lineInStatus`, `wiredSubConnectionStatus`, `cloudRegistration`, `connectionManager`, `contentDirectory`, `deviceProperties`, `diagnosticSubmissionResults`, `diagnosticMetadata`, `effectiveSettingsDataChanged`, `entitlementsVersionChanged`, `extendedDeviceStatus`, `extendedPlaybackStatus`, `favoritesVersionChange`, `groupCoordinatorChanged`, `groupManagement`, `groupRendering`, `hdmiStatus`, `historyVersionChanged`, `householdUpdateStatus`, `upgradeManager`, `htControl`, `indexerStatus`, `musicServices`, `musicServicesChanged`, `playbackMetadataStatus`, `playbackStatus`, `playlistsVersionChange`, `positioningSessionStatus`, `positioningSessionError`, `positioningDeviceStatus`, `renderingControl`, `sessionError`, `sessionInfo`, `settingsVersionChanged`, `settingsDataChanged`, `settingsPlayerSettingsChanged`, `sleepTimerStatus`, `systemProperties`, `trueplayStatus`, `speakerPresenceStatus`, `speakerPresenceRateChange`, `trueroomAdaptationStatusEvent`, `trueroomCalibrationStatus`, `trueroomStatusEvent`, `virtualLineIn`, `voiceAccountsVersionChange`, `zoneGroupTopology`

## Resources

| Resource | Ops | Methods | Scope params |
|---|---|---|---|
| `alarms` | 7 | DELETE, GET, POST, PUT | groupId, householdId |
| `areas` | 4 | DELETE, GET, POST, PUT | householdId |
| `audioClip` | 4 | DELETE, POST | playerId |
| `authorization` | 15 | DELETE, GET, POST | householdId, none, playerId |
| `catalog` | 4 | GET | serviceId |
| `devices` | 16 | DELETE, GET, POST, PUT | householdId, playerId, userId |
| `devicesExtended` | 1 | GET | householdId |
| `diagnostics` | 6 | GET, POST | playerId |
| `effectiveSettings` | 8 | GET, PATCH | playerId |
| `entitlements` | 3 | GET | householdId, userId |
| `favorites` | 3 | GET, POST | groupId, householdId |
| `groupVolume` | 8 | GET, POST | groupId |
| `groups` | 7 | GET, POST | groupId, householdId |
| `hardwareStatus` | 34 | DELETE, GET, POST | playerId |
| `hdmi` | 6 | GET | playerId |
| `history` | 4 | DELETE, GET, POST | householdId |
| `homeTheater` | 24 | DELETE, GET, POST | playerId |
| `householdUpdate` | 4 | GET, POST | deviceId |
| `households` | 7 | GET, POST, PUT | householdId, none |
| `info` | 2 | GET | playerId |
| `ircontrol` | 4 | GET, POST | playerId |
| `localContentLibrary` | 6 | DELETE, GET, POST | householdId, playerId |
| `management` | 4 | POST | playerId |
| `musicServiceAccounts` | 7 | GET, POST | groupId, householdId |
| `networkTest` | 6 | GET, POST | playerId |
| `pinewood` | 20 | POST | playerId |
| `platformInternal` | 4 | POST | householdId, playerId |
| `playback` | 32 | GET, POST | groupId |
| `playbackExtended` | 2 | GET | groupId |
| `playbackMetadata` | 4 | GET, POST | groupId |
| `playbackSession` | 30 | DELETE, POST | groupId, sessionId |
| `playerVolume` | 12 | GET, POST | playerId |
| `playlists` | 5 | GET, POST | groupId, householdId |
| `positioning` | 28 | DELETE, GET, POST | playerId |
| `power` | 2 | POST | playerId |
| `roomDetection` | 4 | DELETE, POST | playerId |
| `settings` | 34 | GET, PATCH, POST, PUT | householdId, playerId, userId |
| `sleepTimer` | 4 | GET, POST | groupId |
| `smartplay` | 1 | GET | householdId |
| `soundSwap` | 4 | POST | playerId |
| `svc` | 6 | GET, POST | playerId |
| `systemReporting` | 8 | POST | none |
| `systemTime` | 2 | GET, PUT | householdId |
| `time` | 2 | GET | playerId |
| `timers` | 14 | DELETE, GET, POST, PUT | playerId |
| `trueplay` | 14 | DELETE, GET, POST | playerId |
| `trueroom` | 10 | GET, POST | playerId |
| `update` | 6 | GET, POST | playerId |
| `upnpAVTransport` | 8 | DELETE, POST | playerId |
| `upnpAlarmClock` | 8 | DELETE, POST | playerId |
| `upnpAudioIn` | 8 | DELETE, POST | playerId |
| `upnpConnectionManager` | 8 | DELETE, POST | playerId |
| `upnpContentDirectory` | 8 | DELETE, POST | playerId |
| `upnpDeviceProperties` | 8 | DELETE, POST | playerId |
| `upnpGroupManagement` | 8 | DELETE, POST | playerId |
| `upnpGroupRenderingControl` | 8 | DELETE, POST | playerId |
| `upnpHTControl` | 8 | DELETE, POST | playerId |
| `upnpMusicServices` | 8 | DELETE, POST | playerId |
| `upnpQueue` | 8 | DELETE, POST | playerId |
| `upnpRenderingControl` | 8 | DELETE, POST | playerId |
| `upnpSystemProperties` | 8 | DELETE, POST | playerId |
| `upnpVirtualLineIn` | 8 | DELETE, POST | playerId |
| `upnpZoneGroupTopology` | 8 | DELETE, POST | playerId |
| `virtualLineIn` | 12 | POST | playerId |
| `virtualRemoteControl` | 2 | POST | playerId |
| `voice` | 12 | DELETE, GET, POST | playerId |
| `zones` | 15 | DELETE, GET, POST, PUT | householdId, playerId |

## `alarms`

Alarm management for the modern API. Mirrors the legacy AlarmClock service but routes are group- or household-scoped, so creating an alarm targets a playback group rather than a raw player. Ops cover listing, creating, updating and deleting alarms; the underlying state lives in the same alarmclock persistence layer, so alarms created here appear in UPnP `ListAlarms` output and vice versa.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/alarms` | `getAlarms` | `-` | `0x20000101` | `0x10ac7834` `0x10ac7844` desc:`10acc494` | — |
| `GET` | `v1/households/{householdId}/alarms/{alarmId}` | `fetchAlarm` | `alarmId` | `0x20000101` | `0x10ac7844` `0x10ac7854` desc:`10acc4a4` | `alarmId` |
| `POST` | `v1/households/{householdId}/alarms` | `createAlarm` | `-` | `0x20000102` | `0x10ac7854` `0x10ac7864` desc:`10acc4b4` | `alarmId`, `createAlarm`, `createAlarm` |
| `PUT` | `v1/households/{householdId}/alarms/{alarmId}` | `updateAlarm` | `alarmId` | `0x20000104` | `0x10ac7864` `0x10ac7874` desc:`10acc4c4` | `createAlarm`, `createAlarm`, `enabled`, `alarmId`, `description`, `description` |
| `POST` | `v1/groups/{groupId}/alarms/snooze` | `snoozeAlarm` | `-` | `0x20000102` | `0x10ac7874` `0x10ac7884` desc:`10acc4d4` | `enabled`, `alarmId`, `description`, `description`, `duration` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/alarms/snooze` | `snoozeAlarm` | `-` | `0x20000102` | `0x10ac7874` `0x10ac7884` desc:`10acc4d4` | `enabled`, `alarmId`, `description`, `description`, `duration` |
| `DELETE` | `v1/households/{householdId}/alarms/{alarmId}` | `removeAlarm` | `alarmId` | `0x20000108` | `0x10ac7884` `0x10ac7894` desc:`10acc4e4` | `duration`, `alarmId` |

Related enum registrations (proven integer values — see `enum_tables`):

- **alarm_state**: `ALARM_DISABLED`=1, `ALARM_PENDING`=2, `ALARM_SNOOZED`=3, `ALARM_FIRING`=4
- **instance_state**: `ACTIVE`=1, `DONE`=2, `DISMISSED`=3, `INACTIVE`=4, `INTERRUPTED`=5, `ERROR`=6
- **weekday_bits**: `SU`=1, `MO`=2, `TU`=3, `WE`=4, `TH`=5, `FR`=6, `SA`=7

Op-level JSON keys recovered from op-object methods: `muse`, `alarmId`, `createAlarm`, `enabled`, `description`, `duration`

## `areas`

Household areas (the multi-room 'spaces' concept used by newer app surfaces). Ops create, update, list and delete named areas under a household. Separate from zone groups — an area is a user-facing organizational container, not an active playback group.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/areas` | `getAreas` | `-` | `0x20000101` | `0x10acc4a4` `0x10acc4b4` desc:`10ad0368` | — |
| `POST` | `v1/households/{householdId}/areas` | `createArea` | `-` | `0x20000102` | `0x10acc4b4` `0x10acc4c4` desc:`10ad0378` | `playerIds`, `playerIds`, `name` |
| `PUT` | `v1/households/{householdId}/areas/{areaId}` | `updateArea` | `areaId` | `0x20000104` | `0x10acc4c4` `0x10acc4d4` desc:`10ad0388` | `playerIds`, `playerIds`, `name`, `areaId` |
| `DELETE` | `v1/households/{householdId}/areas/{areaId}` | `removeArea` | `areaId` | `0x20000108` | `0x10acc4d4` `0x10acc4e4` desc:`10ad0398` | `playerIds`, `playerIds`, `areaId` |

Op-level JSON keys recovered from op-object methods: `muse`, `playerIds`, `name`, `areaId`

## `audioClip`

The doorbell/chime audio-clip feature. A client uploads or registers a short audio clip on a player and later triggers it (used by the doorbell button chimes). POST-only write surface with delete; clips are player-scoped.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/audioClip` | `loadAudioClip` | `-` | `0x20000102` | `0x10ad0378` `0x10ad0388` | `clipBehavior`, `clipBehavior`, `volume`, `name`, `clipMetadata`, `clipMetadata` |
| `POST` | `v1/households/{householdId}/players/{playerId}/audioClip` | `loadAudioClip` | `-` | `0x20000102` | `0x10ad0378` `0x10ad0388` | `clipBehavior`, `clipBehavior`, `volume`, `name`, `clipMetadata`, `clipMetadata` |
| `DELETE` | `v1/players/{playerId}/audioClip/{id}` | `cancelAudioClip` | `id` | `0x20000108` | `0x10ad0388` `0x10ad0398` desc:`10ad4b7c` `10ad4b8c` `10ad4b9c` `10ad4bac` `10ad4bbc` | `clipBehavior`, `clipBehavior`, `volume`, `name`, `clipMetadata`, `clipMetadata`, `id` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/audioClip/{id}` | `cancelAudioClip` | `id` | `0x20000108` | `0x10ad0388` `0x10ad0398` desc:`10ad4b7c` `10ad4b8c` `10ad4b9c` `10ad4bac` `10ad4bbc` | `clipBehavior`, `clipBehavior`, `volume`, `name`, `clipMetadata`, `clipMetadata`, `id` |

Op-level JSON keys recovered from op-object methods: `muse`, `clipBehavior`, `volume`, `volumeRampDownSeconds`, `name`, `appId`, `priority`, `clipType`, `streamUrl`, `httpAuthorization`, `clipLEDBehavior`, `clipMetadata`, `id`

## `authorization`

The auth surface for the muse API itself. Ops: `authenticateClient`, `authorizeDevice`, `createInvite`/`redeemInvite`/`deleteInvite`, `getPolicyKey`, `getPermissions`, `resolveToken`, `translate`/`batchTranslate` (id translation), `getUsers`, `subscribeUser`/`unsubscribeUser`. A third-party or app client first authenticates, redeems a household invite to gain membership, receives a policy key and a role, then attaches credentials to subsequent requests. `subscribeUser` grants the per-user access the invite flow gates. This is the resource every other resource implicitly depends on.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/households/{householdId}/authorization/tokens` | `resolveToken` | `-` | `0x20000102` | `0x10ad4b7c` | `token`, `attributes`, `attributes` |
| `GET` | `v1/households/{householdId}/authorization/policy/{policyKey}` | `getPolicyKey` | `policyKey` | `0x20000101` | `0x10ad4b7c` `0x10ad4b8c` desc:`10ad88f8` `10ad8908` `10ad8918` | `token`, `attributes`, `attributes`, `policyKey` |
| `GET` | `v1/households/{householdId}/authorization/permissions/{role}` | `getPermissions` | `role` | `0x20000101` | `0x10ad4b8c` `0x10ad4b9c` desc:`10ad8928` `10ad8938` `10ad8948` | `policyKey`, `role` |
| `POST` | `v1/\[error:  'none' is not a valid target\]/authorization/invite` | `createInvite` | `-` | `0x20000102` | outbound-fwd | — |
| `POST` | `v1/households/{householdId}/authorization/invite` | `createInvite` | `-` | `0x20000102` | outbound-fwd | — |
| `POST` | `v1/\[error:  'none' is not a valid target\]/authorization/redeem` | `redeemInvite` | `-` | `0x20000102` | outbound-fwd | — |
| `POST` | `v1/households/{householdId}/authorization/redeem` | `redeemInvite` | `-` | `0x20000102` | outbound-fwd | — |
| `GET` | `v1/\[error:  'none' is not a valid target\]/authorization/users` | `getUsers` | `-` | `0x20000101` | outbound-fwd | — |
| `GET` | `v1/households/{householdId}/authorization/users` | `getUsers` | `-` | `0x20000101` | outbound-fwd | — |
| `DELETE` | `v1/\[error:  'none' is not a valid target\]/authorization/users` | `deleteInvite` | `-` | `0x20000108` | outbound-fwd | — |
| `DELETE` | `v1/households/{householdId}/authorization/users` | `deleteInvite` | `-` | `0x20000108` | outbound-fwd | — |
| `POST` | `v1/players/{playerId}/authorization/authorizeDevice` | `authorizeDevice` | `-` | `0x20000102` | `0x10ad4b9c` `0x10ad4bac` | `role`, `grantType` |
| `POST` | `v1/households/{householdId}/players/{playerId}/authorization/authorizeDevice` | `authorizeDevice` | `-` | `0x20000102` | `0x10ad4b9c` `0x10ad4bac` | `role`, `grantType` |
| `POST` | `v1/players/{playerId}/authorization/authenticateClient` | `authenticateClient` | `-` | `0x20000102` | `0x10ad4bac` `0x10ad4bbc` | `grantType` |
| `POST` | `v1/households/{householdId}/players/{playerId}/authorization/authenticateClient` | `authenticateClient` | `-` | `0x20000102` | `0x10ad4bac` `0x10ad4bbc` | `grantType` |

Related enum registrations (proven integer values — see `enum_tables`):

- **auth_roles**: `OWNER`=1, `GUEST`=2, `CRM`=3, `ADMIN`=4, `EMPLOYEE`=5, `PLAYER_TO_PLAYER`=6, `BLE_DTLS`=7
- **authz_namespaces**: `AUTHZTOKENS`=1, `AUTHZPOLICIES`=2, `DEVICES`=3, `ENTITLEMENTS`=4, `FCS`=5, `SETTINGS`=6, `HISTORY`=7
- **shared_queue_policies**: `PAUSE_CONTENT`=1, `PLAY_TO_BONDED`=2, `STOP_CONTENT`=3, `USE_SHARED_QUEUE`=4
- **token_types**: `GUEST_TOKEN`=1, `ACCESS_TOKEN`=2, `API_KEY`=3, `GUEST_TOKEN_PIN`=4

Op-level JSON keys recovered from op-object methods: `token`, `objectId`, `objectType`, `attributes`, `muse`, `policyKey`, `role`, `route`, `protocolVersion`, `grantType`, `assertion`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `objectIds`, `query:accountId`, `query:destinationServiceId`, `query:inviteId`, `query:mainAccountId`, `query:protocolVersion`, `query:route`

## `catalog`

Catalog lookups for music services. `serviceId`-scoped GETs resolve service catalog entries — this is how the app turns a content URI or service token into playable metadata without going through SMAPI directly.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/services/{serviceId}/catalog/id/{objectId}` | `translate` | `objectId` | `0x20000101` | outbound-fwd | — |
| `GET` | `v1/households/{householdId}/services/{serviceId}/catalog/id/{objectId}` | `translate` | `objectId` | `0x20000101` | outbound-fwd | — |
| `GET` | `v1/services/{serviceId}/catalog/ids` | `batchTranslate` | `-` | `0x20000101` | outbound-fwd | — |
| `GET` | `v1/households/{householdId}/services/{serviceId}/catalog/ids` | `batchTranslate` | `-` | `0x20000101` | outbound-fwd | — |

Resource implementation functions (string-block registrar family): `0x10ad6210`

Field vocabulary recovered from the resource's implementation functions: `catalog`

## `devices`

Device CRUD and discovery for the household. Lists players in a household, registers/unregisters devices, and manages per-device attributes. `userId`-scoped ops handle user-specific device registrations.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/devices` | `getDevices` | `-` | `0x20000101` | resource-block | — |
| `DELETE` | `v1/households/{householdId}/devices/{playerId}` | `removeDevice` | `playerId` | `0x20000108` | resource-block | — |
| `GET` | `v1/households/{householdId}/devices/registrations` | `getDeviceRegistrations` | `-` | `0x20000101` | resource-block | — |
| `GET` | `v1/users/{userId}/devices/registrations` | `getUserDeviceRegistrations` | `-` | `0x20000101` | resource-block | — |
| `GET` | `v1/households/{householdId}/users/{userId}/devices/registrations` | `getUserDeviceRegistrations` | `-` | `0x20000101` | resource-block | — |
| `POST` | `v1/households/{householdId}/devices/registrations` | `initDeviceRegistration` | `-` | `0x20000102` | resource-block | — |
| `POST` | `v1/households/{householdId}/devices/registrations/{deviceId}` | `completeDeviceRegistration` | `deviceId` | `0x20000102` | resource-block | — |
| `PUT` | `v1/households/{householdId}/devices/registrations/{deviceId}` | `refreshDeviceRegistration` | `deviceId` | `0x20000104` | resource-block | — |
| `DELETE` | `v1/households/{householdId}/devices/registrations/{deviceId}` | `deregisterDevice` | `deviceId` | `0x20000108` | resource-block | — |
| `GET` | `v1/players/{playerId}/devices/registration` | `getRegistrationStatus` | `-` | `0x20000101` | `0x10ad8908` `0x10ad8918` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/devices/registration` | `getRegistrationStatus` | `-` | `0x20000101` | `0x10ad8908` `0x10ad8918` | — |
| `PUT` | `v1/players/{playerId}/devices/registration` | `setRegistrationState` | `-` | `0x20000104` | `0x10ad8918` `0x10ad8928` | `assertion` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/devices/registration` | `setRegistrationState` | `-` | `0x20000104` | `0x10ad8918` `0x10ad8928` | `assertion` |
| `PUT` | `v1/players/{playerId}/devices/transfer` | `transferDeviceRegistration` | `-` | `0x20000104` | `0x10ad8928` `0x10ad8938` | `assertion` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/devices/transfer` | `transferDeviceRegistration` | `-` | `0x20000104` | `0x10ad8928` `0x10ad8938` | `assertion` |
| `GET` | `v1/households/{householdId}/devices/local` | `getLocalDevices` | `-` | `0x20000101` | `0x10ad8938` `0x10ad8948` | — |

Resource implementation functions (string-block registrar family): `0x10a65658`, `0x10a6578c`, `0x10a66160`, `0x10a66b3c`, `0x10a774c4`, `0x10a775a8`, `0x10a77630`, `0x10a784b4`, `0x10a78bb8`, `0x10ad7570`, `0x10ad8968`, `0x10bb2cdc`, `0x10bb2fc8`, `0x10bb3974`, `0x10bb41e8`

Field vocabulary recovered from the resource's implementation functions: `devices`, `serial`, `modelDisplayName`, `fromVersion`, `toVersion`, `clientState`, `deviceState`, `result`, `downloadDuration`, `errorMsg`, `_objectType`, `timestamp`, `systemVersion`, `numUpdatedDevices`, `numDevices`, `duration`, `systemResult`, `null`, `capabilities`, `deviceIds`, `zoneInfo`, `virtualLineInSource`, `id`, `primaryDeviceId`, `serialNumber`, `deviceId`, `model`, `color`, `apiVersion`, `minApiVersion`, `name`, `websocketUrl`, `softwareVersion`, `hwVersion`, `swGen`, `versions`, `quarantineReasons`, `vanishReason`, `zoneId`, `members`, `isUnregistered`, `type`, `controlAPI`, `trueplaySDK`, `audioTxProtocol`, `htAudioTxProtocol`, `channelMap`, `state`, `false`, `true`, `vanishedDevices`, `quarantinedDevices`, `deviceFeatures`, `origin`, `numMeasurements`, `numRetries`, `useCached`, `metrics`, `orchestrator`, `debugData`

Implementation messages:

- `\u%04X`
- `%d`

Related enum registrations (proven integer values — see `enum_tables`):

- **net_state**: `SONOSNET`=1, `STATION`=2, `DISCONNECTED`=3, `STATION_SATELLITE`=4
- **netmode**: `NETMODE_SONOSNET_WIRED`=1, `NETMODE_SONOSNET_WIRELESS`=2, `NETMODE_WIRED`=3, `NETMODE_WIRED_NO_WIFI`=4, `NETMODE_STATION`=5, `NETMODE_SATELLITE_V1`=6, `NETMODE_SATELLITE_V1_WIRED`=7, `NETMODE_SATELLITE_V2`=8
- **playback_button**: `PLAY`=1, `PAUSE`=2, `NEXT_TRACK`=3, `PREV_TRACK`=4
- **power_command**: `UNKNOWN`=1, `ON`=2, `STANDBY`=3, `TO_ON`=4, `TO_STANDBY`=5
- **quarantine_reason**: `UNKNOWN`=1, `SW_GEN`=2, `SECURE_REG`=3, `UPNP_OVER_TLS`=4
- **registration_class**: `UNKNOWN`=1, `UNREGISTERED`=2, `LEGACY_REGISTERED`=3, `SECURE_REGISTERED`=4, `TRANSFER`=5, `OFFLINE`=6, `PREP_TRANSFER`=7
- **speaker_orientation**: `UNDEFINED`=1, `HORIZONTAL`=2, `VERTICAL_WALL_ABOVE`=3, `VERTICAL_WALL_BELOW`=4, `VERTICAL_TAG_LEFT`=5, `VERTICAL_TAG_RIGHT`=6, `HORIZONTAL_WALL_MOUNTED`=7, `HORIZONTAL_LEFT`=8, `HORIZONTAL_RIGHT`=9, `VERTICAL_WALL_MOUNTED`=10, `VERTICAL_WALL_LEFT`=11, `VERTICAL_WALL_RIGHT`=12, `FACEDOWN`=13, `INVERTED`=14, `INVALID`=15
- **vanish_reason**: `BLUETOOTH`=1, `ERROR`=2, `EXPIRED`=3, `LOW_BATTERY`=4, `NEW_IP`=5, `NEW_SSID`=6, `POWERED_OFF`=7, `SLEEPING`=8, `UNKNOWN`=9, `UPGRADE`=10

Op-level JSON keys recovered from op-object methods: `muse`, `assertion`

## `devicesExtended`

A wider read-only device listing — the same household device set decorated with extended attributes (capabilities, versions) that the plain `devices` list omits.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/devicesExtended` | `getExtendedDeviceStatus` | `-` | `0x20000101` | `0x101c0740` `0x101c0750` | — |

Resource implementation functions (string-block registrar family): `0x101c0770`

Field vocabulary recovered from the resource's implementation functions: `devicesExtended`

Op-level JSON keys recovered from op-object methods: `muse`

## `diagnostics`

Per-player diagnostic capture. POST triggers a diagnostic submission; GETs read submitted results. This is the surface behind 'Submit Diagnostics' in the app.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/diagnostics` | `submitDiagnostics` | `-` | `0x20000102` | `0x10addc24` `0x10addc34` desc:`10ae1794` `10ae17a4` `10ae17b4` `10ae17c4` `10ae17d4` `10ae17e4` | `includeControllers`, `type` |
| `POST` | `v1/households/{householdId}/players/{playerId}/diagnostics` | `submitDiagnostics` | `-` | `0x20000102` | `0x10addc24` `0x10addc34` desc:`10ae1794` `10ae17a4` `10ae17b4` `10ae17c4` `10ae17d4` `10ae17e4` | `includeControllers`, `type` |
| `GET` | `v1/players/{playerId}/diagnostics/metadata` | `getMetadata` | `-` | `0x20000101` | `0x10addc34` `0x10addc44` | `includeControllers`, `type` |
| `GET` | `v1/households/{householdId}/players/{playerId}/diagnostics/metadata` | `getMetadata` | `-` | `0x20000101` | `0x10addc34` `0x10addc44` | `includeControllers`, `type` |
| `POST` | `v1/players/{playerId}/diagnostics/report` | `reportStatus` | `-` | `0x20000102` | `0x10addc44` `0x10addc54` | `controller`, `diagGuid` |
| `POST` | `v1/households/{householdId}/players/{playerId}/diagnostics/report` | `reportStatus` | `-` | `0x20000102` | `0x10addc44` `0x10addc54` | `controller`, `diagGuid` |

Op-level JSON keys recovered from op-object methods: `muse`, `includeControllers`, `type`, `initiatingDeviceId`, `controller`, `diagGuid`, `reporterId`, `status`

## `effectiveSettings`

Read-mostly computed settings: the resolved value of each setting after merging player, household and user layers. PATCH ops override at the player scope. Useful when a client wants 'what does this player actually run' rather than the raw stored values.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/effectiveSettings` | `getAllSettings` | `-` | `0x20000101` | `0x10ae17a4` `0x10ae17b4` `0x10b2b994` `0x10b2b9a4` | `channel` |
| `GET` | `v1/households/{householdId}/players/{playerId}/effectiveSettings` | `getAllSettings` | `-` | `0x20000101` | `0x10ae17a4` `0x10ae17b4` `0x10b2b994` `0x10b2b9a4` | `channel` |
| `GET` | `v1/players/{playerId}/effectiveSettings/{groupName}` | `getSettingsGroup` | `groupName` | `0x20000101` | `0x10ae17b4` `0x10ae17c4` `0x10b2b9a4` `0x10b2b9b4` desc:`10ae4b54` `10ae4b64` | `groupName` |
| `GET` | `v1/households/{householdId}/players/{playerId}/effectiveSettings/{groupName}` | `getSettingsGroup` | `groupName` | `0x20000101` | `0x10ae17b4` `0x10ae17c4` `0x10b2b9a4` `0x10b2b9b4` desc:`10ae4b54` `10ae4b64` | `groupName` |
| `PATCH` | `v1/players/{playerId}/effectiveSettings` | `updateAllSettings` | `-` | `0x20000110` | `0x10ae17c4` `0x10ae17d4` `0x10b2b9b4` `0x10b2b9c4` desc:`10ae4b74` `10ae4b84` | `groupName`, `updateAllSettings`, `updateAllSettings` |
| `PATCH` | `v1/households/{householdId}/players/{playerId}/effectiveSettings` | `updateAllSettings` | `-` | `0x20000110` | `0x10ae17c4` `0x10ae17d4` `0x10b2b9b4` `0x10b2b9c4` desc:`10ae4b74` `10ae4b84` | `groupName`, `updateAllSettings`, `updateAllSettings` |
| `PATCH` | `v1/players/{playerId}/effectiveSettings/{groupName}` | `updateSettingsGroup` | `groupName` | `0x20000110` | `0x10ae17d4` `0x10ae17e4` `0x10b2b9c4` `0x10b2b9d4` desc:`10ae4b94` `10ae4ba4` | `updateAllSettings`, `updateAllSettings`, `groupName` |
| `PATCH` | `v1/households/{householdId}/players/{playerId}/effectiveSettings/{groupName}` | `updateSettingsGroup` | `groupName` | `0x20000110` | `0x10ae17d4` `0x10ae17e4` `0x10b2b9c4` `0x10b2b9d4` desc:`10ae4b94` `10ae4ba4` | `updateAllSettings`, `updateAllSettings`, `groupName` |

Op-level JSON keys recovered from op-object methods: `muse`, `channel`, `delayMillis`, `groupName`, `updateAllSettings`

## `entitlements`

Music-service entitlements for a household or user — which paid/trial service tiers are active. Read-only GET surface; the `subscribeUser`/`unsubscribeUser` verbs in `authorization` drive what appears here.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/users/{userId}/entitlements` | `getUserEntitlements` | `-` | `0x20000101` | `0x10ae4b84` `0x10ae4b94` | — |
| `GET` | `v1/households/{householdId}/users/{userId}/entitlements` | `getUserEntitlements` | `-` | `0x20000101` | `0x10ae4b84` `0x10ae4b94` | — |
| `GET` | `v1/households/{householdId}/entitlements` | `getEntitlements` | `-` | `0x20000101` | `0x10ae4b94` `0x10ae4ba4` desc:`10ae9208` `10ae9218` `10ae9228` `10ae9238` `10ae9248` `10ae9258` `10aec758` `10aec768` `10aec778` `10aec788` `10aec798` | — |

Op-level JSON keys recovered from op-object methods: `muse`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `areaIds`, `musicContextGroupId`, `playerIds`, `playerIdsToAdd`, `playerIdsToRemove`

## `favorites`

Sonos favorites via the modern API. Scoped to group or household; GET lists the favorites the group can reach, POST adds. This is the same store that UPnP `FV:` ContentDirectory items write to — both views stay in sync.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/favorites` | `getFavorites` | `-` | `0x20000101` | `0x101cc9d0` `0x101cc9e0` | — |
| `POST` | `v1/groups/{groupId}/favorites` | `loadFavorite` | `-` | `0x20000102` | `0x101cc9e0` `0x101cc9f0` | `playOnCompletion`, `favoriteId`, `playModes`, `playModes`, `action` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/favorites` | `loadFavorite` | `-` | `0x20000102` | `0x101cc9e0` `0x101cc9f0` | `playOnCompletion`, `favoriteId`, `playModes`, `playModes`, `action` |

Related enum registrations (proven integer values — see `enum_tables`):

- **content_object_type**: `ALBUM`=1, `ARTIST`=2, `AUDIOBOOK`=3, `CHAPTER`=4, `SMAPI_CONTAINER`=5, `EPISODE`=6, `PLAYLIST`=7, `PODCAST`=8, `PROGRAM`=9, `STREAM`=10, `TRACK`=11
- **rating_values**: `STAR`=1, `THUMBSUP`=2, `THUMBSDOWN`=3, `LOVE`=4, `HATE`=5, `BAN`=6, `NONE`=7, `SHELVED`=8

Op-level JSON keys recovered from op-object methods: `muse`, `playOnCompletion`, `favoriteId`, `action`, `playModes`

## `groupVolume`

Volume for a whole playback group. GET reads the group's aggregate volume state (volume, mute, fixed flag); POSTs set volume or apply relative deltas across all members. Use this for group-level sliders — writing to every `playerVolume` instead produces drift and step ordering artifacts.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/groups/{groupId}/groupVolume` | `setVolume` | `-` | `0x20000002` | `0x1020599c` `0x102059ac` `0x10ae9218` `0x10ae9228` | `muted`, `volume`, `volume` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groupVolume` | `setVolume` | `-` | `0x20000002` | `0x1020599c` `0x102059ac` `0x10ae9218` `0x10ae9228` | `muted`, `volume`, `volume` |
| `POST` | `v1/groups/{groupId}/groupVolume/relative` | `setRelativeVolume` | `-` | `0x20000002` | `0x102059ac` `0x102059bc` `0x10ae9228` `0x10ae9238` | `muted`, `volume`, `volume`, `volumeDelta`, `volumeDelta` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groupVolume/relative` | `setRelativeVolume` | `-` | `0x20000002` | `0x102059ac` `0x102059bc` `0x10ae9228` `0x10ae9238` | `muted`, `volume`, `volume`, `volumeDelta`, `volumeDelta` |
| `POST` | `v1/groups/{groupId}/groupVolume/mute` | `setMute` | `-` | `0x20000002` | `0x102059bc` `0x102059cc` `0x10ae9238` `0x10ae9248` | `muted`, `volumeDelta`, `volumeDelta` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groupVolume/mute` | `setMute` | `-` | `0x20000002` | `0x102059bc` `0x102059cc` `0x10ae9238` `0x10ae9248` | `muted`, `volumeDelta`, `volumeDelta` |
| `GET` | `v1/groups/{groupId}/groupVolume` | `getVolume` | `-` | `0x20000001` | `0x102059cc` `0x102059dc` `0x10ae9248` `0x10ae9258` | `muted` |
| `GET` | `v1/households/{householdId}/groups/{groupId}/groupVolume` | `getVolume` | `-` | `0x20000001` | `0x102059cc` `0x102059dc` `0x10ae9248` `0x10ae9258` | `muted` |

Op-level JSON keys recovered from op-object methods: `muse`, `muted`, `volume`, `ibt`, `volumeDelta`

Validation / log strings recovered from op-object methods:

- `playerVolume::setVolume: cannot set volume AND mute parameter`
- `basic_string::append`
- `playerVolume::setRelativeVolume: cannot set volumeDelta AND muted parameter`
- `v1/players/%s/playerVolume/mute`
- `v1/groups/%s/groupVolume/mute`

Route fragments these ops build or forward to: `v1/players/`, `/playerVolume`, `/mute`, `v1/groups/`, `/groupVolume`, `/relative`, `v1/players/%s/playerVolume/mute`, `v1/groups/%s/groupVolume/mute`

## `groups`

Playback group lifecycle. `createGroup` forms a group, `setGroupMembers`/`modifyGroupMembers` change membership, `getExtended`/`history`/`subscription` read state and events. Group ops are where zone-group topology actually changes — UPnP `ZoneGroupState` events reflect the result.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/groups` | `getGroups` | `-` | `0x20000101` | `0x101c755c` `0x101c756c` | `includeDeviceInfo` |
| `GET` | `v1/households/{householdId}/groups/extended` | `getGroupsEx` | `-` | `0x20000101` | `0x101c756c` `0x101c757c` | `includeDeviceInfo` |
| `POST` | `v1/households/{householdId}/groups/createGroup` | `createGroup` | `-` | `0x20000102` | `0x101c757c` `0x101c758c` | `playerIds`, `playerIds`, `playerIds` |
| `POST` | `v1/groups/{groupId}/groups/modifyGroupMembers` | `modifyGroupMembers` | `-` | `0x20000102` | `0x101c758c` `0x101c759c` | `playerIds`, `playerIds`, `playerIds`, `playerIdsToAdd`, `playerIdsToAdd`, `playerIdsToAdd` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groups/modifyGroupMembers` | `modifyGroupMembers` | `-` | `0x20000102` | `0x101c758c` `0x101c759c` | `playerIds`, `playerIds`, `playerIds`, `playerIdsToAdd`, `playerIdsToAdd`, `playerIdsToAdd` |
| `POST` | `v1/groups/{groupId}/groups/setGroupMembers` | `setGroupMembers` | `-` | `0x20000102` | `0x101c759c` `0x101c75ac` | `playerIdsToAdd`, `playerIdsToAdd`, `playerIdsToAdd`, `playerIds`, `playerIds`, `playerIds` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groups/setGroupMembers` | `setGroupMembers` | `-` | `0x20000102` | `0x101c759c` `0x101c75ac` | `playerIdsToAdd`, `playerIdsToAdd`, `playerIdsToAdd`, `playerIds`, `playerIds`, `playerIds` |

Op-level JSON keys recovered from op-object methods: `muse`, `includeDeviceInfo`, `playerIds`, `areaIds`, `musicContextGroupId`, `playerIdsToAdd`, `playerIdsToRemove`

## `hardwareStatus`

Large read/write surface exposing per-player hardware condition — the binary carries verbs for battery cells, water ingress, PoE state, ship mode and other hardware probes, most of which exist for products this Playbar-era build doesn't ship. On this device the useful subset is player-scoped status reads; the exotic verbs register but their backing hardware is absent.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/hardwareStatus/bluetooth` | `getBluetoothStatus` | `-` | `0x20000101` | `0x101d4cb4` `0x101d4cc4` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/bluetooth` | `getBluetoothStatus` | `-` | `0x20000101` | `0x101d4cb4` `0x101d4cc4` | — |
| `GET` | `v1/players/{playerId}/hardwareStatus/battery` | `getBatteryStatus` | `-` | `0x20000101` | `0x101d4cc4` `0x101d4cd4` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/battery` | `getBatteryStatus` | `-` | `0x20000101` | `0x101d4cc4` `0x101d4cd4` | — |
| `POST` | `v1/players/{playerId}/hardwareStatus/battery` | `changeBatteryStatus` | `-` | `0x20000102` | `0x101d4cd4` `0x101d4ce4` | `changeBatteryStatus`, `changeBatteryStatus` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/battery` | `changeBatteryStatus` | `-` | `0x20000102` | `0x101d4cd4` `0x101d4ce4` | `changeBatteryStatus`, `changeBatteryStatus` |
| `GET` | `v1/players/{playerId}/hardwareStatus/batteryCells` | `getBatteryCells` | `-` | `0x20000101` | `0x101d4ce4` `0x101d4cf4` | `changeBatteryStatus`, `changeBatteryStatus` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/batteryCells` | `getBatteryCells` | `-` | `0x20000101` | `0x101d4ce4` `0x101d4cf4` | `changeBatteryStatus`, `changeBatteryStatus` |
| `POST` | `v1/players/{playerId}/hardwareStatus/shipMode` | `transitionToShipMode` | `-` | `0x20000102` | `0x101d4cf4` `0x101d4d04` | `requiredMinimumBatteryPercentage` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/shipMode` | `transitionToShipMode` | `-` | `0x20000102` | `0x101d4cf4` `0x101d4d04` | `requiredMinimumBatteryPercentage` |
| `POST` | `v1/players/{playerId}/hardwareStatus/shutdown` | `initiateOrderlyShutdown` | `-` | `0x20000102` | `0x101d4d04` `0x101d4d14` | `requiredMinimumBatteryPercentage` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/shutdown` | `initiateOrderlyShutdown` | `-` | `0x20000102` | `0x101d4d04` `0x101d4d14` | `requiredMinimumBatteryPercentage` |
| `GET` | `v1/players/{playerId}/hardwareStatus/ethernet` | `getEthernetStatus` | `-` | `0x20000101` | `0x101d4d14` `0x101d4d24` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/ethernet` | `getEthernetStatus` | `-` | `0x20000101` | `0x101d4d14` `0x101d4d24` | — |
| `GET` | `v1/players/{playerId}/hardwareStatus/wiredSub` | `getWiredSubStatus` | `-` | `0x20000101` | `0x101d4d24` `0x101d4d34` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/wiredSub` | `getWiredSubStatus` | `-` | `0x20000101` | `0x101d4d24` `0x101d4d34` | — |
| `GET` | `v1/players/{playerId}/hardwareStatus/wirelessNetworkStatus` | `getWirelessNetworkStatus` | `-` | `0x20000101` | `0x101d4d34` `0x101d4d44` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/wirelessNetworkStatus` | `getWirelessNetworkStatus` | `-` | `0x20000101` | `0x101d4d34` `0x101d4d44` | — |
| `POST` | `v1/players/{playerId}/hardwareStatus/bluetoothPairing` | `setBluetoothPairing` | `-` | `0x20000102` | `0x101d4d44` `0x101d4d54` | `enable` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/bluetoothPairing` | `setBluetoothPairing` | `-` | `0x20000102` | `0x101d4d44` `0x101d4d54` | `enable` |
| `POST` | `v1/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `activatePairedBluetoothDevice` | `bluetoothAddress` | `0x20000102` | `0x101d4d54` `0x101d4d64` | `enable`, `bluetoothAddress` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `activatePairedBluetoothDevice` | `bluetoothAddress` | `0x20000102` | `0x101d4d54` `0x101d4d64` | `enable`, `bluetoothAddress` |
| `DELETE` | `v1/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `removePairedBluetoothDevice` | `bluetoothAddress` | `0x20000108` | `0x101d4d64` `0x101d4d74` | `bluetoothAddress` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `removePairedBluetoothDevice` | `bluetoothAddress` | `0x20000108` | `0x101d4d64` `0x101d4d74` | `bluetoothAddress` |
| `GET` | `v1/players/{playerId}/hardwareStatus/microphoneSwitch` | `getMicrophoneSwitchState` | `-` | `0x20000101` | `0x101d4d74` `0x101d4d84` | `bluetoothAddress` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/microphoneSwitch` | `getMicrophoneSwitchState` | `-` | `0x20000101` | `0x101d4d74` `0x101d4d84` | `bluetoothAddress` |
| `GET` | `v1/players/{playerId}/hardwareStatus/water` | `getWaterStatus` | `-` | `0x20000101` | `0x101d4d84` `0x101d4d94` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/water` | `getWaterStatus` | `-` | `0x20000101` | `0x101d4d84` `0x101d4d94` | — |
| `GET` | `v1/players/{playerId}/hardwareStatus/poe` | `getPoeStatus` | `-` | `0x20000101` | `0x101d4d94` `0x101d4da4` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/poe` | `getPoeStatus` | `-` | `0x20000101` | `0x101d4d94` `0x101d4da4` | — |
| `GET` | `v1/players/{playerId}/hardwareStatus/lineIn` | `getLineInStatus` | `-` | `0x20000101` | `0x101d4da4` `0x101d4db4` | `instanceId` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/lineIn` | `getLineInStatus` | `-` | `0x20000101` | `0x101d4da4` `0x101d4db4` | `instanceId` |
| `GET` | `v1/players/{playerId}/hardwareStatus/lineInStatuses` | `getLineInStatuses` | `-` | `0x20000101` | `0x101d4db4` `0x101d4dc4` | `instanceId` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/lineInStatuses` | `getLineInStatuses` | `-` | `0x20000101` | `0x101d4db4` `0x101d4dc4` | `instanceId` |

Op-level JSON keys recovered from op-object methods: `muse`, `changeBatteryStatus`, `requiredMinimumBatteryPercentage`, `requiredMaximumBatteryPercentage`, `enable`, `bluetoothAddress`, `instanceId`

Validation / log strings recovered from op-object methods:

- `v1/players/%s/hardwareStatus/battery`

Route fragments these ops build or forward to: `v1/players/%s/hardwareStatus/battery`

## `hdmi`

HDMI/CEC status and control for home-theater players — EDID info and power-cycle ops. Mostly GET on this build.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/hdmi/status` | `status` | `-` | `0x20000101` | `0x10aec768` `0x10aec778` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/hdmi/status` | `status` | `-` | `0x20000101` | `0x10aec768` `0x10aec778` | — |
| `GET` | `v1/players/{playerId}/hdmi/edid` | `edid` | `-` | `0x20000101` | `0x10aec778` `0x10aec788` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/hdmi/edid` | `edid` | `-` | `0x20000101` | `0x10aec778` `0x10aec788` | — |
| `GET` | `v1/players/{playerId}/hdmi/powercycle` | `powercycle` | `-` | `0x20000101` | `0x10aec788` `0x10aec798` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/hdmi/powercycle` | `powercycle` | `-` | `0x20000101` | `0x10aec788` `0x10aec798` | — |

Op-level JSON keys recovered from op-object methods: `muse`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `accountHash`, `accountType`, `keyName`, `keyValue`, `model`, `osVersion`, `softwareVersion`

## `history`

Household playback history. Stores the tracks/stations the household played, with fields for track metadata, position, play-mode and queue context. DELETE clears entries; the `subscribeUser` model gates visibility per user.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/history` | `getHistory` | `-` | `0x20000101` | `0x10aefcc4` `0x10aefcd4` | — |
| `POST` | `v1/households/{householdId}/history` | `postHistory` | `-` | `0x20000102` | `0x10aefcd4` `0x10aefce4` | `postHistory`, `postHistory`, `postHistory`, `postHistory` |
| `DELETE` | `v1/households/{householdId}/history/{id}` | `removeHistoryItem` | `id` | `0x20000108` | `0x10aefce4` `0x10aefcf4` desc:`10af3468` | `postHistory`, `postHistory`, `postHistory`, `postHistory`, `id` |
| `DELETE` | `v1/households/{householdId}/history` | `clearHistory` | `-` | `0x20000108` | `0x10aefcf4` `0x10aefd04` | `id` |

Related enum registrations (proven integer values — see `enum_tables`):

- **content_object_type**: `ALBUM`=1, `ARTIST`=2, `AUDIOBOOK`=3, `CHAPTER`=4, `SMAPI_CONTAINER`=5, `EPISODE`=6, `PLAYLIST`=7, `PODCAST`=8, `PROGRAM`=9, `STREAM`=10, `TRACK`=11

Op-level JSON keys recovered from op-object methods: `muse`, `postHistory`, `id`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `action`, `advertisingInfo`, `allowTvPauseRestore`, `containerId`, `containerMetadata`, `defaults`, `deltaMillis`, `deviceFeedback`, `deviceId`, `id`, `instanceId`, `itemId`, `metadata`, `playModes`, `playOnCompletion`, `playbackAction`, `playbackLocation`, `positionMillis`, `queueAction`, `stationId`, `trackNumber`, `tracks`, `type`

## `homeTheater`

Home-theater configuration — a large resource covering the HT player, its bonded surrounds/sub, night/enhancement modes, channel-map sets and HDMI links. Player-scoped. Grouped with `pinewood`/`soundSwap`, it drives the Playbar-family feature set.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/homeTheater` | `loadHomeTheaterPlayback` | `-` | `0x20000102` | `0x101de924` `0x101de934` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/homeTheater` | `loadHomeTheaterPlayback` | `-` | `0x20000102` | `0x101de924` `0x101de934` | — |
| `POST` | `v1/players/{playerId}/homeTheater/tvPowerState` | `setTvPowerState` | `-` | `0x20000102` | `0x101de934` `0x101de944` | `tvPowerState` |
| `POST` | `v1/households/{householdId}/players/{playerId}/homeTheater/tvPowerState` | `setTvPowerState` | `-` | `0x20000102` | `0x101de934` `0x101de944` | `tvPowerState` |
| `GET` | `v1/players/{playerId}/homeTheater/options` | `getOptions` | `-` | `0x20000101` | `0x101de944` `0x101de954` | `tvPowerState` |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/options` | `getOptions` | `-` | `0x20000101` | `0x101de944` `0x101de954` | `tvPowerState` |
| `POST` | `v1/players/{playerId}/homeTheater/options` | `setOptions` | `-` | `0x20000102` | `0x101de954` `0x101de964` | `nightMode` |
| `POST` | `v1/households/{householdId}/players/{playerId}/homeTheater/options` | `setOptions` | `-` | `0x20000102` | `0x101de954` `0x101de964` | `nightMode` |
| `POST` | `v1/players/{playerId}/homeTheater/addAccessoryWifi` | `addAccessoryWifi` | `-` | `0x20000102` | `0x101de964` `0x101de974` | `nightMode`, `wifiMacAddress`, `details`, `details` |
| `POST` | `v1/households/{householdId}/players/{playerId}/homeTheater/addAccessoryWifi` | `addAccessoryWifi` | `-` | `0x20000102` | `0x101de964` `0x101de974` | `nightMode`, `wifiMacAddress`, `details`, `details` |
| `DELETE` | `v1/players/{playerId}/homeTheater/removeAccessory` | `removeAccessory` | `-` | `0x20000108` | `0x101de974` `0x101de984` | `wifiMacAddress`, `details`, `details`, `macAddress` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/homeTheater/removeAccessory` | `removeAccessory` | `-` | `0x20000108` | `0x101de974` `0x101de984` | `wifiMacAddress`, `details`, `details`, `macAddress` |
| `GET` | `v1/players/{playerId}/homeTheater/accessoryList` | `getAccessoryList` | `-` | `0x20000101` | `0x101de984` `0x101de994` | `macAddress` |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/accessoryList` | `getAccessoryList` | `-` | `0x20000101` | `0x101de984` `0x101de994` | `macAddress` |
| `GET` | `v1/players/{playerId}/homeTheater/accessorySwapStatus` | `getAccessorySwapStatus` | `-` | `0x20000101` | `0x101de994` `0x101de9a4` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/accessorySwapStatus` | `getAccessorySwapStatus` | `-` | `0x20000101` | `0x101de994` `0x101de9a4` | — |
| `POST` | `v1/players/{playerId}/homeTheater/disconnectAccessory` | `disconnectAccessory` | `-` | `0x20000102` | `0x101de9a4` `0x101de9b4` | `macAddress` |
| `POST` | `v1/households/{householdId}/players/{playerId}/homeTheater/disconnectAccessory` | `disconnectAccessory` | `-` | `0x20000102` | `0x101de9a4` `0x101de9b4` | `macAddress` |
| `GET` | `v1/players/{playerId}/homeTheater/connectedAccessoryList` | `getConnectedAccessoryList` | `-` | `0x20000101` | `0x101de9b4` `0x101de9c4` | `macAddress` |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/connectedAccessoryList` | `getConnectedAccessoryList` | `-` | `0x20000101` | `0x101de9b4` `0x101de9c4` | `macAddress` |
| `GET` | `v1/players/{playerId}/homeTheater/swapModelInfo` | `getSwapModelInfo` | `-` | `0x20000101` | `0x101de9c4` `0x101de9d4` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/swapModelInfo` | `getSwapModelInfo` | `-` | `0x20000101` | `0x101de9c4` `0x101de9d4` | — |
| `GET` | `v1/players/{playerId}/homeTheater/tvAudioSignalStatus` | `getTVAudioSignalStatus` | `-` | `0x20000101` | `0x101de9d4` `0x101de9e4` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/tvAudioSignalStatus` | `getTVAudioSignalStatus` | `-` | `0x20000101` | `0x101de9d4` `0x101de9e4` | — |

Related enum registrations (proven integer values — see `enum_tables`):

- **dd_surround_config**: `DD_SAT_CONF`=1, `DD_NO_SURROUND`=2, `DD_NO_SURROUND_TO_SAT`=3, `DD_SURROUND`=4, `DD_SURROUND_TO_SAT`=5

Op-level JSON keys recovered from op-object methods: `muse`, `tvPowerState`, `nightMode`, `enhanceDialog`, `wifiMacAddress`, `details`, `macAddress`

Validation / log strings recovered from op-object methods:

- `v1/players/%s/homeTheater`
- `v1/players/%s/homeTheater/tvPowerState`

Route fragments these ops build or forward to: `v1/players/%s/homeTheater`, `v1/players/%s/homeTheater/tvPowerState`

## `householdUpdate`

Per-device household software update — a single player checks and applies firmware relative to its household, where `households`/`update` drive the household-wide flow.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/devices/{deviceId}/householdUpdate/update` | `beginHouseholdSoftwareUpdate` | `-` | `0x20000102` | `0x10af58f0` `0x10af5900` | — |
| `POST` | `v1/households/{householdId}/devices/{deviceId}/householdUpdate/update` | `beginHouseholdSoftwareUpdate` | `-` | `0x20000102` | `0x10af58f0` `0x10af5900` | — |
| `GET` | `v1/devices/{deviceId}/householdUpdate/status` | `getHouseholdUpdateStatus` | `-` | `0x20000101` | `0x10af5900` `0x10af5910` desc:`10af71e0` `10af8770` `10af8780` | — |
| `GET` | `v1/households/{householdId}/devices/{deviceId}/householdUpdate/status` | `getHouseholdUpdateStatus` | `-` | `0x20000101` | `0x10af5900` `0x10af5910` desc:`10af71e0` `10af8770` `10af8780` | — |

Resource implementation functions (string-block registrar family): `0x10af5930`

Field vocabulary recovered from the resource's implementation functions: `householdUpdate`

Related enum registrations (proven integer values — see `enum_tables`):

- **device_update_fsm**: `UNDEFINED`=1, `CONNECT`=2, `HELLO`=3, `DOWNLOAD`=4, `FLASHWRITE`=5, `WAIT`=6, `REBOOT`=7, `ERROR`=8, `FINISHED`=9
- **device_update_fsm2**: `INIT`=1, `HELLO`=2, `HELLO_DONE`=3, `DOWNLOAD`=4, `DOWNLOAD_DONE`=5, `FLASHWRITE`=6, `FLASHWRITE_DONE`=7, `REBOOT`=8, `REBOOTING_DONE`=9
- **household_update_result**: `NO_DEVICES_NEED_UPDATE`=1, `UPDATE_COMPLETE`=2, `INFO_FILE_WRITE_FAILED`=3, `BSU_FAILED`=4, `UPGRADE_MGR_SPAWN_FAILED`=5, `MANIFEST_DOWNLOAD_FAILED`=6, `MANIFEST_PARSE_FAILED`=7, `UPDATE_NEVER_RUN`=8, `FINAL_RESULT_UNKNOWN`=9

Op-level JSON keys recovered from op-object methods: `muse`

## `households`

Top-level household object: create/lookup, members, the `none`-scoped ops are unauthenticated bootstrap endpoints (a player with no household talks here). Everything else in muse hangs off a `householdId` bound by these routes.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/\[error:  'none' is not a valid target\]/households` | `getHouseholds` | `-` | `0x20000101` | resource-block | — |
| `GET` | `v1/households/{householdId}/households` | `getHouseholds` | `-` | `0x20000101` | resource-block | — |
| `GET` | `v1/\[error:  'none' is not a valid target\]/households/{householdId}` | `getHousehold` | `householdId` | `0x20000101` | resource-block | — |
| `GET` | `v1/households/{householdId}/households/{householdId}` | `getHousehold` | `householdId` | `0x20000101` | resource-block | — |
| `POST` | `v1/households/{householdId}/households/name` | `setName` | `-` | `0x20000102` | `0x10af3468` `0x10af58e0` `0x10af58f0` `0x10af5900` `0x10af5910` desc:`10af58e0` `10af58f0` `10af5900` `10af5910` | — |
| `GET` | `v1/households/{householdId}/households/location` | `getHouseholdLocation` | `-` | `0x20000101` | resource-block | — |
| `PUT` | `v1/households/{householdId}/households/location` | `setLocation` | `-` | `0x20000104` | resource-block | — |

Resource implementation functions (string-block registrar family): `0x10af3488`

Field vocabulary recovered from the resource's implementation functions: `households`

## `info`

Read-only per-player info — identity, capabilities, version. The cheap 'what is this box' query.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/info` | `getInfo` | `-` | `0x20000101` | resource-block | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/info` | `getInfo` | `-` | `0x20000101` | resource-block | — |

Resource implementation functions (string-block registrar family): `0x10a38570`, `0x10a3890c`, `0x10a38e50`

Field vocabulary recovered from the resource's implementation functions: `info`, `resources`, `type`, `id`, `name`, `explicit`, `playable`, `metadata`, `images`, `count`, `offset`, `pageSize`, `total`, `_objectType`, `false`, `true`, `url`, `width`, `height`, `objectId`, `accountId`, `serviceId`, `REDACTED`, `metadataBlob`

Implementation messages:

- `%d`

## `ircontrol`

IR remote-control config for players with IR sensors (the volume-and-mute commands the soundbar learned from a TV remote). GET reads learned state, POST teaches/clears.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/ircontrol` | `setIRControl` | `-` | `0x20000102` | `0x10af8770` | `enabled` |
| `POST` | `v1/households/{householdId}/players/{playerId}/ircontrol` | `setIRControl` | `-` | `0x20000102` | `0x10af8770` | `enabled` |
| `GET` | `v1/players/{playerId}/ircontrol` | `getIRControl` | `-` | `0x20000101` | `0x10af8770` `0x10af8780` desc:`10afb934` `10afb944` `10afb954` `10afb964` `10afb974` `10afb984` `10afb994` | `enabled` |
| `GET` | `v1/households/{householdId}/players/{playerId}/ircontrol` | `getIRControl` | `-` | `0x20000101` | `0x10af8770` `0x10af8780` desc:`10afb934` `10afb944` `10afb954` `10afb964` `10afb974` `10afb984` `10afb994` | `enabled` |

Op-level JSON keys recovered from op-object methods: `enabled`, `muse`

## `localContentLibrary`

The local music library (shared folders) via muse — browse/index/control for SMB library shares, distinct from UPnP ContentDirectory browse.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/localContentLibrary` | `getShares` | `-` | `0x20000101` | `0x10afb944` `0x10afb954` | — |
| `POST` | `v1/households/{householdId}/localContentLibrary` | `addShare` | `-` | `0x20000102` | `0x10afb954` `0x10afb964` | `path` |
| `DELETE` | `v1/households/{householdId}/localContentLibrary/{shareId}` | `removeShare` | `shareId` | `0x20000108` | `0x10afb964` `0x10afb974` | `path`, `shareId` |
| `POST` | `v1/households/{householdId}/localContentLibrary/reindex` | `reindex` | `-` | `0x20000102` | `0x10afb974` `0x10afb984` | `shareId` |
| `GET` | `v1/players/{playerId}/localContentLibrary/indexer` | `getIndexerStatus` | `-` | `0x20000101` | `0x10afb984` `0x10afb994` desc:`10afe1ac` `10afe1bc` `10b01a9c` `10b01aac` `10b01abc` `10b01acc` `10b01adc` `10b01aec` `10b01afc` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/localContentLibrary/indexer` | `getIndexerStatus` | `-` | `0x20000101` | `0x10afb984` `0x10afb994` desc:`10afe1ac` `10afe1bc` `10b01a9c` `10b01aac` `10b01abc` `10b01acc` `10b01adc` `10b01aec` `10b01afc` | — |

Related enum registrations (proven integer values — see `enum_tables`):

- **replication_state**: `PENDING_ADD`=1, `ADD_IN_PROGRESS`=2, `ADD_COMPLETE`=3, `PENDING_REINDEXING`=4, `REINDEXING_IN_PROGRESS`=5, `REINDEXING_COMPLETE`=6, `REPLICATION_IN_PROGRESS`=7, `REPLICATION_COMPLETE`=8, `PENDING_DELETE`=9, `DELETE_COMPLETE`=10

Op-level JSON keys recovered from op-object methods: `muse`, `path`, `username`, `password`, `shareId`

## `management`

Administrative POSTs on a player — factory/maintenance operations.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/management/factoryReset` | `factoryReset` | `-` | `0x20000102` | `0x10afe1ac` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/management/factoryReset` | `factoryReset` | `-` | `0x20000102` | `0x10afe1ac` | — |
| `POST` | `v1/players/{playerId}/management/reboot` | `reboot` | `-` | `0x20000102` | `0x10afe1ac` `0x10afe1bc` `0x10b0d1b0` `0x10b0d1c0` | `fullSync`, `setting` |
| `POST` | `v1/households/{householdId}/players/{playerId}/management/reboot` | `reboot` | `-` | `0x20000102` | `0x10afe1ac` `0x10afe1bc` `0x10b0d1b0` `0x10b0d1c0` | `fullSync`, `setting` |

Resource implementation functions (string-block registrar family): `0x10afe1dc`

Field vocabulary recovered from the resource's implementation functions: `management`

Related enum registrations (proven integer values — see `enum_tables`):

- **net_state**: `SONOSNET`=1, `STATION`=2, `DISCONNECTED`=3, `STATION_SATELLITE`=4
- **wifi_state_fsm**: `INACTIVE`=1, `WIFI_ENABLING`=2, `ACK_AWAIT`=3, `WIFI_DISABLING`=4, `WIFI_DISABLED`=5, `ACK_NOT_RECEIVED`=6

Op-level JSON keys recovered from op-object methods: `muse`, `fullSync`, `setting`, `operation`

## `musicServiceAccounts`

Music-service account linking for the household/group — add, remove and inspect the SMAPI service accounts bound to the household. The SOAP-side `upnpMusicServices` resource is the equivalent read surface.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/households/{householdId}/musicServiceAccounts/match` | `match` | `-` | `0x20000102` | `0x10b01aac` `0x10b01abc` | `userIdHashCode` |
| `POST` | `v1/households/{householdId}/musicServiceAccounts/preferred` | `setPreferredMusicServiceAccount` | `-` | `0x20000102` | `0x10b01abc` `0x10b01acc` | `userIdHashCode`, `accountId` |
| `GET` | `v1/households/{householdId}/musicServiceAccounts/preferred` | `getPreferredMusicServiceAccount` | `-` | `0x20000101` | `0x10b01acc` `0x10b01adc` | `accountId` |
| `POST` | `v1/groups/{groupId}/musicServiceAccounts/startDirectControlEx` | `startDirectControlEx` | `-` | `0x20000102` | `0x10b01adc` `0x10b01aec` | `appId` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/musicServiceAccounts/startDirectControlEx` | `startDirectControlEx` | `-` | `0x20000102` | `0x10b01adc` `0x10b01aec` | `appId` |
| `POST` | `v1/groups/{groupId}/musicServiceAccounts/endDirectControl` | `endDirectControl` | `-` | `0x20000102` | `0x10b01aec` `0x10b01afc` | `appId` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/musicServiceAccounts/endDirectControl` | `endDirectControl` | `-` | `0x20000102` | `0x10b01aec` `0x10b01afc` | `appId` |

Related enum registrations (proven integer values — see `enum_tables`):

- **account_link_state**: `RESET`=1, `OFFLINE`=2, `INITIATING`=3, `ONLINE`=4, `TERMINATING`=5, `ERROR`=6
- **content_object_type**: `ALBUM`=1, `ARTIST`=2, `AUDIOBOOK`=3, `CHAPTER`=4, `SMAPI_CONTAINER`=5, `EPISODE`=6, `PLAYLIST`=7, `PODCAST`=8, `PROGRAM`=9, `STREAM`=10, `TRACK`=11
- **service_kind**: `radio`=1, `reporting`=2, `audiobook`=3, `browse`=4
- **service_tier**: `none`=1, `free`=2, `paidLimited`=3, `paidPremium`=4
- **session_state**: `RESET`=1, `OFFLINE`=2, `ONLINE`=3, `ROOT_INDIRECT`=4, `BROADCAST_BLOCKED`=5
- **session_state2**: `RESET`=1, `OFFLINE`=2, `INITIATING`=3, `ONLINE`=4, `ERROR`=5
- **smapi_capability_bits**: `basic-ui`=1, `content`=1, `no-ads`=1, `media-sources`=1, `commercial-msp`=2, `content-saving`=2, `hd-content`=2, `third-party-integ`=2, `essentials-msp`=4, `settings`=4, `special-content`=4, `premium-msp`=8, `alarms`=8, `on-demand-archive`=8, `dashboard-access`=16, `messaging`=16, `can-skip`=16, `schedules-access`=32, `save-groups`=32

Op-level JSON keys recovered from op-object methods: `muse`, `userIdHashCode`, `nickname`, `serviceId`, `linkCode`, `linkDeviceId`, `accountId`, `appId`, `restartToken`

## `networkTest`

Per-player network diagnostics — run wireless/Internet tests and read results. Powers the 'check network' app flows.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/networkTest/disableNetwork` | `temporarilyDisableNetwork` | `-` | `0x20000102` | `0x10b050dc` | `delaySecs` |
| `POST` | `v1/households/{householdId}/players/{playerId}/networkTest/disableNetwork` | `temporarilyDisableNetwork` | `-` | `0x20000102` | `0x10b050dc` | `delaySecs` |
| `POST` | `v1/players/{playerId}/networkTest/start` | `startNetworkTests` | `-` | `0x20000102` | `0x10b050dc` `0x10b050ec` | `delaySecs`, `url` |
| `POST` | `v1/households/{householdId}/players/{playerId}/networkTest/start` | `startNetworkTests` | `-` | `0x20000102` | `0x10b050dc` `0x10b050ec` | `delaySecs`, `url` |
| `GET` | `v1/players/{playerId}/networkTest/{networkTestId}` | `getNetworkTestResults` | `networkTestId` | `0x20000101` | `0x10b050ec` `0x10b050fc` | `delaySecs`, `url`, `networkTestId` |
| `GET` | `v1/households/{householdId}/players/{playerId}/networkTest/{networkTestId}` | `getNetworkTestResults` | `networkTestId` | `0x20000101` | `0x10b050ec` `0x10b050fc` | `delaySecs`, `url`, `networkTestId` |

Op-level JSON keys recovered from op-object methods: `delaySecs`, `durationSecs`, `muse`, `url`, `networkTestId`

## `pinewood`

The remote-control API ('pinewood' = TV-remote emulation). All POST, player-scoped: `mute`, `volumeUp`/`volumeDown`, `power`, `dpad` directions, `back`, `home`, `settings`, `play`, `loadResource`. A client implements a full remote by posting these verbs — cloud-relayed through the same mux when off-LAN.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/pinewood/mute` | `toggleMute` | `-` | `0x20000102` | `0x10b09108` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/mute` | `toggleMute` | `-` | `0x20000102` | `0x10b09108` | — |
| `POST` | `v1/players/{playerId}/pinewood/volumeUp` | `volumeUp` | `-` | `0x20000102` | `0x10b09108` `0x10b09118` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/volumeUp` | `volumeUp` | `-` | `0x20000102` | `0x10b09108` `0x10b09118` | — |
| `POST` | `v1/players/{playerId}/pinewood/volumeDown` | `volumeDown` | `-` | `0x20000102` | `0x10b09118` `0x10b09128` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/volumeDown` | `volumeDown` | `-` | `0x20000102` | `0x10b09118` `0x10b09128` | — |
| `POST` | `v1/players/{playerId}/pinewood/loadResource` | `loadResource` | `-` | `0x20000102` | `0x10b09128` `0x10b09138` | `deeplink`, `deeplink` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/loadResource` | `loadResource` | `-` | `0x20000102` | `0x10b09128` `0x10b09138` | `deeplink`, `deeplink` |
| `POST` | `v1/players/{playerId}/pinewood/power` | `power` | `-` | `0x20000102` | `0x10b09138` `0x10b09148` | `deeplink`, `deeplink` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/power` | `power` | `-` | `0x20000102` | `0x10b09138` `0x10b09148` | `deeplink`, `deeplink` |
| `POST` | `v1/players/{playerId}/pinewood/dpad` | `dpad` | `-` | `0x20000102` | `0x10b09148` `0x10b09158` | `dpadDirection` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/dpad` | `dpad` | `-` | `0x20000102` | `0x10b09148` `0x10b09158` | `dpadDirection` |
| `POST` | `v1/players/{playerId}/pinewood/back` | `back` | `-` | `0x20000102` | `0x10b09158` `0x10b09168` | `dpadDirection` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/back` | `back` | `-` | `0x20000102` | `0x10b09158` `0x10b09168` | `dpadDirection` |
| `POST` | `v1/players/{playerId}/pinewood/home` | `home` | `-` | `0x20000102` | `0x10b09168` `0x10b09178` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/home` | `home` | `-` | `0x20000102` | `0x10b09168` `0x10b09178` | — |
| `POST` | `v1/players/{playerId}/pinewood/settings` | `settings` | `-` | `0x20000102` | `0x10b09178` `0x10b09188` | `menuType` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/settings` | `settings` | `-` | `0x20000102` | `0x10b09178` `0x10b09188` | `menuType` |
| `POST` | `v1/players/{playerId}/pinewood/play` | `togglePlay` | `-` | `0x20000102` | `0x10b09188` `0x10b09198` desc:`10b0d1b0` `10b0d1c0` `10b0d1d0` | `menuType` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/play` | `togglePlay` | `-` | `0x20000102` | `0x10b09188` `0x10b09198` desc:`10b0d1b0` `10b0d1c0` `10b0d1d0` | `menuType` |

Op-level JSON keys recovered from op-object methods: `muse`, `deeplink`, `dpadDirection`, `menuType`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `backhaulChannel`, `flatChannelMapSet`, `fronthaulChannel`, `isHomeTheater`

## `platformInternal`

Privileged platform ops — POST-only, player/household scoped, used by first-party infrastructure rather than the public app.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/households/{householdId}/platformInternal/sync` | `sync` | `-` | `0x20000102` | `0x10b0d1b0` | `fullSync`, `setting` |
| `POST` | `v1/players/{playerId}/platformInternal/reboot` | `reboot` | `-` | `0x20000102` | `0x10afe1ac` `0x10afe1bc` `0x10b0d1b0` `0x10b0d1c0` | `fullSync`, `setting` |
| `POST` | `v1/households/{householdId}/players/{playerId}/platformInternal/reboot` | `reboot` | `-` | `0x20000102` | `0x10afe1ac` `0x10afe1bc` `0x10b0d1b0` `0x10b0d1c0` | `fullSync`, `setting` |
| `POST` | `v1/households/{householdId}/platformInternal/invalidateCache` | `invalidateCache` | `-` | `0x20000102` | `0x10b0d1c0` `0x10b0d1d0` desc:`10b0f748` `10b0f758` `10b0f768` `10b0f778` `10b12e68` `10b12e78` `10b12e88` `10b12e98` `10b12ea8` `10b12eb8` | `cacheSettings`, `cacheSettings`, `cacheNamespace`, `cacheSettings`, `cacheSettings` |

Resource implementation functions (string-block registrar family): `0x10b0d1f0`

Field vocabulary recovered from the resource's implementation functions: `platformInternal`

Op-level JSON keys recovered from op-object methods: `fullSync`, `setting`, `operation`, `muse`, `cacheSettings`, `cacheNamespace`, `cacheData`, `cacheName`, `cacheKey`

## `playback`

The big one: transport control for a group. `play`, `pause`, `seek`, `loadStream`, track-list ops, play-mode changes, line-in/content selection — 32 ops, all group-scoped. This is the SOAP `AVTransport`'s modern replacement and every verb maps onto the same playback engine underneath.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/groups/{groupId}/playback` | `getPlaybackStatus` | `-` | `0x20000001` | `0x101ea534` `0x101ea544` | — |
| `GET` | `v1/households/{householdId}/groups/{groupId}/playback` | `getPlaybackStatus` | `-` | `0x20000001` | `0x101ea534` `0x101ea544` | — |
| `POST` | `v1/groups/{groupId}/playback/play` | `play` | `-` | `0x20000002` | `0x101ea544` `0x101ea554` | `allowTvPauseRestore`, `deviceFeedback` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/play` | `play` | `-` | `0x20000002` | `0x101ea544` `0x101ea554` | `allowTvPauseRestore`, `deviceFeedback` |
| `POST` | `v1/groups/{groupId}/playback/pause` | `pause` | `-` | `0x20000002` | `0x101ea554` `0x101ea564` | `allowTvPauseRestore`, `deviceFeedback` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/pause` | `pause` | `-` | `0x20000002` | `0x101ea554` `0x101ea564` | `allowTvPauseRestore`, `deviceFeedback` |
| `POST` | `v1/groups/{groupId}/playback/togglePlayPause` | `togglePlayPause` | `-` | `0x20000002` | `0x101ea564` `0x101ea574` | `allowTvPauseRestore` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/togglePlayPause` | `togglePlayPause` | `-` | `0x20000002` | `0x101ea564` `0x101ea574` | `allowTvPauseRestore` |
| `POST` | `v1/groups/{groupId}/playback/playMode` | `setPlayModes` | `-` | `0x20000002` | `0x101ea574` `0x101ea584` | `playModes`, `playModes` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/playMode` | `setPlayModes` | `-` | `0x20000002` | `0x101ea574` `0x101ea584` | `playModes`, `playModes` |
| `POST` | `v1/groups/{groupId}/playback/skipToNextTrack` | `skipToNextTrack` | `-` | `0x20000002` | `0x101ea584` `0x101ea594` | `playModes`, `playModes` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/skipToNextTrack` | `skipToNextTrack` | `-` | `0x20000002` | `0x101ea584` `0x101ea594` | `playModes`, `playModes` |
| `POST` | `v1/groups/{groupId}/playback/skipToPreviousTrack` | `skipToPreviousTrack` | `-` | `0x20000002` | `0x101ea594` `0x101ea5a4` | — |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/skipToPreviousTrack` | `skipToPreviousTrack` | `-` | `0x20000002` | `0x101ea594` `0x101ea5a4` | — |
| `POST` | `v1/groups/{groupId}/playback/skipBack` | `skipBack` | `-` | `0x20000002` | `0x101ea5a4` `0x101ea5b4` | — |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/skipBack` | `skipBack` | `-` | `0x20000002` | `0x101ea5a4` `0x101ea5b4` | — |
| `POST` | `v1/groups/{groupId}/playback/seek` | `seek` | `-` | `0x20000002` | `0x101ea5b4` `0x101ea5c4` `0x101fcf68` `0x101fcf78` | `positionMillis`, `itemId`, `playOnCompletion`, `window`, `window` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/seek` | `seek` | `-` | `0x20000002` | `0x101ea5b4` `0x101ea5c4` `0x101fcf68` `0x101fcf78` | `positionMillis`, `itemId`, `playOnCompletion`, `window`, `window` |
| `POST` | `v1/groups/{groupId}/playback/seekRelative` | `seekRelative` | `-` | `0x20000002` | `0x101ea5c4` `0x101ea5d4` `0x101fcf78` `0x101fcf88` | `positionMillis`, `itemId`, `deltaMillis` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/seekRelative` | `seekRelative` | `-` | `0x20000002` | `0x101ea5c4` `0x101ea5d4` `0x101fcf78` `0x101fcf88` | `positionMillis`, `itemId`, `deltaMillis` |
| `POST` | `v1/groups/{groupId}/playback/loadContainer` | `loadContainer` | `-` | `0x20000002` | `0x101ea5d4` `0x101ea5e4` | `deltaMillis`, `itemId`, `playOnCompletion`, `action`, `containerId`, `containerId` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/loadContainer` | `loadContainer` | `-` | `0x20000002` | `0x101ea5d4` `0x101ea5e4` | `deltaMillis`, `itemId`, `playOnCompletion`, `action`, `containerId`, `containerId` |
| `POST` | `v1/groups/{groupId}/playback/trackList` | `loadTrackList` | `-` | `0x20000002` | `0x101ea5e4` `0x101ea5f4` | `playOnCompletion`, `action`, `containerId`, `containerId`, `tracks`, `tracks`, `tracks`, `tracks` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/trackList` | `loadTrackList` | `-` | `0x20000002` | `0x101ea5e4` `0x101ea5f4` | `playOnCompletion`, `action`, `containerId`, `containerId`, `tracks`, `tracks`, `tracks`, `tracks` |
| `POST` | `v1/groups/{groupId}/playback/loadStream` | `loadStream` | `-` | `0x20000002` | `0x101ea5f4` `0x101ea604` | `tracks`, `tracks`, `playOnCompletion`, `action`, `tracks`, `tracks`, `stationId`, `stationId` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/loadStream` | `loadStream` | `-` | `0x20000002` | `0x101ea5f4` `0x101ea604` | `tracks`, `tracks`, `playOnCompletion`, `action`, `tracks`, `tracks`, `stationId`, `stationId` |
| `POST` | `v1/groups/{groupId}/playback/lineIn` | `loadLineIn` | `-` | `0x20000002` | `0x101ea604` `0x101ea614` | `playOnCompletion`, `stationId`, `stationId`, `deviceId` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/lineIn` | `loadLineIn` | `-` | `0x20000002` | `0x101ea604` `0x101ea614` | `playOnCompletion`, `stationId`, `stationId`, `deviceId` |
| `POST` | `v1/groups/{groupId}/playback/content` | `loadContent` | `-` | `0x20000002` | `0x101ea614` `0x101ea624` | `playOnCompletion`, `deviceId`, `type`, `id`, `id` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/content` | `loadContent` | `-` | `0x20000002` | `0x101ea614` `0x101ea624` | `playOnCompletion`, `deviceId`, `type`, `id`, `id` |
| `POST` | `v1/groups/{groupId}/playback/skipToTrack` | `skipToTrack` | `-` | `0x20000002` | `0x101ea624` `0x101ea634` | `type`, `id`, `id`, `trackNumber` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/skipToTrack` | `skipToTrack` | `-` | `0x20000002` | `0x101ea624` `0x101ea634` | `type`, `id`, `id`, `trackNumber` |

Related enum registrations (proven integer values — see `enum_tables`):

- **play_modes**: `NORMAL`=1, `REPEAT_ALL`=2, `SHUFFLE`=3, `SHUFFLE_NOREPEAT`=4
- **playback_button**: `PLAY`=1, `PAUSE`=2, `NEXT_TRACK`=3, `PREV_TRACK`=4
- **playback_states**: `PLAYBACK_STATE_IDLE`=1, `PLAYBACK_STATE_BUFFERING`=2, `PLAYBACK_STATE_PAUSED`=3, `PLAYBACK_STATE_PLAYING`=4
- **queue_insert_mode**: `REPLACE`=1, `APPEND`=2, `INSERT`=3, `INSERT_NEXT`=4, `PLAY_NOW`=5

Op-level JSON keys recovered from op-object methods: `muse`, `allowTvPauseRestore`, `deviceFeedback`, `playModes`, `positionMillis`, `itemId`, `playOnCompletion`, `window`, `bridgeContext`, `deltaMillis`, `action`, `containerId`, `containerMetadata`, `playbackLocation`, `tracks`, `stationId`, `deviceId`, `instanceId`, `type`, `defaults`, `playbackAction`, `queueAction`, `id`, `metadata`, `advertisingInfo`, `trackNumber`

Validation / log strings recovered from op-object methods:

- `v1/groups/%s/playback/play`
- `v1/groups/%s/playback/pause`
- `v1/groups/%s/playback/playMode`
- `v1/groups/%s/playback/skipToNextTrack`
- `v1/groups/%s/playback/skipToPreviousTrack`
- `v1/groups/%s/playback/seek`
- `v1/groups/%s/playback/seekRelative`
- `v1/groups/%s/playback/loadContainer`
- `v1/groups/%s/playback/loadStream`

Route fragments these ops build or forward to: `v1/groups/%s/playback/play`, `v1/groups/%s/playback/pause`, `v1/groups/%s/playback/playMode`, `v1/groups/%s/playback/skipToNextTrack`, `v1/groups/%s/playback/skipToPreviousTrack`, `v1/groups/%s/playback/seek`, `v1/groups/%s/playback/seekRelative`, `v1/groups/%s/playback/loadContainer`, `v1/groups/%s/playback/loadStream`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `durationMillis`, `muted`, `volume`, `volumeDelta`

## `playbackExtended`

Extended playback reads — richer state than the plain playback GETs (detailed position/track info for the now-playing surface).

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/groups/{groupId}/playbackExtended` | `getExtendedPlaybackStatus` | `-` | `0x20000101` | `0x101f1748` `0x101f1758` | — |
| `GET` | `v1/households/{householdId}/groups/{groupId}/playbackExtended` | `getExtendedPlaybackStatus` | `-` | `0x20000101` | `0x101f1748` `0x101f1758` | — |

Op-level JSON keys recovered from op-object methods: `muse`

## `playbackMetadata`

Read/write playback metadata on a group — the track display state the player publishes. The write op lets privileged callers correct displayed metadata.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/groups/{groupId}/playbackMetadata` | `getMetadataStatus` | `-` | `0x20000001` | `0x10b0f758` `0x10b0f768` | — |
| `GET` | `v1/households/{householdId}/groups/{groupId}/playbackMetadata` | `getMetadataStatus` | `-` | `0x20000001` | `0x10b0f758` `0x10b0f768` | — |
| `POST` | `v1/groups/{groupId}/playbackMetadata/ratings` | `rate` | `-` | `0x20000002` | `0x10b0f768` `0x10b0f778` | `itemId`, `rating`, `rating` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playbackMetadata/ratings` | `rate` | `-` | `0x20000002` | `0x10b0f768` `0x10b0f778` | `itemId`, `rating`, `rating` |

Op-level JSON keys recovered from op-object methods: `muse`, `itemId`, `rating`

## `playbackSession`

Sessioned playback — the queue/stream model the S2-era app uses. `loadContainer`, `seekRelative`, subscribe/unsubscribe ops, sessionId-scoped routes; 30 POST/DELETE ops. A playback session owns a media container (queue, station, stream) and emits subscription events as it advances.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/groups/{groupId}/playbackSession/joinOrCreate` | `joinOrCreateSession` | `-` | `0x20000102` | `0x101fce98` `0x101fcea8` | `appId` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playbackSession/joinOrCreate` | `joinOrCreateSession` | `-` | `0x20000102` | `0x101fce98` `0x101fcea8` | `appId` |
| `POST` | `v1/groups/{groupId}/playbackSession/join` | `joinSession` | `-` | `0x20000102` | `0x101fcea8` `0x101fceb8` | `appId` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playbackSession/join` | `joinSession` | `-` | `0x20000102` | `0x101fcea8` `0x101fceb8` | `appId` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/rejoin` | `rejoinSession` | `-` | `0x20000102` | `0x101fceb8` `0x101fcec8` | `appId` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/rejoin` | `rejoinSession` | `-` | `0x20000102` | `0x101fceb8` `0x101fcec8` | `appId` |
| `POST` | `v1/groups/{groupId}/playbackSession` | `createSession` | `-` | `0x20000102` | `0x101fcec8` `0x101fced8` | `appId` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playbackSession` | `createSession` | `-` | `0x20000102` | `0x101fcec8` `0x101fced8` | `appId` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/suspend` | `suspend` | `-` | `0x20000102` | `0x101fced8` `0x101fcee8` | `appId`, `queueVersion` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/suspend` | `suspend` | `-` | `0x20000102` | `0x101fced8` `0x101fcee8` | `appId`, `queueVersion` |
| `DELETE` | `v1/playbackSessions/{sessionId}/playbackSession` | `leaveSession` | `-` | `0x20000108` | `0x101fcee8` `0x101fcef8` | `queueVersion` |
| `DELETE` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession` | `leaveSession` | `-` | `0x20000108` | `0x101fcee8` `0x101fcef8` | `queueVersion` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/loadCloudQueue` | `loadCloudQueue` | `-` | `0x20000102` | `0x101fcef8` `0x101fcf08` | `useHttpAuthorizationForMedia`, `positionMillis`, `queueBaseUrl`, `trackMetadata`, `trackMetadata`, `trackMetadata` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/loadCloudQueue` | `loadCloudQueue` | `-` | `0x20000102` | `0x101fcef8` `0x101fcf08` | `useHttpAuthorizationForMedia`, `positionMillis`, `queueBaseUrl`, `trackMetadata`, `trackMetadata`, `trackMetadata` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/loadCloudQueueWithWindow` | `loadCloudQueueWithWindow` | `-` | `0x20000102` | `0x101fcf08` `0x101fcf18` | `useHttpAuthorizationForMedia`, `positionMillis`, `queueBaseUrl`, `trackMetadata`, `trackMetadata`, `trackMetadata`, `window`, `window` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/loadCloudQueueWithWindow` | `loadCloudQueueWithWindow` | `-` | `0x20000102` | `0x101fcf08` `0x101fcf18` | `useHttpAuthorizationForMedia`, `positionMillis`, `queueBaseUrl`, `trackMetadata`, `trackMetadata`, `trackMetadata`, `window`, `window` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/loadStreamUrl` | `loadStreamUrl` | `-` | `0x20000102` | `0x101fcf18` `0x101fcf28` | `useHttpAuthorizationForMedia`, `positionMillis`, `queueBaseUrl`, `window`, `window`, `playOnCompletion`, `streamUrl`, `stationMetadata`, `stationMetadata` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/loadStreamUrl` | `loadStreamUrl` | `-` | `0x20000102` | `0x101fcf18` `0x101fcf28` | `useHttpAuthorizationForMedia`, `positionMillis`, `queueBaseUrl`, `window`, `window`, `playOnCompletion`, `streamUrl`, `stationMetadata`, `stationMetadata` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/loadStreamUrlWithContext` | `loadStreamUrlWithContext` | `-` | `0x20000102` | `0x101fcf28` `0x101fcf38` | `playOnCompletion`, `streamUrl`, `stationMetadata`, `stationMetadata` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/loadStreamUrlWithContext` | `loadStreamUrlWithContext` | `-` | `0x20000102` | `0x101fcf28` `0x101fcf38` | `playOnCompletion`, `streamUrl`, `stationMetadata`, `stationMetadata` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/refreshCloudQueue` | `refreshCloudQueue` | `-` | `0x20000102` | `0x101fcf38` `0x101fcf48` | `playOnCompletion`, `streamUrl`, `stationMetadata`, `stationMetadata` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/refreshCloudQueue` | `refreshCloudQueue` | `-` | `0x20000102` | `0x101fcf38` `0x101fcf48` | `playOnCompletion`, `streamUrl`, `stationMetadata`, `stationMetadata` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/skipToItem` | `skipToItem` | `-` | `0x20000102` | `0x101fcf48` `0x101fcf58` | `playOnCompletion`, `positionMillis`, `itemId`, `trackMetadata`, `trackMetadata`, `trackMetadata` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/skipToItem` | `skipToItem` | `-` | `0x20000102` | `0x101fcf48` `0x101fcf58` | `playOnCompletion`, `positionMillis`, `itemId`, `trackMetadata`, `trackMetadata`, `trackMetadata` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/skipToItemWithWindow` | `skipToItemWithWindow` | `-` | `0x20000102` | `0x101fcf58` `0x101fcf68` | `playOnCompletion`, `positionMillis`, `itemId`, `trackMetadata`, `trackMetadata`, `trackMetadata`, `window`, `window` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/skipToItemWithWindow` | `skipToItemWithWindow` | `-` | `0x20000102` | `0x101fcf58` `0x101fcf68` | `playOnCompletion`, `positionMillis`, `itemId`, `trackMetadata`, `trackMetadata`, `trackMetadata`, `window`, `window` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/seek` | `seek` | `-` | `0x20000102` | `0x101ea5b4` `0x101ea5c4` `0x101fcf68` `0x101fcf78` | `positionMillis`, `itemId`, `playOnCompletion`, `window`, `window` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/seek` | `seek` | `-` | `0x20000102` | `0x101ea5b4` `0x101ea5c4` `0x101fcf68` `0x101fcf78` | `positionMillis`, `itemId`, `playOnCompletion`, `window`, `window` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/seekRelative` | `seekRelative` | `-` | `0x20000102` | `0x101ea5c4` `0x101ea5d4` `0x101fcf78` `0x101fcf88` | `positionMillis`, `itemId`, `deltaMillis` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/seekRelative` | `seekRelative` | `-` | `0x20000102` | `0x101ea5c4` `0x101ea5d4` `0x101fcf78` `0x101fcf88` | `positionMillis`, `itemId`, `deltaMillis` |

Op-level JSON keys recovered from op-object methods: `muse`, `appId`, `appContext`, `accountId`, `customData`, `queueVersion`, `useHttpAuthorizationForMedia`, `playOnCompletion`, `positionMillis`, `queueBaseUrl`, `httpAuthorization`, `itemId`, `trackMetadata`, `window`, `bridgeContext`, `streamUrl`, `stationMetadata`, `deltaMillis`

Validation / log strings recovered from op-object methods:

- `v1/groups/%s/playback/seek`
- `v1/groups/%s/playback/seekRelative`

Route fragments these ops build or forward to: `v1/groups/%s/playback/seek`, `v1/groups/%s/playback/seekRelative`

## `playerVolume`

Per-player volume: GET reads `{volume, muted, fixed, smartplay}`; POSTs set absolute volume, apply `volumeDelta`, duck/unduck (`/duck`, `/unduck` for temporary dips during doorbell/voice), and mute/unmute. `smartplay` fields expose per-source smart-volume behavior.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/playerVolume` | `setVolume` | `-` | `0x20000002` | `0x1020599c` `0x102059ac` `0x10ae9218` `0x10ae9228` | `muted`, `volume`, `volume` |
| `POST` | `v1/households/{householdId}/players/{playerId}/playerVolume` | `setVolume` | `-` | `0x20000002` | `0x1020599c` `0x102059ac` `0x10ae9218` `0x10ae9228` | `muted`, `volume`, `volume` |
| `POST` | `v1/players/{playerId}/playerVolume/relative` | `setRelativeVolume` | `-` | `0x20000002` | `0x102059ac` `0x102059bc` `0x10ae9228` `0x10ae9238` | `muted`, `volume`, `volume`, `volumeDelta`, `volumeDelta` |
| `POST` | `v1/households/{householdId}/players/{playerId}/playerVolume/relative` | `setRelativeVolume` | `-` | `0x20000002` | `0x102059ac` `0x102059bc` `0x10ae9228` `0x10ae9238` | `muted`, `volume`, `volume`, `volumeDelta`, `volumeDelta` |
| `POST` | `v1/players/{playerId}/playerVolume/mute` | `setMute` | `-` | `0x20000002` | `0x102059bc` `0x102059cc` `0x10ae9238` `0x10ae9248` | `muted`, `volumeDelta`, `volumeDelta` |
| `POST` | `v1/households/{householdId}/players/{playerId}/playerVolume/mute` | `setMute` | `-` | `0x20000002` | `0x102059bc` `0x102059cc` `0x10ae9238` `0x10ae9248` | `muted`, `volumeDelta`, `volumeDelta` |
| `GET` | `v1/players/{playerId}/playerVolume` | `getVolume` | `-` | `0x20000001` | `0x102059cc` `0x102059dc` `0x10ae9248` `0x10ae9258` | `muted` |
| `GET` | `v1/households/{householdId}/players/{playerId}/playerVolume` | `getVolume` | `-` | `0x20000001` | `0x102059cc` `0x102059dc` `0x10ae9248` `0x10ae9258` | `muted` |
| `POST` | `v1/players/{playerId}/playerVolume/duck` | `duck` | `-` | `0x20000002` | `0x102059dc` `0x102059ec` | `durationMillis` |
| `POST` | `v1/households/{householdId}/players/{playerId}/playerVolume/duck` | `duck` | `-` | `0x20000002` | `0x102059dc` `0x102059ec` | `durationMillis` |
| `POST` | `v1/players/{playerId}/playerVolume/unduck` | `unduck` | `-` | `0x20000002` | `0x102059ec` `0x102059fc` | `durationMillis` |
| `POST` | `v1/households/{householdId}/players/{playerId}/playerVolume/unduck` | `unduck` | `-` | `0x20000002` | `0x102059ec` `0x102059fc` | `durationMillis` |

Op-level JSON keys recovered from op-object methods: `muse`, `muted`, `volume`, `ibt`, `volumeDelta`, `durationMillis`

Validation / log strings recovered from op-object methods:

- `playerVolume::setVolume: cannot set volume AND mute parameter`
- `basic_string::append`
- `playerVolume::setRelativeVolume: cannot set volumeDelta AND muted parameter`
- `v1/players/%s/playerVolume/mute`
- `v1/groups/%s/groupVolume/mute`
- `v1/players/%s/playerVolume/duck`
- `v1/players/%s/playerVolume/unduck`

Route fragments these ops build or forward to: `v1/players/`, `/playerVolume`, `/mute`, `v1/groups/`, `/groupVolume`, `/relative`, `v1/players/%s/playerVolume/mute`, `v1/groups/%s/groupVolume/mute`, `v1/players/%s/playerVolume/duck`, `v1/players/%s/playerVolume/unduck`

## `playlists`

Household/group playlist surface — Sonos playlists (saved queue snapshots) listable and creatable here; the same objects UPnP `SQ:` favorites expose.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/playlists` | `getPlaylists` | `-` | `0x20000101` | `0x10b12e78` `0x10b12e88` desc:`10b1b2bc` `10b1b2cc` `10b1b2dc` `10b1b2ec` | — |
| `GET` | `v1/households/{householdId}/playlists/{playlistId}` | `getPlaylist` | `playlistId` | `0x20000101` | `0x10b12e88` `0x10b12e98` desc:`10b1b2fc` `10b1b30c` `10b1b31c` `10b1b32c` | `playlistId` |
| `POST` | `v1/households/{householdId}/playlists/getPlaylist` | `postPlaylist` | `-` | `0x20000102` | `0x10b12e98` `0x10b12ea8` desc:`10b1b33c` `10b1b34c` `10b1b35c` `10b1b36c` | `playlistId` |
| `POST` | `v1/groups/{groupId}/playlists` | `loadPlaylist` | `-` | `0x20000102` | `0x10b12ea8` `0x10b12eb8` desc:`10b1b37c` `10b1b38c` `10b1b39c` `10b1b3ac` | `playlistId`, `playOnCompletion`, `playModes`, `playModes` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playlists` | `loadPlaylist` | `-` | `0x20000102` | `0x10b12ea8` `0x10b12eb8` desc:`10b1b37c` `10b1b38c` `10b1b39c` `10b1b3ac` | `playlistId`, `playOnCompletion`, `playModes`, `playModes` |

Related enum registrations (proven integer values — see `enum_tables`):

- **content_object_type**: `ALBUM`=1, `ARTIST`=2, `AUDIOBOOK`=3, `CHAPTER`=4, `SMAPI_CONTAINER`=5, `EPISODE`=6, `PLAYLIST`=7, `PODCAST`=8, `PROGRAM`=9, `STREAM`=10, `TRACK`=11

Op-level JSON keys recovered from op-object methods: `muse`, `playlistId`, `playOnCompletion`, `action`, `playModes`, `playbackLocation`

## `positioning`

Per-player audio positioning/tuning — the mic-based room-detection suite behind `roomDetection` plus speaker-placement measurements. Player-scoped; drives Trueplay-style measurement capture.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/positioning/playStimulus` | `playStimulus` | `-` | `0x20000102` | `0x10b1b2cc` `0x10b1b2dc` | `behavior`, `behavior`, `attenuation`, `type` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/playStimulus` | `playStimulus` | `-` | `0x20000102` | `0x10b1b2cc` `0x10b1b2dc` | `behavior`, `behavior`, `attenuation`, `type` |
| `POST` | `v1/players/{playerId}/positioning/stimulusTuning` | `setStimulusTuning` | `-` | `0x20000102` | `0x10b1b2dc` `0x10b1b2ec` | `behavior`, `behavior`, `attenuation`, `type`, `setStimulusTuning`, `setStimulusTuning` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/stimulusTuning` | `setStimulusTuning` | `-` | `0x20000102` | `0x10b1b2dc` `0x10b1b2ec` | `behavior`, `behavior`, `attenuation`, `type`, `setStimulusTuning`, `setStimulusTuning` |
| `GET` | `v1/players/{playerId}/positioning/stimulusTuning` | `getStimulusTuning` | `-` | `0x20000101` | `0x10b1b2ec` `0x10b1b2fc` | `setStimulusTuning`, `setStimulusTuning` |
| `GET` | `v1/households/{householdId}/players/{playerId}/positioning/stimulusTuning` | `getStimulusTuning` | `-` | `0x20000101` | `0x10b1b2ec` `0x10b1b2fc` | `setStimulusTuning`, `setStimulusTuning` |
| `POST` | `v1/players/{playerId}/positioning/session` | `startSession` | `-` | `0x20000102` | `0x10b1b2fc` `0x10b1b30c` | `request`, `request` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/session` | `startSession` | `-` | `0x20000102` | `0x10b1b2fc` `0x10b1b30c` | `request`, `request` |
| `DELETE` | `v1/players/{playerId}/positioning/session` | `cancelSession` | `-` | `0x20000108` | `0x10b1b30c` `0x10b1b31c` | `request`, `request`, `id` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/positioning/session` | `cancelSession` | `-` | `0x20000108` | `0x10b1b30c` `0x10b1b31c` | `request`, `request`, `id` |
| `POST` | `v1/players/{playerId}/positioning/action` | `applyAction` | `-` | `0x20000102` | `0x10b1b31c` `0x10b1b32c` | `id` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/action` | `applyAction` | `-` | `0x20000102` | `0x10b1b31c` `0x10b1b32c` | `id` |
| `GET` | `v1/players/{playerId}/positioning/sessionMap` | `getSessionMap` | `-` | `0x20000101` | `0x10b1b32c` `0x10b1b33c` | `id` |
| `GET` | `v1/households/{householdId}/players/{playerId}/positioning/sessionMap` | `getSessionMap` | `-` | `0x20000101` | `0x10b1b32c` `0x10b1b33c` | `id` |
| `GET` | `v1/players/{playerId}/positioning/deviceMeasurements` | `getDeviceMeasurements` | `-` | `0x20000101` | `0x10b1b33c` `0x10b1b34c` | `id` |
| `GET` | `v1/households/{householdId}/players/{playerId}/positioning/deviceMeasurements` | `getDeviceMeasurements` | `-` | `0x20000101` | `0x10b1b33c` `0x10b1b34c` | `id` |
| `POST` | `v1/players/{playerId}/positioning/measurements` | `sendMeasurements` | `-` | `0x20000102` | `0x10b1b34c` `0x10b1b35c` | `id`, `measurements`, `measurements` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/measurements` | `sendMeasurements` | `-` | `0x20000102` | `0x10b1b34c` `0x10b1b35c` | `id`, `measurements`, `measurements` |
| `POST` | `v1/players/{playerId}/positioning/sessionError` | `notifySessionError` | `-` | `0x20000102` | `0x10b1b35c` `0x10b1b36c` | `measurements`, `measurements`, `notifySessionError`, `notifySessionError` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/sessionError` | `notifySessionError` | `-` | `0x20000102` | `0x10b1b35c` `0x10b1b36c` | `measurements`, `measurements`, `notifySessionError`, `notifySessionError` |
| `POST` | `v1/players/{playerId}/positioning/sessionStatus` | `notifySessionStatus` | `-` | `0x20000102` | `0x10b1b36c` `0x10b1b37c` | `notifySessionError`, `notifySessionError`, `notifySessionStatus`, `notifySessionStatus` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/sessionStatus` | `notifySessionStatus` | `-` | `0x20000102` | `0x10b1b36c` `0x10b1b37c` | `notifySessionError`, `notifySessionError`, `notifySessionStatus`, `notifySessionStatus` |
| `POST` | `v1/players/{playerId}/positioning/deviceStatus` | `notifyDeviceStatus` | `-` | `0x20000102` | `0x10b1b37c` `0x10b1b38c` | `notifySessionStatus`, `notifySessionStatus`, `notifyDeviceStatus`, `notifyDeviceStatus` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/deviceStatus` | `notifyDeviceStatus` | `-` | `0x20000102` | `0x10b1b37c` `0x10b1b38c` | `notifySessionStatus`, `notifySessionStatus`, `notifyDeviceStatus`, `notifyDeviceStatus` |
| `GET` | `v1/players/{playerId}/positioning/measurementCapabilities` | `getMeasurementCapabilities` | `-` | `0x20000101` | `0x10b1b38c` `0x10b1b39c` | `notifyDeviceStatus`, `notifyDeviceStatus` |
| `GET` | `v1/households/{householdId}/players/{playerId}/positioning/measurementCapabilities` | `getMeasurementCapabilities` | `-` | `0x20000101` | `0x10b1b38c` `0x10b1b39c` | `notifyDeviceStatus`, `notifyDeviceStatus` |
| `POST` | `v1/players/{playerId}/positioning/telemetryLevel` | `setTelemetryLevel` | `-` | `0x20000102` | `0x10b1b39c` `0x10b1b3ac` | `setTelemetryLevel`, `setTelemetryLevel` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/telemetryLevel` | `setTelemetryLevel` | `-` | `0x20000102` | `0x10b1b39c` `0x10b1b3ac` | `setTelemetryLevel`, `setTelemetryLevel` |

Op-level JSON keys recovered from op-object methods: `muse`, `behavior`, `attenuation`, `type`, `setStimulusTuning`, `request`, `id`, `orchestratorId`, `action`, `measurements`, `notifySessionError`, `notifySessionStatus`, `notifyDeviceStatus`, `setTelemetryLevel`

Validation / log strings recovered from op-object methods:

- `notifySessionError`

## `power`

Player power ops — POST-only power transitions (the player has no soft-power via SOAP; muse exposes it).

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/power/policy` | `setPowerPolicy` | `-` | `0x20000102` | `0x10b20c04` `0x10b22460` `0x10b22470` `0x10b2b8f4` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/power/policy` | `setPowerPolicy` | `-` | `0x20000102` | `0x10b20c04` `0x10b22460` `0x10b22470` `0x10b2b8f4` | — |

Resource implementation functions (string-block registrar family): `0x10b20c24`, `0x10b05ea8`, `0x100d5240`

Field vocabulary recovered from the resource's implementation functions: `power`, `volumeUp`, `volumeDown`, `toggleMute`, `loadResource`, `dpad`, `back`, `home`, `settings`, `togglePlay`, `secondary`, `role`, `stp`, `useCase`, `powerWakeupFromSemiSleep`, `primary`, `ht`

Related enum registrations (proven integer values — see `enum_tables`):

- **playback_button**: `PLAY`=1, `PAUSE`=2, `NEXT_TRACK`=3, `PREV_TRACK`=4
- **power_states**: `MOTION_DETECTED`=1, `MOTION_SETTLED`=2, `SLEEPING`=3, `WAKING_UP`=4, `POWERING_DOWN`=5, `POWERING_UP`=6, `SMART_DOCKED`=7, `CHARGING`=8, `PRIMARY_PLAYBACK_STARTED`=9, `POWERING_UP_UPDATED`=10, `WAKING_UP_FROM_USER`=11, `PRIMARY_NETWORK_STATUS_CHANGE`=12
- **remote_buttons**: `POWER`=1, `BACK`=2, `HOME`=3, `MENU`=4, `PLAY_PAUSE`=5, `MUSIC`=6, `DPAD_UP`=7, `DPAD_DOWN`=8, `DPAD_LEFT`=9, `DPAD_RIGHT`=10, `DPAD_SELECT`=11

## `roomDetection`

Mic-based room detection — start/stop the chirp-based proximity and room-matching flow that the Chirp stack backs. POST deletes/stops in-flight detection state.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/roomDetection/chirp` | `startSignalling` | `-` | `0x20000102` | `0x10b22460` | `channelNumber` |
| `POST` | `v1/households/{householdId}/players/{playerId}/roomDetection/chirp` | `startSignalling` | `-` | `0x20000102` | `0x10b22460` | `channelNumber` |
| `DELETE` | `v1/players/{playerId}/roomDetection/chirp/{playId}` | `stopSignalling` | `playId` | `0x20000108` | `0x10b22460` `0x10b22470` desc:`10b2b8f4` `10b2b904` `10b2b914` `10b2b924` `10b2b934` `10b2b944` `10b2b954` `10b2b964` `10b2b974` `10b2b984` `10b2b994` `10b2b9a4` `10b2b9b4` `10b2b9c4` `10b2b9d4` `10b2b9e4` `10b2b9f4` `10b2ba04` `10b2ba14` `10b2ba24` `10b2ba34` `10b2ba44` | `channelNumber`, `playId` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/roomDetection/chirp/{playId}` | `stopSignalling` | `playId` | `0x20000108` | `0x10b22460` `0x10b22470` desc:`10b2b8f4` `10b2b904` `10b2b914` `10b2b924` `10b2b934` `10b2b944` `10b2b954` `10b2b964` `10b2b974` `10b2b984` `10b2b994` `10b2b9a4` `10b2b9b4` `10b2b9c4` `10b2b9d4` `10b2b9e4` `10b2b9f4` `10b2ba04` `10b2ba14` `10b2ba24` `10b2ba34` `10b2ba44` | `channelNumber`, `playId` |

Op-level JSON keys recovered from op-object methods: `channelNumber`, `durationSeconds`, `muse`, `playId`

## `settings`

The settings resource — 34 ops, the broadest write surface. GET reads setting values, PATCH (`updateAllSettings`) applies merged batches, PUT/POST handle per-scope writes. Scope params split player/household/user layers; PATCH is the only method used exclusively by this resource — batch updates are PATCH-shaped.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{HHID}/settings/protected-admin/{setting}` | `getProtectedAdminSettings` | `setting` | `0x20000101` | `0x10b2ba24` `0x10b2ba34` | `setting` |
| `GET` | `v1/households/{HHID}/settings/protected-admin` | `getProtectedAdminSettings` | `-` | `0x20000101` | `0x10b2ba24` `0x10b2ba34` | `setting` |
| `POST` | `v1/households/{HHID}/settings/protected-admin` | `setProtectedAdminSettings` | `-` | `0x20000102` | `0x10b2ba34` `0x10b2ba44` | `setting`, `networks`, `networks`, `sonosnetEnabled`, `sonosnetEnabled` |
| `GET` | `v1/households/{HHID}/settings/protected/{setting}` | `getProtectedSettings` | `setting` | `0x20000101` | `0x10b2ba14` `0x10b2ba24` | `setting` |
| `GET` | `v1/households/{HHID}/settings/protected` | `getProtectedSettings` | `-` | `0x20000101` | `0x10b2ba14` `0x10b2ba24` | `setting` |
| `GET` | `v1/users/{userId}/settings` | `getSettings` | `-` | `0x20000101` | `0x10b2b924` `0x10b2b934` | `namespaces`, `namespaces`, `targetSettingsOnly`, `namespaces` |
| `GET` | `v1/households/{householdId}/users/{userId}/settings` | `getSettings` | `-` | `0x20000101` | `0x10b2b924` `0x10b2b934` | `namespaces`, `namespaces`, `targetSettingsOnly`, `namespaces` |
| `GET` | `v1/players/{playerId}/settings/player` | `getPlayerSettings` | `-` | `0x20000101` | `0x10b2b934` `0x10b2b944` | `namespaces`, `namespaces`, `targetSettingsOnly`, `namespaces` |
| `GET` | `v1/households/{householdId}/players/{playerId}/settings/player` | `getPlayerSettings` | `-` | `0x20000101` | `0x10b2b934` `0x10b2b944` | `namespaces`, `namespaces`, `targetSettingsOnly`, `namespaces` |
| `POST` | `v1/players/{playerId}/settings/player` | `setPlayerSettings` | `-` | `0x20000102` | `0x10b2b944` `0x10b2b954` | `setPlayerSettings`, `setPlayerSettings` |
| `POST` | `v1/households/{householdId}/players/{playerId}/settings/player` | `setPlayerSettings` | `-` | `0x20000102` | `0x10b2b944` `0x10b2b954` | `setPlayerSettings`, `setPlayerSettings` |
| `PUT` | `v1/players/{playerId}/settings/player/voice/allowMicrophone` | `setAllowMicrophone` | `-` | `0x20000104` | `0x10b2b954` `0x10b2b964` | `setPlayerSettings`, `setPlayerSettings`, `allowMicrophone` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/settings/player/voice/allowMicrophone` | `setAllowMicrophone` | `-` | `0x20000104` | `0x10b2b954` `0x10b2b964` | `setPlayerSettings`, `setPlayerSettings`, `allowMicrophone` |
| `PUT` | `v1/players/{playerId}/settings/player` | `setSelfTruePlay` | `-` | `0x20000104` | `0x10b2b964` `0x10b2b974` | `allowMicrophone`, `selfTruePlay` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/settings/player` | `setSelfTruePlay` | `-` | `0x20000104` | `0x10b2b964` `0x10b2b974` | `allowMicrophone`, `selfTruePlay` |
| `PUT` | `v1/players/{playerId}/settings/enablePositioningMeasurement` | `setEnablePositioningMeasurement` | `-` | `0x20000104` | `0x10b2b974` `0x10b2b984` | `selfTruePlay`, `enablePositioningMeasurement` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/settings/enablePositioningMeasurement` | `setEnablePositioningMeasurement` | `-` | `0x20000104` | `0x10b2b974` `0x10b2b984` | `selfTruePlay`, `enablePositioningMeasurement` |
| `PUT` | `v1/players/{playerId}/settings/sonosNetChannel` | `setSonosNetChannel` | `-` | `0x20000104` | `0x10b2b984` `0x10b2b994` | `enablePositioningMeasurement`, `channel` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/settings/sonosNetChannel` | `setSonosNetChannel` | `-` | `0x20000104` | `0x10b2b984` `0x10b2b994` | `enablePositioningMeasurement`, `channel` |
| `GET` | `v1/players/{playerId}/settings` | `getAllSettings` | `-` | `0x20000101` | `0x10ae17a4` `0x10ae17b4` `0x10b2b994` `0x10b2b9a4` | `channel` |
| `GET` | `v1/households/{householdId}/players/{playerId}/settings` | `getAllSettings` | `-` | `0x20000101` | `0x10ae17a4` `0x10ae17b4` `0x10b2b994` `0x10b2b9a4` | `channel` |
| `GET` | `v1/players/{playerId}/settings/{groupName}` | `getSettingsGroup` | `groupName` | `0x20000101` | `0x10ae17b4` `0x10ae17c4` `0x10b2b9a4` `0x10b2b9b4` desc:`10ae4b54` `10ae4b64` | `groupName` |
| `GET` | `v1/households/{householdId}/players/{playerId}/settings/{groupName}` | `getSettingsGroup` | `groupName` | `0x20000101` | `0x10ae17b4` `0x10ae17c4` `0x10b2b9a4` `0x10b2b9b4` desc:`10ae4b54` `10ae4b64` | `groupName` |
| `PATCH` | `v1/players/{playerId}/settings` | `updateAllSettings` | `-` | `0x20000110` | `0x10ae17c4` `0x10ae17d4` `0x10b2b9b4` `0x10b2b9c4` desc:`10ae4b74` `10ae4b84` | `groupName`, `updateAllSettings`, `updateAllSettings` |
| `PATCH` | `v1/households/{householdId}/players/{playerId}/settings` | `updateAllSettings` | `-` | `0x20000110` | `0x10ae17c4` `0x10ae17d4` `0x10b2b9b4` `0x10b2b9c4` desc:`10ae4b74` `10ae4b84` | `groupName`, `updateAllSettings`, `updateAllSettings` |
| `PATCH` | `v1/players/{playerId}/settings/{groupName}` | `updateSettingsGroup` | `groupName` | `0x20000110` | `0x10ae17d4` `0x10ae17e4` `0x10b2b9c4` `0x10b2b9d4` desc:`10ae4b94` `10ae4ba4` | `updateAllSettings`, `updateAllSettings`, `groupName` |
| `PATCH` | `v1/households/{householdId}/players/{playerId}/settings/{groupName}` | `updateSettingsGroup` | `groupName` | `0x20000110` | `0x10ae17d4` `0x10ae17e4` `0x10b2b9c4` `0x10b2b9d4` desc:`10ae4b94` `10ae4ba4` | `updateAllSettings`, `updateAllSettings`, `groupName` |
| `GET` | `v1/households/{householdId}/settings/restrictedAdmin` | `getRestrictedAdminSettings` | `-` | `0x20000101` | `0x10b2b9d4` `0x10b2b9e4` | `groupName` |
| `PUT` | `v1/households/{householdId}/settings/restrictedAdmin/userMetricsTracking` | `setUserMetricsTracking` | `-` | `0x20000104` | `0x10b2b9e4` `0x10b2b9f4` | `userMetricsTracking` |
| `PUT` | `v1/households/{householdId}/settings/restrictedAdmin` | `setRestrictedAdminSettings` | `-` | `0x20000104` | `0x10b2b9f4` `0x10b2ba04` | `userMetricsTracking`, `setRestrictedAdminSettings`, `setRestrictedAdminSettings` |
| `GET` | `v1/households/{householdId}/settings/public` | `getPublicSettings` | `-` | `0x20000101` | `0x10b2ba04` `0x10b2ba14` | `setRestrictedAdminSettings`, `setRestrictedAdminSettings` |
| `GET` | `v1/households/{householdId}/settings/protected/{setting}` | `getProtectedSettings` | `setting` | `0x20000101` | `0x10b2ba14` `0x10b2ba24` | `setting` |
| `GET` | `v1/households/{householdId}/settings/protectedAdmin/{setting}` | `getProtectedAdminSettings` | `setting` | `0x20000101` | `0x10b2ba24` `0x10b2ba34` | `setting` |
| `POST` | `v1/households/{householdId}/settings/protectedAdmin` | `setProtectedAdminSettings` | `-` | `0x20000102` | `0x10b2ba34` `0x10b2ba44` | `setting`, `networks`, `networks`, `sonosnetEnabled`, `sonosnetEnabled` |

Op-level JSON keys recovered from op-object methods: `setting`, `muse`, `networks`, `sonosnetEnabled`, `sonosnet`, `namespaces`, `targetSettingsOnly`, `setPlayerSettings`, `allowMicrophone`, `selfTruePlay`, `enablePositioningMeasurement`, `channel`, `delayMillis`, `groupName`, `updateAllSettings`, `userMetricsTracking`, `setRestrictedAdminSettings`

## `sleepTimer`

Group sleep timer — set/clear/read the 'sleep in N minutes' state, the muse-side twin of the `Sleep` argument on AVTransport.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/groups/{groupId}/sleepTimer` | `configureSleepTimer` | `-` | `0x20000102` | `0x10b32b2c` `0x10b32b3c` | `duration` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/sleepTimer` | `configureSleepTimer` | `-` | `0x20000102` | `0x10b32b2c` `0x10b32b3c` | `duration` |
| `GET` | `v1/groups/{groupId}/sleepTimer` | `getSleepTimer` | `-` | `0x20000101` | `0x10b32b3c` `0x10b32b4c` desc:`10b3446c` | `duration` |
| `GET` | `v1/households/{householdId}/groups/{groupId}/sleepTimer` | `getSleepTimer` | `-` | `0x20000101` | `0x10b32b3c` `0x10b32b4c` desc:`10b3446c` | `duration` |

Op-level JSON keys recovered from op-object methods: `muse`, `duration`

## `smartplay`

SmartPlay per-household state — the update/firmware-reporting context that carries version/build fields for the smart update pipeline.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/smartplay/content` | `getContent` | `-` | `0x20000101` | `0x10b3446c` `0x10b35b38` `0x10b35b48` `0x10b37854` desc:`10b35b38` `10b35b48` | — |

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `currentVersion`, `downloadSpeed`, `fromVersion`, `hardwareVersion`, `householdId`, `requestPath`, `serialNumber`, `sonosId`, `systemVersion`, `updateId`

## `soundSwap`

Home-theater sound-swap — POSTs that move/re-assign the front player role among bonded HT members (swap the TV-facing box). Player-scoped.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/soundSwap` | `triggerSwap` | `-` | `0x20000102` | `0x10b35b38` | `playerId` |
| `POST` | `v1/households/{householdId}/players/{playerId}/soundSwap` | `triggerSwap` | `-` | `0x20000102` | `0x10b35b38` | `playerId` |
| `POST` | `v1/players/{playerId}/soundSwap/request` | `requestSwap` | `-` | `0x20000102` | `0x10b35b38` `0x10b35b48` desc:`10b37854` `10b37864` `10b37874` | `playerId`, `playbackState` |
| `POST` | `v1/households/{householdId}/players/{playerId}/soundSwap/request` | `requestSwap` | `-` | `0x20000102` | `0x10b35b38` `0x10b35b48` desc:`10b37854` `10b37864` `10b37874` | `playerId`, `playbackState` |

Op-level JSON keys recovered from op-object methods: `playerId`, `muse`, `playbackState`

## `svc`

Sonos Voice Control surface ('svc' = Sonos Voice Control) — voice-assistant status and management on voice-capable players.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/svc/weatherConfig` | `setWeatherConfig` | `-` | `0x20000102` | `0x10b37854` | `enabled`, `geoLocation`, `geoLocation` |
| `POST` | `v1/households/{householdId}/players/{playerId}/svc/weatherConfig` | `setWeatherConfig` | `-` | `0x20000102` | `0x10b37854` | `enabled`, `geoLocation`, `geoLocation` |
| `GET` | `v1/players/{playerId}/svc/weatherConfig` | `getWeatherConfig` | `-` | `0x20000101` | `0x10b37854` `0x10b37864` desc:`10b39424` | `enabled`, `geoLocation`, `geoLocation` |
| `GET` | `v1/households/{householdId}/players/{playerId}/svc/weatherConfig` | `getWeatherConfig` | `-` | `0x20000101` | `0x10b37854` `0x10b37864` desc:`10b39424` | `enabled`, `geoLocation`, `geoLocation` |
| `POST` | `v1/players/{playerId}/svc/voiceCommand` | `voiceCommand` | `-` | `0x20000102` | `0x10b37864` `0x10b37874` desc:`10b39434` | `voiceCommand` |
| `POST` | `v1/households/{householdId}/players/{playerId}/svc/voiceCommand` | `voiceCommand` | `-` | `0x20000102` | `0x10b37864` `0x10b37874` desc:`10b39434` | `voiceCommand` |

Op-level JSON keys recovered from op-object methods: `enabled`, `geoLocation`, `muse`, `voiceCommand`

## `systemReporting`

First-party telemetry/crash-report uploads — POST-only, `none`-scoped (these routes deliberately bypass household scoping so a misconfigured player can still report). Carries `systemReporting`, `zoneDefinition`, `channelMapSet`, `zones` fields plus `/accountSubscription`, `/productEvent`, `/softwareDownload` sub-paths.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/firmwareDownload` | `reportFirmwareDownload` | `-` | `0x20000102` | outbound-fwd | — |
| `POST` | `v1/households/{householdId}/systemReporting/firmwareDownload` | `reportFirmwareDownload` | `-` | `0x20000102` | outbound-fwd | — |
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/softwareDownload` | `reportSoftwareDownload` | `-` | `0x20000102` | outbound-fwd | — |
| `POST` | `v1/households/{householdId}/systemReporting/softwareDownload` | `reportSoftwareDownload` | `-` | `0x20000102` | outbound-fwd | — |
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/accountSubscription` | `reportAccountSubscription` | `-` | `0x20000102` | outbound-fwd | — |
| `POST` | `v1/households/{householdId}/systemReporting/accountSubscription` | `reportAccountSubscription` | `-` | `0x20000102` | outbound-fwd | — |
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/productEvent` | `reportProductEvent` | `-` | `0x20000102` | outbound-fwd | — |
| `POST` | `v1/households/{householdId}/systemReporting/productEvent` | `reportProductEvent` | `-` | `0x20000102` | outbound-fwd | — |

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `channelMapSet`, `name`, `zoneDefinition`

## `systemTime`

Household wall-clock/location time — GET reads the household clock state, PUT sets timezone/location-derived time used by alarms and schedules.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/systemTime/timeZone` | `getTimeZoneInfo` | `-` | `0x20000101` | `0x10b39424` desc:`10b3a534` `10b3eac4` `10b3ead4` `10b3eae4` `10b3eaf4` | — |
| `PUT` | `v1/households/{householdId}/systemTime/timeZone` | `setTimeZoneInfo` | `-` | `0x20000104` | `0x10b39424` `0x10b39434` desc:`10b3eb04` `10b3eb14` `10b3eb24` `10b3eb34` `10b3eb44` | `timeZoneInfo`, `timeZoneInfo` |

Resource implementation functions (string-block registrar family): `0x10b39454`

Field vocabulary recovered from the resource's implementation functions: `systemTime`

Op-level JSON keys recovered from op-object methods: `muse`, `timeZoneInfo`

## `time`

Player-local time reads — GETs return the player's clock/status for alarm-trigger UI.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/time/relative` | `getRelativeTime` | `-` | `0x20000101` | `0x10b39434` `0x10b3a534` `0x10b3eac4` `0x10b3ead4` `0x10b3eae4` `0x10b3eaf4` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/time/relative` | `getRelativeTime` | `-` | `0x20000101` | `0x10b39434` `0x10b3a534` `0x10b3eac4` `0x10b3ead4` `0x10b3eae4` `0x10b3eaf4` | — |

Resource implementation functions (string-block registrar family): `0x10b3a554`, `0x101827e4`

Field vocabulary recovered from the resource's implementation functions: `time`, `ath1`, `md`, `sm`, `satSwitch`, `wifi`, `hardware`, `satsw`, `suid`, `cn`, `td`, `d3`, `l1`, `l2`, `l3`, `lmNeighbor`, `lmrep`

Implementation messages:

- `Error %d from uploadSatSwitchTimeReport`
- `Error expected no more than %d entries, got %d`
- `Error %d from WifiFuncsGetLmChangeStats`
- `%d`
- `%u`

## `timers`

Household/group timers — the scheduler behind alarms and sleep timers, backed by the SQLite `timers`/`paused_timers` tables.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/timers` | `getTimers` | `-` | `0x20000101` | `0x10b3ead4` `0x10b3eae4` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/timers` | `getTimers` | `-` | `0x20000101` | `0x10b3ead4` `0x10b3eae4` | — |
| `POST` | `v1/players/{playerId}/timers/create` | `createTimer` | `-` | `0x20000102` | `0x10b3eae4` `0x10b3eaf4` | `name`, `duration`, `duration` |
| `POST` | `v1/households/{householdId}/players/{playerId}/timers/create` | `createTimer` | `-` | `0x20000102` | `0x10b3eae4` `0x10b3eaf4` | `name`, `duration`, `duration` |
| `PUT` | `v1/players/{playerId}/timers/setDuration/{timerId}` | `setDuration` | `timerId` | `0x20000104` | `0x10b3eaf4` `0x10b3eb04` | `name`, `duration`, `duration`, `timerId` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/timers/setDuration/{timerId}` | `setDuration` | `timerId` | `0x20000104` | `0x10b3eaf4` `0x10b3eb04` | `name`, `duration`, `duration`, `timerId` |
| `PUT` | `v1/players/{playerId}/timers/setRelativeDuration/{timerId}` | `setRelativeDuration` | `timerId` | `0x20000104` | `0x10b3eb04` `0x10b3eb14` | `timerId`, `duration`, `duration` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/timers/setRelativeDuration/{timerId}` | `setRelativeDuration` | `timerId` | `0x20000104` | `0x10b3eb04` `0x10b3eb14` | `timerId`, `duration`, `duration` |
| `PUT` | `v1/players/{playerId}/timers/pause/{timerId}` | `pauseTimer` | `timerId` | `0x20000104` | `0x10b3eb14` `0x10b3eb24` | `timerId`, `duration`, `duration` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/timers/pause/{timerId}` | `pauseTimer` | `timerId` | `0x20000104` | `0x10b3eb14` `0x10b3eb24` | `timerId`, `duration`, `duration` |
| `PUT` | `v1/players/{playerId}/timers/resume/{timerId}` | `resumeTimer` | `timerId` | `0x20000104` | `0x10b3eb24` `0x10b3eb34` | `timerId` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/timers/resume/{timerId}` | `resumeTimer` | `timerId` | `0x20000104` | `0x10b3eb24` `0x10b3eb34` | `timerId` |
| `DELETE` | `v1/players/{playerId}/timers/{timerId}` | `abortTimer` | `timerId` | `0x20000108` | `0x10b3eb34` `0x10b3eb44` | `timerId` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/timers/{timerId}` | `abortTimer` | `timerId` | `0x20000108` | `0x10b3eb34` `0x10b3eb44` | `timerId` |

Op-level JSON keys recovered from op-object methods: `muse`, `name`, `duration`, `timerId`

## `trueplay`

Trueplay room-tuning ops — start/update/query a tuning run on a home-theater player, tied to the `x-rincon-sonarcal` test-tone pipeline.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/trueplay/discovery` | `detectSpeakers` | `-` | `0x20000101` | `0x10b44644` `0x10b44654` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueplay/discovery` | `detectSpeakers` | `-` | `0x20000101` | `0x10b44644` `0x10b44654` | — |
| `GET` | `v1/players/{playerId}/trueplay/presenceDiscovery` | `detectSpeakerPresence` | `-` | `0x20000101` | `0x10b44654` `0x10b44664` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueplay/presenceDiscovery` | `detectSpeakerPresence` | `-` | `0x20000101` | `0x10b44654` `0x10b44664` | — |
| `DELETE` | `v1/players/{playerId}/trueplay/discovery` | `resetDetectedSpeaker` | `-` | `0x20000108` | `0x10b44664` `0x10b44674` | — |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/trueplay/discovery` | `resetDetectedSpeaker` | `-` | `0x20000108` | `0x10b44664` `0x10b44674` | — |
| `POST` | `v1/players/{playerId}/trueplay/presenceRate` | `setSpeakerPresenceRate` | `-` | `0x20000102` | `0x10b44674` `0x10b44684` | `duration`, `rate` |
| `POST` | `v1/households/{householdId}/players/{playerId}/trueplay/presenceRate` | `setSpeakerPresenceRate` | `-` | `0x20000102` | `0x10b44674` `0x10b44684` | `duration`, `rate` |
| `GET` | `v1/players/{playerId}/trueplay/config/{id}` | `getConfiguration` | `id` | `0x20000101` | `0x10b44684` `0x10b44694` | `duration`, `rate`, `id` |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueplay/config/{id}` | `getConfiguration` | `id` | `0x20000101` | `0x10b44684` `0x10b44694` | `duration`, `rate`, `id` |
| `POST` | `v1/players/{playerId}/trueplay/config/{id}` | `setConfiguration` | `id` | `0x20000102` | `0x10b44694` `0x10b446a4` | `id`, `trueplayConfig`, `trueplayConfig` |
| `POST` | `v1/households/{householdId}/players/{playerId}/trueplay/config/{id}` | `setConfiguration` | `id` | `0x20000102` | `0x10b44694` `0x10b446a4` | `id`, `trueplayConfig`, `trueplayConfig` |
| `GET` | `v1/players/{playerId}/trueplay/status` | `getTrueplayStatus` | `-` | `0x20000101` | `0x10b446a4` `0x10b446b4` | `id`, `trueplayConfig`, `trueplayConfig` |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueplay/status` | `getTrueplayStatus` | `-` | `0x20000101` | `0x10b446a4` `0x10b446b4` | `id`, `trueplayConfig`, `trueplayConfig` |

Related enum registrations (proven integer values — see `enum_tables`):

- **measurement_type**: `NONE`=1, `SESSION_RESULTS`=2, `MEASUREMENT_RESULTS`=3, `MEASUREMENT_RAW_AUDIO`=4
- **positioning_measure**: `ANGLE`=1, `BEARING`=2, `DISTANCE`=3, `MAP`=4, `ACOUSTIC_SPACE_MAP`=5, `PORTABLE_SURROUNDS`=6
- **room_detect_state**: `INAUDIBLE`=1, `MULTI_INAUDIBLE`=2, `INAUDIBLE_WIDE`=3, `MULTI_INAUDIBLE_WIDE`=4, `AUDIBLE`=5, `MULTI_AUDIBLE`=6, `BLE`=7

Op-level JSON keys recovered from op-object methods: `muse`, `duration`, `rate`, `id`, `trueplayConfig`

## `trueroom`

Trueroom adaptive tuning — the successor to one-shot Trueplay: `estimatorConfiguration`, `adaptation`, `calibrationStatus`, `swapInputMute`. POSTs run the continuous-tuning estimator and query its adaptation state.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/trueroom/estimatorConfiguration` | `estimatorConfiguration` | `-` | `0x20000101` | `0x10b4911c` `0x10b4912c` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueroom/estimatorConfiguration` | `estimatorConfiguration` | `-` | `0x20000101` | `0x10b4911c` `0x10b4912c` | — |
| `POST` | `v1/players/{playerId}/trueroom/adaptation` | `adaptation` | `-` | `0x20000102` | `0x10b4912c` `0x10b4913c` | `trueroomEstimatedParams` |
| `POST` | `v1/households/{householdId}/players/{playerId}/trueroom/adaptation` | `adaptation` | `-` | `0x20000102` | `0x10b4912c` `0x10b4913c` | `trueroomEstimatedParams` |
| `GET` | `v1/players/{playerId}/trueroom/calibrationStatus` | `getCalibrationStatus` | `-` | `0x20000101` | `0x10b4913c` `0x10b4914c` | `trueroomEstimatedParams` |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueroom/calibrationStatus` | `getCalibrationStatus` | `-` | `0x20000101` | `0x10b4913c` `0x10b4914c` | `trueroomEstimatedParams` |
| `POST` | `v1/players/{playerId}/trueroom/successTone` | `playSuccessTone` | `-` | `0x20000102` | `0x10b4914c` `0x10b4915c` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/trueroom/successTone` | `playSuccessTone` | `-` | `0x20000102` | `0x10b4914c` `0x10b4915c` | — |
| `POST` | `v1/players/{playerId}/trueroom/swapInputMute` | `setSwapInputMute` | `-` | `0x20000102` | `0x10b4915c` `0x10b4916c` | `mute` |
| `POST` | `v1/households/{householdId}/players/{playerId}/trueroom/swapInputMute` | `setSwapInputMute` | `-` | `0x20000102` | `0x10b4915c` `0x10b4916c` | `mute` |

Op-level JSON keys recovered from op-object methods: `muse`, `trueroomEstimatedParams`, `mute`

## `update`

Household software update — check, schedule, and apply firmware across the household.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/update/check` | `checkForUpdate` | `-` | `0x20000102` | `0x10b4cbb0` `0x10b4cbc0` | `useCachedOnly`, `updateType` |
| `POST` | `v1/households/{householdId}/players/{playerId}/update/check` | `checkForUpdate` | `-` | `0x20000102` | `0x10b4cbb0` `0x10b4cbc0` | `useCachedOnly`, `updateType` |
| `POST` | `v1/players/{playerId}/update/firmware` | `beginSoftwareUpdate` | `-` | `0x20000102` | `0x10b4cbc0` `0x10b4cbd0` | `useCachedOnly`, `updateType`, `assertion` |
| `POST` | `v1/households/{householdId}/players/{playerId}/update/firmware` | `beginSoftwareUpdate` | `-` | `0x20000102` | `0x10b4cbc0` `0x10b4cbd0` | `useCachedOnly`, `updateType`, `assertion` |
| `GET` | `v1/players/{playerId}/update/status` | `getUpdateStatus` | `-` | `0x20000101` | `0x10b4cbd0` `0x10b4cbe0` | `assertion` |
| `GET` | `v1/households/{householdId}/players/{playerId}/update/status` | `getUpdateStatus` | `-` | `0x20000101` | `0x10b4cbd0` `0x10b4cbe0` | `assertion` |

Op-level JSON keys recovered from op-object methods: `muse`, `useCachedOnly`, `updateType`, `assertion`

## `upnpAVTransport`

The SOAP AVTransport service exposed over muse — every route proxies a UPnP action (subscribe/get) so the modern app can drive transport through the same mux as everything else. Field names and semantics are exactly the SOAP arguments.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpAVTransport` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAVTransport` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpAVTransport/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAVTransport/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpAVTransport/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAVTransport/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpAVTransport/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpAVTransport/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpAlarmClock`

SOAP AlarmClock over muse — list/create/update/delete alarms via the mux.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpAlarmClock` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAlarmClock` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpAlarmClock/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAlarmClock/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpAlarmClock/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAlarmClock/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpAlarmClock/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpAlarmClock/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpAudioIn`

SOAP AudioIn over muse — line-in source config/state.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpAudioIn` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAudioIn` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpAudioIn/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAudioIn/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpAudioIn/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAudioIn/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpAudioIn/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpAudioIn/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpConnectionManager`

SOAP ConnectionManager over muse — protocol-info listing.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpConnectionManager` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpConnectionManager` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpConnectionManager/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpConnectionManager/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpConnectionManager/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpConnectionManager/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpConnectionManager/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpConnectionManager/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpContentDirectory`

SOAP ContentDirectory over muse — browse/search/containers.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpContentDirectory` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpContentDirectory` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpContentDirectory/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpContentDirectory/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpContentDirectory/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpContentDirectory/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpContentDirectory/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpContentDirectory/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpDeviceProperties`

SOAP DeviceProperties over muse — device attributes/settings.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpDeviceProperties` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpDeviceProperties` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpDeviceProperties/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpDeviceProperties/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpDeviceProperties/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpDeviceProperties/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpDeviceProperties/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpDeviceProperties/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpGroupManagement`

SOAP GroupManagement over muse — group coordinator ops.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpGroupManagement` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupManagement` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpGroupManagement/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupManagement/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpGroupManagement/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupManagement/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpGroupManagement/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpGroupManagement/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpGroupRenderingControl`

SOAP GroupRenderingControl over muse — group volume/mute.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpGroupRenderingControl` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupRenderingControl` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpGroupRenderingControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupRenderingControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpGroupRenderingControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupRenderingControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpGroupRenderingControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpGroupRenderingControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpHTControl`

SOAP HTControl over muse — home-theater control.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpHTControl` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpHTControl` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpHTControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpHTControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpHTControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpHTControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpHTControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpHTControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpMusicServices`

SOAP MusicServices over muse — SMAPI account listing.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpMusicServices` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpMusicServices` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpMusicServices/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpMusicServices/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpMusicServices/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpMusicServices/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpMusicServices/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpMusicServices/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpQueue`

SOAP Queue over muse — queue browse/ops.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpQueue` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpQueue` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpQueue/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpQueue/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpQueue/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpQueue/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpQueue/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpQueue/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpRenderingControl`

SOAP RenderingControl over muse — per-player volume/EQ.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpRenderingControl` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpRenderingControl` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpRenderingControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpRenderingControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpRenderingControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpRenderingControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpRenderingControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpRenderingControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpSystemProperties`

SOAP SystemProperties over muse — system keys.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpSystemProperties` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpSystemProperties` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpSystemProperties/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpSystemProperties/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpSystemProperties/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpSystemProperties/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpSystemProperties/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpSystemProperties/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpVirtualLineIn`

SOAP VirtualLineIn over muse — virtual line-in sources.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpVirtualLineIn` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpVirtualLineIn` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpVirtualLineIn/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpVirtualLineIn/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpVirtualLineIn/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpVirtualLineIn/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpVirtualLineIn/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpVirtualLineIn/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

## `upnpZoneGroupTopology`

SOAP ZoneGroupTopology over muse — topology state/subscription.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpZoneGroupTopology` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpZoneGroupTopology` | `call` | `-` | `0x20000102` | `0x10b503f4` `0x10b539fc` `0x10b57008` `0x10b5a610` `0x10b5dc20` `0x10b61228` `0x10b64830` `0x10b67e38` `0x10b6b440` `0x10b6ea48` `0x10b72060` `0x10b75688` `0x10b78c98` `0x10b7c2a0` `0x10b7f8a8` | `headers`, `headers`, `method`, `input`, `input` |
| `POST` | `v1/players/{playerId}/upnpZoneGroupTopology/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpZoneGroupTopology/subscription` | `subscribe` | `-` | `0x20000102` | `0x101c0730` `0x101c754c` `0x101cc9c0` `0x101d4ca4` `0x101de914` `0x101ea524` `0x101f1738` `0x101fce88` `0x1020598c` `0x10ac7824` `0x10acc494` `0x10ad0368` `0x10ad88f8` `0x10addc14` `0x10ae1794` `0x10ae4b54` `0x10ae4b64` `0x10ae9208` `0x10aec758` `0x10aefcb4` `0x10af58e0` `0x10afb934` `0x10b01a9c` `0x10b0f748` `0x10b12e68` `0x10b1b2bc` `0x10b2b8f4` `0x10b32b1c` `0x10b3eac4` `0x10b44634` `0x10b4910c` `0x10b4cba0` `0x10b503f4` `0x10b50404` `0x10b539fc` `0x10b53a0c` `0x10b57008` `0x10b57018` `0x10b5a610` `0x10b5a620` `0x10b5dc20` `0x10b5dc30` `0x10b61228` `0x10b61238` `0x10b64830` `0x10b64840` `0x10b67e38` `0x10b67e48` `0x10b6b440` `0x10b6b450` `0x10b6ea48` `0x10b6ea58` `0x10b72060` `0x10b72070` `0x10b75688` `0x10b75698` `0x10b78c98` `0x10b78ca8` `0x10b7c2a0` `0x10b7c2b0` `0x10b7f8a8` `0x10b7f8b8` `0x10b89500` `0x10b89510` `0x10b92fe0` | `headers`, `headers`, `method`, `input`, `input`, `durationSecs`, `service` |
| `POST` | `v1/players/{playerId}/upnpZoneGroupTopology/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpZoneGroupTopology/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b50404` `0x10b50414` `0x10b53a0c` `0x10b53a1c` `0x10b57018` `0x10b57028` `0x10b5a620` `0x10b5a630` `0x10b5dc30` `0x10b5dc40` `0x10b61238` `0x10b61248` `0x10b64840` `0x10b64850` `0x10b67e48` `0x10b67e58` `0x10b6b450` `0x10b6b460` `0x10b6ea58` `0x10b6ea68` `0x10b72070` `0x10b72080` `0x10b75698` `0x10b756a8` `0x10b78ca8` `0x10b78cb8` `0x10b7c2b0` `0x10b7c2c0` `0x10b7f8b8` `0x10b7f8c8` desc:`10b539fc` `10b53a0c` `10b53a1c` `10b53a2c` `10b57008` `10b57018` `10b57028` `10b57038` `10b5a610` `10b5a620` `10b5a630` `10b5a640` `10b5dc20` `10b5dc30` `10b5dc40` `10b5dc50` `10b61228` `10b61238` `10b61248` `10b61258` `10b64830` `10b64840` `10b64850` `10b64860` `10b67e38` `10b67e48` `10b67e58` `10b67e68` `10b6b440` `10b6b450` `10b6b460` `10b6b470` `10b6ea48` `10b6ea58` `10b6ea68` `10b6ea78` `10b72060` `10b72070` `10b72080` `10b72090` `10b75688` `10b75698` `10b756a8` `10b756b8` `10b78c98` `10b78ca8` `10b78cb8` `10b78cc8` `10b7c2a0` `10b7c2b0` `10b7c2c0` `10b7c2d0` `10b7f8a8` `10b7f8b8` `10b7f8c8` `10b7f8d8` `10b82f68` `10b82f78` `10b82f88` `10b82f98` `10b82fa8` `10b82fb8` `10b8541c` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/players/{playerId}/upnpZoneGroupTopology/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpZoneGroupTopology/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x101c0730` `0x101c0740` `0x101c754c` `0x101c755c` `0x101cc9c0` `0x101cc9d0` `0x101d4ca4` `0x101d4cb4` `0x101de914` `0x101de924` `0x101ea524` `0x101ea534` `0x101f1738` `0x101f1748` `0x101fce88` `0x101fce98` `0x1020598c` `0x1020599c` `0x10ac7824` `0x10ac7834` `0x10acc494` `0x10acc4a4` `0x10ad0368` `0x10ad0378` `0x10ad88f8` `0x10ad8908` `0x10addc14` `0x10addc24` `0x10ae1794` `0x10ae17a4` `0x10ae4b74` `0x10ae4b84` `0x10ae9208` `0x10ae9218` `0x10aec758` `0x10aec768` `0x10aefcb4` `0x10aefcc4` `0x10af58e0` `0x10af58f0` `0x10afb934` `0x10afb944` `0x10b01a9c` `0x10b01aac` `0x10b0f748` `0x10b0f758` `0x10b12e68` `0x10b12e78` `0x10b1b2bc` `0x10b1b2cc` `0x10b2b8f4` `0x10b2b904` `0x10b32b1c` `0x10b32b2c` `0x10b3eac4` `0x10b3ead4` `0x10b44634` `0x10b44644` `0x10b4910c` `0x10b4911c` `0x10b4cba0` `0x10b4cbb0` `0x10b50414` `0x10b50424` `0x10b53a1c` `0x10b53a2c` `0x10b57028` `0x10b57038` `0x10b5a630` `0x10b5a640` `0x10b5dc40` `0x10b5dc50` `0x10b61248` `0x10b61258` `0x10b64850` `0x10b64860` `0x10b67e58` `0x10b67e68` `0x10b6b460` `0x10b6b470` `0x10b6ea68` `0x10b6ea78` `0x10b72080` `0x10b72090` `0x10b756a8` `0x10b756b8` `0x10b78cb8` `0x10b78cc8` `0x10b7c2c0` `0x10b7c2d0` `0x10b7f8c8` `0x10b7f8d8` `0x10b89510` `0x10b89520` `0x10b92fe0` `0x10b92ff0` | `durationSecs`, `logicalSID` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `muse`, `durationSecs`, `service`, `logicalSID`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `query:includeDeviceInfo`

## `virtualLineIn`

Native muse virtual-line-in surface (distinct from the upnp* proxy): configure/manage virtual line-in sources for a player.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/virtualLineIn/selectSource` | `selectSource` | `-` | `0x20000102` | `0x10b82f68` | `source` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/selectSource` | `selectSource` | `-` | `0x20000102` | `0x10b82f68` | `source` |
| `POST` | `v1/players/{playerId}/virtualLineIn/startTransmission` | `startTransmission` | `-` | `0x20000102` | `0x10b82f68` `0x10b82f78` | `source` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/startTransmission` | `startTransmission` | `-` | `0x20000102` | `0x10b82f68` `0x10b82f78` | `source` |
| `POST` | `v1/players/{playerId}/virtualLineIn/stopTransmission` | `stopTransmission` | `-` | `0x20000102` | `0x10b82f78` `0x10b82f88` | `source` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/stopTransmission` | `stopTransmission` | `-` | `0x20000102` | `0x10b82f78` `0x10b82f88` | `source` |
| `POST` | `v1/players/{playerId}/virtualLineIn/sendBackChannelCmd` | `sendBackChannelCmd` | `-` | `0x20000102` | `0x10b82f88` `0x10b82f98` | `source`, `backChannelCmd` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/sendBackChannelCmd` | `sendBackChannelCmd` | `-` | `0x20000102` | `0x10b82f88` `0x10b82f98` | `source`, `backChannelCmd` |
| `POST` | `v1/players/{playerId}/virtualLineIn/startAudio` | `startAudio` | `-` | `0x20000102` | `0x10b82f98` `0x10b82fa8` | `backChannelCmd` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/startAudio` | `startAudio` | `-` | `0x20000102` | `0x10b82f98` `0x10b82fa8` | `backChannelCmd` |
| `POST` | `v1/players/{playerId}/virtualLineIn/stopAudio` | `stopAudio` | `-` | `0x20000102` | `0x10b82fa8` `0x10b82fb8` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/stopAudio` | `stopAudio` | `-` | `0x20000102` | `0x10b82fa8` `0x10b82fb8` | — |

Related enum registrations (proven integer values — see `enum_tables`):

- **abort_reasons**: `NONE`=1, `ABORT_UNRECOGNIZED_OP`=2, `ABORT_INCORRECT_MODE`=3, `ABORT_NO_SOURCE`=4, `ABORT_INVALID_OP`=5, `ABORT_REFUSED`=6, `ABORT_UNDETERMINED`=7, `DEVICE`=8, `NACK`=9, `REPLY_TIMEOUT`=10, `ROOT_INDIRECT`=11, `BROADCAST_BLOCKED`=12, `UNKNOWN`=13
- **linein_conn_state**: `NO_CONNECTION`=1, `CONNECTED`=2, `SONGLE`=3, `UNKNOWN`=4

Op-level JSON keys recovered from op-object methods: `source`, `muse`, `backChannelCmd`

## `virtualRemoteControl`

Virtual remote — send remote-button events to a player through muse (related to `pinewood` but button-event oriented).

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/virtualRemoteControl/buttonCommand` | `sendButtonCommand` | `-` | `0x20000102` | `0x10b8541c` `0x10b894b0` `0x10b894c0` `0x10b894d0` `0x10b894e0` desc:`10b894b0` `10b894c0` `10b894d0` `10b894e0` `10b894f0` `10b89500` `10b89510` `10b89520` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualRemoteControl/buttonCommand` | `sendButtonCommand` | `-` | `0x20000102` | `0x10b8541c` `0x10b894b0` `0x10b894c0` `0x10b894d0` `0x10b894e0` desc:`10b894b0` `10b894c0` `10b894d0` `10b894e0` `10b894f0` `10b89500` `10b89510` `10b89520` | — |

Resource implementation functions (string-block registrar family): `0x10b85458`

Field vocabulary recovered from the resource's implementation functions: `virtualRemoteControl`

Related enum registrations (proven integer values — see `enum_tables`):

- **dpad_directions**: `UP`=1, `DOWN`=2, `LEFT`=3, `RIGHT`=4, `SELECT`=5
- **remote_buttons**: `POWER`=1, `BACK`=2, `HOME`=3, `MENU`=4, `PLAY_PAUSE`=5, `MUSIC`=6, `DPAD_UP`=7, `DPAD_DOWN`=8, `DPAD_LEFT`=9, `DPAD_RIGHT`=10, `DPAD_SELECT`=11
- **vrc_event_source**: `HEALTHCHECK`=1, `SERVER`=2, `USER`=3, `SNF`=4, `FEEDBACK`=5, `EXTRALOCAL`=6
- **vrc_state**: `CLOSED`=1, `ERROR`=2, `INIT`=3, `OFFLINE`=4, `CONFIGURING`=5, `NO_LOGICAL_ADDRESS`=6, `READY`=7

## `voice`

Voice assistant integration state — assistant enablement/locale on voice players.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/voice/accounts` | `getVoiceAccounts` | `-` | `0x20000101` | `0x10b894b0` desc:`10b92fe0` `10b92ff0` `10b93000` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/voice/accounts` | `getVoiceAccounts` | `-` | `0x20000101` | `0x10b894b0` desc:`10b92fe0` `10b92ff0` `10b93000` | — |
| `POST` | `v1/players/{playerId}/voice/accounts` | `createVoiceAccount` | `-` | `0x20000102` | `0x10b894b0` `0x10b894c0` | `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `wakeword`, `wakeword` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/accounts` | `createVoiceAccount` | `-` | `0x20000102` | `0x10b894b0` `0x10b894c0` | `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `wakeword`, `wakeword` |
| `POST` | `v1/players/{playerId}/voice/accounts/{accountId}` | `updateVoiceAccount` | `accountId` | `0x20000102` | `0x10b894c0` `0x10b894d0` desc:`10b93010` `10b93020` `10b93030` | `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `wakeword`, `wakeword`, `accountId` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/accounts/{accountId}` | `updateVoiceAccount` | `accountId` | `0x20000102` | `0x10b894c0` `0x10b894d0` desc:`10b93010` `10b93020` `10b93030` | `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `wakeword`, `wakeword`, `accountId` |
| `DELETE` | `v1/players/{playerId}/voice/accounts/{accountId}` | `removeVoiceAccount` | `accountId` | `0x20000108` | `0x10b894d0` `0x10b894e0` desc:`10b93040` `10b93050` `10b93060` | `allowVoiceDataCollection`, `accountId`, `wakeword`, `wakeword` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/voice/accounts/{accountId}` | `removeVoiceAccount` | `accountId` | `0x20000108` | `0x10b894d0` `0x10b894e0` desc:`10b93040` `10b93050` `10b93060` | `allowVoiceDataCollection`, `accountId`, `wakeword`, `wakeword` |
| `POST` | `v1/players/{playerId}/voice/amazonChallenge` | `createAmazonChallenge` | `-` | `0x20000102` | `0x10b894e0` `0x10b894f0` desc:`10b93070` `10b93080` `10b93090` | `accountId` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/amazonChallenge` | `createAmazonChallenge` | `-` | `0x20000102` | `0x10b894e0` `0x10b894f0` desc:`10b93070` `10b93080` `10b93090` | `accountId` |
| `POST` | `v1/players/{playerId}/voice/setup` | `notifyInitiateOnboarding` | `-` | `0x20000102` | `0x10b894f0` `0x10b89500` desc:`10b930a0` `10b930b0` `10b930c0` | `service` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/setup` | `notifyInitiateOnboarding` | `-` | `0x20000102` | `0x10b894f0` `0x10b89500` desc:`10b930a0` `10b930b0` `10b930c0` | `service` |

Op-level JSON keys recovered from op-object methods: `muse`, `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `nickname`, `status`, `wakeword`, `amazon`, `accountId`

## `zones`

Zone listing for a household — the zone view of topology (players + groups as user-facing zones). NOTE: the extracted field vocabulary for this resource over-captured into the binary's error-string region, so its field list is not a clean schema — treat ops/paths as proven and field names as noisy.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params |
|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/zones` | `getActiveZoneList` | `-` | `0x20000101` | `0x10b92ff0` `0x10b93000` | — |
| `GET` | `v1/households/{householdId}/zones/definition/{zoneId}` | `getZoneDefinition` | `zoneId` | `0x20000101` | `0x10b93000` `0x10b93010` | `zoneId` |
| `GET` | `v1/households/{householdId}/zones/definition` | `getZoneDefinitionList` | `-` | `0x20000101` | `0x10b93010` `0x10b93020` | `zoneId` |
| `POST` | `v1/households/{householdId}/zones/definition` | `addZoneDefinition` | `-` | `0x20000102` | `0x10b93020` `0x10b93030` | `channelMapSet`, `channelMapSet`, `name`, `channelMapSet`, `channelMapSet` |
| `POST` | `v1/households/{householdId}/zones/missingDefinition` | `addMissingZoneDefinition` | `-` | `0x20000102` | `0x10b93030` `0x10b93040` | `channelMapSet`, `channelMapSet`, `name`, `channelMapSet`, `channelMapSet`, `zoneDefinition`, `zoneDefinition` |
| `PUT` | `v1/households/{householdId}/zones/definition/{zoneId}` | `updateZoneDefinition` | `zoneId` | `0x20000104` | `0x10b93040` `0x10b93050` | `zoneDefinition`, `zoneDefinition`, `channelMapSet`, `channelMapSet`, `zoneId`, `channelMapSet`, `channelMapSet` |
| `PUT` | `v1/households/{householdId}/zones/activeZone/{zoneId}` | `updateActiveZone` | `zoneId` | `0x20000104` | `0x10b93050` `0x10b93060` | `channelMapSet`, `channelMapSet`, `zoneId`, `channelMapSet`, `channelMapSet` |
| `PUT` | `v1/households/{householdId}/zones/memberSettings/{zoneId}` | `updateZoneMemberSettings` | `zoneId` | `0x20000104` | `0x10b93060` `0x10b93070` | `channelMapSet`, `channelMapSet`, `zoneId`, `channelMapSet`, `channelMapSet`, `settings`, `settings`, `settings`, `settings` |
| `DELETE` | `v1/households/{householdId}/zones/definition/{zoneId}` | `removeZoneDefinition` | `zoneId` | `0x20000108` | `0x10b93070` `0x10b93080` | `settings`, `settings`, `zoneId`, `settings`, `settings` |
| `PUT` | `v1/households/{householdId}/zones/activate/{zoneId}` | `activateZone` | `zoneId` | `0x20000104` | `0x10b93080` `0x10b93090` | `zoneId` |
| `PUT` | `v1/households/{householdId}/zones/deactivate/{zoneId}` | `deactivateZone` | `zoneId` | `0x20000104` | `0x10b93090` `0x10b930a0` | `zoneId` |
| `PUT` | `v1/players/{playerId}/zones/join/{zoneId}` | `joinZone` | `zoneId` | `0x20000104` | `0x10b930a0` `0x10b930b0` | `zoneId`, `isHomeTheater`, `fronthaulChannel` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/zones/join/{zoneId}` | `joinZone` | `zoneId` | `0x20000104` | `0x10b930a0` `0x10b930b0` | `zoneId`, `isHomeTheater`, `fronthaulChannel` |
| `PUT` | `v1/players/{playerId}/zones/unjoin/{zoneId}` | `unjoinZone` | `zoneId` | `0x20000104` | `0x10b930b0` `0x10b930c0` | `isHomeTheater`, `fronthaulChannel`, `zoneId` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/zones/unjoin/{zoneId}` | `unjoinZone` | `zoneId` | `0x20000104` | `0x10b930b0` `0x10b930c0` | `isHomeTheater`, `fronthaulChannel`, `zoneId` |

Related enum registrations (proven integer values — see `enum_tables`):

- **compression_level**: `OFF`=1, `LOW`=2, `DEFAULT`=3, `MAX`=4
- **zone_availability**: `UNDEFINED`=1, `ENABLED_AVAILABLE`=2, `ENABLED_UNAVAILABLE`=3, `DISABLED_AVAILABLE`=4, `DISABLED_UNAVAILABLE`=5, `SECONDARY_STATE_IGNORED_BY_CR`=6

Op-level JSON keys recovered from op-object methods: `muse`, `zoneId`, `channelMapSet`, `name`, `zoneDefinition`, `settings`, `isHomeTheater`, `fronthaulChannel`, `backhaulChannel`, `flatChannelMapSet`


<details><summary>Evidence (5)</summary>

- @ 0x10e7a68c — route record array head (householdId dialect)
- @ 0x10e783f8 — route record array head ({HHID} dialect)
- @ 0x100d36c0 — handler stub r8=0 -> f_100d2e18
- @ 0x100d36e4 — handler stub r8=1 -> f_100d2e18
- @ 0x100d2e18 — request normalizer + dispatcher

</details>
