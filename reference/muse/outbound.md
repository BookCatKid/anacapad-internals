# Outbound: player as muse client

The player is also a client of this same API: it builds these very calls itself toward other players and toward the cloud, for features like group volume fan-out and household coordination. The outbound vocabulary and request-building machinery lives here, showing the same API from the sender's side.

::: details Technical details

The player is also a muse CLIENT (household channel): a descriptor stream at .got2 0x1108dea4-0x1108e2e4 lists outbound ops for cloud-facing resources in order: authorization, entitlements, groups, history, playback, playerVolume, systemReporting, zones (+catalog). Entries: /pathSuffix + opName + 'k=' query params + field names.

:::

| Outbound op | Wire shape |
|---|---|
| `activateZone` | suffix `/activate` |
| `addMissingZoneDefinition` | suffix `/missingDefinition` |
| `addZoneDefinition` | none |
| `authenticateClient` | prefix `players/` suffix `/authenticateClient` |
| `authorizeDevice` | prefix `players/` suffix `/authorizeDevice` |
| `batchTranslate` | prefix `services/` suffix `/ids` |
| `createGroup` | suffix `/createGroup` |
| `createInvite` | suffix `/invite` |
| `deactivateZone` | suffix `/deactivate` |
| `deleteInvite` | query `inviteId=` |
| `duck` | suffix `/duck` |
| `getActiveZoneList` | none |
| `getContent` | suffix `/content` |
| `getGroups` | query `includeDeviceInfo=` |
| `getGroupsEx` | suffix `/extended` |
| `getPermissions` | suffix `/permissions` query `route=`, `protocolVersion=` |
| `getPolicyKey` | suffix `/policy` |
| `getUsers` | suffix `/users` query `mainAccountId=` |
| `getZoneDefinition` | suffix `/definition` |
| `getZoneDefinitionList` | none |
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
| `removeZoneDefinition` | none |
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
| `updateZoneDefinition` | none |
| `updateZoneMemberSettings` | suffix `/memberSettings` |


The request and response field names each API namespace works with: the vocabulary of the JSON documents flowing through the routes, covering which keys appear in playback commands, group settings, and alarm edits. Field names matter because they're the real API contract, meaning the strings an app actually sends.

::: details Technical details

Per-namespace request-field vocabulary recovered from the .got2 outbound descriptor stream (0x1108dea4-0x1108e2e4): each namespace block is preceded by its field-name literal cluster followed by the namespace name marker. 'settings' cluster is ambiguous (may belong to the adjacent zones block).

:::

| Namespace | Request fields |
|---|---|
| `authorization` | `assertion`, `attributes`, `grantType`, `inviteId`, `mainAccountId`, `objectId`, `objectType`, `role`, `targetType`, `targetid`, `token` |
| `catalog` | `objectIds` |
| `entitlements` | none |
| `groups` | `areaIds`, `musicContextGroupId`, `playerIds`, `playerIdsToAdd`, `playerIdsToRemove` |
| `history` | none |
| `playback` | `action`, `advertisingInfo`, `allowTvPauseRestore`, `containerId`, `containerMetadata`, `defaults`, `deltaMillis`, `deviceFeedback`, `deviceId`, `id`, `instanceId`, `itemId`, `metadata`, `playModes`, `playOnCompletion`, `playbackAction`, `playbackLocation`, `positionMillis`, `queueAction`, `stationId`, `trackNumber`, `tracks`, `type` |
| `playerVolume` | `durationMillis`, `muted`, `volume`, `volumeDelta` |
| `settings` | `channelMapSet`, `name`, `zoneDefinition` |
| `smartplay` | none |
| `systemReporting` | `accountHash`, `accountType`, `keyName`, `keyValue`, `model`, `osVersion`, `softwareVersion` |
| `zones` | `backhaulChannel`, `flatChannelMapSet`, `fronthaulChannel`, `isHomeTheater` |

