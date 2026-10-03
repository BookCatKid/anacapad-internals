# Muse spec-pair streams

Behind the modern REST API there is a catalog that spells out, for every operation, exactly which fields a request or response may carry and what type each field is. This page is that catalog, listed raw. Each section is one cluster of related operations (the verb names printed beside it), and each row inside is a field name paired with the type the firmware expects for it. Rows marked 'globalError' name the error shapes an operation can hand back, and rows marked 'upnpEvent' describe payloads the speaker pushes out to subscribers on its own rather than returning when asked. It is dense reading, but it is the ground truth for anyone building or studying a client for the API.

::: details Technical details

Each row is `{member_name_idx, type_name_idx}` decoded through the 331-entry name table at 0x10f97094.
`ffffffff`/`ffffffff` terminates a stream. `globalError` rows enumerate the error/variant payload types an op may produce;
`ok`/named members with `upnpEvent` are event-delivered payloads.

:::

## stream @ 0x10f9fc74 (n=22)
adjacent verb/param pool: `getAlarms`, `fetchAlarm`, `createAlarm`, `updateAlarm`, `snoozeAlarm`, `removeAlarm`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x16` alarmList : `0x34` upnpEvent
- `0x13` alarm : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x13` alarm : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x01` accessoryId
- `0x82` globalError : `0x00` none
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x13` alarm : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x00` none
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x13` alarm : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa00dc (n=17)
adjacent verb/param pool: `getAreas`, `createArea`, `updateArea`, `removeArea`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x21` areas : `0x34` upnpEvent
- `0x20` area : `0x34` upnpEvent
- `0xbf` playerSetError : `0x48` chirpRequest
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x20` area : `0x34` upnpEvent
- `0xbf` playerSetError : `0x48` chirpRequest
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x03` accessorySwap
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x03` accessorySwap
- `0x82` globalError : `0x48` chirpRequest

## stream @ 0x10fa0420 (n=19)
adjacent verb/param pool: `volumeRampDownSeconds`, `cancelAudioClip`, `clipMetadata`, `audioClips`

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x50` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x50` upnpEvent
- `0x25` audioClip : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x4c` commandHeader
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x06` accessPolicyControl
- `0x82` globalError : `0x41` bluetooth
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x07` accessPolicySetting
- `0x82` globalError : `0x50` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x04` tvAudioSignalStatus
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x50` upnpEvent

## stream @ 0x10fa07d0 (n=15)
adjacent verb/param pool: `resolveToken`, `getPolicyKey`, `getPermissions`, `grantType`, `assertion`, `objectType`

- `0x31` authzTokenStatus : `0x34` upnpEvent
- `0x2f` authzPolicyKey : `0x34` upnpEvent
- `0x2e` authzPermissions : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x2b` authorizationGrantResponse : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x4c` commandHeader
- `0x82` globalError : `0x4e` container
- `0x2b` authorizationGrantResponse : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x5c` diagnosticInfo
- `0x82` globalError : `0x4f` content
- `0x82` globalError : `0x49` cloudDevice
- `0x82` globalError : `0x0f` activeZoneList

## stream @ 0x10fa0c50 (n=15)
adjacent verb/param pool: `getRegistrationStatus`, `setRegistrationState`, `transferDeviceRegistration`, `vanishedDevices`, `quarantinedDevices`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xe8` RegistrationState : `0x34` upnpEvent
- `0xae` ok : `0x36` batteryCells
- `0x82` globalError : `0x43` bluetoothPairing
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x4a` cloudRegistrationStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x0e` zoneError
- `0x82` globalError : `0x54` contentResource
- `0x82` globalError : `0x0f` activeZoneList
- `0xae` ok : `0x36` batteryCells
- `0x82` globalError : `0x0f` activeZoneList
- `0xa0` localDevices : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair

## stream @ 0x10fa1080 (n=10)
adjacent verb/param pool: `reporterId`, `submitDiagnostics`, `results`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x5c` diagnosticInfo : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x52` contentPagedResources
- `0x5d` diagnosticSubmissionMetadata : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x4d` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa1450 (n=22)
adjacent verb/param pool: `getAllSettings`, `getSettingsGroup`, `updateAllSettings`, `updateSettingsGroup`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xbb` playerAllSettingsGroups : `0x34` upnpEvent
- `0xae` ok : `0x38` wirelessNetworkStatus
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x47` channelMapPair
- `0xbc` playerAnyOneSettingsGroup : `0x34` upnpEvent
- `0xae` ok : `0x38` wirelessNetworkStatus
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x47` channelMapPair
- `0xbb` playerAllSettingsGroups : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x40` bleMeasurement
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x49` cloudDevice
- `0xbc` playerAnyOneSettingsGroup : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x40` bleMeasurement
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x49` cloudDevice

## stream @ 0x10fa18d8 (n=8)
adjacent verb/param pool: `subscribeUser`, `unsubscribeUser`, `getEntitlements`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x69` entitlementsList : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x69` entitlementsList : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa1d7c (n=16)

- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x8a` groupVolume : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa20f4 (n=8)
adjacent verb/param pool: `stateCEC`, `tvCECStatus`, `tvPowerStatus`, `deviceCEC`, `stateSAM`, `errorSAM`, `stateARC`, `errorARC`, `errorTV`, `eARCActive`, `testAudio`, `testVideo`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x8c` hdmiStatus : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0x64` edidStatus : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo

## stream @ 0x10fa251c (n=12)
adjacent verb/param pool: `removeHistoryItem`, `setName`

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x41` bluetooth
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x41` bluetooth
- `0x52` contentPagedResources : `0x34` upnpEvent
- `0x82` globalError : `0x41` bluetooth
- `0x82` globalError : `0x43` bluetoothPairing
- `0x52` contentPagedResources : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x41` bluetooth
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x41` bluetooth

## stream @ 0x10fa290c (n=8)
adjacent verb/param pool: `beginHouseholdSoftwareUpdate`, `getHouseholdUpdateStatus`, `isRunning`, `designatedDeviceId`

- `0xae` ok : `0x34` upnpEvent
- `0x94` upgradeManager : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x36` batteryCells
- `0x82` globalError : `0x33` availableSoftwareUpdate
- `0x94` upgradeManager : `0x6a` versionChanged
- `0x82` globalError : `0x4e` container
- `0x93` householdUpdateStatus : `0x34` upnpEvent

## stream @ 0x10fa2bd4 (n=4)
adjacent verb/param pool: `setIRControl`, `getIRControl`

- `0x9a` irControlStatus : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0x9a` irControlStatus : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo

## stream @ 0x10fa2ffc (n=20)
adjacent verb/param pool: `removeShare`, `getIndexerStatus`, `updating`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x100` sharesList : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xff` share : `0x36` batteryCells
- `0x82` globalError : `0x4c` commandHeader
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x28` upnpEvent
- `0x82` globalError : `0x29` authorizationGrantHeader
- `0x82` globalError : `0x26` audioClipStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x4c` commandHeader
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x29` authorizationGrantHeader
- `0x82` globalError : `0x27` audioConnectorStatus
- `0xae` ok : `0x36` batteryCells
- `0x82` globalError : `0x29` authorizationGrantHeader
- `0x98` indexerStatus : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa3228 (n=5)

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa3638 (n=17)
adjacent verb/param pool: `setPreferredMusicServiceAccount`, `getPreferredMusicServiceAccount`, `endDirectControl`, `availableServicesVersion`, `registeredServicesVersion`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xa8` musicServiceAccount : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0xa8` musicServiceAccount : `0x34` upnpEvent
- `0x82` globalError : `0x20` area
- `0x82` globalError : `0x1f` amazonChallenge
- `0xa8` musicServiceAccount : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice

## stream @ 0x10fa393c (n=9)
adjacent verb/param pool: `delaySecs`, `temporarilyDisableNetwork`, `startNetworkTests`, `getNetworkTestResults`

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x50` upnpEvent
- `0x82` globalError : `0x23` artist
- `0xab` networkTestId : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x23` artist
- `0xac` networkTestResult : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x23` artist

## stream @ 0x10fa3f3c (n=20)
adjacent verb/param pool: `toggleMute`, `togglePlay`, `menuType`, `dpadDirection`

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x32` authzUser
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa4210 (n=7)
adjacent verb/param pool: `cacheSettings`, `cacheKey`, `invalidateCache`

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x4c` commandHeader

## stream @ 0x10fa44c4 (n=10)
adjacent verb/param pool: `getMetadataStatus`

- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0xa4` metadataStatus : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0xe3` rateStatus : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa487c (n=19)
adjacent verb/param pool: `playlistId`, `getPlaylists`, `getPlaylist`, `postPlaylist`, `loadPlaylist`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xc2` playlistsList : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xc4` playlistSummary : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x47` channelMapPair
- `0xc4` playlistSummary : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x47` channelMapPair
- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x1a` allowAirplaySetting
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x14` upnpEvent
- `0x82` globalError : `0x15` alarmDescription
- `0x82` globalError : `0x13` alarm

## stream @ 0x10fa51b8 (n=70)
adjacent verb/param pool: `orchestratorId`, `playStimulus`, `setStimulusTuning`, `getStimulusTuning`, `startSession`, `cancelSession`, `applyAction`, `getSessionMap`, `getDeviceMeasurements`, `sendMeasurements`, `notifySessionError`, `notifySessionStatus`, `notifyDeviceStatus`, `getMeasurementCapabilities`, `setTelemetryLevel`, `measurements`

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x2a` authorizationGrantPayload
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x5a` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x5a` upnpEvent
- `0x10f` stimulusTuningEnabled : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x5a` upnpEvent
- `0xd6` positioningSessionStatusInfo : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x5a` upnpEvent
- `0x82` globalError : `0x2e` authzPermissions
- `0x82` globalError : `0x2b` authorizationGrantResponse
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x2c` authzModifier
- `0x82` globalError : `0x5a` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x2c` authzModifier
- `0x82` globalError : `0x5a` upnpEvent
- `0xcd` positioningMap : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x23` artist
- `0x82` globalError : `0x2d` authzPermission
- `0x82` globalError : `0x2c` authzModifier
- `0x82` globalError : `0x5a` upnpEvent
- `0xcb` positioningDeviceMeasurementList : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x23` artist
- `0x82` globalError : `0x2d` authzPermission
- `0x82` globalError : `0x2c` authzModifier
- `0x82` globalError : `0x5a` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x2c` authzModifier
- `0x82` globalError : `0x5a` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x2c` authzModifier
- `0x82` globalError : `0x5a` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x2c` authzModifier
- `0x82` globalError : `0x5a` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x5a` upnpEvent
- `0xd0` positioningMeasurementCapabilityList : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x5a` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x5a` upnpEvent

## stream @ 0x10fa5788 (n=10)
adjacent verb/param pool: `startSignalling`, `stopSignalling`

- `0x48` chirpRequest : `0x34` upnpEvent
- `0x82` globalError : `0x21` areas
- `0x82` globalError : `0x22` versionChanged
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x41` bluetooth
- `0x82` globalError : `0x50` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x50` upnpEvent

## stream @ 0x10fa63cc (n=70)
adjacent verb/param pool: `targetSettingsOnly`, `namespaces`, `delayMillis`, `subscribePlayerSettings`, `unsubscribePlayerSettings`, `getPlayerSettings`, `setPlayerSettings`, `setAllowMicrophone`, `setSelfTruePlay`, `setEnablePositioningMeasurement`, `setSonosNetChannel`, `getRestrictedAdminSettings`, `setUserMetricsTracking`, `setRestrictedAdminSettings`, `getPublicSettings`, `getProtectedSettings`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xf9` settings : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xbd` playerSettings : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x47` channelMapPair
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x50` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x4e` container
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x41` bluetooth
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x41` bluetooth
- `0x82` globalError : `0x50` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x50` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x50` upnpEvent
- `0xae` ok : `0x36` batteryCells
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xbb` playerAllSettingsGroups : `0x34` upnpEvent
- `0xae` ok : `0x38` wirelessNetworkStatus
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x47` channelMapPair
- `0xbc` playerAnyOneSettingsGroup : `0x34` upnpEvent
- `0xae` ok : `0x38` wirelessNetworkStatus
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x47` channelMapPair
- `0xbb` playerAllSettingsGroups : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x40` bleMeasurement
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x49` cloudDevice
- `0xbc` playerAnyOneSettingsGroup : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x40` bleMeasurement
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x49` cloudDevice
- `0xf0` restrictedAdminSettings : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0xde` publicSettings : `0x34` upnpEvent
- `0x82` globalError : `0x5f` diagnosticSubmissionResults
- `0xdd` protectedSettings : `0x34` upnpEvent
- `0xad` offlinePsk : `0x34` upnpEvent
- `0x82` globalError : `0x5a` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xdc` protectedAdminSettings : `0x34` upnpEvent
- `0x108` sonosnetEnabled : `0x34` upnpEvent
- `0x107` sonosnet : `0x34` upnpEvent
- `0xaa` networksList : `0x34` upnpEvent
- `0xad` offlinePsk : `0x34` upnpEvent
- `0x82` globalError : `0x5a` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa6a7c (n=11)
adjacent verb/param pool: `configureSleepTimer`, `getSleepTimer`, `remainingTimeDuration`, `getContent`

- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0xae` ok : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x103` sleepTimerStatus : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x103` sleepTimerStatus : `0x34` upnpEvent
- `0x86` groupCoordinatorChanged : `0x42` bluetoothDevice
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa6d48 (n=5)
adjacent verb/param pool: `triggerSwap`, `requestSwap`

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x50` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x10a` soundSwapRequestResponse : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa6f54 (n=13)
adjacent verb/param pool: `setWeatherConfig`, `getWeatherConfig`, `voiceCommand`, `getTimeZoneInfo`, `setTimeZoneInfo`

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x2f` authzPolicyKey
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x59` deviceInfo
- `0x13d` weatherConfig : `0x34` upnpEvent
- `0x82` globalError : `0x2f` authzPolicyKey
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x59` deviceInfo
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x2f` authzPolicyKey
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x59` deviceInfo

## stream @ 0x10fa717c (n=5)
adjacent verb/param pool: `getTimeZoneInfo`, `setTimeZoneInfo`, `getRelativeTime`

- `0x116` timeZoneInfo : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x116` timeZoneInfo : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa7794 (n=26)
adjacent verb/param pool: `setDuration`, `setRelativeDuration`, `pauseTimer`, `resumeTimer`, `abortTimer`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x114` timers : `0x34` upnpEvent
- `0x113` timer : `0x34` upnpEvent
- `0x82` globalError : `0x4c` commandHeader
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x113` timer : `0x34` upnpEvent
- `0x82` globalError : `0x4c` commandHeader
- `0x82` globalError : `0x30` authzPolicyKeyLechmere
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x113` timer : `0x34` upnpEvent
- `0x82` globalError : `0x4c` commandHeader
- `0x82` globalError : `0x30` authzPolicyKeyLechmere
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x113` timer : `0x34` upnpEvent
- `0x82` globalError : `0x30` authzPolicyKeyLechmere
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x113` timer : `0x34` upnpEvent
- `0x82` globalError : `0x30` authzPolicyKeyLechmere
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x30` authzPolicyKeyLechmere
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa7de4 (n=14)
adjacent verb/param pool: `detectSpeakers`, `detectSpeakerPresence`, `resetDetectedSpeaker`, `setSpeakerPresenceRate`, `getConfiguration`, `setConfiguration`, `getTrueplayStatus`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x10b` speakerDetectionStatus : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x10e` speakerPresenceResultList : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x10c` speakerPresenceEffectiveRate : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x11f` trueplayConfiguration : `0x34` upnpEvent
- `0x11f` trueplayConfiguration : `0x34` upnpEvent
- `0x120` trueplayStatus : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair

## stream @ 0x10fa82ec (n=17)
adjacent verb/param pool: `getCalibrationStatus`, `playSuccessTone`, `setSwapInputMute`, `trueroomEstimatedParams`

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x127` trueroomEstimatorConfig : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x123` trueroomAdaptationStatus : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x125` trueroomCalibrationStatus : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus

## stream @ 0x10fa86d8 (n=14)

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x12d` updateItem : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x0a` acousticMetrics
- `0x82` globalError : `0x0b` activeZone
- `0x82` globalError : `0x0c` activeZonesChange
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x0d` zoneDefinitionsChange
- `0x82` globalError : `0x4e` container
- `0x5b` deviceSoftwareUpdateStatus : `0x34` upnpEvent
- `0x82` globalError : `0x4d` upnpEvent

## stream @ 0x10fa89a0 (n=11)
adjacent verb/param pool: `output`, `renew`

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10fa8c5c (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10fa8f08 (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10fa91b4 (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10fa9460 (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10fa970c (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10fa99b8 (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10fa9c64 (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10fa9f10 (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10faa1bc (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10faa468 (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10faa714 (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10faa9c0 (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10faac6c (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10faaf18 (n=11)

- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting
- `0x131` upnpResponse : `0x34` upnpEvent
- `0x12e` upnpError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x66` enableContentAccessSetting

## stream @ 0x10fab2c4 (n=19)
adjacent verb/param pool: `backChannelCmd`, `modifier`, `sendButtonCommand`

- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x50` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x11e` transportSetting : `0x34` upnpEvent
- `0x82` globalError : `0x50` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x50` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0x82` globalError : `0x3f` wiredSubStatus
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x50` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x47` channelMapPair

## stream @ 0x10fab8d4 (n=27)
adjacent verb/param pool: `allowVoiceDataCollection`, `wakeword`, `amazon`, `getVoiceAccounts`, `updateVoiceAccount`, `removeVoiceAccount`, `createAmazonChallenge`, `notifyInitiateOnboarding`, `timeoutSeconds`

- `0x138` voiceAccountsList : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0x08` accountError : `0x39` microphoneSwitch
- `0x08` accountError : `0x48` chirpRequest
- `0x08` accountError : `0x3f` wiredSubStatus
- `0x08` accountError : `0x41` bluetooth
- `0x137` voiceAccount : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0x08` accountError : `0x3a` waterState
- `0x08` accountError : `0x48` chirpRequest
- `0x08` accountError : `0x3f` wiredSubStatus
- `0x08` accountError : `0x41` bluetooth
- `0x137` voiceAccount : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0xae` ok : `0x34` upnpEvent
- `0x08` accountError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x59` deviceInfo
- `0x1f` amazonChallenge : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0x82` globalError : `0x43` bluetoothPairing
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x59` deviceInfo
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x59` deviceInfo

## stream @ 0x10fac294 (n=45)
adjacent verb/param pool: `fronthaulChannel`, `backhaulChannel`, `getActiveZoneList`, `getZoneDefinition`, `getZoneDefinitionList`, `addZoneDefinition`, `addMissingZoneDefinition`, `updateZoneDefinition`, `updateActiveZone`, `updateZoneMemberSettings`, `removeZoneDefinition`, `activateZone`, `deactivateZone`, `joinZone`, `unjoinZone`

- `0xae` ok : `0x34` upnpEvent
- `0xae` ok : `0x34` upnpEvent
- `0x0f` activeZoneList : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x140` zoneDefinition : `0x34` upnpEvent
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x141` zoneDefinitionList : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x140` zoneDefinition : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x10` activeZoneMember
- `0x140` zoneDefinition : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x10` activeZoneMember
- `0x140` zoneDefinition : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x10` activeZoneMember
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x10` activeZoneMember
- `0x140` zoneDefinition : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x47` channelMapPair
- `0xae` ok : `0x34` upnpEvent
- `0x82` globalError : `0x3f` wiredSubStatus
- `0x82` globalError : `0x48` chirpRequest
- `0x82` globalError : `0x47` channelMapPair

## stream @ 0x10ffca08 (n=14)

- `0x00` none : `0x01` accessoryId
- `0x01` accessoryId : `0x00` none
- `0x01` accessoryId : `0x01` accessoryId
- `0x01` accessoryId : `0x00` none
- `0x00` none : `0x01` accessoryId
- `0x01` accessoryId : `0x01` accessoryId
- `0x01` accessoryId : `0x01` accessoryId
- `0x01` accessoryId : `0x00` none
- `0x00` none : `0x01` accessoryId
- `0x01` accessoryId : `0x01` accessoryId
- `0x01` accessoryId : `0x01` accessoryId
- `0x01` accessoryId : `0x01` accessoryId
- `0x01` accessoryId : `0x00` none
- `0x01` accessoryId : `0x03` accessorySwap
