# State variables: `DeviceProperties`

### `DP.CurrentZoneName`

This speaker's room name, the label you gave it in the app such as 'Kitchen'. It fires when the room gets renamed, so every display updates.

::: details Technical details

DeviceProperties evented variable (ZoneNameChangedEvent)

:::

- **TODO:** Established: the variable's type (string), evented=True, and declared semantics are documented for DeviceProperties.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `DP.Invisible`

Whether the speaker is hidden. This 'invisible' flag removes the player from normal room display, and it is used for satellites and bonded members that shouldn't appear as separate rooms.

::: details Technical details

DeviceProperties evented variable (DeviceInfo attr literal)

:::

- **TODO:** Established: the variable's type (boolean), evented=True, and declared semantics are documented for DeviceProperties.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `DP.MicEnabled`

Whether the speaker's microphone is enabled. It is the mic-on flag for voice-capable products, kept in this service's spec for parity even though this older hardware has no mic.

::: details Technical details

DeviceProperties evented variable (DeviceInfo attr literal)

:::

- **TODO:** Established: the variable's type (boolean), evented=True, and declared semantics are documented for DeviceProperties.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `DP.ResetVolumeAfter`

Whether the speaker resets its volume after a triggered session. It is the flag used by alarm and autoplay so a wake-up volume doesn't become the permanent level.

::: details Technical details

DeviceProperties evented variable in f_102fc6f4

:::

- **TODO:** Established: the variable's type (boolean), evented=True, and declared semantics are documented for DeviceProperties.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `DeviceProperties.A_ARG_TYPE_ButtonState`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetButtonState`

### `DeviceProperties.A_ARG_TYPE_ConfigModeOptions`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `EnterConfigMode`, `ExitConfigMode`

### `DeviceProperties.A_ARG_TYPE_ConfigModeState`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `EnterConfigMode`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpChannel`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- range: `minimum` = 0; `maximum` = 7; `step` = 1
- related actions: `RoomDetectionStartChirping`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpIfPlayingSwappableAudio`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RoomDetectionStartChirping`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionDurationMilliseconds`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RoomDetectionStartChirping`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionPlayId`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RoomDetectionStartChirping`, `RoomDetectionStopChirping`

### `DeviceProperties.AirPlayEnabled`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.AlexaCBLSupported`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.AutoplayIncludeLinkedZones`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetAutoplayLinkedZones`, `SetAutoplayLinkedZones`

### `DeviceProperties.AutoplayRoomUUID`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetAutoplayRoomUUID`, `SetAutoplayRoomUUID`

### `DeviceProperties.AutoplaySource`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetAutoplayLinkedZones`, `GetAutoplayRoomUUID`, `GetAutoplayVolume`, `GetUseAutoplayVolume`, `SetAutoplayLinkedZones`, `SetAutoplayRoomUUID`, `SetAutoplayVolume`, `SetUseAutoplayVolume`

### `DeviceProperties.AutoplayUseVolume`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetUseAutoplayVolume`, `SetUseAutoplayVolume`

### `DeviceProperties.AutoplayVolume`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `GetAutoplayVolume`, `SetAutoplayVolume`

### `DeviceProperties.AvailableRoomCalibration`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.BehindWifiExtender`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.ButtonLockState`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetButtonLockState`, `SetButtonLockState`

### `DeviceProperties.ChannelFreq`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.ChannelMapSet`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::

- related actions: `AddBondedZones`, `CreateStereoPair`, `RemoveBondedZones`, `SeparateStereoPair`

### `DeviceProperties.ConfigMode`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::

- related actions: `EnterConfigMode`

### `DeviceProperties.Configuration`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.ConnectionType`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.CopyrightInfo`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneInfo`

### `DeviceProperties.DisplaySoftwareVersion`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneInfo`

### `DeviceProperties.EthLink`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.ExtraInfo`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneInfo`

### `DeviceProperties.Flags`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneInfo`

### `DeviceProperties.HTAudioIn`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneInfo`

### `DeviceProperties.HTBondedZoneCommitState`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.HTSatChanMapSet`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::

- related actions: `AddHTSatellite`

### `DeviceProperties.HardwareVersion`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneInfo`

### `DeviceProperties.HasConfiguredSSID`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.HdmiCecAvailable`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.HouseholdID`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetHouseholdID`

### `DeviceProperties.IPAddress`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneInfo`

### `DeviceProperties.Icon`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.Invisible`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.IsIdle`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.IsZoneBridge`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.KeepGrouped`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `RemoveBondedZones`

### `DeviceProperties.LEDState`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetLEDState`, `SetLEDState`

### `DeviceProperties.LastChangedPlayState`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.MACAddress`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneInfo`

### `DeviceProperties.MicEnabled`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.MoreInfo`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.Orientation`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.RoomCalibrationState`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.SatRoomUUID`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `RemoveHTSatellite`

### `DeviceProperties.SecureRegState`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.SerialNumber`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneInfo`

### `DeviceProperties.SettingsReplicationState`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.SoftwareVersion`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneInfo`

### `DeviceProperties.SupportsAudioClip`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.SupportsAudioIn`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.SvcActive`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.TVConfigurationError`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.TargetRoomName`

::: details Technical details

non-evented DeviceProperties state variable: read via action out-args, not pushed

:::

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.VoiceConfigState`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.WifiEnabled`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.WirelessMode`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::


### `DeviceProperties.ZoneName`

::: details Technical details

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

:::

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `device_props_extra_vars`

Additional device-property fields the settings service carries beyond the standard set: the extra bits of speaker configuration reported alongside the usual name, LED, and button state.

::: details Technical details

more state vars

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `device_props_update_ids`

The set of change-counters the device-properties service keeps. These version numbers tick when different aspects of the speaker's config change, so interested parties can tell what moved without comparing every field.

::: details Technical details

update counters

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.
