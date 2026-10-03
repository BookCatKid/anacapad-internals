# Partially decoded

## `ab_experiments`

**coverage** `partial`

Sonos can enroll a system in A/B experiments pushed from the cloud: feature tests where some households get a new behavior and others don't, with the player reporting which variant it ran. This block receives the experiment assignments from Sonos's servers, stores them locally, and applies the right code path, so two identical speakers can behave differently depending on which test group they landed in.

::: details Technical details

production A/B experiment framework: a /experiments local endpoint plus a replicated <ZoneExperiments> store of <ZoneExperiment id name value defaultValue> rows; presence gated by featureConfigZoneExperiment; values influence runtime policy

- binary anchors: `<ZoneExperiment`, `/experiments`, `experimentId`, `/experiments`, `<ZoneExperiment id="%llu" name="%s" value="%u" defaultValue="%u" />`, `featureConfigZoneExperiment`, `zoneExperiments`

- **schema:** <ZoneExperiments><ZoneExperiment id="%llu" name="%s" value="%u" defaultValue="%u" /></ZoneExperiments>: numeric value vs defaultValue, keyed by 64-bit id and name
- **keys:** featureConfigZoneExperiment, zoneExperiments, experimentId, experiment
- **fetch_pipeline:** RFeatureConfigManager/FeatureConfigManager (featureconfig.cxx region): fetches '/features/v1/config?' with query params {swVersion,hwVersion} over HTTPS with 'cache-control: no-cache'. Cache precedence: cloudconfig_override.json > cloudconfig.json (cloud-cached) > cloud-persisted: 'Using override config' / 'Using %s cloud-cached config' / 'Using cloud-persisted config'. Lifecycle: 'stale' marker, 'Already have fresh data. Skipping Fetch.', 'failed to fetch config: not securely registered', connect failure -> 'rescheduling in 1 hour'. Parse failure paths for each tier ('Error parsing feature config' / 'Error parsing cached config').
- **assignment_model:** NO on-device bucketing exists: the device sends only {swVersion,hwVersion} and receives per-experiment {id(%llu),name,value(%u),defaultValue(%u)} rows: cohort assignment happens entirely in the cloud config service; the device applies value-vs-defaultValue. The 'number of labels not equal to number of buckets' string is third-party (libbpf/perf), unrelated.
::: details Evidence (4)

- @ 0x10ef3d0d; <ZoneExperiment
- @ 0x10e75d30; /experiments
- @ 0x10f9c96c; experimentId
- @ 0x10ef3d34; <ZoneExperiment id name value defaultValue> element schema

:::


:::

## `abr_engine`

**coverage** `partial`

The adaptive-bitrate engine: the logic that keeps internet streams alive when your connection is shaky. It picks which stream quality to fetch, watches how well downloads keep up, and switches quality up or down to avoid dropouts. When a radio station stutters on bad wifi and then recovers, this is the machinery making that judgment call.

::: details Technical details

DS (data-source) selection FSM {"Unable to select another DS","waiting to fetch new playlist","fetching new playlist now"}; playlist failures {"Timed out looking for playlist","no time to recover (%ld buffer)","Too many empty playlists and no audio left/(still %ldms ahead)","Switching source due to empty playlists"}; notifyFrame ty:%d ln:%zu so:%zu ns:%zu f:%u ctx:%u:%u:%llu; getContentKey; fetch "open: %s (0x%x) %d len %llu offset %llu"/"redirect: %s -> %s"/"Segment's content type"/"Using file ext."; "URIs for %g seconds, wake up in %d"; "prebuffering %u bytes within %ld msec"; "start new stream for URI \[%s\], resumeLoc %zu time offset"; "Reset ABR state: start bitrate %u"/"Last estimated bitrate %u"; rate model "rate: SR=%.03lf (%zu) S=%d Sth=%d BL=%.0lf" + "rate(%7d): %.2lf/%.2lf SA=%.2lf b=%u/%u B=%u/%u/%u h=%d/%d r=%.2lf a=%.2lf" + happy metrics {"happy (a > %.2lf)","happy (saturated)","rate update: a=1","was happy","unhappy",Underruns}; InitFramerForTrackList-fail source switch; codec mp4a.40.*; URI version regex /v\[0-9\]+\.\[0-9\]+(\.\[0-9\]+)?(-\[a-zA-Z\]+)?(\+\[a-zA-Z.\]+)?(\[?#/\]|$)

- **name:** ABR: adaptive bitrate + stream fetcher
- **status_schemas:**
  - **abr:** <ABRState Name="ABR State"><NodeTXBuffer>%.3lf sec %s</NodeTXBuffer><ProcessRate>%.0lf bps</ProcessRate><Happy>%u / %u</Happy></ABRState>
  - **events:** <ABREvents numEvents><EventEntry ts br sa a r flags="%u\|%u\|%u\|%u" happy/>
::: details Evidence (1)

- @ 0x10ed3964; abr/fetcher block

:::


:::

## `account_cert_lifecycle`

**coverage** `partial`

Every player carries a device certificate, a cryptographic identity card issued by Sonos that proves to the cloud 'this is a genuine Sonos device'. This block manages that certificate's whole lifecycle: requesting it, storing it, and renewing it before expiry. Without it, cloud features can't authenticate the box at all.

::: details Technical details

three cert managers (certmanager/devicecertmanager/regdevicecert) over four keycert identities; the registration cert carries the device's SonosID and is required for token generation ('sr: reg cert not available; cannot generate token'); a /regcert status endpoint exposes DeviceCertInfo XML; root-of-trust bundles are fetched from /certbundles/v4/trusted_roots.rcb with ETag caching and retry backoff; signer internals (chlog.cxx): 'sr: header encoder not valid or no data was encoded','sr: payload encoder not valid or no data was encoded','sr: signature generation failed','sr: signature base64 encode failed','sr: trusted time not available; cannot generate token': signing requires trusted time; nearby state names APS_NOT_VALID/AHA_NOT_VALID; sr: token cache (tokencache/token_cache): 'sr: token length too long','sr: could not generate token','invalid token type requested %d; key %s','found a record for key %s','token for key %s found','record for key %s does not match type: requested %d available %d','token for key %s generated'

- binary anchors: `devicecertmanager.cxx`, `regdevicecert.cxx`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE`, `X-Sonos-DeviceCert`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE`, `DeviceCertRevoked`

- **devicecertinfo_schema:** <DeviceCertInfo><CertName> <Denylisted> <ExpiresIn> <JobAllowed> <JobForceAllowed> <JobScheduled> <JobLastRun> <ETag> <HouseholdID> <SonosID> <IDType>(urn:sonos:idtype) <Cert> <HaveCert> <CertSerial>(%.64s) <ExpiresUtc>(YYYY-MM-DD HH:MM:SS) </DeviceCertInfo>: served at /regcert
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
- **account_keys:** Credential key formats: 'SA_RINCON%u_' / 'SA_RINCON%u_%s' account keys, per-service 'X_#Svc%u-%x-Token' and 'X_#Svc%u-%x-Key' (service-id + serial-number hex). modifyRecord validation: 'failed to upgrade guest account (sn=%u)', 'Ignoring modifyRecord (SN=%u) from %s. New entry has inconsistent Type %u, OADevID %s, or ID %s' -> 'corruptModifyRecord'; change fields newAccountID/oldAccountID/newAccountType/oldAccountType/newAccountOADevID/oldAccountOADevID. Lookup: 'findRecord(%u,%s,%d) returning oldest %s'/'could not find any accounts' and 'findRecord(%u,%u,%d)': oldest-match fallback.
::: details Evidence (9)

- @ 0x10ef220e; devicecertmanager.cxx
- @ 0x10efc8e6; regdevicecert.cxx
- @ 0x10eef0d1; R_CLIENT_KEYCERT_ID_SONOS_DEVICE
- @ 0x10eef100; curl R_CLIENT_KEYCERT_ID_SONOS_DEVICE selection
- @ 0x10ec1f20; X-Sonos-DeviceCert: header
- @ 0x10f0ea6c; DeviceCertRequired/Invalid/Expired/Revoked states
- @ 0x10ef1fbc; full <DeviceCertInfo> XML schema (14 fields)
- @ 0x10eeb82c; /certbundles/v4/trusted_roots.rcb + ETag flow
- @ 0x10f043a4; reg cert required for token generation

:::


:::

## `account_migration`

**coverage** `partial`

When account formats change between firmware versions, existing saved logins have to be converted. This block migrates stored service accounts from older formats to newer ones during updates, so your services stay logged in across an upgrade.

::: details Technical details

OAuthMigration flow {reauth,token generation,getAuthTokenResult,accountToOAuthResult}: "migrated account to OAuth, type:%u, sn: %u" + retry {res,retry count,"delay migration until cloud connection","expected ouath account; reset to retry migration"}; "failed to replace email with username for last.fm"; sonos-radio gate {"no SBiz entitlement; preinstalling Sonos Radio","found SBiz entitlement; blocking preinstall"} + "stale entitlements; scheduling job to refresh"; preinstall SID=%u attempts; SA_RINCON65031_ service-account prefix; settings {R_HideTuneIn,R_MigratedTuneIn}; maintenance {"failed to download manifest file for account sid/sn","received empty hash","failed to update userInfo and clean up user hash","Failed to getUserInfo during SvcMaintenance","failed to migrate built-in accounts","failed to migrate pre cloud replication accounts"}

- **name:** zpserviceaccounts: OAuth migration + preinstall
::: details Evidence (1)

- @ 0x10e9b28c; zpserviceaccounts block

:::


:::

## `addrmon`

**coverage** `partial`

The address monitor: it watches the player's own network addresses and notifies the rest of the system when they change. If your router hands the speaker a new IP, or a network interface flaps, this is the component that notices first and tells the discovery, streaming, and web layers to re-announce or rebind. Without it, the speaker would keep advertising an address it no longer owns.

::: details Technical details

RTM_NEWLINK/RTM_GETLINK via netlink; {"read error %d %s","incorrect type","unexpected message %X"}; select events selthrd.RIfAddressMonitor.{reset,data,except,timeout}

- **name:** netlink interface-address monitor
::: details Evidence (1)

- @ 0x10ee69ac; addrmon

:::


:::

## `aha_ops`

**coverage** `partial`

Operations for a legacy partner integration called 'aha': present in the shared codebase as part of the service-integration layer, where Sonos keeps the machinery for services that were supported on some products or generations.

::: details Technical details

ops {AHA_STOP,AHA_RESTORE,AHA_END_VLI_SESSION,AHA_SUSPEND_VLI_SESSION,AHA_PAUSE_VLI_SESSION}; "failed to gen group byebye headers" + groupAdvertise_; RChannelLogger; "%d seconds on account %d/%u"; "Recorded sync error on account %u/%u"; sources {"Source set to %d - %s",Compressed Line-In,Uncompressed Line-In,Compressed Dock,Uncompressed Dock,Coordinator Local Library}

- **name:** AHA ops + group advertise
::: details Evidence (1)

- @ 0x10f03fec; aha block

:::


:::

## `arp_assoc`

**coverage** `partial`

Watches the low-level network association table, tracking which devices are reachable on the local network segment. It feeds the connectivity diagnostics that answer 'can this speaker see the others', complementing the higher-level discovery machinery with raw link-level evidence.

::: details Technical details

arpchecker "ARP failure: %d consecutive attempts for %s failed: groupcast problem suspected" + "ARP to %s resolved after %d failures" + source_ip/msreplyfailure; arping {async,sync} "started for %s, every %u ms for %u ms" + reset-on-data + timeout adjust + "pending reset in progress" guard; assoctracker CrAssoc metrics {mstime1,mstime2,msnum,arpscstime,arpatt,arpscs,arpsnum,ddtime1,ddtime2,ddnum} + "Skip reporting invalid CrAssoc event"; async arping 'cannot start async arping for %s, pending reset in progress','async arping started for %s, every %u ms for %u ms'/'sync arping started for %s, every %u ms for %u ms','timeout, new timeout %d s, %d us','got data, needs reset: %d, new timeout %d s, %d us'

- **name:** arpchecker+arping+assoctracker: L2 connectivity
::: details Evidence (1)

- @ 0x10eefee8; arp/assoc blocks

:::


:::

## `audio_clip`

**coverage** `partial`

The short-sound player: machinery for playing brief audio clips over the system, such as chimes, doorbell sounds, and prompts. It's distinct from the main music pipeline because these sounds can overlay what's playing rather than replacing it.

::: details Technical details

muse routes players/%s/audioClip + groups/%s/playback/%s + "forward to %s"; clip object type audioClip; fields {priority,clipType,clipLEDBehavior,clipBehavior,buzzers}; buzzer clips file://%s/buzzers/%d.mp3 + %u:%c; custom requires streamUrl "Missing streamUrl (required for custom clip type)"; httpAuthorization → "Secure streamUrl required when providing httpAuthorization"; delivery {Using AVT,Using External Audio Source}; priority "Cannot interrupt current clip due to priority policies"; pause content first "Failed to pause content because group info could not be retrieved for UUID=%s, ZoneGroupID=%s"; errors {Invalid clip type,Invalid clip id,Clip id not found,Error starting audio clip,failed getting audio clip response,"unexpected object type %s, expecting audioClip"}; resume content after

- **name:** AudioClipManager: doorbell/alert clips
::: details Evidence (1)

- @ 0x10edf87c; audioclip block

:::


:::

## `audio_decoder`

**coverage** `partial`

The audio decoding layer: the component that turns compressed audio data into raw sound samples ready for the amplifier. Every format the player accepts (MP3, FLAC, AAC, and friends) flows through here, and it picks the right decoder for the stream at hand and manages the decode loop.

::: details Technical details

status <SampleRate><SampleBitDepth><NumChannels><ChannelMap><FrameSize>; lifecycle {decoder create/init,header,seek tvResume=%ld.%ld,"seeking to absolute position = (%llu / %llu)","capping aboslute seek position",scan,get pos}; errors {decode err skip/pos/flush/set pos,too many errors,no progress(eof,o),open failed,streaming hint failed,read out of accum space,read eof,reached expected eof pos,seek failed,len failed}; unsupported {too many samples,channels,bit depth}; REPLAYGAIN_TRACK_GAIN= + gain=%f; ogg errors {seek,bailed out,no mem,no init}; ffmpeg/WMA: wmaSeekPacket offset bound; AVFormatContext alloc/open; stream-info/audio-stream find; resume loc byte→time fallback "Resume location %zu exceeds file size %zu, falling back to time-based seek"; "Seeking to position %zu"/"Seeking to time: %lld microseconds"; "Stream duration: %zu milliseconds"/"File size: %zu bytes"/"Estimated offset %zu exceeds file size"; attached-picture extract image/jpeg; libavformat metadata album_artist; codec ctx {not found id,alloc,params,open,pAVPacket/pAVFrame}; frames {send/recv errors,send result status eof}; payload bounds {Extradata too large,Codec params size,Packet size too large,Codec params too large for cache,Packet too large for cached payload}; "no client, ptvResume, fileURI, or uri opener provided, we won't continue"

- **name:** generic audio decoder + ffmpeg WMA path
- **ogg_vorbis:** nullaudio "starting null audio play"+"dropping %zu bytes"; gapless ogg "we have gapless ogg, %d samples, %zu frame size"/"gapless requested %d samples > decoded frame size"; bounds {oob num samples > max vorbis packet}; states {ogg eof,ogg only header byte found,ogg hard stop requested}
::: details Evidence (1)

- @ 0x10edde80; decoder blocks

:::


:::

## `audio_decoders`

**coverage** `partial`

The collection of specific decoder modules plugged into the decoding layer: the individual format handlers for MP3, FLAC, the AAC family, and friends, which the player picks between per stream.

::: details Technical details

vorbis errors {vorbis_synthesis_pcmout produced null PCM data,failed to initialize vorbis given config data,neither config nor music data,no samples produced,insufficient bytes,decoding failed,vorbis_synthesis_read failed}; status XML <SampleRate><FrameSize><NumChannels><ChanMap>%s (%s)</ChanMap>; AAC: "DisableAacPlus StreamType=%d, aacPlusUpsamplingFactor=%d", errors {can't initialize decoder library,Unable to decode init frame,unknown AAC format,Invalid sample rate idx,Frame Paddling Len = %d numChannels = %d sampleRateIx %d obj %d,Explicitly expressed samplerate not supported,Failed to get the extension sampling freq idx}; XML {DEC_AACDecoder,DEC_InputChanCount,DEC_OutputChanCount,DEC_BitRate,DEC_FrameSize,DEC_AudioObjectType}; AOT enum {AAC-LC,HE-AAC,ER-AAC-LC,ER-AAC-SCAL - Decoding base layer only,ER-BSAC,ER-AAC-LD,HE-AAC v2,ER_AAC_ELD,xHE-AAC}; Ogg seek/resume: 'Detected Ogg seek page (extra header sent by Spotify)','Found location in seek header: ptvResume=%ld.%06ld, pos=%zu','seek tvResume=%ld.%06ld','pos=%zu, resumeLoc=%zu','Found resumeLoc %zu on current packet'/'on previous packet','seek to %d seconds in %s failed after %u probes','processHeaders failed on (re)open \[resumeLoc=%zu, seek=%d, st=0x%X\]'/'succeeded'; page/page-end states 'Finished processing the last ogg page, end of stream','Last page, processed segment %zu of %zu','end of ogg stream (last page)'/'(no more packets)','Detected Ogg headers','Processing ogg headers','Found Ogg headers in stream','Failed processing instream Ogg headers','Unexpected ogg headers','Resetting stored ogg headers','notifyFrame(Headers) buffering error'/'notifyFrame(Audio) buffering error','unsupported frequency and channel combination - sr:%lu numChans:%d','rate:%lu numChans:%d','first: %02x (%zu bytes)','vorbis_packet_blocksize returned %ld (%zu)'; Vorbis comments parsed: MEDIAJUKEBOX:ALBUM ARTIST=, METADATA_BLOCK_PICTURE=; file-decoder error-recovery ladder: per-stage failures {position failed,flush failed,start position failed (to=%d),scan failed,get pos failed,'decoder %s','no progress (eof=%d o=%zu)'} + decode-err recovery {'decode err skip failed','decode err pos failed','decode err flush failed','decode err set pos failed (to=%d o=%zu)'}; unsupported-file guards {'unsupported file (too many samples: %u > %u)','unsupported file (%u channels)','unsupported file (%u-bit)'}; audio_stream_local/dsp: 'setPlaybackStreamSampleType to %s', volume bookkeeping 'changed m_extSrcVolumeMusic from %f dB to %f dB, v:%u'/'changed volume from %f dB to %f dB, sv:%u uv: %u'; WAV guards 'failed parsing header (st=%u, fp=%u)','buffer length 0, no data available','Attempted to divide by 0 - found lDataLen: (%u) wNumChannels: (%u) wBitsPerSample: (%u)','%u bit, %u Hz'; mp3 'Failed to allocate mp3 implementation!'; FLAC cuesheet limits 'MIME type string must contain only printable ASCII characters (0x20-0x7e)','description string must be valid UTF-8'

- **name:** audio decoder layer (vorbis/AAC)
- **detail:** ogg/vorbis {nullaudio "starting null audio play"+"dropping %zu bytes","oob, num samples larger than max vorbis packet size","we have gapless ogg, %d samples, %zu frame size","gapless requested %d samples > decoded frame size","ogg eof","ogg only header byte found","ogg hard stop requested"}; SBC {"Invalid packet header","params: freq=%u blks=%u sb=%u mode=%u alloc=%u bitpool=%u end=%u fin=%zu fout=%zu frames=%zu","Truncated packet. Lost %zu of %zu frames","frame size changed %zu->%zu","decoder error %zd on frame %zu","Bad SBC frame %zu. read %zd/%zd, decoded %zu/%zu","unexpected NOTIFYFRAME_ERR_BUFFERING","unknown frame status %d"}; WMA {"oob, num samples larger than max wma packet size (%zu * %zu == %zu) > %zu","wma player end of file","notify frame stop/do not decode","skipping wma frame","wma decoder error, resetting/no reset/hard stopping","number of channels encoded %d, will not decode > stereo"}; ALAC {"alac decoder status: %d","producing zeros only","alac out-of-bounds read prevented","error initializing ALAC","created alac for %u-bit samples, %d sample freq, %d-channel","unexpected sample bit depth: %u"}
- **adts_aiff_framer:** ADTS framer (domain suffix formats '%sadts-?'/'%sadts-%s'): sync scan 'found sync'/'skipped %zu', 'unexpected layer %d', 'incomplete header r:%zu'/'(missing CRC r:%zu)', 'unsupported sampling frequency %u', 'unexpected change of format: prev %d', 'Number of audio channels is too high: %u', 'buffer size too small, need %zu bytes', 'incomplete audio data r:%zu l:%zu', 'At Offset:%zu want:%zu dropping frame', 'buffering error, goto cleanup'. AIFF checks: 'exceeded max AIFF audio channels (%d) found %d channels', 'less than min AIFF audio channels (%d) found %d channels', 'File bit-depth unsupported. Found %d', emitted labels '%u-channels'/'%u-bit'. Audiotap record framing: 'j,%zu:%s' tagged-length records and 'i0'-prefixed integer fields on the audiotap.poll stream.
::: details Evidence (1)

- @ 0x10f1a010; decoder block

:::


:::

## `audio_fifo`

**coverage** `partial`

The audio buffer: the queue of decoded sound samples sitting between decoding and output. It absorbs timing jitter so playback stays smooth when a fetch stalls or the decoder hiccups. How deep and well-managed this buffer is determines whether a flaky network means a gap in the music or nothing noticeable at all.

::: details Technical details

records with {pos,range}; writes {"Advance write to next record","Rejecting write, as provided offset %zu != %zu (pending)","not enough fifo records","truncated write","Audio fifo records reset"}; discontinuity {"Discontinuity @ offset %zu in record %zu (expecting: %zu)","*** Too many discontinuities"}; reads {"Consumed contiguous samples (%zu - %zu)","Advance read to next contiguous record","Read %zu bytes from record","No bytes to read from fifo... EOF","audio fifo read at boundary eof","consumed exactly to the eof marker","reached logical boundary","already has pending offset"}; prebuffer {"prebuffering... (used/prebuffer)","Waited %ums for audio from the eSDK","Finished prebuffering in %u ms (st,flush)","prebuffering elapsed %u ms (used/free)","exit waiting for audio, not rendering"}: Spotify eSDK feed

- **name:** audiofifo: record-based circular audio buffer (eSDK)
::: details Evidence (1)

- @ 0x10ef04f0; audio_fifo block

:::


:::

## `audio_rate_ctrl`

**coverage** `partial`

The audio rate controller: it keeps the player's playback clock disciplined against the incoming audio so buffers neither starve nor overflow. It's part of why multi-room audio works at all, because every speaker's clock drifts differently and this machinery continuously corrects so rooms stay in step.

::: details Technical details

ARC: setCoefficients StdQ ASRC; guards {adjust rate of 0,unsupported channels,Unsupported Input Audio/Line Rate,Over Excursion error,sample rate converter error read}; reconfig on rate/channel-count/line-rate change; timesync: databurst LockTime, "Rate Maxed"/"Rate Inv Maxed" rails m_dOverallRate/m_dIntegratedRate, iter dump {LE,LEP,IC,ICP,IL,RT,err,errf,dOut,dIn,AP,RL}; "time went back; try again"; "Thread descheduled for %uus. Limit %uus"; SRC mute on |drift| "(Should) Mute SRC. dAbsoluteError = %f, current canonical rate = %u"; "Out of bounds. drift: %f mute count: %d"

- **name:** Audio Rate Controller (ASRC) + timesync drift
::: details Evidence (1)

- @ 0x10f2b610; arc/timesync block

:::


:::

## `audio_stream_mixer`

**coverage** `partial`

Mixes multiple audio streams: the component that lets overlay sounds like alerts, chimes, and calibration tones blend into whatever's playing rather than fighting for the output.

::: details Technical details

stream ops {start buffering,set presentation time,resync,drain flag,skipAhead} + stats "E:%d, D:%d, B:%d, PR:%d"; fade engine "fade added: %i.%i sample_len(%u) current_gain target_gain rate" + max/min/fade complete + "no fade slots available"; skipAhead "delta:%u > buffered:%u"; "discontinuity detected after scheduled resync"; mixer: bManageOutputLatency,startup buffers,buffers; fd poll sound.fd.poll.%04X; stall detect "loop(wall): %uus loop(cpu): %uus, sel: %uus"; states MTS_PLAYING transition; DSP drain FSM {"start dsp flushing %i buffers","dsp flushing ended %i frames early","driver draining","dsp flushing complete with od %u"}; stream names as-{dspin,dspout}{-tv,-ext-voice,-ext-chirp}/as-src{in,out}-ext-voice/%s-chsnk%zu; system/audio_out_disable + "Running with audio output disabled"; forcePerfectInitialSync; "KERNEL_PRINTK_ENABLE ... mixer scheduling can't be guaranteed"; "Testpoint delay of %ums"; stream FSM trace 'mixer stream state changing, from: %s to %s','event for stream %zu (%s) was fired, state: %s, resetting','playing overlap = %d usec','Possible mixer thread stall, loop(wall): %uus loop(cpu): %uus, sel: %uus','delaying mixer by %ums','audio output %s by testpoint'; external-voice stream names as-dspin-ext-voice, as-dspout-ext-voice, as-srcin-ext-voice, as-srcout-ext-voice; persistent-EQ 'Found and applying persistent EQ xml file'/'Error parsing persistent EQ xml file'/'No DSP Systems to Parse'; audio_stream_local.cxx: corked reads 'first corked read diff %d | opt %d.%06d npt %d.%06d','corked read has masker fade out samples left, insert masker before consuming first frame','dropping %d usec \[%zu\] of stream data \[%zu\]','initial samples dropped: %zu (%zu usec)','reset audio stream src','src output would exceed available space: %d','src output buffer overflow','sample rate converter error (read %d)'; audio_stream_dsp.cxx: 'setting subwoofer active to %s','changed bFixedOutputEnabled to %d','set streamSampleType to %s'/'setPlaybackStreamSampleType','set volume to %f dB','Zone %d changed playback volume from %f dB to %f dB, sv: %u','changed m_playbackStreamSampleType from %s to %s','changed m_extSrcVolume from %f dB to %f dB, v:%u'/'m_extSrcVolumeMusic'; mixer thread RPmixthrd; buffer checks 'this DSP implementation requires %d buffers but maximum is %d','Error: block size %zu cannot exceed DSP block size max %d'; 'sound device hardware adjustment %u samples, %u usec'; connect guards 'Failed to connect nullptr audio stream','Failed to connect audio stream %s with invalid ID %s'

- **name:** audio_stream + mixing_threaded: per-stream mixer
::: details Evidence (1)

- @ 0x10f29ab7; audio_stream/mixing blocks

:::


:::

## `audio_tap`

**coverage** `partial`

A single audio tap: a capture point inside the audio path where the firmware can siphon off sound. Calibration and diagnostics features attach here to hear what the player is actually emitting rather than trusting what it was told to play.

::: details Technical details

errors {no tap specified,syntax error,invalid request,permission denied} + audio/wav; mic gate "allowed %d mic %d"; taps {linein,codecout,irdecoder,mixersat,mixergm,as-srcin-chsnk0,as-srcout-chsnk0,mixerstats,dspout,formatter,llaout,mixerout,mzdsp,extvoice,extchirp}; spdiftap.compressed + "Internal SPDIF Tap Snapshotted. Tap must be uncompressed before use!"; sonos-dspid header

- **name:** AudioTap: debug tap points
- **manager:** audiotap_manager + trueplay_manager; "number of max taps exceeds the avaialable capacity"; "Active Tap %s"/"Closing Tap %s"/"No Active Taps to check if already tapped"; guards {"Location is not tappable","Location is already being tapped","Max number of blocks already being tapped"}; vars {channelname,vartype,VAR_FLOAT,VAR_STRING,VAR_INT} fmt %.04f; "number of device channels exceed TRUEPLAY_MAX_DEVICE_CHMAP_SIZE"; "unknown channel type"; sonarEQ.xml + "found legacy tuning"; status "<b>--------Trueplay-------</b>" + "Minimum Trueplay version" + {Small,Large} classes
::: details Evidence (1)

- @ 0x10e73cb8; audiotap block

:::


:::

## `audio_taps`

**coverage** `partial`

The family of audio capture points: places in the audio pipeline where sound can be tapped for measurement. Room tuning, the Trueplay-style calibration, and diagnostics that need to hear what the player is actually emitting all use them.

::: details Technical details

PCM-capture tap subsystem (audiotap_manager.cxx + datatap.cxx): guarded /audio_tap /spdiftap /snapshotspdiftap /downloadspdiftap endpoints, versioned tap-file format with audio+metadata sections, SPDIF tap used to sync TV-input playback against the output tap; tap instances are typed rolling_data_tap objects; 'Datatap snapshot failed after %zu' + 'Error: failed to read metadata from buffer!'; datatap carries a format-version tag 'simple:v1' beside the rolling_data_tap type; empty <SPDIFTap></SPDIFTap> emitted when no tap attached

- binary anchors: `audiotap_manager.cxx`, `spdiftap.c`, `/downloadspdiftap`, `/snapshotspdiftap`, `audiotap.spdif`, `<SPDIFTap>`

- **endpoints:** /audio_tap, /spdiftap, /snapshotspdiftap, /downloadspdiftap; request errors 'AudioTap: no tap specified', 'syntax error', 'invalid request', 'permission denied'
- **file_format:** tap files carry metadata+audio sections with a metadata version: 'Audio tap metadata version mismatch (tap: %d, expected: %d)', truncation checks ('last %zu audio bytes missing', 'last %zu metadata bytes missing'), 'Audio tap file valid (%zu/%zu)', rewind/start markers; snapshot file audiotap.spdif; compressed state 'spdiftap.compressed': 'Internal SPDIF Tap Snapshotted. Tap must be uncompressed before use!'
- **tv_sync:** 'Synchronize SPDIF tap playback with output tap (%s)', 'TV input sample rate mismatch with audio tap (tv:%u tap:%u)', 'TV input read error during audio tap playback': the SPDIF tap doubles as the TV-input capture path for lip-sync
::: details Evidence (6)

- @ 0x10feb6e7; audiotap_manager.cxx
- @ 0x10e738c4; spdiftap.c
- @ 0x10e76568; /downloadspdiftap
- @ 0x10e76554; /snapshotspdiftap + /downloadspdiftap endpoints
- @ 0x10f287d0; tap metadata version check
- @ 0x10f26ea4; TV input sample-rate mismatch vs audio tap

:::


:::

## `audioin_groups`

**coverage** `partial`

Grouping machinery for the line-in input, letting a line-in source be shared across a group like any other source. It's present in the shared codebase while the user-facing service on this build is stubbed.

::: details Technical details

groups keyed by coordinator {'Removing group with coord %s','Adding group with coord %s demoMode %d','addGroup: coordinator %s already added','addGroup: no room available for coordinator %s','added %s number of groups %zu remote %zu','removed %s remaining number of groups %zu remote %zu',"StopTransmissionToGroup: couldn't find coordinator %s"}; URI x-rincon-stream:; formats {UNCOMPRESSED,COMPRESSED,v-spdif} + 'Running demo mode forcing uncompressed'; module names audioinzoneplayer/AudioInputZP/reportserver; htc_zpimpl for HT-satellite input wiring

- **name:** AudioIn group management (ai_impl)
::: details Evidence (1)

- @ 0x10eacd98; ai_impl block

:::


:::

## `audiotap_manager`

**coverage** `partial`

Coordinates the audio capture points: which taps exist, who's listening on each, and when they open and close. It arbitrates so calibration, diagnostics, and any other audio listener don't fight over the feed or interfere with playback.

::: details Technical details

raudiotapMutex; "failed to setup async request %d %s"; "can't consume from a closed request"; audiotap.poll; "failed write %d %s"; tap guards 'number of max taps exceeds the avaialable capacity'\[sic\],'Active Tap %s','Closing Tap %s','No Active Taps to check if already tapped','Location is not tappable','Location is already being tapped','Max number of blocks already being tapped'; typed-param schema debugParameters/{channelname,vartype}/{VAR_FLOAT,VAR_STRING,VAR_INT}

- **name:** audiotap async requests
::: details Evidence (1)

- @ 0x10ee6170; audiotap reqs

:::


:::

## `authz`

**coverage** `partial`

The authorization machinery: the component that checks credentials on incoming requests, covering API keys on the modern surface and permission checks across the system. It's the bouncer logic behind 'Invalid API key'.

::: details Technical details

policies {"Static policy not found for role (%s), version (%s)","Static fast policy not found","Not in offline mode","Using guest policy for offline mode","Using mTLS policy","Using guest policy"}; token ops {"Failed to get the permissions: http=%d","Failed to parse getPermissions response","Failed to resolve token \[token=******%s\]: http=%d" (masked),"Failed to parse token response","Request to resolveToken successful \[token=******%s\]"}; cache {cache-control-header,responseResolveToken,museAuthzCache,InMemoryHttpCacheMutex,"Policy mapping retrieved from cache"}; guards {"Credential is not allowed","Guest access disallowed","Unauthenticated control disallowed"}

- **name:** /authz: policy + token resolution
::: details Evidence (1)

- @ 0x10ef9a80; authz block

:::


:::

## `auto_update`

**coverage** `partial`

The automatic-update machinery: it decides when the system should fetch and install firmware on its own schedule, per the household's update settings. This is what makes a fleet of speakers update overnight without you doing anything, because each player knows the policy, checks for a new build, and applies it when its window arrives.

::: details Technical details

states {ST_UNDEFINED,ST_INIT,ST_REFRESH,ST_SCHEDULED,ST_SCHEDULED_POST_WOW,ST_SESSION_MONITOR,ST_SESSION_REPORT,ST_SESSION_ACTIVE} + PendingStart/SessionStart/SessionStartLocal/SessionAttempts counters; settings {R_AutoUpdateWindowStart,R_AutoUpdatePolicy,R_CheckUpdateInterval}; blockers {"Upcoming alarm is preventing update","Active device(s) preventing update"}; "Trimming the window to (%d) seconds"/shrinkWindow; upgrade_mgr_report.json {pendingUpdateHours,numUpdateAttempts,startTime,elapsedSeconds,blockedUpdateReason,updateHHStatus,serverIP,errorMsg,extendedError,zoneType,startVersion,targetVersion,hardwareVersion,serialNumber,updateZPResult,numZPsInHH,numZPsInHHDelta,numZPsToUpdate,numZPsDropped,targetSystemVersion,updateHHResult,numFailedZPs,numZPsWithError}; "RINCON_%s01400 updated to %s"/"update failed (%d)"; "Retrying upgrade (%d/%d)..."/"Giving up after max upgrade attempts"; upgrade_mgr.txt state file

- **name:** upgrade_mgr: auto-update scheduler FSM
::: details Evidence (1)

- @ 0x10eae3f4; auto_update_scheduler block

:::


:::

## `bandwidth_meter`

**coverage** `partial`

Measures actual network throughput: a meter the streaming code consults to decide whether the connection can sustain a given bitrate. It feeds the adaptive-quality decisions, so when it reports a weak link the player picks lower-quality stream variants before the music stutters.

::: details Technical details

{"BANDWIDTH: %u B / %u ms = %u B/s = %u kbit/s","Bandwidth not calculated, latency zero","WINDOW BANDWIDTH: %u B / %u ms = %u kbit/s, high=%d, low=%d","LOW BW (kbit/s): %u < %u, count = %u","Bandwidth window not updated, latency zero"}; asserts {first_chunk_request_time not set,latest_chunk_finished_time not set,finished_time >= stats->first_chunk_request_time}

- **name:** eSDK bandwidth measurement
::: details Evidence (1)

- @ 0x10fe42ec; bandwidth

:::


:::

## `boot_sequence`

**coverage** `partial`

The player's boot logic: the ordered bring-up sequence inside this program, covering which subsystems initialize in which order, what must succeed before the next stage starts, and what the player does when something fails partway. It ends with the player announcing itself to the household.

::: details Technical details

"updating boot sequence due to wifi connection event"; settings {TargetRoomName,LocalAccountTransferMode,ForceWifiDisable,ForceMeshDisable,SonosNetDisable,WEPKey}

- **name:** boot_sequence_mgr: bootseq triggers
::: details Evidence (1)

- @ 0x10ef0a8c; boot_seq block

:::


:::

## `browse_prefixes`

**coverage** `partial`

The prefix-jump machinery: the 'go to the Ss' indexing that lets a long library list be navigated alphabetically, behind the FindPrefix and prefix-location commands.

::: details Technical details

{newrelease:album:genre:,staffpick:album:genre:,top:album:genre:,top:track:genre:,playlist:,%s.#%s,favorite:track,artist_tracks:} + urn:schemas-rinconnetworks-com:metadata-1-0/|total; additional RDC browse paths explore:artist:compilations::art.%s, mymusic:playlists, mymusic:album::alb.%s

- **name:** SMAPI/browse object-id prefixes
::: details Evidence (1)

- @ 0x10f0f62c; browse prefixes

:::


:::

## `bt_sbc`

**coverage** `partial`

Bluetooth SBC audio support: the decoder path for the standard Bluetooth audio format, present in the shared codebase for products that include Bluetooth. On this wired-only Playbar hardware it ships dormant, so the code is built in but never exercised.

::: details Technical details

params "freq=%u blks=%u sb=%u mode=%u alloc=%u bitpool=%u end=%u fin=%zu fout=%zu frames=%zu"; errors {Invalid packet header,Failed to parse %zd,Truncated packet. Lost frames,Invalid packet,frame size changed %zu->%zu,decoder error %zd on frame %zu,Bad SBC frame %zu read/decoded,NOTIFYFRAME_ERR_BUFFERING,unknown frame status}

- **name:** SBC decoder (Bluetooth RX)
::: details Evidence (1)

- @ 0x10ee54d0; sbc block

:::


:::

## `business_msp`

**coverage** `partial`

A managed-service-provider and business-tier integration block: machinery for enterprise-managed Sonos deployments where an organization administers fleets of players. It's part of the platform layer and stays mostly dormant on consumer households.

::: details Technical details

Sonos-for-Business managed-service machinery: SOAP ops AddRemoveSonosBusinessMSP / Sync Sonos Business MSP / AddRemoveSfbMSP, /msprox + /msprox?uuid= proxy endpoints, three tier vocabulary (SFB_COMMERCIAL/ESSENTIALS/PREMIUM_MSP + commercial/essentials/premium-msp slugs), Backgrounds MSP add/remove, enableRemoveMSPCredentialsFromUPnP flag, voice-service MSP education keys (O_AMAZON/GOOGLE_SHOW_MSP_EDUCATION)

- binary anchors: `AddRemoveSonosBusinessMSP`, `Sync Sonos Business MSP`, `/msprox`, `AddRemoveSonosBusinessMSP`, `SFB_PREMIUM_MSP`

::: details Evidence (5)

- @ 0x10e749a4; AddRemoveSonosBusinessMSP
- @ 0x10e74e7c; Sync Sonos Business MSP
- @ 0x10e763b8; /msprox endpoint
- @ 0x10f99990; SFB_*_MSP tier enum
- @ 0x10e74e94; AddRemoveSfbMSP op

:::


:::

## `buttons_ir`

**coverage** `partial`

The physical controls layer: the code that reads the unit's buttons (play/pause, volume, mute) and the infrared remote input, turning hardware presses into the same commands an app would send.

::: details Technical details

button + IR input pipeline: hw-message BUTTON multicast group carries events, longpress.cxx handles holds, events forward to the group coordinator ('Forwarding button events'), /button_triggered\[.xml\] diagnostic capture, /rdmbuttonfwd retail hook, virtualRemoteControl/buttonCommand muse route injects button presses from the cloud; irdecoder.cxx learns TV-remote codes against the ir.ws.sonos.com database; zp-level FSM: 'zp_pre_setup_state','init minimal node','processing local %s'; skipBack/skipToNextTrack dispatch 'playback#skipBack'/'playback#skipToNextTrack' via group UUID ('Could not get group UUID for player %s to send skipBack command','Error sending skipBack command to local: %s','playback#skipBack response: %s'); play/pause FSM 'entering play/pause toggle','processing the play/pause button up event','executing pause','playback paused (cid: %s)','Error (%d) invoking pause','Pause failed - Cleared fast volume zero','executing un-mute instead of pause' (un-mute fallback when mute state can't be read),'waiting for PlaybackStateChangedEvent to clear fast volume zero','play/pause toggle cleared HW fault'; demo-mode IR learn loop 'Starting IR remote learning','Remote learning successfully configured remote for demo mode.','Remote learning one button code not found in DB for demo mode.','Remote learning timed out before remote was configured for demo mode.','Remote learning failed to configure for demo mode.'; config-mode entries: '%sentering speaker-detect config mode' alongside button-notify and room_calibration-calibrate; 'Entering %s config mode.','invalid input parameters v:%s t:%s'; IR decoder detail (irdecoder.cxx): debounce layer 'handling debounced input'/'debounced volume up'/'debounced volume Down','currently not playing','handling raw volume up'/'raw volume down'/'raw volume mute'/'raw input code'; install guards 'attempted to install a null code'/'null remote','unknown IR control target while installing code','unknown IR code pattern while installing code','attempting to add null remote to db'/'remote to full db','attempting to set too long a controller name'/'excessively long main code'/'alt code'/'repeat code','Cannot add {repeat,vol up,vol down,input,vol mute} code: list full.','Failed to open IR device! (%d)','Could not get IR file descriptor!','Failed to close IR device','Could not write ir configuration!','db code length \[%d\] exceeds buffer','exceeded temp buff size: i = %d','Input buffer too large (%d > %d), contents truncated','Ignoring excessively long code during learn, length: \[%d\]','new capture %d','Successful long code learn.','total bytes received: %d'

- binary anchors: `longpress.cxx`, `irdecoder.cxx`, `/jffs/irconfig.txt`, `virtualRemoteControl/buttonCommand`, `ir.ws.sonos.com/IRCode/`, `/button_triggered.xml`, `LearnIRCode`

- **button_vocabulary:** BUTTON_PLAYPAUSE(+_PRESSED/_HELD), BUTTON_VOL_UP/DN(+_PRESSED), BUTTON_JOIN(+_PRESSED), BUTTON_MODE, BUTTON_POWER, BUTTON_MICMUTE/STATE_BUTTON_MICMUTE_PRESSED, BUTTON_PAIRING, BUTTON_VOL_ROCKER, BUTTON_MUTE, BUTTON_WIFIBT_MODE, SWIPED
- **forwarding:** hwmessagelib_multicast_group_BUTTON bus; 'No button handler, unable to forward buttons'; '%s button pressed (cid: %s)'/'Play button held (cid: %s)' correlation ids; PlayerButtons XML with required-field validation
- **lock:** SetButtonLockState/GetButtonLockState/GetButtonState SOAP surface; DesiredButtonLockState/CurrentButtonLockState vars; UnpairedButtonLock; BUTTONS_LOCKED + IN_BUTTON_OBSERVATION_MODE + DAT_IN_BUTTONLESS_SETUP_MODE states; 'button-notify' config mode (cm_button/buttonAction); 'Becoming standalone due to button press'
- **ir:** irdecoder.cxx select-thread (selthrd.RIRDecoder.*); LearnIRCode/CommitLearnedIRCodes/GetButtonState actions; one-button learn mode with timeout + UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND fault; codes fetched from http://ir.ws.sonos.com/IRCode/ (O_IR_DB_WS_IRCODE_URL key), <IRCode> XML schema; demo-mode missing-code path
- **cloud:** v1/players/{playerId}/virtualRemoteControl/buttonCommand + household-scoped variant, sendButtonCommand op: cloud-injected virtual remote
::: details Evidence (7)

- @ 0x10ec9b6e; longpress.cxx
- @ 0x10ea75fa; irdecoder.cxx
- @ 0x10e751e8; /jffs/irconfig.txt
- @ 0x10e85fe8; virtualRemoteControl/buttonCommand muse route
- @ 0x10ea72ac; http://ir.ws.sonos.com/IRCode/ cloud IR database
- @ 0x10ec74e0; '%s button pressed (cid: %s)' forwarding log
- @ 0x10ea701c; UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND learn-mode fault

:::


:::

## `capability_guards`

**coverage** `partial`

The per-setting capability gate messages: 'supported only for devices that support power over ethernet', 'water sensor', 'microphone switch', 'subwoofer', 'suspendable devices', plus a minimum-battery requirement. These explain why a settings update can be rejected on one model but accepted on another, because the validator checks hardware capabilities, not just the data format.

::: details Technical details

"Supported only for devices that support power over ethernet and have ethernet support"; "Supported only for devices with a water sensor"; "Supported only on devices with a microphone switch"; "Device is not a subwoofer"; "Supported only on suspendable devices" + {requiredMinimumBatteryPercentage,requiredMaximumBatteryPercentage,durationSeconds}; "Supported only on devices with a battery"; "Supported only on devices with bluetooth" + "Unable to set bluetooth pairing, unsupported"; "target is not a home theater source"/"target does not support HDMI CEC" + tvPowerState; "Setting is not valid"

- **name:** settings capability guards
::: details Evidence (1)

- @ 0x10e99764; capability guards

:::


:::

## `catalog_translate`

**coverage** `partial`

The catalog-ID translator: it asks the cloud to map an item ID from one service's namespace into another's, for example 'the same album on Spotify versus Deezer'. Without it every service would need its own browsing logic, and with it one service's 'station' and another's 'channel' both arrive in the app as the same kind of browsable item.

::: details Technical details

translateId(%s,%s,%s) with missing-param errors {objectId,serviceId,targetObjectId}; cloud GET catalog/id/%s?destinationServiceId=%s + targetSid; caching {"retrieved translation from cache","translation not cached; connecting to translation service","translateId response: %d %s","saved translation to cache"}; catalogSvcMgr

- **name:** /content/api + zpCatalogTranslation
::: details Evidence (1)

- @ 0x10eb3c38; catalog block

:::


:::

## `cec_diagnostics`

**coverage** `partial`

The HDMI control-channel diagnostic fields: the state variables reporting what the TV link is doing, including power status, audio-return-channel state, and error flags. When a soundbar can't see or control the TV it sits under, these are the readings that report what the HDMI channel is actually doing.

::: details Technical details

{tvCECStatus,tvPowerStatus,deviceCEC,stateSAM,errorSAM,stateARC,errorARC,errorTV,eARCActive,testAudio,testVideo}

- **name:** HDMI-CEC/ARC diagnostics fields
::: details Evidence (1)

- @ 0x10fa2160; cec fields

:::


:::

## `cert_files`

**coverage** `partial`

The on-flash layout for cert material: files named for `encrypted-private-key`, `expiration`, `encryption-key-type`, and `sonos-key-and-cert`. Rotation and renewal rewrite these; a corrupt or expired set cascades into mTLS and token-signing failures across every authenticated surface. Losing or corrupting these files means losing the device's cryptographic identity, so their handling is deliberately careful.

::: details Technical details

"%s/%s.%s"; keys {encrypted-private-key,expiration,encryption-key-type,sonos-key-and-cert}; "failed to retrieve key"

- **name:** device cert file layout
::: details Evidence (1)

- @ 0x10faf07c; cert files

:::


:::

## `chanmapset`

**coverage** `partial`

The ChannelMapSet initializer: builds the channel-map tables that describe how speaker channels are assigned (stereo pair L/R, surround roles), with bounds ('Initializer List too large, truncating') and duplicate detection. The watchdog thread `awThreadWDCheck` guards its init. When you bond speakers, this is the data deciding who plays left, who plays right, and who carries the low end.

::: details Technical details

chanmapset var; 'Initializer List is too large: %d > %d, truncating to %d'; 'Duplicate entry: %s at index %zu and %zu'; awThreadWDCheck watchdog; sync protocol: 'upd \[%zu\] error, stored uuid: %s','chk \[%zu\], remote uuid: %s, remote state: %d, my state %d' (dp_zpimpl_ht.cxx)

- **name:** ChannelMapSet init
::: details Evidence (1)

- @ 0x10ee6e84; chanmapset

:::


:::

## `chirp`

**coverage** `partial`

The acoustic data-over-sound stack (Chirp SDK 4.2.3, Chirp core 4.2.1) used for setup and secure pairing. The `sonos-cdma` profile spreads symbols across CDMA notes; decoding runs an FFT peak-picker, note estimator, scorer, and voter. Built-in profiles include audible, ultrasonic, and the secure-setup variant. This is how the app passes Wi-Fi credentials to an unprovisioned player by playing a sound from the phone. When you're arranging surrounds and can't tell two identical boxes apart, the app triggers this and the speaker you're pointing at announces itself audibly.

::: details Technical details

profile sonos-cdma; decode pipeline {chirp_decoder_t,chirp_cdma_decoder_t,chirp_cdma_match_t,chirp_note_estimate_t(u16),chirp_peaks_t/chirp_peak_t,chirp_scorer_t(u64),chirp_voter_t}; encode {chirp_cdma_encoder_t,chirp_codebook_t(u8*),chirp_rms_t,chirp_decorator_t}; fft {chirp_maths_fft_init/deinit,double}; errors {"No frames selected to decode (is sustain period too short?)","payload contains unknown symbols","Preamble payload has too few symbols ... TODO: #741","Payload does not support symbol sizes beyond 64-bit","Preamble code is outside of symbol range","corrupt_random_symbols","symbol_bits will overflow a cast","failed to read fixed config and codebook"}; sdk {chirp_sdk_random_payload,chirp_sdk_get_info,_chirp_on_received_cdma}; playback {"Start chirping with unique device value:%d","current chirp output volume: %d","A chirp signal is already playing with playId %d","Stop chirp playId %d differ than m_chirpPlayId","Failed to stop chirp","Couldn't create a chirp audio stream","Error initializing chirp","Chirp setup failed - chirp sender does not exist!","Unable to play chirp"}; stream taps {as-dspin-ext-chirp,as-dspout-ext-chirp,ext-chirp-as,setup-chirp-as}; stream errors {stream_chirp_init_sync,lack_data_no_drain,read_err_full,read_err_part_data}; "Ignoring busy transition due to chirp only"; muse routes v1/players/{playerId}/roomDetection/chirp{,/{playId}} + household variants

- **name:** chirp acoustic stack (Asynchronous Inc SDK 4.2.3 b1898)
- **source_layout:**
  - **status:** confirmed
  - **files:** /code/chirp-core/source/core/src/{common/{crc,payload,reed-solomon,template,utils}.c,profile/{profile,protocol,protocol-acoustic,protocol-encoding,config,config-voter-config}.c,decoder/decoder.c,cdma/cdma_decoder.c}; ctor symbols new_chirp_{profile,payload,acoustic,encoding,template,voter_config,rs_result}
  - **validator:** profile.c: 'Version'/'Schema version' keys, 'Profile name is too long','Invalid number of entries in the profile object when parsing a JSON (found %d, should be %d)','Unknown JSON key: %s'. protocol.c: per-object entry-count checks for {protocol,protocol-acoustic,protocol-encoding} + 'Invalid key in {acoustic,encoding,protocol}: %s','Preamble must be at least 1 byte long'. protocol-acoustic.c rules: 'Base frequency is below 20','Channel count is not within acceptable range','Header note length invalid','Body note duration invalid','Attack time is invalid','Release time is invalid','Attack/release combination is invalid','Portamento is invalid','Preamble silence time is invalid','Body silence duration is invalid','Preamble must have some length'. protocol-encoding.c: 'Alphabet bits is not within acceptable range','Min message length cannot be less than 1 byte','Max message length cannot be less than 1 byte','Max message length cannot be less than min message length','Polyphony is outside valid range','Total frame length cannot be more than 256 symbols'. config.c: 'Config is not supported by sample rate: %d Hz','Voter %d frame offset exceeds half-note limit (%d > %d)','Error instantiating spectral_weighting_points','Invalid voter config key: %s'.
  - **dump_printer:** profile dump: ' - Version: %d',' - Schema version: %d'; protocol dump: ' - Frequency base: %.1fHz',' - Frequency interval: %.1fHz',' - Channels: %d',' - Channel interval: %.1fHz',' - Note duration, header: %.3f'/'body: %.3f',' - Envelope duration, attack: %.3f'/'release: %.3f',' - Portamento: %.3f',' - Silence duration, header: %.3f'/'body: %.3f',' - Polyphony: %d',' - Symbol bits: %d',' - Alphabet bits: %d',' - Message length: %d - %d',' - RS length: %d - %d',' - CRC length: %d'; decoder config dump: ' - Hop size: %d',' - Minimum sample rate: %d',' - FFT size: %d',' - Payload metrics enabled: %d',' - Buffer metrics enabled: %d' + per-voter '   * Reverb cancellation exponent: %f','   * Reverb cancellation magnitude: %f','   * Frame offset: %d','   * Preamble threshold: %f','   * Amplitude threshold: %f','   * Spectral weighting size: %d'.
  - **decoder:** decoder.c: 'Blockbuffer failed to append samples','Cannot initialise decoder with NULL profile','Cannot initialise decoder with zero sample rate','Invalid channel: %d','Invalid profile/sample rate'; cdma_decoder.c: 'chirp_cdma_decoder_process_frame: Call to add_score failed', 'Detected code: \[%d, %d, %d, %d ...\]' emitted on symbol decode.
::: details Evidence (1)

- @ 0x10fd04d6; chirp blocks

:::


:::

## `chirp_stack`

**coverage** `partial`

The full chirp implementation stack: the complete path from a room-detection command to an audible tone coming out of a specific speaker, covering request handling, tone selection, and routing through the audio path.

::: details Technical details

embedded chirp-core 4.2.1_7265 acoustic data-over-audio SDK with a custom 'sonos-cdma' profile: used for room detection during setup: muse routes roomDetection/chirp (start/stop signalling with {playId}), DSP-routed audio streams as-dspin-ext-chirp/as-dspout-ext-chirp, a per-device unique payload ('Start chirping with unique device value:%d') and calibrated output volume ('Chirp volume not yet calibrated')

- binary anchors: `chirp_private_cdma.c`, `protocol-acoustic.c`, `sonos-cdma`, `chirp-core: 4.2.1_7265`, `roomDetection/chirp`, `SETUP_CHIRP`

- **library:** chirp-core 4.2.1_7265; 'Chirp SDK with "%s" profile v%u \[max %u bytes in %.2fs\], supporting %u channel(s), using %s modulation': profile system; sonos-cdma + FSK modulation files (chirp_private_cdma.c, chirp_private_fsk.c); reed-solomon FEC; chirp_levenshtein fuzzy match; JSON-configured protocol (alphabet bits, min/max msg length, polyphony); CHIRP_MEMORY_MANAGER_LEVEL_LOW build
- **api:** chirp_sdk_send, chirp_sdk_process_shorts_input/output, chirp_encode/decode, chirp_get_symbols, chirp_sdk_random_payload
- **usage:** muse: v1/players/{playerId}/roomDetection/chirp (startSignalling) + /{playId} (stopSignalling) + household variants; chirpRequest op; playId-keyed chirp management ('A chirp signal is already playing with playId %d', 'Stop chirp playId %d differ than m_chirpPlayId'); 'Start chirping with unique device value:%d': encodes a device id; volume calibrated ('Chirp volume not yet calibrated', 'current chirp output volume: %d'); DSP routing as-dspin-ext-chirp/as-dspout-ext-chirp; 'Ignoring busy transition due to chirp only'
- **errors:** ERROR_ROOM_DETECTION_SIGNALLING_{FAILED,BUSY}
- **unresolved:** the sonos-cdma profile parameters (freq table, symbol alphabet), what payload the room-detection chirps carry
- **sdk_layout:** full source map embedded: chirp_sdk.c/chirp_sdk_process.c/chirp_sdk_states.c SDK shell; chirp-private cdma+fsk glue (_chirp_on_received_cdma/_fsk, _chirp_sdk_allocate_decoders_fsk); chirp-core modules: chirp.c, payload.c, crc.c, bitstring.c, filter.c, multitone.c, reed-solomon.c, template.c; profile/{profile,protocol,protocol-acoustic,protocol-encoding,config,config-voter-config}.c; decoder/{decoder,peaks,scorer,voter,weighting,rms}.c; cdma/{cdma_decoder,cdma_encoder,codebook}.c; encoder/{encoder,wavetable,decorator}.c; dsp/{blockbuffer,fft,reverb}.c; maths/float32 fft init/deinit
- **profile:** 'Chirp SDK with "%s" profile v%u \[max %u bytes in %.2fs\], supporting %u channel(s), using %s modulation.': profile 'sonos-cdma', CDMA modulation; 'Chirp protocol must be fixed length for CDMA'; validators bound alphabet bits, min/max message length and polyphony
- **decode:** decoder pipeline: FFT → peaks → scorer → voter (chirp_voter_set_state, per-voter configs) → weighting → reed-solomon FEC; chirp_levenshtein for fuzzy payload matching; decode metrics (chirp_decode_metrics_t, buffer_processed_metrics, payload_metrics)
- **ops:** ROOM_DETECTION_CHIRP/EXT_CHIRP/SETUP_CHIRP internal ops; RoomDetectionStartChirping/RoomDetectionStopChirping; ChirpIfPlayingSwappableAudio; playId management ('A chirp signal is already playing with playId %d', 'Stop chirp playId %d differ than m_chirpPlayId %d'); 'Ignoring busy transition due to chirp only'; stream stats stream_chirp_{init_sync,lack_data_no_drain,read_err_full,read_err_part_data}
- **profile_schema:** Full profile JSON grammar recovered (chirp-core source paths /code/chirp-core/source/core/src/profile/{profile,protocol,protocol-acoustic,protocol-encoding,config}.c). Built-in profiles: 'audible', 'sonos-cdma', 'sonos_secure_setup', 'ultrasonic'. Top-level keys: 'schema_version', 'decoder_config'. Protocol-acoustic keys: base_frequency (>=20Hz), channel_count, channel_interval, envelope_attack, envelope_release, preamble (u64 list, >=1 byte, code must be in symbol range), header_note_duration, header_silence_duration, frequency_interval, body_note_duration, body_silence_duration, portamento, template. Protocol-encoding keys: alphabet_bits, crc_length, message_length_min/max, polyphony, rs_length_min/max (Reed-Solomon): 'Total frame length cannot be more than 256 bytes' AND '256 symbols', 'Max message length too large to be expressed in a single symbol'. Decoder config keys: fft_size, hop_size, sample_rate_min, payload_metrics_enabled, buffer_metrics_enabled, voters\[\] each {amplitude_threshold, frame_offset (<= half-note limit), preamble_threshold, reverb_cancellation_exponent, reverb_cancellation_magnitude, spectral_weighting}. Banner: 'Chirp SDK with "%s" profile v%u \[max %u bytes in %.2fs\], supporting %u channel(s), using %s modulation.' Constraints: 'Bandwidth cannot be measured for equal-tempered settings', 'Minimum FFT bin is negative', 'Maximum FFT bin is bigger than half of the block size', 'Config/Protocol is not supported by sample rate: %d Hz', attack/release combination invalid checks. Payload: symbol_bits<=64 ('Created new payload (symbol_bits = %d, length = %d, total bits = %d)'), chirp_levenshtein decode-metric, chirp_decode_metrics_t, 'Generated random chirp with identifier: %s'.
- **builtin_profile_data:** Compiled-in profile descriptors (.data 0x11094580-0x110948xx): records headed {name*, 0x80000 flag, preamble, 5-float per-voter threshold array}. audible: thresholds 0.95x5, packed fields 0xfb05f6/0xa000000/0x3010f0f. sonos_secure_setup: 0.97x5 + 0.99/0.97. sonos-cdma: thresholds {0.2,0.4,0.6,0.8,0.53} then a channel/freq-symbol map (repeating {17000,0},{18000,12},{19000,24},{20000,36} pairs (4-channel 17-20kHz ultrasonic preamble map, symbol codes stepping 12), tail variants {17000,17.248},{18000,34.405},{19200,34.238},{19400,0} and {17000,8},{18000,6},{19000,4}. 'sonos-cdma' is therefore the ultrasonic inaudible-band profile (17-20kHz carriers) used for secure setup; 'audible' is the audible-band profile. Exact field names still inferential) the structs are positional C initializers.
- **send_path:** room_detection_send: 'set_config (%d): %s', 'sample rate: %s', 'max payload is: %zu', 'generation status %d'/'generation incomplete %d'/'duration truncated'/'generated signal (%zu bytes)'/'generation took %u ms'; play-id bookkeeping "playId can't be REA_PLAY_ID_NULL", 'Failed to stop chirp with playId %d', 'Stop chirp playId %d differ than m_chirpPlayId %d', 'Chirp payload %s not supported.', "Couldn't create a chirp audio stream.", 'A chirp signal is already playing with playId %d.': single in-flight chirp stream enforced
::: details Evidence (9)

- @ 0x10fd2948; chirp_private_cdma.c
- @ 0x10fd0c49; protocol-acoustic.c
- @ 0x10fd3454; chirp-core: 4.2.1_7265 version string
- @ 0x10fd04d0; 'sonos-cdma' custom protocol profile
- @ 0x10e81ee8; roomDetection/chirp muse routes
- @ 0x10fcecfc; SDK profile/modulation log format
- @ 0x10fd3454; chirp-core: 4.2.1_7265 version banner
- @ 0x10fcecfc; SDK profile banner (profile v%u, max bytes, modulation)
- @ 0x10fd1cf8; 'Chirp protocol must be fixed length for CDMA'

:::


:::

## `cloud_api_paths`

**coverage** `partial`

The URL builders for every cloud call: token, invite, user, firmware-download, and event endpoints, each under household, player, service, or group prefixes with their parameters. Collected in one map, they show the full surface of what the player can ask the cloud, which is the outbound counterpart of the API it serves.

::: details Technical details

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
::: details Evidence (1)

- @ 0x10fba284; cloudapi paths

:::


:::

## `cloud_synchronizer`

**coverage** `partial`

The cloud synchronizer: it keeps household state like settings, accounts, and playlists mirrored between the local system and Sonos's cloud so both sides stay current. It's why your settings survive a player replacement and why changes made remotely appear on the speakers.

::: details Technical details

cloud_synchronizer thread: registerServices (max-count abort, called-once guard), "received JIT event", "discarding %s type %d"

- **name:** RCloudSynchronizer
::: details Evidence (1)

- @ 0x10ef1ba0; cloudrequest region

:::


:::

## `common_logger`

**coverage** `partial`

The shared logging machinery: the unified way every subsystem writes log lines, covering formatting, severity levels, and the named log channels each module writes to. It provides one consistent logging surface instead of per-module output.

::: details Technical details

keys {filter,fileSize,preserveSize,defaultLevel,backup,hostIP,hostPort,STDERR,.backup,logger,rsettings}; line fmt "\[%s | %07ld%03ld\] <%s,%d> "; "Invalid log category name (%s), length: %zu, range \[%d, %d\]"; IO {stat/ferror/read failed}; E_ codes {E_INVALID_SETTING,E_UNSUPPORTED,E_NETWORK_DATA_ERROR,E_NETWORKIOERROR,E_NETWORKTIMEOUT,E_NETWORKOVERFLOW,E_INTERNALERROR,ADD_ME}; rapidjson errors {Invalid escape character,Surrogate pair invalid,Invalid encoding,Number too big for double,Miss fraction/exponent,Missing name/colon/comma,Parsing terminated,Unspecific syntax error,Missing closing quotation mark,Document empty,Document root not singular}

- **name:** common_logger config
::: details Evidence (1)

- @ 0x10f933f8; logger+json

:::


:::

## `cpu_monitor`

**coverage** `partial`

The CPU monitor: it watches processor load and reports it. The readings feed diagnostics (why was the box slow?) and give features a signal to back off when the player is busy, keeping audio playback prioritized over background work.

::: details Technical details

reads /proc/stat; header " \[%d\] usr sys idle sIRQ | irqD dMS"; row " \[%d\]  %2u  %2u   %2u   %2u | %6u %5lld"; parses %zu x7; "cpu%d switched to a shutdown state"; "Avoided dividing by zero calculating cpu core: %d bOverflow: %d"; "core%d: idle at %d%%"

- **name:** CPU monitor
::: details Evidence (1)

- @ 0x10ea5d00; cpu monitor region

:::


:::

## `crash_report`

**coverage** `partial`

Crash-event telemetry: per-process crash counts with upload responses (procName, numCrashes, uploadResp, playerCrash, lifetime). Reported events feed the crash-upload cloud service; failed uploads are logged for retry. When the program dies, this captures the state around the failure (logs, stack, context) and packages it so Sonos can diagnose crashes in the field without reproducing them.

::: details Technical details

{procName,numCrashes,uploadResp,playerCrash,lifetime}; "%s %s crash event, crashCount: %i"; Reported/Failed to report

- **name:** crash-event reporting
::: details Evidence (1)

- @ 0x10f028b8; crashreport block

:::


:::

## `crossfade`

**coverage** `partial`

The crossfade implementation: the audio machinery that overlaps the tail of one track with the head of the next during the crossfade window. Behind the simple on/off setting is a real mixing path that only works when both tracks come from the same local queue, which is why the command rejects other sources.

::: details Technical details

{"attempting to crossfade with underflowed stream","recovered crossfade stream underflow","crossfade %zu samples","attempting to int16 crossfade with empty stream, clearing crossfade","unknown stream type in int16 crossfade: %d","crossfaded %zu bytes (%zu samples, %zu usec), %zu more samples to fade this frame, %zu samples to fade","unknown stream type in crossfade: %d","ending xfade","xfade already on - %zu samples remain unwritten","xfade corked stream: replace buffered data via non-xfade overlap","xfade timestamp too far in past, nst %d.%06d, pt %d.%06d","set xfade lfnf","xfadeable timestamp","inserting volume norm ramp: %d @time %d.%06d","xfade for %zu samples, %f seconds","xfade gap, samples %zd","starting xfade (xfade %s)"}; fmt %ld:%02ld:%02ld; "notifyStateChange \[%s\]: itemId: %s ptvWhen %d.%06d ptvTrackPos %ld.%06ld" + "notifyStateChange music quality: %s"

- **name:** crossfade engine
::: details Evidence (1)

- @ 0x10eb9ee8; xfade block

:::


:::

## `csfcm`

**coverage** `partial`

An internal component identified by build-tree naming: part of the firmware's module set recovered structurally. Its exact expansion isn't recoverable from the binary's strings, so it's documented by where it sits and what it connects to rather than by guessed meaning.

::: details Technical details

csfcm; pool {'marking (t:%d)','add %d.%06d %zu %s %d/%d free','NO FREE CONTEXTS','flushing (t:%d)','flushed %d.%06d %s','popping %d.%06d %s (%d.%06d < %d.%06d) %d/%d free'}; log fmt '%s:%05d \[%s\] pos:%u/%u hint:%s/nextState:%s/reqOp:%s/itemID:%s'

- **name:** channel-source frame-context manager
::: details Evidence (1)

- @ 0x10eb5f04; csfcm

:::


:::

## `daemon_ipc`

**coverage** `partial`

The request-forwarding table that lets this program ask its sibling system daemons to do things: the power coordinator, the Bluetooth manager, the LED manager, and the network-startup process, plus the answers those requests can return. It's the inter-process glue of the appliance.

::: details Technical details

routes {/anacapad-external,/sonospowercoordinator-external,/btmanager-external,/sonosledmgrd-external,/netstartd-external} proxy to sibling daemons; watchdog {/watchdog,/watchdog-legacy,/legacy-to-sentry,/upload} + attachments {watchdog_log,watchdog_dmesg} + crashdump; sentry {"No URL found to upload dump file: %s",text/plain; charset="us-ascii","Failed to write attachment %s to sentry upload",sentry\[tags\]}; flags {/tmp/anacapa_prevent_crashdump_upload,/tmp/backtrace,/tmp/crashed_play_state,/jffs/app/debug/sonosledmgrd.dmp,/opt/log/btservice.log}; "writeStream failed - Bytes compressed: %d/%d" + htsnk

- **name:** /X-external daemon proxy + watchdog/sentry
::: details Evidence (1)

- @ 0x10ea7e40; daemon ipc block

:::


:::

## `dataio`

**coverage** `partial`

The data I/O layer: shared helpers for reading and writing structured records, used across the subsystems that serialize state to disk or wire. It was recovered by name and structure during the firmware mapping rather than from public docs.

::: details Technical details

dataio.poll; parses {HTTP Result,Last-Modified,Content-Type,SET-COOKIE,cache-control,max-age=,ETag,WWW-Authenticate}; errors {'populate client config failed','unexpected response condition','parse_key failed',"Couldn't load api header, error 1/2"}; awaitAvail {'tried to read %zu bytes where only %zu available','range limited %zu bytes available','socket is closed','took %ldms (e:%d b:%zu w:%zu sbo:%d)'}; SSL 'SSL %s error -0x%x %d to %s with local port %u' + session ticket during dataio SSL read; http {'http readable but 0','http read error %d %s','http timeout'}; header validation {'Bad HTTP Header','BAD HTTP Header EOR mismatch Actual: %zu, Exptd: %zu','BAD HTTP Header EOR out-of-bond'}; chunked-response parser internals: 'BAD HTTP Header EOR out-of-bond EOR: %zu, Total: %zu','BAD HTTP Header EOR: %zu, Total: %zu','Error processing chunked response','Error in the stream (>32bit)/(hex)/(terminator). Can't proceed.','Parser is in incorrect state, probably bug with no calling reset(). Can't proceed.','Programmer error. Should not end up here.','we're at/past the file size! at: %zu, expected: %zu'; SSL {'Received new session ticket during dataio SSL write','SSL write timeout'}; request bookkeeping 'Failed to get request metadata ID hash'/'Added request metadata: %s'; test boundary 'SONOSMULTIPARTBOUNDARY.BLAHBLAHBLAH'

- **name:** dataio HTTP transport
::: details Evidence (1)

- @ 0x10ee7cd4; dataio block

:::


:::

## `desired_settings`

**coverage** `partial`

The 'Desired' replicated settings: desired time format, date format, time server, time, timezone, and daily index-refresh time. 'Desired' means 'what the household wants' as opposed to what's currently applied, and the distinction matters during merges and clock sync. This split lets the system validate a change before committing it and roll back cleanly if applying fails.

::: details Technical details

{DesiredTimeFormat,DesiredDateFormat,DesiredTimeServer,DesiredTime,TimeZoneForDesiredTime,HouseholdUTCTime,DesiredDailyIndexRefreshTime}

- **name:** Desired* setting keys
::: details Evidence (1)

- @ 0x10f1164c; desired settings

:::


:::

## `dev_disc`

**coverage** `partial`

The device-discovery thread (ddt): logs alive/gone announcements per device with source addresses, counts lost discovery messages, and handles the local-network discovery exchanges. It's the player's ear for other devices appearing and disappearing.

::: details Technical details

devdiscthr/ddthrd.cxx: rx logging "%s - rx MSEARCH %s from %s:%d (%zd %d %d)", "%s - rx %s ALIVE %s %s %d %u %s (%zd)", "%s - rx %s BYEBYE %s", "%s - rx CDALIVE %s %s %d", "%s - rx CDBYEBYE %s", "rx  QUARANTINE_RECHECK %s"; "%s - %u SSDP messages lost"; zp byebye; "ddt hint:%d"; "Finished working on type %d"; SSDP M-SEARCH response signing: 'Failed to calculate M-SEARCH signature','M-SEARCH signature base64 encoding failed'; header vocabulary: X-RINCON-HOUSEHOLD, X-RINCON-PROXY, X-RINCON-REASON, HOUSEHOLD.SMARTSPEAKER.AUDIO, SECURELOCATION.UPNP.ORG, X-SONOS-HHSECURELOCATION, X-SONOS-DEVICEID, X-SONOS-SESSIONRETRIES, X-SONOS-SESSIONSECONDS, X-SONOS-MDPMODEL, MAN: "ssdp:discover"; socket opts 'Sonos ucast opt error %d %s'/'Sonos mcast opt error %d %s'; notify handler select-threads selthrd.RMSearchNotifyHandler.{reset,data,except,timeout}; 'Failed to setup MSearchNotifyHandler'; manifest gate 'Manifest URL must use HTTPS: %s','Service manifest URI truncated: %s','Failed to load manifest %s (URLs too long?)','OnSuccessStringId'; metrics config rev negotiation 'update the metric report config? existing rev: %d; proposed rev: %d','trying to configure non-existent uploader %s','Failed to add category: %s','reporting xml configuration format error'; orientation enum fragments VERTICAL_ABOVE/VERTICAL_BELOW; also hosts WMP NSS registrar 'urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1' and DIDL-Lite namespace|element map (DIDL-Lite/item/container/res)

- **name:** RDevDiscThread/ddt SSDP device discovery
::: details Evidence (1)

- @ 0x10ef1d08; ddthrd.cxx

:::


:::

## `device_registration`

**coverage** `partial`

The two-phase secure-enrollment handshake: `POST /product/v2/households/{hh}/players?action=refresh` starts it, `?action=complete&token={tok}` finishes with the issued credential. The FSM logs state changes, handles suspend/resume mid-registration, retries on schedule, and treats an unexpected 401 as terminal. This is the path a replacement or reset player takes to get a household cert. This is the step that ties a fresh speaker to an account after setup, turning 'a box on the network' into 'your registered product'.

::: details Technical details

Two-phase enrollment: POST /product/v2/households/{hh}/players?action=refresh then ?action=complete&token={tok}; FSM "regState changed %d -> %d" + "Transfer mode old (e:%d) new (e:%d)"; logs {during suspend,time expired,success,retrying registration at time %ld,error,Unexpected 401 response}; vars {regStatus,playerReg,sslerror,errno,mutualssl,sslError}; cert lifecycle {Flushed cert,removed invalid cert}; secure-reg-transfer IPC: signing key via {"Invalid registration signing key in IPC payload","Registration signing key set/cleared"}, jobs {tjmgrExitSecureRegTransferState,newRegisteredCertSonosIDLocked,exitSecRegTransferState}; household-customer conflict {"Household customer ID \[%s\] in conflict with local device \[%s\]","changed \[%s\] -> \[%s\]"} vars {RegisteredCustomerID,RegisteredCertSonosID}; events {Received %s event. Sonos ID,NewCertRegistrationEvent inprocess-event}; RegisterZoneProvider UPnP action; replicated headers {X-RINCON-LAST-UPDATE-DEVICE,X-RINCON-CONTENT-FORMAT,CONTENT-ENCODING,X-RINCON-SIGNATURE} + "unexpected content version/format"; {ReplicatedSettings,settingsReplication,netsettingsReplication}; "Removing settings denylists after registration"

- **name:** secure device registration (regdevicecert)
::: details Evidence (1)

- @ 0x10efc8f8; regdevicecert rodata block

:::


:::

## `device_unlock`

**coverage** `partial`

A hidden developer-unlock feature: hitting specific unlock endpoints marks the player as unlocked with a flag file and reboots it. There's a server-side limit on how many times a unit can be unlocked, and diagnostic tests refuse to run on unlocked hardware, so unlocked units are treated as non-production.

::: details Technical details

developer/manufacturing unlock surface: /unlock, /devunlock, /mfgunlock and /unlock.htm endpoints write /tmp/device_unlocked_flag; unlocks are rate-limited ('Too Many Unlocks' HTML page) and DevUnlock reboots the player; RdeviceIsUnlocked and RabortIfUnlocked let self-tests detect and refuse to run on unlocked units; 'unlockedBld' marks the build state

- binary anchors: `/unlock`, `/devunlock`, `/mfgunlock`, `/tmp/device_unlocked_flag`, `Too Many Unlocks`, `RdeviceIsUnlocked`, `RabortIfUnlocked`, `deviceUnlock`, `unlockedBld`, `<Unlocked>1</Unlocked>`

- **endpoints:** /unlock, /devunlock, /mfgunlock, /unlock.htm (browser form)
- **behavior:** unlock writes /tmp/device_unlocked_flag and an <Unlocked>1</Unlocked> record; the deviceUnlock op + 'DevUnlock' page return 'Rebooting...'; a server-side cap yields '<h2>Too Many Unlocks</h2>' when the per-device unlock budget is exhausted
- **safety:** RdeviceIsUnlocked + RabortIfUnlocked R_* hooks let diagnostic/self-test code abort on unlocked hardware: unlocked units are treated as non-production
- **ssh_console_gates:** run_sshd.sh: dropbear (-R -F, ecdsa host key at /jffs/persist/ssh/dropbear_ecdsa_host_key, client keys /jffs/sys/debug/ssh/authorized_keys (the /ssh/authorized_keys form target) is init-respawned BUT blocks on 'waitwhiletrue \[ ! -f /tmp/device_unlocked_flag \]') SSH only serves after device unlock. secure_console_login.sh similarly gates the ttyS0 getty on /proc/sonos-lock/console_enable == '1' (secure-boot console lock), then secure_console.sh does 'login -f root' auto-login: serial console is root with no password once the proc lock is lifted; absent on pre-secure-boot players (console disabled by other methods).
::: details Evidence (4)

- @ 0x10f00014; /devunlock endpoint literal
- @ 0x10f00020; 'Too Many Unlocks' rate-limit page
- @ 0x10efff88; /tmp/device_unlocked_flag
- @ 0x10efffb0; DevUnlock page → Rebooting...

:::


:::

## `devicecertmanager`

**coverage** `partial`

The manager that downloads and refreshes the device cert from the cloud: ETag-cached GETs, metadata records (requestTimeMS, downloadStatusCode, previousETag), 'downloaded' vs 'unchanged' outcomes, and a scheduled refresh job when metadata is unknown. This is how a player's identity cert survives factory refurbs and re-enrollment. Where the cert files are storage, this is the brain: tracking issuance, scheduling renewal before expiry, and deciding which certificate is currently active.

::: details Technical details

ETag-cached downloads; metadata {requestTimeMS,downloadStatusCode,httpResultCode,previousETag}; outcomes {downloaded,unchanged}; "Cert download attempt finished"; "Unknown cert metadata state: %s. Scheduling cert refresh job."; error taxonomy {BAD_FILE,BAD_KEY,BAD_CERT,BAD_ISSUE_DATE,MISMATCH_ENV,MISMATCH_ISSUER,MISMATCH_HHID,MISMATCH_USER,not_present}; headers {X-Sonos-Muse-Household-Id,X-Sonos-Denylisted}; "Retrieved manufacturing data: %s"; files generated lazily "file not available yet, generating"

- **name:** device cert download manager
::: details Evidence (1)

- @ 0x10ef2224; devicecertmanager block

:::


:::

## `diagnostics`

**coverage** `partial`

The distributed diagnostics engine: builds a DiagnosticManifest (v2.0.0), POSTs to `/v2/diags` on product-diagnostics with serial_num, distributes a diagId to every player, triggers per-device collection, and gathers the results. `submitDiagnostics` in the app is the front door to this pipeline. The /status website, the log collection behind 'submit diagnostics', and the support-bundle assembly all live here.

::: details Technical details

manifest <DiagnosticManifest attrs> ver 2.0.0 → POST /v2/diags product-diagnostics; init body {"serial_num":"%s"}; fields {quarantined,secreg,swversion,ZPSupportInfo,ZPInfo,LocalUID,IPAddress,SoftwareVersion,QuarantineReason,StubReason,ZPNetworkInfo}; coordination: distribute diagId to players, trigger diag on controllers, collect submit statuses ("Timed out waiting"/"All devices reported"); files {manifest.xml,%s.xml,%s.sha256,%s.xml.gz}; modes {Diagnostic stub,Local diagnostic}; local aggregate http://localhost:%u/support/aggregate?type=%s&f=%x&e=%x; diag_progress var; counters Num players/Num stubbed players; orchestration detail: 'Failed to generate hash on Stubbed Support Document'/'Failed to serialize hash on Stubbed Support Document','%s for %s submit error: confirmation guid (%s) doesn't match actual guid (%s)' (submit-confirmation GUID check); eventloop lifecycle 'Eventloop stopped.','Eventloop has no more work to do.','Eventloop shutdown. Cancelling watchdog.','Eventloop failure!'; pDiagProgress member

- **name:** distributed diagnostics
- **coordinator:** DiagMgr: types {Healthcheck,Feedback,ExtraLocal,Diagnostics}+diag_metadata; ops {submitQueuedDiagnostic,SubmitDiagnostics}; queue bounds {"submission queue full","result queue full"}; params {includeControllers,initiatingDeviceId} fmt %s%hu; delayed "triggered ... for %us from now"; results {unrecognized status,Failed to update status,failed-other submission in process,unsuccessful-no devices submitted,successful}; completed log "submissionId: %s, status: %d, diagnosticId: %d"; zpDiagSubmit+tracking+diag_mgr vars; <ZPNetworkInfo type = 'User'> + <!-- START/END UUID: %s --> markers + " unreachable"
::: details Evidence (1)

- @ 0x10f05460; certmanager block diag region

:::


:::

## `didl_extractor`

**coverage** `partial`

The metadata-document extractor: it pulls Sonos's extra fields out of track descriptions, including internal IDs, radio names, track gain, chapter numbers, ad markers, stream content, and podcast or audiobook typing. It's how the player reads the rich details inside each catalog entry.

::: details Technical details

rincon md fields {tiid,radioName,connotation,state,trackGain,chapterNum,chapterCount,linkUrl,isAd,streamContent,audioInputIcon,radioShowMd,streamInfo,rating,policies,podcast,episodeNumber,releaseDate,narrator,albumArtist,numSections} + upnp {originalTrackNumber,album}; classes {object.item.audioItem.podcast,.show,.audioBook.chapter,.musicTrack.recentShow}; loadFromExtraMd(trackURI,extraMd); extractMimeTypeFromHttpContentType (trunc/mtParams errors); protocolInfos {http-get,rtsp-rtp-udp,x-sonos-vli:*:audio:*,x-rincon-queue:*:*:*}; " duration=" attr; &#10; newline; -yYy- marker; additional rincon-md names: author, authorId, book, bookId, contentService, displayTitle, http, isCompleted, mimeType, narratorId, ordinal, podcastId, producerId, resumeOffsetMillis, resumeTrackId, showSecondsRemaining, summary, tags, resMD, room, playmode, description, type (audiobook/podcast resume+identity fields: bookId/podcastId/narratorId/producerId/resumeOffsetMillis/resumeTrackId/isCompleted/showSecondsRemaining); element set {DIDL-Lite,item,container,res,desc,vli}; queue URN urn:schemas-sonos-com:metadata-1-0/Queue/; fault URNs urn:schemas-upnp-org:control-1-0|UPnPError + |errorCode

- **name:** RTrackDIDLLiteMdExtractor: track DIDL parser
- **uri_service_map:** {x-rincon-mp3radio,x-rincon-internal,x-rincon-buzzer,sonos.com-{hls-static,hls-radio,hls-aac,rtrecent,spotify,http,mms},x-sonosapi-iqradio,audio/x-sonos-recent,pandora.com-{pndrradio-http,pndrradioad},real.com-{rhapsody-direct,rhapsody-http-1-0},sirius.com-sirradio,last.fm-radio-http,https:,file:,rhap:,radio-{rhap,radea,npsdy}:,pndrradio-http://,pndrradioad://,lfmtrack:,x-sonos-dock:,hls-static://}
::: details Evidence (1)

- @ 0x10ecc67c; didl extractor block

:::


:::

## `drm_content_keys`

**coverage** `partial`

The content-key path for protected audio: for services that deliver encrypted content, this handles the key material that unlocks it, including the playback-ID header services use to correlate a playback with the device that requested it. A necessarily careful component.

::: details Technical details

skd://itunes.apple.com/P{pid}/s1/e1 StoreKit URI; "duplicate content key entry detected from ContentKeys"; X-Sonos-Playback-Id: %s header; "getDeviceAuthToken was called for %s (%u), which has credentialType = %u (not OAuth)"

- **name:** DRM content keys + playback-id header
::: details Evidence (1)

- @ 0x10f1032c; drm block

:::


:::

## `dropout_logging`

**coverage** `partial`

The dropout-event telemetry: tracks group-role changes, corrected-context changes, and presentation-time conditions; slots events into a bounded list with per-condition increments ('set pt reached', 'pt in fut - inaud'). This is the data behind 'why did my music skip' support queries. When music stutters, this is what noticed: it records where and when gaps happened so diagnostics can explain the dropout.

::: details Technical details

triggers {corr ctx chg evt type %u,grp role chg evt %u->%u,clear/set cid src=%u,set/reset pt}; slot model {clr slot,slot in use skip incr,set slot %zu idx %zu to %s,no space in list}; conditions {set pt reached,flag report at %zu sbmt,set pos aud,pt in fut - inaud,GCI but no CID}; per-ch incr "incr call: %s, %zu, %zu, ch %zu, %d.%06d"; fields {inputType,SatChCount,HtsnkVersion,msAfterPt,GroupRole,GCTimeValid,GCTime,btRole,submit}; counters {htsnk_missed_total,htsnk_missed_duration_total,htsnk_late_total,htsnk_strm_reset_duration_total,htsnk_strm_silence_duration_total,htsnk_strm_plc_duration_total}; reasons {chsnk_lse,chsnk_ch_data_full,chsnk_w_err,chsrc_framer_uflw,htsnk_invld_sntp,htsnk_late_frames,htsnk_missed_frames,htsnk_time_backw,htsnk_stream_err,htsnk_stream_uflw,htsnk_stream_reset_duration,htsnk_wrong_frame}; bt_audio + injectdropout test cmd {"missing dt param","Injected dropout error"}; "Sat chs %zu"/"Sat htsnk ver %u"

- **name:** DropoutEventHandler: dropout telemetry
::: details Evidence (1)

- @ 0x10ebe644; dropout handler block

:::


:::

## `dsp_files`

**coverage** `partial`

The signal-processing file inventory: the EQ data files, preset files, and per-variant processing binaries shipped in the firmware image. These are the tuning tables and parameter blobs the signal-processing stage loads, which is the data side of how this model is voiced.

::: details Technical details

files {eqdata.txt,app/debug/dsp,persistentEQ.xml,/dsp/eqdata.txt,dsp_preset.xml,dsp_preset_default.xml,dsp_preset_satellite.xml,dsp_system_default.bin,dsp_system_satellite.bin,satellite_processor.bin}; sonar-tone flush {"flushing sonar tones","Flushed"}; htdocs_locked; "modZPAmpTimer() called"; "unable to delete %s even though it exists"/"successfully deleted %s"; settings {ZPLocalSettingsFile,ZPExpirationTime,ZPGroupExpirationTime,ZPForcedUPnPExpirationTimeout,ZPMusicServicesBackstop,ZPTimeZonesBackstop}; "Setting JFFS root to %s" + ServerRoot + ContinueAfterIPChange + #GROUP_NAME# + "Failure generating group description xml"; loader domain dsp_file_loader: 'DSP file path is longer than buffer %zu: %zu','unable to open file %s','file was not opened. Cannot read %s','output buffer is not a valid pointer','Could not get size of file: %s','getFileSize cannot get file size before opening: %s','Invalid channel map: (%s)','setNumChannels(%d) greater than max (%d).','Invalid string format. Requires x.x.x.x, provided %s','Unable to parse version from end string %s','Unable to parse version from start string %s'

- **name:** DSP preset/system files + settings
- **unlock_dsp_console:** opt/htdocs_locked/dsp/{configDSP,meters}.{htm,css,js} (unlock-gated live DSP console (served via /tmp/htdocs_locked). Exercises the real DSP routes: GET /getDSP (bare = all-block dump, ?audioSystemsTuning, ?ChProcSysPlaybar.ChProcInputMeter, ?<BlockName>, ?<meterId>), POST /putDSP (form pairs 'Block.param=val -- '), GET eqdata.txt + ChProcInputMeter.xml + getDSP_{3,playbar}.xml (static block descriptor XML). Param grammar 'Block.param') ChProcSysPlaybar.ChProcInputMeter, BassManager.mode, active_iir, allpass1.a{0,1,2}/b{0,1,2}/type/bandpassQ, freq '700', gain '0.707', AB_indicator/ab_control preset-compare. Confirms /getDSP returns per-block param XML and /putDSP takes dotted-name writes: the same dotted namespace as the DSP param registry.
::: details Evidence (1)

- @ 0x10e7390c; dsp files block

:::


:::

## `dsp_ht_engine`

**coverage** `partial`

The full home-theatre audio configuration surface: surround and subwoofer state, downmix mode, dialog enhancement, autoplay silence thresholds, and a large per-zone audio record covering everything from balance to sub crossover to tuning status. Bass management, channel mixing, and delay alignment across bar, surrounds, and sub all happen here, which is the processing that makes a rig sound like one system.

::: details Technical details

home-theatre DSP parameter surface + per-zone audio state schemas fully recovered: HT config XML (surround/sub/downmix/dialog/AI-speech/height levels, autoplay/autostop thresholds, Tweaks bitmask), 37-field per-Zone audio XML, zone volume/duck XML; R_MASK_* speaker layouts enumerate supported channel masks; nanopb validation: 'volume (%i) and gain (%i) lengths differ in bonded volume breakpoints','default (%i) and bonded (%i) volume breakpoints differ'; dsp_asrc block

- binary anchors: `SubCrossover`, `DialogEnhancementLevel`, `AISpeechEnhance`, `/htconfig`, `R_MASK_NINE_DOT_ONE_DOT_FOUR`, `<DialogEnhancementLevel>`, `<SubCrossover>%dHz</SubCrossover>`, `<GainTrimDB>`, `<Tweaks>0x%08X</Tweaks>`

- **ht_config_xml:** <Version><SurroundState><SubState><GMDownMixState><DialogEnhancementLevel><AISEDynamicLatency><AISpeechEnhance><MusicSurroundLevel><TVSurroundLevel><HeightChannelLevel><AutoPlay><AutoPlaySilenceThresh><AutoStop><AutoStopSilenceThresh><NightMode><SurroundMode><Tweaks>0x%08X<PrimaryEthernet><WirelessEnabled>
- **zone_audio_xml:** <Zone><IsSatellite><Volume><GainTrimDB><SPLdB><LoudnessSPLdB><LoudnessScaling><BassLevel><TrebleLevel><LoudnessEnabled><StereoPairEnabled><IsOnLeft><BalanceInitial><Balance><LeftMute><RightMute><HeightLevel><HeightLeveldB><NumBondedSubs><BondedSubModel><SubwooferEnabled><SubwooferJackConnected><DRCVolumeScaling><NightMode><DialogEnhancementLevel><TrueplayEnabled><SubLeveldB><InvertSub><ConstrainSubLevelToVolume><SubDefaultInversion><SourceGainOffsetdB><MusicSurroundLeveldB><TVSurroundLeveldB><FullSurroundMode><PlaybackStreamSampleType><MonoMode><SubCrossover>NHz</SubCrossover><SpeakerSize>
- **zone_volume_xml:** <Zone><UnscaledVolume><Volume><DeferredVolume><Ducked><DuckingVolume><DuckingPercent><OverrideVolume><Muted><DeferredMute><ExtSrcVolume><SurroundLevel><ZoneChannelCount>
- **channel_masks:** R_MASK_THREE_DOT_ONE, R_MASK_FIVE_DOT_ONE, R_MASK_FIVE_DOT_ONE_DOT_TWO, R_MASK_SEVEN_DOT_ONE, R_MASK_NINE_DOT_ONE_DOT_FOUR, R_MASK_UNSPECIFIED: Atmos-era layouts compiled in
- **rc_params:** hidden RenderingControl EQ-param tokens driving this layer: SubGain, SubCrossover, SubPolarity, SpeakerSize, VolumeScalingFactor, FV*/FVPXY fixed-volume forms
- **preset_param_layer:**
  - **status:** confirmed
  - **summary:** DSPPresetManager: named versioned presets applied to blocks ('found and applying preset %s with version %s','applying preset %s to block %s','--- Available Presets ---','adding preset with name %s and version %s','apply preset: Couldnt find preset %s','getNumBlocks: Couldnt find preset %s','getPresetVersion','getNumParams: Couldnt find block: %s in preset: %s'); 'overriding invalid filter coefficients'. Modes 'none, solo, mute' + 'No valid mode for string %s'/'setMode failed due to unknown mode %d'. Block metrics 'CPU Percentage','Block Interval msec','Peak time msec'; debug blocks DebugGainLinear_%d ('debug: channel number not found in parameter name, probably an old version').
  - **chproc_config:** ChProcConfig protobuf: per-model satellite files S39_fronts_chproc_config.binpb, S41_fronts_chproc_config.binpb ('Could not load and parse satellite protobuf file'); 'Successfully decoded ChProcConfig','ChProcConfig file is empty','Unable to open ChProcConfig file %s','Bonding preset "%s" not found in ChProcConfig','Orientation preset "%s" not found in ChProcConfig','No default sub configuration found','No gravity sub configuration found, using default','No default orientation configuration found','HTChProcConfig conversion successful'. Sonar mode 'enterSonarCalibrationMode - invert sub polarity is %s'/'exitSonarCalibrationMode','Sonar Calibration Id','number of sonar channels exceeds max'.
  - **params:** Param vocabulary: 'Sub bonding gain dB','source gain offset dB','source boost atten dB','Ch %zu %s Surround Level dB','Ch %zu %s Player type offset dB','Ch %zu %s Surround distance offset dB','inputChannelMap','input meter: %d,...','ThermalLimiter','ForceSampleTypeTV','unsupported videoDeltaEQ coeffset type','rbj shelving bandpass','passthrough_70Hz','AntiAliasEqLFE','ChProcInputMeter','ChProcOutputMeter','ChProcSysNoDSP','MasterSysPlaybarNoDsp','MasterSysPlaybar','DSPSystemAudioStream'. Volume bounds '\[%s\]: setMaxVolume: New max %f is below min %f','\[%s\]: setMinVolume: New min %f is above max %f'; override layer 'system/overrideOffsets','\[%s\]: Setting TTS offset override to %f dB','\[%s\]: Setting AF offset override to %f dB','\[%s\]: Setting Normalization  Gain to %f dB','\[%s\]: Setting gain offset to %f dB','\[%s\]: Setting normgain to %f','\[%s\]: Overriding TTS and AF TV offsets','\[%s\]: sourceBoostAtten is %f dB','\[%s\]: Setting subwoofer Active to %s','\[%s\]: setVolume volumedB = %f','\[%s\]: My stream sample type is \[%s\]','\[%s\]: Playback stream sample type is \[%s\] and my stream is \[%s\]'. Guards: 'illegal channel count (0).','exceeded max channels: %zu vs %zu','Unsupported Sampling Rate: %d Setting it to Default: 44100.','Bassmanagement Filter sample rate incompatible with DSP SampleRate','unsupported nsdStatus value %d.','Block to tap not found under %s', 'mpted to add null block to %s','not enough space to add subblock to %s','getBlockByID Null subblock: %s'.
  - **path_validation:** preset/config path-validation ladder: 'Failed to validate system custom path','Failed to validate custom preset path','Failed to validate default %s override path %s','Failed to validate default %s satellite flex path %s','Failed to validate default %s satellite path %s','Failed to validate default %s path %s','Failed to validate all system paths','Failed to validate all preset paths': five per-model path classes (custom system, custom preset, default override, default satellite-flex, default satellite, default) each validated before load; apply gates 'Auto update is disabled, not applying \[%s\] config' and 'putDSP disabled on %s, skipping'; user-facing toggle strings 'Loudness enabled','Trueplay enabled','Subwoofer enabled','Night mode enabled'
- **block_inventory:** DSP block names (dsp blocks as instantiated): {DynamicHighPass,ExcursionCtrl,ExcursionControl,ExcursionLimiter,Excursion_Model,Excursion_Limiter,BassSum0-5,BassManager,SUBBassManager,PlaybarLimiter,Limiter,SoftClip/Softclip,ClipMeter,OutputGain,MasterSysMeter,RoomCalDelay{MidLeft,MidRight,MidCenter,TwtrLeft,TwtrRight,TwtrCenter,Bass},SonarSpatialProcessing,Downmixer,SmoothMultiGain,RampMultiGain,Upmixer,LegacyUpmixer,ThreeDUpmixer,RemoteBufferSwitch,DynIIRBlock/dyniirblock,RampIIRBlock,XFadeIIRBlock,IIRXFader(IIR_A,IIR_B),XFadeRampIIRBlock,XFadeTwinIIR/xfadetwiniir,active_iir,rampiirblock,dsp_iirblock,dsp_limiter,dsp_downmixer,dsp_splitter,dsp_mixer (WeightedSum),BlockDelayLine,hdsp_array,_wfir,MeterPeak,MIPSBurnerMeter,DotProduct,Sine,WhiteNoiseRPDF,AudioStreamGains}; DynamicHiPass sub-blocks {DynamicHiPass_SldgHiPassFilter,DetectorFilter,MeterA/B/C/D,ExcursionA/B,MeterExcursionA/B,VarNotchFilter,VarNotchDetFilter}
- **block_params:** per-block param vocabularies. BassManager {RampTimeSec,MinBassGaindB,MaxBassGaindB,EnergyEpsilon,DefaultGain,FixedBassGaindB,'Time constant (sec)',UseFixedGain,CurrentBassGaindB,EnergySumBassManager}; per-channel filter naming %s_{Xover,SumBass,LRXover,CXover,MixL,MixR,LRBassSum,LRCBassSum,Lowpass,Highpass,BassSum,CorrFilter,BassGain}; DRC/voice {compression,dialogEnhance,volumeScalingRatio,dialogRefLeveldB,DRCVolumeSPL,sourceGainOffsetdB,detectorLevel,targetGaindB,DRCDetectFilter,DRCMeter,DRCSmoothGain,DRCVoiceBoost}; SonarSpatial {BypassMode,_RoomCalGains,_PassThruPanGain,_RoomCalPanGain,'invalid channel specified in SonarSpatial\[ setGain\| getGain\]'}; limiter {rampLength,smoothedGain_TCsec,channel_%d_{threshold,attack,release,gain,smoothedgain},threshold,attack,release}; downmixer {runDownmix,runLimiter,downmixForSub,scaleFactordB,volNormSteps,SourceGainOffset,'Sum of linear downmix gains for one output channel: %f (%f dB)','Scale factor %f dB rounded down to %g dB (%f)','nOutputs %zu != NUM_OUTPUTS %d','Error: Unsupported number of downmixer inputs: %zu'}; multigain {targetGaindB_%zu,targetPhase_%zu,currentGaindB_%zu,currentPhase_%zu,gaindB,phase,gaindB_%zu,phase_%zu,TimeConstant,targetPhase,'inverted, normal','multigain: channel number not found in parameter name, probably an old version','multigain: skipping non-existent channel %d in %s'}; upmixer {musicMode,surroundsRequested,rearSurroundsRequested,localChannelMap,satelliteChannelMap,fullRangeSurrounds,'Running upmix','Upmixing surrounds','Atmos music center upmix',centerSideMidCoef,frontBackMidCoef,leftRightMidCoef,centerSideHighCoef,frontBackHighCoef,leftRightHighCoef,current GainC mid/hi,EnergyDistributionExponent,{Music,Video,AtmosMusic}GainC{Min,Max}{Mid,Hi}Freq,VideoGainFBMin/Max,{width,depth}{Music,Video}{Mid,High},centerSideExponent,fullModeStereoScalingdB,musicSurroundDiffRatiodB,videoSurroundDiffRatiodB,'bypass mode',vmix_g%zu_%zu_%s_%s + vmix_g + vmix_g%d_%d,Upmixer_{Xover,DetectHighpass,SurroundDelayL,SurroundDelayR,SurroundFilter},UpmixDeltaEQ,CenterUpmixEQ,CenterUpmixDiscreteBlend,Upmixer_DebugMeter,Upmixer_Debug_Gain}; ExcursionCtrl {SlHP {Dynamic,Smooth},'EB notch {Dynamic,Smooth}','Swap filter run order',Sldg HP/EB notch Action Thresh,'LF/EB allocation, dB',Max/Min Freq,'Freq Up/Down Rate (Hz/sec)','Max/Min EB Cut','EB Cut More/Less Rate','Meter RMS TC, ms','Local Block Size',Sldg HP Q,'EB notch {freq,Q}','EB detector Q',Present SlHPFreq,'Present EB notch depth','Enable ExCtrl','Excursion gain',meters meter_{intermediate,final} Excursion \[Input Signal\|Input Volts\],max excursion,meter_{cutoff,notchdb,HpActionLevel,HpActionLevel_vs,EbActionLevel,EbActionLevel_vs}}; ExcursionLimiter {'Max Excursion mm','Bass delay','Target Excursion, mm','Excursion Filter Gain','RMS Time Constant, sec','Limiter Attack/Release, msec','Minimum/Maximum Cutoff, Hz','Stage 0/1 Q','Cutoff Attack/Release, msec',ModelGain,BassDelay}; ClipMeter {Ymax,Xmax,'Threshold dB','Absolute Threshold dB',MeterAttackSecs,MeterDecaySecs}; AudioStreamGains {gainOffset/normGain/volume/'balance left'/'balance right' {gain dB,target gain dB},'gainOffset gain dB ch %zu','gainOffset target gain dB ch %zu'}; meter/sig-gen {AttRel,'Attack ms','Release ms','AttRel, Peak',FollowMode,'TCMS ms','reset peak',peaklevdB,'Decimation Factor','num Iterations',levlinear,MeterPeak,MIPSBurnerMeter,DotProduct,Sine,WhiteNoiseRPDF,'Sig Level dB','Pass Level dB','Time Constant ms','Sine, WhiteNoiseRPDF','Signal Type','Output Mask' (bitmask '0x00000003, 0x0000000c, 0x00000030, 0x000000c0, 0xffffffff'),speaker_mask,'Speaker mask variant %d not valid'}
- **iir_machinery:** coeff-set machinery (dsp_iirblock + XFade variants): bounds errors {getFilterCoeffs,getTargetCoefSection,getCoefSection,setCoefSection,copyIIR} all 'Set %d or section %d out of range for %s'; naming chan_%zu_set, coeffset_desc_%d, set_%s, section, filter_%d_%d, coeff dump '%8x, %8x, %8x, %8x, %8x'; setters %s_setCoeffSetMap 'invalid coeff set %d for channel %zu'/without channel, %s_setCoeffSetName 'coeffset description set number out of range', setBlankSonarCoeffs/blankSonarEQ + 'received coefficient set'; iirblock error family {'filter_set_section or coeffset_desc_set format not found','filter set number not found in parameter name','filter section number not found in parameter name','filter set %d or section %d out of range','IIR filter missing/invalid coefficients','IIR filter type %s not supported','IIR filter type %s given %d parameters','set number not found in coeffset description parameter name','channel index is not in limits. provided idx %d, max idx: %zu','channel index is not a number','set index is not in limits','set index is not a number'}; xfade FSM 'transition concluded at state %d' + 'startTransition \[%d\] from stateCur:\[%d\] and stateNext:\[%d\]'/'from stable state:\[%d\]', 'applying putdsp coeffs to %s','setSmoothBypass \[%c\]', 'Invalid dynamic frequency cutoff, will set to minimum of 0.'; BlockDelayLine {currentDelay,maxDelay}; status XML <SelfTrueplayEQ>, <SelfTrueplayInfo><FreshestFilterBank>%s</FreshestFilterBank>, dumpSonarEQInfo
- **config_builder:** dsp_config_manager/dsp_config_parser/dsp_builder: init guards {'DSPControl is NULL cannot initialize','DSPSystem is NULL cannot initialize','no config file present'}; load {'Loading preset config %s','Building paths','default preset file could not be found','Problem populating file contents','Problem loading preset xml file (%s)','applying \[%s\] config from file %s','%s Preset not found','Parser Error','Could not open (%s)','applying \[%s\] config from loaded contents','using preset pre-load but did not find %s in %s','Preset name too long! %u: %zu'}; preset-name grammar: base_%s_%s joined with variant suffixes {orientation_horizontal,orientation_wall_above,orientation_wall_below,orientation_vertical_tag_left,orientation_vertical_tag_right,orientation_wall_mounted,sub_bonded,sub_unbonded,stereo_paired,stereo_unpaired,hardware_type_1,hardware_type_2,during_trueplay_calibration,_satellite,_flex,_default,_system,_preset}; builder paths 'Constructed {Override,} {System,Preset} \[Flex\|satellite\] Path: %s' 8 forms + 'Not Enough Information to build %s path' + 'DSP Builder initializer is Empty! Can't build system/preset' + 'DSP file Path is empty'; hdsp_array multi-config loader {'running block before finalizing load','Array File Found: %s','setting io buffs before finalizing load','nConfig out of range','incorrect number of taps or channels: nTaps: %d nWfTaps: %d','attempting to select/load config in system that doesn't allow multiple configurations','configuration file missing','Coeff text length in XML file exceeds allocated size','%s/app/debug/%s'}; arrayDef fields {Array,numChan,numTaps,arrayDef,weights,alphas,delays,delayUnder}; config identity fields {currentConfig,digest,digestibility,descriptability,dateness,_PassThruSum,_Delay}
::: details Evidence (8)

- @ 0x10e878fc; SubCrossover
- @ 0x10f25449; DialogEnhancementLevel
- @ 0x10f254a7; AISpeechEnhance
- @ 0x10e75d58; /htconfig
- @ 0x10fbedfa; R_MASK_NINE_DOT_ONE_DOT_FOUR
- @ 0x10f253d8; HT config XML schema (24 fields incl. Tweaks bitmask)
- @ 0x10feabd8; per-Zone audio XML schema (37 fields)
- @ 0x10f2b138; Zone volume/ducking XML schema

:::


:::

## `dsp_params`

**coverage** `partial`

The runtime signal-processing parameter surface: dynamic-range boost, speaker angles, virtualizer mode, bass extraction, and per-mode profiles, with a 'load defaults' fallback when config is missing. These are the actual coefficients and settings the audio processing applies, tuned per model.

::: details Technical details

errors {error parsing mode state,error parsing bass extraction mode,error parsing dap profile mode}; /drc {boost}; /staticparams {speakers,directdec,virt_mode,frontangle,heightangle,rearsurrangle}; /dynamicparams {oarBassExtraction,dapCutOff,hfilt,post,vlamp,vmcal}; "Config %s not found, loading default" + /default; iirblock params {HoldTimeSec,PassThruGain}

- **name:** /drc /staticparams /dynamicparams
::: details Evidence (1)

- @ 0x10fe6a4c; dsp params block

:::


:::

## `dts_decoder`

**coverage** `partial`

The DTS decoder: supports the profile family from Digital Surround through ES, 96/24, HD-HRA, HD-MA, and Express, with careful sync detection and status reporting. The second surround format the Playbar can decode alongside Dolby.

::: details Technical details

profiles {Digital Surround,Digital Surround 96/24,Digital Surround ES,High Resolution Audio,HD-MA,Express,Unknown DTS profile}; sync "Endian-Check: Unexpected Input Syncword Error"; "invalid dcadec audio mode, returning empty speaker layout"; status <BitDepth><DTSProfile><BitRate><NumPrimaryChannels><AudioMode><DialNormGainDB><ChannelMap>; errors {invalid sample size N-bit,encoded frame exceeds maximum,packet parse,frame 0 warning,unsupported sample freq,unsupported amode}; modes {Dual Mono,Stereo}

- **name:** dcadec: DTS decoder
::: details Evidence (1)

- @ 0x10fe7670; dcadec block

:::


:::

## `ducking`

**coverage** `partial`

When a speaker needs to quiet the music for something urgent like a voice reply, a chime, or a page, the players agree on it over a ducking protocol. The requesting player raises a flag, others dequeue it under a lock, and expired requests are cleaned up so a stray duck can't leave a room muted. This is why a chime can be heard over music without stopping it, and why the whole group dips together and recovers together.

::: details Technical details

duck.cxx inter-player ducking protocol: 64-bit ducking flags queued per-source ('Queueing ducking bit from %s 0x%016llx - %d', 'zone %d received ducking bit 0x%016llx - %d', 'too many pending ducking bits', 'Dequeueing ducking bit 0x%016llx'), tracked under duck_tracker_mtx with expireRemoteDuckingFlags + runDuckingHeartbeat (a liveness heartbeat that expires remote duck flags); commands forwarded to members ('failed to forward duck command %s to %s'). Policy gates on the request path: 'ducking globally enabled/disabled, honoring/dropping duck req', 'voice enabled device, dropping muse duck request', 'failed to acquire gc/avt, honoring duck req', 'playing tv, drop duck req'; muse ducking policy setting ('muse ducking policy: %x -> %x', key R_MuseDuckingPolicy) + fastvolduck/duckOrUnduck paths; 'process ducking flags 0x%016llx -> %s' + 'Ducking flags unchanged. No update to send.'; DUCKING_LOCAL_MUSE bit auto-cleared by timeout ('WARNING: DUCKING_LOCAL_MUSE cleared by timeout'). Evented XML <PlaybackDucked>%u</PlaybackDucked> + <DuckingFlags>%s</DuckingFlags> + DuckingEvent + isDucking + RecordDuckingActionEvent telemetry. Alert/chime layer: alertContent loop player ('alertContent: %s no read source', 'could not open default content for %s', 'default interrupted %s', 'completed default loop \[rclS:%lld\]'), household chimes ('playing join household chime', 'stopping/ramping down discovery chime', JOIN_CHIME_UNAVAILABLE/REGISTRATION_CHIME_UNAVAILABLE), transport restore after chime ('restoring after {pause,stop,end} chime: ret=%d ar=%d wrca=%d pavt=%d'), AUDIOCLIP/ALEXA_ALERT clip types, spotify:interruption: URIs, muse audioClip resource + /duck//unduck endpoints + v1/players/%s/playerVolume/{duck,unduck} outbound fan-out.

- **name:** duck.cxx: group ducking engine
- **forward_targets:** Duck-command forwarding targets are selector strings 'FV:GC' (forward to group coordinator) and 'FV:GC-HB' (forward to coordinator's bonded peer(s)), beside peers 'all secondaries', 'group coordinator', 'bonded peer': NOT favorites URIs despite the FV: prefix. Logs: 'Forward %s %d to %s %s' / 'failed to forward duck command %s to %s.' (duck.cxx 0x10ebf2xx block).
::: details Evidence (1)

- @ 0x10ebf1a4; duck.cxx

:::


:::

## `effective_settings`

**coverage** `partial`

Effective-settings resolution: it computes the setting value actually in force after layering defaults, household values, group values, and device overrides. This is the machinery behind the effectiveSettings API surface.

::: details Technical details

routes v1/players/{playerId}/effectiveSettings{,/{groupName}} + household variants; verbs {getAllSettings,getSettingsGroup groupName,updateAllSettings,updateSettingsGroup groupName}; /settings/api/v1/locations/%s/effectiveSettings{,/%s}; keys {isEffectiveP2PPolicyEncrypted,effectiveSettingsDataChanged,patchEffective*,playerSettingsEvent}; "\[Mg\] getEffectiveSettings() bad groupId \[%u\]"; "\[Mg\] internalReadEffectiveValuesLocked_jsonValue(%s) bad keyId %u \[grkId:%u|end:%u\]" (key-id store)

- **name:** effectiveSettings muse resource
::: details Evidence (1)

- @ 0x10e7ceb8; effsettings block

:::


:::

## `embedded_sqlite`

**coverage** `partial`

A bundled SQLite database library is linked into the program, and several subsystems keep structured state in it, including the timer and alarm store. The library index and various registries lean on this embedded database rather than flat files. Which tables exist and where the database file lives is still unmapped.

::: details Technical details

embedded libsqlite3 (sqlite3_open_v2/prepare_v2/step/bind_*/column_*/exec/busy_timeout) backs LocalTimer persistence in timer.db (the alarm/sleep-timer store; two tables with full DDL recovered verbatim | proven tables (timers_impl.cxx): timers(id TEXT PRIMARY KEY, trigger_time TEXT NOT NULL, total_duration INTEGER NOT NULL, triggered NUMERIC NOT NULL)) local/suspend timers (timers_impl.cxx) | suspend model: pause -> row in paused_timers w/ remaining_seconds+paused_utc_time; resume -> recompute trigger_time | libFLAC embedded codec: reference libFLAC 1.3.4 20220220

- binary anchors: `sqlite3_exec`, `LocalTimer from sqlite3`, `LocalTimer from sqlite3 stmt`, `libsqlite3.so.0`, `CREATE TABLE IF NOT EXISTS timers`, `paused_timers`, `timer.db`, `PRAGMA user_version`, `LocalTimer`, `remaining_seconds`, `paused_utc_time`

- **users:** LocalTimer store (timer persistence across reboot); the full table inventory is unmapped: imports suggest prepared-statement CRUD, no bulk exec-heavy workload
- **schema:** CREATE TABLE IF NOT EXISTS timers(id TEXT PRIMARY KEY,trigger_time TEXT NOT NULL,total_duration INTEGER NOT NULL,triggered NUMERIC NOT NULL); plus a paused_timers table queried as (id, remaining_seconds, paused_utc_time, total_duration): paused timers freeze remaining_seconds + the UTC pause instant
- **ops:** SELECT id,trigger_time,total_duration,triggered,rowid FROM timers \[WHERE id=?1\]; SELECT count(*) FROM timers; same pair for paused_timers; PRAGMA user_version used for schema versioning
- **notes:** 'LocalTimer from sqlite3 stmt \[%s\] FAILED %d %s' / 'from sqlite3 stmt timer': row→object hydration; filename timer.db
- **tables:**
  - **timers:** id TEXT PRIMARY KEY, trigger_time TEXT NOT NULL, total_duration INTEGER NOT NULL, triggered NUMERIC NOT NULL: local timers, suspend-aware (timers_impl.cxx @0x10edcf88)
  - **paused_timers:** id TEXT PRIMARY KEY, remaining_seconds INTEGER NOT NULL, paused_utc_time TEXT NOT NULL, total_duration INTEGER NOT NULL: timers parked during suspend; resume recomputes trigger_time from paused_utc_time+remaining (timers_impl.cxx @0x10edd018)
::: details Evidence (6)

- @ 0x1006282c; sqlite3_exec
- @ 0x10edd644; LocalTimer from sqlite3
- @ 0x10edd644; LocalTimer sqlite3 statement failure log
- @ 0x10edcf88; timers table CREATE TABLE DDL, verbatim
- @ 0x10edd38c; paused_timers SELECT (remaining_seconds,paused_utc_time)
- @ 0x10edd464; timer.db filename

:::


:::

## `enet_stats`

**coverage** `partial`

Ethernet port telemetry: `<EnetPorts>` XML with per-port link/speed, EthPrtStats counters (rx/tx packets/bytes/errors/drops/multicasts/collisions), and deep EthIntrf detail (CRC, frame, FIFO, missed errors). The `/enetports` and `/ethportstatistics` endpoints serve this data. The link status, throughput, and error counts it tracks feed the network diagnostics that explain wired-connection problems.

::: details Technical details

<EnetPorts><Port port='%d'><Link>%d</Link><Speed>%d%s</Speed></Port></EnetPorts>; EthPrtStats counters {rxPackets,txPackets,rxBytes,txBytes,rxErrors,rxDropped,txDropped,multicasts,collisions}; EthIntrf detail {lngthErr,ovrFlwErr,crcErr,frmeErr,fifoErr,missedErr,RxDtlErr,abrtErr,crErr,hrtBeatErr,wndwErr,TxDtlErr}; /sys/class/net/eth0 + eth%u

- **name:** ethernet port stats
::: details Evidence (1)

- @ 0x10ef3494; enet stats region

:::


:::

## `entitlements`

**coverage** `partial`

Sonos-side licensing: each account or household can carry entitlement records describing type, trial status, product tier, and date ranges. The runtime policy consults them, so for example a business-tier entitlement can change which features are offered. It's the record behind 'this feature isn't available on your system', covering subscriptions, flags, and regional eligibilities that apply here.

::: details Technical details

/entitlements/api + "using cloud URL: %s" + X-Sonos-User-Id header + cache {cache-control,etag} + "cloud entitlements: rc %d, http %d"; internals {savePendingEntitlementsLocked,entmt,"unable to fire internal changed event","calling notifyClients","triggering version changed muse event",entitlements_manager,entitlements_mgr,"failed to get valid userId","Failed to get Entitlements Cache","No valid HTTPCacheManager","entitlements for "%s" changed","scheduled job to consider updating Sonos Radio"}; "Insufficient buffer for header line \[%s\]"

- **name:** EntitlementsManager: cloud entitlements
- **consumers:** entitlements feed RRuntimeZPPolicy (ctor 'Cannot construct RRuntimeZPPolicy \[localSettingsMgr=%s,entitlementsMgr=%s\]' -- the runtime authz policy consults them); the SBiz entitlement gates Sonos Radio preinstall ('no SBiz entitlement; preinstalling Sonos Radio' vs 'found SBiz entitlement; blocking preinstall'); staleness triggers a refresh job ('stale entitlements; scheduling job to refresh'); on ENTITLEMENTS_CHANGED the old set is stashed for diffing ('stashed existing entitlements to compare later').; internal subscribe verb 'internalMuseSubscribeToEntitlements' wires the ENTITLEMENTS_CHANGED event into the muse event bus; cache lifecycle: 'TTLs updated on refresh (data is unchanged)' / 'cache re-populated on refresh' / 'Cache format unexpected'/'Corrupt Cache' -> cloud refetch; both Sonos Radio and Sonos Business MSP get a scheduled re-evaluation job on change ('scheduled job to consider updating Sonos {Radio,Business MSP}').
- **record_schema:** <Entitlements><Entitlement type="%s" isTrial="%s" sku="%s" startDate="%s" endDate="%s" codes="%s"/></Entitlements>: proven literal; entitlement = {type, isTrial, sku, startDate, endDate, codes}
- **known_entitlement_types:** type names present: SBiz (Sonos Business: the business-subscription marker; gates Sonos Radio preinstall + drives RRuntimeZPPolicy), businessCore, sonosRadio, controlChannels, restrictedAccess (capability keys co-located with the record schema). Field vocab: credentialTypeAllowed, allowGuestAccess, isTrial, startDate, endDate.
- **runtime_zppolicy:** RRuntimeZPPolicy (runtime_zppolicy.cxx) (the entitlement→policy gate engine. Emits <Policies> XML: {Business subscriber, Cloud Schedule, Effective P2P policy is encrypted, Guest Access Enabled, Unathenticated Control Enabled \[sic) binary typo\], Insecure UPnP Allowed, Auth Pin Set, Thor Timeout}. Policy state enum: UNDEFINED / ENABLED_AVAILABLE / ENABLED_UNAVAILABLE / DISABLED_AVAILABLE / DISABLED_UNAVAILABLE. CloudSettings JSON (eTag-cached, cacheStatus=get_status_fresh) supplies usageContext=BUSINESS + scheduledChangeValue + the actual gates: enableContentAccess, allowDirectControl, allowLineIn, allowAirplay: a business system can have its content access, local control, line-in and AirPlay disabled by cloud policy on a schedule. Change events: 'isBusinessSubscriber has changed' / 'Line In policy has changed' / 'Business Cloud Schedule has changed' -> 'Reevaluating runtime policies'.
::: details Evidence (1)

- @ 0x10ebf80c; entitlements block

:::


:::

## `esdk_events`

**coverage** `partial`

The embedded component's event layer: how the Spotify library reports state changes like connection, playback, and errors up to the player.

::: details Technical details

{EsdkPlaybackStats,EsdkPlaybackErrors,EsdkHttpErrors,EsdkDownload,EsdkEvent,EsdkCapabilities}; endsong {ms_played:%zu,"Overwriting EndSong track_id with new value!","no track ID/file ID: played:%zu, ms:%zu",intent (%s)}; evs {evs_default_cb %s. error %d,"Error encoding %s","Error encoding envelope","Error sending %s"}; channel hm://hwp-events/v1/log_event; "No file with desired bitrate"; error report "device_id=%s, playback_id=%s, track_uri=%s, source=%s, hostname=%s, url=%s, error_code=%d, stack_error_message=%s, stack_error_code=%d, response_status_code=%d"

- **name:** eSDK event telemetry (evs)
::: details Evidence (1)

- @ 0x10fe2c2c; evs

:::


:::

## `esdk_httpio`

**coverage** `partial`

The embedded component's web I/O: the network layer the Spotify library uses for its own web requests, which is how it talks to Spotify's servers.

::: details Technical details

tag eSDK/httpio + 3.205.205; {req_hostname,req_path,"Failed to format http request"}; response {"transfer-Encoding","unsupported transfer-encoding","CDN content-encoding unsupported","Redirect to %s","failed to parse or invalid content-range '%s' (req_offset:%d)","Content-Type: %s","bytes ","can't find HTTP headers end marker","invalid HTTP header, can't find protocol marker or status code","failed to find HTTP header line end marker"}; socketio {"%s operation timeout","failed to write/read data to/from socket '%i'","reached socket EOF"}; DNS {"Result for \"%s\": addr %s","Invalid address family %d","Failed for \"%s\", error %d"}; {"Unable to set the track info","Unable to set hostname","No domain in URL","No http/https in URL","Failed to decode LicenseResponse"}

- **name:** eSDK httpio layer
::: details Evidence (1)

- @ 0x10fe4a38; httpio

:::


:::

## `esdk_socket`

**coverage** `partial`

The embedded component's socket layer: the raw socket plumbing the Spotify library uses beneath its HTTP and protocol traffic, which is how it makes its network connections inside the player.

::: details Technical details

{"recv(%d, %p, %d) = -1 (errno %d: %s)","Socket close/getsockname/bind error: %d","Tried to use IPv6 but this platform does not support it.","connect(%d %s port %d)","Socket connection error: %d","Unable to set option:%d error:%s(%d)","Creating IPv4 socket (domain %d)","No free sockets available","Unable to create socket","Socket accept error: %d","Network initialization failed. error code: %d"}; DNS {"Failed DNS request for \"%s\", error %d (%s)","Successfully enqueued DNS request","Unable to enqueue DNS request, queue is full"}; stream {"STREAM_STATE #%u: %s -> %s",STREAM_INACTIVE,STREAM_STARTING}; socketio {"work_mem","can't parse url","New socket required: %d%d%d%d%d","creating new socket","reusing the socket","failed to format/write/read HTTP headers","not enough memory to read HTTP headers or invalid HTTP headers","no active socket","socket read failed"}; channels {"out of buffer! asked for %d bytes","error: out of channels","channel %d data %p size %d","CDN URL is too long to handle: %d","AP error %d on channel %d","cb->used + data_size < cb->size","Sent %s(%d) to ap Size %d"}; {".spotify.com",HTTP/1.,ap_list"}; option enum kSpSocket{ReuseAddr,ReusePort,MulticastTTL,MulticastLoop,Membership,NonBlocking} error paths; 'Requested hostname:\'%s\' is longer than %d' bound; kSpSocket option names {ReuseAddr,ReusePort,MulticastTTL,MulticastLoop,Membership,NonBlocking}

- **name:** eSDK socket layer
::: details Evidence (1)

- @ 0x10fdec20; sockets

:::


:::

## `event_loop`

**coverage** `partial`

The main event loop: a thread pool processing queued work with watchdog timestamps and elapsed-time logging. Everything in this program that waits for something (timers, sockets, messages) ultimately wakes through this loop, so it's the heartbeat under all the subsystems documented here.

::: details Technical details

eventLoopThreadPool + watchdogTimestamp; logs {Eventloop started. Threads: %zu,stopped,has no more work,shutdown. Cancelling watchdog,failure,elapsed-time:%lld}; scope names scopeDefault/scope:mtx/scope:cv/scopeHttpClient + warn_fault/authservice/trueplay_zp log scopes

- **name:** main event loop
::: details Evidence (1)

- @ 0x10f05d80; eventloop region

:::


:::

## `eventloop_perf`

**coverage** `partial`

The in-process event loop's performance instrumentation: per-observer callback durations checked against a threshold, plus counters tracking events queued and failed-to-queue. If the event loop stalls, everything stalls, so this watches how long work takes and surfaces wedged tasks in diagnostics.

::: details Technical details

"Eventloop %p configured/removed"; inprocess-events-loop; "%s callback in observer %s exceeded duration threshold %lldms > %lldms"; counters {"Unique identifier for a set of counters","In-Process Event Subjects","The number of events queued",perf_counter_keyed,queueFail="events that failed to queue","The event size in bytes",dispatchDelay="time waiting to dispatch","In-Process Event Observers",cbTime="observer handler duration. Warn if over threshold"}

- **name:** inprocess eventloop + perf counters
::: details Evidence (1)

- @ 0x10faf178; eventloop

:::


:::

## `exec_pages`

**coverage** `partial`

The status-site exec pages: a command table mapping diagnostic URLs to shell commands, covering file listings, disk usage, network interfaces, routes, processes, and time sources. These are literal shell-outs behind admin pages, and their output is raw command text rather than a structured document.

::: details Technical details

{/debugfiles:"/bin/ls --full-time /jffs/app/debug /jffs/sys/debug /jffs/net/debug",/du-jffs:"/usr/bin/du -a -d 5 -k -x /jffs",/ifconfig:"/sbin/ifconfig",/lsmod:"/sbin/lsmod",mount:"/bin/mount",/netstat:"/bin/netstat -an",/ntpsources:"/bin/chronyc -n sources -v",ps:"/bin/ps",/route:"/sbin/route -n",/scanresults:"/wifi/athconfig scangetresults ath0",/showmacs:"/usr/sbin/brctl showmacs br0",free:"/usr/bin/free",date:"/bin/date"}; jobs {RefreshSSLCache,"Save SSL Client Cache to JFFS",SaveSSLCache}; more {/showports:"brctl showports br0",/showstats:"brctl showstats br0",/showstp:"brctl showstp br0",uptime:"/usr/bin/uptime"}; file pages {/VERSION,/etc/resolv.conf,/jffs/app/log/anacapa.log.backup,/jffs/app/log/upgrade_mgr.log,/jffs/irconfig.txt,/jffs/localsettings.txt,/jffs/netstartd_prev.log,/jffs/recovery.log,/jffs/recovery_prev.log,/jffs/settings/alarmclock.xml,/jffs/settings/areas.json,/jffs/settings/cloudconfig.json,/jffs/settings/householdsettings.json,/jffs/settings/zones.json,/jffs/settings/zpMetricsConfigV2.xml,/jffs/shadow/stats,/jffs/sys/log/setup{,_ok}/setup.{dmesg,log},/jffs/upgrade{,_prev,_tmp_prev}.log}; support-bundle file inventory (log/page sources): /usr/sbin/brctl {showstats,showstp} br0, /jffs/sys/log/setup/{dmesg,log}, /jffs/sys/log/setup_ok/{dmesg,log}, /jffs/upgrade.log, /jffs/upgrade_prev.log, /jffs/upgrade_tmp_prev.log, /jffs/watchdog.dmesg, /jffs/watchdog.log, /opt/log/anacapa.{ext.audio.action,gm.events,ht,hw.events,musedebug,museevt,rc.upnp,snf,spotify.debug,spotify,sps,trueplay,vl}.log, /opt/log/chronyd.log, /opt/log/dropbear.log, /opt/log/ledmgr.debug.log

- **name:** /status exec-page commands
::: details Evidence (1)

- @ 0x10e74f10; exec table

:::


:::

## `ext_audio_src`

**coverage** `partial`

The external-audio-source job engine: clips and spoken announcements arrive as jobs with a priority and exclusivity state machine, covering doorbell-style audio clips and voice-assistant responses. This is what plays voice-assistant replies over music, and it's also where line-in family and externally pushed feeds enter the pipeline once treated as sources.

::: details Technical details

job FSM {STARTING,RESUMING,RESUMED,CANCELLED,DISCARDED} + ops {stopPlaying(too many/no jobs),processJob,WaitForComplete,playDeferredStream(deferred j/d counts),playStream(exclusivity skip)} + "too many deferred jobs"/"playing job %u is missing"/"current job %u gone"; clip types {COMMON,AUDIOCLIP,AVT_HACK,ALEXA_TTS,ALEXA_WELCOME,ALEXA_FAILURE,ALEXA_ALERT,GOOGLE_MEDIA,GOOGLE_ALARM,GOOGLE_TTS,SVE_TTS,VOCAL_GUIDANCE,ALERT,SETUP_CHIRP,DISCOVERY} with intr flag "processing type %s %d (intr=%d)"; volume override "\[%i, %i - %i over %ums\]" ramp + "\[%i, % i\]"; "eventing play status for job %u: %s \[%s\] @%d.%06d"; decoder {failed to get decoder,illegal sample frequency,zero len frame,decoder flagged playback stop,unsupported channel count > 2}; extaudiosrc_playid; mixer stream lifecycle '\[%s\] Created mixer stream %s', notify {notifyStatus: err 0x%x, notifyTransportError: err %d}, exclusivity policy 'skipping stream due to exclusivity'; job mgmt: '\[%s\] stopPlaying too many to stop %zu'/'with no jobs (state=%d)'/'stopPlaying\[%d\] %s\[%zu\] jobs=%zu','\[%s\] wrote zero bytes to stream','\[%s\] stream write failed (%zd), %s','\[%s\] wait for complete (state=%d, term=%d)','\[%s\] resetting stream %f ms available','\[%s\] eventing play status for job %u: %s \[%s\] @%d.%06d'; log tag ext_audio_action

- **name:** extaudiosrc: clip/TTS injection engine
::: details Evidence (1)

- @ 0x10ec01fc; extaudiosrc block

:::


:::

## `factory_reset`

**coverage** `partial`

The factory-reset machinery: the sequence that wipes settings, accounts, and stored state back to out-of-box condition. This entry documents which steps run in what order when a reset is requested.

::: details Technical details

factory reset machinery: a 'Factory Reset'/'Remote factory reset' CSRF-posted confirm form, /jffs/factoryReset.txt marker file ('unable to create factory reset file.', 'factory reset had errors', ': not factory reset'), LED_MODE_FACTORY_RESET pattern, sonosFactoryResetFull entry point, household-wide consequence ('device: %s %s removed from vanished list after factory reset'), and 'Invalid system settings (%s), resetting to factory defaults' as a self-heal path; muse route management/factoryReset can trigger it remotely

- binary anchors: `factoryReset.txt`, `sonosFactoryResetFull`, `management/factoryReset`, `v1/players/{playerId}/management/factoryReset`, `factoryReset.txt`, `factoryReset.txt`, `sonosFactoryResetFull`, `LED_MODE_FACTORY_RESET`, `Remote factory reset`, `<PresetNameList val="FactoryDefaults"/>`, `management/factoryReset`

- **mechanics:** <PresetNameList val="FactoryDefaults"/> is the settings-side reset verb; after reset the device broadcasts its removal so peers drop it from 'vanished' lists; corrupt system settings auto-trigger a reset
::: details Evidence (8)

- @ 0x10ef824c; factoryReset.txt
- @ 0x10062b81; sonosFactoryResetFull
- @ 0x10e7f07e; management/factoryReset
- @ 0x10e7f068; management/factoryReset muse route
- @ 0x10ef824c; factoryReset.txt sentinel
- @ 0x10ef824c; factoryReset.txt marker
- @ 0x10f13f90; peers remove reset device from vanished list
- @ 0x10efecdc; invalid system settings → auto factory defaults

:::


:::

## `favorites`

**coverage** `partial`

The favorites engine: the store of saved items like stations, playlists, and songs that the app shows as favorites, including the version counters that tell apps when the list changed.

::: details Technical details

replication "replicating favorites from %s"/"deciding whether to accept replicated list" + informReplicationAndNotify{,ForDestroy} + offerRemoteSetting; DIDL ns {xmlns:dc purl.org/dc/elements/1.1,xmlns:upnp,xmlns:r rinconnetworks,xmlns DIDL-Lite}; migration {old rhapsody→new,old non-OAuth} + "Failed to parse account service ID / serial number from Sonos URI"; errors {Invalid favorite id,Could not access favorites,initContentResource {parse URI,extract item ID,Invalid item ID,No valid mapping for item type}}; shortcuts/shortcut type; fields {AlbumArtURI,NextFavorite,FirmwareVersion,Description,ResMD}; cdudn + nameSpace + restricted + parentID; store-commit faults: mutations persist through f_10384490 atomic-save of userradio.xml - fault ladder {402,501,701,702,803,805,806,807} where 805=item-count>=70 (favorites cap), 806=file>128KiB; these surface verbatim through dirObjFavorites vfuncs on CDS CreateObject/UpdateObject/DestroyObject

- **name:** favorites: userradio + recents
::: details Evidence (2)

- @ 0x10ec0e24; favorites block
- @ 0x10384490; userradio.xml atomic-save fn - fault ladder proven

:::


:::

## `favourites_model`

**coverage** `partial`

The favorites data model: how favorite items are represented and organized internally, which is the structure behind the favorites API and file formats. It's distinct from the library index because favorites point outward at services and stations, so they get their own store with their own update signal.

::: details Technical details

Sonos favourites store + ContentDirectory projection: FV:2 root container paired with FavoritesUpdateID; XML store schema recovered; mutation via CDS CreateObject/UpdateObject/DestroyObject on the dirObjFavorites vtable + muse getFavorites/loadFavorite routes

- binary anchors: `favorites.cxx`, `NextFavorite`, `sonos_favorites_version`, `FV:2`, `dirObjFavorites`, `object.item.sonos-favorite`, `replicating favorites from %s`, `r:favoriteId`

- **root_browse_map:** FV:2 -> FavoritesUpdateID; R:0 -> RadioFavoritesUpdateID; R: -> RadioLocationUpdateID; SQ: -> SavedQueuesUpdateID; S: -> ShareListUpdateID (root enumerator f_10303de4)
- **store_schema:** <Favorites SchemaVersion="%d" NextFavorite=".."> document with a sibling <Radio LastUpdateDevice="%s" Version="%u" NextFavorite="0"> section for radio favourites; NextFavorite is the replicated monotonic counter; 'replicating favorites from %s' shows household replication of the store
- **didl:** class object.item.sonos-favorite; favourite id carried in r:favoriteId under urn:schemas-rinconnetworks-com:metadata-1-0; service-derived favourites parse 'account service ID / serial number' from the sonos: URI
- **mutation:** dirObjFavorites directory object (f_1037ca04) installs an op-table (f_1037e030/f_1037e12c/f_1037e124/f_1037e134/f_103811fc/f_1038122c) driven by CDS CreateObject(impl->v\[+0x20\])/UpdateObject(v\[+0x24\])/DestroyObject(v\[+0x28\]); errors 'Invalid favorite id.' / 'Could not access favorites.' in f_1037d984; reorder exists: 'Did not move favorite (%s "%s"); rc %d' + radioFavoritesMoved event
- **cloud_routes:** v1/households/{householdId}/favorites, v1/groups/{groupId}/favorites, v1/households/{householdId}/groups/{groupId}/favorites; ops getFavorites / loadFavorite
- **migration:** legacy conversion strings: 'Successfully converted old rhapsody favorite', 'Failure converting old non-OAuth favorite': favourites migrate with service renames/OAuth transitions
- **smapi_caps:** trFavorites (tracks), alFavorites (albums) exposed in /customsd; arFavorites (artists) present but commented out; SMAPI-side vocabulary isFavorite/canAddToFavorites/containsFavorite
- **unresolved:** exact Favorites XML element schema per-favourite; which op-table slot maps to which CDS verb; whether UpdateObject reorder or a dedicated move path drives 'radioFavoritesMoved'
- **mutate_semantics:** Reorder verbs: 'Did not move favorite (%s "%s"); rc %d' + itemsMoved/radioFavoritesMoved notifications. Metadata fields beyond favoriteId/ordinal: r:description, r:resMD, r:room, r:playmode, r:type (all under urn:schemas-rinconnetworks-com:metadata-1-0/\|). Categories::shortcuts/:playlists/:audiobooks. Station classes: 'TuneIn Station', 'Custom Station', 'Radio Show', 'instantPlay'. DIDL forms: object.item.audioItem.musicTrack, object.container.radioShow, object.item.audioItem.audioBook, object.item.sonos-favorite ('object.item'+'object.item.sonos-favorite' concat). res protocolInfo: x-rincon-mp3radio:*:*:*, x-sonosapi-show:*:*:*, x-sonosapi-stream:*:*:*. Account URI SA_RINCON%d_; parsing: 'Failed to parse account service ID / serial number from Sonos URI. favorite=%s, uri=%s'. Mutate pipeline: informReplicationAndNotify / informReplicationAndNotifyForDestroy → offerRemoteSetting → userradio{,.d}.xml replication ('replicating favorites from %s', 'deciding whether to accept replicated list'). Legacy conversion: 'Successfully converted old rhapsody favorite. Was: %s, now: %s' + 'Failure converting old non-OAuth favorite'. Errors: 'Invalid favorite id.'/'Could not access favorites.' + initContentResource (Unable to parse URI/extract item ID/Invalid item ID %s/No valid mapping for item type %d).
- **savedqueue_format:** <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"> root; per-queue NumTracks="%u" attribute; res protocolInfo file:*:audio/mpegurl:*; validation 'Saved queue ID not valid %s'/'Next available queue ID not valid %s'/'Saved queue ID and next available queue ID mismatch %d'/'Number of tracks not valid %s'/'Number of expected tracks %d available %d'/'Saved Queue track list corrupted, expected %u, saw %u.'; migration skip 'Not migrating ObjID=%s SN=%u SID=%u'; 'Cannot parse service ID from URI %s'
::: details Evidence (8)

- @ 0x10ec12ca; favorites.cxx
- @ 0x10ec0ce2; NextFavorite
- @ 0x10304098; root browse map literal table (FV:2/FavoritesUpdateID ...)
- @ 0x10ec0d1e; '<Favorites SchemaVersion="%d">' store schema
- @ 0x1037cab8; dirObjFavorites object install in f_1037ca04
- @ 0x10ec13a4; 'Invalid favorite id.' used in f_1037d984
- @ 0x10ec0f04; urn:schemas-rinconnetworks-com:metadata-1-0/\|favoriteId
- @ 0x10ece800; mp3/id3 probe literals in sharelist region

:::


:::

## `fcs_detail`

**coverage** `partial`

Internals of an internal component abbreviated 'fcs' in build metadata: the filesystem-config-storage path in detail, recovered structurally as part of the settings persistence machinery.

::: details Technical details

f_105eba60 → f_106ba5b0; sibling f_105eba6c reads sonosClockGetTime into buffer (timestamp page); /fcs page serves 'Feature config override' HTML: readonly cloudsourcedconfig textarea + overrideconfig textarea POST to /fcs with button=submit|remove; success page meta-refreshes to /fcs

- **name:** fcs_detail
::: details Evidence (1)

- firmware; handler disas

:::


:::

## `fd_event`

**coverage** `partial`

The file-descriptor event machinery: named threads driving the operating system's event-notification facility, with capacity limits and monitored-descriptor bookkeeping. It's the primitive 'wake me when this socket is readable' underneath the event loop, and networking code relies on it everywhere.

::: details Technical details

ops {fdevent.signal.write,fdevent.wait.poll,fdevent.check.poll,fdevent.reset.read,removeFd,waitForEvent}; EventSync %s; epoll {create1,ctl,wait} errors incl "unsupported flags","already monitored","exceeded the fd capacity of %d"

- **name:** fdevent epoll wrapper
::: details Evidence (1)

- @ 0x10ef3fec; fdevent region

:::


:::

## `fdevent`

**coverage** `partial`

The same descriptor-event layer as fd_event: the event engine everything else (the address monitor, the select thread, audio descriptors) multiplexes on. Capacity is bounded and overflow is a hard error.

::: details Technical details

ops {removeFd,waitForEvent}; thread names fdevent.{signal.write,wait.poll,check.poll,reset.read}; EventSync %s; epoll_create1/epoll_ctl/epoll_wait error paths; fd capacity bound "%d already monitored"/"exceeded the fd capacity of %d"

- **name:** fdevent: epoll event engine
::: details Evidence (1)

- @ 0x10ef3fec; fdevent block

:::


:::

## `feature_flag_registry`

**coverage** `partial`

Feature flags arrive as keys in a cloud-delivered settings document rather than as compile-time switches. A known set of flag names enumerates what's gated, including low-power modes, smarter playback, adaptive streaming, and quick pairing. This is the master list of toggles, which explains why behavior can differ between households on the same firmware.

::: details Technical details

complete compile-time feature/config flag vocabulary (48 keys): featureConfig* family keys in the cloud-config JSON doc plus enable*/disable* booleans read at init: the build's feature map showing which subsystems are switchable; RMuseFeature enum tail (device capabilities): SWAP_INITIATOR, LED_STATUS, LED_MUTE, BLE_DISCONNECT_SCAN, LACKS_HI_RES_MUSIC, HEIGHT_CHANNEL_TUNING, DUAL_MONO, WIDEVINE, DOLBY_ATMOS, WAKEABLE, HLS_V7, MUSE_OVER_BLE, VIDEO_PLAYBACK, SUPPORTS_FLEXIBLE_SURROUNDS, HP_SWAP_TARGET, EPHEMERAL_PLAYER, RECONFIGURABLE_OUTPUTS, AUTOMATIC_WIRED_SOFTAP, EPHEMERAL_BONDING, IS_HEADPHONE_MEDIAPLAYER, DEFAULT_STATUS_LED_OFF, DEFAULT_AUTOPLAY_LINEIN (guard: 'Number of device features exceeds size of RMuseFeature array')

- binary anchors: `featureConfigPlink`, `featureConfigSmartPlay`, `featureConfigQuickbonding`, `featureConfigZoneExperiment`, `<ZoneExperiment id=`, `/experiments`

- **mechanism:** 'featureConfig' parent key with per-feature subkeys; ZoneExperiment layer adds <ZoneExperiments><ZoneExperiment id name value defaultValue> docs + /experiments HTTP endpoint + O_ZONE_EXPERIMENTS config key + experimentId field: A/B values carry explicit defaults so absent assignment falls back to defaultValue
- **flags:**
- **unresolved:** which config file/route carries featureConfig (householdsettings.json? muse?), per-flag gate sites
- **featureconfig_keys:** `featureConfigDropoutContext`, `featureConfigHomeTheaterWifiPerfTelemetry`, `featureConfigMetricsService`, `featureConfigPlink`, `featureConfigQuickbonding`, `featureConfigSemiSleep`, `featureConfigSmartPlay`, `featureConfigSpotABR`, `featureConfigSsdpAdvertiseConfig`, `featureConfigZoneExperiment`
- **enable_keys** (43):

  ```
  enableContentAccessSetting, enableSemiSleep, enableHTSourceSleep, enableSpatialAudio, enableExternalPartnerMode, enableSpotifyConnectForAllAccts, enableSpotifySMAPIVolumeNormalization, enableVoiceDataCollection, enableSvcHomeControlLutron, enableSvcPlus, enableAmazonMusicDASH, enableAppleMusicHlsv7, enableTuneInReplacement, enableTuneInMigration, enableTrueplayDataCollection, enableSystemAPIV2, enable3ChannelSatellites, enableHTSNKv2, enableSPSDataCollection, enablePortableSurrounds, enableMaxDialogueLevel, enableRemoveMSPCredentialsFromUPnP, enableChsrcPerfOptimizations, enableUPnPEventingGNDOptimization, enableSecureAlbumArt, enableCEP20ThreadTweaks, enablePitchfork, enableSslClientCacheRefresh, enableDhcpProxyFailureTelemetry, enableOnDeviceSoundGeneration, enableRadioSocTemperatureTelemetry, enableHomeTheaterWifi6GHzFronthaul, enableTopologyReports, enableFastNetworkSwitching, enableQuickbonding, enabledSTP, enabledHT, enableTrueRoom, enableFlexibleSurroundsTuning, enableVirtualHeight, enableCloudSetting, disableWebSocketPerMessageDeflate, disableTlsRsaCiphersuites
  ```
- **notable:** enableTrueRoom (next-gen tuning), enableVirtualHeight + enableFlexibleSurroundsTuning (Atmos-era HT), enable3ChannelSatellites, enableHTSNKv2 (channel-sink v2), enableTuneInReplacement/Migration (service swap), enableSvcHomeControlLutron/enableSvcPlus (partner integrations), disableTlsRsaCiphersuites (hardening), enablePitchfork (IBT plans)
::: details Evidence (6)

- @ 0x10f97b28; featureConfigPlink
- @ 0x10f97b70; featureConfigSmartPlay
- @ 0x10f97b3c; featureConfigQuickbonding
- @ 0x10f97ab4; featureConfig + 10 subkeys in JSON key table
- @ 0x10ef3d34; <ZoneExperiment id name value defaultValue> schema
- @ 0x10f97ab4; featureConfig key table 0x10f97ab4-0x10f97bc4; enable* table 0x10f9bedc-0x10f9ccc8

:::


:::

## `feature_flags`

**coverage** `partial`

The feature-flag registry: the build-time map behind the pushed feature document, carrying the same flag vocabulary plus defaults. A cloud-pushed value beats the build default, and this is what lets Sonos ship one codebase with per-model and per-household variation.

::: details Technical details

flags {enableSpotifySMAPIVolumeNormalization,zoneExperiments,metricsService,enableVoiceDataCollection,enableSvcHomeControlLutron,enableSvcPlus,enableAmazonMusicDASH,enableAppleMusicHlsv7,enableTuneInReplacement,enableTuneInMigration,semiSleepConfig,enableTrueplayDataCollection,dropoutContext,enableSystemAPIV2,enable3ChannelSatellites,enableHTSNKv2,disableTlsRsaCiphersuites,enableSPSDataCollection,enablePortableSurrounds,aiseMinThreshold,enableMaxDialogueLevel,enableRemoveMSPCredentialsFromUPnP,featureConfigSemiSleep,DropoutContext,HomeTheaterWifiPerfTelemetry,MetricsService,Plink,Quickbonding,SemiSleep,SmartPlay,SpotABR,SsdpAdvertiseConfig,ZoneExperiment,featureConfigZoneExperiment}

- **name:** featureConfig registry: build feature map
::: details Evidence (1)

- @ 0x10f9bf94; featureConfig block

:::


:::

## `fileio`

**coverage** `partial`

The async file-I/O layer: stream registration, shared-folder reading, an in-memory fast path, resumable fetches, and content-type sniffing. It's the generic 'open an address as a stream' layer under playlists, artwork, and library browsing, and it includes the atomic-write pattern that keeps state files from corrupting.

::: details Technical details

async register/unregister + enabled; SMB readdir + "failed to open SMB dir"; "File is in memory" skip-open; "Success opening URI %s; stream type %d"; "Sonos API URI %s not dereferenced before opening stream"; prebuffering + "reopening http for streaming at %zu" + ?after= resume; "application/xml; listing" dir listing; "no framer found in factory, returning null, we should not reach here"

- **name:** fileDataMgr: async stream I/O
::: details Evidence (1)

- @ 0x10ec182c; fileio block

:::


:::

## `fmp4_parser`

**coverage** `partial`

The fragmented-MP4 parser for segmented audio: it validates the container's box order, builds the sample table, and rejects encryption variants it can't parse. The segmented-audio format that adaptive streams use gets unpacked here, extracting frames and metadata from the container.

::: details Technical details

boxes {mfhd(seq check),tfhd(version),tfdt,trun space bounds} + "tfhd not found before trun"; trun table "seqnum %u truntblnum %zu fsize %zu foffset %zu fsamples %zu bdo %llu trundo %i truneo %zu trunes %zu trunep %zu"; senc "Sub-entry encryption isn't supported" + "Cannot parse all the IVs in senc at %dth entry"; "stream quality: encoder %s, bit depth %u, sample rate %u, bitrate %u, channels %u"; trims {encoder delay,padding} + "skipping frame; seek time offset"/"< usable offset"; atoms {iTunNORM,iTunSMPB,TLOU/ALOU ITU loudness,mehd,trex,traf,esds max/avg bitrate,alac sub,mp4a ch/bitdepth/samplerate}; errors {bad moof,no moov,no dat,unknown fmp4 encoder type,unsupported file ch/bitdepth,unsupported frequency %u-bit %uhz %u channels,frag w/o traf,STZ2 ignored}; formats %ub%u; trun box bounds checking 'not enough bytes for trun %zu vs %zu','not enough space for trun %zu vs %zu seqnum %u','miss calculation on space used %zu expected %zu','not enough space available %zu vs %zu','%p:%zu: setpos for read %zu'; 'invalid num bytes for compatible brands %zu'; track import guards 'ignoring non-local track %s'; gap/padding handling 'applying encoder delay %d samples'/'removing padding %d samples'; seek 'skipping frame; seek time offset %f > current time offset %f'; 'stream pos %zu couldn't set streaming hint to true'

- **name:** segaudio fmp4: fragmented MP4 parser
::: details Evidence (1)

- @ 0x10ec9e38; fmp4 block

:::


:::

## `group_object_model`

**coverage** `partial`

How zones actually group: the coordinator and satellite topology, zone storage, the play-state manager, and the group event model all sit here. It's the internal structure behind the household map and the group events apps consume, covering how a group is represented with its leader, its members, and their state.

::: details Technical details

zone grouping internals: bonded-role enum (HT_BONDED_MASTER/SATELLITE, UNBONDED_DEVICE, stereo-pair/sub combos), coordinator ops (BecomeGroupCoordinator\[AndSource\] with GC-state cloning + VLI delegation, ChangeCoordinator, DelegatedGroupCoordinatorID), topology monitor with settle-retry, satellite lifecycle (Add/RemoveHTSatellite, recoverBondedZone FSM), per-satellite DSP protobuf + tuning push; zonesmonitor/RZonesMonitor: 'Topology monitor: Secondary linkage broken. Start recovery job', jobs 'monitorTopology%d'/'Stop topology monitor', DefunctDeviceRemovedEvent + bondedZonePartnerDefunct -> recoverBondedZone + refreshSonarState; topology_report/ReportCallBack layer: 'reporting %s','ReportCallBack player %s was not found','%s local player %s was not found', topologyReport/TopologyEventsReport/topologyEventsReport channels, 'cid:%s/%s,in:%u/%u' correlation ids; topology_events_report.cxx: reportEventsLocked/updateRelationshipsLocked/conditionallyReportTopologyEvents/onEvent; device-role detection '%s was GM to loc, %u GMs'/'%s was SAT to loc, %u sats'; change-detection vocabulary {chmap change %s to %s,HTsat defn change %s to %s,wifi mode change %u to %u,connection type change %u to %u,ch frq change %u to %u,wifi on change %u to %u,eth link change %u to %u,evt loc grp role chg,gen plbk corr ctx chg evt,'chk sats of GMs %s'}; report path 'Report Topology Events: '%s'', throttle 'reported %ds ago:limit', 'err sec<0: %d', 'fail:unparse cid. quit report', '%s player %s was not found'/'not local', 'Unkown TopologyEventsReportEvent type' \[sic\]; AddHTSatellite pre-clear 'Clearing local sonar configuration in AddHTSatellite on SOURCE %s'; group-clone rejections 'music context content cannot be copied'/'cannot be swapped'; VLI playback-probe 'Resume result %d'/'not resuming'/'Saw playing %d, %s'

- binary anchors: `play_state_mgr.cxx`, `zones_storage.cxx`, `/jffs/settings/zones.json`, `BecomeGroupCoordinatorAndSource`, `recoverBondedZone`, `dsp_system_satellite.bin`, `HT_BONDED_SATELLITE`

- **bonded_roles:** HT_BONDED_MASTER, HT_BONDED_SATELLITE, UNBONDED_DEVICE, BONDED_STEREOPAIR, BONDED_TO_SUB, BONDED_STEREOPAIR_AND_SUB; ZP_MODE_HT_SATELLITE; netmodes NETMODE_SATELLITE_V1/V1_WIRED/V2, STATION_SATELLITE*
- **coordinator_ops:** BecomeGroupCoordinator, BecomeGroupCoordinatorAndSource (bCloningGCState/bSourceGCClearedContent: can clone GC playback state), BecomeCoordinatorOfStandaloneGroup, ChangeCoordinator ('using local VLI txs'/'VLI State Snapshot' source hand-off, installClock, Chsnk restart to avoid seamless delegation); secondary-ZP calls rejected
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
- **coordinator_monitor:** Coordinator linkage: 'member list generated: \[%s\]', '%s linkage broken for %s: Local gID: %s; Other gID: %s', 'Coordinator %s linkage broken' -> topology monitor deschedule + ChangeTransport notify ('failed notifying %s of changed transport'); accepting-gate verbs startAcceptingGroupCommands/stopAcceptingGroupCommands; LocalGroupUUID + VirtualLineInGroupID + setVirtualLineInGroupID{Locked} local state.
::: details Evidence (7)

- @ 0x10ed15f2; play_state_mgr.cxx
- @ 0x10e96cc6; zones_storage.cxx
- @ 0x10e752e0; /jffs/settings/zones.json
- @ 0x10eb247c; BecomeGroupCoordinatorAndSource GC-state clone flags
- @ 0x10ebce88; recoverBondedZone FSM strings
- @ 0x10e73ab4; dsp_system_satellite.bin + satellite_processor.bin
- @ 0x10e878b4; HT_BONDED_MASTER/SATELLITE role enum

:::


:::

## `group_rc`

**coverage** `partial`

The group rendering-control engine: the internal machinery that applies group volume and mute to all members, behind the group volume commands. The group-level controls live here so one slider can move every speaker in a room at once.

::: details Technical details

group vol snapshot {"snapshot %s: %u (was %u)","snapshot sum for %u (of %u) zones"} + DesiredVolume/DesiredMute; algo "calculateVolume %s: sg:%.4f ng:%u sv:%u nv:%.4f" + gvd {t,c,f,m,cv,sv}; tracking {addZone already tracked,removeZone not tracked,transitionValid c/m/f}; faults {total failure,partial failure,all members use fixed volume,operation in progress,unexpected upnp fault}; events {GroupVolumeSetActionEvent(vol,mute,vligrouping),VliVolumeProcessingCompleteEvent vliType}; members {localRC vol/mute/fixed,remoteRC %s vol/mute/fixed}; ops {SetGroupMute local/remote rc,SetGroupVolume local netops zones + per-member rc}; group caps {"Group capability updated: 0x%08x -> 0x%08x","Spatial audio disabled in Area Zone","Spatial audio disabled: mask"} + enableSpatialAudio + "GroupCapabilities zp: %s: %i,%i,%i"; cap strings {widevine,atmos,portable,tv_in,hlsv7}

- **name:** grc_zpimpl: group rendering control
::: details Evidence (1)

- @ 0x10ec3a58; grc_zpimpl block

:::


:::

## `healthcheck`

**coverage** `partial`

The health-check machinery: periodic self-tests the player runs to verify it's functioning, with results feeding diagnostics and recovery decisions. It runs on its own timer, catching trouble before a user notices it.

::: details Technical details

schedule "Next healthcheck scheduled to run in %u hour(s), %u minute(s), %u second(s)" + "Not scheduling: %d %d %d %d %d %d" 6-gate + "Healthcheck timer pop"/reschedule; fields {SubmitPermission,ServerDiagInstructions}; instructions fetched /ws/diag/diag_instructions.xml?hhid= ; errors {I/O+HTTP Result,Indeterminate length,Incomplete,parse fail,too large}; instruction-file fetch taxonomy: 'Unable to retrieve instruction file. I/O Error: 0x%x. HTTP Result: %d','Indeterminate instruction file length','Incomplete instruction file','Failed to parse instruction file','Instruction file too large'; cache update 'Updating history cache: \[status=%s\] \[key=%s\] \[etag=%s\] \[cache-control=%s\]'

- **name:** healthcheck: periodic health probe
::: details Evidence (1)

- @ 0x10ec4574; healthcheck block

:::


:::

## `healthcheck_contact`

**coverage** `partial`

The healthcheck's server-contact half: instruction fetch, permission gating, and reschedule-on-response. The returned instructions can trigger diagnostics or other maintenance, making it a managed maintenance channel the cloud can steer.

::: details Technical details

schedule "Next healthcheck scheduled to run in %u h %u m %u s" + "Not scheduling: %d %d %d %d %d %d" + "Healthcheck timer pop" + "Rescheduling next healthcheck"; server /ws/diag/diag_instructions.xml?hhid= + SubmitPermission + ServerDiagInstructions + "Contacting server for instructions"; errors {I/O Error + HTTP Result,Indeterminate length,Incomplete file,Failed to parse,too large}

- **name:** healthcheck: server instructions
::: details Evidence (1)

- @ 0x10ec4574; healthcheck block

:::


:::

## `hhsettings_rest`

**coverage** `partial`

The household-settings API inside the device: public keys readable by anyone, restricted keys needing permissions, and admin keys needing admin rights. Errors are specific, so clients can distinguish 'doesn't exist' from 'can't write'. When a component needs to read or write shared household configuration, this is the client that makes the call.

::: details Technical details

path grammar {public/{key},restricted/{key},restricted-admin/{key}}; errors {Key not found.,Failed to delete setting.,invalid value size or type for setting key,HHSettingsMgr reported invalid setting value for key,Failed to store setting.,HHSettingsMgr failed to store settings,Deleting all settings in a category is not allowed. Provide a key.,Unsupported Request}; get path logs "key = %s not found in processGetRequest"

- **name:** household settings REST API
- **visibility:** "ALERT! Display of these settings on status page (/householdsettings.json) needs to be addressed before setting this category"; vars {householdsettings,userMetricsTracking,householdsettings.json,hhsettingsfile}; frozen:1 flag
::: details Evidence (1)

- @ 0x10f063f8; hhsettings region

:::


:::

## `history_mgr`

**coverage** `partial`

The cloud play-history manager: it posts played tracks, keeps caches honoring freshness headers, serves 'recently played', and repairs a corrupt cache. This is the 'recently played' list that syncs across the household and the app.

::: details Technical details

historyService + rphistory + historyEntryInvalid event + ucsType; cache {preCache,postCache,preEtag,postEtag,cacheControl,historyRequest} + "Updating history cache: \[status\]\[key\]\[etag\]\[cache-control\]" + "Cached etag" + "corrupt cache could not be served after a 304"; POST postHistory + recentlyPlayed + max-age + "max-age=%s, etag=%s, http-result=%d" + "Post History Buffer Cleared"; queue faults {bufferFull,invalidContentType,resourceIncomplete(name,type,objectId),groupIncomplete(name,id,coordinatorId)}; fields {imageUrl,explicit}; getHistory {serving the cache,#getHistory response} gated by {Securely Registered,History Enabled}; deleteHistory history?id=; "Failed to generate defaults for history entry"; "Failed to initialize history from cache"; cache edge: 'corrupt cache could not be served after a 304 Not Modified response from the cloud'; cloud ops: 'postHistory response from cloud: %s','POST history failed with response %s','Delete history response from cloud: %s','history#getHistory failed. Securely Registered: %s, History Enabled: %s'/'Not securely registered','history#getHistory response from cloud: %s','History could not be retrieved due to an internal error'; entry reject taxonomy 'Failed to post history entry, resource incomplete: '/'group incomplete: ','Failed to queue history entry, incompatible content type: '/'resource incomplete - name, type, or objectId missing: '/'group incomplete - name, id, or coordinatorId missing: '; cache 'Failed to initialize history from cache.','Cached etag: %s','error while generate defaults for %s','Failed to generate defaults for history entry %zu'

- **name:** historyMgr: cloud history
- **salt_literal:** Smb2sOM9daUv+IELUjC4q5gaxyNuvkstS9nLmjWQeLY
::: details Evidence (1)

- @ 0x10ec4878; history_mgr block

:::


:::

## `hls_audio`

**coverage** `partial`

The segmented-stream audio player: seeks land on segment boundaries (or snap forward), it can switch variants when a playlist mixes formats, and it tracks stream metadata per segment. The engine behind most internet-radio playback on the platform.

::: details Technical details

"requires group capabilities %u"; seek {to time %.3f (%lu:%02lu:%02lu),to time from start of current segment,pass segment,to segment start time range}; "forcing a source switch due to multiple codec variants in playlist"; ADTS metadata {metadata,no metadata bumping seconds advanced,cached seconds advanced mismatch}; EXT-X-KEY {METHOD= AES-128,/SAMPLE-AES,,KEYFORMAT=,URI=data,URI=""} + "encrypted but no key URI"/"encrypted but no data from key URI"/"No IV, using seq. num"/"SAMPLE-AES detected. Setting up audio framer decryption"/"Key extracted. method=%d"/"undefined encryption method"; track playback {bitrate %u stream %u segment %llu offset %zu,InitFramerForTrackList failed,m_dTimeOffset,Trim offset required,resetMetadata,track play time,seconds advanced,time offset of segment byte offset}; bitrate report "hls-%s said: %u (%g) %d %d"; types {hls-live,hls-static,hls-???}; master {fetching master,updated master URI}; playlist errors {EXT-X-TARGETDURATION not present,media seq went backwards,media len changed,Invalid media playlist,Seeking pass the end,empty track list,Error %x occurred}; stale {d d llu llu}; Segment Map entries

- **name:** hlsaudio + segaudio: HLS player
::: details Evidence (1)

- @ 0x10ec4f88; hls blocks

:::


:::

## `hls_player`

**coverage** `partial`

The segmented-stream engine's stream semantics: live-versus-static variant tags, segment-aligned seeking, format-variant failover, and decryption-key handling for protected streams. The policy layer over the segment fetcher.

::: details Technical details

variants {hls-live,hls-static,hls-???}; "requires group capabilities %u"; "forcing a source switch due to multiple codec variants in playlist"; ADTS md + "seconds advanced" tracking + "doesn't line up with seek"; encryption {encrypted-but-no-key-URI,no-data,"No IV, using seq. num.","SAMPLE-AES detected. Setting up audio framer decryption",key-uri http status,read size mismatch}; byte-range map "couldn't get file size from http headers for map"/"found offset %zu"; InitFramerForTrackList; seg index "starting at bitrate %u stream %u segment %llu offset %zu"; master {updated master URI,fetching master,version %u bitrate max/cur/min,getIndexURI,"Failed to calculate absolute media URI"}; ABR {"downgrade bitrate","already at the minimum","upgrade bitrate","advancing stream index"}; rendition filters {rgchStreamURI empty,PROGRAM-ID,invalid rendition,"rejecting binaural/downmix rendition",BANDWIDTH unsupported/0}; "unexpected, we have %zu dolby streams in the playlist"; BR P|TYPE=SNG marker; seq discontinuity detect; threads {segaudio,hlsmeta,hlsplaylist}

- **name:** hlsaudio: HLS stream player
- **status_schemas:**
  - **hls:** <HLS Name="Playlist"><HLSVersion><IsStatic><IsEncrypted><TargetDurationSec><CurrentBitRate><TrackEncryptionMethod><TrackEncryptionFormat></HLS>
  - **bitrates:** <BitrateStreams numBitrates="%zu"><StreamEntry br strm codec segidx/>
::: details Evidence (1)

- @ 0x10ec4f88; hlsaudio block

:::


:::

## `household_settings`

**coverage** `partial`

The `householdsettings.json` store: versioned JSON with per-category sections (public/restricted/restricted-admin), each carrying read/write permission strings and a settings list (explicitContentFiltering, recentlyPlayed, etc.). `lastUpdateDevice`/`version` fields drive replication conflict resolution. Configuration shared by the whole home lives here, replicated so every player holds the same values rather than each having its own copy.

::: details Technical details

file householdsettings.json {fileVersion,fileSchemaVersion,householdSettings}; JSON \[{version,lastUpdateDevice},\[{name:"restricted-admin",readPermission:null,writePermission:"hh-config-admin",settings:\[{explicitContentFiltering,recentlyPlayed}\]}\]\]; categories {restricted-admin,protected-admin,protected}; frozen:1 marker; "File upgraded to v%d schema"/"File overwritten due to invalid setting"; UMTracking→userMetricsTracking migration; "version incremented after invalid settings offered"; hhSwgenState swgen must be >= player; /householdsettings.json status-page ALERT; 'JSON parse error: %s (v1?:%d)','getMuseHHName'

- **name:** householdsettings.json persistence
::: details Evidence (1)

- @ 0x10ef43f0; hhsettingsfile block

:::


:::

## `ht_audio_sources`

**coverage** `partial`

The TV-audio source type registry: the named source types for satellite, downmix, processor, and channel-sink TV feeds, which appear in session reports and in the source-selection logic deciding which theater path feeds a zone. It's how the system detects and selects the TV-connected inputs that feed a soundbar.

::: details Technical details

source names {tv-sat-as,tv-gm-dm-as,tv-proc-as,AIHomeTheater,chsnk-sat-as}; ForceSubmitTvSessionReport op

- **name:** TV audio source types
::: details Evidence (1)

- @ 0x10ea5f94; ht source names

:::


:::

## `htaudio_chproc`

**coverage** `partial`

Home-theater channel processing: the stream types, dynamic-range state per zone, channel-map transitions, and optical input handling. This is where a stereo TV signal becomes surround across bonded speakers, the routing brain of theater audio.

::: details Technical details

DRC "changedDRCStates: dspZone=%d, bNightMode=%d, dialogEnhancementLevel=%d, speechExtraction=%d"; streams {htain,htaoutl,htaoutr,htaouts,remote,downmix}; "tv channel map changed from %s to %s"; system/dsp_disable; app/debug/dsp/persistentEQ.xml; spdif-input + protocolInfo="spdif"; autoplay FSM {autoplay_tv,"auto stop %s silence threshold %ums","auto play %s silence threshold %ums","mode change %s -> %s","Silence threshold reached (%ums). Engaging auto stop.","Triggering autoplay. Ignore Silence Threshold (%d)","Transitioning to TV due to user interaction"}

- **name:** HT channel processing + autoplay FSM
- **spdif_parser:**
  - **status:** confirmed
  - **summary:** SPDIFParser IEC 61937 preamble FSM (domain tv_decoder_dsp). Status XML '<SPDIFParser><State>%s</State><InputBitstreamStride>%u</InputBitstreamStride><Anomalies>%s</Anomalies></SPDIFParser>'. States: UNKNOWN_BITSTREAM, BITSTREAM_CONFIRMATION, ALIGN_TO_BURST, LOCAL_FADE_OUT, CHANNEL_NUM_CHANGE, INPUT_RATE_CHANGE, BITSTREAM_DISCONTINUITY, DECODER_DSP_ERROR, DIALOG_EXTRACTOR_ERROR; anomaly tag 'non-zero frame'.
  - **transitions:** 'State change %s -> %s. %s' (free-text reason), '. databurst %d', '. no preamble in %u frames. Last playing %s', '. no preamble in %u frames', '. reset: \[%s\]'. Detection: 'Found bitstream type %d with %u-frame stride','Found apparent PcPd with only %u frames padding! This might be a lookalike PCM signal.','Possible frame misalignment detected! Pa seen in subframe B.','Multichannel PCM not aligned to channel 0 (index %u), correcting.','Sync acquired for databurst (%d) index (%u)','PaPb preamble not found at expected position \[%08x - %08x\]','Failure to align bitstream. PaPb preamble not found at expected position. Instead found %08x - %08x: %08x - %08x','Databurst mismatch in encoded state. Expected %d but found %d'/'during alignment. Expected %d but found %d','Unable to confirm databurst (%d) of unexpected size %u expected %u','Unknown repetition period for burst type %d','No repetition information available for burst type %d','Unsupported databurst %d confirmed','Broken padding during bitstream confirmation','null burst terminated by non-zero frame','Too many frames to cache %u > %zu','Aligning to first encoded audio sample. %u frames copied. %u more required','Requested exactly %u frames, but was incorrectly sent %u instead','Discontinuity detected: \[%s\]','Unexpected state: %d','No room in parsing output buffer. Buffer max: %zu buffered: %u'.
  - **audio_tap:** Tap ingestion: 'Encountered signal loss in the audio tap','Failed to read audio tap metadata','Audio tap read size mismatch (req %zu, avail %zu)','Audio tap read failure: (%zu/%zu bytes)','!!!!! rewinding audio tap !!!!!','!!!!! start of audio tap !!!!!','Audio tap metadata version mismatch (tap: %d, expected: %d)','Audio tap truncated (last %zu audio bytes missing)'/'(last %zu metadata bytes missing)','Audio tap file valid (%zu/%zu)','Audio tap file invalid; closing'; tap file audiotap.spdif; testpoint 'oTestpoint fade duration override %d -> %d msec'.
  - **interval_stats:** Interval stat names: 'Timer Read Wait','maximum runtime of component stage','first sample rate within interval','first frame read size within interval','estimated amount of audio buffered in input','amount of audio buffered in stream'/'in driver'/'in aggregate','first reset reason within interval'.
::: details Evidence (1)

- @ 0x10f273d8; chproc block

:::


:::

## `htaudio_satellite_tx`

**coverage** `partial`

The satellite-transmission statistics: time-to-play, bytes sent, transmit errors, late frames, and resync counts. On a surround setup, these counters explain lip-sync drift and dropouts between the soundbar and its satellites, which is the wireless link that makes rear speakers wire-free.

::: details Technical details

stats schema {timeToPlay/Time between send and play,txSent/Total bytes transmitted,txErrors/Total number of transmission errors,serializationErrors/Total number of serialization errors,numLateFrames/number of times we were late to transmit a frame,Total resynchronization frames,playbackEnd/Total playback ended frames,mx_proc/Highest SatMixer processing time,tx_proc/Highest SatTx processing time}; "HT Audio Satellite TX General"; SBC encode path: 'unexpected sbc config result expected=%u->%u got=%zu->%zu', 'invalid number of frames per sbc packet %zu', 'encode error %zd', 'unexpected sbc encode result expected=%u->%u got=%zd->%zd'; mesh send 'send to mesh failed %u' + 'could not send %s to satellite %s;%s. rc %d, error %d, %s, count %u'; socket opts 'could not set TOS 0x%x for ht %d'/'could not set QOS %d for ht %d'/'network io non-blocking'; 'Request resyncLocked'; param change traces 'bass change %i -> %i','treble change %i -> %i','loudness change %d -> %d','Loudness SPL = %d, scaling = %d','vol change %u (%u%%) -> %u (%u%%)','extsrc vol change %u, %u -> %u, %u'; mixer loops mixgm.select.read (group-mixer) + mixsat.select.read (satellite); stream lifecycle 'Input stream changed to %s','Stream %s idle','numSamplesAvailable < REQUIRED_SAMPLE_UNIT_TIME - %zu < %d','Start sending stream %s','Stream %s drained','numSamplesAvailable < numSUTsRequested - %zu < %zu'; satellite add/remove 'could not add satellite %s','satellite %s;%s, model %s, added to ht config','satellite %s removed from ht config','Failed to find event object %s for releasing','No Expanded Channel Map for Requested Channel'; 'sat pkt: %zu channels, %zu samples ea.'; sat-add guards 'secondary device %s not found','incompatible secondary device %s','Add HT Sat.  New map: %s'

- **name:** HT audio satellite TX stats
- **control_frames:** htsat_tx control frame = 16 bytes {u8 code, payload/pad 15B}; header region ctx+0x9b4-0x9bb = {zeros x7, type=0x36}; 'invalid control frame. len (%u) vs (%zu)' is the TX-side length check (f_104f0d6c region).
::: details Evidence (1)

- @ 0x10ee5c90; ht tx stats

:::


:::

## `http_client`

**coverage** `partial`

The HTTP client: the machinery for outgoing web requests. Every call the player makes to services, the cloud, or other players goes through here.

::: details Technical details

sonos::http::performAsync; errors {"not scheduled. No active thread pool available. Cancelling.","Client not setup","HTTP request attempted with empty URL","Curl error (%d): %s","Request timed out in %lld ms","curl_multi_perform/poll/info_read"}; perf counters {taskCount=tasks actively processed,mainLoopIteration=main loop time}; asio categories {generic,std:unknown,asio.netdb,asio.addrinfo,asio.misc}; netdb errors {Service not found,Socket type not supported,Host not found (authoritative)/(non-authoritative),"query valid but no data","non-recoverable database lookup"}; misc {Already open,End of file,Element not found,"descriptor does not fit into select fd_set"}; io_service {epoll re-registration,Invalid service owner,Service already exists,sonosAsyncThreadPoolCond,sonosAsyncWorkGuard}; bundled curl internals exposed: happy-eyeballs ladder ('connect attempt #%d successful','checked connect attempts: %u ongoing, %u inconclusive','happy eyeballs timeout expired, start next attempt','starting %s attempt for ipv%s -> %d','restarted baller %d -> %d','HAPPY_EYEBALLS timeout due, re-evaluate','Connection timeout after %lld ms','discarding oldest attempt to keep limit','all attempts inconclusive, restarting one','no more attempts to try','baller %d: result=%d'); SPDY layer errors {Unsupported SPDY version,Invalid frame octets,Data transfer deferred,No more Stream ID available,Stream was already closed or invalid,Stream is closing,The transmission is not allowed for this stream,Stream ID is invalid,Invalid stream state,Another DATA frame has already been deferred}; HPACK static-table name strings (keep-alive,set-cookie,user-agent,:authority,retry-after,max-forwards,last-modified,if-none-match,accept-ranges,accept-charset,accept-language,accept-encoding,content-language,www-authenticate); async_http_client error enum {CONNECTION_ERROR_WRITE,HTTP_ERROR_POST_FAILED,HTTP_ERROR_RETURNED,HTTP_ERROR_MALFORMED_URL,HTTP_ERROR_TOO_MANY_REDIRECTS,UNKNOWN_ERROR}; curl guards 'Can't call curl_multi_wakeup: curl not initialized.','Failed to set CURLOPT_URL.'/'CURLOPT_HTTPHEADER'; inter-player proxying 'Forwarding request to player %s at %s'; result logging 'Unexpected result for %s request to %s. Reason: %s','%s response for %s request to %s. HTTP status: %d'; bundled curl state tags {TCP-ACCEPT,LIB-IDS,HTTPS-CONNECT,HAPPY-EYEBALLS} + version '1.47.0'

- **name:** async HTTP client (curl multi + asio)
::: details Evidence (1)

- @ 0x10f92844; http client

:::


:::

## `httpcache`

**coverage** `partial`

The web cache manager: hash-based invalidation shared across the LAN, mount checking for the writable partition, and per-key status tracking. This is why artwork and metadata stay consistent across players, because invalidation propagates.

::: details Technical details

hash-based invalidation {cacheHashes,"\[%s\] Cache not found. Cannot invalidate.","\[%s\] Invalidated local cache","\[%s\] hashLocal = %s","\[%s\] hashRemote = %s","\[%s\] Invalidating remote caches"}: propagates invalidation to remote players; /jffs mount check via statvfs + /proc/mounts; null hash 12 zeros

- **name:** HTTP cache manager
::: details Evidence (1)

- @ 0x10ef4dac; httpcache block

:::


:::

## `hw_events`

**coverage** `partial`

The hardware-event layer: low-level system messages for buttons, orientation, and thermal events arrive on a dedicated thread, with overflow and malformed-message handling. How physical things happening to the box become software events.

::: details Technical details

hwmessagelib + NetLink multicastGrp + repeat interval; events selthrd.RHWEvtHandlerZP.{reset,data,except,timeout}; readEvent {overflow,unknown,readNextMsg ERROR}; button forwarding {'Forwarding button events','Disabling button event forwarding'} to private-IP-only target {Unable to translate address,Host not private IP,Invalid host IP,Invalid port no,socket errors}; FSM states {NOT_IN_HOUSEHOLD,PROCESSING_PLAYBACK,IN_DEMO_MODE,IN_RDM_MODE,IN_BUTTON_OBSERVATION_MODE,IN_TRANSFER_MODE,PROCESSING_JOIN,JOIN_CHIME_UNAVAILABLE,REGISTRATION_CHIME_UNAVAILABLE,BUTTONS_LOCKED,DAT_IN_BUTTONLESS_SETUP_MODE,DAT_IN_SETUP_DISCOVERY}; setup combo {VOL_DN|VOL_UP starts timer → setup-ready on pop, VOL_UP+VOL_DN timer popped}; '%s press/release count = %zu'; '%s ignored in notify mode'; 'Disallowed action (%d - %s) because (%d - %s)'; 'inline action'; allowPlaybackRequests; 'collecting triggered diags'; 'enter %s household mode'; 'cancel join household mode'; PLAYPAUSE; '%s button pressed (cid)'; 'Play button held'; orientation {old->new,orientation_change,syslib orient}; led_diags {'Diag mode:%u, leftMS:%u; timeMS:%u; next mode: %u','set diag mode:%d'}; setup {'join hh','enabling wifi and %s','signaling netstartd (%s) %s',openap}

- **name:** hwevt_handler: button/orientation/thermal
- **status_schema:** <HW Name="CurrentStatus"><Orientation/></HW> + <HWMembers Name="Members"><State/><Flags/><MicFlags/></HWMembers>
- **version:** 7.31.0-test
::: details Evidence (1)

- @ 0x10ec6db8; hwevt block

:::


:::

## `ibt`

**coverage** `partial`

Intended-target fan-out: a single modern-API command can name a set of target players, and this planner expands it into per-target executions after validating that the command supports fan-out and each target parses. This is how the app sends one 'set volume' to a whole room instead of issuing per-player calls.

::: details Technical details

plan {"already generated ibt plan, no action taken","executing ibt plan for command (%s)","failed to generate target list","failed to generate ibt plan"}; intendedTargets param {"implicit target parsed \[%s\]","explicit target parsed \[%s\]","invalid intendedTargets parameter","command does not support intendedTargets parameter","invalid muse command body format"}; dispatch "\[dispatch\] unsupported IBT command (%s)"; JWT {"Unable to parse JWT token","Unable to load root bundle","Can't get client device certs","JWT cert validation finished: %s"}; ibt log domain; enablePitchfork flag

- **name:** IBT: intended-target command fan-out
- **target_param_check:** intendedTargets support is decided by a per-command declared-param match, not a static whitelist table: f_10a1cc00 builds {name,namelen} ranges from the command's registered param list and a memcmp chain (f_10a1dbxx region) tests for 'intendedTargets'. No route spec declares it -- it is a transport-ctx parameter (ctx {householdId,intendedTargets,explicitTargets,muse-async-cmd-id,upnpAnacapaPort}); commands opt in by declaring it in their param list at registration. The exact opt-in command set is therefore data-driven from the runtime command registry -- static ceiling for the whitelist.
::: details Evidence (1)

- @ 0x10fac620; ibt block

:::


:::

## `inprocess_events`

**coverage** `partial`

The in-process observer registry: named observers register per subject, and power-sensitive listeners are flagged. This is the publish-and-subscribe fabric under the modern-API events for components inside the same process, letting one subsystem tell another that something changed without any network involved.

::: details Technical details

subject.h; Registering/Unregistering "%s" observer "%s". Total observers: %zu; observer-name fmt %s-%s (ie-obs); PlaybackEvent; flags {enableSemiSleep,enableHTSourceSleep}; TTM {secondary,useCase,attempts,"We timed out on %zu devices after %u attempts",msTTM,msDRP}; fmts {%d:%d.%06d,%d:%d.%6d}; errors {I/O Error: 0x%x. HTTP Result: %d uri: %s,recurse,redir,unsupported}; ie-schd,ie-cache

- **name:** inprocess-events observer registry
::: details Evidence (1)

- @ 0x10e86c88; inprocess-events

:::


:::

## `interrupt_reasons`

**coverage** `partial`

The playback-interrupt reason codes: the 'why did my music duck or stop' taxonomy covering cloud commands, TV playback, AirPlay, audio clips, speaker detection, fixed volume, room detection, remote control, and voice-assistant playback. It records why playback stopped, powering the diagnostics that explain unexpected quiet.

::: details Technical details

{CLOUD,HT_PLAYBACK,HT_POWER_STATE,AIRPLAY,AUDIO_CLIP,SPEAKER_DETECTION,FIXED_VOLUME,ROOM_DETECTION,IR_CONTROL,ALEXA_CBL}; CEC errors {CHARGER_NOT_COMPATIBLE,CONFIGURING,NO_LOGICAL_ADDRESS}

- **name:** playback interrupt/source enum
::: details Evidence (1)

- @ 0x10facb9c; interrupt enum

:::


:::

## `iocompress`

**coverage** `partial`

The compression wrapper: shared helpers that compress and decompress buffers, used for saved queues, replication payloads, and anywhere compact storage saves space. It wraps a standard compression library with per-stage failure logging.

::: details Technical details

RCompressBuffer {deflateInit2,deflate,deflateEnd failed} + RDecompressBuffer {inflateInit2,inflate,inflateEnd failed}; socket-opt line 'r: %d smwb %u cmwb %u sncto %d cncto %d' (send/recv mbuf watermarks + connect timeouts); 'failed to init deflate/inflate stream op %d','expected empty deflate block not present; len %zu','deflate failed rc %x','deflate out buffer requirement not met %zu'

- **name:** iocompress: zlib buffers
::: details Evidence (1)

- @ 0x10ec7c08; iocompress block

:::


:::

## `ir_learn`

**coverage** `partial`

The infrared learning flow: multi-pass signal capture with repeat-style detection and tolerance checks, rejecting codes that don't fit the cloud IR database's format. It captures an unknown remote's signals during setup so the speaker can respond to it, which is the implementation behind the remote-teaching commands.

::: details Technical details

htaudio.cxx IR subsystem: code lists vol_up_codes/vol_down_codes/vol_mute_codes/input_codes (bounded); learn FSM passes{1,3} redundancy checks "first and third passes have different sizes"/"don't match"; repeat styles {alternating,repeating,non-repeating}; one-button learn with timeout (UPNP_DP_LEARNONE_IR_CODE_NOT_FOUND); config /opt/ir/irconfig.txt; cloud database http://ir.ws.sonos.com/IRCode/: submit <IRCode><code><value><guid> XML (guid from //dev//urandom), query "Requesting: %s" -> "Code found for remote id \[%s\]"; embedded remote-name table {Sharp,LG/Haier L32D1120,Samsung,Panasonic,Toshiba,Mitsubishi,Philips,Pioneer,Dynex,RCA 46LA45RQ,Orion SLED3280,Mitsubishi WD-65638/60738,JVC JLC42BC3000/LT-19E610,Seiki LC-32B56,SuperSonic SC-240/491,ViewSonic VT4210LED/VT3205LED,Loewe}; "Denylisted pyle!"; "Outstanding codes yet to be learned: Lengths are: %d, %d, %d"

- **name:** IR learn + cloud IR database
::: details Evidence (1)

- @ 0x10ea6550; htaudio.cxx IR block

:::


:::

## `json_parser`

**coverage** `partial`

The bundled JSON parser: its error vocabulary covers exceeded depth, invalid escapes and characters, unexpected tokens, and out-of-memory, which are the failure modes any JSON-reading endpoint can hit. Every JSON-speaking component decodes through this one library.

::: details Technical details

error enum {Exceeded max depth,Invalid unicode escape,Invalid escape,Invalid string character,Invalid numeric character,Unexpected token,Sequence too long,Missing required value,Invalid value,Out Of Memory,Unexpected error}

- **name:** embedded JSON parser error enum
::: details Evidence (1)

- @ 0x10f05a74; json error enum

:::


:::

## `json_schema_validator`

**coverage** `partial`

The JSON document validator used by local settings: it checks a decoded document against its expected shape, covering required fields, size limits, uniqueness, and cross-field dependencies. Every settings write is checked against the schema before persistence, and it's the machinery behind the modern API's field-by-field request validation.

::: details Technical details

keywords {patternProperties,maxLength,minLength,maxItems,minItems,dependencies,maxProperties,minProperties,required,additionalProperties,uniqueItems,instanceRef,expected,duplicates,disallowed,exclusiveMaximum,exclusiveMinimum,additionalItems,properties,fileFormatVersion,targetTypes,readPerm,writePerm}; "\[Vf\] ValidationFailureMsg\[%s\] %s"; schemaValidator; groups {playerUI,playerBasic}

- **name:** JSON Schema validator
::: details Evidence (1)

- @ 0x10fb0ca0; schema validator

:::


:::

## `lechmere_wss`

**coverage** `partial`

The persistent secure-websocket channel between player and cloud, internally called 'lechmere'. It's the always-on pipe that cloud commands and modern-API calls arrive over, using a compact binary message format inside standard web framing. It's the link that makes your speaker controllable from anywhere, not just your home network.

::: details Technical details

lechmere.cxx cloud channel: RFC6455 WSS to lechmere.<env>.ws.sonos.com, negotiated subprotocol 'lechmere.<version>' (lechmere-v1 observed), inner TLV header layer ('failed to read lechmere header'), policy-key auth, app-level ping keepalive with 'TOO_MANY_UNACKED_PINGS' disconnect, and a full close-reason taxonomy driving reconnect decisions INNER FRAME FORMAT RECOVERED: 6-byte ASCII header {protocolVersion:2 chars, messageType:2 chars, extendedHeaderLength:2 chars} followed by extended header + payload (min frame len 6, checked cmpli 6 at f_105d539c). Parse errors 'Bad protocol version: %c%c', 'Bad message type: %c%c; %d', 'Bad extended header length: %c%c', 'could not recv extended header; expected %u read %u'. Message type validated via table lookup (f_11098e98 plt veneer); 2-char code registry AA..AK (.data 0x110941a4, 11 ptrs) dispatched via handler table built at f_10ac47fc region. Tunneled UPnP headers inside: 'x-sonos-method:', 'x-sonos-uri:', 'SOAPACTION:', 'X-Sonos-Udn'. Version str 'lechmere.%hhu%n'. AA..AK REGISTRATION DECODED: two consumers of the type table at 0x110941a4 found - f_10bd59xx walks entries 0..10 building records per code (2 lbz reads of each char, two calls to f_1082dfc0, entropy from mftb-based f_10809f0c, 0x100-byte alloc via plt 0x11098418); f_10bd65xx is a second walker (lwzu r28,\[r22+4\] over the table, counter 0..10) that strlen-checks each code (cmpli 0xf) and inserts it via f_10806d50 seeded with magic 0xc70f6907 (hash-table insert keyed on the 2-char code) building a per-code context record {+0,+4,+8,+c,+1c fields}. The codes are therefore a FIXED set of channel/stream identifiers registered into a keyed dispatch structure - they are not individually special-cased anywhere in code, so per-code semantics are data-driven (opaque map keys), which is the static-analysis ceiling for AA-AK message-type meaning. .got2 0x1108de34 points at the adjacent namespace/verb registry (0x110941d4). TWO-LETTER-CODE LAYER RESOLVED: the same keyed-map machinery used for AA..AK registration (f_10806d50 insert, seed 0xc70f6907) is consumed by f_1082dfc0 lookups in \[Mm\] ingestMigrationDataIntoBitFieldAry (0x10bd65xx-0x10bd6axx): migration/patch data is parsed as two-character tokens, each token hash-mapped to a field-id (<0xa, cmplwi 0xa) which sets bit 1<<fieldId in a bitfield array at ctx+0x98. So the two-letter-code alphabet is a shared field/channel registry: message-type codes (AA..AK) and migration field codes live in the same class of keyed dispatch structure. REGISTRATION LOOP FULLY DECODED (0x10bd65a4): the walker counter is bound at 0xa - only TEN codes (AA..AJ) are registered, each into a 0x24-byte record {code-str, len, loop-index at +0x1c} hash-inserted via f_10806d50/seed 0xc70f6907 then map-inserted via f_10bd6ec4; failures unwind through f_10807034 deletes. AA..AJ are the ten location-settings MIGRATION FIELD ids (bit positions 0-9 in ctx+0x98 bitfield); AK, the 11th table entry, is not a migration field - it belongs to a different channel role. Component tags recovered in the adjacent code: \[Mg\] settings manager, \[Mm\] locSetMigMgr migration manager (migrationmanager.cxx, keys __migration_data, __location_summation, _settings.json), \[Pc\] patch-completion ingest (\[Pc\] completePatchAttributeIngest() type mismatch \[%s|%s|%u\] vT\[%d\] aT\[%d\]), \[Rq\] request authz (isAuthorizedForNamespace, subvert-read/write guards), \[Gp\] group settings, \[Vf\] ValidationFailureMsg. NOTE: the 'uuuuubtnufr' table at 0x10e88fd4 is NOT a type map - it is a JSON escape table (control bytes -> \u or named \b\t\n\f\r) used by the attribute JSON emitter at 0x10a01xxx.; websocket permessage-deflate negotiation params {server_max_window_bits,client_max_window_bits,server_no_context_takeover,client_no_context_takeover} + parser errors 'unexpected parameter encountered'/'unexpected token encountered'

- binary anchors: `websocket_lechmere`, `lechmere.event`, `wspmd`, `SONOS_FCS_DISABLE_PER_MSG_DEFLATE`, `SONOS_CLIENT_TOO_MANY_UNACKED_PINGS`, `SONOS_SERVER_LECHMERE_RECONNECT_LATER`, `SONOS_CLIENT_DATA_COLLECTION_OPTED_OUT`

- **endpoint:** lechmere.%s.ws.sonos.com: %s is the region/env token; Sec-WebSocket-Protocol: lechmere.%u
- **auth:** authzPolicyKeyLechmere; 'Could not parse role from lechmere policy key': role encoded in key
- **local_ws:** websocketserver.cxx serves /api/v1/websocket and /websocket/api with RFC6455 headers; opcode logs websocket(data/ping/pong/close/cont); disableWebSocketPerMessageDeflate config key
- **framing:** RFC6455 with per-message-deflate negotiation: 'wspmd' log domain, deflate/inflate stream ops, 'expected empty deflate block', 'deflate out buffer requirement not met'; config keys SONOS_FCS_DISABLE/ENABLE_PER_MSG_DEFLATE toggle it at runtime: 'FCS' is the internal name of this channel
- **close_reasons:** standard codes GOING_AWAY/PROTOCOL_ERROR/BAD_DATA/NOT_CONSISTENT/VIOLATED_POLICY/MESSAGE_TOO_BIG/SERVICE_RESTART/TRY_AGAIN_LATER/TLS_HANDSHAKE plus SONOS_* extensions: client-side (REGISTRATION_CERT_REMOVED/CHANGED, DATA_COLLECTION_OPTED_OUT (telemetry opt-out tears down the channel), ACCESS_TOKEN_EXPIRED, TOO_MANY_UNACKED_PINGS, READ/WRITE_ERROR, CUSTOMER_ID_CHANGED, AUTH_METHOD_CHANGED); player-side (SHUTDOWN, IP_ADDRESS_CHANGED, BLUETOOTH, POWERED_OFF, UPGRADE, NEW_SSID, LOW_BATTERY, SLEEPING, RECONNECT); server-side (LECHMERE_RECONNECT_LATER = server steering, PLAYER_UNSUPPORTED)
- **keepalive:** application-level ping/pong: client disconnects on SONOS_CLIENT_TOO_MANY_UNACKED_PINGS
- **frame_format:**
  - **header:** 6B ASCII: pv(2) type(2) extlen(2)
  - **msg_types:** 2-char codes, registry AA..AK @.data 0x110941a4
  - **tunneled_headers:** `x-sonos-method:`, `x-sonos-uri:`, `SOAPACTION:`, `X-Sonos-Udn`
  - **parser:** f_105d539c
- **handshake:** Sec-WebSocket-Protocol: lechmere.%u offered; server response's Sec-WebSocket-Protocol header is parsed back with 'lechmere.%hhu%n' sscanf (f_105d45f8) to confirm the negotiated version; the HTTP 101 Date: header is also consumed: wall-clock sync from the upgrade response
- **lifecycle:** 'IP changed. Bouncing connection': local IP change tears the channel down (SONOS_PLAYER_IP_ADDRESS_CHANGED close reason); authzPolicyKeyLechmere carries a role field ('Could not parse role from lechmere policy key')
- **tunnel_headers:** extended-header vocabulary: 'x-sonos-method:', 'x-sonos-uri:', 'SOAPACTION:': lechmere frames carry virtual HTTP request lines, i.e. UPnP/SOAP actions are tunnelled through the websocket as pseudo-HTTP; upgrade request adds X-Sonos-Udn; 'protocol version negotiation failed due to unknown version (%s)' on mismatch
- **status_fields:** connection-status record fields: status, protocolVer, reason, code, retry, uptimeMs, transport, closed/failed/opened: the lechmereConnection status doc
- **clock:** 'could note use Date header for trusted clock seed: %s': the HTTP 101 Date: response seeds the trusted clock
- **auth_fields:** policy-key record fields: userId, policyKey, museVersion
- **reader_dispatch:** the reader returns a 0..10 code dispatched through a PIC jump table at 0x10ef12c8 in the ws-client read loop f_1059c088. Cases: 0-1 EVENT-class frames ('Unexpected TYPE EVENT' logged; loop continues); 2 HTTP-tunnel frame ('support for HTTP message dropped': the HTTP-over-lechmere tunnel is deprecated/dropped in this build on the OUTBOUND client path; the tunneled-UPnP pseudo-headers seen elsewhere belong to the server side /api/v1/websocket); 3 the real inbound command frame (payload queued at ctx+0x1f8, timestamped +0x310); 4 -> f_1070d01c (registration/ack-class frame); 5 SET_CONFIG-class (registration write; errors 'SET_CONFIG failed to read'/'failed to send registration'); 6 CHECK_CONFIG-class ('CHECK_CONFIG failed to return registration'); 7 'Unrecognized message type' (reader reject); 8 'read timeout'; 9 'read error'; 10 clean end-of-frame continue.
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
- **payload_parser:** f_105d4ff4 (pseudo-HTTP request parse on the frame payload: line-scan via memchr('\n'), strips the '\r' line-ending, then strncasecmp header names {x-sonos-method: (0x10), x-sonos-uri: (0xd), content-length: (0x10), SOAPACTION: (0xc), X-Sonos-Udn}) i.e. the lechmere frame body is a tunneled minimal HTTP request carrying UPnP/SOAP control to the cloud. The 2-char frame messageType IS the AA..AK code set; 'Bad message type: %c%c; %d' fires when the code is not in the registered table. AA..AJ are also reused as the ten location-settings migration field-ids (the same keyed map); AK is registered in the type table but excluded from the migration walker: a non-migration lechmere message type.
::: details Evidence (14)

- @ 0x10e75541; lechmere.event
- @ 0x10ee71a0; lechmere.%s.ws.sonos.com endpoint template
- @ 0x10ef64e0; Sec-WebSocket-Protocol: lechmere.%u
- @ 0x10ef9d2c; lechmere policy key role parse
- @ 0x10f1706c; wspmd per-message-deflate log domain + deflate op codes
- @ 0x10f1714c; close-reason enum: RFC6455 codes then SONOS_CLIENT_/PLAYER_/SERVER_/FCS_ extensions
- @ 0x10f172b6; SONOS_CLIENT_TOO_MANY_UNACKED_PINGS: app-level keepalive
- disassembly
- disassembly
- @ 0x10ef168f; 'IP changed. Bouncing connection'
- @ 0x10ef6568; x-sonos-method/x-sonos-uri/SOAPACTION pseudo-headers: SOAP-over-WS tunnel
- @ 0x10ef66d8; 'trusted clock seed' from Date header
- @ 0x10ef63f4; lechmereConnection status field set
- @ 0x10ef63e0; lechmere.cxx literal block: frame header fields, headers, conn event keys, error vocabulary

:::


:::

## `led_engine`

**coverage** `partial`

The status LED is a scripted animation system: patterns are small programs of color steps with hold and fade times, selected by internal state codes for conditions like setup, muted, playing, and device errors. Hardware capability flags adapt it to models with different light configurations. The on/off setting you see in the app is just the visible tip of this machinery.

::: details Technical details

Scripted LED animation engine: <LedPatternInfo> docs hold <LedPatternEntry time led_ids repeats steps> programs of <LedStepEntry rgb hold fade> steps, serialized with cksum+flags; R_LED_* codes select the default pattern; SetLEDState toggles the user-visible on/off only

- binary anchors: `<LedStepEntry`, `R_LED_BEGIN_SETUP_MODE`, `/jffs/app/debug/sonosledmgrd.dmp`, `<LedStepEntry`, `cksum=%08x, flags=%04x`, `resumeDefaultLEDPattern`

- **program_schema:** <LedPatternInfo><LedPatternEntry time="%s" led_ids="%08x" repeats="%u" steps="%u"><LedStepEntry rgb="%06X" hold="%u" fade="%u"/>...</LedPatternEntry></LedPatternInfo>; serialized blob header 'cksum=%08x, flags=%04x repeats=%u num_steps=%u led_ids=%08x'
- **hardware_map:** setHwFeatures: bHasMicrophone, bHasMuteLED, bHasStatusLED, bHasOnlyStatusLED, bHasHardwareLedSwap, bCanSetWhiteBrightness: per-model LED capability flags; 64-bit m_lLEDFlags state word
- **state_machine:** applyLEDModeLocked tracks m_fLedBrightness, m_nextLedPatternPriorityLevel, m_lastClr, m_fade_effect; interacts with BT mode (m_bIsInExclusiveBTMode/m_bIsBTConnected) and aux toggle; feedbackFlash + executeDiagMode + updateCaptouchBrightness + setLEDBrightness entry points; 'led_set_resumeDefaultLedPattern has bFlashMode set. Returning saved pattern'
- **default_patterns:** resumeDefaultLEDPattern maps R_LED_* to patterns: R_LED_BROKEN_DEVICE, R_LED_JOIN_HH, R_LED_BEGIN_SETUP_MODE, R_LED_IN_SETUP_MODE, R_LED_MUTED, R_LED_AUDIO_OFF, R_LED_PLAYING, R_LED_HHID (+ WAC/WAC_TIMEOUT/UPGRADE/etc. in the R_LED family)
- **unresolved:** pattern priority arbitration rules, the SetLEDState vs. override stack, which patterns correspond to which R_LED codes
::: details Evidence (7)

- @ 0x10e990a0; <LedStepEntry
- @ 0x10fbb0a5; R_LED_BEGIN_SETUP_MODE
- @ 0x10ea7f34; /jffs/app/debug/sonosledmgrd.dmp
- @ 0x10e99048; <LedPatternEntry> schema
- @ 0x10e990a0; <LedStepEntry rgb hold fade> step schema
- @ 0x10fba55c; setHwFeatures LED capability flags
- @ 0x10fbb590; resumeDefaultLEDPattern R_LED_* mapping

:::


:::

## `led_hw`

**coverage** `partial`

The LED hardware feature map: per-model booleans covering whether the unit has a microphone light, a mute light, only a status light, or brightness control. This is why the mute light is separate from the status light on some products, and it's the low-level end of the indicator.

::: details Technical details

setHwFeatures {bHasMicrophone,bHasMuteLED,bHasStatusLED,bHasOnlyStatusLED,bHasHardwareLedSwap,bCanSetWhiteBrightness}; leds_zp; "After ~RLEDsZP"

- **name:** HW LED feature flags
::: details Evidence (1)

- @ 0x10fba544; led hw block

:::


:::

## `libsonos_certval`

**coverage** `partial`

Device-certificate verification lives in its own shared library, separate from the main player code. It checks a presented certificate against a bundled set of roots, honors a fallback bundle, and watches for bundle updates at runtime. The practical effect is that trust for device identity is maintained as a separate, updatable component rather than baked into the program.

::: details Technical details

shared lib (1.7MB, stripped but dynsym-rich) implementing sonos::certval::validate(sonos_device_x509_fields*, mbedtls_x509_crt* cert, ca_crt, crl, profile, name, flags, cb...) + sonos::RootCACertBundle: the whole device-cert verification pipeline lives HERE, not in anacapad; that's why CSR/body internals are thin in the main binary

- **name:** libsonos-certval.so.2: device-cert validation + RCB root bundles
- **rcb_bundle_format:** .rcb files (sonosRcb* C API): sonosRcbParseHeader + sonosRcbParseManifest + sonosRcbParseCerts (header/manifest/cert-chain container; version string '%hhu.%hhu-%u'; directory scan 'Scanning %s for best cert bundle' picks highest version; root_certs_metadata.txt alongside; fallback /etc/fallback_trusted_roots.rcb; atomic write via '%s.tmp' rename; inotify-watched hot reload) 'Cert bundle (%s) modified: inotify event' + hash re-verify 'modified: bad hash' '%s (original) vs %s (calculated)'; refcounted via addRef; 'Removed bad/unused cert bundle' pruning; status enum SonosRcbStatus_t + sonosRcbStatusToString
- **validation_semantics:** messages: 'local cert validation succeeded for %s (local port %u)' / 'Sonos device %scert had bad params (local port %u)' / 'Sonos device %scert did not match %s '%s' (actual %s)' = SAN/name matching / 'local %scert validation failed Sonos field checks for %s' = custom sonos_device_x509_fields gate / 'local %scert validation failure ... ignored due to allowlisted hostname' = hostname allowlist bypass / 'Cert validation failed due to cert bundle error: %s' / 'Unable to load root cert bundle file: %s' / 'Cannot parse %s certs. Bundle is invalid' / 'Parsed %llu %s certs (failed to parse %llu certs)'
- **api_surface:** exports: sonosCertval{Initialize,Cleanup,Validate,SetSSLToSonosDevice,GetSonosDeviceRootCAs,GetSonosDeviceRootsForEnv}; sonosRcb{Init,Free,ParseHeader,ParseManifest,ParseCerts,ParseCertsCopy,StatusToString}; RootCACertBundle::{initialize,cleanup,loadCertBundle,getBundle(CertType,..),getRootCerts,getRootCertsAddToChain,copyRootCertsAddToChain,getMetadataFilename,hasDynamicCertBundle,formatVersion,id,version,addRef,free} + statics s_certBundle/s_fallbackBundle/s_bundleTrackingList/s_bundleLock/s_trustDevCerts/s_getEnvironment/s_fallbackBundleFilename
- **notes:** CertType distinguishes bundle pools; getRootCerts takes std::function filter/select callbacks incl a SonosRcbStatus_t(u8,u8,u8,u8,const SonosRcb*,x509*,u32*,x509**) selector; dates parsed via '%m/%d/%y'; 'CERT_INVALID' literal; imports are ZZ*-obfuscated ordinals (same patched-toolchain export scrubbing as anacapad)
- **rcb_shipped_layout:** SHIPPED FILE etc/fallback_trusted_roots.rcb decoded at byte level: magic 'rcbundle\x00' @0; u16 ver-hi + version string '78.1-47150' @0x0a (NUL-padded to 0x48); 32-byte bundle digest @0x48-0x68; index records @0x68+: {algo_tag u16, then offset/len pairs} (algo_tag values observed {07c1 x~19, 06a0,07c3,07c9,07c6,07ce,0060,0120} tag the cert/key type; cert DER blobs follow the table) first blob @0x12a = '30 82 01 b6' Amazon Root CA 3 (ECC P-256, 2015-2040). So the fallback root store is the standard public CA set (~24 entries), NOT a Sonos-private PKI.

:::

## `load_content`

**coverage** `partial`

The 'load content' verb family of the modern API: loading a container, a stream, a favorite, a playlist, or a track list, with a whitelist of item types. This is the modern-API entry point for 'play this thing', the step between browsing a service and actually playing its content.

::: details Technical details

verbs {loadContainer,loadStream,loadFavorite,loadPlaylist,loadTrackList} with guidance "Use playback#loadTrackList to load tracks"/"Use playback#loadStream to load streams"; item types {spotify.connect,linein.homeTheater.spdif,linein.airplay,trackList.program,episode.podcast,chapter.audiobook,homeTheater-input,TV Audio}; meta json paths {/containerType,/containerName,/name,/explicit,/durationMs,/artist,/imageUrl,/releaseDate,/mimetype}; errors {Invalid favorites directory state,Invalid content resolver state,Account error,Invalid serviceId,Could not find default account for serviceId,SID mismatch lookupAccountByUDN vs RMuseUniversalMusicObjectId,Could not find UDN,serviceId is not associated with accountId}; "cannot enqueue item; %s queue is full (%zu items added, %zu items enqueued)" + "item.id tracking is out of memory"; local-library + r:contentService + /getaa? art; sn_%u/mhhid_ id prefixes; "RadioShow name/Id truncated"; shared|private visibility; protocolInfo http-get:*:%s:*

- **name:** favorites + loadContent resolution
::: details Evidence (1)

- @ 0x10ecf310; favorites/loadContent block

:::


:::

## `local_routes_2`

**coverage** `partial`

A second cluster of local routes bound through a path-matcher rather than the master route table: group and zone operations like create-group, unjoin, activate, duck, and member settings. They're recorded here because they don't appear in the primary route table.

::: details Technical details

paths {/createGroup,/unjoin,/activate,/deactivate,/duck,/unduck,/definition,/missingDefinition,/activeZone,/memberSettings}: cluster shares a path-matcher (no pointer table; PIC-formed literals)

- **name:** zone/group route paths + duck
- **testpoint_dispatch:** Testpoint handler: URL form 'testpoint?name=<name>.<method>' ('<h2>Bad Testpoint Request</h2>Usage: <pre>testpoint?name=&lt;name&gt;.&lt;method&gt;</pre>'); errors '<h2>Testpoint Dispatch Failed</h2>Check query params','<h2>Unknown Testpoint Name</h2>'.
- **support_forms:** Support-form surface: hidden csrfToken + FirstZP select (option 0 disabled/1 enabled) + PriorityBridge field; /support/directsubmit POST '<h2>%s</h2><form action="/support/directsubmit" method="POST"><input type="hidden" name="csrfToken" value="%s" ...'; confirmation 'Your confirmation number is: <strong>%u</strong>.'
::: details Evidence (1)

- @ 0x10fba3b4; route path cluster

:::


:::

## `log_domain_map`

**coverage** `partial`

Every log channel the program can write to names a subsystem boundary, and the 21 log domains are effectively a module map of the whole binary. It's useful when reading log output or diagnostic pages, because each line tells you which part of the system produced it.

::: details Technical details

21 anacapa.*.log sinks under /opt/log define the module boundaries; plus sibling-daemon logs and the /tmp/memorylog ring

- binary anchors: `anacapa.snf.log`, `anacapa.lechmere.event.log`, `anacapa.dc.log`, `/opt/log/anacapa.musecmdandrsp.log`, `/opt/log/anacapa.avt.play.log`

- **domains:** anacapa.log (main), alarm.job, avt.play (AVTransport playback), chsrc.state (CHSRC source bus), dc (direct control?), ext.audio.action, gm.events (GroupManagement), hdmi, ht (home-theatre), hw.events, lechmere.event (WSS channel), musecmdandrsp (muse request/response trace!), musedebug, museevt (muse events), rc.upnp, snf, spotify.debug, spotify, sps, trueplay, tv, vl (line-in)
- **siblings:** btmanager, btservice, chronyd, dropbear, ledmgr.debug, mdnsd, netstartd, sddpd, sonosledmgrd, udhcpc, wacd, wpa_supplicant
::: details Evidence (4)

- @ 0x10e755e1; anacapa.snf.log
- @ 0x10e75539; anacapa.lechmere.event.log
- @ 0x10e754a1; anacapa.dc.log
- @ 0x10e75434; full /opt/log/anacapa.*.log table

:::


:::

## `log_domains`

**coverage** `partial`

The log-domain map: per-subsystem log files under the device's log directory, the main program log, and the categories config file. The domain name in a log line maps to exactly one of these, and the severity and filtering machinery decides what gets written and where.

::: details Technical details

files /opt/log/anacapa.{alarm.job,avt.play,chsrc.state,dc,ext.audio.action,gm.events,ht,hdmi,hw.events,lechmere.event,musecmdandrsp,musedebug,museevt,rc.upnp,snf,spotify,spotify.debug,sps,trueplay,tv,vl}.log + anacapa.log + /jffs/app/log/anacapa.log.backup; conf {/opt/conf/anacapa.conf,/jffs/conf/anacapa.conf}; "Capped MaxConn value %d to %d. Edit anacapa.h to increase cap."; ZPSTR_BUFFERING state; R_TrialZPSerial key

- **name:** anacapa log-domain map
::: details Evidence (1)

- @ 0x10e7543d; log domains

:::


:::

## `longpress`

**coverage** `partial`

The long-press button behavior: holding the play button cycles through 'cloneable' group coordinators, which is what lets a held button clone another room's queue. It distinguishes a held button from a tapped one, providing the timing logic behind press-and-hold actions.

::: details Technical details

GC list {head,tail,current} of cloneable group coordinators; "cycling to %s:%s"/"end of list reached"; tracked GC actions {Adding new GC,Moving GC to head,Removing GC,"Updating last PAUSED/STOPPED GC","Last GC in HH to change playback state is no longer cloneable",Untracked GC action}; "not joinable"

- **name:** longpress: GC-clone cycling
- **setup_ready_combo:** VOL_UP+VOL_DN combo: each press starts a timer ('VOL_UP starts timer, when pops, switch to setup-ready mode' / 'VOL_DN starts timer...'); holding both pops the timer and the device switches to setup-ready mode ('VOL_UP + VOL_DN timer popped, switching to setup-ready mode' and inverse order): the physical-button path into setup/join flow. Button presses can also tear down grouping: 'Becoming standalone due to button press'.
::: details Evidence (1)

- @ 0x10ec9b7c; longpress block

:::


:::

## `mdns_controller`

**coverage** `partial`

The discovery-service controller: register-once guards, record populate/update/remove with duplicate suppression, and startup of player discovery. The code that publishes this speaker's presence on the local network.

::: details Technical details

Service lifecycle: register-once guard ("Attempted to register ... twice"), TXTRecord populate, value update/remove with dup guards ("ignoring duplicate value","ignoring removal of non-existant value"), unregister; player discovery "Unable to start mDNS player discovery; error %i" + QueryRecord; local. domain; "\[%s\] vs \[%s\]" compare

- **name:** mDNS service controller
::: details Evidence (1)

- @ 0x10f0671c; mdnscontroller region

:::


:::

## `mdns_discovery`

**coverage** `partial`

The discovery half: record-key enumeration, gone-reason updates, a compatibility check for older or incomplete records, and household filtering so foreign speakers get ignored. How the player decides which discovered devices are family.

::: details Technical details

'Error enumerating key %zu in TXT record: %i'; 'QRCB: Update bye-bye reason to %s'; compat "Sonos mDNS TXT record for '%s' is older version or missing keys"; household filter '%s is not in our household: discovered:%s - ours: %s'; notify 'Notify topology of %s at %s; bootseq=%u; ports={%u-%u}; mdnssequence={old %u new %u}'; stub://stub:%u URI; {'Restart mdns discovery','mdns Browse callback error %i','%s is local; ignoring','Unknown player %s went bye-bye','Discovered new player %s'}; device-discovery datastore: 'topo_datastore' keys {dd_in_hh,dd_in_ver}, 'ip cached (%s) with new discovery url (%s)','invalid discovery url (%s), no IP will be assigned','Handled device props for %s (%s)','Error: software version string (%s) failed to parse'

- **name:** mDNS discovery
::: details Evidence (1)

- @ 0x10f06a34; mdns discovery

:::


:::

## `media_player_abstraction`

**coverage** `partial`

Beneath the transport commands sits a plug-in layer of source implementations, one per stream type such as line-in, TV, Spotify, or AirPlay-style sources. Each plugs in through the same interface, so the transport commands you call work identically regardless of which source is actually playing.

::: details Technical details

source plug-in layer under AVTransport: media_player_mgr + media_player_autoplay + media_player_vli_ctrl + extaudiosrc + ai_impl_base define the source vtable; autoplay system (StartAutoplay, AutoplayRoomUUID, AutoplayVolume, linked-zones expansion, silence thresholds, alarm/buzzer fallback) routes line-in/TV/Spotify-VLI sources to the coordinator; htaudio_autoplay.cxx handles TV autoplay; ChirpExtAudioSrc plugs acoustic input in as an ext source; media_player_mgr runs under 'mediaplayermanager' domain; VLI session control guarded by scopeVliCtrl lock; third linein source class object.item.audioItem.linein.bluetooth present

- binary anchors: `media_player_mgr.cxx`, `extaudiosrc.cxx`, `ai_impl_base.cxx`, `media_player_autoplay.cxx`, `StartAutoplay`, `ChirpExtAudioSrc`

- **plugins:** media_player_mgr.cxx (manager), ai_impl_base.cxx/ai_impl (audio-input impl base), extaudiosrc.cxx + extaudiosrc_playid (external sources), media_player_vli_ctrl.cxx (virtual line-in control), htaudio_autoplay.cxx (TV), ChirpExtAudioSrc (acoustic)
- **autoplay:** StartAutoplay; GetAutoplayRoomUUID/SetAutoplayRoomUUID target room; AutoplayVolume + UseAutoplayVolume + Get/SetUseAutoplayVolume; SetAutoplayLinkedZones + 'Found %zu linked rooms during StartAutoplay'; <AutoPlay><Mode><SilentSeconds> XML + HTASilenceThresholdAutoPlaySec + 'Triggering autoplay. Ignore Silence Threshold'; AutoPlaySettingsEvent; 'lonely local line-in autoplay'; alarm path 'Failure loading autoplay %s (alarm: %d, buzzer fallback: %d)'; DEFAULT_AUTOPLAY_LINEIN + vhautoplaytv/autoplay_tv; 'preventing autoplay because operation is overridden'
- **vli_autoplay:** 'using VLI to autoplay Spotify SMAPI URI: %s', 'setTransportToVLIStreamURI; URI: %s; autoplay: %d; become gc: %d': VLI streams carry external sources including Spotify SMAPI URIs, optionally promoting this player to group coordinator
::: details Evidence (6)

- @ 0x10ecb98a; media_player_mgr.cxx
- @ 0x10ec01ea; extaudiosrc.cxx
- @ 0x10eacdc2; ai_impl_base.cxx
- @ 0x10eb1b4c; 'using VLI to autoplay Spotify SMAPI URI'
- @ 0x10eb2930; linked-rooms expansion in StartAutoplay
- @ 0x10f26b80; <AutoPlay><Mode><SilentSeconds> XML

:::


:::

## `media_player_mgr`

**coverage** `partial`

The media-player registry: each playback session is tracked with its identity, port, and security settings, plus lifecycle events as players register and shut down. It's the bookkeeping behind 'which playback objects exist right now'.

::: details Technical details

actor model: target key {uuid,ix,port,ssl,mtls} (overlap check); "found actor for %s"/"found backup for %s"/"%s target \[%s\] for type %d resolved to %s"/"no actor available"; lifecycle register/create/shutdown; per-player config dir + anacapa_logger.toml; /localsettings.txt; Player%s naming

- **name:** mpmgr: MediaPlayer actor registry
::: details Evidence (1)

- @ 0x10ecb874; media_player_mgr.cxx

:::


:::

## `memmon`

**coverage** `partial`

The memory monitor: reads `/proc/meminfo` (MemAvailable, MemFree) plus per-process statm/cmdline, writes rotating logs to `/tmp/memorylog/log.N`, and emits 'memory report avail/free' records with a skip counter. Low-memory pressure reports are how OOM-adjacent bugs get diagnosed. Watches memory usage and feeds diagnostics plus the safeguards that act when memory runs low.

::: details Technical details

reads /proc/meminfo {MemAvailable:,MemFree:} + /proc/%s/{statm,cmdline}; writes /tmp/memorylog/log.%d (+.old rotation); vars {memlog,memavailable,memfree,memory_status,memmon}; "memory report avail=%s free=%s"; "report skipped %s (count: %u)"

- **name:** memory monitor
::: details Evidence (1)

- @ 0x10f06588; memmon region

:::


:::

## `memory_monitor`

**coverage** `partial`

The memory monitor: the threads that sample and log memory usage over time, including skip counts so missed samples are visible. It provides the data behind 'the player was low on memory' diagnostics, tracking allocation and pressure across the program.

::: details Technical details

reads /proc/meminfo {MemAvailable,MemFree} + /proc/%s/{statm,cmdline}; logs to /tmp/memorylog/log.%d with .old rotation; "memory report avail=%s free=%s"; "report skipped %s (count: %u)"; fields {memavailable,memfree}; threads memlog/memmon/memory_status

- **name:** memmon: memory tracking
::: details Evidence (1)

- @ 0x10f06588; memmon block

:::


:::

## `mntmgr`

**coverage** `partial`

The shared-folder mount manager: shares get mounted under the device's temp directory, trial mounts probe dialect support, duplicates are deduplicated, a max-share count is enforced, and idle shares get unmounted. It's the filesystem layer behind 'the library reads my NAS folders'.

::: details Technical details

mount points /tmp/smb/%d_%d + trial /tmp/smb/tmp%d_%u; "already mounted unc=%s share=%s loc=%s"; "too many shares mounted"; trial mount "Trial mount found unsupported protocol: %s (strike %d/%d)" + "flagging %s as failed"; "not http mounting %s as %s"

- **name:** mntmgr: SMB mount manager
::: details Evidence (1)

- @ 0x10ece5d0; mntmgr block

:::


:::

## `model_sku_vocabulary`

**coverage** `partial`

The model identifiers and product names embedded in the firmware for capability checks, covering the internal codes for each hardware flavor. These are what let the firmware report which features a given model supports.

::: details Technical details

51 ZPSnn model identifiers enumerated in the capability-conditional table: ZPS{1,3,5,6,9,11-24,26-46,48,49,51-59,61}; capability gating is per-model-ID; display-name entries incl 'Connect:Amp','(Unknown)','RylesS767'

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
::: details Evidence (3)

- @ 0x10f249a4; ZPS9
- @ 0x10e741dd; HwFeatures
- @ 0x10f2490c; ZPSnn identifier table (two rodata runs)

:::


:::

## `model_table`

**coverage** `partial`

The model-compatibility table: every model ID this build recognizes, with the local unit being the Playbar entry. Use it to map a firmware build to the products it can run on, and an unknown ID means 'not a supported model' at validation time.

::: details Technical details

models recognized by this build: {ZPS1,ZPS3,ZPS6,ZPS9(this unit),ZPS11,ZPS12,ZPS13,ZPS14,ZPS15,ZPS16,ZPS17,ZPS18,ZPS19,ZPS20,ZPS21,ZPS22,ZPS23,ZPS24,ZPS26,ZPS27,ZPS31,ZPS35,ZPS37,ZPS38,ZPS43,ZPS54,ZPS55,ZP120,ANVIL}

- **name:** ZPS model-compatibility table
::: details Evidence (1)

- @ 0x10f2490c; model table

:::


:::

## `mp3_decoder`

**coverage** `partial`

The MP3 stream decoder: variable-bitrate header handling, duration math, frame resync with a bounded retry, and error reporting for corrupt frames. The decoder that plays the most common audio format on the platform.

::: details Technical details

normalization {id3,lame}; "WMA radio not supported on this platform"; resync bound "20 resync required: corrupt file"; frame errors {illegal sample rate,read frame header/sync/data overflow/data failed}; xing {"No size in xing header","xing we can't load",VBR dur "%zukb/%ukbps = %llds",CBR dur,"Assume that VBR file without a ToC has constant bitrate of %d"}; ID3v2 skip; "Found valid header after searching %zu bytes"; seekSeconds duration bound; mpg123-backed with custom 'sonos mp3 header' pre-parse ('error, not enough data to parse sonos mp3 header' vs plain 'mp3 header'); AudioDataDescriptor input rejected ('error, decoding using AudioDataDescriptor not supported'); format-change discard ('discard block immediately following unexpected format change','new format r:%li ch:%i enc:%i'); status XML <DEC_MP3Decoder>%s</DEC_MP3Decoder> + <DEC_Version>MPEG Version %s + <DEC_Layer>%u + 'MPEG Version %s, Layer: %d, Frame Len: %d','Samplerate: %ld, Bitrate %d','Number of Channels Input %u: Output %u, output channel mode: %s','Emphasis %d: abr %d, vbr mode: %s' (Constant/Variable/Average Bitrate Mode); mpg123 msg surface 'Message: Track ended.','Message: Output format will be different on next call.','Message: For feed reader: "Feed me more!"'; WAV parser guards 'exceeded max WAV audio channels (%d) found %d','less than min WAV audio channels','buffer length 0','Attempted to divide by 0 - found lDataLen/wNumChannels/wBitsPerSample/lSampleRate','%u-channel, %u-bit, %u-samplerate'

- **name:** mp3 stream decoder (xing/VBR)
- **stream_decode:** MP3 stream reader: ID3v2 skip ('Failed to read full ID3 header','Ran out of data while skipping ID3v2 tag','Found valid header after searching %zu bytes','No header. pos=%zu'), Xing/ToC ('No size in xing header, using %zu',"xing we can't load"), duration estimates ('Using VBR duration calc: %zukb/%ukbps = %llds','Using CBR duration calc','Assume that VBR file without a ToC has constant bitrate of %d'), seek bounds ('seekSeconds (%lld) exceeds duration','seeking to/past end of track'), frame errors ('read frame {header,sync,data overflow,data} failed','corrupt file (t:%ld)','got frame with illegal sample rate','no more frames sfp:%d','stopping with %zu frames left','stream ended prematurely (s=%zu d=%zu)','(resync required \[%u\]','20 resync required: corrupt file'), buffer status 'fillBuffer returning, buf is %u%% full and %u avail', normalization tags 'Normalization id3:%d lame:%d', 'WMA radio not supported on this platform'.
::: details Evidence (1)

- @ 0x10ece800; mp3 block

:::


:::

## `mp_autoplay`

**coverage** `partial`

The media-player autoplay logic for virtual line-in sources: target resolution decides which coordinator a pushed session lands on, and this is what makes a phone's AirPlay-style session start on the right room. It's the autoplay feature as implemented in the media-player layer.

::: details Technical details

params {vol,useVol,includeZones} + "airplay include zones: %d" + AirplayIncludeGroupedEvt; linein types {object.item.audioItem.linein.{homeTheater,airplay,bluetooth}} + x-sonos-vli; target resolution {"lonely local line-in autoplay","no autoplay target","couldn't determine coordinator/AVT control URI/control URI","Not executing on invisible/node proto incompatible ZP"}; "for controlURI \[%s\] for coordinator \[%s\]. programURI \[%s\]"; "Autoplay command failed ret=%d"; "AutoStop called on unhandled URI"; http://%s:%u

- **name:** media_player_autoplay: VLI autoplay
::: details Evidence (1)

- @ 0x10ecb510; mp_autoplay block

:::


:::

## `mpegts_id3`

**coverage** `partial`

The MPEG-TS demuxer plus timed-ID3 extraction for HLS radio metadata: PAT/PMT parsing, audio PID selection ('No audio PID'), stream-type rejection, PTS handling, and timed-ID3v2 tag extraction with size caps and OOB guards. This is where stream metadata (artist/title) inside radio HLS comes from. Parses the transport-stream container and ID3 metadata tags some broadcast-style streams carry.

::: details Technical details

TS parse: PAT/PMT PIDs, sectlen/desclen/silen, stype (Unsupported stream type), eslen, "No audio PID"/"Audio PID is 0x%x", "non-audio and non-timed_id3 PID", PTS, peslen/payload; timed-ID3v2 extraction: tag footer detect, "Ignoring too large timed ID3 size", OOB guards, "unsupported mp3 segment"; PAT/PMT discovery 'found PAT PID'/'found PMT PID 0x%x'/'Can't read PMT', afelen/sectlen/desclen/silen field widths, 'ID3v2 tag is malformed'/'detected ID3v2 footer'/'cannot skip initial ID3v2 tag'

- **name:** MPEG-TS demuxer + timed ID3 (HLS radio metadata)
::: details Evidence (1)

- @ 0x10ed9380; ts/id3 parser region

:::


:::

## `mpmgr`

**coverage** `partial`

The media-player manager's actor layer: the registry and resolver that maps a target key to a concrete media-player actor, including the 'no actor available' failure modes. Every player-scoped modern-API command resolves through here first.

::: details Technical details

actor key {uuid,ix,port,ssl,mtls} + "already exists or has overlapping values"; resolve {getActor,Actor Filter null,unexpected target ID type,found actor,found backup,target resolved,no actor available}; lifecycle {registered \[%zu\],created \[%zu\],Invalid target key abort,Request to shutdown,shutdown}; per-MP config Player%s + anacapa_logger.toml + /localsettings.txt; VLI hooks {onVirtualLineInGetVolume,SessionStartInfoUpdated,StartSession,StopSession,SuspendSession,NameChanged,MetaDataChanged,PlayModesChanged,onPlaybackStateChanged,processSetVolume,waitOnTxBitFlagsClearedLocked}; events {VolumeSetActionEvent(vol,mute),VliVolumeProcessingCompleteEvent(type,success,flags)+signal rc,VliSessionProcessingCompleteEvent(type,action,success,flags),"vliType old: %s new %s cookie %d"}

- **name:** media_player_mgr: actor registry
::: details Evidence (1)

- @ 0x10ecb874; mpmgr block

:::


:::

## `multi_daemon_boundary`

**coverage** `partial`

This program is one daemon of about thirteen on the player. It pushes network settings to the network-startup daemon over a local socket and receives connection updates back, while LED, Bluetooth, and power behavior live in their own daemons. Most device behaviors are actually owned by these siblings, and this layer marks where this program's job ends and theirs begins.

::: details Technical details

anacapad coordinates ~13 sibling daemons over /X-external HTTP routes + /tmp/netstartd.ipc: netstartd gets netsettings/PSK pushes and satellite notifications, reports connection-type updates back; per-daemon crash machinery (.dmp/.properties/_backtrace/count files) and /opt/log sinks | netstartd client side (ipc_msg.cxx region): connect.sendMessageLocked hello handshake; performReset-triggered reconnect; deferral "Deferring IPC reconnect"; timeout "attempting reconnect (retries=%u)"; "Bad IPC message received (%d %d %d)"; transport threads selthrd.RIPCHandler.{reset,data,except,timeout}; control msgs "Disabling/Enabling networking","Signaling start/end of network connectivity test"

- binary anchors: `/btmanager-external`, `/netstartd-external`, `wacd.log`, `sddpd.log`, `/tmp/netstartd.ipc`, `netstartd hello`, `sonospowercoordinator.dmp`

- **ipc_routes:** /anacapad-external, /btmanager-external, /netstartd-external, /sonosledmgrd-external, /sonospowercoordinator-external, tpapi-external-endsong
- **netstartd_contract:** socket /tmp/netstartd.ipc + /tmp/netstartd.pid; handshake 'netstartd hello'; anacapad->netstartd: 'Pushed netsettings update to netstartd', 'Pushed PSK update to netstartd', satellite-addition notify, 'signaling netstartd (%s) %s'; netstartd->anacapad: 'Received netsettings update from netstartd', 'Got connection type update from netstartd: \[%s\]'
- **crash_machinery:** per-daemon *.dmp + *.properties + *_backtrace strings + CrashCount/count files (sonospowercoordinator, btmanager, netstartd); logs /opt/log/{netstartd,sonosledmgrd,btmanager}.log + /jffs/netstartd_prev.log + /jffs/app/debug/*.dmp
- **daemons:** anacapad, netstartd (network), btmanager (Bluetooth), sonosledmgrd (LEDs), sonospowercoordinator (power), wacd (WAC setup), mdnsd, sddpd, chronyd, dropbear (SSH), udhcpc (DHCP), wpa_supplicant, upgrade_mgr
- **launcher_scripts:** etc/run{anacapa,netstartd,ledmgrd,diagprocessd,sddp,mdns,chrony}+rundaemon.sh: inittab-supervised wrapper scripts; shared helpers: trackrestart(name,trackfile,debounce-s) logs restarts to /var/run/<daemon>.start; waitwhiletrue loops on /var/run/stop<daemon> sentinel files; waitfordns blocks until /var/run/waitforip clears AND resolv.conf has a nameserver. Daemon->binary map: netstartd=/wifi/netstartd, ledmgrd=sonosledmgrd (stale-pid watchdog writes <3> messages into /opt/log/sonosledmgrd.log and restarts), diagprocessd=/etc/diagprocessd, sddpd, mdnsd=/sbin/mdnsd -f, chronyd (slew-for-small/step-once-per-run clock discipline).
- **sddp:** sddpd = Control4 SDDP (Simple Device Discovery Protocol) daemon (/etc/sddpd.conf: Type=sonos:Zoneplayer, PrimaryProxy=media_service, Proxies={media_service,amplifier}, Manufacturer=Sonos, Model=Zoneplayer, Driver=sonos.c4z (Control4 driver DB), MaxAge=1800) the device announces itself to Control4 systems. /jffs/dev_sddp.conf overrides the shipped config (-c flag).
- **anacapa_upgrade_hook:** runanacapa intercepts upgrades BEFORE exec'ing anacapad: if /var/run/upgradeinfo exists -> mkdir /tmp; mv /jffs upgrade_tmp_prev.log; run /bin/upgrade >> /tmp/upgrade.log; echo 'RESULT = $rr'; rm upgradeinfo; exit rr: the daemon slot doubles as the upgrade runner. Normal path also cleans stale /tmp/smb/* mounts.
::: details Evidence (8)

- @ 0x10ea7f20; /btmanager-external
- @ 0x10ea7f70; /netstartd-external
- @ 0x10e7573d; wacd.log
- @ 0x10e756f9; sddpd.log
- @ 0x10ea7ec4; /anacapad-external route string
- @ 0x10ef601c; /tmp/netstartd.ipc socket path
- @ 0x10efab18; 'Pushed netsettings update to netstartd'
- @ 0x10ea7cc0; per-daemon .dmp/.properties/backtrace crash files

:::


:::

## `muse_field_schema`

**coverage** `partial`

The JSON field names used in modern-API payloads, grouped by domain: auth fields, battery fields, device fields, plus settings, positioning, and queue fields. These are the wire keys a client must produce, and the binary is the authoritative spelling for each one.

::: details Technical details

auth {systemId,pinEpoch,accessToken,refreshToken,route,protocolVersion}; battery {statusReason,chargingState,validCharger,rawBatteryPercentage,batteryPercentage,batteryTemperature}; device {deviceFeatures,isCoordinator,isVisible,isSatellite,isSecure,bootSequenceId,systemUptimeSeconds,anacapaUptimeSeconds,museHouseholdName,primaryDeviceId,networkIPAddress,networkMask,networkType,wifiSignalStrength}; audio in {bluetoothSource,lineInSource,audioInputName,audioInputIcon}; misc {pageSize,websocketUrl,vanishReason,toVersion,clientState,deviceState,downloadDuration,isSuspended,credentialTypeAllowed,allowGuestAccess,isTrial,startDate,endDate,businessCore,controlChannels,restrictedAccess,sonosRadio,speed}; playback caps {canSkipToPrevious,canPause,canStop,canRepeat,canRepeatOne,canCrossfade,canShuffle,canSkipToItem}; policy {showNPreviousTracks,pauseTtlSec,playTtlSec,limitedSkips,pauseAtEndOfQueue,refreshAuthWhilePaused,notifyUserIntent,pauseOnDuck}; track meta {catalogId,region,nextItem,currentVideo,streamInfo,replayGain,advertisement,episodeNumber,chapterNumber,episodeName,immersive,connotation}; session {epochId,periodicIntervalMillis,sendPlaybackActions,macAddr,hmacDigest,sessionState}; misc2 {zoneInfo,isUnregistered,targetRoomName,meshDisable,suppressTVConfigError,repeatOne,shuffle,customerId,updateURL,enableMonitor,manifestRevision,latestSwGen,wifiDisableState}; SFB wire keys {third-party-integ,no-ads,hd-content,special-content,on-demand-archive,can-skip,content-saving,messaging,save-groups,basic-ui,commercial-msp,essentials-msp,premium-msp,dashboard-access,schedules-access}; alarm ops {getAlarms,fetchAlarm,createAlarm,updateAlarm,snoozeAlarm,removeAlarm}; duration fmt ISO8601 PT0H5M0S

- **name:** muse JSON field schema
::: details Evidence (1)

- @ 0x10f9a8e8; field schema

:::


:::

## `muse_logging`

**coverage** `partial`

The internal command and event logger for the modern API, recording which operations were invoked. It's useful for understanding which operations are considered sensitive enough to log and for debugging replayed command histories.

::: details Technical details

{muselogevt,muselogcmd}; logged ops {loadAudioClip,startDirectControlEx,setProtectedAdminSettings,createVoiceAccount}

- **name:** muse cmd/event logging
::: details Evidence (1)

- @ 0x10f9880c; muselog

:::


:::

## `muse_perf`

**coverage** `partial`

A per-stage profiler inside the modern-API engine: it times each phase a request passes through, covering authorization, parsing, routing, and execution, plus per-operation stages. It exists so latency inside the API pipeline can be measured and reported.

::: details Technical details

fmt "- %c%010u - %6s -" + "%s: %lldms, %fms avg \[count=%u\]"; stages {AUTH_IS_AUTHORIZED,AUTH_PARSE_DEVICE_TOKEN,AUTH_POLICY_TABLE_CACHE_FETCH,COMMAND_DISPATCH,COMMAND_EXECUTE,COMMAND_LOGGER,COMMAND_PARSE,COMMAND_REPORT,PLAYER_VOLUME_SET_VOLUME}

- **name:** muse::PerfProfiler
::: details Evidence (1)

- @ 0x10f98a78; perf profiler

:::


:::

## `muse_semantics`

**coverage** `partial`

The 'muse' API is Sonos's real product API: the REST-style surface the app talks to over the cloud and websocket channel. Hundreds of routes are catalogued, covering every classic command reachable through it plus modern-only features the old surface never had. This is the vocabulary of what the API can mean, not just its URL list.

::: details Technical details

the muse API is the real product surface: 525 route strings, organized as households(282)/players(176)/groups(46)/playbackSessions(12)/users/devices/services namespaces; every SOAP service is mirrored as an upnp* proxy namespace; native resources cover settings, playback, hardwareStatus, positioning, homeTheater, pinewood, zones, authorization, timers, virtualLineIn, playerVolume, trueroom, trueplay, playlists, musicServiceAccounts, voice, systemReporting, localContentLibrary, networkTest, alarms, diagnostics, groupVolume

- binary anchors: `v1/households/{householdId}`, `muse_async_command_handler_impl.cxx`, `v1/players/{playerId}/upnpZoneGroupTopology/subscription`, `v1/households/{householdId}/settings`, `pinewood`

- **topology:** v1/households/{householdId}/... is the household-scoped parent; most resources also exist unscoped (v1/players/{playerId}/...); groups/{groupId} for playback coordination; playbackSessions/{sessionId} for cloud-queue sessions
- **upnp_proxy:** upnpAVTransport, upnpAlarmClock, upnpAudioIn, upnpConnectionManager, upnpContentDirectory, upnpDeviceProperties, upnpGroupManagement, upnpGroupRenderingControl, upnpHTControl, upnpMusicServices, upnpQueue, upnpRenderingControl, upnpSystemProperties, upnpVirtualLineIn, upnpZoneGroupTopology: each exposes call + subscribe/renew/unsubscribe (logicalSID) triplets, i.e. full SOAP-over-muse proxying incl. eventing
- **native_namespaces:** players, groups, playback, playbackSessions, settings, hardwareStatus, positioning, homeTheater, pinewood, zones, devices, authorization, timers, virtualLineIn, playerVolume, trueroom, trueplay, households, playlists, musicServiceAccounts, voice, systemReporting, localContentLibrary, networkTest, alarms, diagnostics, groupVolume
- **unresolved:** per-route request/response schemas; what pinewood and trueroom are (internal codenames: pinewood plausibly voice/control, trueroom plausibly next-gen room tuning)
- **verbs_note:** per-resource verb table decoded: see shared_primitives.muse_route_verbs for the complete inventory; highlights: authorization resource carries the invite/token auth model; hardwareStatus exposes battery/PoE/water/mic-switch/ship-mode verbs for other hardware; settings is privilege-tiered (public/protected/restricted-admin)
- **transport_constraint:** upnp* proxy subscribe/renew/unsubscribe are rejected unless the transport is WSS: 'Invalid transport: WSS is required', 'Invalid namespace: UPnP subscribe/renew/unsubscribe not supported'. The wire mechanism: lechmere frames carry pseudo-HTTP headers (x-sonos-method/x-sonos-uri/SOAPACTION) so UPnP calls tunnel as virtual requests; event subscription requires the persistent channel because there's no callback URL over HTTP
- **auth_model:** household-scoped authorization namespace: authorization/tokens → resolveToken ('Request to resolveToken successful \[token=******%s\]' (only token tail logged); authorization/policy/{policyKey} → getPolicyKey (fetches named policy keys like authzPolicyKeyLechmere); authorization/permissions/{role} → getPermissions (role→permissions map); invite flow createInvite→authorization/invite, redeemInvite→authorization/redeem (+deleteInvite)). How new players/users join a household; players/{id}/authorization/{authorizeDevice,authenticateClient}; authorization/users lists household users
- **artifact:** one registration literal is malformed: 'v1/\[error: 'none' is not a valid target\]/authorization/invite': an error string was embedded where a path param failed to bind, showing routes are assembled param-by-param at registration
- **outbound_auth:** outbound calls use 'Authorization: Bearer %s' or 'Authorization: Basic %s' plus X-Updated-Authorization/X-Goog-Updated-Authorization response handling; token lifecycle events authTokenChanged/authTokenRefreshed; SMAPI refreshAuthToken op at sonos.com/Services/1.1; getDeviceAuthToken warns when credentialType != OAuth
::: details Evidence (8)

- @ 0x10e7bf40; v1/households/{householdId}
- @ 0x10ef9166; muse_async_command_handler_impl.cxx
- @ 0x10e85990; upnp* proxy namespace routes (call/subscribe/renew/unsubscribe)
- @ 0x10e838ac; v1 players/households/groups route family
- @ 0x10f02958; 'Invalid transport: WSS is required' + UPnP subscribe rejections
- @ 0x10e7c2ac; authorization/* route family: tokens/policy/permissions/invite/redeem/users
- @ 0x10e7c3ec; 'v1/\[error: ...not a valid target\]/authorization/invite' malformed registration literal
- @ 0x10ef9be8; resolveToken success log masks token to last chars

:::


:::

## `muse_target_validator`

**coverage** `partial`

The gate that resolves a command's target: implicit targets (the receiving player), explicit targets (another player or group by ID), and the rejections for unauthorized or missing targets. This is the first thing a command hits after auth, and most client-error failures originate here.

::: details Technical details

rejects {guest_access_disallowed,forbidden,not_authorized,not_found}; museinfoserviceobserver/infoservice

- **name:** muse_target_validator
::: details Evidence (1)

- @ 0x10f9860c; target validator

:::


:::

## `music_services`

**coverage** `partial`

The available-services store: the service-catalog file plus its state variables and settings, replicated across players. This is how the household agrees on which music services are installed and at what version, and it's the machinery behind the service catalog.

::: details Technical details

musicservices.xml + backstop file; state vars {ZPMusicServicesList,ServiceListVersion,AvailableServiceDescriptorList,AvailableServiceTypeList,AvailableServiceListVersion}; settings {OnlineUpdateBaseURL,R_TrialZPSerial,R_AvailableSvcTrials}; replication locks {rwlR_msd,rwlW_msd} + msdZonePlayer; accept logic "deciding whether to accept replicated list from: %s; ver: %u format: %u"/"replicating services from %s"/"Replicated list accepted"; zp-vs-rs compare {zpETag,rsETag,zpLUD,rsLUD,zpVer,rsVer}; "ServiceTypeList, adding built-in: %s"/"adding: %s; name: %s"; "Warning. No SD found for %d"; poll "next check for available services in %u s \[source=%s\]"; "Could not submit Available Services DIAG. Service count is: %zu"; checkForAvailableMusicServices job; "Not enough space to write full list"

- **name:** musicservices: available-services replication
::: details Evidence (1)

- @ 0x10e76a94; musicservices block

:::


:::

## `netif_monitor`

**coverage** `partial`

The interface-address monitor: low-level system events feeding handlers for link and address changes. Both the address-watch and link-watch consumers ride it, so the rest of the system learns the moment connectivity shifts.

::: details Technical details

netlink {RTM_NEWLINK,RTM_GETLINK}; errors {read error,incorrect type,unexpected message %X}; selthrd.RIfAddressMonitor.{reset,data,except,timeout}

- **name:** RIfAddressMonitor: netlink ifaddr watch
::: details Evidence (1)

- @ 0x10ee69ac; addrmon block

:::


:::

## `netstart_events`

**coverage** `partial`

The network-startup event vocabulary: the provisioning subsystem's observable transitions covering setup start and stop, connection-type updates, and setup-mode states. It's how this program learns the network is coming up, came up, or failed, so it doesn't talk before there's a path.

::: details Technical details

events {netstartd hello,Setup start,Setup stop,Netstart is idle,Netstart alive,Netstart open,In setup mode,Netstart SSID set/clear,Netstart triggered upgrade (0x%x),Got connection type update \[%s\]}; WAC {/var/run/wac_mode,Unknown WAC mode %d,WAC mode disabled/enabled/timeout}; ForceShutdownOnNewSSID %d; shutdown {"Deferring shutdown, reason \[%d\]","deferring newHHID event","ignoring network bounce mid-shutdown",zpShutdown,/tmp/netstartd.pid}; IP-change {re-binding old->new,clearing link-local subscriptions on 169.254.* change,shutting down for new IP,newAddr event with same addr}; conn types {SonosNet (Ethernet),Home Theater 2.0,Home Theater (Ethernet),Home Theater,Ethernet (WiFi Disabled),Ethernet,SonosNet (wireless)}; events {newHHID,newSSID}; "%s: %s event resetting connection to mDNS"

- **name:** netstartd IPC event vocabulary + connection types
- **satellite_notify:** 'Failed to send IPC message to netstartd to notify about satellite addition': anacapad pushes satellite-addition notifications to netstartd over the IPC channel alongside netsettings/PSK pushes and connection-type updates.
::: details Evidence (1)

- @ 0x10f02798; netstart block

:::


:::

## `noderx`

**coverage** `partial`

The inter-player receive transport: packet bookkeeping, a flight-recorder line per packet, late-joiner handling, and loss-suppression logic. It's the receiver half of the framed group-audio channel, accepting the node-level messages household members exchange.

::: details Technical details

indices {ob=outputBuf,lr=lastRead,lcg=lastConsecutiveGood,lrx=lastRx}; flight rec " %u r:%d.%06d s:%c p:%d.%06d"; startup {"Starting up; id:%u, delayPkts:%u, delayFrms:%u","Startup large packet gap:%u, don't NACK",bFinalStartPacket,allowing NACK resend of LCG,ignoring discontig NACK resend,ignoring partial frames}; NACK "out of order packet; send nack immediately" + "NACKed for %u IDs, %u packets, ob/lr/lcg/lrx"; pause/resume {thread pausing/resuming, state validation p/sp/pr/ip}; frame layer {wFirstFrameOffset,wBytesOfDataLeftToRead,pwLen,Playtime} + errors {expected frame not found,frame length conflict,Packet stream framing error,frame too large,bufferNextProtocolFrame WOULDBLOCK/E_WOULDBLOCK,readNextDataBlock timeout,forcing decoder reset}; skipAhead entries {immed,shifted,released blocks,too many}; resync {"resynchronization flushing packets %u-%u",resynchronization message}; "Ignore packet with incorrect protocol version"; "Received dup packet id with different class"/oob/mismatch replace; "RX buffer full"/"RX discontig"; threads {noderx-data,noderx-pause,noderx.rxd.usleep,noderx.loc.usleep}; "failing noderx for io error (c=%u t=%lld)"

- **name:** noderx: inter-player RX transport
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
::: details Evidence (1)

- @ 0x10ecfae4; noderx block

:::


:::

## `nslookup_detail`

**coverage** `partial`

The name-lookup diagnostic page detail: a permission gate plus a lookup routine driven by a parameter table. It's one of the tools-page commands, listed separately because it resolves names on demand for network debugging.

::: details Technical details

f_100b96d0: gate → execs nslookup via f_10549cf8 with table arg 0x11097680+0x810

- **name:** nslookup_detail
::: details Evidence (1)

- firmware; handler disas

:::


:::

## `overrideconfig`

**coverage** `partial`

The config-override endpoint: a form submission that commits an override file with strict validation and a success redirect. It's the engineering mechanism for config overrides that survive reboot, a deliberate escape hatch over the normal config stores.

::: details Technical details

form post committing override file; errors {Error reading request body,Request body size does not match content length,Error initializing object,Error committing override file}; success <html>meta refresh 1;url=/fcs Success</html>; Content-Type application/x-www-form-urlencoded

- **name:** /overrideconfig endpoint
::: details Evidence (1)

- @ 0x10f06248; overrideconfig region

:::


:::

## `perf_counters`

**coverage** `partial`

The performance-counter schema: keyed counters with window timestamps, descriptions, and min/avg/max accounting. These are the raw counts and timings behind performance diagnostics, measuring how long operations take and how often they run.

::: details Technical details

headers {counter_historical.h,counter_min_avg_max.h}; fields {thresh,wallClockEndTime='The end of the window as UTC wall clock time',description}; 'average value should be 0'; emit root perf_counter_table, manager perfCountMgr, 'subcounters' key; 'detected "%s" (service=%d/%u) but no counters available'; museperf tagged record

- **name:** perfcounter schema
- **fields:** metrics {accum,accumBytes=aggregate size of processed frames,aheadTime=amount of audio prebuffered,frameToFrame=time between frames,wouldBlock=transmits blocked count,queueExpiry=queue expiration time,frameTypes,frameSizeBytes,frameSizeSamples,processing indicators,user action,transport error,initial,perf-counters}; windows {"Creating %s window ending at time %lld","Cannot reverse time","Ringbuffer cannot rotate backwards","Rotation required"}; json {wallClockTimeUTC,timeSinceBoot,windowDuration,processName,counters}; "AFC truncated!"
::: details Evidence (1)

- @ 0x10eb7e40; perfcounter

:::


:::

## `perfect_sync`

**coverage** `partial`

The 'perfect sync' machinery: Sonos's multi-room synchronization, which is how grouped speakers keep their audio clocks aligned tightly enough that rooms play in lip-sync-level unison. It's the technically hardest part of grouping and a long-standing Sonos differentiator.

::: details Technical details

"perfect initial sync %d.%06d, available %u"; forcePerfectInitialSync + "Forced perfect initial sync %s on stream %s"; "forced perfect initial sync, ignoring %d usec diff"

- **name:** forced perfect initial sync
::: details Evidence (1)

- @ 0x10f29c37; sync block

:::


:::

## `play_history`

**coverage** `partial`

Recently-played tracking: plays are recorded by the track monitor, buffered, and posted to the household history API, and the app fetches a cached list from the same place. Ratings like 'like' and 'dislike' exist but only for the cloud queue. It's the persistent record of what was played, feeding any 'recently played' view.

::: details Technical details

historymgr.cxx play-history pipeline: TrackPlayRecorder/TrackPlayMonitor capture plays, entries buffered and POSTed to the household history API with completeness gating + buffer-full drops; getHistory is ETag-cached; deleteHistory/removeHistoryItem/clearHistory ops; ratings via playbackMetadata/ratings: explicitly 'only implemented for cloud queue'; TPM trace vocabulary: 'TPM update for track uri: %s, id:%s, pos: %lld, calc: %u, final: %d', 'TPM Position update track mismatch (curr:%s \[%u\]) != (info:%s \[%u\]), pos: %lld, calc: %u', 'Track pos %lldms, track duration %lldms (est)'/'(est omitted when exact)'; boundary FSM 'Track Changed w/o Delivery Done','Track Changed, next track @ %d.%06d, now %d.%06d'/'next track end @ %d.%06d, now %d.%06d','Track Changed without knowing prior track end!','Track end time @ %d.%06d','upcoming end time @ %d.%06d','Logical Track Boundary','Pausing track, offset %u ms','Seeking to position %u ms, streamId: %u'; TPM memory pressure: 'memory pressure streams'/'memory pressure canceled','relief fell back to canceled','Detected old complete/in progress stream segment...removing','no match found for complete','overlap','RESYNCING...retry later (strm: %d   play: %d)','Omitting playhead from report due to LSE'

- binary anchors: `historymgr.cxx`, `<WebSocketHistory`, `deleteHistory`, `v1/households/{householdId}/history`, `postHistory`, `<RestHistory>`, `Updating history cache`, `rating is only implemented for cloud queue`

- **cloud_routes:** v1/households/{householdId}/history (getHistory/postHistory), v1/households/{householdId}/history/{id} (removeHistoryItem), clearHistory; ratings: v1/groups/{groupId}/playbackMetadata/ratings + household-scoped variant; per-item 'item/%s/rating'
- **xml:** <History> container; sibling <RestHistory>/<WebSocketHistory> type tags
- **caching:** 'Updating history cache: \[status\]\[key\]\[etag\]\[cache-control\]', 'getHistory is serving the cache', lazy regen 'file not available yet, generating (%d). Elapsed=%ums, current eTag=': server-driven ETag caching
- **gating:** 'History is disabled, history is not POSTed': opt-out gate; entries dropped when 'resource incomplete - name, type, or objectId missing' / 'group incomplete - name, id, or coordinatorId missing'; 'Failed to queue history entry, buffer full' + 'Post History Buffer Cleared'
- **ratings:** r:rating DIDL element + urn:schemas-rinconnetworks-com:metadata-1-0/\|rating; 'rating is only implemented for cloud queue', 'cloud queue server does not supporting rating', 'rating.type is not recognized'
- **pipeline:** trackplayrecorder.cxx (TrackPlayRecorder) + trackplaymonitor.cxx (selthrd.RTrackPlayMonitor.* select-thread events: reset/data/except/timeout) feed the manager; O_TRACKPLAYBASE_URL / O_HISTORY_SERVICE_URL config keys; historyVersionChanged + postHistoryConfig events; 'Securely Registered' gate on getHistory
::: details Evidence (7)

- @ 0x10ec49da; historymgr.cxx
- @ 0x10f01174; <WebSocketHistory
- @ 0x10ec4d68; deleteHistory
- @ 0x10e7e1d8; v1/households/{householdId}/history route
- @ 0x10ec4928; ETag cache update log
- @ 0x10ec4a90; 'History is disabled, history is not POSTed'
- @ 0x10eb0bb8; 'rating is only implemented for cloud queue'

:::


:::

## `playlist_parsers`

**coverage** `partial`

Below the URI layer sit real playlist parsers: ASX/WMP (mswmext), M3U (x-mpegurl), Apple HLS playlists (vnd.apple.mpegurl), DASH manifests. They turn playlist URLs into the track lists the queue consumes. Readers for external playlist formats (M3U, PLS, and friends) so saved playlists from other apps can be imported and played.

::: details Technical details

iterate{ASX,M3U,WLP,PLS}PlayList; ASX <ref href= + entryref; linkUrl= extraction ("found linkUrl"); Post-stream readData dump {bytesLeft,len,buf}; HLS player status XML '<HLS Name="Playlist"><HLSVersion>%d<IsStatic>%s<IsEncrypted>%s<TargetDurationSec>%d<CurrentBitRate>%d<TrackEncryptionMethod>%s<TrackEncryptionFormat>%s'; storeStream rejection taxonomy: empty/NULL URI, invalid rendition, binaural/downmix reject, unsupported bandwidth/bandwidth-0/no-bandwidth, unsupported Atmos, unsupported codec, no supported codec; ABR ladder 'downgrade bitrate: %u %u %u','unable to downgrade bitrate, already at the minimum','we should stop at the max bitrate','starting context: br=%u(%u) strm=%u seq=%llu'; '<BitrateStreams numBitrates="%zu">'/'<StreamEntry br="%u" strm="(%zu,%zu)" codec="%s"'; seek machinery 'seek to time %.3f (%lu:%02lu:%02lu)','seek to time %.3f from start of current segment','cached seconds advanced %f doesn't line up with seek, offset %f','PlayTrack: pEntry->m_dTimeOffset %f, prev time offset: %f, dur %f','Trim offset required %f','time offset of segment %llu byte offset %zu is %.3f','stopping decoding \[%s\] with %f secs processed'; ADTS-bump heuristic 'no ADTS metadata, bumping seconds advanced, seconds advanced %f'; segment ops 'couldn't find segment %llu for ref time %s','seq discontinuity %llu %llu','adv: seq=%llu secs=%f c=%zu','just fetched track \[%2zu: %llu\] with a count of %zu key \[%s\] (dis %d)'; key fetch 'Failed to open key uri. http status=%d','Unable to read key. (%zu!=%zu)','encrypted, but no key URI'/'no data from key URI','undefined encryption method'; 'pretty weedy around here: %d' (sparse-playlist log)

- **name:** playlist sniffers
- **hls_parser:** hlsplaylist/hlsrenditions parser (0x10ec5aac block): recognized tags #EXT-X-VERSION, #EXT-X-MEDIA, #EXT-X-STREAM-INF, #EXT-X-TARGETDURATION (default when absent: 'tag not present; setting %u'), #EXT-X-MEDIA-SEQUENCE, #EXT-X-PLAYLIST-TYPE ('playlist type: %s', 'static HLS (end list)'), #EXT-X-ENDLIST, #EXT-X-PROGRAM-DATE-TIME ('No ... for 1st segment'), #EXT-X-KEY/#EXT-X-SESSION-KEY with KEYFORMAT="com.apple.streamingkeydelivery" (FairPlay SKD), #EXT-X-DISCONTINUITY, #EXT-X-INDEPENDENT-SEGMENTS, #EXT-X-MAP ('HLS Segment Map entry'), #EXT-X-BYTERANGE. Validation: 'Invalid initial playlist: %s: header=%s', 'invalid #EXT-X-MEDIA rendition tag', 'attempted to store an invalid rendition that doesn't begin with #EXT-X-MEDIA', 'invalid rendition, attempt to store duplicate group-id', 'Invalid media playlist: %s: line=%s'. ABR/rendition selection: BANDWIDTH required ('rejecting bandwidth 0'/'unsupported bandwidth %llu'/'no bandwidth was specified'), codec allowlist ('rejecting unsupported codec %s', 'at least one supported codec in playlist not found'), Atmos/JOC handling ('we have %zu dolby streams', 'rejecting unsupported Atmos stream', 'JOC / Atmos', 'Downmixed from Atmos', 'Undefined channel rendition'), binaural/downmix rendition rejection, 'forcing a source switch due to multiple codec variants'; bitrate ladder traversal ('advancing stream index to %d \[%s\]', 'invalid stream index %u (max=%zu)', 'failed to get URI for br index %d stream %d'). Segment machinery: 'segmented content', seeking ('seeking pass segment %llu'/'seeking to segment %llu start time = %.2f range start %llu len %llu'/'Seeking pass the end of the playlist'), 'Error creating URI for HLS segment: %s with base: %s', 'total dur after adding segment duration: %f'/'stream duration from HLSPlaylist: %f'. Status XML <HLSInfo><HLS Name="Playlist"><HLSVersion>%d + <BitrateStreams numBitrates="%zu"><StreamEntry br="%u" strm="(%zu,%zu)" codec="%s".
- **hls_live_edge:** Live-edge handling: 'index starts on seq %llu%s' (live/static marker), 'Initial sequence: %llu (%llu)'/'empty track list', 'media seq went backwards: %llu -> %llu', 'media len changed: %zu-> %zu', 'media list: %llu %zu'. Stale-seq policy: 'stale sequence number %llu, not writing' BUT 'stale sequence number %llu, but with updated X-MAP' + 'overriding decision to discard due to X-MAP presence; updating %llu': a fresh EXT-X-MAP rescues a stale playlist. Track records 'set track id=%d ix=%zu seq=%llu o=%.2f d=%.3f c=%zu uri=%s' + 'update track id=%d ix=%zu seq=%llu uri=%s d=%.3f c=%zu' + 'track encryption method=%d, uri=%s'; edge cases 'next track idx hits max tracks, wrapping with mod', 'track list is split!', 'stale: %d %d %llu %llu', 'Error encountered creating HLS Segment Map entry for %s', 'setting byte range offset to (%llu)', 'failed to update track list n:%d s:%llu c:%zu', 'Error %x occurred while processing media playlist', 'ignoring media playlist: %s: line=%s', 'error parsing datetime \[%s\]'.
- **rendition_attrs:** EXT-X-MEDIA attribute set handled: AUTOSELECT, SAMPLE-RATE ('unsupported sample rate %zu'), channel count ('invalid bit depth %zu','rendition has invalid channel count, stop parsing %zu'), GROUP-ID ('rendition has no group id, stop parsing','duplicate group-id'), TYPE ('rendition is not audio, cannot parse'), rendering labels {Binaural Rendering,Unknown Rendering,Undefined channel rendition}; unknown attrs logged 'found unknown/unhandled EXT-X-MEDIA attribute %s'; selection trace 'rendition: group %s, autoselect %s, numchans %zu, rendition %s, name %s'.
::: details Evidence (1)

- @ 0x10ed1854; play_state_mgr region

:::


:::

## `psk_hierarchy`

**coverage** `partial`

The household's shared-secret key tree: several keys guard different channels, including the household communications key, the control key, the room-name encryption key, and the network-swap key, each with a backup mirror for seamless rotation. Rotation regenerates all of them and propagates to members, and this is the cryptographic root of trust for inter-player traffic.

::: details Technical details

PSKs {HhPsk (DTLS HH),ControlPsk,RoomEncPsk (room-name encrypt),LanSwapPsk} each +Backup mirror id; rotation {"Unable to generate new HH/control/room name encrypt/lan swap PSK","Unable to update settings with new PSKs","PSK rotation successful (HH: %s, Control: %s, RoomEnc: %s, LanSwap: %s)","Bumping netsettings version","not rotated"}; encoding {"Encoding SonosNet key failed","Encoding DTLS HH PSK failed"}; "Pending netsettings.json update discarded after replicating"; "Settings Replication changed SN Disable from %d to %d (source: %s)"; SSID protection {"SSID missing from known networks list","Registering for next topology update to protect SSID","Current SSID protected/already protected/not protected, could not get current SSID/missing from networks list","Not connected to a WiFi network, skipping SSID protection"}; "Received netsettings update from netstartd"/"netsettings changed"; app/run/nettestresult.txt; PSK rotation: 'Unable to generate new {HH,control,room name encrypt,lan swap} PSK','Unable to update settings with new PSKs','PSK rotation successful (HH: %s, Control: %s, RoomEnc: %s, LanSwap: %s)','Encoding DTLS HH PSK failed'; key fields {controlPsk,roomEncPsk,lanSwapPsk}

- **name:** 4-PSK household crypto hierarchy + rotation
::: details Evidence (1)

- @ 0x10efadb8; netsettings block

:::


:::

## `qplay`

**coverage** `partial`

The QPlay integration: the Tencent QQ Music casting feature, covering the machinery behind the auth handshake and the session that streams audio afterward. It's a China-market feature, dormant elsewhere.

::: details Technical details

QPlay:2 X_QPlay_SoftwareCapability xmlns:qq=tencent.com in device description; #QPLAY_SUPPORT# placeholder; action QPlayAuth; updateSharedTQPlayMode; no seed/code exchange or control channel found: stub-grade support

- **name:** QPlay (Tencent): minimal presence in this build
::: details Evidence (1)

- @ 0x10ef8cc6; QPlay:2 capability + #QPLAY_SUPPORT# + QPlayAuth

:::


:::

## `qplay_protocol`

**coverage** `partial`

The QPlay protocol implementation: the wire details of the Tencent casting protocol, including the seed-and-code exchange and the session flow. It's one of the private protocols sitting alongside the documented services, and it's how a Tencent-linked client pushes music at the player.

::: details Technical details

Tencent QPlay support: /QPlay/Control SOAP endpoint (no matching /QPlay/Event route: the only service missing its event pair), a QPlayAuth action taking Seed/Code/MID/DID arguments (seed→code auth handshake: controller sends Seed, device answers with a Code computed from MID machine-id and DID device-id), a shared-T QPlay mode with context restrictions ('Calling updateSharedTQPlayMode in bad context!'), compile flag #QPLAY_SUPPORT#, and the device-description capability <qq:X_QPlay_SoftwareCapability>QPlay:2</qq:X_QPlay_SoftwareCapability>

- binary anchors: `urn:schemas-tencent-com:service:QPlay`, `QPlayAuth`, `QPlay:2`, `updateSharedTQPlayMode`, `#QPLAY_SUPPORT#`, `updateSharedTQPlayMode`, `#QPLAY_SUPPORT#`, `QPlay:2`, `QPlayAuth`, `/QPlay/Control`

- **unresolved:** the post-auth control channel (UDP keepalive/position reports in public QPlay docs), how MID/DID are generated, and the replay/validity rules on Seed
- **soap:** /QPlay/Control registered; QPlayAuth dispatch site 0x1073a4f0 does strcmp on the action name then calls vtable+0x14/+0x38 on the action object; sibling function at 0x1073a5d0 initializes string-arg records for Seed (via arg-parser f_1056157c), then Code, MID, DID
- **auth_args:** QPlayAuth args: Seed (in), Code, MID, DID: matches the public QPlay auth scheme where the speaker derives an auth code from a controller-supplied seed bound to its IDs
::: details Evidence (7)

- @ 0x10f11d58; QPlayAuth
- @ 0x10ef8cc0; qq:X_QPlay_SoftwareCapability = QPlay:2 in device description
- @ 0x10ef8cc0; <qq:X_QPlay_SoftwareCapability>QPlay:2</qq:...> device-description element
- @ 0x10ea8db4; updateSharedTQPlayMode context guard
- @ 0x1073a4f0; QPlayAuth strcmp dispatcher → vtable calls
- @ 0x10f11d64; 'Seed' arg literal (f_1056157c arg-parser site 0x1073a61c)
- @ 0x10f11d6c; 'MID' + 'DID' arg literals adjacent

:::


:::

## `queue_persistence`

**coverage** `partial`

How the queue survives reboots: saved queues and the live queue are both written to disk as structured documents, saved queues in a compressed XML file and the live queue in its own store. Both are validated at boot and kept in sync across the household. This is the machinery behind your queue and Sonos playlists being intact after a power cut.

::: details Technical details

.rsq on-disk queue format: savedqueues.rsq is a <SavedQueues LastUpdateDevice Version Next> XML doc of <SavedQueue Id Curated NumTracks> elements each holding <Track URI= MD=> entries; live queue persists as trackqueue.rsq; atomic write via .tmp rename + .d.rsq backup; validated at boot and on replication receipt; play_state_mgr.cxx: current play-state file /tmp/current_play_state ('couldn't rename/create/update current play state file'); Queue LastChange event schema '<Event xmlns="urn:schemas-sonos-com:metadata-1-0/Queue/"><QueueOwnerID val="%s"/><QueueID val="%.20s"><UpdateID val="%u"/><Curated val="..."'; 'hPlaybackPolicy' member; '(warning) %s not handled due to empty enqueued URI','trackValidateURI detected unplayable queue entry: %s','Post stream readData dump; bytesLeft: %zu, len: %zu, rgchBuf: %s','found linkUrl: %s'; tqueue playability guards: 'adding unplayable track to queue: %s // %s','not attempting unsupported playback %s','Possible URI truncation: %s','bad encaps: %s (%s)','Failed to convert track URI flags: %s','Failed to extract objectID from %s'

- binary anchors: `savedqueues.rsq`, `<SavedQueues`, `trackqueue.rsq`, `<SavedQueue Id=`, `<Track URI=`, `savedqueues.rsq.tmp`, `trackqueue.rsq`

- **schema:** <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"> / <SavedQueue Id="..." Curated="..." NumTracks="..."> / <Track URI="..." MD="..."/> / </SavedQueues>
- **files:** `/jffs/settings/savedqueues.rsq (file:/// URI form)`, `savedqueues.rsq.tmp (atomic write staging)`, `savedqueues.d.rsq (backup/dirty variant)`, `trackqueue.rsq + /trackqueue.rsq#0 fragment (live queue)`
- **semantics:** 'Version not valid'/'Num tracks not valid'/'SavedQueue file at boot is not valid'/'Replicated SavedQueue file is not valid' (validated on read; 'Add Track Move range: %u-%u to %u' reorder mechanics; 'Migrated tracks for account sn=%u') account migration rewrites saved queues; application/gzip string nearby suggests the replicated/transport form can be gzipped
- **related_actions:** Queue service: CreateSavedQueue, AddURIToSavedQueue, ReorderTracksInSavedQueue, RemoveSavedQueue operate on this store; SavedQueuesUpdateID is the change counter; SQ: object-ID prefix projects saved queues into ContentDirectory
- **name:** tqueue.cxx track-queue engine
- **transactions:** append protocol: beginAppend/cancelAppend/commitAppend/commitAppend(replace) with transaction IDs ("Append transaction ID mismatch" aborts); ReplaceAll index map "search c:%d/%d m:%d r:%d cti:%d/%d" + validity "(%u > %u)" + "old:%d-%d new:%d-%d cur:%d new:%s/%d"
- **stores:** persistence file trackqueue.rsq; stores trackQueue + trackQueueRAM; TQD context encoding ("TQD context decoded len %zu exceeds buffer len %zu")
- **metadata:** trackMdCache + savedq_mdcache; fallback chain enqueued -> DIDL initFromDIDLLite -> cached metadata -> "Loading from CSV extra md" -> initFromTrackMd; fetch fields "dc:title,upnp:artist,upnp:album,res@duration,res"; duration/extra-MD update ops
- **playmodes:** `NORMAL`, `SHUFFLE_NOREPEAT`, `REPEAT_ALL`, `SHUFFLE_REPEAT_ONE`
- **events:** playmodelEvent {eventType,curationState}; "setting link URL: %s" on isAd tag; trackQueueSummary name
- **queue_xml:** queue doc: <QueueID val="%.20s"/><QueueOwnerID val="%s"/><UpdateID val="%u"/><Curated val="..."/>; fields {QueueID,QueueOwnerID,QueueOwnerContext,QueuePolicy,EnqueuedURIsAndMetaData,CurrentTrackIndex,NewCurrentTrackIndices}; verbs {AddMultipleURIs,AddURI,AttachQueue,Backup,CreateQueue,RemoveAllTracks,RemoveTrackRange,ReorderTracks,ReplaceAllTracks,SaveAsSonosPlaylist}; policy flags {fullTrackOnly,allowShuffle,allowRepeat,cacheOnPause,stopOnError,clearOnEnd,pauseAtEnd,repeatLastTrack}
::: details Evidence (7)

- @ 0x10ed3104; savedqueues.rsq
- @ 0x10ed3164; <SavedQueues
- @ 0x10e93f98; trackqueue.rsq
- @ 0x10ed3448; <SavedQueues LastUpdateDevice=.. Version=.. Next=..> root
- @ 0x10ed350c; <SavedQueue Id=.. Curated=.. NumTracks=..> element
- @ 0x10ed34f4; <Track URI=.. MD=..> entry element
- @ 0x10ed329c; file:///jffs/settings/savedqueues.rsq

:::


:::

## `rdmbuttonfwd_detail`

**coverage** `partial`

The button-forwarding endpoint's behavior: it checks authentication and whether the player is in remote-diagnostics mode, and only then do physical button presses get forwarded to the remote observer. Otherwise requests are rejected.

::: details Technical details

f_100b9e58: auth gate f_105489fc + RDM-mode predicate f_105e9468 → f_100b9bb0 forwards buttons; else 403-class: GET/POST path via f_100b9bb0 after RDM-mode predicate f_105e9468

- **name:** rdmbuttonfwd_detail
::: details Evidence (1)

- firmware; handler disas

:::


:::

## `runtime_flag_files`

**coverage** `partial`

A set of sentinel files in the device's temporary and runtime directories flips behavior at runtime: unlocked, broken-device, WiFi-disabled, crashed-play-state, setup mode, and similar markers. They're the mechanism behind diagnostics, developer mode, and setup states, letting a file's presence or absence toggle behavior without code changes.

::: details Technical details

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
::: details Evidence (6)

- @ 0x10efff88; /tmp/device_unlocked_flag
- @ 0x10ef4e9c; /tmp/brokendevice
- @ 0x10e75afc; /tmp/memorylog
- @ 0x10e75764; /proc/ath_rincon/* + /proc/driver/* interface table
- @ 0x10e7525c; /jffs/settings/* persistent store paths
- @ 0x10e75bcc; /tmp flag-file cluster

:::


:::

## `runtime_policy`

**coverage** `partial`

The runtime policy object: it consults the config and settings stores to decide allowed-versus-disallowed outcomes for feature gates that depend on live configuration rather than build flags. It's the rule-check layer applied to operations and settings at execution time.

::: details Technical details

ctor deps {fcs,hhsettings,settingsmgr}; Disallowed; P2P {isEffectiveP2PPolicyEncrypted,'Effective P2P Policy is encrypted \[%s\]'}; flags {'Use Thor w/ Muse','Chsrc Optimization Enabled'}; policy dimensions: LisEntitlementOn (entitlement gate), isBusinessSystem + isBusinessSubscriber, usageContextCloudSetting, Cloud Schedule ('Business Cloud Schedule has changed' re-eval trigger), 'Guest Access Enabled', 'Unathenticated Control Enabled' \[sic\], 'Insecure UPnP Allowed', 'Effective P2P policy is encrypted'; RuntimePolicyEvent re-eval loop ('Reevaluating runtime policies' on isBusinessSubscriber/Cloud Schedule change); ctor failure 'Error: Cannot construct RRuntimeZPPolicy \[localSettingsMgr=%s,entitlementsMgr=%s\]'; fetch failure 'Failed to fetch latest entitlements in %s \[ec=%s\]'; cloud-settings XML '<CloudSettings cacheStatus="get_status_fresh" eTag="%s" type="json">'; playback-restriction vocabulary ('%s Disallowed (%s)' pattern): Pausing, Resuming, Seeking, Previous Track Visible, Next Track Visible, Skipping Previous, Skipping Next, Shuffle, Repeat All, Repeat One

- **name:** runtime policy (RRuntimePolicy)
::: details Evidence (1)

- @ 0x10efdaa4; runtime policy

:::


:::

## `scrobbler`

**coverage** `partial`

Last.fm scrobbling is built in: the player handshakes with post.audioscrobbler.com (Audioscrobbler protocol 1.2), then POSTs each played track as form fields (artist/title/timestamp/album/MBID...). On a BADTIME handshake it recovers by reading the HTTP Date: header. A newer ws.audioscrobbler.com/2.0 API is also linked. Which account it scrobbles for and the exact trigger policy are still unresolved. Reports what you played to listening-history services (last.fm-style): packages each finished track into a submission.

::: details Technical details

Audioscrobbler/Last.fm submission client implementing protocol 1.2 over raw sockets: GET handshake to post.audioscrobbler.com, form-encoded scrobble POSTs, BADTIME Date-header recovery, OK-response check; also embeds ws.audioscrobbler.com/2.0 for the newer API; last.fm REST auth: method 'auth.getMobileSession' + signed '&api_sig=' (md5 constants present); last.fm API key 49f9477923cc3ab8ed90029f6e7e1d9f; timing telemetry '%s failed, ret = %hu, tvStart = %d s %d us, m_tvConnectDone = %d s %d us, m_tvDone = ...'

- binary anchors: `http://post.audioscrobbler.com/`, `https://ws.audioscrobbler.com/2.0/`, `scrobbling submission %s`, `last.fm-radio-http`, `/?hs=true&p=1.2&c=`, `&a\[0\]=`, `BADTIME -- stealing time from Date: header`

- **handshake:** GET /?hs=true&p=1.2&c= HTTP/1.1 to http://post.audioscrobbler.com/ (c= = client id); service token 'lastfm'; on BADTIME response it logs 'BADTIME -- stealing time from Date: header' and resyncs clock from the HTTP Date: response header
- **submission:** Raw 'POST %s HTTP/1.1' + HOST/CONNECTION: close/CONTENT-TYPE: application/x-www-form-urlencoded/CONTENT-LENGTH template; body fields 's=' (session from handshake) then per-track '&a\[0\]=' artist '&t\[0\]=' title '&i\[0\]=' timestamp '&o\[0\]=' source '&r\[0\]=&l\[0\]=' rating+length '&b\[0\]=' album '&n\[0\]=' tracknumber '&m\[0\]=' MBID: the classic submissions-protocol array
- **transport:** Owns its own connection ('scrobbling openConnection to %s %s failed'), not the shared HTTP client; checks 'OK' status line ('Scrobbling failed. Status returned: %s')
- **endpoints:** `http://post.audioscrobbler.com/ (handshake + legacy submission)`, `https://ws.audioscrobbler.com/2.0/ (v2 API, usage unresolved)`, `last.fm-radio-http URI scheme (func ~0x1041d43c)`
- **result_codes:** R_LASTFM_BAD_ACCOUNT, R_LASTFM_BAD_SUBLEVEL, R_LASTFM_NO_ACCOUNT, R_LASTFM_NO_CONTENT, R_LASTFM_STREAM_LIMIT
- **unresolved:** submission trigger policy (when a track scrobbles), queueing/retry on failure, where session creds live (SystemProperties?), which player state gates scrobbling, ws.audioscrobbler.com/2.0 usage
- **endpoint:** https://ws.audioscrobbler.com/2.0/ (Audioscrobbler 2.0 REST); xmlpost CONTENT-LENGTH; "openConnection to %s failed"; "Data overflowed; ignore submit"
::: details Evidence (8)

- @ 0x10ee4c18; http://post.audioscrobbler.com/
- @ 0x10f0e118; https://ws.audioscrobbler.com/2.0/
- @ 0x10ee4d64; scrobbling submission %s
- @ 0x10eccfcc; last.fm-radio-http
- @ 0x10ee4c38; '/?hs=true&p=1.2&c=' handshake path template
- @ 0x10ee4ce4; POST template + form fields &a\[0\]=..&m\[0\]= at 0x10ee4cd4-0x10ee4df4
- @ 0x10ee4ca0; 'BADTIME -- stealing time from Date: header'
- @ 0x105240c8; submission builder in f_105236c8

:::


:::

## `select_thread`

**coverage** `partial`

The central event-wait thread: descriptor add and remove with per-user accounting, interrupt handling, and change detection. It's the program's main loop that waits on sockets, timers, and hardware at once, the heartbeat of the whole process.

::: details Technical details

{epollAddFD,selthrd,RSelectThreadMutex,SelthrdUpdateMutex,epollReset}; errors {"Error in addUser - too many users","Error adding/removing interrupt fd to epoll","%s improperly changed its FD to %d (watching %d)","Error in eventfd (%d)","Error removing fd %d for %p %s (%s)","%s: %p %s already watching fd %d, removing it first","Error adding fd %d","Update error stu %p not in st %p","Error %d in epoll wait (%s)"}; sonos-concurrency cond API {sonosCondCreate,sonosCondWait,sonosCondWaitFor,sonosCondWaitUntil,sonosCondNotifyOne,sonosCondNotifyAll} (cond_impl.cxx); mainSonosThread; UnrecoverableError_int; thread-dump fmt '%5lu %30s(%3d,%3d)\[%02X\]: ' + 'waiting on %s %s (%d),'; registered fd-handler names incl selthrd.{RIRDecoder,RHWEvtHandlerZP,RTrackPlayMonitor,RIfAddressMonitor,RMSearchNotifyHandler,ArpChecker,ARPingManager,RIPCHandler}.{reset,data,except,timeout}

- **name:** RSelectThread epoll wrapper
::: details Evidence (1)

- @ 0x10fba020; select thread

:::


:::

## `semisleep_power`

**coverage** `partial`

A suspend and resume engine: the strings and flags show players can enter a low-power 'semi sleep' state and resume, which is relevant to idle latency and to why a sleeping player can lag on its first command. The details are not yet fully decoded.

::: details Technical details

low-power 'SemiSleep' suspend/resume: gated by featureConfigSemiSleep/enableSemiSleep + semiSleepConfig cloud config; 'Supported only on suspendable devices' capability check; suspends VLI sessions (onVirtualLineInSuspendSession, AHA_SUSPEND_VLI_SESSION, SUSPEND_SESSION op), playback sessions (muse playbackSession/suspend verb), cloud queue (during snooze/alarm), and local timers track suspend ('considering suspend'); group topology marks suspended members ('Found Suspended Rooms While Processing %s Group Info') | Local timers (timers_impl.cxx / MuseTimerImpl): ops set/set-duration/set-relative-duration/create/delete/pause-delete/pause/resume each log "...(considering suspend) %s" on failure - suspend gates every timer mutation; timers persist across suspend in SQLite table timers(id TEXT PK, trigger_time TEXT, total_duration INTEGER, triggered NUMERIC) @0x10edcf88; "Unable to remove time on a ringing timer" guards firing timers. | Pause persistence: paused_timers(id PK, remaining_seconds, paused_utc_time, total_duration) @0x10edd018: parked timers survive suspend; resume recomputes.; powPrvntIdlM/powWakLkMgr guards: 'ERROR: modifyPreventIdleLockForOperationTimeout(%d, %lld) not acquired by guard','ERROR: modifyWakeLockForOperationTimeout(%d, %lld) not acquired by guard'; wifi_idle_mgr 'Set WifiFuncsSetIdleScan fronthaul result %d attempt %d'

- binary anchors: `enableSemiSleep`, `featureConfigSemiSleep`, `powerWakeupFromSemiSleep`, `DirectControlIsSuspended`, `semiSleepConfig`, `powerWakeupFromSemiSleep`, `powerWakeupFromSemiSleep`, `<r:DirectControlIsSuspended val="`, `AmplifierPowerStateChangedEvent`, `featureConfigSemiSleep`, `semiSleepConfig`

- **evidence_bits:** featureConfigSemiSleep + semiSleepConfig JSON key in cloud config; powerWakeupFromSemiSleep wake entry point; '<r:DirectControlIsSuspended val=' is an r:-namespace replicated element; AmplifierPowerStateChangedEvent; SONOS_PLAYER_SLEEPING and SONOS_PLAYER_LOW_BATTERY are lechmere close reasons: suspension tears down the cloud channel
- **fsm_bits:** entry: UserSuspend/Suspend and reset/int_internalSuspend → 'suspending stop'/'suspendSession'; state: isSuspended/suspended + <r:DirectControlIsSuspended> replicated element + 'suspend bypass flag' gating LED apply; wake: powerWakeupFromSemiSleep; 'registration during suspend' queues/defers registration
- **errors:** ERROR_PAND_SUSPENDED (Pandora op fails while suspended); SONOS_PLAYER_SLEEPING/LOW_BATTERY lechmere close reasons
- **wake_related:** WoW wake of vanished group members + WakeOnLANRequestEvent + wake-lock guards ('modifyWakeLockForOperationTimeout(%d, %lld) not acquired by guard'), 'SYSTEM_ERROR_WAKEUP_FAILURE'; 'powerWakeupFromSemiSleep' muse op + 'STAY_AWAKE' flag
::: details Evidence (12)

- @ 0x10e86d24; enableSemiSleep
- @ 0x10f97b58; featureConfigSemiSleep
- @ 0x10e86c60; powerWakeupFromSemiSleep
- @ 0x10eb2c7b; DirectControlIsSuspended
- @ 0x10e86d24; enableSemiSleep + powerWakeupFromSemiSleep
- @ 0x10f9c084; semiSleepConfig JSON key
- @ 0x10e86c5d; powerWakeupFromSemiSleep wake entry point
- @ 0x10eb2c78; <r:DirectControlIsSuspended> replicated state element
- @ 0x10f01734; suspended rooms tracked in group info
- @ 0x10f0408c; AHA_SUSPEND_VLI_SESSION op
- @ 0x10fba624; LED apply gated by suspend bypass flag
- @ 0x10edccbc; timers_impl.cxx literal block: timer op logs + SQLite DDL

:::


:::

## `sethostip_detail`

**coverage** `partial`

The host-address override endpoint detail: a gate plus a routine that sets the host address and responds. It's one of the engineering endpoints, wired through a different route than the normal pages.

::: details Technical details

f_100b9fac: gate → tail f_105499fc (host-ip set + respond)

- **name:** sethostip_detail
::: details Evidence (1)

- firmware; handler disas

:::


:::

## `settings_replication`

**coverage** `partial`

Household state is kept in sync by a replication protocol: each named store (accounts, network settings, favorites, saved queues, areas) has a version-and-format handshake and per-item transfers between players. The wire exchange is now fully decoded, including how a newer setting is announced, pulled, signature-checked, and installed. The whole protocol is gated on registration, so an unregistered player refuses to replicate.

::: details Technical details

the household replication bus: per-setting transfers ('replicateOne from %s to %s setting %u version %u') with a version+format negotiation ('deciding whether to accept replicated list from: %s; ver: %u format: %u'); per-setting denylisting on badFormat/badEncoding; a separate player-level quarantine subsystem enforcing admission policy (HTTPS required, known user, secure reg required) with scheduled rechecks; suppressed while unregistered; \[Gp\] ingest taxonomy: 'settings \[%s\] player only settings group received location settings \[%s\] \[%llu\]' (player-only vs location settings group split), 'setupSettingsContainerFromStorage(%s) \[%d\] attemptSettingsIngestFromStorage failed %08X'/'attemptSettingsIngestFromStorage success from old schema'; ingest key 'attributeSources'; JSON-schema 'multipleOf' keyword recognized; netsettings.json schema keys {genVersion,genTime,/sonosnet,sonosnetDisable,/networks,pass,backupPsk,backupControlPsk,backupRoomEncPsk,backupLanSwapPsk} + 'Parsing error %s'; settings-REST validation ladder {'Failed to get protected settings','Unsupported setting','unsupported object type','unknown settings group name','missing settings group name','invalid JSON body','JSON body must be an object','invalid settings group for update','unknown settings key','bad schemaVersion, eTag, or timestamp','unexpected json structure','Unable to set SonosNet Channel'}; file push 'Send file %s, version %u, in format %u to %s' + 'Error generating signature'

- binary anchors: `replicated_settings.cxx`, `<ReplicationOperation`, `NextFavorite`, `<ReplicatedNetSettings`, `replicateOne from %s to %s`, `X-Sonos-Denylisted`, `REPLICATION_IN_PROGRESS`

- **envelope:** <Replication><ReplicationOperation>%s</..><ReplicationResult>%d</..><ReplicationPlayer>%s</..><ReplicationTime>%s</..></Replication></AccountsInfo>
- **negotiation:** 'replication skipped: local fmt %u, remote fmt %u': format-version handshake per store; 'ignoring replicated file: incompatible schema'
- **failure_taxonomy:** denylisted setting / badFormat / badEncoding / bad algorithm / bad version / bad version+last-update-id / temp file failure: offenders denylisted ('denylisting replicated setting %u, unknown or blocked', 'Denylisted pyle!'), peers quarantined via <QuarantinedDevices> + X-Sonos-Denylisted header
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
  - **fetch:** GET %s%s?id=%u HTTP/1.1: per-setting pull by numeric id
  - **request_headers:** `CONNECTION: close`, `ACCEPT: */*`, `HOST: %s:%d`, `USER-AGENT: %s`, `X-RINCON-CONTENT-FORMAT: %u`
  - **response_headers:** `X-RINCON-CONTENT-VERSION`, `X-RINCON-LAST-UPDATE-DEVICE`, `X-RINCON-CONTENT-FORMAT`, `CONTENT-ENCODING`, `X-RINCON-SIGNATURE`
  - **index_record:** <Setting idx="%u" lud="%s" version="%u" />: lud = last-update-device uuid
  - **offer_flow:** 'offerUpdatedSetting: src=%s set=%u ldev=%s ver=%u fmt=%u': peers offer updated settings {src, settingId, lastDevice, version, format}; receiver pulls via GET
  - **failure_taxonomy:** `openStream 0x%08x %s \[%d\]`, `filesize bad/unavail %zu`, `bad version/last update id`, `denylisted setting %u %s`, `badFormat %u -> denylisting`, `badEncoding %d -> denylisting`, `bad version %u`, `Cannot open temp file`, `bad algorithm`, `signature mismatch`, `Not replicating while unregistered`, `replicating from URI %s (%u) failed with %u`
  - **install:** download to setrepl.tmp then atomic promote
  - **denylist:** 'denylisting replicated setting %u, unknown or blocked'; 'Removing settings denylists after registration'; 'Setting %u needs to call addServiceSetting'
  - **magic:** 'RINCON_FFFFFFFFFFFF99999': device-id/magic pattern literal
  - **gate:** 'Not replicating while unregistered': replication requires completed registration
::: details Evidence (9)

- @ 0x10efd14e; replicated_settings.cxx
- @ 0x10eacbb0; <ReplicationOperation
- @ 0x10ec0ce2; NextFavorite
- @ 0x10efd374; replicateOne from %s to %s setting %u version %u
- @ 0x10efad64; <ReplicatedNetSettings LastUpdateDevice Version FileSchemaVersion>
- @ 0x10efd4b0; denylist failure taxonomy strings
- @ 0x10efd374; replicateOne + full failure taxonomy strings
- @ 0x10f17d48; quarantine admission reasons: HTTPS/unknown user/secure reg
- @ 0x10e76e68; ver/format negotiation on accept

:::


:::

## `sharelist`

**coverage** `partial`

The music-share list manager: add, remove, re-index, and re-sort shares, replicate the list across players with a 'whose is newer' comparison, and drop shares whose protocol fails verification. It's the registry of configured music shares, meaning which folders on which machines are in the library.

::: details Technical details

replication via %s/indexrepl + proposeUpdatedShareList + "remoteSettingIsBetter: us \[%s|%u\] vs them \[%s|%u\]"; ops {localAddShare,localRemoveShare,localRequestReindex,localRequestResort,localRemoveUnsupportedShares}; protocol gate {verified supported protocol→keep,else remove + count} + VerifiedValidProtocol flag; errors {share ID not found,path already exists,subsumed by existing share,Path is malformed,Access denied,Cannot exceed maximum shares,Mounting failed,Local index storage error,Remote file share error,Indexing canceled,connection failure,replication failed,replication skipped fmt mismatch}; reindex "request reindex (ad:%d sf:%d fr:%d si:%d st:%d lc:%s)" + "Turning resort request into full reindex" + "processing index complete (c:%d i:%d f:%d lc:%s)" + commit {m_bCommitted,m_bWait,m_bTerminate} + index recovery "recovered ix=%d with ver=%d"; R_BrowseByFolderSort + Tracknum sort

- **name:** sharelist: SMB share replication + index
::: details Evidence (1)

- @ 0x10e89d48; sharelist block

:::


:::

## `shoutcast`

**coverage** `partial`

The Shoutcast and ICY stream client: request headers, response handling for the ICY and HTTP variants, redirects, and metadata-interval handling. This is what plays legacy internet-radio streams, which many stations still use.

::: details Technical details

request {icy-name:,location:,CONTENT-TYPE:,server:} + server id Cougar; responses {ICY 200,HTTP/1.1 200,HTTP/1.0 200,HTTP/1.1 30x,HTTP/1.0 30x} + redirect to %s; "request buffer is too small"; "add header \[%s: %s\]"; "opening connection with \[%s\]"; "Redirect audio/x-mpegurl to %s" (M3U); inline metadata {StreamTitle,text=""} + "end of file or I/O error"; shoutcastradio type; explicitContentFiltering + rsmapicontextzp; private-frame extraction: 'Found %zu bytes of%s private frame data for %s' (' (incomplete)' marker), 'get meta: %f %s, %s', 'new meta: %s', 'new artwork: %s': artwork URLs ride ICY private frames

- **name:** shoutcast/ICY stream client
- **request_template:**
  - **literal:** GET %s HTTP/1.1\r\nCONNECTION: close\r\nACCEPT: */*\r\nHOST: %s%s\r\nUser-Agent: %s Nullsoft Winamp3 version 3.0 (compatible)\r\nIcy-MetaData: 1\r\n
  - **address:** 0x10ed46d0
  - **notes:** The stream client spoofs 'Nullsoft Winamp3 version 3.0 (compatible)' as the User-Agent suffix and sets Icy-MetaData: 1 to opt into inline ICY metadata blocks (the metaint interval stream interleave). ACCEPT-ENCODING is NOT offered - streams are read raw.
::: details Evidence (2)

- @ 0x10ed462c; shoutcast block
- @ 0x10ed46d0; GET template w/ Winamp3 UA spoof + Icy-MetaData: 1

:::


:::

## `shutdown_reasons`

**coverage** `partial`

The idle and shutdown reason codes: the vocabulary covering API calls, Bluetooth connections, partner disappearing, recovery, user suspend, user shutdown, and critical shutdown, plus the idle-state transitions. Suspend/resume decisions and 'why did it power off' answers come from this set.

::: details Technical details

"idle state is %sidle, changing to %sidle" + dpUpdateIdleState; reasons {APICall,BluetoothConnection,PartnerDisappeared,Recovery,UserSuspend,UserShutdown,APIShutdown,CriticalShutdown,UnknownShutdown}; "unable to parse KVPair. %s is an invalid KV pair string."; battery {RawBattPct,BattPct,BattChg,BattTmp,BtSrcName}; EnetPorts {<Port port Link Speed> + EthPrtStats {rxPackets,txPackets,rxBytes,txBytes,rxErrors,...}}

- **name:** idle/shutdown reason enum + battery
::: details Evidence (1)

- @ 0x10ef3328; idle/shutdown block

:::


:::

## `shutdown_seq`

**coverage** `partial`

The ordered teardown sequence: web client, zone player, the cloud-API thread pool, the internal event distributor, then timed jobs and state, each component stopped in a specific order. It's how the program shuts down cleanly instead of dying mid-operation.

::: details Technical details

ordered teardown {HttpClient,ZonePlayer,AsyncMuseThreadPool,InternalEventDispatcher,resetZone,DropoutEventHandler,deleteTimedJobManager,AsyncThreadPool,finalSection,finalSectionEnd}

- **name:** modZPShutdown sequence
::: details Evidence (1)

- @ 0x10e743d7; shutdown order

:::


:::

## `signal_source`

**coverage** `partial`

The signal and tone source: single-instance tone injection with play-ID validation, channel targeting, and policy gating. Calibration tones and test signals use this engine, and it's where audio signals conceptually originate inside the system.

::: details Technical details

errors "invalid playId"/"failed to stop signal"/"incorrect playId"/"nothing is currently playing"/"couldn't create an audio stream"/"only one signal can run at any given time"/"invalid channel"/"disallowed by policy"; channelNumber param

- **name:** signal/tone source
::: details Evidence (1)

- @ 0x10ed2dc8; signal source region

:::


:::

## `smapi_descriptor`

**coverage** `partial`

The music-service descriptor schema: the API key, presentation map, strings, reporting, and browse sections plus account tiers. The descriptor is what the player reads to learn a service's capabilities, and it's the contract a custom service must implement.

::: details Technical details

fields {apiKey,advertising,presentationMap,strings,reporting,browse,Moment}; accountTiers {paidLimited,paidPremium}; additional capability checkbox values from the embedded form: noMultiAccount, plus confirm contextHeaders/deviceCerts/playerIds/userInfo/contentFiltering/manifest/authorizationHeader/mediaUriActions already catalogued; capability checkboxes submit via an HTML form POST (type=submit): noMultiAccount is the exact wire key; service-type names partner-defined-context, artistRadio/artist-radio, artistTopTracks

- **name:** SMAPI service descriptor schema
::: details Evidence (1)

- @ 0x10ea5c70; smapi descriptor fields

:::


:::

## `smartplay`

**coverage** `partial`

The SmartPlay bridge-content loader: when triggered it asks the cloud for content suited to a group and starts playback, all timed. This is the 'speaker plays something sensible when you press play with an empty queue' feature, Sonos's smarter playback-decision machinery.

::: details Technical details

reasons {BUTTON,EMPTY_AVT}; "PlayerSmartPlay missing required field %s"; /bridge/content/api + "service base path: %s"; timings {"loadContent took %ld ms: GroupId %s GC %s %s","getContent took %ld ms: %s","fetchContentAndStartPlay took %ld ms, success: %s"}; errors {loadContent failed,getContent parse failed,getContent failed}

- **name:** smartplay: bridge content loader
::: details Evidence (1)

- @ 0x10ed4968; smartplay block

:::


:::

## `sntp_server`

**coverage** `partial`

Sonos runs its own time system: players sync from Sonos's own time-server pool, and one household player also hosts a time server the others can sync from, with that server role able to migrate between players. Grouped playback start times are scheduled on this shared clock, which is how multi-room audio stays in sample-accurate sync.

::: details Technical details

Dual-mode SNTP stack (sntp.cxx client + sntpsrv.cxx server + sntppoll.cxx poller): players sync from *.sonostime.pool.ntp.org or the group coordinator, one player hosts an SNTP server for the household ('Starting SNTP server switch'), and SNTP validity gates synchronized playback scheduling; server-clock lifecycle: 'Created SNTP Server, port: %hu clock: %s','No clock set!','SNTP server thread loop starting','SNTP server cfg change requested'; per-clock {added/failed 'server clock %d on %','server clock on %u already present','stop monitoring server clock','server clock on %u removed'/'not found', request failed -> 'thread exiting','could not process sntp-%u-clock request; thread exit'}; virtual clocks 'request virtual clock %s install on port:%u'/'cannot install virtual clock on port:%u'/'request virtual clock removal on %s:%u'/'cannot remove virtual clock on port %u','adding/removing virtual clock fd %d'; fd mgmt 'added/failed sntp interrupt fd','remove %d succeeded/failed','event mask was zero but remove for %d succeeded','removed/failed to remove sntp interrupt fd %d'

- binary anchors: `sntpsrv.cxx`, `handleSntpRequest`, `Created SNTP Server`, `Created SNTP Server, port: %hu clock: %s`, `Starting SNTP server switch.`, `sonostime.pool.ntp.org`, `SNTP waiting for valid`, `vli sntp port %u`

- **upstream:** 0-3.sonostime.pool.ntp.org pool; /ntpsources HTTP endpoint; ntpSync poll op; 'set SNTP server: %d.%d.%d.%d'
- **server:** 'Created SNTP Server, port: %hu clock: %s', thread loop with 'sntp-%u-clock' request handling: MULTIPLE named clocks; server role switches at runtime ('Completed SNTP server switch in %dms'), plausibly to the group coordinator
- **client:** sntppoll.cxx: 'SNTP request to group coordinator failed', 'SNTP success after %u failures', 'Time went backward, discard SNTP offset'; ToS marking attempted ('Unable to set ToS for SNTP'); offset persisted via sntp.txt/save_sntp
- **sync_play:** 'SNTP waiting for valid at %d.%06d', 'SNTP valid %d continue to play %d at %d.%06d', 'synchronizedPlay: noderx I/O error while waiting for SNTP': grouped playback start times are scheduled on SNTP time; htsnk_invld_sntp faults the HT sink
- **vli:** VLI streams carry SNTP config: 'vli sntp port %u', 'vli src tx settings sntp port'
- **unresolved:** server-election rule, clock-domain semantics, port number, jitter/drift thresholds
- **server_detail:** sntpsrv.cxx: local SNTP responder: 'failed sntp response on %s:%u', per-clock request handling 'could not process sntp-%u-clock request; thread exit', 'processing sntp-%u-clock evtMask: %u fd: %d' under domain 'sntp_srv', interrupt fds added/removed dynamically. sntppoll.cxx: '{sntppoll' status XML + sntp.txt dump + save_sntp key; zone/common/sntp.cxx provides 'sntp.poll'. VLI transport is SNTP-disciplined: 'vli src tx settings sntp port: %u', 'vli sntp port %u', 'htsnk_invld_sntp' (HT sink rejects invalid sntp). Drift telemetry: 'error was %.0f ms %s; cpu usage was %.01f%%; sntp v:%d f:%d'.
::: details Evidence (7)

- @ 0x10ed6496; sntpsrv.cxx
- @ 0x10ed62e8; handleSntpRequest
- @ 0x10ed6418; Created SNTP Server
- @ 0x10eaac68; 0-3.sonostime.pool.ntp.org pool list
- @ 0x10ed6418; 'Created SNTP Server, port: %hu clock: %s' (sntpsrv.cxx)
- @ 0x10eb4bd4; 'Starting SNTP server switch.'
- @ 0x10eb5758; synchronizedPlay SNTP wait

:::


:::

## `socket_hal`

**coverage** `partial`

The socket abstraction layer for the embedded Spotify component: platform sockets wrapped for the Connect stack, including DNS queueing and the connect and accept error vocabulary. Everything the component does on the network lands here.

::: details Technical details

errors {"listen socket_listen/bind/set_option/create ret: %d","DNS callback not set","Requested hostname longer than %d","DNS lookup returned %d","connect socket_create/set_option/connect ret: %d","cb_socket_connect() = %d","try again, returning","Error setting kSpSocketReuseAddr/ReusePort/MulticastTTL/MulticastLoop/Membership/NonBlocking","udp socket_bind/create ret: %d","socket_close/accept/set_option/read ret: %d","Returning EOF/error on disconnected socket"}; tags {SOCKET-MANAGER,TLS-INTERNAL,Socket reporting error}

- **name:** eSDK socket HAL
::: details Evidence (1)

- @ 0x10fd80c4; socket HAL

:::


:::

## `sonarctl_detail`

**coverage** `partial`

The /sonarctl endpoint detail: a control surface for the room-detection acoustic subsystem, gated like the other engineering endpoints. An internal handle on the chirp machinery used during setup.

::: details Technical details

gate f_105489fc → method check (r9==1 POST?) → f_100b4614+f_100b4364+f_100b4388 response helpers; flushes sonar tones ("flushing sonar tones"/"Flushed")

- **name:** /sonarctl
::: details Evidence (1)

- @ 0x100bc354; handler disas

:::


:::

## `sonoscp`

**coverage** `partial`

The content-provider umbrella: the music-service client, the Windows Media provider, and service-descriptor handling together. It's the module that speaks to external content sources, the integration layer between the player and outside catalogs.

::: details Technical details

vars {reports,playbackPolicies}; errors {"Unable to validate specified service id %u","ignoring unsupported object %s","could not identify default account for object %s","cannot map content type %s to SMAPI protocol \[accountId:%s,sid:%s,obj:%s\]","cannot generate SMAPI URL"}; CQ URI cache {"Fetching CQ itemId %s using cached trackURI.","Adding track URI for itemId %s to cache.","Invalidating CQ track URI cache.","CloudQueueWindow init: %s"}; audio/x-spotify

- **name:** sonoscp content provider
::: details Evidence (1)

- @ 0x10eb9c50; sonoscp block

:::


:::

## `sound_device`

**coverage** `partial`

The sound-device abstraction: the layer between the mixer and the hardware, covering device open, buffer negotiation, and the fault vocabulary the audio stack surfaces. On this model it fronts the audio-bus driver, sitting between 'set volume' and the amplifier.

::: details Technical details

syslib events {open,get_fd,poll,read,close} errors; LLA checks {DAC count,sample width inconsistency}; system/src_disable + StdQ ASRC Coeffs + "Running with SRC bypassed"; orientation sensing; "reset vcxo"; health flags {AMP_CURRENT_WARN,AMP_FAULT_WARN,AUDIO_WARN_TEMP,CPU_WARN_TEMP,CPU2_WARN_TEMP,SOC_WARN_TEMP,AMP_CURRENT_FAULT,AMP_FAULT,AUDIO_FAULT_TEMP,CPU_FAULT_TEMP,CPU2_FAULT_TEMP,SOC_FAULT_TEMP,PS36_FAULT,UV36_FAULT,UV14_FAULT,POWER_WARN_TEMP,POWER_FAULT_TEMP,MOTION_FAULT_TEMP,MOTION_WARN_TEMP}_STATUS

- **name:** sounddev: output device + HW health
::: details Evidence (1)

- @ 0x10f2ac18; sounddev block

:::


:::

## `sound_swap`

**coverage** `partial`

SoundSwap: the feature that moves a TV's audio between a soundbar and a paired portable speaker. Its state machine handles swap requests, target selection, and handoff, driven by modern-API verbs. Think 'move what's playing to the speaker I'm next to'.

::: details Technical details

sound_swap/audio_swap; queue audioSwapEventQueue + progress audioSwapProgress; behaviors SWAP_BEHAVIOR_{DO_NOTHING,PUSH_SWAP,PULL_SWAP,UNDEFINED}; push/pull disband target|initiator group; HTSatelliteChecker gates (isFound,isHTSat,playerUDN,HTPrimaryUDN + topology/group-props/GC-AVT lookups); FSM "New state: %i"/"Event %i not handled in state %i"/transition-failure -> reset; result fields {swapResult,swapType,swapTarget,swapGC,initAction,candCount,respCount}; gates {bonded zone,HT Satellite,unknown state,unswappable audio,already in progress}; muse calls museCmdSetGroupMembers/museCmdModifyGroupMembers via groups/%s/groups/modifyGroupMembers; initiator provenance flag museInitiated=%d on Swap initiated; FSM detail: swap-behavior enum {SWAP_BEHAVIOR_DO_NOTHING,SWAP_BEHAVIOR_PUSH_SWAP,SWAP_BEHAVIOR_PULL_SWAP,SWAP_BEHAVIOR_UNDEFINED} with 'Performing SWAP_BEHAVIOR_%s. Target = %s. GroupUUID = %s (size = %d). WM = %d.' action lines + 'Failed to disband {target's,initiator's} group with error code %d. Continue regardless.'; eligibility gates {'Initiator is playing non-swappable content','Swap is disabled as this player is in a bonded zone','Swap is disabled as this player is an HT Satellite','Can't swap because local player is in unknown state','Can't swap because initiator is playing unswappable audio','Ignoring swap request, one is already in progress'}; state machine {'Initialized SoundSwapController. Initial state is %i','Processing event: %i','Event %i not handled in state %i','Transition failure handler failed. Resetting system.','State %i failed to handle transition failure event. Resetting system.','New state: %i','Swap initiated target=%s museInitiated=%d.','Swap failed errCode=%d. target=%s event=%d state=%d swapInProgress=%d.','Swap completed successfully in onSwapMusicSuccess. target=%s'}; probe fields 'pszGCUUID = %s. bIsPlaying: %d. bIsContentSwappable = %d.' + 'AVTransportURI: %s.' + 'isFound = %i. isHTSat = %i. playerUDN = %s. HTPrimaryUDN = %s.'

- **name:** SoundSwapController: audio-swap FSM (zpSwap)
::: details Evidence (1)

- @ 0x10ed6b44; sound swap region

:::


:::

## `spdif_detect`

**coverage** `partial`

The optical-input detector: format detection on the input that decides which decoder path gets the stream, covering PCM, Dolby, and DTS. Detection failures surface as the input 'working' but producing silence.

::: details Technical details

detected {Dolby Digital,Dolby Digital Surround,Dolby Digital Plus,Dolby Atmos (DD+),Dolby TrueHD,Dolby Atmos (TrueHD),Dolby MAT,Dolby Atmos (MAT),DTS (Type1),DTS (Type2),DTS (Type3),NULL Burst,Pause Burst}; unsupported taxonomy {AC-3,SMPTE 338M v1-v5,MPEG1 Layer 1/2/3,MPEG2,MPEG2-AAC,MPEG2 Layer 1-3 LSF,DTS1-4,ATRAC,ATRAC 2/3,ATRAC X,WMA Professional,MPEG2 AAC LSF,MPEG4 AAC,Enhanced AC-3,MAT,MPEG4 ALS,Reserved 2-4,Extended Data,MPEG4 AAC LC in LATM/LOAS,MPEG4 HE AAC in LATM/LOAS,DRA,Unsupported}

- **name:** SPDIF IEC61937 burst-format detection
::: details Evidence (1)

- @ 0x10ee650c; spdif fmt enum

:::


:::

## `spotify_smapi_ctrl`

**coverage** `partial`

The Spotify service-integration bridge: the layer that lets a Connect session appear as a controllable media source, translating between component callbacks and the Sonos transport and queue model. It's the Sonos-side control path for the Spotify integration.

::: details Technical details

setPositionInfo fmt "trackId='%s', position=nullptr, duration=%d, bLastReport=true"; "discarding pre-transition position %lldms"; TransitionAck \[pos,preLogout pos,transAck\] + "Begin AwaitingTransitionAck \[preLogout=%lldms\]"; stream status "SMAPI current stream\[%u\] mediaType\[%d\]=%s (curTrkStatus\[%u\]=%d/nextTrkStatus\[%u\]=%d)"; "Notified we are receiving delegation. Resetting track queue info."; "Error event in SMAPI mode, e=0x%08x"; error map "error: %s ecode=%d (%s), mapped to 0x%08x"

- **name:** RSpotifySMAPIControl
::: details Evidence (1)

- @ 0x10ea46c0; smapi block

:::


:::

## `spotify_thread`

**coverage** `partial`

The eSDK thread: the event pump, message queue, rate limiting, and the transition-ack machinery that serializes Connect commands. Most 'Connect did nothing' bugs are a queued op dying silently on this thread. The dedicated thread running the embedded Spotify component, isolated from the main event loop.

::: details Technical details

single-request constraint "Already have a spotify request in progress, can only have one!!" + "Executing %s ..."/"%s timeout"; rate limit {"restricting excessive fatal error reporting","spotify telemetry rate limit exceeded!",spotrl}; connect ops {SpDisableConnect,SpEnableConnect,SpSetDisplayName,SpSetDeviceIsGroup,Enable/Disable Connect} "Set display name \[%s\], is%s grouped"; playback {SpPlaybackIncreaseUnderrunCount "Underruns reported: %u",SpPlaybackSetBitrate setbr,SpPlaybackPause/Play,SpPlayUriWithOptions,SpPlaybackEnableShuffle/Repeat,SpGetMetadata,SpZeroConfGetVars}; ads spotify:ad:/spotify:interruption:; restart token "'Radio' stripped from restart token. Token was %s now %s"; login {SpConnectionLoginOauthToken,waitForLogin,waitForLogout,"Login user change while in progress \[%s => %s\]","Already logging in as \[%s\]","Login mismatch","username %s... is longer than maximum %zu"}; logout {SpConnectionLogout,"logout %u, reset","Async logout initiated for VLI source switch","logout-%u - %d \[%s\]"}; work {RSpotifyEventWork::doWork(),DefaultWork}; "Failed to update the volume to %u (status=%d)"

- **name:** spotify request thread
::: details Evidence (1)

- @ 0x10ea49d4; spotify thread block

:::


:::

## `spotify_vli_session`

**coverage** `partial`

The Spotify-to-virtual-line-in session: how a Connect takeover materializes as a virtual-line-in session on the group, covering delegation guards, session lifecycle, and the transport handoff. The x-sonos-vli address scheme is this session's address.

::: details Technical details

session verbs {start,suspendSession,startAudio,pauseAudio,stopAudio,playModesChanged}; power {Spotify eSDK source power suspend/resume (e=0x%08x)}; delegation {"Ignoring audio flush/track changed/seeks (pos %u)/pause/became inactive while setting state / delegating","Spotify eSDK source selected, isDelegating %d, isActive %d","source not selected","Source Deselected, from sender %d"}; cookies {"%s:%d spotify old cookie: %d new: %d","Ignoring stale stopSession due to cookie mismatch"}; callbacks onVirtualLineIn{SuspendSession,StartAudio,StopAudio,PlayModesChanged} cookie %d; metadata {track,artist,album,playback_source_uri,bitrate} + Next Metadata; "Error event in VLI mode, e=0x%08x"; R_SPOT_EVT_AUDIO_TIMEOUT; RSpotifyVLIControl deactivate; VLI ABR policy: 'VLI ABR enabled: bitrate %u timeout %d','VLI ABR: BR %u tv %ld','lower bitrate to %u kbps after %zu buffering errors for %u mins','back to higher bitrate %u kbps after %u mins','%d mins since downshift, %d mins until upshift.','Starting bitrate %u','metadata changed, quality: %s, hifi: %s' + {oldQuality,oldHifiStatus}; status line 'BR %3u BL%% %2u/%2u FIFO %3u rate %4u/%4u/%4u Kbps %s %s'; 'Buffering error with time %ld.%ld is stale. Removing...','buf err %zu rate %u BL %u'; transport error taxonomy 'Transport error %s for Spotify VLI, URI: %s, recoverable: %s, ip: %s, host: %s, extra info: %s, http: %d' + rate-limited suppression ('%u messages suppressed'); spotify_playback_session.cxx + spotify_queue.cxx internals: NTS callbacks NTSCallbackConnectionMessage/ConnectionNewCreds/ConnectionNotify/PlaybackNotify/PlaybackApplyVolume/StreamEnd/StreamSeekToPosition/StreamGetPosition/Error; kSpConnectionNotifyTransmittingData; 'Connect Mode Toggled: %s'; VLI/SMAPI dual stream tracking '(VLI: %d \[%d\], SMAPI: %d \[%d\])'; 'Last played stream id=%u, pos: %u'; context pull 'Pulling context (playing=%d, seek time: %d.%06d, byte offset: %zu bitrate %u, observable: %d)','%s started externally. objectId=%s bIsObservable=%s bIsDelegating=%s bIsPlaying=%s'; TPM 'Spotify setPositionInfo (legacy TPM values): uri=%s, playbackId=%s, position=%.3f seconds, isFinalReport=%d','Failure parsing TPM uri: %s'; 'PlaybackId is not a valid streamId (%s)','ignoring play when not the active device','SpPlaybackSetDeviceInactive command failed'; queue ack FSM '(%s||%s||%u) Set (current|next) position: %lldms','(%s) EndSong @ %lldms / %ums','Track Finished Playing','Resetting position for track %s||%s as the download has not completed','Setting download complete for previous track (streamId: %u)','(%s) ??? Track complete inconsistency','Unknown track change (%s||%s) != upcoming track','ERROR current track mismatch','ERROR next track mismatch','!!!! \[BUG\] RESOLVING acked NEXT track mismatch'; media delivery 'eSDK media delivery stream start (id:%u, type:%s, size:%u)'/'data (id: %u), size: %u, offset: %u'/'end'/'flush'/'getPosition'; 'Dns HAL Exit: %s (status = %d, err = %d)','previous fatal error seen; resetting.','NTS shut down.','%s, attempting refresh','Login error 0x%x g=%d sn=%u','Setting the eSDK to the player volume (%u)','Starting Spotify playback with object: %s','No account is logged in','No descriptor for sid=%u','Bad credentials for sn=%u','Invalid account auth type','No account for sid=%u'; zeroconf dump fields devid/remoteName/deviceType/libraryVer/resolverVer/productId; 'Not changing container (%s) playing %s %s','track: not Spotify - %s (%s)','container: \[%s\] from \[%s\]'; transport-error rate limiting: 'Transport error logging rate limited - suppressing further errors' / 'Transport error logging no longer rate limited: %u messages suppressed' + per-error 'Transport error %s for Spotify VLI, URI: %s, recoverable: %s, ip: %s, host: %s, extra'

- **name:** Spotify eSDK VLI session control
::: details Evidence (1)

- @ 0x10ea5420; spotify vli block

:::


:::

## `ssh_keys`

**coverage** `partial`

The authorized-keys management: gated install and removal of SSH public keys, which is an engineering and debug feature rather than a consumer surface. The gate means it only works when the device is in a permitted state.

::: details Technical details

params {ssh_key,button,remove_keys}; ops {"SSH auth key added to authorized keys file","SSH authorized keys file removed"}; dropbearkey /usr/bin/dropbearkey + host key /jffs/persist/ssh/dropbear_ecdsa_host_key + ecdsa-sha2-nistp256; fingerprint formats {pubkey,sha256-base64,md5-hex}; gated by R_ALLOW_SSH_PUBKEY_INSTALL (per gap audit)

- **name:** /ssh/authorized_keys management
::: details Evidence (1)

- @ 0x10efefb4; ssh block

:::


:::

## `ssl_sessions`

**coverage** `partial`

The secure-session cache: session-resumption storage so repeated connections to the same host skip full handshakes. Its errors are distinct from certificate errors, since a bad cache entry isn't a bad certificate.

::: details Technical details

{'Cached SSL session for %s:%d','Failed to cache SSL session','SSL connection not established','Received new session ticket during mbedtls_ssl_{read,write,handshake}.'}; client-cache file guards: 'SSL client cache file %s does not exist (%s)','SSL client cache file %s parse failed (%s)','SSL client cache %s name mismatch (%s)'

- **name:** mbedTLS session cache
::: details Evidence (1)

- @ 0x10ee6c18; ssl session cache

:::


:::

## `stream_fetcher`

**coverage** `partial`

The generic stream fetcher: a state machine covering open, headers, redirects, resume-at-offset, and error recovery for HTTP audio. It sits under the playlist parsers and feeds the decoder, providing the network half of streaming playback.

::: details Technical details

notifyFrame ty:%d ln:%zu so:%zu ns:%zu f:%u ctx:%u:%u:%llu; getContentKey (encrypted HLS); "New bitrate: %d, Old bitrate: %d" adaptive switch; playlist FSM {"Timed out looking for playlist","Playlist failure with no time to recover (%ld buffer)","fetch empty","Too many empty playlists and no audio left"/"(still %ldms ahead)","Switching source due to empty playlists","end of static list","Unable to select another DS"/"waiting to fetch new playlist"}; "Startup ahead: %ld"; "URIs for %g seconds, wake up in %d"; "prebuffering %u bytes within %ld msec"; open fmt "open: %s (0x%x) %d len %llu offset %llu"; "stopping decoding while sleeping"; RSpotifyAudioInput/spotifyAudioInput ogg-vorbis VLI framer: 'Final track samples received (last page)','Spotify ogg VLI framer duration: %llds','Invalid samples per second (%ld) in vorbis info','fifo size (%zu) too small for prebuffering %d'; quality-ladder bookkeeping 'update last quality to %u %u %d','add new quality','%s first quality'

- **name:** stream playlist fetcher (HLS/radio)
::: details Evidence (1)

- @ 0x10ed38c8; audio_stream region

:::


:::

## `stream_playback`

**coverage** `partial`

The stream playback engine: source selection, playlist fetch scheduling, failover between alternates, and recovery accounting that decides if there's time to recover before the buffer runs dry. This is the engine that keeps a radio stream alive through network hiccups.

::: details Technical details

policy {"Cloud queue policy pause expiry time hit","Queue content expired","clearing queue per policy","Queue policy stop on error","Ignoring playback policy change for context version %s"}; routines {running/End of pauseRoutine,running stopRoutine}; states {DEFER_PLAYING timeout,TRAN_PAUSED,PLAYING_START,suspended}; "Resetting required group caps \[0x%08x\] -> \[0x%08x\]"; "logical track boundary at %u"; frame timing {"notifyFrameInternal: behind %dms","ahead %lldms. Sleeping %lu ms, playtime=%d.%06d, sent at=%d.%06d, now=%d.%06d","tracking E_WOULDBLOCK count","setting origin time to %d.%06d"}; start hints {waiting,fast startup,future,met,no hint,crossfading}; buffer {"buffering underflow after %lld ms, requesting resync \[BH:%lld, FH:%u%%, FA:%lld, FR:%d\]","recovered buffering underflow"}; metrics {timeStart,timeEnd,behindMS,chsrc_behind}; skip reasons {duplicate,restricted,explicit,denylisted,Upcoming Spotify not playable,Spotify filtered for explicit}; "PlayTTL expired, pausing playback"; mime/URI consistency check + getTrackURIAndFramer \[f,u,m,cld\]; oob metadata {cache reset,enabled,disabled}; "Ignoring provided mediaUrl"; session ops {stationMetadata,rejoinSession,leaveSession,trackMetadata,streamUrl}; seek {"Overriding seek with value from SMAPI service: %lds","tvSeek framerResumePos"}; URIs {x-rincon-sonarcal,x-rincon-configmode,file://%s/sonar-tone/%s,file:///opt/buzzers/%s}; "Apple Music: use the derefenced URI to determine the framer, see CP-7253"; "Hit the end of the programmed radio queue"; "reporting enqueued stream URI instead of track URI"

- **name:** stream playback FSM + frame timing
- **error_report:** %s Transport error %s for account type %u, URI: %s, friendly name: %s, share/server: %s, path: %s, ip: %s, host: %s, extra info: %s, http: %d, framer: %s, ahead: %d, rate: %d
- **crossfade:** "Setting up for %d.%06d sec crossfade"/"Not fading" + prev/next track length logs
::: details Evidence (1)

- @ 0x10ea992c; playback block

:::


:::

## `tdm_driver`

**coverage** `partial`

The audio-bus driver interface to the signal-processing hardware: a memory-mapped ring buffer with bus-mode setup and frame handling that restarts on oversized blocks. This is the hardware boundary for the amplified products' output path, and everything above it eventually lands here.

::: details Technical details

{"Restart SPDIF block @ %d frames.","OVERSIZE SPDIF block @ %d frames!"}; device /dev/dsp; {"open failed (err=%d)","ioctl TDM_SETMODE failed (err=%d)","mmap failed (err=%d)","munmap1/munmap2 failed (err=%d)"}

- **name:** TDM/SPDIF DSP driver
::: details Evidence (1)

- @ 0x1102a380; TDM

:::


:::

## `telemetry`

**coverage** `partial`

The telemetry machinery overall: gathering usage and health data about the system, covering what gets measured and how it's packaged for Sonos. It runs on its own collection-and-submission pipeline, distinct from the support-triggered diagnostics upload.

::: details Technical details

PlayerButtons + TelemetryBasePlayer + TelemetryCategoryContext + telemetry tag; fields {event_id,event_name,event_schema_version,household_id,model_type,muse_household_id,serial_number,sonos_id,sw_build_type,sw_full_version,timestamp_utc,audio_type}; "PlayerButtons missing required field %s"; T1.0 vs T2.0 event schema split: 'T2.0 event callback triggered: name: %s, Category: %s, nameSchemaVer: %s' vs 'T1.0 event callback triggered: name %s category %s'; uploader config keys {defaultUploader,optOutExemptUploader,reportIntervalSec,uploader-ref}

- **name:** telemetry: event schema
- **shipped_config:** opt/conf/zpMetricsConfigV2.xml rev=13: 104 categories; only 3 default ON: nowplaying.playReport (optOutExempt uploader), zpAM.maintenance, quarantining; everything else (all muse.* subscribe/unsubscribe/getVolume/duck/getPlaybackStatus, all upnp.* GetMute/GetPositionInfo/SetRoomCalibrationStatus/ReportUnresponsiveDevice/reportPlaySeconds/etc.) is OFF. Usage telemetry is near-silent by default. Comment in file: 'DO NOT CHANGE THIS ORDER, as old (S1) players only load up to a certain point': the category table is POSITIONALLY parsed for S1 compat.
::: details Evidence (1)

- @ 0x10ec7290; telemetry block

:::


:::

## `telemetry_client`

**coverage** `partial`

The telemetry submission client: endpoint selection, batch send, retry, and the event schemas it accepts. It's the sending side of telemetry, delivering collected usage and health data to Sonos's servers.

::: details Technical details

reportKVEvent; "report: %s %s %s %u %u"; "name: %s, schemaver: %s, category: %s"; "Encoding failed/succeeded: %zu bytes"; "Callback is not set to call in %s"/"Callback not set in %s"

- **name:** telemetry_client
::: details Evidence (1)

- @ 0x10fb9c2c; telemetry

:::


:::

## `telemetry_submission`

**coverage** `partial`

The diagnostics and telemetry pipeline: usage events get tagged, packaged, and uploaded to Sonos, alongside the user-facing 'submit diagnostics' flow and a per-player telemetry-level setting. Several telemetry channels are individually feature-flagged. This is the packaging and upload step for gathered data leaving the device.

::: details Technical details

telemetry/diagnostics uplink: 'Telemetry 1.0 Event field' format, X-Sonos-MessageType: product-data-telemetry header, zonereportmgr.cxx zone reports, submitDiagnostics/submitQueuedDiagnostic pipeline with manifest submission, positioning telemetry level route, per-feature telemetry flags; opt-out exemption flag optOutExempt; RCB cache lives at sys/run/rcb

- binary anchors: `reportuploader.cxx`, `trackplayrecorder.cxx`, `zpMetricsConfigV2.xml`, `diagnosticSubmissionResults`, `product-data-telemetry`, `Telemetry 1.0 Event field`, `positioning/telemetryLevel`

- **channels:** X-Sonos-MessageType: product-data-telemetry header; 'Diagnostic manifest submitted.'; 'Unable to report diagnostic submit status of %s to %s'; submitDiagnostics muse op + playerId,diagnostics,submitDiagnostics route
- **format:** 'Telemetry 1.0 Event field %s = %s'; reportTelemetryLocked(%s) t\[%s\] L_id\[%s\] g\[%s\] s\[%s\] field tags; TelemetryBasePlayer + TelemetryCategoryContext classes
- **flags:** featureConfigHomeTheaterWifiPerfTelemetry, homeTheaterWifiPerfTelemetry, enableRadioSocTemperatureTelemetry, enableDhcpProxyFailureTelemetry, circuitBreakerTelemetry, ucsTelemetry, positioningTelemetry
- **control:** v1/players/{playerId}/positioning/telemetryLevel (setTelemetryLevel) + household variant: positioning telemetry is user-controllable
- **uploader:**
  - **files:** /tmp/event_preserve named %010llu_; dual formats legacy + protobuf (PlayerEventHeaderBase); preserveEvents/preserveProtoEvents on shutdown, restoreEvents/restoreProtoEvents on boot
  - **integrity:** records length-prefixed + SHA256-verified: "Length %zu too short","Data length %zu does not match recorded length %d","Error, SHA256 hash check failure"; restore skips empty/malformed
  - **loop:** submit: Success \| Nothing to submit \| 'Failure (%u events, %zu bytes, attempt %u, retrying in %u seconds)'; proto path separate 'Proto Event Upload Success/Failure'; bounded buffer 'adding %zu bytes, %d free' / 'Can't grow space. Losing event %s' / drop counter LostEvents
  - **naming:** event names parsed "%\[^/\]/%\[^/\]" (namespace/name), malformed rejected; fields locid, sys/run/updateID, uptime, report flags 0x%x, UsageMetrics
  - **confidence:** PROVEN persistence format + retry + integrity
- **sdata_category_registry:** .sdata registry @0x11095d88: three fn-table ptrs (0x10fce6d8/0x10fce65c/0x10fce638 - callback blocks in the eSDK code region) followed by {name_ptr, u32=4} pairs naming channels {api, zc, download, audio, esdk}. 'esdk' is referenced by 10 fns in the eSDK region (0x10cf8-0x10d4c); 'api'->f_10331f34; 'download'->f_105a7e78/f_1068baa4; 'audio'->f_107d5b0c. Consistent with the libsonoseventreporter init_event_ctx/report_event channel registry; priority/weight word constant 4.
::: details Evidence (7)

- @ 0x10eeb50d; reportuploader.cxx
- @ 0x10ed877a; trackplayrecorder.cxx
- @ 0x10e7530b; zpMetricsConfigV2.xml
- @ 0x10f962bc; diagnosticSubmissionResults
- @ 0x10f03bcb; X-Sonos-MessageType: product-data-telemetry header
- @ 0x10ea13ec; Telemetry 1.0 Event field format
- @ 0x10e81dc0; positioning/telemetryLevel muse route

:::


:::

## `testenv_environment`

**coverage** `partial`

A hidden /testenv page lets a tester point the whole player at a different Sonos cloud environment (production, perf, staging, test or int) and override the update URL. It lists the six backend APIs the player will use, and the change spreads to every player in the household within about two minutes. Engineering test-environment hooks (lab/test-mode paths) that ship dormant in production builds.

::: details Technical details

POST /testenv switches the player's cloud environment between PROD, PERF, STAGE, TEST and INT, with an optional OnlineUpdateBaseURL override; the page displays the six resolved API bases (Cloud, Service catalog, System, Transfero, Metrics, Update) and CustomerId; the change replicates household-wide ('may take up to 120 seconds ... to replicate throughout household') and logs 'Setting cloud env to %s'

- binary anchors: `/testenv`, `Setting cloud env to %s`, `OnlineUpdateBaseURL`, `CustomerId`, `perf`, `PROD`, `STAGE`, `TEST`, `INT`

- **form:** GET renders a form: env selector (prod/perf/stage/test/int), url text input (OnlineUpdateBaseURL override), submit/reset buttons; POST returns a 1-second meta-refresh 'Success' page
- **api_bases:** Cloud API, Service catalog API, System API, Transfero API, Metrics API, Update API: six resolved service bases per environment
- **propagation:** change is written through the replicated-settings layer: 120s household-wide convergence warning on the form
::: details Evidence (2)

- @ 0x10f1756c; full /testenv form: env select + URL override + 6-API table
- @ 0x10f174e8; 'Setting cloud env to %s' log

:::


:::

## `thermal`

**coverage** `partial`

The thermal management: temperature sensors feeding throttle and shutdown decisions, plus the events and shutdown reasons that fire when the unit overheats. It explains 'the speaker shut itself off' on hot days, and it protects the hardware when it runs hot.

::: details Technical details

syslib thermal {open,get_temp,close} + "cpu:%d, amp:%d, soc:%d" + temperature_volume + ampstate + hardware fields; "Hardware %s; clamping volume to %d%%"; state transitions {Entering/Leaving hardware warning state,Entering/Leaving hardware fault state} + hw:st + "Warning/Fault Code(s):%s" + fullSync; satsw "Error %d from uploadSatSwitchTimeReport" + satSwitch; lmrep "Error %d from WifiFuncsGetLmChangeStats" + {lmChannel,lmNeighbor,roamEvent,beaconLostEvent}

- **name:** thermal monitor + HW fault state
- **status_schemas:**
  - **led:** <LedPatternInfo><LedPatternEntry time led_ids="%08x" repeats steps><LedStepEntry rgb="%06X" hold fade/></LedPatternEntry></LedPatternInfo>
  - **libs:** <ThirdPartyLibraryInfo><Library Name="Spotify eSDK"><Version/></Library></ThirdPartyLibraryInfo>
  - **roomcal:** <RoomCalibrationInfo><RoomCalibrationActiveState>Inactive\|…</><RoomCalibrationUserIntent/><RoomCalibrationAvailCalID/><RoomCalibrationOrientation/></RoomCalibrationInfo>
  - **faults:** <Faults Name="WarningsAndFaults"><FaultState><WarningState><LastBitmask><LastBitmask2></Faults>
::: details Evidence (1)

- @ 0x10e98e30; thermal/status blocks

:::


:::

## `timed_jobs`

**coverage** `partial`

The timed-job registry: the named scheduled tasks like healthcheck, certificate refresh, token refresh, and history sync, each with its interval and last-run bookkeeping. It's the cron-like layer inside the program.

::: details Technical details

jobs {netsettingsBumpVersion,checkSonosNetDisableTestTimedJob,netsettingsRotateKeys,CheckForMissedPlayers,JITCloudFetch,RefreshSonosRadio,AddRemoveSonosBusinessMSP,fetchCertBundle,resetBTRecoverState,pollWirelessNetworkStatus,backupLogFiles,refreshSSLClientCache,reportSSLClientCacheStats,saveSSLClientCache,userInitiatedHHUpdate}; workers {asyncWorkerModZp,asyncMuseModZp}; setup {"Setting up ZonePlayer","ZonePlayer setup complete","Setting up MediaPlayer for port %u","Setup for MediaPlayer on port %u complete","no %s found in %s"}; jobs {High Res Usage Metrics/HRUsageMetrics,Account Maintenance/SvcAccountMaint}; scheduler internals (timedjob.cxx, domain timedjobmanager): 'scheduleJobLater: job: "%s" m_tmNext: %ld(%c) is in %ld seconds','%s svc:%s td:%ld','job %p:%p removed (add cancelled)','job %p:%p remove queued \[%d\]','job %p:%p done waiting','job %p:%p removed (done waiting)','job %p:%p not found'; slow-run watchdog: '%s completed job "%s"','%s job "%s" took %lds. %zu consecutive.','%s job "%s" ran normally after %zu consecutive slow runs'; error domain ERROR_SONOSAPI_%d; timedjobmgr_btn job + hwmessagelib_connection_init for button events

- **name:** timed-job registry + setup
- **sqlite_schema:** TimersStorage ('timerstorage' domain) prepared-statement set TimerStmt::*: timers table CREATE TABLE IF NOT EXISTS timers (id TEXT PRIMARY KEY, trigger_time TEXT NOT NULL, total_duration NUMERIC NOT NULL, triggered NUMERIC NOT NULL) + paused_timers (id TEXT PK, remaining_seconds INTEGER NOT NULL, paused_utc_time TEXT NOT NULL, total_duration ...); PRAGMA user_version gates compat ('Future db version detected %d vs %d - ignoring'). Stmts: SET_TIMER REPLACE INTO timers (id,trigger_time,total_duration,triggered) VALUES (?1,?2,?3,0); DEL_TIMER by id; DEL_TIMER_OLD DELETE WHERE trigger_time < strftime('%Y-%m-%dT%H:%M:%S', ?1) (trigger_time is ISO-8601); GET_TIMER_FROM_ID/ITR_TIMER SELECT id,trigger_time,total_duration,triggered,rowid; SZ_TIMER count(*); UPD_TIMER UPDATE SET triggered=(CASE WHEN triggered=0 THEN ?2 ELSE triggered END). Write-once annotate ('annotate timer UNKNOWN id %s %u \[%d\]'). Paused mirror: SET_TIMER_PAUSED REPLACE INTO paused_timers(id,remaining_seconds,paused_utc_time,total_duration); DEL/GET/ITR/SZ_TIMER_PAUSED. Ops: 'set timer %s \[%s\]', 'delete timer by age %s', bind {trigger,remaining_seconds,paused_utc_time,totalDuration}. Size limits: 'timer db ready \[%zu\] WARNING db is large'/'ERROR db exceeded limit'/'sql failures prevent timer db usage'; busy-timeout set; DataSource=:memory: test path; per-op 'prepare TimerStmt::* statement failure' errors.
- **suspend_aware:** suspend-aware timer ops: 'set local timer; time %s','set duration timer; time %s','create/delete/pause/resume local timer; time %s' + '(considering suspend)' failure variants: timer layer suspends/resumes with power state
- **registry_table:** complete job table at 0x11090040: {display_name*, short_name*, handler_fn} triples: Account Maintenance/SvcAccountMaint@0x105e7978, CheckOnlineUpdates@0x100b9338, Collect Dropout Triggered XML/CollectDropoutTriggeredXml@0x105eb628, Upload Events/UploadEvents@0x100b937c, Collect Button Triggered XML/CollectButtonTriggeredXml@0x106455e4, Refresh registration cert/RefreshRegCert@0x105e8110, Fetch cloud config/FetchCloudCfg@0x100ba320, Music account replication push/MAReplPush@0x100ba5dc, Music account replication pull/MAReplPull@0x100bb4ec, Download metrics config/DLMetricsCfg@0x105e7ec0, Remove Expired Vanished ZonePlayers/RemoveExpZPs@0x105eb720, Send PlayerConfig report/UploadCfgReport@0x105eb7b8, Send optOutExempt events/UploadOptOutExemptEvents@0x100b944c, Refresh Entitlements/RefreshEntitlements@0x100b94e0, Sync JIT services to cloud/JITCloudFetch@0x100b950c, Refresh Sonos Radio/RefreshSonosRadio@0x100b952c, Sync Sonos Business MSP/AddRemoveSfbMSP@0x105eb708, Upload Protobuf Events/UploadProtoEvents@0x10254ee0, Upload Crash Dump/UploadCrashDump@0x100b9948, Refresh SSL Client Cache/RefreshSSLCache@0x100b946c, Save SSL Client Cache to JFFS/SaveSSLCache (terminator, NULL handler)
::: details Evidence (1)

- @ 0x10e74914; job registry

:::


:::

## `tj_wakeup`

**coverage** `partial`

The timed-job wakeup machinery: the scheduler half that fires jobs on time, including across suspend, which is the 'wake the device to run a job' path that interacts with semi-sleep.

::: details Technical details

async wakeMissingPlayers {task,timer,request,retry TJ,cancel,failure} + "Unexpected WakeOnLANRequestEvent type": WakeOnLAN; "Restoring AVT and track queue"/"Backing up track queue"/"Backing up AVT"; "Chirp setup failed - chirp sender does not exist"; "Setup volume not yet calibrated"; "Unable to play chirp"; refreshMdnsRegistration; /players/ api 1.1.0; settings {R_VolNormMode,R_CrossfadeDuration,R_AirplayIncludeLinked}; manual node engine ctor node version; spotmdns thread

- **name:** TJ: wake-missing-players + backup
::: details Evidence (1)

- @ 0x10ecb048; tj block

:::


:::

## `token_refresh`

**coverage** `partial`

The credential-refresh state machine: dedicated threads watch token expiry, request refresh through the cloud, wait for completion, and stash the results. When service calls start failing with auth errors while a token looks valid, this is the machinery that was supposed to have refreshed it.

::: details Technical details

threads {cqatrs_tx,cloudqueue_tr}; log "\[%s HTTP %d from %s%s\] %s"; states {"using token from file","requesting new token refresh sync","requesting token refresh sync %u %d -> %d","need to wait for token refresh","waiting for token refresh completion","waiting for refresh tx complete; current state %d","Attempting to refresh token (hrs=%d te=%d)","transition token refresh action %u %d -> %d","Token refresh succeeded. Beginning retry."}; errors {"last refresh token for load timed out","no last refresh token time","expected entry not found to complete tx","expected entry not found waiting for tx","Refresh token failed with upnp result: %d","Refresh token failed. Could not find SD, sid=%u","unexpected token action %d"}; keyed by acct. sn. %u

- **name:** OAuth token-refresh FSM
::: details Evidence (1)

- @ 0x10ec236c; tokenrefresh block

:::


:::

## `track_play_monitor`

**coverage** `partial`

The track-play monitor and recorder: it records what actually played for history and scrobbling, detects interrupted versus natural finishes, and emits the play events the history manager ships. The 'recently played' list is this recorder's output.

::: details Technical details

per-track log entries {Track Or Station URI,Extra Md,Context URI,CQ Auth Token,SMAPI Device Id,CloudQueueVersion,CQ Context Version,CQ Playback Id,API Key,Framer Name}; play line "%s play time %fs @%d.%06d (pkt:%u,act:0x%x,off:%lld%s,err:%u,uri:%s)"; segments "seg start @ %d.%06d (packetId: %u), end ..."; PlaybackId remap; string-pool bounded (pool %d%% full, "Resetting due to no free RTrackLogEntries"); states In progress/Final/LSE; selthrd.RTrackPlayMonitor thread

- **name:** RTrackPlayMonitor/trackPlayRecorder: play-segment recording
- **events:** R_STREAM_OP_{SAMPLE(publish segment),OPEN(offset),CLOSE(packetId),INTERRUPT(act,offset),ACK(act,packetId),ERROR,IMMED_RESYNC,SCHED_RESYNC,BOUNDARY,ORIGIN_TIME_SELECTED,QUALITY_SELECTED(bd,sr,c,br,nc,a,fmt)} + R_PLAY_OP_{SAMPLE,BOUNDARY,RESYNC(immed\|sched),ERROR,CHANGE_SRC,CODEC_SELECTED,ORIGIN_TIME_SELECTED}; sources {REMOTE,CHSRC,Virtual Line-In}; errors {NO_ERROR,CLOUD_QUEUE_ERROR}
- **recorder:** segment containers: streams/playback/canceled per lifecycle {(init),(finalize),(RESYNC),(RESYNCED),(RESYNCING),(SCHED RESYNC)}; full-container overwrite; zero-sample cancel; memory-pressure relief falls back to canceled; "Overwriting stream error"
::: details Evidence (1)

- @ 0x10ed8350; trackplaymonitor/recorder region

:::


:::

## `trueplay`

**coverage** `partial`

The Trueplay and sonar tuning feature: room calibration as a whole, which is measuring the room's acoustics and adjusting the speaker's sound to fit. It's the tuning system the app walks you through, documented here as the internal machinery it corresponds to.

::: details Technical details

config modes {button-notify,room_calibration-calibrate,speaker-detect,trueroom} + "configMode CountDown:%d"; eTag manifest /etags.txt matched against tone files {leader.ogg,testtone.ogg,complete_ht.ogg,inverter_*} at path %s/%s/%s/%s-%s under tones; fetch via players/%s/settings/player muse settings + forward; "eTag is matching a known file"; types {plug-in spectral,polarity}; params {tone_duration,force,v:%s t:%s}; "Sonar cal volume - using clipped volume %d instead of requested %d"; TP update "found TP version ... do update to v%s"; teardown {"Clearing Trueroom tone folder on JFFS","Error removing Trueplay asset dir"}; restore paths {common RC,original RC,TV Surround Level,enable sonar,set AVT,reset AVT,re-enable Trueplay}; "Trueroom config mode - Not restoring/restoring the AVT"; fields {HTBondedZoneCommitState,AvailableRoomCalibration,RoomCalibrationState,Orientation,LastChangedPlayState,AlexaCBLSupported,SupportsAudioIn,SupportsAudioClip,HtBondedZoneCommitUpdateEvt}; cm_button "pressed %s"; compatibility probing: 'Parsed HTA Frame version: %u','Found compatible HTA Frame version %u','Parsed Trueplay SDK version: %s','Found compatible Trueplay SDK version %s','Parsed Control API version: %s','Connect to %s result: %x'

- **name:** trueplay_dp: sonar calibration engine
::: details Evidence (1)

- @ 0x10ebd630; trueplay_dp block

:::


:::

## `trueplay_api`

**coverage** `partial`

The Trueplay API factory + node layer: `trueplay_api.cpp` provides the SDK entry points, node messages carry protobuf-encoded actions/statuses with version negotiation, and TrueplayAPIFactory instantiates the right implementation per product. The interface other components and clients use to drive a calibration session.

::: details Technical details

SDK 6.2.0.1-main.Unspecified.2db5546c; factory TrueplayAPIFactory + initNode/initNodeMajorVersion; version negot {"Build version for TP API is %s","Updating Trueplay SDK version to %s","Trueplay SDK version %s not supported, creating previous version","Requested version %s is already in use ... no-op","SDK full version","Node data schema version"}; node methods {setup,setupMeasurement,startMeasurement,computeData,handleMsg}; minimal-node build {"channel types not available for a minimal node build","local channel types not available","Number of mics and number of DSP channels must both be 0 when one is 0","not compatible with having microphones"}; TPNodeSetupInfo; file errors

- **name:** trueplay_api: TPNode SDK wrapper
- **factory:** TrueplayAPIFactory {initNode,initNodeMajorVersion,"TPNode instance is nullptr after move in APIFactory"}; file IO {"<File name='","error opening file %s (errno=%d %s)","error reading file"}
- **sdk:** SDK 6.2.0.1-main.Unspecified.2db5546c; "SDK full version: %s"; "Node data schema version: %s"; "nMics = %u & nDSPChannels = %u"; "Running a minimal node build"; "Code was compiled for minimal node support which is not compatible with having microphones"; "Node microphone data is %s"; "Trueplay data handler is a nullptr"; "Trueplay data handler reports that data collection %s allowed."; "Node isn't setup when starting a measurement/computing data"; "Starting the measurement"
- **node_fsm:** actions TP_NODE_ACTION_{NONE,SETUP,START_MEASUREMENT,SEND_BACK_DATA,COLLECT_DATA,SEND_STATUS}; status TP_NODE_STATUS_{IDLE,SETUP,MEASURING,MEASUREMENT_DONE,DATA_COMPUTED,ERROR,EXCEPTION}
- **codec:** protobuf bridge {tpNodeActionToPBNodeAction,pbNodeActionToTPNodeAction,tpNodeStatusToPBNodeStatus,pbNodeStatusToTPNodeStatus,pbChannelTypeToTPChannelType,encodeNodeRequest,decodeNodeRequest,encodeNodeResponse,decodeNodeResponse}; "Received node message"; "Node message is: %s"; "Node response is: %s"; "Error decoding node message"; TPThrowException/"TPException in " + " - l."; "A critical error equivalent to an exception occurred and anything happening after is undefined behaviour: %s"; "<%s - %s:l%d> "; Unhandled {trueplay channel type,node action,protobuf node action,trueplay node status,protobuf channel type} + "Protobuf encoding/decoding of node request/response failed." + "Either nRows or nCols is 0 but the other isn't."
::: details Evidence (1)

- @ 0x10fbd900; trueplay_api block

:::


:::

## `ttm_helper_detail`

**coverage** `partial`

The time-to-music measurement endpoint detail: an engineering endpoint that times how long a play command takes end to end. It's a performance probe for the play path.

::: details Technical details

f_100b9740: gate f_105489e4 → dumps runtime text blob (0x11095f88 table, f_100d567c copy) as text/plain

- **name:** ttm_helper_detail
::: details Evidence (1)

- firmware; handler disas

:::


:::

## `unlock`

**coverage** `partial`

The engineering unlock endpoint: a challenge-and-response state toggle with auth checks and a rate limit. When unlocked, additional diagnostic surfaces open up, and production devices keep it closed.

::: details Technical details

flags {/tmp/device_unlocked_flag,/tmp/htdocs_locked,/opt/htdocs_locked}; flow {Fuse Value:,Challenge:} + form "Serial: %s / %s %s / POST {confirm textarea 11x80}"; responses {"DevUnlock Rebooting...",Success,Too Many Unlocks,Not Applicable}; muse op deviceUnlock; rate-limit "Too Many Unlocks"

- **name:** /devunlock + /mfgunlock + deviceUnlock
::: details Evidence (1)

- @ 0x10efff88; unlock block

:::


:::

## `update_coordinator`

**coverage** `partial`

The update coordinator: it schedules firmware downloads, enforces battery and version gates, drives the update-available event, and coordinates the household-wide rollout. 'Update available but never installs' is usually a gate failing here.

::: details Technical details

beginUpdate/beginUpdate called./Update already started.; updateHookJob + upgradeinfo + /var/run; "Current Swgen Min downgrade version %s"; "error updating %s"; "Failed to query cloud settings"; update_coordinator actor; cert.xml+metadata.txt loads "loading %s (0x%x) took %ums"

- **name:** update coordinator
::: details Evidence (1)

- @ 0x10f0526c; update coordinator region

:::


:::

## `update_machinery`

**coverage** `partial`

Firmware updates are manifest-driven: a cloud manifest lists per-model target versions and a minimum auto-update version, and household updates run a check-download-launch sequence across members with the coordinator orchestrating. Below the manifest's auto-update floor a device needs a manual update. Clients see this through the documented update commands and the modern-API update routes.

::: details Technical details

manifest-driven update pipeline: update_manifest carries a base update URL + per-device target rows (udn, model, submodel, swgen, ver, URI, updateID) and a min auto-update version; user updates run manifest-download -> checkDevicesToUpdate -> launchUpdate; auto-update policy gated by R_AutoUpdatePolicy + R_CheckUpdateInterval + R_AutoUpdateWindowStart + autoUpdatesEnabled; timezone table lifecycle: 'no timezone data available (%d)','Unable to open (or copy) timezones file','Timezone url: %s','Downloaded new time zone table; version %u','Download of new time zone table failed: %d'; tone-dir ops 'downloadDir: %s','%s exists: %s','%s removed ok: %s','Failed to delete tone download folder %s','%s created ok: %s','Failed to create tone download folder %s'; update confirm form '<html><head></head><body>Serial: %s<br />%s %s<br /><form action="%s" method="POST"><label for="confirm">Cod...' (POST confirm code page), 'next check for update in %us'; async_file_downloader domain: 'Failed to open file: %s','Failed to write file: %s','Unexpected response (%d) when downloading file (%s).','Cancelled download attempt of file (%s) from url (%s).','Download attempt of file (%s) failed from url (%s).'; cert manifest fields 'MinVersion: \[%s\]','PrevSWGenMinVersion: \[%s\]'; build string '86.10-80260-dev-secbuild-20260826'; min swgen bounds '58.0-00000'/'85.0-00000'; version formatters %u.%u.%u.%u-%u.%u, %hhu.%hhu-%u, %u.%u-%05u, <version>%s</version>/<version>%u</version>; 'CONNECT_ONLY is required','Failed to get recent socket'; manifest parser keys {sys_flags,auto_fromver_min,base_url,default_version,description_url,update_list,supported_models,submodel_min,submodel_max,fromver_min,fromver_max,milestone_index,model_list} + logs 'manifest: Setting system version=%s','manifest: System flags=0x%x','manifest: Setting descr=%s','manifest: Setting base version=%s','manifest\[%zu\]: Adding %d.\[%d,%d\] \[%s,%s\] 0x%x %s %s %u' + errors 'too many manifest entries!','Hardware manifest lists not in descending order.','Attempt to set swgen to an invalid value: %u','Input string too long. Returning VALUE_INVALID'; subscribeToUpdatesRequestHandler; UpdateItem emit attrs incl QuarantineReason/UUID/ZoneName/Icon/Configuration; NoReport

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
- **check_report:** Update-check report record: {LocalSerial, User-Agent, HouseholdID, SystemVersion, UpdateID, Timestamp, AutoUpdate, StatusServer, NumUpdateZPs, ReportFilename} + per-ZP row 'ZP: \[%s %s %s %s %s 0x%x %s %s\]'. Launch path: 'Check for online update (background)', 'launching scheduled update on %s', 'BeginSoftwareUpdate failure for local device (UPnP result: %u)', 'Failed to spawn auto upgr process', 'manifest URL: %s', 'manifest connect error 0x%x (%u)'/'download complete'/'download error', 'failed to create info file'.
- **preinstall_script:** the .upd 'preinstall.sh' section (byte-identical m8-86.8 vs m9-86.10 (frozen across both axes): modes {umountnone: REGION fixup) mdputil\|keyval ^REGION, if 5 -> 'mdputil -fwe 2'; postinst: upgrade.log juggling: /jffs/upgrade.log -> upgrade_prev.log, /tmp/upgrade.log -> /jffs, 'Manual upgrade. No log to copy.', touch upgrade_sys_report.log, double sync}; default path: warn-only if /jffs >=98% full ('WARNING: /jffs usage near or at capacity. Upgrade might fail'), require anacapad stopped (else exit 1), then kill udhcpc/inetd/netstartd via kill_attempt() + touch /var/run/stopnetstartd + touch /var/run/upgradeflag (upgrade-in-progress sentinel under /dev/mtd presence check).
- **sibling_binaries:** /bin/upgrade (the low-level upgrader): /dev/chk checksum-device verification; runs "/bin/sh %s postinst" on the package; preserves across upgrade: /jffs/netsettings.txt, /jffs/persist/deactivated_state(.json), settings/musicservices.xml, settings/savedqueues.rsq, /jffs/shadow/{abstract,strings,trackinfo} (play-history store!), /jffs/sys/run/rcb/*.rcb + upd_cert_bundle.rcb (cert-bundle update delivery path), watchdog logs, app/install, debug/devmode.bin; writes /var/run/upgrade_report.txt; /var/upgradescript hook; download via /usr/bin/wget; -e option multi-use; ends /sbin/reboot. /bin/upgrade_mgr (orchestrator): emits JSON status {Serial,CurrentVersion,HardwareVersion,State,TargetVersion,UpdateID,ServerIP,Result,ExtendedError,ErrorMsg,DownloadDuration,Type,Duration,NumUpdateZPs,SystemResult,SystemVersion,Timestamp,Version}; progress CBs "<url> COMPLETE?phase=%s", "ERROR?phase=%s;error-code=%d", "STATUS?phase=%s;percent-complete=%d"; update-check URL query ?Version=%s.%s-%s&Auto=%s&Client=%s; pid /tmp/upgrade_mgr.pid; guards bad hw version/bad version. /sbin/frcheck: reads /dev/audioctl + hal_inputs_get_buttons_state (button-combo check) AND /jffs/app/run/factoryReset.txt sentinel (factory reset is triggered by EITHER held-buttons-at-boot OR the sentinel file. /usr/sbin/keyval: KV reader "keyval \[-l<len>\] \[-d<chr>\] \[-s\] <key> \[file\]") the ^KEY convention used by every script. /bin/mdputil: manufacturing-data util: manifest show/clear, GETFSN serial fetch per deviceID, -B init, -fwe write (used by upgrade umountnone region fix).
- **upd_sections:** .upd container section map (from decrypted receipt 86.10-80260-1-9): section_type 3=preinstall.sh (postinst hooks), 6=kernel uImage, 4=rootfs.squashfs, 13=device-payload NCD image: all encrypted to recipient 12e82a182af27801eba0ff3c94e8e649ed962dbb. Kernel = Linux-2.6.35-yocto-standard (uImage magic 27051956, gzip vmlinux).
::: details Evidence (6)

- @ 0x10eae506; auto_update_scheduler.cxx
- @ 0x10fafc18; migrationmanager.cxx
- @ 0x10e82b39; /softwareDownload
- @ 0x10eeea5c; manifest: Setting base update url=%s
- @ 0x10f076a4; per-device manifest row fields
- @ 0x10e838ac; v1/players/{playerId}/update/check muse route

:::


:::

## `upnputil`

**coverage** `partial`

Shared control-protocol utilities: parsing host:port out of server addresses with strict validation, and mapping internal statuses to wire-level result codes. Small plumbing used across the classic command surface.

::: details Technical details

RparseServerLocationAndPort {"Unable to extract host, allocation too small","Port specified is too long","invalid port. Max value is 65535","unrecognized scheme in URL"}; RmapStatusToUPNPRESULT {UPNP_RESULT_CANT_CONNECT,UPNP_RESULT_GENERAL_FAILURE} + original error 0x%08x; UDN "uuid:%s::urn:schemas-upnp-org:device:ZonePlayer:1"; loopbackSecurityTokenMutex; time fmts {%04hu-%02hu-%02huT%02hu:%02hu:%02hu,%04hx%02hx%02hx%02hx%02hx%04hx%02hx%02hx%02hx%02hx%04hx,%02hu:%02hu:%02hu,%+02d:%02d}; statuses {UNPLAYABLE,MEMBER,NO-CONTENT,LAN-SWAPPABLE}; invalid chars ",\\<>;?*|+=\[\]:\""; URL escape sets {$-_.+!*'(),/,$-_.!*'(),,-_.!*()}; audio fmt "bd:%u,sr:%u,c:%u,l:%u,d:%u"; "parser ctx allocation failed"

- **name:** UPnP utility layer
::: details Evidence (1)

- @ 0x10fb135c; upnputil

:::


:::

## `usage_metrics`

**coverage** `partial`

The usage-metrics schema: the counters and records the device reports for feature usage, submitted under the same permission gates as diagnostics. These are the statistics feeding Sonos's telemetry.

::: details Technical details

<UsageMetrics><ver>2</ver> + <ucs>/<uc> records {ms_cdctrluri,ms_regctrluri,ms_croot,ms_fn} posted to submit.aspx under /HRMetrics/; cfg fetches {pollInterval.htm,wifiTxRateThreshold.htm,wifiLatencyThreshold.htm}?hhid=%s; wifi counters {ath%u,rxPrr,beacon_flags,datarx,secdrp,roaming,trf2g,trf5g,trg2g,trg5g,tbtm2g,tbtm5g,rfail,q*_nbf,q*_cmp,q*_bpk,q*_ltc,hwstat,rxbhs,rxhang,rxfMax,rxcMax,txfMax,bprowar,gtkfm,gtkfc,nogcfc,links}; per-AP "MAC/rssiF/rssiT/PktMin/PER" + "BSSID/perAP/rssiAP"; "Audio-drop ... include with future periodic submission" + rate-limit; WD daily write; CPUTempHist <temperatures>; unlocked/hw_warn/hw_fault flags; usageDataSharing optin

- **name:** usagemetrics: periodic health report
::: details Evidence (1)

- @ 0x10f0c724; usagemetrics block

:::


:::

## `user_update`

**coverage** `partial`

The user-initiated update flow: the 'check for updates' path versus the coordinator's scheduled path, sharing the same manifest and download machinery with a different trigger. It's the path for updates you explicitly start.

::: details Technical details

flow {"Running user-initiated HH update",no updates available,manifest download failed,no devices need updating,checkDevicesToUpdate failed,launchUpdate failed}; reports upgrade_mgr_user_report.json + _prev.json + /tmp/upgrade_mgr_info.txt; "report has more devices than the maximum ... omitted from the householdUpdateStatus event"; "Unknown upgrade client state"; "report consumed"/"Timed out polling"; app/run; failure taxonomy 'User-initiated HH update: {no updates available, manifest download failed, no devices need updating, checkDevicesToUpdate failed, launchUpdate failed}'; report artifact upgrade_mgr_user_report_prev.json

- **name:** UserUpdateScheduler: user-initiated HH update
::: details Evidence (1)

- @ 0x10e95664; user_update block

:::


:::

## `vli_ctrl`

**coverage** `partial`

The virtual-line-in control interface: the event grammar, the format whitelist, the metadata extractor for pushed items, and the address-to-service routing. It's the control plane for external sources feeding the player.

::: details Technical details

types {AirPlay,bluetooth/Bluetooth,tvproxy/TV Proxy} + "StartSession for unusable/unknown type"; scoped scopeVliCtrl/VliCtrlIx; protocolInfo x-sonos-vli:*:audio:*; cookie+fromSender tracking "%s:%d vliType %s cookie: %d"; "waiting for tx flags failed"/"completion signal timed out %#x %#x" + "timed out!!!!!!!"; "VLIGroupIDs cannot contain commas"

- **name:** VliCtrl: VLI transport ctrl interface
- **events:** `VliTransportAction(action)`, `AvtHaltActionEvent(action,vliType,cookie,fromSender)`, `AvtVliActionEvent`, `VolumeSetActionEvent(vol,mute,from_sonos,vligrouping)`, `GroupVolumeSetActionEvent(vol,mute,from_sonos,vligrouping)`, `VolumeChangedEvent(vli source,vol,mute,vligrouping)`, `VliPropertiesChangedEvent(name\|md\|mode,cookie)`
::: details Evidence (1)

- @ 0x10ecc104; VliCtrl block

:::


:::

## `voice_skill`

**coverage** `partial`

The voice-assistant integration bits: the skill and voice-account vocabulary, the clip types for spoken responses, and the voice-related feature flags. It covers the parts of voice-assistant presence that live inside this program on products that support them.

::: details Technical details

{hasToken,skillStage,skillAuthCodeUS,skillAuthCodeEU,skillAuthCodeFE,skillRedirectUrl,authCode,redirectUrl,timeoutSeconds}

- **name:** voice-skill onboarding fields
::: details Evidence (1)

- @ 0x10fae1d8; voice skill

:::


:::

## `wac_mode`

**coverage** `partial`

The wireless-accessory-configuration setup mode: the Apple-style onboarding flow where the player broadcasts a temporary setup network so a new device can receive its first network credentials. This is the first-boot and add-a-player path, driven by a dedicated daemon and a timeout.

::: details Technical details

WiFi Accessory Config (WAC) setup mode: state lives in /var/run/wac_mode (parsed int, 'Unknown WAC mode %d') with enabled/disabled/timeout transitions; driven by netstartd via /tmp/netstartd.ipc ('WAC mode enabled/disabled/timeout', 'In setup mode', 'Netstart SSID set/clear'); LED goes to R_LED_WAC mode | netstartd IPC drives WAC: dispatcher f_10691034 msg ids 35/36=WAC disabled/enabled, 37/39/41=WAC timeout cluster; ids 42/46/47=setup-mode enter/setup start/stop.

- binary anchors: `wacd.log`, `WAC mode enabled`, `/var/run/wac_mode`, `/var/run/netstart_mode`, `R_LED_WAC`, `recovery AP connection`, `ForceShutdownOnNewSSID`

- **netstart_ipc:** netstartd events consumed: 'netstartd hello', 'Setup start/stop', 'Netstart is idle/alive/open', 'In setup mode', ' Netstart SSID set/clear', 'Netstart triggered upgrade (0x%x)', 'Got connection type update from netstartd: \[%s\]', recovery AP connection: %02X*6: a recovery-AP fallback exists
- **conn_types:** connection-type vocabulary reported by netstartd: 'SonosNet (Ethernet)', 'SonosNet (wireless)', 'Home Theater 2.0', 'Home Theater (Ethernet)', 'Home Theater', 'WiFi', 'Ethernet (WiFi Disabled)', 'Ethernet'
::: details Evidence (7)

- @ 0x10e7573d; wacd.log
- @ 0x10f02dc8; WAC mode enabled
- @ 0x10f027b4; /var/run/wac_mode state file
- @ 0x10fbb0fc; R_LED_WAC / R_LED_WAC_TIMEOUT LED modes
- @ 0x10f027b4; /var/run/wac_mode mode file + 'Unknown WAC mode %d'
- @ 0x10f02db4; WAC enabled/disabled/timeout event strings
- @ 0x10f02ee8; recovery AP connection MAC print: recovery AP fallback

:::


:::

## `watchdog`

**coverage** `partial`

The watchdog subsystem: a hardware watchdog device plus capture files, a health-check thread on a configurable frequency, a client-registration interface, and a forced reboot on unresponsiveness. It's the dead-man's switch that restarts the device if the software stops checking in, the safety net against hangs.

::: details Technical details

device /dev/chk; files {/watchdog.log,/watchdog.dmesg,timeinfo}; {"Watchdog not started","Watchdog already created","Creating watchdog","No watchdog to destroy","Destroying watchdog","Invalid watchdog health check frequency","Watchdog constructed with %u seconds frequency","trigger called with status %d"}; "WATCHDOG: %s manual trigger (UTC %s)"/"unresponsive! (UTC %s)"; /sbin/reboot + return code; /watchdogcrash; "Performing health check"/"Waiting for next health check"; watchdog.poll; "In watchdog thread, performing health check"/"Exiting watchdog thread"; forceTrigger; client API {"client %s not found","Unregistered watchdog client %s","client must have a name","health check callback must be non-null","client %s already registered","Registered watchdog client %s"}; MTD /dev/mtd/0

- **name:** watchdog driver interface
::: details Evidence (1)

- @ 0x10fe4fe4; watchdog

:::


:::

## `wmp_provider`

**coverage** `partial`

The Windows Media Player content provider: browse and search over shared Windows libraries, with its own capability flags and search grammar. A leftover integration for libraries served by Windows Media Player's sharing feature.

::: details Technical details

WMP NSS /WMPNSSv browse/search; caps {SCPA,SCPB,SCPI}; search grammar 'upnp:class derivedfrom "object.item.audioItem" and @refID exists false' + container class specs {person.musicArtist,album.musicAlbum,genre.musicGenre,playlistContainer}; sort/filter "+upnp:album,+upnp:originalTrackNumber,+dc:title" + microsoft:{artistAlbumArtist,artistPerformer,authorComposer} + upnp:genre + "1+upnp:originalTrackNumber"; field set dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber; rincon md ns urn:schemas-rinconnetworks-com:metadata-1-0/|otherArtist; albumArt via %s?albumArt=true and /getaa?m=1&u=%s; "URI already has a serial number"/"not enough room for account ID"

- **name:** sonos_cprovider: WMP content provider
::: details Evidence (1)

- @ 0x10f0dbf8; cprovider block

:::


:::

## `ws_client`

**coverage** `partial`

The outbound websocket client used for the cloud channel: it performs the upgrade handshake, negotiates compression, retries session opens, generates nonces, and reports disconnect reasons and close codes. It's the machinery for when the player itself connects out to a websocket service.

::: details Technical details

client handshake {Location,Upgrade: websocket,Connection: Upgrade,Sec-WebSocket-Accept,Sec-WebSocket-Extensions}; "failing connection due to unsolicited per msg deflate"; per-msg deflate only before open; openSession retry; nonce gen/encode; {"disconnectedReason":"%s"}; close codes on close frame; LoadBalancerHost/WebsocketServerHost; reasons {NEW_IP,BLUETOOTH,POWERED_OFF,UPGRADE,NEW_SSID,SLEEPING,RECONNECT}; threads wsc_mtx/wsc_smtx/wsc_cond

- **name:** websocketclient: outbound WS (lechmere/cloud)
- **status_schema:** <State>Open\|Closed</State><MillisecondsOpen\|Closed><PerMsgDeflate><TotalUncompressedKBytesSent><TotalCompressedKBytesSent><TotalKBytesSent><TotalUncompressedKBytesReceived><TotalCompressedKBytesDecompressed><TotalKBytesReceived><OpenCount><CloseCount><ConsecutiveFailures><UnackedPings><LastPingTime><PingTimeWeightedAverage><Messages><LastHttpStatus><LastWebSocketCode>
::: details Evidence (1)

- @ 0x10f0d018; websocketclient block

:::


:::

## `ws_server`

**coverage** `partial`

The local websocket endpoint: the player runs a websocket server so apps can hold a live control connection instead of polling. It does the standard handshake, negotiates compression, and then carries the same event traffic the cloud pipe does, making it the local twin of the remote channel.

::: details Technical details

websocketserver.cxx serves a local RFC6455 endpoint at /api/v1/websocket (route literal '/websocket/api' also present) for controller/UI clients. Server-side handshake headers sec-websocket-key + sec-websocket-version + 'Upgrade: websocket'; per-message deflate negotiated ('could not initialize per message deflate on ws client'); opcodes emitted as websocket(data|ping|pong|close|cont); 'Websocket protocol error'/'Write to websocket failed. opcode: %u, len: %zu'/'Connection already closed'. Status XML: <WebsocketRegistration>%s (%s)</WebsocketRegistration> or empty <WebsocketRegistration/>; connection cap telemetry <TruncatedConnectionList maxwebsockets="%zu" connections="%zu"/>. Internal state key ws_per_msg_deflate_run_state; event field 'websocketUrl' in the name table.

- **name:** websocketserver: local /api/v1/websocket endpoint
::: details Evidence (1)

- @ 0x10f01b4c; websocketserver.cxx block

:::


:::

## `zgt_errors`

**coverage** `partial`

The topology service's error layer: the error paths for unresponsive-device reports and malformed attribute requests. These are the error strings a bad topology request produces.

::: details Technical details

"Handling ReportUnresponsiveDevice %s/%s from %s:%hu"; GetZoneGroupAttributes {"No valid UUID in request server","TServer is not valid for request","TRequest is invalid in the control server"}

- **name:** ZGT error paths
::: details Evidence (1)

- @ 0x10f1143c; zgt error paths

:::


:::

## `zones_mgr`

**coverage** `partial`

The zone lifecycle manager: zone-definition changes fire events, lookups are exposed through the modern API, and channel-map updates flow from primary to secondary players to keep stereo and surround mappings consistent. It's the bookkeeping of which player is in which room and group.

::: details Technical details

events {ZoneMemberSettingsChangedEvt,ZonesDefinitionsChangedEvent}; muse ops {museGetZoneDefinition "found zone \[%s\]"}; transitions {"zone transition on secondary/primary: zoneId %s","zone transition failed on primary"}; cms (channel-map-set) {"cms init from %s","cms update from pri: %s","cms update from sec: %s = %s + %s","zoneDef %s inconsistent with cms %s","can't construct channelMapSet"}; file <File name="activeZones">; ops {adding/removing player,joinZone id+flatChannelMapSet,unjoinZone,activateZone,deactivateZone,updateActiveZone,sendUpdateZoneMemberSettingsCmd}; guards {"primary change not supported for HT","update with offline primary not supported for HT","update only allows add or remove, not both","can't update both name and channelMapSet","Zone contains incompatible protocol versions","zone is not active","zone id not found","zone def not found","invalid activeZone","invalid channelMapSet","invalid flatChannelMap","invalid zone name","invalid name:","no name","secondary not reachable","more zones active than RMuseActiveZoneList can hold"}; "Legacy zone exists on %s"; "primary unavailable: sending Remove ops to secondaries"; "re-activate the current zone"; "updating ActiveZone: %s -> %s"/"primary change: %s -> %s"/"offline primary: %s -> %s"; zone-activation ops: 'joinZone failed: %s: %u','re-activation failed: %u','Set of players in zone','try updating the active zone setup: %s %s','RemoveHTSatellite(%s) failed: %u','update active zone failed','activateZone failed','deactivating %s zone: %s','deactivateZone failed','Remove ops failed','update zone name failed','active zone needs no change'

- **name:** RZonesManager: zone lifecycle FSM
::: details Evidence (1)

- @ 0x10e95d24; zones_mgr block

:::


:::

## `zones_storage`

**coverage** `partial`

The zone-definition store: the name, ID, and channel-map records with create, update, and remove operations, plus replication. This is the persistence behind stereo pairs and home-theater bonds surviving reboots.

::: details Technical details

zone defs {name,id,channelMapSet} + "reached maximum zone definitions"/"too many zones defined in the config file \[max=%d\]" + "zone def full: %s removed"; ops {create,update id,remove (active-guard "zone currently active")}; replication {"received replicated file","failed to rename offered replicated file","failed to load offered replicated file","ignoring replicated file: incompatible schema"}; JSON load errors {missing value,zones data array,root not object,incorrect schema \[%d != %d\],parsing offset,open errno} + RapidJSON vocab; gainTrimDB remote apply; forwarding {activateZone,updateActiveZone,joinZone,updateZoneMemberSettings cmd to %s} + "primary %s not found" + "output buffer full"; file format: {schemaVersion, zones data array} logged under 'zonesstorage'; setup path: 'loading saved zones during setup succeeded'/'saved zones successfully migrated during setup'/'creating new zones config file'; remote settings change: gainTrimDB \[%.2f\] on %s

- **name:** zones_storage: zone-def persistence
::: details Evidence (1)

- @ 0x10e96cd8; zones_storage block

:::


:::

## `zpinfo_dpimpl`

**coverage** `partial`

The ZPInfo diagnostic surface: the device-info document schema (attributes, network info, support fields) plus the ethernet-port statistics and shutdown-log surfaces. The structured 'everything about this unit' report for support.

::: details Technical details

vars {WirelessMode,ConnectionType,ChannelFreq,BehindWifiExtender,WifiEnabled,EthLink,SettingsReplicationState,SecureRegState,IsIdle,MoreInfo}; events {LineInStateChangedEvent,ReplicatedSettingsChangedEvent}; idle FSM "idle state is %sidle, changing to %sidle" + "Reporting device %sidle"; actors {dpimpl,RDPZoneImpl,dpZoneImpl,dpUpdateIdleState}; /dev/audioctl + U-Boot 17.2.7 + "OTP: %.32s"; KVPair parse; battery {RawBattPct,BattPct,BattChg,BattTmp,BtSrcName}

- **name:** ZPInfo/dpimpl fields
::: details Evidence (1)

- @ 0x10ef31cc; dpimpl region

:::


:::
