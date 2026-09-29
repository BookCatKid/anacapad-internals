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

> **Status (post-expansion commits e3c784e→2b1de46):** this audit has
> been substantially executed. All 36+ subsystem records now exist in
> `documentation.json` under `subsystems`, and every one has been
> deepened to `partial` coverage or better with real binary evidence.
> Part 1 items are folded into `shared_primitives`/`uri_formats`. What
> remains open is the deep semantic tail listed at the bottom — this
> file is kept as the map of what each record still does NOT cover.

---

## Recreation-readiness audit

The acceptance bar: **a third party should be able to write a
compatible client (or fake endpoint/server) for each wire-visible
surface without touching the binary** — full request grammar, response
schema, error behavior, headers, auth requirements and side effects.
Grading each surface against that:

### At the bar (recreatable from docs alone)

- **SOAP control surface** — all 205 actions carry handler, dispatch,
  inputs/outputs, validation, side effects, events triggered, fault
  sites and crossbuild notes. `QPlayAuth` is the only action without a
  resolved handler (its impl is the dispatcher sibling).
- **`/getaa` album-art proxy** — fully decoded via disassembly
  (handler `f_100b8c2c`, processor `f_100c34fc`, worker
  `f_10299e5c`): params `m`/`s`/`vli` flags + `u` upstream URL; `u` is
  a parse terminator (params after it are ignored — `m`/`s`/`vli` must
  precede `u`); `v` is never read (client cache-buster only); requests
  enqueue onto a 32-slot ring served by a worker thread that aborts on
  TCP_CLOSE/CLOSE_WAIT/CLOSING peers; response streams via
  `vliStreamImage` with `Cache-Control: private, max-age=15780000`;
  upstream failure = 404-class. albumArtURI emission is capped at 1024
  bytes.
- **GENA LastChange** — all three namespaces (`RCS/`, `AVT/`, Sonos
  proprietary `Queue/`) with complete element inventories.
- **Persistence formats** — `.rsq` saved-queues, `trackqueue.rsq`,
  favourites `<Favorites>`/`<Radio>` stores, `alarmclock.xml`, HT
  config + 37-field zone-audio records, LED `LedPatternEntry`/
  `LedStepEntry` programs, SQLite timer DDL — all schema-complete.
- **Scrobbler** — Audioscrobbler 1.2 handshake + submission template +
  `BADTIME` Date-header recovery, fully spelled out.
- **Device description / SSDP surface** — both description variants,
  service/SCPD inventory, advertisement vocabulary.
- **`/testenv` environment switcher** — full form fields, env table,
  propagation semantics.
- **Secure-pairing TLV** — 7-byte header, payload bounds, trailing
  MAC, rotate-XOR mixer — implementable.

### Below the bar (shape known, wire details missing)

- **`/status` subhandlers** — 63 handlers named with route flags and
  handler classes; per-handler *output field schemas* exist for some
  (ZPInfo complete; location-engine `<Data name=...>` dump recovered)
  but most pages' field lists are unwritten. To recreate: walk each
  handler's emit calls.
- **Muse API** — 525+ routes, resources, verbs, auth model and
  WSS-transport constraint recovered; **per-route wire schemas now
  substantially decoded** (post-`203dd97`): 558/603 routes bound to
  spec lists via the op-vtable `+0x58` accessor; spec grammar fully
  cracked as flat `{fieldName,typeName}` pairs into the 331-entry name
  table (`f_109ecb5c` index lookup, `table[3+i]`); repeated field name
  = type union, `none` = absent slot, `upnpEvent` = universal wrapper.
  What remains: pair-level flag/annotation semantics (serializer fns
  in `0x109c9xxx`/`0x1080xxxx`) and the verb↔descriptor binding for
  the ~45 unbound routes.
- **Lechmere channel** — framing, version negotiation, close codes,
  pseudo-HTTP tunnel headers, status fields decoded. **Payload format
  resolved (post-`da05e12`):** the frame body is a pseudo-HTTP request
  parsed by `f_105d4ff4` (`x-sonos-method:`/`x-sonos-uri:`/
  `content-length:`/`SOAPACTION:`/`X-Sonos-Udn`) — there is no inner
  TLV layer; the earlier "type ≤ 6" lead was the *Spotify* AP
  (`mod_ap_conn.c`) 7-byte Mercury-style TLV, a different subsystem.
  The 2-char frame messageType is the `AA..AK` registry; `AA..AJ`
  double as the ten location-settings migration field-ids, `AK` is a
  non-migration type. Per-code semantic names remain data-driven
  (opaque hash keys) — static ceiling.
- **QPlay** — `QPlayAuth(Seed, Code, MID, DID)` arguments recovered;
  the seed→code transform is a runtime-bound impl vfunc — static
  ceiling documented.
- **Spotify Connect zeroconf** — `/spotifyzc` serves `getInfo` to the
  GC only, blob transfer is encrypted; blob format unknown.
- **netstartd IPC / `/X-external`** — message vocabulary known;
  per-message wire grammar partial.
- **Settings replication** — ops, denylist/quarantine policy known;
  per-setting wire serialization incomplete.
- **HTTP endpoints catalogued but shallow** — substantially deepened
  (post-`62cd5e5`): ~50 handlers now carry params, CSRF requirements,
  response formats and auth literals in `decoded_handlers`. Remaining
  shallow entries need the same per-handler walk.
- **Cloud queue windowing** — largely covered by the `cloud_queue`
  subsystem record: cqfsm states `{POLL,PENDING,ERROR_RETRY,DONE,
  SUCCESS,MEDIA_ERROR,RESET,GET_VERSION,GET_CONTEXT,SCHEDULE_WINDOW,
  SCHEDULE_CONTEXT,GET_WINDOW,POST_RATE}`, ops, request params
  (`itemId`,`positionMillis`,`queueVersion`), events
  (`queueVersionChanged`,`contextVersionChanged`,`authToken*`),
  retry policy and versioned-URL requirement all harvested. Per-item
  fields inside `itemWindow` (the per-entry JSON schema) remain the
  last open piece.

### Not at the bar (vocabulary only)

- **Mercury/hermes** (Spotify's own protocol — third-party spec
  territory anyway)
- **IBT plan schema** — executor decoded; plan/command grammar unknown
- **Trueroom estimator payloads**
- **CHSRC/CHSNK inter-player audio framing** — the synced-audio bus
  exists; frame layout not decoded
- **Bluetooth/AirPlay stacks** — third-party code, presence only
- **`R_*` integer enum values** — **RESOLVED** (see the `R_*` section
  below): every genuine `R_*` family proven by per-use analysis —
  `R_LED_*` mask via log-arg `(hi,lo)` constants, `R_PLAY_OP_*`/
  `R_STREAM_OP_*` via PIC jump-table case bucketing,
  `R_CLIENT_KEYCERT_ID_*` via selector return values. The remaining
  `R_*` tokens are settings keys, not an enum. Separately,
  `enum_tables` gives proven integer values for the binary's real enum
  registration tables (48 stride-12 `{name*, strlen, enumval}` arrays
  in `.data.rel.ro`) plus two direct-indexed name tables —
  `muse_result_codes` (107 codes) and `media_service_errors` (71) —
  covering muse roles (`OWNER/GUEST/CRM/ADMIN...`), auth types
  (`GUEST_TOKEN/ACCESS_TOKEN/API_KEY/GUEST_TOKEN_PIN`), authz
  namespaces, playModes, queue insert modes, content-object classes,
  SMAPI/SRADIO/SFB capability bitmask (1..32 powers of two),
  registration classes, netmodes, alarm/timer/power/replication FSM
  states, remote buttons, speaker orientation, CHSRC source classes,
  update-FSM results, vanish reasons, trueroom data types, positioning
  measure types, ratings — see `shared_primitives.enum_tables`

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

### `/status` subhandler semantics — routes mapped, schemas still open
The page registry is now fully decoded: a stride-12 `{name*, flag,
source*/handler*}` table at `0x11090144-0x11090b6c` (immediately
before the 102-record master route table) with three page families —
exec pages (shell commands: `/lsmod`→`/sbin/lsmod`,
`/ntpsources`→`chronyc`, `/scanresults`→athconfig...), ~45 file-cat
pages (`/jffs/settings/*.json|xml`, `/opt/log/anacapa.*.log`,
`/proc/ath_rincon*/*`), and 62 module-rendered pages with `.text`
handlers. Flag values `1,2,6,a,b,e,43,46,82` analysed (see
`flags_decode_attempt`): not page-type discriminators — a per-page
bitmask with `0x80` = prefix-mount; empirical groupings recorded
(`0xa` net/sys dumps, `0xe` counters/logs, `0xb` link state, `0x6`
wifi-mib, `0x1` identity); best hypothesis is a support-bundle
section mask — exact bit semantics unproven.
Per-handler output schemas recovered for ~36 pages via emit-literal
harvest through the delegate chain (ZPInfo, DeviceInfo, Alarm,
UpdateInfo, LedPatternInfo, ThirdPartyLibraryInfo,
RoomCalibrationInfo, Shares, ZoneExperiments, ssl_client_cache
entries, Playmode, TemperatureHistograms, TrackSummary, EnetPorts,
Registration, DeviceCertInfo, RenderingControl, Decoder, Topology,
Audiocore, Radiolog — see `page_schemas`). Delegation targets
resolved: `/settings/{effective,location,player}` → shared emitter
`f_101886a4`; `/syssettings` → the UPnP 403 security gate
`f_106937dc`; `/api`+`/dnscache` → `f_10769d34`; `/dmesg` →
command-stream helper `f_1076b10c`. Remaining ~7 member-dump stubs
(`/ai_speech_enhance`, `/analoglinein`, `/hls`, `/htconfig`,
`/tvprocessor`, `/spdiftap`, `/wireless`) call vfuncs on app-object
members with no RTTI and no static ctor refs — static ceiling.
`setstring`/`removestring`/`ranges`, `sonarctl`, `mdnsannounce`,
`/jobs`, `/support/asyncsubmit`, `/spotifyzc`, `/cloudqueuepoll`,
`/downloadspdiftap`, `/snapshotspdiftap` params + response literals
all decoded into `decoded_handlers` (incl. `csrfToken` requirements).

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

### The `R_*` internal status namespace — RESOLVED (with corrections)
Most names previously catalogued as `R_*` families were **substring
artifacts** inside `ERROR_*`, `FLAC__STREAM_DECODER_*`, and
`SPEAKER_MASK_*` literals (`R_ACCOUNT_*`, `R_PAND_*`, `R_INIT_STATUS_*`,
`R_MASK_*`...). Those vocabularies now live in the proper enums:

- `muse_result_codes` — **107 proven wire codes** (direct-indexed
  `char*` table at `0x10f94d14`; consumer `f_109e0d14` bounds-checks
  `<=106` then `lwzux` indexes): domain errors 0-51, HTTP-mirroring
  success 52-56 (`OK/CREATED/ACCEPTED/SUCCESS_NO_CONTENT/
  SUCCESS_NOT_MODIFIED`), protocol/request errors 57-106
  (`ERROR_UNSUPPORTED_COMMAND=90`, `ERROR_API_KEY_VALIDATION_FAILED=93`,
  `ERROR_CMD_FUTURE=96`, `ERROR_CMD_REMOVED=97`,
  `ERROR_NOT_DESIGNATED_DEVICE=106`...)
- `media_service_errors` — 71-entry ordered table at `0x110925dc`:
  generic transport/content errors then per-service ranges
  (RHAP/AUDIBLE/WMP/SIRIUS/PAND/LASTFM/CLOUD_QUEUE/CERT). Index
  semantics inferred from ordering — lower confidence than muse codes.
- The ~19 `FLAC__STREAM_DECODER_*` and `SPEAKER_MASK_*` literals are
  third-party libFLAC internals / the `speaker_mask` table respectively.

The **genuine** `R_*` families are now all proven:

- `R_LED_*` — 24 proven 64-bit mask bits; `applyLEDMode`
  (`f_10c918a0`) bit-test chain logs each tested mask as `(hi,lo)`
  constants (`MUTED=0x1` ... `IDENTIFY_PLAYER=0x4000000000`; `PLAYING`
  = the no-bits else case).
- `R_PLAY_OP_*` / `R_STREAM_OP_*` — proven via PIC jump-table case
  bucketing in `f_104c9270` (7 cases) and the stream-op dispatcher.
- `R_CLIENT_KEYCERT_ID_*` — proven: selector `f_1057ac60` reads flag
  bits at cert-ctx+0x0c + a predicate, logs the matching
  `R_CLIENT_KEYCERT_ID_*` name, and returns 0-3
  (`SONOS=0`/`SONOS_DEVICE_ACCEPT_LEGACY=1`/`SONOS_DEVICE=2`/
  `SONOS_REGISTERED_DEVICE=3`). Consumer chain: `f_1057ade8` →
  `f_1056c738` indexes runtime tables `0x110a5670`/`0x110a56d8`.
  Cert-manager sources: `devicecertmanager.cxx`, `regdevicecert.cxx`,
  `certmanager.cxx`; mbedTLS loads CA bundle + client cert; bundle
  download uses ETag change detection.

Residual `R_*` gap — **mostly closed**: `shared_primitives.
system_property_keys` catalogues all 28 standalone `R_*` literals
with live consumer fns and the `onSettingChanged` strcmp dispatcher
`f_104b1e48`. Remaining: non-`R_`-prefixed SystemProperties keys —
the store is an open KV (GetString/SetString are thin vcalls on a
member store object, `f_107319b4`/`f_10731adc`), so the non-`R_` key
space is unbounded and cannot be enumerated statically; keys are
inlined at each call site.

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

### Accounts/cert lifecycle — selection + status pages proven
`R_CLIENT_KEYCERT_ID_*` selector proven (`f_1057ac60` returns 0-3
from cert-ctx flag bits; id→object via `f_1056c738` indexing bss
tables `0x110a5670`/`0x110a56d8`). `/regcert` page → `DeviceCertInfo`
schema proven (CertName/Denylisted/HaveCert/CertSerial/ExpiresUtc/
ExpiresIn/JobAllowed/JobForceAllowed/JobScheduled/JobLastRun/ETag/
HouseholdID/SonosID/IDType + PEM body); cert-refresh scheduler
`f_105a6984` (`dcm` tag, muse Registration event fields `haveCert/
refreshTJ/eventType/refreshed/certType/deviceCert/secureReg`).
`/root_cert_bundles` hex-dumps the loaded CA bundle via registry
`0x11095f88` vfunc+108/+40. Still unresolved: enrolment/renewal
request wire formats (CSR structure, request bodies), the runtime
cert-object record layout, key storage paths.

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

## Still open, ordered by leverage

Everything below is now catalogued with evidence; what's missing is
the deep semantic layer:

1. **Muse op internals** — 603 routes, all 265 verbs classified
   (factory→vtable→exec chains + descriptor-vtable binds + proven
   outbound-forward stubs + resource-block registrars); op-descriptor
   stream recovered from .data.rel.ro (spec-pair headers + verb/param
   literals + positional vtables); still missing: per-field type/
   requiredness/defaults (spec-pair tag semantics undecoded),
   response-body schemas
2. **Lechmere inner payloads** — largely resolved: msgType-3 frames
   carry v{api}:{ns}#{cmd} where ns/cmd = the muse resource/verb space;
   events ride the inprocess-events bus with {json} payloads. The "TLV
   header" read is mercury/AP (Spotify) framing, not lechmere
3. **Spotify eSDK internals** — module map + Connect surface decoded
   (/spotifyzc zeroconf action vocabulary); AP packet layer recovered
   (7-byte TLV header, 16KB cap, per-packet MAC); mercury/hermes
   message-type semantics still untouched
4. **Chirp profile parameters** — SDK identified as Asynchronous Inc
   Chirp SDK 4.2.3 (build 1898) with full error-table + source-path +
   internal-func vocabulary; sonos-cdma profile symbol set/FEC params
   still unextracted
5. **`/status` + master-route schemas** — master HTTP route table
   decoded (102 records @ 0x11090c00 stride-28) plus the full `/status`
   page registry (stride-12 @ 0x11090144-0x11090b6c: exec/file/module
   page families, 62 module handlers mapped); per-route emit schemas
   harvested for ~85 routes; the remainder delegate via module vfunc
   +0x24 and need per-module chasing
6. **R_* integer mappings** — RESOLVED: every genuine `R_*` family is
   now proven (`R_LED_*` mask via log-arg constants, `R_PLAY_OP_*`/
   `R_STREAM_OP_*` via PIC jump-table bucketing,
   `R_CLIENT_KEYCERT_ID_*` via selector `f_1057ac60` returns 0-3);
   previously catalogued "R_*" families were substring artifacts of
   `ERROR_*`/`FLAC__*`/`SPEAKER_MASK_*` strings. 48
   `{name*,strlen,enumval}` registration arrays give proven values for
   ~45 more enums, plus direct-indexed name tables: `muse_result_codes`
   (107, proven consumer `f_109e0d14`) and `media_service_errors` (71).
   Residual: the 29 `R_*` settings keys (SystemProperties vocabulary)
7. **Certificate wire flows** — selector + id→object path proven
   (above); enrolment/renewal request formats and the
   `/regcert` + `/root_cert_bundles` handler internals unresolved
8. **SemiSleep/WAC/factory-reset state machines** — trigger strings
   catalogued; full FSM transitions not walked
9. **IBT plan format** — substantially decoded (post-`4ef58a2`):
   IBT = cloud-issued command fan-out to intended targets
   (players/areas); `[dispatch]`/`[group]` vocabulary recovered
   (per-target results, bearer + `X-Sonos-Type` auth, group
   add/create/forward ops); 13 `zones`-namespace verbs bound via the
   registry tail @ `0x11094380`. Remaining: plan serialization
   format and the exact IBT-eligible command whitelist
9b. **Migration-data container** — RESOLVED (post-`26bc86f`):
   kaomoji-magic checksummed fragments
   (`{"magic":"`|_(:/)_|`","length":N,"checksum":"0x%08X","counter":N}`
   + `{"magic":"(=^+^=)","version":11}` file stamp), writer
   `f_10bf8000`, keyId/hetType validation on read
9c. **CloudQueueWindow item schema** — RESOLVED (post-`7d678be`):
   window URL params `{isExplicit,previousWindowSize,upcomingWindowSize,
   heardItemId}`, per-item fields `{itemId,actions,mediaUrl,
   mediaFormat,sampleRate,bitDepth,bitRate,numChannels,dolbyAtmos,
   reportId,privateData,positionMillisAtSegmentStart,policies}`,
   play-report + rating posts, full header set, error taxonomy
9d. **Trueroom estimator payloads** — RESOLVED (post-`99876cb`):
   all 5 ops ARE spec-bound; request/response field:type schemas
   decoded (adaptation posts `trueroomEstimatorConfig`,
   calibrationStatus answers `trueroomAdaptationStatus`...);
   residual: `trueroomEstimatedParams` inner field names
9e. **`/status` flag semantics** — analysed (post-`c258d4b`): not
   page-type bits; per-page bitmask, `0x80` = prefix-mount; support-
   bundle section-mask hypothesis; exact bit semantics unproven
10. **XML schema clusters** — element lists recovered; attribute
    types/ranges/defaults mostly unvalidated against parsers
