# State variables

State variables are the player's named properties: things like volume, mute, or the address of the current track. Every command either reads them (the Get* family) or writes them (the Set* family), and the event system watches them. When one changes, the player announces it to anything that subscribed. The table below is the full property list: what each variable is called, what type of value it holds, its allowed range or values where the spec pins them down, and which commands touch it. Think of it as the player's complete settings-and-state inventory.

::: details Technical details

Evented variables carry `<NAME val="..."/>` elements inside `LastChange` documents; `A_ARG_TYPE_*` variables are SCPD argument-type declarations, not device state.

:::

| Variable | Service | Type | Evented | Status |
|---|---|---|---|---|
| `AC.AlarmListVersion` | [AlarmClock](state-variables/alarmclock.md) | ui4 | yes | `strong` |
| `AC.DateFormat` | [AlarmClock](state-variables/alarmclock.md) | string | yes | `strong` |
| `AC.TimeFormat` | [AlarmClock](state-variables/alarmclock.md) | string | yes | `strong` |
| `AC.TimeGeneration` | [AlarmClock](state-variables/alarmclock.md) | ui4 | yes | `strong` |
| `AC.TimeServer` | [AlarmClock](state-variables/alarmclock.md) | string | yes | `strong` |
| `AI.IRRepeaterState` | [AudioIn](state-variables/audioin.md) | string | yes | `strong` |
| `AI.TOSLinkConnected` | [AudioIn](state-variables/audioin.md) | boolean | yes | `strong` |
| `AVT.AVTransportURI` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.AVTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.CurrentCrossfadeMode` | [AVTransport](state-variables/avtransport.md) | boolean | yes | `confirmed` |
| `AVT.CurrentMediaDuration` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.CurrentPlayMode` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.CurrentRecordQualityMode` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.CurrentSection` | [AVTransport](state-variables/avtransport.md) | ui4 | yes | `confirmed` |
| `AVT.CurrentTrack` | [AVTransport](state-variables/avtransport.md) | ui4 | yes | `confirmed` |
| `AVT.CurrentTrackDuration` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.CurrentTrackMetaData` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.CurrentTrackURI` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.CurrentTransportActions` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.NextAVTransportURI` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.NextAVTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.NumberOfTracks` | [AVTransport](state-variables/avtransport.md) | ui4 | yes | `confirmed` |
| `AVT.PlaybackStorageMedium` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.PossiblePlaybackStorageMedia` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.PossibleRecordQualityModes` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.PossibleRecordStorageMedia` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.RecordMediumWriteStatus` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.RecordStorageMedium` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.TransportErrorDescription` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.TransportErrorHttpCode` | [AVTransport](state-variables/avtransport.md) | ui4 | yes | `confirmed` |
| `AVT.TransportErrorHttpHeaders` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.TransportErrorURI` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.TransportPlaySpeed` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.TransportState` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.TransportStatus` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.r:AlarmRunning` | [AVTransport](state-variables/avtransport.md) | boolean | yes | `confirmed` |
| `AVT.r:CurrentValidPlayModes` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.r:DirectControlAccountID` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.r:DirectControlClientID` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.r:DirectControlIsSuspended` | [AVTransport](state-variables/avtransport.md) | boolean | yes | `confirmed` |
| `AVT.r:EnqueuedTransportURI` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.r:EnqueuedTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.r:NextTrackMetaData` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.r:NextTrackURI` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVT.r:RestartPending` | [AVTransport](state-variables/avtransport.md) | boolean | yes | `confirmed` |
| `AVT.r:SleepTimerGeneration` | [AVTransport](state-variables/avtransport.md) | ui4 | yes | `confirmed` |
| `AVT.r:SnoozeRunning` | [AVTransport](state-variables/avtransport.md) | boolean | yes | `confirmed` |
| `AVTransport.AVTransportURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.AVTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.A_ARG_TYPE_AlarmIncludeLinkedZones` | [AVTransport](state-variables/avtransport.md) | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_AlarmState` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_AlarmVolume` | [AVTransport](state-variables/avtransport.md) | ui2 | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_ClearSource` | [AVTransport](state-variables/avtransport.md) | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_CurrentAVTransportURI` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_EnqueueAsNext` | [AVTransport](state-variables/avtransport.md) | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_GroupID` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_ISO8601Time` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_InstanceID` | [AVTransport](state-variables/avtransport.md) | ui4 | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_LIST_URI` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_LIST_URIMetaData` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_MemberID` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_MemberList` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_NumTracks` | [AVTransport](state-variables/avtransport.md) | ui4 | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_NumTracksChange` | [AVTransport](state-variables/avtransport.md) | i4 | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_ObjectID` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_PlayerID` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_Queue` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_RejoinGroup` | [AVTransport](state-variables/avtransport.md) | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_ResetVolumeAfter` | [AVTransport](state-variables/avtransport.md) | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_RestartSink` | [AVTransport](state-variables/avtransport.md) | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_ResumePlayback` | [AVTransport](state-variables/avtransport.md) | boolean | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_SavedQueueTitle` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_SeekMode` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_SeekTarget` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_SleepTimerState` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_SourceState` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_StreamRestartState` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_TrackList` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_TrackNumber` | [AVTransport](state-variables/avtransport.md) | ui4 | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_TransportSettings` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_URI` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_URIMetaData` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.A_ARG_TYPE_VLIState` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.AbsoluteCounterPosition` | [AVTransport](state-variables/avtransport.md) | i4 | no | `confirmed` |
| `AVTransport.AbsoluteTimePosition` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.AlarmIDRunning` | [AVTransport](state-variables/avtransport.md) | ui4 | no | `confirmed` |
| `AVTransport.AlarmLoggedStartTime` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.AlarmRunning` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentCrossfadeMode` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentMediaDuration` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVTransport.CurrentPlayMode` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentRecordQualityMode` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVTransport.CurrentSection` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentTrack` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentTrackDuration` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentTrackMetaData` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentTrackURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentTransportActions` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.CurrentValidPlayModes` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.DirectControlAccountID` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.DirectControlClientID` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.DirectControlIsSuspended` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.EnqueuedTransportURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.EnqueuedTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.LastChange` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVTransport.MuseSessions` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.NextAVTransportURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.NextAVTransportURIMetaData` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.NextTrackMetaData` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.NextTrackURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.NumberOfTracks` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.PlaybackStorageMedium` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.PossiblePlaybackStorageMedia` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVTransport.PossibleRecordQualityModes` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVTransport.PossibleRecordStorageMedia` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVTransport.QueueUpdateID` | [AVTransport](state-variables/avtransport.md) | ui4 | no | `confirmed` |
| `AVTransport.RecordMediumWriteStatus` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVTransport.RecordStorageMedium` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVTransport.RelativeCounterPosition` | [AVTransport](state-variables/avtransport.md) | i4 | no | `confirmed` |
| `AVTransport.RelativeTimePosition` | [AVTransport](state-variables/avtransport.md) | string | no | `confirmed` |
| `AVTransport.RestartPending` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.SleepTimerGeneration` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.SnoozeRunning` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportErrorDescription` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportErrorHttpCode` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportErrorHttpHeaders` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportErrorURI` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportPlaySpeed` | [AVTransport](state-variables/avtransport.md) | string | yes | `confirmed` |
| `AVTransport.TransportState` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AVTransport.TransportStatus` | [AVTransport](state-variables/avtransport.md) | string (val= attribute) | yes | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmEnabled` | [AlarmClock](state-variables/alarmclock.md) | boolean | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmID` | [AlarmClock](state-variables/alarmclock.md) | ui4 | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmIncludeLinkedZones` | [AlarmClock](state-variables/alarmclock.md) | boolean | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmList` | [AlarmClock](state-variables/alarmclock.md) | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmPlayMode` | [AlarmClock](state-variables/alarmclock.md) | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmProgramMetaData` | [AlarmClock](state-variables/alarmclock.md) | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmProgramURI` | [AlarmClock](state-variables/alarmclock.md) | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmRoomUUID` | [AlarmClock](state-variables/alarmclock.md) | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_AlarmVolume` | [AlarmClock](state-variables/alarmclock.md) | ui2 | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_ISO8601Time` | [AlarmClock](state-variables/alarmclock.md) | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_Recurrence` | [AlarmClock](state-variables/alarmclock.md) | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_TimeStamp` | [AlarmClock](state-variables/alarmclock.md) | string | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_TimeZoneAutoAdjustDst` | [AlarmClock](state-variables/alarmclock.md) | boolean | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_TimeZoneIndex` | [AlarmClock](state-variables/alarmclock.md) | i4 | no | `confirmed` |
| `AlarmClock.A_ARG_TYPE_TimeZoneInformation` | [AlarmClock](state-variables/alarmclock.md) | string | no | `confirmed` |
| `AlarmClock.AlarmListVersion` | [AlarmClock](state-variables/alarmclock.md) | string | yes | `confirmed` |
| `AlarmClock.DailyIndexRefreshTime` | [AlarmClock](state-variables/alarmclock.md) | string | yes | `confirmed` |
| `AlarmClock.DateFormat` | [AlarmClock](state-variables/alarmclock.md) | string | yes | `confirmed` |
| `AlarmClock.TimeFormat` | [AlarmClock](state-variables/alarmclock.md) | string | yes | `confirmed` |
| `AlarmClock.TimeGeneration` | [AlarmClock](state-variables/alarmclock.md) | ui4 | yes | `confirmed` |
| `AlarmClock.TimeServer` | [AlarmClock](state-variables/alarmclock.md) | string | yes | `confirmed` |
| `AlarmClock.TimeZone` | [AlarmClock](state-variables/alarmclock.md) | string | yes | `confirmed` |
| `AudioIn.A_ARG_TYPE_MemberID` | [AudioIn](state-variables/audioin.md) | string | no | `confirmed` |
| `AudioIn.A_ARG_TYPE_ObjectID` | [AudioIn](state-variables/audioin.md) | string | no | `confirmed` |
| `AudioIn.A_ARG_TYPE_TransportSettings` | [AudioIn](state-variables/audioin.md) | string | no | `confirmed` |
| `AudioIn.AudioInputName` | [AudioIn](state-variables/audioin.md) | string | yes | `confirmed` |
| `AudioIn.Icon` | [AudioIn](state-variables/audioin.md) | string | yes | `confirmed` |
| `AudioIn.LeftLineInLevel` | [AudioIn](state-variables/audioin.md) | i4 | yes | `confirmed` |
| `AudioIn.LineInConnected` | [AudioIn](state-variables/audioin.md) | boolean | yes | `confirmed` |
| `AudioIn.Playing` | [AudioIn](state-variables/audioin.md) | boolean | yes | `confirmed` |
| `AudioIn.RightLineInLevel` | [AudioIn](state-variables/audioin.md) | i4 | yes | `confirmed` |
| `CD.ContainerUpdateIDs` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes | `strong` |
| `CD.FavoritesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes | `strong` |
| `CD.RadioFavoritesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes | `strong` |
| `CD.SavedQueuesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes | `strong` |
| `CD.ShareIndexInProgress` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes | `strong` |
| `CD.ShareListUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes | `strong` |
| `CM.CurrentConnectionIDs` | [ConnectionManager](state-variables/connectionmanager.md) | string | yes | `strong` |
| `ConnectionManager.A_ARG_TYPE_AVTransportID` | [ConnectionManager](state-variables/connectionmanager.md) | i4 | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_ConnectionID` | [ConnectionManager](state-variables/connectionmanager.md) | i4 | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_ConnectionManager` | [ConnectionManager](state-variables/connectionmanager.md) | string | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_ConnectionStatus` | [ConnectionManager](state-variables/connectionmanager.md) | string | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_Direction` | [ConnectionManager](state-variables/connectionmanager.md) | string | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_ProtocolInfo` | [ConnectionManager](state-variables/connectionmanager.md) | string | no | `confirmed` |
| `ConnectionManager.A_ARG_TYPE_RcsID` | [ConnectionManager](state-variables/connectionmanager.md) | i4 | no | `confirmed` |
| `ConnectionManager.CurrentConnectionIDs` | [ConnectionManager](state-variables/connectionmanager.md) | string | yes | `confirmed` |
| `ConnectionManager.SinkProtocolInfo` | [ConnectionManager](state-variables/connectionmanager.md) | string | yes | `confirmed` |
| `ConnectionManager.SourceProtocolInfo` | [ConnectionManager](state-variables/connectionmanager.md) | string | yes | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_AlbumArtistDisplayOption` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_BrowseFlag` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_Count` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_Filter` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_Index` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_LastIndexChange` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_ObjectID` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_Prefix` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_Result` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_SearchCriteria` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_SortCriteria` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_SortOrder` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_TagValueList` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.A_ARG_TYPE_UpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | no | `confirmed` |
| `ContentDirectory.Browseable` | [ContentDirectory](state-variables/contentdirectory.md) | boolean | yes | `confirmed` |
| `ContentDirectory.ContainerUpdateIDs` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes | `confirmed` |
| `ContentDirectory.FavoritesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes | `confirmed` |
| `ContentDirectory.RadioFavoritesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes | `confirmed` |
| `ContentDirectory.RadioLocationUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes | `confirmed` |
| `ContentDirectory.RecentlyPlayedUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes | `confirmed` |
| `ContentDirectory.SavedQueuesUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes | `confirmed` |
| `ContentDirectory.SearchCapabilities` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.ShareIndexInProgress` | [ContentDirectory](state-variables/contentdirectory.md) | boolean | yes | `confirmed` |
| `ContentDirectory.ShareIndexLastError` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes | `confirmed` |
| `ContentDirectory.ShareListUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes | `confirmed` |
| `ContentDirectory.SortCapabilities` | [ContentDirectory](state-variables/contentdirectory.md) | string | no | `confirmed` |
| `ContentDirectory.SystemUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | ui4 | yes | `confirmed` |
| `ContentDirectory.UserRadioUpdateID` | [ContentDirectory](state-variables/contentdirectory.md) | string | yes | `confirmed` |
| `DP.CurrentZoneName` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `strong` |
| `DP.Invisible` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `strong` |
| `DP.MicEnabled` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `strong` |
| `DP.ResetVolumeAfter` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `strong` |
| `DeviceProperties.A_ARG_TYPE_ButtonState` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_ConfigModeOptions` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_ConfigModeState` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpChannel` | [DeviceProperties](state-variables/deviceproperties.md) | ui2 | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionChirpIfPlayingSwappableAudio` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionDurationMilliseconds` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | no | `confirmed` |
| `DeviceProperties.A_ARG_TYPE_RoomDetectionPlayId` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | no | `confirmed` |
| `DeviceProperties.AirPlayEnabled` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.AlexaCBLSupported` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.AutoplayIncludeLinkedZones` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | no | `confirmed` |
| `DeviceProperties.AutoplayRoomUUID` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.AutoplaySource` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.AutoplayUseVolume` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | no | `confirmed` |
| `DeviceProperties.AutoplayVolume` | [DeviceProperties](state-variables/deviceproperties.md) | ui2 | no | `confirmed` |
| `DeviceProperties.AvailableRoomCalibration` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `confirmed` |
| `DeviceProperties.BehindWifiExtender` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes | `confirmed` |
| `DeviceProperties.ButtonLockState` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.ChannelFreq` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes | `confirmed` |
| `DeviceProperties.ChannelMapSet` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `confirmed` |
| `DeviceProperties.ConfigMode` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `confirmed` |
| `DeviceProperties.Configuration` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `confirmed` |
| `DeviceProperties.ConnectionType` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes | `confirmed` |
| `DeviceProperties.CopyrightInfo` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.DisplaySoftwareVersion` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.EthLink` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.ExtraInfo` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.Flags` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | no | `confirmed` |
| `DeviceProperties.HTAudioIn` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | no | `confirmed` |
| `DeviceProperties.HTBondedZoneCommitState` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes | `confirmed` |
| `DeviceProperties.HTSatChanMapSet` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `confirmed` |
| `DeviceProperties.HardwareVersion` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.HasConfiguredSSID` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.HdmiCecAvailable` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.HouseholdID` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.IPAddress` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.Icon` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `confirmed` |
| `DeviceProperties.Invisible` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.IsIdle` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.IsZoneBridge` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.KeepGrouped` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | no | `confirmed` |
| `DeviceProperties.LEDState` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.LastChangedPlayState` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `confirmed` |
| `DeviceProperties.MACAddress` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.MicEnabled` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes | `confirmed` |
| `DeviceProperties.MoreInfo` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `confirmed` |
| `DeviceProperties.Orientation` | [DeviceProperties](state-variables/deviceproperties.md) | i4 | yes | `confirmed` |
| `DeviceProperties.RoomCalibrationState` | [DeviceProperties](state-variables/deviceproperties.md) | i4 | yes | `confirmed` |
| `DeviceProperties.SatRoomUUID` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.SecureRegState` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes | `confirmed` |
| `DeviceProperties.SerialNumber` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.SettingsReplicationState` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `confirmed` |
| `DeviceProperties.SoftwareVersion` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.SupportsAudioClip` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.SupportsAudioIn` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.SvcActive` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.TVConfigurationError` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.TargetRoomName` | [DeviceProperties](state-variables/deviceproperties.md) | string | no | `confirmed` |
| `DeviceProperties.VoiceConfigState` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes | `confirmed` |
| `DeviceProperties.WifiEnabled` | [DeviceProperties](state-variables/deviceproperties.md) | boolean | yes | `confirmed` |
| `DeviceProperties.WirelessMode` | [DeviceProperties](state-variables/deviceproperties.md) | ui4 | yes | `confirmed` |
| `DeviceProperties.ZoneName` | [DeviceProperties](state-variables/deviceproperties.md) | string | yes | `confirmed` |
| `GM.DelegatedGroupCoordinatorID` | [GroupManagement](state-variables/groupmanagement.md) | string | yes | `strong` |
| `GM.LocalGroupUUID` | [GroupManagement](state-variables/groupmanagement.md) | string | yes | `strong` |
| `GM.VirtualLineInGroupID` | [GroupManagement](state-variables/groupmanagement.md) | string | yes | `strong` |
| `GRC.GroupMute` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | boolean | yes | `strong` |
| `GRC.GroupVolume` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | i2 | yes | `strong` |
| `GRC.GroupVolumeChangeable` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | boolean | yes | `strong` |
| `GroupManagement.A_ARG_TYPE_AVTransportURI` | [GroupManagement](state-variables/groupmanagement.md) | string | no | `confirmed` |
| `GroupManagement.A_ARG_TYPE_BootSeq` | [GroupManagement](state-variables/groupmanagement.md) | ui4 | no | `confirmed` |
| `GroupManagement.A_ARG_TYPE_BufferingResultCode` | [GroupManagement](state-variables/groupmanagement.md) | i4 | no | `confirmed` |
| `GroupManagement.A_ARG_TYPE_MemberID` | [GroupManagement](state-variables/groupmanagement.md) | string | no | `confirmed` |
| `GroupManagement.A_ARG_TYPE_TransportSettings` | [GroupManagement](state-variables/groupmanagement.md) | string | no | `confirmed` |
| `GroupManagement.GroupCoordinatorIsLocal` | [GroupManagement](state-variables/groupmanagement.md) | boolean | yes | `confirmed` |
| `GroupManagement.LocalGroupUUID` | [GroupManagement](state-variables/groupmanagement.md) | string | yes | `confirmed` |
| `GroupManagement.ResetVolumeAfter` | [GroupManagement](state-variables/groupmanagement.md) | boolean | yes | `confirmed` |
| `GroupManagement.SourceAreaIds` | [GroupManagement](state-variables/groupmanagement.md) | string | no | `confirmed` |
| `GroupManagement.VirtualLineInGroupID` | [GroupManagement](state-variables/groupmanagement.md) | string | yes | `confirmed` |
| `GroupManagement.VolumeAVTransportURI` | [GroupManagement](state-variables/groupmanagement.md) | string | yes | `confirmed` |
| `GroupRenderingControl.A_ARG_TYPE_InstanceID` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | ui4 | no | `confirmed` |
| `GroupRenderingControl.A_ARG_TYPE_VolumeAdjustment` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | i4 | no | `confirmed` |
| `GroupRenderingControl.GroupMute` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | boolean | yes | `confirmed` |
| `GroupRenderingControl.GroupVolume` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | ui2 | yes | `confirmed` |
| `GroupRenderingControl.GroupVolumeChangeable` | [GroupRenderingControl](state-variables/grouprenderingcontrol.md) | boolean | yes | `confirmed` |
| `HT.LEDFeedbackState` | [HTControl](state-variables/htcontrol.md) | string | yes | `strong` |
| `HT.RemoteConfigured` | [HTControl](state-variables/htcontrol.md) | boolean | yes | `strong` |
| `HTControl.A_ARG_TYPE_IRCode` | [HTControl](state-variables/htcontrol.md) | string | no | `confirmed` |
| `HTControl.A_ARG_TYPE_IRRemoteName` | [HTControl](state-variables/htcontrol.md) | string | no | `confirmed` |
| `HTControl.A_ARG_TYPE_Timeout` | [HTControl](state-variables/htcontrol.md) | ui4 | no | `confirmed` |
| `HTControl.IRRepeaterState` | [HTControl](state-variables/htcontrol.md) | string | yes | `confirmed` |
| `HTControl.LEDFeedbackState` | [HTControl](state-variables/htcontrol.md) | string | no | `confirmed` |
| `HTControl.RemoteConfigured` | [HTControl](state-variables/htcontrol.md) | boolean | no | `confirmed` |
| `HTControl.TOSLinkConnected` | [HTControl](state-variables/htcontrol.md) | boolean | yes | `confirmed` |
| `MS.ServiceListVersion` | [MusicServices](state-variables/musicservices.md) | ui4 | yes | `strong` |
| `MusicServices.A_ARG_TYPE_ServiceDescriptorList` | [MusicServices](state-variables/musicservices.md) | string | no | `confirmed` |
| `MusicServices.A_ARG_TYPE_ServiceTypeList` | [MusicServices](state-variables/musicservices.md) | string | no | `confirmed` |
| `MusicServices.ServiceId` | [MusicServices](state-variables/musicservices.md) | ui4 | no | `confirmed` |
| `MusicServices.ServiceListVersion` | [MusicServices](state-variables/musicservices.md) | string | yes | `confirmed` |
| `MusicServices.SessionId` | [MusicServices](state-variables/musicservices.md) | string | no | `confirmed` |
| `MusicServices.Username` | [MusicServices](state-variables/musicservices.md) | string | no | `confirmed` |
| `QPlay.A_ARG_TYPE_Code` | [QPlay](state-variables/qplay.md) | string | no | `confirmed` |
| `QPlay.A_ARG_TYPE_DID` | [QPlay](state-variables/qplay.md) | string | no | `confirmed` |
| `QPlay.A_ARG_TYPE_MID` | [QPlay](state-variables/qplay.md) | string | no | `confirmed` |
| `QPlay.A_ARG_TYPE_Seed` | [QPlay](state-variables/qplay.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_Count` | [Queue](state-variables/queue.md) | ui4 | no | `confirmed` |
| `Queue.A_ARG_TYPE_EnqueueAsNext` | [Queue](state-variables/queue.md) | boolean | no | `confirmed` |
| `Queue.A_ARG_TYPE_Index` | [Queue](state-variables/queue.md) | ui4 | no | `confirmed` |
| `Queue.A_ARG_TYPE_LIST_URI` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_LIST_URI_AND_METADATA` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_NumTracks` | [Queue](state-variables/queue.md) | ui4 | no | `confirmed` |
| `Queue.A_ARG_TYPE_ObjectID` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_QueueID` | [Queue](state-variables/queue.md) | ui4 | no | `confirmed` |
| `Queue.A_ARG_TYPE_QueueOwnerContext` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_QueueOwnerID` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_QueuePolicy` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_Result` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_SavedQueueTitle` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_TrackNumber` | [Queue](state-variables/queue.md) | ui4 | no | `confirmed` |
| `Queue.A_ARG_TYPE_TrackNumbersCSV` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_URI` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_URIMetaData` | [Queue](state-variables/queue.md) | string | no | `confirmed` |
| `Queue.A_ARG_TYPE_UpdateID` | [Queue](state-variables/queue.md) | ui4 | no | `confirmed` |
| `Queue.Curated` | [Queue](state-variables/queue.md) | string/bool (val=) | yes | `confirmed` |
| `Queue.LastChange` | [Queue](state-variables/queue.md) | string | yes | `confirmed` |
| `Queue.QueueID` | [Queue](state-variables/queue.md) | string max 20 chars (val="%.20s") | yes | `confirmed` |
| `Queue.QueueOwnerID` | [Queue](state-variables/queue.md) | %.20s-ish string (val="%s") | yes | `confirmed` |
| `Queue.UpdateID` | [Queue](state-variables/queue.md) | u32 (val="%u") | yes | `confirmed` |
| `RCS.AudioDelay` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | yes | `confirmed` |
| `RCS.AudioDelayLeftRear` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | yes | `confirmed` |
| `RCS.AudioDelayRightRear` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | yes | `confirmed` |
| `RCS.Bass` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes | `confirmed` |
| `RCS.DialogLevel` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes | `confirmed` |
| `RCS.HeightChannelLevel` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes | `confirmed` |
| `RCS.Loudness` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes | `confirmed` |
| `RCS.MusicSurroundLevel` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes | `confirmed` |
| `RCS.Mute` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes | `confirmed` |
| `RCS.NightMode` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes | `confirmed` |
| `RCS.OutputFixed` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes | `confirmed` |
| `RCS.PresetNameList` | [RenderingControl](state-variables/renderingcontrol.md) | string | yes | `confirmed` |
| `RCS.SonarCalibrationAvailable` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes | `confirmed` |
| `RCS.SonarEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes | `confirmed` |
| `RCS.SpeakerSize` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | yes | `confirmed` |
| `RCS.SpeechEnhanceEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes | `confirmed` |
| `RCS.SubCrossover` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes | `confirmed` |
| `RCS.SubEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes | `confirmed` |
| `RCS.SubGain` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes | `confirmed` |
| `RCS.SubPolarity` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes | `confirmed` |
| `RCS.SupportsMaxDialogLevel` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes | `confirmed` |
| `RCS.SurroundEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | yes | `confirmed` |
| `RCS.SurroundLevel` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes | `confirmed` |
| `RCS.SurroundMode` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | yes | `confirmed` |
| `RCS.Treble` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | yes | `confirmed` |
| `RCS.Volume` | [RenderingControl](state-variables/renderingcontrol.md) | ui2 | yes | `confirmed` |
| `RenderingControl.A_ARG_TYPE_Channel` | [RenderingControl](state-variables/renderingcontrol.md) | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_ChannelMap` | [RenderingControl](state-variables/renderingcontrol.md) | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_EQType` | [RenderingControl](state-variables/renderingcontrol.md) | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_InstanceID` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_LeftVolume` | [RenderingControl](state-variables/renderingcontrol.md) | ui2 | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_MuteChannel` | [RenderingControl](state-variables/renderingcontrol.md) | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_ProgramURI` | [RenderingControl](state-variables/renderingcontrol.md) | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_RampTimeSeconds` | [RenderingControl](state-variables/renderingcontrol.md) | ui4 | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_RampType` | [RenderingControl](state-variables/renderingcontrol.md) | string | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_ResetVolumeAfter` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_RightVolume` | [RenderingControl](state-variables/renderingcontrol.md) | ui2 | no | `confirmed` |
| `RenderingControl.A_ARG_TYPE_VolumeAdjustment` | [RenderingControl](state-variables/renderingcontrol.md) | i4 | no | `confirmed` |
| `RenderingControl.AudioDelay` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.AudioDelayLeftRear` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.AudioDelayRightRear` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.Bass` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.DialogLevel` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.EQValue` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | no | `confirmed` |
| `RenderingControl.HeadphoneConnected` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | no | `confirmed` |
| `RenderingControl.HeightChannelLevel` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.LastChange` | [RenderingControl](state-variables/renderingcontrol.md) | string | yes | `confirmed` |
| `RenderingControl.Loudness` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.MusicSurroundLevel` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.Mute` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.NightMode` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.OutputFixed` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.PresetNameList` | [RenderingControl](state-variables/renderingcontrol.md) | string | yes | `confirmed` |
| `RenderingControl.RoomCalibrationAvailable` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | no | `confirmed` |
| `RenderingControl.RoomCalibrationBondedZoneInfo` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.RoomCalibrationCalibrationMode` | [RenderingControl](state-variables/renderingcontrol.md) | string | no | `confirmed` |
| `RenderingControl.RoomCalibrationCoefficients` | [RenderingControl](state-variables/renderingcontrol.md) | string | no | `confirmed` |
| `RenderingControl.RoomCalibrationEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | no | `confirmed` |
| `RenderingControl.RoomCalibrationID` | [RenderingControl](state-variables/renderingcontrol.md) | string | no | `confirmed` |
| `RenderingControl.SonarCalibrationAvailable` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SonarEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SpeakerSize` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SpeechEnhanceEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SubCrossover` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SubEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SubGain` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SubPolarity` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SupportsMaxDialogLevel` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SupportsOutputFixed` | [RenderingControl](state-variables/renderingcontrol.md) | boolean | no | `confirmed` |
| `RenderingControl.SurroundEnabled` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SurroundLevel` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.SurroundMode` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.Treble` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.Volume` | [RenderingControl](state-variables/renderingcontrol.md) | string (val= attribute in LastChange template) | yes | `confirmed` |
| `RenderingControl.VolumeDB` | [RenderingControl](state-variables/renderingcontrol.md) | i2 | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountCredential` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountID` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountMd` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountNickname` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountPassword` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountTier` | [SystemProperties](state-variables/systemproperties.md) | ui4 | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountType` | [SystemProperties](state-variables/systemproperties.md) | ui4 | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountUDN` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AccountUID` | [SystemProperties](state-variables/systemproperties.md) | ui4 | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_AuthorizationCode` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_IsExpired` | [SystemProperties](state-variables/systemproperties.md) | boolean | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_OAuthDeviceID` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_RDMEnabled` | [SystemProperties](state-variables/systemproperties.md) | boolean | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_RedirectURI` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_StubsCreated` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_UserIdHashCode` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_VariableName` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.A_ARG_TYPE_VariableStringValue` | [SystemProperties](state-variables/systemproperties.md) | string | no | `confirmed` |
| `SystemProperties.CustomerID` | [SystemProperties](state-variables/systemproperties.md) | string | yes | `confirmed` |
| `SystemProperties.ThirdPartyHash` | [SystemProperties](state-variables/systemproperties.md) | string | yes | `confirmed` |
| `SystemProperties.UpdateID` | [SystemProperties](state-variables/systemproperties.md) | ui4 | yes | `confirmed` |
| `SystemProperties.UpdateIDX` | [SystemProperties](state-variables/systemproperties.md) | ui4 | yes | `confirmed` |
| `SystemProperties.VoiceUpdateID` | [SystemProperties](state-variables/systemproperties.md) | ui4 | yes | `confirmed` |
| `VirtualLineIn.AVTransportURIMetaData` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no | `confirmed` |
| `VirtualLineIn.A_ARG_TYPE_CurrentTransportSettings` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no | `confirmed` |
| `VirtualLineIn.A_ARG_TYPE_InstanceID` | [VirtualLineIn](state-variables/virtuallinein.md) | ui4 | no | `confirmed` |
| `VirtualLineIn.A_ARG_TYPE_PlayerID` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no | `confirmed` |
| `VirtualLineIn.A_ARG_TYPE_Speed` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no | `confirmed` |
| `VirtualLineIn.A_ARG_TYPE_Volume` | [VirtualLineIn](state-variables/virtuallinein.md) | ui2 | no | `confirmed` |
| `VirtualLineIn.CurrentTrackMetaData` | [VirtualLineIn](state-variables/virtuallinein.md) | string | yes | `confirmed` |
| `VirtualLineIn.CurrentTransportActions` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no | `confirmed` |
| `VirtualLineIn.EnqueuedTransportURIMetaData` | [VirtualLineIn](state-variables/virtuallinein.md) | string | no | `confirmed` |
| `ZGT.ZoneGroupState` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | xml-doc | yes | `strong` |
| `ZoneGroupTopology.A_ARG_TYPE_CachedOnly` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | boolean | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_IncludeControllers` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | boolean | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_MemberID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceName` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceUDN` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_MobileIPAndPort` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_Origin` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UnresponsiveDeviceActionType` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateExtraOptions` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateFlags` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | ui4 | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateItem` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateType` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_UpdateURL` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.A_ARG_TYPE_Version` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | no | `confirmed` |
| `ZoneGroupTopology.AlarmRunSequence` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `ZoneGroupTopology.AreasUpdateID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `ZoneGroupTopology.AvailableSoftwareUpdate` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `ZoneGroupTopology.DiagnosticID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | ui4 | no | `confirmed` |
| `ZoneGroupTopology.MuseHouseholdId` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `ZoneGroupTopology.NetsettingsUpdateID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `ZoneGroupTopology.SourceAreasUpdateID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `ZoneGroupTopology.ThirdPartyMediaServersX` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `ZoneGroupTopology.ZoneGroupID` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `ZoneGroupTopology.ZoneGroupName` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `ZoneGroupTopology.ZoneGroupState` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `ZoneGroupTopology.ZonePlayerUUIDsInGroup` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) | string | yes | `confirmed` |
| `alarm_status_schema` | [AlarmClock](state-variables/alarmclock.md) |  | ? | `strong` |
| `avt_lastchange` | [AVTransport](state-variables/avtransport.md) |  | ? | `strong` |
| `device_props_extra_vars` | [DeviceProperties](state-variables/deviceproperties.md) |  | ? | `strong` |
| `device_props_update_ids` | [DeviceProperties](state-variables/deviceproperties.md) |  | ? | `strong` |
| `ht_input_session` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
| `netsettings_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
| `playstatemanager_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
| `renderingcontrol_status_schema` | [RenderingControl](state-variables/renderingcontrol.md) |  | ? | `strong` |
| `replicated_netsettings_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
| `savedqueues_rsq_schema` | [Queue](state-variables/queue.md) |  | ? | `strong` |
| `services_xml_schema` | [MusicServices](state-variables/musicservices.md) |  | ? | `strong` |
| `shares_schema` | [ContentDirectory](state-variables/contentdirectory.md) |  | ? | `strong` |
| `sounddevice_status_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
| `update_info_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
| `userradio_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
| `vli_state_snapshot` | [VirtualLineIn](state-variables/virtuallinein.md) |  | ? | `strong` |
| `zone_group_state_schema` | [ZoneGroupTopology](state-variables/zonegrouptopology.md) |  | ? | `strong` |
| `zoneplayers_status_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
| `zp_support_info` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
| `zpinfo_schema` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
| `zps_page` | [internal schemas](state-variables/internal-schemas.md) |  | ? | `strong` |
