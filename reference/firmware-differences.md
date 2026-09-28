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
