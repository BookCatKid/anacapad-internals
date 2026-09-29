# HTTP / non-SOAP surface

Endpoints and HTTP-layer behaviors recovered from the binary outside the SOAP control path. All are static-analysis records.

## `http_status_endpoints`

The player's built-in diagnostics website. Opening http://<player>:1400/status/ in a browser exposes ~63 pages of live internals — network stats, wireless scan results, CPU/thread info, settings stores, update state — plus passthroughs to shell commands (ifconfig, netstat, ps) and /proc files. It's the same tool Sonos support uses; some pages accept writes (setstring/removestring) so treat it as a control surface.

**Technical description:**

- **name:** /status diagnostic web-handler vocabulary
- **role:** embedded HTTP diagnostics/status UI (htdocs at /opt/htdocs); sub-handler names recovered as literal path strings clustered at 0x10e75c5c-0x10e75f80 + ZPInfo field names at 0x10e73e21-0x10e743ad + shell/proc passthrough at 0x10e74f50-0x10e75b00
- **subhandlers** (63):

  ```
  activeZones, ai_speech_enhance, alarm, audiocore, cloud, cloudqueue, cpumon, decoder, dmesg, dnscache, dropout_triggered, enetports, ethportstatistics, experiments, hardwareevents, hls, leds, libraries, location_settings_update, musicservices, netsettings, perfcounters, playmode, regcert, registration, renderingcontrol, root_cert_bundles, rss, settings/effective, settings/location, settings/player, shares, spdiftap, ssidlist, ssl_client_cache, syssettings, temperature, track_queue_summary, tracks_summary, trueplayinfo, tvprocessor, update, upnp, wireless, raw, musedebug, device_account, backtrace, watchdogs, threadinfo, devmode, unlock, hangup, settings, ranges, removestring, setstring, mdnsannounce, spotresetnts, sonos_log, debug/prevent_wdog_sigkill, debug/dsp, dsp/eqdata.txt
  ```
- **zpinfo_fields** (44):

  ```
  ZoneName, NetworkHash, DHCPServerMac, NetworkIPAddress, NetworkMask, DiagLevel, DevMode, DeviceInfo, build, ZoneIcon, Configuration, LocalUID, SerialNumber, SoftwareVersion, BuildType, SWGen, SoftwareDate, SoftwareScm, HHSwgenState, MinCompatibleVersion, LegacyCompatibleVersion, HardwareVersion, DspVersion, SeriesID, MfgLocation, DateCode, HwFlags, HwFeatures, Variant, GeneralFlags, IPAddress, MACAddress, Copyright, ExtraInfo, HTAudioInCode, IdxTrk, MDP2Ver, MDP3Ver, Unlocked, HwFailure, RetailMode, HouseholdControlID, LocationId, ZPInfo
  ```
- **shell_passthrough:** `date`, `ls`, `df`, `du`, `free`, `ifconfig`, `lsmod`, `mount`, `netstat`, `chronyc ntpsources`, `ps`, `route`, `scanresults`, `wifi/athconfig`, `brctl showmacs/showports/showstats/showstp`, `uptime`
- **proc_passthrough:** `/proc/ath_rincon{,_ath1}/{device,dfs,fullstatus,mibcc,nf,phyerr,roam,station,status,primary}`, `/proc/driver/{accel,audioctl,fpga/{circ,data,reg},gravity-vector,ledctl/status,tas5708/data,tdm/{regs,rxring,stats,txring},temp-sensor}`, `/proc/fs/cifs/DebugData`, `/proc/{interrupts,slabinfo,timeinfo}`, `/proc/net/{arp,netstat,snmp,sockstat,tcp,udp}`
- **debug_files:** `/jffs/irconfig.txt`, `/jffs/localsettings.txt`, `/jffs/settings/{alarmclock.xml,areas.json,cloudconfig.json,householdsettings.json,zones.json,zpMetricsConfigV2.xml}`, `/jffs/{recovery,recovery_prev,upgrade,upgrade_prev,upgrade_tmp_prev,watchdog.dmesg,watchdog}.log`, `/jffs/sys/log/setup*`, `/opt/log/anacapa.{alarm.job,avt.play,chsrc.state,dc,ext.audio.action,gm.events,ht,hw.events,lechmere.event,musecmdandrsp,musedebug,museevt,rc.upnp,snf,spotify.debug,spotify,sps,trueplay,vl}.log`, `/opt/log/{chronyd,dropbear,ledmgr.debug,netstartd,sddpd}.log`, `/opt/log/mdnsd.log`
- **status:** confirmed
- **note:** path literals proven in rodata; per-handler behavior not decoded; presence of a path string does not prove handler registration order
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e75c5c, notes: subhandler string cluster
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e73e21, notes: ZPInfo field cluster
- **route_table:**
  - **address:** 0x110908c8
  - **stride:** 12
  - **layout:** {cstr* path, u32 flags, fn* handler}
  - **routes:**
    - path: /accounts, flags: 2, handler: 0x100ba480
    - path: /activeZones, flags: 2, handler: 0x100b9298
    - path: /ai_speech_enhance, flags: 2, handler: 0x100ba8b0
    - path: /alarm, flags: 2, handler: 0x100b9278
    - path: /analoglinein, flags: 2, handler: 0x100bced0
    - path: /api, flags: 0x82, handler: 0x105eb124
    - path: /audiocore, flags: 2, handler: 0x100bb008
    - path: /backtrace, flags: 2, handler: 0x100b9260
    - path: /button_triggered.xml, flags: 2, handler: 0x100b91d8
    - path: /cloud, flags: 2, handler: 0x105eb2c8
    - path: /cloudqueue, flags: 0x82, handler: 0x100babc0
    - path: /cpumon, flags: 0xe, handler: 0x100b9200
    - path: /decoder, flags: 2, handler: 0x100bc068
    - path: /device, flags: 2, handler: 0x100bf634
    - path: /dmesg, flags: 0xa, handler: 0x105eaba4
    - path: /dnscache, flags: 2, handler: 0x100b91f4
    - path: /dropout_triggered.xml, flags: 2, handler: 0x100b91bc
    - path: /enetports, flags: 0xb, handler: 0x105bc7cc
    - path: /ethportstatistics, flags: 0xa, handler: 0x105bc918
    - path: /experiments, flags: 2, handler: 0x100b9170
    - path: /hardwareevents, flags: 2, handler: 0x100b9aac
    - path: /hls, flags: 2, handler: 0x100bacfc
    - path: /htconfig, flags: 2, handler: 0x100bb144
    - path: /leds, flags: 0x82, handler: 0x100b9158
    - path: /libraries, flags: 2, handler: 0x100b9140
    - path: /location_settings_update, flags: 2, handler: 0x105eaf20
    - path: /musicservices, flags: 2, handler: 0x100b9120
    - path: /netsettings.json, flags: 2, handler: 0x105eac48
    - path: /netsettings.txt, flags: 2, handler: 0x105eac18
    - path: /opt/log/mdnsd.log, flags: 6, handler: 0x100b9030
    - path: /perfcounters, flags: 0xe, handler: 0x100b9004
    - path: /playmode, flags: 6, handler: 0x100bbe98
    - path: /policy, flags: 2, handler: 0x100bc97c
    - path: /radiolog, flags: 2, handler: 0x100b8ff8
    - path: /regcert, flags: 2, handler: 0x105eb984
    - path: /registration, flags: 2, handler: 0x105eb17c
    - path: /renderingcontrol, flags: 2, handler: 0x100b8f2c
    - path: /root_cert_bundles, flags: 2, handler: 0x105eb9a0
    - path: /rss, flags: 2, handler: 0x105eadb8
    - path: /settings/effective, flags: 2, handler: 0x100b8ef8
    - path: /settings/location, flags: 2, handler: 0x100b8f14
    - path: /settings/player, flags: 2, handler: 0x100b8edc
    - path: /shares, flags: 2, handler: 0x100b8ebc
    - path: /spdiftap, flags: 2, handler: 0x100bd810
    - path: /ssidlist.txt, flags: 2, handler: 0x105eac30
    - path: /ssl_client_cache, flags: 2, handler: 0x105eb9ac
    - path: /syssettings, flags: 2, handler: 0x105eada0
    - path: /temperature, flags: 2, handler: 0x100b8dcc
    - path: /topology, flags: 0xa, handler: 0x105eaafc
    - path: /track_queue_summary, flags: 2, handler: 0x100baa84
    - path: /tracks_summary, flags: 2, handler: 0x10108138
    - path: /trueplayinfo, flags: 2, handler: 0x100b8ea4
    - path: /tvprocessor, flags: 2, handler: 0x100bb318
    - path: /update, flags: 2, handler: 0x100b8e84
    - path: /upnp, flags: 0xa, handler: 0x105eb0b4
    - path: /wireless, flags: 0xb, handler: 0x105eab50
    - path: /zp, flags: 1, handler: 0x100bfbac
- **description:** Full registration table decoded: 59 routes at .data 0x110908c8, entry {path, flags, handler} stride 0xc. Flag values: 0x2 default GET, 0xa/0xb/0xe privilege variants (dmesg/topology/upnp, enetports/wireless, cpumon/perfcounters), 0x82 write-capable (api/cloudqueue/leds), 0x6 (mdnsd log + playmode), 0x1 (/zp root page).
- **route_semantics:**
  - **/accounts:** worker f_101b6edc: account-list doc ; emits <AccountsInfo> (f_10291974)
  - **/activeZones:** worker f_10188b88: active-zones list
  - **/ai_speech_enhance:** worker f_1023d4f0: AI speech-enhance status
  - **/alarm:** tail f_10277030(*(0x11095f88)+0xaa70,req): alarm-status doc
  - **/analoglinein:** worker f_10209018: analog line-in state
  - **/api:** f_10769d34 ctx + f_1068c79c: API-provider inventory
  - **/audiocore:** worker f_102a595c: audio-core dump
  - **/backtrace:** tail f_10196174(singleton,req): backtrace dump
  - **/button_triggered.xml:** tail f_10195c74(singleton,req,1): shared raw-trigger XML emitter (r5=1=button)
  - **/cloud:** worker f_10599c28: cloud-connection status
  - **/cloudqueue:** f_101886e0 ctx + f_10257590: cloud-queue dump
  - **/cpumon:** emits <CpuMonitor> XML via f_1023a800
  - **/decoder:** workers f_1023d4d0/f_101887a0/f_1030be10: decoder state
  - **/device:** 511i-class device-info doc: many formatters (identity/capabilities) ; emits <DeviceInfo> (0x100bf634)
  - **/dmesg:** kernel-log file emit via 0x110999f8
  - **/dnscache:** tail f_105499e4: DNS-cache dump
  - **/dropout_triggered.xml:** tail f_10195c74(singleton,req,0): shared raw-trigger XML (r5=0=dropout)
  - **/enetports:** f_10769d34 ctx + f_105bcf90: ethernet-port dump
  - **/ethportstatistics:** f_105bcf90 + formatter family f_105786a0..f_10578744: per-port statistics
  - **/experiments:** worker f_105be5c8: experiments/feature-flags
  - **/hardwareevents:** f_10769d34 + f_103c53b8/f_103c53fc + f_10184314: hw-event log
  - **/hls:** f_101886e0 + f_10257624: HLS state
  - **/htconfig:** worker f_1023d284: HT config
  - **/leds:** tail f_10183264(singleton,req): LED state
  - **/libraries:** tail f_101834a0(singleton,req): shared-library list ; emits <ThirdPartyLibraryInfo> (f_101834a0)
  - **/location_settings_update:** f_10769d34 + f_105da090: location-settings update state
  - **/musicservices:** tail f_100c7744(singleton+0x292b8,req): music-services list
  - **/netsettings.json:** worker f_1062a030: network settings JSON
  - **/netsettings.txt:** tail f_10693298(*(0x11097680),req): network settings text
  - **/opt/log/mdnsd.log:** log-file emit + log helpers
  - **/perfcounters:** tail f_10642700(*(0x110976ec),req): perf counters
  - **/playmode:** f_101886e0 ctx + workers: playback mode ; emits <PlayStateManager> (f_1045c934)
  - **/policy:** workers f_100f642c/f_10372d34/f_100fd164: policy state
  - **/radiolog:** tail f_10642700: radio log
  - **/regcert:** tail f_1055e33c(*(0x11097680)+0x8d4,req): registration cert ; emits <RootCertBundleInfo> (f_1055e33c)
  - **/registration:** f_10769d34 + f_1064b98c: registration state
  - **/renderingcontrol:** workers f_1036a76c/f_10188860/f_1036a6e4/f_1036a79c/f_100dad60: RC state dump
  - **/root_cert_bundles:** tail f_105676ac: CA bundle listing
  - **/rss:** f_10769d34 + f_10651c30: RSS/state feed
  - **/settings/effective:** tail f_101886a4(singleton,req): effective settings doc
  - **/settings/location:** tail f_101886a4(singleton,req): same settings-doc emitter (location variant)
  - **/settings/player:** tail f_10188660(singleton,req): player-settings doc
  - **/shares:** tail f_10188660(singleton+0x1aa98,req): SMB share list
  - **/spdiftap:** f_1054bdc8 + f_10240a5c: SPDIF tap state
  - **/ssidlist.txt:** tail f_106933d8(*(0x11097680),req): Wi-Fi SSID scan list
  - **/ssl_client_cache:** worker f_1056764c: TLS session-cache dump
  - **/syssettings:** tail f_106937dc(*(0x11097680),req): system settings dump
  - **/temperature:** f_10769d34 + strlcpy: temperature reading
  - **/topology:** virtual delegate: *(0x11097680)->v\[+0x84\] engine -> obj->v\[+0xfc\]: zone-topology dump ; emits <ZoneGroupState>/<ZoneGroups> (f_10743328)
  - **/track_queue_summary:** f_101886e0 + f_10265324: <TrackQueueSummary> doc
  - **/tracks_summary:** mutexed f_10988558/f_10988984 + f_102a0830: <TrackSummary> doc
  - **/trueplayinfo:** tail f_1010cf40(singleton,req): trueplay info
  - **/tvprocessor:** worker f_1023d534: TV-processor state
  - **/update:** tail f_10183588(*(0x11095f88)+0x4-0x7e0,req): update status ; emits <RoomCalibrationInfo>/<RoomCalibrationActiveState> (f_10183588)
  - **/upnp:** f_10769d34 + f_1068c6f8/f_10706c7c: UPnP/SOAP engine state
  - **/wireless:** virtual delegate: *(0x11097680)->v\[+0x84\] engine -> obj->v\[+0xfc\]: wireless state
  - **/zp:** f_100bfbac (511i): master status page - device identity, all subsystem states
- **handler_classes:** 3 classes: (a) big inline handler with workers; (b) thin tail-emitter {r3=singleton/member, r4=req, optional r5 selector}; (c) engine-singleton virtual delegate (*(0x11097680)->v\[+0x84\] -> obj->v\[+0xfc\])
- **raw_trigger_payload:** /raw and /status/{button,dropout}_triggered.xml emit <ZPSupportInfo> via f_1076b5ac/f_1076b5dc/f_1076b8ec; /dsp emits <DSPStateManager> via f_10d90388
- **route_descriptor:**
  - **address:** 0x11090000
  - **layout:** {+0x00 table 0x1109d3c0, +0x04 root-handler f_1006a690, +0x08/+0x0c name strs, +0x18 -1, +0x1c 1, +0x20 0x01000000 flags, +0x24 -> /status sub-table 0x110908c8, +0x28/+0x2c aux tables, +0x30 keepalive f_105e98ec, +0x3c f_100bbc80}
  - **keepalive:** f_105e98ec: sonosClockGetTime -> *(req_ctx)=now+0x3c (60s deadline); shared_ptr atomic-release on captured obj
  - **flags_note:** sub-route flag enforcement (0x2/0xa/0xb/0xe/0x82/0x6/0x1) happens inside the generic router path-match (f_1006a690 family) - enforcement site not pinned; values observed: 0x2 default, 0xa/0xb/0xe privileged-family, 0x82 writable, 0x6, 0x1 root
  - **root_fn:** f_1006a690 = anacapad main(): banner 'Anacapa Middleware Server 1.02 (C) Rincon Networks Inc. 2003', usage '\[-h\] \[-c config\] \[-u username\] \[-C caps\]', default conf /opt/conf/anacapa.conf, getopt jump table (optch-'C')*4 -> opts 'C'..'u', sonos_auth_become_capable(user) -> exit(1) on failure
- **flags_semantics:** route flag values are CAPABILITY BITS checked against the daemon's -C caps set (sonos_auth_become_capable): 0x2=default viewer, 0xa/0xb/0xe=elevated capability combos, 0x82=0x80\|0x2 write+cap, 0x6, 0x1=root/zp - enforced by the router's capability check, not ad-hoc auth

## `device_account_endpoint`

The /device_account endpoint handling the player's account binding — links the hardware to a Sonos account.

**Technical description:**

- **handler:** f_1065bd70
- **flow:** path claim '/device_account' (f_10655ea4) -> f_106570bc validate -> f_1065b730('int_setTransferMode') transfer-mode int; serialize device-account via f_1065a8dc(strlen+encode)/f_109cd7a4/f_1065e99c; state word *(r30+8) in {3,4} selects account variant; constant block 0x110b9044 (6 bytes) feeds the blob; f_10807034 XML append; stack-canary guarded
- **semantics:** device-account provisioning/read endpoint; response is an encoded account blob whose variant depends on registration state (3 vs 4)

## `http_chunked_strictness`

How strictly the player's HTTP parser enforces chunked transfer-encoding. Matters when a client sends unusual framing — the firmware rejects malformed chunk headers rather than guessing.

**Technical description:**

- **status:** confirmed
- **rules:** `Reject response when 'chunked' is not the last Transfer-Encoding`, `Ignore duplicate 'chunked' decoder`, `Suppress chunked TE on HTTP version >= 2`, `'Chunky upload is not supported by HTTP 1.0'`, `Missing chunk/close/size -> assume close signals end`, `chunk hex-length max bound + hex-digit validation`, `'Chunk callback failed' / 'cf_body_send last CHUNK'`, `trailers accepted: 'added last chunk with trailers from client'`

## `httpcache_manager`

- **status:** confirmed
- **file:** httpcachemgr/httpcaches.json — httpcache_manager.cxx
- **protocol:** {cacheHashes, hashLocal, hashRemote} + Force-cleared cache + Invalidated local cache + Invalidating remote caches — distributed HTTP-cache invalidation across zones w/ hash comparison

## `http_range`

HTTP Range-request support — used for seeking in streams and resuming downloads. Defines which byte-range forms the embedded server accepts.

**Technical description:**

- **status:** confirmed
- **grammar:** Range: bytes=%s + =%d-%d + =%d- ; Content-Range: bytes {0-%lld/%lld, %s%lld/%lld, %s/%lld, %llu-%llu/%llu} — 64-bit

## `muse_authhelper`

The auth helper shared by muse/websocket endpoints — checks tokens and household membership before a route handler runs.

**Technical description:**

- **status:** confirmed
- **impl:** museclient_authhelper.cxx
- **semantics:** museauth module + museAuthzCache — cached cloud-authz tokens for Muse clients

## `muse_common`

Shared muse-API plumbing — route table, JSON/request helpers, the layer every /api/v1 handler sits on.

**Technical description:**

- **status:** confirmed
- **files:** `muse/src/sonos/muse/common/circuitbreaker.cxx`, `muse/src/sonos/muse/common/context.cxx`, `muse/src/sonos/muse/common/eventing.cxx`, `muse/src/sonos/muse/common/noncehandler.cxx`

## `diagnostic_manifest`

The manifest listing which files/commands go into a diagnostic bundle.

**Technical description:**

- **status:** confirmed
- **table:** 0x11090034..0x110908c8 (~100 entries) - ordered manifest feeding /support/aggregate diagnostics
- **task_handlers:**
  - **HighResUsageMetrics:** f_100bbc80
  - **CheckOnlineUpdates:** f_100b9338
  - **UploadEvents:** f_100b937c
  - **CollectButtonTriggeredXml:** f_106455e4
  - **CollectDropoutTriggeredXml:** f_105eb628
  - **FetchCloudCfg:** f_100ba320
  - **MAReplPull:** f_100bb4ec
  - **SendPlayerConfigReport:** f_105eb7b8
  - **RefreshEntitlements:** f_100b94e0
  - **RefreshSonosRadio:** f_100b952c
  - **UploadCrashDump:** f_10254ee0
  - **SaveSSLCache:** f_100b9948
  - **SvcAccountMaint:** f_105e7978
- **shell_cmds:** `/bin/date`, `/du-jffs`, `/sbin/ifconfig`, `/bin/mount`, `/netstat`, `/ps`, `/wifi/athconfig scangetresults ath0`, `/usr/sbin/brctl showports br0`, `/showstats`, `/uptime`
- **jffs_files:** `/jffs/app/log/anacapa.log.backup`, `/jffs/app/log/upgrade_mgr.log`, `/jffs/irconfig.txt`, `/jffs/localsettings.txt`, `/jffs/settings/alarmclock.xml`, `/jffs/settings/areas.json`, `/jffs/settings/cloudconfig.json`, `/jffs/settings/householdsettings.json`, `/jffs/sys/log/setup{,_ok}/setup.{dmesg,log}`, `/jffs/watchdog.{dmesg,log}`
- **log_files:** `/opt/log/anacapa.alarm.job.log`, `anacapa.avt.play.log`, `anacapa.gm.events.log`, `anacapa.ht.log`, `anacapa.hw.events.log`, `anacapa.lechmere.event.log (websocket proto log)`, `anacapa.museevt.log`, `anacapa.rc.upnp.log`, `anacapa.snf.log`, `anacapa.spotify.debug.log`, `anacapa.vl.log`, `chronyd.log`, `dropbear.log`, `ledmgr.debug.log`, `udhcpc.log`, `wacd.log`, `wpa_supplicant.log`
- **proc_files:** `/proc/ath_rincon/{device,phyerr,roam,station,status}`, `/proc/ath_rincon_ath1/{mibcc,nf,phyerr,primary}`, `/proc/driver/fpga/{data,reg/all}`, `/proc/driver/gravity-vector`, `/proc/driver/ledctl/status`, `/proc/driver/tdm/{stats,txring}`, `/proc/driver/temp-sensor`, `/proc/fs/cifs/DebugData`, `/proc/net/{snmp,sockstat,tcp,udp}`
- **tmp_files:** `/tmp/memorylog*/log.*`, `/tmp/sonosConcurrencyUnrecoverableError`, `/tmp/udhcpc_resp_mac_addr`, `/tmp/upgrade.log`, `/tmp/wifi_card_mac_addr`
- **jobs_endpoint:** /jobs?job=<JobName> triggers any manifest task handler directly over HTTP (port 1400)

## `diagnostics`

The diagnostics bundle machinery — what /diag* and submitDiagnostics gather and where they send it.

**Technical description:**

- **status:** confirmed
- **files:** `/oc/zone/common/diag_progress.cxx`, `/oc/zone/common/diagnostics.cxx`

## `proprietary_headers`

Custom HTTP headers the firmware emits and consumes — X-Sonos-* household/player identifiers, X-RINCON-BOOTSEQ boot-counter checks, the fake WMP NSS user-agent used when fetching Windows-media streams, and ICY metadata negotiation.

**Technical description:**

- **status:** confirmed
- **outbound:** `X-Sonos-Playback-Id: %.*s`, `X-Sonos-SWGen: %u`, `X-RINCON-BOOTSEQ: %s`, `X-RINCON-VARIANT: %u`, `X-Sonos-Household-Id`, `X-Sonos-Corr-Id`, `x-sonos-target-udn`, `x-sonos-upnp-loopback-token`, `x-rincon-content-format (repset)`, `x-rincon-roomicon:generic`
- **hls_vocabulary:** `#EXT-X-VERSION`, `#EXT-X-TARGETDURATION`, `#EXT-X-MEDIA-SEQUENCE`, `#EXT-X-PLAYLIST-TYPE`, `#EXT-X-INDEPENDENT-SEGMENTS`, `#EXT-X-KEY:`, `#EXT-X-SESSION-KEY:`, `#EXT-X-MAP:`, `#EXT-X-DISCONTINUITY`, `#EXT-X-BYTERANGE`, `#EXT-X-ENDLIST`, `#EXT-X-MEDIA`, `#EXT-X-STREAM-INF`, `#EXT-X-PROGRAM-DATE-TIME`
- **hls_validation:** 'attempted to store an invalid rendition that doesn't begin with #EXT-X-MEDIA' (rendition-group enforcement)
- **mime_vocabulary:** `application/x-mpegurl`, `audio/x-mpegurl`, `audio/x-scpls`, `audio/x-sonos-recent`, `audio/x-spotify`, `audio/x-spotify-ogg`, `audio/x-aac`, `audio/x-aiff`, `audio/x-m4a`, `audio/x-ms-wma`, `audio/x-wav`

## `discovery_layer`

The combined discovery surface — SSDP + mDNS + Sonos's own peer-finding that builds the household picture.

**Technical description:**

- **status:** strong
- **mdns:** mDNS controller on RZonePlayer (m_spMdnsController); '%s.local' hostname construct ('Failed construct mdns hostname'); refreshMdnsRegistration; log /opt/log/mdnsd.log; 'new cert updating mDNS service \[%s\]'
- **spotify_connect:** _spotify-connect._tcp service registered/unregistered dynamically ('Registering Spotify Connect mDNS service'); MdnsSpotifyService ../anacapa-1.0/oc/zone/zoneplayer/mdns_spotify_service.cxx; SpotifyMDNSRequest events
- **ssdp:** RMSearchNotifyHandler select-thread handles SSDP M-SEARCH/NOTIFY; dedup vs mDNS: 'handleDefunctZP %s reason %s IGNORED from MDNS - discovered by SSDP' and inverse
- **dedup_policy:** a zone-player defunct signal is ignored when the same ZP is discovered via the other discovery channel (mDNS-primary if SSDP-unseen, SSDP-primary if mDNS-unseen)

## `ssdp_discovery`

The SSDP responder/advertiser — answers M-SEARCH, announces the player on boot/network change. This is what makes the player discoverable at all.

**Technical description:**

- **status:** confirmed
- **wire:** M-SEARCH * HTTP/1.1 + HOST:239.255.255.250 + USN: + ssdp:alive/ssdp:byebye; 'Sent MSEARCH reply to %s:%u'; '%s unicast MSEARCH from %s'
- **headers:** X-RINCON-{HOUSEHOLD,BOOTSEQ,PROXY,VARIANT,REASON} extension headers; MX: search window
- **signing:** HMAC-signed M-SEARCH: X-SONOS-SIG: %s + X-Sonos-MS-Sig: headers; 'signature HMAC init failed'/'Failed to calculate/add M-SEARCH signature'/'base64 encoding failed'; signed manifests ('Got manifest with invalid signature', '<!-- SIGNATURE:')
- **handler:** RMSearchNotifyHandler thread + disHandleMSearchAsync dispatch; 'Failed to setup MSearchNotifyHandler'
- **dedup:** dual-discovery: 'handleDefunctZP %s reason %s IGNORED from MDNS - discovered by SSDP'/'from SSDP - discovered by MDNS but not SSDP'
- **containers:** x-rincon-cpcontainer:{RDCPA,RDCPI,*}:* grammar; 'Unknown old Rhapsody x-rincon-cpcontainer'

## `ssdp_signed_msearch`

Support for signed/authenticated M-SEARCH — discovery requests carrying credentials get different answers than anonymous ones.

**Technical description:**

- **status:** confirmed
- **wire:** M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1900\r\nMAN: "ssdp:discover"\r\nMX: %d\r\nST: %s\r\nUSER-AGENT: %s\r\n%s\r\n (trailer = signature block)
- **signature:** HMAC over request -> base64 ('M-SEARCH signature HMAC init failed','Failed to add M-SEARCH signature'); inbound verify: 'hmac sig verify error'; keys hmacDigest/hmac
- **response_headers:** `BOOTID.UPNP.ORG: %s`, `CONFIGID.UPNP.ORG: %d`, `CACHE-CONTROL: max-age = %u`

## `upnp_cloud_tunnel`

The bridge that lets cloud/remote clients reach local UPnP actions — the upnp* muse namespaces tunnel through it, which is how the app controls a player it's not on the LAN with.

**Technical description:**

- **status:** confirmed
- **surface:** every service's upnp<Service> cloud resource exposes {subscribe, renew(logicalSID), unsubscribe(logicalSID)} — GENA subscription management relayed cloud->local
- **semantics:** renewSubs op; local SUBSCRIBE/UNSUBSCRIBE handled by f_105e8290 GENA handler; cloud mirror proxies event subscription state (logicalSID keys)

## `soap_client`

The outbound UPnP/SOAP client the player uses to call other players — coordinator-to-satellite calls, group joins, delegate actions all go through it.

**Technical description:**

- **status:** confirmed
- **wire:** SOAPACTION header grammar: '%s%sSOAPACTION: "%s%s%s"' and '%sSOAPACTION: "%s#%s"' — urn#action forms
- **logging:** 'UPnP call: %s:%s from %s:%d' inbound / 'returned %d to %s:%d' outbound; Tunneled UPnP call variant — SOAP relayed over the cloud tunnel shares the dispatcher
- **impl:** protocol/client/src/{sonos_cprovider,request,client,renew}.cxx — outbound control-point stack

## `websocket_impl`

The RFC6455 websocket stack shared by the local API (/api/v1/websocket, /websocket/api) and the cloud channel — opcode handling, per-message-deflate negotiation, ping/pong.

**Technical description:**

- **status:** confirmed
- **files:** websocketserver.cxx + websocketclient.cxx + lechmere.cxx
- **handshake:** Upgrade: websocket + Sec-WebSocket-{Key,Version,Accept,Protocol,Extensions}
- **frames:** opcode set {data,ping,pong,close,cont}; 'Illegal opcode'/'Privileged opcode'/'Websocket protocol error'; write fail logs opcode+len
- **state:** <WebSocketHistory> + <TruncatedConnectionList maxwebsockets=%zu connections=%zu>; <WebsocketRegistration>{%s (%s),/} reg element; WebSocketReceiveCB close handling

## `cert_identity`

The certificate identities the player can present — the four client key/cert slots (Sonos, device, legacy-accept, registered-device) used for different peer classes.

**Technical description:**

- **status:** confirmed
- **crypto:** mbedTLS; sonos::certval::validate(sonos_device_x509_fields*, mbedtls_x509_crt* cert, crt, crl, x509_crt_profile, name, flags, cb, RootCACertBundle*) — custom device-x509 field validation
- **client_identities:** `R_CLIENT_KEYCERT_ID_SONOS`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE_ACCEPT_LEGACY`, `R_CLIENT_KEYCERT_ID_SONOS_REGISTERED_DEVICE`
- **status_route:** /root_cert_bundles
- **reg_ids:** `RegisteredCertSonosID`, `newRegisteredCertSonosIDLocked`, `DeviceCertInvalid`
- **jwt:** 'JWT cert validation finished: %s' — JWT validation path exists
- **curl:** 'Curl - set cert validation callbacks'/'Curl - set key and cert for client validation'; 'cert validation for %s (local port %u)'; 'Expected cert validation failure for %s'
- **bundle:**
  - **lib:** libsonos-root-cert-bundle.so.2
  - **fetch:** CertBundleDownloader: GET /certbundles/v4/trusted_roots.rcb w/ ETag conditional fetch ('unchanged (ETag: %s)'); scheduled 'for %ld seconds' + first-fetch delay
  - **docs:** /root_cert_bundles status route; <RootCertBundleInfo><Bundles> + <DeviceCertInfo> docs
  - **status:** confirmed

## `device_auth`

How the player authenticates itself and incoming calls — device certs, signed requests and the local-auth decision layer.

**Technical description:**

- **status:** confirmed
- **headers:** `X-Sonos-DeviceCert: <cert>`, `X-Sonos-Device-Id`, `X-Sonos-Api-Key`, `X-Sonos-Corr-Id`
- **certval:** sonos::certval::validate(sonos_device_x509_fields, mbedtls crt+crl+profile, RootCACertBundle) — full device-cert chain validation; sonosCertvalSetSSLToSonosDevice SSL profile
- **tokens:** v1/households/{householdId}/authorization/tokens + resolveToken; getAuthTokenResult/'Treating auth token as expired'; authToken{Changed,Refreshed} events; getDeviceAuthToken res==%d failure
- **regcert:** fetchRegDeviceCert/refreshRegDeviceCert -> /regcert local endpoint; RegCertUpdateEvent
- **oauth:** int_addAccountWithOAuthToken/addAccountWithOAuthToken/SpConnectionLoginOauthToken — OAuth-token SMAPI account linking; deviceCerts capability lets services request device certs
- **ssl:** /ssl_client_cache status endpoint — TLS session cache

## `noncehandler`

The nonce challenge/response machinery — one-time values used to authenticate management operations.

**Technical description:**

- **status:** confirmed
- **semantics:** auth-nonce tracking for cloud requests

## `circuitbreaker`

Circuit-breaker pattern around outbound calls — failing cloud/peer endpoints get backed off instead of retried hot.

**Technical description:**

- **status:** confirmed
- **semantics:** circuitBreakerTelemetry — breaker pattern on outbound paths w/ telemetry

## `hls_radio`

HLS support for internet radio — the firmware parses #EXTM3U playlists, picks variants, and recovers when a playlist goes empty.

**Technical description:**

- **status:** confirmed
- **schemes:** x-sonosapi-hls:%s?sid=%u&flags=288 + x-sonosapi-hls-static: + x-sonosapi-hls{,-static}:*:*:* + hls-static:// + sonos.com-hls-{static,radio,aac}
- **ops:** hls-{live,static,???} + hlsradio + hlsmeta/hlsplaylist/hlsrenditions + 'hls-%s said: %u (%g) %d %d' telemetry
- **routes:** /hls local route

## `cloud_request`

The generic cloud-request helper — HTTPS calls to Sonos APIs with cert pinning, env bases and retry policy.

**Technical description:**

- **status:** confirmed
- **files:** `/oc/zone/common/cloudrequest.cxx`

## `cloud_registration`

Cloud-side registration handshake — the player exchanging cert + household info for cloud credentials.

**Technical description:**

- **status:** confirmed
- **tls:** secure reg over SSL ('Invalid secure reg SSL port','Could not create secure reg SSL Context'); 'Curl - using R_CLIENT_KEYCERT_ID_SONOS_REGISTERED_DEVICE for %s' — client-cert identity
- **cloud_routes:** `v1/households/{householdId}/devices/registrations (+GET registrations, initDeviceRegistration)`, `v1/households/{householdId}/devices/registrations/{deviceId} (complete/refresh/deregister)`, `v1/users/{userId}/devices/registrations`, `v1/players/{playerId}/devices/registration (getRegistrationStatus/setRegistrationState/transferDeviceRegistration)`
- **events:** `NewCertRegistrationEvent`, `SecureRegistrationStateUpdateEvent`, `SecureRegistrationChangeEvent`, `RegCertUpdateEvent`
- **objects:** `cloud_registration`, `CloudRegistration`, `makeMuseCloudRegistrationStatus`
- **local_route:** /registration status endpoint
- **errors:** `REGISTRATION_CHIME_UNAVAILABLE`, `'updating boot sequence due to registration event'`, `'Account registration for service %u res %hu'`

## `service_accounts`

Music-service account storage — per-service credentials, nicknames and tokens under SystemProperties; what AddAccount/DeleteAccount/RefreshAuthToken act on.

**Technical description:**

- **status:** confirmed
- **impl:** zpserviceaccounts.cxx -> RZPServiceAccounts
- **accounts:** sn (service-account serial) + sid (service id); musicServiceAccounts ops {match,preferred set/get,startDirectControlEx,endDirectControl}
- **oauth_migration:** 'migrated account to OAuth, type:%u, sn:%u' / 'failed to migrate' / 'Authentication failed during migration' — legacy->OAuth migration path
- **manifests:** per-account manifest download 'failed to download manifest file for account sid:%u, sn:%u'
- **events:** NewMuseHHIDEvent/NewLocationIdEvent -> RZPServiceAccounts; userInfo updates 'updating userInfo for account SN: %u' + user-hash cleanup

## `device_registration`

The registration flow — how a new or reset player registers with Sonos cloud and gets its identity.

**Technical description:**

- **status:** confirmed
- **impl:** register.cxx + regdevicecert.cxx + cloudregistration.cxx
- **wire:** RegistrationReqMsg/RegistrationRespMsg pair; registration/{state,status,id,state/transfer} endpoints; <WebsocketRegistration> element
- **signing:** registration signing key {set,cleared}; 'signature required/invalid' — requests signed via IPC-provisioned key
- **cert:** R_CLIENT_KEYCERT_ID_SONOS_REGISTERED_DEVICE — the registered-device client-cert for curl cloud calls; Loading/Unloading secure reg cert; 'reg cert not available; cannot generate token'; fetchRegDeviceCert/refreshRegDeviceCert; NewCertRegistrationEvent/RegCertUpdateEvent
- **states:** during suspend/time expired/success/error/retrying; secureReg/secureRegState/secureRegTransfer; SecureRegistration{State,Change}UpdateEvent
- **gating:** 'not securely registered' blocks config fetch; 'should be quarantined (secure reg required)'; 'Removing settings denylists after registration' — registration lifts settings restrictions
- **cloud:** makeMuseCloudRegistrationStatus; 'Updating cloud registration due to %s. MuseSessionId %s->%s'; 'defer due to missing required field(s)'; cached event; wifi-monitor jobs; SET_CONFIG sends registration

## `assoctracker`

Association tracking — which stations/clients are associated to this node on the mesh/wifi.

**Technical description:**

- **status:** confirmed
- **semantics:** Wi-Fi station-association tracking

## `target_udn_routing`

How requests addressed to a specific player UDN get routed inside a grouped/bonded setup — a request can land on one member and be forwarded to the right zone player.

**Technical description:**

- **status:** confirmed
- **header:** X-SONOS-TARGET-UDN: uuid:%s + targetUDN param — directs a SOAP action to a specific bonded-zone member UDN
- **semantics:** multi-device action routing: the coordinator/group proxy forwards actions to the target member identified by UDN; pairs w/ MobileDeviceUDN/playerUDN/HTPrimaryUDN identity fields

## `http_extra_endpoints`

The complete inventory of HTTP paths the binary knows about beyond the SOAP control URLs — diagnostics, config pages, daemon IPC proxies, cloud-tunnel endpoints, media taps. Literal presence doesn't prove the route is registered at runtime, but the table shows the full attack/feature surface.

**Technical description:**

- **status:** strong
- **name:** HTTP paths outside the /status route-table cluster
- **description:** Second-sweep string audit of the anacapad HTTP server surface: paths present in rodata that were not in the decoded /status route table. Covers SSH-key install, firmware download, group ops, local OAuth/authz, content bridges, DSP control, Spotify debug, retail-demo hooks, support-bundle submission, the /testenv environment switcher, sibling-daemon IPC proxies (/X-external) and htdocs pages. Presence of a path string does not prove a registered route; addresses are the literal locations.
- **paths:**
  - path: /ssh/authorized_keys, address: 0x10efee2e
  - path: /ssh/fingerprints, address: 0x10e76540
  - path: /softwareDownload, address: 0x10e82b39
  - path: /createGroup, address: 0x10e7d2ae
  - path: /unjoin, address: 0x10e86773
  - path: /activate, address: 0x10e8662d
  - path: /deactivate, address: 0x10e86689
  - path: /auth/oauth/v2/validate, address: 0x10efc408
  - path: /authz, address: 0x10ef9b3c
  - path: /tokens, address: 0x10e7c2d5
  - path: /accountSubscription, address: 0x10e82bf1
  - path: /content/api, address: 0x10eb3d1c
  - path: /bridge/content/api, address: 0x10ed4a00
  - path: /entitlements/api, address: 0x10ebf908
  - path: /settings/api/v1/locations/, address: 0x10ef7594
  - path: /sonar-tone, address: 0x10e9ad90
  - path: /sonarctl, address: 0x10e76500
  - path: /save_eq_presets, address: 0x10e7643c
  - path: /setPersistentEQ, address: 0x10e76460
  - path: /putDSP, address: 0x10e76458
  - path: /drc, address: 0x10fe6aac
  - path: /dolby_config, address: 0x10e7648c
  - path: /dynamicparams, address: 0x10fe6b20
  - path: /staticparams, address: 0x10fe6ac0
  - path: /spotdbg, address: 0x10e765b0
  - path: /spotifyzc, address: 0x10e765a4
  - path: /rdmbuttonfwd, address: 0x10e76524
  - path: /rdmhhsetup, address: 0x10e76518
  - path: /sethostip, address: 0x10e765cc
  - path: /upload, address: 0x10ea7eb0
  - path: /v2/diags, address: 0x10f054a8
  - path: /testpoint, address: 0x10e764c4
  - path: /debugfiles, address: 0x10e74f5c
  - path: /watchdog, address: 0x10e71840
  - path: /watchdog-legacy, address: 0x10ea7ef8
  - path: /watchdogcrash, address: 0x10fe51f0
  - path: /ws/diag/diag_instructions.xml, address: 0x10ec465c
  - path: /ttm_helper, address: 0x10e7650c
  - path: /ZPs, address: 0x10ed985c
  - path: /duck, address: 0x10e813fa
  - path: /unduck, address: 0x10e81482
  - path: /downloadspdiftap, address: 0x10e76568
  - path: /snapshotspdiftap, address: 0x10e76554
  - path: /getaa, address: 0x10e76390
  - path: /testenv, address: 0x10e763d8
  - path: /advconfig, address: 0x10e764a8
  - path: /customsd, address: 0x10e763e4
  - path: /devmode, address: 0x10e71828
  - path: /fcs, address: 0x10e76400
  - path: /logger, address: 0x10e764e8
  - path: /ping, address: 0x10e7641c
  - path: /traceroute, address: 0x10e8682c
  - path: /nslookup, address: 0x10e765d8
  - path: /removestring, address: 0x10e730b8
  - path: /setstring, address: 0x10e7324a
  - path: /mdnsannounce, address: 0x10e7340e
  - path: /spotresetnts, address: 0x10e734c2
  - path: /support/directsubmit, address: 0x10e76610
  - path: /support/aggregate, address: 0x10e76638
  - path: /support/asyncsubmit, address: 0x10e7664c
  - path: /support/networkmatrix, address: 0x10e7667c
  - path: /support/review, address: 0x10e76628
  - path: /support/reportstatus, address: 0x10e76664
  - path: /anacapad-external, address: 0x10ea7ec4
  - path: /btmanager-external, address: 0x10ea7f20
  - path: /sonosledmgrd-external, address: 0x10ea7f58
  - path: /sonospowercoordinator-external, address: 0x10ea7ed8
  - path: /netstartd-external, address: 0x10ea7f70
  - path: /xml/device_description_no_ai.xml, address: 0x10ef2590
  - path: /xml/satellite_device.xml, address: 0x10ef25b4
  - path: /tools.htm, address: 0x10e76410
  - path: /unlock.htm, address: 0x10e763c0
  - path: /advconfig.htm, address: 0x10e764b4
  - path: /customsd.htm, address: 0x10e763f0
  - path: /bugs.html, address: 0x10f31c4e
  - path: /hsts.html, address: 0x10f7ce7b
  - path: /alt-svc.html, address: 0x10f822e2
- **missing_strings:** 
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10efee2e, notes: /ssh/authorized_keys
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e763d8, notes: /testenv
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e76500, notes: /sonarctl
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e765a4, notes: /spotifyzc

## `csrf_protection`

Browser-facing config endpoints embed a csrfToken hidden field, so simple cross-site form posts get rejected. If you're automating /advconfig or /status writes you must fetch the form first and echo the token.

**Technical description:**

- **status:** confirmed
- **name:** CSRF tokens on browser-facing POST endpoints
- **description:** Every browser-form POST endpoint embeds a hidden csrfToken field: /advconfig, /customsd, /devmode, /fcs, /logger, /mdnsannounce, /nslookup, /ping, /removestring, /setstring, /spotresetnts, /ssh/authorized_keys, /support/directsubmit, /testenv, /traceroute. Token generation/validation mechanics not decoded.
- **form_endpoints:** `/advconfig`, `/customsd`, `/devmode`, `/fcs`, `/logger`, `/mdnsannounce`, `/nslookup`, `/ping`, `/removestring`, `/setstring`, `/spotresetnts`, `/ssh/authorized_keys`, `/support/directsubmit`, `/testenv`, `/traceroute`
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e730f0, notes: csrfToken
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10efee26, notes: action="/ssh/authorized_keys"

## `device_description_variants`

The two device-description XML variants — with and without AudioIn — proving AudioIn omission from some descriptions is deliberate.

**Technical description:**

- **status:** confirmed
- **name:** Alternate device-description documents
- **description:** Three device descriptions exist: device_description.xml (served, 16 services), device_description_no_ai.xml (alternate without AudioIn — proves the omission is a switchable variant, not conditional assembly), and group_description.xml (SpeakerGroup:1 satellite doc). satellite_device.xml also exists for bonded sub/surrounds.
- **files:** `/xml/device_description.xml`, `/xml/device_description_no_ai.xml`, `/xml/group_description.xml`, `/xml/satellite_device.xml`
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ef2590, notes: /xml/device_description_no_ai.xml
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ef25b4, notes: /xml/satellite_device.xml
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ef2574, notes: /xml/group_description.xml

## `gena_internals`

GENA internals — SID preinstall (?sid=0), SubscribedEvents/LogicalSID/NotifyErrors bookkeeping, and the LastChange event assembly.

**Technical description:**

- **status:** strong
- **name:** GENA subscription/notify internals
- **description:** Subscription machinery vocabulary: SID preinstall ('Attempting to preinstall SID=%u', '?sid=0' URL form), status fields SubscribedEvents/LogicalSID/UPnPSID/NotifyErrors, sender/source pair upnpeventing_sender+upnpeventing_source, AVTStateLastChangedEvent event name, and the <LastChange>%s</LastChange> wrapper emitted per service. Per-service LastChange payload schemas not enumerated.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e9b408, notes: Attempting to preinstall SID
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f0c580, notes: <LogicalSID>
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f00cb8, notes: <NotifyErrors>
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e89d80, notes: <LastChange>

## `didl_classes_ext`

The extended DIDL-Lite class vocabulary — audiobook/podcast/chapter object classes and playlist MIME types beyond the base UPnP set.

**Technical description:**

- **status:** strong
- **name:** Extended DIDL object classes
- **description:** DIDL class vocabulary beyond the core audioItem set: audioBook/audioBook.chapter/podcast containers+items, episode.podcast, chapter.audiobook, the ':audiobooks' browse id, mswmext=.asx WMP playlist mapping.
- **classes:** `object.item.audioItem.audioBook`, `object.item.audioItem.audioBook.chapter`, `object.item.audioItem.podcast`, `object.container.podcast`, `episode.podcast`, `chapter.audiobook`
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ec1264, notes: object.item.audioItem.audioBook
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f08788, notes: object.container.podcast
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ed693c, notes: mswmext=.asx

## `protocol_info_full`

The verbatim GetProtocolInfo source CSV — every MIME/protocolInfo string the player claims to support, including x-rincon-* custom schemes, sonos.com-* types and DASH.

**Technical description:**

- **status:** confirmed
- **name:** Complete GetProtocolInfo Source CSV
- **description:** Verbatim protocol-info CSV returned by ConnectionManager.GetProtocolInfo — captures the sonos.com-{http,mms,spotify,rtrecent} transport prefixes, x-file-cifs local-share scheme, DASH and every MIME type the renderer claims.
- **csv:** http-get:*:audio/mp3:*,x-file-cifs:*:audio/mp3:*,http-get:*:audio/mp4:*,x-file-cifs:*:audio/mp4:*,http-get:*:audio/x-m4a:*,x-file-cifs:*:audio/x-m4a:*,http-get:*:audio/mpeg:*,x-file-cifs:*:audio/mpeg:*,http-get:*:audio/mpegurl:*,x-file-cifs:*:audio/mpegurl:*,file:*:audio/mpegurl:*,http-get:*:audio/x-mpegurl:*,x-file-cifs:*:audio/x-mpegurl:*,http-get:*:application/x-mpegurl:*,x-file-cifs:*:application/x-mpegurl:*,http-get:*:application/vnd.apple.mpegurl:*,x-file-cifs:*:application/vnd.apple.mpegurl:*,http-get:*:application/dash+xml:*,x-file-cifs:*:application/dash+xml:*,http-get:*:audio/mpeg3:*,x-file-cifs:*:audio/mpeg3:*,http-get:*:audio/wav:*,x-file-cifs:*:audio/wav:*,http-get:*:audio/x-wav:*,x-file-cifs:*:audio/x-wav:*,http-get:*:audio/wma:*,x-file-cifs:*:audio/wma:*,http-get:*:audio/x-ms-wma:*,x-file-cifs:*:audio/x-ms-wma:*,http-get:*:audio/aiff:*,x-file-cifs:*:audio/aiff:*,http-get:*:audio/x-aiff:*,x-file-cifs:*:audio/x-aiff:*,http-get:*:audio/flac:*,x-file-cifs:*:audio/flac:*,http-get:*:application/ogg:*,x-file-cifs:*:application/ogg:*,http-get:*:audio/ogg:*,x-file-cifs:*:audio/ogg:*,sonos.com-mms:*:audio/x-ms-wma:*,sonos.com-http:*:audio/mp3:*,sonos.com-http:*:audio/mpeg:*,sonos.com-http:*:audio/mpeg3:*,sonos.com-http:*:audio/wma:*,sonos.com-http:*:audio/mp4:*,sonos.com-http:*:audio/x-m4a:*,sonos.com-http:*:audio/wav:*,sonos.com-http:*:audio/aiff:*,sonos.com-http:*:audio/flac:*,sonos.com-http:*:application/ogg:*,sonos.com-http:*:application/x-mpegURL:*,sonos.com-http:*:application/dash+xml:*,sonos.com-spotify:*:audio/x-spotify:*,sonos.com-rtrecent:*:audio/x-sonos-recent:*,x-rincon:*:*:*,x-rincon-mp3radio:*:*:*,x-rincon-playlist:*:*:*,x-rincon-queue:*:*:*,x-rincon-stream:*:*:*,x-sonosapi-stream:*:*:*,x-sonosapi-hls:*:*:*,x-sonosapi-hls-static:*:*:*,x-sonosapi-radio:*:audio/x-sonosapi-radio:*,x-rincon-cpcontainer:*:*:*,
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eb87e4, notes: http-get:*:audio/mp3

## `icy_metadata`

ICY/Shoutcast metadata handling — icy-metaint interval parsing and stream-title extraction for internet radio.

**Technical description:**

- **status:** strong
- **name:** ICY/Shoutcast inline metadata
- **description:** mp3radio streams carry ICY metadata — '@icy-metaint:' interval header parsed for in-band track metadata.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ed461b, notes: @icy-metaint

## `alert_engine`

The alert/chime engine — alertContent items (doorbell/voice-assistant prompts) play over or duck current audio per a priority policy.

**Technical description:**

- **status:** strong
- **name:** alert/chime interrupt engine
- **description:** alertContent player with priority policies ('Cannot interrupt current clip due to priority policies', JOIN_CHIME_UNAVAILABLE, ALEXA_ALERT); audioclipmanager + /duck /unduck endpoints; surfaces via the audioClip muse resource and the R_AUDIO_CLIP_* codes.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eaacd4, notes: alertContent
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ec76ac, notes: JOIN_CHIME_UNAVAILABLE
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ec0814, notes: ALEXA_ALERT

## `household_psk_vocabulary`

The household key hierarchy — HhPsk, ControlPsk, LanSwapPsk, RoomEncPsk and their backup slots: different keys for household membership, control channel, Wi-Fi roaming and room audio encryption.

**Technical description:**

- **status:** strong
- **name:** household encryption key elements
- **description:** Replicated-state PSK identifiers: HhPsk (household), ControlPsk (control channel), LanSwapPsk, RoomEncPsk (room encryption), each with a Backup* mirror — the key hierarchy for household crypto. Distribution/rotation mechanics undocumented.
- **elements:** `HhPsk`, `ControlPsk`, `LanSwapPsk`, `RoomEncPsk`, `BackupHhPsk`, `BackupControlPsk`, `BackupLanSwapPsk`, `BackupRoomEncPsk`
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10efae10, notes: <HhPsk
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10efae70, notes: <RoomEncPsk

## `replication_elements`

The wire elements of household replication — ReplicationOperation/Player/Result triples plus Quarantined/Denylisted device records; the vocabulary of the sync protocol.

**Technical description:**

- **status:** strong
- **name:** replication-engine wire elements
- **description:** Replication protocol elements beyond the store inventory: ReplicationOperation/ReplicationPlayer/ReplicationResult/ReplicationTime plus QuarantinedDevices and Denylisted node sets.
- **elements:** `ReplicationOperation`, `ReplicationPlayer`, `ReplicationResult`, `ReplicationTime`, `ReplicatedNetSettings`, `QuarantinedDevices`, `Denylisted`
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eacbb0, notes: <ReplicationOperation
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f131f4, notes: <QuarantinedDevices

## `token_refresh_state_machine`

The OAuth token lifecycle for cloud and music services — expiry detection, refresh requests, and retry/backoff behavior when refresh fails.

**Technical description:**

- **status:** strong
- **name:** music-account OAuth token refresh lifecycle
- **description:** Per-account token refresh FSM ('token refresh state for acct. sn. %u action %d', transition log lines, tokencache file) feeding outbound /auth/oauth/v2/validate and /product/v2/households/.../players?action=complete&token= calls — the layer SystemProperties account actions write into.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10efc408, notes: /auth/oauth/v2/validate
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ed7a78, notes: tokencache
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ec2567, notes: transition token refresh action

## `xml_schema_clusters`

The recoverable XML schemas grouped by subsystem — settings stores, HT config, LED patterns, alarms — each element/attribute inventory with where it serializes.

**Technical description:**

- **status:** strong
- **name:** uncatalogued XML schema clusters
- **description:** Element vocabularies in the /status dumps and persisted files never decomposed: alarmclock.xml, areas.json, cloudconfig.json, householdsettings.json, zones.json, zpMetricsConfigV2.xml; <Scheduler>/<Job*>, <LedPattern*>, <RadioStationLog>, <PerformanceCounterTables>, <IndexStats>, <Satellite*>/<HWMembers>, <RoomCalibration*> + SelfTrueplayEQ/SelfTrueplayInfo, <Ducking*>/<PlaybackDucked>, <ABREvents>/<ABRState>, <HLS*>, <DTSProfile>/<DialNorm>, <AudioDelay*> lip-sync, <PresetNameList> EQ presets, <Account Type=, <Orientation>, <MicFlags>, <FocusModeMute>.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e99048, notes: <LedPatternEntry
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e86ea1, notes: <RadioStationLog
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10fee998, notes: <SelfTrueplayEQ
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10fe7710, notes: <DTSProfile

## `internal_error_families`

The internal error-code families — how component errors are namespaced before they get mapped to UPnP fault codes at the SOAP boundary.

**Technical description:**

- **status:** strong
- **name:** non-UPnP fault-code families
- **description:** ERROR_* fault vocabularies outside the UPnP code table: ERROR_LASTFM_{BAD_SUBLEVEL,STREAM_LIMIT,NO_ACCOUNT,NO_CONTENT,BAD_ACCOUNT}, ERROR_PAND_* (Pandora), ERROR_DOCK_INTERRUPT, ERROR_WMP_* — reported via R_* codes and service-layer logs, not SOAP faults.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eee504, notes: ERROR_LASTFM_STREAM_LIMIT
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eee550, notes: ERROR_DOCK_INTERRUPT

## `system_property_keys`

The 29 R_* SystemProperties keys — the real key space that GetString/SetString/Remove operate on (crossfade duration, service bitrates, update policy, filtering).

**Technical description:**

- **status:** strong
- **name:** SystemProperties R_* settings key space
- **description:** Known keys for the SystemProperties Get/Set/Remove key/value store recovered from rodata. MixedCase R_* keys are the persistent settings namespace; the all-caps R_* codes (internal_result_namespace) are a different vocabulary.
- **keys** (28):

  ```
  R_AccountTransferMode, R_AirplayIncludeLinked, R_AudioInEncodeType, R_AutoUpdatePolicy, R_AutoUpdateWindowStart, R_AvailableSoftwareUpdate, R_AvailableSvcTrials, R_AvailableSvcTypes, R_BrowseByFolderSort, R_CheckUpdateInterval, R_ContentFiltering, R_CrossfadeDuration, R_CustomerID, R_ForceReIndex, R_HideTuneIn, R_HouseholdLocationID, R_MigratedTuneIn, R_MuseDuckingPolicy, R_PromoVersion, R_RadioLocation, R_ServiceBitrate, R_ShowNSSServers, R_ShowRhapUPnP, R_SvcAccounts, R_ThirdPartyCredentials, R_TrialZPSerial, R_UseSonosContentDirNS, R_VolNormMode
  ```
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ecb0ec, notes: R_VolNormMode
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e9a9f0, notes: R_MuseDuckingPolicy
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10efebec, notes: R_ThirdPartyCredentials

## `internal_result_namespace`

The complete R_* status-code enum — 403 internal result codes grouped by family (account, cloud queue, playback ops, LED, masks...). These are what UPnP faults map FROM; the enum values themselves aren't recoverable as integers.

**Technical description:**

- **status:** strong
- **name:** R_* internal result/status code namespace
- **description:** Complete internal status enum recovered from rodata — 403 codes. These are the unified result codes the UPnP layer maps into 4xx/7xx/8xx faults and the muse/log layers report verbatim. The value->code integer mapping is NOT recovered (enum is a table lookup, not a string->int map); this is the vocabulary, not the numbering.
- **families:**
  - **CORE** (270):
  
    ```
    R_AAC_ELD, R_ABORTED, R_ACCESS_DENIED, R_ACCESS_DENIED_EXPLICIT, R_ALARM_BAD_TIME_SERVER, R_ALARM_CONFLICT, R_ALARM_NO_SPACE, R_ALLOW_SSH_PUBKEY_INSTALL, R_AND_SUB, R_API_KEY_VALIDATION_FAILED, R_AREAS_READ_ONLY, R_AUDIBLE_BAD_CODEC, R_AUDIBLE_DRM, R_AUDIBLE_ZP_MISSING, R_AUDIOCLIP, R_AUTH_GENERAL, R_BAD_CONTENT_ENCODING, R_BAD_DOWNLOAD_RESUME, R_BAD_INET_RADIO, R_BASE_URL, R_BLUETOOTH, R_BUFFERING, R_CACHE_NOT_FOUND, R_CACHE_RECORD_NOT_FOUND, R_CALIBRATION_ID, R_CALM, R_CANCELLED, R_CANT_CONNECT, R_CANT_CONNECT_REMOTE, R_CANT_REACH_SERVER, R_CANT_RESOLVE_NAME, R_CERT_DENYLISTED, R_CERT_NEEDED, R_CFG_SATELLITE, R_CHUNK_FAILED, R_CODE_NOT_FOUND, R_COMMAND_FAILED, R_COMMAND_TIMEOUT, R_CONNECTING, R_CONTENT_TYPE_NOT_SUPPORTED, R_CONTROL, R_CORRUPT_FILE, R_CRED, R_DATA_UPLOAD_URL, R_DB_WS_IRCODE_URL, R_DELEGATION, R_DETECT, R_DETECTION, R_DEVICE_ALREADY_REGISTERED, R_DEVICE_UNAVAILABLE, R_DISALLOWED_BY_POLICY, R_DISCOVERED_DEVICES, R_DO_NOTHING, R_DOCK_INTERRUPT, R_DOWNSTREAM_CONNECT_FAILED, R_DSP_ERROR, R_END_OF_STREAM, R_ENTRY_URL, R_EXPECTATION_FAILED, R_FAILED_INIT, R_FAILURE_TO_ENQUEUE, R_FAULT_TEMPERATURE_STATUS, R_FILESIZE_EXCEEDED, R_FLOAT, R_FROM_ID, R_GAIN_ID, R_GOT_NOTHING, R_GROUP_CHANGED, R_HAS_AUDIODEV, R_ID_CHANGED, R_IDLING, R_IN_PROGRESS, R_INCOMPATIBLE_API_VERSION, R_INCOMPATIBLE_CLIENT_VERSION, R_INCORRECT_STATE, R_INSTRUCT_URL, R_INSUFFICIENT_POWER_FOR_UPDATE, R_INSUFFICIENT_RESOURCES, R_INTERFACE_FAILED, R_INTERNAL, R_INVALID, R_INVALID_ACTION, R_INVALID_AUTH_HEADER, R_INVALID_CERT, R_INVALID_HEADER, R_INVALID_LENGTH, R_INVALID_OBJECT_ID, R_INVALID_PARAMETER, R_INVALID_RESOURCE, R_INVALID_SESSION_ID, R_INVALID_SYNTAX, R_INVALID_TRANSPORT, R_INVALID_UPM_FORMAT, R_IP_ADDRESS_CHANGED, R_LECHMERE_RECONNECT_LATER, R_LEVEL_LOW, R_LOAD_COMMAND_FAILED, R_LOGIN_DENIED, R_LOST_CONNECTION, R_LOW_BATTERY, R_MALFORMED_URL, R_MEMORY_ALLOCATION_ERROR, R_MICROPHONE_NOT_ENABLED, R_MISSING_PARAMETERS, R_MODE, R_MSG_DEFLATE, R_NAME, R_NAME2, R_NAMESPACE, R_NEW_SSID, R_NO_CONTENT, R_NO_PERMISSION, R_NO_PLAYABLE_CONTENT, R_NO_POSITIONING_RESULTS, R_NO_RESOURCE, R_NO_UPDATE_AVAILABLE, R_NOT_AUTHORIZED, R_NOT_BUILT_IN, R_NOT_CALLED, R_NOT_CAPABLE, R_NOT_COMPATIBLE, R_NOT_DESIGNATED_DEVICE, R_NOT_PLAYABLE, R_OCCURRED, R_OGG_ERROR, R_ON_EMPTY_QUEUE, R_OPERATION_TIMEDOUT, R_OUT_OF_MEMORY, R_PAUSED, R_PAUSED_FROM_ID, R_PEER_FAILED_VERIFICATION, R_PLAYER_UNSUPPORTED, R_PLAYERS_HAVE_INCOMPATIBLE_FIRMWARE, R_PLAYING, R_POST_FAILED, R_POWERED_OFF, R_PRECONDITION_FAILED, R_PREFERRED_ACCOUNT_NOT_FOUND, R_PREFERRED_ACCOUNT_NOT_SET, R_PULL_SWAP, R_PUSH_SWAP, R_QUEUE_FULL, R_RAMP_TYPE, R_RECONNECT, R_RECV, R_REMOTE_ACCESS_DENIED, R_REMOTE_DISK_FULL, R_REMOTE_FILE_EXISTS, R_REMOTE_FILE_NOT_FOUND, R_REQUIRES_GROUP_COORDINATOR, R_RESOURCE_CONFLICT, R_RESOURCE_GONE, R_RESOURCE_NO_LONGER_AVAILABLE, R_RETRY, R_RETURNED, R_RHAP_BAD_ACCOUNT, R_RHAP_NO_ACCOUNT, R_RHAP_STREAM_LIMIT, R_RHAP_TRIAL_EXPIRED, R_RHAP_UNAVAILABLE, R_RHAP_UNSUPP_ACCOUNT, R_RINGING, R_ROOM_DETECTION_SIGNALLING_BUSY, R_ROOM_DETECTION_SIGNALLING_FAILED, R_SEARCH_FOR_FRAME_SYNC, R_SEARCH_FOR_METADATA, R_SEEK_ERROR, R_SEEK_STATUS_ERROR, R_SEEK_STATUS_OK, R_SEEK_STATUS_UNSUPPORTED, R_SEND, R_SEND_FAIL_REWIND, R_SENSOR, R_SERVER_URL, R_SERVICE_NOT_AVAILABLE, R_SERVICE_NOT_CONFIGURED, R_SERVICE_NOT_SUPPORTED, R_SERVICE_UNAVAILABLE, R_SESSION_EVICTED, R_SESSION_IN_PROGRESS, R_SESSION_JOIN_FAILED, R_SETUP_READY, R_SHARES_CONFLICT, R_SHARES_NO_SPACE, R_SHARES_NO_SUCH_SHARE, R_SHARES_REQUEST_FAILED, R_SHUTDOWN, R_SIRIUS_AUTH_GEN_FAIL, R_SIRIUS_AUTH_INACTIVE, R_SIRIUS_BAD_ACCOUNT, R_SIRIUS_BAD_SUBLEVEL, R_SIRIUS_INACTIVE, R_SIRIUS_NO_ACCOUNT, R_SIRIUS_STREAM_LIMIT, R_SIRIUS_STREAM_LIMIT_EXT, R_SIRIUS_TRIAL_EXPIRED, R_SIZE, R_SKIP_LIMIT_REACHED, R_SLEEPING, R_SONOS_BAD_ACCOUNT, R_SONOS_BAD_LOCATION, R_SONOS_INACTIVE, R_SONOS_NO_ACCOUNT, R_SONOS_STREAM_LIMIT, R_SONOS_TOKEN_EXPIRED, R_SONOS_TRIAL_EXPIRED, R_SONOS_UNSUPP_ACCOUNT, R_SONOSAPI_, R_SPAWN_FAILED, R_SPOT_EVT_AUDIO_TIMEOUT, R_SPOT_EVT_METADATA_CHANGE, R_SPOTIFY_CONNECT, R_SSL_CACERT, R_SSL_CACERT_BADFILE, R_SSL_CERTPROBLEM, R_SSL_CIPHER, R_SSL_CLIENTCERT, R_SSL_CONNECT, R_SSL_CRL_BADFILE, R_SSL_ENGINE_INITFAILED, R_SSL_ENGINE_NOTFOUND, R_SSL_ENGINE_SETFAILED, R_SSL_INVALIDCERTSTATUS, R_SSL_ISSUER, R_SSL_PINNEDPUBKEYNOTMATCH, R_SSL_SHUTDOWN_FAILED, R_START, R_STARTED, R_STATE, R_STATUS, R_STIMULUS_ALREADY_PLAYING, R_STRING, R_SVC_DISABLED, R_SWITCH_ID, R_TARGET_ID_NOT_FOUND, R_TIMER, R_TIMER_NOT_FOUND, R_TIMER_PAUSED, R_TO_PLAYER, R_TOO_MANY_MOUNTED, R_TOO_MANY_REDIRECTS, R_TOO_MANY_USERS, R_TRACK_PERCENTAGE, R_TRACKS_IN_QUEUE, R_TRANSMITTER, R_UNABLE_TO_CONNECT, R_UNABLE_TO_READ_FILE, R_UNABLE_TO_RESOLVE_HOST, R_UNABLE_TO_RESOLVE_PROXY, R_UNAVAILABLE, R_UNDEFINED, R_UNINITIALIZED, R_UNSUPPORTED_COMMAND, R_UNSUPPORTED_DRM, R_UNSUPPORTED_FORMAT, R_UNSUPPORTED_FREQ, R_UNSUPPORTED_NAMESPACE, R_UNSUPPORTED_POSITIONING_REQUEST, R_UNSUPPORTED_REQUEST, R_UNSUPPORTED_REQUEST_METHOD, R_UNSUPPORTED_VOLUME_MODE, R_UPDATE_IN_PROGRESS, R_UPDATED, R_UPGRADE, R_UPLOAD_FAILED, R_USE_SSL_FAILED, R_VOLUME_SET_VOLUME, R_WAKEUP_FAILURE, R_WARN_TEMPERATURE_STATUS, R_WITHIN_GROUP
    ```
  - **ACCOUNT:** `R_ACCOUNT_FULL`, `R_ACCOUNT_INVALID_ID`, `R_ACCOUNT_NO_DEFAULT_FOUND`, `R_ACCOUNT_REAUTH_REQUIRED`, `R_ACCOUNT_UPGRADE_REQUIRED`, `R_ACCOUNT_WRONG_SERVICE`
  - **AUDIO:** `R_AUDIO_AT_RESUME`, `R_AUDIO_CLIP_ID_NOT_FOUND`, `R_AUDIO_CLIP_MEDIA_ERROR`, `R_AUDIO_CLIP_PAUSE_CONTENT_FAILED`, `R_AUDIO_CLIP_VOICE_ASSISTANT_PLAYING`
  - **CLIENT:** `R_CLIENT_KEYCERT_ID_SONOS`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE_ACCEPT_LEGACY`, `R_CLIENT_KEYCERT_ID_SONOS_REGISTERED_DEVICE`
  - **CLOUD:** `R_CLOUD_QUEUE_ACCESS_DENIED`, `R_CLOUD_QUEUE_CANT_REACH_SERVER`, `R_CLOUD_QUEUE_SERVER`, `R_CLOUD_QUEUE_SERVICE_ERROR`, `R_CLOUD_QUEUE_SERVICE_UNRESPONSIVE`, `R_CLOUD_QUEUE_STREAM_LIMIT`
  - **CMD:** `R_CMD_FUTURE`, `R_CMD_REMOVED`
  - **ERROR:** `R_ERROR`, `R_ERROR_ABORTED_BY_CALLBACK`, `R_ERROR_BAD_FUNCTION_ARGUMENT`, `R_ERROR_DISALLOWED`, `R_ERROR_FUNCTION_NOT_FOUND`, `R_ERROR_RECURSIVE_API_CALL`, `R_ERROR_STATUS_BAD_HEADER`, `R_ERROR_STATUS_FRAME_CRC_MISMATCH`, `R_ERROR_STATUS_LOST_SYNC`, `R_ERROR_STATUS_UNPARSEABLE_STREAM`, `R_ERROR_UNKNOWN_OPTION`, `R_ERROR_UNSUPPORTED_PROTOCOL`
  - **INIT:** `R_INIT_STATUS_ALREADY_INITIALIZED`, `R_INIT_STATUS_ERROR_OPENING_FILE`, `R_INIT_STATUS_INVALID_CALLBACKS`, `R_INIT_STATUS_MEMORY_ALLOCATION_ERROR`, `R_INIT_STATUS_OK`, `R_INIT_STATUS_UNSUPPORTED_CONTAINER`
  - **LASTFM:** `R_LASTFM_BAD_ACCOUNT`, `R_LASTFM_BAD_SUBLEVEL`, `R_LASTFM_NO_ACCOUNT`, `R_LASTFM_NO_CONTENT`, `R_LASTFM_STREAM_LIMIT`
  - **LED** (23):
  
    ```
    R_LED_AUDIO_OFF, R_LED_BEGIN_SETUP_MODE, R_LED_BREAK_POP, R_LED_BROKEN_DEVICE, R_LED_CONTROL_FEEDBACK, R_LED_DEMO_CONFIGURE_IR, R_LED_DEMO_MODE, R_LED_FAULT, R_LED_HHID, R_LED_IDENTIFY_PLAYER, R_LED_IN_SETUP_MODE, R_LED_JOIN_HH, R_LED_JOIN_HH_OPEN, R_LED_MUTED, R_LED_PLAYING, R_LED_SHUTDOWN, R_LED_TRANSFER_REGISTRATION, R_LED_UPGRADE, R_LED_WAC, R_LED_WAC_TIMEOUT, R_LED_WAITING_TO_PAUSE, R_LED_WAITING_TO_PLAY, R_LED_WARN
    ```
  - **LENGTH:** `R_LENGTH_STATUS_ERROR`, `R_LENGTH_STATUS_OK`, `R_LENGTH_STATUS_UNSUPPORTED`
  - **MASK:** `R_MASK_FIVE_DOT_ONE`, `R_MASK_FIVE_DOT_ONE_DOT_TWO`, `R_MASK_NINE_DOT_ONE_DOT_FOUR`, `R_MASK_SEVEN_DOT_ONE`, `R_MASK_THREE_DOT_ONE`, `R_MASK_UNSPECIFIED`
  - **MOBILE:** `R_MOBILE_CANT_REACH_SERVER`
  - **PAND:** `R_PAND_BAD_ACCOUNT`, `R_PAND_BAD_SUBLEVEL`, `R_PAND_NO_ACCOUNT`, `R_PAND_READ_ONLY`, `R_PAND_STATION_GONE`, `R_PAND_SUSPENDED`, `R_PAND_TRIAL_EXPIRED`
  - **PLAY:** `R_PLAY`, `R_PLAY_OP_BOUNDARY`, `R_PLAY_OP_CHANGE_SRC`, `R_PLAY_OP_CODEC_SELECTED`, `R_PLAY_OP_ERROR`, `R_PLAY_OP_ORIGIN_TIME_SELECTED`, `R_PLAY_OP_RESYNC`, `R_PLAY_OP_SAMPLE`
  - **PLAYBACK:** `R_PLAYBACK_EXPIRED_TOKEN`, `R_PLAYBACK_EXPLICIT_NOT_ALLOWED`, `R_PLAYBACK_FAILED`, `R_PLAYBACK_NO_CONTENT`, `R_PLAYBACK_NO_PLAYABLE_CONTENT`, `R_PLAYBACK_STREAM_LIMIT`
  - **READ:** `R_READ`, `R_READ_FRAME`, `R_READ_METADATA`, `R_READ_STATUS_ABORT`, `R_READ_STATUS_CONTINUE`, `R_READ_STATUS_END_OF_STREAM`
  - **STREAM:** `R_STREAM_OP_ACK`, `R_STREAM_OP_BOUNDARY`, `R_STREAM_OP_CLOSE`, `R_STREAM_OP_ERROR`, `R_STREAM_OP_IMMED_RESYNC`, `R_STREAM_OP_INTERRUPT`, `R_STREAM_OP_OPEN`, `R_STREAM_OP_ORIGIN_TIME_SELECTED`, `R_STREAM_OP_QUALITY_SELECTED`, `R_STREAM_OP_SAMPLE`, `R_STREAM_OP_SCHED_RESYNC`
  - **TELL:** `R_TELL_STATUS_ERROR`, `R_TELL_STATUS_OK`, `R_TELL_STATUS_UNSUPPORTED`
  - **TYPE:** `R_TYPE_BOOSTED_BATTERY`, `R_TYPE_BUCKED_CAPACITOR`, `R_TYPE_BULK_CAPACITORS`, `R_TYPE_FRAME_NUMBER`, `R_TYPE_SAMPLE_NUMBER`, `R_TYPE_STANDARD`, `R_TYPE_SUB`, `R_TYPE_UNSPECIFIED`
  - **WMP:** `R_WMP_ACCESS_DENIED`, `R_WMP_NO_LICENSE`
  - **WRITE:** `R_WRITE`, `R_WRITE_STATUS_ABORT`, `R_WRITE_STATUS_CONTINUE`
- **count:** 403
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10fbb0a5, notes: R_LED_BEGIN_SETUP_MODE
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eee670, notes: R_CLOUD_QUEUE_STREAM_LIMIT
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10fbedfa, notes: R_MASK_NINE_DOT_ONE_DOT_FOUR
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eee508, notes: R_LASTFM_STREAM_LIMIT

## `smapi_capability_vocabulary`

The full SMAPI capability flag vocabulary exposed by the /customsd form — auth types, container types and ~20 capability bits a music service can declare (favorites, extended metadata, device certs...).

**Technical description:**

- **status:** confirmed
- **name:** SMAPI capability/auth/container vocabulary
- **description:** The /customsd POST form is a full SMAPI service-descriptor editor and enumerates the authoritative vocabulary that MusicServices ListAvailableServices descriptors carry.
- **sid_range:** 240-253 or 255
- **container_types:** `MService`, `SoundLab`
- **auth_types:** `UserId`, `Anonymous`, `DeviceLink`, `AppLink`
- **capabilities** (22):

  ```
  search, trFavorites, alFavorites, arFavorites, ucPlaylists, logging, playbackLogging, accountLogging, extendedMD, radioExtendedMD, playlistExtendedMD, disableAlarms, noMultiAccount, mediaUriActions, contextHeaders, deviceCerts, playerIds, contextReporting, userInfo, contentFiltering, manifest, authorizationHeader
  ```
- **optional_uris:** `strings`, `presentationMap`, `manifest`
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e763e4, notes: /customsd
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e772d4, notes: trFavorites
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e773d4, notes: playlistExtendedMD
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eba94c, notes: SoundLab
