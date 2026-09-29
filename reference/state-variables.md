# State variables

Evented variables carry `<NAME val="..."/>` elements inside `LastChange` documents; `A_ARG_TYPE_*` variables are SCPD argument-type declarations, not device state.

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
| `alarm_status_schema` | /AlarmClock/Control |  | ? | `strong` |
| `avt_lastchange` | /MediaRenderer/AVTransport/Event |  | ? | `strong` |
| `device_props_extra_vars` | /DeviceProperties/Control |  | ? | `strong` |
| `device_props_update_ids` | /DeviceProperties/Control |  | ? | `strong` |
| `netsettings_schema` | ReplicatedNetSettings |  | ? | `strong` |
| `playstatemanager_schema` | internal |  | ? | `strong` |
| `renderingcontrol_status_schema` | /MediaRenderer/RenderingControl/Control |  | ? | `strong` |
| `replicated_netsettings_schema` | settings replication |  | ? | `strong` |
| `savedqueues_rsq_schema` | /MediaRenderer/Queue/Control |  | ? | `strong` |
| `services_xml_schema` | /MusicServices/Control |  | ? | `strong` |
| `shares_schema` | ContentDirectory |  | ? | `strong` |
| `sounddevice_status_schema` | /status |  | ? | `strong` |
| `update_info_schema` | /status |  | ? | `strong` |
| `userradio_schema` | favorites |  | ? | `strong` |
| `vli_state_snapshot` | VirtualLineIn |  | ? | `strong` |
| `zone_group_state_schema` | /ZoneGroupTopology/Control |  | ? | `strong` |
| `zoneplayers_status_schema` | /status |  | ? | `strong` |
| `zp_support_info` | /status support info |  | ? | `strong` |
| `zpinfo_schema` | mod_zp /status |  | ? | `strong` |
| `zps_page` | /ZPs |  | ? | `strong` |

### `AC.AlarmListVersion`

Bumps when alarms change — re-fetch the list on change.

**Technical description:**

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

- form: `<e:property><NAME>value</e:property>`

### `AC.DateFormat`

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeFormat`

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeGeneration`

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeServer`

Configured time source — the household SNTP setup.

**Technical description:**

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

- form: `<e:property><NAME>value</e:property>`

### `AI.IRRepeaterState`

IR-repeater state on AudioIn-capable hardware.

**Technical description:**

AudioIn evented variable; emitted by f_10243170 e:property dump.

- form: `<e:property><NAME>value</e:property>`

### `AI.TOSLinkConnected`

Whether the optical input has signal (AudioIn).

**Technical description:**

AudioIn evented variable; emitted by f_10243170 e:property dump.

- form: `<e:property><NAME>value</e:property>`

### `AVT.AVTransportURI`

The URI of the current source — what you set with SetAVTransportURI. Not always the same as the playing track (queue vs stream).

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.AVTransportURIMetaData`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentCrossfadeMode`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentMediaDuration`

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentPlayMode`

Shuffle/repeat mode — NORMAL, SHUFFLE_NOREPEAT, REPEAT_ALL etc.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentRecordQualityMode`

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentSection`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrack`

1-based index of the playing track in the queue.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackDuration`

Length of the current track (H:MM:SS).

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackMetaData`

DIDL-Lite metadata for the playing track — title/artist/album/art. Arrives inside LastChange events; parse the XML inside the val attribute.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTrackURI`

The URI of the current track — e.g. a stream URL or x-rincon-queue ref.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.CurrentTransportActions`

Which transport ops are valid right now (Play, Pause, Seek, Next...) — drive your UI's enabled buttons from this.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NextAVTransportURI`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NextAVTransportURIMetaData`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.NumberOfTracks`

How many tracks are in the current queue/transport.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PlaybackStorageMedium`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossiblePlaybackStorageMedia`

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NONE, NETWORK

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossibleRecordQualityModes`

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.PossibleRecordStorageMedia`

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.RecordMediumWriteStatus`

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.RecordStorageMedium`

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorDescription`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorHttpCode`

HTTP status when a stream fetch failed — useful for diagnosing why playback stopped.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorHttpHeaders`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportErrorURI`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportPlaySpeed`

AVTransport evented variable (r: prefix = rincon/Sonos extension). constant NOT_IMPLEMENTED

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportState`

The player's transport state — PLAYING, PAUSED_PLAYBACK, STOPPED, TRANSITIONING. This is the first thing most clients subscribe to.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.TransportStatus`

OK or an error indicator for the current transport operation.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:AlarmRunning`

True while an alarm is sounding.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:CurrentValidPlayModes`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlAccountID`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlClientID`

When a service has direct control (Spotify Connect etc.), this is the controlling client's ID.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:DirectControlIsSuspended`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:EnqueuedTransportURI`

The URI that was originally queued — differs from AVTransportURI when the source resolved to something else (e.g. queue → stream).

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:EnqueuedTransportURIMetaData`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:NextTrackMetaData`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:NextTrackURI`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:RestartPending`

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:SleepTimerGeneration`

Bumps whenever a sleep timer is set/changed — watch it to keep timer UI in sync.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVT.r:SnoozeRunning`

True while a snoozed alarm is pending.

**Technical description:**

AVTransport evented variable (r: prefix = rincon/Sonos extension).

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `AVTransport.AVTransportURI`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.AVTransportURIMetaData`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.A_ARG_TYPE_AlarmIncludeLinkedZones`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RunAlarm`, `StartAutoplay`

### `AVTransport.A_ARG_TYPE_AlarmState`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_AlarmVolume`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RunAlarm`, `StartAutoplay`

### `AVTransport.A_ARG_TYPE_ClearSource`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `DelegateGroupCoordinationTo`

### `AVTransport.A_ARG_TYPE_CurrentAVTransportURI`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ChangeCoordinator`, `ChangeTransportSettings`

### `AVTransport.A_ARG_TYPE_EnqueueAsNext`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`

### `AVTransport.A_ARG_TYPE_GroupID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeCoordinatorOfStandaloneGroup`, `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`, `GetRunningAlarmProperties`

### `AVTransport.A_ARG_TYPE_ISO8601Time`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ConfigureSleepTimer`, `GetRemainingSleepTimerDuration`, `RunAlarm`, `SnoozeAlarm`

### `AVTransport.A_ARG_TYPE_InstanceID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `BackupQueue`, `BecomeCoordinatorOfStandaloneGroup`, `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`, `ChangeCoordinator`, `ChangeTransportSettings`, `ConfigureSleepTimer`, `CreateSavedQueue`, `DelegateGroupCoordinationTo`, `EndDirectControlSession`, `GetCrossfadeMode`, `GetCurrentTransportActions`, `GetDeviceCapabilities`, `GetMediaInfo`, `GetPositionInfo`, `GetRemainingSleepTimerDuration`, `GetRunningAlarmProperties`, `GetTransportInfo`, `GetTransportSettings`, `Next`, `NotifyDeletedURI`, `Pause`, `Play`, `Previous`, `RemoveAllTracksFromQueue`, `RemoveTrackFromQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`, `ReorderTracksInSavedQueue`, `RunAlarm`, `SaveQueue`, `Seek`, `SetAVTransportURI`, `SetCrossfadeMode`, `SetNextAVTransportURI`, `SetPlayMode`, `SnoozeAlarm`, `StartAutoplay`, `Stop`

### `AVTransport.A_ARG_TYPE_LIST_URI`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIsToQueue`

### `AVTransport.A_ARG_TYPE_LIST_URIMetaData`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIsToQueue`

### `AVTransport.A_ARG_TYPE_MemberID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`, `ChangeCoordinator`, `DelegateGroupCoordinationTo`

### `AVTransport.A_ARG_TYPE_MemberList`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_NumTracks`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`, `ReorderTracksInSavedQueue`

### `AVTransport.A_ARG_TYPE_NumTracksChange`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ReorderTracksInSavedQueue`

### `AVTransport.A_ARG_TYPE_ObjectID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddURIToSavedQueue`, `CreateSavedQueue`, `RemoveTrackFromQueue`, `ReorderTracksInSavedQueue`, `SaveQueue`

### `AVTransport.A_ARG_TYPE_PlayerID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeCoordinatorOfStandaloneGroup`

### `AVTransport.A_ARG_TYPE_Queue`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_RejoinGroup`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `DelegateGroupCoordinationTo`

### `AVTransport.A_ARG_TYPE_ResetVolumeAfter`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `StartAutoplay`

### `AVTransport.A_ARG_TYPE_RestartSink`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ChangeCoordinator`

### `AVTransport.A_ARG_TYPE_ResumePlayback`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_SavedQueueTitle`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateSavedQueue`, `SaveQueue`

### `AVTransport.A_ARG_TYPE_SeekMode`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Seek`

### `AVTransport.A_ARG_TYPE_SeekTarget`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Seek`

### `AVTransport.A_ARG_TYPE_SleepTimerState`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_SourceState`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_StreamRestartState`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeGroupCoordinator`, `BecomeGroupCoordinatorAndSource`

### `AVTransport.A_ARG_TYPE_TrackList`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ReorderTracksInSavedQueue`

### `AVTransport.A_ARG_TYPE_TrackNumber`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`

### `AVTransport.A_ARG_TYPE_TransportSettings`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeGroupCoordinator`, `ChangeCoordinator`, `ChangeTransportSettings`

### `AVTransport.A_ARG_TYPE_URI`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`

### `AVTransport.A_ARG_TYPE_URIMetaData`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIsToQueue`, `AddURIToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`

### `AVTransport.A_ARG_TYPE_VLIState`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BecomeGroupCoordinator`

### `AVTransport.AbsoluteCounterPosition`

non-evented AVTransport state variable — read via action out-args, not pushed

- related actions: `GetPositionInfo`

### `AVTransport.AbsoluteTimePosition`

non-evented AVTransport state variable — read via action out-args, not pushed

- related actions: `GetPositionInfo`

### `AVTransport.AlarmIDRunning`

non-evented AVTransport state variable — read via action out-args, not pushed

- related actions: `GetRunningAlarmProperties`, `RunAlarm`

### `AVTransport.AlarmLoggedStartTime`

non-evented AVTransport state variable — read via action out-args, not pushed

- related actions: `GetRunningAlarmProperties`, `RunAlarm`

### `AVTransport.AlarmRunning`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.CurrentCrossfadeMode`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.CurrentMediaDuration`

constant evented field

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.CurrentPlayMode`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.CurrentRecordQualityMode`

constant evented field

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.CurrentSection`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.CurrentTrack`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.CurrentTrackDuration`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.CurrentTrackMetaData`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.CurrentTrackURI`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.CurrentTransportActions`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.CurrentValidPlayModes`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.DirectControlAccountID`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.DirectControlClientID`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.DirectControlIsSuspended`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.EnqueuedTransportURI`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.EnqueuedTransportURIMetaData`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.LastChange`

evented state variable — appears in AVTransport LastChange/GENA event notifications


### `AVTransport.MuseSessions`

non-evented AVTransport state variable — read via action out-args, not pushed


### `AVTransport.NextAVTransportURI`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.NextAVTransportURIMetaData`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.NextTrackMetaData`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.NextTrackURI`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.NumberOfTracks`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.PlaybackStorageMedium`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.PossiblePlaybackStorageMedia`

constant evented field

- accepted values: `NONE, NETWORK`
- constant in this build

### `AVTransport.PossibleRecordQualityModes`

constant evented field

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.PossibleRecordStorageMedia`

constant evented field

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.QueueUpdateID`

non-evented AVTransport state variable — read via action out-args, not pushed

- related actions: `AddMultipleURIsToQueue`, `AddURIToSavedQueue`, `CreateSavedQueue`, `RemoveTrackFromQueue`, `RemoveTrackRangeFromQueue`, `ReorderTracksInQueue`, `ReorderTracksInSavedQueue`

### `AVTransport.RecordMediumWriteStatus`

constant evented field

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.RecordStorageMedium`

constant evented field

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.RelativeCounterPosition`

non-evented AVTransport state variable — read via action out-args, not pushed

- related actions: `GetPositionInfo`

### `AVTransport.RelativeTimePosition`

non-evented AVTransport state variable — read via action out-args, not pushed

- related actions: `GetPositionInfo`

### `AVTransport.RestartPending`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.SleepTimerGeneration`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.SnoozeRunning`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.TransportErrorDescription`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.TransportErrorHttpCode`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.TransportErrorHttpHeaders`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.TransportErrorURI`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.TransportPlaySpeed`

constant evented field

- accepted values: `NOT_IMPLEMENTED`
- constant in this build

### `AVTransport.TransportState`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AVTransport.TransportStatus`

evented transport state variable (r:-prefixed rincon extension where applicable)


### `AlarmClock.A_ARG_TYPE_AlarmEnabled`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateAlarm`, `DestroyAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmIncludeLinkedZones`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmList`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ListAlarms`

### `AlarmClock.A_ARG_TYPE_AlarmPlayMode`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmProgramMetaData`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmProgramURI`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmRoomUUID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmVolume`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_ISO8601Time`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateAlarm`, `GetHouseholdTimeAtStamp`, `GetTimeNow`, `SetTimeNow`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_Recurrence`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_TimeStamp`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetHouseholdTimeAtStamp`

### `AlarmClock.A_ARG_TYPE_TimeZoneAutoAdjustDst`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetTimeZone`, `GetTimeZoneAndRule`, `SetTimeZone`

### `AlarmClock.A_ARG_TYPE_TimeZoneIndex`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetTimeZone`, `GetTimeZoneAndRule`, `GetTimeZoneRule`, `SetTimeZone`

### `AlarmClock.A_ARG_TYPE_TimeZoneInformation`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `SetTimeNow`

### `AlarmClock.AlarmListVersion`

evented state variable — appears in AlarmClock LastChange/GENA event notifications

- related actions: `ListAlarms`

### `AlarmClock.DailyIndexRefreshTime`

evented state variable — appears in AlarmClock LastChange/GENA event notifications

- related actions: `GetDailyIndexRefreshTime`, `SetDailyIndexRefreshTime`

### `AlarmClock.DateFormat`

evented state variable — appears in AlarmClock LastChange/GENA event notifications

- related actions: `GetFormat`, `SetFormat`

### `AlarmClock.TimeFormat`

evented state variable — appears in AlarmClock LastChange/GENA event notifications

- related actions: `GetFormat`, `SetFormat`

### `AlarmClock.TimeGeneration`

evented state variable — appears in AlarmClock LastChange/GENA event notifications

- related actions: `GetTimeNow`

### `AlarmClock.TimeServer`

evented state variable — appears in AlarmClock LastChange/GENA event notifications

- related actions: `GetTimeServer`, `SetTimeServer`

### `AlarmClock.TimeZone`

evented state variable — appears in AlarmClock LastChange/GENA event notifications

- related actions: `GetTimeNow`, `GetTimeZoneAndRule`, `GetTimeZoneRule`

### `AudioIn.A_ARG_TYPE_MemberID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `StartTransmissionToGroup`, `StopTransmissionToGroup`

### `AudioIn.A_ARG_TYPE_ObjectID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `StartTransmissionToGroup`

### `AudioIn.A_ARG_TYPE_TransportSettings`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `StartTransmissionToGroup`

### `AudioIn.AudioInputName`

evented state variable — appears in AudioIn LastChange/GENA event notifications

- related actions: `GetAudioInputAttributes`, `SetAudioInputAttributes`

### `AudioIn.Icon`

evented state variable — appears in AudioIn LastChange/GENA event notifications

- related actions: `GetAudioInputAttributes`, `SetAudioInputAttributes`

### `AudioIn.LeftLineInLevel`

evented state variable — appears in AudioIn LastChange/GENA event notifications

- related actions: `GetLineInLevel`, `SetLineInLevel`

### `AudioIn.LineInConnected`

evented state variable — appears in AudioIn LastChange/GENA event notifications


### `AudioIn.Playing`

evented state variable — appears in AudioIn LastChange/GENA event notifications


### `AudioIn.RightLineInLevel`

evented state variable — appears in AudioIn LastChange/GENA event notifications

- related actions: `GetLineInLevel`, `SetLineInLevel`

### `CD.ContainerUpdateIDs`

Per-container update ids — the standard UPnP change signal for browse caches.

**Technical description:**

ContentDirectory evented variable in f_103035c4


### `CD.FavoritesUpdateID`

Bumps whenever Sonos Favorites change — re-browse FV:2 when you see this.

**Technical description:**

ContentDirectory evented variable in f_10303de4


### `CD.RadioFavoritesUpdateID`

Bumps when saved radio favorites change.

**Technical description:**

ContentDirectory evented variable in f_10303de4


### `CD.SavedQueuesUpdateID`

Bumps when Sonos Playlists (saved queues) change.

**Technical description:**

ContentDirectory evented variable in f_10303de4


### `CD.ShareIndexInProgress`

True while the library index is rebuilding — browsing shares may be incomplete.

**Technical description:**

ContentDirectory evented variable in f_103035c4


### `CD.ShareListUpdateID`

Bumps when the local music-library share list changes.

**Technical description:**

ContentDirectory evented variable in f_10303de4


### `CM.CurrentConnectionIDs`

ConnectionManager evented variable in f_10735918


### `ConnectionManager.A_ARG_TYPE_AVTransportID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionManager`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionStatus`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_Direction`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ProtocolInfo`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_RcsID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.CurrentConnectionIDs`

evented state variable — appears in ConnectionManager LastChange/GENA event notifications

- related actions: `GetCurrentConnectionIDs`

### `ConnectionManager.SinkProtocolInfo`

evented state variable — appears in ConnectionManager LastChange/GENA event notifications

- related actions: `GetProtocolInfo`

### `ConnectionManager.SourceProtocolInfo`

evented state variable — appears in ConnectionManager LastChange/GENA event notifications

- related actions: `GetProtocolInfo`

### `ContentDirectory.A_ARG_TYPE_AlbumArtistDisplayOption`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetAlbumArtistDisplayOption`, `RefreshShareIndex`

### `ContentDirectory.A_ARG_TYPE_BrowseFlag`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_Count`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`, `GetAllPrefixLocations`

### `ContentDirectory.A_ARG_TYPE_Filter`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_Index`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`, `FindPrefix`

### `ContentDirectory.A_ARG_TYPE_LastIndexChange`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetLastIndexChange`

### `ContentDirectory.A_ARG_TYPE_ObjectID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`, `CreateObject`, `DestroyObject`, `FindPrefix`, `GetAllPrefixLocations`, `UpdateObject`

### `ContentDirectory.A_ARG_TYPE_Prefix`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `FindPrefix`

### `ContentDirectory.A_ARG_TYPE_Result`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`, `CreateObject`, `GetAllPrefixLocations`

### `ContentDirectory.A_ARG_TYPE_SearchCriteria`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)


### `ContentDirectory.A_ARG_TYPE_SortCriteria`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_SortOrder`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RequestResort`

### `ContentDirectory.A_ARG_TYPE_TagValueList`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `UpdateObject`

### `ContentDirectory.A_ARG_TYPE_UpdateID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`, `FindPrefix`, `GetAllPrefixLocations`

### `ContentDirectory.Browseable`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

- related actions: `GetBrowseable`, `SetBrowseable`

### `ContentDirectory.ContainerUpdateIDs`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications


### `ContentDirectory.FavoritesUpdateID`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications


### `ContentDirectory.RadioFavoritesUpdateID`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications


### `ContentDirectory.RadioLocationUpdateID`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications


### `ContentDirectory.RecentlyPlayedUpdateID`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications


### `ContentDirectory.SavedQueuesUpdateID`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications


### `ContentDirectory.SearchCapabilities`

non-evented ContentDirectory state variable — read via action out-args, not pushed

- related actions: `GetSearchCapabilities`

### `ContentDirectory.ShareIndexInProgress`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

- related actions: `GetShareIndexInProgress`

### `ContentDirectory.ShareIndexLastError`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications


### `ContentDirectory.ShareListUpdateID`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications


### `ContentDirectory.SortCapabilities`

non-evented ContentDirectory state variable — read via action out-args, not pushed

- related actions: `GetSortCapabilities`

### `ContentDirectory.SystemUpdateID`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications

- related actions: `GetSystemUpdateID`

### `ContentDirectory.UserRadioUpdateID`

evented state variable — appears in ContentDirectory LastChange/GENA event notifications


### `DP.CurrentZoneName`

The room name — 'ZoneNameChangedEvent' fires on rename.

**Technical description:**

DeviceProperties evented variable (ZoneNameChangedEvent)


### `DP.Invisible`

Whether the player is hidden from room lists.

**Technical description:**

DeviceProperties evented variable (DeviceInfo attr literal)


### `DP.MicEnabled`

Whether the microphone is enabled (on voice-capable hardware).

**Technical description:**

DeviceProperties evented variable (DeviceInfo attr literal)


### `DP.ResetVolumeAfter`

DeviceProperties evented variable in f_102fc6f4


### `DeviceProperties.A_ARG_TYPE_ButtonState`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetButtonState`

### `DeviceProperties.A_ARG_TYPE_ConfigModeOptions`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `EnterConfigMode`, `ExitConfigMode`

### `DeviceProperties.A_ARG_TYPE_ConfigModeState`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `EnterConfigMode`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpChannel`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- range: `minimum` = 0; `maximum` = 7; `step` = 1
- related actions: `RoomDetectionStartChirping`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpIfPlayingSwappableAudio`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RoomDetectionStartChirping`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionDurationMilliseconds`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RoomDetectionStartChirping`

### `DeviceProperties.A_ARG_TYPE_RoomDetectionPlayId`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RoomDetectionStartChirping`, `RoomDetectionStopChirping`

### `DeviceProperties.AirPlayEnabled`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.AlexaCBLSupported`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.AutoplayIncludeLinkedZones`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetAutoplayLinkedZones`, `SetAutoplayLinkedZones`

### `DeviceProperties.AutoplayRoomUUID`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetAutoplayRoomUUID`, `SetAutoplayRoomUUID`

### `DeviceProperties.AutoplaySource`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetAutoplayLinkedZones`, `GetAutoplayRoomUUID`, `GetAutoplayVolume`, `GetUseAutoplayVolume`, `SetAutoplayLinkedZones`, `SetAutoplayRoomUUID`, `SetAutoplayVolume`, `SetUseAutoplayVolume`

### `DeviceProperties.AutoplayUseVolume`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetUseAutoplayVolume`, `SetUseAutoplayVolume`

### `DeviceProperties.AutoplayVolume`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `GetAutoplayVolume`, `SetAutoplayVolume`

### `DeviceProperties.AvailableRoomCalibration`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.BehindWifiExtender`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.ButtonLockState`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetButtonLockState`, `SetButtonLockState`

### `DeviceProperties.ChannelFreq`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.ChannelMapSet`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

- related actions: `AddBondedZones`, `CreateStereoPair`, `RemoveBondedZones`, `SeparateStereoPair`

### `DeviceProperties.ConfigMode`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

- related actions: `EnterConfigMode`

### `DeviceProperties.Configuration`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.ConnectionType`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.CopyrightInfo`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneInfo`

### `DeviceProperties.DisplaySoftwareVersion`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneInfo`

### `DeviceProperties.EthLink`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.ExtraInfo`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneInfo`

### `DeviceProperties.Flags`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneInfo`

### `DeviceProperties.HTAudioIn`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneInfo`

### `DeviceProperties.HTBondedZoneCommitState`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.HTSatChanMapSet`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

- related actions: `AddHTSatellite`

### `DeviceProperties.HardwareVersion`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneInfo`

### `DeviceProperties.HasConfiguredSSID`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.HdmiCecAvailable`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.HouseholdID`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetHouseholdID`

### `DeviceProperties.IPAddress`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneInfo`

### `DeviceProperties.Icon`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.Invisible`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.IsIdle`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.IsZoneBridge`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.KeepGrouped`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `RemoveBondedZones`

### `DeviceProperties.LEDState`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetLEDState`, `SetLEDState`

### `DeviceProperties.LastChangedPlayState`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.MACAddress`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneInfo`

### `DeviceProperties.MicEnabled`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.MoreInfo`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.Orientation`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.RoomCalibrationState`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.SatRoomUUID`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `RemoveHTSatellite`

### `DeviceProperties.SecureRegState`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.SerialNumber`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneInfo`

### `DeviceProperties.SettingsReplicationState`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.SoftwareVersion`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneInfo`

### `DeviceProperties.SupportsAudioClip`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.SupportsAudioIn`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.SvcActive`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.TVConfigurationError`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.TargetRoomName`

non-evented DeviceProperties state variable — read via action out-args, not pushed

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `DeviceProperties.VoiceConfigState`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.WifiEnabled`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.WirelessMode`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications


### `DeviceProperties.ZoneName`

evented state variable — appears in DeviceProperties LastChange/GENA event notifications

- related actions: `GetZoneAttributes`, `SetZoneAttributes`

### `GM.DelegatedGroupCoordinatorID`

When control is delegated, the acting coordinator's ID.

**Technical description:**

GroupManagement evented variable (event-pool literal)


### `GM.LocalGroupUUID`

This player's group UUID — which group it currently belongs to.

**Technical description:**

GroupManagement evented variable (event-pool literal)


### `GM.VirtualLineInGroupID`

The group hosting virtual line-in — which group a VLI source belongs to.

**Technical description:**

GroupManagement evented variable (setVirtualLineInGroupIDLocked worker)


### `GRC.GroupMute`

Group mute — coordinator-level.

**Technical description:**

GroupRenderingControl evented variable (SetGroupMute rc-log literal)


### `GRC.GroupVolume`

The whole group's volume — settable only on the group coordinator.

**Technical description:**

GroupRenderingControl evented variable (SetGroupVolume rc-log literal)


### `GRC.GroupVolumeChangeable`

Whether group volume is adjustable right now.

**Technical description:**

GroupRenderingControl evented variable (GroupVolumeChangedEvent pool)


### `GroupManagement.A_ARG_TYPE_AVTransportURI`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMember`

### `GroupManagement.A_ARG_TYPE_BootSeq`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMember`

### `GroupManagement.A_ARG_TYPE_BufferingResultCode`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ReportTrackBufferingResult`

### `GroupManagement.A_ARG_TYPE_MemberID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMember`, `RemoveMember`, `ReportTrackBufferingResult`

### `GroupManagement.A_ARG_TYPE_TransportSettings`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMember`

### `GroupManagement.GroupCoordinatorIsLocal`

evented state variable — appears in GroupManagement LastChange/GENA event notifications


### `GroupManagement.LocalGroupUUID`

evented state variable — appears in GroupManagement LastChange/GENA event notifications

- related actions: `AddMember`

### `GroupManagement.ResetVolumeAfter`

evented state variable — appears in GroupManagement LastChange/GENA event notifications

- related actions: `AddMember`

### `GroupManagement.SourceAreaIds`

non-evented GroupManagement state variable — read via action out-args, not pushed

- related actions: `SetSourceAreaIds`

### `GroupManagement.VirtualLineInGroupID`

evented state variable — appears in GroupManagement LastChange/GENA event notifications


### `GroupManagement.VolumeAVTransportURI`

evented state variable — appears in GroupManagement LastChange/GENA event notifications

- related actions: `AddMember`

### `GroupRenderingControl.A_ARG_TYPE_InstanceID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetGroupMute`, `GetGroupVolume`, `SetGroupMute`, `SetGroupVolume`, `SetRelativeGroupVolume`, `SnapshotGroupVolume`

### `GroupRenderingControl.A_ARG_TYPE_VolumeAdjustment`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `SetRelativeGroupVolume`

### `GroupRenderingControl.GroupMute`

evented state variable — appears in GroupRenderingControl LastChange/GENA event notifications

- related actions: `GetGroupMute`, `SetGroupMute`

### `GroupRenderingControl.GroupVolume`

evented state variable — appears in GroupRenderingControl LastChange/GENA event notifications

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `GetGroupVolume`, `SetGroupVolume`, `SetRelativeGroupVolume`

### `GroupRenderingControl.GroupVolumeChangeable`

evented state variable — appears in GroupRenderingControl LastChange/GENA event notifications


### `HT.LEDFeedbackState`

LED feedback state for HT control ops.

**Technical description:**

HTControl evented variable in f_10739c34


### `HT.RemoteConfigured`

Whether the TV remote is configured (HTControl).

**Technical description:**

HTControl evented variable in f_10782194


### `HTControl.A_ARG_TYPE_IRCode`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `LearnIRCode`

### `HTControl.A_ARG_TYPE_IRRemoteName`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CommitLearnedIRCodes`

### `HTControl.A_ARG_TYPE_Timeout`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- range: `minimum` = 0; `maximum` = 60000
- related actions: `IdentifyIRRemote`, `LearnIRCode`

### `HTControl.IRRepeaterState`

evented state variable — appears in HTControl LastChange/GENA event notifications

- related actions: `GetIRRepeaterState`, `SetIRRepeaterState`

### `HTControl.LEDFeedbackState`

non-evented HTControl state variable — read via action out-args, not pushed

- related actions: `GetLEDFeedbackState`, `SetLEDFeedbackState`

### `HTControl.RemoteConfigured`

non-evented HTControl state variable — read via action out-args, not pushed

- related actions: `IsRemoteConfigured`

### `HTControl.TOSLinkConnected`

evented state variable — appears in HTControl LastChange/GENA event notifications


### `MS.ServiceListVersion`

Bumps when the music-service list changes — re-read GetAvailableServices.

**Technical description:**

MusicServices evented variable; emitted by f_100c7084 e:property dump.

- form: `<e:property><NAME>value</e:property>`

### `MusicServices.A_ARG_TYPE_ServiceDescriptorList`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ListAvailableServices`

### `MusicServices.A_ARG_TYPE_ServiceTypeList`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ListAvailableServices`

### `MusicServices.ServiceId`

non-evented MusicServices state variable — read via action out-args, not pushed

- related actions: `GetSessionId`

### `MusicServices.ServiceListVersion`

evented state variable — appears in MusicServices LastChange/GENA event notifications

- related actions: `ListAvailableServices`

### `MusicServices.SessionId`

non-evented MusicServices state variable — read via action out-args, not pushed

- related actions: `GetSessionId`

### `MusicServices.Username`

non-evented MusicServices state variable — read via action out-args, not pushed

- related actions: `GetSessionId`

### `QPlay.A_ARG_TYPE_Code`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `QPlayAuth`

### `QPlay.A_ARG_TYPE_DID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `QPlayAuth`

### `QPlay.A_ARG_TYPE_MID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `QPlayAuth`

### `QPlay.A_ARG_TYPE_Seed`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `QPlayAuth`

### `Queue.A_ARG_TYPE_Count`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`

### `Queue.A_ARG_TYPE_EnqueueAsNext`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIs`, `AddURI`

### `Queue.A_ARG_TYPE_Index`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`

### `Queue.A_ARG_TYPE_LIST_URI`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)


### `Queue.A_ARG_TYPE_LIST_URI_AND_METADATA`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIs`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_NumTracks`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIs`, `AddURI`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_ObjectID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_QueueID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIs`, `AddURI`, `AttachQueue`, `Browse`, `CreateQueue`, `RemoveAllTracks`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`, `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_QueueOwnerContext`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AttachQueue`, `CreateQueue`

### `Queue.A_ARG_TYPE_QueueOwnerID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AttachQueue`, `CreateQueue`

### `Queue.A_ARG_TYPE_QueuePolicy`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CreateQueue`

### `Queue.A_ARG_TYPE_Result`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Browse`

### `Queue.A_ARG_TYPE_SavedQueueTitle`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_TrackNumber`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIs`, `AddURI`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_TrackNumbersCSV`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_URI`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIs`, `AddURI`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_URIMetaData`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIs`, `AddURI`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_UpdateID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddMultipleURIs`, `AddURI`, `Browse`, `RemoveAllTracks`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.Curated`

Whether the queue is service-curated (cloud-queue playlists mark this).

**Technical description:**

curated-queue flag


### `Queue.LastChange`

evented state variable — appears in Queue LastChange/GENA event notifications


### `Queue.QueueID`

Opaque queue identifier for the Queue events channel (a Sonos-proprietary event namespace).

**Technical description:**

queue identifier assigned at AttachQueue/CreateQueue


### `Queue.QueueOwnerID`

queue owner UDN


### `Queue.UpdateID`

Queue version — increments on every queue edit; use it for change detection.

**Technical description:**

queue content update id


### `RCS.AudioDelay`

Lip-sync offset — delay applied to align audio with video.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.AudioDelayLeftRear`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.AudioDelayRightRear`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Bass`

Bass EQ level (-10..10).

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.DialogLevel`

Speech-enhancement/dialog level — HT feature.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.HeightChannelLevel`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Loudness`

Loudness compensation on/off.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.MusicSurroundLevel`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Mute`

Mute state per channel — '1'/'0'.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.NightMode`

Night mode (DRC compression) state — HT feature.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.OutputFixed`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.PresetNameList`

EQ preset names — includes 'FactoryDefaults' used by factory reset.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SonarCalibrationAvailable`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SonarEnabled`

Whether Trueplay/sonar calibration is active on this player.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SpeakerSize`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SpeechEnhanceEnabled`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubCrossover`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubEnabled`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubGain`

Sub output level — only on setups with a bonded Sub.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubPolarity`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SupportsMaxDialogLevel`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundEnabled`

Whether bonded surrounds are active.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundLevel`

Surround speaker level.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundMode`

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Treble`

Treble EQ level (-10..10).

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Volume`

The player's volume (0-100-ish; Master channel). Subscribe for slider UIs.

**Technical description:**

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RenderingControl.A_ARG_TYPE_Channel`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetLoudness`, `GetVolume`, `GetVolumeDB`, `GetVolumeDBRange`, `RampToVolume`, `RestoreVolumePriorToRamp`, `SetLoudness`, `SetRelativeVolume`, `SetVolume`, `SetVolumeDB`

### `RenderingControl.A_ARG_TYPE_ChannelMap`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `SetChannelMap`

### `RenderingControl.A_ARG_TYPE_EQType`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetEQ`, `ResetExtEQ`, `SetEQ`

### `RenderingControl.A_ARG_TYPE_InstanceID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetBass`, `GetEQ`, `GetHeadphoneConnected`, `GetLoudness`, `GetMute`, `GetOutputFixed`, `GetRoomCalibrationStatus`, `GetSupportsOutputFixed`, `GetTreble`, `GetVolume`, `GetVolumeDB`, `GetVolumeDBRange`, `RampToVolume`, `ResetBasicEQ`, `ResetExtEQ`, `RestoreVolumePriorToRamp`, `SetBass`, `SetChannelMap`, `SetEQ`, `SetLoudness`, `SetMute`, `SetOutputFixed`, `SetRelativeVolume`, `SetRoomCalibrationStatus`, `SetTreble`, `SetVolume`, `SetVolumeDB`

### `RenderingControl.A_ARG_TYPE_LeftVolume`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `ResetBasicEQ`

### `RenderingControl.A_ARG_TYPE_MuteChannel`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetMute`, `SetMute`

### `RenderingControl.A_ARG_TYPE_ProgramURI`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RampTimeSeconds`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RampType`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_ResetVolumeAfter`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RightVolume`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `ResetBasicEQ`

### `RenderingControl.A_ARG_TYPE_VolumeAdjustment`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `SetRelativeVolume`

### `RenderingControl.AudioDelay`

lip-sync audio delay


### `RenderingControl.AudioDelayLeftRear`

left-rear delay


### `RenderingControl.AudioDelayRightRear`

right-rear delay


### `RenderingControl.Bass`

bass EQ level


### `RenderingControl.DialogLevel`

dialog enhancement level


### `RenderingControl.EQValue`

non-evented RenderingControl state variable — read via action out-args, not pushed

- related actions: `GetEQ`, `SetEQ`

### `RenderingControl.HeadphoneConnected`

non-evented RenderingControl state variable — read via action out-args, not pushed

- related actions: `GetHeadphoneConnected`

### `RenderingControl.HeightChannelLevel`

height/Atmos channel output level


### `RenderingControl.LastChange`

evented state variable — appears in RenderingControl LastChange/GENA event notifications


### `RenderingControl.Loudness`

loudness compensation state (Master)


### `RenderingControl.MusicSurroundLevel`

surround level applied to music sources


### `RenderingControl.Mute`

per-channel mute state


### `RenderingControl.NightMode`

night-mode compression state


### `RenderingControl.OutputFixed`

fixed line-out level enabled


### `RenderingControl.PresetNameList`

list of available EQ preset names

- accepted values: `FactoryDefaults`
- constant value in this build

### `RenderingControl.RoomCalibrationAvailable`

non-evented RenderingControl state variable — read via action out-args, not pushed

- related actions: `GetRoomCalibrationStatus`

### `RenderingControl.RoomCalibrationBondedZoneInfo`

bonded-zone calibration info


### `RenderingControl.RoomCalibrationCalibrationMode`

non-evented RenderingControl state variable — read via action out-args, not pushed


### `RenderingControl.RoomCalibrationCoefficients`

non-evented RenderingControl state variable — read via action out-args, not pushed


### `RenderingControl.RoomCalibrationEnabled`

non-evented RenderingControl state variable — read via action out-args, not pushed

- related actions: `GetRoomCalibrationStatus`, `SetRoomCalibrationStatus`

### `RenderingControl.RoomCalibrationID`

non-evented RenderingControl state variable — read via action out-args, not pushed


### `RenderingControl.SonarCalibrationAvailable`

whether Sonar/Trueplay calibration data is available for this zone


### `RenderingControl.SonarEnabled`

Trueplay/Sonar enabled


### `RenderingControl.SpeakerSize`

speaker size class


### `RenderingControl.SpeechEnhanceEnabled`

speech enhancement state


### `RenderingControl.SubCrossover`

subwoofer crossover freq


### `RenderingControl.SubEnabled`

whether the bonded subwoofer is enabled


### `RenderingControl.SubGain`

subwoofer output gain level


### `RenderingControl.SubPolarity`

subwoofer polarity phase setting


### `RenderingControl.SupportsMaxDialogLevel`

whether the device supports the maximum dialog level


### `RenderingControl.SupportsOutputFixed`

non-evented RenderingControl state variable — read via action out-args, not pushed

- related actions: `GetSupportsOutputFixed`

### `RenderingControl.SurroundEnabled`

whether surround channels are enabled


### `RenderingControl.SurroundLevel`

surround channel level


### `RenderingControl.SurroundMode`

surround processing mode


### `RenderingControl.Treble`

treble EQ level


### `RenderingControl.Volume`

per-channel volume (Master/LF/RF elements)


### `RenderingControl.VolumeDB`

non-evented RenderingControl state variable — read via action out-args, not pushed

- related actions: `GetVolumeDB`, `GetVolumeDBRange`, `SetVolumeDB`

### `SystemProperties.A_ARG_TYPE_AccountCredential`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddOAuthAccountX`, `RefreshAccountCredentialsX`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_AccountID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddAccountX`, `EditAccountMd`, `EditAccountPasswordX`, `ProvisionCredentialedTrialAccountX`, `RemoveAccount`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_AccountMd`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `EditAccountMd`

### `SystemProperties.A_ARG_TYPE_AccountNickname`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddOAuthAccountX`, `SetAccountNicknameX`

### `SystemProperties.A_ARG_TYPE_AccountPassword`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddAccountX`, `EditAccountPasswordX`, `ProvisionCredentialedTrialAccountX`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_AccountTier`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_AccountType`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddAccountX`, `AddOAuthAccountX`, `EditAccountMd`, `EditAccountPasswordX`, `GetWebCode`, `ProvisionCredentialedTrialAccountX`, `RefreshAccountCredentialsX`, `RemoveAccount`

### `SystemProperties.A_ARG_TYPE_AccountUDN`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddAccountX`, `AddOAuthAccountX`, `ProvisionCredentialedTrialAccountX`, `ReplaceAccountX`, `SetAccountNicknameX`

### `SystemProperties.A_ARG_TYPE_AccountUID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RefreshAccountCredentialsX`

### `SystemProperties.A_ARG_TYPE_AuthorizationCode`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_IsExpired`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ProvisionCredentialedTrialAccountX`

### `SystemProperties.A_ARG_TYPE_OAuthDeviceID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddOAuthAccountX`, `ReplaceAccountX`

### `SystemProperties.A_ARG_TYPE_RDMEnabled`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `EnableRDM`, `GetRDM`

### `SystemProperties.A_ARG_TYPE_RedirectURI`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_StubsCreated`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)


### `SystemProperties.A_ARG_TYPE_UserIdHashCode`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `AddOAuthAccountX`

### `SystemProperties.A_ARG_TYPE_VariableName`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetString`, `Remove`, `SetString`

### `SystemProperties.A_ARG_TYPE_VariableStringValue`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `GetString`, `GetWebCode`, `SetString`

### `SystemProperties.CustomerID`

evented state variable — appears in SystemProperties LastChange/GENA event notifications


### `SystemProperties.ThirdPartyHash`

evented state variable — appears in SystemProperties LastChange/GENA event notifications


### `SystemProperties.UpdateID`

evented state variable — appears in SystemProperties LastChange/GENA event notifications


### `SystemProperties.UpdateIDX`

evented state variable — appears in SystemProperties LastChange/GENA event notifications


### `SystemProperties.VoiceUpdateID`

evented state variable — appears in SystemProperties LastChange/GENA event notifications


### `VirtualLineIn.AVTransportURIMetaData`

non-evented VirtualLineIn state variable — read via action out-args, not pushed


### `VirtualLineIn.A_ARG_TYPE_CurrentTransportSettings`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `StartTransmission`

### `VirtualLineIn.A_ARG_TYPE_InstanceID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Next`, `Pause`, `Play`, `Previous`, `SetVolume`, `StartTransmission`, `Stop`, `StopTransmission`

### `VirtualLineIn.A_ARG_TYPE_PlayerID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `StartTransmission`, `StopTransmission`

### `VirtualLineIn.A_ARG_TYPE_Speed`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `Play`

### `VirtualLineIn.A_ARG_TYPE_Volume`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `SetVolume`

### `VirtualLineIn.CurrentTrackMetaData`

evented state variable — appears in VirtualLineIn LastChange/GENA event notifications


### `VirtualLineIn.CurrentTransportActions`

non-evented VirtualLineIn state variable — read via action out-args, not pushed


### `VirtualLineIn.EnqueuedTransportURIMetaData`

non-evented VirtualLineIn state variable — read via action out-args, not pushed


### `ZGT.ZoneGroupState`

The full household topology document — every zone, its coordinator, members and names. The topological ground truth; subscribe to it for 'what's grouped with what'.

**Technical description:**

ZGT evented state doc: full <ZoneGroupState>+<ZoneGroups>+<MediaServers> XML pushed via f_1074d9b4 emitter (serializer f_10743328, MediaServers section f_10129888); not LastChange attribute-form

- form: `direct <e:property><ZoneGroupState> XML`

### `ZoneGroupTopology.A_ARG_TYPE_CachedOnly`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_IncludeControllers`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.A_ARG_TYPE_MemberID`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ReportUnresponsiveDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceName`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceUDN`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileIPAndPort`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_Origin`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.A_ARG_TYPE_UnresponsiveDeviceActionType`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `ReportUnresponsiveDevice`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateExtraOptions`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateFlags`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateItem`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateType`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateURL`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_Version`

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.AlarmRunSequence`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications


### `ZoneGroupTopology.AreasUpdateID`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications


### `ZoneGroupTopology.AvailableSoftwareUpdate`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications


### `ZoneGroupTopology.DiagnosticID`

non-evented ZoneGroupTopology state variable — read via action out-args, not pushed

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.MuseHouseholdId`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.NetsettingsUpdateID`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications


### `ZoneGroupTopology.SourceAreasUpdateID`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications


### `ZoneGroupTopology.ThirdPartyMediaServersX`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications


### `ZoneGroupTopology.ZoneGroupID`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.ZoneGroupName`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.ZoneGroupState`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

- related actions: `GetZoneGroupState`

### `ZoneGroupTopology.ZonePlayerUUIDsInGroup`

evented state variable — appears in ZoneGroupTopology LastChange/GENA event notifications

- related actions: `GetZoneGroupAttributes`

### `alarm_status_schema`

/status/alarm emitted XML


### `avt_lastchange`

AVTransport LastChange evented fields


### `device_props_extra_vars`

more state vars


### `device_props_update_ids`

update counters


### `netsettings_schema`

netsettings.json replicated network+PSK store


### `playstatemanager_schema`

/status page


### `renderingcontrol_status_schema`

/status/renderingcontrol emitted XML


### `replicated_netsettings_schema`

netsettings replicated XML


### `savedqueues_rsq_schema`

savedqueues.rsq persistence


### `services_xml_schema`

replicated services list XML


### `shares_schema`

replicated share registry XML


### `sounddevice_status_schema`

SoundDevice page (per-zone volume/ducking)


### `update_info_schema`

UpdateInfo page


### `userradio_schema`

userradio.xml (+.d.xml delta) replicated favorites


### `vli_state_snapshot`

VLI handoff snapshot recorded at state transitions


### `zone_group_state_schema`

evented ZoneGroupState XML emitted by topology_base


### `zoneplayers_status_schema`

/status ZonePlayers page


### `zp_support_info`

ZPSupportInfo schema


### `zpinfo_schema`

ZPInfo + DeviceInfo + Playmode


### `zps_page`

household update status page fields

