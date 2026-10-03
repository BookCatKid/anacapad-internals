# muse resources: Audio input

The line-in and AirPlay-style input surface: virtual line-in sources exposed as streams other players can subscribe to. The JSON counterpart of the VirtualLineIn service.

## `virtualLineIn`

External-audio sessions as JSON resources: the push-audio feature's modern surface, parallel to the classic VLI service. It's how the app creates or joins an external-feed session through the modern API rather than the classic commands.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/virtualLineIn/selectSource` | `selectSource` | `-` | `0x20000102` | `0x10b82f68` | `source` | c4:<br>c4: |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/selectSource` | `selectSource` | `-` | `0x20000102` | `0x10b82f68` | `source` | c4:<br>c4: |
| `POST` | `v1/players/{playerId}/virtualLineIn/startTransmission` | `startTransmission` | `-` | `0x20000102` | `0x10b82f68` `0x10b82f78` | `source` | c4:<br>c4:<br>c4:`transportSetting`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c4:`transportSetting`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/startTransmission` | `startTransmission` | `-` | `0x20000102` | `0x10b82f68` `0x10b82f78` | `source` | c4:<br>c4:<br>c4:`transportSetting`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c4:`transportSetting`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `POST` | `v1/players/{playerId}/virtualLineIn/stopTransmission` | `stopTransmission` | `-` | `0x20000102` | `0x10b82f78` `0x10b82f88` | `source` | c4:`transportSetting`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c4:`transportSetting`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c4:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c4:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/stopTransmission` | `stopTransmission` | `-` | `0x20000102` | `0x10b82f78` `0x10b82f88` | `source` | c4:`transportSetting`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c4:`transportSetting`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c4:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c4:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus` |
| `POST` | `v1/players/{playerId}/virtualLineIn/sendBackChannelCmd` | `sendBackChannelCmd` | `-` | `0x20000102` | `0x10b82f88` `0x10b82f98` | `source`, `backChannelCmd` | c4:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c4:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/sendBackChannelCmd` | `sendBackChannelCmd` | `-` | `0x20000102` | `0x10b82f88` `0x10b82f98` | `source`, `backChannelCmd` | c4:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c4:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus` |
| `POST` | `v1/players/{playerId}/virtualLineIn/startAudio` | `startAudio` | `-` | `0x20000102` | `0x10b82f98` `0x10b82fa8` | `backChannelCmd` | c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/startAudio` | `startAudio` | `-` | `0x20000102` | `0x10b82f98` `0x10b82fa8` | `backChannelCmd` | c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c3:`ok`:`upnpEvent` `globalError`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`wiredSubStatus`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair` |
| `POST` | `v1/players/{playerId}/virtualLineIn/stopAudio` | `stopAudio` | `-` | `0x20000102` | `0x10b82fa8` `0x10b82fb8` | none | c2:`ok`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair` |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualLineIn/stopAudio` | `stopAudio` | `-` | `0x20000102` | `0x10b82fa8` `0x10b82fb8` | none | c2:`ok`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair`<br>c2:`ok`:`upnpEvent` `globalError`:`channelMapPair` |

::: details Recovered vocabulary & internals

Related enum registrations (proven integer values, see `enum_tables`):

- **abort_reasons**: `NONE`=1, `ABORT_UNRECOGNIZED_OP`=2, `ABORT_INCORRECT_MODE`=3, `ABORT_NO_SOURCE`=4, `ABORT_INVALID_OP`=5, `ABORT_REFUSED`=6, `ABORT_UNDETERMINED`=7, `DEVICE`=8, `NACK`=9, `REPLY_TIMEOUT`=10, `ROOT_INDIRECT`=11, `BROADCAST_BLOCKED`=12, `UNKNOWN`=13
- **linein_conn_state**: `NO_CONNECTION`=1, `CONNECTED`=2, `SONGLE`=3, `UNKNOWN`=4

Op-level JSON keys recovered from op-object methods: `source`, `muse`, `backChannelCmd`


:::
