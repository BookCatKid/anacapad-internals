# muse resources: Households, zones & grouping

The topology layer: households, zones, groups and areas. Group create/join/leave lives here, which is what the app calls when you pair two speakers or build a room pair. The ZoneGroupTopology and GroupManagement services cover the same ground over SOAP.

## `groups`

Group management for the modern API: creating groups from rooms, adding member players, removing them, and dissolving groups back into independent rooms. These are the routes behind 'group rooms' in the app.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/groups` | `getGroups` | `-` | `0x20000101` | `0x101c755c` `0x101c756c` | `includeDeviceInfo` | c1:`ok`:`upnpEvent`<br>c3:`groups`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `GET` | `v1/households/{householdId}/groups/extended` | `getGroupsEx` | `-` | `0x20000101` | `0x101c756c` `0x101c757c` | `includeDeviceInfo` | c3:`groups`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`groups`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/groups/createGroup` | `createGroup` | `-` | `0x20000102` | `0x101c757c` `0x101c758c` | `playerIds`, `playerIds`, `playerIds` | c3:`groups`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup` |
| `POST` | `v1/groups/{groupId}/groups/modifyGroupMembers` | `modifyGroupMembers` | `-` | `0x20000102` | `0x101c758c` `0x101c759c` | `playerIds`, `playerIds`, `playerIds`, `playerIdsToAdd`, `playerIdsToAdd`, `playerIdsToAdd` | c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groups/modifyGroupMembers` | `modifyGroupMembers` | `-` | `0x20000102` | `0x101c758c` `0x101c759c` | `playerIds`, `playerIds`, `playerIds`, `playerIdsToAdd`, `playerIdsToAdd`, `playerIdsToAdd` | c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup` |
| `POST` | `v1/groups/{groupId}/groups/setGroupMembers` | `setGroupMembers` | `-` | `0x20000102` | `0x101c759c` `0x101c75ac` | `playerIdsToAdd`, `playerIdsToAdd`, `playerIdsToAdd`, `playerIds`, `playerIds`, `playerIds` | c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup` |
| `POST` | `v1/households/{householdId}/groups/{groupId}/groups/setGroupMembers` | `setGroupMembers` | `-` | `0x20000102` | `0x101c759c` `0x101c75ac` | `playerIdsToAdd`, `playerIdsToAdd`, `playerIdsToAdd`, `playerIds`, `playerIds`, `playerIds` | c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup`<br>c6:`groupInfo`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`amazonAlexaSetup` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `muse`, `includeDeviceInfo`, `playerIds`, `areaIds`, `musicContextGroupId`, `playerIdsToAdd`, `playerIdsToRemove`


:::

## `zones`

Zones over the modern API: the household's rooms and zones as resources. It's the modern view of the player map the classic topology service provides, for apps that read the household's shape as JSON.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/zones` | `getActiveZoneList` | `-` | `0x20000101` | `0x10b92ff0` `0x10b93000` | none | c1:`ok`:`upnpEvent`<br>c2:`activeZoneList`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `GET` | `v1/households/{householdId}/zones/definition/{zoneId}` | `getZoneDefinition` | `zoneId` | `0x20000101` | `0x10b93000` `0x10b93010` | `zoneId` | c2:`activeZoneList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`zoneDefinition`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`wiredSubStatus` |
| `GET` | `v1/households/{householdId}/zones/definition` | `getZoneDefinitionList` | `-` | `0x20000101` | `0x10b93010` `0x10b93020` | `zoneId` | c3:`zoneDefinition`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`wiredSubStatus`<br>c2:`zoneDefinitionList`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/zones/definition` | `addZoneDefinition` | `-` | `0x20000102` | `0x10b93020` `0x10b93030` | `channelMapSet`, `channelMapSet`, `name`, `channelMapSet`, `channelMapSet` | c2:`zoneDefinitionList`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c4:`zoneDefinition`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`activeZoneMember` |
| `POST` | `v1/households/{householdId}/zones/missingDefinition` | `addMissingZoneDefinition` | `-` | `0x20000102` | `0x10b93030` `0x10b93040` | `channelMapSet`, `channelMapSet`, `name`, `channelMapSet`, `channelMapSet`, `zoneDefinition`, `zoneDefinition` | c4:`zoneDefinition`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`activeZoneMember`<br>c4:`zoneDefinition`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`activeZoneMember` |
| `PUT` | `v1/households/{householdId}/zones/definition/{zoneId}` | `updateZoneDefinition` | `zoneId` | `0x20000104` | `0x10b93040` `0x10b93050` | `zoneDefinition`, `zoneDefinition`, `channelMapSet`, `channelMapSet`, `zoneId`, `channelMapSet`, `channelMapSet` | c4:`zoneDefinition`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`activeZoneMember`<br>c4:`zoneDefinition`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`activeZoneMember` |
| `PUT` | `v1/households/{householdId}/zones/activeZone/{zoneId}` | `updateActiveZone` | `zoneId` | `0x20000104` | `0x10b93050` `0x10b93060` | `channelMapSet`, `channelMapSet`, `zoneId`, `channelMapSet`, `channelMapSet` | c4:`zoneDefinition`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`activeZoneMember`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`activeZoneMember` |
| `PUT` | `v1/households/{householdId}/zones/memberSettings/{zoneId}` | `updateZoneMemberSettings` | `zoneId` | `0x20000104` | `0x10b93060` `0x10b93070` | `channelMapSet`, `channelMapSet`, `zoneId`, `channelMapSet`, `channelMapSet`, `settings`, `settings`, `settings`, `settings` | c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`activeZoneMember`<br>c3:`zoneDefinition`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` |
| `DELETE` | `v1/households/{householdId}/zones/definition/{zoneId}` | `removeZoneDefinition` | `zoneId` | `0x20000108` | `0x10b93070` `0x10b93080` | `settings`, `settings`, `zoneId`, `settings`, `settings` | c3:`zoneDefinition`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` |
| `PUT` | `v1/households/{householdId}/zones/activate/{zoneId}` | `activateZone` | `zoneId` | `0x20000104` | `0x10b93080` `0x10b93090` | `zoneId` | c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` |
| `PUT` | `v1/households/{householdId}/zones/deactivate/{zoneId}` | `deactivateZone` | `zoneId` | `0x20000104` | `0x10b93090` `0x10b930a0` | `zoneId` | c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` |
| `PUT` | `v1/players/{playerId}/zones/join/{zoneId}` | `joinZone` | `zoneId` | `0x20000104` | `0x10b930a0` `0x10b930b0` | `zoneId`, `isHomeTheater`, `fronthaulChannel` | c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/zones/join/{zoneId}` | `joinZone` | `zoneId` | `0x20000104` | `0x10b930a0` `0x10b930b0` | `zoneId`, `isHomeTheater`, `fronthaulChannel` | c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c3:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair` |
| `PUT` | `v1/players/{playerId}/zones/unjoin/{zoneId}` | `unjoinZone` | `zoneId` | `0x20000104` | `0x10b930b0` `0x10b930c0` | `isHomeTheater`, `fronthaulChannel`, `zoneId` | c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/zones/unjoin/{zoneId}` | `unjoinZone` | `zoneId` | `0x20000104` | `0x10b930b0` `0x10b930c0` | `isHomeTheater`, `fronthaulChannel`, `zoneId` | c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair`<br>c4:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`channelMapPair` |

::: details Recovered vocabulary & internals

Related enum registrations (proven integer values, see `enum_tables`):

- **compression_level**: `OFF`=1, `LOW`=2, `DEFAULT`=3, `MAX`=4
- **zone_availability**: `UNDEFINED`=1, `ENABLED_AVAILABLE`=2, `ENABLED_UNAVAILABLE`=3, `DISABLED_AVAILABLE`=4, `DISABLED_UNAVAILABLE`=5, `SECONDARY_STATE_IGNORED_BY_CR`=6

Op-level JSON keys recovered from op-object methods: `muse`, `zoneId`, `channelMapSet`, `name`, `zoneDefinition`, `settings`, `isHomeTheater`, `fronthaulChannel`, `backhaulChannel`, `flatChannelMapSet`


:::

## `households`

The household resource itself: the top-level object all household-scoped routes hang off, which is the umbrella identity under which players, groups, and services live. A request naming a household says 'this operation is about the system as a whole, not one speaker'.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/\[error:  'none' is not a valid target\]/households` | `getHouseholds` | `-` | `0x20000101` | resource-block | none | none |
| `GET` | `v1/households/{householdId}/households` | `getHouseholds` | `-` | `0x20000101` | resource-block | none | none |
| `GET` | `v1/\[error:  'none' is not a valid target\]/households/{householdId}` | `getHousehold` | `householdId` | `0x20000101` | resource-block | none | none |
| `GET` | `v1/households/{householdId}/households/{householdId}` | `getHousehold` | `householdId` | `0x20000101` | resource-block | none | none |
| `POST` | `v1/households/{householdId}/households/name` | `setName` | `-` | `0x20000102` | `0x10af3468` `0x10af58e0` `0x10af58f0` `0x10af5900` `0x10af5910` desc:`10af58e0` `10af58f0` `10af5900` `10af5910` | none | none |
| `GET` | `v1/households/{householdId}/households/location` | `getHouseholdLocation` | `-` | `0x20000101` | resource-block | none | none |
| `PUT` | `v1/households/{householdId}/households/location` | `setLocation` | `-` | `0x20000104` | resource-block | none | none |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10af3488`

Field vocabulary recovered from the resource's implementation functions: `households`


:::

## `areas`

Household 'areas', the multi-room spaces concept newer app versions use to organize a home into named zones beyond plain rooms. An area groups players into a logical space like 'downstairs', and these routes let an app list the household's areas and manage which players belong to each. It's part of the newer organizational model the app is migrating toward.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/areas` | `getAreas` | `-` | `0x20000101` | `0x10acc4a4` `0x10acc4b4` desc:`10ad0368` | none | c1:`ok`:`upnpEvent`<br>c1:`areas`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/areas` | `createArea` | `-` | `0x20000102` | `0x10acc4b4` `0x10acc4c4` desc:`10ad0378` | `playerIds`, `playerIds`, `name` | c1:`areas`:`upnpEvent`<br>c5:`area`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` |
| `PUT` | `v1/households/{householdId}/areas/{areaId}` | `updateArea` | `areaId` | `0x20000104` | `0x10acc4c4` `0x10acc4d4` desc:`10ad0388` | `playerIds`, `playerIds`, `name`, `areaId` | c5:`area`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c6:`area`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`accessorySwap` |
| `DELETE` | `v1/households/{householdId}/areas/{areaId}` | `removeArea` | `areaId` | `0x20000108` | `0x10acc4d4` `0x10acc4e4` desc:`10ad0398` | `playerIds`, `playerIds`, `areaId` | c6:`area`:`upnpEvent` `playerSetError`:`chirpRequest` `globalError`:`chirpRequest` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`accessorySwap`<br>c3:`ok`:`upnpEvent` `globalError`:`accessorySwap` `globalError`:`chirpRequest` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `muse`, `playerIds`, `name`, `areaId`


:::
