# Extraction gap audit — anacapad 86.10-80260 (model-9)

Audit of everything present in the binary that `docs/documentation.json`
does not document, or documents only at vocabulary level (name exists,
semantics absent). Compiled by sweeping strings, embedded source paths,
route tables and URI schemes, then diffing against the dataset.

Two sections:

- **Part 1 — SOAP/UPnP-adjacent gaps.** These belong in the canonical
  dataset; they are wire surface a client hits through the same HTTP
  server, SOAP envelope or device-description machinery.
- **Part 2 — separate subsystems.** Entire protocols/engines below or
  beside the SOAP layer that deserve their own documents, not action
  records.

Why they were missed is documented per item; the root pattern is that
the extraction was SOAP-dispatch-driven: no dispatch anchor → no
forced investigation.

---

## Part 1 — SOAP / UPnP surface gaps (belong in this dataset)

### HTTP endpoint inventory is incomplete — ~35 missed paths
The route-table dig catalogued the 63 `/status` subhandlers, but a
second sweep turned up these HTTP paths present in the binary and
absent from `documentation.json`:

- **SSH management:** `/ssh/authorized_keys`, `/ssh/fingerprints`
- **Firmware:** `/softwareDownload`, `/update` (listed), `/upload`
- **Group ops:** `/createGroup`, `/unjoin`, `/activate`, `/deactivate`
- **Auth:** `/auth/oauth/v2/validate`, `/authz`, `/tokens`,
  `/accountSubscription`
- **Content bridge:** `/content/api`, `/bridge/content/api`,
  `/entitlements/api`, `/settings/api/v1/locations/`
- **DSP control:** `/sonar-tone`, `/sonarctl`, `/save_eq_presets`,
  `/setPersistentEQ`, `/putDSP`, `/drc`, `/dolby_config`,
  `/dynamicparams`, `/staticparams`, `/dsp/eqdata.txt`
- **Spotify:** `/spotdbg`, `/spotifyzc`, `/spotresetnts`
- **Retail/demo:** `/rdmbuttonfwd`, `/rdmhhsetup`
- **Diag/support:** `/v2/diags`, `/testpoint`, `/debugfiles`,
  `/du-jffs`, `/watchdog`, `/watchdog-legacy`, `/watchdogcrash`,
  `/ws/diag/diag_instructions.xml`, `/support/{aggregate,asyncsubmit,
  directsubmit,networkmatrix,review,reportstatus}`
- **Test environment switcher:** `/testenv` — POST form choosing
  PROD/PERF/STAGE/TEST/INT plus `OnlineUpdateBaseURL` override; shows
  Cloud API, Service catalog, System, Transfero and Metrics API URLs
- **Misc:** `/advconfig`(+`.htm`), `/customsd`(`.htm`), `/sethostip`,
  `/reset`, `/radiolog`, `/ttm_helper`, `/ZPs`, `/duck`, `/unduck`,
  `/downloadspdiftap`, `/snapshotspdiftap`, `/getaa` variants
  (`?u=%s&v=%u`, `?s=1&u=%s`, `?m=1&u=%s`) — album-art endpoint present
  in this build but only the 25.2 version was documented
- **Sibling-daemon IPC routes:** `/btmanager-external`,
  `/netstartd-external`, `/sonosledmgrd-external`,
  `/sonospowercoordinator-external` — anacapad proxies to other
  daemons over these paths
- **Unlock/devmode:** `/devunlock`, `/mfgunlock`, `/unlock`,
  `<h2>DevUnlock</h2>Rebooting...`, `Too Many Unlocks` rate limit,
  `/tmp/device_unlocked_flag`

Why missed: only the `/status`-table cluster was decoded
(0x10e75c5c-0x10e75f80); the other route tables/dispatch paths weren't
enumerated exhaustively.

### `/status` subhandler semantics — 63 names, zero behaviour
Every subhandler name + handler address is catalogued but none of the
handlers were disassembled: what `experiments`, `trueplayinfo`,
`setstring`/`removestring`/`ranges` (raw settings write endpoints!),
`mdnsannounce`, `sonarctl` etc. actually accept and return is unknown.

### Device description variants
`/xml/device_description_no_ai.xml` exists — a second device
description proving AudioIn omission is deliberate and switchable —
plus `/xml/satellite_device.xml` and `/xml/group_description.xml`.
Only the group description variant is noted; the no-AI variant is not.

### GENA/eventing internals
Present but undocumented: SID preinstall (`Attempting to preinstall
SID=%u`, `?sid=0`), `SubscribedEvents`/`LogicalSID`/`UPnPSID`/
`NotifyErrors` status fields, renewal handling, `upnpeventing_sender`/
`upnpeventing_source` sender machinery, `AVTStateLastChangedEvent`
name. `LastChange` is referenced 280× in the dataset but the
per-service LastChange payload schema (which XML envelope each service
emits) is not spelled out.

### `/QPlay/Control` has no `/QPlay/Event`
Every service has a Control+Event route pair except QPlay — Control
only. Route-pairing anomaly worth a note.

### GetProtocolInfo source/sink contents
The `protocol_info_schemes` format exists but the full CSV wasn't
captured: `application/dash+xml`, `x-file-cifs`, `file:*`,
`sonos.com-{http,mms,spotify,rtrecent}` transport prefixes, the full
MIME list — worth freezing verbatim.

### Proprietary headers
`X-Sonos-Playback-Id`, `X-Sonos-SWGen`, `X-RINCON-BOOTSEQ`,
`X-RINCON-VARIANT`, `WMPNSSv` (fake Windows Media Player NSS service
header Sonos sends), `?sonosId=`/`&sonosid=`/`householdid=` query
params — vocabulary only.

### ICY/Shoutcast metadata
`@icy-metaint:` — inline ICY metadata parsing for mp3radio streams;
not documented as a payload format.

### URI schemes missed
`pndrradioad://` (Pandora ad insertion), `pndrradio-http://`,
`hls-radio://`, `hls-aac://`, `last.fm-radio-http`, `skd://`,
`stub://`, `hm://` — absent from `uri_formats`.

### Favourites write path (SOAP-adjacent)
`FV:%zu` grammar documented but how favourites enumerate via Browse and
mutate via UpdateObject/CreateObject is not; `FV:GC`/`FV:GC-HB`
semantics unknown.

### Alert/chime engine
`alertContent` log strings, `ALEXA_ALERT`, `JOIN_CHIME_UNAVAILABLE`,
`Cannot interrupt current clip due to priority policies` — an audio
interrupt/ducking engine with priority policy surfaced through the
`audioClip` muse resource and `/duck` `/unduck` endpoints. SOAP-visible
edge only.

### Non-SOAP error families
`ERROR_LASTFM_{BAD_SUBLEVEL,STREAM_LIMIT,NO_ACCOUNT,NO_CONTENT,
BAD_ACCOUNT}`, `ERROR_DOCK_INTERRUPT` — fault-code families outside
the UPnP 4xx/7xx/8xx vocabulary; uncatalogued.

### The `R_*` internal result/status namespace — ~403 codes
The binary carries a complete internal status enum: `R_ACCOUNT_*`
(REAUTH_REQUIRED, UPGRADE_REQUIRED, WRONG_SERVICE...),
`R_CLOUD_QUEUE_*`, `R_PLAY_OP_*`/`R_STREAM_OP_*` (transport/stream op
codes), `R_INIT_STATUS_*`, `R_READ/WRITE_STATUS_*`, `R_PAND_*`
(Pandora), `R_LASTFM_*`, `R_WMP_*`, `R_LED_*` (the full LED state
machine: BEGIN_SETUP_MODE, JOIN_HH, MUTED, PLAYING, UPGRADE, WAC,
WARN...), `R_MASK_*` speaker-channel masks (THREE_DOT_ONE,
FIVE_DOT_ONE, FIVE_DOT_ONE_DOT_TWO, SEVEN_DOT_ONE,
NINE_DOT_ONE_DOT_FOUR), `R_CLIENT_KEYCERT_*` cert types, `R_TYPE_*`
(Sub/BOOSTED_BATTERY/BUCKED_CAPACITOR...), plus `R_PLAYBACK_*`,
`R_DOCK_INTERRUPT`, `R_INSUFFICIENT_POWER_FOR_UPDATE`,
`R_MICROPHONE_NOT_ENABLED`, `R_PEER_FAILED_VERIFICATION`...
Zero of the ~403 codes are catalogued. They surface into SOAP faults,
muse responses and logs but the enum itself is unmapped — no table of
value→meaning, no mapping to UPnP fault codes.
Plus 29 `R_*` *settings keys* (`R_CrossfadeDuration`,
`R_ContentFiltering`, `R_VolNormMode`, `R_MuseDuckingPolicy`,
`R_ServiceBitrate`, `R_AutoUpdatePolicy`, `R_HideTuneIn`,
`R_ShowNSSServers`, `R_ShowRhapUPnP`, `R_AirplayIncludeLinked`,
`R_AudioInEncodeType`, `R_AccountTransferMode`...) — the real
SystemProperties key space is undocumented; the dataset documents the
Get/Set/Remove *actions* but not the key vocabulary they operate on.

### CSRF protection on config endpoints
`/advconfig` POST carries a `csrfToken` hidden field — the player
implements CSRF tokens on browser-facing config pages. Undocumented
mechanism; matters for anyone scripting the HTTP surface.

### `/advconfig` POST parameters
`FirstZP`, `PriorityBridge` — SonosNet bridge priority settings exposed
through the advanced-config page. Endpoint known, params not.

### `/customsd` exposes the full SMAPI capability vocabulary
The custom-service-descriptor POST form is a complete SMAPI manifest
editor: SID range `240-253 or 255`, container types `MService`/
`SoundLab`, auth types `UserId`/`Anonymous`/`DeviceLink`/`AppLink`,
and the full capability checkbox set — `search`, `trFavorites`,
`alFavorites`, `arFavorites` (commented out), `ucPlaylists`,
`logging`, `playbackLogging`, `accountLogging`, `extendedMD`,
`radioExtendedMD`, `playlistExtendedMD`, `disableAlarms`,
`noMultiAccount`, `mediaUriActions`, `contextHeaders`,
`deviceCerts`, `playerIds`, `contextReporting`, `userInfo`,
`contentFiltering`, `manifest`, `authorizationHeader`, plus
strings/presentationMap/manifest URI+version triples. This is the
authoritative SMAPI capability flag list — `ListAvailableServices`
returns these bits; not enumerated in the dataset.

### More POST-form endpoints
`/ping`, `/traceroute`, `/nslookup`, `/devmode`, `/fcs`, `/logger`,
`/mdnsannounce`, `/spotresetnts`, `/ssh/authorized_keys` (full pubkey
install form gated by `R_ALLOW_SSH_PUBKEY_INSTALL`),
`/support/directsubmit` — all CSRF-protected, none documented.

### Household crypto/PSK vocabulary
`<HhPsk>`, `<ControlPsk>`, `<LanSwapPsk>`, `<RoomEncPsk>` plus the
`Backup*` mirrors — household/group encryption key identifiers in
replicated state. The key hierarchy is undocumented.

### Replication protocol elements
`<ReplicationOperation>`, `<ReplicationPlayer>`,
`<ReplicationResult>`, `<ReplicationTime>`, `<ReplicatedNetSettings>`,
`<QuarantinedDevices>`, `<Denylisted>` — the replication engine's own
wire schema, separate from the store inventory already listed.

### Token-refresh state machine
`token refresh state for acct. sn. %u action %d`, `transition token
refresh action %u %d -> %d`, `tokencache`, outbound
`/auth/oauth/v2/validate?access_token=` + `/product/v2/households/
.../players?action=complete&token=` — the OAuth lifecycle the
SystemProperties account actions plug into.

### XML schema clusters never catalogued
`alarmclock.xml`, `areas.json`, `cloudconfig.json`,
`householdsettings.json`, `zones.json`, `zpMetricsConfigV2.xml` file
schemas; `<Scheduler>/<Job*>`, `<LedPattern*>`, `<RadioStationLog>`,
`<PerformanceCounterTables>`, `<IndexStats>`, `<Satellite*>/
`<HWMembers>`, `<RoomCalibration*>` + `<SelfTrueplayEQ>/
<SelfTrueplayInfo>`, `<Ducking*>/<PlaybackDucked>`, `<ABREvents>/
<ABRState>`, `<HLS>/<HLSInfo>`, `<DTSProfile>/<DialNorm>` decoder
params, `<AudioDelay*>` lip-sync fields, `<PresetNameList
val="FactoryDefaults"/>` EQ presets, `<Account Type=` schema,
`<Orientation>`, `<MicFlags>`, `<FocusModeMute>` — hundreds of
unexplored element names across the /status/state dumps.

### DIDL classes — extended
`object.item.audioItem.audioBook`, `.audioBook.chapter`, `.podcast`,
`episode.podcast`, `chapter.audiobook`, `:audiobooks` container, plus
`mswmext=.asx` WMP-extension mapping and `application/x-mpegurl`/
`application/vnd.apple.mpegurl`/`application/dash+xml` playlist
formats. Mostly absent.

---

## Part 2 — Separate subsystems (deserve their own documents)

Each is a self-contained protocol/engine that happens to live in the
same binary. Level of existing coverage noted honestly.

### Scrobbling (audioscrobbler/Last.fm) — ABSENT
Full submission client: `post.audioscrobbler.com` +
`ws.audioscrobbler.com/2.0` endpoints, `/?hs=true&p=1.2&c=` handshake,
`scrobbling submission %s`, `last.fm-radio-http` scheme,
`ERROR_LASTFM_*` family. Zero SOAP reach — lives in the streamer's
service plug-in layer. Never investigated.

### Embedded Spotify (libspotify eSDK) — VOCAB
Full eSDK statically linked: `ap_send`, `apresolve`, `hermes`, `korn`,
`login4`, `track_pipeline`, `cache_restrictions`, `cdnio`, plus Sonos
bridge `spotify_{abr,media,playback_session,queue,smapi,thread,vli}`,
`mdns_spotify_service` (Connect discovery), `/spotifyzc`, `/spotdbg`.
Mercury/AP protocol, Connect auth, ABR ladder, SMAPI↔eSDK bridge all
undocumented. Names appear only in `impl_files` lists.

### Chirp acoustic stack — VOCAB
Embedded chirp-core + chirp-private: encoder/wavetable/decorator,
decoder/voter/weighting, `chirp_private_{cdma,fsk}.c`, acoustic
protocol profiles. Drives `RoomDetection*Chirping` + trueplay
discovery. Protocol/modulation undocumented.

### Trueplay tuning protocol — PARTIAL
SOAP enable/status documented; the tuning machinery (presence
discovery, etag asset sync `Failed to load Trueplay etags`,
`trueplay-node`, tuning state machine, `/trueplayinfo`) is vocabulary.

### DSP / home-theater engine — VOCAB
`htaudio_*` modules + the full param surface: `BassGain`,
`LRBassSum`, `SubCrossover`, `InvertSub`, `SubDefaultInversion`,
`DialogEnhancementLevel`, `AISpeechEnhance`, `MusicSurroundLevel`,
`TVSurroundLevel`, `HeightChannelLevel`, `MonoMode`, `SpeakerSize`,
`SPLdB`, `GainTrimDB`, `DRCVolumeScaling`, `Tweaks` bitmask,
`surround delay %u gain %f`, `/htconfig`, `dspControl`/
`dspStateManager`. The `<Zone>...<IsSatellite><GainTrimDB><SPLdB>
<Balance><NumBondedSubs><SubwooferJackConnected>...` audio-state XML
schema is undocumented too.

### LED animation engine — ABSENT
`<LedStepEntry rgb="%06X" hold="%u" fade="%u" />` scripted LED
programs; `sonosledmgrd` daemon + `/leds` endpoint; the `R_LED_*`
enum gives the full state vocabulary (BEGIN_SETUP_MODE, JOIN_HH,
JOIN_HH_OPEN, IDENTIFY_PLAYER, CONTROL_FEEDBACK, MUTED, PLAYING,
WAITING_TO_PLAY/PAUSE, UPGRADE, WAC, WAC_TIMEOUT, TRANSFER_
REGISTRATION, DEMO_MODE, DEMO_CONFIGURE_IR, BROKEN_DEVICE, FAULT,
WARN, HHID, AUDIO_OFF, BREAK_POP, SHUTDOWN). `SetLEDState` on/off
documented; the program format and state machine aren't.

### Queue persistence (`.rsq`) — ABSENT
`savedqueues.rsq`, `savedqueues.d.rsq`, `.tmp` atomic rename,
`trackqueue.rsq#0`, `<SavedQueues LastUpdateDevice Version Next>` +
`<TrackQueueSummary>` schema. File format, not wire — never dug.

### Play history & ratings sync — VOCAB
`historymgr.cxx`, `History`/`RestHistory`/`WebSocketHistory`/
`CloudQueueHistory` XML types, `deleteHistory` cloud op,
rating-gating string. Per-channel format + sync policy undocumented.

### SNTP household time server — VOCAB
`sntpsrv.cxx`/`sntppoll.cxx`: players *host* an SNTP server
(`Created SNTP Server, port: %hu`, `handleSntpRequest`, clock-switch
strings). Role/topology undocumented.

### Settings replication — VOCAB
`replicated_settings.cxx`, replicated-store inventory listed
(`<Radio>`,`<Services>`,`<Shares>`,`<Setting>` records,
`LastUpdateDevice`/`NextFavorite` versioning); merge/dissemination
protocol undocumented.

### Accounts/cert lifecycle — PARTIAL
`certmanager`/`devicecertmanager`/`regdevicecert`/
`cloudregistration`/`register`/`museclient_authhelper`/
`zpserviceaccounts`; endpoints exist but enrolment/renewal flows,
cert formats and key storage undecoded.

### Entitlements — VOCAB
`entitlementsmanager.cxx`, `entitlementsVersionChanged` event,
`entitlements` muse resource + `/entitlements/api`. What an
entitlement gates is unknown.

### Telemetry & diagnostics submission — PARTIAL
`reportuploader`, `usagedatasharing`, `zonereportmgr`,
`zpMetricsConfigV2.xml`, submission queue (`submissionId`,
`diagnosticSubmissionResults`), `dropout_event_logging` +
`dropout_triggered`, `radiolog`, `trackplaymonitor`/
`trackplayrecorder` (per-track play records to Sonos). SOAP
`SubmitDiagnostics` documented; the periodic uploader + metric
schemas are not.

### Audio taps — VOCAB
`audiotap_manager`, `datatap`, `spdiftap`, `/snapshotspdiftap`,
`/downloadspdiftap` — PCM capture taps, names only.

### Update machinery — PARTIAL
`auto_update_scheduler`, `user_update_scheduler`,
`migrationmanager` (`Bad Migration Data`), `upgrade*.log`,
`/softwareDownload`, `/testenv` update-URL override.
`BeginSoftwareUpdate` documented; scheduling/staging/migration not.

### Media-player abstraction — VOCAB
`media_player_mgr`, `media_player_autoplay`, `media_player_vli_ctrl`,
`extaudiosrc`, `ai_impl_base` — the plug-in layer under AVT sources.
Vtable/source-mode map undocumented.

### Group/object model internals — PARTIAL
`group.cxx`, `group_playeronly`, `group_locationandplayer`,
`play_state_mgr`, `zones_mgr`/`zones_storage` + `zones.json`. ZGT is
documented; the internal state machine behind it isn't.

### Buttons/IR — PARTIAL
`longpress` (gesture detection), `irdecoder`, `irconfig.txt`,
`button_triggered.xml`. HTControl SOAP surface documented; decode
mechanics not.

### Muse API semantics — VOCAB (biggest vocabulary-only surface)
282 routes catalogued as strings; per-route request/response schemas,
auth requirements, and which are exercised on model-9 undocumented.

### Lechmere/websocket — PARTIAL
`websocket_lechmere` confirmed, TLV frame format documented; full WSS
command vocabulary, reconnect/auth and per-namespace payloads not.

### Cloud queue — VOCAB
`/cloudqueue`(+`poll`), `trackQueueAdditions`, `CloudQueueHistory`,
rating gating. Wire format/lifecycle undocumented.

### Remaining buses — PARTIAL
`hwmessage` netlink documented at boundary; `snf` log domain,
`nodetx`, `ipc_msg`, `{sntppoll` config block unexplored.

### Sonos Business MSP — ABSENT
`AddRemoveSonosBusinessMSP`, `Sync Sonos Business MSP` — managed
service-provider hooks, zero coverage.

### Power management / SemiSleep — ABSENT
`enableSemiSleep`, `featureConfigSemiSleep`, `powerWakeupFromSemiSleep`,
`enableHTSourceSleep`, `int_internalSuspend`, `AmplifierPowerStateChanged`
event, `HT_POWER_STATE`, `DirectControlIsSuspended` state variable,
`AHA_SUSPEND_VLI_SESSION` + `onVirtualLineInSuspendSession` — a real
suspend/resume engine with wakeup-listening. Completely undocumented.

### Log domain map — VOCAB
The `anacapa.*.log` file set is catalogued, but the 21-domain list is
also a subsystem map nobody decoded: `alarm.job`, `avt.play`,
`chsrc.state`, `dc` (direct-control?), `ext.audio.action`,
`gm.events`, `hdmi`, `ht`, `hw.events`, `lechmere.event`,
`musecmdandrsp`, `musedebug`, `museevt`, `rc.upnp`, `snf`,
`spotify.debug`, `spotify`, `sps`, `trueplay`, `tv`, `vl`. Each is a
separately-labled subsystem boundary.

### Model/SKU vocabulary — VOCAB
`ZPS9` (this unit) through `ZPS61`, `S0`/`S1`/`S4`/`S5`/`S8`/`S9`,
product names (`Sub`, `Port`, `Beam`, `Arc`, `Move`, `Roam`, `Era`,
`One`) embedded as capability-conditional strings — the model→
capability map this build was compiled for is not tabulated.

### Hardware-gated-but-present — VOCAB
Bluetooth (`hardwareStatus/bluetooth` routes), HDMI-CEC, AirPlay
(`/tmp/AirPlay.log`, VLI-resume-after-AirPlay) compiled in; fault as
unsupported on model-9. Vocabulary noted; protocol mechanics not.

### Multi-daemon system boundary — VOCAB
anacapad is one process of many: `btmanager`, `wacd` (WiFi Accessory
Config — `WAC mode enabled/timeout`, `/var/run/wac_mode`),
`netstartd` (`/tmp/netstartd.ipc`, `/var/run/netstart_mode`),
`sonosledmgrd`, `sonospowercoordinator`, `mdnsd`, `sddpd`, `chronyd`,
`dropbear`, `udhcpc`, `wpa_supplicant`, `upgrade_mgr`. The
`/X-external` HTTP routes are the IPC surface between them; the
inter-process contracts are undocumented.

### Runtime state/flag vocabulary — VOCAB
`/tmp/` flag-file semantics: `device_unlocked_flag`, `brokendevice`,
`wifidisabled`, `crashed_play_state`, `event_preserve`,
`anacapa_prevent_crashdump_upload`, `fresh_hh.txt`, `memorylog` ring
(`/tmp/memorylog/log.N`), `htdocs_locked`, `upgrade_mgr_info.txt`,
`wifi_card_mac_addr`, `udhcpc_resp_mac_addr`; `/var/run` markers
(`netmanager_extender_flags`, `systemtimeoffset`, `wac_mode`);
`/tmp/smb` scratch. What each flag gates is undocumented.

### IBT command plans + `enablePitchfork` — ABSENT
`executing ibt plan for command (%s)`, `unsupported IBT command`,
`already generated ibt plan` — an internal IBT (inter-bridge
transfer?) plan-execution engine, plus the `enablePitchfork` feature
flag. Zero coverage.

### Embedded SQLite — VOCAB
`libsqlite3` linked; `LocalTimer from sqlite3 stmt` — local timers
persist in SQLite. Which tables, undocumented.

### Factory reset machinery — VOCAB
`factoryReset.txt` sentinel, `sonosFactoryResetFull`,
`LED_MODE_FACTORY_RESET`, `manufacturingData` retrieval, remote
`management/factoryReset` muse route, `not factory reset` state
checks. Reset levels/what's preserved undocumented.

### Playlist/container parsers — VOCAB
`mswmext=.asx`, `audio/x-mpegurl`, `application/vnd.apple.mpegurl`,
`application/dash+xml` — the metadata parsers for ASX/M3U/HLS/DASH
live below the URI layer; not documented as formats.

### Favourites data model — VOCAB
`favorites.cxx`, `FV:` grammar + GC variants, `NextFavorite`
replication, `trFavorites`/`alFavorites` — enumerate/mutate semantics
undocumented (see also Part 1).

### Feature-flag registry — VOCAB
`featureConfig*` compile/config flags enumerate the gated feature set:
`DropoutContext`, `HomeTheaterWifiPerfTelemetry`, `MetricsService`,
`Plink`, `Quickbonding`, `SemiSleep`, `SmartPlay`, `SpotABR`,
`SsdpAdvertiseConfig`, `ZoneExperiment`. The flag names are a feature
map of this build; `capabilities` in the dataset covers hardware gates
but not this config layer.

### A/B experiments framework — VOCAB
`<ZoneExperiments>` doc + `<ZoneExperiment id name value
defaultValue>` + `experimentId` + `/experiments` /status endpoint +
`featureConfigZoneExperiment` — a zone A/B experiment framework in
production firmware. Element list only; assignment/bucketing
undocumented.

---

## To close, ordered by leverage

1. HTTP endpoint inventory completion (~35 paths) + /status handler
   decode + CSRF mechanism — pure-Part-1 win, bounded effort
2. `R_*` result-code enum + `R_*` settings-key space — biggest single
   vocabulary unlock; touches faults, muse and SystemProperties
3. Muse route semantics — largest vocabulary-only surface
4. Spotify eSDK bridge + Connect
5. Scrobbler handshake/submission format
6. Settings replication + favourites/history data models
7. DSP/HT tuning + zone audio-state schema
8. Lechmere command vocabulary; GENA internals
9. `.rsq`/file formats; unlock/devmode mechanism; SemiSleep power model
10. Telemetry machinery; scheme/header/DIDL-class vocabulary backfill
