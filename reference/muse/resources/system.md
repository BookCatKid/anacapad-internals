# muse resources: System, updates & diagnostics

Housekeeping: firmware updates and household-wide update orchestration, diagnostics uploads, system reporting and network speed tests, management and platform-internal RPCs, clocks and time sync, and service-registration endpoints.

## `update`

Software update over the modern API: the player-level update routes for checking new firmware, downloading it, and applying it as JSON operations. It's the per-device half of the update flow.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/update/check` | `checkForUpdate` | `-` | `0x20000102` | `0x10b4cbb0` `0x10b4cbc0` | `useCachedOnly`, `updateType` | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c6:`updateItem`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`acousticMetrics` `globalError`:`activeZone` `globalError`:`activeZonesChange` `globalError`:`wiredSubStatus`<br>c2:`upnpResponse`:`upnpEvent` `upnpError`:`wiredSubStatus`<br>c6:`updateItem`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`acousticMetrics` `globalError`:`activeZone` `globalError`:`activeZonesChange` `globalError`:`wiredSubStatus`<br>c2:`upnpResponse`:`upnpEvent` `upnpError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/players/{playerId}/update/check` | `checkForUpdate` | `-` | `0x20000102` | `0x10b4cbb0` `0x10b4cbc0` | `useCachedOnly`, `updateType` | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c6:`updateItem`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`acousticMetrics` `globalError`:`activeZone` `globalError`:`activeZonesChange` `globalError`:`wiredSubStatus`<br>c2:`upnpResponse`:`upnpEvent` `upnpError`:`wiredSubStatus`<br>c6:`updateItem`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`acousticMetrics` `globalError`:`activeZone` `globalError`:`activeZonesChange` `globalError`:`wiredSubStatus`<br>c2:`upnpResponse`:`upnpEvent` `upnpError`:`wiredSubStatus` |
| `POST` | `v1/players/{playerId}/update/firmware` | `beginSoftwareUpdate` | `-` | `0x20000102` | `0x10b4cbc0` `0x10b4cbd0` | `useCachedOnly`, `updateType`, `assertion` | c6:`updateItem`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`acousticMetrics` `globalError`:`activeZone` `globalError`:`activeZonesChange` `globalError`:`wiredSubStatus`<br>c2:`upnpResponse`:`upnpEvent` `upnpError`:`wiredSubStatus`<br>c6:`updateItem`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`acousticMetrics` `globalError`:`activeZone` `globalError`:`activeZonesChange` `globalError`:`wiredSubStatus`<br>c2:`upnpResponse`:`upnpEvent` `upnpError`:`wiredSubStatus`<br>c4:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`zoneDefinitionsChange` `globalError`:`container`<br>c4:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`zoneDefinitionsChange` `globalError`:`container` |
| `POST` | `v1/households/{householdId}/players/{playerId}/update/firmware` | `beginSoftwareUpdate` | `-` | `0x20000102` | `0x10b4cbc0` `0x10b4cbd0` | `useCachedOnly`, `updateType`, `assertion` | c6:`updateItem`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`acousticMetrics` `globalError`:`activeZone` `globalError`:`activeZonesChange` `globalError`:`wiredSubStatus`<br>c2:`upnpResponse`:`upnpEvent` `upnpError`:`wiredSubStatus`<br>c6:`updateItem`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`acousticMetrics` `globalError`:`activeZone` `globalError`:`activeZonesChange` `globalError`:`wiredSubStatus`<br>c2:`upnpResponse`:`upnpEvent` `upnpError`:`wiredSubStatus`<br>c4:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`zoneDefinitionsChange` `globalError`:`container`<br>c4:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`zoneDefinitionsChange` `globalError`:`container` |
| `GET` | `v1/players/{playerId}/update/status` | `getUpdateStatus` | `-` | `0x20000101` | `0x10b4cbd0` `0x10b4cbe0` | `assertion` | c4:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`zoneDefinitionsChange` `globalError`:`container`<br>c4:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`zoneDefinitionsChange` `globalError`:`container`<br>c2:`deviceSoftwareUpdateStatus`:`upnpEvent` `globalError`:`upnpEvent`<br>c2:`deviceSoftwareUpdateStatus`:`upnpEvent` `globalError`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/update/status` | `getUpdateStatus` | `-` | `0x20000101` | `0x10b4cbd0` `0x10b4cbe0` | `assertion` | c4:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`zoneDefinitionsChange` `globalError`:`container`<br>c4:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`zoneDefinitionsChange` `globalError`:`container`<br>c2:`deviceSoftwareUpdateStatus`:`upnpEvent` `globalError`:`upnpEvent`<br>c2:`deviceSoftwareUpdateStatus`:`upnpEvent` `globalError`:`upnpEvent` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `muse`, `useCachedOnly`, `updateType`, `assertion`


:::

## `householdUpdate`

Household firmware updates over the modern API: checking whether updates exist, reading the rollout status per player, and triggering the update process, all as JSON routes. The current app's 'update your system' flow runs through here.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/devices/{deviceId}/householdUpdate/update` | `beginHouseholdSoftwareUpdate` | `-` | `0x20000102` | `0x10af58f0` `0x10af5900` | none | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c4:`ok`:`batteryCells` `globalError`:`availableSoftwareUpdate` `upgradeManager`:`versionChanged` `globalError`:`container`<br>c4:`ok`:`batteryCells` `globalError`:`availableSoftwareUpdate` `upgradeManager`:`versionChanged` `globalError`:`container` |
| `POST` | `v1/households/{householdId}/devices/{deviceId}/householdUpdate/update` | `beginHouseholdSoftwareUpdate` | `-` | `0x20000102` | `0x10af58f0` `0x10af5900` | none | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c4:`ok`:`batteryCells` `globalError`:`availableSoftwareUpdate` `upgradeManager`:`versionChanged` `globalError`:`container`<br>c4:`ok`:`batteryCells` `globalError`:`availableSoftwareUpdate` `upgradeManager`:`versionChanged` `globalError`:`container` |
| `GET` | `v1/devices/{deviceId}/householdUpdate/status` | `getHouseholdUpdateStatus` | `-` | `0x20000101` | `0x10af5900` `0x10af5910` desc:`10af71e0` `10af8770` `10af8780` | none | c4:`ok`:`batteryCells` `globalError`:`availableSoftwareUpdate` `upgradeManager`:`versionChanged` `globalError`:`container`<br>c4:`ok`:`batteryCells` `globalError`:`availableSoftwareUpdate` `upgradeManager`:`versionChanged` `globalError`:`container`<br>c1:`householdUpdateStatus`:`upnpEvent`<br>c1:`householdUpdateStatus`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/devices/{deviceId}/householdUpdate/status` | `getHouseholdUpdateStatus` | `-` | `0x20000101` | `0x10af5900` `0x10af5910` desc:`10af71e0` `10af8770` `10af8780` | none | c4:`ok`:`batteryCells` `globalError`:`availableSoftwareUpdate` `upgradeManager`:`versionChanged` `globalError`:`container`<br>c4:`ok`:`batteryCells` `globalError`:`availableSoftwareUpdate` `upgradeManager`:`versionChanged` `globalError`:`container`<br>c1:`householdUpdateStatus`:`upnpEvent`<br>c1:`householdUpdateStatus`:`upnpEvent` |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10af5930`

Field vocabulary recovered from the resource's implementation functions: `householdUpdate`

Related enum registrations (proven integer values, see `enum_tables`):

- **device_update_fsm**: `UNDEFINED`=1, `CONNECT`=2, `HELLO`=3, `DOWNLOAD`=4, `FLASHWRITE`=5, `WAIT`=6, `REBOOT`=7, `ERROR`=8, `FINISHED`=9
- **device_update_fsm2**: `INIT`=1, `HELLO`=2, `HELLO_DONE`=3, `DOWNLOAD`=4, `DOWNLOAD_DONE`=5, `FLASHWRITE`=6, `FLASHWRITE_DONE`=7, `REBOOT`=8, `REBOOTING_DONE`=9
- **household_update_result**: `NO_DEVICES_NEED_UPDATE`=1, `UPDATE_COMPLETE`=2, `INFO_FILE_WRITE_FAILED`=3, `BSU_FAILED`=4, `UPGRADE_MGR_SPAWN_FAILED`=5, `MANIFEST_DOWNLOAD_FAILED`=6, `MANIFEST_PARSE_FAILED`=7, `UPDATE_NEVER_RUN`=8, `FINAL_RESULT_UNKNOWN`=9

Op-level JSON keys recovered from op-object methods: `muse`


:::

## `diagnostics`

Diagnostics over the modern API: triggering log collection, fetching diagnostic state, and driving the support-reporting flow as JSON routes rather than through the old diagnostic web pages. When the app files a diagnostic report, this is the surface it uses.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/diagnostics` | `submitDiagnostics` | `-` | `0x20000102` | `0x10addc24` `0x10addc34` desc:`10ae1794` `10ae17a4` `10ae17b4` `10ae17c4` `10ae17d4` `10ae17e4` | `includeControllers`, `type` | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c3:`diagnosticInfo`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`contentPagedResources`<br>c3:`diagnosticInfo`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`contentPagedResources` |
| `POST` | `v1/households/{householdId}/players/{playerId}/diagnostics` | `submitDiagnostics` | `-` | `0x20000102` | `0x10addc24` `0x10addc34` desc:`10ae1794` `10ae17a4` `10ae17b4` `10ae17c4` `10ae17d4` `10ae17e4` | `includeControllers`, `type` | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c3:`diagnosticInfo`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`contentPagedResources`<br>c3:`diagnosticInfo`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`contentPagedResources` |
| `GET` | `v1/players/{playerId}/diagnostics/metadata` | `getMetadata` | `-` | `0x20000101` | `0x10addc34` `0x10addc44` | `includeControllers`, `type` | c3:`diagnosticInfo`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`contentPagedResources`<br>c3:`diagnosticInfo`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`contentPagedResources`<br>c3:`diagnosticSubmissionMetadata`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`diagnosticSubmissionMetadata`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/diagnostics/metadata` | `getMetadata` | `-` | `0x20000101` | `0x10addc34` `0x10addc44` | `includeControllers`, `type` | c3:`diagnosticInfo`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`contentPagedResources`<br>c3:`diagnosticInfo`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`contentPagedResources`<br>c3:`diagnosticSubmissionMetadata`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`diagnosticSubmissionMetadata`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `POST` | `v1/players/{playerId}/diagnostics/report` | `reportStatus` | `-` | `0x20000102` | `0x10addc44` `0x10addc54` | `controller`, `diagGuid` | c3:`diagnosticSubmissionMetadata`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`diagnosticSubmissionMetadata`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c1:`ok`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/players/{playerId}/diagnostics/report` | `reportStatus` | `-` | `0x20000102` | `0x10addc44` `0x10addc54` | `controller`, `diagGuid` | c3:`diagnosticSubmissionMetadata`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`diagnosticSubmissionMetadata`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c1:`ok`:`upnpEvent` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `muse`, `includeControllers`, `type`, `initiatingDeviceId`, `controller`, `diagGuid`, `reporterId`, `status`


:::

## `systemReporting`

System reporting: fleet-level telemetry and reporting routes, covering how the player packages and sends its health and usage data to Sonos over the modern channel.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/firmwareDownload` | `reportFirmwareDownload` | `-` | `0x20000102` | outbound-fwd | none | none |
| `POST` | `v1/households/{householdId}/systemReporting/firmwareDownload` | `reportFirmwareDownload` | `-` | `0x20000102` | outbound-fwd | none | none |
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/softwareDownload` | `reportSoftwareDownload` | `-` | `0x20000102` | outbound-fwd | none | none |
| `POST` | `v1/households/{householdId}/systemReporting/softwareDownload` | `reportSoftwareDownload` | `-` | `0x20000102` | outbound-fwd | none | none |
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/accountSubscription` | `reportAccountSubscription` | `-` | `0x20000102` | outbound-fwd | none | none |
| `POST` | `v1/households/{householdId}/systemReporting/accountSubscription` | `reportAccountSubscription` | `-` | `0x20000102` | outbound-fwd | none | none |
| `POST` | `v1/\[error:  'none' is not a valid target\]/systemReporting/productEvent` | `reportProductEvent` | `-` | `0x20000102` | outbound-fwd | none | none |
| `POST` | `v1/households/{householdId}/systemReporting/productEvent` | `reportProductEvent` | `-` | `0x20000102` | outbound-fwd | none | none |

::: details Recovered vocabulary & internals

Field vocabulary (request/response keys seen in the resource's client tables, not yet bound to individual ops): `channelMapSet`, `name`, `zoneDefinition`


:::

## `networkTest`

Network testing: routes that exercise the player's connectivity, including ping-style checks and throughput probes. Diagnostics and the app's network-health features use them to prove whether the player's connection is the problem.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/networkTest/disableNetwork` | `temporarilyDisableNetwork` | `-` | `0x20000102` | `0x10b050dc` | `delaySecs` | c3:<br>c3: |
| `POST` | `v1/households/{householdId}/players/{playerId}/networkTest/disableNetwork` | `temporarilyDisableNetwork` | `-` | `0x20000102` | `0x10b050dc` | `delaySecs` | c3:<br>c3: |
| `POST` | `v1/players/{playerId}/networkTest/start` | `startNetworkTests` | `-` | `0x20000102` | `0x10b050dc` `0x10b050ec` | `delaySecs`, `url` | c3:<br>c3:<br>c3:`networkTestId`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`networkTestId`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/players/{playerId}/networkTest/start` | `startNetworkTests` | `-` | `0x20000102` | `0x10b050dc` `0x10b050ec` | `delaySecs`, `url` | c3:<br>c3:<br>c3:`networkTestId`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`networkTestId`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `GET` | `v1/players/{playerId}/networkTest/{networkTestId}` | `getNetworkTestResults` | `networkTestId` | `0x20000101` | `0x10b050ec` `0x10b050fc` | `delaySecs`, `url`, `networkTestId` | c3:`networkTestId`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`networkTestId`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`networkTestResult`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist`<br>c3:`networkTestResult`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist` |
| `GET` | `v1/households/{householdId}/players/{playerId}/networkTest/{networkTestId}` | `getNetworkTestResults` | `networkTestId` | `0x20000101` | `0x10b050ec` `0x10b050fc` | `delaySecs`, `url`, `networkTestId` | c3:`networkTestId`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`networkTestId`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`networkTestResult`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist`<br>c3:`networkTestResult`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`artist` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `delaySecs`, `durationSecs`, `muse`, `url`, `networkTestId`


:::

## `management`

Device management: reboot, factory-reset paths, and similarly powerful maintenance operations over the modern API. These are deliberately restricted, since they're the routes you don't want a random network client reaching, which is part of why the API authenticates every call.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/management/factoryReset` | `factoryReset` | `-` | `0x20000102` | `0x10afe1ac` | none | c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/players/{playerId}/management/factoryReset` | `factoryReset` | `-` | `0x20000102` | `0x10afe1ac` | none | c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent` |
| `POST` | `v1/players/{playerId}/management/reboot` | `reboot` | `-` | `0x20000102` | `0x10afe1ac` `0x10afe1bc` `0x10b0d1b0` `0x10b0d1c0` | `fullSync`, `setting` | c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c2:<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice`<br>c2:<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/players/{playerId}/management/reboot` | `reboot` | `-` | `0x20000102` | `0x10afe1ac` `0x10afe1bc` `0x10b0d1b0` `0x10b0d1c0` | `fullSync`, `setting` | c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c2:<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice`<br>c2:<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10afe1dc`

Field vocabulary recovered from the resource's implementation functions: `management`

Related enum registrations (proven integer values, see `enum_tables`):

- **net_state**: `SONOSNET`=1, `STATION`=2, `DISCONNECTED`=3, `STATION_SATELLITE`=4
- **wifi_state_fsm**: `INACTIVE`=1, `WIFI_ENABLING`=2, `ACK_AWAIT`=3, `WIFI_DISABLING`=4, `WIFI_DISABLED`=5, `ACK_NOT_RECEIVED`=6

Op-level JSON keys recovered from op-object methods: `muse`, `fullSync`, `setting`, `operation`


:::

## `platformInternal`

Internal platform routes: operations meant for Sonos's own components rather than apps. It's the back-channel surface of the modern API, used for system-level coordination between the player's own parts and Sonos's services.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/households/{householdId}/platformInternal/sync` | `sync` | `-` | `0x20000102` | `0x10b0d1b0` | `fullSync`, `setting` | c2:<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice` |
| `POST` | `v1/players/{playerId}/platformInternal/reboot` | `reboot` | `-` | `0x20000102` | `0x10afe1ac` `0x10afe1bc` `0x10b0d1b0` `0x10b0d1c0` | `fullSync`, `setting` | c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c2:<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice`<br>c2:<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/players/{playerId}/platformInternal/reboot` | `reboot` | `-` | `0x20000102` | `0x10afe1ac` `0x10afe1bc` `0x10b0d1b0` `0x10b0d1c0` | `fullSync`, `setting` | c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c2:`upnpEvent`:`globalError` `channelMapPair`:`globalError` `bluetooth`:`globalError` `upnpEvent`:`globalError` `wiredSubStatus`<br>c1:`ok`:`upnpEvent`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c2:<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice`<br>c2:<br>c2:`ok`:`upnpEvent` `groupCoordinatorChanged`:`bluetoothDevice`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/platformInternal/invalidateCache` | `invalidateCache` | `-` | `0x20000102` | `0x10b0d1c0` `0x10b0d1d0` desc:`10b0f748` `10b0f758` `10b0f768` `10b0f778` `10b12e68` `10b12e78` `10b12e88` `10b12e98` `10b12ea8` `10b12eb8` | `cacheSettings`, `cacheSettings`, `cacheNamespace`, `cacheSettings`, `cacheSettings` | c3:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c2:`ok`:`upnpEvent` `globalError`:`commandHeader` |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10b0d1f0`

Field vocabulary recovered from the resource's implementation functions: `platformInternal`

Op-level JSON keys recovered from op-object methods: `fullSync`, `setting`, `operation`, `muse`, `cacheSettings`, `cacheNamespace`, `cacheData`, `cacheName`, `cacheKey`


:::

## `svc`

An internal service-level group: routes that don't fit a named resource, used for operations scoped to the API itself rather than to a thing like 'playback' or 'alarms'.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/svc/weatherConfig` | `setWeatherConfig` | `-` | `0x20000102` | `0x10b37854` | `enabled`, `geoLocation`, `geoLocation` | c4:<br>c4: |
| `POST` | `v1/households/{householdId}/players/{playerId}/svc/weatherConfig` | `setWeatherConfig` | `-` | `0x20000102` | `0x10b37854` | `enabled`, `geoLocation`, `geoLocation` | c4:<br>c4: |
| `GET` | `v1/players/{playerId}/svc/weatherConfig` | `getWeatherConfig` | `-` | `0x20000101` | `0x10b37854` `0x10b37864` desc:`10b39424` | `enabled`, `geoLocation`, `geoLocation` | c4:<br>c4:<br>c4:`weatherConfig`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c4:`weatherConfig`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`deviceInfo` |
| `GET` | `v1/households/{householdId}/players/{playerId}/svc/weatherConfig` | `getWeatherConfig` | `-` | `0x20000101` | `0x10b37854` `0x10b37864` desc:`10b39424` | `enabled`, `geoLocation`, `geoLocation` | c4:<br>c4:<br>c4:`weatherConfig`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c4:`weatherConfig`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`deviceInfo` |
| `POST` | `v1/players/{playerId}/svc/voiceCommand` | `voiceCommand` | `-` | `0x20000102` | `0x10b37864` `0x10b37874` desc:`10b39434` | `voiceCommand` | c4:`weatherConfig`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c4:`weatherConfig`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c5:`ok`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`deviceInfo`<br>c5:`ok`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`deviceInfo` |
| `POST` | `v1/households/{householdId}/players/{playerId}/svc/voiceCommand` | `voiceCommand` | `-` | `0x20000102` | `0x10b37864` `0x10b37874` desc:`10b39434` | `voiceCommand` | c4:`weatherConfig`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c4:`weatherConfig`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c5:`ok`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`deviceInfo`<br>c5:`ok`:`upnpEvent` `globalError`:`authzPolicyKey` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`deviceInfo` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `enabled`, `geoLocation`, `muse`, `voiceCommand`


:::

## `info`

General player information: version, model, identity, and related facts. It's the modern API's 'about this device' read, used by anything needing the player's basic description.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/info` | `getInfo` | `-` | `0x20000101` | resource-block | none | none |
| `GET` | `v1/households/{householdId}/players/{playerId}/info` | `getInfo` | `-` | `0x20000101` | resource-block | none | none |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10a38570`, `0x10a3890c`, `0x10a38e50`

Field vocabulary recovered from the resource's implementation functions: `info`, `resources`, `type`, `id`, `name`, `explicit`, `playable`, `metadata`, `images`, `count`, `offset`, `pageSize`, `total`, `_objectType`, `false`, `true`, `url`, `width`, `height`, `objectId`, `accountId`, `serviceId`, `REDACTED`, `metadataBlob`

Implementation messages:

- `%d`


:::

## `systemTime`

Household system time over the modern API: the shared clock's JSON surface for reading and setting the coordinated household time that alarms and scheduling depend on.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/systemTime/timeZone` | `getTimeZoneInfo` | `-` | `0x20000101` | `0x10b39424` desc:`10b3a534` `10b3eac4` `10b3ead4` `10b3eae4` `10b3eaf4` | none | c2: |
| `PUT` | `v1/households/{householdId}/systemTime/timeZone` | `setTimeZoneInfo` | `-` | `0x20000104` | `0x10b39424` `0x10b39434` desc:`10b3eb04` `10b3eb14` `10b3eb24` `10b3eb34` `10b3eb44` | `timeZoneInfo`, `timeZoneInfo` | c2:<br>c3:`timeZoneInfo`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`wiredSubStatus`<br>c2:`relativeTimeStamp`:`upnpEvent` `globalError`:`container` |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10b39454`

Field vocabulary recovered from the resource's implementation functions: `systemTime`

Op-level JSON keys recovered from op-object methods: `muse`, `timeZoneInfo`


:::

## `time`

Time over the modern API: reading the player's current time and timezone. It's the JSON counterpart of the classic time getters, for anything needing the player's own view of 'now'.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/time/relative` | `getRelativeTime` | `-` | `0x20000101` | `0x10b39434` `0x10b3a534` `0x10b3eac4` `0x10b3ead4` `0x10b3eae4` `0x10b3eaf4` | none | none |
| `GET` | `v1/households/{householdId}/players/{playerId}/time/relative` | `getRelativeTime` | `-` | `0x20000101` | `0x10b39434` `0x10b3a534` `0x10b3eac4` `0x10b3ead4` `0x10b3eae4` `0x10b3eaf4` | none | none |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10b3a554`, `0x101827e4`

Field vocabulary recovered from the resource's implementation functions: `time`, `ath1`, `md`, `sm`, `satSwitch`, `wifi`, `hardware`, `satsw`, `suid`, `cn`, `td`, `d3`, `l1`, `l2`, `l3`, `lmNeighbor`, `lmrep`

Implementation messages:

- `Error %d from uploadSatSwitchTimeReport`
- `Error expected no more than %d entries, got %d`
- `Error %d from WifiFuncsGetLmChangeStats`
- `%d`
- `%u`


:::
