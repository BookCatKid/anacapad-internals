# Non-SOAP subsystems

Self-contained protocols/engines living in the same binary beside or below the UPnP layer. `absent` = no coverage, `vocab` = names/strings catalogued but semantics undecoded, `partial` = some real documentation exists. Evidence addresses are the rodata anchor strings.

| Subsystem | Coverage | Summary |
|---|---|---|
| `ab_experiments` | **partial** | production A/B experiment framework: a /experiments local endpoint plus a replicated <ZoneExperiments> store of <ZoneExperiment id name value defaultValue> rows; presence gated by featureConfigZoneExperiment; values influence runtime policy |
| `account_cert_lifecycle` | **partial** | three cert managers (certmanager/devicecertmanager/regdevicecert) over four keycert identities; the registration cert carries the device's SonosID and is required for token generation ('sr: reg cert not available; cannot generate token'); a /regcert status endpoint exposes DeviceCertInfo XML; root-of-trust bundles are fetched from /certbundles/v4/trusted_roots.rcb with ETag caching and retry backoff |
| `audio_taps` | **partial** | PCM-capture tap subsystem (audiotap_manager.cxx + datatap.cxx): guarded /audio_tap /spdiftap /snapshotspdiftap /downloadspdiftap endpoints, versioned tap-file format with audio+metadata sections, SPDIF tap used to sync TV-input playback against the output tap |
| `business_msp` | **partial** | Sonos-for-Business managed-service machinery: SOAP ops AddRemoveSonosBusinessMSP / Sync Sonos Business MSP / AddRemoveSfbMSP, /msprox + /msprox?uuid= proxy endpoints, three tier vocabulary (SFB_COMMERCIAL/ESSENTIALS/PREMIUM_MSP + commercial/essentials/premium-msp slugs), Backgrounds MSP add/remove, enableRemoveMSPCredentialsFromUPnP flag, voice-service MSP education keys (O_AMAZON/GOOGLE_SHOW_MSP_EDUCATION) |
| `buttons_ir` | **partial** | button + IR input pipeline: hw-message BUTTON multicast group carries events, longpress.cxx handles holds, events forward to the group coordinator ('Forwarding button events'), /button_triggered\[.xml\] diagnostic capture, /rdmbuttonfwd retail hook, virtualRemoteControl/buttonCommand muse route injects button presses from the cloud; irdecoder.cxx learns TV-remote codes against the ir.ws.sonos.com database |
| `chirp` | **partial** | /code/chirp-core/source/{core,dsp,maths}/src/** paths in rodata 0x10fd0188-0x10fd4c74 |
| `chirp_stack` | **partial** | embedded chirp-core 4.2.1_7265 acoustic data-over-audio SDK with a custom 'sonos-cdma' profile: used for room detection during setup — muse routes roomDetection/chirp (start/stop signalling with {playId}), DSP-routed audio streams as-dspin-ext-chirp/as-dspout-ext-chirp, a per-device unique payload ('Start chirping with unique device value:%d') and calibrated output volume ('Chirp volume not yet calibrated') |
| `cloud_queue` | **partial** | the Cloud Queue subsystem: a music service hands the player a queueBaseUrl ending in a SemVer API version (validated: 'path must end with a cloud queue version', 'Cloud Queue API v%u is unknown; use v%u with this player'), then the player pages itemWindows over it: loadCloudQueue, loadCloudQueueWithWindow ('Full itemWindow from the Cloud Queue API must be passed'), refreshCloudQueue, skipToItemWithWindow — all as muse routes on playbackSessions/{sessionId} |
| `cloud_synchronizer` | **partial** | cloud_synchronizer thread: registerServices (max-count abort, called-once guard), "received JIT event", "discarding %s type %d" |
| `dev_disc` | **partial** | devdiscthr/ddthrd.cxx: rx logging "%s - rx MSEARCH %s from %s:%d (%zd %d %d)", "%s - rx %s ALIVE %s %s %d %u %s (%zd)", "%s - rx %s BYEBYE %s", "%s - rx CDALIVE %s %s %d", "%s - rx CDBYEBYE %s", "rx  QUARANTINE_RECHECK %s"; "%s - %u SSDP messages lost"; zp byebye; "ddt hint:%d"; "Finished working on type %d" |
| `device_unlock` | **partial** | developer/manufacturing unlock surface: /unlock, /devunlock, /mfgunlock and /unlock.htm endpoints write /tmp/device_unlocked_flag; unlocks are rate-limited ('Too Many Unlocks' HTML page) and DevUnlock reboots the player; RdeviceIsUnlocked and RabortIfUnlocked let self-tests detect and refuse to run on unlocked units; 'unlockedBld' marks the build state |
| `dsp_ht_engine` | **partial** | home-theatre DSP parameter surface + per-zone audio state schemas fully recovered: HT config XML (surround/sub/downmix/dialog/AI-speech/height levels, autoplay/autostop thresholds, Tweaks bitmask), 37-field per-Zone audio XML, zone volume/duck XML; R_MASK_* speaker layouts enumerate supported channel masks |
| `embedded_sqlite` | **partial** | embedded libsqlite3 (sqlite3_open_v2/prepare_v2/step/bind_*/column_*/exec/busy_timeout) backs LocalTimer persistence in timer.db — the alarm/sleep-timer store; two tables with full DDL recovered verbatim \| proven tables (timers_impl.cxx): timers(id TEXT PRIMARY KEY, trigger_time TEXT NOT NULL, total_duration INTEGER NOT NULL, triggered NUMERIC NOT NULL) — local/suspend timers (timers_impl.cxx) \| suspend model: pause -> row in paused_timers w/ remaining_seconds+paused_utc_time; resume -> recompute trigger_time \| libFLAC embedded codec: reference libFLAC 1.3.4 20220220 |
| `entitlements` | **partial** | entitlements manager with cloud fetch + local cache, muse-subscribed change events, and a runtime policy hook (RRuntimeZPPolicy takes entitlementsMgr); typed SKU records decide e.g. whether Sonos Radio is preinstalled |
| `factory_reset` | **partial** | factory reset machinery: a 'Factory Reset'/'Remote factory reset' CSRF-posted confirm form, /jffs/factoryReset.txt marker file ('unable to create factory reset file.', 'factory reset had errors', ': not factory reset'), LED_MODE_FACTORY_RESET pattern, sonosFactoryResetFull entry point, household-wide consequence ('device: %s %s removed from vanished list after factory reset'), and 'Invalid system settings (%s), resetting to factory defaults' as a self-heal path; muse route management/factoryReset can trigger it remotely |
| `favourites_model` | **partial** | Sonos favourites store + ContentDirectory projection: FV:2 root container paired with FavoritesUpdateID; XML store schema recovered; mutation via CDS CreateObject/UpdateObject/DestroyObject on the dirObjFavorites vtable + muse getFavorites/loadFavorite routes |
| `fdevent` | **partial** | ops {removeFd,waitForEvent}; thread names fdevent.{signal.write,wait.poll,check.poll,reset.read}; EventSync %s; epoll_create1/epoll_ctl/epoll_wait error paths; fd capacity bound "%d already monitored"/"exceeded the fd capacity of %d" |
| `feature_config` | **partial** | GET /features/v1/config? (cache-control: no-cache); files cloudconfig.json/cloudconfig_override.json with {swVersion,hwVersion}; precedence: override > cloud-cached > cloud-persisted; "failed to fetch config: not securely registered"; "Already have fresh data. Skipping Fetch."; "failed to connect. rescheduling in 1 hour"; stale markers; FCS Cache via g_pZone |
| `feature_flag_registry` | **partial** | complete compile-time feature/config flag vocabulary (48 keys): featureConfig* family keys in the cloud-config JSON doc plus enable*/disable* booleans read at init — the build's feature map showing which subsystems are switchable |
| `group_object_model` | **partial** | zone grouping internals: bonded-role enum (HT_BONDED_MASTER/SATELLITE, UNBONDED_DEVICE, stereo-pair/sub combos), coordinator ops (BecomeGroupCoordinator\[AndSource\] with GC-state cloning + VLI delegation, ChangeCoordinator, DelegatedGroupCoordinatorID), topology monitor with settle-retry, satellite lifecycle (Add/RemoveHTSatellite, recoverBondedZone FSM), per-satellite DSP protobuf + tuning push |
| `household_settings` | **partial** | file householdsettings.json {fileVersion,fileSchemaVersion,householdSettings}; JSON \[{version,lastUpdateDevice},\[{name:"restricted-admin",readPermission:null,writePermission:"hh-config-admin",settings:\[{explicitContentFiltering,recentlyPlayed}\]}\]\]; categories {restricted-admin,protected-admin,protected}; frozen:1 marker; "File upgraded to v%d schema"/"File overwritten due to invalid setting"; UMTracking→userMetricsTracking migration; "version incremented after invalid settings offered"; hhSwgenState swgen must be >= player; /householdsettings.json status-page ALERT |
| `ibt_plans` | **partial** | a remote-management command executor: commands named in log domain 'ibt' are compiled into 'plans' (a generated target list — 'failed to generate target list for command (%s)'), then dispatched per-target with per-target results ('\[dispatch\] dispatched (%s) to target (%s), result \[%s\]'); gated by the enablePitchfork feature flag checked at init |
| `ir_decoder` | **partial** | irdecoder.cxx: selthrd.RIRDecoder.{reset,data,except,timeout}; debouncer FSM (recent/bIsRepeat, playing/not-playing -> auto play); actions vol_up,vol_down,IR Mute,IR Input + testpoint press; decode via histogram peak detection (avgA/avgB/threshold) then pulse-width OR pulse-distance OR biphase; "Short Code not recognized"/"unrecognized %d"; read "ir: %d length: %d","IR Event read: %zd, msgcount: %u" |
| `ir_learn` | **partial** | htaudio.cxx IR subsystem: code lists vol_up_codes/vol_down_codes/vol_mute_codes/input_codes (bounded); learn FSM passes{1,3} redundancy checks "first and third passes have different sizes"/"don't match"; repeat styles {alternating,repeating,non-repeating}; one-button learn with timeout (UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND); config /opt/ir/irconfig.txt; cloud database http://ir.ws.sonos.com/IRCode/ — submit <IRCode><code><value><guid> XML (guid from //dev//urandom), query "Requesting: %s" -> "Code found for remote id \[%s\]"; embedded remote-name table {Sharp,LG/Haier L32D1120,Samsung,Panasonic,Toshiba,Mitsubishi,Philips,Pioneer,Dynex,RCA 46LA45RQ,Orion SLED3280,Mitsubishi WD-65638/60738,JVC JLC42BC3000/LT-19E610,Seiki LC-32B56,SuperSonic SC-240/491,ViewSonic VT4210LED/VT3205LED,Loewe}; "Denylisted pyle!"; "Outstanding codes yet to be learned: Lengths are: %d, %d, %d" |
| `lechmere_wss` | **partial** | lechmere.cxx cloud channel: RFC6455 WSS to lechmere.<env>.ws.sonos.com, negotiated subprotocol 'lechmere.<version>' (lechmere-v1 observed), inner TLV header layer ('failed to read lechmere header'), policy-key auth, app-level ping keepalive with 'TOO_MANY_UNACKED_PINGS' disconnect, and a full close-reason taxonomy driving reconnect decisions |
| `led_engine` | **partial** | Scripted LED animation engine: <LedPatternInfo> docs hold <LedPatternEntry time led_ids repeats steps> programs of <LedStepEntry rgb hold fade> steps, serialized with cksum+flags; R_LED_* codes select the default pattern; SetLEDState toggles the user-visible on/off only |
| `log_domain_map` | **partial** | 21 anacapa.*.log sinks under /opt/log define the module boundaries; plus sibling-daemon logs and the /tmp/memorylog ring |
| `media_player_abstraction` | **partial** | source plug-in layer under AVTransport: media_player_mgr + media_player_autoplay + media_player_vli_ctrl + extaudiosrc + ai_impl_base define the source vtable; autoplay system (StartAutoplay, AutoplayRoomUUID, AutoplayVolume, linked-zones expansion, silence thresholds, alarm/buzzer fallback) routes line-in/TV/Spotify-VLI sources to the coordinator; htaudio_autoplay.cxx handles TV autoplay; ChirpExtAudioSrc plugs acoustic input in as an ext source |
| `media_player_mgr` | **partial** | actor model: target key {uuid,ix,port,ssl,mtls} (overlap check); "found actor for %s"/"found backup for %s"/"%s target \[%s\] for type %d resolved to %s"/"no actor available"; lifecycle register/create/shutdown; per-player config dir + anacapa_logger.toml; /localsettings.txt; Player%s naming |
| `model_sku_vocabulary` | **partial** | 51 ZPSnn model identifiers enumerated in the capability-conditional table: ZPS{1,3,5,6,9,11-24,26-46,48,49,51-59,61}; capability gating is per-model-ID |
| `mpegts_id3` | **partial** | TS parse: PAT/PMT PIDs, sectlen/desclen/silen, stype (Unsupported stream type), eslen, "No audio PID"/"Audio PID is 0x%x", "non-audio and non-timed_id3 PID", PTS, peslen/payload; timed-ID3v2 extraction: tag footer detect, "Ignoring too large timed ID3 size", OOB guards, "unsupported mp3 segment" |
| `multi_daemon_boundary` | **partial** | anacapad coordinates ~13 sibling daemons over /X-external HTTP routes + /tmp/netstartd.ipc: netstartd gets netsettings/PSK pushes and satellite notifications, reports connection-type updates back; per-daemon crash machinery (.dmp/.properties/_backtrace/count files) and /opt/log sinks \| netstartd client side (ipc_msg.cxx region): connect.sendMessageLocked hello handshake; performReset-triggered reconnect; deferral "Deferring IPC reconnect"; timeout "attempting reconnect (retries=%u)"; "Bad IPC message received (%d %d %d)"; transport threads selthrd.RIPCHandler.{reset,data,except,timeout}; control msgs "Disabling/Enabling networking","Signaling start/end of network connectivity test" |
| `muse_semantics` | **partial** | the muse API is the real product surface: 525 route strings, organized as households(282)/players(176)/groups(46)/playbackSessions(12)/users/devices/services namespaces; every SOAP service is mirrored as an upnp* proxy namespace; native resources cover settings, playback, hardwareStatus, positioning, homeTheater, pinewood, zones, authorization, timers, virtualLineIn, playerVolume, trueroom, trueplay, playlists, musicServiceAccounts, voice, systemReporting, localContentLibrary, networkTest, alarms, diagnostics, groupVolume |
| `play_history` | **partial** | historymgr.cxx play-history pipeline: TrackPlayRecorder/TrackPlayMonitor capture plays, entries buffered and POSTed to the household history API with completeness gating + buffer-full drops; getHistory is ETag-cached; deleteHistory/removeHistoryItem/clearHistory ops; ratings via playbackMetadata/ratings — explicitly 'only implemented for cloud queue' |
| `playlist_parsers` | **partial** | iterate{ASX,M3U,WLP,PLS}PlayList; ASX <ref href= + entryref; linkUrl= extraction ("found linkUrl"); Post-stream readData dump {bytesLeft,len,buf} |
| `qplay` | **partial** | QPlay:2 X_QPlay_SoftwareCapability xmlns:qq=tencent.com in device description; #QPLAY_SUPPORT# placeholder; action QPlayAuth; updateSharedTQPlayMode; no seed/code exchange or control channel found — stub-grade support |
| `qplay_protocol` | **partial** | Tencent QPlay support: /QPlay/Control SOAP endpoint (no matching /QPlay/Event route — the only service missing its event pair), a QPlayAuth action taking Seed/Code/MID/DID arguments (seed→code auth handshake: controller sends Seed, device answers with a Code computed from MID machine-id and DID device-id), a shared-T QPlay mode with context restrictions ('Calling updateSharedTQPlayMode in bad context!'), compile flag #QPLAY_SUPPORT#, and the device-description capability <qq:X_QPlay_SoftwareCapability>QPlay:2</qq:X_QPlay_SoftwareCapability> |
| `queue_persistence` | **partial** | .rsq on-disk queue format: savedqueues.rsq is a <SavedQueues LastUpdateDevice Version Next> XML doc of <SavedQueue Id Curated NumTracks> elements each holding <Track URI= MD=> entries; live queue persists as trackqueue.rsq; atomic write via .tmp rename + .d.rsq backup; validated at boot and on replication receipt |
| `runtime_flag_files` | **partial** | runtime state is driven by sentinel files: /tmp flags (device_unlocked_flag, brokendevice, wifidisabled, htdocs_locked, crashed_play_state, anacapa-has-run, fresh_hh.txt, anacapa_prevent_crashdump_upload, sonosConcurrencyUnrecoverableError), /var/run mode files (wac_mode, netstart_mode, netmanager_extender_flags, systemtimeoffset), /tmp/memorylog 4-file ring + .old copy, /tmp/smb/ mount workspace, /tmp/backtrace + diagstdout/diagstdin diag scratch, /tmp/event_preserve + event_reporter_v3 buffers |
| `scrobbler` | **partial** | Audioscrobbler/Last.fm submission client implementing protocol 1.2 over raw sockets: GET handshake to post.audioscrobbler.com, form-encoded scrobble POSTs, BADTIME Date-header recovery, OK-response check; also embeds ws.audioscrobbler.com/2.0 for the newer API |
| `semisleep_power` | **partial** | low-power 'SemiSleep' suspend/resume: gated by featureConfigSemiSleep/enableSemiSleep + semiSleepConfig cloud config; 'Supported only on suspendable devices' capability check; suspends VLI sessions (onVirtualLineInSuspendSession, AHA_SUSPEND_VLI_SESSION, SUSPEND_SESSION op), playback sessions (muse playbackSession/suspend verb), cloud queue (during snooze/alarm), and local timers track suspend ('considering suspend'); group topology marks suspended members ('Found Suspended Rooms While Processing %s Group Info') \| Local timers (timers_impl.cxx / MuseTimerImpl): ops set/set-duration/set-relative-duration/create/delete/pause-delete/pause/resume each log "...(considering suspend) %s" on failure - suspend gates every timer mutation; timers persist across suspend in SQLite table timers(id TEXT PK, trigger_time TEXT, total_duration INTEGER, triggered NUMERIC) @0x10edcf88; "Unable to remove time on a ringing timer" guards firing timers. \| Pause persistence: paused_timers(id PK, remaining_seconds, paused_utc_time, total_duration) @0x10edd018 — parked timers survive suspend; resume recomputes. |
| `settings_replication` | **partial** | the household replication bus: per-setting transfers ('replicateOne from %s to %s setting %u version %u') with a version+format negotiation ('deciding whether to accept replicated list from: %s; ver: %u format: %u'); per-setting denylisting on badFormat/badEncoding; a separate player-level quarantine subsystem enforcing admission policy (HTTPS required, known user, secure reg required) with scheduled rechecks; suppressed while unregistered |
| `signal_source` | **partial** | errors "invalid playId"/"failed to stop signal"/"incorrect playId"/"nothing is currently playing"/"couldn't create an audio stream"/"only one signal can run at any given time"/"invalid channel"/"disallowed by policy"; channelNumber param |
| `sntp_server` | **partial** | Dual-mode SNTP stack (sntp.cxx client + sntpsrv.cxx server + sntppoll.cxx poller): players sync from *.sonostime.pool.ntp.org or the group coordinator, one player hosts an SNTP server for the household ('Starting SNTP server switch'), and SNTP validity gates synchronized playback scheduling |
| `sound_swap` | **partial** | sound_swap/audio_swap; queue audioSwapEventQueue + progress audioSwapProgress; behaviors SWAP_BEHAVIOR_{DO_NOTHING,PUSH_SWAP,PULL_SWAP,UNDEFINED}; push/pull disband target\|initiator group; HTSatelliteChecker gates (isFound,isHTSat,playerUDN,HTPrimaryUDN + topology/group-props/GC-AVT lookups); FSM "New state: %i"/"Event %i not handled in state %i"/transition-failure -> reset; result fields {swapResult,swapType,swapTarget,swapGC,initAction,candCount,respCount}; gates {bonded zone,HT Satellite,unknown state,unswappable audio,already in progress}; muse calls museCmdSetGroupMembers/museCmdModifyGroupMembers via groups/%s/groups/modifyGroupMembers |
| `spotify_esdk` | **partial** | embedded Spotify eSDK (libspotify-derivative) plus a Connect layer: local /spotifyzc endpoint answers Spotify zeroconf getInfo (only the group coordinator answers — 'Non-GC returning 404 from getInfo'), account transfer arrives as an encrypted zeroconf blob ('Decrypting ZeroConf blob failed'), and the player registers on Spotify's hwptp hermes channel (hm://hwptp/v1/devices, hm://hwptp/v2/resolve/%s/%d/%s) to receive Connect commands ('Got unknown command from HWPTP: %s') |
| `stream_fetcher` | **partial** | notifyFrame ty:%d ln:%zu so:%zu ns:%zu f:%u ctx:%u:%u:%llu; getContentKey (encrypted HLS); "New bitrate: %d, Old bitrate: %d" adaptive switch; playlist FSM {"Timed out looking for playlist","Playlist failure with no time to recover (%ld buffer)","fetch empty","Too many empty playlists and no audio left"/"(still %ldms ahead)","Switching source due to empty playlists","end of static list","Unable to select another DS"/"waiting to fetch new playlist"}; "Startup ahead: %ld"; "URIs for %g seconds, wake up in %d"; "prebuffering %u bytes within %ld msec"; open fmt "open: %s (0x%x) %d len %llu offset %llu"; "stopping decoding while sleeping" |
| `telemetry_submission` | **partial** | telemetry/diagnostics uplink: 'Telemetry 1.0 Event field' format, X-Sonos-MessageType: product-data-telemetry header, zonereportmgr.cxx zone reports, submitDiagnostics/submitQueuedDiagnostic pipeline with manifest submission, positioning telemetry level route, per-feature telemetry flags |
| `testenv_environment` | **partial** | POST /testenv switches the player's cloud environment between PROD, PERF, STAGE, TEST and INT, with an optional OnlineUpdateBaseURL override; the page displays the six resolved API bases (Cloud, Service catalog, System, Transfero, Metrics, Update) and CustomerId; the change replicates household-wide ('may take up to 120 seconds ... to replicate throughout household') and logs 'Setting cloud env to %s' |
| `track_play_monitor` | **partial** | per-track log entries {Track Or Station URI,Extra Md,Context URI,CQ Auth Token,SMAPI Device Id,CloudQueueVersion,CQ Context Version,CQ Playback Id,API Key,Framer Name}; play line "%s play time %fs @%d.%06d (pkt:%u,act:0x%x,off:%lld%s,err:%u,uri:%s)"; segments "seg start @ %d.%06d (packetId: %u), end ..."; PlaybackId remap; string-pool bounded (pool %d%% full, "Resetting due to no free RTrackLogEntries"); states In progress/Final/LSE; selthrd.RTrackPlayMonitor thread |
| `trueplay_tuning` | **partial** | Trueplay room tuning stack: muse routes for discovery/presence/config/status (+setSelfTruePlay, resetDetectedSpeaker), x-rincon-sonarcal: OGG test-tone URIs played through the streamer (leader/testtone/complete_ht), versioned Trueplay SDK with compat fallback, etag-synced spectral/spatial tuning assets, per-driver RoomCalDelay params, satellite propagation via SetRoomCalibrationStatus, SelfTrueplay variant |
| `update_machinery` | **partial** | manifest-driven update pipeline: update_manifest carries a base update URL + per-device target rows (udn, model, submodel, swgen, ver, URI, updateID) and a min auto-update version; user updates run manifest-download -> checkDevicesToUpdate -> launchUpdate; auto-update policy gated by R_AutoUpdatePolicy + R_CheckUpdateInterval + R_AutoUpdateWindowStart + autoUpdatesEnabled |
| `usage_metrics` | **partial** | <UsageMetrics><ver>2</ver> + <ucs>/<uc> records {ms_cdctrluri,ms_regctrluri,ms_croot,ms_fn} posted to submit.aspx under /HRMetrics/; cfg fetches {pollInterval.htm,wifiTxRateThreshold.htm,wifiLatencyThreshold.htm}?hhid=%s; wifi counters {ath%u,rxPrr,beacon_flags,datarx,secdrp,roaming,trf2g,trf5g,trg2g,trg5g,tbtm2g,tbtm5g,rfail,q*_nbf,q*_cmp,q*_bpk,q*_ltc,hwstat,rxbhs,rxhang,rxfMax,rxcMax,txfMax,bprowar,gtkfm,gtkfc,nogcfc,links}; per-AP "MAC/rssiF/rssiT/PktMin/PER" + "BSSID/perAP/rssiAP"; "Audio-drop ... include with future periodic submission" + rate-limit; WD daily write; CPUTempHist <temperatures>; unlocked/hw_warn/hw_fault flags; usageDataSharing optin |
| `wac_mode` | **partial** | WiFi Accessory Config (WAC) setup mode: state lives in /var/run/wac_mode (parsed int, 'Unknown WAC mode %d') with enabled/disabled/timeout transitions; driven by netstartd via /tmp/netstartd.ipc ('WAC mode enabled/disabled/timeout', 'In setup mode', 'Netstart SSID set/clear'); LED goes to R_LED_WAC mode \| netstartd IPC drives WAC: dispatcher f_10691034 msg ids 35/36=WAC disabled/enabled, 37/39/41=WAC timeout cluster; ids 42/46/47=setup-mode enter/setup start/stop. |
| `wmp_provider` | **partial** | WMP NSS /WMPNSSv browse/search; caps {SCPA,SCPB,SCPI}; search grammar 'upnp:class derivedfrom "object.item.audioItem" and @refID exists false' + container class specs {person.musicArtist,album.musicAlbum,genre.musicGenre,playlistContainer}; sort/filter "+upnp:album,+upnp:originalTrackNumber,+dc:title" + microsoft:{artistAlbumArtist,artistPerformer,authorComposer} + upnp:genre + "1+upnp:originalTrackNumber"; field set dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber; rincon md ns urn:schemas-rinconnetworks-com:metadata-1-0/\|otherArtist; albumArt via %s?albumArt=true and /getaa?m=1&u=%s; "URI already has a serial number"/"not enough room for account ID" |
| `ws_client` | **partial** | client handshake {Location,Upgrade: websocket,Connection: Upgrade,Sec-WebSocket-Accept,Sec-WebSocket-Extensions}; "failing connection due to unsolicited per msg deflate"; per-msg deflate only before open; openSession retry; nonce gen/encode; {"disconnectedReason":"%s"}; close codes on close frame; LoadBalancerHost/WebsocketServerHost; reasons {NEW_IP,BLUETOOTH,POWERED_OFF,UPGRADE,NEW_SSID,SLEEPING,RECONNECT}; threads wsc_mtx/wsc_smtx/wsc_cond |
| `alarm_clock` | **?** |  |
| `autoplay` | **?** |  |
| `cert` | **?** |  |
| `chsnk` | **?** |  |
| `chsrc_chsnk` | **substantially decoded** | chsrc.cxx (0x10ea8620-0x10ea95dc) = channel SOURCE: the playback engine producing framed audio for the group. chsnk.cxx (0x10eb5400-0x10eb6148) = channel SINK: the receiving player decoder path. |
| `cloud_registration` | **?** |  |
| `device_props` | **?** |  |
| `diagnostics` | **?** |  |
| `htaudio` | **?** |  |
| `http_engine` | **?** |  |
| `lechmere` | **?** |  |
| `music_accounts` | **?** |  |
| `registration_machine` | **?** |  |
| `reporting` | **?** |  |
| `saved_queues` | **strong** | file:///jffs/settings/savedqueues.rsq (+.tmp write path, .d.rsq variant, application/gzip accepted); XML <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"><SavedQueue Id= Curated= NumTracks=%u><Track URI= MD=></SavedQueue></SavedQueues>; validation: corrupted track count, invalid queue-id/next-id/mismatch, invalid version/numtracks, boot file invalid; migration "Migrating ObjID=%s SN=%u from SID: %u to %u"; SQ:%s objid prefix; <res protocolInfo="file:*:audio/mpegurl:*">; album-art: "No num tracks found, so emitting the first four artworks found"; mobile- playlist prefix; "Add Track Move range: %u-%u to %u"; replication push on save |
| `smb` | **?** |  |
| `sntp` | **?** |  |
| `spotify_connect` | **?** |  |
| `stream_metadata` | **?** |  |
| `upgrade` | **?** |  |
| `upnp_eventing` | **?** |  |
| `vli` | **?** |  |
| `zone_topology` | **?** |  |

## `ab_experiments`

**coverage** `partial`

Sonos can enrol a zone in A/B experiments pushed from the cloud. Each experiment is an id+name with a value and a shipped defaultValue, so a player without an assignment just runs the default. The /experiments HTTP endpoint exposes the active set. Client authors only need to know these exist — they change behaviour silently between households and explain builds that differ despite identical firmware.

**Technical description:**

production A/B experiment framework: a /experiments local endpoint plus a replicated <ZoneExperiments> store of <ZoneExperiment id name value defaultValue> rows; presence gated by featureConfigZoneExperiment; values influence runtime policy

- binary anchors: `<ZoneExperiment`, `/experiments`, `experimentId`, `/experiments`, `<ZoneExperiment id="%llu" name="%s" value="%u" defaultValue="%u" />`, `featureConfigZoneExperiment`, `zoneExperiments`

- **schema:** <ZoneExperiments><ZoneExperiment id="%llu" name="%s" value="%u" defaultValue="%u" /></ZoneExperiments> — numeric value vs defaultValue, keyed by 64-bit id and name
- **keys:** featureConfigZoneExperiment, zoneExperiments, experimentId, experiment
<details><summary>Evidence (4)</summary>

- @ 0x10ef3d0d — <ZoneExperiment
- @ 0x10e75d30 — /experiments
- @ 0x10f9c96c — experimentId
- @ 0x10ef3d34 — <ZoneExperiment id name value defaultValue> element schema

</details>

## `account_cert_lifecycle`

**coverage** `partial`

Every player holds a device certificate used to authenticate to Sonos cloud and to music services that demand deviceCerts. The enrolment, renewal and storage flow lives here; when a client hits certificate errors (R_CLIENT_KEYCERT_* family) this is the machinery involved.

**Technical description:**

three cert managers (certmanager/devicecertmanager/regdevicecert) over four keycert identities; the registration cert carries the device's SonosID and is required for token generation ('sr: reg cert not available; cannot generate token'); a /regcert status endpoint exposes DeviceCertInfo XML; root-of-trust bundles are fetched from /certbundles/v4/trusted_roots.rcb with ETag caching and retry backoff

- binary anchors: `devicecertmanager.cxx`, `regdevicecert.cxx`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE`, `X-Sonos-DeviceCert`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE`, `DeviceCertRevoked`

- **devicecertinfo_schema:** <DeviceCertInfo><CertName> <Denylisted> <ExpiresIn> <JobAllowed> <JobForceAllowed> <JobScheduled> <JobLastRun> <ETag> <HouseholdID> <SonosID> <IDType>(urn:sonos:idtype) <Cert> <HaveCert> <CertSerial>(%.64s) <ExpiresUtc>(YYYY-MM-DD HH:MM:SS) </DeviceCertInfo> — served at /regcert
- **root_bundle:** /certbundles/v4/trusted_roots.rcb → written trusted_roots.rcb.tmp then swapped; rcb_ver versioning; ETag compare ('Local cert bundle unchanged (ETag: %s)'); scheduled fetch ('Scheduling root cert bundle fetch for %ld seconds') with consecutive-failure backoff
- **events:** NewCertRegistrationEvent/RegCertUpdateEvent internal events; newRegisteredCertSonosIDLocked binds cert→SonosID; NewAccountID/newAccountType/newAccountOADevID/newActiveDevice fields for account re-binding
- **wire:** X-Sonos-DeviceCert: and X-Sonos-UserId outbound headers; 'Loading secure reg cert'/'Unloading secure reg cert' secure storage; DeviceCertRequired/Invalid/Expired/Revoked error states; REGISTRATION_CERT_{REMOVED,CHANGED} lechmere close reasons
- **root_bundle_updater:**
  - **job:** rootcerts_download: scheduled fetch ("First root cert bundle fetch is %ld seconds from now"), GET /certbundles/v4/trusted_roots.rcb -> %s/trusted_roots.rcb.tmp then promote
  - **etag:** ETag change-detection: "Downloaded new cert bundle"/"Failed to load newly downloaded"/"Local cert bundle unchanged"/"Cert bundle fetch failure"; "%zu consecutive cert fetch failures. Trying again in %ld seconds"; keys rcb_ver,newBundleID,newBundleVersion,newETag,nextFetchSec,curr_id,prev_id,curr_rcb_ver,prev_rcb_ver
  - **page:** /root_cert_bundles emits <RootCertBundleInfo><Bundles><CurrentBundle><BundleVersion/><BundleID/><IsFallback/></CurrentBundle><CachedCloudBundle><BundleVersion/><BundleID/><ETag/></CachedCloudBundle><PreviousBundle><BundleVersion/><BundleID/></PreviousBundle></Bundles></RootCertBundleInfo>
- **storage:** cert.xml + metadata.txt, tmpfile-rename install ("loading %s (0x%x) took %ums","failed to rename tmpfile","failed to load replacement (0x%x)"); buffer bound check
<details><summary>Evidence (9)</summary>

- @ 0x10ef220e — devicecertmanager.cxx
- @ 0x10efc8e6 — regdevicecert.cxx
- @ 0x10eef0d1 — R_CLIENT_KEYCERT_ID_SONOS_DEVICE
- @ 0x10eef100 — curl R_CLIENT_KEYCERT_ID_SONOS_DEVICE selection
- @ 0x10ec1f20 — X-Sonos-DeviceCert: header
- @ 0x10f0ea6c — DeviceCertRequired/Invalid/Expired/Revoked states
- @ 0x10ef1fbc — full <DeviceCertInfo> XML schema (14 fields)
- @ 0x10eeb82c — /certbundles/v4/trusted_roots.rcb + ETag flow
- @ 0x10f043a4 — reg cert required for token generation

</details>

## `audio_taps`

**coverage** `partial`

Internal PCM capture points let the firmware record the audio passing through it — used for diagnostics and, importantly, for TV lip-sync: the SPDIF tap captures the TV input so playback can be synchronized against the output tap. The /snapshotspdiftap + /downloadspdiftap endpoints retrieve captures. Not a client-facing feature, but it explains audio-quality and latency behaviour on home-theatre setups.

**Technical description:**

PCM-capture tap subsystem (audiotap_manager.cxx + datatap.cxx): guarded /audio_tap /spdiftap /snapshotspdiftap /downloadspdiftap endpoints, versioned tap-file format with audio+metadata sections, SPDIF tap used to sync TV-input playback against the output tap

- binary anchors: `audiotap_manager.cxx`, `spdiftap.c`, `/downloadspdiftap`, `/snapshotspdiftap`, `audiotap.spdif`, `<SPDIFTap>`

- **endpoints:** /audio_tap, /spdiftap, /snapshotspdiftap, /downloadspdiftap; request errors 'AudioTap: no tap specified', 'syntax error', 'invalid request', 'permission denied'
- **file_format:** tap files carry metadata+audio sections with a metadata version: 'Audio tap metadata version mismatch (tap: %d, expected: %d)', truncation checks ('last %zu audio bytes missing', 'last %zu metadata bytes missing'), 'Audio tap file valid (%zu/%zu)', rewind/start markers; snapshot file audiotap.spdif; compressed state 'spdiftap.compressed' — 'Internal SPDIF Tap Snapshotted. Tap must be uncompressed before use!'
- **tv_sync:** 'Synchronize SPDIF tap playback with output tap (%s)', 'TV input sample rate mismatch with audio tap (tv:%u tap:%u)', 'TV input read error during audio tap playback' — the SPDIF tap doubles as the TV-input capture path for lip-sync
<details><summary>Evidence (6)</summary>

- @ 0x10feb6e7 — audiotap_manager.cxx
- @ 0x10e738c4 — spdiftap.c
- @ 0x10e76568 — /downloadspdiftap
- @ 0x10e76554 — /snapshotspdiftap + /downloadspdiftap endpoints
- @ 0x10f287d0 — tap metadata version check
- @ 0x10f26ea4 — TV input sample-rate mismatch vs audio tap

</details>

## `business_msp`

**coverage** `partial`

Hooks for Sonos Business managed deployments — the strings reference adding/removing and syncing a 'Sonos Business MSP' relationship. Households under business management can have different service availability (e.g. Sonos Radio suppressed by the SBiz entitlement). Only vocabulary has been recovered.

**Technical description:**

Sonos-for-Business managed-service machinery: SOAP ops AddRemoveSonosBusinessMSP / Sync Sonos Business MSP / AddRemoveSfbMSP, /msprox + /msprox?uuid= proxy endpoints, three tier vocabulary (SFB_COMMERCIAL/ESSENTIALS/PREMIUM_MSP + commercial/essentials/premium-msp slugs), Backgrounds MSP add/remove, enableRemoveMSPCredentialsFromUPnP flag, voice-service MSP education keys (O_AMAZON/GOOGLE_SHOW_MSP_EDUCATION)

- binary anchors: `AddRemoveSonosBusinessMSP`, `Sync Sonos Business MSP`, `/msprox`, `AddRemoveSonosBusinessMSP`, `SFB_PREMIUM_MSP`

<details><summary>Evidence (5)</summary>

- @ 0x10e749a4 — AddRemoveSonosBusinessMSP
- @ 0x10e74e7c — Sync Sonos Business MSP
- @ 0x10e763b8 — /msprox endpoint
- @ 0x10f99990 — SFB_*_MSP tier enum
- @ 0x10e74e94 — AddRemoveSfbMSP op

</details>

## `buttons_ir`

**coverage** `partial`

Physical input pipeline. Buttons (play/pause, volume, join, mic-mute, pairing, plus swipe gestures on touch models) are broadcast on an internal multicast group and forwarded to the group coordinator when a player is slaved. Button lock is controllable via SOAP, and the cloud can inject virtual button presses (virtualRemoteControl/buttonCommand) — that's how the app 'remote control' works. IR: the player learns your TV remote via LearnIRCode against Sonos's ir.ws.sonos.com code database.

**Technical description:**

button + IR input pipeline: hw-message BUTTON multicast group carries events, longpress.cxx handles holds, events forward to the group coordinator ('Forwarding button events'), /button_triggered\[.xml\] diagnostic capture, /rdmbuttonfwd retail hook, virtualRemoteControl/buttonCommand muse route injects button presses from the cloud; irdecoder.cxx learns TV-remote codes against the ir.ws.sonos.com database

- binary anchors: `longpress.cxx`, `irdecoder.cxx`, `/jffs/irconfig.txt`, `virtualRemoteControl/buttonCommand`, `ir.ws.sonos.com/IRCode/`, `/button_triggered.xml`, `LearnIRCode`

- **button_vocabulary:** BUTTON_PLAYPAUSE(+_PRESSED/_HELD), BUTTON_VOL_UP/DN(+_PRESSED), BUTTON_JOIN(+_PRESSED), BUTTON_MODE, BUTTON_POWER, BUTTON_MICMUTE/STATE_BUTTON_MICMUTE_PRESSED, BUTTON_PAIRING, BUTTON_VOL_ROCKER, BUTTON_MUTE, BUTTON_WIFIBT_MODE, SWIPED
- **forwarding:** hwmessagelib_multicast_group_BUTTON bus; 'No button handler, unable to forward buttons'; '%s button pressed (cid: %s)'/'Play button held (cid: %s)' correlation ids; PlayerButtons XML with required-field validation
- **lock:** SetButtonLockState/GetButtonLockState/GetButtonState SOAP surface; DesiredButtonLockState/CurrentButtonLockState vars; UnpairedButtonLock; BUTTONS_LOCKED + IN_BUTTON_OBSERVATION_MODE + DAT_IN_BUTTONLESS_SETUP_MODE states; 'button-notify' config mode (cm_button/buttonAction); 'Becoming standalone due to button press'
- **ir:** irdecoder.cxx select-thread (selthrd.RIRDecoder.*); LearnIRCode/CommitLearnedIRCodes/GetButtonState actions; one-button learn mode with timeout + UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND fault; codes fetched from http://ir.ws.sonos.com/IRCode/ (O_IR_DB_WS_IRCODE_URL key), <IRCode> XML schema; demo-mode missing-code path
- **cloud:** v1/players/{playerId}/virtualRemoteControl/buttonCommand + household-scoped variant, sendButtonCommand op — cloud-injected virtual remote
<details><summary>Evidence (7)</summary>

- @ 0x10ec9b6e — longpress.cxx
- @ 0x10ea75fa — irdecoder.cxx
- @ 0x10e751e8 — /jffs/irconfig.txt
- @ 0x10e85fe8 — virtualRemoteControl/buttonCommand muse route
- @ 0x10ea72ac — http://ir.ws.sonos.com/IRCode/ cloud IR database
- @ 0x10ec74e0 — '%s button pressed (cid: %s)' forwarding log
- @ 0x10ea701c — UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND learn-mode fault

</details>

## `chirp`

**coverage** `partial`

**Technical description:**

/code/chirp-core/source/{core,dsp,maths}/src/** paths in rodata 0x10fd0188-0x10fd4c74

- **name:** chirp-core SDK — acoustic pairing/setup protocol (third-party chirp.io-derived stack)
- **profiles:** `audible`, `sonos-cdma`, `sonos_secure_setup`, `ultrasonic`
- **acoustic_params:** `base_frequency(>=20)`, `channel_count`, `channel_interval`, `envelope_attack`, `envelope_release`, `preamble(>=1byte, code within symbol range)`, `header_note_duration`, `header_silence_duration`, `frequency_interval`, `body_note_duration`, `body_silence_duration`, `portamento`, `template`
- **encoding_params:** `alphabet_bits`, `crc_length`, `message_length_max`, `message_length_min`, `polyphony`, `rs_length_max`, `rs_length_min`, `total frame <= 256 bytes`, `symbols <= 64-bit`
- **decoder_config:** `fft_size`, `hop_size`, `sample_rate_min`, `payload_metrics_enabled`, `buffer_metrics_enabled`, `voters\[\] {amplitude_threshold,frame_offset,preamble_threshold,reverb_cancellation_exponent,reverb_cancellation_magnitude,spectral_weighting(float)}`
- **fec:** GF(2^8) reed-solomon: gf_calc_syndromes, gf_correct_errata, gf_forney_syndromes, gf_poly_{mul,add,concatenate,zero_pad}, trim_gf_poly, new_gf/del_gf/del_gf_poly; decoder pipeline decoder.c->peaks.c->scorer.c->voter.c->weighting.c; cdma cdma_{encoder,decoder,codebook}; fsk chirp_private_fsk
- **api:** `new/del_chirp_payload`, `chirp_payload_randomise`, `new/del_chirp_profile`, `new/del_chirp_protocol`, `new_chirp_protocol_from_json_value`, `chirp_protocol_corrupt_random_symbols`, `new/del_chirp_acoustic`, `new/del_chirp_encoding`, `new/del_chirp_config`, `new_chirp_default_config`, `new_chirp_decoder_config_from_json_value`, `new_chirp_default_voter_configs`, `new/del_chirp_voter_config`
- **json_config:** protocol + decoder configs are JSON-described (schema_version, decoder_config keys) — profiles load via new_chirp_protocol_from_json_value
- **audio_src:** ChirpExtAudioSrc: chirp generation API {set_config,sample_rate,start,max payload,is valid,send,generation status/incomplete,duration truncated,"generated signal (%zu bytes)","generation took %u ms",stop}; "Start chirping with unique device value:%d" — device id encoded into payload; playId mgmt (REA_PLAY_ID_NULL guard, m_chirpPlayId match); "Chirp volume not yet calibrated"; "Chirp payload %s not supported"
<details><summary>Evidence (1)</summary>

- @ 0x10fd0188 — chirp-core rodata block

</details>

## `chirp_stack`

**coverage** `partial`

The embedded Chirp acoustic library — the speaker can literally emit and decode data-over-sound chirps (CDMA/FSK profiles). Used for room detection during setup and possibly trueplay discovery. Only the codec vocabulary is catalogued; the wire format hasn't been decoded.

**Technical description:**

embedded chirp-core 4.2.1_7265 acoustic data-over-audio SDK with a custom 'sonos-cdma' profile: used for room detection during setup — muse routes roomDetection/chirp (start/stop signalling with {playId}), DSP-routed audio streams as-dspin-ext-chirp/as-dspout-ext-chirp, a per-device unique payload ('Start chirping with unique device value:%d') and calibrated output volume ('Chirp volume not yet calibrated')

- binary anchors: `chirp_private_cdma.c`, `protocol-acoustic.c`, `sonos-cdma`, `chirp-core: 4.2.1_7265`, `roomDetection/chirp`, `SETUP_CHIRP`

- **library:** chirp-core 4.2.1_7265; 'Chirp SDK with "%s" profile v%u \[max %u bytes in %.2fs\], supporting %u channel(s), using %s modulation' — profile system; sonos-cdma + FSK modulation files (chirp_private_cdma.c, chirp_private_fsk.c); reed-solomon FEC; chirp_levenshtein fuzzy match; JSON-configured protocol (alphabet bits, min/max msg length, polyphony); CHIRP_MEMORY_MANAGER_LEVEL_LOW build
- **api:** chirp_sdk_send, chirp_sdk_process_shorts_input/output, chirp_encode/decode, chirp_get_symbols, chirp_sdk_random_payload
- **usage:** muse: v1/players/{playerId}/roomDetection/chirp (startSignalling) + /{playId} (stopSignalling) + household variants; chirpRequest op; playId-keyed chirp management ('A chirp signal is already playing with playId %d', 'Stop chirp playId %d differ than m_chirpPlayId'); 'Start chirping with unique device value:%d' — encodes a device id; volume calibrated ('Chirp volume not yet calibrated', 'current chirp output volume: %d'); DSP routing as-dspin-ext-chirp/as-dspout-ext-chirp; 'Ignoring busy transition due to chirp only'
- **errors:** ERROR_ROOM_DETECTION_SIGNALLING_{FAILED,BUSY}
- **unresolved:** the sonos-cdma profile parameters (freq table, symbol alphabet), what payload the room-detection chirps carry
- **sdk_layout:** full source map embedded: chirp_sdk.c/chirp_sdk_process.c/chirp_sdk_states.c SDK shell; chirp-private cdma+fsk glue (_chirp_on_received_cdma/_fsk, _chirp_sdk_allocate_decoders_fsk); chirp-core modules: chirp.c, payload.c, crc.c, bitstring.c, filter.c, multitone.c, reed-solomon.c, template.c; profile/{profile,protocol,protocol-acoustic,protocol-encoding,config,config-voter-config}.c; decoder/{decoder,peaks,scorer,voter,weighting,rms}.c; cdma/{cdma_decoder,cdma_encoder,codebook}.c; encoder/{encoder,wavetable,decorator}.c; dsp/{blockbuffer,fft,reverb}.c; maths/float32 fft init/deinit
- **profile:** 'Chirp SDK with "%s" profile v%u \[max %u bytes in %.2fs\], supporting %u channel(s), using %s modulation.' — profile 'sonos-cdma', CDMA modulation; 'Chirp protocol must be fixed length for CDMA'; validators bound alphabet bits, min/max message length and polyphony
- **decode:** decoder pipeline: FFT → peaks → scorer → voter (chirp_voter_set_state, per-voter configs) → weighting → reed-solomon FEC; chirp_levenshtein for fuzzy payload matching; decode metrics (chirp_decode_metrics_t, buffer_processed_metrics, payload_metrics)
- **ops:** ROOM_DETECTION_CHIRP/EXT_CHIRP/SETUP_CHIRP internal ops; RoomDetectionStartChirping/RoomDetectionStopChirping; ChirpIfPlayingSwappableAudio; playId management ('A chirp signal is already playing with playId %d', 'Stop chirp playId %d differ than m_chirpPlayId %d'); 'Ignoring busy transition due to chirp only'; stream stats stream_chirp_{init_sync,lack_data_no_drain,read_err_full,read_err_part_data}
<details><summary>Evidence (9)</summary>

- @ 0x10fd2948 — chirp_private_cdma.c
- @ 0x10fd0c49 — protocol-acoustic.c
- @ 0x10fd3454 — chirp-core: 4.2.1_7265 version string
- @ 0x10fd04d0 — 'sonos-cdma' custom protocol profile
- @ 0x10e81ee8 — roomDetection/chirp muse routes
- @ 0x10fcecfc — SDK profile/modulation log format
- @ 0x10fd3454 — chirp-core: 4.2.1_7265 version banner
- @ 0x10fcecfc — SDK profile banner (profile v%u, max bytes, modulation)
- @ 0x10fd1cf8 — 'Chirp protocol must be fixed length for CDMA'

</details>

## `cloud_queue`

**coverage** `partial`

Sonos's cloud-side queue: playbackMetadata/ratings, trackQueueAdditions and CloudQueueHistory all point at a queue that lives cloud-side rather than in trackqueue.rsq — this is how cloud services (e.g. voice assistants, direct control) schedule tracks. Ratings are explicitly 'only implemented for cloud queue'. The lifecycle and reconciliation with the local queue are not yet decoded.

**Technical description:**

the Cloud Queue subsystem: a music service hands the player a queueBaseUrl ending in a SemVer API version (validated: 'path must end with a cloud queue version', 'Cloud Queue API v%u is unknown; use v%u with this player'), then the player pages itemWindows over it: loadCloudQueue, loadCloudQueueWithWindow ('Full itemWindow from the Cloud Queue API must be passed'), refreshCloudQueue, skipToItemWithWindow — all as muse routes on playbackSessions/{sessionId}

- binary anchors: `/cloudqueue`, `trackQueueAdditions`, `CloudQueueHistory`, `loadCloudQueueWithWindow`, `/cloudqueuepoll`, `CloudQueueWindow init`

- **routes:** loadCloudQueue, loadCloudQueueWithWindow, refreshCloudQueue under /v1/playbackSessions/{sessionId}/ playbackSession (+household-scoped variants); 'Full itemWindow from the Cloud Queue API must be passed to loadCloudQueueWithWindow' — large queues fetched in windows
- **internals:** internalStartCloudQueue, internalRefreshCloudQueue, loadCloudQueueFromReq; CloudQueueWindow init logging; CloudQueueVersion state; trackQueueAdditions pushes additions back to cloud; CloudQueueHistory in history pipeline
- **errors:** ERROR_CLOUD_QUEUE_{SERVICE_ERROR,ACCESS_DENIED,STREAM_LIMIT,SERVICE_UNRESPONSIVE,CANT_REACH_SERVER,SERVER}; 'Cloud Queue Error'/'<Cloud queue error>' fault strings
- **muse_routes:** loadCloudQueue, loadCloudQueueWithWindow, refreshCloudQueue — each on v1/playbackSessions/{sessionId}/playbackSession/ AND v1/households/{householdId}/playbackSessions/{sessionId}/playbackSession/
- **versioning:** queueBaseUrl must end with a semver version ('Specify cloud queue version ... according to Semantic Versioning 2.0.0'); player rejects unknown versions with 'use v%u with this player'; CloudQueueVersion tracked
- **lifecycle:** internalStartCloudQueue/internalRefreshCloudQueue/loadCloudQueueFromReq entry points; 'activate cloud queue %s', 'loadCloudQueue stop'; 'suspending cloud queue during snooze/alarm'; 'recover from cloud queue error'; REFRESH_CLOUD_QUEUE op; 'Cloud queue policy pause expiry time hit'
- **rating:** 'rating is only implemented for cloud queue' — thumbs up/down on tracks exists ONLY in the cloud-queue path
- **local_eps:** /cloudqueue + /cloudqueuepoll status endpoints
- **cqfsm:**
  - **requests:** `requestVersion(getVersion)`, `requestContext(getContext)`, `requestWindow(getWindow)`, `refreshWindow`, `refreshContext`, `skipToFirstWindow`, `rateItem`, `skipNext`, `skipPrevious`, `getItemWindow`
  - **request_grammar:** requestWindow w/ %s itemId='%s', positionMillis=%d, queueVersion='%s'
  - **headers:** `X-Sonos-Playback-Id`, `X-Sonos-Device-Id`
  - **response_fields:** `units`, `ResponseCode`, `RetryWait`, `Caller`, `ListEntry`, `queueType`, `errorId`, `heard`, `skipsRemaining`, `skipLimitReached`, `jumpToItemId`, `Requested Item Id`
  - **states:** `PENDING`, `ERROR_RETRY`, `SUCCESS`, `MEDIA_ERROR`, `RESET`, `GET_VERSION`, `GET_CONTEXT`, `SCHEDULE_WINDOW`, `SCHEDULE_CONTEXT`, `GET_WINDOW`, `POST_RATE`
  - **retry:** "Retry-After (%ds) not allowed for explicit item request in state %s"; "Will retry(%d) %s request in %d seconds after receiving http error code %d"; exhaustion "Retry not allowed in state %s... (count = %d)"; "request retry loop timed out, failing chsrc interaction"; "Resetting due to unexpected state %s on retry"
  - **poll:** "change poll interval to %lld sec"; refreshWindow "server does not support notification" fallback to poll; "fetching first window"
  - **version:** queueBaseUrl semver check: "Cloud Queue API 'v%u' is unknown; use v%u with this player"; "Cloud queue version is %s, at begin %d, at end %d"
  - **events:** `contextVersionChanged/contextVersion`, `authTokenChanged/authTokenRefreshed`
  - **window_flags:** `skipNext`, `skipPrev`, `queueCompleted`, `refresh`, `PlayTTLExpired`
  - **errors:** `MEDIA_ERROR:NO_ACCT`, `window-edge-condition`, `WINDOW_MISSING_ITEM_ID`, `Abort window request because desired itemId is unknown; waiting for skipToItem`, `Unknown Account`, `CloudQueueHistory`
  - **smapimap:** sonoscp; "cannot map content type %s to SMAPI protocol \[accountId:%s,sid:%s,obj:%s\]"; "cannot generate SMAPI URL"; audio/x-spotify; CQ track-URI cache ("Fetching CQ itemId %s using cached trackURI"/"Adding track URI for itemId %s to cache"/"Invalidating CQ track URI cache"); "CloudQueueWindow init: %s"; playbackPolicies; reports
  - **notify:** notifyStateChange \[%s\]: itemId: %s ptvWhen %d.%06d ptvTrackPos %ld.%06ld; music quality: %s
<details><summary>Evidence (8)</summary>

- @ 0x10e75cc4 — /cloudqueue
- @ 0x10e93ddf — trackQueueAdditions
- @ 0x10eb98d0 — CloudQueueHistory
- @ 0x10e80b00 — loadCloudQueue muse route
- @ 0x10eb17ac — itemWindow requirement string
- @ 0x10eb9a2b — queueBaseUrl semver validation + API version negotiation
- @ 0x10eb11d8 — itemWindow contract on skipToItemWithWindow/loadCloudQueueWithWindow
- @ 0x10eee62c — ERROR_CLOUD_QUEUE_* fault family

</details>

## `cloud_synchronizer`

**coverage** `partial`

**Technical description:**

cloud_synchronizer thread: registerServices (max-count abort, called-once guard), "received JIT event", "discarding %s type %d"

- **name:** RCloudSynchronizer
<details><summary>Evidence (1)</summary>

- @ 0x10ef1ba0 — cloudrequest region

</details>

## `dev_disc`

**coverage** `partial`

**Technical description:**

devdiscthr/ddthrd.cxx: rx logging "%s - rx MSEARCH %s from %s:%d (%zd %d %d)", "%s - rx %s ALIVE %s %s %d %u %s (%zd)", "%s - rx %s BYEBYE %s", "%s - rx CDALIVE %s %s %d", "%s - rx CDBYEBYE %s", "rx  QUARANTINE_RECHECK %s"; "%s - %u SSDP messages lost"; zp byebye; "ddt hint:%d"; "Finished working on type %d"

- **name:** RDevDiscThread/ddt SSDP device discovery
<details><summary>Evidence (1)</summary>

- @ 0x10ef1d08 — ddthrd.cxx

</details>

## `device_unlock`

**coverage** `partial`

A hidden developer-unlock feature: hitting /devunlock or /mfgunlock marks the player as unlocked (a flag file in /tmp) and reboots it. There's a server-side limit on how many times a unit can be unlocked, and diagnostic tests refuse to run on unlocked hardware — unlocked units are treated as non-production.

**Technical description:**

developer/manufacturing unlock surface: /unlock, /devunlock, /mfgunlock and /unlock.htm endpoints write /tmp/device_unlocked_flag; unlocks are rate-limited ('Too Many Unlocks' HTML page) and DevUnlock reboots the player; RdeviceIsUnlocked and RabortIfUnlocked let self-tests detect and refuse to run on unlocked units; 'unlockedBld' marks the build state

- binary anchors: `/unlock`, `/devunlock`, `/mfgunlock`, `/tmp/device_unlocked_flag`, `Too Many Unlocks`, `RdeviceIsUnlocked`, `RabortIfUnlocked`, `deviceUnlock`, `unlockedBld`, `<Unlocked>1</Unlocked>`

- **endpoints:** /unlock, /devunlock, /mfgunlock, /unlock.htm (browser form)
- **behavior:** unlock writes /tmp/device_unlocked_flag and an <Unlocked>1</Unlocked> record; the deviceUnlock op + 'DevUnlock' page return 'Rebooting...'; a server-side cap yields '<h2>Too Many Unlocks</h2>' when the per-device unlock budget is exhausted
- **safety:** RdeviceIsUnlocked + RabortIfUnlocked R_* hooks let diagnostic/self-test code abort on unlocked hardware — unlocked units are treated as non-production
<details><summary>Evidence (4)</summary>

- @ 0x10f00014 — /devunlock endpoint literal
- @ 0x10f00020 — 'Too Many Unlocks' rate-limit page
- @ 0x10efff88 — /tmp/device_unlocked_flag
- @ 0x10efffb0 — DevUnlock page → Rebooting...

</details>

## `dsp_ht_engine`

**coverage** `partial`

The full home-theatre audio configuration surface: surround/subwoofer state, downmix mode, dialog enhancement, AI speech enhancement, height-channel level, autoplay/autostop silence thresholds and a Tweaks bitmask — plus a 37-field per-zone audio record covering everything from balance and sub crossover to trueplay status. Channel masks up to 9.1.4 are compiled in. Many of these knobs are reachable through hidden RenderingControl EQ-type tokens (SubGain, SubCrossover, SpeakerSize, FV*...).

**Technical description:**

home-theatre DSP parameter surface + per-zone audio state schemas fully recovered: HT config XML (surround/sub/downmix/dialog/AI-speech/height levels, autoplay/autostop thresholds, Tweaks bitmask), 37-field per-Zone audio XML, zone volume/duck XML; R_MASK_* speaker layouts enumerate supported channel masks

- binary anchors: `SubCrossover`, `DialogEnhancementLevel`, `AISpeechEnhance`, `/htconfig`, `R_MASK_NINE_DOT_ONE_DOT_FOUR`, `<DialogEnhancementLevel>`, `<SubCrossover>%dHz</SubCrossover>`, `<GainTrimDB>`, `<Tweaks>0x%08X</Tweaks>`

- **ht_config_xml:** <Version><SurroundState><SubState><GMDownMixState><DialogEnhancementLevel><AISEDynamicLatency><AISpeechEnhance><MusicSurroundLevel><TVSurroundLevel><HeightChannelLevel><AutoPlay><AutoPlaySilenceThresh><AutoStop><AutoStopSilenceThresh><NightMode><SurroundMode><Tweaks>0x%08X<PrimaryEthernet><WirelessEnabled>
- **zone_audio_xml:** <Zone><IsSatellite><Volume><GainTrimDB><SPLdB><LoudnessSPLdB><LoudnessScaling><BassLevel><TrebleLevel><LoudnessEnabled><StereoPairEnabled><IsOnLeft><BalanceInitial><Balance><LeftMute><RightMute><HeightLevel><HeightLeveldB><NumBondedSubs><BondedSubModel><SubwooferEnabled><SubwooferJackConnected><DRCVolumeScaling><NightMode><DialogEnhancementLevel><TrueplayEnabled><SubLeveldB><InvertSub><ConstrainSubLevelToVolume><SubDefaultInversion><SourceGainOffsetdB><MusicSurroundLeveldB><TVSurroundLeveldB><FullSurroundMode><PlaybackStreamSampleType><MonoMode><SubCrossover>NHz</SubCrossover><SpeakerSize>
- **zone_volume_xml:** <Zone><UnscaledVolume><Volume><DeferredVolume><Ducked><DuckingVolume><DuckingPercent><OverrideVolume><Muted><DeferredMute><ExtSrcVolume><SurroundLevel><ZoneChannelCount>
- **channel_masks:** R_MASK_THREE_DOT_ONE, R_MASK_FIVE_DOT_ONE, R_MASK_FIVE_DOT_ONE_DOT_TWO, R_MASK_SEVEN_DOT_ONE, R_MASK_NINE_DOT_ONE_DOT_FOUR, R_MASK_UNSPECIFIED — Atmos-era layouts compiled in
- **rc_params:** hidden RenderingControl EQ-param tokens driving this layer: SubGain, SubCrossover, SubPolarity, SpeakerSize, VolumeScalingFactor, FV*/FVPXY fixed-volume forms
<details><summary>Evidence (8)</summary>

- @ 0x10e878fc — SubCrossover
- @ 0x10f25449 — DialogEnhancementLevel
- @ 0x10f254a7 — AISpeechEnhance
- @ 0x10e75d58 — /htconfig
- @ 0x10fbedfa — R_MASK_NINE_DOT_ONE_DOT_FOUR
- @ 0x10f253d8 — HT config XML schema (24 fields incl. Tweaks bitmask)
- @ 0x10feabd8 — per-Zone audio XML schema (37 fields)
- @ 0x10f2b138 — Zone volume/ducking XML schema

</details>

## `embedded_sqlite`

**coverage** `partial`

A libsqlite3 is linked in; at least the local timer/alarm store persists through SQL statements. Which tables exist and where the database file lives is still unmapped.

**Technical description:**

embedded libsqlite3 (sqlite3_open_v2/prepare_v2/step/bind_*/column_*/exec/busy_timeout) backs LocalTimer persistence in timer.db — the alarm/sleep-timer store; two tables with full DDL recovered verbatim | proven tables (timers_impl.cxx): timers(id TEXT PRIMARY KEY, trigger_time TEXT NOT NULL, total_duration INTEGER NOT NULL, triggered NUMERIC NOT NULL) — local/suspend timers (timers_impl.cxx) | suspend model: pause -> row in paused_timers w/ remaining_seconds+paused_utc_time; resume -> recompute trigger_time | libFLAC embedded codec: reference libFLAC 1.3.4 20220220

- binary anchors: `sqlite3_exec`, `LocalTimer from sqlite3`, `LocalTimer from sqlite3 stmt`, `libsqlite3.so.0`, `CREATE TABLE IF NOT EXISTS timers`, `paused_timers`, `timer.db`, `PRAGMA user_version`, `LocalTimer`, `remaining_seconds`, `paused_utc_time`

- **users:** LocalTimer store (timer persistence across reboot); the full table inventory is unmapped — imports suggest prepared-statement CRUD, no bulk exec-heavy workload
- **schema:** CREATE TABLE IF NOT EXISTS timers(id TEXT PRIMARY KEY,trigger_time TEXT NOT NULL,total_duration INTEGER NOT NULL,triggered NUMERIC NOT NULL); plus a paused_timers table queried as (id, remaining_seconds, paused_utc_time, total_duration) — paused timers freeze remaining_seconds + the UTC pause instant
- **ops:** SELECT id,trigger_time,total_duration,triggered,rowid FROM timers \[WHERE id=?1\]; SELECT count(*) FROM timers; same pair for paused_timers; PRAGMA user_version used for schema versioning
- **notes:** 'LocalTimer from sqlite3 stmt \[%s\] FAILED %d %s' / 'from sqlite3 stmt timer' — row→object hydration; filename timer.db
- **tables:**
  - **timers:** id TEXT PRIMARY KEY, trigger_time TEXT NOT NULL, total_duration INTEGER NOT NULL, triggered NUMERIC NOT NULL — local timers, suspend-aware (timers_impl.cxx @0x10edcf88)
  - **paused_timers:** id TEXT PRIMARY KEY, remaining_seconds INTEGER NOT NULL, paused_utc_time TEXT NOT NULL, total_duration INTEGER NOT NULL — timers parked during suspend; resume recomputes trigger_time from paused_utc_time+remaining (timers_impl.cxx @0x10edd018)
<details><summary>Evidence (6)</summary>

- @ 0x1006282c — sqlite3_exec
- @ 0x10edd644 — LocalTimer from sqlite3
- @ 0x10edd644 — LocalTimer sqlite3 statement failure log
- @ 0x10edcf88 — timers table CREATE TABLE DDL, verbatim
- @ 0x10edd38c — paused_timers SELECT (remaining_seconds,paused_utc_time)
- @ 0x10edd464 — timer.db filename

</details>

## `entitlements`

**coverage** `partial`

Sonos-side licensing: each account/household can carry <Entitlement> records (type, isTrial, sku, date range, codes). The runtime policy consults them — e.g. a Sonos Business (SBiz) entitlement blocks Sonos Radio preinstall. Changes fire entitlements_changed events. Fetched cloud-side, cached locally, and diffed on refresh.

**Technical description:**

entitlements manager with cloud fetch + local cache, muse-subscribed change events, and a runtime policy hook (RRuntimeZPPolicy takes entitlementsMgr); typed SKU records decide e.g. whether Sonos Radio is preinstalled

- binary anchors: `entitlementsmanager.cxx`, `entitlementsVersionChanged`, `/entitlements/api`, `entitlementsmanager.cxx`, `RRuntimeZPPolicy`, `isEntitlementOn`, `internalMuseSubscribeToEntitlements`, `<Entitlement type="%s" isTrial="%s" sku="%s" startDate="%s" endDate="%s" codes="%s" />`

- **schema:** <Entitlements><Entitlement type= isTrial= sku= startDate= endDate= codes= /></Entitlements> — entitlement records carry an SKU and validity window
- **lifecycle:** cached entitlements returned from local store ('returning entitlements from cache'); refreshEntitlements fetches from cloud ('requesting entitlements from cloud', 'cloud entitlements: rc %d, http %d'); on ENTITLEMENTS_CHANGED the old set is stashed then compared ('stashed existing entitlements to compare later'); 'stale entitlements; scheduling job to refresh'
- **muse:** v1/users/{userId}/entitlements, v1/households/{householdId}/entitlements + users/{userId} scoped; internalMuseSubscribeToEntitlements pushes entitlements_changed / entitlementsVersionChanged events; 'savePendingEntitlementsLocked'
- **gating:** isEntitlementOn/processEntitlements feed RRuntimeZPPolicy (\[localSettingsMgr=%s,entitlementsMgr=%s\]) — the runtime policy engine; SBiz entitlement blocks Sonos Radio preinstall ('found SBiz entitlement; blocking preinstall of Sonos Radio' vs 'no SBiz entitlement; preinstalling Sonos Radio')
- **cloud_api:** GET /entitlements/api with X-Sonos-User-Id header + "Cache-Control: max-age=0"; "cloud entitlements: rc %d, http %d"
- **cache:** HTTPCacheManager-backed; stash-compare on refresh ("stashed existing entitlements to compare later"); "cache re-populated on refresh"/"TTLs updated on refresh (data unchanged)"; "Cache format unexpected"/"Corrupt Cache"/"Cache unpopulated"; cold-start only-empty warning
- **events:** entitlements for "%s" changed -> internal event + "triggering version changed muse event" (ENTITLEMENTS_CHANGED) + notifyClients; side-effects: "scheduled job to consider updating Sonos Radio" / "Sonos Business MSP"
- **methods:** `savePendingEntitlementsLocked`, `onCacheUpdate`, `scheduled refresh`, `Fetch from cloud`
- **source:** entitlementsmanager.cxx literals 0x10ebf7d0-0x10ebfdec
<details><summary>Evidence (6)</summary>

- @ 0x10ebfa1a — entitlementsmanager.cxx
- @ 0x10f9630c — entitlementsVersionChanged
- @ 0x10ebf908 — /entitlements/api
- @ 0x10ebfc8c — <Entitlement type isTrial sku startDate endDate codes> schema
- @ 0x10e9b39c — SBiz entitlement gates Sonos Radio preinstall
- @ 0x10e88d38 — RRuntimeZPPolicy ctor wires localSettingsMgr+entitlementsMgr

</details>

## `factory_reset`

**coverage** `partial`

The wipe path: a factoryReset.txt sentinel file, sonosFactoryResetFull entry, LED_MODE_FACTORY_RESET feedback, and a remote management/factoryReset muse route. Steps and what survives (registration? certs?) are not yet decoded.

**Technical description:**

factory reset machinery: a 'Factory Reset'/'Remote factory reset' CSRF-posted confirm form, /jffs/factoryReset.txt marker file ('unable to create factory reset file.', 'factory reset had errors', ': not factory reset'), LED_MODE_FACTORY_RESET pattern, sonosFactoryResetFull entry point, household-wide consequence ('device: %s %s removed from vanished list after factory reset'), and 'Invalid system settings (%s), resetting to factory defaults' as a self-heal path; muse route management/factoryReset can trigger it remotely

- binary anchors: `factoryReset.txt`, `sonosFactoryResetFull`, `management/factoryReset`, `v1/players/{playerId}/management/factoryReset`, `factoryReset.txt`, `factoryReset.txt`, `sonosFactoryResetFull`, `LED_MODE_FACTORY_RESET`, `Remote factory reset`, `<PresetNameList val="FactoryDefaults"/>`, `management/factoryReset`

- **mechanics:** <PresetNameList val="FactoryDefaults"/> is the settings-side reset verb; after reset the device broadcasts its removal so peers drop it from 'vanished' lists; corrupt system settings auto-trigger a reset
<details><summary>Evidence (8)</summary>

- @ 0x10ef824c — factoryReset.txt
- @ 0x10062b81 — sonosFactoryResetFull
- @ 0x10e7f07e — management/factoryReset
- @ 0x10e7f068 — management/factoryReset muse route
- @ 0x10ef824c — factoryReset.txt sentinel
- @ 0x10ef824c — factoryReset.txt marker
- @ 0x10f13f90 — peers remove reset device from vanished list
- @ 0x10efecdc — invalid system settings → auto factory defaults

</details>

## `favourites_model`

**coverage** `partial`

Sonos Favourites (the pinned items in the app). They live in a replicated XML store (<Favorites SchemaVersion NextFavorite>) with a sibling <Radio> section for stations; ContentDirectory projects them as the FV:2 container whose changes bump FavoritesUpdateID. You create/delete/edit them through the normal CDS CreateObject/DestroyObject/UpdateObject actions against the favourites directory object, and the cloud mirrors them via the households/groups favorites routes. Radio favourites sit under the R: prefix instead.

**Technical description:**

Sonos favourites store + ContentDirectory projection: FV:2 root container paired with FavoritesUpdateID; XML store schema recovered; mutation via CDS CreateObject/UpdateObject/DestroyObject on the dirObjFavorites vtable + muse getFavorites/loadFavorite routes

- binary anchors: `favorites.cxx`, `NextFavorite`, `sonos_favorites_version`, `FV:2`, `dirObjFavorites`, `object.item.sonos-favorite`, `replicating favorites from %s`, `r:favoriteId`

- **root_browse_map:** FV:2 -> FavoritesUpdateID; R:0 -> RadioFavoritesUpdateID; R: -> RadioLocationUpdateID; SQ: -> SavedQueuesUpdateID; S: -> ShareListUpdateID (root enumerator f_10303de4)
- **store_schema:** <Favorites SchemaVersion="%d" NextFavorite=".."> document with a sibling <Radio LastUpdateDevice="%s" Version="%u" NextFavorite="0"> section for radio favourites; NextFavorite is the replicated monotonic counter; 'replicating favorites from %s' shows household replication of the store
- **didl:** class object.item.sonos-favorite; favourite id carried in r:favoriteId under urn:schemas-rinconnetworks-com:metadata-1-0; service-derived favourites parse 'account service ID / serial number' from the sonos: URI
- **mutation:** dirObjFavorites directory object (f_1037ca04) installs an op-table (f_1037e030/f_1037e12c/f_1037e124/f_1037e134/f_103811fc/f_1038122c) driven by CDS CreateObject(impl->v\[+0x20\])/UpdateObject(v\[+0x24\])/DestroyObject(v\[+0x28\]); errors 'Invalid favorite id.' / 'Could not access favorites.' in f_1037d984; reorder exists: 'Did not move favorite (%s "%s"); rc %d' + radioFavoritesMoved event
- **cloud_routes:** v1/households/{householdId}/favorites, v1/groups/{groupId}/favorites, v1/households/{householdId}/groups/{groupId}/favorites; ops getFavorites / loadFavorite
- **migration:** legacy conversion strings: 'Successfully converted old rhapsody favorite', 'Failure converting old non-OAuth favorite' — favourites migrate with service renames/OAuth transitions
- **smapi_caps:** trFavorites (tracks), alFavorites (albums) exposed in /customsd; arFavorites (artists) present but commented out; SMAPI-side vocabulary isFavorite/canAddToFavorites/containsFavorite
- **unresolved:** exact Favorites XML element schema per-favourite; which op-table slot maps to which CDS verb; whether UpdateObject reorder or a dedicated move path drives 'radioFavoritesMoved'
<details><summary>Evidence (8)</summary>

- @ 0x10ec12ca — favorites.cxx
- @ 0x10ec0ce2 — NextFavorite
- @ 0x10304098 — root browse map literal table (FV:2/FavoritesUpdateID ...)
- @ 0x10ec0d1e — '<Favorites SchemaVersion="%d">' store schema
- @ 0x1037cab8 — dirObjFavorites object install in f_1037ca04
- @ 0x10ec13a4 — 'Invalid favorite id.' used in f_1037d984
- @ 0x10ec0f04 — urn:schemas-rinconnetworks-com:metadata-1-0/\|favoriteId
- @ 0x10ece800 — mp3/id3 probe literals in sharelist region

</details>

## `fdevent`

**coverage** `partial`

**Technical description:**

ops {removeFd,waitForEvent}; thread names fdevent.{signal.write,wait.poll,check.poll,reset.read}; EventSync %s; epoll_create1/epoll_ctl/epoll_wait error paths; fd capacity bound "%d already monitored"/"exceeded the fd capacity of %d"

- **name:** fdevent — epoll event engine
<details><summary>Evidence (1)</summary>

- @ 0x10ef3fec — fdevent block

</details>

## `feature_config`

**coverage** `partial`

**Technical description:**

GET /features/v1/config? (cache-control: no-cache); files cloudconfig.json/cloudconfig_override.json with {swVersion,hwVersion}; precedence: override > cloud-cached > cloud-persisted; "failed to fetch config: not securely registered"; "Already have fresh data. Skipping Fetch."; "failed to connect. rescheduling in 1 hour"; stale markers; FCS Cache via g_pZone

- **name:** RFeatureConfigManager — cloud feature flags
<details><summary>Evidence (1)</summary>

- @ 0x10ef3c60 — feature cfg mgr block

</details>

## `feature_flag_registry`

**coverage** `partial`

Feature flags arrive as JSON keys in the cloud-delivered settings document — not compile-time switches. Ten featureConfig* keys enumerate what's gated (SemiSleep, SmartPlay, SpotABR, Plink, Quickbonding, MetricsService...). Explains behaviour that differs between households on the same firmware.

**Technical description:**

complete compile-time feature/config flag vocabulary (48 keys): featureConfig* family keys in the cloud-config JSON doc plus enable*/disable* booleans read at init — the build's feature map showing which subsystems are switchable

- binary anchors: `featureConfigPlink`, `featureConfigSmartPlay`, `featureConfigQuickbonding`, `featureConfigZoneExperiment`, `<ZoneExperiment id=`, `/experiments`

- **mechanism:** 'featureConfig' parent key with per-feature subkeys; ZoneExperiment layer adds <ZoneExperiments><ZoneExperiment id name value defaultValue> docs + /experiments HTTP endpoint + O_ZONE_EXPERIMENTS config key + experimentId field — A/B values carry explicit defaults so absent assignment falls back to defaultValue
- **flags:**
- **unresolved:** which config file/route carries featureConfig (householdsettings.json? muse?), per-flag gate sites
- **featureconfig_keys:** `featureConfigDropoutContext`, `featureConfigHomeTheaterWifiPerfTelemetry`, `featureConfigMetricsService`, `featureConfigPlink`, `featureConfigQuickbonding`, `featureConfigSemiSleep`, `featureConfigSmartPlay`, `featureConfigSpotABR`, `featureConfigSsdpAdvertiseConfig`, `featureConfigZoneExperiment`
- **enable_keys** (43):

  ```
  enableContentAccessSetting, enableSemiSleep, enableHTSourceSleep, enableSpatialAudio, enableExternalPartnerMode, enableSpotifyConnectForAllAccts, enableSpotifySMAPIVolumeNormalization, enableVoiceDataCollection, enableSvcHomeControlLutron, enableSvcPlus, enableAmazonMusicDASH, enableAppleMusicHlsv7, enableTuneInReplacement, enableTuneInMigration, enableTrueplayDataCollection, enableSystemAPIV2, enable3ChannelSatellites, enableHTSNKv2, enableSPSDataCollection, enablePortableSurrounds, enableMaxDialogueLevel, enableRemoveMSPCredentialsFromUPnP, enableChsrcPerfOptimizations, enableUPnPEventingGNDOptimization, enableSecureAlbumArt, enableCEP20ThreadTweaks, enablePitchfork, enableSslClientCacheRefresh, enableDhcpProxyFailureTelemetry, enableOnDeviceSoundGeneration, enableRadioSocTemperatureTelemetry, enableHomeTheaterWifi6GHzFronthaul, enableTopologyReports, enableFastNetworkSwitching, enableQuickbonding, enabledSTP, enabledHT, enableTrueRoom, enableFlexibleSurroundsTuning, enableVirtualHeight, enableCloudSetting, disableWebSocketPerMessageDeflate, disableTlsRsaCiphersuites
  ```
- **notable:** enableTrueRoom (next-gen tuning), enableVirtualHeight + enableFlexibleSurroundsTuning (Atmos-era HT), enable3ChannelSatellites, enableHTSNKv2 (channel-sink v2), enableTuneInReplacement/Migration (service swap), enableSvcHomeControlLutron/enableSvcPlus (partner integrations), disableTlsRsaCiphersuites (hardening), enablePitchfork (IBT plans)
<details><summary>Evidence (6)</summary>

- @ 0x10f97b28 — featureConfigPlink
- @ 0x10f97b70 — featureConfigSmartPlay
- @ 0x10f97b3c — featureConfigQuickbonding
- @ 0x10f97ab4 — featureConfig + 10 subkeys in JSON key table
- @ 0x10ef3d34 — <ZoneExperiment id name value defaultValue> schema
- @ 0x10f97ab4 — featureConfig key table 0x10f97ab4-0x10f97bc4; enable* table 0x10f9bedc-0x10f9ccc8

</details>

## `group_object_model`

**coverage** `partial`

How zones actually group: the coordinator/satellite topology, zone storage, play-state manager and the ZoneGroupTopology event model sit here. This is the machinery behind ZoneGroupState and the zgt events clients already consume.

**Technical description:**

zone grouping internals: bonded-role enum (HT_BONDED_MASTER/SATELLITE, UNBONDED_DEVICE, stereo-pair/sub combos), coordinator ops (BecomeGroupCoordinator\[AndSource\] with GC-state cloning + VLI delegation, ChangeCoordinator, DelegatedGroupCoordinatorID), topology monitor with settle-retry, satellite lifecycle (Add/RemoveHTSatellite, recoverBondedZone FSM), per-satellite DSP protobuf + tuning push

- binary anchors: `play_state_mgr.cxx`, `zones_storage.cxx`, `/jffs/settings/zones.json`, `BecomeGroupCoordinatorAndSource`, `recoverBondedZone`, `dsp_system_satellite.bin`, `HT_BONDED_SATELLITE`

- **bonded_roles:** HT_BONDED_MASTER, HT_BONDED_SATELLITE, UNBONDED_DEVICE, BONDED_STEREOPAIR, BONDED_TO_SUB, BONDED_STEREOPAIR_AND_SUB; ZP_MODE_HT_SATELLITE; netmodes NETMODE_SATELLITE_V1/V1_WIRED/V2, STATION_SATELLITE*
- **coordinator_ops:** BecomeGroupCoordinator, BecomeGroupCoordinatorAndSource (bCloningGCState/bSourceGCClearedContent — can clone GC playback state), BecomeCoordinatorOfStandaloneGroup, ChangeCoordinator ('using local VLI txs'/'VLI State Snapshot' source hand-off, installClock, Chsnk restart to avoid seamless delegation); secondary-ZP calls rejected
- **topology:** 'start topology monitor', monitorCoordinator, 'Coordinator %s linkage broken', 'topology hasn't settled yet' retry loops, 'Bonded zone maps not consistent' + MissingBondedZoneMemberDetectedEvent
- **satellite_lifecycle:** AddHTSatellite/RemoveHTSatellite/AddBondedZones/RemoveBondedZones; recoverBondedZone FSM: retry→reduce→separate→hard-fail, 'bonded secondary orphaned', restick/unstick; sonar config cleared on add/remove; Enter/ExitConfigMode propagated to satellites; 'Satellite config override' + 'Push satellite state to UUID %s failed'
- **satellite_dsp:** per-satellite assets: dsp_preset_satellite.xml, dsp_system_satellite.bin, satellite_processor.bin; HTChProcConfig protobuf ('Could not convert loaded satellite protobuf'); satelliteChannelMap/requestedSatelliteMap/SatelliteSwitcher; bonded gain tables with volume breakpoints; ApplySatelliteTuning spectral+spatial channel tuning; 'satellite sub also receives non sub channels'
- **xml:** <ZoneGroup Coordinator=..>, <ZoneGroupState><ZoneGroups></ZoneGroups></ZoneGroupState>, <Satellites>, /xml/satellite_device.xml satellite device description
- **topology_api:**
  - **events:** `TopologyEventsReportEvent`, `TopologyGroupMemberRemovedEvent`, `InfoUpdatedEvent`, `ActiveZonesChangedEvent`, `RemoteConnectionTypeChangedEvent`, `GroupChangedEvent`, `VliTransportActionEvent`, `NewZPEvent`, `ReplicatedSettingsNeedsUpdateEvent`, `MissingBondedZoneMemberDetectedEvent`, `AVTStateLastChangedEvent`, `RemoteHTSwapStateChangedEvent`, `DeviceGoneEvt`, `GroupAdvertiseRequestEvent`, `DesignatedDeviceChangedEvent`, `Account changed event`, `MusicAccountChangedEvent`, `NewMuseHHIDEvent`, `NewLocationIdEvent`, `AreasVersionChangedEvent`
  - **methods** (21):
  
    ```
    setLocalSonarCalibrationID, informLocalNewSourceAreaIds, getGroupMembersWithDifferentVirtualLineInGroupID, getLocalOrientation, setLocalSonarState, internalPopulateSonarZoneDescription, isBondedZoneConsistent, ifBondedZoneGetNextUUID, ifBondedZoneGetNextUUIDInTopology, ifBondedZoneGetPartnerUUIDInTopology, getLocalChannelName, hasSurrounds, sonarZoneAgreesOnCalibration, informLocalVoiceStateChange, informLocalMicStateChange, informLocalTVConfigStateChange, informLocalAirPlay, informLocalOrientation, setLocalTransportStateChanged, informLocalPlayerZPChange, handleDefunctMediaServer
    ```
  - **bonded_zone:** consistency checks: "HT & Sat have inconsistent maps","Bonded zone maps not consistent. ThisZP: %s; OtherZP(%s): %s"; separation path "separateBondedZoneKeepPlaying: failed to remove bonded zone through primary %d, removing locally"; "tried to add incompatible"
  - **state:** member states PRESENT/MISSING; idle/active transitions "Became idle: %ld(B)"/"Became active"; error "topology state error, type:%s pid:%s pid count:%d gid:%s gid count:%d"; zone descs "Single Zone Description: {%s,%s,%d}"/"Zone Description: {%s,%s,%s,%d}"; peer URLs http://%d.%d.%d.%d:
  - **wmp_auth:** "Authorization Check for WMP failed: control URI: %s UUID: %s res: %hu" - WMP service auth check
  - **settings_consumers:** R_ShowRhapUPnP + R_ShowNSSServers gate media-server visibility here; VerifyThenRemoveSystemwide/Remove ops
  - **evidence:** topology.cxx literal block 0x10e8b554-0x10e8bde0
- **zones_manager:**
  - **name:** RZonesManager/zonesMgr
  - **verbs:** `museGetZoneDefinition`, `sendUpdateZoneMemberSettingsCmd`, `updateActiveZone`, `joinZone`, `activateZone`, `deactivateZone`, `RemoveHTSatellite`
  - **validation:** zone ops validation chain: zone id/def not found, invalid activeZone/channelMapSet/name, "can't update both name and channelMapSet", "update only allows add or remove, not both", "Zone contains incompatible protocol versions", "primary change not supported for HT", "update with offline primary not supported for HT", "primary unavailable: sending Remove ops to secondaries", "zoneDef %s inconsistent with cms %s"; re-activation path; "more zones active than RMuseActiveZoneList can hold"
  - **cms:** channel-map-set sync: "cms init from %s"/"cms update from pri: %s"/"cms update from sec: %s = %s + %s"
  - **active_zones_file:** <File name='activeZones'> XML; zone transitions "zone transition on primary\|secondary: zoneId %s", "primary change: %s -> %s", "offline primary: %s -> %s"
  - **events:** `ZoneMemberSettingsChangedEvt`, `ZonesDefinitionsChangedEvent`
  - **settings:** gainTrimDB \[%.2f\] apply
- **topo_events_detail:** topology_events_report.cxx: change detectors {chmap,HTsat defn,wifi mode,connection type,ch frq,wifi on,eth link,sats of GMs,local grp role,plbk corr ctx type} + "GroupCoordinator before/after: %u/%u"/"nRel b/a:%u/%u"; fields gcuid,cid:%s/%s,in:%u/%u; rate-limit "reported %ds ago:limit"; "fail:unparse cid. quit report"; names TopologyEventsReport/topologyEventsReport
<details><summary>Evidence (7)</summary>

- @ 0x10ed15f2 — play_state_mgr.cxx
- @ 0x10e96cc6 — zones_storage.cxx
- @ 0x10e752e0 — /jffs/settings/zones.json
- @ 0x10eb247c — BecomeGroupCoordinatorAndSource GC-state clone flags
- @ 0x10ebce88 — recoverBondedZone FSM strings
- @ 0x10e73ab4 — dsp_system_satellite.bin + satellite_processor.bin
- @ 0x10e878b4 — HT_BONDED_MASTER/SATELLITE role enum

</details>

## `household_settings`

**coverage** `partial`

**Technical description:**

file householdsettings.json {fileVersion,fileSchemaVersion,householdSettings}; JSON \[{version,lastUpdateDevice},\[{name:"restricted-admin",readPermission:null,writePermission:"hh-config-admin",settings:\[{explicitContentFiltering,recentlyPlayed}\]}\]\]; categories {restricted-admin,protected-admin,protected}; frozen:1 marker; "File upgraded to v%d schema"/"File overwritten due to invalid setting"; UMTracking→userMetricsTracking migration; "version incremented after invalid settings offered"; hhSwgenState swgen must be >= player; /householdsettings.json status-page ALERT

- **name:** householdsettings.json persistence
<details><summary>Evidence (1)</summary>

- @ 0x10ef43f0 — hhsettingsfile block

</details>

## `ibt_plans`

**coverage** `partial`

An 'IBT' command-plan executor ('executing ibt plan for command') gated by the enablePitchfork feature flag — likely in-band tuning/test command plans. Almost nothing decoded.

**Technical description:**

a remote-management command executor: commands named in log domain 'ibt' are compiled into 'plans' (a generated target list — 'failed to generate target list for command (%s)'), then dispatched per-target with per-target results ('\[dispatch\] dispatched (%s) to target (%s), result \[%s\]'); gated by the enablePitchfork feature flag checked at init

- binary anchors: `executing ibt plan for command`, `unsupported IBT command`, `enablePitchfork`

- **unresolved:** full command vocabulary (only 'ibt' command-name seen in dispatch compare), plan serialization format, what the targets are (players in household?), what enablePitchfork bundles
- **mechanics:** executor f_10b985c4: look up command → generate ibt plan → generate target list → for each target '\[dispatch\] dispatched (%s) to target (%s), result \[%s\]'; 'already generated ibt plan, no action taken' = idempotent re-entry; 'unsupported IBT command (%s)' rejects unknown verbs
<details><summary>Evidence (7)</summary>

- @ 0x10fac64c — executing ibt plan for command
- @ 0x10ec7903 — unsupported IBT command
- @ 0x10f9c2b4 — enablePitchfork
- @ 0x10fac64c — 'executing ibt plan for command (%s)' + dispatch rejection
- @ 0x10b985c4 — ibt plan executor: plan→target-list→per-target dispatch
- @ 0x10ec78c0 — \[dispatch\] dispatched (%s) to target (%s), result \[%s\]
- @ 0x10a581b0 — enablePitchfork gate checked twice in init fn

</details>

## `ir_decoder`

**coverage** `partial`

**Technical description:**

irdecoder.cxx: selthrd.RIRDecoder.{reset,data,except,timeout}; debouncer FSM (recent/bIsRepeat, playing/not-playing -> auto play); actions vol_up,vol_down,IR Mute,IR Input + testpoint press; decode via histogram peak detection (avgA/avgB/threshold) then pulse-width OR pulse-distance OR biphase; "Short Code not recognized"/"unrecognized %d"; read "ir: %d length: %d","IR Event read: %zd, msgcount: %u"

- **name:** RIRDecoder — IR receive/decoder
- **codes:** learn submission: "\x%02X" byte dump "Pass %d short code bytes:"; code fmt "%02x%%20"/"%02x "
<details><summary>Evidence (1)</summary>

- @ 0x10ea75d8 — irdecoder.cxx rodata

</details>

## `ir_learn`

**coverage** `partial`

**Technical description:**

htaudio.cxx IR subsystem: code lists vol_up_codes/vol_down_codes/vol_mute_codes/input_codes (bounded); learn FSM passes{1,3} redundancy checks "first and third passes have different sizes"/"don't match"; repeat styles {alternating,repeating,non-repeating}; one-button learn with timeout (UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND); config /opt/ir/irconfig.txt; cloud database http://ir.ws.sonos.com/IRCode/ — submit <IRCode><code><value><guid> XML (guid from //dev//urandom), query "Requesting: %s" -> "Code found for remote id \[%s\]"; embedded remote-name table {Sharp,LG/Haier L32D1120,Samsung,Panasonic,Toshiba,Mitsubishi,Philips,Pioneer,Dynex,RCA 46LA45RQ,Orion SLED3280,Mitsubishi WD-65638/60738,JVC JLC42BC3000/LT-19E610,Seiki LC-32B56,SuperSonic SC-240/491,ViewSonic VT4210LED/VT3205LED,Loewe}; "Denylisted pyle!"; "Outstanding codes yet to be learned: Lengths are: %d, %d, %d"

- **name:** IR learn + cloud IR database
<details><summary>Evidence (1)</summary>

- @ 0x10ea6550 — htaudio.cxx IR block

</details>

## `lechmere_wss`

**coverage** `partial`

The persistent secure-websocket channel between player and cloud ('lechmere'): RFC6455 framing carrying an inner TLV command vocabulary — this is how the cloud pushes control and the player reports state in real time. Framing is confirmed; the per-namespace command payloads aren't decoded yet.

**Technical description:**

lechmere.cxx cloud channel: RFC6455 WSS to lechmere.<env>.ws.sonos.com, negotiated subprotocol 'lechmere.<version>' (lechmere-v1 observed), inner TLV header layer ('failed to read lechmere header'), policy-key auth, app-level ping keepalive with 'TOO_MANY_UNACKED_PINGS' disconnect, and a full close-reason taxonomy driving reconnect decisions

- binary anchors: `websocket_lechmere`, `lechmere.event`, `wspmd`, `SONOS_FCS_DISABLE_PER_MSG_DEFLATE`, `SONOS_CLIENT_TOO_MANY_UNACKED_PINGS`, `SONOS_SERVER_LECHMERE_RECONNECT_LATER`, `SONOS_CLIENT_DATA_COLLECTION_OPTED_OUT`

- **endpoint:** lechmere.%s.ws.sonos.com — %s is the region/env token; Sec-WebSocket-Protocol: lechmere.%u
- **auth:** authzPolicyKeyLechmere; 'Could not parse role from lechmere policy key' — role encoded in key
- **local_ws:** websocketserver.cxx serves /api/v1/websocket and /websocket/api with RFC6455 headers; opcode logs websocket(data/ping/pong/close/cont); disableWebSocketPerMessageDeflate config key
- **framing:** RFC6455 with per-message-deflate negotiation: 'wspmd' log domain, deflate/inflate stream ops, 'expected empty deflate block', 'deflate out buffer requirement not met'; config keys SONOS_FCS_DISABLE/ENABLE_PER_MSG_DEFLATE toggle it at runtime — 'FCS' is the internal name of this channel
- **close_reasons:** standard codes GOING_AWAY/PROTOCOL_ERROR/BAD_DATA/NOT_CONSISTENT/VIOLATED_POLICY/MESSAGE_TOO_BIG/SERVICE_RESTART/TRY_AGAIN_LATER/TLS_HANDSHAKE plus SONOS_* extensions: client-side (REGISTRATION_CERT_REMOVED/CHANGED, DATA_COLLECTION_OPTED_OUT — telemetry opt-out tears down the channel, ACCESS_TOKEN_EXPIRED, TOO_MANY_UNACKED_PINGS, READ/WRITE_ERROR, CUSTOMER_ID_CHANGED, AUTH_METHOD_CHANGED); player-side (SHUTDOWN, IP_ADDRESS_CHANGED, BLUETOOTH, POWERED_OFF, UPGRADE, NEW_SSID, LOW_BATTERY, SLEEPING, RECONNECT); server-side (LECHMERE_RECONNECT_LATER — server steering, PLAYER_UNSUPPORTED)
- **keepalive:** application-level ping/pong: client disconnects on SONOS_CLIENT_TOO_MANY_UNACKED_PINGS
- **frame_format:** decoded from reader f_105d52e0: each frame starts with an 8-byte ASCII-hex header — \[protocolVersion:%02x\]\[messageType:%02x\]\[extHeaderLen:%04x\] — followed by extHeaderLen bytes of extended header, then payload. version and type are bounded small enums (rejects >6: 'Bad protocol version: %c%c', 'Bad message type: %c%c; %d', 'Bad extended header length: %c%c'); short reads -> 'failed to read lechmere header: %d' / 'could not recv extended header; expected %u read %u'.
- **handshake:** Sec-WebSocket-Protocol: lechmere.%u offered; server response's Sec-WebSocket-Protocol header is parsed back with 'lechmere.%hhu%n' sscanf (f_105d45f8) to confirm the negotiated version; the HTTP 101 Date: header is also consumed — wall-clock sync from the upgrade response
- **lifecycle:** 'IP changed. Bouncing connection' — local IP change tears the channel down (SONOS_PLAYER_IP_ADDRESS_CHANGED close reason); authzPolicyKeyLechmere carries a role field ('Could not parse role from lechmere policy key')
- **tunnel_headers:** extended-header vocabulary: 'x-sonos-method:', 'x-sonos-uri:', 'SOAPACTION:' — lechmere frames carry virtual HTTP request lines, i.e. UPnP/SOAP actions are tunnelled through the websocket as pseudo-HTTP; upgrade request adds X-Sonos-Udn; 'protocol version negotiation failed due to unknown version (%s)' on mismatch
- **status_fields:** connection-status record fields: status, protocolVer, reason, code, retry, uptimeMs, transport, closed/failed/opened — the lechmereConnection status doc
- **clock:** 'could note use Date header for trusted clock seed: %s' — the HTTP 101 Date: response seeds the trusted clock
- **auth_fields:** policy-key record fields: userId, policyKey, museVersion
- **reader_dispatch:** the reader returns a 0..10 code dispatched through a PIC jump table at 0x10ef12c8 in the ws-client read loop f_1059c088. Cases: 0-1 EVENT-class frames ('Unexpected TYPE EVENT' logged; loop continues); 2 HTTP-tunnel frame ('support for HTTP message dropped' — the HTTP-over-lechmere tunnel is deprecated/dropped in this build on the OUTBOUND client path; the tunneled-UPnP pseudo-headers seen elsewhere belong to the server side /api/v1/websocket); 3 the real inbound command frame (payload queued at ctx+0x1f8, timestamped +0x310); 4 -> f_1070d01c (registration/ack-class frame); 5 SET_CONFIG-class (registration write; errors 'SET_CONFIG failed to read'/'failed to send registration'); 6 CHECK_CONFIG-class ('CHECK_CONFIG failed to return registration'); 7 'Unrecognized message type' (reader reject); 8 'read timeout'; 9 'read error'; 10 clean end-of-frame continue.
- **wire_framing:**
  - **header:** binary frame: protocol version (2 chars) + message type (2 chars) + extended-header length + optional extended header ("Bad protocol version: %c%c","Bad message type: %c%c; %d","Bad extended header length: %c%c","could not recv extended header; expected %u read %u")
  - **request_headers:** `x-sonos-method:`, `x-sonos-uri:`, `SOAPACTION:`, `X-Sonos-Udn`, `Sec-WebSocket-Protocol:`, `Date:`
  - **negotiation:** WS subprotocol negotiation; "protocol version negotiation failed due to unknown version (%s)"; server Date: header seeds the trusted clock ("could not use Date header for trusted clock seed")
  - **config_keys:** `userId`, `policyKey`, `museVersion`
  - **conn_event:** muse event "lechmereConnection" {status,protocolVer,reason,retry,uptimeMs} with states transport/closed/failed/opened; close logged "Close code (%d) %s"; thread/log "lechmere.%hhu%n"
  - **errors:** `HTTP: Too many redirects`, `HTTP: Service unavailable`, `HTTP: Bad result`, `HTTP: Bad redirect`, `HTTP: Not authorized`, `Websocket protocol error`, `Transport: Write failed`, `Redirect interrupted`, `Error generating nonce`, `Error encoding nonce`, `Failed to create request string`, `http header parsing failed`
  - **confidence:** PROVEN framing fields + negotiation + event schema; msg-type enum values beyond type-3 envelope unresolved
<details><summary>Evidence (14)</summary>

- @ 0x10e75541 — lechmere.event
- @ 0x10ee71a0 — lechmere.%s.ws.sonos.com endpoint template
- @ 0x10ef64e0 — Sec-WebSocket-Protocol: lechmere.%u
- @ 0x10ef9d2c — lechmere policy key role parse
- @ 0x10f1706c — wspmd per-message-deflate log domain + deflate op codes
- @ 0x10f1714c — close-reason enum: RFC6455 codes then SONOS_CLIENT_/PLAYER_/SERVER_/FCS_ extensions
- @ 0x10f172b6 — SONOS_CLIENT_TOO_MANY_UNACKED_PINGS — app-level keepalive
- disassembly
- disassembly
- @ 0x10ef168f — 'IP changed. Bouncing connection'
- @ 0x10ef6568 — x-sonos-method/x-sonos-uri/SOAPACTION pseudo-headers — SOAP-over-WS tunnel
- @ 0x10ef66d8 — 'trusted clock seed' from Date header
- @ 0x10ef63f4 — lechmereConnection status field set
- @ 0x10ef63e0 — lechmere.cxx literal block: frame header fields, headers, conn event keys, error vocabulary

</details>

## `led_engine`

**coverage** `partial`

The status LED is a scripted animation system: patterns are programs of RGB steps with hold/fade times, checksummed and selected by internal state codes (R_LED_* — setup, muted, playing, broken-device, join-household...). Hardware capability flags adapt it to models with mic LEDs, mute LEDs, or only a status LED. SetLEDState's on/off is just the visible tip.

**Technical description:**

Scripted LED animation engine: <LedPatternInfo> docs hold <LedPatternEntry time led_ids repeats steps> programs of <LedStepEntry rgb hold fade> steps, serialized with cksum+flags; R_LED_* codes select the default pattern; SetLEDState toggles the user-visible on/off only

- binary anchors: `<LedStepEntry`, `R_LED_BEGIN_SETUP_MODE`, `/jffs/app/debug/sonosledmgrd.dmp`, `<LedStepEntry`, `cksum=%08x, flags=%04x`, `resumeDefaultLEDPattern`

- **program_schema:** <LedPatternInfo><LedPatternEntry time="%s" led_ids="%08x" repeats="%u" steps="%u"><LedStepEntry rgb="%06X" hold="%u" fade="%u"/>...</LedPatternEntry></LedPatternInfo>; serialized blob header 'cksum=%08x, flags=%04x repeats=%u num_steps=%u led_ids=%08x'
- **hardware_map:** setHwFeatures: bHasMicrophone, bHasMuteLED, bHasStatusLED, bHasOnlyStatusLED, bHasHardwareLedSwap, bCanSetWhiteBrightness — per-model LED capability flags; 64-bit m_lLEDFlags state word
- **state_machine:** applyLEDModeLocked tracks m_fLedBrightness, m_nextLedPatternPriorityLevel, m_lastClr, m_fade_effect; interacts with BT mode (m_bIsInExclusiveBTMode/m_bIsBTConnected) and aux toggle; feedbackFlash + executeDiagMode + updateCaptouchBrightness + setLEDBrightness entry points; 'led_set_resumeDefaultLedPattern has bFlashMode set. Returning saved pattern'
- **default_patterns:** resumeDefaultLEDPattern maps R_LED_* to patterns: R_LED_BROKEN_DEVICE, R_LED_JOIN_HH, R_LED_BEGIN_SETUP_MODE, R_LED_IN_SETUP_MODE, R_LED_MUTED, R_LED_AUDIO_OFF, R_LED_PLAYING, R_LED_HHID (+ WAC/WAC_TIMEOUT/UPGRADE/etc. in the R_LED family)
- **unresolved:** pattern priority arbitration rules, the SetLEDState vs. override stack, which patterns correspond to which R_LED codes
<details><summary>Evidence (7)</summary>

- @ 0x10e990a0 — <LedStepEntry
- @ 0x10fbb0a5 — R_LED_BEGIN_SETUP_MODE
- @ 0x10ea7f34 — /jffs/app/debug/sonosledmgrd.dmp
- @ 0x10e99048 — <LedPatternEntry> schema
- @ 0x10e990a0 — <LedStepEntry rgb hold fade> step schema
- @ 0x10fba55c — setHwFeatures LED capability flags
- @ 0x10fbb590 — resumeDefaultLEDPattern R_LED_* mapping

</details>

## `log_domain_map`

**coverage** `partial`

Every anacapa.*.log domain names a subsystem boundary — the 21 domains are effectively a module map of the binary. Useful when reading log output or /status pages.

**Technical description:**

21 anacapa.*.log sinks under /opt/log define the module boundaries; plus sibling-daemon logs and the /tmp/memorylog ring

- binary anchors: `anacapa.snf.log`, `anacapa.lechmere.event.log`, `anacapa.dc.log`, `/opt/log/anacapa.musecmdandrsp.log`, `/opt/log/anacapa.avt.play.log`

- **domains:** anacapa.log (main), alarm.job, avt.play (AVTransport playback), chsrc.state (CHSRC source bus), dc (direct control?), ext.audio.action, gm.events (GroupManagement), hdmi, ht (home-theatre), hw.events, lechmere.event (WSS channel), musecmdandrsp (muse request/response trace!), musedebug, museevt (muse events), rc.upnp, snf, spotify.debug, spotify, sps, trueplay, tv, vl (line-in)
- **siblings:** btmanager, btservice, chronyd, dropbear, ledmgr.debug, mdnsd, netstartd, sddpd, sonosledmgrd, udhcpc, wacd, wpa_supplicant
<details><summary>Evidence (4)</summary>

- @ 0x10e755e1 — anacapa.snf.log
- @ 0x10e75539 — anacapa.lechmere.event.log
- @ 0x10e754a1 — anacapa.dc.log
- @ 0x10e75434 — full /opt/log/anacapa.*.log table

</details>

## `media_player_abstraction`

**coverage** `partial`

Beneath AVTransport sits a plug-in layer of source implementations (media_player_mgr, autoplay, vli_ctrl, extaudiosrc, ai_impl_base) — each stream type (line-in, TV, Spotify, airplay...) plugs in through the same vtable. The action handlers you're using dispatch into this.

**Technical description:**

source plug-in layer under AVTransport: media_player_mgr + media_player_autoplay + media_player_vli_ctrl + extaudiosrc + ai_impl_base define the source vtable; autoplay system (StartAutoplay, AutoplayRoomUUID, AutoplayVolume, linked-zones expansion, silence thresholds, alarm/buzzer fallback) routes line-in/TV/Spotify-VLI sources to the coordinator; htaudio_autoplay.cxx handles TV autoplay; ChirpExtAudioSrc plugs acoustic input in as an ext source

- binary anchors: `media_player_mgr.cxx`, `extaudiosrc.cxx`, `ai_impl_base.cxx`, `media_player_autoplay.cxx`, `StartAutoplay`, `ChirpExtAudioSrc`

- **plugins:** media_player_mgr.cxx (manager), ai_impl_base.cxx/ai_impl (audio-input impl base), extaudiosrc.cxx + extaudiosrc_playid (external sources), media_player_vli_ctrl.cxx (virtual line-in control), htaudio_autoplay.cxx (TV), ChirpExtAudioSrc (acoustic)
- **autoplay:** StartAutoplay; GetAutoplayRoomUUID/SetAutoplayRoomUUID target room; AutoplayVolume + UseAutoplayVolume + Get/SetUseAutoplayVolume; SetAutoplayLinkedZones + 'Found %zu linked rooms during StartAutoplay'; <AutoPlay><Mode><SilentSeconds> XML + HTASilenceThresholdAutoPlaySec + 'Triggering autoplay. Ignore Silence Threshold'; AutoPlaySettingsEvent; 'lonely local line-in autoplay'; alarm path 'Failure loading autoplay %s (alarm: %d, buzzer fallback: %d)'; DEFAULT_AUTOPLAY_LINEIN + vhautoplaytv/autoplay_tv; 'preventing autoplay because operation is overridden'
- **vli_autoplay:** 'using VLI to autoplay Spotify SMAPI URI: %s', 'setTransportToVLIStreamURI; URI: %s; autoplay: %d; become gc: %d' — VLI streams carry external sources including Spotify SMAPI URIs, optionally promoting this player to group coordinator
<details><summary>Evidence (6)</summary>

- @ 0x10ecb98a — media_player_mgr.cxx
- @ 0x10ec01ea — extaudiosrc.cxx
- @ 0x10eacdc2 — ai_impl_base.cxx
- @ 0x10eb1b4c — 'using VLI to autoplay Spotify SMAPI URI'
- @ 0x10eb2930 — linked-rooms expansion in StartAutoplay
- @ 0x10f26b80 — <AutoPlay><Mode><SilentSeconds> XML

</details>

## `media_player_mgr`

**coverage** `partial`

**Technical description:**

actor model: target key {uuid,ix,port,ssl,mtls} (overlap check); "found actor for %s"/"found backup for %s"/"%s target \[%s\] for type %d resolved to %s"/"no actor available"; lifecycle register/create/shutdown; per-player config dir + anacapa_logger.toml; /localsettings.txt; Player%s naming

- **name:** mpmgr — MediaPlayer actor registry
<details><summary>Evidence (1)</summary>

- @ 0x10ecb874 — media_player_mgr.cxx

</details>

## `model_sku_vocabulary`

**coverage** `partial`

Model identifiers (ZPS9-ZPS61, S0-S9) and product names embedded for capability conditionals — which features a given hardware reports. The model→capability table hasn't been written out yet.

**Technical description:**

51 ZPSnn model identifiers enumerated in the capability-conditional table: ZPS{1,3,5,6,9,11-24,26-46,48,49,51-59,61}; capability gating is per-model-ID

- binary anchors: `ZPS9`, `HwFeatures`

- **model_ids:** ZPS1, ZPS3, ZPS5, ZPS6, ZPS9, ZPS11, ZPS12, ZPS13, ZPS14, ZPS15, ZPS16, ZPS17, ZPS18, ZPS19, ZPS20, ZPS21, ZPS22, ZPS23, ZPS24, ZPS26, ZPS27, ZPS28, ZPS29, ZPS30, ZPS31, ZPS32, ZPS33, ZPS34, ZPS35, ZPS36, ZPS37, ZPS38, ZPS39, ZPS40, ZPS41, ZPS42, ZPS43, ZPS44, ZPS45, ZPS46, ZPS48, ZPS49, ZPS51, ZPS52, ZPS53, ZPS54, ZPS55, ZPS56, ZPS57, ZPS58, ZPS59, ZPS61 (this build targets ZPS9 = Playbar/S1-era table includes newer ids)
- **unresolved:** ZPS->product-name mapping, which capabilities gate on which ids, the S0-S9 submodel series
- **capability_bits:**
  - **AUDIO_IN_MASK:** `RCA_LINE_IN`, `35MM_LINE_IN`, `DOCK_ANALOG_IN`, `USB_LINEIN`
  - **HTAUDIO_IN_MASK:** `TOSLINK_HT_IN`, `HDMI_ARC`, `HDMI_EARC`
  - **AUDIO_OUT_MASK:** `RCA_LINE_OUT`, `35MM_LINE_OUT`, `COAX_DIGITAL_OUT`, `TOSLINK_DIGITAL_OUT`, `SPEAKER_OUT`, `HEADPHONE_OUT`, `SUB_OUT`
  - **DEV_CLASS_MASK:** `2PORT_SWITCH`, `4PORT_SWITCH`, `WIFI_2GHZ`, `WIFI_5GHZ`, `CONCURRENT_2GHZ_5GHZ`, `USB_ETHERNET`
  - **buttons:** `BUTTON_PLAY_PAUSE`, `BUTTON_VOL_ROCKER`, `BUTTON_MUTE`, `CAPTOUCH_ABC`, `BUTTON_WIFIBT_MODE`, `CAPTOUCH_JOIN`, `MICROPHONE_SWITCH`
  - **features** (23):
  
    ```
    HT_SOURCE, MONO_SPEAKER, VOICE, BTCLASSIC, MICROPHONE, IR_SENSOR, IR_TRANSMITTER, NFC_SENSOR, 12V_TRIGGER, EXTENDER, STEREO_PAIR, CONTROLLER_CFG_SATELLITE, EQ_COLLECTION, TUNABLE_CROSSOVER, EQ_BALANCE, CUSTOM_SATELLITE, PORTABLE, THIRDPARTY, DETECT_SPEAKERS, SELF_TRUEPLAY, DUALBAND_STATION, WIRELESS_SONOSNET, MUST_PAUSE_FOR_AUDIOCLIP
    ```
  - **note:** ordered literal run 0x10efa2a8-0x10efa5dc bounded by RMuseFeature array check; masks group related bits
<details><summary>Evidence (3)</summary>

- @ 0x10f249a4 — ZPS9
- @ 0x10e741dd — HwFeatures
- @ 0x10f2490c — ZPSnn identifier table (two rodata runs)

</details>

## `mpegts_id3`

**coverage** `partial`

**Technical description:**

TS parse: PAT/PMT PIDs, sectlen/desclen/silen, stype (Unsupported stream type), eslen, "No audio PID"/"Audio PID is 0x%x", "non-audio and non-timed_id3 PID", PTS, peslen/payload; timed-ID3v2 extraction: tag footer detect, "Ignoring too large timed ID3 size", OOB guards, "unsupported mp3 segment"

- **name:** MPEG-TS demuxer + timed ID3 (HLS radio metadata)
<details><summary>Evidence (1)</summary>

- @ 0x10ed9380 — ts/id3 parser region

</details>

## `multi_daemon_boundary`

**coverage** `partial`

anacapad is one daemon of ~13 on the player. It pushes WiFi/network settings and PSKs to netstartd over /tmp/netstartd.ipc and receives connection-type updates back; LED, Bluetooth and power daemons get /X-external HTTP routes; each daemon has .dmp crash-report machinery. Most device behaviours (WiFi join, LED, BT pairing) are actually owned by the siblings.

**Technical description:**

anacapad coordinates ~13 sibling daemons over /X-external HTTP routes + /tmp/netstartd.ipc: netstartd gets netsettings/PSK pushes and satellite notifications, reports connection-type updates back; per-daemon crash machinery (.dmp/.properties/_backtrace/count files) and /opt/log sinks | netstartd client side (ipc_msg.cxx region): connect.sendMessageLocked hello handshake; performReset-triggered reconnect; deferral "Deferring IPC reconnect"; timeout "attempting reconnect (retries=%u)"; "Bad IPC message received (%d %d %d)"; transport threads selthrd.RIPCHandler.{reset,data,except,timeout}; control msgs "Disabling/Enabling networking","Signaling start/end of network connectivity test"

- binary anchors: `/btmanager-external`, `/netstartd-external`, `wacd.log`, `sddpd.log`, `/tmp/netstartd.ipc`, `netstartd hello`, `sonospowercoordinator.dmp`

- **ipc_routes:** /anacapad-external, /btmanager-external, /netstartd-external, /sonosledmgrd-external, /sonospowercoordinator-external, tpapi-external-endsong
- **netstartd_contract:** socket /tmp/netstartd.ipc + /tmp/netstartd.pid; handshake 'netstartd hello'; anacapad->netstartd: 'Pushed netsettings update to netstartd', 'Pushed PSK update to netstartd', satellite-addition notify, 'signaling netstartd (%s) %s'; netstartd->anacapad: 'Received netsettings update from netstartd', 'Got connection type update from netstartd: \[%s\]'
- **crash_machinery:** per-daemon *.dmp + *.properties + *_backtrace strings + CrashCount/count files (sonospowercoordinator, btmanager, netstartd); logs /opt/log/{netstartd,sonosledmgrd,btmanager}.log + /jffs/netstartd_prev.log + /jffs/app/debug/*.dmp
- **daemons:** anacapad, netstartd (network), btmanager (Bluetooth), sonosledmgrd (LEDs), sonospowercoordinator (power), wacd (WAC setup), mdnsd, sddpd, chronyd, dropbear (SSH), udhcpc (DHCP), wpa_supplicant, upgrade_mgr
<details><summary>Evidence (8)</summary>

- @ 0x10ea7f20 — /btmanager-external
- @ 0x10ea7f70 — /netstartd-external
- @ 0x10e7573d — wacd.log
- @ 0x10e756f9 — sddpd.log
- @ 0x10ea7ec4 — /anacapad-external route string
- @ 0x10ef601c — /tmp/netstartd.ipc socket path
- @ 0x10efab18 — 'Pushed netsettings update to netstartd'
- @ 0x10ea7cc0 — per-daemon .dmp/.properties/backtrace crash files

</details>

## `muse_semantics`

**coverage** `partial`

The 'muse' API is Sonos's real product API — the REST-style surface the app talks to over the cloud/websocket channel. 525 routes are catalogued: every SOAP service is mirrored as an upnp* proxy (call + subscribe), and native namespaces cover players, groups, playback sessions, settings, home theater, alarms, timers, voice, trueplay/trueroom tuning, playlists, diagnostics and 'pinewood' remote control. Per-route request/response schemas remain the open work.

**Technical description:**

the muse API is the real product surface: 525 route strings, organized as households(282)/players(176)/groups(46)/playbackSessions(12)/users/devices/services namespaces; every SOAP service is mirrored as an upnp* proxy namespace; native resources cover settings, playback, hardwareStatus, positioning, homeTheater, pinewood, zones, authorization, timers, virtualLineIn, playerVolume, trueroom, trueplay, playlists, musicServiceAccounts, voice, systemReporting, localContentLibrary, networkTest, alarms, diagnostics, groupVolume

- binary anchors: `v1/households/{householdId}`, `muse_async_command_handler_impl.cxx`, `v1/players/{playerId}/upnpZoneGroupTopology/subscription`, `v1/households/{householdId}/settings`, `pinewood`

- **topology:** v1/households/{householdId}/... is the household-scoped parent; most resources also exist unscoped (v1/players/{playerId}/...); groups/{groupId} for playback coordination; playbackSessions/{sessionId} for cloud-queue sessions
- **upnp_proxy:** upnpAVTransport, upnpAlarmClock, upnpAudioIn, upnpConnectionManager, upnpContentDirectory, upnpDeviceProperties, upnpGroupManagement, upnpGroupRenderingControl, upnpHTControl, upnpMusicServices, upnpQueue, upnpRenderingControl, upnpSystemProperties, upnpVirtualLineIn, upnpZoneGroupTopology — each exposes call + subscribe/renew/unsubscribe (logicalSID) triplets, i.e. full SOAP-over-muse proxying incl. eventing
- **native_namespaces:** players, groups, playback, playbackSessions, settings, hardwareStatus, positioning, homeTheater, pinewood, zones, devices, authorization, timers, virtualLineIn, playerVolume, trueroom, trueplay, households, playlists, musicServiceAccounts, voice, systemReporting, localContentLibrary, networkTest, alarms, diagnostics, groupVolume
- **unresolved:** per-route request/response schemas; what pinewood and trueroom are (internal codenames — pinewood plausibly voice/control, trueroom plausibly next-gen room tuning)
- **verbs_note:** per-resource verb table decoded — see shared_primitives.muse_route_verbs for the complete inventory; highlights: authorization resource carries the invite/token auth model; hardwareStatus exposes battery/PoE/water/mic-switch/ship-mode verbs for other hardware; settings is privilege-tiered (public/protected/restricted-admin)
- **transport_constraint:** upnp* proxy subscribe/renew/unsubscribe are rejected unless the transport is WSS: 'Invalid transport: WSS is required', 'Invalid namespace: UPnP subscribe/renew/unsubscribe not supported'. The wire mechanism: lechmere frames carry pseudo-HTTP headers (x-sonos-method/x-sonos-uri/SOAPACTION) so UPnP calls tunnel as virtual requests; event subscription requires the persistent channel because there's no callback URL over HTTP
- **auth_model:** household-scoped authorization namespace: authorization/tokens → resolveToken ('Request to resolveToken successful \[token=******%s\]' — only token tail logged); authorization/policy/{policyKey} → getPolicyKey (fetches named policy keys like authzPolicyKeyLechmere); authorization/permissions/{role} → getPermissions (role→permissions map); invite flow createInvite→authorization/invite, redeemInvite→authorization/redeem (+deleteInvite) — how new players/users join a household; players/{id}/authorization/{authorizeDevice,authenticateClient}; authorization/users lists household users
- **artifact:** one registration literal is malformed: 'v1/\[error: 'none' is not a valid target\]/authorization/invite' — an error string was embedded where a path param failed to bind, showing routes are assembled param-by-param at registration
- **outbound_auth:** outbound calls use 'Authorization: Bearer %s' or 'Authorization: Basic %s' plus X-Updated-Authorization/X-Goog-Updated-Authorization response handling; token lifecycle events authTokenChanged/authTokenRefreshed; SMAPI refreshAuthToken op at sonos.com/Services/1.1; getDeviceAuthToken warns when credentialType != OAuth
<details><summary>Evidence (8)</summary>

- @ 0x10e7bf40 — v1/households/{householdId}
- @ 0x10ef9166 — muse_async_command_handler_impl.cxx
- @ 0x10e85990 — upnp* proxy namespace routes (call/subscribe/renew/unsubscribe)
- @ 0x10e838ac — v1 players/households/groups route family
- @ 0x10f02958 — 'Invalid transport: WSS is required' + UPnP subscribe rejections
- @ 0x10e7c2ac — authorization/* route family: tokens/policy/permissions/invite/redeem/users
- @ 0x10e7c3ec — 'v1/\[error: ...not a valid target\]/authorization/invite' malformed registration literal
- @ 0x10ef9be8 — resolveToken success log masks token to last chars

</details>

## `play_history`

**coverage** `partial`

Recently-played tracking: plays are recorded by the track monitor/recorder, buffered, and POSTed to the household history API with strict completeness rules; the app fetches an ETag-cached list; clearHistory/removeHistoryItem ops exist. Ratings (like/dislike) exist but only for the cloud queue.

**Technical description:**

historymgr.cxx play-history pipeline: TrackPlayRecorder/TrackPlayMonitor capture plays, entries buffered and POSTed to the household history API with completeness gating + buffer-full drops; getHistory is ETag-cached; deleteHistory/removeHistoryItem/clearHistory ops; ratings via playbackMetadata/ratings — explicitly 'only implemented for cloud queue'

- binary anchors: `historymgr.cxx`, `<WebSocketHistory`, `deleteHistory`, `v1/households/{householdId}/history`, `postHistory`, `<RestHistory>`, `Updating history cache`, `rating is only implemented for cloud queue`

- **cloud_routes:** v1/households/{householdId}/history (getHistory/postHistory), v1/households/{householdId}/history/{id} (removeHistoryItem), clearHistory; ratings: v1/groups/{groupId}/playbackMetadata/ratings + household-scoped variant; per-item 'item/%s/rating'
- **xml:** <History> container; sibling <RestHistory>/<WebSocketHistory> type tags
- **caching:** 'Updating history cache: \[status\]\[key\]\[etag\]\[cache-control\]', 'getHistory is serving the cache', lazy regen 'file not available yet, generating (%d). Elapsed=%ums, current eTag=' — server-driven ETag caching
- **gating:** 'History is disabled, history is not POSTed' — opt-out gate; entries dropped when 'resource incomplete - name, type, or objectId missing' / 'group incomplete - name, id, or coordinatorId missing'; 'Failed to queue history entry, buffer full' + 'Post History Buffer Cleared'
- **ratings:** r:rating DIDL element + urn:schemas-rinconnetworks-com:metadata-1-0/\|rating; 'rating is only implemented for cloud queue', 'cloud queue server does not supporting rating', 'rating.type is not recognized'
- **pipeline:** trackplayrecorder.cxx (TrackPlayRecorder) + trackplaymonitor.cxx (selthrd.RTrackPlayMonitor.* select-thread events: reset/data/except/timeout) feed the manager; O_TRACKPLAYBASE_URL / O_HISTORY_SERVICE_URL config keys; historyVersionChanged + postHistoryConfig events; 'Securely Registered' gate on getHistory
<details><summary>Evidence (7)</summary>

- @ 0x10ec49da — historymgr.cxx
- @ 0x10f01174 — <WebSocketHistory
- @ 0x10ec4d68 — deleteHistory
- @ 0x10e7e1d8 — v1/households/{householdId}/history route
- @ 0x10ec4928 — ETag cache update log
- @ 0x10ec4a90 — 'History is disabled, history is not POSTed'
- @ 0x10eb0bb8 — 'rating is only implemented for cloud queue'

</details>

## `playlist_parsers`

**coverage** `partial`

Below the URI layer sit real playlist parsers: ASX/WMP (mswmext), M3U (x-mpegurl), Apple HLS playlists (vnd.apple.mpegurl), DASH manifests. They turn playlist URLs into the track lists the queue consumes.

**Technical description:**

iterate{ASX,M3U,WLP,PLS}PlayList; ASX <ref href= + entryref; linkUrl= extraction ("found linkUrl"); Post-stream readData dump {bytesLeft,len,buf}

- **name:** playlist sniffers
<details><summary>Evidence (1)</summary>

- @ 0x10ed1854 — play_state_mgr region

</details>

## `qplay`

**coverage** `partial`

**Technical description:**

QPlay:2 X_QPlay_SoftwareCapability xmlns:qq=tencent.com in device description; #QPLAY_SUPPORT# placeholder; action QPlayAuth; updateSharedTQPlayMode; no seed/code exchange or control channel found — stub-grade support

- **name:** QPlay (Tencent) — minimal presence in this build
<details><summary>Evidence (1)</summary>

- @ 0x10ef8cc6 — QPlay:2 capability + #QPLAY_SUPPORT# + QPlayAuth

</details>

## `qplay_protocol`

**coverage** `partial`

Tencent's QPlay protocol (QQ音乐 casting). Only the QPlayAuth SOAP action is documented; the wider protocol — key derivation, the control channel, why it has a Control route but no Event route — is still undocumented.

**Technical description:**

Tencent QPlay support: /QPlay/Control SOAP endpoint (no matching /QPlay/Event route — the only service missing its event pair), a QPlayAuth action taking Seed/Code/MID/DID arguments (seed→code auth handshake: controller sends Seed, device answers with a Code computed from MID machine-id and DID device-id), a shared-T QPlay mode with context restrictions ('Calling updateSharedTQPlayMode in bad context!'), compile flag #QPLAY_SUPPORT#, and the device-description capability <qq:X_QPlay_SoftwareCapability>QPlay:2</qq:X_QPlay_SoftwareCapability>

- binary anchors: `urn:schemas-tencent-com:service:QPlay`, `QPlayAuth`, `QPlay:2`, `updateSharedTQPlayMode`, `#QPLAY_SUPPORT#`, `updateSharedTQPlayMode`, `#QPLAY_SUPPORT#`, `QPlay:2`, `QPlayAuth`, `/QPlay/Control`

- **unresolved:** the post-auth control channel (UDP keepalive/position reports in public QPlay docs), how MID/DID are generated, and the replay/validity rules on Seed
- **soap:** /QPlay/Control registered; QPlayAuth dispatch site 0x1073a4f0 does strcmp on the action name then calls vtable+0x14/+0x38 on the action object; sibling function at 0x1073a5d0 initializes string-arg records for Seed (via arg-parser f_1056157c), then Code, MID, DID
- **auth_args:** QPlayAuth args: Seed (in), Code, MID, DID — matches the public QPlay auth scheme where the speaker derives an auth code from a controller-supplied seed bound to its IDs
<details><summary>Evidence (7)</summary>

- @ 0x10f11d58 — QPlayAuth
- @ 0x10ef8cc0 — qq:X_QPlay_SoftwareCapability = QPlay:2 in device description
- @ 0x10ef8cc0 — <qq:X_QPlay_SoftwareCapability>QPlay:2</qq:...> device-description element
- @ 0x10ea8db4 — updateSharedTQPlayMode context guard
- @ 0x1073a4f0 — QPlayAuth strcmp dispatcher → vtable calls
- @ 0x10f11d64 — 'Seed' arg literal (f_1056157c arg-parser site 0x1073a61c)
- @ 0x10f11d6c — 'MID' + 'DID' arg literals adjacent

</details>

## `queue_persistence`

**coverage** `partial`

How the queue survives reboots: saved queues are an XML document (.rsq) of SavedQueue+Track elements written atomically via a .tmp rename with a .d.rsq backup; the live queue persists as trackqueue.rsq; both are validated at boot and on replication. The SQ: object prefix exposes them to ContentDirectory and the SavedQueuesUpdateID variable tracks changes.

**Technical description:**

.rsq on-disk queue format: savedqueues.rsq is a <SavedQueues LastUpdateDevice Version Next> XML doc of <SavedQueue Id Curated NumTracks> elements each holding <Track URI= MD=> entries; live queue persists as trackqueue.rsq; atomic write via .tmp rename + .d.rsq backup; validated at boot and on replication receipt

- binary anchors: `savedqueues.rsq`, `<SavedQueues`, `trackqueue.rsq`, `<SavedQueue Id=`, `<Track URI=`, `savedqueues.rsq.tmp`, `trackqueue.rsq`

- **schema:** <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"> / <SavedQueue Id="..." Curated="..." NumTracks="..."> / <Track URI="..." MD="..."/> / </SavedQueues>
- **files:** `/jffs/settings/savedqueues.rsq (file:/// URI form)`, `savedqueues.rsq.tmp (atomic write staging)`, `savedqueues.d.rsq (backup/dirty variant)`, `trackqueue.rsq + /trackqueue.rsq#0 fragment (live queue)`
- **semantics:** 'Version not valid'/'Num tracks not valid'/'SavedQueue file at boot is not valid'/'Replicated SavedQueue file is not valid' — validated on read; 'Add Track Move range: %u-%u to %u' reorder mechanics; 'Migrated tracks for account sn=%u' — account migration rewrites saved queues; application/gzip string nearby suggests the replicated/transport form can be gzipped
- **related_actions:** Queue service: CreateSavedQueue, AddURIToSavedQueue, ReorderTracksInSavedQueue, RemoveSavedQueue operate on this store; SavedQueuesUpdateID is the change counter; SQ: object-ID prefix projects saved queues into ContentDirectory
- **name:** tqueue.cxx track-queue engine
- **transactions:** append protocol: beginAppend/cancelAppend/commitAppend/commitAppend(replace) with transaction IDs ("Append transaction ID mismatch" aborts); ReplaceAll index map "search c:%d/%d m:%d r:%d cti:%d/%d" + validity "(%u > %u)" + "old:%d-%d new:%d-%d cur:%d new:%s/%d"
- **stores:** persistence file trackqueue.rsq; stores trackQueue + trackQueueRAM; TQD context encoding ("TQD context decoded len %zu exceeds buffer len %zu")
- **metadata:** trackMdCache + savedq_mdcache; fallback chain enqueued -> DIDL initFromDIDLLite -> cached metadata -> "Loading from CSV extra md" -> initFromTrackMd; fetch fields "dc:title,upnp:artist,upnp:album,res@duration,res"; duration/extra-MD update ops
- **playmodes:** `NORMAL`, `SHUFFLE_NOREPEAT`, `REPEAT_ALL`, `SHUFFLE_REPEAT_ONE`
- **events:** playmodelEvent {eventType,curationState}; "setting link URL: %s" on isAd tag; trackQueueSummary name
- **queue_xml:** queue doc: <QueueID val="%.20s"/><QueueOwnerID val="%s"/><UpdateID val="%u"/><Curated val="..."/>; fields {QueueID,QueueOwnerID,QueueOwnerContext,QueuePolicy,EnqueuedURIsAndMetaData,CurrentTrackIndex,NewCurrentTrackIndices}; verbs {AddMultipleURIs,AddURI,AttachQueue,Backup,CreateQueue,RemoveAllTracks,RemoveTrackRange,ReorderTracks,ReplaceAllTracks,SaveAsSonosPlaylist}; policy flags {fullTrackOnly,allowShuffle,allowRepeat,cacheOnPause,stopOnError,clearOnEnd,pauseAtEnd,repeatLastTrack}
<details><summary>Evidence (7)</summary>

- @ 0x10ed3104 — savedqueues.rsq
- @ 0x10ed3164 — <SavedQueues
- @ 0x10e93f98 — trackqueue.rsq
- @ 0x10ed3448 — <SavedQueues LastUpdateDevice=.. Version=.. Next=..> root
- @ 0x10ed350c — <SavedQueue Id=.. Curated=.. NumTracks=..> element
- @ 0x10ed34f4 — <Track URI=.. MD=..> entry element
- @ 0x10ed329c — file:///jffs/settings/savedqueues.rsq

</details>

## `runtime_flag_files`

**coverage** `partial`

A set of sentinel files in /tmp and /var/run flip device behaviour at runtime: device_unlocked_flag, brokendevice, wifidisabled, crashed_play_state, event_preserve, wac_mode, netmanager_extender_flags, systemtimeoffset... They are the mechanism behind diagnostics, devmode and setup states.

**Technical description:**

runtime state is driven by sentinel files: /tmp flags (device_unlocked_flag, brokendevice, wifidisabled, htdocs_locked, crashed_play_state, anacapa-has-run, fresh_hh.txt, anacapa_prevent_crashdump_upload, sonosConcurrencyUnrecoverableError), /var/run mode files (wac_mode, netstart_mode, netmanager_extender_flags, systemtimeoffset), /tmp/memorylog 4-file ring + .old copy, /tmp/smb/ mount workspace, /tmp/backtrace + diagstdout/diagstdin diag scratch, /tmp/event_preserve + event_reporter_v3 buffers

- binary anchors: `/tmp/device_unlocked_flag`, `/tmp/brokendevice`, `/tmp/memorylog`, `/proc/ath_rincon/fullstatus`, `/tmp/memorylog`, `/var/run/wac_mode`, `/jffs/settings/householdsettings.json`

- **flag_semantics:**
  - **/tmp/device_unlocked_flag:** set by the /unlock + /devunlock + /mfgunlock flow; gates dev features
  - **/tmp/brokendevice:** device marked faulty; drives R_LED_BROKEN_DEVICE + /status
  - **/tmp/wifidisabled:** radio killed (likely until reboot); pairs with /var/run/netmanager_extender_flags
  - **/tmp/htdocs_locked + /opt/htdocs_locked:** locks the local HTTP tree
  - **/tmp/crashed_play_state:** playback state left behind on crash for postmortem
  - **/tmp/anacapa-has-run:** first-boot marker for anacapad
  - **/tmp/fresh_hh.txt:** fresh/new-household flag
  - **/tmp/anacapa_prevent_crashdump_upload:** opt-out of crash upload
  - **/tmp/sonosConcurrencyUnrecoverableError:** fatal threading fault record
  - **/tmp/memorylog/log.0-3 + memorylog.old/:** in-RAM log ring snapshots preserved across crash
  - **/tmp/event_preserve + event_reporter_v3 (+ jffs copy):** queued diagnostic events
  - **/var/run/wac_mode:** WAC setup mode state (wacd)
  - **/var/run/netstart_mode:** netstartd operating mode
  - **/var/run/netmanager_extender_flags:** SonosNet extender config
  - **/var/run/systemtimeoffset:** persisted clock offset (SNTP)
- **persistent:** jffs flash: settings/{alarmclock.xml,areas.json,cloudconfig.json,householdsettings.json,zones.json,zpMetricsConfigV2.xml}, localsettings.txt, irconfig.txt, persist/ssh/dropbear_ecdsa_host_key, sys/log/setup*/ boot logs, shadow/stats, recovery+upgrade+watchdog logs; /opt/conf + /jffs/conf anacapa.conf (jffs overrides opt)
- **hardware_if:** /proc/ath_rincon/* (SonosNet radio: device, fullstatus, mibcc, nf, phyerr, roam, station, status, dfs + ath1 variant); /proc/driver/{accel,audioctl,fpga/{circ,data,reg/all},gravity-vector,ledctl/status,tas5708 (amp),tdm/{regs,rxring,stats,txring},temp-sensor}; /dev/{audioctl,dsp,chk,mtd/0}; /proc/fs/cifs/DebugData
<details><summary>Evidence (6)</summary>

- @ 0x10efff88 — /tmp/device_unlocked_flag
- @ 0x10ef4e9c — /tmp/brokendevice
- @ 0x10e75afc — /tmp/memorylog
- @ 0x10e75764 — /proc/ath_rincon/* + /proc/driver/* interface table
- @ 0x10e7525c — /jffs/settings/* persistent store paths
- @ 0x10e75bcc — /tmp flag-file cluster

</details>

## `scrobbler`

**coverage** `partial`

Last.fm scrobbling is built in: the player handshakes with post.audioscrobbler.com (Audioscrobbler protocol 1.2), then POSTs each played track as form fields (artist/title/timestamp/album/MBID...). On a BADTIME handshake it recovers by reading the HTTP Date: header. A newer ws.audioscrobbler.com/2.0 API is also linked. Which account it scrobbles for and the exact trigger policy are still unresolved.

**Technical description:**

Audioscrobbler/Last.fm submission client implementing protocol 1.2 over raw sockets: GET handshake to post.audioscrobbler.com, form-encoded scrobble POSTs, BADTIME Date-header recovery, OK-response check; also embeds ws.audioscrobbler.com/2.0 for the newer API

- binary anchors: `http://post.audioscrobbler.com/`, `https://ws.audioscrobbler.com/2.0/`, `scrobbling submission %s`, `last.fm-radio-http`, `/?hs=true&p=1.2&c=`, `&a\[0\]=`, `BADTIME -- stealing time from Date: header`

- **handshake:** GET /?hs=true&p=1.2&c= HTTP/1.1 to http://post.audioscrobbler.com/ (c= = client id); service token 'lastfm'; on BADTIME response it logs 'BADTIME -- stealing time from Date: header' and resyncs clock from the HTTP Date: response header
- **submission:** Raw 'POST %s HTTP/1.1' + HOST/CONNECTION: close/CONTENT-TYPE: application/x-www-form-urlencoded/CONTENT-LENGTH template; body fields 's=' (session from handshake) then per-track '&a\[0\]=' artist '&t\[0\]=' title '&i\[0\]=' timestamp '&o\[0\]=' source '&r\[0\]=&l\[0\]=' rating+length '&b\[0\]=' album '&n\[0\]=' tracknumber '&m\[0\]=' MBID — the classic submissions-protocol array
- **transport:** Owns its own connection ('scrobbling openConnection to %s %s failed'), not the shared HTTP client; checks 'OK' status line ('Scrobbling failed. Status returned: %s')
- **endpoints:** `http://post.audioscrobbler.com/ (handshake + legacy submission)`, `https://ws.audioscrobbler.com/2.0/ (v2 API, usage unresolved)`, `last.fm-radio-http URI scheme (func ~0x1041d43c)`
- **result_codes:** R_LASTFM_BAD_ACCOUNT, R_LASTFM_BAD_SUBLEVEL, R_LASTFM_NO_ACCOUNT, R_LASTFM_NO_CONTENT, R_LASTFM_STREAM_LIMIT
- **unresolved:** submission trigger policy (when a track scrobbles), queueing/retry on failure, where session creds live (SystemProperties?), which player state gates scrobbling, ws.audioscrobbler.com/2.0 usage
- **endpoint:** https://ws.audioscrobbler.com/2.0/ (Audioscrobbler 2.0 REST); xmlpost CONTENT-LENGTH; "openConnection to %s failed"; "Data overflowed; ignore submit"
<details><summary>Evidence (8)</summary>

- @ 0x10ee4c18 — http://post.audioscrobbler.com/
- @ 0x10f0e118 — https://ws.audioscrobbler.com/2.0/
- @ 0x10ee4d64 — scrobbling submission %s
- @ 0x10eccfcc — last.fm-radio-http
- @ 0x10ee4c38 — '/?hs=true&p=1.2&c=' handshake path template
- @ 0x10ee4ce4 — POST template + form fields &a\[0\]=..&m\[0\]= at 0x10ee4cd4-0x10ee4df4
- @ 0x10ee4ca0 — 'BADTIME -- stealing time from Date: header'
- @ 0x105240c8 — submission builder in f_105236c8

</details>

## `semisleep_power`

**coverage** `partial`

A suspend/resume engine: featureConfigSemiSleep plus powerWakeupFromSemiSleep/AmplifierPowerStateChanged/DirectControlIsSuspended strings indicate players can enter a low-power 'semi sleep' and resume — relevant to idle latency and why a sleeping player can lag on first command. Not yet decoded.

**Technical description:**

low-power 'SemiSleep' suspend/resume: gated by featureConfigSemiSleep/enableSemiSleep + semiSleepConfig cloud config; 'Supported only on suspendable devices' capability check; suspends VLI sessions (onVirtualLineInSuspendSession, AHA_SUSPEND_VLI_SESSION, SUSPEND_SESSION op), playback sessions (muse playbackSession/suspend verb), cloud queue (during snooze/alarm), and local timers track suspend ('considering suspend'); group topology marks suspended members ('Found Suspended Rooms While Processing %s Group Info') | Local timers (timers_impl.cxx / MuseTimerImpl): ops set/set-duration/set-relative-duration/create/delete/pause-delete/pause/resume each log "...(considering suspend) %s" on failure - suspend gates every timer mutation; timers persist across suspend in SQLite table timers(id TEXT PK, trigger_time TEXT, total_duration INTEGER, triggered NUMERIC) @0x10edcf88; "Unable to remove time on a ringing timer" guards firing timers. | Pause persistence: paused_timers(id PK, remaining_seconds, paused_utc_time, total_duration) @0x10edd018 — parked timers survive suspend; resume recomputes.

- binary anchors: `enableSemiSleep`, `featureConfigSemiSleep`, `powerWakeupFromSemiSleep`, `DirectControlIsSuspended`, `semiSleepConfig`, `powerWakeupFromSemiSleep`, `powerWakeupFromSemiSleep`, `<r:DirectControlIsSuspended val="`, `AmplifierPowerStateChangedEvent`, `featureConfigSemiSleep`, `semiSleepConfig`

- **evidence_bits:** featureConfigSemiSleep + semiSleepConfig JSON key in cloud config; powerWakeupFromSemiSleep wake entry point; '<r:DirectControlIsSuspended val=' is an r:-namespace replicated element; AmplifierPowerStateChangedEvent; SONOS_PLAYER_SLEEPING and SONOS_PLAYER_LOW_BATTERY are lechmere close reasons — suspension tears down the cloud channel
- **fsm_bits:** entry: UserSuspend/Suspend and reset/int_internalSuspend → 'suspending stop'/'suspendSession'; state: isSuspended/suspended + <r:DirectControlIsSuspended> replicated element + 'suspend bypass flag' gating LED apply; wake: powerWakeupFromSemiSleep; 'registration during suspend' queues/defers registration
- **errors:** ERROR_PAND_SUSPENDED (Pandora op fails while suspended); SONOS_PLAYER_SLEEPING/LOW_BATTERY lechmere close reasons
<details><summary>Evidence (12)</summary>

- @ 0x10e86d24 — enableSemiSleep
- @ 0x10f97b58 — featureConfigSemiSleep
- @ 0x10e86c60 — powerWakeupFromSemiSleep
- @ 0x10eb2c7b — DirectControlIsSuspended
- @ 0x10e86d24 — enableSemiSleep + powerWakeupFromSemiSleep
- @ 0x10f9c084 — semiSleepConfig JSON key
- @ 0x10e86c5d — powerWakeupFromSemiSleep wake entry point
- @ 0x10eb2c78 — <r:DirectControlIsSuspended> replicated state element
- @ 0x10f01734 — suspended rooms tracked in group info
- @ 0x10f0408c — AHA_SUSPEND_VLI_SESSION op
- @ 0x10fba624 — LED apply gated by suspend bypass flag
- @ 0x10edccbc — timers_impl.cxx literal block: timer op logs + SQLite DDL

</details>

## `settings_replication`

**coverage** `partial`

Household state is kept in sync by a replication protocol: each named store (accounts, netsettings, favourites, saved queues, areas) has a version+format handshake and per-item transfers between players; incompatible or malformed data gets the offending setting denylisted and the peer quarantined. This is why a setting changed on one player appears everywhere — and why joined players converge.

**Technical description:**

the household replication bus: per-setting transfers ('replicateOne from %s to %s setting %u version %u') with a version+format negotiation ('deciding whether to accept replicated list from: %s; ver: %u format: %u'); per-setting denylisting on badFormat/badEncoding; a separate player-level quarantine subsystem enforcing admission policy (HTTPS required, known user, secure reg required) with scheduled rechecks; suppressed while unregistered

- binary anchors: `replicated_settings.cxx`, `<ReplicationOperation`, `NextFavorite`, `<ReplicatedNetSettings`, `replicateOne from %s to %s`, `X-Sonos-Denylisted`, `REPLICATION_IN_PROGRESS`

- **envelope:** <Replication><ReplicationOperation>%s</..><ReplicationResult>%d</..><ReplicationPlayer>%s</..><ReplicationTime>%s</..></Replication></AccountsInfo>
- **negotiation:** 'replication skipped: local fmt %u, remote fmt %u' — format-version handshake per store; 'ignoring replicated file: incompatible schema'
- **failure_taxonomy:** denylisted setting / badFormat / badEncoding / bad algorithm / bad version / bad version+last-update-id / temp file failure — offenders denylisted ('denylisting replicated setting %u, unknown or blocked', 'Denylisted pyle!'), peers quarantined via <QuarantinedDevices> + X-Sonos-Denylisted header
- **streams:** accounts (musicAccountReplicationPush/Pull + tombstone migration), netsettings (<ReplicatedNetSettings LastUpdateDevice Version FileSchemaVersion>), favourites, savedqueues, areas (replicatedAreas), TV channel ('TvPreplicating %zu bytes for resourceId: %u')
- **events:** ReplicatedSettingsChangedEvent, ReplicatedSettingsNeedsUpdateEvent, informReplicationAndNotify/ForDestroy hooks; 'Settings Replication changed SN Disable from %d to %d (source: %s)'
- **replicateone_failures:** taxonomy: openStream fail (0x%08x), filesize bad/unavail, bad version/last-update-id, denylisted setting, badFormat → denylisting, badEncoding → denylisting, bad version, bad algorithm, 'Cannot open temp file'
- **quarantine:** device-level quarantine tracked in <QuarantinedDevices> with QuarantineReason; reasons: 'HTTPS required', 'unknown user', 'secure reg required'; discovery errors trigger it ('Discovery for player %s resulted in quarantine'), QUARANTINE_RECHECK reschedules ('Next quarantine check in %lld seconds'), 'Player %s removed from quarantine'
- **account_replication:** separate accountReplication push/pull channels ('replicating accounts file from %s'); tombstoned accounts migrated ('Migrated tombstoned %s replication account'); services denylisted after repeated failures ('too many failures, denylisted service %u')
- **schemas:** <ReplicatedNetSettings LastUpdateDevice Version FileSchemaVersion>, <Replication><ReplicationOperation>/<ReplicationResult>/<ReplicationPlayer>/<ReplicationTime>, <ReplicatedSettingsState>, <QuarantinedDevices>
- **wire_format:**
  - **transport:** HTTP fetch per setting: replicateOne from %s to %s setting %u version %u -> URI "%s%s?id=%u"; staged via setrepl.tmp temp file
  - **headers:** `X-RINCON-LAST-UPDATE-DEVICE:`, `X-RINCON-CONTENT-FORMAT:`, `CONTENT-ENCODING:`, `X-RINCON-SIGNATURE:`
  - **model:** numbered setting ids registered per service (addServiceSetting); "No service to handle offered setting: s=%u v=%u"; offerUpdatedSetting {src,set,ldev,ver,fmt}; informLocalReplicatedSettingVersion {setting,LUD,version}; device template RINCON_FFFFFFFFFFFF99999
  - **validation_chain:** `openStream fail`, `filesize bad/unavail`, `bad version/last-update-id`, `denylisted setting`, `badFormat (denylisting)`, `badEncoding (denylisting)`, `bad version`, `Cannot open temp file`, `bad algorithm`, `signature mismatch`
  - **behavior:** "Not replicating while unregistered"; "Removing settings denylists after registration"; denies unknown/blocked settings ("denylisting replicated setting %u"); async ReplicatedSettingsChangedEvent; unexpected content version/format rejected
  - **confidence:** PROVEN headers+validation chain; blob body format/codec unresolved
<details><summary>Evidence (9)</summary>

- @ 0x10efd14e — replicated_settings.cxx
- @ 0x10eacbb0 — <ReplicationOperation
- @ 0x10ec0ce2 — NextFavorite
- @ 0x10efd374 — replicateOne from %s to %s setting %u version %u
- @ 0x10efad64 — <ReplicatedNetSettings LastUpdateDevice Version FileSchemaVersion>
- @ 0x10efd4b0 — denylist failure taxonomy strings
- @ 0x10efd374 — replicateOne + full failure taxonomy strings
- @ 0x10f17d48 — quarantine admission reasons: HTTPS/unknown user/secure reg
- @ 0x10e76e68 — ver/format negotiation on accept

</details>

## `signal_source`

**coverage** `partial`

**Technical description:**

errors "invalid playId"/"failed to stop signal"/"incorrect playId"/"nothing is currently playing"/"couldn't create an audio stream"/"only one signal can run at any given time"/"invalid channel"/"disallowed by policy"; channelNumber param

- **name:** signal/tone source
<details><summary>Evidence (1)</summary>

- @ 0x10ed2dc8 — signal source region

</details>

## `sntp_server`

**coverage** `partial`

Sonos runs its own time system: players sync from Sonos's *.sonostime.pool.ntp.org pool, but a single household player also hosts an SNTP server and the others sync from it — the server role can migrate. Grouped playback start times are scheduled on this clock, which is how multi-room audio stays in sample-accurate sync.

**Technical description:**

Dual-mode SNTP stack (sntp.cxx client + sntpsrv.cxx server + sntppoll.cxx poller): players sync from *.sonostime.pool.ntp.org or the group coordinator, one player hosts an SNTP server for the household ('Starting SNTP server switch'), and SNTP validity gates synchronized playback scheduling

- binary anchors: `sntpsrv.cxx`, `handleSntpRequest`, `Created SNTP Server`, `Created SNTP Server, port: %hu clock: %s`, `Starting SNTP server switch.`, `sonostime.pool.ntp.org`, `SNTP waiting for valid`, `vli sntp port %u`

- **upstream:** 0-3.sonostime.pool.ntp.org pool; /ntpsources HTTP endpoint; ntpSync poll op; 'set SNTP server: %d.%d.%d.%d'
- **server:** 'Created SNTP Server, port: %hu clock: %s', thread loop with 'sntp-%u-clock' request handling — MULTIPLE named clocks; server role switches at runtime ('Completed SNTP server switch in %dms'), plausibly to the group coordinator
- **client:** sntppoll.cxx: 'SNTP request to group coordinator failed', 'SNTP success after %u failures', 'Time went backward, discard SNTP offset'; ToS marking attempted ('Unable to set ToS for SNTP'); offset persisted via sntp.txt/save_sntp
- **sync_play:** 'SNTP waiting for valid at %d.%06d', 'SNTP valid %d continue to play %d at %d.%06d', 'synchronizedPlay: noderx I/O error while waiting for SNTP' — grouped playback start times are scheduled on SNTP time; htsnk_invld_sntp faults the HT sink
- **vli:** VLI streams carry SNTP config: 'vli sntp port %u', 'vli src tx settings sntp port'
- **unresolved:** server-election rule, clock-domain semantics, port number, jitter/drift thresholds
<details><summary>Evidence (7)</summary>

- @ 0x10ed6496 — sntpsrv.cxx
- @ 0x10ed62e8 — handleSntpRequest
- @ 0x10ed6418 — Created SNTP Server
- @ 0x10eaac68 — 0-3.sonostime.pool.ntp.org pool list
- @ 0x10ed6418 — 'Created SNTP Server, port: %hu clock: %s' (sntpsrv.cxx)
- @ 0x10eb4bd4 — 'Starting SNTP server switch.'
- @ 0x10eb5758 — synchronizedPlay SNTP wait

</details>

## `sound_swap`

**coverage** `partial`

**Technical description:**

sound_swap/audio_swap; queue audioSwapEventQueue + progress audioSwapProgress; behaviors SWAP_BEHAVIOR_{DO_NOTHING,PUSH_SWAP,PULL_SWAP,UNDEFINED}; push/pull disband target|initiator group; HTSatelliteChecker gates (isFound,isHTSat,playerUDN,HTPrimaryUDN + topology/group-props/GC-AVT lookups); FSM "New state: %i"/"Event %i not handled in state %i"/transition-failure -> reset; result fields {swapResult,swapType,swapTarget,swapGC,initAction,candCount,respCount}; gates {bonded zone,HT Satellite,unknown state,unswappable audio,already in progress}; muse calls museCmdSetGroupMembers/museCmdModifyGroupMembers via groups/%s/groups/modifyGroupMembers

- **name:** SoundSwapController — audio-swap FSM (zpSwap)
<details><summary>Evidence (1)</summary>

- @ 0x10ed6b44 — sound swap region

</details>

## `spotify_esdk`

**coverage** `partial`

A full embedded libspotify (the old Spotify eSDK — mercury/hermes protocol stack) lives in the binary, plus Sonos's bridge modules and mDNS Spotify-Connect discovery. This is the actual Spotify client implementation inside the speaker.

**Technical description:**

embedded Spotify eSDK (libspotify-derivative) plus a Connect layer: local /spotifyzc endpoint answers Spotify zeroconf getInfo (only the group coordinator answers — 'Non-GC returning 404 from getInfo'), account transfer arrives as an encrypted zeroconf blob ('Decrypting ZeroConf blob failed'), and the player registers on Spotify's hwptp hermes channel (hm://hwptp/v1/devices, hm://hwptp/v2/resolve/%s/%d/%s) to receive Connect commands ('Got unknown command from HWPTP: %s')

- binary anchors: `spotify_esdk.c`, `hermes.c`, `mdns_spotify_service.cxx`, `/spotifyzc`, `x-spotify://`, `Spotify Connect mDNS service`, `spotify:interruption:`

- **uris:** x-sonos-spotify:, x-sonosprog-spotify:, x-spotify://, x-spotify-file://, spotify:track:, spotify:episode:, spotify:ad:, spotify:interruption:
- **connect:** 'Registering Spotify Connect mDNS service \[%s\]' + update/unregister paths, spotifyTransferZeroConf, spotifyConnectTransferLoggedIn, SpotifyMDNSRequest, SpotifyDelegationNotification; /spotifyzc debug endpoint
- **playback:** RSpotifyPlayback{Play,Pause,Seek,SeekRelative,SkipToNext,SkipToPrev,BecomeActiveDevice,SetDeviceInactive} controller + spotifyPlaybackSession + 'Starting Spotify playback with object'
- **queue:** spotifyTrackQueue + 'Reset Spotify Track Queue' + 'Using cached position. SpotifyQueue position unset' — separate queue object from the zone queue
- **smapi:** spotifySmapiControl + RSpotifySMAPIControl::setPositionInfo(trackId, position, duration, bLastReport) — reports progress back to Spotify SMAPI; 'Already have a spotify request in progress, can only have one!!'
- **zeroconf:** SpZeroConfGetVars/SpZeroConfAnnouncePause\|Resume/SpConnectionLoginZeroConf calls; ZEROCONF_{START,DEVICE_ADDED,TRANSFER_CRED,TRANSFER_STATUS,AUTH_TOKEN,AUTH_CODE} events; ZeroConfVarsChanged notification; spotifyTransferZeroConf; 'Invalid ZeroConf request %s'
- **hwptp:** hermes channel registration: 'Will try again to register in HWPTP in %lu ms', 'Got %s from hwptp'; endpoints hm://hwptp/v1/devices (device registry), hm://hwptp/v1/tsv, hm://hwptp/v2/resolve/%s/%d/%s (track resolve); hm://hwp-events/v1/log_event telemetry
- **errors:** ERROR_SPOTIFY_CONNECT fault code
- **mercury_hermes:**
  - **protocol:** Hermes request/response+push channel over the AP connection: messages {id u32, method enum, uri hm://..., payload bytes} ("id %u method %d uri %s %d bytes"); HermesHeader codec ("Failed to decode HermesHeader"); server pushes logged "Got hermes push from %s"; fragmented packets reassembled via defragmentation buffer (max-size guarded)
  - **methods:** `GET`, `SEND`, `SUB`, `UNSUB`, `GETX (proven literals SEND/UNSUB/GETX; GET/SUB by enum convention - inferred)`
  - **content_types:** `vnd.spotify/mercury-mget-request`
  - **rate_limit:** client-side mercury rate limiter: "Message not sent: rate limited for %llums", "Rate limiting active ... %llu ms"/"deactivated"; server hint header Spotify-Unavailable-For; 429 logged as "Too many requests", 503 "Service unavailable (%d)"
  - **uris:** `hm://hwptp/v1/devices`, `hm://hwptp/v1/tsv`, `hm://hwptp/v1/`, `hm://hwptp/v2/resolve/%s/%d/%s`, `hm://hwp-events/v1/log_event`
  - **uri_note:** hm://hwptp/* = hardware push-to-play channels (Spotify Connect cloud pairing/eventing); hwptp v2 resolve takes 3 args (%s/%d/%s)
  - **login:** login4.c: client-ID login "logging in with client ID %s", SHA1+SIG+modpow signature verification asserts (MODPOW_WORK_RAM_SIZE, SHA1_DIGEST_SIZE+SIG_SIZE+SIG_SIZE bufsz)
  - **perf_counters:** `EsdkPlaybackStats`, `EsdkPlaybackErrors`, `EsdkHttpErrors`, `EsdkDownload`, `EsdkEvent`, `EsdkCapabilities`
  - **bandwidth:** streamio adaptive-bitrate estimator: BANDWIDTH %uB/%ums -> B/s kbit/s; sliding WINDOW BANDWIDTH high/low marks; LOW BW threshold counter; stats: first_chunk_request_time/latest_chunk_finished_time
  - **src:** esdk/src/hermes.c + code/{stream_stats,streamio}.c literal regions 0x10fe3400-0x10fe4600, 0x10fd6200-0x10fdc600
  - **confidence:** PROVEN literals+framing; full method enum inferred partly
<details><summary>Evidence (11)</summary>

- @ 0x10fd4cb8 — spotify_esdk.c
- @ 0x10fe4128 — hermes.c
- @ 0x10ee4eb2 — mdns_spotify_service.cxx
- @ 0x10e765a4 — /spotifyzc
- @ 0x10ea256c — Spotify Connect mDNS registration
- @ 0x10ea23a0 — RSpotifyPlayback* controller method names
- @ 0x10ea46c0 — RSpotifySMAPIControl::setPositionInfo
- @ 0x10e765a4 — /spotifyzc endpoint
- @ 0x10ea1938 — GC-only getInfo
- @ 0x10fd6d44 — ZEROCONF_* event enum
- @ 0x10fdb4b8 — HWPTP registration retry

</details>

## `stream_fetcher`

**coverage** `partial`

**Technical description:**

notifyFrame ty:%d ln:%zu so:%zu ns:%zu f:%u ctx:%u:%u:%llu; getContentKey (encrypted HLS); "New bitrate: %d, Old bitrate: %d" adaptive switch; playlist FSM {"Timed out looking for playlist","Playlist failure with no time to recover (%ld buffer)","fetch empty","Too many empty playlists and no audio left"/"(still %ldms ahead)","Switching source due to empty playlists","end of static list","Unable to select another DS"/"waiting to fetch new playlist"}; "Startup ahead: %ld"; "URIs for %g seconds, wake up in %d"; "prebuffering %u bytes within %ld msec"; open fmt "open: %s (0x%x) %d len %llu offset %llu"; "stopping decoding while sleeping"

- **name:** stream playlist fetcher (HLS/radio)
<details><summary>Evidence (1)</summary>

- @ 0x10ed38c8 — audio_stream region

</details>

## `telemetry_submission`

**coverage** `partial`

The diagnostics pipeline: Telemetry 1.0 events tagged with field names, uploaded with the product-data-telemetry message-type header, plus the user-facing SubmitDiagnostics flow and a per-player positioning telemetry level setting. Several telemetry channels are individually feature-flagged.

**Technical description:**

telemetry/diagnostics uplink: 'Telemetry 1.0 Event field' format, X-Sonos-MessageType: product-data-telemetry header, zonereportmgr.cxx zone reports, submitDiagnostics/submitQueuedDiagnostic pipeline with manifest submission, positioning telemetry level route, per-feature telemetry flags

- binary anchors: `reportuploader.cxx`, `trackplayrecorder.cxx`, `zpMetricsConfigV2.xml`, `diagnosticSubmissionResults`, `product-data-telemetry`, `Telemetry 1.0 Event field`, `positioning/telemetryLevel`

- **channels:** X-Sonos-MessageType: product-data-telemetry header; 'Diagnostic manifest submitted.'; 'Unable to report diagnostic submit status of %s to %s'; submitDiagnostics muse op + playerId,diagnostics,submitDiagnostics route
- **format:** 'Telemetry 1.0 Event field %s = %s'; reportTelemetryLocked(%s) t\[%s\] L_id\[%s\] g\[%s\] s\[%s\] field tags; TelemetryBasePlayer + TelemetryCategoryContext classes
- **flags:** featureConfigHomeTheaterWifiPerfTelemetry, homeTheaterWifiPerfTelemetry, enableRadioSocTemperatureTelemetry, enableDhcpProxyFailureTelemetry, circuitBreakerTelemetry, ucsTelemetry, positioningTelemetry
- **control:** v1/players/{playerId}/positioning/telemetryLevel (setTelemetryLevel) + household variant — positioning telemetry is user-controllable
- **uploader:**
  - **files:** /tmp/event_preserve named %010llu_; dual formats legacy + protobuf (PlayerEventHeaderBase); preserveEvents/preserveProtoEvents on shutdown, restoreEvents/restoreProtoEvents on boot
  - **integrity:** records length-prefixed + SHA256-verified: "Length %zu too short","Data length %zu does not match recorded length %d","Error, SHA256 hash check failure"; restore skips empty/malformed
  - **loop:** submit: Success \| Nothing to submit \| 'Failure (%u events, %zu bytes, attempt %u, retrying in %u seconds)'; proto path separate 'Proto Event Upload Success/Failure'; bounded buffer 'adding %zu bytes, %d free' / 'Can't grow space. Losing event %s' / drop counter LostEvents
  - **naming:** event names parsed "%\[^/\]/%\[^/\]" (namespace/name), malformed rejected; fields locid, sys/run/updateID, uptime, report flags 0x%x, UsageMetrics
  - **confidence:** PROVEN persistence format + retry + integrity
<details><summary>Evidence (7)</summary>

- @ 0x10eeb50d — reportuploader.cxx
- @ 0x10ed877a — trackplayrecorder.cxx
- @ 0x10e7530b — zpMetricsConfigV2.xml
- @ 0x10f962bc — diagnosticSubmissionResults
- @ 0x10f03bcb — X-Sonos-MessageType: product-data-telemetry header
- @ 0x10ea13ec — Telemetry 1.0 Event field format
- @ 0x10e81dc0 — positioning/telemetryLevel muse route

</details>

## `testenv_environment`

**coverage** `partial`

A hidden /testenv page lets a tester point the whole player at a different Sonos cloud environment (production, perf, staging, test or int) and override the update URL. It lists the six backend APIs the player will use, and the change spreads to every player in the household within about two minutes.

**Technical description:**

POST /testenv switches the player's cloud environment between PROD, PERF, STAGE, TEST and INT, with an optional OnlineUpdateBaseURL override; the page displays the six resolved API bases (Cloud, Service catalog, System, Transfero, Metrics, Update) and CustomerId; the change replicates household-wide ('may take up to 120 seconds ... to replicate throughout household') and logs 'Setting cloud env to %s'

- binary anchors: `/testenv`, `Setting cloud env to %s`, `OnlineUpdateBaseURL`, `CustomerId`, `perf`, `PROD`, `STAGE`, `TEST`, `INT`

- **form:** GET renders a form: env selector (prod/perf/stage/test/int), url text input (OnlineUpdateBaseURL override), submit/reset buttons; POST returns a 1-second meta-refresh 'Success' page
- **api_bases:** Cloud API, Service catalog API, System API, Transfero API, Metrics API, Update API — six resolved service bases per environment
- **propagation:** change is written through the replicated-settings layer — 120s household-wide convergence warning on the form
<details><summary>Evidence (2)</summary>

- @ 0x10f1756c — full /testenv form: env select + URL override + 6-API table
- @ 0x10f174e8 — 'Setting cloud env to %s' log

</details>

## `track_play_monitor`

**coverage** `partial`

**Technical description:**

per-track log entries {Track Or Station URI,Extra Md,Context URI,CQ Auth Token,SMAPI Device Id,CloudQueueVersion,CQ Context Version,CQ Playback Id,API Key,Framer Name}; play line "%s play time %fs @%d.%06d (pkt:%u,act:0x%x,off:%lld%s,err:%u,uri:%s)"; segments "seg start @ %d.%06d (packetId: %u), end ..."; PlaybackId remap; string-pool bounded (pool %d%% full, "Resetting due to no free RTrackLogEntries"); states In progress/Final/LSE; selthrd.RTrackPlayMonitor thread

- **name:** RTrackPlayMonitor/trackPlayRecorder — play-segment recording
- **events:** R_STREAM_OP_{SAMPLE(publish segment),OPEN(offset),CLOSE(packetId),INTERRUPT(act,offset),ACK(act,packetId),ERROR,IMMED_RESYNC,SCHED_RESYNC,BOUNDARY,ORIGIN_TIME_SELECTED,QUALITY_SELECTED(bd,sr,c,br,nc,a,fmt)} + R_PLAY_OP_{SAMPLE,BOUNDARY,RESYNC(immed\|sched),ERROR,CHANGE_SRC,CODEC_SELECTED,ORIGIN_TIME_SELECTED}; sources {REMOTE,CHSRC,Virtual Line-In}; errors {NO_ERROR,CLOUD_QUEUE_ERROR}
- **recorder:** segment containers: streams/playback/canceled per lifecycle {(init),(finalize),(RESYNC),(RESYNCED),(RESYNCING),(SCHED RESYNC)}; full-container overwrite; zero-sample cancel; memory-pressure relief falls back to canceled; "Overwriting stream error"
<details><summary>Evidence (1)</summary>

- @ 0x10ed8350 — trackplaymonitor/recorder region

</details>

## `trueplay_tuning`

**coverage** `partial`

Trueplay room tuning: the SOAP on/off surface is documented; the interesting parts — measurement capture, the tuning state machine, per-zone EQ application and the asset sync — are not yet decoded.

**Technical description:**

Trueplay room tuning stack: muse routes for discovery/presence/config/status (+setSelfTruePlay, resetDetectedSpeaker), x-rincon-sonarcal: OGG test-tone URIs played through the streamer (leader/testtone/complete_ht), versioned Trueplay SDK with compat fallback, etag-synced spectral/spatial tuning assets, per-driver RoomCalDelay params, satellite propagation via SetRoomCalibrationStatus, SelfTrueplay variant

- binary anchors: `trueplay-node`, `/trueplayinfo`, `SelfTrueplayEQ`, `x-rincon-sonarcal:testtone.ogg`, `trueplay_spectral_tuning.bin`, `RoomCalDelayMidLeft`, `v1/players/{playerId}/trueplay/status`, `trueroom`, `x-rincon-trueroom:`, `trueroomAdaptationStatusEvent`, `enableTrueRoom`

- **muse_routes:** v1/players/{playerId}/trueplay/{discovery,presenceDiscovery,presenceRate,config/{id},status} + household variants; ops detectSpeakers, detectSpeakerPresence, setSpeakerPresenceRate, get/setConfiguration, getTrueplayStatus, setSelfTruePlay, resetDetectedSpeaker
- **calibration:** x-rincon-sonarcal:leader.ogg\|testtone.ogg\|complete_ht.ogg test tones; <RoomCalibration*> XML family (Info, ActiveState, UserIntent, AvailCalID, Orientation, BondedZoneInfo, State, Enabled, Available); SELF_TRUEPLAY self-tuning + <SelfTrueplayEQ>/<SelfTrueplayInfo>; calibration ID embeds version ('Trueplay Version %d.%d.%d.%d' parsed from ID)
- **sdk:** TrueplayAPIFactory + trueplay_api.cpp; #TRUEPLAY_SDK_VERSIONS# compat list; 'Trueplay SDK version %s not supported, creating previous version'; assets trueplay_spectral_tuning.bin + trueplay_spatial_tuning.bin etag-synced ('Could not load Trueplay etags, %sresetting'); sonos.coreaudio.trueplay.v1.TrueplayService registration
- **propagation:** coordinator pushes calibration to bonded satellites: 'Failed to SetRoomCalibrationStatus on SUB/SURROUND'; RoomCalibrationBondedZoneInfo; per-driver delays RoomCalDelay{MidLeft,MidRight,MidCenter,TwtrLeft,TwtrRight,TwtrCenter,Bass} + _RoomCalGains/_RoomCalPanGain
- **unresolved:** measurement mic flow (the actual chirp capture), tuning FSM states, RoomCal* units
- **trueroom:** a second tuning system 'trueroom' coexists: muse routes trueroom/{estimatorConfiguration,adaptation,calibrationStatus,successTone,swapInputMute}; x-rincon-trueroom: URIs, x-rincon-configmode:trueroom-tone queue items, trueroom_tone.ogg + a trueroom-tones JFFS folder cleared after tuning; events trueroomStatusEvent/trueroomAdaptationStatusEvent with trueroomEstimatedParams — an adaptive estimator-based tuner, feature-gated by enableTrueRoom
- **node_protocol:**
  - **wire:** protobuf node messages (node_messages.cpp): encodeNodeRequest/decodeNodeRequest/encodeNodeResponse/decodeNodeResponse + pb<->TP converters for action/status/channel-type; "Node message is : %s"/"Node response is : %s"; decode failures logged
  - **actions:** `TP_NODE_ACTION_NONE`, `TP_NODE_ACTION_SETUP`, `TP_NODE_ACTION_START_MEASUREMENT`, `TP_NODE_ACTION_SEND_BACK_DATA`, `TP_NODE_ACTION_COLLECT_DATA`, `TP_NODE_ACTION_SEND_STATUS`
  - **statuses:** `TP_NODE_STATUS_IDLE`, `TP_NODE_STATUS_SETUP`, `TP_NODE_STATUS_MEASURING`, `TP_NODE_STATUS_MEASUREMENT_DONE`, `TP_NODE_STATUS_DATA_COMPUTED`, `TP_NODE_STATUS_ERROR`, `TP_NODE_STATUS_EXCEPTION`
  - **api:** TrueplayAPIFactory + initNode/initNodeMajorVersion; SDK version negotiation "Trueplay SDK version %s not supported, creating previous version" / "Requested version %s already in use -> no-op"; SDK build 6.2.0.1-main.Unspecified.2db5546c; node data schema version reported
  - **setup_constraints:** nMics & nDSPChannels must be both zero or both nonzero; minimal-node builds cannot instantiate microphones; "Node microphone data is %s"; "Trueplay data handler reports that data collection %s allowed"
  - **ops:** `setup`, `setupMeasurement`, `startMeasurement`, `computeData`, `handleMsg`
  - **channel_types:** pbChannelType<->TPChannelType converter; "Unhandled trueplay channel type with value : %d"
  - **confidence:** PROVEN enums+protobuf framing; per-message field schema unresolved
- **tone_download:**
  - **muse_path:** players/%s/trueplay/config/%s + trueplayConfig; MUSE POST response base64 -> tone asset
  - **assets:** x-rincon-sonarcal:{leader,testtone,complete_ht}.ogg + trueroom_tone.ogg staged under trueroom-tones dir; sonarcal served from https://sonar.ws.sonos.com
  - **etag:** etags.txt per-file eTag cache ("Parsed eTag: key ... value ... matching a known file"); "Downloading %s to %s. Etag is %s"; force-load flag; dir create/delete guards
<details><summary>Evidence (8)</summary>

- @ 0x10ebda88 — trueplay-node
- @ 0x10e75f08 — /trueplayinfo
- @ 0x10fee999 — SelfTrueplayEQ
- @ 0x10e83240 — trueplay/discovery + presenceDiscovery + config/{id} routes
- @ 0x10e93e2c — x-rincon-sonarcal:{leader,testtone,complete_ht}.ogg
- @ 0x10fbd990 — TrueplayAPIFactory / trueplay_api.cpp SDK
- @ 0x10fea0b4 — RoomCalDelay* per-driver delay params
- @ 0x10e83590 — trueroom route family + estimator/adaptation events

</details>

## `update_machinery`

**coverage** `partial`

Firmware updates are manifest-driven: a cloud manifest lists per-model target rows and a minimum auto-update version; household updates run check→download→launch across members with the coordinator orchestrating. Below the manifest's auto-update floor a device needs manual update. Clients see this through DeviceProperties/BeginSoftwareUpdate and the update/check muse route.

**Technical description:**

manifest-driven update pipeline: update_manifest carries a base update URL + per-device target rows (udn, model, submodel, swgen, ver, URI, updateID) and a min auto-update version; user updates run manifest-download -> checkDevicesToUpdate -> launchUpdate; auto-update policy gated by R_AutoUpdatePolicy + R_CheckUpdateInterval + R_AutoUpdateWindowStart + autoUpdatesEnabled

- binary anchors: `auto_update_scheduler.cxx`, `migrationmanager.cxx`, `/softwareDownload`, `update_manifest`, `BeginSoftwareUpdate`, `/firmwareDownload`, `update check zp: udn %s`

- **manifest:** 'manifest: Setting base update url=%s', 'manifest: AutoUpdate min version=%s'; per-device rows 'update check zp: udn %s, model %d, submodel %d, ver %s, URI %s, updateID %s'; non-listed devices skipped ('not in manifest, skipping update'); below-min devices need 'manual update required: below manifest's min auto-update version'
- **endpoints:** UPnP BeginSoftwareUpdate (UPnP result faults surfaced), muse v1/players/{playerId}/update/check + household variant (checkForUpdate), /firmwareDownload + v1/.../systemReporting/firmwareDownload reporting route, version?updateToken=true& query param
- **config:** O_UPDATE_SERVER_URL, O_UPDATE_MSG_URL, O_FIRMWARE_UPGRADE_LOGGING_URL, OnlineUpdateBaseURL, UpdateURL/updateURL ('Update URL is malformed' validation)
- **group_update:** household-wide: 'Max ZPs reached while checking for auto updates', sendUpdateZoneMemberSettingsCmd, updateActiveZone; member image fetch failures 'RINCON_%s01400 update failed'
- **file_schema:** local stores self-migrate: 'File upgraded to v%d schema', 'Upgraded %s to file schema %d', 'load failed: incorrect schema \[%d != %d\]'
- **unresolved:** manifest document schema (fields beyond the log strings), image format/verification, upgrade_mgr hand-off protocol
- **auto_update:** background "Check for online update" -> launch scheduled update on %s -> BeginSoftwareUpdate UPnP op per-ZP ("BeginSoftwareUpdate failure for %s (UPnP result: %u)"); spawns /bin/upgrade_mgr ("creating auto upgr process"/"Failed to spawn"); "%zu/%zu ZPs need auto-update"; manifest URL fetch: connect error 0x%x/download complete/download error
- **coordinator:** update_coordinator @ /var/run: beginUpdate/updateHookJob/upgradeinfo; "beginUpdate - Update already started."; "Current Swgen Min downgrade version %s"; "Failed to query cloud settings"
- **user_initiated:** UserUpdateScheduler: HH update run -> manifest dl -> upgrade_mgr_user_report.json (+_prev) read at app/run -> householdUpdateStatus event (truncated at max devices); report file /tmp/upgrade_mgr_info.txt; poll timeout
<details><summary>Evidence (6)</summary>

- @ 0x10eae506 — auto_update_scheduler.cxx
- @ 0x10fafc18 — migrationmanager.cxx
- @ 0x10e82b39 — /softwareDownload
- @ 0x10eeea5c — manifest: Setting base update url=%s
- @ 0x10f076a4 — per-device manifest row fields
- @ 0x10e838ac — v1/players/{playerId}/update/check muse route

</details>

## `usage_metrics`

**coverage** `partial`

**Technical description:**

<UsageMetrics><ver>2</ver> + <ucs>/<uc> records {ms_cdctrluri,ms_regctrluri,ms_croot,ms_fn} posted to submit.aspx under /HRMetrics/; cfg fetches {pollInterval.htm,wifiTxRateThreshold.htm,wifiLatencyThreshold.htm}?hhid=%s; wifi counters {ath%u,rxPrr,beacon_flags,datarx,secdrp,roaming,trf2g,trf5g,trg2g,trg5g,tbtm2g,tbtm5g,rfail,q*_nbf,q*_cmp,q*_bpk,q*_ltc,hwstat,rxbhs,rxhang,rxfMax,rxcMax,txfMax,bprowar,gtkfm,gtkfc,nogcfc,links}; per-AP "MAC/rssiF/rssiT/PktMin/PER" + "BSSID/perAP/rssiAP"; "Audio-drop ... include with future periodic submission" + rate-limit; WD daily write; CPUTempHist <temperatures>; unlocked/hw_warn/hw_fault flags; usageDataSharing optin

- **name:** usagemetrics — periodic health report
<details><summary>Evidence (1)</summary>

- @ 0x10f0c724 — usagemetrics block

</details>

## `wac_mode`

**coverage** `partial`

WiFi Accessory Configuration — the Apple's-WAC-style setup mode where the player broadcasts a setup network (wacd daemon, /var/run/wac_mode flag, timeout). This is the first-boot/add-player path.

**Technical description:**

WiFi Accessory Config (WAC) setup mode: state lives in /var/run/wac_mode (parsed int, 'Unknown WAC mode %d') with enabled/disabled/timeout transitions; driven by netstartd via /tmp/netstartd.ipc ('WAC mode enabled/disabled/timeout', 'In setup mode', 'Netstart SSID set/clear'); LED goes to R_LED_WAC mode | netstartd IPC drives WAC: dispatcher f_10691034 msg ids 35/36=WAC disabled/enabled, 37/39/41=WAC timeout cluster; ids 42/46/47=setup-mode enter/setup start/stop.

- binary anchors: `wacd.log`, `WAC mode enabled`, `/var/run/wac_mode`, `/var/run/netstart_mode`, `R_LED_WAC`, `recovery AP connection`, `ForceShutdownOnNewSSID`

- **netstart_ipc:** netstartd events consumed: 'netstartd hello', 'Setup start/stop', 'Netstart is idle/alive/open', 'In setup mode', ' Netstart SSID set/clear', 'Netstart triggered upgrade (0x%x)', 'Got connection type update from netstartd: \[%s\]', recovery AP connection: %02X*6 — a recovery-AP fallback exists
- **conn_types:** connection-type vocabulary reported by netstartd: 'SonosNet (Ethernet)', 'SonosNet (wireless)', 'Home Theater 2.0', 'Home Theater (Ethernet)', 'Home Theater', 'WiFi', 'Ethernet (WiFi Disabled)', 'Ethernet'
<details><summary>Evidence (7)</summary>

- @ 0x10e7573d — wacd.log
- @ 0x10f02dc8 — WAC mode enabled
- @ 0x10f027b4 — /var/run/wac_mode state file
- @ 0x10fbb0fc — R_LED_WAC / R_LED_WAC_TIMEOUT LED modes
- @ 0x10f027b4 — /var/run/wac_mode mode file + 'Unknown WAC mode %d'
- @ 0x10f02db4 — WAC enabled/disabled/timeout event strings
- @ 0x10f02ee8 — recovery AP connection MAC print — recovery AP fallback

</details>

## `wmp_provider`

**coverage** `partial`

**Technical description:**

WMP NSS /WMPNSSv browse/search; caps {SCPA,SCPB,SCPI}; search grammar 'upnp:class derivedfrom "object.item.audioItem" and @refID exists false' + container class specs {person.musicArtist,album.musicAlbum,genre.musicGenre,playlistContainer}; sort/filter "+upnp:album,+upnp:originalTrackNumber,+dc:title" + microsoft:{artistAlbumArtist,artistPerformer,authorComposer} + upnp:genre + "1+upnp:originalTrackNumber"; field set dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber; rincon md ns urn:schemas-rinconnetworks-com:metadata-1-0/|otherArtist; albumArt via %s?albumArt=true and /getaa?m=1&u=%s; "URI already has a serial number"/"not enough room for account ID"

- **name:** sonos_cprovider — WMP content provider
<details><summary>Evidence (1)</summary>

- @ 0x10f0dbf8 — cprovider block

</details>

## `ws_client`

**coverage** `partial`

**Technical description:**

client handshake {Location,Upgrade: websocket,Connection: Upgrade,Sec-WebSocket-Accept,Sec-WebSocket-Extensions}; "failing connection due to unsolicited per msg deflate"; per-msg deflate only before open; openSession retry; nonce gen/encode; {"disconnectedReason":"%s"}; close codes on close frame; LoadBalancerHost/WebsocketServerHost; reasons {NEW_IP,BLUETOOTH,POWERED_OFF,UPGRADE,NEW_SSID,SLEEPING,RECONNECT}; threads wsc_mtx/wsc_smtx/wsc_cond

- **name:** websocketclient — outbound WS (lechmere/cloud)
- **status_schema:** <State>Open\|Closed</State><MillisecondsOpen\|Closed><PerMsgDeflate><TotalUncompressedKBytesSent><TotalCompressedKBytesSent><TotalKBytesSent><TotalUncompressedKBytesReceived><TotalCompressedKBytesDecompressed><TotalKBytesReceived><OpenCount><CloseCount><ConsecutiveFailures><UnackedPings><LastPingTime><PingTimeWeightedAverage><Messages><LastHttpStatus><LastWebSocketCode>
<details><summary>Evidence (1)</summary>

- @ 0x10f0d018 — websocketclient block

</details>

## `alarm_clock`

**coverage** `?`

- **muse_validation:**
  - **errors:** `Invalid service id`, `Failed to convert content payload for alarm contentType=%s, objectId=%s`, `Invalid startTime`, `No alarm active to silence`, `Invalid duration provided`, `Device not group coordinator or source`, `Alarm not found`, `Invalid recurrence`, `Invalid alarm ID`, `Invalid Recurrence`, `Invalid StartTime`, `Writing alarm failed with error: %d`, `Unable to return active alarm: definition has been deleted`
  - **recurrence:** day-bitmask "12345"-style strings + presets {DAILY,WEEKDAYS,WEEKENDS}
- **ac_impl:**
  - **time_sync:** syncInternetTime job + dailyIndex + Remote; NTP pool 0.sonostime.pool.ntp.org; syncFailed/ntpSync events; "reportTimeSyncFailure detects no internet"; "large adjustment to system clock detected"; state vars {AlarmListVersion,TimeFormat,DateFormat,DailyIndexRefreshTime,TimeServer,TimeGeneration}
  - **execution:** designated-ZP fan-out: "running alarm %d"/"Can't get AVT URI for designated alarm ZP %s"/"for coordinator ZP %s"; conflict detect "New alarm %u conflicted with running alarm %u on ZP %s at %s"; "Not executing on invisible ZP"; scheduler "selecting id:%d ty:%d for execution isLocal:%d"/"scheduling next alarm (%d) in %ld secs (coordinator:%s) nextLocal:%ld"/"%s will run alarm id:%u type:%d"/"unrunnable or expired alarm %u"/"annotate and expire %s"/"use cloud schedule instead of local alarm"
  - **storage:** replicated <AlarmClock LastUpdateDevice="/<Alarms> XML + SQLite; buzzer file://%s/buzzers/0.mp3; alertContent default loop \[rclS:%lld\]; alarmContentConversion; load-content resolution errors
## `autoplay`

**coverage** `?`

- **engine:** MpAutoPlay_: airplay {include zones,vol,useVol,includeZones}; AirplayIncludeGroupedEvt; AutoStop on unhandled URI; linein URIs object.item.audioItem.linein.{homeTheater,airplay,bluetooth}; "lonely local line-in autoplay %s"; failure modes "no autoplay target"/"couldn't determine coordinator"/"couldn't determine AVT control URI of coordinator"/"couldn't determine control URI of zone"; skip "invisible/node proto incompatible ZP"; "for controlURI \[%s\] for coordinator \[%s\]. programURI \[%s\]. %d - %d"; vliType-driven
## `cert`

**coverage** `?`

- **metadata_errors:** devcertmgrprovider cert validation codes: BAD_FILE,BAD_KEY,BAD_CERT,BAD_ISSUE_DATE,MISMATCH_ENV,MISMATCH_ISSUER,MISMATCH_HHID,MISMATCH_USER,not_present; headers X-Sonos-UserId,X-Sonos-Muse-Household-Id,X-Sonos-Denylisted; response {requestTimeMS,downloadStatusCode,httpResultCode,previousETag,download,reasonCode,certError}; states downloaded/unchanged/generating; "Unknown cert metadata state: %s. Scheduling cert refresh job"; "Retrieved manufacturing data: %s"; refresh "%s: refresh check in %ld seconds"/"certificate expired"/"utc time not set"
## `chsnk`

**coverage** `?`

- **crossfade:** sample-level xfade: "attempting to crossfade with underflowed stream"/"recovered crossfade stream underflow"; int16 crossfade; "xfade corked stream: replace buffered data via non-xfade overlap"; "xfade timestamp too far in past, nst %d.%06d"; "xfadeable timestamp"; "set xfade lfnf"; volume-norm ramp insert "%d @time %d.%06d"; "xfade for %zu samples, %f seconds"; gap tracking "xfade gap, samples %zd"
## `chsrc_chsnk`

**coverage** `substantially decoded`

**Technical description:**

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
<details><summary>Evidence (2)</summary>

- @ 0x10ea8620 — chsrc.cxx literal block: ops, work-req, tx-fanout, segment retry, PRIV/oob metadata
- @ 0x10eb5400 — chsnk.cxx literal block: frame types, synchronizedPlay, seamless transition, denylist, frame pool

</details>

## `cloud_registration`

**coverage** `?`

- **fsm:** cloudregistration.cxx: required fields {sonosId,householdLocationId,dhcpMac,ipAddr,museHHName} — "Missing required information: DHCP Server MAC (%s), Location ID (%s)" defers registration; triggers "Updating cloud registration due to '%s'"/MuseSessionId change/explicit request; "Caching muse cloud registration event %s"; "Network Hash \[%s\], Muse Household Id \[%s\]"; cloudRegPollWifiStation monitor job; R_HouseholdLocationID key
## `device_props`

**coverage** `?`

- **idle_shutdown:** idle events LineInStateChangedEvent/ReplicatedSettingsChangedEvent; vars {WirelessMode,ConnectionType,ChannelFreq,BehindWifiExtender,WifiEnabled,EthLink,SettingsReplicationState,SecureRegState,IsIdle,MoreInfo,RawBattPct,BattPct,BattChg,BattTmp,BtSrcName}; reasons {APICall,BluetoothConnection,PartnerDisappeared,Recovery,UserSuspend,UserShutdown,APIShutdown,CriticalShutdown,UnknownShutdown}; dpimpl/dpUpdateIdleState "idle state is %sidle, changing to %sidle"
- **enetport_schemas:** <EnetPorts><Port port="%d"><Link>%d</Link><Speed>%d%s</Speed></Port>; EthPrtStats {rxPackets,txPackets,rxBytes,txBytes,rxErrors,rxDropped,txDropped,multicasts,collisions}; EthIntrf {lngthErr,ovrFlwErr,crcErr,frmeErr,fifoErr,missedErr,RxDtlErr,abrtErr,crErr,hrtBeatErr,wndwErr,TxDtlErr}; /sys/class/net/eth0 + eth%u
## `diagnostics`

**coverage** `?`

- **submission_fsm:** bounded queues {"submission queue full","result queue full"}; params includeControllers,initiatingDeviceId; states {pending on controllers,already in process,no devices submitted,successful}; zpDiagSubmit job + tracking + diag_mgr; completed{submissionId,status,diagnosticId}; blob wrapper <ZPNetworkInfo type="User"> + <!-- START UUID -->/END UUID per player + " unreachable"
## `htaudio`

**coverage** `?`

- **tv_session_fields:** `cid set/clr`, `corrId`, `sessionLength`, `sessionPlayTime`, `connectionType`, `GCUUID`, `GCBootSeq`, `GCTimeStart`, `GCTimeEnd`, `inputRate`, `dataBurstType`, `contentType`, `playSeconds`, `forced`, `topoType`, `zpHTInputSession`
- **core:** htcZonePlayer: per-role "%s delay: %uus, gain: %f" for surrounds/sub/group-member-down-mix; "changing surround mode. old %d new %d"; "changing tv surround lvl"/"changing music surround lvl"/"changing height channel lvl"; "sub changing %zu to %zu"; "Set %s signal rate: %zu"; events SatConfigEvent/TVSignalDetectedEvent/TOSLinkConnected/IRRepeaterState; "Orientation %s"
- **satellite_tx:**
  - **control_frame:** "sending control frame: ctrl 0x%x unscV %d curV %d extV %d extVM %d B %d T %d led %d SPL %d SC %d" — {ctrl flags, unscaled/current/ext volume, extV-muted, B, T, led, SPL, SC}
  - **audio_frame:** "pkt: %zu channels, %zu samples, payload:%zu, rl:%d" — multichannel framed audio; "Last audio frame %d"; "frame serialization failed"
  - **sat_mgmt:** "satellites active \[0x%x\]" mask; "bonded sub(s) %zu"; satellite sub receives non-sub channels; "Sonar center delay %d samples, %d usec"; play start/end handled with disabled sats; "changing surround time delta mode"; "sample type changed"; "Request resync"; volume/mute/LED propagation ("vol change %u (%u%%) -> %u","mute change %d -> %d","LED brightness %d -> %d"); "Send playback ended if count %d > 0 or remote audio disabled %d"
## `http_engine`

**coverage** `?`

- **auth_challenge:** two-step: "First Response: \[%s\] \[%s\] \[%08x\] \[%d\]"/"Second Response: ..."; headers X-Sonos-Mac/X-Sonos-Serial; cred body {"credentials":"%s","nonce":"%s","keyType":%d}; HTTP/1.{0,1} 401 retry; sonoscloudstatus endpoint; httpcaches.json + "\[%s\] Force-cleared cache"
## `lechmere`

**coverage** `?`

- **cloudrequest:** cloudrequest.cxx: ws endpoint /api/v1/websocket; per-msg-deflate toggled by cloudcfg ("per msg deflate change %d -> %d") w/ local-run-state override; "Player IP changed. Bouncing connection"; backoff "Following backoff schedule, retry in %lld"; msg types: SET_CONFIG (registration send/read), CHECK_CONFIG (registration return), TYPE EVENT ("Unexpected TYPE EVENT"), "support for HTTP message dropped", "Unrecognized message type"; poll loop crt.poll/CRT select failed/ppr read failed/failed to ping/"player request failed: %s"; SwitchingRadiosEvent; museCloudEvtHandler
## `music_accounts`

**coverage** `?`

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
  - **validation:** cloud record requirements {service ID,service uuid,account type,metadata,cloud vector clock,serial number,account ID,household vector clock} — "Discarding invalid cloud record: %s \[uuid=%s, hh=%s, cloud=%s\]"; accounts.xml + vcCloud vector clock; zpam log fmt
## `registration_machine`

**coverage** `?`

- **name:** regdevicecert.cxx registration/secure-reg FSM
- **cloud_api:** `/product/v2/households/%s/players?action=refresh`, `/product/v2/households/%s/players?action=complete&token=%s`
- **fsm:** states regStatus + regState %d->%d; events registration during suspend\|time expired\|success\|error\|"retrying registration at time %ld"; secureRegTransfer tjmgr flow: exitSecRegTransferState scheduled/de-scheduled/run via tjmgrExitSecureRegTransferState; currentAccount
- **signing:** Registration signing key set/cleared via IPC payload ("Invalid registration signing key in IPC payload")
- **events:** NewCertRegistrationEvent inprocess-event {SonosID}; newRegisteredCertSonosIDLocked; RegisteredCertSonosID/RegisteredCustomerID keys; Household customer ID conflict/changed detection
## `reporting`

**coverage** `?`

- **crashdump:** sentry uploader: dump-proc-anacapa w/ build.version, sentry\[release\], sentry\[tags\]\[%s\], %s\[sonosID\]; dumps anacapad.{core,dmp}+sonospowercoordinator.dmp+btmanager.dmp+netstartd.dmp + *.properties; counters sonospowercoordinatorCrashCount/netstartd.count; logs /opt/log/anacapa.{hdmi,tv}.log,/tmp/AirPlay.log,/opt/log/{btmanager,btservice}.log,/tmp/backtrace,/tmp/crashed_play_state; killfiles /tmp/anacapa_prevent_crashdump_upload+prevent_crashdump_upload; "Failed to write attachment %s to sentry upload"; htsnk dump
- **play_report:** RPlayReportSubmitter: submitPlayReport/playReport/nowplaying endpoints; fields {serviceType,activatedAccountCode,errorStatus,errorType,multiAccountId,codec,originDelay,outputDelay,endReason,skippedTrack}; "final report" notify; "periodic report interval set to %lld seconds"; spotify-connect serviceType
## `saved_queues`

**coverage** `strong`

**Technical description:**

file:///jffs/settings/savedqueues.rsq (+.tmp write path, .d.rsq variant, application/gzip accepted); XML <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"><SavedQueue Id= Curated= NumTracks=%u><Track URI= MD=></SavedQueue></SavedQueues>; validation: corrupted track count, invalid queue-id/next-id/mismatch, invalid version/numtracks, boot file invalid; migration "Migrating ObjID=%s SN=%u from SID: %u to %u"; SQ:%s objid prefix; <res protocolInfo="file:*:audio/mpegurl:*">; album-art: "No num tracks found, so emitting the first four artworks found"; mobile- playlist prefix; "Add Track Move range: %u-%u to %u"; replication push on save

- **name:** SavedQueues .rsq format
<details><summary>Evidence (1)</summary>

- @ 0x10ed329c — .rsq schema literals

</details>

## `smb`

**coverage** `?`

- **iterator:** resilient dir walk: mount "Successfully mounted %s as %s"; reconnect "failed to connect to %s (error=%d); reattempt=%d"; resume "Reopened directory %s at start"/"iterating to %s"/"Found last known item %s"; fast-forward/stat errors reattempt-tagged; /tmp/smb/tmp_idx staging
## `sntp`

**coverage** `?`

- **clock:**
  - **discipline:** "Clock pull hit the bottom/top rail" clamps; "Current Rate:%d, adjustment:%d, Target delta ppm:%g"; "Estimated offset(ms):%g, n:%llu"; "Slope change detected. bumping slope dispersion. ErrorMode/OffsetMode"; "clock quality suspect. Sdev: %f"; "Time went backward, discard SNTP offset"; transitions "Clock transition into PCM"/"into system time"; "clock audio sourced: %c"; "Excessive AudioSync %f total"
  - **poll:** SNTP requests to group coordinator ("ret = %x, error = %f"); "SNTP success after %u failures"; "complete sync reset"; "Offset set to %f for server ip:port"; "Suspend and reset"; persistence sntp.txt in sys/debug (save_sntp)
  - **server:** SNTP server on port %hu per clock; server-clock add/remove via "sntp-%u-clock" requests (evtMask+fd); virtual clock install/remove on port %u; interrupt fd + SO_TIMESTAMP + ToS + hi-priority Tx queue
  - **stats_schema:** {Flags,NewServer,UpdateServer,TransitionValidOffset,NotUsed,Valid,Successes,OverThreshold,ErrMode(statistical mode of error values),AudioSync,Slope,vcxoRate,Doubling Ratio,Histogram,BigBin}
## `spotify_connect`

**coverage** `?`

- **esdk_host:**
  - **summary:** spotify_playback_session/queue/smapi/vli/thread blocks 0x10ea32cc-0x10ea4c40 — the host-side eSDK integration
  - **nts_callbacks:** `NTSCallbackConnectionNotify`, `NTSCallbackPlaybackApplyVolume`, `NTSCallbackStreamEnd`, `NTSCallbackStreamSeekToPosition`
  - **esdk_calls:** `loginZC`, `dcLogin`, `SpDisableConnect`, `SpSetDisplayName`, `SpSetDeviceIsGroup`, `SpPlaybackIncreaseUnderrunCount`, `SpPlaybackSetBitrate`, `SpPlaybackPause`, `SpPlaybackPlay`, `SpPlayUriWithOptions`, `SpGetMetadata`
  - **esdk_events:** `TrackChanged`, `ShuffleOn/Off`, `RepeatOn/Off`, `BecameActive/Inactive`, `AudioDeliveryDone`, `ContextChanged`, `MetadataChanged`, `NetworkRequired`, `TrackDownloadStalled`, `QueuedTrackAccepted`
  - **track_queue:** current/next/previous/pending model (%s\|\|%s uri\|\|id pairs); "Track change: (%s\|\|%s) -> (%s\|\|%s)"; mismatch errors incl "\[BUG\] RESOLVING acked NEXT track mismatch"; per-track {pos %lld/%lldms, delivered, rendered}; EndSong @ms; download-complete resets position; stream-id consistency enforced (invalid PlaybackId, id-mismatch on setTrackSize/download-complete); "Suppressing phantom playback-start after end-of-queue"
  - **seek:** fast paths "Resume from pause, offset %zu"/"Seek fast path %u ms"; slow path via SpPlayUri(type,uri) w/ "adjusting initial Play position %u"; "Forcing seek slow path"; "Play from beginning"
  - **queue_ops:** states {Now Pending,Still Pending,Waiting In-Flight,Current Track Pending,Current Track Still Pending}; "Play & Queue Tracks" (+new session/+recover from error); "Max retries (%u) exceeded. Resetting"; pending-track retry counter
  - **smapi_vli:** "SMAPI to VLI transition detected. Forcing loginZC to switch modes and clean eSDK state"; resume-VLI shortcut "already in connect mode - likely resuming VLI (e.g., after AirPlay)"; "Already logged in with same account, skipping loginZC"; TransitionAck tracking \[pos,preLogout pos,transAck\] + "Begin AwaitingTransitionAck"; "Notified we are receiving delegation. Resetting track queue info."; SWPBL-259788 pullContext skip when delegated session not playing; SMAPI mediaType/curTrkStatus/nextTrkStatus tracking
  - **accounts:** auth-token expiry detection -> refresh via upnp; "Login failed with E_SONOS_BAD_ACCOUNT"; service descriptor lookup {sid,g,sn}; "Treating auth token as expired"
  - **telemetry:** ecode mapping "error: %s ecode=%d (%s), mapped to 0x%08x"; fatal-error report rate limit ("restricting excessive fatal error reporting"/"spotify telemetry rate limit exceeded!" spotrl); underrun counter; "Radio:" prefix stripped from restart token
## `stream_metadata`

**coverage** `?`

- **cache:** streamingMetadataCache: "Setting metadata reference time %s at %ld"/"Rejecting invalid stream metadata reference time"; framer selection "%d (%s) framer for: %s"; "%d(%s).sd:(%s,%lld)"; mswmext=.asx sniff; sonosapi tag; "unexpected text/html"; getMediaUri %d + "URI expires in %us" + "dereferenced to: %s"; "Disallow playback of Spotify Free content from Sonos queue" — free-tier gate; "%d: StartTime: %s %dms - %ums %s"
## `upgrade`

**coverage** `?`

- **check_layer:** update-check client: "Fetching %s"/"Failure fetching (0x%x) (%d)"; fields {updateServerIP,httpResult,updateAutoCheckError,useCachedOnly,updateType}; headers X-Sonos-LatestSWGen: %u + Content-Location: %s; "Redirect detected, final URI: %s"; "UPM Invalid"; "Check for updates %s (%u)"/"Check for online update (user)"/"Unknown upgrade server state"; R_AvailableSoftwareUpdate sysprop; SWGen downgrade policy {downgradeMinVersion,downgradeRestrictions,allowDowngradeToPrevSWGen,denyDowngradeToPrevSwGenList}; "Invalid swgen member detected, swgen: 1"
## `upnp_eventing`

**coverage** `?`

- **renew_fsm:** events {"Unsubscribe in renew ... (oos:%d seq:%d)","Successfully renewed","Failed to renew ... HTTP Result: %d; SR: %08x","Subscribe ... Port: %u; Secure Eventing: %d (srRet=%d)","Successfully subscribed ... UDN %s","Received SID %s for deleted client","Received OOS %u / %u for SID %s" (out-of-seq tracking),"Not unsubscribing because bSendUnsubscribeRequest=false"}; /status/subrenew schema <Outgoing>{<LogicalSID>,<UPnPSID>,<EventURI>,<FailureCount>,<NextRenew>,<ExpectedSeq>}; secure-eventing flag on subscribe; thread subrenew_static
## `vli`

**coverage** `?`

- **sink:** vlintxsink "VLI NodeTX Blocks": "lTransmitOffBox is now %d \[uni=%c\]"; "NodeTx configured to handle %s audio (qos: %d)"; "delay sending new frames until resend finishes"
- **ctrl:**
  - **callbacks:** `onVirtualLineInGetVolume`, `onVirtualLineInSessionStartInfoUpdated`, `onVirtualLineInStartSession`, `onVirtualLineInStopSession`, `onVirtualLineInSuspendSession`, `onPlaybackStateChanged`, `processSetVolume`, `onVirtualLineInNameChanged`, `onVirtualLineInMetaDataChanged`, `onVirtualLineInPlayModesChanged`
  - **events:** `VolumeSetActionEvent`, `VliVolumeProcessingCompleteEvent{vliType,success,flags}`, `VliSessionProcessingCompleteEvent{vliType,action,success,flags}`, `VliTransportAction`, `AvtHaltActionEvent`, `AvtVliActionEvent`, `GroupVolumeSetActionEvent`, `VolumeChangedEvent(vli source)`, `VliPropertiesChangedEvent{name,md,mode}`
  - **types:** `AirPlay`, `bluetooth/Bluetooth`, `tvproxy/TV Proxy`
  - **details:** cookie-based session tracking; waitOnTxBitFlagsClearedLocked; "StartSession for unusable/unknown type"; protocolInfo="x-sonos-vli:*:audio:*"; "VLIGroupIDs cannot contain commas"; completion-signal timeouts
## `zone_topology`

**coverage** `?`

- **topology_base:**
  - **quarantine:** discovery quarantine {quarantinedCount,latestPlayerWithQuarantineEvent,stabilizationTime,latestDownloadErrorCode,latestDownloadErrorReason,quarantining}; "Report player missed by %s"/missedBy/missedPlayer; quarantineRecheck job; "Player %s removed from quarantine"
  - **wow:** satellite wake: "\[%s\] %s WoW magic packet for MAC %02X.."; "Attempted to wake %zu missing secondary ZP of primary %s (sent WoW to %zu)" — bonded secondary WoW
  - **vanish_fsm:** states {active→vanished} with {byebye reason,reasonforvanish,vanishbatterypercentage,vanishbatterytemperature,timesincevanish}; "Broadcasted unresponsive device %s"; "Received 'Remove' message pointing to local device"; "VerifyThenRemoveSystemwide: Not removing, %s is present"; removeknown/hwver actions; "device %s removed from vanished list after factory reset"
  - **discovery:** handleNewOrUpdatedZP "%s found %s at %s; age: %d; addr: %s; host: %s; proxy: %s; ports={%u-%u}"; IP-change detect "ZP (%s) changed IP address from %s to %s"; link-local 169.254 guards; "Updated network hash: \[%s\] => \[%s\]"; "new bootseq"; "%s ZP %s (bootseq %u)"; X-Sonos-LatestSWGen + Content-Location headers; "Faking device %s (%s) props to be %s gc"; designated {PlayerDesignatedDevice missing required field %s}; "All devices idle for %ld s"; topmon thread
- **discovered_zp_cache:** RDiscoveredZP/RDiscoveredZPs/RVanishedZPs replicated objects: "Updating RDiscoveredZP - current group %s - previous group %s"; "applying cached changes 0x%x on top of 0x%x"; "RDiscoveredZP is not yet valid, caching SID %s change map: 0x%x" (subscription change-map cache); "Got GM info for %s (%s, %s) in group %s (%s)"; device-desc dd_{mhh,sn,md,bld,in_hh,in_ver} + isHtap:%d; version-gated eventing "DiscoveredZP version=%u.%u.%u, using %s eventing" (secure\|insecure); "got discovery packet from another subnet -- mask: %x"; "detected/un-detected 3rd party extender: %s != %s"; vanish reasons {LOW BATTERY,EXPIRED} + " (wakeable)"
