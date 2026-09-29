# Non-SOAP subsystems

Self-contained protocols/engines living in the same binary beside or below the UPnP layer. `absent` = no coverage, `vocab` = names/strings catalogued but semantics undecoded, `partial` = some real documentation exists. Evidence addresses are the rodata anchor strings.

| Subsystem | Coverage | Summary |
|---|---|---|
| `business_msp` | **absent** | Sonos Business managed-service-provider hooks (AddRemove/Sync Sonos Business MSP) |
| `ibt_plans` | **absent** | IBT command plan-execution engine ('executing ibt plan for command') + enablePitchfork feature flag |
| `semisleep_power` | **absent** | suspend/resume engine: enableSemiSleep, powerWakeupFromSemiSleep, AmplifierPowerStateChanged, DirectControlIsSuspended, VLI suspend sessions |
| `ab_experiments` | **vocab** | ZoneExperiment framework in production firmware: /experiments endpoint, ZoneExperiment id/name/value/defaultValue elements |
| `chirp_stack` | **vocab** | chirp-core/chirp-private acoustic codec (encoder/decoder/voter, CDMA+FSK profiles) driving RoomDetection chirps and trueplay discovery |
| `cloud_queue` | **vocab** | /cloudqueue(+poll), trackQueueAdditions, CloudQueueHistory, rating gating; lifecycle undocumented |
| `embedded_sqlite` | **vocab** | libsqlite3 linked; local timers persist via sqlite3 statements; tables undocumented |
| `entitlements` | **vocab** | entitlementsmanager + entitlementsVersionChanged + /entitlements/api; what an entitlement gates unknown |
| `factory_reset` | **vocab** | factoryReset.txt sentinel, sonosFactoryResetFull, LED_MODE_FACTORY_RESET, remote management/factoryReset muse route |
| `log_domain_map` | **vocab** | 21 anacapa.*.log domains = subsystem boundary map (avt.play, chsrc.state, dc, gm.events, ht, muse*, snf, sps, trueplay, vl...) |
| `media_player_abstraction` | **vocab** | media_player_mgr/autoplay/vli_ctrl + extaudiosrc/ai_impl_base plug-in layer under AVT sources; vtable map undocumented |
| `model_sku_vocabulary` | **vocab** | ZPS9-ZPS61 / S0-S9 model ids + product names embedded for capability conditionals; model->capability map untabulated |
| `muse_semantics` | **vocab** | 282 cloud routes catalogued; per-route request/response schemas and auth undocumented |
| `playlist_parsers` | **vocab** | ASX (mswmext), M3U (x-mpegurl), vnd.apple.mpegurl, DASH metadata parsers below the URI layer |
| `qplay_protocol` | **vocab** | only QPlayAuth SOAP action documented; the wider Tencent protocol (key derivation, control channel) is not |
| `runtime_flag_files` | **vocab** | /tmp + /var/run flag-file semantics: device_unlocked_flag, brokendevice, wifidisabled, crashed_play_state, event_preserve, memorylog ring, wac_mode, netmanager_extender_flags |
| `spotify_esdk` | **vocab** | embedded libspotify (mercury/hermes AP stack) + Sonos bridge modules + mDNS Connect discovery; names catalogued, protocol internals not |
| `wac_mode` | **vocab** | WiFi Accessory Config setup mode (wacd, /var/run/wac_mode, WAC mode enabled/timeout) |
| `account_cert_lifecycle` | **partial** | certmanager/devicecertmanager/regdevicecert/cloudregistration endpoints catalogued; enrolment/renewal flows and cert formats not |
| `audio_taps` | **partial** | PCM-capture tap subsystem (audiotap_manager.cxx + datatap.cxx): guarded /audio_tap /spdiftap /snapshotspdiftap /downloadspdiftap endpoints, versioned tap-file format with audio+metadata sections, SPDIF tap used to sync TV-input playback against the output tap |
| `buttons_ir` | **partial** | button + IR input pipeline: hw-message BUTTON multicast group carries events, longpress.cxx handles holds, events forward to the group coordinator ('Forwarding button events'), /button_triggered\[.xml\] diagnostic capture, /rdmbuttonfwd retail hook, virtualRemoteControl/buttonCommand muse route injects button presses from the cloud; irdecoder.cxx learns TV-remote codes against the ir.ws.sonos.com database |
| `dsp_ht_engine` | **partial** | home-theatre DSP parameter surface + per-zone audio state schemas fully recovered: HT config XML (surround/sub/downmix/dialog/AI-speech/height levels, autoplay/autostop thresholds, Tweaks bitmask), 37-field per-Zone audio XML, zone volume/duck XML; R_MASK_* speaker layouts enumerate supported channel masks |
| `favourites_model` | **partial** | Sonos favourites store + ContentDirectory projection: FV:2 root container paired with FavoritesUpdateID; XML store schema recovered; mutation via CDS CreateObject/UpdateObject/DestroyObject on the dirObjFavorites vtable + muse getFavorites/loadFavorite routes |
| `feature_flag_registry` | **partial** | feature flags are JSON keys in the settings/cloud config document (featureConfig sits in the same key table as entitlementsList/eqSettings/ethernetPorts/favoritesList/geoLocation/getUsersResponse) — cloud-delivered, not compile-time; 10 featureConfig* subkeys enumerate the gated feature set |
| `group_object_model` | **partial** | group.cxx/group_playeronly/group_locationandplayer + play_state_mgr + zones_mgr/zones_storage internals behind ZGT |
| `lechmere_wss` | **partial** | RFC6455+TLV framing confirmed; full WSS command vocabulary, reconnect/auth, per-namespace payloads not |
| `led_engine` | **partial** | Scripted LED animation engine: <LedPatternInfo> docs hold <LedPatternEntry time led_ids repeats steps> programs of <LedStepEntry rgb hold fade> steps, serialized with cksum+flags; R_LED_* codes select the default pattern; SetLEDState toggles the user-visible on/off only |
| `multi_daemon_boundary` | **partial** | anacapad coordinates ~13 sibling daemons over /X-external HTTP routes + /tmp/netstartd.ipc: netstartd gets netsettings/PSK pushes and satellite notifications, reports connection-type updates back; per-daemon crash machinery (.dmp/.properties/_backtrace/count files) and /opt/log sinks |
| `play_history` | **partial** | historymgr.cxx play-history pipeline: TrackPlayRecorder/TrackPlayMonitor capture plays, entries buffered and POSTed to the household history API with completeness gating + buffer-full drops; getHistory is ETag-cached; deleteHistory/removeHistoryItem/clearHistory ops; ratings via playbackMetadata/ratings — explicitly 'only implemented for cloud queue' |
| `queue_persistence` | **partial** | .rsq on-disk queue format: savedqueues.rsq is a <SavedQueues LastUpdateDevice Version Next> XML doc of <SavedQueue Id Curated NumTracks> elements each holding <Track URI= MD=> entries; live queue persists as trackqueue.rsq; atomic write via .tmp rename + .d.rsq backup; validated at boot and on replication receipt |
| `scrobbler` | **partial** | Audioscrobbler/Last.fm submission client implementing protocol 1.2 over raw sockets: GET handshake to post.audioscrobbler.com, form-encoded scrobble POSTs, BADTIME Date-header recovery, OK-response check; also embeds ws.audioscrobbler.com/2.0 for the newer API |
| `settings_replication` | **partial** | replicated_settings.cxx household sync protocol: per-setting replicateOne transfers with version+format handshake ('deciding whether to accept replicated list from: %s; ver: %u format: %u'), <Replication>/<ReplicationOperation>/<ReplicationResult>/<ReplicationPlayer>/<ReplicationTime> reporting XML, denylist + quarantine for bad formats/encodings, REPLICATION_IN_PROGRESS/COMPLETE states, distinct account/netsettings/favourites/savedqueue/areas streams |
| `sntp_server` | **partial** | Dual-mode SNTP stack (sntp.cxx client + sntpsrv.cxx server + sntppoll.cxx poller): players sync from *.sonostime.pool.ntp.org or the group coordinator, one player hosts an SNTP server for the household ('Starting SNTP server switch'), and SNTP validity gates synchronized playback scheduling |
| `telemetry_submission` | **partial** | telemetry/diagnostics uplink: 'Telemetry 1.0 Event field' format, X-Sonos-MessageType: product-data-telemetry header, zonereportmgr.cxx zone reports, submitDiagnostics/submitQueuedDiagnostic pipeline with manifest submission, positioning telemetry level route, per-feature telemetry flags |
| `trueplay_tuning` | **partial** | SOAP enable/status documented; measurement, etag asset sync, presence discovery and the tuning FSM not |
| `update_machinery` | **partial** | manifest-driven update pipeline: update_manifest carries a base update URL + per-device target rows (udn, model, submodel, swgen, ver, URI, updateID) and a min auto-update version; user updates run manifest-download -> checkDevicesToUpdate -> launchUpdate; auto-update policy gated by R_AutoUpdatePolicy + R_CheckUpdateInterval + R_AutoUpdateWindowStart + autoUpdatesEnabled |

## `business_msp`

**coverage** `absent`

Sonos Business managed-service-provider hooks (AddRemove/Sync Sonos Business MSP)

- binary anchors: `AddRemoveSonosBusinessMSP`, `Sync Sonos Business MSP`

<details><summary>Evidence (2)</summary>

- @ 0x10e749a4 — AddRemoveSonosBusinessMSP
- @ 0x10e74e7c — Sync Sonos Business MSP

</details>

## `ibt_plans`

**coverage** `absent`

IBT command plan-execution engine ('executing ibt plan for command') + enablePitchfork feature flag

- binary anchors: `executing ibt plan for command`, `unsupported IBT command`, `enablePitchfork`

<details><summary>Evidence (3)</summary>

- @ 0x10fac64c — executing ibt plan for command
- @ 0x10ec7903 — unsupported IBT command
- @ 0x10f9c2b4 — enablePitchfork

</details>

## `semisleep_power`

**coverage** `absent`

suspend/resume engine: enableSemiSleep, powerWakeupFromSemiSleep, AmplifierPowerStateChanged, DirectControlIsSuspended, VLI suspend sessions

- binary anchors: `enableSemiSleep`, `featureConfigSemiSleep`, `powerWakeupFromSemiSleep`, `DirectControlIsSuspended`

<details><summary>Evidence (4)</summary>

- @ 0x10e86d24 — enableSemiSleep
- @ 0x10f97b58 — featureConfigSemiSleep
- @ 0x10e86c60 — powerWakeupFromSemiSleep
- @ 0x10eb2c7b — DirectControlIsSuspended

</details>

## `ab_experiments`

**coverage** `vocab`

ZoneExperiment framework in production firmware: /experiments endpoint, ZoneExperiment id/name/value/defaultValue elements

- binary anchors: `<ZoneExperiment`, `/experiments`, `experimentId`

<details><summary>Evidence (3)</summary>

- @ 0x10ef3d0d — <ZoneExperiment
- @ 0x10e75d30 — /experiments
- @ 0x10f9c96c — experimentId

</details>

## `chirp_stack`

**coverage** `vocab`

chirp-core/chirp-private acoustic codec (encoder/decoder/voter, CDMA+FSK profiles) driving RoomDetection chirps and trueplay discovery

- binary anchors: `chirp_private_cdma.c`, `protocol-acoustic.c`

<details><summary>Evidence (2)</summary>

- @ 0x10fd2948 — chirp_private_cdma.c
- @ 0x10fd0c49 — protocol-acoustic.c

</details>

## `cloud_queue`

**coverage** `vocab`

/cloudqueue(+poll), trackQueueAdditions, CloudQueueHistory, rating gating; lifecycle undocumented

- binary anchors: `/cloudqueue`, `trackQueueAdditions`, `CloudQueueHistory`

<details><summary>Evidence (3)</summary>

- @ 0x10e75cc4 — /cloudqueue
- @ 0x10e93ddf — trackQueueAdditions
- @ 0x10eb98d0 — CloudQueueHistory

</details>

## `embedded_sqlite`

**coverage** `vocab`

libsqlite3 linked; local timers persist via sqlite3 statements; tables undocumented

- binary anchors: `sqlite3_exec`, `LocalTimer from sqlite3`

<details><summary>Evidence (2)</summary>

- @ 0x1006282c — sqlite3_exec
- @ 0x10edd644 — LocalTimer from sqlite3

</details>

## `entitlements`

**coverage** `vocab`

entitlementsmanager + entitlementsVersionChanged + /entitlements/api; what an entitlement gates unknown

- binary anchors: `entitlementsmanager.cxx`, `entitlementsVersionChanged`, `/entitlements/api`

<details><summary>Evidence (3)</summary>

- @ 0x10ebfa1a — entitlementsmanager.cxx
- @ 0x10f9630c — entitlementsVersionChanged
- @ 0x10ebf908 — /entitlements/api

</details>

## `factory_reset`

**coverage** `vocab`

factoryReset.txt sentinel, sonosFactoryResetFull, LED_MODE_FACTORY_RESET, remote management/factoryReset muse route

- binary anchors: `factoryReset.txt`, `sonosFactoryResetFull`, `management/factoryReset`

<details><summary>Evidence (3)</summary>

- @ 0x10ef824c — factoryReset.txt
- @ 0x10062b81 — sonosFactoryResetFull
- @ 0x10e7f07e — management/factoryReset

</details>

## `log_domain_map`

**coverage** `vocab`

21 anacapa.*.log domains = subsystem boundary map (avt.play, chsrc.state, dc, gm.events, ht, muse*, snf, sps, trueplay, vl...)

- binary anchors: `anacapa.snf.log`, `anacapa.lechmere.event.log`, `anacapa.dc.log`

<details><summary>Evidence (3)</summary>

- @ 0x10e755e1 — anacapa.snf.log
- @ 0x10e75539 — anacapa.lechmere.event.log
- @ 0x10e754a1 — anacapa.dc.log

</details>

## `media_player_abstraction`

**coverage** `vocab`

media_player_mgr/autoplay/vli_ctrl + extaudiosrc/ai_impl_base plug-in layer under AVT sources; vtable map undocumented

- binary anchors: `media_player_mgr.cxx`, `extaudiosrc.cxx`, `ai_impl_base.cxx`

<details><summary>Evidence (3)</summary>

- @ 0x10ecb98a — media_player_mgr.cxx
- @ 0x10ec01ea — extaudiosrc.cxx
- @ 0x10eacdc2 — ai_impl_base.cxx

</details>

## `model_sku_vocabulary`

**coverage** `vocab`

ZPS9-ZPS61 / S0-S9 model ids + product names embedded for capability conditionals; model->capability map untabulated

- binary anchors: `ZPS9`, `HwFeatures`

<details><summary>Evidence (2)</summary>

- @ 0x10f249a4 — ZPS9
- @ 0x10e741dd — HwFeatures

</details>

## `muse_semantics`

**coverage** `vocab`

282 cloud routes catalogued; per-route request/response schemas and auth undocumented

- binary anchors: `v1/households/{householdId}`, `muse_async_command_handler_impl.cxx`

<details><summary>Evidence (2)</summary>

- @ 0x10e7bf40 — v1/households/{householdId}
- @ 0x10ef9166 — muse_async_command_handler_impl.cxx

</details>

## `playlist_parsers`

**coverage** `vocab`

ASX (mswmext), M3U (x-mpegurl), vnd.apple.mpegurl, DASH metadata parsers below the URI layer

- binary anchors: `mswmext=.asx`, `application/x-mpegurl`, `application/dash+xml`

<details><summary>Evidence (3)</summary>

- @ 0x10ed693c — mswmext=.asx
- @ 0x10eb8946 — application/x-mpegurl
- @ 0x10eb89e8 — application/dash+xml

</details>

## `qplay_protocol`

**coverage** `vocab`

only QPlayAuth SOAP action documented; the wider Tencent protocol (key derivation, control channel) is not

- binary anchors: `urn:schemas-tencent-com:service:QPlay`, `QPlayAuth`

<details><summary>Evidence (1)</summary>

- @ 0x10f11d58 — QPlayAuth

</details>

## `runtime_flag_files`

**coverage** `vocab`

/tmp + /var/run flag-file semantics: device_unlocked_flag, brokendevice, wifidisabled, crashed_play_state, event_preserve, memorylog ring, wac_mode, netmanager_extender_flags

- binary anchors: `/tmp/device_unlocked_flag`, `/tmp/brokendevice`, `/tmp/memorylog`

<details><summary>Evidence (3)</summary>

- @ 0x10efff88 — /tmp/device_unlocked_flag
- @ 0x10ef4e9c — /tmp/brokendevice
- @ 0x10e75afc — /tmp/memorylog

</details>

## `spotify_esdk`

**coverage** `vocab`

embedded libspotify (mercury/hermes AP stack) + Sonos bridge modules + mDNS Connect discovery; names catalogued, protocol internals not

- binary anchors: `spotify_esdk.c`, `hermes.c`, `mdns_spotify_service.cxx`, `/spotifyzc`

<details><summary>Evidence (4)</summary>

- @ 0x10fd4cb8 — spotify_esdk.c
- @ 0x10fe4128 — hermes.c
- @ 0x10ee4eb2 — mdns_spotify_service.cxx
- @ 0x10e765a4 — /spotifyzc

</details>

## `wac_mode`

**coverage** `vocab`

WiFi Accessory Config setup mode (wacd, /var/run/wac_mode, WAC mode enabled/timeout)

- binary anchors: `wacd.log`, `WAC mode enabled`

<details><summary>Evidence (2)</summary>

- @ 0x10e7573d — wacd.log
- @ 0x10f02dc8 — WAC mode enabled

</details>

## `account_cert_lifecycle`

**coverage** `partial`

certmanager/devicecertmanager/regdevicecert/cloudregistration endpoints catalogued; enrolment/renewal flows and cert formats not

- binary anchors: `devicecertmanager.cxx`, `regdevicecert.cxx`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE`

<details><summary>Evidence (3)</summary>

- @ 0x10ef220e — devicecertmanager.cxx
- @ 0x10efc8e6 — regdevicecert.cxx
- @ 0x10eef0d1 — R_CLIENT_KEYCERT_ID_SONOS_DEVICE

</details>

## `audio_taps`

**coverage** `partial`

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

## `buttons_ir`

**coverage** `partial`

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

## `dsp_ht_engine`

**coverage** `partial`

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

## `favourites_model`

**coverage** `partial`

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

feature flags are JSON keys in the settings/cloud config document (featureConfig sits in the same key table as entitlementsList/eqSettings/ethernetPorts/favoritesList/geoLocation/getUsersResponse) — cloud-delivered, not compile-time; 10 featureConfig* subkeys enumerate the gated feature set

- binary anchors: `featureConfigPlink`, `featureConfigSmartPlay`, `featureConfigQuickbonding`, `featureConfigZoneExperiment`, `<ZoneExperiment id=`, `/experiments`

- **mechanism:** 'featureConfig' parent key with per-feature subkeys; ZoneExperiment layer adds <ZoneExperiments><ZoneExperiment id name value defaultValue> docs + /experiments HTTP endpoint + O_ZONE_EXPERIMENTS config key + experimentId field — A/B values carry explicit defaults so absent assignment falls back to defaultValue
- **flags:**
- **unresolved:** which config file/route carries featureConfig (householdsettings.json? muse?), per-flag gate sites
<details><summary>Evidence (5)</summary>

- @ 0x10f97b28 — featureConfigPlink
- @ 0x10f97b70 — featureConfigSmartPlay
- @ 0x10f97b3c — featureConfigQuickbonding
- @ 0x10f97ab4 — featureConfig + 10 subkeys in JSON key table
- @ 0x10ef3d34 — <ZoneExperiment id name value defaultValue> schema

</details>

## `group_object_model`

**coverage** `partial`

group.cxx/group_playeronly/group_locationandplayer + play_state_mgr + zones_mgr/zones_storage internals behind ZGT

- binary anchors: `play_state_mgr.cxx`, `zones_storage.cxx`, `/jffs/settings/zones.json`

<details><summary>Evidence (3)</summary>

- @ 0x10ed15f2 — play_state_mgr.cxx
- @ 0x10e96cc6 — zones_storage.cxx
- @ 0x10e752e0 — /jffs/settings/zones.json

</details>

## `lechmere_wss`

**coverage** `partial`

RFC6455+TLV framing confirmed; full WSS command vocabulary, reconnect/auth, per-namespace payloads not

- binary anchors: `websocket_lechmere`, `lechmere.event`

<details><summary>Evidence (1)</summary>

- @ 0x10e75541 — lechmere.event

</details>

## `led_engine`

**coverage** `partial`

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

## `multi_daemon_boundary`

**coverage** `partial`

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

## `play_history`

**coverage** `partial`

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

## `queue_persistence`

**coverage** `partial`

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

## `scrobbler`

**coverage** `partial`

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

## `settings_replication`

**coverage** `partial`

replicated_settings.cxx household sync protocol: per-setting replicateOne transfers with version+format handshake ('deciding whether to accept replicated list from: %s; ver: %u format: %u'), <Replication>/<ReplicationOperation>/<ReplicationResult>/<ReplicationPlayer>/<ReplicationTime> reporting XML, denylist + quarantine for bad formats/encodings, REPLICATION_IN_PROGRESS/COMPLETE states, distinct account/netsettings/favourites/savedqueue/areas streams

- binary anchors: `replicated_settings.cxx`, `<ReplicationOperation`, `NextFavorite`, `<ReplicatedNetSettings`, `replicateOne from %s to %s`, `X-Sonos-Denylisted`, `REPLICATION_IN_PROGRESS`

- **envelope:** <Replication><ReplicationOperation>%s</..><ReplicationResult>%d</..><ReplicationPlayer>%s</..><ReplicationTime>%s</..></Replication></AccountsInfo>
- **negotiation:** 'replication skipped: local fmt %u, remote fmt %u' — format-version handshake per store; 'ignoring replicated file: incompatible schema'
- **failure_taxonomy:** denylisted setting / badFormat / badEncoding / bad algorithm / bad version / bad version+last-update-id / temp file failure — offenders denylisted ('denylisting replicated setting %u, unknown or blocked', 'Denylisted pyle!'), peers quarantined via <QuarantinedDevices> + X-Sonos-Denylisted header
- **streams:** accounts (musicAccountReplicationPush/Pull + tombstone migration), netsettings (<ReplicatedNetSettings LastUpdateDevice Version FileSchemaVersion>), favourites, savedqueues, areas (replicatedAreas), TV channel ('TvPreplicating %zu bytes for resourceId: %u')
- **events:** ReplicatedSettingsChangedEvent, ReplicatedSettingsNeedsUpdateEvent, ReplicatedSettingsState, SettingsReplicationState; entry points informReplicationAndNotify\[+ForDestroy\], informLocalReplicatedSettingVersion, informReplicatedSettingsChange; 'Not replicating while unregistered'
<details><summary>Evidence (6)</summary>

- @ 0x10efd14e — replicated_settings.cxx
- @ 0x10eacbb0 — <ReplicationOperation
- @ 0x10ec0ce2 — NextFavorite
- @ 0x10efd374 — replicateOne from %s to %s setting %u version %u
- @ 0x10efad64 — <ReplicatedNetSettings LastUpdateDevice Version FileSchemaVersion>
- @ 0x10efd4b0 — denylist failure taxonomy strings

</details>

## `sntp_server`

**coverage** `partial`

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

## `telemetry_submission`

**coverage** `partial`

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

## `trueplay_tuning`

**coverage** `partial`

SOAP enable/status documented; measurement, etag asset sync, presence discovery and the tuning FSM not

- binary anchors: `trueplay-node`, `/trueplayinfo`, `SelfTrueplayEQ`

<details><summary>Evidence (3)</summary>

- @ 0x10ebda88 — trueplay-node
- @ 0x10e75f08 — /trueplayinfo
- @ 0x10fee999 — SelfTrueplayEQ

</details>

## `update_machinery`

**coverage** `partial`

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
