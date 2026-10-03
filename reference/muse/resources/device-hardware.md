# muse resources: Device & hardware

The hardware-facing surface: device inventory and pairing, hardware status reporting, power management, and IR remote control handling.

## `hardwareStatus`

Hardware health and status: the player's report on its physical state, covering temperatures, wireless link quality, and other machine-level readings. Diagnostics screens and the network-health features draw from these routes to explain what's happening inside the box.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/hardwareStatus/bluetooth` | `getBluetoothStatus` | `-` | `0x20000101` | `0x101d4cb4` `0x101d4cc4` | none | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c3:`bluetooth`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`bluetooth`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/bluetooth` | `getBluetoothStatus` | `-` | `0x20000101` | `0x101d4cb4` `0x101d4cc4` | none | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c3:`bluetooth`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`bluetooth`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/players/{playerId}/hardwareStatus/battery` | `getBatteryStatus` | `-` | `0x20000101` | `0x101d4cc4` `0x101d4cd4` | none | c3:`bluetooth`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`bluetooth`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c4:`battery`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c4:`battery`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/battery` | `getBatteryStatus` | `-` | `0x20000101` | `0x101d4cc4` `0x101d4cd4` | none | c3:`bluetooth`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`bluetooth`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c4:`battery`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c4:`battery`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent` |
| `POST` | `v1/players/{playerId}/hardwareStatus/battery` | `changeBatteryStatus` | `-` | `0x20000102` | `0x101d4cd4` `0x101d4ce4` | `changeBatteryStatus`, `changeBatteryStatus` | c4:`battery`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c4:`battery`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c1:`battery`:`upnpEvent`<br>c1:`battery`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/battery` | `changeBatteryStatus` | `-` | `0x20000102` | `0x101d4cd4` `0x101d4ce4` | `changeBatteryStatus`, `changeBatteryStatus` | c4:`battery`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c4:`battery`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c1:`battery`:`upnpEvent`<br>c1:`battery`:`upnpEvent` |
| `GET` | `v1/players/{playerId}/hardwareStatus/batteryCells` | `getBatteryCells` | `-` | `0x20000101` | `0x101d4ce4` `0x101d4cf4` | `changeBatteryStatus`, `changeBatteryStatus` | c1:`battery`:`upnpEvent`<br>c1:`battery`:`upnpEvent`<br>c4:`batteryCells`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c4:`batteryCells`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/batteryCells` | `getBatteryCells` | `-` | `0x20000101` | `0x101d4ce4` `0x101d4cf4` | `changeBatteryStatus`, `changeBatteryStatus` | c1:`battery`:`upnpEvent`<br>c1:`battery`:`upnpEvent`<br>c4:`batteryCells`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c4:`batteryCells`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent` |
| `POST` | `v1/players/{playerId}/hardwareStatus/shipMode` | `transitionToShipMode` | `-` | `0x20000102` | `0x101d4cf4` `0x101d4d04` | `requiredMinimumBatteryPercentage` | c4:`batteryCells`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c4:`batteryCells`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c7:`transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`wiredSubStatus` `transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`channelMapPair` `transitionToShipModeStatus`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c1:`ok`:`upnpEvent`<br>c7:`transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`wiredSubStatus` `transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`channelMapPair` `transitionToShipModeStatus`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c1:`ok`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/shipMode` | `transitionToShipMode` | `-` | `0x20000102` | `0x101d4cf4` `0x101d4d04` | `requiredMinimumBatteryPercentage` | c4:`batteryCells`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c4:`batteryCells`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c7:`transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`wiredSubStatus` `transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`channelMapPair` `transitionToShipModeStatus`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c1:`ok`:`upnpEvent`<br>c7:`transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`wiredSubStatus` `transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`channelMapPair` `transitionToShipModeStatus`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c1:`ok`:`upnpEvent` |
| `POST` | `v1/players/{playerId}/hardwareStatus/shutdown` | `initiateOrderlyShutdown` | `-` | `0x20000102` | `0x101d4d04` `0x101d4d14` | `requiredMinimumBatteryPercentage` | c7:`transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`wiredSubStatus` `transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`channelMapPair` `transitionToShipModeStatus`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c1:`ok`:`upnpEvent`<br>c7:`transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`wiredSubStatus` `transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`channelMapPair` `transitionToShipModeStatus`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c1:`ok`:`upnpEvent`<br>c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/shutdown` | `initiateOrderlyShutdown` | `-` | `0x20000102` | `0x101d4d04` `0x101d4d14` | `requiredMinimumBatteryPercentage` | c7:`transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`wiredSubStatus` `transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`channelMapPair` `transitionToShipModeStatus`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c1:`ok`:`upnpEvent`<br>c7:`transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`wiredSubStatus` `transitionToShipModeStatus`:`upnpEvent` `transitionToShipModeStatus`:`channelMapPair` `transitionToShipModeStatus`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest`<br>c1:`ok`:`upnpEvent`<br>c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent` |
| `GET` | `v1/players/{playerId}/hardwareStatus/ethernet` | `getEthernetStatus` | `-` | `0x20000101` | `0x101d4d14` `0x101d4d24` | none | c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c3:`ethernetPorts`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c3:`ethernetPorts`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/ethernet` | `getEthernetStatus` | `-` | `0x20000101` | `0x101d4d14` `0x101d4d24` | none | c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c5:`ok`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`bluetooth` `globalError`:`wiredSubStatus` `globalError`:`upnpEvent`<br>c3:`ethernetPorts`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c3:`ethernetPorts`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair` |
| `GET` | `v1/players/{playerId}/hardwareStatus/wiredSub` | `getWiredSubStatus` | `-` | `0x20000101` | `0x101d4d24` `0x101d4d34` | none | c3:`ethernetPorts`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c3:`ethernetPorts`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c3:`wiredSubStatus`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c3:`wiredSubStatus`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/wiredSub` | `getWiredSubStatus` | `-` | `0x20000101` | `0x101d4d24` `0x101d4d34` | none | c3:`ethernetPorts`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c3:`ethernetPorts`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`channelMapPair`<br>c3:`wiredSubStatus`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c3:`wiredSubStatus`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` |
| `GET` | `v1/players/{playerId}/hardwareStatus/wirelessNetworkStatus` | `getWirelessNetworkStatus` | `-` | `0x20000101` | `0x101d4d34` `0x101d4d44` | none | c3:`wiredSubStatus`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c3:`wiredSubStatus`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c3:`wirelessNetworkStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`wirelessNetworkStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/wirelessNetworkStatus` | `getWirelessNetworkStatus` | `-` | `0x20000101` | `0x101d4d34` `0x101d4d44` | none | c3:`wiredSubStatus`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c3:`wiredSubStatus`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c3:`wirelessNetworkStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`wirelessNetworkStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `POST` | `v1/players/{playerId}/hardwareStatus/bluetoothPairing` | `setBluetoothPairing` | `-` | `0x20000102` | `0x101d4d44` `0x101d4d54` | `enable` | c3:`wirelessNetworkStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`wirelessNetworkStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c2:`ok`:`upnpEvent` `globalError`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/bluetoothPairing` | `setBluetoothPairing` | `-` | `0x20000102` | `0x101d4d44` `0x101d4d54` | `enable` | c3:`wirelessNetworkStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`wirelessNetworkStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c2:`ok`:`upnpEvent` `globalError`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`upnpEvent` |
| `POST` | `v1/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `activatePairedBluetoothDevice` | `bluetoothAddress` | `0x20000102` | `0x101d4d54` `0x101d4d64` | `enable`, `bluetoothAddress` | c2:`ok`:`upnpEvent` `globalError`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `activatePairedBluetoothDevice` | `bluetoothAddress` | `0x20000102` | `0x101d4d54` `0x101d4d64` | `enable`, `bluetoothAddress` | c2:`ok`:`upnpEvent` `globalError`:`upnpEvent`<br>c2:`ok`:`upnpEvent` `globalError`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent` |
| `DELETE` | `v1/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `removePairedBluetoothDevice` | `bluetoothAddress` | `0x20000108` | `0x101d4d64` `0x101d4d74` | `bluetoothAddress` | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/pairedBluetoothDevices/{bluetoothAddress}` | `removePairedBluetoothDevice` | `bluetoothAddress` | `0x20000108` | `0x101d4d64` `0x101d4d74` | `bluetoothAddress` | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent` |
| `GET` | `v1/players/{playerId}/hardwareStatus/microphoneSwitch` | `getMicrophoneSwitchState` | `-` | `0x20000101` | `0x101d4d74` `0x101d4d84` | `bluetoothAddress` | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c3:`microphoneSwitch`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`microphoneSwitch`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/microphoneSwitch` | `getMicrophoneSwitchState` | `-` | `0x20000101` | `0x101d4d74` `0x101d4d84` | `bluetoothAddress` | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c3:`microphoneSwitch`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`microphoneSwitch`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/players/{playerId}/hardwareStatus/water` | `getWaterStatus` | `-` | `0x20000101` | `0x101d4d84` `0x101d4d94` | none | c3:`microphoneSwitch`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`microphoneSwitch`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`waterState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`waterState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/water` | `getWaterStatus` | `-` | `0x20000101` | `0x101d4d84` `0x101d4d94` | none | c3:`microphoneSwitch`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`microphoneSwitch`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`waterState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`waterState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/players/{playerId}/hardwareStatus/poe` | `getPoeStatus` | `-` | `0x20000101` | `0x101d4d94` `0x101d4da4` | none | c3:`waterState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`waterState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`poeState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`poeState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/poe` | `getPoeStatus` | `-` | `0x20000101` | `0x101d4d94` `0x101d4da4` | none | c3:`waterState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`waterState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`poeState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`poeState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/players/{playerId}/hardwareStatus/lineIn` | `getLineInStatus` | `-` | `0x20000101` | `0x101d4da4` `0x101d4db4` | `instanceId` | c3:`poeState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`poeState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`lineInStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`lineInStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/lineIn` | `getLineInStatus` | `-` | `0x20000101` | `0x101d4da4` `0x101d4db4` | `instanceId` | c3:`poeState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`poeState`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`lineInStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`lineInStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/players/{playerId}/hardwareStatus/lineInStatuses` | `getLineInStatuses` | `-` | `0x20000101` | `0x101d4db4` `0x101d4dc4` | `instanceId` | c3:`lineInStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`lineInStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`lineInStatusList`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`lineInStatusList`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/hardwareStatus/lineInStatuses` | `getLineInStatuses` | `-` | `0x20000101` | `0x101d4db4` `0x101d4dc4` | `instanceId` | c3:`lineInStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`lineInStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`lineInStatusList`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent`<br>c3:`lineInStatusList`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`upnpEvent` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `muse`, `changeBatteryStatus`, `requiredMinimumBatteryPercentage`, `requiredMaximumBatteryPercentage`, `enable`, `bluetoothAddress`, `instanceId`

Validation / log strings recovered from op-object methods:

- `v1/players/%s/hardwareStatus/battery`

Route fragments these ops build or forward to: `v1/players/%s/hardwareStatus/battery`


:::

## `devices`

The device list: every player in the household presented as a modern API object with its identity, model, capabilities, and current state. When the app builds its roster of 'your Sonos products', this is where that data comes from, with one resource per physical speaker.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/devices` | `getDevices` | `-` | `0x20000101` | resource-block | none | none |
| `DELETE` | `v1/households/{householdId}/devices/{playerId}` | `removeDevice` | `playerId` | `0x20000108` | resource-block | none | none |
| `GET` | `v1/households/{householdId}/devices/registrations` | `getDeviceRegistrations` | `-` | `0x20000101` | resource-block | none | none |
| `GET` | `v1/users/{userId}/devices/registrations` | `getUserDeviceRegistrations` | `-` | `0x20000101` | resource-block | none | none |
| `GET` | `v1/households/{householdId}/users/{userId}/devices/registrations` | `getUserDeviceRegistrations` | `-` | `0x20000101` | resource-block | none | none |
| `POST` | `v1/households/{householdId}/devices/registrations` | `initDeviceRegistration` | `-` | `0x20000102` | resource-block | none | none |
| `POST` | `v1/households/{householdId}/devices/registrations/{deviceId}` | `completeDeviceRegistration` | `deviceId` | `0x20000102` | resource-block | none | none |
| `PUT` | `v1/households/{householdId}/devices/registrations/{deviceId}` | `refreshDeviceRegistration` | `deviceId` | `0x20000104` | resource-block | none | none |
| `DELETE` | `v1/households/{householdId}/devices/registrations/{deviceId}` | `deregisterDevice` | `deviceId` | `0x20000108` | resource-block | none | none |
| `GET` | `v1/players/{playerId}/devices/registration` | `getRegistrationStatus` | `-` | `0x20000101` | `0x10ad8908` `0x10ad8918` | none | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c1:`RegistrationState`:`upnpEvent`<br>c1:`RegistrationState`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/players/{playerId}/devices/registration` | `getRegistrationStatus` | `-` | `0x20000101` | `0x10ad8908` `0x10ad8918` | none | c1:`ok`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c1:`RegistrationState`:`upnpEvent`<br>c1:`RegistrationState`:`upnpEvent` |
| `PUT` | `v1/players/{playerId}/devices/registration` | `setRegistrationState` | `-` | `0x20000104` | `0x10ad8918` `0x10ad8928` | `assertion` | c1:`RegistrationState`:`upnpEvent`<br>c1:`RegistrationState`:`upnpEvent`<br>c8:`ok`:`batteryCells` `globalError`:`bluetoothPairing` `globalError`:`channelMapPair` `globalError`:`cloudRegistrationStatus` `globalError`:`chirpRequest` `globalError`:`zoneError` `globalError`:`contentResource` `globalError`:`activeZoneList`<br>c8:`ok`:`batteryCells` `globalError`:`bluetoothPairing` `globalError`:`channelMapPair` `globalError`:`cloudRegistrationStatus` `globalError`:`chirpRequest` `globalError`:`zoneError` `globalError`:`contentResource` `globalError`:`activeZoneList` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/devices/registration` | `setRegistrationState` | `-` | `0x20000104` | `0x10ad8918` `0x10ad8928` | `assertion` | c1:`RegistrationState`:`upnpEvent`<br>c1:`RegistrationState`:`upnpEvent`<br>c8:`ok`:`batteryCells` `globalError`:`bluetoothPairing` `globalError`:`channelMapPair` `globalError`:`cloudRegistrationStatus` `globalError`:`chirpRequest` `globalError`:`zoneError` `globalError`:`contentResource` `globalError`:`activeZoneList`<br>c8:`ok`:`batteryCells` `globalError`:`bluetoothPairing` `globalError`:`channelMapPair` `globalError`:`cloudRegistrationStatus` `globalError`:`chirpRequest` `globalError`:`zoneError` `globalError`:`contentResource` `globalError`:`activeZoneList` |
| `PUT` | `v1/players/{playerId}/devices/transfer` | `transferDeviceRegistration` | `-` | `0x20000104` | `0x10ad8928` `0x10ad8938` | `assertion` | c8:`ok`:`batteryCells` `globalError`:`bluetoothPairing` `globalError`:`channelMapPair` `globalError`:`cloudRegistrationStatus` `globalError`:`chirpRequest` `globalError`:`zoneError` `globalError`:`contentResource` `globalError`:`activeZoneList`<br>c8:`ok`:`batteryCells` `globalError`:`bluetoothPairing` `globalError`:`channelMapPair` `globalError`:`cloudRegistrationStatus` `globalError`:`chirpRequest` `globalError`:`zoneError` `globalError`:`contentResource` `globalError`:`activeZoneList`<br>c2:`ok`:`batteryCells` `globalError`:`activeZoneList`<br>c2:`ok`:`batteryCells` `globalError`:`activeZoneList` |
| `PUT` | `v1/households/{householdId}/players/{playerId}/devices/transfer` | `transferDeviceRegistration` | `-` | `0x20000104` | `0x10ad8928` `0x10ad8938` | `assertion` | c8:`ok`:`batteryCells` `globalError`:`bluetoothPairing` `globalError`:`channelMapPair` `globalError`:`cloudRegistrationStatus` `globalError`:`chirpRequest` `globalError`:`zoneError` `globalError`:`contentResource` `globalError`:`activeZoneList`<br>c8:`ok`:`batteryCells` `globalError`:`bluetoothPairing` `globalError`:`channelMapPair` `globalError`:`cloudRegistrationStatus` `globalError`:`chirpRequest` `globalError`:`zoneError` `globalError`:`contentResource` `globalError`:`activeZoneList`<br>c2:`ok`:`batteryCells` `globalError`:`activeZoneList`<br>c2:`ok`:`batteryCells` `globalError`:`activeZoneList` |
| `GET` | `v1/households/{householdId}/devices/local` | `getLocalDevices` | `-` | `0x20000101` | `0x10ad8938` `0x10ad8948` | none | c2:`ok`:`batteryCells` `globalError`:`activeZoneList`<br>c2:`localDevices`:`upnpEvent` `globalError`:`channelMapPair` |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10a65658`, `0x10a6578c`, `0x10a66160`, `0x10a66b3c`, `0x10a774c4`, `0x10a775a8`, `0x10a77630`, `0x10a784b4`, `0x10a78bb8`, `0x10ad7570`, `0x10ad8968`, `0x10bb2cdc`, `0x10bb2fc8`, `0x10bb3974`, `0x10bb41e8`

Field vocabulary recovered from the resource's implementation functions: `devices`, `serial`, `modelDisplayName`, `fromVersion`, `toVersion`, `clientState`, `deviceState`, `result`, `downloadDuration`, `errorMsg`, `_objectType`, `timestamp`, `systemVersion`, `numUpdatedDevices`, `numDevices`, `duration`, `systemResult`, `null`, `capabilities`, `deviceIds`, `zoneInfo`, `virtualLineInSource`, `id`, `primaryDeviceId`, `serialNumber`, `deviceId`, `model`, `color`, `apiVersion`, `minApiVersion`, `name`, `websocketUrl`, `softwareVersion`, `hwVersion`, `swGen`, `versions`, `quarantineReasons`, `vanishReason`, `zoneId`, `members`, `isUnregistered`, `type`, `controlAPI`, `trueplaySDK`, `audioTxProtocol`, `htAudioTxProtocol`, `channelMap`, `state`, `false`, `true`, `vanishedDevices`, `quarantinedDevices`, `deviceFeatures`, `origin`, `numMeasurements`, `numRetries`, `useCached`, `metrics`, `orchestrator`, `debugData`

Implementation messages:

- `\u%04X`
- `%d`

Related enum registrations (proven integer values, see `enum_tables`):

- **net_state**: `SONOSNET`=1, `STATION`=2, `DISCONNECTED`=3, `STATION_SATELLITE`=4
- **netmode**: `NETMODE_SONOSNET_WIRED`=1, `NETMODE_SONOSNET_WIRELESS`=2, `NETMODE_WIRED`=3, `NETMODE_WIRED_NO_WIFI`=4, `NETMODE_STATION`=5, `NETMODE_SATELLITE_V1`=6, `NETMODE_SATELLITE_V1_WIRED`=7, `NETMODE_SATELLITE_V2`=8
- **playback_button**: `PLAY`=1, `PAUSE`=2, `NEXT_TRACK`=3, `PREV_TRACK`=4
- **power_command**: `UNKNOWN`=1, `ON`=2, `STANDBY`=3, `TO_ON`=4, `TO_STANDBY`=5
- **quarantine_reason**: `UNKNOWN`=1, `SW_GEN`=2, `SECURE_REG`=3, `UPNP_OVER_TLS`=4
- **registration_class**: `UNKNOWN`=1, `UNREGISTERED`=2, `LEGACY_REGISTERED`=3, `SECURE_REGISTERED`=4, `TRANSFER`=5, `OFFLINE`=6, `PREP_TRANSFER`=7
- **speaker_orientation**: `UNDEFINED`=1, `HORIZONTAL`=2, `VERTICAL_WALL_ABOVE`=3, `VERTICAL_WALL_BELOW`=4, `VERTICAL_TAG_LEFT`=5, `VERTICAL_TAG_RIGHT`=6, `HORIZONTAL_WALL_MOUNTED`=7, `HORIZONTAL_LEFT`=8, `HORIZONTAL_RIGHT`=9, `VERTICAL_WALL_MOUNTED`=10, `VERTICAL_WALL_LEFT`=11, `VERTICAL_WALL_RIGHT`=12, `FACEDOWN`=13, `INVERTED`=14, `INVALID`=15
- **vanish_reason**: `BLUETOOTH`=1, `ERROR`=2, `EXPIRED`=3, `LOW_BATTERY`=4, `NEW_IP`=5, `NEW_SSID`=6, `POWERED_OFF`=7, `SLEEPING`=8, `UNKNOWN`=9, `UPGRADE`=10

Op-level JSON keys recovered from op-object methods: `muse`, `assertion`


:::

## `devicesExtended`

The extended device surface: the deeper per-device detail beyond the basics, including richer capability flags, configuration state, and diagnostics-grade fields the plain devices list doesn't carry. Apps needing more than a name and model consult this instead.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/devicesExtended` | `getExtendedDeviceStatus` | `-` | `0x20000101` | `0x101c0740` `0x101c0750` | none | c1:`ok`:`upnpEvent`<br>c3:`extendedDeviceStatus`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x101c0770`

Field vocabulary recovered from the resource's implementation functions: `devicesExtended`

Op-level JSON keys recovered from op-object methods: `muse`


:::

## `power`

Standby and sleep behavior plus power-state reads over the modern API. It's the modern counterpart of the standby and idle machinery, and it's how the app asks about and controls the player's power state directly.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/power/policy` | `setPowerPolicy` | `-` | `0x20000102` | `0x10b20c04` `0x10b22460` `0x10b22470` `0x10b2b8f4` | none | none |
| `POST` | `v1/households/{householdId}/players/{playerId}/power/policy` | `setPowerPolicy` | `-` | `0x20000102` | `0x10b20c04` `0x10b22460` `0x10b22470` `0x10b2b8f4` | none | none |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10b20c24`, `0x10b05ea8`, `0x100d5240`

Field vocabulary recovered from the resource's implementation functions: `power`, `volumeUp`, `volumeDown`, `toggleMute`, `loadResource`, `dpad`, `back`, `home`, `settings`, `togglePlay`, `secondary`, `role`, `stp`, `useCase`, `powerWakeupFromSemiSleep`, `primary`, `ht`

Related enum registrations (proven integer values, see `enum_tables`):

- **playback_button**: `PLAY`=1, `PAUSE`=2, `NEXT_TRACK`=3, `PREV_TRACK`=4
- **power_states**: `MOTION_DETECTED`=1, `MOTION_SETTLED`=2, `SLEEPING`=3, `WAKING_UP`=4, `POWERING_DOWN`=5, `POWERING_UP`=6, `SMART_DOCKED`=7, `CHARGING`=8, `PRIMARY_PLAYBACK_STARTED`=9, `POWERING_UP_UPDATED`=10, `WAKING_UP_FROM_USER`=11, `PRIMARY_NETWORK_STATUS_CHANGE`=12
- **remote_buttons**: `POWER`=1, `BACK`=2, `HOME`=3, `MENU`=4, `PLAY_PAUSE`=5, `MUSIC`=6, `DPAD_UP`=7, `DPAD_DOWN`=8, `DPAD_LEFT`=9, `DPAD_RIGHT`=10, `DPAD_SELECT`=11


:::

## `ircontrol`

Infrared remote control over the modern API: the remote-learning and IR-repeater features expressed as routes. It's the modern twin of the classic home-theater control commands that teach the soundbar your TV remote.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/ircontrol` | `setIRControl` | `-` | `0x20000102` | `0x10af8770` | `enabled` | c2:`globalError`:`bluetooth` `globalError`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c2:`globalError`:`bluetooth` `globalError`:`upnpEvent`<br>c1:`ok`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/players/{playerId}/ircontrol` | `setIRControl` | `-` | `0x20000102` | `0x10af8770` | `enabled` | c2:`globalError`:`bluetooth` `globalError`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c2:`globalError`:`bluetooth` `globalError`:`upnpEvent`<br>c1:`ok`:`upnpEvent` |
| `GET` | `v1/players/{playerId}/ircontrol` | `getIRControl` | `-` | `0x20000101` | `0x10af8770` `0x10af8780` desc:`10afb934` `10afb944` `10afb954` `10afb964` `10afb974` `10afb984` `10afb994` | `enabled` | c2:`globalError`:`bluetooth` `globalError`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c2:`globalError`:`bluetooth` `globalError`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c2:`irControlStatus`:`upnpEvent` `globalError`:`deviceInfo`<br>c2:`irControlStatus`:`upnpEvent` `globalError`:`deviceInfo` |
| `GET` | `v1/households/{householdId}/players/{playerId}/ircontrol` | `getIRControl` | `-` | `0x20000101` | `0x10af8770` `0x10af8780` desc:`10afb934` `10afb944` `10afb954` `10afb964` `10afb974` `10afb984` `10afb994` | `enabled` | c2:`globalError`:`bluetooth` `globalError`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c2:`globalError`:`bluetooth` `globalError`:`upnpEvent`<br>c1:`ok`:`upnpEvent`<br>c2:`irControlStatus`:`upnpEvent` `globalError`:`deviceInfo`<br>c2:`irControlStatus`:`upnpEvent` `globalError`:`deviceInfo` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `enabled`, `muse`


:::
