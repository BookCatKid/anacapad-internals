# Non-SOAP subsystems

Self-contained protocols/engines living in the same binary beside or below the UPnP layer. `absent` = no coverage, `vocab` = names/strings catalogued but semantics undecoded, `partial` = some real documentation exists. Evidence addresses are the rodata anchor strings.

| Subsystem | Coverage | Summary |
|---|---|---|
| `ab_experiments` | **partial** | production A/B experiment framework: a /experiments local endpoint plus a replicated <ZoneExperiments> store of <ZoneExperiment id name value defaultValue> rows; presence gated by featureConfigZoneExperiment; values influence runtime policy |
| `abr_engine` | **partial** | DS (data-source) selection FSM {"Unable to select another DS","waiting to fetch new playlist","fetching new playlist now"}; playlist failures {"Timed out looking for playlist","no time to recover (%ld buffer)","Too many empty playlists and no audio left/(still %ldms ahead)","Switching source due to empty playlists"}; notifyFrame ty:%d ln:%zu so:%zu ns:%zu f:%u ctx:%u:%u:%llu; getContentKey; fetch "open: %s (0x%x) %d len %llu offset %llu"/"redirect: %s -> %s"/"Segment's content type"/"Using file ext."; "URIs for %g seconds, wake up in %d"; "prebuffering %u bytes within %ld msec"; "start new stream for URI \[%s\], resumeLoc %zu time offset"; "Reset ABR state: start bitrate %u"/"Last estimated bitrate %u"; rate model "rate: SR=%.03lf (%zu) S=%d Sth=%d BL=%.0lf" + "rate(%7d): %.2lf/%.2lf SA=%.2lf b=%u/%u B=%u/%u/%u h=%d/%d r=%.2lf a=%.2lf" + happy metrics {"happy (a > %.2lf)","happy (saturated)","rate update: a=1","was happy","unhappy",Underruns}; InitFramerForTrackList-fail source switch; codec mp4a.40.*; URI version regex /v\[0-9\]+\.\[0-9\]+(\.\[0-9\]+)?(-\[a-zA-Z\]+)?(\+\[a-zA-Z.\]+)?(\[?#/\]\|$) |
| `account_cert_lifecycle` | **partial** | three cert managers (certmanager/devicecertmanager/regdevicecert) over four keycert identities; the registration cert carries the device's SonosID and is required for token generation ('sr: reg cert not available; cannot generate token'); a /regcert status endpoint exposes DeviceCertInfo XML; root-of-trust bundles are fetched from /certbundles/v4/trusted_roots.rcb with ETag caching and retry backoff |
| `account_migration` | **partial** | OAuthMigration flow {reauth,token generation,getAuthTokenResult,accountToOAuthResult}: "migrated account to OAuth, type:%u, sn: %u" + retry {res,retry count,"delay migration until cloud connection","expected ouath account; reset to retry migration"}; "failed to replace email with username for last.fm"; sonos-radio gate {"no SBiz entitlement; preinstalling Sonos Radio","found SBiz entitlement; blocking preinstall"} + "stale entitlements; scheduling job to refresh"; preinstall SID=%u attempts; SA_RINCON65031_ service-account prefix; settings {R_HideTuneIn,R_MigratedTuneIn}; maintenance {"failed to download manifest file for account sid/sn","received empty hash","failed to update userInfo and clean up user hash","Failed to getUserInfo during SvcMaintenance","failed to migrate built-in accounts","failed to migrate pre cloud replication accounts"} |
| `addrmon` | **partial** | RTM_NEWLINK/RTM_GETLINK via netlink; {"read error %d %s","incorrect type","unexpected message %X"}; select events selthrd.RIfAddressMonitor.{reset,data,except,timeout} |
| `aha_ops` | **partial** | ops {AHA_STOP,AHA_RESTORE,AHA_END_VLI_SESSION,AHA_SUSPEND_VLI_SESSION,AHA_PAUSE_VLI_SESSION}; "failed to gen group byebye headers" + groupAdvertise_; RChannelLogger; "%d seconds on account %d/%u"; "Recorded sync error on account %u/%u"; sources {"Source set to %d - %s",Compressed Line-In,Uncompressed Line-In,Compressed Dock,Uncompressed Dock,Coordinator Local Library} |
| `arp_assoc` | **partial** | arpchecker "ARP failure: %d consecutive attempts for %s failed: groupcast problem suspected" + "ARP to %s resolved after %d failures" + source_ip/msreplyfailure; arping {async,sync} "started for %s, every %u ms for %u ms" + reset-on-data + timeout adjust + "pending reset in progress" guard; assoctracker CrAssoc metrics {mstime1,mstime2,msnum,arpscstime,arpatt,arpscs,arpsnum,ddtime1,ddtime2,ddnum} + "Skip reporting invalid CrAssoc event" |
| `audio_clip` | **partial** | muse routes players/%s/audioClip + groups/%s/playback/%s + "forward to %s"; clip object type audioClip; fields {priority,clipType,clipLEDBehavior,clipBehavior,buzzers}; buzzer clips file://%s/buzzers/%d.mp3 + %u:%c; custom requires streamUrl "Missing streamUrl (required for custom clip type)"; httpAuthorization → "Secure streamUrl required when providing httpAuthorization"; delivery {Using AVT,Using External Audio Source}; priority "Cannot interrupt current clip due to priority policies"; pause content first "Failed to pause content because group info could not be retrieved for UUID=%s, ZoneGroupID=%s"; errors {Invalid clip type,Invalid clip id,Clip id not found,Error starting audio clip,failed getting audio clip response,"unexpected object type %s, expecting audioClip"}; resume content after |
| `audio_decoder` | **partial** | status <SampleRate><SampleBitDepth><NumChannels><ChannelMap><FrameSize>; lifecycle {decoder create/init,header,seek tvResume=%ld.%ld,"seeking to absolute position = (%llu / %llu)","capping aboslute seek position",scan,get pos}; errors {decode err skip/pos/flush/set pos,too many errors,no progress(eof,o),open failed,streaming hint failed,read out of accum space,read eof,reached expected eof pos,seek failed,len failed}; unsupported {too many samples,channels,bit depth}; REPLAYGAIN_TRACK_GAIN= + gain=%f; ogg errors {seek,bailed out,no mem,no init}; ffmpeg/WMA: wmaSeekPacket offset bound; AVFormatContext alloc/open; stream-info/audio-stream find; resume loc byte→time fallback "Resume location %zu exceeds file size %zu, falling back to time-based seek"; "Seeking to position %zu"/"Seeking to time: %lld microseconds"; "Stream duration: %zu milliseconds"/"File size: %zu bytes"/"Estimated offset %zu exceeds file size"; attached-picture extract image/jpeg; libavformat metadata album_artist; codec ctx {not found id,alloc,params,open,pAVPacket/pAVFrame}; frames {send/recv errors,send result status eof}; payload bounds {Extradata too large,Codec params size,Packet size too large,Codec params too large for cache,Packet too large for cached payload}; "no client, ptvResume, fileURI, or uri opener provided, we won't continue" |
| `audio_decoders` | **partial** | vorbis errors {vorbis_synthesis_pcmout produced null PCM data,failed to initialize vorbis given config data,neither config nor music data,no samples produced,insufficient bytes,decoding failed,vorbis_synthesis_read failed}; status XML <SampleRate><FrameSize><NumChannels><ChanMap>%s (%s)</ChanMap>; AAC: "DisableAacPlus StreamType=%d, aacPlusUpsamplingFactor=%d", errors {can't initialize decoder library,Unable to decode init frame,unknown AAC format,Invalid sample rate idx,Frame Paddling Len = %d numChannels = %d sampleRateIx %d obj %d,Explicitly expressed samplerate not supported,Failed to get the extension sampling freq idx}; XML {DEC_AACDecoder,DEC_InputChanCount,DEC_OutputChanCount,DEC_BitRate,DEC_FrameSize,DEC_AudioObjectType}; AOT enum {AAC-LC,HE-AAC,ER-AAC-LC,ER-AAC-SCAL - Decoding base layer only,ER-BSAC,ER-AAC-LD,HE-AAC v2,ER_AAC_ELD,xHE-AAC} |
| `audio_fifo` | **partial** | records with {pos,range}; writes {"Advance write to next record","Rejecting write, as provided offset %zu != %zu (pending)","not enough fifo records","truncated write","Audio fifo records reset"}; discontinuity {"Discontinuity @ offset %zu in record %zu (expecting: %zu)","*** Too many discontinuities"}; reads {"Consumed contiguous samples (%zu - %zu)","Advance read to next contiguous record","Read %zu bytes from record","No bytes to read from fifo... EOF","audio fifo read at boundary eof","consumed exactly to the eof marker","reached logical boundary","already has pending offset"}; prebuffer {"prebuffering... (used/prebuffer)","Waited %ums for audio from the eSDK","Finished prebuffering in %u ms (st,flush)","prebuffering elapsed %u ms (used/free)","exit waiting for audio, not rendering"} — Spotify eSDK feed |
| `audio_rate_ctrl` | **partial** | ARC: setCoefficients StdQ ASRC; guards {adjust rate of 0,unsupported channels,Unsupported Input Audio/Line Rate,Over Excursion error,sample rate converter error read}; reconfig on rate/channel-count/line-rate change; timesync: databurst LockTime, "Rate Maxed"/"Rate Inv Maxed" rails m_dOverallRate/m_dIntegratedRate, iter dump {LE,LEP,IC,ICP,IL,RT,err,errf,dOut,dIn,AP,RL}; "time went back; try again"; "Thread descheduled for %uus. Limit %uus"; SRC mute on \|drift\| "(Should) Mute SRC. dAbsoluteError = %f, current canonical rate = %u"; "Out of bounds. drift: %f mute count: %d" |
| `audio_stream_mixer` | **partial** | stream ops {start buffering,set presentation time,resync,drain flag,skipAhead} + stats "E:%d, D:%d, B:%d, PR:%d"; fade engine "fade added: %i.%i sample_len(%u) current_gain target_gain rate" + max/min/fade complete + "no fade slots available"; skipAhead "delta:%u > buffered:%u"; "discontinuity detected after scheduled resync"; mixer: bManageOutputLatency,startup buffers,buffers; fd poll sound.fd.poll.%04X; stall detect "loop(wall): %uus loop(cpu): %uus, sel: %uus"; states MTS_PLAYING transition; DSP drain FSM {"start dsp flushing %i buffers","dsp flushing ended %i frames early","driver draining","dsp flushing complete with od %u"}; stream names as-{dspin,dspout}{-tv,-ext-voice,-ext-chirp}/as-src{in,out}-ext-voice/%s-chsnk%zu; system/audio_out_disable + "Running with audio output disabled"; forcePerfectInitialSync; "KERNEL_PRINTK_ENABLE ... mixer scheduling can't be guaranteed"; "Testpoint delay of %ums" |
| `audio_tap` | **partial** | errors {no tap specified,syntax error,invalid request,permission denied} + audio/wav; mic gate "allowed %d mic %d"; taps {linein,codecout,irdecoder,mixersat,mixergm,as-srcin-chsnk0,as-srcout-chsnk0,mixerstats,dspout,formatter,llaout,mixerout,mzdsp,extvoice,extchirp}; spdiftap.compressed + "Internal SPDIF Tap Snapshotted. Tap must be uncompressed before use!"; sonos-dspid header |
| `audio_taps` | **partial** | PCM-capture tap subsystem (audiotap_manager.cxx + datatap.cxx): guarded /audio_tap /spdiftap /snapshotspdiftap /downloadspdiftap endpoints, versioned tap-file format with audio+metadata sections, SPDIF tap used to sync TV-input playback against the output tap; tap instances are typed rolling_data_tap objects; 'Datatap snapshot failed after %zu' + 'Error: failed to read metadata from buffer!' |
| `audioin_groups` | **partial** | groups keyed by coordinator {'Removing group with coord %s','Adding group with coord %s demoMode %d','addGroup: coordinator %s already added','addGroup: no room available for coordinator %s','added %s number of groups %zu remote %zu','removed %s remaining number of groups %zu remote %zu',"StopTransmissionToGroup: couldn't find coordinator %s"}; URI x-rincon-stream:; formats {UNCOMPRESSED,COMPRESSED,v-spdif} + 'Running demo mode forcing uncompressed' |
| `audiotap_manager` | **partial** | raudiotapMutex; "failed to setup async request %d %s"; "can't consume from a closed request"; audiotap.poll; "failed write %d %s" |
| `authz` | **partial** | policies {"Static policy not found for role (%s), version (%s)","Static fast policy not found","Not in offline mode","Using guest policy for offline mode","Using mTLS policy","Using guest policy"}; token ops {"Failed to get the permissions: http=%d","Failed to parse getPermissions response","Failed to resolve token \[token=******%s\]: http=%d" (masked),"Failed to parse token response","Request to resolveToken successful \[token=******%s\]"}; cache {cache-control-header,responseResolveToken,museAuthzCache,InMemoryHttpCacheMutex,"Policy mapping retrieved from cache"}; guards {"Credential is not allowed","Guest access disallowed","Unauthenticated control disallowed"} |
| `auto_update` | **partial** | states {ST_UNDEFINED,ST_INIT,ST_REFRESH,ST_SCHEDULED,ST_SCHEDULED_POST_WOW,ST_SESSION_MONITOR,ST_SESSION_REPORT,ST_SESSION_ACTIVE} + PendingStart/SessionStart/SessionStartLocal/SessionAttempts counters; settings {R_AutoUpdateWindowStart,R_AutoUpdatePolicy,R_CheckUpdateInterval}; blockers {"Upcoming alarm is preventing update","Active device(s) preventing update"}; "Trimming the window to (%d) seconds"/shrinkWindow; upgrade_mgr_report.json {pendingUpdateHours,numUpdateAttempts,startTime,elapsedSeconds,blockedUpdateReason,updateHHStatus,serverIP,errorMsg,extendedError,zoneType,startVersion,targetVersion,hardwareVersion,serialNumber,updateZPResult,numZPsInHH,numZPsInHHDelta,numZPsToUpdate,numZPsDropped,targetSystemVersion,updateHHResult,numFailedZPs,numZPsWithError}; "RINCON_%s01400 updated to %s"/"update failed (%d)"; "Retrying upgrade (%d/%d)..."/"Giving up after max upgrade attempts"; upgrade_mgr.txt state file |
| `bandwidth_meter` | **partial** | {"BANDWIDTH: %u B / %u ms = %u B/s = %u kbit/s","Bandwidth not calculated, latency zero","WINDOW BANDWIDTH: %u B / %u ms = %u kbit/s, high=%d, low=%d","LOW BW (kbit/s): %u < %u, count = %u","Bandwidth window not updated, latency zero"}; asserts {first_chunk_request_time not set,latest_chunk_finished_time not set,finished_time >= stats->first_chunk_request_time} |
| `boot_sequence` | **partial** | "updating boot sequence due to wifi connection event"; settings {TargetRoomName,LocalAccountTransferMode,ForceWifiDisable,ForceMeshDisable,SonosNetDisable,WEPKey} |
| `browse_prefixes` | **partial** | {newrelease:album:genre:,staffpick:album:genre:,top:album:genre:,top:track:genre:,playlist:,%s.#%s,favorite:track,artist_tracks:} + urn:schemas-rinconnetworks-com:metadata-1-0/\|total |
| `bt_sbc` | **partial** | params "freq=%u blks=%u sb=%u mode=%u alloc=%u bitpool=%u end=%u fin=%zu fout=%zu frames=%zu"; errors {Invalid packet header,Failed to parse %zd,Truncated packet. Lost frames,Invalid packet,frame size changed %zu->%zu,decoder error %zd on frame %zu,Bad SBC frame %zu read/decoded,NOTIFYFRAME_ERR_BUFFERING,unknown frame status} |
| `business_msp` | **partial** | Sonos-for-Business managed-service machinery: SOAP ops AddRemoveSonosBusinessMSP / Sync Sonos Business MSP / AddRemoveSfbMSP, /msprox + /msprox?uuid= proxy endpoints, three tier vocabulary (SFB_COMMERCIAL/ESSENTIALS/PREMIUM_MSP + commercial/essentials/premium-msp slugs), Backgrounds MSP add/remove, enableRemoveMSPCredentialsFromUPnP flag, voice-service MSP education keys (O_AMAZON/GOOGLE_SHOW_MSP_EDUCATION) |
| `buttons_ir` | **partial** | button + IR input pipeline: hw-message BUTTON multicast group carries events, longpress.cxx handles holds, events forward to the group coordinator ('Forwarding button events'), /button_triggered\[.xml\] diagnostic capture, /rdmbuttonfwd retail hook, virtualRemoteControl/buttonCommand muse route injects button presses from the cloud; irdecoder.cxx learns TV-remote codes against the ir.ws.sonos.com database |
| `capability_guards` | **partial** | "Supported only for devices that support power over ethernet and have ethernet support"; "Supported only for devices with a water sensor"; "Supported only on devices with a microphone switch"; "Device is not a subwoofer"; "Supported only on suspendable devices" + {requiredMinimumBatteryPercentage,requiredMaximumBatteryPercentage,durationSeconds}; "Supported only on devices with a battery"; "Supported only on devices with bluetooth" + "Unable to set bluetooth pairing, unsupported"; "target is not a home theater source"/"target does not support HDMI CEC" + tvPowerState; "Setting is not valid" |
| `catalog_translate` | **partial** | translateId(%s,%s,%s) with missing-param errors {objectId,serviceId,targetObjectId}; cloud GET catalog/id/%s?destinationServiceId=%s + targetSid; caching {"retrieved translation from cache","translation not cached; connecting to translation service","translateId response: %d %s","saved translation to cache"}; catalogSvcMgr |
| `cec_diagnostics` | **partial** | {tvCECStatus,tvPowerStatus,deviceCEC,stateSAM,errorSAM,stateARC,errorARC,errorTV,eARCActive,testAudio,testVideo} |
| `cert_files` | **partial** | "%s/%s.%s"; keys {encrypted-private-key,expiration,encryption-key-type,sonos-key-and-cert}; "failed to retrieve key" |
| `chanmapset` | **partial** | chanmapset var; 'Initializer List is too large: %d > %d, truncating to %d'; 'Duplicate entry: %s at index %zu and %zu'; awThreadWDCheck watchdog |
| `chirp` | **partial** | profile sonos-cdma; decode pipeline {chirp_decoder_t,chirp_cdma_decoder_t,chirp_cdma_match_t,chirp_note_estimate_t(u16),chirp_peaks_t/chirp_peak_t,chirp_scorer_t(u64),chirp_voter_t}; encode {chirp_cdma_encoder_t,chirp_codebook_t(u8*),chirp_rms_t,chirp_decorator_t}; fft {chirp_maths_fft_init/deinit,double}; errors {"No frames selected to decode (is sustain period too short?)","payload contains unknown symbols","Preamble payload has too few symbols ... TODO: #741","Payload does not support symbol sizes beyond 64-bit","Preamble code is outside of symbol range","corrupt_random_symbols","symbol_bits will overflow a cast","failed to read fixed config and codebook"}; sdk {chirp_sdk_random_payload,chirp_sdk_get_info,_chirp_on_received_cdma}; playback {"Start chirping with unique device value:%d","current chirp output volume: %d","A chirp signal is already playing with playId %d","Stop chirp playId %d differ than m_chirpPlayId","Failed to stop chirp","Couldn't create a chirp audio stream","Error initializing chirp","Chirp setup failed - chirp sender does not exist!","Unable to play chirp"}; stream taps {as-dspin-ext-chirp,as-dspout-ext-chirp,ext-chirp-as,setup-chirp-as}; stream errors {stream_chirp_init_sync,lack_data_no_drain,read_err_full,read_err_part_data}; "Ignoring busy transition due to chirp only"; muse routes v1/players/{playerId}/roomDetection/chirp{,/{playId}} + household variants |
| `chirp_stack` | **partial** | embedded chirp-core 4.2.1_7265 acoustic data-over-audio SDK with a custom 'sonos-cdma' profile: used for room detection during setup — muse routes roomDetection/chirp (start/stop signalling with {playId}), DSP-routed audio streams as-dspin-ext-chirp/as-dspout-ext-chirp, a per-device unique payload ('Start chirping with unique device value:%d') and calibrated output volume ('Chirp volume not yet calibrated') |
| `cloud_api_paths` | **partial** | paths {/tokens,/invite,/redeem,/users,/firmwareDownload,/softwareDownload,/accountSubscription,/productEvent} + prefixes {households/,players/,services/,users/,groups/} + subs {/permissions,/extended}; params {route=,protocolVersion=,mainAccountId=,inviteId=,accountId=,destinationServiceId=,includeDeviceInfo=,objectIds,currentVersion,updateId,requestPath,downloadSpeed,osVersion,accountType,accountHash,keyName,keyValue,targetType,targetid,reportFirmwareDownload} |
| `cloud_synchronizer` | **partial** | cloud_synchronizer thread: registerServices (max-count abort, called-once guard), "received JIT event", "discarding %s type %d" |
| `common_logger` | **partial** | keys {filter,fileSize,preserveSize,defaultLevel,backup,hostIP,hostPort,STDERR,.backup,logger,rsettings}; line fmt "\[%s \| %07ld%03ld\] <%s,%d> "; "Invalid log category name (%s), length: %zu, range \[%d, %d\]"; IO {stat/ferror/read failed}; E_ codes {E_INVALID_SETTING,E_UNSUPPORTED,E_NETWORK_DATA_ERROR,E_NETWORKIOERROR,E_NETWORKTIMEOUT,E_NETWORKOVERFLOW,E_INTERNALERROR,ADD_ME}; rapidjson errors {Invalid escape character,Surrogate pair invalid,Invalid encoding,Number too big for double,Miss fraction/exponent,Missing name/colon/comma,Parsing terminated,Unspecific syntax error,Missing closing quotation mark,Document empty,Document root not singular} |
| `cpu_monitor` | **partial** | reads /proc/stat; header " \[%d\] usr sys idle sIRQ \| irqD dMS"; row " \[%d\]  %2u  %2u   %2u   %2u \| %6u %5lld"; parses %zu x7; "cpu%d switched to a shutdown state"; "Avoided dividing by zero calculating cpu core: %d bOverflow: %d"; "core%d: idle at %d%%" |
| `crash_report` | **partial** | {procName,numCrashes,uploadResp,playerCrash,lifetime}; "%s %s crash event, crashCount: %i"; Reported/Failed to report |
| `crossfade` | **partial** | {"attempting to crossfade with underflowed stream","recovered crossfade stream underflow","crossfade %zu samples","attempting to int16 crossfade with empty stream, clearing crossfade","unknown stream type in int16 crossfade: %d","crossfaded %zu bytes (%zu samples, %zu usec), %zu more samples to fade this frame, %zu samples to fade","unknown stream type in crossfade: %d","ending xfade","xfade already on - %zu samples remain unwritten","xfade corked stream: replace buffered data via non-xfade overlap","xfade timestamp too far in past, nst %d.%06d, pt %d.%06d","set xfade lfnf","xfadeable timestamp","inserting volume norm ramp: %d @time %d.%06d","xfade for %zu samples, %f seconds","xfade gap, samples %zd","starting xfade (xfade %s)"}; fmt %ld:%02ld:%02ld; "notifyStateChange \[%s\]: itemId: %s ptvWhen %d.%06d ptvTrackPos %ld.%06ld" + "notifyStateChange music quality: %s" |
| `csfcm` | **partial** | csfcm; pool {'marking (t:%d)','add %d.%06d %zu %s %d/%d free','NO FREE CONTEXTS','flushing (t:%d)','flushed %d.%06d %s','popping %d.%06d %s (%d.%06d < %d.%06d) %d/%d free'}; log fmt '%s:%05d \[%s\] pos:%u/%u hint:%s/nextState:%s/reqOp:%s/itemID:%s' |
| `daemon_ipc` | **partial** | routes {/anacapad-external,/sonospowercoordinator-external,/btmanager-external,/sonosledmgrd-external,/netstartd-external} proxy to sibling daemons; watchdog {/watchdog,/watchdog-legacy,/legacy-to-sentry,/upload} + attachments {watchdog_log,watchdog_dmesg} + crashdump; sentry {"No URL found to upload dump file: %s",text/plain; charset="us-ascii","Failed to write attachment %s to sentry upload",sentry\[tags\]}; flags {/tmp/anacapa_prevent_crashdump_upload,/tmp/backtrace,/tmp/crashed_play_state,/jffs/app/debug/sonosledmgrd.dmp,/opt/log/btservice.log}; "writeStream failed - Bytes compressed: %d/%d" + htsnk |
| `dataio` | **partial** | dataio.poll; parses {HTTP Result,Last-Modified,Content-Type,SET-COOKIE,cache-control,max-age=,ETag,WWW-Authenticate}; errors {'populate client config failed','unexpected response condition','parse_key failed',"Couldn't load api header, error 1/2"}; awaitAvail {'tried to read %zu bytes where only %zu available','range limited %zu bytes available','socket is closed','took %ldms (e:%d b:%zu w:%zu sbo:%d)'}; SSL 'SSL %s error -0x%x %d to %s with local port %u' + session ticket during dataio SSL read; http {'http readable but 0','http read error %d %s','http timeout'}; header validation {'Bad HTTP Header','BAD HTTP Header EOR mismatch Actual: %zu, Exptd: %zu','BAD HTTP Header EOR out-of-bond'} |
| `desired_settings` | **partial** | {DesiredTimeFormat,DesiredDateFormat,DesiredTimeServer,DesiredTime,TimeZoneForDesiredTime,HouseholdUTCTime,DesiredDailyIndexRefreshTime} |
| `dev_disc` | **partial** | devdiscthr/ddthrd.cxx: rx logging "%s - rx MSEARCH %s from %s:%d (%zd %d %d)", "%s - rx %s ALIVE %s %s %d %u %s (%zd)", "%s - rx %s BYEBYE %s", "%s - rx CDALIVE %s %s %d", "%s - rx CDBYEBYE %s", "rx  QUARANTINE_RECHECK %s"; "%s - %u SSDP messages lost"; zp byebye; "ddt hint:%d"; "Finished working on type %d" |
| `device_registration` | **partial** | Two-phase enrollment: POST /product/v2/households/{hh}/players?action=refresh then ?action=complete&token={tok}; FSM "regState changed %d -> %d" + "Transfer mode old (e:%d) new (e:%d)"; logs {during suspend,time expired,success,retrying registration at time %ld,error,Unexpected 401 response}; vars {regStatus,playerReg,sslerror,errno,mutualssl,sslError}; cert lifecycle {Flushed cert,removed invalid cert}; secure-reg-transfer IPC: signing key via {"Invalid registration signing key in IPC payload","Registration signing key set/cleared"}, jobs {tjmgrExitSecureRegTransferState,newRegisteredCertSonosIDLocked,exitSecRegTransferState}; household-customer conflict {"Household customer ID \[%s\] in conflict with local device \[%s\]","changed \[%s\] -> \[%s\]"} vars {RegisteredCustomerID,RegisteredCertSonosID}; events {Received %s event. Sonos ID,NewCertRegistrationEvent inprocess-event}; RegisterZoneProvider UPnP action; replicated headers {X-RINCON-LAST-UPDATE-DEVICE,X-RINCON-CONTENT-FORMAT,CONTENT-ENCODING,X-RINCON-SIGNATURE} + "unexpected content version/format"; {ReplicatedSettings,settingsReplication,netsettingsReplication}; "Removing settings denylists after registration" |
| `device_unlock` | **partial** | developer/manufacturing unlock surface: /unlock, /devunlock, /mfgunlock and /unlock.htm endpoints write /tmp/device_unlocked_flag; unlocks are rate-limited ('Too Many Unlocks' HTML page) and DevUnlock reboots the player; RdeviceIsUnlocked and RabortIfUnlocked let self-tests detect and refuse to run on unlocked units; 'unlockedBld' marks the build state |
| `devicecertmanager` | **partial** | ETag-cached downloads; metadata {requestTimeMS,downloadStatusCode,httpResultCode,previousETag}; outcomes {downloaded,unchanged}; "Cert download attempt finished"; "Unknown cert metadata state: %s. Scheduling cert refresh job."; error taxonomy {BAD_FILE,BAD_KEY,BAD_CERT,BAD_ISSUE_DATE,MISMATCH_ENV,MISMATCH_ISSUER,MISMATCH_HHID,MISMATCH_USER,not_present}; headers {X-Sonos-Muse-Household-Id,X-Sonos-Denylisted}; "Retrieved manufacturing data: %s"; files generated lazily "file not available yet, generating" |
| `diagnostics` | **partial** | manifest <DiagnosticManifest attrs> ver 2.0.0 → POST /v2/diags product-diagnostics; init body {"serial_num":"%s"}; fields {quarantined,secreg,swversion,ZPSupportInfo,ZPInfo,LocalUID,IPAddress,SoftwareVersion,QuarantineReason,StubReason,ZPNetworkInfo}; coordination: distribute diagId to players, trigger diag on controllers, collect submit statuses ("Timed out waiting"/"All devices reported"); files {manifest.xml,%s.xml,%s.sha256,%s.xml.gz}; modes {Diagnostic stub,Local diagnostic}; local aggregate http://localhost:%u/support/aggregate?type=%s&f=%x&e=%x; diag_progress var; counters Num players/Num stubbed players |
| `didl_extractor` | **partial** | rincon md fields {tiid,radioName,connotation,state,trackGain,chapterNum,chapterCount,linkUrl,isAd,streamContent,audioInputIcon,radioShowMd,streamInfo,rating,policies,podcast,episodeNumber,releaseDate,narrator,albumArtist,numSections} + upnp {originalTrackNumber,album}; classes {object.item.audioItem.podcast,.show,.audioBook.chapter,.musicTrack.recentShow}; loadFromExtraMd(trackURI,extraMd); extractMimeTypeFromHttpContentType (trunc/mtParams errors); protocolInfos {http-get,rtsp-rtp-udp,x-sonos-vli:*:audio:*,x-rincon-queue:*:*:*}; " duration=" attr; &#10; newline; -yYy- marker |
| `drm_content_keys` | **partial** | skd://itunes.apple.com/P{pid}/s1/e1 StoreKit URI; "duplicate content key entry detected from ContentKeys"; X-Sonos-Playback-Id: %s header; "getDeviceAuthToken was called for %s (%u), which has credentialType = %u (not OAuth)" |
| `dropout_logging` | **partial** | triggers {corr ctx chg evt type %u,grp role chg evt %u->%u,clear/set cid src=%u,set/reset pt}; slot model {clr slot,slot in use skip incr,set slot %zu idx %zu to %s,no space in list}; conditions {set pt reached,flag report at %zu sbmt,set pos aud,pt in fut - inaud,GCI but no CID}; per-ch incr "incr call: %s, %zu, %zu, ch %zu, %d.%06d"; fields {inputType,SatChCount,HtsnkVersion,msAfterPt,GroupRole,GCTimeValid,GCTime,btRole,submit}; counters {htsnk_missed_total,htsnk_missed_duration_total,htsnk_late_total,htsnk_strm_reset_duration_total,htsnk_strm_silence_duration_total,htsnk_strm_plc_duration_total}; reasons {chsnk_lse,chsnk_ch_data_full,chsnk_w_err,chsrc_framer_uflw,htsnk_invld_sntp,htsnk_late_frames,htsnk_missed_frames,htsnk_time_backw,htsnk_stream_err,htsnk_stream_uflw,htsnk_stream_reset_duration,htsnk_wrong_frame}; bt_audio + injectdropout test cmd {"missing dt param","Injected dropout error"}; "Sat chs %zu"/"Sat htsnk ver %u" |
| `dsp_files` | **partial** | files {eqdata.txt,app/debug/dsp,persistentEQ.xml,/dsp/eqdata.txt,dsp_preset.xml,dsp_preset_default.xml,dsp_preset_satellite.xml,dsp_system_default.bin,dsp_system_satellite.bin,satellite_processor.bin}; sonar-tone flush {"flushing sonar tones","Flushed"}; htdocs_locked; "modZPAmpTimer() called"; "unable to delete %s even though it exists"/"successfully deleted %s"; settings {ZPLocalSettingsFile,ZPExpirationTime,ZPGroupExpirationTime,ZPForcedUPnPExpirationTimeout,ZPMusicServicesBackstop,ZPTimeZonesBackstop}; "Setting JFFS root to %s" + ServerRoot + ContinueAfterIPChange + #GROUP_NAME# + "Failure generating group description xml" |
| `dsp_ht_engine` | **partial** | home-theatre DSP parameter surface + per-zone audio state schemas fully recovered: HT config XML (surround/sub/downmix/dialog/AI-speech/height levels, autoplay/autostop thresholds, Tweaks bitmask), 37-field per-Zone audio XML, zone volume/duck XML; R_MASK_* speaker layouts enumerate supported channel masks |
| `dsp_params` | **partial** | errors {error parsing mode state,error parsing bass extraction mode,error parsing dap profile mode}; /drc {boost}; /staticparams {speakers,directdec,virt_mode,frontangle,heightangle,rearsurrangle}; /dynamicparams {oarBassExtraction,dapCutOff,hfilt,post,vlamp,vmcal}; "Config %s not found, loading default" + /default |
| `dts_decoder` | **partial** | profiles {Digital Surround,Digital Surround 96/24,Digital Surround ES,High Resolution Audio,HD-MA,Express,Unknown DTS profile}; sync "Endian-Check: Unexpected Input Syncword Error"; "invalid dcadec audio mode, returning empty speaker layout"; status <BitDepth><DTSProfile><BitRate><NumPrimaryChannels><AudioMode><DialNormGainDB><ChannelMap>; errors {invalid sample size N-bit,encoded frame exceeds maximum,packet parse,frame 0 warning,unsupported sample freq,unsupported amode}; modes {Dual Mono,Stereo} |
| `ducking` | **partial** | duck.cxx inter-player ducking protocol: 64-bit ducking flags queued per-source ('Queueing ducking bit from %s 0x%016llx - %d', 'zone %d received ducking bit 0x%016llx - %d', 'too many pending ducking bits', 'Dequeueing ducking bit 0x%016llx'), tracked under duck_tracker_mtx with expireRemoteDuckingFlags + runDuckingHeartbeat (a liveness heartbeat that expires remote duck flags); commands forwarded to members ('failed to forward duck command %s to %s'). Policy gates on the request path: 'ducking globally enabled/disabled, honoring/dropping duck req', 'voice enabled device, dropping muse duck request', 'failed to acquire gc/avt, honoring duck req', 'playing tv, drop duck req'; muse ducking policy setting ('muse ducking policy: %x -> %x', key R_MuseDuckingPolicy) + fastvolduck/duckOrUnduck paths; 'process ducking flags 0x%016llx -> %s' + 'Ducking flags unchanged. No update to send.'; DUCKING_LOCAL_MUSE bit auto-cleared by timeout ('WARNING: DUCKING_LOCAL_MUSE cleared by timeout'). Evented XML <PlaybackDucked>%u</PlaybackDucked> + <DuckingFlags>%s</DuckingFlags> + DuckingEvent + isDucking + RecordDuckingActionEvent telemetry. Alert/chime layer: alertContent loop player ('alertContent: %s no read source', 'could not open default content for %s', 'default interrupted %s', 'completed default loop \[rclS:%lld\]'), household chimes ('playing join household chime', 'stopping/ramping down discovery chime', JOIN_CHIME_UNAVAILABLE/REGISTRATION_CHIME_UNAVAILABLE), transport restore after chime ('restoring after {pause,stop,end} chime: ret=%d ar=%d wrca=%d pavt=%d'), AUDIOCLIP/ALEXA_ALERT clip types, spotify:interruption: URIs, muse audioClip resource + /duck//unduck endpoints + v1/players/%s/playerVolume/{duck,unduck} outbound fan-out. |
| `effective_settings` | **partial** | routes v1/players/{playerId}/effectiveSettings{,/{groupName}} + household variants; verbs {getAllSettings,getSettingsGroup groupName,updateAllSettings,updateSettingsGroup groupName}; /settings/api/v1/locations/%s/effectiveSettings{,/%s}; keys {isEffectiveP2PPolicyEncrypted,effectiveSettingsDataChanged,patchEffective*,playerSettingsEvent}; "\[Mg\] getEffectiveSettings() bad groupId \[%u\]"; "\[Mg\] internalReadEffectiveValuesLocked_jsonValue(%s) bad keyId %u \[grkId:%u\|end:%u\]" (key-id store) |
| `embedded_sqlite` | **partial** | embedded libsqlite3 (sqlite3_open_v2/prepare_v2/step/bind_*/column_*/exec/busy_timeout) backs LocalTimer persistence in timer.db — the alarm/sleep-timer store; two tables with full DDL recovered verbatim \| proven tables (timers_impl.cxx): timers(id TEXT PRIMARY KEY, trigger_time TEXT NOT NULL, total_duration INTEGER NOT NULL, triggered NUMERIC NOT NULL) — local/suspend timers (timers_impl.cxx) \| suspend model: pause -> row in paused_timers w/ remaining_seconds+paused_utc_time; resume -> recompute trigger_time \| libFLAC embedded codec: reference libFLAC 1.3.4 20220220 |
| `enet_stats` | **partial** | <EnetPorts><Port port='%d'><Link>%d</Link><Speed>%d%s</Speed></Port></EnetPorts>; EthPrtStats counters {rxPackets,txPackets,rxBytes,txBytes,rxErrors,rxDropped,txDropped,multicasts,collisions}; EthIntrf detail {lngthErr,ovrFlwErr,crcErr,frmeErr,fifoErr,missedErr,RxDtlErr,abrtErr,crErr,hrtBeatErr,wndwErr,TxDtlErr}; /sys/class/net/eth0 + eth%u |
| `entitlements` | **partial** | /entitlements/api + "using cloud URL: %s" + X-Sonos-User-Id header + cache {cache-control,etag} + "cloud entitlements: rc %d, http %d"; internals {savePendingEntitlementsLocked,entmt,"unable to fire internal changed event","calling notifyClients","triggering version changed muse event",entitlements_manager,entitlements_mgr,"failed to get valid userId","Failed to get Entitlements Cache","No valid HTTPCacheManager","entitlements for "%s" changed","scheduled job to consider updating Sonos Radio"}; "Insufficient buffer for header line \[%s\]" |
| `esdk_events` | **partial** | {EsdkPlaybackStats,EsdkPlaybackErrors,EsdkHttpErrors,EsdkDownload,EsdkEvent,EsdkCapabilities}; endsong {ms_played:%zu,"Overwriting EndSong track_id with new value!","no track ID/file ID: played:%zu, ms:%zu",intent (%s)}; evs {evs_default_cb %s. error %d,"Error encoding %s","Error encoding envelope","Error sending %s"}; channel hm://hwp-events/v1/log_event; "No file with desired bitrate"; error report "device_id=%s, playback_id=%s, track_uri=%s, source=%s, hostname=%s, url=%s, error_code=%d, stack_error_message=%s, stack_error_code=%d, response_status_code=%d" |
| `esdk_httpio` | **partial** | tag eSDK/httpio + 3.205.205; {req_hostname,req_path,"Failed to format http request"}; response {"transfer-Encoding","unsupported transfer-encoding","CDN content-encoding unsupported","Redirect to %s","failed to parse or invalid content-range '%s' (req_offset:%d)","Content-Type: %s","bytes ","can't find HTTP headers end marker","invalid HTTP header, can't find protocol marker or status code","failed to find HTTP header line end marker"}; socketio {"%s operation timeout","failed to write/read data to/from socket '%i'","reached socket EOF"}; DNS {"Result for \"%s\" : addr %s","Invalid address family %d","Failed for \"%s\", error %d"}; {"Unable to set the track info","Unable to set hostname","No domain in URL","No http/https in URL","Failed to decode LicenseResponse"} |
| `esdk_socket` | **partial** | {"recv(%d, %p, %d) = -1 (errno %d: %s)","Socket close/getsockname/bind error: %d","Tried to use IPv6 but this platform does not support it.","connect(%d %s port %d)","Socket connection error: %d","Unable to set option:%d error:%s(%d)","Creating IPv4 socket (domain %d)","No free sockets available","Unable to create socket","Socket accept error: %d","Network initialization failed. error code: %d"}; DNS {"Failed DNS request for \"%s\", error %d (%s)","Successfully enqueued DNS request","Unable to enqueue DNS request, queue is full"}; stream {"STREAM_STATE #%u: %s -> %s",STREAM_INACTIVE,STREAM_STARTING}; socketio {"work_mem","can't parse url","New socket required: %d%d%d%d%d","creating new socket","reusing the socket","failed to format/write/read HTTP headers","not enough memory to read HTTP headers or invalid HTTP headers","no active socket","socket read failed"}; channels {"out of buffer! asked for %d bytes","error: out of channels","channel %d data %p size %d","CDN URL is too long to handle: %d","AP error %d on channel %d","cb->used + data_size < cb->size","Sent %s(%d) to ap Size %d"}; {".spotify.com",HTTP/1.,ap_list"} |
| `event_loop` | **partial** | eventLoopThreadPool + watchdogTimestamp; logs {Eventloop started. Threads: %zu,stopped,has no more work,shutdown. Cancelling watchdog,failure,elapsed-time:%lld} |
| `eventloop_perf` | **partial** | "Eventloop %p configured/removed"; inprocess-events-loop; "%s callback in observer %s exceeded duration threshold %lldms > %lldms"; counters {"Unique identifier for a set of counters","In-Process Event Subjects","The number of events queued",perf_counter_keyed,queueFail="events that failed to queue","The event size in bytes",dispatchDelay="time waiting to dispatch","In-Process Event Observers",cbTime="observer handler duration. Warn if over threshold"} |
| `exec_pages` | **partial** | {/debugfiles:"/bin/ls --full-time /jffs/app/debug /jffs/sys/debug /jffs/net/debug",/du-jffs:"/usr/bin/du -a -d 5 -k -x /jffs",/ifconfig:"/sbin/ifconfig",/lsmod:"/sbin/lsmod",mount:"/bin/mount",/netstat:"/bin/netstat -an",/ntpsources:"/bin/chronyc -n sources -v",ps:"/bin/ps",/route:"/sbin/route -n",/scanresults:"/wifi/athconfig scangetresults ath0",/showmacs:"/usr/sbin/brctl showmacs br0",free:"/usr/bin/free",date:"/bin/date"}; jobs {RefreshSSLCache,"Save SSL Client Cache to JFFS",SaveSSLCache}; more {/showports:"brctl showports br0",/showstats:"brctl showstats br0",/showstp:"brctl showstp br0",uptime:"/usr/bin/uptime"}; file pages {/VERSION,/etc/resolv.conf,/jffs/app/log/anacapa.log.backup,/jffs/app/log/upgrade_mgr.log,/jffs/irconfig.txt,/jffs/localsettings.txt,/jffs/netstartd_prev.log,/jffs/recovery.log,/jffs/recovery_prev.log,/jffs/settings/alarmclock.xml,/jffs/settings/areas.json,/jffs/settings/cloudconfig.json,/jffs/settings/householdsettings.json,/jffs/settings/zones.json,/jffs/settings/zpMetricsConfigV2.xml,/jffs/shadow/stats,/jffs/sys/log/setup{,_ok}/setup.{dmesg,log},/jffs/upgrade{,_prev,_tmp_prev}.log} |
| `ext_audio_src` | **partial** | job FSM {STARTING,RESUMING,RESUMED,CANCELLED,DISCARDED} + ops {stopPlaying(too many/no jobs),processJob,WaitForComplete,playDeferredStream(deferred j/d counts),playStream(exclusivity skip)} + "too many deferred jobs"/"playing job %u is missing"/"current job %u gone"; clip types {COMMON,AUDIOCLIP,AVT_HACK,ALEXA_TTS,ALEXA_WELCOME,ALEXA_FAILURE,ALEXA_ALERT,GOOGLE_MEDIA,GOOGLE_ALARM,GOOGLE_TTS,SVE_TTS,VOCAL_GUIDANCE,ALERT,SETUP_CHIRP,DISCOVERY} with intr flag "processing type %s %d (intr=%d)"; volume override "\[%i, %i - %i over %ums\]" ramp + "\[%i, % i\]"; "eventing play status for job %u: %s \[%s\] @%d.%06d"; decoder {failed to get decoder,illegal sample frequency,zero len frame,decoder flagged playback stop,unsupported channel count > 2}; extaudiosrc_playid |
| `factory_reset` | **partial** | factory reset machinery: a 'Factory Reset'/'Remote factory reset' CSRF-posted confirm form, /jffs/factoryReset.txt marker file ('unable to create factory reset file.', 'factory reset had errors', ': not factory reset'), LED_MODE_FACTORY_RESET pattern, sonosFactoryResetFull entry point, household-wide consequence ('device: %s %s removed from vanished list after factory reset'), and 'Invalid system settings (%s), resetting to factory defaults' as a self-heal path; muse route management/factoryReset can trigger it remotely |
| `favorites` | **partial** | replication "replicating favorites from %s"/"deciding whether to accept replicated list" + informReplicationAndNotify{,ForDestroy} + offerRemoteSetting; DIDL ns {xmlns:dc purl.org/dc/elements/1.1,xmlns:upnp,xmlns:r rinconnetworks,xmlns DIDL-Lite}; migration {old rhapsody→new,old non-OAuth} + "Failed to parse account service ID / serial number from Sonos URI"; errors {Invalid favorite id,Could not access favorites,initContentResource {parse URI,extract item ID,Invalid item ID,No valid mapping for item type}}; shortcuts/shortcut type; fields {AlbumArtURI,NextFavorite,FirmwareVersion,Description,ResMD}; cdudn + nameSpace + restricted + parentID |
| `favourites_model` | **partial** | Sonos favourites store + ContentDirectory projection: FV:2 root container paired with FavoritesUpdateID; XML store schema recovered; mutation via CDS CreateObject/UpdateObject/DestroyObject on the dirObjFavorites vtable + muse getFavorites/loadFavorite routes |
| `fcs_detail` | **partial** | f_105eba60 → f_106ba5b0; sibling f_105eba6c reads sonosClockGetTime into buffer (timestamp page) |
| `fd_event` | **partial** | ops {fdevent.signal.write,fdevent.wait.poll,fdevent.check.poll,fdevent.reset.read,removeFd,waitForEvent}; EventSync %s; epoll {create1,ctl,wait} errors incl "unsupported flags","already monitored","exceeded the fd capacity of %d" |
| `fdevent` | **partial** | ops {removeFd,waitForEvent}; thread names fdevent.{signal.write,wait.poll,check.poll,reset.read}; EventSync %s; epoll_create1/epoll_ctl/epoll_wait error paths; fd capacity bound "%d already monitored"/"exceeded the fd capacity of %d" |
| `feature_flag_registry` | **partial** | complete compile-time feature/config flag vocabulary (48 keys): featureConfig* family keys in the cloud-config JSON doc plus enable*/disable* booleans read at init — the build's feature map showing which subsystems are switchable |
| `feature_flags` | **partial** | flags {enableSpotifySMAPIVolumeNormalization,zoneExperiments,metricsService,enableVoiceDataCollection,enableSvcHomeControlLutron,enableSvcPlus,enableAmazonMusicDASH,enableAppleMusicHlsv7,enableTuneInReplacement,enableTuneInMigration,semiSleepConfig,enableTrueplayDataCollection,dropoutContext,enableSystemAPIV2,enable3ChannelSatellites,enableHTSNKv2,disableTlsRsaCiphersuites,enableSPSDataCollection,enablePortableSurrounds,aiseMinThreshold,enableMaxDialogueLevel,enableRemoveMSPCredentialsFromUPnP,featureConfigSemiSleep,DropoutContext,HomeTheaterWifiPerfTelemetry,MetricsService,Plink,Quickbonding,SemiSleep,SmartPlay,SpotABR,SsdpAdvertiseConfig,ZoneExperiment,featureConfigZoneExperiment} |
| `fileio` | **partial** | async register/unregister + enabled; SMB readdir + "failed to open SMB dir"; "File is in memory" skip-open; "Success opening URI %s; stream type %d"; "Sonos API URI %s not dereferenced before opening stream"; prebuffering + "reopening http for streaming at %zu" + ?after= resume; "application/xml; listing" dir listing; "no framer found in factory, returning null, we should not reach here" |
| `fmp4_parser` | **partial** | boxes {mfhd(seq check),tfhd(version),tfdt,trun space bounds} + "tfhd not found before trun"; trun table "seqnum %u truntblnum %zu fsize %zu foffset %zu fsamples %zu bdo %llu trundo %i truneo %zu trunes %zu trunep %zu"; senc "Sub-entry encryption isn't supported" + "Cannot parse all the IVs in senc at %dth entry"; "stream quality: encoder %s, bit depth %u, sample rate %u, bitrate %u, channels %u"; trims {encoder delay,padding} + "skipping frame; seek time offset"/"< usable offset"; atoms {iTunNORM,iTunSMPB,TLOU/ALOU ITU loudness,mehd,trex,traf,esds max/avg bitrate,alac sub,mp4a ch/bitdepth/samplerate}; errors {bad moof,no moov,no dat,unknown fmp4 encoder type,unsupported file ch/bitdepth,unsupported frequency %u-bit %uhz %u channels,frag w/o traf,STZ2 ignored}; formats %ub%u |
| `group_object_model` | **partial** | zone grouping internals: bonded-role enum (HT_BONDED_MASTER/SATELLITE, UNBONDED_DEVICE, stereo-pair/sub combos), coordinator ops (BecomeGroupCoordinator\[AndSource\] with GC-state cloning + VLI delegation, ChangeCoordinator, DelegatedGroupCoordinatorID), topology monitor with settle-retry, satellite lifecycle (Add/RemoveHTSatellite, recoverBondedZone FSM), per-satellite DSP protobuf + tuning push |
| `group_rc` | **partial** | group vol snapshot {"snapshot %s: %u (was %u)","snapshot sum for %u (of %u) zones"} + DesiredVolume/DesiredMute; algo "calculateVolume %s: sg:%.4f ng:%u sv:%u nv:%.4f" + gvd {t,c,f,m,cv,sv}; tracking {addZone already tracked,removeZone not tracked,transitionValid c/m/f}; faults {total failure,partial failure,all members use fixed volume,operation in progress,unexpected upnp fault}; events {GroupVolumeSetActionEvent(vol,mute,vligrouping),VliVolumeProcessingCompleteEvent vliType}; members {localRC vol/mute/fixed,remoteRC %s vol/mute/fixed}; ops {SetGroupMute local/remote rc,SetGroupVolume local netops zones + per-member rc}; group caps {"Group capability updated: 0x%08x -> 0x%08x","Spatial audio disabled in Area Zone","Spatial audio disabled: mask"} + enableSpatialAudio + "GroupCapabilities zp: %s: %i,%i,%i"; cap strings {widevine,atmos,portable,tv_in,hlsv7} |
| `healthcheck` | **partial** | schedule "Next healthcheck scheduled to run in %u hour(s), %u minute(s), %u second(s)" + "Not scheduling: %d %d %d %d %d %d" 6-gate + "Healthcheck timer pop"/reschedule; fields {SubmitPermission,ServerDiagInstructions}; instructions fetched /ws/diag/diag_instructions.xml?hhid= ; errors {I/O+HTTP Result,Indeterminate length,Incomplete,parse fail,too large} |
| `healthcheck_contact` | **partial** | schedule "Next healthcheck scheduled to run in %u h %u m %u s" + "Not scheduling: %d %d %d %d %d %d" + "Healthcheck timer pop" + "Rescheduling next healthcheck"; server /ws/diag/diag_instructions.xml?hhid= + SubmitPermission + ServerDiagInstructions + "Contacting server for instructions"; errors {I/O Error + HTTP Result,Indeterminate length,Incomplete file,Failed to parse,too large} |
| `hhsettings_rest` | **partial** | path grammar {public/{key},restricted/{key},restricted-admin/{key}}; errors {Key not found.,Failed to delete setting.,invalid value size or type for setting key,HHSettingsMgr reported invalid setting value for key,Failed to store setting.,HHSettingsMgr failed to store settings,Deleting all settings in a category is not allowed. Provide a key.,Unsupported Request}; get path logs "key = %s not found in processGetRequest" |
| `history_mgr` | **partial** | historyService + rphistory + historyEntryInvalid event + ucsType; cache {preCache,postCache,preEtag,postEtag,cacheControl,historyRequest} + "Updating history cache: \[status\]\[key\]\[etag\]\[cache-control\]" + "Cached etag" + "corrupt cache could not be served after a 304"; POST postHistory + recentlyPlayed + max-age + "max-age=%s, etag=%s, http-result=%d" + "Post History Buffer Cleared"; queue faults {bufferFull,invalidContentType,resourceIncomplete(name,type,objectId),groupIncomplete(name,id,coordinatorId)}; fields {imageUrl,explicit}; getHistory {serving the cache,#getHistory response} gated by {Securely Registered,History Enabled}; deleteHistory history?id=; "Failed to generate defaults for history entry"; "Failed to initialize history from cache"; cache edge: 'corrupt cache could not be served after a 304 Not Modified response from the cloud' |
| `hls_audio` | **partial** | "requires group capabilities %u"; seek {to time %.3f (%lu:%02lu:%02lu),to time from start of current segment,pass segment,to segment start time range}; "forcing a source switch due to multiple codec variants in playlist"; ADTS metadata {metadata,no metadata bumping seconds advanced,cached seconds advanced mismatch}; EXT-X-KEY {METHOD= AES-128,/SAMPLE-AES,,KEYFORMAT=,URI=data,URI=""} + "encrypted but no key URI"/"encrypted but no data from key URI"/"No IV, using seq. num"/"SAMPLE-AES detected. Setting up audio framer decryption"/"Key extracted. method=%d"/"undefined encryption method"; track playback {bitrate %u stream %u segment %llu offset %zu,InitFramerForTrackList failed,m_dTimeOffset,Trim offset required,resetMetadata,track play time,seconds advanced,time offset of segment byte offset}; bitrate report "hls-%s said: %u (%g) %d %d"; types {hls-live,hls-static,hls-???}; master {fetching master,updated master URI}; playlist errors {EXT-X-TARGETDURATION not present,media seq went backwards,media len changed,Invalid media playlist,Seeking pass the end,empty track list,Error %x occurred}; stale {d d llu llu}; Segment Map entries |
| `hls_player` | **partial** | variants {hls-live,hls-static,hls-???}; "requires group capabilities %u"; "forcing a source switch due to multiple codec variants in playlist"; ADTS md + "seconds advanced" tracking + "doesn't line up with seek"; encryption {encrypted-but-no-key-URI,no-data,"No IV, using seq. num.","SAMPLE-AES detected. Setting up audio framer decryption",key-uri http status,read size mismatch}; byte-range map "couldn't get file size from http headers for map"/"found offset %zu"; InitFramerForTrackList; seg index "starting at bitrate %u stream %u segment %llu offset %zu"; master {updated master URI,fetching master,version %u bitrate max/cur/min,getIndexURI,"Failed to calculate absolute media URI"}; ABR {"downgrade bitrate","already at the minimum","upgrade bitrate","advancing stream index"}; rendition filters {rgchStreamURI empty,PROGRAM-ID,invalid rendition,"rejecting binaural/downmix rendition",BANDWIDTH unsupported/0}; "unexpected, we have %zu dolby streams in the playlist"; BR P\|TYPE=SNG marker; seq discontinuity detect; threads {segaudio,hlsmeta,hlsplaylist} |
| `household_settings` | **partial** | file householdsettings.json {fileVersion,fileSchemaVersion,householdSettings}; JSON \[{version,lastUpdateDevice},\[{name:"restricted-admin",readPermission:null,writePermission:"hh-config-admin",settings:\[{explicitContentFiltering,recentlyPlayed}\]}\]\]; categories {restricted-admin,protected-admin,protected}; frozen:1 marker; "File upgraded to v%d schema"/"File overwritten due to invalid setting"; UMTracking→userMetricsTracking migration; "version incremented after invalid settings offered"; hhSwgenState swgen must be >= player; /householdsettings.json status-page ALERT |
| `ht_audio_sources` | **partial** | source names {tv-sat-as,tv-gm-dm-as,tv-proc-as,AIHomeTheater,chsnk-sat-as}; ForceSubmitTvSessionReport op |
| `htaudio_chproc` | **partial** | DRC "changedDRCStates: dspZone=%d, bNightMode=%d, dialogEnhancementLevel=%d, speechExtraction=%d"; streams {htain,htaoutl,htaoutr,htaouts,remote,downmix}; "tv channel map changed from %s to %s"; system/dsp_disable; app/debug/dsp/persistentEQ.xml; spdif-input + protocolInfo="spdif"; autoplay FSM {autoplay_tv,"auto stop %s silence threshold %ums","auto play %s silence threshold %ums","mode change %s -> %s","Silence threshold reached (%ums). Engaging auto stop.","Triggering autoplay. Ignore Silence Threshold (%d)","Transitioning to TV due to user interaction"} |
| `htaudio_satellite_tx` | **partial** | stats schema {timeToPlay/Time between send and play,txSent/Total bytes transmitted,txErrors/Total number of transmission errors,serializationErrors/Total number of serialization errors,numLateFrames/number of times we were late to transmit a frame,Total resynchronization frames,playbackEnd/Total playback ended frames,mx_proc/Highest SatMixer processing time,tx_proc/Highest SatTx processing time}; "HT Audio Satellite TX General" |
| `http_client` | **partial** | sonos::http::performAsync; errors {"not scheduled. No active thread pool available. Cancelling.","Client not setup","HTTP request attempted with empty URL","Curl error (%d): %s","Request timed out in %lld ms","curl_multi_perform/poll/info_read"}; perf counters {taskCount=tasks actively processed,mainLoopIteration=main loop time}; asio categories {generic,std:unknown,asio.netdb,asio.addrinfo,asio.misc}; netdb errors {Service not found,Socket type not supported,Host not found (authoritative)/(non-authoritative),"query valid but no data","non-recoverable database lookup"}; misc {Already open,End of file,Element not found,"descriptor does not fit into select fd_set"}; io_service {epoll re-registration,Invalid service owner,Service already exists,sonosAsyncThreadPoolCond,sonosAsyncWorkGuard} |
| `httpcache` | **partial** | hash-based invalidation {cacheHashes,"\[%s\] Cache not found. Cannot invalidate.","\[%s\] Invalidated local cache","\[%s\] hashLocal = %s","\[%s\] hashRemote = %s","\[%s\] Invalidating remote caches"} — propagates invalidation to remote players; /jffs mount check via statvfs + /proc/mounts; null hash 12 zeros |
| `hw_events` | **partial** | hwmessagelib + NetLink multicastGrp + repeat interval; events selthrd.RHWEvtHandlerZP.{reset,data,except,timeout}; readEvent {overflow,unknown,readNextMsg ERROR}; button forwarding {'Forwarding button events','Disabling button event forwarding'} to private-IP-only target {Unable to translate address,Host not private IP,Invalid host IP,Invalid port no,socket errors}; FSM states {NOT_IN_HOUSEHOLD,PROCESSING_PLAYBACK,IN_DEMO_MODE,IN_RDM_MODE,IN_BUTTON_OBSERVATION_MODE,IN_TRANSFER_MODE,PROCESSING_JOIN,JOIN_CHIME_UNAVAILABLE,REGISTRATION_CHIME_UNAVAILABLE,BUTTONS_LOCKED,DAT_IN_BUTTONLESS_SETUP_MODE,DAT_IN_SETUP_DISCOVERY}; setup combo {VOL_DN\|VOL_UP starts timer → setup-ready on pop, VOL_UP+VOL_DN timer popped}; '%s press/release count = %zu'; '%s ignored in notify mode'; 'Disallowed action (%d - %s) because (%d - %s)'; 'inline action'; allowPlaybackRequests; 'collecting triggered diags'; 'enter %s household mode'; 'cancel join household mode'; PLAYPAUSE; '%s button pressed (cid)'; 'Play button held'; orientation {old->new,orientation_change,syslib orient}; led_diags {'Diag mode:%u, leftMS:%u; timeMS:%u; next mode: %u','set diag mode:%d'}; setup {'join hh','enabling wifi and %s','signaling netstartd (%s) %s',openap} |
| `ibt` | **partial** | plan {"already generated ibt plan, no action taken","executing ibt plan for command (%s)","failed to generate target list","failed to generate ibt plan"}; intendedTargets param {"implicit target parsed \[%s\]","explicit target parsed \[%s\]","invalid intendedTargets parameter","command does not support intendedTargets parameter","invalid muse command body format"}; dispatch "\[dispatch\] unsupported IBT command (%s)"; JWT {"Unable to parse JWT token","Unable to load root bundle","Can't get client device certs","JWT cert validation finished: %s"}; ibt log domain; enablePitchfork flag |
| `inprocess_events` | **partial** | subject.h; Registering/Unregistering "%s" observer "%s". Total observers: %zu; observer-name fmt %s-%s (ie-obs); PlaybackEvent; flags {enableSemiSleep,enableHTSourceSleep}; TTM {secondary,useCase,attempts,"We timed out on %zu devices after %u attempts",msTTM,msDRP}; fmts {%d:%d.%06d,%d:%d.%6d}; errors {I/O Error: 0x%x. HTTP Result: %d uri: %s,recurse,redir,unsupported}; ie-schd,ie-cache |
| `interrupt_reasons` | **partial** | {CLOUD,HT_PLAYBACK,HT_POWER_STATE,AIRPLAY,AUDIO_CLIP,SPEAKER_DETECTION,FIXED_VOLUME,ROOM_DETECTION,IR_CONTROL,ALEXA_CBL}; CEC errors {CHARGER_NOT_COMPATIBLE,CONFIGURING,NO_LOGICAL_ADDRESS} |
| `iocompress` | **partial** | RCompressBuffer {deflateInit2,deflate,deflateEnd failed} + RDecompressBuffer {inflateInit2,inflate,inflateEnd failed} |
| `ir_learn` | **partial** | htaudio.cxx IR subsystem: code lists vol_up_codes/vol_down_codes/vol_mute_codes/input_codes (bounded); learn FSM passes{1,3} redundancy checks "first and third passes have different sizes"/"don't match"; repeat styles {alternating,repeating,non-repeating}; one-button learn with timeout (UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND); config /opt/ir/irconfig.txt; cloud database http://ir.ws.sonos.com/IRCode/ — submit <IRCode><code><value><guid> XML (guid from //dev//urandom), query "Requesting: %s" -> "Code found for remote id \[%s\]"; embedded remote-name table {Sharp,LG/Haier L32D1120,Samsung,Panasonic,Toshiba,Mitsubishi,Philips,Pioneer,Dynex,RCA 46LA45RQ,Orion SLED3280,Mitsubishi WD-65638/60738,JVC JLC42BC3000/LT-19E610,Seiki LC-32B56,SuperSonic SC-240/491,ViewSonic VT4210LED/VT3205LED,Loewe}; "Denylisted pyle!"; "Outstanding codes yet to be learned: Lengths are: %d, %d, %d" |
| `json_parser` | **partial** | error enum {Exceeded max depth,Invalid unicode escape,Invalid escape,Invalid string character,Invalid numeric character,Unexpected token,Sequence too long,Missing required value,Invalid value,Out Of Memory,Unexpected error} |
| `json_schema_validator` | **partial** | keywords {patternProperties,maxLength,minLength,maxItems,minItems,dependencies,maxProperties,minProperties,required,additionalProperties,uniqueItems,instanceRef,expected,duplicates,disallowed,exclusiveMaximum,exclusiveMinimum,additionalItems,properties,fileFormatVersion,targetTypes,readPerm,writePerm}; "\[Vf\] ValidationFailureMsg\[%s\] %s"; schemaValidator; groups {playerUI,playerBasic} |
| `lechmere_wss` | **partial** | lechmere.cxx cloud channel: RFC6455 WSS to lechmere.<env>.ws.sonos.com, negotiated subprotocol 'lechmere.<version>' (lechmere-v1 observed), inner TLV header layer ('failed to read lechmere header'), policy-key auth, app-level ping keepalive with 'TOO_MANY_UNACKED_PINGS' disconnect, and a full close-reason taxonomy driving reconnect decisions INNER FRAME FORMAT RECOVERED: 6-byte ASCII header {protocolVersion:2 chars, messageType:2 chars, extendedHeaderLength:2 chars} followed by extended header + payload (min frame len 6, checked cmpli 6 at f_105d539c). Parse errors 'Bad protocol version: %c%c', 'Bad message type: %c%c; %d', 'Bad extended header length: %c%c', 'could not recv extended header; expected %u read %u'. Message type validated via table lookup (f_11098e98 plt veneer); 2-char code registry AA..AK (.data 0x110941a4, 11 ptrs) dispatched via handler table built at f_10ac47fc region. Tunneled UPnP headers inside: 'x-sonos-method:', 'x-sonos-uri:', 'SOAPACTION:', 'X-Sonos-Udn'. Version str 'lechmere.%hhu%n'. AA..AK REGISTRATION DECODED: two consumers of the type table at 0x110941a4 found - f_10bd59xx walks entries 0..10 building records per code (2 lbz reads of each char, two calls to f_1082dfc0, entropy from mftb-based f_10809f0c, 0x100-byte alloc via plt 0x11098418); f_10bd65xx is a second walker (lwzu r28,\[r22+4\] over the table, counter 0..10) that strlen-checks each code (cmpli 0xf) and inserts it via f_10806d50 seeded with magic 0xc70f6907 (hash-table insert keyed on the 2-char code) building a per-code context record {+0,+4,+8,+c,+1c fields}. The codes are therefore a FIXED set of channel/stream identifiers registered into a keyed dispatch structure - they are not individually special-cased anywhere in code, so per-code semantics are data-driven (opaque map keys), which is the static-analysis ceiling for AA-AK message-type meaning. .got2 0x1108de34 points at the adjacent namespace/verb registry (0x110941d4). TWO-LETTER-CODE LAYER RESOLVED: the same keyed-map machinery used for AA..AK registration (f_10806d50 insert, seed 0xc70f6907) is consumed by f_1082dfc0 lookups in \[Mm\] ingestMigrationDataIntoBitFieldAry (0x10bd65xx-0x10bd6axx): migration/patch data is parsed as two-character tokens, each token hash-mapped to a field-id (<0xa, cmplwi 0xa) which sets bit 1<<fieldId in a bitfield array at ctx+0x98. So the two-letter-code alphabet is a shared field/channel registry: message-type codes (AA..AK) and migration field codes live in the same class of keyed dispatch structure. REGISTRATION LOOP FULLY DECODED (0x10bd65a4): the walker counter is bound at 0xa - only TEN codes (AA..AJ) are registered, each into a 0x24-byte record {code-str, len, loop-index at +0x1c} hash-inserted via f_10806d50/seed 0xc70f6907 then map-inserted via f_10bd6ec4; failures unwind through f_10807034 deletes. AA..AJ are the ten location-settings MIGRATION FIELD ids (bit positions 0-9 in ctx+0x98 bitfield); AK, the 11th table entry, is not a migration field - it belongs to a different channel role. Component tags recovered in the adjacent code: \[Mg\] settings manager, \[Mm\] locSetMigMgr migration manager (migrationmanager.cxx, keys __migration_data, __location_summation, _settings.json), \[Pc\] patch-completion ingest (\[Pc\] completePatchAttributeIngest() type mismatch \[%s\|%s\|%u\] vT\[%d\] aT\[%d\]), \[Rq\] request authz (isAuthorizedForNamespace, subvert-read/write guards), \[Gp\] group settings, \[Vf\] ValidationFailureMsg. NOTE: the 'uuuuubtnufr' table at 0x10e88fd4 is NOT a type map - it is a JSON escape table (control bytes -> \u or named \b\t\n\f\r) used by the attribute JSON emitter at 0x10a01xxx. |
| `led_engine` | **partial** | Scripted LED animation engine: <LedPatternInfo> docs hold <LedPatternEntry time led_ids repeats steps> programs of <LedStepEntry rgb hold fade> steps, serialized with cksum+flags; R_LED_* codes select the default pattern; SetLEDState toggles the user-visible on/off only |
| `led_hw` | **partial** | setHwFeatures {bHasMicrophone,bHasMuteLED,bHasStatusLED,bHasOnlyStatusLED,bHasHardwareLedSwap,bCanSetWhiteBrightness}; leds_zp; "After ~RLEDsZP" |
| `load_content` | **partial** | verbs {loadContainer,loadStream,loadFavorite,loadPlaylist,loadTrackList} with guidance "Use playback#loadTrackList to load tracks"/"Use playback#loadStream to load streams"; item types {spotify.connect,linein.homeTheater.spdif,linein.airplay,trackList.program,episode.podcast,chapter.audiobook,homeTheater-input,TV Audio}; meta json paths {/containerType,/containerName,/name,/explicit,/durationMs,/artist,/imageUrl,/releaseDate,/mimetype}; errors {Invalid favorites directory state,Invalid content resolver state,Account error,Invalid serviceId,Could not find default account for serviceId,SID mismatch lookupAccountByUDN vs RMuseUniversalMusicObjectId,Could not find UDN,serviceId is not associated with accountId}; "cannot enqueue item; %s queue is full (%zu items added, %zu items enqueued)" + "item.id tracking is out of memory"; local-library + r:contentService + /getaa? art; sn_%u/mhhid_ id prefixes; "RadioShow name/Id truncated"; shared\|private visibility; protocolInfo http-get:*:%s:* |
| `local_routes_2` | **partial** | paths {/createGroup,/unjoin,/activate,/deactivate,/duck,/unduck,/definition,/missingDefinition,/activeZone,/memberSettings} — cluster shares a path-matcher (no pointer table; PIC-formed literals) |
| `log_domain_map` | **partial** | 21 anacapa.*.log sinks under /opt/log define the module boundaries; plus sibling-daemon logs and the /tmp/memorylog ring |
| `log_domains` | **partial** | files /opt/log/anacapa.{alarm.job,avt.play,chsrc.state,dc,ext.audio.action,gm.events,ht,hdmi,hw.events,lechmere.event,musecmdandrsp,musedebug,museevt,rc.upnp,snf,spotify,spotify.debug,sps,trueplay,tv,vl}.log + anacapa.log + /jffs/app/log/anacapa.log.backup; conf {/opt/conf/anacapa.conf,/jffs/conf/anacapa.conf}; "Capped MaxConn value %d to %d. Edit anacapa.h to increase cap."; ZPSTR_BUFFERING state; R_TrialZPSerial key |
| `longpress` | **partial** | GC list {head,tail,current} of cloneable group coordinators; "cycling to %s:%s"/"end of list reached"; tracked GC actions {Adding new GC,Moving GC to head,Removing GC,"Updating last PAUSED/STOPPED GC","Last GC in HH to change playback state is no longer cloneable",Untracked GC action}; "not joinable" |
| `mdns_controller` | **partial** | Service lifecycle: register-once guard ("Attempted to register ... twice"), TXTRecord populate, value update/remove with dup guards ("ignoring duplicate value","ignoring removal of non-existant value"), unregister; player discovery "Unable to start mDNS player discovery; error %i" + QueryRecord; local. domain; "\[%s\] vs \[%s\]" compare |
| `mdns_discovery` | **partial** | 'Error enumerating key %zu in TXT record: %i'; 'QRCB: Update bye-bye reason to %s'; compat "Sonos mDNS TXT record for '%s' is older version or missing keys"; household filter '%s is not in our household: discovered:%s - ours: %s'; notify 'Notify topology of %s at %s; bootseq=%u; ports={%u-%u}; mdnssequence={old %u new %u}'; stub://stub:%u URI; {'Restart mdns discovery','mdns Browse callback error %i','%s is local; ignoring','Unknown player %s went bye-bye','Discovered new player %s'} |
| `media_player_abstraction` | **partial** | source plug-in layer under AVTransport: media_player_mgr + media_player_autoplay + media_player_vli_ctrl + extaudiosrc + ai_impl_base define the source vtable; autoplay system (StartAutoplay, AutoplayRoomUUID, AutoplayVolume, linked-zones expansion, silence thresholds, alarm/buzzer fallback) routes line-in/TV/Spotify-VLI sources to the coordinator; htaudio_autoplay.cxx handles TV autoplay; ChirpExtAudioSrc plugs acoustic input in as an ext source; media_player_mgr runs under 'mediaplayermanager' domain; VLI session control guarded by scopeVliCtrl lock; third linein source class object.item.audioItem.linein.bluetooth present |
| `media_player_mgr` | **partial** | actor model: target key {uuid,ix,port,ssl,mtls} (overlap check); "found actor for %s"/"found backup for %s"/"%s target \[%s\] for type %d resolved to %s"/"no actor available"; lifecycle register/create/shutdown; per-player config dir + anacapa_logger.toml; /localsettings.txt; Player%s naming |
| `memmon` | **partial** | reads /proc/meminfo {MemAvailable:,MemFree:} + /proc/%s/{statm,cmdline}; writes /tmp/memorylog/log.%d (+.old rotation); vars {memlog,memavailable,memfree,memory_status,memmon}; "memory report avail=%s free=%s"; "report skipped %s (count: %u)" |
| `memory_monitor` | **partial** | reads /proc/meminfo {MemAvailable,MemFree} + /proc/%s/{statm,cmdline}; logs to /tmp/memorylog/log.%d with .old rotation; "memory report avail=%s free=%s"; "report skipped %s (count: %u)"; fields {memavailable,memfree}; threads memlog/memmon/memory_status |
| `mntmgr` | **partial** | mount points /tmp/smb/%d_%d + trial /tmp/smb/tmp%d_%u; "already mounted unc=%s share=%s loc=%s"; "too many shares mounted"; trial mount "Trial mount found unsupported protocol: %s (strike %d/%d)" + "flagging %s as failed"; "not http mounting %s as %s" |
| `model_sku_vocabulary` | **partial** | 51 ZPSnn model identifiers enumerated in the capability-conditional table: ZPS{1,3,5,6,9,11-24,26-46,48,49,51-59,61}; capability gating is per-model-ID |
| `model_table` | **partial** | models recognized by this build: {ZPS1,ZPS3,ZPS6,ZPS9(this unit),ZPS11,ZPS12,ZPS13,ZPS14,ZPS15,ZPS16,ZPS17,ZPS18,ZPS19,ZPS20,ZPS21,ZPS22,ZPS23,ZPS24,ZPS26,ZPS27,ZPS31,ZPS35,ZPS37,ZPS38,ZPS43,ZPS54,ZPS55,ZP120,ANVIL} |
| `mp3_decoder` | **partial** | normalization {id3,lame}; "WMA radio not supported on this platform"; resync bound "20 resync required: corrupt file"; frame errors {illegal sample rate,read frame header/sync/data overflow/data failed}; xing {"No size in xing header","xing we can't load",VBR dur "%zukb/%ukbps = %llds",CBR dur,"Assume that VBR file without a ToC has constant bitrate of %d"}; ID3v2 skip; "Found valid header after searching %zu bytes"; seekSeconds duration bound |
| `mp_autoplay` | **partial** | params {vol,useVol,includeZones} + "airplay include zones: %d" + AirplayIncludeGroupedEvt; linein types {object.item.audioItem.linein.{homeTheater,airplay,bluetooth}} + x-sonos-vli; target resolution {"lonely local line-in autoplay","no autoplay target","couldn't determine coordinator/AVT control URI/control URI","Not executing on invisible/node proto incompatible ZP"}; "for controlURI \[%s\] for coordinator \[%s\]. programURI \[%s\]"; "Autoplay command failed ret=%d"; "AutoStop called on unhandled URI"; http://%s:%u |
| `mpegts_id3` | **partial** | TS parse: PAT/PMT PIDs, sectlen/desclen/silen, stype (Unsupported stream type), eslen, "No audio PID"/"Audio PID is 0x%x", "non-audio and non-timed_id3 PID", PTS, peslen/payload; timed-ID3v2 extraction: tag footer detect, "Ignoring too large timed ID3 size", OOB guards, "unsupported mp3 segment" |
| `mpmgr` | **partial** | actor key {uuid,ix,port,ssl,mtls} + "already exists or has overlapping values"; resolve {getActor,Actor Filter null,unexpected target ID type,found actor,found backup,target resolved,no actor available}; lifecycle {registered \[%zu\],created \[%zu\],Invalid target key abort,Request to shutdown,shutdown}; per-MP config Player%s + anacapa_logger.toml + /localsettings.txt; VLI hooks {onVirtualLineInGetVolume,SessionStartInfoUpdated,StartSession,StopSession,SuspendSession,NameChanged,MetaDataChanged,PlayModesChanged,onPlaybackStateChanged,processSetVolume,waitOnTxBitFlagsClearedLocked}; events {VolumeSetActionEvent(vol,mute),VliVolumeProcessingCompleteEvent(type,success,flags)+signal rc,VliSessionProcessingCompleteEvent(type,action,success,flags),"vliType old: %s new %s cookie %d"} |
| `multi_daemon_boundary` | **partial** | anacapad coordinates ~13 sibling daemons over /X-external HTTP routes + /tmp/netstartd.ipc: netstartd gets netsettings/PSK pushes and satellite notifications, reports connection-type updates back; per-daemon crash machinery (.dmp/.properties/_backtrace/count files) and /opt/log sinks \| netstartd client side (ipc_msg.cxx region): connect.sendMessageLocked hello handshake; performReset-triggered reconnect; deferral "Deferring IPC reconnect"; timeout "attempting reconnect (retries=%u)"; "Bad IPC message received (%d %d %d)"; transport threads selthrd.RIPCHandler.{reset,data,except,timeout}; control msgs "Disabling/Enabling networking","Signaling start/end of network connectivity test" |
| `muse_field_schema` | **partial** | auth {systemId,pinEpoch,accessToken,refreshToken,route,protocolVersion}; battery {statusReason,chargingState,validCharger,rawBatteryPercentage,batteryPercentage,batteryTemperature}; device {deviceFeatures,isCoordinator,isVisible,isSatellite,isSecure,bootSequenceId,systemUptimeSeconds,anacapaUptimeSeconds,museHouseholdName,primaryDeviceId,networkIPAddress,networkMask,networkType,wifiSignalStrength}; audio in {bluetoothSource,lineInSource,audioInputName,audioInputIcon}; misc {pageSize,websocketUrl,vanishReason,toVersion,clientState,deviceState,downloadDuration,isSuspended,credentialTypeAllowed,allowGuestAccess,isTrial,startDate,endDate,businessCore,controlChannels,restrictedAccess,sonosRadio,speed}; playback caps {canSkipToPrevious,canPause,canStop,canRepeat,canRepeatOne,canCrossfade,canShuffle,canSkipToItem}; policy {showNPreviousTracks,pauseTtlSec,playTtlSec,limitedSkips,pauseAtEndOfQueue,refreshAuthWhilePaused,notifyUserIntent,pauseOnDuck}; track meta {catalogId,region,nextItem,currentVideo,streamInfo,replayGain,advertisement,episodeNumber,chapterNumber,episodeName,immersive,connotation}; session {epochId,periodicIntervalMillis,sendPlaybackActions,macAddr,hmacDigest,sessionState}; misc2 {zoneInfo,isUnregistered,targetRoomName,meshDisable,suppressTVConfigError,repeatOne,shuffle,customerId,updateURL,enableMonitor,manifestRevision,latestSwGen,wifiDisableState}; SFB wire keys {third-party-integ,no-ads,hd-content,special-content,on-demand-archive,can-skip,content-saving,messaging,save-groups,basic-ui,commercial-msp,essentials-msp,premium-msp,dashboard-access,schedules-access}; alarm ops {getAlarms,fetchAlarm,createAlarm,updateAlarm,snoozeAlarm,removeAlarm}; duration fmt ISO8601 PT0H5M0S |
| `muse_logging` | **partial** | {muselogevt,muselogcmd}; logged ops {loadAudioClip,startDirectControlEx,setProtectedAdminSettings,createVoiceAccount} |
| `muse_perf` | **partial** | fmt "- %c%010u - %6s -" + "%s: %lldms, %fms avg \[count=%u\]"; stages {AUTH_IS_AUTHORIZED,AUTH_PARSE_DEVICE_TOKEN,AUTH_POLICY_TABLE_CACHE_FETCH,COMMAND_DISPATCH,COMMAND_EXECUTE,COMMAND_LOGGER,COMMAND_PARSE,COMMAND_REPORT,PLAYER_VOLUME_SET_VOLUME} |
| `muse_semantics` | **partial** | the muse API is the real product surface: 525 route strings, organized as households(282)/players(176)/groups(46)/playbackSessions(12)/users/devices/services namespaces; every SOAP service is mirrored as an upnp* proxy namespace; native resources cover settings, playback, hardwareStatus, positioning, homeTheater, pinewood, zones, authorization, timers, virtualLineIn, playerVolume, trueroom, trueplay, playlists, musicServiceAccounts, voice, systemReporting, localContentLibrary, networkTest, alarms, diagnostics, groupVolume |
| `muse_target_validator` | **partial** | rejects {guest_access_disallowed,forbidden,not_authorized,not_found}; museinfoserviceobserver/infoservice |
| `music_services` | **partial** | musicservices.xml + backstop file; state vars {ZPMusicServicesList,ServiceListVersion,AvailableServiceDescriptorList,AvailableServiceTypeList,AvailableServiceListVersion}; settings {OnlineUpdateBaseURL,R_TrialZPSerial,R_AvailableSvcTrials}; replication locks {rwlR_msd,rwlW_msd} + msdZonePlayer; accept logic "deciding whether to accept replicated list from: %s; ver: %u format: %u"/"replicating services from %s"/"Replicated list accepted"; zp-vs-rs compare {zpETag,rsETag,zpLUD,rsLUD,zpVer,rsVer}; "ServiceTypeList, adding built-in: %s"/"adding: %s; name: %s"; "Warning. No SD found for %d"; poll "next check for available services in %u s \[source=%s\]"; "Could not submit Available Services DIAG. Service count is: %zu"; checkForAvailableMusicServices job; "Not enough space to write full list" |
| `netif_monitor` | **partial** | netlink {RTM_NEWLINK,RTM_GETLINK}; errors {read error,incorrect type,unexpected message %X}; selthrd.RIfAddressMonitor.{reset,data,except,timeout} |
| `netstart_events` | **partial** | events {netstartd hello,Setup start,Setup stop,Netstart is idle,Netstart alive,Netstart open,In setup mode,Netstart SSID set/clear,Netstart triggered upgrade (0x%x),Got connection type update \[%s\]}; WAC {/var/run/wac_mode,Unknown WAC mode %d,WAC mode disabled/enabled/timeout}; ForceShutdownOnNewSSID %d; shutdown {"Deferring shutdown, reason \[%d\]","deferring newHHID event","ignoring network bounce mid-shutdown",zpShutdown,/tmp/netstartd.pid}; IP-change {re-binding old->new,clearing link-local subscriptions on 169.254.* change,shutting down for new IP,newAddr event with same addr}; conn types {SonosNet (Ethernet),Home Theater 2.0,Home Theater (Ethernet),Home Theater,Ethernet (WiFi Disabled),Ethernet,SonosNet (wireless)}; events {newHHID,newSSID}; "%s: %s event resetting connection to mDNS" |
| `noderx` | **partial** | indices {ob=outputBuf,lr=lastRead,lcg=lastConsecutiveGood,lrx=lastRx}; flight rec " %u r:%d.%06d s:%c p:%d.%06d"; startup {"Starting up; id:%u, delayPkts:%u, delayFrms:%u","Startup large packet gap:%u, don't NACK",bFinalStartPacket,allowing NACK resend of LCG,ignoring discontig NACK resend,ignoring partial frames}; NACK "out of order packet; send nack immediately" + "NACKed for %u IDs, %u packets, ob/lr/lcg/lrx"; pause/resume {thread pausing/resuming, state validation p/sp/pr/ip}; frame layer {wFirstFrameOffset,wBytesOfDataLeftToRead,pwLen,Playtime} + errors {expected frame not found,frame length conflict,Packet stream framing error,frame too large,bufferNextProtocolFrame WOULDBLOCK/E_WOULDBLOCK,readNextDataBlock timeout,forcing decoder reset}; skipAhead entries {immed,shifted,released blocks,too many}; resync {"resynchronization flushing packets %u-%u",resynchronization message}; "Ignore packet with incorrect protocol version"; "Received dup packet id with different class"/oob/mismatch replace; "RX buffer full"/"RX discontig"; threads {noderx-data,noderx-pause,noderx.rxd.usleep,noderx.loc.usleep}; "failing noderx for io error (c=%u t=%lld)" |
| `nslookup_detail` | **partial** | f_100b96d0: gate → execs nslookup via f_10549cf8 with table arg 0x11097680+0x810 |
| `overrideconfig` | **partial** | form post committing override file; errors {Error reading request body,Request body size does not match content length,Error initializing object,Error committing override file}; success <html>meta refresh 1;url=/fcs Success</html>; Content-Type application/x-www-form-urlencoded |
| `perf_counters` | **partial** | headers {counter_historical.h,counter_min_avg_max.h}; fields {thresh,wallClockEndTime='The end of the window as UTC wall clock time',description}; 'average value should be 0' |
| `perfect_sync` | **partial** | "perfect initial sync %d.%06d, available %u"; forcePerfectInitialSync + "Forced perfect initial sync %s on stream %s"; "forced perfect initial sync, ignoring %d usec diff" |
| `play_history` | **partial** | historymgr.cxx play-history pipeline: TrackPlayRecorder/TrackPlayMonitor capture plays, entries buffered and POSTed to the household history API with completeness gating + buffer-full drops; getHistory is ETag-cached; deleteHistory/removeHistoryItem/clearHistory ops; ratings via playbackMetadata/ratings — explicitly 'only implemented for cloud queue' |
| `playlist_parsers` | **partial** | iterate{ASX,M3U,WLP,PLS}PlayList; ASX <ref href= + entryref; linkUrl= extraction ("found linkUrl"); Post-stream readData dump {bytesLeft,len,buf} |
| `psk_hierarchy` | **partial** | PSKs {HhPsk (DTLS HH),ControlPsk,RoomEncPsk (room-name encrypt),LanSwapPsk} each +Backup mirror id; rotation {"Unable to generate new HH/control/room name encrypt/lan swap PSK","Unable to update settings with new PSKs","PSK rotation successful (HH: %s, Control: %s, RoomEnc: %s, LanSwap: %s)","Bumping netsettings version","not rotated"}; encoding {"Encoding SonosNet key failed","Encoding DTLS HH PSK failed"}; "Pending netsettings.json update discarded after replicating"; "Settings Replication changed SN Disable from %d to %d (source: %s)"; SSID protection {"SSID missing from known networks list","Registering for next topology update to protect SSID","Current SSID protected/already protected/not protected, could not get current SSID/missing from networks list","Not connected to a WiFi network, skipping SSID protection"}; "Received netsettings update from netstartd"/"netsettings changed"; app/run/nettestresult.txt |
| `qplay` | **partial** | QPlay:2 X_QPlay_SoftwareCapability xmlns:qq=tencent.com in device description; #QPLAY_SUPPORT# placeholder; action QPlayAuth; updateSharedTQPlayMode; no seed/code exchange or control channel found — stub-grade support |
| `qplay_protocol` | **partial** | Tencent QPlay support: /QPlay/Control SOAP endpoint (no matching /QPlay/Event route — the only service missing its event pair), a QPlayAuth action taking Seed/Code/MID/DID arguments (seed→code auth handshake: controller sends Seed, device answers with a Code computed from MID machine-id and DID device-id), a shared-T QPlay mode with context restrictions ('Calling updateSharedTQPlayMode in bad context!'), compile flag #QPLAY_SUPPORT#, and the device-description capability <qq:X_QPlay_SoftwareCapability>QPlay:2</qq:X_QPlay_SoftwareCapability> |
| `queue_persistence` | **partial** | .rsq on-disk queue format: savedqueues.rsq is a <SavedQueues LastUpdateDevice Version Next> XML doc of <SavedQueue Id Curated NumTracks> elements each holding <Track URI= MD=> entries; live queue persists as trackqueue.rsq; atomic write via .tmp rename + .d.rsq backup; validated at boot and on replication receipt |
| `rdmbuttonfwd_detail` | **partial** | f_100b9e58: auth gate f_105489fc + RDM-mode predicate f_105e9468 → f_100b9bb0 forwards buttons; else 403-class — GET/POST path via f_100b9bb0 after RDM-mode predicate f_105e9468 |
| `runtime_flag_files` | **partial** | runtime state is driven by sentinel files: /tmp flags (device_unlocked_flag, brokendevice, wifidisabled, htdocs_locked, crashed_play_state, anacapa-has-run, fresh_hh.txt, anacapa_prevent_crashdump_upload, sonosConcurrencyUnrecoverableError), /var/run mode files (wac_mode, netstart_mode, netmanager_extender_flags, systemtimeoffset), /tmp/memorylog 4-file ring + .old copy, /tmp/smb/ mount workspace, /tmp/backtrace + diagstdout/diagstdin diag scratch, /tmp/event_preserve + event_reporter_v3 buffers |
| `runtime_policy` | **partial** | ctor deps {fcs,hhsettings,settingsmgr}; Disallowed; P2P {isEffectiveP2PPolicyEncrypted,'Effective P2P Policy is encrypted \[%s\]'}; flags {'Use Thor w/ Muse','Chsrc Optimization Enabled'} |
| `scrobbler` | **partial** | Audioscrobbler/Last.fm submission client implementing protocol 1.2 over raw sockets: GET handshake to post.audioscrobbler.com, form-encoded scrobble POSTs, BADTIME Date-header recovery, OK-response check; also embeds ws.audioscrobbler.com/2.0 for the newer API |
| `select_thread` | **partial** | {epollAddFD,selthrd,RSelectThreadMutex,SelthrdUpdateMutex,epollReset}; errors {"Error in addUser - too many users","Error adding/removing interrupt fd to epoll","%s improperly changed its FD to %d (watching %d)","Error in eventfd (%d)","Error removing fd %d for %p %s (%s)","%s: %p %s already watching fd %d, removing it first","Error adding fd %d","Update error stu %p not in st %p","Error %d in epoll wait (%s)"} |
| `semisleep_power` | **partial** | low-power 'SemiSleep' suspend/resume: gated by featureConfigSemiSleep/enableSemiSleep + semiSleepConfig cloud config; 'Supported only on suspendable devices' capability check; suspends VLI sessions (onVirtualLineInSuspendSession, AHA_SUSPEND_VLI_SESSION, SUSPEND_SESSION op), playback sessions (muse playbackSession/suspend verb), cloud queue (during snooze/alarm), and local timers track suspend ('considering suspend'); group topology marks suspended members ('Found Suspended Rooms While Processing %s Group Info') \| Local timers (timers_impl.cxx / MuseTimerImpl): ops set/set-duration/set-relative-duration/create/delete/pause-delete/pause/resume each log "...(considering suspend) %s" on failure - suspend gates every timer mutation; timers persist across suspend in SQLite table timers(id TEXT PK, trigger_time TEXT, total_duration INTEGER, triggered NUMERIC) @0x10edcf88; "Unable to remove time on a ringing timer" guards firing timers. \| Pause persistence: paused_timers(id PK, remaining_seconds, paused_utc_time, total_duration) @0x10edd018 — parked timers survive suspend; resume recomputes. |
| `sethostip_detail` | **partial** | f_100b9fac: gate → tail f_105499fc (host-ip set + respond) |
| `settings_replication` | **partial** | the household replication bus: per-setting transfers ('replicateOne from %s to %s setting %u version %u') with a version+format negotiation ('deciding whether to accept replicated list from: %s; ver: %u format: %u'); per-setting denylisting on badFormat/badEncoding; a separate player-level quarantine subsystem enforcing admission policy (HTTPS required, known user, secure reg required) with scheduled rechecks; suppressed while unregistered |
| `sharelist` | **partial** | replication via %s/indexrepl + proposeUpdatedShareList + "remoteSettingIsBetter: us \[%s\|%u\] vs them \[%s\|%u\]"; ops {localAddShare,localRemoveShare,localRequestReindex,localRequestResort,localRemoveUnsupportedShares}; protocol gate {verified supported protocol→keep,else remove + count} + VerifiedValidProtocol flag; errors {share ID not found,path already exists,subsumed by existing share,Path is malformed,Access denied,Cannot exceed maximum shares,Mounting failed,Local index storage error,Remote file share error,Indexing canceled,connection failure,replication failed,replication skipped fmt mismatch}; reindex "request reindex (ad:%d sf:%d fr:%d si:%d st:%d lc:%s)" + "Turning resort request into full reindex" + "processing index complete (c:%d i:%d f:%d lc:%s)" + commit {m_bCommitted,m_bWait,m_bTerminate} + index recovery "recovered ix=%d with ver=%d"; R_BrowseByFolderSort + Tracknum sort |
| `shoutcast` | **partial** | request {icy-name:,location:,CONTENT-TYPE:,server:} + server id Cougar; responses {ICY 200,HTTP/1.1 200,HTTP/1.0 200,HTTP/1.1 30x,HTTP/1.0 30x} + redirect to %s; "request buffer is too small"; "add header \[%s : %s\]"; "opening connection with \[%s\]"; "Redirect audio/x-mpegurl to %s" (M3U); inline metadata {StreamTitle,text=""} + "end of file or I/O error"; shoutcastradio type; explicitContentFiltering + rsmapicontextzp |
| `shutdown_reasons` | **partial** | "idle state is %sidle, changing to %sidle" + dpUpdateIdleState; reasons {APICall,BluetoothConnection,PartnerDisappeared,Recovery,UserSuspend,UserShutdown,APIShutdown,CriticalShutdown,UnknownShutdown}; "unable to parse KVPair. %s is an invalid KV pair string."; battery {RawBattPct,BattPct,BattChg,BattTmp,BtSrcName}; EnetPorts {<Port port Link Speed> + EthPrtStats {rxPackets,txPackets,rxBytes,txBytes,rxErrors,...}} |
| `shutdown_seq` | **partial** | ordered teardown {HttpClient,ZonePlayer,AsyncMuseThreadPool,InternalEventDispatcher,resetZone,DropoutEventHandler,deleteTimedJobManager,AsyncThreadPool,finalSection,finalSectionEnd} |
| `signal_source` | **partial** | errors "invalid playId"/"failed to stop signal"/"incorrect playId"/"nothing is currently playing"/"couldn't create an audio stream"/"only one signal can run at any given time"/"invalid channel"/"disallowed by policy"; channelNumber param |
| `smapi_descriptor` | **partial** | fields {apiKey,advertising,presentationMap,strings,reporting,browse,Moment}; accountTiers {paidLimited,paidPremium}; additional capability checkbox values from the embedded form: disableMultiAccount, plus confirm contextHeaders/deviceCerts/playerIds/userInfo/contentFiltering/manifest/authorizationHeader/mediaUriActions already catalogued |
| `smartplay` | **partial** | reasons {BUTTON,EMPTY_AVT}; "PlayerSmartPlay missing required field %s"; /bridge/content/api + "service base path: %s"; timings {"loadContent took %ld ms: GroupId %s GC %s %s","getContent took %ld ms: %s","fetchContentAndStartPlay took %ld ms, success: %s"}; errors {loadContent failed,getContent parse failed,getContent failed} |
| `sntp_server` | **partial** | Dual-mode SNTP stack (sntp.cxx client + sntpsrv.cxx server + sntppoll.cxx poller): players sync from *.sonostime.pool.ntp.org or the group coordinator, one player hosts an SNTP server for the household ('Starting SNTP server switch'), and SNTP validity gates synchronized playback scheduling |
| `socket_hal` | **partial** | errors {"listen socket_listen/bind/set_option/create ret: %d","DNS callback not set","Requested hostname longer than %d","DNS lookup returned %d","connect socket_create/set_option/connect ret: %d","cb_socket_connect() = %d","try again, returning","Error setting kSpSocketReuseAddr/ReusePort/MulticastTTL/MulticastLoop/Membership/NonBlocking","udp socket_bind/create ret: %d","socket_close/accept/set_option/read ret: %d","Returning EOF/error on disconnected socket"}; tags {SOCKET-MANAGER,TLS-INTERNAL,Socket reporting error} |
| `sonarctl_detail` | **partial** | gate f_105489fc → method check (r9==1 POST?) → f_100b4614+f_100b4364+f_100b4388 response helpers; flushes sonar tones ("flushing sonar tones"/"Flushed") |
| `sonoscp` | **partial** | vars {reports,playbackPolicies}; errors {"Unable to validate specified service id %u","ignoring unsupported object %s","could not identify default account for object %s","cannot map content type %s to SMAPI protocol \[accountId:%s,sid:%s,obj:%s\]","cannot generate SMAPI URL"}; CQ URI cache {"Fetching CQ itemId %s using cached trackURI.","Adding track URI for itemId %s to cache.","Invalidating CQ track URI cache.","CloudQueueWindow init: %s"}; audio/x-spotify |
| `sound_device` | **partial** | syslib events {open,get_fd,poll,read,close} errors; LLA checks {DAC count,sample width inconsistency}; system/src_disable + StdQ ASRC Coeffs + "Running with SRC bypassed"; orientation sensing; "reset vcxo"; health flags {AMP_CURRENT_WARN,AMP_FAULT_WARN,AUDIO_WARN_TEMP,CPU_WARN_TEMP,CPU2_WARN_TEMP,SOC_WARN_TEMP,AMP_CURRENT_FAULT,AMP_FAULT,AUDIO_FAULT_TEMP,CPU_FAULT_TEMP,CPU2_FAULT_TEMP,SOC_FAULT_TEMP,PS36_FAULT,UV36_FAULT,UV14_FAULT,POWER_WARN_TEMP,POWER_FAULT_TEMP,MOTION_FAULT_TEMP,MOTION_WARN_TEMP}_STATUS |
| `sound_swap` | **partial** | sound_swap/audio_swap; queue audioSwapEventQueue + progress audioSwapProgress; behaviors SWAP_BEHAVIOR_{DO_NOTHING,PUSH_SWAP,PULL_SWAP,UNDEFINED}; push/pull disband target\|initiator group; HTSatelliteChecker gates (isFound,isHTSat,playerUDN,HTPrimaryUDN + topology/group-props/GC-AVT lookups); FSM "New state: %i"/"Event %i not handled in state %i"/transition-failure -> reset; result fields {swapResult,swapType,swapTarget,swapGC,initAction,candCount,respCount}; gates {bonded zone,HT Satellite,unknown state,unswappable audio,already in progress}; muse calls museCmdSetGroupMembers/museCmdModifyGroupMembers via groups/%s/groups/modifyGroupMembers |
| `spdif_detect` | **partial** | detected {Dolby Digital,Dolby Digital Surround,Dolby Digital Plus,Dolby Atmos (DD+),Dolby TrueHD,Dolby Atmos (TrueHD),Dolby MAT,Dolby Atmos (MAT),DTS (Type1),DTS (Type2),DTS (Type3),NULL Burst,Pause Burst}; unsupported taxonomy {AC-3,SMPTE 338M v1-v5,MPEG1 Layer 1/2/3,MPEG2,MPEG2-AAC,MPEG2 Layer 1-3 LSF,DTS1-4,ATRAC,ATRAC 2/3,ATRAC X,WMA Professional,MPEG2 AAC LSF,MPEG4 AAC,Enhanced AC-3,MAT,MPEG4 ALS,Reserved 2-4,Extended Data,MPEG4 AAC LC in LATM/LOAS,MPEG4 HE AAC in LATM/LOAS,DRA,Unsupported} |
| `spotify_smapi_ctrl` | **partial** | setPositionInfo fmt "trackId='%s', position=nullptr, duration=%d, bLastReport=true"; "discarding pre-transition position %lldms"; TransitionAck \[pos,preLogout pos,transAck\] + "Begin AwaitingTransitionAck \[preLogout=%lldms\]"; stream status "SMAPI current stream\[%u\] mediaType\[%d\]=%s (curTrkStatus\[%u\]=%d/nextTrkStatus\[%u\]=%d)"; "Notified we are receiving delegation. Resetting track queue info."; "Error event in SMAPI mode, e=0x%08x"; error map "error: %s ecode=%d (%s), mapped to 0x%08x" |
| `spotify_thread` | **partial** | single-request constraint "Already have a spotify request in progress, can only have one!!" + "Executing %s ..."/"%s timeout"; rate limit {"restricting excessive fatal error reporting","spotify telemetry rate limit exceeded!",spotrl}; connect ops {SpDisableConnect,SpEnableConnect,SpSetDisplayName,SpSetDeviceIsGroup,Enable/Disable Connect} "Set display name \[%s\], is%s grouped"; playback {SpPlaybackIncreaseUnderrunCount "Underruns reported: %u",SpPlaybackSetBitrate setbr,SpPlaybackPause/Play,SpPlayUriWithOptions,SpPlaybackEnableShuffle/Repeat,SpGetMetadata,SpZeroConfGetVars}; ads spotify:ad:/spotify:interruption:; restart token "'Radio' stripped from restart token. Token was %s now %s"; login {SpConnectionLoginOauthToken,waitForLogin,waitForLogout,"Login user change while in progress \[%s => %s\]","Already logging in as \[%s\]","Login mismatch","username %s... is longer than maximum %zu"}; logout {SpConnectionLogout,"logout %u, reset","Async logout initiated for VLI source switch","logout-%u - %d \[%s\]"}; work {RSpotifyEventWork::doWork(),DefaultWork}; "Failed to update the volume to %u (status=%d)" |
| `spotify_vli_session` | **partial** | session verbs {start,suspendSession,startAudio,pauseAudio,stopAudio,playModesChanged}; power {Spotify eSDK source power suspend/resume (e=0x%08x)}; delegation {"Ignoring audio flush/track changed/seeks (pos %u)/pause/became inactive while setting state / delegating","Spotify eSDK source selected, isDelegating %d, isActive %d","source not selected","Source Deselected, from sender %d"}; cookies {"%s:%d spotify old cookie: %d new: %d","Ignoring stale stopSession due to cookie mismatch"}; callbacks onVirtualLineIn{SuspendSession,StartAudio,StopAudio,PlayModesChanged} cookie %d; metadata {track,artist,album,playback_source_uri,bitrate} + Next Metadata; "Error event in VLI mode, e=0x%08x"; R_SPOT_EVT_AUDIO_TIMEOUT; RSpotifyVLIControl deactivate |
| `ssh_keys` | **partial** | params {ssh_key,button,remove_keys}; ops {"SSH auth key added to authorized keys file","SSH authorized keys file removed"}; dropbearkey /usr/bin/dropbearkey + host key /jffs/persist/ssh/dropbear_ecdsa_host_key + ecdsa-sha2-nistp256; fingerprint formats {pubkey,sha256-base64,md5-hex}; gated by R_ALLOW_SSH_PUBKEY_INSTALL (per gap audit) |
| `ssl_sessions` | **partial** | {'Cached SSL session for %s:%d','Failed to cache SSL session','SSL connection not established','Received new session ticket during mbedtls_ssl_{read,write,handshake}.'} |
| `stream_fetcher` | **partial** | notifyFrame ty:%d ln:%zu so:%zu ns:%zu f:%u ctx:%u:%u:%llu; getContentKey (encrypted HLS); "New bitrate: %d, Old bitrate: %d" adaptive switch; playlist FSM {"Timed out looking for playlist","Playlist failure with no time to recover (%ld buffer)","fetch empty","Too many empty playlists and no audio left"/"(still %ldms ahead)","Switching source due to empty playlists","end of static list","Unable to select another DS"/"waiting to fetch new playlist"}; "Startup ahead: %ld"; "URIs for %g seconds, wake up in %d"; "prebuffering %u bytes within %ld msec"; open fmt "open: %s (0x%x) %d len %llu offset %llu"; "stopping decoding while sleeping" |
| `stream_playback` | **partial** | policy {"Cloud queue policy pause expiry time hit","Queue content expired","clearing queue per policy","Queue policy stop on error","Ignoring playback policy change for context version %s"}; routines {running/End of pauseRoutine,running stopRoutine}; states {DEFER_PLAYING timeout,TRAN_PAUSED,PLAYING_START,suspended}; "Resetting required group caps \[0x%08x\] -> \[0x%08x\]"; "logical track boundary at %u"; frame timing {"notifyFrameInternal: behind %dms","ahead %lldms. Sleeping %lu ms, playtime=%d.%06d, sent at=%d.%06d, now=%d.%06d","tracking E_WOULDBLOCK count","setting origin time to %d.%06d"}; start hints {waiting,fast startup,future,met,no hint,crossfading}; buffer {"buffering underflow after %lld ms, requesting resync \[BH:%lld, FH:%u%%, FA:%lld, FR:%d\]","recovered buffering underflow"}; metrics {timeStart,timeEnd,behindMS,chsrc_behind}; skip reasons {duplicate,restricted,explicit,denylisted,Upcoming Spotify not playable,Spotify filtered for explicit}; "PlayTTL expired, pausing playback"; mime/URI consistency check + getTrackURIAndFramer \[f,u,m,cld\]; oob metadata {cache reset,enabled,disabled}; "Ignoring provided mediaUrl"; session ops {stationMetadata,rejoinSession,leaveSession,trackMetadata,streamUrl}; seek {"Overriding seek with value from SMAPI service: %lds","tvSeek framerResumePos"}; URIs {x-rincon-sonarcal,x-rincon-configmode,file://%s/sonar-tone/%s,file:///opt/buzzers/%s}; "Apple Music: use the derefenced URI to determine the framer, see CP-7253"; "Hit the end of the programmed radio queue"; "reporting enqueued stream URI instead of track URI" |
| `tdm_driver` | **partial** | {"Restart SPDIF block @ %d frames.","OVERSIZE SPDIF block @ %d frames!"}; device /dev/dsp; {"open failed (err=%d)","ioctl TDM_SETMODE failed (err=%d)","mmap failed (err=%d)","munmap1/munmap2 failed (err=%d)"} |
| `telemetry` | **partial** | PlayerButtons + TelemetryBasePlayer + TelemetryCategoryContext + telemetry tag; fields {event_id,event_name,event_schema_version,household_id,model_type,muse_household_id,serial_number,sonos_id,sw_build_type,sw_full_version,timestamp_utc,audio_type}; "PlayerButtons missing required field %s" |
| `telemetry_client` | **partial** | reportKVEvent; "report: %s %s %s %u %u"; "name: %s, schemaver: %s, category: %s"; "Encoding failed/succeeded: %zu bytes"; "Callback is not set to call in %s"/"Callback not set in %s" |
| `telemetry_submission` | **partial** | telemetry/diagnostics uplink: 'Telemetry 1.0 Event field' format, X-Sonos-MessageType: product-data-telemetry header, zonereportmgr.cxx zone reports, submitDiagnostics/submitQueuedDiagnostic pipeline with manifest submission, positioning telemetry level route, per-feature telemetry flags |
| `testenv_environment` | **partial** | POST /testenv switches the player's cloud environment between PROD, PERF, STAGE, TEST and INT, with an optional OnlineUpdateBaseURL override; the page displays the six resolved API bases (Cloud, Service catalog, System, Transfero, Metrics, Update) and CustomerId; the change replicates household-wide ('may take up to 120 seconds ... to replicate throughout household') and logs 'Setting cloud env to %s' |
| `thermal` | **partial** | syslib thermal {open,get_temp,close} + "cpu:%d, amp:%d, soc:%d" + temperature_volume + ampstate + hardware fields; "Hardware %s; clamping volume to %d%%"; state transitions {Entering/Leaving hardware warning state,Entering/Leaving hardware fault state} + hw:st + "Warning/Fault Code(s):%s" + fullSync; satsw "Error %d from uploadSatSwitchTimeReport" + satSwitch; lmrep "Error %d from WifiFuncsGetLmChangeStats" + {lmChannel,lmNeighbor,roamEvent,beaconLostEvent} |
| `timed_jobs` | **partial** | jobs {netsettingsBumpVersion,checkSonosNetDisableTestTimedJob,netsettingsRotateKeys,CheckForMissedPlayers,JITCloudFetch,RefreshSonosRadio,AddRemoveSonosBusinessMSP,fetchCertBundle,resetBTRecoverState,pollWirelessNetworkStatus,backupLogFiles,refreshSSLClientCache,reportSSLClientCacheStats,saveSSLClientCache,userInitiatedHHUpdate}; workers {asyncWorkerModZp,asyncMuseModZp}; setup {"Setting up ZonePlayer","ZonePlayer setup complete","Setting up MediaPlayer for port %u","Setup for MediaPlayer on port %u complete","no %s found in %s"}; jobs {High Res Usage Metrics/HRUsageMetrics,Account Maintenance/SvcAccountMaint} |
| `tj_wakeup` | **partial** | async wakeMissingPlayers {task,timer,request,retry TJ,cancel,failure} + "Unexpected WakeOnLANRequestEvent type" — WakeOnLAN; "Restoring AVT and track queue"/"Backing up track queue"/"Backing up AVT"; "Chirp setup failed - chirp sender does not exist"; "Setup volume not yet calibrated"; "Unable to play chirp"; refreshMdnsRegistration; /players/ api 1.1.0; settings {R_VolNormMode,R_CrossfadeDuration,R_AirplayIncludeLinked}; manual node engine ctor node version; spotmdns thread |
| `token_refresh` | **partial** | threads {cqatrs_tx,cloudqueue_tr}; log "\[%s HTTP %d from %s%s\] %s"; states {"using token from file","requesting new token refresh sync","requesting token refresh sync %u %d -> %d","need to wait for token refresh","waiting for token refresh completion","waiting for refresh tx complete; current state %d","Attempting to refresh token (hrs=%d te=%d)","transition token refresh action %u %d -> %d","Token refresh succeeded. Beginning retry."}; errors {"last refresh token for load timed out","no last refresh token time","expected entry not found to complete tx","expected entry not found waiting for tx","Refresh token failed with upnp result: %d","Refresh token failed. Could not find SD, sid=%u","unexpected token action %d"}; keyed by acct. sn. %u |
| `track_play_monitor` | **partial** | per-track log entries {Track Or Station URI,Extra Md,Context URI,CQ Auth Token,SMAPI Device Id,CloudQueueVersion,CQ Context Version,CQ Playback Id,API Key,Framer Name}; play line "%s play time %fs @%d.%06d (pkt:%u,act:0x%x,off:%lld%s,err:%u,uri:%s)"; segments "seg start @ %d.%06d (packetId: %u), end ..."; PlaybackId remap; string-pool bounded (pool %d%% full, "Resetting due to no free RTrackLogEntries"); states In progress/Final/LSE; selthrd.RTrackPlayMonitor thread |
| `trueplay` | **partial** | config modes {button-notify,room_calibration-calibrate,speaker-detect,trueroom} + "configMode CountDown:%d"; eTag manifest /etags.txt matched against tone files {leader.ogg,testtone.ogg,complete_ht.ogg,inverter_*} at path %s/%s/%s/%s-%s under tones; fetch via players/%s/settings/player muse settings + forward; "eTag is matching a known file"; types {plug-in spectral,polarity}; params {tone_duration,force,v:%s t:%s}; "Sonar cal volume - using clipped volume %d instead of requested %d"; TP update "found TP version ... do update to v%s"; teardown {"Clearing Trueroom tone folder on JFFS","Error removing Trueplay asset dir"}; restore paths {common RC,original RC,TV Surround Level,enable sonar,set AVT,reset AVT,re-enable Trueplay}; "Trueroom config mode - Not restoring/restoring the AVT"; fields {HTBondedZoneCommitState,AvailableRoomCalibration,RoomCalibrationState,Orientation,LastChangedPlayState,AlexaCBLSupported,SupportsAudioIn,SupportsAudioClip,HtBondedZoneCommitUpdateEvt}; cm_button "pressed %s" |
| `trueplay_api` | **partial** | SDK 6.2.0.1-main.Unspecified.2db5546c; factory TrueplayAPIFactory + initNode/initNodeMajorVersion; version negot {"Build version for TP API is %s","Updating Trueplay SDK version to %s","Trueplay SDK version %s not supported, creating previous version","Requested version %s is already in use ... no-op","SDK full version","Node data schema version"}; node methods {setup,setupMeasurement,startMeasurement,computeData,handleMsg}; minimal-node build {"channel types not available for a minimal node build","local channel types not available","Number of mics and number of DSP channels must both be 0 when one is 0","not compatible with having microphones"}; TPNodeSetupInfo; file errors |
| `ttm_helper_detail` | **partial** | f_100b9740: gate f_105489e4 → dumps runtime text blob (0x11095f88 table, f_100d567c copy) as text/plain |
| `unlock` | **partial** | flags {/tmp/device_unlocked_flag,/tmp/htdocs_locked,/opt/htdocs_locked}; flow {Fuse Value:,Challenge:} + form "Serial: %s / %s %s / POST {confirm textarea 11x80}"; responses {"DevUnlock Rebooting...",Success,Too Many Unlocks,Not Applicable}; muse op deviceUnlock; rate-limit "Too Many Unlocks" |
| `update_coordinator` | **partial** | beginUpdate/beginUpdate called./Update already started.; updateHookJob + upgradeinfo + /var/run; "Current Swgen Min downgrade version %s"; "error updating %s"; "Failed to query cloud settings"; update_coordinator actor; cert.xml+metadata.txt loads "loading %s (0x%x) took %ums" |
| `update_machinery` | **partial** | manifest-driven update pipeline: update_manifest carries a base update URL + per-device target rows (udn, model, submodel, swgen, ver, URI, updateID) and a min auto-update version; user updates run manifest-download -> checkDevicesToUpdate -> launchUpdate; auto-update policy gated by R_AutoUpdatePolicy + R_CheckUpdateInterval + R_AutoUpdateWindowStart + autoUpdatesEnabled |
| `upnputil` | **partial** | RparseServerLocationAndPort {"Unable to extract host, allocation too small","Port specified is too long","invalid port. Max value is 65535","unrecognized scheme in URL"}; RmapStatusToUPNPRESULT {UPNP_RESULT_CANT_CONNECT,UPNP_RESULT_GENERAL_FAILURE} + original error 0x%08x; UDN "uuid:%s::urn:schemas-upnp-org:device:ZonePlayer:1"; loopbackSecurityTokenMutex; time fmts {%04hu-%02hu-%02huT%02hu:%02hu:%02hu,%04hx%02hx%02hx%02hx%02hx%04hx%02hx%02hx%02hx%02hx%04hx,%02hu:%02hu:%02hu,%+02d:%02d}; statuses {UNPLAYABLE,MEMBER,NO-CONTENT,LAN-SWAPPABLE}; invalid chars ",\\<>;?*\|+=\[\]:\""; URL escape sets {$-_.+!*'(),/,$-_.!*'(),,-_.!*()}; audio fmt "bd:%u,sr:%u,c:%u,l:%u,d:%u"; "parser ctx allocation failed" |
| `usage_metrics` | **partial** | <UsageMetrics><ver>2</ver> + <ucs>/<uc> records {ms_cdctrluri,ms_regctrluri,ms_croot,ms_fn} posted to submit.aspx under /HRMetrics/; cfg fetches {pollInterval.htm,wifiTxRateThreshold.htm,wifiLatencyThreshold.htm}?hhid=%s; wifi counters {ath%u,rxPrr,beacon_flags,datarx,secdrp,roaming,trf2g,trf5g,trg2g,trg5g,tbtm2g,tbtm5g,rfail,q*_nbf,q*_cmp,q*_bpk,q*_ltc,hwstat,rxbhs,rxhang,rxfMax,rxcMax,txfMax,bprowar,gtkfm,gtkfc,nogcfc,links}; per-AP "MAC/rssiF/rssiT/PktMin/PER" + "BSSID/perAP/rssiAP"; "Audio-drop ... include with future periodic submission" + rate-limit; WD daily write; CPUTempHist <temperatures>; unlocked/hw_warn/hw_fault flags; usageDataSharing optin |
| `user_update` | **partial** | flow {"Running user-initiated HH update",no updates available,manifest download failed,no devices need updating,checkDevicesToUpdate failed,launchUpdate failed}; reports upgrade_mgr_user_report.json + _prev.json + /tmp/upgrade_mgr_info.txt; "report has more devices than the maximum ... omitted from the householdUpdateStatus event"; "Unknown upgrade client state"; "report consumed"/"Timed out polling"; app/run |
| `vli_ctrl` | **partial** | types {AirPlay,bluetooth/Bluetooth,tvproxy/TV Proxy} + "StartSession for unusable/unknown type"; scoped scopeVliCtrl/VliCtrlIx; protocolInfo x-sonos-vli:*:audio:*; cookie+fromSender tracking "%s:%d vliType %s cookie: %d"; "waiting for tx flags failed"/"completion signal timed out %#x %#x" + "timed out!!!!!!!"; "VLIGroupIDs cannot contain commas" |
| `voice_skill` | **partial** | {hasToken,skillStage,skillAuthCodeUS,skillAuthCodeEU,skillAuthCodeFE,skillRedirectUrl,authCode,redirectUrl,timeoutSeconds} |
| `wac_mode` | **partial** | WiFi Accessory Config (WAC) setup mode: state lives in /var/run/wac_mode (parsed int, 'Unknown WAC mode %d') with enabled/disabled/timeout transitions; driven by netstartd via /tmp/netstartd.ipc ('WAC mode enabled/disabled/timeout', 'In setup mode', 'Netstart SSID set/clear'); LED goes to R_LED_WAC mode \| netstartd IPC drives WAC: dispatcher f_10691034 msg ids 35/36=WAC disabled/enabled, 37/39/41=WAC timeout cluster; ids 42/46/47=setup-mode enter/setup start/stop. |
| `watchdog` | **partial** | device /dev/chk; files {/watchdog.log,/watchdog.dmesg,timeinfo}; {"Watchdog not started","Watchdog already created","Creating watchdog","No watchdog to destroy","Destroying watchdog","Invalid watchdog health check frequency","Watchdog constructed with %u seconds frequency","trigger called with status %d"}; "WATCHDOG: %s manual trigger (UTC %s)"/"unresponsive! (UTC %s)"; /sbin/reboot + return code; /watchdogcrash; "Performing health check"/"Waiting for next health check"; watchdog.poll; "In watchdog thread, performing health check"/"Exiting watchdog thread"; forceTrigger; client API {"client %s not found","Unregistered watchdog client %s","client must have a name","health check callback must be non-null","client %s already registered","Registered watchdog client %s"}; MTD /dev/mtd/0 |
| `wmp_provider` | **partial** | WMP NSS /WMPNSSv browse/search; caps {SCPA,SCPB,SCPI}; search grammar 'upnp:class derivedfrom "object.item.audioItem" and @refID exists false' + container class specs {person.musicArtist,album.musicAlbum,genre.musicGenre,playlistContainer}; sort/filter "+upnp:album,+upnp:originalTrackNumber,+dc:title" + microsoft:{artistAlbumArtist,artistPerformer,authorComposer} + upnp:genre + "1+upnp:originalTrackNumber"; field set dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber; rincon md ns urn:schemas-rinconnetworks-com:metadata-1-0/\|otherArtist; albumArt via %s?albumArt=true and /getaa?m=1&u=%s; "URI already has a serial number"/"not enough room for account ID" |
| `ws_client` | **partial** | client handshake {Location,Upgrade: websocket,Connection: Upgrade,Sec-WebSocket-Accept,Sec-WebSocket-Extensions}; "failing connection due to unsolicited per msg deflate"; per-msg deflate only before open; openSession retry; nonce gen/encode; {"disconnectedReason":"%s"}; close codes on close frame; LoadBalancerHost/WebsocketServerHost; reasons {NEW_IP,BLUETOOTH,POWERED_OFF,UPGRADE,NEW_SSID,SLEEPING,RECONNECT}; threads wsc_mtx/wsc_smtx/wsc_cond |
| `ws_server` | **partial** | websocketserver.cxx serves a local RFC6455 endpoint at /api/v1/websocket (route literal '/websocket/api' also present) for controller/UI clients. Server-side handshake headers sec-websocket-key + sec-websocket-version + 'Upgrade: websocket'; per-message deflate negotiated ('could not initialize per message deflate on ws client'); opcodes emitted as websocket(data\|ping\|pong\|close\|cont); 'Websocket protocol error'/'Write to websocket failed. opcode: %u, len: %zu'/'Connection already closed'. Status XML: <WebsocketRegistration>%s (%s)</WebsocketRegistration> or empty <WebsocketRegistration/>; connection cap telemetry <TruncatedConnectionList maxwebsockets="%zu" connections="%zu"/>. Internal state key ws_per_msg_deflate_run_state; event field 'websocketUrl' in the name table. |
| `zgt_errors` | **partial** | "Handling ReportUnresponsiveDevice %s/%s from %s:%hu"; GetZoneGroupAttributes {"No valid UUID in request server","TServer is not valid for request","TRequest is invalid in the control server"} |
| `zones_mgr` | **partial** | events {ZoneMemberSettingsChangedEvt,ZonesDefinitionsChangedEvent}; muse ops {museGetZoneDefinition "found zone \[%s\]"}; transitions {"zone transition on secondary/primary: zoneId %s","zone transition failed on primary"}; cms (channel-map-set) {"cms init from %s","cms update from pri: %s","cms update from sec: %s = %s + %s","zoneDef %s inconsistent with cms %s","can't construct channelMapSet"}; file <File name="activeZones">; ops {adding/removing player,joinZone id+flatChannelMapSet,unjoinZone,activateZone,deactivateZone,updateActiveZone,sendUpdateZoneMemberSettingsCmd}; guards {"primary change not supported for HT","update with offline primary not supported for HT","update only allows add or remove, not both","can't update both name and channelMapSet","Zone contains incompatible protocol versions","zone is not active","zone id not found","zone def not found","invalid activeZone","invalid channelMapSet","invalid flatChannelMap","invalid zone name","invalid name:","no name","secondary not reachable","more zones active than RMuseActiveZoneList can hold"}; "Legacy zone exists on %s"; "primary unavailable: sending Remove ops to secondaries"; "re-activate the current zone"; "updating ActiveZone: %s -> %s"/"primary change: %s -> %s"/"offline primary: %s -> %s" |
| `zones_storage` | **partial** | zone defs {name,id,channelMapSet} + "reached maximum zone definitions"/"too many zones defined in the config file \[max=%d\]" + "zone def full: %s removed"; ops {create,update id,remove (active-guard "zone currently active")}; replication {"received replicated file","failed to rename offered replicated file","failed to load offered replicated file","ignoring replicated file: incompatible schema"}; JSON load errors {missing value,zones data array,root not object,incorrect schema \[%d != %d\],parsing offset,open errno} + RapidJSON vocab; gainTrimDB remote apply; forwarding {activateZone,updateActiveZone,joinZone,updateZoneMemberSettings cmd to %s} + "primary %s not found" + "output buffer full"; file format: {schemaVersion, zones data array} logged under 'zonesstorage'; setup path: 'loading saved zones during setup succeeded'/'saved zones successfully migrated during setup'/'creating new zones config file'; remote settings change: gainTrimDB \[%.2f\] on %s |
| `zpinfo_dpimpl` | **partial** | vars {WirelessMode,ConnectionType,ChannelFreq,BehindWifiExtender,WifiEnabled,EthLink,SettingsReplicationState,SecureRegState,IsIdle,MoreInfo}; events {LineInStateChangedEvent,ReplicatedSettingsChangedEvent}; idle FSM "idle state is %sidle, changing to %sidle" + "Reporting device %sidle"; actors {dpimpl,RDPZoneImpl,dpZoneImpl,dpUpdateIdleState}; /dev/audioctl + U-Boot 17.2.7 + "OTP: %.32s"; KVPair parse; battery {RawBattPct,BattPct,BattChg,BattTmp,BtSrcName} |
| `account_actions` | **strong** | args {VariableName,StringValue,AccountUDN,AccountNickname,AccountType,WebCode,AccountPassword,NewAccountPassword,NewAccountMd,AccountToken,AccountKey,OAuthDeviceID,AuthorizationCode,RedirectURI,UserIdHashCode,AccountTier,AccountUID,NewAccountID,NewAccountUDN,RDMValue}; actions {AddAccountX,AddOAuthAccountX,DoPostUpdateTasks,EditAccountMd,EditAccountPasswordX,EnableRDM,GetRDM,GetString,GetWebCode,RefreshAccountCredentialsX,RemoveAccount,ReplaceAccountX,SetAccountNicknameX,SetString} |
| `accounts_replication` | **strong** | ops {markAccountsForPushLocked,setAndUpdatePreferredSerialNum,addAccountWithUserCredentials,int_addAccountWithOAuthToken,addPreinstalledService,addAccountWithOAuthToken,addAccountWithOAuthCode,addAccountForOAuthDirectControl,modifyAccount,migrateAccountsToSMAPI,migrateAccountSID,migrateAccountToOAuth,updateAccountUserInfo,reportAllActiveAccounts,ReportSvcTimedJob,matchImpl,pullFromReplicationService,pushToReplicationService,getPreferredAccount}; zpam: %s,%d,%d,%u; file accounts.xml; outcomes {retry,conflicted,updated,added,deleted,invalidCloud,invalidCloudSerial,invalidCloudReason,vcCloud}; validation {invalid service ID,missing service uuid,missing account type,missing metadata,missing cloud vector clock,missing serial number,missing account ID,missing household vector clock,"Discarding invalid cloud record: %s \[uuid=%s, hh=%s, cloud=%s\]",exceeded max deleted accounts}; guest migration {"Existing account is not a guest account, migrateGuestAccount failing","Bad guest migration: UDN = %s - UserIDHash = %s","Migrated %s replication account","Migrated tombstoned %s replication account"}; "End direct control context UUID: %s"; "Invalid replication operation"; "no preferred account set"; "Failed to download manifest file (%s) for service %u"; getDeviceAuthToken failed |
| `acoustic_metrics` | **strong** | {tdoas,scrollbackAttempt,confidence,correlationMaxValue,thresholdPeakMaxValue,leadingEdgeSpectralSimilarity,leadingEdgePriorEnergy,leadingEdgePosteriorEnergy,leadingEdgeEnergyCoherence,maxPeakEnergyCoherence,maxPeakPosteriorEnergy,noiseRms,signalRms,normalisedResiduals,peakMagnitudeRatios,leadingEdgePercentageEnergy,f1SpectralSimilarity,f2SpectralSimilarity,leadingEdgeKurtosis,leadingEdgeRiseTime,normalisedAggregateResidual,decayConstant,numMeasurements,numRetries,orchestrator,debugData,tvUsec,errorTime,expirationTime} |
| `alarm_clock` | **?** |  |
| `album_art` | **?** |  |
| `amp_manager` | **strong** | AmplifierPowerStateChangedEvent; transitions {"zone %d volume %f -> %f","zone %d is playing %d -> %d"}; notify ops {manageAmpStateLocked_notifyVolume,notifyPlayState,notifyPlayingUnmuteableSource_p/np,notifyOutputFixed,resetPreemptiveTurnOn,notifyPreemptiveTurnOn}; preemptive "zone %zu preemptive turn on %d -> 0/%d"; power {"entered ampPowerOnLocked() - %dms","ignored unsupported amp command: power/mute/hipower (%d)","failed to power on/unmute/mute/power off amps (%d)","failed to transition to high/low power rail (%d)","left ampPowerOnLocked()","requested amp power off"}; off-decision "roff:%d canoff:%d ofx:%d nzvplay:%d pre:%d unm:%d"; "scheduling off in %d sec"; {ampMgr,RAmpManager,ampPowerOnLocked,ampPowerOffLocked,"failed to unmute amps to clear fault","ampState %d -> %d",notifyAmpState,"init failed (%d)"} |
| `ap_layer` | **strong** | endpoints {apresolve.spotify.com,ap.spotify.com,local apresolve,fallback}; handshake {"Connecting (%s) %s:%d timeout: %d sec","Sending Hello message to AP","Writing apresolve request","logging in, type %d sz %d user %s","Failed to decode ApWelcome: %s","!"ApWelcome failed""}; TLV {"Failed reading TLV header %d %d/7 oserr %d","Packet from AP is too large! Type: %d / Size: %d","ap->packet_size <= 16384","Skipped %s(%d) (%d > %d)","Corrupted packet, invalid MAC"}; connectivity {"Permanent connection error: %d","Regained network connectivity, reconnecting","Lost network connectivity, disconnecting","Connectivity went from one type to another (%d -> %d), populating disconnected sockets array","Too long without response from server","SpPumpEvents() is called too slowly: %d ms for 100 calls","ap os error code: %d"} |
| `areas` | **strong** | areas.json persistence + atomic-write cycle {accepted file load,rename accepted→store,rename failed paths,saving failed,setup load/save}; schema versioning 'Loaded areas schema version (%d) differs from local version (%d)'; builtin 'Everywhere' + GUID 7055133f-81e7-45e6-ba70-8803966c7185; constraints {'Area IDs must be distinct','Maximum area limit (%d) reached','Cannot update read-only area','Set of players in area (array playerIds)'}; vars {areaId,areasMgr,artfetch} |
| `async_stream` | **strong** | init 'buffersize=%zu; multiThread=%u; ratelimit=%zu us'; segment model {'Data segment follows segment with EOF!','Tried to delete segment with I/O in progress','SegmentTable reallocated to %zu entries','Unexpected: I/O to block %zu; not last block in segment'}; positions {'Pause; framed to stream pos %zu; resume at pos at %zu; reaped to pos %zu','Played to stream pos %zu. Reaped %zu blocks of played data in track %5.5s','Started reaping played data. Lose fast scrubbing backwards'}; alloc {'Alloc satisfied by track transition','Alloc satisfied by deleting played data','Alloc not satisified, returning anyway','Unable to satisfy allocation request! Played to pos','Satisfed allocation request but should not have required this!'}; CDN fallback {'File is in memory!','>>>Start reading at offset %zu ; streamPos %zu','>>>Sync read from CDN at offset %zu','Opportunistic sync read from CDN','readSync unable to allocate a buffer; transport error will ensue','>>>>readSync: read %zu blocks in %lld ms'}; rates {'Playing at ~%zu KB/sec. Blocks read this series: %zu','Avg read rate: %zuKB/sec; min read rate','download time %zu ms','Stop async reading. Filled %zu buffers; %zu bytes in %zu ms. (%zu KB/sec)'}; tracking {'Socket has: %zu bytes (%zu blocks and %zu bytes). CHSRC ms ahead: %ld','new seek based PB session','Restart current track','start streaming track %d \[%5.5s\]. Filesize=%zu, startPos=%zu'}; actors {asyncstrm,asyncstrmio,asyncstreamiomgr,asyncBufferedStream,mrrkbs,arrkbs}; 'Atom Table Full' |
| `audio_in` | **?** |  |
| `autoplay` | **?** |  |
| `av_transport` | **?** |  |
| `avt_impl` | **strong** | TX selection {'Using HTAudio TV TX for GM %s','Using CHSRC TX for GM %s','Why are we telling HTAP to play %s','setting tvInputFormat %08x',iSCS removeClock/installClock}; persistence avt.txt + avt-backup-restore + locks {rwlW_avt,rwlR_avt} + actor RAVTMediaRenderer/scopeAvt; VLI ops {ChangeTransportSettings playing/stopping/deactivating local VLI (txs),endVLISession,onTXSettingsWillChange→VLI::StopTransmission}; session eviction 'sessionError MUSE_ERROR_SESSION_EVICTED for %s: %s' + evict; sleep timer {'sleep timer fired (r:%ld)','sleep timer set (d:%d r:%d p:%d c:%d)','sleep timer reached (p:%d)','Failed to configure the sleep timer','Invalid duration provided'}; amp preempt {'amp already on','prem-amp turn on at %d.%06d; start up time: %dms','could not preemptively turn on the amp'}; queue events {tracksAdded,qLength,trackIndex,enqueueEvent,'Add to queue %u; URI/MD'}; playmode warnings {'vli play modes ignored (enable/disable flags)','play modes ignored (current/desired)'}; operational override {'changing Operational Override mask from 0x%x to 0x%x','setAVT aborted because operation is overridden'}; seek units {TRACK_NR seek track,REL_TIME %lld.%06lld seek time,TIME_DELTA %lld.%06lld,00:00:00,previous}; settings {change crossfade,change play mode,capChange,groupSize,curCaps,requiredCaps,musicPausedMS}; ret codes {stopRet,seekToTrackRet,seekToTimeRet,playRet,pauseRet,endpointSwitch,episode} |
| `avt_lastchange` | **strong** | <Event xmlns=upnp-org:metadata-1-0/AVT/ xmlns:r=rinconnetworks-com:metadata-1-0/>; standard {TransportState,CurrentPlayMode,CurrentCrossfadeMode,NumberOfTracks,CurrentTrack,CurrentSection,CurrentTrackURI,CurrentTrackDuration,CurrentTrackMetaData,PlaybackStorageMedium,AVTransportURI,AVTransportURIMetaData,NextAVTransportURI,NextAVTransportURIMetaData,CurrentTransportActions,TransportStatus,TransportErrorDescription,TransportErrorURI,TransportErrorHttpCode,TransportErrorHttpHeaders}; rincon-ext {r:EnqueuedTransportURI,r:EnqueuedTransportURIMetaData,r:CurrentValidPlayModes,r:DirectControlClientID,r:DirectControlIsSuspended,r:DirectControlAccountID,r:SleepTimerGeneration,r:RestartPending,r:NextTrackURI,r:NextTrackMetaData,r:AlarmRunning,r:SnoozeRunning}; static NOT_IMPLEMENTED {TransportPlaySpeed,CurrentMediaDuration,RecordStorageMedium,PossibleRecordStorageMedia,RecordMediumWriteStatus,CurrentRecordQualityMode}; PossiblePlaybackStorageMedia=NONE, NETWORK; x-sonos-unknown: scheme |
| `browse_ids` | **strong** | library {ALBARTIST,LIBARTIST,LIBALBUM,LIBGENRE,LIBTRACKS,LIBPLAYLISTS,LIBSTATIONS,LIBMUSIC}; genre {GNRSUBGNR,GNRTOPARTIST,GNRTOPALBUM,GNRTOPTRACKS,GNRSTATIONS,GNRCHARTS,NEWRELEASES,RHAPRECOMMEND,SUBGNRALLARTISTS,SUBGNRKEYARTISTS,SUBGNRKEYALBUMS,SUBGNRSAMPLER}; global {GLBARTIST,GLBALBUM,GLBGENRE,GLBLEAFGENRE,GLBTRACK,GLBPLAYLIST,GLBSTATION}; artist {ARTTOPTRACKS,ARTALBUM,ARTSINGLESEPS,ARTCOMPILATIONS,ARTOTHERRELS,ARTSTATION}; discovery {GUIDE,ALBUMSFORYOU,FEATPLAYLISTS,STAFFPICKS,PSTATIONS}; search {SEARCHARTISTS,SEARCHKEYWORDS,SEARCHTRACKS,SEARCHALBUMS,SEARCHCOMPOSERS,SSTATIONS,SONOSSEARCH}; radio {STARTSTA,STARTTAGSTA,BROWSETAGPOP,BROWSETAGALPHA,MYRADIO,PERSONALRADIO,LOVEDRADIO,NEIGHBORHOOD,RECOMMENDED,SEARCHTAGS,TAGRADIO,TOPTAGSPOP,TOPTAGSALPHA,RECENT}; genres {Adult and Easy Listening,Eighties,"Public, Talk, and Sports Radio",Pop and Top 40,Country and Folk,Jazz and Blues,"Classic, Hard and Alt. Rock","Soul, Hip Hop and R&B",Dance and Electronic,"New Age, Ambient, Chill-Down"}; locales {France,Germany,Italy,Netherlands,Spain,International-Other}; misc {ZPSTR_BUFFERING,Favorite Stations,Unnamed Room,Media Server} |
| `catalog_translation` | **strong** | GET /content/api/catalog/id/%s?destinationServiceId=%s; translateId(objectId,serviceId,targetObjectId); cache {"retrieved translation from cache","translation not cached; connecting to translation service","saved translation to cache","translateId response: %d %s"}; errors {"objectId missing","serviceId missing","targetObjectId missing","cannot perform translateId request; one or more parameters missing"}; actors {zpCatalogTranslation,catalogSvcMgr,targetSid} |
| `cdn_fetcher` | **strong** | fibers {chunk_fiber,httpio,socketio} TF_IS_RUNNING; requests {"downloading '%s' from offset:%i size:%i","requesting stream '%s' offset:%ukb (size:%ukb)","GET %s"}; errors {"httpio get failed (result = %i, status code = %i, total code length = %i)","Redirect #%d to %s","httpio unexpected eof/read failed","reading/got chunk (%ukB -> %ukB) / %ukB (%ukB)","unexpectedly not enough space in destination","This is probably not recoverable","Failed to write to destination buffer","retry on timeout/read error, attempts=%d","failed to download chunk from cdn","switched to a new cdn: cdn_index=%d"}; "Download complete, read %u B in %u ms"; req engine {"%s Request for %s %s (channel_id:%d, fail_count:%d)","%s request failed: %d, fail_count:%d (retry_count:%d)","%s retries exhausted, count:%d, limit:%d","Will retry %s in:%llums at:%llu",dbg_ctx,request_function}; params {cdn_info->num_urls,dest} |
| `cert` | **?** |  |
| `cert_layer` | **?** |  |
| `chirp_sdk` | **strong** | version chirp-sdk 4.2.3; libvorbis {Xiph.Org libVorbis I 20200704 (Reducing Environment),1.3.7}; API {new_chirp_sdk,del_chirp_sdk,chirp_sdk_free,chirp_sdk_random_payload,chirp_sdk_get_info,chirp_sdk_process_shorts_input/output,chirp_sdk_send,new_chirp,del_chirp,chirp_encode,chirp_decode,chirp_get_symbols,new/del_chirp_payload,chirp_payload_randomise,new_chirp_builtin_profile,new/del_chirp_profile,new/del_chirp_protocol,new_chirp_protocol_from_json_value,chirp_protocol_corrupt_random_symbols,new/del_chirp_acoustic,new/del_chirp_encoding,new_chirp_config,new_chirp_default_config,del_chirp_config,new_chirp_decoder_config_from_json_value,new_chirp_default_voter_configs,new/del_chirp_voter_config,new/del_gf,del_gf_poly,gf_calc_syndromes,gf_poly_concatenate,chirp_levenshtein,chirp_logger_init_with_callback/deinit}; types {chirp_sdk_t,chirp_t,chirp_symbol_t,chirp_payload_t,chirp_profile_t,chirp_protocol_t,chirp_acoustic_t,chirp_encoding_t,chirp_config_t,chirp_voter_config_t,chirp_decode_metrics_t,chirp_logger_t,sample_t,uint8_t,uint32_t,float}; info "Chirp SDK with \"%s\" profile v%u \[max %u bytes in %.2fs\], supporting %u channel(s), using %s modulation."; logger fmt "\[%s:%d\] \[%s\] %s" levels {Print,Debug} |
| `chsnk` | **?** |  |
| `chsnk_detail` | **strong** | seamless handoff {remote: 'starting seamless transition to remote source','txs can't be parsed','handoff wait loop','timed out','sdbt receive packet failed','Old/New packet mismatch (no full frame/id:%u class:%u/%u offset:%u/%u/%u)','Delayed handoff success, offset:%f','Quick handoff success','Completed in %dms','incompatible protocol version'; local: 'itdbt receive packet failed','failed due to END_TX','no packets from old source?','Completed seamless transition to local src (id=%u)',skipped,'seamless source change %s (local)/failed (remote)'}; SNTP {'Starting SNTP server switch.','Completed SNTP server switch in %dms.','SNTP waiting for valid at %d.%06d','SNTP valid %d continue to play %d','noderx I/O error while waiting for SNTP'}; sync math {'local device time went backwards!','prevLT/prevNT diff %06dus overall %+f','Should play at %d.%06d playable %d.%06d offset %f','sample time offset range %.3f-%.3fms; DAC clock abs offset range','max consec large sync errs','small offset error %f','large sync error triggered resync offset %f','error was %.0f ms %s; cpu usage was %.01f%%; sntp v:%d f:%d'}; LSE {skipAheadLocked,'Adjusted tvLocalPlay by %.0f usec','Resync after LSE','waiting for stream reset to recover','stream underflow, uf %u od %u','Play time %d.%06d too far in the future','setOutputToBeginAt(%d.%06d); diff %i ms','Initial sync -- notify samples'}; req frames {'request frame pbe %X','stop detected','control frame type %u','audio type changed','underflow detected','group coordinator uuid: %s, network I/O error 0x%x','logical track boundary at %u','unplayable frame: type %u','pbe %X; %f usec in buffer','hard stop; state %d','noderx pause request','track boundary','scheduled resync frame @ pkt %d'}; sources {local chsrc,local AI,local VLI,remote chsrc,stopped}; notify {'notify frame: stop detected','unflagging stream for drain; %zums buffered','Local time/remote time','lrp:%u, fppc: %u','notifyframe ret %d play time %d.%06d delta %dms'}; events {chsnk refreshing multicast join (NetworkIfaceBouncedEvent/NetworkIpAddrAssignedEvent),RemoteIpChangedEvent,chsrc_state_events,CoordChangeAutoStart,newgc}; ASRC {'Hi-Res music SRC: setCoefficients to StdQ ASRC Coeffs','ASRC will be reset. Sample Rate changed','illegal sample frequency/channels for Hi-Res music','WARNING! This model shouldn't support Hi-Res Music: %s (%s)'}; volnorm {'inserting volume norm: %d @time %d.%06d','found normalization change','requested w/o applying previous'}; streams {as-srcin-chsnk,as-srcin,as-srcout-chsnk,as-srcout,chsnk%d-as,chsnk%d-proc-as,CHSNK,chsnk-pause,chsnk_framed}; decoder {<MusicDecoder><LastActiveDecoder>,m_bCompressed,'starting %s audio decoder at %d.%06d (dc:%d.%06d)','requested stop %d or shutting down %d'}; ducking {Ducking,Unducking,voice2,google,extaudio,'%s playback stream (%s)'}; underflow acct {'boundary, xfade %d','max below stream %u od %u xfs %zu xlvl %zu now ... corked %d','inserting volume norm','stream reset on write','channelization data full'}; service denylist {'Added listener for service %u','stream limit exceeded for service %u','too many failures, denylisted service %u','clearing all denylists and stream limits','resetting all denylist error counters',denylist}; DAC monitor {'Starting to monitor DAC tvLocalPlay:%d.%06d, tvFirstPlayTime:%d.%06d','unable to fire start playback event','Channel Sink in stopped state (dc)'} |
| `chsrc_chsnk` | **substantially decoded** | chsrc.cxx (0x10ea8620-0x10ea95dc) = channel SOURCE: the playback engine producing framed audio for the group. chsnk.cxx (0x10eb5400-0x10eb6148) = channel SINK: the receiving player decoder path. |
| `circuit_breaker` | **strong** | "%s CB state transition to \[CLOSED\]"/\[OPEN\]/\[SEMI_OPEN\]; musecommand; history.h |
| `cloud` | **?** |  |
| `cloud_queue` | **strong** | resources {itemWindow?,context?,version?,version?updateToken=true&}; params {isExplicit,previousWindowSize,upcomingWindowSize,heardItemId}; truncation {item window,context,version} |
| `cloud_registration` | **?** |  |
| `cloud_services` | **strong** | host patterns {sslauth.sonos.com,https://%s-%s.lower-sslauth.sonos.com%s,https://%s.%s%s,lechmere.%s.ws.sonos.com,/firmware/swgen/%u/latest/}; service names {clientdata,crash-upload,feature-config,music-history,lechmere-v1,music-accounts,myaccount,oauth,player-device-files-ab,product-settings,recommendation,registration,service-catalog,sonos-nonprod,apigee.net,smart-play,system-api,system-api-diagnostics,transfer,translate,universal-search,msmetrics}; CSRFToken var |
| `content_directory` | **strong** | dual URN {urn:schemas-sonos-com:service:ContentDirectory:1,urn:schemas-upnp-org:service:ContentDirectory:1}; locales {zh-CN,ja-JP}; event vars {SystemUpdateID,ContainerUpdateIDs,ShareIndexInProgress,ShareIndexLastError,FavoritesUpdateID,RadioFavoritesUpdateID,RadioLocationUpdateID,SavedQueuesUpdateID,ShareListUpdateID,cdMediaServer}; actions {Browse,CreateObject,DestroyObject,FindPrefix,GetAlbumArtistDisplayOption,GetAllPrefixLocations,GetBrowseable,GetLastIndexChange,GetSearchCapabilities,GetShareIndexInProgress,UpdateObject,SCHED}; args {BrowseDirectChildren,BrowseMetadata,BrowseFlag,RequestedCount,SortCriteria,NumberReturned,TotalMatches,ContainerID,Elements,CurrentTagValue,NewTagValue,SortOrder,TotalPrefixes,PrefixAndIndexCSV,Browseable,IsBrowseable,IsIndexing,SortCaps,SearchCaps}; logs {"UpdateObject returned %d; ObjectID: %s; Elements: %s","notifyUpdateID('%s', %u)","Bad Browse flag %s","Bad Object ID %s","Browse %s ObjectID: %s;","MetaData failed %d"}; DIDL URNs {upnp/\|class,upnp/\|albumArtURI,rinconnetworks/\|http,rinconnetworks/\|albumArtist,rinconnetworks/\|description} |
| `customsd` | **strong** | POST /customsd + csrfToken hidden; fields {SID (240-253 or 255) default 255,name (blank erases),secureUri,pollInterval}; authType radio {UserId=Session ID,Anonymous,DeviceLink=Device Link,AppLink=Application Link}; optional {stringsVersion+stringsUri,presentationMapVersion+presentationMapUri,manifestVersion+manifestUri}; containerType {MService=Music Service,SoundLab=Sonos Sound Lab}; caps checkboxes {search,trFavorites,alFavorites,arFavorites(commented out),ucPlaylists,logging,playbackLogging,accountLogging,extendedMD(+radioExtendedMD,playlistExtendedMD gated),disableAlarms,noMultiAccount,mediaUriActions,contextHeaders,deviceCerts,playerIds,contextReporting,userInfo,contentFiltering,manifest,authorizationHeader} |
| `datatap` | **?** |  |
| `device_props` | **?** |  |
| `devmode` | **?** |  |
| `dolby_decoder` | **strong** | config {"unable to parse %s",app/debug/dsp/dolby_config.json (JFFS override),"override dolby config with jffs",/opt/dsp/dolby_config.json,"loaded player dolby json config","unable to load player dolby json config, loading defaults","Config %s not found, loading default"}; decoder {dlbdec,"dolby decoder unable to decode","<DEC_SampleRate>%u</DEC_SampleRate><LFEPresence>%s</LFEPresence><DEC_ChanCount>%zu</DEC_ChanCount>"}; parse errors {mode state,bass extraction mode,dap profile mode}; staticparams {boost,speakers,directdec,virt_mode,frontangle,heightangle,rearsurrangle}; dynamicparams {oarBassExtraction,dapCutOff,hfilt,vlamp,vmcal}; modes {/default,movie,disable,night,sonosdolbyconfig,"drc config is invalid"}; DRC cutoffs 100HZ-200HZ in 10Hz steps; LRR EQ {lrrse,lrrs1,lrrs2}; PCM decoder {decoder_pcm,"Invalid frame size detected %zu","Unsupported input rate detected %zu","Invalid number of input samples detected %zu","<DEC_SampleRate>%zu</DEC_SampleRate>"} |
| `download_status` | **confirmed** | {ERROR_NOT_CALLED,WRITE_ERROR,TRUNCATION_ERROR,SIZE_ERROR,FILE_ERROR,CONNECTION_ERROR,DOWNLOAD_SUCCEEDED,FILE_UNCHANGED,DOWNLOAD_IN_PROGRESS} |
| `dsp_config` | **strong** | files under /opt/dsp {ht_config,ht_config_sat}; nanopb decode {"Successfully decoded DSPConfig","Decoding error %s","DSPConfig file is empty","Unable to open DSP config file %s"}; per-model {"Bonded gain for '%s' not found in DSPConfig","Volume breakpoints for '%s' not found"}; breakpoints {"no default volume breakpoints specified","no bonded volume breakpoints specified, using default instead","volume (%i) and gain (%i) lengths differ in default volume breakpoints","... in bonded volume breakpoints","default (%i) and bonded (%i) volume breakpoint lengths differ","... breakpoints differ","Too many volume breakpoints ... `.nanopb_options` ... MAX_VOLUME_BREAKPOINT_LENGTH","DSPConfigParams conversion successful"}; gravity param; trueplay_version x.x.x.x fmt + range {"base version isnt valid","Start or end of range isnt a valid version","Unable to parse version from end/start string"}; "setNumChannels(%d) greater than max (%d)"; fileio {"DSP file path is longer than buffer","unable to open file","fread","file %s does not exist","Could not get size of file"} |
| `error_codes` | **?** |  |
| `esdk_api` | **strong** | registration {SpRegisterConnectionCallbacks,SpRegisterDeviceAliasCallbacks,SpRegisterPlaybackCallbacks,SpRegisterStreamCallbacks,SpRegisterDebugCallbacks,SpFree}; playback {SpPlaybackPlay,SpPlaybackPause,SpPlaybackSkipToNext,SpPlaybackSkipToPrev,SpPlaybackSeek,SpPlaybackSeekRelative,SpPlaybackUpdateVolume,SpPlaybackEnableShuffle,SpPlaybackEnableRepeat,SpPlaybackCycleRepeatMode,SpPlaybackSetAvailableToPlay,SpPlaybackSetDeviceInactive,SpPlaybackSetDeviceControllable,SpPlaybackIncreaseUnderrunCount,SpPlaybackSetBitrate,SpPlaybackSetRedeliveryMode,SpPlaybackIsRedeliveryModeActivated}; connection {SpConnectionLoginBlob,SpConnectionLoginOauthToken,SpConnectionSetConnectivity,SpConnectionLogout,SpGetCanonicalUsername,SpGetLoginUsername}; device {SpSetDisplayName,SpSetVolumeSteps,SpSetDeviceIsGroup,SpEnableConnect,SpDisableConnect,SpSetDeviceAliases} + {SpSetAdUserAgent,SpPumpEvents,SpZeroConfAnnouncePause/Resume,SpConnectionLoginZeroConf,SpPlayUriWithOptions,SpPlayUri,SpPlayContextUri,SpQueueUri,SpPlaybackBecomeActiveDevice,SpRegisterDnsHALCallbacks,SpGetDefaultDnsHALCallbacks,SpRegisterSocketHALCallbacks,SpGetDefaultSocketHALCallbacks,SpRegisterTLSCallbacks,SpPlaybackSetBandwidthLimit,SpNotifyTrackLength,SpNotifyTrackError,SpNotifyStreamPlaybackStarted/Continued/FinishedNaturally,SpNotifySeekComplete,SpSetDownloadPosition,SpLogRegisterTraceObject,SpRestrictDrmMediaFormats,SpRestoreDrmMediaFormats} |
| `esdk_callbacks` | **strong** | playback cb {on_notify,on_seek,on_apply_volume} "Successfully registered playback callbacks: %s, %s, %s"+removed; stream cb {on_data,on_start,on_end,on_flush,on_pos} "Successfully registered delivery callbacks: %s, %s, %s, %s, %s, %s"+removed; signatures {cb_stream_on_start(id=%u, size=%u),cb_stream_on_end(id=%u),cb_stream_get_position(id=%u) = %u,cb_stream_on_seek_position(id=%u, pos=%u),cb_stream_on_flush() = (id=%u, pos=%u)} + connection {on_message,on_new_credentials} registered×3; aliases {on_selected_device_alias_changed,on_device_aliases_update_done}×2; dns {dns_lookup_callback}; socket {set_opt,rd_from,wr_to,readable,writable,local_addresses,...}×17; TLS/debug/error registered; base64 alphabet |
| `esdk_crypto` | **strong** | bignum asserts {mod\[mod\[0\]\] != 0,mod\[mod\[0\]\] & BIGNUM_TOP_BIT,mlen <= 2048 / BIGNUM_INT_BITS} = RSA-2048; login asserts {gen/genctx/s/send_buf/send_buf_size != NULL,send_buf_size >= sizeof(s->ctx.hello.data),work_buf_size >= MODPOW_WORK_RAM_SIZE,resp/respsz/buf/bufsz/failed != NULL,bufsz >= SHA1_DIGEST_SIZE + SIG_SIZE + SIG_SIZE + MODPOW_WORK_RAM_SIZE} = SHA1+dual-signature+modpow; "login failed (error code %d)"; "no memory to check signature"; "Platform identifier: '%s'"; "logging in with client ID %s"; "!"hal_get_random_bytes() failed""; circular buffer {cb->used <= cb->size,n <= cb->used,cb->used + data_size <= cb->size,dest != source,circular_buffer_available_space} |
| `esdk_internals` | **strong** | build "HEAD-v3.205.205-gd0f06121-dirty" for Sonos_PPC_e500v2s; notify enum {kSpConnectionNotifyReconnect,LoggedIn,Disconnect,TemporaryError("underlying Spotify error = %d, underlying OS error = %d, reconnect attempt in %u seconds"),kSpPlaybackNotifyBecameInactive/BecameActive,Pause,Play,AudioDeliveryDone,Next,Prev,MetadataChanged,ContextChanged,TrackChanged,Shuffle,Repeat}; errors {SpCallbackError "underlying Spotify/OS error","Track playback logging failed. Logout forced.","Connection state changed: %d -> %d","STREAM_CAPPED: underlying error","SP_EVENT_NOTIFY_TRACK_FAILED: underlying error",kSpErrorContextFailed,kSpErrorDuringLogout,"Still logged in. Logging out first.","RelativeSeek %i: current_position:%u -> new_position:%u","No connection available for login","Parsing ZeroConf blob failed with code %d","password is too long","Spotify server did not send image URL","Event overflow:",tsv_lost}; init validation {"api_version provided does not match expected (%d != %d)","Invalid device_type: %d","No memory block (%p) or invalid size (%u)","No unique_id set","display_name or device_aliases not set","Not allowed to fill both display_name and device_aliases","Either display_name or device_aliases must be set and not both","host_name not set with zeroconf_serve:%d","brand_name, model_name, client_id, os_version and/or scopes not set correctly (%d%d%d%d%d)","invalid max_bitrate:%d"}; config rules {scope/os_version/client_id must not be NULL,printable chars,length limits}; credential blob {"Can't invoke SpCallbackConnectionNewCredentials because no blob has been received","received blob has an invalid type","encryption failed","base64-encoding failed","Unable to create reusable login token"}; aliases {"Received alias index when aliases are not in use","Selected alias index out of bounds","No alias at selected index"}; image spotify:image:; trace levels {TPAPI,PLAY,DELIVERY,API_TRACE,VERBOSE,ANL}; trace fmts {"%s(%p, API v%d)","%s \[returned value: %d/%s\]"}; ~60 binary-resident sp_<md5-hex> identifiers (hashed config/credential slots) |
| `evo_decoder` | **strong** | {"Failed to query static params! %d","unable to close evo decoder error: %d","Failed to extract MD Evolution! ERROR %d","Unable to get evolution metadata","Failed to query Evolution decoder memory! Evolution err: %d","Failed initial query","Failed to allocate enough memory","Failed to allocate %llu static/dynamic byte for Evolution decoder!","Failed To Init Evo Decoder"}; UDC {udcMutex,"ERROR: %d getting frame metadata","Malformed input signal detected %d","ddpi_udc_timeslicecomplete returned %d","ERROR: %d Processing timeslice","ERROR: %d getting timeslice metadata"} |
| `expat` | **strong** | version expat_2.5.0; billion-laughs accounting "expat: Accounting(%p): Direct %10llu, indirect %10llu, amplification %8.2f" + debug env {EXPAT_ACCOUNTING_DEBUG,EXPAT_ENTITY_DEBUG,EXPAT_ENTROPY_DEBUG}; entropy /dev/urandom + fallback(4); attr types {CDATA,IDREF,IDREFS,ENTITY,ENTITIES,NMTOKEN,NMTOKENS}; xml namespace; errors {no element found,not well-formed (invalid token),unclosed token,partial character,mismatched tag,duplicate attribute,junk after document element,illegal parameter entity reference,undefined entity,recursive entity reference,asynchronous entity,reference to invalid character number/binary entity/external entity in attribute,"XML or text declaration not at start of entity",unknown encoding,"encoding specified in XML declaration is incorrect",unclosed CDATA section} + errors {error in processing external entity reference,document is not standalone,unexpected parser state,entity declared in parameter entity,"requested feature requires XML_DTD support",cannot change setting once parsing has begun,unbound prefix,must not undeclare prefix,incomplete markup in parameter entity,XML/text declaration not well-formed,illegal char in public id,parser suspended/not suspended/parsing aborted/parsing finished,cannot suspend in external parameter entity,reserved prefix xml/xmlns rules,"limit on input amplification factor (from DTD and entities) breached"}; config {XML_DTD,XML_CONTEXT_BYTES,XML_NS,XML_BLAP_MAX_AMP,XML_BLAP_ACT_THRES,XML_GE}; DTD keywords {SYSTEM,PUBLIC,ENTITY,ATTLIST,ELEMENT,NOTATION,CDATA,REQUIRED,FIXED,EMPTY,PCDATA,NDATA,INCLUDE,IGNORE}; decl {version,encoding,standalone}; encodings {UTF-16LE,UTF-16BE,UTF-8,US-ASCII} |
| `feature_config` | **strong** | {disableWebSocketPerMessageDeflate,metricsConfigURL,metricsConfigV2URL,preferredRPContainer,spotifyAdaptiveBitrate,enableSpotifyConnectForAllAccts,enableSpotifySMAPIVolumeNormalization,zoneExperiments,metricsService,enableVoiceDataCollection,enableSvcHomeControlLutron,enableSvcPlus,enableAmazonMusicDASH,enableAppleMusicHlsv7,enableTuneInReplacement,enableTuneInMigration,semiSleepConfig,enableTrueplayDataCollection,dropoutContext,enableSystemAPIV2,enable3ChannelSatellites,enableHTSNKv2,disableTlsRsaCiphersuites,enableSPSDataCollection,enablePortableSurrounds,aiseMinThreshold,enableMaxDialogueLevel,enableRemoveMSPCredentialsFromUPnP,thorTimeout,enableChsrcPerfOptimizations,enableUPnPEventingGNDOptimization,enableSecureAlbumArt,enableCEP20ThreadTweaks,smartPlayConfig,debounceWindowMilliseconds,debounceWindowMillisecondsCEP20,useLegacySpotifySmapiPlayback,quickbondingConfig,ssdpAdvertiseConfig,enablePitchfork,enableSslClientCacheRefresh,plink,enableDhcpProxyFailureTelemetry,homeTheaterWifiPerfTelemetry,enableOnDeviceSoundGeneration,enableRadioSocTemperatureTelemetry,enableHomeTheaterWifi6GHzFronthaul,reportHtSurrounds,reportHtSwap,reportPortableSurrounds,wifiTxRateThreshold,wifiLatencyThresholdMillis,requests,frequencyMins,delayRandPct,enableQuickbonding,enabledHT,thresholdDC,dropoutSensitiveDC,ssdpBroadcastOnlyZonePlayer1,ssdpAdvertiseOnlyEssentialServices,numLFEChannels,numHeightChannels,streamDescription,groupingLatency,enableTrueRoom,enableFlexibleSurroundsTuning,enableVirtualHeight,systemResult,numDevices,numUpdatedDevices} |
| `group_mgmt` | **?** |  |
| `hermes` | **strong** | roots {hm://hwptp/v1/devices,hm://hwptp/v1/tsv,hm://hwptp/v1,hm://hwptp/v2/resolve/%s/%d/%s}; device subs {%s/devices/%s/state,state_conflict,volume,play,set_shuffle,set_repeat,pull_playback,queue}; media {%s/content_encryption_key/%s,%s/cache_key,%s/offline/restrictions}; fields {random,checksum}; "!"Action not handled"" |
| `ht_telemetry` | **strong** | schema {corrId,cid set/clr,sessionLength,sessionPlayTime,connectionType,GCUUID,GCBootSeq,GCTimeStart,GCTimeEnd,inputRate,dataBurstType,contentType,playSeconds,forced,topoType}; tags {tv_usage,zpHTInputSession} |
| `htaudio` | **?** |  |
| `http_cache` | **strong** | directives {stale-while-revalidate,stale-if-error,no-store,private,public}; statuses {get_status_not_found,get_status_fresh,get_status_stale,get_status_stale_revalidate,get_status_stale_use_if_server_error,set_status_populated,set_status_refreshed,set_status_rejected}; "%s for key <%s> in cache <%s>"; "invalid cache key or record on set: \[keylen=%zu\] \[bodylen=%zu\] \[etaglen=%zu\] \[cclen=%zu\]"; "cache not updated due to no-store directive" |
| `http_engine` | **?** |  |
| `http_headers` | **?** |  |
| `ibt_planner` | **strong** | {"already generated ibt plan, no action taken","executing ibt plan for command (%s)","failed to generate target list for command (%s)","failed to generate ibt plan for command (%s)","implicit target parsed \[%s\]","explicit target parsed \[%s\]","invalid intendedTargets parameter","command does not support intendedTargets parameter","invalid muse command body format"}; JWT cert chain {"Unable to parse JWT token","Unable to load root bundle","Can't get client device certs","JWT cert validation finished: %s"} |
| `ibt_plans` | **strong** | a remote-management command executor: commands named in log domain 'ibt' are compiled into 'plans' (a generated target list — 'failed to generate target list for command (%s)'), then dispatched per-target with per-target results ('\[dispatch\] dispatched (%s) to target (%s), result \[%s\]'); gated by the enablePitchfork feature flag checked at init |
| `ir_decoder` | **strong** | encoding %02x%%20/%02x hex; lists {vol_up_codes,vol_down_codes,vol_mute_codes,input_codes} with "Cannot add X: list full." bounds; config /opt/ir/irconfig.txt + ":vol_up_codes:" keys + "IR not configured"; device {"Failed to open IR device!","Could not get IR file descriptor!","Loading active codes...","IR Controls %s"}; learn FSM {Capturing short code,"Short code is first of a series. Ignored!",Storing short code,"short so far %d and max: %d",Successful short code learn,First short long code learned}; algorithm {"Pass %d length %d learn count: %d",hex dumps,"first and third passes have different sizes!","don't match!","Insufficient redundancy in alternate code.","Successfully recognized code as Alternating.","Successfully recognized repeat code.","Mismatched short messages in suspected repeat code.","Successfully recognized a non - repeating code.","Learn summary: Success/Repeat style/Alt style %c","Over ten codes received... not a repeat style code","Ignoring excessively long code"}; one-button {"Entered one button learn",waiting/"no longer waiting",UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND,"One button code not found in DB due to timeout","Timeout during IR code learn for target %s"}; embedded remote DB {Sharp,LG / Haier TV L32D1120,Samsung,Panasonic,Toshiba,Mitsubishi,Philips,Pioneer,Dynex,RCA TV 46LA45RQ,Orion TV SLED3280-HDLCD3250,Mitsubishi WD-65638 & WD-60738,JVC TV JLC42BC3000 & LT-19E610,Seiki TV LC-32B56,SuperSonicSC-240 & 491,ViewSonic VT4210LED & VT3205LED,Loewe}; targets {VolUp,VolDown,VolMute}; DB ops {"attempting to add null remote","add remote to full db","too long a controller name","excessively long main/alt/repeat code",Uninstalled all codes}; cloud: submit POST http://ir.ws.sonos.com/IRCode/ XML <IRCode><code><value>%s</value></code><guid>%s</guid></IRCode> (guid via /dev/urandom); lookup "Requesting: %s" → "Code found for remote id \[%s\]!" / "Requested code not found in IR database"; "Outstanding codes yet to be learned: Lengths are: %d, %d, %d"; "Denylisted pyle!" |
| `jwt_auth` | **strong** | JWT errors {JWT_FAILED_TO_B64_ENCODE/DECODE,INPUT_JWT_MALFORMED,HEADER_INVALID,PAYLOAD_INVALID,SIGNATURE_INVALID,ALG_UNSUPPORTED,ALG_MISSING,X5C_MISSING,X5C_INVALID,X5C_UNTRUSTED,PRIVATE_KEY_MISSING,PRIVATE_KEY_INVALID,OUTPUT_JWT_SIGNING_ERROR,OUTPUT_JWT_INVALID_STATE}; alg HS256; endpoint POST https://oauth.{env}ws.sonos.com/oauth/v4/pdsw; grant urn:ietf:params:oauth:grant-type:jwt-bearer; aud urn:sonos:hhid:/urn:sonos:unit-hhid:; scope playback-control-all; keys {guestPermissionsPolicyKey,network_hash}; PIN {PIN Auth not available PIN not set,Invalid PIN,Invalid or expired nonce,Failed to generate nonce}; errors {Forbidden,Unauthorized,"Failed to get the real/relative time","Failed to stringify JWT","Device failed to generate device/guest token","Invalid Base64 encoded JSON object","Device unavailable due to other requests","Player not securely registered","An unexpected grant type was provided","An invalid JWT was provided. Reason:","A malformed JWT header/payload was provided","Player not in the assertion's aud field","POST /authorizeDevice request failed"}; claims exp+rexp {"exp is missing","Invalid exp value","Expired exp value",same for rexp}; token validation {"Device token not minted in this HH","Token is expired, security settings have changed since the token was issued","Device token expired","missing/invalid expiration time","not minted by this device","Device token is valid"}; statuses {MALFORMED,REVOKED,HOUSEHOLD,INVALID_REQUIRED_VALUE,NOT_MINTED_THIS_DEVICE}; muse_token_inspector; roles {VOICE_ASSISTANT,GUEST,ADMIN,EMPLOYEE} |
| `korn_events` | **strong** | {KORN_INITIALIZED,KORN_SHUTDOWN,WEBSERVER_START,WEBSERVER_STARTED,WEBSERVER_UPDATED,ZEROCONF_START,ZEROCONF_DEVICE_ADDED,ZEROCONF_TRANSFER_CRED,ZEROCONF_TRANSFER_STATUS,ZEROCONF_AUTH_TOKEN,ZEROCONF_AUTH_CODE,MDNS_START,MDNS_PAUSE,MDNS_RESUME,MDNS_DEVICES,MDNS_DEVICE_DISCOVERED,MDNS_DEVICE_EVICTED,MDNS_RETRIGGER_DISCOVERED_DEVICES,HOSTNAME,PLAYBACK_RESUME,PLAYBACK_RESUMED,TRACK_RESUME,OBSERVE_PLAY,SKIP_NEXT,SKIP_PREV,PLAYBACK_SEEK,PLAY_URI,QUEUE_URI,QUEUE_FINISHED,TRACK_STARTED,SET_SHUFFLE,SET_REPEAT,INTERNAL_SHUFFLE,INTERNAL_REPEAT,CONNECT_SET_VOLUME,AUDIO_DELIVERY_DONE,CONTEXT_FAILED,TW_UPDATED,PLAY_FALLBACK_FILE,QUEUE_FILE,TRACK_FINISHED,TRACK_FAILED,NOTIFY_TRACK_FAILED,INTERNAL_TRACK_STARTED,MEDIA_SEEK,PLAYBACK_INITIATED,PREVIOUS_POSITION,PLAYBACK_PROGRESS_STARTED,SET_DOWNLOAD_POSITION,NOTIFY_INTEGRATION_PLAYBACK_STARTED,NOTIFY_INTEGRATION_FINISHED_TRACK,NOTIFY_INTEGRATION_HAS_TRACK_LENGTH,NOTIFY_TRACK_ERROR,SEEK_COMPLETE,EXTERNAL_UNDERRUN_COUNT_POINTER,NOTIFY_STREAM_DELIVERED,STREAM_START,STREAM_START2,STREAM_STOP,STREAM_STARTED,STREAM_FINISHED,STREAM_FAILED,STREAM_CAPPED,FILE_SIZE,DATA_DOWNLOAD_LATENCY,CONNECTIVITY,DBG_DECODER_STARTED,DBG_DISCONNECT,DBG_UNDERRUN_TIMEOUT,DBG_DOWNLOAD_UNDERRUN,DBG_MDNS_ANNOUNCE,DBG_RESOLVE,DBG_PERIODIC_STATE_UPDATE,DBG_SET_KEY_RATE_LIMIT_ERROR,DBG_FORCE_STATE_UPDATE,DBG_INTERNAL_CDN_FINISHED,HWP_VERSION,ITEM_LIST_CHANGED,LOGOUT_REQUESTED,AP_CREATED,AP_CONNECT_ERROR,AP_DISCONNECTED,CONNECTION_STATE_CHANGED,AP_LOGIN,AP_SET_SESSION,NEW_PRODUCT_STATE,AP_LOGIN_OFFLINE,LOGIN_OFFLINE_ERROR,TPAPI_STATE_CHANGE,TPAPI_SHARED_STATE_POINTER,CACHE_ID,CACHE_KEY} + {OFFLINE_RESTRICTIONS,CACHE_RESTRICTIONS,OFFLINE_WAS_REQUESTED,API_RATE_LIMIT,AD_STREAM_TIME_POINTER,INIT_DONE,UPDATE_PLAYBACK_POS,SEEK_COMPLETED,MEDIA_SEEK_COMPLETED,ENDSONG,ENDSONG_FAILED,ACCESS_POINT_HOST,CONNECT_NAME,VOLUME_STEPS,GROUP_STATE,DISABLE_CONNECT,UPDATE_AD_USERAGENT,UPDATE_ALIASES,SELECTED_DEVICE_ALIAS_INDEX,CAN_PLAY,LOCAL_APRESOLVE,LOCAL_AP_PING_TIMEOUT,CONTEXT_STATE_POINTER,CONTEXT_OFFSET_OFFLINE,IMAGE_BASE_URL,STORAGE_MANAGER,SM_CACHE_CLEARED,PULL_PLAYBACK,PULL_PLAYBACK_NO_PLAYBACK_INTERRUPTION,UPDATE_CAPABILITIES,LOGGED_OUT,RELOGIN,DOWNLOAD_BITRATE_LOW,DOWNLOAD_BITRATE_HIGH,REQUEST_BITRATE,LOCK_BITRATE,NETLOG_START,NETLOG_CALLBACK,BANDWIDTH_LIMIT,STREAMER_TRACK_PERCENTAGE,OFFLINE_GET_ITEMS_IN_CONTAINER,REDELIVER_AUDIO_AT_RESUME,ACTIVATE_OFFLINE_PLAYER,ACTIVATE_ONLINE_PLAYER,NOTIFY_OFFLINE,CONNECTIVITY_CHANGE_REQUEST,RESOLVE_OFFLINE,OFFLINE_RESOLVE_FINISHED,CURRENT_OFFLINE_ITEM_POINTER,SHUFFLE_SEED}; modules {MediaOut,APConn,Streamer,TrackPlayback} |
| `korn_kernel` | **strong** | asserts {korn_ptr->_temp_ram_num_allocs == 0,korn_ptr->_temp_ram_free == (char *)korn_ptr->_temp_ram,aligned_size <= available_ram,korn_ptr->_temp_ram_num_allocs - 1 < MAX_KORN_TEMP_RAM_ALLOCS,ptr == korn_ptr->_temp_ram,sp_korn_event_count() < SP_MAX_EVENTS}; {"module %s pump returned error","%d is more than free space %td","!!! Too many requests/returns of temp ram!","Module requested %zu bytes","Ignoring recursive calls","event_loop_counter--","Initializing module %s","Module %d (%s) failed to initialize.","Event %d discarded, queue full","Module %d failed to shutdown. Possible memory leak."}; timers {"Timer scheduled for now+%lums. #timers=%lu","No free timer slots","Attempting to access unavailable timer. id=%d","Stopping unavailable timer. id=%d"}; korn_ptr/module_manager |
| `lechmere` | **?** |  |
| `leds_zp` | **strong** | HW features "setHwFeatures bHasMicrophone=%s, bHasMuteLED=%s, bHasStatusLED=%s, bHasOnlyStatusLED=%s, bHasHardwareLedSwap=%s, bCanSetWhiteBrightness=%s"; mode flags {R_LED_UPGRADE,R_LED_BROKEN_DEVICE,audiodev_flag,LED_MANAGER_HAS_AUDIODEV}; state "applyLEDModeLocked m_fLedBrightness=%5.2f, m_nextLedPatternPriorityLevel=%u m_lastClr=%d m_fade_effect=%d m_lLEDFlags=0x%llx m_bIsInExclusiveBTMode=%d m_bIsBTConnected=%d m_bHasStatusLED=%d m_bHasMuteLED=%d useOnlyStatusLED=%d"; ops {applyLEDMode,setWhiteBrightness,feedbackFlash,feedbackIrFlash,resumeDefaultLEDPattern\[Flash\],demoModeErrorFlash,executeDiagMode,updateCaptouchBrightness,setLEDBrightness,led_set_turnOffLocked,led_set_updateCaptouchBrightness,led_set_feedbackFlash}; "ignoring apply LED mode. m_bReady=%d"/"due to suspend bypass flag"; pattern fmt "ledWrite pattern: led_ids %08x repeat %d" + "rgb %d %d %d, hold %d, fade %d" + "cksum=%08x, flags=%04x repeats=%u num_steps=%u led_ids=%08x" + "step\[%d\]= r=%02x, g=%02x b=%02x hold_time=%u fade=%u"; HAL {led_get_hal_token,hal_led_diag,hal_led_flash,hal_led_write,hal_led_close,hal_led_brightness,hal_led_ir,led_util_open/close}; saved pattern {"ERROR allocating saved led pattern struct","enqueue restore pattern for LED state:0x%llx","has bFlashMode set. Returning saved pattern","no saved led pattern to flash"}; colors {white,"set default captouch feedback color to %s"}; mutexes {leds_zp mutex,leds_zp_internal}; R_LED flags {UPGRADE,BROKEN_DEVICE,JOIN_HH_OPEN,JOIN_HH,BEGIN_SETUP_MODE,IN_SETUP_MODE,WAC,WAC_TIMEOUT,BREAK_POP,SHUTDOWN,HHID,TRANSFER_REGISTRATION,CONTROL_FEEDBACK,IDENTIFY_PLAYER,AUDIO_OFF,MUTED,FAULT,WAITING_TO_PLAY,WAITING_TO_PAUSE,PLAYING,WARN,DEMO_MODE,DEMO_CONFIGURE_IR}; LED_MODE {FACTORY_RESET,BOOTING,JOIN_HH,JOIN_HH_OPEN,BYPASS_BLOCKED,BYPASS,CLONE_CHECK_FAIL}; "ERROR: bad set_pattern_for_mode(%d)"; "unknown restore pattern for LED state:0x%llx" |
| `libflac` | **strong** | "reference libFLAC 1.3.4 20220220"; errors {BAD_HEADER,FRAME_CRC_MISMATCH,UNPARSEABLE_STREAM,OGG_ERROR,SEEK_ERROR}; I/O statuses {WRITE CONTINUE/ABORT,LENGTH/TELL/SEEK OK/ERROR/UNSUPPORTED,READ CONTINUE/END_OF_STREAM/ABORT,INIT OK/UNSUPPORTED_CONTAINER/INVALID_CALLBACKS/MEMORY_ALLOCATION_ERROR/ERROR_OPENING_FILE/ALREADY_INITIALIZED}; states {SEARCH_FOR_METADATA,READ_METADATA,SEARCH_FOR_FRAME_SYNC,READ_FRAME,END_OF_STREAM,ABORTED,MEMORY_ALLOCATION_ERROR,UNINITIALIZED}; metadata blocks {STREAMINFO,PADDING,APPLICATION,SEEKTABLE,VORBIS_COMMENT,CUESHEET,PICTURE}; frame nums {FRAME_NUMBER_TYPE_FRAME_NUMBER,FRAME_NUMBER_TYPE_SAMPLE_NUMBER}; channels {INDEPENDENT,LEFT_SIDE,RIGHT_SIDE,MID_SIDE}; subframes {CONSTANT,VERBATIM,PARTITIONED_RICE,PARTITIONED_RICE2}; cue validation {lead-in div by 588,"at least one track (the lead-out)","lead-out track number 170 (0xAA)","may not have track number 0","track number 1-99 or 170","offsets evenly divisible by 588 samples","at least one index point","first index 0 or 1","index numbers increase by 1"}; PICTURE types {32x32 file icon PNG,Other file icon,Cover front/back,Leaflet page,Media,Lead artist,Artist/performer,Conductor,Band/Orchestra,Lyricist,Recording Location,During recording/performance,Movie/video screen capture,Bright coloured fish,Illustration,Band/artist logotype,Publisher/Studio logotype}; "MIME type printable ASCII 0x20-0x7e","description valid UTF-8" |
| `lla` | **strong** | status codes {WOULD_BLOCK,UNDERFLOW_OVERFLOW,NO_CSB,INVALID_DATA,SUSPENDED}; out {lla_hdmi,"device open failed, unsupported device type %d","opening lla output device","could not get device rc %s lrc %s fd %d","Setting tx latency %u - rc %d","could not get output limits","could not set tx latency rc %d try %u got %u","could not get combined time and output delay"}; timing {"underflow count not cached, returning 0",lla-select,"play time in the past","adjusted play time in the past","%s %s current time %d.%06d play time %d.%06d write at %d.%06d","could not get sample unit time ticks","could not get time","could not get output delay","time requested %d.%06d current time %d.%06d diff %dus devPlayTime: %llu devCurrentTime: %llu diff in sample unit time %llu"}; IO {"fd not set fd=%d","timed out fd=%d","select failed fd=%d errno=%d %s","no output fd %d","low level interface could not fulfill request. error %d uf %u","callback failed, playing zeros %d","commit error (%d) before caching underflow count","could not get buffer information"}; input {"Device is not open","Failed to open the input device:%d, status:%s","id:%d fd:%d min:%u max:%u dflt:%u bufs:%u channels:%u frame:%u jitter:%zu","Failed to get fd","closed input device fd:%d","lla.in.poll","Select returned but LLA fd not set","Failed to get rx time in ticks/rx time","Could not get input delay/input time and delay","Failed to flush the input",liblla_input,lla_in_%s,"Failed to set pipe to nonblocking","Failed to create pipe","pTmpFrame buffer is NULL","Failed to copy buffer contents","Trying to copy more bytes than expected. attempted %d maxbytes %d","could not release buffer after read","Buffer Passed in is NULL","No readable data available. Previous ret:%s fd:%d","read failed status: (%s) fd: %d"}; event objects {"Failed to add event object %s","Invalid object index","Add fd for object %s","Wait for input failed: %d","Spurious Input Event 0x%x","Remove object %s","Failed to find object for releasing","Object %s was not formally released"}; liblla |
| `local_settings_mgr` | **strong** | files {_attrdata.json,_exclude.json,_settings.json,_effective.json,settings_targettypes.json,__location_summation,__migration_data}; models key; magic header "{\"magic\":\"`\|_(:/)_\|`\",\"length\":%u,\"checksum\":\"0x%08X\",\"counter\":%u}" + trailer "{\"magic\":\"(=^+^=)\",\"version\":11}"; ops \[Mg\] {setLocationSettings("did not advance i:%llu \[c:%llu\]",write failure,"!= locationId","dropping unfamiliar group"),performSingleGroupWriteOperation("validation failure","performing write"),performMultiGroupWriteOperation,setupLocalSettingsManagerImpl("readJsonFile failed","ingestSettingsTargetTypesData failed","ingestLocationFromStorage failed"),getEffectiveSettings("bad groupId"),updateMultipleSettings("ingestPatchAttribute failure"),updateSettings("bad keyId"),readSettingsFromMultipleSettingsGroups,internalReadSettings,internalReadEffectiveValuesLocked("bad keyId","hetType mismatch"),updateGroupSettings}; migration \[Mm\] {persistMigratedDataLocked,"unexpected twoLetterStr","unbalanced collectionStr","missing","not an object"}; patch \[Pc\] {completePatchAttributeIngest "type mismatch vT/aT"}; request auth \[Rq\] {permBits,calculateUserPermissionsJSON,"attempt to subvert read authorization","attempt to update location only settings","attempt to subvert write authorization",setupUpdateAllRequest/setupUpdateRequest/setupGetRequest "not found"/"excluded"/"invalid target type"}; storage \[Gp\] {writeMetaDataToStorage,writeSettingsToStorage,setupSettingsContainerFromStorage "success from old schema"/"settingsStorage not found",setupMetaDataFromStorage}; location \[lo\] {ingestLocationFromStorage "dropping unfamiliar group",ingestLocationSettingsFromCloud,ingestGroupForLocation "attribute not found","dropping unfamiliar setting"}; metadata {effectiveMetaData,locationMetaData}; eventing {LocalSettingsEventing::waitUntilEventNotificationCompletes,notifyOnChange notifySubscribers}; errors {INCORRECT code:%08X,FATAL code:%08X,DATA_CORRUPTION\[%08X\] settings group} |
| `mdns` | **Failed to dump mDNS state into diagnostic: %i; /status/opt/log/mdnsd.log page + /opt/log/mdnsd.log file** |  |
| `mdns_device` | **strong** | TXT keys {byebyereason,protovers,minApiVersion,mhhid,hhsslport,variant,mdnssequence,locationid}; "Truncation in formatting service name" |
| `mod_zp` | **?** |  |
| `muse` | **?** |  |
| `muse_engine` | **?** |  |
| `muse_enums` | **strong** | actor/transport {PLAYER_TO_PLAYER,BLE_DTLS}; authz resources {AUTHZPOLICIES,DEVICES,ENTITLEMENTS,SETTINGS,HISTORY}; perms {PLAY_TO_BONDED,STOP_CONTENT,USE_SHARED_QUEUE}; content types {CHAPTER,SMAPI_CONTAINER,EPISODE,PLAYLIST,PODCAST,PROGRAM}; credential types {ACCESS_TOKEN,API_KEY,GUEST_TOKEN_PIN}; SFB perms {SRADIO_HD_CONTENT,SRADIO_SPECIAL_CONTENT,SRADIO_ONDEMAND_ARCHIVE,SRADIO_CAN_SKIP,SFB_BASIC_UI,SFB_COMMERCIAL_MSP,SFB_ESSENTIALS_MSP,SFB_PREMIUM_MSP,SFB_DASHBOARD_ACCESS,SFB_CNTRL_MEDIA_SRCS,SFB_CNTRL_THIRD_PARTY,SFB_RSTC_CONTENT_ACS,SFB_RSTC_SAVE_CONTENT_ACS,SFB_RSTC_SETTINGS_ACS,SFB_RSTC_ALARMS_ACS,SFB_RSTC_MESSAGING_ACS,SFB_RSTC_SAVE_GROUPS_ACS,SFB_SCHEDULES_ACCESS,SFB_MVP}; playback states {BUFFERING,PAUSED,PLAYING}; queue ops {APPEND,INSERT,INSERT_NEXT,PLAY_NOW}; ratings {EXCELLENT,POSITIVE,NEGATIVE,RATED,THUMBSUP,THUMBSDOWN,SHELVED}; registration {LEGACY_REGISTERED,SECURE_REGISTERED,TRANSFER,PREP_TRANSFER}; netmode {NETMODE_SONOSNET_WIRELESS,NETMODE_WIRED,NETMODE_WIRED_NO_WIFI,NETMODE_STATION,NETMODE_SATELLITE_V1,NETMODE_SATELLITE_V1_WIRED,NETMODE_SATELLITE_V2,STATION_SATELLITE}; roles {VOICE_ASSISTANT,GUEST,ADMIN,EMPLOYEE}; FORBIDDEN; USB_C; GOOGLE; recurrence + {alarm states: ALARM_PENDING,ALARM_SNOOZED,ALARM_FIRING,INTERRUPTED; buttons: PLAY_PAUSE,MUSIC,DPAD_UP/DOWN/LEFT/RIGHT/SELECT; sources: CLOUD,HT_PLAYBACK,HT_POWER_STATE,AIRPLAY,AUDIO_CLIP,SPEAKER_DETECTION,FIXED_VOLUME,ROOM_DETECTION,IR_CONTROL,ALEXA_CBL; errors: CHARGER_NOT_COMPATIBLE,CONFIGURING,NO_LOGICAL_ADDRESS,EXTRALOCAL; abort: ABORT_INCORRECT_MODE,ABORT_NO_SOURCE,ABORT_INVALID_OP,ABORT_REFUSED,ABORT_UNDETERMINED,REPLY_TIMEOUT,ROOT_INDIRECT,BROADCAST_BLOCKED; groups: MUSICOBJECTID,GROUP_STATUS_MOVED,GROUP_STATUS_UPDATED; update: UPDATE_COMPLETE,INFO_FILE_WRITE_FAILED,BSU_FAILED,UPGRADE_MGR_SPAWN_FAILED,MANIFEST_DOWNLOAD_FAILED,MANIFEST_PARSE_FAILED,UPDATE_NEVER_RUN,FINAL_RESULT_UNKNOWN; surrounds: VERTICAL_WALL_BELOW,FLEXIBLE_SURROUNDS,PORTABLE_SURROUNDS; sec: SECURE,SECURE_REG,UPNP_OVER_TLS; indexer: ADD_IN_PROGRESS,ADD_COMPLETE,PENDING_REINDEXING,REINDEXING_IN_PROGRESS,REINDEXING_COMPLETE,REPLICATION_IN_PROGRESS,REPLICATION_COMPLETE,PENDING_DELETE,DELETE_COMPLETE; sonosnet: SONOSNET_DISABLED,SONOSNET_DISABLE_TEST; conn: ONLINE,TERMINATING; chirp: INAUDIBLE_WIDE,MULTI_INAUDIBLE_WIDE,MULTI_AUDIBLE; timers: TIMER_PAUSED,TIMER_RINGING; power: TO_STANDBY,POWERING_DOWN,POWERING_UP,SMART_DOCKED,PRIMARY_PLAYBACK_STARTED,POWERING_UP_UPDATED,WAKING_UP_FROM_USER,PRIMARY_NETWORK_STATUS_CHANGE; volume: FIXED,PASS_THROUGH; wifi: ACK_AWAIT,WIFI_DISABLING,WIFI_DISABLED,ACK_NOT_RECEIVED; positioning: APPLE_MOBILE_DEVICE,ANDROID_MOBILE_DEVICE,STIMULUS_PLAYBACK_COMPLETE,BEARING,DISTANCE,ACOUSTIC_SPACE_MAP,MEASUREMENT_RESULTS,MEASUREMENT_RAW_AUDIO,IMPULSE_RESPONSE_AND_AUDIO; HEY_SONOS; RADIOLIST} |
| `muse_errors` | **strong** | results {CREATED,ACCEPTED,SUCCESS_NO_CONTENT,SUCCESS_NOT_MODIFIED}; playback {ERROR_PLAYBACK_FAILED,NO_CONTENT,NO_PLAYABLE_CONTENT,EXPLICIT_NOT_ALLOWED,EXPIRED_TOKEN,NOT_PLAYABLE,SPOTIFY_CONNECT,FAILURE_TO_ENQUEUE,CLOUD_QUEUE_SERVER,SKIP_LIMIT_REACHED,PLAYBACK_STREAM_LIMIT,PLAYERS_HAVE_INCOMPATIBLE_FIRMWARE}; session {SESSION_IN_PROGRESS,JOIN_FAILED,EVICTED,INVALID_SESSION_ID,NOT_DESIGNATED_DEVICE}; accounts {PREFERRED_ACCOUNT_NOT_SET/NOT_FOUND,ACCOUNT_FULL,INVALID_ID,NO_DEFAULT_FOUND,REAUTH_REQUIRED,UPGRADE_REQUIRED,WRONG_SERVICE}; update {NO_UPDATE_AVAILABLE,INVALID_UPM_FORMAT,INSUFFICIENT_POWER_FOR_UPDATE,UPDATE_IN_PROGRESS}; misc {ALARM_NO_SPACE,ALARM_BAD_TIME_SERVER,AREAS_READ_ONLY,AUDIO_CLIP_ID_NOT_FOUND/_MEDIA_ERROR/_PAUSE_CONTENT_FAILED/_VOICE_ASSISTANT_PLAYING,CACHE_NOT_FOUND/_RECORD_NOT_FOUND,CANT_CONNECT\[_REMOTE\],DEVICE_ALREADY_REGISTERED/UNAVAILABLE,INVALID_ACTION,DOWNSTREAM_CONNECT_FAILED,SHARES_CONFLICT/NO_SUCH_SHARE/NO_SPACE/REQUEST_FAILED,STIMULUS_ALREADY_PLAYING,MICROPHONE_NOT_ENABLED,NO_POSITIONING_RESULTS,UNSUPPORTED_POSITIONING_REQUEST,SVC_DISABLED,TIMER_NOT_FOUND,UNSUPPORTED_VOLUME_MODE,INVALID_RESOURCE,ROOM_DETECTION_SIGNALLING_FAILED/BUSY,GROUP_CHANGED}; generic {COMMAND_FAILED/TIMEOUT,CONTENT_TYPE_NOT_SUPPORTED,DISALLOWED_BY_POLICY,INTERNAL,INVALID_AUTH_HEADER/CERT/OBJECT_ID/PARAMETER/SYNTAX/HEADER/LENGTH/TRANSPORT,TARGET_ID_NOT_FOUND,LOAD_COMMAND_FAILED,MISSING_PARAMETERS,NO_PERMISSION,NOT_AUTHORIZED,NOT_CAPABLE,PRECONDITION_FAILED,EXPECTATION_FAILED,QUEUE_FULL,RESOURCE_GONE/CONFLICT,REQUIRES_GROUP_COORDINATOR,SERVICE_NOT_AVAILABLE/CONFIGURED/SUPPORTED/UNAVAILABLE,UNSUPPORTED_NAMESPACE/COMMAND/REQUEST/REQUEST_METHOD,API_KEY_VALIDATION_FAILED,NYI,CMD_FUTURE,CMD_REMOVED,INSUFFICIENT_RESOURCES,INCORRECT_STATE,INCOMPATIBLE_API_VERSION,INCOMPATIBLE_CLIENT_VERSION}; param validation {MISSING_VALUE,UNEXPECTED_TYPE,"Parameter failed timestamp validation","not a valid Muse error code","out of range: at or below minimum of/above maximum of","Found unexpected array/object","Missing required field","Unable to coerce string to number/boolean","number of entries below/above minimum/maximum"} |
| `muse_events` | **strong** | {accessorySwapStatus,tvAudioSignalStatus,activeZonesChange,zoneDefinitionsChange,zoneError,alarmClock,alarmVersionChange,areasVersionChange,audioClipStatus,audioInput,availableSoftwareUpdate,avTransport,batteryStatus,wirelessNetworkStatus,microphoneSwitchStatus,waterStatus,bluetoothPairingStatus,bluetoothConnectionStatus,poeStatus,lineInStatus,wiredSubConnectionStatus,cloudRegistration,connectionManager,contentDirectory,deviceProperties,diagnosticSubmissionResults,diagnosticMetadata,effectiveSettingsDataChanged,entitlementsVersionChanged,extendedDeviceStatus,extendedPlaybackStatus,favoritesVersionChange,groupCoordinatorChanged,groupManagement,groupRendering,hdmiStatus,historyVersionChanged,householdUpdateStatus,upgradeManager,htControl,indexerStatus,musicServices,musicServicesChanged,playbackMetadataStatus,playbackStatus,playlistsVersionChange,positioningSessionStatus,positioningSessionError,positioningDeviceStatus,renderingControl,sessionError,sessionInfo,settingsVersionChanged,settingsDataChanged,settingsPlayerSettingsChanged,sleepTimerStatus,systemProperties,trueplayStatus,speakerPresenceStatus,speakerPresenceRateChange,trueroomAdaptationStatusEvent,trueroomCalibrationStatus,trueroomStatusEvent,virtualLineIn,voiceAccountsVersionChange,zoneGroupTopology,upnpEvent} |
| `muse_types` | **strong** | 203 contiguous alphabetical type names @0x10f975c0-0x10f98568 - the TYPE-NAME space used in spec {field,type} pairs (semantic spec idx -> table\[3+idx\]). Followed by muse_target_validator + errors {guest_access_disallowed,forbidden,not_authorized,not_found}. Types are object-schema names; 'upnpEvent' (11 identical entries, one per bridge namespace) is the universal value/event wrapper appearing as the type of nearly every status field. |
| `muse_verb_ns_registry` | **confirmed** | Pair table @.data 0x110941d8: {namespace_name_ptr, verb_name_ptr} x~320 entries, terminated ffffffff. Binds every verb to its namespace (authorization/resolveToken, catalog/translate, entitlements/*, groups/*, history/*, playback/*, zones/*, systemReporting/*, smartplay/getContent...). Preceded by 2-char event-code table (AA..AK @0x110941a4) and hash seeds h1/h2. |
| `muse_verbs` | **strong** | areas {getAreas,createArea,updateArea,removeArea}; audioClips {loadAudioClip,cancelAudioClip,clipMetadata}; authz {getPolicyKey,getPermissions,grantType,assertion,objectType}; cloudRegistration {getRegistrationStatus,setRegistrationState,transferDeviceRegistration,vanishedDevices,quarantinedDevices}; diagnostics {submitDiagnostics,results}; settings {getSettingsGroup,updateAllSettings,updateSettingsGroup,targetSettingsOnly,namespaces,delayMillis,subscribe/unsubscribePlayerSettings,get/setPlayerSettings,setAllowMicrophone,setSelfTruePlay,setEnablePositioningMeasurement,setSonosNetChannel,get/setRestrictedAdminSettings,setUserMetricsTracking,getPublicSettings,getProtectedSettings,getProtectedAdminSettings,"v1/players/%s/settings/player"}; entitlements {subscribeUser,unsubscribeUser,getEntitlements}; history {removeHistoryItem}; deviceProperties {setName}; householdUpdate {getHouseholdUpdateStatus,isRunning,designatedDeviceId}; irControl {getIRControl}; indexerStatus {getIndexerStatus,updating}; musicServiceAccounts {getPreferredMusicServiceAccount,endDirectControl,__provisioned__,availableServicesVersion,registeredServicesVersion}; networks {temporarilyDisableNetwork,startNetworkTests,getNetworkTestResults}; playback {togglePlay,menuType,dpadDirection}; cache {cacheSettings,cacheKey,invalidateCache}; playlists {getPlaylists,getPlaylist,postPlaylist,loadPlaylist}; positioning {playStimulus,set/getStimulusTuning,startSession,cancelSession,applyAction,getSessionMap,getDeviceMeasurements,sendMeasurements,notifySessionError/Status/DeviceStatus,getMeasurementCapabilities,setTelemetryLevel,measurements}; roomDetection {stopSignalling}; sleepTimer {getSleepTimer,remainingTimeDuration}; smartplay {getContent}; soundSwap {requestSwap}; svc {getWeatherConfig,voiceCommand}; systemTime {get/setTimeZoneInfo}; timers {setRelativeDuration,pauseTimer,resumeTimer,abortTimer}; trueplay {detectSpeakerPresence,resetDetectedSpeaker,setSpeakerPresenceRate,get/setConfiguration,getTrueplayStatus}; trueroom {playSuccessTone,setSwapInputMute,trueroomEstimatedParams}; virtualRemoteControl {sendButtonCommand}; voice {wakeword,amazon,getVoiceAccounts,updateVoiceAccount,removeVoiceAccount,createAmazonChallenge,notifyInitiateOnboarding,timeoutSeconds}; zones {backhaulChannel,getActiveZoneList,getZoneDefinition(List),addZoneDefinition,addMissingZoneDefinition,updateZoneDefinition,updateActiveZone,updateZoneMemberSettings,removeZoneDefinition,activateZone,deactivateZone,joinZone,unjoinZone}; renew |
| `music_accounts` | **?** |  |
| `network` | **?** |  |
| `network_tools` | **strong** | forms {"Tools for debugging network issues"}; /bin/ping -c 3 + /usr/bin/traceroute + nslookup + /mdnsannounce; POST params {host,csrfToken}; /pcap streams trace.pcap (Content-Disposition attachment) via /bin/pcap - not (host %s and port %d) exclusion filter |
| `nodetx` | **?** |  |
| `player_settings` | **strong** | keys {volumeMode,monoMode,wifiDisable,meshDisable,wifiPowerSave,batteryUsagePolicy,bluetoothPolicy,networkingMode,lineIn,eq (treble),eq (bass),eq (loudness),gainTrimDB,zone attributes}; volume modes incl PASS_THROUGH ("EQ cannot be adjusted in PASS_THROUGH volume mode") + "Device does not support fixed output"; "Satellites not supported; configure primary device"; "monoMode (not supported in setup)"; wifiDisable reasons {reason unknown,netstart refused,no Ethernet carrier,meshDisable (netstart refused)}; "Netstart failed to modify meshDisable setting"; "Unable to set setting(s): ... (unsupported)"; actors {PlayerSettings,PlayerSettingsManager,playersettingsmgr,gmSat,ukwnt} |
| `product_models` | **strong** | codenames {Default,Playbar,ElRey,Bravo,Hideout,Pallas,Apollo,Lasso,Play1,TitanWOW-T,TitanWOW-P,TitanWOW-G,Monaco,Play3,Encore,Alpine,Pinewood,Prima,Mojave,Optimo2,Optimo1}; ZPS ids {ZPS11,ZPS12,ZPS13,ZPS14,ZPS15,ZPS16,ZPS17,ZPS18,ZPS19,ZPS20,ZPS21,ZPS22,ZPS23,ZPS24,ZPS26,ZPS27,ZPS31,ZPS35,ZPS37,ZPS38,ZPS43,ZPS54,ZPS55,ZP120,ANVIL}; dspconfigparam + "ConfigParam lookup from player model %d failed" |
| `protocol_info` | **strong** | schemes {http-get,x-file-cifs,file,sonos.com-mms,sonos.com-http,sonos.com-spotify,sonos.com-rtrecent,x-rincon,x-rincon-mp3radio,x-rincon-playlist,x-rincon-queue,x-rincon-stream,x-sonosapi-stream,x-sonosapi-hls,x-sonosapi-hls-static,x-sonosapi-radio,x-rincon-cpcontainer}; mime types {audio/mp3,audio/mp4,audio/x-m4a,audio/mpeg,audio/mpegurl,audio/x-mpegurl,application/x-mpegurl,application/vnd.apple.mpegurl,application/dash+xml,audio/mpeg3,audio/wav,audio/x-wav,audio/wma,audio/x-ms-wma,audio/aiff,audio/x-aiff,audio/flac,application/ogg,audio/ogg,audio/x-spotify,audio/x-sonos-recent,audio/x-sonosapi-radio}; vars {SourceProtocolInfo,SinkProtocolInfo,CurrentConnectionIDs}; actors {ConnectionManagerServer,ConnectionManagerRenderer} |
| `queue_schema` | **strong** | <Queue Name='%s'><EntriesMax>%d</EntriesMax><EntriesUsed>%d</EntriesUsed><EntriesHighWater>%d</EntriesHighWater><StringTableSize>%d</StringTableSize><StringTableUsed>%d</StringTableUsed><StringTableHighWater>%d</StringTableHighWater><UpdateID>%u</UpdateID><ObjectID>%s</ObjectID><OwnerID>%s</OwnerID><Policy>%d</Policy><CloudQueueHost>%s</CloudQueueHost></Queue>; <TrackQueueSummary>Shared/Private</TrackQueueSummary>; GPM {com.google.RemoteSonosReceiver,Google Play Music} |
| `radiolog` | **?** |  |
| `rc_impl` | **strong** | events {RcStateUpdateEvt,VolumeChangedEvent,DuckingEvent,ProxiedFastVol0Event,StereoPairStateEvent,TrueplayCalibrationChangedEvent,TrueplayStateEvent,RcNotifyGrcEvent,FeatureConfigChangedEvent,LocalPlayerChangeEvent,UpdateSonarEvent}; "Delivery of %s(%u) event cancelled"; RStringTRequestManCB; settingsWriteback; roles {HT_BONDED_MASTER,HT_BONDED_SATELLITE,UNBONDED_DEVICE,Master}; HT params {SubGain,SubCrossover,SubPolarity,SubEnable,VolumeScalingFactor,HeightChannelLevel,DialogLevel,SpeechEnhanceEnabled,SupportsMaxDialogLevel,SurroundLevel,MusicSurroundLevel,SurroundEnable,SurroundMode,AudioDelay,AudioDelayLeftRear} |
| `registration` | **?** |  |
| `registration_machine` | **?** |  |
| `rendering_control` | **?** |  |
| `reporting` | **?** |  |
| `saved_queues` | **strong** | file:///jffs/settings/savedqueues.rsq (+.tmp write path, .d.rsq variant, application/gzip accepted); XML <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"><SavedQueue Id= Curated= NumTracks=%u><Track URI= MD=></SavedQueue></SavedQueues>; validation: corrupted track count, invalid queue-id/next-id/mismatch, invalid version/numtracks, boot file invalid; migration "Migrating ObjID=%s SN=%u from SID: %u to %u"; SQ:%s objid prefix; <res protocolInfo="file:*:audio/mpegurl:*">; album-art: "No num tracks found, so emitting the first four artworks found"; mobile- playlist prefix; "Add Track Move range: %u-%u to %u"; replication push on save |
| `sentry_upload` | **strong** | routes {/upload,/watchdog,/anacapad-external,/sonospowercoordinator-external,/watchdog-legacy,/legacy-to-sentry,/btmanager-external,/sonosledmgrd-external,/netstartd-external}; dumps {anacapad.core,anacapad.dmp,sonospowercoordinator.dmp,btmanager.dmp,netstartd.dmp,/jffs/app/debug/sonosledmgrd.dmp}; sidecars {.properties per daemon,sonospowercoordinatorCrashCount,netstartd.count}; attachments {watchdog.log,watchdog.dmesg,/opt/log/anacapa.hdmi.log,/opt/log/anacapa.tv.log,/tmp/AirPlay.log,/opt/log/btmanager.log,/opt/log/btservice.log,/tmp/backtrace}; opt-out flag prevent_crashdump_upload + /tmp/anacapa_prevent_crashdump_upload; sentry schema {sentry\[release\]=build.version,sentry\[tags\]\[%s\],sentry\[user\]\[id\],%s\[sonosID\],%s\[hhid\],%s\[serial\],%s\[upload_sw_version\],%s\[hardware_version\],%s\[model\],%s\[upload_spotifyesdk_version\],%s\[play_state\],%s\[watchdog_crash\]}; form-data + text/plain; charset=UTF-8/us-ascii + application/octet-stream; gzip stream "writeStream failed - Bytes compressed: %d/%d"; play-state file /tmp/crashed_play_state + htsnk; results {"Minidump \[%s\] uploaded to sentry.io. UUID: %s","Coredump \[%s\] successfully uploaded","didn't finish upload; http resp: \[%d\]; last error: \[%s\]","did not return a UUID","No URL found"}; dump file %s-anacapa_dump.gz + originator + Version: |
| `settings` | **?** |  |
| `share_indexer` | **strong** | ops {localRemoveUnsupportedShares,localRequestReindex,localRequestResort,"Turning resort request into full reindex"}; reindex "request reindex (ad:%d sf:%d fr:%d si:%d st:%d lc:%s)"; schema <Shares LastUpdateDevice AlbumArtistDisplayOption IndexSortOrder LastIndexChange><Share Path UserName Password VerifiedValidProtocol Id>; errors {"Unable to find share with given ID","Failed to remove/add share","The share path provided already exists","need to recover ix=%d ver=%d","indexing reported err=%d for %s","Mounting failed.","Local index storage error.","Remote file share error.","Indexing canceled.","connection failure","Cannot exceed the maximum number of allowed shares","The path provided is subsumed by an existing share","Path is malformed","Access to share is denied","Unsupported share protocol."}; lifecycle {"replication failed","replication skipped: local fmt %u, remote fmt %u","initial scan for new files failed","Would have performed scheduled reindex but shares unchanged","reindexing failed","reverting desired state: %d","processing index complete (c:%d i:%d f:%d lc:%s) - %u","skipping commit attempt: m_bCommitted/m_bWait/m_bTerminate","initialized index, scheduling advertise","commit %u","processing index: source (%s:%u)","recovered ix=%d with ver=%d"}; R_BrowseByFolderSort,Tracknum |
| `smapi_client` | **strong** | action namespace http://www.sonos.com/Services/1.1\|{...}; actions {getSessionId,refreshAuthToken,getDeviceAuthToken,getStreamingMetadata,getUserInfo,getMediaURI,getMediaMetadata,getMetadata,search,reportAccountAction,reportPlayStatus,reportPlaySeconds,setPlayedSeconds,reportStatus,getAlbumArtURI}; session/key vocab {deviceSessionToken,deviceSessionKey,CK_deviceSessionKey,contentKey,CK_contentKey,MU_deviceSessionKey,MU_contentKey,authToken,privateKey,userInfo,algorithm,keySize,value,expiration,httpHeaders,mediaRequestInfo,uriTimeout,contentKeys,callbackPath}; mediaURI fields {positionInformation,privateDataFieldName,contentKeys}; browse params {recursive,count,index,total,mediaCollection,mediaMetadata}; report schema "reportPlayStatus: %s; context: %s; uri: %s; cid: %s; id: %s; seconds: %lld; offset: %lld" + contextId + interval; semantics enum {IMPLICIT,EXPLICIT:PLAY,EXPLICIT:SEEK,EXPLICIT:SKIP_FORWARD,EXPLICIT:SKIP_BACK,EXPLICIT:PAUSE}; metadata URNs http://purl.org/dc/elements/1.1/\|{id,creatorId} + urn:schemas-rinconnetworks-com:metadata-1-0/\|{narratorId,podcastId,summary,total,duration,authorId,bookId,producerId} + urn:schemas-upnp-org:metadata-1-0/upnp/\|artistId; browse hierarchies {newrelease:album:genre:,staffpick:album:genre:,top:album:genre:,top:track:genre:,playlist:,%s.#%s,favorite:track,artist_tracks:}; skd://itunes.apple.com/P000000000/s1/e1 FairPlay; X-Sonos-Playback-Id header; "reauthorizing preinstalled service SID %u"; "mult-key decrypt params not found"; "WARNING! getDeviceAuthToken ... credentialType = %u (not OAuth)"; secondsSinceExplicit; "flushing on cert change"; media-sens cache {cont_prov_media_sens,content_prov_list,billboard,"cached/loaded/reset session %u:%u"} |
| `smb` | **?** |  |
| `sntp` | **?** |  |
| `spdif_burst` | **strong** | supported {Dolby Digital,Dolby Digital Surround,Dolby Digital Plus,Dolby Atmos (DD+),Dolby TrueHD,Dolby Atmos (TrueHD),Dolby MAT,Dolby Atmos (MAT),DTS (Type1),DTS (Type2),DTS (Type3)}; unsupported enum {NULL Burst,Pause Burst,AC-3,SMPTE 338M v1-v5,MPEG1 Layer 1,MPEG1 Layer 2/3,MPEG2,MPEG2-AAC,MPEG2 Layer 1/2/3 LSF,DTS1-4,ATRAC,ATRAC 2/3,ATRAC X,WMA Professional,MPEG2 AAC LSF,MPEG4 AAC,Enhanced AC-3,MAT,MPEG4 ALS,Reserved 2-4,Extended Data,MPEG4 AAC LC in LATM/LOAS,MPEG4 HE AAC in LATM/LOAS,DRA} all prefixed "Unsupported "; this is the IEC 61937 data-type code map (NULL/PAUSE are IEC-61937 burst types; MAT = Dolby MAT container; DRA = DRA Chinese standard); per-type error counters tv_decoder_error_{dd,ddp,mat,pcm,dts1,dts2,dts3} + tv_decoder_dsp_error_dap |
| `spec_descriptors` | **confirmed** | 383 object-spec descriptors in 2 contiguous tables: @.rodata 0x10e9ba80 (96 records) and 0x10f9f87c (287 records). Each 0x80-byte record = C++ descriptor object: ctor @+0x00 installs vtable; +0x20 accessor fn returns {classId 1-12, spec-list ptr}; +0x24 = ffffff88 marker; +0x2c/+0x30/+0x4c-0x54 = per-object ops; +0x58..+0x7c = shared thunk tail. Spec-lists decoded under the corrected index space (semantic idx -> table\[3+i\], via f_109ecb5c): {fieldName,typeName} pairs - see spec_pair_stream. First-field distribution (corrected): 'ok' leads 170 specs (status field first), 'upnpResponse' 60 (UPnP-bridge ops), object-typed roots (timer, zoneDefinition, alarm, playerAllSettingsGroups, accountError, groupInfo, musicServiceAccount...). classId correlation (corrected): cls3 = upnpResponse-led (UPnP-bridge RESPONSE objects, n=45) + ok-led; cls1/cls2 = ok-led request/response specs; cls4-7 = event/update shapes; 52 descriptors empty (no-param ops). Descriptor members are CHILD-OBJECT refs (the field's declared type), not wire param names - matching descriptor members against route op_params showed zero overlap (e.g. authzGrant spec refs authorizationGrant{Header,Payload,Response} which internally carry grantType/assertion). Verb binding via op-vtable +0x58 spec accessor -> {classId,blob} (558/603 routes bound). |
| `spec_object_table` | **confirmed** | Pointer table at .rodata 0x10f97088-0x10f975b0, 331 entries. Slots 0-2 = function pointers (0x10809540, primitive formatters) - unreachable via the semantic index space. RUNTIME INDEXING RESOLVED: idx->name lookup f_109ecb5c uses base 0x10f97094 (=table+3) with bound 326, i.e. semantic index i maps to table slot i+3; name->idx f_109ecb90 strcmps from 'none' forward. Semantic idx0='none' (table slot 3). Semantic idx 1..325 = named objects: ~203 contiguous alphabetical type names @0x10f975c0-0x10f98568 (accessorySwap..zoneMemberState), 40 event-type names, 11x upnpEvent (per UPnP-bridge namespace), namespace/resource names. The 'entries' list below uses RAW table slot numbers (add -3 for the semantic spec index). |
| `spec_pair_stream` | **confirmed** | Spec lists = packed pools of u32 indices into spec_object_table. INDEX SPACE RESOLVED via the idx->name lookup f_109ecb5c (cmplwi 0x146=326; slwi*4; lwzux base 0x10f97094) and name->idx f_109ecb90 (strcmp walk from 'none'): runtime index i resolves to table\[3+i\] - the 3 leading table slots are fnptrs, semantic idx0='none'. GRAMMAR RESOLVED ({fieldName,typeName} pairs): blob = (field,type)* - a flat sequence of pairs; even positions carry WIRE FIELD names (globalError 561x, ok 175x, upnpResponse 60x, upnpError 60x, groupCoordinatorChanged 53x, playbackError 44x, accountError, sessionError, playerSetError, transitionToShipModeStatus), odd positions carry the field's TYPE (upnpEvent 422x = the universal value/event wrapper, wiredSubStatus 202x, channelMapPair 92x, chirpRequest 79x, bluetoothDevice, deviceInfo, bluetooth, artist...). A repeated field name = the field's type is a UNION of the following types (e.g. globalError:{chirpRequest\|accessoryId\|none\|wiredSubStatus} = five error-variant payloads). idx0 'none' = absent type / optional slot. Message roots: 'ok' leads 170 specs (status/ack field first), 'upnpResponse' 60x (UPnP-bridge envelope), plus object-typed roots (timer, zoneDefinition, alarm, area, groupInfo...). Outbound emitters call idx2name with constant type-ids (addi r3,0x31/0x2f/0x67...) then serialize - index space is an enum baked at build time. NOTE: earlier records decoded blobs against table\[i\] (off by 3); all route member lists + this grammar re-derived under table\[3+i\]. |
| `spotify` | **?** |  |
| `spotify_connect` | **?** |  |
| `spotify_esdk` | **strong** | cmds RSpotifyPlayback{Play,Pause,Seek,SeekRelative,SkipToNext,SkipToPrev,BecomeActiveDevice,SetDeviceInactive}; NTS callbacks {ConnectionMessage,ConnectionNewCreds,StreamStart(id,fmt,drm,size,gain),PlaybackNotify,StreamFlush,StreamGetPosition(id),Error}; mDNS {"Registering Spotify Connect mDNS service \[%s\]","Unregistering","Updating ... event %d","new cert updating mDNS"}; seamless delegation {"Seeking to %ims in support of seamless delegation","Timed out waiting for AudioStart from eSDK during seamless delegation","%s failed to become active","set seek time to %u ms, byte offset: %zu"}; VLI transition matrix {"VLI source switch logout - async","Normal logout - blocking","VLI deselected, last id: %u, pos: %u, bLogout: %d","Detected VLI source switch","Connect mode toggled during transition - allowing login to proceed","Account matches ... skipping login","Already logged in with same user","username may have changed","mismatch ... regular logout","mismatch ... async logout","Already logged out"}; dual tracking "pos: %u (VLI: %d \[%d\], SMAPI: %d \[%d\])"; track FSM {AwaitingCurrentTrackAck,AwaitingNextTrackAck,CurrentTrackPlayed}; metadata {bitrate,track_uri,original_track_uri,playback id,audio_quality,hifi_status} New/Next Track Metadata; URIs spotify:track:/spotify:episode: "Bogus track URI"; media delivery {"unsupported DRM format: %d","stream start (id:%u, type:%s, size:%u)","stream data ... size: %u, offset: %u","stream end","stream flush ... pos: %u","getPosition (id=%u): result %u",performFlush}; events {GroupVolumeChangedEvent,SpotifyDelegationNotification,SpotifyMDNSRequest}; "Sent group volume change %u to eSDK (mute %d)"; TPM legacy "Spotify setPositionInfo ... uri=%s, playbackId=%s, position=%.3f, isFinalReport=%d"; init {SpInit supported media formats: %llu,devid,remoteName,deviceType,libraryVer,resolverVer,productId}; R_ServiceBitrate |
| `spotify_zeroconf` | **strong** | URIs x-spotify:// + x-spotify-file://; Content-Type application/json; charset=utf-8; ver 2.9.0; client types {Partner,Spotify}; results {SpotZc_Failure,SpotZc_Success}; GC gate "Non-GC returning 404 from getInfo" + "reject zc req %s"; getInfo schema {deviceID,publicKey,deviceType,libraryVersion,resolverVersion,groupStatus,authorization_code,tokenType,clientID,productID,scope,availability,supported_drm_media_formats,supported_capabilities,modelDisplayName,brandDisplayName,remoteName,deviceName,statusString,spotifyError,responseCode}; errors {ERROR-INVALID-ARGUMENTS,ERROR-LOGIN-FAILED,ERROR-SPOTIFY-ERROR,ERROR-UNKNOWN}; addUser/resetUsers/resetUser/userName; "addUser with userName %s; player uuid %s" fmt %s@%s; client GUID 8ec274d4-0719-48d5-a0c0-ea9821a9a4ac + embedded key 9b377073ea334637b1406f329ce005de; DC enum {SONOS_DC_UNKNOWN,OK,NO_ACCOUNT,STALE_ACCOUNT,LOGIN_FAILED,UNSUPPORTED_SERVICE,UNEXPECTED}; account fields {isGuest,accountTier,loginMS,failedLoginMS,refreshAuthMS}; ops {spotifyTransferZeroConf,Using SID %d} |
| `spotifyzc` | **?** |  |
| `stream_metadata` | **?** |  |
| `svc_manifest` | **strong** | svcmanifests.json text/json; versioning {"Invalid schema version format","Unsupported schema version: actual: %u.%u, supported: %u.%u","Could not extract API header"}; ops {deleteManifest(%u) b=%d,a=%d,removeManifest(%d):%s vb=%d,va=%d}; replication {"replicating manifest file from %s","%s downloading music service manifest from %s; ret=%u, lRet=0x%x",lastUpdateDevice}; json {", \"manifests\": \[","JSON parse error %d: %s","Failed to load manifests JSON file","Added trailing slash to: %s","Invalid Id: %s","Failure parsing URI %s","unsupported CQ REST version: %s"}; RCache; "%d hasLastestVersion %d? %d" |
| `sync` | **?** |  |
| `topology_base` | **strong** | ops {RTopologyImpl,new_or_updated_zp,upgrade_report,informReplicatedSettingsChange,informLocalSecureRegStateChange,informLocalIdleStateChange,updateLocalMoreInfo,getZPUUIDs,isLocalZPIdle}; events {AvailableSoftwareUpdate,MuseHouseholdId,ZoneGroupName,ZoneGroupID,ZonePlayerUUIDsInGroup}; zp attrs {lastIp,moreInfo,spOrientation,htOrientation,newVanishedDevice}; ARP liveness {"received a valid arping from %s","arping successful for active device","arping ip address matched but not mac","arping successful for vanished device","arping unsuccessful"}; quarantine {"Discovery for player %s resulted in quarantine (%s); last network error: 0x%x",quarantinedCount,latestPlayerWithQuarantineEvent,stabilizationTime,latestDownloadErrorCode,latestDownloadErrorReason,quarantining}; missed-player "Report player missed by %s: %s" {missedBy,missedPlayer}; WoW {"\[%s\] %s WoW magic packet for MAC %02X*6","Attempted to wake %zu missing secondary ZP of primary %s (sent WoW to %zu)","Malformed UUID %s"}; "Faking device %s (%s) props to be %s gc"; "All devices idle for %ld s"; "lookup of control URI for %s failed: secure %d, service %s" + https://%s:%hu; NetsettingsUpdateID |
| `tp_enums` | **strong** | SPEAKER_MASK {UNSPECIFIED,THREE_DOT_ONE,FIVE_DOT_ONE,FIVE_DOT_ONE_DOT_TWO,SEVEN_DOT_ONE,NINE_DOT_ONE_DOT_FOUR}; CHANNEL_DIRECTION {UNSPECIFIED,DIRECT,INDIRECT_ARRAY,INDIRECT_SINGLE_DRIVER}; CHANNEL_TYPE {UNSPECIFIED,L,R,C,SUB,LS,RS,LRS,RRS,LTM,RTM,LW,RW,MONO,LTR,RTR,INPUT,OUTPUT,SCRATCH}; VOLTAGE_GAIN_CALCULATOR {UNSPECIFIED,BULK_CAPACITORS,BOOSTED_BATTERY,BUCKED_CAPACITOR}; ARRAY_SUB_SYSTEM {UNSPECIFIED,BRAVO,FURY,OPTIMO2,OPTIMO2_SURROUND,LASSO,APOLLO}; TONE_HANDLER {UNSPECIFIED,STANDARD,SUB}; TUNING_MODE {UNSPECIFIED,INDIVIDUAL_CHANNELS,ALL_CHANNELS_AS_MONO}; SUB_POLARITY {UNSPECIFIED,POSITIVE,NEGATIVE}; MEASUREMENT_MODE {UNSPECIFIED,SPATIAL,SPECTRAL}; DEVICE_ORIENTATION {UNSPECIFIED,HORIZONTAL,VERTICAL,WALL_ABOVE,WALL_BELOW,INVERTED,FACEDOWN,HORIZONTAL_LEFT,HORIZONTAL_RIGHT} |
| `track_pipeline` | **strong** | {"Position report (track: %u reason: %s) integration reported invalid position value %u last: %u delta: %i","Not setting track info because of empty file id in case of internal file","Continuing track, last position: %u","Adding new track to the pipeline:","Flushed integration (%s). Got track %u playback position: %lu","Reset dirty_aubuffer because of '%s'","Integration reported invalid track playing","track_id %u, provided_to_integration %d, is_seeking %d","track_id=%d position from integration %u","Track %u last position: %u -> %u","Delivery latency was %u ms. Integration latency was %u ms","Sending EsdkPlaybackStats log failed","Synchronized current playback position %u ms with integration","Starting playback position sync timer for %u ms","Track fully delivered","Initializing track delivery","***TSB*** Loading new decryption key","***TSB*** Loading new decryption IV","Choosing DRM: %d media format: %d","Video Manifest(%d): %s","Asking integration to seek to the initial starting position %u","Underrun in download buffer! (0 / %d)","redeliver media at resume","Finishing playing track and advancing pipeline","Set track %u download offset %u","set_dl_pos outside seek",periodic,"!"No track to call cb_stream_on_start"","!"stopping unavailable timer in start_underrun_gp/stop_playback_pos_sync_timer""} |
| `trueplay_service` | **strong** | service sonos.coreaudio.trueplay.v1.TrueplayService; API v1alpha2; errors {Invalid API Version,Invalid Service Address}; status enum {MESSAGE_STATUS_UNSPECIFIED,MESSAGE_STATUS_SUCCESS,MESSAGE_STATUS_FAILURE}; methods {SetupDevice,ApplySpatialTuning,ApplySpectralTuning,ApplySatelliteTuning,ClearAllTunings,GetSpatialTuning,GetSpectralTuning,GetDeviceConfig} (req+resp names listed) |
| `trueplay_tuning` | **strong** | Trueplay room tuning stack: muse routes for discovery/presence/config/status (+setSelfTruePlay, resetDetectedSpeaker), x-rincon-sonarcal: OGG test-tone URIs played through the streamer (leader/testtone/complete_ht), versioned Trueplay SDK with compat fallback, etag-synced spectral/spatial tuning assets, per-driver RoomCalDelay params, satellite propagation via SetRoomCalibrationStatus, SelfTrueplay variant |
| `tv_processor` | **strong** | state enum {READING,PARSING,DECODING,DECODER_DSP,NOISE_SILENCE_DETECTION,WRITING,WAITING,INPUT_ERROR,RECORDING,MONITOR_IDLING,MONITORING} + tv_block_descriptor; <TVProc>{Input,Signal(active/inactive),Mode,HTSwap,SampleRate,FrameRate,DataBurst(%d : %s),NSDResult,StreamInfo,StreamChannels(%d.%d.%d),InputChannelCount}</TVProc>; <ChannelStatusBlock>{SampleRate,SampleWidth,Mode,Flags(\[Consumer\],\[Professional\],\[PCM\],\[Muted\]),Type,MultiChannel{Layout,Allocation},Raw}</ChannelStatusBlock>; <Decoder><ActiveDecoder>None/PCM/%s/DTS</ActiveDecoder></Decoder> + ESZNA DTS magic; MPCM layout; "Unknown Dolby Databurst Type; choosing UDC"; databurst errors {Unmapped decoder error,Unmapped decoder specific DSP error}; CSB lifecycle {"First CSB accumulated","First CSB not accumulated","CSB changed to: %s \[%s\]"}; PCM-vs-encoded parser {"Parser identified Encoded signal in disagreement with Source","Parser identified PCM signal in disagreement with Source","Bitstream validity re-established"}; format changes {"Sample rate changed from (%u : %u)","Input channel count change: %u -> %u","Read size in frames changed","Input Format change %s (%d.%d.%d) --> %s","frame buffer is not evenly divisible"}; streams {mixgm%d,mixgm,mixsat} + select.read; "Start sending stream, pt %d.%06d"; reset timings {ht swap,downmix,CSB,external,SPDIF,ASRC,NSD,decoder,input flush,Dialog Extractor} each "%llu us"; "Resetting (%s). Mode: %s"; "Fell behind by %ums while resetting. Input delay %ums - read size %ums. Flush."; "Delay capped at stream size"; "detectNoiseAndSilence: status=%s"; "Stream %s underflow"; "Hardware no longer providing invalid signal"/"Invalid signal provided by hardware"; "TV input sample rate mismatch with audio tap (tv:%u tap:%u)"; autoplay <AutoPlay><Mode>%s</Mode><SilentSeconds>%u</SilentSeconds></AutoPlay>; "tvprocessor states previous:%s current:%s" |
| `upgrade` | **?** |  |
| `upnp_eventing` | **?** |  |
| `virtual_linein` | **?** |  |
| `vli` | **?** |  |
| `vli_transport` | **strong** | setTransportToVLIStreamURI {URI,autoplay,become gc} + 'VLI type \[%u\] incompatible' + 'activating source with URI: %s, VliGroupID: %s' + 'StartTransmission (VLI) failed' + 'going to stopped / defer playing'; events {AV Transport URI cleared/changed,VliTransportActionEvent,VliSessionProcessingCompleteEvent}; remote line-in {'AI Stream URI: %s sourceUUID %s','set corr ctx for remote line-in: bootSeq %u gcUUID %s',ai_tracker,'StartTransmissionToGroup failed'}; rincon group {setTransportToRinconGroupURI,'Rejecting x-rincon URI: source or target is an ungroupable player','Node protocol version on %s is incompatible','Count of off box members for VLISrcMgr \[%u\] must be <= CHSRC \[%u\]! Aborting',localConfigureGroup}; X-Sonos-Api-Key header |
| `wifi` | **?** |  |
| `wireless_modes` | **strong** | enum {SONOSNET_MODE,INVALID_MODE,ETHERNET_MODE,STATION_SATELLITE_MODE,SONOSNET_SATELLITE_STATION_PRIMARY_MODE,STATION_MODE}; <Wireless><WirelessInfo Name='Wireless Info'>{WifiMode(%d),WifiModeString,IdleState(0x%08x),BusyClients,SonosNetDisabled(%d),ConnectionType(%d),ConnectionTypeString}</WirelessInfo></Wireless> |
| `zgs_mediaservers` | **strong** | <MediaServers><Ex CURL="/msprox?uuid=…" EURL T EXT/><MediaServer Name UDN Location/><Service UDN NumAccounts Md%u Username%u Token%u Key%u/></MediaServers> — third-party media server proxies + SMAPI account creds embedded in ZGS; per-account {Nickname%u,SerialNum%u,Flags%u,Tier%u,Password%u}; AreasUpdateID+SourceAreasUpdateID; MS tracking {refreshing,"detected new",RINCON,"ignoring non-rincon MS %s","connect to MS %s %s",unauthorized}; media-player MS record "<MediaServer location uuid version canbedisplayed='%s' unavailable='%s' type='%u' ext='%s'>"; errors {empty id,invalid id count} |
| `zgt_schema` | **strong** | <ZoneGroupState><ZoneGroups><ZoneGroup Coordinator=" ID=">...</ZoneGroup></ZoneGroups><VanishedDevices>+<QuarantinedDevices><Device {UUID,Reason,ModelInfo,Mac,LastKnownIP,LastSeenUTC}/></ZoneGroupState>; ZonePlayer attrs {QuarantineReason,UUID,ZoneName,Icon,Configuration,Invisible=1,IsZoneBridge=1,SoftwareVersion,SWGen,MinCompatibleVersion,LegacyCompatibleVersion,ChannelMapSet,HTSatChanMapSet,ActiveZoneID,BootSeq,TVConfigurationError,HdmiCecAvailable,WirelessMode,ConnectionType,ChannelFreq,BehindWifiExtender,WifiEnabled,EthLink,Orientation,RoomCalibrationState,SecureRegState,VoiceConfigState,MicEnabled,HeadphoneSwapActive,AirPlayEnabled,VirtualLineInSource,IdleState,MoreInfo,SSLPort,HHSSLPort}; orphan groups ":orphan"; separate <ZonePlayers><ZonePlayer {group,prevgroup,virtuallineingroupid,htsat='true',wirelessmode,connectiontype,channelfreq}> listing |
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

The adaptive-bitrate engine that keeps HTTP streams (HLS, Icecast-style playlists) alive. It picks a data source, refetches playlists on a timer, and fails over to alternates when a playlist comes back empty or times out. Clients see this only as `TransportStatus` errors when every source dies — the retry and source-selection logic is entirely internal and not configurable.

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
- **registration_flow:** regdevicecert.cxx: POST {"id":"%s","status":"%s"} to /product/v2/households/%s/players?action=refresh, then ?action=complete&token=%s. Status FSM: 'registration during suspend' / 'registration time expired' / 'registration success' / 'retrying registration at time %ld' / 'registration error' / 'Unexpected 401 response'; fields regStatus, playerReg, RegisteredCustomerID, RegisteredCertSonosID. The signing key arrives over IPC ('Invalid registration signing key in IPC payload' / 'Registration signing key set/cleared'). Secure-reg transfer: 'Transfer mode old (e:%d) new (e:%d)' + scheduled tjmgrExitSecureRegTransferState; conflict check 'Household customer ID \[%s\] in conflict with local device \[%s\]'.
- **muse_registration_verbs:** Device-registration muse surface (0x10e7c8e8-0x10e7cc00): GET v1/households/{householdId}/devices/registrations -> getDeviceRegistrations; GET v1/users/{userId}/devices/registrations -> getUserDeviceRegistrations; initDeviceRegistration on v1/households/{householdId}/users/{userId}/devices/registrations; completeDeviceRegistration / refreshDeviceRegistration / deregisterDevice on v1/households/{householdId}/devices/registrations/{deviceId}; getRegistrationStatus on v1/players/{playerId}/devices/registration (+household-scoped twin); setRegistrationState on the player-scoped registration resource; transferDeviceRegistration on v1/players/{playerId}/devices/transfer (+household-scoped twin). These are the cloud-side counterparts of the regdevicecert refresh/complete flow.
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

The migration machinery that converts pre-OAuth music-service accounts to OAuth: reauth flow, token generation, per-service retries, and a cloud-connectivity gate that delays migration until the device is online. There's also a last.fm email→username fixup and a Sonos Radio (SBiz) capability gate. Explains accounts that silently flip auth schemes after an update.

**Technical description:**

OAuthMigration flow {reauth,token generation,getAuthTokenResult,accountToOAuthResult}: "migrated account to OAuth, type:%u, sn: %u" + retry {res,retry count,"delay migration until cloud connection","expected ouath account; reset to retry migration"}; "failed to replace email with username for last.fm"; sonos-radio gate {"no SBiz entitlement; preinstalling Sonos Radio","found SBiz entitlement; blocking preinstall"} + "stale entitlements; scheduling job to refresh"; preinstall SID=%u attempts; SA_RINCON65031_ service-account prefix; settings {R_HideTuneIn,R_MigratedTuneIn}; maintenance {"failed to download manifest file for account sid/sn","received empty hash","failed to update userInfo and clean up user hash","Failed to getUserInfo during SvcMaintenance","failed to migrate built-in accounts","failed to migrate pre cloud replication accounts"}

- **name:** zpserviceaccounts — OAuth migration + preinstall
<details><summary>Evidence (1)</summary>

- @ 0x10e9b28c — zpserviceaccounts block

</details>

## `addrmon`

**coverage** `partial`

The netlink address monitor: subscribes to RTM_NEWLINK/RTM_GETLINK kernel events so IP address changes are seen instantly rather than polled. Runs on the select thread with reset/data/except/timeout event names. This is how the player notices DHCP renewals and cable pulls within milliseconds.

**Technical description:**

RTM_NEWLINK/RTM_GETLINK via netlink; {"read error %d %s","incorrect type","unexpected message %X"}; select events selthrd.RIfAddressMonitor.{reset,data,except,timeout}

- **name:** netlink interface-address monitor
<details><summary>Evidence (1)</summary>

- @ 0x10ee69ac — addrmon

</details>

## `aha_ops`

**coverage** `partial`

Internal operations used when a group coordinator hands an active stream to a new member — stop, restore, and VLI (virtual line-in) session suspend/end. It also logs which analog/optical source type is feeding the group (line-in vs dock, compressed vs uncompressed). This is bookkeeping for source transitions; there's no client surface beyond the source selection already exposed through AVTransport URIs.

**Technical description:**

ops {AHA_STOP,AHA_RESTORE,AHA_END_VLI_SESSION,AHA_SUSPEND_VLI_SESSION,AHA_PAUSE_VLI_SESSION}; "failed to gen group byebye headers" + groupAdvertise_; RChannelLogger; "%d seconds on account %d/%u"; "Recorded sync error on account %u/%u"; sources {"Source set to %d - %s",Compressed Line-In,Uncompressed Line-In,Compressed Dock,Uncompressed Dock,Coordinator Local Library}

- **name:** AHA ops + group advertise
<details><summary>Evidence (1)</summary>

- @ 0x10f03fec — aha block

</details>

## `arp_assoc`

**coverage** `partial`

Layer-2 connectivity diagnostics: the ARP checker pings the gateway and counts consecutive failures to detect groupcast problems; arping runs async/sync probes on a timer with reset-on-data; the association tracker records Wi-Fi association metrics. When a player 'loses' the network while its IP looks fine, this is usually what detected it first.

**Technical description:**

arpchecker "ARP failure: %d consecutive attempts for %s failed: groupcast problem suspected" + "ARP to %s resolved after %d failures" + source_ip/msreplyfailure; arping {async,sync} "started for %s, every %u ms for %u ms" + reset-on-data + timeout adjust + "pending reset in progress" guard; assoctracker CrAssoc metrics {mstime1,mstime2,msnum,arpscstime,arpatt,arpscs,arpsnum,ddtime1,ddtime2,ddnum} + "Skip reporting invalid CrAssoc event"

- **name:** arpchecker+arping+assoctracker — L2 connectivity
<details><summary>Evidence (1)</summary>

- @ 0x10eefee8 — arp/assoc blocks

</details>

## `audio_clip`

**coverage** `partial`

The doorbell/alert clip player. Clips arrive over the muse `audioClip` namespace with a priority, a clip type, LED behavior, and optional buzzer routing; custom types require a `streamUrl` (and HTTPS if `httpAuthorization` is supplied). Playback is delegated to AVTransport or a dedicated engine depending on delivery mode. This is what smart-home integrations and doorbell partners use to play a sound over the system without disturbing the queue.

**Technical description:**

muse routes players/%s/audioClip + groups/%s/playback/%s + "forward to %s"; clip object type audioClip; fields {priority,clipType,clipLEDBehavior,clipBehavior,buzzers}; buzzer clips file://%s/buzzers/%d.mp3 + %u:%c; custom requires streamUrl "Missing streamUrl (required for custom clip type)"; httpAuthorization → "Secure streamUrl required when providing httpAuthorization"; delivery {Using AVT,Using External Audio Source}; priority "Cannot interrupt current clip due to priority policies"; pause content first "Failed to pause content because group info could not be retrieved for UUID=%s, ZoneGroupID=%s"; errors {Invalid clip type,Invalid clip id,Clip id not found,Error starting audio clip,failed getting audio clip response,"unexpected object type %s, expecting audioClip"}; resume content after

- **name:** AudioClipManager — doorbell/alert clips
<details><summary>Evidence (1)</summary>

- @ 0x10edf87c — audioclip block

</details>

## `audio_decoder`

**coverage** `partial`

The generic decoder wrapper — used by the ffmpeg-based WMA path among others — that owns codec lifecycle (create, init, header parse, seek, scan, position reporting) and publishes a status XML blob with sample rate, bit depth, channels, and frame size. Seeks are capped to the stream length and counted in absolute positions. Clients never touch it directly; its status fields are what the diagnostics pages echo back per decoder.

**Technical description:**

status <SampleRate><SampleBitDepth><NumChannels><ChannelMap><FrameSize>; lifecycle {decoder create/init,header,seek tvResume=%ld.%ld,"seeking to absolute position = (%llu / %llu)","capping aboslute seek position",scan,get pos}; errors {decode err skip/pos/flush/set pos,too many errors,no progress(eof,o),open failed,streaming hint failed,read out of accum space,read eof,reached expected eof pos,seek failed,len failed}; unsupported {too many samples,channels,bit depth}; REPLAYGAIN_TRACK_GAIN= + gain=%f; ogg errors {seek,bailed out,no mem,no init}; ffmpeg/WMA: wmaSeekPacket offset bound; AVFormatContext alloc/open; stream-info/audio-stream find; resume loc byte→time fallback "Resume location %zu exceeds file size %zu, falling back to time-based seek"; "Seeking to position %zu"/"Seeking to time: %lld microseconds"; "Stream duration: %zu milliseconds"/"File size: %zu bytes"/"Estimated offset %zu exceeds file size"; attached-picture extract image/jpeg; libavformat metadata album_artist; codec ctx {not found id,alloc,params,open,pAVPacket/pAVFrame}; frames {send/recv errors,send result status eof}; payload bounds {Extradata too large,Codec params size,Packet size too large,Codec params too large for cache,Packet too large for cached payload}; "no client, ptvResume, fileURI, or uri opener provided, we won't continue"

- **name:** generic audio decoder + ffmpeg WMA path
- **ogg_vorbis:** nullaudio "starting null audio play"+"dropping %zu bytes"; gapless ogg "we have gapless ogg, %d samples, %zu frame size"/"gapless requested %d samples > decoded frame size"; bounds {oob num samples > max vorbis packet}; states {ogg eof,ogg only header byte found,ogg hard stop requested}
<details><summary>Evidence (1)</summary>

- @ 0x10edde80 — decoder blocks

</details>

## `audio_decoders`

**coverage** `partial`

The bundled decoder layer for open codecs: Vorbis synthesis (with explicit guards for null PCM, missing config data, and insufficient bytes) and AAC/AAC+ (with a disable flag and upsampling factor). Each decoder emits the same SampleRate/FrameSize/ChannelMap status block, which is how the player describes what it thinks a stream actually contains. Matters when a stream plays at the wrong pitch or channel count — this layer is where the negotiated format is recorded.

**Technical description:**

vorbis errors {vorbis_synthesis_pcmout produced null PCM data,failed to initialize vorbis given config data,neither config nor music data,no samples produced,insufficient bytes,decoding failed,vorbis_synthesis_read failed}; status XML <SampleRate><FrameSize><NumChannels><ChanMap>%s (%s)</ChanMap>; AAC: "DisableAacPlus StreamType=%d, aacPlusUpsamplingFactor=%d", errors {can't initialize decoder library,Unable to decode init frame,unknown AAC format,Invalid sample rate idx,Frame Paddling Len = %d numChannels = %d sampleRateIx %d obj %d,Explicitly expressed samplerate not supported,Failed to get the extension sampling freq idx}; XML {DEC_AACDecoder,DEC_InputChanCount,DEC_OutputChanCount,DEC_BitRate,DEC_FrameSize,DEC_AudioObjectType}; AOT enum {AAC-LC,HE-AAC,ER-AAC-LC,ER-AAC-SCAL - Decoding base layer only,ER-BSAC,ER-AAC-LD,HE-AAC v2,ER_AAC_ELD,xHE-AAC}

- **name:** audio decoder layer (vorbis/AAC)
- **detail:** ogg/vorbis {nullaudio "starting null audio play"+"dropping %zu bytes","oob, num samples larger than max vorbis packet size","we have gapless ogg, %d samples, %zu frame size","gapless requested %d samples > decoded frame size","ogg eof","ogg only header byte found","ogg hard stop requested"}; SBC {"Invalid packet header","params: freq=%u blks=%u sb=%u mode=%u alloc=%u bitpool=%u end=%u fin=%zu fout=%zu frames=%zu","Truncated packet. Lost %zu of %zu frames","frame size changed %zu->%zu","decoder error %zd on frame %zu","Bad SBC frame %zu. read %zd/%zd, decoded %zu/%zu","unexpected NOTIFYFRAME_ERR_BUFFERING","unknown frame status %d"}; WMA {"oob, num samples larger than max wma packet size (%zu * %zu == %zu) > %zu","wma player end of file","notify frame stop/do not decode","skipping wma frame","wma decoder error, resetting/no reset/hard stopping","number of channels encoded %d, will not decode > stereo"}; ALAC {"alac decoder status: %d","producing zeros only","alac out-of-bounds read prevented","error initializing ALAC","created alac for %u-bit samples, %d sample freq, %d-channel","unexpected sample bit depth: %u"}
<details><summary>Evidence (1)</summary>

- @ 0x10f1a010 — decoder block

</details>

## `audio_fifo`

**coverage** `partial`

A record-based circular audio buffer used inside the Spotify eSDK path: writes land in pos/range records, discontiguous offsets are rejected, and reads advance through contiguous records only. When the producer skips (a seek or a dropped packet), it logs a discontinuity and resets after too many. This explains occasional clicks or re-buffering on Connect tracks — the fifo enforces strict ordering instead of splicing.

**Technical description:**

records with {pos,range}; writes {"Advance write to next record","Rejecting write, as provided offset %zu != %zu (pending)","not enough fifo records","truncated write","Audio fifo records reset"}; discontinuity {"Discontinuity @ offset %zu in record %zu (expecting: %zu)","*** Too many discontinuities"}; reads {"Consumed contiguous samples (%zu - %zu)","Advance read to next contiguous record","Read %zu bytes from record","No bytes to read from fifo... EOF","audio fifo read at boundary eof","consumed exactly to the eof marker","reached logical boundary","already has pending offset"}; prebuffer {"prebuffering... (used/prebuffer)","Waited %ums for audio from the eSDK","Finished prebuffering in %u ms (st,flush)","prebuffering elapsed %u ms (used/free)","exit waiting for audio, not rendering"} — Spotify eSDK feed

- **name:** audiofifo — record-based circular audio buffer (eSDK)
<details><summary>Evidence (1)</summary>

- @ 0x10ef04f0 — audio_fifo block

</details>

## `audio_rate_ctrl`

**coverage** `partial`

The sample-rate converter plus the time-sync integrator that keeps a group of players sample-locked. The ARC adjusts coefficients continuously; when correction saturates it rails at 'Rate Maxed'. The timesync side tracks lock time, integrated error, and per-iteration stats. This is the subsystem that makes multiroom playback stay in sync for hours — drift correction is continuous, not a one-time alignment.

**Technical description:**

ARC: setCoefficients StdQ ASRC; guards {adjust rate of 0,unsupported channels,Unsupported Input Audio/Line Rate,Over Excursion error,sample rate converter error read}; reconfig on rate/channel-count/line-rate change; timesync: databurst LockTime, "Rate Maxed"/"Rate Inv Maxed" rails m_dOverallRate/m_dIntegratedRate, iter dump {LE,LEP,IC,ICP,IL,RT,err,errf,dOut,dIn,AP,RL}; "time went back; try again"; "Thread descheduled for %uus. Limit %uus"; SRC mute on |drift| "(Should) Mute SRC. dAbsoluteError = %f, current canonical rate = %u"; "Out of bounds. drift: %f mute count: %d"

- **name:** Audio Rate Controller (ASRC) + timesync drift
<details><summary>Evidence (1)</summary>

- @ 0x10f2b610 — arc/timesync block

</details>

## `audio_stream_mixer`

**coverage** `partial`

The per-stream mixer: each stream can buffer, schedule a presentation time, resync, drain, or skip ahead, with a small fade engine for gain ramps (crossfades and ducking ride on this). Statistics per stream (errors, drops, buffered, presentation) feed diagnostics. Skip-ahead is how the player jumps past stale audio after a network stall instead of playing it back late.

**Technical description:**

stream ops {start buffering,set presentation time,resync,drain flag,skipAhead} + stats "E:%d, D:%d, B:%d, PR:%d"; fade engine "fade added: %i.%i sample_len(%u) current_gain target_gain rate" + max/min/fade complete + "no fade slots available"; skipAhead "delta:%u > buffered:%u"; "discontinuity detected after scheduled resync"; mixer: bManageOutputLatency,startup buffers,buffers; fd poll sound.fd.poll.%04X; stall detect "loop(wall): %uus loop(cpu): %uus, sel: %uus"; states MTS_PLAYING transition; DSP drain FSM {"start dsp flushing %i buffers","dsp flushing ended %i frames early","driver draining","dsp flushing complete with od %u"}; stream names as-{dspin,dspout}{-tv,-ext-voice,-ext-chirp}/as-src{in,out}-ext-voice/%s-chsnk%zu; system/audio_out_disable + "Running with audio output disabled"; forcePerfectInitialSync; "KERNEL_PRINTK_ENABLE ... mixer scheduling can't be guaranteed"; "Testpoint delay of %ums"

- **name:** audio_stream + mixing_threaded — per-stream mixer
<details><summary>Evidence (1)</summary>

- @ 0x10f29ab7 — audio_stream/mixing blocks

</details>

## `audio_tap`

**coverage** `partial`

Debug tap points that let a developer siphon a WAV stream out of nearly any point in the audio pipeline — line-in, decoder output, mixer input/output, DSP output, LLA output, even the chirp and voice channels. Gated by permissions (and a mic gate for privacy-sensitive taps). The `/audiocap` and SPDIF-tap endpoints use this. Not a production API; it exists for engineering audio forensics.

**Technical description:**

errors {no tap specified,syntax error,invalid request,permission denied} + audio/wav; mic gate "allowed %d mic %d"; taps {linein,codecout,irdecoder,mixersat,mixergm,as-srcin-chsnk0,as-srcout-chsnk0,mixerstats,dspout,formatter,llaout,mixerout,mzdsp,extvoice,extchirp}; spdiftap.compressed + "Internal SPDIF Tap Snapshotted. Tap must be uncompressed before use!"; sonos-dspid header

- **name:** AudioTap — debug tap points
- **manager:** audiotap_manager + trueplay_manager; "number of max taps exceeds the avaialable capacity"; "Active Tap %s"/"Closing Tap %s"/"No Active Taps to check if already tapped"; guards {"Location is not tappable","Location is already being tapped","Max number of blocks already being tapped"}; vars {channelname,vartype,VAR_FLOAT,VAR_STRING,VAR_INT} fmt %.04f; "number of device channels exceed TRUEPLAY_MAX_DEVICE_CHMAP_SIZE"; "unknown channel type"; sonarEQ.xml + "found legacy tuning"; status "<b>--------Trueplay-------</b>" + "Minimum Trueplay version" + {Small,Large} classes
<details><summary>Evidence (1)</summary>

- @ 0x10e73cb8 — audiotap block

</details>

## `audio_taps`

**coverage** `partial`

Internal PCM capture points let the firmware record the audio passing through it — used for diagnostics and, importantly, for TV lip-sync: the SPDIF tap captures the TV input so playback can be synchronized against the output tap. The /snapshotspdiftap + /downloadspdiftap endpoints retrieve captures. Not a client-facing feature, but it explains audio-quality and latency behaviour on home-theatre setups.

**Technical description:**

PCM-capture tap subsystem (audiotap_manager.cxx + datatap.cxx): guarded /audio_tap /spdiftap /snapshotspdiftap /downloadspdiftap endpoints, versioned tap-file format with audio+metadata sections, SPDIF tap used to sync TV-input playback against the output tap; tap instances are typed rolling_data_tap objects; 'Datatap snapshot failed after %zu' + 'Error: failed to read metadata from buffer!'

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

## `audioin_groups`

**coverage** `partial`

AudioIn (line-in distribution) group bookkeeping: groups are keyed by the coordinator's RINCON id, sources pick compressed or uncompressed transport, and members join/leave a shared `x-rincon-stream:` URI. This is what makes line-in sharable across rooms — one player owns the ADC, the others subscribe to its stream. The `Unpaired`/`Autoplay` state variables in the AudioIn service are this layer's control surface.

**Technical description:**

groups keyed by coordinator {'Removing group with coord %s','Adding group with coord %s demoMode %d','addGroup: coordinator %s already added','addGroup: no room available for coordinator %s','added %s number of groups %zu remote %zu','removed %s remaining number of groups %zu remote %zu',"StopTransmissionToGroup: couldn't find coordinator %s"}; URI x-rincon-stream:; formats {UNCOMPRESSED,COMPRESSED,v-spdif} + 'Running demo mode forcing uncompressed'

- **name:** AudioIn group management (ai_impl)
<details><summary>Evidence (1)</summary>

- @ 0x10eacd98 — ai_impl block

</details>

## `audiotap_manager`

**coverage** `partial`

The async request plumbing behind the audio-tap feature: each tap request gets a mutex-protected consumer, a poll loop, and write accounting. Pure infrastructure — it exists so a tap can stream continuously without blocking the audio thread.

**Technical description:**

raudiotapMutex; "failed to setup async request %d %s"; "can't consume from a closed request"; audiotap.poll; "failed write %d %s"

- **name:** audiotap async requests
<details><summary>Evidence (1)</summary>

- @ 0x10ee6170 — audiotap reqs

</details>

## `authz`

**coverage** `partial`

The `/authz` policy layer that decides what a caller may do: static per-role policies, fast-path policies, guest/offline policies, and an mTLS policy — selected at request time. Token resolution asks the cloud for permissions and masks tokens in logs. Every sensitive HTTP and muse surface consults this before acting.

**Technical description:**

policies {"Static policy not found for role (%s), version (%s)","Static fast policy not found","Not in offline mode","Using guest policy for offline mode","Using mTLS policy","Using guest policy"}; token ops {"Failed to get the permissions: http=%d","Failed to parse getPermissions response","Failed to resolve token \[token=******%s\]: http=%d" (masked),"Failed to parse token response","Request to resolveToken successful \[token=******%s\]"}; cache {cache-control-header,responseResolveToken,museAuthzCache,InMemoryHttpCacheMutex,"Policy mapping retrieved from cache"}; guards {"Credential is not allowed","Guest access disallowed","Unauthenticated control disallowed"}

- **name:** /authz — policy + token resolution
<details><summary>Evidence (1)</summary>

- @ 0x10ef9a80 — authz block

</details>

## `auto_update`

**coverage** `partial`

The auto-update scheduler FSM: states from INIT through REFRESH, SCHEDULED (and SCHEDULED_POST_WOW for wake-on-wireless), SESSION_MONITOR, SESSION_REPORT, SESSION_ACTIVE — with PendingStart/SessionStart/SessionAttempts counters. Settings like `R_AutoUpdateWindowStart`/`R_AutoUpdatePolicy`/`R_CheckUpdateInterval` control it, and blockers (an upcoming alarm, active playback) postpone installs. This is why updates land at odd hours.

**Technical description:**

states {ST_UNDEFINED,ST_INIT,ST_REFRESH,ST_SCHEDULED,ST_SCHEDULED_POST_WOW,ST_SESSION_MONITOR,ST_SESSION_REPORT,ST_SESSION_ACTIVE} + PendingStart/SessionStart/SessionStartLocal/SessionAttempts counters; settings {R_AutoUpdateWindowStart,R_AutoUpdatePolicy,R_CheckUpdateInterval}; blockers {"Upcoming alarm is preventing update","Active device(s) preventing update"}; "Trimming the window to (%d) seconds"/shrinkWindow; upgrade_mgr_report.json {pendingUpdateHours,numUpdateAttempts,startTime,elapsedSeconds,blockedUpdateReason,updateHHStatus,serverIP,errorMsg,extendedError,zoneType,startVersion,targetVersion,hardwareVersion,serialNumber,updateZPResult,numZPsInHH,numZPsInHHDelta,numZPsToUpdate,numZPsDropped,targetSystemVersion,updateHHResult,numFailedZPs,numZPsWithError}; "RINCON_%s01400 updated to %s"/"update failed (%d)"; "Retrying upgrade (%d/%d)..."/"Giving up after max upgrade attempts"; upgrade_mgr.txt state file

- **name:** upgrade_mgr — auto-update scheduler FSM
<details><summary>Evidence (1)</summary>

- @ 0x10eae3f4 — auto_update_scheduler block

</details>

## `bandwidth_meter`

**coverage** `partial`

The eSDK's throughput estimator: it times chunk downloads, computes bytes/sec and kbit/s over a sliding window with high/low watermarks, and counts how often throughput dips below a threshold. Spotify uses this internally for stream-quality decisions; it's invisible to clients except through the quality of what Connect ends up delivering.

**Technical description:**

{"BANDWIDTH: %u B / %u ms = %u B/s = %u kbit/s","Bandwidth not calculated, latency zero","WINDOW BANDWIDTH: %u B / %u ms = %u kbit/s, high=%d, low=%d","LOW BW (kbit/s): %u < %u, count = %u","Bandwidth window not updated, latency zero"}; asserts {first_chunk_request_time not set,latest_chunk_finished_time not set,finished_time >= stats->first_chunk_request_time}

- **name:** eSDK bandwidth measurement
<details><summary>Evidence (1)</summary>

- @ 0x10fe42ec — bandwidth

</details>

## `boot_sequence`

**coverage** `partial`

The boot-sequence manager: tracks boot progress, bumps the sequence counter on events like first Wi-Fi connection, and honors settings like ForceWifiDisable/SonosNetDisable. `bootSequenceId` in the device schema is this counter — cloud clients use it to detect reboots between commands.

**Technical description:**

"updating boot sequence due to wifi connection event"; settings {TargetRoomName,LocalAccountTransferMode,ForceWifiDisable,ForceMeshDisable,SonosNetDisable,WEPKey}

- **name:** boot_sequence_mgr — bootseq triggers
<details><summary>Evidence (1)</summary>

- @ 0x10ef0a8c — boot_seq block

</details>

## `browse_prefixes`

**coverage** `partial`

The object-id prefix grammar used in browse and queue items: `newrelease:album:genre:`, `staffpick:album:genre:`, `top:album:genre:`, `playlist:`, `favorite:track`, `artist_tracks:`, plus the `urn:schemas-rinconnetworks-com:metadata-1-0/` namespace marker. Matching on these prefixes is how the player knows what an opaque service ID actually contains.

**Technical description:**

{newrelease:album:genre:,staffpick:album:genre:,top:album:genre:,top:track:genre:,playlist:,%s.#%s,favorite:track,artist_tracks:} + urn:schemas-rinconnetworks-com:metadata-1-0/|total

- **name:** SMAPI/browse object-id prefixes
<details><summary>Evidence (1)</summary>

- @ 0x10f0f62c — browse prefixes

</details>

## `bt_sbc`

**coverage** `partial`

The SBC decoder for Bluetooth-received audio: parses packet headers, validates frame sizes, tracks bitpool/subband/mode parameters, and drops truncated packets rather than playing garbage. Present on models with Bluetooth RX. Buffering errors surface as frame-status codes; there's no client surface — pairing and routing live elsewhere.

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

The per-setting capability gate messages: 'Supported only for devices that support power over ethernet', 'water sensor', 'microphone switch', 'subwoofer', 'suspendable devices', plus requiredMinimumBatteryPercentage. These explain why a settings update can be rejected on one model but accepted on another — the validator checks hardware capabilities, not just the schema.

**Technical description:**

"Supported only for devices that support power over ethernet and have ethernet support"; "Supported only for devices with a water sensor"; "Supported only on devices with a microphone switch"; "Device is not a subwoofer"; "Supported only on suspendable devices" + {requiredMinimumBatteryPercentage,requiredMaximumBatteryPercentage,durationSeconds}; "Supported only on devices with a battery"; "Supported only on devices with bluetooth" + "Unable to set bluetooth pairing, unsupported"; "target is not a home theater source"/"target does not support HDMI CEC" + tvPowerState; "Setting is not valid"

- **name:** settings capability guards
<details><summary>Evidence (1)</summary>

- @ 0x10e99764 — capability guards

</details>

## `catalog_translate`

**coverage** `partial`

The `/content/api` catalog-ID translator: `translateId(objectId, serviceId, targetObjectId)` calls `GET catalog/id/%s?destinationServiceId=%s` on the cloud to map an item ID from one service into another's namespace — e.g., 'the same album on Spotify vs Deezer'. Results are cached; missing-param errors name exactly which argument failed.

**Technical description:**

translateId(%s,%s,%s) with missing-param errors {objectId,serviceId,targetObjectId}; cloud GET catalog/id/%s?destinationServiceId=%s + targetSid; caching {"retrieved translation from cache","translation not cached; connecting to translation service","translateId response: %d %s","saved translation to cache"}; catalogSvcMgr

- **name:** /content/api + zpCatalogTranslation
<details><summary>Evidence (1)</summary>

- @ 0x10eb3c38 — catalog block

</details>

## `cec_diagnostics`

**coverage** `partial`

The HDMI-CEC/ARC diagnostic field set: tvCECStatus, tvPowerStatus, deviceCEC, stateSAM/errorSAM, stateARC/errorARC, errorTV, eARCActive, testAudio/testVideo. This is the data behind 'TV won't turn on with the speaker' — the CEC state machine's observable state.

**Technical description:**

{tvCECStatus,tvPowerStatus,deviceCEC,stateSAM,errorSAM,stateARC,errorARC,errorTV,eARCActive,testAudio,testVideo}

- **name:** HDMI-CEC/ARC diagnostics fields
<details><summary>Evidence (1)</summary>

- @ 0x10fa2160 — cec fields

</details>

## `cert_files`

**coverage** `partial`

The on-flash layout for cert material: files named for `encrypted-private-key`, `expiration`, `encryption-key-type`, and `sonos-key-and-cert`. Rotation and renewal rewrite these; a corrupt or expired set cascades into mTLS and token-signing failures across every authenticated surface.

**Technical description:**

"%s/%s.%s"; keys {encrypted-private-key,expiration,encryption-key-type,sonos-key-and-cert}; "failed to retrieve key"

- **name:** device cert file layout
<details><summary>Evidence (1)</summary>

- @ 0x10faf07c — cert files

</details>

## `chanmapset`

**coverage** `partial`

The ChannelMapSet initializer: builds the channel-map tables that describe how speaker channels are assigned (stereo pair L/R, surround roles), with bounds ('Initializer List too large, truncating') and duplicate detection. The watchdog thread `awThreadWDCheck` guards its init.

**Technical description:**

chanmapset var; 'Initializer List is too large: %d > %d, truncating to %d'; 'Duplicate entry: %s at index %zu and %zu'; awThreadWDCheck watchdog

- **name:** ChannelMapSet init
<details><summary>Evidence (1)</summary>

- @ 0x10ee6e84 — chanmapset

</details>

## `chirp`

**coverage** `partial`

The acoustic data-over-sound stack (Chirp SDK 4.2.3, Chirp core 4.2.1) used for setup and secure pairing. The `sonos-cdma` profile spreads symbols across CDMA notes; decoding runs an FFT peak-picker, note estimator, scorer, and voter. Built-in profiles include audible, ultrasonic, and the secure-setup variant. This is how the app passes Wi-Fi credentials to an unprovisioned player by playing a sound from the phone.

**Technical description:**

profile sonos-cdma; decode pipeline {chirp_decoder_t,chirp_cdma_decoder_t,chirp_cdma_match_t,chirp_note_estimate_t(u16),chirp_peaks_t/chirp_peak_t,chirp_scorer_t(u64),chirp_voter_t}; encode {chirp_cdma_encoder_t,chirp_codebook_t(u8*),chirp_rms_t,chirp_decorator_t}; fft {chirp_maths_fft_init/deinit,double}; errors {"No frames selected to decode (is sustain period too short?)","payload contains unknown symbols","Preamble payload has too few symbols ... TODO: #741","Payload does not support symbol sizes beyond 64-bit","Preamble code is outside of symbol range","corrupt_random_symbols","symbol_bits will overflow a cast","failed to read fixed config and codebook"}; sdk {chirp_sdk_random_payload,chirp_sdk_get_info,_chirp_on_received_cdma}; playback {"Start chirping with unique device value:%d","current chirp output volume: %d","A chirp signal is already playing with playId %d","Stop chirp playId %d differ than m_chirpPlayId","Failed to stop chirp","Couldn't create a chirp audio stream","Error initializing chirp","Chirp setup failed - chirp sender does not exist!","Unable to play chirp"}; stream taps {as-dspin-ext-chirp,as-dspout-ext-chirp,ext-chirp-as,setup-chirp-as}; stream errors {stream_chirp_init_sync,lack_data_no_drain,read_err_full,read_err_part_data}; "Ignoring busy transition due to chirp only"; muse routes v1/players/{playerId}/roomDetection/chirp{,/{playId}} + household variants

- **name:** chirp acoustic stack (Asynchronous Inc SDK 4.2.3 b1898)
<details><summary>Evidence (1)</summary>

- @ 0x10fd04d6 — chirp blocks

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
- **profile_schema:** Full profile JSON grammar recovered (chirp-core source paths /code/chirp-core/source/core/src/profile/{profile,protocol,protocol-acoustic,protocol-encoding,config}.c). Built-in profiles: 'audible', 'sonos-cdma', 'sonos_secure_setup', 'ultrasonic'. Top-level keys: 'schema_version', 'decoder_config'. Protocol-acoustic keys: base_frequency (>=20Hz), channel_count, channel_interval, envelope_attack, envelope_release, preamble (u64 list, >=1 byte, code must be in symbol range), header_note_duration, header_silence_duration, frequency_interval, body_note_duration, body_silence_duration, portamento, template. Protocol-encoding keys: alphabet_bits, crc_length, message_length_min/max, polyphony, rs_length_min/max (Reed-Solomon) — 'Total frame length cannot be more than 256 bytes' AND '256 symbols', 'Max message length too large to be expressed in a single symbol'. Decoder config keys: fft_size, hop_size, sample_rate_min, payload_metrics_enabled, buffer_metrics_enabled, voters\[\] each {amplitude_threshold, frame_offset (<= half-note limit), preamble_threshold, reverb_cancellation_exponent, reverb_cancellation_magnitude, spectral_weighting}. Banner: 'Chirp SDK with "%s" profile v%u \[max %u bytes in %.2fs\], supporting %u channel(s), using %s modulation.' Constraints: 'Bandwidth cannot be measured for equal-tempered settings', 'Minimum FFT bin is negative', 'Maximum FFT bin is bigger than half of the block size', 'Config/Protocol is not supported by sample rate: %d Hz', attack/release combination invalid checks. Payload: symbol_bits<=64 ('Created new payload (symbol_bits = %d, length = %d, total bits = %d)'), chirp_levenshtein decode-metric, chirp_decode_metrics_t, 'Generated random chirp with identifier: %s'.
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

## `cloud_api_paths`

**coverage** `partial`

The URL builders for every cloud call: `/tokens`, `/invite`, `/redeem`, `/users`, `/firmwareDownload`, `/softwareDownload`, `/accountSubscription`, `/productEvent`, each under household/player/service/group prefixes with query params like `protocolVersion=`, `accountId=`, `includeDeviceInfo=`. These are the outbound REST paths — the muse namespace routes are the inbound mirror of the same API surface.

**Technical description:**

paths {/tokens,/invite,/redeem,/users,/firmwareDownload,/softwareDownload,/accountSubscription,/productEvent} + prefixes {households/,players/,services/,users/,groups/} + subs {/permissions,/extended}; params {route=,protocolVersion=,mainAccountId=,inviteId=,accountId=,destinationServiceId=,includeDeviceInfo=,objectIds,currentVersion,updateId,requestPath,downloadSpeed,osVersion,accountType,accountHash,keyName,keyValue,targetType,targetid,reportFirmwareDownload}

- **name:** cloud-API URL builders + params
- **namespaces:**
  - **playback:** groupId+householdId routes {skipToPreviousTrack,skipBack,seek,seekRelative,loadContainer,trackList->loadTrackList,loadStream,lineIn->loadLineIn,content->loadContent,skipToTrack}; playbackExtended->getExtendedPlaybackStatus; playbackMetadata->{getMetadataStatus,ratings->rate}
  - **playbackSession:** {groupId}/playbackSession/{joinOrCreate,join,create}; {sessionId}/{rejoin,suspend,leave,loadCloudQueue,loadCloudQueueWithWindow,loadStreamUrl,loadStreamUrlWithContext,refreshCloudQueue,skipToItem,skipToItemWithWindow,seek,seekRelative}
  - **playerVolume:** {playerId}/playerVolume->{setVolume,getVolume}; /relative->setRelativeVolume; /mute->setMute; /duck->duck; /unduck->unduck
  - **playlists:** households/{hh}/playlists->{getPlaylists,{playlistId}->getPlaylist,getPlaylist->postPlaylist}; groups/{groupId}/playlists->loadPlaylist
  - **positioning:** {playerId}/positioning/{playStimulus,stimulusTuning->{set,get}StimulusTuning,session->{startSession,cancelSession},action->applyAction,sessionMap,deviceMeasurements,measurements->sendMeasurements,sessionError/sessionStatus/deviceStatus->notify*,measurementCapabilities,telemetryLevel->setTelemetryLevel}
  - **power:** {playerId}/power/policy->setPowerPolicy
  - **roomDetection:** {playerId}/roomDetection/chirp->startSignalling; chirp/{playId}->stopSignalling
  - **settings:** users/{userId}/settings->getSettings; players/{playerId}/settings->{getAllSettings,updateAllSettings}; player->{get,set}PlayerSettings; player/voice/allowMicrophone->setAllowMicrophone; setSelfTruePlay; enablePositioningMeasurement; sonosNetChannel->setSonosNetChannel; {groupName}->{get,update}SettingsGroup; hh/settings/{restrictedAdmin->{get,set}RestrictedAdminSettings,restrictedAdmin/userMetricsTracking->setUserMetricsTracking,public->getPublicSettings,protected/{setting},protectedAdmin/{setting}}
  - **sleepTimer:** groups/{groupId}/sleepTimer->{configureSleepTimer,getSleepTimer}
  - **smartplay:** households/{hh}/smartplay/content->getContent
  - **soundSwap:** {playerId}/soundSwap->triggerSwap; /request->requestSwap
  - **svc:** {playerId}/svc/{weatherConfig->{set,get}WeatherConfig,voiceCommand}
  - **systemReporting:** households/{hh}/systemReporting/{firmwareDownload,softwareDownload,accountSubscription,productEvent}->report*; target-less form renders "v1/\[error: 'none' is not a valid target\]/systemReporting/..."
  - **systemTime:** households/{hh}/systemTime/timeZone->{get,set}TimeZoneInfo
  - **time:** {playerId}/time/relative->getRelativeTime
  - **timers:** {playerId}/timers->getTimers; /create->createTimer; /setDuration/{timerId}->setDuration; /setRelativeDuration/{timerId}->setRelativeDuration; /pause/{timerId}->pauseTimer; /resume/{timerId}->resumeTimer; /{timerId}->abortTimer
  - **trueplay:** {playerId}/trueplay/{discovery->detectSpeakers,presenceDiscovery->detectSpeakerPresence,resetDetectedSpeaker,presenceRate->setSpeakerPresenceRate,config/{id}->{get,set}Configuration,status->getTrueplayStatus}
  - **trueroom:** {playerId}/trueroom/{estimatorConfiguration,adaptation,calibrationStatus->getCalibrationStatus,successTone->playSuccessTone,swapInputMute->setSwapInputMute}
  - **update:** {playerId}/update/{check->checkForUpdate,firmware->beginSoftwareUpdate,status->getUpdateStatus}
  - **upnp_bridge:** v1/players/{playerId}/upnp{SVC}\[+households/{hh}/\] for SVC in {AlarmClock,AudioIn,AVTransport,ConnectionManager,ContentDirectory,DeviceProperties,GroupManagement,GroupRenderingControl,HTControl,MusicServices,Queue,RenderingControl,SystemProperties,VirtualLineIn,ZoneGroupTopology}; each ->call; /subscription->subscribe; /subscription/{logicalSID}->{renew,unsubscribe}
  - **virtualLineIn:** {playerId}/virtualLineIn/{selectSource,startTransmission,stopTransmission,sendBackChannelCmd,startAudio,stopAudio}
  - **virtualRemoteControl:** {playerId}/virtualRemoteControl/buttonCommand->sendButtonCommand
  - **voice:** {playerId}/voice/accounts->{getVoiceAccounts,createVoiceAccount}; accounts/{accountId}->{updateVoiceAccount,removeVoiceAccount}; amazonChallenge->createAmazonChallenge; setup->notifyInitiateOnboarding
  - **zones:** households/{hh}/zones->getActiveZoneList; zones/definition->{getZoneDefinitionList,addZoneDefinition}; definition/{zoneId}->{get,update,remove}ZoneDefinition; missingDefinition->addMissingZoneDefinition; activeZone/{zoneId}->updateActiveZone; memberSettings/{zoneId}->updateZoneMemberSettings; activate/{zoneId}->activateZone; deactivate/{zoneId}->deactivateZone; players/{playerId}/zones/{join,unjoin}/{zoneId}
- **url_segments:** {households/,players/,groups/,services/,users/,/tokens,/permissions,/invite,/redeem,/users,/extended,/createGroup,/duck,/unduck,/firmwareDownload,/softwareDownload,/accountSubscription,/productEvent,/definition,/missingDefinition,/activeZone,/memberSettings,/activate,/deactivate,/unjoin}; params {route=,protocolVersion=,mainAccountId=,inviteId=,accountId=,destinationServiceId=,includeDeviceInfo=,objectIds}; verbs {deleteInvite,getUsers,redeemInvite,createInvite,batchTranslate,reportProductEvent,reportAccountSubscription,reportSoftwareDownload,reportFirmwareDownload}; fields {targetType,targetid,currentVersion,updateId,requestPath,downloadSpeed,osVersion,accountType,accountHash,keyName,keyValue}
<details><summary>Evidence (1)</summary>

- @ 0x10fba284 — cloudapi paths

</details>

## `cloud_synchronizer`

**coverage** `partial`

The background thread that registers all cloud sync services at boot and consumes just-in-time events, discarding ones it doesn't recognize. It's the glue between 'registered with the cloud' and 'receives pushed state' — a failed synchronizer leaves the device registered but deaf to cloud-initiated changes.

**Technical description:**

cloud_synchronizer thread: registerServices (max-count abort, called-once guard), "received JIT event", "discarding %s type %d"

- **name:** RCloudSynchronizer
<details><summary>Evidence (1)</summary>

- @ 0x10ef1ba0 — cloudrequest region

</details>

## `common_logger`

**coverage** `partial`

The logging infrastructure config: filter/level/fileSize/preserveSize/host settings, the `\[category | timestamp\]` line format, category-name validation, and log-shipping to a host. The log-domain list (anacapa_logger.toml categories) is the vocabulary behind every diagnostic trace.

**Technical description:**

keys {filter,fileSize,preserveSize,defaultLevel,backup,hostIP,hostPort,STDERR,.backup,logger,rsettings}; line fmt "\[%s | %07ld%03ld\] <%s,%d> "; "Invalid log category name (%s), length: %zu, range \[%d, %d\]"; IO {stat/ferror/read failed}; E_ codes {E_INVALID_SETTING,E_UNSUPPORTED,E_NETWORK_DATA_ERROR,E_NETWORKIOERROR,E_NETWORKTIMEOUT,E_NETWORKOVERFLOW,E_INTERNALERROR,ADD_ME}; rapidjson errors {Invalid escape character,Surrogate pair invalid,Invalid encoding,Number too big for double,Miss fraction/exponent,Missing name/colon/comma,Parsing terminated,Unspecific syntax error,Missing closing quotation mark,Document empty,Document root not singular}

- **name:** common_logger config
<details><summary>Evidence (1)</summary>

- @ 0x10f933f8 — logger+json

</details>

## `cpu_monitor`

**coverage** `partial`

A /proc/stat reader that logs per-core usr/sys/idle/IRQ percentages with a shutdown-state detector and divide-by-zero guards. Internal telemetry — it explains 'core idle at N%' lines in diagnostics.

**Technical description:**

reads /proc/stat; header " \[%d\] usr sys idle sIRQ | irqD dMS"; row " \[%d\]  %2u  %2u   %2u   %2u | %6u %5lld"; parses %zu x7; "cpu%d switched to a shutdown state"; "Avoided dividing by zero calculating cpu core: %d bOverflow: %d"; "core%d: idle at %d%%"

- **name:** CPU monitor
<details><summary>Evidence (1)</summary>

- @ 0x10ea5d00 — cpu monitor region

</details>

## `crash_report`

**coverage** `partial`

Crash-event telemetry: per-process crash counts with upload responses (procName, numCrashes, uploadResp, playerCrash, lifetime). Reported events feed the crash-upload cloud service; failed uploads are logged for retry.

**Technical description:**

{procName,numCrashes,uploadResp,playerCrash,lifetime}; "%s %s crash event, crashCount: %i"; Reported/Failed to report

- **name:** crash-event reporting
<details><summary>Evidence (1)</summary>

- @ 0x10f028b8 — crashreport block

</details>

## `crossfade`

**coverage** `partial`

The crossfade engine that blends the tail of one track into the head of the next. It works in samples with explicit usec accounting, handles both int16 and typed streams, and bails cleanly on underflowed or empty streams rather than producing a glitch. `CrossfadeMode` in AVTransport controls it; the engine itself is what makes the fade sample-exact.

**Technical description:**

{"attempting to crossfade with underflowed stream","recovered crossfade stream underflow","crossfade %zu samples","attempting to int16 crossfade with empty stream, clearing crossfade","unknown stream type in int16 crossfade: %d","crossfaded %zu bytes (%zu samples, %zu usec), %zu more samples to fade this frame, %zu samples to fade","unknown stream type in crossfade: %d","ending xfade","xfade already on - %zu samples remain unwritten","xfade corked stream: replace buffered data via non-xfade overlap","xfade timestamp too far in past, nst %d.%06d, pt %d.%06d","set xfade lfnf","xfadeable timestamp","inserting volume norm ramp: %d @time %d.%06d","xfade for %zu samples, %f seconds","xfade gap, samples %zd","starting xfade (xfade %s)"}; fmt %ld:%02ld:%02ld; "notifyStateChange \[%s\]: itemId: %s ptvWhen %d.%06d ptvTrackPos %ld.%06ld" + "notifyStateChange music quality: %s"

- **name:** crossfade engine
<details><summary>Evidence (1)</summary>

- @ 0x10eb9ee8 — xfade block

</details>

## `csfcm`

**coverage** `partial`

The channel-source frame-context manager: a bounded pool of frame contexts that get marked, added, flushed, and popped with timestamps — 'NO FREE CONTEXTS' is the saturation failure. It maintains the playback-position/hint bookkeeping the chsrc engine uses to label each outgoing frame.

**Technical description:**

csfcm; pool {'marking (t:%d)','add %d.%06d %zu %s %d/%d free','NO FREE CONTEXTS','flushing (t:%d)','flushed %d.%06d %s','popping %d.%06d %s (%d.%06d < %d.%06d) %d/%d free'}; log fmt '%s:%05d \[%s\] pos:%u/%u hint:%s/nextState:%s/reqOp:%s/itemID:%s'

- **name:** channel-source frame-context manager
<details><summary>Evidence (1)</summary>

- @ 0x10eb5f04 — csfcm

</details>

## `daemon_ipc`

**coverage** `partial`

The /X-external proxy table that forwards requests to sibling daemons — sonospowercoordinator, btmanager, sonosledmgrd, netstartd — plus the watchdog and sentry upload routes (with watchdog_log/watchdog_dmesg attachments). The netstartd channel's wire format is now decoded: every message on /tmp/netstartd.ipc is a 12-byte header {fieldA, fieldB, length} followed by {u32 message-id, payload} where the declared length includes the id itself (4..0x804); ids 31-91 are netstartd events dispatched through a 61-entry jump table, ids >= 0x40 take a local handler path. A 'hello' message is sent immediately after 'IPC established', with automatic reconnect on timeout and clean teardown logged as 'IPC closed'. The first 8 header bytes belong to libsonos's ReadIPCHeader and their fields aren't resolvable from anacapad alone.

**Technical description:**

routes {/anacapad-external,/sonospowercoordinator-external,/btmanager-external,/sonosledmgrd-external,/netstartd-external} proxy to sibling daemons; watchdog {/watchdog,/watchdog-legacy,/legacy-to-sentry,/upload} + attachments {watchdog_log,watchdog_dmesg} + crashdump; sentry {"No URL found to upload dump file: %s",text/plain; charset="us-ascii","Failed to write attachment %s to sentry upload",sentry\[tags\]}; flags {/tmp/anacapa_prevent_crashdump_upload,/tmp/backtrace,/tmp/crashed_play_state,/jffs/app/debug/sonosledmgrd.dmp,/opt/log/btservice.log}; "writeStream failed - Bytes compressed: %d/%d" + htsnk

- **name:** /X-external daemon proxy + watchdog/sentry
<details><summary>Evidence (1)</summary>

- @ 0x10ea7e40 — daemon ipc block

</details>

## `dataio`

**coverage** `partial`

The shared HTTP transport: a poll loop, header parsing (HTTP Result, Last-Modified, Content-Type, SET-COOKIE, cache-control/max-age, ETag, WWW-Authenticate), and guarded reads ('tried to read N bytes where only M available'). Most non-audio HTTP the device makes runs through this layer.

**Technical description:**

dataio.poll; parses {HTTP Result,Last-Modified,Content-Type,SET-COOKIE,cache-control,max-age=,ETag,WWW-Authenticate}; errors {'populate client config failed','unexpected response condition','parse_key failed',"Couldn't load api header, error 1/2"}; awaitAvail {'tried to read %zu bytes where only %zu available','range limited %zu bytes available','socket is closed','took %ldms (e:%d b:%zu w:%zu sbo:%d)'}; SSL 'SSL %s error -0x%x %d to %s with local port %u' + session ticket during dataio SSL read; http {'http readable but 0','http read error %d %s','http timeout'}; header validation {'Bad HTTP Header','BAD HTTP Header EOR mismatch Actual: %zu, Exptd: %zu','BAD HTTP Header EOR out-of-bond'}

- **name:** dataio HTTP transport
<details><summary>Evidence (1)</summary>

- @ 0x10ee7cd4 — dataio block

</details>

## `desired_settings`

**coverage** `partial`

The Desired* replicated settings: DesiredTimeFormat, DesiredDateFormat, DesiredTimeServer, DesiredTime, TimeZoneForDesiredTime, HouseholdUTCTime, DesiredDailyIndexRefreshTime. 'Desired' means 'what the household wants', as opposed to what's currently applied — the distinction matters during merges and clock sync.

**Technical description:**

{DesiredTimeFormat,DesiredDateFormat,DesiredTimeServer,DesiredTime,TimeZoneForDesiredTime,HouseholdUTCTime,DesiredDailyIndexRefreshTime}

- **name:** Desired* setting keys
<details><summary>Evidence (1)</summary>

- @ 0x10f1164c — desired settings

</details>

## `dev_disc`

**coverage** `partial`

The SSDP device-discovery thread (ddt): logs MSEARCH/ALIVE/BYEBYE per device with source addresses, counts lost SSDP messages, handles CDALIVE/CDBYEBYE and QUARANTINE_RECHECK packets, and takes 'hint' hints for faster convergence. This is how players find each other on the LAN before topology forms.

**Technical description:**

devdiscthr/ddthrd.cxx: rx logging "%s - rx MSEARCH %s from %s:%d (%zd %d %d)", "%s - rx %s ALIVE %s %s %d %u %s (%zd)", "%s - rx %s BYEBYE %s", "%s - rx CDALIVE %s %s %d", "%s - rx CDBYEBYE %s", "rx  QUARANTINE_RECHECK %s"; "%s - %u SSDP messages lost"; zp byebye; "ddt hint:%d"; "Finished working on type %d"

- **name:** RDevDiscThread/ddt SSDP device discovery
<details><summary>Evidence (1)</summary>

- @ 0x10ef1d08 — ddthrd.cxx

</details>

## `device_registration`

**coverage** `partial`

The two-phase secure-enrollment handshake: `POST /product/v2/households/{hh}/players?action=refresh` starts it, `?action=complete&token={tok}` finishes with the issued credential. The FSM logs state changes, handles suspend/resume mid-registration, retries on schedule, and treats an unexpected 401 as terminal. This is the path a replacement or reset player takes to get a household cert.

**Technical description:**

Two-phase enrollment: POST /product/v2/households/{hh}/players?action=refresh then ?action=complete&token={tok}; FSM "regState changed %d -> %d" + "Transfer mode old (e:%d) new (e:%d)"; logs {during suspend,time expired,success,retrying registration at time %ld,error,Unexpected 401 response}; vars {regStatus,playerReg,sslerror,errno,mutualssl,sslError}; cert lifecycle {Flushed cert,removed invalid cert}; secure-reg-transfer IPC: signing key via {"Invalid registration signing key in IPC payload","Registration signing key set/cleared"}, jobs {tjmgrExitSecureRegTransferState,newRegisteredCertSonosIDLocked,exitSecRegTransferState}; household-customer conflict {"Household customer ID \[%s\] in conflict with local device \[%s\]","changed \[%s\] -> \[%s\]"} vars {RegisteredCustomerID,RegisteredCertSonosID}; events {Received %s event. Sonos ID,NewCertRegistrationEvent inprocess-event}; RegisterZoneProvider UPnP action; replicated headers {X-RINCON-LAST-UPDATE-DEVICE,X-RINCON-CONTENT-FORMAT,CONTENT-ENCODING,X-RINCON-SIGNATURE} + "unexpected content version/format"; {ReplicatedSettings,settingsReplication,netsettingsReplication}; "Removing settings denylists after registration"

- **name:** secure device registration (regdevicecert)
<details><summary>Evidence (1)</summary>

- @ 0x10efc8f8 — regdevicecert rodata block

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

## `devicecertmanager`

**coverage** `partial`

The manager that downloads and refreshes the device cert from the cloud: ETag-cached GETs, metadata records (requestTimeMS, downloadStatusCode, previousETag), 'downloaded' vs 'unchanged' outcomes, and a scheduled refresh job when metadata is unknown. This is how a player's identity cert survives factory refurbs and re-enrollment.

**Technical description:**

ETag-cached downloads; metadata {requestTimeMS,downloadStatusCode,httpResultCode,previousETag}; outcomes {downloaded,unchanged}; "Cert download attempt finished"; "Unknown cert metadata state: %s. Scheduling cert refresh job."; error taxonomy {BAD_FILE,BAD_KEY,BAD_CERT,BAD_ISSUE_DATE,MISMATCH_ENV,MISMATCH_ISSUER,MISMATCH_HHID,MISMATCH_USER,not_present}; headers {X-Sonos-Muse-Household-Id,X-Sonos-Denylisted}; "Retrieved manufacturing data: %s"; files generated lazily "file not available yet, generating"

- **name:** device cert download manager
<details><summary>Evidence (1)</summary>

- @ 0x10ef2224 — devicecertmanager block

</details>

## `diagnostics`

**coverage** `partial`

The distributed diagnostics engine: builds a DiagnosticManifest (v2.0.0), POSTs to `/v2/diags` on product-diagnostics with serial_num, distributes a diagId to every player, triggers per-device collection, and gathers the results. `submitDiagnostics` in the app is the front door to this pipeline.

**Technical description:**

manifest <DiagnosticManifest attrs> ver 2.0.0 → POST /v2/diags product-diagnostics; init body {"serial_num":"%s"}; fields {quarantined,secreg,swversion,ZPSupportInfo,ZPInfo,LocalUID,IPAddress,SoftwareVersion,QuarantineReason,StubReason,ZPNetworkInfo}; coordination: distribute diagId to players, trigger diag on controllers, collect submit statuses ("Timed out waiting"/"All devices reported"); files {manifest.xml,%s.xml,%s.sha256,%s.xml.gz}; modes {Diagnostic stub,Local diagnostic}; local aggregate http://localhost:%u/support/aggregate?type=%s&f=%x&e=%x; diag_progress var; counters Num players/Num stubbed players

- **name:** distributed diagnostics
- **coordinator:** DiagMgr: types {Healthcheck,Feedback,ExtraLocal,Diagnostics}+diag_metadata; ops {submitQueuedDiagnostic,SubmitDiagnostics}; queue bounds {"submission queue full","result queue full"}; params {includeControllers,initiatingDeviceId} fmt %s%hu; delayed "triggered ... for %us from now"; results {unrecognized status,Failed to update status,failed-other submission in process,unsuccessful-no devices submitted,successful}; completed log "submissionId: %s, status: %d, diagnosticId: %d"; zpDiagSubmit+tracking+diag_mgr vars; <ZPNetworkInfo type = 'User'> + <!-- START/END UUID: %s --> markers + " unreachable"
<details><summary>Evidence (1)</summary>

- @ 0x10f05460 — certmanager block diag region

</details>

## `didl_extractor`

**coverage** `partial`

The DIDL-Lite metadata extractor: pulls Sonos `r:` fields (tiid, radioName, trackGain, chapterNum/Count, linkUrl, isAd, streamContent, podcast/episode/audiobook fields) and standard upnp/dc fields (originalTrackNumber, album) out of track XML, keyed by class (podcast, show, audiobook chapter). Every queue entry and Now-Playing display reads through this.

**Technical description:**

rincon md fields {tiid,radioName,connotation,state,trackGain,chapterNum,chapterCount,linkUrl,isAd,streamContent,audioInputIcon,radioShowMd,streamInfo,rating,policies,podcast,episodeNumber,releaseDate,narrator,albumArtist,numSections} + upnp {originalTrackNumber,album}; classes {object.item.audioItem.podcast,.show,.audioBook.chapter,.musicTrack.recentShow}; loadFromExtraMd(trackURI,extraMd); extractMimeTypeFromHttpContentType (trunc/mtParams errors); protocolInfos {http-get,rtsp-rtp-udp,x-sonos-vli:*:audio:*,x-rincon-queue:*:*:*}; " duration=" attr; &#10; newline; -yYy- marker

- **name:** RTrackDIDLLiteMdExtractor — track DIDL parser
- **uri_service_map:** {x-rincon-mp3radio,x-rincon-internal,x-rincon-buzzer,sonos.com-{hls-static,hls-radio,hls-aac,rtrecent,spotify,http,mms},x-sonosapi-iqradio,audio/x-sonos-recent,pandora.com-{pndrradio-http,pndrradioad},real.com-{rhapsody-direct,rhapsody-http-1-0},sirius.com-sirradio,last.fm-radio-http,https:,file:,rhap:,radio-{rhap,radea,npsdy}:,pndrradio-http://,pndrradioad://,lfmtrack:,x-sonos-dock:,hls-static://}
<details><summary>Evidence (1)</summary>

- @ 0x10ecc67c — didl extractor block

</details>

## `drm_content_keys`

**coverage** `partial`

The DRM key path: `skd://itunes.apple.com/P{pid}/s1/e1` StoreKit URIs for FairPlay content keys, duplicate-entry detection, and the `X-Sonos-Playback-Id` header services use to correlate a playback with the device that requested it. Also houses the OAuth-vs-credentialType check for getDeviceAuthToken.

**Technical description:**

skd://itunes.apple.com/P{pid}/s1/e1 StoreKit URI; "duplicate content key entry detected from ContentKeys"; X-Sonos-Playback-Id: %s header; "getDeviceAuthToken was called for %s (%u), which has credentialType = %u (not OAuth)"

- **name:** DRM content keys + playback-id header
<details><summary>Evidence (1)</summary>

- @ 0x10f1032c — drm block

</details>

## `dropout_logging`

**coverage** `partial`

The dropout-event telemetry: tracks group-role changes, corrected-context changes, and presentation-time conditions; slots events into a bounded list with per-condition increments ('set pt reached', 'pt in fut - inaud'). This is the data behind 'why did my music skip' support queries.

**Technical description:**

triggers {corr ctx chg evt type %u,grp role chg evt %u->%u,clear/set cid src=%u,set/reset pt}; slot model {clr slot,slot in use skip incr,set slot %zu idx %zu to %s,no space in list}; conditions {set pt reached,flag report at %zu sbmt,set pos aud,pt in fut - inaud,GCI but no CID}; per-ch incr "incr call: %s, %zu, %zu, ch %zu, %d.%06d"; fields {inputType,SatChCount,HtsnkVersion,msAfterPt,GroupRole,GCTimeValid,GCTime,btRole,submit}; counters {htsnk_missed_total,htsnk_missed_duration_total,htsnk_late_total,htsnk_strm_reset_duration_total,htsnk_strm_silence_duration_total,htsnk_strm_plc_duration_total}; reasons {chsnk_lse,chsnk_ch_data_full,chsnk_w_err,chsrc_framer_uflw,htsnk_invld_sntp,htsnk_late_frames,htsnk_missed_frames,htsnk_time_backw,htsnk_stream_err,htsnk_stream_uflw,htsnk_stream_reset_duration,htsnk_wrong_frame}; bt_audio + injectdropout test cmd {"missing dt param","Injected dropout error"}; "Sat chs %zu"/"Sat htsnk ver %u"

- **name:** DropoutEventHandler — dropout telemetry
<details><summary>Evidence (1)</summary>

- @ 0x10ebe644 — dropout handler block

</details>

## `dsp_files`

**coverage** `partial`

The DSP file inventory: eqdata.txt, persistentEQ.xml, dsp_preset*.xml, dsp_system_*.bin, satellite_processor.bin under `/dsp` and `/opt/dsp`, plus the sonar-tone flush path and an amp-timer hook. These are the loadable DSP personalities — preset vs system vs satellite variants.

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

## `dsp_params`

**coverage** `partial`

The `/drc`, `/staticparams`, `/dynamicparams` param surfaces: DRC boost, speaker angles (front/height/rear-surround), virtualizer mode, bass extraction, DAP cutoff, filters, and per-mode profiles. `Config not found, loading default` is the fallback path. This is the runtime DSP tuning surface behind `/status` pages.

**Technical description:**

errors {error parsing mode state,error parsing bass extraction mode,error parsing dap profile mode}; /drc {boost}; /staticparams {speakers,directdec,virt_mode,frontangle,heightangle,rearsurrangle}; /dynamicparams {oarBassExtraction,dapCutOff,hfilt,post,vlamp,vmcal}; "Config %s not found, loading default" + /default

- **name:** /drc /staticparams /dynamicparams
<details><summary>Evidence (1)</summary>

- @ 0x10fe6a4c — dsp params block

</details>

## `dts_decoder`

**coverage** `partial`

The DTS decoder (dcadec): profile taxonomy from Digital Surround through ES, 96/24, HD-HRA, HD-MA, and Express; endian-checked sync detection; and a status XML with BitDepth/DTSProfile/BitRate/NumPrimaryChannels. Invalid audio modes return an empty speaker layout rather than crashing.

**Technical description:**

profiles {Digital Surround,Digital Surround 96/24,Digital Surround ES,High Resolution Audio,HD-MA,Express,Unknown DTS profile}; sync "Endian-Check: Unexpected Input Syncword Error"; "invalid dcadec audio mode, returning empty speaker layout"; status <BitDepth><DTSProfile><BitRate><NumPrimaryChannels><AudioMode><DialNormGainDB><ChannelMap>; errors {invalid sample size N-bit,encoded frame exceeds maximum,packet parse,frame 0 warning,unsupported sample freq,unsupported amode}; modes {Dual Mono,Stereo}

- **name:** dcadec — DTS decoder
<details><summary>Evidence (1)</summary>

- @ 0x10fe7670 — dcadec block

</details>

## `ducking`

**coverage** `partial`

**Technical description:**

duck.cxx inter-player ducking protocol: 64-bit ducking flags queued per-source ('Queueing ducking bit from %s 0x%016llx - %d', 'zone %d received ducking bit 0x%016llx - %d', 'too many pending ducking bits', 'Dequeueing ducking bit 0x%016llx'), tracked under duck_tracker_mtx with expireRemoteDuckingFlags + runDuckingHeartbeat (a liveness heartbeat that expires remote duck flags); commands forwarded to members ('failed to forward duck command %s to %s'). Policy gates on the request path: 'ducking globally enabled/disabled, honoring/dropping duck req', 'voice enabled device, dropping muse duck request', 'failed to acquire gc/avt, honoring duck req', 'playing tv, drop duck req'; muse ducking policy setting ('muse ducking policy: %x -> %x', key R_MuseDuckingPolicy) + fastvolduck/duckOrUnduck paths; 'process ducking flags 0x%016llx -> %s' + 'Ducking flags unchanged. No update to send.'; DUCKING_LOCAL_MUSE bit auto-cleared by timeout ('WARNING: DUCKING_LOCAL_MUSE cleared by timeout'). Evented XML <PlaybackDucked>%u</PlaybackDucked> + <DuckingFlags>%s</DuckingFlags> + DuckingEvent + isDucking + RecordDuckingActionEvent telemetry. Alert/chime layer: alertContent loop player ('alertContent: %s no read source', 'could not open default content for %s', 'default interrupted %s', 'completed default loop \[rclS:%lld\]'), household chimes ('playing join household chime', 'stopping/ramping down discovery chime', JOIN_CHIME_UNAVAILABLE/REGISTRATION_CHIME_UNAVAILABLE), transport restore after chime ('restoring after {pause,stop,end} chime: ret=%d ar=%d wrca=%d pavt=%d'), AUDIOCLIP/ALEXA_ALERT clip types, spotify:interruption: URIs, muse audioClip resource + /duck//unduck endpoints + v1/players/%s/playerVolume/{duck,unduck} outbound fan-out.

- **name:** duck.cxx — group ducking engine
<details><summary>Evidence (1)</summary>

- @ 0x10ebf1a4 — duck.cxx

</details>

## `effective_settings`

**coverage** `partial`

The `effectiveSettings` muse resource: `getAllSettings`/`updateAllSettings` plus per-group get/update, exposed on player and household routes and mirrored at `/settings/api/v1/locations/*/effectiveSettings`. 'Effective' means resolved after layering — what actually applies, not what was last written.

**Technical description:**

routes v1/players/{playerId}/effectiveSettings{,/{groupName}} + household variants; verbs {getAllSettings,getSettingsGroup groupName,updateAllSettings,updateSettingsGroup groupName}; /settings/api/v1/locations/%s/effectiveSettings{,/%s}; keys {isEffectiveP2PPolicyEncrypted,effectiveSettingsDataChanged,patchEffective*,playerSettingsEvent}; "\[Mg\] getEffectiveSettings() bad groupId \[%u\]"; "\[Mg\] internalReadEffectiveValuesLocked_jsonValue(%s) bad keyId %u \[grkId:%u|end:%u\]" (key-id store)

- **name:** effectiveSettings muse resource
<details><summary>Evidence (1)</summary>

- @ 0x10e7ceb8 — effsettings block

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

## `enet_stats`

**coverage** `partial`

Ethernet port telemetry: `<EnetPorts>` XML with per-port link/speed, EthPrtStats counters (rx/tx packets/bytes/errors/drops/multicasts/collisions), and deep EthIntrf detail (CRC, frame, FIFO, missed errors). The `/enetports` and `/ethportstatistics` endpoints serve this data.

**Technical description:**

<EnetPorts><Port port='%d'><Link>%d</Link><Speed>%d%s</Speed></Port></EnetPorts>; EthPrtStats counters {rxPackets,txPackets,rxBytes,txBytes,rxErrors,rxDropped,txDropped,multicasts,collisions}; EthIntrf detail {lngthErr,ovrFlwErr,crcErr,frmeErr,fifoErr,missedErr,RxDtlErr,abrtErr,crErr,hrtBeatErr,wndwErr,TxDtlErr}; /sys/class/net/eth0 + eth%u

- **name:** ethernet port stats
<details><summary>Evidence (1)</summary>

- @ 0x10ef3494 — enet stats region

</details>

## `entitlements`

**coverage** `partial`

Sonos-side licensing: each account/household can carry <Entitlement> records (type, isTrial, sku, date range, codes). The runtime policy consults them — e.g. a Sonos Business (SBiz) entitlement blocks Sonos Radio preinstall. Changes fire entitlements_changed events. Fetched cloud-side, cached locally, and diffed on refresh.

**Technical description:**

/entitlements/api + "using cloud URL: %s" + X-Sonos-User-Id header + cache {cache-control,etag} + "cloud entitlements: rc %d, http %d"; internals {savePendingEntitlementsLocked,entmt,"unable to fire internal changed event","calling notifyClients","triggering version changed muse event",entitlements_manager,entitlements_mgr,"failed to get valid userId","Failed to get Entitlements Cache","No valid HTTPCacheManager","entitlements for "%s" changed","scheduled job to consider updating Sonos Radio"}; "Insufficient buffer for header line \[%s\]"

- **name:** EntitlementsManager — cloud entitlements
- **consumers:** entitlements feed RRuntimeZPPolicy (ctor 'Cannot construct RRuntimeZPPolicy \[localSettingsMgr=%s,entitlementsMgr=%s\]' -- the runtime authz policy consults them); the SBiz entitlement gates Sonos Radio preinstall ('no SBiz entitlement; preinstalling Sonos Radio' vs 'found SBiz entitlement; blocking preinstall'); staleness triggers a refresh job ('stale entitlements; scheduling job to refresh'); on ENTITLEMENTS_CHANGED the old set is stashed for diffing ('stashed existing entitlements to compare later').
<details><summary>Evidence (1)</summary>

- @ 0x10ebf80c — entitlements block

</details>

## `esdk_events`

**coverage** `partial`

The eSDK telemetry channel (evs): event types EsdkPlaybackStats, EsdkPlaybackErrors, EsdkHttpErrors, EsdkDownload, EsdkEvent, EsdkCapabilities; EndSong records carry ms_played and track ids; events encode into an envelope and ship over `hm://hwp-events/v1/log_event`. Spotify-side playback metrics come from this pipeline.

**Technical description:**

{EsdkPlaybackStats,EsdkPlaybackErrors,EsdkHttpErrors,EsdkDownload,EsdkEvent,EsdkCapabilities}; endsong {ms_played:%zu,"Overwriting EndSong track_id with new value!","no track ID/file ID: played:%zu, ms:%zu",intent (%s)}; evs {evs_default_cb %s. error %d,"Error encoding %s","Error encoding envelope","Error sending %s"}; channel hm://hwp-events/v1/log_event; "No file with desired bitrate"; error report "device_id=%s, playback_id=%s, track_uri=%s, source=%s, hostname=%s, url=%s, error_code=%d, stack_error_message=%s, stack_error_code=%d, response_status_code=%d"

- **name:** eSDK event telemetry (evs)
<details><summary>Evidence (1)</summary>

- @ 0x10fe2c2c — evs

</details>

## `esdk_httpio`

**coverage** `partial`

The eSDK HTTP layer (`eSDK/httpio`, version 3.205.205): request formatting (hostname/path), response parsing (transfer-encoding unsupported variants, CDN content-encoding rejection, redirects, content-range validation, header-end detection), socketio timeouts and read/write/EOF errors, and DNS result handling. Its strictness explains which CDN/redirect behaviors the player tolerates.

**Technical description:**

tag eSDK/httpio + 3.205.205; {req_hostname,req_path,"Failed to format http request"}; response {"transfer-Encoding","unsupported transfer-encoding","CDN content-encoding unsupported","Redirect to %s","failed to parse or invalid content-range '%s' (req_offset:%d)","Content-Type: %s","bytes ","can't find HTTP headers end marker","invalid HTTP header, can't find protocol marker or status code","failed to find HTTP header line end marker"}; socketio {"%s operation timeout","failed to write/read data to/from socket '%i'","reached socket EOF"}; DNS {"Result for \"%s\" : addr %s","Invalid address family %d","Failed for \"%s\", error %d"}; {"Unable to set the track info","Unable to set hostname","No domain in URL","No http/https in URL","Failed to decode LicenseResponse"}

- **name:** eSDK httpio layer
<details><summary>Evidence (1)</summary>

- @ 0x10fe4a38 — httpio

</details>

## `esdk_socket`

**coverage** `partial`

The eSDK's raw socket layer: IPv4-only (IPv6 explicitly unsupported), DNS queueing with a bounded queue, connect/bind/accept error taxonomy, socket-option plumbing, and the socketio stream FSM (INACTIVE/STARTING) that decides new-vs-reused sockets. Everything eSDK does on the wire lands here.

**Technical description:**

{"recv(%d, %p, %d) = -1 (errno %d: %s)","Socket close/getsockname/bind error: %d","Tried to use IPv6 but this platform does not support it.","connect(%d %s port %d)","Socket connection error: %d","Unable to set option:%d error:%s(%d)","Creating IPv4 socket (domain %d)","No free sockets available","Unable to create socket","Socket accept error: %d","Network initialization failed. error code: %d"}; DNS {"Failed DNS request for \"%s\", error %d (%s)","Successfully enqueued DNS request","Unable to enqueue DNS request, queue is full"}; stream {"STREAM_STATE #%u: %s -> %s",STREAM_INACTIVE,STREAM_STARTING}; socketio {"work_mem","can't parse url","New socket required: %d%d%d%d%d","creating new socket","reusing the socket","failed to format/write/read HTTP headers","not enough memory to read HTTP headers or invalid HTTP headers","no active socket","socket read failed"}; channels {"out of buffer! asked for %d bytes","error: out of channels","channel %d data %p size %d","CDN URL is too long to handle: %d","AP error %d on channel %d","cb->used + data_size < cb->size","Sent %s(%d) to ap Size %d"}; {".spotify.com",HTTP/1.,ap_list"}

- **name:** eSDK socket layer
<details><summary>Evidence (1)</summary>

- @ 0x10fdec20 — sockets

</details>

## `event_loop`

**coverage** `partial`

The main event loop: a thread pool processing queued work with watchdog timestamps, logging start/stop/drain/shutdown and elapsed time. Virtually everything async in anacapad funnels through this loop.

**Technical description:**

eventLoopThreadPool + watchdogTimestamp; logs {Eventloop started. Threads: %zu,stopped,has no more work,shutdown. Cancelling watchdog,failure,elapsed-time:%lld}

- **name:** main event loop
<details><summary>Evidence (1)</summary>

- @ 0x10f05d80 — eventloop region

</details>

## `eventloop_perf`

**coverage** `partial`

The in-process event loop plus its perf counters: per-observer callback durations are checked against a threshold ('exceeded duration threshold Nms > Mms'), and counters track events queued, failed-to-queue, and per-subject stats. This is how slow event handlers get caught.

**Technical description:**

"Eventloop %p configured/removed"; inprocess-events-loop; "%s callback in observer %s exceeded duration threshold %lldms > %lldms"; counters {"Unique identifier for a set of counters","In-Process Event Subjects","The number of events queued",perf_counter_keyed,queueFail="events that failed to queue","The event size in bytes",dispatchDelay="time waiting to dispatch","In-Process Event Observers",cbTime="observer handler duration. Warn if over threshold"}

- **name:** inprocess eventloop + perf counters
<details><summary>Evidence (1)</summary>

- @ 0x10faf178 — eventloop

</details>

## `exec_pages`

**coverage** `partial`

The `/status` exec pages: a command table mapping diagnostic URLs to shell commands — `/debugfiles` (ls jffs debug dirs), `/du-jffs`, `/ifconfig`, `/lsmod`, `/mount`, `/netstat`, `/ntpsources` (chronyc), `/ps`, `/route`, and more. These are literal shell-outs behind admin pages — their output is raw command text, not a schema.

**Technical description:**

{/debugfiles:"/bin/ls --full-time /jffs/app/debug /jffs/sys/debug /jffs/net/debug",/du-jffs:"/usr/bin/du -a -d 5 -k -x /jffs",/ifconfig:"/sbin/ifconfig",/lsmod:"/sbin/lsmod",mount:"/bin/mount",/netstat:"/bin/netstat -an",/ntpsources:"/bin/chronyc -n sources -v",ps:"/bin/ps",/route:"/sbin/route -n",/scanresults:"/wifi/athconfig scangetresults ath0",/showmacs:"/usr/sbin/brctl showmacs br0",free:"/usr/bin/free",date:"/bin/date"}; jobs {RefreshSSLCache,"Save SSL Client Cache to JFFS",SaveSSLCache}; more {/showports:"brctl showports br0",/showstats:"brctl showstats br0",/showstp:"brctl showstp br0",uptime:"/usr/bin/uptime"}; file pages {/VERSION,/etc/resolv.conf,/jffs/app/log/anacapa.log.backup,/jffs/app/log/upgrade_mgr.log,/jffs/irconfig.txt,/jffs/localsettings.txt,/jffs/netstartd_prev.log,/jffs/recovery.log,/jffs/recovery_prev.log,/jffs/settings/alarmclock.xml,/jffs/settings/areas.json,/jffs/settings/cloudconfig.json,/jffs/settings/householdsettings.json,/jffs/settings/zones.json,/jffs/settings/zpMetricsConfigV2.xml,/jffs/shadow/stats,/jffs/sys/log/setup{,_ok}/setup.{dmesg,log},/jffs/upgrade{,_prev,_tmp_prev}.log}

- **name:** /status exec-page commands
<details><summary>Evidence (1)</summary>

- @ 0x10e74f10 — exec table

</details>

## `ext_audio_src`

**coverage** `partial`

The external-audio-source job engine: clips/TTS arrive as jobs with a FSM (STARTING→RESUMING→RESUMED / CANCELLED / DISCARDED), priority, and exclusivity — too many jobs drop new ones, deferred streams queue up. Clip types include doorbell-style AUDIOCLIP, ALEXA_TTS, and ALEXA_WELCOME. This is what plays voice-assistant responses over music.

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

The favorites store: user radio stations and recents, replicated across the household with an accept/reject decision ('deciding whether to accept replicated list'), DIDL namespacing, and migration paths from old Rhapsody-era and non-OAuth formats. `FavoritesUpdateID` in ContentDirectory events is this store's change counter.

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
- **mutate_semantics:** Reorder verbs: 'Did not move favorite (%s "%s"); rc %d' + itemsMoved/radioFavoritesMoved notifications. Metadata fields beyond favoriteId/ordinal: r:description, r:resMD, r:room, r:playmode, r:type (all under urn:schemas-rinconnetworks-com:metadata-1-0/\|). Categories: :shortcuts/:playlists/:audiobooks. Station classes: 'TuneIn Station', 'Custom Station', 'Radio Show', 'instantPlay'. DIDL forms: object.item.audioItem.musicTrack, object.container.radioShow, object.item.audioItem.audioBook, object.item.sonos-favorite ('object.item'+'object.item.sonos-favorite' concat). res protocolInfo: x-rincon-mp3radio:*:*:*, x-sonosapi-show:*:*:*, x-sonosapi-stream:*:*:*. Account URI SA_RINCON%d_; parsing: 'Failed to parse account service ID / serial number from Sonos URI. favorite=%s, uri=%s'. Mutate pipeline: informReplicationAndNotify / informReplicationAndNotifyForDestroy → offerRemoteSetting → userradio{,.d}.xml replication ('replicating favorites from %s', 'deciding whether to accept replicated list'). Legacy conversion: 'Successfully converted old rhapsody favorite. Was: %s, now: %s' + 'Failure converting old non-OAuth favorite'. Errors: 'Invalid favorite id.'/'Could not access favorites.' + initContentResource (Unable to parse URI/extract item ID/Invalid item ID %s/No valid mapping for item type %d).
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

## `fcs_detail`

**coverage** `partial`

The fcs diagnostic record: a handler pair where one side reads `sonosClockGetTime` into the response buffer — a timestamp/status page used by field-service diagnostics.

**Technical description:**

f_105eba60 → f_106ba5b0; sibling f_105eba6c reads sonosClockGetTime into buffer (timestamp page)

- **name:** fcs_detail
<details><summary>Evidence (1)</summary>

- firmware — handler disas

</details>

## `fd_event`

**coverage** `partial`

The fdevent epoll wrapper: named threads (signal.write, wait.poll, check.poll, reset.read) driving epoll_create1/ctl/wait with fd-capacity and 'already monitored' errors, plus EventSync naming. The async plumbing under sockets, pipes, and file watchers.

**Technical description:**

ops {fdevent.signal.write,fdevent.wait.poll,fdevent.check.poll,fdevent.reset.read,removeFd,waitForEvent}; EventSync %s; epoll {create1,ctl,wait} errors incl "unsupported flags","already monitored","exceeded the fd capacity of %d"

- **name:** fdevent epoll wrapper
<details><summary>Evidence (1)</summary>

- @ 0x10ef3fec — fdevent region

</details>

## `fdevent`

**coverage** `partial`

Same fdevent layer as fd_event: the epoll-based event engine everything else (addrmon, select thread, audio fds) multiplexes on. fd capacity is bounded and monitored-fd overflow is a hard error.

**Technical description:**

ops {removeFd,waitForEvent}; thread names fdevent.{signal.write,wait.poll,check.poll,reset.read}; EventSync %s; epoll_create1/epoll_ctl/epoll_wait error paths; fd capacity bound "%d already monitored"/"exceeded the fd capacity of %d"

- **name:** fdevent — epoll event engine
<details><summary>Evidence (1)</summary>

- @ 0x10ef3fec — fdevent block

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

## `feature_flags`

**coverage** `partial`

The feature-flag registry — the build-time map behind featureConfig: same flag vocabulary as the schema plus defaults. Runtime precedence is flag → featureConfig → config → default, so a cloud-pushed value beats the build default.

**Technical description:**

flags {enableSpotifySMAPIVolumeNormalization,zoneExperiments,metricsService,enableVoiceDataCollection,enableSvcHomeControlLutron,enableSvcPlus,enableAmazonMusicDASH,enableAppleMusicHlsv7,enableTuneInReplacement,enableTuneInMigration,semiSleepConfig,enableTrueplayDataCollection,dropoutContext,enableSystemAPIV2,enable3ChannelSatellites,enableHTSNKv2,disableTlsRsaCiphersuites,enableSPSDataCollection,enablePortableSurrounds,aiseMinThreshold,enableMaxDialogueLevel,enableRemoveMSPCredentialsFromUPnP,featureConfigSemiSleep,DropoutContext,HomeTheaterWifiPerfTelemetry,MetricsService,Plink,Quickbonding,SemiSleep,SmartPlay,SpotABR,SsdpAdvertiseConfig,ZoneExperiment,featureConfigZoneExperiment}

- **name:** featureConfig registry — build feature map
<details><summary>Evidence (1)</summary>

- @ 0x10f9bf94 — featureConfig block

</details>

## `fileio`

**coverage** `partial`

The fileDataMgr async I/O: stream registration, SMB readdir/open, an 'in memory' fast path, HTTP reopen-at-offset resume via `?after=`, and content-type sniffing (`application/xml`). It's the generic 'open a URI as a stream' layer under playlists, artwork, and library browsing.

**Technical description:**

async register/unregister + enabled; SMB readdir + "failed to open SMB dir"; "File is in memory" skip-open; "Success opening URI %s; stream type %d"; "Sonos API URI %s not dereferenced before opening stream"; prebuffering + "reopening http for streaming at %zu" + ?after= resume; "application/xml; listing" dir listing; "no framer found in factory, returning null, we should not reach here"

- **name:** fileDataMgr — async stream I/O
<details><summary>Evidence (1)</summary>

- @ 0x10ec182c — fileio block

</details>

## `fmp4_parser`

**coverage** `partial`

The fragmented-MP4 parser for segmented audio: validates box order (mfhd seq, tfhd before trun, tfdt), builds the trun table (seqnum, sample sizes/offsets/durations), and explicitly rejects senc sub-entry encryption it can't parse — 'Sub-entry encryption isn't supported' means the HLS Sample-AES path isn't this parser.

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

GroupRenderingControl: group volume and mute. It snapshots member volumes, computes a normalized group volume (`calculateVolume` with sg/ng/sv/nv terms), validates zone transitions, and propagates DesiredVolume/DesiredMute to members — including partial-failure handling when some members are on fixed output. The group volume slider rides on this.

**Technical description:**

group vol snapshot {"snapshot %s: %u (was %u)","snapshot sum for %u (of %u) zones"} + DesiredVolume/DesiredMute; algo "calculateVolume %s: sg:%.4f ng:%u sv:%u nv:%.4f" + gvd {t,c,f,m,cv,sv}; tracking {addZone already tracked,removeZone not tracked,transitionValid c/m/f}; faults {total failure,partial failure,all members use fixed volume,operation in progress,unexpected upnp fault}; events {GroupVolumeSetActionEvent(vol,mute,vligrouping),VliVolumeProcessingCompleteEvent vliType}; members {localRC vol/mute/fixed,remoteRC %s vol/mute/fixed}; ops {SetGroupMute local/remote rc,SetGroupVolume local netops zones + per-member rc}; group caps {"Group capability updated: 0x%08x -> 0x%08x","Spatial audio disabled in Area Zone","Spatial audio disabled: mask"} + enableSpatialAudio + "GroupCapabilities zp: %s: %i,%i,%i"; cap strings {widevine,atmos,portable,tv_in,hlsv7}

- **name:** grc_zpimpl — group rendering control
<details><summary>Evidence (1)</summary>

- @ 0x10ec3a58 — grc_zpimpl block

</details>

## `healthcheck`

**coverage** `partial`

The periodic health probe: a timer that schedules the next check (6-gate decision on whether to run), contacts `/ws/diag/diag_instructions.xml?hhid=` for server instructions, honors SubmitPermission, and records ServerDiagInstructions. The device literally asks the cloud 'what should I do for you today' on this schedule.

**Technical description:**

schedule "Next healthcheck scheduled to run in %u hour(s), %u minute(s), %u second(s)" + "Not scheduling: %d %d %d %d %d %d" 6-gate + "Healthcheck timer pop"/reschedule; fields {SubmitPermission,ServerDiagInstructions}; instructions fetched /ws/diag/diag_instructions.xml?hhid= ; errors {I/O+HTTP Result,Indeterminate length,Incomplete,parse fail,too large}

- **name:** healthcheck — periodic health probe
<details><summary>Evidence (1)</summary>

- @ 0x10ec4574 — healthcheck block

</details>

## `healthcheck_contact`

**coverage** `partial`

The healthcheck's server-contact half: instruction fetch, permission gating, and reschedule-on-response. The returned instructions can trigger diagnostics or other maintenance — it's a remote-control backdoor in the benign sense.

**Technical description:**

schedule "Next healthcheck scheduled to run in %u h %u m %u s" + "Not scheduling: %d %d %d %d %d %d" + "Healthcheck timer pop" + "Rescheduling next healthcheck"; server /ws/diag/diag_instructions.xml?hhid= + SubmitPermission + ServerDiagInstructions + "Contacting server for instructions"; errors {I/O Error + HTTP Result,Indeterminate length,Incomplete file,Failed to parse,too large}

- **name:** healthcheck — server instructions
<details><summary>Evidence (1)</summary>

- @ 0x10ec4574 — healthcheck block

</details>

## `hhsettings_rest`

**coverage** `partial`

The household-settings REST API inside the device: `public/{key}` is readable by anyone, `restricted/{key}` needs permissions, `restricted-admin/{key}` needs admin. Errors are specific — key-not-found, wrong size/type, store failure — so clients can distinguish 'doesn't exist' from 'can't write'. This is the low-level path beneath the muse settings namespaces.

**Technical description:**

path grammar {public/{key},restricted/{key},restricted-admin/{key}}; errors {Key not found.,Failed to delete setting.,invalid value size or type for setting key,HHSettingsMgr reported invalid setting value for key,Failed to store setting.,HHSettingsMgr failed to store settings,Deleting all settings in a category is not allowed. Provide a key.,Unsupported Request}; get path logs "key = %s not found in processGetRequest"

- **name:** household settings REST API
- **visibility:** "ALERT! Display of these settings on status page (/householdsettings.json) needs to be addressed before setting this category"; vars {householdsettings,userMetricsTracking,householdsettings.json,hhsettingsfile}; frozen:1 flag
<details><summary>Evidence (1)</summary>

- @ 0x10f063f8 — hhsettings region

</details>

## `history_mgr`

**coverage** `partial`

The cloud play-history manager: POSTs played tracks, keeps pre/post caches with ETags and cache-control honoring, serves `recentlyPlayed`, and repairs a corrupt cache after a 304. `max-age` controls freshness. This is the 'recently played' list that syncs across the household and app.

**Technical description:**

historyService + rphistory + historyEntryInvalid event + ucsType; cache {preCache,postCache,preEtag,postEtag,cacheControl,historyRequest} + "Updating history cache: \[status\]\[key\]\[etag\]\[cache-control\]" + "Cached etag" + "corrupt cache could not be served after a 304"; POST postHistory + recentlyPlayed + max-age + "max-age=%s, etag=%s, http-result=%d" + "Post History Buffer Cleared"; queue faults {bufferFull,invalidContentType,resourceIncomplete(name,type,objectId),groupIncomplete(name,id,coordinatorId)}; fields {imageUrl,explicit}; getHistory {serving the cache,#getHistory response} gated by {Securely Registered,History Enabled}; deleteHistory history?id=; "Failed to generate defaults for history entry"; "Failed to initialize history from cache"; cache edge: 'corrupt cache could not be served after a 304 Not Modified response from the cloud'

- **name:** historyMgr — cloud history
- **salt_literal:** Smb2sOM9daUv+IELUjC4q5gaxyNuvkstS9nLmjWQeLY
<details><summary>Evidence (1)</summary>

- @ 0x10ec4878 — history_mgr block

</details>

## `hls_audio`

**coverage** `partial`

The HLS audio player: seeks land on segment boundaries (or snap forward), it can force a source switch when a playlist mixes codec variants, tracks ADTS metadata seconds, and requires group capabilities for some variants. The player distinguishes hls-live from hls-static — the protocolInfo whitelist is how a URI picks this engine.

**Technical description:**

"requires group capabilities %u"; seek {to time %.3f (%lu:%02lu:%02lu),to time from start of current segment,pass segment,to segment start time range}; "forcing a source switch due to multiple codec variants in playlist"; ADTS metadata {metadata,no metadata bumping seconds advanced,cached seconds advanced mismatch}; EXT-X-KEY {METHOD= AES-128,/SAMPLE-AES,,KEYFORMAT=,URI=data,URI=""} + "encrypted but no key URI"/"encrypted but no data from key URI"/"No IV, using seq. num"/"SAMPLE-AES detected. Setting up audio framer decryption"/"Key extracted. method=%d"/"undefined encryption method"; track playback {bitrate %u stream %u segment %llu offset %zu,InitFramerForTrackList failed,m_dTimeOffset,Trim offset required,resetMetadata,track play time,seconds advanced,time offset of segment byte offset}; bitrate report "hls-%s said: %u (%g) %d %d"; types {hls-live,hls-static,hls-???}; master {fetching master,updated master URI}; playlist errors {EXT-X-TARGETDURATION not present,media seq went backwards,media len changed,Invalid media playlist,Seeking pass the end,empty track list,Error %x occurred}; stale {d d llu llu}; Segment Map entries

- **name:** hlsaudio + segaudio — HLS player
<details><summary>Evidence (1)</summary>

- @ 0x10ec4f88 — hls blocks

</details>

## `hls_player`

**coverage** `partial`

The HLS engine's stream semantics: variant tags (hls-live, hls-static), segment-aligned seeking, codec-variant failover, IV handling ('No IV, using seq. num'), and 'encrypted-but-no-key-URI' rejection. Sample-AES and ABR rendition filtering live here — it's a real HLS client, not just a playlist fetcher.

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

The `householdsettings.json` store: versioned JSON with per-category sections (public/restricted/restricted-admin), each carrying read/write permission strings and a settings list (explicitContentFiltering, recentlyPlayed, etc.). `lastUpdateDevice`/`version` fields drive replication conflict resolution.

**Technical description:**

file householdsettings.json {fileVersion,fileSchemaVersion,householdSettings}; JSON \[{version,lastUpdateDevice},\[{name:"restricted-admin",readPermission:null,writePermission:"hh-config-admin",settings:\[{explicitContentFiltering,recentlyPlayed}\]}\]\]; categories {restricted-admin,protected-admin,protected}; frozen:1 marker; "File upgraded to v%d schema"/"File overwritten due to invalid setting"; UMTracking→userMetricsTracking migration; "version incremented after invalid settings offered"; hhSwgenState swgen must be >= player; /householdsettings.json status-page ALERT

- **name:** householdsettings.json persistence
<details><summary>Evidence (1)</summary>

- @ 0x10ef43f0 — hhsettingsfile block

</details>

## `ht_audio_sources`

**coverage** `partial`

The TV-audio source type registry: tv-sat-as (satellite), tv-gm-dm-as (group-member downmix), tv-proc-as (TV processor), AIHomeTheater, and chsnk-sat-as — plus the ForceSubmitTvSessionReport op. These names appear in session reports and in the source-selection logic that decides which HT path feeds a zone.

**Technical description:**

source names {tv-sat-as,tv-gm-dm-as,tv-proc-as,AIHomeTheater,chsnk-sat-as}; ForceSubmitTvSessionReport op

- **name:** TV audio source types
<details><summary>Evidence (1)</summary>

- @ 0x10ea5f94 — ht source names

</details>

## `htaudio_chproc`

**coverage** `partial`

HT channel processing: stream types (htain, htaoutl/htaoutr/htaouts, remote, downmix), DRC state changes per dspZone (night mode, dialog enhancement, speech extraction), channel-map transitions, and SPDIF input with its own protocolInfo. This is where a stereo TV signal becomes surround across bonded speakers.

**Technical description:**

DRC "changedDRCStates: dspZone=%d, bNightMode=%d, dialogEnhancementLevel=%d, speechExtraction=%d"; streams {htain,htaoutl,htaoutr,htaouts,remote,downmix}; "tv channel map changed from %s to %s"; system/dsp_disable; app/debug/dsp/persistentEQ.xml; spdif-input + protocolInfo="spdif"; autoplay FSM {autoplay_tv,"auto stop %s silence threshold %ums","auto play %s silence threshold %ums","mode change %s -> %s","Silence threshold reached (%ums). Engaging auto stop.","Triggering autoplay. Ignore Silence Threshold (%d)","Transitioning to TV due to user interaction"}

- **name:** HT channel processing + autoplay FSM
<details><summary>Evidence (1)</summary>

- @ 0x10f273d8 — chproc block

</details>

## `htaudio_satellite_tx`

**coverage** `partial`

The satellite-transmission stats schema: time-to-play, bytes sent, tx errors, serialization errors, late frames, resync frames. On a surround setup, these counters explain lip-sync drift and dropouts between the soundbar and its satellites.

**Technical description:**

stats schema {timeToPlay/Time between send and play,txSent/Total bytes transmitted,txErrors/Total number of transmission errors,serializationErrors/Total number of serialization errors,numLateFrames/number of times we were late to transmit a frame,Total resynchronization frames,playbackEnd/Total playback ended frames,mx_proc/Highest SatMixer processing time,tx_proc/Highest SatTx processing time}; "HT Audio Satellite TX General"

- **name:** HT audio satellite TX stats
- **control_frames:** htsat_tx control frame = 16 bytes {u8 code, payload/pad 15B}; header region ctx+0x9b4-0x9bb = {zeros x7, type=0x36}; 'invalid control frame. len (%u) vs (%zu)' is the TX-side length check (f_104f0d6c region).
<details><summary>Evidence (1)</summary>

- @ 0x10ee5c90 — ht tx stats

</details>

## `http_client`

**coverage** `partial`

The async HTTP client (curl multi + thread pool): `performAsync` schedules requests, reports curl errors verbatim, enforces timeouts, and counts tasks. 'No active thread pool' means the request was dropped before it started — a symptom of shutdown-in-progress.

**Technical description:**

sonos::http::performAsync; errors {"not scheduled. No active thread pool available. Cancelling.","Client not setup","HTTP request attempted with empty URL","Curl error (%d): %s","Request timed out in %lld ms","curl_multi_perform/poll/info_read"}; perf counters {taskCount=tasks actively processed,mainLoopIteration=main loop time}; asio categories {generic,std:unknown,asio.netdb,asio.addrinfo,asio.misc}; netdb errors {Service not found,Socket type not supported,Host not found (authoritative)/(non-authoritative),"query valid but no data","non-recoverable database lookup"}; misc {Already open,End of file,Element not found,"descriptor does not fit into select fd_set"}; io_service {epoll re-registration,Invalid service owner,Service already exists,sonosAsyncThreadPoolCond,sonosAsyncWorkGuard}

- **name:** async HTTP client (curl multi + asio)
<details><summary>Evidence (1)</summary>

- @ 0x10f92844 — http client

</details>

## `httpcache`

**coverage** `partial`

The HTTP cache manager: hash-based invalidation (local+remote hashes compared, remote caches invalidated over the LAN), `/jffs` mount checking via statvfs/`/proc/mounts`, and per-key get/set statuses. This is why artwork and metadata stay consistent across players — invalidation propagates.

**Technical description:**

hash-based invalidation {cacheHashes,"\[%s\] Cache not found. Cannot invalidate.","\[%s\] Invalidated local cache","\[%s\] hashLocal = %s","\[%s\] hashRemote = %s","\[%s\] Invalidating remote caches"} — propagates invalidation to remote players; /jffs mount check via statvfs + /proc/mounts; null hash 12 zeros

- **name:** HTTP cache manager
<details><summary>Evidence (1)</summary>

- @ 0x10ef4dac — httpcache block

</details>

## `hw_events`

**coverage** `partial`

The hardware-event handler: netlink multicast messages for buttons, orientation, and thermal events on the select thread, with overflow/unknown/readNextMsg error handling and a button-forwarding mode that ships presses to a private-IP target (used for bonded/home-theater remotes).

**Technical description:**

hwmessagelib + NetLink multicastGrp + repeat interval; events selthrd.RHWEvtHandlerZP.{reset,data,except,timeout}; readEvent {overflow,unknown,readNextMsg ERROR}; button forwarding {'Forwarding button events','Disabling button event forwarding'} to private-IP-only target {Unable to translate address,Host not private IP,Invalid host IP,Invalid port no,socket errors}; FSM states {NOT_IN_HOUSEHOLD,PROCESSING_PLAYBACK,IN_DEMO_MODE,IN_RDM_MODE,IN_BUTTON_OBSERVATION_MODE,IN_TRANSFER_MODE,PROCESSING_JOIN,JOIN_CHIME_UNAVAILABLE,REGISTRATION_CHIME_UNAVAILABLE,BUTTONS_LOCKED,DAT_IN_BUTTONLESS_SETUP_MODE,DAT_IN_SETUP_DISCOVERY}; setup combo {VOL_DN|VOL_UP starts timer → setup-ready on pop, VOL_UP+VOL_DN timer popped}; '%s press/release count = %zu'; '%s ignored in notify mode'; 'Disallowed action (%d - %s) because (%d - %s)'; 'inline action'; allowPlaybackRequests; 'collecting triggered diags'; 'enter %s household mode'; 'cancel join household mode'; PLAYPAUSE; '%s button pressed (cid)'; 'Play button held'; orientation {old->new,orientation_change,syslib orient}; led_diags {'Diag mode:%u, leftMS:%u; timeMS:%u; next mode: %u','set diag mode:%d'}; setup {'join hh','enabling wifi and %s','signaling netstartd (%s) %s',openap}

- **name:** hwevt_handler — button/orientation/thermal
- **status_schema:** <HW Name="CurrentStatus"><Orientation/></HW> + <HWMembers Name="Members"><State/><Flags/><MicFlags/></HWMembers>
- **version:** 7.31.0-test
<details><summary>Evidence (1)</summary>

- @ 0x10ec6db8 — hwevt block

</details>

## `ibt`

**coverage** `partial`

Intended-target fan-out: a single muse command can name `intendedTargets` — a set of players — and the planner expands it into per-target executions, validating that the command supports fan-out and each target parses. This is how the app sends one 'set volume' to a whole room instead of issuing per-player calls.

**Technical description:**

plan {"already generated ibt plan, no action taken","executing ibt plan for command (%s)","failed to generate target list","failed to generate ibt plan"}; intendedTargets param {"implicit target parsed \[%s\]","explicit target parsed \[%s\]","invalid intendedTargets parameter","command does not support intendedTargets parameter","invalid muse command body format"}; dispatch "\[dispatch\] unsupported IBT command (%s)"; JWT {"Unable to parse JWT token","Unable to load root bundle","Can't get client device certs","JWT cert validation finished: %s"}; ibt log domain; enablePitchfork flag

- **name:** IBT — intended-target command fan-out
- **target_param_check:** intendedTargets support is decided by a per-command declared-param match, not a static whitelist table: f_10a1cc00 builds {name,namelen} ranges from the command's registered param list and a memcmp chain (f_10a1dbxx region) tests for 'intendedTargets'. No route spec declares it -- it is a transport-ctx parameter (ctx {householdId,intendedTargets,explicitTargets,muse-async-cmd-id,upnpAnacapaPort}); commands opt in by declaring it in their param list at registration. The exact opt-in command set is therefore data-driven from the runtime command registry -- static ceiling for the whitelist.
<details><summary>Evidence (1)</summary>

- @ 0x10fac620 — ibt block

</details>

## `inprocess_events`

**coverage** `partial`

The in-process observer registry: named observers register per subject (PlaybackEvent and friends), the engine logs each registration with a running count, and flags like `enableSemiSleep`/`enableHTSourceSleep` mark power-sensitive listeners. This is the pub-sub fabric under muse events for handlers inside the same process.

**Technical description:**

subject.h; Registering/Unregistering "%s" observer "%s". Total observers: %zu; observer-name fmt %s-%s (ie-obs); PlaybackEvent; flags {enableSemiSleep,enableHTSourceSleep}; TTM {secondary,useCase,attempts,"We timed out on %zu devices after %u attempts",msTTM,msDRP}; fmts {%d:%d.%06d,%d:%d.%6d}; errors {I/O Error: 0x%x. HTTP Result: %d uri: %s,recurse,redir,unsupported}; ie-schd,ie-cache

- **name:** inprocess-events observer registry
<details><summary>Evidence (1)</summary>

- @ 0x10e86c88 — inprocess-events

</details>

## `interrupt_reasons`

**coverage** `partial`

The playback-interrupt reason enum: CLOUD, HT_PLAYBACK, HT_POWER_STATE, AIRPLAY, AUDIO_CLIP, SPEAKER_DETECTION, FIXED_VOLUME, ROOM_DETECTION, IR_CONTROL, ALEXA_CBL — the 'why did my music duck/stop' taxonomy. CEC error codes (CHARGER_NOT_COMPATIBLE, NO_LOGICAL_ADDRESS, CONFIGURING) tag HDMI failures.

**Technical description:**

{CLOUD,HT_PLAYBACK,HT_POWER_STATE,AIRPLAY,AUDIO_CLIP,SPEAKER_DETECTION,FIXED_VOLUME,ROOM_DETECTION,IR_CONTROL,ALEXA_CBL}; CEC errors {CHARGER_NOT_COMPATIBLE,CONFIGURING,NO_LOGICAL_ADDRESS}

- **name:** playback interrupt/source enum
<details><summary>Evidence (1)</summary>

- @ 0x10facb9c — interrupt enum

</details>

## `iocompress`

**coverage** `partial`

The zlib buffer wrapper: RCompressBuffer/RDecompressBuffer around deflateInit2/inflateInit2 with per-stage failure logging. Used for saved queues (.rsq), replication payloads, and any gzip-accepted endpoint.

**Technical description:**

RCompressBuffer {deflateInit2,deflate,deflateEnd failed} + RDecompressBuffer {inflateInit2,inflate,inflateEnd failed}

- **name:** iocompress — zlib buffers
<details><summary>Evidence (1)</summary>

- @ 0x10ec7c08 — iocompress block

</details>

## `ir_learn`

**coverage** `partial`

The IR learning flow: multi-pass capture (passes 1 and 3 must match in size and bits), repeat-style detection (alternating, repeating, non-repeating), and one-button learn with tolerance. Learned codes that don't fit the cloud IR database (`ir.ws.sonos.com/IRCode/`) format are rejected.

**Technical description:**

htaudio.cxx IR subsystem: code lists vol_up_codes/vol_down_codes/vol_mute_codes/input_codes (bounded); learn FSM passes{1,3} redundancy checks "first and third passes have different sizes"/"don't match"; repeat styles {alternating,repeating,non-repeating}; one-button learn with timeout (UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND); config /opt/ir/irconfig.txt; cloud database http://ir.ws.sonos.com/IRCode/ — submit <IRCode><code><value><guid> XML (guid from //dev//urandom), query "Requesting: %s" -> "Code found for remote id \[%s\]"; embedded remote-name table {Sharp,LG/Haier L32D1120,Samsung,Panasonic,Toshiba,Mitsubishi,Philips,Pioneer,Dynex,RCA 46LA45RQ,Orion SLED3280,Mitsubishi WD-65638/60738,JVC JLC42BC3000/LT-19E610,Seiki LC-32B56,SuperSonic SC-240/491,ViewSonic VT4210LED/VT3205LED,Loewe}; "Denylisted pyle!"; "Outstanding codes yet to be learned: Lengths are: %d, %d, %d"

- **name:** IR learn + cloud IR database
<details><summary>Evidence (1)</summary>

- @ 0x10ea6550 — htaudio.cxx IR block

</details>

## `json_parser`

**coverage** `partial`

The embedded JSON parser's error enum: Exceeded max depth, Invalid unicode escape/escape/string character/numeric character, Unexpected token, Sequence too long, Missing required value, Invalid value, Out Of Memory. These are the failure modes any settings/manifest/JSON endpoint can hit.

**Technical description:**

error enum {Exceeded max depth,Invalid unicode escape,Invalid escape,Invalid string character,Invalid numeric character,Unexpected token,Sequence too long,Missing required value,Invalid value,Out Of Memory,Unexpected error}

- **name:** embedded JSON parser error enum
<details><summary>Evidence (1)</summary>

- @ 0x10f05a74 — json error enum

</details>

## `json_schema_validator`

**coverage** `partial`

The JSON Schema validator used by local settings: keywords patternProperties, maxLength/minLength, maxItems/minItems, maxProperties/minProperties, required, additionalProperties, uniqueItems, dependencies, exclusiveMinimum/Maximum, instanceRef, fileFormatVersion, targetType. Every settings write is checked against the schema before persistence.

**Technical description:**

keywords {patternProperties,maxLength,minLength,maxItems,minItems,dependencies,maxProperties,minProperties,required,additionalProperties,uniqueItems,instanceRef,expected,duplicates,disallowed,exclusiveMaximum,exclusiveMinimum,additionalItems,properties,fileFormatVersion,targetTypes,readPerm,writePerm}; "\[Vf\] ValidationFailureMsg\[%s\] %s"; schemaValidator; groups {playerUI,playerBasic}

- **name:** JSON Schema validator
<details><summary>Evidence (1)</summary>

- @ 0x10fb0ca0 — schema validator

</details>

## `lechmere_wss`

**coverage** `partial`

The persistent secure-websocket channel between player and cloud ('lechmere'): RFC6455 framing carrying an inner TLV command vocabulary — this is how the cloud pushes control and the player reports state in real time. Framing is confirmed; the per-namespace command payloads aren't decoded yet. Its inner message format is now known too: every frame opens with six ASCII characters — two for the protocol version, two for the message type, two for the extended-header length — followed by the extended header and payload. Message types are two-letter codes (AA through AK) that select a registered handler, and UPnP traffic is tunneled inside via x-sonos-method, x-sonos-uri and SOAPACTION headers.

**Technical description:**

lechmere.cxx cloud channel: RFC6455 WSS to lechmere.<env>.ws.sonos.com, negotiated subprotocol 'lechmere.<version>' (lechmere-v1 observed), inner TLV header layer ('failed to read lechmere header'), policy-key auth, app-level ping keepalive with 'TOO_MANY_UNACKED_PINGS' disconnect, and a full close-reason taxonomy driving reconnect decisions INNER FRAME FORMAT RECOVERED: 6-byte ASCII header {protocolVersion:2 chars, messageType:2 chars, extendedHeaderLength:2 chars} followed by extended header + payload (min frame len 6, checked cmpli 6 at f_105d539c). Parse errors 'Bad protocol version: %c%c', 'Bad message type: %c%c; %d', 'Bad extended header length: %c%c', 'could not recv extended header; expected %u read %u'. Message type validated via table lookup (f_11098e98 plt veneer); 2-char code registry AA..AK (.data 0x110941a4, 11 ptrs) dispatched via handler table built at f_10ac47fc region. Tunneled UPnP headers inside: 'x-sonos-method:', 'x-sonos-uri:', 'SOAPACTION:', 'X-Sonos-Udn'. Version str 'lechmere.%hhu%n'. AA..AK REGISTRATION DECODED: two consumers of the type table at 0x110941a4 found - f_10bd59xx walks entries 0..10 building records per code (2 lbz reads of each char, two calls to f_1082dfc0, entropy from mftb-based f_10809f0c, 0x100-byte alloc via plt 0x11098418); f_10bd65xx is a second walker (lwzu r28,\[r22+4\] over the table, counter 0..10) that strlen-checks each code (cmpli 0xf) and inserts it via f_10806d50 seeded with magic 0xc70f6907 (hash-table insert keyed on the 2-char code) building a per-code context record {+0,+4,+8,+c,+1c fields}. The codes are therefore a FIXED set of channel/stream identifiers registered into a keyed dispatch structure - they are not individually special-cased anywhere in code, so per-code semantics are data-driven (opaque map keys), which is the static-analysis ceiling for AA-AK message-type meaning. .got2 0x1108de34 points at the adjacent namespace/verb registry (0x110941d4). TWO-LETTER-CODE LAYER RESOLVED: the same keyed-map machinery used for AA..AK registration (f_10806d50 insert, seed 0xc70f6907) is consumed by f_1082dfc0 lookups in \[Mm\] ingestMigrationDataIntoBitFieldAry (0x10bd65xx-0x10bd6axx): migration/patch data is parsed as two-character tokens, each token hash-mapped to a field-id (<0xa, cmplwi 0xa) which sets bit 1<<fieldId in a bitfield array at ctx+0x98. So the two-letter-code alphabet is a shared field/channel registry: message-type codes (AA..AK) and migration field codes live in the same class of keyed dispatch structure. REGISTRATION LOOP FULLY DECODED (0x10bd65a4): the walker counter is bound at 0xa - only TEN codes (AA..AJ) are registered, each into a 0x24-byte record {code-str, len, loop-index at +0x1c} hash-inserted via f_10806d50/seed 0xc70f6907 then map-inserted via f_10bd6ec4; failures unwind through f_10807034 deletes. AA..AJ are the ten location-settings MIGRATION FIELD ids (bit positions 0-9 in ctx+0x98 bitfield); AK, the 11th table entry, is not a migration field - it belongs to a different channel role. Component tags recovered in the adjacent code: \[Mg\] settings manager, \[Mm\] locSetMigMgr migration manager (migrationmanager.cxx, keys __migration_data, __location_summation, _settings.json), \[Pc\] patch-completion ingest (\[Pc\] completePatchAttributeIngest() type mismatch \[%s|%s|%u\] vT\[%d\] aT\[%d\]), \[Rq\] request authz (isAuthorizedForNamespace, subvert-read/write guards), \[Gp\] group settings, \[Vf\] ValidationFailureMsg. NOTE: the 'uuuuubtnufr' table at 0x10e88fd4 is NOT a type map - it is a JSON escape table (control bytes -> \u or named \b\t\n\f\r) used by the attribute JSON emitter at 0x10a01xxx.

- binary anchors: `websocket_lechmere`, `lechmere.event`, `wspmd`, `SONOS_FCS_DISABLE_PER_MSG_DEFLATE`, `SONOS_CLIENT_TOO_MANY_UNACKED_PINGS`, `SONOS_SERVER_LECHMERE_RECONNECT_LATER`, `SONOS_CLIENT_DATA_COLLECTION_OPTED_OUT`

- **endpoint:** lechmere.%s.ws.sonos.com — %s is the region/env token; Sec-WebSocket-Protocol: lechmere.%u
- **auth:** authzPolicyKeyLechmere; 'Could not parse role from lechmere policy key' — role encoded in key
- **local_ws:** websocketserver.cxx serves /api/v1/websocket and /websocket/api with RFC6455 headers; opcode logs websocket(data/ping/pong/close/cont); disableWebSocketPerMessageDeflate config key
- **framing:** RFC6455 with per-message-deflate negotiation: 'wspmd' log domain, deflate/inflate stream ops, 'expected empty deflate block', 'deflate out buffer requirement not met'; config keys SONOS_FCS_DISABLE/ENABLE_PER_MSG_DEFLATE toggle it at runtime — 'FCS' is the internal name of this channel
- **close_reasons:** standard codes GOING_AWAY/PROTOCOL_ERROR/BAD_DATA/NOT_CONSISTENT/VIOLATED_POLICY/MESSAGE_TOO_BIG/SERVICE_RESTART/TRY_AGAIN_LATER/TLS_HANDSHAKE plus SONOS_* extensions: client-side (REGISTRATION_CERT_REMOVED/CHANGED, DATA_COLLECTION_OPTED_OUT — telemetry opt-out tears down the channel, ACCESS_TOKEN_EXPIRED, TOO_MANY_UNACKED_PINGS, READ/WRITE_ERROR, CUSTOMER_ID_CHANGED, AUTH_METHOD_CHANGED); player-side (SHUTDOWN, IP_ADDRESS_CHANGED, BLUETOOTH, POWERED_OFF, UPGRADE, NEW_SSID, LOW_BATTERY, SLEEPING, RECONNECT); server-side (LECHMERE_RECONNECT_LATER — server steering, PLAYER_UNSUPPORTED)
- **keepalive:** application-level ping/pong: client disconnects on SONOS_CLIENT_TOO_MANY_UNACKED_PINGS
- **frame_format:**
  - **header:** 6B ASCII: pv(2) type(2) extlen(2)
  - **msg_types:** 2-char codes, registry AA..AK @.data 0x110941a4
  - **tunneled_headers:** `x-sonos-method:`, `x-sonos-uri:`, `SOAPACTION:`, `X-Sonos-Udn`
  - **parser:** f_105d539c
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
- **aa_ak_field_ids:**
  - **map:** 2-char code -> migration field-id (bit position) via hash lookup f_1082dfc0
  - **AA:** bit0
  - **AB:** bit1
  - **AC:** bit2
  - **AD:** bit3
  - **AE:** bit4
  - **AF:** bit5
  - **AG:** bit6
  - **AH:** bit7
  - **AI:** bit8
  - **AJ:** bit9
  - **AK:** not registered by the migration walker (counter bound 0xa) - separate channel role
  - **record:** 0x24 bytes {strbuf ptr, len, data ptr +0xc, index +0x1c} built per code at f_10bd65e0-0x10bd6630
- **payload_parser:** f_105d4ff4 — pseudo-HTTP request parse on the frame payload: line-scan via memchr('\n'), strips the '\r' line-ending, then strncasecmp header names {x-sonos-method: (0x10), x-sonos-uri: (0xd), content-length: (0x10), SOAPACTION: (0xc), X-Sonos-Udn} — i.e. the lechmere frame body is a tunneled minimal HTTP request carrying UPnP/SOAP control to the cloud. The 2-char frame messageType IS the AA..AK code set; 'Bad message type: %c%c; %d' fires when the code is not in the registered table. AA..AJ are also reused as the ten location-settings migration field-ids (the same keyed map); AK is registered in the type table but excluded from the migration walker — a non-migration lechmere message type.
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

## `led_hw`

**coverage** `partial`

The LED hardware feature map: bHasMicrophone, bHasMuteLED, bHasStatusLED, bHasOnlyStatusLED, bHasHardwareLedSwap, bCanSetWhiteBrightness — per-model booleans that determine which LED behaviors even exist. This is why the mute LED is separate from the status LED on some products.

**Technical description:**

setHwFeatures {bHasMicrophone,bHasMuteLED,bHasStatusLED,bHasOnlyStatusLED,bHasHardwareLedSwap,bCanSetWhiteBrightness}; leds_zp; "After ~RLEDsZP"

- **name:** HW LED feature flags
<details><summary>Evidence (1)</summary>

- @ 0x10fba544 — led hw block

</details>

## `load_content`

**coverage** `partial`

The muse `loadContent` verb family: `loadContainer`, `loadStream`, `loadFavorite`, `loadPlaylist`, `loadTrackList` — with a type whitelist (spotify.connect items, linein variants, trackList programs, podcast episodes, audiobook chapters, homeTheater-input). Guidance strings steer callers to the right verb. This is the cloud-API entry point for 'play this thing'.

**Technical description:**

verbs {loadContainer,loadStream,loadFavorite,loadPlaylist,loadTrackList} with guidance "Use playback#loadTrackList to load tracks"/"Use playback#loadStream to load streams"; item types {spotify.connect,linein.homeTheater.spdif,linein.airplay,trackList.program,episode.podcast,chapter.audiobook,homeTheater-input,TV Audio}; meta json paths {/containerType,/containerName,/name,/explicit,/durationMs,/artist,/imageUrl,/releaseDate,/mimetype}; errors {Invalid favorites directory state,Invalid content resolver state,Account error,Invalid serviceId,Could not find default account for serviceId,SID mismatch lookupAccountByUDN vs RMuseUniversalMusicObjectId,Could not find UDN,serviceId is not associated with accountId}; "cannot enqueue item; %s queue is full (%zu items added, %zu items enqueued)" + "item.id tracking is out of memory"; local-library + r:contentService + /getaa? art; sn_%u/mhhid_ id prefixes; "RadioShow name/Id truncated"; shared|private visibility; protocolInfo http-get:*:%s:*

- **name:** favorites + loadContent resolution
<details><summary>Evidence (1)</summary>

- @ 0x10ecf310 — favorites/loadContent block

</details>

## `local_routes_2`

**coverage** `partial`

A second cluster of local routes bound via a path-matcher rather than the master pointer table: `/createGroup`, `/unjoin`, `/activate`, `/deactivate`, `/duck`, `/unduck`, `/definition`, `/missingDefinition`, `/activeZone`, `/memberSettings`. These are group/zone and ducking operations — recorded here because they don't appear in the primary route table.

**Technical description:**

paths {/createGroup,/unjoin,/activate,/deactivate,/duck,/unduck,/definition,/missingDefinition,/activeZone,/memberSettings} — cluster shares a path-matcher (no pointer table; PIC-formed literals)

- **name:** zone/group route paths + duck
<details><summary>Evidence (1)</summary>

- @ 0x10fba3b4 — route path cluster

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

## `log_domains`

**coverage** `partial`

The anacapa log-domain map: per-subsystem files under `/opt/log/anacapa.*.log` (alarm.job, avt.play, chsrc.state, ext.audio.action, gm.events, hdmi, lechmere.event, musecmdandrsp, spotify, tv, vl...), the main anacapa.log, and `/opt/conf/anacapa_logger.toml` categories. The domain name in a log line maps to exactly one of these.

**Technical description:**

files /opt/log/anacapa.{alarm.job,avt.play,chsrc.state,dc,ext.audio.action,gm.events,ht,hdmi,hw.events,lechmere.event,musecmdandrsp,musedebug,museevt,rc.upnp,snf,spotify,spotify.debug,sps,trueplay,tv,vl}.log + anacapa.log + /jffs/app/log/anacapa.log.backup; conf {/opt/conf/anacapa.conf,/jffs/conf/anacapa.conf}; "Capped MaxConn value %d to %d. Edit anacapa.h to increase cap."; ZPSTR_BUFFERING state; R_TrialZPSerial key

- **name:** anacapa log-domain map
<details><summary>Evidence (1)</summary>

- @ 0x10e7543d — log domains

</details>

## `longpress`

**coverage** `partial`

The long-press button behavior — group-coordinator clone cycling: a GC list (head/tail/current) of cloneable coordinators, 'cycling to %s:%s', with tracked add/remove/promotion and 'last PAUSED/STOPPED GC is no longer cloneable' detection. This is what makes holding the play button clone another room's queue.

**Technical description:**

GC list {head,tail,current} of cloneable group coordinators; "cycling to %s:%s"/"end of list reached"; tracked GC actions {Adding new GC,Moving GC to head,Removing GC,"Updating last PAUSED/STOPPED GC","Last GC in HH to change playback state is no longer cloneable",Untracked GC action}; "not joinable"

- **name:** longpress — GC-clone cycling
- **setup_ready_combo:** VOL_UP+VOL_DN combo: each press starts a timer ('VOL_UP starts timer, when pops, switch to setup-ready mode' / 'VOL_DN starts timer...'); holding both pops the timer and the device switches to setup-ready mode ('VOL_UP + VOL_DN timer popped, switching to setup-ready mode' and inverse order) — the physical-button path into setup/join flow. Button presses can also tear down grouping: 'Becoming standalone due to button press'.
<details><summary>Evidence (1)</summary>

- @ 0x10ec9b7c — longpress block

</details>

## `mdns_controller`

**coverage** `partial`

The mDNS service controller: register-once guards, TXTRecord populate/update/remove with duplicate suppression, and player-discovery startup. Errors like 'attempted to register twice' are lifecycle guards — a second register means a state bug, not a second service.

**Technical description:**

Service lifecycle: register-once guard ("Attempted to register ... twice"), TXTRecord populate, value update/remove with dup guards ("ignoring duplicate value","ignoring removal of non-existant value"), unregister; player discovery "Unable to start mDNS player discovery; error %i" + QueryRecord; local. domain; "\[%s\] vs \[%s\]" compare

- **name:** mDNS service controller
<details><summary>Evidence (1)</summary>

- @ 0x10f0671c — mdnscontroller region

</details>

## `mdns_discovery`

**coverage** `partial`

The mDNS discovery half: TXT key enumeration errors, bye-bye reason updates, an 'older version or missing keys' compat check, household filtering ('not in our household: discovered vs ours'), and topology notification with the remote bootseq. This is how a stale or foreign device gets ignored.

**Technical description:**

'Error enumerating key %zu in TXT record: %i'; 'QRCB: Update bye-bye reason to %s'; compat "Sonos mDNS TXT record for '%s' is older version or missing keys"; household filter '%s is not in our household: discovered:%s - ours: %s'; notify 'Notify topology of %s at %s; bootseq=%u; ports={%u-%u}; mdnssequence={old %u new %u}'; stub://stub:%u URI; {'Restart mdns discovery','mdns Browse callback error %i','%s is local; ignoring','Unknown player %s went bye-bye','Discovered new player %s'}

- **name:** mDNS discovery
<details><summary>Evidence (1)</summary>

- @ 0x10f06a34 — mdns discovery

</details>

## `media_player_abstraction`

**coverage** `partial`

Beneath AVTransport sits a plug-in layer of source implementations (media_player_mgr, autoplay, vli_ctrl, extaudiosrc, ai_impl_base) — each stream type (line-in, TV, Spotify, airplay...) plugs in through the same vtable. The action handlers you're using dispatch into this.

**Technical description:**

source plug-in layer under AVTransport: media_player_mgr + media_player_autoplay + media_player_vli_ctrl + extaudiosrc + ai_impl_base define the source vtable; autoplay system (StartAutoplay, AutoplayRoomUUID, AutoplayVolume, linked-zones expansion, silence thresholds, alarm/buzzer fallback) routes line-in/TV/Spotify-VLI sources to the coordinator; htaudio_autoplay.cxx handles TV autoplay; ChirpExtAudioSrc plugs acoustic input in as an ext source; media_player_mgr runs under 'mediaplayermanager' domain; VLI session control guarded by scopeVliCtrl lock; third linein source class object.item.audioItem.linein.bluetooth present

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

The media-player actor registry: each player is an actor keyed by uuid/index/port/ssl/mtls with overlap detection, lifecycle (register/create/shutdown), and per-player config dirs with their own `anacapa_logger.toml`. Targets resolve through `getActor` with backup fallback. It's the internal object model that muse player-scoped commands dispatch into.

**Technical description:**

actor model: target key {uuid,ix,port,ssl,mtls} (overlap check); "found actor for %s"/"found backup for %s"/"%s target \[%s\] for type %d resolved to %s"/"no actor available"; lifecycle register/create/shutdown; per-player config dir + anacapa_logger.toml; /localsettings.txt; Player%s naming

- **name:** mpmgr — MediaPlayer actor registry
<details><summary>Evidence (1)</summary>

- @ 0x10ecb874 — media_player_mgr.cxx

</details>

## `memmon`

**coverage** `partial`

The memory monitor: reads `/proc/meminfo` (MemAvailable, MemFree) plus per-process statm/cmdline, writes rotating logs to `/tmp/memorylog/log.N`, and emits 'memory report avail/free' records with a skip counter. Low-memory pressure reports are how OOM-adjacent bugs get diagnosed.

**Technical description:**

reads /proc/meminfo {MemAvailable:,MemFree:} + /proc/%s/{statm,cmdline}; writes /tmp/memorylog/log.%d (+.old rotation); vars {memlog,memavailable,memfree,memory_status,memmon}; "memory report avail=%s free=%s"; "report skipped %s (count: %u)"

- **name:** memory monitor
<details><summary>Evidence (1)</summary>

- @ 0x10f06588 — memmon region

</details>

## `memory_monitor`

**coverage** `partial`

Same memmon layer (see memmon): the threads memlog/memmon/memory_status drive the sampling and rotation. Reports include the skip count so missed samples are visible rather than silent.

**Technical description:**

reads /proc/meminfo {MemAvailable,MemFree} + /proc/%s/{statm,cmdline}; logs to /tmp/memorylog/log.%d with .old rotation; "memory report avail=%s free=%s"; "report skipped %s (count: %u)"; fields {memavailable,memfree}; threads memlog/memmon/memory_status

- **name:** memmon — memory tracking
<details><summary>Evidence (1)</summary>

- @ 0x10f06588 — memmon block

</details>

## `mntmgr`

**coverage** `partial`

The SMB mount manager: mounts live under `/tmp/smb/{uid}_{id}`, trial mounts under `/tmp/smb/tmp*` probe dialect support ('unsupported protocol: strike N/M', 'flagging failed'), dedup by unc/share, enforce a max-share count, and unmount idle shares. This is the filesystem layer behind library shares.

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
- **model_tables:** Three model-name tables recovered (rodata 0x10f7c300-0x10f7c620): (1) display-name ptr table, 48 entries indexed by model ordinal: 0 Bridge,1 Play:5,2 Dock,3 Play:3,4 Sub,5 Play:1,6 Playbar,7 Boost,8 Play:5,9 Playbase,10 Play:1,11 One,12 Beam,13 Connect,14 Amp,15 Move,16 One,17 Arc,18 Table lamp,19 Bookshelf,20 One SL,21 Port,22 Five,23 Sub,24 Roam,25 TITAN,26 Picture frame,27 Table lamp,28 Bookshelf,29 Arc SL,30 Roam SL,31 Ray,32 Beam,33 Beam SL,34 Sub Mini,35 One SL,36 Era 100,37 Optimo1 SL,38 Era 300,39 Floor lamp,40 One SL,41 Move 2,42 Arc Ultra,43 Era 100 Pro,44 Ace,45 Jaws,46 Pallas Plus -- including names for then-unreleased products (Arc Ultra, Era 100 Pro, Ace/earbuds, Jaws, Pallas Plus, TITAN, Ryles30/Gambit/Roundhouse/Disco codenames in the code table). (2) parallel model-code table (CR100,ZP80,ZP100,ZP120,BR100,ZPS5,WD100,ZPS3,ANVIL,ZPS1,BR200,ZPS6,ZPS11-14...,Sub 4,Ryles30,Gambit,Roundhouse,Disco). (3) device-identity record at 0x10f7c4e8: {code:'S9', zpsId:'ZPS9', display:'Playbar', fields {0xa,0x8000,0x30206772,0x37008,...}, ordinal=6} -- S9=ZPS9=Playbar confirmed as this build's target; ordinal 6 selects 'Playbar' in table 1. Separate dspconfigparam codename table at 0x10f24808 (Default,Playbar,Sol,ElRey,Bravo,Hideout,Pallas,Apollo,Lasso,Play1,TitanWOW-{T,P,G},Monaco,Play3,Encore,Alpine,Pinewood,Prima,Mojave,Fury,Optimo2,Optimo1) -- DSP-config model names, 'ConfigParam lookup from player model %d failed' consumer; 'SYMFONISK' brand literal at 0x10f7c518.
<details><summary>Evidence (3)</summary>

- @ 0x10f249a4 — ZPS9
- @ 0x10e741dd — HwFeatures
- @ 0x10f2490c — ZPSnn identifier table (two rodata runs)

</details>

## `model_table`

**coverage** `partial`

The ZPS model-compatibility table: every model id this build recognizes (ZPS1–ZPS55, ZP120, ANVIL) — the local unit being ZPS9 (Playbar). Use this to map a firmware build to the products it can run on; unknown ids mean 'not a supported model' at validation time.

**Technical description:**

models recognized by this build: {ZPS1,ZPS3,ZPS6,ZPS9(this unit),ZPS11,ZPS12,ZPS13,ZPS14,ZPS15,ZPS16,ZPS17,ZPS18,ZPS19,ZPS20,ZPS21,ZPS22,ZPS23,ZPS24,ZPS26,ZPS27,ZPS31,ZPS35,ZPS37,ZPS38,ZPS43,ZPS54,ZPS55,ZP120,ANVIL}

- **name:** ZPS model-compatibility table
<details><summary>Evidence (1)</summary>

- @ 0x10f2490c — model table

</details>

## `mp3_decoder`

**coverage** `partial`

The MP3 stream decoder: xing/VBR header handling ('No size in xing header', VBR duration math), frame resync bounded at 20 attempts ('corrupt file'), frame errors (illegal sample rate, header/sync/data overflow), and LAME/ID3 normalization. 'WMA radio not supported on this platform' is a deliberate exclusion.

**Technical description:**

normalization {id3,lame}; "WMA radio not supported on this platform"; resync bound "20 resync required: corrupt file"; frame errors {illegal sample rate,read frame header/sync/data overflow/data failed}; xing {"No size in xing header","xing we can't load",VBR dur "%zukb/%ukbps = %llds",CBR dur,"Assume that VBR file without a ToC has constant bitrate of %d"}; ID3v2 skip; "Found valid header after searching %zu bytes"; seekSeconds duration bound

- **name:** mp3 stream decoder (xing/VBR)
<details><summary>Evidence (1)</summary>

- @ 0x10ece800 — mp3 block

</details>

## `mp_autoplay`

**coverage** `partial`

The media-player autoplay logic for virtual line-in sources: vol/useVol/includeZones params, AirPlay zone inclusion via `AirplayIncludeGroupedEvt`, and linein object types (homeTheater, airplay, bluetooth) keyed to `x-sonos-vli:` URIs. Target resolution decides the coordinator or declines ('no autoplay target'). This is what makes a phone's AirPlay session start on the right room.

**Technical description:**

params {vol,useVol,includeZones} + "airplay include zones: %d" + AirplayIncludeGroupedEvt; linein types {object.item.audioItem.linein.{homeTheater,airplay,bluetooth}} + x-sonos-vli; target resolution {"lonely local line-in autoplay","no autoplay target","couldn't determine coordinator/AVT control URI/control URI","Not executing on invisible/node proto incompatible ZP"}; "for controlURI \[%s\] for coordinator \[%s\]. programURI \[%s\]"; "Autoplay command failed ret=%d"; "AutoStop called on unhandled URI"; http://%s:%u

- **name:** media_player_autoplay — VLI autoplay
<details><summary>Evidence (1)</summary>

- @ 0x10ecb510 — mp_autoplay block

</details>

## `mpegts_id3`

**coverage** `partial`

The MPEG-TS demuxer plus timed-ID3 extraction for HLS radio metadata: PAT/PMT parsing, audio PID selection ('No audio PID'), stream-type rejection, PTS handling, and timed-ID3v2 tag extraction with size caps and OOB guards. This is where stream metadata (artist/title) inside radio HLS comes from.

**Technical description:**

TS parse: PAT/PMT PIDs, sectlen/desclen/silen, stype (Unsupported stream type), eslen, "No audio PID"/"Audio PID is 0x%x", "non-audio and non-timed_id3 PID", PTS, peslen/payload; timed-ID3v2 extraction: tag footer detect, "Ignoring too large timed ID3 size", OOB guards, "unsupported mp3 segment"

- **name:** MPEG-TS demuxer + timed ID3 (HLS radio metadata)
<details><summary>Evidence (1)</summary>

- @ 0x10ed9380 — ts/id3 parser region

</details>

## `mpmgr`

**coverage** `partial`

The mpmgr actor layer (see media_player_mgr): the registry and resolver that maps a target key to a concrete media-player actor — including the 'no actor available' and 'unexpected target ID type' failure modes. Every player-scoped muse command resolves through here first.

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

## `muse_field_schema`

**coverage** `partial`

The JSON field names used in muse payloads, grouped by domain: auth (accessToken, refreshToken, pinEpoch), battery (chargingState, rawBatteryPercentage, batteryTemperature), device (isCoordinator, isSatellite, bootSequenceId, museHouseholdName), plus settings, positioning, and queue fields. These are the wire keys a client must produce — the binary is the authoritative spelling.

**Technical description:**

auth {systemId,pinEpoch,accessToken,refreshToken,route,protocolVersion}; battery {statusReason,chargingState,validCharger,rawBatteryPercentage,batteryPercentage,batteryTemperature}; device {deviceFeatures,isCoordinator,isVisible,isSatellite,isSecure,bootSequenceId,systemUptimeSeconds,anacapaUptimeSeconds,museHouseholdName,primaryDeviceId,networkIPAddress,networkMask,networkType,wifiSignalStrength}; audio in {bluetoothSource,lineInSource,audioInputName,audioInputIcon}; misc {pageSize,websocketUrl,vanishReason,toVersion,clientState,deviceState,downloadDuration,isSuspended,credentialTypeAllowed,allowGuestAccess,isTrial,startDate,endDate,businessCore,controlChannels,restrictedAccess,sonosRadio,speed}; playback caps {canSkipToPrevious,canPause,canStop,canRepeat,canRepeatOne,canCrossfade,canShuffle,canSkipToItem}; policy {showNPreviousTracks,pauseTtlSec,playTtlSec,limitedSkips,pauseAtEndOfQueue,refreshAuthWhilePaused,notifyUserIntent,pauseOnDuck}; track meta {catalogId,region,nextItem,currentVideo,streamInfo,replayGain,advertisement,episodeNumber,chapterNumber,episodeName,immersive,connotation}; session {epochId,periodicIntervalMillis,sendPlaybackActions,macAddr,hmacDigest,sessionState}; misc2 {zoneInfo,isUnregistered,targetRoomName,meshDisable,suppressTVConfigError,repeatOne,shuffle,customerId,updateURL,enableMonitor,manifestRevision,latestSwGen,wifiDisableState}; SFB wire keys {third-party-integ,no-ads,hd-content,special-content,on-demand-archive,can-skip,content-saving,messaging,save-groups,basic-ui,commercial-msp,essentials-msp,premium-msp,dashboard-access,schedules-access}; alarm ops {getAlarms,fetchAlarm,createAlarm,updateAlarm,snoozeAlarm,removeAlarm}; duration fmt ISO8601 PT0H5M0S

- **name:** muse JSON field schema
<details><summary>Evidence (1)</summary>

- @ 0x10f9a8e8 — field schema

</details>

## `muse_logging`

**coverage** `partial`

The internal command/event logger (`muselogcmd`/`muselogevt`) that records dispatched muse operations — loadAudioClip, setProtectedAdminSettings, createVoiceAccount among them. Useful for understanding which operations are considered sensitive enough to log, and for debugging replayed command histories.

**Technical description:**

{muselogevt,muselogcmd}; logged ops {loadAudioClip,startDirectControlEx,setProtectedAdminSettings,createVoiceAccount}

- **name:** muse cmd/event logging
<details><summary>Evidence (1)</summary>

- @ 0x10f9880c — muselog

</details>

## `muse_perf`

**coverage** `partial`

A per-stage profiler inside the muse engine: AUTH_IS_AUTHORIZED, COMMAND_PARSE, COMMAND_DISPATCH, COMMAND_EXECUTE, plus per-verb stages like PLAYER_VOLUME_SET_VOLUME, each reporting total ms, average, and count. Explains where command latency goes — e.g., auth vs dispatch vs the handler itself.

**Technical description:**

fmt "- %c%010u - %6s -" + "%s: %lldms, %fms avg \[count=%u\]"; stages {AUTH_IS_AUTHORIZED,AUTH_PARSE_DEVICE_TOKEN,AUTH_POLICY_TABLE_CACHE_FETCH,COMMAND_DISPATCH,COMMAND_EXECUTE,COMMAND_LOGGER,COMMAND_PARSE,COMMAND_REPORT,PLAYER_VOLUME_SET_VOLUME}

- **name:** muse::PerfProfiler
<details><summary>Evidence (1)</summary>

- @ 0x10f98a78 — perf profiler

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

## `muse_target_validator`

**coverage** `partial`

The gate that resolves a command's target: implicit targets (the receiving player), explicit targets (another player or group by id), and the rejections (guest_access_disallowed, forbidden, not_authorized, not_found). This is the first thing a command hits after auth — most 4xx-equivalent muse failures originate here.

**Technical description:**

rejects {guest_access_disallowed,forbidden,not_authorized,not_found}; museinfoserviceobserver/infoservice

- **name:** muse_target_validator
<details><summary>Evidence (1)</summary>

- @ 0x10f9860c — target validator

</details>

## `music_services`

**coverage** `partial`

The available-services store: `musicservices.xml` plus a backstop file, state variables (ZPMusicServicesList, ServiceListVersion, AvailableServiceDescriptorList/TypeList/ListVersion), and settings like the online-update base URL. Replication uses the ms read/write locks. This is how the household agrees on which SMAPI services are installed and at what version.

**Technical description:**

musicservices.xml + backstop file; state vars {ZPMusicServicesList,ServiceListVersion,AvailableServiceDescriptorList,AvailableServiceTypeList,AvailableServiceListVersion}; settings {OnlineUpdateBaseURL,R_TrialZPSerial,R_AvailableSvcTrials}; replication locks {rwlR_msd,rwlW_msd} + msdZonePlayer; accept logic "deciding whether to accept replicated list from: %s; ver: %u format: %u"/"replicating services from %s"/"Replicated list accepted"; zp-vs-rs compare {zpETag,rsETag,zpLUD,rsLUD,zpVer,rsVer}; "ServiceTypeList, adding built-in: %s"/"adding: %s; name: %s"; "Warning. No SD found for %d"; poll "next check for available services in %u s \[source=%s\]"; "Could not submit Available Services DIAG. Service count is: %zu"; checkForAvailableMusicServices job; "Not enough space to write full list"

- **name:** musicservices — available-services replication
<details><summary>Evidence (1)</summary>

- @ 0x10e76a94 — musicservices block

</details>

## `netif_monitor`

**coverage** `partial`

The netlink interface-address monitor — the same selthrd.RIfAddressMonitor machinery as addrmon: RTM_NEWLINK/GETLINK events feeding reset/data/except/timeout handlers. Listed separately because both the address-watch and link-watch consumers ride it.

**Technical description:**

netlink {RTM_NEWLINK,RTM_GETLINK}; errors {read error,incorrect type,unexpected message %X}; selthrd.RIfAddressMonitor.{reset,data,except,timeout}

- **name:** RIfAddressMonitor — netlink ifaddr watch
<details><summary>Evidence (1)</summary>

- @ 0x10ee69ac — addrmon block

</details>

## `netstart_events`

**coverage** `partial`

The netstartd IPC event vocabulary: hello, setup start/stop, idle/alive/open, in-setup-mode, SSID set/clear, triggered-upgrade, connection-type updates — plus WAC mode states (/var/run/wac_mode, disabled/enabled/timeout). These are the provisioning subsystem's observable transitions.

**Technical description:**

events {netstartd hello,Setup start,Setup stop,Netstart is idle,Netstart alive,Netstart open,In setup mode,Netstart SSID set/clear,Netstart triggered upgrade (0x%x),Got connection type update \[%s\]}; WAC {/var/run/wac_mode,Unknown WAC mode %d,WAC mode disabled/enabled/timeout}; ForceShutdownOnNewSSID %d; shutdown {"Deferring shutdown, reason \[%d\]","deferring newHHID event","ignoring network bounce mid-shutdown",zpShutdown,/tmp/netstartd.pid}; IP-change {re-binding old->new,clearing link-local subscriptions on 169.254.* change,shutting down for new IP,newAddr event with same addr}; conn types {SonosNet (Ethernet),Home Theater 2.0,Home Theater (Ethernet),Home Theater,Ethernet (WiFi Disabled),Ethernet,SonosNet (wireless)}; events {newHHID,newSSID}; "%s: %s event resetting connection to mDNS"

- **name:** netstartd IPC event vocabulary + connection types
- **satellite_notify:** 'Failed to send IPC message to netstartd to notify about satellite addition' — anacapad pushes satellite-addition notifications to netstartd over the IPC channel alongside netsettings/PSK pushes and connection-type updates.
<details><summary>Evidence (1)</summary>

- @ 0x10f02798 — netstart block

</details>

## `noderx`

**coverage** `partial`

The inter-player RX transport (noderx): output buffer bookkeeping (lastRead, lastConsecutiveGood, lastRx), a flight-recorder line per packet, startup with delayed packets/frames, large-gap 'don't NACK' startup, and discontiguous-NACK suppression. This is the receiver half of the framed group-audio channel.

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

## `nslookup_detail`

**coverage** `partial`

The `/nslookup` exec page: a gate plus a `nslookup` shell-out driven by a parameter table — one of the tools-page commands, listed separately because it resolves through a different dispatch path than the main exec table.

**Technical description:**

f_100b96d0: gate → execs nslookup via f_10549cf8 with table arg 0x11097680+0x810

- **name:** nslookup_detail
<details><summary>Evidence (1)</summary>

- firmware — handler disas

</details>

## `overrideconfig`

**coverage** `partial`

The `/overrideconfig` endpoint: a form POST that commits an override file, with strict body validation (read errors, content-length mismatch, init/commit failures) and a meta-refresh success page to `/fcs`. This is the engineering mechanism for config overrides that survive reboot.

**Technical description:**

form post committing override file; errors {Error reading request body,Request body size does not match content length,Error initializing object,Error committing override file}; success <html>meta refresh 1;url=/fcs Success</html>; Content-Type application/x-www-form-urlencoded

- **name:** /overrideconfig endpoint
<details><summary>Evidence (1)</summary>

- @ 0x10f06248 — overrideconfig region

</details>

## `perf_counters`

**coverage** `partial`

The perf-counter schema: keyed counters with wallClockEndTime ('end of the window as UTC'), description fields, and min/avg/max accounting — 'average value should be 0' asserts on reset. The counter_historical.h/counter_min_avg_max.h headers define the storage classes.

**Technical description:**

headers {counter_historical.h,counter_min_avg_max.h}; fields {thresh,wallClockEndTime='The end of the window as UTC wall clock time',description}; 'average value should be 0'

- **name:** perfcounter schema
- **fields:** metrics {accum,accumBytes=aggregate size of processed frames,aheadTime=amount of audio prebuffered,frameToFrame=time between frames,wouldBlock=transmits blocked count,queueExpiry=queue expiration time,frameTypes,frameSizeBytes,frameSizeSamples,processing indicators,user action,transport error,initial,perf-counters}; windows {"Creating %s window ending at time %lld","Cannot reverse time","Ringbuffer cannot rotate backwards","Rotation required"}; json {wallClockTimeUTC,timeSinceBoot,windowDuration,processName,counters}; "AFC truncated!"
<details><summary>Evidence (1)</summary>

- @ 0x10eb7e40 — perfcounter

</details>

## `perfect_sync`

**coverage** `partial`

The forced perfect-initial-sync mechanism: `forcePerfectInitialSync` pins a stream's first play time to an exact timestamp ('ignoring %d usec diff'), used when group start alignment matters more than smooth ramp-in. Normal sync uses gradual correction; this is the hard-aligned variant.

**Technical description:**

"perfect initial sync %d.%06d, available %u"; forcePerfectInitialSync + "Forced perfect initial sync %s on stream %s"; "forced perfect initial sync, ignoring %d usec diff"

- **name:** forced perfect initial sync
<details><summary>Evidence (1)</summary>

- @ 0x10f29c37 — sync block

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
- **hls_parser:** hlsplaylist/hlsrenditions parser (0x10ec5aac block): recognized tags #EXT-X-VERSION, #EXT-X-MEDIA, #EXT-X-STREAM-INF, #EXT-X-TARGETDURATION (default when absent: 'tag not present; setting %u'), #EXT-X-MEDIA-SEQUENCE, #EXT-X-PLAYLIST-TYPE ('playlist type: %s', 'static HLS (end list)'), #EXT-X-ENDLIST, #EXT-X-PROGRAM-DATE-TIME ('No ... for 1st segment'), #EXT-X-KEY/#EXT-X-SESSION-KEY with KEYFORMAT="com.apple.streamingkeydelivery" (FairPlay SKD), #EXT-X-DISCONTINUITY, #EXT-X-INDEPENDENT-SEGMENTS, #EXT-X-MAP ('HLS Segment Map entry'), #EXT-X-BYTERANGE. Validation: 'Invalid initial playlist: %s: header=%s', 'invalid #EXT-X-MEDIA rendition tag', 'attempted to store an invalid rendition that doesn't begin with #EXT-X-MEDIA', 'invalid rendition, attempt to store duplicate group-id', 'Invalid media playlist: %s: line=%s'. ABR/rendition selection: BANDWIDTH required ('rejecting bandwidth 0'/'unsupported bandwidth %llu'/'no bandwidth was specified'), codec allowlist ('rejecting unsupported codec %s', 'at least one supported codec in playlist not found'), Atmos/JOC handling ('we have %zu dolby streams', 'rejecting unsupported Atmos stream', 'JOC / Atmos', 'Downmixed from Atmos', 'Undefined channel rendition'), binaural/downmix rendition rejection, 'forcing a source switch due to multiple codec variants'; bitrate ladder traversal ('advancing stream index to %d \[%s\]', 'invalid stream index %u (max=%zu)', 'failed to get URI for br index %d stream %d'). Segment machinery: 'segmented content', seeking ('seeking pass segment %llu'/'seeking to segment %llu start time = %.2f range start %llu len %llu'/'Seeking pass the end of the playlist'), 'Error creating URI for HLS segment: %s with base: %s', 'total dur after adding segment duration: %f'/'stream duration from HLSPlaylist: %f'. Status XML <HLSInfo><HLS Name="Playlist"><HLSVersion>%d + <BitrateStreams numBitrates="%zu"><StreamEntry br="%u" strm="(%zu,%zu)" codec="%s".
<details><summary>Evidence (1)</summary>

- @ 0x10ed1854 — play_state_mgr region

</details>

## `psk_hierarchy`

**coverage** `partial`

The household's symmetric-key tree: four PSKs — HhPsk (DTLS for household comms), ControlPsk, RoomEncPsk (encrypts room names), LanSwapPsk — each with a backup mirror for seamless rotation. Rotation regenerates all four, bumps the netsettings version, and propagates to members. This is the cryptographic root of trust for inter-player traffic.

**Technical description:**

PSKs {HhPsk (DTLS HH),ControlPsk,RoomEncPsk (room-name encrypt),LanSwapPsk} each +Backup mirror id; rotation {"Unable to generate new HH/control/room name encrypt/lan swap PSK","Unable to update settings with new PSKs","PSK rotation successful (HH: %s, Control: %s, RoomEnc: %s, LanSwap: %s)","Bumping netsettings version","not rotated"}; encoding {"Encoding SonosNet key failed","Encoding DTLS HH PSK failed"}; "Pending netsettings.json update discarded after replicating"; "Settings Replication changed SN Disable from %d to %d (source: %s)"; SSID protection {"SSID missing from known networks list","Registering for next topology update to protect SSID","Current SSID protected/already protected/not protected, could not get current SSID/missing from networks list","Not connected to a WiFi network, skipping SSID protection"}; "Received netsettings update from netstartd"/"netsettings changed"; app/run/nettestresult.txt

- **name:** 4-PSK household crypto hierarchy + rotation
<details><summary>Evidence (1)</summary>

- @ 0x10efadb8 — netsettings block

</details>

## `qplay`

**coverage** `partial`

QPlay (Tencent) support — minimal in this build: the device description advertises `QPlay:2` with `X_QPlay_SoftwareCapability`, a `#QPLAY_SUPPORT#` placeholder, a `QPlayAuth` action, and `updateSharedTQPlayMode`. No seed/code exchange or control channel was found — treat as stub-grade, Chinese-market capability advertising.

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

## `rdmbuttonfwd_detail`

**coverage** `partial`

The `/rdmbuttonfwd` handler detail: an auth gate plus an RDM-mode predicate — in RDM mode, button events forward through f_100b9bb0; outside it, requests get a 403-class rejection. RDM is the remote-display/room mode; forwarding only makes sense there.

**Technical description:**

f_100b9e58: auth gate f_105489fc + RDM-mode predicate f_105e9468 → f_100b9bb0 forwards buttons; else 403-class — GET/POST path via f_100b9bb0 after RDM-mode predicate f_105e9468

- **name:** rdmbuttonfwd_detail
<details><summary>Evidence (1)</summary>

- firmware — handler disas

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

The runtime policy object: consults fcs, hhsettings, and settingsmgr to decide 'Disallowed' outcomes — e.g., effective P2P policy encryption status, 'Use Thor w/ Muse', 'Chsrc Optimization Enabled'. Feature gates that depend on live configuration rather than build flags route through here.

**Technical description:**

ctor deps {fcs,hhsettings,settingsmgr}; Disallowed; P2P {isEffectiveP2PPolicyEncrypted,'Effective P2P Policy is encrypted \[%s\]'}; flags {'Use Thor w/ Muse','Chsrc Optimization Enabled'}

- **name:** runtime policy (RRuntimePolicy)
<details><summary>Evidence (1)</summary>

- @ 0x10efdaa4 — runtime policy

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

## `select_thread`

**coverage** `partial`

The RSelectThread epoll wrapper: epollAddFD/remove with per-user accounting ('too many users'), interrupt-fd handling, fd-change detection ('improperly changed its FD'), eventfd errors, and mutex-protected updates. The named `selthrd.*` event sources throughout the docs run on this thread.

**Technical description:**

{epollAddFD,selthrd,RSelectThreadMutex,SelthrdUpdateMutex,epollReset}; errors {"Error in addUser - too many users","Error adding/removing interrupt fd to epoll","%s improperly changed its FD to %d (watching %d)","Error in eventfd (%d)","Error removing fd %d for %p %s (%s)","%s: %p %s already watching fd %d, removing it first","Error adding fd %d","Update error stu %p not in st %p","Error %d in epoll wait (%s)"}

- **name:** RSelectThread epoll wrapper
<details><summary>Evidence (1)</summary>

- @ 0x10fba020 — select thread

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
- **wake_related:** WoW wake of vanished group members + WakeOnLANRequestEvent + wake-lock guards ('modifyWakeLockForOperationTimeout(%d, %lld) not acquired by guard'), 'SYSTEM_ERROR_WAKEUP_FAILURE'; 'powerWakeupFromSemiSleep' muse op + 'STAY_AWAKE' flag
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

## `sethostip_detail`

**coverage** `partial`

The `/sethostip` handler detail: a gate plus a tail that sets the host IP and responds — one of the engineering endpoints, bound through a different dispatch path than the master table.

**Technical description:**

f_100b9fac: gate → tail f_105499fc (host-ip set + respond)

- **name:** sethostip_detail
<details><summary>Evidence (1)</summary>

- firmware — handler disas

</details>

## `settings_replication`

**coverage** `partial`

Household state is kept in sync by a replication protocol: each named store (accounts, netsettings, favourites, saved queues, areas) has a version+format handshake and per-item transfers between players. The wire exchange is now decoded: a peer that has a newer setting announces it ('offerUpdatedSetting: src, settingId, lastDevice, version, format') and the receiver pulls it with a plain HTTP GET '...?id=N' carrying an X-RINCON-CONTENT-FORMAT header; the response must echo X-RINCON-CONTENT-VERSION, X-RINCON-LAST-UPDATE-DEVICE, CONTENT-ENCODING and an X-RINCON-SIGNATURE which is verified before install. Downloaded settings land in setrepl.tmp and are atomically promoted. A bad format or encoding gets the setting denylisted (and it stays denylisted until the player re-registers); a signature mismatch, bad version or algorithm aborts the pull. The index itself is an XML list of <Setting idx lud version> records where 'lud' is the last-update device UUID — that's how a player knows which of its settings are stale. The whole protocol is gated on registration: an unregistered player refuses to replicate.

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
- **wire_protocol:**
  - **fetch:** GET %s%s?id=%u HTTP/1.1 — per-setting pull by numeric id
  - **request_headers:** `CONNECTION: close`, `ACCEPT: */*`, `HOST: %s:%d`, `USER-AGENT: %s`, `X-RINCON-CONTENT-FORMAT: %u`
  - **response_headers:** `X-RINCON-CONTENT-VERSION`, `X-RINCON-LAST-UPDATE-DEVICE`, `X-RINCON-CONTENT-FORMAT`, `CONTENT-ENCODING`, `X-RINCON-SIGNATURE`
  - **index_record:** <Setting idx="%u" lud="%s" version="%u" /> — lud = last-update-device uuid
  - **offer_flow:** 'offerUpdatedSetting: src=%s set=%u ldev=%s ver=%u fmt=%u' — peers offer updated settings {src, settingId, lastDevice, version, format}; receiver pulls via GET
  - **failure_taxonomy:** `openStream 0x%08x %s \[%d\]`, `filesize bad/unavail %zu`, `bad version/last update id`, `denylisted setting %u %s`, `badFormat %u -> denylisting`, `badEncoding %d -> denylisting`, `bad version %u`, `Cannot open temp file`, `bad algorithm`, `signature mismatch`, `Not replicating while unregistered`, `replicating from URI %s (%u) failed with %u`
  - **install:** download to setrepl.tmp then atomic promote
  - **denylist:** 'denylisting replicated setting %u, unknown or blocked'; 'Removing settings denylists after registration'; 'Setting %u needs to call addServiceSetting'
  - **magic:** 'RINCON_FFFFFFFFFFFF99999' — device-id/magic pattern literal
  - **gate:** 'Not replicating while unregistered' — replication requires completed registration
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

## `sharelist`

**coverage** `partial`

The SMB share-list manager: add/remove/reindex/resort shares, replicate the list via `indexrepl` with a 'us vs them' remoteSettingIsBetter comparison, and drop shares whose protocol fails verification. Share-index errors and subsumed-path detection keep the library consistent across the household.

**Technical description:**

replication via %s/indexrepl + proposeUpdatedShareList + "remoteSettingIsBetter: us \[%s|%u\] vs them \[%s|%u\]"; ops {localAddShare,localRemoveShare,localRequestReindex,localRequestResort,localRemoveUnsupportedShares}; protocol gate {verified supported protocol→keep,else remove + count} + VerifiedValidProtocol flag; errors {share ID not found,path already exists,subsumed by existing share,Path is malformed,Access denied,Cannot exceed maximum shares,Mounting failed,Local index storage error,Remote file share error,Indexing canceled,connection failure,replication failed,replication skipped fmt mismatch}; reindex "request reindex (ad:%d sf:%d fr:%d si:%d st:%d lc:%s)" + "Turning resort request into full reindex" + "processing index complete (c:%d i:%d f:%d lc:%s)" + commit {m_bCommitted,m_bWait,m_bTerminate} + index recovery "recovered ix=%d with ver=%d"; R_BrowseByFolderSort + Tracknum sort

- **name:** sharelist — SMB share replication + index
<details><summary>Evidence (1)</summary>

- @ 0x10e89d48 — sharelist block

</details>

## `shoutcast`

**coverage** `partial`

The Shoutcast/ICY stream client: request headers (icy-name, location, CONTENT-TYPE, server — 'Cougar' server id), response handling (ICY 200, HTTP 200/30x variants), redirects (including audio/x-mpegurl), and metadata-interval handling. This is what plays legacy internet-radio ICY streams.

**Technical description:**

request {icy-name:,location:,CONTENT-TYPE:,server:} + server id Cougar; responses {ICY 200,HTTP/1.1 200,HTTP/1.0 200,HTTP/1.1 30x,HTTP/1.0 30x} + redirect to %s; "request buffer is too small"; "add header \[%s : %s\]"; "opening connection with \[%s\]"; "Redirect audio/x-mpegurl to %s" (M3U); inline metadata {StreamTitle,text=""} + "end of file or I/O error"; shoutcastradio type; explicitContentFiltering + rsmapicontextzp

- **name:** shoutcast/ICY stream client
<details><summary>Evidence (1)</summary>

- @ 0x10ed462c — shoutcast block

</details>

## `shutdown_reasons`

**coverage** `partial`

The idle/shutdown reason enum: APICall, BluetoothConnection, PartnerDisappeared, Recovery, UserSuspend, UserShutdown, APIShutdown, CriticalShutdown, UnknownShutdown — plus the idle-state transitions and battery fields (RawBattPct...). Suspend/resume decisions and 'why did it power off' answers come from this enum.

**Technical description:**

"idle state is %sidle, changing to %sidle" + dpUpdateIdleState; reasons {APICall,BluetoothConnection,PartnerDisappeared,Recovery,UserSuspend,UserShutdown,APIShutdown,CriticalShutdown,UnknownShutdown}; "unable to parse KVPair. %s is an invalid KV pair string."; battery {RawBattPct,BattPct,BattChg,BattTmp,BtSrcName}; EnetPorts {<Port port Link Speed> + EthPrtStats {rxPackets,txPackets,rxBytes,txBytes,rxErrors,...}}

- **name:** idle/shutdown reason enum + battery
<details><summary>Evidence (1)</summary>

- @ 0x10ef3328 — idle/shutdown block

</details>

## `shutdown_seq`

**coverage** `partial`

The modZPShutdown ordered teardown: HttpClient, ZonePlayer, AsyncMuseThreadPool, InternalEventDispatcher, resetZone, DropoutEventHandler, deleteTimedJobManager, AsyncThreadPool, finalSection, finalSectionEnd. The order matters — e.g., muse threads die before the event dispatcher so no late commands can queue.

**Technical description:**

ordered teardown {HttpClient,ZonePlayer,AsyncMuseThreadPool,InternalEventDispatcher,resetZone,DropoutEventHandler,deleteTimedJobManager,AsyncThreadPool,finalSection,finalSectionEnd}

- **name:** modZPShutdown sequence
<details><summary>Evidence (1)</summary>

- @ 0x10e743d7 — shutdown order

</details>

## `signal_source`

**coverage** `partial`

The signal/tone source: single-instance tone injection ('only one signal can run at any given time'), playId validation, channel-number targeting, and policy gating. Sonar calibration tones and test signals use this engine.

**Technical description:**

errors "invalid playId"/"failed to stop signal"/"incorrect playId"/"nothing is currently playing"/"couldn't create an audio stream"/"only one signal can run at any given time"/"invalid channel"/"disallowed by policy"; channelNumber param

- **name:** signal/tone source
<details><summary>Evidence (1)</summary>

- @ 0x10ed2dc8 — signal source region

</details>

## `smapi_descriptor`

**coverage** `partial`

The SMAPI service-descriptor schema: apiKey, presentationMap, strings, reporting, browse, and Moment sections plus accountTiers (paidLimited, paidPremium). The descriptor is what the player reads to learn a service's capabilities — it's the contract a custom service must implement.

**Technical description:**

fields {apiKey,advertising,presentationMap,strings,reporting,browse,Moment}; accountTiers {paidLimited,paidPremium}; additional capability checkbox values from the embedded form: disableMultiAccount, plus confirm contextHeaders/deviceCerts/playerIds/userInfo/contentFiltering/manifest/authorizationHeader/mediaUriActions already catalogued

- **name:** SMAPI service descriptor schema
<details><summary>Evidence (1)</summary>

- @ 0x10ea5c70 — smapi descriptor fields

</details>

## `smartplay`

**coverage** `partial`

The SmartPlay bridge-content loader: triggered by BUTTON or EMPTY_AVT, it calls the cloud `/bridge/content/api`, fetches content for a group, and starts playback — all timed (loadContent/getContent/fetchContentAndStartPlay in ms). 'PlayerSmartPlay missing required field' rejects malformed configs. This is the 'speaker plays something sensible when you press play with an empty queue' feature.

**Technical description:**

reasons {BUTTON,EMPTY_AVT}; "PlayerSmartPlay missing required field %s"; /bridge/content/api + "service base path: %s"; timings {"loadContent took %ld ms: GroupId %s GC %s %s","getContent took %ld ms: %s","fetchContentAndStartPlay took %ld ms, success: %s"}; errors {loadContent failed,getContent parse failed,getContent failed}

- **name:** smartplay — bridge content loader
<details><summary>Evidence (1)</summary>

- @ 0x10ed4968 — smartplay block

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
- **server_detail:** sntpsrv.cxx: local SNTP responder — 'failed sntp response on %s:%u', per-clock request handling 'could not process sntp-%u-clock request; thread exit', 'processing sntp-%u-clock evtMask: %u fd: %d' under domain 'sntp_srv', interrupt fds added/removed dynamically. sntppoll.cxx: '{sntppoll' status XML + sntp.txt dump + save_sntp key; zone/common/sntp.cxx provides 'sntp.poll'. VLI transport is SNTP-disciplined: 'vli src tx settings sntp port: %u', 'vli sntp port %u', 'htsnk_invld_sntp' (HT sink rejects invalid sntp). Drift telemetry: 'error was %.0f ms %s; cpu usage was %.01f%%; sntp v:%d f:%d'.
<details><summary>Evidence (7)</summary>

- @ 0x10ed6496 — sntpsrv.cxx
- @ 0x10ed62e8 — handleSntpRequest
- @ 0x10ed6418 — Created SNTP Server
- @ 0x10eaac68 — 0-3.sonostime.pool.ntp.org pool list
- @ 0x10ed6418 — 'Created SNTP Server, port: %hu clock: %s' (sntpsrv.cxx)
- @ 0x10eb4bd4 — 'Starting SNTP server switch.'
- @ 0x10eb5758 — synchronizedPlay SNTP wait

</details>

## `socket_hal`

**coverage** `partial`

The eSDK socket HAL: platform sockets abstracted for the Connect stack — IPv4-only (`Tried to use IPv6 but this platform does not support it`), DNS queueing with a bounded queue, socket-option plumbing, and the accept/connect/bind error taxonomy. Everything eSDK does on the network lands here.

**Technical description:**

errors {"listen socket_listen/bind/set_option/create ret: %d","DNS callback not set","Requested hostname longer than %d","DNS lookup returned %d","connect socket_create/set_option/connect ret: %d","cb_socket_connect() = %d","try again, returning","Error setting kSpSocketReuseAddr/ReusePort/MulticastTTL/MulticastLoop/Membership/NonBlocking","udp socket_bind/create ret: %d","socket_close/accept/set_option/read ret: %d","Returning EOF/error on disconnected socket"}; tags {SOCKET-MANAGER,TLS-INTERNAL,Socket reporting error}

- **name:** eSDK socket HAL
<details><summary>Evidence (1)</summary>

- @ 0x10fd80c4 — socket HAL

</details>

## `sonarctl_detail`

**coverage** `partial`

The `/sonarctl` handler detail: control surface for the sonar (room-detection acoustic) subsystem — gated like the other engineering endpoints.

**Technical description:**

gate f_105489fc → method check (r9==1 POST?) → f_100b4614+f_100b4364+f_100b4388 response helpers; flushes sonar tones ("flushing sonar tones"/"Flushed")

- **name:** /sonarctl
<details><summary>Evidence (1)</summary>

- @ 0x100bc354 — handler disas

</details>

## `sonoscp`

**coverage** `partial`

The sonos content-provider umbrella (`sonos_cprovider`): the SMAPI SOAP client plus the WMP provider plus service-descriptor handling — the big module that speaks outbound to music services on the device's behalf.

**Technical description:**

vars {reports,playbackPolicies}; errors {"Unable to validate specified service id %u","ignoring unsupported object %s","could not identify default account for object %s","cannot map content type %s to SMAPI protocol \[accountId:%s,sid:%s,obj:%s\]","cannot generate SMAPI URL"}; CQ URI cache {"Fetching CQ itemId %s using cached trackURI.","Adding track URI for itemId %s to cache.","Invalidating CQ track URI cache.","CloudQueueWindow init: %s"}; audio/x-spotify

- **name:** sonoscp content provider
<details><summary>Evidence (1)</summary>

- @ 0x10eb9c50 — sonoscp block

</details>

## `sound_device`

**coverage** `partial`

The sound-device abstraction: the layer between the mixer/LLA and the hardware — device open, buffer negotiation, select/poll integration, and the fault taxonomy the audio stack surfaces. On this model it fronts the TDM/SPDIF driver.

**Technical description:**

syslib events {open,get_fd,poll,read,close} errors; LLA checks {DAC count,sample width inconsistency}; system/src_disable + StdQ ASRC Coeffs + "Running with SRC bypassed"; orientation sensing; "reset vcxo"; health flags {AMP_CURRENT_WARN,AMP_FAULT_WARN,AUDIO_WARN_TEMP,CPU_WARN_TEMP,CPU2_WARN_TEMP,SOC_WARN_TEMP,AMP_CURRENT_FAULT,AMP_FAULT,AUDIO_FAULT_TEMP,CPU_FAULT_TEMP,CPU2_FAULT_TEMP,SOC_FAULT_TEMP,PS36_FAULT,UV36_FAULT,UV14_FAULT,POWER_WARN_TEMP,POWER_FAULT_TEMP,MOTION_FAULT_TEMP,MOTION_WARN_TEMP}_STATUS

- **name:** sounddev — output device + HW health
<details><summary>Evidence (1)</summary>

- @ 0x10f2ac18 — sounddev block

</details>

## `sound_swap`

**coverage** `partial`

SoundSwap: the feature that lets an audio session follow the user between devices. The FSM handles swap requests, target selection, and handoff; muse `soundSwap` namespace verbs drive it. Think 'move what's playing to the speaker I'm next to'.

**Technical description:**

sound_swap/audio_swap; queue audioSwapEventQueue + progress audioSwapProgress; behaviors SWAP_BEHAVIOR_{DO_NOTHING,PUSH_SWAP,PULL_SWAP,UNDEFINED}; push/pull disband target|initiator group; HTSatelliteChecker gates (isFound,isHTSat,playerUDN,HTPrimaryUDN + topology/group-props/GC-AVT lookups); FSM "New state: %i"/"Event %i not handled in state %i"/transition-failure -> reset; result fields {swapResult,swapType,swapTarget,swapGC,initAction,candCount,respCount}; gates {bonded zone,HT Satellite,unknown state,unswappable audio,already in progress}; muse calls museCmdSetGroupMembers/museCmdModifyGroupMembers via groups/%s/groups/modifyGroupMembers

- **name:** SoundSwapController — audio-swap FSM (zpSwap)
<details><summary>Evidence (1)</summary>

- @ 0x10ed6b44 — sound swap region

</details>

## `spdif_detect`

**coverage** `partial`

The SPDIF input detector: format detection on the optical/ARC input that decides which decoder path (PCM, Dolby, DTS) gets the stream. Detection failures surface as the input 'working' but producing silence.

**Technical description:**

detected {Dolby Digital,Dolby Digital Surround,Dolby Digital Plus,Dolby Atmos (DD+),Dolby TrueHD,Dolby Atmos (TrueHD),Dolby MAT,Dolby Atmos (MAT),DTS (Type1),DTS (Type2),DTS (Type3),NULL Burst,Pause Burst}; unsupported taxonomy {AC-3,SMPTE 338M v1-v5,MPEG1 Layer 1/2/3,MPEG2,MPEG2-AAC,MPEG2 Layer 1-3 LSF,DTS1-4,ATRAC,ATRAC 2/3,ATRAC X,WMA Professional,MPEG2 AAC LSF,MPEG4 AAC,Enhanced AC-3,MAT,MPEG4 ALS,Reserved 2-4,Extended Data,MPEG4 AAC LC in LATM/LOAS,MPEG4 HE AAC in LATM/LOAS,DRA,Unsupported}

- **name:** SPDIF IEC61937 burst-format detection
<details><summary>Evidence (1)</summary>

- @ 0x10ee650c — spdif fmt enum

</details>

## `spotify_smapi_ctrl`

**coverage** `partial`

The Spotify SMAPI-control bridge: the layer that lets a Connect session appear as a controllable media source — translating between eSDK callbacks and the Sonos transport/queue model, including the SMAPI↔VLI transition semantics.

**Technical description:**

setPositionInfo fmt "trackId='%s', position=nullptr, duration=%d, bLastReport=true"; "discarding pre-transition position %lldms"; TransitionAck \[pos,preLogout pos,transAck\] + "Begin AwaitingTransitionAck \[preLogout=%lldms\]"; stream status "SMAPI current stream\[%u\] mediaType\[%d\]=%s (curTrkStatus\[%u\]=%d/nextTrkStatus\[%u\]=%d)"; "Notified we are receiving delegation. Resetting track queue info."; "Error event in SMAPI mode, e=0x%08x"; error map "error: %s ecode=%d (%s), mapped to 0x%08x"

- **name:** RSpotifySMAPIControl
<details><summary>Evidence (1)</summary>

- @ 0x10ea46c0 — smapi block

</details>

## `spotify_thread`

**coverage** `partial`

The eSDK thread: the event pump, message queue, rate limiting, and the transition-ack machinery that serializes Connect commands. Most 'Connect did nothing' bugs are a queued op dying silently on this thread.

**Technical description:**

single-request constraint "Already have a spotify request in progress, can only have one!!" + "Executing %s ..."/"%s timeout"; rate limit {"restricting excessive fatal error reporting","spotify telemetry rate limit exceeded!",spotrl}; connect ops {SpDisableConnect,SpEnableConnect,SpSetDisplayName,SpSetDeviceIsGroup,Enable/Disable Connect} "Set display name \[%s\], is%s grouped"; playback {SpPlaybackIncreaseUnderrunCount "Underruns reported: %u",SpPlaybackSetBitrate setbr,SpPlaybackPause/Play,SpPlayUriWithOptions,SpPlaybackEnableShuffle/Repeat,SpGetMetadata,SpZeroConfGetVars}; ads spotify:ad:/spotify:interruption:; restart token "'Radio' stripped from restart token. Token was %s now %s"; login {SpConnectionLoginOauthToken,waitForLogin,waitForLogout,"Login user change while in progress \[%s => %s\]","Already logging in as \[%s\]","Login mismatch","username %s... is longer than maximum %zu"}; logout {SpConnectionLogout,"logout %u, reset","Async logout initiated for VLI source switch","logout-%u - %d \[%s\]"}; work {RSpotifyEventWork::doWork(),DefaultWork}; "Failed to update the volume to %u (status=%d)"

- **name:** spotify request thread
<details><summary>Evidence (1)</summary>

- @ 0x10ea49d4 — spotify thread block

</details>

## `spotify_vli_session`

**coverage** `partial`

The Spotify→VLI session: how a Connect takeover materializes as a virtual-line-in session on the group — VLI delegation guards, session lifecycle, and the transport handoff. The `x-sonos-vli:` URI scheme is this session's address.

**Technical description:**

session verbs {start,suspendSession,startAudio,pauseAudio,stopAudio,playModesChanged}; power {Spotify eSDK source power suspend/resume (e=0x%08x)}; delegation {"Ignoring audio flush/track changed/seeks (pos %u)/pause/became inactive while setting state / delegating","Spotify eSDK source selected, isDelegating %d, isActive %d","source not selected","Source Deselected, from sender %d"}; cookies {"%s:%d spotify old cookie: %d new: %d","Ignoring stale stopSession due to cookie mismatch"}; callbacks onVirtualLineIn{SuspendSession,StartAudio,StopAudio,PlayModesChanged} cookie %d; metadata {track,artist,album,playback_source_uri,bitrate} + Next Metadata; "Error event in VLI mode, e=0x%08x"; R_SPOT_EVT_AUDIO_TIMEOUT; RSpotifyVLIControl deactivate

- **name:** Spotify eSDK VLI session control
<details><summary>Evidence (1)</summary>

- @ 0x10ea5420 — spotify vli block

</details>

## `ssh_keys`

**coverage** `partial`

The `/ssh/authorized_keys` management: FCS-gated install/remove of SSH public keys — an engineering/debug feature, not a consumer surface. The gate means it only works when the device is in a permitted state.

**Technical description:**

params {ssh_key,button,remove_keys}; ops {"SSH auth key added to authorized keys file","SSH authorized keys file removed"}; dropbearkey /usr/bin/dropbearkey + host key /jffs/persist/ssh/dropbear_ecdsa_host_key + ecdsa-sha2-nistp256; fingerprint formats {pubkey,sha256-base64,md5-hex}; gated by R_ALLOW_SSH_PUBKEY_INSTALL (per gap audit)

- **name:** /ssh/authorized_keys management
<details><summary>Evidence (1)</summary>

- @ 0x10efefb4 — ssh block

</details>

## `ssl_sessions`

**coverage** `partial`

The mbedTLS session-cache layer: TLS session resumption storage so repeated connections to the same host skip full handshakes. The session-cache errors are distinct from cert validation errors — a bad cache entry isn't a bad cert.

**Technical description:**

{'Cached SSL session for %s:%d','Failed to cache SSL session','SSL connection not established','Received new session ticket during mbedtls_ssl_{read,write,handshake}.'}

- **name:** mbedTLS session cache
<details><summary>Evidence (1)</summary>

- @ 0x10ee6c18 — ssl session cache

</details>

## `stream_fetcher`

**coverage** `partial`

The generic stream fetcher FSM: open, headers, redirect handling, resume-at-offset (`?after=`), and error recovery for HTTP audio. It sits under the playlist parsers and feeds the decoder — the 'network' half of streaming playback.

**Technical description:**

notifyFrame ty:%d ln:%zu so:%zu ns:%zu f:%u ctx:%u:%u:%llu; getContentKey (encrypted HLS); "New bitrate: %d, Old bitrate: %d" adaptive switch; playlist FSM {"Timed out looking for playlist","Playlist failure with no time to recover (%ld buffer)","fetch empty","Too many empty playlists and no audio left"/"(still %ldms ahead)","Switching source due to empty playlists","end of static list","Unable to select another DS"/"waiting to fetch new playlist"}; "Startup ahead: %ld"; "URIs for %g seconds, wake up in %d"; "prebuffering %u bytes within %ld msec"; open fmt "open: %s (0x%x) %d len %llu offset %llu"; "stopping decoding while sleeping"

- **name:** stream playlist fetcher (HLS/radio)
<details><summary>Evidence (1)</summary>

- @ 0x10ed38c8 — audio_stream region

</details>

## `stream_playback`

**coverage** `partial`

The stream playback engine: the DS (data-source) selection, playlist fetch scheduling, failover between alternates, and recovery accounting (buffer-ahead ms deciding if there's 'time to recover'). This is the engine that keeps a radio stream alive through network hiccups.

**Technical description:**

policy {"Cloud queue policy pause expiry time hit","Queue content expired","clearing queue per policy","Queue policy stop on error","Ignoring playback policy change for context version %s"}; routines {running/End of pauseRoutine,running stopRoutine}; states {DEFER_PLAYING timeout,TRAN_PAUSED,PLAYING_START,suspended}; "Resetting required group caps \[0x%08x\] -> \[0x%08x\]"; "logical track boundary at %u"; frame timing {"notifyFrameInternal: behind %dms","ahead %lldms. Sleeping %lu ms, playtime=%d.%06d, sent at=%d.%06d, now=%d.%06d","tracking E_WOULDBLOCK count","setting origin time to %d.%06d"}; start hints {waiting,fast startup,future,met,no hint,crossfading}; buffer {"buffering underflow after %lld ms, requesting resync \[BH:%lld, FH:%u%%, FA:%lld, FR:%d\]","recovered buffering underflow"}; metrics {timeStart,timeEnd,behindMS,chsrc_behind}; skip reasons {duplicate,restricted,explicit,denylisted,Upcoming Spotify not playable,Spotify filtered for explicit}; "PlayTTL expired, pausing playback"; mime/URI consistency check + getTrackURIAndFramer \[f,u,m,cld\]; oob metadata {cache reset,enabled,disabled}; "Ignoring provided mediaUrl"; session ops {stationMetadata,rejoinSession,leaveSession,trackMetadata,streamUrl}; seek {"Overriding seek with value from SMAPI service: %lds","tvSeek framerResumePos"}; URIs {x-rincon-sonarcal,x-rincon-configmode,file://%s/sonar-tone/%s,file:///opt/buzzers/%s}; "Apple Music: use the derefenced URI to determine the framer, see CP-7253"; "Hit the end of the programmed radio queue"; "reporting enqueued stream URI instead of track URI"

- **name:** stream playback FSM + frame timing
- **error_report:** %s Transport error %s for account type %u, URI: %s, friendly name: %s, share/server: %s, path: %s, ip: %s, host: %s, extra info: %s, http: %d, framer: %s, ahead: %d, rate: %d
- **crossfade:** "Setting up for %d.%06d sec crossfade"/"Not fading" + prev/next track length logs
<details><summary>Evidence (1)</summary>

- @ 0x10ea992c — playback block

</details>

## `tdm_driver`

**coverage** `partial`

The TDM/SPDIF interface to the DSP (`/dev/dsp`): an mmap'd ring with `TDM_SETMODE` ioctl setup. SPDIF block handling tracks frame counts and restarts on oversize blocks. This is the hardware boundary for the amplified products' output path — everything above it (LLA, mixer, DSP config) eventually lands here.

**Technical description:**

{"Restart SPDIF block @ %d frames.","OVERSIZE SPDIF block @ %d frames!"}; device /dev/dsp; {"open failed (err=%d)","ioctl TDM_SETMODE failed (err=%d)","mmap failed (err=%d)","munmap1/munmap2 failed (err=%d)"}

- **name:** TDM/SPDIF DSP driver
<details><summary>Evidence (1)</summary>

- @ 0x1102a380 — TDM

</details>

## `telemetry`

**coverage** `partial`

The telemetry umbrella: the event pipeline feeding usage metrics, dropout events, and playback stats to the cloud — with SHA256-checked persistence (`/tmp/event_preserve`) so events survive a crash before upload.

**Technical description:**

PlayerButtons + TelemetryBasePlayer + TelemetryCategoryContext + telemetry tag; fields {event_id,event_name,event_schema_version,household_id,model_type,muse_household_id,serial_number,sonos_id,sw_build_type,sw_full_version,timestamp_utc,audio_type}; "PlayerButtons missing required field %s"

- **name:** telemetry — event schema
<details><summary>Evidence (1)</summary>

- @ 0x10ec7290 — telemetry block

</details>

## `telemetry_client`

**coverage** `partial`

The telemetry submission client: endpoint selection, batch send, retry, and the `Esdk*`/usage event schemas it accepts. 'Sending EsdkPlaybackStats log failed' is this layer retrying.

**Technical description:**

reportKVEvent; "report: %s %s %s %u %u"; "name: %s, schemaver: %s, category: %s"; "Encoding failed/succeeded: %zu bytes"; "Callback is not set to call in %s"/"Callback not set in %s"

- **name:** telemetry_client
<details><summary>Evidence (1)</summary>

- @ 0x10fb9c2c — telemetry

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

The thermal management: temperature sensors feeding throttle/shutdown decisions — `thermal` events in hw_events, and the shutdown reasons that fire when the unit overheats. Explains 'speaker shut itself off' on hot days.

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

## `timed_jobs`

**coverage** `partial`

The timed-job registry: the named scheduled tasks (healthcheck, cert refresh, token refresh, history sync, etc.) each with interval and last-run bookkeeping — the cron-like layer inside anacapad.

**Technical description:**

jobs {netsettingsBumpVersion,checkSonosNetDisableTestTimedJob,netsettingsRotateKeys,CheckForMissedPlayers,JITCloudFetch,RefreshSonosRadio,AddRemoveSonosBusinessMSP,fetchCertBundle,resetBTRecoverState,pollWirelessNetworkStatus,backupLogFiles,refreshSSLClientCache,reportSSLClientCacheStats,saveSSLClientCache,userInitiatedHHUpdate}; workers {asyncWorkerModZp,asyncMuseModZp}; setup {"Setting up ZonePlayer","ZonePlayer setup complete","Setting up MediaPlayer for port %u","Setup for MediaPlayer on port %u complete","no %s found in %s"}; jobs {High Res Usage Metrics/HRUsageMetrics,Account Maintenance/SvcAccountMaint}

- **name:** timed-job registry + setup
<details><summary>Evidence (1)</summary>

- @ 0x10e74914 — job registry

</details>

## `tj_wakeup`

**coverage** `partial`

The timed-job wakeup machinery: the scheduler half that fires jobs on time including across suspend — the 'wake the device to run a job' path that interacts with semi-sleep.

**Technical description:**

async wakeMissingPlayers {task,timer,request,retry TJ,cancel,failure} + "Unexpected WakeOnLANRequestEvent type" — WakeOnLAN; "Restoring AVT and track queue"/"Backing up track queue"/"Backing up AVT"; "Chirp setup failed - chirp sender does not exist"; "Setup volume not yet calibrated"; "Unable to play chirp"; refreshMdnsRegistration; /players/ api 1.1.0; settings {R_VolNormMode,R_CrossfadeDuration,R_AirplayIncludeLinked}; manual node engine ctor node version; spotmdns thread

- **name:** TJ — wake-missing-players + backup
<details><summary>Evidence (1)</summary>

- @ 0x10ecb048 — tj block

</details>

## `token_refresh`

**coverage** `partial`

The OAuth token-refresh state machine: dedicated threads watch expiry, request refresh through the cloud queue, wait for completion, and stash tokens to file — logging HTTP status per attempt. When SMAPI or cloud calls start failing with auth errors while the token looks valid, this is the FSM that was supposed to have refreshed it.

**Technical description:**

threads {cqatrs_tx,cloudqueue_tr}; log "\[%s HTTP %d from %s%s\] %s"; states {"using token from file","requesting new token refresh sync","requesting token refresh sync %u %d -> %d","need to wait for token refresh","waiting for token refresh completion","waiting for refresh tx complete; current state %d","Attempting to refresh token (hrs=%d te=%d)","transition token refresh action %u %d -> %d","Token refresh succeeded. Beginning retry."}; errors {"last refresh token for load timed out","no last refresh token time","expected entry not found to complete tx","expected entry not found waiting for tx","Refresh token failed with upnp result: %d","Refresh token failed. Could not find SD, sid=%u","unexpected token action %d"}; keyed by acct. sn. %u

- **name:** OAuth token-refresh FSM
<details><summary>Evidence (1)</summary>

- @ 0x10ec236c — tokenrefresh block

</details>

## `track_play_monitor`

**coverage** `partial`

The track-play monitor/recorder: records what actually played (for history and scrobbling), detects interrupted vs natural finishes, and emits the play events historymgr ships. The 'recently played' list is this recorder's output.

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

The Trueplay subsystem umbrella: the TPNode protocol, SDK integration (v6.2.0.1), measurement/collect/compute lifecycle, and the calibration results that feed DSP config. `trueplayStatus` events report its state to clients.

**Technical description:**

config modes {button-notify,room_calibration-calibrate,speaker-detect,trueroom} + "configMode CountDown:%d"; eTag manifest /etags.txt matched against tone files {leader.ogg,testtone.ogg,complete_ht.ogg,inverter_*} at path %s/%s/%s/%s-%s under tones; fetch via players/%s/settings/player muse settings + forward; "eTag is matching a known file"; types {plug-in spectral,polarity}; params {tone_duration,force,v:%s t:%s}; "Sonar cal volume - using clipped volume %d instead of requested %d"; TP update "found TP version ... do update to v%s"; teardown {"Clearing Trueroom tone folder on JFFS","Error removing Trueplay asset dir"}; restore paths {common RC,original RC,TV Surround Level,enable sonar,set AVT,reset AVT,re-enable Trueplay}; "Trueroom config mode - Not restoring/restoring the AVT"; fields {HTBondedZoneCommitState,AvailableRoomCalibration,RoomCalibrationState,Orientation,LastChangedPlayState,AlexaCBLSupported,SupportsAudioIn,SupportsAudioClip,HtBondedZoneCommitUpdateEvt}; cm_button "pressed %s"

- **name:** trueplay_dp — sonar calibration engine
<details><summary>Evidence (1)</summary>

- @ 0x10ebd630 — trueplay_dp block

</details>

## `trueplay_api`

**coverage** `partial`

The Trueplay API factory + node layer: `trueplay_api.cpp` provides the SDK entry points, node messages carry protobuf-encoded actions/statuses with version negotiation, and TrueplayAPIFactory instantiates the right implementation per product.

**Technical description:**

SDK 6.2.0.1-main.Unspecified.2db5546c; factory TrueplayAPIFactory + initNode/initNodeMajorVersion; version negot {"Build version for TP API is %s","Updating Trueplay SDK version to %s","Trueplay SDK version %s not supported, creating previous version","Requested version %s is already in use ... no-op","SDK full version","Node data schema version"}; node methods {setup,setupMeasurement,startMeasurement,computeData,handleMsg}; minimal-node build {"channel types not available for a minimal node build","local channel types not available","Number of mics and number of DSP channels must both be 0 when one is 0","not compatible with having microphones"}; TPNodeSetupInfo; file errors

- **name:** trueplay_api — TPNode SDK wrapper
- **factory:** TrueplayAPIFactory {initNode,initNodeMajorVersion,"TPNode instance is nullptr after move in APIFactory"}; file IO {"<File name='","error opening file %s (errno=%d %s)","error reading file"}
- **sdk:** SDK 6.2.0.1-main.Unspecified.2db5546c; "SDK full version : %s"; "Node data schema version : %s"; "nMics = %u & nDSPChannels = %u"; "Running a minimal node build"; "Code was compiled for minimal node support which is not compatible with having microphones"; "Node microphone data is %s"; "Trueplay data handler is a nullptr"; "Trueplay data handler reports that data collection %s allowed."; "Node isn't setup when starting a measurement/computing data"; "Starting the measurement"
- **node_fsm:** actions TP_NODE_ACTION_{NONE,SETUP,START_MEASUREMENT,SEND_BACK_DATA,COLLECT_DATA,SEND_STATUS}; status TP_NODE_STATUS_{IDLE,SETUP,MEASURING,MEASUREMENT_DONE,DATA_COMPUTED,ERROR,EXCEPTION}
- **codec:** protobuf bridge {tpNodeActionToPBNodeAction,pbNodeActionToTPNodeAction,tpNodeStatusToPBNodeStatus,pbNodeStatusToTPNodeStatus,pbChannelTypeToTPChannelType,encodeNodeRequest,decodeNodeRequest,encodeNodeResponse,decodeNodeResponse}; "Received node message"; "Node message is : %s"; "Node response is : %s"; "Error decoding node message"; TPThrowException/"TPException in " + " - l."; "A critical error equivalent to an exception occurred and anything happening after is undefined behaviour: %s"; "<%s - %s:l%d> "; Unhandled {trueplay channel type,node action,protobuf node action,trueplay node status,protobuf channel type} + "Protobuf encoding/decoding of node request/response failed." + "Either nRows or nCols is 0 but the other isn't."
<details><summary>Evidence (1)</summary>

- @ 0x10fbd900 — trueplay_api block

</details>

## `ttm_helper_detail`

**coverage** `partial`

The `/ttm_helper` handler detail: the time-to-music measurement helper — an engineering endpoint that times how long a play takes end-to-end, gated like the other diag surfaces.

**Technical description:**

f_100b9740: gate f_105489e4 → dumps runtime text blob (0x11095f88 table, f_100d567c copy) as text/plain

- **name:** ttm_helper_detail
<details><summary>Evidence (1)</summary>

- firmware — handler disas

</details>

## `unlock`

**coverage** `partial`

The `/unlock` engineering unlock: a challenge/response state toggle (unlock vs lock branches) with auth calls and a rate limit. When unlocked, additional diagnostic surfaces open up; production devices keep it closed.

**Technical description:**

flags {/tmp/device_unlocked_flag,/tmp/htdocs_locked,/opt/htdocs_locked}; flow {Fuse Value:,Challenge:} + form "Serial: %s / %s %s / POST {confirm textarea 11x80}"; responses {"DevUnlock Rebooting...",Success,Too Many Unlocks,Not Applicable}; muse op deviceUnlock; rate-limit "Too Many Unlocks"

- **name:** /devunlock + /mfgunlock + deviceUnlock
<details><summary>Evidence (1)</summary>

- @ 0x10efff88 — unlock block

</details>

## `update_coordinator`

**coverage** `partial`

The update coordinator: schedules firmware downloads, enforces battery/version gates, drives the `availableSoftwareUpdate` event, and coordinates the household-wide rollout. 'Update available but never installs' is usually a gate failing here.

**Technical description:**

beginUpdate/beginUpdate called./Update already started.; updateHookJob + upgradeinfo + /var/run; "Current Swgen Min downgrade version %s"; "error updating %s"; "Failed to query cloud settings"; update_coordinator actor; cert.xml+metadata.txt loads "loading %s (0x%x) took %ums"

- **name:** update coordinator
<details><summary>Evidence (1)</summary>

- @ 0x10f0526c — update coordinator region

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
- **updateitem:** <UpdateItem xmlns="urn:schemas-rinconnetworks-com:update-1-0" {Type,UpdateURL,DownloadSize,ManifestURL,Swgen,LatestSwgen,ManifestRevision}/>; flag constraint "Both MANAGED and MONITORED are set, flags are mutually exclusive"; "Ignoring update request from legacy controller"; "ignoring bogus R_AvailableSoftwareUpdate '%.512s'"; "no SOFTWARE entry in updateitem?"; "Update URL is malformed"; toggle page ignore-upnp-remove-messages + <h2>Ignore UPnP 'remove' messages</h2>/<h2>Respond to UPnP 'remove' messages</h2>; "Scheduling check for online updates in 10s"; "error in beginSoftwareUpdate hook"
- **scheduler_detail:** auto_update_scheduler.cxx status XML: <updateScheduler ...><AutoUpdate>%d</AutoUpdate><State>%s</State><Window>%02u:%02u:%02u - %02u:%02u:%02u</Window><UpgradeManager>%s</UpgradeManager><HoursPending>%u</HoursPending><ActiveDeviceList>...</ActiveDeviceList></UpdateInfo>. Update gates: 'Upcoming alarm is preventing update', 'Active device(s) preventing update', 'Trimming the window to (%d) seconds', 'Next check for update in %us'. Scheduler states incl. ST_SCHEDULED_POST_WOW, ST_SESSION_MONITOR; SessionStartLocal/SessionAttempts telemetry. Household rollout protocol: coordinator emits updateHHStatus + collects per-device updateZPResult ('RINCON_%s01400 updated to %s' / 'update failed (%d)') and updateHHResult; telemetry fields targetVersion, hardwareVersion, extendedError, pendingUpdateHours, numUpdateAttempts, elapsedSeconds, blockedUpdateReason, numZPsInHHDelta, numZPsToUpdate, numZPsDropped, numZPsWithError, targetSystemVersion, Timestamp ('Updated %d/%d devices', '%zu devices in HH (%d dropped)'). Retry: 'Retrying upgrade (%d/%d)...', 'Giving up after max upgrade attempts.', 'Launching update failed, retrying in %d seconds', 'Send updateHHstatus (%s)'. Firmware fetch path '/firmware/swgen/%u/latest/'; reports upgrade_mgr_report.json, upgrade_mgr_user_report{,_prev}.json, /tmp/upgrade_mgr_info.txt, /jffs/upgrade_sys_report{,_prev}.log; 'sending upgrade report'/'Unable to report firmware update; muse error %s (%d)' cloud reporting.
<details><summary>Evidence (6)</summary>

- @ 0x10eae506 — auto_update_scheduler.cxx
- @ 0x10fafc18 — migrationmanager.cxx
- @ 0x10e82b39 — /softwareDownload
- @ 0x10eeea5c — manifest: Setting base update url=%s
- @ 0x10f076a4 — per-device manifest row fields
- @ 0x10e838ac — v1/players/{playerId}/update/check muse route

</details>

## `upnputil`

**coverage** `partial`

Shared UPnP utilities: parsing `host:port` out of server URLs with strict port validation, mapping internal statuses to UPNP_RESULT codes while preserving the original error, and the canonical ZonePlayer UDN format. Small but load-bearing — every outbound UPnP call and device description uses it.

**Technical description:**

RparseServerLocationAndPort {"Unable to extract host, allocation too small","Port specified is too long","invalid port. Max value is 65535","unrecognized scheme in URL"}; RmapStatusToUPNPRESULT {UPNP_RESULT_CANT_CONNECT,UPNP_RESULT_GENERAL_FAILURE} + original error 0x%08x; UDN "uuid:%s::urn:schemas-upnp-org:device:ZonePlayer:1"; loopbackSecurityTokenMutex; time fmts {%04hu-%02hu-%02huT%02hu:%02hu:%02hu,%04hx%02hx%02hx%02hx%02hx%04hx%02hx%02hx%02hx%02hx%04hx,%02hu:%02hu:%02hu,%+02d:%02d}; statuses {UNPLAYABLE,MEMBER,NO-CONTENT,LAN-SWAPPABLE}; invalid chars ",\\<>;?*|+=\[\]:\""; URL escape sets {$-_.+!*'(),/,$-_.!*'(),,-_.!*()}; audio fmt "bd:%u,sr:%u,c:%u,l:%u,d:%u"; "parser ctx allocation failed"

- **name:** UPnP utility layer
<details><summary>Evidence (1)</summary>

- @ 0x10fb135c — upnputil

</details>

## `usage_metrics`

**coverage** `partial`

The usage-metrics schema: the counters and records the device reports for feature usage — submit/permission-gated like diagnostics. The fields are enumerated in the subsystem record.

**Technical description:**

<UsageMetrics><ver>2</ver> + <ucs>/<uc> records {ms_cdctrluri,ms_regctrluri,ms_croot,ms_fn} posted to submit.aspx under /HRMetrics/; cfg fetches {pollInterval.htm,wifiTxRateThreshold.htm,wifiLatencyThreshold.htm}?hhid=%s; wifi counters {ath%u,rxPrr,beacon_flags,datarx,secdrp,roaming,trf2g,trf5g,trg2g,trg5g,tbtm2g,tbtm5g,rfail,q*_nbf,q*_cmp,q*_bpk,q*_ltc,hwstat,rxbhs,rxhang,rxfMax,rxcMax,txfMax,bprowar,gtkfm,gtkfc,nogcfc,links}; per-AP "MAC/rssiF/rssiT/PktMin/PER" + "BSSID/perAP/rssiAP"; "Audio-drop ... include with future periodic submission" + rate-limit; WD daily write; CPUTempHist <temperatures>; unlocked/hw_warn/hw_fault flags; usageDataSharing optin

- **name:** usagemetrics — periodic health report
<details><summary>Evidence (1)</summary>

- @ 0x10f0c724 — usagemetrics block

</details>

## `user_update`

**coverage** `partial`

The user-initiated update flow: the 'check for updates' path vs the coordinator's scheduled path — same manifest/download machinery, different trigger and UX semantics.

**Technical description:**

flow {"Running user-initiated HH update",no updates available,manifest download failed,no devices need updating,checkDevicesToUpdate failed,launchUpdate failed}; reports upgrade_mgr_user_report.json + _prev.json + /tmp/upgrade_mgr_info.txt; "report has more devices than the maximum ... omitted from the householdUpdateStatus event"; "Unknown upgrade client state"; "report consumed"/"Timed out polling"; app/run

- **name:** UserUpdateScheduler — user-initiated HH update
<details><summary>Evidence (1)</summary>

- @ 0x10e95664 — user_update block

</details>

## `vli_ctrl`

**coverage** `partial`

The VLI control interface (`media_player_vli_ctrl`): the event grammar, MIME whitelist, DIDL extractor for VLI items, and URI→service map — the control plane a VLI source uses to talk to the group.

**Technical description:**

types {AirPlay,bluetooth/Bluetooth,tvproxy/TV Proxy} + "StartSession for unusable/unknown type"; scoped scopeVliCtrl/VliCtrlIx; protocolInfo x-sonos-vli:*:audio:*; cookie+fromSender tracking "%s:%d vliType %s cookie: %d"; "waiting for tx flags failed"/"completion signal timed out %#x %#x" + "timed out!!!!!!!"; "VLIGroupIDs cannot contain commas"

- **name:** VliCtrl — VLI transport ctrl interface
- **events:** `VliTransportAction(action)`, `AvtHaltActionEvent(action,vliType,cookie,fromSender)`, `AvtVliActionEvent`, `VolumeSetActionEvent(vol,mute,from_sonos,vligrouping)`, `GroupVolumeSetActionEvent(vol,mute,from_sonos,vligrouping)`, `VolumeChangedEvent(vli source,vol,mute,vligrouping)`, `VliPropertiesChangedEvent(name\|md\|mode,cookie)`
<details><summary>Evidence (1)</summary>

- @ 0x10ecc104 — VliCtrl block

</details>

## `voice_skill`

**coverage** `partial`

The voice-assistant integration bits: skill/voice-account vocabulary, ALEXA_TTS/audio-clip types, and the voice-related feature flags. The parts of Alexa/GA on-device presence that live inside anacapad.

**Technical description:**

{hasToken,skillStage,skillAuthCodeUS,skillAuthCodeEU,skillAuthCodeFE,skillRedirectUrl,authCode,redirectUrl,timeoutSeconds}

- **name:** voice-skill onboarding fields
<details><summary>Evidence (1)</summary>

- @ 0x10fae1d8 — voice skill

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

## `watchdog`

**coverage** `partial`

The watchdog subsystem: `/dev/chk` device, `/watchdog.log` + `/watchdog.dmesg` captures, a health-check thread on a configurable frequency, a client registration API (named clients with callbacks — 'client must have a name', 'already registered'), manual/force triggers, and `/sbin/reboot` on unresponsive. This is the last-resort self-heal.

**Technical description:**

device /dev/chk; files {/watchdog.log,/watchdog.dmesg,timeinfo}; {"Watchdog not started","Watchdog already created","Creating watchdog","No watchdog to destroy","Destroying watchdog","Invalid watchdog health check frequency","Watchdog constructed with %u seconds frequency","trigger called with status %d"}; "WATCHDOG: %s manual trigger (UTC %s)"/"unresponsive! (UTC %s)"; /sbin/reboot + return code; /watchdogcrash; "Performing health check"/"Waiting for next health check"; watchdog.poll; "In watchdog thread, performing health check"/"Exiting watchdog thread"; forceTrigger; client API {"client %s not found","Unregistered watchdog client %s","client must have a name","health check callback must be non-null","client %s already registered","Registered watchdog client %s"}; MTD /dev/mtd/0

- **name:** watchdog driver interface
<details><summary>Evidence (1)</summary>

- @ 0x10fe4fe4 — watchdog

</details>

## `wmp_provider`

**coverage** `partial`

The Windows Media Player content provider: NSS browse/search over `/WMPNSSv`, capability flags (SCPA, SCPB, SCPI), a search grammar (`upnp:class derivedfrom "object.item.audioItem"`), container-class specs (musicArtist, musicAlbum, musicGenre, playlistContainer), and sort/filter fields including Microsoft extensions. This is legacy DLNA-library browsing support.

**Technical description:**

WMP NSS /WMPNSSv browse/search; caps {SCPA,SCPB,SCPI}; search grammar 'upnp:class derivedfrom "object.item.audioItem" and @refID exists false' + container class specs {person.musicArtist,album.musicAlbum,genre.musicGenre,playlistContainer}; sort/filter "+upnp:album,+upnp:originalTrackNumber,+dc:title" + microsoft:{artistAlbumArtist,artistPerformer,authorComposer} + upnp:genre + "1+upnp:originalTrackNumber"; field set dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber; rincon md ns urn:schemas-rinconnetworks-com:metadata-1-0/|otherArtist; albumArt via %s?albumArt=true and /getaa?m=1&u=%s; "URI already has a serial number"/"not enough room for account ID"

- **name:** sonos_cprovider — WMP content provider
<details><summary>Evidence (1)</summary>

- @ 0x10f0dbf8 — cprovider block

</details>

## `ws_client`

**coverage** `partial`

The outbound WebSocket client used for the lechmere/cloud channel: performs the Upgrade handshake (Location, Sec-WebSocket-Accept, Sec-WebSocket-Extensions), negotiates per-message deflate only during open (an unsolicited deflate offer fails the connection), retries openSession, generates nonces, and reports `disconnectedReason` plus close codes. LoadBalancerHost/WebSocket fields shape where it connects.

**Technical description:**

client handshake {Location,Upgrade: websocket,Connection: Upgrade,Sec-WebSocket-Accept,Sec-WebSocket-Extensions}; "failing connection due to unsolicited per msg deflate"; per-msg deflate only before open; openSession retry; nonce gen/encode; {"disconnectedReason":"%s"}; close codes on close frame; LoadBalancerHost/WebsocketServerHost; reasons {NEW_IP,BLUETOOTH,POWERED_OFF,UPGRADE,NEW_SSID,SLEEPING,RECONNECT}; threads wsc_mtx/wsc_smtx/wsc_cond

- **name:** websocketclient — outbound WS (lechmere/cloud)
- **status_schema:** <State>Open\|Closed</State><MillisecondsOpen\|Closed><PerMsgDeflate><TotalUncompressedKBytesSent><TotalCompressedKBytesSent><TotalKBytesSent><TotalUncompressedKBytesReceived><TotalCompressedKBytesDecompressed><TotalKBytesReceived><OpenCount><CloseCount><ConsecutiveFailures><UnackedPings><LastPingTime><PingTimeWeightedAverage><Messages><LastHttpStatus><LastWebSocketCode>
<details><summary>Evidence (1)</summary>

- @ 0x10f0d018 — websocketclient block

</details>

## `ws_server`

**coverage** `partial`

**Technical description:**

websocketserver.cxx serves a local RFC6455 endpoint at /api/v1/websocket (route literal '/websocket/api' also present) for controller/UI clients. Server-side handshake headers sec-websocket-key + sec-websocket-version + 'Upgrade: websocket'; per-message deflate negotiated ('could not initialize per message deflate on ws client'); opcodes emitted as websocket(data|ping|pong|close|cont); 'Websocket protocol error'/'Write to websocket failed. opcode: %u, len: %zu'/'Connection already closed'. Status XML: <WebsocketRegistration>%s (%s)</WebsocketRegistration> or empty <WebsocketRegistration/>; connection cap telemetry <TruncatedConnectionList maxwebsockets="%zu" connections="%zu"/>. Internal state key ws_per_msg_deflate_run_state; event field 'websocketUrl' in the name table.

- **name:** websocketserver — local /api/v1/websocket endpoint
<details><summary>Evidence (1)</summary>

- @ 0x10f01b4c — websocketserver.cxx block

</details>

## `zgt_errors`

**coverage** `partial`

The ZGT error paths: `ReportUnresponsiveDevice` handling with source address logging, and `GetZoneGroupAttributes` request validation failures (no valid UUID, invalid TServer, invalid TRequest). These are the error strings a malformed topology request produces.

**Technical description:**

"Handling ReportUnresponsiveDevice %s/%s from %s:%hu"; GetZoneGroupAttributes {"No valid UUID in request server","TServer is not valid for request","TRequest is invalid in the control server"}

- **name:** ZGT error paths
<details><summary>Evidence (1)</summary>

- @ 0x10f1143c — zgt error paths

</details>

## `zones_mgr`

**coverage** `partial`

The zone lifecycle manager: zone-definition changes fire ZonesDefinitionsChangedEvent, muse exposes `getZoneDefinition` lookups, and transitions on primary/secondary are logged — including failures on the primary that leave a zone half-formed. Channel-map-set (cms) updates flow from primary to secondary to keep stereo/surround mappings consistent.

**Technical description:**

events {ZoneMemberSettingsChangedEvt,ZonesDefinitionsChangedEvent}; muse ops {museGetZoneDefinition "found zone \[%s\]"}; transitions {"zone transition on secondary/primary: zoneId %s","zone transition failed on primary"}; cms (channel-map-set) {"cms init from %s","cms update from pri: %s","cms update from sec: %s = %s + %s","zoneDef %s inconsistent with cms %s","can't construct channelMapSet"}; file <File name="activeZones">; ops {adding/removing player,joinZone id+flatChannelMapSet,unjoinZone,activateZone,deactivateZone,updateActiveZone,sendUpdateZoneMemberSettingsCmd}; guards {"primary change not supported for HT","update with offline primary not supported for HT","update only allows add or remove, not both","can't update both name and channelMapSet","Zone contains incompatible protocol versions","zone is not active","zone id not found","zone def not found","invalid activeZone","invalid channelMapSet","invalid flatChannelMap","invalid zone name","invalid name:","no name","secondary not reachable","more zones active than RMuseActiveZoneList can hold"}; "Legacy zone exists on %s"; "primary unavailable: sending Remove ops to secondaries"; "re-activate the current zone"; "updating ActiveZone: %s -> %s"/"primary change: %s -> %s"/"offline primary: %s -> %s"

- **name:** RZonesManager — zone lifecycle FSM
<details><summary>Evidence (1)</summary>

- @ 0x10e95d24 — zones_mgr block

</details>

## `zones_storage`

**coverage** `partial`

The zone-definition store: name/id/channelMapSet records with a max-zone cap, create/update/remove ops (removal is blocked while the zone is active), and replication of offered files with rename-into-place semantics. This is the persistence behind stereo pairs and home-theater bonds surviving reboots.

**Technical description:**

zone defs {name,id,channelMapSet} + "reached maximum zone definitions"/"too many zones defined in the config file \[max=%d\]" + "zone def full: %s removed"; ops {create,update id,remove (active-guard "zone currently active")}; replication {"received replicated file","failed to rename offered replicated file","failed to load offered replicated file","ignoring replicated file: incompatible schema"}; JSON load errors {missing value,zones data array,root not object,incorrect schema \[%d != %d\],parsing offset,open errno} + RapidJSON vocab; gainTrimDB remote apply; forwarding {activateZone,updateActiveZone,joinZone,updateZoneMemberSettings cmd to %s} + "primary %s not found" + "output buffer full"; file format: {schemaVersion, zones data array} logged under 'zonesstorage'; setup path: 'loading saved zones during setup succeeded'/'saved zones successfully migrated during setup'/'creating new zones config file'; remote settings change: gainTrimDB \[%.2f\] on %s

- **name:** zones_storage — zone-def persistence
<details><summary>Evidence (1)</summary>

- @ 0x10e96cd8 — zones_storage block

</details>

## `zpinfo_dpimpl`

**coverage** `partial`

The ZPInfo diagnostic surface from dp_impl: the `<ZPInfo>` schema (device attrs, network info, support fields) plus `/enetports`/ethportstatistics and the shutdown/idle-reason enum — the dp layer's contribution to `/status`.

**Technical description:**

vars {WirelessMode,ConnectionType,ChannelFreq,BehindWifiExtender,WifiEnabled,EthLink,SettingsReplicationState,SecureRegState,IsIdle,MoreInfo}; events {LineInStateChangedEvent,ReplicatedSettingsChangedEvent}; idle FSM "idle state is %sidle, changing to %sidle" + "Reporting device %sidle"; actors {dpimpl,RDPZoneImpl,dpZoneImpl,dpUpdateIdleState}; /dev/audioctl + U-Boot 17.2.7 + "OTP: %.32s"; KVPair parse; battery {RawBattPct,BattPct,BattChg,BattTmp,BtSrcName}

- **name:** ZPInfo/dpimpl fields
<details><summary>Evidence (1)</summary>

- @ 0x10ef31cc — dpimpl region

</details>

## `account_actions`

**coverage** `strong`

The DeviceProperties account-management actions: `AddAccountX`, `AddOAuthAccountX`, `EditAccountPasswordX`, `RemoveAccount`, credential refresh, and post-update tasks, with args covering OAuth codes, tokens, md5s, and web codes. This is how music-service accounts get attached to a household — the SOAP surface the app uses during service signup.

**Technical description:**

args {VariableName,StringValue,AccountUDN,AccountNickname,AccountType,WebCode,AccountPassword,NewAccountPassword,NewAccountMd,AccountToken,AccountKey,OAuthDeviceID,AuthorizationCode,RedirectURI,UserIdHashCode,AccountTier,AccountUID,NewAccountID,NewAccountUDN,RDMValue}; actions {AddAccountX,AddOAuthAccountX,DoPostUpdateTasks,EditAccountMd,EditAccountPasswordX,EnableRDM,GetRDM,GetString,GetWebCode,RefreshAccountCredentialsX,RemoveAccount,ReplaceAccountX,SetAccountNicknameX,SetString}

- **name:** DeviceProperties account actions
<details><summary>Evidence (1)</summary>

- @ 0x10f111a4 — account action vocab

</details>

## `accounts_replication`

**coverage** `strong`

The accounts manager's internal op set: adding accounts by credentials, OAuth token, OAuth code, or direct-control; modifying and migrating entries; reporting. Accounts replicate across the household with vector clocks and tombstones, so a deletion on one player propagates correctly instead of resurrecting.

**Technical description:**

ops {markAccountsForPushLocked,setAndUpdatePreferredSerialNum,addAccountWithUserCredentials,int_addAccountWithOAuthToken,addPreinstalledService,addAccountWithOAuthToken,addAccountWithOAuthCode,addAccountForOAuthDirectControl,modifyAccount,migrateAccountsToSMAPI,migrateAccountSID,migrateAccountToOAuth,updateAccountUserInfo,reportAllActiveAccounts,ReportSvcTimedJob,matchImpl,pullFromReplicationService,pushToReplicationService,getPreferredAccount}; zpam: %s,%d,%d,%u; file accounts.xml; outcomes {retry,conflicted,updated,added,deleted,invalidCloud,invalidCloudSerial,invalidCloudReason,vcCloud}; validation {invalid service ID,missing service uuid,missing account type,missing metadata,missing cloud vector clock,missing serial number,missing account ID,missing household vector clock,"Discarding invalid cloud record: %s \[uuid=%s, hh=%s, cloud=%s\]",exceeded max deleted accounts}; guest migration {"Existing account is not a guest account, migrateGuestAccount failing","Bad guest migration: UDN = %s - UserIDHash = %s","Migrated %s replication account","Migrated tombstoned %s replication account"}; "End direct control context UUID: %s"; "Invalid replication operation"; "no preferred account set"; "Failed to download manifest file (%s) for service %u"; getDeviceAuthToken failed

- **name:** accounts manager + replication
- **detail:** matching {performsSMAPIAccountMatching,"Account matched g=%d,sn=%u,h=%s","New account matched to existing guest account with SN=%u, Hash=%s"}; DC outcomes {login failed,no account,stale account,unsupported service,unexpected,Could not resolve serviceId}; corruption {emptyUUID,dupUUID,caller,accountCorruption,"Error reading file while detecting stale anonymous/corrupted accounts","Found corrupted accounts"}; guest {"Link code required to add guest account","Added guest account with SN=%u","Updating guest account nickname","addAccount failed: guest upgrade not allowed via reauth.","account already exists on household"}; maintenance {restore,addAccount,migrate,"Removed account with corrupted type. SN=%d, SID=%u, UID=%u",corruptedAccountRemoval,"removing duplicate account with SID",duplicateAccountRemoval,"Removed account multiple",numAccounts}; migrations {"Migrated Pandora built-in (%d,%d->%d)",pre-cloud,anonymous,"Migrated Account with SID %u. (%u,%u->%u)",legacyTuneInReplaced,"UserIdHash \[%s\] already exists and will not be updated for SN=%u"}; replication status XML <AccountsInfo><Replication><ReplicationOperation>%s\|n/a</ReplicationOperation><ReplicationResult>%d\|n/a</ReplicationResult></Replication><ReplicationPlayer>%s</ReplicationPlayer><ReplicationTime>%Y-%m-%d %H:%M:%S</ReplicationTime></AccountsInfo>; outcomes {"Pull successful","Corrupted accounts not updated","Pull rescheduled in %lld","Push successful","Push rescheduled in %lld"}; "Rejected version %u, schema %u from %s"; "replicating accounts file from %s"; spotifyTransferStartDirectControlEx; R_SvcAccounts
<details><summary>Evidence (1)</summary>

- @ 0x10eaba78 — accounts replication

</details>

## `acoustic_metrics`

**coverage** `strong`

The schema for positioning's acoustic measurements: TDOAs, correlation peaks, threshold/leading-edge energy terms, spectral similarity, noise/signal RMS, and confidence scores. This is the math under Trueroom-style room estimation — the raw numbers the estimator consumes to decide where a speaker sits.

**Technical description:**

{tdoas,scrollbackAttempt,confidence,correlationMaxValue,thresholdPeakMaxValue,leadingEdgeSpectralSimilarity,leadingEdgePriorEnergy,leadingEdgePosteriorEnergy,leadingEdgeEnergyCoherence,maxPeakEnergyCoherence,maxPeakPosteriorEnergy,noiseRms,signalRms,normalisedResiduals,peakMagnitudeRatios,leadingEdgePercentageEnergy,f1SpectralSimilarity,f2SpectralSimilarity,leadingEdgeKurtosis,leadingEdgeRiseTime,normalisedAggregateResidual,decayConstant,numMeasurements,numRetries,orchestrator,debugData,tvUsec,errorTime,expirationTime}

- **name:** positioning acoustic-metric schema
<details><summary>Evidence (1)</summary>

- @ 0x10fadf24 — acoustic metrics

</details>

## `alarm_clock`

**coverage** `?`

The AlarmClock service: alarms + sleep timers over UPnP, SQLite persistence (`timers` table), suspend-aware remaining-time serialization, and the AHA/alarm op vocabulary for autoplay interactions.

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
## `album_art`

**coverage** `?`

Album artwork handling: fetch, cache, resize, and serve — backing the `<albumArtURI>` fields and the app's artwork grid.

- **worker:** "album URI dereferenced to: %s"; "Fetching album art for %s: %s"; "invoking vliStreamImage on %s %u %u %u %s"; "vliStreamImage failed"
## `amp_manager`

**coverage** `strong`

The amplifier power manager that decides when the output stages physically turn on, mute, or drop to a low-power rail. It listens for volume and play-state changes per zone, can pre-emptively warm the amp so the first samples aren't clipped, and schedules delayed power-off when idle. Explains the small delay before audio emerges after a long silence, and the relay click some models make when the amp rail switches.

**Technical description:**

AmplifierPowerStateChangedEvent; transitions {"zone %d volume %f -> %f","zone %d is playing %d -> %d"}; notify ops {manageAmpStateLocked_notifyVolume,notifyPlayState,notifyPlayingUnmuteableSource_p/np,notifyOutputFixed,resetPreemptiveTurnOn,notifyPreemptiveTurnOn}; preemptive "zone %zu preemptive turn on %d -> 0/%d"; power {"entered ampPowerOnLocked() - %dms","ignored unsupported amp command: power/mute/hipower (%d)","failed to power on/unmute/mute/power off amps (%d)","failed to transition to high/low power rail (%d)","left ampPowerOnLocked()","requested amp power off"}; off-decision "roff:%d canoff:%d ofx:%d nzvplay:%d pre:%d unm:%d"; "scheduling off in %d sec"; {ampMgr,RAmpManager,ampPowerOnLocked,ampPowerOffLocked,"failed to unmute amps to clear fault","ampState %d -> %d",notifyAmpState,"init failed (%d)"}

- **name:** ampMgr power manager
<details><summary>Evidence (1)</summary>

- @ 0x10fe5434 — ampMgr

</details>

## `ap_layer`

**coverage** `strong`

The Spotify Connect access-point layer: resolves `apresolve.spotify.com`, opens a TLS socket to an access point, exchanges a Hello/ApWelcome handshake, and carries everything afterward as typed TLV packets (guarded at 16 KiB). This is the wire protocol behind every `spotify:` URI playback and the hermes event channels. Client-facing only through Spotify Connect semantics — a client can't speak AP TLV directly; it drives this layer indirectly via the `spotify:` media URIs.

**Technical description:**

endpoints {apresolve.spotify.com,ap.spotify.com,local apresolve,fallback}; handshake {"Connecting (%s) %s:%d timeout: %d sec","Sending Hello message to AP","Writing apresolve request","logging in, type %d sz %d user %s","Failed to decode ApWelcome: %s","!"ApWelcome failed""}; TLV {"Failed reading TLV header %d %d/7 oserr %d","Packet from AP is too large! Type: %d / Size: %d","ap->packet_size <= 16384","Skipped %s(%d) (%d > %d)","Corrupted packet, invalid MAC"}; connectivity {"Permanent connection error: %d","Regained network connectivity, reconnecting","Lost network connectivity, disconnecting","Connectivity went from one type to another (%d -> %d), populating disconnected sockets array","Too long without response from server","SpPumpEvents() is called too slowly: %d ms for 100 calls","ap os error code: %d"}

- **name:** AP (access point) connection layer
<details><summary>Evidence (1)</summary>

- @ 0x10fd7bc8 — AP layer

</details>

## `areas`

**coverage** `strong`

The Areas manager — Sonos's name for rooms as a durable concept: `areas.json` persistence with atomic rename-on-write, schema-version checks, a built-in 'Everywhere' area, and ID-distinctness constraints. When a room survives reboots with its name and settings intact, this is the store doing it.

**Technical description:**

areas.json persistence + atomic-write cycle {accepted file load,rename accepted→store,rename failed paths,saving failed,setup load/save}; schema versioning 'Loaded areas schema version (%d) differs from local version (%d)'; builtin 'Everywhere' + GUID 7055133f-81e7-45e6-ba70-8803966c7185; constraints {'Area IDs must be distinct','Maximum area limit (%d) reached','Cannot update read-only area','Set of players in area (array playerIds)'}; vars {areaId,areasMgr,artfetch}

- **name:** Areas manager
<details><summary>Evidence (1)</summary>

- @ 0x10ead0bc — areas block

</details>

## `async_stream`

**coverage** `strong`

The shared buffered-stream primitive used under almost every audio path: a segmented, seekable buffer that pauses/resumes at stream positions, reaps played blocks, and supports a rate-limited multi-threaded reader. When you see tracks that resume mid-buffer or seek without re-downloading, this is the machinery. Not a client surface itself, but its segment accounting explains underrun and buffer-ahead log messages.

**Technical description:**

init 'buffersize=%zu; multiThread=%u; ratelimit=%zu us'; segment model {'Data segment follows segment with EOF!','Tried to delete segment with I/O in progress','SegmentTable reallocated to %zu entries','Unexpected: I/O to block %zu; not last block in segment'}; positions {'Pause; framed to stream pos %zu; resume at pos at %zu; reaped to pos %zu','Played to stream pos %zu. Reaped %zu blocks of played data in track %5.5s','Started reaping played data. Lose fast scrubbing backwards'}; alloc {'Alloc satisfied by track transition','Alloc satisfied by deleting played data','Alloc not satisified, returning anyway','Unable to satisfy allocation request! Played to pos','Satisfed allocation request but should not have required this!'}; CDN fallback {'File is in memory!','>>>Start reading at offset %zu ; streamPos %zu','>>>Sync read from CDN at offset %zu','Opportunistic sync read from CDN','readSync unable to allocate a buffer; transport error will ensue','>>>>readSync: read %zu blocks in %lld ms'}; rates {'Playing at ~%zu KB/sec. Blocks read this series: %zu','Avg read rate: %zuKB/sec; min read rate','download time %zu ms','Stop async reading. Filled %zu buffers; %zu bytes in %zu ms. (%zu KB/sec)'}; tracking {'Socket has: %zu bytes (%zu blocks and %zu bytes). CHSRC ms ahead: %ld','new seek based PB session','Restart current track','start streaming track %d \[%5.5s\]. Filesize=%zu, startPos=%zu'}; actors {asyncstrm,asyncstrmio,asyncstreamiomgr,asyncBufferedStream,mrrkbs,arrkbs}; 'Atom Table Full'

- **name:** RAsyncBufferedStream internals
<details><summary>Evidence (1)</summary>

- @ 0x10ead488 — asyncstrm block

</details>

## `audio_in`

**coverage** `?`

The AudioIn service: physical line-in/optical input control — the Unpaired*/Autoplay*/LineIn* state variables, source format selection, and the group-distribution hooks (see audioin_groups).

- **ai_impl:** group model {addGroup coord,demoMode; "no room available for coordinator"; StopTransmissionToGroup by coord; "number of groups %zu remote %zu"}; URI x-rincon-stream:; encoding modes {UNCOMPRESSED,COMPRESSED,v-spdif} + "Running demo mode forcing uncompressed"; artfetch thread
## `autoplay`

**coverage** `?`

Autoplay source injection: when a line-in/TV/AirPlay/BT source goes live, configured target zones start playing it — with volume override and zone-inclusion params.

- **engine:** MpAutoPlay_: airplay {include zones,vol,useVol,includeZones}; AirplayIncludeGroupedEvt; AutoStop on unhandled URI; linein URIs object.item.audioItem.linein.{homeTheater,airplay,bluetooth}; "lonely local line-in autoplay %s"; failure modes "no autoplay target"/"couldn't determine coordinator"/"couldn't determine AVT control URI of coordinator"/"couldn't determine control URI of zone"; skip "invisible/node proto incompatible ZP"; "for controlURI \[%s\] for coordinator \[%s\]. programURI \[%s\]. %d - %d"; vliType-driven
## `av_transport`

**coverage** `?`

The AVTransport UPnP service — playback control core: SetAVTransportURI, Play/Pause/Stop/Seek, Next/Previous, play modes, crossfade, and the LastChange event stream. The service record holds the canonical action/argument table.

- **avt_jobs:** `ChangeTransportSettings`, `avt_play`, `onEvent`, `alarmDurationTimer`, `backupQueueCleanup`, `pollRadioShowMD`, `preemptiveAmp`
- **secondary_guards:** improper-call guards on secondary ZPs {"AVTransportURI cannot be set to non-group URI on secondary ZPs","BecomeCoordinatorOfStandaloneGroup improperly called on secondary ZP","BecomeGroupCoordinator improperly called","BecomeGroupCoordinatorAndSource improperly called"}
- **uris_ht:** x-sonos-htastream:%s HT audio stream + demo line-in uri + "Demo mode update available (%s)" + x-rincon-buzzer:1 custom alarm + x-rincon-stream:%s; spdif source
- **internal_ops:** CQ/playback ops {internalStartCloudQueue,internalRefreshCloudQueue,pauseTransition,commitReplaceWhilePlaying,prepareToBeDelegationTarget,setStateSSGoal,internalRateItem,notifyCQError,internalSkipToItem,internalCQSkipToFirstTrack,int_resumeFromPauseWhenPausedAtEndEnabled,int_internalSuspend,switchState,loadCloudQueueFromReq,handleWorkRequestWhileRunning/Stopped,queueCompletionRoutine,pauseRoutine,stopRoutine,notifyFrame,runQueue,internalNotifyTransportError}
## `avt_impl`

**coverage** `strong`

The avt_impl layer under the AVTransport service: transport-source selection (CHSRC for grouped audio, HTAudio for TV input), session bookkeeping in `avt.txt` with backup/restore and read/write locks, and the RAVTMediaRenderer actor. This is where URI semantics meet the audio engine — e.g., which `x-sonos-*:` scheme maps to which physical path.

**Technical description:**

TX selection {'Using HTAudio TV TX for GM %s','Using CHSRC TX for GM %s','Why are we telling HTAP to play %s','setting tvInputFormat %08x',iSCS removeClock/installClock}; persistence avt.txt + avt-backup-restore + locks {rwlW_avt,rwlR_avt} + actor RAVTMediaRenderer/scopeAvt; VLI ops {ChangeTransportSettings playing/stopping/deactivating local VLI (txs),endVLISession,onTXSettingsWillChange→VLI::StopTransmission}; session eviction 'sessionError MUSE_ERROR_SESSION_EVICTED for %s: %s' + evict; sleep timer {'sleep timer fired (r:%ld)','sleep timer set (d:%d r:%d p:%d c:%d)','sleep timer reached (p:%d)','Failed to configure the sleep timer','Invalid duration provided'}; amp preempt {'amp already on','prem-amp turn on at %d.%06d; start up time: %dms','could not preemptively turn on the amp'}; queue events {tracksAdded,qLength,trackIndex,enqueueEvent,'Add to queue %u; URI/MD'}; playmode warnings {'vli play modes ignored (enable/disable flags)','play modes ignored (current/desired)'}; operational override {'changing Operational Override mask from 0x%x to 0x%x','setAVT aborted because operation is overridden'}; seek units {TRACK_NR seek track,REL_TIME %lld.%06lld seek time,TIME_DELTA %lld.%06lld,00:00:00,previous}; settings {change crossfade,change play mode,capChange,groupSize,curCaps,requiredCaps,musicPausedMS}; ret codes {stopRet,seekToTrackRet,seekToTimeRet,playRet,pauseRet,endpointSwitch,episode}

- **name:** AVTransport implementation (avt_impl)
- **session_fsm:** session lifecycle {end direct control,end VLI,"Received play while waiting to be resumed","resume muse session",Destroyed,Preserved,"%s session %s (playing=%s)","Leaving Muse session",leave,disconnect,"Received play for non-muse source","end VLI session","cancel tear down; user started new session"}; session errors {"There is no session on this player.","The sessionId does not match the session on this player.","Internal error logging in to spotify connect"}; CQ suspend {"suspending cloud queue during snooze","suspending cloud queue","suspending cloud queue during alarm"}; muse cmds {"pushing tracks from muse command","request activated muse session","server deferred playback","waiting for content from server","unexpected refresh request","Refreshing AVT expired content","muse session state = %d","recover from cloud queue error"}; chime restore {"restoring after pause chime: ret=%d ar=%d wrca=%d pavt=%d","restoring after stop chime: ..."}; CQ window {"Full itemWindow from Cloud Queue API must be passed to skipToItemWithWindow","Target itemId is not found in the provided window","skipToItem pause"}; playOnCompletion {"ignore %s playOnCompletion; chsrc is already playing","deferred play on completion was canceled","Internal error processing playOnCompletion","Playback attempt failed. Reason: %s","dispatch play","timed job play","alarm timer reached"}; endpoint {"Endpoint switch due to capability change. Current groupcaps: 0x%08x, required: 0x%08x"}; events {"processing PlaybackStateChangedEvent: playstate=%d zoneIx=%d","processing DeviceHasGoneEvent","processing LocalIpChangedEvent","avt halt evt action"}; coordinator {"Became Coordinator of Standalone Group","internalBCOSG(): deactivating local VLI/removeClock"}; constraints {"exceeded internal set AVT URI limit","Line-In playback is not permitted","Invalid AVT media renderer state.","rating.type is not recognized","server rejected request","cloud queue server does not supporting rating","itemId not found","rating is only implemented for cloud queue","Specified seek target exceeds content size","Failed to begin queue operation","Failed to enqueue track"}; TuneIn "Successfully converted TuneIn while settingAVT. old: %s, new: %s"; metadata {TYPE=SNG,TITLE,object.item.audioItem.audioBroadcast,<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">,r:tags,r:tiid,station,"Station information lookup error","Music service lookup error","Skipped container info retrevial.","Failed to get container info"}; "Found %s. Discarding stream metadata"; "Error parsing delegated source area ids, clearing"; isShuffled; spotifyTransferLoadContent
- **coordinator:** BGC FSM {BecomeCoordinatorOfStandaloneGroup,"Attempting to become standalone based on VLI state",BecomeGroupCoordinator,"group member becoming group coordinator",BecomeGroupCoordinatorAndSource{bCloningGCState,bSourceGCClearedContent},"not restoring source state","resetting sinks","stop CHSNK to avoid seamless delegation for adaptive bitrate stream","contacting remote chsnks","configuring local chsnk","Became Group Coordinator and Source","Refreshing expired content during delegation","Resetting programmed radio station during clone","failed (%d), now becoming standalone","asked to become coordinator of non-member group. Clone (%d)"}; VLI snapshot {"using local VLI txs","using VLI State Snapshot","cannot use VLISS for VLI type \[%u\]"}; origin-time {"converted remote time origin, %d.%06d, to local time, %d.%06d","unable to convert remote time origin"}; member moves {"Attempting to move player %s to group coordinated by %s","failed with error %d, rejoin status %d","Attempting to move local player","Attempting move group ... based on VLI state"}; unlink {"secondary clearing avt: %s, gone uuid: %s, primary uuid: %s","unlink from gc (sec)","unlink from gc","failed to copy local GC state to remote GC"}; delegation {"delegation target %s not primary","will try to delegate to %s","DelegateGroupCoordinationTo failed %d","cannot delegate to oneself"}; HT src {"Requested home theater audio source not valid","UUID %s not part of group","remote UUID %s does not support ht audio","UUID %s does not support ht audio","Not playing TV proxy VLI","%s is not capable of home theater playback"}; line-in {"line in disconnected","Clearing AudioInput session on line-in disconnect","player not found","player does not have line-in","BGC line-in: could not resolve source UUID from txs or uri","source %s would not start xmission","transitioning back to playing"}; queue URIs {x-rincon-queue:%s#%u,x-rincon-queue:%s#%s,x-rincon-queue:%s#0,x-rincon-buzzer:%u:o,x-rincon-stream:%s:%s}; errors {"set AVT transport failed","streamUrl has unsupported scheme","Internal error setting URI","Internal error activating shared queue","Unrecognized action value","Internal Error committing media to queue","No tracks added to queue","Internal Error adding media to queue","Tracks added to queue are non-playable tracks","Track object is missing","Internal error setting URI"}; CQ ops {"activate cloud queue %s","loadCloudQueue stop","Full itemWindow from the Cloud Queue API must be passed to loadCloudQueueWithWindow"}; restart policy {"Playback halt must be respected. NOT attempting to restart.","Fatal playback error. NOT attempting to restart.","Nothing played. NOT attempting to restart.","Multiple restart attempts have failed. NOT attempting to restart again.","Playback stopped unexpectedly. Attempting to restart."}; "AVT Context ID mismatch in play end event"; autoplay {"using VLI to autoplay Spotify SMAPI URI: %s (%d)","autoplay Spotify using VLI","ProgramURI changed to: %s","autoplaying %d %s","autoplay failed to get the avtc URI","autoplay failed to start playback","Failure loading autoplay %s (alarm: %d, buzzer fallback: %d)... not playing."}; playEnd "playEnd: ar=%d sr=%d bee=%d avt=%s" + "Business schedule (i.e. alarm) ended" + "restoring after end chime: wrca=%d pavt=%d"
- **restore:** /avt.txt + "Restoring AVT" + "AVT restore timeout" + "AVT modified, unable to reset to prior setting" + "Didn't Restore AVT because it's a group coordinated by a member of our bond" + "Restored AVT from file" + "Issue restoring AVT" + "Restored/Issue restoring play mode %s" + "Restored/Issue restoring crossfade" + "Restored/Issue restoring shared TQ play mode %s" + "bad policy input"; op-override {"preventing autoplay because operation is overridden","preventing alarm because operation is overridden"}; linked rooms {"Found %zu linked rooms during StartAutoplay%s","Found %zu linked rooms during RunAlarm%s",linked,zpAlarm,fb_buzz}; forwarding "forwarded %s to %s, rc=%d" + ": BCOSG"; createSession {"invalid app ID","Invalid account id","Could not find accountId","sum of appId/appContext is too large","createSession stop","deleted uri",create}
- **actions:** extended actions {AddMultipleURIsToQueue,AddURIToQueue,AddURIToSavedQueue,BackupQueue,BecomeGroupCoordinatorAndSource,ChangeCoordinator,ChangeTransportSettings,ConfigureSleepTimer,CreateSavedQueue,DelegateGroupCoordinationTo,EndDirectControlSession,GetCrossfadeMode,GetCurrentTransportActions,GetDeviceCapabilities,GetMediaInfo,GetPositionInfo,GetRemainingSleepTimerDuration,GetRunningAlarmProperties,GetTransportInfo,GetTransportSettings,NotifyDeletedURI,Previous,RemoveAllTracksFromQueue,RemoveTrackFromQueue,RemoveTrackRangeFromQueue,ReorderTracksInQueue,ReorderTracksInSavedQueue,RunAlarm,SaveQueue,SetCrossfadeMode,SetNextAVTransportURI,SetPlayMode,SnoozeAlarm,StartAutoplay,X_DLNA_SeekTrackNr}; args {DelegatedGroupCoordinatorID,NewGroupID,StartingIndex,InsertBefore,DeletedURI,NewPlayMode,NewTransportSettings,CurrentAVTransportURI,AssignedObjectID,NewSleepTimerDuration,CurrentCoordinator,CurrentGroupID,OtherMembers,SleepTimerState,AlarmState,StreamRestartState,SharedQueueTrackList,PrivateQueueTrackList,CurrentVLIState,CurrentAVTTrackList,CurrentSourceState,ResumePlayback,NewCoordinator,RejoinGroup,ClearSource,RestartSink,NrTracks,MediaDuration,EnqueuedURI,EnqueuedURIMetaData,DesiredFirstTrackNumberEnqueued,EnqueueAsNext,FirstTrackNumberEnqueued,NumTracksAdded,NewQueueLength,NewUpdateID,AddAtIndex,RemainingSleepTimerDuration,CurrentSleepTimerGeneration,AlarmID,GroupID,LoggedStartTime,NumberOfURIs,EnqueuedURIs,EnqueuedURIsMetaData,ContainerURI,ContainerMetaData,CurrentTransportState,CurrentTransportStatus,CurrentSpeed,TrackDuration,TrackMetaData,TrackURI,RelTime,AbsTime,RelCount,AbsCount,NewPositionList,QueueLengthChange,ResetVolumeAfter,RecQualityMode(s),PlayMedia,RecMedia}; clone params {x-sonos-clone-gc,x-sonos-gc-cleared-content}
<details><summary>Evidence (1)</summary>

- @ 0x10eb0028 — avt_impl block

</details>

## `avt_lastchange`

**coverage** `strong`

The complete `LastChange` event grammar for AVTransport: the standard UPnP fields (TransportState, CurrentTrack*, AVTransportURI*, NumberOfTracks, play/crossfade modes) plus Sonos extensions under the `r:` namespace (EnqueuedTransportURI*, sleep/alarm fields, more). Subscribed clients receive this as the single authoritative playback-state stream.

**Technical description:**

<Event xmlns=upnp-org:metadata-1-0/AVT/ xmlns:r=rinconnetworks-com:metadata-1-0/>; standard {TransportState,CurrentPlayMode,CurrentCrossfadeMode,NumberOfTracks,CurrentTrack,CurrentSection,CurrentTrackURI,CurrentTrackDuration,CurrentTrackMetaData,PlaybackStorageMedium,AVTransportURI,AVTransportURIMetaData,NextAVTransportURI,NextAVTransportURIMetaData,CurrentTransportActions,TransportStatus,TransportErrorDescription,TransportErrorURI,TransportErrorHttpCode,TransportErrorHttpHeaders}; rincon-ext {r:EnqueuedTransportURI,r:EnqueuedTransportURIMetaData,r:CurrentValidPlayModes,r:DirectControlClientID,r:DirectControlIsSuspended,r:DirectControlAccountID,r:SleepTimerGeneration,r:RestartPending,r:NextTrackURI,r:NextTrackMetaData,r:AlarmRunning,r:SnoozeRunning}; static NOT_IMPLEMENTED {TransportPlaySpeed,CurrentMediaDuration,RecordStorageMedium,PossibleRecordStorageMedia,RecordMediumWriteStatus,CurrentRecordQualityMode}; PossiblePlaybackStorageMedia=NONE, NETWORK; x-sonos-unknown: scheme

- **name:** AVT LastChange event schema
<details><summary>Evidence (1)</summary>

- @ 0x10eb29e8 — avt lastchange

</details>

## `browse_ids`

**coverage** `strong`

The SMAPI browse container-ID vocabulary: library roots (ALBARTIST, LIBARTIST, LIBALBUM, LIBGENRE, LIBTRACKS...), genre branches, global containers, and per-service subtrees. These short prefixes are what services embed in object IDs and what the player matches to render browse hierarchies.

**Technical description:**

library {ALBARTIST,LIBARTIST,LIBALBUM,LIBGENRE,LIBTRACKS,LIBPLAYLISTS,LIBSTATIONS,LIBMUSIC}; genre {GNRSUBGNR,GNRTOPARTIST,GNRTOPALBUM,GNRTOPTRACKS,GNRSTATIONS,GNRCHARTS,NEWRELEASES,RHAPRECOMMEND,SUBGNRALLARTISTS,SUBGNRKEYARTISTS,SUBGNRKEYALBUMS,SUBGNRSAMPLER}; global {GLBARTIST,GLBALBUM,GLBGENRE,GLBLEAFGENRE,GLBTRACK,GLBPLAYLIST,GLBSTATION}; artist {ARTTOPTRACKS,ARTALBUM,ARTSINGLESEPS,ARTCOMPILATIONS,ARTOTHERRELS,ARTSTATION}; discovery {GUIDE,ALBUMSFORYOU,FEATPLAYLISTS,STAFFPICKS,PSTATIONS}; search {SEARCHARTISTS,SEARCHKEYWORDS,SEARCHTRACKS,SEARCHALBUMS,SEARCHCOMPOSERS,SSTATIONS,SONOSSEARCH}; radio {STARTSTA,STARTTAGSTA,BROWSETAGPOP,BROWSETAGALPHA,MYRADIO,PERSONALRADIO,LOVEDRADIO,NEIGHBORHOOD,RECOMMENDED,SEARCHTAGS,TAGRADIO,TOPTAGSPOP,TOPTAGSALPHA,RECENT}; genres {Adult and Easy Listening,Eighties,"Public, Talk, and Sports Radio",Pop and Top 40,Country and Folk,Jazz and Blues,"Classic, Hard and Alt. Rock","Soul, Hip Hop and R&B",Dance and Electronic,"New Age, Ambient, Chill-Down"}; locales {France,Germany,Italy,Netherlands,Spain,International-Other}; misc {ZPSTR_BUFFERING,Favorite Stations,Unnamed Room,Media Server}

- **name:** SMAPI browse container IDs
<details><summary>Evidence (1)</summary>

- @ 0x10ee7638 — browse ids

</details>

## `catalog_translation`

**coverage** `strong`

The same catalog-translation facility as catalog_translate: cloud-backed ID mapping with a local cache ('retrieved translation from cache' vs 'connecting to translation service'). Useful for cross-service matching features like 'also available on'.

**Technical description:**

GET /content/api/catalog/id/%s?destinationServiceId=%s; translateId(objectId,serviceId,targetObjectId); cache {"retrieved translation from cache","translation not cached; connecting to translation service","saved translation to cache","translateId response: %d %s"}; errors {"objectId missing","serviceId missing","targetObjectId missing","cannot perform translateId request; one or more parameters missing"}; actors {zpCatalogTranslation,catalogSvcMgr,targetSid}

- **name:** catalog ID translation (/content/api)
<details><summary>Evidence (1)</summary>

- @ 0x10eb3c38 — translate block

</details>

## `cdn_fetcher`

**coverage** `strong`

The eSDK's CDN downloader: three cooperative fibers (socket IO, HTTP IO, chunk copy) pull track data from Spotify's CDN with explicit offset/size requests, follow redirects, retry on timeouts, and fail over to the next CDN host when one stalls. Chunk progress is logged in kB. This is why Connect playback survives a mid-track CDN hiccup — retry and failover are built into the fetcher.

**Technical description:**

fibers {chunk_fiber,httpio,socketio} TF_IS_RUNNING; requests {"downloading '%s' from offset:%i size:%i","requesting stream '%s' offset:%ukb (size:%ukb)","GET %s"}; errors {"httpio get failed (result = %i, status code = %i, total code length = %i)","Redirect #%d to %s","httpio unexpected eof/read failed","reading/got chunk (%ukB -> %ukB) / %ukB (%ukB)","unexpectedly not enough space in destination","This is probably not recoverable","Failed to write to destination buffer","retry on timeout/read error, attempts=%d","failed to download chunk from cdn","switched to a new cdn: cdn_index=%d"}; "Download complete, read %u B in %u ms"; req engine {"%s Request for %s %s (channel_id:%d, fail_count:%d)","%s request failed: %d, fail_count:%d (retry_count:%d)","%s retries exhausted, count:%d, limit:%d","Will retry %s in:%llums at:%llu",dbg_ctx,request_function}; params {cdn_info->num_urls,dest}

- **name:** eSDK CDN fetcher (MOD-CDN)
<details><summary>Evidence (1)</summary>

- @ 0x10fde1a8 — CDN

</details>

## `cert`

**coverage** `?`

Device identity certificate handling: the Sonos-issued cert + encrypted private key used for mTLS and signing — see cert_files for layout, cert_layer for validation, devicecertmanager for refresh.

- **metadata_errors:** devcertmgrprovider cert validation codes: BAD_FILE,BAD_KEY,BAD_CERT,BAD_ISSUE_DATE,MISMATCH_ENV,MISMATCH_ISSUER,MISMATCH_HHID,MISMATCH_USER,not_present; headers X-Sonos-UserId,X-Sonos-Muse-Household-Id,X-Sonos-Denylisted; response {requestTimeMS,downloadStatusCode,httpResultCode,previousETag,download,reasonCode,certError}; states downloaded/unchanged/generating; "Unknown cert metadata state: %s. Scheduling cert refresh job"; "Retrieved manufacturing data: %s"; refresh "%s: refresh check in %ld seconds"/"certificate expired"/"utc time not set"
## `cert_layer`

**coverage** `?`

The X.509 validation internals: issuer/env/household/user match rules, issue-date checks, and the MISMATCH_* error taxonomy behind every mTLS or signed-request failure.

- **files:** cert.xml + metadata.txt; "Buffer not sufficient to store entire certificate"; "loading %s (0x%x) took %ums"; tmpfile-rename atomic swap; "failed to load replacement (0x%x)"
## `chirp_sdk`

**coverage** `strong`

The public Chirp SDK wrapper: profile construction, payload encoding/decoding, symbol extraction, and the process_shorts input/output audio pump. Sonos ships it with libVorbis 1.3.7. Errors map to a small taxonomy (invalid profile, invalid payload, decode failures). Only relevant if you're implementing the acoustic setup side-channel — normal control never touches it.

**Technical description:**

version chirp-sdk 4.2.3; libvorbis {Xiph.Org libVorbis I 20200704 (Reducing Environment),1.3.7}; API {new_chirp_sdk,del_chirp_sdk,chirp_sdk_free,chirp_sdk_random_payload,chirp_sdk_get_info,chirp_sdk_process_shorts_input/output,chirp_sdk_send,new_chirp,del_chirp,chirp_encode,chirp_decode,chirp_get_symbols,new/del_chirp_payload,chirp_payload_randomise,new_chirp_builtin_profile,new/del_chirp_profile,new/del_chirp_protocol,new_chirp_protocol_from_json_value,chirp_protocol_corrupt_random_symbols,new/del_chirp_acoustic,new/del_chirp_encoding,new_chirp_config,new_chirp_default_config,del_chirp_config,new_chirp_decoder_config_from_json_value,new_chirp_default_voter_configs,new/del_chirp_voter_config,new/del_gf,del_gf_poly,gf_calc_syndromes,gf_poly_concatenate,chirp_levenshtein,chirp_logger_init_with_callback/deinit}; types {chirp_sdk_t,chirp_t,chirp_symbol_t,chirp_payload_t,chirp_profile_t,chirp_protocol_t,chirp_acoustic_t,chirp_encoding_t,chirp_config_t,chirp_voter_config_t,chirp_decode_metrics_t,chirp_logger_t,sample_t,uint8_t,uint32_t,float}; info "Chirp SDK with \"%s\" profile v%u \[max %u bytes in %.2fs\], supporting %u channel(s), using %s modulation."; logger fmt "\[%s:%d\] \[%s\] %s" levels {Print,Debug}

- **name:** Chirp SDK 4.2.3
- **profiles:** builtin {audible,sonos-cdma,sonos_secure_setup,ultrasonic}; schema_version+decoder_config+voters
- **acoustic_params:** {base_frequency,channel_count,channel_interval,envelope_attack,envelope_release,preamble,header_note_duration,header_silence_duration,frequency_interval,body_note_duration,body_silence_duration,portamento,template}; encoding {alphabet_bits,crc_length,message_length_max,message_length_min,polyphony,rs_length_max,rs_length_min}; decoder {fft_size,hop_size,sample_rate_min,payload_metrics_enabled,buffer_metrics_enabled,voters,amplitude_threshold,frame_offset,preamble_threshold,reverb_cancellation_exponent,reverb_cancellation_magnitude,spectral_weighting}
- **errors:** {"hasn't been initialised. Did you forget to set the profile?","internal error prevented the SDK from initialising","Some memory hasn't been freed","Receiving mode has been disabled","profile creation could not be completed","not running"/"already running"/"already stopped"/"already sending","sample rate is invalid, or is too low for this profile","NULL buffer/pointer/empty string","channel requested is not supported by this profile","Invalid frequency correction value","internal issue occurred when processing","profile was generated for a different version. Please upgrade","Logging has been enabled but the corresponding callback has not been set","callback not supported with the selected modulation scheme","not intended to be used with the actual modulation scheme","payload is empty/invalid/contains unknown symbols","Couldn't decode the payload","payload length longer/shorter than max/min","gain level specified is invalid","SDK has reported an unknown error","Audio I/O error","Unknown error code","Send/Receive mode hasn't been enabled","The device is muted. Cannot send data","Chirp message/parity payload has already been allocated","Requested length exceeds maximum/smaller than minimum payload length","Payload does not support symbol sizes beyond 64-bit","Preamble payload has too few symbols (TODO: #741)","Protocol for chirp creation is null","Failed to set meta data","Checksum has been corrupted : %#x","Seeking beyond the end of the array","Bandwidth cannot be measured for equal-tempered settings","Protocol acoustic/encoding is NULL","Preamble must be at least 1 byte long/some length","Preamble code is outside of symbol range","Base frequency is below 20","Channel count is not within acceptable range","Header note length invalid","Body note duration invalid","Attack/Release time invalid","Attack/release combination is invalid","Portamento is invalid","Preamble/Body silence duration invalid","Alphabet bits is not within acceptable range","Min/Max message length cannot be less than 1 byte","Max message length cannot be less than min","Polyphony is outside valid range","Total frame length cannot be more than 256 bytes","Strings have different lengths","Chirp: Runtime assertion failed: "}
- **internals:** chirp-core 4.2.1_7265; GF/RS {new/del_gf,new/del_gf_poly,gf_calc_syndromes,gf_correct_errata,gf_forney_syndromes,gf_find_error_evaluator,gf_poly_{concatenate,mul,div,add,append,scale,zero_pad,strip_leadingzero},trim_gf_poly,new/del_chirp_rs,new/del_chirp_rs_result,copy_chirp_rs}; decoder {new/del_chirp_decoder,chirp_decoder_flush,new/del_chirp_cdma_decoder,new/del_chirp_peaks,new/del_chirp_scorer,new/del_chirp_voter,chirp_voter_set_state,new/del_chirp_weighting,new/del_chirp_template,new/del_chirp_block_buffer,new/del_chirp_fft,new/del_chirp_reverb,new/del_chirp_bitstring,new/del_chirp_biquad_filter,new/del_chirp_multitone,new/del_chirp_codebook,new/del_chirp_rms,new/del_chirp_decorator,chirp_maths_fft_init/deinit}; encoder {new/del_chirp_encoder,chirp_encoder_chirp,chirp_encoder_chirp_array_raw,chirp_encoder_test_signal_init/stop,new/del_chirp_wavetable,new/del_chirp_cdma_encoder}; SDK internals {_chirp_sdk_configure_core,_chirp_sdk_from_string,_chirp_sdk_as_string,_chirp_to_bytes,_new/_del_chirp_sdk_buffer_processed_metrics,chirp_sdk_buffer_metrics_t,chirp_sdk_payload_metrics_t,_chirp_on_received_cdma,_chirp_sdk_allocate/free_decoders_fsk,_chirp_on_sending_fsk,_chirp_on_received_fsk,_chirp_on_sent_fsk}; types {chirp_rs_t,chirp_rs_result_t,chirp_template_t,chirp_decoder_t,chirp_cdma_decoder_t,chirp_note_estimate_t,chirp_note_metric_t,chirp_cdma_match_t,chirp_peaks_t,chirp_peak_t,chirp_scorer_t,chirp_voter_t,chirp_weighting_t,chirp_encoder_t,chirp_wavetable_t,chirp_test_signal_t,chirp_cdma_encoder_t,chirp_block_buffer_t,chirp_fft_t,chirp_reverb_t,chirp_bitstring_t,chirp_biquad_filter_t,chirp_multitone_t,chirp_codebook_t,chirp_rms_t,chirp_decorator_t,chirp_u16_t}; errors {"Wrong len value","field_charac = 0","Value of symbol_bits will overflow a cast","Sum of message and parity lengths out of range","Length should not be negative","Erase count value negative","No frames selected to decode (is sustain period too short?)","chirp_encoder: cannot process an empty block","Invalid note index","FFT block_size must be greater than 1","Bitstring length exceeds maximum supported limit","Resolved \[ %d","Polyphony required is outside allowed range","combinatoric result out of range","event_index maximum value reached"}; alt JSON parser {comment support,"Invalid character value","Unexpected EOF in block comment","Comment not allowed here","Trailing garbage","Expected ,/:/digit before/after","Unknown value","Too long (caught overflow)"}
<details><summary>Evidence (1)</summary>

- @ 0x10fcec70 — chirp SDK

</details>

## `chsnk`

**coverage** `?`

The group-audio channel sink: the receiving end of a framed, SNTP-synchronized audio stream from the group's source. It validates packet formats, tracks the source's clock offset, and drives the local DAC timing so all members play the same sample at the same wall-clock instant. Seamless handoff lets a new source take over mid-stream by matching frame IDs and packet classes.

- **crossfade:** sample-level xfade: "attempting to crossfade with underflowed stream"/"recovered crossfade stream underflow"; int16 crossfade; "xfade corked stream: replace buffered data via non-xfade overlap"; "xfade timestamp too far in past, nst %d.%06d"; "xfadeable timestamp"; "set xfade lfnf"; volume-norm ramp insert "%d @time %d.%06d"; "xfade for %zu samples, %f seconds"; gap tracking "xfade gap, samples %zd"
- **metrics:** gauges {chsnkFillLevel="Amount of audio in stream buffer",largeSyncErrors="Playback (see sync) and downstream errors","Maximum sync mismatch with group coordinator","Amount of output committed to driver"} + {fillCodec,fillTimeMs,chsnkFill,chsnk-full}; window {windowPlayhead,includesBeginningOfQueue,includesEndOfQueue}; stream fmt {"header magic mismatch","md block loc","md header len mismatch","si pos mismatch","si read failed",fsAvail}
## `chsnk_detail`

**coverage** `strong`

The detailed chsnk behavior: remote seamless transitions parse incoming source packets and either quick-handoff or wait out a timed handoff window, with packet-compatibility checks (protocol version, full-frame/id/class/offset matching). Local sources and the LSE (large sync error) resync path handle drift beyond normal correction. Denylisting kicks in after repeated per-service failures. This is the machinery that makes source handover inaudible when it works.

**Technical description:**

seamless handoff {remote: 'starting seamless transition to remote source','txs can't be parsed','handoff wait loop','timed out','sdbt receive packet failed','Old/New packet mismatch (no full frame/id:%u class:%u/%u offset:%u/%u/%u)','Delayed handoff success, offset:%f','Quick handoff success','Completed in %dms','incompatible protocol version'; local: 'itdbt receive packet failed','failed due to END_TX','no packets from old source?','Completed seamless transition to local src (id=%u)',skipped,'seamless source change %s (local)/failed (remote)'}; SNTP {'Starting SNTP server switch.','Completed SNTP server switch in %dms.','SNTP waiting for valid at %d.%06d','SNTP valid %d continue to play %d','noderx I/O error while waiting for SNTP'}; sync math {'local device time went backwards!','prevLT/prevNT diff %06dus overall %+f','Should play at %d.%06d playable %d.%06d offset %f','sample time offset range %.3f-%.3fms; DAC clock abs offset range','max consec large sync errs','small offset error %f','large sync error triggered resync offset %f','error was %.0f ms %s; cpu usage was %.01f%%; sntp v:%d f:%d'}; LSE {skipAheadLocked,'Adjusted tvLocalPlay by %.0f usec','Resync after LSE','waiting for stream reset to recover','stream underflow, uf %u od %u','Play time %d.%06d too far in the future','setOutputToBeginAt(%d.%06d); diff %i ms','Initial sync -- notify samples'}; req frames {'request frame pbe %X','stop detected','control frame type %u','audio type changed','underflow detected','group coordinator uuid: %s, network I/O error 0x%x','logical track boundary at %u','unplayable frame: type %u','pbe %X; %f usec in buffer','hard stop; state %d','noderx pause request','track boundary','scheduled resync frame @ pkt %d'}; sources {local chsrc,local AI,local VLI,remote chsrc,stopped}; notify {'notify frame: stop detected','unflagging stream for drain; %zums buffered','Local time/remote time','lrp:%u, fppc: %u','notifyframe ret %d play time %d.%06d delta %dms'}; events {chsnk refreshing multicast join (NetworkIfaceBouncedEvent/NetworkIpAddrAssignedEvent),RemoteIpChangedEvent,chsrc_state_events,CoordChangeAutoStart,newgc}; ASRC {'Hi-Res music SRC: setCoefficients to StdQ ASRC Coeffs','ASRC will be reset. Sample Rate changed','illegal sample frequency/channels for Hi-Res music','WARNING! This model shouldn't support Hi-Res Music: %s (%s)'}; volnorm {'inserting volume norm: %d @time %d.%06d','found normalization change','requested w/o applying previous'}; streams {as-srcin-chsnk,as-srcin,as-srcout-chsnk,as-srcout,chsnk%d-as,chsnk%d-proc-as,CHSNK,chsnk-pause,chsnk_framed}; decoder {<MusicDecoder><LastActiveDecoder>,m_bCompressed,'starting %s audio decoder at %d.%06d (dc:%d.%06d)','requested stop %d or shutting down %d'}; ducking {Ducking,Unducking,voice2,google,extaudio,'%s playback stream (%s)'}; underflow acct {'boundary, xfade %d','max below stream %u od %u xfs %zu xlvl %zu now ... corked %d','inserting volume norm','stream reset on write','channelization data full'}; service denylist {'Added listener for service %u','stream limit exceeded for service %u','too many failures, denylisted service %u','clearing all denylists and stream limits','resetting all denylist error counters',denylist}; DAC monitor {'Starting to monitor DAC tvLocalPlay:%d.%06d, tvFirstPlayTime:%d.%06d','unable to fire start playback event','Channel Sink in stopped state (dc)'}

- **name:** channel sink internals
<details><summary>Evidence (1)</summary>

- @ 0x10eb4860 — chsnk block

</details>

## `chsrc_chsnk`

**coverage** `substantially decoded`

The paired group-audio channel protocol: chsrc is the source side (the player that owns the audio, producing framed packets with play-hint states), chsnk is the sink side (every other member). Together they're SonosNet's real-time audio distribution layer — distinct from the HTTP/fetch paths, with their own packet grammar, resend logic for late joiners, and segment-fetch retry.

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
- **chsrc_detail:** framer {"limiting origin hint (was %dms)","framer origin hint, %dms","Framer context (%d.%06d) not found; use latest %d.%06d","Unable to calculate time this frame. m_samplesHandledSinceOrigin:%zu,m_lLastSampleFrequency:%u"}; "RChannelSource Reported Spotify position: %lldms, state: %s, transitionAck: %d"; "Initialize PlayTTL to %u seconds"; "Ignoring playback policy change for context version %s"; "RCHSRCReq Current Op: %s, Current TransactionID: %d"; segment-fetch {"resetSegmentFetchErrors","countSegmentFetchError -> %d","canFetchSegment -> TRUE (no errors)/FALSE (too many errors)/TRUE (retry %d)/FALSE (too soon to retry)"}; PRIV {"logical track MD: %s with %zu bytes of private data","PRIV data for %s is too big, only %zu bytes allowed"}; {"chsrc hint:%d, state:%d","Successfully got stream offset %zu","May have gotten confused","could not get location, using last resume location","Calling updateSharedTQPlayMode in bad context!"}; xfade "xfade duration (%u -> %u)" + "changing volnorm mode (%d -> %d)" + simple:v; queue {"Queue append in progress; not removing tracks","discard audio, no next track/more tracks","abort current"}
- **chsrc_detail2:** mime checks {"URI \[%d\|%s\] vs \[%s\] MimeType mismatch \[%s\]","mimeType (%s) inconsistent with URI (%s)"} fields {mimeType,uriFrmrID,uriFrmrName,mtFrmrID,mtFrmrName,uriMimetypeMismatch} + framer triple \[f:%d\|u:%d\|m:%d(%s)\]; txfg {mcast addr & port,ucast addr & port,cleared} + delegating=%d; late-joiner {"resendToLateJoiner: starting send at %u","overslept %ldms next:%u","aborting","restarting for new member at %u"}; oob metadata {"oob metadata (%d) %s","now %d (%ld) next metadata at %d (in %u)",cache reset/enabled/disabled,\|ARTIST ,\|ALBUM }; CQ {"Overriding command positionMillis with windowPlayhead.positionMillis","fetch 1st window","skip to first track","skip from track position %d->%d (offset %ld.%06ld > duration)","Corrupted queue resuming from pause at track %d","retrieved stream MD %s w/ itemId","recording state as %d %s (%d.%06d) w/ itemId = %s \[%u\]","badging info %s",<Cloud queue error>,"appendTracksFromReq request was not handled!","Unable to recover from empty programmed radio queue","Queue is busy handling append, will try append for radio in next iter"}; queue completion {completion,"hwr clearing old avt tracks nx=%d tr=%d ct=%d tt=%d","Entering queueCompletion","stopping all playback immediately","Queue already completed"}; expiry {"SMAPI radio tracks expiry time hit -- dumping.","Cloud queue policy pause expiry time hit","Queue content expired"}; defer {"waited too long in DEFER_PLAYING state",DEFER_PLAYING,TRAN_DEFER_PLAY}; timing {"logical track boundary at %u","notifyFrameInternal: behind %dms","ahead %lldms. Sleeping %lu ms, playtime=%d.%06d, sent at=%d.%06d, now=%d.%06d","tracking E_WOULDBLOCK count","E_WOULDBLOCK: playtime...","setting origin time to %d.%06d"}; play-hints {waiting,fast startup,future,met,none,crossfading} "play time start hint X"; buffering {"buffering underflow after %lld ms, requesting resync \[BH:%lld, FH:%u%%, FA:%lld, FR:%d\]","recovered buffering underflow after %lld ms","time to first byte %d","No QualityInfo available (framer = %s)"}; track filters {"skipped duplicate/restricted/explicit/denylisted track %s","found a playable track","start playable track","Skipping track for transition to pause","Upcoming Spotify track is not playable (i.e. restricted)","Upcoming Spotify track filtered for explicit content"}; crossfade {"Setting up for %d.%06d sec crossfade.","Not fading","Previous track had a length of %llds","Next track has a length of %llds"}; transport error "%s Transport error %s for account type %u, URI: %s, friendly name: %s, share/server: %s, path: %s, ip: %s, host: %s, extra info: %s, http: %d, framer: %s, ahead: %d, rate: %d" vars {ratelimit,ahead,trRate,chsrc:te}; files {file://%s/sonar-tone/%s,file:///opt/buzzers/%s,file://%s/%s}; URIs {x-rincon-sonarcal URI truncated,x-rincon-configmode URI truncated,%s URI truncated}; "Apple Music: use the derefenced URI to determine the framer, see CP-7253"; "Overriding seek with value from SMAPI service: %lds"; "PlayTTL expired, pausing playback"; "reporting enqueued stream URI instead of track URI"; "clearing queue per policy"; "Could not determine resume location, disabling pause-at-end behavior"; states {TRAN_PLAYING,TRAN_PAUSED,TRAN_STOPPED,PLAYING_START}; "Resume position (%lds) at or past max allowed position"; RAsyncBufferedStream; ChsrcSysSettingsEvt; reportRadioFail; "Grouping a new player"; "notifyIdle: overshot by %ldms (%ldms lj)"; "Resetting required group caps \[0x%08x\] -> \[0x%08x\]"; "Start streaming %s track (%d/%d) %s; origin is %d.%06d (%zu samples since)"; "Streaming enqueued %s"; "Hit the end of the programmed radio queue"; "Queue policy stop on error"; "resuming from pause at track %d, %ld sec"; "Reporting radio failure %s %s"; "unrecoverable error flagged"; "Downloading %s"; odelay; chsrc:framed; chlog; tvSeek={0, 0} framerStartLoc=0 framerResumePos={%ld, %ld}
- **op_enum:** chSrcTransportStatus ops {CHANGE_TRANSPORT_URI,BEGIN_ADD_URI_TO_QUEUE,COMMIT_ADD_URI_TO_QUEUE,REMOVE_TRACK_FROM_QUEUE,REMOVE_ALL_TRACKS_FROM_QUEUE,INVALIDATE_RADIO_TRACK_QUEUE,SEEK_TO_TRACK,SEEK_TO_TIME,SEEK_TO_TIME_WITH_ITEM_ID,SET_PLAY_MODE,SET_CROSSFADE_MODE,REORDER_TRACKS_IN_QUEUE,REMOVE_TRACK_RANGE_FROM_QUEUE,RESET_PRIVATE_QUEUE,COMMIT_REPLACE_QUEUE,SKIP_TO_ITEM,REFRESH_CLOUD_QUEUE,CANCEL_ADD_URI,SUSPEND,PREPARE_FOR_DELEGATION,RATE_ITEM,GET_RESUME_STATE,SET_FIRST_TRACK_MIME_TYPE}
- **chsnk_control_frame_dispatch:** CHSNK request-frame dispatch (f_1030c8xx-0x1030cd00, log domain 'chsnk'): the parsed frame type in r16 is dispatched by cmpwi chain. Observed type values: 0 -> payload handler taking {u16@+0x2a, u8@+0x39} via f_104c2110 + f_1030b468; 5 -> 'audio type changed'; 0xc -> handler taking {u16@+0x2a -> *frameOut, ptr@+0x40}; 1/2/8 -> generic 'request frame: received control frame type %u'; 0x80000040 -> f_1030c338 call path; pre-dispatch r3==0 -> 'request frame: stop detected'; flag byte @+0x38 set -> 'request frame: underflow detected' + 'LSE: waiting for stream reset to recover' (LSE = large sync error); nonzero branch -> 'request frame pbe %X' (playback-boundary event); 'request frame: logical track boundary at %u' carries a u32 track boundary counter; default -> 'request frame: group coordinator uuid: %s, network I/O error 0x%x'. A second consumer logs 'synchronizedPlay: unplayable frame: type %u'. Net-IO states 'net_io_noderx_noframe'/'net_io_noderx_noframe_full'. Confirmed: frame-type dispatch structure and per-type log vocabulary; per-type full payload layouts partially recovered.
- **nodetx:** nodetx.cxx (NodeTransmitter, log tag nodecommon/nodeCommon): transport types ITBTT_UNKNOWN, ITBTT_CHSRC, ITBTT_LINEIN ('resetting InterthreadBlockTransport %s'). Wire behavior: NACK-based retransmit — 'nack from %s count=%u, min=%u, max=%u' requests resend of a packet-id range; 'not transmitting %u stale packets to %s'; 'ignore NACK packet with incompatible protocol version: %d'; resync via 'requestResync(%u)'/'Caught resync'/'resetting to pkt:%u off:%u'/'endTransmission'. Crossfade rides in-stream control frames — crossfadeStateForPacketID() walks lPacketNum-1 then -2 ('crossfade on'/'crossfade off - %u'/'no control frames found'). Timing: checkAndMarkFrameDiscontinuity logs 'discontinuity of %lldus'; getLocationAtTime maps playback location->time ('time requested (%d.%06d) earlier than oldest valid packet (%d.%06d)'). Perf counters (txPacketInfo histogram): 'number of times we sent a DataBlock', 'resent an old DataBlock', 'sent a resync NACK', 'sent a data NACK', 'could not send requested NACK'; config keys 'transmit port', 'transmit unicast or multicast address (or none for local-only)', 'last (new) packet id transmitted'. Format line '// %3u %d.%06d %u:%s'.
- **network_test:** networkTestMgr (app/run/nettestresult.txt): 'waiting %d sec before disabling wifi', 'disabling wifi for %d sec', 'enabling wifi', 'Network test started.', 'Opened connection.'/'Successfully connected.'/'Unable to establish connection.', 'Network test complete: %s.' — the muse networkTest resource disables Wi-Fi, opens a test connection, then re-enables.
<details><summary>Evidence (2)</summary>

- @ 0x10ea8620 — chsrc.cxx literal block: ops, work-req, tx-fanout, segment retry, PRIV/oob metadata
- @ 0x10eb5400 — chsnk.cxx literal block: frame types, synchronizedPlay, seamless transition, denylist, frame pool

</details>

## `circuit_breaker`

**coverage** `strong`

A CLOSED/OPEN/SEMI_OPEN circuit breaker wrapped around muse command delivery: when commands to the cloud start failing, the breaker opens and fast-fails instead of queuing forever, then probes recovery through a semi-open state. This is why a player in a dead-network state still answers local commands quickly — cloud-bound work is short-circuited at the breaker.

**Technical description:**

"%s CB state transition to \[CLOSED\]"/\[OPEN\]/\[SEMI_OPEN\]; musecommand; history.h

- **name:** circuit breaker FSM
<details><summary>Evidence (1)</summary>

- @ 0x10f94550 — CB FSM

</details>

## `cloud`

**coverage** `?`

The cloud-integration umbrella: API path construction, service hostnames, registration, and the lechmere event channel — the parts of the device that are useless without internet.

- **get_api:** callCloudGetAPI errors {openStream failed,HTTP not OK (%d),HTTP not OK response\[%s\],unexpected timeout rSz/cL,JSON parse failure \[sz,off\]}; SecureRegistrationChangeEvent + cloud_registration/CloudRegistration tags
- **headers:** outbound {X-Sonos-MS-Sig,X-Sonos-DeviceCert,X-Sonos-Context-TimeZone,X-Sonos-MAID,X-Sonos-Accept-Language,AUTHORIZATION,Bearer,X-Updated-Authorization,X-Goog-Updated-Authorization,Retry-After}; completeRefreshTxForAccount/waitForRefreshTxForAccount; "HTTP Header did not fit in char array"
- **ssl_cache:** ssl_client_cache page + "private, max-age=15780000" + "Skipping HH SSL cache refresh - device is not idle" + "SSL client cache refresh next run in %ld seconds"
- **fcs_gate:** "Disabling SSL client cache refresh per FCS"; "Loading SSL client cache after UTC time became available"; TrustDevCertChangedEvent
## `cloud_queue`

**coverage** `strong`

Sonos's cloud-side queue: playbackMetadata/ratings, trackQueueAdditions and CloudQueueHistory all point at a queue that lives cloud-side rather than in trackqueue.rsq — this is how cloud services (voice assistants, direct control) schedule tracks. Ratings are explicitly 'only implemented for cloud queue'. The windowed fetch protocol is now mapped: the player runs a 'cqfsm' state machine (POLL/PENDING/ERROR_RETRY/DONE/SUCCESS/MEDIA_ERROR/RESET plus the per-request states GET_VERSION, GET_CONTEXT, SCHEDULE_WINDOW, SCHEDULE_CONTEXT, GET_WINDOW, POST_RATE) and pulls three versioned resources from the queue's base URL: 'itemWindow?' (with isExplicit, previousWindowSize, upcomingWindowSize, heardItemId), 'context?', and 'version?'/'version?updateToken=true&'. Each window item carries itemId, actions, mediaUrl, the full audio-format block (mediaFormat, sampleRate, bitDepth, bitRate, numChannels, dolbyAtmos), reportId/privateData, positionMillisAtSegmentStart and a policies list. Playback reports post {timePlayed, durationPlayedMillis, timeSincePlaybackMillis} and ratings post to 'item/<id>/rating' with currentlyHeardItemId. Requests ride under the standard Sonos cloud headers (Bearer/authorisation tokens, X-Sonos-MS-Sig signature, X-Sonos-DeviceCert, X-Sonos-Playback-Id, X-Sonos-Device-Id, MAID, Accept-Language, group attribute/capability), honour Retry-After, and classify failures as Client error / Server error / Unexpected response / Server aborted connection. The per-item 'policies' bitfield values and the queue↔local-queue reconciliation path are the remaining undecoded pieces.

**Technical description:**

resources {itemWindow?,context?,version?,version?updateToken=true&}; params {isExplicit,previousWindowSize,upcomingWindowSize,heardItemId}; truncation {item window,context,version}

- **name:** cloud-queue item-window API
- **work_ops:** ops {int_enterState,internalCQSkipToNextTrack,internalCQSkipToPreviousTrack,internalStartCloudQueue,internalRefreshCloudQueue,pauseTransition,commitReplaceWhilePlaying,prepareToBeDelegationTarget,setStateSSGoal,internalRateItem,notifyCQError,internalSkipToItem,internalCQSkipToFirstTrack,int_resumeFromPauseWhenPausedAtEndEnabled,int_internalSuspend,switchState,loadCloudQueueFromReq,handleWorkRequestWhileRunning,queueCompletionRoutine,handleWorkRequestWhileStopped,pauseRoutine,stopRoutine,notifyFrame,runQueue,internalNotifyTransportError}
- **fsm:** ops {GET_VERSION,GET_CONTEXT,SCHEDULE_WINDOW,SCHEDULE_CONTEXT,GET_WINDOW,POST_RATE}; states {PENDING,ERROR_RETRY,SUCCESS,MEDIA_ERROR,RESET}; transitions "\[%s\]Changing State: %s(%d) to %s(%d)"+Exited/Entering; requests {requestVersion,requestContext,requestWindow,refreshWindow,refreshContext,getWindow,skipToFirstWindow,rateItem,skipNext,skipPrevious,getItemWindow}; req params "requestWindow w/ %s itemId='%s', positionMillis=%d, queueVersion='%s'"; events {contextVersionChanged,contextVersion,authTokenChanged,authTokenRefreshed}; headers {X-Sonos-Playback-Id,X-Sonos-Device-Id}; retry policy {"Retry-After (%ds) not allowed for explicit item request in state %s","Resetting due to unexpected state %s on retry","Will retry(%d) %s request in %d seconds after receiving http error code %d","Retry not allowed in state %s. The retries are exhuasted (count = %d)","request retry loop timed out, failing chsrc interaction","change poll interval to %lld sec"}; fields {units,ResponseCode,RetryWait,Caller,ListEntry,queueType,errorId,heard,skipsRemaining,skipLimitReached,jumpToItemId,WINDOW_MISSING_ITEM_ID,Requested Item Id}; window {"Abort window request because desired itemId is unknown; waiting for skipToItem","refreshWindow is fetching first window","refreshWindow server does not support notification",window-edge-condition}; versioning {"Specify cloud queue version in 'queueBaseUrl' according to Semantic Versioning 2.0.0.","Cloud Queue API 'v%u' is unknown; use v%u with this player.","Cloud queue version is %s, at begin %d, at end %d"}; errors {MEDIA_ERROR:NO_ACCT,CloudQueueHistory,Unknown Account}; ops2 {skipNext,skipPrev,queueCompleted,refresh,PlayTTLExpired}; cqfsm
- **item_window_schema:**
  - **request_urls:**
    - **window:** 'itemWindow?' + query {isExplicit, previousWindowSize, upcomingWindowSize, heardItemId}
    - **context:** 'context?'
    - **version:** 'version?' and 'version?updateToken=true&'
    - **rating:** 'item/%s/rating' (POST)
    - **truncation:** 'Truncated item window resource: %s' / context / version — URL buffer cap errors
  - **item_fields:** `itemId`, `actions`, `mediaUrl`, `mediaFormat`, `sampleRate`, `bitDepth`, `bitRate`, `numChannels`, `dolbyAtmos`, `reportId`, `privateData`, `positionMillisAtSegmentStart`, `policies`, `items`
  - **play_report_fields:** `timePlayed`, `durationPlayedMillis`, `timeSincePlaybackMillis`, `'Truncated TimePlayed post for %s @ %s'`
  - **rating_fields:** `currentlyHeardItemId`, `'Truncated rating post for %s'`
  - **headers:** `X-Updated-Authorization:`, `X-Goog-Updated-Authorization:`, `Retry-After:`, `X-Sonos-MS-Sig:`, `Bearer`, `AUTHORIZATION:`, `X-Sonos-DeviceCert:`, `X-Sonos-Context-TimeZone:`, `X-Sonos-MAID:`, `X-Sonos-Accept-Language:`, `X-Sonos-GroupAttribute:`, `X-Sonos-GroupCapability:`
  - **error_taxonomy:** `Client error`, `Server error`, `Unexpected response`, `Server aborted connection`, `ERROR_LSE`
  - **provenance:** literal cluster .rodata 0x10ec1e64-0x10ec2288 — the CQ HTTP request builder + item/report field names
<details><summary>Evidence (1)</summary>

- @ 0x10ec1f8c — cq window block

</details>

## `cloud_registration`

**coverage** `?`

Cloud registration state machine: binds the player to a household online; `getRegistrationStatus` exposes progress; failures retry with backoff and leave local playback working.

- **fsm:** cloudregistration.cxx: required fields {sonosId,householdLocationId,dhcpMac,ipAddr,museHHName} — "Missing required information: DHCP Server MAC (%s), Location ID (%s)" defers registration; triggers "Updating cloud registration due to '%s'"/MuseSessionId change/explicit request; "Caching muse cloud registration event %s"; "Network Hash \[%s\], Muse Household Id \[%s\]"; cloudRegPollWifiStation monitor job; R_HouseholdLocationID key
## `cloud_services`

**coverage** `strong`

The registry of which cloud hostnames serve what: `sslauth.sonos.com` for authenticated calls, per-service `*.ws.sonos.com` endpoints for lechmere events, crash upload, feature config, music history, registration, recommendations, and more. Knowing this map is what tells you which outage explains which symptom — e.g., lost household settings vs lost voice services are different backends.

**Technical description:**

host patterns {sslauth.sonos.com,https://%s-%s.lower-sslauth.sonos.com%s,https://%s.%s%s,lechmere.%s.ws.sonos.com,/firmware/swgen/%u/latest/}; service names {clientdata,crash-upload,feature-config,music-history,lechmere-v1,music-accounts,myaccount,oauth,player-device-files-ab,product-settings,recommendation,registration,service-catalog,sonos-nonprod,apigee.net,smart-play,system-api,system-api-diagnostics,transfer,translate,universal-search,msmetrics}; CSRFToken var

- **name:** cloud service host registry
<details><summary>Evidence (1)</summary>

- @ 0x10ee7118 — cloud service registry

</details>

## `content_directory`

**coverage** `strong`

The ContentDirectory implementation: dual-URN service (Sonos and UPnP org), full browse/create/destroy/update actions, share-indexing state variables (SystemUpdateID, ShareIndexInProgress, ShareIndexLastError, Favorites/Radio/SavedQueues update IDs), and locale handling (zh-CN, ja-JP). The browse surface every library browser and the Sonos app use.

**Technical description:**

dual URN {urn:schemas-sonos-com:service:ContentDirectory:1,urn:schemas-upnp-org:service:ContentDirectory:1}; locales {zh-CN,ja-JP}; event vars {SystemUpdateID,ContainerUpdateIDs,ShareIndexInProgress,ShareIndexLastError,FavoritesUpdateID,RadioFavoritesUpdateID,RadioLocationUpdateID,SavedQueuesUpdateID,ShareListUpdateID,cdMediaServer}; actions {Browse,CreateObject,DestroyObject,FindPrefix,GetAlbumArtistDisplayOption,GetAllPrefixLocations,GetBrowseable,GetLastIndexChange,GetSearchCapabilities,GetShareIndexInProgress,UpdateObject,SCHED}; args {BrowseDirectChildren,BrowseMetadata,BrowseFlag,RequestedCount,SortCriteria,NumberReturned,TotalMatches,ContainerID,Elements,CurrentTagValue,NewTagValue,SortOrder,TotalPrefixes,PrefixAndIndexCSV,Browseable,IsBrowseable,IsIndexing,SortCaps,SearchCaps}; logs {"UpdateObject returned %d; ObjectID: %s; Elements: %s","notifyUpdateID('%s', %u)","Bad Browse flag %s","Bad Object ID %s","Browse %s ObjectID: %s;","MetaData failed %d"}; DIDL URNs {upnp/|class,upnp/|albumArtURI,rinconnetworks/|http,rinconnetworks/|albumArtist,rinconnetworks/|description}

- **name:** ContentDirectory implementation (cd_impl)
<details><summary>Evidence (1)</summary>

- @ 0x10eb3aac — cd_impl block

</details>

## `customsd`

**coverage** `strong`

The `/customsd` page — a CSRF-protected form that registers a custom SMAPI service descriptor: SID range 240–253/255, name, secureUri, poll interval, and an authType radio (Session ID, Anonymous, DeviceLink, AppLink), plus optional strings/presentation-map/manifest version+URI fields. This is the dev mechanism for pointing a player at your own music service.

**Technical description:**

POST /customsd + csrfToken hidden; fields {SID (240-253 or 255) default 255,name (blank erases),secureUri,pollInterval}; authType radio {UserId=Session ID,Anonymous,DeviceLink=Device Link,AppLink=Application Link}; optional {stringsVersion+stringsUri,presentationMapVersion+presentationMapUri,manifestVersion+manifestUri}; containerType {MService=Music Service,SoundLab=Sonos Sound Lab}; caps checkboxes {search,trFavorites,alFavorites,arFavorites(commented out),ucPlaylists,logging,playbackLogging,accountLogging,extendedMD(+radioExtendedMD,playlistExtendedMD gated),disableAlarms,noMultiAccount,mediaUriActions,contextHeaders,deviceCerts,playerIds,contextReporting,userInfo,contentFiltering,manifest,authorizationHeader}

- **name:** /customsd custom service descriptor form
<details><summary>Evidence (1)</summary>

- @ 0x10eba2d4 — customsd form

</details>

## `datatap`

**coverage** `?`

Internal data taps for diagnostics: structured capture hooks into subsystems that don't publish state otherwise.

- **detail:** "Datatap snapshot failed after %zu" (snapshot bound); ZoneDevDiscThread
## `device_props`

**coverage** `?`

The DeviceProperties service: device-level attributes — serial, MAC, display settings, button/LED behavior, IR, and the account-management actions (AddAccountX etc.). It's the service that answers 'what is this player' and 'how is it configured' at the UPnP layer.

- **idle_shutdown:** idle events LineInStateChangedEvent/ReplicatedSettingsChangedEvent; vars {WirelessMode,ConnectionType,ChannelFreq,BehindWifiExtender,WifiEnabled,EthLink,SettingsReplicationState,SecureRegState,IsIdle,MoreInfo,RawBattPct,BattPct,BattChg,BattTmp,BtSrcName}; reasons {APICall,BluetoothConnection,PartnerDisappeared,Recovery,UserSuspend,UserShutdown,APIShutdown,CriticalShutdown,UnknownShutdown}; dpimpl/dpUpdateIdleState "idle state is %sidle, changing to %sidle"
- **enetport_schemas:** <EnetPorts><Port port="%d"><Link>%d</Link><Speed>%d%s</Speed></Port>; EthPrtStats {rxPackets,txPackets,rxBytes,txBytes,rxErrors,rxDropped,txDropped,multicasts,collisions}; EthIntrf {lngthErr,ovrFlwErr,crcErr,frmeErr,fifoErr,missedErr,RxDtlErr,abrtErr,crErr,hrtBeatErr,wndwErr,TxDtlErr}; /sys/class/net/eth0 + eth%u
- **fields2:** {oldAddr,newAddr,playingAudio,zoneRole,lineInBusy,ipAddrChange,network,PrimarySupportsFlexSurrounds}; soapaction + text/xml; charset="utf-8"
## `devmode`

**coverage** `?`

Developer mode: `/devmode` page, statement files, and the unlock challenge — gated diagnostic behavior that differs from production.

- **internals:** statement files {debug/devmode.bin,/devmode.bin,/tmp/devmode.tmp.bin} format "0x%s %d.%d-%d.%d" (id+version range); x-rincon-enc3 encryption; R_ALLOW_SSH_PUBKEY_INSTALL "may not be persisted" gate + "Removing persistent statement with R_ALLOW_SSH_PUBKEY_INSTALL" + "Loaded persistent statement"; notify {processes,listeners} on change
## `dolby_decoder`

**coverage** `strong`

The Dolby decoder front-end plus the DAP (Dolby Audio Processing) configuration model. Config lives in `/opt/dsp/dolby_config.json` with a JFFS override for debug; the decoder reports SampleRate, LFE presence, and channel count. `/staticparams` and `/dynamicparams` expose virtualizer modes, speaker angles, bass extraction, and DRC cutoffs (100–200 Hz). Night mode and movie mode are preset DAP profiles.

**Technical description:**

config {"unable to parse %s",app/debug/dsp/dolby_config.json (JFFS override),"override dolby config with jffs",/opt/dsp/dolby_config.json,"loaded player dolby json config","unable to load player dolby json config, loading defaults","Config %s not found, loading default"}; decoder {dlbdec,"dolby decoder unable to decode","<DEC_SampleRate>%u</DEC_SampleRate><LFEPresence>%s</LFEPresence><DEC_ChanCount>%zu</DEC_ChanCount>"}; parse errors {mode state,bass extraction mode,dap profile mode}; staticparams {boost,speakers,directdec,virt_mode,frontangle,heightangle,rearsurrangle}; dynamicparams {oarBassExtraction,dapCutOff,hfilt,vlamp,vmcal}; modes {/default,movie,disable,night,sonosdolbyconfig,"drc config is invalid"}; DRC cutoffs 100HZ-200HZ in 10Hz steps; LRR EQ {lrrse,lrrs1,lrrs2}; PCM decoder {decoder_pcm,"Invalid frame size detected %zu","Unsupported input rate detected %zu","Invalid number of input samples detected %zu","<DEC_SampleRate>%zu</DEC_SampleRate>"}

- **name:** Dolby decoder + DAP config
<details><summary>Evidence (1)</summary>

- @ 0x10fe686c — dolby

</details>

## `download_status`

**coverage** `confirmed`

The file-download result enum: ERROR_NOT_CALLED, WRITE_ERROR, TRUNCATION_ERROR, SIZE_ERROR, FILE_ERROR, CONNECTION_ERROR, DOWNLOAD_SUCCEEDED, FILE_UNCHANGED, DOWNLOAD_IN_PROGRESS. Used by firmware and resource downloads — 'unchanged' means ETag cache hit.

**Technical description:**

{ERROR_NOT_CALLED,WRITE_ERROR,TRUNCATION_ERROR,SIZE_ERROR,FILE_ERROR,CONNECTION_ERROR,DOWNLOAD_SUCCEEDED,FILE_UNCHANGED,DOWNLOAD_IN_PROGRESS}

- **name:** file download result enum
<details><summary>Evidence (1)</summary>

- @ 0x10ee9a88 — download enum

</details>

## `dsp_config`

**coverage** `strong`

The DSPConfig nanopb blob: `/opt/dsp` files (ht_config, ht_config_sat) decoded with protobuf, holding per-model bonded gains and volume breakpoint tables. Missing entries are per-model errors, not crashes — a model without a breakpoint table just lacks the curve.

**Technical description:**

files under /opt/dsp {ht_config,ht_config_sat}; nanopb decode {"Successfully decoded DSPConfig","Decoding error %s","DSPConfig file is empty","Unable to open DSP config file %s"}; per-model {"Bonded gain for '%s' not found in DSPConfig","Volume breakpoints for '%s' not found"}; breakpoints {"no default volume breakpoints specified","no bonded volume breakpoints specified, using default instead","volume (%i) and gain (%i) lengths differ in default volume breakpoints","... in bonded volume breakpoints","default (%i) and bonded (%i) volume breakpoint lengths differ","... breakpoints differ","Too many volume breakpoints ... `.nanopb_options` ... MAX_VOLUME_BREAKPOINT_LENGTH","DSPConfigParams conversion successful"}; gravity param; trueplay_version x.x.x.x fmt + range {"base version isnt valid","Start or end of range isnt a valid version","Unable to parse version from end/start string"}; "setNumChannels(%d) greater than max (%d)"; fileio {"DSP file path is longer than buffer","unable to open file","fread","file %s does not exist","Could not get size of file"}

- **name:** DSPConfig nanopb + volume breakpoints
<details><summary>Evidence (1)</summary>

- @ 0x10f249f4 — dspconfig block

</details>

## `error_codes`

**coverage** `?`

The shared error-taxonomy umbrella: muse ERROR_*, JWT errors, LLA errors, download statuses — each enumerated in its own record.

- **rze:** RZEXID_* exception ids {UPNP_TIMEOUT,UPNP_CONNECT_TIMEOUT,UPNP_EVENTING_TIMEOUT}
## `esdk_api`

**coverage** `strong`

The Spotify eSDK API table — the complete Sp* surface: connection/login (LoginBlob, OauthToken, SetConnectivity, Logout), playback (Play, Pause, Skip, Seek, SeekRelative, Volume, Shuffle, Repeat, CycleRepeatMode, BecomeActiveDevice), queue (PlayUri, PlayContextUri, QueueUri), event pump (SpPumpEvents), notify hooks (track length/error/stream events/seek complete/download position), and DRM format restriction. Every Spotify feature on-device goes through these calls.

**Technical description:**

registration {SpRegisterConnectionCallbacks,SpRegisterDeviceAliasCallbacks,SpRegisterPlaybackCallbacks,SpRegisterStreamCallbacks,SpRegisterDebugCallbacks,SpFree}; playback {SpPlaybackPlay,SpPlaybackPause,SpPlaybackSkipToNext,SpPlaybackSkipToPrev,SpPlaybackSeek,SpPlaybackSeekRelative,SpPlaybackUpdateVolume,SpPlaybackEnableShuffle,SpPlaybackEnableRepeat,SpPlaybackCycleRepeatMode,SpPlaybackSetAvailableToPlay,SpPlaybackSetDeviceInactive,SpPlaybackSetDeviceControllable,SpPlaybackIncreaseUnderrunCount,SpPlaybackSetBitrate,SpPlaybackSetRedeliveryMode,SpPlaybackIsRedeliveryModeActivated}; connection {SpConnectionLoginBlob,SpConnectionLoginOauthToken,SpConnectionSetConnectivity,SpConnectionLogout,SpGetCanonicalUsername,SpGetLoginUsername}; device {SpSetDisplayName,SpSetVolumeSteps,SpSetDeviceIsGroup,SpEnableConnect,SpDisableConnect,SpSetDeviceAliases} + {SpSetAdUserAgent,SpPumpEvents,SpZeroConfAnnouncePause/Resume,SpConnectionLoginZeroConf,SpPlayUriWithOptions,SpPlayUri,SpPlayContextUri,SpQueueUri,SpPlaybackBecomeActiveDevice,SpRegisterDnsHALCallbacks,SpGetDefaultDnsHALCallbacks,SpRegisterSocketHALCallbacks,SpGetDefaultSocketHALCallbacks,SpRegisterTLSCallbacks,SpPlaybackSetBandwidthLimit,SpNotifyTrackLength,SpNotifyTrackError,SpNotifyStreamPlaybackStarted/Continued/FinishedNaturally,SpNotifySeekComplete,SpSetDownloadPosition,SpLogRegisterTraceObject,SpRestrictDrmMediaFormats,SpRestoreDrmMediaFormats}

- **name:** Spotify eSDK API table
<details><summary>Evidence (1)</summary>

- @ 0x10fd3920 — Sp API

</details>

## `esdk_callbacks`

**coverage** `strong`

The eSDK callback registration model: playback callbacks (on_notify, on_seek, on_apply_volume), stream/delivery callbacks (on_data, on_start, on_end, on_flush, on_pos), connection (on_message, on_new_credentials), device-alias, DNS, socket (17 fn ptrs), TLS, debug, and error — each registered in a named block and removable. These are the seams where Sonos injects its behavior into the eSDK.

**Technical description:**

playback cb {on_notify,on_seek,on_apply_volume} "Successfully registered playback callbacks: %s, %s, %s"+removed; stream cb {on_data,on_start,on_end,on_flush,on_pos} "Successfully registered delivery callbacks: %s, %s, %s, %s, %s, %s"+removed; signatures {cb_stream_on_start(id=%u, size=%u),cb_stream_on_end(id=%u),cb_stream_get_position(id=%u) = %u,cb_stream_on_seek_position(id=%u, pos=%u),cb_stream_on_flush() = (id=%u, pos=%u)} + connection {on_message,on_new_credentials} registered×3; aliases {on_selected_device_alias_changed,on_device_aliases_update_done}×2; dns {dns_lookup_callback}; socket {set_opt,rd_from,wr_to,readable,writable,local_addresses,...}×17; TLS/debug/error registered; base64 alphabet

- **name:** eSDK callback signatures
<details><summary>Evidence (1)</summary>

- @ 0x10fe21f0 — callbacks

</details>

## `esdk_crypto`

**coverage** `strong`

The eSDK login crypto: RSA-2048 bignum arithmetic with a modpow workspace, the login-hello exchange whose buffer must fit SHA1 digest + two signatures + the workspace, and the entropy HAL (`hal_get_random_bytes`). This is what produces the credential blob the AP accepts — the crypto is RSA challenge-response, not a stored password.

**Technical description:**

bignum asserts {mod\[mod\[0\]\] != 0,mod\[mod\[0\]\] & BIGNUM_TOP_BIT,mlen <= 2048 / BIGNUM_INT_BITS} = RSA-2048; login asserts {gen/genctx/s/send_buf/send_buf_size != NULL,send_buf_size >= sizeof(s->ctx.hello.data),work_buf_size >= MODPOW_WORK_RAM_SIZE,resp/respsz/buf/bufsz/failed != NULL,bufsz >= SHA1_DIGEST_SIZE + SIG_SIZE + SIG_SIZE + MODPOW_WORK_RAM_SIZE} = SHA1+dual-signature+modpow; "login failed (error code %d)"; "no memory to check signature"; "Platform identifier: '%s'"; "logging in with client ID %s"; "!"hal_get_random_bytes() failed""; circular buffer {cb->used <= cb->size,n <= cb->used,cb->used + data_size <= cb->size,dest != source,circular_buffer_available_space}

- **name:** eSDK login crypto
<details><summary>Evidence (1)</summary>

- @ 0x10fe2824 — login crypto

</details>

## `esdk_internals`

**coverage** `strong`

The eSDK internals below the API: AP connection layer, TLV framing, mercury/hermes channels, CDN fetcher, DRM key/IV lifecycle, track pipeline, socket HAL, bandwidth meter, and the login crypto (SHA1+signature+modpow). Documented per-subsystem; this is the umbrella.

**Technical description:**

build "HEAD-v3.205.205-gd0f06121-dirty" for Sonos_PPC_e500v2s; notify enum {kSpConnectionNotifyReconnect,LoggedIn,Disconnect,TemporaryError("underlying Spotify error = %d, underlying OS error = %d, reconnect attempt in %u seconds"),kSpPlaybackNotifyBecameInactive/BecameActive,Pause,Play,AudioDeliveryDone,Next,Prev,MetadataChanged,ContextChanged,TrackChanged,Shuffle,Repeat}; errors {SpCallbackError "underlying Spotify/OS error","Track playback logging failed. Logout forced.","Connection state changed: %d -> %d","STREAM_CAPPED: underlying error","SP_EVENT_NOTIFY_TRACK_FAILED: underlying error",kSpErrorContextFailed,kSpErrorDuringLogout,"Still logged in. Logging out first.","RelativeSeek %i: current_position:%u -> new_position:%u","No connection available for login","Parsing ZeroConf blob failed with code %d","password is too long","Spotify server did not send image URL","Event overflow:",tsv_lost}; init validation {"api_version provided does not match expected (%d != %d)","Invalid device_type: %d","No memory block (%p) or invalid size (%u)","No unique_id set","display_name or device_aliases not set","Not allowed to fill both display_name and device_aliases","Either display_name or device_aliases must be set and not both","host_name not set with zeroconf_serve:%d","brand_name, model_name, client_id, os_version and/or scopes not set correctly (%d%d%d%d%d)","invalid max_bitrate:%d"}; config rules {scope/os_version/client_id must not be NULL,printable chars,length limits}; credential blob {"Can't invoke SpCallbackConnectionNewCredentials because no blob has been received","received blob has an invalid type","encryption failed","base64-encoding failed","Unable to create reusable login token"}; aliases {"Received alias index when aliases are not in use","Selected alias index out of bounds","No alias at selected index"}; image spotify:image:; trace levels {TPAPI,PLAY,DELIVERY,API_TRACE,VERBOSE,ANL}; trace fmts {"%s(%p, API v%d)","%s \[returned value: %d/%s\]"}; ~60 binary-resident sp_<md5-hex> identifiers (hashed config/credential slots)

- **name:** eSDK internals (v3.205.205)
- **device_types:** {CARTHING,HOMETHING,COMPUTER,TABLET,SMARTPHONE,SPEAKER,AUDIODONGLE,GAMECONSOLE,CASTVIDEO,CASTAUDIO,AUTOMOBILE,SMARTWATCH,CHROMEBOOK}
- **session:** desc fmt "%.*s;%.*s;%.*s;%.*s;tpapi"; device_id assert "result == device_id + SHA1_HASH_LENGTH * 2 && *result == '\0'"; {sonos_ppc,"socket init failed","Failed to initialize module subsystem! Error %d","Failed to initialize tls with %d","Failed to get entropy for PRNG","No data to play, will pause playback if network is not reconnected within %dms","Notifying kSpConnectionNotifyLoggedOut","reinit_session failed with error %d",kSpErrorFailed,validate_no_api_reentry_status,"3.205.205-gd0f06121",accesstoken,GROUP,"Decrypting ZeroConf blob failed","Login with username '%s', blob '%s', tokentype '%s'"}; track notify {"Notify: track %d length: %u ms","track %d error at position: %u ms is '%s'","track %u playback started at timestamp %llu ms","Integration reported invalid track to start/finish","Invalid track %u, expected %u","DLBUFFER CLEAR"}
<details><summary>Evidence (1)</summary>

- @ 0x10fd4c24 — eSDK internals

</details>

## `evo_decoder`

**coverage** `strong`

The Dolby Evolution decoder — the DDPI UDC path used for newer Dolby bitstreams (MAT/Atmos-era). It allocates static+dynamic decoder memory, processes input in timeslices, and pulls per-frame metadata. Malformed-signal detection is built in. Only present on home-theater products; explains decoder errors logged as UDC timeslice failures.

**Technical description:**

{"Failed to query static params! %d","unable to close evo decoder error: %d","Failed to extract MD Evolution! ERROR %d","Unable to get evolution metadata","Failed to query Evolution decoder memory! Evolution err: %d","Failed initial query","Failed to allocate enough memory","Failed to allocate %llu static/dynamic byte for Evolution decoder!","Failed To Init Evo Decoder"}; UDC {udcMutex,"ERROR: %d getting frame metadata","Malformed input signal detected %d","ddpi_udc_timeslicecomplete returned %d","ERROR: %d Processing timeslice","ERROR: %d getting timeslice metadata"}

- **name:** Dolby Evolution decoder (DDPI UDC)
<details><summary>Evidence (1)</summary>

- @ 0x10fe6f40 — evo decoder

</details>

## `expat`

**coverage** `strong`

The vendored Expat 2.5.0 XML parser: billion-laughs amplification accounting (direct/indirect byte counts with amplification ratio), debug env vars (EXPAT_ACCOUNTING_DEBUG and friends), /dev/urandom entropy with fallback, and attribute-type handling. Every XML parse in the firmware — SOAP, DIDL, ZGS — runs through this copy.

**Technical description:**

version expat_2.5.0; billion-laughs accounting "expat: Accounting(%p): Direct %10llu, indirect %10llu, amplification %8.2f" + debug env {EXPAT_ACCOUNTING_DEBUG,EXPAT_ENTITY_DEBUG,EXPAT_ENTROPY_DEBUG}; entropy /dev/urandom + fallback(4); attr types {CDATA,IDREF,IDREFS,ENTITY,ENTITIES,NMTOKEN,NMTOKENS}; xml namespace; errors {no element found,not well-formed (invalid token),unclosed token,partial character,mismatched tag,duplicate attribute,junk after document element,illegal parameter entity reference,undefined entity,recursive entity reference,asynchronous entity,reference to invalid character number/binary entity/external entity in attribute,"XML or text declaration not at start of entity",unknown encoding,"encoding specified in XML declaration is incorrect",unclosed CDATA section} + errors {error in processing external entity reference,document is not standalone,unexpected parser state,entity declared in parameter entity,"requested feature requires XML_DTD support",cannot change setting once parsing has begun,unbound prefix,must not undeclare prefix,incomplete markup in parameter entity,XML/text declaration not well-formed,illegal char in public id,parser suspended/not suspended/parsing aborted/parsing finished,cannot suspend in external parameter entity,reserved prefix xml/xmlns rules,"limit on input amplification factor (from DTD and entities) breached"}; config {XML_DTD,XML_CONTEXT_BYTES,XML_NS,XML_BLAP_MAX_AMP,XML_BLAP_ACT_THRES,XML_GE}; DTD keywords {SYSTEM,PUBLIC,ENTITY,ATTLIST,ELEMENT,NOTATION,CDATA,REQUIRED,FIXED,EMPTY,PCDATA,NDATA,INCLUDE,IGNORE}; decl {version,encoding,standalone}; encodings {UTF-16LE,UTF-16BE,UTF-8,US-ASCII}

- **name:** expat 2.5.0 XML parser
<details><summary>Evidence (1)</summary>

- @ 0x10fb2548 — expat

</details>

## `feature_config`

**coverage** `strong`

The complete `featureConfig` schema — the cloud-pushed feature document: flags for Spotify adaptive bitrate + Connect-for-all-accounts, metrics config URLs, preferred RP container, voice data collection, partner integrations (Lutron, Amazon Music DASH, Apple Music HLSv7, TuneIn replacement/migration), semiSleep, trueplay data collection, dropout context, and more. It explains behavior differences between households on identical firmware.

**Technical description:**

{disableWebSocketPerMessageDeflate,metricsConfigURL,metricsConfigV2URL,preferredRPContainer,spotifyAdaptiveBitrate,enableSpotifyConnectForAllAccts,enableSpotifySMAPIVolumeNormalization,zoneExperiments,metricsService,enableVoiceDataCollection,enableSvcHomeControlLutron,enableSvcPlus,enableAmazonMusicDASH,enableAppleMusicHlsv7,enableTuneInReplacement,enableTuneInMigration,semiSleepConfig,enableTrueplayDataCollection,dropoutContext,enableSystemAPIV2,enable3ChannelSatellites,enableHTSNKv2,disableTlsRsaCiphersuites,enableSPSDataCollection,enablePortableSurrounds,aiseMinThreshold,enableMaxDialogueLevel,enableRemoveMSPCredentialsFromUPnP,thorTimeout,enableChsrcPerfOptimizations,enableUPnPEventingGNDOptimization,enableSecureAlbumArt,enableCEP20ThreadTweaks,smartPlayConfig,debounceWindowMilliseconds,debounceWindowMillisecondsCEP20,useLegacySpotifySmapiPlayback,quickbondingConfig,ssdpAdvertiseConfig,enablePitchfork,enableSslClientCacheRefresh,plink,enableDhcpProxyFailureTelemetry,homeTheaterWifiPerfTelemetry,enableOnDeviceSoundGeneration,enableRadioSocTemperatureTelemetry,enableHomeTheaterWifi6GHzFronthaul,reportHtSurrounds,reportHtSwap,reportPortableSurrounds,wifiTxRateThreshold,wifiLatencyThresholdMillis,requests,frequencyMins,delayRandPct,enableQuickbonding,enabledHT,thresholdDC,dropoutSensitiveDC,ssdpBroadcastOnlyZonePlayer1,ssdpAdvertiseOnlyEssentialServices,numLFEChannels,numHeightChannels,streamDescription,groupingLatency,enableTrueRoom,enableFlexibleSurroundsTuning,enableVirtualHeight,systemResult,numDevices,numUpdatedDevices}

- **name:** featureConfig complete schema
<details><summary>Evidence (1)</summary>

- @ 0x10f9bef8 — featureConfig fields

</details>

## `group_mgmt`

**coverage** `?`

The GroupManagement service: bonded-group lifecycle (stereo pairs, surrounds) — create/remove/validate plus the evented membership state.

- **ops:** {SetSourceAreaIds,pause,play,copyMusic(%s to %s),becomeStandalone(retry),joinGroup(%s to %s,retry),groupsCommand} + upnpError; topology guards {invalid topology state empty pid/gid,inconsistent topology state invalid gc or pid count}; music context {cannot be copied,cannot be swapped}; faults {Grouping action failed,Invalid grouping action,Invalid args,Action not authorized,Grouping action failed (default)} + groupId; cloning {clone music from %s to ungroupable %s,create new group and cloning from ungroupable player}; params {Effective set of players to group,Creating group with undefined future coordinator hint,playerIdsToRemove array,playerIdsToAdd array,Effective set of new group members}
## `hermes`

**coverage** `strong`

The mercury/hermes channel layer for Spotify: `hm://hwptp/*` URIs carry device state (volume, play, shuffle, repeat, queue, pull_playback) between the cloud and the Connect session, plus content-encryption-key and offline-restriction channels. Push messages arrive over the AP connection as defragmented packets; rate limiting with `Spotify-Unavailable-For` throttles sends. It's the control plane that makes Spotify Connect work.

**Technical description:**

roots {hm://hwptp/v1/devices,hm://hwptp/v1/tsv,hm://hwptp/v1,hm://hwptp/v2/resolve/%s/%d/%s}; device subs {%s/devices/%s/state,state_conflict,volume,play,set_shuffle,set_repeat,pull_playback,queue}; media {%s/content_encryption_key/%s,%s/cache_key,%s/offline/restrictions}; fields {random,checksum}; "!"Action not handled""

- **name:** hermes/hwptp channels
- **rate_limiting:** {"Spotify-Unavailable-For" header,"Request to %s failed with %d Too many requests","%d Service unavailable (%d)","Rate limiting active, and set to %llu ms","Message not sent: rate limited for %llums more.","Rate limiting deactivated"}; {"Failed to decode HermesHeader: %s","Got hermes push from %s","Got hermes uri %s status_code %d"}; defrag {"Defragmentation buffer size %d, cannot fit extra %d bytes (max size: %d)","Could not fit packet to defragmentation buffer, clearing the buffer"}; req "id %u method %d uri %s %d bytes"; mime vnd.spotify/mercury-mget-request; UNSUB; "timeout >= 0 && timeout <= 255"
<details><summary>Evidence (1)</summary>

- @ 0x10fd6244 — hermes

</details>

## `ht_telemetry`

**coverage** `strong`

The TV input-session report (`zpHTInputSession`): per-session correlation id, connection type, coordinator UUID/boot-seq, session/play durations, input rate, burst type, content type, and forced flag — tagged `tv_usage`. This is the telemetry behind 'how is the TV input being used' analytics.

**Technical description:**

schema {corrId,cid set/clr,sessionLength,sessionPlayTime,connectionType,GCUUID,GCBootSeq,GCTimeStart,GCTimeEnd,inputRate,dataBurstType,contentType,playSeconds,forced,topoType}; tags {tv_usage,zpHTInputSession}

- **name:** TV input-session report (zpHTInputSession)
<details><summary>Evidence (1)</summary>

- @ 0x10ea7b44 — tv_usage fields

</details>

## `htaudio`

**coverage** `?`

The home-theater audio path: TV input capture, channel processing, satellite transmission, and autoplay for HT sources. Its session lifecycle (start/play/stop with topology tracking) is reported through `zpHTInputSession` telemetry; the IR learn and CEC subsystems hang off it for remote control.

- **tv_session_fields:** `cid set/clr`, `corrId`, `sessionLength`, `sessionPlayTime`, `connectionType`, `GCUUID`, `GCBootSeq`, `GCTimeStart`, `GCTimeEnd`, `inputRate`, `dataBurstType`, `contentType`, `playSeconds`, `forced`, `topoType`, `zpHTInputSession`
- **core:** htcZonePlayer: per-role "%s delay: %uus, gain: %f" for surrounds/sub/group-member-down-mix; "changing surround mode. old %d new %d"; "changing tv surround lvl"/"changing music surround lvl"/"changing height channel lvl"; "sub changing %zu to %zu"; "Set %s signal rate: %zu"; events SatConfigEvent/TVSignalDetectedEvent/TOSLinkConnected/IRRepeaterState; "Orientation %s"
- **satellite_tx:**
  - **control_frame:** "sending control frame: ctrl 0x%x unscV %d curV %d extV %d extVM %d B %d T %d led %d SPL %d SC %d" — {ctrl flags, unscaled/current/ext volume, extV-muted, B, T, led, SPL, SC}
  - **audio_frame:** "pkt: %zu channels, %zu samples, payload:%zu, rl:%d" — multichannel framed audio; "Last audio frame %d"; "frame serialization failed"
  - **sat_mgmt:** "satellites active \[0x%x\]" mask; "bonded sub(s) %zu"; satellite sub receives non-sub channels; "Sonar center delay %d samples, %d usec"; play start/end handled with disabled sats; "changing surround time delta mode"; "sample type changed"; "Request resync"; volume/mute/LED propagation ("vol change %u (%u%%) -> %u","mute change %d -> %d","LED brightness %d -> %d"); "Send playback ended if count %d > 0 or remote audio disabled %d"
- **tx_stats:** counters {timeToPlay="Time between send and play",txSent="Total bytes transmitted",txErrors,serializationErrors,numLateFrames="late to transmit a frame","Total resynchronization frames",playbackEnd="Total playback ended frames",mx_proc="Highest SatMixer processing time",tx_proc="Highest SatTx processing time"} — "HT Audio Satellite TX General"
- **surround:** per-channel "%s delay: %uus, gain: %f"; surrounds/sub/group member down mix %s; "changing surround mode. old %d new %d" + "changing tv surround lvl" + "changing music surround lvl" + "changing height channel lvl" + "sub changing %zu to %zu"; "Set %s signal rate: %zu"; SatConfigEvent; "TV signal %s"; htcZonePlayer; Orientation %s; TOSLinkConnected; IRRepeaterState; TVSignalDetectedEvent
- **config_schema:** <HTConfig><General>{Version,SurroundState,SubState,GMDownMixState,DialogEnhancementLevel,AISEDynamicLatency,AISpeechEnhance,MusicSurroundLevel,TVSurroundLevel,HeightChannelLevel,AutoPlay,AutoPlaySilenceThresh(%us),AutoStop,AutoStopSilenceThresh(%us),NightMode,SurroundMode,Tweaks(0x%08X),PrimaryEthernet,WirelessEnabled,StartupLatency(%uus),DialogDelay(%ums),FrontSatDelay(%uus),TVGroupMemberDelay(%uus),SatelliteVersion,SatelliteTotal,SatelliteSubs,SatelliteTxMixerRate(%2.1fms)}</General><Satellites><Satellite>{Channel,Delay(%uus),Gain,IP,Eth,WiEna}</Satellite></Satellites></HTConfig>
- **latency:** delays {"HT audio base latency %uus","Invalid dialog delay value %u > %u","Dialog delay %ums","Front sat delay %uus","HT audio group latency %uus","Invalid surround delay %d for %s","%s surround delay %u gain %f"}; origin-time formula "New origin time: %u.%u, read time: %u.%u, delay: %uus (startup: %u + lipsync: %u + frontSat: %u), tvp delay: %lluus"; "Satellite origin time %d.%d"; "Group member origin time: %i.%i was extended by %uus"; tweaks "HT tweaks updated %08x"; sat pkt "%zu channels, %zu samples ea."
## `http_cache`

**coverage** `strong`

The HTTP cache semantics: stale-while-revalidate, stale-if-error, no-store, public/private directives mapped to a status enum (fresh, stale, stale_revalidate, stale_use_if_server_error, populated, refreshed, rejected). Cache correctness for browsed art/metadata lives here.

**Technical description:**

directives {stale-while-revalidate,stale-if-error,no-store,private,public}; statuses {get_status_not_found,get_status_fresh,get_status_stale,get_status_stale_revalidate,get_status_stale_use_if_server_error,set_status_populated,set_status_refreshed,set_status_rejected}; "%s for key <%s> in cache <%s>"; "invalid cache key or record on set: \[keylen=%zu\] \[bodylen=%zu\] \[etaglen=%zu\] \[cclen=%zu\]"; "cache not updated due to no-store directive"

- **name:** HTTP cache semantics
<details><summary>Evidence (1)</summary>

- @ 0x10f96794 — httpcache

</details>

## `http_engine`

**coverage** `?`

The device's embedded HTTP engine: route tables (master + secondary status registry), the static/exec page dispatch, CSRF gating, and the auth plumbing that fronts every `/status`, `/tools`, and exec endpoint. The route records in this reference are its registration tables.

- **auth_challenge:** two-step: "First Response: \[%s\] \[%s\] \[%08x\] \[%d\]"/"Second Response: ..."; headers X-Sonos-Mac/X-Sonos-Serial; cred body {"credentials":"%s","nonce":"%s","keyType":%d}; HTTP/1.{0,1} 401 retry; sonoscloudstatus endpoint; httpcaches.json + "\[%s\] Force-cleared cache"
- **hhsettings_api:** category REST paths public/{key}, restricted/{key}, restricted-admin/{key}; errors {Key not found,Failed to delete setting,invalid value size or type,HHSettingsMgr reported invalid value,Failed to store setting,"Deleting all settings in a category is not allowed. Provide a key.",Unsupported Request}; /overrideconfig POST form-urlenc → commit override file → <meta refresh url=/fcs>; JSON parser errors {Exceeded max depth,Invalid unicode escape,Invalid escape,Invalid string character,Invalid numeric character,Unexpected token,Sequence too long,Missing required value,Invalid value,Out Of Memory,Unexpected error}
- **cookies:** bounded cookie jar "Exceeded max cookie count of %d, overwriting cookie %d/%d" + Domain attr + "unable to send complete list of cookies"; UA strings {"Linux UPnP/1.0 Sonos/%s (%s)","Sonos/","PlayToSonos/"}; WD100 tag; MAC fmt variants {:,-,none,upper,lower}
- **session:** session state "Session status 0x%x connected %d wantWrite %d wantRead %d"; HTTP 206 partial-content accepted (range requests); "Remote close hostname %s FD %d"; SSL session cache "Cached SSL session for %s:%d"
## `http_headers`

**coverage** `?`

The HTTP header vocabulary the device emits and parses: auth challenges, `X-Sonos-*` extensions (playback-id, VLI markers), GENA headers for eventing, and the content-negotiation used by SMAPI and cloud calls. Quirks like malformed substitution anomalies are preserved in the route records.

## `ibt_planner`

**coverage** `strong`

The planner half of intended-target execution: generates the target list, parses implicit vs explicit targets ('implicit target parsed \[...\]' / 'explicit target parsed \[...\]'), and rejects commands that don't support the intendedTargets parameter or that aren't in the IBT-eligible set ('unsupported IBT command'). Plan-generation failures are logged distinctly from execution failures — a command can be well-formed but unplannable, and a generated plan can still fail per target at dispatch time.

**Technical description:**

{"already generated ibt plan, no action taken","executing ibt plan for command (%s)","failed to generate target list for command (%s)","failed to generate ibt plan for command (%s)","implicit target parsed \[%s\]","explicit target parsed \[%s\]","invalid intendedTargets parameter","command does not support intendedTargets parameter","invalid muse command body format"}; JWT cert chain {"Unable to parse JWT token","Unable to load root bundle","Can't get client device certs","JWT cert validation finished: %s"}

- **name:** IBT (intended-target) command planner
<details><summary>Evidence (1)</summary>

- @ 0x10fac5a4 — ibt planner

</details>

## `ibt_plans`

**coverage** `strong`

IBT ('intended targets') is how cloud-issued household commands fan out to specific players. A command arriving over the muse channel is compiled into a 'plan' — a generated target list — then dispatched one target at a time with a per-target result ('\[dispatch\] dispatched (cmd) to target (player), result \[...\]'). The targets are players and/or areas ('no players or areas were specified'); plans are idempotent ('already generated ibt plan, no action taken'). Dispatched commands authenticate outbound with a bearer token plus the X-Sonos-Type header, and a protocol-version compatibility check runs before forwarding. The observed command surface is group/zone management — '\[group\] adding player to group', 'created new group' — matching the 'zones' verb namespace (activateZone, joinZone, unjoinZone, addZoneDefinition, updateZoneMemberSettings...). It is feature-gated by enablePitchfork. The plan serialization format itself and the full whitelist of IBT-eligible commands are the pieces still undecoded.

**Technical description:**

a remote-management command executor: commands named in log domain 'ibt' are compiled into 'plans' (a generated target list — 'failed to generate target list for command (%s)'), then dispatched per-target with per-target results ('\[dispatch\] dispatched (%s) to target (%s), result \[%s\]'); gated by the enablePitchfork feature flag checked at init

- binary anchors: `executing ibt plan for command`, `unsupported IBT command`, `enablePitchfork`

- **unresolved:** full command vocabulary (only 'ibt' command-name seen in dispatch compare), plan serialization format, what the targets are (players in household?), what enablePitchfork bundles
- **mechanics:** executor f_10b985c4: look up command → generate ibt plan → generate target list → for each target '\[dispatch\] dispatched (%s) to target (%s), result \[%s\]'; 'already generated ibt plan, no action taken' = idempotent re-entry; 'unsupported IBT command (%s)' rejects unknown verbs
- **dispatch_vocabulary:**
  - **log_domain:** \[dispatch\] / \[group\]
  - **lines:** `\[dispatch\] dispatched (%s) to target (%s), result \[%s\]`, `\[dispatch\] unsupported IBT command (%s)`, `\[group\] adding player \[%s\] to group`, `\[group\] forwarding player \[%s\]`, `\[group\] created new group \[%s, %s\]`, `\[group\] created new group, but no GC!`, `\[group\] no players or areas were specified`, `validateProtocolVersionCompatibility`
  - **targets:** 'players or areas' — intendedTargets names players and/or areas; implicit vs explicit target forms parsed separately
  - **transport_headers:** `bearer`, `X-Sonos-Type`
  - **provenance:** literal block .rodata 0x10ec78a8-0x10ec79dc
- **zone_command_namespace:** The '{verb,namespace}' registry tail at .data 0x11094380-0x110943f4 binds these verbs to namespace 'zones': subscribe, unsubscribe, getActiveZoneList, getZoneDefinition, getZoneDefinitionList, addZoneDefinition, addMissingZoneDefinition, updateZoneDefinition, updateActiveZone, updateZoneMemberSettings, removeZoneDefinition, activateZone, deactivateZone, joinZone, unjoinZone — terminated {0xffffffff,0xffffffff}. Same record format as the main muse_verb_ns_registry @0x110941d8.
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

**coverage** `strong`

The IR receiver subsystem: learned code lists for vol_up/vol_down/mute/input (bounded, 'list full'), config in `/opt/ir/irconfig.txt`, hex `%02x` encoding, and device open/descriptor errors. On HT products this is how a TV remote's volume keys reach the speaker.

**Technical description:**

encoding %02x%%20/%02x hex; lists {vol_up_codes,vol_down_codes,vol_mute_codes,input_codes} with "Cannot add X: list full." bounds; config /opt/ir/irconfig.txt + ":vol_up_codes:" keys + "IR not configured"; device {"Failed to open IR device!","Could not get IR file descriptor!","Loading active codes...","IR Controls %s"}; learn FSM {Capturing short code,"Short code is first of a series. Ignored!",Storing short code,"short so far %d and max: %d",Successful short code learn,First short long code learned}; algorithm {"Pass %d length %d learn count: %d",hex dumps,"first and third passes have different sizes!","don't match!","Insufficient redundancy in alternate code.","Successfully recognized code as Alternating.","Successfully recognized repeat code.","Mismatched short messages in suspected repeat code.","Successfully recognized a non - repeating code.","Learn summary: Success/Repeat style/Alt style %c","Over ten codes received... not a repeat style code","Ignoring excessively long code"}; one-button {"Entered one button learn",waiting/"no longer waiting",UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND,"One button code not found in DB due to timeout","Timeout during IR code learn for target %s"}; embedded remote DB {Sharp,LG / Haier TV L32D1120,Samsung,Panasonic,Toshiba,Mitsubishi,Philips,Pioneer,Dynex,RCA TV 46LA45RQ,Orion TV SLED3280-HDLCD3250,Mitsubishi WD-65638 & WD-60738,JVC TV JLC42BC3000 & LT-19E610,Seiki TV LC-32B56,SuperSonicSC-240 & 491,ViewSonic VT4210LED & VT3205LED,Loewe}; targets {VolUp,VolDown,VolMute}; DB ops {"attempting to add null remote","add remote to full db","too long a controller name","excessively long main/alt/repeat code",Uninstalled all codes}; cloud: submit POST http://ir.ws.sonos.com/IRCode/ XML <IRCode><code><value>%s</value></code><guid>%s</guid></IRCode> (guid via /dev/urandom); lookup "Requesting: %s" → "Code found for remote id \[%s\]!" / "Requested code not found in IR database"; "Outstanding codes yet to be learned: Lengths are: %d, %d, %d"; "Denylisted pyle!"

- **name:** IR decoder + learn + cloud DB
- **mechanics:** debounce FSM {"debouncer: recent becomes true","debouncer: bIsRepeat = true","currently playing/not playing","handling debounced mute/input/volume up/volume Down","will try auto play","handling raw generic repeat/volume up/volume down/volume mute/input code","Handling IR decoder testpoint press action"}; cmds {vol_up,vol_down,IR Volume Up,IR Volume Down,IR Mute,IR Input}; histogram decode {"Histogram contains no peaks at all. decode fails","Histogram contains no second peak.",avgA/avgB,threshold,"biphase pulse too long %d","too many raw bits!","pulse width coding with threshold of \[%f\]","pulse distance coding with threshold of \[%f\]"}; {"*****  unrecognized/recognized %d  *****"}; "Could not read IR data. (%d, read: %zd)" + "IR Event read: %zd, msgcount: %u"; select events selthrd.RIRDecoder.{reset,data,except,timeout}
<details><summary>Evidence (1)</summary>

- @ 0x10ea6550 — irdecoder block

</details>

## `jwt_auth`

**coverage** `strong`

The JWT layer for muse and device tokens: HS256 signing, X.509-chain (x5c) validation, and a granular error taxonomy (malformed header/payload/signature, untrusted chain, missing private key). Device tokens are minted via `POST oauth.{env}ws.sonos.com/oauth/v4/pdsw` with a jwt-bearer grant. Every authenticated muse command parses a token through this layer first.

**Technical description:**

JWT errors {JWT_FAILED_TO_B64_ENCODE/DECODE,INPUT_JWT_MALFORMED,HEADER_INVALID,PAYLOAD_INVALID,SIGNATURE_INVALID,ALG_UNSUPPORTED,ALG_MISSING,X5C_MISSING,X5C_INVALID,X5C_UNTRUSTED,PRIVATE_KEY_MISSING,PRIVATE_KEY_INVALID,OUTPUT_JWT_SIGNING_ERROR,OUTPUT_JWT_INVALID_STATE}; alg HS256; endpoint POST https://oauth.{env}ws.sonos.com/oauth/v4/pdsw; grant urn:ietf:params:oauth:grant-type:jwt-bearer; aud urn:sonos:hhid:/urn:sonos:unit-hhid:; scope playback-control-all; keys {guestPermissionsPolicyKey,network_hash}; PIN {PIN Auth not available PIN not set,Invalid PIN,Invalid or expired nonce,Failed to generate nonce}; errors {Forbidden,Unauthorized,"Failed to get the real/relative time","Failed to stringify JWT","Device failed to generate device/guest token","Invalid Base64 encoded JSON object","Device unavailable due to other requests","Player not securely registered","An unexpected grant type was provided","An invalid JWT was provided. Reason:","A malformed JWT header/payload was provided","Player not in the assertion's aud field","POST /authorizeDevice request failed"}; claims exp+rexp {"exp is missing","Invalid exp value","Expired exp value",same for rexp}; token validation {"Device token not minted in this HH","Token is expired, security settings have changed since the token was issued","Device token expired","missing/invalid expiration time","not minted by this device","Device token is valid"}; statuses {MALFORMED,REVOKED,HOUSEHOLD,INVALID_REQUIRED_VALUE,NOT_MINTED_THIS_DEVICE}; muse_token_inspector; roles {VOICE_ASSISTANT,GUEST,ADMIN,EMPLOYEE}

- **name:** muse JWT/device-token auth
<details><summary>Evidence (1)</summary>

- @ 0x10f988e4 — JWT block

</details>

## `korn_events`

**coverage** `strong`

The eSDK 'korn' event enum — ~70 lifecycle events: INITIALIZED/SHUTDOWN, WEBSERVER_START/STARTED/UPDATED, ZEROCONF_* (device added, credential transfer, auth token/code), MDNS_* (pause/resume/devices/discovered), and more. This is the Connect stack's internal pub-sub — each event carries the payload the module kernel dispatches.

**Technical description:**

{KORN_INITIALIZED,KORN_SHUTDOWN,WEBSERVER_START,WEBSERVER_STARTED,WEBSERVER_UPDATED,ZEROCONF_START,ZEROCONF_DEVICE_ADDED,ZEROCONF_TRANSFER_CRED,ZEROCONF_TRANSFER_STATUS,ZEROCONF_AUTH_TOKEN,ZEROCONF_AUTH_CODE,MDNS_START,MDNS_PAUSE,MDNS_RESUME,MDNS_DEVICES,MDNS_DEVICE_DISCOVERED,MDNS_DEVICE_EVICTED,MDNS_RETRIGGER_DISCOVERED_DEVICES,HOSTNAME,PLAYBACK_RESUME,PLAYBACK_RESUMED,TRACK_RESUME,OBSERVE_PLAY,SKIP_NEXT,SKIP_PREV,PLAYBACK_SEEK,PLAY_URI,QUEUE_URI,QUEUE_FINISHED,TRACK_STARTED,SET_SHUFFLE,SET_REPEAT,INTERNAL_SHUFFLE,INTERNAL_REPEAT,CONNECT_SET_VOLUME,AUDIO_DELIVERY_DONE,CONTEXT_FAILED,TW_UPDATED,PLAY_FALLBACK_FILE,QUEUE_FILE,TRACK_FINISHED,TRACK_FAILED,NOTIFY_TRACK_FAILED,INTERNAL_TRACK_STARTED,MEDIA_SEEK,PLAYBACK_INITIATED,PREVIOUS_POSITION,PLAYBACK_PROGRESS_STARTED,SET_DOWNLOAD_POSITION,NOTIFY_INTEGRATION_PLAYBACK_STARTED,NOTIFY_INTEGRATION_FINISHED_TRACK,NOTIFY_INTEGRATION_HAS_TRACK_LENGTH,NOTIFY_TRACK_ERROR,SEEK_COMPLETE,EXTERNAL_UNDERRUN_COUNT_POINTER,NOTIFY_STREAM_DELIVERED,STREAM_START,STREAM_START2,STREAM_STOP,STREAM_STARTED,STREAM_FINISHED,STREAM_FAILED,STREAM_CAPPED,FILE_SIZE,DATA_DOWNLOAD_LATENCY,CONNECTIVITY,DBG_DECODER_STARTED,DBG_DISCONNECT,DBG_UNDERRUN_TIMEOUT,DBG_DOWNLOAD_UNDERRUN,DBG_MDNS_ANNOUNCE,DBG_RESOLVE,DBG_PERIODIC_STATE_UPDATE,DBG_SET_KEY_RATE_LIMIT_ERROR,DBG_FORCE_STATE_UPDATE,DBG_INTERNAL_CDN_FINISHED,HWP_VERSION,ITEM_LIST_CHANGED,LOGOUT_REQUESTED,AP_CREATED,AP_CONNECT_ERROR,AP_DISCONNECTED,CONNECTION_STATE_CHANGED,AP_LOGIN,AP_SET_SESSION,NEW_PRODUCT_STATE,AP_LOGIN_OFFLINE,LOGIN_OFFLINE_ERROR,TPAPI_STATE_CHANGE,TPAPI_SHARED_STATE_POINTER,CACHE_ID,CACHE_KEY} + {OFFLINE_RESTRICTIONS,CACHE_RESTRICTIONS,OFFLINE_WAS_REQUESTED,API_RATE_LIMIT,AD_STREAM_TIME_POINTER,INIT_DONE,UPDATE_PLAYBACK_POS,SEEK_COMPLETED,MEDIA_SEEK_COMPLETED,ENDSONG,ENDSONG_FAILED,ACCESS_POINT_HOST,CONNECT_NAME,VOLUME_STEPS,GROUP_STATE,DISABLE_CONNECT,UPDATE_AD_USERAGENT,UPDATE_ALIASES,SELECTED_DEVICE_ALIAS_INDEX,CAN_PLAY,LOCAL_APRESOLVE,LOCAL_AP_PING_TIMEOUT,CONTEXT_STATE_POINTER,CONTEXT_OFFSET_OFFLINE,IMAGE_BASE_URL,STORAGE_MANAGER,SM_CACHE_CLEARED,PULL_PLAYBACK,PULL_PLAYBACK_NO_PLAYBACK_INTERRUPTION,UPDATE_CAPABILITIES,LOGGED_OUT,RELOGIN,DOWNLOAD_BITRATE_LOW,DOWNLOAD_BITRATE_HIGH,REQUEST_BITRATE,LOCK_BITRATE,NETLOG_START,NETLOG_CALLBACK,BANDWIDTH_LIMIT,STREAMER_TRACK_PERCENTAGE,OFFLINE_GET_ITEMS_IN_CONTAINER,REDELIVER_AUDIO_AT_RESUME,ACTIVATE_OFFLINE_PLAYER,ACTIVATE_ONLINE_PLAYER,NOTIFY_OFFLINE,CONNECTIVITY_CHANGE_REQUEST,RESOLVE_OFFLINE,OFFLINE_RESOLVE_FINISHED,CURRENT_OFFLINE_ITEM_POINTER,SHUFFLE_SEED}; modules {MediaOut,APConn,Streamer,TrackPlayback}

- **name:** korn event enum (~70)
<details><summary>Evidence (1)</summary>

- @ 0x10fd6ce8 — korn events

</details>

## `korn_kernel`

**coverage** `strong`

The eSDK module kernel: a temp-RAM arena allocator with strict accounting (num_allocs, free pointer, alignment, MAX_KORN_TEMP_RAM_ALLOCS), an event-count guard (SP_MAX_EVENTS), and the pump loop that dispatches korn events to modules. The memory discipline is why Connect survives long sessions without leaking.

**Technical description:**

asserts {korn_ptr->_temp_ram_num_allocs == 0,korn_ptr->_temp_ram_free == (char *)korn_ptr->_temp_ram,aligned_size <= available_ram,korn_ptr->_temp_ram_num_allocs - 1 < MAX_KORN_TEMP_RAM_ALLOCS,ptr == korn_ptr->_temp_ram,sp_korn_event_count() < SP_MAX_EVENTS}; {"module %s pump returned error","%d is more than free space %td","!!! Too many requests/returns of temp ram!","Module requested %zu bytes","Ignoring recursive calls","event_loop_counter--","Initializing module %s","Module %d (%s) failed to initialize.","Event %d discarded, queue full","Module %d failed to shutdown. Possible memory leak."}; timers {"Timer scheduled for now+%lums. #timers=%lu","No free timer slots","Attempting to access unavailable timer. id=%d","Stopping unavailable timer. id=%d"}; korn_ptr/module_manager

- **name:** eSDK korn module kernel
<details><summary>Evidence (1)</summary>

- @ 0x10fd690c — korn

</details>

## `lechmere`

**coverage** `?`

The lechmere event channel: the persistent cloud pipe carrying muse commands in and device events out — `{scope}/{ns}/{verb}` route templates define its addressing.

- **cloudrequest:** cloudrequest.cxx: ws endpoint /api/v1/websocket; per-msg-deflate toggled by cloudcfg ("per msg deflate change %d -> %d") w/ local-run-state override; "Player IP changed. Bouncing connection"; backoff "Following backoff schedule, retry in %lld"; msg types: SET_CONFIG (registration send/read), CHECK_CONFIG (registration return), TYPE EVENT ("Unexpected TYPE EVENT"), "support for HTTP message dropped", "Unrecognized message type"; poll loop crt.poll/CRT select failed/ppr read failed/failed to ping/"player request failed: %s"; SwitchingRadiosEvent; museCloudEvtHandler
## `leds_zp`

**coverage** `strong`

The LED engine: HW feature flags, mode flags (R_LED_UPGRADE, R_LED_BROKEN_DEVICE, audio-device flags), brightness control, and the R_LED flag enum (join household, setup/WAC, factory reset, clone-check failure, warning, playing, muted, booting...). The pattern format (checksum, flags, repeat count, steps with LED ids/RGB/hold/fade) is the compiled form patterns arrive in.

**Technical description:**

HW features "setHwFeatures bHasMicrophone=%s, bHasMuteLED=%s, bHasStatusLED=%s, bHasOnlyStatusLED=%s, bHasHardwareLedSwap=%s, bCanSetWhiteBrightness=%s"; mode flags {R_LED_UPGRADE,R_LED_BROKEN_DEVICE,audiodev_flag,LED_MANAGER_HAS_AUDIODEV}; state "applyLEDModeLocked m_fLedBrightness=%5.2f, m_nextLedPatternPriorityLevel=%u m_lastClr=%d m_fade_effect=%d m_lLEDFlags=0x%llx m_bIsInExclusiveBTMode=%d m_bIsBTConnected=%d m_bHasStatusLED=%d m_bHasMuteLED=%d useOnlyStatusLED=%d"; ops {applyLEDMode,setWhiteBrightness,feedbackFlash,feedbackIrFlash,resumeDefaultLEDPattern\[Flash\],demoModeErrorFlash,executeDiagMode,updateCaptouchBrightness,setLEDBrightness,led_set_turnOffLocked,led_set_updateCaptouchBrightness,led_set_feedbackFlash}; "ignoring apply LED mode. m_bReady=%d"/"due to suspend bypass flag"; pattern fmt "ledWrite pattern: led_ids %08x repeat %d" + "rgb %d %d %d, hold %d, fade %d" + "cksum=%08x, flags=%04x repeats=%u num_steps=%u led_ids=%08x" + "step\[%d\]= r=%02x, g=%02x b=%02x hold_time=%u fade=%u"; HAL {led_get_hal_token,hal_led_diag,hal_led_flash,hal_led_write,hal_led_close,hal_led_brightness,hal_led_ir,led_util_open/close}; saved pattern {"ERROR allocating saved led pattern struct","enqueue restore pattern for LED state:0x%llx","has bFlashMode set. Returning saved pattern","no saved led pattern to flash"}; colors {white,"set default captouch feedback color to %s"}; mutexes {leds_zp mutex,leds_zp_internal}; R_LED flags {UPGRADE,BROKEN_DEVICE,JOIN_HH_OPEN,JOIN_HH,BEGIN_SETUP_MODE,IN_SETUP_MODE,WAC,WAC_TIMEOUT,BREAK_POP,SHUTDOWN,HHID,TRANSFER_REGISTRATION,CONTROL_FEEDBACK,IDENTIFY_PLAYER,AUDIO_OFF,MUTED,FAULT,WAITING_TO_PLAY,WAITING_TO_PAUSE,PLAYING,WARN,DEMO_MODE,DEMO_CONFIGURE_IR}; LED_MODE {FACTORY_RESET,BOOTING,JOIN_HH,JOIN_HH_OPEN,BYPASS_BLOCKED,BYPASS,CLONE_CHECK_FAIL}; "ERROR: bad set_pattern_for_mode(%d)"; "unknown restore pattern for LED state:0x%llx"

- **name:** LED engine (leds_zp)
<details><summary>Evidence (1)</summary>

- @ 0x10fba544 — leds_zp

</details>

## `libflac`

**coverage** `strong`

The vendored libFLAC 1.3.4 (20220220): decoder error taxonomy (BAD_HEADER, FRAME_CRC_MISMATCH, UNPARSEABLE_STREAM, OGG_ERROR, SEEK_ERROR) and the I/O callback status set (WRITE/LENGTH/TELL/SEEK/READ/INIT variants). FLAC streams play through this exact build.

**Technical description:**

"reference libFLAC 1.3.4 20220220"; errors {BAD_HEADER,FRAME_CRC_MISMATCH,UNPARSEABLE_STREAM,OGG_ERROR,SEEK_ERROR}; I/O statuses {WRITE CONTINUE/ABORT,LENGTH/TELL/SEEK OK/ERROR/UNSUPPORTED,READ CONTINUE/END_OF_STREAM/ABORT,INIT OK/UNSUPPORTED_CONTAINER/INVALID_CALLBACKS/MEMORY_ALLOCATION_ERROR/ERROR_OPENING_FILE/ALREADY_INITIALIZED}; states {SEARCH_FOR_METADATA,READ_METADATA,SEARCH_FOR_FRAME_SYNC,READ_FRAME,END_OF_STREAM,ABORTED,MEMORY_ALLOCATION_ERROR,UNINITIALIZED}; metadata blocks {STREAMINFO,PADDING,APPLICATION,SEEKTABLE,VORBIS_COMMENT,CUESHEET,PICTURE}; frame nums {FRAME_NUMBER_TYPE_FRAME_NUMBER,FRAME_NUMBER_TYPE_SAMPLE_NUMBER}; channels {INDEPENDENT,LEFT_SIDE,RIGHT_SIDE,MID_SIDE}; subframes {CONSTANT,VERBATIM,PARTITIONED_RICE,PARTITIONED_RICE2}; cue validation {lead-in div by 588,"at least one track (the lead-out)","lead-out track number 170 (0xAA)","may not have track number 0","track number 1-99 or 170","offsets evenly divisible by 588 samples","at least one index point","first index 0 or 1","index numbers increase by 1"}; PICTURE types {32x32 file icon PNG,Other file icon,Cover front/back,Leaflet page,Media,Lead artist,Artist/performer,Conductor,Band/Orchestra,Lyricist,Recording Location,During recording/performance,Movie/video screen capture,Bright coloured fish,Illustration,Band/artist logotype,Publisher/Studio logotype}; "MIME type printable ASCII 0x20-0x7e","description valid UTF-8"

- **name:** libFLAC 1.3.4 decoder
<details><summary>Evidence (1)</summary>

- @ 0x10fbb920 — libFLAC

</details>

## `lla`

**coverage** `strong`

The low-level audio interface between anacapad and the kernel DSP driver. It opens output/input devices, negotiates buffer limits (min/max/default buffers, channels, frame size, jitter), sets tx latency, and does sample-clock math to compute when a write will actually sound. Status codes (WOULD_BLOCK, UNDERFLOW_OVERFLOW, NO_CSB, SUSPENDED) are the vocabulary the rest of the audio stack uses for hardware faults.

**Technical description:**

status codes {WOULD_BLOCK,UNDERFLOW_OVERFLOW,NO_CSB,INVALID_DATA,SUSPENDED}; out {lla_hdmi,"device open failed, unsupported device type %d","opening lla output device","could not get device rc %s lrc %s fd %d","Setting tx latency %u - rc %d","could not get output limits","could not set tx latency rc %d try %u got %u","could not get combined time and output delay"}; timing {"underflow count not cached, returning 0",lla-select,"play time in the past","adjusted play time in the past","%s %s current time %d.%06d play time %d.%06d write at %d.%06d","could not get sample unit time ticks","could not get time","could not get output delay","time requested %d.%06d current time %d.%06d diff %dus devPlayTime: %llu devCurrentTime: %llu diff in sample unit time %llu"}; IO {"fd not set fd=%d","timed out fd=%d","select failed fd=%d errno=%d %s","no output fd %d","low level interface could not fulfill request. error %d uf %u","callback failed, playing zeros %d","commit error (%d) before caching underflow count","could not get buffer information"}; input {"Device is not open","Failed to open the input device:%d, status:%s","id:%d fd:%d min:%u max:%u dflt:%u bufs:%u channels:%u frame:%u jitter:%zu","Failed to get fd","closed input device fd:%d","lla.in.poll","Select returned but LLA fd not set","Failed to get rx time in ticks/rx time","Could not get input delay/input time and delay","Failed to flush the input",liblla_input,lla_in_%s,"Failed to set pipe to nonblocking","Failed to create pipe","pTmpFrame buffer is NULL","Failed to copy buffer contents","Trying to copy more bytes than expected. attempted %d maxbytes %d","could not release buffer after read","Buffer Passed in is NULL","No readable data available. Previous ret:%s fd:%d","read failed status: (%s) fd: %d"}; event objects {"Failed to add event object %s","Invalid object index","Add fd for object %s","Wait for input failed: %d","Spurious Input Event 0x%x","Remove object %s","Failed to find object for releasing","Object %s was not formally released"}; liblla

- **name:** LLA (low-level audio) interface
- **errors_enum:** {EFAULT,EUNDERFLOW,EOVERFLOW,EPARAM,ENODEV,DEVFAULT,NOBUFFER,OUTOFORDER,NOCSB}
<details><summary>Evidence (1)</summary>

- @ 0x10fe5ad4 — LLA

</details>

## `local_settings_mgr`

**coverage** `strong`

The local settings manager: `_settings.json`, `_effective.json`, `_attrdata.json`, `_exclude.json`, `settings_targettypes.json`, `__location_summation`, `__migration_data` — each file wrapped in a magic header (`|_(:/)_|`) with length/checksum/counter and a trailer. Migration, per-target defaults, and 'attempt to subvert authorization' detection all live here.

**Technical description:**

files {_attrdata.json,_exclude.json,_settings.json,_effective.json,settings_targettypes.json,__location_summation,__migration_data}; models key; magic header "{\"magic\":\"`|_(:/)_|`\",\"length\":%u,\"checksum\":\"0x%08X\",\"counter\":%u}" + trailer "{\"magic\":\"(=^+^=)\",\"version\":11}"; ops \[Mg\] {setLocationSettings("did not advance i:%llu \[c:%llu\]",write failure,"!= locationId","dropping unfamiliar group"),performSingleGroupWriteOperation("validation failure","performing write"),performMultiGroupWriteOperation,setupLocalSettingsManagerImpl("readJsonFile failed","ingestSettingsTargetTypesData failed","ingestLocationFromStorage failed"),getEffectiveSettings("bad groupId"),updateMultipleSettings("ingestPatchAttribute failure"),updateSettings("bad keyId"),readSettingsFromMultipleSettingsGroups,internalReadSettings,internalReadEffectiveValuesLocked("bad keyId","hetType mismatch"),updateGroupSettings}; migration \[Mm\] {persistMigratedDataLocked,"unexpected twoLetterStr","unbalanced collectionStr","missing","not an object"}; patch \[Pc\] {completePatchAttributeIngest "type mismatch vT/aT"}; request auth \[Rq\] {permBits,calculateUserPermissionsJSON,"attempt to subvert read authorization","attempt to update location only settings","attempt to subvert write authorization",setupUpdateAllRequest/setupUpdateRequest/setupGetRequest "not found"/"excluded"/"invalid target type"}; storage \[Gp\] {writeMetaDataToStorage,writeSettingsToStorage,setupSettingsContainerFromStorage "success from old schema"/"settingsStorage not found",setupMetaDataFromStorage}; location \[lo\] {ingestLocationFromStorage "dropping unfamiliar group",ingestLocationSettingsFromCloud,ingestGroupForLocation "attribute not found","dropping unfamiliar setting"}; metadata {effectiveMetaData,locationMetaData}; eventing {LocalSettingsEventing::waitUntilEventNotificationCompletes,notifyOnChange notifySubscribers}; errors {INCORRECT code:%08X,FATAL code:%08X,DATA_CORRUPTION\[%08X\] settings group}

- **name:** local settings manager (locSetMgr)
<details><summary>Evidence (1)</summary>

- @ 0x10faf68c — locSetMgr

</details>

## `mdns`

**coverage** `Failed to dump mDNS state into diagnostic: %i; /status/opt/log/mdnsd.log page + /opt/log/mdnsd.log file`

The mDNS stack: service registration, TXT record management, discovery, and household filtering. Sonos devices advertise `_sonos._tcp` with TXT keys (hhid, bootseq, variant); filtering drops discovered devices that belong to a different household.

- **controller:** MdnsController ops {register service (twice-guard),unregister,update value (dup-guard),replace values}; failures {registration failure %i,TXTRecord populate %i,update unregistered}
## `mdns_device`

**coverage** `strong`

The device's own mDNS TXT record schema: byebyereason, protovers, minApiVersion, mhhid, hhsslport, variant, mdnssequence, locationid. Controllers reading `_sonos._tcp` see exactly these keys — the binary is the authority on what each one contains.

**Technical description:**

TXT keys {byebyereason,protovers,minApiVersion,mhhid,hhsslport,variant,mdnssequence,locationid}; "Truncation in formatting service name"

- **name:** mDNS device TXT record
<details><summary>Evidence (1)</summary>

- @ 0x10ef7a80 — mdns device txt

</details>

## `mod_zp`

**coverage** `?`

The core ZonePlayer module — the umbrella object owning zone lifecycle, group membership, and the shutdown sequence. Most top-level FSMs report through it; it's the 'this player' singleton everything else hangs off.

- **detail:** mod_zp + mod_zp_aa album-art queue "queueing album art request %s %u %u %u"; timeout states {timeoutplaying,timeoutpaused}; headers {x-rincon-last-update-device,x-rincon-content-version,x-rincon-range}; "%s.tmp" staging + "Unable To File %s"/"Unable To Rename Temp EQ File"; "Forced GTK rekey"; button-forward errors {no handler,invalid method,No button handler unable to forward buttons,Feature not supported.}; build props {build.date,build.scm.version,/build.properties,legacyanacapad,hhSwgenState}
## `muse`

**coverage** `?`

The muse command protocol: ~67 namespaces / ~320 verbs of cloud-API surface — playback, settings, grouping, positioning, registration, UPnP bridge — dispatched by the muse engine.

- **auth_errors:** auth helper errors {"Player is not securely registered","Access token's user does not match registered user","Access token does not have adequate permissions","Command scopes could not be determined","Invalid user","Scope is insufficient","Error reading scopes","Error matching scopes"}; scopes {hh-config,hh-config-admin}; token fields {access_token,resource_owner,expires_in,time_since_created}; response {"Response code: %d, Access token is invalid"/"Scope is insufficient"}
- **service_bindings:** musezpactor UPnP service URIs {AlarmClock:1,AudioIn:1,ConnectionManager:1,MusicServices:1,SystemProperties:1,ZoneGroupTopology:1,HTControl:1,GroupManagement:1,GroupRenderingControl:1(urn:schemas-upnp-org) + Queue:1(urn:schemas-sonos-com),VirtualLineIn:1}; "zp already set"/"zp not set"
## `muse_engine`

**coverage** `?`

The muse dispatcher: namespace registry, target validation, IBT fan-out, authorization, execution — mounted on `/api`, `/device_account`, and the lechmere pipe.

- **dispatch:** "Dispatching command (ns=v%u/%s, cmd=%s)"; actor errors {"Namespace may be missing actor (%s). See RZPMuseActor","Namespace has no actor (%s). See RZPMuseActor::setupWholeDevicePointers()"," has no actor","Failed to create command (%s)"," command is not supported"}; target ids {"invalid implicit target id \[%s\]","invalid explicit target id \[%s\]","Invalid targetId for unsubscribe (%d)"}; events {RMuseEventing,"Failed to send muse message %s(%s)"}
- **upnp_bridge:**
  - **pattern:** v1/players/{playerId}/upnp{Service}\[/subscription\[/{logicalSID}\]\] + v1/households/{householdId}/players/{playerId}/upnp{Service}\[/subscription\[/{logicalSID}\]\]
  - **bindings:** {playerId,upnpX,call} / {playerId,upnpX,subscribe} / {playerId,upnpX,renew,logicalSID} / {playerId,upnpX,unsubscribe,logicalSID}
  - **services:** `upnpDeviceProperties`, `upnpGroupManagement`, `upnpGroupRenderingControl`, `upnpHTControl`, `upnpMusicServices`, `upnpQueue`, `upnpRenderingControl`, `upnpSystemProperties`, `upnpVirtualLineIn`, `upnpZoneGroupTopology`
  - **vli_verbs:** `selectSource`, `startTransmission`, `stopTransmission`, `sendBackChannelCmd`
  - **evidence:**
    - type: firmware, status: confirmed, address: 0x10e8462c, notes: bridge bindings
- **type_registry:** alphabetical name table 0x10f975c0-0x10f98568 (203 entries) — candidate type-index namespace for spec-pair {0x82,b} entries
- **playervolume:** verbs {duck,unduck} at v1/players/%s/playerVolume/{duck,unduck}; setVolume "cannot set volume AND mute parameter"; setRelativeVolume "cannot set volumeDelta AND muted parameter"; fixed flag; v1/groups/ + v1/players/ + /playerVolume paths
- **command_format:** muse command = JSON array \[header object, body object\]; "failed to parse json body (offset: %u)"; param validation emits MISSING_VALUE/UNEXPECTED_TYPE + range/coerce messages
- **client_auth:** schemes {wssmtls,httpsmtls}; audience v2.api.smartspeaker.audio; credentials {apikey,guest_token,guest_token_pin}; "Policy key permissions length exceeds maximum size!"; "validateTargetIdV1: invalid target id: %s of type: %s."; "Client auth exception"; "API key changed from \[%.8s\] to \[%.8s\]"; "Credential is missing"; "Secure connection required"; "Upnp command failed with return code"; "Error code not found in objectStatusMap"; "Api Key passed by client is too long..truncating."; MuseDebugInfo; providers {getActorProvider,getTargetIdProvider,getTargetValidator,MuseDeviceImplProvider}
- **namespaces:** {audioClip,householdUpdate,management,musicServiceAccounts,pinewood,platformInternal,positioning,roomDetection,soundSwap,systemReporting,systemTime,virtualRemoteControl} + settings:{accessorySettings,business,frontierLlms,global,playback,playerBasic,playerLineIn,playerUI,positioning,preferences,prodashboard,security,video} + upnp:{AlarmClock,AudioIn,AVTransport,ConnectionManager,ContentDirectory,DeviceProperties,GroupManagement,GroupRenderingControl,HTControl,MusicServices,Queue,RenderingControl,SystemProperties,VirtualLineIn,ZoneGroupTopology}
- **http_auth:** challenge {private,public,realm,error_description,nonce,Basic}; OAuth errors {invalid_request,invalid_token,insufficient_scope,service_unavailable}; results {denied/403,denied/503,no token}; log "Muse auth result: \[%s\] \[%s\] \[%s\] \[%s\] \[%s\] \[%.8s\] \[%s/%s::%s\]"
## `muse_enums`

**coverage** `strong`

The enum tables shared by muse fields: actor roles (VOICE_ASSISTANT, GUEST, ADMIN, EMPLOYEE, PLAYER_TO_PLAYER, BLE_DTLS), authz resources (AUTHZPOLICIES, DEVICES, ENTITLEMENTS, SETTINGS, HISTORY), permissions (PLAY_TO_BONDED, STOP_CONTENT, USE_SHARED_QUEUE), content types (PLAYLIST, EPISODE, PODCAST...), and credential types (ACCESS_TOKEN, API_KEY, GUEST_TOKEN_PIN).

**Technical description:**

actor/transport {PLAYER_TO_PLAYER,BLE_DTLS}; authz resources {AUTHZPOLICIES,DEVICES,ENTITLEMENTS,SETTINGS,HISTORY}; perms {PLAY_TO_BONDED,STOP_CONTENT,USE_SHARED_QUEUE}; content types {CHAPTER,SMAPI_CONTAINER,EPISODE,PLAYLIST,PODCAST,PROGRAM}; credential types {ACCESS_TOKEN,API_KEY,GUEST_TOKEN_PIN}; SFB perms {SRADIO_HD_CONTENT,SRADIO_SPECIAL_CONTENT,SRADIO_ONDEMAND_ARCHIVE,SRADIO_CAN_SKIP,SFB_BASIC_UI,SFB_COMMERCIAL_MSP,SFB_ESSENTIALS_MSP,SFB_PREMIUM_MSP,SFB_DASHBOARD_ACCESS,SFB_CNTRL_MEDIA_SRCS,SFB_CNTRL_THIRD_PARTY,SFB_RSTC_CONTENT_ACS,SFB_RSTC_SAVE_CONTENT_ACS,SFB_RSTC_SETTINGS_ACS,SFB_RSTC_ALARMS_ACS,SFB_RSTC_MESSAGING_ACS,SFB_RSTC_SAVE_GROUPS_ACS,SFB_SCHEDULES_ACCESS,SFB_MVP}; playback states {BUFFERING,PAUSED,PLAYING}; queue ops {APPEND,INSERT,INSERT_NEXT,PLAY_NOW}; ratings {EXCELLENT,POSITIVE,NEGATIVE,RATED,THUMBSUP,THUMBSDOWN,SHELVED}; registration {LEGACY_REGISTERED,SECURE_REGISTERED,TRANSFER,PREP_TRANSFER}; netmode {NETMODE_SONOSNET_WIRELESS,NETMODE_WIRED,NETMODE_WIRED_NO_WIFI,NETMODE_STATION,NETMODE_SATELLITE_V1,NETMODE_SATELLITE_V1_WIRED,NETMODE_SATELLITE_V2,STATION_SATELLITE}; roles {VOICE_ASSISTANT,GUEST,ADMIN,EMPLOYEE}; FORBIDDEN; USB_C; GOOGLE; recurrence + {alarm states: ALARM_PENDING,ALARM_SNOOZED,ALARM_FIRING,INTERRUPTED; buttons: PLAY_PAUSE,MUSIC,DPAD_UP/DOWN/LEFT/RIGHT/SELECT; sources: CLOUD,HT_PLAYBACK,HT_POWER_STATE,AIRPLAY,AUDIO_CLIP,SPEAKER_DETECTION,FIXED_VOLUME,ROOM_DETECTION,IR_CONTROL,ALEXA_CBL; errors: CHARGER_NOT_COMPATIBLE,CONFIGURING,NO_LOGICAL_ADDRESS,EXTRALOCAL; abort: ABORT_INCORRECT_MODE,ABORT_NO_SOURCE,ABORT_INVALID_OP,ABORT_REFUSED,ABORT_UNDETERMINED,REPLY_TIMEOUT,ROOT_INDIRECT,BROADCAST_BLOCKED; groups: MUSICOBJECTID,GROUP_STATUS_MOVED,GROUP_STATUS_UPDATED; update: UPDATE_COMPLETE,INFO_FILE_WRITE_FAILED,BSU_FAILED,UPGRADE_MGR_SPAWN_FAILED,MANIFEST_DOWNLOAD_FAILED,MANIFEST_PARSE_FAILED,UPDATE_NEVER_RUN,FINAL_RESULT_UNKNOWN; surrounds: VERTICAL_WALL_BELOW,FLEXIBLE_SURROUNDS,PORTABLE_SURROUNDS; sec: SECURE,SECURE_REG,UPNP_OVER_TLS; indexer: ADD_IN_PROGRESS,ADD_COMPLETE,PENDING_REINDEXING,REINDEXING_IN_PROGRESS,REINDEXING_COMPLETE,REPLICATION_IN_PROGRESS,REPLICATION_COMPLETE,PENDING_DELETE,DELETE_COMPLETE; sonosnet: SONOSNET_DISABLED,SONOSNET_DISABLE_TEST; conn: ONLINE,TERMINATING; chirp: INAUDIBLE_WIDE,MULTI_INAUDIBLE_WIDE,MULTI_AUDIBLE; timers: TIMER_PAUSED,TIMER_RINGING; power: TO_STANDBY,POWERING_DOWN,POWERING_UP,SMART_DOCKED,PRIMARY_PLAYBACK_STARTED,POWERING_UP_UPDATED,WAKING_UP_FROM_USER,PRIMARY_NETWORK_STATUS_CHANGE; volume: FIXED,PASS_THROUGH; wifi: ACK_AWAIT,WIFI_DISABLING,WIFI_DISABLED,ACK_NOT_RECEIVED; positioning: APPLE_MOBILE_DEVICE,ANDROID_MOBILE_DEVICE,STIMULUS_PLAYBACK_COMPLETE,BEARING,DISTANCE,ACOUSTIC_SPACE_MAP,MEASUREMENT_RESULTS,MEASUREMENT_RAW_AUDIO,IMPULSE_RESPONSE_AND_AUDIO; HEY_SONOS; RADIOLIST}

- **name:** muse enum tables
<details><summary>Evidence (1)</summary>

- @ 0x10f9949c — enum tables

</details>

## `muse_errors`

**coverage** `strong`

The ~80-entry error registry every muse command can return: generic (INVALID_ACTION, UNSUPPORTED_COMMAND), playback (PLAYBACK_FAILED, SKIP_LIMIT_REACHED, EXPLICIT_NOT_ALLOWED, PLAYERS_HAVE_INCOMPATIBLE_FIRMWARE), session (SESSION_IN_PROGRESS, JOIN_FAILED, EVICTED), and infrastructure (SERVICE_NOT_AVAILABLE, CLOUD_QUEUE_SERVER, NOT_DESIGNATED_DEVICE). These strings are the contract — clients should branch on them, not on free-text messages.

**Technical description:**

results {CREATED,ACCEPTED,SUCCESS_NO_CONTENT,SUCCESS_NOT_MODIFIED}; playback {ERROR_PLAYBACK_FAILED,NO_CONTENT,NO_PLAYABLE_CONTENT,EXPLICIT_NOT_ALLOWED,EXPIRED_TOKEN,NOT_PLAYABLE,SPOTIFY_CONNECT,FAILURE_TO_ENQUEUE,CLOUD_QUEUE_SERVER,SKIP_LIMIT_REACHED,PLAYBACK_STREAM_LIMIT,PLAYERS_HAVE_INCOMPATIBLE_FIRMWARE}; session {SESSION_IN_PROGRESS,JOIN_FAILED,EVICTED,INVALID_SESSION_ID,NOT_DESIGNATED_DEVICE}; accounts {PREFERRED_ACCOUNT_NOT_SET/NOT_FOUND,ACCOUNT_FULL,INVALID_ID,NO_DEFAULT_FOUND,REAUTH_REQUIRED,UPGRADE_REQUIRED,WRONG_SERVICE}; update {NO_UPDATE_AVAILABLE,INVALID_UPM_FORMAT,INSUFFICIENT_POWER_FOR_UPDATE,UPDATE_IN_PROGRESS}; misc {ALARM_NO_SPACE,ALARM_BAD_TIME_SERVER,AREAS_READ_ONLY,AUDIO_CLIP_ID_NOT_FOUND/_MEDIA_ERROR/_PAUSE_CONTENT_FAILED/_VOICE_ASSISTANT_PLAYING,CACHE_NOT_FOUND/_RECORD_NOT_FOUND,CANT_CONNECT\[_REMOTE\],DEVICE_ALREADY_REGISTERED/UNAVAILABLE,INVALID_ACTION,DOWNSTREAM_CONNECT_FAILED,SHARES_CONFLICT/NO_SUCH_SHARE/NO_SPACE/REQUEST_FAILED,STIMULUS_ALREADY_PLAYING,MICROPHONE_NOT_ENABLED,NO_POSITIONING_RESULTS,UNSUPPORTED_POSITIONING_REQUEST,SVC_DISABLED,TIMER_NOT_FOUND,UNSUPPORTED_VOLUME_MODE,INVALID_RESOURCE,ROOM_DETECTION_SIGNALLING_FAILED/BUSY,GROUP_CHANGED}; generic {COMMAND_FAILED/TIMEOUT,CONTENT_TYPE_NOT_SUPPORTED,DISALLOWED_BY_POLICY,INTERNAL,INVALID_AUTH_HEADER/CERT/OBJECT_ID/PARAMETER/SYNTAX/HEADER/LENGTH/TRANSPORT,TARGET_ID_NOT_FOUND,LOAD_COMMAND_FAILED,MISSING_PARAMETERS,NO_PERMISSION,NOT_AUTHORIZED,NOT_CAPABLE,PRECONDITION_FAILED,EXPECTATION_FAILED,QUEUE_FULL,RESOURCE_GONE/CONFLICT,REQUIRES_GROUP_COORDINATOR,SERVICE_NOT_AVAILABLE/CONFIGURED/SUPPORTED/UNAVAILABLE,UNSUPPORTED_NAMESPACE/COMMAND/REQUEST/REQUEST_METHOD,API_KEY_VALIDATION_FAILED,NYI,CMD_FUTURE,CMD_REMOVED,INSUFFICIENT_RESOURCES,INCORRECT_STATE,INCOMPATIBLE_API_VERSION,INCOMPATIBLE_CLIENT_VERSION}; param validation {MISSING_VALUE,UNEXPECTED_TYPE,"Parameter failed timestamp validation","not a valid Muse error code","out of range: at or below minimum of/above maximum of","Found unexpected array/object","Missing required field","Unable to coerce string to number/boolean","number of entries below/above minimum/maximum"}

- **name:** muse error-code registry
<details><summary>Evidence (1)</summary>

- @ 0x10f9508c — muse ERROR enum

</details>

## `muse_events`

**coverage** `strong`

The ~65 event types a muse client can subscribe to: avTransport, playbackStatus, renderingControl, zoneGroupTopology, groupCoordinatorChanged, sleepTimerStatus, trueplayStatus, audioInput, batteryStatus, bluetooth status, and more. Subscriptions are per-namespace with logical SIDs; events are how the cloud API delivers state changes rather than polling.

**Technical description:**

{accessorySwapStatus,tvAudioSignalStatus,activeZonesChange,zoneDefinitionsChange,zoneError,alarmClock,alarmVersionChange,areasVersionChange,audioClipStatus,audioInput,availableSoftwareUpdate,avTransport,batteryStatus,wirelessNetworkStatus,microphoneSwitchStatus,waterStatus,bluetoothPairingStatus,bluetoothConnectionStatus,poeStatus,lineInStatus,wiredSubConnectionStatus,cloudRegistration,connectionManager,contentDirectory,deviceProperties,diagnosticSubmissionResults,diagnosticMetadata,effectiveSettingsDataChanged,entitlementsVersionChanged,extendedDeviceStatus,extendedPlaybackStatus,favoritesVersionChange,groupCoordinatorChanged,groupManagement,groupRendering,hdmiStatus,historyVersionChanged,householdUpdateStatus,upgradeManager,htControl,indexerStatus,musicServices,musicServicesChanged,playbackMetadataStatus,playbackStatus,playlistsVersionChange,positioningSessionStatus,positioningSessionError,positioningDeviceStatus,renderingControl,sessionError,sessionInfo,settingsVersionChanged,settingsDataChanged,settingsPlayerSettingsChanged,sleepTimerStatus,systemProperties,trueplayStatus,speakerPresenceStatus,speakerPresenceRateChange,trueroomAdaptationStatusEvent,trueroomCalibrationStatus,trueroomStatusEvent,virtualLineIn,voiceAccountsVersionChange,zoneGroupTopology,upnpEvent}

- **name:** muse event-type registry
<details><summary>Evidence (1)</summary>

- @ 0x10f960df — muse event types

</details>

## `muse_types`

**coverage** `strong`

The 203 object-type names the cloud API's schema can use, stored in one contiguous alphabetical block - accessorySwap through zoneMemberState. Every field in every operation's spec is typed with one of these: simple wrappers like upnpEvent (the generic event value, appearing once per bridged UPnP service) or concrete payload shapes like channelMapPair, bluetoothDevice and deviceInfo. Together with the field-name half of each spec pair this gives the complete request/response grammar for all ~320 cloud verbs.

**Technical description:**

203 contiguous alphabetical type names @0x10f975c0-0x10f98568 - the TYPE-NAME space used in spec {field,type} pairs (semantic spec idx -> table\[3+idx\]). Followed by muse_target_validator + errors {guest_access_disallowed,forbidden,not_authorized,not_found}. Types are object-schema names; 'upnpEvent' (11 identical entries, one per bridge namespace) is the universal value/event wrapper appearing as the type of nearly every status field.

- **name:** muse type registry — spec-pair type index names
- **types** (203):

  ```
  accessorySwap, accessoryWifiPsk, accessPolicyControl, accessPolicySetting, accountError, acousticMeasurement, acousticMetrics, activeZoneList, activeZoneMember, actuator, alarmDescription, alarmList, alarmRunningState, versionChanged, allowAirplaySetting, allowDirectControlSetting, allowLineInSetting, amazonAlexaAccount, amazonAlexaSetup, asyncRequestAck, audioConnectorStatus, authorizationGrantHeader, authorizationGrantPayload, authorizationGrantResponse, authzModifier, authzPermission, authzPermissions, authzPolicyKey, authzPolicyKeyLechmere, authzTokenStatus, authzUser, batteryCells, microphoneSwitch, waterState, bluetoothPairing, poeState, wiredSubStatus, bleMeasurement, bluetoothDevice, bluetoothPolicySettings, channelMapPair, chirpRequest, cloudDevice, cloudRegistrationStatus, commandHeader, contentMetadataBlob, contentPagedResources, contentPageInfo, contentResource, createInviteResponse, deeplink, deviceInfo, deviceSoftwareUpdateStatus, diagnosticInfo, diagnosticSubmissionMetadata, diagnosticSubmissionResult, directControl, discoveryInfo, edidStatus, settingsChanged, enableContentAccessSetting, entitlement, entitlementsList, eqSettings, ethernetPorts, ethernetPortStatus, externalId, favoritesList, feature, featureConfig, featureConfigDropoutContext, featureConfigHomeTheaterWifiPerfTelemetry, featureConfigMetricsService, featureConfigPlink, featureConfigQuickbonding, featureConfigSemiSleep, featureConfigSmartPlay, featureConfigSpotABR, featureConfigSsdpAdvertiseConfig, featureConfigZoneExperiment, geoLocation, getUsersResponse, globalError, globalSettings, groupInfo, homeTheaterInputFormat, homeTheaterOptions, householdSoftwareUpdateStatus, idResponse, irControlStatus, lineInSettings, lineInSettingsGroup, lineInStatusInfo, lineInStatusList, localVoiceSettings, loopbackTimeoutControl, manufacturingData, metadataStatus, musicServiceAccount, networksList, networkTestResult, patchEffectiveAllSettingsGroups, patchEffectiveAnyOneSettingsGroup, patchPlayerAllSettingsGroups, patchPlayerAnyOneSettingsGroup, playbackPolicy, playbackSettings, playerAllSettingsGroups, playerAnyOneSettingsGroup, playerSettings, playerSettingsEvent, playerSetError, playlistsList, playlistTrack, playMode, portableSurrounds, positioningDevice, positioningDeviceMeasurementList, positioningDeviceStatusInfo, positioningMap, positioningMeasurement, positioningMeasurementCapability, positioningMeasurementCapabilityList, positioningSessionErrorInfo, positioningSessionRequest, positioningSessionStatusInfo, positioningSpatialData, positioningTelemetry, postHistoryConfig, preferredLanguageSetting, protectedAdminSettings, protectedSettings, publicSettings, queueItem, queueItemWindow, radioShow, rateStatus, recurrenceRule, redeemInviteResponse, RegistrationToken, registry, registryCollection, relativeTimeStamp, replicatedAreas, reportOptions, restrictedAdminSettings, sdkVersions, secureRegCert, secureRegCertMetadata, sessionStatus, settingsGroupMetadata, share, sharesList, shareListStatus, shareStatus, smartplayContentResource, softwareUpdate, softwareUpdateOptions, sonosDeviceNonce, soundSwapRequestResponse, speakerDetectionStatus, speakerPresenceEffectiveRate, speakerPresenceResult, speakerPresenceResultList, stimulusTuningEnabled, swapModelInfo, systemNameSetting, timer, timeVal, timeZoneInfo, tokenStatus, trackQuality, transitionToShipModeStatus, translatedObjectId, translatedObjectIds, translation, transportSetting, trueplayConfiguration, trueroomAdaptationStatus, trueroomStatus, trueroomEstimatorConfig, trustedAccessories, uniqueSetTestData, uniqueSetTestItem, universalMusicObjectId, updateItem, upnpParameter, upnpResponse, usageContextSetting, videoContent, virtualLineInSource, voiceAccount, voiceAccountsList, voiceAccountProfile, voiceWakeWord, weatherConfig, wifiDisable, zoneDefinition, zoneDefinitionList, zoneMember, zoneMemberSettings, zoneMemberSettingsMap, zoneMemberState
  ```
- **consumer_evidence:** live PIC-formed refs: settings-group handlers→settingsGroupMetadata (f_10aa1e80..f_10aa2854); zone ops→zoneDefinition/zoneDefinitionList/zoneMemberSettingsMap (f_10b8c5bc,f_10b8d72c); VLI→virtualLineInSource/wifiDisable (f_10a77630..f_10abdd54); geo→geoLocation (f_10b3670c..); shares→shareStatus (f_10afa388); deeplink/deviceInfo (f_10b061c8,f_10a50920); activeZoneMember/actuator (f_10a11634..); playMode (f_10a11284..); timeVal/timeZoneInfo (f_10b38910..); manufacturingData (f_10a0996c..); usageContextSetting (f_106c55c4..); idResponse (f_10ab3874..); replicatedAreas (f_10733fb4,f_1077fe2c); post-name region 0x10f98578-0x10f986e8 (muse_target_validator+errors) consumers f_10692d10,f_10698074..,f_109ed0a8,f_109ed6e0,f_109ee960..,f_109efc88
- **type_names:** {accessorySwap,accessoryWifiPsk,accessPolicyControl,accessPolicySetting,accountError,acousticMeasurement,acousticMetrics,activeZoneList,activeZoneMember,actuator,alarmDescription,alarmList,alarmRunningState,versionChanged,allowAirplaySetting,allowDirectControlSetting,allowLineInSetting,amazonAlexaAccount,amazonAlexaSetup,asyncRequestAck,audioConnectorStatus,authorizationGrantHeader/Payload/Response,authzModifier/Permission(s)/PolicyKey/PolicyKeyLechmere/TokenStatus/User,batteryCells,microphoneSwitch,waterState,bluetoothPairing,poeState,wiredSubStatus,bleMeasurement,bluetoothDevice,bluetoothPolicySettings,channelMapPair,chirpRequest,cloudDevice,cloudRegistrationStatus,commandHeader,contentMetadataBlob,contentPagedResources,contentPageInfo,contentResource,createInviteResponse,deeplink,deviceInfo,deviceSoftwareUpdateStatus,diagnosticInfo,diagnosticSubmissionMetadata,diagnosticSubmissionResult,directControl,discoveryInfo,edidStatus,settingsChanged,enableContentAccessSetting,entitlement,entitlementsList,eqSettings,ethernetPorts,ethernetPortStatus,externalId,favoritesList,feature,featureConfig,featureConfigDropoutContext,featureConfigHomeTheaterWifiPerfTelemetry,featureConfigMetricsService,featureConfigPlink,featureConfigQuickbonding,featureConfigSemiSleep,featureConfigSmartPlay,featureConfigSpotABR,featureConfigSsdpAdvertiseConfig,featureConfigZoneExperiment,geoLocation,getUsersResponse,globalError,globalSettings,groupInfo,homeTheaterInputFormat,homeTheaterOptions,householdSoftwareUpdateStatus,idResponse,irControlStatus,lineInSettings/Group/StatusInfo/StatusList,localVoiceSettings,loopbackTimeoutControl,manufacturingData,metadataStatus,musicServiceAccount,networksList,networkTestResult,patchEffectiveAllSettingsGroups,patchEffectiveAnyOneSettingsGroup,patchPlayerAllSettingsGroups,patchPlayerAnyOneSettingsGroup,playbackPolicy,playbackSettings,playerAllSettingsGroups,playerAnyOneSettingsGroup,...} + {playerSettings,playerSettingsEvent,playerSetError,playlistsList,playlistTrack,playMode,portableSurrounds,positioningDevice/DeviceMeasurementList/DeviceStatusInfo/Map/Measurement/MeasurementCapability(List)/SessionErrorInfo/SessionRequest/SessionStatusInfo/SpatialData/Telemetry,postHistoryConfig,preferredLanguageSetting,protectedAdminSettings,protectedSettings,publicSettings,queueItem,queueItemWindow,radioShow,rateStatus,recurrenceRule,redeemInviteResponse,RegistrationToken,registry,registryCollection,relativeTimeStamp,replicatedAreas,reportOptions,restrictedAdminSettings,sdkVersions,secureRegCert,secureRegCertMetadata,sessionStatus,settingsGroupMetadata,share,sharesList,shareListStatus,shareStatus,smartplayContentResource,softwareUpdate,softwareUpdateOptions,sonosDeviceNonce,soundSwapRequestResponse,speakerDetectionStatus,speakerPresenceEffectiveRate,speakerPresenceResult(List),stimulusTuningEnabled,swapModelInfo,systemNameSetting,timer,timeVal,timeZoneInfo,tokenStatus,trackQuality,transitionToShipModeStatus,translatedObjectId(s),translation,transportSetting,trueplayConfiguration,trueroomAdaptationStatus,trueroomStatus,trueroomEstimatorConfig,trustedAccessories,uniqueSetTestData,uniqueSetTestItem,universalMusicObjectId,updateItem,upnpParameter,upnpResponse,usageContextSetting,videoContent,virtualLineInSource,voiceAccount,voiceAccountsList,voiceAccountProfile,voiceWakeWord,weatherConfig,wifiDisable,zoneDefinition,zoneDefinitionList,zoneMember,zoneMemberSettings,zoneMemberSettingsMap,zoneMemberState}
<details><summary>Evidence (1)</summary>

- @ 0x10f975c0 — type-name block

</details>

## `muse_verb_ns_registry`

**coverage** `confirmed`

The complete menu of commands the cloud protocol supports, organised as namespace/verb pairs — for example 'authorization.resolveToken' means the resolveToken command inside the authorization namespace. Roughly 320 pairs cover everything a client can do: play music (playback.play), manage groups (groups.createGroup), look up zones (zones.getZoneDefinition), translate catalog IDs (catalog.translate), report firmware status (systemReporting.reportFirmwareDownload), and bridge to classic UPnP services. Two-character event codes (AA through AK) sit alongside, which is how subscriptions address event channels.

**Technical description:**

Pair table @.data 0x110941d8: {namespace_name_ptr, verb_name_ptr} x~320 entries, terminated ffffffff. Binds every verb to its namespace (authorization/resolveToken, catalog/translate, entitlements/*, groups/*, history/*, playback/*, zones/*, systemReporting/*, smartplay/getContent...). Preceded by 2-char event-code table (AA..AK @0x110941a4) and hash seeds h1/h2.

- **name:** muse verb<->namespace registry (.data)
<details><summary>Evidence (1)</summary>

- @ 0x110941d8 — ns->verb pair table

</details>

## `muse_verbs`

**coverage** `strong`

The verb-name table — every operation callable per namespace: `getAreas`/`createArea`, `loadAudioClip`, `getRegistrationStatus`/`transferDeviceRegistration`, `submitDiagnostics`, settings getters/setters, playback load ops, and hundreds more across ~67 namespaces. This is effectively the full cloud-API method list.

**Technical description:**

areas {getAreas,createArea,updateArea,removeArea}; audioClips {loadAudioClip,cancelAudioClip,clipMetadata}; authz {getPolicyKey,getPermissions,grantType,assertion,objectType}; cloudRegistration {getRegistrationStatus,setRegistrationState,transferDeviceRegistration,vanishedDevices,quarantinedDevices}; diagnostics {submitDiagnostics,results}; settings {getSettingsGroup,updateAllSettings,updateSettingsGroup,targetSettingsOnly,namespaces,delayMillis,subscribe/unsubscribePlayerSettings,get/setPlayerSettings,setAllowMicrophone,setSelfTruePlay,setEnablePositioningMeasurement,setSonosNetChannel,get/setRestrictedAdminSettings,setUserMetricsTracking,getPublicSettings,getProtectedSettings,getProtectedAdminSettings,"v1/players/%s/settings/player"}; entitlements {subscribeUser,unsubscribeUser,getEntitlements}; history {removeHistoryItem}; deviceProperties {setName}; householdUpdate {getHouseholdUpdateStatus,isRunning,designatedDeviceId}; irControl {getIRControl}; indexerStatus {getIndexerStatus,updating}; musicServiceAccounts {getPreferredMusicServiceAccount,endDirectControl,__provisioned__,availableServicesVersion,registeredServicesVersion}; networks {temporarilyDisableNetwork,startNetworkTests,getNetworkTestResults}; playback {togglePlay,menuType,dpadDirection}; cache {cacheSettings,cacheKey,invalidateCache}; playlists {getPlaylists,getPlaylist,postPlaylist,loadPlaylist}; positioning {playStimulus,set/getStimulusTuning,startSession,cancelSession,applyAction,getSessionMap,getDeviceMeasurements,sendMeasurements,notifySessionError/Status/DeviceStatus,getMeasurementCapabilities,setTelemetryLevel,measurements}; roomDetection {stopSignalling}; sleepTimer {getSleepTimer,remainingTimeDuration}; smartplay {getContent}; soundSwap {requestSwap}; svc {getWeatherConfig,voiceCommand}; systemTime {get/setTimeZoneInfo}; timers {setRelativeDuration,pauseTimer,resumeTimer,abortTimer}; trueplay {detectSpeakerPresence,resetDetectedSpeaker,setSpeakerPresenceRate,get/setConfiguration,getTrueplayStatus}; trueroom {playSuccessTone,setSwapInputMute,trueroomEstimatedParams}; virtualRemoteControl {sendButtonCommand}; voice {wakeword,amazon,getVoiceAccounts,updateVoiceAccount,removeVoiceAccount,createAmazonChallenge,notifyInitiateOnboarding,timeoutSeconds}; zones {backhaulChannel,getActiveZoneList,getZoneDefinition(List),addZoneDefinition,addMissingZoneDefinition,updateZoneDefinition,updateActiveZone,updateZoneMemberSettings,removeZoneDefinition,activateZone,deactivateZone,joinZone,unjoinZone}; renew

- **name:** muse verb-name table
<details><summary>Evidence (1)</summary>

- @ 0x10fa0188 — verb table

</details>

## `music_accounts`

**coverage** `?`

Music-service accounts as embedded in ZoneGroupState: per-account nickname/serial/flags/tier/credential fields that every member sees — replicated with vector clocks.

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

Network configuration and monitoring: Wi-Fi/SonosNet modes, netlink address events, connection-type tracking — the base layer `networkStatus` events reflect.

- **netsettings_mgr:** file netsettings.json + HHSettings + schema upgrade; 4 PSK classes {HhPsk,ControlPsk,RoomEncPsk(room name encrypt),LanSwapPsk} each + Backup variant, rotation "PSK rotation successful (HH/Control/RoomEnc/LanSwap)" + version bump; encoding {SonosNet key,DTLS HH PSK}; netstartd push {netsettings,PSK,channel change "Pushed SonosNet channel change to %u for %u ms"}; SonosNet-disable test-mode auto-revert FSM {sn_en,sn_dis,sn_dis_test}: "schedule automatic revert in %d seconds"/"SonosNet was re-enabled"/"Disable succeeded (probably)"/"automatic revert failed!"; SSID protection "Registering for next topology update to protect SSID"; "Pending netsettings.json update discarded after replicating"
- **network_test:** networkTestMgr: nettestresult.txt; cycle {"waiting %d sec before disabling wifi","disabling wifi for %d sec","enabling wifi",connect-open,complete:%s} + abort paths
## `network_tools`

**coverage** `strong`

The `/tools` diagnostic page: HTML forms that run `ping -c 3`, `traceroute`, `nslookup`, and `/mdnsannounce` against a host parameter, plus a `/pcap` endpoint that streams a packet capture (with an exclusion filter for its own HTTP connection). CSRF-token protected. This is the engineering page support asks you to visit for network forensics.

**Technical description:**

forms {"Tools for debugging network issues"}; /bin/ping -c 3 + /usr/bin/traceroute + nslookup + /mdnsannounce; POST params {host,csrfToken}; /pcap streams trace.pcap (Content-Disposition attachment) via /bin/pcap - not (host %s and port %d) exclusion filter

- **name:** network diagnostic tools page
<details><summary>Evidence (1)</summary>

- @ 0x10e86814 — tools page

</details>

## `nodetx`

**coverage** `?`

The inter-player TX transport: min/max packet range tracking, per-packet crossfade state, resync operations, and the NACK/retransmit machinery the source side uses to serve late joiners and packet loss. Together with noderx it forms the reliable-ish audio multicast layer.

- **ops_counters:** ops {schedResyncX,immedResync,schedResync,endTX}; ITBTT types {ITBTT_UNKNOWN,ITBTT_CHSRC,ITBTT_LINEIN,ITBTT_VLI}; crossfade state for packetId {lPacketNum-1/lPacketNum-2 fallback,no frames,crossfade on/off}; "checkAndMarkFrameDiscontinuity: %lldus"; "getLocationAtTime earlier than oldest valid packet"; NACK {"nack from %s count=%u, min=%u, max=%u","not transmitting %u stale packets","ignore NACK packet with incompatible protocol version"}; perf-counters {rsend=DataBlock sends,nackr=resync NACK,nackd=data NACK,nacku=unsendable NACK} + "Histogram of transmitted packet info"; params {transmit port,dstaddr unicast/multicast,lastpktid}
## `player_settings`

**coverage** `strong`

The PlayerSettingsManager (settings v2): volumeMode (including PASS_THROUGH where EQ is locked), monoMode, wifiDisable/meshDisable/wifiPowerSave, batteryUsagePolicy, bluetoothPolicy, networkingMode, lineIn, eq (treble/bass/loudness), gainTrimDB, and zone attributes. These are the per-player keys the settings namespaces and `/settings` surface map onto.

**Technical description:**

keys {volumeMode,monoMode,wifiDisable,meshDisable,wifiPowerSave,batteryUsagePolicy,bluetoothPolicy,networkingMode,lineIn,eq (treble),eq (bass),eq (loudness),gainTrimDB,zone attributes}; volume modes incl PASS_THROUGH ("EQ cannot be adjusted in PASS_THROUGH volume mode") + "Device does not support fixed output"; "Satellites not supported; configure primary device"; "monoMode (not supported in setup)"; wifiDisable reasons {reason unknown,netstart refused,no Ethernet carrier,meshDisable (netstart refused)}; "Netstart failed to modify meshDisable setting"; "Unable to set setting(s): ... (unsupported)"; actors {PlayerSettings,PlayerSettingsManager,playersettingsmgr,gmSat,ukwnt}

- **name:** PlayerSettingsManager (settingsv2)
<details><summary>Evidence (1)</summary>

- @ 0x10ee5144 — playersettings block

</details>

## `product_models`

**coverage** `strong`

The product codename ↔ ZPS model table: Playbar, ElRey, Bravo, Hideout, Pallas, Apollo, Lasso, Play1, TitanWOW variants, Monaco, Play3, Encore, Alpine, Pinewood, Prima, Mojave, Optimo2/Optimo1 — with the ZPS numeric ids. Use this when a log or config names a codename you need to map to a product.

**Technical description:**

codenames {Default,Playbar,ElRey,Bravo,Hideout,Pallas,Apollo,Lasso,Play1,TitanWOW-T,TitanWOW-P,TitanWOW-G,Monaco,Play3,Encore,Alpine,Pinewood,Prima,Mojave,Optimo2,Optimo1}; ZPS ids {ZPS11,ZPS12,ZPS13,ZPS14,ZPS15,ZPS16,ZPS17,ZPS18,ZPS19,ZPS20,ZPS21,ZPS22,ZPS23,ZPS24,ZPS26,ZPS27,ZPS31,ZPS35,ZPS37,ZPS38,ZPS43,ZPS54,ZPS55,ZP120,ANVIL}; dspconfigparam + "ConfigParam lookup from player model %d failed"

- **name:** product codename + ZPS model table
<details><summary>Evidence (1)</summary>

- @ 0x10f24808 — model table

</details>

## `protocol_info`

**coverage** `strong`

The Source/SinkProtocolInfo CSV: the URI-scheme whitelist (http-get, x-file-cifs, file, sonos.com-mms/http/spotify/rtrecent, x-rincon family, x-sonosapi-stream/hls/hls-static/radio, x-rincon-cpcontainer) each paired with a MIME filter. SetAVTransportURI acceptance is gated by this list — an unsupported scheme never reaches the engine.

**Technical description:**

schemes {http-get,x-file-cifs,file,sonos.com-mms,sonos.com-http,sonos.com-spotify,sonos.com-rtrecent,x-rincon,x-rincon-mp3radio,x-rincon-playlist,x-rincon-queue,x-rincon-stream,x-sonosapi-stream,x-sonosapi-hls,x-sonosapi-hls-static,x-sonosapi-radio,x-rincon-cpcontainer}; mime types {audio/mp3,audio/mp4,audio/x-m4a,audio/mpeg,audio/mpegurl,audio/x-mpegurl,application/x-mpegurl,application/vnd.apple.mpegurl,application/dash+xml,audio/mpeg3,audio/wav,audio/x-wav,audio/wma,audio/x-ms-wma,audio/aiff,audio/x-aiff,audio/flac,application/ogg,audio/ogg,audio/x-spotify,audio/x-sonos-recent,audio/x-sonosapi-radio}; vars {SourceProtocolInfo,SinkProtocolInfo,CurrentConnectionIDs}; actors {ConnectionManagerServer,ConnectionManagerRenderer}

- **name:** SourceProtocolInfo/SinkProtocolInfo CSV
<details><summary>Evidence (1)</summary>

- @ 0x10eb87e4 — protocolInfo CSV

</details>

## `queue_schema`

**coverage** `strong`

The track-queue status XML: `<Queue>` with EntriesMax/Used/HighWater, string-table usage, UpdateID, ObjectID, OwnerID, Policy, and CloudQueue fields. The high-water marks and string-table stats are diagnostic — they tell support how full the queue really got. UpdateID is the change counter event subscribers watch.

**Technical description:**

<Queue Name='%s'><EntriesMax>%d</EntriesMax><EntriesUsed>%d</EntriesUsed><EntriesHighWater>%d</EntriesHighWater><StringTableSize>%d</StringTableSize><StringTableUsed>%d</StringTableUsed><StringTableHighWater>%d</StringTableHighWater><UpdateID>%u</UpdateID><ObjectID>%s</ObjectID><OwnerID>%s</OwnerID><Policy>%d</Policy><CloudQueueHost>%s</CloudQueueHost></Queue>; <TrackQueueSummary>Shared/Private</TrackQueueSummary>; GPM {com.google.RemoteSonosReceiver,Google Play Music}

- **name:** track-queue status XML
<details><summary>Evidence (1)</summary>

- @ 0x10ea9620 — queue schema

</details>

## `radiolog`

**coverage** `?`

The `/radiolog` diagnostic surface: radio-related event logging exposed through the status pages — station tuning, stream errors, and ICY metadata events. Useful when a stream plays but metadata or tuning behaves oddly.

- **detail:** flags {recurse,redir,unsupported}; rc_impl settingsWriteback
## `rc_impl`

**coverage** `strong`

The rc_impl layer: the RenderingControl implementation's event vocabulary (VolumeChangedEvent, DuckingEvent, StereoPairStateEvent, TrueplayCalibrationChangedEvent, FeatureConfigChangedEvent), settings write-back, ramp-type enum for fades, sonar calibration modes, and the `/status` output schema that exposes current levels.

**Technical description:**

events {RcStateUpdateEvt,VolumeChangedEvent,DuckingEvent,ProxiedFastVol0Event,StereoPairStateEvent,TrueplayCalibrationChangedEvent,TrueplayStateEvent,RcNotifyGrcEvent,FeatureConfigChangedEvent,LocalPlayerChangeEvent,UpdateSonarEvent}; "Delivery of %s(%u) event cancelled"; RStringTRequestManCB; settingsWriteback; roles {HT_BONDED_MASTER,HT_BONDED_SATELLITE,UNBONDED_DEVICE,Master}; HT params {SubGain,SubCrossover,SubPolarity,SubEnable,VolumeScalingFactor,HeightChannelLevel,DialogLevel,SpeechEnhanceEnabled,SupportsMaxDialogLevel,SurroundLevel,MusicSurroundLevel,SurroundEnable,SurroundMode,AudioDelay,AudioDelayLeftRear}

- **name:** RenderingControl implementation (rc_impl)
<details><summary>Evidence (1)</summary>

- @ 0x10e87630 — rc_impl block

</details>

## `registration`

**coverage** `?`

Local device registration: the on-LAN enrollment half that precedes cloud registration — tracks per-device reg state inside the household.

- **secreg_fsm:** endpoints /product/v2/households/%s/players?action=refresh + ?action=complete&token=%s; FSM {registration during suspend,time expired,success,retrying at %ld,error,regStatus}; signing {"Invalid registration signing key in IPC payload","Registration signing key set/cleared"}; "Household customer ID \[%s\] in conflict with local device \[%s\]"; "regState changed %d -> %d"; "Transfer mode old (e:%d) new (e:%d)" + tjmgrExitSecureRegTransferState + newRegisteredCertSonosIDLocked; mutualssl/sslError/errno fields; "removed invalid cert"; "Unexpected 401 response"; secureRegTransfer/currentAccount; perf <PerformanceCounterTables> + persistentCache {lastUsed,expires}
## `registration_machine`

**coverage** `?`

The `regdevicecert.cxx` FSM driving the secure-registration protocol: sequential regState transitions with timeout/retry handling, transfer-mode tracking, and SSL error capture. It orchestrates the two-phase enroll (refresh then complete) under `device_registration`.

- **name:** regdevicecert.cxx registration/secure-reg FSM
- **cloud_api:** `/product/v2/households/%s/players?action=refresh`, `/product/v2/households/%s/players?action=complete&token=%s`
- **fsm:** states regStatus + regState %d->%d; events registration during suspend\|time expired\|success\|error\|"retrying registration at time %ld"; secureRegTransfer tjmgr flow: exitSecRegTransferState scheduled/de-scheduled/run via tjmgrExitSecureRegTransferState; currentAccount
- **signing:** Registration signing key set/cleared via IPC payload ("Invalid registration signing key in IPC payload")
- **events:** NewCertRegistrationEvent inprocess-event {SonosID}; newRegisteredCertSonosIDLocked; RegisteredCertSonosID/RegisteredCustomerID keys; Household customer ID conflict/changed detection
## `rendering_control`

**coverage** `?`

The RenderingControl service: volume/mute/EQ per zone with LastChange events — the slider/mute-button SOAP surface.

- **volume_engine:** per-zone FSM: {override\|normal} volume + deferred volume/mute + ducking; math "DuckVol=%d (%d%% of %d = %d, offset %0.2fdB due to %d channels in zone)" + "Unbounded ExtSrcVol=%d ExtSrcVolMusic=%d (boosted %0.2f dB based on # of channels, plus surround lvl gain of %0.2f dB)"; audioSystemsTuning; persistentEQ.xml apply; DSPControlChProc/DSPControl
- **rc_impl_stp:** SetEQ action params {DesiredLoudness,DesiredBass,DesiredTreble,RampType} via RenderingControlSetEqActionEvent/RcSetEqActionEvt; VolumeSetActionEvent(vol,mute,ignoreProxy); primary-only gate "This command is allowed only on primary" + "Muse command forwarding failed"; volumeScalingFactor; RC propagation to {SUB,second SUB,SURROUND} (dual-sub support); signal-channel errors {invalid playId,failed to stop signal,incorrect playId,nothing is currently playing,couldn't create an audio stream,only one signal can run at any given time,invalid channel,disallowed by policy} + channelNumber
- **led_feedback:** button feedback {"in start music play feedback from 0x%x","led feedback for timeout waiting to start play/pause","waiting-to-play-music feedback:%d","waiting-to-pause-music feedback","unsupported/unhandled play feedback action:%d","cleared fast volume zero after %s","pause confirmed by PlaybackStateChangedEvent"}; LocalPlayURI errors {RC control URI,mute+volume state,restore default volume,set AVTransportURI,start playback,coordinator transport state}; PLAYING/TRANSITIONING states
## `reporting`

**coverage** `?`

The reporting/telemetry umbrella: usage metrics, dropout events, TV sessions, spotify stats, and the uploader that ships them. Each subsystem's report schema is documented separately; this is the shared submission plumbing.

- **crashdump:** sentry uploader: dump-proc-anacapa w/ build.version, sentry\[release\], sentry\[tags\]\[%s\], %s\[sonosID\]; dumps anacapad.{core,dmp}+sonospowercoordinator.dmp+btmanager.dmp+netstartd.dmp + *.properties; counters sonospowercoordinatorCrashCount/netstartd.count; logs /opt/log/anacapa.{hdmi,tv}.log,/tmp/AirPlay.log,/opt/log/{btmanager,btservice}.log,/tmp/backtrace,/tmp/crashed_play_state; killfiles /tmp/anacapa_prevent_crashdump_upload+prevent_crashdump_upload; "Failed to write attachment %s to sentry upload"; htsnk dump
- **play_report:** RPlayReportSubmitter: submitPlayReport/playReport/nowplaying endpoints; fields {serviceType,activatedAccountCode,errorStatus,errorType,multiAccountId,codec,originDelay,outputDelay,endReason,skippedTrack}; "final report" notify; "periodic report interval set to %lld seconds"; spotify-connect serviceType
## `saved_queues`

**coverage** `strong`

The `.rsq` saved-queue format: gzipped XML at `file:///jffs/settings/savedqueues.rsq` with a `.tmp` write path for atomicity — `<SavedQueues LastUpdateDevice Version Next>` containing `<SavedQueue>` entries with Id, Curated flag, and NumTracks. Validation rejects corrupted counts, bad ids, and version mismatches. 'Sonos playlists' are exactly these files.

**Technical description:**

file:///jffs/settings/savedqueues.rsq (+.tmp write path, .d.rsq variant, application/gzip accepted); XML <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"><SavedQueue Id= Curated= NumTracks=%u><Track URI= MD=></SavedQueue></SavedQueues>; validation: corrupted track count, invalid queue-id/next-id/mismatch, invalid version/numtracks, boot file invalid; migration "Migrating ObjID=%s SN=%u from SID: %u to %u"; SQ:%s objid prefix; <res protocolInfo="file:*:audio/mpegurl:*">; album-art: "No num tracks found, so emitting the first four artworks found"; mobile- playlist prefix; "Add Track Move range: %u-%u to %u"; replication push on save

- **name:** SavedQueues .rsq format
<details><summary>Evidence (1)</summary>

- @ 0x10ed329c — .rsq schema literals

</details>

## `sentry_upload`

**coverage** `strong`

The crash-dump pipeline: `/upload`, `/watchdog`, `/legacy-to-sentry` routes plus the daemon proxies; dump files (anacapad.core, *.dmp for each daemon, jffs debug dirs) collected and uploaded to crash-upload service. 'No URL found to upload' means the crash service endpoint isn't configured.

**Technical description:**

routes {/upload,/watchdog,/anacapad-external,/sonospowercoordinator-external,/watchdog-legacy,/legacy-to-sentry,/btmanager-external,/sonosledmgrd-external,/netstartd-external}; dumps {anacapad.core,anacapad.dmp,sonospowercoordinator.dmp,btmanager.dmp,netstartd.dmp,/jffs/app/debug/sonosledmgrd.dmp}; sidecars {.properties per daemon,sonospowercoordinatorCrashCount,netstartd.count}; attachments {watchdog.log,watchdog.dmesg,/opt/log/anacapa.hdmi.log,/opt/log/anacapa.tv.log,/tmp/AirPlay.log,/opt/log/btmanager.log,/opt/log/btservice.log,/tmp/backtrace}; opt-out flag prevent_crashdump_upload + /tmp/anacapa_prevent_crashdump_upload; sentry schema {sentry\[release\]=build.version,sentry\[tags\]\[%s\],sentry\[user\]\[id\],%s\[sonosID\],%s\[hhid\],%s\[serial\],%s\[upload_sw_version\],%s\[hardware_version\],%s\[model\],%s\[upload_spotifyesdk_version\],%s\[play_state\],%s\[watchdog_crash\]}; form-data + text/plain; charset=UTF-8/us-ascii + application/octet-stream; gzip stream "writeStream failed - Bytes compressed: %d/%d"; play-state file /tmp/crashed_play_state + htsnk; results {"Minidump \[%s\] uploaded to sentry.io. UUID: %s","Coredump \[%s\] successfully uploaded","didn't finish upload; http resp: \[%d\]; last error: \[%s\]","did not return a UUID","No URL found"}; dump file %s-anacapa_dump.gz + originator + Version:

- **name:** crash-dump/sentry pipeline
<details><summary>Evidence (1)</summary>

- @ 0x10ea7c14 — sentry block

</details>

## `settings`

**coverage** `?`

The settings umbrella: household settings, player settings, replicated settings, local settings manager, effective settings — each documented separately. Settings are layered (default → config → featureConfig → replicated → local), so 'effective' values are what actually apply.

## `share_indexer`

**coverage** `strong`

The music-library share indexer: `localRequestReindex`, `localRequestResort` (a resort request escalates to full reindex when needed), `localRemoveUnsupportedShares`, and the `<Shares>` XML schema with per-share Path/UserName/VerifiedValidProtocol/Id. `ShareIndexInProgress`/`ShareIndexLastError` in ContentDirectory events report its state.

**Technical description:**

ops {localRemoveUnsupportedShares,localRequestReindex,localRequestResort,"Turning resort request into full reindex"}; reindex "request reindex (ad:%d sf:%d fr:%d si:%d st:%d lc:%s)"; schema <Shares LastUpdateDevice AlbumArtistDisplayOption IndexSortOrder LastIndexChange><Share Path UserName Password VerifiedValidProtocol Id>; errors {"Unable to find share with given ID","Failed to remove/add share","The share path provided already exists","need to recover ix=%d ver=%d","indexing reported err=%d for %s","Mounting failed.","Local index storage error.","Remote file share error.","Indexing canceled.","connection failure","Cannot exceed the maximum number of allowed shares","The path provided is subsumed by an existing share","Path is malformed","Access to share is denied","Unsupported share protocol."}; lifecycle {"replication failed","replication skipped: local fmt %u, remote fmt %u","initial scan for new files failed","Would have performed scheduled reindex but shares unchanged","reindexing failed","reverting desired state: %d","processing index complete (c:%d i:%d f:%d lc:%s) - %u","skipping commit attempt: m_bCommitted/m_bWait/m_bTerminate","initialized index, scheduling advertise","commit %u","processing index: source (%s:%u)","recovered ix=%d with ver=%d"}; R_BrowseByFolderSort,Tracknum

- **name:** music share indexer
<details><summary>Evidence (1)</summary>

- @ 0x10e8a004 — share indexer

</details>

## `smapi_client`

**coverage** `strong`

The SMAPI SOAP client — the outbound side: `http://www.sonos.com/Services/1.1` action namespace with getSessionId, refreshAuthToken, getDeviceAuthToken, getMediaURI, getMediaMetadata, getMetadata, search, reportPlayStatus/Seconds, reportStatus, getAlbumArtURI and more. Session/key vocabulary (deviceSessionId, sessionId) and key-swapping live here. Everything a music service sees from the player arrives through this client.

**Technical description:**

action namespace http://www.sonos.com/Services/1.1|{...}; actions {getSessionId,refreshAuthToken,getDeviceAuthToken,getStreamingMetadata,getUserInfo,getMediaURI,getMediaMetadata,getMetadata,search,reportAccountAction,reportPlayStatus,reportPlaySeconds,setPlayedSeconds,reportStatus,getAlbumArtURI}; session/key vocab {deviceSessionToken,deviceSessionKey,CK_deviceSessionKey,contentKey,CK_contentKey,MU_deviceSessionKey,MU_contentKey,authToken,privateKey,userInfo,algorithm,keySize,value,expiration,httpHeaders,mediaRequestInfo,uriTimeout,contentKeys,callbackPath}; mediaURI fields {positionInformation,privateDataFieldName,contentKeys}; browse params {recursive,count,index,total,mediaCollection,mediaMetadata}; report schema "reportPlayStatus: %s; context: %s; uri: %s; cid: %s; id: %s; seconds: %lld; offset: %lld" + contextId + interval; semantics enum {IMPLICIT,EXPLICIT:PLAY,EXPLICIT:SEEK,EXPLICIT:SKIP_FORWARD,EXPLICIT:SKIP_BACK,EXPLICIT:PAUSE}; metadata URNs http://purl.org/dc/elements/1.1/|{id,creatorId} + urn:schemas-rinconnetworks-com:metadata-1-0/|{narratorId,podcastId,summary,total,duration,authorId,bookId,producerId} + urn:schemas-upnp-org:metadata-1-0/upnp/|artistId; browse hierarchies {newrelease:album:genre:,staffpick:album:genre:,top:album:genre:,top:track:genre:,playlist:,%s.#%s,favorite:track,artist_tracks:}; skd://itunes.apple.com/P000000000/s1/e1 FairPlay; X-Sonos-Playback-Id header; "reauthorizing preinstalled service SID %u"; "mult-key decrypt params not found"; "WARNING! getDeviceAuthToken ... credentialType = %u (not OAuth)"; secondsSinceExplicit; "flushing on cert change"; media-sens cache {cont_prov_media_sens,content_prov_list,billboard,"cached/loaded/reset session %u:%u"}

- **name:** SMAPI SOAP client (sonos_cprovider)
- **protocol_info:** protocolInfo CSV {sonos.com-mms:*:audio/x-ms-wma:*,sonos.com-http:*:{audio/mpeg3,audio/wma,audio/wav,audio/aiff,audio/flac,application/ogg,application/dash+xml,application/octet-stream}:*,sonos.com-spotify:*:audio/x-spotify:*,sonos.com-rtrecent:*:audio/x-sonos-recent:*,x-sonosapi-hls:*:*:*,x-sonosapi-hls-static:*:*:*}; exts {.aiff,.flac,.unknown}; audio/vnd.radiotime; "Unsupported mime type (%s) for object id (%s)"
<details><summary>Evidence (1)</summary>

- @ 0x10f0f4b0 — sonos_cprovider block 1

</details>

## `smb`

**coverage** `?`

The SMB client layer under mntmgr: UNC path parsing, dialect probing, credential handling, mount/umount lifecycle, and the stream-open path library browsing uses. 'Too many shares mounted' and per-share failure flags are its guards.

- **iterator:** resilient dir walk: mount "Successfully mounted %s as %s"; reconnect "failed to connect to %s (error=%d); reattempt=%d"; resume "Reopened directory %s at start"/"iterating to %s"/"Found last known item %s"; fast-forward/stat errors reattempt-tagged; /tmp/smb/tmp_idx staging
## `sntp`

**coverage** `?`

The SNTP time discipline: chrony-backed clock management, virtual-clock concepts for group timing, server switching when a source degrades (0.sonostime.pool.ntp.org among the pools), and the GC-sync role that makes one player's clock the reference. Sample-exact multiroom play depends on this being healthy.

- **clock:**
  - **discipline:** "Clock pull hit the bottom/top rail" clamps; "Current Rate:%d, adjustment:%d, Target delta ppm:%g"; "Estimated offset(ms):%g, n:%llu"; "Slope change detected. bumping slope dispersion. ErrorMode/OffsetMode"; "clock quality suspect. Sdev: %f"; "Time went backward, discard SNTP offset"; transitions "Clock transition into PCM"/"into system time"; "clock audio sourced: %c"; "Excessive AudioSync %f total"
  - **poll:** SNTP requests to group coordinator ("ret = %x, error = %f"); "SNTP success after %u failures"; "complete sync reset"; "Offset set to %f for server ip:port"; "Suspend and reset"; persistence sntp.txt in sys/debug (save_sntp)
  - **server:** SNTP server on port %hu per clock; server-clock add/remove via "sntp-%u-clock" requests (evtMask+fd); virtual clock install/remove on port %u; interrupt fd + SO_TIMESTAMP + ToS + hi-priority Tx queue
  - **stats_schema:** {Flags,NewServer,UpdateServer,TransitionValidOffset,NotUsed,Valid,Successes,OverThreshold,ErrMode(statistical mode of error values),AudioSync,Slope,vcxoRate,Doubling Ratio,Histogram,BigBin}
- **detail:** "Clock transition into system time"; "SNTP success after %u failures"; "SNTP request to group coordinator failed, ret = %x, error = %f" (GC-requested); "SNTP request failed, will retry."; "complete sync reset"; "Offset set to %f for server %u.%u.%u.%u:%d"; "set SNTP server: %d.%d.%d.%d"; "Suspend and reset" op; sntp_ files + sys/debug + save_sntp
## `spdif_burst`

**coverage** `strong`

The SPDIF burst-format taxonomy: 37 unsupported formats plus the handled Dolby/DTS burst types. When a TV sends an unrecognized bitstream, it's this table that decides 'unsupported' — explaining silent HDMI inputs.

**Technical description:**

supported {Dolby Digital,Dolby Digital Surround,Dolby Digital Plus,Dolby Atmos (DD+),Dolby TrueHD,Dolby Atmos (TrueHD),Dolby MAT,Dolby Atmos (MAT),DTS (Type1),DTS (Type2),DTS (Type3)}; unsupported enum {NULL Burst,Pause Burst,AC-3,SMPTE 338M v1-v5,MPEG1 Layer 1,MPEG1 Layer 2/3,MPEG2,MPEG2-AAC,MPEG2 Layer 1/2/3 LSF,DTS1-4,ATRAC,ATRAC 2/3,ATRAC X,WMA Professional,MPEG2 AAC LSF,MPEG4 AAC,Enhanced AC-3,MAT,MPEG4 ALS,Reserved 2-4,Extended Data,MPEG4 AAC LC in LATM/LOAS,MPEG4 HE AAC in LATM/LOAS,DRA} all prefixed "Unsupported "; this is the IEC 61937 data-type code map (NULL/PAUSE are IEC-61937 burst types; MAT = Dolby MAT container; DRA = DRA Chinese standard); per-type error counters tv_decoder_error_{dd,ddp,mat,pcm,dts1,dts2,dts3} + tv_decoder_dsp_error_dap

- **name:** SPDIF burst-format taxonomy
<details><summary>Evidence (1)</summary>

- @ 0x10ee650c — burst enum

</details>

## `spec_descriptors`

**coverage** `confirmed`

The full type system behind the cloud API: 383 machine-readable descriptions of every request, response, event and data structure the protocol uses. Each is a small record that names its message class (1 and 2 are request-shaped, 3 is the UPnP-bridge response shape, 4-7 are event and update shapes) and points at its field list. Decoded correctly, most specs lead with an ok status field (170 of them) or an upnpResponse envelope (the 60 UPnP-bridge replies), while real payloads are types like alarm, timer, zoneDefinition, groupInfo and musicServiceAccount. Fifty-two descriptors are deliberately empty - operations that take no arguments. Every field entry also names its type, so the whole request/response grammar is recoverable offline. 558 of the 603 cloud routes are now bound to their spec through a small accessor on the operation's dispatch table.

**Technical description:**

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
<details><summary>Evidence (1)</summary>

- @ 0x10e9ba80/0x10f9f87c — 383 0x80-byte descriptor records; accessor+fffff88 signature; root names resolved via spec_object_table

</details>

## `spec_object_table`

**coverage** `confirmed`

The master vocabulary for the whole cloud-API schema system: a table of 331 entries where every type name, field name, event name and namespace label lives. Small number-codes inside each operation's spec list index into this table to spell out that operation's fields - three leading slots hold internal helpers, then 'none' (the empty marker), then the ~325 real names in alphabetical order. We found both directions of the lookup inside the binary: a function that turns a number into its name, and one that searches for a name to get its number - which is what finally proved the numbering scheme beyond doubt.

**Technical description:**

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
<details><summary>Evidence (1)</summary>

- @ 0x10f97088 — 331-pointer table; all targets resolved

</details>

## `spec_pair_stream`

**coverage** `confirmed`

How every command's field list is stored. Each operation's spec lives in a packed table of small numbers that point into the master vocabulary table, and we have now proven exactly how they read: the entries come in {field-name, type} pairs. The field-name positions carry the real wire keys you would see in the JSON - ok (the status field that opens most messages), globalError and upnpError (the error slots), upnpResponse (the UPnP-bridge reply envelope), plus specialised slots like groupCoordinatorChanged and playbackError. The type positions say what kind of value fills each field - most fields carry upnpEvent, the universal value wrapper, while richer fields name concrete types like channelMapPair or bluetoothDevice. When the same field name repeats with different types, the field is allowed to be any of them - that is how error responses declare their variant payloads. A zero entry means the slot is optional or absent. Different operations' lists are stored back-to-back so they can share common tails - a compact schema encoding.

**Technical description:**

Spec lists = packed pools of u32 indices into spec_object_table. INDEX SPACE RESOLVED via the idx->name lookup f_109ecb5c (cmplwi 0x146=326; slwi*4; lwzux base 0x10f97094) and name->idx f_109ecb90 (strcmp walk from 'none'): runtime index i resolves to table\[3+i\] - the 3 leading table slots are fnptrs, semantic idx0='none'. GRAMMAR RESOLVED ({fieldName,typeName} pairs): blob = (field,type)* - a flat sequence of pairs; even positions carry WIRE FIELD names (globalError 561x, ok 175x, upnpResponse 60x, upnpError 60x, groupCoordinatorChanged 53x, playbackError 44x, accountError, sessionError, playerSetError, transitionToShipModeStatus), odd positions carry the field's TYPE (upnpEvent 422x = the universal value/event wrapper, wiredSubStatus 202x, channelMapPair 92x, chirpRequest 79x, bluetoothDevice, deviceInfo, bluetooth, artist...). A repeated field name = the field's type is a UNION of the following types (e.g. globalError:{chirpRequest|accessoryId|none|wiredSubStatus} = five error-variant payloads). idx0 'none' = absent type / optional slot. Message roots: 'ok' leads 170 specs (status/ack field first), 'upnpResponse' 60x (UPnP-bridge envelope), plus object-typed roots (timer, zoneDefinition, alarm, area, groupInfo...). Outbound emitters call idx2name with constant type-ids (addi r3,0x31/0x2f/0x67...) then serialize - index space is an enum baked at build time. NOTE: earlier records decoded blobs against table\[i\] (off by 3); all route member lists + this grammar re-derived under table\[3+i\].

- **name:** muse spec-pair descriptor stream
- **grammar:**
  - **layout:** (fieldNameIdx, typeNameIdx)* — flat pair sequence, no header
  - **fields:** even positions = JSON/wire field names (ok, globalError, upnpResponse, upnpError, accountError, sessionError, playbackError, groupCoordinatorChanged...)
  - **types:** odd positions = type names; upnpEvent = universal value/event wrapper, others are concrete object types
  - **union:** repeated field name = type union of the listed types (error-variant payloads)
  - **none:** idx0 = absent/optional slot
  - **index_space:** semantic idx i -> table\[3+i\]; lookups f_109ecb5c (idx2name) / f_109ecb90 (name2idx); bound 326
<details><summary>Evidence (1)</summary>

- @ 0x10fa51b3 — tag-word blob; format proven, tag semantics partial

</details>

## `spotify`

**coverage** `?`

The on-device Spotify stack: the eSDK session, the SMAPI↔VLI transitions that let a Connect session take over an existing group, the queue/track pipeline, and the zeroconf/broadcast pieces. `sonos.com-spotify:` URIs and Spotify Connect sessions both funnel through here.

- **mdns:** _spotify-connect._tcp mDNS service; CPath sonos; "deregister skipped for empty SID"/"register skipped for non-empty SID: %s"
## `spotify_connect`

**coverage** `?`

The Spotify Connect path specifically: AP/hermes control plane, credential blob handling, login FSM, playback session management, and the NTS callbacks that bridge eSDK events to the Sonos transport. A Connect takeover is this subsystem asserting control over the group's transport.

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
## `spotify_esdk`

**coverage** `strong`

The embedded eSDK (v3.205.205-gd0f06121): the Sp* API surface (play/pause/seek/volume/shuffle/repeat/login/logout/queue/events), the module kernel, the event enum, and the init validation. This is the same SDK third-party hardware licensees get — running inside anacapad.

**Technical description:**

cmds RSpotifyPlayback{Play,Pause,Seek,SeekRelative,SkipToNext,SkipToPrev,BecomeActiveDevice,SetDeviceInactive}; NTS callbacks {ConnectionMessage,ConnectionNewCreds,StreamStart(id,fmt,drm,size,gain),PlaybackNotify,StreamFlush,StreamGetPosition(id),Error}; mDNS {"Registering Spotify Connect mDNS service \[%s\]","Unregistering","Updating ... event %d","new cert updating mDNS"}; seamless delegation {"Seeking to %ims in support of seamless delegation","Timed out waiting for AudioStart from eSDK during seamless delegation","%s failed to become active","set seek time to %u ms, byte offset: %zu"}; VLI transition matrix {"VLI source switch logout - async","Normal logout - blocking","VLI deselected, last id: %u, pos: %u, bLogout: %d","Detected VLI source switch","Connect mode toggled during transition - allowing login to proceed","Account matches ... skipping login","Already logged in with same user","username may have changed","mismatch ... regular logout","mismatch ... async logout","Already logged out"}; dual tracking "pos: %u (VLI: %d \[%d\], SMAPI: %d \[%d\])"; track FSM {AwaitingCurrentTrackAck,AwaitingNextTrackAck,CurrentTrackPlayed}; metadata {bitrate,track_uri,original_track_uri,playback id,audio_quality,hifi_status} New/Next Track Metadata; URIs spotify:track:/spotify:episode: "Bogus track URI"; media delivery {"unsupported DRM format: %d","stream start (id:%u, type:%s, size:%u)","stream data ... size: %u, offset: %u","stream end","stream flush ... pos: %u","getPosition (id=%u): result %u",performFlush}; events {GroupVolumeChangedEvent,SpotifyDelegationNotification,SpotifyMDNSRequest}; "Sent group volume change %u to eSDK (mute %d)"; TPM legacy "Spotify setPositionInfo ... uri=%s, playbackId=%s, position=%.3f, isFinalReport=%d"; init {SpInit supported media formats: %llu,devid,remoteName,deviceType,libraryVer,resolverVer,productId}; R_ServiceBitrate

- **name:** eSDK playback session
- **session_detail:** eSDK event enum {TrackChanged,ShuffleOn,ShuffleOff,RepeatOn,RepeatOff,BecameActive,BecameInactive,AudioDeliveryDone,ContextChanged,MetadataChanged,NetworkRequired,TrackDownloadStalled,QueuedTrackAccepted}; callbacks {setPositionInfo,notifyDownloadComplete,setTrackStreamId,setTrackSize,notifyTrackChanged,notifyMetadataChanged,addTracks}; NTS extra {ConnectionNotify,PlaybackApplyVolume,StreamEnd(id),StreamSeekToPosition(id,pos)}; HAL {spot_hal,Dns HAL Exit(status,err)}; token {"Treating auth token as expired","Login failed with E_SONOS_BAD_ACCOUNT","attempting refresh","Refresh token failed with upnp result: %hu","Now time %ld.%06ld. Account info last update time %ld.%06ld"}; pullContext(playing,seek .%06d,byte offset,bitrate,observable); SWPBL-259788 guard "Delegated VLI session is not playing; skipping pullContext()/become active device ... avoid re-initiating Direct Control"; SMAPI↔VLI {"SMAPI to VLI transition detected. Forcing loginZC","VLI selection with stored account but already in connect mode - likely resuming VLI (e.g., after AirPlay)","Already logged in with same account, skipping loginZC"}
- **queue_fsm:** spotifyTrackQueue (spot_q): tracks {current,next,previous} matched by streamId; ack states {Current Acked,Queued Acked}; transitions {"Track change: (%s\|\|%s) -> (%s\|\|%s)","Unknown track change ... != upcoming","ERROR current/next track mismatch","!!!! \[BUG\] RESOLVING acked NEXT track mismatch"}; ops {Play track at %u ms,Next track,Queueing track,Add tracks}; pending FSM {Current Track Pending,Current Track Still Pending,Play & Queue Tracks,Now Pending,Still Pending,Waiting In-Flight Queueing,Max retries (%u) exceeded. Resetting,Queued pending track after %u failures}; seek paths {"Resume from pause fast path, offset: %zu","Seek fast path: %u ms","Forcing seek slow path","using SpPlayUri ... type/uri","adjusting initial Play position","Play from beginning"}; safeguards {"Suppressing phantom playback-start after end-of-queue","Playback finished at position=%lld ms","Resetting position ... download has not completed","position info request for previous track → cached"}; dump " \[%s\]: id: %u, %s\|\|%s, pos: %lld / %lldms, delivered: %d, rendered: %d"
- **vli_control:** RSpotifyVLIControl: metadata {track,artist,album,playback_source_uri,bitrate}+Next Metadata; cookie-validated sessions "Ignoring stale stopSession due to cookie mismatch: %d != %d"; callbacks {onVirtualLineInSuspendSession,onVirtualLineInStartAudio,onVirtualLineInStopAudio,onVirtualLineInPlayModesChanged} cookie %d; delegation guards {"Ignoring pause while setting state / delegating. isPlaying set to %d","Ignoring became inactive","Ignoring volume change (%u)"}; actors {spotifyVliControl,spotify_vli,spotify_md,scopeSpotyVli}; R_SPOT_EVT_METADATA_CHANGE + SpotifyInternalEvent unhandled type
<details><summary>Evidence (1)</summary>

- @ 0x10ea23a0 — spotify esdk block

</details>

## `spotify_zeroconf`

**coverage** `strong`

Spotify zeroconf/broadcast: the `_spotify-connect._tcp` advertisement, device-added events, credential transfer (auth token/code), and the local webserver the Connect handoff uses. This is how the Spotify app discovers and pairs to the speaker on LAN.

**Technical description:**

URIs x-spotify:// + x-spotify-file://; Content-Type application/json; charset=utf-8; ver 2.9.0; client types {Partner,Spotify}; results {SpotZc_Failure,SpotZc_Success}; GC gate "Non-GC returning 404 from getInfo" + "reject zc req %s"; getInfo schema {deviceID,publicKey,deviceType,libraryVersion,resolverVersion,groupStatus,authorization_code,tokenType,clientID,productID,scope,availability,supported_drm_media_formats,supported_capabilities,modelDisplayName,brandDisplayName,remoteName,deviceName,statusString,spotifyError,responseCode}; errors {ERROR-INVALID-ARGUMENTS,ERROR-LOGIN-FAILED,ERROR-SPOTIFY-ERROR,ERROR-UNKNOWN}; addUser/resetUsers/resetUser/userName; "addUser with userName %s; player uuid %s" fmt %s@%s; client GUID 8ec274d4-0719-48d5-a0c0-ea9821a9a4ac + embedded key 9b377073ea334637b1406f329ce005de; DC enum {SONOS_DC_UNKNOWN,OK,NO_ACCOUNT,STALE_ACCOUNT,LOGIN_FAILED,UNSUPPORTED_SERVICE,UNEXPECTED}; account fields {isGuest,accountTier,loginMS,failedLoginMS,refreshAuthMS}; ops {spotifyTransferZeroConf,Using SID %d}

- **name:** Spotify ZeroConf endpoint /spotifyzc
- **mdns:** service _spotify-connect._tcp + CPath sonos; "deregister skipped for empty SID."; "register skipped for non-empty SID: %s"
<details><summary>Evidence (1)</summary>

- @ 0x10ea14c4 — spotify.cxx zc block

</details>

## `spotifyzc`

**coverage** `?`

Same zeroconf layer (see spotify_zeroconf): the ZC event names (ZEROCONF_DEVICE_ADDED, TRANSFER_CRED, TRANSFER_STATUS, AUTH_TOKEN, AUTH_CODE) are the korn events it emits during pairing.

- **handler:** f_1020f8c4 (GC-gated getInfo; blob transfer encrypted per gap audit)
## `stream_metadata`

**coverage** `?`

The stream-metadata cache: ICY/Shoutcast titles, HLS timed-ID3, and per-stream info blocks, cached so repeated subscribers don't re-parse. `radioShowMd`/`streamInfo` fields in DIDL come from here.

- **cache:** streamingMetadataCache: "Setting metadata reference time %s at %ld"/"Rejecting invalid stream metadata reference time"; framer selection "%d (%s) framer for: %s"; "%d(%s).sd:(%s,%lld)"; mswmext=.asx sniff; sonosapi tag; "unexpected text/html"; getMediaUri %d + "URI expires in %us" + "dereferenced to: %s"; "Disallow playback of Spotify Free content from Sonos queue" — free-tier gate; "%d: StartTime: %s %dms - %ums %s"
## `svc_manifest`

**coverage** `strong`

The SMAPI service-manifest store: `svcmanifests.json` with schema-version negotiation (rejecting unsupported actual-vs-supported versions), delete/remove ops with before/after version bookkeeping, and cross-player replication of manifest files. Manifests are how custom service capabilities (strings, presentation maps) propagate to every player.

**Technical description:**

svcmanifests.json text/json; versioning {"Invalid schema version format","Unsupported schema version: actual: %u.%u, supported: %u.%u","Could not extract API header"}; ops {deleteManifest(%u) b=%d,a=%d,removeManifest(%d):%s vb=%d,va=%d}; replication {"replicating manifest file from %s","%s downloading music service manifest from %s; ret=%u, lRet=0x%x",lastUpdateDevice}; json {", \"manifests\": \[","JSON parse error %d: %s","Failed to load manifests JSON file","Added trailing slash to: %s","Invalid Id: %s","Failure parsing URI %s","unsupported CQ REST version: %s"}; RCache; "%d hasLastestVersion %d? %d"

- **name:** SMAPI service manifest file
<details><summary>Evidence (1)</summary>

- @ 0x10e8a740 — svcManifestFile

</details>

## `sync`

**coverage** `?`

The group time-sync layer: SNTP-derived clock plus the inter-player offset math that makes `play at time T` mean the same instant on every member. The ASRC/drift correction in audio_rate_ctrl is the enforcement side of this.

## `topology_base`

**coverage** `strong`

The topology manager: tracks every discovered ZonePlayer (lastIp, moreInfo, orientation, HT flag), emits topology events (AvailableSoftwareUpdate, ZoneGroupName/ID changes, ZonePlayerUUIDsInGroup), and handles quarantine/vanish transitions. The `ZonePlayerUUIDsInGroup` event is the canonical 'who's in this room' signal.

**Technical description:**

ops {RTopologyImpl,new_or_updated_zp,upgrade_report,informReplicatedSettingsChange,informLocalSecureRegStateChange,informLocalIdleStateChange,updateLocalMoreInfo,getZPUUIDs,isLocalZPIdle}; events {AvailableSoftwareUpdate,MuseHouseholdId,ZoneGroupName,ZoneGroupID,ZonePlayerUUIDsInGroup}; zp attrs {lastIp,moreInfo,spOrientation,htOrientation,newVanishedDevice}; ARP liveness {"received a valid arping from %s","arping successful for active device","arping ip address matched but not mac","arping successful for vanished device","arping unsuccessful"}; quarantine {"Discovery for player %s resulted in quarantine (%s); last network error: 0x%x",quarantinedCount,latestPlayerWithQuarantineEvent,stabilizationTime,latestDownloadErrorCode,latestDownloadErrorReason,quarantining}; missed-player "Report player missed by %s: %s" {missedBy,missedPlayer}; WoW {"\[%s\] %s WoW magic packet for MAC %02X*6","Attempted to wake %zu missing secondary ZP of primary %s (sent WoW to %zu)","Malformed UUID %s"}; "Faking device %s (%s) props to be %s gc"; "All devices idle for %ld s"; "lookup of control URI for %s failed: secure %d, service %s" + https://%s:%hu; NetsettingsUpdateID

- **name:** topology manager internals
<details><summary>Evidence (1)</summary>

- @ 0x10f12054 — topology_base block

</details>

## `tp_enums`

**coverage** `strong`

The Trueplay enum tables: node actions/statuses, speaker masks (3.1 through 9.1.4), channel types (L/R/C/SUB/LS/RS/LRS/RRS/LTM/RTM/LW/RW/MONO/LTR/RTR), orientations (horizontal/vertical/wall/facedown/inverted), and the array codenames (BRAVO, FURY, OPTIMO2, LASSO, APOLLO). The vocabulary every Trueplay message uses.

**Technical description:**

SPEAKER_MASK {UNSPECIFIED,THREE_DOT_ONE,FIVE_DOT_ONE,FIVE_DOT_ONE_DOT_TWO,SEVEN_DOT_ONE,NINE_DOT_ONE_DOT_FOUR}; CHANNEL_DIRECTION {UNSPECIFIED,DIRECT,INDIRECT_ARRAY,INDIRECT_SINGLE_DRIVER}; CHANNEL_TYPE {UNSPECIFIED,L,R,C,SUB,LS,RS,LRS,RRS,LTM,RTM,LW,RW,MONO,LTR,RTR,INPUT,OUTPUT,SCRATCH}; VOLTAGE_GAIN_CALCULATOR {UNSPECIFIED,BULK_CAPACITORS,BOOSTED_BATTERY,BUCKED_CAPACITOR}; ARRAY_SUB_SYSTEM {UNSPECIFIED,BRAVO,FURY,OPTIMO2,OPTIMO2_SURROUND,LASSO,APOLLO}; TONE_HANDLER {UNSPECIFIED,STANDARD,SUB}; TUNING_MODE {UNSPECIFIED,INDIVIDUAL_CHANNELS,ALL_CHANNELS_AS_MONO}; SUB_POLARITY {UNSPECIFIED,POSITIVE,NEGATIVE}; MEASUREMENT_MODE {UNSPECIFIED,SPATIAL,SPECTRAL}; DEVICE_ORIENTATION {UNSPECIFIED,HORIZONTAL,VERTICAL,WALL_ABOVE,WALL_BELOW,INVERTED,FACEDOWN,HORIZONTAL_LEFT,HORIZONTAL_RIGHT}

- **name:** Trueplay SDK enum registry
<details><summary>Evidence (1)</summary>

- @ 0x10fbed60 — tp enums

</details>

## `track_pipeline`

**coverage** `strong`

The eSDK track pipeline: track insertion, delivery accounting (delivery vs integration latency), position sync timer, underrun handling ('Underrun in download buffer'), redelivery on resume, DRM key/IV loading, and download offsets. Each Connect track flows through these stages.

**Technical description:**

{"Position report (track: %u reason: %s) integration reported invalid position value %u last: %u delta: %i","Not setting track info because of empty file id in case of internal file","Continuing track, last position: %u","Adding new track to the pipeline:","Flushed integration (%s). Got track %u playback position: %lu","Reset dirty_aubuffer because of '%s'","Integration reported invalid track playing","track_id %u, provided_to_integration %d, is_seeking %d","track_id=%d position from integration %u","Track %u last position: %u -> %u","Delivery latency was %u ms. Integration latency was %u ms","Sending EsdkPlaybackStats log failed","Synchronized current playback position %u ms with integration","Starting playback position sync timer for %u ms","Track fully delivered","Initializing track delivery","***TSB*** Loading new decryption key","***TSB*** Loading new decryption IV","Choosing DRM: %d media format: %d","Video Manifest(%d): %s","Asking integration to seek to the initial starting position %u","Underrun in download buffer! (0 / %d)","redeliver media at resume","Finishing playing track and advancing pipeline","Set track %u download offset %u","set_dl_pos outside seek",periodic,"!"No track to call cb_stream_on_start"","!"stopping unavailable timer in start_underrun_gp/stop_playback_pos_sync_timer""}

- **name:** eSDK track pipeline
<details><summary>Evidence (1)</summary>

- @ 0x10fd8ca0 — track pipeline

</details>

## `trueplay_service`

**coverage** `strong`

The Trueplay gRPC service (`sonos.coreaudio.trueplay.v1.TrueplayService`, API v1alpha2): methods SetupDevice, ApplySpatialTuning, ApplySpectralTuning, ApplySatelliteTuning, ClearAllTunings, GetSpatialTuning, GetSpectralTuning, GetDeviceConfig; status enum UNSPECIFIED/SUCCESS/FAILURE with Invalid-API-Version/Service-Address errors. This is the tuning engine's front door on newer platforms.

**Technical description:**

service sonos.coreaudio.trueplay.v1.TrueplayService; API v1alpha2; errors {Invalid API Version,Invalid Service Address}; status enum {MESSAGE_STATUS_UNSPECIFIED,MESSAGE_STATUS_SUCCESS,MESSAGE_STATUS_FAILURE}; methods {SetupDevice,ApplySpatialTuning,ApplySpectralTuning,ApplySatelliteTuning,ClearAllTunings,GetSpatialTuning,GetSpectralTuning,GetDeviceConfig} (req+resp names listed)

- **name:** TrueplayService gRPC API
<details><summary>Evidence (1)</summary>

- @ 0x110299ec — trueplay gRPC

</details>

## `trueplay_tuning`

**coverage** `strong`

Trueplay room tuning is really two surfaces. The SOAP side (documented actions) flips tuning on/off; the real work happens over five cloud-routed muse ops on each player: estimatorConfiguration (GET), adaptation (POST), getCalibrationStatus (GET), playSuccessTone (POST) and setSwapInputMute (POST), each reachable as v1/players/{id}/trueroom/<op> or household-qualified. Their wire schemas are decoded: adaptation posts a trueroomEstimatorConfig, calibrationStatus answers with trueroomAdaptationStatus, successTone with trueroomCalibrationStatus, and every op can return the standard globalError union (channelMapPair / wiredSubStatus / chirpRequest). Tuning tones ride a dedicated URI scheme (x-rincon-trueroom:, configmode trueroom-tone): the .ogg asset is fetched into a JFFS 'trueroom-tones' folder, played while the player saves its normal transport state, and the AVT is restored — or deliberately not restored — afterwards. What remains undecoded: the inner field names of trueroomEstimatedParams — the actual estimated distance/delay/EQ values.

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
- **trueroom_ops:**
  - **routes:**
    - **estimatorConfiguration:** v1/players/{playerId}/trueroom/estimatorConfiguration (+household-qualified)
    - **adaptation:** v1/players/{playerId}/trueroom/adaptation (+household-qualified)
    - **getCalibrationStatus:** v1/players/{playerId}/trueroom/calibrationStatus (+household-qualified)
    - **playSuccessTone:** v1/players/{playerId}/trueroom/successTone (+household-qualified)
    - **setSwapInputMute:** v1/players/{playerId}/trueroom/swapInputMute (+household-qualified)
  - **spec_types:** `trueroomStatus`, `trueroomAdaptationStatus`, `trueroomEstimatorConfig`, `trueroomEstimatedParams`, `trueroomCalibrationStatus`, `trueroomStatusEvent`, `trueroomAdaptationStatusEvent`, `enableTrueRoom`
  - **descriptor_members:**
    - **trueroomStatus:** {authzTokenStatus, featureConfigZoneExperiment, deeplink, bluetooth} — cls3 response/event; deeplink = resume-playback link after the tone
    - **trueroomAdaptationStatus:** {authzTokenStatus, featureConfigZoneExperiment, bluetoothPolicySettings, bluetooth} — cls3
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

## `tv_processor`

**coverage** `strong`

The TV audio processor: input-session tracking, the tv_processor_usage report fields, the tv-proc FSM, and the CEC/ARC interplay. Distinct from htaudio (the audio path) — this is the control/session side of TV integration.

**Technical description:**

state enum {READING,PARSING,DECODING,DECODER_DSP,NOISE_SILENCE_DETECTION,WRITING,WAITING,INPUT_ERROR,RECORDING,MONITOR_IDLING,MONITORING} + tv_block_descriptor; <TVProc>{Input,Signal(active/inactive),Mode,HTSwap,SampleRate,FrameRate,DataBurst(%d : %s),NSDResult,StreamInfo,StreamChannels(%d.%d.%d),InputChannelCount}</TVProc>; <ChannelStatusBlock>{SampleRate,SampleWidth,Mode,Flags(\[Consumer\],\[Professional\],\[PCM\],\[Muted\]),Type,MultiChannel{Layout,Allocation},Raw}</ChannelStatusBlock>; <Decoder><ActiveDecoder>None/PCM/%s/DTS</ActiveDecoder></Decoder> + ESZNA DTS magic; MPCM layout; "Unknown Dolby Databurst Type; choosing UDC"; databurst errors {Unmapped decoder error,Unmapped decoder specific DSP error}; CSB lifecycle {"First CSB accumulated","First CSB not accumulated","CSB changed to: %s \[%s\]"}; PCM-vs-encoded parser {"Parser identified Encoded signal in disagreement with Source","Parser identified PCM signal in disagreement with Source","Bitstream validity re-established"}; format changes {"Sample rate changed from (%u : %u)","Input channel count change: %u -> %u","Read size in frames changed","Input Format change %s (%d.%d.%d) --> %s","frame buffer is not evenly divisible"}; streams {mixgm%d,mixgm,mixsat} + select.read; "Start sending stream, pt %d.%06d"; reset timings {ht swap,downmix,CSB,external,SPDIF,ASRC,NSD,decoder,input flush,Dialog Extractor} each "%llu us"; "Resetting (%s). Mode: %s"; "Fell behind by %ums while resetting. Input delay %ums - read size %ums. Flush."; "Delay capped at stream size"; "detectNoiseAndSilence: status=%s"; "Stream %s underflow"; "Hardware no longer providing invalid signal"/"Invalid signal provided by hardware"; "TV input sample rate mismatch with audio tap (tv:%u tap:%u)"; autoplay <AutoPlay><Mode>%s</Mode><SilentSeconds>%u</SilentSeconds></AutoPlay>; "tvprocessor states previous:%s current:%s"

- **name:** TV processor (SPDIF/TOSLink decode pipeline)
- **chaos_params:** fault injection {stream_underflow("Inducing stream underflow"/"Inducing %ums processing stall to trigger underflow"/"Invalid stall time. Valid range is 0-1000"),stream_error,signal_lost,rate_change,signal_discontinuity,decoder_error,sync_tap_playback,latency_change("Simulating latency change"),out_loud("HT swap out loud override %s"),set_timeout("Setting report timeout to %d secs"),perf2("Setting perf2 to %s")}; "Synchronize SPDIF tap playback with output tap (%s)"
<details><summary>Evidence (1)</summary>

- @ 0x10f25c3c — tv processor block

</details>

## `upgrade`

**coverage** `?`

The firmware upgrade path: manifest fetch (`/firmware/swgen/{gen}/latest/`), SWGen compat checks, download status handling, and the apply/reboot flow. Version gating uses MinCompatVersion from ZGS.

- **check_layer:** update-check client: "Fetching %s"/"Failure fetching (0x%x) (%d)"; fields {updateServerIP,httpResult,updateAutoCheckError,useCachedOnly,updateType}; headers X-Sonos-LatestSWGen: %u + Content-Location: %s; "Redirect detected, final URI: %s"; "UPM Invalid"; "Check for updates %s (%u)"/"Check for online update (user)"/"Unknown upgrade server state"; R_AvailableSoftwareUpdate sysprop; SWGen downgrade policy {downgradeMinVersion,downgradeRestrictions,allowDowngradeToPrevSWGen,denyDowngradeToPrevSwGenList}; "Invalid swgen member detected, swgen: 1"
## `upnp_eventing`

**coverage** `?`

GENA eventing: SUBSCRIBE/RENEW/UNSUBSCRIBE with logical SIDs — the push channel UPnP controllers use for LastChange updates.

- **renew_fsm:** events {"Unsubscribe in renew ... (oos:%d seq:%d)","Successfully renewed","Failed to renew ... HTTP Result: %d; SR: %08x","Subscribe ... Port: %u; Secure Eventing: %d (srRet=%d)","Successfully subscribed ... UDN %s","Received SID %s for deleted client","Received OOS %u / %u for SID %s" (out-of-seq tracking),"Not unsubscribing because bSendUnsubscribeRequest=false"}; /status/subrenew schema <Outgoing>{<LogicalSID>,<UPnPSID>,<EventURI>,<FailureCount>,<NextRenew>,<ExpectedSeq>}; secure-eventing flag on subscribe; thread subrenew_static
- **gates:** "Invalid transport: WSS is required"; "Invalid namespace: UPnP {subscribe,renew,unsubscribe} not supported"; "unexpected target id %d %s; overriding to: %s"; "Unable to retrieve the relative time."; "Rejecting unsupported replication request for %s"; "UPnP Eventing denied. 403 Forbidden returned."; Second-/%u SID form; sourceHasEventsToSend(%s) initial
- **tunneled:** tunneled UPnP "Tunneled UPnP call: %s:%s returned %d to %s:%d"/"returned 200"/"from %s:%d" + TRANSFER-ENCODING + "set LOBS = %d"; CM actions {ConnectionIDs,GetProtocolInfo,GetCurrentConnectionInfo,RcsID,AVTransportID,PeerConnectionManager,PeerConnectionID}; MS actions {ListAvailableServices,GetSessionId,ServiceId,Username,SessionId}
- **event_routes:** Complete /X/Event route inventory (0x10e761b0-0x10e7636c): /AlarmClock/Event, /AudioIn/Event, /DeviceProperties/Event, /GroupManagement/Event, /HTControl/Event, /MusicServices/Event, /SystemProperties/Event, /ZoneGroupTopology/Event, /MediaServer/ConnectionManager/Event, /MediaServer/ContentDirectory/Event, /MediaRenderer/ConnectionManager/Event, /MediaRenderer/RenderingControl/Event, /MediaRenderer/AVTransport/Event, /MediaRenderer/GroupRenderingControl/Event, /MediaRenderer/Queue/Event, /MediaRenderer/VirtualLineIn/Event -- 16 endpoints; QPlay has Control only (see qplay_protocol). Cloud mirror: every service exposes muse subscribe on v1/players/{playerId}/upnp<Svc>/subscription and renew/unsubscribe on .../subscription/{logicalSID}.
## `virtual_linein`

**coverage** `?`

The VirtualLineIn (VLI) service: a virtual audio source that can be injected into a group — AirPlay, Bluetooth, Spotify Connect, and external sources all materialize as VLI sessions with `x-sonos-vli:` URIs, delegation guards, and evented state.

- **source_manager:** group hooks {\[groupAdded\] configureLocalTransport(VLI),\[groupRemoved\] configureLocalTransport(null),\[startLocalPBAsGM\]/\[stopLocalPBAsGM\] + proxyactive}; source lifecycle {register(vli type),suspend,resume,onSelect,deactivate(type,sender)}; "Recording State Snapshot in state %d"; "Starting vli audio input subsystem (type=%d)"/"ending vli ai subsystem (cached type=%d; new=%d)"; cookie validation {"validate cookie failed for \[%d\], \[%d\]","no source to validate cookie"}; ai_vli thread
## `vli`

**coverage** `?`

The VLI umbrella: source manager, sink, playback tracker, and control interface. A VLI session is how a 'non-Sonos' audio source rides the group-audio fabric — it gets a session id, a transport URI, and member routing like a real line-in.

- **sink:** vlintxsink "VLI NodeTX Blocks": "lTransmitOffBox is now %d \[uni=%c\]"; "NodeTx configured to handle %s audio (qos: %d)"; "delay sending new frames until resend finishes"
- **ctrl:**
  - **callbacks:** `onVirtualLineInGetVolume`, `onVirtualLineInSessionStartInfoUpdated`, `onVirtualLineInStartSession`, `onVirtualLineInStopSession`, `onVirtualLineInSuspendSession`, `onPlaybackStateChanged`, `processSetVolume`, `onVirtualLineInNameChanged`, `onVirtualLineInMetaDataChanged`, `onVirtualLineInPlayModesChanged`
  - **events:** `VolumeSetActionEvent`, `VliVolumeProcessingCompleteEvent{vliType,success,flags}`, `VliSessionProcessingCompleteEvent{vliType,action,success,flags}`, `VliTransportAction`, `AvtHaltActionEvent`, `AvtVliActionEvent`, `GroupVolumeSetActionEvent`, `VolumeChangedEvent(vli source)`, `VliPropertiesChangedEvent{name,md,mode}`
  - **types:** `AirPlay`, `bluetooth/Bluetooth`, `tvproxy/TV Proxy`
  - **details:** cookie-based session tracking; waitOnTxBitFlagsClearedLocked; "StartSession for unusable/unknown type"; protocolInfo="x-sonos-vli:*:audio:*"; "VLIGroupIDs cannot contain commas"; completion-signal timeouts
- **link:** "Link helper created with empty VLI group ID"; "Starting to Process %s Group Info"; "Found Suspended Rooms While Processing %s Group Info"; "Finished Processing %s Group Info in %llu us"; "Ignoring player %s (too many members)"; "Link player %s to %s group %s: (ret %d)"; URI x-sonos-vli:%s:%u,%s; sources {airplay:,bluetooth:}; 16-byte hex id fmt
## `vli_transport`

**coverage** `strong`

The VLI transport: the actual audio path a virtual line-in session uses once created — transport selection, buffering, and the seamless-handoff integration with chsnk.

**Technical description:**

setTransportToVLIStreamURI {URI,autoplay,become gc} + 'VLI type \[%u\] incompatible' + 'activating source with URI: %s, VliGroupID: %s' + 'StartTransmission (VLI) failed' + 'going to stopped / defer playing'; events {AV Transport URI cleared/changed,VliTransportActionEvent,VliSessionProcessingCompleteEvent}; remote line-in {'AI Stream URI: %s sourceUUID %s','set corr ctx for remote line-in: bootSeq %u gcUUID %s',ai_tracker,'StartTransmissionToGroup failed'}; rincon group {setTransportToRinconGroupURI,'Rejecting x-rincon URI: source or target is an ungroupable player','Node protocol version on %s is incompatible','Count of off box members for VLISrcMgr \[%u\] must be <= CHSRC \[%u\]! Aborting',localConfigureGroup}; X-Sonos-Api-Key header

- **name:** VLI transport/session
<details><summary>Evidence (1)</summary>

- @ 0x10eb08b0 — vli transport

</details>

## `wifi`

**coverage** `?`

The Wi-Fi subsystem: wireless modes (SonosNet mesh vs infrastructure vs wired), netmode enum, association tracking, power-save, and the settings keys that control them. `wifiDisable`/`meshDisable` in player settings are its knobs.

- **idle_mgr:** RZPWifiIdleMgr/idlemgr: "Device set to %08x with primary chan %d code 0x%x cnt %u retry %u"; Set WifiFuncsSetIdleScan fronthaul result; reasons {AUDIO_OUT,AUDIO_IN,LOCAL_SONOSNET,NO_SONOSNET_PEERS,NO_PRIMARY,UPGRADING,HT_SWAP,UNKNOWN_ID}; WiFiIdleScanUpdateRetry; "client %s is %s with primary chan %d"
- **assoc_tracker:** CrAssoc report "Reporting CrAssoc event for %s"; metrics {mstime1/2,msnum,arpscstime,arpatt,arpscs,arpsnum,ddtime1/2,ddnum,zstime1/2,zsnum,zntime1/2,znnum,znscs,znstate}; ARP stuffing "Stuffing %s MAC to ARP table" + "ARP stuffing records are full" for associating controller; "ZGT Notification to %s is invalid event"
- **netif_poll:** DeviceNetInterfaceStateEvent + "fire event: health %s rssi %d"/"status: health %s rssi %d"; subscribe/unsubscribe polling per %s; "timeout: %s polling"
## `wireless_modes`

**coverage** `strong`

The wireless-mode enum and transitions: which radio mode the device runs (disabled, client, SonosNet node...), with validation per model. `wirelessNetworkStatus` events reflect this state.

**Technical description:**

enum {SONOSNET_MODE,INVALID_MODE,ETHERNET_MODE,STATION_SATELLITE_MODE,SONOSNET_SATELLITE_STATION_PRIMARY_MODE,STATION_MODE}; <Wireless><WirelessInfo Name='Wireless Info'>{WifiMode(%d),WifiModeString,IdleState(0x%08x),BusyClients,SonosNetDisabled(%d),ConnectionType(%d),ConnectionTypeString}</WirelessInfo></Wireless>

- **name:** wireless mode enum + status XML
<details><summary>Evidence (1)</summary>

- @ 0x10f12a30 — wireless enum

</details>

## `zgs_mediaservers`

**coverage** `strong`

The `<MediaServers>` section of ZoneGroupState: external media-server proxies (`/msprox` URLs) plus the embedded SMAPI account table — each `<Service>` carries NumAccounts with per-account Nickname/SerialNum/Flags/Tier/Password fields. This is how account credentials reach every member without a separate lookup.

**Technical description:**

<MediaServers><Ex CURL="/msprox?uuid=…" EURL T EXT/><MediaServer Name UDN Location/><Service UDN NumAccounts Md%u Username%u Token%u Key%u/></MediaServers> — third-party media server proxies + SMAPI account creds embedded in ZGS; per-account {Nickname%u,SerialNum%u,Flags%u,Tier%u,Password%u}; AreasUpdateID+SourceAreasUpdateID; MS tracking {refreshing,"detected new",RINCON,"ignoring non-rincon MS %s","connect to MS %s %s",unauthorized}; media-player MS record "<MediaServer location uuid version canbedisplayed='%s' unavailable='%s' type='%u' ext='%s'>"; errors {empty id,invalid id count}

- **name:** ZoneGroupState MediaServers fragment
<details><summary>Evidence (1)</summary>

- @ 0x10e8c2a0 — ZGS MediaServers

</details>

## `zgt_schema`

**coverage** `strong`

The ZoneGroupState XML schema: `<ZoneGroups>` containing `<ZoneGroup>` per group with Coordinator and member `<ZonePlayer>` elements (UUID, ZoneName, Configuration, SoftwareVersion, SWGen, MinCompatVersion, HTSatChanMapSet and more), plus `<VanishedDevices>` and `<QuarantinedDevices>` with Reason/LastSeenUTC. This is the single document describing the entire household layout.

**Technical description:**

<ZoneGroupState><ZoneGroups><ZoneGroup Coordinator=" ID=">...</ZoneGroup></ZoneGroups><VanishedDevices>+<QuarantinedDevices><Device {UUID,Reason,ModelInfo,Mac,LastKnownIP,LastSeenUTC}/></ZoneGroupState>; ZonePlayer attrs {QuarantineReason,UUID,ZoneName,Icon,Configuration,Invisible=1,IsZoneBridge=1,SoftwareVersion,SWGen,MinCompatibleVersion,LegacyCompatibleVersion,ChannelMapSet,HTSatChanMapSet,ActiveZoneID,BootSeq,TVConfigurationError,HdmiCecAvailable,WirelessMode,ConnectionType,ChannelFreq,BehindWifiExtender,WifiEnabled,EthLink,Orientation,RoomCalibrationState,SecureRegState,VoiceConfigState,MicEnabled,HeadphoneSwapActive,AirPlayEnabled,VirtualLineInSource,IdleState,MoreInfo,SSLPort,HHSSLPort}; orphan groups ":orphan"; separate <ZonePlayers><ZonePlayer {group,prevgroup,virtuallineingroupid,htsat='true',wirelessmode,connectiontype,channelfreq}> listing

- **name:** ZoneGroupState event payload
<details><summary>Evidence (1)</summary>

- @ 0x10f12ea0 — zgt schema block

</details>

## `zone_topology`

**coverage** `?`

The ZoneGroupTopology service: ZoneGroupState XML (groups/coordinators/members/vanished/quarantined) plus evented updates — the household's shared map.

- **topology_base:**
  - **quarantine:** discovery quarantine {quarantinedCount,latestPlayerWithQuarantineEvent,stabilizationTime,latestDownloadErrorCode,latestDownloadErrorReason,quarantining}; "Report player missed by %s"/missedBy/missedPlayer; quarantineRecheck job; "Player %s removed from quarantine"
  - **wow:** satellite wake: "\[%s\] %s WoW magic packet for MAC %02X.."; "Attempted to wake %zu missing secondary ZP of primary %s (sent WoW to %zu)" — bonded secondary WoW
  - **vanish_fsm:** states {active→vanished} with {byebye reason,reasonforvanish,vanishbatterypercentage,vanishbatterytemperature,timesincevanish}; "Broadcasted unresponsive device %s"; "Received 'Remove' message pointing to local device"; "VerifyThenRemoveSystemwide: Not removing, %s is present"; removeknown/hwver actions; "device %s removed from vanished list after factory reset"
  - **discovery:** handleNewOrUpdatedZP "%s found %s at %s; age: %d; addr: %s; host: %s; proxy: %s; ports={%u-%u}"; IP-change detect "ZP (%s) changed IP address from %s to %s"; link-local 169.254 guards; "Updated network hash: \[%s\] => \[%s\]"; "new bootseq"; "%s ZP %s (bootseq %u)"; X-Sonos-LatestSWGen + Content-Location headers; "Faking device %s (%s) props to be %s gc"; designated {PlayerDesignatedDevice missing required field %s}; "All devices idle for %ld s"; topmon thread
  - **wake_machinery:** Vanished-member recovery: 'Attempting to wake vanished %sZPs' -> per-MAC WoW magic packets ('\[%s\] %s WoW magic packet for MAC "%02X..%02X"'; packet key literal 'WoW_=h2zWsWuCQ'), 'Attempted to wake %zu missing secondary ZP of primary %s (sent WoW to %zu)'; probes first ('arping successful for vanished device: %s'). Async task 'wakeMissingPlayers' is scheduled/cancellable ('scheduling request for async wake missing players type %d', 'reschedule wake missing players type %d time %ld', 'async wakeMissingPlayers ran'). WakeOnLANRequestEvent types incl. 'Unexpected WakeOnLANRequestEvent type'; exit transitions 'device: %s %s removed from vanished list' (wake or factory reset) and 'expire vanished devices has completed'.
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
- **events:** {TopologyEventsReportEvent,TopologyGroupMemberRemovedEvent,InfoUpdatedEvent,ActiveZonesChangedEvent,RemoteConnectionTypeChangedEvent,GroupChangedEvent,VliTransportActionEvent,NewZPEvent,ReplicatedSettingsNeedsUpdateEvent,MissingBondedZoneMemberDetectedEvent,AVTStateLastChangedEvent,RemoteHTSwapStateChangedEvent,DeviceGoneEvt,GroupAdvertiseRequestEvent,DesignatedDeviceChangedEvent,Account changed event,MusicAccountChangedEvent,NewMuseHHIDEvent,NewLocationIdEvent,AreasVersionChangedEvent}
- **internals:** sonar ops {setLocalSonarCalibrationID,setLocalSonarState,internalPopulateSonarZoneDescription,sonarZoneAgreesOnCalibration,informLocalNewSourceAreaIds,getGroupMembersWithDifferentVirtualLineInGroupID,getLocalOrientation,getLocalChannelName,hasSurrounds}; bonded ops {isBondedZoneConsistent,ifBondedZoneGetNextUUID,ifBondedZoneGetNextUUIDInTopology,ifBondedZoneGetPartnerUUIDInTopology}; informs {informLocalVoiceStateChange,informLocalMicStateChange,informLocalTVConfigStateChange,informLocalAirPlay,informLocalOrientation,setLocalTransportStateChanged,informLocalPlayerZPChange}; desc fmt {"Single Zone Description: {%s, %s, %d}","Zone Description: {%s, %s, %s, %d}"}; consistency {"HT & Sat have inconsistent maps","Bonded zone maps not consistent","topology state error, type: %s, pid: %s, pid count: %d, gid: %s, gid count: %d","Topology state not consistent\[retrying\]","%s %s linkage broken: Local gID: %s; Other gID: %s"}; satellite {"addSatellite() %s sat %s with map: %s","removeHTSatellite() Disable HT sat %s","separateBondedZoneKeepPlaying: failed to remove bonded zone through primary %d, removing locally","Enable HT","tried to add incompatible","couldn't determine AVT control URI of coordinator %s"}; monitor {monitorTimeout,monitorUUIDMismatch,"TopologyMonitorProbe - Invalid args","Probed wrong device (IP mismatch?)","Topology monitor: purge unresponsive ZP %s (%d)","STRIKE %u for %s (res:%d val:%d)"}; defunct {"handleDefunctMediaServer %s","handleDefunctZP %s reason '%s' IGNORED from MDNS - discovered by SSDP","IGNORED from SSDP - discovered by MDNS but not SSDP","%s uuid %s not local or was not found",PRESENT,MISSING}; notify {"handled notify of SID %s for %s on %s (changedMap: 0x%x)","checking notify of SID %s for %s (last handled: %u)","could not find zp to handle notify; ingress uuid %s","Setting orientation (%s) for %s (%s)"}; "Authorization Check for WMP failed: control URI: %s UUID: %s res: %hu"; "Unexpected local UUID provided to RDeviceTopology::%s"; "Became idle: %ld(B)"/"Became active"; {ThirdPartyMediaServersX,AlarmRunSequence,R_ShowRhapUPnP,R_ShowNSSServers,VerifyThenRemoveSystemwide,hh-upgrade,uploadDesignatedDeviceReport,RDeviceTopology}
