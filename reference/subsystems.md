# Non-SOAP subsystems

Self-contained protocols/engines living in the same binary beside or below the UPnP layer. `absent` = no coverage, `vocab` = names/strings catalogued but semantics undecoded, `partial` = some real documentation exists. Evidence addresses are the rodata anchor strings.

| Subsystem | Coverage | Summary |
|---|---|---|
| `ab_experiments` | **partial** | production A/B experiment framework: a /experiments local endpoint plus a replicated <ZoneExperiments> store of <ZoneExperiment id name value defaultValue> rows; presence gated by featureConfigZoneExperiment; values influence runtime policy |
| `account_cert_lifecycle` | **partial** | three cert managers (certmanager/devicecertmanager/regdevicecert) over four keycert identities; the registration cert carries the device's SonosID and is required for token generation ('sr: reg cert not available; cannot generate token'); a /regcert status endpoint exposes DeviceCertInfo XML; root-of-trust bundles are fetched from /certbundles/v4/trusted_roots.rcb with ETag caching and retry backoff |
| `audio_taps` | **partial** | PCM-capture tap subsystem (audiotap_manager.cxx + datatap.cxx): guarded /audio_tap /spdiftap /snapshotspdiftap /downloadspdiftap endpoints, versioned tap-file format with audio+metadata sections, SPDIF tap used to sync TV-input playback against the output tap |
| `business_msp` | **partial** | Sonos-for-Business managed-service machinery: SOAP ops AddRemoveSonosBusinessMSP / Sync Sonos Business MSP / AddRemoveSfbMSP, /msprox + /msprox?uuid= proxy endpoints, three tier vocabulary (SFB_COMMERCIAL/ESSENTIALS/PREMIUM_MSP + commercial/essentials/premium-msp slugs), Backgrounds MSP add/remove, enableRemoveMSPCredentialsFromUPnP flag, voice-service MSP education keys (O_AMAZON/GOOGLE_SHOW_MSP_EDUCATION) |
| `buttons_ir` | **partial** | button + IR input pipeline: hw-message BUTTON multicast group carries events, longpress.cxx handles holds, events forward to the group coordinator ('Forwarding button events'), /button_triggered\[.xml\] diagnostic capture, /rdmbuttonfwd retail hook, virtualRemoteControl/buttonCommand muse route injects button presses from the cloud; irdecoder.cxx learns TV-remote codes against the ir.ws.sonos.com database |
| `chirp_stack` | **partial** | embedded chirp-core 4.2.1_7265 acoustic data-over-audio SDK with a custom 'sonos-cdma' profile: used for room detection during setup — muse routes roomDetection/chirp (start/stop signalling with {playId}), DSP-routed audio streams as-dspin-ext-chirp/as-dspout-ext-chirp, a per-device unique payload ('Start chirping with unique device value:%d') and calibrated output volume ('Chirp volume not yet calibrated') |
| `cloud_queue` | **partial** | the Cloud Queue subsystem: a music service hands the player a queueBaseUrl ending in a SemVer API version (validated: 'path must end with a cloud queue version', 'Cloud Queue API v%u is unknown; use v%u with this player'), then the player pages itemWindows over it: loadCloudQueue, loadCloudQueueWithWindow ('Full itemWindow from the Cloud Queue API must be passed'), refreshCloudQueue, skipToItemWithWindow — all as muse routes on playbackSessions/{sessionId} |
| `device_unlock` | **partial** | developer/manufacturing unlock surface: /unlock, /devunlock, /mfgunlock and /unlock.htm endpoints write /tmp/device_unlocked_flag; unlocks are rate-limited ('Too Many Unlocks' HTML page) and DevUnlock reboots the player; RdeviceIsUnlocked and RabortIfUnlocked let self-tests detect and refuse to run on unlocked units; 'unlockedBld' marks the build state |
| `dsp_ht_engine` | **partial** | home-theatre DSP parameter surface + per-zone audio state schemas fully recovered: HT config XML (surround/sub/downmix/dialog/AI-speech/height levels, autoplay/autostop thresholds, Tweaks bitmask), 37-field per-Zone audio XML, zone volume/duck XML; R_MASK_* speaker layouts enumerate supported channel masks |
| `embedded_sqlite` | **partial** | embedded libsqlite3 (sqlite3_open_v2/prepare_v2/step/bind_*/column_*/exec/busy_timeout) backs LocalTimer persistence in timer.db — the alarm/sleep-timer store; two tables with full DDL recovered verbatim |
| `entitlements` | **partial** | entitlements manager with cloud fetch + local cache, muse-subscribed change events, and a runtime policy hook (RRuntimeZPPolicy takes entitlementsMgr); typed SKU records decide e.g. whether Sonos Radio is preinstalled |
| `factory_reset` | **partial** | factory reset machinery: a 'Factory Reset'/'Remote factory reset' CSRF-posted confirm form, /jffs/factoryReset.txt marker file ('unable to create factory reset file.', 'factory reset had errors', ': not factory reset'), LED_MODE_FACTORY_RESET pattern, sonosFactoryResetFull entry point, household-wide consequence ('device: %s %s removed from vanished list after factory reset'), and 'Invalid system settings (%s), resetting to factory defaults' as a self-heal path; muse route management/factoryReset can trigger it remotely |
| `favourites_model` | **partial** | Sonos favourites store + ContentDirectory projection: FV:2 root container paired with FavoritesUpdateID; XML store schema recovered; mutation via CDS CreateObject/UpdateObject/DestroyObject on the dirObjFavorites vtable + muse getFavorites/loadFavorite routes |
| `feature_flag_registry` | **partial** | complete compile-time feature/config flag vocabulary (48 keys): featureConfig* family keys in the cloud-config JSON doc plus enable*/disable* booleans read at init — the build's feature map showing which subsystems are switchable |
| `group_object_model` | **partial** | zone grouping internals: bonded-role enum (HT_BONDED_MASTER/SATELLITE, UNBONDED_DEVICE, stereo-pair/sub combos), coordinator ops (BecomeGroupCoordinator\[AndSource\] with GC-state cloning + VLI delegation, ChangeCoordinator, DelegatedGroupCoordinatorID), topology monitor with settle-retry, satellite lifecycle (Add/RemoveHTSatellite, recoverBondedZone FSM), per-satellite DSP protobuf + tuning push |
| `ibt_plans` | **partial** | a remote-management command executor: commands named in log domain 'ibt' are compiled into 'plans' (a generated target list — 'failed to generate target list for command (%s)'), then dispatched per-target with per-target results ('\[dispatch\] dispatched (%s) to target (%s), result \[%s\]'); gated by the enablePitchfork feature flag checked at init |
| `lechmere_wss` | **partial** | lechmere.cxx cloud channel: RFC6455 WSS to lechmere.<env>.ws.sonos.com, negotiated subprotocol 'lechmere.<version>' (lechmere-v1 observed), inner TLV header layer ('failed to read lechmere header'), policy-key auth, app-level ping keepalive with 'TOO_MANY_UNACKED_PINGS' disconnect, and a full close-reason taxonomy driving reconnect decisions |
| `led_engine` | **partial** | Scripted LED animation engine: <LedPatternInfo> docs hold <LedPatternEntry time led_ids repeats steps> programs of <LedStepEntry rgb hold fade> steps, serialized with cksum+flags; R_LED_* codes select the default pattern; SetLEDState toggles the user-visible on/off only |
| `log_domain_map` | **partial** | 21 anacapa.*.log sinks under /opt/log define the module boundaries; plus sibling-daemon logs and the /tmp/memorylog ring |
| `media_player_abstraction` | **partial** | source plug-in layer under AVTransport: media_player_mgr + media_player_autoplay + media_player_vli_ctrl + extaudiosrc + ai_impl_base define the source vtable; autoplay system (StartAutoplay, AutoplayRoomUUID, AutoplayVolume, linked-zones expansion, silence thresholds, alarm/buzzer fallback) routes line-in/TV/Spotify-VLI sources to the coordinator; htaudio_autoplay.cxx handles TV autoplay; ChirpExtAudioSrc plugs acoustic input in as an ext source |
| `model_sku_vocabulary` | **partial** | 51 ZPSnn model identifiers enumerated in the capability-conditional table: ZPS{1,3,5,6,9,11-24,26-46,48,49,51-59,61}; capability gating is per-model-ID |
| `multi_daemon_boundary` | **partial** | anacapad coordinates ~13 sibling daemons over /X-external HTTP routes + /tmp/netstartd.ipc: netstartd gets netsettings/PSK pushes and satellite notifications, reports connection-type updates back; per-daemon crash machinery (.dmp/.properties/_backtrace/count files) and /opt/log sinks |
| `muse_semantics` | **partial** | the muse API is the real product surface: 525 route strings, organized as households(282)/players(176)/groups(46)/playbackSessions(12)/users/devices/services namespaces; every SOAP service is mirrored as an upnp* proxy namespace; native resources cover settings, playback, hardwareStatus, positioning, homeTheater, pinewood, zones, authorization, timers, virtualLineIn, playerVolume, trueroom, trueplay, playlists, musicServiceAccounts, voice, systemReporting, localContentLibrary, networkTest, alarms, diagnostics, groupVolume |
| `play_history` | **partial** | historymgr.cxx play-history pipeline: TrackPlayRecorder/TrackPlayMonitor capture plays, entries buffered and POSTed to the household history API with completeness gating + buffer-full drops; getHistory is ETag-cached; deleteHistory/removeHistoryItem/clearHistory ops; ratings via playbackMetadata/ratings — explicitly 'only implemented for cloud queue' |
| `playlist_parsers` | **partial** | playlist machinery on three levels: library-share parsers (iterateASXPlayList/M3U/WLP/PLS + iTunes 'ITP' XML parser), a streaming HLS playlist parser with variant switching (#EXTM3U/#EXT-X-PLAYLIST-TYPE validation, codec-variant source switching, Atmos stream rejection), and the muse playlists API + SaveAsSonosPlaylist SOAP path |
| `qplay_protocol` | **partial** | Tencent QPlay support: /QPlay/Control SOAP endpoint (no matching /QPlay/Event route — the only service missing its event pair), a QPlayAuth action taking Seed/Code/MID/DID arguments (seed→code auth handshake: controller sends Seed, device answers with a Code computed from MID machine-id and DID device-id), a shared-T QPlay mode with context restrictions ('Calling updateSharedTQPlayMode in bad context!'), compile flag #QPLAY_SUPPORT#, and the device-description capability <qq:X_QPlay_SoftwareCapability>QPlay:2</qq:X_QPlay_SoftwareCapability> |
| `queue_persistence` | **partial** | .rsq on-disk queue format: savedqueues.rsq is a <SavedQueues LastUpdateDevice Version Next> XML doc of <SavedQueue Id Curated NumTracks> elements each holding <Track URI= MD=> entries; live queue persists as trackqueue.rsq; atomic write via .tmp rename + .d.rsq backup; validated at boot and on replication receipt |
| `runtime_flag_files` | **partial** | runtime state is driven by sentinel files: /tmp flags (device_unlocked_flag, brokendevice, wifidisabled, htdocs_locked, crashed_play_state, anacapa-has-run, fresh_hh.txt, anacapa_prevent_crashdump_upload, sonosConcurrencyUnrecoverableError), /var/run mode files (wac_mode, netstart_mode, netmanager_extender_flags, systemtimeoffset), /tmp/memorylog 4-file ring + .old copy, /tmp/smb/ mount workspace, /tmp/backtrace + diagstdout/diagstdin diag scratch, /tmp/event_preserve + event_reporter_v3 buffers |
| `scrobbler` | **partial** | Audioscrobbler/Last.fm submission client implementing protocol 1.2 over raw sockets: GET handshake to post.audioscrobbler.com, form-encoded scrobble POSTs, BADTIME Date-header recovery, OK-response check; also embeds ws.audioscrobbler.com/2.0 for the newer API |
| `semisleep_power` | **partial** | low-power 'SemiSleep' suspend/resume: gated by featureConfigSemiSleep/enableSemiSleep + semiSleepConfig cloud config; 'Supported only on suspendable devices' capability check; suspends VLI sessions (onVirtualLineInSuspendSession, AHA_SUSPEND_VLI_SESSION, SUSPEND_SESSION op), playback sessions (muse playbackSession/suspend verb), cloud queue (during snooze/alarm), and local timers track suspend ('considering suspend'); group topology marks suspended members ('Found Suspended Rooms While Processing %s Group Info') |
| `settings_replication` | **partial** | the household replication bus: per-setting transfers ('replicateOne from %s to %s setting %u version %u') with a version+format negotiation ('deciding whether to accept replicated list from: %s; ver: %u format: %u'); per-setting denylisting on badFormat/badEncoding; a separate player-level quarantine subsystem enforcing admission policy (HTTPS required, known user, secure reg required) with scheduled rechecks; suppressed while unregistered |
| `sntp_server` | **partial** | Dual-mode SNTP stack (sntp.cxx client + sntpsrv.cxx server + sntppoll.cxx poller): players sync from *.sonostime.pool.ntp.org or the group coordinator, one player hosts an SNTP server for the household ('Starting SNTP server switch'), and SNTP validity gates synchronized playback scheduling |
| `spotify_esdk` | **partial** | embedded Spotify eSDK (libspotify-derivative) plus a Connect layer: local /spotifyzc endpoint answers Spotify zeroconf getInfo (only the group coordinator answers — 'Non-GC returning 404 from getInfo'), account transfer arrives as an encrypted zeroconf blob ('Decrypting ZeroConf blob failed'), and the player registers on Spotify's hwptp hermes channel (hm://hwptp/v1/devices, hm://hwptp/v2/resolve/%s/%d/%s) to receive Connect commands ('Got unknown command from HWPTP: %s') |
| `telemetry_submission` | **partial** | telemetry/diagnostics uplink: 'Telemetry 1.0 Event field' format, X-Sonos-MessageType: product-data-telemetry header, zonereportmgr.cxx zone reports, submitDiagnostics/submitQueuedDiagnostic pipeline with manifest submission, positioning telemetry level route, per-feature telemetry flags |
| `testenv_environment` | **partial** | POST /testenv switches the player's cloud environment between PROD, PERF, STAGE, TEST and INT, with an optional OnlineUpdateBaseURL override; the page displays the six resolved API bases (Cloud, Service catalog, System, Transfero, Metrics, Update) and CustomerId; the change replicates household-wide ('may take up to 120 seconds ... to replicate throughout household') and logs 'Setting cloud env to %s' |
| `trueplay_tuning` | **partial** | Trueplay room tuning stack: muse routes for discovery/presence/config/status (+setSelfTruePlay, resetDetectedSpeaker), x-rincon-sonarcal: OGG test-tone URIs played through the streamer (leader/testtone/complete_ht), versioned Trueplay SDK with compat fallback, etag-synced spectral/spatial tuning assets, per-driver RoomCalDelay params, satellite propagation via SetRoomCalibrationStatus, SelfTrueplay variant |
| `update_machinery` | **partial** | manifest-driven update pipeline: update_manifest carries a base update URL + per-device target rows (udn, model, submodel, swgen, ver, URI, updateID) and a min auto-update version; user updates run manifest-download -> checkDevicesToUpdate -> launchUpdate; auto-update policy gated by R_AutoUpdatePolicy + R_CheckUpdateInterval + R_AutoUpdateWindowStart + autoUpdatesEnabled |
| `wac_mode` | **partial** | WiFi Accessory Config (WAC) setup mode: state lives in /var/run/wac_mode (parsed int, 'Unknown WAC mode %d') with enabled/disabled/timeout transitions; driven by netstartd via /tmp/netstartd.ipc ('WAC mode enabled/disabled/timeout', 'In setup mode', 'Netstart SSID set/clear'); LED goes to R_LED_WAC mode |

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

embedded libsqlite3 (sqlite3_open_v2/prepare_v2/step/bind_*/column_*/exec/busy_timeout) backs LocalTimer persistence in timer.db — the alarm/sleep-timer store; two tables with full DDL recovered verbatim

- binary anchors: `sqlite3_exec`, `LocalTimer from sqlite3`, `LocalTimer from sqlite3 stmt`, `libsqlite3.so.0`, `CREATE TABLE IF NOT EXISTS timers`, `paused_timers`, `timer.db`, `PRAGMA user_version`, `LocalTimer`, `remaining_seconds`, `paused_utc_time`

- **users:** LocalTimer store (timer persistence across reboot); the full table inventory is unmapped — imports suggest prepared-statement CRUD, no bulk exec-heavy workload
- **schema:** CREATE TABLE IF NOT EXISTS timers(id TEXT PRIMARY KEY,trigger_time TEXT NOT NULL,total_duration INTEGER NOT NULL,triggered NUMERIC NOT NULL); plus a paused_timers table queried as (id, remaining_seconds, paused_utc_time, total_duration) — paused timers freeze remaining_seconds + the UTC pause instant
- **ops:** SELECT id,trigger_time,total_duration,triggered,rowid FROM timers \[WHERE id=?1\]; SELECT count(*) FROM timers; same pair for paused_timers; PRAGMA user_version used for schema versioning
- **notes:** 'LocalTimer from sqlite3 stmt \[%s\] FAILED %d %s' / 'from sqlite3 stmt timer' — row→object hydration; filename timer.db
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
<details><summary>Evidence (7)</summary>

- @ 0x10ec12ca — favorites.cxx
- @ 0x10ec0ce2 — NextFavorite
- @ 0x10304098 — root browse map literal table (FV:2/FavoritesUpdateID ...)
- @ 0x10ec0d1e — '<Favorites SchemaVersion="%d">' store schema
- @ 0x1037cab8 — dirObjFavorites object install in f_1037ca04
- @ 0x10ec13a4 — 'Invalid favorite id.' used in f_1037d984
- @ 0x10ec0f04 — urn:schemas-rinconnetworks-com:metadata-1-0/\|favoriteId

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
<details><summary>Evidence (7)</summary>

- @ 0x10ed15f2 — play_state_mgr.cxx
- @ 0x10e96cc6 — zones_storage.cxx
- @ 0x10e752e0 — /jffs/settings/zones.json
- @ 0x10eb247c — BecomeGroupCoordinatorAndSource GC-state clone flags
- @ 0x10ebce88 — recoverBondedZone FSM strings
- @ 0x10e73ab4 — dsp_system_satellite.bin + satellite_processor.bin
- @ 0x10e878b4 — HT_BONDED_MASTER/SATELLITE role enum

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
- **frame_format:** decoded from reader f_105d52e0: each frame starts with an 8-byte ASCII-hex header — \[protocolVersion:%02x\]\[messageType:%02x\]\[extHeaderLen:%04x\] — followed by extHeaderLen bytes of extended header, then payload. version and type are bounded small enums (rejects >6: 'Bad protocol version: %c%c', 'Bad message type: %c%c; %d', 'Bad extended header length: %c%c'); short reads → 'failed to read lechmere header: %d' / 'could not recv extended header; expected %u read %u'
- **handshake:** Sec-WebSocket-Protocol: lechmere.%u offered; server response's Sec-WebSocket-Protocol header is parsed back with 'lechmere.%hhu%n' sscanf (f_105d45f8) to confirm the negotiated version; the HTTP 101 Date: header is also consumed — wall-clock sync from the upgrade response
- **lifecycle:** 'IP changed. Bouncing connection' — local IP change tears the channel down (SONOS_PLAYER_IP_ADDRESS_CHANGED close reason); authzPolicyKeyLechmere carries a role field ('Could not parse role from lechmere policy key')
<details><summary>Evidence (10)</summary>

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

## `model_sku_vocabulary`

**coverage** `partial`

Model identifiers (ZPS9-ZPS61, S0-S9) and product names embedded for capability conditionals — which features a given hardware reports. The model→capability table hasn't been written out yet.

**Technical description:**

51 ZPSnn model identifiers enumerated in the capability-conditional table: ZPS{1,3,5,6,9,11-24,26-46,48,49,51-59,61}; capability gating is per-model-ID

- binary anchors: `ZPS9`, `HwFeatures`

- **model_ids:** ZPS1, ZPS3, ZPS5, ZPS6, ZPS9, ZPS11, ZPS12, ZPS13, ZPS14, ZPS15, ZPS16, ZPS17, ZPS18, ZPS19, ZPS20, ZPS21, ZPS22, ZPS23, ZPS24, ZPS26, ZPS27, ZPS28, ZPS29, ZPS30, ZPS31, ZPS32, ZPS33, ZPS34, ZPS35, ZPS36, ZPS37, ZPS38, ZPS39, ZPS40, ZPS41, ZPS42, ZPS43, ZPS44, ZPS45, ZPS46, ZPS48, ZPS49, ZPS51, ZPS52, ZPS53, ZPS54, ZPS55, ZPS56, ZPS57, ZPS58, ZPS59, ZPS61 (this build targets ZPS9 = Playbar/S1-era table includes newer ids)
- **unresolved:** ZPS->product-name mapping, which capabilities gate on which ids, the S0-S9 submodel series
<details><summary>Evidence (3)</summary>

- @ 0x10f249a4 — ZPS9
- @ 0x10e741dd — HwFeatures
- @ 0x10f2490c — ZPSnn identifier table (two rodata runs)

</details>

## `multi_daemon_boundary`

**coverage** `partial`

anacapad is one daemon of ~13 on the player. It pushes WiFi/network settings and PSKs to netstartd over /tmp/netstartd.ipc and receives connection-type updates back; LED, Bluetooth and power daemons get /X-external HTTP routes; each daemon has .dmp crash-report machinery. Most device behaviours (WiFi join, LED, BT pairing) are actually owned by the siblings.

**Technical description:**

anacapad coordinates ~13 sibling daemons over /X-external HTTP routes + /tmp/netstartd.ipc: netstartd gets netsettings/PSK pushes and satellite notifications, reports connection-type updates back; per-daemon crash machinery (.dmp/.properties/_backtrace/count files) and /opt/log sinks

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
- **transport_constraint:** upnp* proxy subscribe/renew/unsubscribe are rejected unless the transport is WSS: 'Invalid transport: WSS is required', 'Invalid namespace: UPnP subscribe/renew/unsubscribe not supported' — over plain HTTP only upnp*/call works; event subscriptions require the websocket channel
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

playlist machinery on three levels: library-share parsers (iterateASXPlayList/M3U/WLP/PLS + iTunes 'ITP' XML parser), a streaming HLS playlist parser with variant switching (#EXTM3U/#EXT-X-PLAYLIST-TYPE validation, codec-variant source switching, Atmos stream rejection), and the muse playlists API + SaveAsSonosPlaylist SOAP path

- binary anchors: `mswmext=.asx`, `application/x-mpegurl`, `application/dash+xml`, `iterateASXPlayList`, `ITP Parser`, `#EXT-X-PLAYLIST-TYPE`, `m3u8`

- **share_formats:** ASX, M3U, WPL, PLS file parsers + iTunes XML ('ITP Parser: mismatched end tag atPlaylistID/PlaylistExclude/PlaylistTrackID/PlaylistName'); index counters list 6 types: iTunes/ASX/M3U/PLS/RSQ/WPL Playlists
- **hls:** hlsplaylist parser: #EXTM3U header check, #EXT-X-PLAYLIST-TYPE handling, per-line validation ('Invalid media playlist: %s: line=%s'), 'forcing a source switch due to multiple codec variants in playlist', 'storeStream: rejecting unsupported Atmos stream from playlist', 'unable to select another DS' variant fallback on empty playlists, 'stream duration from HLSPlaylist'
- **muse:** v1/households/{householdId}/playlists (getPlaylists/postPlaylist), {playlistId} (getPlaylist), v1/groups/{groupId}/playlists (loadPlaylist); playlistsVersionChange event; playlistsList/playlistTrack keys
- **didl:** object.container.playlistContainer{,.sameArtist,.tracklist}, object.item.playlistItem; explore categories explore:playlist::pp./mp., RDCPA:GLBPLAYLIST/LIBPLAYLISTS (Rhapsody-era), mymusic:playlists, FEATPLAYLISTS
- **mimes:** audio/x-mpegurl, audio/mpegurl, application/x-mpegurl, application/vnd.apple.mpegurl, application/dash+xml, sonos.com-http:*:application/dash+xml:*; enableAmazonMusicDASH flag
<details><summary>Evidence (6)</summary>

- @ 0x10ed693c — mswmext=.asx
- @ 0x10eb8946 — application/x-mpegurl
- @ 0x10eb89e8 — application/dash+xml
- @ 0x10ed1888 — iterateASX/M3U/WLP/PLSPlayList parser family
- @ 0x10ec93fc — ITP iTunes-library parser errors
- @ 0x10ec5edc — #EXT-X-PLAYLIST-TYPE HLS handling

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

low-power 'SemiSleep' suspend/resume: gated by featureConfigSemiSleep/enableSemiSleep + semiSleepConfig cloud config; 'Supported only on suspendable devices' capability check; suspends VLI sessions (onVirtualLineInSuspendSession, AHA_SUSPEND_VLI_SESSION, SUSPEND_SESSION op), playback sessions (muse playbackSession/suspend verb), cloud queue (during snooze/alarm), and local timers track suspend ('considering suspend'); group topology marks suspended members ('Found Suspended Rooms While Processing %s Group Info')

- binary anchors: `enableSemiSleep`, `featureConfigSemiSleep`, `powerWakeupFromSemiSleep`, `DirectControlIsSuspended`, `semiSleepConfig`, `powerWakeupFromSemiSleep`, `powerWakeupFromSemiSleep`, `<r:DirectControlIsSuspended val="`, `AmplifierPowerStateChangedEvent`, `featureConfigSemiSleep`, `semiSleepConfig`

- **evidence_bits:** featureConfigSemiSleep + semiSleepConfig JSON key in cloud config; powerWakeupFromSemiSleep wake entry point; '<r:DirectControlIsSuspended val=' is an r:-namespace replicated element; AmplifierPowerStateChangedEvent; SONOS_PLAYER_SLEEPING and SONOS_PLAYER_LOW_BATTERY are lechmere close reasons — suspension tears down the cloud channel
- **fsm_bits:** entry: UserSuspend/Suspend and reset/int_internalSuspend → 'suspending stop'/'suspendSession'; state: isSuspended/suspended + <r:DirectControlIsSuspended> replicated element + 'suspend bypass flag' gating LED apply; wake: powerWakeupFromSemiSleep; 'registration during suspend' queues/defers registration
- **errors:** ERROR_PAND_SUSPENDED (Pandora op fails while suspended); SONOS_PLAYER_SLEEPING/LOW_BATTERY lechmere close reasons
<details><summary>Evidence (11)</summary>

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
<details><summary>Evidence (6)</summary>

- @ 0x10eae506 — auto_update_scheduler.cxx
- @ 0x10fafc18 — migrationmanager.cxx
- @ 0x10e82b39 — /softwareDownload
- @ 0x10eeea5c — manifest: Setting base update url=%s
- @ 0x10f076a4 — per-device manifest row fields
- @ 0x10e838ac — v1/players/{playerId}/update/check muse route

</details>

## `wac_mode`

**coverage** `partial`

WiFi Accessory Configuration — the Apple's-WAC-style setup mode where the player broadcasts a setup network (wacd daemon, /var/run/wac_mode flag, timeout). This is the first-boot/add-player path.

**Technical description:**

WiFi Accessory Config (WAC) setup mode: state lives in /var/run/wac_mode (parsed int, 'Unknown WAC mode %d') with enabled/disabled/timeout transitions; driven by netstartd via /tmp/netstartd.ipc ('WAC mode enabled/disabled/timeout', 'In setup mode', 'Netstart SSID set/clear'); LED goes to R_LED_WAC mode

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
