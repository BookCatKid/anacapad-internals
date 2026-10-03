# muse resources: Voice & remote control

Voice assistant plumbing and the virtual remote: enabling and querying voice services, plus the virtualRemoteControl endpoint that lets the household push transport commands into a player without a direct session.

## `voice`

Voice-assistant integration: the voice-service routes (status, linked assistants) on products that support them. It's present in the shared codebase for platform parity even where the hardware lacks microphones.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/players/{playerId}/voice/accounts` | `getVoiceAccounts` | `-` | `0x20000101` | `0x10b894b0` desc:`10b92fe0` `10b92ff0` `10b93000` | none | c2:<br>c2: |
| `GET` | `v1/households/{householdId}/players/{playerId}/voice/accounts` | `getVoiceAccounts` | `-` | `0x20000101` | `0x10b894b0` desc:`10b92fe0` `10b92ff0` `10b93000` | none | c2:<br>c2: |
| `POST` | `v1/players/{playerId}/voice/accounts` | `createVoiceAccount` | `-` | `0x20000102` | `0x10b894b0` `0x10b894c0` | `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `wakeword`, `wakeword` | c2:<br>c2:<br>c6:`accountError`:`microphoneSwitch` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c6:`accountError`:`microphoneSwitch` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/accounts` | `createVoiceAccount` | `-` | `0x20000102` | `0x10b894b0` `0x10b894c0` | `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `wakeword`, `wakeword` | c2:<br>c2:<br>c6:`accountError`:`microphoneSwitch` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c6:`accountError`:`microphoneSwitch` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo` |
| `POST` | `v1/players/{playerId}/voice/accounts/{accountId}` | `updateVoiceAccount` | `accountId` | `0x20000102` | `0x10b894c0` `0x10b894d0` desc:`10b93010` `10b93020` `10b93030` | `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `wakeword`, `wakeword`, `accountId` | c6:`accountError`:`microphoneSwitch` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c6:`accountError`:`microphoneSwitch` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c6:`accountError`:`waterState` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c6:`accountError`:`waterState` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/accounts/{accountId}` | `updateVoiceAccount` | `accountId` | `0x20000102` | `0x10b894c0` `0x10b894d0` desc:`10b93010` `10b93020` `10b93030` | `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `wakeword`, `wakeword`, `accountId` | c6:`accountError`:`microphoneSwitch` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c6:`accountError`:`microphoneSwitch` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c6:`accountError`:`waterState` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c6:`accountError`:`waterState` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo` |
| `DELETE` | `v1/players/{playerId}/voice/accounts/{accountId}` | `removeVoiceAccount` | `accountId` | `0x20000108` | `0x10b894d0` `0x10b894e0` desc:`10b93040` `10b93050` `10b93060` | `allowVoiceDataCollection`, `accountId`, `wakeword`, `wakeword` | c6:`accountError`:`waterState` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c6:`accountError`:`waterState` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c3:`ok`:`upnpEvent` `accountError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c3:`ok`:`upnpEvent` `accountError`:`wiredSubStatus` `globalError`:`deviceInfo` |
| `DELETE` | `v1/households/{householdId}/players/{playerId}/voice/accounts/{accountId}` | `removeVoiceAccount` | `accountId` | `0x20000108` | `0x10b894d0` `0x10b894e0` desc:`10b93040` `10b93050` `10b93060` | `allowVoiceDataCollection`, `accountId`, `wakeword`, `wakeword` | c6:`accountError`:`waterState` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c6:`accountError`:`waterState` `accountError`:`chirpRequest` `accountError`:`wiredSubStatus` `accountError`:`bluetooth` `voiceAccount`:`upnpEvent` `globalError`:`deviceInfo`<br>c3:`ok`:`upnpEvent` `accountError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c3:`ok`:`upnpEvent` `accountError`:`wiredSubStatus` `globalError`:`deviceInfo` |
| `POST` | `v1/players/{playerId}/voice/amazonChallenge` | `createAmazonChallenge` | `-` | `0x20000102` | `0x10b894e0` `0x10b894f0` desc:`10b93070` `10b93080` `10b93090` | `accountId` | c3:`ok`:`upnpEvent` `accountError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c3:`ok`:`upnpEvent` `accountError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c3:`amazonChallenge`:`upnpEvent` `globalError`:`deviceInfo` `globalError`:`bluetoothPairing`<br>c3:`amazonChallenge`:`upnpEvent` `globalError`:`deviceInfo` `globalError`:`bluetoothPairing` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/amazonChallenge` | `createAmazonChallenge` | `-` | `0x20000102` | `0x10b894e0` `0x10b894f0` desc:`10b93070` `10b93080` `10b93090` | `accountId` | c3:`ok`:`upnpEvent` `accountError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c3:`ok`:`upnpEvent` `accountError`:`wiredSubStatus` `globalError`:`deviceInfo`<br>c3:`amazonChallenge`:`upnpEvent` `globalError`:`deviceInfo` `globalError`:`bluetoothPairing`<br>c3:`amazonChallenge`:`upnpEvent` `globalError`:`deviceInfo` `globalError`:`bluetoothPairing` |
| `POST` | `v1/players/{playerId}/voice/setup` | `notifyInitiateOnboarding` | `-` | `0x20000102` | `0x10b894f0` `0x10b89500` desc:`10b930a0` `10b930b0` `10b930c0` | `service` | c3:`amazonChallenge`:`upnpEvent` `globalError`:`deviceInfo` `globalError`:`bluetoothPairing`<br>c3:`amazonChallenge`:`upnpEvent` `globalError`:`deviceInfo` `globalError`:`bluetoothPairing`<br>c3:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`deviceInfo`<br>c1:`ok`:`upnpEvent`<br>c3:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`deviceInfo`<br>c1:`ok`:`upnpEvent` |
| `POST` | `v1/households/{householdId}/players/{playerId}/voice/setup` | `notifyInitiateOnboarding` | `-` | `0x20000102` | `0x10b894f0` `0x10b89500` desc:`10b930a0` `10b930b0` `10b930c0` | `service` | c3:`amazonChallenge`:`upnpEvent` `globalError`:`deviceInfo` `globalError`:`bluetoothPairing`<br>c3:`amazonChallenge`:`upnpEvent` `globalError`:`deviceInfo` `globalError`:`bluetoothPairing`<br>c3:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`deviceInfo`<br>c1:`ok`:`upnpEvent`<br>c3:`ok`:`upnpEvent` `globalError`:`chirpRequest` `globalError`:`deviceInfo`<br>c1:`ok`:`upnpEvent` |

::: details Recovered vocabulary & internals

Op-level JSON keys recovered from op-object methods: `muse`, `allowVoiceDataCollection`, `timeoutSeconds`, `service`, `nickname`, `status`, `wakeword`, `amazon`, `accountId`


:::

## `virtualRemoteControl`

Virtual remote control: lets an app act as the speaker's remote, with button events and remote-style commands delivered as API calls rather than hardware presses.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/players/{playerId}/virtualRemoteControl/buttonCommand` | `sendButtonCommand` | `-` | `0x20000102` | `0x10b8541c` `0x10b894b0` `0x10b894c0` `0x10b894d0` `0x10b894e0` desc:`10b894b0` `10b894c0` `10b894d0` `10b894e0` `10b894f0` `10b89500` `10b89510` `10b89520` | none | none |
| `POST` | `v1/households/{householdId}/players/{playerId}/virtualRemoteControl/buttonCommand` | `sendButtonCommand` | `-` | `0x20000102` | `0x10b8541c` `0x10b894b0` `0x10b894c0` `0x10b894d0` `0x10b894e0` desc:`10b894b0` `10b894c0` `10b894d0` `10b894e0` `10b894f0` `10b89500` `10b89510` `10b89520` | none | none |

::: details Recovered vocabulary & internals

Resource implementation functions (string-block registrar family): `0x10b85458`

Field vocabulary recovered from the resource's implementation functions: `virtualRemoteControl`

Related enum registrations (proven integer values, see `enum_tables`):

- **dpad_directions**: `UP`=1, `DOWN`=2, `LEFT`=3, `RIGHT`=4, `SELECT`=5
- **remote_buttons**: `POWER`=1, `BACK`=2, `HOME`=3, `MENU`=4, `PLAY_PAUSE`=5, `MUSIC`=6, `DPAD_UP`=7, `DPAD_DOWN`=8, `DPAD_LEFT`=9, `DPAD_RIGHT`=10, `DPAD_SELECT`=11
- **vrc_event_source**: `HEALTHCHECK`=1, `SERVER`=2, `USER`=3, `SNF`=4, `FEEDBACK`=5, `EXTRALOCAL`=6
- **vrc_state**: `CLOSED`=1, `ERROR`=2, `INIT`=3, `OFFLINE`=4, `CONFIGURING`=5, `NO_LOGICAL_ADDRESS`=6, `READY`=7


:::

## `smartplay`

'Smart play', Sonos's smarter playback-decision feature family, exposed as its own resource group. The operations listed below are the routes it adds, and the name reflects an intelligent-playback feature rather than a user-facing setting.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `GET` | `v1/households/{householdId}/smartplay/content` | `getContent` | `-` | `0x20000101` | `0x10b3446c` `0x10b35b38` `0x10b35b48` `0x10b37854` desc:`10b35b38` `10b35b48` | none | none |

::: details Recovered vocabulary & internals

Field vocabulary (request/response keys seen in the resource's client tables, not yet bound to individual ops): `currentVersion`, `downloadSpeed`, `fromVersion`, `hardwareVersion`, `householdId`, `requestPath`, `serialNumber`, `sonosId`, `systemVersion`, `updateId`


:::
