# anacapad — Reverse-Engineering Report

Static analysis of the stripped PowerPC big-endian `anacapad` zone-player
firmware (`86.10-80260-1-9`), the Sonos OS component that implements the
UPnP/SOAP control surface, GENA eventing, secure WebSocket eventing, the HTTP
diagnostic/API surface, and the client stack that talks to other players and
the Sonos cloud (Muse). All findings are recorded with firmware evidence in
`docs/documentation.json`; this document is the human-readable synthesis.

**Status.** Database complete at the static-evidence ceiling:
`1250/1250` documentation units, `0` structural errors, `0` semantic
incompletes, `0` lint warnings, `23/23` tests. Every named service, action,
argument, error path, event variable, route, protocol, library and component is
documented with a firmware address or an honest confirmed-absent / runtime-bound
note.

---

## 1. Architecture

anacapad is a self-contained UPnP control point **and** server plus a cloud
(Muse) client. It is not a thin HTTP wrapper — it owns the full media/session
state machine and coordinates with the rest of the zone-player OS through
native IPC buses.

- **Server side** — UPnP SOAP control on `:1400` (17 services / 199 actions),
  GENA event subscription on `/Event`, a large HTTP diagnostic+admin surface
  (102 routes), SSDP/mDNS discovery, and a local WebSocket endpoint.
- **Client side** — outbound UPnP GENA subscriptions to other zone players,
  a secure WebSocket (`lechmere`) command channel to Muse, an outbound REST
  client (324 `{scope,path,cmd}` cloud op tuples), nghttp2 transport, and the
  SMAPI music-service SOAP client.
- **Native buses** — `libhwmessagelib` protobuf hardware bus (9 multicast
  groups), nodetx inter-zone block transport, CHSRC/CHSNK group-audio fabric,
  settings-replication, and the `internalevts` intra-process event bus (84
  event types).

## 2. UPnP/SOAP control surface

- **17 services** across `/Control` endpoints: AlarmClock, AudioIn,
  DeviceProperties, GroupManagement, HTControl, MediaRenderer{AVTransport,
  ConnectionManager, GroupRenderingControl, Queue, RenderingControl,
  VirtualLineIn}, MediaServer{ConnectionManager, ContentDirectory},
  MusicServices, QPlay, SystemProperties, ZoneGroupTopology.
- **199 actions**, **363 inputs**, **208 outputs**, **172 fault paths** —
  all dispatch-mapped and argument-described.
- **Argument type system** — the shared parse layer builds an
  `arg-descriptor` per input. Type tag at `+0x4`:
  `1=bool, 2=int32, 3=int16, 4=uint32, 5=enum, 7=string, 8=optional-ptr`.
  String args carry a **concrete buffer cap** extracted per action
  (e.g. `StartLocalTime`=9 for `HH:MM:SS`, `ProgramURI`=0x401,
  `ProgramMetaData`=0x1001, `RoomUUID`=0x19). Scalar descriptors use an
  embedded 24-byte inline buffer (ctor family `f_105614ac`/`f_10561514`/
  `f_105615a8` for types 3/5/8). Outputs are emitted by a formatter family
  (`f_1055fcXX` → `%u`/`%d`/`%lld`/`'0'/'1'`/strlcpy into `this+0x30`).
- **Envelope/fault grammar** —
  `<s:Envelope><s:Header><s:Body><u:{action}{Response} xmlns:u={serviceType}>`;
  faults are `<s:Fault><faultcode>s:Client</faultcode><faultstring>UPnPError
  </faultstring><detail><UPnPError xmlns=…control-1-0><errorCode>` — the
  concrete error-code values are implementation-supplied at runtime.
- **Param redaction** — SOAP params are flagged `secure`/`sensitive`/
  `trackIDing`; redacted params are excluded from request logging
  (`not logging %s, sensitive`).
- **Targeting** — `X-SONOS-TARGET-UDN: uuid:%s` directs an action to a
  specific bonded-zone member (stereo pair / HT satellite) via the
  coordinator proxy.
- **Hidden/stub actions** — AudioIn dispatcher (`0x1073d8f8`) is a
  reject-all stub emitting 401 in this build; its 6 SCPD-advertised actions
  are unimplemented and the service is absent from `serviceList`.
- **Advertised vs dispatched** — the SCPD serviceList advertises **207**
  actions across 17 service instances (ConnectionManager counted once but
  served by both MediaServer and MediaRenderer); the binary dispatches
  **199**. The 8-action delta is fully accounted: 6 AudioIn stub actions +
  2 SystemProperties actions **removed** in 86.10.
- **Service descriptions (SCPD)** — `device_description.xml` (htdocs, the
  served `#TOKEN#` template with 35 substitution tokens) **does** advertise
  16 `<SCPDURL>/xml/<Svc>1.xml` entries. The SCPDs are the authoritative
  argument source — they resolved the 41-input gap in the four bulk/group
  actions the extractor could not reach via the parse-descriptor layer.
  ContentDirectory's `serviceType` is a `#CD_NAMESPACE#` runtime token
  (upnp-org vs sonos-com), matching the `firmware_differences` URN records.
- **Removed actions (firmware diff)** — `ProvisionCredentialedTrialAccountX`
  (in `{AccountType,AccountID,AccountPassword}`, out `{IsExpired,AccountUDN}`)
  and `ResetThirdPartyCredentials` are advertised in `SystemProperties1.xml`
  but absent from the 86.10 dispatch table: the former's name string is
  entirely missing, the latter's is a dead string (`0x10f184cc`, zero refs).
  The SystemProperties name-table at `0x10f110f0` (stride `0xc`,
  `{name_ptr,action_id,0}`) holds the surviving 15 actions.

## 3. Eventing

Three distinct mechanisms:

- **GENA (local)** — `SUBSCRIBE`/`UNSUBSCRIBE`/renew on `/Event`;
  `<e:propertyset>/<e:property>` notifications with `NT: upnp:event`,
  `NTS: upnp:propchange`, `SEQ:`, plus `X-RINCON-BOOTSEQ`/`X-RINCON-VARIANT`
  extensions. 403 on denial. `upnpovertls`/`securehhSSLPort` provide secure
  eventing.
- **LastChange templates** — AVTransport (`metadata-1-0/AVT/` +
  `r:` rinconnetworks ns), RenderingControl (`metadata-1-0/RCS/`), Queue
  (`schemas-sonos-com:metadata-1-0/Queue/`, proprietary). Complete emitted-var
  schemas recovered, including channel-scoped `Master`/`LF`/`RF` fields and
  literal `NOT_IMPLEMENTED`/`NONE, NETWORK` values.
- **WSS secure eventing** — a runtime registry of **73** event selectors
  (`{index, name, eventID, tag}`) populated at `f_10098d34` and resolved by
  `f_109e10d8`. This is the cloud/Muse event vocabulary — many entries
  (entitlements, settings, topology, trueplay) have no one-to-one local SOAP
  variable.

## 4. HTTP surface

**102 routes**, all handler-addressed and semantically decoded:

- `/status` — 61-entry file-serve map + flag/capability bits; the served doc
  grammar is fully recovered (~400 elements) including SonosNet PSK material,
  entitlement rows, task state, LED pattern scripts, lechmere connection
  stats, and the `wss://…(muse)` NotificationAddr.
- Admin/debug — `/testenv`, `/logger`, `/advconfig`, `/testpoint`, `/pcap`,
  `/ping`, `/traceroute`, `/forcegtkrekey`, `/mdnsannounce`, `/info`,
  `/jobs`, `/customsd` (SPDIF data-tap), `/tools`, `/musedebug`, `/devmode`,
  `/unlock`, `/sonarctl`, `/getaa`, `/indexrepl`, `/getrs`, `/getsetting`,
  `/fcs`, `/ttm_helper`.
- `/support/*` — directsubmit/review/aggregate (+manifest)/asyncsubmit/
  reportstatus/networkmatrix, and the diagnostic task registry
  (`{cmd-or-path, aux, flags}` triples).
- `/msprox` — the **custom SMAPI service-registration form** (SID 240-253/255,
  4 auth policies `{UserId,Anonymous,DeviceLink,AppLink}`, container types
  `{MService,SoundLab}`, 22-capability schema).
- `/spotifyzc` — Spotify ZeroConf (`getInfo`/`addUser`/`resetUsers`).
- `/websocket/api` — local Muse websocket endpoint.
- `/api/v1/*` — provider-registry REST surface (households, locations/
  effectiveSettings, players, websocket, trueplay).

## 5. Cloud / Muse (lechmere + REST)

- **lechmere** — outbound ws to `lechmere.%s.ws.sonos.com`, subprotocol
  `Sec-WebSocket-Protocol: lechmere.%u`, wire grammar
  `v{apiVersion}:{ns}#{cmd}({args})` with ctx `{householdId, intendedTargets,
  explicitTargets, muse-async-cmd-id, upnpAnacapaPort}`. Per-namespace authz
  via policy-key roles. Recovered commands: `loadPlaylist`/`loadFavorite`/
  `loadContainer`/`loadTrackList`/`loadStream`/`getMetadata`/`muse_alarms`,
  plus the tunneled UPnP action set (autoplay, chirp, stereo-pair, LED).
- **Outbound REST** — 533 route literals + **324 `{scope,path, cmd}` tuples**
  covering 22 household / 30 player resources, 15 `upnp*` SOAP-mirror proxies,
  `pinewood` remote-control ops, `svc` voice channel, timers, `networkTest`.
- **Runtime policy engine** — `lechmere` authz (role+version policies,
  `VF_AUTH_*` violations, P2P encryption gates); `R_MuseDuckingPolicy` and
  `RRuntimeZPPolicy` gates.
- **Feature experiments** — `<ZoneExperiment id name value defaultValue>`
  under `O_ZONE_EXPERIMENTS`/`featureConfigZoneExperiment` — cloud A/B flags.
- **System overrides** — 66 `O_*` keys redirect backend endpoints at runtime.

## 6. Media / audio

- **`protocolInfo`** — complete renderer capability set: `http-get`/`x-file-
  cifs` + `{mp3,mp4,x-m4a,mpeg,*mpegurl,dash+xml,wav,wma,aiff,flac,ogg}`,
  `sonos.com-{mms,http,spotify,rtrecent}`, `x-sonosapi-{stream,hls,hls-static,
  radio}`, `x-rincon-*`, `real.com-rhapsody-direct`, `pandora.com-pndrradio`,
  `audio/vnd.radiotime`; MIME types incl. `application/sonos_service_catalog.
  v1.xml` and RFC 7396 `merge-patch+json`.
- **Decoders** — FFmpeg `libavcodec.so.59`/`avformat`/`avutil`, `libmpg123`,
  `libdcadec` (DTS), `libsbc`/`libsonossbcpacket` (Bluetooth SBC, dual
  encode/decode).
- **Distribution** — CHSRC/CHSNK multicast group-audio fabric, VLI transport
  over nodetx (`nodetx_vli`/QoS), HT satellite channel-processing
  (`htaudio_chsnk_processor*`), distributed ducking (64-bit flag bitmasks
  exchanged across zones with heartbeat+TTL), seamless-delegation (`sdbt`
  handoff packets + seek-position transfer).
- **AirPlay/Bluetooth/QPlay** — all surfaces present; QPlay advertises
  `QPlay:2` as `qq:X_QPlay_SoftwareCapability` with `QPlayAuth(Seed,MID,DID)`.

## 7. Security / identity / persistence

- **Registration** — signed registration req/resp, registered-device client
  cert, certval X509 chain validation, quarantine gate, `X-Sonos-DeviceCert`/
  `X-Sonos-Device-Id`/`X-Sonos-Api-Key`/`X-Sonos-Corr-Id` headers,
  `/regcert`, token endpoints, `int_addAccountWithOAuthToken`.
- **Root certs** — `/certbundles/v4/trusted_roots.rcb` + ETag conditional fetch.
- **TLS** — mbedTLS stack with session tickets, resumption, ALPN, cipher
  configuration; HTTP/2 via nghttp2.
- **Secure pairing** — `sp_tlv` AP-link frames (7-byte `tag/type/len` record
  + MAC verification), identified as esdk `mod_ap_conn`; `secure eventing`
  (UPNP_OVER_TLS + securehhSSLPort).
- **Persistence** — SQLite `timer.db` (timers + paused_timers), queue backup,
  `householdsettings.json`/`netsettings.txt`/`anacapa.conf` config grammars,
  settings-replication (`nodetx`/`replicated_settings`,
  `<ReplicatedNetSettings>` version/LUD handshake), SMB2 sharelist +
  `svcmanifests.json`.
- **Wi-Fi/SonosNet** — `wifictrl` command channel, netstartd-mediated config,
  breadcrumb recovery, `dev_wifi` state descriptor, SonosNet channel-change
  propagation, `assoctracker` health/rssi, `wifiPowerSave`.
- **Hardware bus** — `libhwmessagelib` protobuf: 9 multicast groups
  `{HT,LED,BUTTON,TEMP,SENSOR,BATTERY,CAPZONE,SWITCH,AUDIO}`, consumed by
  `selthrd.RHWEvtHandlerZP`; complete button/orientation/gesture event
  vocabulary.

## 8. Dependencies (`DT_NEEDED`, 35)

`libwifi`, `libhwmessagelib`, `libsonoscrypto`, `libsonosminiutils`,
`libsonos-mdp`, `libflash`, `libatomic`, `libmbedtls`/`libmbedx509`/
`libmbedcrypto`, `libz`, `libsonos-time-c`, `libsonos-certval`,
`libsonos-root-cert-bundle`, `libtomlc99`, `libprotobuf-nanopb`, `libdns_sd`,
`libsyslib_hal`, `libmpg123`, `libsmb2`, `libsbc`, `libsonossbcpacket`,
`libsqlite3`, `libavcodec`/`libavutil`/`libavformat`, `libanl`,
`libsonoseventreporter`, `libsonosutils`, `libdcadec`, `libm`, `libgcc_s`,
`libpthread`, `libc`, `ld.so`.

## 9. Confirmed negatives

- **AudioIn not advertised** — `AudioIn1.xml` exists as a file but the service
  is omitted from `serviceList` and its dispatcher rejects all actions (401).
  (Correction: the earlier "no SCPDURL" claim was wrong — the served
  `device_description.xml` htdocs template *does* advertise 16 SCPDs; the
  error came from grepping the binary's generated-doc path rather than the
  htdocs file that is actually served.)
- **No netstart2 / MRPC in anacapad** — the IPC surface is present as a
  client of the separate `netstartd` daemon, not an implementation.
- **`sp_<md5>` literals** — esdk per-module log-channel hashes, not protocol
  identifiers.

## 10. Static-evidence ceiling

The `97` "unresolved error domains" and the `93` material action unknowns are
**terminal**, not gaps: they are implementation-return-code passthroughs where
the binary surfaces a delegated worker's return value verbatim and no literal
exists to extract. They are bounded by worker exit-scan and honestly labeled
with `proven`/`unknown`/`evidence` — resolving the concrete code set requires
executing the binary, which is outside static scope.
