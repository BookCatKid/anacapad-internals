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
  service/SCPD inventory, advertisement vocabulary. M-SEARCH response
  signing + the proprietary header set (`X-RINCON-{HOUSEHOLD,PROXY,
  REASON}`, `X-SONOS-{DEVICEID,SESSIONRETRIES,SESSIONSECONDS,MDPMODEL,
  HHSECURELOCATION}`, `HOUSEHOLD.SMARTSPEAKER.AUDIO`, `SECURELOCATION.
  UPNP.ORG`) + `RMSearchNotifyHandler` select threads catalogued
  (`dev_disc`).
- **`/testenv` environment switcher** — full form fields, env table,
  propagation semantics.
- **Secure-pairing TLV** — 7-byte header, payload bounds, trailing
  MAC, rotate-XOR mixer — implementable.
- **HTTP server core** — TSocketPoll engine, `anacapa.conf` key set,
  security-header emission (X-Frame-Options/CSP/frame-ancestors),
  `multipart/ranges` boundary, status-phrase table, error pages,
  TServer lifecycle, thread-dump schema, fault-handler taxonomy,
  watchdog killswitch, TPool allocator diagnostics — `http_engine.
  server_core`.
- **SPDIF/IEC-61937 parser** — the SPDIFParser FSM is schema-complete:
  9 states, PaPb sync acquisition, lookalike-PCM guard, databurst
  mismatch/repetition checks, `<SPDIFParser>` status XML,
  `audiotap.spdif` metadata versioning — `htaudio_chproc.spdif_parser`.
- **Trueplay calibration file** — `spectralcoeffs` store with
  RoomCalibration{Spatial,Spectral,Config,Data} keys, per-channel
  gain+biquads+delay schema, calibration-ID version/expiry/UDN binding,
  HT-Sat orientation skip — `trueplay_tuning.calibration_file_parser`.
- **iTunes library import** — ITP parser stack validation + playlist
  persistence guards + abstract-file URI-atom store — `share_indexer.
  itp_parser`.
- **Timed-job registry** — full periodic-task name inventory
  (`pollZPHighRateJobs`, `svcAccountMaint`, `uploadProtoEvents`,
  `refreshEntitlements`, `fetchFeatureConfiguration`, ...) with display
  names — `timed_jobs.job_registry`.

### Below the bar (shape known, wire details missing)

- **`/status` subhandlers** — 59 module routes + exec/file tables at
  `0x110908c8`/`0x11090144`/`0x11090228` mapped with delegation
  targets (`/settings/*`→`f_101886a4`, `/syssettings`→403 gate
  `f_106937dc`, `/api`+`/dnscache`→`f_10769d34`, `/dmesg`→
  `f_1076b10c`); ~36 output schemas recovered via emit-literal
  tracing. Route flags are per-page bitmasks (support-bundle section
  hypothesis — unproven). ~7 member-dump pages (`/ai_speech_enhance`,
  `/analoglinein`, `/hls`, `/htconfig`, `/tvprocessor`, `/spdiftap`,
  `/wireless`) call vfuncs on classes with no RTTI/static ctor refs —
  static ceiling.
- **Muse API** — 525+ routes, resources, verbs, auth model and
  WSS-transport constraint recovered; **per-route wire schemas now
  substantially decoded** (post-`203dd97`): 1116 extracted routes all
  bound to spec lists via the op-vtable `+0x58` accessor; spec grammar
  fully cracked as flat `{fieldName,typeName}` pairs into the
  331-entry name table (`f_109ecb5c` index lookup, `table[3+i]`;
  semantic index = table slot − 3); repeated field name = type union,
  `none` = absent slot, `upnpEvent` = universal wrapper. The ~45
  routes without spec bindings are outbound/client ops — by design
  they have no impl vtables; their request shape is the per-namespace
  verb vocabulary. `networkTestId` is an ordinary optional request
  field (16 ops), named after the real `v1/players/{id}/networkTest/
  {networkTestId}` resource — not an envelope marker. Name-table
  duplicates (idx 291/292, 294/296) pair request/event descriptors of
  the same wire name. What remains: nothing structural — residual
  work is semantic interpretation of individual fields.
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
  GC only, blob transfer is encrypted; blob format unknown. The
  *player-side* eSDK is now deeply documented (post-`23341f5`): full
  callback inventory (connection/device-alias/DNS/17-socket/TLS/debug/
  error), AP-resolver request format (`apresolve.spotify.com
  /?client=TSP_VERSION_PLATFORM:5:0:%s&time=%llu`), socket-HAL
  lifecycle+option enum, and the `mod_media_out` track-pipeline FSM
  (per-track `{pbid,uri,start_pos,paused,file.id}` records, 14-field
  pipeline-diff line, `SP_EVENT_*` stale-ID guards, pending start pos).
  The opaque Mercury/AP internals are third-party — static ceiling.
- **netstartd IPC / `/X-external`** — wire format recovered
  (post-`0218a43`): 12-byte `{A,B,len}` header via imported
  `ReadIPCHeader` (len validated 4..0x804) + `{id:u32,
  payload:len-4}`; the id-31 jump table and control vocabulary are
  decoded. Fields A/B unresolved — `ReadIPCHeader` is a libsonos
  import (static ceiling).
- **Settings replication** — offer/GET/verify/install pipeline
  recovered (post-`1513e33`): headers `X-RINCON-CONTENT-VERSION`,
  `X-RINCON-LAST-UPDATE-DEVICE`, `X-RINCON-CONTENT-FORMAT`,
  `CONTENT-ENCODING`, `X-RINCON-SIGNATURE`; per-setting element
  `<Setting idx="%u" lud="%s" version="%u"/>`; validation of
  size/version/format/encoding/algorithm/signature; tmpfile install;
  denylist/quarantine; no replication while unregistered. Recovery-AP
  URL format from IPv4+port; API-key/bearer checks in the authz
  block.
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
  `itemWindow` schema **recovered (post-`7d678be`)**: `{itemId,
  actions, mediaUrl, mediaFormat, sampleRate, bitDepth, bitRate,
  numChannels, dolbyAtmos, reportId, privateData,
  positionMillisAtSegmentStart, policies}` + window params
  `{isExplicit, previousWindowSize, upcomingWindowSize, heardItemId}`
  + rating/play-report posts + full outbound header set.

### Not at the bar (vocabulary only)

- **Mercury/hermes** — resolved as the `hm://` channel (post-`b94b922`):
  the embedded Spotify eSDK addresses hw-platform daemons via
  `hm://hwptp/v1/devices|tsv`, `hm://hwptp/v2/resolve/%s/%d/%s` and
  `hm://hwp-events/v1/log_event`, carrying the Connect device API
  (`%s/devices/%s/{state,state_conflict,volume,play,set_shuffle,
  set_repeat,pull_playback,queue}`, `content_encryption_key`,
  `offline/restrictions`). Mercury frame internals remain
  third-party-spec territory.
- **IBT plan schema** — executor + intended-target fan-out decoded
  (implicit/explicit target parsing, `intendedTargets` support check,
  per-target `[dispatch]` results, players-or-areas group addressing,
  `enablePitchfork` gate, 13-verb zones registry). Plans are
  in-memory only; no serialization format exists to recover.
- **Trueroom estimator payloads** — resolved (post-`b731f2b`):
  `trueroomEstimatedParams` is a named member-map key in the
  estimator-config container (`obj+0x50` map via `f_108337b0`, stored
  at `obj+0x15c`), not a spec member; inner fields are never
  stringized — positional/C++-walker serialization, static ceiling.
- **CHSRC/CHSNK inter-player audio framing** — partially decoded
  (post-`316b0a5`): CHSNK request-frame dispatch recovered — type
  values 0/1/2/5/8/0xc/0x80000040, `{u16,u8}`/`{u16,ptr}` payload
  forms, stop pre-dispatch, underflow flag + LSE stream-reset
  recovery, playback-boundary events, track-boundary u32, coordinator
  I/O-error default. Per-type full payload layouts remain open.
  HT-satellite control frames are 16-byte `{u8 code, 15B pad}`.
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

The embedded HTTP server core itself is now decoded
(`http_engine.server_core`): TSocketPoll/select engine error paths,
`anacapa.conf` key set (conntimeoutsecs/timeoutfirstbyte/numthreads/
MaxConn cap/diagmin/diagmax/PidFile/SSL ports/MIME file), emission of
`X-Frame-Options`/`frame-ancestors 'none'`/`Content-Security-Policy`,
`multipart/ranges` boundary `##123456789###BOUNDARY`, full status-
phrase table + error-page template, TServer lifecycle + per-server
localsettings, thread-dump schema, segv/abrt/ill fault handler
taxonomy, `app/debug/prevent_wdog_sigkill` watchdog killswitch, TPool
allocator diagnostics, and the synthesized VLI UDN
`RINCON_000E58VLIDID01400`. The `testpoint?name=<name>.<method>`
dispatch scheme is also catalogued.

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

### Device description variants — covered
`/xml/device_description_no_ai.xml` — a second device description
proving AudioIn omission is deliberate and switchable — plus
`/xml/satellite_device.xml` and `/xml/group_description.xml`; all
three variants catalogued.

### GENA/eventing internals — covered
`upnp_eventing` record: renew FSM (`Unsubscribe in renew`,
`Successfully renewed`, `Failed to renew ... HTTP Result`,
OOS sequence tracking, secure-eventing flag, `Second-/%u` SID form,
`sourceHasEventsToSend` initial event), `/status/subrenew` schema
(`<Outgoing>{LogicalSID,UPnPSID,EventURI,FailureCount,NextRenew,
ExpectedSeq}`), the 16-endpoint `/X/Event` inventory, and the muse
mirror (`upnp<Svc>/subscription/{logicalSID}` subscribe/renew/
unsubscribe verbs). The `preinstall SID=%u` strings are SMAPI
service-id preinstall (Sonos Radio), not GENA SIDs — corrected.

### `/QPlay/Control` has no `/QPlay/Event` — noted
Every service has a Control+Event route pair except QPlay — Control
only; recorded in `qplay_protocol`.

### GetProtocolInfo source/sink contents — RESOLVED
Both CSVs frozen verbatim in `protocol_info_schemes`: the 1855-byte
SourceProtocolInfo literal at `0x10eb87e4` and the SinkProtocolInfo
at `0x10eb8750`, plus per-service extras (`real.com-rhapsody-direct`,
`pandora.com-pndrradio`, `x-sonosapi-radio`) that are appended per
registration, not in the base CSV.

### Proprietary headers — covered
`X-Sonos-Playback-Id`, `X-Sonos-SWGen`, `X-RINCON-BOOTSEQ`,
`X-RINCON-VARIANT`, `WMPNSSv` (fake Windows Media Player NSS service
header Sonos sends), `?sonosId=`/`&sonosid=`/`householdid=` query
params — catalogued in `shared_primitives`/`payload_formats`/
`uri_formats` plus the Cloud Queue outbound header set.

### ICY/Shoutcast metadata — covered
`@icy-metaint:` — inline ICY metadata parsing for mp3radio streams
documented in `shared_primitives`/`payload_formats`.

### URI schemes missed — RESOLVED
All now in `uri_formats`: `pndrradioad://`, `pndrradio-http://`,
`hls-radio://`, `hls-aac://`, `last.fm-radio-http`, `skd://`,
`stub://`, `hm://` — the last additionally decoded (post-`b94b922`)
as the Spotify eSDK hermes channel to hw-platform daemons
(`hm://hwptp/*`, `hm://hwp-events/*`).

### Favourites write path (SOAP-adjacent) — substantially decoded
`mutate_semantics` on `favourites_model`: reorder verbs +
itemsMoved/radioFavoritesMoved notifications, r: metadata fields
(description/resMD/room/playmode/type under the rinconnetworks
metadata URN), :shortcuts/:playlists/:audiobooks categories, TuneIn/
Custom/RadioShow/instantPlay station classes, DIDL class set,
SA_RINCON%d_ account URIs, rhapsody-favorite conversion, and the
informReplicationAndNotify → offerRemoteSetting → userradio{,.d}.xml
replication pipeline. (`FV:GC`/`FV:GC-HB` turned out to be ducking
forward-target selectors in duck.cxx, not favourites URIs — now in
`ducking.forward_targets`.)

### Alert/chime engine — covered
`ducking` record: 64-bit ducking-flag protocol, DuckingEvent/
PlaybackDucked/DuckingFlags XML, R_MuseDuckingPolicy, remote ducking
expiration + heartbeat + peer forwarding, voice-enabled/TV
suppression, pending flag-queue limits, alertContent/ALEXA_ALERT,
join/registration chime availability conditions, and save/restore
behavior around pause/stop/end chimes.

### Non-SOAP error families — covered
`ERROR_LASTFM_{BAD_SUBLEVEL,STREAM_LIMIT,NO_ACCOUNT,NO_CONTENT,
BAD_ACCOUNT}`, `ERROR_DOCK_INTERRUPT` — catalogued in
`shared_primitives` error tables + `media_service_errors` (71-entry
indexed table incl. LASTFM and CLOUD_QUEUE ranges).

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

### CSRF protection on config endpoints — covered
`/advconfig` POST carries a `csrfToken` hidden field — the player
implements CSRF tokens on browser-facing config pages. Now
catalogued per-endpoint in `decoded_handlers`/`admin_post_endpoints`
(`csrfToken` required on `/setstring`, `/removestring`, `/logger`,
`/devmode`, `/reset`, `/mdnsannounce`, `/spotresetnts`, `/ssh/*`,
`/support/*`...); token issuance itself remains unrecovered.

### `/advconfig` POST parameters — covered
`FirstZP`, `PriorityBridge` — SonosNet bridge priority settings
exposed through the advanced-config page; endpoint + params now in
`decoded_handlers`.

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

### More POST-form endpoints — covered
`/ping`, `/traceroute`, `/nslookup`, `/devmode`, `/fcs`, `/logger`,
`/mdnsannounce`, `/spotresetnts`, `/ssh/authorized_keys` (full pubkey
install form gated by `R_ALLOW_SSH_PUBKEY_INSTALL`),
`/support/directsubmit` — all CSRF-protected, now in
`decoded_handlers` with params and response literals.

### Household crypto/PSK vocabulary — covered
`<HhPsk>`, `<ControlPsk>`, `<LanSwapPsk>`, `<RoomEncPsk>` plus the
`Backup*` mirrors are catalogued in `settings_replication`/
`netsettings` records — household/group encryption key identifiers
in replicated state.

### Replication protocol elements — covered
`<ReplicationOperation>`, `<ReplicationPlayer>`,
`<ReplicationResult>`, `<ReplicationTime>`, `<ReplicatedNetSettings>`,
`<QuarantinedDevices>`, `<Denylisted>` — folded into
`settings_replication` alongside the offer/GET/verify/install wire
pipeline.

### Token-refresh state machine — covered
`token refresh state for acct. sn. %u action %d`, `transition token
refresh action %u %d -> %d`, `tokencache`, outbound
`/auth/oauth/v2/validate?access_token=` + the regdevicecert
refresh/complete flow — all catalogued (token_lifecycle /
account_cert_lifecycle records).

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

### DIDL classes — extended (partially resolved)
`object.item.audioItem.audioBook`, `.audioBook.chapter`, `.podcast`,
`episode.podcast`, `chapter.audiobook`, `:audiobooks` container —
audiobook/radioShow/musicTrack/sonos-favorite classes now in
`favourites_model`; `mswmext=.asx` WMP-extension mapping and
`application/x-mpegurl`/`application/vnd.apple.mpegurl`/
`application/dash+xml` playlist formats — ASX/M3U/WLP/PLS sniffers
plus a full HLS tag parser documented under `playlist_parsers`
(ABR selection, FairPlay keyformat, segment machinery).

---

## Part 2 — Separate subsystems (deserve their own documents)

Each is a self-contained protocol/engine that happens to live in the
same binary. Level of existing coverage noted honestly.

### Scrobbling (audioscrobbler/Last.fm) — covered
`scrobbler` record: `post.audioscrobbler.com` +
`ws.audioscrobbler.com/2.0` endpoints, `/?hs=true&p=1.2&c=` handshake
+ submission template + `BADTIME` Date-header recovery — fully
spelled out (at the recreation bar). `last.fm-radio-http` scheme +
`ERROR_LASTFM_*` family catalogued.

### Embedded Spotify (libspotify eSDK) — PARTIAL
Full eSDK statically linked: `ap_send`, `apresolve`, `hermes`, `korn`,
`login4`, `track_pipeline`, `cache_restrictions`, `cdnio`, plus Sonos
bridge `spotify_{abr,media,playback_session,queue,smapi,thread,vli}`,
`mdns_spotify_service` (Connect discovery), `/spotifyzc`, `/spotdbg`.
`spotify_esdk`/`spotify_connect`/`spotify_zeroconf` records cover the
Sonos bridge layer + `hm://` channel to hwptp daemons + Connect device
API paths + zeroconf `getInfo` schema. Callback-registration inventory
recovered (connection x3, device-alias x2, dns_lookup, socket x17, TLS,
debug, error) plus the AP-resolver GET format (`/?client=TSP_VERSION_
PLATFORM:5:0:<build>&time=%llu` against `apresolve.spotify.com`).
Mercury/AP frame internals remain third-party-code territory; the
zeroconf blob is encrypted.

### Chirp acoustic stack — PARTIAL (deepened)
Embedded chirp-core + chirp-private: encoder/wavetable/decorator,
decoder/voter/weighting, `chirp_private_{cdma,fsk}.c`, acoustic
protocol profiles. `chirp_stack`/`chirp`/`chirp_sdk` records cover
drives `RoomDetection*Chirping` + trueplay discovery integration.
The complete profile JSON grammar is now recovered
(`profile_schema`): built-in profiles `audible`/`sonos-cdma`/
`sonos_secure_setup`/`ultrasonic`, all protocol-acoustic keys
(base_frequency, channel_count/interval, note/silence durations,
preamble, portamento, envelope), encoding keys (alphabet_bits,
rs_length min/max, crc_length, polyphony, message_length), decoder
config (fft_size, hop_size, voter configs with reverb-cancellation +
spectral weighting), and frame limits (≤256 bytes AND ≤256 symbols).
Built-in profile struct-inits partially decoded (per-voter threshold
arrays, sonos-cdma 4-channel 17–20kHz frequency-symbol map). The
chirp-core source layout + complete validator rules + profile dump-
printer format are now catalogued (`chirp.source_layout`): per-object
entry-count checks, per-key rejection, voter half-note limit, sample-
rate support check, CDMA `Detected code` emission. Modulation
internals remain opaque (compiled library).

### Trueplay tuning protocol — PARTIAL (deepened)
SOAP enable/status + muse trueroom op schemas (all spec-bound) +
protobuf node protocol (TP_NODE_ACTION_* vocabulary) + propagation to
bonded satellites + estimatedParams member-map binding + config-mode
tone URIs documented. Measurement/estimator FSM internals and the
estimator params payload fields remain the residual tail.

### DSP / home-theater engine — PARTIAL (deepened)
`htaudio_*` modules + the full param surface: `BassGain`,
`LRBassSum`, `SubCrossover`, `InvertSub`, `SubDefaultInversion`,
`DialogEnhancementLevel`, `AISpeechEnhance`, `MusicSurroundLevel`,
`TVSurroundLevel`, `HeightChannelLevel`, `MonoMode`, `SpeakerSize`,
`SPLdB`, `GainTrimDB`, `DRCVolumeScaling`, `Tweaks` bitmask,
`surround delay %u gain %f`, `/htconfig`, `dspControl`/
`dspStateManager`. Now also decoded: `htaudio_configuration.cxx`
status XML (`<Version><SurroundState><SubState><GMDownMixState>
<DialogEnhancementLevel><AISEDynamicLatency><AISpeechEnhance>
<AutoPlay><AutoPlaySilenceThresh><AutoStop><AutoStopSilenceThresh>
<NightMode><SurroundMode><Tweaks><PrimaryEthernet><WirelessEnabled>
<StartupLatency><DialogDelay><FrontSatDelay><SatelliteVersion>
<SatelliteTotal><SatelliteSubs><SatelliteTxMixerRate>` + per-satellite
`<Satellite><Channel><Delay><Gain><IP><Eth><WiEna>` records); the
SPDIFParser IEC-61937 preamble FSM (9 states incl. UNKNOWN_BITSTREAM/
BITSTREAM_CONFIRMATION/ALIGN_TO_BURST, PaPb sync acquisition,
lookalike-PCM guard, `<SPDIFParser>` status XML); nine reset-time
telemetry counters; five `Inducing*` debug-injection commands;
mixgm/mixsat select loops; satellite add/remove protocol; and the
`dsp_file_loader` error taxonomy. DSPConfig is nanopb-protobuf
(`volume breakpoints`/`.nanopb_options` errors name it).

### LED animation engine — ABSENT
`<LedStepEntry rgb="%06X" hold="%u" fade="%u" />` scripted LED
programs; `sonosledmgrd` daemon + `/leds` endpoint; the `R_LED_*`
enum gives the full state vocabulary (BEGIN_SETUP_MODE, JOIN_HH,
JOIN_HH_OPEN, IDENTIFY_PLAYER, CONTROL_FEEDBACK, MUTED, PLAYING,
WAITING_TO_PLAY/PAUSE, UPGRADE, WAC, WAC_TIMEOUT, TRANSFER_
REGISTRATION, DEMO_MODE, DEMO_CONFIGURE_IR, BROKEN_DEVICE, FAULT,
WARN, HHID, AUDIO_OFF, BREAK_POP, SHUTDOWN). `SetLEDState` on/off
documented; the `LedPatternEntry`/`LedStepEntry` program format is
schema-complete in the persistence-format records — what remains is
the runtime state machine.

### Queue persistence (`.rsq`) — covered; live queue deepened
`savedqueues.rsq`, `savedqueues.d.rsq`, `.tmp` atomic rename,
`trackqueue.rsq#0`, `<SavedQueues LastUpdateDevice Version Next>` +
`<TrackQueueSummary>` schema — catalogued among the
schema-complete persistence formats (see "At the bar"). The live
`tqueue.cxx` engine is now partially decoded: beginAppend/
cancelAppend/commitAppend(/replace) transaction IDs, ReplaceAll
index mapping, the metadata ladder (`Md incomplete -> cached ->
CSV extra md -> pmd.initFromTrackMd`), per-track duration/extra-MD
updates, stream-open fallback (`Failed to open ... Trying MMS,
RTSP next`), trueroom `x-rincon-configmode:speaker-detect` tone
injection, and the MUSE POST error taxonomy for queue additions.

### Play history & ratings sync — PARTIAL (deepened)
`historymgr.cxx`, `History`/`RestHistory`/`WebSocketHistory`/
`CloudQueueHistory` XML types, `deleteHistory` cloud op,
rating-gating string. TPM (track-play monitor) vocabulary now
recovered: `TPM update for track uri`/`TPM Position update track
mismatch`, track-boundary FSM traces (`Track Changed w/o Delivery
Done`, `next track @`, `Track end time @`, `Logical Track Boundary`),
seek/stream-reset vocabulary, playback-restriction enum (`License
Restriction`, `No Previous Track`, `No Next Track`), and the VLI
ABR downshift/upshift time policy + `BR %3u BL%% %2u/%2u` status
line. Per-channel wire format still not fully serialized.

### SNTP household time server — substantially decoded
`sntpsrv.cxx`/`sntppoll.cxx`/`zone/common/sntp.cxx`: players host an
SNTP server (per-clock request handling `sntp-%u-clock`, interrupt
fds, `{sntppoll` status XML + sntp.txt dump + `sntp.poll` endpoint).
VLI transport is SNTP-disciplined (`vli sntp port`, `htsnk_invld_
sntp`); drift telemetry `error was %.0f ms ... sntp v:%d f:%d`.
netstartd satellite-addition notify IPC documented. Clock-switch/
topology-selection logic partially recovered.

### Settings replication — PARTIAL (deepened)
`replicated_settings.cxx`: replicated-store inventory +
offer/GET/verify/install wire pipeline now recovered (headers,
`<Setting idx lud version/>` elements, validation chain,
denylist/quarantine, unregistered suppression). Group/location ingest
taxonomy deepened: player-only vs location settings-group split,
`attemptSettingsIngestFromStorage` success-from-old-schema path,
`attributeSources` key, `multipleOf` JSON-schema keyword, `[Rq]`
authz subversion guard + `setupUpdateAllRequest` target-type
whitelist. Per-setting payload schemas remain field-level open.

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
`0x11095f88` vfunc+108/+40. Registration refresh/complete URL grammar
recovered (post-`2a0c81d`): POST `/product/v2/households/%s/players?
action=refresh` then `?action=complete&token=%s`, response
`{"id":"%s","status":"%s"}`; signing key arrives over IPC; the nine
device-registration muse verbs (init/complete/refresh/deregister/
transfer) are catalogued. Still unresolved: CSR/request-body inner
structures, the runtime cert-object record layout, key storage paths.

### Entitlements — VOCAB
`entitlementsmanager.cxx`, `entitlementsVersionChanged` event,
`entitlements` muse resource + `/entitlements/api`. What an
entitlement gates is unknown.

### Telemetry & diagnostics submission — PARTIAL (deepened)
`reportuploader`, `usagedatasharing`, `zonereportmgr`,
`zpMetricsConfigV2.xml`, submission queue (`submissionId`,
`diagnosticSubmissionResults`), `dropout_event_logging` +
`dropout_triggered`, `radiolog`, `trackplaymonitor`/
`trackplayrecorder` (per-track play records to Sonos). SOAP
`SubmitDiagnostics` documented. Event persistence now decoded:
`preserveEvents`/`preserveProtoEvents` write reboot-surviving
buffers; `restoreEvents` validates length + SHA256 hash (`Error,
SHA256 hash check failure`); `optOutExempt` flag; bounded-space
drop policy (`Can't grow space. Losing event %s`); proto-event
upload with bounded retry (`attempt %u, retrying in %u seconds`).
The periodic uploader + metric schemas are still not fully mapped.

### Audio taps — PARTIAL (deepened)
`audiotap_manager`, `datatap`, `spdiftap`, `/snapshotspdiftap`,
`/downloadspdiftap` — PCM capture taps; the two endpoints' params +
responses now in `decoded_handlers`. SPDIF-tap file handling decoded
with the SPDIFParser: `audiotap.spdif`, metadata-version checking
(`tap: %d, expected: %d`), audio/metadata truncation detection,
`!!!!! rewinding audio tap !!!!!`, read-size mismatch errors. The
raw buffer serialization layout remains undocumented.

### Update machinery — PARTIAL (deepened)
`auto_update_scheduler`, `user_update_scheduler`,
`migrationmanager` (`Bad Migration Data`), `upgrade*.log`,
`/softwareDownload`, `/testenv` update-URL override. Scheduling now
documented (`scheduler_detail`): `<updateScheduler>` status XML
(AutoUpdate/State/Window/UpgradeManager/HoursPending/ActiveDevice
List), update gates (upcoming alarm, active devices, window trim),
ST_SCHEDULED_POST_WOW/ST_SESSION_MONITOR states, the updateHHStatus/
updateZPResult/updateHHResult household rollout protocol with
RINCON_%s01400 per-device results, retry FSM, report files, and the
`/firmware/swgen/%u/latest/` fetch path. User-initiated update
failure taxonomy + `upgrade_mgr_user_report_prev.json` + timezone-
table download lifecycle recovered. Staging details and the
migration FSM remain thin.

### Media-player abstraction — substantially decoded
`media_player_mgr` (`mediaplayermanager` domain; per-player config +
anacapa_logger.toml registration; actor model with target keys
{uuid,ix,port,ssl,mtls}), `media_player_autoplay` (linein.homeTheater/
airplay/bluetooth source classes, Spotify-VLI autoplay, coordinator
resolution, wakeMissingPlayers WoW machinery, AVT/queue backup-
restore), `media_player_vli_ctrl` (session callbacks,
VliSession/VolumeProcessingComplete events, scopeVliCtrl,
x-sonos-vli protocolInfo, VLIGroupIDs). Per-source-mode vtable map
still undocumented.

### Group/object model internals — PARTIAL (deepened)
`group.cxx`, `group_playeronly`, `group_locationandplayer`,
`play_state_mgr`, `zones_mgr`/`zones_storage` + `zones.json`. ZGT is
documented; zones_storage deepened (schemaVersion/zones-data-array
file format, setup/migration path, gainTrimDB remote apply,
{activateZone,updateActiveZone,joinZone,updateZoneMemberSettings}
forwarding vocabulary). The internal group FSM behind ZGT isn't.

### Buttons/IR — PARTIAL (deepened)
`longpress` (gesture detection), `irdecoder`, `irconfig.txt`,
`button_triggered.xml`. Button-event vocabulary recovered:
BUTTON_{PLAYPAUSE,VOL_UP,VOL_DN,MICMUTE}_{PRESSED,HELD},
MICMUTE_SWITCH, VOL_UP+VOL_DN setup-ready combo, 'Becoming standalone
due to button press' group unjoin, `ir code submitted with guid %s`.
zp-level FSM now decoded: `playback#skipBack`/`playback#
skipToNextTrack` dispatch by group UUID, play/pause toggle with
un-mute-instead-of-pause fallback + fast-volume-zero clear,
`zp_pre_setup_state`, demo-mode IR remote learn loop (success/
code-not-in-DB/timeout/fail outcomes). IR protocol decode mechanics
remain undocumented.

### Muse API semantics — substantially decoded
282+ cloud routes + 1116 bound local routes; per-route request/
response spec-pair schemas recovered for all bound ops (see the
muse section above); outbound ops' request shape is the per-namespace
verb vocabulary; local outbound `%s`-route surface (group playback/
volume fan-out, settings fetch, websocket, log_event) catalogued.
Auth requirements partly documented via runtime_policy + authz
namespaces; which routes are exercised on model-9 remains open.

### Lechmere/websocket — PARTIAL (deepened)
`websocket_lechmere` confirmed; frame format + AA..AK registry +
migration-field dual-use + pseudo-HTTP payload parse all documented;
local `/api/v1/websocket` server surface catalogued (`ws_server`);
per-code message semantics remain data-driven (static ceiling).

### Cloud queue — substantially decoded
`/cloudqueue`(+`poll`), `trackQueueAdditions`, `CloudQueueHistory`,
rating gating, cqfsm states/ops, request params, per-item window
schema, headers, retry policy — all in `cloud_queue` (see Part 1
above).

### Remaining buses — PARTIAL (deepened)
`hwmessage` netlink documented at boundary; `nodetx` NACK/resync/
crossfade transport behavior covered under `chsrc_chsnk`; `ipc_msg`
netstartd wire format + message types recovered; `{sntppoll` block
covered under `sntp_server`. `snf` log domain is a static dead end —
only the log filename `anacapa.snf.log` exists, no literal domain
tag or message strings were found.

### Sonos Business MSP — covered
`business_msp` record: `AddRemoveSonosBusinessMSP`, `Sync Sonos
Business MSP` managed-service-provider hooks catalogued.

### Power management / SemiSleep — covered
`semisleep_power` record: `enableSemiSleep`, `featureConfigSemiSleep`,
`powerWakeupFromSemiSleep`, `enableHTSourceSleep`,
`int_internalSuspend`, `AmplifierPowerStateChanged` event,
`HT_POWER_STATE`, `DirectControlIsSuspended` state variable,
`AHA_SUSPEND_VLI_SESSION` + `onVirtualLineInSuspendSession`,
wake-lock guards, WoW wake machinery for vanished members — a real
suspend/resume engine with wakeup-listening, now catalogued.

### Log domain map — covered
`log_domain_map`/`log_domains` records: the 21-domain list decoded
as a subsystem boundary map (`alarm.job`, `avt.play`, `chsrc.state`,
`dc`, `ext.audio.action`, `gm.events`, `hdmi`, `ht`, `hw.events`,
`lechmere.event`, `musecmdandrsp`, `musedebug`, `museevt`, `rc.upnp`,
`snf`, `spotify.debug`, `spotify`, `sps`, `trueplay`, `tv`, `vl`).

### Model/SKU vocabulary — VOCAB
`ZPS9` (this unit) through `ZPS61`, `S0`/`S1`/`S4`/`S5`/`S8`/`S9`,
product names (`Sub`, `Port`, `Beam`, `Arc`, `Move`, `Roam`, `Era`,
`One`) embedded as capability-conditional strings — the model→
capability map this build was compiled for is not tabulated.

### Hardware-gated-but-present — VOCAB
Bluetooth (`hardwareStatus/bluetooth` routes), HDMI-CEC, AirPlay
(`/tmp/AirPlay.log`, VLI-resume-after-AirPlay) compiled in; fault as
unsupported on model-9. Vocabulary noted; protocol mechanics not.

### Multi-daemon system boundary — PARTIAL (deepened)
anacapad is one process of many: `btmanager`, `wacd`, `netstartd`,
`sonosledmgrd`, `sonospowercoordinator`, `mdnsd`, `sddpd`, `chronyd`,
`dropbear`, `udhcpc`, `wpa_supplicant`, `upgrade_mgr`.
`multi_daemon_boundary` + `daemon_ipc` records cover the
`/X-external` routes, watchdog/sentry surface, crash machinery, and
the netstartd IPC wire format (12-byte `{A,B,len}` header +
`{id,payload}`, id-31 dispatch table); `ReadIPCHeader` field
semantics unresolved (libsonos import).

### Runtime state/flag vocabulary — covered
`runtime_flag_files` record: `/tmp/` flag-file semantics
(`device_unlocked_flag`, `brokendevice`, `wifidisabled`,
`crashed_play_state`, `event_preserve`,
`anacapa_prevent_crashdump_upload`, `fresh_hh.txt`, `memorylog` ring,
`htdocs_locked`, `upgrade_mgr_info.txt`, `wifi_card_mac_addr`,
`udhcpc_resp_mac_addr`), `/var/run` markers (`netmanager_extender_
flags`, `systemtimeoffset`, `wac_mode`), `/tmp/smb` scratch.

### IBT command plans + `enablePitchfork` — substantially decoded
IBT = intended-target command fan-out (not in-band tuning):
implicit/explicit `intendedTargets` parsing, per-target
`[dispatch]`/`[group]` results, players-or-areas addressing, bearer
+ `X-Sonos-Type` auth, `enablePitchfork` gate, 13-verb zones
registry at `0x11094380`. Plans are in-memory only — no serialization
format exists to recover.

### Embedded SQLite — PARTIAL
`libsqlite3` linked; `LocalTimer from sqlite3 stmt` — local timers
persist in SQLite. Timer DDL schema catalogued among persistence
formats; other tables undocumented.

### Factory reset machinery — PARTIAL
`factory_reset` record: `factoryReset.txt` sentinel,
`sonosFactoryResetFull`, `LED_MODE_FACTORY_RESET`,
`manufacturingData` retrieval, remote `management/factoryReset` muse
route, `not factory reset` checks, `/reset` + `/factoryreset` forms,
vanished-list cleanup. Reset levels/what's preserved partially
recovered.

### Playlist/container parsers — VOCAB
`mswmext=.asx`, `audio/x-mpegurl`, `application/vnd.apple.mpegurl`,
`application/dash+xml` — the metadata parsers for ASX/M3U/HLS/DASH
live below the URI layer; not documented as formats.

### Favourites data model — VOCAB
`favorites.cxx`, `FV:` grammar + GC variants, `NextFavorite`
replication, `trFavorites`/`alFavorites` — enumerate/mutate semantics
undocumented (see also Part 1).

### Feature-flag registry — covered
`feature_flag_registry`/`feature_config`/`feature_flags` records:
`featureConfig*` compile/config flags enumerated (`DropoutContext`,
`HomeTheaterWifiPerfTelemetry`, `MetricsService`, `Plink`,
`Quickbonding`, `SemiSleep`, `SmartPlay`, `SpotABR`,
`SsdpAdvertiseConfig`, `ZoneExperiment`) — the feature map of this
build, complementing `capabilities` hardware gates.

### A/B experiments framework — PARTIAL
`<ZoneExperiments>` doc + `<ZoneExperiment id name value
defaultValue>` + `experimentId` + `/experiments` /status endpoint +
`featureConfigZoneExperiment` — catalogued; assignment/bucketing
undocumented.

---

## Still open, ordered by leverage

Everything below is now catalogued with evidence; what's missing is
the deep semantic layer:

1. **Muse op internals** — spec grammar fully decoded
   (`{fieldName,typeName}` pairs, unions, `none`/`upnpEvent`,
   `table[3+i]` indexing, `f_109ecb5c`/`f_109ecb90` lookups); all
   1116 extracted routes carry decoded member lists; still missing:
   per-field requiredness/defaults and inner schemas of opaque
   payload objects (e.g. `trueroomEstimatedParams` inner fields —
   never stringized)
2. **Lechmere inner payloads** — largely resolved: msgType-3 frames
   carry v{api}:{ns}#{cmd} where ns/cmd = the muse resource/verb space;
   events ride the inprocess-events bus with {json} payloads. The "TLV
   header" read is mercury/AP (Spotify) framing, not lechmere
3. **Spotify eSDK internals** — module map + Connect surface decoded
   (/spotifyzc zeroconf action vocabulary); AP packet layer recovered
   (7-byte TLV header, 16KB cap, per-packet MAC); mercury/hermes
   message-type semantics still untouched
4. **Chirp profile parameters** — RESOLVED: complete profile JSON
   grammar recovered (protocol-acoustic + encoding + decoder-config
   key sets, four built-in profiles incl. sonos-cdma, RS/CRC frame
   limits ≤256 bytes/symbols). The per-profile numeric values are
   baked into `new_chirp_builtin_profile` struct initializers rather
   than a static JSON blob — extracting exact Hz/timing values would
   need a deeper struct-init decode.
5. **`/status` + master-route schemas** — master HTTP route table
   decoded (~78 records @ 0x11090c00 stride-0x1c) plus the full
   `/status` page registry (stride-12 @ 0x11090144-0x11090b6c:
   exec/file/module page families, 59 module routes mapped); ~36
   output schemas harvested; the ~7 remaining pages delegate to
   member-dump vfuncs on classes with no RTTI — static ceiling
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
7. **Certificate wire flows** — selector + id→object path proven;
   registration refresh/complete URL grammar + signing-key-over-IPC +
   nine device-registration muse verbs recovered; still unresolved:
   CSR/request-body inner structures and runtime cert-object layout
8. **SemiSleep/WAC/factory-reset state machines** — records exist
   (`semisleep_power`, `wac_mode`, `factory_reset`, `zone_topology`);
   WoW wake machinery for vanished members documented; full FSM
   transition tables not walked
9. **IBT plan format** — substantially decoded (post-`4ef58a2`):
   IBT = cloud-issued command fan-out to intended targets
   (players/areas); `[dispatch]`/`[group]` vocabulary recovered
   (per-target results, bearer + `X-Sonos-Type` auth, group
   add/create/forward ops); 13 `zones`-namespace verbs bound via the
   registry tail @ `0x11094380`. Remaining: the exact IBT-eligible
   command whitelist (plans are in-memory only — no serialization
   format exists)
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
9d. **Trueroom estimator payloads** — RESOLVED (post-`99876cb`,
   `b731f2b`): all 5 ops ARE spec-bound; request/response field:type
   schemas decoded; `trueroomEstimatedParams` resolved as a
   member-map key in the estimator container — inner fields never
   stringized (positional serialization, static ceiling)
9e. **`/status` flag semantics** — analysed (post-`c258d4b`): not
   page-type bits; per-page bitmask, `0x80` = prefix-mount; support-
   bundle section-mask hypothesis; exact bit semantics unproven
10. **XML schema clusters** — element lists recovered; attribute
    types/ranges/defaults mostly unvalidated against parsers
11. **86.8↔86.10 cross-version diff** — DONE at string/structure
    level (post-`63ab617`/`8df48e8`): normalized `.rodata` literal
    diff (21765 vs 21635 → 204 new / 96 removed), muse v1 route
    diff (+6/−2), `DT_NEEDED` identical (35 libs), `.dynsym` delta =
    one dropped `__atomic_compare_exchange_8` import, `/status` and
    all slash-path tables identical, dispatch surface confirmed
    frozen. Findings recorded under `rodata_diff_868_vs_8610` in
    `docs/crossbuild_matrix.json`. Remaining: no function-level
    diff (e.g. per-handler codegen), no sonos-muse-1.0 `.so`
    extraction of the moved muse-common code
