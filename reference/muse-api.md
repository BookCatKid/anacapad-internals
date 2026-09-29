# muse API (v1)

The household/player REST API the official app and cloud channel drive — recovered from the binary's route registration tables, not from public docs.

the complete muse route registration table recovered from rodata: 603 route records across 67 resources / 332 distinct operations. Each record is 24 bytes {path_template*, flags, 0, handler*, 0, csv_descriptor*}. The csv descriptor 'scope,resource,verb\[,subparam\]' names the operation; the path template carries {param} bindings. Most ops exist twice: unscoped (v1/players/{playerId}/...) and household-scoped (v1/households/{householdId}/players/{playerId}/...).

**flags decode:** flags low byte = HTTP method bitmask: 0x01 GET, 0x02 POST, 0x04 PUT, 0x08 DELETE, 0x10 PATCH (settings-only). Bit 0x100 set = household/settings-class routes; clear (0x2000000x) = playback/volume-class (playback, groupVolume, playerVolume, playbackMetadata). 0x20000000 = muse marker bit on all records.

**dispatch:** two stubs only: f_100d36c0 (r8=0) serves 332 records, f_100d36e4 (r8=1) 271; both tail-call f_100d2e18 which normalizes the request into a 0x2a00-byte context (header/flag block at +0x416.., buf +0x2594) and dispatches on the parsed csv op name. r6==NULL fast-path returns 0.

Registration arrays: `primary` — 0x10e7a68c.. (householdId dialect incl. protectedAdmin); `secondary` — 0x10e783f8.. ({HHID} dialect incl. protected-admin)

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

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/alarms` | `getAlarms` | `-` | `0x20000101` | `0x10ac7d9c` |
| `GET` | `v1/households/{householdId}/alarms/{alarmId}` | `fetchAlarm` | `alarmId` | `0x20000101` | `0x10ac9af8` |
| `POST` | `v1/households/{householdId}/alarms` | `createAlarm` | `-` | `0x20000102` | `0x10ac9af8` |
| `PUT` | `v1/households/{householdId}/alarms/{alarmId}` | `updateAlarm` | `alarmId` | `0x20000104` | `0x10ac8368` |
| `POST` | `v1/groups/{groupId}/alarms/snooze` | `snoozeAlarm` | `-` | `0x20000102` | `0x10ac8368` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/alarms/snooze` | `snoozeAlarm` | `-` | `0x20000102` | `0x10ac8368` |
| `DELETE` | `v1/households/{householdId}/alarms/{alarmId}` | `removeAlarm` | `alarmId` | `0x20000108` | `0x10ac894c` |

Op-level JSON keys recovered from op-object methods: `alarmId`, `enabled`, `description`, `duration`

## `areas`

Household areas (the multi-room 'spaces' concept used by newer app surfaces). Ops create, update, list and delete named areas under a household. Separate from zone groups — an area is a user-facing organizational container, not an active playback group.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/areas` | `getAreas` | `-` | `0x20000101` | `0x10acc778` |
| `POST` | `v1/households/{householdId}/areas` | `createArea` | `-` | `0x20000102` | `0x10accf5c` |
| `PUT` | `v1/households/{householdId}/areas/{areaId}` | `updateArea` | `areaId` | `0x20000104` | `0x10accd10` |
| `DELETE` | `v1/households/{householdId}/areas/{areaId}` | `removeArea` | `areaId` | `0x20000108` | `0x10accd10` |

Op-level JSON keys recovered from op-object methods: `playerIds`, `name`, `areaId`

## `audioClip`

The doorbell/chime audio-clip feature. A client uploads or registers a short audio clip on a player and later triggers it (used by the doorbell button chimes). POST-only write surface with delete; clips are player-scoped.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/audioClip` | `loadAudioClip` | `-` | `0x20000102` | `0x10ad1198` |
| `POST` | `v1/households/{householdId}/players/{playerId}/audioClip` | `loadAudioClip` | `-` | `0x20000102` | `0x10ad1198` |
| `DELETE` | `v1/players/{playerId}/audioClip/{id}` | `cancelAudioClip` | `id` | `0x20000108` | `0x10ad1198` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/audioClip/{id}` | `cancelAudioClip` | `id` | `0x20000108` | `0x10ad1198` |

Op-level JSON keys recovered from op-object methods: `clipBehavior`, `volume`, `volumeRampDownSeconds`, `name`, `appId`, `priority`, `clipType`, `streamUrl`, `httpAuthorization`, `clipLEDBehavior`, `clipMetadata`

## `authorization`

The auth surface for the muse API itself. Ops: `authenticateClient`, `authorizeDevice`, `createInvite`/`redeemInvite`/`deleteInvite`, `getPolicyKey`, `getPermissions`, `resolveToken`, `translate`/`batchTranslate` (id translation), `getUsers`, `subscribeUser`/`unsubscribeUser`. A third-party or app client first authenticates, redeems a household invite to gain membership, receives a policy key and a role, then attaches credentials to subsequent requests. `subscribeUser` grants the per-user access the invite flow gates. This is the resource every other resource implicitly depends on.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/households/{householdId}/authorization/tokens` | `resolveToken` | `-` | `0x20000102` | `0x10ad5050` |
| `GET` | `v1/households/{householdId}/authorization/policy/{policyKey}` | `getPolicyKey` | `policyKey` | `0x20000101` | `0x10ad5050` |
| `GET` | `v1/households/{householdId}/authorization/permissions/{role}` | `getPermissions` | `role` | `0x20000101` | `0x10ad52b8` |
| `POST` | `v1/\[error:  'none' is not a valid target\]/authorization/invite` | `createInvite` | `-` | `0x20000102` | — |
| `POST` | `v1/households/{householdId}/authorization/invite` | `createInvite` | `-` | `0x20000102` | — |
| `POST` | `v1/\[error:  'none' is not a valid target\]/authorization/redeem` | `redeemInvite` | `-` | `0x20000102` | — |
| `POST` | `v1/households/{householdId}/authorization/redeem` | `redeemInvite` | `-` | `0x20000102` | — |
| `GET` | `v1/\[error:  'none' is not a valid target\]/authorization/users` | `getUsers` | `-` | `0x20000101` | — |
| `GET` | `v1/households/{householdId}/authorization/users` | `getUsers` | `-` | `0x20000101` | — |
| `DELETE` | `v1/\[error:  'none' is not a valid target\]/authorization/users` | `deleteInvite` | `-` | `0x20000108` | — |
| `DELETE` | `v1/households/{householdId}/authorization/users` | `deleteInvite` | `-` | `0x20000108` | — |
| `POST` | `v1/players/{playerId}/authorization/authorizeDevice` | `authorizeDevice` | `-` | `0x20000102` | `0x10ad52b8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/authorization/authorizeDevice` | `authorizeDevice` | `-` | `0x20000102` | `0x10ad52b8` |
| `POST` | `v1/players/{playerId}/authorization/authenticateClient` | `authenticateClient` | `-` | `0x20000102` | `0x10ad54e4` |
| `POST` | `v1/households/{householdId}/players/{playerId}/authorization/authenticateClient` | `authenticateClient` | `-` | `0x20000102` | `0x10ad54e4` |

Op-level JSON keys recovered from op-object methods: `token`, `objectId`, `objectType`, `attributes`, `role`, `route`, `protocolVersion`, `grantType`, `assertion`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `objectIds`, `query:accountId`, `query:destinationServiceId`, `query:inviteId`, `query:mainAccountId`, `query:protocolVersion`, `query:route`

## `catalog`

Catalog lookups for music services. `serviceId`-scoped GETs resolve service catalog entries — this is how the app turns a content URI or service token into playable metadata without going through SMAPI directly.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/services/{serviceId}/catalog/id/{objectId}` | `translate` | `objectId` | `0x20000101` | — |
| `GET` | `v1/households/{householdId}/services/{serviceId}/catalog/id/{objectId}` | `translate` | `objectId` | `0x20000101` | — |
| `GET` | `v1/services/{serviceId}/catalog/ids` | `batchTranslate` | `-` | `0x20000101` | — |
| `GET` | `v1/households/{householdId}/services/{serviceId}/catalog/ids` | `batchTranslate` | `-` | `0x20000101` | — |

## `devices`

Device CRUD and discovery for the household. Lists players in a household, registers/unregisters devices, and manages per-device attributes. `userId`-scoped ops handle user-specific device registrations.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/devices` | `getDevices` | `-` | `0x20000101` | — |
| `DELETE` | `v1/households/{householdId}/devices/{playerId}` | `removeDevice` | `playerId` | `0x20000108` | — |
| `GET` | `v1/households/{householdId}/devices/registrations` | `getDeviceRegistrations` | `-` | `0x20000101` | — |
| `GET` | `v1/users/{userId}/devices/registrations` | `getUserDeviceRegistrations` | `-` | `0x20000101` | — |
| `GET` | `v1/households/{householdId}/users/{userId}/devices/registrations` | `getUserDeviceRegistrations` | `-` | `0x20000101` | — |
| `POST` | `v1/households/{householdId}/devices/registrations` | `initDeviceRegistration` | `-` | `0x20000102` | — |
| `POST` | `v1/households/{householdId}/devices/registrations/{deviceId}` | `completeDeviceRegistration` | `deviceId` | `0x20000102` | — |
| `PUT` | `v1/households/{householdId}/devices/registrations/{deviceId}` | `refreshDeviceRegistration` | `deviceId` | `0x20000104` | — |
| `DELETE` | `v1/households/{householdId}/devices/registrations/{deviceId}` | `deregisterDevice` | `deviceId` | `0x20000108` | — |
| `GET` | `v1/players/{playerId}/devices/registration` | `getRegistrationStatus` | `-` | `0x20000101` | `0x10ad8a10` |
| `GET` | `v1/households/{householdId}/players/{playerId}/devices/registration` | `getRegistrationStatus` | `-` | `0x20000101` | `0x10ad8a10` |
| `PUT` | `v1/players/{playerId}/devices/registration` | `setRegistrationState` | `-` | `0x20000104` | `0x10ad9e44` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/devices/registration` | `setRegistrationState` | `-` | `0x20000104` | `0x10ad9e44` |
| `PUT` | `v1/players/{playerId}/devices/transfer` | `transferDeviceRegistration` | `-` | `0x20000104` | `0x10ad9e44` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/devices/transfer` | `transferDeviceRegistration` | `-` | `0x20000104` | `0x10ad9e44` |
| `GET` | `v1/households/{householdId}/devices/local` | `getLocalDevices` | `-` | `0x20000101` | `0x10ad9140` |

Op-level JSON keys recovered from op-object methods: `assertion`

## `devicesExtended`

A wider read-only device listing — the same household device set decorated with extended attributes (capabilities, versions) that the plain `devices` list omits.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/devicesExtended` | `getExtendedDeviceStatus` | `-` | `0x20000101` | `0x101c086c` |

## `diagnostics`

Per-player diagnostic capture. POST triggers a diagnostic submission; GETs read submitted results. This is the surface behind 'Submit Diagnostics' in the app.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/diagnostics` | `submitDiagnostics` | `-` | `0x20000102` | `0x10ade7d4` |
| `POST` | `v1/households/{householdId}/players/{playerId}/diagnostics` | `submitDiagnostics` | `-` | `0x20000102` | `0x10ade7d4` |
| `GET` | `v1/players/{playerId}/diagnostics/metadata` | `getMetadata` | `-` | `0x20000101` | `0x10ade7d4` |
| `GET` | `v1/households/{householdId}/players/{playerId}/diagnostics/metadata` | `getMetadata` | `-` | `0x20000101` | `0x10ade7d4` |
| `POST` | `v1/players/{playerId}/diagnostics/report` | `reportStatus` | `-` | `0x20000102` | `0x10ade5ac` |
| `POST` | `v1/households/{householdId}/players/{playerId}/diagnostics/report` | `reportStatus` | `-` | `0x20000102` | `0x10ade5ac` |

Op-level JSON keys recovered from op-object methods: `includeControllers`, `type`, `initiatingDeviceId`, `controller`, `diagGuid`, `reporterId`, `status`

## `effectiveSettings`

Read-mostly computed settings: the resolved value of each setting after merging player, household and user layers. PATCH ops override at the player scope. Useful when a client wants 'what does this player actually run' rather than the raw stored values.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/effectiveSettings` | `getAllSettings` | `-` | `0x20000101` | `0x10b2dcc0` |
| `GET` | `v1/households/{householdId}/players/{playerId}/effectiveSettings` | `getAllSettings` | `-` | `0x20000101` | `0x10b2dcc0` |
| `GET` | `v1/players/{playerId}/effectiveSettings/{groupName}` | `getSettingsGroup` | `groupName` | `0x20000101` | `0x10ae2964` |
| `GET` | `v1/households/{householdId}/players/{playerId}/effectiveSettings/{groupName}` | `getSettingsGroup` | `groupName` | `0x20000101` | `0x10ae2964` |
| `PATCH` | `v1/players/{playerId}/effectiveSettings` | `updateAllSettings` | `-` | `0x20000110` | `0x10ae2964` |
| `PATCH` | `v1/households/{householdId}/players/{playerId}/effectiveSettings` | `updateAllSettings` | `-` | `0x20000110` | `0x10ae2964` |
| `PATCH` | `v1/players/{playerId}/effectiveSettings/{groupName}` | `updateSettingsGroup` | `groupName` | `0x20000110` | `0x10ae2210` |
| `PATCH` | `v1/households/{householdId}/players/{playerId}/effectiveSettings/{groupName}` | `updateSettingsGroup` | `groupName` | `0x20000110` | `0x10ae2210` |

Op-level JSON keys recovered from op-object methods: `channel`, `delayMillis`, `groupName`, `updateAllSettings`

## `entitlements`

Music-service entitlements for a household or user — which paid/trial service tiers are active. Read-only GET surface; the `subscribeUser`/`unsubscribeUser` verbs in `authorization` drive what appears here.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/users/{userId}/entitlements` | `getUserEntitlements` | `-` | `0x20000101` | `0x10ae4c6c` |
| `GET` | `v1/households/{householdId}/users/{userId}/entitlements` | `getUserEntitlements` | `-` | `0x20000101` | `0x10ae4c6c` |
| `GET` | `v1/households/{householdId}/entitlements` | `getEntitlements` | `-` | `0x20000101` | `0x10ae51d0` |

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `areaIds`, `musicContextGroupId`, `playerIds`, `playerIdsToAdd`, `playerIdsToRemove`

## `favorites`

Sonos favorites via the modern API. Scoped to group or household; GET lists the favorites the group can reach, POST adds. This is the same store that UPnP `FV:` ContentDirectory items write to — both views stay in sync.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/favorites` | `getFavorites` | `-` | `0x20000101` | `0x101ccc7c` |
| `POST` | `v1/groups/{groupId}/favorites` | `loadFavorite` | `-` | `0x20000102` | `0x101cda88` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/favorites` | `loadFavorite` | `-` | `0x20000102` | `0x101cda88` |

Op-level JSON keys recovered from op-object methods: `playOnCompletion`, `favoriteId`, `action`, `playModes`

## `groupVolume`

Volume for a whole playback group. GET reads the group's aggregate volume state (volume, mute, fixed flag); POSTs set volume or apply relative deltas across all members. Use this for group-level sliders — writing to every `playerVolume` instead produces drift and step ordering artifacts.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/groups/{groupId}/groupVolume` | `setVolume` | `-` | `0x20000002` | `0x10206ea4` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groupVolume` | `setVolume` | `-` | `0x20000002` | `0x10206ea4` |
| `POST` | `v1/groups/{groupId}/groupVolume/relative` | `setRelativeVolume` | `-` | `0x20000002` | `0x10206ea4` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groupVolume/relative` | `setRelativeVolume` | `-` | `0x20000002` | `0x10206ea4` |
| `POST` | `v1/groups/{groupId}/groupVolume/mute` | `setMute` | `-` | `0x20000002` | `0x10206cd8` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groupVolume/mute` | `setMute` | `-` | `0x20000002` | `0x10206cd8` |
| `GET` | `v1/groups/{groupId}/groupVolume` | `getVolume` | `-` | `0x20000001` | `0x10207070` |
| `GET` | `v1/households/{householdId}/groups/{groupId}/groupVolume` | `getVolume` | `-` | `0x20000001` | `0x10207070` |

Op-level JSON keys recovered from op-object methods: `muted`, `volume`, `volumeDelta`

## `groups`

Playback group lifecycle. `createGroup` forms a group, `setGroupMembers`/`modifyGroupMembers` change membership, `getExtended`/`history`/`subscription` read state and events. Group ops are where zone-group topology actually changes — UPnP `ZoneGroupState` events reflect the result.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/groups` | `getGroups` | `-` | `0x20000101` | `0x101c837c` |
| `GET` | `v1/households/{householdId}/groups/extended` | `getGroupsEx` | `-` | `0x20000101` | `0x101c837c` |
| `POST` | `v1/households/{householdId}/groups/createGroup` | `createGroup` | `-` | `0x20000102` | `0x101c8548` |
| `POST` | `v1/groups/{groupId}/groups/modifyGroupMembers` | `modifyGroupMembers` | `-` | `0x20000102` | `0x101c8548` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groups/modifyGroupMembers` | `modifyGroupMembers` | `-` | `0x20000102` | `0x101c8548` |
| `POST` | `v1/groups/{groupId}/groups/setGroupMembers` | `setGroupMembers` | `-` | `0x20000102` | `0x101c7894` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groups/setGroupMembers` | `setGroupMembers` | `-` | `0x20000102` | `0x101c7894` |

Op-level JSON keys recovered from op-object methods: `includeDeviceInfo`, `playerIds`, `areaIds`, `musicContextGroupId`, `playerIdsToAdd`, `playerIdsToRemove`

## `hardwareStatus`

Large read/write surface exposing per-player hardware condition — the binary carries verbs for battery cells, water ingress, PoE state, ship mode and other hardware probes, most of which exist for products this Playbar-era build doesn't ship. On this device the useful subset is player-scoped status reads; the exotic verbs register but their backing hardware is absent.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/hardwareStatus/bluetooth` | `getBluetoothStatus` | `-` | `0x20000101` | `0x101d63e4` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/bluetooth` | `getBluetoothStatus` | `-` | `0x20000101` | `0x101d63e4` |
| `GET` | `v1/players/{playerId}/hardwareStatus/battery` | `getBatteryStatus` | `-` | `0x20000101` | `0x101d5e80` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/battery` | `getBatteryStatus` | `-` | `0x20000101` | `0x101d5e80` |
| `POST` | `v1/players/{playerId}/hardwareStatus/battery` | `changeBatteryStatus` | `-` | `0x20000102` | `0x101d7114` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/battery` | `changeBatteryStatus` | `-` | `0x20000102` | `0x101d7114` |
| `GET` | `v1/players/{playerId}/hardwareStatus/batteryCells` | `getBatteryCells` | `-` | `0x20000101` | `0x101d7114` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/batteryCells` | `getBatteryCells` | `-` | `0x20000101` | `0x101d7114` |
| `POST` | `v1/players/{playerId}/hardwareStatus/shipMode` | `transitionToShipMode` | `-` | `0x20000102` | `0x101d8cb0` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/shipMode` | `transitionToShipMode` | `-` | `0x20000102` | `0x101d8cb0` |
| `POST` | `v1/players/{playerId}/hardwareStatus/shutdown` | `initiateOrderlyShutdown` | `-` | `0x20000102` | `0x101d8cb0` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/shutdown` | `initiateOrderlyShutdown` | `-` | `0x20000102` | `0x101d8cb0` |
| `GET` | `v1/players/{playerId}/hardwareStatus/ethernet` | `getEthernetStatus` | `-` | `0x20000101` | `0x101d677c` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/ethernet` | `getEthernetStatus` | `-` | `0x20000101` | `0x101d677c` |
| `GET` | `v1/players/{playerId}/hardwareStatus/wiredSub` | `getWiredSubStatus` | `-` | `0x20000101` | `0x101d65b0` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/wiredSub` | `getWiredSubStatus` | `-` | `0x20000101` | `0x101d65b0` |
| `GET` | `v1/players/{playerId}/hardwareStatus/wirelessNetworkStatus` | `getWirelessNetworkStatus` | `-` | `0x20000101` | `0x101d5ae8` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/wirelessNetworkStatus` | `getWirelessNetworkStatus` | `-` | `0x20000101` | `0x101d5ae8` |
| `POST` | `v1/players/{playerId}/hardwareStatus/bluetoothPairing` | `setBluetoothPairing` | `-` | `0x20000102` | `0x101d604c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/bluetoothPairing` | `setBluetoothPairing` | `-` | `0x20000102` | `0x101d604c` |
| `POST` | `v1/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `activatePairedBluetoothDevice` | `bluetoothAddress` | `0x20000102` | `0x101d604c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `activatePairedBluetoothDevice` | `bluetoothAddress` | `0x20000102` | `0x101d604c` |
| `DELETE` | `v1/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `removePairedBluetoothDevice` | `bluetoothAddress` | `0x20000108` | `0x101d8e7c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `removePairedBluetoothDevice` | `bluetoothAddress` | `0x20000108` | `0x101d8e7c` |
| `GET` | `v1/players/{playerId}/hardwareStatus/microphoneSwitch` | `getMicrophoneSwitchState` | `-` | `0x20000101` | `0x101d9070` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/microphoneSwitch` | `getMicrophoneSwitchState` | `-` | `0x20000101` | `0x101d9070` |
| `GET` | `v1/players/{playerId}/hardwareStatus/water` | `getWaterStatus` | `-` | `0x20000101` | `0x101d53b8` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/water` | `getWaterStatus` | `-` | `0x20000101` | `0x101d53b8` |
| `GET` | `v1/players/{playerId}/hardwareStatus/poe` | `getPoeStatus` | `-` | `0x20000101` | `0x101d5584` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/poe` | `getPoeStatus` | `-` | `0x20000101` | `0x101d5584` |
| `GET` | `v1/players/{playerId}/hardwareStatus/lineIn` | `getLineInStatus` | `-` | `0x20000101` | `0x101d9614` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/lineIn` | `getLineInStatus` | `-` | `0x20000101` | `0x101d9614` |
| `GET` | `v1/players/{playerId}/hardwareStatus/lineInStatuses` | `getLineInStatuses` | `-` | `0x20000101` | `0x101d9614` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/lineInStatuses` | `getLineInStatuses` | `-` | `0x20000101` | `0x101d9614` |

Op-level JSON keys recovered from op-object methods: `changeBatteryStatus`, `requiredMinimumBatteryPercentage`, `requiredMaximumBatteryPercentage`, `enable`, `bluetoothAddress`, `instanceId`

## `hdmi`

HDMI/CEC status and control for home-theater players — EDID info and power-cycle ops. Mostly GET on this build.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/hdmi/status` | `status` | `-` | `0x20000101` | `0x10aecdfc` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hdmi/status` | `status` | `-` | `0x20000101` | `0x10aecdfc` |
| `GET` | `v1/players/{playerId}/hdmi/edid` | `edid` | `-` | `0x20000101` | `0x10aecfc8` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hdmi/edid` | `edid` | `-` | `0x20000101` | `0x10aecfc8` |
| `GET` | `v1/players/{playerId}/hdmi/powercycle` | `powercycle` | `-` | `0x20000101` | `0x10aec898` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hdmi/powercycle` | `powercycle` | `-` | `0x20000101` | `0x10aec898` |

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `accountHash`, `accountType`, `keyName`, `keyValue`, `model`, `osVersion`, `softwareVersion`

## `history`

Household playback history. Stores the tracks/stations the household played, with fields for track metadata, position, play-mode and queue context. DELETE clears entries; the `subscribeUser` model gates visibility per user.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/history` | `getHistory` | `-` | `0x20000101` | `0x10af0330` |
| `POST` | `v1/households/{householdId}/history` | `postHistory` | `-` | `0x20000102` | `0x10af1050` |
| `DELETE` | `v1/households/{householdId}/history/{id}` | `removeHistoryItem` | `id` | `0x20000108` | `0x10af1050` |
| `DELETE` | `v1/households/{householdId}/history` | `clearHistory` | `-` | `0x20000108` | `0x10af0e5c` |

Op-level JSON keys recovered from op-object methods: `postHistory`, `id`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `action`, `advertisingInfo`, `allowTvPauseRestore`, `containerId`, `containerMetadata`, `defaults`, `deltaMillis`, `deviceFeedback`, `deviceId`, `id`, `instanceId`, `itemId`, `metadata`, `playModes`, `playOnCompletion`, `playbackAction`, `playbackLocation`, `positionMillis`, `queueAction`, `stationId`, `trackNumber`, `tracks`, `type`

## `homeTheater`

Home-theater configuration — a large resource covering the HT player, its bonded surrounds/sub, night/enhancement modes, channel-map sets and HDMI links. Player-scoped. Grouped with `pinewood`/`soundSwap`, it drives the Playbar-family feature set.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/homeTheater` | `loadHomeTheaterPlayback` | `-` | `0x20000102` | `0x101df5c4` |
| `POST` | `v1/households/{householdId}/players/{playerId}/homeTheater` | `loadHomeTheaterPlayback` | `-` | `0x20000102` | `0x101df5c4` |
| `POST` | `v1/players/{playerId}/homeTheater/tvPowerState` | `setTvPowerState` | `-` | `0x20000102` | `0x101dee60` |
| `POST` | `v1/households/{householdId}/players/{playerId}/homeTheater/tvPowerState` | `setTvPowerState` | `-` | `0x20000102` | `0x101dee60` |
| `GET` | `v1/players/{playerId}/homeTheater/options` | `getOptions` | `-` | `0x20000101` | `0x101dee60` |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/options` | `getOptions` | `-` | `0x20000101` | `0x101dee60` |
| `POST` | `v1/players/{playerId}/homeTheater/options` | `setOptions` | `-` | `0x20000102` | `0x101df22c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/homeTheater/options` | `setOptions` | `-` | `0x20000102` | `0x101df22c` |
| `POST` | `v1/players/{playerId}/homeTheater/addAccessoryWifi` | `addAccessoryWifi` | `-` | `0x20000102` | `0x101df22c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/homeTheater/addAccessoryWifi` | `addAccessoryWifi` | `-` | `0x20000102` | `0x101df22c` |
| `DELETE` | `v1/players/{playerId}/homeTheater/removeAccessory` | `removeAccessory` | `-` | `0x20000108` | `0x101e0698` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/homeTheater/removeAccessory` | `removeAccessory` | `-` | `0x20000108` | `0x101e0698` |
| `GET` | `v1/players/{playerId}/homeTheater/accessoryList` | `getAccessoryList` | `-` | `0x20000101` | `0x101e217c` |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/accessoryList` | `getAccessoryList` | `-` | `0x20000101` | `0x101e217c` |
| `GET` | `v1/players/{playerId}/homeTheater/accessorySwapStatus` | `getAccessorySwapStatus` | `-` | `0x20000101` | `0x101df790` |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/accessorySwapStatus` | `getAccessorySwapStatus` | `-` | `0x20000101` | `0x101df790` |
| `POST` | `v1/players/{playerId}/homeTheater/disconnectAccessory` | `disconnectAccessory` | `-` | `0x20000102` | `0x101e1d48` |
| `POST` | `v1/households/{householdId}/players/{playerId}/homeTheater/disconnectAccessory` | `disconnectAccessory` | `-` | `0x20000102` | `0x101e1d48` |
| `GET` | `v1/players/{playerId}/homeTheater/connectedAccessoryList` | `getConnectedAccessoryList` | `-` | `0x20000101` | `0x101e1d48` |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/connectedAccessoryList` | `getConnectedAccessoryList` | `-` | `0x20000101` | `0x101e1d48` |
| `GET` | `v1/players/{playerId}/homeTheater/swapModelInfo` | `getSwapModelInfo` | `-` | `0x20000101` | `0x101df3f8` |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/swapModelInfo` | `getSwapModelInfo` | `-` | `0x20000101` | `0x101df3f8` |
| `GET` | `v1/players/{playerId}/homeTheater/tvAudioSignalStatus` | `getTVAudioSignalStatus` | `-` | `0x20000101` | `0x101dfb28` |
| `GET` | `v1/households/{householdId}/players/{playerId}/homeTheater/tvAudioSignalStatus` | `getTVAudioSignalStatus` | `-` | `0x20000101` | `0x101dfb28` |

Op-level JSON keys recovered from op-object methods: `tvPowerState`, `nightMode`, `enhanceDialog`, `wifiMacAddress`, `details`, `macAddress`

## `householdUpdate`

Per-device household software update — a single player checks and applies firmware relative to its household, where `households`/`update` drive the household-wide flow.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/devices/{deviceId}/householdUpdate/update` | `beginHouseholdSoftwareUpdate` | `-` | `0x20000102` | `0x10af5fc4` |
| `POST` | `v1/households/{householdId}/devices/{deviceId}/householdUpdate/update` | `beginHouseholdSoftwareUpdate` | `-` | `0x20000102` | `0x10af5fc4` |
| `GET` | `v1/devices/{deviceId}/householdUpdate/status` | `getHouseholdUpdateStatus` | `-` | `0x20000101` | `0x10af5c2c` |
| `GET` | `v1/households/{householdId}/devices/{deviceId}/householdUpdate/status` | `getHouseholdUpdateStatus` | `-` | `0x20000101` | `0x10af5c2c` |

## `households`

Top-level household object: create/lookup, members, the `none`-scoped ops are unauthenticated bootstrap endpoints (a player with no household talks here). Everything else in muse hangs off a `householdId` bound by these routes.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/\[error:  'none' is not a valid target\]/households` | `getHouseholds` | `-` | `0x20000101` | — |
| `GET` | `v1/households/{householdId}/households` | `getHouseholds` | `-` | `0x20000101` | — |
| `GET` | `v1/\[error:  'none' is not a valid target\]/households/{householdId}` | `getHousehold` | `householdId` | `0x20000101` | — |
| `GET` | `v1/households/{householdId}/households/{householdId}` | `getHousehold` | `householdId` | `0x20000101` | — |
| `POST` | `v1/households/{householdId}/households/name` | `setName` | `-` | `0x20000102` | — |
| `GET` | `v1/households/{householdId}/households/location` | `getHouseholdLocation` | `-` | `0x20000101` | — |
| `PUT` | `v1/households/{householdId}/households/location` | `setLocation` | `-` | `0x20000104` | — |

## `info`

Read-only per-player info — identity, capabilities, version. The cheap 'what is this box' query.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/info` | `getInfo` | `-` | `0x20000101` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/info` | `getInfo` | `-` | `0x20000101` | — |

## `ircontrol`

IR remote-control config for players with IR sensors (the volume-and-mute commands the soundbar learned from a TV remote). GET reads learned state, POST teaches/clears.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/ircontrol` | `setIRControl` | `-` | `0x20000102` | `0x10af8848` |
| `POST` | `v1/households/{householdId}/players/{playerId}/ircontrol` | `setIRControl` | `-` | `0x20000102` | `0x10af8848` |
| `GET` | `v1/players/{playerId}/ircontrol` | `getIRControl` | `-` | `0x20000101` | `0x10af8848` |
| `GET` | `v1/households/{householdId}/players/{playerId}/ircontrol` | `getIRControl` | `-` | `0x20000101` | `0x10af8848` |

Op-level JSON keys recovered from op-object methods: `enabled`

## `localContentLibrary`

The local music library (shared folders) via muse — browse/index/control for SMB library shares, distinct from UPnP ContentDirectory browse.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/localContentLibrary` | `getShares` | `-` | `0x20000101` | `0x10afc04c` |
| `POST` | `v1/households/{householdId}/localContentLibrary` | `addShare` | `-` | `0x20000102` | `0x10afc7b0` |
| `DELETE` | `v1/households/{householdId}/localContentLibrary/{shareId}` | `removeShare` | `shareId` | `0x20000108` | `0x10afc7b0` |
| `POST` | `v1/households/{householdId}/localContentLibrary/reindex` | `reindex` | `-` | `0x20000102` | `0x10afd52c` |
| `GET` | `v1/players/{playerId}/localContentLibrary/indexer` | `getIndexerStatus` | `-` | `0x20000101` | `0x10afbe80` |
| `GET` | `v1/households/{householdId}/players/{playerId}/localContentLibrary/indexer` | `getIndexerStatus` | `-` | `0x20000101` | `0x10afbe80` |

Op-level JSON keys recovered from op-object methods: `path`, `username`, `password`, `shareId`

## `management`

Administrative POSTs on a player — factory/maintenance operations.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/management/factoryReset` | `factoryReset` | `-` | `0x20000102` | `0x10afe450` |
| `POST` | `v1/households/{householdId}/players/{playerId}/management/factoryReset` | `factoryReset` | `-` | `0x20000102` | `0x10afe450` |
| `POST` | `v1/players/{playerId}/management/reboot` | `reboot` | `-` | `0x20000102` | `0x10b0d780` |
| `POST` | `v1/households/{householdId}/players/{playerId}/management/reboot` | `reboot` | `-` | `0x20000102` | `0x10b0d780` |

Op-level JSON keys recovered from op-object methods: `fullSync`, `setting`, `operation`

## `musicServiceAccounts`

Music-service account linking for the household/group — add, remove and inspect the SMAPI service accounts bound to the household. The SOAP-side `upnpMusicServices` resource is the equivalent read surface.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/households/{householdId}/musicServiceAccounts/match` | `match` | `-` | `0x20000102` | `0x10b025f8` |
| `POST` | `v1/households/{householdId}/musicServiceAccounts/preferred` | `setPreferredMusicServiceAccount` | `-` | `0x20000102` | `0x10b025f8` |
| `GET` | `v1/households/{householdId}/musicServiceAccounts/preferred` | `getPreferredMusicServiceAccount` | `-` | `0x20000101` | `0x10b03214` |
| `POST` | `v1/groups/{groupId}/musicServiceAccounts/startDirectControlEx` | `startDirectControlEx` | `-` | `0x20000102` | `0x10b0283c` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/musicServiceAccounts/startDirectControlEx` | `startDirectControlEx` | `-` | `0x20000102` | `0x10b0283c` |
| `POST` | `v1/groups/{groupId}/musicServiceAccounts/endDirectControl` | `endDirectControl` | `-` | `0x20000102` | `0x10b0283c` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/musicServiceAccounts/endDirectControl` | `endDirectControl` | `-` | `0x20000102` | `0x10b0283c` |

Op-level JSON keys recovered from op-object methods: `userIdHashCode`, `nickname`, `serviceId`, `linkCode`, `linkDeviceId`, `accountId`, `appId`, `restartToken`

## `networkTest`

Per-player network diagnostics — run wireless/Internet tests and read results. Powers the 'check network' app flows.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/networkTest/disableNetwork` | `temporarilyDisableNetwork` | `-` | `0x20000102` | `0x10b051c4` |
| `POST` | `v1/households/{householdId}/players/{playerId}/networkTest/disableNetwork` | `temporarilyDisableNetwork` | `-` | `0x20000102` | `0x10b051c4` |
| `POST` | `v1/players/{playerId}/networkTest/start` | `startNetworkTests` | `-` | `0x20000102` | `0x10b05b5c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/networkTest/start` | `startNetworkTests` | `-` | `0x20000102` | `0x10b05b5c` |
| `GET` | `v1/players/{playerId}/networkTest/{networkTestId}` | `getNetworkTestResults` | `networkTestId` | `0x20000101` | `0x10b05b5c` |
| `GET` | `v1/households/{householdId}/players/{playerId}/networkTest/{networkTestId}` | `getNetworkTestResults` | `networkTestId` | `0x20000101` | `0x10b05b5c` |

Op-level JSON keys recovered from op-object methods: `delaySecs`, `durationSecs`, `url`

## `pinewood`

The remote-control API ('pinewood' = TV-remote emulation). All POST, player-scoped: `mute`, `volumeUp`/`volumeDown`, `power`, `dpad` directions, `back`, `home`, `settings`, `play`, `loadResource`. A client implements a full remote by posting these verbs — cloud-relayed through the same mux when off-LAN.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/pinewood/mute` | `toggleMute` | `-` | `0x20000102` | `0x10b09d7c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/mute` | `toggleMute` | `-` | `0x20000102` | `0x10b09d7c` |
| `POST` | `v1/players/{playerId}/pinewood/volumeUp` | `volumeUp` | `-` | `0x20000102` | `0x10b09d7c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/volumeUp` | `volumeUp` | `-` | `0x20000102` | `0x10b09d7c` |
| `POST` | `v1/players/{playerId}/pinewood/volumeDown` | `volumeDown` | `-` | `0x20000102` | `0x10b09bb0` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/volumeDown` | `volumeDown` | `-` | `0x20000102` | `0x10b09bb0` |
| `POST` | `v1/players/{playerId}/pinewood/loadResource` | `loadResource` | `-` | `0x20000102` | `0x10b0b254` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/loadResource` | `loadResource` | `-` | `0x20000102` | `0x10b0b254` |
| `POST` | `v1/players/{playerId}/pinewood/power` | `power` | `-` | `0x20000102` | `0x10b0b254` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/power` | `power` | `-` | `0x20000102` | `0x10b0b254` |
| `POST` | `v1/players/{playerId}/pinewood/dpad` | `dpad` | `-` | `0x20000102` | `0x10b0b454` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/dpad` | `dpad` | `-` | `0x20000102` | `0x10b0b454` |
| `POST` | `v1/players/{playerId}/pinewood/back` | `back` | `-` | `0x20000102` | `0x10b0b454` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/back` | `back` | `-` | `0x20000102` | `0x10b0b454` |
| `POST` | `v1/players/{playerId}/pinewood/home` | `home` | `-` | `0x20000102` | `0x10b09818` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/home` | `home` | `-` | `0x20000102` | `0x10b09818` |
| `POST` | `v1/players/{playerId}/pinewood/settings` | `settings` | `-` | `0x20000102` | `0x10b0b654` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/settings` | `settings` | `-` | `0x20000102` | `0x10b0b654` |
| `POST` | `v1/players/{playerId}/pinewood/play` | `togglePlay` | `-` | `0x20000102` | `0x10b0b654` |
| `POST` | `v1/households/{householdId}/players/{playerId}/pinewood/play` | `togglePlay` | `-` | `0x20000102` | `0x10b0b654` |

Op-level JSON keys recovered from op-object methods: `deeplink`, `dpadDirection`, `menuType`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `backhaulChannel`, `flatChannelMapSet`, `fronthaulChannel`, `isHomeTheater`

## `platformInternal`

Privileged platform ops — POST-only, player/household scoped, used by first-party infrastructure rather than the public app.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/households/{householdId}/platformInternal/sync` | `sync` | `-` | `0x20000102` | `0x10b0d780` |
| `POST` | `v1/players/{playerId}/platformInternal/reboot` | `reboot` | `-` | `0x20000102` | `0x10b0d780` |
| `POST` | `v1/households/{householdId}/players/{playerId}/platformInternal/reboot` | `reboot` | `-` | `0x20000102` | `0x10b0d780` |
| `POST` | `v1/households/{householdId}/platformInternal/invalidateCache` | `invalidateCache` | `-` | `0x20000102` | `0x10b0d49c` |

Op-level JSON keys recovered from op-object methods: `fullSync`, `setting`, `operation`, `cacheSettings`, `cacheNamespace`, `cacheData`, `cacheName`, `cacheKey`

## `playback`

The big one: transport control for a group. `play`, `pause`, `seek`, `loadStream`, track-list ops, play-mode changes, line-in/content selection — 32 ops, all group-scoped. This is the SOAP `AVTransport`'s modern replacement and every verb maps onto the same playback engine underneath.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/groups/{groupId}/playback` | `getPlaybackStatus` | `-` | `0x20000001` | `0x101eb9ec` |
| `GET` | `v1/households/{householdId}/groups/{groupId}/playback` | `getPlaybackStatus` | `-` | `0x20000001` | `0x101eb9ec` |
| `POST` | `v1/groups/{groupId}/playback/play` | `play` | `-` | `0x20000002` | `0x101eae78` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/play` | `play` | `-` | `0x20000002` | `0x101eae78` |
| `POST` | `v1/groups/{groupId}/playback/pause` | `pause` | `-` | `0x20000002` | `0x101eae78` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/pause` | `pause` | `-` | `0x20000002` | `0x101eae78` |
| `POST` | `v1/groups/{groupId}/playback/togglePlayPause` | `togglePlayPause` | `-` | `0x20000002` | `0x101ebb54` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/togglePlayPause` | `togglePlayPause` | `-` | `0x20000002` | `0x101ebb54` |
| `POST` | `v1/groups/{groupId}/playback/playMode` | `setPlayModes` | `-` | `0x20000002` | `0x101ec2fc` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/playMode` | `setPlayModes` | `-` | `0x20000002` | `0x101ec2fc` |
| `POST` | `v1/groups/{groupId}/playback/skipToNextTrack` | `skipToNextTrack` | `-` | `0x20000002` | `0x101ec2fc` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/skipToNextTrack` | `skipToNextTrack` | `-` | `0x20000002` | `0x101ec2fc` |
| `POST` | `v1/groups/{groupId}/playback/skipToPreviousTrack` | `skipToPreviousTrack` | `-` | `0x20000002` | `0x101ebc6c` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/skipToPreviousTrack` | `skipToPreviousTrack` | `-` | `0x20000002` | `0x101ebc6c` |
| `POST` | `v1/groups/{groupId}/playback/skipBack` | `skipBack` | `-` | `0x20000002` | `0x101ebd5c` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/skipBack` | `skipBack` | `-` | `0x20000002` | `0x101ebd5c` |
| `POST` | `v1/groups/{groupId}/playback/seek` | `seek` | `-` | `0x20000002` | `0x10200fa0` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/seek` | `seek` | `-` | `0x20000002` | `0x10200fa0` |
| `POST` | `v1/groups/{groupId}/playback/seekRelative` | `seekRelative` | `-` | `0x20000002` | `0x101eb410` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/seekRelative` | `seekRelative` | `-` | `0x20000002` | `0x101eb410` |
| `POST` | `v1/groups/{groupId}/playback/loadContainer` | `loadContainer` | `-` | `0x20000002` | `0x101ee8b0` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/loadContainer` | `loadContainer` | `-` | `0x20000002` | `0x101ee8b0` |
| `POST` | `v1/groups/{groupId}/playback/trackList` | `loadTrackList` | `-` | `0x20000002` | `0x101ee8b0` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/trackList` | `loadTrackList` | `-` | `0x20000002` | `0x101ee8b0` |
| `POST` | `v1/groups/{groupId}/playback/loadStream` | `loadStream` | `-` | `0x20000002` | `0x101ef2e4` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/loadStream` | `loadStream` | `-` | `0x20000002` | `0x101ef2e4` |
| `POST` | `v1/groups/{groupId}/playback/lineIn` | `loadLineIn` | `-` | `0x20000002` | `0x101ec1dc` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/lineIn` | `loadLineIn` | `-` | `0x20000002` | `0x101ec1dc` |
| `POST` | `v1/groups/{groupId}/playback/content` | `loadContent` | `-` | `0x20000002` | `0x101ec374` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/content` | `loadContent` | `-` | `0x20000002` | `0x101ec374` |
| `POST` | `v1/groups/{groupId}/playback/skipToTrack` | `skipToTrack` | `-` | `0x20000002` | `0x101ec374` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playback/skipToTrack` | `skipToTrack` | `-` | `0x20000002` | `0x101ec374` |

Op-level JSON keys recovered from op-object methods: `allowTvPauseRestore`, `deviceFeedback`, `playModes`, `playOnCompletion`, `positionMillis`, `itemId`, `window`, `bridgeContext`, `action`, `containerId`, `containerMetadata`, `playbackLocation`, `tracks`, `stationId`, `type`, `defaults`, `playbackAction`, `queueAction`, `id`, `metadata`, `advertisingInfo`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `durationMillis`, `muted`, `volume`, `volumeDelta`

## `playbackExtended`

Extended playback reads — richer state than the plain playback GETs (detailed position/track info for the now-playing surface).

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/groups/{groupId}/playbackExtended` | `getExtendedPlaybackStatus` | `-` | `0x20000101` | `0x101f183c` |
| `GET` | `v1/households/{householdId}/groups/{groupId}/playbackExtended` | `getExtendedPlaybackStatus` | `-` | `0x20000101` | `0x101f183c` |

## `playbackMetadata`

Read/write playback metadata on a group — the track display state the player publishes. The write op lets privileged callers correct displayed metadata.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/groups/{groupId}/playbackMetadata` | `getMetadataStatus` | `-` | `0x20000001` | `0x10b0fbd8` |
| `GET` | `v1/households/{householdId}/groups/{groupId}/playbackMetadata` | `getMetadataStatus` | `-` | `0x20000001` | `0x10b0fbd8` |
| `POST` | `v1/groups/{groupId}/playbackMetadata/ratings` | `rate` | `-` | `0x20000002` | `0x10b1052c` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playbackMetadata/ratings` | `rate` | `-` | `0x20000002` | `0x10b1052c` |

Op-level JSON keys recovered from op-object methods: `itemId`, `rating`

## `playbackSession`

Sessioned playback — the queue/stream model the S2-era app uses. `loadContainer`, `seekRelative`, subscribe/unsubscribe ops, sessionId-scoped routes; 30 POST/DELETE ops. A playback session owns a media container (queue, station, stream) and emits subscription events as it advances.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/groups/{groupId}/playbackSession/joinOrCreate` | `joinOrCreateSession` | `-` | `0x20000102` | `0x101fe258` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playbackSession/joinOrCreate` | `joinOrCreateSession` | `-` | `0x20000102` | `0x101fe258` |
| `POST` | `v1/groups/{groupId}/playbackSession/join` | `joinSession` | `-` | `0x20000102` | `0x101fe258` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playbackSession/join` | `joinSession` | `-` | `0x20000102` | `0x101fe258` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/rejoin` | `rejoinSession` | `-` | `0x20000102` | `0x101fde88` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/rejoin` | `rejoinSession` | `-` | `0x20000102` | `0x101fde88` |
| `POST` | `v1/groups/{groupId}/playbackSession` | `createSession` | `-` | `0x20000102` | `0x101fe05c` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playbackSession` | `createSession` | `-` | `0x20000102` | `0x101fe05c` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/suspend` | `suspend` | `-` | `0x20000102` | `0x101fe05c` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/suspend` | `suspend` | `-` | `0x20000102` | `0x101fe05c` |
| `DELETE` | `v1/playbackSessions/{sessionId}/playbackSession` | `leaveSession` | `-` | `0x20000108` | `0x101ff028` |
| `DELETE` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession` | `leaveSession` | `-` | `0x20000108` | `0x101ff028` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/loadCloudQueue` | `loadCloudQueue` | `-` | `0x20000102` | `0x101fff80` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/loadCloudQueue` | `loadCloudQueue` | `-` | `0x20000102` | `0x101fff80` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/loadCloudQueueWithWindow` | `loadCloudQueueWithWindow` | `-` | `0x20000102` | `0x101fff80` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/loadCloudQueueWithWindow` | `loadCloudQueueWithWindow` | `-` | `0x20000102` | `0x101fff80` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/loadStreamUrl` | `loadStreamUrl` | `-` | `0x20000102` | `0x1020129c` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/loadStreamUrl` | `loadStreamUrl` | `-` | `0x20000102` | `0x1020129c` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/loadStreamUrlWithContext` | `loadStreamUrlWithContext` | `-` | `0x20000102` | `0x101ffd84` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/loadStreamUrlWithContext` | `loadStreamUrlWithContext` | `-` | `0x20000102` | `0x101ffd84` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/refreshCloudQueue` | `refreshCloudQueue` | `-` | `0x20000102` | `0x101ffd84` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/refreshCloudQueue` | `refreshCloudQueue` | `-` | `0x20000102` | `0x101ffd84` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/skipToItem` | `skipToItem` | `-` | `0x20000102` | `0x102001a0` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/skipToItem` | `skipToItem` | `-` | `0x20000102` | `0x102001a0` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/skipToItemWithWindow` | `skipToItemWithWindow` | `-` | `0x20000102` | `0x102001a0` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/skipToItemWithWindow` | `skipToItemWithWindow` | `-` | `0x20000102` | `0x102001a0` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/seek` | `seek` | `-` | `0x20000102` | `0x10200fa0` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/seek` | `seek` | `-` | `0x20000102` | `0x10200fa0` |
| `POST` | `v1/playbackSessions/{sessionId}/playbackSession/seekRelative` | `seekRelative` | `-` | `0x20000102` | `0x101eb410` |
| `POST` | `v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/seekRelative` | `seekRelative` | `-` | `0x20000102` | `0x101eb410` |

Op-level JSON keys recovered from op-object methods: `appId`, `appContext`, `accountId`, `customData`, `queueVersion`, `useHttpAuthorizationForMedia`, `playOnCompletion`, `positionMillis`, `queueBaseUrl`, `httpAuthorization`, `itemId`, `trackMetadata`, `window`, `bridgeContext`, `streamUrl`, `stationMetadata`

## `playerVolume`

Per-player volume: GET reads `{volume, muted, fixed, smartplay}`; POSTs set absolute volume, apply `volumeDelta`, duck/unduck (`/duck`, `/unduck` for temporary dips during doorbell/voice), and mute/unmute. `smartplay` fields expose per-source smart-volume behavior.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/playerVolume` | `setVolume` | `-` | `0x20000002` | `0x10206ea4` |
| `POST` | `v1/households/{householdId}/players/{playerId}/playerVolume` | `setVolume` | `-` | `0x20000002` | `0x10206ea4` |
| `POST` | `v1/players/{playerId}/playerVolume/relative` | `setRelativeVolume` | `-` | `0x20000002` | `0x10206ea4` |
| `POST` | `v1/households/{householdId}/players/{playerId}/playerVolume/relative` | `setRelativeVolume` | `-` | `0x20000002` | `0x10206ea4` |
| `POST` | `v1/players/{playerId}/playerVolume/mute` | `setMute` | `-` | `0x20000002` | `0x10206cd8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/playerVolume/mute` | `setMute` | `-` | `0x20000002` | `0x10206cd8` |
| `GET` | `v1/players/{playerId}/playerVolume` | `getVolume` | `-` | `0x20000001` | `0x10207070` |
| `GET` | `v1/households/{householdId}/players/{playerId}/playerVolume` | `getVolume` | `-` | `0x20000001` | `0x10207070` |
| `POST` | `v1/players/{playerId}/playerVolume/duck` | `duck` | `-` | `0x20000002` | `0x10206b0c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/playerVolume/duck` | `duck` | `-` | `0x20000002` | `0x10206b0c` |
| `POST` | `v1/players/{playerId}/playerVolume/unduck` | `unduck` | `-` | `0x20000002` | `0x10206b0c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/playerVolume/unduck` | `unduck` | `-` | `0x20000002` | `0x10206b0c` |

Op-level JSON keys recovered from op-object methods: `muted`, `volume`, `volumeDelta`, `durationMillis`

## `playlists`

Household/group playlist surface — Sonos playlists (saved queue snapshots) listable and creatable here; the same objects UPnP `SQ:` favorites expose.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/playlists` | `getPlaylists` | `-` | `0x20000101` | `0x10b13318` |
| `GET` | `v1/households/{householdId}/playlists/{playlistId}` | `getPlaylist` | `playlistId` | `0x20000101` | `0x10b14494` |
| `POST` | `v1/households/{householdId}/playlists/getPlaylist` | `postPlaylist` | `-` | `0x20000102` | `0x10b14494` |
| `POST` | `v1/groups/{groupId}/playlists` | `loadPlaylist` | `-` | `0x20000102` | `0x10b138e4` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playlists` | `loadPlaylist` | `-` | `0x20000102` | `0x10b138e4` |

Op-level JSON keys recovered from op-object methods: `playlistId`, `playOnCompletion`, `action`, `playModes`, `playbackLocation`

## `positioning`

Per-player audio positioning/tuning — the mic-based room-detection suite behind `roomDetection` plus speaker-placement measurements. Player-scoped; drives Trueplay-style measurement capture.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/positioning/playStimulus` | `playStimulus` | `-` | `0x20000102` | `0x10b1cc28` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/playStimulus` | `playStimulus` | `-` | `0x20000102` | `0x10b1cc28` |
| `POST` | `v1/players/{playerId}/positioning/stimulusTuning` | `setStimulusTuning` | `-` | `0x20000102` | `0x10b1cc28` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/stimulusTuning` | `setStimulusTuning` | `-` | `0x20000102` | `0x10b1cc28` |
| `GET` | `v1/players/{playerId}/positioning/stimulusTuning` | `getStimulusTuning` | `-` | `0x20000101` | `0x10b1d788` |
| `GET` | `v1/households/{householdId}/players/{playerId}/positioning/stimulusTuning` | `getStimulusTuning` | `-` | `0x20000101` | `0x10b1d788` |
| `POST` | `v1/players/{playerId}/positioning/session` | `startSession` | `-` | `0x20000102` | `0x10b1d064` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/session` | `startSession` | `-` | `0x20000102` | `0x10b1d064` |
| `DELETE` | `v1/players/{playerId}/positioning/session` | `cancelSession` | `-` | `0x20000108` | `0x10b1d064` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/positioning/session` | `cancelSession` | `-` | `0x20000108` | `0x10b1d064` |
| `POST` | `v1/players/{playerId}/positioning/action` | `applyAction` | `-` | `0x20000102` | `0x10b1c834` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/action` | `applyAction` | `-` | `0x20000102` | `0x10b1c834` |
| `GET` | `v1/players/{playerId}/positioning/sessionMap` | `getSessionMap` | `-` | `0x20000101` | `0x10b1c834` |
| `GET` | `v1/households/{householdId}/players/{playerId}/positioning/sessionMap` | `getSessionMap` | `-` | `0x20000101` | `0x10b1c834` |
| `GET` | `v1/players/{playerId}/positioning/deviceMeasurements` | `getDeviceMeasurements` | `-` | `0x20000101` | `0x10b1e528` |
| `GET` | `v1/households/{householdId}/players/{playerId}/positioning/deviceMeasurements` | `getDeviceMeasurements` | `-` | `0x20000101` | `0x10b1e528` |
| `POST` | `v1/players/{playerId}/positioning/measurements` | `sendMeasurements` | `-` | `0x20000102` | `0x10b1eb14` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/measurements` | `sendMeasurements` | `-` | `0x20000102` | `0x10b1eb14` |
| `POST` | `v1/players/{playerId}/positioning/sessionError` | `notifySessionError` | `-` | `0x20000102` | `0x10b1d338` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/sessionError` | `notifySessionError` | `-` | `0x20000102` | `0x10b1d338` |
| `POST` | `v1/players/{playerId}/positioning/sessionStatus` | `notifySessionStatus` | `-` | `0x20000102` | `0x10b1c600` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/sessionStatus` | `notifySessionStatus` | `-` | `0x20000102` | `0x10b1c600` |
| `POST` | `v1/players/{playerId}/positioning/deviceStatus` | `notifyDeviceStatus` | `-` | `0x20000102` | `0x10b1ce50` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/deviceStatus` | `notifyDeviceStatus` | `-` | `0x20000102` | `0x10b1ce50` |
| `GET` | `v1/players/{playerId}/positioning/measurementCapabilities` | `getMeasurementCapabilities` | `-` | `0x20000101` | `0x10b1fa44` |
| `GET` | `v1/households/{householdId}/players/{playerId}/positioning/measurementCapabilities` | `getMeasurementCapabilities` | `-` | `0x20000101` | `0x10b1fa44` |
| `POST` | `v1/players/{playerId}/positioning/telemetryLevel` | `setTelemetryLevel` | `-` | `0x20000102` | `0x10b1ca5c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/positioning/telemetryLevel` | `setTelemetryLevel` | `-` | `0x20000102` | `0x10b1ca5c` |

Op-level JSON keys recovered from op-object methods: `behavior`, `attenuation`, `type`, `setStimulusTuning`, `request`, `id`, `orchestratorId`, `action`, `measurements`, `notifySessionError`, `notifySessionStatus`, `notifyDeviceStatus`, `setTelemetryLevel`

## `power`

Player power ops — POST-only power transitions (the player has no soft-power via SOAP; muse exposes it).

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/power/policy` | `setPowerPolicy` | `-` | `0x20000102` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/power/policy` | `setPowerPolicy` | `-` | `0x20000102` | — |

## `roomDetection`

Mic-based room detection — start/stop the chirp-based proximity and room-matching flow that the Chirp stack backs. POST deletes/stops in-flight detection state.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/roomDetection/chirp` | `startSignalling` | `-` | `0x20000102` | `0x10b22704` |
| `POST` | `v1/households/{householdId}/players/{playerId}/roomDetection/chirp` | `startSignalling` | `-` | `0x20000102` | `0x10b22704` |
| `DELETE` | `v1/players/{playerId}/roomDetection/chirp/{playId}` | `stopSignalling` | `playId` | `0x20000108` | `0x10b22704` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/roomDetection/chirp/{playId}` | `stopSignalling` | `playId` | `0x20000108` | `0x10b22704` |

Op-level JSON keys recovered from op-object methods: `channelNumber`, `durationSeconds`

## `settings`

The settings resource — 34 ops, the broadest write surface. GET reads setting values, PATCH (`updateAllSettings`) applies merged batches, PUT/POST handle per-scope writes. Scope params split player/household/user layers; PATCH is the only method used exclusively by this resource — batch updates are PATCH-shaped.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{HHID}/settings/protected-admin/{setting}` | `getProtectedAdminSettings` | `setting` | `0x20000101` | `0x10b30888` |
| `GET` | `v1/households/{HHID}/settings/protected-admin` | `getProtectedAdminSettings` | `-` | `0x20000101` | `0x10b30888` |
| `POST` | `v1/households/{HHID}/settings/protected-admin` | `setProtectedAdminSettings` | `-` | `0x20000102` | `0x10b2de8c` |
| `GET` | `v1/households/{HHID}/settings/protected/{setting}` | `getProtectedSettings` | `setting` | `0x20000101` | `0x10b30888` |
| `GET` | `v1/households/{HHID}/settings/protected` | `getProtectedSettings` | `-` | `0x20000101` | `0x10b30888` |
| `GET` | `v1/users/{userId}/settings` | `getSettings` | `-` | `0x20000101` | `0x10b2f98c` |
| `GET` | `v1/households/{householdId}/users/{userId}/settings` | `getSettings` | `-` | `0x20000101` | `0x10b2f98c` |
| `GET` | `v1/players/{playerId}/settings/player` | `getPlayerSettings` | `-` | `0x20000101` | `0x10b2f98c` |
| `GET` | `v1/households/{householdId}/players/{playerId}/settings/player` | `getPlayerSettings` | `-` | `0x20000101` | `0x10b2f98c` |
| `POST` | `v1/players/{playerId}/settings/player` | `setPlayerSettings` | `-` | `0x20000102` | `0x10b24094` |
| `POST` | `v1/households/{householdId}/players/{playerId}/settings/player` | `setPlayerSettings` | `-` | `0x20000102` | `0x10b24094` |
| `PUT` | `v1/players/{playerId}/settings/player/voice/allowMicrophone` | `setAllowMicrophone` | `-` | `0x20000104` | `0x10b24094` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/settings/player/voice/allowMicrophone` | `setAllowMicrophone` | `-` | `0x20000104` | `0x10b24094` |
| `PUT` | `v1/players/{playerId}/settings/player` | `setSelfTruePlay` | `-` | `0x20000104` | `0x10b2c5d4` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/settings/player` | `setSelfTruePlay` | `-` | `0x20000104` | `0x10b2c5d4` |
| `PUT` | `v1/players/{playerId}/settings/enablePositioningMeasurement` | `setEnablePositioningMeasurement` | `-` | `0x20000104` | `0x10b2bcd8` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/settings/enablePositioningMeasurement` | `setEnablePositioningMeasurement` | `-` | `0x20000104` | `0x10b2bcd8` |
| `PUT` | `v1/players/{playerId}/settings/sonosNetChannel` | `setSonosNetChannel` | `-` | `0x20000104` | `0x10b2dcc0` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/settings/sonosNetChannel` | `setSonosNetChannel` | `-` | `0x20000104` | `0x10b2dcc0` |
| `GET` | `v1/players/{playerId}/settings` | `getAllSettings` | `-` | `0x20000101` | `0x10b2dcc0` |
| `GET` | `v1/households/{householdId}/players/{playerId}/settings` | `getAllSettings` | `-` | `0x20000101` | `0x10b2dcc0` |
| `GET` | `v1/players/{playerId}/settings/{groupName}` | `getSettingsGroup` | `groupName` | `0x20000101` | `0x10ae2964` |
| `GET` | `v1/households/{householdId}/players/{playerId}/settings/{groupName}` | `getSettingsGroup` | `groupName` | `0x20000101` | `0x10ae2964` |
| `PATCH` | `v1/players/{playerId}/settings` | `updateAllSettings` | `-` | `0x20000110` | `0x10ae2964` |
| `PATCH` | `v1/households/{householdId}/players/{playerId}/settings` | `updateAllSettings` | `-` | `0x20000110` | `0x10ae2964` |
| `PATCH` | `v1/players/{playerId}/settings/{groupName}` | `updateSettingsGroup` | `groupName` | `0x20000110` | `0x10ae2210` |
| `PATCH` | `v1/households/{householdId}/players/{playerId}/settings/{groupName}` | `updateSettingsGroup` | `groupName` | `0x20000110` | `0x10ae2210` |
| `GET` | `v1/households/{householdId}/settings/restrictedAdmin` | `getRestrictedAdminSettings` | `-` | `0x20000101` | `0x10b2ff7c` |
| `PUT` | `v1/households/{householdId}/settings/restrictedAdmin/userMetricsTracking` | `setUserMetricsTracking` | `-` | `0x20000104` | `0x10b2ced0` |
| `PUT` | `v1/households/{householdId}/settings/restrictedAdmin` | `setRestrictedAdminSettings` | `-` | `0x20000104` | `0x10b2ced0` |
| `GET` | `v1/households/{householdId}/settings/public` | `getPublicSettings` | `-` | `0x20000101` | `0x10b2e140` |
| `GET` | `v1/households/{householdId}/settings/protected/{setting}` | `getProtectedSettings` | `setting` | `0x20000101` | `0x10b30888` |
| `GET` | `v1/households/{householdId}/settings/protectedAdmin/{setting}` | `getProtectedAdminSettings` | `setting` | `0x20000101` | `0x10b30888` |
| `POST` | `v1/households/{householdId}/settings/protectedAdmin` | `setProtectedAdminSettings` | `-` | `0x20000102` | `0x10b2de8c` |

Op-level JSON keys recovered from op-object methods: `setting`, `networks`, `sonosnetEnabled`, `sonosnet`, `namespaces`, `targetSettingsOnly`, `setPlayerSettings`, `allowMicrophone`, `selfTruePlay`, `channel`, `delayMillis`, `groupName`, `updateAllSettings`, `userMetricsTracking`, `setRestrictedAdminSettings`

## `sleepTimer`

Group sleep timer — set/clear/read the 'sleep in N minutes' state, the muse-side twin of the `Sleep` argument on AVTransport.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/groups/{groupId}/sleepTimer` | `configureSleepTimer` | `-` | `0x20000102` | `0x10b33988` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/sleepTimer` | `configureSleepTimer` | `-` | `0x20000102` | `0x10b33988` |
| `GET` | `v1/groups/{groupId}/sleepTimer` | `getSleepTimer` | `-` | `0x20000101` | `0x10b33988` |
| `GET` | `v1/households/{householdId}/groups/{groupId}/sleepTimer` | `getSleepTimer` | `-` | `0x20000101` | `0x10b33988` |

Op-level JSON keys recovered from op-object methods: `duration`

## `smartplay`

SmartPlay per-household state — the update/firmware-reporting context that carries version/build fields for the smart update pipeline.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/smartplay/content` | `getContent` | `-` | `0x20000101` | — |

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `currentVersion`, `downloadSpeed`, `fromVersion`, `hardwareVersion`, `householdId`, `requestPath`, `serialNumber`, `sonosId`, `systemVersion`, `updateId`

## `soundSwap`

Home-theater sound-swap — POSTs that move/re-assign the front player role among bonded HT members (swap the TV-facing box). Player-scoped.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/soundSwap` | `triggerSwap` | `-` | `0x20000102` | `0x10b36038` |
| `POST` | `v1/households/{householdId}/players/{playerId}/soundSwap` | `triggerSwap` | `-` | `0x20000102` | `0x10b36038` |
| `POST` | `v1/players/{playerId}/soundSwap/request` | `requestSwap` | `-` | `0x20000102` | `0x10b36038` |
| `POST` | `v1/households/{householdId}/players/{playerId}/soundSwap/request` | `requestSwap` | `-` | `0x20000102` | `0x10b36038` |

Op-level JSON keys recovered from op-object methods: `playerId`

## `svc`

Sonos Voice Control surface ('svc' = Sonos Voice Control) — voice-assistant status and management on voice-capable players.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/svc/weatherConfig` | `setWeatherConfig` | `-` | `0x20000102` | `0x10b37d24` |
| `POST` | `v1/households/{householdId}/players/{playerId}/svc/weatherConfig` | `setWeatherConfig` | `-` | `0x20000102` | `0x10b37d24` |
| `GET` | `v1/players/{playerId}/svc/weatherConfig` | `getWeatherConfig` | `-` | `0x20000101` | `0x10b37d24` |
| `GET` | `v1/households/{householdId}/players/{playerId}/svc/weatherConfig` | `getWeatherConfig` | `-` | `0x20000101` | `0x10b37d24` |
| `POST` | `v1/players/{playerId}/svc/voiceCommand` | `voiceCommand` | `-` | `0x20000102` | `0x10b38110` |
| `POST` | `v1/households/{householdId}/players/{playerId}/svc/voiceCommand` | `voiceCommand` | `-` | `0x20000102` | `0x10b38110` |

Op-level JSON keys recovered from op-object methods: `enabled`, `geoLocation`, `voiceCommand`

## `systemReporting`

First-party telemetry/crash-report uploads — POST-only, `none`-scoped (these routes deliberately bypass household scoping so a misconfigured player can still report). Carries `systemReporting`, `zoneDefinition`, `channelMapSet`, `zones` fields plus `/accountSubscription`, `/productEvent`, `/softwareDownload` sub-paths.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/firmwareDownload` | `reportFirmwareDownload` | `-` | `0x20000102` | — |
| `POST` | `v1/households/{householdId}/systemReporting/firmwareDownload` | `reportFirmwareDownload` | `-` | `0x20000102` | — |
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/softwareDownload` | `reportSoftwareDownload` | `-` | `0x20000102` | — |
| `POST` | `v1/households/{householdId}/systemReporting/softwareDownload` | `reportSoftwareDownload` | `-` | `0x20000102` | — |
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/accountSubscription` | `reportAccountSubscription` | `-` | `0x20000102` | — |
| `POST` | `v1/households/{householdId}/systemReporting/accountSubscription` | `reportAccountSubscription` | `-` | `0x20000102` | — |
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/productEvent` | `reportProductEvent` | `-` | `0x20000102` | — |
| `POST` | `v1/households/{householdId}/systemReporting/productEvent` | `reportProductEvent` | `-` | `0x20000102` | — |

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `channelMapSet`, `name`, `zoneDefinition`

## `systemTime`

Household wall-clock/location time — GET reads the household clock state, PUT sets timezone/location-derived time used by alarms and schedules.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/systemTime/timeZone` | `getTimeZoneInfo` | `-` | `0x20000101` | `0x10b394fc` |
| `PUT` | `v1/households/{householdId}/systemTime/timeZone` | `setTimeZoneInfo` | `-` | `0x20000104` | `0x10b396c8` |

Op-level JSON keys recovered from op-object methods: `timeZoneInfo`

## `time`

Player-local time reads — GETs return the player's clock/status for alarm-trigger UI.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/time/relative` | `getRelativeTime` | `-` | `0x20000101` | — |
| `GET` | `v1/households/{householdId}/players/{playerId}/time/relative` | `getRelativeTime` | `-` | `0x20000101` | — |

## `timers`

Household/group timers — the scheduler behind alarms and sleep timers, backed by the SQLite `timers`/`paused_timers` tables.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/timers` | `getTimers` | `-` | `0x20000101` | `0x10b3f158` |
| `GET` | `v1/households/{householdId}/players/{playerId}/timers` | `getTimers` | `-` | `0x20000101` | `0x10b3f158` |
| `POST` | `v1/players/{playerId}/timers/create` | `createTimer` | `-` | `0x20000102` | `0x10b40e70` |
| `POST` | `v1/households/{householdId}/players/{playerId}/timers/create` | `createTimer` | `-` | `0x20000102` | `0x10b40e70` |
| `PUT` | `v1/players/{playerId}/timers/setDuration/{timerId}` | `setDuration` | `timerId` | `0x20000104` | `0x10b40e70` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/timers/setDuration/{timerId}` | `setDuration` | `timerId` | `0x20000104` | `0x10b40e70` |
| `PUT` | `v1/players/{playerId}/timers/setRelativeDuration/{timerId}` | `setRelativeDuration` | `timerId` | `0x20000104` | `0x10b40c7c` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/timers/setRelativeDuration/{timerId}` | `setRelativeDuration` | `timerId` | `0x20000104` | `0x10b40c7c` |
| `PUT` | `v1/players/{playerId}/timers/pause/{timerId}` | `pauseTimer` | `timerId` | `0x20000104` | `0x10b40a88` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/timers/pause/{timerId}` | `pauseTimer` | `timerId` | `0x20000104` | `0x10b40a88` |
| `PUT` | `v1/players/{playerId}/timers/resume/{timerId}` | `resumeTimer` | `timerId` | `0x20000104` | `0x10b404ac` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/timers/resume/{timerId}` | `resumeTimer` | `timerId` | `0x20000104` | `0x10b404ac` |
| `DELETE` | `v1/players/{playerId}/timers/{timerId}` | `abortTimer` | `timerId` | `0x20000108` | `0x10b40894` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/timers/{timerId}` | `abortTimer` | `timerId` | `0x20000108` | `0x10b40894` |

Op-level JSON keys recovered from op-object methods: `name`, `duration`, `timerId`

## `trueplay`

Trueplay room-tuning ops — start/update/query a tuning run on a home-theater player, tied to the `x-rincon-sonarcal` test-tone pipeline.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/trueplay/discovery` | `detectSpeakers` | `-` | `0x20000101` | `0x10b44798` |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueplay/discovery` | `detectSpeakers` | `-` | `0x20000101` | `0x10b44798` |
| `GET` | `v1/players/{playerId}/trueplay/presenceDiscovery` | `detectSpeakerPresence` | `-` | `0x20000101` | `0x10b44964` |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueplay/presenceDiscovery` | `detectSpeakerPresence` | `-` | `0x20000101` | `0x10b44964` |
| `DELETE` | `v1/players/{playerId}/trueplay/discovery` | `resetDetectedSpeaker` | `-` | `0x20000108` | `0x10b44b30` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/trueplay/discovery` | `resetDetectedSpeaker` | `-` | `0x20000108` | `0x10b44b30` |
| `POST` | `v1/players/{playerId}/trueplay/presenceRate` | `setSpeakerPresenceRate` | `-` | `0x20000102` | `0x10b467cc` |
| `POST` | `v1/households/{householdId}/players/{playerId}/trueplay/presenceRate` | `setSpeakerPresenceRate` | `-` | `0x20000102` | `0x10b467cc` |
| `GET` | `v1/players/{playerId}/trueplay/config/{id}` | `getConfiguration` | `id` | `0x20000101` | `0x10b467cc` |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueplay/config/{id}` | `getConfiguration` | `id` | `0x20000101` | `0x10b467cc` |
| `POST` | `v1/players/{playerId}/trueplay/config/{id}` | `setConfiguration` | `id` | `0x20000102` | `0x10b4566c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/trueplay/config/{id}` | `setConfiguration` | `id` | `0x20000102` | `0x10b4566c` |
| `GET` | `v1/players/{playerId}/trueplay/status` | `getTrueplayStatus` | `-` | `0x20000101` | `0x10b4566c` |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueplay/status` | `getTrueplayStatus` | `-` | `0x20000101` | `0x10b4566c` |

Op-level JSON keys recovered from op-object methods: `duration`, `rate`, `id`, `trueplayConfig`

## `trueroom`

Trueroom adaptive tuning — the successor to one-shot Trueplay: `estimatorConfiguration`, `adaptation`, `calibrationStatus`, `swapInputMute`. POSTs run the continuous-tuning estimator and query its adaptation state.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/trueroom/estimatorConfiguration` | `estimatorConfiguration` | `-` | `0x20000101` | `0x10b49438` |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueroom/estimatorConfiguration` | `estimatorConfiguration` | `-` | `0x20000101` | `0x10b49438` |
| `POST` | `v1/players/{playerId}/trueroom/adaptation` | `adaptation` | `-` | `0x20000102` | `0x10b4aa44` |
| `POST` | `v1/households/{householdId}/players/{playerId}/trueroom/adaptation` | `adaptation` | `-` | `0x20000102` | `0x10b4aa44` |
| `GET` | `v1/players/{playerId}/trueroom/calibrationStatus` | `getCalibrationStatus` | `-` | `0x20000101` | `0x10b4aa44` |
| `GET` | `v1/households/{householdId}/players/{playerId}/trueroom/calibrationStatus` | `getCalibrationStatus` | `-` | `0x20000101` | `0x10b4aa44` |
| `POST` | `v1/players/{playerId}/trueroom/successTone` | `playSuccessTone` | `-` | `0x20000102` | `0x10b49b68` |
| `POST` | `v1/households/{householdId}/players/{playerId}/trueroom/successTone` | `playSuccessTone` | `-` | `0x20000102` | `0x10b49b68` |
| `POST` | `v1/players/{playerId}/trueroom/swapInputMute` | `setSwapInputMute` | `-` | `0x20000102` | `0x10b4926c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/trueroom/swapInputMute` | `setSwapInputMute` | `-` | `0x20000102` | `0x10b4926c` |

Op-level JSON keys recovered from op-object methods: `trueroomEstimatedParams`, `mute`

## `update`

Household software update — check, schedule, and apply firmware across the household.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/update/check` | `checkForUpdate` | `-` | `0x20000102` | `0x10b4df64` |
| `POST` | `v1/households/{householdId}/players/{playerId}/update/check` | `checkForUpdate` | `-` | `0x20000102` | `0x10b4df64` |
| `POST` | `v1/players/{playerId}/update/firmware` | `beginSoftwareUpdate` | `-` | `0x20000102` | `0x10b4df64` |
| `POST` | `v1/households/{householdId}/players/{playerId}/update/firmware` | `beginSoftwareUpdate` | `-` | `0x20000102` | `0x10b4df64` |
| `GET` | `v1/players/{playerId}/update/status` | `getUpdateStatus` | `-` | `0x20000101` | `0x10b4dd70` |
| `GET` | `v1/households/{householdId}/players/{playerId}/update/status` | `getUpdateStatus` | `-` | `0x20000101` | `0x10b4dd70` |

Op-level JSON keys recovered from op-object methods: `useCachedOnly`, `updateType`, `assertion`

## `upnpAVTransport`

The SOAP AVTransport service exposed over muse — every route proxies a UPnP action (subscribe/get) so the modern app can drive transport through the same mux as everything else. Field names and semantics are exactly the SOAP arguments.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpAVTransport` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAVTransport` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpAVTransport/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAVTransport/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpAVTransport/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAVTransport/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpAVTransport/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpAVTransport/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpAlarmClock`

SOAP AlarmClock over muse — list/create/update/delete alarms via the mux.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpAlarmClock` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAlarmClock` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpAlarmClock/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAlarmClock/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpAlarmClock/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAlarmClock/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpAlarmClock/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpAlarmClock/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpAudioIn`

SOAP AudioIn over muse — line-in source config/state.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpAudioIn` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAudioIn` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpAudioIn/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAudioIn/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpAudioIn/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpAudioIn/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpAudioIn/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpAudioIn/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpConnectionManager`

SOAP ConnectionManager over muse — protocol-info listing.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpConnectionManager` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpConnectionManager` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpConnectionManager/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpConnectionManager/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpConnectionManager/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpConnectionManager/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpConnectionManager/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpConnectionManager/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpContentDirectory`

SOAP ContentDirectory over muse — browse/search/containers.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpContentDirectory` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpContentDirectory` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpContentDirectory/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpContentDirectory/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpContentDirectory/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpContentDirectory/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpContentDirectory/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpContentDirectory/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpDeviceProperties`

SOAP DeviceProperties over muse — device attributes/settings.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpDeviceProperties` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpDeviceProperties` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpDeviceProperties/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpDeviceProperties/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpDeviceProperties/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpDeviceProperties/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpDeviceProperties/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpDeviceProperties/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpGroupManagement`

SOAP GroupManagement over muse — group coordinator ops.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpGroupManagement` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupManagement` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpGroupManagement/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupManagement/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpGroupManagement/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupManagement/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpGroupManagement/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpGroupManagement/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpGroupRenderingControl`

SOAP GroupRenderingControl over muse — group volume/mute.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpGroupRenderingControl` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupRenderingControl` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpGroupRenderingControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupRenderingControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpGroupRenderingControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpGroupRenderingControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpGroupRenderingControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpGroupRenderingControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpHTControl`

SOAP HTControl over muse — home-theater control.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpHTControl` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpHTControl` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpHTControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpHTControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpHTControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpHTControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpHTControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpHTControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpMusicServices`

SOAP MusicServices over muse — SMAPI account listing.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpMusicServices` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpMusicServices` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpMusicServices/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpMusicServices/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpMusicServices/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpMusicServices/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpMusicServices/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpMusicServices/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpQueue`

SOAP Queue over muse — queue browse/ops.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpQueue` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpQueue` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpQueue/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpQueue/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpQueue/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpQueue/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpQueue/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpQueue/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpRenderingControl`

SOAP RenderingControl over muse — per-player volume/EQ.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpRenderingControl` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpRenderingControl` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpRenderingControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpRenderingControl/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpRenderingControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpRenderingControl/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpRenderingControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpRenderingControl/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpSystemProperties`

SOAP SystemProperties over muse — system keys.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpSystemProperties` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpSystemProperties` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpSystemProperties/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpSystemProperties/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpSystemProperties/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpSystemProperties/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpSystemProperties/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpSystemProperties/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpVirtualLineIn`

SOAP VirtualLineIn over muse — virtual line-in sources.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpVirtualLineIn` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpVirtualLineIn` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpVirtualLineIn/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpVirtualLineIn/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpVirtualLineIn/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpVirtualLineIn/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpVirtualLineIn/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpVirtualLineIn/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

## `upnpZoneGroupTopology`

SOAP ZoneGroupTopology over muse — topology state/subscription.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/upnpZoneGroupTopology` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpZoneGroupTopology` | `call` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpZoneGroupTopology/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpZoneGroupTopology/subscription` | `subscribe` | `-` | `0x20000102` | `0x10b50ab8` |
| `POST` | `v1/players/{playerId}/upnpZoneGroupTopology/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/upnpZoneGroupTopology/subscription/{logicalSID}` | `renew` | `logicalSID` | `0x20000102` | `0x10b5138c` |
| `DELETE` | `v1/players/{playerId}/upnpZoneGroupTopology/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/upnpZoneGroupTopology/subscription/{logicalSID}` | `unsubscribe` | `logicalSID` | `0x20000108` | `0x10b5138c` |

Op-level JSON keys recovered from op-object methods: `headers`, `input`, `output`, `method`, `durationSecs`, `logicalSID`

Field vocabulary (request/response keys seen in the resource's client tables — not yet bound to individual ops): `query:includeDeviceInfo`

## `virtualLineIn`

Native muse virtual-line-in surface (distinct from the upnp* proxy): configure/manage virtual line-in sources for a player.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/virtualLineIn/selectSource` | `selectSource` | `-` | `0x20000102` | `0x10b84014` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/selectSource` | `selectSource` | `-` | `0x20000102` | `0x10b84014` |
| `POST` | `v1/players/{playerId}/virtualLineIn/startTransmission` | `startTransmission` | `-` | `0x20000102` | `0x10b84014` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/startTransmission` | `startTransmission` | `-` | `0x20000102` | `0x10b84014` |
| `POST` | `v1/players/{playerId}/virtualLineIn/stopTransmission` | `stopTransmission` | `-` | `0x20000102` | `0x10b84414` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/stopTransmission` | `stopTransmission` | `-` | `0x20000102` | `0x10b84414` |
| `POST` | `v1/players/{playerId}/virtualLineIn/sendBackChannelCmd` | `sendBackChannelCmd` | `-` | `0x20000102` | `0x10b84214` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/sendBackChannelCmd` | `sendBackChannelCmd` | `-` | `0x20000102` | `0x10b84214` |
| `POST` | `v1/players/{playerId}/virtualLineIn/startAudio` | `startAudio` | `-` | `0x20000102` | `0x10b84614` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/startAudio` | `startAudio` | `-` | `0x20000102` | `0x10b84614` |
| `POST` | `v1/players/{playerId}/virtualLineIn/stopAudio` | `stopAudio` | `-` | `0x20000102` | `0x10b8309c` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/stopAudio` | `stopAudio` | `-` | `0x20000102` | `0x10b8309c` |

Op-level JSON keys recovered from op-object methods: `source`, `backChannelCmd`

## `virtualRemoteControl`

Virtual remote — send remote-button events to a player through muse (related to `pinewood` but button-event oriented).

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/virtualRemoteControl/buttonCommand` | `sendButtonCommand` | `-` | `0x20000102` | — |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualRemoteControl/buttonCommand` | `sendButtonCommand` | `-` | `0x20000102` | — |

## `voice`

Voice assistant integration state — assistant enablement/locale on voice players.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/voice/accounts` | `getVoiceAccounts` | `-` | `0x20000101` | `0x10b89b4c` |
| `GET` | `v1/households/{householdId}/players/{playerId}/voice/accounts` | `getVoiceAccounts` | `-` | `0x20000101` | `0x10b89b4c` |
| `POST` | `v1/players/{playerId}/voice/accounts` | `createVoiceAccount` | `-` | `0x20000102` | `0x10b8a358` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/accounts` | `createVoiceAccount` | `-` | `0x20000102` | `0x10b8a358` |
| `POST` | `v1/players/{playerId}/voice/accounts/{accountId}` | `updateVoiceAccount` | `accountId` | `0x20000102` | `0x10b8a358` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/accounts/{accountId}` | `updateVoiceAccount` | `accountId` | `0x20000102` | `0x10b8a358` |
| `DELETE` | `v1/players/{playerId}/voice/accounts/{accountId}` | `removeVoiceAccount` | `accountId` | `0x20000108` | `0x10b8a124` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/voice/accounts/{accountId}` | `removeVoiceAccount` | `accountId` | `0x20000108` | `0x10b8a124` |
| `POST` | `v1/players/{playerId}/voice/amazonChallenge` | `createAmazonChallenge` | `-` | `0x20000102` | `0x10b8ae74` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/amazonChallenge` | `createAmazonChallenge` | `-` | `0x20000102` | `0x10b8ae74` |
| `POST` | `v1/players/{playerId}/voice/setup` | `notifyInitiateOnboarding` | `-` | `0x20000102` | `0x10b8b670` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/setup` | `notifyInitiateOnboarding` | `-` | `0x20000102` | `0x10b8b670` |

Op-level JSON keys recovered from op-object methods: `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `nickname`, `status`, `wakeword`, `amazon`, `accountId`

## `zones`

Zone listing for a household — the zone view of topology (players + groups as user-facing zones). NOTE: the extracted field vocabulary for this resource over-captured into the binary's error-string region, so its field list is not a clean schema — treat ops/paths as proven and field names as noisy.

| Method | Path | Op | Trailing param | Flags | Exec |
|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/zones` | `getActiveZoneList` | `-` | `0x20000101` | `0x10b93eb4` |
| `GET` | `v1/households/{householdId}/zones/definition/{zoneId}` | `getZoneDefinition` | `zoneId` | `0x20000101` | `0x10b97690` |
| `GET` | `v1/households/{householdId}/zones/definition` | `getZoneDefinitionList` | `-` | `0x20000101` | `0x10b97690` |
| `POST` | `v1/households/{householdId}/zones/definition` | `addZoneDefinition` | `-` | `0x20000102` | `0x10b95284` |
| `POST` | `v1/households/{householdId}/zones/missingDefinition` | `addMissingZoneDefinition` | `-` | `0x20000102` | `0x10b95284` |
| `PUT` | `v1/households/{householdId}/zones/definition/{zoneId}` | `updateZoneDefinition` | `zoneId` | `0x20000104` | `0x10b94c9c` |
| `PUT` | `v1/households/{householdId}/zones/activeZone/{zoneId}` | `updateActiveZone` | `zoneId` | `0x20000104` | `0x10b94c9c` |
| `PUT` | `v1/households/{householdId}/zones/memberSettings/{zoneId}` | `updateZoneMemberSettings` | `zoneId` | `0x20000104` | `0x10b95554` |
| `DELETE` | `v1/households/{householdId}/zones/definition/{zoneId}` | `removeZoneDefinition` | `zoneId` | `0x20000108` | `0x10b95838` |
| `PUT` | `v1/households/{householdId}/zones/activate/{zoneId}` | `activateZone` | `zoneId` | `0x20000104` | `0x10b97884` |
| `PUT` | `v1/households/{householdId}/zones/deactivate/{zoneId}` | `deactivateZone` | `zoneId` | `0x20000104` | `0x10b97080` |
| `PUT` | `v1/players/{playerId}/zones/join/{zoneId}` | `joinZone` | `zoneId` | `0x20000104` | `0x10b94a80` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/zones/join/{zoneId}` | `joinZone` | `zoneId` | `0x20000104` | `0x10b94a80` |
| `PUT` | `v1/players/{playerId}/zones/unjoin/{zoneId}` | `unjoinZone` | `zoneId` | `0x20000104` | `0x10b94a80` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/zones/unjoin/{zoneId}` | `unjoinZone` | `zoneId` | `0x20000104` | `0x10b94a80` |

Op-level JSON keys recovered from op-object methods: `zoneId`, `channelMapSet`, `name`, `settings`, `isHomeTheater`, `fronthaulChannel`, `backhaulChannel`, `flatChannelMapSet`

## Unresolved

237 of 265 distinct verbs have recovered implementations (verb->factory->vtable->execute chains; 558 of 603 route records carry an 'impl' block and 473 carry extracted op-field lists). The 28 unbound verbs are all registration/reporting/household-listing ops (initDeviceRegistration, completeDeviceRegistration, refreshDeviceRegistration, getDeviceRegistrations, getUserDeviceRegistrations, deregisterDevice, removeDevice, getDevices, getHousehold(s), getHouseholdLocation, setLocation, setName, setPowerPolicy, getInfo, getRelativeTime, sendButtonCommand, translate, batchTranslate, getUsers, createInvite, redeemInvite, deleteInvite, getContent, reportFirmwareDownload, reportSoftwareDownload, reportAccountSubscription, reportProductEvent) — they register through a path that does not use the {verb,factory} store pattern, consistent with being forwarded/served by the household coordinator or cloud channel rather than a per-op local object; their handler bodies are not in this binary's local op map. Per-op 'fields' lists are JSON keys referenced inside the op object's own methods — a strong lower bound, not proven-complete schemas; nested-object shape, types, requiredness and enum domains remain undetermined.

<details><summary>Evidence (5)</summary>

- @ 0x10e7a68c — route record array head (householdId dialect)
- @ 0x10e783f8 — route record array head ({HHID} dialect)
- @ 0x100d36c0 — handler stub r8=0 -> f_100d2e18
- @ 0x100d36e4 — handler stub r8=1 -> f_100d2e18
- @ 0x100d2e18 — request normalizer + dispatcher

</details>
