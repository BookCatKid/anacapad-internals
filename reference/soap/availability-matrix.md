# Availability matrix

The complete command surface in one table: every action the firmware can route to real code, alongside whether it actually works. For each command you can see whether it's advertised to apps, whether calling it does anything, and how confident we are in that verdict.

::: details Technical details

Every canonical action record. `advertised` services are in the served device-description `serviceList` (all except AudioIn); every canonical action is declared in its service's shipped SCPD. `stub` = dispatched to a reject-all fault (removed surface).

:::

In addition, 2 SCPD-advertised actions have **no dispatch record at all** (hard/soft removed): `SystemProperties.ProvisionCredentialedTrialAccountX`, `SystemProperties.ResetThirdPartyCredentials`

## `AVTransport` `/MediaRenderer/AVTransport/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `AddMultipleURIsToQueue` | advertised | callable | `0x102fb7e8` |
| `AddURIToQueue` | advertised | callable | `0x102facf8` |
| `AddURIToSavedQueue` | advertised | callable | `0x102fb2d8` |
| `BackupQueue` | advertised | callable | `0x102f8db0` |
| `BecomeCoordinatorOfStandaloneGroup` | advertised | callable | `0x102f8b04` |
| `BecomeGroupCoordinator` | advertised | callable | `0x102fc8b0` |
| `BecomeGroupCoordinatorAndSource` | advertised | callable | `0x102fc3a0` |
| `ChangeCoordinator` | advertised | callable | `0x102fa3ec` |
| `ChangeTransportSettings` | advertised | callable | `0x102f95b8` |
| `ConfigureSleepTimer` | advertised | callable | `0x102f9878` |
| `CreateSavedQueue` | advertised | callable | `0x102fb0b0` |
| `DelegateGroupCoordinationTo` | advertised | callable | `0x102fa26c` |
| `EndDirectControlSession` | advertised | callable | `0x102f8e9c` |
| `GetCrossfadeMode` | advertised | callable | `0x102fc28c` |
| `GetCurrentTransportActions` | advertised | callable | `0x102f884c` |
| `GetDeviceCapabilities` | advertised | callable | `0x102f8970` |
| `GetMediaInfo` | advertised | callable | `0x102fa9e4` |
| `GetPositionInfo` | advertised | callable | `0x102fbda4` |
| `GetRemainingSleepTimerDuration` | advertised | callable | `0x102fb518` |
| `GetRunningAlarmProperties` | advertised | callable | `0x102fb664` |
| `GetTransportInfo` | advertised | callable | `0x102fbb60` |
| `GetTransportSettings` | advertised | callable | `0x102f8340` |
| `Next` | advertised | callable | `0x102f8674` |
| `NotifyDeletedURI` | advertised | callable | `0x102f912c` |
| `Pause` | advertised | callable | `0x102f8588` |
| `Play` | advertised | callable | `0x102f9244` |
| `Previous` | advertised | callable | `0x102f8760` |
| `RemoveAllTracksFromQueue` | advertised | callable | `0x102f8cc4` |
| `RemoveTrackFromQueue` | advertised | callable | `0x102f9aa8` |
| `RemoveTrackRangeFromQueue` | advertised | callable | `0x102faf24` |
| `ReorderTracksInQueue` | advertised | callable | `0x102f8f88` |
| `ReorderTracksInSavedQueue` | advertised | callable | `0x102fc078` |
| `RunAlarm` | advertised | callable | `0x102fc4ac` |
| `SaveQueue` | advertised | callable | `0x102f96fc` |
| `Seek` | advertised | callable | `0x102f935c` |
| `SetAVTransportURI` | advertised | callable | `0x102fa71c` |
| `SetCrossfadeMode` | advertised | callable | `0x102fa158` |
| `SetNextAVTransportURI` | advertised | callable | `0x102fa880` |
| `SetPlayMode` | advertised | callable | `0x102f94a0` |
| `SnoozeAlarm` | advertised | callable | `0x102f9990` |
| `StartAutoplay` | advertised | callable | `0x102fc6f4` |
| `Stop` | advertised | callable | `0x102f849c` |

## `AlarmClock` `/AlarmClock/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `CreateAlarm` | advertised | callable | `0x10734404` |
| `DestroyAlarm` | advertised | callable | `0x10734954` |
| `GetDailyIndexRefreshTime` | advertised | callable | `0x10734d18` |
| `GetFormat` | advertised | callable | `0x10734f28` |
| `GetHouseholdTimeAtStamp` | advertised | callable | `0x10733fb4` |
| `GetTimeNow` | advertised | callable | `0x1073505c` |
| `GetTimeServer` | advertised | callable | `0x10734c1c` |
| `GetTimeZone` | advertised | callable | `0x10734e14` |
| `GetTimeZoneAndRule` | advertised | callable | `0x10734a40` |
| `GetTimeZoneRule` | advertised | callable | `0x107341cc` |
| `ListAlarms` | advertised | callable | `0x10734b8c` |
| `SetDailyIndexRefreshTime` | advertised | callable | `0x107340dc` |
| `SetFormat` | advertised | callable | `0x10733c8c` |
| `SetTimeNow` | advertised | callable | `0x10733e98` |
| `SetTimeServer` | advertised | callable | `0x10733da8` |
| `SetTimeZone` | advertised | callable | `0x107342f0` |
| `UpdateAlarm` | advertised | callable | `0x107346ac` |

## `AudioIn` `/AudioIn/Control` (hidden)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `StartTransmissionToGroup` | advertised | stub | `0x1073d8f8` |
| `StopTransmissionToGroup` | advertised | stub | `0x1073d8f8` |
| `SetAudioInputAttributes` | advertised | stub | `0x1073d8f8` |
| `GetAudioInputAttributes` | advertised | stub | `0x1073d8f8` |
| `SetLineInLevel` | advertised | stub | `0x1073d8f8` |
| `GetLineInLevel` | advertised | stub | `0x1073d8f8` |

## `ConnectionManager` `/MediaRenderer/ConnectionManager/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `GetCurrentConnectionIDs` | advertised | callable | `0x107359e0` |
| `GetCurrentConnectionInfo` | advertised | callable | `0x107356bc` |
| `GetProtocolInfo` | advertised | callable | `0x10735b64` |

## `ConnectionManager` `/MediaServer/ConnectionManager/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `GetCurrentConnectionIDs` | advertised | callable | `0x107359e0` |
| `GetCurrentConnectionInfo` | advertised | callable | `0x107356bc` |
| `GetProtocolInfo` | advertised | callable | `0x10735b64` |

## `ContentDirectory` `/MediaServer/ContentDirectory/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `Browse` | advertised | callable | `0x10306b3c` |
| `CreateObject` | advertised | callable | `0x10306b84` |
| `DestroyObject` | advertised | callable | `0x10306e70` |
| `FindPrefix` | advertised | callable | `0x10307140` |
| `GetAlbumArtistDisplayOption` | advertised | callable | `0x10307b70` |
| `GetAllPrefixLocations` | advertised | callable | `0x103072ac` |
| `GetBrowseable` | advertised | callable | `0x103077d0` |
| `GetLastIndexChange` | advertised | callable | `0x103079a8` |
| `GetSearchCapabilities` | advertised | callable | `0x10307e10` |
| `GetShareIndexInProgress` | advertised | callable | `0x103078bc` |
| `GetSortCapabilities` | advertised | callable | `0x10307cc0` |
| `GetSystemUpdateID` | advertised | callable | `0x1030751c` |
| `RefreshShareIndex` | advertised | callable | `0x10306f60` |
| `RequestResort` | advertised | callable | `0x10307050` |
| `SetBrowseable` | advertised | callable | `0x10307424` |
| `UpdateObject` | advertised | callable | `0x10306d28` |

## `DeviceProperties` `/DeviceProperties/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `AddBondedZones` | advertised | callable | `0x10735e4c` |
| `AddHTSatellite` | advertised | callable | `0x10737e14` |
| `CreateStereoPair` | advertised | callable | `0x10735f3c` |
| `EnterConfigMode` | advertised | callable | `0x1073611c` |
| `ExitConfigMode` | advertised | callable | `0x10736270` |
| `GetAutoplayLinkedZones` | advertised | callable | `0x10736c84` |
| `GetAutoplayRoomUUID` | advertised | callable | `0x10736750` |
| `GetAutoplayVolume` | advertised | callable | `0x107370ac` |
| `GetButtonLockState` | advertised | callable | `0x107377d4` |
| `GetButtonState` | advertised | callable | `0x1073799c` |
| `GetHouseholdID` | advertised | callable | `0x10737a20` |
| `GetLEDState` | advertised | callable | `0x10737b1c` |
| `GetUseAutoplayVolume` | advertised | callable | `0x10736df8` |
| `GetZoneAttributes` | advertised | callable | `0x10737d90` |
| `GetZoneInfo` | advertised | callable | `0x10737750` |
| `RemoveBondedZones` | advertised | callable | `0x107368d4` |
| `RemoveHTSatellite` | advertised | callable | `0x10737f3c` |
| `RoomDetectionStartChirping` | advertised | callable | `0x1073730c` |
| `RoomDetectionStopChirping` | advertised | callable | `0x10737220` |
| `SeparateStereoPair` | advertised | callable | `0x1073602c` |
| `SetAutoplayLinkedZones` | advertised | callable | `0x10736a04` |
| `SetAutoplayRoomUUID` | advertised | callable | `0x1073660c` |
| `SetAutoplayVolume` | advertised | callable | `0x10736f6c` |
| `SetButtonLockState` | advertised | callable | `0x10736360` |
| `SetLEDState` | advertised | callable | `0x10735d5c` |
| `SetUseAutoplayVolume` | advertised | callable | `0x10736b44` |
| `SetZoneAttributes` | advertised | callable | `0x10736450` |

## `GroupManagement` `/GroupManagement/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `AddMember` | advertised | callable | `0x10738654` |
| `RemoveMember` | advertised | callable | `0x10738460` |
| `ReportTrackBufferingResult` | advertised | callable | `0x107388a4` |
| `SetSourceAreaIds` | advertised | callable | `0x10738550` |

## `GroupRenderingControl` `/MediaRenderer/GroupRenderingControl/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `GetGroupMute` | advertised | callable | `0x10738e9c` |
| `GetGroupVolume` | advertised | callable | `0x107390c4` |
| `SetGroupMute` | advertised | callable | `0x10738fb0` |
| `SetGroupVolume` | advertised | callable | `0x107391d8` |
| `SetRelativeGroupVolume` | advertised | callable | `0x107392ec` |
| `SnapshotGroupVolume` | advertised | callable | `0x10738db0` |

## `HTControl` `/HTControl/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `CommitLearnedIRCodes` | advertised | callable | `0x10739968` |
| `GetIRRepeaterState` | advertised | callable | `0x10739d30` |
| `GetLEDFeedbackState` | advertised | callable | `0x10739c34` |
| `IdentifyIRRemote` | advertised | callable | `0x10241f24` |
| `IsRemoteConfigured` | advertised | callable | `0x10739b48` |
| `LearnIRCode` | advertised | callable | `0x10242008` |
| `SetIRRepeaterState` | advertised | callable | `0x10739878` |
| `SetLEDFeedbackState` | advertised | callable | `0x10739a58` |

## `MusicServices` `/MusicServices/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `GetSessionId` | advertised | callable | `0x1073a264` |
| `ListAvailableServices` | advertised | callable | `0x1073a424` |
| `UpdateAvailableServices` | advertised | callable | `0x1073a3b4` |

## `QPlay` `/QPlay/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `QPlayAuth` | advertised | callable | `0x1073a4f0` |

## `Queue` `/MediaRenderer/Queue/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `AddMultipleURIs` | advertised | callable | `0x10464f34` |
| `AddURI` | advertised | callable | `0x1046453c` |
| `AttachQueue` | advertised | callable | `0x104647b8` |
| `Backup` | advertised | callable | `0x10465660` |
| `Browse` | advertised | callable | `0x10464200` |
| `CreateQueue` | advertised | callable | `0x10464bd0` |
| `RemoveAllTracks` | advertised | callable | `0x10464908` |
| `RemoveTrackRange` | advertised | callable | `0x10464a44` |
| `ReorderTracks` | advertised | callable | `0x10464d68` |
| `ReplaceAllTracks` | advertised | callable | `0x10465090` |
| `SaveAsSonosPlaylist` | advertised | callable | `0x104643c0` |

## `RenderingControl` `/MediaRenderer/RenderingControl/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `GetBass` | advertised | callable | `0x1073ba88` |
| `GetEQ` | advertised | callable | `0x1073bcb0` |
| `GetHeadphoneConnected` | advertised | callable | `0x1073b0d8` |
| `GetLoudness` | advertised | callable | `0x1073ad64` |
| `GetMute` | advertised | callable | `0x1073ac24` |
| `GetOutputFixed` | advertised | callable | `0x1073afb8` |
| `GetRoomCalibrationStatus` | advertised | callable | `0x1073b1ec` |
| `GetSupportsOutputFixed` | advertised | callable | `0x1073aea4` |
| `GetTreble` | advertised | callable | `0x1073bb9c` |
| `GetVolume` | advertised | callable | `0x1073bdf0` |
| `GetVolumeDB` | advertised | callable | `0x1073b7e0` |
| `GetVolumeDBRange` | advertised | callable | `0x1073b920` |
| `RampToVolume` | advertised | callable | `0x1073c834` |
| `ResetBasicEQ` | advertised | callable | `0x1073bf30` |
| `ResetExtEQ` | advertised | callable | `0x1073a8dc` |
| `RestoreVolumePriorToRamp` | advertised | callable | `0x1073a9f4` |
| `SetBass` | advertised | callable | `0x1073c4cc` |
| `SetChannelMap` | advertised | callable | `0x1073ab0c` |
| `SetEQ` | advertised | callable | `0x1073c6f4` |
| `SetLoudness` | advertised | callable | `0x1073b474` |
| `SetMute` | advertised | callable | `0x1073b334` |
| `SetOutputFixed` | advertised | callable | `0x1073b5b4` |
| `SetRelativeVolume` | advertised | callable | `0x1073c224` |
| `SetRoomCalibrationStatus` | advertised | callable | `0x1073b6cc` |
| `SetTreble` | advertised | callable | `0x1073c5e0` |
| `SetVolume` | advertised | callable | `0x1073c0e4` |
| `SetVolumeDB` | advertised | callable | `0x1073c38c` |

## `SystemProperties` `/SystemProperties/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `AddAccountX` | advertised | callable | `0x10731f28` |
| `AddOAuthAccountX` | advertised | callable | `0x10732454` |
| `DoPostUpdateTasks` | advertised | callable | `0x10732e24` |
| `EditAccountMd` | advertised | callable | `0x10732310` |
| `EditAccountPasswordX` | advertised | callable | `0x107321cc` |
| `EnableRDM` | advertised | callable | `0x10732c80` |
| `GetRDM` | advertised | callable | `0x10732d6c` |
| `GetString` | advertised | callable | `0x107319b4` |
| `GetWebCode` | advertised | callable | `0x10731e04` |
| `RefreshAccountCredentialsX` | advertised | callable | `0x107327d4` |
| `Remove` | advertised | callable | `0x10731bf8` |
| `RemoveAccount` | advertised | callable | `0x107320b4` |
| `ReplaceAccountX` | advertised | callable | `0x107329ac` |
| `SetAccountNicknameX` | advertised | callable | `0x10731ce8` |
| `SetString` | advertised | callable | `0x10731adc` |

## `VirtualLineIn` `/MediaRenderer/VirtualLineIn/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `Next` | advertised | callable | `0x1073ce18` |
| `Pause` | advertised | callable | `0x1073cf04` |
| `Play` | advertised | callable | `0x1073d2dc` |
| `Previous` | advertised | callable | `0x1073cff0` |
| `SetVolume` | advertised | callable | `0x1073d0dc` |
| `StartTransmission` | advertised | callable | `0x1073d3f4` |
| `Stop` | advertised | callable | `0x1073d1f0` |
| `StopTransmission` | advertised | callable | `0x1073d544` |

## `ZoneGroupTopology` `/ZoneGroupTopology/Control` (advertised)

| Action | Visibility | Wire status | Handler |
|---|---|---|---|
| `BeginSoftwareUpdate` | advertised | callable | `0x10733140` |
| `CheckForUpdate` | advertised | callable | `0x1073331c` |
| `GetZoneGroupAttributes` | advertised | callable | `0x10733878` |
| `GetZoneGroupState` | advertised | callable | `0x10732ed8` |
| `RegisterMobileDevice` | advertised | callable | `0x10732ebc` |
| `ReportAlarmStartedRunning` | advertised | callable | `0x107337cc` |
| `ReportUnresponsiveDevice` | advertised | callable | `0x10733498` |
| `SubmitDiagnostics` | advertised | callable | `0x1073365c` |
