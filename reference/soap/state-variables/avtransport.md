# State variables: `AVTransport`

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


### `avt_lastchange`

The field list for the transport service's bundled change reports: everything packed into the 'what just changed in playback' message, covering state, track, position, mode, and source. One event carries all of this at once, which is why an app updates its whole now-playing screen from a single notification.

::: details Technical details

AVTransport LastChange evented fields

:::

