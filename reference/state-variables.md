# State variables

State variables are the player's named properties - things like Volume, Mute, or the current track URI. 'Evented' means the player can push a live update to subscribers the moment the value changes; 'argument-type' variables exist only to declare the shape of command inputs and outputs and are not device state.

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

Bumps when alarms change — re-fetch the list on change.

<details markdown="1"><summary><b>Technical details</b></summary>

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AC.DateFormat`

Household date format preference, replicated like TimeFormat.

<details markdown="1"><summary><b>Technical details</b></summary>

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeFormat`

Household time format — 12h vs 24h, shared across zones via the replicated DesiredTimeFormat.

<details markdown="1"><summary><b>Technical details</b></summary>

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeGeneration`

A generation counter that changes whenever household time settings change — the cheap way to detect clock config updates.

<details markdown="1"><summary><b>Technical details</b></summary>

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeServer`

Configured time source — the household SNTP setup.

<details markdown="1"><summary><b>Technical details</b></summary>

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AI.IRRepeaterState`

IR-repeater state on AudioIn-capable hardware.

<details markdown="1"><summary><b>Technical details</b></summary>

AudioIn evented variable; emitted by f_10243170 e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AI.TOSLinkConnected`

Whether the optical input has signal (AudioIn).

<details markdown="1"><summary><b>Technical details</b></summary>

AudioIn evented variable; emitted by f_10243170 e:property dump.

</details>

- form: `<e:property><NAME>value</e:property>`

### `AVT.AVTransportURI`

The URI of the current source — what you set with SetAVTransportURI. Not always the same as the playing track (queue vs stream).

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.AVTransportURIMetaData`

DIDL metadata for the transport URI itself (vs the current track's metadata) — the container/session description rather than the item playing.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentCrossfadeMode`

The active crossfade duration between tracks (seconds), mirroring SetCrossfadeMode. Evented in LastChange so controllers update the UI live.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentMediaDuration`

Duration of the current media object (vs the current track) — differs when the container outlives individual items, e.g., a radio stream that never ends.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentPlayMode`

Shuffle/repeat mode — NORMAL, SHUFFLE_NOREPEAT, REPEAT_ALL etc.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentRecordQualityMode`

Current record quality — conformance field, unused on a renderer.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentSection`

The current section within a multi-section container — used by services that split content into logical parts.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrack`

1-based index of the playing track in the queue.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackDuration`

Length of the current track (H:MM:SS).

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackMetaData`

DIDL-Lite metadata for the playing track — title/artist/album/art. Arrives inside LastChange events; parse the XML inside the val attribute.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackURI`

The URI of the current track — e.g. a stream URL or x-rincon-queue ref.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTransportActions`

Which transport ops are valid right now (Play, Pause, Seek, Next...) — drive your UI's enabled buttons from this.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NextAVTransportURI`

The URI scheduled to load when the current transport finishes — set by NextAVTransportURI in the gapless model. Sonos queues largely bypass it via x-rincon-queue.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NextAVTransportURIMetaData`

Metadata paired with NextAVTransportURI — gapless next-item info.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NumberOfTracks`

How many tracks are in the current queue/transport.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PlaybackStorageMedium`

Where the current media came from — NETWORK, the queue, a service stream, etc. Mostly informational; rarely drives client logic.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossiblePlaybackStorageMedia`

The list of media the renderer can play from — the storage-medium enum for conformance.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NONE, NETWORK

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossibleRecordQualityModes`

Record quality modes — conformance field, unused on a renderer.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossibleRecordStorageMedia`

Record-capable media list — conformance field, empty/none on a renderer.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.RecordMediumWriteStatus`

Write status of the record medium — conformance field, irrelevant on a renderer.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.RecordStorageMedium`

Record-capable medium — present for UPnP-AV conformance; this renderer doesn't record, so it's effectively a fixed value.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorDescription`

Human-readable description paired with a TransportError event — the 'why' text for stream failures.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorHttpCode`

HTTP status when a stream fetch failed — useful for diagnosing why playback stopped.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorHttpHeaders`

The HTTP headers captured on a transport-level HTTP failure — invaluable for debugging dead streams since it preserves the server's actual response.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorURI`

The URI that produced the current transport error — which stream failed.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportPlaySpeed`

Playback speed — normally 1; other values indicate trick-play modes. On this stack it's effectively always '1' for real sources.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportState`

The player's transport state — PLAYING, PAUSED_PLAYBACK, STOPPED, TRANSITIONING. This is the first thing most clients subscribe to.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportStatus`

OK or an error indicator for the current transport operation.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:AlarmRunning`

True while an alarm is sounding.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:CurrentValidPlayModes`

Sonos extension: the play modes currently valid for this source — which of NORMAL/SHUFFLE/REPEAT/REPEAT_ONE the UI should offer right now. Changes with source type.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlAccountID`

Sonos extension: which service account owns the active direct-control session — identifies whose Connect session is attached.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlClientID`

When a service has direct control (Spotify Connect etc.), this is the controlling client's ID.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlIsSuspended`

Sonos extension: direct control (e.g., Spotify Connect targeting the group) is currently suspended — the session exists but isn't driving playback.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:EnqueuedTransportURI`

The URI that was originally queued — differs from AVTransportURI when the source resolved to something else (e.g. queue → stream).

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:EnqueuedTransportURIMetaData`

Sonos extension: the DIDL metadata for EnqueuedTransportURI — what's queued up, so controllers can show it without a second lookup.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:NextTrackMetaData`

Sonos extension: DIDL for the next track — paired with r:NextTrackURI.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:NextTrackURI`

Sonos extension: the next track's URI in the queue — for 'up next' display without parsing the whole queue.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:RestartPending`

Sonos extension: a restart of the transport is pending — the engine will resume playback after an internal reset. Clients should treat it as 'transient, don't alarm the user'.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:SleepTimerGeneration`

Bumps whenever a sleep timer is set/changed — watch it to keep timer UI in sync.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport evented variable (r: prefix = rincon/Sonos extension).

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:SnoozeRunning`

True while a snoozed alarm is pending.

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

non-evented AVTransport state variable — read via action out-args, not pushed

</details>

- related actions: `GetPositionInfo`

### `AVTransport.AbsoluteTimePosition`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable — read via action out-args, not pushed

</details>

- related actions: `GetPositionInfo`

### `AVTransport.AlarmIDRunning`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable — read via action out-args, not pushed

</details>

- related actions: `GetRunningAlarmProperties`, `RunAlarm`

### `AVTransport.AlarmLoggedStartTime`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable — read via action out-args, not pushed

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

evented state variable — appears in AVTransport LastChange/GENA event notifications

</details>


### `AVTransport.MuseSessions`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable — read via action out-args, not pushed

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

non-evented AVTransport state variable — read via action out-args, not pushed

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

non-evented AVTransport state variable — read via action out-args, not pushed

</details>

- related actions: `GetPositionInfo`

### `AVTransport.RelativeTimePosition`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented AVTransport state variable — read via action out-args, not pushed

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

evented state variable — appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `ListAlarms`

### `AlarmClock.DailyIndexRefreshTime`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetDailyIndexRefreshTime`, `SetDailyIndexRefreshTime`

### `AlarmClock.DateFormat`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetFormat`, `SetFormat`

### `AlarmClock.TimeFormat`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetFormat`, `SetFormat`

### `AlarmClock.TimeGeneration`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetTimeNow`

### `AlarmClock.TimeServer`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AlarmClock LastChange/GENA event notifications

</details>

- related actions: `GetTimeServer`, `SetTimeServer`

### `AlarmClock.TimeZone`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AlarmClock LastChange/GENA event notifications

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

evented state variable — appears in AudioIn LastChange/GENA event notifications

</details>

- related actions: `GetAudioInputAttributes`, `SetAudioInputAttributes`

### `AudioIn.Icon`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AudioIn LastChange/GENA event notifications

</details>

- related actions: `GetAudioInputAttributes`, `SetAudioInputAttributes`

### `AudioIn.LeftLineInLevel`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AudioIn LastChange/GENA event notifications

</details>

- related actions: `GetLineInLevel`, `SetLineInLevel`

### `AudioIn.LineInConnected`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AudioIn LastChange/GENA event notifications

</details>


### `AudioIn.Playing`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AudioIn LastChange/GENA event notifications

</details>


### `AudioIn.RightLineInLevel`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in AudioIn LastChange/GENA event notifications

</details>

- related actions: `GetLineInLevel`, `SetLineInLevel`

### `CD.ContainerUpdateIDs`

Per-container update ids — the standard UPnP change signal for browse caches.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_103035c4

</details>


### `CD.FavoritesUpdateID`

Bumps whenever Sonos Favorites change — re-browse FV:2 when you see this.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_10303de4

</details>


### `CD.RadioFavoritesUpdateID`

Bumps when saved radio favorites change.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_10303de4

</details>


### `CD.SavedQueuesUpdateID`

Bumps when Sonos Playlists (saved queues) change.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_10303de4

</details>


### `CD.ShareIndexInProgress`

True while the library index is rebuilding — browsing shares may be incomplete.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_103035c4

</details>


### `CD.ShareListUpdateID`

Bumps when the local music-library share list changes.

<details markdown="1"><summary><b>Technical details</b></summary>

ContentDirectory evented variable in f_10303de4

</details>


### `CM.CurrentConnectionIDs`

The ConnectionManager's active connection id list — almost always '0' on this renderer since there's one logical input path.

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

evented state variable — appears in ConnectionManager LastChange/GENA event notifications

</details>

- related actions: `GetCurrentConnectionIDs`

### `ConnectionManager.SinkProtocolInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ConnectionManager LastChange/GENA event notifications

</details>

- related actions: `GetProtocolInfo`

### `ConnectionManager.SourceProtocolInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ConnectionManager LastChange/GENA event notifications

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

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>

- related actions: `GetBrowseable`, `SetBrowseable`

### `ContentDirectory.ContainerUpdateIDs`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.FavoritesUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.RadioFavoritesUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.RadioLocationUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.RecentlyPlayedUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.SavedQueuesUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.SearchCapabilities`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented ContentDirectory state variable — read via action out-args, not pushed

</details>

- related actions: `GetSearchCapabilities`

### `ContentDirectory.ShareIndexInProgress`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>

- related actions: `GetShareIndexInProgress`

### `ContentDirectory.ShareIndexLastError`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.ShareListUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>


### `ContentDirectory.SortCapabilities`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented ContentDirectory state variable — read via action out-args, not pushed

</details>

- related actions: `GetSortCapabilities`

### `ContentDirectory.SystemUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>

- related actions: `GetSystemUpdateID`

### `ContentDirectory.UserRadioUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

</details>


### `DP.CurrentZoneName`

The room name — 'ZoneNameChangedEvent' fires on rename.

<details markdown="1"><summary><b>Technical details</b></summary>

DeviceProperties evented variable (ZoneNameChangedEvent)

</details>


### `DP.Invisible`

Whether the player is hidden from room lists.

<details markdown="1"><summary><b>Technical details</b></summary>

DeviceProperties evented variable (DeviceInfo attr literal)

</details>


### `DP.MicEnabled`

Whether the microphone is enabled (on voice-capable hardware).

<details markdown="1"><summary><b>Technical details</b></summary>

DeviceProperties evented variable (DeviceInfo attr literal)

</details>


### `DP.ResetVolumeAfter`

DeviceProperties flag: volume resets to a default after playback/grouping changes — used by fixed-volume and demo behaviors.

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

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.AlexaCBLSupported`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.AutoplayIncludeLinkedZones`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetAutoplayLinkedZones`, `SetAutoplayLinkedZones`

### `DeviceProperties.AutoplayRoomUUID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetAutoplayRoomUUID`, `SetAutoplayRoomUUID`

### `DeviceProperties.AutoplaySource`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetAutoplayLinkedZones`, `GetAutoplayRoomUUID`, `GetAutoplayVolume`, `GetUseAutoplayVolume`, `SetAutoplayLinkedZones`, `SetAutoplayRoomUUID`, `SetAutoplayVolume`, `SetUseAutoplayVolume`

### `DeviceProperties.AutoplayUseVolume`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetUseAutoplayVolume`, `SetUseAutoplayVolume`

### `DeviceProperties.AutoplayVolume`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `GetAutoplayVolume`, `SetAutoplayVolume`

### `DeviceProperties.AvailableRoomCalibration`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.BehindWifiExtender`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.ButtonLockState`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetButtonLockState`, `SetButtonLockState`

### `DeviceProperties.ChannelFreq`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.ChannelMapSet`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `AddBondedZones`, `CreateStereoPair`, `RemoveBondedZones`, `SeparateStereoPair`

### `DeviceProperties.ConfigMode`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `EnterConfigMode`

### `DeviceProperties.Configuration`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.ConnectionType`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.CopyrightInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.DisplaySoftwareVersion`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.EthLink`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.ExtraInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.Flags`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.HTAudioIn`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.HTBondedZoneCommitState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.HTSatChanMapSet`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `AddHTSatellite`

### `DeviceProperties.HardwareVersion`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.HasConfiguredSSID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.HdmiCecAvailable`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.HouseholdID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetHouseholdID`

### `DeviceProperties.IPAddress`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.Icon`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.Invisible`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.IsIdle`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.IsZoneBridge`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.KeepGrouped`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `RemoveBondedZones`

### `DeviceProperties.LEDState`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetLEDState`, `SetLEDState`

### `DeviceProperties.LastChangedPlayState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.MACAddress`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.MicEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.MoreInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.Orientation`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.RoomCalibrationState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.SatRoomUUID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `RemoveHTSatellite`

### `DeviceProperties.SecureRegState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.SerialNumber`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.SettingsReplicationState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.SoftwareVersion`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneInfo`

### `DeviceProperties.SupportsAudioClip`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.SupportsAudioIn`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.SvcActive`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.TVConfigurationError`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.TargetRoomName`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented DeviceProperties state variable — read via action out-args, not pushed

</details>

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.VoiceConfigState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.WifiEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.WirelessMode`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>


### `DeviceProperties.ZoneName`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

</details>

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `GM.DelegatedGroupCoordinatorID`

When control is delegated, the acting coordinator's ID.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupManagement evented variable (event-pool literal)

</details>


### `GM.LocalGroupUUID`

This player's group UUID — which group it currently belongs to.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupManagement evented variable (event-pool literal)

</details>


### `GM.VirtualLineInGroupID`

The group hosting virtual line-in — which group a VLI source belongs to.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupManagement evented variable (setVirtualLineInGroupIDLocked worker)

</details>


### `GRC.GroupMute`

Group mute — coordinator-level.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupRenderingControl evented variable (SetGroupMute rc-log literal)

</details>


### `GRC.GroupVolume`

The whole group's volume — settable only on the group coordinator.

<details markdown="1"><summary><b>Technical details</b></summary>

GroupRenderingControl evented variable (SetGroupVolume rc-log literal)

</details>


### `GRC.GroupVolumeChangeable`

Whether group volume is adjustable right now.

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

evented state variable — appears in GroupManagement LastChange/GENA event notifications

</details>


### `GroupManagement.LocalGroupUUID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in GroupManagement LastChange/GENA event notifications

</details>

- related actions: `AddMember`

### `GroupManagement.ResetVolumeAfter`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in GroupManagement LastChange/GENA event notifications

</details>

- related actions: `AddMember`

### `GroupManagement.SourceAreaIds`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented GroupManagement state variable — read via action out-args, not pushed

</details>

- related actions: `SetSourceAreaIds`

### `GroupManagement.VirtualLineInGroupID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in GroupManagement LastChange/GENA event notifications

</details>


### `GroupManagement.VolumeAVTransportURI`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in GroupManagement LastChange/GENA event notifications

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

evented state variable — appears in GroupRenderingControl LastChange/GENA event notifications

</details>

- related actions: `GetGroupMute`, `SetGroupMute`

### `GroupRenderingControl.GroupVolume`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in GroupRenderingControl LastChange/GENA event notifications

</details>

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `GetGroupVolume`, `SetGroupVolume`, `SetRelativeGroupVolume`

### `GroupRenderingControl.GroupVolumeChangeable`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in GroupRenderingControl LastChange/GENA event notifications

</details>


### `HT.LEDFeedbackState`

LED feedback state for HT control ops.

<details markdown="1"><summary><b>Technical details</b></summary>

HTControl evented variable in f_10739c34

</details>


### `HT.RemoteConfigured`

Whether the TV remote is configured (HTControl).

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

evented state variable — appears in HTControl LastChange/GENA event notifications

</details>

- related actions: `GetIRRepeaterState`, `SetIRRepeaterState`

### `HTControl.LEDFeedbackState`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented HTControl state variable — read via action out-args, not pushed

</details>

- related actions: `GetLEDFeedbackState`, `SetLEDFeedbackState`

### `HTControl.RemoteConfigured`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented HTControl state variable — read via action out-args, not pushed

</details>

- related actions: `IsRemoteConfigured`

### `HTControl.TOSLinkConnected`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in HTControl LastChange/GENA event notifications

</details>


### `MS.ServiceListVersion`

Bumps when the music-service list changes — re-read GetAvailableServices.

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

non-evented MusicServices state variable — read via action out-args, not pushed

</details>

- related actions: `GetSessionId`

### `MusicServices.ServiceListVersion`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in MusicServices LastChange/GENA event notifications

</details>

- related actions: `ListAvailableServices`

### `MusicServices.SessionId`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented MusicServices state variable — read via action out-args, not pushed

</details>

- related actions: `GetSessionId`

### `MusicServices.Username`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented MusicServices state variable — read via action out-args, not pushed

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

Whether the queue is service-curated (cloud-queue playlists mark this).

<details markdown="1"><summary><b>Technical details</b></summary>

curated-queue flag

</details>


### `Queue.LastChange`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in Queue LastChange/GENA event notifications

</details>


### `Queue.QueueID`

Opaque queue identifier for the Queue events channel (a Sonos-proprietary event namespace).

<details markdown="1"><summary><b>Technical details</b></summary>

queue identifier assigned at AttachQueue/CreateQueue

</details>


### `Queue.QueueOwnerID`

Identifies what currently owns the queue — the service or session that populated it. Lets a client tell 'the user's queue' from 'a service-pushed cloud queue'.

<details markdown="1"><summary><b>Technical details</b></summary>

queue owner UDN

</details>


### `Queue.UpdateID`

Queue version — increments on every queue edit; use it for change detection.

<details markdown="1"><summary><b>Technical details</b></summary>

queue content update id

</details>


### `RCS.AudioDelay`

Lip-sync offset — delay applied to align audio with video.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.AudioDelayLeftRear`

Lip-sync delay for the left rear channel, in ms — compensates satellite latency in bonded home-theater setups.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.AudioDelayRightRear`

Lip-sync delay for the right rear channel — the paired setting to AudioDelayLeftRear.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Bass`

Bass EQ level (-10..10).

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.DialogLevel`

Speech-enhancement/dialog level — HT feature.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.HeightChannelLevel`

Level trim for height/up-firing channels on models that have them — part of the HT tuning set.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Loudness`

Loudness compensation on/off.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.MusicSurroundLevel`

How much ambient/surround processing applies to music playback specifically — separate from TV surround tuning.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Mute`

Mute state per channel — '1'/'0'.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.NightMode`

Night mode (DRC compression) state — HT feature.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.OutputFixed`

Fixes the player's output at full level so an external amplifier controls volume. When on, SetVolume requests are ignored — the app shows 'volume fixed'. Read it before sending volume commands to a bonded or amped zone.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.PresetNameList`

EQ preset names — includes 'FactoryDefaults' used by factory reset.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SonarCalibrationAvailable`

Whether sonar-based calibration is offered — a capability flag the app checks before showing the calibration flow.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SonarEnabled`

Whether Trueplay/sonar calibration is active on this player.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SpeakerSize`

Configured speaker size tag used by DSP tuning (satellite vs full-range). Written during bonded-group setup; affects crossover and bass handling rather than anything a client sets directly.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SpeechEnhanceEnabled`

Speech/dialog enhancement toggle — boosts the dialog band via the DAP config. The app's 'speech enhancement' switch maps here.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubCrossover`

The low-pass crossover frequency used when a Sub is bonded — where mains hand bass to the subwoofer. Updated when Trueplay or manual tuning changes the blend.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubEnabled`

Whether the bonded Sub is enabled in the group. Toggling routes low frequencies back to the mains without unbonding.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubGain`

Sub output level — only on setups with a bonded Sub.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubPolarity`

Subwoofer polarity (normal/inverted) for bonded Subs — set during tuning to align the sub's phase with the mains. A mis-set value sounds like missing bass.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SupportsMaxDialogLevel`

Capability flag advertising that this model supports maximum dialog level — clients gate the dialog-level control on it.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundEnabled`

Whether bonded surrounds are active.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundLevel`

Surround speaker level.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundMode`

The surround processing mode currently active — how stereo/HT input maps onto the bonded channel set.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Treble`

Treble EQ level (-10..10).

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl evented variable; emit-literal at RCS template

</details>

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Volume`

The player's volume (0-100-ish; Master channel). Subscribe for slider UIs.

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

non-evented RenderingControl state variable — read via action out-args, not pushed

</details>

- related actions: `GetEQ`, `SetEQ`

### `RenderingControl.HeadphoneConnected`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable — read via action out-args, not pushed

</details>

- related actions: `GetHeadphoneConnected`

### `RenderingControl.HeightChannelLevel`

<details markdown="1"><summary><b>Technical details</b></summary>

height/Atmos channel output level

</details>


### `RenderingControl.LastChange`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in RenderingControl LastChange/GENA event notifications

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

non-evented RenderingControl state variable — read via action out-args, not pushed

</details>

- related actions: `GetRoomCalibrationStatus`

### `RenderingControl.RoomCalibrationBondedZoneInfo`

<details markdown="1"><summary><b>Technical details</b></summary>

bonded-zone calibration info

</details>


### `RenderingControl.RoomCalibrationCalibrationMode`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable — read via action out-args, not pushed

</details>


### `RenderingControl.RoomCalibrationCoefficients`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable — read via action out-args, not pushed

</details>


### `RenderingControl.RoomCalibrationEnabled`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable — read via action out-args, not pushed

</details>

- related actions: `GetRoomCalibrationStatus`, `SetRoomCalibrationStatus`

### `RenderingControl.RoomCalibrationID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented RenderingControl state variable — read via action out-args, not pushed

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

non-evented RenderingControl state variable — read via action out-args, not pushed

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

non-evented RenderingControl state variable — read via action out-args, not pushed

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

evented state variable — appears in SystemProperties LastChange/GENA event notifications

</details>


### `SystemProperties.ThirdPartyHash`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in SystemProperties LastChange/GENA event notifications

</details>


### `SystemProperties.UpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in SystemProperties LastChange/GENA event notifications

</details>


### `SystemProperties.UpdateIDX`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in SystemProperties LastChange/GENA event notifications

</details>


### `SystemProperties.VoiceUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in SystemProperties LastChange/GENA event notifications

</details>


### `VirtualLineIn.AVTransportURIMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented VirtualLineIn state variable — read via action out-args, not pushed

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

evented state variable — appears in VirtualLineIn LastChange/GENA event notifications

</details>


### `VirtualLineIn.CurrentTransportActions`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented VirtualLineIn state variable — read via action out-args, not pushed

</details>


### `VirtualLineIn.EnqueuedTransportURIMetaData`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented VirtualLineIn state variable — read via action out-args, not pushed

</details>


### `ZGT.ZoneGroupState`

The full household topology document — every zone, its coordinator, members and names. The topological ground truth; subscribe to it for 'what's grouped with what'.

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

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.AreasUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.AvailableSoftwareUpdate`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.DiagnosticID`

<details markdown="1"><summary><b>Technical details</b></summary>

non-evented ZoneGroupTopology state variable — read via action out-args, not pushed

</details>

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.MuseHouseholdId`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.NetsettingsUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.SourceAreasUpdateID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.ThirdPartyMediaServersX`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>


### `ZoneGroupTopology.ZoneGroupID`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.ZoneGroupName`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.ZoneGroupState`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>

- related actions: `GetZoneGroupState`

### `ZoneGroupTopology.ZonePlayerUUIDsInGroup`

<details markdown="1"><summary><b>Technical details</b></summary>

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

</details>

- related actions: `GetZoneGroupAttributes`

### `alarm_status_schema`

The `/status/alarm` XML schema: the full alarm list with ids, times, rooms, programs, and enabled flags — the same data ListAlarms returns, rendered as a status page.

<details markdown="1"><summary><b>Technical details</b></summary>

/status/alarm emitted XML

</details>


### `avt_lastchange`

The AVTransport LastChange schema: every field that can appear in the evented document — standard UPnP vars plus the `r:` Sonos extensions (enqueue info, direct-control state, sleep/alarm fields, restart flags). This is the complete list of what a subscriber can see change.

<details markdown="1"><summary><b>Technical details</b></summary>

AVTransport LastChange evented fields

</details>


### `device_props_extra_vars`

Additional DeviceProperties state variables beyond the standard set — internal counters and flags surfaced for diagnostics.

<details markdown="1"><summary><b>Technical details</b></summary>

more state vars

</details>


### `device_props_update_ids`

The update-counter variables in DeviceProperties — bump-on-change ids for config sections, letting subscribers detect changes without full re-reads.

<details markdown="1"><summary><b>Technical details</b></summary>

update counters

</details>


### `ht_input_session`

The HT input-session telemetry schema (zpHTInputSession): correlation id, connection type, coordinator identity, durations, input format, content type — the record each TV-audio session produces.

<details markdown="1"><summary><b>Technical details</b></summary>

HT input-session telemetry fields

</details>


### `netsettings_schema`

The netsettings.json schema: the replicated network store — Wi-Fi config, SonosNet settings, and the PSK hierarchy — versioned and checksum-protected.

<details markdown="1"><summary><b>Technical details</b></summary>

netsettings.json replicated network+PSK store

</details>


### `playstatemanager_schema`

The `/status` page schema for the play-state manager: which sources exist, their states, and the transitions the manager is tracking — the internal view behind 'what's playing and why'.

<details markdown="1"><summary><b>Technical details</b></summary>

/status page

</details>


### `renderingcontrol_status_schema`

The XML schema of the `/status/renderingcontrol` page: current volume/mute/EQ levels per zone as the engine sees them — what you'd diff against RenderingControl events when a client seems out of sync.

<details markdown="1"><summary><b>Technical details</b></summary>

/status/renderingcontrol emitted XML

</details>


### `replicated_netsettings_schema`

The netsettings replication schema: the XML/JSON that carries network config and PSK material between household members — versioned so a mismatch triggers resync.

<details markdown="1"><summary><b>Technical details</b></summary>

netsettings replicated XML

</details>


### `savedqueues_rsq_schema`

The savedqueues.rsq file schema: gzipped XML with LastUpdateDevice/Version/Next headers and per-queue SavedQueue entries — the on-disk form of 'Sonos playlists'.

<details markdown="1"><summary><b>Technical details</b></summary>

savedqueues.rsq persistence

</details>


### `services_xml_schema`

The replicated services XML schema: the available-services list (musicservices.xml) with descriptor refs and versions — the household's shared SMAPI registry.

<details markdown="1"><summary><b>Technical details</b></summary>

replicated services list XML

</details>


### `shares_schema`

The replicated share registry schema: the `<Shares>` document with each share's path, credentials-ref, id, and verified-protocol flag — what the indexer reads and what replicates between players.

<details markdown="1"><summary><b>Technical details</b></summary>

replicated share registry XML

</details>


### `sounddevice_status_schema`

The SoundDevice page schema: per-zone volume, ducking state, and output-device status — the hardware-side view behind RenderingControl.

<details markdown="1"><summary><b>Technical details</b></summary>

SoundDevice page (per-zone volume/ducking)

</details>


### `update_info_schema`

The UpdateInfo page schema: current firmware version, SWGen, compatibility floor, and update availability — the device's own view of its software state.

<details markdown="1"><summary><b>Technical details</b></summary>

UpdateInfo page

</details>


### `userradio_schema`

The userradio.xml schema (plus the .d.xml delta variant): replicated user-radio favorites — station lists that follow the household rather than a single player.

<details markdown="1"><summary><b>Technical details</b></summary>

userradio.xml (+.d.xml delta) replicated favorites

</details>


### `vli_state_snapshot`

The VirtualLineIn state snapshot: the record captured at session transitions (source, target, delegation state) — what survives a handoff so a VLI session can resume on a new owner.

<details markdown="1"><summary><b>Technical details</b></summary>

VLI handoff snapshot recorded at state transitions

</details>


### `zone_group_state_schema`

The ZoneGroupState document schema: the complete household map — groups, coordinators, members, vanished and quarantined devices, and embedded MediaServers account records — as evented by ZoneGroupTopology.

<details markdown="1"><summary><b>Technical details</b></summary>

evented ZoneGroupState XML emitted by topology_base

</details>


### `zoneplayers_status_schema`

The `/status` ZonePlayers page schema: every discovered player's attributes — useful for seeing what this device thinks the rest of the household looks like.

<details markdown="1"><summary><b>Technical details</b></summary>

/status ZonePlayers page

</details>


### `zp_support_info`

The ZPSupportInfo schema: the bundle of device state support pulls for diagnostics — versions, network state, recent errors — emitted as structured XML.

<details markdown="1"><summary><b>Technical details</b></summary>

ZPSupportInfo schema

</details>


### `zpinfo_schema`

The ZPInfo schema: device identity (serial, MAC, version), DeviceInfo fields, and Playmode state — the composite record `/status/zpinfo` emits.

<details markdown="1"><summary><b>Technical details</b></summary>

ZPInfo + DeviceInfo + Playmode

</details>


### `zps_page`

The `/status` household-update page fields: update status, pending versions, and per-device state — the page that shows how a rollout is progressing across the household.

<details markdown="1"><summary><b>Technical details</b></summary>

household update status page fields

</details>

