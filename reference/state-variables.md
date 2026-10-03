# State variables

State variables are the player's named properties: things like volume, mute, or the address of the current track. Every command either reads them (the Get* family) or writes them (the Set* family), and the event system watches them. When one changes, the player announces it to anything that subscribed. The table below is the full property list: what each variable is called, what type of value it holds, its allowed range or values where the spec pins them down, and which commands touch it. Think of it as the player's complete settings-and-state inventory.

::: details Technical details

Evented variables carry `<NAME val="..."/>` elements inside `LastChange` documents; `A_ARG_TYPE_*` variables are SCPD argument-type declarations, not device state.

:::

| Variable | Service | Type | Evented | Status |
|---|---|---|---|---|
| `AC.AlarmListVersion` | AlarmClock | ui4 | yes | `strong` |
| `AC.DateFormat` | AlarmClock | string | yes | `strong` |
| `AC.TimeFormat` | AlarmClock | string | yes | `strong` |
| `AC.TimeGeneration` | AlarmClock | ui4 | yes | `strong` |
| `AC.TimeServer` | AlarmClock | string | yes | `strong` |
| `AI.IRRepeaterState` | AudioIn | string | yes | `strong` |
| `AI.TOSLinkConnected` | AudioIn | boolean | yes | `strong` |
| `AVT.AVTransportURI` | AVTransport | string | yes | `confirmed` |
| `AVT.AVTransportURIMetaData` | AVTransport | string | yes | `confirmed` |
| `AVT.CurrentCrossfadeMode` | AVTransport | boolean | yes | `confirmed` |
| `AVT.CurrentMediaDuration` | AVTransport | string | yes | `confirmed` |
| `AVT.CurrentPlayMode` | AVTransport | string | yes | `confirmed` |
| `AVT.CurrentRecordQualityMode` | AVTransport | string | yes | `confirmed` |
| `AVT.CurrentSection` | AVTransport | ui4 | yes | `confirmed` |
| `AVT.CurrentTrack` | AVTransport | ui4 | yes | `confirmed` |
| `AVT.CurrentTrackDuration` | AVTransport | string | yes | `confirmed` |
| `AVT.CurrentTrackMetaData` | AVTransport | string | yes | `confirmed` |
| `AVT.CurrentTrackURI` | AVTransport | string | yes | `confirmed` |
| `AVT.CurrentTransportActions` | AVTransport | string | yes | `confirmed` |
| `AVT.NextAVTransportURI` | AVTransport | string | yes | `confirmed` |
| `AVT.NextAVTransportURIMetaData` | AVTransport | string | yes | `confirmed` |
| `AVT.NumberOfTracks` | AVTransport | ui4 | yes | `confirmed` |
| `AVT.PlaybackStorageMedium` | AVTransport | string | yes | `confirmed` |
| `AVT.PossiblePlaybackStorageMedia` | AVTransport | string | yes | `confirmed` |
| `AVT.PossibleRecordQualityModes` | AVTransport | string | yes | `confirmed` |
| `AVT.PossibleRecordStorageMedia` | AVTransport | string | yes | `confirmed` |
| `AVT.RecordMediumWriteStatus` | AVTransport | string | yes | `confirmed` |
| `AVT.RecordStorageMedium` | AVTransport | string | yes | `confirmed` |
| `AVT.TransportErrorDescription` | AVTransport | string | yes | `confirmed` |
| `AVT.TransportErrorHttpCode` | AVTransport | ui4 | yes | `confirmed` |
| `AVT.TransportErrorHttpHeaders` | AVTransport | string | yes | `confirmed` |
| `AVT.TransportErrorURI` | AVTransport | string | yes | `confirmed` |
| `AVT.TransportPlaySpeed` | AVTransport | string | yes | `confirmed` |
| `AVT.TransportState` | AVTransport | string | yes | `confirmed` |
| `AVT.TransportStatus` | AVTransport | string | yes | `confirmed` |
| `AVT.r:AlarmRunning` | AVTransport | boolean | yes | `confirmed` |
| `AVT.r:CurrentValidPlayModes` | AVTransport | string | yes | `confirmed` |
| `AVT.r:DirectControlAccountID` | AVTransport | string | yes | `confirmed` |
| `AVT.r:DirectControlClientID` | AVTransport | string | yes | `confirmed` |
| `AVT.r:DirectControlIsSuspended` | AVTransport | boolean | yes | `confirmed` |
| `AVT.r:EnqueuedTransportURI` | AVTransport | string | yes | `confirmed` |
| `AVT.r:EnqueuedTransportURIMetaData` | AVTransport | string | yes | `confirmed` |
| `AVT.r:NextTrackMetaData` | AVTransport | string | yes | `confirmed` |
| `AVT.r:NextTrackURI` | AVTransport | string | yes | `confirmed` |
| `AVT.r:RestartPending` | AVTransport | boolean | yes | `confirmed` |
| `AVT.r:SleepTimerGeneration` | AVTransport | ui4 | yes | `confirmed` |
| `AVT.r:SnoozeRunning` | AVTransport | boolean | yes | `confirmed` |
| `AVTransport.AVTransportURI` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.AVTransportURIMetaData` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.A_ARG_TYPE_AlarmIncludeLinkedZones` | AVTransport | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_AlarmState` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_AlarmVolume` | AVTransport | ui2 | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_ClearSource` | AVTransport | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_CurrentAVTransportURI` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_EnqueueAsNext` | AVTransport | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_GroupID` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_ISO8601Time` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_InstanceID` | AVTransport | ui4 | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_LIST_URI` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_LIST_URIMetaData` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_MemberID` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_MemberList` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_NumTracks` | AVTransport | ui4 | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_NumTracksChange` | AVTransport | i4 | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_ObjectID` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_PlayerID` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_Queue` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_RejoinGroup` | AVTransport | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_ResetVolumeAfter` | AVTransport | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_RestartSink` | AVTransport | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_ResumePlayback` | AVTransport | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_SavedQueueTitle` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_SeekMode` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_SeekTarget` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_SleepTimerState` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_SourceState` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_StreamRestartState` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_TrackList` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_TrackNumber` | AVTransport | ui4 | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_TransportSettings` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_URI` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_URIMetaData` | AVTransport | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_VLIState` | AVTransport | string | no | `confirmed` |
| `AVTransport.AbsoluteCounterPosition` | AVTransport | i4 | no | `confirmed` |
| `AVTransport.AbsoluteTimePosition` | AVTransport | string | no | `confirmed` |
| `AVTransport.AlarmIDRunning` | AVTransport | ui4 | no | `confirmed` |
| `AVTransport.AlarmLoggedStartTime` | AVTransport | string | no | `confirmed` |
| `AVTransport.AlarmRunning` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentCrossfadeMode` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentMediaDuration` | AVTransport | string | yes | `confirmed` |
| `AVTransport.CurrentPlayMode` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentRecordQualityMode` | AVTransport | string | yes | `confirmed` |
| `AVTransport.CurrentSection` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentTrack` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentTrackDuration` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentTrackMetaData` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentTrackURI` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentTransportActions` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentValidPlayModes` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.DirectControlAccountID` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.DirectControlClientID` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.DirectControlIsSuspended` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.EnqueuedTransportURI` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.EnqueuedTransportURIMetaData` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.LastChange` | AVTransport | string | yes | `confirmed` |
| `AVTransport.MuseSessions` | AVTransport | string | no | `confirmed` |
| `AVTransport.NextAVTransportURI` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.NextAVTransportURIMetaData` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.NextTrackMetaData` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.NextTrackURI` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.NumberOfTracks` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.PlaybackStorageMedium` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.PossiblePlaybackStorageMedia` | AVTransport | string | yes | `confirmed` |
| `AVTransport.PossibleRecordQualityModes` | AVTransport | string | yes | `confirmed` |
| `AVTransport.PossibleRecordStorageMedia` | AVTransport | string | yes | `confirmed` |
| `AVTransport.QueueUpdateID` | AVTransport | ui4 | no | `confirmed` |
| `AVTransport.RecordMediumWriteStatus` | AVTransport | string | yes | `confirmed` |
| `AVTransport.RecordStorageMedium` | AVTransport | string | yes | `confirmed` |
| `AVTransport.RelativeCounterPosition` | AVTransport | i4 | no | `confirmed` |
| `AVTransport.RelativeTimePosition` | AVTransport | string | no | `confirmed` |
| `AVTransport.RestartPending` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.SleepTimerGeneration` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.SnoozeRunning` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportErrorDescription` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportErrorHttpCode` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportErrorHttpHeaders` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportErrorURI` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportPlaySpeed` | AVTransport | string | yes | `confirmed` |
| `AVTransport.TransportState` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportStatus` | AVTransport | string (val= attribute) | yes | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmEnabled` | AlarmClock | boolean | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmID` | AlarmClock | ui4 | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmIncludeLinkedZones` | AlarmClock | boolean | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmList` | AlarmClock | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmPlayMode` | AlarmClock | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmProgramMetaData` | AlarmClock | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmProgramURI` | AlarmClock | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmRoomUUID` | AlarmClock | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmVolume` | AlarmClock | ui2 | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_ISO8601Time` | AlarmClock | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_Recurrence` | AlarmClock | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_TimeStamp` | AlarmClock | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_TimeZoneAutoAdjustDst` | AlarmClock | boolean | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_TimeZoneIndex` | AlarmClock | i4 | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_TimeZoneInformation` | AlarmClock | string | no | `confirmed` |
| `AlarmClock.AlarmListVersion` | AlarmClock | string | yes | `confirmed` |
| `AlarmClock.DailyIndexRefreshTime` | AlarmClock | string | yes | `confirmed` |
| `AlarmClock.DateFormat` | AlarmClock | string | yes | `confirmed` |
| `AlarmClock.TimeFormat` | AlarmClock | string | yes | `confirmed` |
| `AlarmClock.TimeGeneration` | AlarmClock | ui4 | yes | `confirmed` |
| `AlarmClock.TimeServer` | AlarmClock | string | yes | `confirmed` |
| `AlarmClock.TimeZone` | AlarmClock | string | yes | `confirmed` |
| `AudioIn.A_ARG_TYPE_MemberID` | AudioIn | string | no | `confirmed` |
| `AudioIn.A_ARG_TYPE_ObjectID` | AudioIn | string | no | `confirmed` |
| `AudioIn.A_ARG_TYPE_TransportSettings` | AudioIn | string | no | `confirmed` |
| `AudioIn.AudioInputName` | AudioIn | string | yes | `confirmed` |
| `AudioIn.Icon` | AudioIn | string | yes | `confirmed` |
| `AudioIn.LeftLineInLevel` | AudioIn | i4 | yes | `confirmed` |
| `AudioIn.LineInConnected` | AudioIn | boolean | yes | `confirmed` |
| `AudioIn.Playing` | AudioIn | boolean | yes | `confirmed` |
| `AudioIn.RightLineInLevel` | AudioIn | i4 | yes | `confirmed` |
| `CD.ContainerUpdateIDs` | ContentDirectory | string | yes | `strong` |
| `CD.FavoritesUpdateID` | ContentDirectory | ui4 | yes | `strong` |
| `CD.RadioFavoritesUpdateID` | ContentDirectory | ui4 | yes | `strong` |
| `CD.SavedQueuesUpdateID` | ContentDirectory | ui4 | yes | `strong` |
| `CD.ShareIndexInProgress` | ContentDirectory | string | yes | `strong` |
| `CD.ShareListUpdateID` | ContentDirectory | ui4 | yes | `strong` |
| `CM.CurrentConnectionIDs` | ConnectionManager | string | yes | `strong` |
| `ConnectionManager.A_ARG_TYPE_AVTransportID` | ConnectionManager | i4 | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_ConnectionID` | ConnectionManager | i4 | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_ConnectionManager` | ConnectionManager | string | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_ConnectionStatus` | ConnectionManager | string | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_Direction` | ConnectionManager | string | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_ProtocolInfo` | ConnectionManager | string | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_RcsID` | ConnectionManager | i4 | no | `confirmed` |
| `ConnectionManager.CurrentConnectionIDs` | ConnectionManager | string | yes | `confirmed` |
| `ConnectionManager.SinkProtocolInfo` | ConnectionManager | string | yes | `confirmed` |
| `ConnectionManager.SourceProtocolInfo` | ConnectionManager | string | yes | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_AlbumArtistDisplayOption` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_BrowseFlag` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_Count` | ContentDirectory | ui4 | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_Filter` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_Index` | ContentDirectory | ui4 | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_LastIndexChange` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_ObjectID` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_Prefix` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_Result` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_SearchCriteria` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_SortCriteria` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_SortOrder` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_TagValueList` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_UpdateID` | ContentDirectory | ui4 | no | `confirmed` |
| `ContentDirectory.Browseable` | ContentDirectory | boolean | yes | `confirmed` |
| `ContentDirectory.ContainerUpdateIDs` | ContentDirectory | string | yes | `confirmed` |
| `ContentDirectory.FavoritesUpdateID` | ContentDirectory | string | yes | `confirmed` |
| `ContentDirectory.RadioFavoritesUpdateID` | ContentDirectory | ui4 | yes | `confirmed` |
| `ContentDirectory.RadioLocationUpdateID` | ContentDirectory | ui4 | yes | `confirmed` |
| `ContentDirectory.RecentlyPlayedUpdateID` | ContentDirectory | string | yes | `confirmed` |
| `ContentDirectory.SavedQueuesUpdateID` | ContentDirectory | string | yes | `confirmed` |
| `ContentDirectory.SearchCapabilities` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.ShareIndexInProgress` | ContentDirectory | boolean | yes | `confirmed` |
| `ContentDirectory.ShareIndexLastError` | ContentDirectory | string | yes | `confirmed` |
| `ContentDirectory.ShareListUpdateID` | ContentDirectory | string | yes | `confirmed` |
| `ContentDirectory.SortCapabilities` | ContentDirectory | string | no | `confirmed` |
| `ContentDirectory.SystemUpdateID` | ContentDirectory | ui4 | yes | `confirmed` |
| `ContentDirectory.UserRadioUpdateID` | ContentDirectory | string | yes | `confirmed` |
| `DP.CurrentZoneName` | DeviceProperties | string | yes | `strong` |
| `DP.Invisible` | DeviceProperties | boolean | yes | `strong` |
| `DP.MicEnabled` | DeviceProperties | boolean | yes | `strong` |
| `DP.ResetVolumeAfter` | DeviceProperties | boolean | yes | `strong` |
| `DeviceProperties.A_ARG_TYPE_ButtonState` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_ConfigModeOptions` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_ConfigModeState` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpChannel` | DeviceProperties | ui2 | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpIfPlayingSwappableAudio` | DeviceProperties | boolean | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionDurationMilliseconds` | DeviceProperties | ui4 | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionPlayId` | DeviceProperties | ui4 | no | `confirmed` |
| `DeviceProperties.AirPlayEnabled` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.AlexaCBLSupported` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.AutoplayIncludeLinkedZones` | DeviceProperties | boolean | no | `confirmed` |
| `DeviceProperties.AutoplayRoomUUID` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.AutoplaySource` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.AutoplayUseVolume` | DeviceProperties | boolean | no | `confirmed` |
| `DeviceProperties.AutoplayVolume` | DeviceProperties | ui2 | no | `confirmed` |
| `DeviceProperties.AvailableRoomCalibration` | DeviceProperties | string | yes | `confirmed` |
| `DeviceProperties.BehindWifiExtender` | DeviceProperties | ui4 | yes | `confirmed` |
| `DeviceProperties.ButtonLockState` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.ChannelFreq` | DeviceProperties | ui4 | yes | `confirmed` |
| `DeviceProperties.ChannelMapSet` | DeviceProperties | string | yes | `confirmed` |
| `DeviceProperties.ConfigMode` | DeviceProperties | string | yes | `confirmed` |
| `DeviceProperties.Configuration` | DeviceProperties | string | yes | `confirmed` |
| `DeviceProperties.ConnectionType` | DeviceProperties | ui4 | yes | `confirmed` |
| `DeviceProperties.CopyrightInfo` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.DisplaySoftwareVersion` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.EthLink` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.ExtraInfo` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.Flags` | DeviceProperties | ui4 | no | `confirmed` |
| `DeviceProperties.HTAudioIn` | DeviceProperties | ui4 | no | `confirmed` |
| `DeviceProperties.HTBondedZoneCommitState` | DeviceProperties | ui4 | yes | `confirmed` |
| `DeviceProperties.HTSatChanMapSet` | DeviceProperties | string | yes | `confirmed` |
| `DeviceProperties.HardwareVersion` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.HasConfiguredSSID` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.HdmiCecAvailable` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.HouseholdID` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.IPAddress` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.Icon` | DeviceProperties | string | yes | `confirmed` |
| `DeviceProperties.Invisible` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.IsIdle` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.IsZoneBridge` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.KeepGrouped` | DeviceProperties | boolean | no | `confirmed` |
| `DeviceProperties.LEDState` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.LastChangedPlayState` | DeviceProperties | string | yes | `confirmed` |
| `DeviceProperties.MACAddress` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.MicEnabled` | DeviceProperties | ui4 | yes | `confirmed` |
| `DeviceProperties.MoreInfo` | DeviceProperties | string | yes | `confirmed` |
| `DeviceProperties.Orientation` | DeviceProperties | i4 | yes | `confirmed` |
| `DeviceProperties.RoomCalibrationState` | DeviceProperties | i4 | yes | `confirmed` |
| `DeviceProperties.SatRoomUUID` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.SecureRegState` | DeviceProperties | ui4 | yes | `confirmed` |
| `DeviceProperties.SerialNumber` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.SettingsReplicationState` | DeviceProperties | string | yes | `confirmed` |
| `DeviceProperties.SoftwareVersion` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.SupportsAudioClip` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.SupportsAudioIn` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.SvcActive` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.TVConfigurationError` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.TargetRoomName` | DeviceProperties | string | no | `confirmed` |
| `DeviceProperties.VoiceConfigState` | DeviceProperties | ui4 | yes | `confirmed` |
| `DeviceProperties.WifiEnabled` | DeviceProperties | boolean | yes | `confirmed` |
| `DeviceProperties.WirelessMode` | DeviceProperties | ui4 | yes | `confirmed` |
| `DeviceProperties.ZoneName` | DeviceProperties | string | yes | `confirmed` |
| `GM.DelegatedGroupCoordinatorID` | GroupManagement | string | yes | `strong` |
| `GM.LocalGroupUUID` | GroupManagement | string | yes | `strong` |
| `GM.VirtualLineInGroupID` | GroupManagement | string | yes | `strong` |
| `GRC.GroupMute` | GroupRenderingControl | boolean | yes | `strong` |
| `GRC.GroupVolume` | GroupRenderingControl | i2 | yes | `strong` |
| `GRC.GroupVolumeChangeable` | GroupRenderingControl | boolean | yes | `strong` |
| `GroupManagement.A_ARG_TYPE_AVTransportURI` | GroupManagement | string | no | `confirmed` |
| `GroupManagement.A_ARG_TYPE_BootSeq` | GroupManagement | ui4 | no | `confirmed` |
| `GroupManagement.A_ARG_TYPE_BufferingResultCode` | GroupManagement | i4 | no | `confirmed` |
| `GroupManagement.A_ARG_TYPE_MemberID` | GroupManagement | string | no | `confirmed` |
| `GroupManagement.A_ARG_TYPE_TransportSettings` | GroupManagement | string | no | `confirmed` |
| `GroupManagement.GroupCoordinatorIsLocal` | GroupManagement | boolean | yes | `confirmed` |
| `GroupManagement.LocalGroupUUID` | GroupManagement | string | yes | `confirmed` |
| `GroupManagement.ResetVolumeAfter` | GroupManagement | boolean | yes | `confirmed` |
| `GroupManagement.SourceAreaIds` | GroupManagement | string | no | `confirmed` |
| `GroupManagement.VirtualLineInGroupID` | GroupManagement | string | yes | `confirmed` |
| `GroupManagement.VolumeAVTransportURI` | GroupManagement | string | yes | `confirmed` |
| `GroupRenderingControl.A_ARG_TYPE_InstanceID` | GroupRenderingControl | ui4 | no | `confirmed` |
| `GroupRenderingControl.A_ARG_TYPE_VolumeAdjustment` | GroupRenderingControl | i4 | no | `confirmed` |
| `GroupRenderingControl.GroupMute` | GroupRenderingControl | boolean | yes | `confirmed` |
| `GroupRenderingControl.GroupVolume` | GroupRenderingControl | ui2 | yes | `confirmed` |
| `GroupRenderingControl.GroupVolumeChangeable` | GroupRenderingControl | boolean | yes | `confirmed` |
| `HT.LEDFeedbackState` | HTControl | string | yes | `strong` |
| `HT.RemoteConfigured` | HTControl | boolean | yes | `strong` |
| `HTControl.A_ARG_TYPE_IRCode` | HTControl | string | no | `confirmed` |
| `HTControl.A_ARG_TYPE_IRRemoteName` | HTControl | string | no | `confirmed` |
| `HTControl.A_ARG_TYPE_Timeout` | HTControl | ui4 | no | `confirmed` |
| `HTControl.IRRepeaterState` | HTControl | string | yes | `confirmed` |
| `HTControl.LEDFeedbackState` | HTControl | string | no | `confirmed` |
| `HTControl.RemoteConfigured` | HTControl | boolean | no | `confirmed` |
| `HTControl.TOSLinkConnected` | HTControl | boolean | yes | `confirmed` |
| `MS.ServiceListVersion` | MusicServices | ui4 | yes | `strong` |
| `MusicServices.A_ARG_TYPE_ServiceDescriptorList` | MusicServices | string | no | `confirmed` |
| `MusicServices.A_ARG_TYPE_ServiceTypeList` | MusicServices | string | no | `confirmed` |
| `MusicServices.ServiceId` | MusicServices | ui4 | no | `confirmed` |
| `MusicServices.ServiceListVersion` | MusicServices | string | yes | `confirmed` |
| `MusicServices.SessionId` | MusicServices | string | no | `confirmed` |
| `MusicServices.Username` | MusicServices | string | no | `confirmed` |
| `QPlay.A_ARG_TYPE_Code` | QPlay | string | no | `confirmed` |
| `QPlay.A_ARG_TYPE_DID` | QPlay | string | no | `confirmed` |
| `QPlay.A_ARG_TYPE_MID` | QPlay | string | no | `confirmed` |
| `QPlay.A_ARG_TYPE_Seed` | QPlay | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_Count` | Queue | ui4 | no | `confirmed` |
| `Queue.A_ARG_TYPE_EnqueueAsNext` | Queue | boolean | no | `confirmed` |
| `Queue.A_ARG_TYPE_Index` | Queue | ui4 | no | `confirmed` |
| `Queue.A_ARG_TYPE_LIST_URI` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_LIST_URI_AND_METADATA` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_NumTracks` | Queue | ui4 | no | `confirmed` |
| `Queue.A_ARG_TYPE_ObjectID` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_QueueID` | Queue | ui4 | no | `confirmed` |
| `Queue.A_ARG_TYPE_QueueOwnerContext` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_QueueOwnerID` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_QueuePolicy` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_Result` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_SavedQueueTitle` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_TrackNumber` | Queue | ui4 | no | `confirmed` |
| `Queue.A_ARG_TYPE_TrackNumbersCSV` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_URI` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_URIMetaData` | Queue | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_UpdateID` | Queue | ui4 | no | `confirmed` |
| `Queue.Curated` | Queue | string/bool (val=) | yes | `confirmed` |
| `Queue.LastChange` | Queue | string | yes | `confirmed` |
| `Queue.QueueID` | Queue | string max 20 chars (val="%.20s") | yes | `confirmed` |
| `Queue.QueueOwnerID` | Queue | %.20s-ish string (val="%s") | yes | `confirmed` |
| `Queue.UpdateID` | Queue | u32 (val="%u") | yes | `confirmed` |
| `RCS.AudioDelay` | RenderingControl | ui4 | yes | `confirmed` |
| `RCS.AudioDelayLeftRear` | RenderingControl | ui4 | yes | `confirmed` |
| `RCS.AudioDelayRightRear` | RenderingControl | ui4 | yes | `confirmed` |
| `RCS.Bass` | RenderingControl | i2 | yes | `confirmed` |
| `RCS.DialogLevel` | RenderingControl | i2 | yes | `confirmed` |
| `RCS.HeightChannelLevel` | RenderingControl | i2 | yes | `confirmed` |
| `RCS.Loudness` | RenderingControl | boolean | yes | `confirmed` |
| `RCS.MusicSurroundLevel` | RenderingControl | i2 | yes | `confirmed` |
| `RCS.Mute` | RenderingControl | boolean | yes | `confirmed` |
| `RCS.NightMode` | RenderingControl | boolean | yes | `confirmed` |
| `RCS.OutputFixed` | RenderingControl | boolean | yes | `confirmed` |
| `RCS.PresetNameList` | RenderingControl | string | yes | `confirmed` |
| `RCS.SonarCalibrationAvailable` | RenderingControl | boolean | yes | `confirmed` |
| `RCS.SonarEnabled` | RenderingControl | boolean | yes | `confirmed` |
| `RCS.SpeakerSize` | RenderingControl | ui4 | yes | `confirmed` |
| `RCS.SpeechEnhanceEnabled` | RenderingControl | boolean | yes | `confirmed` |
| `RCS.SubCrossover` | RenderingControl | i2 | yes | `confirmed` |
| `RCS.SubEnabled` | RenderingControl | boolean | yes | `confirmed` |
| `RCS.SubGain` | RenderingControl | i2 | yes | `confirmed` |
| `RCS.SubPolarity` | RenderingControl | i2 | yes | `confirmed` |
| `RCS.SupportsMaxDialogLevel` | RenderingControl | boolean | yes | `confirmed` |
| `RCS.SurroundEnabled` | RenderingControl | boolean | yes | `confirmed` |
| `RCS.SurroundLevel` | RenderingControl | i2 | yes | `confirmed` |
| `RCS.SurroundMode` | RenderingControl | ui4 | yes | `confirmed` |
| `RCS.Treble` | RenderingControl | i2 | yes | `confirmed` |
| `RCS.Volume` | RenderingControl | ui2 | yes | `confirmed` |
| `RenderingControl.A_ARG_TYPE_Channel` | RenderingControl | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_ChannelMap` | RenderingControl | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_EQType` | RenderingControl | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_InstanceID` | RenderingControl | ui4 | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_LeftVolume` | RenderingControl | ui2 | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_MuteChannel` | RenderingControl | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_ProgramURI` | RenderingControl | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_RampTimeSeconds` | RenderingControl | ui4 | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_RampType` | RenderingControl | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_ResetVolumeAfter` | RenderingControl | boolean | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_RightVolume` | RenderingControl | ui2 | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_VolumeAdjustment` | RenderingControl | i4 | no | `confirmed` |
| `RenderingControl.AudioDelay` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.AudioDelayLeftRear` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.AudioDelayRightRear` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.Bass` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.DialogLevel` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.EQValue` | RenderingControl | i2 | no | `confirmed` |
| `RenderingControl.HeadphoneConnected` | RenderingControl | boolean | no | `confirmed` |
| `RenderingControl.HeightChannelLevel` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.LastChange` | RenderingControl | string | yes | `confirmed` |
| `RenderingControl.Loudness` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.MusicSurroundLevel` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.Mute` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.NightMode` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.OutputFixed` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.PresetNameList` | RenderingControl | string | yes | `confirmed` |
| `RenderingControl.RoomCalibrationAvailable` | RenderingControl | boolean | no | `confirmed` |
| `RenderingControl.RoomCalibrationBondedZoneInfo` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.RoomCalibrationCalibrationMode` | RenderingControl | string | no | `confirmed` |
| `RenderingControl.RoomCalibrationCoefficients` | RenderingControl | string | no | `confirmed` |
| `RenderingControl.RoomCalibrationEnabled` | RenderingControl | boolean | no | `confirmed` |
| `RenderingControl.RoomCalibrationID` | RenderingControl | string | no | `confirmed` |
| `RenderingControl.SonarCalibrationAvailable` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SonarEnabled` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SpeakerSize` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SpeechEnhanceEnabled` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SubCrossover` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SubEnabled` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SubGain` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SubPolarity` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SupportsMaxDialogLevel` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SupportsOutputFixed` | RenderingControl | boolean | no | `confirmed` |
| `RenderingControl.SurroundEnabled` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SurroundLevel` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SurroundMode` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.Treble` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.Volume` | RenderingControl | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.VolumeDB` | RenderingControl | i2 | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountCredential` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountID` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountMd` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountNickname` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountPassword` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountTier` | SystemProperties | ui4 | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountType` | SystemProperties | ui4 | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountUDN` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountUID` | SystemProperties | ui4 | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AuthorizationCode` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_IsExpired` | SystemProperties | boolean | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_OAuthDeviceID` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_RDMEnabled` | SystemProperties | boolean | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_RedirectURI` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_StubsCreated` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_UserIdHashCode` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_VariableName` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_VariableStringValue` | SystemProperties | string | no | `confirmed` |
| `SystemProperties.CustomerID` | SystemProperties | string | yes | `confirmed` |
| `SystemProperties.ThirdPartyHash` | SystemProperties | string | yes | `confirmed` |
| `SystemProperties.UpdateID` | SystemProperties | ui4 | yes | `confirmed` |
| `SystemProperties.UpdateIDX` | SystemProperties | ui4 | yes | `confirmed` |
| `SystemProperties.VoiceUpdateID` | SystemProperties | ui4 | yes | `confirmed` |
| `VirtualLineIn.AVTransportURIMetaData` | VirtualLineIn | string | no | `confirmed` |
| `VirtualLineIn.A_ARG_TYPE_CurrentTransportSettings` | VirtualLineIn | string | no | `confirmed` |
| `VirtualLineIn.A_ARG_TYPE_InstanceID` | VirtualLineIn | ui4 | no | `confirmed` |
| `VirtualLineIn.A_ARG_TYPE_PlayerID` | VirtualLineIn | string | no | `confirmed` |
| `VirtualLineIn.A_ARG_TYPE_Speed` | VirtualLineIn | string | no | `confirmed` |
| `VirtualLineIn.A_ARG_TYPE_Volume` | VirtualLineIn | ui2 | no | `confirmed` |
| `VirtualLineIn.CurrentTrackMetaData` | VirtualLineIn | string | yes | `confirmed` |
| `VirtualLineIn.CurrentTransportActions` | VirtualLineIn | string | no | `confirmed` |
| `VirtualLineIn.EnqueuedTransportURIMetaData` | VirtualLineIn | string | no | `confirmed` |
| `ZGT.ZoneGroupState` | ZoneGroupTopology | xml-doc | yes | `strong` |
| `ZoneGroupTopology.A_ARG_TYPE_CachedOnly` | ZoneGroupTopology | boolean | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_IncludeControllers` | ZoneGroupTopology | boolean | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_MemberID` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceName` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceUDN` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_MobileIPAndPort` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_Origin` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UnresponsiveDeviceActionType` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateExtraOptions` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateFlags` | ZoneGroupTopology | ui4 | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateItem` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateType` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateURL` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_Version` | ZoneGroupTopology | string | no | `confirmed` |
| `ZoneGroupTopology.AlarmRunSequence` | ZoneGroupTopology | string | yes | `confirmed` |
| `ZoneGroupTopology.AreasUpdateID` | ZoneGroupTopology | string | yes | `confirmed` |
| `ZoneGroupTopology.AvailableSoftwareUpdate` | ZoneGroupTopology | string | yes | `confirmed` |
| `ZoneGroupTopology.DiagnosticID` | ZoneGroupTopology | ui4 | no | `confirmed` |
| `ZoneGroupTopology.MuseHouseholdId` | ZoneGroupTopology | string | yes | `confirmed` |
| `ZoneGroupTopology.NetsettingsUpdateID` | ZoneGroupTopology | string | yes | `confirmed` |
| `ZoneGroupTopology.SourceAreasUpdateID` | ZoneGroupTopology | string | yes | `confirmed` |
| `ZoneGroupTopology.ThirdPartyMediaServersX` | ZoneGroupTopology | string | yes | `confirmed` |
| `ZoneGroupTopology.ZoneGroupID` | ZoneGroupTopology | string | yes | `confirmed` |
| `ZoneGroupTopology.ZoneGroupName` | ZoneGroupTopology | string | yes | `confirmed` |
| `ZoneGroupTopology.ZoneGroupState` | ZoneGroupTopology | string | yes | `confirmed` |
| `ZoneGroupTopology.ZonePlayerUUIDsInGroup` | ZoneGroupTopology | string | yes | `confirmed` |
| `alarm_status_schema` | AlarmClock |  | ? | `strong` |
| `avt_lastchange` | AVTransport |  | ? | `strong` |
| `device_props_extra_vars` | DeviceProperties |  | ? | `strong` |
| `device_props_update_ids` | DeviceProperties |  | ? | `strong` |
| `ht_input_session` |  |  | ? | `strong` |
| `netsettings_schema` |  |  | ? | `strong` |
| `playstatemanager_schema` |  |  | ? | `strong` |
| `renderingcontrol_status_schema` | RenderingControl |  | ? | `strong` |
| `replicated_netsettings_schema` |  |  | ? | `strong` |
| `savedqueues_rsq_schema` | Queue |  | ? | `strong` |
| `services_xml_schema` | MusicServices |  | ? | `strong` |
| `shares_schema` | ContentDirectory |  | ? | `strong` |
| `sounddevice_status_schema` |  |  | ? | `strong` |
| `update_info_schema` |  |  | ? | `strong` |
| `userradio_schema` |  |  | ? | `strong` |
| `vli_state_snapshot` | VirtualLineIn |  | ? | `strong` |
| `zone_group_state_schema` | ZoneGroupTopology |  | ? | `strong` |
| `zoneplayers_status_schema` |  |  | ? | `strong` |
| `zp_support_info` |  |  | ? | `strong` |
| `zpinfo_schema` |  |  | ? | `strong` |
| `zps_page` |  |  | ? | `strong` |

### `AC.AlarmListVersion`

A version counter for the alarm list that ticks up every time an alarm is created, edited, or deleted. Apps watch this single number to know their cached alarm list went stale instead of re-fetching the whole list constantly.

::: details Technical details

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AC.DateFormat`

The speaker's preferred date display format. It is the setting behind how dates render in anything that asks the player rather than guessing at your region's convention.

::: details Technical details

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeFormat`

The speaker's preferred clock format: 12-hour versus 24-hour. It is read by anything displaying times the way the speaker was configured to.

::: details Technical details

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeGeneration`

A counter that bumps whenever the household clock settings change, covering timezone switches, manual time sets, and server changes. It lets other devices notice 'the clock just moved' and react.

::: details Technical details

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeServer`

The address of the network time source the speaker syncs against. It reports where the household clock comes from so apps and diagnostics can see the configured time server.

::: details Technical details

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AI.IRRepeaterState`

Whether the infrared repeater is currently on. It mirrors the home-theater IR setting so a change shows up as an event, though it is dead on this build along with the rest of the AudioIn surface.

::: details Technical details

AudioIn evented variable; emitted by f_10243170 e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AI.TOSLinkConnected`

Whether something is plugged into the optical input, which is the line-in detection flag. It is part of the AudioIn surface that is a reject-everything stub on this firmware.

::: details Technical details

AudioIn evented variable; emitted by f_10243170 e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AVT.AVTransportURI`

The address of what's loaded in the player right now: a queue reference, a radio stream URL, a line-in selector, or a service item. When this value changes, the speaker is pointing at something different, so it is effectively the answer to 'what is this room set to play'.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.AVTransportURIMetaData`

The description of what's loaded: title, artwork, and other display metadata for whatever AVTransportURI points at. It is packed in the track-metadata format that apps render the 'now playing' header from.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentCrossfadeMode`

Whether crossfade is on. It is the blend-between-tracks setting, reported so the app's toggle stays in sync with the actual player state.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentMediaDuration`

The total duration of the loaded media. It is pinned at 'not implemented' in this build because Sonos reports durations per-track through CurrentTrackDuration rather than for the whole program.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentPlayMode`

The current play mode: normal, repeat-all, repeat-one, shuffle, or shuffle-and-repeat. It is the variable behind which shuffle and repeat icons light up in the app.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentRecordQualityMode`

The recording quality setting. It is a leftover field from the standard spec, permanently 'not implemented' on a speaker that doesn't record.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentSection`

Which 'section' of the current program is active. It is used by sources with internal structure like chapters or segments, and for ordinary tracks it effectively means the current position in the list.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrack`

The index of the track currently playing, meaning which entry of the queue is live right now. It advances as the queue progresses, and combined with NumberOfTracks it produces 'track 4 of 23'.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackDuration`

How long the current track is. This is the value the app's progress bar divides elapsed time by to draw its fill position.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackMetaData`

The metadata for the playing track: title, artist, album, and artwork, packed in the track-metadata XML format. Everything the app's now-playing display shows about the song comes from this field.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackURI`

The address of the playing track itself, meaning the specific item's URI. It is distinct from the source-level AVTransportURI: the queue might be the source while this names the exact song inside it.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTransportActions`

The list of transport commands currently legal, such as 'Play,Stop,Next', computed live from the source and state. Apps read it to decide which buttons to enable and which to grey out.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NextAVTransportURI`

The address of the next track, announced in advance. It is the gapless-playback lookahead: what has been lined up to play when the current track ends, so the player can pre-buffer it.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NextAVTransportURIMetaData`

The metadata for the announced next track, meaning the title and artwork the app can show in 'up next' before the track actually starts.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NumberOfTracks`

How many tracks are in the current program. For queue playback this is the queue length, and for sources that behave like lists it reports whatever count the source provides.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PlaybackStorageMedium`

Which 'medium' the current playback comes from: queue, network stream, line-in, and so on. It is the broad category label for the current source.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossiblePlaybackStorageMedia`

The list of source types this player can play: the hardware's declared talents, fixed per model, describing which media categories it will accept at all.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NONE, NETWORK

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossibleRecordQualityModes`

The recording-quality options the player claims. The answer is none, since a speaker doesn't record, and it is standard-spec boilerplate kept for protocol completeness.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossibleRecordStorageMedia`

The recording media the player claims. The answer is none, and it is another spec field kept for completeness on a device that doesn't record.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.RecordMediumWriteStatus`

Write-protect status of the 'record medium'. It is boilerplate for a player that doesn't record, present because the standard requires the field.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.RecordStorageMedium`

Which medium would be recorded to. It is fixed at none on a playback-only device, included as spec boilerplate.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorDescription`

A text description of the last transport failure: the human-readable message attached when playback errors, describing what went wrong.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorHttpCode`

When a stream fails, this holds the HTTP status from the failed fetch, for example a 404 from a dead stream URL. It lets apps tell 'the file is gone' apart from 'the network died'.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorHttpHeaders`

The response headers captured from a failed stream fetch. They are extra diagnostics attached to transport errors, useful for debugging why a stream died.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorURI`

The address that failed when a transport error occurred. It identifies which stream or item the error belongs to, so the failure can be traced back to its source.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportPlaySpeed`

The playback speed, normally '1'. It is the standard's field for variable-speed playback, which this firmware doesn't implement.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportState`

The headline playback state: PLAYING, PAUSED_PLAYBACK, STOPPED, or TRANSITIONING. It is the single most-watched variable on the player, because every 'is it playing?' answer in every app comes from this one field.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportStatus`

The health of the transport: OK or an error indicator. It is paired with the state so 'stopped because you asked' can be told apart from 'stopped because the stream died'.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:AlarmRunning`

Whether an alarm is currently ringing. It is set while an alarm fires so the system (and the snooze and stop logic) knows an alarm session is live. The 'r:' prefix marks it as a Sonos extension beyond the standard variable set.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:CurrentValidPlayModes`

Which play modes are currently legal: the shuffle and repeat choices you may pick right now, computed from the source. Repeat-one makes no sense on a live stream, so it is omitted then.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlAccountID`

Which account owns an active direct-control session. It is the identity of the external service feeding the player, set while one is in control.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlClientID`

Which client owns an active direct-control session, meaning the specific app or instance behind an external feed. It is set while a direct-control session owns the player.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlIsSuspended`

Whether the direct-control session is suspended: paused in a way that keeps the session alive while the external source isn't actively streaming.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:EnqueuedTransportURI`

The address of the source queued up to take over, meaning the next program's URI. It names what will become current when the player switches source, which is distinct from the next track inside the current program.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:EnqueuedTransportURIMetaData`

The description of whatever EnqueuedTransportURI points at. It lets apps show what's coming next at the program level rather than the track level.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:NextTrackMetaData`

The metadata for the next track in the Sonos extension namespace. It parallels the standard NextAVTransportURIMetaData under the r: prefix.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:NextTrackURI`

The next track's address in the Sonos extension namespace. It is the same lookahead concept as NextAVTransportURI, exposed under the r: prefix.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:RestartPending`

Whether the player has flagged that a restart is pending. It is a marker used around updates and recovery so clients know the session may bounce.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:SleepTimerGeneration`

A counter that ticks whenever the sleep timer is set, changed, or cancelled. It lets apps tell a fresh timer apart from an old one without comparing durations.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:SnoozeRunning`

Whether an alarm snooze is currently counting down. It is set between hitting snooze and the alarm re-ringing, which is how the system knows a snooze is in progress.

::: details Technical details

AVTransport evented variable (r: prefix = rincon/Sonos extension).

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVTransport.AVTransportURI`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.AVTransportURIMetaData`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.A_ARG_TYPE_AlarmIncludeLinkedZones`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RunAlarm`, `StartAutoplay`

### `AVTransport.A_ARG_TYPE_AlarmState`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_AlarmVolume`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RunAlarm`, `StartAutoplay`

### `AVTransport.A_ARG_TYPE_ClearSource`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `DelegateGroupCoordinationTo`

### `AVTransport.A_ARG_TYPE_CurrentAVTransportURI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ChangeCoordinator`, `ChangeTransportSettings`

### `AVTransport.A_ARG_TYPE_EnqueueAsNext`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`

### `AVTransport.A_ARG_TYPE_GroupID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeCoordinatorOfStandaloneGroup`, `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`, `GetRunningAlarmProperties`

### `AVTransport.A_ARG_TYPE_ISO8601Time`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ConfigureSleepTimer`, `GetRemainingSleepTimerDuration`, `RunAlarm`, `SnoozeAlarm`

### `AVTransport.A_ARG_TYPE_InstanceID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `BackupQueue`, `BecomeCoordinatorOfStandaloneGroup`, `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`, `ChangeCoordinator`, `ChangeTransportSettings`, `ConfigureSleepTimer`, `CreateSavedQueue`, `DelegateGroupCoordinationTo`, `EndDirectControlSession`, `GetCrossfadeMode`, `GetCurrentTransportActions`, `GetDeviceCapabilities`, `GetMediaInfo`, `GetPositionInfo`, `GetRemainingSleepTimerDuration`, `GetRunningAlarmProperties`, `GetTransportInfo`, `GetTransportSettings`, `Next`, `NotifyDeletedURI`, `Pause`, `Play`, `Previous`, `RemoveAllTracksFromQueue`, `RemoveTrackFromQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`, `ReorderTracksInSavedQueue`, `RunAlarm`, `SaveQueue`, `Seek`, `SetAVTransportURI`, `SetCrossfadeMode`, `SetNextAVTransportURI`, `SetPlayMode`, `SnoozeAlarm`, `StartAutoplay`, `Stop`

### `AVTransport.A_ARG_TYPE_LIST_URI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIsToQueue`

### `AVTransport.A_ARG_TYPE_LIST_URIMetaData`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIsToQueue`

### `AVTransport.A_ARG_TYPE_MemberID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`, `ChangeCoordinator`, `DelegateGroupCoordinationTo`

### `AVTransport.A_ARG_TYPE_MemberList`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_NumTracks`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`, `ReorderTracksInSavedQueue`

### `AVTransport.A_ARG_TYPE_NumTracksChange`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ReorderTracksInSavedQueue`

### `AVTransport.A_ARG_TYPE_ObjectID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddURIToSavedQueue`, `CreateSavedQueue`, `RemoveTrackFromQueue`, `ReorderTracksInSavedQueue`, `SaveQueue`

### `AVTransport.A_ARG_TYPE_PlayerID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeCoordinatorOfStandaloneGroup`

### `AVTransport.A_ARG_TYPE_Queue`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_RejoinGroup`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `DelegateGroupCoordinationTo`

### `AVTransport.A_ARG_TYPE_ResetVolumeAfter`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartAutoplay`

### `AVTransport.A_ARG_TYPE_RestartSink`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ChangeCoordinator`

### `AVTransport.A_ARG_TYPE_ResumePlayback`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_SavedQueueTitle`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateSavedQueue`, `SaveQueue`

### `AVTransport.A_ARG_TYPE_SeekMode`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Seek`

### `AVTransport.A_ARG_TYPE_SeekTarget`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Seek`

### `AVTransport.A_ARG_TYPE_SleepTimerState`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_SourceState`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_StreamRestartState`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_TrackList`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ReorderTracksInSavedQueue`

### `AVTransport.A_ARG_TYPE_TrackNumber`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`

### `AVTransport.A_ARG_TYPE_TransportSettings`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeGroupCoordinator`, `ChangeCoordinator`, `ChangeTransportSettings`

### `AVTransport.A_ARG_TYPE_URI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`

### `AVTransport.A_ARG_TYPE_URIMetaData`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`

### `AVTransport.A_ARG_TYPE_VLIState`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BecomeGroupCoordinator`

### `AVTransport.AbsoluteCounterPosition`

::: details Technical details

non-evented AVTransport state variable: read via action out-args, not pushed

:::

- related actions: `GetPositionInfo`

### `AVTransport.AbsoluteTimePosition`

::: details Technical details

non-evented AVTransport state variable: read via action out-args, not pushed

:::

- related actions: `GetPositionInfo`

### `AVTransport.AlarmIDRunning`

::: details Technical details

non-evented AVTransport state variable: read via action out-args, not pushed

:::

- related actions: `GetRunningAlarmProperties`, `RunAlarm`

### `AVTransport.AlarmLoggedStartTime`

::: details Technical details

non-evented AVTransport state variable: read via action out-args, not pushed

:::

- related actions: `GetRunningAlarmProperties`, `RunAlarm`

### `AVTransport.AlarmRunning`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.CurrentCrossfadeMode`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.CurrentMediaDuration`

::: details Technical details

constant evented field

:::

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.CurrentPlayMode`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.CurrentRecordQualityMode`

::: details Technical details

constant evented field

:::

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.CurrentSection`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.CurrentTrack`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.CurrentTrackDuration`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.CurrentTrackMetaData`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.CurrentTrackURI`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.CurrentTransportActions`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.CurrentValidPlayModes`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.DirectControlAccountID`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.DirectControlClientID`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.DirectControlIsSuspended`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.EnqueuedTransportURI`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.EnqueuedTransportURIMetaData`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.LastChange`

::: details Technical details

evented state variable: appears in AVTransport LastChange/GENA event notifications

:::


### `AVTransport.MuseSessions`

::: details Technical details

non-evented AVTransport state variable: read via action out-args, not pushed

:::


### `AVTransport.NextAVTransportURI`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.NextAVTransportURIMetaData`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.NextTrackMetaData`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.NextTrackURI`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.NumberOfTracks`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.PlaybackStorageMedium`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.PossiblePlaybackStorageMedia`

::: details Technical details

constant evented field

:::

- accepted values: `NONE, NETWORK`
- constant in this build

### `AVTransport.PossibleRecordQualityModes`

::: details Technical details

constant evented field

:::

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.PossibleRecordStorageMedia`

::: details Technical details

constant evented field

:::

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.QueueUpdateID`

::: details Technical details

non-evented AVTransport state variable: read via action out-args, not pushed

:::

- related actions: `AddMultipleURIsToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`, `RemoveTrackFromQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`, `ReorderTracksInSavedQueue`

### `AVTransport.RecordMediumWriteStatus`

::: details Technical details

constant evented field

:::

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.RecordStorageMedium`

::: details Technical details

constant evented field

:::

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.RelativeCounterPosition`

::: details Technical details

non-evented AVTransport state variable: read via action out-args, not pushed

:::

- related actions: `GetPositionInfo`

### `AVTransport.RelativeTimePosition`

::: details Technical details

non-evented AVTransport state variable: read via action out-args, not pushed

:::

- related actions: `GetPositionInfo`

### `AVTransport.RestartPending`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.SleepTimerGeneration`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.SnoozeRunning`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.TransportErrorDescription`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.TransportErrorHttpCode`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.TransportErrorHttpHeaders`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.TransportErrorURI`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.TransportPlaySpeed`

::: details Technical details

constant evented field

:::

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.TransportState`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AVTransport.TransportStatus`

::: details Technical details

evented transport state variable (r:-prefixed rincon extension where applicable)

:::


### `AlarmClock.A_ARG_TYPE_AlarmEnabled`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `DestroyAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmIncludeLinkedZones`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmList`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ListAlarms`

### `AlarmClock.A_ARG_TYPE_AlarmPlayMode`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmProgramMetaData`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmProgramURI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmRoomUUID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmVolume`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_ISO8601Time`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `GetHouseholdTimeAtStamp`, `GetTimeNow`, `SetTimeNow`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_Recurrence`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_TimeStamp`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetHouseholdTimeAtStamp`

### `AlarmClock.A_ARG_TYPE_TimeZoneAutoAdjustDst`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetTimeZone`, `GetTimeZoneAndRule`, `SetTimeZone`

### `AlarmClock.A_ARG_TYPE_TimeZoneIndex`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetTimeZone`, `GetTimeZoneAndRule`, `GetTimeZoneRule`, `SetTimeZone`

### `AlarmClock.A_ARG_TYPE_TimeZoneInformation`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SetTimeNow`

### `AlarmClock.AlarmListVersion`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `ListAlarms`

### `AlarmClock.DailyIndexRefreshTime`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetDailyIndexRefreshTime`, `SetDailyIndexRefreshTime`

### `AlarmClock.DateFormat`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetFormat`, `SetFormat`

### `AlarmClock.TimeFormat`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetFormat`, `SetFormat`

### `AlarmClock.TimeGeneration`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetTimeNow`

### `AlarmClock.TimeServer`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetTimeServer`, `SetTimeServer`

### `AlarmClock.TimeZone`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetTimeNow`, `GetTimeZoneAndRule`, `GetTimeZoneRule`

### `AudioIn.A_ARG_TYPE_MemberID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartTransmissionToGroup`, `StopTransmissionToGroup`

### `AudioIn.A_ARG_TYPE_ObjectID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartTransmissionToGroup`

### `AudioIn.A_ARG_TYPE_TransportSettings`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartTransmissionToGroup`

### `AudioIn.AudioInputName`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::

- related actions: `GetAudioInputAttributes`, `SetAudioInputAttributes`

### `AudioIn.Icon`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::

- related actions: `GetAudioInputAttributes`, `SetAudioInputAttributes`

### `AudioIn.LeftLineInLevel`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::

- related actions: `GetLineInLevel`, `SetLineInLevel`

### `AudioIn.LineInConnected`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::


### `AudioIn.Playing`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::


### `AudioIn.RightLineInLevel`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::

- related actions: `GetLineInLevel`, `SetLineInLevel`

### `CD.ContainerUpdateIDs`

The change-markers for library containers: a list of which folders and playlists changed since the last check. It lets an app refresh only the parts of its browse view that moved instead of re-reading the whole library.

::: details Technical details

ContentDirectory evented variable in f_103035c4

:::


### `CD.FavoritesUpdateID`

A version counter for the favorites list. It bumps whenever your saved stations, playlists, or items change, which tells apps their favorites view is stale.

::: details Technical details

ContentDirectory evented variable in f_10303de4

:::


### `CD.RadioFavoritesUpdateID`

A version counter for saved radio favorites. It bumps when your radio presets change, so the stations list refreshes only when it needs to.

::: details Technical details

ContentDirectory evented variable in f_10303de4

:::


### `CD.SavedQueuesUpdateID`

A version counter for Sonos playlists. It bumps when any saved queue is created, edited, or deleted, making it the 'your playlists changed' signal.

::: details Technical details

ContentDirectory evented variable in f_10303de4

:::


### `CD.ShareIndexInProgress`

Whether a music-library rescan is running right now. It is the flag behind the 'updating music index' spinner, on while a rescan walks your folders.

::: details Technical details

ContentDirectory evented variable in f_103035c4

:::


### `CD.ShareListUpdateID`

A version counter for the music-shares list. It bumps when folders are added to or removed from the library, so apps re-fetch the share list only when it changed.

::: details Technical details

ContentDirectory evented variable in f_10303de4

:::


### `CM.CurrentConnectionIDs`

The list of live connections against the player, which is the evented form of the connection-list command. It fires whenever a control session opens or closes.

::: details Technical details

ConnectionManager evented variable in f_10735918

:::


### `ConnectionManager.A_ARG_TYPE_AVTransportID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionManager`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionStatus`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_Direction`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ProtocolInfo`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_RcsID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.CurrentConnectionIDs`

::: details Technical details

evented state variable: appears in ConnectionManager LastChange/GENA event notifications

:::

- related actions: `GetCurrentConnectionIDs`

### `ConnectionManager.SinkProtocolInfo`

::: details Technical details

evented state variable: appears in ConnectionManager LastChange/GENA event notifications

:::

- related actions: `GetProtocolInfo`

### `ConnectionManager.SourceProtocolInfo`

::: details Technical details

evented state variable: appears in ConnectionManager LastChange/GENA event notifications

:::

- related actions: `GetProtocolInfo`

### `ContentDirectory.A_ARG_TYPE_AlbumArtistDisplayOption`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetAlbumArtistDisplayOption`, `RefreshShareIndex`

### `ContentDirectory.A_ARG_TYPE_BrowseFlag`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_Count`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`, `GetAllPrefixLocations`

### `ContentDirectory.A_ARG_TYPE_Filter`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_Index`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`, `FindPrefix`

### `ContentDirectory.A_ARG_TYPE_LastIndexChange`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetLastIndexChange`

### `ContentDirectory.A_ARG_TYPE_ObjectID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`, `CreateObject`, `DestroyObject`, `FindPrefix`, `GetAllPrefixLocations`, `UpdateObject`

### `ContentDirectory.A_ARG_TYPE_Prefix`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `FindPrefix`

### `ContentDirectory.A_ARG_TYPE_Result`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`, `CreateObject`, `GetAllPrefixLocations`

### `ContentDirectory.A_ARG_TYPE_SearchCriteria`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::


### `ContentDirectory.A_ARG_TYPE_SortCriteria`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_SortOrder`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RequestResort`

### `ContentDirectory.A_ARG_TYPE_TagValueList`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `UpdateObject`

### `ContentDirectory.A_ARG_TYPE_UpdateID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`, `FindPrefix`, `GetAllPrefixLocations`

### `ContentDirectory.Browseable`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::

- related actions: `GetBrowseable`, `SetBrowseable`

### `ContentDirectory.ContainerUpdateIDs`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.FavoritesUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.RadioFavoritesUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.RadioLocationUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.RecentlyPlayedUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.SavedQueuesUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.SearchCapabilities`

::: details Technical details

non-evented ContentDirectory state variable: read via action out-args, not pushed

:::

- related actions: `GetSearchCapabilities`

### `ContentDirectory.ShareIndexInProgress`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::

- related actions: `GetShareIndexInProgress`

### `ContentDirectory.ShareIndexLastError`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.ShareListUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.SortCapabilities`

::: details Technical details

non-evented ContentDirectory state variable: read via action out-args, not pushed

:::

- related actions: `GetSortCapabilities`

### `ContentDirectory.SystemUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::

- related actions: `GetSystemUpdateID`

### `ContentDirectory.UserRadioUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `DP.CurrentZoneName`

This speaker's room name, the label you gave it in the app such as 'Kitchen'. It fires when the room gets renamed, so every display updates.

::: details Technical details

DeviceProperties evented variable (ZoneNameChangedEvent)

:::


### `DP.Invisible`

Whether the speaker is hidden. This 'invisible' flag removes the player from normal room display, and it is used for satellites and bonded members that shouldn't appear as separate rooms.

::: details Technical details

DeviceProperties evented variable (DeviceInfo attr literal)

:::


### `DP.MicEnabled`

Whether the speaker's microphone is enabled. It is the mic-on flag for voice-capable products, kept in this service's spec for parity even though this older hardware has no mic.

::: details Technical details

DeviceProperties evented variable (DeviceInfo attr literal)

:::


### `DP.ResetVolumeAfter`

Whether the speaker resets its volume after a triggered session. It is the flag used by alarm and autoplay so a wake-up volume doesn't become the permanent level.

::: details Technical details

DeviceProperties evented variable in f_102fc6f4

:::


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

### `GM.DelegatedGroupCoordinatorID`

Which member group leadership was delegated to. It is set during a coordinator hand-off so the topology knows who is taking over the group.

::: details Technical details

GroupManagement evented variable (event-pool literal)

:::


### `GM.LocalGroupUUID`

The identifier of the group this speaker currently belongs to. It is its group membership expressed in one value, and it changes on every group and ungroup.

::: details Technical details

GroupManagement evented variable (event-pool literal)

:::


### `GM.VirtualLineInGroupID`

The group associated with a virtual line-in session. It is set while an external feed session exists, tying the session to the group it serves.

::: details Technical details

GroupManagement evented variable (setVirtualLineInGroupIDLocked worker)

:::


### `GRC.GroupMute`

The group's mute state. It is the evented flag every controller follows for the group mute button, so when it changes anywhere, every app sees it flip.

::: details Technical details

GroupRenderingControl evented variable (SetGroupMute rc-log literal)

:::


### `GRC.GroupVolume`

The group's aggregate volume, which is the number behind the group slider. The coordinator re-derives it as member levels change.

::: details Technical details

GroupRenderingControl evented variable (SetGroupVolume rc-log literal)

:::


### `GRC.GroupVolumeChangeable`

Whether the group volume can currently be changed. In some configurations the group level is locked or derived, and this flag tells the app the slider should be disabled.

::: details Technical details

GroupRenderingControl evented variable (GroupVolumeChangedEvent pool)

:::


### `GroupManagement.A_ARG_TYPE_AVTransportURI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMember`

### `GroupManagement.A_ARG_TYPE_BootSeq`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMember`

### `GroupManagement.A_ARG_TYPE_BufferingResultCode`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ReportTrackBufferingResult`

### `GroupManagement.A_ARG_TYPE_MemberID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMember`, `RemoveMember`, `ReportTrackBufferingResult`

### `GroupManagement.A_ARG_TYPE_TransportSettings`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMember`

### `GroupManagement.GroupCoordinatorIsLocal`

::: details Technical details

evented state variable: appears in GroupManagement LastChange/GENA event notifications

:::


### `GroupManagement.LocalGroupUUID`

::: details Technical details

evented state variable: appears in GroupManagement LastChange/GENA event notifications

:::

- related actions: `AddMember`

### `GroupManagement.ResetVolumeAfter`

::: details Technical details

evented state variable: appears in GroupManagement LastChange/GENA event notifications

:::

- related actions: `AddMember`

### `GroupManagement.SourceAreaIds`

::: details Technical details

non-evented GroupManagement state variable: read via action out-args, not pushed

:::

- related actions: `SetSourceAreaIds`

### `GroupManagement.VirtualLineInGroupID`

::: details Technical details

evented state variable: appears in GroupManagement LastChange/GENA event notifications

:::


### `GroupManagement.VolumeAVTransportURI`

::: details Technical details

evented state variable: appears in GroupManagement LastChange/GENA event notifications

:::

- related actions: `AddMember`

### `GroupRenderingControl.A_ARG_TYPE_InstanceID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetGroupMute`, `GetGroupVolume`, `SetGroupMute`, `SetGroupVolume`, `SetRelativeGroupVolume`, `SnapshotGroupVolume`

### `GroupRenderingControl.A_ARG_TYPE_VolumeAdjustment`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SetRelativeGroupVolume`

### `GroupRenderingControl.GroupMute`

::: details Technical details

evented state variable: appears in GroupRenderingControl LastChange/GENA event notifications

:::

- related actions: `GetGroupMute`, `SetGroupMute`

### `GroupRenderingControl.GroupVolume`

::: details Technical details

evented state variable: appears in GroupRenderingControl LastChange/GENA event notifications

:::

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `GetGroupVolume`, `SetGroupVolume`, `SetRelativeGroupVolume`

### `GroupRenderingControl.GroupVolumeChangeable`

::: details Technical details

evented state variable: appears in GroupRenderingControl LastChange/GENA event notifications

:::


### `HT.LEDFeedbackState`

Whether the remote-received LED flash is on. It is the home-theater feedback setting, evented so settings screens stay truthful about the device state.

::: details Technical details

HTControl evented variable in f_10739c34

:::


### `HT.RemoteConfigured`

Whether the speaker has a configured infrared remote. It is set once remote-learning is done, and it is the flag apps check before offering the setup wizard.

::: details Technical details

HTControl evented variable in f_10782194

:::


### `HTControl.A_ARG_TYPE_IRCode`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `LearnIRCode`

### `HTControl.A_ARG_TYPE_IRRemoteName`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CommitLearnedIRCodes`

### `HTControl.A_ARG_TYPE_Timeout`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- range: `minimum` = 0; `maximum` = 60000
- related actions: `IdentifyIRRemote`, `LearnIRCode`

### `HTControl.IRRepeaterState`

::: details Technical details

evented state variable: appears in HTControl LastChange/GENA event notifications

:::

- related actions: `GetIRRepeaterState`, `SetIRRepeaterState`

### `HTControl.LEDFeedbackState`

::: details Technical details

non-evented HTControl state variable: read via action out-args, not pushed

:::

- related actions: `GetLEDFeedbackState`, `SetLEDFeedbackState`

### `HTControl.RemoteConfigured`

::: details Technical details

non-evented HTControl state variable: read via action out-args, not pushed

:::

- related actions: `IsRemoteConfigured`

### `HTControl.TOSLinkConnected`

::: details Technical details

evented state variable: appears in HTControl LastChange/GENA event notifications

:::


### `MS.ServiceListVersion`

A version counter for the music-service catalog. It bumps when the available-services list changes, so apps re-pull the catalog only when it moved.

::: details Technical details

MusicServices evented variable; emitted by f_100c7084 e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `MusicServices.A_ARG_TYPE_ServiceDescriptorList`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ListAvailableServices`

### `MusicServices.A_ARG_TYPE_ServiceTypeList`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ListAvailableServices`

### `MusicServices.ServiceId`

::: details Technical details

non-evented MusicServices state variable: read via action out-args, not pushed

:::

- related actions: `GetSessionId`

### `MusicServices.ServiceListVersion`

::: details Technical details

evented state variable: appears in MusicServices LastChange/GENA event notifications

:::

- related actions: `ListAvailableServices`

### `MusicServices.SessionId`

::: details Technical details

non-evented MusicServices state variable: read via action out-args, not pushed

:::

- related actions: `GetSessionId`

### `MusicServices.Username`

::: details Technical details

non-evented MusicServices state variable: read via action out-args, not pushed

:::

- related actions: `GetSessionId`

### `QPlay.A_ARG_TYPE_Code`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `QPlayAuth`

### `QPlay.A_ARG_TYPE_DID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `QPlayAuth`

### `QPlay.A_ARG_TYPE_MID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `QPlayAuth`

### `QPlay.A_ARG_TYPE_Seed`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `QPlayAuth`

### `Queue.A_ARG_TYPE_Count`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `Queue.A_ARG_TYPE_EnqueueAsNext`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`

### `Queue.A_ARG_TYPE_Index`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `Queue.A_ARG_TYPE_LIST_URI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::


### `Queue.A_ARG_TYPE_LIST_URI_AND_METADATA`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_NumTracks`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_ObjectID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_QueueID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `AttachQueue`, `Browse`, `CreateQueue`, `RemoveAllTracks`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`, `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_QueueOwnerContext`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AttachQueue`, `CreateQueue`

### `Queue.A_ARG_TYPE_QueueOwnerID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AttachQueue`, `CreateQueue`

### `Queue.A_ARG_TYPE_QueuePolicy`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateQueue`

### `Queue.A_ARG_TYPE_Result`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `Queue.A_ARG_TYPE_SavedQueueTitle`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_TrackNumber`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_TrackNumbersCSV`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_URI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_URIMetaData`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_UpdateID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `Browse`, `RemoveAllTracks`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.Curated`

Whether a queue is 'curated', meaning marked as managed by some system component rather than a raw user queue.

::: details Technical details

curated-queue flag

:::


### `Queue.LastChange`

::: details Technical details

evented state variable: appears in Queue LastChange/GENA event notifications

:::


### `Queue.QueueID`

The identifier of the queue being described, naming which managed queue an event or answer refers to.

::: details Technical details

queue identifier assigned at AttachQueue/CreateQueue

:::


### `Queue.QueueOwnerID`

Which component owns a queue: the entity (an internal module or a session) holding edit rights over it.

::: details Technical details

queue owner UDN

:::


### `Queue.UpdateID`

A queue's version stamp. It bumps on every edit, and apps send it back to prove they're editing the version they last saw, which prevents lost updates.

::: details Technical details

queue content update id

:::


### `RCS.AudioDelay`

The lip-sync delay for the main output: how much audio delay is applied so sound lines up with the TV picture. It exists because video processing adds latency the audio must wait out.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.AudioDelayLeftRear`

Lip-sync delay for the left rear channel. It is the surround-specific version of the audio delay, letting the left rear be timed independently.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.AudioDelayRightRear`

Lip-sync delay for the right rear channel, the companion to the left-rear delay. It gives the right rear its own lip-sync trim.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Bass`

The bass level. It is the equalizer's bass setting, evented so the app's EQ panel tracks changes made anywhere in the system.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.DialogLevel`

The dialogue-boost amount: how much speech-enhancement lift is applied on products that offer it. It is a per-model tone control for making voices easier to hear.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.HeightChannelLevel`

The level of height or ceiling channels. It is a setting for surround products with upward-firing speakers, present here only for spec parity on this older unit.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Loudness`

The loudness toggle. Loudness is Sonos's fullness boost for quiet listening, and it is evented alongside the rest of the EQ state.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.MusicSurroundLevel`

How much music playback goes to the surround speakers. It is the 'ambient versus full' music-surround level in a home-theater setup.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Mute`

The mute flag per channel, the most basic evented variable on this service. It fires every time mute flips, whether the change came from an app or the physical button.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.NightMode`

Whether night mode is on. Night mode is the dynamic-range compressor that softens loud effects for late-night TV, reported here as a home-theater toggle.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.OutputFixed`

Whether output is fixed-level. It is the flag that locks the speaker at line level for feeding an external amplifier.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.PresetNameList`

The list of named EQ and volume presets available. It is the preset vocabulary some products expose for one-tap sound modes.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SonarCalibrationAvailable`

Whether sonar or room calibration can run on this device. It is a capability flag telling apps whether to offer the tuning feature.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SonarEnabled`

Whether sonar calibration is currently enabled, which is the tuning system's on/off state after a completed calibration.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SpeakerSize`

The speaker-size classification: the large/small designation the audio pipeline uses for bass handling in home-theater configuration.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SpeechEnhanceEnabled`

Whether speech enhancement is on. It is the dialogue-clarity feature on theater products, evented so the app's toggle follows the real device state.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubCrossover`

The subwoofer crossover frequency: where bass hands off from the soundbar to the bonded sub. It is one of the home-theater tuning values.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubEnabled`

Whether the bonded subwoofer is enabled. It is the variable behind the app switch for 'use the sub', toggling the sub's participation in the theater rig.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubGain`

The subwoofer gain, meaning the sub's level trim relative to the rest of the rig. In plain terms, it controls how hot the bass runs.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubPolarity`

The subwoofer polarity: the phase setting (normal or inverted) that keeps the sub's bass in step with the bar's drivers.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SupportsMaxDialogLevel`

Whether this device supports the maximum dialogue-level setting. It is a capability flag that gates the strongest speech-boost option.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundEnabled`

Whether surround speakers are active in the rig. It is the rear-channel enable flag inside a bonded theater setup, toggling the rears' participation on or off.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundLevel`

The surround speakers' level trim, controlling how loud the rear speakers play relative to the soundbar.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundMode`

The surround mode for music playback: the 'ambient' versus 'full' setting that decides how much music goes to the rear speakers.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Treble`

The treble level. It is the equalizer's treble setting, evented alongside bass so every view reflects the new value as soon as it changes anywhere.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Volume`

The volume per channel, which is the most-watched variable on this service. Every slider move, button press, or remote command lands here.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RenderingControl.A_ARG_TYPE_Channel`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetLoudness`, `GetVolume`, `GetVolumeDB`, `GetVolumeDBRange`, `RampToVolume`, `RestoreVolumePriorToRamp`, `SetLoudness`, `SetRelativeVolume`, `SetVolume`, `SetVolumeDB`

### `RenderingControl.A_ARG_TYPE_ChannelMap`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SetChannelMap`

### `RenderingControl.A_ARG_TYPE_EQType`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetEQ`, `ResetExtEQ`, `SetEQ`

### `RenderingControl.A_ARG_TYPE_InstanceID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetBass`, `GetEQ`, `GetHeadphoneConnected`, `GetLoudness`, `GetMute`, `GetOutputFixed`, `GetRoomCalibrationStatus`, `GetSupportsOutputFixed`, `GetTreble`, `GetVolume`, `GetVolumeDB`, `GetVolumeDBRange`, `RampToVolume`, `ResetBasicEQ`, `ResetExtEQ`, `RestoreVolumePriorToRamp`, `SetBass`, `SetChannelMap`, `SetEQ`, `SetLoudness`, `SetMute`, `SetOutputFixed`, `SetRelativeVolume`, `SetRoomCalibrationStatus`, `SetTreble`, `SetVolume`, `SetVolumeDB`

### `RenderingControl.A_ARG_TYPE_LeftVolume`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `ResetBasicEQ`

### `RenderingControl.A_ARG_TYPE_MuteChannel`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetMute`, `SetMute`

### `RenderingControl.A_ARG_TYPE_ProgramURI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RampTimeSeconds`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RampType`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_ResetVolumeAfter`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RightVolume`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `ResetBasicEQ`

### `RenderingControl.A_ARG_TYPE_VolumeAdjustment`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SetRelativeVolume`

### `RenderingControl.AudioDelay`

::: details Technical details

lip-sync audio delay

:::


### `RenderingControl.AudioDelayLeftRear`

::: details Technical details

left-rear delay

:::


### `RenderingControl.AudioDelayRightRear`

::: details Technical details

right-rear delay

:::


### `RenderingControl.Bass`

::: details Technical details

bass EQ level

:::


### `RenderingControl.DialogLevel`

::: details Technical details

dialog enhancement level

:::


### `RenderingControl.EQValue`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetEQ`, `SetEQ`

### `RenderingControl.HeadphoneConnected`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetHeadphoneConnected`

### `RenderingControl.HeightChannelLevel`

::: details Technical details

height/Atmos channel output level

:::


### `RenderingControl.LastChange`

::: details Technical details

evented state variable: appears in RenderingControl LastChange/GENA event notifications

:::


### `RenderingControl.Loudness`

::: details Technical details

loudness compensation state (Master)

:::


### `RenderingControl.MusicSurroundLevel`

::: details Technical details

surround level applied to music sources

:::


### `RenderingControl.Mute`

::: details Technical details

per-channel mute state

:::


### `RenderingControl.NightMode`

::: details Technical details

night-mode compression state

:::


### `RenderingControl.OutputFixed`

::: details Technical details

fixed line-out level enabled

:::


### `RenderingControl.PresetNameList`

::: details Technical details

list of available EQ preset names

:::

- accepted values: `FactoryDefaults`
- constant value in this build

### `RenderingControl.RoomCalibrationAvailable`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetRoomCalibrationStatus`

### `RenderingControl.RoomCalibrationBondedZoneInfo`

::: details Technical details

bonded-zone calibration info

:::


### `RenderingControl.RoomCalibrationCalibrationMode`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::


### `RenderingControl.RoomCalibrationCoefficients`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::


### `RenderingControl.RoomCalibrationEnabled`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetRoomCalibrationStatus`, `SetRoomCalibrationStatus`

### `RenderingControl.RoomCalibrationID`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::


### `RenderingControl.SonarCalibrationAvailable`

::: details Technical details

whether Sonar/Trueplay calibration data is available for this zone

:::


### `RenderingControl.SonarEnabled`

::: details Technical details

Trueplay/Sonar enabled

:::


### `RenderingControl.SpeakerSize`

::: details Technical details

speaker size class

:::


### `RenderingControl.SpeechEnhanceEnabled`

::: details Technical details

speech enhancement state

:::


### `RenderingControl.SubCrossover`

::: details Technical details

subwoofer crossover freq

:::


### `RenderingControl.SubEnabled`

::: details Technical details

whether the bonded subwoofer is enabled

:::


### `RenderingControl.SubGain`

::: details Technical details

subwoofer output gain level

:::


### `RenderingControl.SubPolarity`

::: details Technical details

subwoofer polarity phase setting

:::


### `RenderingControl.SupportsMaxDialogLevel`

::: details Technical details

whether the device supports the maximum dialog level

:::


### `RenderingControl.SupportsOutputFixed`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetSupportsOutputFixed`

### `RenderingControl.SurroundEnabled`

::: details Technical details

whether surround channels are enabled

:::


### `RenderingControl.SurroundLevel`

::: details Technical details

surround channel level

:::


### `RenderingControl.SurroundMode`

::: details Technical details

surround processing mode

:::


### `RenderingControl.Treble`

::: details Technical details

treble EQ level

:::


### `RenderingControl.Volume`

::: details Technical details

per-channel volume (Master/LF/RF elements)

:::


### `RenderingControl.VolumeDB`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetVolumeDB`, `GetVolumeDBRange`, `SetVolumeDB`

### `SystemProperties.A_ARG_TYPE_AccountCredential`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddOAuthAccountX`, `RefreshAccountCredentialsX`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_AccountID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddAccountX`, `EditAccountMd`, `EditAccountPasswordX`, `ProvisionCredentialedTrialAccountX`, `RemoveAccount`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_AccountMd`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `EditAccountMd`

### `SystemProperties.A_ARG_TYPE_AccountNickname`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddOAuthAccountX`, `SetAccountNicknameX`

### `SystemProperties.A_ARG_TYPE_AccountPassword`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddAccountX`, `EditAccountPasswordX`, `ProvisionCredentialedTrialAccountX`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_AccountTier`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_AccountType`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddAccountX`, `AddOAuthAccountX`, `EditAccountMd`, `EditAccountPasswordX`, `GetWebCode`, `ProvisionCredentialedTrialAccountX`, `RefreshAccountCredentialsX`, `RemoveAccount`

### `SystemProperties.A_ARG_TYPE_AccountUDN`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddAccountX`, `AddOAuthAccountX`, `ProvisionCredentialedTrialAccountX`, `ReplaceAccountX`, `SetAccountNicknameX`

### `SystemProperties.A_ARG_TYPE_AccountUID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RefreshAccountCredentialsX`

### `SystemProperties.A_ARG_TYPE_AuthorizationCode`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_IsExpired`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ProvisionCredentialedTrialAccountX`

### `SystemProperties.A_ARG_TYPE_OAuthDeviceID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddOAuthAccountX`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_RDMEnabled`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `EnableRDM`, `GetRDM`

### `SystemProperties.A_ARG_TYPE_RedirectURI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_StubsCreated`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::


### `SystemProperties.A_ARG_TYPE_UserIdHashCode`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_VariableName`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetString`, `Remove`, `SetString`

### `SystemProperties.A_ARG_TYPE_VariableStringValue`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetString`, `GetWebCode`, `SetString`

### `SystemProperties.CustomerID`

::: details Technical details

evented state variable: appears in SystemProperties LastChange/GENA event notifications

:::


### `SystemProperties.ThirdPartyHash`

::: details Technical details

evented state variable: appears in SystemProperties LastChange/GENA event notifications

:::


### `SystemProperties.UpdateID`

::: details Technical details

evented state variable: appears in SystemProperties LastChange/GENA event notifications

:::


### `SystemProperties.UpdateIDX`

::: details Technical details

evented state variable: appears in SystemProperties LastChange/GENA event notifications

:::


### `SystemProperties.VoiceUpdateID`

::: details Technical details

evented state variable: appears in SystemProperties LastChange/GENA event notifications

:::


### `VirtualLineIn.AVTransportURIMetaData`

::: details Technical details

non-evented VirtualLineIn state variable: read via action out-args, not pushed

:::


### `VirtualLineIn.A_ARG_TYPE_CurrentTransportSettings`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartTransmission`

### `VirtualLineIn.A_ARG_TYPE_InstanceID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Next`, `Pause`, `Play`, `Previous`, `SetVolume`, `StartTransmission`, `Stop`, `StopTransmission`

### `VirtualLineIn.A_ARG_TYPE_PlayerID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartTransmission`, `StopTransmission`

### `VirtualLineIn.A_ARG_TYPE_Speed`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Play`

### `VirtualLineIn.A_ARG_TYPE_Volume`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SetVolume`

### `VirtualLineIn.CurrentTrackMetaData`

::: details Technical details

evented state variable: appears in VirtualLineIn LastChange/GENA event notifications

:::


### `VirtualLineIn.CurrentTransportActions`

::: details Technical details

non-evented VirtualLineIn state variable: read via action out-args, not pushed

:::


### `VirtualLineIn.EnqueuedTransportURIMetaData`

::: details Technical details

non-evented VirtualLineIn state variable: read via action out-args, not pushed

:::


### `ZGT.ZoneGroupState`

The entire household map as one variable: every player, its room name, its group, and each group's leader, packed into a single document. It is the heartbeat of multi-room awareness, because it changes and announces every time the system's shape changes.

::: details Technical details

ZGT evented state doc: full <ZoneGroupState>+<ZoneGroups>+<MediaServers> XML pushed via f_1074d9b4 emitter (serializer f_10743328, MediaServers section f_10129888); not LastChange attribute-form

:::

- form: `direct <e:property><ZoneGroupState> XML`

### `ZoneGroupTopology.A_ARG_TYPE_CachedOnly`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_IncludeControllers`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.A_ARG_TYPE_MemberID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ReportUnresponsiveDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceName`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceUDN`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileIPAndPort`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_Origin`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.A_ARG_TYPE_UnresponsiveDeviceActionType`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ReportUnresponsiveDevice`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateExtraOptions`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateFlags`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateItem`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateType`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateURL`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_Version`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.AlarmRunSequence`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.AreasUpdateID`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.AvailableSoftwareUpdate`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.DiagnosticID`

::: details Technical details

non-evented ZoneGroupTopology state variable: read via action out-args, not pushed

:::

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.MuseHouseholdId`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.NetsettingsUpdateID`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.SourceAreasUpdateID`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.ThirdPartyMediaServersX`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.ZoneGroupID`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.ZoneGroupName`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.ZoneGroupState`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::

- related actions: `GetZoneGroupState`

### `ZoneGroupTopology.ZonePlayerUUIDsInGroup`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::

- related actions: `GetZoneGroupAttributes`

### `alarm_status_schema`

The field list for the alarm page on the player's built-in diagnostics website: which alarm details the player exposes when you or support tools visit its status pages, covering what's scheduled, what's ringing, and the bookkeeping around each.

::: details Technical details

/status/alarm emitted XML

:::


### `avt_lastchange`

The field list for the transport service's bundled change reports: everything packed into the 'what just changed in playback' message, covering state, track, position, mode, and source. One event carries all of this at once, which is why an app updates its whole now-playing screen from a single notification.

::: details Technical details

AVTransport LastChange evented fields

:::


### `device_props_extra_vars`

Additional device-property fields the settings service carries beyond the standard set: the extra bits of speaker configuration reported alongside the usual name, LED, and button state.

::: details Technical details

more state vars

:::


### `device_props_update_ids`

The set of change-counters the device-properties service keeps. These version numbers tick when different aspects of the speaker's config change, so interested parties can tell what moved without comparing every field.

::: details Technical details

update counters

:::


### `ht_input_session`

The telemetry fields captured for a home-theater input session: the bookkeeping the soundbar keeps about an active TV or optical input session, covering source, timing, and session state.

::: details Technical details

HT input-session telemetry fields

:::


### `netsettings_schema`

The layout of the player's replicated network-settings store: the on-disk document holding WiFi credentials and network configuration that all devices in the household share. This is where your WiFi password actually lives inside the system: encrypted per-household and replicated across players so any of them can join the network.

::: details Technical details

netsettings.json replicated network+PSK store

:::


### `playstatemanager_schema`

The fields of the play-state manager page on the diagnostics site. It is the component's own view of who's playing what where, exposed for debugging group playback issues.

::: details Technical details

/status page

:::


### `renderingcontrol_status_schema`

The fields on the diagnostics page for the volume and tone service. It is the player's internal view of channel volumes, mutes, EQ values, and flags, exposed for support and debugging.

::: details Technical details

/status/renderingcontrol emitted XML

:::


### `replicated_netsettings_schema`

The layout of the replicated network-settings document exchanged between players. It is the shared network config (including WiFi details) every household member keeps in sync, so any player can stand up the same network configuration.

::: details Technical details

netsettings replicated XML

:::


### `savedqueues_rsq_schema`

The file format of the saved-queues store on disk, meaning how Sonos playlists are actually persisted on the speaker. It is the record structure that survives reboots, written by the queue-backup commands.

::: details Technical details

savedqueues.rsq persistence

:::


### `services_xml_schema`

The layout of the replicated services list: the document describing which music services exist on the household that all players share, so every speaker sees the same service catalog.

::: details Technical details

replicated services list XML

:::


### `shares_schema`

The layout of the replicated share registry: the document listing your music-library folders that all household players keep a copy of, so every speaker can index and play from the same shares.

::: details Technical details

replicated share registry XML

:::


### `sounddevice_status_schema`

The fields of the SoundDevice diagnostics page, which is per-zone audio bookkeeping: each player's volume, ducking state, and output details as the player reports them internally.

::: details Technical details

SoundDevice page (per-zone volume/ducking)

:::


### `update_info_schema`

The fields of the update-info diagnostics page: what the player reports about its firmware status, covering current version, what updates are pending or downloading, and update history.

::: details Technical details

UpdateInfo page

:::


### `userradio_schema`

The layout of the user-radio favorites file: the document storing your saved radio stations, plus the delta-file format used to apply incremental changes without rewriting the whole list.

::: details Technical details

userradio.xml (+.d.xml delta) replicated favorites

:::


### `vli_state_snapshot`

The snapshot recorded when a virtual line-in session changes state: the fields captured at transitions so the session can be handed off or resumed, covering source, coordinator, and transport settings at that moment.

::: details Technical details

VLI handoff snapshot recorded at state transitions

:::


### `zone_group_state_schema`

The layout of the household-map document, which is the same ZoneGroupState the topology service emits: every player, room, group, and coordinator, structured so any device can parse the whole system's shape.

::: details Technical details

evented ZoneGroupState XML emitted by topology_base

:::


### `zoneplayers_status_schema`

The fields of the ZonePlayers diagnostics page: the player's internal census of every speaker it knows about, including IDs, rooms, versions, and addresses, exposed for debugging.

::: details Technical details

/status ZonePlayers page

:::


### `zp_support_info`

The layout of the support-information bundle: the structured data gathered when you submit diagnostics, covering versions, hardware details, state, and configuration, packaged so Sonos support can read it.

::: details Technical details

ZPSupportInfo schema

:::


### `zpinfo_schema`

The layout of the player's self-description documents: the fields a speaker publishes about itself, covering identity, device info, and play-mode capabilities, used by the rest of the household to recognize it.

::: details Technical details

ZPInfo + DeviceInfo + Playmode

:::


### `zps_page`

The fields of the household update-status page: the diagnostics view showing each player's update state during a rollout, covering who's updated, who's downloading, and who's pending or failed.

::: details Technical details

household update status page fields

:::

