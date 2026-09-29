# Non-SOAP subsystems

Self-contained protocols/engines living in the same binary beside or below the UPnP layer. `absent` = no coverage, `vocab` = names/strings catalogued but semantics undecoded, `partial` = some real documentation exists. Evidence addresses are the rodata anchor strings.

| Subsystem | Coverage | Summary |
|---|---|---|
| `ab_experiments` | **partial** | production A/B experiment framework: a /experiments local endpoint plus a replicated <ZoneExperiments> store of <ZoneExperiment id name value defaultValue> rows; presence gated by featureConfigZoneExperiment; values influence runtime policy |
| `abr_engine` | **partial** | DS (data-source) selection FSM {"Unable to select another DS","waiting to fetch new playlist","fetching new playlist now"}; playlist failures {"Timed out looking for playlist","no time to recover (%ld buffer)","Too many empty playlists and no audio left/(still %ldms ahead)","Switching source due to empty playlists"}; notifyFrame ty:%d ln:%zu so:%zu ns:%zu f:%u ctx:%u:%u:%llu; getContentKey; fetch "open: %s (0x%x) %d len %llu offset %llu"/"redirect: %s -> %s"/"Segment's content type"/"Using file ext."; "URIs for %g seconds, wake up in %d"; "prebuffering %u bytes within %ld msec"; "start new stream for URI \[%s\], resumeLoc %zu time offset"; "Reset ABR state: start bitrate %u"/"Last estimated bitrate %u"; rate model "rate: SR=%.03lf (%zu) S=%d Sth=%d BL=%.0lf" + "rate(%7d): %.2lf/%.2lf SA=%.2lf b=%u/%u B=%u/%u/%u h=%d/%d r=%.2lf a=%.2lf" + happy metrics {"happy (a > %.2lf)","happy (saturated)","rate update: a=1","was happy","unhappy",Underruns}; InitFramerForTrackList-fail source switch; codec mp4a.40.*; URI version regex /v\[0-9\]+\.\[0-9\]+(\.\[0-9\]+)?(-\[a-zA-Z\]+)?(\+\[a-zA-Z.\]+)?(\[?#/\]\|$) |
| `account_cert_lifecycle` | **partial** | three cert managers (certmanager/devicecertmanager/regdevicecert) over four keycert identities; the registration cert carries the device's SonosID and is required for token generation ('sr: reg cert not available; cannot generate token'); a /regcert status endpoint exposes DeviceCertInfo XML; root-of-trust bundles are fetched from /certbundles/v4/trusted_roots.rcb with ETag caching and retry backoff |
| `account_migration` | **partial** | OAuthMigration flow {reauth,token generation,getAuthTokenResult,accountToOAuthResult}: "migrated account to OAuth, type:%u, sn: %u" + retry {res,retry count,"delay migration until cloud connection","expected ouath account; reset to retry migration"}; "failed to replace email with username for last.fm"; sonos-radio gate {"no SBiz entitlement; preinstalling Sonos Radio","found SBiz entitlement; blocking preinstall"} + "stale entitlements; scheduling job to refresh"; preinstall SID=%u attempts; SA_RINCON65031_ service-account prefix; settings {R_HideTuneIn,R_MigratedTuneIn}; maintenance {"failed to download manifest file for account sid/sn","received empty hash","failed to update userInfo and clean up user hash","Failed to getUserInfo during SvcMaintenance","failed to migrate built-in accounts","failed to migrate pre cloud replication accounts"} |
| `amp_manager` | **partial** | ops {power,mute,hipower} with "ignored unsupported amp command" guard; power rails {"transition to high power rail","to low power rail"}; off-decision fields "roff:%d canoff:%d ofx:%d nzvplay:%d pre:%d unm:%d"; "scheduling off in %d sec"; "failed to unmute amps to clear fault"; "ampState %d -> %d" + notifyAmpState; threads ampMgr |
| `areas` | **partial** | areas.json file; Everywhere area UUID 7055133f-81e7-45e6-ba70-8803966c7185; validation {"Area IDs must be distinct","Maximum area limit (%d) reached","Cannot update read-only area"}; fields {areaId,playerIds array}; accept-file staging {accepted file load/rename} + schema version check "Loaded areas schema version (%d) differs from local version (%d)" |
| `arp_assoc` | **partial** | arpchecker "ARP failure: %d consecutive attempts for %s failed: groupcast problem suspected" + "ARP to %s resolved after %d failures" + source_ip/msreplyfailure; arping {async,sync} "started for %s, every %u ms for %u ms" + reset-on-data + timeout adjust + "pending reset in progress" guard; assoctracker CrAssoc metrics {mstime1,mstime2,msnum,arpscstime,arpatt,arpscs,arpsnum,ddtime1,ddtime2,ddnum} + "Skip reporting invalid CrAssoc event" |
| `async_stream` | **partial** | init {buffersize,multiThread,ratelimit us}; segment table (realloc to %zu entries); alloc policy {satisfied by track transition\|deleting played data\|not satisfied}; "Started reaping played data. Lose fast scrubbing backwards"; CDN fallback {">>>Sync read from CDN at offset %zu","Opportunistic sync read from CDN"}; "File is in memory!"; seek sessions "new seek based PB session"; "Socket has: %zu bytes ... CHSRC ms ahead: %ld"; stats mrrkbs/arrkbs + "Avg read rate %zuKB/sec; min read rate %zu"; "Atom Table Full" bound; threads asyncstrmio/asyncstreamiomgr |
| `audio_clip` | **partial** | muse routes players/%s/audioClip + groups/%s/playback/%s + "forward to %s"; clip object type audioClip; fields {priority,clipType,clipLEDBehavior,clipBehavior,buzzers}; buzzer clips file://%s/buzzers/%d.mp3 + %u:%c; custom requires streamUrl "Missing streamUrl (required for custom clip type)"; httpAuthorization → "Secure streamUrl required when providing httpAuthorization"; delivery {Using AVT,Using External Audio Source}; priority "Cannot interrupt current clip due to priority policies"; pause content first "Failed to pause content because group info could not be retrieved for UUID=%s, ZoneGroupID=%s"; errors {Invalid clip type,Invalid clip id,Clip id not found,Error starting audio clip,failed getting audio clip response,"unexpected object type %s, expecting audioClip"}; resume content after |
| `audio_decoder` | **partial** | status <SampleRate><SampleBitDepth><NumChannels><ChannelMap><FrameSize>; lifecycle {decoder create/init,header,seek tvResume=%ld.%ld,"seeking to absolute position = (%llu / %llu)","capping aboslute seek position",scan,get pos}; errors {decode err skip/pos/flush/set pos,too many errors,no progress(eof,o),open failed,streaming hint failed,read out of accum space,read eof,reached expected eof pos,seek failed,len failed}; unsupported {too many samples,channels,bit depth}; REPLAYGAIN_TRACK_GAIN= + gain=%f; ogg errors {seek,bailed out,no mem,no init}; ffmpeg/WMA: wmaSeekPacket offset bound; AVFormatContext alloc/open; stream-info/audio-stream find; resume loc byte→time fallback "Resume location %zu exceeds file size %zu, falling back to time-based seek"; "Seeking to position %zu"/"Seeking to time: %lld microseconds"; "Stream duration: %zu milliseconds"/"File size: %zu bytes"/"Estimated offset %zu exceeds file size"; attached-picture extract image/jpeg; libavformat metadata album_artist; codec ctx {not found id,alloc,params,open,pAVPacket/pAVFrame}; frames {send/recv errors,send result status eof}; payload bounds {Extradata too large,Codec params size,Packet size too large,Codec params too large for cache,Packet too large for cached payload}; "no client, ptvResume, fileURI, or uri opener provided, we won't continue" |
| `audio_fifo` | **partial** | records with {pos,range}; writes {"Advance write to next record","Rejecting write, as provided offset %zu != %zu (pending)","not enough fifo records","truncated write","Audio fifo records reset"}; discontinuity {"Discontinuity @ offset %zu in record %zu (expecting: %zu)","*** Too many discontinuities"}; reads {"Consumed contiguous samples (%zu - %zu)","Advance read to next contiguous record","Read %zu bytes from record","No bytes to read from fifo... EOF","audio fifo read at boundary eof","consumed exactly to the eof marker","reached logical boundary","already has pending offset"}; prebuffer {"prebuffering... (used/prebuffer)","Waited %ums for audio from the eSDK","Finished prebuffering in %u ms (st,flush)","prebuffering elapsed %u ms (used/free)","exit waiting for audio, not rendering"} — Spotify eSDK feed |
| `audio_rate_ctrl` | **partial** | ARC: setCoefficients StdQ ASRC; guards {adjust rate of 0,unsupported channels,Unsupported Input Audio/Line Rate,Over Excursion error,sample rate converter error read}; reconfig on rate/channel-count/line-rate change; timesync: databurst LockTime, "Rate Maxed"/"Rate Inv Maxed" rails m_dOverallRate/m_dIntegratedRate, iter dump {LE,LEP,IC,ICP,IL,RT,err,errf,dOut,dIn,AP,RL}; "time went back; try again"; "Thread descheduled for %uus. Limit %uus"; SRC mute on \|drift\| "(Should) Mute SRC. dAbsoluteError = %f, current canonical rate = %u"; "Out of bounds. drift: %f mute count: %d" |
| `audio_stream_mixer` | **partial** | stream ops {start buffering,set presentation time,resync,drain flag,skipAhead} + stats "E:%d, D:%d, B:%d, PR:%d"; fade engine "fade added: %i.%i sample_len(%u) current_gain target_gain rate" + max/min/fade complete + "no fade slots available"; skipAhead "delta:%u > buffered:%u"; "discontinuity detected after scheduled resync"; mixer: bManageOutputLatency,startup buffers,buffers; fd poll sound.fd.poll.%04X; stall detect "loop(wall): %uus loop(cpu): %uus, sel: %uus"; states MTS_PLAYING transition; DSP drain FSM {"start dsp flushing %i buffers","dsp flushing ended %i frames early","driver draining","dsp flushing complete with od %u"}; stream names as-{dspin,dspout}{-tv,-ext-voice,-ext-chirp}/as-src{in,out}-ext-voice/%s-chsnk%zu; system/audio_out_disable + "Running with audio output disabled"; forcePerfectInitialSync; "KERNEL_PRINTK_ENABLE ... mixer scheduling can't be guaranteed"; "Testpoint delay of %ums" |
| `audio_tap` | **partial** | errors {no tap specified,syntax error,invalid request,permission denied} + audio/wav; mic gate "allowed %d mic %d"; taps {linein,codecout,irdecoder,mixersat,mixergm,as-srcin-chsnk0,as-srcout-chsnk0,mixerstats,dspout,formatter,llaout,mixerout,mzdsp,extvoice,extchirp}; spdiftap.compressed + "Internal SPDIF Tap Snapshotted. Tap must be uncompressed before use!"; sonos-dspid header |
| `audio_taps` | **partial** | PCM-capture tap subsystem (audiotap_manager.cxx + datatap.cxx): guarded /audio_tap /spdiftap /snapshotspdiftap /downloadspdiftap endpoints, versioned tap-file format with audio+metadata sections, SPDIF tap used to sync TV-input playback against the output tap |
| `auto_update` | **partial** | states {ST_UNDEFINED,ST_INIT,ST_REFRESH,ST_SCHEDULED,ST_SCHEDULED_POST_WOW,ST_SESSION_MONITOR,ST_SESSION_REPORT,ST_SESSION_ACTIVE} + PendingStart/SessionStart/SessionStartLocal/SessionAttempts counters; settings {R_AutoUpdateWindowStart,R_AutoUpdatePolicy,R_CheckUpdateInterval}; blockers {"Upcoming alarm is preventing update","Active device(s) preventing update"}; "Trimming the window to (%d) seconds"/shrinkWindow; upgrade_mgr_report.json {pendingUpdateHours,numUpdateAttempts,startTime,elapsedSeconds,blockedUpdateReason,updateHHStatus,serverIP,errorMsg,extendedError,zoneType,startVersion,targetVersion,hardwareVersion,serialNumber,updateZPResult,numZPsInHH,numZPsInHHDelta,numZPsToUpdate,numZPsDropped,targetSystemVersion,updateHHResult,numFailedZPs,numZPsWithError}; "RINCON_%s01400 updated to %s"/"update failed (%d)"; "Retrying upgrade (%d/%d)..."/"Giving up after max upgrade attempts"; upgrade_mgr.txt state file |
| `boot_sequence` | **partial** | "updating boot sequence due to wifi connection event"; settings {TargetRoomName,LocalAccountTransferMode,ForceWifiDisable,ForceMeshDisable,SonosNetDisable,WEPKey} |
| `bt_sbc` | **partial** | params "freq=%u blks=%u sb=%u mode=%u alloc=%u bitpool=%u end=%u fin=%zu fout=%zu frames=%zu"; errors {Invalid packet header,Failed to parse %zd,Truncated packet. Lost frames,Invalid packet,frame size changed %zu->%zu,decoder error %zd on frame %zu,Bad SBC frame %zu read/decoded,NOTIFYFRAME_ERR_BUFFERING,unknown frame status} |
| `business_msp` | **partial** | Sonos-for-Business managed-service machinery: SOAP ops AddRemoveSonosBusinessMSP / Sync Sonos Business MSP / AddRemoveSfbMSP, /msprox + /msprox?uuid= proxy endpoints, three tier vocabulary (SFB_COMMERCIAL/ESSENTIALS/PREMIUM_MSP + commercial/essentials/premium-msp slugs), Backgrounds MSP add/remove, enableRemoveMSPCredentialsFromUPnP flag, voice-service MSP education keys (O_AMAZON/GOOGLE_SHOW_MSP_EDUCATION) |
| `buttons_ir` | **partial** | button + IR input pipeline: hw-message BUTTON multicast group carries events, longpress.cxx handles holds, events forward to the group coordinator ('Forwarding button events'), /button_triggered\[.xml\] diagnostic capture, /rdmbuttonfwd retail hook, virtualRemoteControl/buttonCommand muse route injects button presses from the cloud; irdecoder.cxx learns TV-remote codes against the ir.ws.sonos.com database |
| `capability_guards` | **partial** | "Supported only for devices that support power over ethernet and have ethernet support"; "Supported only for devices with a water sensor"; "Supported only on devices with a microphone switch"; "Device is not a subwoofer"; "Supported only on suspendable devices" + {requiredMinimumBatteryPercentage,requiredMaximumBatteryPercentage,durationSeconds}; "Supported only on devices with a battery"; "Supported only on devices with bluetooth" + "Unable to set bluetooth pairing, unsupported"; "target is not a home theater source"/"target does not support HDMI CEC" + tvPowerState; "Setting is not valid" |
| `chirp` | **partial** | /code/chirp-core/source/{core,dsp,maths}/src/** paths in rodata 0x10fd0188-0x10fd4c74 |
| `chirp_stack` | **partial** | embedded chirp-core 4.2.1_7265 acoustic data-over-audio SDK with a custom 'sonos-cdma' profile: used for room detection during setup — muse routes roomDetection/chirp (start/stop signalling with {playId}), DSP-routed audio streams as-dspin-ext-chirp/as-dspout-ext-chirp, a per-device unique payload ('Start chirping with unique device value:%d') and calibrated output volume ('Chirp volume not yet calibrated') |
| `cloud_queue` | **partial** | resources {itemWindow?,context?,version?,version?updateToken=true&}; params {isExplicit,previousWindowSize,upcomingWindowSize,heardItemId}; truncation {item window,context,version} |
| `cloud_synchronizer` | **partial** | cloud_synchronizer thread: registerServices (max-count abort, called-once guard), "received JIT event", "discarding %s type %d" |
| `crash_report` | **partial** | {procName,numCrashes,uploadResp,playerCrash,lifetime}; "%s %s crash event, crashCount: %i"; Reported/Failed to report |
| `dev_disc` | **partial** | devdiscthr/ddthrd.cxx: rx logging "%s - rx MSEARCH %s from %s:%d (%zd %d %d)", "%s - rx %s ALIVE %s %s %d %u %s (%zd)", "%s - rx %s BYEBYE %s", "%s - rx CDALIVE %s %s %d", "%s - rx CDBYEBYE %s", "rx  QUARANTINE_RECHECK %s"; "%s - %u SSDP messages lost"; zp byebye; "ddt hint:%d"; "Finished working on type %d" |
| `device_unlock` | **partial** | developer/manufacturing unlock surface: /unlock, /devunlock, /mfgunlock and /unlock.htm endpoints write /tmp/device_unlocked_flag; unlocks are rate-limited ('Too Many Unlocks' HTML page) and DevUnlock reboots the player; RdeviceIsUnlocked and RabortIfUnlocked let self-tests detect and refuse to run on unlocked units; 'unlockedBld' marks the build state |
| `didl_extractor` | **partial** | rincon md fields {tiid,radioName,connotation,state,trackGain,chapterNum,chapterCount,linkUrl,isAd,streamContent,audioInputIcon,radioShowMd,streamInfo,rating,policies,podcast,episodeNumber,releaseDate,narrator,albumArtist,numSections} + upnp {originalTrackNumber,album}; classes {object.item.audioItem.podcast,.show,.audioBook.chapter,.musicTrack.recentShow}; loadFromExtraMd(trackURI,extraMd); extractMimeTypeFromHttpContentType (trunc/mtParams errors); protocolInfos {http-get,rtsp-rtp-udp,x-sonos-vli:*:audio:*,x-rincon-queue:*:*:*}; " duration=" attr; &#10; newline; -yYy- marker |
| `dolby_decoder` | **partial** | config files /opt/dsp/dolby_config.json + app/debug/dsp/dolby_config.json jffs override; keys {boost,speakers,directdec,virt_mode,frontangle,heightangle,rearsurrangle,oarBassExtraction,dapCutOff,hfilt,vlamp,vmcal} + DRC {movie,night,disable} + crossover 100-200HZ + speaker roles lrrse/lrrs1/lrrs2; Evolution mem {static,dynamic byte allocs}, timeslice processing, malformed-input detect; status <DEC_SampleRate><LFEPresence><DEC_ChanCount> + <BlocksInTimeSlice><ACMOD><DataRate><DialNorm><SURRMOD> |
| `dropout_logging` | **partial** | triggers {corr ctx chg evt type %u,grp role chg evt %u->%u,clear/set cid src=%u,set/reset pt}; slot model {clr slot,slot in use skip incr,set slot %zu idx %zu to %s,no space in list}; conditions {set pt reached,flag report at %zu sbmt,set pos aud,pt in fut - inaud,GCI but no CID}; per-ch incr "incr call: %s, %zu, %zu, ch %zu, %d.%06d"; fields {inputType,SatChCount,HtsnkVersion,msAfterPt,GroupRole,GCTimeValid,GCTime,btRole,submit}; counters {htsnk_missed_total,htsnk_missed_duration_total,htsnk_late_total,htsnk_strm_reset_duration_total,htsnk_strm_silence_duration_total,htsnk_strm_plc_duration_total}; reasons {chsnk_lse,chsnk_ch_data_full,chsnk_w_err,chsrc_framer_uflw,htsnk_invld_sntp,htsnk_late_frames,htsnk_missed_frames,htsnk_time_backw,htsnk_stream_err,htsnk_stream_uflw,htsnk_stream_reset_duration,htsnk_wrong_frame}; bt_audio + injectdropout test cmd {"missing dt param","Injected dropout error"}; "Sat chs %zu"/"Sat htsnk ver %u" |
| `dsp_files` | **partial** | files {eqdata.txt,app/debug/dsp,persistentEQ.xml,/dsp/eqdata.txt,dsp_preset.xml,dsp_preset_default.xml,dsp_preset_satellite.xml,dsp_system_default.bin,dsp_system_satellite.bin,satellite_processor.bin}; sonar-tone flush {"flushing sonar tones","Flushed"}; htdocs_locked; "modZPAmpTimer() called"; "unable to delete %s even though it exists"/"successfully deleted %s"; settings {ZPLocalSettingsFile,ZPExpirationTime,ZPGroupExpirationTime,ZPForcedUPnPExpirationTimeout,ZPMusicServicesBackstop,ZPTimeZonesBackstop}; "Setting JFFS root to %s" + ServerRoot + ContinueAfterIPChange + #GROUP_NAME# + "Failure generating group description xml" |
| `dsp_ht_engine` | **partial** | home-theatre DSP parameter surface + per-zone audio state schemas fully recovered: HT config XML (surround/sub/downmix/dialog/AI-speech/height levels, autoplay/autostop thresholds, Tweaks bitmask), 37-field per-Zone audio XML, zone volume/duck XML; R_MASK_* speaker layouts enumerate supported channel masks |
| `dts_decoder` | **partial** | profiles {Digital Surround,Digital Surround 96/24,Digital Surround ES,High Resolution Audio,HD-MA,Express,Unknown DTS profile}; sync "Endian-Check: Unexpected Input Syncword Error"; "invalid dcadec audio mode, returning empty speaker layout"; status <BitDepth><DTSProfile><BitRate><NumPrimaryChannels><AudioMode><DialNormGainDB><ChannelMap>; errors {invalid sample size N-bit,encoded frame exceeds maximum,packet parse,frame 0 warning,unsupported sample freq,unsupported amode}; modes {Dual Mono,Stereo} |
| `embedded_sqlite` | **partial** | embedded libsqlite3 (sqlite3_open_v2/prepare_v2/step/bind_*/column_*/exec/busy_timeout) backs LocalTimer persistence in timer.db — the alarm/sleep-timer store; two tables with full DDL recovered verbatim \| proven tables (timers_impl.cxx): timers(id TEXT PRIMARY KEY, trigger_time TEXT NOT NULL, total_duration INTEGER NOT NULL, triggered NUMERIC NOT NULL) — local/suspend timers (timers_impl.cxx) \| suspend model: pause -> row in paused_timers w/ remaining_seconds+paused_utc_time; resume -> recompute trigger_time \| libFLAC embedded codec: reference libFLAC 1.3.4 20220220 |
| `entitlements` | **partial** | entitlements manager with cloud fetch + local cache, muse-subscribed change events, and a runtime policy hook (RRuntimeZPPolicy takes entitlementsMgr); typed SKU records decide e.g. whether Sonos Radio is preinstalled |
| `ext_audio_src` | **partial** | job FSM {STARTING,RESUMING,RESUMED,CANCELLED,DISCARDED} + ops {stopPlaying(too many/no jobs),processJob,WaitForComplete,playDeferredStream(deferred j/d counts),playStream(exclusivity skip)} + "too many deferred jobs"/"playing job %u is missing"/"current job %u gone"; clip types {COMMON,AUDIOCLIP,AVT_HACK,ALEXA_TTS,ALEXA_WELCOME,ALEXA_FAILURE,ALEXA_ALERT,GOOGLE_MEDIA,GOOGLE_ALARM,GOOGLE_TTS,SVE_TTS,VOCAL_GUIDANCE,ALERT,SETUP_CHIRP,DISCOVERY} with intr flag "processing type %s %d (intr=%d)"; volume override "\[%i, %i - %i over %ums\]" ramp + "\[%i, % i\]"; "eventing play status for job %u: %s \[%s\] @%d.%06d"; decoder {failed to get decoder,illegal sample frequency,zero len frame,decoder flagged playback stop,unsupported channel count > 2}; extaudiosrc_playid |
| `factory_reset` | **partial** | factory reset machinery: a 'Factory Reset'/'Remote factory reset' CSRF-posted confirm form, /jffs/factoryReset.txt marker file ('unable to create factory reset file.', 'factory reset had errors', ': not factory reset'), LED_MODE_FACTORY_RESET pattern, sonosFactoryResetFull entry point, household-wide consequence ('device: %s %s removed from vanished list after factory reset'), and 'Invalid system settings (%s), resetting to factory defaults' as a self-heal path; muse route management/factoryReset can trigger it remotely |
| `favorites` | **partial** | replication "replicating favorites from %s"/"deciding whether to accept replicated list" + informReplicationAndNotify{,ForDestroy} + offerRemoteSetting; DIDL ns {xmlns:dc purl.org/dc/elements/1.1,xmlns:upnp,xmlns:r rinconnetworks,xmlns DIDL-Lite}; migration {old rhapsody→new,old non-OAuth} + "Failed to parse account service ID / serial number from Sonos URI"; errors {Invalid favorite id,Could not access favorites,initContentResource {parse URI,extract item ID,Invalid item ID,No valid mapping for item type}}; shortcuts/shortcut type; fields {AlbumArtURI,NextFavorite,FirmwareVersion,Description,ResMD}; cdudn + nameSpace + restricted + parentID |
| `favourites_model` | **partial** | Sonos favourites store + ContentDirectory projection: FV:2 root container paired with FavoritesUpdateID; XML store schema recovered; mutation via CDS CreateObject/UpdateObject/DestroyObject on the dirObjFavorites vtable + muse getFavorites/loadFavorite routes |
| `fdevent` | **partial** | ops {removeFd,waitForEvent}; thread names fdevent.{signal.write,wait.poll,check.poll,reset.read}; EventSync %s; epoll_create1/epoll_ctl/epoll_wait error paths; fd capacity bound "%d already monitored"/"exceeded the fd capacity of %d" |
| `feature_config` | **partial** | GET /features/v1/config? (cache-control: no-cache); files cloudconfig.json/cloudconfig_override.json with {swVersion,hwVersion}; precedence: override > cloud-cached > cloud-persisted; "failed to fetch config: not securely registered"; "Already have fresh data. Skipping Fetch."; "failed to connect. rescheduling in 1 hour"; stale markers; FCS Cache via g_pZone |
| `feature_flag_registry` | **partial** | complete compile-time feature/config flag vocabulary (48 keys): featureConfig* family keys in the cloud-config JSON doc plus enable*/disable* booleans read at init — the build's feature map showing which subsystems are switchable |
| `fileio` | **partial** | async register/unregister + enabled; SMB readdir + "failed to open SMB dir"; "File is in memory" skip-open; "Success opening URI %s; stream type %d"; "Sonos API URI %s not dereferenced before opening stream"; prebuffering + "reopening http for streaming at %zu" + ?after= resume; "application/xml; listing" dir listing; "no framer found in factory, returning null, we should not reach here" |
| `fmp4_parser` | **partial** | boxes {mfhd(seq check),tfhd(version),tfdt,trun space bounds} + "tfhd not found before trun"; trun table "seqnum %u truntblnum %zu fsize %zu foffset %zu fsamples %zu bdo %llu trundo %i truneo %zu trunes %zu trunep %zu"; senc "Sub-entry encryption isn't supported" + "Cannot parse all the IVs in senc at %dth entry"; "stream quality: encoder %s, bit depth %u, sample rate %u, bitrate %u, channels %u"; trims {encoder delay,padding} + "skipping frame; seek time offset"/"< usable offset"; atoms {iTunNORM,iTunSMPB,TLOU/ALOU ITU loudness,mehd,trex,traf,esds max/avg bitrate,alac sub,mp4a ch/bitdepth/samplerate}; errors {bad moof,no moov,no dat,unknown fmp4 encoder type,unsupported file ch/bitdepth,unsupported frequency %u-bit %uhz %u channels,frag w/o traf,STZ2 ignored}; formats %ub%u |
| `group_object_model` | **partial** | zone grouping internals: bonded-role enum (HT_BONDED_MASTER/SATELLITE, UNBONDED_DEVICE, stereo-pair/sub combos), coordinator ops (BecomeGroupCoordinator\[AndSource\] with GC-state cloning + VLI delegation, ChangeCoordinator, DelegatedGroupCoordinatorID), topology monitor with settle-retry, satellite lifecycle (Add/RemoveHTSatellite, recoverBondedZone FSM), per-satellite DSP protobuf + tuning push |
| `group_rc` | **partial** | group vol snapshot {"snapshot %s: %u (was %u)","snapshot sum for %u (of %u) zones"} + DesiredVolume/DesiredMute; algo "calculateVolume %s: sg:%.4f ng:%u sv:%u nv:%.4f" + gvd {t,c,f,m,cv,sv}; tracking {addZone already tracked,removeZone not tracked,transitionValid c/m/f}; faults {total failure,partial failure,all members use fixed volume,operation in progress,unexpected upnp fault}; events {GroupVolumeSetActionEvent(vol,mute,vligrouping),VliVolumeProcessingCompleteEvent vliType}; members {localRC vol/mute/fixed,remoteRC %s vol/mute/fixed}; ops {SetGroupMute local/remote rc,SetGroupVolume local netops zones + per-member rc}; group caps {"Group capability updated: 0x%08x -> 0x%08x","Spatial audio disabled in Area Zone","Spatial audio disabled: mask"} + enableSpatialAudio + "GroupCapabilities zp: %s: %i,%i,%i"; cap strings {widevine,atmos,portable,tv_in,hlsv7} |
| `healthcheck` | **partial** | schedule "Next healthcheck scheduled to run in %u hour(s), %u minute(s), %u second(s)" + "Not scheduling: %d %d %d %d %d %d" 6-gate + "Healthcheck timer pop"/reschedule; fields {SubmitPermission,ServerDiagInstructions}; instructions fetched /ws/diag/diag_instructions.xml?hhid= ; errors {I/O+HTTP Result,Indeterminate length,Incomplete,parse fail,too large} |
| `healthcheck_contact` | **partial** | schedule "Next healthcheck scheduled to run in %u h %u m %u s" + "Not scheduling: %d %d %d %d %d %d" + "Healthcheck timer pop" + "Rescheduling next healthcheck"; server /ws/diag/diag_instructions.xml?hhid= + SubmitPermission + ServerDiagInstructions + "Contacting server for instructions"; errors {I/O Error + HTTP Result,Indeterminate length,Incomplete file,Failed to parse,too large} |
| `history_mgr` | **partial** | historyService + rphistory + historyEntryInvalid event + ucsType; cache {preCache,postCache,preEtag,postEtag,cacheControl,historyRequest} + "Updating history cache: \[status\]\[key\]\[etag\]\[cache-control\]" + "Cached etag" + "corrupt cache could not be served after a 304"; POST postHistory + recentlyPlayed + max-age + "max-age=%s, etag=%s, http-result=%d" + "Post History Buffer Cleared"; queue faults {bufferFull,invalidContentType,resourceIncomplete(name,type,objectId),groupIncomplete(name,id,coordinatorId)}; fields {imageUrl,explicit}; getHistory {serving the cache,#getHistory response} gated by {Securely Registered,History Enabled}; deleteHistory history?id=; "Failed to generate defaults for history entry"; "Failed to initialize history from cache" |
| `hls_audio` | **partial** | "requires group capabilities %u"; seek {to time %.3f (%lu:%02lu:%02lu),to time from start of current segment,pass segment,to segment start time range}; "forcing a source switch due to multiple codec variants in playlist"; ADTS metadata {metadata,no metadata bumping seconds advanced,cached seconds advanced mismatch}; EXT-X-KEY {METHOD= AES-128,/SAMPLE-AES,,KEYFORMAT=,URI=data,URI=""} + "encrypted but no key URI"/"encrypted but no data from key URI"/"No IV, using seq. num"/"SAMPLE-AES detected. Setting up audio framer decryption"/"Key extracted. method=%d"/"undefined encryption method"; track playback {bitrate %u stream %u segment %llu offset %zu,InitFramerForTrackList failed,m_dTimeOffset,Trim offset required,resetMetadata,track play time,seconds advanced,time offset of segment byte offset}; bitrate report "hls-%s said: %u (%g) %d %d"; types {hls-live,hls-static,hls-???}; master {fetching master,updated master URI}; playlist errors {EXT-X-TARGETDURATION not present,media seq went backwards,media len changed,Invalid media playlist,Seeking pass the end,empty track list,Error %x occurred}; stale {d d llu llu}; Segment Map entries |
| `hls_player` | **partial** | variants {hls-live,hls-static,hls-???}; "requires group capabilities %u"; "forcing a source switch due to multiple codec variants in playlist"; ADTS md + "seconds advanced" tracking + "doesn't line up with seek"; encryption {encrypted-but-no-key-URI,no-data,"No IV, using seq. num.","SAMPLE-AES detected. Setting up audio framer decryption",key-uri http status,read size mismatch}; byte-range map "couldn't get file size from http headers for map"/"found offset %zu"; InitFramerForTrackList; seg index "starting at bitrate %u stream %u segment %llu offset %zu"; master {updated master URI,fetching master,version %u bitrate max/cur/min,getIndexURI,"Failed to calculate absolute media URI"}; ABR {"downgrade bitrate","already at the minimum","upgrade bitrate","advancing stream index"}; rendition filters {rgchStreamURI empty,PROGRAM-ID,invalid rendition,"rejecting binaural/downmix rendition",BANDWIDTH unsupported/0}; "unexpected, we have %zu dolby streams in the playlist"; BR P\|TYPE=SNG marker; seq discontinuity detect; threads {segaudio,hlsmeta,hlsplaylist} |
| `household_settings` | **partial** | file householdsettings.json {fileVersion,fileSchemaVersion,householdSettings}; JSON \[{version,lastUpdateDevice},\[{name:"restricted-admin",readPermission:null,writePermission:"hh-config-admin",settings:\[{explicitContentFiltering,recentlyPlayed}\]}\]\]; categories {restricted-admin,protected-admin,protected}; frozen:1 marker; "File upgraded to v%d schema"/"File overwritten due to invalid setting"; UMTracking→userMetricsTracking migration; "version incremented after invalid settings offered"; hhSwgenState swgen must be >= player; /householdsettings.json status-page ALERT |
| `hw_events` | **partial** | hwmessagelib + NetLink multicastGrp + repeat interval; events selthrd.RHWEvtHandlerZP.{reset,data,except,timeout}; readEvent {overflow,unknown,readNextMsg ERROR}; button forwarding {'Forwarding button events','Disabling button event forwarding'} to private-IP-only target {Unable to translate address,Host not private IP,Invalid host IP,Invalid port no,socket errors}; FSM states {NOT_IN_HOUSEHOLD,PROCESSING_PLAYBACK,IN_DEMO_MODE,IN_RDM_MODE,IN_BUTTON_OBSERVATION_MODE,IN_TRANSFER_MODE,PROCESSING_JOIN,JOIN_CHIME_UNAVAILABLE,REGISTRATION_CHIME_UNAVAILABLE,BUTTONS_LOCKED,DAT_IN_BUTTONLESS_SETUP_MODE,DAT_IN_SETUP_DISCOVERY}; setup combo {VOL_DN\|VOL_UP starts timer → setup-ready on pop, VOL_UP+VOL_DN timer popped}; '%s press/release count = %zu'; '%s ignored in notify mode'; 'Disallowed action (%d - %s) because (%d - %s)'; 'inline action'; allowPlaybackRequests; 'collecting triggered diags'; 'enter %s household mode'; 'cancel join household mode'; PLAYPAUSE; '%s button pressed (cid)'; 'Play button held'; orientation {old->new,orientation_change,syslib orient}; led_diags {'Diag mode:%u, leftMS:%u; timeMS:%u; next mode: %u','set diag mode:%d'}; setup {'join hh','enabling wifi and %s','signaling netstartd (%s) %s',openap} |
| `ibt_plans` | **partial** | a remote-management command executor: commands named in log domain 'ibt' are compiled into 'plans' (a generated target list — 'failed to generate target list for command (%s)'), then dispatched per-target with per-target results ('\[dispatch\] dispatched (%s) to target (%s), result \[%s\]'); gated by the enablePitchfork feature flag checked at init |
| `iocompress` | **partial** | RCompressBuffer {deflateInit2,deflate,deflateEnd failed} + RDecompressBuffer {inflateInit2,inflate,inflateEnd failed} |
| `ir_decoder` | **partial** | irdecoder.cxx: selthrd.RIRDecoder.{reset,data,except,timeout}; debouncer FSM (recent/bIsRepeat, playing/not-playing -> auto play); actions vol_up,vol_down,IR Mute,IR Input + testpoint press; decode via histogram peak detection (avgA/avgB/threshold) then pulse-width OR pulse-distance OR biphase; "Short Code not recognized"/"unrecognized %d"; read "ir: %d length: %d","IR Event read: %zd, msgcount: %u" |
| `ir_learn` | **partial** | htaudio.cxx IR subsystem: code lists vol_up_codes/vol_down_codes/vol_mute_codes/input_codes (bounded); learn FSM passes{1,3} redundancy checks "first and third passes have different sizes"/"don't match"; repeat styles {alternating,repeating,non-repeating}; one-button learn with timeout (UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND); config /opt/ir/irconfig.txt; cloud database http://ir.ws.sonos.com/IRCode/ — submit <IRCode><code><value><guid> XML (guid from //dev//urandom), query "Requesting: %s" -> "Code found for remote id \[%s\]"; embedded remote-name table {Sharp,LG/Haier L32D1120,Samsung,Panasonic,Toshiba,Mitsubishi,Philips,Pioneer,Dynex,RCA 46LA45RQ,Orion SLED3280,Mitsubishi WD-65638/60738,JVC JLC42BC3000/LT-19E610,Seiki LC-32B56,SuperSonic SC-240/491,ViewSonic VT4210LED/VT3205LED,Loewe}; "Denylisted pyle!"; "Outstanding codes yet to be learned: Lengths are: %d, %d, %d" |
| `lechmere_wss` | **partial** | lechmere.cxx cloud channel: RFC6455 WSS to lechmere.<env>.ws.sonos.com, negotiated subprotocol 'lechmere.<version>' (lechmere-v1 observed), inner TLV header layer ('failed to read lechmere header'), policy-key auth, app-level ping keepalive with 'TOO_MANY_UNACKED_PINGS' disconnect, and a full close-reason taxonomy driving reconnect decisions |
| `led_engine` | **partial** | Scripted LED animation engine: <LedPatternInfo> docs hold <LedPatternEntry time led_ids repeats steps> programs of <LedStepEntry rgb hold fade> steps, serialized with cksum+flags; R_LED_* codes select the default pattern; SetLEDState toggles the user-visible on/off only |
| `lla` | **partial** | errors {WOULD_BLOCK,UNDERFLOW_OVERFLOW,NO_CSB,INVALID_DATA,SUSPENDED}; devices {lla_hdmi out, lla_in_%s in}; out: "Setting tx latency %u", combined time+output delay, play-time-in-past reject, "time requested %d.%06d current time ... devPlayTime/devCurrentTime", "callback failed, playing zeros", underflow-count cache; in: descriptor "id:%d fd:%d min:%u max:%u dflt:%u bufs:%u channels:%u frame:%u jitter:%zu", rx time in ticks, nonblocking pipe, buffer copy maxbytes bound; fds lla-select/lla.in.poll |
| `load_content` | **partial** | verbs {loadContainer,loadStream,loadFavorite,loadPlaylist,loadTrackList} with guidance "Use playback#loadTrackList to load tracks"/"Use playback#loadStream to load streams"; item types {spotify.connect,linein.homeTheater.spdif,linein.airplay,trackList.program,episode.podcast,chapter.audiobook,homeTheater-input,TV Audio}; meta json paths {/containerType,/containerName,/name,/explicit,/durationMs,/artist,/imageUrl,/releaseDate,/mimetype}; errors {Invalid favorites directory state,Invalid content resolver state,Account error,Invalid serviceId,Could not find default account for serviceId,SID mismatch lookupAccountByUDN vs RMuseUniversalMusicObjectId,Could not find UDN,serviceId is not associated with accountId}; "cannot enqueue item; %s queue is full (%zu items added, %zu items enqueued)" + "item.id tracking is out of memory"; local-library + r:contentService + /getaa? art; sn_%u/mhhid_ id prefixes; "RadioShow name/Id truncated"; shared\|private visibility; protocolInfo http-get:*:%s:* |
| `log_domain_map` | **partial** | 21 anacapa.*.log sinks under /opt/log define the module boundaries; plus sibling-daemon logs and the /tmp/memorylog ring |
| `longpress` | **partial** | GC list {head,tail,current} of cloneable group coordinators; "cycling to %s:%s"/"end of list reached"; tracked GC actions {Adding new GC,Moving GC to head,Removing GC,"Updating last PAUSED/STOPPED GC","Last GC in HH to change playback state is no longer cloneable",Untracked GC action}; "not joinable" |
| `media_player_abstraction` | **partial** | source plug-in layer under AVTransport: media_player_mgr + media_player_autoplay + media_player_vli_ctrl + extaudiosrc + ai_impl_base define the source vtable; autoplay system (StartAutoplay, AutoplayRoomUUID, AutoplayVolume, linked-zones expansion, silence thresholds, alarm/buzzer fallback) routes line-in/TV/Spotify-VLI sources to the coordinator; htaudio_autoplay.cxx handles TV autoplay; ChirpExtAudioSrc plugs acoustic input in as an ext source |
| `media_player_mgr` | **partial** | actor model: target key {uuid,ix,port,ssl,mtls} (overlap check); "found actor for %s"/"found backup for %s"/"%s target \[%s\] for type %d resolved to %s"/"no actor available"; lifecycle register/create/shutdown; per-player config dir + anacapa_logger.toml; /localsettings.txt; Player%s naming |
| `memory_monitor` | **partial** | reads /proc/meminfo {MemAvailable,MemFree} + /proc/%s/{statm,cmdline}; logs to /tmp/memorylog/log.%d with .old rotation; "memory report avail=%s free=%s"; "report skipped %s (count: %u)"; fields {memavailable,memfree}; threads memlog/memmon/memory_status |
| `mntmgr` | **partial** | mount points /tmp/smb/%d_%d + trial /tmp/smb/tmp%d_%u; "already mounted unc=%s share=%s loc=%s"; "too many shares mounted"; trial mount "Trial mount found unsupported protocol: %s (strike %d/%d)" + "flagging %s as failed"; "not http mounting %s as %s" |
| `model_sku_vocabulary` | **partial** | 51 ZPSnn model identifiers enumerated in the capability-conditional table: ZPS{1,3,5,6,9,11-24,26-46,48,49,51-59,61}; capability gating is per-model-ID |
| `mp3_decoder` | **partial** | normalization {id3,lame}; "WMA radio not supported on this platform"; resync bound "20 resync required: corrupt file"; frame errors {illegal sample rate,read frame header/sync/data overflow/data failed}; xing {"No size in xing header","xing we can't load",VBR dur "%zukb/%ukbps = %llds",CBR dur,"Assume that VBR file without a ToC has constant bitrate of %d"}; ID3v2 skip; "Found valid header after searching %zu bytes"; seekSeconds duration bound |
| `mp_autoplay` | **partial** | params {vol,useVol,includeZones} + "airplay include zones: %d" + AirplayIncludeGroupedEvt; linein types {object.item.audioItem.linein.{homeTheater,airplay,bluetooth}} + x-sonos-vli; target resolution {"lonely local line-in autoplay","no autoplay target","couldn't determine coordinator/AVT control URI/control URI","Not executing on invisible/node proto incompatible ZP"}; "for controlURI \[%s\] for coordinator \[%s\]. programURI \[%s\]"; "Autoplay command failed ret=%d"; "AutoStop called on unhandled URI"; http://%s:%u |
| `mpegts_id3` | **partial** | TS parse: PAT/PMT PIDs, sectlen/desclen/silen, stype (Unsupported stream type), eslen, "No audio PID"/"Audio PID is 0x%x", "non-audio and non-timed_id3 PID", PTS, peslen/payload; timed-ID3v2 extraction: tag footer detect, "Ignoring too large timed ID3 size", OOB guards, "unsupported mp3 segment" |
| `mpmgr` | **partial** | actor key {uuid,ix,port,ssl,mtls} + "already exists or has overlapping values"; resolve {getActor,Actor Filter null,unexpected target ID type,found actor,found backup,target resolved,no actor available}; lifecycle {registered \[%zu\],created \[%zu\],Invalid target key abort,Request to shutdown,shutdown}; per-MP config Player%s + anacapa_logger.toml + /localsettings.txt; VLI hooks {onVirtualLineInGetVolume,SessionStartInfoUpdated,StartSession,StopSession,SuspendSession,NameChanged,MetaDataChanged,PlayModesChanged,onPlaybackStateChanged,processSetVolume,waitOnTxBitFlagsClearedLocked}; events {VolumeSetActionEvent(vol,mute),VliVolumeProcessingCompleteEvent(type,success,flags)+signal rc,VliSessionProcessingCompleteEvent(type,action,success,flags),"vliType old: %s new %s cookie %d"} |
| `multi_daemon_boundary` | **partial** | anacapad coordinates ~13 sibling daemons over /X-external HTTP routes + /tmp/netstartd.ipc: netstartd gets netsettings/PSK pushes and satellite notifications, reports connection-type updates back; per-daemon crash machinery (.dmp/.properties/_backtrace/count files) and /opt/log sinks \| netstartd client side (ipc_msg.cxx region): connect.sendMessageLocked hello handshake; performReset-triggered reconnect; deferral "Deferring IPC reconnect"; timeout "attempting reconnect (retries=%u)"; "Bad IPC message received (%d %d %d)"; transport threads selthrd.RIPCHandler.{reset,data,except,timeout}; control msgs "Disabling/Enabling networking","Signaling start/end of network connectivity test" |
| `muse_semantics` | **partial** | the muse API is the real product surface: 525 route strings, organized as households(282)/players(176)/groups(46)/playbackSessions(12)/users/devices/services namespaces; every SOAP service is mirrored as an upnp* proxy namespace; native resources cover settings, playback, hardwareStatus, positioning, homeTheater, pinewood, zones, authorization, timers, virtualLineIn, playerVolume, trueroom, trueplay, playlists, musicServiceAccounts, voice, systemReporting, localContentLibrary, networkTest, alarms, diagnostics, groupVolume |
| `music_services` | **partial** | musicservices.xml + backstop file; state vars {ZPMusicServicesList,ServiceListVersion,AvailableServiceDescriptorList,AvailableServiceTypeList,AvailableServiceListVersion}; settings {OnlineUpdateBaseURL,R_TrialZPSerial,R_AvailableSvcTrials}; replication locks {rwlR_msd,rwlW_msd} + msdZonePlayer; accept logic "deciding whether to accept replicated list from: %s; ver: %u format: %u"/"replicating services from %s"/"Replicated list accepted"; zp-vs-rs compare {zpETag,rsETag,zpLUD,rsLUD,zpVer,rsVer}; "ServiceTypeList, adding built-in: %s"/"adding: %s; name: %s"; "Warning. No SD found for %d"; poll "next check for available services in %u s \[source=%s\]"; "Could not submit Available Services DIAG. Service count is: %zu"; checkForAvailableMusicServices job; "Not enough space to write full list" |
| `netif_monitor` | **partial** | netlink {RTM_NEWLINK,RTM_GETLINK}; errors {read error,incorrect type,unexpected message %X}; selthrd.RIfAddressMonitor.{reset,data,except,timeout} |
| `netstart_events` | **partial** | events {netstartd hello,Setup start,Setup stop,Netstart is idle,Netstart alive,Netstart open,In setup mode,Netstart SSID set/clear,Netstart triggered upgrade (0x%x),Got connection type update \[%s\]}; WAC {/var/run/wac_mode,Unknown WAC mode %d,WAC mode disabled/enabled/timeout}; ForceShutdownOnNewSSID %d; shutdown {"Deferring shutdown, reason \[%d\]","deferring newHHID event","ignoring network bounce mid-shutdown",zpShutdown,/tmp/netstartd.pid}; IP-change {re-binding old->new,clearing link-local subscriptions on 169.254.* change,shutting down for new IP,newAddr event with same addr}; conn types {SonosNet (Ethernet),Home Theater 2.0,Home Theater (Ethernet),Home Theater,Ethernet (WiFi Disabled),Ethernet,SonosNet (wireless)}; events {newHHID,newSSID}; "%s: %s event resetting connection to mDNS" |
| `noderx` | **partial** | indices {ob=outputBuf,lr=lastRead,lcg=lastConsecutiveGood,lrx=lastRx}; flight rec " %u r:%d.%06d s:%c p:%d.%06d"; startup {"Starting up; id:%u, delayPkts:%u, delayFrms:%u","Startup large packet gap:%u, don't NACK",bFinalStartPacket,allowing NACK resend of LCG,ignoring discontig NACK resend,ignoring partial frames}; NACK "out of order packet; send nack immediately" + "NACKed for %u IDs, %u packets, ob/lr/lcg/lrx"; pause/resume {thread pausing/resuming, state validation p/sp/pr/ip}; frame layer {wFirstFrameOffset,wBytesOfDataLeftToRead,pwLen,Playtime} + errors {expected frame not found,frame length conflict,Packet stream framing error,frame too large,bufferNextProtocolFrame WOULDBLOCK/E_WOULDBLOCK,readNextDataBlock timeout,forcing decoder reset}; skipAhead entries {immed,shifted,released blocks,too many}; resync {"resynchronization flushing packets %u-%u",resynchronization message}; "Ignore packet with incorrect protocol version"; "Received dup packet id with different class"/oob/mismatch replace; "RX buffer full"/"RX discontig"; threads {noderx-data,noderx-pause,noderx.rxd.usleep,noderx.loc.usleep}; "failing noderx for io error (c=%u t=%lld)" |
| `play_history` | **partial** | historymgr.cxx play-history pipeline: TrackPlayRecorder/TrackPlayMonitor capture plays, entries buffered and POSTed to the household history API with completeness gating + buffer-full drops; getHistory is ETag-cached; deleteHistory/removeHistoryItem/clearHistory ops; ratings via playbackMetadata/ratings — explicitly 'only implemented for cloud queue' |
| `player_settings` | **partial** | keys {volumeMode,monoMode,wifiDisable,meshDisable,wifiPowerSave,batteryUsagePolicy,bluetoothPolicy,networkingMode,lineIn,eq(treble/bass/loudness),gainTrimDB,zone attributes}; gates {"Device does not support fixed output","Satellites not supported; configure primary device","monoMode (not supported in setup)",wifiDisable {reason unknown,netstart refused,no Ethernet carrier},meshDisable (netstart refused),"EQ cannot be adjusted in PASS_THROUGH volume mode"}; error fmt "Unable to set setting(s): X (unsupported)"; settingsv2; gmSat/ukwnt/unhandled handlers |
| `playlist_parsers` | **partial** | iterate{ASX,M3U,WLP,PLS}PlayList; ASX <ref href= + entryref; linkUrl= extraction ("found linkUrl"); Post-stream readData dump {bytesLeft,len,buf} |
| `psk_hierarchy` | **partial** | PSKs {HhPsk (DTLS HH),ControlPsk,RoomEncPsk (room-name encrypt),LanSwapPsk} each +Backup mirror id; rotation {"Unable to generate new HH/control/room name encrypt/lan swap PSK","Unable to update settings with new PSKs","PSK rotation successful (HH: %s, Control: %s, RoomEnc: %s, LanSwap: %s)","Bumping netsettings version","not rotated"}; encoding {"Encoding SonosNet key failed","Encoding DTLS HH PSK failed"}; "Pending netsettings.json update discarded after replicating"; "Settings Replication changed SN Disable from %d to %d (source: %s)"; SSID protection {"SSID missing from known networks list","Registering for next topology update to protect SSID","Current SSID protected/already protected/not protected, could not get current SSID/missing from networks list","Not connected to a WiFi network, skipping SSID protection"}; "Received netsettings update from netstartd"/"netsettings changed"; app/run/nettestresult.txt |
| `qplay` | **partial** | QPlay:2 X_QPlay_SoftwareCapability xmlns:qq=tencent.com in device description; #QPLAY_SUPPORT# placeholder; action QPlayAuth; updateSharedTQPlayMode; no seed/code exchange or control channel found — stub-grade support |
| `qplay_protocol` | **partial** | Tencent QPlay support: /QPlay/Control SOAP endpoint (no matching /QPlay/Event route — the only service missing its event pair), a QPlayAuth action taking Seed/Code/MID/DID arguments (seed→code auth handshake: controller sends Seed, device answers with a Code computed from MID machine-id and DID device-id), a shared-T QPlay mode with context restrictions ('Calling updateSharedTQPlayMode in bad context!'), compile flag #QPLAY_SUPPORT#, and the device-description capability <qq:X_QPlay_SoftwareCapability>QPlay:2</qq:X_QPlay_SoftwareCapability> |
| `queue_persistence` | **partial** | .rsq on-disk queue format: savedqueues.rsq is a <SavedQueues LastUpdateDevice Version Next> XML doc of <SavedQueue Id Curated NumTracks> elements each holding <Track URI= MD=> entries; live queue persists as trackqueue.rsq; atomic write via .tmp rename + .d.rsq backup; validated at boot and on replication receipt |
| `runtime_flag_files` | **partial** | runtime state is driven by sentinel files: /tmp flags (device_unlocked_flag, brokendevice, wifidisabled, htdocs_locked, crashed_play_state, anacapa-has-run, fresh_hh.txt, anacapa_prevent_crashdump_upload, sonosConcurrencyUnrecoverableError), /var/run mode files (wac_mode, netstart_mode, netmanager_extender_flags, systemtimeoffset), /tmp/memorylog 4-file ring + .old copy, /tmp/smb/ mount workspace, /tmp/backtrace + diagstdout/diagstdin diag scratch, /tmp/event_preserve + event_reporter_v3 buffers |
| `runtime_policy` | **partial** | fields {"Business subscriber","Cloud Schedule","Effective P2P policy is encrypted","Guest Access Enabled","Unathenticated Control Enabled"(sic),"Insecure UPnP Allowed","Auth Pin Set","Thor Timeout"}; reeval on {"isBusinessSubscriber has changed","Line In policy has changed","Business Cloud Schedule has changed"}; settings keys {global,usageContext,BUSINESS,scheduledChangeValue,enableContentAccess,allowDirectControl,allowLineIn,allowAirplay}; "Failed to fetch latest entitlements \[ec=%s\]" |
| `scrobbler` | **partial** | Audioscrobbler/Last.fm submission client implementing protocol 1.2 over raw sockets: GET handshake to post.audioscrobbler.com, form-encoded scrobble POSTs, BADTIME Date-header recovery, OK-response check; also embeds ws.audioscrobbler.com/2.0 for the newer API |
| `semisleep_power` | **partial** | low-power 'SemiSleep' suspend/resume: gated by featureConfigSemiSleep/enableSemiSleep + semiSleepConfig cloud config; 'Supported only on suspendable devices' capability check; suspends VLI sessions (onVirtualLineInSuspendSession, AHA_SUSPEND_VLI_SESSION, SUSPEND_SESSION op), playback sessions (muse playbackSession/suspend verb), cloud queue (during snooze/alarm), and local timers track suspend ('considering suspend'); group topology marks suspended members ('Found Suspended Rooms While Processing %s Group Info') \| Local timers (timers_impl.cxx / MuseTimerImpl): ops set/set-duration/set-relative-duration/create/delete/pause-delete/pause/resume each log "...(considering suspend) %s" on failure - suspend gates every timer mutation; timers persist across suspend in SQLite table timers(id TEXT PK, trigger_time TEXT, total_duration INTEGER, triggered NUMERIC) @0x10edcf88; "Unable to remove time on a ringing timer" guards firing timers. \| Pause persistence: paused_timers(id PK, remaining_seconds, paused_utc_time, total_duration) @0x10edd018 — parked timers survive suspend; resume recomputes. |
| `settings_replication` | **partial** | the household replication bus: per-setting transfers ('replicateOne from %s to %s setting %u version %u') with a version+format negotiation ('deciding whether to accept replicated list from: %s; ver: %u format: %u'); per-setting denylisting on badFormat/badEncoding; a separate player-level quarantine subsystem enforcing admission policy (HTTPS required, known user, secure reg required) with scheduled rechecks; suppressed while unregistered |
| `share_indexer` | **partial** | walk {open share path,read folder,entry %s,stat file} skips {.sparsebundle}; cancels {interrupted,recursion limit on share/at //%s,file error,share error}; files {Unplayable,Inaccessible}; shadow/shadow2 dirs + Remote/Local I/O error during %s; index %s/trackinfo + trackinfo.tmp + sorts sort-* + shareindex + "took %ldms to initialize indexes"; BBF fields {bbfTitle,bbfFile,bbfTracknum}; URIs {x-file-cifs://,x-rincon-playlist:}; res {x-rincon-playlist:*:*:*}; /getaa?u=%s&v=%u; r:displayTitle; sort orders {ITUNES,DEFAULT,PINYIN} + albumArtist/genre; itunes plist dedup "Skipping itplist with duplicate size and mtime"/"More than %d itplists"; .version fmt %s,%u; events {CdNotifyUpdateId,CdNotifyShareIx}; indexingTrack job |
| `sharelist` | **partial** | replication via %s/indexrepl + proposeUpdatedShareList + "remoteSettingIsBetter: us \[%s\|%u\] vs them \[%s\|%u\]"; ops {localAddShare,localRemoveShare,localRequestReindex,localRequestResort,localRemoveUnsupportedShares}; protocol gate {verified supported protocol→keep,else remove + count} + VerifiedValidProtocol flag; errors {share ID not found,path already exists,subsumed by existing share,Path is malformed,Access denied,Cannot exceed maximum shares,Mounting failed,Local index storage error,Remote file share error,Indexing canceled,connection failure,replication failed,replication skipped fmt mismatch}; reindex "request reindex (ad:%d sf:%d fr:%d si:%d st:%d lc:%s)" + "Turning resort request into full reindex" + "processing index complete (c:%d i:%d f:%d lc:%s)" + commit {m_bCommitted,m_bWait,m_bTerminate} + index recovery "recovered ix=%d with ver=%d"; R_BrowseByFolderSort + Tracknum sort |
| `shoutcast` | **partial** | headers {icy-name,location,CONTENT-TYPE,server,StreamTitle}; status accept {ICY 200,HTTP/1.0 200,HTTP/1.1 200,HTTP/1.0 30x,HTTP/1.1 30x} + redirect follow; Cougar server id; "Redirect audio/x-mpegurl to %s"; "request buffer is too small"; "add header \[%s : %s\]"; metadata text="…" |
| `signal_source` | **partial** | errors "invalid playId"/"failed to stop signal"/"incorrect playId"/"nothing is currently playing"/"couldn't create an audio stream"/"only one signal can run at any given time"/"invalid channel"/"disallowed by policy"; channelNumber param |
| `sntp_server` | **partial** | Dual-mode SNTP stack (sntp.cxx client + sntpsrv.cxx server + sntppoll.cxx poller): players sync from *.sonostime.pool.ntp.org or the group coordinator, one player hosts an SNTP server for the household ('Starting SNTP server switch'), and SNTP validity gates synchronized playback scheduling |
| `sound_device` | **partial** | syslib events {open,get_fd,poll,read,close} errors; LLA checks {DAC count,sample width inconsistency}; system/src_disable + StdQ ASRC Coeffs + "Running with SRC bypassed"; orientation sensing; "reset vcxo"; health flags {AMP_CURRENT_WARN,AMP_FAULT_WARN,AUDIO_WARN_TEMP,CPU_WARN_TEMP,CPU2_WARN_TEMP,SOC_WARN_TEMP,AMP_CURRENT_FAULT,AMP_FAULT,AUDIO_FAULT_TEMP,CPU_FAULT_TEMP,CPU2_FAULT_TEMP,SOC_FAULT_TEMP,PS36_FAULT,UV36_FAULT,UV14_FAULT,POWER_WARN_TEMP,POWER_FAULT_TEMP,MOTION_FAULT_TEMP,MOTION_WARN_TEMP}_STATUS |
| `sound_swap` | **partial** | sound_swap/audio_swap; queue audioSwapEventQueue + progress audioSwapProgress; behaviors SWAP_BEHAVIOR_{DO_NOTHING,PUSH_SWAP,PULL_SWAP,UNDEFINED}; push/pull disband target\|initiator group; HTSatelliteChecker gates (isFound,isHTSat,playerUDN,HTPrimaryUDN + topology/group-props/GC-AVT lookups); FSM "New state: %i"/"Event %i not handled in state %i"/transition-failure -> reset; result fields {swapResult,swapType,swapTarget,swapGC,initAction,candCount,respCount}; gates {bonded zone,HT Satellite,unknown state,unswappable audio,already in progress}; muse calls museCmdSetGroupMembers/museCmdModifyGroupMembers via groups/%s/groups/modifyGroupMembers |
| `spdif_detect` | **partial** | detected {Dolby Digital,Dolby Digital Surround,Dolby Digital Plus,Dolby Atmos (DD+),Dolby TrueHD,Dolby Atmos (TrueHD),Dolby MAT,Dolby Atmos (MAT),DTS (Type1),DTS (Type2),DTS (Type3),NULL Burst,Pause Burst}; unsupported taxonomy {AC-3,SMPTE 338M v1-v5,MPEG1 Layer 1/2/3,MPEG2,MPEG2-AAC,MPEG2 Layer 1-3 LSF,DTS1-4,ATRAC,ATRAC 2/3,ATRAC X,WMA Professional,MPEG2 AAC LSF,MPEG4 AAC,Enhanced AC-3,MAT,MPEG4 ALS,Reserved 2-4,Extended Data,MPEG4 AAC LC in LATM/LOAS,MPEG4 HE AAC in LATM/LOAS,DRA,Unsupported} |
| `spotify_esdk` | **partial** | embedded Spotify eSDK (libspotify-derivative) plus a Connect layer: local /spotifyzc endpoint answers Spotify zeroconf getInfo (only the group coordinator answers — 'Non-GC returning 404 from getInfo'), account transfer arrives as an encrypted zeroconf blob ('Decrypting ZeroConf blob failed'), and the player registers on Spotify's hwptp hermes channel (hm://hwptp/v1/devices, hm://hwptp/v2/resolve/%s/%d/%s) to receive Connect commands ('Got unknown command from HWPTP: %s') |
| `stream_fetcher` | **partial** | notifyFrame ty:%d ln:%zu so:%zu ns:%zu f:%u ctx:%u:%u:%llu; getContentKey (encrypted HLS); "New bitrate: %d, Old bitrate: %d" adaptive switch; playlist FSM {"Timed out looking for playlist","Playlist failure with no time to recover (%ld buffer)","fetch empty","Too many empty playlists and no audio left"/"(still %ldms ahead)","Switching source due to empty playlists","end of static list","Unable to select another DS"/"waiting to fetch new playlist"}; "Startup ahead: %ld"; "URIs for %g seconds, wake up in %d"; "prebuffering %u bytes within %ld msec"; open fmt "open: %s (0x%x) %d len %llu offset %llu"; "stopping decoding while sleeping" |
| `svc_manifest` | **partial** | svcmanifests.json {"manifests":\[…\]} + RCache + lastUpdateDevice; schema check "Unsupported schema version: actual: %u.%u, supported: %u.%u" + "Could not extract API header"; ops {deleteManifest(%u) b=%d,a=%d,removeManifest vb/va}; "%s downloading music service manifest from %s"; "replicating manifest file from %s"; "unsupported CQ REST version: %s"; "Added trailing slash"; svcmanifests thread |
| `telemetry` | **partial** | PlayerButtons + TelemetryBasePlayer + TelemetryCategoryContext + telemetry tag; fields {event_id,event_name,event_schema_version,household_id,model_type,muse_household_id,serial_number,sonos_id,sw_build_type,sw_full_version,timestamp_utc,audio_type}; "PlayerButtons missing required field %s" |
| `telemetry_submission` | **partial** | telemetry/diagnostics uplink: 'Telemetry 1.0 Event field' format, X-Sonos-MessageType: product-data-telemetry header, zonereportmgr.cxx zone reports, submitDiagnostics/submitQueuedDiagnostic pipeline with manifest submission, positioning telemetry level route, per-feature telemetry flags |
| `testenv_environment` | **partial** | POST /testenv switches the player's cloud environment between PROD, PERF, STAGE, TEST and INT, with an optional OnlineUpdateBaseURL override; the page displays the six resolved API bases (Cloud, Service catalog, System, Transfero, Metrics, Update) and CustomerId; the change replicates household-wide ('may take up to 120 seconds ... to replicate throughout household') and logs 'Setting cloud env to %s' |
| `thermal` | **partial** | syslib thermal {open,get_temp,close} + "cpu:%d, amp:%d, soc:%d" + temperature_volume + ampstate + hardware fields; "Hardware %s; clamping volume to %d%%"; state transitions {Entering/Leaving hardware warning state,Entering/Leaving hardware fault state} + hw:st + "Warning/Fault Code(s):%s" + fullSync; satsw "Error %d from uploadSatSwitchTimeReport" + satSwitch; lmrep "Error %d from WifiFuncsGetLmChangeStats" + {lmChannel,lmNeighbor,roamEvent,beaconLostEvent} |
| `tj_wakeup` | **partial** | async wakeMissingPlayers {task,timer,request,retry TJ,cancel,failure} + "Unexpected WakeOnLANRequestEvent type" — WakeOnLAN; "Restoring AVT and track queue"/"Backing up track queue"/"Backing up AVT"; "Chirp setup failed - chirp sender does not exist"; "Setup volume not yet calibrated"; "Unable to play chirp"; refreshMdnsRegistration; /players/ api 1.1.0; settings {R_VolNormMode,R_CrossfadeDuration,R_AirplayIncludeLinked}; manual node engine ctor node version; spotmdns thread |
| `token_refresh` | **partial** | threads {cqatrs_tx,cloudqueue_tr}; log "\[%s HTTP %d from %s%s\] %s"; states {"using token from file","requesting new token refresh sync","requesting token refresh sync %u %d -> %d","need to wait for token refresh","waiting for token refresh completion","waiting for refresh tx complete; current state %d","Attempting to refresh token (hrs=%d te=%d)","transition token refresh action %u %d -> %d","Token refresh succeeded. Beginning retry."}; errors {"last refresh token for load timed out","no last refresh token time","expected entry not found to complete tx","expected entry not found waiting for tx","Refresh token failed with upnp result: %d","Refresh token failed. Could not find SD, sid=%u","unexpected token action %d"}; keyed by acct. sn. %u |
| `track_play_monitor` | **partial** | per-track log entries {Track Or Station URI,Extra Md,Context URI,CQ Auth Token,SMAPI Device Id,CloudQueueVersion,CQ Context Version,CQ Playback Id,API Key,Framer Name}; play line "%s play time %fs @%d.%06d (pkt:%u,act:0x%x,off:%lld%s,err:%u,uri:%s)"; segments "seg start @ %d.%06d (packetId: %u), end ..."; PlaybackId remap; string-pool bounded (pool %d%% full, "Resetting due to no free RTrackLogEntries"); states In progress/Final/LSE; selthrd.RTrackPlayMonitor thread |
| `trueplay` | **partial** | config modes {button-notify,room_calibration-calibrate,speaker-detect,trueroom} + "configMode CountDown:%d"; eTag manifest /etags.txt matched against tone files {leader.ogg,testtone.ogg,complete_ht.ogg,inverter_*} at path %s/%s/%s/%s-%s under tones; fetch via players/%s/settings/player muse settings + forward; "eTag is matching a known file"; types {plug-in spectral,polarity}; params {tone_duration,force,v:%s t:%s}; "Sonar cal volume - using clipped volume %d instead of requested %d"; TP update "found TP version ... do update to v%s"; teardown {"Clearing Trueroom tone folder on JFFS","Error removing Trueplay asset dir"}; restore paths {common RC,original RC,TV Surround Level,enable sonar,set AVT,reset AVT,re-enable Trueplay}; "Trueroom config mode - Not restoring/restoring the AVT"; fields {HTBondedZoneCommitState,AvailableRoomCalibration,RoomCalibrationState,Orientation,LastChangedPlayState,AlexaCBLSupported,SupportsAudioIn,SupportsAudioClip,HtBondedZoneCommitUpdateEvt}; cm_button "pressed %s" |
| `trueplay_tuning` | **partial** | Trueplay room tuning stack: muse routes for discovery/presence/config/status (+setSelfTruePlay, resetDetectedSpeaker), x-rincon-sonarcal: OGG test-tone URIs played through the streamer (leader/testtone/complete_ht), versioned Trueplay SDK with compat fallback, etag-synced spectral/spatial tuning assets, per-driver RoomCalDelay params, satellite propagation via SetRoomCalibrationStatus, SelfTrueplay variant |
| `unlock` | **partial** | flags {/tmp/device_unlocked_flag,/tmp/htdocs_locked,/opt/htdocs_locked}; flow {Fuse Value:,Challenge:} + form "Serial: %s / %s %s / POST {confirm textarea 11x80}"; responses {"DevUnlock Rebooting...",Success,Too Many Unlocks,Not Applicable}; muse op deviceUnlock; rate-limit "Too Many Unlocks" |
| `update_machinery` | **partial** | manifest-driven update pipeline: update_manifest carries a base update URL + per-device target rows (udn, model, submodel, swgen, ver, URI, updateID) and a min auto-update version; user updates run manifest-download -> checkDevicesToUpdate -> launchUpdate; auto-update policy gated by R_AutoUpdatePolicy + R_CheckUpdateInterval + R_AutoUpdateWindowStart + autoUpdatesEnabled |
| `usage_metrics` | **partial** | <UsageMetrics><ver>2</ver> + <ucs>/<uc> records {ms_cdctrluri,ms_regctrluri,ms_croot,ms_fn} posted to submit.aspx under /HRMetrics/; cfg fetches {pollInterval.htm,wifiTxRateThreshold.htm,wifiLatencyThreshold.htm}?hhid=%s; wifi counters {ath%u,rxPrr,beacon_flags,datarx,secdrp,roaming,trf2g,trf5g,trg2g,trg5g,tbtm2g,tbtm5g,rfail,q*_nbf,q*_cmp,q*_bpk,q*_ltc,hwstat,rxbhs,rxhang,rxfMax,rxcMax,txfMax,bprowar,gtkfm,gtkfc,nogcfc,links}; per-AP "MAC/rssiF/rssiT/PktMin/PER" + "BSSID/perAP/rssiAP"; "Audio-drop ... include with future periodic submission" + rate-limit; WD daily write; CPUTempHist <temperatures>; unlocked/hw_warn/hw_fault flags; usageDataSharing optin |
| `user_update` | **partial** | flow {"Running user-initiated HH update",no updates available,manifest download failed,no devices need updating,checkDevicesToUpdate failed,launchUpdate failed}; reports upgrade_mgr_user_report.json + _prev.json + /tmp/upgrade_mgr_info.txt; "report has more devices than the maximum ... omitted from the householdUpdateStatus event"; "Unknown upgrade client state"; "report consumed"/"Timed out polling"; app/run |
| `vli_ctrl` | **partial** | types {AirPlay,bluetooth/Bluetooth,tvproxy/TV Proxy} + "StartSession for unusable/unknown type"; scoped scopeVliCtrl/VliCtrlIx; protocolInfo x-sonos-vli:*:audio:*; cookie+fromSender tracking "%s:%d vliType %s cookie: %d"; "waiting for tx flags failed"/"completion signal timed out %#x %#x" + "timed out!!!!!!!"; "VLIGroupIDs cannot contain commas" |
| `wac_mode` | **partial** | WiFi Accessory Config (WAC) setup mode: state lives in /var/run/wac_mode (parsed int, 'Unknown WAC mode %d') with enabled/disabled/timeout transitions; driven by netstartd via /tmp/netstartd.ipc ('WAC mode enabled/disabled/timeout', 'In setup mode', 'Netstart SSID set/clear'); LED goes to R_LED_WAC mode \| netstartd IPC drives WAC: dispatcher f_10691034 msg ids 35/36=WAC disabled/enabled, 37/39/41=WAC timeout cluster; ids 42/46/47=setup-mode enter/setup start/stop. |
| `wmp_provider` | **partial** | WMP NSS /WMPNSSv browse/search; caps {SCPA,SCPB,SCPI}; search grammar 'upnp:class derivedfrom "object.item.audioItem" and @refID exists false' + container class specs {person.musicArtist,album.musicAlbum,genre.musicGenre,playlistContainer}; sort/filter "+upnp:album,+upnp:originalTrackNumber,+dc:title" + microsoft:{artistAlbumArtist,artistPerformer,authorComposer} + upnp:genre + "1+upnp:originalTrackNumber"; field set dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber; rincon md ns urn:schemas-rinconnetworks-com:metadata-1-0/\|otherArtist; albumArt via %s?albumArt=true and /getaa?m=1&u=%s; "URI already has a serial number"/"not enough room for account ID" |
| `ws_client` | **partial** | client handshake {Location,Upgrade: websocket,Connection: Upgrade,Sec-WebSocket-Accept,Sec-WebSocket-Extensions}; "failing connection due to unsolicited per msg deflate"; per-msg deflate only before open; openSession retry; nonce gen/encode; {"disconnectedReason":"%s"}; close codes on close frame; LoadBalancerHost/WebsocketServerHost; reasons {NEW_IP,BLUETOOTH,POWERED_OFF,UPGRADE,NEW_SSID,SLEEPING,RECONNECT}; threads wsc_mtx/wsc_smtx/wsc_cond |
| `zones_mgr` | **partial** | events {ZoneMemberSettingsChangedEvt,ZonesDefinitionsChangedEvent}; muse ops {museGetZoneDefinition "found zone \[%s\]"}; transitions {"zone transition on secondary/primary: zoneId %s","zone transition failed on primary"}; cms (channel-map-set) {"cms init from %s","cms update from pri: %s","cms update from sec: %s = %s + %s","zoneDef %s inconsistent with cms %s","can't construct channelMapSet"}; file <File name="activeZones">; ops {adding/removing player,joinZone id+flatChannelMapSet,unjoinZone,activateZone,deactivateZone,updateActiveZone,sendUpdateZoneMemberSettingsCmd}; guards {"primary change not supported for HT","update with offline primary not supported for HT","update only allows add or remove, not both","can't update both name and channelMapSet","Zone contains incompatible protocol versions","zone is not active","zone id not found","zone def not found","invalid activeZone","invalid channelMapSet","invalid flatChannelMap","invalid zone name","invalid name:","no name","secondary not reachable","more zones active than RMuseActiveZoneList can hold"}; "Legacy zone exists on %s"; "primary unavailable: sending Remove ops to secondaries"; "re-activate the current zone"; "updating ActiveZone: %s -> %s"/"primary change: %s -> %s"/"offline primary: %s -> %s" |
| `zones_storage` | **partial** | zone defs {name,id,channelMapSet} + "reached maximum zone definitions"/"too many zones defined in the config file \[max=%d\]" + "zone def full: %s removed"; ops {create,update id,remove (active-guard "zone currently active")}; replication {"received replicated file","failed to rename offered replicated file","failed to load offered replicated file","ignoring replicated file: incompatible schema"}; JSON load errors {missing value,zones data array,root not object,incorrect schema \[%d != %d\],parsing offset,open errno} + RapidJSON vocab; gainTrimDB remote apply; forwarding {activateZone,updateActiveZone,joinZone,updateZoneMemberSettings cmd to %s} + "primary %s not found" + "output buffer full" |
| `alarm_clock` | **?** |  |
| `audio_in` | **?** |  |
| `autoplay` | **?** |  |
| `av_transport` | **?** |  |
| `cert` | **?** |  |
| `cert_layer` | **?** |  |
| `chsnk` | **?** |  |
| `chsrc_chsnk` | **substantially decoded** | chsrc.cxx (0x10ea8620-0x10ea95dc) = channel SOURCE: the playback engine producing framed audio for the group. chsnk.cxx (0x10eb5400-0x10eb6148) = channel SINK: the receiving player decoder path. |
| `cloud` | **?** |  |
| `cloud_registration` | **?** |  |
| `content_directory` | **?** |  |
| `datatap` | **?** |  |
| `device_props` | **?** |  |
| `devmode` | **?** |  |
| `diagnostics` | **?** |  |
| `download_status` | **confirmed** | {ERROR_NOT_CALLED,WRITE_ERROR,TRUNCATION_ERROR,SIZE_ERROR,FILE_ERROR,CONNECTION_ERROR,DOWNLOAD_SUCCEEDED,FILE_UNCHANGED,DOWNLOAD_IN_PROGRESS} |
| `dsp_params` | **?** |  |
| `group_mgmt` | **?** |  |
| `htaudio` | **?** |  |
| `http_engine` | **?** |  |
| `lechmere` | **?** |  |
| `mdns` | **Failed to dump mDNS state into diagnostic: %i; /status/opt/log/mdnsd.log page + /opt/log/mdnsd.log file** |  |
| `mod_zp` | **?** |  |
| `muse` | **?** |  |
| `muse_engine` | **?** |  |
| `music_accounts` | **?** |  |
| `network` | **?** |  |
| `nodetx` | **?** |  |
| `radiolog` | **?** |  |
| `registration` | **?** |  |
| `registration_machine` | **?** |  |
| `rendering_control` | **?** |  |
| `reporting` | **?** |  |
| `saved_queues` | **strong** | file:///jffs/settings/savedqueues.rsq (+.tmp write path, .d.rsq variant, application/gzip accepted); XML <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"><SavedQueue Id= Curated= NumTracks=%u><Track URI= MD=></SavedQueue></SavedQueues>; validation: corrupted track count, invalid queue-id/next-id/mismatch, invalid version/numtracks, boot file invalid; migration "Migrating ObjID=%s SN=%u from SID: %u to %u"; SQ:%s objid prefix; <res protocolInfo="file:*:audio/mpegurl:*">; album-art: "No num tracks found, so emitting the first four artworks found"; mobile- playlist prefix; "Add Track Move range: %u-%u to %u"; replication push on save |
| `smartplay` | **?** |  |
| `smb` | **?** |  |
| `sntp` | **?** |  |
| `spotify` | **?** |  |
| `spotify_connect` | **?** |  |
| `stream_metadata` | **?** |  |
| `update_coordinator` | **?** |  |
| `upgrade` | **?** |  |
| `upnp_eventing` | **?** |  |
| `virtual_linein` | **?** |  |
| `vli` | **?** |  |
| `wifi` | **?** |  |
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

## `abr_engine`

**coverage** `partial`

**Technical description:**

DS (data-source) selection FSM {"Unable to select another DS","waiting to fetch new playlist","fetching new playlist now"}; playlist failures {"Timed out looking for playlist","no time to recover (%ld buffer)","Too many empty playlists and no audio left/(still %ldms ahead)","Switching source due to empty playlists"}; notifyFrame ty:%d ln:%zu so:%zu ns:%zu f:%u ctx:%u:%u:%llu; getContentKey; fetch "open: %s (0x%x) %d len %llu offset %llu"/"redirect: %s -> %s"/"Segment's content type"/"Using file ext."; "URIs for %g seconds, wake up in %d"; "prebuffering %u bytes within %ld msec"; "start new stream for URI \[%s\], resumeLoc %zu time offset"; "Reset ABR state: start bitrate %u"/"Last estimated bitrate %u"; rate model "rate: SR=%.03lf (%zu) S=%d Sth=%d BL=%.0lf" + "rate(%7d): %.2lf/%.2lf SA=%.2lf b=%u/%u B=%u/%u/%u h=%d/%d r=%.2lf a=%.2lf" + happy metrics {"happy (a > %.2lf)","happy (saturated)","rate update: a=1","was happy","unhappy",Underruns}; InitFramerForTrackList-fail source switch; codec mp4a.40.*; URI version regex /v\[0-9\]+\.\[0-9\]+(\.\[0-9\]+)?(-\[a-zA-Z\]+)?(\+\[a-zA-Z.\]+)?(\[?#/\]|$)

- **name:** ABR — adaptive bitrate + stream fetcher
- **status_schemas:**
  - **abr:** <ABRState Name="ABR State"><NodeTXBuffer>%.3lf sec %s</NodeTXBuffer><ProcessRate>%.0lf bps</ProcessRate><Happy>%u / %u</Happy></ABRState>
  - **events:** <ABREvents numEvents><EventEntry ts br sa a r flags="%u\|%u\|%u\|%u" happy/>
<details><summary>Evidence (1)</summary>

- @ 0x10ed3964 — abr/fetcher block

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

## `account_migration`

**coverage** `partial`

**Technical description:**

OAuthMigration flow {reauth,token generation,getAuthTokenResult,accountToOAuthResult}: "migrated account to OAuth, type:%u, sn: %u" + retry {res,retry count,"delay migration until cloud connection","expected ouath account; reset to retry migration"}; "failed to replace email with username for last.fm"; sonos-radio gate {"no SBiz entitlement; preinstalling Sonos Radio","found SBiz entitlement; blocking preinstall"} + "stale entitlements; scheduling job to refresh"; preinstall SID=%u attempts; SA_RINCON65031_ service-account prefix; settings {R_HideTuneIn,R_MigratedTuneIn}; maintenance {"failed to download manifest file for account sid/sn","received empty hash","failed to update userInfo and clean up user hash","Failed to getUserInfo during SvcMaintenance","failed to migrate built-in accounts","failed to migrate pre cloud replication accounts"}

- **name:** zpserviceaccounts — OAuth migration + preinstall
<details><summary>Evidence (1)</summary>

- @ 0x10e9b28c — zpserviceaccounts block

</details>

## `amp_manager`

**coverage** `partial`

**Technical description:**

ops {power,mute,hipower} with "ignored unsupported amp command" guard; power rails {"transition to high power rail","to low power rail"}; off-decision fields "roff:%d canoff:%d ofx:%d nzvplay:%d pre:%d unm:%d"; "scheduling off in %d sec"; "failed to unmute amps to clear fault"; "ampState %d -> %d" + notifyAmpState; threads ampMgr

- **name:** RAmpManager — amp power/mute/rail FSM
<details><summary>Evidence (1)</summary>

- @ 0x10fe5640 — ampManager block

</details>

## `areas`

**coverage** `partial`

**Technical description:**

areas.json file; Everywhere area UUID 7055133f-81e7-45e6-ba70-8803966c7185; validation {"Area IDs must be distinct","Maximum area limit (%d) reached","Cannot update read-only area"}; fields {areaId,playerIds array}; accept-file staging {accepted file load/rename} + schema version check "Loaded areas schema version (%d) differs from local version (%d)"

- **name:** areasMgr — multi-room area persistence
<details><summary>Evidence (1)</summary>

- @ 0x10ead0bc — areas block

</details>

## `arp_assoc`

**coverage** `partial`

**Technical description:**

arpchecker "ARP failure: %d consecutive attempts for %s failed: groupcast problem suspected" + "ARP to %s resolved after %d failures" + source_ip/msreplyfailure; arping {async,sync} "started for %s, every %u ms for %u ms" + reset-on-data + timeout adjust + "pending reset in progress" guard; assoctracker CrAssoc metrics {mstime1,mstime2,msnum,arpscstime,arpatt,arpscs,arpsnum,ddtime1,ddtime2,ddnum} + "Skip reporting invalid CrAssoc event"

- **name:** arpchecker+arping+assoctracker — L2 connectivity
<details><summary>Evidence (1)</summary>

- @ 0x10eefee8 — arp/assoc blocks

</details>

## `async_stream`

**coverage** `partial`

**Technical description:**

init {buffersize,multiThread,ratelimit us}; segment table (realloc to %zu entries); alloc policy {satisfied by track transition|deleting played data|not satisfied}; "Started reaping played data. Lose fast scrubbing backwards"; CDN fallback {">>>Sync read from CDN at offset %zu","Opportunistic sync read from CDN"}; "File is in memory!"; seek sessions "new seek based PB session"; "Socket has: %zu bytes ... CHSRC ms ahead: %ld"; stats mrrkbs/arrkbs + "Avg read rate %zuKB/sec; min read rate %zu"; "Atom Table Full" bound; threads asyncstrmio/asyncstreamiomgr

- **name:** RAsyncBufferedStream — HTTP/CDN stream buffer
<details><summary>Evidence (1)</summary>

- @ 0x10ead488 — asyncstrm block

</details>

## `audio_clip`

**coverage** `partial`

**Technical description:**

muse routes players/%s/audioClip + groups/%s/playback/%s + "forward to %s"; clip object type audioClip; fields {priority,clipType,clipLEDBehavior,clipBehavior,buzzers}; buzzer clips file://%s/buzzers/%d.mp3 + %u:%c; custom requires streamUrl "Missing streamUrl (required for custom clip type)"; httpAuthorization → "Secure streamUrl required when providing httpAuthorization"; delivery {Using AVT,Using External Audio Source}; priority "Cannot interrupt current clip due to priority policies"; pause content first "Failed to pause content because group info could not be retrieved for UUID=%s, ZoneGroupID=%s"; errors {Invalid clip type,Invalid clip id,Clip id not found,Error starting audio clip,failed getting audio clip response,"unexpected object type %s, expecting audioClip"}; resume content after

- **name:** AudioClipManager — doorbell/alert clips
<details><summary>Evidence (1)</summary>

- @ 0x10edf87c — audioclip block

</details>

## `audio_decoder`

**coverage** `partial`

**Technical description:**

status <SampleRate><SampleBitDepth><NumChannels><ChannelMap><FrameSize>; lifecycle {decoder create/init,header,seek tvResume=%ld.%ld,"seeking to absolute position = (%llu / %llu)","capping aboslute seek position",scan,get pos}; errors {decode err skip/pos/flush/set pos,too many errors,no progress(eof,o),open failed,streaming hint failed,read out of accum space,read eof,reached expected eof pos,seek failed,len failed}; unsupported {too many samples,channels,bit depth}; REPLAYGAIN_TRACK_GAIN= + gain=%f; ogg errors {seek,bailed out,no mem,no init}; ffmpeg/WMA: wmaSeekPacket offset bound; AVFormatContext alloc/open; stream-info/audio-stream find; resume loc byte→time fallback "Resume location %zu exceeds file size %zu, falling back to time-based seek"; "Seeking to position %zu"/"Seeking to time: %lld microseconds"; "Stream duration: %zu milliseconds"/"File size: %zu bytes"/"Estimated offset %zu exceeds file size"; attached-picture extract image/jpeg; libavformat metadata album_artist; codec ctx {not found id,alloc,params,open,pAVPacket/pAVFrame}; frames {send/recv errors,send result status eof}; payload bounds {Extradata too large,Codec params size,Packet size too large,Codec params too large for cache,Packet too large for cached payload}; "no client, ptvResume, fileURI, or uri opener provided, we won't continue"

- **name:** generic audio decoder + ffmpeg WMA path
- **ogg_vorbis:** nullaudio "starting null audio play"+"dropping %zu bytes"; gapless ogg "we have gapless ogg, %d samples, %zu frame size"/"gapless requested %d samples > decoded frame size"; bounds {oob num samples > max vorbis packet}; states {ogg eof,ogg only header byte found,ogg hard stop requested}
<details><summary>Evidence (1)</summary>

- @ 0x10edde80 — decoder blocks

</details>

## `audio_fifo`

**coverage** `partial`

**Technical description:**

records with {pos,range}; writes {"Advance write to next record","Rejecting write, as provided offset %zu != %zu (pending)","not enough fifo records","truncated write","Audio fifo records reset"}; discontinuity {"Discontinuity @ offset %zu in record %zu (expecting: %zu)","*** Too many discontinuities"}; reads {"Consumed contiguous samples (%zu - %zu)","Advance read to next contiguous record","Read %zu bytes from record","No bytes to read from fifo... EOF","audio fifo read at boundary eof","consumed exactly to the eof marker","reached logical boundary","already has pending offset"}; prebuffer {"prebuffering... (used/prebuffer)","Waited %ums for audio from the eSDK","Finished prebuffering in %u ms (st,flush)","prebuffering elapsed %u ms (used/free)","exit waiting for audio, not rendering"} — Spotify eSDK feed

- **name:** audiofifo — record-based circular audio buffer (eSDK)
<details><summary>Evidence (1)</summary>

- @ 0x10ef04f0 — audio_fifo block

</details>

## `audio_rate_ctrl`

**coverage** `partial`

**Technical description:**

ARC: setCoefficients StdQ ASRC; guards {adjust rate of 0,unsupported channels,Unsupported Input Audio/Line Rate,Over Excursion error,sample rate converter error read}; reconfig on rate/channel-count/line-rate change; timesync: databurst LockTime, "Rate Maxed"/"Rate Inv Maxed" rails m_dOverallRate/m_dIntegratedRate, iter dump {LE,LEP,IC,ICP,IL,RT,err,errf,dOut,dIn,AP,RL}; "time went back; try again"; "Thread descheduled for %uus. Limit %uus"; SRC mute on |drift| "(Should) Mute SRC. dAbsoluteError = %f, current canonical rate = %u"; "Out of bounds. drift: %f mute count: %d"

- **name:** Audio Rate Controller (ASRC) + timesync drift
<details><summary>Evidence (1)</summary>

- @ 0x10f2b610 — arc/timesync block

</details>

## `audio_stream_mixer`

**coverage** `partial`

**Technical description:**

stream ops {start buffering,set presentation time,resync,drain flag,skipAhead} + stats "E:%d, D:%d, B:%d, PR:%d"; fade engine "fade added: %i.%i sample_len(%u) current_gain target_gain rate" + max/min/fade complete + "no fade slots available"; skipAhead "delta:%u > buffered:%u"; "discontinuity detected after scheduled resync"; mixer: bManageOutputLatency,startup buffers,buffers; fd poll sound.fd.poll.%04X; stall detect "loop(wall): %uus loop(cpu): %uus, sel: %uus"; states MTS_PLAYING transition; DSP drain FSM {"start dsp flushing %i buffers","dsp flushing ended %i frames early","driver draining","dsp flushing complete with od %u"}; stream names as-{dspin,dspout}{-tv,-ext-voice,-ext-chirp}/as-src{in,out}-ext-voice/%s-chsnk%zu; system/audio_out_disable + "Running with audio output disabled"; forcePerfectInitialSync; "KERNEL_PRINTK_ENABLE ... mixer scheduling can't be guaranteed"; "Testpoint delay of %ums"

- **name:** audio_stream + mixing_threaded — per-stream mixer
<details><summary>Evidence (1)</summary>

- @ 0x10f29ab7 — audio_stream/mixing blocks

</details>

## `audio_tap`

**coverage** `partial`

**Technical description:**

errors {no tap specified,syntax error,invalid request,permission denied} + audio/wav; mic gate "allowed %d mic %d"; taps {linein,codecout,irdecoder,mixersat,mixergm,as-srcin-chsnk0,as-srcout-chsnk0,mixerstats,dspout,formatter,llaout,mixerout,mzdsp,extvoice,extchirp}; spdiftap.compressed + "Internal SPDIF Tap Snapshotted. Tap must be uncompressed before use!"; sonos-dspid header

- **name:** AudioTap — debug tap points
<details><summary>Evidence (1)</summary>

- @ 0x10e73cb8 — audiotap block

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

## `auto_update`

**coverage** `partial`

**Technical description:**

states {ST_UNDEFINED,ST_INIT,ST_REFRESH,ST_SCHEDULED,ST_SCHEDULED_POST_WOW,ST_SESSION_MONITOR,ST_SESSION_REPORT,ST_SESSION_ACTIVE} + PendingStart/SessionStart/SessionStartLocal/SessionAttempts counters; settings {R_AutoUpdateWindowStart,R_AutoUpdatePolicy,R_CheckUpdateInterval}; blockers {"Upcoming alarm is preventing update","Active device(s) preventing update"}; "Trimming the window to (%d) seconds"/shrinkWindow; upgrade_mgr_report.json {pendingUpdateHours,numUpdateAttempts,startTime,elapsedSeconds,blockedUpdateReason,updateHHStatus,serverIP,errorMsg,extendedError,zoneType,startVersion,targetVersion,hardwareVersion,serialNumber,updateZPResult,numZPsInHH,numZPsInHHDelta,numZPsToUpdate,numZPsDropped,targetSystemVersion,updateHHResult,numFailedZPs,numZPsWithError}; "RINCON_%s01400 updated to %s"/"update failed (%d)"; "Retrying upgrade (%d/%d)..."/"Giving up after max upgrade attempts"; upgrade_mgr.txt state file

- **name:** upgrade_mgr — auto-update scheduler FSM
<details><summary>Evidence (1)</summary>

- @ 0x10eae3f4 — auto_update_scheduler block

</details>

## `boot_sequence`

**coverage** `partial`

**Technical description:**

"updating boot sequence due to wifi connection event"; settings {TargetRoomName,LocalAccountTransferMode,ForceWifiDisable,ForceMeshDisable,SonosNetDisable,WEPKey}

- **name:** boot_sequence_mgr — bootseq triggers
<details><summary>Evidence (1)</summary>

- @ 0x10ef0a8c — boot_seq block

</details>

## `bt_sbc`

**coverage** `partial`

**Technical description:**

params "freq=%u blks=%u sb=%u mode=%u alloc=%u bitpool=%u end=%u fin=%zu fout=%zu frames=%zu"; errors {Invalid packet header,Failed to parse %zd,Truncated packet. Lost frames,Invalid packet,frame size changed %zu->%zu,decoder error %zd on frame %zu,Bad SBC frame %zu read/decoded,NOTIFYFRAME_ERR_BUFFERING,unknown frame status}

- **name:** SBC decoder (Bluetooth RX)
<details><summary>Evidence (1)</summary>

- @ 0x10ee54d0 — sbc block

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

## `capability_guards`

**coverage** `partial`

**Technical description:**

"Supported only for devices that support power over ethernet and have ethernet support"; "Supported only for devices with a water sensor"; "Supported only on devices with a microphone switch"; "Device is not a subwoofer"; "Supported only on suspendable devices" + {requiredMinimumBatteryPercentage,requiredMaximumBatteryPercentage,durationSeconds}; "Supported only on devices with a battery"; "Supported only on devices with bluetooth" + "Unable to set bluetooth pairing, unsupported"; "target is not a home theater source"/"target does not support HDMI CEC" + tvPowerState; "Setting is not valid"

- **name:** settings capability guards
<details><summary>Evidence (1)</summary>

- @ 0x10e99764 — capability guards

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

resources {itemWindow?,context?,version?,version?updateToken=true&}; params {isExplicit,previousWindowSize,upcomingWindowSize,heardItemId}; truncation {item window,context,version}

- **name:** cloud-queue item-window API
<details><summary>Evidence (1)</summary>

- @ 0x10ec1f8c — cq window block

</details>

## `cloud_synchronizer`

**coverage** `partial`

**Technical description:**

cloud_synchronizer thread: registerServices (max-count abort, called-once guard), "received JIT event", "discarding %s type %d"

- **name:** RCloudSynchronizer
<details><summary>Evidence (1)</summary>

- @ 0x10ef1ba0 — cloudrequest region

</details>

## `crash_report`

**coverage** `partial`

**Technical description:**

{procName,numCrashes,uploadResp,playerCrash,lifetime}; "%s %s crash event, crashCount: %i"; Reported/Failed to report

- **name:** crash-event reporting
<details><summary>Evidence (1)</summary>

- @ 0x10f028b8 — crashreport block

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

## `didl_extractor`

**coverage** `partial`

**Technical description:**

rincon md fields {tiid,radioName,connotation,state,trackGain,chapterNum,chapterCount,linkUrl,isAd,streamContent,audioInputIcon,radioShowMd,streamInfo,rating,policies,podcast,episodeNumber,releaseDate,narrator,albumArtist,numSections} + upnp {originalTrackNumber,album}; classes {object.item.audioItem.podcast,.show,.audioBook.chapter,.musicTrack.recentShow}; loadFromExtraMd(trackURI,extraMd); extractMimeTypeFromHttpContentType (trunc/mtParams errors); protocolInfos {http-get,rtsp-rtp-udp,x-sonos-vli:*:audio:*,x-rincon-queue:*:*:*}; " duration=" attr; &#10; newline; -yYy- marker

- **name:** RTrackDIDLLiteMdExtractor — track DIDL parser
- **uri_service_map:** {x-rincon-mp3radio,x-rincon-internal,x-rincon-buzzer,sonos.com-{hls-static,hls-radio,hls-aac,rtrecent,spotify,http,mms},x-sonosapi-iqradio,audio/x-sonos-recent,pandora.com-{pndrradio-http,pndrradioad},real.com-{rhapsody-direct,rhapsody-http-1-0},sirius.com-sirradio,last.fm-radio-http,https:,file:,rhap:,radio-{rhap,radea,npsdy}:,pndrradio-http://,pndrradioad://,lfmtrack:,x-sonos-dock:,hls-static://}
<details><summary>Evidence (1)</summary>

- @ 0x10ecc67c — didl extractor block

</details>

## `dolby_decoder`

**coverage** `partial`

**Technical description:**

config files /opt/dsp/dolby_config.json + app/debug/dsp/dolby_config.json jffs override; keys {boost,speakers,directdec,virt_mode,frontangle,heightangle,rearsurrangle,oarBassExtraction,dapCutOff,hfilt,vlamp,vmcal} + DRC {movie,night,disable} + crossover 100-200HZ + speaker roles lrrse/lrrs1/lrrs2; Evolution mem {static,dynamic byte allocs}, timeslice processing, malformed-input detect; status <DEC_SampleRate><LFEPresence><DEC_ChanCount> + <BlocksInTimeSlice><ACMOD><DataRate><DialNorm><SURRMOD>

- **name:** dlbdec — Dolby DD+/Evolution (JOC) decoder
- **control_ids:** `DDPI_UDC_OUTCTL_OUTLFEON_ID`, `OUTMODE_ID`, `DUALMODE_ID`, `COMPMODE_ID`, `OUTPCMSCALE_ID`, `STEREOMODE_ID`, `DRCSCALEHIGH_ID`, `DRCSCALELOW_ID`, `DDPI_UDC_CTL_SUBSTREAMSELECT_ID`, `ERRORCONCEAL_ID`, `ERRORMAXRPTS_ID`, `EVOMODE_ID`, `EVOQUICK_SWITCH`, `EVOQUICK_SUBSTREAM_ID`, `EVOQUICK_STREAMTYPE`, `MIXER_SWITCH_ID`, `FORCE_JOC_OUTPUT_DMX_ID`, `MIXPREF_ID`
<details><summary>Evidence (1)</summary>

- @ 0x10fe6998 — dlbdec/evo block

</details>

## `dropout_logging`

**coverage** `partial`

**Technical description:**

triggers {corr ctx chg evt type %u,grp role chg evt %u->%u,clear/set cid src=%u,set/reset pt}; slot model {clr slot,slot in use skip incr,set slot %zu idx %zu to %s,no space in list}; conditions {set pt reached,flag report at %zu sbmt,set pos aud,pt in fut - inaud,GCI but no CID}; per-ch incr "incr call: %s, %zu, %zu, ch %zu, %d.%06d"; fields {inputType,SatChCount,HtsnkVersion,msAfterPt,GroupRole,GCTimeValid,GCTime,btRole,submit}; counters {htsnk_missed_total,htsnk_missed_duration_total,htsnk_late_total,htsnk_strm_reset_duration_total,htsnk_strm_silence_duration_total,htsnk_strm_plc_duration_total}; reasons {chsnk_lse,chsnk_ch_data_full,chsnk_w_err,chsrc_framer_uflw,htsnk_invld_sntp,htsnk_late_frames,htsnk_missed_frames,htsnk_time_backw,htsnk_stream_err,htsnk_stream_uflw,htsnk_stream_reset_duration,htsnk_wrong_frame}; bt_audio + injectdropout test cmd {"missing dt param","Injected dropout error"}; "Sat chs %zu"/"Sat htsnk ver %u"

- **name:** DropoutEventHandler — dropout telemetry
<details><summary>Evidence (1)</summary>

- @ 0x10ebe644 — dropout handler block

</details>

## `dsp_files`

**coverage** `partial`

**Technical description:**

files {eqdata.txt,app/debug/dsp,persistentEQ.xml,/dsp/eqdata.txt,dsp_preset.xml,dsp_preset_default.xml,dsp_preset_satellite.xml,dsp_system_default.bin,dsp_system_satellite.bin,satellite_processor.bin}; sonar-tone flush {"flushing sonar tones","Flushed"}; htdocs_locked; "modZPAmpTimer() called"; "unable to delete %s even though it exists"/"successfully deleted %s"; settings {ZPLocalSettingsFile,ZPExpirationTime,ZPGroupExpirationTime,ZPForcedUPnPExpirationTimeout,ZPMusicServicesBackstop,ZPTimeZonesBackstop}; "Setting JFFS root to %s" + ServerRoot + ContinueAfterIPChange + #GROUP_NAME# + "Failure generating group description xml"

- **name:** DSP preset/system files + settings
<details><summary>Evidence (1)</summary>

- @ 0x10e7390c — dsp files block

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

## `dts_decoder`

**coverage** `partial`

**Technical description:**

profiles {Digital Surround,Digital Surround 96/24,Digital Surround ES,High Resolution Audio,HD-MA,Express,Unknown DTS profile}; sync "Endian-Check: Unexpected Input Syncword Error"; "invalid dcadec audio mode, returning empty speaker layout"; status <BitDepth><DTSProfile><BitRate><NumPrimaryChannels><AudioMode><DialNormGainDB><ChannelMap>; errors {invalid sample size N-bit,encoded frame exceeds maximum,packet parse,frame 0 warning,unsupported sample freq,unsupported amode}; modes {Dual Mono,Stereo}

- **name:** dcadec — DTS decoder
<details><summary>Evidence (1)</summary>

- @ 0x10fe7670 — dcadec block

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

## `ext_audio_src`

**coverage** `partial`

**Technical description:**

job FSM {STARTING,RESUMING,RESUMED,CANCELLED,DISCARDED} + ops {stopPlaying(too many/no jobs),processJob,WaitForComplete,playDeferredStream(deferred j/d counts),playStream(exclusivity skip)} + "too many deferred jobs"/"playing job %u is missing"/"current job %u gone"; clip types {COMMON,AUDIOCLIP,AVT_HACK,ALEXA_TTS,ALEXA_WELCOME,ALEXA_FAILURE,ALEXA_ALERT,GOOGLE_MEDIA,GOOGLE_ALARM,GOOGLE_TTS,SVE_TTS,VOCAL_GUIDANCE,ALERT,SETUP_CHIRP,DISCOVERY} with intr flag "processing type %s %d (intr=%d)"; volume override "\[%i, %i - %i over %ums\]" ramp + "\[%i, % i\]"; "eventing play status for job %u: %s \[%s\] @%d.%06d"; decoder {failed to get decoder,illegal sample frequency,zero len frame,decoder flagged playback stop,unsupported channel count > 2}; extaudiosrc_playid

- **name:** extaudiosrc — clip/TTS injection engine
<details><summary>Evidence (1)</summary>

- @ 0x10ec01fc — extaudiosrc block

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

## `favorites`

**coverage** `partial`

**Technical description:**

replication "replicating favorites from %s"/"deciding whether to accept replicated list" + informReplicationAndNotify{,ForDestroy} + offerRemoteSetting; DIDL ns {xmlns:dc purl.org/dc/elements/1.1,xmlns:upnp,xmlns:r rinconnetworks,xmlns DIDL-Lite}; migration {old rhapsody→new,old non-OAuth} + "Failed to parse account service ID / serial number from Sonos URI"; errors {Invalid favorite id,Could not access favorites,initContentResource {parse URI,extract item ID,Invalid item ID,No valid mapping for item type}}; shortcuts/shortcut type; fields {AlbumArtURI,NextFavorite,FirmwareVersion,Description,ResMD}; cdudn + nameSpace + restricted + parentID

- **name:** favorites — userradio + recents
<details><summary>Evidence (1)</summary>

- @ 0x10ec0e24 — favorites block

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

## `fileio`

**coverage** `partial`

**Technical description:**

async register/unregister + enabled; SMB readdir + "failed to open SMB dir"; "File is in memory" skip-open; "Success opening URI %s; stream type %d"; "Sonos API URI %s not dereferenced before opening stream"; prebuffering + "reopening http for streaming at %zu" + ?after= resume; "application/xml; listing" dir listing; "no framer found in factory, returning null, we should not reach here"

- **name:** fileDataMgr — async stream I/O
<details><summary>Evidence (1)</summary>

- @ 0x10ec182c — fileio block

</details>

## `fmp4_parser`

**coverage** `partial`

**Technical description:**

boxes {mfhd(seq check),tfhd(version),tfdt,trun space bounds} + "tfhd not found before trun"; trun table "seqnum %u truntblnum %zu fsize %zu foffset %zu fsamples %zu bdo %llu trundo %i truneo %zu trunes %zu trunep %zu"; senc "Sub-entry encryption isn't supported" + "Cannot parse all the IVs in senc at %dth entry"; "stream quality: encoder %s, bit depth %u, sample rate %u, bitrate %u, channels %u"; trims {encoder delay,padding} + "skipping frame; seek time offset"/"< usable offset"; atoms {iTunNORM,iTunSMPB,TLOU/ALOU ITU loudness,mehd,trex,traf,esds max/avg bitrate,alac sub,mp4a ch/bitdepth/samplerate}; errors {bad moof,no moov,no dat,unknown fmp4 encoder type,unsupported file ch/bitdepth,unsupported frequency %u-bit %uhz %u channels,frag w/o traf,STZ2 ignored}; formats %ub%u

- **name:** segaudio fmp4 — fragmented MP4 parser
<details><summary>Evidence (1)</summary>

- @ 0x10ec9e38 — fmp4 block

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

## `group_rc`

**coverage** `partial`

**Technical description:**

group vol snapshot {"snapshot %s: %u (was %u)","snapshot sum for %u (of %u) zones"} + DesiredVolume/DesiredMute; algo "calculateVolume %s: sg:%.4f ng:%u sv:%u nv:%.4f" + gvd {t,c,f,m,cv,sv}; tracking {addZone already tracked,removeZone not tracked,transitionValid c/m/f}; faults {total failure,partial failure,all members use fixed volume,operation in progress,unexpected upnp fault}; events {GroupVolumeSetActionEvent(vol,mute,vligrouping),VliVolumeProcessingCompleteEvent vliType}; members {localRC vol/mute/fixed,remoteRC %s vol/mute/fixed}; ops {SetGroupMute local/remote rc,SetGroupVolume local netops zones + per-member rc}; group caps {"Group capability updated: 0x%08x -> 0x%08x","Spatial audio disabled in Area Zone","Spatial audio disabled: mask"} + enableSpatialAudio + "GroupCapabilities zp: %s: %i,%i,%i"; cap strings {widevine,atmos,portable,tv_in,hlsv7}

- **name:** grc_zpimpl — group rendering control
<details><summary>Evidence (1)</summary>

- @ 0x10ec3a58 — grc_zpimpl block

</details>

## `healthcheck`

**coverage** `partial`

**Technical description:**

schedule "Next healthcheck scheduled to run in %u hour(s), %u minute(s), %u second(s)" + "Not scheduling: %d %d %d %d %d %d" 6-gate + "Healthcheck timer pop"/reschedule; fields {SubmitPermission,ServerDiagInstructions}; instructions fetched /ws/diag/diag_instructions.xml?hhid= ; errors {I/O+HTTP Result,Indeterminate length,Incomplete,parse fail,too large}

- **name:** healthcheck — periodic health probe
<details><summary>Evidence (1)</summary>

- @ 0x10ec4574 — healthcheck block

</details>

## `healthcheck_contact`

**coverage** `partial`

**Technical description:**

schedule "Next healthcheck scheduled to run in %u h %u m %u s" + "Not scheduling: %d %d %d %d %d %d" + "Healthcheck timer pop" + "Rescheduling next healthcheck"; server /ws/diag/diag_instructions.xml?hhid= + SubmitPermission + ServerDiagInstructions + "Contacting server for instructions"; errors {I/O Error + HTTP Result,Indeterminate length,Incomplete file,Failed to parse,too large}

- **name:** healthcheck — server instructions
<details><summary>Evidence (1)</summary>

- @ 0x10ec4574 — healthcheck block

</details>

## `history_mgr`

**coverage** `partial`

**Technical description:**

historyService + rphistory + historyEntryInvalid event + ucsType; cache {preCache,postCache,preEtag,postEtag,cacheControl,historyRequest} + "Updating history cache: \[status\]\[key\]\[etag\]\[cache-control\]" + "Cached etag" + "corrupt cache could not be served after a 304"; POST postHistory + recentlyPlayed + max-age + "max-age=%s, etag=%s, http-result=%d" + "Post History Buffer Cleared"; queue faults {bufferFull,invalidContentType,resourceIncomplete(name,type,objectId),groupIncomplete(name,id,coordinatorId)}; fields {imageUrl,explicit}; getHistory {serving the cache,#getHistory response} gated by {Securely Registered,History Enabled}; deleteHistory history?id=; "Failed to generate defaults for history entry"; "Failed to initialize history from cache"

- **name:** historyMgr — cloud history
- **salt_literal:** Smb2sOM9daUv+IELUjC4q5gaxyNuvkstS9nLmjWQeLY
<details><summary>Evidence (1)</summary>

- @ 0x10ec4878 — history_mgr block

</details>

## `hls_audio`

**coverage** `partial`

**Technical description:**

"requires group capabilities %u"; seek {to time %.3f (%lu:%02lu:%02lu),to time from start of current segment,pass segment,to segment start time range}; "forcing a source switch due to multiple codec variants in playlist"; ADTS metadata {metadata,no metadata bumping seconds advanced,cached seconds advanced mismatch}; EXT-X-KEY {METHOD= AES-128,/SAMPLE-AES,,KEYFORMAT=,URI=data,URI=""} + "encrypted but no key URI"/"encrypted but no data from key URI"/"No IV, using seq. num"/"SAMPLE-AES detected. Setting up audio framer decryption"/"Key extracted. method=%d"/"undefined encryption method"; track playback {bitrate %u stream %u segment %llu offset %zu,InitFramerForTrackList failed,m_dTimeOffset,Trim offset required,resetMetadata,track play time,seconds advanced,time offset of segment byte offset}; bitrate report "hls-%s said: %u (%g) %d %d"; types {hls-live,hls-static,hls-???}; master {fetching master,updated master URI}; playlist errors {EXT-X-TARGETDURATION not present,media seq went backwards,media len changed,Invalid media playlist,Seeking pass the end,empty track list,Error %x occurred}; stale {d d llu llu}; Segment Map entries

- **name:** hlsaudio + segaudio — HLS player
<details><summary>Evidence (1)</summary>

- @ 0x10ec4f88 — hls blocks

</details>

## `hls_player`

**coverage** `partial`

**Technical description:**

variants {hls-live,hls-static,hls-???}; "requires group capabilities %u"; "forcing a source switch due to multiple codec variants in playlist"; ADTS md + "seconds advanced" tracking + "doesn't line up with seek"; encryption {encrypted-but-no-key-URI,no-data,"No IV, using seq. num.","SAMPLE-AES detected. Setting up audio framer decryption",key-uri http status,read size mismatch}; byte-range map "couldn't get file size from http headers for map"/"found offset %zu"; InitFramerForTrackList; seg index "starting at bitrate %u stream %u segment %llu offset %zu"; master {updated master URI,fetching master,version %u bitrate max/cur/min,getIndexURI,"Failed to calculate absolute media URI"}; ABR {"downgrade bitrate","already at the minimum","upgrade bitrate","advancing stream index"}; rendition filters {rgchStreamURI empty,PROGRAM-ID,invalid rendition,"rejecting binaural/downmix rendition",BANDWIDTH unsupported/0}; "unexpected, we have %zu dolby streams in the playlist"; BR P|TYPE=SNG marker; seq discontinuity detect; threads {segaudio,hlsmeta,hlsplaylist}

- **name:** hlsaudio — HLS stream player
- **status_schemas:**
  - **hls:** <HLS Name="Playlist"><HLSVersion><IsStatic><IsEncrypted><TargetDurationSec><CurrentBitRate><TrackEncryptionMethod><TrackEncryptionFormat></HLS>
  - **bitrates:** <BitrateStreams numBitrates="%zu"><StreamEntry br strm codec segidx/>
<details><summary>Evidence (1)</summary>

- @ 0x10ec4f88 — hlsaudio block

</details>

## `household_settings`

**coverage** `partial`

**Technical description:**

file householdsettings.json {fileVersion,fileSchemaVersion,householdSettings}; JSON \[{version,lastUpdateDevice},\[{name:"restricted-admin",readPermission:null,writePermission:"hh-config-admin",settings:\[{explicitContentFiltering,recentlyPlayed}\]}\]\]; categories {restricted-admin,protected-admin,protected}; frozen:1 marker; "File upgraded to v%d schema"/"File overwritten due to invalid setting"; UMTracking→userMetricsTracking migration; "version incremented after invalid settings offered"; hhSwgenState swgen must be >= player; /householdsettings.json status-page ALERT

- **name:** householdsettings.json persistence
<details><summary>Evidence (1)</summary>

- @ 0x10ef43f0 — hhsettingsfile block

</details>

## `hw_events`

**coverage** `partial`

**Technical description:**

hwmessagelib + NetLink multicastGrp + repeat interval; events selthrd.RHWEvtHandlerZP.{reset,data,except,timeout}; readEvent {overflow,unknown,readNextMsg ERROR}; button forwarding {'Forwarding button events','Disabling button event forwarding'} to private-IP-only target {Unable to translate address,Host not private IP,Invalid host IP,Invalid port no,socket errors}; FSM states {NOT_IN_HOUSEHOLD,PROCESSING_PLAYBACK,IN_DEMO_MODE,IN_RDM_MODE,IN_BUTTON_OBSERVATION_MODE,IN_TRANSFER_MODE,PROCESSING_JOIN,JOIN_CHIME_UNAVAILABLE,REGISTRATION_CHIME_UNAVAILABLE,BUTTONS_LOCKED,DAT_IN_BUTTONLESS_SETUP_MODE,DAT_IN_SETUP_DISCOVERY}; setup combo {VOL_DN|VOL_UP starts timer → setup-ready on pop, VOL_UP+VOL_DN timer popped}; '%s press/release count = %zu'; '%s ignored in notify mode'; 'Disallowed action (%d - %s) because (%d - %s)'; 'inline action'; allowPlaybackRequests; 'collecting triggered diags'; 'enter %s household mode'; 'cancel join household mode'; PLAYPAUSE; '%s button pressed (cid)'; 'Play button held'; orientation {old->new,orientation_change,syslib orient}; led_diags {'Diag mode:%u, leftMS:%u; timeMS:%u; next mode: %u','set diag mode:%d'}; setup {'join hh','enabling wifi and %s','signaling netstartd (%s) %s',openap}

- **name:** hwevt_handler — button/orientation/thermal
- **status_schema:** <HW Name="CurrentStatus"><Orientation/></HW> + <HWMembers Name="Members"><State/><Flags/><MicFlags/></HWMembers>
- **version:** 7.31.0-test
<details><summary>Evidence (1)</summary>

- @ 0x10ec6db8 — hwevt block

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

## `iocompress`

**coverage** `partial`

**Technical description:**

RCompressBuffer {deflateInit2,deflate,deflateEnd failed} + RDecompressBuffer {inflateInit2,inflate,inflateEnd failed}

- **name:** iocompress — zlib buffers
<details><summary>Evidence (1)</summary>

- @ 0x10ec7c08 — iocompress block

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

## `lla`

**coverage** `partial`

**Technical description:**

errors {WOULD_BLOCK,UNDERFLOW_OVERFLOW,NO_CSB,INVALID_DATA,SUSPENDED}; devices {lla_hdmi out, lla_in_%s in}; out: "Setting tx latency %u", combined time+output delay, play-time-in-past reject, "time requested %d.%06d current time ... devPlayTime/devCurrentTime", "callback failed, playing zeros", underflow-count cache; in: descriptor "id:%d fd:%d min:%u max:%u dflt:%u bufs:%u channels:%u frame:%u jitter:%zu", rx time in ticks, nonblocking pipe, buffer copy maxbytes bound; fds lla-select/lla.in.poll

- **name:** liblla — low-level audio (output+input)
<details><summary>Evidence (1)</summary>

- @ 0x10fe5ad4 — liblla blocks

</details>

## `load_content`

**coverage** `partial`

**Technical description:**

verbs {loadContainer,loadStream,loadFavorite,loadPlaylist,loadTrackList} with guidance "Use playback#loadTrackList to load tracks"/"Use playback#loadStream to load streams"; item types {spotify.connect,linein.homeTheater.spdif,linein.airplay,trackList.program,episode.podcast,chapter.audiobook,homeTheater-input,TV Audio}; meta json paths {/containerType,/containerName,/name,/explicit,/durationMs,/artist,/imageUrl,/releaseDate,/mimetype}; errors {Invalid favorites directory state,Invalid content resolver state,Account error,Invalid serviceId,Could not find default account for serviceId,SID mismatch lookupAccountByUDN vs RMuseUniversalMusicObjectId,Could not find UDN,serviceId is not associated with accountId}; "cannot enqueue item; %s queue is full (%zu items added, %zu items enqueued)" + "item.id tracking is out of memory"; local-library + r:contentService + /getaa? art; sn_%u/mhhid_ id prefixes; "RadioShow name/Id truncated"; shared|private visibility; protocolInfo http-get:*:%s:*

- **name:** favorites + loadContent resolution
<details><summary>Evidence (1)</summary>

- @ 0x10ecf310 — favorites/loadContent block

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

## `longpress`

**coverage** `partial`

**Technical description:**

GC list {head,tail,current} of cloneable group coordinators; "cycling to %s:%s"/"end of list reached"; tracked GC actions {Adding new GC,Moving GC to head,Removing GC,"Updating last PAUSED/STOPPED GC","Last GC in HH to change playback state is no longer cloneable",Untracked GC action}; "not joinable"

- **name:** longpress — GC-clone cycling
<details><summary>Evidence (1)</summary>

- @ 0x10ec9b7c — longpress block

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

## `memory_monitor`

**coverage** `partial`

**Technical description:**

reads /proc/meminfo {MemAvailable,MemFree} + /proc/%s/{statm,cmdline}; logs to /tmp/memorylog/log.%d with .old rotation; "memory report avail=%s free=%s"; "report skipped %s (count: %u)"; fields {memavailable,memfree}; threads memlog/memmon/memory_status

- **name:** memmon — memory tracking
<details><summary>Evidence (1)</summary>

- @ 0x10f06588 — memmon block

</details>

## `mntmgr`

**coverage** `partial`

**Technical description:**

mount points /tmp/smb/%d_%d + trial /tmp/smb/tmp%d_%u; "already mounted unc=%s share=%s loc=%s"; "too many shares mounted"; trial mount "Trial mount found unsupported protocol: %s (strike %d/%d)" + "flagging %s as failed"; "not http mounting %s as %s"

- **name:** mntmgr — SMB mount manager
<details><summary>Evidence (1)</summary>

- @ 0x10ece5d0 — mntmgr block

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

## `mp3_decoder`

**coverage** `partial`

**Technical description:**

normalization {id3,lame}; "WMA radio not supported on this platform"; resync bound "20 resync required: corrupt file"; frame errors {illegal sample rate,read frame header/sync/data overflow/data failed}; xing {"No size in xing header","xing we can't load",VBR dur "%zukb/%ukbps = %llds",CBR dur,"Assume that VBR file without a ToC has constant bitrate of %d"}; ID3v2 skip; "Found valid header after searching %zu bytes"; seekSeconds duration bound

- **name:** mp3 stream decoder (xing/VBR)
<details><summary>Evidence (1)</summary>

- @ 0x10ece800 — mp3 block

</details>

## `mp_autoplay`

**coverage** `partial`

**Technical description:**

params {vol,useVol,includeZones} + "airplay include zones: %d" + AirplayIncludeGroupedEvt; linein types {object.item.audioItem.linein.{homeTheater,airplay,bluetooth}} + x-sonos-vli; target resolution {"lonely local line-in autoplay","no autoplay target","couldn't determine coordinator/AVT control URI/control URI","Not executing on invisible/node proto incompatible ZP"}; "for controlURI \[%s\] for coordinator \[%s\]. programURI \[%s\]"; "Autoplay command failed ret=%d"; "AutoStop called on unhandled URI"; http://%s:%u

- **name:** media_player_autoplay — VLI autoplay
<details><summary>Evidence (1)</summary>

- @ 0x10ecb510 — mp_autoplay block

</details>

## `mpegts_id3`

**coverage** `partial`

**Technical description:**

TS parse: PAT/PMT PIDs, sectlen/desclen/silen, stype (Unsupported stream type), eslen, "No audio PID"/"Audio PID is 0x%x", "non-audio and non-timed_id3 PID", PTS, peslen/payload; timed-ID3v2 extraction: tag footer detect, "Ignoring too large timed ID3 size", OOB guards, "unsupported mp3 segment"

- **name:** MPEG-TS demuxer + timed ID3 (HLS radio metadata)
<details><summary>Evidence (1)</summary>

- @ 0x10ed9380 — ts/id3 parser region

</details>

## `mpmgr`

**coverage** `partial`

**Technical description:**

actor key {uuid,ix,port,ssl,mtls} + "already exists or has overlapping values"; resolve {getActor,Actor Filter null,unexpected target ID type,found actor,found backup,target resolved,no actor available}; lifecycle {registered \[%zu\],created \[%zu\],Invalid target key abort,Request to shutdown,shutdown}; per-MP config Player%s + anacapa_logger.toml + /localsettings.txt; VLI hooks {onVirtualLineInGetVolume,SessionStartInfoUpdated,StartSession,StopSession,SuspendSession,NameChanged,MetaDataChanged,PlayModesChanged,onPlaybackStateChanged,processSetVolume,waitOnTxBitFlagsClearedLocked}; events {VolumeSetActionEvent(vol,mute),VliVolumeProcessingCompleteEvent(type,success,flags)+signal rc,VliSessionProcessingCompleteEvent(type,action,success,flags),"vliType old: %s new %s cookie %d"}

- **name:** media_player_mgr — actor registry
<details><summary>Evidence (1)</summary>

- @ 0x10ecb874 — mpmgr block

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

## `music_services`

**coverage** `partial`

**Technical description:**

musicservices.xml + backstop file; state vars {ZPMusicServicesList,ServiceListVersion,AvailableServiceDescriptorList,AvailableServiceTypeList,AvailableServiceListVersion}; settings {OnlineUpdateBaseURL,R_TrialZPSerial,R_AvailableSvcTrials}; replication locks {rwlR_msd,rwlW_msd} + msdZonePlayer; accept logic "deciding whether to accept replicated list from: %s; ver: %u format: %u"/"replicating services from %s"/"Replicated list accepted"; zp-vs-rs compare {zpETag,rsETag,zpLUD,rsLUD,zpVer,rsVer}; "ServiceTypeList, adding built-in: %s"/"adding: %s; name: %s"; "Warning. No SD found for %d"; poll "next check for available services in %u s \[source=%s\]"; "Could not submit Available Services DIAG. Service count is: %zu"; checkForAvailableMusicServices job; "Not enough space to write full list"

- **name:** musicservices — available-services replication
<details><summary>Evidence (1)</summary>

- @ 0x10e76a94 — musicservices block

</details>

## `netif_monitor`

**coverage** `partial`

**Technical description:**

netlink {RTM_NEWLINK,RTM_GETLINK}; errors {read error,incorrect type,unexpected message %X}; selthrd.RIfAddressMonitor.{reset,data,except,timeout}

- **name:** RIfAddressMonitor — netlink ifaddr watch
<details><summary>Evidence (1)</summary>

- @ 0x10ee69ac — addrmon block

</details>

## `netstart_events`

**coverage** `partial`

**Technical description:**

events {netstartd hello,Setup start,Setup stop,Netstart is idle,Netstart alive,Netstart open,In setup mode,Netstart SSID set/clear,Netstart triggered upgrade (0x%x),Got connection type update \[%s\]}; WAC {/var/run/wac_mode,Unknown WAC mode %d,WAC mode disabled/enabled/timeout}; ForceShutdownOnNewSSID %d; shutdown {"Deferring shutdown, reason \[%d\]","deferring newHHID event","ignoring network bounce mid-shutdown",zpShutdown,/tmp/netstartd.pid}; IP-change {re-binding old->new,clearing link-local subscriptions on 169.254.* change,shutting down for new IP,newAddr event with same addr}; conn types {SonosNet (Ethernet),Home Theater 2.0,Home Theater (Ethernet),Home Theater,Ethernet (WiFi Disabled),Ethernet,SonosNet (wireless)}; events {newHHID,newSSID}; "%s: %s event resetting connection to mDNS"

- **name:** netstartd IPC event vocabulary + connection types
<details><summary>Evidence (1)</summary>

- @ 0x10f02798 — netstart block

</details>

## `noderx`

**coverage** `partial`

**Technical description:**

indices {ob=outputBuf,lr=lastRead,lcg=lastConsecutiveGood,lrx=lastRx}; flight rec " %u r:%d.%06d s:%c p:%d.%06d"; startup {"Starting up; id:%u, delayPkts:%u, delayFrms:%u","Startup large packet gap:%u, don't NACK",bFinalStartPacket,allowing NACK resend of LCG,ignoring discontig NACK resend,ignoring partial frames}; NACK "out of order packet; send nack immediately" + "NACKed for %u IDs, %u packets, ob/lr/lcg/lrx"; pause/resume {thread pausing/resuming, state validation p/sp/pr/ip}; frame layer {wFirstFrameOffset,wBytesOfDataLeftToRead,pwLen,Playtime} + errors {expected frame not found,frame length conflict,Packet stream framing error,frame too large,bufferNextProtocolFrame WOULDBLOCK/E_WOULDBLOCK,readNextDataBlock timeout,forcing decoder reset}; skipAhead entries {immed,shifted,released blocks,too many}; resync {"resynchronization flushing packets %u-%u",resynchronization message}; "Ignore packet with incorrect protocol version"; "Received dup packet id with different class"/oob/mismatch replace; "RX buffer full"/"RX discontig"; threads {noderx-data,noderx-pause,noderx.rxd.usleep,noderx.loc.usleep}; "failing noderx for io error (c=%u t=%lld)"

- **name:** noderx — inter-player RX transport
- **histogram:**
  - **rxPacketInfo:**
    - **NoneAvailable:** no DataBlock available
    - **TooOld:** expired packet received
    - **DupId:** duplicate packet ID received
    - **TooFarAhead:** packet too far into future
    - **NackReq:** NACK request transmitted
    - **Ignored:** packet ignored on startup
  - **gauges:**
    - **oldestBufferedPkt:** Oldest buffered packet ID
    - **lastReadPkt:** Last read packet ID
    - **lastConsecutiveGoodPkt:** Last good consecutive packet ID
<details><summary>Evidence (1)</summary>

- @ 0x10ecfae4 — noderx block

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

## `player_settings`

**coverage** `partial`

**Technical description:**

keys {volumeMode,monoMode,wifiDisable,meshDisable,wifiPowerSave,batteryUsagePolicy,bluetoothPolicy,networkingMode,lineIn,eq(treble/bass/loudness),gainTrimDB,zone attributes}; gates {"Device does not support fixed output","Satellites not supported; configure primary device","monoMode (not supported in setup)",wifiDisable {reason unknown,netstart refused,no Ethernet carrier},meshDisable (netstart refused),"EQ cannot be adjusted in PASS_THROUGH volume mode"}; error fmt "Unable to set setting(s): X (unsupported)"; settingsv2; gmSat/ukwnt/unhandled handlers

- **name:** PlayerSettingsManager — settingsv2
<details><summary>Evidence (1)</summary>

- @ 0x10ee5144 — playersettings block

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

## `psk_hierarchy`

**coverage** `partial`

**Technical description:**

PSKs {HhPsk (DTLS HH),ControlPsk,RoomEncPsk (room-name encrypt),LanSwapPsk} each +Backup mirror id; rotation {"Unable to generate new HH/control/room name encrypt/lan swap PSK","Unable to update settings with new PSKs","PSK rotation successful (HH: %s, Control: %s, RoomEnc: %s, LanSwap: %s)","Bumping netsettings version","not rotated"}; encoding {"Encoding SonosNet key failed","Encoding DTLS HH PSK failed"}; "Pending netsettings.json update discarded after replicating"; "Settings Replication changed SN Disable from %d to %d (source: %s)"; SSID protection {"SSID missing from known networks list","Registering for next topology update to protect SSID","Current SSID protected/already protected/not protected, could not get current SSID/missing from networks list","Not connected to a WiFi network, skipping SSID protection"}; "Received netsettings update from netstartd"/"netsettings changed"; app/run/nettestresult.txt

- **name:** 4-PSK household crypto hierarchy + rotation
<details><summary>Evidence (1)</summary>

- @ 0x10efadb8 — netsettings block

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

## `runtime_policy`

**coverage** `partial`

**Technical description:**

fields {"Business subscriber","Cloud Schedule","Effective P2P policy is encrypted","Guest Access Enabled","Unathenticated Control Enabled"(sic),"Insecure UPnP Allowed","Auth Pin Set","Thor Timeout"}; reeval on {"isBusinessSubscriber has changed","Line In policy has changed","Business Cloud Schedule has changed"}; settings keys {global,usageContext,BUSINESS,scheduledChangeValue,enableContentAccess,allowDirectControl,allowLineIn,allowAirplay}; "Failed to fetch latest entitlements \[ec=%s\]"

- **name:** runtime_zppolicy — effective policy surface
<details><summary>Evidence (1)</summary>

- @ 0x10e88dc4 — runtime_zppolicy block

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

## `share_indexer`

**coverage** `partial`

**Technical description:**

walk {open share path,read folder,entry %s,stat file} skips {.sparsebundle}; cancels {interrupted,recursion limit on share/at //%s,file error,share error}; files {Unplayable,Inaccessible}; shadow/shadow2 dirs + Remote/Local I/O error during %s; index %s/trackinfo + trackinfo.tmp + sorts sort-* + shareindex + "took %ldms to initialize indexes"; BBF fields {bbfTitle,bbfFile,bbfTracknum}; URIs {x-file-cifs://,x-rincon-playlist:}; res {x-rincon-playlist:*:*:*}; /getaa?u=%s&v=%u; r:displayTitle; sort orders {ITUNES,DEFAULT,PINYIN} + albumArtist/genre; itunes plist dedup "Skipping itplist with duplicate size and mtime"/"More than %d itplists"; .version fmt %s,%u; events {CdNotifyUpdateId,CdNotifyShareIx}; indexingTrack job

- **name:** shadowdir — share indexer + BBF index
- **status_schema:** <TrackSummary><Tables><Table name="Title" max count/></Tables><StoreSize><StoreUsed><EntriesSize><EntriesUsed><Conflicts></TrackSummary>
<details><summary>Evidence (1)</summary>

- @ 0x10e892a0 — shadowdir/indexer block

</details>

## `sharelist`

**coverage** `partial`

**Technical description:**

replication via %s/indexrepl + proposeUpdatedShareList + "remoteSettingIsBetter: us \[%s|%u\] vs them \[%s|%u\]"; ops {localAddShare,localRemoveShare,localRequestReindex,localRequestResort,localRemoveUnsupportedShares}; protocol gate {verified supported protocol→keep,else remove + count} + VerifiedValidProtocol flag; errors {share ID not found,path already exists,subsumed by existing share,Path is malformed,Access denied,Cannot exceed maximum shares,Mounting failed,Local index storage error,Remote file share error,Indexing canceled,connection failure,replication failed,replication skipped fmt mismatch}; reindex "request reindex (ad:%d sf:%d fr:%d si:%d st:%d lc:%s)" + "Turning resort request into full reindex" + "processing index complete (c:%d i:%d f:%d lc:%s)" + commit {m_bCommitted,m_bWait,m_bTerminate} + index recovery "recovered ix=%d with ver=%d"; R_BrowseByFolderSort + Tracknum sort

- **name:** sharelist — SMB share replication + index
<details><summary>Evidence (1)</summary>

- @ 0x10e89d48 — sharelist block

</details>

## `shoutcast`

**coverage** `partial`

**Technical description:**

headers {icy-name,location,CONTENT-TYPE,server,StreamTitle}; status accept {ICY 200,HTTP/1.0 200,HTTP/1.1 200,HTTP/1.0 30x,HTTP/1.1 30x} + redirect follow; Cougar server id; "Redirect audio/x-mpegurl to %s"; "request buffer is too small"; "add header \[%s : %s\]"; metadata text="…"

- **name:** shoutcastradio — ICY stream client
<details><summary>Evidence (1)</summary>

- @ 0x10ed462c — shoutcast block

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

## `sound_device`

**coverage** `partial`

**Technical description:**

syslib events {open,get_fd,poll,read,close} errors; LLA checks {DAC count,sample width inconsistency}; system/src_disable + StdQ ASRC Coeffs + "Running with SRC bypassed"; orientation sensing; "reset vcxo"; health flags {AMP_CURRENT_WARN,AMP_FAULT_WARN,AUDIO_WARN_TEMP,CPU_WARN_TEMP,CPU2_WARN_TEMP,SOC_WARN_TEMP,AMP_CURRENT_FAULT,AMP_FAULT,AUDIO_FAULT_TEMP,CPU_FAULT_TEMP,CPU2_FAULT_TEMP,SOC_FAULT_TEMP,PS36_FAULT,UV36_FAULT,UV14_FAULT,POWER_WARN_TEMP,POWER_FAULT_TEMP,MOTION_FAULT_TEMP,MOTION_WARN_TEMP}_STATUS

- **name:** sounddev — output device + HW health
<details><summary>Evidence (1)</summary>

- @ 0x10f2ac18 — sounddev block

</details>

## `sound_swap`

**coverage** `partial`

**Technical description:**

sound_swap/audio_swap; queue audioSwapEventQueue + progress audioSwapProgress; behaviors SWAP_BEHAVIOR_{DO_NOTHING,PUSH_SWAP,PULL_SWAP,UNDEFINED}; push/pull disband target|initiator group; HTSatelliteChecker gates (isFound,isHTSat,playerUDN,HTPrimaryUDN + topology/group-props/GC-AVT lookups); FSM "New state: %i"/"Event %i not handled in state %i"/transition-failure -> reset; result fields {swapResult,swapType,swapTarget,swapGC,initAction,candCount,respCount}; gates {bonded zone,HT Satellite,unknown state,unswappable audio,already in progress}; muse calls museCmdSetGroupMembers/museCmdModifyGroupMembers via groups/%s/groups/modifyGroupMembers

- **name:** SoundSwapController — audio-swap FSM (zpSwap)
<details><summary>Evidence (1)</summary>

- @ 0x10ed6b44 — sound swap region

</details>

## `spdif_detect`

**coverage** `partial`

**Technical description:**

detected {Dolby Digital,Dolby Digital Surround,Dolby Digital Plus,Dolby Atmos (DD+),Dolby TrueHD,Dolby Atmos (TrueHD),Dolby MAT,Dolby Atmos (MAT),DTS (Type1),DTS (Type2),DTS (Type3),NULL Burst,Pause Burst}; unsupported taxonomy {AC-3,SMPTE 338M v1-v5,MPEG1 Layer 1/2/3,MPEG2,MPEG2-AAC,MPEG2 Layer 1-3 LSF,DTS1-4,ATRAC,ATRAC 2/3,ATRAC X,WMA Professional,MPEG2 AAC LSF,MPEG4 AAC,Enhanced AC-3,MAT,MPEG4 ALS,Reserved 2-4,Extended Data,MPEG4 AAC LC in LATM/LOAS,MPEG4 HE AAC in LATM/LOAS,DRA,Unsupported}

- **name:** SPDIF IEC61937 burst-format detection
<details><summary>Evidence (1)</summary>

- @ 0x10ee650c — spdif fmt enum

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

## `svc_manifest`

**coverage** `partial`

**Technical description:**

svcmanifests.json {"manifests":\[…\]} + RCache + lastUpdateDevice; schema check "Unsupported schema version: actual: %u.%u, supported: %u.%u" + "Could not extract API header"; ops {deleteManifest(%u) b=%d,a=%d,removeManifest vb/va}; "%s downloading music service manifest from %s"; "replicating manifest file from %s"; "unsupported CQ REST version: %s"; "Added trailing slash"; svcmanifests thread

- **name:** svcmanifestfile — SMAPI manifest store
<details><summary>Evidence (1)</summary>

- @ 0x10e8a740 — svcmanifestfile block

</details>

## `telemetry`

**coverage** `partial`

**Technical description:**

PlayerButtons + TelemetryBasePlayer + TelemetryCategoryContext + telemetry tag; fields {event_id,event_name,event_schema_version,household_id,model_type,muse_household_id,serial_number,sonos_id,sw_build_type,sw_full_version,timestamp_utc,audio_type}; "PlayerButtons missing required field %s"

- **name:** telemetry — event schema
<details><summary>Evidence (1)</summary>

- @ 0x10ec7290 — telemetry block

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

## `thermal`

**coverage** `partial`

**Technical description:**

syslib thermal {open,get_temp,close} + "cpu:%d, amp:%d, soc:%d" + temperature_volume + ampstate + hardware fields; "Hardware %s; clamping volume to %d%%"; state transitions {Entering/Leaving hardware warning state,Entering/Leaving hardware fault state} + hw:st + "Warning/Fault Code(s):%s" + fullSync; satsw "Error %d from uploadSatSwitchTimeReport" + satSwitch; lmrep "Error %d from WifiFuncsGetLmChangeStats" + {lmChannel,lmNeighbor,roamEvent,beaconLostEvent}

- **name:** thermal monitor + HW fault state
- **status_schemas:**
  - **led:** <LedPatternInfo><LedPatternEntry time led_ids="%08x" repeats steps><LedStepEntry rgb="%06X" hold fade/></LedPatternEntry></LedPatternInfo>
  - **libs:** <ThirdPartyLibraryInfo><Library Name="Spotify eSDK"><Version/></Library></ThirdPartyLibraryInfo>
  - **roomcal:** <RoomCalibrationInfo><RoomCalibrationActiveState>Inactive\|…</><RoomCalibrationUserIntent/><RoomCalibrationAvailCalID/><RoomCalibrationOrientation/></RoomCalibrationInfo>
  - **faults:** <Faults Name="WarningsAndFaults"><FaultState><WarningState><LastBitmask><LastBitmask2></Faults>
<details><summary>Evidence (1)</summary>

- @ 0x10e98e30 — thermal/status blocks

</details>

## `tj_wakeup`

**coverage** `partial`

**Technical description:**

async wakeMissingPlayers {task,timer,request,retry TJ,cancel,failure} + "Unexpected WakeOnLANRequestEvent type" — WakeOnLAN; "Restoring AVT and track queue"/"Backing up track queue"/"Backing up AVT"; "Chirp setup failed - chirp sender does not exist"; "Setup volume not yet calibrated"; "Unable to play chirp"; refreshMdnsRegistration; /players/ api 1.1.0; settings {R_VolNormMode,R_CrossfadeDuration,R_AirplayIncludeLinked}; manual node engine ctor node version; spotmdns thread

- **name:** TJ — wake-missing-players + backup
<details><summary>Evidence (1)</summary>

- @ 0x10ecb048 — tj block

</details>

## `token_refresh`

**coverage** `partial`

**Technical description:**

threads {cqatrs_tx,cloudqueue_tr}; log "\[%s HTTP %d from %s%s\] %s"; states {"using token from file","requesting new token refresh sync","requesting token refresh sync %u %d -> %d","need to wait for token refresh","waiting for token refresh completion","waiting for refresh tx complete; current state %d","Attempting to refresh token (hrs=%d te=%d)","transition token refresh action %u %d -> %d","Token refresh succeeded. Beginning retry."}; errors {"last refresh token for load timed out","no last refresh token time","expected entry not found to complete tx","expected entry not found waiting for tx","Refresh token failed with upnp result: %d","Refresh token failed. Could not find SD, sid=%u","unexpected token action %d"}; keyed by acct. sn. %u

- **name:** OAuth token-refresh FSM
<details><summary>Evidence (1)</summary>

- @ 0x10ec236c — tokenrefresh block

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

## `trueplay`

**coverage** `partial`

**Technical description:**

config modes {button-notify,room_calibration-calibrate,speaker-detect,trueroom} + "configMode CountDown:%d"; eTag manifest /etags.txt matched against tone files {leader.ogg,testtone.ogg,complete_ht.ogg,inverter_*} at path %s/%s/%s/%s-%s under tones; fetch via players/%s/settings/player muse settings + forward; "eTag is matching a known file"; types {plug-in spectral,polarity}; params {tone_duration,force,v:%s t:%s}; "Sonar cal volume - using clipped volume %d instead of requested %d"; TP update "found TP version ... do update to v%s"; teardown {"Clearing Trueroom tone folder on JFFS","Error removing Trueplay asset dir"}; restore paths {common RC,original RC,TV Surround Level,enable sonar,set AVT,reset AVT,re-enable Trueplay}; "Trueroom config mode - Not restoring/restoring the AVT"; fields {HTBondedZoneCommitState,AvailableRoomCalibration,RoomCalibrationState,Orientation,LastChangedPlayState,AlexaCBLSupported,SupportsAudioIn,SupportsAudioClip,HtBondedZoneCommitUpdateEvt}; cm_button "pressed %s"

- **name:** trueplay_dp — sonar calibration engine
<details><summary>Evidence (1)</summary>

- @ 0x10ebd630 — trueplay_dp block

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

## `unlock`

**coverage** `partial`

**Technical description:**

flags {/tmp/device_unlocked_flag,/tmp/htdocs_locked,/opt/htdocs_locked}; flow {Fuse Value:,Challenge:} + form "Serial: %s / %s %s / POST {confirm textarea 11x80}"; responses {"DevUnlock Rebooting...",Success,Too Many Unlocks,Not Applicable}; muse op deviceUnlock; rate-limit "Too Many Unlocks"

- **name:** /devunlock + /mfgunlock + deviceUnlock
<details><summary>Evidence (1)</summary>

- @ 0x10efff88 — unlock block

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

## `user_update`

**coverage** `partial`

**Technical description:**

flow {"Running user-initiated HH update",no updates available,manifest download failed,no devices need updating,checkDevicesToUpdate failed,launchUpdate failed}; reports upgrade_mgr_user_report.json + _prev.json + /tmp/upgrade_mgr_info.txt; "report has more devices than the maximum ... omitted from the householdUpdateStatus event"; "Unknown upgrade client state"; "report consumed"/"Timed out polling"; app/run

- **name:** UserUpdateScheduler — user-initiated HH update
<details><summary>Evidence (1)</summary>

- @ 0x10e95664 — user_update block

</details>

## `vli_ctrl`

**coverage** `partial`

**Technical description:**

types {AirPlay,bluetooth/Bluetooth,tvproxy/TV Proxy} + "StartSession for unusable/unknown type"; scoped scopeVliCtrl/VliCtrlIx; protocolInfo x-sonos-vli:*:audio:*; cookie+fromSender tracking "%s:%d vliType %s cookie: %d"; "waiting for tx flags failed"/"completion signal timed out %#x %#x" + "timed out!!!!!!!"; "VLIGroupIDs cannot contain commas"

- **name:** VliCtrl — VLI transport ctrl interface
- **events:** `VliTransportAction(action)`, `AvtHaltActionEvent(action,vliType,cookie,fromSender)`, `AvtVliActionEvent`, `VolumeSetActionEvent(vol,mute,from_sonos,vligrouping)`, `GroupVolumeSetActionEvent(vol,mute,from_sonos,vligrouping)`, `VolumeChangedEvent(vli source,vol,mute,vligrouping)`, `VliPropertiesChangedEvent(name\|md\|mode,cookie)`
<details><summary>Evidence (1)</summary>

- @ 0x10ecc104 — VliCtrl block

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

## `zones_mgr`

**coverage** `partial`

**Technical description:**

events {ZoneMemberSettingsChangedEvt,ZonesDefinitionsChangedEvent}; muse ops {museGetZoneDefinition "found zone \[%s\]"}; transitions {"zone transition on secondary/primary: zoneId %s","zone transition failed on primary"}; cms (channel-map-set) {"cms init from %s","cms update from pri: %s","cms update from sec: %s = %s + %s","zoneDef %s inconsistent with cms %s","can't construct channelMapSet"}; file <File name="activeZones">; ops {adding/removing player,joinZone id+flatChannelMapSet,unjoinZone,activateZone,deactivateZone,updateActiveZone,sendUpdateZoneMemberSettingsCmd}; guards {"primary change not supported for HT","update with offline primary not supported for HT","update only allows add or remove, not both","can't update both name and channelMapSet","Zone contains incompatible protocol versions","zone is not active","zone id not found","zone def not found","invalid activeZone","invalid channelMapSet","invalid flatChannelMap","invalid zone name","invalid name:","no name","secondary not reachable","more zones active than RMuseActiveZoneList can hold"}; "Legacy zone exists on %s"; "primary unavailable: sending Remove ops to secondaries"; "re-activate the current zone"; "updating ActiveZone: %s -> %s"/"primary change: %s -> %s"/"offline primary: %s -> %s"

- **name:** RZonesManager — zone lifecycle FSM
<details><summary>Evidence (1)</summary>

- @ 0x10e95d24 — zones_mgr block

</details>

## `zones_storage`

**coverage** `partial`

**Technical description:**

zone defs {name,id,channelMapSet} + "reached maximum zone definitions"/"too many zones defined in the config file \[max=%d\]" + "zone def full: %s removed"; ops {create,update id,remove (active-guard "zone currently active")}; replication {"received replicated file","failed to rename offered replicated file","failed to load offered replicated file","ignoring replicated file: incompatible schema"}; JSON load errors {missing value,zones data array,root not object,incorrect schema \[%d != %d\],parsing offset,open errno} + RapidJSON vocab; gainTrimDB remote apply; forwarding {activateZone,updateActiveZone,joinZone,updateZoneMemberSettings cmd to %s} + "primary %s not found" + "output buffer full"

- **name:** zones_storage — zone-def persistence
<details><summary>Evidence (1)</summary>

- @ 0x10e96cd8 — zones_storage block

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
## `audio_in`

**coverage** `?`

- **ai_impl:** group model {addGroup coord,demoMode; "no room available for coordinator"; StopTransmissionToGroup by coord; "number of groups %zu remote %zu"}; URI x-rincon-stream:; encoding modes {UNCOMPRESSED,COMPRESSED,v-spdif} + "Running demo mode forcing uncompressed"; artfetch thread
## `autoplay`

**coverage** `?`

- **engine:** MpAutoPlay_: airplay {include zones,vol,useVol,includeZones}; AirplayIncludeGroupedEvt; AutoStop on unhandled URI; linein URIs object.item.audioItem.linein.{homeTheater,airplay,bluetooth}; "lonely local line-in autoplay %s"; failure modes "no autoplay target"/"couldn't determine coordinator"/"couldn't determine AVT control URI of coordinator"/"couldn't determine control URI of zone"; skip "invisible/node proto incompatible ZP"; "for controlURI \[%s\] for coordinator \[%s\]. programURI \[%s\]. %d - %d"; vliType-driven
## `av_transport`

**coverage** `?`

- **avt_jobs:** `ChangeTransportSettings`, `avt_play`, `onEvent`, `alarmDurationTimer`, `backupQueueCleanup`, `pollRadioShowMD`, `preemptiveAmp`
- **secondary_guards:** improper-call guards on secondary ZPs {"AVTransportURI cannot be set to non-group URI on secondary ZPs","BecomeCoordinatorOfStandaloneGroup improperly called on secondary ZP","BecomeGroupCoordinator improperly called","BecomeGroupCoordinatorAndSource improperly called"}
- **uris_ht:** x-sonos-htastream:%s HT audio stream + demo line-in uri + "Demo mode update available (%s)" + x-rincon-buzzer:1 custom alarm + x-rincon-stream:%s; spdif source
## `cert`

**coverage** `?`

- **metadata_errors:** devcertmgrprovider cert validation codes: BAD_FILE,BAD_KEY,BAD_CERT,BAD_ISSUE_DATE,MISMATCH_ENV,MISMATCH_ISSUER,MISMATCH_HHID,MISMATCH_USER,not_present; headers X-Sonos-UserId,X-Sonos-Muse-Household-Id,X-Sonos-Denylisted; response {requestTimeMS,downloadStatusCode,httpResultCode,previousETag,download,reasonCode,certError}; states downloaded/unchanged/generating; "Unknown cert metadata state: %s. Scheduling cert refresh job"; "Retrieved manufacturing data: %s"; refresh "%s: refresh check in %ld seconds"/"certificate expired"/"utc time not set"
## `cert_layer`

**coverage** `?`

- **files:** cert.xml + metadata.txt; "Buffer not sufficient to store entire certificate"; "loading %s (0x%x) took %ums"; tmpfile-rename atomic swap; "failed to load replacement (0x%x)"
## `chsnk`

**coverage** `?`

- **crossfade:** sample-level xfade: "attempting to crossfade with underflowed stream"/"recovered crossfade stream underflow"; int16 crossfade; "xfade corked stream: replace buffered data via non-xfade overlap"; "xfade timestamp too far in past, nst %d.%06d"; "xfadeable timestamp"; "set xfade lfnf"; volume-norm ramp insert "%d @time %d.%06d"; "xfade for %zu samples, %f seconds"; gap tracking "xfade gap, samples %zd"
- **metrics:** gauges {chsnkFillLevel="Amount of audio in stream buffer",largeSyncErrors="Playback (see sync) and downstream errors","Maximum sync mismatch with group coordinator","Amount of output committed to driver"} + {fillCodec,fillTimeMs,chsnkFill,chsnk-full}; window {windowPlayhead,includesBeginningOfQueue,includesEndOfQueue}; stream fmt {"header magic mismatch","md block loc","md header len mismatch","si pos mismatch","si read failed",fsAvail}
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

## `cloud`

**coverage** `?`

- **get_api:** callCloudGetAPI errors {openStream failed,HTTP not OK (%d),HTTP not OK response\[%s\],unexpected timeout rSz/cL,JSON parse failure \[sz,off\]}; SecureRegistrationChangeEvent + cloud_registration/CloudRegistration tags
- **headers:** outbound {X-Sonos-MS-Sig,X-Sonos-DeviceCert,X-Sonos-Context-TimeZone,X-Sonos-MAID,X-Sonos-Accept-Language,AUTHORIZATION,Bearer,X-Updated-Authorization,X-Goog-Updated-Authorization,Retry-After}; completeRefreshTxForAccount/waitForRefreshTxForAccount; "HTTP Header did not fit in char array"
- **ssl_cache:** ssl_client_cache page + "private, max-age=15780000" + "Skipping HH SSL cache refresh - device is not idle" + "SSL client cache refresh next run in %ld seconds"
## `cloud_registration`

**coverage** `?`

- **fsm:** cloudregistration.cxx: required fields {sonosId,householdLocationId,dhcpMac,ipAddr,museHHName} — "Missing required information: DHCP Server MAC (%s), Location ID (%s)" defers registration; triggers "Updating cloud registration due to '%s'"/MuseSessionId change/explicit request; "Caching muse cloud registration event %s"; "Network Hash \[%s\], Muse Household Id \[%s\]"; cloudRegPollWifiStation monitor job; R_HouseholdLocationID key
## `content_directory`

**coverage** `?`

- **container_classes:** browse classes {object.container.album.musicAlbum,.compilation,playlistContainer.sameArtist,playlistContainer,albumlist,person.musicArtist,genre.musicGenre,person.composer}; fields {dc:creator,upnp:albumArtURI}; category keys {ARTIST,ALBUMARTIST,ALBUM,GENRE,COMPOSER,TRACKS}; dirObjAttr; <AudioCore> page + OrientationChangeEvent
- **didl_objects:** res protocolInfo x-rincon-queue:*:*:*; rincon md ns usernameX/passwordX (SMB creds in metadata); SQ:%d; object types {dirObjShares,dirObjQueue,dirObjQueueQueue,dirObjSavedQueueTrack,dirObjSavedQueue,directory}; "cannot set queues (container size exceeded %d, already set %d)"; mntmgr "createObject: invalid share %s"
- **album_art:** fetch files {folder.jpg,Folder.jpg,folder.gif,Folder.gif} + WMP "%s/AlbumArt_{GUID}_Large.jpg"; image/jpg+image/gif; "image read failed (to=%d r=%zu tr=%zu)"; ID3v1 genre table present (Blues..Hard Rock standard list)
## `datatap`

**coverage** `?`

- **detail:** "Datatap snapshot failed after %zu" (snapshot bound); ZoneDevDiscThread
## `device_props`

**coverage** `?`

- **idle_shutdown:** idle events LineInStateChangedEvent/ReplicatedSettingsChangedEvent; vars {WirelessMode,ConnectionType,ChannelFreq,BehindWifiExtender,WifiEnabled,EthLink,SettingsReplicationState,SecureRegState,IsIdle,MoreInfo,RawBattPct,BattPct,BattChg,BattTmp,BtSrcName}; reasons {APICall,BluetoothConnection,PartnerDisappeared,Recovery,UserSuspend,UserShutdown,APIShutdown,CriticalShutdown,UnknownShutdown}; dpimpl/dpUpdateIdleState "idle state is %sidle, changing to %sidle"
- **enetport_schemas:** <EnetPorts><Port port="%d"><Link>%d</Link><Speed>%d%s</Speed></Port>; EthPrtStats {rxPackets,txPackets,rxBytes,txBytes,rxErrors,rxDropped,txDropped,multicasts,collisions}; EthIntrf {lngthErr,ovrFlwErr,crcErr,frmeErr,fifoErr,missedErr,RxDtlErr,abrtErr,crErr,hrtBeatErr,wndwErr,TxDtlErr}; /sys/class/net/eth0 + eth%u
- **fields2:** {oldAddr,newAddr,playingAudio,zoneRole,lineInBusy,ipAddrChange,network,PrimarySupportsFlexSurrounds}; soapaction + text/xml; charset="utf-8"
## `devmode`

**coverage** `?`

- **internals:** statement files {debug/devmode.bin,/devmode.bin,/tmp/devmode.tmp.bin} format "0x%s %d.%d-%d.%d" (id+version range); x-rincon-enc3 encryption; R_ALLOW_SSH_PUBKEY_INSTALL "may not be persisted" gate + "Removing persistent statement with R_ALLOW_SSH_PUBKEY_INSTALL" + "Loaded persistent statement"; notify {processes,listeners} on change
## `diagnostics`

**coverage** `?`

- **submission_fsm:** bounded queues {"submission queue full","result queue full"}; params includeControllers,initiatingDeviceId; states {pending on controllers,already in process,no devices submitted,successful}; zpDiagSubmit job + tracking + diag_mgr; completed{submissionId,status,diagnosticId}; blob wrapper <ZPNetworkInfo type="User"> + <!-- START UUID -->/END UUID per player + " unreachable"
- **manifest:** <DiagnosticManifest %s='%s' %s='%s'>2.0.0</DiagnosticManifest> posted to /v2/diags product-diagnostics; items {quarantined,secreg,swversion,ZPSupportInfo,ZPInfo,LocalUID,IPAddress,SoftwareVersion,QuarantineReason,StubReason}; initiate body {"serial_num":"%s"}; flow {initiate→distribute diagId to players→trigger on controllers→report submit status}; per-player files {%s.xml(ZPNetworkInfo),%s.sha256,%s.xml.gz}; aggregate via http://localhost:%u/support/aggregate?type=%s&f=%x&e=%x; stub flow {"Diagnostic stub","Local diagnostic","Failed to generate hash on Stubbed Support Document"}; "confirmation guid (%s) doesn't match actual guid (%s)"; progress {"Populated players ... Num players: %zu, Num stubbed players: %zu","Timed out waiting for devices","All devices reported"}; diag_progress thread
## `download_status`

**coverage** `confirmed`

**Technical description:**

{ERROR_NOT_CALLED,WRITE_ERROR,TRUNCATION_ERROR,SIZE_ERROR,FILE_ERROR,CONNECTION_ERROR,DOWNLOAD_SUCCEEDED,FILE_UNCHANGED,DOWNLOAD_IN_PROGRESS}

- **name:** file download result enum
<details><summary>Evidence (1)</summary>

- @ 0x10ee9a88 — download enum

</details>

## `dsp_params`

**coverage** `?`

- **pcm_decoder:** decoder_pcm guards {Invalid frame size,Unsupported input rate,Invalid number of input samples}; <DEC_SampleRate>; event-mgr {Add fd for object,Spurious Input Event 0x%x,Object %s was not formally released}
## `group_mgmt`

**coverage** `?`

- **ops:** {SetSourceAreaIds,pause,play,copyMusic(%s to %s),becomeStandalone(retry),joinGroup(%s to %s,retry),groupsCommand} + upnpError; topology guards {invalid topology state empty pid/gid,inconsistent topology state invalid gc or pid count}; music context {cannot be copied,cannot be swapped}; faults {Grouping action failed,Invalid grouping action,Invalid args,Action not authorized,Grouping action failed (default)} + groupId; cloning {clone music from %s to ungroupable %s,create new group and cloning from ungroupable player}; params {Effective set of players to group,Creating group with undefined future coordinator hint,playerIdsToRemove array,playerIdsToAdd array,Effective set of new group members}
## `htaudio`

**coverage** `?`

- **tv_session_fields:** `cid set/clr`, `corrId`, `sessionLength`, `sessionPlayTime`, `connectionType`, `GCUUID`, `GCBootSeq`, `GCTimeStart`, `GCTimeEnd`, `inputRate`, `dataBurstType`, `contentType`, `playSeconds`, `forced`, `topoType`, `zpHTInputSession`
- **core:** htcZonePlayer: per-role "%s delay: %uus, gain: %f" for surrounds/sub/group-member-down-mix; "changing surround mode. old %d new %d"; "changing tv surround lvl"/"changing music surround lvl"/"changing height channel lvl"; "sub changing %zu to %zu"; "Set %s signal rate: %zu"; events SatConfigEvent/TVSignalDetectedEvent/TOSLinkConnected/IRRepeaterState; "Orientation %s"
- **satellite_tx:**
  - **control_frame:** "sending control frame: ctrl 0x%x unscV %d curV %d extV %d extVM %d B %d T %d led %d SPL %d SC %d" — {ctrl flags, unscaled/current/ext volume, extV-muted, B, T, led, SPL, SC}
  - **audio_frame:** "pkt: %zu channels, %zu samples, payload:%zu, rl:%d" — multichannel framed audio; "Last audio frame %d"; "frame serialization failed"
  - **sat_mgmt:** "satellites active \[0x%x\]" mask; "bonded sub(s) %zu"; satellite sub receives non-sub channels; "Sonar center delay %d samples, %d usec"; play start/end handled with disabled sats; "changing surround time delta mode"; "sample type changed"; "Request resync"; volume/mute/LED propagation ("vol change %u (%u%%) -> %u","mute change %d -> %d","LED brightness %d -> %d"); "Send playback ended if count %d > 0 or remote audio disabled %d"
- **tx_stats:** counters {timeToPlay="Time between send and play",txSent="Total bytes transmitted",txErrors,serializationErrors,numLateFrames="late to transmit a frame","Total resynchronization frames",playbackEnd="Total playback ended frames",mx_proc="Highest SatMixer processing time",tx_proc="Highest SatTx processing time"} — "HT Audio Satellite TX General"
## `http_engine`

**coverage** `?`

- **auth_challenge:** two-step: "First Response: \[%s\] \[%s\] \[%08x\] \[%d\]"/"Second Response: ..."; headers X-Sonos-Mac/X-Sonos-Serial; cred body {"credentials":"%s","nonce":"%s","keyType":%d}; HTTP/1.{0,1} 401 retry; sonoscloudstatus endpoint; httpcaches.json + "\[%s\] Force-cleared cache"
- **hhsettings_api:** category REST paths public/{key}, restricted/{key}, restricted-admin/{key}; errors {Key not found,Failed to delete setting,invalid value size or type,HHSettingsMgr reported invalid value,Failed to store setting,"Deleting all settings in a category is not allowed. Provide a key.",Unsupported Request}; /overrideconfig POST form-urlenc → commit override file → <meta refresh url=/fcs>; JSON parser errors {Exceeded max depth,Invalid unicode escape,Invalid escape,Invalid string character,Invalid numeric character,Unexpected token,Sequence too long,Missing required value,Invalid value,Out Of Memory,Unexpected error}
- **cookies:** bounded cookie jar "Exceeded max cookie count of %d, overwriting cookie %d/%d" + Domain attr + "unable to send complete list of cookies"; UA strings {"Linux UPnP/1.0 Sonos/%s (%s)","Sonos/","PlayToSonos/"}; WD100 tag; MAC fmt variants {:,-,none,upper,lower}
- **session:** session state "Session status 0x%x connected %d wantWrite %d wantRead %d"; HTTP 206 partial-content accepted (range requests); "Remote close hostname %s FD %d"; SSL session cache "Cached SSL session for %s:%d"
## `lechmere`

**coverage** `?`

- **cloudrequest:** cloudrequest.cxx: ws endpoint /api/v1/websocket; per-msg-deflate toggled by cloudcfg ("per msg deflate change %d -> %d") w/ local-run-state override; "Player IP changed. Bouncing connection"; backoff "Following backoff schedule, retry in %lld"; msg types: SET_CONFIG (registration send/read), CHECK_CONFIG (registration return), TYPE EVENT ("Unexpected TYPE EVENT"), "support for HTTP message dropped", "Unrecognized message type"; poll loop crt.poll/CRT select failed/ppr read failed/failed to ping/"player request failed: %s"; SwitchingRadiosEvent; museCloudEvtHandler
## `mdns`

**coverage** `Failed to dump mDNS state into diagnostic: %i; /status/opt/log/mdnsd.log page + /opt/log/mdnsd.log file`

- **controller:** MdnsController ops {register service (twice-guard),unregister,update value (dup-guard),replace values}; failures {registration failure %i,TXTRecord populate %i,update unregistered}
## `mod_zp`

**coverage** `?`

- **detail:** mod_zp + mod_zp_aa album-art queue "queueing album art request %s %u %u %u"; timeout states {timeoutplaying,timeoutpaused}; headers {x-rincon-last-update-device,x-rincon-content-version,x-rincon-range}; "%s.tmp" staging + "Unable To File %s"/"Unable To Rename Temp EQ File"; "Forced GTK rekey"; button-forward errors {no handler,invalid method,No button handler unable to forward buttons,Feature not supported.}; build props {build.date,build.scm.version,/build.properties,legacyanacapad,hhSwgenState}
## `muse`

**coverage** `?`

- **auth_errors:** auth helper errors {"Player is not securely registered","Access token's user does not match registered user","Access token does not have adequate permissions","Command scopes could not be determined","Invalid user","Scope is insufficient","Error reading scopes","Error matching scopes"}; scopes {hh-config,hh-config-admin}; token fields {access_token,resource_owner,expires_in,time_since_created}; response {"Response code: %d, Access token is invalid"/"Scope is insufficient"}
- **service_bindings:** musezpactor UPnP service URIs {AlarmClock:1,AudioIn:1,ConnectionManager:1,MusicServices:1,SystemProperties:1,ZoneGroupTopology:1,HTControl:1,GroupManagement:1,GroupRenderingControl:1(urn:schemas-upnp-org) + Queue:1(urn:schemas-sonos-com),VirtualLineIn:1}; "zp already set"/"zp not set"
## `muse_engine`

**coverage** `?`

- **dispatch:** \[dispatch\] dispatched (%s) to target (%s), result \[%s\]; \[dispatch\] unsupported IBT command (%s); X-Sonos-Type header; group ops {\[group\] adding player,\[group\] forwarding player,\[group\] created new group \[%s, %s\],\[group\] created new group but no GC!,\[group\] no players or areas were specified}; validateProtocolVersionCompatibility + {has repeated player id,Grouping ungroupable player to other players is not supported,Effective player id set is empty,has too many player ids,contains invalid player ids,Protocol versions that do not match,protocol versions are incompatible}; audio proto {Audio TX,HT Audio,cannot evaluate audio protocol compatibility: type unknown,trying to compare unknown audio protocol type}
- **upnp_bridge:**
  - **pattern:** v1/players/{playerId}/upnp{Service}\[/subscription\[/{logicalSID}\]\] + v1/households/{householdId}/players/{playerId}/upnp{Service}\[/subscription\[/{logicalSID}\]\]
  - **bindings:** {playerId,upnpX,call} / {playerId,upnpX,subscribe} / {playerId,upnpX,renew,logicalSID} / {playerId,upnpX,unsubscribe,logicalSID}
  - **services:** `upnpDeviceProperties`, `upnpGroupManagement`, `upnpGroupRenderingControl`, `upnpHTControl`, `upnpMusicServices`, `upnpQueue`, `upnpRenderingControl`, `upnpSystemProperties`, `upnpVirtualLineIn`, `upnpZoneGroupTopology`
  - **vli_verbs:** `selectSource`, `startTransmission`, `stopTransmission`, `sendBackChannelCmd`
  - **evidence:**
    - type: firmware, status: confirmed, address: 0x10e8462c, notes: bridge bindings
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
## `network`

**coverage** `?`

- **netsettings_mgr:** file netsettings.json + HHSettings + schema upgrade; 4 PSK classes {HhPsk,ControlPsk,RoomEncPsk(room name encrypt),LanSwapPsk} each + Backup variant, rotation "PSK rotation successful (HH/Control/RoomEnc/LanSwap)" + version bump; encoding {SonosNet key,DTLS HH PSK}; netstartd push {netsettings,PSK,channel change "Pushed SonosNet channel change to %u for %u ms"}; SonosNet-disable test-mode auto-revert FSM {sn_en,sn_dis,sn_dis_test}: "schedule automatic revert in %d seconds"/"SonosNet was re-enabled"/"Disable succeeded (probably)"/"automatic revert failed!"; SSID protection "Registering for next topology update to protect SSID"; "Pending netsettings.json update discarded after replicating"
- **network_test:** networkTestMgr: nettestresult.txt; cycle {"waiting %d sec before disabling wifi","disabling wifi for %d sec","enabling wifi",connect-open,complete:%s} + abort paths
## `nodetx`

**coverage** `?`

- **ops_counters:** ops {schedResyncX,immedResync,schedResync,endTX}; ITBTT types {ITBTT_UNKNOWN,ITBTT_CHSRC,ITBTT_LINEIN,ITBTT_VLI}; crossfade state for packetId {lPacketNum-1/lPacketNum-2 fallback,no frames,crossfade on/off}; "checkAndMarkFrameDiscontinuity: %lldus"; "getLocationAtTime earlier than oldest valid packet"; NACK {"nack from %s count=%u, min=%u, max=%u","not transmitting %u stale packets","ignore NACK packet with incompatible protocol version"}; perf-counters {rsend=DataBlock sends,nackr=resync NACK,nackd=data NACK,nacku=unsendable NACK} + "Histogram of transmitted packet info"; params {transmit port,dstaddr unicast/multicast,lastpktid}
## `radiolog`

**coverage** `?`

- **detail:** flags {recurse,redir,unsupported}; rc_impl settingsWriteback
## `registration`

**coverage** `?`

- **secreg_fsm:** endpoints /product/v2/households/%s/players?action=refresh + ?action=complete&token=%s; FSM {registration during suspend,time expired,success,retrying at %ld,error,regStatus}; signing {"Invalid registration signing key in IPC payload","Registration signing key set/cleared"}; "Household customer ID \[%s\] in conflict with local device \[%s\]"; "regState changed %d -> %d"; "Transfer mode old (e:%d) new (e:%d)" + tjmgrExitSecureRegTransferState + newRegisteredCertSonosIDLocked; mutualssl/sslError/errno fields; "removed invalid cert"; "Unexpected 401 response"; secureRegTransfer/currentAccount; perf <PerformanceCounterTables> + persistentCache {lastUsed,expires}
## `registration_machine`

**coverage** `?`

- **name:** regdevicecert.cxx registration/secure-reg FSM
- **cloud_api:** `/product/v2/households/%s/players?action=refresh`, `/product/v2/households/%s/players?action=complete&token=%s`
- **fsm:** states regStatus + regState %d->%d; events registration during suspend\|time expired\|success\|error\|"retrying registration at time %ld"; secureRegTransfer tjmgr flow: exitSecRegTransferState scheduled/de-scheduled/run via tjmgrExitSecureRegTransferState; currentAccount
- **signing:** Registration signing key set/cleared via IPC payload ("Invalid registration signing key in IPC payload")
- **events:** NewCertRegistrationEvent inprocess-event {SonosID}; newRegisteredCertSonosIDLocked; RegisteredCertSonosID/RegisteredCustomerID keys; Household customer ID conflict/changed detection
## `rendering_control`

**coverage** `?`

- **volume_engine:** per-zone FSM: {override\|normal} volume + deferred volume/mute + ducking; math "DuckVol=%d (%d%% of %d = %d, offset %0.2fdB due to %d channels in zone)" + "Unbounded ExtSrcVol=%d ExtSrcVolMusic=%d (boosted %0.2f dB based on # of channels, plus surround lvl gain of %0.2f dB)"; audioSystemsTuning; persistentEQ.xml apply; DSPControlChProc/DSPControl
- **rc_impl_stp:** SetEQ action params {DesiredLoudness,DesiredBass,DesiredTreble,RampType} via RenderingControlSetEqActionEvent/RcSetEqActionEvt; VolumeSetActionEvent(vol,mute,ignoreProxy); primary-only gate "This command is allowed only on primary" + "Muse command forwarding failed"; volumeScalingFactor; RC propagation to {SUB,second SUB,SURROUND} (dual-sub support); signal-channel errors {invalid playId,failed to stop signal,incorrect playId,nothing is currently playing,couldn't create an audio stream,only one signal can run at any given time,invalid channel,disallowed by policy} + channelNumber
- **led_feedback:** button feedback {"in start music play feedback from 0x%x","led feedback for timeout waiting to start play/pause","waiting-to-play-music feedback:%d","waiting-to-pause-music feedback","unsupported/unhandled play feedback action:%d","cleared fast volume zero after %s","pause confirmed by PlaybackStateChangedEvent"}; LocalPlayURI errors {RC control URI,mute+volume state,restore default volume,set AVTransportURI,start playback,coordinator transport state}; PLAYING/TRANSITIONING states
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

## `smartplay`

**coverage** `?`

- **detail:** PlayerSmartPlay required fields (missing field %s err); {BUTTON,EMPTY_AVT} triggers; explicitContentFiltering via rsmapicontextzp; "loadContent took %ld ms: GroupId %s GC %s"; /bridge/content/api "service base path: %s" + getContent took/parse/failed + fetchContentAndStartPlay; "AVT URI is empty"/"AVT URI is a queue and is empty"; "Failed to get queue info via UPnP"; selfTruePlay; "Command not supported"; "allowMicrophone setting requires a microphone"; night/dialog/grouping-latency change fails; Backgrounds MSP add/remove (ret %u); shadrepl %s?id=%u
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
## `spotify`

**coverage** `?`

- **mdns:** _spotify-connect._tcp mDNS service; CPath sonos; "deregister skipped for empty SID"/"register skipped for non-empty SID: %s"
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
## `update_coordinator`

**coverage** `?`

- **begin:** beginUpdate {already started guard,updateHookJob,upgradeinfo,/var/run}; "Current Swgen Min downgrade version %s"; "Failed to query cloud settings"
## `upgrade`

**coverage** `?`

- **check_layer:** update-check client: "Fetching %s"/"Failure fetching (0x%x) (%d)"; fields {updateServerIP,httpResult,updateAutoCheckError,useCachedOnly,updateType}; headers X-Sonos-LatestSWGen: %u + Content-Location: %s; "Redirect detected, final URI: %s"; "UPM Invalid"; "Check for updates %s (%u)"/"Check for online update (user)"/"Unknown upgrade server state"; R_AvailableSoftwareUpdate sysprop; SWGen downgrade policy {downgradeMinVersion,downgradeRestrictions,allowDowngradeToPrevSWGen,denyDowngradeToPrevSwGenList}; "Invalid swgen member detected, swgen: 1"
## `upnp_eventing`

**coverage** `?`

- **renew_fsm:** events {"Unsubscribe in renew ... (oos:%d seq:%d)","Successfully renewed","Failed to renew ... HTTP Result: %d; SR: %08x","Subscribe ... Port: %u; Secure Eventing: %d (srRet=%d)","Successfully subscribed ... UDN %s","Received SID %s for deleted client","Received OOS %u / %u for SID %s" (out-of-seq tracking),"Not unsubscribing because bSendUnsubscribeRequest=false"}; /status/subrenew schema <Outgoing>{<LogicalSID>,<UPnPSID>,<EventURI>,<FailureCount>,<NextRenew>,<ExpectedSeq>}; secure-eventing flag on subscribe; thread subrenew_static
- **gates:** "Invalid transport: WSS is required"; "Invalid namespace: UPnP {subscribe,renew,unsubscribe} not supported"; "unexpected target id %d %s; overriding to: %s"; "Unable to retrieve the relative time."; "Rejecting unsupported replication request for %s"; "UPnP Eventing denied. 403 Forbidden returned."; Second-/%u SID form; sourceHasEventsToSend(%s) initial
## `virtual_linein`

**coverage** `?`

- **source_manager:** group hooks {\[groupAdded\] configureLocalTransport(VLI),\[groupRemoved\] configureLocalTransport(null),\[startLocalPBAsGM\]/\[stopLocalPBAsGM\] + proxyactive}; source lifecycle {register(vli type),suspend,resume,onSelect,deactivate(type,sender)}; "Recording State Snapshot in state %d"; "Starting vli audio input subsystem (type=%d)"/"ending vli ai subsystem (cached type=%d; new=%d)"; cookie validation {"validate cookie failed for \[%d\], \[%d\]","no source to validate cookie"}; ai_vli thread
## `vli`

**coverage** `?`

- **sink:** vlintxsink "VLI NodeTX Blocks": "lTransmitOffBox is now %d \[uni=%c\]"; "NodeTx configured to handle %s audio (qos: %d)"; "delay sending new frames until resend finishes"
- **ctrl:**
  - **callbacks:** `onVirtualLineInGetVolume`, `onVirtualLineInSessionStartInfoUpdated`, `onVirtualLineInStartSession`, `onVirtualLineInStopSession`, `onVirtualLineInSuspendSession`, `onPlaybackStateChanged`, `processSetVolume`, `onVirtualLineInNameChanged`, `onVirtualLineInMetaDataChanged`, `onVirtualLineInPlayModesChanged`
  - **events:** `VolumeSetActionEvent`, `VliVolumeProcessingCompleteEvent{vliType,success,flags}`, `VliSessionProcessingCompleteEvent{vliType,action,success,flags}`, `VliTransportAction`, `AvtHaltActionEvent`, `AvtVliActionEvent`, `GroupVolumeSetActionEvent`, `VolumeChangedEvent(vli source)`, `VliPropertiesChangedEvent{name,md,mode}`
  - **types:** `AirPlay`, `bluetooth/Bluetooth`, `tvproxy/TV Proxy`
  - **details:** cookie-based session tracking; waitOnTxBitFlagsClearedLocked; "StartSession for unusable/unknown type"; protocolInfo="x-sonos-vli:*:audio:*"; "VLIGroupIDs cannot contain commas"; completion-signal timeouts
## `wifi`

**coverage** `?`

- **idle_mgr:** RZPWifiIdleMgr/idlemgr: "Device set to %08x with primary chan %d code 0x%x cnt %u retry %u"; Set WifiFuncsSetIdleScan fronthaul result; reasons {AUDIO_OUT,AUDIO_IN,LOCAL_SONOSNET,NO_SONOSNET_PEERS,NO_PRIMARY,UPGRADING,HT_SWAP,UNKNOWN_ID}; WiFiIdleScanUpdateRetry; "client %s is %s with primary chan %d"
- **assoc_tracker:** CrAssoc report "Reporting CrAssoc event for %s"; metrics {mstime1/2,msnum,arpscstime,arpatt,arpscs,arpsnum,ddtime1/2,ddnum,zstime1/2,zsnum,zntime1/2,znnum,znscs,znstate}; ARP stuffing "Stuffing %s MAC to ARP table" + "ARP stuffing records are full" for associating controller; "ZGT Notification to %s is invalid event"
- **netif_poll:** DeviceNetInterfaceStateEvent + "fire event: health %s rssi %d"/"status: health %s rssi %d"; subscribe/unsubscribe polling per %s; "timeout: %s polling"
## `zone_topology`

**coverage** `?`

- **topology_base:**
  - **quarantine:** discovery quarantine {quarantinedCount,latestPlayerWithQuarantineEvent,stabilizationTime,latestDownloadErrorCode,latestDownloadErrorReason,quarantining}; "Report player missed by %s"/missedBy/missedPlayer; quarantineRecheck job; "Player %s removed from quarantine"
  - **wow:** satellite wake: "\[%s\] %s WoW magic packet for MAC %02X.."; "Attempted to wake %zu missing secondary ZP of primary %s (sent WoW to %zu)" — bonded secondary WoW
  - **vanish_fsm:** states {active→vanished} with {byebye reason,reasonforvanish,vanishbatterypercentage,vanishbatterytemperature,timesincevanish}; "Broadcasted unresponsive device %s"; "Received 'Remove' message pointing to local device"; "VerifyThenRemoveSystemwide: Not removing, %s is present"; removeknown/hwver actions; "device %s removed from vanished list after factory reset"
  - **discovery:** handleNewOrUpdatedZP "%s found %s at %s; age: %d; addr: %s; host: %s; proxy: %s; ports={%u-%u}"; IP-change detect "ZP (%s) changed IP address from %s to %s"; link-local 169.254 guards; "Updated network hash: \[%s\] => \[%s\]"; "new bootseq"; "%s ZP %s (bootseq %u)"; X-Sonos-LatestSWGen + Content-Location headers; "Faking device %s (%s) props to be %s gc"; designated {PlayerDesignatedDevice missing required field %s}; "All devices idle for %ld s"; topmon thread
- **discovered_zp_cache:** RDiscoveredZP/RDiscoveredZPs/RVanishedZPs replicated objects: "Updating RDiscoveredZP - current group %s - previous group %s"; "applying cached changes 0x%x on top of 0x%x"; "RDiscoveredZP is not yet valid, caching SID %s change map: 0x%x" (subscription change-map cache); "Got GM info for %s (%s, %s) in group %s (%s)"; device-desc dd_{mhh,sn,md,bld,in_hh,in_ver} + isHtap:%d; version-gated eventing "DiscoveredZP version=%u.%u.%u, using %s eventing" (secure\|insecure); "got discovery packet from another subnet -- mask: %x"; "detected/un-detected 3rd party extender: %s != %s"; vanish reasons {LOW BATTERY,EXPIRED} + " (wakeable)"
- **ht_satellite_ops:**
  - **add:** AddHTSatellite: precheck {"unable to become satellite, device has satellites","Primary device %s is not found","incompatible primary device %s"}; "Change from ZP to Sat mode. Map: %s"; clears SOURCE+local sonar config; sendGroupAddHTSatelliteCmd via DeviceProperties:1; joinZone cmd; "HT Zone setup (%u) via %s took %ld ms"; sat-state sync "upd \[%zu\], remote uuid: %s, remote state: %d"/"chk \[%zu\] ... my state %d"/"players ready: %d, map size: %d"; netstartd notify; "Push satellite state to UUID %s"
  - **remove:** RemoveHTSatellite: clears RoomCalibration on satellite (per-sat + SATELLITE-of-SUB paths) + local sonar; "Change from Sat map %s to Sat map %s"/"Change from Sat to ZP mode"; "RemoveHTSat: error %d sending to Sat"; "HT Sat %s removal (%u) via %s took %ld ms"
  - **reconnect:** reconnectHTSatellites {master,oldmap,failmap,recoverSat,recovery,satellite roles}: "reconnected Sat %s"/"retry in 10 secs as topology hasn't settled"/"removing Sat"/"separating from HT primary"; restarts on ZP↔Sat transitions
  - **bonded:** AddBondedZone: EnterConfigMode→satellites→joinZone→ExitConfigMode + unlink failure "Unable to unlink secondary"; RemoveBondedZones: "Stop topology monitor: zone teardown" + "Zone teardown (%u) via %s took %ld ms"; setAVTransportURIOnSecondaries + "Pushing bonded zone state to secondaries failed"
- **bonded_recovery:** recoverBondedZone: consist checks {"(Secondary doesn't see same topology)","(all members present)","(member missing)"}; granularities {full state,EQ only}; FSM {"retrying as topology hasn't settled (ct=%u)","successful %s; %s sent to secondaries","partner is incompatible","hard failure: %d","separating this player from bonded zone","reducing bonded zone to %s"}; roles {isPrimary,availmap,newmap,othermap}; orphan regroup {"regrouping with orphaned secondary","Delegating coordination to self"}; unstick/restick sonar clears; telemetry bondedZoneChange {trigger,opDurationMs,bondDurationS,usedMuseAPI,prevChannelMapSet,prevPrimary,wasPrimary}
- **event_vocabulary:** `TopologyEventsReportEvent`, `TopologyGroupMemberRemovedEvent`, `InfoUpdatedEvent`, `ActiveZonesChangedEvent`, `RemoteConnectionTypeChangedEvent`, `GroupChangedEvent`, `VliTransportActionEvent`, `NewZPEvent`, `ReplicatedSettingsNeedsUpdateEvent`, `MissingBondedZoneMemberDetectedEvent`, `AVTStateLastChangedEvent`, `RemoteHTSwapStateChangedEvent`, `DeviceGoneEvt`, `GroupAdvertiseRequestEvent`, `DesignatedDeviceChangedEvent`, `Account changed event`, `ThirdPartyMediaServersX`, `AlarmRunSequence`
- **iface_ops:** `setLocalSonarCalibrationID`, `informLocalNewSourceAreaIds`, `getGroupMembersWithDifferentVirtualLineInGroupID`, `getLocalOrientation`, `setLocalSonarState`, `internalPopulateSonarZoneDescription`, `isBondedZoneConsistent`, `ifBondedZoneGetNextUUID`, `ifBondedZoneGetNextUUIDInTopology`, `ifBondedZoneGetPartnerUUIDInTopology`, `getLocalChannelName`, `hasSurrounds`, `sonarZoneAgreesOnCalibration`, `informLocalVoiceStateChange`, `informLocalMicStateChange`, `informLocalTVConfigStateChange`, `informLocalAirPlay`, `informLocalOrientation`, `setLocalTransportStateChanged`, `informLocalPlayerZPChange`
- **zp_events:** `LocalIpChangedEvent`, `RequestTVTransitionEvent`, `WakeOnLANRequestEvent`, `PortableWifiReconnectEvent`, `PlaybackCorrelationEvt`, `HouseholdSettingsChangeEvent`, `TVInputSelectedEvent`, `ZonePlayerConfigurationEvent`, `SystemPropertiesChangeEvent`, `CloudConnectionChangedEvent`, `NewCertRegistrationEvent`, `RegCertUpdateEvent`, `VoiceAccountTransactionEvent`, `SecureRegistrationStateUpdateEvent`, `PlaybackStateChangedEvent`, `RemoteHTSwapStateChangedEvent(source,swap active,are we satellite)`
