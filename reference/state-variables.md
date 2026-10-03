# State variables

State variables are the player's named properties: things like volume, mute, or the address of the current track. Every command either reads them (the Get* family) or writes them (the Set* family), and the event system watches them. When one changes, the player announces it to anything that subscribed. The table below is the full property list: what each variable is called, what type of value it holds, its allowed range or values where the spec pins them down, and which commands touch it. Think of it as the player's complete settings-and-state inventory.

<details markdown="1"><summary><b>Technical details</b></summary>

Evented variables carry `<NAME val="..."/>` elements inside `LastChange` documents; `A_ARG_TYPE_*` variables are SCPD argument-type declarations, not device state.

</details>

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

<details markdown="1"><summary><b>Technical details</b></summary>

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AC.DateFormat`

The speaker's preferred date display format. It is the setting behind how dates render in anything that asks the player rather than guessing at your region's convention.

<details markdown="1"><summary><b>Technical details</b></summary>

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeFormat`

The speaker's preferred clock format: 12-hour versus 24-hour. It is read by anything displaying times the way the speaker was configured to.

<details markdown="1"><summary><b>Technical details</b></summary>

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeGeneration`

A counter that bumps whenever the household clock settings change, covering timezone switches, manual time sets, and server changes. It lets other devices notice 'the clock just moved' and react.

<details markdown="1"><summary><b>Technical details</b></summary>

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeServer`

The address of the network time source the speaker syncs against. It reports where the household clock comes from so apps and diagnostics can see the configured time server.

<details markdown="1"><summary><b>Technical details</b></summary>

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AI.IRRepeaterState`

Whether the infrared repeater is currently on. It mirrors the home-theater IR setting so a change shows up as an event, though it is dead on this build along with the rest of the AudioIn surface.

<details markdown="1"><summary><b>Technical details</b></summary>

AudioIn evented variable; emitted by f_10243170 e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AI.TOSLinkConnected`

Whether something is plugged into the optical input, which is the line-in detection flag. It is part of the AudioIn surface that is a reject-everything stub on this firmware.

<details markdown="1"><summary><b>Technical details</b></summary>

AudioIn evented variable; emitted by f_10243170 e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AVT.AVTransportURI`

The address of what's loaded in the player right now: a queue reference, a radio stream URL, a line-in selector, or a service item. When this value changes, the speaker is pointing at something different, so it is effectively the answer to 'what is this room set to play'.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.AVTransportURIMetaData`

The description of what's loaded: title, artwork, and other display metadata for whatever AVTransportURI points at. It is packed in the track-metadata format that apps render the 'now playing' header from.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentCrossfadeMode`

Whether crossfade is on. It is the blend-between-tracks setting, reported so the app's toggle stays in sync with the actual player state.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentMediaDuration`

The total duration of the loaded media. It is pinned at 'not implemented' in this build because Sonos reports durations per-track through CurrentTrackDuration rather than for the whole program.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentPlayMode`

The current play mode: normal, repeat-all, repeat-one, shuffle, or shuffle-and-repeat. It is the variable behind which shuffle and repeat icons light up in the app.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentRecordQualityMode`

The recording quality setting. It is a leftover field from the standard spec, permanently 'not implemented' on a speaker that doesn't record.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentSection`

Which 'section' of the current program is active. It is used by sources with internal structure like chapters or segments, and for ordinary tracks it effectively means the current position in the list.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrack`

The index of the track currently playing, meaning which entry of the queue is live right now. It advances as the queue progresses, and combined with NumberOfTracks it produces 'track 4 of 23'.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackDuration`

How long the current track is. This is the value the app's progress bar divides elapsed time by to draw its fill position.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackMetaData`

The metadata for the playing track: title, artist, album, and artwork, packed in the track-metadata XML format. Everything the app's now-playing display shows about the song comes from this field.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackURI`

The address of the playing track itself, meaning the specific item's URI. It is distinct from the source-level AVTransportURI: the queue might be the source while this names the exact song inside it.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTransportActions`

The list of transport commands currently legal, such as 'Play,Stop,Next', computed live from the source and state. Apps read it to decide which buttons to enable and which to grey out.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NextAVTransportURI`

The address of the next track, announced in advance. It is the gapless-playback lookahead: what has been lined up to play when the current track ends, so the player can pre-buffer it.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NextAVTransportURIMetaData`

The metadata for the announced next track, meaning the title and artwork the app can show in 'up next' before the track actually starts.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NumberOfTracks`

How many tracks are in the current program. For queue playback this is the queue length, and for sources that behave like lists it reports whatever count the source provides.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PlaybackStorageMedium`

Which 'medium' the current playback comes from: queue, network stream, line-in, and so on. It is the broad category label for the current source.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossiblePlaybackStorageMedia`

The list of source types this player can play: the hardware's declared talents, fixed per model, describing which media categories it will accept at all.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NONE, NETWORK

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossibleRecordQualityModes`

The recording-quality options the player claims. The answer is none, since a speaker doesn't record, and it is standard-spec boilerplate kept for protocol completeness.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossibleRecordStorageMedia`

The recording media the player claims. The answer is none, and it is another spec field kept for completeness on a device that doesn't record.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.RecordMediumWriteStatus`

Write-protect status of the 'record medium'. It is boilerplate for a player that doesn't record, present because the standard requires the field.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.RecordStorageMedium`

Which medium would be recorded to. It is fixed at none on a playback-only device, included as spec boilerplate.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorDescription`

A text description of the last transport failure: the human-readable message attached when playback errors, describing what went wrong.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorHttpCode`

When a stream fails, this holds the HTTP status from the failed fetch, for example a 404 from a dead stream URL. It lets apps tell 'the file is gone' apart from 'the network died'.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorHttpHeaders`

The response headers captured from a failed stream fetch. They are extra diagnostics attached to transport errors, useful for debugging why a stream died.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorURI`

The address that failed when a transport error occurred. It identifies which stream or item the error belongs to, so the failure can be traced back to its source.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportPlaySpeed`

The playback speed, normally '1'. It is the standard's field for variable-speed playback, which this firmware doesn't implement.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportState`

The headline playback state: PLAYING, PAUSED_PLAYBACK, STOPPED, or TRANSITIONING. It is the single most-watched variable on the player, because every 'is it playing?' answer in every app comes from this one field.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportStatus`

The health of the transport: OK or an error indicator. It is paired with the state so 'stopped because you asked' can be told apart from 'stopped because the stream died'.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:AlarmRunning`

Whether an alarm is currently ringing. It is set while an alarm fires so the system (and the snooze and stop logic) knows an alarm session is live. The 'r:' prefix marks it as a Sonos extension beyond the standard variable set.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:CurrentValidPlayModes`

Which play modes are currently legal: the shuffle and repeat choices you may pick right now, computed from the source. Repeat-one makes no sense on a live stream, so it is omitted then.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlAccountID`

Which account owns an active direct-control session. It is the identity of the external service feeding the player, set while one is in control.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlClientID`

Which client owns an active direct-control session, meaning the specific app or instance behind an external feed. It is set while a direct-control session owns the player.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlIsSuspended`

Whether the direct-control session is suspended: paused in a way that keeps the session alive while the external source isn't actively streaming.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:EnqueuedTransportURI`

The address of the source queued up to take over, meaning the next program's URI. It names what will become current when the player switches source, which is distinct from the next track inside the current program.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:EnqueuedTransportURIMetaData`

The description of whatever EnqueuedTransportURI points at. It lets apps show what's coming next at the program level rather than the track level.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:NextTrackMetaData`

The metadata for the next track in the Sonos extension namespace. It parallels the standard NextAVTransportURIMetaData under the r: prefix.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:NextTrackURI`

The next track's address in the Sonos extension namespace. It is the same lookahead concept as NextAVTransportURI, exposed under the r: prefix.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:RestartPending`

Whether the player has flagged that a restart is pending. It is a marker used around updates and recovery so clients know the session may bounce.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:SleepTimerGeneration`

A counter that ticks whenever the sleep timer is set, changed, or cancelled. It lets apps tell a fresh timer apart from an old one without comparing durations.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:SnoozeRunning`

Whether an alarm snooze is currently counting down. It is set between hitting snooze and the alarm re-ringing, which is how the system knows a snooze is in progress.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVTransport.AVTransportURI`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.AVTransportURIMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.A_ARG_TYPE_AlarmIncludeLinkedZones`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RunAlarm`, `StartAutoplay`

### `AVTransport.A_ARG_TYPE_AlarmState`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_AlarmVolume`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RunAlarm`, `StartAutoplay`

### `AVTransport.A_ARG_TYPE_ClearSource`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `DelegateGroupCoordinationTo`

### `AVTransport.A_ARG_TYPE_CurrentAVTransportURI`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ChangeCoordinator`, `ChangeTransportSettings`

### `AVTransport.A_ARG_TYPE_EnqueueAsNext`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`

### `AVTransport.A_ARG_TYPE_GroupID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeCoordinatorOfStandaloneGroup`, `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`, `GetRunningAlarmProperties`

### `AVTransport.A_ARG_TYPE_ISO8601Time`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ConfigureSleepTimer`, `GetRemainingSleepTimerDuration`, `RunAlarm`, `SnoozeAlarm`

### `AVTransport.A_ARG_TYPE_InstanceID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `BackupQueue`, `BecomeCoordinatorOfStandaloneGroup`, `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`, `ChangeCoordinator`, `ChangeTransportSettings`, `ConfigureSleepTimer`, `CreateSavedQueue`, `DelegateGroupCoordinationTo`, `EndDirectControlSession`, `GetCrossfadeMode`, `GetCurrentTransportActions`, `GetDeviceCapabilities`, `GetMediaInfo`, `GetPositionInfo`, `GetRemainingSleepTimerDuration`, `GetRunningAlarmProperties`, `GetTransportInfo`, `GetTransportSettings`, `Next`, `NotifyDeletedURI`, `Pause`, `Play`, `Previous`, `RemoveAllTracksFromQueue`, `RemoveTrackFromQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`, `ReorderTracksInSavedQueue`, `RunAlarm`, `SaveQueue`, `Seek`, `SetAVTransportURI`, `SetCrossfadeMode`, `SetNextAVTransportURI`, `SetPlayMode`, `SnoozeAlarm`, `StartAutoplay`, `Stop`

### `AVTransport.A_ARG_TYPE_LIST_URI`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIsToQueue`

### `AVTransport.A_ARG_TYPE_LIST_URIMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIsToQueue`

### `AVTransport.A_ARG_TYPE_MemberID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`, `ChangeCoordinator`, `DelegateGroupCoordinationTo`

### `AVTransport.A_ARG_TYPE_MemberList`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_NumTracks`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`, `ReorderTracksInSavedQueue`

### `AVTransport.A_ARG_TYPE_NumTracksChange`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ReorderTracksInSavedQueue`

### `AVTransport.A_ARG_TYPE_ObjectID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddURIToSavedQueue`, `CreateSavedQueue`, `RemoveTrackFromQueue`, `ReorderTracksInSavedQueue`, `SaveQueue`

### `AVTransport.A_ARG_TYPE_PlayerID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeCoordinatorOfStandaloneGroup`

### `AVTransport.A_ARG_TYPE_Queue`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_RejoinGroup`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `DelegateGroupCoordinationTo`

### `AVTransport.A_ARG_TYPE_ResetVolumeAfter`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `StartAutoplay`

### `AVTransport.A_ARG_TYPE_RestartSink`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ChangeCoordinator`

### `AVTransport.A_ARG_TYPE_ResumePlayback`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_SavedQueueTitle`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateSavedQueue`, `SaveQueue`

### `AVTransport.A_ARG_TYPE_SeekMode`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Seek`

### `AVTransport.A_ARG_TYPE_SeekTarget`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Seek`

### `AVTransport.A_ARG_TYPE_SleepTimerState`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_SourceState`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_StreamRestartState`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_TrackList`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ReorderTracksInSavedQueue`

### `AVTransport.A_ARG_TYPE_TrackNumber`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`

### `AVTransport.A_ARG_TYPE_TransportSettings`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeGroupCoordinator`, `ChangeCoordinator`, `ChangeTransportSettings`

### `AVTransport.A_ARG_TYPE_URI`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`

### `AVTransport.A_ARG_TYPE_URIMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`

### `AVTransport.A_ARG_TYPE_VLIState`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BecomeGroupCoordinator`

### `AVTransport.AbsoluteCounterPosition`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable: read via action out-args, not pushed

</details>

- related actions: `GetPositionInfo`

### `AVTransport.AbsoluteTimePosition`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable: read via action out-args, not pushed

</details>

- related actions: `GetPositionInfo`

### `AVTransport.AlarmIDRunning`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable: read via action out-args, not pushed

</details>

- related actions: `GetRunningAlarmProperties`, `RunAlarm`

### `AVTransport.AlarmLoggedStartTime`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable: read via action out-args, not pushed

</details>

- related actions: `GetRunningAlarmProperties`, `RunAlarm`

### `AVTransport.AlarmRunning`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.CurrentCrossfadeMode`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.CurrentMediaDuration`

<details markdown="1"><summary><b>Technical details</b></summary>

constant evented field

</details>

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.CurrentPlayMode`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.CurrentRecordQualityMode`

<details markdown="1"><summary><b>Technical details</b></summary>

constant evented field

</details>

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.CurrentSection`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.CurrentTrack`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.CurrentTrackDuration`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.CurrentTrackMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.CurrentTrackURI`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.CurrentTransportActions`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.CurrentValidPlayModes`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.DirectControlAccountID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.DirectControlClientID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.DirectControlIsSuspended`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.EnqueuedTransportURI`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.EnqueuedTransportURIMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.LastChange`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AVTransport LastChange/GENA event notifications

</details>


### `AVTransport.MuseSessions`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable: read via action out-args, not pushed

</details>


### `AVTransport.NextAVTransportURI`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.NextAVTransportURIMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.NextTrackMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.NextTrackURI`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.NumberOfTracks`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.PlaybackStorageMedium`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.PossiblePlaybackStorageMedia`

<details markdown="1"><summary><b>Technical details</b></summary>

constant evented field

</details>

- accepted values: `NONE, NETWORK`
- constant in this build

### `AVTransport.PossibleRecordQualityModes`

<details markdown="1"><summary><b>Technical details</b></summary>

constant evented field

</details>

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.PossibleRecordStorageMedia`

<details markdown="1"><summary><b>Technical details</b></summary>

constant evented field

</details>

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.QueueUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable: read via action out-args, not pushed

</details>

- related actions: `AddMultipleURIsToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`, `RemoveTrackFromQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`, `ReorderTracksInSavedQueue`

### `AVTransport.RecordMediumWriteStatus`

<details markdown="1"><summary><b>Technical details</b></summary>

constant evented field

</details>

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.RecordStorageMedium`

<details markdown="1"><summary><b>Technical details</b></summary>

constant evented field

</details>

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.RelativeCounterPosition`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable: read via action out-args, not pushed

</details>

- related actions: `GetPositionInfo`

### `AVTransport.RelativeTimePosition`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable: read via action out-args, not pushed

</details>

- related actions: `GetPositionInfo`

### `AVTransport.RestartPending`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.SleepTimerGeneration`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.SnoozeRunning`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.TransportErrorDescription`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.TransportErrorHttpCode`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.TransportErrorHttpHeaders`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.TransportErrorURI`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.TransportPlaySpeed`

<details markdown="1"><summary><b>Technical details</b></summary>

constant evented field

</details>

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.TransportState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AVTransport.TransportStatus`

<details markdown="1"><summary><b>Technical details</b></summary>

evented transport state variable (r:-prefixed rincon extension where applicable)

</details>


### `AlarmClock.A_ARG_TYPE_AlarmEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateAlarm`, `DestroyAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmIncludeLinkedZones`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmList`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ListAlarms`

### `AlarmClock.A_ARG_TYPE_AlarmPlayMode`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmProgramMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmProgramURI`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmRoomUUID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmVolume`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_ISO8601Time`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateAlarm`, `GetHouseholdTimeAtStamp`, `GetTimeNow`, `SetTimeNow`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_Recurrence`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_TimeStamp`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetHouseholdTimeAtStamp`

### `AlarmClock.A_ARG_TYPE_TimeZoneAutoAdjustDst`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetTimeZone`, `GetTimeZoneAndRule`, `SetTimeZone`

### `AlarmClock.A_ARG_TYPE_TimeZoneIndex`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetTimeZone`, `GetTimeZoneAndRule`, `GetTimeZoneRule`, `SetTimeZone`

### `AlarmClock.A_ARG_TYPE_TimeZoneInformation`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `SetTimeNow`

### `AlarmClock.AlarmListVersion`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `ListAlarms`

### `AlarmClock.DailyIndexRefreshTime`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetDailyIndexRefreshTime`, `SetDailyIndexRefreshTime`

### `AlarmClock.DateFormat`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetFormat`, `SetFormat`

### `AlarmClock.TimeFormat`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetFormat`, `SetFormat`

### `AlarmClock.TimeGeneration`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetTimeNow`

### `AlarmClock.TimeServer`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetTimeServer`, `SetTimeServer`

### `AlarmClock.TimeZone`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetTimeNow`, `GetTimeZoneAndRule`, `GetTimeZoneRule`

### `AudioIn.A_ARG_TYPE_MemberID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `StartTransmissionToGroup`, `StopTransmissionToGroup`

### `AudioIn.A_ARG_TYPE_ObjectID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `StartTransmissionToGroup`

### `AudioIn.A_ARG_TYPE_TransportSettings`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `StartTransmissionToGroup`

### `AudioIn.AudioInputName`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AudioIn LastChange/GENA event notifications

</details>

- related actions: `GetAudioInputAttributes`, `SetAudioInputAttributes`

### `AudioIn.Icon`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AudioIn LastChange/GENA event notifications

</details>

- related actions: `GetAudioInputAttributes`, `SetAudioInputAttributes`

### `AudioIn.LeftLineInLevel`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AudioIn LastChange/GENA event notifications

</details>

- related actions: `GetLineInLevel`, `SetLineInLevel`

### `AudioIn.LineInConnected`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AudioIn LastChange/GENA event notifications

</details>


### `AudioIn.Playing`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AudioIn LastChange/GENA event notifications

</details>


### `AudioIn.RightLineInLevel`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in AudioIn LastChange/GENA event notifications

</details>

- related actions: `GetLineInLevel`, `SetLineInLevel`

### `CD.ContainerUpdateIDs`

The change-markers for library containers: a list of which folders and playlists changed since the last check. It lets an app refresh only the parts of its browse view that moved instead of re-reading the whole library.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_103035c4

</details>


### `CD.FavoritesUpdateID`

A version counter for the favorites list. It bumps whenever your saved stations, playlists, or items change, which tells apps their favorites view is stale.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_10303de4

</details>


### `CD.RadioFavoritesUpdateID`

A version counter for saved radio favorites. It bumps when your radio presets change, so the stations list refreshes only when it needs to.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_10303de4

</details>


### `CD.SavedQueuesUpdateID`

A version counter for Sonos playlists. It bumps when any saved queue is created, edited, or deleted, making it the 'your playlists changed' signal.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_10303de4

</details>


### `CD.ShareIndexInProgress`

Whether a music-library rescan is running right now. It is the flag behind the 'updating music index' spinner, on while a rescan walks your folders.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_103035c4

</details>


### `CD.ShareListUpdateID`

A version counter for the music-shares list. It bumps when folders are added to or removed from the library, so apps re-fetch the share list only when it changed.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_10303de4

</details>


### `CM.CurrentConnectionIDs`

The list of live connections against the player, which is the evented form of the connection-list command. It fires whenever a control session opens or closes.

<details markdown="1"><summary><b>Technical details</b></summary>

ConnectionManager evented variable in f_10735918

</details>


### `ConnectionManager.A_ARG_TYPE_AVTransportID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionManager`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionStatus`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_Direction`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ProtocolInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_RcsID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.CurrentConnectionIDs`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ConnectionManager LastChange/GENA event notifications

</details>

- related actions: `GetCurrentConnectionIDs`

### `ConnectionManager.SinkProtocolInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ConnectionManager LastChange/GENA event notifications

</details>

- related actions: `GetProtocolInfo`

### `ConnectionManager.SourceProtocolInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ConnectionManager LastChange/GENA event notifications

</details>

- related actions: `GetProtocolInfo`

### `ContentDirectory.A_ARG_TYPE_AlbumArtistDisplayOption`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetAlbumArtistDisplayOption`, `RefreshShareIndex`

### `ContentDirectory.A_ARG_TYPE_BrowseFlag`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_Count`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`, `GetAllPrefixLocations`

### `ContentDirectory.A_ARG_TYPE_Filter`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_Index`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`, `FindPrefix`

### `ContentDirectory.A_ARG_TYPE_LastIndexChange`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetLastIndexChange`

### `ContentDirectory.A_ARG_TYPE_ObjectID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`, `CreateObject`, `DestroyObject`, `FindPrefix`, `GetAllPrefixLocations`, `UpdateObject`

### `ContentDirectory.A_ARG_TYPE_Prefix`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `FindPrefix`

### `ContentDirectory.A_ARG_TYPE_Result`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`, `CreateObject`, `GetAllPrefixLocations`

### `ContentDirectory.A_ARG_TYPE_SearchCriteria`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>


### `ContentDirectory.A_ARG_TYPE_SortCriteria`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_SortOrder`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RequestResort`

### `ContentDirectory.A_ARG_TYPE_TagValueList`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `UpdateObject`

### `ContentDirectory.A_ARG_TYPE_UpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`, `FindPrefix`, `GetAllPrefixLocations`

### `ContentDirectory.Browseable`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>

- related actions: `GetBrowseable`, `SetBrowseable`

### `ContentDirectory.ContainerUpdateIDs`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.FavoritesUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.RadioFavoritesUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.RadioLocationUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.RecentlyPlayedUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.SavedQueuesUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.SearchCapabilities`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented ContentDirectory state variable: read via action out-args, not pushed

</details>

- related actions: `GetSearchCapabilities`

### `ContentDirectory.ShareIndexInProgress`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>

- related actions: `GetShareIndexInProgress`

### `ContentDirectory.ShareIndexLastError`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.ShareListUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.SortCapabilities`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented ContentDirectory state variable: read via action out-args, not pushed

</details>

- related actions: `GetSortCapabilities`

### `ContentDirectory.SystemUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>

- related actions: `GetSystemUpdateID`

### `ContentDirectory.UserRadioUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

</details>


### `DP.CurrentZoneName`

This speaker's room name, the label you gave it in the app such as 'Kitchen'. It fires when the room gets renamed, so every display updates.

<details markdown="1"><summary><b>Technical details</b></summary>

DeviceProperties evented variable (ZoneNameChangedEvent)

</details>


### `DP.Invisible`

Whether the speaker is hidden. This 'invisible' flag removes the player from normal room display, and it is used for satellites and bonded members that shouldn't appear as separate rooms.

<details markdown="1"><summary><b>Technical details</b></summary>

DeviceProperties evented variable (DeviceInfo attr literal)

</details>


### `DP.MicEnabled`

Whether the speaker's microphone is enabled. It is the mic-on flag for voice-capable products, kept in this service's spec for parity even though this older hardware has no mic.

<details markdown="1"><summary><b>Technical details</b></summary>

DeviceProperties evented variable (DeviceInfo attr literal)

</details>


### `DP.ResetVolumeAfter`

Whether the speaker resets its volume after a triggered session. It is the flag used by alarm and autoplay so a wake-up volume doesn't become the permanent level.

<details markdown="1"><summary><b>Technical details</b></summary>

DeviceProperties evented variable in f_102fc6f4

</details>


### `DeviceProperties.A_ARG_TYPE_ButtonState`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetButtonState`

### `DeviceProperties.A_ARG_TYPE_ConfigModeOptions`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `EnterConfigMode`, `ExitConfigMode`

### `DeviceProperties.A_ARG_TYPE_ConfigModeState`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `EnterConfigMode`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpChannel`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- range: `minimum` = 0; `maximum` = 7; `step` = 1
- related actions: `RoomDetectionStartChirping`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpIfPlayingSwappableAudio`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RoomDetectionStartChirping`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionDurationMilliseconds`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RoomDetectionStartChirping`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionPlayId`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RoomDetectionStartChirping`, `RoomDetectionStopChirping`

### `DeviceProperties.AirPlayEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.AlexaCBLSupported`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.AutoplayIncludeLinkedZones`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetAutoplayLinkedZones`, `SetAutoplayLinkedZones`

### `DeviceProperties.AutoplayRoomUUID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetAutoplayRoomUUID`, `SetAutoplayRoomUUID`

### `DeviceProperties.AutoplaySource`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetAutoplayLinkedZones`, `GetAutoplayRoomUUID`, `GetAutoplayVolume`, `GetUseAutoplayVolume`, `SetAutoplayLinkedZones`, `SetAutoplayRoomUUID`, `SetAutoplayVolume`, `SetUseAutoplayVolume`

### `DeviceProperties.AutoplayUseVolume`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetUseAutoplayVolume`, `SetUseAutoplayVolume`

### `DeviceProperties.AutoplayVolume`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `GetAutoplayVolume`, `SetAutoplayVolume`

### `DeviceProperties.AvailableRoomCalibration`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.BehindWifiExtender`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.ButtonLockState`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetButtonLockState`, `SetButtonLockState`

### `DeviceProperties.ChannelFreq`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.ChannelMapSet`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `AddBondedZones`, `CreateStereoPair`, `RemoveBondedZones`, `SeparateStereoPair`

### `DeviceProperties.ConfigMode`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `EnterConfigMode`

### `DeviceProperties.Configuration`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.ConnectionType`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.CopyrightInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.DisplaySoftwareVersion`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.EthLink`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.ExtraInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.Flags`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.HTAudioIn`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.HTBondedZoneCommitState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.HTSatChanMapSet`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `AddHTSatellite`

### `DeviceProperties.HardwareVersion`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.HasConfiguredSSID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.HdmiCecAvailable`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.HouseholdID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetHouseholdID`

### `DeviceProperties.IPAddress`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.Icon`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.Invisible`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.IsIdle`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.IsZoneBridge`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.KeepGrouped`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `RemoveBondedZones`

### `DeviceProperties.LEDState`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetLEDState`, `SetLEDState`

### `DeviceProperties.LastChangedPlayState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.MACAddress`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.MicEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.MoreInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.Orientation`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.RoomCalibrationState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.SatRoomUUID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `RemoveHTSatellite`

### `DeviceProperties.SecureRegState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.SerialNumber`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.SettingsReplicationState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.SoftwareVersion`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.SupportsAudioClip`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.SupportsAudioIn`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.SvcActive`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.TVConfigurationError`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.TargetRoomName`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable: read via action out-args, not pushed

</details>

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.VoiceConfigState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.WifiEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.WirelessMode`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.ZoneName`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `GM.DelegatedGroupCoordinatorID`

Which member group leadership was delegated to. It is set during a coordinator hand-off so the topology knows who is taking over the group.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupManagement evented variable (event-pool literal)

</details>


### `GM.LocalGroupUUID`

The identifier of the group this speaker currently belongs to. It is its group membership expressed in one value, and it changes on every group and ungroup.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupManagement evented variable (event-pool literal)

</details>


### `GM.VirtualLineInGroupID`

The group associated with a virtual line-in session. It is set while an external feed session exists, tying the session to the group it serves.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupManagement evented variable (setVirtualLineInGroupIDLocked worker)

</details>


### `GRC.GroupMute`

The group's mute state. It is the evented flag every controller follows for the group mute button, so when it changes anywhere, every app sees it flip.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupRenderingControl evented variable (SetGroupMute rc-log literal)

</details>


### `GRC.GroupVolume`

The group's aggregate volume, which is the number behind the group slider. The coordinator re-derives it as member levels change.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupRenderingControl evented variable (SetGroupVolume rc-log literal)

</details>


### `GRC.GroupVolumeChangeable`

Whether the group volume can currently be changed. In some configurations the group level is locked or derived, and this flag tells the app the slider should be disabled.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupRenderingControl evented variable (GroupVolumeChangedEvent pool)

</details>


### `GroupManagement.A_ARG_TYPE_AVTransportURI`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMember`

### `GroupManagement.A_ARG_TYPE_BootSeq`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMember`

### `GroupManagement.A_ARG_TYPE_BufferingResultCode`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ReportTrackBufferingResult`

### `GroupManagement.A_ARG_TYPE_MemberID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMember`, `RemoveMember`, `ReportTrackBufferingResult`

### `GroupManagement.A_ARG_TYPE_TransportSettings`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMember`

### `GroupManagement.GroupCoordinatorIsLocal`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in GroupManagement LastChange/GENA event notifications

</details>


### `GroupManagement.LocalGroupUUID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in GroupManagement LastChange/GENA event notifications

</details>

- related actions: `AddMember`

### `GroupManagement.ResetVolumeAfter`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in GroupManagement LastChange/GENA event notifications

</details>

- related actions: `AddMember`

### `GroupManagement.SourceAreaIds`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented GroupManagement state variable: read via action out-args, not pushed

</details>

- related actions: `SetSourceAreaIds`

### `GroupManagement.VirtualLineInGroupID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in GroupManagement LastChange/GENA event notifications

</details>


### `GroupManagement.VolumeAVTransportURI`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in GroupManagement LastChange/GENA event notifications

</details>

- related actions: `AddMember`

### `GroupRenderingControl.A_ARG_TYPE_InstanceID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetGroupMute`, `GetGroupVolume`, `SetGroupMute`, `SetGroupVolume`, `SetRelativeGroupVolume`, `SnapshotGroupVolume`

### `GroupRenderingControl.A_ARG_TYPE_VolumeAdjustment`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `SetRelativeGroupVolume`

### `GroupRenderingControl.GroupMute`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in GroupRenderingControl LastChange/GENA event notifications

</details>

- related actions: `GetGroupMute`, `SetGroupMute`

### `GroupRenderingControl.GroupVolume`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in GroupRenderingControl LastChange/GENA event notifications

</details>

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `GetGroupVolume`, `SetGroupVolume`, `SetRelativeGroupVolume`

### `GroupRenderingControl.GroupVolumeChangeable`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in GroupRenderingControl LastChange/GENA event notifications

</details>


### `HT.LEDFeedbackState`

Whether the remote-received LED flash is on. It is the home-theater feedback setting, evented so settings screens stay truthful about the device state.

<details markdown="1"><summary><b>Technical details</b></summary>

HTControl evented variable in f_10739c34

</details>


### `HT.RemoteConfigured`

Whether the speaker has a configured infrared remote. It is set once remote-learning is done, and it is the flag apps check before offering the setup wizard.

<details markdown="1"><summary><b>Technical details</b></summary>

HTControl evented variable in f_10782194

</details>


### `HTControl.A_ARG_TYPE_IRCode`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `LearnIRCode`

### `HTControl.A_ARG_TYPE_IRRemoteName`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CommitLearnedIRCodes`

### `HTControl.A_ARG_TYPE_Timeout`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- range: `minimum` = 0; `maximum` = 60000
- related actions: `IdentifyIRRemote`, `LearnIRCode`

### `HTControl.IRRepeaterState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in HTControl LastChange/GENA event notifications

</details>

- related actions: `GetIRRepeaterState`, `SetIRRepeaterState`

### `HTControl.LEDFeedbackState`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented HTControl state variable: read via action out-args, not pushed

</details>

- related actions: `GetLEDFeedbackState`, `SetLEDFeedbackState`

### `HTControl.RemoteConfigured`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented HTControl state variable: read via action out-args, not pushed

</details>

- related actions: `IsRemoteConfigured`

### `HTControl.TOSLinkConnected`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in HTControl LastChange/GENA event notifications

</details>


### `MS.ServiceListVersion`

A version counter for the music-service catalog. It bumps when the available-services list changes, so apps re-pull the catalog only when it moved.

<details markdown="1"><summary><b>Technical details</b></summary>

MusicServices evented variable; emitted by f_100c7084 e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `MusicServices.A_ARG_TYPE_ServiceDescriptorList`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ListAvailableServices`

### `MusicServices.A_ARG_TYPE_ServiceTypeList`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ListAvailableServices`

### `MusicServices.ServiceId`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented MusicServices state variable: read via action out-args, not pushed

</details>

- related actions: `GetSessionId`

### `MusicServices.ServiceListVersion`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in MusicServices LastChange/GENA event notifications

</details>

- related actions: `ListAvailableServices`

### `MusicServices.SessionId`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented MusicServices state variable: read via action out-args, not pushed

</details>

- related actions: `GetSessionId`

### `MusicServices.Username`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented MusicServices state variable: read via action out-args, not pushed

</details>

- related actions: `GetSessionId`

### `QPlay.A_ARG_TYPE_Code`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `QPlayAuth`

### `QPlay.A_ARG_TYPE_DID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `QPlayAuth`

### `QPlay.A_ARG_TYPE_MID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `QPlayAuth`

### `QPlay.A_ARG_TYPE_Seed`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `QPlayAuth`

### `Queue.A_ARG_TYPE_Count`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`

### `Queue.A_ARG_TYPE_EnqueueAsNext`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIs`, `AddURI`

### `Queue.A_ARG_TYPE_Index`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`

### `Queue.A_ARG_TYPE_LIST_URI`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>


### `Queue.A_ARG_TYPE_LIST_URI_AND_METADATA`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIs`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_NumTracks`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIs`, `AddURI`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_ObjectID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_QueueID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIs`, `AddURI`, `AttachQueue`, `Browse`, `CreateQueue`, `RemoveAllTracks`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`, `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_QueueOwnerContext`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AttachQueue`, `CreateQueue`

### `Queue.A_ARG_TYPE_QueueOwnerID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AttachQueue`, `CreateQueue`

### `Queue.A_ARG_TYPE_QueuePolicy`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CreateQueue`

### `Queue.A_ARG_TYPE_Result`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Browse`

### `Queue.A_ARG_TYPE_SavedQueueTitle`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_TrackNumber`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIs`, `AddURI`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_TrackNumbersCSV`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_URI`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIs`, `AddURI`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_URIMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIs`, `AddURI`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_UpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddMultipleURIs`, `AddURI`, `Browse`, `RemoveAllTracks`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.Curated`

Whether a queue is 'curated', meaning marked as managed by some system component rather than a raw user queue.

<details markdown="1"><summary><b>Technical details</b></summary>

curated-queue flag

</details>


### `Queue.LastChange`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in Queue LastChange/GENA event notifications

</details>


### `Queue.QueueID`

The identifier of the queue being described, naming which managed queue an event or answer refers to.

<details markdown="1"><summary><b>Technical details</b></summary>

queue identifier assigned at AttachQueue/CreateQueue

</details>


### `Queue.QueueOwnerID`

Which component owns a queue: the entity (an internal module or a session) holding edit rights over it.

<details markdown="1"><summary><b>Technical details</b></summary>

queue owner UDN

</details>


### `Queue.UpdateID`

A queue's version stamp. It bumps on every edit, and apps send it back to prove they're editing the version they last saw, which prevents lost updates.

<details markdown="1"><summary><b>Technical details</b></summary>

queue content update id

</details>


### `RCS.AudioDelay`

The lip-sync delay for the main output: how much audio delay is applied so sound lines up with the TV picture. It exists because video processing adds latency the audio must wait out.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.AudioDelayLeftRear`

Lip-sync delay for the left rear channel. It is the surround-specific version of the audio delay, letting the left rear be timed independently.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.AudioDelayRightRear`

Lip-sync delay for the right rear channel, the companion to the left-rear delay. It gives the right rear its own lip-sync trim.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Bass`

The bass level. It is the equalizer's bass setting, evented so the app's EQ panel tracks changes made anywhere in the system.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.DialogLevel`

The dialogue-boost amount: how much speech-enhancement lift is applied on products that offer it. It is a per-model tone control for making voices easier to hear.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.HeightChannelLevel`

The level of height or ceiling channels. It is a setting for surround products with upward-firing speakers, present here only for spec parity on this older unit.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Loudness`

The loudness toggle. Loudness is Sonos's fullness boost for quiet listening, and it is evented alongside the rest of the EQ state.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.MusicSurroundLevel`

How much music playback goes to the surround speakers. It is the 'ambient versus full' music-surround level in a home-theater setup.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Mute`

The mute flag per channel, the most basic evented variable on this service. It fires every time mute flips, whether the change came from an app or the physical button.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.NightMode`

Whether night mode is on. Night mode is the dynamic-range compressor that softens loud effects for late-night TV, reported here as a home-theater toggle.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.OutputFixed`

Whether output is fixed-level. It is the flag that locks the speaker at line level for feeding an external amplifier.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.PresetNameList`

The list of named EQ and volume presets available. It is the preset vocabulary some products expose for one-tap sound modes.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SonarCalibrationAvailable`

Whether sonar or room calibration can run on this device. It is a capability flag telling apps whether to offer the tuning feature.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SonarEnabled`

Whether sonar calibration is currently enabled, which is the tuning system's on/off state after a completed calibration.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SpeakerSize`

The speaker-size classification: the large/small designation the audio pipeline uses for bass handling in home-theater configuration.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SpeechEnhanceEnabled`

Whether speech enhancement is on. It is the dialogue-clarity feature on theater products, evented so the app's toggle follows the real device state.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubCrossover`

The subwoofer crossover frequency: where bass hands off from the soundbar to the bonded sub. It is one of the home-theater tuning values.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubEnabled`

Whether the bonded subwoofer is enabled. It is the variable behind the app switch for 'use the sub', toggling the sub's participation in the theater rig.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubGain`

The subwoofer gain, meaning the sub's level trim relative to the rest of the rig. In plain terms, it controls how hot the bass runs.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubPolarity`

The subwoofer polarity: the phase setting (normal or inverted) that keeps the sub's bass in step with the bar's drivers.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SupportsMaxDialogLevel`

Whether this device supports the maximum dialogue-level setting. It is a capability flag that gates the strongest speech-boost option.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundEnabled`

Whether surround speakers are active in the rig. It is the rear-channel enable flag inside a bonded theater setup, toggling the rears' participation on or off.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundLevel`

The surround speakers' level trim, controlling how loud the rear speakers play relative to the soundbar.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundMode`

The surround mode for music playback: the 'ambient' versus 'full' setting that decides how much music goes to the rear speakers.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Treble`

The treble level. It is the equalizer's treble setting, evented alongside bass so every view reflects the new value as soon as it changes anywhere.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Volume`

The volume per channel, which is the most-watched variable on this service. Every slider move, button press, or remote command lands here.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RenderingControl.A_ARG_TYPE_Channel`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetLoudness`, `GetVolume`, `GetVolumeDB`, `GetVolumeDBRange`, `RampToVolume`, `RestoreVolumePriorToRamp`, `SetLoudness`, `SetRelativeVolume`, `SetVolume`, `SetVolumeDB`

### `RenderingControl.A_ARG_TYPE_ChannelMap`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `SetChannelMap`

### `RenderingControl.A_ARG_TYPE_EQType`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetEQ`, `ResetExtEQ`, `SetEQ`

### `RenderingControl.A_ARG_TYPE_InstanceID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetBass`, `GetEQ`, `GetHeadphoneConnected`, `GetLoudness`, `GetMute`, `GetOutputFixed`, `GetRoomCalibrationStatus`, `GetSupportsOutputFixed`, `GetTreble`, `GetVolume`, `GetVolumeDB`, `GetVolumeDBRange`, `RampToVolume`, `ResetBasicEQ`, `ResetExtEQ`, `RestoreVolumePriorToRamp`, `SetBass`, `SetChannelMap`, `SetEQ`, `SetLoudness`, `SetMute`, `SetOutputFixed`, `SetRelativeVolume`, `SetRoomCalibrationStatus`, `SetTreble`, `SetVolume`, `SetVolumeDB`

### `RenderingControl.A_ARG_TYPE_LeftVolume`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `ResetBasicEQ`

### `RenderingControl.A_ARG_TYPE_MuteChannel`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetMute`, `SetMute`

### `RenderingControl.A_ARG_TYPE_ProgramURI`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RampTimeSeconds`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RampType`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_ResetVolumeAfter`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RightVolume`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `ResetBasicEQ`

### `RenderingControl.A_ARG_TYPE_VolumeAdjustment`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `SetRelativeVolume`

### `RenderingControl.AudioDelay`

<details markdown="1"><summary><b>Technical details</b></summary>

lip-sync audio delay

</details>


### `RenderingControl.AudioDelayLeftRear`

<details markdown="1"><summary><b>Technical details</b></summary>

left-rear delay

</details>


### `RenderingControl.AudioDelayRightRear`

<details markdown="1"><summary><b>Technical details</b></summary>

right-rear delay

</details>


### `RenderingControl.Bass`

<details markdown="1"><summary><b>Technical details</b></summary>

bass EQ level

</details>


### `RenderingControl.DialogLevel`

<details markdown="1"><summary><b>Technical details</b></summary>

dialog enhancement level

</details>


### `RenderingControl.EQValue`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable: read via action out-args, not pushed

</details>

- related actions: `GetEQ`, `SetEQ`

### `RenderingControl.HeadphoneConnected`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable: read via action out-args, not pushed

</details>

- related actions: `GetHeadphoneConnected`

### `RenderingControl.HeightChannelLevel`

<details markdown="1"><summary><b>Technical details</b></summary>

height/Atmos channel output level

</details>


### `RenderingControl.LastChange`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in RenderingControl LastChange/GENA event notifications

</details>


### `RenderingControl.Loudness`

<details markdown="1"><summary><b>Technical details</b></summary>

loudness compensation state (Master)

</details>


### `RenderingControl.MusicSurroundLevel`

<details markdown="1"><summary><b>Technical details</b></summary>

surround level applied to music sources

</details>


### `RenderingControl.Mute`

<details markdown="1"><summary><b>Technical details</b></summary>

per-channel mute state

</details>


### `RenderingControl.NightMode`

<details markdown="1"><summary><b>Technical details</b></summary>

night-mode compression state

</details>


### `RenderingControl.OutputFixed`

<details markdown="1"><summary><b>Technical details</b></summary>

fixed line-out level enabled

</details>


### `RenderingControl.PresetNameList`

<details markdown="1"><summary><b>Technical details</b></summary>

list of available EQ preset names

</details>

- accepted values: `FactoryDefaults`
- constant value in this build

### `RenderingControl.RoomCalibrationAvailable`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable: read via action out-args, not pushed

</details>

- related actions: `GetRoomCalibrationStatus`

### `RenderingControl.RoomCalibrationBondedZoneInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

bonded-zone calibration info

</details>


### `RenderingControl.RoomCalibrationCalibrationMode`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable: read via action out-args, not pushed

</details>


### `RenderingControl.RoomCalibrationCoefficients`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable: read via action out-args, not pushed

</details>


### `RenderingControl.RoomCalibrationEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable: read via action out-args, not pushed

</details>

- related actions: `GetRoomCalibrationStatus`, `SetRoomCalibrationStatus`

### `RenderingControl.RoomCalibrationID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable: read via action out-args, not pushed

</details>


### `RenderingControl.SonarCalibrationAvailable`

<details markdown="1"><summary><b>Technical details</b></summary>

whether Sonar/Trueplay calibration data is available for this zone

</details>


### `RenderingControl.SonarEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

Trueplay/Sonar enabled

</details>


### `RenderingControl.SpeakerSize`

<details markdown="1"><summary><b>Technical details</b></summary>

speaker size class

</details>


### `RenderingControl.SpeechEnhanceEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

speech enhancement state

</details>


### `RenderingControl.SubCrossover`

<details markdown="1"><summary><b>Technical details</b></summary>

subwoofer crossover freq

</details>


### `RenderingControl.SubEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

whether the bonded subwoofer is enabled

</details>


### `RenderingControl.SubGain`

<details markdown="1"><summary><b>Technical details</b></summary>

subwoofer output gain level

</details>


### `RenderingControl.SubPolarity`

<details markdown="1"><summary><b>Technical details</b></summary>

subwoofer polarity phase setting

</details>


### `RenderingControl.SupportsMaxDialogLevel`

<details markdown="1"><summary><b>Technical details</b></summary>

whether the device supports the maximum dialog level

</details>


### `RenderingControl.SupportsOutputFixed`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable: read via action out-args, not pushed

</details>

- related actions: `GetSupportsOutputFixed`

### `RenderingControl.SurroundEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

whether surround channels are enabled

</details>


### `RenderingControl.SurroundLevel`

<details markdown="1"><summary><b>Technical details</b></summary>

surround channel level

</details>


### `RenderingControl.SurroundMode`

<details markdown="1"><summary><b>Technical details</b></summary>

surround processing mode

</details>


### `RenderingControl.Treble`

<details markdown="1"><summary><b>Technical details</b></summary>

treble EQ level

</details>


### `RenderingControl.Volume`

<details markdown="1"><summary><b>Technical details</b></summary>

per-channel volume (Master/LF/RF elements)

</details>


### `RenderingControl.VolumeDB`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable: read via action out-args, not pushed

</details>

- related actions: `GetVolumeDB`, `GetVolumeDBRange`, `SetVolumeDB`

### `SystemProperties.A_ARG_TYPE_AccountCredential`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddOAuthAccountX`, `RefreshAccountCredentialsX`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_AccountID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddAccountX`, `EditAccountMd`, `EditAccountPasswordX`, `ProvisionCredentialedTrialAccountX`, `RemoveAccount`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_AccountMd`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `EditAccountMd`

### `SystemProperties.A_ARG_TYPE_AccountNickname`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddOAuthAccountX`, `SetAccountNicknameX`

### `SystemProperties.A_ARG_TYPE_AccountPassword`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddAccountX`, `EditAccountPasswordX`, `ProvisionCredentialedTrialAccountX`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_AccountTier`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_AccountType`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddAccountX`, `AddOAuthAccountX`, `EditAccountMd`, `EditAccountPasswordX`, `GetWebCode`, `ProvisionCredentialedTrialAccountX`, `RefreshAccountCredentialsX`, `RemoveAccount`

### `SystemProperties.A_ARG_TYPE_AccountUDN`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddAccountX`, `AddOAuthAccountX`, `ProvisionCredentialedTrialAccountX`, `ReplaceAccountX`, `SetAccountNicknameX`

### `SystemProperties.A_ARG_TYPE_AccountUID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RefreshAccountCredentialsX`

### `SystemProperties.A_ARG_TYPE_AuthorizationCode`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_IsExpired`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ProvisionCredentialedTrialAccountX`

### `SystemProperties.A_ARG_TYPE_OAuthDeviceID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddOAuthAccountX`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_RDMEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `EnableRDM`, `GetRDM`

### `SystemProperties.A_ARG_TYPE_RedirectURI`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_StubsCreated`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>


### `SystemProperties.A_ARG_TYPE_UserIdHashCode`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_VariableName`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetString`, `Remove`, `SetString`

### `SystemProperties.A_ARG_TYPE_VariableStringValue`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `GetString`, `GetWebCode`, `SetString`

### `SystemProperties.CustomerID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in SystemProperties LastChange/GENA event notifications

</details>


### `SystemProperties.ThirdPartyHash`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in SystemProperties LastChange/GENA event notifications

</details>


### `SystemProperties.UpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in SystemProperties LastChange/GENA event notifications

</details>


### `SystemProperties.UpdateIDX`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in SystemProperties LastChange/GENA event notifications

</details>


### `SystemProperties.VoiceUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in SystemProperties LastChange/GENA event notifications

</details>


### `VirtualLineIn.AVTransportURIMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented VirtualLineIn state variable: read via action out-args, not pushed

</details>


### `VirtualLineIn.A_ARG_TYPE_CurrentTransportSettings`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `StartTransmission`

### `VirtualLineIn.A_ARG_TYPE_InstanceID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Next`, `Pause`, `Play`, `Previous`, `SetVolume`, `StartTransmission`, `Stop`, `StopTransmission`

### `VirtualLineIn.A_ARG_TYPE_PlayerID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `StartTransmission`, `StopTransmission`

### `VirtualLineIn.A_ARG_TYPE_Speed`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `Play`

### `VirtualLineIn.A_ARG_TYPE_Volume`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `SetVolume`

### `VirtualLineIn.CurrentTrackMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in VirtualLineIn LastChange/GENA event notifications

</details>


### `VirtualLineIn.CurrentTransportActions`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented VirtualLineIn state variable: read via action out-args, not pushed

</details>


### `VirtualLineIn.EnqueuedTransportURIMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented VirtualLineIn state variable: read via action out-args, not pushed

</details>


### `ZGT.ZoneGroupState`

The entire household map as one variable: every player, its room name, its group, and each group's leader, packed into a single document. It is the heartbeat of multi-room awareness, because it changes and announces every time the system's shape changes.

<details markdown="1"><summary><b>Technical details</b></summary>

ZGT evented state doc: full <ZoneGroupState>+<ZoneGroups>+<MediaServers> XML pushed via f_1074d9b4 emitter (serializer f_10743328, MediaServers section f_10129888); not LastChange attribute-form

</details>

- form: `direct <e:property><ZoneGroupState> XML`

### `ZoneGroupTopology.A_ARG_TYPE_CachedOnly`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_IncludeControllers`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.A_ARG_TYPE_MemberID`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ReportUnresponsiveDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceName`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceUDN`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileIPAndPort`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_Origin`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.A_ARG_TYPE_UnresponsiveDeviceActionType`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `ReportUnresponsiveDevice`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateExtraOptions`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateFlags`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateItem`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateType`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateURL`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_Version`

<details markdown="1"><summary><b>Technical details</b></summary>

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

</details>

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.AlarmRunSequence`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.AreasUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.AvailableSoftwareUpdate`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.DiagnosticID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented ZoneGroupTopology state variable: read via action out-args, not pushed

</details>

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.MuseHouseholdId`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.NetsettingsUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.SourceAreasUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.ThirdPartyMediaServersX`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.ZoneGroupID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.ZoneGroupName`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.ZoneGroupState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>

- related actions: `GetZoneGroupState`

### `ZoneGroupTopology.ZonePlayerUUIDsInGroup`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

</details>

- related actions: `GetZoneGroupAttributes`

### `alarm_status_schema`

The field list for the alarm page on the player's built-in diagnostics website: which alarm details the player exposes when you or support tools visit its status pages, covering what's scheduled, what's ringing, and the bookkeeping around each.

<details markdown="1"><summary><b>Technical details</b></summary>

/status/alarm emitted XML

</details>


### `avt_lastchange`

The field list for the transport service's bundled change reports: everything packed into the 'what just changed in playback' message, covering state, track, position, mode, and source. One event carries all of this at once, which is why an app updates its whole now-playing screen from a single notification.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport LastChange evented fields

</details>


### `device_props_extra_vars`

Additional device-property fields the settings service carries beyond the standard set: the extra bits of speaker configuration reported alongside the usual name, LED, and button state.

<details markdown="1"><summary><b>Technical details</b></summary>

more state vars

</details>


### `device_props_update_ids`

The set of change-counters the device-properties service keeps. These version numbers tick when different aspects of the speaker's config change, so interested parties can tell what moved without comparing every field.

<details markdown="1"><summary><b>Technical details</b></summary>

update counters

</details>


### `ht_input_session`

The telemetry fields captured for a home-theater input session: the bookkeeping the soundbar keeps about an active TV or optical input session, covering source, timing, and session state.

<details markdown="1"><summary><b>Technical details</b></summary>

HT input-session telemetry fields

</details>


### `netsettings_schema`

The layout of the player's replicated network-settings store: the on-disk document holding WiFi credentials and network configuration that all devices in the household share. This is where your WiFi password actually lives inside the system: encrypted per-household and replicated across players so any of them can join the network.

<details markdown="1"><summary><b>Technical details</b></summary>

netsettings.json replicated network+PSK store

</details>


### `playstatemanager_schema`

The fields of the play-state manager page on the diagnostics site. It is the component's own view of who's playing what where, exposed for debugging group playback issues.

<details markdown="1"><summary><b>Technical details</b></summary>

/status page

</details>


### `renderingcontrol_status_schema`

The fields on the diagnostics page for the volume and tone service. It is the player's internal view of channel volumes, mutes, EQ values, and flags, exposed for support and debugging.

<details markdown="1"><summary><b>Technical details</b></summary>

/status/renderingcontrol emitted XML

</details>


### `replicated_netsettings_schema`

The layout of the replicated network-settings document exchanged between players. It is the shared network config (including WiFi details) every household member keeps in sync, so any player can stand up the same network configuration.

<details markdown="1"><summary><b>Technical details</b></summary>

netsettings replicated XML

</details>


### `savedqueues_rsq_schema`

The file format of the saved-queues store on disk, meaning how Sonos playlists are actually persisted on the speaker. It is the record structure that survives reboots, written by the queue-backup commands.

<details markdown="1"><summary><b>Technical details</b></summary>

savedqueues.rsq persistence

</details>


### `services_xml_schema`

The layout of the replicated services list: the document describing which music services exist on the household that all players share, so every speaker sees the same service catalog.

<details markdown="1"><summary><b>Technical details</b></summary>

replicated services list XML

</details>


### `shares_schema`

The layout of the replicated share registry: the document listing your music-library folders that all household players keep a copy of, so every speaker can index and play from the same shares.

<details markdown="1"><summary><b>Technical details</b></summary>

replicated share registry XML

</details>


### `sounddevice_status_schema`

The fields of the SoundDevice diagnostics page, which is per-zone audio bookkeeping: each player's volume, ducking state, and output details as the player reports them internally.

<details markdown="1"><summary><b>Technical details</b></summary>

SoundDevice page (per-zone volume/ducking)

</details>


### `update_info_schema`

The fields of the update-info diagnostics page: what the player reports about its firmware status, covering current version, what updates are pending or downloading, and update history.

<details markdown="1"><summary><b>Technical details</b></summary>

UpdateInfo page

</details>


### `userradio_schema`

The layout of the user-radio favorites file: the document storing your saved radio stations, plus the delta-file format used to apply incremental changes without rewriting the whole list.

<details markdown="1"><summary><b>Technical details</b></summary>

userradio.xml (+.d.xml delta) replicated favorites

</details>


### `vli_state_snapshot`

The snapshot recorded when a virtual line-in session changes state: the fields captured at transitions so the session can be handed off or resumed, covering source, coordinator, and transport settings at that moment.

<details markdown="1"><summary><b>Technical details</b></summary>

VLI handoff snapshot recorded at state transitions

</details>


### `zone_group_state_schema`

The layout of the household-map document, which is the same ZoneGroupState the topology service emits: every player, room, group, and coordinator, structured so any device can parse the whole system's shape.

<details markdown="1"><summary><b>Technical details</b></summary>

evented ZoneGroupState XML emitted by topology_base

</details>


### `zoneplayers_status_schema`

The fields of the ZonePlayers diagnostics page: the player's internal census of every speaker it knows about, including IDs, rooms, versions, and addresses, exposed for debugging.

<details markdown="1"><summary><b>Technical details</b></summary>

/status ZonePlayers page

</details>


### `zp_support_info`

The layout of the support-information bundle: the structured data gathered when you submit diagnostics, covering versions, hardware details, state, and configuration, packaged so Sonos support can read it.

<details markdown="1"><summary><b>Technical details</b></summary>

ZPSupportInfo schema

</details>


### `zpinfo_schema`

The layout of the player's self-description documents: the fields a speaker publishes about itself, covering identity, device info, and play-mode capabilities, used by the rest of the household to recognize it.

<details markdown="1"><summary><b>Technical details</b></summary>

ZPInfo + DeviceInfo + Playmode

</details>


### `zps_page`

The fields of the household update-status page: the diagnostics view showing each player's update state during a rollout, covering who's updated, who's downloading, and who's pending or failed.

<details markdown="1"><summary><b>Technical details</b></summary>

household update status page fields

</details>

