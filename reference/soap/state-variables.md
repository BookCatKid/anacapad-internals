# State variables

State variables are the player's named properties: things like volume, mute, or the address of the current track. Every command either reads them (the Get* family) or writes them (the Set* family), and the event system watches them. When one changes, the player announces it to anything that subscribed. The table below is the full property list: what each variable is called, what type of value it holds, its allowed range or values where the spec pins them down, and which commands touch it. Think of it as the player's complete settings-and-state inventory.

::: details Technical details

Evented variables carry `<NAME val="..."/>` elements inside `LastChange` documents; `A_ARG_TYPE_*` variables are SCPD argument-type declarations, not device state.

:::

| Variable | Service | Type | Evented |
|---|---|---|---|
| `AC.AlarmListVersion` | [AlarmClock](state-variables/alarmclock.md) | ui4 | yes |
| `AC.DateFormat` | [AlarmClock](state-variables/alarmclock.md) | string | yes |
| `AC.TimeFormat` | [AlarmClock](state-variables/alarmclock.md) | string | yes |
| `AC.TimeGeneration` | [AlarmClock](state-variables/alarmclock.md) | ui4 | yes |
| `AC.TimeServer` | [AlarmClock](state-variables/alarmclock.md) | string | yes |
| `AI.IRRepeaterState` | [AudioIn](state-variables/audioin.md) | string | yes |
| `AI.TOSLinkConnected` | [AudioIn](state-variables/audioin.md) | boolean | yes |
| `AVT.AVTransportURI` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.AVTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.CurrentCrossfadeMode` | [AVTransport](state-variables/avtransport.md) | boolean | yes |
| `AVT.CurrentMediaDuration` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.CurrentPlayMode` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.CurrentRecordQualityMode` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.CurrentSection` | [AVTransport](state-variables/avtransport.md) | ui4 | yes |
| `AVT.CurrentTrack` | [AVTransport](state-variables/avtransport.md) | ui4 | yes |
| `AVT.CurrentTrackDuration` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.CurrentTrackMetaData` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.CurrentTrackURI` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.CurrentTransportActions` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.NextAVTransportURI` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.NextAVTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.NumberOfTracks` | [AVTransport](state-variables/avtransport.md) | ui4 | yes |
| `AVT.PlaybackStorageMedium` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.PossiblePlaybackStorageMedia` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.PossibleRecordQualityModes` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.PossibleRecordStorageMedia` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.RecordMediumWriteStatus` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.RecordStorageMedium` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.TransportErrorDescription` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.TransportErrorHttpCode` | [AVTransport](state-variables/avtransport.md) | ui4 | yes |
| `AVT.TransportErrorHttpHeaders` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.TransportErrorURI` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.TransportPlaySpeed` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.TransportState` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.TransportStatus` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.r:AlarmRunning` | [AVTransport](state-variables/avtransport.md) | boolean | yes |
| `AVT.r:CurrentValidPlayModes` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.r:DirectControlAccountID` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.r:DirectControlClientID` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.r:DirectControlIsSuspended` | [AVTransport](state-variables/avtransport.md) | boolean | yes |
| `AVT.r:EnqueuedTransportURI` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.r:EnqueuedTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.r:NextTrackMetaData` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.r:NextTrackURI` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVT.r:RestartPending` | [AVTransport](state-variables/avtransport.md) | boolean | yes |
| `AVT.r:SleepTimerGeneration` | [AVTransport](state-variables/avtransport.md) | ui4 | yes |
| `AVT.r:SnoozeRunning` | [AVTransport](state-variables/avtransport.md) | boolean | yes |
| `AVTransport.AVTransportURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.AVTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.A_ARG_TYPE_AlarmIncludeLinkedZones` | [AVTransport](state-variables/avtransport.md) | boolean | no |
| `AVTransport.A_ARG_TYPE_AlarmState` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_AlarmVolume` | [AVTransport](state-variables/avtransport.md) | ui2 | no |
| `AVTransport.A_ARG_TYPE_ClearSource` | [AVTransport](state-variables/avtransport.md) | boolean | no |
| `AVTransport.A_ARG_TYPE_CurrentAVTransportURI` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_EnqueueAsNext` | [AVTransport](state-variables/avtransport.md) | boolean | no |
| `AVTransport.A_ARG_TYPE_GroupID` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_ISO8601Time` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_InstanceID` | [AVTransport](state-variables/avtransport.md) | ui4 | no |
| `AVTransport.A_ARG_TYPE_LIST_URI` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_LIST_URIMetaData` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_MemberID` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_MemberList` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_NumTracks` | [AVTransport](state-variables/avtransport.md) | ui4 | no |
| `AVTransport.A_ARG_TYPE_NumTracksChange` | [AVTransport](state-variables/avtransport.md) | i4 | no |
| `AVTransport.A_ARG_TYPE_ObjectID` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_PlayerID` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_Queue` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_RejoinGroup` | [AVTransport](state-variables/avtransport.md) | boolean | no |
| `AVTransport.A_ARG_TYPE_ResetVolumeAfter` | [AVTransport](state-variables/avtransport.md) | boolean | no |
| `AVTransport.A_ARG_TYPE_RestartSink` | [AVTransport](state-variables/avtransport.md) | boolean | no |
| `AVTransport.A_ARG_TYPE_ResumePlayback` | [AVTransport](state-variables/avtransport.md) | boolean | no |
| `AVTransport.A_ARG_TYPE_SavedQueueTitle` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_SeekMode` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_SeekTarget` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_SleepTimerState` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_SourceState` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_StreamRestartState` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_TrackList` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_TrackNumber` | [AVTransport](state-variables/avtransport.md) | ui4 | no |
| `AVTransport.A_ARG_TYPE_TransportSettings` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_URI` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_URIMetaData` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.A_ARG_TYPE_VLIState` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.AbsoluteCounterPosition` | [AVTransport](state-variables/avtransport.md) | i4 | no |
| `AVTransport.AbsoluteTimePosition` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.AlarmIDRunning` | [AVTransport](state-variables/avtransport.md) | ui4 | no |
| `AVTransport.AlarmLoggedStartTime` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.AlarmRunning` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.CurrentCrossfadeMode` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.CurrentMediaDuration` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVTransport.CurrentPlayMode` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.CurrentRecordQualityMode` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVTransport.CurrentSection` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.CurrentTrack` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.CurrentTrackDuration` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.CurrentTrackMetaData` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.CurrentTrackURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.CurrentTransportActions` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.CurrentValidPlayModes` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.DirectControlAccountID` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.DirectControlClientID` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.DirectControlIsSuspended` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.EnqueuedTransportURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.EnqueuedTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.LastChange` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVTransport.MuseSessions` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.NextAVTransportURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.NextAVTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.NextTrackMetaData` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.NextTrackURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.NumberOfTracks` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.PlaybackStorageMedium` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.PossiblePlaybackStorageMedia` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVTransport.PossibleRecordQualityModes` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVTransport.PossibleRecordStorageMedia` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVTransport.QueueUpdateID` | [AVTransport](state-variables/avtransport.md) | ui4 | no |
| `AVTransport.RecordMediumWriteStatus` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVTransport.RecordStorageMedium` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVTransport.RelativeCounterPosition` | [AVTransport](state-variables/avtransport.md) | i4 | no |
| `AVTransport.RelativeTimePosition` | [AVTransport](state-variables/avtransport.md) | string | no |
| `AVTransport.RestartPending` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.SleepTimerGeneration` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.SnoozeRunning` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.TransportErrorDescription` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.TransportErrorHttpCode` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.TransportErrorHttpHeaders` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.TransportErrorURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.TransportPlaySpeed` | [AVTransport](state-variables/avtransport.md) | string | yes |
| `AVTransport.TransportState` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AVTransport.TransportStatus` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes |
| `AlarmClock.A_ARG_TYPE_AlarmEnabled` | [AlarmClock](state-variables/alarmclock.md) | boolean | no |
| `AlarmClock.A_ARG_TYPE_AlarmID` | [AlarmClock](state-variables/alarmclock.md) | ui4 | no |
| `AlarmClock.A_ARG_TYPE_AlarmIncludeLinkedZones` | [AlarmClock](state-variables/alarmclock.md) | boolean | no |
| `AlarmClock.A_ARG_TYPE_AlarmList` | [AlarmClock](state-variables/alarmclock.md) | string | no |
| `AlarmClock.A_ARG_TYPE_AlarmPlayMode` | [AlarmClock](state-variables/alarmclock.md) | string | no |
| `AlarmClock.A_ARG_TYPE_AlarmProgramMetaData` | [AlarmClock](state-variables/alarmclock.md) | string | no |
| `AlarmClock.A_ARG_TYPE_AlarmProgramURI` | [AlarmClock](state-variables/alarmclock.md) | string | no |
| `AlarmClock.A_ARG_TYPE_AlarmRoomUUID` | [AlarmClock](state-variables/alarmclock.md) | string | no |
| `AlarmClock.A_ARG_TYPE_AlarmVolume` | [AlarmClock](state-variables/alarmclock.md) | ui2 | no |
| `AlarmClock.A_ARG_TYPE_ISO8601Time` | [AlarmClock](state-variables/alarmclock.md) | string | no |
| `AlarmClock.A_ARG_TYPE_Recurrence` | [AlarmClock](state-variables/alarmclock.md) | string | no |
| `AlarmClock.A_ARG_TYPE_TimeStamp` | [AlarmClock](state-variables/alarmclock.md) | string | no |
| `AlarmClock.A_ARG_TYPE_TimeZoneAutoAdjustDst` | [AlarmClock](state-variables/alarmclock.md) | boolean | no |
| `AlarmClock.A_ARG_TYPE_TimeZoneIndex` | [AlarmClock](state-variables/alarmclock.md) | i4 | no |
| `AlarmClock.A_ARG_TYPE_TimeZoneInformation` | [AlarmClock](state-variables/alarmclock.md) | string | no |
| `AlarmClock.AlarmListVersion` | [AlarmClock](state-variables/alarmclock.md) | string | yes |
| `AlarmClock.DailyIndexRefreshTime` | [AlarmClock](state-variables/alarmclock.md) | string | yes |
| `AlarmClock.DateFormat` | [AlarmClock](state-variables/alarmclock.md) | string | yes |
| `AlarmClock.TimeFormat` | [AlarmClock](state-variables/alarmclock.md) | string | yes |
| `AlarmClock.TimeGeneration` | [AlarmClock](state-variables/alarmclock.md) | ui4 | yes |
| `AlarmClock.TimeServer` | [AlarmClock](state-variables/alarmclock.md) | string | yes |
| `AlarmClock.TimeZone` | [AlarmClock](state-variables/alarmclock.md) | string | yes |
| `AudioIn.A_ARG_TYPE_MemberID` | [AudioIn](state-variables/audioin.md) | string | no |
| `AudioIn.A_ARG_TYPE_ObjectID` | [AudioIn](state-variables/audioin.md) | string | no |
| `AudioIn.A_ARG_TYPE_TransportSettings` | [AudioIn](state-variables/audioin.md) | string | no |
| `AudioIn.AudioInputName` | [AudioIn](state-variables/audioin.md) | string | yes |
| `AudioIn.Icon` | [AudioIn](state-variables/audioin.md) | string | yes |
| `AudioIn.LeftLineInLevel` | [AudioIn](state-variables/audioin.md) | i4 | yes |
| `AudioIn.LineInConnected` | [AudioIn](state-variables/audioin.md) | boolean | yes |
| `AudioIn.Playing` | [AudioIn](state-variables/audioin.md) | boolean | yes |
| `AudioIn.RightLineInLevel` | [AudioIn](state-variables/audioin.md) | i4 | yes |
| `CD.ContainerUpdateIDs` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes |
| `CD.FavoritesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes |
| `CD.RadioFavoritesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes |
| `CD.SavedQueuesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes |
| `CD.ShareIndexInProgress` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes |
| `CD.ShareListUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes |
| `CM.CurrentConnectionIDs` | [ConnectionManager](state-variables/connectionmanager.md) | string | yes |
| `ConnectionManager.A_ARG_TYPE_AVTransportID` | [ConnectionManager](state-variables/connectionmanager.md) | i4 | no |
| `ConnectionManager.A_ARG_TYPE_ConnectionID` | [ConnectionManager](state-variables/connectionmanager.md) | i4 | no |
| `ConnectionManager.A_ARG_TYPE_ConnectionManager` | [ConnectionManager](state-variables/connectionmanager.md) | string | no |
| `ConnectionManager.A_ARG_TYPE_ConnectionStatus` | [ConnectionManager](state-variables/connectionmanager.md) | string | no |
| `ConnectionManager.A_ARG_TYPE_Direction` | [ConnectionManager](state-variables/connectionmanager.md) | string | no |
| `ConnectionManager.A_ARG_TYPE_ProtocolInfo` | [ConnectionManager](state-variables/connectionmanager.md) | string | no |
| `ConnectionManager.A_ARG_TYPE_RcsID` | [ConnectionManager](state-variables/connectionmanager.md) | i4 | no |
| `ConnectionManager.CurrentConnectionIDs` | [ConnectionManager](state-variables/connectionmanager.md) | string | yes |
| `ConnectionManager.SinkProtocolInfo` | [ConnectionManager](state-variables/connectionmanager.md) | string | yes |
| `ConnectionManager.SourceProtocolInfo` | [ConnectionManager](state-variables/connectionmanager.md) | string | yes |
| `ContentDirectory.A_ARG_TYPE_AlbumArtistDisplayOption` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_BrowseFlag` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_Count` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | no |
| `ContentDirectory.A_ARG_TYPE_Filter` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_Index` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | no |
| `ContentDirectory.A_ARG_TYPE_LastIndexChange` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_ObjectID` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_Prefix` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_Result` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_SearchCriteria` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_SortCriteria` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_SortOrder` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_TagValueList` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.A_ARG_TYPE_UpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | no |
| `ContentDirectory.Browseable` | [ContentDirectory](state-variables/contentdirectory.md) | boolean | yes |
| `ContentDirectory.ContainerUpdateIDs` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes |
| `ContentDirectory.FavoritesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes |
| `ContentDirectory.RadioFavoritesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes |
| `ContentDirectory.RadioLocationUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes |
| `ContentDirectory.RecentlyPlayedUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes |
| `ContentDirectory.SavedQueuesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes |
| `ContentDirectory.SearchCapabilities` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.ShareIndexInProgress` | [ContentDirectory](state-variables/contentdirectory.md) | boolean | yes |
| `ContentDirectory.ShareIndexLastError` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes |
| `ContentDirectory.ShareListUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes |
| `ContentDirectory.SortCapabilities` | [ContentDirectory](state-variables/contentdirectory.md) | string | no |
| `ContentDirectory.SystemUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes |
| `ContentDirectory.UserRadioUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes |
| `DP.CurrentZoneName` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `DP.Invisible` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DP.MicEnabled` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DP.ResetVolumeAfter` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.A_ARG_TYPE_ButtonState` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.A_ARG_TYPE_ConfigModeOptions` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.A_ARG_TYPE_ConfigModeState` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpChannel` | [DeviceProperties](state-variables/deviceproperties.md) | ui2 | no |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpIfPlayingSwappableAudio` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | no |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionDurationMilliseconds` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | no |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionPlayId` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | no |
| `DeviceProperties.AirPlayEnabled` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.AlexaCBLSupported` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.AutoplayIncludeLinkedZones` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | no |
| `DeviceProperties.AutoplayRoomUUID` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.AutoplaySource` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.AutoplayUseVolume` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | no |
| `DeviceProperties.AutoplayVolume` | [DeviceProperties](state-variables/deviceproperties.md) | ui2 | no |
| `DeviceProperties.AvailableRoomCalibration` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `DeviceProperties.BehindWifiExtender` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes |
| `DeviceProperties.ButtonLockState` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.ChannelFreq` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes |
| `DeviceProperties.ChannelMapSet` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `DeviceProperties.ConfigMode` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `DeviceProperties.Configuration` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `DeviceProperties.ConnectionType` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes |
| `DeviceProperties.CopyrightInfo` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.DisplaySoftwareVersion` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.EthLink` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.ExtraInfo` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.Flags` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | no |
| `DeviceProperties.HTAudioIn` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | no |
| `DeviceProperties.HTBondedZoneCommitState` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes |
| `DeviceProperties.HTSatChanMapSet` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `DeviceProperties.HardwareVersion` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.HasConfiguredSSID` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.HdmiCecAvailable` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.HouseholdID` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.IPAddress` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.Icon` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `DeviceProperties.Invisible` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.IsIdle` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.IsZoneBridge` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.KeepGrouped` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | no |
| `DeviceProperties.LEDState` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.LastChangedPlayState` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `DeviceProperties.MACAddress` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.MicEnabled` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes |
| `DeviceProperties.MoreInfo` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `DeviceProperties.Orientation` | [DeviceProperties](state-variables/deviceproperties.md) | i4 | yes |
| `DeviceProperties.RoomCalibrationState` | [DeviceProperties](state-variables/deviceproperties.md) | i4 | yes |
| `DeviceProperties.SatRoomUUID` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.SecureRegState` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes |
| `DeviceProperties.SerialNumber` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.SettingsReplicationState` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `DeviceProperties.SoftwareVersion` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.SupportsAudioClip` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.SupportsAudioIn` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.SvcActive` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.TVConfigurationError` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.TargetRoomName` | [DeviceProperties](state-variables/deviceproperties.md) | string | no |
| `DeviceProperties.VoiceConfigState` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes |
| `DeviceProperties.WifiEnabled` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes |
| `DeviceProperties.WirelessMode` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes |
| `DeviceProperties.ZoneName` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes |
| `GM.DelegatedGroupCoordinatorID` | [GroupManagement](state-variables/groupmanagement.md) | string | yes |
| `GM.LocalGroupUUID` | [GroupManagement](state-variables/groupmanagement.md) | string | yes |
| `GM.VirtualLineInGroupID` | [GroupManagement](state-variables/groupmanagement.md) | string | yes |
| `GRC.GroupMute` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | boolean | yes |
| `GRC.GroupVolume` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | i2 | yes |
| `GRC.GroupVolumeChangeable` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | boolean | yes |
| `GroupManagement.A_ARG_TYPE_AVTransportURI` | [GroupManagement](state-variables/groupmanagement.md) | string | no |
| `GroupManagement.A_ARG_TYPE_BootSeq` | [GroupManagement](state-variables/groupmanagement.md) | ui4 | no |
| `GroupManagement.A_ARG_TYPE_BufferingResultCode` | [GroupManagement](state-variables/groupmanagement.md) | i4 | no |
| `GroupManagement.A_ARG_TYPE_MemberID` | [GroupManagement](state-variables/groupmanagement.md) | string | no |
| `GroupManagement.A_ARG_TYPE_TransportSettings` | [GroupManagement](state-variables/groupmanagement.md) | string | no |
| `GroupManagement.GroupCoordinatorIsLocal` | [GroupManagement](state-variables/groupmanagement.md) | boolean | yes |
| `GroupManagement.LocalGroupUUID` | [GroupManagement](state-variables/groupmanagement.md) | string | yes |
| `GroupManagement.ResetVolumeAfter` | [GroupManagement](state-variables/groupmanagement.md) | boolean | yes |
| `GroupManagement.SourceAreaIds` | [GroupManagement](state-variables/groupmanagement.md) | string | no |
| `GroupManagement.VirtualLineInGroupID` | [GroupManagement](state-variables/groupmanagement.md) | string | yes |
| `GroupManagement.VolumeAVTransportURI` | [GroupManagement](state-variables/groupmanagement.md) | string | yes |
| `GroupRenderingControl.A_ARG_TYPE_InstanceID` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | ui4 | no |
| `GroupRenderingControl.A_ARG_TYPE_VolumeAdjustment` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | i4 | no |
| `GroupRenderingControl.GroupMute` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | boolean | yes |
| `GroupRenderingControl.GroupVolume` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | ui2 | yes |
| `GroupRenderingControl.GroupVolumeChangeable` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | boolean | yes |
| `HT.LEDFeedbackState` | [HTControl](state-variables/htcontrol.md) | string | yes |
| `HT.RemoteConfigured` | [HTControl](state-variables/htcontrol.md) | boolean | yes |
| `HTControl.A_ARG_TYPE_IRCode` | [HTControl](state-variables/htcontrol.md) | string | no |
| `HTControl.A_ARG_TYPE_IRRemoteName` | [HTControl](state-variables/htcontrol.md) | string | no |
| `HTControl.A_ARG_TYPE_Timeout` | [HTControl](state-variables/htcontrol.md) | ui4 | no |
| `HTControl.IRRepeaterState` | [HTControl](state-variables/htcontrol.md) | string | yes |
| `HTControl.LEDFeedbackState` | [HTControl](state-variables/htcontrol.md) | string | no |
| `HTControl.RemoteConfigured` | [HTControl](state-variables/htcontrol.md) | boolean | no |
| `HTControl.TOSLinkConnected` | [HTControl](state-variables/htcontrol.md) | boolean | yes |
| `MS.ServiceListVersion` | [MusicServices](state-variables/musicservices.md) | ui4 | yes |
| `MusicServices.A_ARG_TYPE_ServiceDescriptorList` | [MusicServices](state-variables/musicservices.md) | string | no |
| `MusicServices.A_ARG_TYPE_ServiceTypeList` | [MusicServices](state-variables/musicservices.md) | string | no |
| `MusicServices.ServiceId` | [MusicServices](state-variables/musicservices.md) | ui4 | no |
| `MusicServices.ServiceListVersion` | [MusicServices](state-variables/musicservices.md) | string | yes |
| `MusicServices.SessionId` | [MusicServices](state-variables/musicservices.md) | string | no |
| `MusicServices.Username` | [MusicServices](state-variables/musicservices.md) | string | no |
| `QPlay.A_ARG_TYPE_Code` | [QPlay](state-variables/qplay.md) | string | no |
| `QPlay.A_ARG_TYPE_DID` | [QPlay](state-variables/qplay.md) | string | no |
| `QPlay.A_ARG_TYPE_MID` | [QPlay](state-variables/qplay.md) | string | no |
| `QPlay.A_ARG_TYPE_Seed` | [QPlay](state-variables/qplay.md) | string | no |
| `Queue.A_ARG_TYPE_Count` | [Queue](state-variables/queue.md) | ui4 | no |
| `Queue.A_ARG_TYPE_EnqueueAsNext` | [Queue](state-variables/queue.md) | boolean | no |
| `Queue.A_ARG_TYPE_Index` | [Queue](state-variables/queue.md) | ui4 | no |
| `Queue.A_ARG_TYPE_LIST_URI` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_LIST_URI_AND_METADATA` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_NumTracks` | [Queue](state-variables/queue.md) | ui4 | no |
| `Queue.A_ARG_TYPE_ObjectID` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_QueueID` | [Queue](state-variables/queue.md) | ui4 | no |
| `Queue.A_ARG_TYPE_QueueOwnerContext` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_QueueOwnerID` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_QueuePolicy` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_Result` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_SavedQueueTitle` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_TrackNumber` | [Queue](state-variables/queue.md) | ui4 | no |
| `Queue.A_ARG_TYPE_TrackNumbersCSV` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_URI` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_URIMetaData` | [Queue](state-variables/queue.md) | string | no |
| `Queue.A_ARG_TYPE_UpdateID` | [Queue](state-variables/queue.md) | ui4 | no |
| `Queue.Curated` | [Queue](state-variables/queue.md) | string/bool (val=) | yes |
| `Queue.LastChange` | [Queue](state-variables/queue.md) | string | yes |
| `Queue.QueueID` | [Queue](state-variables/queue.md) | string max 20 chars (val="%.20s") | yes |
| `Queue.QueueOwnerID` | [Queue](state-variables/queue.md) | %.20s-ish string (val="%s") | yes |
| `Queue.UpdateID` | [Queue](state-variables/queue.md) | u32 (val="%u") | yes |
| `RCS.AudioDelay` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | yes |
| `RCS.AudioDelayLeftRear` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | yes |
| `RCS.AudioDelayRightRear` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | yes |
| `RCS.Bass` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes |
| `RCS.DialogLevel` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes |
| `RCS.HeightChannelLevel` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes |
| `RCS.Loudness` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes |
| `RCS.MusicSurroundLevel` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes |
| `RCS.Mute` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes |
| `RCS.NightMode` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes |
| `RCS.OutputFixed` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes |
| `RCS.PresetNameList` | [RenderingControl](state-variables/renderingcontrol.md) | string | yes |
| `RCS.SonarCalibrationAvailable` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes |
| `RCS.SonarEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes |
| `RCS.SpeakerSize` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | yes |
| `RCS.SpeechEnhanceEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes |
| `RCS.SubCrossover` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes |
| `RCS.SubEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes |
| `RCS.SubGain` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes |
| `RCS.SubPolarity` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes |
| `RCS.SupportsMaxDialogLevel` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes |
| `RCS.SurroundEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes |
| `RCS.SurroundLevel` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes |
| `RCS.SurroundMode` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | yes |
| `RCS.Treble` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes |
| `RCS.Volume` | [RenderingControl](state-variables/renderingcontrol.md) | ui2 | yes |
| `RenderingControl.A_ARG_TYPE_Channel` | [RenderingControl](state-variables/renderingcontrol.md) | string | no |
| `RenderingControl.A_ARG_TYPE_ChannelMap` | [RenderingControl](state-variables/renderingcontrol.md) | string | no |
| `RenderingControl.A_ARG_TYPE_EQType` | [RenderingControl](state-variables/renderingcontrol.md) | string | no |
| `RenderingControl.A_ARG_TYPE_InstanceID` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | no |
| `RenderingControl.A_ARG_TYPE_LeftVolume` | [RenderingControl](state-variables/renderingcontrol.md) | ui2 | no |
| `RenderingControl.A_ARG_TYPE_MuteChannel` | [RenderingControl](state-variables/renderingcontrol.md) | string | no |
| `RenderingControl.A_ARG_TYPE_ProgramURI` | [RenderingControl](state-variables/renderingcontrol.md) | string | no |
| `RenderingControl.A_ARG_TYPE_RampTimeSeconds` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | no |
| `RenderingControl.A_ARG_TYPE_RampType` | [RenderingControl](state-variables/renderingcontrol.md) | string | no |
| `RenderingControl.A_ARG_TYPE_ResetVolumeAfter` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | no |
| `RenderingControl.A_ARG_TYPE_RightVolume` | [RenderingControl](state-variables/renderingcontrol.md) | ui2 | no |
| `RenderingControl.A_ARG_TYPE_VolumeAdjustment` | [RenderingControl](state-variables/renderingcontrol.md) | i4 | no |
| `RenderingControl.AudioDelay` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.AudioDelayLeftRear` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.AudioDelayRightRear` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.Bass` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.DialogLevel` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.EQValue` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | no |
| `RenderingControl.HeadphoneConnected` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | no |
| `RenderingControl.HeightChannelLevel` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.LastChange` | [RenderingControl](state-variables/renderingcontrol.md) | string | yes |
| `RenderingControl.Loudness` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.MusicSurroundLevel` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.Mute` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.NightMode` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.OutputFixed` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.PresetNameList` | [RenderingControl](state-variables/renderingcontrol.md) | string | yes |
| `RenderingControl.RoomCalibrationAvailable` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | no |
| `RenderingControl.RoomCalibrationBondedZoneInfo` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.RoomCalibrationCalibrationMode` | [RenderingControl](state-variables/renderingcontrol.md) | string | no |
| `RenderingControl.RoomCalibrationCoefficients` | [RenderingControl](state-variables/renderingcontrol.md) | string | no |
| `RenderingControl.RoomCalibrationEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | no |
| `RenderingControl.RoomCalibrationID` | [RenderingControl](state-variables/renderingcontrol.md) | string | no |
| `RenderingControl.SonarCalibrationAvailable` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SonarEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SpeakerSize` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SpeechEnhanceEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SubCrossover` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SubEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SubGain` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SubPolarity` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SupportsMaxDialogLevel` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SupportsOutputFixed` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | no |
| `RenderingControl.SurroundEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SurroundLevel` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.SurroundMode` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.Treble` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.Volume` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes |
| `RenderingControl.VolumeDB` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | no |
| `SystemProperties.A_ARG_TYPE_AccountCredential` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_AccountID` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_AccountMd` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_AccountNickname` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_AccountPassword` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_AccountTier` | [SystemProperties](state-variables/systemproperties.md) | ui4 | no |
| `SystemProperties.A_ARG_TYPE_AccountType` | [SystemProperties](state-variables/systemproperties.md) | ui4 | no |
| `SystemProperties.A_ARG_TYPE_AccountUDN` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_AccountUID` | [SystemProperties](state-variables/systemproperties.md) | ui4 | no |
| `SystemProperties.A_ARG_TYPE_AuthorizationCode` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_IsExpired` | [SystemProperties](state-variables/systemproperties.md) | boolean | no |
| `SystemProperties.A_ARG_TYPE_OAuthDeviceID` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_RDMEnabled` | [SystemProperties](state-variables/systemproperties.md) | boolean | no |
| `SystemProperties.A_ARG_TYPE_RedirectURI` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_StubsCreated` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_UserIdHashCode` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_VariableName` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.A_ARG_TYPE_VariableStringValue` | [SystemProperties](state-variables/systemproperties.md) | string | no |
| `SystemProperties.CustomerID` | [SystemProperties](state-variables/systemproperties.md) | string | yes |
| `SystemProperties.ThirdPartyHash` | [SystemProperties](state-variables/systemproperties.md) | string | yes |
| `SystemProperties.UpdateID` | [SystemProperties](state-variables/systemproperties.md) | ui4 | yes |
| `SystemProperties.UpdateIDX` | [SystemProperties](state-variables/systemproperties.md) | ui4 | yes |
| `SystemProperties.VoiceUpdateID` | [SystemProperties](state-variables/systemproperties.md) | ui4 | yes |
| `VirtualLineIn.AVTransportURIMetaData` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no |
| `VirtualLineIn.A_ARG_TYPE_CurrentTransportSettings` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no |
| `VirtualLineIn.A_ARG_TYPE_InstanceID` | [VirtualLineIn](state-variables/virtuallinein.md) | ui4 | no |
| `VirtualLineIn.A_ARG_TYPE_PlayerID` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no |
| `VirtualLineIn.A_ARG_TYPE_Speed` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no |
| `VirtualLineIn.A_ARG_TYPE_Volume` | [VirtualLineIn](state-variables/virtuallinein.md) | ui2 | no |
| `VirtualLineIn.CurrentTrackMetaData` | [VirtualLineIn](state-variables/virtuallinein.md) | string | yes |
| `VirtualLineIn.CurrentTransportActions` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no |
| `VirtualLineIn.EnqueuedTransportURIMetaData` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no |
| `ZGT.ZoneGroupState` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | xml-doc | yes |
| `ZoneGroupTopology.A_ARG_TYPE_CachedOnly` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | boolean | no |
| `ZoneGroupTopology.A_ARG_TYPE_IncludeControllers` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | boolean | no |
| `ZoneGroupTopology.A_ARG_TYPE_MemberID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceName` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceUDN` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.A_ARG_TYPE_MobileIPAndPort` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.A_ARG_TYPE_Origin` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.A_ARG_TYPE_UnresponsiveDeviceActionType` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateExtraOptions` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateFlags` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | ui4 | no |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateItem` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateType` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateURL` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.A_ARG_TYPE_Version` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no |
| `ZoneGroupTopology.AlarmRunSequence` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `ZoneGroupTopology.AreasUpdateID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `ZoneGroupTopology.AvailableSoftwareUpdate` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `ZoneGroupTopology.DiagnosticID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | ui4 | no |
| `ZoneGroupTopology.MuseHouseholdId` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `ZoneGroupTopology.NetsettingsUpdateID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `ZoneGroupTopology.SourceAreasUpdateID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `ZoneGroupTopology.ThirdPartyMediaServersX` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `ZoneGroupTopology.ZoneGroupID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `ZoneGroupTopology.ZoneGroupName` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `ZoneGroupTopology.ZoneGroupState` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `ZoneGroupTopology.ZonePlayerUUIDsInGroup` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes |
| `alarm_status_schema` | [AlarmClock](state-variables/alarmclock.md) |  | ? |
| `avt_lastchange` | [AVTransport](state-variables/avtransport.md) |  | ? |
| `device_props_extra_vars` | [DeviceProperties](state-variables/deviceproperties.md) |  | ? |
| `device_props_update_ids` | [DeviceProperties](state-variables/deviceproperties.md) |  | ? |
| `ht_input_session` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
| `netsettings_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
| `playstatemanager_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
| `renderingcontrol_status_schema` | [RenderingControl](state-variables/renderingcontrol.md) |  | ? |
| `replicated_netsettings_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
| `savedqueues_rsq_schema` | [Queue](state-variables/queue.md) |  | ? |
| `services_xml_schema` | [MusicServices](state-variables/musicservices.md) |  | ? |
| `shares_schema` | [ContentDirectory](state-variables/contentdirectory.md) |  | ? |
| `sounddevice_status_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
| `update_info_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
| `userradio_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
| `vli_state_snapshot` | [VirtualLineIn](state-variables/virtuallinein.md) |  | ? |
| `zone_group_state_schema` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) |  | ? |
| `zoneplayers_status_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
| `zp_support_info` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
| `zpinfo_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
| `zps_page` | [internal schemas](state-variables/internal-schemas.md) |  | ? |
