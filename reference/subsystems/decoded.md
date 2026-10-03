# Decoded subsystems

## `account_actions`

**coverage** `strong`

The operations behind music-service account management: the routines that actually add, edit, and remove the saved logins for services like Spotify. They sit underneath the account commands documented on the service pages.

::: details Technical details

args {VariableName,StringValue,AccountUDN,AccountNickname,AccountType,WebCode,AccountPassword,NewAccountPassword,NewAccountMd,AccountToken,AccountKey,OAuthDeviceID,AuthorizationCode,RedirectURI,UserIdHashCode,AccountTier,AccountUID,NewAccountID,NewAccountUDN,RDMValue}; actions {AddAccountX,AddOAuthAccountX,DoPostUpdateTasks,EditAccountMd,EditAccountPasswordX,EnableRDM,GetRDM,GetString,GetWebCode,RefreshAccountCredentialsX,RemoveAccount,ReplaceAccountX,SetAccountNicknameX,SetString}

- **name:** DeviceProperties account actions
::: details Evidence (1)

- @ 0x10f111a4; account action vocab

:::


:::

## `accounts_replication`

**coverage** `strong`

Keeps music-service accounts in sync across the household: when you add a Spotify login on one speaker, this machinery replicates it to the others so any room can play that service. It's why you only have to sign in once for the whole house.

::: details Technical details

ops {markAccountsForPushLocked,setAndUpdatePreferredSerialNum,addAccountWithUserCredentials,int_addAccountWithOAuthToken,addPreinstalledService,addAccountWithOAuthToken,addAccountWithOAuthCode,addAccountForOAuthDirectControl,modifyAccount,migrateAccountsToSMAPI,migrateAccountSID,migrateAccountToOAuth,updateAccountUserInfo,reportAllActiveAccounts,ReportSvcTimedJob,matchImpl,pullFromReplicationService,pushToReplicationService,getPreferredAccount}; zpam: %s,%d,%d,%u; file accounts.xml; outcomes {retry,conflicted,updated,added,deleted,invalidCloud,invalidCloudSerial,invalidCloudReason,vcCloud}; validation {invalid service ID,missing service uuid,missing account type,missing metadata,missing cloud vector clock,missing serial number,missing account ID,missing household vector clock,"Discarding invalid cloud record: %s \[uuid=%s, hh=%s, cloud=%s\]",exceeded max deleted accounts}; guest migration {"Existing account is not a guest account, migrateGuestAccount failing","Bad guest migration: UDN = %s - UserIDHash = %s","Migrated %s replication account","Migrated tombstoned %s replication account"}; "End direct control context UUID: %s"; "Invalid replication operation"; "no preferred account set"; "Failed to download manifest file (%s) for service %u"; getDeviceAuthToken failed; 'Account added. Returning UDN=%s','can't extract account UID from %s','Updating guest account nickname from: %s to: %s','Unable to update guest account sn=%u,h=%s'

- **name:** accounts manager + replication
- **detail:** matching {performsSMAPIAccountMatching,"Account matched g=%d,sn=%u,h=%s","New account matched to existing guest account with SN=%u, Hash=%s"}; DC outcomes {login failed,no account,stale account,unsupported service,unexpected,Could not resolve serviceId}; corruption {emptyUUID,dupUUID,caller,accountCorruption,"Error reading file while detecting stale anonymous/corrupted accounts","Found corrupted accounts"}; guest {"Link code required to add guest account","Added guest account with SN=%u","Updating guest account nickname","addAccount failed: guest upgrade not allowed via reauth.","account already exists on household"}; maintenance {restore,addAccount,migrate,"Removed account with corrupted type. SN=%d, SID=%u, UID=%u",corruptedAccountRemoval,"removing duplicate account with SID",duplicateAccountRemoval,"Removed account multiple",numAccounts}; migrations {"Migrated Pandora built-in (%d,%d->%d)",pre-cloud,anonymous,"Migrated Account with SID %u. (%u,%u->%u)",legacyTuneInReplaced,"UserIdHash \[%s\] already exists and will not be updated for SN=%u"}; replication status XML <AccountsInfo><Replication><ReplicationOperation>%s\|n/a</ReplicationOperation><ReplicationResult>%d\|n/a</ReplicationResult></Replication><ReplicationPlayer>%s</ReplicationPlayer><ReplicationTime>%Y-%m-%d %H:%M:%S</ReplicationTime></AccountsInfo>; outcomes {"Pull successful","Corrupted accounts not updated","Pull rescheduled in %lld","Push successful","Push rescheduled in %lld"}; "Rejected version %u, schema %u from %s"; "replicating accounts file from %s"; spotifyTransferStartDirectControlEx; R_SvcAccounts
::: details Evidence (1)

- @ 0x10eaba78; accounts replication

:::


:::

## `acoustic_metrics`

**coverage** `strong`

Gathers measurements about the audio hardware: signal levels, channel data, and other acoustic telemetry the player reports for diagnostics and tuning. It is the instrumentation side of the audio path: while the pipeline plays sound, this machinery watches what comes out and packages the readings so support tools and calibration features can see what the hardware is actually doing.

::: details Technical details

{tdoas,scrollbackAttempt,confidence,correlationMaxValue,thresholdPeakMaxValue,leadingEdgeSpectralSimilarity,leadingEdgePriorEnergy,leadingEdgePosteriorEnergy,leadingEdgeEnergyCoherence,maxPeakEnergyCoherence,maxPeakPosteriorEnergy,noiseRms,signalRms,normalisedResiduals,peakMagnitudeRatios,leadingEdgePercentageEnergy,f1SpectralSimilarity,f2SpectralSimilarity,leadingEdgeKurtosis,leadingEdgeRiseTime,normalisedAggregateResidual,decayConstant,numMeasurements,numRetries,orchestrator,debugData,tvUsec,errorTime,expirationTime}

- **name:** positioning acoustic-metric schema
::: details Evidence (1)

- @ 0x10fadf24; acoustic metrics

:::


:::

## `amp_manager`

**coverage** `strong`

Manages the internal amplifier: enabling and disabling output stages, applying gains, and handling the amp's power state. On a self-amplified speaker like a Playbar this is the last stop before the drivers: the code that decides when the amplifier is awake, how loud its output stage runs, and when it powers down to save energy.

::: details Technical details

AmplifierPowerStateChangedEvent; transitions {"zone %d volume %f -> %f","zone %d is playing %d -> %d"}; notify ops {manageAmpStateLocked_notifyVolume,notifyPlayState,notifyPlayingUnmuteableSource_p/np,notifyOutputFixed,resetPreemptiveTurnOn,notifyPreemptiveTurnOn}; preemptive "zone %zu preemptive turn on %d -> 0/%d"; power {"entered ampPowerOnLocked() - %dms","ignored unsupported amp command: power/mute/hipower (%d)","failed to power on/unmute/mute/power off amps (%d)","failed to transition to high/low power rail (%d)","left ampPowerOnLocked()","requested amp power off"}; off-decision "roff:%d canoff:%d ofx:%d nzvplay:%d pre:%d unm:%d"; "scheduling off in %d sec"; {ampMgr,RAmpManager,ampPowerOnLocked,ampPowerOffLocked,"failed to unmute amps to clear fault","ampState %d -> %d",notifyAmpState,"init failed (%d)"}

- **name:** ampMgr power manager
::: details Evidence (1)

- @ 0x10fe5434; ampMgr

:::


:::

## `ap_layer`

**coverage** `strong`

The access-point layer: code for when a Sonos player acts as or manages a wireless access point. This era's hardware could host its own wireless segment as part of Sonos's dedicated mesh and during setup, and this layer is the machinery behind that role.

::: details Technical details

endpoints {apresolve.spotify.com,ap.spotify.com,local apresolve,fallback}; handshake {"Connecting (%s) %s:%d timeout: %d sec","Sending Hello message to AP","Writing apresolve request","logging in, type %d sz %d user %s","Failed to decode ApWelcome: %s","!"ApWelcome failed""}; TLV {"Failed reading TLV header %d %d/7 oserr %d","Packet from AP is too large! Type: %d / Size: %d","ap->packet_size <= 16384","Skipped %s(%d) (%d > %d)","Corrupted packet, invalid MAC"}; connectivity {"Permanent connection error: %d","Regained network connectivity, reconnecting","Lost network connectivity, disconnecting","Connectivity went from one type to another (%d -> %d), populating disconnected sockets array","Too long without response from server","SpPumpEvents() is called too slowly: %d ms for 100 calls","ap os error code: %d"}; AP resolver request ' 200GET /?client=TSP_VERSION_PLATFORM:5:0:71780298064396493&time=%llu HTTP/1.0' + 'Host: apresolve.spotify.com' (HTTP/1.0 GET with TSP client token + timestamp)

- **name:** AP (access point) connection layer
::: details Evidence (1)

- @ 0x10fd7bc8; AP layer

:::


:::

## `areas`

**coverage** `strong`

The household-areas machinery: the internal model of multi-room 'areas' that newer app versions organize by, matching the areas API surface documented on the modern-API page.

::: details Technical details

areas.json persistence + atomic-write cycle {accepted file load,rename accepted→store,rename failed paths,saving failed,setup load/save}; schema versioning 'Loaded areas schema version (%d) differs from local version (%d)'; builtin 'Everywhere' + GUID 7055133f-81e7-45e6-ba70-8803966c7185; constraints {'Area IDs must be distinct','Maximum area limit (%d) reached','Cannot update read-only area','Set of players in area (array playerIds)'}; vars {areaId,areasMgr,artfetch}

- **name:** Areas manager
::: details Evidence (1)

- @ 0x10ead0bc; areas block

:::


:::

## `async_stream`

**coverage** `strong`

An asynchronous streaming helper: plumbing for data that arrives or is consumed in chunks rather than all at once. Streaming sources, downloads, and event channels all move data incrementally, and this shared machinery lets the rest of the code work in chunks without each subsystem re-inventing the buffering.

::: details Technical details

init 'buffersize=%zu; multiThread=%u; ratelimit=%zu us'; segment model {'Data segment follows segment with EOF!','Tried to delete segment with I/O in progress','SegmentTable reallocated to %zu entries','Unexpected: I/O to block %zu; not last block in segment'}; positions {'Pause; framed to stream pos %zu; resume at pos at %zu; reaped to pos %zu','Played to stream pos %zu. Reaped %zu blocks of played data in track %5.5s','Started reaping played data. Lose fast scrubbing backwards'}; alloc {'Alloc satisfied by track transition','Alloc satisfied by deleting played data','Alloc not satisified, returning anyway','Unable to satisfy allocation request! Played to pos','Satisfed allocation request but should not have required this!'}; CDN fallback {'File is in memory!','>>>Start reading at offset %zu ; streamPos %zu','>>>Sync read from CDN at offset %zu','Opportunistic sync read from CDN','readSync unable to allocate a buffer; transport error will ensue','>>>>readSync: read %zu blocks in %lld ms'}; rates {'Playing at ~%zu KB/sec. Blocks read this series: %zu','Avg read rate: %zuKB/sec; min read rate','download time %zu ms','Stop async reading. Filled %zu buffers; %zu bytes in %zu ms. (%zu KB/sec)'}; tracking {'Socket has: %zu bytes (%zu blocks and %zu bytes). CHSRC ms ahead: %ld','new seek based PB session','Restart current track','start streaming track %d \[%5.5s\]. Filesize=%zu, startPos=%zu'}; actors {asyncstrm,asyncstrmio,asyncstreamiomgr,asyncBufferedStream,mrrkbs,arrkbs}; 'Atom Table Full'

- **name:** RAsyncBufferedStream internals
- **atom_table:** stream buffer atoms tracked in a fixed table (logger asyncstrmio/asyncstreamiomgr): errors {Internal error - Atom Overflow, Internal error - Invalid Atom, Atom Table Full} @0x110919c4/0x110919e4/0x10eade14 - the atom table is a bounded allocation pool that can exhaust under load. distinct from MP4 atoms - these are the async_stream segment-buffer units
::: details Evidence (1)

- @ 0x10ead488; asyncstrm block

:::


:::

## `avt_impl`

**coverage** `strong`

The implementation object behind the transport service: where the command routines' real work happens once the network layer has unpacked a request. The service page's commands all funnel into this object, which is the bridge between 'a network request arrived' and 'the transport engine did something'.

::: details Technical details

TX selection {'Using HTAudio TV TX for GM %s','Using CHSRC TX for GM %s','Why are we telling HTAP to play %s','setting tvInputFormat %08x',iSCS removeClock/installClock}; persistence avt.txt + avt-backup-restore + locks {rwlW_avt,rwlR_avt} + actor RAVTMediaRenderer/scopeAvt; VLI ops {ChangeTransportSettings playing/stopping/deactivating local VLI (txs),endVLISession,onTXSettingsWillChange→VLI::StopTransmission}; session eviction 'sessionError MUSE_ERROR_SESSION_EVICTED for %s: %s' + evict; sleep timer {'sleep timer fired (r:%ld)','sleep timer set (d:%d r:%d p:%d c:%d)','sleep timer reached (p:%d)','Failed to configure the sleep timer','Invalid duration provided'}; amp preempt {'amp already on','prem-amp turn on at %d.%06d; start up time: %dms','could not preemptively turn on the amp'}; queue events {tracksAdded,qLength,trackIndex,enqueueEvent,'Add to queue %u; URI/MD'}; playmode warnings {'vli play modes ignored (enable/disable flags)','play modes ignored (current/desired)'}; operational override {'changing Operational Override mask from 0x%x to 0x%x','setAVT aborted because operation is overridden'}; seek units {TRACK_NR seek track,REL_TIME %lld.%06lld seek time,TIME_DELTA %lld.%06lld,00:00:00,previous}; settings {change crossfade,change play mode,capChange,groupSize,curCaps,requiredCaps,musicPausedMS}; ret codes {stopRet,seekToTrackRet,seekToTimeRet,playRet,pauseRet,endpointSwitch,episode}

- **name:** AVTransport implementation (avt_impl)
- **session_fsm:** session lifecycle {end direct control,end VLI,"Received play while waiting to be resumed","resume muse session",Destroyed,Preserved,"%s session %s (playing=%s)","Leaving Muse session",leave,disconnect,"Received play for non-muse source","end VLI session","cancel tear down; user started new session"}; session errors {"There is no session on this player.","The sessionId does not match the session on this player.","Internal error logging in to spotify connect"}; CQ suspend {"suspending cloud queue during snooze","suspending cloud queue","suspending cloud queue during alarm"}; muse cmds {"pushing tracks from muse command","request activated muse session","server deferred playback","waiting for content from server","unexpected refresh request","Refreshing AVT expired content","muse session state = %d","recover from cloud queue error"}; chime restore {"restoring after pause chime: ret=%d ar=%d wrca=%d pavt=%d","restoring after stop chime: ..."}; CQ window {"Full itemWindow from Cloud Queue API must be passed to skipToItemWithWindow","Target itemId is not found in the provided window","skipToItem pause"}; playOnCompletion {"ignore %s playOnCompletion; chsrc is already playing","deferred play on completion was canceled","Internal error processing playOnCompletion","Playback attempt failed. Reason: %s","dispatch play","timed job play","alarm timer reached"}; endpoint {"Endpoint switch due to capability change. Current groupcaps: 0x%08x, required: 0x%08x"}; events {"processing PlaybackStateChangedEvent: playstate=%d zoneIx=%d","processing DeviceHasGoneEvent","processing LocalIpChangedEvent","avt halt evt action"}; coordinator {"Became Coordinator of Standalone Group","internalBCOSG(): deactivating local VLI/removeClock"}; constraints {"exceeded internal set AVT URI limit","Line-In playback is not permitted","Invalid AVT media renderer state.","rating.type is not recognized","server rejected request","cloud queue server does not supporting rating","itemId not found","rating is only implemented for cloud queue","Specified seek target exceeds content size","Failed to begin queue operation","Failed to enqueue track"}; TuneIn "Successfully converted TuneIn while settingAVT. old: %s, new: %s"; metadata {TYPE=SNG,TITLE,object.item.audioItem.audioBroadcast,<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">,r:tags,r:tiid,station,"Station information lookup error","Music service lookup error","Skipped container info retrevial.","Failed to get container info"}; "Found %s. Discarding stream metadata"; "Error parsing delegated source area ids, clearing"; isShuffled; spotifyTransferLoadContent
- **coordinator:** BGC FSM {BecomeCoordinatorOfStandaloneGroup,"Attempting to become standalone based on VLI state",BecomeGroupCoordinator,"group member becoming group coordinator",BecomeGroupCoordinatorAndSource{bCloningGCState,bSourceGCClearedContent},"not restoring source state","resetting sinks","stop CHSNK to avoid seamless delegation for adaptive bitrate stream","contacting remote chsnks","configuring local chsnk","Became Group Coordinator and Source","Refreshing expired content during delegation","Resetting programmed radio station during clone","failed (%d), now becoming standalone","asked to become coordinator of non-member group. Clone (%d)"}; VLI snapshot {"using local VLI txs","using VLI State Snapshot","cannot use VLISS for VLI type \[%u\]"}; origin-time {"converted remote time origin, %d.%06d, to local time, %d.%06d","unable to convert remote time origin"}; member moves {"Attempting to move player %s to group coordinated by %s","failed with error %d, rejoin status %d","Attempting to move local player","Attempting move group ... based on VLI state"}; unlink {"secondary clearing avt: %s, gone uuid: %s, primary uuid: %s","unlink from gc (sec)","unlink from gc","failed to copy local GC state to remote GC"}; delegation {"delegation target %s not primary","will try to delegate to %s","DelegateGroupCoordinationTo failed %d","cannot delegate to oneself"}; HT src {"Requested home theater audio source not valid","UUID %s not part of group","remote UUID %s does not support ht audio","UUID %s does not support ht audio","Not playing TV proxy VLI","%s is not capable of home theater playback"}; line-in {"line in disconnected","Clearing AudioInput session on line-in disconnect","player not found","player does not have line-in","BGC line-in: could not resolve source UUID from txs or uri","source %s would not start xmission","transitioning back to playing"}; queue URIs {x-rincon-queue:%s#%u,x-rincon-queue:%s#%s,x-rincon-queue:%s#0,x-rincon-buzzer:%u:o,x-rincon-stream:%s:%s}; errors {"set AVT transport failed","streamUrl has unsupported scheme","Internal error setting URI","Internal error activating shared queue","Unrecognized action value","Internal Error committing media to queue","No tracks added to queue","Internal Error adding media to queue","Tracks added to queue are non-playable tracks","Track object is missing","Internal error setting URI"}; CQ ops {"activate cloud queue %s","loadCloudQueue stop","Full itemWindow from the Cloud Queue API must be passed to loadCloudQueueWithWindow"}; restart policy {"Playback halt must be respected. NOT attempting to restart.","Fatal playback error. NOT attempting to restart.","Nothing played. NOT attempting to restart.","Multiple restart attempts have failed. NOT attempting to restart again.","Playback stopped unexpectedly. Attempting to restart."}; "AVT Context ID mismatch in play end event"; autoplay {"using VLI to autoplay Spotify SMAPI URI: %s (%d)","autoplay Spotify using VLI","ProgramURI changed to: %s","autoplaying %d %s","autoplay failed to get the avtc URI","autoplay failed to start playback","Failure loading autoplay %s (alarm: %d, buzzer fallback: %d)... not playing."}; playEnd "playEnd: ar=%d sr=%d bee=%d avt=%s" + "Business schedule (i.e. alarm) ended" + "restoring after end chime: wrca=%d pavt=%d"
- **restore:** /avt.txt + "Restoring AVT" + "AVT restore timeout" + "AVT modified, unable to reset to prior setting" + "Didn't Restore AVT because it's a group coordinated by a member of our bond" + "Restored AVT from file" + "Issue restoring AVT" + "Restored/Issue restoring play mode %s" + "Restored/Issue restoring crossfade" + "Restored/Issue restoring shared TQ play mode %s" + "bad policy input"; op-override {"preventing autoplay because operation is overridden","preventing alarm because operation is overridden"}; linked rooms {"Found %zu linked rooms during StartAutoplay%s","Found %zu linked rooms during RunAlarm%s",linked,zpAlarm,fb_buzz}; forwarding "forwarded %s to %s, rc=%d" + ": BCOSG"; createSession {"invalid app ID","Invalid account id","Could not find accountId","sum of appId/appContext is too large","createSession stop","deleted uri",create}
- **actions:** extended actions {AddMultipleURIsToQueue,AddURIToQueue,AddURIToSavedQueue,BackupQueue,BecomeGroupCoordinatorAndSource,ChangeCoordinator,ChangeTransportSettings,ConfigureSleepTimer,CreateSavedQueue,DelegateGroupCoordinationTo,EndDirectControlSession,GetCrossfadeMode,GetCurrentTransportActions,GetDeviceCapabilities,GetMediaInfo,GetPositionInfo,GetRemainingSleepTimerDuration,GetRunningAlarmProperties,GetTransportInfo,GetTransportSettings,NotifyDeletedURI,Previous,RemoveAllTracksFromQueue,RemoveTrackFromQueue,RemoveTrackRangeFromQueue,ReorderTracksInQueue,ReorderTracksInSavedQueue,RunAlarm,SaveQueue,SetCrossfadeMode,SetNextAVTransportURI,SetPlayMode,SnoozeAlarm,StartAutoplay,X_DLNA_SeekTrackNr}; args {DelegatedGroupCoordinatorID,NewGroupID,StartingIndex,InsertBefore,DeletedURI,NewPlayMode,NewTransportSettings,CurrentAVTransportURI,AssignedObjectID,NewSleepTimerDuration,CurrentCoordinator,CurrentGroupID,OtherMembers,SleepTimerState,AlarmState,StreamRestartState,SharedQueueTrackList,PrivateQueueTrackList,CurrentVLIState,CurrentAVTTrackList,CurrentSourceState,ResumePlayback,NewCoordinator,RejoinGroup,ClearSource,RestartSink,NrTracks,MediaDuration,EnqueuedURI,EnqueuedURIMetaData,DesiredFirstTrackNumberEnqueued,EnqueueAsNext,FirstTrackNumberEnqueued,NumTracksAdded,NewQueueLength,NewUpdateID,AddAtIndex,RemainingSleepTimerDuration,CurrentSleepTimerGeneration,AlarmID,GroupID,LoggedStartTime,NumberOfURIs,EnqueuedURIs,EnqueuedURIsMetaData,ContainerURI,ContainerMetaData,CurrentTransportState,CurrentTransportStatus,CurrentSpeed,TrackDuration,TrackMetaData,TrackURI,RelTime,AbsTime,RelCount,AbsCount,NewPositionList,QueueLengthChange,ResetVolumeAfter,RecQualityMode(s),PlayMedia,RecMedia}; clone params {x-sonos-clone-gc,x-sonos-gc-cleared-content}
::: details Evidence (1)

- @ 0x10eb0028; avt_impl block

:::


:::

## `avt_lastchange`

**coverage** `strong`

The machinery that builds the transport service's bundled change reports: it collects which playback variables moved and serializes them into one notification. Subscribers get a single message covering track change, state change, and mode change rather than a storm of individual events.

::: details Technical details

<Event xmlns=upnp-org:metadata-1-0/AVT/ xmlns:r=rinconnetworks-com:metadata-1-0/>; standard {TransportState,CurrentPlayMode,CurrentCrossfadeMode,NumberOfTracks,CurrentTrack,CurrentSection,CurrentTrackURI,CurrentTrackDuration,CurrentTrackMetaData,PlaybackStorageMedium,AVTransportURI,AVTransportURIMetaData,NextAVTransportURI,NextAVTransportURIMetaData,CurrentTransportActions,TransportStatus,TransportErrorDescription,TransportErrorURI,TransportErrorHttpCode,TransportErrorHttpHeaders}; rincon-ext {r:EnqueuedTransportURI,r:EnqueuedTransportURIMetaData,r:CurrentValidPlayModes,r:DirectControlClientID,r:DirectControlIsSuspended,r:DirectControlAccountID,r:SleepTimerGeneration,r:RestartPending,r:NextTrackURI,r:NextTrackMetaData,r:AlarmRunning,r:SnoozeRunning}; static NOT_IMPLEMENTED {TransportPlaySpeed,CurrentMediaDuration,RecordStorageMedium,PossibleRecordStorageMedia,RecordMediumWriteStatus,CurrentRecordQualityMode}; PossiblePlaybackStorageMedia=NONE, NETWORK; x-sonos-unknown: scheme

- **name:** AVT LastChange event schema
::: details Evidence (1)

- @ 0x10eb29e8; avt lastchange

:::


:::

## `browse_ids`

**coverage** `strong`

The identifier scheme for the music library: how containers and items get their browse IDs, so 'artist X' or 'playlist Y' has a stable address in the library tree.

::: details Technical details

library {ALBARTIST,LIBARTIST,LIBALBUM,LIBGENRE,LIBTRACKS,LIBPLAYLISTS,LIBSTATIONS,LIBMUSIC}; genre {GNRSUBGNR,GNRTOPARTIST,GNRTOPALBUM,GNRTOPTRACKS,GNRSTATIONS,GNRCHARTS,NEWRELEASES,RHAPRECOMMEND,SUBGNRALLARTISTS,SUBGNRKEYARTISTS,SUBGNRKEYALBUMS,SUBGNRSAMPLER}; global {GLBARTIST,GLBALBUM,GLBGENRE,GLBLEAFGENRE,GLBTRACK,GLBPLAYLIST,GLBSTATION}; artist {ARTTOPTRACKS,ARTALBUM,ARTSINGLESEPS,ARTCOMPILATIONS,ARTOTHERRELS,ARTSTATION}; discovery {GUIDE,ALBUMSFORYOU,FEATPLAYLISTS,STAFFPICKS,PSTATIONS}; search {SEARCHARTISTS,SEARCHKEYWORDS,SEARCHTRACKS,SEARCHALBUMS,SEARCHCOMPOSERS,SSTATIONS,SONOSSEARCH}; radio {STARTSTA,STARTTAGSTA,BROWSETAGPOP,BROWSETAGALPHA,MYRADIO,PERSONALRADIO,LOVEDRADIO,NEIGHBORHOOD,RECOMMENDED,SEARCHTAGS,TAGRADIO,TOPTAGSPOP,TOPTAGSALPHA,RECENT}; genres {Adult and Easy Listening,Eighties,"Public, Talk, and Sports Radio",Pop and Top 40,Country and Folk,Jazz and Blues,"Classic, Hard and Alt. Rock","Soul, Hip Hop and R&B",Dance and Electronic,"New Age, Ambient, Chill-Down"}; locales {France,Germany,Italy,Netherlands,Spain,International-Other}; misc {ZPSTR_BUFFERING,Favorite Stations,Unnamed Room,Media Server}

- **name:** SMAPI browse container IDs
::: details Evidence (1)

- @ 0x10ee7638; browse ids

:::


:::

## `catalog_translation`

**coverage** `strong`

The same catalog-translation facility as catalog_translate: cloud-backed ID mapping with a local cache ('retrieved translation from cache' vs 'connecting to translation service'). Useful for cross-service matching features like 'also available on'. It's what lets the app show a uniform browse tree no matter which of the dozens of services the catalog came from.

::: details Technical details

GET /content/api/catalog/id/%s?destinationServiceId=%s; translateId(objectId,serviceId,targetObjectId); cache {"retrieved translation from cache","translation not cached; connecting to translation service","saved translation to cache","translateId response: %d %s"}; errors {"objectId missing","serviceId missing","targetObjectId missing","cannot perform translateId request; one or more parameters missing"}; actors {zpCatalogTranslation,catalogSvcMgr,targetSid}

- **name:** catalog ID translation (/content/api)
::: details Evidence (1)

- @ 0x10eb3c38; translate block

:::


:::

## `cdn_fetcher`

**coverage** `strong`

The embedded Spotify component's content-delivery downloader: it pulls track data from Spotify's servers with explicit offset and size requests, follows redirects, retries on timeouts, and fails over to the next host when one stalls. This is why Connect playback survives a mid-track download hiccup, because retry and failover are built into the fetcher.

::: details Technical details

fibers {chunk_fiber,httpio,socketio} TF_IS_RUNNING; requests {"downloading '%s' from offset:%i size:%i","requesting stream '%s' offset:%ukb (size:%ukb)","GET %s"}; errors {"httpio get failed (result = %i, status code = %i, total code length = %i)","Redirect #%d to %s","httpio unexpected eof/read failed","reading/got chunk (%ukB -> %ukB) / %ukB (%ukB)","unexpectedly not enough space in destination","This is probably not recoverable","Failed to write to destination buffer","retry on timeout/read error, attempts=%d","failed to download chunk from cdn","switched to a new cdn: cdn_index=%d"}; "Download complete, read %u B in %u ms"; req engine {"%s Request for %s %s (channel_id:%d, fail_count:%d)","%s request failed: %d, fail_count:%d (retry_count:%d)","%s retries exhausted, count:%d, limit:%d","Will retry %s in:%llums at:%llu",dbg_ctx,request_function}; params {cdn_info->num_urls,dest}; stream/key acquisition errors 'Failed to get stream or key (stream_error:%d, key_error:%d)','Failed to get stream key, error_code:%d','Failed to get stream (stream_error:%d)','CDN download failed%s'

- **name:** eSDK CDN fetcher (MOD-CDN)
::: details Evidence (1)

- @ 0x10fde1a8; CDN

:::


:::

## `chirp_sdk`

**coverage** `strong`

The SDK layer of the chirp feature: the internal interface other components call to start and stop the speaker-identification tone, so the room-detection commands don't each reimplement tone control.

::: details Technical details

version chirp-sdk 4.2.3; libvorbis {Xiph.Org libVorbis I 20200704 (Reducing Environment),1.3.7}; API {new_chirp_sdk,del_chirp_sdk,chirp_sdk_free,chirp_sdk_random_payload,chirp_sdk_get_info,chirp_sdk_process_shorts_input/output,chirp_sdk_send,new_chirp,del_chirp,chirp_encode,chirp_decode,chirp_get_symbols,new/del_chirp_payload,chirp_payload_randomise,new_chirp_builtin_profile,new/del_chirp_profile,new/del_chirp_protocol,new_chirp_protocol_from_json_value,chirp_protocol_corrupt_random_symbols,new/del_chirp_acoustic,new/del_chirp_encoding,new_chirp_config,new_chirp_default_config,del_chirp_config,new_chirp_decoder_config_from_json_value,new_chirp_default_voter_configs,new/del_chirp_voter_config,new/del_gf,del_gf_poly,gf_calc_syndromes,gf_poly_concatenate,chirp_levenshtein,chirp_logger_init_with_callback/deinit}; types {chirp_sdk_t,chirp_t,chirp_symbol_t,chirp_payload_t,chirp_profile_t,chirp_protocol_t,chirp_acoustic_t,chirp_encoding_t,chirp_config_t,chirp_voter_config_t,chirp_decode_metrics_t,chirp_logger_t,sample_t,uint8_t,uint32_t,float}; info "Chirp SDK with \"%s\" profile v%u \[max %u bytes in %.2fs\], supporting %u channel(s), using %s modulation."; logger fmt "\[%s:%d\] \[%s\] %s" levels {Print,Debug}

- **name:** Chirp SDK 4.2.3
- **profiles:** builtin {audible,sonos-cdma,sonos_secure_setup,ultrasonic}; schema_version+decoder_config+voters
- **acoustic_params:** {base_frequency,channel_count,channel_interval,envelope_attack,envelope_release,preamble,header_note_duration,header_silence_duration,frequency_interval,body_note_duration,body_silence_duration,portamento,template}; encoding {alphabet_bits,crc_length,message_length_max,message_length_min,polyphony,rs_length_max,rs_length_min}; decoder {fft_size,hop_size,sample_rate_min,payload_metrics_enabled,buffer_metrics_enabled,voters,amplitude_threshold,frame_offset,preamble_threshold,reverb_cancellation_exponent,reverb_cancellation_magnitude,spectral_weighting}
- **errors:** {"hasn't been initialised. Did you forget to set the profile?","internal error prevented the SDK from initialising","Some memory hasn't been freed","Receiving mode has been disabled","profile creation could not be completed","not running"/"already running"/"already stopped"/"already sending","sample rate is invalid, or is too low for this profile","NULL buffer/pointer/empty string","channel requested is not supported by this profile","Invalid frequency correction value","internal issue occurred when processing","profile was generated for a different version. Please upgrade","Logging has been enabled but the corresponding callback has not been set","callback not supported with the selected modulation scheme","not intended to be used with the actual modulation scheme","payload is empty/invalid/contains unknown symbols","Couldn't decode the payload","payload length longer/shorter than max/min","gain level specified is invalid","SDK has reported an unknown error","Audio I/O error","Unknown error code","Send/Receive mode hasn't been enabled","The device is muted. Cannot send data","Chirp message/parity payload has already been allocated","Requested length exceeds maximum/smaller than minimum payload length","Payload does not support symbol sizes beyond 64-bit","Preamble payload has too few symbols (TODO: #741)","Protocol for chirp creation is null","Failed to set meta data","Checksum has been corrupted: %#x","Seeking beyond the end of the array","Bandwidth cannot be measured for equal-tempered settings","Protocol acoustic/encoding is NULL","Preamble must be at least 1 byte long/some length","Preamble code is outside of symbol range","Base frequency is below 20","Channel count is not within acceptable range","Header note length invalid","Body note duration invalid","Attack/Release time invalid","Attack/release combination is invalid","Portamento is invalid","Preamble/Body silence duration invalid","Alphabet bits is not within acceptable range","Min/Max message length cannot be less than 1 byte","Max message length cannot be less than min","Polyphony is outside valid range","Total frame length cannot be more than 256 bytes","Strings have different lengths","Chirp: Runtime assertion failed: "}
- **internals:** chirp-core 4.2.1_7265; GF/RS {new/del_gf,new/del_gf_poly,gf_calc_syndromes,gf_correct_errata,gf_forney_syndromes,gf_find_error_evaluator,gf_poly_{concatenate,mul,div,add,append,scale,zero_pad,strip_leadingzero},trim_gf_poly,new/del_chirp_rs,new/del_chirp_rs_result,copy_chirp_rs}; decoder {new/del_chirp_decoder,chirp_decoder_flush,new/del_chirp_cdma_decoder,new/del_chirp_peaks,new/del_chirp_scorer,new/del_chirp_voter,chirp_voter_set_state,new/del_chirp_weighting,new/del_chirp_template,new/del_chirp_block_buffer,new/del_chirp_fft,new/del_chirp_reverb,new/del_chirp_bitstring,new/del_chirp_biquad_filter,new/del_chirp_multitone,new/del_chirp_codebook,new/del_chirp_rms,new/del_chirp_decorator,chirp_maths_fft_init/deinit}; encoder {new/del_chirp_encoder,chirp_encoder_chirp,chirp_encoder_chirp_array_raw,chirp_encoder_test_signal_init/stop,new/del_chirp_wavetable,new/del_chirp_cdma_encoder}; SDK internals {_chirp_sdk_configure_core,_chirp_sdk_from_string,_chirp_sdk_as_string,_chirp_to_bytes,_new/_del_chirp_sdk_buffer_processed_metrics,chirp_sdk_buffer_metrics_t,chirp_sdk_payload_metrics_t,_chirp_on_received_cdma,_chirp_sdk_allocate/free_decoders_fsk,_chirp_on_sending_fsk,_chirp_on_received_fsk,_chirp_on_sent_fsk}; types {chirp_rs_t,chirp_rs_result_t,chirp_template_t,chirp_decoder_t,chirp_cdma_decoder_t,chirp_note_estimate_t,chirp_note_metric_t,chirp_cdma_match_t,chirp_peaks_t,chirp_peak_t,chirp_scorer_t,chirp_voter_t,chirp_weighting_t,chirp_encoder_t,chirp_wavetable_t,chirp_test_signal_t,chirp_cdma_encoder_t,chirp_block_buffer_t,chirp_fft_t,chirp_reverb_t,chirp_bitstring_t,chirp_biquad_filter_t,chirp_multitone_t,chirp_codebook_t,chirp_rms_t,chirp_decorator_t,chirp_u16_t}; errors {"Wrong len value","field_charac = 0","Value of symbol_bits will overflow a cast","Sum of message and parity lengths out of range","Length should not be negative","Erase count value negative","No frames selected to decode (is sustain period too short?)","chirp_encoder: cannot process an empty block","Invalid note index","FFT block_size must be greater than 1","Bitstring length exceeds maximum supported limit","Resolved \[ %d","Polyphony required is outside allowed range","combinatoric result out of range","event_index maximum value reached"}; alt JSON parser {comment support,"Invalid character value","Unexpected EOF in block comment","Comment not allowed here","Trailing garbage","Expected ,/:/digit before/after","Unknown value","Too long (caught overflow)"}
::: details Evidence (1)

- @ 0x10fcec70; chirp SDK

:::


:::

## `chsnk_detail`

**coverage** `strong`

The internals of the channel-sink implementation: the detailed machinery of how a group member receives, buffers, and stays in sync with the leader's audio feed.

::: details Technical details

seamless handoff {remote: 'starting seamless transition to remote source','txs can't be parsed','handoff wait loop','timed out','sdbt receive packet failed','Old/New packet mismatch (no full frame/id:%u class:%u/%u offset:%u/%u/%u)','Delayed handoff success, offset:%f','Quick handoff success','Completed in %dms','incompatible protocol version'; local: 'itdbt receive packet failed','failed due to END_TX','no packets from old source?','Completed seamless transition to local src (id=%u)',skipped,'seamless source change %s (local)/failed (remote)'}; SNTP {'Starting SNTP server switch.','Completed SNTP server switch in %dms.','SNTP waiting for valid at %d.%06d','SNTP valid %d continue to play %d','noderx I/O error while waiting for SNTP'}; sync math {'local device time went backwards!','prevLT/prevNT diff %06dus overall %+f','Should play at %d.%06d playable %d.%06d offset %f','sample time offset range %.3f-%.3fms; DAC clock abs offset range','max consec large sync errs','small offset error %f','large sync error triggered resync offset %f','error was %.0f ms %s; cpu usage was %.01f%%; sntp v:%d f:%d'}; LSE {skipAheadLocked,'Adjusted tvLocalPlay by %.0f usec','Resync after LSE','waiting for stream reset to recover','stream underflow, uf %u od %u','Play time %d.%06d too far in the future','setOutputToBeginAt(%d.%06d); diff %i ms','Initial sync -- notify samples'}; req frames {'request frame pbe %X','stop detected','control frame type %u','audio type changed','underflow detected','group coordinator uuid: %s, network I/O error 0x%x','logical track boundary at %u','unplayable frame: type %u','pbe %X; %f usec in buffer','hard stop; state %d','noderx pause request','track boundary','scheduled resync frame @ pkt %d'}; sources {local chsrc,local AI,local VLI,remote chsrc,stopped}; notify {'notify frame: stop detected','unflagging stream for drain; %zums buffered','Local time/remote time','lrp:%u, fppc: %u','notifyframe ret %d play time %d.%06d delta %dms'}; events {chsnk refreshing multicast join (NetworkIfaceBouncedEvent/NetworkIpAddrAssignedEvent),RemoteIpChangedEvent,chsrc_state_events,CoordChangeAutoStart,newgc}; ASRC {'Hi-Res music SRC: setCoefficients to StdQ ASRC Coeffs','ASRC will be reset. Sample Rate changed','illegal sample frequency/channels for Hi-Res music','WARNING! This model shouldn't support Hi-Res Music: %s (%s)'}; volnorm {'inserting volume norm: %d @time %d.%06d','found normalization change','requested w/o applying previous'}; streams {as-srcin-chsnk,as-srcin,as-srcout-chsnk,as-srcout,chsnk%d-as,chsnk%d-proc-as,CHSNK,chsnk-pause,chsnk_framed}; decoder {<MusicDecoder><LastActiveDecoder>,m_bCompressed,'starting %s audio decoder at %d.%06d (dc:%d.%06d)','requested stop %d or shutting down %d'}; ducking {Ducking,Unducking,voice2,google,extaudio,'%s playback stream (%s)'}; underflow acct {'boundary, xfade %d','max below stream %u od %u xfs %zu xlvl %zu now ... corked %d','inserting volume norm','stream reset on write','channelization data full'}; service denylist {'Added listener for service %u','stream limit exceeded for service %u','too many failures, denylisted service %u','clearing all denylists and stream limits','resetting all denylist error counters',denylist}; DAC monitor {'Starting to monitor DAC tvLocalPlay:%d.%06d, tvFirstPlayTime:%d.%06d','unable to fire start playback event','Channel Sink in stopped state (dc)'}; chsnk_processor skip machinery: resyncStreamLocked('%d.%06d'), skipAheadLocked buffer accounting 'postSrc:%u=(local:%u+inFlight:%u+src:%u), input:%u, sat:%u dm:%u' with four skip scopes {'tiny skip in local streams only','skipping in CHSNK processor buffer','skipping in all buffers including input','couldn't skip %u usec, resetting','local stream skip failed?'}; drain FSM {'INPUT STREAM IDLE. OUTPUT ACTIVE %d','SKIPPING READ, %zu SAMPLES, DRAIN %d','INPUT STREAM DRAINED','SET OUTPUT TO DRAIN','RESET CHPROCESSING',clearInternalBuffer}; first-frame guard ''%s' is NOT empty when writing the first frame - amount of samples: %zu - inputPT %d.%06d'; notify 'Notify %s of %s underflow'/'reset'; 'Failed to write %zu samples to %s, rtn %zd'; playback-time monitor 'monitorPlaybackTime', source/sink bookkeeping 'm_musicSource = %d/%u' + 'm_sinkState = %d'

- **name:** channel sink internals
::: details Evidence (1)

- @ 0x10eb4860; chsnk block

:::


:::

## `chsrc_chsnk`

**coverage** `substantially decoded`

The channel source-and-sink pair: Sonos's internal protocol for distributing audio between players. The leader is the source, followers are sinks, and this subsystem is the transport that keeps them sample-synchronized across the network.

::: details Technical details

chsrc.cxx (0x10ea8620-0x10ea95dc) = channel SOURCE: the playback engine producing framed audio for the group. chsnk.cxx (0x10eb5400-0x10eb6148) = channel SINK: the receiving player decoder path.

- **name:** CHSRC/CHSNK framed group-audio channel
- **chsrc:**
  - **ops** (22):
  
    ```
    internalStartCloudQueue, internalRefreshCloudQueue, pauseTransition, commitReplaceWhilePlaying, prepareToBeDelegationTarget, setStateSSGoal, internalRateItem, notifyCQError, internalSkipToItem, internalCQSkipToFirstTrack, int_resumeFromPauseWhenPausedAtEndEnabled, int_internalSuspend, switchState, loadCloudQueueFromReq, handleWorkRequestWhileRunning, handleWorkRequestWhileStopped, queueCompletionRoutine, pauseRoutine, stopRoutine, notifyFrame, runQueue, internalNotifyTransportError
    ```
  - **work_request:** RCHSRCReq carries {Op name, TransactionID} ("RCHSRCReq Current Op: %s, Current TransactionID: %d")
  - **framing:** framer origin hint %dms (limiting origin hint); stream offset recovery "Successfully got stream offset %zu"; "Framer context (%d.%06d) not found; use latest"; keys uriFrmrID/uriFrmrName/mtFrmrID/mtFrmrName + uriMimetypeMismatch diag
  - **group_tx:** Grouping a new player -> txfg {mcast,ucast} addr & port setup, "delegating=%d"; LATE-JOINER resend: "resendToLateJoiner: starting send at %u / overslept %ldms next:%u / aborting / restarting for new member at %u"
  - **segment_retry:** fetch-retry FSM: resetSegmentFetchErrors; countSegmentFetchError -> %d; canFetchSegment -> TRUE(no errors\|retry %d) / FALSE(too many errors\|too soon to retry); notifyFailedSegmentFetch
  - **metadata:** ID3 PRIV private-data per logical track ("PRIV data ... too big, only %zu bytes"); oob timed metadata "oob metadata (%d) %s", "now %d next metadata at %d (in %u)"; inline \|ARTIST /\|ALBUM tags
  - **queue:** append %hu tracks to queue; busy-append deferral; "Unable to recover from empty programmed radio queue"; cloud-queue load/skip/error ops
  - **audio_params:** xfade duration (%u -> %u); changing volnorm mode (%d -> %d); inserting volume norm downstream
  - **misc:** cert mgr not set; reportRadioFail; chsrc-state-change + ChsrcSysSettingsEvt events; TRAN_STOPPED; nodetx channel name "nodetx_chsrc"; seek clamp "resume position (%lds) at or past max allowed position (%lds)"; "Overriding command positionMillis with windowPlayhead.positionMillis"
- **chsnk:**
  - **frame_types:** request frame: stop detected \| control frame type %u \| audio type changed \| underflow detected \| logical track boundary at %u; group coordinator uuid + network I/O error in frame ctx
  - **synchronized_play:** SNTP-clock-synced group playback: "SNTP waiting for valid"; scheduled start at %d.%06d; "scheduled resync frame @ pkt %d"; LSE handling "stream underflow uf %u od %u" then "Resync after LSE -- notify samples tvPlay/tvLocalPlay/tvLocalNow/timeToPlayUSec"; "large sync error but continuing play; offset %d usec"; "hard stop; state %d"; noderx pause requests
  - **seamless_transition:** group-source migration: "Starting seamless transition to local src" -> itdbt packet rx, protocol-version compat check, END_TX abort, "no packets from old source?" -> "Completed seamless transition to local src (id=%u)"; timeout + "seamless source change %s (local)"
  - **source_modes:** `local chsrc`, `local AI (audio input)`, `local VLI (virtual line-in)`, `remote chsrc at %d.%06d`, `stopped`
  - **denylist:** per-service source denylist: "Added listener for service %u","stream limit exceeded for service %u","too many failures, denylisted service %u","clearing all denylists","resetting all denylist error counters"
  - **frame_pool:** csfcm frame-context pool: "marking (t:%d)"/"flushing (t:%d)"/add %d.%06d %zu %s %d/%d free/"NO FREE CONTEXTS"/"popping %d.%06d %s (%d.%06d < %d.%06d) %d/%d free"
  - **logging:** status fmt "%s:%05d \[%s\] pos:%u/%u hint:%s\|nextState:%s\|reqOp:%s\|itemID:%s"; bus "noderx"; async streams "chsnk%d-as"/"chsnk%d-proc-as"; "chsnk-pause","chsrc_state_events" events; "vli sntp port %u"
  - **decoder:** starting/stopping %s audio decoder at %d.%06d (dc:%d.%06d); m_bCompressed; "inserting volume norm: %d @time"; DAC monitor "tvLocalPlay/tvFirstPlayTime"; unknown sample-format/0-freq guards; "WARNING! This model should not support Hi-Res Music" capability check
- **confidence:** PROVEN vocabulary+log formats; wire bit-level framing NOT yet recovered (frame type ids, header layout)
- **itbt:** seamless handoff rides ITBTT_CHSRC/LINEIN/VLI InterthreadBlockTransport channels; failures "itdbt receive packet failed","incompatible protocol version","END_TX"
- **chsrc_detail:** framer {"limiting origin hint (was %dms)","framer origin hint, %dms","Framer context (%d.%06d) not found; use latest %d.%06d","Unable to calculate time this frame. m_samplesHandledSinceOrigin:%zu,m_lLastSampleFrequency:%u"}; "RChannelSource Reported Spotify position: %lldms, state: %s, transitionAck: %d"; "Initialize PlayTTL to %u seconds"; "Ignoring playback policy change for context version %s"; "RCHSRCReq Current Op: %s, Current TransactionID: %d"; segment-fetch {"resetSegmentFetchErrors","countSegmentFetchError -> %d","canFetchSegment -> TRUE (no errors)/FALSE (too many errors)/TRUE (retry %d)/FALSE (too soon to retry)"}; PRIV {"logical track MD: %s with %zu bytes of private data","PRIV data for %s is too big, only %zu bytes allowed"}; {"chsrc hint:%d, state:%d","Successfully got stream offset %zu","May have gotten confused","could not get location, using last resume location","Calling updateSharedTQPlayMode in bad context!"}; xfade "xfade duration (%u -> %u)" + "changing volnorm mode (%d -> %d)" + simple:v; queue {"Queue append in progress; not removing tracks","discard audio, no next track/more tracks","abort current"}
- **chsrc_detail2:** mime checks {"URI \[%d\|%s\] vs \[%s\] MimeType mismatch \[%s\]","mimeType (%s) inconsistent with URI (%s)"} fields {mimeType,uriFrmrID,uriFrmrName,mtFrmrID,mtFrmrName,uriMimetypeMismatch} + framer triple \[f:%d\|u:%d\|m:%d(%s)\]; txfg {mcast addr & port,ucast addr & port,cleared} + delegating=%d; late-joiner {"resendToLateJoiner: starting send at %u","overslept %ldms next:%u","aborting","restarting for new member at %u"}; oob metadata {"oob metadata (%d) %s","now %d (%ld) next metadata at %d (in %u)",cache reset/enabled/disabled,\|ARTIST ,\|ALBUM }; CQ {"Overriding command positionMillis with windowPlayhead.positionMillis","fetch 1st window","skip to first track","skip from track position %d->%d (offset %ld.%06ld > duration)","Corrupted queue resuming from pause at track %d","retrieved stream MD %s w/ itemId","recording state as %d %s (%d.%06d) w/ itemId = %s \[%u\]","badging info %s",<Cloud queue error>,"appendTracksFromReq request was not handled!","Unable to recover from empty programmed radio queue","Queue is busy handling append, will try append for radio in next iter"}; queue completion {completion,"hwr clearing old avt tracks nx=%d tr=%d ct=%d tt=%d","Entering queueCompletion","stopping all playback immediately","Queue already completed"}; expiry {"SMAPI radio tracks expiry time hit -- dumping.","Cloud queue policy pause expiry time hit","Queue content expired"}; defer {"waited too long in DEFER_PLAYING state",DEFER_PLAYING,TRAN_DEFER_PLAY}; timing {"logical track boundary at %u","notifyFrameInternal: behind %dms","ahead %lldms. Sleeping %lu ms, playtime=%d.%06d, sent at=%d.%06d, now=%d.%06d","tracking E_WOULDBLOCK count","E_WOULDBLOCK: playtime...","setting origin time to %d.%06d"}; play-hints {waiting,fast startup,future,met,none,crossfading} "play time start hint X"; buffering {"buffering underflow after %lld ms, requesting resync \[BH:%lld, FH:%u%%, FA:%lld, FR:%d\]","recovered buffering underflow after %lld ms","time to first byte %d","No QualityInfo available (framer = %s)"}; track filters {"skipped duplicate/restricted/explicit/denylisted track %s","found a playable track","start playable track","Skipping track for transition to pause","Upcoming Spotify track is not playable (i.e. restricted)","Upcoming Spotify track filtered for explicit content"}; crossfade {"Setting up for %d.%06d sec crossfade.","Not fading","Previous track had a length of %llds","Next track has a length of %llds"}; transport error "%s Transport error %s for account type %u, URI: %s, friendly name: %s, share/server: %s, path: %s, ip: %s, host: %s, extra info: %s, http: %d, framer: %s, ahead: %d, rate: %d" vars {ratelimit,ahead,trRate,chsrc:te}; files {file://%s/sonar-tone/%s,file:///opt/buzzers/%s,file://%s/%s}; URIs {x-rincon-sonarcal URI truncated,x-rincon-configmode URI truncated,%s URI truncated}; "Apple Music: use the derefenced URI to determine the framer, see CP-7253"; "Overriding seek with value from SMAPI service: %lds"; "PlayTTL expired, pausing playback"; "reporting enqueued stream URI instead of track URI"; "clearing queue per policy"; "Could not determine resume location, disabling pause-at-end behavior"; states {TRAN_PLAYING,TRAN_PAUSED,TRAN_STOPPED,PLAYING_START}; "Resume position (%lds) at or past max allowed position"; RAsyncBufferedStream; ChsrcSysSettingsEvt; reportRadioFail; "Grouping a new player"; "notifyIdle: overshot by %ldms (%ldms lj)"; "Resetting required group caps \[0x%08x\] -> \[0x%08x\]"; "Start streaming %s track (%d/%d) %s; origin is %d.%06d (%zu samples since)"; "Streaming enqueued %s"; "Hit the end of the programmed radio queue"; "Queue policy stop on error"; "resuming from pause at track %d, %ld sec"; "Reporting radio failure %s %s"; "unrecoverable error flagged"; "Downloading %s"; odelay; chsrc:framed; chlog; tvSeek={0, 0} framerStartLoc=0 framerResumePos={%ld, %ld}
- **op_enum:** chSrcTransportStatus ops {CHANGE_TRANSPORT_URI,BEGIN_ADD_URI_TO_QUEUE,COMMIT_ADD_URI_TO_QUEUE,REMOVE_TRACK_FROM_QUEUE,REMOVE_ALL_TRACKS_FROM_QUEUE,INVALIDATE_RADIO_TRACK_QUEUE,SEEK_TO_TRACK,SEEK_TO_TIME,SEEK_TO_TIME_WITH_ITEM_ID,SET_PLAY_MODE,SET_CROSSFADE_MODE,REORDER_TRACKS_IN_QUEUE,REMOVE_TRACK_RANGE_FROM_QUEUE,RESET_PRIVATE_QUEUE,COMMIT_REPLACE_QUEUE,SKIP_TO_ITEM,REFRESH_CLOUD_QUEUE,CANCEL_ADD_URI,SUSPEND,PREPARE_FOR_DELEGATION,RATE_ITEM,GET_RESUME_STATE,SET_FIRST_TRACK_MIME_TYPE}
- **chsnk_control_frame_dispatch:** CHSNK request-frame dispatch (f_1030c8xx-0x1030cd00, log domain 'chsnk'): the parsed frame type in r16 is dispatched by cmpwi chain. Observed type values: 0 -> payload handler taking {u16@+0x2a, u8@+0x39} via f_104c2110 + f_1030b468; 5 -> 'audio type changed'; 0xc -> handler taking {u16@+0x2a -> *frameOut, ptr@+0x40}; 1/2/8 -> generic 'request frame: received control frame type %u'; 0x80000040 -> f_1030c338 call path; pre-dispatch r3==0 -> 'request frame: stop detected'; flag byte @+0x38 set -> 'request frame: underflow detected' + 'LSE: waiting for stream reset to recover' (LSE = large sync error); nonzero branch -> 'request frame pbe %X' (playback-boundary event); 'request frame: logical track boundary at %u' carries a u32 track boundary counter; default -> 'request frame: group coordinator uuid: %s, network I/O error 0x%x'. A second consumer logs 'synchronizedPlay: unplayable frame: type %u'. Net-IO states 'net_io_noderx_noframe'/'net_io_noderx_noframe_full'. Confirmed: frame-type dispatch structure and per-type log vocabulary; per-type full payload layouts partially recovered.
- **nodetx:** nodetx.cxx (NodeTransmitter, log tag nodecommon/nodeCommon): transport types ITBTT_UNKNOWN, ITBTT_CHSRC, ITBTT_LINEIN ('resetting InterthreadBlockTransport %s'). Wire behavior: NACK-based retransmit ('nack from %s count=%u, min=%u, max=%u' requests resend of a packet-id range; 'not transmitting %u stale packets to %s'; 'ignore NACK packet with incompatible protocol version: %d'; resync via 'requestResync(%u)'/'Caught resync'/'resetting to pkt:%u off:%u'/'endTransmission'. Crossfade rides in-stream control frames) crossfadeStateForPacketID() walks lPacketNum-1 then -2 ('crossfade on'/'crossfade off - %u'/'no control frames found'). Timing: checkAndMarkFrameDiscontinuity logs 'discontinuity of %lldus'; getLocationAtTime maps playback location->time ('time requested (%d.%06d) earlier than oldest valid packet (%d.%06d)'). Perf counters (txPacketInfo histogram): 'number of times we sent a DataBlock', 'resent an old DataBlock', 'sent a resync NACK', 'sent a data NACK', 'could not send requested NACK'; config keys 'transmit port', 'transmit unicast or multicast address (or none for local-only)', 'last (new) packet id transmitted'. Format line '// %3u %d.%06d %u:%s'.
- **network_test:** networkTestMgr (app/run/nettestresult.txt): 'waiting %d sec before disabling wifi', 'disabling wifi for %d sec', 'enabling wifi', 'Network test started.', 'Opened connection.'/'Successfully connected.'/'Unable to establish connection.', 'Network test complete: %s.': the muse networkTest resource disables Wi-Fi, opens a test connection, then re-enables.
- **sync_play_detail:** synchronizedPlay trace ('%s:%05d \[%s\] pos:%u/%u nextState:%s' per-frame): 'starting to play at %d.%06d','stop detected','track boundary','scheduled resync frame @ pkt %d (%d.%06d)','error at %d.%06d (ret:%x pe:%x)','pbe %X; %f usec in buffer, group coordinator uuid: %s','large sync error but continuing play; offset %d usec','hard stop; state %d','noderx pause request'. Sync telemetry: 'offset range %.3f-%.3fms; DAC clock abs offset range %.3f-%.3fms, max consec large sync errs: %d','Local time:%d.%06d, remote time:%d.%06d','lrp:%u, fppc: %u','notifyframe ret: %d play time/now/delta %dms','unflagging stream for drain; %zums buffered'. LSE recovery: 'LSE: stream underflow, uf %u od %u' then 'LSE: Resync after LSE -- notify samples, tvPlay:%d.%06d, tvLocalPlay:%d.%06d, tvLocalNow:%d.%06d, timeToPlayUSec:%i': 4-timestamp resync computation. Seamless source switch: 'Starting seamless transition to local src.','seamless change to local source timed out','seamless: itdbt receive packet failed','packet from local src has incompatible protocol version','seamless: failed due to END_TX','seamless source change failed (remote)','request frame: audio type changed'. Local-source modes 'chsnk playing local chsrc'/'local AI'/'local VLI'; 'Channel Sink in stopped state (dc:%d.%06d)'; 'starting idle state (sv=%d sf=%d)'; 'bContinuePlaying = %s, network io error = %s'; 'm_bCompressed = %s'; guards 'lNumChannels is 0 - returning before divide by 0','lSampleFreq is 0','Unknown sample format type: %d'; 'unable to fire {start,end} playback event'; normalization 'found normalization change old: %d new: %d' + 'requested w/o applying previous change'.
- **seek_and_restrict:** Seek/stream reset: 'resetting with startup info, origin: %d.%06d, byte offset: %zu, track offset (ms) %u','Reached desired seek byte offset (%zu) @ sample %zu, play %d.%06d','New presentation time, %d.%06d (delay %lld ms)','Processing stream (offset %zu byte / %u ms) @ origin %d.%06d','Playing in past, resync @ %u streamOrigin=%d.%06d samplesSinceOrigin=%zu','Reporting underrun after detecting we're playing in the past by %d ms'/'Resetting reported underrun','Delegation buffering has completed at byte offset (%zu) @ sample %zu',' Resync pending, not processing audio.. exiting framer','Buffering - Detected end of current stream for ID %u'/'Marking track start for %u','Timed out waiting for audio','streaming error: st=0x%X mediaType=%d isPlaying=%s oggHeadersInited=%s m_tvStreamOrigin=%d.%06d sampSinceOrigin=%zu'. Restriction enum: {Full reset,Already Paused,Not Paused,License Restriction,No Previous Track,No Next Track,Restriction Unknown}. eSDK VLI flush: 'Ignore eSDK vli flush during byte offset seek (already flushed)','Flushing eSDK vli audio','Resetting playback state'.
- **noderx_rx_detail:**
  - **status:** confirmed
  - **summary:** RX bookkeeping fields decoded: pid=packet id, ob=oldest buffered, lr=last read, lcg=last good consecutive, lrx=last received. Traces: 'Replacing mismatch data at pid:%u ob:%u lr:%u lcg:%u lrx:%u','Mismatch data count=%u, good at pid:%u ob:%u lr:%u lcg:%u lrx:%u','Received oob packet pid:%u lcg:%u lrx:%u','RX buffer full; ob: %u; lr: %u; lcg: %u; lrx: %u; id: %u','RX discontig; ...','bFinalStartPacket, slrx:%u','resynchronization message pid:%u at:%u ob:%u lr:%u lcg:%u lrx:%u','receiveAudioFrame: readNextDataBlock timed out','wBytesOfDataLeftToRead=%u'.
  - **skip_ahead:** 'skipAheadAddEntry: immed at:%u pid:%u','shifted %u entries','\[%u\] at:%u pid:%u','released %u blocks','too many skip entries'.
  - **rx_histogram:** 'Histogram of received packet info' bucket labels: 'Number of times there was a DataBlock to put data into','Number of times there was no DataBlock available','Number of times an expired packet was received','Number of times a duplicate packet ID was received','Number of times a packet too far into the future was received','Number of times a NACK request was transmitted','Number of times a packet was ignored on startup','Oldest buffered packet ID number','Last read packet ID number','Last good consecutive packet ID number','Last received packet ID number' (key lastReceivedPkt); guards 'histogram callback not defined','histogram labels not defined','index is out of bounds','number of labels not equal to number of buckets','invalid file size'.
::: details Evidence (2)

- @ 0x10ea8620; chsrc.cxx literal block: ops, work-req, tx-fanout, segment retry, PRIV/oob metadata
- @ 0x10eb5400; chsnk.cxx literal block: frame types, synchronizedPlay, seamless transition, denylist, frame pool

:::


:::

## `circuit_breaker`

**coverage** `strong`

A circuit breaker: the reliability pattern that stops the player hammering a dead dependency. After enough consecutive failures to a service or endpoint, calls short-circuit for a cooldown period instead of stacking up timeouts, so the whole system stays responsive even when something it needs is down.

::: details Technical details

"%s CB state transition to \[CLOSED\]"/\[OPEN\]/\[SEMI_OPEN\]; musecommand; history.h

- **name:** circuit breaker FSM
::: details Evidence (1)

- @ 0x10f94550; CB FSM

:::


:::

## `cloud_queue`

**coverage** `strong`

Sonos's cloud-side queue: a track list that lives in your Sonos account rather than inside one speaker's memory. Voice assistants and direct-control sessions schedule tracks here, which is how a queue can persist beyond a player and be shared or restored through your account. The windowed protocol the player uses to pull tracks from it has been fully mapped, and the remaining undecoded pieces are noted in the technical section.

::: details Technical details

resources {itemWindow?,context?,version?,version?updateToken=true&}; params {isExplicit,previousWindowSize,upcomingWindowSize,heardItemId}; truncation {item window,context,version}; outbound request template also stamps X-Sonos-SWGen: %u (software-gen) and X-Sonos-Playback-Id: %.*s alongside X-Sonos-GroupAttribute:/X-Sonos-GroupCapability: on GET+POST forms (CONNECTION: close, ACCEPT-ENCODING: gzip, USER-AGENT, POST adds CONTENT-TYPE: application/json + CONTENT-LENGTH: %zu); response guards 'Truncated context resource: %s','Truncated version resource: %s','Truncated item rating resource: %s','Cloud queue response handler error for %s%s','Connected to cloud queue but failed to get a complete response from %s%s'

- **name:** cloud-queue item-window API
- **work_ops:** ops {int_enterState,internalCQSkipToNextTrack,internalCQSkipToPreviousTrack,internalStartCloudQueue,internalRefreshCloudQueue,pauseTransition,commitReplaceWhilePlaying,prepareToBeDelegationTarget,setStateSSGoal,internalRateItem,notifyCQError,internalSkipToItem,internalCQSkipToFirstTrack,int_resumeFromPauseWhenPausedAtEndEnabled,int_internalSuspend,switchState,loadCloudQueueFromReq,handleWorkRequestWhileRunning,queueCompletionRoutine,handleWorkRequestWhileStopped,pauseRoutine,stopRoutine,notifyFrame,runQueue,internalNotifyTransportError}
- **fsm:** ops {GET_VERSION,GET_CONTEXT,SCHEDULE_WINDOW,SCHEDULE_CONTEXT,GET_WINDOW,POST_RATE}; states {PENDING,ERROR_RETRY,SUCCESS,MEDIA_ERROR,RESET}; transitions "\[%s\]Changing State: %s(%d) to %s(%d)"+Exited/Entering; requests {requestVersion,requestContext,requestWindow,refreshWindow,refreshContext,getWindow,skipToFirstWindow,rateItem,skipNext,skipPrevious,getItemWindow}; req params "requestWindow w/ %s itemId='%s', positionMillis=%d, queueVersion='%s'"; events {contextVersionChanged,contextVersion,authTokenChanged,authTokenRefreshed}; headers {X-Sonos-Playback-Id,X-Sonos-Device-Id}; retry policy {"Retry-After (%ds) not allowed for explicit item request in state %s","Resetting due to unexpected state %s on retry","Will retry(%d) %s request in %d seconds after receiving http error code %d","Retry not allowed in state %s. The retries are exhuasted (count = %d)","request retry loop timed out, failing chsrc interaction","change poll interval to %lld sec"}; fields {units,ResponseCode,RetryWait,Caller,ListEntry,queueType,errorId,heard,skipsRemaining,skipLimitReached,jumpToItemId,WINDOW_MISSING_ITEM_ID,Requested Item Id}; window {"Abort window request because desired itemId is unknown; waiting for skipToItem","refreshWindow is fetching first window","refreshWindow server does not support notification",window-edge-condition}; versioning {"Specify cloud queue version in 'queueBaseUrl' according to Semantic Versioning 2.0.0.","Cloud Queue API 'v%u' is unknown; use v%u with this player.","Cloud queue version is %s, at begin %d, at end %d"}; errors {MEDIA_ERROR:NO_ACCT,CloudQueueHistory,Unknown Account}; ops2 {skipNext,skipPrev,queueCompleted,refresh,PlayTTLExpired}; cqfsm
- **item_window_schema:**
  - **request_urls:**
    - **window:** 'itemWindow?' + query {isExplicit, previousWindowSize, upcomingWindowSize, heardItemId}
    - **context:** 'context?'
    - **version:** 'version?' and 'version?updateToken=true&'
    - **rating:** 'item/%s/rating' (POST)
    - **truncation:** 'Truncated item window resource: %s' / context / version: URL buffer cap errors
  - **item_fields:** `itemId`, `actions`, `mediaUrl`, `mediaFormat`, `sampleRate`, `bitDepth`, `bitRate`, `numChannels`, `dolbyAtmos`, `reportId`, `privateData`, `positionMillisAtSegmentStart`, `policies`, `items`
  - **play_report_fields:** `timePlayed`, `durationPlayedMillis`, `timeSincePlaybackMillis`, `'Truncated TimePlayed post for %s @ %s'`
  - **rating_fields:** `currentlyHeardItemId`, `'Truncated rating post for %s'`
  - **headers:** `X-Updated-Authorization:`, `X-Goog-Updated-Authorization:`, `Retry-After:`, `X-Sonos-MS-Sig:`, `Bearer`, `AUTHORIZATION:`, `X-Sonos-DeviceCert:`, `X-Sonos-Context-TimeZone:`, `X-Sonos-MAID:`, `X-Sonos-Accept-Language:`, `X-Sonos-GroupAttribute:`, `X-Sonos-GroupCapability:`
  - **error_taxonomy:** `Client error`, `Server error`, `Unexpected response`, `Server aborted connection`, `ERROR_LSE`
  - **provenance:** literal cluster .rodata 0x10ec1e64-0x10ec2288: the CQ HTTP request builder + item/report field names
::: details Evidence (1)

- @ 0x10ec1f8c; cq window block

:::


:::

## `cloud_services`

**coverage** `strong`

The registry of which cloud hostnames serve what: authenticated calls, event endpoints, crash upload, feature config, music history, registration, and recommendations each have their own backend. Knowing this map tells you which outage explains which symptom, because lost household settings and lost voice services are different backends.

::: details Technical details

host patterns {sslauth.sonos.com,https://%s-%s.lower-sslauth.sonos.com%s,https://%s.%s%s,lechmere.%s.ws.sonos.com,/firmware/swgen/%u/latest/}; service names {clientdata,crash-upload,feature-config,music-history,lechmere-v1,music-accounts,myaccount,oauth,player-device-files-ab,product-settings,recommendation,registration,service-catalog,sonos-nonprod,apigee.net,smart-play,system-api,system-api-diagnostics,transfer,translate,universal-search,msmetrics}; CSRFToken var; universalCatalogService metadata client (ucsTelemetry): GET '/api/v1/households/%s/services/%u/accounts/%u/catalog/%ss/%s' with X-Sonos-User-Role + User-Agent headers; response JSON fields {durationMs,releaseDate,artists,images}; guards 'Failed to extract serial from Muse account ID','Failed to get muse::TargetIdProvider','\[%s\] is not a valid UC type','Object ID \[%s\], service ID \[%s\], serial number \[%s\] cannot be empty','Failed to parse metadata from JSON string','Metadata has fault or error code','Request type \[%s\] != response type \[%s\]'

- **name:** cloud service host registry
::: details Evidence (1)

- @ 0x10ee7118; cloud service registry

:::


:::

## `content_directory`

**coverage** `strong`

The music-library engine: it builds and holds the index of your shared music folders so 'browse by artist, album, genre' works without re-walking the shares every time. The library commands are its network face.

::: details Technical details

dual URN {urn:schemas-sonos-com:service:ContentDirectory:1,urn:schemas-upnp-org:service:ContentDirectory:1}; locales {zh-CN,ja-JP}; event vars {SystemUpdateID,ContainerUpdateIDs,ShareIndexInProgress,ShareIndexLastError,FavoritesUpdateID,RadioFavoritesUpdateID,RadioLocationUpdateID,SavedQueuesUpdateID,ShareListUpdateID,cdMediaServer}; actions {Browse,CreateObject,DestroyObject,FindPrefix,GetAlbumArtistDisplayOption,GetAllPrefixLocations,GetBrowseable,GetLastIndexChange,GetSearchCapabilities,GetShareIndexInProgress,UpdateObject,SCHED}; args {BrowseDirectChildren,BrowseMetadata,BrowseFlag,RequestedCount,SortCriteria,NumberReturned,TotalMatches,ContainerID,Elements,CurrentTagValue,NewTagValue,SortOrder,TotalPrefixes,PrefixAndIndexCSV,Browseable,IsBrowseable,IsIndexing,SortCaps,SearchCaps}; logs {"UpdateObject returned %d; ObjectID: %s; Elements: %s","notifyUpdateID('%s', %u)","Bad Browse flag %s","Bad Object ID %s","Browse %s ObjectID: %s;","MetaData failed %d"}; DIDL URNs {upnp/|class,upnp/|albumArtURI,rinconnetworks/|http,rinconnetworks/|albumArtist,rinconnetworks/|description}; DIDL/MSMR attrs: WMP registrar IsValidated/IsAuthorized, hchildCount, |policies element, @SearchCriteria, @MemberID, @GetTreble

- **name:** ContentDirectory implementation (cd_impl)
::: details Evidence (1)

- @ 0x10eb3aac; cd_impl block

:::


:::

## `customsd`

**coverage** `strong`

A custom service-discovery block: internal lookup machinery used where the standard discovery protocols don't fit, named by the web endpoint that exposes it. It's part of the player's 'how do I reach this service' toolkit alongside the normal discovery paths.

::: details Technical details

POST /customsd + csrfToken hidden; fields {SID (240-253 or 255) default 255,name (blank erases),secureUri,pollInterval}; authType radio {UserId=Session ID,Anonymous,DeviceLink=Device Link,AppLink=Application Link}; optional {stringsVersion+stringsUri,presentationMapVersion+presentationMapUri,manifestVersion+manifestUri}; containerType {MService=Music Service,SoundLab=Sonos Sound Lab}; caps checkboxes {search,trFavorites,alFavorites,arFavorites(commented out),ucPlaylists,logging,playbackLogging,accountLogging,extendedMD(+radioExtendedMD,playlistExtendedMD gated),disableAlarms,noMultiAccount,mediaUriActions,contextHeaders,deviceCerts,playerIds,contextReporting,userInfo,contentFiltering,manifest,authorizationHeader}; /customsd form fields: 'SID (240-253 or 255):<br/><input type="text" size="4" name="sid" value="255" />','Service Name' name=name size=32,'Secure Endpoint URL:' name=secureUri size=64,'pollInterval' size=12,'Authentication SOAP header policy:' input; csrfToken hidden input

- **name:** /customsd custom service descriptor form
::: details Evidence (1)

- @ 0x10eba2d4; customsd form

:::


:::

## `diag_build_artifact`

**coverage** `confirmed`

There's a separate factory and retail test firmware, the 'diag' build, that isn't the normal product. It exists to run production-line audio tests, to offer a retail-display mode, and to scrub credentials out of settings files before a diagnostic upload leaves the device. You never see it in normal use, but when a support bundle reaches Sonos this is how they know exactly which build produced it.

::: details Technical details

separate 4.4MB diag image (fenway-public, S1-era lineage, GNU/Linux 2.0.0 tag). Exposes production endpoints {/audiotest{line,spkr4,spkr4_14v,spkr4-NA,spkr4snr,spkr8,spkr8_14v,spkr8-NA,spkr8snr,subw,subw-NA,subwsnr},/synctest,/testpoint,/wifictrl}; drives /jffs/audio_analyze with modes {line,spkr4,spkr8,subw}x{nomfgdata,no-aweight,nolimitsfile,snr} + "TEST HARNESS: Perform test... frames %u; every %u; repeat %u; skipBy %u"; serial capture files {audioSerial,cpuSerial,sonosSerial}.txt; /jffs/system/{dsp_disable,play3loudness} toggles; lockup dumps /jffs/lockup.{anacapa.trace,dmesg}; libwifi.so.1 (pre-netstartd WiFi); Pandora xmlrpc endpoints tuner.pandora.com + tuner-beta.savagebeast.com; test.checkLicensing op.

- **name:** anacapad-diag-jffs: the factory/retail diagnostic firmware build
- **rdm_form:** /rdm POST form (full HTML in binary): Retail Display Mode (enable checkbox; "Disable Wifi radio when RDM is enabled"; inactivity timeout minutes (0=disable); tosl checkbox (revert to TOSLink after timeout on PLAYBAR); per-model idle volumes vol:{ZP100,ZP80,ZP90=CONNECT,ZP120=CONNECT:AMP,S5=PLAY:5,S3=PLAY:3,S1=PLAY:1,S9=PLAYBAR}); the historical model-name map is preserved in the form field names.
- **diag_scrub:** credential-redaction sed recipes embedded verbatim: for /jffs/settings/syssettings.xml + securesettings.xml: drop X_* and R_ThirdPartyCredentials settings lines entirely; in SvcAccounts rows, match records with flag pattern \[0-9\]*,\[^,\]*,1\[^,\]*,\[^,\]* and rewrite field-3 to XXXX (password-position masking), preserving backslash-escapes via _DOUBLEBACKSLASH_/_BACKSLASHCOMMA_ staging tokens. This is the privacy filter applied to settings before diagnostic upload.
::: details Evidence (1)

- @ sonos-research/fenway-public/anacapad-diag-jffs; diag image strings

:::


:::

## `dolby_decoder`

**coverage** `strong`

The Dolby decoder front-end plus the Dolby Audio Processing configuration model: the machinery that decodes the surround format TVs and discs send, with its tuning stored in a config file on the device. It's what lets the Playbar turn a TV bitstream into sound.

::: details Technical details

config {"unable to parse %s",app/debug/dsp/dolby_config.json (JFFS override),"override dolby config with jffs",/opt/dsp/dolby_config.json,"loaded player dolby json config","unable to load player dolby json config, loading defaults","Config %s not found, loading default"}; decoder {dlbdec,"dolby decoder unable to decode","<DEC_SampleRate>%u</DEC_SampleRate><LFEPresence>%s</LFEPresence><DEC_ChanCount>%zu</DEC_ChanCount>"}; parse errors {mode state,bass extraction mode,dap profile mode}; staticparams {boost,speakers,directdec,virt_mode,frontangle,heightangle,rearsurrangle}; dynamicparams {oarBassExtraction,dapCutOff,hfilt,vlamp,vmcal}; modes {/default,movie,disable,night,sonosdolbyconfig,"drc config is invalid"}; DRC cutoffs 100HZ-200HZ in 10Hz steps; LRR EQ {lrrse,lrrs1,lrrs2}; PCM decoder {decoder_pcm,"Invalid frame size detected %zu","Unsupported input rate detected %zu","Invalid number of input samples detected %zu","<DEC_SampleRate>%zu</DEC_SampleRate>"}

- **name:** Dolby decoder + DAP config
::: details Evidence (1)

- @ 0x10fe686c; dolby

:::


:::

## `download_status`

**coverage** `confirmed`

The file-download result codes: the shared vocabulary covering not-called, write error, truncation, size error, connection error, succeeded, unchanged, and in-progress. It gives features a uniform answer to 'how is that download going' rather than each fetch tracking its own progress.

::: details Technical details

{ERROR_NOT_CALLED,WRITE_ERROR,TRUNCATION_ERROR,SIZE_ERROR,FILE_ERROR,CONNECTION_ERROR,DOWNLOAD_SUCCEEDED,FILE_UNCHANGED,DOWNLOAD_IN_PROGRESS}

- **name:** file download result enum
::: details Evidence (1)

- @ 0x10ee9a88; download enum

:::


:::

## `dsp_config`

**coverage** `strong`

The signal-processing configuration blob: the device's audio config files decoded as structured records, holding per-model bonded gains and volume breakpoint tables. Missing entries are per-model absences rather than crashes, so a model without a breakpoint table just lacks the curve.

::: details Technical details

files under /opt/dsp {ht_config,ht_config_sat}; nanopb decode {"Successfully decoded DSPConfig","Decoding error %s","DSPConfig file is empty","Unable to open DSP config file %s"}; per-model {"Bonded gain for '%s' not found in DSPConfig","Volume breakpoints for '%s' not found"}; breakpoints {"no default volume breakpoints specified","no bonded volume breakpoints specified, using default instead","volume (%i) and gain (%i) lengths differ in default volume breakpoints","... in bonded volume breakpoints","default (%i) and bonded (%i) volume breakpoint lengths differ","... breakpoints differ","Too many volume breakpoints ... `.nanopb_options` ... MAX_VOLUME_BREAKPOINT_LENGTH","DSPConfigParams conversion successful"}; gravity param; trueplay_version x.x.x.x fmt + range {"base version isnt valid","Start or end of range isnt a valid version","Unable to parse version from end/start string"}; "setNumChannels(%d) greater than max (%d)"; fileio {"DSP file path is longer than buffer","unable to open file","fread","file %s does not exist","Could not get size of file"}

- **name:** DSPConfig nanopb + volume breakpoints
::: details Evidence (1)

- @ 0x10f249f4; dspconfig block

:::


:::

## `esdk_api`

**coverage** `strong`

The embedded component's API surface: the public interface of the Spotify embedded SDK inside the firmware, meaning the calls the player side makes into the Spotify component.

::: details Technical details

registration {SpRegisterConnectionCallbacks,SpRegisterDeviceAliasCallbacks,SpRegisterPlaybackCallbacks,SpRegisterStreamCallbacks,SpRegisterDebugCallbacks,SpFree}; playback {SpPlaybackPlay,SpPlaybackPause,SpPlaybackSkipToNext,SpPlaybackSkipToPrev,SpPlaybackSeek,SpPlaybackSeekRelative,SpPlaybackUpdateVolume,SpPlaybackEnableShuffle,SpPlaybackEnableRepeat,SpPlaybackCycleRepeatMode,SpPlaybackSetAvailableToPlay,SpPlaybackSetDeviceInactive,SpPlaybackSetDeviceControllable,SpPlaybackIncreaseUnderrunCount,SpPlaybackSetBitrate,SpPlaybackSetRedeliveryMode,SpPlaybackIsRedeliveryModeActivated}; connection {SpConnectionLoginBlob,SpConnectionLoginOauthToken,SpConnectionSetConnectivity,SpConnectionLogout,SpGetCanonicalUsername,SpGetLoginUsername}; device {SpSetDisplayName,SpSetVolumeSteps,SpSetDeviceIsGroup,SpEnableConnect,SpDisableConnect,SpSetDeviceAliases} + {SpSetAdUserAgent,SpPumpEvents,SpZeroConfAnnouncePause/Resume,SpConnectionLoginZeroConf,SpPlayUriWithOptions,SpPlayUri,SpPlayContextUri,SpQueueUri,SpPlaybackBecomeActiveDevice,SpRegisterDnsHALCallbacks,SpGetDefaultDnsHALCallbacks,SpRegisterSocketHALCallbacks,SpGetDefaultSocketHALCallbacks,SpRegisterTLSCallbacks,SpPlaybackSetBandwidthLimit,SpNotifyTrackLength,SpNotifyTrackError,SpNotifyStreamPlaybackStarted/Continued/FinishedNaturally,SpNotifySeekComplete,SpSetDownloadPosition,SpLogRegisterTraceObject,SpRestrictDrmMediaFormats,SpRestoreDrmMediaFormats}

- **name:** Spotify eSDK API table
::: details Evidence (1)

- @ 0x10fd3920; Sp API

:::


:::

## `esdk_callbacks`

**coverage** `strong`

The embedded component's callback wiring: the hooks where the Spotify library calls back into the player for events, audio requests, and state changes.

::: details Technical details

playback cb {on_notify,on_seek,on_apply_volume} "Successfully registered playback callbacks: %s, %s, %s"+removed; stream cb {on_data,on_start,on_end,on_flush,on_pos} "Successfully registered delivery callbacks: %s, %s, %s, %s, %s, %s"+removed; signatures {cb_stream_on_start(id=%u, size=%u),cb_stream_on_end(id=%u),cb_stream_get_position(id=%u) = %u,cb_stream_on_seek_position(id=%u, pos=%u),cb_stream_on_flush() = (id=%u, pos=%u)} + connection {on_message,on_new_credentials} registered×3; aliases {on_selected_device_alias_changed,on_device_aliases_update_done}×2; dns {dns_lookup_callback}; socket {set_opt,rd_from,wr_to,readable,writable,local_addresses,...}×17; TLS/debug/error registered; base64 alphabet; registration audit strings: connection callbacks x3, device alias callbacks x2, dns_lookup_callback, socket callbacks x17, TLS callbacks, debug callback, error callback; source path esdk/src/ap_send.c (TeamCity workdir e48167fe44483028); play-end telemetry 'no track ID: played:%zu, ms:%zu' / 'no file ID for internal track: played:%zu, ms:%zu'

- **name:** eSDK callback signatures
::: details Evidence (1)

- @ 0x10fe21f0; callbacks

:::


:::

## `esdk_crypto`

**coverage** `strong`

The embedded component's cryptography: the cryptographic routines inside the Spotify library covering key handling and the secure channel Connect uses.

::: details Technical details

bignum asserts {mod\[mod\[0\]\] != 0,mod\[mod\[0\]\] & BIGNUM_TOP_BIT,mlen <= 2048 / BIGNUM_INT_BITS} = RSA-2048; login asserts {gen/genctx/s/send_buf/send_buf_size != NULL,send_buf_size >= sizeof(s->ctx.hello.data),work_buf_size >= MODPOW_WORK_RAM_SIZE,resp/respsz/buf/bufsz/failed != NULL,bufsz >= SHA1_DIGEST_SIZE + SIG_SIZE + SIG_SIZE + MODPOW_WORK_RAM_SIZE} = SHA1+dual-signature+modpow; "login failed (error code %d)"; "no memory to check signature"; "Platform identifier: '%s'"; "logging in with client ID %s"; "!"hal_get_random_bytes() failed""; circular buffer {cb->used <= cb->size,n <= cb->used,cb->used + data_size <= cb->size,dest != source,circular_buffer_available_space}; module src/login4.c (login4 SRP implementation)

- **name:** eSDK login crypto
::: details Evidence (1)

- @ 0x10fe2824; login crypto

:::


:::

## `esdk_internals`

**coverage** `strong`

The embedded Spotify component's internals: the recovered map of its module structure, state, and how Sonos integrated it. Sonos bundles Spotify's official component rather than reimplementing Connect, and these are its internal parts.

::: details Technical details

build "HEAD-v3.205.205-gd0f06121-dirty" for Sonos_PPC_e500v2s; notify enum {kSpConnectionNotifyReconnect,LoggedIn,Disconnect,TemporaryError("underlying Spotify error = %d, underlying OS error = %d, reconnect attempt in %u seconds"),kSpPlaybackNotifyBecameInactive/BecameActive,Pause,Play,AudioDeliveryDone,Next,Prev,MetadataChanged,ContextChanged,TrackChanged,Shuffle,Repeat}; errors {SpCallbackError "underlying Spotify/OS error","Track playback logging failed. Logout forced.","Connection state changed: %d -> %d","STREAM_CAPPED: underlying error","SP_EVENT_NOTIFY_TRACK_FAILED: underlying error",kSpErrorContextFailed,kSpErrorDuringLogout,"Still logged in. Logging out first.","RelativeSeek %i: current_position:%u -> new_position:%u","No connection available for login","Parsing ZeroConf blob failed with code %d","password is too long","Spotify server did not send image URL","Event overflow:",tsv_lost}; init validation {"api_version provided does not match expected (%d != %d)","Invalid device_type: %d","No memory block (%p) or invalid size (%u)","No unique_id set","display_name or device_aliases not set","Not allowed to fill both display_name and device_aliases","Either display_name or device_aliases must be set and not both","host_name not set with zeroconf_serve:%d","brand_name, model_name, client_id, os_version and/or scopes not set correctly (%d%d%d%d%d)","invalid max_bitrate:%d"}; config rules {scope/os_version/client_id must not be NULL,printable chars,length limits}; credential blob {"Can't invoke SpCallbackConnectionNewCredentials because no blob has been received","received blob has an invalid type","encryption failed","base64-encoding failed","Unable to create reusable login token"}; aliases {"Received alias index when aliases are not in use","Selected alias index out of bounds","No alias at selected index"}; image spotify:image:; trace levels {TPAPI,PLAY,DELIVERY,API_TRACE,VERBOSE,ANL}; trace fmts {"%s(%p, API v%d)","%s \[returned value: %d/%s\]"}; ~60 binary-resident sp_<md5-hex> identifiers (hashed config/credential slots); mod_media_out.c track pipeline: per-track records {pbid,uri,start_pos,paused,file.id} for current/next; pipeline-diff line 'p_diff=%d u_diff=%d n_valid=%d adv=%d skip_n=%d skip_p=%d stop_str=%d stop_deliv=%d stop_seek=%d keep_ms=%d fl=%d s..l=%d cl_u=%d del_dl=%d reenum=%d'; events SP_EVENT_FILE_SIZE/SP_EVENT_SET_DOWNLOAD_POSITION/SP_EVENT_MEDIA_SEEK with stale-ID guards ('Received stale event ... with track pipeline ID %d!','Stale download_id=%u for %d'); 'Clearing track pipeline due to pull playback','Restarting playback position sync timer','Position report (track: %u reason: %s) current: %u last: %u delta: %i','Updated playback pos: %u','Asking integration to seek: %u','Seeking playing track which is not yet delivering, setting pending start position: %u','No playing track. Can not seek.','Track %d duration %u ms','Integration reported invalid track playing/to playback started %u expected %u','Integration notified track %d finished at position %u ms','Integration asked to download with offset for an invalid track','No track to call cb_stream_on_start','stop_audio_out setting pos to %u','current_play_position_ms=%u'; Connect layer: hwptp verbs {replace_state,set_volume,log_out,observe_state,stop_and_observe,product_state_change}, PUT-state engine with jitter + correcting-PUT policy + state-conflict buffer, track_pipeline DELIVERY/DOWNLOAD dual-axis FSM (UPCOMING->PLAYING), TSV/playback_id_v3 telemetry, per-channel volume pending, DRM-format bitmask, CDN-fallback; hwptp observe commands {stop_and_observe,STOP_OBSERVE,'stop observe'} + 'Capabilities updated'; track events INTERNAL_TRACK_STARTED suppresses SP_EVENT_TRACK_STARTED when current_state==NULL; 'Error encoding PlayCommand request!','TL Current position: %u value: %d'; apio.c request-retry layer

- **name:** eSDK internals (v3.205.205)
- **device_types:** {CARTHING,HOMETHING,COMPUTER,TABLET,SMARTPHONE,SPEAKER,AUDIODONGLE,GAMECONSOLE,CASTVIDEO,CASTAUDIO,AUTOMOBILE,SMARTWATCH,CHROMEBOOK}
- **session:** desc fmt "%.*s;%.*s;%.*s;%.*s;tpapi"; device_id assert "result == device_id + SHA1_HASH_LENGTH * 2 && *result == '\0'"; {sonos_ppc,"socket init failed","Failed to initialize module subsystem! Error %d","Failed to initialize tls with %d","Failed to get entropy for PRNG","No data to play, will pause playback if network is not reconnected within %dms","Notifying kSpConnectionNotifyLoggedOut","reinit_session failed with error %d",kSpErrorFailed,validate_no_api_reentry_status,"3.205.205-gd0f06121",accesstoken,GROUP,"Decrypting ZeroConf blob failed","Login with username '%s', blob '%s', tokentype '%s'"}; track notify {"Notify: track %d length: %u ms","track %d error at position: %u ms is '%s'","track %u playback started at timestamp %llu ms","Integration reported invalid track to start/finish","Invalid track %u, expected %u","DLBUFFER CLEAR"}
- **connect_layer:** mod_track_playback.c Connect state machine: inbound hwptp command verbs {replace_state,set_volume,log_out,observe_state/OBSERVE,stop_and_observe/STOP_OBSERVE,product_state_change} + 'Got unknown command from HWPTP: %s'; observe gated 'Device is the Active device, Accepting Observe Command', 'eSDK is inactive. Ignoring state response.', stale-ref guard 'Got previous state reference that doesn't match our current local state reference, ignoring state response'; protobuf request/response pairs {StateRequest/StateResponse+tp_StateResponse,ReplaceStateCommand,AddToQueueCommand,DevicesRequest/DevicesResponse,StateConflictRequest/StateConflictResponse,SetVolumeCommand,PlayCommand,ConnectShuffleRequest,ConnectRepeatRequest,ConnectPullPlaybackRequest,TSV} each with encode ('Error encoding %s!') and decode-failure ('Failed to decode %s: %s', '!"%s failed"') ladders; per-request send errors 'Failed to send %s request (error %d)'; PUT-state engine {'put state request','Schedule additional PUT state. state_id=%s, timestamp=%llu, reason=%d','state_refresh_timer set to %u (received %u, jitter %u)', assert jitter_ms < timeout_ms, 'State update, position: %lu previous position: %lu, empty: %d counter: %lu source: %d'}; correcting-PUT policy {'Ignore correcting PUT state. Missing current_state/Already sent or not required/state_id mismatch %s vs %s','Playback started progressing after %llums. Send/Don't send correcting PUT state for state_id %s'}; state-conflict buffer {'Sending state conflict: machine: %s state: %s paused: %d available: %d position: %u','Conflict cache full, trying to send again','Conflict response pending and %d/%d in buffer. Waiting','State conflict response changed the state_id. Restarting track.'}; device registration {'RE-REGISTERING','Failed to send register request (registered:%d)','Will try again to register in HWPTP in %lu ms','stop_device_registration_timer'}; backend-driven update cadence {'time_to_first_update_requested: %u ms, next_push_ms_played set to: %u ms, periodic_update_time_ms requested: %u ms','Sending a per-track periodic update to track-playback. current-position %u periodic_update_counter %u','Setting next_push_ms_played to UINT_MAX - no periodic updates'}
- **pipeline_detail:** track_pipeline.c: states {NOT_STARTED,IN_PROGRESS,DONE} on two axes DELIVERY_/DOWNLOAD_ plus slot states ->UPCOMING->PLAYING; invariants '!(delivery_state == DONE && download_state != DONE)', '!(delivery_state != NOT_STARTED && download_state == NOT_STARTED)', 'memory_size >= get_required_memory_bytes()'; lifecycle {track_pipeline_initialized,'Clearing track data pipeline','Shifting track pipeline','id: %u: %s ->','id: %u: UPCOMING -> PLAYING',start_track_delivery,end_track_delivery,restart_playing_track_download,end_track_download}; guards {'No PLAYING track when delivery started','No track with DELIVERY:NOT_STARTED/IN_PROGRESS','No track with DOWNLOAD:IN_PROGRESS'}; per-track dump fmt '%s: id: %u, DELIVERY:%s, DOWNLOAD:%s, length_ms: %u file.size: %d file.has_key: %d playback_id: %s uri: %s drm_format: %d media_format: %d error: %d'; latency accounting 'Latency: local=%llu, remote=%llu, playing=%llu, delivered=%llu, played=%llu, resume=%llu' + 'latencies are set to 0 on track transitions'; track-shifting {'shifting to paused state state_id=%s','Shifting state, operation: %d, initial_playback_position: %lu','no advance state returning!','stopping due to too many track errors (%d)!','Next track has no file. Advance!','State has track_idx -1','Reference to non-existing track/state: %d >= %d', index>=0 && index<MAX_NUM_TRACKS / index<MAX_NUM_STATES}; play {'Playing item %d: %s from pos %u','PLAY_FILE %d: %s (seek to %d) bitrate: %u','Tried to play an empty item!','Current state_id changed from '%s' to '%s'. Restarting track.','Play new state machine position: %lu'}; format fallback {TW_FORMAT_CHANGE {fall_back_to_ingested_track,SP_EVENT_REQUEST_BITRATE},'increase bitrate','External URL=%s, num_files=%d\[, state_id=%s\]','No next file in supported format','No ingested file in supported format for upcoming'}; volume path {per-channel pending 'Pending volume %u, %u/%d ongoing','Volume cb error %d channel_id %d, ongoing %u','Sent volume request, volume %u, ongoing %u, ch %d','rate limited'}; device_alias.c list fmt '%d:%s,' + 'Skipping empty alias at index %d' + 'Connectivity: %d Connected: %d Error: %d'; TSV {'TSV: play_track: %s ** ms_played: %llu ** playback_id_v3: %s ** next_playback_id: %s','Storage full, TSV lost!','tsv response error %d'}; version string 'esdk:3.205.205-gd0f06121'; DRM capabilities 'DRM %d media formats: %llu'/'Number of DRM formats: %d capabilities bitmask: %llu'; CDN fallback 'No CDN information provided, falling back to AP immediately' + 'Using %zu kB for %s buffer'; X-Spotify-Connect-Disabled header literal; '\]%c\|Partner %.*s %s' partner tag fmt
::: details Evidence (2)

- @ 0x10fd4c24; eSDK internals
- @ 0x10fdb154; mod_track_playback.c + track_pipeline.c + device_alias.c literal pool

:::


:::

## `evo_decoder`

**coverage** `strong`

The Dolby Evolution decoder: the path used for newer Dolby bitstreams, including the Atmos-era formats. It reserves decoder memory up front and processes frames with its own status reporting, sitting alongside the classic Dolby path for newer content.

::: details Technical details

{"Failed to query static params! %d","unable to close evo decoder error: %d","Failed to extract MD Evolution! ERROR %d","Unable to get evolution metadata","Failed to query Evolution decoder memory! Evolution err: %d","Failed initial query","Failed to allocate enough memory","Failed to allocate %llu static/dynamic byte for Evolution decoder!","Failed To Init Evo Decoder"}; UDC {udcMutex,"ERROR: %d getting frame metadata","Malformed input signal detected %d","ddpi_udc_timeslicecomplete returned %d","ERROR: %d Processing timeslice","ERROR: %d getting timeslice metadata"}

- **name:** Dolby Evolution decoder (DDPI UDC)
::: details Evidence (1)

- @ 0x10fe6f40; evo decoder

:::


:::

## `expat`

**coverage** `strong`

The bundled Expat XML parser: includes accounting against amplification attacks, debug environment variables, and the versioned parser core every document-reading component shares. The single XML engine underneath all the metadata parsing.

::: details Technical details

version expat_2.5.0; billion-laughs accounting "expat: Accounting(%p): Direct %10llu, indirect %10llu, amplification %8.2f" + debug env {EXPAT_ACCOUNTING_DEBUG,EXPAT_ENTITY_DEBUG,EXPAT_ENTROPY_DEBUG}; entropy /dev/urandom + fallback(4); attr types {CDATA,IDREF,IDREFS,ENTITY,ENTITIES,NMTOKEN,NMTOKENS}; xml namespace; errors {no element found,not well-formed (invalid token),unclosed token,partial character,mismatched tag,duplicate attribute,junk after document element,illegal parameter entity reference,undefined entity,recursive entity reference,asynchronous entity,reference to invalid character number/binary entity/external entity in attribute,"XML or text declaration not at start of entity",unknown encoding,"encoding specified in XML declaration is incorrect",unclosed CDATA section} + errors {error in processing external entity reference,document is not standalone,unexpected parser state,entity declared in parameter entity,"requested feature requires XML_DTD support",cannot change setting once parsing has begun,unbound prefix,must not undeclare prefix,incomplete markup in parameter entity,XML/text declaration not well-formed,illegal char in public id,parser suspended/not suspended/parsing aborted/parsing finished,cannot suspend in external parameter entity,reserved prefix xml/xmlns rules,"limit on input amplification factor (from DTD and entities) breached"}; config {XML_DTD,XML_CONTEXT_BYTES,XML_NS,XML_BLAP_MAX_AMP,XML_BLAP_ACT_THRES,XML_GE}; DTD keywords {SYSTEM,PUBLIC,ENTITY,ATTLIST,ELEMENT,NOTATION,CDATA,REQUIRED,FIXED,EMPTY,PCDATA,NDATA,INCLUDE,IGNORE}; decl {version,encoding,standalone}; encodings {UTF-16LE,UTF-16BE,UTF-8,US-ASCII}

- **name:** expat 2.5.0 XML parser
::: details Evidence (1)

- @ 0x10fb2548; expat

:::


:::

## `feature_config`

**coverage** `strong`

The complete cloud-pushed feature document: flags for adaptive streaming, Connect availability, metrics config, voice data collection, partner integrations, low-power mode, tuning data collection, and more. These stored toggles feed the capability gates and explain behavior differences between households on identical firmware.

::: details Technical details

{disableWebSocketPerMessageDeflate,metricsConfigURL,metricsConfigV2URL,preferredRPContainer,spotifyAdaptiveBitrate,enableSpotifyConnectForAllAccts,enableSpotifySMAPIVolumeNormalization,zoneExperiments,metricsService,enableVoiceDataCollection,enableSvcHomeControlLutron,enableSvcPlus,enableAmazonMusicDASH,enableAppleMusicHlsv7,enableTuneInReplacement,enableTuneInMigration,semiSleepConfig,enableTrueplayDataCollection,dropoutContext,enableSystemAPIV2,enable3ChannelSatellites,enableHTSNKv2,disableTlsRsaCiphersuites,enableSPSDataCollection,enablePortableSurrounds,aiseMinThreshold,enableMaxDialogueLevel,enableRemoveMSPCredentialsFromUPnP,thorTimeout,enableChsrcPerfOptimizations,enableUPnPEventingGNDOptimization,enableSecureAlbumArt,enableCEP20ThreadTweaks,smartPlayConfig,debounceWindowMilliseconds,debounceWindowMillisecondsCEP20,useLegacySpotifySmapiPlayback,quickbondingConfig,ssdpAdvertiseConfig,enablePitchfork,enableSslClientCacheRefresh,plink,enableDhcpProxyFailureTelemetry,homeTheaterWifiPerfTelemetry,enableOnDeviceSoundGeneration,enableRadioSocTemperatureTelemetry,enableHomeTheaterWifi6GHzFronthaul,reportHtSurrounds,reportHtSwap,reportPortableSurrounds,wifiTxRateThreshold,wifiLatencyThresholdMillis,requests,frequencyMins,delayRandPct,enableQuickbonding,enabledHT,thresholdDC,dropoutSensitiveDC,ssdpBroadcastOnlyZonePlayer1,ssdpAdvertiseOnlyEssentialServices,numLFEChannels,numHeightChannels,streamDescription,groupingLatency,enableTrueRoom,enableFlexibleSurroundsTuning,enableVirtualHeight,systemResult,numDevices,numUpdatedDevices}

- **name:** featureConfig complete schema
::: details Evidence (1)

- @ 0x10f9bef8; featureConfig fields

:::


:::

## `hermes`

**coverage** `strong`

The control channel layer for Spotify, internally named for its 'hermes' URIs: it carries device state like volume, play, shuffle, and queue between the cloud and the Connect session, plus content-key and offline-restriction channels. It's the internal bridge that lets the Spotify app see and drive your speaker as a Connect device.

::: details Technical details

roots {hm://hwptp/v1/devices,hm://hwptp/v1/tsv,hm://hwptp/v1,hm://hwptp/v2/resolve/%s/%d/%s}; device subs {%s/devices/%s/state,state_conflict,volume,play,set_shuffle,set_repeat,pull_playback,queue}; media {%s/content_encryption_key/%s,%s/cache_key,%s/offline/restrictions}; fields {random,checksum}; "!"Action not handled""

- **name:** hermes/hwptp channels
- **rate_limiting:** {"Spotify-Unavailable-For" header,"Request to %s failed with %d Too many requests","%d Service unavailable (%d)","Rate limiting active, and set to %llu ms","Message not sent: rate limited for %llums more.","Rate limiting deactivated"}; {"Failed to decode HermesHeader: %s","Got hermes push from %s","Got hermes uri %s status_code %d"}; defrag {"Defragmentation buffer size %d, cannot fit extra %d bytes (max size: %d)","Could not fit packet to defragmentation buffer, clearing the buffer"}; req "id %u method %d uri %s %d bytes"; mime vnd.spotify/mercury-mget-request; Mercury method vocab {SEND,UNSUB,GETX} (GETX = the multi-get riding mercury-mget-request); "id %u method %d uri %s %d bytes" is the wire tuple {req_id,method_id,uri,payload_len}; UNSUB; "timeout >= 0 && timeout <= 255"
::: details Evidence (1)

- @ 0x10fd6244; hermes

:::


:::

## `ht_telemetry`

**coverage** `strong`

The TV input-session report: per-session records covering connection type, coordinator identity, durations, input rate, and content type, tagged for TV-usage analytics. Input-session data, lip-sync values, and rig health all get packaged here for the diagnostics that debug theater problems.

::: details Technical details

schema {corrId,cid set/clr,sessionLength,sessionPlayTime,connectionType,GCUUID,GCBootSeq,GCTimeStart,GCTimeEnd,inputRate,dataBurstType,contentType,playSeconds,forced,topoType}; tags {tv_usage,zpHTInputSession}; reset timing telemetry 'ht swap stream reset time %llu us','downmix stream reset time %llu us','CSB reset time %llu us','SPDIF reset time %llu us','ASRC reset time %llu us','NSD reset time %llu us','decoder reset time %llu us','input flush time %llu us','Dialog Extractor reset time %llu us'; injection commands 'Inducing stream error','Inducing signal lost','Inducing rate change','Inducing signal discontinuity','Inducing decoder error','monitoring input','Mode change %s --> %s'

- **name:** TV input-session report (zpHTInputSession)
::: details Evidence (1)

- @ 0x10ea7b44; tv_usage fields

:::


:::

## `http_cache`

**coverage** `strong`

The web cache semantics: the freshness directives mapped to internal states so cached artwork and catalog data stay correct. It's the memory behind fast repeat loads, keeping fetched web content so repeat requests don't hit the network again.

::: details Technical details

directives {stale-while-revalidate,stale-if-error,no-store,private,public}; statuses {get_status_not_found,get_status_fresh,get_status_stale,get_status_stale_revalidate,get_status_stale_use_if_server_error,set_status_populated,set_status_refreshed,set_status_rejected}; "%s for key <%s> in cache <%s>"; "invalid cache key or record on set: \[keylen=%zu\] \[bodylen=%zu\] \[etaglen=%zu\] \[cclen=%zu\]"; "cache not updated due to no-store directive"; 'performInvalidationViaCacheSettingsData() bad cacheSettings recieved \[%s\] \[%s\]'

- **name:** HTTP cache semantics
::: details Evidence (1)

- @ 0x10f96794; httpcache

:::


:::

## `ibt_planner`

**coverage** `strong`

The planner half of intended-target execution: when a cloud command names its players, this generates the target list and parses whether targets were explicit or implied. It's the routing brain that turns 'command X for the household' into 'command X for these specific speakers'.

::: details Technical details

{"already generated ibt plan, no action taken","executing ibt plan for command (%s)","failed to generate target list for command (%s)","failed to generate ibt plan for command (%s)","implicit target parsed \[%s\]","explicit target parsed \[%s\]","invalid intendedTargets parameter","command does not support intendedTargets parameter","invalid muse command body format"}; JWT cert chain {"Unable to parse JWT token","Unable to load root bundle","Can't get client device certs","JWT cert validation finished: %s"}

- **name:** IBT (intended-target) command planner
::: details Evidence (1)

- @ 0x10fac5a4; ibt planner

:::


:::

## `ibt_plans`

**coverage** `strong`

IBT ('intended targets') is how cloud-issued household commands fan out to specific players: a command arriving over the cloud channel is compiled into a 'plan' naming which players execute it. This entry covers the plan format and how plans get built and run.

::: details Technical details

a remote-management command executor: commands named in log domain 'ibt' are compiled into 'plans' (a generated target list: 'failed to generate target list for command (%s)'), then dispatched per-target with per-target results ('\[dispatch\] dispatched (%s) to target (%s), result \[%s\]'); gated by the enablePitchfork feature flag checked at init

- binary anchors: `executing ibt plan for command`, `unsupported IBT command`, `enablePitchfork`

- **unresolved:** full command vocabulary (only 'ibt' command-name seen in dispatch compare), plan serialization format, what the targets are (players in household?), what enablePitchfork bundles
- **mechanics:** executor f_10b985c4: look up command → generate ibt plan → generate target list → for each target '\[dispatch\] dispatched (%s) to target (%s), result \[%s\]'; 'already generated ibt plan, no action taken' = idempotent re-entry; 'unsupported IBT command (%s)' rejects unknown verbs
- **dispatch_vocabulary:**
  - **log_domain:** \[dispatch\] / \[group\]
  - **lines:** `\[dispatch\] dispatched (%s) to target (%s), result \[%s\]`, `\[dispatch\] unsupported IBT command (%s)`, `\[group\] adding player \[%s\] to group`, `\[group\] forwarding player \[%s\]`, `\[group\] created new group \[%s, %s\]`, `\[group\] created new group, but no GC!`, `\[group\] no players or areas were specified`, `validateProtocolVersionCompatibility`
  - **targets:** 'players or areas': intendedTargets names players and/or areas; implicit vs explicit target forms parsed separately
  - **transport_headers:** `bearer`, `X-Sonos-Type`
  - **provenance:** literal block .rodata 0x10ec78a8-0x10ec79dc
- **zone_command_namespace:** The '{verb,namespace}' registry tail at .data 0x11094380-0x110943f4 binds these verbs to namespace 'zones': subscribe, unsubscribe, getActiveZoneList, getZoneDefinition, getZoneDefinitionList, addZoneDefinition, addMissingZoneDefinition, updateZoneDefinition, updateActiveZone, updateZoneMemberSettings, removeZoneDefinition, activateZone, deactivateZone, joinZone, unjoinZone: terminated {0xffffffff,0xffffffff}. Same record format as the main muse_verb_ns_registry @0x110941d8.
::: details Evidence (7)

- @ 0x10fac64c; executing ibt plan for command
- @ 0x10ec7903; unsupported IBT command
- @ 0x10f9c2b4; enablePitchfork
- @ 0x10fac64c; 'executing ibt plan for command (%s)' + dispatch rejection
- @ 0x10b985c4; ibt plan executor: plan→target-list→per-target dispatch
- @ 0x10ec78c0; \[dispatch\] dispatched (%s) to target (%s), result \[%s\]
- @ 0x10a581b0; enablePitchfork gate checked twice in init fn

:::


:::

## `ir_decoder`

**coverage** `strong`

The infrared receiver subsystem: learned code lists for volume up, down, mute, and input, with bounded storage and config on the device. On home-theater products this is how a TV remote's volume keys reach the speaker, turning raw remote pulses into button events.

::: details Technical details

encoding %02x%%20/%02x hex; lists {vol_up_codes,vol_down_codes,vol_mute_codes,input_codes} with "Cannot add X: list full." bounds; config /opt/ir/irconfig.txt + ":vol_up_codes:" keys + "IR not configured"; device {"Failed to open IR device!","Could not get IR file descriptor!","Loading active codes...","IR Controls %s"}; learn FSM {Capturing short code,"Short code is first of a series. Ignored!",Storing short code,"short so far %d and max: %d",Successful short code learn,First short long code learned}; shipped codes: /opt/ir/irconfig.txt = NEC-family {repeat:4f 13 05, vol_up:2,25 01, vol_down:2,27 01, vol_mute:2,29 01}; algorithm {"Pass %d length %d learn count: %d",hex dumps,"first and third passes have different sizes!","don't match!","Insufficient redundancy in alternate code.","Successfully recognized code as Alternating.","Successfully recognized repeat code.","Mismatched short messages in suspected repeat code.","Successfully recognized a non - repeating code.","Learn summary: Success/Repeat style/Alt style %c","Over ten codes received... not a repeat style code","Ignoring excessively long code"}; one-button {"Entered one button learn",waiting/"no longer waiting",UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND,"One button code not found in DB due to timeout","Timeout during IR code learn for target %s"}; embedded remote DB {Sharp,LG / Haier TV L32D1120,Samsung,Panasonic,Toshiba,Mitsubishi,Philips,Pioneer,Dynex,RCA TV 46LA45RQ,Orion TV SLED3280-HDLCD3250,Mitsubishi WD-65638 & WD-60738,JVC TV JLC42BC3000 & LT-19E610,Seiki TV LC-32B56,SuperSonicSC-240 & 491,ViewSonic VT4210LED & VT3205LED,Loewe}; targets {VolUp,VolDown,VolMute}; DB ops {"attempting to add null remote","add remote to full db","too long a controller name","excessively long main/alt/repeat code",Uninstalled all codes}; cloud: submit POST http://ir.ws.sonos.com/IRCode/ XML <IRCode><code><value>%s</value></code><guid>%s</guid></IRCode> (guid via /dev/urandom); lookup "Requesting: %s" → "Code found for remote id \[%s\]!" / "Requested code not found in IR database"; "Outstanding codes yet to be learned: Lengths are: %d, %d, %d"; "Denylisted pyle!"

- **name:** IR decoder + learn + cloud DB
- **mechanics:** debounce FSM {"debouncer: recent becomes true","debouncer: bIsRepeat = true","currently playing/not playing","handling debounced mute/input/volume up/volume Down","will try auto play","handling raw generic repeat/volume up/volume down/volume mute/input code","Handling IR decoder testpoint press action"}; cmds {vol_up,vol_down,IR Volume Up,IR Volume Down,IR Mute,IR Input}; histogram decode {"Histogram contains no peaks at all. decode fails","Histogram contains no second peak.",avgA/avgB,threshold,"biphase pulse too long %d","too many raw bits!","pulse width coding with threshold of \[%f\]","pulse distance coding with threshold of \[%f\]"}; {"*****  unrecognized/recognized %d  *****"}; "Could not read IR data. (%d, read: %zd)" + "IR Event read: %zd, msgcount: %u"; select events selthrd.RIRDecoder.{reset,data,except,timeout}
::: details Evidence (1)

- @ 0x10ea6550; irdecoder block

:::


:::

## `jwt_auth`

**coverage** `strong`

The token layer for modern-API and device credentials: it parses and verifies the signed tokens used in auth flows, which is how the player knows a presented credential is genuine and unexpired. Every authenticated modern-API command passes its token through this layer first.

::: details Technical details

JWT errors {JWT_FAILED_TO_B64_ENCODE/DECODE,INPUT_JWT_MALFORMED,HEADER_INVALID,PAYLOAD_INVALID,SIGNATURE_INVALID,ALG_UNSUPPORTED,ALG_MISSING,X5C_MISSING,X5C_INVALID,X5C_UNTRUSTED,PRIVATE_KEY_MISSING,PRIVATE_KEY_INVALID,OUTPUT_JWT_SIGNING_ERROR,OUTPUT_JWT_INVALID_STATE}; alg HS256; endpoint POST https://oauth.{env}ws.sonos.com/oauth/v4/pdsw; grant urn:ietf:params:oauth:grant-type:jwt-bearer; aud urn:sonos:hhid:/urn:sonos:unit-hhid:; scope playback-control-all; keys {guestPermissionsPolicyKey,network_hash}; PIN {PIN Auth not available PIN not set,Invalid PIN,Invalid or expired nonce,Failed to generate nonce}; errors {Forbidden,Unauthorized,"Failed to get the real/relative time","Failed to stringify JWT","Device failed to generate device/guest token","Invalid Base64 encoded JSON object","Device unavailable due to other requests","Player not securely registered","An unexpected grant type was provided","An invalid JWT was provided. Reason:","A malformed JWT header/payload was provided","Player not in the assertion's aud field","POST /authorizeDevice request failed"}; claims exp+rexp {"exp is missing","Invalid exp value","Expired exp value",same for rexp}; token validation {"Device token not minted in this HH","Token is expired, security settings have changed since the token was issued","Device token expired","missing/invalid expiration time","not minted by this device","Device token is valid"}; statuses {MALFORMED,REVOKED,HOUSEHOLD,INVALID_REQUIRED_VALUE,NOT_MINTED_THIS_DEVICE}; muse_token_inspector; roles {VOICE_ASSISTANT,GUEST,ADMIN,EMPLOYEE}; validation failure names {JWT_FAILED_TO_B64_DECODE,INPUT_JWT_HEADER_INVALID,INPUT_JWT_PAYLOAD_INVALID,INPUT_JWT_SIGNATURE_INVALID,INPUT_JWT_ALG_UNSUPPORTED,INPUT_JWT_ALG_MISSING,INPUT_JWT_X5C_MISSING,INPUT_JWT_X5C_INVALID,INPUT_JWT_X5C_UNTRUSTED,INPUT_JWT_PRIVATE_KEY_MISSING,INPUT_JWT_PRIVATE_KEY_INVALID}

- **name:** muse JWT/device-token auth
::: details Evidence (1)

- @ 0x10f988e4; JWT block

:::


:::

## `korn_events`

**coverage** `strong`

The embedded-Spotify component's event vocabulary, roughly seventy lifecycle events covering initialization, shutdown, web-server state, and the zero-config discovery events for credential transfer and auth tokens. It's how the Spotify integration reports its internal state.

::: details Technical details

{KORN_INITIALIZED,KORN_SHUTDOWN,WEBSERVER_START,WEBSERVER_STARTED,WEBSERVER_UPDATED,ZEROCONF_START,ZEROCONF_DEVICE_ADDED,ZEROCONF_TRANSFER_CRED,ZEROCONF_TRANSFER_STATUS,ZEROCONF_AUTH_TOKEN,ZEROCONF_AUTH_CODE,MDNS_START,MDNS_PAUSE,MDNS_RESUME,MDNS_DEVICES,MDNS_DEVICE_DISCOVERED,MDNS_DEVICE_EVICTED,MDNS_RETRIGGER_DISCOVERED_DEVICES,HOSTNAME,PLAYBACK_RESUME,PLAYBACK_RESUMED,TRACK_RESUME,OBSERVE_PLAY,SKIP_NEXT,SKIP_PREV,PLAYBACK_SEEK,PLAY_URI,QUEUE_URI,QUEUE_FINISHED,TRACK_STARTED,SET_SHUFFLE,SET_REPEAT,INTERNAL_SHUFFLE,INTERNAL_REPEAT,CONNECT_SET_VOLUME,AUDIO_DELIVERY_DONE,CONTEXT_FAILED,TW_UPDATED,PLAY_FALLBACK_FILE,QUEUE_FILE,TRACK_FINISHED,TRACK_FAILED,NOTIFY_TRACK_FAILED,INTERNAL_TRACK_STARTED,MEDIA_SEEK,PLAYBACK_INITIATED,PREVIOUS_POSITION,PLAYBACK_PROGRESS_STARTED,SET_DOWNLOAD_POSITION,NOTIFY_INTEGRATION_PLAYBACK_STARTED,NOTIFY_INTEGRATION_FINISHED_TRACK,NOTIFY_INTEGRATION_HAS_TRACK_LENGTH,NOTIFY_TRACK_ERROR,SEEK_COMPLETE,EXTERNAL_UNDERRUN_COUNT_POINTER,NOTIFY_STREAM_DELIVERED,STREAM_START,STREAM_START2,STREAM_STOP,STREAM_STARTED,STREAM_FINISHED,STREAM_FAILED,STREAM_CAPPED,FILE_SIZE,DATA_DOWNLOAD_LATENCY,CONNECTIVITY,DBG_DECODER_STARTED,DBG_DISCONNECT,DBG_UNDERRUN_TIMEOUT,DBG_DOWNLOAD_UNDERRUN,DBG_MDNS_ANNOUNCE,DBG_RESOLVE,DBG_PERIODIC_STATE_UPDATE,DBG_SET_KEY_RATE_LIMIT_ERROR,DBG_FORCE_STATE_UPDATE,DBG_INTERNAL_CDN_FINISHED,HWP_VERSION,ITEM_LIST_CHANGED,LOGOUT_REQUESTED,AP_CREATED,AP_CONNECT_ERROR,AP_DISCONNECTED,CONNECTION_STATE_CHANGED,AP_LOGIN,AP_SET_SESSION,NEW_PRODUCT_STATE,AP_LOGIN_OFFLINE,LOGIN_OFFLINE_ERROR,TPAPI_STATE_CHANGE,TPAPI_SHARED_STATE_POINTER,CACHE_ID,CACHE_KEY} + {OFFLINE_RESTRICTIONS,CACHE_RESTRICTIONS,OFFLINE_WAS_REQUESTED,API_RATE_LIMIT,AD_STREAM_TIME_POINTER,INIT_DONE,UPDATE_PLAYBACK_POS,SEEK_COMPLETED,MEDIA_SEEK_COMPLETED,ENDSONG,ENDSONG_FAILED,ACCESS_POINT_HOST,CONNECT_NAME,VOLUME_STEPS,GROUP_STATE,DISABLE_CONNECT,UPDATE_AD_USERAGENT,UPDATE_ALIASES,SELECTED_DEVICE_ALIAS_INDEX,CAN_PLAY,LOCAL_APRESOLVE,LOCAL_AP_PING_TIMEOUT,CONTEXT_STATE_POINTER,CONTEXT_OFFSET_OFFLINE,IMAGE_BASE_URL,STORAGE_MANAGER,SM_CACHE_CLEARED,PULL_PLAYBACK,PULL_PLAYBACK_NO_PLAYBACK_INTERRUPTION,UPDATE_CAPABILITIES,LOGGED_OUT,RELOGIN,DOWNLOAD_BITRATE_LOW,DOWNLOAD_BITRATE_HIGH,REQUEST_BITRATE,LOCK_BITRATE,NETLOG_START,NETLOG_CALLBACK,BANDWIDTH_LIMIT,STREAMER_TRACK_PERCENTAGE,OFFLINE_GET_ITEMS_IN_CONTAINER,REDELIVER_AUDIO_AT_RESUME,ACTIVATE_OFFLINE_PLAYER,ACTIVATE_ONLINE_PLAYER,NOTIFY_OFFLINE,CONNECTIVITY_CHANGE_REQUEST,RESOLVE_OFFLINE,OFFLINE_RESOLVE_FINISHED,CURRENT_OFFLINE_ITEM_POINTER,SHUFFLE_SEED}; modules {MediaOut,APConn,Streamer,TrackPlayback}

- **name:** korn event enum (~70)
::: details Evidence (1)

- @ 0x10fd6ce8; korn events

:::


:::

## `korn_kernel`

**coverage** `strong`

The embedded Spotify component's module kernel: a temporary-RAM allocator with strict accounting, an event-count guard, and the pump loop that delivers events to modules. This memory discipline is why Connect survives long sessions without leaking.

::: details Technical details

asserts {korn_ptr->_temp_ram_num_allocs == 0,korn_ptr->_temp_ram_free == (char *)korn_ptr->_temp_ram,aligned_size <= available_ram,korn_ptr->_temp_ram_num_allocs - 1 < MAX_KORN_TEMP_RAM_ALLOCS,ptr == korn_ptr->_temp_ram,sp_korn_event_count() < SP_MAX_EVENTS}; {"module %s pump returned error","%d is more than free space %td","!!! Too many requests/returns of temp ram!","Module requested %zu bytes","Ignoring recursive calls","event_loop_counter--","Initializing module %s","Module %d (%s) failed to initialize.","Event %d discarded, queue full","Module %d failed to shutdown. Possible memory leak."}; timers {"Timer scheduled for now+%lums. #timers=%lu","No free timer slots","Attempting to access unavailable timer. id=%d","Stopping unavailable timer. id=%d"}; korn_ptr/module_manager

- **name:** eSDK korn module kernel
::: details Evidence (1)

- @ 0x10fd690c; korn

:::


:::

## `leds_zp`

**coverage** `strong`

The zone-player LED logic: hardware feature flags, mode flags for states like upgrading and broken-device, brightness control, and the state vocabulary covering join-household, setup, factory-reset, warning, playing, muted, and booting. It maps player states to light patterns, which is the zone-player-specific half of the LED system.

::: details Technical details

HW features "setHwFeatures bHasMicrophone=%s, bHasMuteLED=%s, bHasStatusLED=%s, bHasOnlyStatusLED=%s, bHasHardwareLedSwap=%s, bCanSetWhiteBrightness=%s"; mode flags {R_LED_UPGRADE,R_LED_BROKEN_DEVICE,audiodev_flag,LED_MANAGER_HAS_AUDIODEV}; state "applyLEDModeLocked m_fLedBrightness=%5.2f, m_nextLedPatternPriorityLevel=%u m_lastClr=%d m_fade_effect=%d m_lLEDFlags=0x%llx m_bIsInExclusiveBTMode=%d m_bIsBTConnected=%d m_bHasStatusLED=%d m_bHasMuteLED=%d useOnlyStatusLED=%d"; ops {applyLEDMode,setWhiteBrightness,feedbackFlash,feedbackIrFlash,resumeDefaultLEDPattern\[Flash\],demoModeErrorFlash,executeDiagMode,updateCaptouchBrightness,setLEDBrightness,led_set_turnOffLocked,led_set_updateCaptouchBrightness,led_set_feedbackFlash}; "ignoring apply LED mode. m_bReady=%d"/"due to suspend bypass flag"; pattern fmt "ledWrite pattern: led_ids %08x repeat %d" + "rgb %d %d %d, hold %d, fade %d" + "cksum=%08x, flags=%04x repeats=%u num_steps=%u led_ids=%08x" + "step\[%d\]= r=%02x, g=%02x b=%02x hold_time=%u fade=%u"; HAL {led_get_hal_token,hal_led_diag,hal_led_flash,hal_led_write,hal_led_close,hal_led_brightness,hal_led_ir,led_util_open/close}; saved pattern {"ERROR allocating saved led pattern struct","enqueue restore pattern for LED state:0x%llx","has bFlashMode set. Returning saved pattern","no saved led pattern to flash"}; colors {white,"set default captouch feedback color to %s"}; mutexes {leds_zp mutex,leds_zp_internal}; R_LED flags {UPGRADE,BROKEN_DEVICE,JOIN_HH_OPEN,JOIN_HH,BEGIN_SETUP_MODE,IN_SETUP_MODE,WAC,WAC_TIMEOUT,BREAK_POP,SHUTDOWN,HHID,TRANSFER_REGISTRATION,CONTROL_FEEDBACK,IDENTIFY_PLAYER,AUDIO_OFF,MUTED,FAULT,WAITING_TO_PLAY,WAITING_TO_PAUSE,PLAYING,WARN,DEMO_MODE,DEMO_CONFIGURE_IR}; LED_MODE {FACTORY_RESET,BOOTING,JOIN_HH,JOIN_HH_OPEN,BYPASS_BLOCKED,BYPASS,CLONE_CHECK_FAIL}; "ERROR: bad set_pattern_for_mode(%d)"; "unknown restore pattern for LED state:0x%llx"; setByeByeReason: %s; 'Device has no ethernet ports','Device has more ethernet ports than can be reported, max report size: %zu, num actual ports: %d'; Sonos Radio reauth 'reauthenticated Sonos Radio','failed to reauthenticate Sonos Radio (rc %u)','could not reauthenticate Sonos Radio (no RSvcAccount found)'; 'updating boot sequence due to cert update event'; 'unexpected inbound UPnP %s req from %s: uri=%.256s' gate; additional engine fields {patternRepeatCount,diagMode,m_bHasMicrophone}

- **name:** LED engine (leds_zp)
::: details Evidence (1)

- @ 0x10fba544; leds_zp

:::


:::

## `libflac`

**coverage** `strong`

The bundled FLAC lossless decoder, version 1.3.4: it carries the decoder error vocabulary and the I/O callback set that FLAC streams play through. This handles lossless audio from your music library and services that offer it.

::: details Technical details

"reference libFLAC 1.3.4 20220220"; errors {BAD_HEADER,FRAME_CRC_MISMATCH,UNPARSEABLE_STREAM,OGG_ERROR,SEEK_ERROR}; I/O statuses {WRITE CONTINUE/ABORT,LENGTH/TELL/SEEK OK/ERROR/UNSUPPORTED,READ CONTINUE/END_OF_STREAM/ABORT,INIT OK/UNSUPPORTED_CONTAINER/INVALID_CALLBACKS/MEMORY_ALLOCATION_ERROR/ERROR_OPENING_FILE/ALREADY_INITIALIZED}; states {SEARCH_FOR_METADATA,READ_METADATA,SEARCH_FOR_FRAME_SYNC,READ_FRAME,END_OF_STREAM,ABORTED,MEMORY_ALLOCATION_ERROR,UNINITIALIZED}; metadata blocks {STREAMINFO,PADDING,APPLICATION,SEEKTABLE,VORBIS_COMMENT,CUESHEET,PICTURE}; frame nums {FRAME_NUMBER_TYPE_FRAME_NUMBER,FRAME_NUMBER_TYPE_SAMPLE_NUMBER}; channels {INDEPENDENT,LEFT_SIDE,RIGHT_SIDE,MID_SIDE}; subframes {CONSTANT,VERBATIM,PARTITIONED_RICE,PARTITIONED_RICE2}; cue validation {lead-in div by 588,"at least one track (the lead-out)","lead-out track number 170 (0xAA)","may not have track number 0","track number 1-99 or 170","offsets evenly divisible by 588 samples","at least one index point","first index 0 or 1","index numbers increase by 1"}; PICTURE types {32x32 file icon PNG,Other file icon,Cover front/back,Leaflet page,Media,Lead artist,Artist/performer,Conductor,Band/Orchestra,Lyricist,Recording Location,During recording/performance,Movie/video screen capture,Bright coloured fish,Illustration,Band/artist logotype,Publisher/Studio logotype}; "MIME type printable ASCII 0x20-0x7e","description valid UTF-8"

- **name:** libFLAC 1.3.4 decoder
::: details Evidence (1)

- @ 0x10fbb920; libFLAC

:::


:::

## `lla`

**coverage** `strong`

The low-level audio interface between this program and the kernel's audio driver: it opens output and input devices, negotiates buffer limits, sets latency, and does sample-clock math to compute when a write will actually sound. Its status codes are the vocabulary the rest of the audio stack uses for hardware faults.

::: details Technical details

status codes {WOULD_BLOCK,UNDERFLOW_OVERFLOW,NO_CSB,INVALID_DATA,SUSPENDED}; out {lla_hdmi,"device open failed, unsupported device type %d","opening lla output device","could not get device rc %s lrc %s fd %d","Setting tx latency %u - rc %d","could not get output limits","could not set tx latency rc %d try %u got %u","could not get combined time and output delay"}; timing {"underflow count not cached, returning 0",lla-select,"play time in the past","adjusted play time in the past","%s %s current time %d.%06d play time %d.%06d write at %d.%06d","could not get sample unit time ticks","could not get time","could not get output delay","time requested %d.%06d current time %d.%06d diff %dus devPlayTime: %llu devCurrentTime: %llu diff in sample unit time %llu"}; IO {"fd not set fd=%d","timed out fd=%d","select failed fd=%d errno=%d %s","no output fd %d","low level interface could not fulfill request. error %d uf %u","callback failed, playing zeros %d","commit error (%d) before caching underflow count","could not get buffer information"}; input {"Device is not open","Failed to open the input device:%d, status:%s","id:%d fd:%d min:%u max:%u dflt:%u bufs:%u channels:%u frame:%u jitter:%zu","Failed to get fd","closed input device fd:%d","lla.in.poll","Select returned but LLA fd not set","Failed to get rx time in ticks/rx time","Could not get input delay/input time and delay","Failed to flush the input",liblla_input,lla_in_%s,"Failed to set pipe to nonblocking","Failed to create pipe","pTmpFrame buffer is NULL","Failed to copy buffer contents","Trying to copy more bytes than expected. attempted %d maxbytes %d","could not release buffer after read","Buffer Passed in is NULL","No readable data available. Previous ret:%s fd:%d","read failed status: (%s) fd: %d"}; event objects {"Failed to add event object %s","Invalid object index","Add fd for object %s","Wait for input failed: %d","Spurious Input Event 0x%x","Remove object %s","Failed to find object for releasing","Object %s was not formally released"}; liblla; LLA consistency guards 'LLA number of DACs inconsistent. (%zu != %zu)','LLA total number of DACs inconsistent. (%u != %zu)','LLA sample width inconsistent. (%u != %zu)'; 'failed to set SRC coefficients','start of playback: %d s: (%d: %s) underflows %u'

- **name:** LLA (low-level audio) interface
- **errors_enum:** {EFAULT,EUNDERFLOW,EOVERFLOW,EPARAM,ENODEV,DEVFAULT,NOBUFFER,OUTOFORDER,NOCSB}
::: details Evidence (1)

- @ 0x10fe5ad4; LLA

:::


:::

## `local_settings_mgr`

**coverage** `strong`

The local settings manager: the device's own settings files, each wrapped in a magic header with length, checksum, and counter, plus migration data and subversion detection. It's where this speaker's own config lives, distinct from household-shared values.

::: details Technical details

files {_attrdata.json,_exclude.json,_settings.json,_effective.json,settings_targettypes.json,__location_summation,__migration_data}; models key; magic header "{\"magic\":\"`|_(:/)_|`\",\"length\":%u,\"checksum\":\"0x%08X\",\"counter\":%u}" + trailer "{\"magic\":\"(=^+^=)\",\"version\":11}"; ops \[Mg\] {setLocationSettings("did not advance i:%llu \[c:%llu\]",write failure,"!= locationId","dropping unfamiliar group"),performSingleGroupWriteOperation("validation failure","performing write"),performMultiGroupWriteOperation,setupLocalSettingsManagerImpl("readJsonFile failed","ingestSettingsTargetTypesData failed","ingestLocationFromStorage failed"),getEffectiveSettings("bad groupId"),updateMultipleSettings("ingestPatchAttribute failure"),updateSettings("bad keyId"),readSettingsFromMultipleSettingsGroups,internalReadSettings,internalReadEffectiveValuesLocked("bad keyId","hetType mismatch"),updateGroupSettings}; migration \[Mm\] {persistMigratedDataLocked,"unexpected twoLetterStr","unbalanced collectionStr","missing","not an object"}; patch \[Pc\] {completePatchAttributeIngest "type mismatch vT/aT"}; request auth \[Rq\] {permBits,calculateUserPermissionsJSON,"attempt to subvert read authorization","attempt to update location only settings","attempt to subvert write authorization",setupUpdateAllRequest/setupUpdateRequest/setupGetRequest "not found"/"excluded"/"invalid target type"}; storage \[Gp\] {writeMetaDataToStorage,writeSettingsToStorage,setupSettingsContainerFromStorage "success from old schema"/"settingsStorage not found",setupMetaDataFromStorage}; location \[lo\] {ingestLocationFromStorage "dropping unfamiliar group",ingestLocationSettingsFromCloud,ingestGroupForLocation "attribute not found","dropping unfamiliar setting"}; metadata {effectiveMetaData,locationMetaData}; eventing {LocalSettingsEventing::waitUntilEventNotificationCompletes,notifyOnChange notifySubscribers}; errors {INCORRECT code:%08X,FATAL code:%08X,DATA_CORRUPTION\[%08X\] settings group}

- **name:** local settings manager (locSetMgr)
::: details Evidence (1)

- @ 0x10faf68c; locSetMgr

:::


:::

## `mdns_device`

**coverage** `strong`

The device's own discovery record schema: the fields it advertises covering protocol versions, household ID, port info, variant, and sequence. It's what your phone sees when it spots the player on the network.

::: details Technical details

TXT keys {byebyereason,protovers,minApiVersion,mhhid,hhsslport,variant,mdnssequence,locationid}; "Truncation in formatting service name"

- **name:** mDNS device TXT record
::: details Evidence (1)

- @ 0x10ef7a80; mdns device txt

:::


:::

## `muse_enums`

**coverage** `strong`

The named-constant tables shared by modern-API fields: actor roles, authorization resources, permissions, content types, and credential types. They're the enumerated vocabulary the modern API uses internally for operation types, scopes, and status values.

::: details Technical details

actor/transport {PLAYER_TO_PLAYER,BLE_DTLS}; authz resources {AUTHZPOLICIES,DEVICES,ENTITLEMENTS,SETTINGS,HISTORY}; perms {PLAY_TO_BONDED,STOP_CONTENT,USE_SHARED_QUEUE}; content types {CHAPTER,SMAPI_CONTAINER,EPISODE,PLAYLIST,PODCAST,PROGRAM}; credential types {ACCESS_TOKEN,API_KEY,GUEST_TOKEN_PIN}; SFB perms {SRADIO_HD_CONTENT,SRADIO_SPECIAL_CONTENT,SRADIO_ONDEMAND_ARCHIVE,SRADIO_CAN_SKIP,SFB_BASIC_UI,SFB_COMMERCIAL_MSP,SFB_ESSENTIALS_MSP,SFB_PREMIUM_MSP,SFB_DASHBOARD_ACCESS,SFB_CNTRL_MEDIA_SRCS,SFB_CNTRL_THIRD_PARTY,SFB_RSTC_CONTENT_ACS,SFB_RSTC_SAVE_CONTENT_ACS,SFB_RSTC_SETTINGS_ACS,SFB_RSTC_ALARMS_ACS,SFB_RSTC_MESSAGING_ACS,SFB_RSTC_SAVE_GROUPS_ACS,SFB_SCHEDULES_ACCESS,SFB_MVP}; playback states {BUFFERING,PAUSED,PLAYING}; queue ops {APPEND,INSERT,INSERT_NEXT,PLAY_NOW}; ratings {EXCELLENT,POSITIVE,NEGATIVE,RATED,THUMBSUP,THUMBSDOWN,SHELVED}; registration {LEGACY_REGISTERED,SECURE_REGISTERED,TRANSFER,PREP_TRANSFER}; netmode {NETMODE_SONOSNET_WIRELESS,NETMODE_WIRED,NETMODE_WIRED_NO_WIFI,NETMODE_STATION,NETMODE_SATELLITE_V1,NETMODE_SATELLITE_V1_WIRED,NETMODE_SATELLITE_V2,STATION_SATELLITE}; roles {VOICE_ASSISTANT,GUEST,ADMIN,EMPLOYEE}; FORBIDDEN; USB_C; GOOGLE; recurrence + {alarm states: ALARM_PENDING,ALARM_SNOOZED,ALARM_FIRING,INTERRUPTED; buttons: PLAY_PAUSE,MUSIC,DPAD_UP/DOWN/LEFT/RIGHT/SELECT; sources: CLOUD,HT_PLAYBACK,HT_POWER_STATE,AIRPLAY,AUDIO_CLIP,SPEAKER_DETECTION,FIXED_VOLUME,ROOM_DETECTION,IR_CONTROL,ALEXA_CBL; errors: CHARGER_NOT_COMPATIBLE,CONFIGURING,NO_LOGICAL_ADDRESS,EXTRALOCAL; abort: ABORT_INCORRECT_MODE,ABORT_NO_SOURCE,ABORT_INVALID_OP,ABORT_REFUSED,ABORT_UNDETERMINED,REPLY_TIMEOUT,ROOT_INDIRECT,BROADCAST_BLOCKED; groups: MUSICOBJECTID,GROUP_STATUS_MOVED,GROUP_STATUS_UPDATED; update: UPDATE_COMPLETE,INFO_FILE_WRITE_FAILED,BSU_FAILED,UPGRADE_MGR_SPAWN_FAILED,MANIFEST_DOWNLOAD_FAILED,MANIFEST_PARSE_FAILED,UPDATE_NEVER_RUN,FINAL_RESULT_UNKNOWN; surrounds: VERTICAL_WALL_BELOW,FLEXIBLE_SURROUNDS,PORTABLE_SURROUNDS; sec: SECURE,SECURE_REG,UPNP_OVER_TLS; indexer: ADD_IN_PROGRESS,ADD_COMPLETE,PENDING_REINDEXING,REINDEXING_IN_PROGRESS,REINDEXING_COMPLETE,REPLICATION_IN_PROGRESS,REPLICATION_COMPLETE,PENDING_DELETE,DELETE_COMPLETE; sonosnet: SONOSNET_DISABLED,SONOSNET_DISABLE_TEST; conn: ONLINE,TERMINATING; chirp: INAUDIBLE_WIDE,MULTI_INAUDIBLE_WIDE,MULTI_AUDIBLE; timers: TIMER_PAUSED,TIMER_RINGING; power: TO_STANDBY,POWERING_DOWN,POWERING_UP,SMART_DOCKED,PRIMARY_PLAYBACK_STARTED,POWERING_UP_UPDATED,WAKING_UP_FROM_USER,PRIMARY_NETWORK_STATUS_CHANGE; volume: FIXED,PASS_THROUGH; wifi: ACK_AWAIT,WIFI_DISABLING,WIFI_DISABLED,ACK_NOT_RECEIVED; positioning: APPLE_MOBILE_DEVICE,ANDROID_MOBILE_DEVICE,STIMULUS_PLAYBACK_COMPLETE,BEARING,DISTANCE,ACOUSTIC_SPACE_MAP,MEASUREMENT_RESULTS,MEASUREMENT_RAW_AUDIO,IMPULSE_RESPONSE_AND_AUDIO; HEY_SONOS; RADIOLIST}

- **name:** muse enum tables
::: details Evidence (1)

- @ 0x10f9949c; enum tables

:::


:::

## `muse_errors`

**coverage** `strong`

The error registry every modern-API command can return, around eighty entries covering generic failures, playback failures, session failures, and infrastructure failures. These named errors are the contract clients should branch on rather than on free-text messages.

::: details Technical details

results {CREATED,ACCEPTED,SUCCESS_NO_CONTENT,SUCCESS_NOT_MODIFIED}; playback {ERROR_PLAYBACK_FAILED,NO_CONTENT,NO_PLAYABLE_CONTENT,EXPLICIT_NOT_ALLOWED,EXPIRED_TOKEN,NOT_PLAYABLE,SPOTIFY_CONNECT,FAILURE_TO_ENQUEUE,CLOUD_QUEUE_SERVER,SKIP_LIMIT_REACHED,PLAYBACK_STREAM_LIMIT,PLAYERS_HAVE_INCOMPATIBLE_FIRMWARE}; session {SESSION_IN_PROGRESS,JOIN_FAILED,EVICTED,INVALID_SESSION_ID,NOT_DESIGNATED_DEVICE}; accounts {PREFERRED_ACCOUNT_NOT_SET/NOT_FOUND,ACCOUNT_FULL,INVALID_ID,NO_DEFAULT_FOUND,REAUTH_REQUIRED,UPGRADE_REQUIRED,WRONG_SERVICE}; update {NO_UPDATE_AVAILABLE,INVALID_UPM_FORMAT,INSUFFICIENT_POWER_FOR_UPDATE,UPDATE_IN_PROGRESS}; misc {ALARM_NO_SPACE,ALARM_BAD_TIME_SERVER,AREAS_READ_ONLY,AUDIO_CLIP_ID_NOT_FOUND/_MEDIA_ERROR/_PAUSE_CONTENT_FAILED/_VOICE_ASSISTANT_PLAYING,CACHE_NOT_FOUND/_RECORD_NOT_FOUND,CANT_CONNECT\[_REMOTE\],DEVICE_ALREADY_REGISTERED/UNAVAILABLE,INVALID_ACTION,DOWNSTREAM_CONNECT_FAILED,SHARES_CONFLICT/NO_SUCH_SHARE/NO_SPACE/REQUEST_FAILED,STIMULUS_ALREADY_PLAYING,MICROPHONE_NOT_ENABLED,NO_POSITIONING_RESULTS,UNSUPPORTED_POSITIONING_REQUEST,SVC_DISABLED,TIMER_NOT_FOUND,UNSUPPORTED_VOLUME_MODE,INVALID_RESOURCE,ROOM_DETECTION_SIGNALLING_FAILED/BUSY,GROUP_CHANGED}; generic {COMMAND_FAILED/TIMEOUT,CONTENT_TYPE_NOT_SUPPORTED,DISALLOWED_BY_POLICY,INTERNAL,INVALID_AUTH_HEADER/CERT/OBJECT_ID/PARAMETER/SYNTAX/HEADER/LENGTH/TRANSPORT,TARGET_ID_NOT_FOUND,LOAD_COMMAND_FAILED,MISSING_PARAMETERS,NO_PERMISSION,NOT_AUTHORIZED,NOT_CAPABLE,PRECONDITION_FAILED,EXPECTATION_FAILED,QUEUE_FULL,RESOURCE_GONE/CONFLICT,REQUIRES_GROUP_COORDINATOR,SERVICE_NOT_AVAILABLE/CONFIGURED/SUPPORTED/UNAVAILABLE,UNSUPPORTED_NAMESPACE/COMMAND/REQUEST/REQUEST_METHOD,API_KEY_VALIDATION_FAILED,NYI,CMD_FUTURE,CMD_REMOVED,INSUFFICIENT_RESOURCES,INCORRECT_STATE,INCOMPATIBLE_API_VERSION,INCOMPATIBLE_CLIENT_VERSION}; param validation {MISSING_VALUE,UNEXPECTED_TYPE,"Parameter failed timestamp validation","not a valid Muse error code","out of range: at or below minimum of/above maximum of","Found unexpected array/object","Missing required field","Unable to coerce string to number/boolean","number of entries below/above minimum/maximum"}

- **name:** muse error-code registry
::: details Evidence (1)

- @ 0x10f9508c; muse ERROR enum

:::


:::

## `muse_events`

**coverage** `strong`

The event types a modern-API client can subscribe to, around sixty-five of them covering playback status, volume, group topology, sleep timer, tuning status, battery, and more. Subscriptions work per-namespace, and this is how the modern API delivers state changes instead of polling.

::: details Technical details

{accessorySwapStatus,tvAudioSignalStatus,activeZonesChange,zoneDefinitionsChange,zoneError,alarmClock,alarmVersionChange,areasVersionChange,audioClipStatus,audioInput,availableSoftwareUpdate,avTransport,batteryStatus,wirelessNetworkStatus,microphoneSwitchStatus,waterStatus,bluetoothPairingStatus,bluetoothConnectionStatus,poeStatus,lineInStatus,wiredSubConnectionStatus,cloudRegistration,connectionManager,contentDirectory,deviceProperties,diagnosticSubmissionResults,diagnosticMetadata,effectiveSettingsDataChanged,entitlementsVersionChanged,extendedDeviceStatus,extendedPlaybackStatus,favoritesVersionChange,groupCoordinatorChanged,groupManagement,groupRendering,hdmiStatus,historyVersionChanged,householdUpdateStatus,upgradeManager,htControl,indexerStatus,musicServices,musicServicesChanged,playbackMetadataStatus,playbackStatus,playlistsVersionChange,positioningSessionStatus,positioningSessionError,positioningDeviceStatus,renderingControl,sessionError,sessionInfo,settingsVersionChanged,settingsDataChanged,settingsPlayerSettingsChanged,sleepTimerStatus,systemProperties,trueplayStatus,speakerPresenceStatus,speakerPresenceRateChange,trueroomAdaptationStatusEvent,trueroomCalibrationStatus,trueroomStatusEvent,virtualLineIn,voiceAccountsVersionChange,zoneGroupTopology,upnpEvent}

- **name:** muse event-type registry
::: details Evidence (1)

- @ 0x10f960df; muse event types

:::


:::

## `muse_types`

**coverage** `strong`

The 203 object-type names the cloud API's schema can use, stored as one contiguous list: every field name, event name, and object shape the modern protocol speaks. Together with the field schema it's the complete vocabulary of the API's data model.

::: details Technical details

203 contiguous alphabetical type names @0x10f975c0-0x10f98568 - the TYPE-NAME space used in spec {field,type} pairs (semantic spec idx -> table\[3+idx\]). Followed by muse_target_validator + errors {guest_access_disallowed,forbidden,not_authorized,not_found}. Types are object-schema names; 'upnpEvent' (11 identical entries, one per bridge namespace) is the universal value/event wrapper appearing as the type of nearly every status field.

- **name:** muse type registry: spec-pair type index names
- **types** (203):

  ```
  accessorySwap, accessoryWifiPsk, accessPolicyControl, accessPolicySetting, accountError, acousticMeasurement, acousticMetrics, activeZoneList, activeZoneMember, actuator, alarmDescription, alarmList, alarmRunningState, versionChanged, allowAirplaySetting, allowDirectControlSetting, allowLineInSetting, amazonAlexaAccount, amazonAlexaSetup, asyncRequestAck, audioConnectorStatus, authorizationGrantHeader, authorizationGrantPayload, authorizationGrantResponse, authzModifier, authzPermission, authzPermissions, authzPolicyKey, authzPolicyKeyLechmere, authzTokenStatus, authzUser, batteryCells, microphoneSwitch, waterState, bluetoothPairing, poeState, wiredSubStatus, bleMeasurement, bluetoothDevice, bluetoothPolicySettings, channelMapPair, chirpRequest, cloudDevice, cloudRegistrationStatus, commandHeader, contentMetadataBlob, contentPagedResources, contentPageInfo, contentResource, createInviteResponse, deeplink, deviceInfo, deviceSoftwareUpdateStatus, diagnosticInfo, diagnosticSubmissionMetadata, diagnosticSubmissionResult, directControl, discoveryInfo, edidStatus, settingsChanged, enableContentAccessSetting, entitlement, entitlementsList, eqSettings, ethernetPorts, ethernetPortStatus, externalId, favoritesList, feature, featureConfig, featureConfigDropoutContext, featureConfigHomeTheaterWifiPerfTelemetry, featureConfigMetricsService, featureConfigPlink, featureConfigQuickbonding, featureConfigSemiSleep, featureConfigSmartPlay, featureConfigSpotABR, featureConfigSsdpAdvertiseConfig, featureConfigZoneExperiment, geoLocation, getUsersResponse, globalError, globalSettings, groupInfo, homeTheaterInputFormat, homeTheaterOptions, householdSoftwareUpdateStatus, idResponse, irControlStatus, lineInSettings, lineInSettingsGroup, lineInStatusInfo, lineInStatusList, localVoiceSettings, loopbackTimeoutControl, manufacturingData, metadataStatus, musicServiceAccount, networksList, networkTestResult, patchEffectiveAllSettingsGroups, patchEffectiveAnyOneSettingsGroup, patchPlayerAllSettingsGroups, patchPlayerAnyOneSettingsGroup, playbackPolicy, playbackSettings, playerAllSettingsGroups, playerAnyOneSettingsGroup, playerSettings, playerSettingsEvent, playerSetError, playlistsList, playlistTrack, playMode, portableSurrounds, positioningDevice, positioningDeviceMeasurementList, positioningDeviceStatusInfo, positioningMap, positioningMeasurement, positioningMeasurementCapability, positioningMeasurementCapabilityList, positioningSessionErrorInfo, positioningSessionRequest, positioningSessionStatusInfo, positioningSpatialData, positioningTelemetry, postHistoryConfig, preferredLanguageSetting, protectedAdminSettings, protectedSettings, publicSettings, queueItem, queueItemWindow, radioShow, rateStatus, recurrenceRule, redeemInviteResponse, RegistrationToken, registry, registryCollection, relativeTimeStamp, replicatedAreas, reportOptions, restrictedAdminSettings, sdkVersions, secureRegCert, secureRegCertMetadata, sessionStatus, settingsGroupMetadata, share, sharesList, shareListStatus, shareStatus, smartplayContentResource, softwareUpdate, softwareUpdateOptions, sonosDeviceNonce, soundSwapRequestResponse, speakerDetectionStatus, speakerPresenceEffectiveRate, speakerPresenceResult, speakerPresenceResultList, stimulusTuningEnabled, swapModelInfo, systemNameSetting, timer, timeVal, timeZoneInfo, tokenStatus, trackQuality, transitionToShipModeStatus, translatedObjectId, translatedObjectIds, translation, transportSetting, trueplayConfiguration, trueroomAdaptationStatus, trueroomStatus, trueroomEstimatorConfig, trustedAccessories, uniqueSetTestData, uniqueSetTestItem, universalMusicObjectId, updateItem, upnpParameter, upnpResponse, usageContextSetting, videoContent, virtualLineInSource, voiceAccount, voiceAccountsList, voiceAccountProfile, voiceWakeWord, weatherConfig, wifiDisable, zoneDefinition, zoneDefinitionList, zoneMember, zoneMemberSettings, zoneMemberSettingsMap, zoneMemberState
  ```
- **consumer_evidence:** live PIC-formed refs: settings-group handlers→settingsGroupMetadata (f_10aa1e80..f_10aa2854); zone ops→zoneDefinition/zoneDefinitionList/zoneMemberSettingsMap (f_10b8c5bc,f_10b8d72c); VLI→virtualLineInSource/wifiDisable (f_10a77630..f_10abdd54); geo→geoLocation (f_10b3670c..); shares→shareStatus (f_10afa388); deeplink/deviceInfo (f_10b061c8,f_10a50920); activeZoneMember/actuator (f_10a11634..); playMode (f_10a11284..); timeVal/timeZoneInfo (f_10b38910..); manufacturingData (f_10a0996c..); usageContextSetting (f_106c55c4..); idResponse (f_10ab3874..); replicatedAreas (f_10733fb4,f_1077fe2c); post-name region 0x10f98578-0x10f986e8 (muse_target_validator+errors) consumers f_10692d10,f_10698074..,f_109ed0a8,f_109ed6e0,f_109ee960..,f_109efc88
- **type_names:** {accessorySwap,accessoryWifiPsk,accessPolicyControl,accessPolicySetting,accountError,acousticMeasurement,acousticMetrics,activeZoneList,activeZoneMember,actuator,alarmDescription,alarmList,alarmRunningState,versionChanged,allowAirplaySetting,allowDirectControlSetting,allowLineInSetting,amazonAlexaAccount,amazonAlexaSetup,asyncRequestAck,audioConnectorStatus,authorizationGrantHeader/Payload/Response,authzModifier/Permission(s)/PolicyKey/PolicyKeyLechmere/TokenStatus/User,batteryCells,microphoneSwitch,waterState,bluetoothPairing,poeState,wiredSubStatus,bleMeasurement,bluetoothDevice,bluetoothPolicySettings,channelMapPair,chirpRequest,cloudDevice,cloudRegistrationStatus,commandHeader,contentMetadataBlob,contentPagedResources,contentPageInfo,contentResource,createInviteResponse,deeplink,deviceInfo,deviceSoftwareUpdateStatus,diagnosticInfo,diagnosticSubmissionMetadata,diagnosticSubmissionResult,directControl,discoveryInfo,edidStatus,settingsChanged,enableContentAccessSetting,entitlement,entitlementsList,eqSettings,ethernetPorts,ethernetPortStatus,externalId,favoritesList,feature,featureConfig,featureConfigDropoutContext,featureConfigHomeTheaterWifiPerfTelemetry,featureConfigMetricsService,featureConfigPlink,featureConfigQuickbonding,featureConfigSemiSleep,featureConfigSmartPlay,featureConfigSpotABR,featureConfigSsdpAdvertiseConfig,featureConfigZoneExperiment,geoLocation,getUsersResponse,globalError,globalSettings,groupInfo,homeTheaterInputFormat,homeTheaterOptions,householdSoftwareUpdateStatus,idResponse,irControlStatus,lineInSettings/Group/StatusInfo/StatusList,localVoiceSettings,loopbackTimeoutControl,manufacturingData,metadataStatus,musicServiceAccount,networksList,networkTestResult,patchEffectiveAllSettingsGroups,patchEffectiveAnyOneSettingsGroup,patchPlayerAllSettingsGroups,patchPlayerAnyOneSettingsGroup,playbackPolicy,playbackSettings,playerAllSettingsGroups,playerAnyOneSettingsGroup,...} + {playerSettings,playerSettingsEvent,playerSetError,playlistsList,playlistTrack,playMode,portableSurrounds,positioningDevice/DeviceMeasurementList/DeviceStatusInfo/Map/Measurement/MeasurementCapability(List)/SessionErrorInfo/SessionRequest/SessionStatusInfo/SpatialData/Telemetry,postHistoryConfig,preferredLanguageSetting,protectedAdminSettings,protectedSettings,publicSettings,queueItem,queueItemWindow,radioShow,rateStatus,recurrenceRule,redeemInviteResponse,RegistrationToken,registry,registryCollection,relativeTimeStamp,replicatedAreas,reportOptions,restrictedAdminSettings,sdkVersions,secureRegCert,secureRegCertMetadata,sessionStatus,settingsGroupMetadata,share,sharesList,shareListStatus,shareStatus,smartplayContentResource,softwareUpdate,softwareUpdateOptions,sonosDeviceNonce,soundSwapRequestResponse,speakerDetectionStatus,speakerPresenceEffectiveRate,speakerPresenceResult(List),stimulusTuningEnabled,swapModelInfo,systemNameSetting,timer,timeVal,timeZoneInfo,tokenStatus,trackQuality,transitionToShipModeStatus,translatedObjectId(s),translation,transportSetting,trueplayConfiguration,trueroomAdaptationStatus,trueroomStatus,trueroomEstimatorConfig,trustedAccessories,uniqueSetTestData,uniqueSetTestItem,universalMusicObjectId,updateItem,upnpParameter,upnpResponse,usageContextSetting,videoContent,virtualLineInSource,voiceAccount,voiceAccountsList,voiceAccountProfile,voiceWakeWord,weatherConfig,wifiDisable,zoneDefinition,zoneDefinitionList,zoneMember,zoneMemberSettings,zoneMemberSettingsMap,zoneMemberState}
::: details Evidence (1)

- @ 0x10f975c0; type-name block

:::


:::

## `muse_verb_ns_registry`

**coverage** `confirmed`

The complete menu of commands the cloud protocol supports, organised as namespace/verb pairs: 'authorization.resolveToken' means the resolveToken command inside the authorization group. It's the two-part naming system behind every modern-API operation.

::: details Technical details

Pair table @.data 0x110941d8: {namespace_name_ptr, verb_name_ptr} x~320 entries, terminated ffffffff. Binds every verb to its namespace (authorization/resolveToken, catalog/translate, entitlements/*, groups/*, history/*, playback/*, zones/*, systemReporting/*, smartplay/getContent...). Preceded by 2-char event-code table (AA..AK @0x110941a4) and hash seeds h1/h2.

- **name:** muse verb<->namespace registry (.data)
::: details Evidence (1)

- @ 0x110941d8; ns->verb pair table

:::


:::

## `muse_verbs`

**coverage** `strong`

The verb-name table: every operation callable per namespace, hundreds of them across all the resource groups. This is effectively the full modern-API method list, the operation vocabulary the route table can invoke.

::: details Technical details

areas {getAreas,createArea,updateArea,removeArea}; audioClips {loadAudioClip,cancelAudioClip,clipMetadata}; authz {getPolicyKey,getPermissions,grantType,assertion,objectType}; cloudRegistration {getRegistrationStatus,setRegistrationState,transferDeviceRegistration,vanishedDevices,quarantinedDevices}; diagnostics {submitDiagnostics,results}; settings {getSettingsGroup,updateAllSettings,updateSettingsGroup,targetSettingsOnly,namespaces,delayMillis,subscribe/unsubscribePlayerSettings,get/setPlayerSettings,setAllowMicrophone,setSelfTruePlay,setEnablePositioningMeasurement,setSonosNetChannel,get/setRestrictedAdminSettings,setUserMetricsTracking,getPublicSettings,getProtectedSettings,getProtectedAdminSettings,"v1/players/%s/settings/player"}; entitlements {subscribeUser,unsubscribeUser,getEntitlements}; history {removeHistoryItem}; deviceProperties {setName}; householdUpdate {getHouseholdUpdateStatus,isRunning,designatedDeviceId}; irControl {getIRControl}; indexerStatus {getIndexerStatus,updating}; musicServiceAccounts {getPreferredMusicServiceAccount,endDirectControl,__provisioned__,availableServicesVersion,registeredServicesVersion}; networks {temporarilyDisableNetwork,startNetworkTests,getNetworkTestResults}; playback {togglePlay,menuType,dpadDirection}; cache {cacheSettings,cacheKey,invalidateCache}; playlists {getPlaylists,getPlaylist,postPlaylist,loadPlaylist}; positioning {playStimulus,set/getStimulusTuning,startSession,cancelSession,applyAction,getSessionMap,getDeviceMeasurements,sendMeasurements,notifySessionError/Status/DeviceStatus,getMeasurementCapabilities,setTelemetryLevel,measurements}; roomDetection {stopSignalling}; sleepTimer {getSleepTimer,remainingTimeDuration}; smartplay {getContent}; soundSwap {requestSwap}; svc {getWeatherConfig,voiceCommand}; systemTime {get/setTimeZoneInfo}; timers {setRelativeDuration,pauseTimer,resumeTimer,abortTimer}; trueplay {detectSpeakerPresence,resetDetectedSpeaker,setSpeakerPresenceRate,get/setConfiguration,getTrueplayStatus}; trueroom {playSuccessTone,setSwapInputMute,trueroomEstimatedParams}; virtualRemoteControl {sendButtonCommand}; voice {wakeword,amazon,getVoiceAccounts,updateVoiceAccount,removeVoiceAccount,createAmazonChallenge,notifyInitiateOnboarding,timeoutSeconds}; zones {backhaulChannel,getActiveZoneList,getZoneDefinition(List),addZoneDefinition,addMissingZoneDefinition,updateZoneDefinition,updateActiveZone,updateZoneMemberSettings,removeZoneDefinition,activateZone,deactivateZone,joinZone,unjoinZone}; renew

- **name:** muse verb-name table
::: details Evidence (1)

- @ 0x10fa0188; verb table

:::


:::

## `netconfig_fsm`

**coverage** `confirmed`

The network bring-up state machine, driven by a shell script: each call takes a mode, covering join the mesh, join a home WiFi, run the open setup hotspot, check credentials without committing, or run as an island with no uplink. This script is why the player can move between Sonos's mesh and plain WiFi without a rewrite, because the whole reconfigure is one mode switch.

::: details Technical details

- **name:** /usr/sbin/netconfig.sh: the network-mode FSM driver
- **modes:** argv1 {sonosnet, station, satellite, sta_and_sat, open, credcheck, deauth, wacexit, island, up} + WAC family {wacstart, wacapclose, wactimeout, waccredcheck->credcheck, wacapopen->open, wacstation->station} + argv2 STP {stp_disable, stp_enable} + PARAM1-4 payload
- **decoded_semantics:** `open = the setup SoftAP: athconfig setopenmode+setchannel (default 2412MHz, /jffs/debug/openchannel override), setmac -L, ifconfig ath0 10.69.69.1: the 10.69.69.x bootstrap AP confirmed`, `credcheck = credential validation WITHOUT join: stasetenable ath0 2 + wpa_supplicant -B, then exits: used by waccredcheck to test new WiFi creds against /ramdisk/tmp/netsettings_check.txt before committing`, `deauth = bridge+MAC only teardown (no supplicant)`, `island = SonosNet with NO ethernet uplink (eth0/eth1 down, br0 uplink=0)`, `sonosnet = mesh member: eth0+eth1 bridged uplink=0 + netmanager_extender_flags=0 sentinel`, `station/satellite/sta_and_sat = wpa_supplicant -D sonos -i ath0 -b br0; satellite/sta_and_sat with PARAM1=atheros ALSO write /var/run/htapsatwpa.conf {ssid=PARAM2, psk=PARAM3, bssid=PARAM4?, priority=4, scan_ssid=1, eapol_version=1, ap_scan=1} and stassidlistadd the SonosNet-5G backhaul AP: the bonded-satellite joins the primary's ath1 network as a station`, `PrimaryUUID netsettings key present => ISHTSATELLITE=1: setprimaryuuid ath0 + satenable 1 + ath1 down. Otherwise IS_HT_WIRELESS_PRIMARY arch attr => ath1 becomes the HT 5G AP: setuuid/acs/acslmenable/wepkey/hhid`, `UUID construction proven at shell level: RINCON_<eth0 MAC>0<Port> where Port = keyval ^Port /opt/conf/anacapa.conf`, `netsettings keys read: {WEPKey, HouseholdID, Channel, PriorityBridge(->br0 prio 28672/0x7000 else 38912/0x9800), BonjourName(->DHCP hostname else SonosZB if IS_BRIDGE else SonosZP), PrimaryUUID, ForceMeshDisable(->blockadvertisedpath)}; file /jffs/netsettings.txt or /ramdisk/tmp/netsettings_check.txt (credcheck/station)`, `bridge tuning: sethello 1.0 setfd 4.0 setmaxage 6.0; uplink br0 1 for routed modes, 0 for mesh`, `DHCP: udhcpc -f -s /etc/dhcp.script -i br0 -w ath0 -h HOST -d access.bestbuy.com: domain arg literally 'access.bestbuy.com' (legacy retail-demo remnant); island uses -fF -W 20; station modes add -z flag; SIGKILL stale udhcpc after 5s`, `waitforip lifecycle: touched for non-WAC non-open modes; cleared by dhcp.script bound/renew or /jffs/debug/static_ipaddr path`
- **debug_hooks:** `/jffs/debug/testpoints.sh sourced when /proc/sonos-lock/exec_enable==1: arbitrary shell injection point gated on device unlock`, `/jffs/debug/wpa_supplicant.conf overrides generated config (output -> /dev/null)`, `/jffs/debug/supplicant -> wpa_supplicant -dd -t -K verbose`, `/jffs/debug/wpa_supplicant + exec_enable -> replaces the wpa_supplicant BINARY itself`, `/jffs/debug/static_ipaddr -> static br0 IP, skips DHCP, clears waitforip`, `/jffs/debug/openchannel -> open-AP channel override`, `SSID_FILE=1 /wifi/wpaconfig /jffs/net/settings/ssidlist.txt (or /var/run/softapssidlist.txt for recovery): the UseSSIDList provisioning path`, `wacd spawn: wacstart/wactimeout -> /wifi/wacd \[-timeout\]; non-WAC modes kill wacd`
- **shutdown:** etc/init.d/rcK: touch 10 /var/run/stop* sentinels {stopupgrade,stopledmgrd,stopdiagapp,stopsonospowercoordinator,stopmdns,stopdiagprocessd,stopanacapa,stopchrony,stopsddp,stopnetstartd} -> TERM {sonosledmgrd,sonosdiagd,sonospowercoordinator,anacapad,chronyd,sddpd,dropbear,netstartd,mdnsd,udhcpc,rngd} -> sync -> KILL -> ampmcu-down.sh -> umount /jffs. Srandom/Krandom carry /jffs/random-seed across reboots.
::: details Evidence (1)

- @ /usr/sbin/netconfig.sh + /etc/init.d/{rcK,Srandom,Krandom}; shipped shell

:::


:::

## `network_tools`

**coverage** `strong`

The /tools diagnostic page: HTML forms that run ping, traceroute, nslookup, and a discovery announcement against a host you enter, plus a packet-capture endpoint. A built-in network troubleshooting toolkit served by the speaker itself.

::: details Technical details

forms {"Tools for debugging network issues"}; /bin/ping -c 3 + /usr/bin/traceroute + nslookup + /mdnsannounce; POST params {host,csrfToken}; /pcap streams trace.pcap (Content-Disposition attachment) via /bin/pcap - not (host %s and port %d) exclusion filter

- **name:** network diagnostic tools page
::: details Evidence (1)

- @ 0x10e86814; tools page

:::


:::

## `player_settings`

**coverage** `strong`

The player-settings manager: the per-player configuration keys covering volume mode, mono mode, wireless and power-save toggles, network mode, line-in, EQ, gain trim, and zone attributes. These are the per-device keys the settings surfaces map onto.

::: details Technical details

keys {volumeMode,monoMode,wifiDisable,meshDisable,wifiPowerSave,batteryUsagePolicy,bluetoothPolicy,networkingMode,lineIn,eq (treble),eq (bass),eq (loudness),gainTrimDB,zone attributes}; volume modes incl PASS_THROUGH ("EQ cannot be adjusted in PASS_THROUGH volume mode") + "Device does not support fixed output"; "Satellites not supported; configure primary device"; "monoMode (not supported in setup)"; wifiDisable reasons {reason unknown,netstart refused,no Ethernet carrier,meshDisable (netstart refused)}; "Netstart failed to modify meshDisable setting"; "Unable to set setting(s): ... (unsupported)"; actors {PlayerSettings,PlayerSettingsManager,playersettingsmgr,gmSat,ukwnt}

- **name:** PlayerSettingsManager (settingsv2)
::: details Evidence (1)

- @ 0x10ee5144; playersettings block

:::


:::

## `product_models`

**coverage** `strong`

The product codename table: the development names like Playbar, Bravo, and Play1 mapped to numeric model IDs. Use it when a log or config names a codename you need to map to a product, and it's how the firmware knows which hardware it's running on.

::: details Technical details

codenames {Default,Playbar,ElRey,Bravo,Hideout,Pallas,Apollo,Lasso,Play1,TitanWOW-T,TitanWOW-P,TitanWOW-G,Monaco,Play3,Encore,Alpine,Pinewood,Prima,Mojave,Optimo2,Optimo1}; ZPS ids {ZPS11,ZPS12,ZPS13,ZPS14,ZPS15,ZPS16,ZPS17,ZPS18,ZPS19,ZPS20,ZPS21,ZPS22,ZPS23,ZPS24,ZPS26,ZPS27,ZPS31,ZPS35,ZPS37,ZPS38,ZPS43,ZPS54,ZPS55,ZP120,ANVIL}; dspconfigparam + "ConfigParam lookup from player model %d failed"

- **name:** product codename + ZPS model table
::: details Evidence (1)

- @ 0x10f24808; model table

:::


:::

## `protocol_info`

**coverage** `strong`

The format-capability strings: the address-scheme whitelist each paired with a content-type filter, exchanged when devices negotiate what they can send or play. Acceptance of a 'play this' command is gated by this list, so an unsupported scheme never reaches the engine.

::: details Technical details

schemes {http-get,x-file-cifs,file,sonos.com-mms,sonos.com-http,sonos.com-spotify,sonos.com-rtrecent,x-rincon,x-rincon-mp3radio,x-rincon-playlist,x-rincon-queue,x-rincon-stream,x-sonosapi-stream,x-sonosapi-hls,x-sonosapi-hls-static,x-sonosapi-radio,x-rincon-cpcontainer}; mime types {audio/mp3,audio/mp4,audio/x-m4a,audio/mpeg,audio/mpegurl,audio/x-mpegurl,application/x-mpegurl,application/vnd.apple.mpegurl,application/dash+xml,audio/mpeg3,audio/wav,audio/x-wav,audio/wma,audio/x-ms-wma,audio/aiff,audio/x-aiff,audio/flac,application/ogg,audio/ogg,audio/x-spotify,audio/x-sonos-recent,audio/x-sonosapi-radio}; vars {SourceProtocolInfo,SinkProtocolInfo,CurrentConnectionIDs}; actors {ConnectionManagerServer,ConnectionManagerRenderer}

- **name:** SourceProtocolInfo/SinkProtocolInfo CSV
::: details Evidence (1)

- @ 0x10eb87e4; protocolInfo CSV

:::


:::

## `queue_schema`

**coverage** `strong`

The track-queue status document: the fields describing a queue's capacity, usage, version stamp, owner, and policy. The capacity statistics are diagnostic gold for support, and the update counter is what event subscribers watch for queue edits.

::: details Technical details

<Queue Name='%s'><EntriesMax>%d</EntriesMax><EntriesUsed>%d</EntriesUsed><EntriesHighWater>%d</EntriesHighWater><StringTableSize>%d</StringTableSize><StringTableUsed>%d</StringTableUsed><StringTableHighWater>%d</StringTableHighWater><UpdateID>%u</UpdateID><ObjectID>%s</ObjectID><OwnerID>%s</OwnerID><Policy>%d</Policy><CloudQueueHost>%s</CloudQueueHost></Queue>; <TrackQueueSummary>Shared/Private</TrackQueueSummary>; GPM {com.google.RemoteSonosReceiver,Google Play Music}; metadata pipeline ladder: 'Md incomplete. Getting cached metadata' -> 'Md still incomplete. Loading from CSV extra md' -> 'Md is now complete from cache. Calling pmd.initFromTrackMd'; 'Updated duration for track %s at index %d to %lld','Updated extra MD for track %s at index %d','metadata cache unable to load %s','metadata load timed out for %s','Fetching metadata for tracks %u - %u. Fetch type %d'; stream open ladder 'Unable to open stream %s: max redirects(%d)','Failed to open %s (%d)','Failed to open %s (%d) Trying MMS,RTSP next'; trueroom tone injection 'x-rincon-configmode:speaker-detect{.mp3}','Adding Trueroom tone track URI to the queue','trueroom_config_mode'; browse 'browse aborted (r:%d c:%d l:%u nr:%u nxt:%u tot:%u)','could not find service for SID=%d'; muse post errors 'failed to set HTTP headers for trackQueueAdditions','sending %s to %s','MUSE POST error: %s','MUSE POST: unable to parse response','unable to base64 decode response'

- **name:** track-queue status XML
::: details Evidence (1)

- @ 0x10ea9620; queue schema

:::


:::

## `rc_impl`

**coverage** `strong`

The rendering-control engine's event vocabulary: volume-changed, ducking, stereo-pair-state, and tuning-changed notifications the sound-control service publishes internally. It's the source of the updates apps see when the room's sound settings move.

::: details Technical details

events {RcStateUpdateEvt,VolumeChangedEvent,DuckingEvent,ProxiedFastVol0Event,StereoPairStateEvent,TrueplayCalibrationChangedEvent,TrueplayStateEvent,RcNotifyGrcEvent,FeatureConfigChangedEvent,LocalPlayerChangeEvent,UpdateSonarEvent}; "Delivery of %s(%u) event cancelled"; RStringTRequestManCB; settingsWriteback; roles {HT_BONDED_MASTER,HT_BONDED_SATELLITE,UNBONDED_DEVICE,Master}; HT params {SubGain,SubCrossover,SubPolarity,SubEnable,VolumeScalingFactor,HeightChannelLevel,DialogLevel,SpeechEnhanceEnabled,SupportsMaxDialogLevel,SurroundLevel,MusicSurroundLevel,SurroundEnable,SurroundMode,AudioDelay,AudioDelayLeftRear}

- **name:** RenderingControl implementation (rc_impl)
::: details Evidence (1)

- @ 0x10e87630; rc_impl block

:::


:::

## `rootfs_boot_chain`

**coverage** `confirmed`

The boot chain is layered and safe-by-default: mount the virtual filesystems, lay down the RAM disk, pull in the kernel drivers, check whether a factory reset is being asked for, then bring up networking and the daemons, with a developer override file that can take over on unlocked units. Every boot decision you'd want to trace runs through this one script.

::: details Technical details

inittab (gen_inittab.py for ARCH limelight): sysinit=/etc/Configure; respawn {run_sshd.sh,runledmgrd,runnetstartd,runmdns,rundiagprocessd,runanacapa,runchrony,runsddp} + secure_console_login.sh ttyS0; ctrlaltdel=reboot; shutdown=init.d/rcK. All daemon logs go to /dev/kmsg.

- **name:** /etc/Configure sysinit + ramdisk layout: the boot chain
- **configure_steps:** `mount proc+sysfs, ifconfig lo up, mount ramfs /ramdisk (var/,var/run,var/log,tmp/,tmp/pub,optlog,smb live on RAM)`, `mtd links: /dev/mtd/0->mtd0, /dev/nandjffs->mtdblock4, /dev/jffsmtd->mtd4; sonos_mount_jffs mounts /dev/nandjffs at /jffs (noatime)`, `insmod sonos_device.ko, chk.ko, hwevent_queue.ko, audiodev.ko, ir_rcvr.ko (conditional)`, `touch /var/run/sonosledmgrd.flash_booting_led; /sbin/frcheck -> factory-reset check: rc!=1 -> sonosledmgrd --fr (FR LED flash); rc==0 -> netstartd --hard-reset; rc==2 -> netstartd --soft-reset`, `create jffs trees: app/{run,log,debug,debug/dsp,settings}, sys/{run,log,debug,settings}, net/{run,log,debug,settings}, persist`, `optional /etc/dsmf_setup; /bin/mdputil -B (mfg data init); hostname=Sonos-<SERIAL\[:12\]> via mdputil\|keyval ^SERIAL\|cut`, `if /jffs/Configure exists -> exec it INSTEAD of remaining steps (whole-boot override hook)`, `rmem_max=262143, icmp_echo_ignore_broadcasts=0`, `wifiType=N; insmod /wifi/N/{adf,asf,ath_hal,dfs?,ath_driver}.ko + /wifi/bridge.ko: Atheros N stack`, `setmac; ifconfig eth0 0.0.0.0; touch /var/run/waitforip`, `UNLOCK PATH: /etc/unlocked_build_flag OR /jffs/system/Configure.dev -> ln -s /opt/htdocs_locked /tmp/htdocs_locked + touch /tmp/device_unlocked_flag; Configure.dev then executed every boot (dev hook)`, `seed /jffs/hosts from /etc/hosts.orig; Krandom`
- **notes:** dsmf_setup is a DSMF (device-secure-manufacturing?) hook; mdputil is the manufacturing-data CLI (keyval ^REGION/^SERIAL reads, -fwe write, -B init).
- **security_files:** etc/fstab: rootfs mounted from /dev/mapper/crroot (device-mapper 'crroot' (dm-verity/dm-crypt read-only root; the shipped squashfs is integrity-protected at the block layer). /dev/shm tmpfs noexec,nodev,nosuid mode=600. etc/passwd: dedicated users {chrony(19),anacapa(20)} locked with '!' in shadow; root has a shipped MD5crypt hash ($1$AugXR3h8$...)) a fixed factory root credential, reachable only after unlock (dropbear getty are gated on device_unlocked_flag). chrony.conf: pools 0-3.sonostime.pool.ntp.org iburst maxsources 1, driftfile /jffs/chrony/chrony.drift, makestep 60 1, port 0 (no NTP serving). dhcp.script (udhcpc): bound/renew writes /etc/resolv.conf + ifconfig + default-route + multicast route, then removes /var/run/waitforip: the boot handshake anacapad waits on.
::: details Evidence (1)

- @ /etc/Configure + inittab + scripts/; shipped shell files

:::


:::

## `rootfs_data_files`

**coverage** `confirmed`

The firmware ships with a handful of data files that do real work: the speaker's audio-tuning coefficients, the factory IR codes for TV remotes, a seed music-service list that gets replaced by the cloud, the button-click sounds, and the web pages the status server serves. Small files, but they define a lot of the out-of-box behavior.

::: details Technical details

\["opt/dsp/S9_array.xml: Playbar woofer-array beamforming definition: <arrayDefinition> with 3 <config> variants per hardware rev {Production_H_design123, Production_VA_design123, Production_VB_design123}; each is a 'woofer' driverset of numChan=6 x numTaps=16 with 3 arrayDefs {ArrayLeftLows,ArrayRightLows,ArrayCenterLows}: 96 hex-float weights + 16 alphas (L/R=-0.7775, C=-0.9303) + 6 per-channel delays {44,33,8,14,0,0} / mirrored R / {0,19,63,54,49,19} C. L/R weight lists are palindromic mirrors (steered dipole pair). Confirms 6-channel woofer array with stereo beamforming.", 'opt/ir/irconfig.txt (shipped NEC-family code map: repeat=4f 13 05; vol_up=2,25 01; vol_down=2,27 01; vol_mute=2,29 01) the factory-default TV remote codes.', 'opt/musicservices/musicservices.xml: bootstrap seed contains ONLY TuneIn: <Service Id=254 Name=TuneIn Uri=http://legato.radiotime.com/Radio.asmx SecureUri=https://... Capabilities=0><Policy Auth=Anonymous PollInterval=0>; the real catalog is fetched at runtime.', 'opt/htdocs: serving root: /xml/*.xml (16 advertised SCPDs + device/group descriptions + factory_reset.xsl + review.xsl), review.js, perfcounters.js, img/icon-S9.png; pub -> /tmp/pub symlink (ramdisk; Configure creates /ramdisk/tmp/pub) so web-uploaded artifacts live in volatile RAM.', 'opt/localsettings/*.json: all 6 attrdata files (global/playback/playerBasic/playerUI/security/settings_targettypes) ship as EMPTY 0-byte placeholders; the attribute schemas are compiled into the binary, files are runtime-populated.', 'opt/buzzers: button-feedback audio {0,1,100,101}.mp3 + speaker-detect.mp3 (x-rincon-buzzer:// URIs).', 'opt/timezones/timezones.xml: fallback tz table (cloud feed overrides via update-timezone.sonos.com).'\]

- **name:** shipped rootfs data files: DSP array, IR codes, musicservices seed, web UI assets
::: details Evidence (1)

- @ opt/; shipped files

:::


:::

## `saved_queues`

**coverage** `strong`

The saved-queue file format: Sonos playlists stored as a compressed XML document on the device, written atomically and validated on load. 'Sonos playlists' are exactly these files, and this is the machinery that stores, edits, and retrieves them.

::: details Technical details

file:///jffs/settings/savedqueues.rsq (+.tmp write path, .d.rsq variant, application/gzip accepted); XML <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"><SavedQueue Id= Curated= NumTracks=%u><Track URI= MD=></SavedQueue></SavedQueues>; validation: corrupted track count, invalid queue-id/next-id/mismatch, invalid version/numtracks, boot file invalid; migration "Migrating ObjID=%s SN=%u from SID: %u to %u"; SQ:%s objid prefix; <res protocolInfo="file:*:audio/mpegurl:*">; album-art: "No num tracks found, so emitting the first four artworks found"; mobile- playlist prefix; "Add Track Move range: %u-%u to %u"; replication push on save | export writer f_10478f28(obj,dest,gzipFlag): serializes SavedQueues to a .tmp path then selects MIME application/gzip vs text/xml - the queue-backup/export path feeding the .rsq/gzip artifacts

- **name:** SavedQueues .rsq format
::: details Evidence (2)

- @ 0x10ed329c; .rsq schema literals
- @ 0x10478f28; export fn: builds .tmp filename, fopen64 w, writes </SavedQueues>, r5 flag selects application/gzip vs text/xml

:::


:::

## `sentry_upload`

**coverage** `strong`

The crash-dump pipeline: upload endpoints plus the daemon proxies, collecting dump files for each daemon and shipping them to the crash-upload service. It's how crash reports reach Sonos's error tracking after a failure.

::: details Technical details

routes {/upload,/watchdog,/anacapad-external,/sonospowercoordinator-external,/watchdog-legacy,/legacy-to-sentry,/btmanager-external,/sonosledmgrd-external,/netstartd-external}; dumps {anacapad.core,anacapad.dmp,sonospowercoordinator.dmp,btmanager.dmp,netstartd.dmp,/jffs/app/debug/sonosledmgrd.dmp}; sidecars {.properties per daemon,sonospowercoordinatorCrashCount,netstartd.count}; attachments {watchdog.log,watchdog.dmesg,/opt/log/anacapa.hdmi.log,/opt/log/anacapa.tv.log,/tmp/AirPlay.log,/opt/log/btmanager.log,/opt/log/btservice.log,/tmp/backtrace}; opt-out flag prevent_crashdump_upload + /tmp/anacapa_prevent_crashdump_upload; sentry schema {sentry\[release\]=build.version,sentry\[tags\]\[%s\],sentry\[user\]\[id\],%s\[sonosID\],%s\[hhid\],%s\[serial\],%s\[upload_sw_version\],%s\[hardware_version\],%s\[model\],%s\[upload_spotifyesdk_version\],%s\[play_state\],%s\[watchdog_crash\]}; form-data + text/plain; charset=UTF-8/us-ascii + application/octet-stream; gzip stream "writeStream failed - Bytes compressed: %d/%d"; play-state file /tmp/crashed_play_state + htsnk; results {"Minidump \[%s\] uploaded to sentry.io. UUID: %s","Coredump \[%s\] successfully uploaded","didn't finish upload; http resp: \[%d\]; last error: \[%s\]","did not return a UUID","No URL found"}; dump file %s-anacapa_dump.gz + originator + Version:

- **name:** crash-dump/sentry pipeline
::: details Evidence (1)

- @ 0x10ea7c14; sentry block

:::


:::

## `share_indexer`

**coverage** `strong`

The music-library share indexer: the engine that walks your music folders to build the searchable index, handles re-sort and re-index requests, and reports its progress through the library events. It's the worker behind 'update music library'.

::: details Technical details

ops {localRemoveUnsupportedShares,localRequestReindex,localRequestResort,"Turning resort request into full reindex"}; reindex "request reindex (ad:%d sf:%d fr:%d si:%d st:%d lc:%s)"; schema <Shares LastUpdateDevice AlbumArtistDisplayOption IndexSortOrder LastIndexChange><Share Path UserName Password VerifiedValidProtocol Id>; errors {"Unable to find share with given ID","Failed to remove/add share","The share path provided already exists","need to recover ix=%d ver=%d","indexing reported err=%d for %s","Mounting failed.","Local index storage error.","Remote file share error.","Indexing canceled.","connection failure","Cannot exceed the maximum number of allowed shares","The path provided is subsumed by an existing share","Path is malformed","Access to share is denied","Unsupported share protocol."}; lifecycle {"replication failed","replication skipped: local fmt %u, remote fmt %u","initial scan for new files failed","Would have performed scheduled reindex but shares unchanged","reindexing failed","reverting desired state: %d","processing index complete (c:%d i:%d f:%d lc:%s) - %u","skipping commit attempt: m_bCommitted/m_bWait/m_bTerminate","initialized index, scheduling advertise","commit %u","processing index: source (%s:%u)","recovered ix=%d with ver=%d"}; R_BrowseByFolderSort,Tracknum; cancellation taxonomy: 'Indexing cancelled (interrupted)'/'(file error)'/'(share error)'; recursion guards 'Exceeded recursion limit on share %s'/'Exceeded recursion limit (%d) at //%s'; file states 'Unplayable file: %s','Inaccessible file: %s'; itplist dedup 'Skipping itplist with duplicate size and mtime','More than %d itplists seen, skipping some'; title index emit "<Title track='%u'><File><Leaf><Album><Artist><Composer><Genre>"; stats 'Directories Reviewed: %d','Files Reviewed: %d','Unknown type files: %d','Unplayable files: %d','Inaccessible files: %d'; 'Track data too large!','Call made with NULL table','initialization of sorts failed','took %ldms to initialize indexes'; UPnP server-type matching: 'Rhapsody Media Server', 'Windows Media (%s)', 'Windows Media Player Sharing' matched via modelName/modelNumber; static pinyin syllable table (cheng..shang, quad-duplicated): CJK romanization/collation for search

- **name:** music share indexer
- **itp_parser:**
  - **status:** confirmed
  - **summary:** iTunes library XML importer ('iTunes Music Library.xml'/'iTunes Library.xml'): ITP Parser validates the plist/dict stack: 'ITP Parser: Stack underrun','mismatched end tag atKey -- expected key, got %s','mismatched end tag atTrack -- expected dict','atPlaylistID-- expected integer','atPlaylistPersistentID -- expected string','atPlaylistExclude -- expected true','atPlaylistTrackID -- expected integer','atPlaylist -- expected dict','atTracks -- expected dict','atPlaylists -- expected array','atPlaylistName -- expected string','Stack depth exceeded','ITP parser exception','XML parse failed: %s (%s)'.
  - **persistence:** 'Out of space processing playlist "%s", track %d'/'Out of space processing playlist "%s"','Ignoring playlist "%s", m_bIgnorePlaylist = %s','Ignoring unnamed playlist, m_bIgnorePlaylist = %s','Error writing playlist "%s", m_bOutOfSpace = %s','Skipping playlist: (%s)','unmatched playlistsEnd ','duplicate playlistsEnd','Write error: %s%s%s','Could not fit any of the pendingplaylists. Available slots: (%d) for file (%s)','Out of space processing file (%s)','There are no playlists under (%u) tracks (%s)','Requested %u tracks. Enqueued %u tracks from position %u / %u'.
  - **abstract_file:** Abstract-file store for playlists: 'Error writing offsets to abstract file','Failed to seek abstract file (errno = %d)','Abstract file track offset out of bounds','Failed to write URI atoms to abstract file','lookup resulted in path w/o share: %s','lookup resulted in path w/o share %zu times in a row','ignoring non-local track %s','Out of space processing track (%d - %s) - could not atomize'/'could not write','Failed to open file (%s)','Out of space processing file (%s%s%s%s) (%s)','Write error or invalid processing file (%s)'.
::: details Evidence (1)

- @ 0x10e8a004; share indexer

:::


:::

## `sibling_daemons`

**coverage** `confirmed`

The sibling-daemon interface: how this program relates to the player's other system processes like the network daemon and updater, covering what's delegated to whom. The multi-process split means this program hands off whole feature areas, and knowing the sibling set explains why some work happens elsewhere.

::: details Technical details

\["opt/bin/anacapactl (POSIX sh): the anacapad supervisor (launch line 'anacapad -c /opt/conf/anacapa.conf -u anacapa -C all=eip' (privilege drop to user anacapa, capability keep-set eip); pid file /opt/log/anacapa.pid; {start,restart} run under gdb ($SONOS_GDB_ARGS --args ... -d 10)) the debug launch path; {start-demo,restart-demo} exec directly; start-demo wraps exec with DropCaches (echo 3>drop_caches) on fenway/connectx only; stop=SIGTERM+wait, hup=SIGHUP; LD_LIBRARY_PATH=ANACAPA_LIBDIR=/opt/lib.", "wifi/netstartd (264KB PPC ELF): network-setup daemon with reset modes {--hard-reset,--soft-reset,--qareset,--qareset-lite,--preserve-system}: Configure dispatches frcheck rc here; full SonosNet FSM {NetManagerSonosNetBaseHandler,SonosNetHandler,SonosNetWithPathHandler,SonosNetNoWifiHandler,NetmanagerEventReconfigSonosNet\[Disabled\]}; IPC to anacapad: 'anacapa IPC: setting SonosNet frequency to %u' + 'frequency %u not supported' + SonosNet disable relay; persisted hint file %s/net/settings/sonosnet_hint; SoftAP accept-list /var/run/softapssidlist.txt; sonosFactoryResetFull + WIFI_RESET log tags.", 'wifi/wacd (67KB): wireless-audio-channel daemon (WiFi channel scan/score); wifi/wpa_supplicant + wpaconfig + sta-assoc; wifi/athconfig + wifi/N/{adf,asf,ath_hal,dfs,ath_driver}.ko + radartool: Atheros stack; wifi/bridge.ko for br0.', 'usr/sbin/keyval (67KB): the manufacturing-data KV CLI used by mdputil pipelines (^REGION,^SERIAL reads).', 'opt/bin/sonosledmgrd (1.2MB): LED manager: --fr factory-reset flash mode invoked by Configure.', 'lib/ inventory: 40 shared objects incl libsonosutils(IPC+reset+archinfo), libsonos-mdp(mfg data), libsonos-root-cert-bundle.so.2 + libsonos-certval(rcb), libsonoscrypto, libsonossbcpacket(satellite SBC), libsonoseventreporter, libsonosminiutils, libhwmessagelib, libflash, libtomlc99, libprotobuf-nanopb, libdcadec(DTS), libsmb2, libmbedtls/mbedx509, libavcodec+libmpg123(WMA decode), libnl-3/genl, libdns_sd, libpcap, libsqlite3', 'wacd decoded: Apple WAC (MFi provisioning) (builds a Base64-encoded WAC SSID, creates the Apple Device IE, reads MDP page1/page2 for model/variant, then "Setting up IE and bailing") it only programs the AP IE and exits; comms via /tmp/netstartd_wac.ipc sending {WAC AP Open,AP Close,Done,Error,Stop,Timeout} msgs; SIGUSR1 simulates timeout; -timeout flag.', 'sonosledmgrd decoded: R_LED_* mode-mask enum {HHID,AUDIO_OFF,BEGIN_SETUP_MODE,BREAK_POP,BROKEN_DEVICE,CONTROL_FEEDBACK,DEMO_CONFIGURE_IR,DEMO_MODE,FAULT,IDENTIFY_PLAYER,IN_SETUP_MODE,JOIN_HH\[_OPEN\],MUTED,PLAYING,SHUTDOWN,TRANSFER_REGISTRATION,UPGRADE,WAC,WAC_TIMEOUT,WAITING_TO_PAUSE,WAITING_TO_PLAY,WARN} + LED_MODE boot patterns {BOOTING,BYPASS,BYPASS_BLOCKED,CLONE_CHECK_FAIL,FACTORY_RESET,JOIN_HH\[_OPEN\]}; pattern record {cksum,flags,repeats,num_steps,led_ids bitmask}; HAL ops hal_led_{open,close,write,flash,brightness,diag} + captouch brightness + feedbackFlash.', 'Tail findings: sbin/watchdog is a busybox alias (kernel watchdog ioctls); usr/sbin/setmac sources MACs from /tmp/wifi_card_mac_addr (-S bridge MAC, -L open-AP MAC); btmanager is ABSENT on the 86.10 m9 rootfs (S1-era daemon, gone in this build); sbin/{mdnsd,sddpd} present (Bonjour + Control4 SDDP discovery as documented); etc/default, etc/dhcpc, etc/rc.d/rc*.d, opt/lib, usr/share, jffs mountpoint all ship EMPTY: runtime-populated.'\]

- **name:** sibling binaries: netstartd, wacd, anacapactl, keyval, sonosledmgrd
::: details Evidence (1)

- @ opt/bin + wifi/ + lib/; shipped binaries

:::


:::

## `smapi_client`

**coverage** `strong`

The music-service client: the outbound side of service integration, covering session IDs, auth-token refresh, device auth tokens, and metadata fetching over each service's own interface. It's how the player logs into and talks to Spotify-style backends on your behalf.

::: details Technical details

action namespace http://www.sonos.com/Services/1.1|{...}; actions {getSessionId,refreshAuthToken,getDeviceAuthToken,getStreamingMetadata,getUserInfo,getMediaURI,getMediaMetadata,getMetadata,search,reportAccountAction,reportPlayStatus,reportPlaySeconds,setPlayedSeconds,reportStatus,getAlbumArtURI}; session/key vocab {deviceSessionToken,deviceSessionKey,CK_deviceSessionKey,contentKey,CK_contentKey,MU_deviceSessionKey,MU_contentKey,authToken,privateKey,userInfo,algorithm,keySize,value,expiration,httpHeaders,mediaRequestInfo,uriTimeout,contentKeys,callbackPath}; mediaURI fields {positionInformation,privateDataFieldName,contentKeys}; browse params {recursive,count,index,total,mediaCollection,mediaMetadata}; report schema "reportPlayStatus: %s; context: %s; uri: %s; cid: %s; id: %s; seconds: %lld; offset: %lld" + contextId + interval; semantics enum {IMPLICIT,EXPLICIT:PLAY,EXPLICIT:SEEK,EXPLICIT:SKIP_FORWARD,EXPLICIT:SKIP_BACK,EXPLICIT:PAUSE}; metadata URNs http://purl.org/dc/elements/1.1/|{id,creatorId} + urn:schemas-rinconnetworks-com:metadata-1-0/|{narratorId,podcastId,summary,total,duration,authorId,bookId,producerId} + urn:schemas-upnp-org:metadata-1-0/upnp/|artistId; browse hierarchies {newrelease:album:genre:,staffpick:album:genre:,top:album:genre:,top:track:genre:,playlist:,%s.#%s,favorite:track,artist_tracks:}; skd://itunes.apple.com/P000000000/s1/e1 FairPlay; X-Sonos-Playback-Id header; "reauthorizing preinstalled service SID %u"; "mult-key decrypt params not found"; "WARNING! getDeviceAuthToken ... credentialType = %u (not OAuth)"; secondsSinceExplicit; "flushing on cert change"; media-sens cache {cont_prov_media_sens,content_prov_list,billboard,"cached/loaded/reset session %u:%u"}

- **name:** SMAPI SOAP client (sonos_cprovider)
- **protocol_info:** protocolInfo CSV {sonos.com-mms:*:audio/x-ms-wma:*,sonos.com-http:*:{audio/mpeg3,audio/wma,audio/wav,audio/aiff,audio/flac,application/ogg,application/dash+xml,application/octet-stream}:*,sonos.com-spotify:*:audio/x-spotify:*,sonos.com-rtrecent:*:audio/x-sonos-recent:*,x-sonosapi-hls:*:*:*,x-sonosapi-hls-static:*:*:*}; exts {.aiff,.flac,.unknown}; audio/vnd.radiotime; "Unsupported mime type (%s) for object id (%s)"
::: details Evidence (1)

- @ 0x10f0f4b0; sonos_cprovider block 1

:::


:::

## `spdif_burst`

**coverage** `strong`

The optical-output burst-format machinery: a table of unsupported formats plus the Dolby and DTS burst types it does handle. When a TV sends an unrecognized stream the player refuses rather than emitting noise, which is the guard logic for the digital output.

::: details Technical details

supported {Dolby Digital,Dolby Digital Surround,Dolby Digital Plus,Dolby Atmos (DD+),Dolby TrueHD,Dolby Atmos (TrueHD),Dolby MAT,Dolby Atmos (MAT),DTS (Type1),DTS (Type2),DTS (Type3)}; unsupported enum {NULL Burst,Pause Burst,AC-3,SMPTE 338M v1-v5,MPEG1 Layer 1,MPEG1 Layer 2/3,MPEG2,MPEG2-AAC,MPEG2 Layer 1/2/3 LSF,DTS1-4,ATRAC,ATRAC 2/3,ATRAC X,WMA Professional,MPEG2 AAC LSF,MPEG4 AAC,Enhanced AC-3,MAT,MPEG4 ALS,Reserved 2-4,Extended Data,MPEG4 AAC LC in LATM/LOAS,MPEG4 HE AAC in LATM/LOAS,DRA} all prefixed "Unsupported "; this is the IEC 61937 data-type code map (NULL/PAUSE are IEC-61937 burst types; MAT = Dolby MAT container; DRA = DRA Chinese standard); per-type error counters tv_decoder_error_{dd,ddp,mat,pcm,dts1,dts2,dts3} + tv_decoder_dsp_error_dap; IEC 61937 data-type rejection names incl 'Unsupported AC-3', 'Unsupported DTS1' + 'No Signal'

- **name:** SPDIF burst-format taxonomy
- **code_module:**
  - **status:** partial
  - **range:** 0x10e50000-0x10e6ffff (.text, ~128KB, previously zero doc anchors)
  - **contents:** `IEC61937 burst-writer: 'OVERSIZE SPDIF block @ %d frames!' / 'Restart SPDIF block @ %d frames.' frame-boundary recovery logs (f_10e6f32c)`, `enum->name mappers: f_10e6e5ac (17 external callers) bounds-checks index<0x10 then lwzux into ptr table @0x1102a2cc, 'UNDEFINED' fallback @0x10e88b0c; 'BLED_UNAVAILABLE' string @0x10e88b58 in neighborhood`, `163-entry relocated table @0x1108b594 in .data.rel.ro (slots f_10e54684-f_10e62544 family; buffer-ctor f_10e55110 inits obj+0x800/+0x1000/+0x1800 buffers)`, `module calls nanopb (pb_encode/pb_decode/pb_ostream_from_buffer/pb_istream_from_buffer): the nanopb runtime co-located/linked with the SPDIF layer`
  - **evidence:**
    - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, notes: bl-target census: 0x10e5-0x10e6 fns' top calls = __stack_chk_fail/__printf_chk + pb_* (234/135/46/45); SPDIF literals resolved in f_10e6f32c; .data.rel.ro run census found the 163-slot table
  - **residual:** per-slot table semantics and the full burst-writer call graph unmapped; external entrypoints identified by inbound-call census (f_10e6e5ac mapper x17, f_10e5025c x8, f_10e57b2c x6)
- **pic_call_model:** module is -fPIC: fns anchor PC via bc $+4;mflr r30 then lwz negative(r30) into .got2; the 164-slot table @0x1108b594-0x1108b824 (ends exactly at .got2 start) = the objects private GOT function block - 164 distinct fn ptrs spanning 0x10e53-0x10e62 (the modules complete internal fn set). Internal calls go lwz/mtctr/bctrl (63 bctrl sites), never bl - which is why the module had zero bl-anchored doc references despite being fully mapped.
::: details Evidence (1)

- @ 0x10ee650c; burst enum

:::


:::

## `spec_descriptors`

**coverage** `confirmed`

The full type system behind the cloud API: 383 machine-readable descriptions of every request, response, event, and data structure the protocol uses. Each is a schema the engine can validate messages against, making it the API's complete grammar.

::: details Technical details

383 object-spec descriptors in 2 contiguous tables: @.rodata 0x10e9ba80 (96 records) and 0x10f9f87c (287 records). Each 0x80-byte record = C++ descriptor object: ctor @+0x00 installs vtable; +0x20 accessor fn returns {classId 1-12, spec-list ptr}; +0x24 = ffffff88 marker; +0x2c/+0x30/+0x4c-0x54 = per-object ops; +0x58..+0x7c = shared thunk tail. Spec-lists decoded under the corrected index space (semantic idx -> table\[3+i\], via f_109ecb5c): {fieldName,typeName} pairs - see spec_pair_stream. First-field distribution (corrected): 'ok' leads 170 specs (status field first), 'upnpResponse' 60 (UPnP-bridge ops), object-typed roots (timer, zoneDefinition, alarm, playerAllSettingsGroups, accountError, groupInfo, musicServiceAccount...). classId correlation (corrected): cls3 = upnpResponse-led (UPnP-bridge RESPONSE objects, n=45) + ok-led; cls1/cls2 = ok-led request/response specs; cls4-7 = event/update shapes; 52 descriptors empty (no-param ops). Descriptor members are CHILD-OBJECT refs (the field's declared type), not wire param names - matching descriptor members against route op_params showed zero overlap (e.g. authzGrant spec refs authorizationGrant{Header,Payload,Response} which internally carry grantType/assertion). Verb binding via op-vtable +0x58 spec accessor -> {classId,blob} (558/603 routes bound).

- **name:** muse/lechmere spec-object descriptor registry
- **count:** 383
- **tables:**
  - base: 0x10e9ba80, n: 96
  - base: 0x10f9f87c, n: 287
- **entries:**
  -
    - **address:** 0x10e9ba80
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10e9bb00
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10e9bb80
    - **class:** 3
    - **root:** eqSettings
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9bcdc
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10e9bd5c
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10e9bddc
    - **class:** 3
    - **root:** globalError
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9be5c
    - **class:** 3
    - **root:** globalError
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9bedc
    - **class:** 6
    - **root:** group
    - **members:** `authzTokenStatus`, `playerAnyOneSettingsGroup`, `book`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `allowDirectControlSetting`
  -
    - **address:** 0x10e9bf5c
    - **class:** 6
    - **root:** group
    - **members:** `authzTokenStatus`, `playerAnyOneSettingsGroup`, `book`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `allowDirectControlSetting`
  -
    - **address:** 0x10e9bfdc
    - **class:** 6
    - **root:** group
    - **members:** `authzTokenStatus`, `playerAnyOneSettingsGroup`, `book`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `allowDirectControlSetting`
  -
    - **address:** 0x10e9c2e0
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10e9c360
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10e9c3e0
    - **class:** 2
    - **root:** extendedPlaybackStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9c460
    - **class:** 10
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `alarmList`, `featureConfigZoneExperiment`, `alarmRunningState`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `actuator`, `featureConfigZoneExperiment`, `advertisingInfo`, `featureConfigZoneExperiment`, `activeZoneMember`
  -
    - **address:** 0x10e9c4e0
    - **class:** 10
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `alarmList`, `featureConfigZoneExperiment`, `alarmRunningState`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `actuator`, `featureConfigZoneExperiment`, `advertisingInfo`, `featureConfigZoneExperiment`, `activeZoneMember`
  -
    - **address:** 0x10e9c6a0
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10e9c720
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10e9c7a0
    - **class:** 3
    - **root:** lineInStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10e9c820
    - **class:** 4
    - **root:** authzUser
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10e9c8a0
    - **class:** 1
    - **root:** authzUser
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10e9c920
    - **class:** 4
    - **root:** availableSoftwareUpdate
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10e9c9a0
    - **class:** 7
    - **root:** tokenStatus
    - **members:** `authzTokenStatus`, `tokenStatus`, `bluetooth`, `tokenStatus`, `devices`, `tokenStatus`, `bluetoothPolicySettings`, `tokenStatus`, `lineInStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10e9ca20
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `lineInStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10e9caa0
    - **class:** 3
    - **root:** entitlementsList
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10e9cb20
    - **class:** 3
    - **root:** waterState
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `upnpEvent`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10e9cba0
    - **class:** 3
    - **root:** battery
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9cc20
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10e9cca0
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10e9cd20
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10e9cda0
    - **class:** 3
    - **root:** loopbackTimeoutControl
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10e9ce20
    - **class:** 3
    - **root:** versionChanged
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10e9cea0
    - **class:** 3
    - **root:** playlistTrack
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10e9cf20
    - **class:** 3
    - **root:** bluetoothPairing
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10e9cfa0
    - **class:** 3
    - **root:** lineInSettings
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10e9d3fc
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10e9d47c
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10e9d4fc
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10e9d57c
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `devices`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9d5fc
    - **class:** 3
    - **root:** hdmiStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10e9d67c
    - **class:** 3
    - **root:** hdmiStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10e9d6fc
    - **class:** 3
    - **root:** accessorySwap
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9d77c
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9d7fc
    - **class:** 3
    - **root:** trueroomStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9d87c
    - **class:** 3
    - **root:** 
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9d8fc
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9d97c
    - **class:** 3
    - **root:** trueroomStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9d9fc
    - **class:** 3
    - **root:** speakerPresenceResult
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9da7c
    - **class:** 3
    - **root:** accessoryId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9df80
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10e9e000
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9e080
    - **class:** 3
    - **root:** metadataStatus
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `allowAirplaySetting`
  -
    - **address:** 0x10e9e100
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `activeZoneMember`, `playbackPolicy`, `actuator`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9e180
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `actuator`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9e200
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `actuator`, `playbackPolicy`, `cloudRegistrationStatus`, `playbackPolicy`, `activeZoneMember`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9e280
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9e300
    - **class:** 7
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `actuator`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `bluetoothPolicySettings`, `playbackPolicy`, `album`, `playbackPolicy`, `bluetooth`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9e380
    - **class:** 6
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `actuator`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `bluetoothPolicySettings`, `playbackPolicy`, `album`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9e400
    - **class:** 6
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `actuator`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `bluetoothPolicySettings`, `playbackPolicy`, `album`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9e480
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `actuator`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `bluetoothPolicySettings`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9e500
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `actuator`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `bluetoothPolicySettings`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9e580
    - **class:** 10
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `accessoryWifiPsk`, `battery`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `alarmDescription`, `featureConfigZoneExperiment`, `alarmList`, `featureConfigZoneExperiment`, `alarmRunningState`, `featureConfigZoneExperiment`, `cloudRegistrationStatus`, `featureConfigZoneExperiment`, `advertisingInfo`, `featureConfigZoneExperiment`, `activeZoneMember`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10e9e600
    - **class:** 7
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `alarmRunningState`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `actuator`, `featureConfigZoneExperiment`, `advertisingInfo`, `featureConfigZoneExperiment`, `activeZoneMember`
  -
    - **address:** 0x10e9e680
    - **class:** 9
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `accessoryWifiPsk`, `battery`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `alarmRunningState`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `actuator`, `featureConfigZoneExperiment`, `advertisingInfo`, `featureConfigZoneExperiment`, `activeZoneMember`
  -
    - **address:** 0x10e9e700
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `activeZoneMember`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10e9e780
    - **class:** 12
    - **root:** networkTestId
    - **members** (23):
    
      ```
      authzTokenStatus, accessoryWifiPsk, battery, featureConfigZoneExperiment, alarmRunningState, featureConfigZoneExperiment, bluetoothPolicySettings, featureConfigZoneExperiment, book, featureConfigZoneExperiment, alarmDescription, featureConfigZoneExperiment, cloudRegistrationStatus, featureConfigZoneExperiment, activeZoneMember, featureConfigZoneExperiment, actuator, featureConfigZoneExperiment, advertisingInfo, featureConfigZoneExperiment, alarmList, globalSettings, wiredSubStatus
      ```
  -
    - **address:** 0x10e9e800
    - **class:** 6
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `actuator`, `playbackPolicy`, `album`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `bluetooth`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9f568
    - **class:** 2
    - **root:** 
    - **members:** ``
  -
    - **address:** 0x10e9f5e8
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9f668
    - **class:** 3
    - **root:** ethernetPorts
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `allowAirplaySetting`
  -
    - **address:** 0x10e9f7b8
    - **class:** 3
    - **root:** globalSettings
    - **members:** `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `album`, `featureConfigZoneExperiment`, `lineInStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9f838
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10e9f8b8
    - **class:** 7
    - **root:** accessoryWifiPsk
    - **members:** `battery`, `service`, `authzTokenStatus`, `secureRegCert`, `areas`, `secureRegCert`, `area`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9f938
    - **class:** 6
    - **root:** service
    - **members:** `authzTokenStatus`, `secureRegCert`, `areas`, `secureRegCert`, `area`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9f9b8
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `secureRegCert`, `areas`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10e9fa38
    - **class:** 7
    - **root:** accessoryWifiPsk
    - **members:** `battery`, `service`, `authzTokenStatus`, `secureRegCert`, `areas`, `secureRegCert`, `area`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9fab8
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9fb38
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10e9fbb8
    - **class:** 7
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `album`, `featureConfigZoneExperiment`, `lineInStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10e9fc38
    - **class:** 7
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10e9fcb8
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `activeZoneMember`
  -
    - **address:** 0x10e9fd38
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `activeZoneMember`, `featureConfigZoneExperiment`, `book`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10e9fdb8
    - **class:** 6
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `playbackPolicy`, `album`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `bluetooth`
  -
    - **address:** 0x10e9fe38
    - **class:** 6
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `album`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `bluetooth`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10e9feb8
    - **class:** 7
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `album`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `bluetooth`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10e9ff38
    - **class:** 6
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `actuator`, `playbackPolicy`, `bluetoothPolicySettings`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10e9ffb8
    - **class:** 6
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `actuator`, `playbackPolicy`, `bluetoothPolicySettings`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10ea0038
    - **class:** 7
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `album`, `featureConfigZoneExperiment`, `lineInStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10ea00b8
    - **class:** 6
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `playbackPolicy`, `album`, `playbackPolicy`, `lineInStatus`, `playbackPolicy`, `bluetooth`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10ea05b8
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10ea0638
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10ea06b8
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `cloudDevice`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10ea0738
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `cloudDevice`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10ea07b8
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `cloudDevice`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10ea0838
    - **class:** 1
    - **root:** playerSettings
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10ea08b8
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10ea0938
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10f9f87c
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10f9f8fc
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10f9f97c
    - **class:** 1
    - **root:** alarm
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10f9f9fc
    - **class:** 2
    - **root:** activeZoneMember
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10f9fa7c
    - **class:** 5
    - **root:** activeZoneMember
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, ``, `featureConfigZoneExperiment`, ``, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10f9fafc
    - **class:** 5
    - **root:** activeZoneMember
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, ``, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10f9fb7c
    - **class:** 4
    - **root:** activeZoneMember
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10f9fbfc
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10f9fde4
    - **class:** 1
    - **root:** 
    - **members:** ``
  -
    - **address:** 0x10f9fe64
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10f9fee4
    - **class:** 1
    - **root:** amazonAlexaSetup
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10f9ff64
    - **class:** 5
    - **root:** amazonAlexaAccount
    - **members:** `authzTokenStatus`, `playerAnyOneSettingsGroup`, `book`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10f9ffe4
    - **class:** 6
    - **root:** amazonAlexaAccount
    - **members:** `authzTokenStatus`, `playerAnyOneSettingsGroup`, `book`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `none`
  -
    - **address:** 0x10fa0064
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `none`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fa020c
    - **class:** 3
    - **root:** featureConfigZoneExperiment
    - **members:** `activeZonesChange`
  -
    - **address:** 0x10fa028c
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10fa030c
    - **class:** 9
    - **root:** versionChanged
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `cloudDevice`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `accessorySwap`, `featureConfigZoneExperiment`, `lineInStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `tvAudioSignalStatus`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10fa038c
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `accessoryId`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10fa0558
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10fa05d8
    - **class:** 1
    - **root:** authzModifier
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa0658
    - **class:** 2
    - **root:** authorizationGrantResponse
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fa06d8
    - **class:** 5
    - **root:** upnpEvent
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `cloudDevice`, `featureConfigZoneExperiment`, `cloudRegistrationStatus`
  -
    - **address:** 0x10fa0758
    - **class:** 6
    - **root:** upnpEvent
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `deviceInfo`, `featureConfigZoneExperiment`, `commandHeader`, `featureConfigZoneExperiment`, `bridgeContext`
  -
    - **address:** 0x10fa093c
    - **class:** 1
    - **root:** 
    - **members:** ``
  -
    - **address:** 0x10fa09bc
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa0a3c
    - **class:** 1
    - **root:** recurrenceRule
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa0abc
    - **class:** 8
    - **root:** networkTestId
    - **members:** `availableSoftwareUpdate`, `featureConfigZoneExperiment`, `bleMeasurement`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `channelMapPair`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `activeZone`, `featureConfigZoneExperiment`, `contentMetadataBlob`, `featureConfigZoneExperiment`, `activeZonesChange`
  -
    - **address:** 0x10fa0b3c
    - **class:** 2
    - **root:** networkTestId
    - **members:** `availableSoftwareUpdate`, `featureConfigZoneExperiment`, `activeZonesChange`
  -
    - **address:** 0x10fa0bbc
    - **class:** 2
    - **root:** lineInSettingsGroup
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa0dd0
    - **class:** 1
    - **root:** authzTokenStatus
    - **members:** 
  -
    - **address:** 0x10fa0e50
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa0ed0
    - **class:** 3
    - **root:** deviceInfo
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `content`
  -
    - **address:** 0x10fa0f50
    - **class:** 3
    - **root:** upnpEvent
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `cloudRegistrationStatus`
  -
    - **address:** 0x10fa0fd0
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa1158
    - **class:** 1
    - **root:** 
    - **members:** 
  -
    - **address:** 0x10fa11d8
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa1258
    - **class:** 4
    - **root:** playbackStatus
    - **members:** `authzTokenStatus`, `networkTestId`, `battery`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa12d8
    - **class:** 4
    - **root:** playbackError
    - **members:** `authzTokenStatus`, `networkTestId`, `battery`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa1358
    - **class:** 6
    - **root:** playbackStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `poeState`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bridgeContext`
  -
    - **address:** 0x10fa13d8
    - **class:** 6
    - **root:** playbackError
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `poeState`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bridgeContext`
  -
    - **address:** 0x10fa15e0
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10fa1660
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa16e0
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa1760
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa17e0
    - **class:** 2
    - **root:** enableContentAccessSetting
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa1860
    - **class:** 2
    - **root:** enableContentAccessSetting
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa1a68
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa1ae8
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10fa1b68
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa1be8
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa1c68
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa1ce8
    - **class:** 3
    - **root:** groupInfo
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa1e60
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10fa1ee0
    - **class:** 1
    - **root:** networkTestId
    - **members:** 
  -
    - **address:** 0x10fa1f60
    - **class:** 2
    - **root:** upnpEvent
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fa1fe0
    - **class:** 2
    - **root:** directControl
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fa2060
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fa2224
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa22a4
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `lineInStatus`
  -
    - **address:** 0x10fa2324
    - **class:** 3
    - **root:** content
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `lineInStatus`, `featureConfigZoneExperiment`, `bleMeasurement`
  -
    - **address:** 0x10fa23a4
    - **class:** 1
    - **root:** content
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa2424
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `lineInStatus`
  -
    - **address:** 0x10fa24a4
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `lineInStatus`
  -
    - **address:** 0x10fa25f4
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10fa26dc
    - **class:** 2
    - **root:** featureConfigZoneExperiment
    - **members:** `devices`
  -
    - **address:** 0x10fa275c
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa27dc
    - **class:** 4
    - **root:** networkTestId
    - **members:** `availableSoftwareUpdate`, `featureConfigZoneExperiment`, `authzPolicyKeyLechmere`, `households`, `entitlement`, `featureConfigZoneExperiment`, `cloudRegistrationStatus`
  -
    - **address:** 0x10fa285c
    - **class:** 1
    - **root:** household
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa2a04
    - **class:** 2
    - **root:** diagnosticSubmissionResults
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa2adc
    - **class:** 2
    - **root:** featureConfigZoneExperiment
    - **members:** `lineInStatus`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10fa2b5c
    - **class:** 2
    - **root:** image
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fa2c68
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10fa2ce8
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa2d68
    - **class:** 2
    - **root:** settingsChanged
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa2de8
    - **class:** 7
    - **root:** versionChanged
    - **members:** `availableSoftwareUpdate`, `featureConfigZoneExperiment`, `cloudDevice`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `audioClip`, `featureConfigZoneExperiment`, `audioClipStatus`, `featureConfigZoneExperiment`, `artist`
  -
    - **address:** 0x10fa2e68
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `cloudDevice`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `audioClipStatus`, `featureConfigZoneExperiment`, `asyncRequestAck`
  -
    - **address:** 0x10fa2ee8
    - **class:** 2
    - **root:** networkTestId
    - **members:** `availableSoftwareUpdate`, `featureConfigZoneExperiment`, `audioClipStatus`
  -
    - **address:** 0x10fa2f68
    - **class:** 2
    - **root:** upnpEvent
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa3130
    - **class:** 2
    - **root:** authzTokenStatus
    - **members:** `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `lineInStatus`, `featureConfigZoneExperiment`, `upnpEvent`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa31b0
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa32a4
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10fa3324
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa33a4
    - **class:** 3
    - **root:** microphoneSwitch
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa3424
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fa34a4
    - **class:** 3
    - **root:** microphoneSwitch
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `amazonAlexaAccount`, `featureConfigZoneExperiment`, `allowLineInSetting`
  -
    - **address:** 0x10fa3524
    - **class:** 4
    - **root:** microphoneSwitch
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fa35a4
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10fa37c4
    - **class:** 3
    - **members:** 
  -
    - **address:** 0x10fa3844
    - **class:** 3
    - **root:** musicServiceAccount
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `area`
  -
    - **address:** 0x10fa38c4
    - **class:** 3
    - **root:** network
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `area`
  -
    - **address:** 0x10fa3a44
    - **class:** 2
    - **root:** accessoryId
    - **members:** `accessoryId`, `accessoryId`
  -
    - **address:** 0x10fa3ac4
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa3b44
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa3bc4
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `authzPolicyKey`
  -
    - **address:** 0x10fa3c44
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa3cc4
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa3d44
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa3dc4
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa3e44
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa3ec4
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa4098
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa4118
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa4198
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `cloudDevice`
  -
    - **address:** 0x10fa42cc
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa434c
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10fa43cc
    - **class:** 2
    - **root:** localVoiceSettings
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10fa444c
    - **class:** 4
    - **root:** queueItem
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa4584
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10fa4604
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa4684
    - **class:** 2
    - **root:** playerSetError
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa4704
    - **class:** 3
    - **root:** playlist
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa4784
    - **class:** 3
    - **root:** playlist
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa4804
    - **class:** 9
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `alarmRunningState`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `actuator`, `featureConfigZoneExperiment`, `advertisingInfo`, `featureConfigZoneExperiment`, `activeZoneMember`
  -
    - **address:** 0x10fa49c0
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa4a40
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fa4ac0
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `audioConnectorStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa4b40
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fa4bc0
    - **class:** 4
    - **root:** speakerPresenceEffectiveRate
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa4c40
    - **class:** 6
    - **root:** positioningSessionStatusInfo
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `devices`, `featureConfigZoneExperiment`, `authorizationGrantResponse`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10fa4cc0
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `authorizationGrantHeader`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa4d40
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `authorizationGrantHeader`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa4dc0
    - **class:** 6
    - **root:** positioningDevice
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `area`, `featureConfigZoneExperiment`, `authorizationGrantPayload`, `featureConfigZoneExperiment`, `authorizationGrantHeader`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa4e40
    - **class:** 6
    - **root:** poeState
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `area`, `featureConfigZoneExperiment`, `authorizationGrantPayload`, `featureConfigZoneExperiment`, `authorizationGrantHeader`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa4ec0
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `authorizationGrantHeader`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa4f40
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `authorizationGrantHeader`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa4fc0
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `authorizationGrantHeader`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa5040
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa50c0
    - **class:** 3
    - **root:** positioningMap
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa5140
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `devices`
  -
    - **address:** 0x10fa55a0
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10fa5690
    - **class:** 6
    - **members:** 
  -
    - **address:** 0x10fa5710
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10fa584c
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10fa58cc
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa594c
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa59cc
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa5a4c
    - **class:** 3
    - **root:** sessionError
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa5acc
    - **class:** 3
    - **root:** player
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa5b4c
    - **class:** 6
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `upnpEvent`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `cloudRegistrationStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `lineInStatus`
  -
    - **address:** 0x10fa5bcc
    - **class:** 5
    - **root:** networkTestId
    - **members:** 
  -
    - **address:** 0x10fa5c4c
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10fa5ccc
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `upnpEvent`
  -
    - **address:** 0x10fa5d4c
    - **class:** 4
    - **root:** networkTestId
    - **members:** `availableSoftwareUpdate`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa5dcc
    - **class:** 4
    - **root:** playbackStatus
    - **members:** `authzTokenStatus`, `networkTestId`, `battery`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa5e4c
    - **class:** 4
    - **root:** playbackError
    - **members:** `authzTokenStatus`, `networkTestId`, `battery`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa5ecc
    - **class:** 6
    - **root:** playbackStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `poeState`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bridgeContext`
  -
    - **address:** 0x10fa5f4c
    - **class:** 6
    - **root:** playbackError
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `poeState`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bridgeContext`
  -
    - **address:** 0x10fa5fcc
    - **class:** 1
    - **root:** upnpEvent
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa604c
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa60cc
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa614c
    - **class:** 2
    - **root:** preferredLanguageSetting
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `diagnosticInfo`
  -
    - **address:** 0x10fa61cc
    - **class:** 4
    - **root:** postHistoryConfig
    - **members:** `authzTokenStatus`, `networksList`, `authzTokenStatus`, `featureConfigZoneExperiment`, `devices`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa624c
    - **class:** 7
    - **root:** positionInformation
    - **members:** `authzTokenStatus`, `softwareUpdate`, `authzTokenStatus`, `smartplayContentResource`, `authzTokenStatus`, `musicServicesChanged`, `authzTokenStatus`, `networksList`, `authzTokenStatus`, `featureConfigZoneExperiment`, `devices`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa62cc
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa6868
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa68e8
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`
  -
    - **address:** 0x10fa6968
    - **class:** 4
    - **root:** sharesList
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa69e8
    - **class:** 3
    - **root:** sharesList
    - **members:** `authzTokenStatus`, `globalSettings`, `wiredSubStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa6b6c
    - **class:** 2
    - **root:** shareListStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa6c50
    - **class:** 3
    - **root:** 
    - **members:** 
  -
    - **address:** 0x10fa6cd0
    - **class:** 2
    - **root:** sonosnet
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa6ddc
    - **class:** 4
    - **members:** 
  -
    - **address:** 0x10fa6e5c
    - **class:** 4
    - **root:** voiceAccountProfile
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `authzModifier`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fa6edc
    - **class:** 5
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `authzModifier`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fa7084
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa7104
    - **class:** 3
    - **root:** timer
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa7218
    - **class:** 2
    - **root:** RegistrationToken
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `cloudRegistrationStatus`
  -
    - **address:** 0x10fa7300
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10fa7380
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa7400
    - **class:** 1
    - **root:** systemNameSetting
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa7480
    - **class:** 4
    - **root:** swapModelInfo
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `cloudDevice`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fa7500
    - **class:** 5
    - **root:** swapModelInfo
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `cloudDevice`, `featureConfigZoneExperiment`, `authzPermission`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fa7580
    - **class:** 5
    - **root:** swapModelInfo
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `cloudDevice`, `featureConfigZoneExperiment`, `authzPermission`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fa7600
    - **class:** 3
    - **root:** swapModelInfo
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `authzPermission`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa7680
    - **class:** 3
    - **root:** swapModelInfo
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `authzPermission`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa7700
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `authzPermission`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa7950
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10fa79d0
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa7a50
    - **class:** 2
    - **root:** sonosnetEnabled
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa7ad0
    - **class:** 2
    - **root:** speakerDetectionStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa7b50
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa7bd0
    - **class:** 2
    - **root:** sonosDeviceNonce
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa7c50
    - **class:** 1
    - **root:** translatedObjectIds
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa7cd0
    - **class:** 1
    - **root:** translatedObjectIds
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa7d50
    - **class:** 2
    - **root:** translation
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa7f58
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa7fd8
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fa8058
    - **class:** 3
    - **root:** trueroomAdaptationStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa80d8
    - **class:** 4
    - **root:** trueplayStatus
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fa8158
    - **class:** 2
    - **root:** speakerPresenceEffectiveRate
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa81d8
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa8258
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa8444
    - **class:** 1
    - **members:** 
  -
    - **address:** 0x10fa84c4
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fa8544
    - **class:** 6
    - **root:** uniqueSetTestData
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `accessPolicySetting`, `featureConfigZoneExperiment`, `accountError`, `featureConfigZoneExperiment`, `acousticMeasurement`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fa85c4
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `acousticMetrics`, `featureConfigZoneExperiment`, `cloudRegistrationStatus`
  -
    - **address:** 0x10fa8644
    - **class:** 2
    - **root:** deviceInfo
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `cloudRegistrationStatus`
  -
    - **address:** 0x10fa87a8
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa8828
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa88a8
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa8928
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa8a64
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa8ae4
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa8b64
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa8be4
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa8d10
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa8d90
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa8e10
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa8e90
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa8fbc
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa903c
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa90bc
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa913c
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9268
    - **class:** 2
    - **root:** 
    - **members:** 
  -
    - **address:** 0x10fa92e8
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9368
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa93e8
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9514
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa9594
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9614
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9694
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa97c0
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa9840
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa98c0
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9940
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9a6c
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa9aec
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9b6c
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9bec
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9d18
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fa9d98
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9e18
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9e98
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10fa9fc4
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10faa044
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa0c4
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa144
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa270
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10faa2f0
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa370
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa3f0
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa51c
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10faa59c
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa61c
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa69c
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa7c8
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10faa848
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa8c8
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faa948
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faaa74
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10faaaf4
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faab74
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faabf4
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faad20
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10faada0
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faae20
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faaea0
    - **class:** 3
    - **root:** upnpError
    - **members:** `authzTokenStatus`, `uniqueSetTestItem`, `bluetooth`, `featureConfigZoneExperiment`, `duration`
  -
    - **address:** 0x10faafcc
    - **class:** 4
    - **members:** 
  -
    - **address:** 0x10fab04c
    - **class:** 4
    - **root:** translatedObjectId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `upnpEvent`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fab0cc
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `upnpEvent`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fab14c
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `upnpEvent`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fab1cc
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fab24c
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fab3e4
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fab4dc
    - **class:** 2
    - **members:** 
  -
    - **address:** 0x10fab55c
    - **class:** 6
    - **root:** accessoryWifiPsk
    - **members:** `batteryCells`, `accessoryWifiPsk`, `book`, `accessoryWifiPsk`, `bluetooth`, `accessoryWifiPsk`, `lineInStatus`, `videoContent`, `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fab5dc
    - **class:** 6
    - **root:** accessoryWifiPsk
    - **members:** `battery`, `accessoryWifiPsk`, `book`, `accessoryWifiPsk`, `bluetooth`, `accessoryWifiPsk`, `lineInStatus`, `videoContent`, `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fab65c
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `accessoryWifiPsk`, `bluetooth`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fab6dc
    - **class:** 3
    - **root:** allowLineInSetting
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`, `featureConfigZoneExperiment`, `bleMeasurement`
  -
    - **address:** 0x10fab75c
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fab7dc
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fab85c
    - **class:** 2
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `deeplink`
  -
    - **address:** 0x10fabac8
    - **class:** 1
    - **root:** 
    - **members:** ``, ``
  -
    - **address:** 0x10fabb48
    - **class:** 1
    - **root:** networkTestId
    - **members:** `authzTokenStatus`
  -
    - **address:** 0x10fabbc8
    - **class:** 2
    - **root:** activeZonesChange
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fabc48
    - **class:** 3
    - **root:** weatherConfig
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fabcc8
    - **class:** 2
    - **root:** wifiDisable
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`
  -
    - **address:** 0x10fabd48
    - **class:** 4
    - **root:** weatherConfig
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `zoneDefinitionsChange`
  -
    - **address:** 0x10fabdc8
    - **class:** 4
    - **root:** weatherConfig
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `zoneDefinitionsChange`
  -
    - **address:** 0x10fabe48
    - **class:** 4
    - **root:** weatherConfig
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `zoneDefinitionsChange`
  -
    - **address:** 0x10fabec8
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `zoneDefinitionsChange`
  -
    - **address:** 0x10fabf48
    - **class:** 3
    - **root:** weatherConfig
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fabfc8
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fac048
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fac0c8
    - **class:** 3
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`
  -
    - **address:** 0x10fac148
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
  -
    - **address:** 0x10fac1c8
    - **class:** 4
    - **root:** networkTestId
    - **members:** `authzTokenStatus`, `featureConfigZoneExperiment`, `bluetooth`, `featureConfigZoneExperiment`, `book`, `featureConfigZoneExperiment`, `bluetoothPolicySettings`
::: details Evidence (1)

- @ 0x10e9ba80/0x10f9f87c; 383 0x80-byte descriptor records; accessor+fffff88 signature; root names resolved via spec_object_table

:::


:::

## `spec_object_table`

**coverage** `confirmed`

The master vocabulary for the whole cloud-API schema system: a table of 331 entries where every type name, field name, event name, and namespace label lives. Number codes inside each operation's spec index into this table to spell out that operation's fields, and both directions of the lookup were found in the binary, which is what proved the numbering scheme beyond doubt.

::: details Technical details

Pointer table at .rodata 0x10f97088-0x10f975b0, 331 entries. Slots 0-2 = function pointers (0x10809540, primitive formatters) - unreachable via the semantic index space. RUNTIME INDEXING RESOLVED: idx->name lookup f_109ecb5c uses base 0x10f97094 (=table+3) with bound 326, i.e. semantic index i maps to table slot i+3; name->idx f_109ecb90 strcmps from 'none' forward. Semantic idx0='none' (table slot 3). Semantic idx 1..325 = named objects: ~203 contiguous alphabetical type names @0x10f975c0-0x10f98568 (accessorySwap..zoneMemberState), 40 event-type names, 11x upnpEvent (per UPnP-bridge namespace), namespace/resource names. The 'entries' list below uses RAW table slot numbers (add -3 for the semantic spec index).

- **name:** muse spec-object index table (331 entries)
- **entries:**
  - idx: 0, ptr: 10809540, name: 
  - idx: 1, ptr: 10809540, name: 
  - idx: 2, ptr: 10809540, name: 
  - idx: 3, ptr: 10ea50a0, name: none
  - idx: 4, ptr: 10f975b4, name: accessoryId
  - idx: 5, ptr: 10f975c0, name: accessorySwap
  - idx: 6, ptr: 10f975c0, name: accessorySwap
  - idx: 7, ptr: 10f960f4, name: tvAudioSignalStatus
  - idx: 8, ptr: 10f975d0, name: accessoryWifiPsk
  - idx: 9, ptr: 10f975e4, name: accessPolicyControl
  - idx: 10, ptr: 10f975f8, name: accessPolicySetting
  - idx: 11, ptr: 10f9760c, name: accountError
  - idx: 12, ptr: 10f9761c, name: acousticMeasurement
  - idx: 13, ptr: 10f97630, name: acousticMetrics
  - idx: 14, ptr: 10e961f4, name: activeZone
  - idx: 15, ptr: 10f96108, name: activeZonesChange
  - idx: 16, ptr: 10f9611c, name: zoneDefinitionsChange
  - idx: 17, ptr: 10f96134, name: zoneError
  - idx: 18, ptr: 10f97640, name: activeZoneList
  - idx: 19, ptr: 10f97650, name: activeZoneMember
  - idx: 20, ptr: 10f97664, name: actuator
  - idx: 21, ptr: 10e9f204, name: advertisingInfo
  - idx: 22, ptr: 10eab7e0, name: alarm
  - idx: 23, ptr: 10f9663c, name: upnpEvent
  - idx: 24, ptr: 10f97670, name: alarmDescription
  - idx: 25, ptr: 10f97684, name: alarmList
  - idx: 26, ptr: 10f97690, name: alarmRunningState
  - idx: 27, ptr: 10f976a4, name: versionChanged
  - idx: 28, ptr: 10e77820, name: album
  - idx: 29, ptr: 10f976b4, name: allowAirplaySetting
  - idx: 30, ptr: 10f976c8, name: allowDirectControlSetting
  - idx: 31, ptr: 10f976e4, name: allowLineInSetting
  - idx: 32, ptr: 10f976f8, name: amazonAlexaAccount
  - idx: 33, ptr: 10f9770c, name: amazonAlexaSetup
  - idx: 34, ptr: 10e86248, name: amazonChallenge
  - idx: 35, ptr: 10ead3d8, name: area
  - idx: 36, ptr: 10e7c0e4, name: areas
  - idx: 37, ptr: 10f976a4, name: versionChanged
  - idx: 38, ptr: 10e77750, name: artist
  - idx: 39, ptr: 10f97720, name: asyncRequestAck
  - idx: 40, ptr: 10f96d6c, name: audioClip
  - idx: 41, ptr: 10f96174, name: audioClipStatus
  - idx: 42, ptr: 10f97730, name: audioConnectorStatus
  - idx: 43, ptr: 10f9663c, name: upnpEvent
  - idx: 44, ptr: 10f97748, name: authorizationGrantHeader
  - idx: 45, ptr: 10f97764, name: authorizationGrantPayload
  - idx: 46, ptr: 10f97780, name: authorizationGrantResponse
  - idx: 47, ptr: 10f9779c, name: authzModifier
  - idx: 48, ptr: 10f977ac, name: authzPermission
  - idx: 49, ptr: 10f977bc, name: authzPermissions
  - idx: 50, ptr: 10f977d0, name: authzPolicyKey
  - idx: 51, ptr: 10f977e0, name: authzPolicyKeyLechmere
  - idx: 52, ptr: 10f977f8, name: authzTokenStatus
  - idx: 53, ptr: 10f9780c, name: authzUser
  - idx: 54, ptr: 10f96190, name: availableSoftwareUpdate
  - idx: 55, ptr: 10f9663c, name: upnpEvent
  - idx: 56, ptr: 10ef9000, name: battery
  - idx: 57, ptr: 10f97818, name: batteryCells
  - idx: 58, ptr: 10ef9000, name: battery
  - idx: 59, ptr: 10f961c4, name: wirelessNetworkStatus
  - idx: 60, ptr: 10f97828, name: microphoneSwitch
  - idx: 61, ptr: 10f9783c, name: waterState
  - idx: 62, ptr: 10f97848, name: bluetoothPairing
  - idx: 63, ptr: 10ecc164, name: bluetooth
  - idx: 64, ptr: 10f9785c, name: poeState
  - idx: 65, ptr: 10f96240, name: lineInStatus
  - idx: 66, ptr: 10f97868, name: wiredSubStatus
  - idx: 67, ptr: 10f97878, name: bleMeasurement
  - idx: 68, ptr: 10ecc164, name: bluetooth
  - idx: 69, ptr: 10f97888, name: bluetoothDevice
  - idx: 70, ptr: 10f97848, name: bluetoothPairing
  - idx: 71, ptr: 10f97898, name: bluetoothPolicySettings
  - idx: 72, ptr: 10f19fcc, name: book
  - idx: 73, ptr: 10ea04f4, name: bridgeContext
  - idx: 74, ptr: 10f978b0, name: channelMapPair
  - idx: 75, ptr: 10f978c0, name: chirpRequest
  - idx: 76, ptr: 10f978d0, name: cloudDevice
  - idx: 77, ptr: 10f978dc, name: cloudRegistrationStatus
  - idx: 78, ptr: 10f978dc, name: cloudRegistrationStatus
  - idx: 79, ptr: 10f978f4, name: commandHeader
  - idx: 80, ptr: 10f9663c, name: upnpEvent
  - idx: 81, ptr: 10ed8838, name: container
  - idx: 82, ptr: 10f9f778, name: content
  - idx: 83, ptr: 10f9663c, name: upnpEvent
  - idx: 84, ptr: 10f97904, name: contentMetadataBlob
  - idx: 85, ptr: 10f97918, name: contentPagedResources
  - idx: 86, ptr: 10f97930, name: contentPageInfo
  - idx: 87, ptr: 10f97940, name: contentResource
  - idx: 88, ptr: 10f97950, name: createInviteResponse
  - idx: 89, ptr: 10f97968, name: deeplink
  - idx: 90, ptr: 10e7c864, name: devices
  - idx: 91, ptr: 10f97974, name: deviceInfo
  - idx: 92, ptr: 10f97974, name: deviceInfo
  - idx: 93, ptr: 10f9663c, name: upnpEvent
  - idx: 94, ptr: 10f97980, name: deviceSoftwareUpdateStatus
  - idx: 95, ptr: 10f9799c, name: diagnosticInfo
  - idx: 96, ptr: 10f979ac, name: diagnosticSubmissionMetadata
  - idx: 97, ptr: 10f979cc, name: diagnosticSubmissionResult
  - idx: 98, ptr: 10f962bc, name: diagnosticSubmissionResults
  - idx: 99, ptr: 10f962d8, name: diagnosticMetadata
  - idx: 100, ptr: 10f979e8, name: directControl
  - idx: 101, ptr: 10f979f8, name: discoveryInfo
  - idx: 102, ptr: 10fd09d0, name: duration
  - idx: 103, ptr: 10f97a08, name: edidStatus
  - idx: 104, ptr: 10f97a14, name: settingsChanged
  - idx: 105, ptr: 10f97a24, name: enableContentAccessSetting
  - idx: 106, ptr: 10f97a40, name: entitlement
  - idx: 107, ptr: 10e7d0fc, name: entitlements
  - idx: 108, ptr: 10f97a4c, name: entitlementsList
  - idx: 109, ptr: 10f976a4, name: versionChanged
  - idx: 110, ptr: 10f97a60, name: eqSettings
  - idx: 111, ptr: 10f97a6c, name: ethernetPorts
  - idx: 112, ptr: 10f97a7c, name: ethernetPortStatus
  - idx: 113, ptr: 10f96328, name: extendedDeviceStatus
  - idx: 114, ptr: 10f96340, name: extendedPlaybackStatus
  - idx: 115, ptr: 10f97a90, name: externalId
  - idx: 116, ptr: 10f086c4, name: favorite
  - idx: 117, ptr: 10f97a9c, name: favoritesList
  - idx: 118, ptr: 10f976a4, name: versionChanged
  - idx: 119, ptr: 10f97aac, name: feature
  - idx: 120, ptr: 10f97ab4, name: featureConfig
  - idx: 121, ptr: 10f97ac4, name: featureConfigDropoutContext
  - idx: 122, ptr: 10f97ae0, name: featureConfigHomeTheaterWifiPerfTelemetry
  - idx: 123, ptr: 10f97b0c, name: featureConfigMetricsService
  - idx: 124, ptr: 10f97b28, name: featureConfigPlink
  - idx: 125, ptr: 10f97b3c, name: featureConfigQuickbonding
  - idx: 126, ptr: 10f97b58, name: featureConfigSemiSleep
  - idx: 127, ptr: 10f97b70, name: featureConfigSmartPlay
  - idx: 128, ptr: 10f97b88, name: featureConfigSpotABR
  - idx: 129, ptr: 10f97ba0, name: featureConfigSsdpAdvertiseConfig
  - idx: 130, ptr: 10f97bc4, name: featureConfigZoneExperiment
  - idx: 131, ptr: 10f97be0, name: geoLocation
  - idx: 132, ptr: 10f97bec, name: getUsersResponse
  - idx: 133, ptr: 10f97c00, name: globalError
  - idx: 134, ptr: 10f97c0c, name: globalSettings
  - idx: 135, ptr: 10eb20d4, name: group
  - idx: 136, ptr: 10e7d218, name: groups
  - idx: 137, ptr: 10f96370, name: groupCoordinatorChanged
  - idx: 138, ptr: 10f97c1c, name: groupInfo
  - idx: 139, ptr: 10f9663c, name: upnpEvent
  - idx: 140, ptr: 10f9663c, name: upnpEvent
  - idx: 141, ptr: 10e7d41c, name: groupVolume
  - idx: 142, ptr: 10eae760, name: hardwareVersion
  - idx: 143, ptr: 10f963a8, name: hdmiStatus
  - idx: 144, ptr: 10f976a4, name: versionChanged
  - idx: 145, ptr: 10f97c28, name: homeTheaterInputFormat
  - idx: 146, ptr: 10f97c40, name: homeTheaterOptions
  - idx: 147, ptr: 10f17d3c, name: household
  - idx: 148, ptr: 10e7ea80, name: households
  - idx: 149, ptr: 10f97c54, name: householdSoftwareUpdateStatus
  - idx: 150, ptr: 10f963cc, name: householdUpdateStatus
  - idx: 151, ptr: 10f963e4, name: upgradeManager
  - idx: 152, ptr: 10f9663c, name: upnpEvent
  - idx: 153, ptr: 10f97c74, name: idResponse
  - idx: 154, ptr: 10eeeb48, name: image
  - idx: 155, ptr: 10f96400, name: indexerStatus
  - idx: 156, ptr: 10f08274, name: intendedTargets
  - idx: 157, ptr: 10f97c80, name: irControlStatus
  - idx: 158, ptr: 10ee0c00, name: limitedSkipsState
  - idx: 159, ptr: 10f97c90, name: lineInSettings
  - idx: 160, ptr: 10f97ca0, name: lineInSettingsGroup
  - idx: 161, ptr: 10f97cb4, name: lineInStatusInfo
  - idx: 162, ptr: 10f97cc8, name: lineInStatusList
  - idx: 163, ptr: 10e9bc60, name: localDevices
  - idx: 164, ptr: 10f97cdc, name: localVoiceSettings
  - idx: 165, ptr: 10f97cf0, name: loopbackTimeoutControl
  - idx: 166, ptr: 10f97d08, name: manufacturingData
  - idx: 167, ptr: 10f97d1c, name: metadataStatus
  - idx: 168, ptr: 10f97828, name: microphoneSwitch
  - idx: 169, ptr: 10f9663c, name: upnpEvent
  - idx: 170, ptr: 10f96420, name: musicServicesChanged
  - idx: 171, ptr: 10f97d2c, name: musicServiceAccount
  - idx: 172, ptr: 10e999fc, name: network
  - idx: 173, ptr: 10f97d40, name: networksList
  - idx: 174, ptr: 10f0733c, name: networkTestId
  - idx: 175, ptr: 10f97d50, name: networkTestResult
  - idx: 176, ptr: 10efe25c, name: offlinePsk
  - idx: 177, ptr: 10e72320, name: ok
  - idx: 178, ptr: 10f97d64, name: patchEffectiveAllSettingsGroups
  - idx: 179, ptr: 10f97d84, name: patchEffectiveAnyOneSettingsGroup
  - idx: 180, ptr: 10f97da8, name: patchPlayerAllSettingsGroups
  - idx: 181, ptr: 10f97dc8, name: patchPlayerAnyOneSettingsGroup
  - idx: 182, ptr: 10e9f1e8, name: playbackAction
  - idx: 183, ptr: 10e9f1bc, name: playbackLocation
  - idx: 184, ptr: 10f97d1c, name: metadataStatus
  - idx: 185, ptr: 10f97de8, name: playbackPolicy
  - idx: 186, ptr: 10f97df8, name: playbackSettings
  - idx: 187, ptr: 10f96450, name: playbackStatus
  - idx: 188, ptr: 10e9f768, name: playbackError
  - idx: 189, ptr: 10ebde9c, name: player
  - idx: 190, ptr: 10f97e0c, name: playerAllSettingsGroups
  - idx: 191, ptr: 10f97e24, name: playerAnyOneSettingsGroup
  - idx: 192, ptr: 10f97e40, name: playerSettings
  - idx: 193, ptr: 10f97e50, name: playerSettingsEvent
  - idx: 194, ptr: 10f97e64, name: playerSetError
  - idx: 195, ptr: 10ea0d20, name: playerVolume
  - idx: 196, ptr: 10ec6334, name: playlist
  - idx: 197, ptr: 10f97e74, name: playlistsList
  - idx: 198, ptr: 10f976a4, name: versionChanged
  - idx: 199, ptr: 10ed34cc, name: playlistSummary
  - idx: 200, ptr: 10f97e84, name: playlistTrack
  - idx: 201, ptr: 10f97e94, name: playMode
  - idx: 202, ptr: 10ecf57c, name: podcast
  - idx: 203, ptr: 10f9785c, name: poeState
  - idx: 204, ptr: 10f97ea0, name: portableSurrounds
  - idx: 205, ptr: 10f97eb4, name: positioningDevice
  - idx: 206, ptr: 10f97ec8, name: positioningDeviceMeasurementList
  - idx: 207, ptr: 10f97eec, name: positioningDeviceStatusInfo
  - idx: 208, ptr: 10f97f08, name: positioningMap
  - idx: 209, ptr: 10f97f18, name: positioningMeasurement
  - idx: 210, ptr: 10f97f30, name: positioningMeasurementCapability
  - idx: 211, ptr: 10f97f54, name: positioningMeasurementCapabilityList
  - idx: 212, ptr: 10f97f7c, name: positioningSessionErrorInfo
  - idx: 213, ptr: 10f97f98, name: positioningSessionRequest
  - idx: 214, ptr: 10f97fb4, name: positioningSessionStatusInfo
  - idx: 215, ptr: 10f97f7c, name: positioningSessionErrorInfo
  - idx: 216, ptr: 10f97eec, name: positioningDeviceStatusInfo
  - idx: 217, ptr: 10f97fb4, name: positioningSessionStatusInfo
  - idx: 218, ptr: 10f97fd4, name: positioningSpatialData
  - idx: 219, ptr: 10f97fec, name: positioningTelemetry
  - idx: 220, ptr: 10f0ed88, name: positionInformation
  - idx: 221, ptr: 10f98004, name: postHistoryConfig
  - idx: 222, ptr: 10f98018, name: preferredLanguageSetting
  - idx: 223, ptr: 10f98034, name: protectedAdminSettings
  - idx: 224, ptr: 10f9804c, name: protectedSettings
  - idx: 225, ptr: 10f98060, name: publicSettings
  - idx: 226, ptr: 10f9663c, name: upnpEvent
  - idx: 227, ptr: 10f98070, name: queueItem
  - idx: 228, ptr: 10f9807c, name: queueItemWindow
  - idx: 229, ptr: 10f9808c, name: radioShow
  - idx: 230, ptr: 10f98098, name: rateStatus
  - idx: 231, ptr: 10ec21b8, name: rating
  - idx: 232, ptr: 10f980a4, name: recurrenceRule
  - idx: 233, ptr: 10f980b4, name: redeemInviteResponse
  - idx: 234, ptr: 10ee7290, name: registration
  - idx: 235, ptr: 10e7cb98, name: RegistrationState
  - idx: 236, ptr: 10f980cc, name: RegistrationToken
  - idx: 237, ptr: 10f980e0, name: registry
  - idx: 238, ptr: 10f980ec, name: registryCollection
  - idx: 239, ptr: 10f98100, name: relativeTimeStamp
  - idx: 240, ptr: 10f9663c, name: upnpEvent
  - idx: 241, ptr: 10f98114, name: replicatedAreas
  - idx: 242, ptr: 10f98124, name: reportOptions
  - idx: 243, ptr: 10f98134, name: restrictedAdminSettings
  - idx: 244, ptr: 10f9814c, name: sdkVersions
  - idx: 245, ptr: 10ef1f28, name: secureReg
  - idx: 246, ptr: 10f98158, name: secureRegCert
  - idx: 247, ptr: 10f98168, name: secureRegCertMetadata
  - idx: 248, ptr: 10eac178, name: service
  - idx: 249, ptr: 10f964d8, name: sessionError
  - idx: 250, ptr: 10f964e8, name: sessionInfo
  - idx: 251, ptr: 10f98180, name: sessionStatus
  - idx: 252, ptr: 10fd07a4, name: settings
  - idx: 253, ptr: 10f97a14, name: settingsChanged
  - idx: 254, ptr: 10f98190, name: settingsGroupMetadata
  - idx: 255, ptr: 10f976a4, name: versionChanged
  - idx: 256, ptr: 10f97a14, name: settingsChanged
  - idx: 257, ptr: 10f97e50, name: playerSettingsEvent
  - idx: 258, ptr: 10f981a8, name: share
  - idx: 259, ptr: 10f981b0, name: sharesList
  - idx: 260, ptr: 10f981bc, name: shareListStatus
  - idx: 261, ptr: 10f981cc, name: shareStatus
  - idx: 262, ptr: 10f96540, name: sleepTimerStatus
  - idx: 263, ptr: 10f981d8, name: smartplayContentResource
  - idx: 264, ptr: 10f981f4, name: softwareUpdate
  - idx: 265, ptr: 10f98204, name: softwareUpdateOptions
  - idx: 266, ptr: 10efb3ac, name: sonosnet
  - idx: 267, ptr: 10efe1e8, name: sonosnetEnabled
  - idx: 268, ptr: 10f9821c, name: sonosDeviceNonce
  - idx: 269, ptr: 10f98230, name: soundSwapRequestResponse
  - idx: 270, ptr: 10f9824c, name: speakerDetectionStatus
  - idx: 271, ptr: 10f98264, name: speakerPresenceEffectiveRate
  - idx: 272, ptr: 10f98284, name: speakerPresenceResult
  - idx: 273, ptr: 10f9829c, name: speakerPresenceResultList
  - idx: 274, ptr: 10f982b8, name: stimulusTuningEnabled
  - idx: 275, ptr: 10f982d0, name: swapModelInfo
  - idx: 276, ptr: 10f982e0, name: systemNameSetting
  - idx: 277, ptr: 10f9663c, name: upnpEvent
  - idx: 278, ptr: 10f982f4, name: timer
  - idx: 279, ptr: 10eab624, name: timers
  - idx: 280, ptr: 10f982fc, name: timeVal
  - idx: 281, ptr: 10f98304, name: timeZoneInfo
  - idx: 282, ptr: 10f98314, name: tokenStatus
  - idx: 283, ptr: 10edb528, name: track
  - idx: 284, ptr: 10f98320, name: trackQuality
  - idx: 285, ptr: 10f98330, name: transitionToShipModeStatus
  - idx: 286, ptr: 10f9834c, name: translatedObjectId
  - idx: 287, ptr: 10f98360, name: translatedObjectIds
  - idx: 288, ptr: 10f98374, name: translation
  - idx: 289, ptr: 10f98380, name: transportSetting
  - idx: 290, ptr: 10f98394, name: trueplayConfiguration
  - idx: 291, ptr: 10f96568, name: trueplayStatus
  - idx: 292, ptr: 10f9829c, name: speakerPresenceResultList
  - idx: 293, ptr: 10f98264, name: speakerPresenceEffectiveRate
  - idx: 294, ptr: 10f983ac, name: trueroomAdaptationStatus
  - idx: 295, ptr: 10f983ac, name: trueroomAdaptationStatus
  - idx: 296, ptr: 10f965cc, name: trueroomCalibrationStatus
  - idx: 297, ptr: 10f983c8, name: trueroomStatus
  - idx: 298, ptr: 10f983d8, name: trueroomEstimatorConfig
  - idx: 299, ptr: 10f983c8, name: trueroomStatus
  - idx: 300, ptr: 10f983f0, name: trustedAccessories
  - idx: 301, ptr: 10f98404, name: uniqueSetTestData
  - idx: 302, ptr: 10f98418, name: uniqueSetTestItem
  - idx: 303, ptr: 10f9842c, name: universalMusicObjectId
  - idx: 304, ptr: 10f98444, name: updateItem
  - idx: 305, ptr: 10ec400c, name: upnpError
  - idx: 306, ptr: 10f9663c, name: upnpEvent
  - idx: 307, ptr: 10f98450, name: upnpParameter
  - idx: 308, ptr: 10f98460, name: upnpResponse
  - idx: 309, ptr: 10f98470, name: usageContextSetting
  - idx: 310, ptr: 10f976a4, name: versionChanged
  - idx: 311, ptr: 10f98484, name: videoContent
  - idx: 312, ptr: 10f9663c, name: upnpEvent
  - idx: 313, ptr: 10f98494, name: virtualLineInSource
  - idx: 314, ptr: 10f984a8, name: voiceAccount
  - idx: 315, ptr: 10f984b8, name: voiceAccountsList
  - idx: 316, ptr: 10f976a4, name: versionChanged
  - idx: 317, ptr: 10f984cc, name: voiceAccountProfile
  - idx: 318, ptr: 10f984e0, name: voiceWakeWord
  - idx: 319, ptr: 10f9783c, name: waterState
  - idx: 320, ptr: 10f984f0, name: weatherConfig
  - idx: 321, ptr: 10f98500, name: wifiDisable
  - idx: 322, ptr: 10f97868, name: wiredSubStatus
  - idx: 323, ptr: 10f9850c, name: zoneDefinition
  - idx: 324, ptr: 10f9851c, name: zoneDefinitionList
  - idx: 325, ptr: 10f9663c, name: upnpEvent
  - idx: 326, ptr: 10f98530, name: zoneMember
  - idx: 327, ptr: 10f9853c, name: zoneMemberSettings
  - idx: 328, ptr: 10f98550, name: zoneMemberSettingsMap
  - idx: 329, ptr: 10f98568, name: zoneMemberState
  - idx: 330, ptr: 10ea6a2c, name: 
::: details Evidence (1)

- @ 0x10f97088; 331-pointer table; all targets resolved

:::


:::

## `spec_pair_stream`

**coverage** `confirmed`

How every modern-API command's field list is stored: each operation's spec lives in a packed table of small numbers pointing into the master vocabulary table, recovered as a complete field-name dictionary. It's the compressed form of the API's argument lists.

::: details Technical details

Spec lists = packed pools of u32 indices into spec_object_table. INDEX SPACE RESOLVED via the idx->name lookup f_109ecb5c (cmplwi 0x146=326; slwi*4; lwzux base 0x10f97094) and name->idx f_109ecb90 (strcmp walk from 'none'): runtime index i resolves to table\[3+i\] - the 3 leading table slots are fnptrs, semantic idx0='none'. GRAMMAR RESOLVED ({fieldName,typeName} pairs): blob = (field,type)* - a flat sequence of pairs; even positions carry WIRE FIELD names (globalError 561x, ok 175x, upnpResponse 60x, upnpError 60x, groupCoordinatorChanged 53x, playbackError 44x, accountError, sessionError, playerSetError, transitionToShipModeStatus), odd positions carry the field's TYPE (upnpEvent 422x = the universal value/event wrapper, wiredSubStatus 202x, channelMapPair 92x, chirpRequest 79x, bluetoothDevice, deviceInfo, bluetooth, artist...). A repeated field name = the field's type is a UNION of the following types (e.g. globalError:{chirpRequest|accessoryId|none|wiredSubStatus} = five error-variant payloads). idx0 'none' = absent type / optional slot. Message roots: 'ok' leads 170 specs (status/ack field first), 'upnpResponse' 60x (UPnP-bridge envelope), plus object-typed roots (timer, zoneDefinition, alarm, area, groupInfo...). Outbound emitters call idx2name with constant type-ids (addi r3,0x31/0x2f/0x67...) then serialize - index space is an enum baked at build time. NOTE: earlier records decoded blobs against table\[i\] (off by 3); all route member lists + this grammar re-derived under table\[3+i\].

- **name:** muse spec-pair descriptor stream
- **grammar:**
  - **layout:** (fieldNameIdx, typeNameIdx)*: flat pair sequence, no header
  - **fields:** even positions = JSON/wire field names (ok, globalError, upnpResponse, upnpError, accountError, sessionError, playbackError, groupCoordinatorChanged...)
  - **types:** odd positions = type names; upnpEvent = universal value/event wrapper, others are concrete object types
  - **union:** repeated field name = type union of the listed types (error-variant payloads)
  - **none:** idx0 = absent/optional slot
  - **index_space:** semantic idx i -> table\[3+i\]; lookups f_109ecb5c (idx2name) / f_109ecb90 (name2idx); bound 326
::: details Evidence (1)

- @ 0x10fa51b3; tag-word blob; format proven, tag semantics partial

:::


:::

## `spotify_esdk`

**coverage** `strong`

The embedded Spotify SDK, Sonos's bundled copy of Spotify's official client library: the same component third-party hardware licensees get, running inside this program. It carries the play/pause/seek/volume API surface, its module kernel, event set, and the session machinery that actually speaks the Spotify protocol.

::: details Technical details

cmds RSpotifyPlayback{Play,Pause,Seek,SeekRelative,SkipToNext,SkipToPrev,BecomeActiveDevice,SetDeviceInactive}; NTS callbacks {ConnectionMessage,ConnectionNewCreds,StreamStart(id,fmt,drm,size,gain),PlaybackNotify,StreamFlush,StreamGetPosition(id),Error}; mDNS {"Registering Spotify Connect mDNS service \[%s\]","Unregistering","Updating ... event %d","new cert updating mDNS"}; seamless delegation {"Seeking to %ims in support of seamless delegation","Timed out waiting for AudioStart from eSDK during seamless delegation","%s failed to become active","set seek time to %u ms, byte offset: %zu"}; VLI transition matrix {"VLI source switch logout - async","Normal logout - blocking","VLI deselected, last id: %u, pos: %u, bLogout: %d","Detected VLI source switch","Connect mode toggled during transition - allowing login to proceed","Account matches ... skipping login","Already logged in with same user","username may have changed","mismatch ... regular logout","mismatch ... async logout","Already logged out"}; dual tracking "pos: %u (VLI: %d \[%d\], SMAPI: %d \[%d\])"; track FSM {AwaitingCurrentTrackAck,AwaitingNextTrackAck,CurrentTrackPlayed}; metadata {bitrate,track_uri,original_track_uri,playback id,audio_quality,hifi_status} New/Next Track Metadata; URIs spotify:track:/spotify:episode: "Bogus track URI"; media delivery {"unsupported DRM format: %d","stream start (id:%u, type:%s, size:%u)","stream data ... size: %u, offset: %u","stream end","stream flush ... pos: %u","getPosition (id=%u): result %u",performFlush}; events {GroupVolumeChangedEvent,SpotifyDelegationNotification,SpotifyMDNSRequest}; "Sent group volume change %u to eSDK (mute %d)"; TPM legacy "Spotify setPositionInfo ... uri=%s, playbackId=%s, position=%.3f, isFinalReport=%d"; init {SpInit supported media formats: %llu,devid,remoteName,deviceType,libraryVer,resolverVer,productId}; R_ServiceBitrate; playback-session layer: spotifyPlaybackSession/spotActionMutex/spotifyPlaybackSkipToTrack/spotifyConnectTransferLoggedIn; service-descriptor key triple 'Could not find service descriptor, sid=%d g=%d sn=%u' (service-id/group/serial-number); 'Could not load service descriptors'; account-info freshness 'Now time %ld.%06ld. Account info last update time %ld.%06ld' + '%s parsed into empty last updated time'; session lifecycle: 'session initialized for %s','Playback session for %s already exists','Playback sessions still exist; why?','force reset %s','%s client starting %s with result %d','bad deref %s (parse)'/'bad deref %s (size)'; seek paths 'Seek fast path: %u ms (matched %s)' vs 'Seek slow path' via SpPlayUri; queue-recovery branches {'Play & Queue Tracks (new playback session)','(recover from error)','No next or pending tracks. Queueing %s','(%s) Unknown... clearing queue and playing','Current and next tracks already queued','Same request and current track had previous error. Returning \'%s\' and resetting','(%s) Moving further failed queue pending track errors (due to eSDK being busy) to higher priority','(%s) Queued pending track after %u failures','Queueing track: %s','Add tracks: %s, %s'}

- **name:** eSDK playback session
- **session_detail:** eSDK event enum {TrackChanged,ShuffleOn,ShuffleOff,RepeatOn,RepeatOff,BecameActive,BecameInactive,AudioDeliveryDone,ContextChanged,MetadataChanged,NetworkRequired,TrackDownloadStalled,QueuedTrackAccepted}; callbacks {setPositionInfo,notifyDownloadComplete,setTrackStreamId,setTrackSize,notifyTrackChanged,notifyMetadataChanged,addTracks}; NTS extra {ConnectionNotify,PlaybackApplyVolume,StreamEnd(id),StreamSeekToPosition(id,pos)}; HAL {spot_hal,Dns HAL Exit(status,err)}; token {"Treating auth token as expired","Login failed with E_SONOS_BAD_ACCOUNT","attempting refresh","Refresh token failed with upnp result: %hu","Now time %ld.%06ld. Account info last update time %ld.%06ld"}; pullContext(playing,seek .%06d,byte offset,bitrate,observable); SWPBL-259788 guard "Delegated VLI session is not playing; skipping pullContext()/become active device ... avoid re-initiating Direct Control"; SMAPI↔VLI {"SMAPI to VLI transition detected. Forcing loginZC","VLI selection with stored account but already in connect mode - likely resuming VLI (e.g., after AirPlay)","Already logged in with same account, skipping loginZC"}
- **queue_fsm:** spotifyTrackQueue (spot_q): tracks {current,next,previous} matched by streamId; ack states {Current Acked,Queued Acked}; transitions {"Track change: (%s\|\|%s) -> (%s\|\|%s)","Unknown track change ... != upcoming","ERROR current/next track mismatch","!!!! \[BUG\] RESOLVING acked NEXT track mismatch"}; ops {Play track at %u ms,Next track,Queueing track,Add tracks}; pending FSM {Current Track Pending,Current Track Still Pending,Play & Queue Tracks,Now Pending,Still Pending,Waiting In-Flight Queueing,Max retries (%u) exceeded. Resetting,Queued pending track after %u failures}; seek paths {"Resume from pause fast path, offset: %zu","Seek fast path: %u ms","Forcing seek slow path","using SpPlayUri ... type/uri","adjusting initial Play position","Play from beginning"}; safeguards {"Suppressing phantom playback-start after end-of-queue","Playback finished at position=%lld ms","Resetting position ... download has not completed","position info request for previous track → cached"}; dump " \[%s\]: id: %u, %s\|\|%s, pos: %lld / %lldms, delivered: %d, rendered: %d"
- **vli_control:** RSpotifyVLIControl: metadata {track,artist,album,playback_source_uri,bitrate}+Next Metadata; cookie-validated sessions "Ignoring stale stopSession due to cookie mismatch: %d != %d"; callbacks {onVirtualLineInSuspendSession,onVirtualLineInStartAudio,onVirtualLineInStopAudio,onVirtualLineInPlayModesChanged} cookie %d; delegation guards {"Ignoring pause while setting state / delegating. isPlaying set to %d","Ignoring became inactive","Ignoring volume change (%u)"}; actors {spotifyVliControl,spotify_vli,spotify_md,scopeSpotyVli}; R_SPOT_EVT_METADATA_CHANGE + SpotifyInternalEvent unhandled type
::: details Evidence (1)

- @ 0x10ea23a0; spotify esdk block

:::


:::

## `spotify_zeroconf`

**coverage** `strong`

Spotify's local discovery layer: the Connect advertisement, device-added events, credential transfer, and the local web server the Connect handoff uses. This is how the Spotify app discovers and pairs to the speaker on your network.

::: details Technical details

URIs x-spotify:// + x-spotify-file://; Content-Type application/json; charset=utf-8; ver 2.9.0; client types {Partner,Spotify}; results {SpotZc_Failure,SpotZc_Success}; GC gate "Non-GC returning 404 from getInfo" + "reject zc req %s"; getInfo schema {deviceID,publicKey,deviceType,libraryVersion,resolverVersion,groupStatus,authorization_code,tokenType,clientID,productID,scope,availability,supported_drm_media_formats,supported_capabilities,modelDisplayName,brandDisplayName,remoteName,deviceName,statusString,spotifyError,responseCode}; errors {ERROR-INVALID-ARGUMENTS,ERROR-LOGIN-FAILED,ERROR-SPOTIFY-ERROR,ERROR-UNKNOWN}; addUser/resetUsers/resetUser/userName; "addUser with userName %s; player uuid %s" fmt %s@%s; client GUID 8ec274d4-0719-48d5-a0c0-ea9821a9a4ac + embedded key 9b377073ea334637b1406f329ce005de; DC enum {SONOS_DC_UNKNOWN,OK,NO_ACCOUNT,STALE_ACCOUNT,LOGIN_FAILED,UNSUPPORTED_SERVICE,UNEXPECTED}; account fields {isGuest,accountTier,loginMS,failedLoginMS,refreshAuthMS}; ops {spotifyTransferZeroConf,Using SID %d}

- **name:** Spotify ZeroConf endpoint /spotifyzc
- **mdns:** service _spotify-connect._tcp + CPath sonos; "deregister skipped for empty SID."; "register skipped for non-empty SID: %s"
::: details Evidence (1)

- @ 0x10ea14c4; spotify.cxx zc block

:::


:::

## `store_commit_faults`

**coverage** `strong`

The save-to-disk layer for every replicated store (favorites, saved queues, alarms, timezones, accounts): it writes a temp file, flushes it, then renames it into place. That's the crash-safe write pattern that keeps your settings from corrupting on power loss.

::: details Technical details

Every replicated XML store has an atomic-save function (open64 '.tmp' -> fwrite -> fflush -> fsync -> fclose -> rename -> unlink-on-fail) that emits a vendor-specific 800-series fault ladder surfaced verbatim through the directory-object vfunc chain into SOAP faults. Per-store ladders recovered: userradio/favorites f_10384490 {402,501,701,702,803,805,806,807} (805=count>=70 favorites cap, 806=serialized XML >128KiB via ftell, 807=late-phase guard, 803=early-phase, 702=flag byte); savedqueues f_1047ee0c {501,701,802-808,810-812} + f_1047db08 add-path {805,814} + f_10477fe8 reorder engine {600,812,813,850,899} + f_10476cb4 reorder guard {899}; alarmclock f_10283998 {501,800,801,802}; timezones f_1015aaf8 {801,802,803}; accounts accountsmgr {802,803,806,809,810}; groupmgmt AddMember f_10394d10 {402,800-804,806-808}; settings sp_impl f_1066a788 {402,501,800,811,812}; zone-attrs dp_zpimpl f_103619c8 {821,822,824}; f_100c960f {801,802,803,804} call-derived (fn carries no error literals itself - codes arrive via callee; identity unresolved). Census method: whole-.text scan of li-into-accumulator (r9/r10/r28-r31 or r3-before-blr) with transitive call-graph propagation; indirect vfunc edges (mtctr/bctrl) invisible - true reachable set is a superset. Complete .tmp-atomic-save writer census (16 fns): f_10384490 userradio.xml, f_1047ee0c+f_10478f28 (plain + 'application/gzip' variant) savedqueues.xml, f_10283998 alarmclock.xml, f_1015aaf8 timezones.xml, f_101121d0 shares.xml ('.bak'+'.version' sidecars, sharelist), f_1011ad40 svcmanifestfile.cxx, f_10173460 zonesstorage ('saving to file failed'), f_10296e40 areas.json ('Saving areas failed'), f_105a7dac eTag-based file fetcher ("%s: failed to fetch file (%d %d). Elapsed=%ums, current eTag='%s'"), f_105bf7cc featureconfig ('Error parsing feature config'), f_10627b14 netsettings ('Upgraded %s to file schema %d'), f_100c8900 musicservices catalog (returns {200,500}), f_100c8fdc catalog download (/catalog/services, application/sonos_service_catalog.v1.xml, {801,1025}), f_10109988 trackinfo.tmp shadow writer, f_10694308 dp_impl MetricsConfig download (.tmp staging). Writers without error-band accumulator literals return callee rc or store via stw - their fault contribution is the generic 500/501 domain.

- **name:** store-commit fault layer (800-series vendor codes)
::: details Evidence (8)

- @ 0x10384490; userradio.xml commit fn - verified ladder
- @ 0x1047ee0c; savedqueues.xml commit fn
- @ 0x10283998; alarmclock.xml commit fn
- @ 0x1015aaf8; timezones.xml commit fn
- @ 0x10394d10; AddMember impl ladder
- @ 0x1066a788; sp_impl ladder
- @ 0x103619c8; dp_zpimpl 821-824
- @ 0x10ec0af8; dirObjFavorites vtable into mutation fns

:::


:::

## `svc_manifest`

**coverage** `strong`

The service-manifest store: files describing custom music services with version negotiation and cross-player replication. Manifests are how custom service capabilities like strings and presentation maps propagate to every player.

::: details Technical details

svcmanifests.json text/json; versioning {"Invalid schema version format","Unsupported schema version: actual: %u.%u, supported: %u.%u","Could not extract API header"}; ops {deleteManifest(%u) b=%d,a=%d,removeManifest(%d):%s vb=%d,va=%d}; replication {"replicating manifest file from %s","%s downloading music service manifest from %s; ret=%u, lRet=0x%x",lastUpdateDevice}; json {", \"manifests\": \[","JSON parse error %d: %s","Failed to load manifests JSON file","Added trailing slash to: %s","Invalid Id: %s","Failure parsing URI %s","unsupported CQ REST version: %s"}; RCache; "%d hasLastestVersion %d? %d"; updatemgr manifest parser: 'manifest: searching for %d.%d', 'manifest: matched to %d.\[%d,%d\] \[%s,%s\] \[%s, app_baseline %s\]', 'manifest: Setting revision=%s'/'Setting system version=%s'/'System flags=0x%x'/'Setting descr=%s', '|manifest parse error (Error parsing: %d, Tag depth: %d, Signature seen: %d)', download states 'manifest download complete'/'manifest download error'; UpdateItem xmlns urn:schemas-rinconnetworks-com:update-1-0

- **name:** SMAPI service manifest file
::: details Evidence (1)

- @ 0x10e8a740; svcManifestFile

:::


:::

## `topology_base`

**coverage** `strong`

The topology manager: it tracks every discovered player with its address and attributes, emits topology events for changes like update availability and group membership, and handles players vanishing or being quarantined. It's the core machinery of the household map that the topology service builds on.

::: details Technical details

ops {RTopologyImpl,new_or_updated_zp,upgrade_report,informReplicatedSettingsChange,informLocalSecureRegStateChange,informLocalIdleStateChange,updateLocalMoreInfo,getZPUUIDs,isLocalZPIdle}; events {AvailableSoftwareUpdate,MuseHouseholdId,ZoneGroupName,ZoneGroupID,ZonePlayerUUIDsInGroup}; zp attrs {lastIp,moreInfo,spOrientation,htOrientation,newVanishedDevice}; ARP liveness {"received a valid arping from %s","arping successful for active device","arping ip address matched but not mac","arping successful for vanished device","arping unsuccessful"}; quarantine {"Discovery for player %s resulted in quarantine (%s); last network error: 0x%x",quarantinedCount,latestPlayerWithQuarantineEvent,stabilizationTime,latestDownloadErrorCode,latestDownloadErrorReason,quarantining}; missed-player "Report player missed by %s: %s" {missedBy,missedPlayer}; WoW {"\[%s\] %s WoW magic packet for MAC %02X*6","Attempted to wake %zu missing secondary ZP of primary %s (sent WoW to %zu)","Malformed UUID %s"}; "Faking device %s (%s) props to be %s gc"; "All devices idle for %ld s"; "lookup of control URI for %s failed: secure %d, service %s" + https://%s:%hu; NetsettingsUpdateID

- **name:** topology manager internals
::: details Evidence (1)

- @ 0x10f12054; topology_base block

:::


:::

## `tp_enums`

**coverage** `strong`

The Trueplay vocabulary tables: the action and status codes, speaker masks, channel types, orientations, and product array codenames that every tuning message uses. It's the named-constant set the calibration machinery speaks.

::: details Technical details

SPEAKER_MASK {UNSPECIFIED,THREE_DOT_ONE,FIVE_DOT_ONE,FIVE_DOT_ONE_DOT_TWO,SEVEN_DOT_ONE,NINE_DOT_ONE_DOT_FOUR}; CHANNEL_DIRECTION {UNSPECIFIED,DIRECT,INDIRECT_ARRAY,INDIRECT_SINGLE_DRIVER}; CHANNEL_TYPE {UNSPECIFIED,L,R,C,SUB,LS,RS,LRS,RRS,LTM,RTM,LW,RW,MONO,LTR,RTR,INPUT,OUTPUT,SCRATCH}; VOLTAGE_GAIN_CALCULATOR {UNSPECIFIED,BULK_CAPACITORS,BOOSTED_BATTERY,BUCKED_CAPACITOR}; ARRAY_SUB_SYSTEM {UNSPECIFIED,BRAVO,FURY,OPTIMO2,OPTIMO2_SURROUND,LASSO,APOLLO}; TONE_HANDLER {UNSPECIFIED,STANDARD,SUB}; TUNING_MODE {UNSPECIFIED,INDIVIDUAL_CHANNELS,ALL_CHANNELS_AS_MONO}; SUB_POLARITY {UNSPECIFIED,POSITIVE,NEGATIVE}; MEASUREMENT_MODE {UNSPECIFIED,SPATIAL,SPECTRAL}; DEVICE_ORIENTATION {UNSPECIFIED,HORIZONTAL,VERTICAL,WALL_ABOVE,WALL_BELOW,INVERTED,FACEDOWN,HORIZONTAL_LEFT,HORIZONTAL_RIGHT}; protobuf enum names {TUNING_MODE_ALL_CHANNELS_AS_MONO,MEASUREMENT_MODE_{UNSPECIFIED,SPATIAL,SPECTRAL},DEVICE_ORIENTATION_{UNSPECIFIED,HORIZONTAL,VERTICAL,WALL_ABOVE,WALL_BELOW,INVERTED,FACEDOWN,HORIZONTAL_LEFT,HORIZONTAL_RIGHT}}

- **name:** Trueplay SDK enum registry
::: details Evidence (1)

- @ 0x10fbed60; tp enums

:::


:::

## `track_pipeline`

**coverage** `strong`

The embedded Spotify component's track pipeline: track insertion, delivery accounting, position sync, underrun handling, redelivery on resume, and key loading. Each Connect track flows through these stages from source to speaker.

::: details Technical details

{"Position report (track: %u reason: %s) integration reported invalid position value %u last: %u delta: %i","Not setting track info because of empty file id in case of internal file","Continuing track, last position: %u","Adding new track to the pipeline:","Flushed integration (%s). Got track %u playback position: %lu","Reset dirty_aubuffer because of '%s'","Integration reported invalid track playing","track_id %u, provided_to_integration %d, is_seeking %d","track_id=%d position from integration %u","Track %u last position: %u -> %u","Delivery latency was %u ms. Integration latency was %u ms","Sending EsdkPlaybackStats log failed","Synchronized current playback position %u ms with integration","Starting playback position sync timer for %u ms","Track fully delivered","Initializing track delivery","***TSB*** Loading new decryption key","***TSB*** Loading new decryption IV","Choosing DRM: %d media format: %d","Video Manifest(%d): %s","Asking integration to seek to the initial starting position %u","Underrun in download buffer! (0 / %d)","redeliver media at resume","Finishing playing track and advancing pipeline","Set track %u download offset %u","set_dl_pos outside seek",periodic,"!"No track to call cb_stream_on_start"","!"stopping unavailable timer in start_underrun_gp/stop_playback_pos_sync_timer""}

- **name:** eSDK track pipeline
::: details Evidence (1)

- @ 0x10fd8ca0; track pipeline

:::


:::

## `trueplay_service`

**coverage** `strong`

The Trueplay room-tuning interface: eight methods covering setup, spatial and satellite tuning, clearing, and reading back tunings, plus its status codes. On this Playbar build the whole interface is present but inert: the service object and its method table are fully constructed, yet every method is a placeholder, because Playbar has no microphone and literally cannot tune itself even though the service shell exists.

::: details Technical details

service sonos.coreaudio.trueplay.v1.TrueplayService; API v1alpha2; errors {Invalid API Version,Invalid Service Address}; status enum {MESSAGE_STATUS_UNSPECIFIED,MESSAGE_STATUS_SUCCESS,MESSAGE_STATUS_FAILURE}; methods {SetupDevice,ApplySpatialTuning,ApplySpectralTuning,ApplySatelliteTuning,ClearAllTunings,GetSpatialTuning,GetSpectralTuning,GetDeviceConfig} (req+resp names listed)

- **name:** TrueplayService gRPC API
- **rpc_dispatch_table:** vtable @0x1102a134 (10 slots, .rodata tail): slot0 f_10e691ac (embedded-object vptr installer -> f_10e684e4), slot1 f_10e691c8 (real: installs vptr, calls f_10e684e4 on this+4, tail f_108094fc), slots 2-9 = ALL EIGHT v1alpha2 methods GetDeviceConfig,SetupDevice,ApplySpatialTuning,ApplySpectralTuning,ApplySatelliteTuning,ClearAllTunings,GetSpatialTuning,GetSpectralTuning - each an identical 9-instr printf stub 'Unimplemented Method %s\n' carrying only its own name string @0x1102a15c-0x1102a1ec. CONFIRMED: on build 86.10-80260 (model 9 / Playbar, no mic) every TrueplayService verb is compile-time stubbed; the service object/vtable exists but no tuning method has a real body. Companion class vtable @0x10febc94: {f_10d94d5c,f_10d94e70,f_10d94f84,f_10d94b80,f_10e6915c,f_10e69184} = 4 real methods (eSDK/audio region 0x10d94xxx) + the same GetSpatialTuning/GetSpectralTuning stubs as tail slots; class-name string 'trueplay_message_handler' @0x10febca0. Message schemas live as nanopb msgdesc records @0x11029a24/0x11029a74 (3-field), 0x11029c38/0x11029c98/0x11029cf4/0x11029d50 (4/4/2/2-field), reached via the .sdata descriptor registry @0x11095ebc/0x11095ecc/0x11095efc/0x11095f04; AudioCoreRpcBuffer class name @0x110299a8; dispatcher f_10e69f48.
- **desc_consumers:** descriptor->code binding map (lis/addi refs): f_10e69f48 (the RPC buffer builder) binds 5 descs {0x11029e18(1f),0x11029dd8(4f),0x11029d9c(5f),0x11029d50(2f),0x11029cf4(2f)}; f_10e685b0 binds pair {0x11029a24(3f),0x11029a74(4f)}; f_10e69220/f_10e692c8/f_10e69350 each bind {0x11029e18+0x11029dd8} (status+payload pattern); f_10e693c4/f_10e6946c bind 0x11029d9c; f_10e69568/f_10e69610 bind 0x11029d50; f_10e6970c/f_10e697b4 bind 0x11029cf4; f_10e70014/f_10e7013c bind {0x11029a74,0x11029a24}. DSP-layer consumers f_10dd83f0/f_10dd86f0/f_10dd8ac0/f_10dd8c38 (chproc region 0x10dd8xxx) bind the 4-field pair {0x11029c38,0x11029c98} - the tuning-parameter protos reaching the audio pipeline. CROSS-DOMAIN: trueplay descs embed muse-cluster messages - 0x11029cf4 aux->0x10fbef88, 0x11029d50 aux->0x10fbefc0, 0x11029d9c/0x11029dd8 aux->0x10fbefe8/0x1102a2a0 - the RPC protos compose shared wrapper/enum messages rather than defining their own.
::: details Evidence (1)

- @ 0x110299ec; trueplay gRPC

:::


:::

## `trueplay_tuning`

**coverage** `strong`

Trueplay room tuning is really two surfaces. The documented commands flip tuning on and off, while the real work happens over five cloud-routed modern-API operations on each speaker plus coordination calls, covering measuring, computing, and applying the correction. This entry maps which piece of the tuning pipeline lives where.

::: details Technical details

Trueplay room tuning stack: muse routes for discovery/presence/config/status (+setSelfTruePlay, resetDetectedSpeaker), x-rincon-sonarcal: OGG test-tone URIs played through the streamer (leader/testtone/complete_ht), versioned Trueplay SDK with compat fallback, etag-synced spectral/spatial tuning assets, per-driver RoomCalDelay params, satellite propagation via SetRoomCalibrationStatus, SelfTrueplay variant

- binary anchors: `trueplay-node`, `/trueplayinfo`, `SelfTrueplayEQ`, `x-rincon-sonarcal:testtone.ogg`, `trueplay_spectral_tuning.bin`, `RoomCalDelayMidLeft`, `v1/players/{playerId}/trueplay/status`, `trueroom`, `x-rincon-trueroom:`, `trueroomAdaptationStatusEvent`, `enableTrueRoom`

- **muse_routes:** v1/players/{playerId}/trueplay/{discovery,presenceDiscovery,presenceRate,config/{id},status} + household variants; ops detectSpeakers, detectSpeakerPresence, setSpeakerPresenceRate, get/setConfiguration, getTrueplayStatus, setSelfTruePlay, resetDetectedSpeaker
- **calibration:** x-rincon-sonarcal:leader.ogg\|testtone.ogg\|complete_ht.ogg test tones; <RoomCalibration*> XML family (Info, ActiveState, UserIntent, AvailCalID, Orientation, BondedZoneInfo, State, Enabled, Available); SELF_TRUEPLAY self-tuning + <SelfTrueplayEQ>/<SelfTrueplayInfo>; calibration ID embeds version ('Trueplay Version %d.%d.%d.%d' parsed from ID)
- **sdk:** TrueplayAPIFactory + trueplay_api.cpp; #TRUEPLAY_SDK_VERSIONS# compat list; 'Trueplay SDK version %s not supported, creating previous version'; assets trueplay_spectral_tuning.bin + trueplay_spatial_tuning.bin etag-synced ('Could not load Trueplay etags, %sresetting'); sonos.coreaudio.trueplay.v1.TrueplayService registration
- **propagation:** coordinator pushes calibration to bonded satellites: 'Failed to SetRoomCalibrationStatus on SUB/SURROUND'; RoomCalibrationBondedZoneInfo; per-driver delays RoomCalDelay{MidLeft,MidRight,MidCenter,TwtrLeft,TwtrRight,TwtrCenter,Bass} + _RoomCalGains/_RoomCalPanGain; satellite-apply RPC layer: 'Apply Satellite tuning failed: failed to send request'/'Apply Satellite tuning failed: received failure status', 'Clear Trueplay Calibrations: failed to send request'; per-channel apply errors 'failed to set coeffs for channel type %zu', 'failed to set gain for channel type %zu', 'satellite: failed to set gain for channel type %zu', 'satellite: failed to set delay for channel type %zu'; 'failed to parse legacy tuning'
- **unresolved:** measurement mic flow (the actual chirp capture), tuning FSM states, RoomCal* units
- **trueroom:** a second tuning system 'trueroom' coexists: muse routes trueroom/{estimatorConfiguration,adaptation,calibrationStatus,successTone,swapInputMute}; x-rincon-trueroom: URIs, x-rincon-configmode:trueroom-tone queue items, trueroom_tone.ogg + a trueroom-tones JFFS folder cleared after tuning; events trueroomStatusEvent/trueroomAdaptationStatusEvent with trueroomEstimatedParams: an adaptive estimator-based tuner, feature-gated by enableTrueRoom
- **node_protocol:**
  - **wire:** protobuf node messages (node_messages.cpp): encodeNodeRequest/decodeNodeRequest/encodeNodeResponse/decodeNodeResponse + pb<->TP converters for action/status/channel-type; "Node message is: %s"/"Node response is: %s"; decode failures logged
  - **actions:** `TP_NODE_ACTION_NONE`, `TP_NODE_ACTION_SETUP`, `TP_NODE_ACTION_START_MEASUREMENT`, `TP_NODE_ACTION_SEND_BACK_DATA`, `TP_NODE_ACTION_COLLECT_DATA`, `TP_NODE_ACTION_SEND_STATUS`
  - **statuses:** `TP_NODE_STATUS_IDLE`, `TP_NODE_STATUS_SETUP`, `TP_NODE_STATUS_MEASURING`, `TP_NODE_STATUS_MEASUREMENT_DONE`, `TP_NODE_STATUS_DATA_COMPUTED`, `TP_NODE_STATUS_ERROR`, `TP_NODE_STATUS_EXCEPTION`
  - **api:** TrueplayAPIFactory + initNode/initNodeMajorVersion; SDK version negotiation "Trueplay SDK version %s not supported, creating previous version" / "Requested version %s already in use -> no-op"; SDK build 6.2.0.1-main.Unspecified.2db5546c; node data schema version reported
  - **setup_constraints:** nMics & nDSPChannels must be both zero or both nonzero; minimal-node builds cannot instantiate microphones; "Node microphone data is %s"; "Trueplay data handler reports that data collection %s allowed"
  - **ops:** `setup`, `setupMeasurement`, `startMeasurement`, `computeData`, `handleMsg`
  - **channel_types:** pbChannelType<->TPChannelType converter; "Unhandled trueplay channel type with value: %d"
  - **confidence:** PROVEN enums+protobuf framing; per-message field schema unresolved
- **tone_download:**
  - **muse_path:** players/%s/trueplay/config/%s + trueplayConfig; MUSE POST response base64 -> tone asset
  - **assets:** x-rincon-sonarcal:{leader,testtone,complete_ht}.ogg + trueroom_tone.ogg staged under trueroom-tones dir; sonarcal served from https://sonar.ws.sonos.com
  - **etag:** etags.txt per-file eTag cache ("Parsed eTag: key ... value ... matching a known file"); "Downloading %s to %s. Etag is %s"; force-load flag; dir create/delete guards
- **trueroom_ops:**
  - **routes:**
    - **estimatorConfiguration:** v1/players/{playerId}/trueroom/estimatorConfiguration (+household-qualified)
    - **adaptation:** v1/players/{playerId}/trueroom/adaptation (+household-qualified)
    - **getCalibrationStatus:** v1/players/{playerId}/trueroom/calibrationStatus (+household-qualified)
    - **playSuccessTone:** v1/players/{playerId}/trueroom/successTone (+household-qualified)
    - **setSwapInputMute:** v1/players/{playerId}/trueroom/swapInputMute (+household-qualified)
  - **spec_types:** `trueroomStatus`, `trueroomAdaptationStatus`, `trueroomEstimatorConfig`, `trueroomEstimatedParams`, `trueroomCalibrationStatus`, `trueroomStatusEvent`, `trueroomAdaptationStatusEvent`, `enableTrueRoom`
  - **descriptor_members:**
    - **trueroomStatus:** {authzTokenStatus, featureConfigZoneExperiment, deeplink, bluetooth}: cls3 response/event; deeplink = resume-playback link after the tone
    - **trueroomAdaptationStatus:** {authzTokenStatus, featureConfigZoneExperiment, bluetoothPolicySettings, bluetooth}: cls3
  - **tone_mechanism:** x-rincon-trueroom: URI scheme + x-rincon-configmode:trueroom-tone; tone asset trueroom_tone.ogg fetched to a JFFS 'trueroom-tones' folder ('Clearing Trueroom tone folder on JFFS'); the AVT transport state is saved and restored around config mode ('Not restoring the AVT' vs 'restoring the AVT'); validation literal 'One or more Trueroom options amongst (%s, %s) are missing or invalid'
  - **op_schemas:**
    - **estimatorConfiguration (GET):** {ok:upnpEvent, globalError:channelMapPair}
    - **adaptation (POST):** {trueroomEstimatorConfig:upnpEvent, globalError:{channelMapPair\|wiredSubStatus}}
    - **getCalibrationStatus (GET):** {trueroomAdaptationStatus:upnpEvent, globalError:{channelMapPair\|wiredSubStatus\|chirpRequest}}
    - **playSuccessTone (POST):** {trueroomCalibrationStatus:upnpEvent, globalError:wiredSubStatus}
    - **setSwapInputMute (POST):** {ok:upnpEvent, globalError:wiredSubStatus}
  - **remaining:** inner field names of trueroomEstimatedParams (the estimated distance/delay/EQ values) are not emitted as standalone literals
- **estimated_params:** trueroomEstimatedParams RESOLVED: not a spec-table member -- it is a named sub-object key in the estimator-config container's member map. f_10b46dc0 calls f_108337b0(obj->memberMap+0x50, 'trueroomEstimatedParams') and stores the params object at obj+0x15c; a second accessor at 0x10b472d0 reads it back. Its inner fields are not stringized in the binary (the name table at 0x10f97088 has no entry for it), so the params payload is serialized positionally or through a C++ member walker -- static ceiling for inner field names. Note: name-table duplicates exist at semantic idx 291/292 (trueroomAdaptationStatus x2) and 294/296 (trueroomStatus x2) -- paired entries likely distinguish the request-side and event-side descriptors of the same wire name.
- **configmode_tones:** Config-mode tone URIs: x-rincon-configmode:sonar-calibrate-tone + x-rincon-configmode:sonar-calibrate-complete queued with action tags 'ATrueplay' and 'ATrueplay Complete'; trueroom equivalent 'x-rincon-configmode:trueroom-tone' + 'ATrueroom'. trueplay_muse_channel is the dedicated channel for 'players/%s/trueplay/config/%s' pushes (body key trueplayConfig). Zone-agreement checks: sonarHasCalibrationChangedTo / sonarZoneAgreesOnCalibration / setLocalSonarCalibrationID; 'Available Sonar Calibration ID changing: "%s" -> "%s"'.
- **calibration_file_parser:**
  - **status:** confirmed
  - **summary:** trueplay_calibration_parser module parses persistent calibration files (spectralcoeffs file). Keys: ActiveChannels, SupportedChannels, ChannelMappings, RoomCalibrationSpatial, RoomCalibrationSpectral, RoomCalibrationConfig, RoomCalibrationData, calibration_id. Channels carry gain + N biquads ('Adding channel %s with gain %f and %zu biquads'), delays named DelaySurrRight/DelayHeightLeft/DelayHeightRight (plus per-channel channelID/orientation).
  - **cal_id:** Calibration-ID machinery: 'Trueplay calibration ID valid: "%s"','Trueplay Version %s','Legacy Calibration','Calibration ID has expired','Unable to parse trueplay Version from Calibration ID'/'Failed to parse Trueplay Version from Calibration ID','Spatial/spectral calibration IDs match.','Spatial/spectral calibration ID mismatch. Spatial "%s", Spectral "%s"','Spectral tuning only detected.','satellite calibration ID %s does not match tuning %s','satellite spectral tuning missing','calibration ID length is longer than provided maxLen','calibration ID return vehicle is NULL'.
  - **orientation:** 'Invalid/Valid spatial tuning orientation','No Spatial Tuning to validate orientation','Invalid/Valid spectral tuning orientation','No Spectral Tuning to validate orientation','Ignoring orientation since device is an HT Sat','found valid calibration with Orientation = %d and Channel ID = %d','channelID = %d,  Orientation = %d looking for %d','channelID to int conversion failed','orientation to int conversion failed','Found matching UDN in calibration' (calibration is per-UDN bound).
  - **file_ops:** 'successfully loaded spatial calibration'/'spectral calibration','spatial calibration file parsing error'/'spectral calibration file parsing error','... file not found','failed to encode spectral calibration','failed to write spectral calibration to file','number of spectral calibration channels exceed max channels','failed to save satellite spatial calibration','successfully removed %s','failed to remove %s','file not found to remove %s','FILE NOT FOUND','unable to read file at %s','unable to open file at %s'; status fields 'Spatial Calibration Load Status %s','Spectral Calibration Load Status %s'.
  - **parse_detail:** 'Block ID exceeds max string len','Param Value found, but exceeds max length','ChannelID conversion to int failed','ChannelIndex not found in %s','GainName format not followed %s','spatial adding channel %s','gain spatial adding channel %s','adding gain %f, for %s','cannot apply negative delay for %s','delay conversion to int failed for %s','Unable to find channel type from name for %s in block %s','Param Name was not found','Not all required coeffs were present','invalid set and section values','section number conversion to int failed','set number conversion to int failed','set and section not found','Filter format not followed %s','Re-Indexing surround gain'; handler 'trueplay_channel_config_handler'.
- **channel_config:** trueplay_channel_config_handler: channel-map assembly 'adding channel type: %zu, dir %zu, samplerate %u', 'num channels Device: %zu, Satellite: %zu', per-channel 'device channel: %i %s'/'satellite channel: %i %s'; direction enum {Direct,Indirect Array,Indirect Single Driver}; 'Populated Channel %s with direction %s'; guards 'unsupported paired multi channel device map channel', 'device setup in mono mode', clamp 'tuning_channel-count > max-channel-count, trueplay will operate with max-channel-count %zu'. trueplay_device_calibration/trueplay_device_properties (tpdpMutex) bounds: 'addGain: channel limit reached','addBiquadCoeffs: channel limit reached','addDelay: channel limit reached','calibration ID was truncated','Device UDN is larger than Trueplay Device Properties can store'
- **apply_validation:** tuning-apply validation ladder (trueplay_tuning_handler + trueplay_manager): per-mode results '{Satellite ,}Spectral Tuning successfully applied','{Satellite ,}Spatial Tuning successfully applied','Spectral Tuning successfully applied'; per-mode failures '{Spatial\|Spectral\|Satellite Spatial\|Satellite Spectral} Tuning: {device has %s\|request has %s\|request exceeds max channels\|Not enough channels in sonar subsystem for channels on system\|all device channels not tuned}'; sonar spatial guards 'Sonar Spatial does not contain enough channels to support post crossover {gain,delay}'; per-channel 'failed/successfully set coeffs for channel type %zu', 'failed/successfully set gain for channel type %zu', 'satellite: failed/successfully set gain for channel type %s to %f', 'satellite: failed/successfully set delay for channel type %zu', 'setCoeffs: request exceeds max biquad sections'; trueplay_utils calibration-id parse 'error while parsing trueplay version from calibration ID %s' + 'Trueplay Version %d.%d.%d.%d' + fmt '%d.%d.%d.%d_%4d-%2d-%2d_%2d-%2d-%2d' + 'Calibration ID is not valid %s with length %zu'; trueplay_manager legacy path: 'sonarEQ.xml' legacy tuning file, {'found legacy tuning','found existing tunings, ignoring legacy tuning','did not find legacy tuning file','failed to parse legacy tuning','loading calibrations after legacy conversion','successfully loaded calibrations','no channels in spatial/spectral tuning','number of device channels exceed TRUEPLAY_MAX_DEVICE_CHMAP_SIZE','unknown channel type','happ/settings/'}; trueplay_calibration_manager write path: 'trueplay_spatial_tuning.bin','Adding channel %s with delay %u','failed to write to %s: wrote %zu bytes of %zu'
::: details Evidence (8)

- @ 0x10ebda88; trueplay-node
- @ 0x10e75f08; /trueplayinfo
- @ 0x10fee999; SelfTrueplayEQ
- @ 0x10e83240; trueplay/discovery + presenceDiscovery + config/{id} routes
- @ 0x10e93e2c; x-rincon-sonarcal:{leader,testtone,complete_ht}.ogg
- @ 0x10fbd990; TrueplayAPIFactory / trueplay_api.cpp SDK
- @ 0x10fea0b4; RoomCalDelay* per-driver delay params
- @ 0x10e83590; trueroom route family + estimator/adaptation events

:::


:::

## `tv_processor`

**coverage** `strong`

The TV audio processor: input-session tracking, usage-report fields, the processor state machine, and the HDMI control-channel interplay. It's distinct from the audio path itself, since this is the control and session side of TV integration.

::: details Technical details

state enum {READING,PARSING,DECODING,DECODER_DSP,NOISE_SILENCE_DETECTION,WRITING,WAITING,INPUT_ERROR,RECORDING,MONITOR_IDLING,MONITORING} + tv_block_descriptor; <TVProc>{Input,Signal(active/inactive),Mode,HTSwap,SampleRate,FrameRate,DataBurst(%d: %s),NSDResult,StreamInfo,StreamChannels(%d.%d.%d),InputChannelCount}</TVProc>; <ChannelStatusBlock>{SampleRate,SampleWidth,Mode,Flags(\[Consumer\],\[Professional\],\[PCM\],\[Muted\]),Type,MultiChannel{Layout,Allocation},Raw}</ChannelStatusBlock>; <Decoder><ActiveDecoder>None/PCM/%s/DTS</ActiveDecoder></Decoder> + ESZNA DTS magic; MPCM layout; "Unknown Dolby Databurst Type; choosing UDC"; databurst errors {Unmapped decoder error,Unmapped decoder specific DSP error}; CSB lifecycle {"First CSB accumulated","First CSB not accumulated","CSB changed to: %s \[%s\]"}; PCM-vs-encoded parser {"Parser identified Encoded signal in disagreement with Source","Parser identified PCM signal in disagreement with Source","Bitstream validity re-established"}; format changes {"Sample rate changed from (%u: %u)","Input channel count change: %u -> %u","Read size in frames changed","Input Format change %s (%d.%d.%d) --> %s","frame buffer is not evenly divisible"}; streams {mixgm%d,mixgm,mixsat} + select.read; "Start sending stream, pt %d.%06d"; reset timings {ht swap,downmix,CSB,external,SPDIF,ASRC,NSD,decoder,input flush,Dialog Extractor} each "%llu us"; "Resetting (%s). Mode: %s"; "Fell behind by %ums while resetting. Input delay %ums - read size %ums. Flush."; "Delay capped at stream size"; "detectNoiseAndSilence: status=%s"; "Stream %s underflow"; "Hardware no longer providing invalid signal"/"Invalid signal provided by hardware"; "TV input sample rate mismatch with audio tap (tv:%u tap:%u)"; autoplay <AutoPlay><Mode>%s</Mode><SilentSeconds>%u</SilentSeconds></AutoPlay>; "tvprocessor states previous:%s current:%s"; per-stage reset telemetry ('{ht swap stream,downmix stream,CSB,SPDIF,ASRC,NSD,decoder,input flush,Dialog Extractor} reset time %llu us','external reset (%s)'); settings key tvp.inperr.timewait; 'Delay capped at stream size: %uus'; 'Monitoring mode failed to read - input overflow'; 'TV input read error during audio tap playback (%d:%s)'; 'unhandled state: %d:%s'; databurst decoder errors 'Unmapped decoder error for databurst (%d)','Unmapped decoder specific DSP error for databurst (%d)'; input guards 'Invalid sample rate (%u: %u)','Invalid input channel count (: %u)','Invalid read size %zu > %zu','Read size in frames changed from %zu to %zu','Error: asked to extract bitstream from 0 length frame buffer','Request Change %s --> %s'; stream names {tv_in_raw,tv_in_test,tv_spdif_16,tv_spdif_32,tv_stats}; swap states {LOCAL_PLAYING,SWAP_FADE_IN,SWAP_PLAYING}

- **name:** TV processor (SPDIF/TOSLink decode pipeline)
- **chaos_params:** fault injection {stream_underflow("Inducing stream underflow"/"Inducing %ums processing stall to trigger underflow"/"Invalid stall time. Valid range is 0-1000"),stream_error,signal_lost,rate_change,signal_discontinuity,decoder_error,sync_tap_playback,latency_change("Simulating latency change"),out_loud("HT swap out loud override %s"),set_timeout("Setting report timeout to %d secs"),perf2("Setting perf2 to %s")}; "Synchronize SPDIF tap playback with output tap (%s)"
::: details Evidence (1)

- @ 0x10f25c3c; tv processor block

:::


:::

## `vli_transport`

**coverage** `strong`

The VLI transport: the actual audio path a virtual line-in session uses once created, covering transport selection, buffering, and the seamless-handoff integration with the channel sink. It's how the pushed audio actually arrives and plays.

::: details Technical details

setTransportToVLIStreamURI {URI,autoplay,become gc} + 'VLI type \[%u\] incompatible' + 'activating source with URI: %s, VliGroupID: %s' + 'StartTransmission (VLI) failed' + 'going to stopped / defer playing'; events {AV Transport URI cleared/changed,VliTransportActionEvent,VliSessionProcessingCompleteEvent}; remote line-in {'AI Stream URI: %s sourceUUID %s','set corr ctx for remote line-in: bootSeq %u gcUUID %s',ai_tracker,'StartTransmissionToGroup failed'}; rincon group {setTransportToRinconGroupURI,'Rejecting x-rincon URI: source or target is an ungroupable player','Node protocol version on %s is incompatible','Count of off box members for VLISrcMgr \[%u\] must be <= CHSRC \[%u\]! Aborting',localConfigureGroup}; X-Sonos-Api-Key header; pbstate field; protocolInfo x-sonos-vli:*:audio:*; sonos.com-hls-static origin; 'performFlush(VLI: %d \[%d\], SMAPI: %d \[%d\])'

- **name:** VLI transport/session
::: details Evidence (1)

- @ 0x10eb08b0; vli transport

:::


:::

## `wireless_modes`

**coverage** `strong`

The wireless-mode transitions: which radio mode the device runs, covering disabled, client, and mesh-node modes, with per-model validation. Status events reflect this state, and it governs whether the player joins your WiFi or Sonos's own mesh.

::: details Technical details

enum {SONOSNET_MODE,INVALID_MODE,ETHERNET_MODE,STATION_SATELLITE_MODE,SONOSNET_SATELLITE_STATION_PRIMARY_MODE,STATION_MODE}; <Wireless><WirelessInfo Name='Wireless Info'>{WifiMode(%d),WifiModeString,IdleState(0x%08x),BusyClients,SonosNetDisabled(%d),ConnectionType(%d),ConnectionTypeString}</WirelessInfo></Wireless>; 'setup() in SonosNet disable test mode, schedule automatic revert in %d seconds' (test-mode auto-revert),'Invalid Muse SonosNet enabled state: %d','JWT parsing failed with error=%s.'

- **name:** wireless mode enum + status XML
::: details Evidence (1)

- @ 0x10f12a30; wireless enum

:::


:::

## `zgs_mediaservers`

**coverage** `strong`

The media-servers section of the household map: external media-server proxies plus the embedded music-service account table, where each service carries its per-account fields. This is how account credentials reach every member without a separate lookup.

::: details Technical details

<MediaServers><Ex CURL="/msprox?uuid=…" EURL T EXT/><MediaServer Name UDN Location/><Service UDN NumAccounts Md%u Username%u Token%u Key%u/></MediaServers>: third-party media server proxies + SMAPI account creds embedded in ZGS; per-account {Nickname%u,SerialNum%u,Flags%u,Tier%u,Password%u}; AreasUpdateID+SourceAreasUpdateID; MS tracking {refreshing,"detected new",RINCON,"ignoring non-rincon MS %s","connect to MS %s %s",unauthorized}; media-player MS record "<MediaServer location uuid version canbedisplayed='%s' unavailable='%s' type='%u' ext='%s'>"; errors {empty id,invalid id count}

- **name:** ZoneGroupState MediaServers fragment
::: details Evidence (1)

- @ 0x10e8c2a0; ZGS MediaServers

:::


:::

## `zgt_schema`

**coverage** `strong`

The household-map document schema: the structure describing every group with its coordinator and member players, plus sections for vanished and quarantined devices. It's the grammar of the single document describing the entire household layout.

::: details Technical details

<ZoneGroupState><ZoneGroups><ZoneGroup Coordinator=" ID=">...</ZoneGroup></ZoneGroups><VanishedDevices>+<QuarantinedDevices><Device {UUID,Reason,ModelInfo,Mac,LastKnownIP,LastSeenUTC}/></ZoneGroupState>; ZonePlayer attrs {QuarantineReason,UUID,ZoneName,Icon,Configuration,Invisible=1,IsZoneBridge=1,SoftwareVersion,SWGen,MinCompatibleVersion,LegacyCompatibleVersion,ChannelMapSet,HTSatChanMapSet,ActiveZoneID,BootSeq,TVConfigurationError,HdmiCecAvailable,WirelessMode,ConnectionType,ChannelFreq,BehindWifiExtender,WifiEnabled,EthLink,Orientation,RoomCalibrationState,SecureRegState,VoiceConfigState,MicEnabled,HeadphoneSwapActive,AirPlayEnabled,VirtualLineInSource,IdleState,MoreInfo,SSLPort,HHSSLPort}; orphan groups ":orphan"; separate <ZonePlayers><ZonePlayer {group,prevgroup,virtuallineingroupid,htsat='true',wirelessmode,connectiontype,channelfreq}> listing; additional member attrs: inbondedzone='%s', inhtconfig='%s', audiotxver='%u', htaudiotxver='%u', tpsdkver='%s', quarantinereason='%s', mincompatibleversion='%s', legacycompatibleversion='%s', compatible='%u', apiversions='%s'

- **name:** ZoneGroupState event payload
- **vanish_and_remove:** Vanished record attrs: curgroup/reasonforvanish/vanishbatterypercentage/vanishbatterytemperature/timesincevanish under </VanishedZonePlayer>, plus <Device UUID=... ModelInfo= LastKnownIP= LastSeenUTC=> entries inside </VanishedDevices> + </QuarantinedDevices>. Removal protocol: 'Local %s designated %s', "Received 'Remove' message pointing to local device from %s:%hu", 'Dropping UPNP "%s" message', 'Probing wrong device %s by action %s', VerifyThenRemoveSystemwide presence check, 'Removed %s device %s by action %s error %hu from %s:%hu', 'Guess that %s (%s) is gc of %s'/'Did not find %s gc': gc-guessing on orphan removal; 'numPlayingZPs', 'No valid UUID for Zone Group Attributes request', 'Failed to find player or group coordinator in getGroupProperties. UUID=%s, UUIDGroup=%s', 'Failed to read dhcp address', 'Error generating network hash'.
::: details Evidence (1)

- @ 0x10f12ea0; zgt schema block

:::


:::
