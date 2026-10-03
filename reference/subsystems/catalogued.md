# Catalogued / absent

## `alarm_clock`

**coverage** `?`

The alarm engine itself: the scheduler that wakes up, checks which alarms are due, and fires them, including triggering playback in the right rooms. The alarm commands documented elsewhere just edit the list, while this subsystem does the waking and firing.

::: details Technical details

- **muse_validation:**
  - **errors:** `Invalid service id`, `Failed to convert content payload for alarm contentType=%s, objectId=%s`, `Invalid startTime`, `No alarm active to silence`, `Invalid duration provided`, `Device not group coordinator or source`, `Alarm not found`, `Invalid recurrence`, `Invalid alarm ID`, `Invalid Recurrence`, `Invalid StartTime`, `Writing alarm failed with error: %d`, `Unable to return active alarm: definition has been deleted`
  - **recurrence:** day-bitmask "12345"-style strings + presets {DAILY,WEEKDAYS,WEEKENDS}
- **ac_impl:**
  - **time_sync:** syncInternetTime job + dailyIndex + Remote; NTP pool 0.sonostime.pool.ntp.org; syncFailed/ntpSync events; "reportTimeSyncFailure detects no internet"; "large adjustment to system clock detected"; state vars {AlarmListVersion,TimeFormat,DateFormat,DailyIndexRefreshTime,TimeServer,TimeGeneration}
  - **execution:** designated-ZP fan-out: "running alarm %d"/"Can't get AVT URI for designated alarm ZP %s"/"for coordinator ZP %s"; conflict detect "New alarm %u conflicted with running alarm %u on ZP %s at %s"; "Not executing on invisible ZP"; scheduler "selecting id:%d ty:%d for execution isLocal:%d"/"scheduling next alarm (%d) in %ld secs (coordinator:%s) nextLocal:%ld"/"%s will run alarm id:%u type:%d"/"unrunnable or expired alarm %u"/"annotate and expire %s"/"use cloud schedule instead of local alarm"
  - **storage:** replicated <AlarmClock LastUpdateDevice="/<Alarms> XML + SQLite; buzzer file://%s/buzzers/0.mp3; alertContent default loop \[rclS:%lld\]; alarmContentConversion; load-content resolution errors
- **detail:** jobs {AlarmClock_Schedule,AlarmClock_Execute}; time.sonos.com + NTP pool 0-3.sonostime.pool.ntp.org; "alertContent: %s no read source"; events {UTCTimeAvailableEvent,AlarmClockTimeZoneChangedEvent}; vars {CurrentAlarmList,CurrentAlarmListVersion}; ac_impl
- **schema:** <Alarm><Mode/><Scheduler/><UTCTime/><LocalTime/><Pending><PendingAlarm><ID>%u</ID><Type>%s</Type><Time>%s</Time><TimeUTC/><Recurrence>%s</Recurrence><NextUTC/><NextLocal/></PendingAlarm></Pending></Alarm>; <AlarmClock LastUpdateDevice="/<Alarms LastUpdateDevice="/<Alarms>; alarm.xml persistence + SQLite3; types {Expired,AVS Alarm,AVS Timer,AVS Reminder,Muse Timer}
- **internals:** fields {StartTime,Recurrence,ProgramURI,ProgramMetaData,PlayMode,IncludeLinkedZones,AutoAdjustDst,TimeSource,DailyIndexRefresh}; vars {AlarmListVersion,TimeFormat,DateFormat,DailyIndexRefreshTime,TimeServer,TimeGeneration,CurrentAlarmList,CurrentAlarmListVersion}; events {UTCTimeAvailableEvent,AlarmClockTimeZoneChangedEvent}; sysclock {"NTPTimeOffset getUTCTimeNow is disabled","reading sysclock_state returned zero bytes",SYNCED,UNSYNCED,"Read %s from sysclock_state file","sysclock_state file is corrupt","NTPTimeOffset timeDiff: %ld *pbLargeAdjustmentMade: %d","large adjustment to system clock detected","reportTimeSyncFailure detects no internet",syncFailed,ntpSync,syncInternetTime}; migration {"Fail converting old rhapsody alarm","x-rincon-buzzer:0","Done converting old rhapsody alram. Was: %s, now: %s","Failure converting old non-OAuth alarm"}; conflict "New alarm %u conflicted with running alarm %u on ZP %s at %s"; exec {"Ignoring alarm %u for room %s while in Exclusive BT Mode","Not executing on invisible ZP %s","unable to determine invis/compat","RunAlarm failed","Can't get AVT URI for designated/coordinator ZP","selecting id:%d ty:%d for execution isLocal:%d","scheduling next alarm (%d) in %ld secs (coordinator:%s) nextLocal:%ld","start: executing alarm id:%u type:%d","%s will run alarm id:%u type:%d","use cloud schedule instead of local alarm","unrunnable or expired alarm","annotate and expire"}; jobs {timedjobmgr_ac,RACZonePlayer,acZonePlayer,AlarmClock_Schedule,AlarmClock_Execute}; "Alarm's TJM is not running"; content {"Failed to convert load content payload","Failed to update resolved content for alarmId","alertContent: could not open default/completed default loop \[rclS:%lld\]/default interrupted","no read source"}; file://%s/buzzers/0.mp3

:::

## `album_art`

**coverage** `?`

Fetches and serves album artwork: it downloads cover images from music services, caches them locally, and serves them over the player's own web interface so apps can display what the speaker sees. This is why the artwork loads even when the original image host would be slow, because the speaker acts as a local image server for its own now-playing art.

::: details Technical details

- **worker:** "album URI dereferenced to: %s"; "Fetching album art for %s: %s"; "invoking vliStreamImage on %s %u %u %u %s"; "vliStreamImage failed"

:::

## `audio_in`

**coverage** `?`

The line-in input path: the machinery for audio arriving on the physical input jack. On this build the network-facing service is a reject-everything stub, but the lower capture machinery exists in the shared codebase, which is why the service advertises commands at all.

::: details Technical details

- **ai_impl:** group model {addGroup coord,demoMode; "no room available for coordinator"; StopTransmissionToGroup by coord; "number of groups %zu remote %zu"}; URI x-rincon-stream:; encoding modes {UNCOMPRESSED,COMPRESSED,v-spdif} + "Running demo mode forcing uncompressed"; artfetch thread

:::

## `autoplay`

**coverage** `?`

The autoplay feature: the machinery that makes a speaker resume or follow a source automatically, which is the 'start playing when this room does' behavior configured through the autoplay settings.

::: details Technical details

- **engine:** MpAutoPlay_: airplay {include zones,vol,useVol,includeZones}; AirplayIncludeGroupedEvt; AutoStop on unhandled URI; linein URIs object.item.audioItem.linein.{homeTheater,airplay,bluetooth}; "lonely local line-in autoplay %s"; failure modes "no autoplay target"/"couldn't determine coordinator"/"couldn't determine AVT control URI of coordinator"/"couldn't determine control URI of zone"; skip "invisible/node proto incompatible ZP"; "for controlURI \[%s\] for coordinator \[%s\]. programURI \[%s\]. %d - %d"; vliType-driven

:::

## `av_transport`

**coverage** `?`

The transport engine's core: the state machine that actually runs playback, covering source selection, play, pause, stop, skip, seek, and the mode-specific behavior per source type. The transport commands on the service page are just the network-facing edge of this engine.

::: details Technical details

- **avt_jobs:** `ChangeTransportSettings`, `avt_play`, `onEvent`, `alarmDurationTimer`, `backupQueueCleanup`, `pollRadioShowMD`, `preemptiveAmp`
- **secondary_guards:** improper-call guards on secondary ZPs {"AVTransportURI cannot be set to non-group URI on secondary ZPs","BecomeCoordinatorOfStandaloneGroup improperly called on secondary ZP","BecomeGroupCoordinator improperly called","BecomeGroupCoordinatorAndSource improperly called"}
- **uris_ht:** x-sonos-htastream:%s HT audio stream + demo line-in uri + "Demo mode update available (%s)" + x-rincon-buzzer:1 custom alarm + x-rincon-stream:%s; spdif source
- **internal_ops:** CQ/playback ops {internalStartCloudQueue,internalRefreshCloudQueue,pauseTransition,commitReplaceWhilePlaying,prepareToBeDelegationTarget,setStateSSGoal,internalRateItem,notifyCQError,internalSkipToItem,internalCQSkipToFirstTrack,int_resumeFromPauseWhenPausedAtEndEnabled,int_internalSuspend,switchState,loadCloudQueueFromReq,handleWorkRequestWhileRunning/Stopped,queueCompletionRoutine,pauseRoutine,stopRoutine,notifyFrame,runQueue,internalNotifyTransportError}

:::

## `cert`

**coverage** `?`

Device identity certificate handling: the Sonos-issued certificate plus encrypted private key used for secure connections and signing. When the player connects to Sonos's cloud or to other players, this machinery picks and presents the right credential so the other side knows it's talking to a genuine device.

::: details Technical details

- **metadata_errors:** devcertmgrprovider cert validation codes: BAD_FILE,BAD_KEY,BAD_CERT,BAD_ISSUE_DATE,MISMATCH_ENV,MISMATCH_ISSUER,MISMATCH_HHID,MISMATCH_USER,not_present; headers X-Sonos-UserId,X-Sonos-Muse-Household-Id,X-Sonos-Denylisted; response {requestTimeMS,downloadStatusCode,httpResultCode,previousETag,download,reasonCode,certError}; states downloaded/unchanged/generating; "Unknown cert metadata state: %s. Scheduling cert refresh job"; "Retrieved manufacturing data: %s"; refresh "%s: refresh check in %ld seconds"/"certificate expired"/"utc time not set"

:::

## `cert_layer`

**coverage** `?`

The X.509 validation internals: issuer/env/household/user match rules, issue-date checks, and the MISMATCH_* error taxonomy behind every mTLS or signed-request failure. Other components ask this layer for 'the right credential' rather than reading certificate files themselves.

::: details Technical details

- **files:** cert.xml + metadata.txt; "Buffer not sufficient to store entire certificate"; "loading %s (0x%x) took %ums"; tmpfile-rename atomic swap; "failed to load replacement (0x%x)"

:::

## `chsnk`

**coverage** `?`

The group-audio channel sink: the receiving end of a framed, time-synchronized audio stream from the group's source. It validates packets, tracks the source's clock offset, and drives the local audio timing so all members play the same sample at the same wall-clock instant. When you group rooms, every follower runs this to receive the leader's stream in sample-accurate step.

::: details Technical details

- **crossfade:** sample-level xfade: "attempting to crossfade with underflowed stream"/"recovered crossfade stream underflow"; int16 crossfade; "xfade corked stream: replace buffered data via non-xfade overlap"; "xfade timestamp too far in past, nst %d.%06d"; "xfadeable timestamp"; "set xfade lfnf"; volume-norm ramp insert "%d @time %d.%06d"; "xfade for %zu samples, %f seconds"; gap tracking "xfade gap, samples %zd"
- **metrics:** gauges {chsnkFillLevel="Amount of audio in stream buffer",largeSyncErrors="Playback (see sync) and downstream errors","Maximum sync mismatch with group coordinator","Amount of output committed to driver"} + {fillCodec,fillTimeMs,chsnkFill,chsnk-full}; window {windowPlayhead,includesBeginningOfQueue,includesEndOfQueue}; stream fmt {"header magic mismatch","md block loc","md header len mismatch","si pos mismatch","si read failed",fsAvail}

:::

## `cloud`

**coverage** `?`

The cloud-integration umbrella: API path construction, service hostnames, registration, and the persistent event channel, covering the parts of the device that are useless without internet. It carries everything from remote app commands to telemetry, and it's the channel that lets Sonos's servers reach your speaker even when you're away from home.

::: details Technical details

- **get_api:** callCloudGetAPI errors {openStream failed,HTTP not OK (%d),HTTP not OK response\[%s\],unexpected timeout rSz/cL,JSON parse failure \[sz,off\]}; SecureRegistrationChangeEvent + cloud_registration/CloudRegistration tags
- **headers:** outbound {X-Sonos-MS-Sig,X-Sonos-DeviceCert,X-Sonos-Context-TimeZone,X-Sonos-MAID,X-Sonos-Accept-Language,AUTHORIZATION,Bearer,X-Updated-Authorization,X-Goog-Updated-Authorization,Retry-After}; completeRefreshTxForAccount/waitForRefreshTxForAccount; "HTTP Header did not fit in char array"
- **ssl_cache:** ssl_client_cache page + "private, max-age=15780000" + "Skipping HH SSL cache refresh - device is not idle" + "SSL client cache refresh next run in %ld seconds"
- **fcs_gate:** "Disabling SSL client cache refresh per FCS"; "Loading SSL client cache after UTC time became available"; TrustDevCertChangedEvent
- **cache_file_format:** On-disk SSL session cache: file {magic number, format version, header {name, entry count}} then entries with per-field bounds-checked parsing {port, hostname len+data, access time, expire time, sdxf flags, sdxf id, sdxf hhid, sdxf sonosId, session length, session blob}: 'sdxf' tags identify the owning household/device (Sonos device-exchange format). Errors: 'bad magic number','incompatible format version','too many entries','invalid {port,hostname length,hostname,access time,expire time,sdxf flags,sdxf id,sdxf hhid,sdxf sonosId,session length,session} field'; ops 'Parsed SSL cache entry for %s:%u','loaded %zu entries','Wrote SSL cache entry for %s:%u', write guarded 'not initialized'; resumption 'Handshake to %s using %s successful'. Client identity: device-cert URNs urn:sonos:{device,udn,hhid,user}, 'loaded client credentials \[%d\]'/'using client cert \[%d\]'/'initiating SSL connection to %s with local port %u'/'Stored local address'.
- **cache_ops_detail:** Two on-disk caches: sys/run/standard_ssl_client_cache.dat + sys/run/hh_ssl_client_cache.dat (household-shared). Ops vocabulary: '%s:%u cache load'/'cache hit (%s)'/'cache hit (%s): ticket match'/'%s%u cache store hit (%s): id match'/'not cached'/'cached session expired (%s)'/'cache evicted'/'cache stored'/'cache deleted (%s)'/'%s does not cache'/'get session failed'/'set session failed'/'cache insert failed'/'entry deserialize failed: -0x%04x'. HH refresh job gated by enableSslClientCacheRefresh + remote-idle check ('Skipping HH SSL cache refresh for %s:%u - remote device is not idle','Refreshed %zu HH SSL client cache entr%s','SSL session for %s:%u has been refreshed'). Status: PlayerSSLCache page with <SSLClientCache><Name/><CurrentEntries/><MaxEntries/></SSLClientCache> + per-entry <HostName/><Port/><LastAccessTime/><ExpireTime/><TimeSinceLastAccess/><TimeToExpire/><TimeSinceLastRefresh/>; stats 'standard: %zu hits, %zu misses; hh: %zu hits, %zu misses; refresh enabled: %s'; settings key RSSLClientCache; save guards 'cache empty, not saving','all entries expired, not saving','serialization error: expected %u entries, but stored %zu'. SOAP diagnostics: soapERAssert/soapEWAssert macros, ' - param %s = %s' param dump, '%s faultcode: %s, faultstring: %s', error element URNs urn:schemas-upnp-org:control-1-0\|{errorCode,UPnPError}, soap envelope URNs \|Body\|Envelope\|Fault, 'error parsing XML returned from SOAP request (utf8 issue?)', 'parentIsSearch'/'developerKey' keys.

:::

## `cloud_registration`

**coverage** `?`

The cloud registration state machine: it binds the player to a household online, exposes progress, and retries failures with backoff while leaving local playback working. Without it the speaker is local-only, and it's the enrollment step that ties your hardware to your Sonos account.

::: details Technical details

- **fsm:** cloudregistration.cxx: required fields {sonosId,householdLocationId,dhcpMac,ipAddr,museHHName}: "Missing required information: DHCP Server MAC (%s), Location ID (%s)" defers registration; triggers "Updating cloud registration due to '%s'"/MuseSessionId change/explicit request; "Caching muse cloud registration event %s"; "Network Hash \[%s\], Muse Household Id \[%s\]"; cloudRegPollWifiStation monitor job; R_HouseholdLocationID key

:::

## `datatap`

**coverage** `?`

Internal data taps for diagnostics: structured capture hooks into subsystems that don't publish state otherwise. It lets diagnostics observe data as it flows rather than reconstructing it afterward, which is the difference between watching a stream and guessing at it.

::: details Technical details

- **detail:** "Datatap snapshot failed after %zu" (snapshot bound); ZoneDevDiscThread

:::

## `device_props`

**coverage** `?`

The device-properties internals: device-level attributes covering serial number, hardware address, display settings, button and light behavior, and infrared handling, plus the account-management commands. It's the 'who am I and how do I behave' layer of the speaker.

::: details Technical details

- **idle_shutdown:** idle events LineInStateChangedEvent/ReplicatedSettingsChangedEvent; vars {WirelessMode,ConnectionType,ChannelFreq,BehindWifiExtender,WifiEnabled,EthLink,SettingsReplicationState,SecureRegState,IsIdle,MoreInfo,RawBattPct,BattPct,BattChg,BattTmp,BtSrcName}; reasons {APICall,BluetoothConnection,PartnerDisappeared,Recovery,UserSuspend,UserShutdown,APIShutdown,CriticalShutdown,UnknownShutdown}; dpimpl/dpUpdateIdleState "idle state is %sidle, changing to %sidle"
- **enetport_schemas:** <EnetPorts><Port port="%d"><Link>%d</Link><Speed>%d%s</Speed></Port>; EthPrtStats {rxPackets,txPackets,rxBytes,txBytes,rxErrors,rxDropped,txDropped,multicasts,collisions}; EthIntrf {lngthErr,ovrFlwErr,crcErr,frmeErr,fifoErr,missedErr,RxDtlErr,abrtErr,crErr,hrtBeatErr,wndwErr,TxDtlErr}; /sys/class/net/eth0 + eth%u
- **fields2:** {oldAddr,newAddr,playingAudio,zoneRole,lineInBusy,ipAddrChange,network,PrimarySupportsFlexSurrounds}; soapaction + text/xml; charset="utf-8"

:::

## `devmode`

**coverage** `?`

Developer mode: a gated diagnostic mode with its own web page, statement files, and an unlock challenge. These hooks are how Sonos's own engineers exercise the device during development, present in production firmware but switched off.

::: details Technical details

- **internals:** statement files {debug/devmode.bin,/devmode.bin,/tmp/devmode.tmp.bin} format "0x%s %d.%d-%d.%d" (id+version range); x-rincon-enc3 encryption; R_ALLOW_SSH_PUBKEY_INSTALL "may not be persisted" gate + "Removing persistent statement with R_ALLOW_SSH_PUBKEY_INSTALL" + "Loaded persistent statement"; notify {processes,listeners} on change

:::

## `error_codes`

**coverage** `?`

The error-code machinery: the tables and translation logic that turn internal failures into the numeric fault codes commands return. It's the numeric vocabulary for failures inside the program, mapped to the error codes sent over the wire.

::: details Technical details

- **rze:** RZEXID_* exception ids {UPNP_TIMEOUT,UPNP_CONNECT_TIMEOUT,UPNP_EVENTING_TIMEOUT}

:::

## `group_mgmt`

**coverage** `?`

The group-management engine: the internal machinery of group membership covering who's in a group, who leads it, and joining and leaving, behind the group commands. One member typically coordinates the group while others follow, and this machinery elects that leader and keeps the shared state.

::: details Technical details

- **ops:** {SetSourceAreaIds,pause,play,copyMusic(%s to %s),becomeStandalone(retry),joinGroup(%s to %s,retry),groupsCommand} + upnpError; topology guards {invalid topology state empty pid/gid,inconsistent topology state invalid gc or pid count}; music context {cannot be copied,cannot be swapped}; faults {Grouping action failed,Invalid grouping action,Invalid args,Action not authorized,Grouping action failed (default)} + groupId; cloning {clone music from %s to ungroupable %s,create new group and cloning from ungroupable player}; params {Effective set of players to group,Creating group with undefined future coordinator hint,playerIdsToRemove array,playerIdsToAdd array,Effective set of new group members}; retry FSM: 'becomeStandalone(%s) failed with error %d, attempting retry'/'without retry','joinGroup(%s to %s) failed with error %d, attempting retry'/'final'; topology consistency: 'invalid topology state, empty field(s): pid: %s, gid: %s','inconsistent topology state, invalid gc or pid count: pid: %s, gid: %s, pid count: %d, gc count: %d'

:::

## `htaudio`

**coverage** `?`

The home-theater audio subsystem: the overall audio path for a soundbar product from TV input to speaker output, including the surround and processing stage. This is what makes a soundbar-and-surrounds rig behave like one instrument rather than independent speakers.

::: details Technical details

; satellite channel-id strings {satLF,satRF,satSUB,satLS,satRS,satLR,satRR} + downmix channels {downmixL,downmixR}

- **tv_session_fields:** `cid set/clr`, `corrId`, `sessionLength`, `sessionPlayTime`, `connectionType`, `GCUUID`, `GCBootSeq`, `GCTimeStart`, `GCTimeEnd`, `inputRate`, `dataBurstType`, `contentType`, `playSeconds`, `forced`, `topoType`, `zpHTInputSession`
- **core:** htcZonePlayer: per-role "%s delay: %uus, gain: %f" for surrounds/sub/group-member-down-mix; "changing surround mode. old %d new %d"; "changing tv surround lvl"/"changing music surround lvl"/"changing height channel lvl"; "sub changing %zu to %zu"; "Set %s signal rate: %zu"; events SatConfigEvent/TVSignalDetectedEvent/TOSLinkConnected/IRRepeaterState; "Orientation %s"
- **satellite_tx:**
  - **control_frame:** "sending control frame: ctrl 0x%x unscV %d curV %d extV %d extVM %d B %d T %d led %d SPL %d SC %d": {ctrl flags, unscaled/current/ext volume, extV-muted, B, T, led, SPL, SC}
  - **audio_frame:** "pkt: %zu channels, %zu samples, payload:%zu, rl:%d": multichannel framed audio; "Last audio frame %d"; "frame serialization failed"
  - **sat_mgmt:** "satellites active \[0x%x\]" mask; "bonded sub(s) %zu"; satellite sub receives non-sub channels; "Sonar center delay %d samples, %d usec"; play start/end handled with disabled sats; "changing surround time delta mode"; "sample type changed"; "Request resync"; volume/mute/LED propagation ("vol change %u (%u%%) -> %u","mute change %d -> %d","LED brightness %d -> %d"); "Send playback ended if count %d > 0 or remote audio disabled %d"
- **tx_stats:** counters {timeToPlay="Time between send and play",txSent="Total bytes transmitted",txErrors,serializationErrors,numLateFrames="late to transmit a frame","Total resynchronization frames",playbackEnd="Total playback ended frames",mx_proc="Highest SatMixer processing time",tx_proc="Highest SatTx processing time"}: "HT Audio Satellite TX General"
- **surround:** per-channel "%s delay: %uus, gain: %f"; surrounds/sub/group member down mix %s; "changing surround mode. old %d new %d" + "changing tv surround lvl" + "changing music surround lvl" + "changing height channel lvl" + "sub changing %zu to %zu"; "Set %s signal rate: %zu"; SatConfigEvent; "TV signal %s"; htcZonePlayer; Orientation %s; TOSLinkConnected; IRRepeaterState; TVSignalDetectedEvent
- **config_schema:** <HTConfig><General>{Version,SurroundState,SubState,GMDownMixState,DialogEnhancementLevel,AISEDynamicLatency,AISpeechEnhance,MusicSurroundLevel,TVSurroundLevel,HeightChannelLevel,AutoPlay,AutoPlaySilenceThresh(%us),AutoStop,AutoStopSilenceThresh(%us),NightMode,SurroundMode,Tweaks(0x%08X),PrimaryEthernet,WirelessEnabled,StartupLatency(%uus),DialogDelay(%ums),FrontSatDelay(%uus),TVGroupMemberDelay(%uus),SatelliteVersion,SatelliteTotal,SatelliteSubs,SatelliteTxMixerRate(%2.1fms)}</General><Satellites><Satellite>{Channel,Delay(%uus),Gain,IP,Eth,WiEna}</Satellite></Satellites></HTConfig>
- **latency:** delays {"HT audio base latency %uus","Invalid dialog delay value %u > %u","Dialog delay %ums","Front sat delay %uus","HT audio group latency %uus","Invalid surround delay %d for %s","%s surround delay %u gain %f"}; origin-time formula "New origin time: %u.%u, read time: %u.%u, delay: %uus (startup: %u + lipsync: %u + frontSat: %u), tvp delay: %lluus"; "Satellite origin time %d.%d"; "Group member origin time: %i.%i was extended by %uus"; tweaks "HT tweaks updated %08x"; sat pkt "%zu channels, %zu samples ea."
- **name:** ; dsp_mixer block params: WeightedSum_%zu mixing node, Alpha_/Alpha_%d gain params, Tap_%d_ch%d FIR taps, NumChans, NumTaps, WarpedFIR; invariant 'nOutputs %zu != nScratch %zu'; bed naming {main_bed,asso_bed,bed_d0} + generic_float32 sample class (Atmos bed/side-render objects)

:::

## `http_engine`

**coverage** `?`

The device's embedded web engine: route tables for both the main and status-site registry, static and executable page handling, request forgery protection, and the auth plumbing guarding sensitive endpoints. Everything the built-in web server runs on.

::: details Technical details

- **auth_challenge:** two-step: "First Response: \[%s\] \[%s\] \[%08x\] \[%d\]"/"Second Response: ..."; headers X-Sonos-Mac/X-Sonos-Serial; cred body {"credentials":"%s","nonce":"%s","keyType":%d}; HTTP/1.{0,1} 401 retry; sonoscloudstatus endpoint; httpcaches.json + "\[%s\] Force-cleared cache"
- **hhsettings_api:** category REST paths public/{key}, restricted/{key}, restricted-admin/{key}; errors {Key not found,Failed to delete setting,invalid value size or type,HHSettingsMgr reported invalid value,Failed to store setting,"Deleting all settings in a category is not allowed. Provide a key.",Unsupported Request}; /overrideconfig POST form-urlenc → commit override file → <meta refresh url=/fcs>; JSON parser errors {Exceeded max depth,Invalid unicode escape,Invalid escape,Invalid string character,Invalid numeric character,Unexpected token,Sequence too long,Missing required value,Invalid value,Out Of Memory,Unexpected error}
- **cookies:** bounded cookie jar "Exceeded max cookie count of %d, overwriting cookie %d/%d" + Domain attr + "unable to send complete list of cookies"; UA strings {"Linux UPnP/1.0 Sonos/%s (%s)","Sonos/","PlayToSonos/"}; WD100 tag; MAC fmt variants {:,-,none,upper,lower}
- **session:** session state "Session status 0x%x connected %d wantWrite %d wantRead %d"; HTTP 206 partial-content accepted (range requests); "Remote close hostname %s FD %d"; SSL session cache "Cached SSL session for %s:%d"
- **server_core:**
  - **status:** confirmed
  - **details:** TSocketPoll/select engine: 'Can't initialize TCP sockets','port %u sock in unexpected state %u','SocketWait: error/hangup detected','SocketPollAddFd: too many fds added to TSocketPoll','SocketPollAddFd: invalid parameters (spoll=%p, fd=%d)','SocketPollDoPoll: wake event fd error/hangup detected','Can't set socket non-blocking','Can't create a socket','Can't listen','RequestRead failed','RequestRead: Truncating request string'. HTTP emission: 'HTTP/1.1 %d %s','CONTENT-LENGTH: %u','CONTENT-TYPE: %s','SERVER: Linux UPnP/1.0 Sonos/...','X-Frame-Options','frame-ancestors 'none'','Content-Security-Policy','if-modified-since','Content-range','bytes %llu-%llu/%llu','multipart/ranges; boundary=##123456789###BOUNDARY'; full HTTP status-phrase table (Switching Protocols .. HTTP Version Not Supported); error page '<HTML><HEAD><TITLE>Error %d</TITLE>...%s</BODY></HTML>' (and lowercase variant). Config file ../conf/anacapa.conf with keys: conntimeoutsecs, timeoutfirstbyte, numthreads, MaxConn (capped, 'Edit anacapa.h to increase cap'), diagmax/diagmin, PidFile, SSL port, 'secure reg SSL port', MIME Types file, server root, ConnTimeoutSecs; invalid values each logged.
  - **lifecycle:** 'anacapa is starting on port %d','%s (port %d)','server stopped(%d) %s','Shutting down','hardstop wanted','%,ServerNetInit','zone ID generation failed for base port \[%u\]','server sockets','Demo mode 0x%04x voltype 0x%04x'; TServer records: 'Found TServer\[%s\] config for %s','No localsettings.txt found for TServer \[%s\]','%s - TServer \[%zu\] already NetInit, ignoring server-change event','TServer \[%zu\] not started, ignoring shutdown event','%s - TServer \[%zu\] already started','TServer\[%zu\] stopping...','Error raising event: %s','%s: SSL failure','Could not create SSL Context.'; logs to /opt/log/anacapa.log; CLI 'Usage: %s \[-h\] \[-c configuration file\] \[-u username\] \[-C caps\]'.
  - **threads_and_faults:** Thread layer: 'can't set stack size to %zu','Error: Attempting to join detached thread (%lu)!','Aborting thread','Couldnt Create thread %lld','anacapa threads:' diagnostics with ' %5lu %20s(%3d,%3d): ' rows, 'waiting on %s %s,','running or not instrumented,','Totals: %d threads, %d mutexes'. Fault handlers: segv/abrt/ill install failures; reason strings {Segmentation Fault, Floating point exception, Illegal instruction, Unknown Fault, Address not mapped, Invalid permissions}. Watchdog: 'app/debug/prevent_wdog_sigkill' killswitch + 'Unable to start watchdog helper on port %hu'. TPool allocator: 'Cannot dump: TPool *p argument is NULL.','first=\[%p\] current=\[%p\]','Zone \[%p\]: data=\[%p\] pos=\[%p\] max=\[%p\]'. VLI synth UDN 'RINCON_000E58VLIDID01400'.

:::

## `http_headers`

**coverage** `?`

The HTTP header vocabulary the device emits and parses: auth challenges, Sonos's own X-Sonos extensions, eventing headers, and the standard set. The shared dictionary for every web exchange the player makes.

::: details Technical details

- **X-Sonos-Latency:** proprietary header carried on the audio-stream/WAV path (audio_stream_local.cxx region); latency advertisement for stream sync

:::

## `lechmere`

**coverage** `?`

The persistent cloud pipe, internally named 'lechmere': the always-on channel carrying modern-API commands in and device events out, with route templates defining its addressing. It's the link between your speaker and Sonos's servers that works even when you're away from home.

::: details Technical details

- **cloudrequest:** cloudrequest.cxx: ws endpoint /api/v1/websocket; per-msg-deflate toggled by cloudcfg ("per msg deflate change %d -> %d") w/ local-run-state override; "Player IP changed. Bouncing connection"; backoff "Following backoff schedule, retry in %lld"; msg types: SET_CONFIG (registration send/read), CHECK_CONFIG (registration return), TYPE EVENT ("Unexpected TYPE EVENT"), "support for HTTP message dropped", "Unrecognized message type"; poll loop crt.poll/CRT select failed/ppr read failed/failed to ping/"player request failed: %s"; SwitchingRadiosEvent; museCloudEvtHandler

:::

## `mod_zp`

**coverage** `?`

A zone-player module identified by build-tree naming: part of the player-facing internals recovered structurally, inventoried as part of the complete component map.

::: details Technical details

- **detail:** mod_zp + mod_zp_aa album-art queue "queueing album art request %s %u %u %u"; timeout states {timeoutplaying,timeoutpaused}; headers {x-rincon-last-update-device,x-rincon-content-version,x-rincon-range}; "%s.tmp" staging + "Unable To File %s"/"Unable To Rename Temp EQ File"; "Forced GTK rekey"; button-forward errors {no handler,invalid method,No button handler unable to forward buttons,Feature not supported.}; build props {build.date,build.scm.version,/build.properties,legacyanacapad,hhSwgenState}

:::

## `muse`

**coverage** `?`

The 'muse' layer: Sonos's internal name for the modern API machinery as a whole, covering the route tables, router, operation objects, and pipeline documented on the modern-API page.

::: details Technical details

; explicitTargets guards 'explicitTargets: invalid target id in list','explicitTargets: too many targets'; validator 'when primitive type was expected','number of entries below minimum of'; log redaction '{"reason": "MESSAGE REDACTED"}' (muselogrsp); authz 'unauthenticated_control_disallowed'; enum names {INSECURE,PLAYER_WITHIN_GROUP,BATTERY_SAVER,LONG_PRESS,NOT_CHARGING,GROUP_STATUS_GONE,AUTO_HT_CONFIGURATION,SESSION_STATE_CONNECTED,SONOSNET_ENABLED,PLAY_REPEATED,MUSIC_ACCOUNTS,TAG_EXPLICIT,CONNECTED_UNALLOCATED}

- **auth_errors:** auth helper errors {"Player is not securely registered","Access token's user does not match registered user","Access token does not have adequate permissions","Command scopes could not be determined","Invalid user","Scope is insufficient","Error reading scopes","Error matching scopes"}; scopes {hh-config,hh-config-admin}; token fields {access_token,resource_owner,expires_in,time_since_created}; response {"Response code: %d, Access token is invalid"/"Scope is insufficient"}
- **service_bindings:** musezpactor UPnP service URIs {AlarmClock:1,AudioIn:1,ConnectionManager:1,MusicServices:1,SystemProperties:1,ZoneGroupTopology:1,HTControl:1,GroupManagement:1,GroupRenderingControl:1(urn:schemas-upnp-org) + Queue:1(urn:schemas-sonos-com),VirtualLineIn:1}; "zp already set"/"zp not set"

:::

## `muse_engine`

**coverage** `?`

The modern-API engine: the namespace registry, request validation, fan-out to target players, authorization, and execution, mounted on the API routes and the cloud pipe. It's the counterpart of the classic command machinery for the app's REST-style world.

::: details Technical details

- **dispatch:** "Dispatching command (ns=v%u/%s, cmd=%s)"; actor errors {"Namespace may be missing actor (%s). See RZPMuseActor","Namespace has no actor (%s). See RZPMuseActor::setupWholeDevicePointers()"," has no actor","Failed to create command (%s)"," command is not supported"}; target ids {"invalid implicit target id \[%s\]","invalid explicit target id \[%s\]","Invalid targetId for unsubscribe (%d)"}; events {RMuseEventing,"Failed to send muse message %s(%s)"}
- **upnp_bridge:**
  - **pattern:** v1/players/{playerId}/upnp{Service}\[/subscription\[/{logicalSID}\]\] + v1/households/{householdId}/players/{playerId}/upnp{Service}\[/subscription\[/{logicalSID}\]\]
  - **bindings:** {playerId,upnpX,call} / {playerId,upnpX,subscribe} / {playerId,upnpX,renew,logicalSID} / {playerId,upnpX,unsubscribe,logicalSID}
  - **services:** `upnpDeviceProperties`, `upnpGroupManagement`, `upnpGroupRenderingControl`, `upnpHTControl`, `upnpMusicServices`, `upnpQueue`, `upnpRenderingControl`, `upnpSystemProperties`, `upnpVirtualLineIn`, `upnpZoneGroupTopology`
  - **vli_verbs:** `selectSource`, `startTransmission`, `stopTransmission`, `sendBackChannelCmd`
  - **evidence:**
    - type: firmware, status: confirmed, address: 0x10e8462c, notes: bridge bindings
- **type_registry:** alphabetical name table 0x10f975c0-0x10f98568 (203 entries): candidate type-index namespace for spec-pair {0x82,b} entries
- **playervolume:** verbs {duck,unduck} at v1/players/%s/playerVolume/{duck,unduck}; setVolume "cannot set volume AND mute parameter"; setRelativeVolume "cannot set volumeDelta AND muted parameter"; fixed flag; v1/groups/ + v1/players/ + /playerVolume paths
- **command_format:** muse command = JSON array \[header object, body object\]; "failed to parse json body (offset: %u)"; param validation emits MISSING_VALUE/UNEXPECTED_TYPE + range/coerce messages
- **client_auth:** schemes {wssmtls,httpsmtls}; audience v2.api.smartspeaker.audio; credentials {apikey,guest_token,guest_token_pin}; "Policy key permissions length exceeds maximum size!"; "validateTargetIdV1: invalid target id: %s of type: %s."; "Client auth exception"; "API key changed from \[%.8s\] to \[%.8s\]"; "Credential is missing"; "Secure connection required"; "Upnp command failed with return code"; "Error code not found in objectStatusMap"; "Api Key passed by client is too long..truncating."; MuseDebugInfo; providers {getActorProvider,getTargetIdProvider,getTargetValidator,MuseDeviceImplProvider}
- **namespaces:** {audioClip,householdUpdate,management,musicServiceAccounts,pinewood,platformInternal,positioning,roomDetection,soundSwap,systemReporting,systemTime,virtualRemoteControl} + settings:{accessorySettings,business,frontierLlms,global,playback,playerBasic,playerLineIn,playerUI,positioning,preferences,prodashboard,security,video} + upnp:{AlarmClock,AudioIn,AVTransport,ConnectionManager,ContentDirectory,DeviceProperties,GroupManagement,GroupRenderingControl,HTControl,MusicServices,Queue,RenderingControl,SystemProperties,VirtualLineIn,ZoneGroupTopology}
- **http_auth:** challenge {private,public,realm,error_description,nonce,Basic}; OAuth errors {invalid_request,invalid_token,insufficient_scope,service_unavailable}; results {denied/403,denied/503,no token}; log "Muse auth result: \[%s\] \[%s\] \[%s\] \[%s\] \[%s\] \[%.8s\] \[%s/%s::%s\]"

:::

## `music_accounts`

**coverage** `?`

Music-service accounts as embedded in the household map: per-account nickname, serial, flags, tier, and credential fields that every member sees, replicated across players. It's where saved service logins live inside the shared state.

::: details Technical details

- **accountsmgr:**
  - **guest:** guest accounts: link-code required; sn_%d serials; "guest upgrade not allowed via reauth"; matched by {g,sn,h(ash)}; nickname update; tombstone migration "Migrated tombstoned %s replication account"
  - **errors:** `no account`, `stale account`, `unsupported service`, `unexpected`, `login failed`, `serviceId is out of range`, `serviceId is malformed`, `Either linkCode or accountId should be provided`, `Could not resolve serviceId`, `Unsupported account authentication method`, `missing required Token or OAuthDevID`
  - **corruption:** detectors {emptyUUID,dupUUID,serial}->"Found corrupted accounts"; removals corruptedAccountRemoval/duplicateAccountRemoval; "Removed account multiple. SN=%d, SID=%u, UID=%u"
  - **replication:** "replicating accounts file from %s"; "Rejected version %u, schema %u from %s"; "Invalid replication operation"
  - **migration:** "Created new accounts file; migrated %d accounts"; "Migrated Pandora built-in"; pre-cloud/anonymous account migration; legacyTuneInReplaced; "Migrated Account with SID %u. (%u,%u->%u)"
  - **preferred:** getPreferredAccount no preferred set/no matching; setPreferred via serialNum extraction from accountId; performsSMAPIAccountMatching; "Account matched g=%d,sn=%u,h=%s"
  - **ops:** `restore`, `addAccount`, `migrate`, `maintenance`
  - **reporting:** "Pending report for account %u"; "Failure to mark accounts for reporting"; "Failed to report svc %u"; numAccounts
  - **manifest:** "Failed to download manifest file (%s) for service %u, error %hu"
  - **directcontrol:** "End direct control context UUID: %s"; spotifyTransferStartDirectControlEx; authToken/smapi keys
- **stereo_pair_rc:** rc_impl_stp: RcSetEqActionEvt {DesiredLoudness,DesiredBass,DesiredTreble,RampType}; VolumeSetActionEvent {vol,mute,ignoreProxy}; "This command is allowed only on primary: %s" forwarding gate; "Muse command forwarding failed"; volumeScalingFactor; SetRoomCalibrationStatus propagated to SUB, second SUB, SURROUND via UPnP clients
- **sp_impl:** TuneIn migration gated by FCS flag "TuneIn Migration enabled from FCS"; R_PromoVersion,R_ForceReIndex keys; trial-ZP tracking "Trial zp updated with result:%d"/"Trial ZP has changed from %s to %s"; "Account registration for service %u res %hu"; ChsrcSysSettingsEvtSrc/AirplayIncGrpEvtSubject
- **replication_ops:**
  - **ops:** `markAccountsForPushLocked`, `setAndUpdatePreferredSerialNum`, `addAccountWithUserCredentials`, `int_addAccountWithOAuthToken`, `addPreinstalledService`, `addAccountWithOAuthToken`, `addAccountWithOAuthCode`, `addAccountForOAuthDirectControl`, `modifyAccount`, `migrateAccountsToSMAPI`, `setup`, `migrateAccountSID`, `migrateAccountToOAuth`, `updateAccountUserInfo`, `reportAllActiveAccounts`, `ReportSvcTimedJob`, `matchImpl`, `pullFromReplicationService`, `pushToReplicationService`
  - **states:** `retry`, `conflicted`, `updated`, `added`, `deleted`, `invalidCloud`, `invalidCloudSerial`, `invalidCloudReason`
  - **validation:** cloud record requirements {service ID,service uuid,account type,metadata,cloud vector clock,serial number,account ID,household vector clock}: "Discarding invalid cloud record: %s \[uuid=%s, hh=%s, cloud=%s\]"; accounts.xml + vcCloud vector clock; zpam log fmt

:::

## `network`

**coverage** `?`

The network layer as a whole: the player's general networking machinery beneath the specific protocols, covering sockets, interfaces, and the shared plumbing. It's the collective term for everything from interface monitoring to the proprietary mesh to the startup coordinator.

::: details Technical details

; config keys HTPrimarySupportsAPOnly, UseSSIDList

- **netsettings_mgr:** file netsettings.json + HHSettings + schema upgrade; 4 PSK classes {HhPsk,ControlPsk,RoomEncPsk(room name encrypt),LanSwapPsk} each + Backup variant, rotation "PSK rotation successful (HH/Control/RoomEnc/LanSwap)" + version bump; encoding {SonosNet key,DTLS HH PSK}; netstartd push {netsettings,PSK,channel change "Pushed SonosNet channel change to %u for %u ms"}; SonosNet-disable test-mode auto-revert FSM {sn_en,sn_dis,sn_dis_test}: "schedule automatic revert in %d seconds"/"SonosNet was re-enabled"/"Disable succeeded (probably)"/"automatic revert failed!"; SSID protection "Registering for next topology update to protect SSID"; "Pending netsettings.json update discarded after replicating"
- **network_test:** networkTestMgr: nettestresult.txt; cycle {"waiting %d sec before disabling wifi","disabling wifi for %d sec","enabling wifi",connect-open,complete:%s} + abort paths

:::

## `nodetx`

**coverage** `?`

The inter-player transmit transport: packet-range tracking, resync operations, and the resend machinery the source side uses to serve late joiners and packet loss. Together with the receive side it forms the reliable-ish audio multicast layer, and it's how this player's status goes out to the household.

::: details Technical details

; control-frame type names {boundaryX,schedResyncX,immedResync,schedResync,endTX} + debug line '// %3u %d.%06d %u:%s'; ITBTT_UNKNOWN

- **ops_counters:** ops {schedResyncX,immedResync,schedResync,endTX}; ITBTT types {ITBTT_UNKNOWN,ITBTT_CHSRC,ITBTT_LINEIN,ITBTT_VLI}; crossfade state for packetId {lPacketNum-1/lPacketNum-2 fallback,no frames,crossfade on/off}; "checkAndMarkFrameDiscontinuity: %lldus"; "getLocationAtTime earlier than oldest valid packet"; NACK {"nack from %s count=%u, min=%u, max=%u","not transmitting %u stale packets","ignore NACK packet with incompatible protocol version"}; perf-counters {rsend=DataBlock sends,nackr=resync NACK,nackd=data NACK,nacku=unsendable NACK} + "Histogram of transmitted packet info"; params {transmit port,dstaddr unicast/multicast,lastpktid}

:::

## `radiolog`

**coverage** `?`

The radio diagnostic surface: radio-related event logging exposed through the status pages, covering station tuning, stream errors, and metadata events. It's useful when a stream plays but metadata or tuning behaves oddly.

::: details Technical details

; compact per-station settings telemetry 'GtAMV%hd LV%hd RV%hd B%hd T%hd L%c F%c SS%hd LEV%hd SW%c SC%hd SP%hd DL%hd SL%hd AD%hd' (radioStationLog): one line per station change packing AM volume/left/right/bass/treble/loudness/fixed/stereo/line-in-level/sub/surround/channel/delay/sub-level/dialog fields

- **detail:** flags {recurse,redir,unsupported}; rc_impl settingsWriteback

:::

## `registration`

**coverage** `?`

Local device registration: the on-network enrollment half that precedes cloud registration, tracking each device's registration state inside the household. It's the flow that makes a device known to the account and to the other players.

::: details Technical details

- **secreg_fsm:** endpoints /product/v2/households/%s/players?action=refresh + ?action=complete&token=%s; FSM {registration during suspend,time expired,success,retrying at %ld,error,regStatus}; signing {"Invalid registration signing key in IPC payload","Registration signing key set/cleared"}; "Household customer ID \[%s\] in conflict with local device \[%s\]"; "regState changed %d -> %d"; "Transfer mode old (e:%d) new (e:%d)" + tjmgrExitSecureRegTransferState + newRegisteredCertSonosIDLocked; mutualssl/sslError/errno fields; "removed invalid cert"; "Unexpected 401 response"; secureRegTransfer/currentAccount; perf <PerformanceCounterTables> + persistentCache {lastUsed,expires}

:::

## `registration_machine`

**coverage** `?`

The state machine driving the secure-registration protocol: sequential state transitions with timeout and retry handling, plus error capture for the secure channel. It orchestrates the two-phase enroll from unregistered to enrolled.

::: details Technical details

- **name:** regdevicecert.cxx registration/secure-reg FSM
- **cloud_api:** `/product/v2/households/%s/players?action=refresh`, `/product/v2/households/%s/players?action=complete&token=%s`
- **fsm:** states regStatus + regState %d->%d; events registration during suspend\|time expired\|success\|error\|"retrying registration at time %ld"; secureRegTransfer tjmgr flow: exitSecRegTransferState scheduled/de-scheduled/run via tjmgrExitSecureRegTransferState; currentAccount
- **signing:** Registration signing key set/cleared via IPC payload ("Invalid registration signing key in IPC payload")
- **events:** NewCertRegistrationEvent inprocess-event {SonosID}; newRegisteredCertSonosIDLocked; RegisteredCertSonosID/RegisteredCustomerID keys; Household customer ID conflict/changed detection

:::

## `rendering_control`

**coverage** `?`

The rendering-control engine: the internal model of volume, mute, and tone per channel that the volume and tone commands manipulate. The per-speaker sound controls are all handled through this subsystem.

::: details Technical details

- **volume_engine:** per-zone FSM: {override\|normal} volume + deferred volume/mute + ducking; math "DuckVol=%d (%d%% of %d = %d, offset %0.2fdB due to %d channels in zone)" + "Unbounded ExtSrcVol=%d ExtSrcVolMusic=%d (boosted %0.2f dB based on # of channels, plus surround lvl gain of %0.2f dB)"; audioSystemsTuning; persistentEQ.xml apply; DSPControlChProc/DSPControl; LastChange also carries SonarEnabled/SonarCalibrationAvailable; fast-volume path 'sonosAsyncFastStateCond'+'Unknown fast volume directive (%d)'+'type:%s, value:%d'; per-ch trace 'ch:%s, adj:%d, vol:%u','ch:%s, loudness:%d','ch:%s, type:%s','fixed:%d, level:%u','Ramp to %u, interval %u ms','Scaling factor set to %d'; event loop 'Queued %s(%u) from "%s": { %s }','Attempt to queue event %s(%u) from "%s" with no eventloop configured'; sonar calibration 'sonar consistency: %s','primary=%d enabled=%d, consistent=%d all_present=%d','Available Sonar Calibration ID changing: "%s" -> "%s"','Device has never been room_calibration-calibrated','AudioCore Sonar calibration load error'; safe-listening clamp restore: 'system volume being restored to safe listening level (%u)' / 'failed to restore system volume to safe listening level'; playback relay 'Error sending skipToNextTrack command to local: %s' + 'playback#skipToNextTrack response: %s' + 'executing play' + 'playback started (cid: %s)'
- **rc_impl_stp:** SetEQ action params {DesiredLoudness,DesiredBass,DesiredTreble,RampType} via RenderingControlSetEqActionEvent/RcSetEqActionEvt; VolumeSetActionEvent(vol,mute,ignoreProxy); primary-only gate "This command is allowed only on primary" + "Muse command forwarding failed"; volumeScalingFactor; RC propagation to {SUB,second SUB,SURROUND} (dual-sub support); signal-channel errors {invalid playId,failed to stop signal,incorrect playId,nothing is currently playing,couldn't create an audio stream,only one signal can run at any given time,invalid channel,disallowed by policy} + channelNumber
- **led_feedback:** button feedback {"in start music play feedback from 0x%x","led feedback for timeout waiting to start play/pause","waiting-to-play-music feedback:%d","waiting-to-pause-music feedback","unsupported/unhandled play feedback action:%d","cleared fast volume zero after %s","pause confirmed by PlaybackStateChangedEvent"}; LocalPlayURI errors {RC control URI,mute+volume state,restore default volume,set AVTransportURI,start playback,coordinator transport state}; PLAYING/TRANSITIONING states

:::

## `reporting`

**coverage** `?`

The reporting and telemetry umbrella: usage metrics, dropout events, TV sessions, Spotify stats, and the uploader that ships them. Each subsystem's report schema is documented separately, and this is the shared submission plumbing.

::: details Technical details

- **crashdump:** sentry uploader: dump-proc-anacapa w/ build.version, sentry\[release\], sentry\[tags\]\[%s\], %s\[sonosID\]; dumps anacapad.{core,dmp}+sonospowercoordinator.dmp+btmanager.dmp+netstartd.dmp + *.properties; counters sonospowercoordinatorCrashCount/netstartd.count; logs /opt/log/anacapa.{hdmi,tv}.log,/tmp/AirPlay.log,/opt/log/{btmanager,btservice}.log,/tmp/backtrace,/tmp/crashed_play_state; killfiles /tmp/anacapa_prevent_crashdump_upload+prevent_crashdump_upload; "Failed to write attachment %s to sentry upload"; htsnk dump
- **play_report:** RPlayReportSubmitter: submitPlayReport/playReport/nowplaying endpoints; fields {serviceType,activatedAccountCode,errorStatus,errorType,multiAccountId,codec,originDelay,outputDelay,endReason,skippedTrack}; "final report" notify; "periodic report interval set to %lld seconds"; spotify-connect serviceType

:::

## `settings`

**coverage** `?`

The settings umbrella: household settings, player settings, replicated settings, the local settings manager, and effective settings, each documented separately. Settings are layered so 'effective' values are what actually apply, and this is where configuration lives and how changes propagate.

## `smb`

**coverage** `?`

The Windows-file-sharing client layer: UNC path parsing, dialect probing, credential handling, mount and unmount lifecycle, and the stream-open path library browsing uses. Guards include a share-count cap and per-share failure flags.

::: details Technical details

- **iterator:** resilient dir walk: mount "Successfully mounted %s as %s"; reconnect "failed to connect to %s (error=%d); reattempt=%d"; resume "Reopened directory %s at start"/"iterating to %s"/"Found last known item %s"; fast-forward/stat errors reattempt-tagged; /tmp/smb/tmp_idx staging; connect failure ladder 'Connection failed, could not build URI from %s','Connection failed, could not parse SMB URL: %s','Connection failed, failed to connect to share %s with %s (error=%d)','Connection failed, cannot stat share %s: %s (error=%d)','Connection failed, cannot stat path %s: %s','cannot open directory %s','Connection failed, the provided path was not a directory %s','%s: failed to mount %s'; reconnect/iterate machinery: 'No remaining connection attempts to %s','Connecting to %s (remaining attempts: %zu)','Connection failed, could not allocate context.','Reconnection to SMB share %s','Metadata load failed with error code: %s (0x%x)','Attempting to reinitialize connection to directory %s (lastEntry=%s).','Reopened directory %s, iterating to %s' (fast-forward to last known entry),'Found last known item %s in %s','Reached end of %s while iterating to %s','Failed to read next entry while iterating to %s in %s','Failed to find last known item %s in %s','Fast-forward failed with error code: %s (0x%x) (reattempt=%d)','Entry retrieval failed with error code: %s (0x%x) (reattempt=%d)','Invalid path to stat.','Failed to stat entry, no open connection.','Failed to get next entry, no open directory context.'/'no open directory.'/'no open directory or connection.','Failed to read directory entry (%s)','Failed to open directory %s (%s)','Failed to mount %s (error=0x%x)','Metadata file open failed (error=%d).','Metadata load failed (error=0x%x).'
- **mount_detail:** Kernel-cifs mount layer: option strings 'ver=1,directio,sec=ntlmssp,nounix,' and 'ver=1,directio,' (SMB1 only, NTLMSSP, direct I/O); mount lines 'unc=%s,ip=%d.%d.%d.%d,ro,%sdomain=%s,user=%s,pass=%s' / 'user=guest,pass=' (read-only, optional domain); dialect report 'connected to %s with SMB dialect %x'; failure 'Mounting %s failed, addr = %d.%d.%d.%d, ssp = %d, errno = %d, ret = 0x%08x'. Multi-address trial-mounting with strike counter ('Trial mount found unsupported protocol: %s (strike %d/%d)', 'flagging %s as failed', 'chose random %s from %s'). Credential churn: 'credentials for %s changed; unmounting'/'but share in use'. Idle GC: 'unmounting idle share %s', tryCloseAllUnusedShares job (skipped while shares busy). Mount dirs /tmp/smb/%d_%d + /tmp/smb/tmp%d_%u; 'too many shares mounted'/'mount dir already exists!'; refcounted contexts 'release %s -> num contexts: %zu refcount: %u'; '%s on temporary/unmounted share %d'. share_usage accounting + entry cache ('cache at max capacity', 'loaded %d share entries', 'unable to load cache from file'). 'not http mounting %s as %s' alternate transport.

:::

## `sntp`

**coverage** `?`

The time-sync client: chrony-backed clock management, virtual-clock concepts for group timing, server switching when a source degrades, and the role that makes one player's clock the group reference. Sample-exact multiroom play depends on this being healthy.

::: details Technical details

- **clock:**
  - **discipline:** "Clock pull hit the bottom/top rail" clamps; "Current Rate:%d, adjustment:%d, Target delta ppm:%g"; "Estimated offset(ms):%g, n:%llu"; "Slope change detected. bumping slope dispersion. ErrorMode/OffsetMode"; "clock quality suspect. Sdev: %f"; "Time went backward, discard SNTP offset"; transitions "Clock transition into PCM"/"into system time"; "clock audio sourced: %c"; "Excessive AudioSync %f total"
  - **poll:** SNTP requests to group coordinator ("ret = %x, error = %f"); "SNTP success after %u failures"; "complete sync reset"; "Offset set to %f for server ip:port"; "Suspend and reset"; persistence sntp.txt in sys/debug (save_sntp)
  - **server:** SNTP server on port %hu per clock; server-clock add/remove via "sntp-%u-clock" requests (evtMask+fd); virtual clock install/remove on port %u; interrupt fd + SO_TIMESTAMP + ToS + hi-priority Tx queue
  - **stats_schema:** {Flags,NewServer,UpdateServer,TransitionValidOffset,NotUsed,Valid,Successes,OverThreshold,ErrMode(statistical mode of error values),AudioSync,Slope,vcxoRate,Doubling Ratio,Histogram,BigBin}
- **detail:** "Clock transition into system time"; "SNTP success after %u failures"; "SNTP request to group coordinator failed, ret = %x, error = %f" (GC-requested); "SNTP request failed, will retry."; "complete sync reset"; "Offset set to %f for server %u.%u.%u.%u:%d"; "set SNTP server: %d.%d.%d.%d"; "Suspend and reset" op; sntp_ files + sys/debug + save_sntp

:::

## `spotify`

**coverage** `?`

The on-device Spotify stack as a whole: the embedded component's session, the transitions that let a Connect session take over an existing group, the queue and track pipeline, and the discovery pieces. Everything Spotify-specific in the player funnels through here.

::: details Technical details

- **mdns:** _spotify-connect._tcp mDNS service; CPath sonos; "deregister skipped for empty SID"/"register skipped for non-empty SID: %s"

:::

## `spotify_connect`

**coverage** `?`

The Spotify Connect path specifically: the control channel, credential handling, login state machine, playback session management, and the callbacks bridging component events to the Sonos transport. A Connect takeover is this subsystem asserting control over the group's transport.

::: details Technical details

- **esdk_host:**
  - **summary:** spotify_playback_session/queue/smapi/vli/thread blocks 0x10ea32cc-0x10ea4c40: the host-side eSDK integration
  - **nts_callbacks:** `NTSCallbackConnectionNotify`, `NTSCallbackPlaybackApplyVolume`, `NTSCallbackStreamEnd`, `NTSCallbackStreamSeekToPosition`
  - **esdk_calls:** `loginZC`, `dcLogin`, `SpDisableConnect`, `SpSetDisplayName`, `SpSetDeviceIsGroup`, `SpPlaybackIncreaseUnderrunCount`, `SpPlaybackSetBitrate`, `SpPlaybackPause`, `SpPlaybackPlay`, `SpPlayUriWithOptions`, `SpGetMetadata`
  - **esdk_events:** `TrackChanged`, `ShuffleOn/Off`, `RepeatOn/Off`, `BecameActive/Inactive`, `AudioDeliveryDone`, `ContextChanged`, `MetadataChanged`, `NetworkRequired`, `TrackDownloadStalled`, `QueuedTrackAccepted`
  - **track_queue:** current/next/previous/pending model (%s\|\|%s uri\|\|id pairs); "Track change: (%s\|\|%s) -> (%s\|\|%s)"; mismatch errors incl "\[BUG\] RESOLVING acked NEXT track mismatch"; per-track {pos %lld/%lldms, delivered, rendered}; EndSong @ms; download-complete resets position; stream-id consistency enforced (invalid PlaybackId, id-mismatch on setTrackSize/download-complete); "Suppressing phantom playback-start after end-of-queue"
  - **seek:** fast paths "Resume from pause, offset %zu"/"Seek fast path %u ms"; slow path via SpPlayUri(type,uri) w/ "adjusting initial Play position %u"; "Forcing seek slow path"; "Play from beginning"
  - **queue_ops:** states {Now Pending,Still Pending,Waiting In-Flight,Current Track Pending,Current Track Still Pending}; "Play & Queue Tracks" (+new session/+recover from error); "Max retries (%u) exceeded. Resetting"; pending-track retry counter
  - **smapi_vli:** "SMAPI to VLI transition detected. Forcing loginZC to switch modes and clean eSDK state"; resume-VLI shortcut "already in connect mode - likely resuming VLI (e.g., after AirPlay)"; "Already logged in with same account, skipping loginZC"; TransitionAck tracking \[pos,preLogout pos,transAck\] + "Begin AwaitingTransitionAck"; "Notified we are receiving delegation. Resetting track queue info."; SWPBL-259788 pullContext skip when delegated session not playing; SMAPI mediaType/curTrkStatus/nextTrkStatus tracking
  - **accounts:** auth-token expiry detection -> refresh via upnp; "Login failed with E_SONOS_BAD_ACCOUNT"; service descriptor lookup {sid,g,sn}; "Treating auth token as expired"
  - **telemetry:** ecode mapping "error: %s ecode=%d (%s), mapped to 0x%08x"; fatal-error report rate limit ("restricting excessive fatal error reporting"/"spotify telemetry rate limit exceeded!" spotrl); underrun counter; "Radio:" prefix stripped from restart token

:::

## `spotifyzc`

**coverage** `?`

The zero-config discovery layer the Spotify Connect integration uses: events for device-added, credential transfer, and auth tokens that let a phone hand the speaker a Spotify session. How 'play on this speaker' works in the Spotify app.

::: details Technical details

- **handler:** f_1020f8c4 (GC-gated getInfo; blob transfer encrypted per gap audit)

:::

## `stream_metadata`

**coverage** `?`

The stream-metadata cache: internet-radio song titles, timed-ID3 tags, and per-stream info blocks, kept so repeated listeners don't re-parse. The memory behind 'now playing' text for radio.

::: details Technical details

- **cache:** streamingMetadataCache: "Setting metadata reference time %s at %ld"/"Rejecting invalid stream metadata reference time"; framer selection "%d (%s) framer for: %s"; "%d(%s).sd:(%s,%lld)"; mswmext=.asx sniff; sonosapi tag; "unexpected text/html"; getMediaUri %d + "URI expires in %us" + "dereferenced to: %s"; "Disallow playback of Spotify Free content from Sonos queue": free-tier gate; "%d: StartTime: %s %dms - %ums %s"

:::

## `sync`

**coverage** `?`

The synchronization machinery: locks and the coordination primitives the program's threads use to avoid corrupting shared state when many things run at once. It also covers the clock discipline deciding which clock a group follows and correcting drifters, which is why grouped audio doesn't echo.

## `upgrade`

**coverage** `?`

The firmware upgrade path: manifest fetch, compatibility checks, download-status handling, and the apply-and-reboot flow. Version gating uses a minimum-compatibility version from the household map. It's the apply-the-update half, installing a downloaded image and rebooting into it.

::: details Technical details

- **check_layer:** update-check client: "Fetching %s"/"Failure fetching (0x%x) (%d)"; fields {updateServerIP,httpResult,updateAutoCheckError,useCachedOnly,updateType}; headers X-Sonos-LatestSWGen: %u + Content-Location: %s; "Redirect detected, final URI: %s"; "UPM Invalid"; "Check for updates %s (%u)"/"Check for online update (user)"/"Unknown upgrade server state"; R_AvailableSoftwareUpdate sysprop; SWGen downgrade policy {downgradeMinVersion,downgradeRestrictions,allowDowngradeToPrevSWGen,denyDowngradeToPrevSwGenList}; "Invalid swgen member detected, swgen: 1"

:::

## `upnp_eventing`

**coverage** `?`

The classic device-control eventing machinery: the subscribe, renew, and notify plumbing behind the older event channel documented on the events page. Each subscription gets its own channel and sequence numbers so listeners can tell when they've missed an update.

::: details Technical details

; subscription-record fields {subscriptionId,renew_failures,failure_reason,active_record,network_safe,subrenew_del,subrenew_sub} + deactivation fields {DeactivationState,DeactivationTTL,DeactivationDateTime,OpenPort} + transport 'upnpovertls'

- **renew_fsm:** events {"Unsubscribe in renew ... (oos:%d seq:%d)","Successfully renewed","Failed to renew ... HTTP Result: %d; SR: %08x","Subscribe ... Port: %u; Secure Eventing: %d (srRet=%d)","Successfully subscribed ... UDN %s","Received SID %s for deleted client","Received OOS %u / %u for SID %s" (out-of-seq tracking),"Not unsubscribing because bSendUnsubscribeRequest=false"}; /status/subrenew schema <Outgoing>{<LogicalSID>,<UPnPSID>,<EventURI>,<FailureCount>,<NextRenew>,<ExpectedSeq>}; secure-eventing flag on subscribe; thread subrenew_static; renew bookkeeping distinguishes SID vs 'logical SID': 'Unsubscribe in renew %s; SID: %s, logical SID %s (oos:%d seq:%d)','Unable to find record (%s, %s, %s) after unsubscribe'/'after renew','Successfully renewed %s; SID: %s, logical SID %s','Failed to renew %s; SID: %s, Logical SID: %s; HTTP Result: %d; SR: %08x'
- **gates:** "Invalid transport: WSS is required"; "Invalid namespace: UPnP {subscribe,renew,unsubscribe} not supported"; "unexpected target id %d %s; overriding to: %s"; "Unable to retrieve the relative time."; "Rejecting unsupported replication request for %s"; "UPnP Eventing denied. 403 Forbidden returned."; Second-/%u SID form; sourceHasEventsToSend(%s) initial
- **tunneled:** tunneled UPnP "Tunneled UPnP call: %s:%s returned %d to %s:%d"/"returned 200"/"from %s:%d" + TRANSFER-ENCODING + "set LOBS = %d"; CM actions {ConnectionIDs,GetProtocolInfo,GetCurrentConnectionInfo,RcsID,AVTransportID,PeerConnectionManager,PeerConnectionID}; MS actions {ListAvailableServices,GetSessionId,ServiceId,Username,SessionId}
- **event_routes:** Complete /X/Event route inventory (0x10e761b0-0x10e7636c): /AlarmClock/Event, /AudioIn/Event, /DeviceProperties/Event, /GroupManagement/Event, /HTControl/Event, /MusicServices/Event, /SystemProperties/Event, /ZoneGroupTopology/Event, /MediaServer/ConnectionManager/Event, /MediaServer/ContentDirectory/Event, /MediaRenderer/ConnectionManager/Event, /MediaRenderer/RenderingControl/Event, /MediaRenderer/AVTransport/Event, /MediaRenderer/GroupRenderingControl/Event, /MediaRenderer/Queue/Event, /MediaRenderer/VirtualLineIn/Event -- 16 endpoints; QPlay has Control only (see qplay_protocol). Cloud mirror: every service exposes muse subscribe on v1/players/{playerId}/upnp<Svc>/subscription and renew/unsubscribe on .../subscription/{logicalSID}.
- **sender:** upnpeventing_sender.cxx: RNotificationSenderImpl/notificationSenderImpl, 'upnpeventing svc:%s', run loop 'runOnce starting'/'Notification Sender has been terminated', send-latency warn '\[warning\] wait time for %s of %lldms is greater than %lldms'

:::

## `virtual_linein`

**coverage** `?`

The virtual line-in subsystem: the machinery for audio pushed at the player by an external source, covering session management behind the VLI commands and service.

::: details Technical details

- **source_manager:** group hooks {\[groupAdded\] configureLocalTransport(VLI),\[groupRemoved\] configureLocalTransport(null),\[startLocalPBAsGM\]/\[stopLocalPBAsGM\] + proxyactive}; source lifecycle {register(vli type),suspend,resume,onSelect,deactivate(type,sender)}; "Recording State Snapshot in state %d"; "Starting vli audio input subsystem (type=%d)"/"ending vli ai subsystem (cached type=%d; new=%d)"; cookie validation {"validate cookie failed for \[%d\], \[%d\]","no source to validate cookie"}; ai_vli thread

:::

## `vli`

**coverage** `?`

The virtual-line-in umbrella: the source manager, sink, playback tracker, and control interface together. A VLI session is how a 'non-Sonos' audio source rides the group-audio fabric, getting a session ID, a transport address, and member routing like a real line-in.

::: details Technical details

- **sink:** vlintxsink "VLI NodeTX Blocks": "lTransmitOffBox is now %d \[uni=%c\]"; "NodeTx configured to handle %s audio (qos: %d)"; "delay sending new frames until resend finishes"; vli_source_manager: 'Error (0x%x) registering vli source (%d)','Failed to suspend source'/'Failed to resume source','Thread entering state %d (desired=%d)','deactivating current VLI source (type=%d)','%s - calling onSelect()','failure activating VLI source (type=%d)','deactivating current VLI source (type=%d) (sender=%d)','no source to validate cookie \[%d\]'; VliSessionProcessingCompleteEvent trace '%s:%d processing VliSessionProcessingCompleteEvent vli type %s action %s success %d flags %#x','%s:%d VliSessionProcessingCompleteEvent signaling completed rc: %d flags: %#x','%s:%d  %s:%d completion signal timed out %#x %#x!!!','%s:%d waiting for tx flags failed %#x'; protocolInfo "x-sonos-vli:*:audio:*"
- **ctrl:**
  - **callbacks:** `onVirtualLineInGetVolume`, `onVirtualLineInSessionStartInfoUpdated`, `onVirtualLineInStartSession`, `onVirtualLineInStopSession`, `onVirtualLineInSuspendSession`, `onPlaybackStateChanged`, `processSetVolume`, `onVirtualLineInNameChanged`, `onVirtualLineInMetaDataChanged`, `onVirtualLineInPlayModesChanged`
  - **events:** `VolumeSetActionEvent`, `VliVolumeProcessingCompleteEvent{vliType,success,flags}`, `VliSessionProcessingCompleteEvent{vliType,action,success,flags}`, `VliTransportAction`, `AvtHaltActionEvent`, `AvtVliActionEvent`, `GroupVolumeSetActionEvent`, `VolumeChangedEvent(vli source)`, `VliPropertiesChangedEvent{name,md,mode}`
  - **types:** `AirPlay`, `bluetooth/Bluetooth`, `tvproxy/TV Proxy`
  - **details:** cookie-based session tracking; waitOnTxBitFlagsClearedLocked; "StartSession for unusable/unknown type"; protocolInfo="x-sonos-vli:*:audio:*"; "VLIGroupIDs cannot contain commas"; completion-signal timeouts
- **link:** "Link helper created with empty VLI group ID"; "Starting to Process %s Group Info"; "Found Suspended Rooms While Processing %s Group Info"; "Finished Processing %s Group Info in %llu us"; "Ignoring player %s (too many members)"; "Link player %s to %s group %s: (ret %d)"; URI x-sonos-vli:%s:%u,%s; sources {airplay:,bluetooth:}; 16-byte hex id fmt

:::

## `wifi`

**coverage** `?`

The Wi-Fi subsystem: wireless modes including Sonos's own mesh versus ordinary infrastructure versus wired, the mode enumeration, association tracking, power save, and the settings keys that control them. The wireless-disable settings in player settings are its knobs.

::: details Technical details

- **idle_mgr:** RZPWifiIdleMgr/idlemgr: "Device set to %08x with primary chan %d code 0x%x cnt %u retry %u"; Set WifiFuncsSetIdleScan fronthaul result; reasons {AUDIO_OUT,AUDIO_IN,LOCAL_SONOSNET,NO_SONOSNET_PEERS,NO_PRIMARY,UPGRADING,HT_SWAP,UNKNOWN_ID}; WiFiIdleScanUpdateRetry; "client %s is %s with primary chan %d"
- **assoc_tracker:** CrAssoc report "Reporting CrAssoc event for %s"; metrics {mstime1/2,msnum,arpscstime,arpatt,arpscs,arpsnum,ddtime1/2,ddnum,zstime1/2,zsnum,zntime1/2,znnum,znscs,znstate}; ARP stuffing "Stuffing %s MAC to ARP table" + "ARP stuffing records are full" for associating controller; "ZGT Notification to %s is invalid event"
- **netif_poll:** DeviceNetInterfaceStateEvent + "fire event: health %s rssi %d"/"status: health %s rssi %d"; subscribe/unsubscribe polling per %s; "timeout: %s polling"

:::

## `zone_topology`

**coverage** `?`

The zone-group topology layer: the household's shared map of groups, coordinators, members, and vanished devices, kept consistent across players. It maintains the map that tracks players, rooms, and groups as they change.

::: details Technical details

; household lifecycle: discovery 'Begin discovery mode %d' + 'unexpected inbound UPnP action: uri=%.256s' reject + 'requestAllowed' gate; HHID tracking {'first household','No valid HHID','wrong household - mismatched HHID in localsetting and netsetting','Mismatch HHID','lost household - no HHID in netsetting','Lost Household','household ID changed to %s','newHHDebug','Can't report newHHDebug event', zpMetricsConfigV2.meta}

- **topology_base:**
  - **quarantine:** discovery quarantine {quarantinedCount,latestPlayerWithQuarantineEvent,stabilizationTime,latestDownloadErrorCode,latestDownloadErrorReason,quarantining}; "Report player missed by %s"/missedBy/missedPlayer; quarantineRecheck job; "Player %s removed from quarantine"
  - **wow:** satellite wake: "\[%s\] %s WoW magic packet for MAC %02X.."; "Attempted to wake %zu missing secondary ZP of primary %s (sent WoW to %zu)": bonded secondary WoW
  - **vanish_fsm:** states {active→vanished} with {byebye reason,reasonforvanish,vanishbatterypercentage,vanishbatterytemperature,timesincevanish}; "Broadcasted unresponsive device %s"; "Received 'Remove' message pointing to local device"; "VerifyThenRemoveSystemwide: Not removing, %s is present"; removeknown/hwver actions; "device %s removed from vanished list after factory reset"
  - **discovery:** handleNewOrUpdatedZP "%s found %s at %s; age: %d; addr: %s; host: %s; proxy: %s; ports={%u-%u}"; IP-change detect "ZP (%s) changed IP address from %s to %s"; link-local 169.254 guards; "Updated network hash: \[%s\] => \[%s\]"; "new bootseq"; "%s ZP %s (bootseq %u)"; X-Sonos-LatestSWGen + Content-Location headers; "Faking device %s (%s) props to be %s gc"; designated {PlayerDesignatedDevice missing required field %s}; "All devices idle for %ld s"; topmon thread
  - **wake_machinery:** Vanished-member recovery: 'Attempting to wake vanished %sZPs' -> per-MAC WoW magic packets ('\[%s\] %s WoW magic packet for MAC "%02X..%02X"'; packet key literal 'WoW_=h2zWsWuCQ'), 'Attempted to wake %zu missing secondary ZP of primary %s (sent WoW to %zu)'; probes first ('arping successful for vanished device: %s'). Async task 'wakeMissingPlayers' is scheduled/cancellable ('scheduling request for async wake missing players type %d', 'reschedule wake missing players type %d time %ld', 'async wakeMissingPlayers ran'). WakeOnLANRequestEvent types incl. 'Unexpected WakeOnLANRequestEvent type'; exit transitions 'device: %s %s removed from vanished list' (wake or factory reset) and 'expire vanished devices has completed'.
- **discovered_zp_cache:** RDiscoveredZP/RDiscoveredZPs/RVanishedZPs replicated objects: "Updating RDiscoveredZP - current group %s - previous group %s"; "applying cached changes 0x%x on top of 0x%x"; "RDiscoveredZP is not yet valid, caching SID %s change map: 0x%x" (subscription change-map cache); "Got GM info for %s (%s, %s) in group %s (%s)"; device-desc dd_{mhh,sn,md,bld,in_hh,in_ver} + isHtap:%d; version-gated eventing "DiscoveredZP version=%u.%u.%u, using %s eventing" (secure\|insecure); "got discovery packet from another subnet -- mask: %x"; "detected/un-detected 3rd party extender: %s != %s"; vanish reasons {LOW BATTERY,EXPIRED} + " (wakeable)"
- **ht_satellite_ops:**
  - **add:** AddHTSatellite: precheck {"unable to become satellite, device has satellites","Primary device %s is not found","incompatible primary device %s"}; "Change from ZP to Sat mode. Map: %s"; clears SOURCE+local sonar config; sendGroupAddHTSatelliteCmd via DeviceProperties:1; joinZone cmd; "HT Zone setup (%u) via %s took %ld ms"; sat-state sync "upd \[%zu\], remote uuid: %s, remote state: %d"/"chk \[%zu\] ... my state %d"/"players ready: %d, map size: %d"; netstartd notify; "Push satellite state to UUID %s"; op dispatch 'adding addht op to sat %s'; reboot-driven role flip 'Restart to change from ZP to Sat of %s'/'Restart to change from Sat to ZP'; 'Unable fetch HTAP setting from primary UUID, setting could be wrong' fallback; 'Unable to change wifi settings and initiate reboot'
  - **remove:** RemoveHTSatellite: clears RoomCalibration on satellite (per-sat + SATELLITE-of-SUB paths) + local sonar; "Change from Sat map %s to Sat map %s"/"Change from Sat to ZP mode"; "RemoveHTSat: error %d sending to Sat"; "HT Sat %s removal (%u) via %s took %ld ms"
  - **reconnect:** reconnectHTSatellites {master,oldmap,failmap,recoverSat,recovery,satellite roles}: "reconnected Sat %s"/"retry in 10 secs as topology hasn't settled"/"removing Sat"/"separating from HT primary"; restarts on ZP↔Sat transitions
  - **bonded:** AddBondedZone: EnterConfigMode→satellites→joinZone→ExitConfigMode + unlink failure "Unable to unlink secondary"; RemoveBondedZones: "Stop topology monitor: zone teardown" + "Zone teardown (%u) via %s took %ld ms"; setAVTransportURIOnSecondaries + "Pushing bonded zone state to secondaries failed"
- **bonded_recovery:** recoverBondedZone: consist checks {"(Secondary doesn't see same topology)","(all members present)","(member missing)"}; granularities {full state,EQ only}; FSM {"retrying as topology hasn't settled (ct=%u)","successful %s; %s sent to secondaries","partner is incompatible","hard failure: %d","separating this player from bonded zone","reducing bonded zone to %s"}; roles {isPrimary,availmap,newmap,othermap}; orphan regroup {"regrouping with orphaned secondary","Delegating coordination to self"}; unstick/restick sonar clears; telemetry bondedZoneChange {trigger,opDurationMs,bondDurationS,usedMuseAPI,prevChannelMapSet,prevPrimary,wasPrimary}
- **event_vocabulary:** `TopologyEventsReportEvent`, `TopologyGroupMemberRemovedEvent`, `InfoUpdatedEvent`, `ActiveZonesChangedEvent`, `RemoteConnectionTypeChangedEvent`, `GroupChangedEvent`, `VliTransportActionEvent`, `NewZPEvent`, `ReplicatedSettingsNeedsUpdateEvent`, `MissingBondedZoneMemberDetectedEvent`, `AVTStateLastChangedEvent`, `RemoteHTSwapStateChangedEvent`, `DeviceGoneEvt`, `GroupAdvertiseRequestEvent`, `DesignatedDeviceChangedEvent`, `Account changed event`, `ThirdPartyMediaServersX`, `AlarmRunSequence`
- **iface_ops:** `setLocalSonarCalibrationID`, `informLocalNewSourceAreaIds`, `getGroupMembersWithDifferentVirtualLineInGroupID`, `getLocalOrientation`, `setLocalSonarState`, `internalPopulateSonarZoneDescription`, `isBondedZoneConsistent`, `ifBondedZoneGetNextUUID`, `ifBondedZoneGetNextUUIDInTopology`, `ifBondedZoneGetPartnerUUIDInTopology`, `getLocalChannelName`, `hasSurrounds`, `sonarZoneAgreesOnCalibration`, `informLocalVoiceStateChange`, `informLocalMicStateChange`, `informLocalTVConfigStateChange`, `informLocalAirPlay`, `informLocalOrientation`, `setLocalTransportStateChanged`, `informLocalPlayerZPChange`
- **zp_events:** `LocalIpChangedEvent`, `RequestTVTransitionEvent`, `WakeOnLANRequestEvent`, `PortableWifiReconnectEvent`, `PlaybackCorrelationEvt`, `HouseholdSettingsChangeEvent`, `TVInputSelectedEvent`, `ZonePlayerConfigurationEvent`, `SystemPropertiesChangeEvent`, `CloudConnectionChangedEvent`, `NewCertRegistrationEvent`, `RegCertUpdateEvent`, `VoiceAccountTransactionEvent`, `SecureRegistrationStateUpdateEvent`, `PlaybackStateChangedEvent`, `RemoteHTSwapStateChangedEvent(source,swap active,are we satellite)`
- **events:** {TopologyEventsReportEvent,TopologyGroupMemberRemovedEvent,InfoUpdatedEvent,ActiveZonesChangedEvent,RemoteConnectionTypeChangedEvent,GroupChangedEvent,VliTransportActionEvent,NewZPEvent,ReplicatedSettingsNeedsUpdateEvent,MissingBondedZoneMemberDetectedEvent,AVTStateLastChangedEvent,RemoteHTSwapStateChangedEvent,DeviceGoneEvt,GroupAdvertiseRequestEvent,DesignatedDeviceChangedEvent,Account changed event,MusicAccountChangedEvent,NewMuseHHIDEvent,NewLocationIdEvent,AreasVersionChangedEvent}
- **internals:** sonar ops {setLocalSonarCalibrationID,setLocalSonarState,internalPopulateSonarZoneDescription,sonarZoneAgreesOnCalibration,informLocalNewSourceAreaIds,getGroupMembersWithDifferentVirtualLineInGroupID,getLocalOrientation,getLocalChannelName,hasSurrounds}; bonded ops {isBondedZoneConsistent,ifBondedZoneGetNextUUID,ifBondedZoneGetNextUUIDInTopology,ifBondedZoneGetPartnerUUIDInTopology}; informs {informLocalVoiceStateChange,informLocalMicStateChange,informLocalTVConfigStateChange,informLocalAirPlay,informLocalOrientation,setLocalTransportStateChanged,informLocalPlayerZPChange}; desc fmt {"Single Zone Description: {%s, %s, %d}","Zone Description: {%s, %s, %s, %d}"}; consistency {"HT & Sat have inconsistent maps","Bonded zone maps not consistent","topology state error, type: %s, pid: %s, pid count: %d, gid: %s, gid count: %d","Topology state not consistent\[retrying\]","%s %s linkage broken: Local gID: %s; Other gID: %s"}; satellite {"addSatellite() %s sat %s with map: %s","removeHTSatellite() Disable HT sat %s","separateBondedZoneKeepPlaying: failed to remove bonded zone through primary %d, removing locally","Enable HT","tried to add incompatible","couldn't determine AVT control URI of coordinator %s"}; monitor {monitorTimeout,monitorUUIDMismatch,"TopologyMonitorProbe - Invalid args","Probed wrong device (IP mismatch?)","Topology monitor: purge unresponsive ZP %s (%d)","STRIKE %u for %s (res:%d val:%d)"}; defunct {"handleDefunctMediaServer %s","handleDefunctZP %s reason '%s' IGNORED from MDNS - discovered by SSDP","IGNORED from SSDP - discovered by MDNS but not SSDP","%s uuid %s not local or was not found",PRESENT,MISSING}; notify {"handled notify of SID %s for %s on %s (changedMap: 0x%x)","checking notify of SID %s for %s (last handled: %u)","could not find zp to handle notify; ingress uuid %s","Setting orientation (%s) for %s (%s)"}; "Authorization Check for WMP failed: control URI: %s UUID: %s res: %hu"; "Unexpected local UUID provided to RDeviceTopology::%s"; "Became idle: %ld(B)"/"Became active"; {ThirdPartyMediaServersX,AlarmRunSequence,R_ShowRhapUPnP,R_ShowNSSServers,VerifyThenRemoveSystemwide,hh-upgrade,uploadDesignatedDeviceReport,RDeviceTopology}
- **member_ops_detail:** AddMember guards: 'Rejecting AddMember: GC or new member is an ungroupable player (gcUUID=%s memberID=%s)', 'Adding member to satellite is not supported', 'Unable to retrieve invisibility/node proto compatibility for %s', 'Adding member %s with bootseq %u failed - out-of-sync GM', 'Adding member %s that already exists', 'Adding member %s %s; tx: %s ret=%u'. RemoveMember: 'failed (not a member before?)', 'Removing member %s %s; ret=%u', TopologyGroupMemberRemovedEvent '%s is no longer our group member'. Coordinator handoff: 'delaying delegation by %d ms', BecomeGroupCoordinator{,AndSource} on %s%s %s, 'delegating with member list %s new gc %s', 'forcing member %s to be standalone', 'configure group %d: fd=%d bgc=%d dgc=%d c=%s oc=%s' (fd/bgc/dgc flags + coord/old-coord), 'Changing coordinator to %s; start topology monitor', 'ChangeCoordinator for %s (%s) failed %d', 'Failed to build groups response'. CHSRC req '%s: valid spCHSRC must be provided'; 'localConfigureGroup(): using local VLI txs'. VLI session end -> 'vli session end evt type: %d succeeded: %d' -> VliSessionProcessingCompleteEvent; 'async processVliSessionEndedEvt task' + scheduler fallback.
- **snapshot_reconcile:** Household snapshot reconciliation: 'found the gc \[%s, %s, %s\]', '\[snapshot\] discovered \[%s\]', '\[snapshot\] duplicate gc\'s \[%s, %s\] for group \[%s\]', '\[snapshot\] duplicate player id \[%s\]', '\[snapshot\] ignoring \[%s\]', '\[snapshot\] target not found in household \[%s\]', '\[snapshot\] failed to build target list from topology', '\[snapshot\] Topology snapshot failed, invalid topology', 'found group target \[%s, %s, %s\]': reconciles incoming household snapshots against local topology with dup-GC/dup-player guards
- **notes:**
  - **code_805_topology:** 805 in f_10747624 ("lookup of %s URIs for %s failed") = URI-lookup failure inside the topology monitor verify-then-remove probe f_10747b74 (TopologyMonitorProbe/VerifyThenRemoveSystemwide, "Removed %s device %s by action %s error %hu") - internal rc logged via error %hu, NOT the favorites-cap 805; same literal, unrelated domain

:::
