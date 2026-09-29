# Firmware / model differences

String-set diff across anacapad 34.16 (fenway), 57.10 (fenway), 86.8-78270 (playbar model9), 86.10-80260 (documented build). Presence = literal exists in binary; literal storage/validation method may differ even when service is present.

- **matrix_method:** 4 binaries {34.16,57.10(fenway-public),86.8(playbar-model9),86.10(1-9)}; per advertised action-name check every literal instance for ptr-table/strcmp ref
- **crossbuild_matrix_artifact:** docs/crossbuild_matrix.json

## Product surface

PRODUCT comparison play1-model8 vs playbar-model9 vs 86.10-model9: all 3 ship the IDENTICAL 16-SCPD advertised surface (same action+statevar counts); sole content diff is the 86.10 A_ARG_TYPE_ClearSource addition. Sonos advertised API is hardware-uniform — product differentiation is binary/feature-gating level, not SCPD. play1-model8 additionally ships satellite_device.xml (device desc, not SCPD).

## Service-URN matrix

- **method:** regex scan of 'urn:...service:...' literals per build blob (confirmed counts)
- **matrix:**
  - **34.16:** 19 service URNs; includes urn:schemas-tencent-com:service:QPlay:1; NO VirtualLineIn URN; NO schemas-sonos-com ContentDirectory
  - **57.10:** 21 service URNs; ADDS urn:schemas-upnp-org:service:VirtualLineIn:1 and urn:schemas-sonos-com:service:ContentDirectory:1
  - **86.8pb:** QPlay URN dropped (20 URNs)
  - **86.10:** 20 service URNs; QPlay service-URN gone BUT QPlay persists: /QPlay/Control route live @0x11090da4, QPlayAuth(Seed,MID,DID) action table intact, device desc advertises <qq:X_QPlay_SoftwareCapability>QPlay:2</qq:X_QPlay_SoftwareCapability> (0x10ef8cc6) - service upgraded to QPlay:2 advertised via device capability, not a serviceType URN
- **action_presence_diffs:**
  - **added_57.10:** `EndDirectControlSession`, `GetButtonLockState`, `SetButtonLockState`, `SetSourceAreaIds`
  - **added_86.8:** `RoomDetectionStartChirping`, `RoomDetectionStopChirping`
  - **note:** all 193 other documented action names present verbatim in all four builds; no documented action was found removed
- **status:** confirmed
- **qplay_evolution:** 34.16/57.10: urn:schemas-tencent-com:service:QPlay:1 as a serviceType URN. 86.8/86.10: URN removed; QPlay:2 advertised via qq:X_QPlay_SoftwareCapability in the device description; /QPlay/Control + QPlayAuth dispatch retained

## Entries

### QPlay service URN literal

urn:schemas-tencent-com:service:QPlay:1 present in 34.16/57.10, ABSENT in 86.x - but /QPlay/Control route, QPlayAuth action and X_QPlay_SoftwareCapability remain in all builds. 86.x matches QPlay by route-path/action rather than full-URN literal - URN validation relaxed/changed

| Build | State |
|---|---|
| `34.16` | present |
| `57.10` | present |
| `86.8` | URN absent/route present |
| `86.10` | URN absent/route present |

### VirtualLineIn service

urn:schemas-upnp-org:service:VirtualLineIn:1 absent in 34.16; present 57.10+ with /MediaRenderer/VirtualLineIn/{Control,Event} routes

| Build | State |
|---|---|
| `34.16` | absent |
| `57.10` | added |
| `86.8` | present |
| `86.10` | present |

### sonos-com ContentDirectory namespace

urn:schemas-sonos-com:service:ContentDirectory:1 absent in 34.16; added 57.10+ alongside the upnp-org URN

| Build | State |
|---|---|
| `34.16` | absent |
| `57.10` | added |
| `86.x` | present |

### /status/opt/log/mdnsd.log

status endpoint added after 34.16

| Build | State |
|---|---|
| `34.16` | absent |
| `57.10+` | present |

### /device_account registration subroutes

/device_account/registration{,/id,/state,/status} literals only in 34.16; 86.10 retains single /device_account handler (f_1065bd70)

| Build | State |
|---|---|
| `34.16` | 4 subroutes |
| `57.10+` | removed |

### /api route

'/api' in 34.16/57.10, '/api/v0/capture' in 57.10, '/api/' provider-root in 86.x - API surface moved to provider-registry model

| Build | State |
|---|---|
| `34.16` | /api |
| `57.10` | /api + /api/v0/capture |
| `86.x` | /api/ + provider registry |

### FV token grammar

'FV:3'/'FV:3/%s' fixed-version literals in <=57.10; parameterized 'FV:%zu' plus 'FV:GC'/'FV:GC-HB' in 57.10+ (GC group-coordinator variants introduced)

| Build | State |
|---|---|
| `34.16` | FV:3, FV:3/%s |
| `57.10` | FV:%zu, FV:GC, FV:GC-HB |
| `86.x` | same as 57.10 |

### x-sonos-* header set

x-sonos-action/x-sonos-dock/x-sonos-starttime only in <=57.10 (removed); x-sonos-upnp-loopback-token/x-sonos-upnp-tunnel/insecureUpnpAllowed/x-sonos-target-udn only in 86.x (added: loopback auth + UDN targeting + insecure-mode gate)

| Build | State |
|---|---|
| `<=57.10` | legacy headers |
| `86.x` | loopback-tunnel model |

### x-sonosapi-iqradio scheme

x-sonosapi-iqradio:* and x-sonosapi-iqradioinst:* only in 34.16 - iQR radio service scheme removed in 57.10+

| Build | State |
|---|---|
| `34.16` | present |
| `57.10+` | removed |

### x-rincon-stream / x-sonosapi-show / trueroom

x-rincon-stream:%s:%s, x-sonosapi-show:, x-rincon-trueroom:, x-rincon-sonarcal:complete_ht.ogg, testtone.ogg only in 86.x; 34.16/57.10 had x-rincon-stream:WAV and sonarcal complete.ogg/testtone.flac variants

| Build | State |
|---|---|
| `<=57.10` | WAV/flac variants |
| `86.x` | trueplay/show/scheme set |

### x-rincon-enc2

x-rincon-enc2 scheme literal only in playbar-model9 86.8 - model-specific encrypted-stream variant

| Build | State |
|---|---|
| `86.8-playbar9` | present |
| `86.10` | absent |

### explicitContentFiltering config key

config-key literal added in 57.10 (f_106bb20c handler family)

| Build | State |
|---|---|
| `34.16` | absent |
| `57.10+` | present |

### int_setTransferMode

transfer-mode key literal only in 86.10-80260

| Build | State |
|---|---|
| `<86.10` | absent |
| `86.10` | present |

### RINCON metadata NS additions

metadata-1-0 fields isAd/linkUrl/trackGain added in 86.x; preset only in <=57.10; ~20 fields stable across 57.10-86.x

| Build | State |
|---|---|
| `34.16` | minimal |
| `57.10` | core set |
| `86.x` | +isAd/linkUrl/trackGain |

### /status route table

all ~59 /status paths identical across 57.10-86.x; only mdnsd.log absent in 34.16

| Build | State |
|---|---|
| `34.16` | 58 routes |
| `57.10+` | 59 routes |

### SystemProperties removed actions

FIRMWARE-STATE MATRIX (docs/crossbuild_matrix.json, 3-state per action): REMOVED ProvisionCredentialedTrialAccountX dispatched@34.16 -> string-absent 57.10+ (hard removal, stale SCPD ad). REMOVED ResetThirdPartyCredentials dispatched@34.16 -> str-only 57.10+ (soft removal, dead string lingers). REGRESSED AudioIn x6 dispatched 34.16/57.10 -> str-only 86.x (real impl -> reject-all 401 stub). ADDED 57.10: AVTransport.EndDirectControlSession, DeviceProperties.Set/GetButtonLockState, GroupManagement.SetSourceAreaIds, VirtualLineIn.Start/StopTransmission. ADDED 86.8: DeviceProperties.RoomDetection{Start,Stop}Chirping; HTControl x8 went str-only(dormant)->dispatched(live). QPlayAuth dispatched->str-only(57.10)->dispatched(86.x) restored. +AVTransport.DelegateGroupCoordinationTo arg ClearSource (86.10).

| Build | State |
|---|---|
| `SCPD(all)` | advertised |
| `86.10` | removed from dispatch table |

### Muse software-update REST surface restructure

86.8 exposes player-scoped v1/players/{playerId}/update/household (+households variant) with command playerId,update,beginHouseholdSoftwareUpdate. 86.10 replaces this with a device-scoped householdUpdate resource pair v1/devices/{deviceId}/householdUpdate/{update,status} (+households variants) and player-scoped v1/players/{playerId}/update/status (+households variant), with commands deviceId,householdUpdate,beginHouseholdSoftwareUpdate / getHouseholdUpdateStatus and playerId,update,getUpdateStatus. New machinery: UserUpdateScheduler/auto_update_scheduler.cxx + user_update_scheduler.cxx (replacing update_scheduler.cxx), upgrade_mgr_user_report{,_prev}.json artifacts, quarantineRecheck broadcast, 'Running user-initiated HH update' failure taxonomy, designatedDeviceId, ERROR_NOT_DESIGNATED_DEVICE / ERROR_UPDATE_IN_PROGRESS, and a full upgrade-mgr state vocabulary (HELLO_DONE, DOWNLOAD_DONE, FLASHWRITE{,_DONE}, REBOOT{,ING_DONE}, POWERING_UP_UPDATED, UPDATE_COMPLETE, UPDATE_NEVER_RUN, UPGRADE_MGR_SPAWN_FAILED, MANIFEST_DOWNLOAD_FAILED, MANIFEST_PARSE_FAILED, NO_DEVICES_NEED_UPDATE, FINAL_RESULT_UNKNOWN, WAKING_UP_FROM_USER).

| Build | State |
|---|---|
| `34.16` | n/a (no muse v1) |
| `57.10` | n/a |
| `86.8` | player update/household |
| `86.10` | device householdUpdate + update/status |

### Muse common layer moved to sonos-muse-1.0 build tree

oc/zone/muse/{musecontext,museeventing,musenoncehandler}.cxx source-path literals present in 86.8 anacapad .rodata are gone in 86.10, replaced by sonos-muse-1.0/sonos-muse/{src/sonos/muse/common/{context,eventing,noncehandler}.cxx, include/sonos/muse/common/history.h} — the muse context/eventing/nonce layer was moved to the sonos-muse-1.0 source tree (a build-tree reorganization — no libsonos-muse*.so exists in the rootfs; the code is statically linked, not a runtime library boundary). ${MUSE_V2_API_STRING} placeholder literal also dropped; muse_target_validator + museItemType added; flat 86.8 relative-path subscription table (zones/*, */subscription, authorization/*) no longer appears as standalone literals.

| Build | State |
|---|---|
| `86.8` | muse code in anacapad |
| `86.10` | muse common in sonos-muse-1.0 |

### RMuseFeature flag additions

Five new capability-name literals appear only in 86.10: AUTOMATIC_WIRED_SOFTAP, EPHEMERAL_BONDING, IS_HEADPHONE_MEDIAPLAYER, LAN-SWAPPABLE, RECONFIGURABLE_OUTPUTS. Companion feature-config keys also new: enableHTSNKv2, enableHomeTheaterWifi6GHzFronthaul, enableOnDeviceSoundGeneration, enableRadioSocTemperatureTelemetry, featureConfigHomeTheaterWifiPerfTelemetry, homeTheaterWifiPerfTelemetry, sourceIsLanSwappable, settings:frontierLlms, settings:accessorySettings.

| Build | State |
|---|---|
| `86.8` | absent |
| `86.10` | present |

### Group-forming ungroupable-player guards

86.10 adds a battery of rejection/guard literals absent in 86.8: 'Grouping ungroupable player to other players is not supported.', 'Rejecting AddMember: GC or new member is an ungroupable player (gcUUID=%s memberID=%s)', 'Rejecting x-rincon URI \[%s\]: source or target is an ungroupable player', clone/create-group-to-ungroupable failure logs, 'Resetting required group caps \[0x%08x\] -> \[0x%08x\]', x-sonos-gc-cleared-content header, and BecomeGroupCoordinatorAndSource bCloningGCState/bSourceGCClearedContent tracing — consistent with the new ClearSource dispatch arg.

| Build | State |
|---|---|
| `86.8` | absent |
| `86.10` | present |

### Bundled curl upgrade (DoH + HTTPS-RR + happy-eyeballs v2)

86.10 carries a newer bundled curl: version strings 17.2.6->17.2.7 / 1.53.1->1.54.1 (nghttp2 band), plus new literals for DoH machinery (DoH sub-request, cf_dns_start, DNS filter creation, typed negative-caching), HTTPS resource-record query types (A+HTTPS, AAAA+HTTPS, A+AAAA+HTTPS), Alt-Svc connection tracing, happy-eyeballs 'baller' race ladder, SSLKEYLOGFILE TLS-secret logging, and HTTP/3 awareness. Removed curl literals include the wanted-h1/h2/h3 negotiation wording and Curl_resolv_check.

| Build | State |
|---|---|
| `86.8` | older curl (no DoH strings) |
| `86.10` | DoH/Alt-Svc/HEv2 curl |

### Playback-state guard additions

86.10-only literals: 'Delegated VLI session is not playing; skipping pullContext()/become active device (observable=%d) to avoid re-initiating Direct Control (SWPBL-259788)', 'music context content cannot be swapped', 'Suppressing phantom playback-start after end-of-queue (last streamId: %u)', Ogg resume header caching (Using cached/Reset ogg headers), processHeaders resumeLoc/seek tracing, and 'seamless source change %s (local)' parameterization replacing 'seamless source change failed (local)'.

| Build | State |
|---|---|
| `86.8` | absent |
| `86.10` | present |

### rootfs content diff — fenway (m8) vs limelight (m9), same build 86.10-80260

m9-only: libdcadec.so.0 (DTS), libsqlite3.so.0, modules/ir_rcvr.ko + opt/ir/ (Playbar has an IR receiver; Play:1 does not), opt/dsp/S9_array.xml (woofer array), opt/buzzers/speaker-detect.mp3 (chirp room-detect tone), wifi/N/dfs.ko + radartool (DFS radar — HT master owns SonosNet), icon-S9.png, opt/bin/anacapad. m8-only: opt/bin/update — RECOVERY BOOT LOOP: writes 'URL: \[http://update-firmware.sonos.com/firmware/Prod/JFFS_Static_Link/fenway.upd\]' to /var/run/upgradeinfo (honors /var/run/forceupdateurl override), rotates /jffs/recovery.log -> recovery_prev.log (112-line trim), runs /bin/upgrade -b every 30s — the unbricker path, ABSENT on m9 (limelight recovery handled differently, likely boot-bank); opt/htdocs/audio/level.mp3 (271KB test tone); opt/htdocs/xml/satellite_device.xml (fenway ships a SATELLITE device-description template — Play:1 can present as a bonded surround); icons S1/S3/Sub.png for topology display. Configure diffs: JFFS on mtdblock3/mtd3 (m8) vs mtdblock4/mtd4 (m9) — different flash layouts; frcheck rc==0 -> netstartd --soft-reset on m8 vs --hard-reset on m9 — the same factory-reset status maps to DIFFERENT reset severity per model.

| Build | State |
|---|---|
| `86.10-1-8 fenway` | see detail |
| `86.10-1-9 limelight` | see detail |

- **status:** confirmed

### anacapad binary .rodata diff — m8/fenway (Play:1) vs m9/limelight (Playbar), same build 86.8

Normalized string-level diff of the two 86.8 sibling binaries (peel-normalized for packer-tag junk). m9-only (3748) = the entire HT-SOURCE stack: tv_processor_usage.cxx/htaudio_{autoplay,chprocessing,configuration}.cxx/htaudio_satellite_tx.cxx modules; /spdiftap + /snapshotspdiftap + /downloadspdiftap + /tvprocessor + /dolby_config status pages; SPDIFTap/Satellites XML emit schemas (<Satellite Channel Delay Gain IP Eth WiEna>, <ActiveDecoder>DTS|PCM, <DTSProfile>, <SurroundEnabled/Mode/Level>, AudioDelay{LeftRear,RightRear}, StartupLatency/DialogDelay/FrontSatDelay/TVGroupLatency, SurroundState/SubState/GMDownMixState); ARRAY_SUB_SYSTEM_TYPE_{APOLLO,BRAVO,FURY,LASSO,OPTIMO2,OPTIMO2_SURROUND} array taxonomy; ASRC coefficients; debug web forms /ssh/authorized_keys + /removestring + sonos-logger JS; a line:col JSON parser (jsoncpp-style) absent on m8; richer service-token refresh FSM (acct sn refresh sync/wait/token-from-file); CDALIVE keepalive. m8-only (1103) = the HT-SATELLITE + multi-product-DSP side: htsnk.cxx + HTSNK telemetry (<HTSNKPipelineVer>, Consecutive Missed Frames/Latency/Rx Time To Play/Totals, v%u pipeline, Faking satellite removal in shared sat mode, GainISat/SatAttack); per-product DSP classes {DSPControlPlay1,DSPControlPlay3,DSPControlSub,DSPPlay1,DSPPlay3,DSPSysSub} + dspControlSub.cxx; all-in-one sonar ({En,Dis}abling spatial sonar, SonarControl, sonarFreq/sonarMode, x-rincon-sonarcal:complete.ogg, all-in-one sonar not implemented note); Sub-bond machinery (SUB improperly linked..Unlink it, isSubImproperlyLinked, lsubmodel, Unsupported fenway Submodel, bonded subs); /proc/driver/gpio; /tmp/current_play_state; /var/run/forceupdate{,url} force-update flags; R_CustomerID=0 setting default. Confirms the codebase is one binary parameterized by model: fenway builds carry the satellite/sink + Play1/Play3/Sub DSP personalities, limelight builds carry the master/HT-source + Playbar array stack.

| Build | State |
|---|---|
| `86.8-1-8 fenway` | satellite/sink + P1/P3/Sub DSP + sonar + sub-bond |
| `86.8-1-9 limelight` | HT source + array + spdif-tap/debug pages + richer token/JSON |

- **status:** confirmed
