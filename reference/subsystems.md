# Non-SOAP subsystems

Self-contained protocols/engines living in the same binary beside or below the UPnP layer. `absent` = no coverage, `vocab` = names/strings catalogued but semantics undecoded, `partial` = some real documentation exists. Evidence addresses are the rodata anchor strings.

| Subsystem | Coverage | Summary |
|---|---|---|
| `business_msp` | **absent** | Sonos Business managed-service-provider hooks (AddRemove/Sync Sonos Business MSP) |
| `ibt_plans` | **absent** | IBT command plan-execution engine ('executing ibt plan for command') + enablePitchfork feature flag |
| `led_engine` | **absent** | scripted LED animation programs + full R_LED_* state vocabulary; SetLEDState on/off only documented surface |
| `queue_persistence` | **absent** | .rsq on-disk format: savedqueues.rsq + trackqueue.rsq XML schemas, .d.rsq backup, atomic .tmp rename |
| `scrobbler` | **absent** | audioscrobbler/Last.fm submission client in the streamer layer — handshake, submission format and trigger policy undocumented |
| `semisleep_power` | **absent** | suspend/resume engine: enableSemiSleep, powerWakeupFromSemiSleep, AmplifierPowerStateChanged, DirectControlIsSuspended, VLI suspend sessions |
| `ab_experiments` | **vocab** | ZoneExperiment framework in production firmware: /experiments endpoint, ZoneExperiment id/name/value/defaultValue elements |
| `audio_taps` | **vocab** | audiotap/datatap/spdiftap PCM capture + /snapshotspdiftap /downloadspdiftap endpoints |
| `chirp_stack` | **vocab** | chirp-core/chirp-private acoustic codec (encoder/decoder/voter, CDMA+FSK profiles) driving RoomDetection chirps and trueplay discovery |
| `cloud_queue` | **vocab** | /cloudqueue(+poll), trackQueueAdditions, CloudQueueHistory, rating gating; lifecycle undocumented |
| `dsp_ht_engine` | **vocab** | home-theater DSP parameter surface (SubCrossover, InvertSub, DialogEnhancementLevel, AISpeechEnhance, HeightChannelLevel, Tweaks bitmask, lip-sync AudioDelay*) + zone audio-state XML schema + R_MASK_* layouts |
| `embedded_sqlite` | **vocab** | libsqlite3 linked; local timers persist via sqlite3 statements; tables undocumented |
| `entitlements` | **vocab** | entitlementsmanager + entitlementsVersionChanged + /entitlements/api; what an entitlement gates unknown |
| `factory_reset` | **vocab** | factoryReset.txt sentinel, sonosFactoryResetFull, LED_MODE_FACTORY_RESET, remote management/factoryReset muse route |
| `favourites_model` | **vocab** | FV: grammar + GC variants documented; enumerate/mutate path, favourites↔muse sync, NextFavorite sequencing not |
| `feature_flag_registry` | **vocab** | featureConfig* flags enumerate the gated feature set: DropoutContext, HomeTheaterWifiPerfTelemetry, MetricsService, Plink, Quickbonding, SemiSleep, SmartPlay, SpotABR, SsdpAdvertiseConfig, ZoneExperiment |
| `log_domain_map` | **vocab** | 21 anacapa.*.log domains = subsystem boundary map (avt.play, chsrc.state, dc, gm.events, ht, muse*, snf, sps, trueplay, vl...) |
| `media_player_abstraction` | **vocab** | media_player_mgr/autoplay/vli_ctrl + extaudiosrc/ai_impl_base plug-in layer under AVT sources; vtable map undocumented |
| `model_sku_vocabulary` | **vocab** | ZPS9-ZPS61 / S0-S9 model ids + product names embedded for capability conditionals; model->capability map untabulated |
| `multi_daemon_boundary` | **vocab** | anacapad is one of ~13 daemons (btmanager, wacd, netstartd, sonosledmgrd, sonospowercoordinator, mdnsd, sddpd, chronyd, dropbear, udhcpc, wpa_supplicant, upgrade_mgr); /X-external routes are the IPC contracts |
| `muse_semantics` | **vocab** | 282 cloud routes catalogued; per-route request/response schemas and auth undocumented |
| `play_history` | **vocab** | historymgr + History/RestHistory/WebSocketHistory/CloudQueueHistory XML types + deleteHistory cloud op + rating gating |
| `playlist_parsers` | **vocab** | ASX (mswmext), M3U (x-mpegurl), vnd.apple.mpegurl, DASH metadata parsers below the URI layer |
| `qplay_protocol` | **vocab** | only QPlayAuth SOAP action documented; the wider Tencent protocol (key derivation, control channel) is not |
| `runtime_flag_files` | **vocab** | /tmp + /var/run flag-file semantics: device_unlocked_flag, brokendevice, wifidisabled, crashed_play_state, event_preserve, memorylog ring, wac_mode, netmanager_extender_flags |
| `settings_replication` | **vocab** | replicated_settings store inventory known; merge/version-vector/dissemination protocol + Replication* wire elements not |
| `sntp_server` | **vocab** | player-hosted SNTP server for household time (sntpsrv + sntppoll); role/topology unknown |
| `spotify_esdk` | **vocab** | embedded libspotify (mercury/hermes AP stack) + Sonos bridge modules + mDNS Connect discovery; names catalogued, protocol internals not |
| `wac_mode` | **vocab** | WiFi Accessory Config setup mode (wacd, /var/run/wac_mode, WAC mode enabled/timeout) |
| `account_cert_lifecycle` | **partial** | certmanager/devicecertmanager/regdevicecert/cloudregistration endpoints catalogued; enrolment/renewal flows and cert formats not |
| `buttons_ir` | **partial** | longpress gesture detection + irdecoder + irconfig.txt; HTControl SOAP surface documented, mechanics not |
| `group_object_model` | **partial** | group.cxx/group_playeronly/group_locationandplayer + play_state_mgr + zones_mgr/zones_storage internals behind ZGT |
| `lechmere_wss` | **partial** | RFC6455+TLV framing confirmed; full WSS command vocabulary, reconnect/auth, per-namespace payloads not |
| `telemetry_submission` | **partial** | reportuploader/usagedatasharing/zonereportmgr + submission queue + dropout/trackplay recorders + zpMetricsConfigV2; SubmitDiagnostics SOAP documented, periodic machinery not |
| `trueplay_tuning` | **partial** | SOAP enable/status documented; measurement, etag asset sync, presence discovery and the tuning FSM not |
| `update_machinery` | **partial** | BeginSoftwareUpdate documented; auto_update_scheduler, user_update_scheduler, migrationmanager, /softwareDownload, /testenv update-URL override not |

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

## `led_engine`

**coverage** `absent`

scripted LED animation programs + full R_LED_* state vocabulary; SetLEDState on/off only documented surface

- binary anchors: `<LedStepEntry`, `R_LED_BEGIN_SETUP_MODE`, `/jffs/app/debug/sonosledmgrd.dmp`

<details><summary>Evidence (3)</summary>

- @ 0x10e990a0 — <LedStepEntry
- @ 0x10fbb0a5 — R_LED_BEGIN_SETUP_MODE
- @ 0x10ea7f34 — /jffs/app/debug/sonosledmgrd.dmp

</details>

## `queue_persistence`

**coverage** `absent`

.rsq on-disk format: savedqueues.rsq + trackqueue.rsq XML schemas, .d.rsq backup, atomic .tmp rename

- binary anchors: `savedqueues.rsq`, `<SavedQueues`, `trackqueue.rsq`

<details><summary>Evidence (3)</summary>

- @ 0x10ed3104 — savedqueues.rsq
- @ 0x10ed3164 — <SavedQueues
- @ 0x10e93f98 — trackqueue.rsq

</details>

## `scrobbler`

**coverage** `absent`

audioscrobbler/Last.fm submission client in the streamer layer — handshake, submission format and trigger policy undocumented

- binary anchors: `http://post.audioscrobbler.com/`, `https://ws.audioscrobbler.com/2.0/`, `scrobbling submission %s`, `last.fm-radio-http`

<details><summary>Evidence (4)</summary>

- @ 0x10ee4c18 — http://post.audioscrobbler.com/
- @ 0x10f0e118 — https://ws.audioscrobbler.com/2.0/
- @ 0x10ee4d64 — scrobbling submission %s
- @ 0x10eccfcc — last.fm-radio-http

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

## `audio_taps`

**coverage** `vocab`

audiotap/datatap/spdiftap PCM capture + /snapshotspdiftap /downloadspdiftap endpoints

- binary anchors: `audiotap_manager.cxx`, `spdiftap.c`, `/downloadspdiftap`

<details><summary>Evidence (3)</summary>

- @ 0x10feb6e7 — audiotap_manager.cxx
- @ 0x10e738c4 — spdiftap.c
- @ 0x10e76568 — /downloadspdiftap

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

## `dsp_ht_engine`

**coverage** `vocab`

home-theater DSP parameter surface (SubCrossover, InvertSub, DialogEnhancementLevel, AISpeechEnhance, HeightChannelLevel, Tweaks bitmask, lip-sync AudioDelay*) + zone audio-state XML schema + R_MASK_* layouts

- binary anchors: `SubCrossover`, `DialogEnhancementLevel`, `AISpeechEnhance`, `/htconfig`, `R_MASK_NINE_DOT_ONE_DOT_FOUR`

<details><summary>Evidence (5)</summary>

- @ 0x10e878fc — SubCrossover
- @ 0x10f25449 — DialogEnhancementLevel
- @ 0x10f254a7 — AISpeechEnhance
- @ 0x10e75d58 — /htconfig
- @ 0x10fbedfa — R_MASK_NINE_DOT_ONE_DOT_FOUR

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

## `favourites_model`

**coverage** `vocab`

FV: grammar + GC variants documented; enumerate/mutate path, favourites↔muse sync, NextFavorite sequencing not

- binary anchors: `favorites.cxx`, `NextFavorite`, `sonos_favorites_version`

<details><summary>Evidence (2)</summary>

- @ 0x10ec12ca — favorites.cxx
- @ 0x10ec0ce2 — NextFavorite

</details>

## `feature_flag_registry`

**coverage** `vocab`

featureConfig* flags enumerate the gated feature set: DropoutContext, HomeTheaterWifiPerfTelemetry, MetricsService, Plink, Quickbonding, SemiSleep, SmartPlay, SpotABR, SsdpAdvertiseConfig, ZoneExperiment

- binary anchors: `featureConfigPlink`, `featureConfigSmartPlay`, `featureConfigQuickbonding`

<details><summary>Evidence (3)</summary>

- @ 0x10f97b28 — featureConfigPlink
- @ 0x10f97b70 — featureConfigSmartPlay
- @ 0x10f97b3c — featureConfigQuickbonding

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

## `multi_daemon_boundary`

**coverage** `vocab`

anacapad is one of ~13 daemons (btmanager, wacd, netstartd, sonosledmgrd, sonospowercoordinator, mdnsd, sddpd, chronyd, dropbear, udhcpc, wpa_supplicant, upgrade_mgr); /X-external routes are the IPC contracts

- binary anchors: `/btmanager-external`, `/netstartd-external`, `wacd.log`, `sddpd.log`

<details><summary>Evidence (4)</summary>

- @ 0x10ea7f20 — /btmanager-external
- @ 0x10ea7f70 — /netstartd-external
- @ 0x10e7573d — wacd.log
- @ 0x10e756f9 — sddpd.log

</details>

## `muse_semantics`

**coverage** `vocab`

282 cloud routes catalogued; per-route request/response schemas and auth undocumented

- binary anchors: `v1/households/{householdId}`, `muse_async_command_handler_impl.cxx`

<details><summary>Evidence (2)</summary>

- @ 0x10e7bf40 — v1/households/{householdId}
- @ 0x10ef9166 — muse_async_command_handler_impl.cxx

</details>

## `play_history`

**coverage** `vocab`

historymgr + History/RestHistory/WebSocketHistory/CloudQueueHistory XML types + deleteHistory cloud op + rating gating

- binary anchors: `historymgr.cxx`, `<WebSocketHistory`, `deleteHistory`

<details><summary>Evidence (3)</summary>

- @ 0x10ec49da — historymgr.cxx
- @ 0x10f01174 — <WebSocketHistory
- @ 0x10ec4d68 — deleteHistory

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

## `settings_replication`

**coverage** `vocab`

replicated_settings store inventory known; merge/version-vector/dissemination protocol + Replication* wire elements not

- binary anchors: `replicated_settings.cxx`, `<ReplicationOperation`, `NextFavorite`

<details><summary>Evidence (3)</summary>

- @ 0x10efd14e — replicated_settings.cxx
- @ 0x10eacbb0 — <ReplicationOperation
- @ 0x10ec0ce2 — NextFavorite

</details>

## `sntp_server`

**coverage** `vocab`

player-hosted SNTP server for household time (sntpsrv + sntppoll); role/topology unknown

- binary anchors: `sntpsrv.cxx`, `handleSntpRequest`, `Created SNTP Server`

<details><summary>Evidence (3)</summary>

- @ 0x10ed6496 — sntpsrv.cxx
- @ 0x10ed62e8 — handleSntpRequest
- @ 0x10ed6418 — Created SNTP Server

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

## `buttons_ir`

**coverage** `partial`

longpress gesture detection + irdecoder + irconfig.txt; HTControl SOAP surface documented, mechanics not

- binary anchors: `longpress.cxx`, `irdecoder.cxx`, `/jffs/irconfig.txt`

<details><summary>Evidence (3)</summary>

- @ 0x10ec9b6e — longpress.cxx
- @ 0x10ea75fa — irdecoder.cxx
- @ 0x10e751e8 — /jffs/irconfig.txt

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

## `telemetry_submission`

**coverage** `partial`

reportuploader/usagedatasharing/zonereportmgr + submission queue + dropout/trackplay recorders + zpMetricsConfigV2; SubmitDiagnostics SOAP documented, periodic machinery not

- binary anchors: `reportuploader.cxx`, `trackplayrecorder.cxx`, `zpMetricsConfigV2.xml`, `diagnosticSubmissionResults`

<details><summary>Evidence (4)</summary>

- @ 0x10eeb50d — reportuploader.cxx
- @ 0x10ed877a — trackplayrecorder.cxx
- @ 0x10e7530b — zpMetricsConfigV2.xml
- @ 0x10f962bc — diagnosticSubmissionResults

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

BeginSoftwareUpdate documented; auto_update_scheduler, user_update_scheduler, migrationmanager, /softwareDownload, /testenv update-URL override not

- binary anchors: `auto_update_scheduler.cxx`, `migrationmanager.cxx`, `/softwareDownload`

<details><summary>Evidence (3)</summary>

- @ 0x10eae506 — auto_update_scheduler.cxx
- @ 0x10fafc18 — migrationmanager.cxx
- @ 0x10e82b39 — /softwareDownload

</details>
