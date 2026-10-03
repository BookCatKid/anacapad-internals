# muse resources: Content, library & music services

The content side: the local music library index, music-service account bindings, playlists, favorites, catalog browsing, play history and entitlements. ContentDirectory and MusicServices are the SOAP ancestors of most of this.

## `localContentLibrary`

The local music library over the modern API: your indexed share folders, their contents, and library maintenance exposed as JSON resources. It's the modern front-end for the same library the classic browse service serves, so the app can manage 'Music Library' without the old protocol.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/localContentLibrary` | `getShares` | `-` | `0x20000101` | `0x10afb944` `0x10afb954` | none | c1:`ok`:`upnpEvent`<br>c2:`sharesList`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/localContentLibrary` | `addShare` | `-` | `0x20000102` | `0x10afb954` `0x10afb964` | `path` | c2:`sharesList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c7:`share`:`batteryCells` `globalError`:`commandHeader` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`upnpEvent` `globalError`:`authorizationGrantHeader` `globalError`:`audioClipStatus` |
| `DELETE` | `v1/households/{householdId}/localContentLibrary/{shareId}` | `removeShare` | `shareId` | `0x20000108` | `0x10afb964` `0x10afb974` | `path`, `shareId` | c7:`share`:`batteryCells` `globalError`:`commandHeader` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`upnpEvent` `globalError`:`authorizationGrantHeader` `globalError`:`audioClipStatus`<br>c5:`ok`:`upnpEvent` `globalError`:`commandHeader` `globalError`:`chirpRequest` `globalError`:`authorizationGrantHeader` `globalError`:`audioConnectorStatus`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair` |
| `POST` | `v1/households/{householdId}/localContentLibrary/reindex` | `reindex` | `-` | `0x20000102` | `0x10afb974` `0x10afb984` | `shareId` | c5:`ok`:`upnpEvent` `globalError`:`commandHeader` `globalError`:`chirpRequest` `globalError`:`authorizationGrantHeader` `globalError`:`audioConnectorStatus`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`batteryCells` `globalError`:`authorizationGrantHeader` |
| `GET` | `v1/players/{playerId}/localContentLibrary/indexer` | `getIndexerStatus` | `-` | `0x20000101` | `0x10afb984` `0x10afb994` desc:`10afe1ac` `10afe1bc` `10b01a9c` `10b01aac` `10b01abc` `10b01acc` `10b01adc` `10b01aec` `10b01afc` | none | c2:`ok`:`batteryCells` `globalError`:`authorizationGrantHeader`<br>c2:`ok`:`batteryCells` `globalError`:`authorizationGrantHeader`<br>c2:`indexerStatus`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c2:`indexerStatus`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `GET` | `v1/households/{householdId}/players/{playerId}/localContentLibrary/indexer` | `getIndexerStatus` | `-` | `0x20000101` | `0x10afb984` `0x10afb994` desc:`10afe1ac` `10afe1bc` `10b01a9c` `10b01aac` `10b01abc` `10b01acc` `10b01adc` `10b01aec` `10b01afc` | none | c2:`ok`:`batteryCells` `globalError`:`authorizationGrantHeader`<br>c2:`ok`:`batteryCells` `globalError`:`authorizationGrantHeader`<br>c2:`indexerStatus`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c2:`indexerStatus`:`upnpEvent` `globalError`:`wiredSubStatus` |

::: details Recovered vocabulary & internals

Related enum registrations (proven integer values, see `enum_tables`):

- **replication_state**: `PENDING_ADD`=1, `ADD_IN_PROGRESS`=2, `ADD_COMPLETE`=3, `PENDING_REINDEXING`=4, `REINDEXING_IN_PROGRESS`=5, `REINDEXING_COMPLETE`=6, `REPLICATION_IN_PROGRESS`=7, `REPLICATION_COMPLETE`=8, `PENDING_DELETE`=9, `DELETE_COMPLETE`=10

Op-level JSON keys recovered from op-object methods: `muse`, `path`, `username`, `password`, `shareId`


:::

## `musicServiceAccounts`

Streaming-service accounts over the modern API: the JSON version of the account-management family, covering adding a service login, replacing credentials, setting a nickname, and removing an account. These are the routes behind the app's service account settings.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/households/{householdId}/musicServiceAccounts/match` | `match` | `-` | `0x20000102` | `0x10b01aac` `0x10b01abc` | `userIdHashCode` | c1:`ok`:`upnpEvent`<br>c3:`musicServiceAccount`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`artist` |
| `POST` | `v1/households/{householdId}/musicServiceAccounts/preferred` | `setPreferredMusicServiceAccount` | `-` | `0x20000102` | `0x10b01abc` `0x10b01acc` | `userIdHashCode`, `accountId` | c3:`musicServiceAccount`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`artist`<br>c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` |
| `GET` | `v1/households/{householdId}/musicServiceAccounts/preferred` | `getPreferredMusicServiceAccount` | `-` | `0x20000101` | `0x10b01acc` `0x10b01adc` | `accountId` | c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c3:`musicServiceAccount`:`upnpEvent` `globalError`:`area` `globalError`:`amazonChallenge` |
| `POST` | `v1/groups/{groupId}/musicServiceAccounts/startDirectControlEx` | `startDirectControlEx` | `-` | `0x20000102` | `0x10b01adc` `0x10b01aec` | `appId` | c3:`musicServiceAccount`:`upnpEvent` `globalError`:`area` `globalError`:`amazonChallenge`<br>c3:`musicServiceAccount`:`upnpEvent` `globalError`:`area` `globalError`:`amazonChallenge`<br>c4:`musicServiceAccount`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c4:`musicServiceAccount`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/musicServiceAccounts/startDirectControlEx` | `startDirectControlEx` | `-` | `0x20000102` | `0x10b01adc` `0x10b01aec` | `appId` | c3:`musicServiceAccount`:`upnpEvent` `globalError`:`area` `globalError`:`amazonChallenge`<br>c3:`musicServiceAccount`:`upnpEvent` `globalError`:`area` `globalError`:`amazonChallenge`<br>c4:`musicServiceAccount`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c4:`musicServiceAccount`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` |
| `POST` | `v1/groups/{groupId}/musicServiceAccounts/endDirectControl` | `endDirectControl` | `-` | `0x20000102` | `0x10b01aec` `0x10b01afc` | `appId` | c4:`musicServiceAccount`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c4:`musicServiceAccount`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice`<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/musicServiceAccounts/endDirectControl` | `endDirectControl` | `-` | `0x20000102` | `0x10b01aec` `0x10b01afc` | `appId` | c4:`musicServiceAccount`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c4:`musicServiceAccount`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice`<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` |

::: details Recovered vocabulary & internals

Related enum registrations (proven integer values, see `enum_tables`):

- **account_link_state**: `RESET`=1, `OFFLINE`=2, `INITIATING`=3, `ONLINE`=4, `TERMINATING`=5, `ERROR`=6
- **content_object_type**: `ALBUM`=1, `ARTIST`=2, `AUDIOBOOK`=3, `CHAPTER`=4, `SMAPI_CONTAINER`=5, `EPISODE`=6, `PLAYLIST`=7, `PODCAST`=8, `PROGRAM`=9, `STREAM`=10, `TRACK`=11
- **service_kind**: `radio`=1, `reporting`=2, `audiobook`=3, `browse`=4
- **service_tier**: `none`=1, `free`=2, `paidLimited`=3, `paidPremium`=4
- **session_state**: `RESET`=1, `OFFLINE`=2, `ONLINE`=3, `ROOT_INDIRECT`=4, `BROADCAST_BLOCKED`=5
- **session_state2**: `RESET`=1, `OFFLINE`=2, `INITIATING`=3, `ONLINE`=4, `ERROR`=5
- **smapi_capability_bits**: `basic-ui`=1, `content`=1, `no-ads`=1, `media-sources`=1, `commercial-msp`=2, `content-saving`=2, `hd-content`=2, `third-party-integ`=2, `essentials-msp`=4, `settings`=4, `special-content`=4, `premium-msp`=8, `alarms`=8, `on-demand-archive`=8, `dashboard-access`=16, `messaging`=16, `can-skip`=16, `schedules-access`=32, `save-groups`=32

Op-level JSON keys recovered from op-object methods: `muse`, `userIdHashCode`, `nickname`, `serviceId`, `linkCode`, `linkDeviceId`, `accountId`, `appId`, `restartToken`


:::

## `playlists`

Sonos playlists over the modern API: the saved-queue feature as resources, covering listing the playlists stored on the system, creating new ones, editing their contents, and deleting them. It's the JSON surface behind 'Sonos Playlists' in the app.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/playlists` | `getPlaylists` | `-` | `0x20000101` | `0x10b12e78` `0x10b12e88` desc:`10b1b2bc` `10b1b2cc` `10b1b2dc` `10b1b2ec` | none | c1:`ok`:`upnpEvent`<br>c2:`playlistsList`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `GET` | `v1/households/{householdId}/playlists/{playlistId}` | `getPlaylist` | `playlistId` | `0x20000101` | `0x10b12e88` `0x10b12e98` desc:`10b1b2fc` `10b1b30c` `10b1b31c` `10b1b32c` | `playlistId` | c2:`playlistsList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`playlistSummary`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`deviceInfo` |
| `POST` | `v1/households/{householdId}/playlists/getPlaylist` | `postPlaylist` | `-` | `0x20000102` | `0x10b12e98` `0x10b12ea8` desc:`10b1b33c` `10b1b34c` `10b1b35c` `10b1b36c` | `playlistId` | c3:`playlistSummary`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`deviceInfo`<br>c3:`playlistSummary`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` |
| `POST` | `v1/groups/{groupId}/playlists` | `loadPlaylist` | `-` | `0x20000102` | `0x10b12ea8` `0x10b12eb8` desc:`10b1b37c` `10b1b38c` `10b1b39c` `10b1b3ac` | `playlistId`, `playOnCompletion`, `playModes`, `playModes` | c3:`playlistSummary`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c3:`playlistSummary`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c9:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` `globalError`:`allowAirplaySetting` `globalError`:`chirpRequest` `globalError`:`upnpEvent` `globalError`:`alarmDescription` `globalError`:`alarm`<br>c9:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` `globalError`:`allowAirplaySetting` `globalError`:`chirpRequest` `globalError`:`upnpEvent` `globalError`:`alarmDescription` `globalError`:`alarm` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/playlists` | `loadPlaylist` | `-` | `0x20000102` | `0x10b12ea8` `0x10b12eb8` desc:`10b1b37c` `10b1b38c` `10b1b39c` `10b1b3ac` | `playlistId`, `playOnCompletion`, `playModes`, `playModes` | c3:`playlistSummary`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c3:`playlistSummary`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c9:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` `globalError`:`allowAirplaySetting` `globalError`:`chirpRequest` `globalError`:`upnpEvent` `globalError`:`alarmDescription` `globalError`:`alarm`<br>c9:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` `globalError`:`allowAirplaySetting` `globalError`:`chirpRequest` `globalError`:`upnpEvent` `globalError`:`alarmDescription` `globalError`:`alarm` |

::: details Recovered vocabulary & internals

Related enum registrations (proven integer values, see `enum_tables`):

- **content_object_type**: `ALBUM`=1, `ARTIST`=2, `AUDIOBOOK`=3, `CHAPTER`=4, `SMAPI_CONTAINER`=5, `EPISODE`=6, `PLAYLIST`=7, `PODCAST`=8, `PROGRAM`=9, `STREAM`=10, `TRACK`=11

Op-level JSON keys recovered from op-object methods: `muse`, `playlistId`, `playOnCompletion`, `action`, `playModes`, `playbackLocation`


:::

## `favorites`

The favorites list over the modern API: your saved stations, playlists, and items managed as plain API resources, covering listing what's saved, adding new favorites, and removing old ones. It's the JSON counterpart of the favorites the classic library service tracks.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/favorites` | `getFavorites` | `-` | `0x20000101` | `0x101cc9d0` `0x101cc9e0` | none | c1:`ok`:`upnpEvent`<br>c2:`favoritesList`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `POST` | `v1/groups/{groupId}/favorites` | `loadFavorite` | `-` | `0x20000102` | `0x101cc9e0` `0x101cc9f0` | `playOnCompletion`, `favoriteId`, `playModes`, `playModes`, `action` | c2:`favoritesList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c2:`favoritesList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c10:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` `globalError`:`album` `globalError`:`allowAirplaySetting` `globalError`:`chirpRequest` `globalError`:`upnpEvent` `globalError`:`alarmDescription` `globalError`:`alarm`<br>c1:`ok`:`upnpEvent`<br>c10:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` `globalError`:`album` `globalError`:`allowAirplaySetting` `globalError`:`chirpRequest` `globalError`:`upnpEvent` `globalError`:`alarmDescription` `globalError`:`alarm`<br>c1:`ok`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/favorites` | `loadFavorite` | `-` | `0x20000102` | `0x101cc9e0` `0x101cc9f0` | `playOnCompletion`, `favoriteId`, `playModes`, `playModes`, `action` | c2:`favoritesList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c2:`favoritesList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c10:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` `globalError`:`album` `globalError`:`allowAirplaySetting` `globalError`:`chirpRequest` `globalError`:`upnpEvent` `globalError`:`alarmDescription` `globalError`:`alarm`<br>c1:`ok`:`upnpEvent`<br>c10:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` `globalError`:`album` `globalError`:`allowAirplaySetting` `globalError`:`chirpRequest` `globalError`:`upnpEvent` `globalError`:`alarmDescription` `globalError`:`alarm`<br>c1:`ok`:`upnpEvent` |

::: details Recovered vocabulary & internals

Related enum registrations (proven integer values, see `enum_tables`):

- **content_object_type**: `ALBUM`=1, `ARTIST`=2, `AUDIOBOOK`=3, `CHAPTER`=4, `SMAPI_CONTAINER`=5, `EPISODE`=6, `PLAYLIST`=7, `PODCAST`=8, `PROGRAM`=9, `STREAM`=10, `TRACK`=11
- **rating_values**: `STAR`=1, `THUMBSUP`=2, `THUMBSDOWN`=3, `LOVE`=4, `HATE`=5, `BAN`=6, `NONE`=7, `SHELVED`=8

Op-level JSON keys recovered from op-object methods: `muse`, `playOnCompletion`, `favoriteId`, `action`, `playModes`


:::

## `catalog`

The music catalog surface: browsable service content (a service's playlists, charts, stations, and directories) exposed to the app as API resources. It bridges the old browse-the-catalog model into the modern JSON interface, so apps can walk a service's content tree through the same kind of calls they use for everything else.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/services/{serviceId}/catalog/id/{objectId}` | `translate` | `objectId` | `0x20000101` | outbound-fwd | none | none |
| `GET` | `v1/households/{householdId}/services/{serviceId}/catalog/id/{objectId}` | `translate` | `objectId` | `0x20000101` | outbound-fwd | none | none |
| `GET` | `v1/services/{serviceId}/catalog/ids` | `batchTranslate` | `-` | `0x20000101` | outbound-fwd | none | none |
| `GET` | `v1/households/{householdId}/services/{serviceId}/catalog/ids` | `batchTranslate` | `-` | `0x20000101` | outbound-fwd | none | none |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10ad6210`

Field vocabulary recovered from the resource's implementation functions: `catalog`


:::

## `history`

Playback history: what this player has played recently, exposed as an API resource. Features that show your listening history (or that report it) draw their data from these routes.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/history` | `getHistory` | `-` | `0x20000101` | `0x10aefcc4` `0x10aefcd4` | none | c2:`ok`:`upnpEvent` `globalError`:`bluetooth`<br>c3:`contentPagedResources`:`upnpEvent` `globalError`:`bluetooth` `globalError`:`bluetoothPairing` |
| `POST` | `v1/households/{householdId}/history` | `postHistory` | `-` | `0x20000102` | `0x10aefcd4` `0x10aefce4` | `postHistory`, `postHistory`, `postHistory`, `postHistory` | c3:`contentPagedResources`:`upnpEvent` `globalError`:`bluetooth` `globalError`:`bluetoothPairing`<br>c1:`contentPagedResources`:`upnpEvent` |
| `DELETE` | `v1/households/{householdId}/history/{id}` | `removeHistoryItem` | `id` | `0x20000108` | `0x10aefce4` `0x10aefcf4` desc:`10af3468` | `postHistory`, `postHistory`, `postHistory`, `postHistory`, `id` | c1:`contentPagedResources`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`bluetooth` |
| `DELETE` | `v1/households/{householdId}/history` | `clearHistory` | `-` | `0x20000108` | `0x10aefcf4` `0x10aefd04` | `id` | c2:`ok`:`upnpEvent` `globalError`:`bluetooth`<br>c2:`ok`:`upnpEvent` `globalError`:`bluetooth` |

::: details Recovered vocabulary & internals

Related enum registrations (proven integer values, see `enum_tables`):

- **content_object_type**: `ALBUM`=1, `ARTIST`=2, `AUDIOBOOK`=3, `CHAPTER`=4, `SMAPI_CONTAINER`=5, `EPISODE`=6, `PLAYLIST`=7, `PODCAST`=8, `PROGRAM`=9, `STREAM`=10, `TRACK`=11

Op-level JSON keys recovered from op-object methods: `muse`, `postHistory`, `id`

Field vocabulary (request/response keys seen in the resource's client tables, not yet bound to individual ops): `action`, `advertisingInfo`, `allowTvPauseRestore`, `containerId`, `containerMetadata`, `defaults`, `deltaMillis`, `deviceFeedback`, `deviceId`, `id`, `instanceId`, `itemId`, `metadata`, `playModes`, `playOnCompletion`, `playbackAction`, `playbackLocation`, `positionMillis`, `queueAction`, `stationId`, `trackNumber`, `tracks`, `type`


:::

## `entitlements`

Which features this household is entitled to: the license and entitlement surface telling the system (and the app) which capabilities are unlocked, covering subscriptions, feature flags, and regional eligibility. It's the gatekeeping data behind 'this feature isn't available on your system'.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/users/{userId}/entitlements` | `getUserEntitlements` | `-` | `0x20000101` | `0x10ae4b84` `0x10ae4b94` | none | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c2:`entitlementsList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c2:`entitlementsList`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `GET` | `v1/households/{householdId}/users/{userId}/entitlements` | `getUserEntitlements` | `-` | `0x20000101` | `0x10ae4b84` `0x10ae4b94` | none | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c2:`entitlementsList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c2:`entitlementsList`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `GET` | `v1/households/{householdId}/entitlements` | `getEntitlements` | `-` | `0x20000101` | `0x10ae4b94` `0x10ae4ba4` desc:`10ae9208` `10ae9218` `10ae9228` `10ae9238` `10ae9248` `10ae9258` `10aec758` `10aec768` `10aec778` `10aec788` `10aec798` | none | c2:`entitlementsList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c2:`entitlementsList`:`upnpEvent` `globalError`:`wiredSubStatus` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `muse`

Field vocabulary (request/response keys seen in the resource's client tables, not yet bound to individual ops): `areaIds`, `musicContextGroupId`, `playerIds`, `playerIdsToAdd`, `playerIdsToRemove`


:::

## `audioClip`

The audio-clip feature: short sounds the system can play over whatever else is going on, like a doorbell chime ringing through every speaker, an intercom-style announcement, or a system alert tone. These routes cover uploading a clip into the household and triggering it to play, so a smart doorbell or home-automation event can make the speakers speak.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/audioClip` | `loadAudioClip` | `-` | `0x20000102` | `0x10ad0378` `0x10ad0388` | `clipBehavior`, `clipBehavior`, `volume`, `name`, `clipMetadata`, `clipMetadata` | c2:`ok`:`upnpEvent` `globalError`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`upnpEvent`<br>c9:`audioClip`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`channelMapPair` `globalError`:`accessPolicyControl` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`accessPolicySetting` `globalError`:`upnpEvent`<br>c9:`audioClip`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`channelMapPair` `globalError`:`accessPolicyControl` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`accessPolicySetting` `globalError`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/players/{playerId}/audioClip` | `loadAudioClip` | `-` | `0x20000102` | `0x10ad0378` `0x10ad0388` | `clipBehavior`, `clipBehavior`, `volume`, `name`, `clipMetadata`, `clipMetadata` | c2:`ok`:`upnpEvent` `globalError`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`upnpEvent`<br>c9:`audioClip`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`channelMapPair` `globalError`:`accessPolicyControl` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`accessPolicySetting` `globalError`:`upnpEvent`<br>c9:`audioClip`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`channelMapPair` `globalError`:`accessPolicyControl` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`accessPolicySetting` `globalError`:`upnpEvent` |
| `DELETE` | `v1/players/{playerId}/audioClip/{id}` | `cancelAudioClip` | `id` | `0x20000108` | `0x10ad0388` `0x10ad0398` desc:`10ad4b7c` `10ad4b8c` `10ad4b9c` `10ad4bac` `10ad4bbc` | `clipBehavior`, `clipBehavior`, `volume`, `name`, `clipMetadata`, `clipMetadata`, `id` | c9:`audioClip`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`channelMapPair` `globalError`:`accessPolicyControl` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`accessPolicySetting` `globalError`:`upnpEvent`<br>c9:`audioClip`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`channelMapPair` `globalError`:`accessPolicyControl` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`accessPolicySetting` `globalError`:`upnpEvent`<br>c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`tvAudioSignalStatus` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`tvAudioSignalStatus` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/audioClip/{id}` | `cancelAudioClip` | `id` | `0x20000108` | `0x10ad0388` `0x10ad0398` desc:`10ad4b7c` `10ad4b8c` `10ad4b9c` `10ad4bac` `10ad4bbc` | `clipBehavior`, `clipBehavior`, `volume`, `name`, `clipMetadata`, `clipMetadata`, `id` | c9:`audioClip`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`channelMapPair` `globalError`:`accessPolicyControl` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`accessPolicySetting` `globalError`:`upnpEvent`<br>c9:`audioClip`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`channelMapPair` `globalError`:`accessPolicyControl` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`accessPolicySetting` `globalError`:`upnpEvent`<br>c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`tvAudioSignalStatus` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`tvAudioSignalStatus` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `muse`, `clipBehavior`, `volume`, `volumeRampDownSeconds`, `name`, `appId`, `priority`, `clipType`, `streamUrl`, `httpAuthorization`, `clipLEDBehavior`, `clipMetadata`, `id`


:::
