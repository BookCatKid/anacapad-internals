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
- **note:** path literals proven in rodata; per-route handler output schemas harvested from handler+callee string refs: elements=XML/format templates emitted, files=shell/proc/jffs paths execd or read, misc_fields=field/token literals. Handlers dispatch through a module registry (vfunc +0x24) or call the shared command-stream helper f_1076b10c.
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
    -
      - **path:** /analoglinein
      - **flags:** 2
      - **handler:** 0x100bced0
      - **emit:**
        - **files:** 
        - **elements:** `<AnalogInInfo/>`
        - **misc_fields:** 
    -
      - **path:** /api
      - **flags:** 0x82
      - **handler:** 0x105eb124
      - **emit:**
        - **files:** 
        - **elements:** `<Muse>`, `</Muse>`
        - **misc_fields:** 
    -
      - **path:** /audiocore
      - **flags:** 2
      - **handler:** 0x100bb008
      - **emit:**
        - **files:** 
        - **elements:** `<AudioCore>`, `</AudioCore>`, `<SoundDevice><Zones>`, `</Zones></SoundDevice>`, `<DSPStateManager>`, `<Zones>`, `</Zones></DSPStateManager>`, `<PlayStateManager><PlayState>0x%08x</PlayState><PlaybackCount>%d</PlaybackCount><InfoCount>%d</InfoCount></PlayStateManager>`
        - **misc_fields:** `NONE`, `Unknown`
    - path: /backtrace, flags: 2, handler: 0x100b9260
    - path: /button_triggered.xml, flags: 2, handler: 0x100b91d8
    -
      - **path:** /cloud
      - **flags:** 2
      - **handler:** 0x105eb2c8
      - **emit:**
        - **files:** 
        - **elements** (24):
        
          ```
          <Cloud>, <ProtocolVersion>%s</ProtocolVersion>, <LastRetryAfter>%lld</LastRetryAfter>, <MillisecondsToNextConnect/>, <WebsocketRegistration>%s (%s)</WebsocketRegistration>, <WebsocketRegistration/>, </Cloud>, <LastRetryAfter/>, <MillisecondsToNextConnect>%ld</MillisecondsToNextConnect>, <State>Closed</State>, <MillisecondsClosed>%ld</MillisecondsClosed>, <OpenCount>%d</OpenCount>, <CloseCount>%d</CloseCount>, <ConsecutiveFailures>%d</ConsecutiveFailures>, <UnackedPings>%d</UnackedPings>, <LastPingTime>%d</LastPingTime>, <PingTimeWeightedAverage>%d</PingTimeWeightedAverage>, <Messages>%d</Messages>, <LastHttpStatus>%d</LastHttpStatus>, <LastWebSocketCode/>, <LastWebSocketCode>%u</LastWebSocketCode>, <LastHttpStatus/>, <PingTimeWeightedAverage/>, <LastPingTime/>
          ```
        - **misc_fields:** `Current`, `Pending`, `LoadBalancerHost`, `WebsocketServerHost`, `off`, `https`, `http`
    -
      - **path:** /cloudqueue
      - **flags:** 0x82
      - **handler:** 0x100babc0
      - **emit:**
        - **files:** 
        - **elements:** `</`, `>`
        - **misc_fields:** `CloudQueueHistory`, `base`, `name`, `service`, `account`, `Server`, `Unknown`, `Request`, `Duration`, `Time`, `units`, `Resource`, `ListEntry`, `Caller`
    -
      - **path:** /cpumon
      - **flags:** 0xe
      - **handler:** 0x100b9200
      - **emit:**
        - **files:** 
        - **elements:** `<CpuMonitor>`, `</CpuMonitor>`, `<Counter name="CPU Performance \[%u\]">`, `\[%d\] usr sys idle sIRQ`, `\[%s \| %07ld%03ld\]`, `\[%d\]  %2u  %2u   %2u   %2u`, `</Counter>`
        - **misc_fields:** `Moment`
    -
      - **path:** /decoder
      - **flags:** 2
      - **handler:** 0x100bc068
      - **emit:**
        - **files:** 
        - **elements:** `<MusicDecoder>`, `<LastActiveDecoder>%s</LastActiveDecoder>`, `</MusicDecoder>`, `<LastActiveDecoder>None</LastActiveDecoder>`
        - **misc_fields:** 
    -
      - **path:** /device
      - **flags:** 2
      - **handler:** 0x100bf634
      - **emit:**
        - **files:** 
        - **elements:** `<DeviceInfo>`, `<ZoneName>`, `</ZoneName>`, `<NetworkHash>%s</NetworkHash>`, `<DHCPServerMac>%s</DHCPServerMac>`, `<NetworkIPAddress>%s</NetworkIPAddress>`, `<NetworkMask>%s</NetworkMask>`, `</DiagLevel>`, `<DiagLevel>%s`, `<DevMode>%s</DevMode>`, `</DeviceInfo>`, `<DiagLevel>`, `0x%s %d.%d-%d.%d`
        - **misc_fields:** `anacapa.log`
    -
      - **path:** /dmesg
      - **flags:** 0xa
      - **handler:** 0x105eaba4
      - **emit:**
        - **files:** `/bin/dmesg -s 32768`, `/bin/dmesg -s 131072`
        - **elements:** 
        - **misc_fields:** 
    - path: /dnscache, flags: 2, handler: 0x100b91f4
    - path: /dropout_triggered.xml, flags: 2, handler: 0x100b91bc
    -
      - **path:** /enetports
      - **flags:** 0xb
      - **handler:** 0x105bc7cc
      - **emit:**
        - **files:** 
        - **elements:** `<EnetPorts>`, `<Port port='%d'><Link>%d</Link><Speed>%d%s</Speed></Port>`, `</EnetPorts>`, `eth%u`
        - **misc_fields:** 
    -
      - **path:** /ethportstatistics
      - **flags:** 0xa
      - **handler:** 0x105bc918
      - **emit:**
        - **files:** 
        - **elements:** `%s`, `eth%u`, `</`, `>`
        - **misc_fields** (22):
        
          ```
          txPackets, txErrors, rxDropped, rxPackets, txDropped, rxBytes, multicasts, EthIntrf, rxErrors, collisions, txBytes, lngthErr, ovrFlwErr, crcErr, frmeErr, missedErr, RxDtlErr, abrtErr, crErr, hrtBeatErr, wndwErr, TxDtlErr
          ```
    -
      - **path:** /experiments
      - **flags:** 2
      - **handler:** 0x100b9170
      - **emit:**
        - **files:** 
        - **elements:** 
        - **misc_fields:** `featureconfig`, `RFeatureConfigManager`, `FeatureConfigManager`
    -
      - **path:** /hardwareevents
      - **flags:** 2
      - **handler:** 0x100b9aac
      - **emit:**
        - **files:** 
        - **elements:** `<HardwareStatusInfo>`, `</HardwareStatusInfo>`, `<HW Name='CurrentStatus'><Orientation>%s</Orientation></HW>`, `<HWMembers Name='Members'><State>%s</State><Flags>%u</Flags><MicFlags>%u</MicFlags></HWMembers>`, `<Faults Name='WarningsAndFaults'>`, `<FaultState>%s</FaultState>`, `<WarningState>%s</WarningState>`, `<LastBitmask>%d</LastBitmask>`, `<LastBitmask2>%d</LastBitmask2>`, `</Faults>`
        - **misc_fields:** `Clear`, `Fault`, `Warning`
    - path: /hls, flags: 2, handler: 0x100bacfc
    - path: /htconfig, flags: 2, handler: 0x100bb144
    - path: /leds, flags: 0x82, handler: 0x100b9158
    - path: /libraries, flags: 2, handler: 0x100b9140
    -
      - **path:** /location_settings_update
      - **flags:** 2
      - **handler:** 0x105eaf20
      - **emit:**
        - **files:** 
        - **elements:** `<LocationSettingsUpdate>`, `</LocationSettingsUpdate>`, `<Data name="locationTarget_%d_id">%s</Data> <Data name="locationTarget_%d_data">%s</Data>`, `<Counter name="Completed Location Settings Updates"><!\[CDATA\[`, `%s \| %8lld \| %8lld \| %8lld \| %u \| %u \| %-19s \| %-21s \| %s \| %-35s \| %-5s \| %s`, `\]\]></Counter>`, `<Data name="Now">%s</Data>`, `<Data name="NextRetryMoment">%s</Data>`, `code:%X @ %d \[%s\]`
        - **misc_fields:** `UNK__updateTaskType`, `UNK__updTkCompSts`, `locSetUpdMgr`, `locationsettingsupdatemanager.cxx`
    - path: /musicservices, flags: 2, handler: 0x100b9120
    -
      - **path:** /netsettings.json
      - **flags:** 2
      - **handler:** 0x105eac48
      - **emit:**
        - **files:** 
        - **elements:** `<ReplicatedNetSettings LastUpdateDevice="%s" Version="%d" FileSchemaVersion="%d">`, `<SonosNet Disable="%d"/>`, `<SonosNet Frequency="%d"/>`, `<Network SSID="%s" Flags="%d"/>`, `<BackupLanSwapPsk id="%s"/>`, `</ReplicatedNetSettings>`, `<LanSwapPsk id="%s"/>`, `<ControlPsk id="%s"/>`, `<BackupControlPsk id="%s"/>`, `<RoomEncPsk id="%s"/>`, `<BackupRoomEncPsk id="%s"/>`, `<BackupHhPsk id="%s"/>`, `<HhPsk id="%s"/>`, `Upgraded %s to file schema %d`, `Entering SonosNet disable test mode, automatic revert in %d seconds`
        - **misc_fields:** `netsettings.json`, `netsettings`
    - path: /netsettings.txt, flags: 2, handler: 0x105eac18
    -
      - **path:** /opt/log/mdnsd.log
      - **flags:** 6
      - **handler:** 0x100b9030
      - **emit:**
        - **files:** `/opt/log/mdnsd.log`, `/jffs/app/log/`, `/opt/log`, `/jffs/app/settings/player/`, `/opt/`, `/jffs/app/settings/`, `/jffs/`, `/opt/log/player/`, `/opt/log/`, `/jffs/app/log/player/`
        - **elements:** `%s/app/log`, `%s/app/settings`, `%s%s%s`, `error reading file %s (errno=%d %s)`, `</File>`, `<File name='`, `'>`, `error opening file %s (errno=%d %s)`
        - **misc_fields:** `mdns`
    - path: /perfcounters, flags: 0xe, handler: 0x100b9004
    -
      - **path:** /playmode
      - **flags:** 6
      - **handler:** 0x100bbe98
      - **emit:**
        - **files:** 
        - **elements:** `<Playmode><Shuffle>%s</Shuffle><Repeat>%s</Repeat><Crossfade>%s</Crossfade></Playmode>`
        - **misc_fields:** `Off`, `Track`
    -
      - **path:** /policy
      - **flags:** 2
      - **handler:** 0x100bc97c
      - **emit:**
        - **files:** 
        - **elements:** `<Entitlements>`, `<Entitlement type="%s" isTrial="%s" sku="%s" startDate="%s" endDate="%s" codes="%s" />`, `%s%s`, `</Entitlements>`, `<CloudSettings cacheStatus="get_status_fresh" eTag="%s" type="json">`, `</CloudSettings>`, `vector::_M_range_check: __n (which is %zu) >= this->size() (which is %zu)`
        - **misc_fields** (32):
        
          ```
          entitlements, yes, entmt, global, lobal, uuuuuuuubtnufruuuuuuuuuuuuuuuuuu, obal, value, bal, usageContext, BUSINESS, scheduledChangeValue, cheduledChangeValue, heduledChangeValue, enableContentAccess, nableContentAccess, ableContentAccess, bleContentAccess, playback, layback, ayback, yback, allowDirectControl, allowLineIn, llowLineIn, lowLineIn, owLineIn, allowAirplay, llowAirplay, lowAirplay, owAirplay, uuuuuuubtnufruuuuuuuuuuuuuuuuuu
          ```
    - path: /radiolog, flags: 2, handler: 0x100b8ff8
    - path: /regcert, flags: 2, handler: 0x105eb984
    -
      - **path:** /registration
      - **flags:** 2
      - **handler:** 0x105eb17c
      - **emit:**
        - **files:** 
        - **elements:** `<Registration>`, `<RegState>%d</RegState>`, `<CustomerID>%s</CustomerID>`, `</Registration>`
        - **misc_fields:** 
    -
      - **path:** /renderingcontrol
      - **flags:** 2
      - **handler:** 0x100b8f2c
      - **emit:**
        - **files:** 
        - **elements:** `<RenderingControl>`, `<DuckingFlags>%s</DuckingFlags>`, `<SodVolume>%d</SodVolume>`, `<ExtVolume>%d</ExtVolume>`, `<AudioCoreReady>%s</AudioCoreReady>`, `<DeviceTime>%d.%06d</DeviceTime>`, `</RenderingControl>`, `<AmpState>%s</AmpState>`, `<MasterVolume>%u</MasterVolume>`, `<MasterMute>%u</MasterMute>`, `<FocusModeMute>%u</FocusModeMute>`, `<VolumeScale>%u</VolumeScale>`, `<PlaybackDucked>%u</PlaybackDucked>`
        - **misc_fields:** `yes`, `off`
    - path: /root_cert_bundles, flags: 2, handler: 0x105eb9a0
    -
      - **path:** /rss
      - **flags:** 2
      - **handler:** 0x105eadb8
      - **emit:**
        - **files:** 
        - **elements:** `<ReplicatedSettingsState>`, `</ReplicatedSettingsState>`, `<Setting idx="%u" lud="%s" version="%u" />`
        - **misc_fields:** 
    - path: /settings/effective, flags: 2, handler: 0x100b8ef8
    - path: /settings/location, flags: 2, handler: 0x100b8f14
    - path: /settings/player, flags: 2, handler: 0x100b8edc
    - path: /shares, flags: 2, handler: 0x100b8ebc
    - path: /spdiftap, flags: 2, handler: 0x100bd810
    - path: /ssidlist.txt, flags: 2, handler: 0x105eac30
    - path: /ssl_client_cache, flags: 2, handler: 0x105eb9ac
    - path: /syssettings, flags: 2, handler: 0x105eada0
    -
      - **path:** /temperature
      - **flags:** 2
      - **handler:** 0x100b8dcc
      - **emit:**
        - **files:** 
        - **elements:** `<TemperatureHistograms><CPUTemperature>%s</CPUTemperature></TemperatureHistograms>`
        - **misc_fields:** 
    - path: /topology, flags: 0xa, handler: 0x105eaafc
    -
      - **path:** /track_queue_summary
      - **flags:** 2
      - **handler:** 0x100baa84
      - **emit:**
        - **files:** 
        - **elements:** `<TrackQueueSummary>`, `</TrackQueueSummary>`
        - **misc_fields:** `Shared`, `Private`, `AVT`
    -
      - **path:** /tracks_summary
      - **flags:** 2
      - **handler:** 0x10108138
      - **emit:**
        - **files:** 
        - **elements:** `<TrackSummary>`, `<Tables>`, `<Table name='Title' max='%d' count='%d'/>`, `</Tables>`, `<StoreSize>%zu</StoreSize>`, `<StoreUsed>%u</StoreUsed>`, `<EntriesSize>%u</EntriesSize>`, `<EntriesUsed>%u</EntriesUsed>`, `<Conflicts>%u</Conflicts>`, `</TrackSummary>`
        - **misc_fields:** 
    - path: /trueplayinfo, flags: 2, handler: 0x100b8ea4
    - path: /tvprocessor, flags: 2, handler: 0x100bb318
    - path: /update, flags: 2, handler: 0x100b8e84
    -
      - **path:** /upnp
      - **flags:** 0xa
      - **handler:** 0x105eb0b4
      - **emit:**
        - **files:** 
        - **elements** (22):
        
          ```
          <Subscriptions>, </Subscriptions>, <Incoming>, </Incoming>, <Service name='%s' current='%zu' max='%d'>, <Subscription>, <EventKey>%u</EventKey>, <NotifyErrors>%u</NotifyErrors>, <SubscriptionID>%s</SubscriptionID>, </Subscription>, <NotificationAddr>%s</NotificationAddr>, <NotificationAddr>wss://%s:%u (muse)</NotificationAddr>, </Service>, <IsSecure>%d</IsSecure>, <Outgoing>, <LogicalSID>%6s</LogicalSID>, <UPnPSID>%s</UPnPSID>, <EventURI>%s</EventURI>, <FailureCount>%3d</FailureCount>, </Outgoing>, <NextRenew>%ld</NextRenew>, <ExpectedSeq>%u</ExpectedSeq>
          ```
        - **misc_fields:** 
    - path: /wireless, flags: 0xb, handler: 0x105eab50
    -
      - **path:** /zp
      - **flags:** 1
      - **handler:** 0x100bfbac
      - **emit:**
        - **files:** 
        - **elements** (24):
        
          ```
          <ZPInfo>, <ZoneName>, </ZoneName>, <ZoneIcon>%s</ZoneIcon>, <Configuration>%s</Configuration>, <LocalUID>%s</LocalUID>, <SerialNumber>%s</SerialNumber>, <SoftwareVersion>%s</SoftwareVersion>, <BuildType>%s</BuildType>, <SWGen>%u</SWGen>, <SoftwareDate>%s</SoftwareDate>, <SoftwareScm>%s</SoftwareScm>, <HHSwgenState>%s</HHSwgenState>, <MinCompatibleVersion>%s</MinCompatibleVersion>, <LegacyCompatibleVersion>%s</LegacyCompatibleVersion>, <HardwareVersion>%s</HardwareVersion>, <DspVersion>%d.%d.%d</DspVersion>, <SeriesID>%s</SeriesID>, <MfgLocation>%u</MfgLocation>, <DateCode>%u</DateCode>, <HwFlags>0x%x</HwFlags>, <HwFeatures>0x%x</HwFeatures>, <Variant>%u</Variant>, <GeneralFlags>0x%x</GeneralFlags>
          ```
        - **misc_fields** (40):
        
          ```
          hhSwgenState, build.date, build.scm.version, release, topology, informLocalPlayerChange, getLocalChannelName, S43, ZP120, ZP90, BR200, Sub, S21, S12, S11, S13, S18, S14, S15, S16, S17, S20, S59, S19, S34, S22, S23, S38, S54, S35, S27, S42, S28, S33, S56, S53, S51, S45, S44, S37
          ```
  - **/logger:**
    - **status:** strong
    - **description:** Sonos Logger admin form (POST, csrfToken): fields {dest:file\|"udp"\|"stderr",cat:category e.g. avt_impl,level:0-11 DIAGC(0)→SONOS_LOG(3)} + UDP {udp,udp_addr,udp_port,udp_default} + stderr {stderr,stderr_default} + Diag Msg {msg} + Log Backup {backup_dir,submitAction=logBackup→/jffs/app/log}; errors {Invalid log level/UDP port/UDP default/STDERR default,Log destination not found,UDP already enabled,Diag Msg not allowed}; "Private IP address is required for UDP logging"; dest charset `_ -./\`; status shows Active Destinations(default level)
  - **/devmode:**
    - **status:** strong
    - **description:** dev-mode code entry: GET shows Model/Device ID/Version + form{csrfToken,statement textarea(11x80),button=submit\|delete} → "Statement installed."/"Statement removed." — signed statement mechanism
  - **/support:**
    - **detail:** ZPSupportInfo XML: <ZPSupportInfo><ZPNetworkInfo type="%s" %s="%s"><ZPSupportItem title="%s">… exec pages wrap <Command cmdline="…"> + /tmp/diagstdout+/tmp/diagstdin + <!-- SDT: %ld ms -->; path allowlist {/jffs/app/log,/jffs/app/settings,/jffs,/opt/log,/opt,/tmp,/var} + ambient caps dropped + child read timeout; application/octet downloads; CDATA escapes
- **description:** Full registration table decoded: 59 routes at .data 0x110908c8, entry {path, flags, handler} stride 0xc. Flag values: 0x2 default GET, 0xa/0xb/0xe privilege variants (dmesg/topology/upnp, enetports/wireless, cpumon/perfcounters), 0x82 write-capable (api/cloudqueue/leds), 0x6 (mdnsd log + playmode), 0x1 (/zp root page).
- **route_semantics:**
  - **/accounts:** worker f_101b6edc: account-list doc ; emits <AccountsInfo> (f_10291974)
  - **/activeZones:** worker f_10188b88: active-zones list
  - **/ai_speech_enhance:** worker f_1023d4f0: AI speech-enhance status
  - **/alarm:** tail f_10277030(*(0x11095f88)+0xaa70,req): alarm-status doc
  - **/analoglinein:** worker f_10209018: analog line-in state
  - **/api:** tail f_10769d34 + f_1068c79c: API-provider inventory + command-stream emitter (</Command>)
  - **/audiocore:** worker f_102a595c: audio-core dump
  - **/backtrace:** tail f_10196174(singleton,req): backtrace dump
  - **/button_triggered.xml:** tail f_10195c74(singleton,req,1): shared raw-trigger XML emitter (r5=1=button)
  - **/cloud:** worker f_10599c28: cloud-connection status
  - **/cloudqueue:** f_101886e0 ctx + f_10257590: cloud-queue dump
  - **/cpumon:** emits <CpuMonitor> XML via f_1023a800
  - **/decoder:** workers f_1023d4d0/f_101887a0/f_1030be10: decoder state
  - **/device:** 511i-class device-info doc: many formatters (identity/capabilities) ; emits <DeviceInfo> (0x100bf634)
  - **/dmesg:** tail f_1076b10c = shared command-stream helper (dmesg is an exec/file-backed page)
  - **/dnscache:** tail f_10769d34 (shared command-stream emitter, same target as /api; emits </Command>)
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
  - **/syssettings:** tail f_106937dc = the UPnP security gate (emits "UPnP request denied (403). An insecure request was attempted when in secure mode." / invalid-loopback-token 403) - page is secured behind the same auth check as UPnP control
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
  - **/settings/effective /settings/location /settings/player:** all three tail-call f_101886a4: shared settings-doc emitter dispatched on a member of the global app object (each stub selects a different member offset before the tail call); emitter itself delegates again - no direct XML literals
- **handler_classes:** 3 classes: (a) big inline handler with workers; (b) thin tail-emitter {r3=singleton/member, r4=req, optional r5 selector}; (c) engine-singleton virtual delegate (*(0x11097680)->v\[+0x84\] -> obj->v\[+0xfc\])
- **raw_trigger_payload:** /raw and /status/{button,dropout}_triggered.xml emit <ZPSupportInfo> via f_1076b5ac/f_1076b5dc/f_1076b8ec; /dsp emits <DSPStateManager> via f_10d90388
- **route_descriptor:**
  - **address:** 0x11090000
  - **layout:** {+0x00 table 0x1109d3c0, +0x04 root-handler f_1006a690, +0x08/+0x0c name strs, +0x18 -1, +0x1c 1, +0x20 0x01000000 flags, +0x24 -> /status sub-table 0x110908c8, +0x28/+0x2c aux tables, +0x30 keepalive f_105e98ec, +0x3c f_100bbc80}
  - **keepalive:** f_105e98ec: sonosClockGetTime -> *(req_ctx)=now+0x3c (60s deadline); shared_ptr atomic-release on captured obj
  - **flags_note:** sub-route flag enforcement (0x2/0xa/0xb/0xe/0x82/0x6/0x1) happens inside the generic router path-match (f_1006a690 family) - enforcement site not pinned; values observed: 0x2 default, 0xa/0xb/0xe privileged-family, 0x82 writable, 0x6, 0x1 root
  - **root_fn:** f_1006a690 = anacapad main(): banner 'Anacapa Middleware Server 1.02 (C) Rincon Networks Inc. 2003', usage '\[-h\] \[-c config\] \[-u username\] \[-C caps\]', default conf /opt/conf/anacapa.conf, getopt jump table (optch-'C')*4 -> opts 'C'..'u', sonos_auth_become_capable(user) -> exit(1) on failure
- **flags_semantics:** route flag values are CAPABILITY BITS checked against the daemon's -C caps set (sonos_auth_become_capable): 0x2=default viewer, 0xa/0xb/0xe=elevated capability combos, 0x82=0x80\|0x2 write+cap, 0x6, 0x1=root/zp - enforced by the router's capability check, not ad-hoc auth
- **master_route_table:**
  - **provenance:** 102 records @0x11090c00 stride-28: {name*, handler*, flagfields...}; all UPnP /Control routes share generic dispatcher f_105e8274, /Event f_105e8290, GENA /notify f_105e82c8
  - **notable:**
    - **/api:** f_100d2cf8 (real muse JSON entry)
    - **/websocket/api:** f_100bb8ac flag 0x200
    - **/musedebug:** f_100ba010
    - **/device_account:** f_1065bd70 flag 0x100
    - **/unlock /unlock.htm /mfgunlock:** f_10675244/f_10675234 flag 0x100 (mfg unlock flow)
    - **/testpoint /cloudqueuepoll:** flag 0x400
    - **/support/asyncsubmit:** flag 0x30002
    - **/getsetting:** f_105e82b8 flag 0x232101
    - **/indexrepl:** f_100b8a10 flag 0x230101
    - **/getrs:** f_105e82a8 flag 1
    - **/ssh/fingerprints:** f_105e9578 flag 0x101
    - **/rdmhhsetup /rdmbuttonfwd /mtmhhsetup:** flag 0x100 (retail/demo mgmt)
    - **/ranges boundary:** multipart template ##123456789###BOUNDARY
  - **flags_note:** w\[2\] flag field small-int space {1,3,0x100,0x101,0x102,0x200,0x30002,0x400,0x230101,0x232101}: likely method/capability bitmask (0x100=POST-ish, 0x200=WS upgrade, 0x400=internal); large values may pack method+auth+tier — undecoded
  - **routes:**
    - **/status:**
      - **handler:** f_105ebb20
      - **flags:** 
      - **detail:** Status-page umbrella handler f_105ebb20 (actual page content via status-page registry at 0x11090144).
    - **/dsp:**
      - **handler:** f_100ba73c
      - **flags:** 
    - **/raw:**
      - **handler:** f_105ea98c
      - **flags:** `268435456`
      - **detail:** Raw trigger dump (f_105ea98c, flag 0x10000000). Covers /dropout_triggered + /button_triggered; honors CONTENT-TYPE header.
    - **/api:**
      - **handler:** f_100d2cf8
      - **flags:** 
    - **/musedebug:**
      - **handler:** f_100ba010
      - **flags:** 
      - **detail:** HTML-pre muse debug dump (f_100ba010).
    - **/device_account:**
      - **handler:** f_1065bd70
      - **flags:** `256`
      - **detail:** Device-account endpoint (f_1065bd70, flag 0x100). Handler shape = muse-engine mount (identical to /api): registers the route literal via f_10509bf4 + f_1055667c -> requests dispatch into the muse op framework under a device-account namespace. Flag 0x100.
    - **/AlarmClock/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/AudioIn/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/DeviceProperties/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/GroupManagement/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/HTControl/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/MusicServices/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/SystemProperties/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/ZoneGroupTopology/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/QPlay/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/MediaServer/ConnectionManager/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/MediaServer/ContentDirectory/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/MediaRenderer/ConnectionManager/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/MediaRenderer/RenderingControl/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/MediaRenderer/AVTransport/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/MediaRenderer/GroupRenderingControl/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/MediaRenderer/Queue/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/MediaRenderer/VirtualLineIn/Control:**
      - **handler:** f_105e8274
      - **flags:** 
    - **/AlarmClock/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/AudioIn/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/DeviceProperties/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/GroupManagement/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/HTControl/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/MusicServices/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/SystemProperties/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/ZoneGroupTopology/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/MediaServer/ConnectionManager/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/MediaServer/ContentDirectory/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/MediaRenderer/ConnectionManager/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/MediaRenderer/RenderingControl/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/MediaRenderer/AVTransport/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/MediaRenderer/GroupRenderingControl/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/MediaRenderer/Queue/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/MediaRenderer/VirtualLineIn/Event:**
      - **handler:** f_105e8290
      - **flags:** 
    - **/notify:**
      - **handler:** f_105e82c8
      - **flags:** 
    - **/xml/device_description.xml:**
      - **handler:** f_105e98d8
      - **flags:** 
    - **/xml/group_description.xml:**
      - **handler:** f_100b95d0
      - **flags:** 
    - **/getaa:**
      - **handler:** f_100b8c2c
      - **flags:** 
    - **/getrs:**
      - **handler:** f_105e82a8
      - **flags:** `1`
    - **/getsetting:**
      - **handler:** f_105e82b8
      - **flags:** `2302209`, `3`
    - **/indexrepl:**
      - **handler:** f_100b8a10
      - **flags:** `2294017`
    - **/msprox:**
      - **handler:** f_100b88d0
      - **flags:** 
    - **/unlock:**
      - **handler:** f_10675244
      - **flags:** `256`
      - **detail:** Unlock page (f_10675244, flag 0x100; also /unlock.htm): on success "<h2>Success</h2>" HTML. Handler f_10675244 is a state toggle: branches to f_106750b4/f_1067471c (unlock/lock paths), calls f_10957b58/f_10957f84, emits Success HTML.
    - **/unlock.htm:**
      - **handler:** f_10675244
      - **flags:** `256`
    - **/mfgunlock:**
      - **handler:** f_10675234
      - **flags:** `256`
      - **detail:** mfg unlock sibling
      - **status:** strong
    - **/devmode:**
      - **handler:** f_105e8d90
      - **flags:** 
    - **/testenv:**
      - **handler:** f_105eb9dc
      - **flags:** 
    - **/customsd:**
      - **handler:** f_103429f4
      - **flags:** 
    - **/customsd.htm:**
      - **handler:** f_103429f4
      - **flags:** 
    - **/fcs:**
      - **handler:** f_105eba60
      - **flags:** 
    - **/tools:**
      - **handler:** f_100d4060
      - **flags:** 
    - **/tools.htm:**
      - **handler:** f_100d4060
      - **flags:** 
    - **/ping:**
      - **handler:** f_100d3f88
      - **flags:** 
      - **detail:** Shell passthrough: execs /bin/ping -c 3 (f_100d3f88).
    - **/traceroute:**
      - **handler:** f_100d3ff4
      - **flags:** 
      - **detail:** Shell passthrough: execs /usr/bin/traceroute (f_100d3ff4).
    - **/mdnsannounce:**
      - **handler:** f_100c1230
      - **flags:** 
      - **detail:** mDNS announce button on /spotifyzc
      - **status:** strong
    - **/pcap:**
      - **handler:** f_100d416c
      - **flags:** 
      - **detail:** Packet-capture download (f_100d416c). Internally execs "/bin/pcap - not (host %s and port %d)"; streams attachment trace.pcap application/octet-stream.
    - **/save_eq_presets:**
      - **handler:** f_100ba144
      - **flags:** 
      - **detail:** writes eqdata.txt via path-builder f_100b97f4 + form processor f_1068a70c
      - **status:** strong
    - **/getDSP:**
      - **handler:** f_100bd9fc
      - **flags:** 
      - **detail:** DSP state XML dump (f_100bd9fc) text/xml <root>..</root>.
    - **/putDSP:**
      - **handler:** f_100bb63c
      - **flags:** 
      - **detail:** gate → obj->vt\[2\] commit + atomic refcount; uploads DSP config
      - **status:** strong
    - **/setPersistentEQ:**
      - **handler:** f_100ba218
      - **flags:** 
      - **detail:** writes app/debug/dsp/persistentEQ.xml via same form processor
      - **status:** strong
    - **/removeDSPDebugFiles:**
      - **handler:** f_100bc518
      - **flags:** 
      - **detail:** Deletes files under app/debug/dsp/ (f_100bc518).
    - **/dolby_config:**
      - **handler:** f_100be454
      - **flags:** 
      - **detail:** gate f_10548a14 → f_100be1cc writes config; else 500-class
      - **status:** strong
    - **/audio_tap:**
      - **handler:** f_100becc4
      - **flags:** 
      - **detail:** Mic/line audio-tap debug stream (f_100becc4). Returns audio/wav. Errors: "AudioTap: permission denied\|syntax error\|invalid request\|no tap specified"; logs "allowed %d mic %d".
    - **/advconfig:**
      - **handler:** f_105e8444
      - **flags:** 
      - **detail:** Advanced-config form (f_105e8444; also /advconfig.htm). form-urlencoded; fields include FirstZP \[%d\] and PriorityBridge \[%d\].
    - **/advconfig.htm:**
      - **handler:** f_105e8444
      - **flags:** 
    - **/testpoint:**
      - **handler:** f_100b85ec
      - **flags:** `1024`
      - **detail:** exec registry {init f_10571a84,run f_10571ae4,cleanup f_10571c88} over rodata struct 0x10e72a9c
      - **status:** strong
    - **/diaglevel:**
      - **handler:** f_105e93d8
      - **flags:** 
    - **/diagmsg:**
      - **handler:** f_105e93d8
      - **flags:** 
    - **/logger:**
      - **handler:** f_105e93d8
      - **flags:** 
    - **/jobs:**
      - **handler:** f_105523e8
      - **flags:** 
      - **detail:** HTTP job-runner console (f_105523e8). GET lists Job->Shortname table; GET ?job=<shortname> triggers run ("Requesting %s job run" -> "Job %s scheduled"). Doc string shows ?job=UploadEvents.
    - **/reboot:**
      - **handler:** f_105e92e0
      - **flags:** 
    - **/reset:**
      - **handler:** f_105e935c
      - **flags:** 
      - **detail:** Factory Reset / Reboot page: generic form "<h2>%s</h2> POST /%s csrfToken Submit" + "Remote factory reset." + "<h2>%s</h2>Rebooting..."
      - **status:** strong
    - **/sonarctl:**
      - **handler:** f_100bc354
      - **flags:** 
    - **/ttm_helper:**
      - **handler:** f_100b9740
      - **flags:** 
    - **/rdmhhsetup:**
      - **handler:** f_105ebeb4
      - **flags:** `256`
      - **detail:** Retail Display Mode HHID setup (f_105ebeb4, flag 0x100). form-urlencoded POST; requires factory-reset state else ": not factory reset" failure HTML; on success "Retail Display HHID %s configured, rebooting..."; x-rincon-roomicon:generic. HHID prefix Sonos_RDM_; same factory-reset + roomicon flow.
    - **/rdmbuttonfwd:**
      - **handler:** f_100b9e58
      - **flags:** `256`
    - **/mtmhhsetup:**
      - **handler:** f_105ec758
      - **flags:** `256`
      - **detail:** MTM household setup (f_105ec758, flag 0x100). form-urlencoded POST, params prefixed MTM_ + NFWSSID; replies application/json {hhid,key,rebootDelay} or {error,message}. Sends x-rincon-roomicon:generic. Param names proven: Sonos_MTM_ prefix, NFWSSID, NFWPwd; per-field validation errors "invalid key\|name\|icon\|wifi_pwd\|hhid\|wifi_ssid" + "wifi_pwd requires wifi_ssid param" + "not factory reset"; HHID charset base62.
    - **/ssh/fingerprints:**
      - **handler:** f_105e9578
      - **flags:** `257`
      - **detail:** tail f_10670638 reads fingerprint buffer 0x11097680+0x8d0; record fields {+15c,+158,+178,+182,+184}
      - **status:** strong
    - **/snapshotspdiftap:**
      - **handler:** f_100bd5e4
      - **flags:** 
      - **detail:** gate → verifies vt+0x124==f_100c3f5c snapshot vfunc → takes snapshot
      - **status:** strong
    - **/downloadspdiftap:**
      - **handler:** f_100b9ed0
      - **flags:** 
      - **detail:** gate f_1054bdc8 → snprintf %s/%s spdiftap.compressed → streams file
      - **status:** strong
    - **/cloudqueuepoll:**
      - **handler:** f_100b8260
      - **flags:** `1024`
    - **/info:**
      - **handler:** f_100c11e4
      - **flags:** 
    - **/websocket/api:**
      - **handler:** f_100bb8ac
      - **flags:** `512`
    - **/spotifyzc:**
      - **handler:** f_1020f8c4
      - **flags:** 
      - **detail:** Spotify Connect ZeroConf endpoint (f_1020f8c4). POST application/x-www-form-urlencoded; addUser action takes userName + player uuid, replies application/json. Error vocabulary ERROR-INVALID-ARGUMENTS/ERROR-UNKNOWN/ERROR-SPOTIFY-ERROR/ERROR-LOGIN-FAILED; pulls token/key from DC account ("%s@%s" user@device fmt, SONOS_DC_UNKNOWN).
      - **page:** <h3>Tools for debugging Spotify issues</h3> + forms {mDNS Announce→/mdnsannounce,Reset NTS→/spotresetnts} both csrfToken POSTs; "spot: permission denied"
      - **status:** strong
    - **/spotdbg:**
      - **handler:** f_100b8140
      - **flags:** 
    - **/spotresetnts:**
      - **handler:** f_100b7fd8
      - **flags:** 
      - **detail:** Reset NTS button on /spotifyzc
      - **status:** strong
    - **/sethostip:**
      - **handler:** f_100b9fac
      - **flags:** 
    - **/nslookup:**
      - **handler:** f_100b96d0
      - **flags:** 
    - **/forcegtkrekey:**
      - **handler:** f_100b9640
      - **flags:** 
    - **/setstring:**
      - **handler:** f_100b7cb4
      - **flags:** 
      - **form:** <h2>System Settings</h2> POST {csrfToken hidden,key size=80,value size=80}; responses {"Setting changed","HTTP Error %d"}
      - **status:** strong
    - **/removestring:**
      - **handler:** f_100b79e0
      - **flags:** 
      - **form:** <h2>Remove System Setting</h2> POST {csrfToken hidden,key size=64}; responses {"Setting removed","HTTP Error %d"}; cache-control "no-cache, no-store, must-revalidate" + application/x-www-form-urlencoded
      - **status:** strong
    - **/support/directsubmit:**
      - **handler:** f_105e9b30
      - **flags:** 
      - **detail:** Diagnostic submit form POST (f_105e9b30): success page returns numeric confirmation ("The diagnostic information was sent... confirmation number: %u"); failure page "There was a problem submitting the diagnostic information."
    - **/support/review:**
      - **handler:** f_105e9e60
      - **flags:** 
    - **/support/aggregate:**
      - **handler:** f_105e9fb0
      - **flags:** `268435456`
    - **/support/asyncsubmit:**
      - **handler:** f_105ea400
      - **flags:** `196610`
    - **/support/reportstatus:**
      - **handler:** f_105ea734
      - **flags:** `258`
- **dispatch_model:**
  - **locator_global:** 0x11097680 (.bss, runtime-populated service locator)
  - **locator_vfuncs:**
    - **0x84:** resolve module object for this page (per-handler hardcoded or string-keyed)
    - **0xf8:** module render — writes the page XML into the response stream
    - **0x6c_0x178:** /device-class handlers call locator members +0x6c/+0x178 for shared header emit
  - **registry2_global:** 0x11095f88 — second .bss registry used by the /accounts,/analoglinein,/registration class; handler verifies installed vfunc+0x24 against a per-module constant before indirect call
  - **module_tags** (89):
  
    ```
    AccountsInfo, Active, ActiveDeviceList, Alarm, Alarms, AudioCore, Backtrace, Bundles, Cert, ClientVersion, Cloud, ConnectionDetails, CpuMonitor, DNSCache, DSPStateManager, Decoder, DeviceInfo, DiagLevel, EnetPorts, Entry, General, HTConfig, HardwareStatusInfo, History, IRCode, IdxTrk, Incoming, LedPatternInfo, LocalSettings, LocalTime, MediaServers, Mode, Mount, Muse, MusicDecoder, NetSettings, NextLocal, NextUTC, Outgoing, Path, Pending, PendingAlarm, PerformanceCounterTables, Presentation, QuarantinedDevices, Registration, RenderingControl, Replication, RestHistory, RoomCalibrationActiveState, RoomCalibrationAvailCalID, RoomCalibrationBondedZoneInfo, RoomCalibrationInfo, RoomCalibrationOrientation, RoomCalibrationUserIntent, SPDIFTap, SSLClientCache, Satellites, Scheduler, SelfTrueplayEQ, SelfTrueplayInfo, ServiceIds, Services, SsidList, SubscribedEvents, Subscription, Subscriptions, Tables, ThirdPartyLibraryInfo, TimeUTC, Titles, Total, TrackQueueSummary, TrackSummary, UTCTime, UpdateInfo, UsageMetrics, UserAgent, VanishedDevices, Version, WebSocketHistory, Wireless, ZPInfo, ZPSupportInfo, ZoneGroupState, ZoneGroups, ZoneName, ZonePlayers, Zones
    ```
  - **note:** <Name> tags = the emitted root element AND the registered module identity; 90 tags in rodata vs 57 routed pages — unrouted tags (e.g. RoomCalibration*, VanishedDevices, UsageMetrics) are sub-documents emitted inside other pages
  - **resolve_slot:** locator->vt\[+0x84\] proven (resolves module; e.g. /wireless f_105eab50)
  - **render_slot:** module->vt\[+0xFC\] proven for /wireless shape (+0xF8 for other modules - per-module vtable layout)
  - **registry2_pattern:** Pattern A: handler reads *(0x11095f88)+N prebound module ptrs, verifies module->vt\[+0x24\] == per-page constant (the page method), calls it. Adjuster thunks (this+=off; b) bridge MI bases, e.g. /accounts f_101b6edc -> f_10427174.
  - **shared_base_renderer:** /ai_speech_enhance,/decoder,/htconfig,/spdiftap,/tvprocessor all verify f_100c3f5c (one base-class page method); /analoglinein verifies f_100c3b0c. Output = member dump via computed names - no static schema literals.
- **status_page_registry:**
  - **provenance:** stride-12 {name*, flag, source*/handler*} table at ~0x11090144-0x11090b6c (immediately precedes the master 102-record route table at 0x11090c00). Two page families: exec/file pages (source = shell cmd string like /sbin/lsmod, /bin/chronyc, or file path under /jffs /opt/log /proc/ath_rincon) and module pages (source = .text handler). flag values 1,2,6,0xa,0xb,0xe,0x43,0x46,0x82 — semantics undecoded, likely content-type/auth bitmask (0x82 set on /api,/cloudqueue,/leds).
  - **exec_pages:** `/ifconfig->/sbin/...`, `/lsmod->/sbin/lsmod`, `/mount->/bin/mount`, `/netstat->/bin/netstat -an`, `/ntpsources->/bin/chronyc -n sources -v`, `/ps->/bin/ps`, `/route->/sbin/route -n`, `/scanresults->/wifi/athconfig scangetresults ath0 (flag 6)`, `/showmacs->brctl showmacs br0`, `/showports->brctl showports br0`, `/showstats->brctl showstats br0`, `/showstp->brctl showstp br0`, `/uptime->/usr/bin/uptime`, `/df`, `/du-jffs`, `/free`, `/date`, `/debugfiles`, `/dmesg`
  - **file_pages:** ~45 file-cat pages: /VERSION, /etc/resolv.conf, /jffs/{settings/*.json\|xml, *.log, irconfig.txt, localsettings.txt, shadow/stats, sys/log/setup*}, /opt/log/anacapa.*.log (18+ named logs incl. musecmdandrsp/museevt/lechmere.event/chsrc.state/trueplay), /proc/ath_rincon*/{device,dfs,fullstatus,mibcc,nf,phyerr,roam,station,status,primary}
  - **module_pages:**
    - **/accounts:** f_100ba480
    - **/activeZones:** f_100b9298
    - **/ai_speech_enhance:** f_100ba8b0
    - **/alarm:** f_100b9278
    - **/analoglinein:** f_100bced0
    - **/api:** f_105eb124 (flag 0x82 — muse)
    - **/audiocore:** f_100bb008
    - **/backtrace:** f_100b9260
    - **/button_triggered.xml:** f_100b91d8
    - **/cloud:** f_105eb2c8
    - **/cloudqueue:** f_100babc0 (flag 0x82)
    - **/cpumon:** f_100b9200
    - **/decoder:** f_100bc068
    - **/device:** f_100bf634
    - **/dmesg:** f_105eaba4
    - **/dnscache:** f_100b91f4
    - **/dropout_triggered.xml:** f_100b91bc
    - **/enetports:** f_105bc7cc
    - **/ethportstatistics:** f_105bc918
    - **/experiments:** f_100b9170
    - **/hardwareevents:** f_100b9aac
    - **/hls:** f_100bacfc
    - **/htconfig:** f_100bb144
    - **/leds:** f_100b9158 (flag 0x82)
    - **/libraries:** f_100b9140
    - **/location_settings_update:** f_105eaf20
    - **/musicservices:** f_100b9120
    - **/netsettings.json:** f_105eac48
    - **/netsettings.txt:** f_105eac18
    - **/perfcounters:** f_100b9004
    - **/playmode:** f_100bbe98
    - **/policy:** f_100bc97c
    - **/radiolog:** f_100b8ff8
    - **/regcert:** f_105eb984 -> locator+2260 -> f_105a699c in f_105a6984 (DeviceCertInfo page)
    - **/registration:** f_105eb17c (<Registration><RegState><CustomerID>)
    - **/renderingcontrol:** f_100b8f2c
    - **/root_cert_bundles:** f_105eb9a0 -> f_1055e63c (CA bundle hex dump)
    - **/rss:** f_105eadb8
    - **/settings/effective:** f_100b8ef8
    - **/settings/location:** f_100b8f14
    - **/settings/player:** f_100b8edc
    - **/shares:** f_100b8ebc
    - **/spdiftap:** f_100bd810
    - **/ssidlist.txt:** f_105eac30
    - **/ssl_client_cache:** f_105eb9ac
    - **/syssettings:** f_105eada0
    - **/temperature:** f_100b8dcc
    - **/topology:** f_105eaafc
    - **/track_queue_summary:** f_100baa84
    - **/tracks_summary:** f_10108138
    - **/trueplayinfo:** f_100b8ea4
    - **/tvprocessor:** f_100bb318
    - **/update:** f_100b8e84
    - **/upnp:** f_105eb0b4
    - **/wireless:** f_105eab50
    - **/zp:** f_100bfbac (flag 1)
  - **flag_hypothesis:** flag reads as a bitmask: bit1(0x2)=GET-eligible (set on nearly every page), bit2(0x4)=POST-capable (flag 6 on /scanresults,/playmode,/opt/log/mdnsd.log), bit7(0x80)=API/JSON-style dispatch (0x82 on /api,/cloudqueue,/leds), flag=1 on /zp,/VERSION,/ifconfig possibly unauthenticated/plain-text; 0x43/0x46 outliers on /proc/ath_rincon pages (extra caps 0x40+3/6); INFERRED from flag distribution — the matcher fn that tests the bits not yet located
- **page_schemas:**
  - **provenance:** emit-literal harvest per handler + delegation-chain resolution (handlers load module via locator slot 0x5f88/0x7680-family then tail-call the render fn; schemas = the literal args of emit calls)
  - **schemas:**
    - **/zp:** <ZPInfo>{ZoneName,ZoneIcon,Configuration,LocalUID,SerialNumber,SoftwareVersion,BuildType,SWGen,SoftwareDate,SoftwareScm,HHSwgenState,MinCompatibleVersion,...}</ZPInfo> \| additional dp_impl fields: WirelessMode ConnectionType ChannelFreq BehindWifiExtender WifiEnabled EthLink SettingsReplicationState SecureRegState IsIdle MoreInfo RawBattPct BattPct BattChg BattTmp BtSrcName; <ZPNetworkInfo type=User> + START/END UUID markers + unreachable flag
    - **/device:** <DeviceInfo>{ZoneName,NetworkHash,DHCPServerMac,NetworkIPAddress,NetworkMask,DiagLevel,DevMode}</DeviceInfo>
    - **/alarm:** <Alarm>{Mode,Scheduler,UTCTime,LocalTime,Pending{PendingAlarm\[ID,Type,Time,TimeUTC\]}}</Alarm>
    - **/update:** <UpdateInfo>{AutoUpdate,State,Window(%02u:%02u:%02u - %02u:%02u:%02u),UpgradeManager,HoursPending,ActiveDeviceList}</UpdateInfo>
    - **/leds:** <LedPatternInfo>{LedPatternEntry\[time,led_ids(%08x),repeats,steps\]{LedStepEntry\[rgb(%06X),hold,fade\]}}</LedPatternInfo>
    - **/libraries:** <ThirdPartyLibraryInfo>{Library\[Name=Spotify eSDK\]{Version}}</ThirdPartyLibraryInfo>
    - **/trueplayinfo:** <RoomCalibrationInfo>{RoomCalibrationActiveState,UserIntent,AvailCalID,Orientation}</RoomCalibrationInfo>
    - **/shares:** <Shares>{Share{Path},Mount,LastChange}</Shares>
    - **/experiments:** <ZoneExperiments>{ZoneExperiment\[id(%llu),name,value,defaultValue\]}</ZoneExperiments>
    - **/ssl_client_cache:** {Entry{HostName,Port,TimeToExpire,TimeSinceLastRefresh}}
    - **/ssl_client_cache_note:** entries = TLS session-cache rows with expiry/refresh timestamps
    - **/playmode:** <Playmode>{Shuffle,Repeat,Crossfade}</Playmode>
    - **/temperature:** <TemperatureHistograms>{CPUTemperature}</TemperatureHistograms>
    - **/tracks_summary:** <TrackSummary>{Tables{Table\[name,max,count\]},StoreSize,StoreUsed,EntriesSize,EntriesUsed,Conflicts}</TrackSummary>
    - **/enetports:**
      - **schema:** <EnetPorts><Port port=%d><Link>%d</Link><Speed>%d%s</Speed></Port>...</EnetPorts>
      - **fields:** `port`, `Link`, `Speed + unit suffix`
      - **confidence:** PROVEN (dp_impl 0x10ef3494)
    - **/cpumon:** <CpuMonitor>
    - **/hardwareevents:** <HardwareStatusInfo>
    - **/upnp:** <Subscriptions>
    - **/rss:** <ReplicatedSettingsState>
    - **/location_settings_update:** <LocationSettingsUpdate>
    - **/netsettings.txt:** <NetSettings>
    - **/ssidlist.txt:** <SsidList>
    - **/backtrace:** <Backtrace>
    - **/perfcounters:** <PerformanceCounterTables>
    - **/activeZones:** <File name='activeZones'>
    - **/registration:** <Registration>{RegState,CustomerID}</Registration>
    - **/regcert:** <DeviceCertInfo>{...} (see cert_layer)
    - **/button_triggered.xml / /dropout_triggered.xml:** shared generic page f_10195c74: emits <%s>...</%s> and <%s/> elements over a truncatable log ("Error truncating %s: %s")
    - **/musicservices:** diag-submit page (no XML emit; logs "Could not submit Available Services DIAG. Service count is: %zu")
    - **/cloud:**
      - **render:** f_10599c28
      - **schema:** <Cloud><ProtocolVersion>%s</ProtocolVersion><LastRetryAfter>%lld</LastRetryAfter><MillisecondsToNextConnect>%ld</MillisecondsToNextConnect><WebsocketRegistration>%s (%s)</WebsocketRegistration></Cloud>
      - **fields:** `ProtocolVersion`, `LastRetryAfter (optional, %lld)`, `MillisecondsToNextConnect (optional, %ld)`, `WebsocketRegistration: "%s (%s)" e.g. OK (Current)/Pending`
      - **confidence:** PROVEN
    - **/policy:**
      - **render:** f_10372d34
      - **schema:** <Entitlements><Entitlement type="%s" isTrial="%s" sku="%s" startDate="%s" endDate="%s" codes="%s"/></Entitlements>
      - **fields:** `type`, `isTrial`, `sku`, `startDate`, `endDate`, `codes`
      - **confidence:** PROVEN
    - **/audiocore:** <AudioCore> + <SoundDevice><Zones>…</Zones></SoundDevice> + <DSPStateManager><Zones>…</Zones></DSPStateManager> + <PlayStateManager><PlayState>0x%08x</PlayState><PlaybackCount>%d</PlaybackCount><InfoCount>%d</InfoCount></PlayStateManager>
    - **/track_queue_summary:**
      - **render:** f_10265324
      - **schema:** <TrackQueueSummary> member dump </TrackQueueSummary>
      - **confidence:** PROVEN wrapper
    - **/accounts:**
      - **render:** f_101b6edc adjustor thunk this+=280 -> f_10427174
      - **confidence:** PROVEN mechanism; module is SMB/share-account code (literals are share-connect errors), member-dump output
    - **/ethportstatistics:**
      - **schema:** EthPrtStats {rxPackets,txPackets,rxBytes,txBytes,rxErrors,rxDropped,txDropped,multicasts,collisions} + EthIntrf detail {lngthErr,ovrFlwErr,crcErr,frmeErr,fifoErr,missedErr,RxDtlErr,abrtErr,crErr,hrtBeatErr,wndwErr,TxDtlErr} read from /sys/class/net/eth0 (eth%u)
      - **confidence:** PROVEN literals (dp_impl 0x10ef34e0-0x10ef35e8)
    - **/root_cert_bundles:**
      - **schema:** <RootCertBundleInfo><Bundles><CurrentBundle><BundleVersion/><BundleID/><IsFallback/></CurrentBundle><CachedCloudBundle><BundleVersion/><BundleID/><ETag/></CachedCloudBundle><PreviousBundle><BundleVersion/><BundleID/></PreviousBundle></Bundles></RootCertBundleInfo>
      - **confidence:** PROVEN (reportuploader 0x10eeb9b4+)
    - **/renderingcontrol:** <RenderingControl><DuckingFlags>%s</DuckingFlags><SodVolume>%d</SodVolume><ExtVolume>%d</ExtVolume><AudioCoreReady>%s</AudioCoreReady><DeviceTime>%d.%06d</DeviceTime></RenderingControl> — literals found in f_100b8f2c handler body (previously listed unresolved; the stub tail-calls into the shared emit fn but the schema literals sit in the handler itself)
    - **/decoder:** <MusicDecoder><LastActiveDecoder>%s</LastActiveDecoder></MusicDecoder>
    - **/topology:** <ReplicatedNetSettings LastUpdateDevice="%s" Version="%d" FileSchemaVersion="%d"><SonosNet Disable="%d"/><SonosNet Frequency="%d"/><Network SSID="%s" Flags="%d"/><BackupLanSwapPsk id="%s"/></ReplicatedNetSettings> — shared emitter also used by /wireless,/dmesg,/netsettings.*,/ssidlist.txt (same render lib)
    - **/radiolog:** <PerformanceCounterTables> (perfcounter table emitter shared with /perfcounters) + radio log tail
  - **unresolved_pages:** /ai_speech_enhance /analoglinein /hls /htconfig /tvprocessor /spdiftap /wireless - vfunc member-dump stubs (load member of global app object @0x11095f88 + fixed offset, call its vfunc render); /settings/* /syssettings /dnscache /api /dmesg resolved to shared emitters f_101886a4/f_106937dc/f_10769d34/f_1076b10c which delegate further without literal schemas
- **admin_post_endpoints:**
  - **provenance:** master route table {name*,handler*} records @0x11091290-0x11091684 (stride ~28, same table family as 0x11090c00); handlers disassembled
  - **endpoints:**
    - **/setstring:**
      - **handler:** f_100b7cb4
      - **method:** POST
      - **content_type:** application/x-www-form-urlencoded
      - **params:** `key`, `value`, `csrfToken`
      - **response:** <h2>System Settings</h2>Setting changed \| HTTP Error %d
      - **headers:** `Cache-Control: no-cache, no-store, must-revalidate`
      - **note:** raw SystemProperties write — arbitrary settings key/value with CSRF gate
    - **/removestring:**
      - **handler:** f_100b79e0
      - **method:** POST
      - **params:** `key`, `csrfToken`
      - **response:** <h2>Remove System Setting</h2>Setting removed
      - **note:** raw SystemProperties delete
    - **/mdnsannounce:**
      - **handler:** f_100c1230
      - **method:** POST
      - **params:** `csrfToken`
      - **response:** Success \| Failed to trigger ResendResponses: %i
      - **note:** triggers mDNS ResendResponses on mod_zp (re-announce/Goodbye)
    - **/sonarctl:**
      - **handler:** f_100bc354
      - **method:** POST
      - **params:** `flush`
      - **response:** Flushed
      - **note:** flushes pending sonar tones via sonar-tone (mod_zp)
  - **ranges_literal:** /ranges; boundary=##123456789###BOUNDARY @0x10e72241 — multipart range-request response boundary template (HTTP 206 partial content)
- **resolved_extra_handlers:**
  - **/content/api:** f_102fd76c — translateId bridge: fields {objectId,serviceId->targetSid,targetObjectId}; outbound catalog/id/%s?destinationServiceId=%s; translation cache (cache.h) "saved/retrieved translation from cache"; errors objectId/serviceId/targetObjectId missing, "cannot perform translateId request"
  - **/bridge/content/api:** f_1048f3a4 — getContent proxy w/ "service base path: %s", per-call timing "getContent took %ld ms: %s", "getContent parse failed"
  - **/entitlements/api:** f_1037120c — entmt obj; "using cloud URL: %s"; cache-control/etag headers; onCacheUpdate; "cloud entitlements: rc %d, http %d"
  - **/ZPs:** f_104d1b74 — upgrade_mgr JSON report emit {SystemResult,Result,DownloadDuration,ExtendedError}; "report array size mismatch (%d/%zu)"
  - **/authz:** f_1060363c — resolveToken proxy to muse: logs token masked ******%s; fields {apiKey,credential,responseResolveToken}; cache-control passthrough; "Failed to resolve token http=%d"/"Failed to parse token response"
  - **/auth/oauth/v2/validate:** f_1063fe2c — outbound fmt /auth/oauth/v2/validate?access_token=%s
  - **/v2/diags:** f_106b6da0 — diagnostic submit: form-data {originator,serial_num}; submit logs "%s for %s submitted (ID: %s, GUID: %s)" w/ guid-confirm mismatch check; "Local diagnostic" type; Diagnostic stub
  - **/settings/api/v1/locations/:** f_105dd808 — locSetUpdMgr: processUpdateAllSettings GET /settings/api/v1/locations/%s/effectiveSettings conditional \[etag\|version\] + Last-Modified; X-Sonos-Corr-Id; keys {source,initial}
  - **/drc:** f_10d5ee28 — dolby DRC config setter (see dsp_drc vocabulary)
  - **/staticparams:** f_10d5f1e4 shared with /dynamicparams — DSP param registry {virt_mode,dap,frontangle,heightangle,surrangle,rearsurrangle,oarBassExtraction,dapCutOff,upmix,hfilt,post,mode,vlamp,vmcal}
  - **/dynamicparams:** same fn as /staticparams
  - **/upload:** f_102537b0 shared crashdump uploader for /anacapad-external /sonospowercoordinator-external /watchdog(-legacy) /sonosledmgrd-external (/jffs/app/debug/sonosledmgrd.dmp) /netstartd-external /btmanager-external legacy-to-sentry; type=crashdump; "No URL found to upload dump file: %s"
  - **/watchdog:** f_100aaa04 shared with /devmode — internal HTTP subserver: routes /log /devmode /threadinfo /watchdogs /reboot /sonos_log? /unlock; "set log level: %s=%d"; serves anacapa.log; %d.%d.%d.%d host parse; HTML error pages
  - **/devmode:** f_105e8d90 -> trampoline 0x10789cbc (mp4 header parser region — dev-mode media tools)
  - **/testenv:** f_105eb9dc — locator module render via obj->vt\[+0x9c\], page field \[r3+356\]
  - **/sethostip:** f_100b9fac — permission gate 0x10550b24 else HTTP 403; delegates to setter 0x10551bfc
  - **/sonarctl:** f_100bc354 — "flush" op on mod_zp: "flushing sonar tones"/"Flushed"
  - **/spotdbg:** f_100b8140 — "spot: permission denied" gate; no-store response
  - **/snapshotspdiftap:** f_100bd5e4 — "Internal SPDIF Tap Snapshotted. Tap must be uncompressed before use!"/"Feature not supported."
  - **/traceroute:** f_100d3ff4 — exec /usr/bin/traceroute
  - **/ping:** f_100d3f88 — exec (see /traceroute sibling; earlier finding /bin/ping -c 3)
  - **/ttm_helper:** f_100b9740 — text/plain responder
  - **/networkmatrix:** f_105ea2f0 — builds matrix record buffer (49-elem), responds 200
  - **/support/asyncsubmit:** f_105ea400 — form {diagId,guid,flags,excludeFlags,type,coordinator,delay}; schedules diag submission; "already pending" conflict; "Unable to find player from UUID"
  - **/support/reportstatus:** f_105ea734 — form {guid,uuid,success,controller}; updates submission status
  - **/support/directsubmit:** f_105e9b30 — HTML "Diagnostic Submission to Sonos, Inc." w/ csrfToken form
  - **/support/aggregate:** f_105e9fb0 — collects watchdog.dmesg, watchdog.log, button_triggered.xml, dropout_triggered.xml; "cleanup logs after diagnostic"; requires diag type
  - **/support/review:** f_105e9e60 — XML review doc w/ /xml/review.xsl stylesheet
  - **/radiolog:** status-registry page {flag=2, handler=f_100b8ff8} radiolog.cxx
  - **/du-jffs:** status-registry exec page {flag=2, cmd="/usr/bin/du -a -d 5 -k -x /jffs"}
  - **/dsp/eqdata.txt:** serves app/debug/dsp/eqdata.txt + persistentEQ.xml (literal-adjacent, reference mechanism not table)
  - **/sonar-tone:** not in master table; .rodata-referenced near app/run/inverters + ZP_MODE_STANDALONE + variantDebuginfo — sonar variant-tone config path
  - **/debugfiles:** exec page flag=0xa: /bin/ls --full-time /jffs/app/debug /jffs/sys/debug /jffs/net/debug
  - **/customsd:** f_103429f4 — CSRF form "Add/update custom service descriptor": fields {sid(240-253\|255), name(blank erases), secureUri, pollInterval, authType in {UserId,Anonymous,DeviceLink,AppLink}, stringsVersion+stringsUri, presentationMapVersion+presentationMapUri, manifestVersion+manifestUri, containerType in {MService,SoundLab}, caps\[\] in {search,trFavorites,alFavorites,ucPlaylists,logging,playbackLogging,accountLogging,extendedMD,radioExtendedMD,playlistExtendedMD,disableAlarms,noMultiAccount,mediaUriActions,contextHeaders,deviceCerts,playerIds,contextReporting,userInfo,contentFiltering,manifest,authorizationHeader}} — full SMAPI SD capability set

## `device_account_endpoint`

The /device_account endpoint handling the player's account binding — links the hardware to a Sonos account.

**Technical description:**

- **handler:** f_1065bd70
- **flow:** path claim '/device_account' (f_10655ea4) -> f_106570bc validate -> f_1065b730('int_setTransferMode') transfer-mode int; serialize device-account via f_1065a8dc(strlen+encode)/f_109cd7a4/f_1065e99c; state word *(r30+8) in {3,4} selects account variant; constant block 0x110b9044 (6 bytes) feeds the blob; f_10807034 XML append; stack-canary guarded
- **semantics:** device-account provisioning/read endpoint; response is an encoded account blob whose variant depends on registration state (3 vs 4)
- **status:** strong

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
- **oauth:**
  - **status:** confirmed
  - **evidence:**
    - type: firmware, address: 0x1009a0d4, notes: grant/scope table (init table 0x11085328)
  - **grant_types:** `urn:ietf:params:oauth:grant-type:jwt-bearer`
  - **subject_urns:** `urn:sonos:hhid:`, `urn:sonos:unit-hhid:`
  - **scopes:** `playback-control-all`
  - **policy_keys:** `guestPermissionsPolicyKey`
  - **jwt_algs:** `RS256`, `HS256`
  - **thor:**
    - **name:** thor
    - **strings:** `UserAuthorization`, `ThorOperations`, `PolicyKeyTableMutex`
    - **note:** muse authorization is evaluated by the Thor policy subsystem — op calls carry credType through the <Command> envelope and Thor checks the caller against UserAuthorization policy keys

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
- **range:** "Session status 0x%x connected %d wantWrite %d wantRead %d" + "Current state: %d Current Status 0x%08x" + HTTP/1.1 206 partial-content support

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

- **status:** strong
- **description:** \["/xml/device_description.xml", "/xml/group_description.xml", "/xml/satellite_device.xml", "/xml/device_description_no_ai.xml"\]

## `gena_internals`

GENA internals — SID preinstall (?sid=0), SubscribedEvents/LogicalSID/NotifyErrors bookkeeping, and the LastChange event assembly.

**Technical description:**

- **status:** strong
- **name:** GENA internals + per-service LastChange schemas
- **description:** Subscription machinery vocabulary: SID preinstall ('Attempting to preinstall SID=%u', '?sid=0' URL form), status fields SubscribedEvents/LogicalSID/UPnPSID/NotifyErrors, sender/source pair upnpeventing_sender+upnpeventing_source, AVTStateLastChangedEvent event name, and the <LastChange>%s</LastChange> wrapper emitted per service. Per-service LastChange payload schemas not enumerated.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e9b408, notes: Attempting to preinstall SID
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f0c580, notes: <LogicalSID>
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f00cb8, notes: <NotifyErrors>
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e89d80, notes: <LastChange>
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ed1c6c, notes: <Event xmlns="urn:schemas-sonos-com:metadata-1-0/Queue/"> — proprietary Queue LastChange
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ed1cd0, notes: <QueueID val="%.20s"> + QueueOwnerID/UpdateID/Curated elements
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eb29e8, notes: AVT LastChange envelope with r: namespace + full element sequence
- **lastchange_schemas:**
  - **RCS:** <Event xmlns="urn:schemas-upnp-org:metadata-1-0/RCS/"><InstanceID val="0">... — standard UPnP RCS event envelope
  - **AVT:** <Event xmlns="urn:schemas-upnp-org:metadata-1-0/AVT/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/"> then elements in order: TransportState, CurrentPlayMode, CurrentCrossfadeMode, NumberOfTracks, CurrentTrack, CurrentSection (non-standard), CurrentTrackURI, CurrentTrackDuration, CurrentTrackMetaData, r:EnqueuedTransportURI, r:EnqueuedTransportURIMetaData, PlaybackStorageMedium, AVTransportURI, AVTransportURIMetaData, NextAVTransportURI, NextAVTransportURIMetaData — all as <X val="..."> attribute-value form
  - **Queue:** proprietary Sonos namespace urn:schemas-sonos-com:metadata-1-0/Queue/ — NOT a UPnP standard schema. Elements: <QueueID val="%.20s"> (20-char truncated), <QueueOwnerID val="%s"/>, <UpdateID val="%u"/>, <Curated val="..."> — the Curated flag matches the SavedQueue store schema
- **notes:** AVT envelopes carry the r: extension namespace for Sonos fields; Queue events live in a Sonos-private namespace (schemas-sonos-com, not rinconnetworks) — clients parsing LastChange must handle all three namespaces; val="" attribute form used throughout

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

- **provenance:** 28 NUL-bounded standalone R_* literals; 27 have live code consumers found by addis/addi computed-address scan (R_AvailableSvcTypes only via .data ptr table). f_104b1e48 is the onSettingChanged dispatcher: strcmp(key) chain -> per-key side-effect (e.g. R_TrialZPSerial->f_10121518, R_RadioLocation->f_1037e40c). R_PLAY_OP_ERROR excluded: enum-name log literal, not a settings key
- **kind:** settings key vocabulary
- **keys:**
  - **R_AccountTransferMode:** f_1066a788,f_1066bff8
  - **R_AirplayIncludeLinked:** f_103f9010,f_104b1e48,f_1066a788
  - **R_AudioInEncodeType:** f_102934f4,f_10669aac
  - **R_AutoUpdatePolicy:** f_102a9764
  - **R_AutoUpdateWindowStart:** (no xref found)
  - **R_AvailableSoftwareUpdate:** f_1066a788,f_1073f8f8,f_10752420
  - **R_AvailableSvcTrials:** f_100c72e8
  - **R_AvailableSvcTypes:** (.data ptr @0x11092768 only)
  - **R_BrowseByFolderSort:** f_10110ee0
  - **R_CheckUpdateInterval:** f_102a9764
  - **R_ContentFiltering:** f_1066a788
  - **R_CrossfadeDuration:** f_103f9010,f_104b1e48
  - **R_CustomerID:** f_100c8fdc,f_101b7b1c,f_104b16b4
  - **R_ForceReIndex:** f_104b1d90
  - **R_HideTuneIn:** f_101b6dbc,f_1028e5dc
  - **R_HouseholdLocationID:** f_105965dc,f_1073fd40,f_10749b34
  - **R_MigratedTuneIn:** f_104b1bdc
  - **R_MuseDuckingPolicy:** f_101970e0,f_101971c8
  - **R_PromoVersion:** f_104b0c90
  - **R_RadioLocation:** f_10485d38,f_104b1e48
  - **R_ServiceBitrate:** f_10212b5c,f_10212d1c
  - **R_ShowNSSServers:** f_10121518
  - **R_ShowRhapUPnP:** f_10121518
  - **R_SvcAccounts:** f_102897d8
  - **R_ThirdPartyCredentials:** f_1066a788,f_1066bff8
  - **R_TrialZPSerial:** f_100c6248,f_100c7c6c,f_100c8230,f_101b7b1c,f_104b1e48
  - **R_UseSonosContentDirNS:** f_1068c5dc
  - **R_VolNormMode:** f_103f9010,f_104b1e48
- **side_effect_dispatcher:** f_104b1e48 (strcmp chain on changed key name)
- **note:** key namespace names live in literal form; values are get/set through SystemProperties; this list is the build's complete visible R_* key vocabulary — other SystemProperties keys may exist under different prefixes

## `internal_result_namespace`

The complete R_* status-code enum — 403 internal result codes grouped by family (account, cloud queue, playback ops, LED, masks...). These are what UPnP faults map FROM; the enum values themselves aren't recoverable as integers.

**Technical description:**

- **status:** strong
- **name:** internal ERROR_*/R_* name vocabularies
- **description:** The binary's internal result/error identifiers in their LITERAL forms — corrected after auditing: the earlier '403 R_* codes' listing was polluted by substring matches (BONDED_STEREOPAIR_AND_SUB→'R_AND_SUB', DEFER_PLAYING→'R_PLAYING'). Word-boundary re-extraction gives 172 ERROR_* literals (the fault namespace that maps to UPnP/muse errors) plus ~47 real R_* enum identifiers (LED modes, play/stream ops, keycert ids, spotify events). Integer enum values remain unproven.
- **count:** 221
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10fbb0a5, notes: R_LED_BEGIN_SETUP_MODE
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eee670, notes: R_CLOUD_QUEUE_STREAM_LIMIT
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10fbedfa, notes: R_MASK_NINE_DOT_ONE_DOT_FOUR
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eee508, notes: R_LASTFM_STREAM_LIMIT
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eee6d8, notes: ERROR_* literal cluster (error-name table); word-boundary extraction
- **error_families:**
  - **INVALID:** `ERROR_INVALID_ACTION`, `ERROR_INVALID_AUTH_HEADER`, `ERROR_INVALID_CERT`, `ERROR_INVALID_HEADER`, `ERROR_INVALID_LENGTH`, `ERROR_INVALID_OBJECT_ID`, `ERROR_INVALID_PARAMETER`, `ERROR_INVALID_RESOURCE`, `ERROR_INVALID_SESSION_ID`, `ERROR_INVALID_SYNTAX`, `ERROR_INVALID_TRANSPORT`, `ERROR_INVALID_UPM_FORMAT`
  - **UNSUPPORTED:** `ERROR_UNSUPPORTED_COMMAND`, `ERROR_UNSUPPORTED_DRM`, `ERROR_UNSUPPORTED_FORMAT`, `ERROR_UNSUPPORTED_FREQ`, `ERROR_UNSUPPORTED_NAMESPACE`, `ERROR_UNSUPPORTED_POSITIONING_REQUEST`, `ERROR_UNSUPPORTED_REQUEST`, `ERROR_UNSUPPORTED_REQUEST_METHOD`, `ERROR_UNSUPPORTED_VOLUME_MODE`
  - **PER_SERVICE** (41):
  
    ```
    ERROR_AUDIBLE_BAD_CODEC, ERROR_AUDIBLE_DRM, ERROR_AUDIBLE_ZP_MISSING, ERROR_LASTFM_BAD_ACCOUNT, ERROR_LASTFM_BAD_SUBLEVEL, ERROR_LASTFM_NO_ACCOUNT, ERROR_LASTFM_NO_CONTENT, ERROR_LASTFM_STREAM_LIMIT, ERROR_MOBILE_CANT_REACH_SERVER, ERROR_PAND_BAD_ACCOUNT, ERROR_PAND_BAD_SUBLEVEL, ERROR_PAND_NO_ACCOUNT, ERROR_PAND_READ_ONLY, ERROR_PAND_STATION_GONE, ERROR_PAND_SUSPENDED, ERROR_PAND_TRIAL_EXPIRED, ERROR_RHAP_BAD_ACCOUNT, ERROR_RHAP_NO_ACCOUNT, ERROR_RHAP_STREAM_LIMIT, ERROR_RHAP_TRIAL_EXPIRED, ERROR_RHAP_UNAVAILABLE, ERROR_RHAP_UNSUPP_ACCOUNT, ERROR_SIRIUS_AUTH_GEN_FAIL, ERROR_SIRIUS_AUTH_INACTIVE, ERROR_SIRIUS_BAD_ACCOUNT, ERROR_SIRIUS_BAD_SUBLEVEL, ERROR_SIRIUS_INACTIVE, ERROR_SIRIUS_NO_ACCOUNT, ERROR_SIRIUS_STREAM_LIMIT, ERROR_SIRIUS_STREAM_LIMIT_EXT, ERROR_SIRIUS_TRIAL_EXPIRED, ERROR_SONOS_BAD_ACCOUNT, ERROR_SONOS_BAD_LOCATION, ERROR_SONOS_INACTIVE, ERROR_SONOS_NO_ACCOUNT, ERROR_SONOS_STREAM_LIMIT, ERROR_SONOS_TOKEN_EXPIRED, ERROR_SONOS_TRIAL_EXPIRED, ERROR_SONOS_UNSUPP_ACCOUNT, ERROR_WMP_ACCESS_DENIED, ERROR_WMP_NO_LICENSE
    ```
  - **CLOUD_QUEUE:** `ERROR_CLOUD_QUEUE_ACCESS_DENIED`, `ERROR_CLOUD_QUEUE_CANT_REACH_SERVER`, `ERROR_CLOUD_QUEUE_SERVER`, `ERROR_CLOUD_QUEUE_SERVICE_ERROR`, `ERROR_CLOUD_QUEUE_SERVICE_UNRESPONSIVE`, `ERROR_CLOUD_QUEUE_STREAM_LIMIT`
  - **PLAYBACK:** `ERROR_PLAYBACK_EXPIRED_TOKEN`, `ERROR_PLAYBACK_EXPLICIT_NOT_ALLOWED`, `ERROR_PLAYBACK_FAILED`, `ERROR_PLAYBACK_NO_CONTENT`, `ERROR_PLAYBACK_NO_PLAYABLE_CONTENT`, `ERROR_PLAYBACK_STREAM_LIMIT`
  - **ACCOUNT:** `ERROR_ACCOUNT_FULL`, `ERROR_ACCOUNT_INVALID_ID`, `ERROR_ACCOUNT_NO_DEFAULT_FOUND`, `ERROR_ACCOUNT_REAUTH_REQUIRED`, `ERROR_ACCOUNT_UPGRADE_REQUIRED`, `ERROR_ACCOUNT_WRONG_SERVICE`
  - **GENERIC** (91):
  
    ```
    ERROR_ACCESS_DENIED, ERROR_ACCESS_DENIED_EXPLICIT, ERROR_ALARM_BAD_TIME_SERVER, ERROR_ALARM_CONFLICT, ERROR_ALARM_NO_SPACE, ERROR_API_KEY_VALIDATION_FAILED, ERROR_AREAS_READ_ONLY, ERROR_AUDIO_CLIP_ID_NOT_FOUND, ERROR_AUDIO_CLIP_MEDIA_ERROR, ERROR_AUDIO_CLIP_PAUSE_CONTENT_FAILED, ERROR_AUDIO_CLIP_VOICE_ASSISTANT_PLAYING, ERROR_BAD_INET_RADIO, ERROR_BUFFERING, ERROR_CACHE_NOT_FOUND, ERROR_CACHE_RECORD_NOT_FOUND, ERROR_CANT_CONNECT, ERROR_CANT_CONNECT_REMOTE, ERROR_CANT_REACH_SERVER, ERROR_CANT_RESOLVE_NAME, ERROR_CERT_DENYLISTED, ERROR_CERT_NEEDED, ERROR_CMD_FUTURE, ERROR_CMD_REMOVED, ERROR_COMMAND_FAILED, ERROR_COMMAND_TIMEOUT, ERROR_CONTENT_TYPE_NOT_SUPPORTED, ERROR_CORRUPT_FILE, ERROR_DEVICE_ALREADY_REGISTERED, ERROR_DEVICE_UNAVAILABLE, ERROR_DISALLOWED_BY_POLICY, ERROR_DOCK_INTERRUPT, ERROR_DOWNSTREAM_CONNECT_FAILED, ERROR_EXPECTATION_FAILED, ERROR_FAILURE_TO_ENQUEUE, ERROR_GROUP_CHANGED, ERROR_INCOMPATIBLE_API_VERSION, ERROR_INCOMPATIBLE_CLIENT_VERSION, ERROR_INCORRECT_STATE, ERROR_INSUFFICIENT_POWER_FOR_UPDATE, ERROR_INSUFFICIENT_RESOURCES, ERROR_INTERNAL, ERROR_LOAD_COMMAND_FAILED, ERROR_LOST_CONNECTION, ERROR_LSE, ERROR_MICROPHONE_NOT_ENABLED, ERROR_MISSING_PARAMETERS, ERROR_NOT_AUTHORIZED, ERROR_NOT_CALLED, ERROR_NOT_CAPABLE, ERROR_NOT_DESIGNATED_DEVICE, ERROR_NOT_PLAYABLE, ERROR_NO_CONTENT, ERROR_NO_PERMISSION, ERROR_NO_PLAYABLE_CONTENT, ERROR_NO_POSITIONING_RESULTS, ERROR_NO_RESOURCE, ERROR_NO_UPDATE_AVAILABLE, ERROR_NYI, ERROR_OCCURRED, ERROR_PLAYERS_HAVE_INCOMPATIBLE_FIRMWARE, ERROR_PRECONDITION_FAILED, ERROR_PREFERRED_ACCOUNT_NOT_FOUND, ERROR_PREFERRED_ACCOUNT_NOT_SET, ERROR_QUEUE_FULL, ERROR_REQUIRES_GROUP_COORDINATOR, ERROR_RESOURCE_CONFLICT, ERROR_RESOURCE_GONE, ERROR_RESOURCE_NO_LONGER_AVAILABLE, ERROR_RETRY, ERROR_ROOM_DETECTION_SIGNALLING_BUSY, ERROR_ROOM_DETECTION_SIGNALLING_FAILED, ERROR_SERVICE_NOT_AVAILABLE, ERROR_SERVICE_NOT_CONFIGURED, ERROR_SERVICE_NOT_SUPPORTED, ERROR_SERVICE_UNAVAILABLE, ERROR_SESSION_EVICTED, ERROR_SESSION_IN_PROGRESS, ERROR_SESSION_JOIN_FAILED, ERROR_SHARES_CONFLICT, ERROR_SHARES_NO_SPACE, ERROR_SHARES_NO_SUCH_SHARE, ERROR_SHARES_REQUEST_FAILED, ERROR_SKIP_LIMIT_REACHED, ERROR_SPOTIFY_CONNECT, ERROR_STIMULUS_ALREADY_PLAYING, ERROR_SVC_DISABLED, ERROR_TARGET_ID_NOT_FOUND, ERROR_TIMER_NOT_FOUND, ERROR_TOO_MANY_MOUNTED, ERROR_TOO_MANY_USERS, ERROR_UPDATE_IN_PROGRESS
    ```
- **r_enums:**
  - **R_LED_* (LED mode enum, 23)** (23):
  
    ```
    R_LED_AUDIO_OFF, R_LED_BEGIN_SETUP_MODE, R_LED_BREAK_POP, R_LED_BROKEN_DEVICE, R_LED_CONTROL_FEEDBACK, R_LED_DEMO_CONFIGURE_IR, R_LED_DEMO_MODE, R_LED_FAULT, R_LED_HHID, R_LED_IDENTIFY_PLAYER, R_LED_IN_SETUP_MODE, R_LED_JOIN_HH, R_LED_JOIN_HH_OPEN, R_LED_MUTED, R_LED_PLAYING, R_LED_SHUTDOWN, R_LED_TRANSFER_REGISTRATION, R_LED_UPGRADE, R_LED_WAC, R_LED_WAC_TIMEOUT, R_LED_WAITING_TO_PAUSE, R_LED_WAITING_TO_PLAY, R_LED_WARN
    ```
  - **R_STREAM_OP_* (stream ops, 11):** `R_STREAM_OP_ACK`, `R_STREAM_OP_BOUNDARY`, `R_STREAM_OP_CLOSE`, `R_STREAM_OP_ERROR`, `R_STREAM_OP_IMMED_RESYNC`, `R_STREAM_OP_INTERRUPT`, `R_STREAM_OP_OPEN`, `R_STREAM_OP_ORIGIN_TIME_SELECTED`, `R_STREAM_OP_QUALITY_SELECTED`, `R_STREAM_OP_SAMPLE`, `R_STREAM_OP_SCHED_RESYNC`
  - **R_PLAY_OP_* (play ops, 7):** `R_PLAY_OP_BOUNDARY`, `R_PLAY_OP_CHANGE_SRC`, `R_PLAY_OP_CODEC_SELECTED`, `R_PLAY_OP_ERROR`, `R_PLAY_OP_ORIGIN_TIME_SELECTED`, `R_PLAY_OP_RESYNC`, `R_PLAY_OP_SAMPLE`
  - **R_CLIENT_KEYCERT_ID_* (cert ids, 4):** `R_CLIENT_KEYCERT_ID_SONOS`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE_ACCEPT_LEGACY`, `R_CLIENT_KEYCERT_ID_SONOS_REGISTERED_DEVICE`
  - **R_SPOT_EVT_* (spotify events):** `R_SPOT_EVT_AUDIO_TIMEOUT`, `R_SPOT_EVT_METADATA_CHANGE`
- **noise_note:** single-letter R_A..R_V tokens are column-name/initial noise; R_ALLOW_SSH_PUBKEY_INSTALL is a settings key, not a result code; names extracted from inside longer strings ('R_SPOT_EVT_AUDIO_TIMEOUT event handler.') are real identifiers but the bare-literal table is the ERROR_* set

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

## `albumart_proxy`

The player's album-art endpoint. Controllers are handed URIs like http://<player>:1400/getaa?u=<source-url>&v=<version> and the player fetches the image upstream and streams it back with a ~6-month Cache-Control header. Two things to know: 'u' must be the LAST parameter - the parser stops when it sees u=, so size flags (m=1 medium, s=1 small, vli=1 virtual-line-in art) only take effect if they come before it; and v= is never read by the server at all - it exists purely so you get a fresh URL when art changes. Requests are queued and served asynchronously; if you close the connection early the player detects it and discards the request. Upstream fetch failures come back as 404.

**Technical description:**

- **name:** /getaa album-art proxy
- **role:** local HTTP album-art endpoint: serves cached/proxied art to controllers; URI forms /getaa?u=<url>&v=<ver>, /getaa?m=1&u=<url> and /getaa?s=1&u=<url> (m=/s= size variants), plus upstream '?albumArt=true' fetches; art cached as <dir>/AlbumArt_{GUID}_Large.jpg
- **params:** u= source URL (validated: 'AlbumArtURI longer than expected.'), v= version/etag-style param, m=1 / s=1 select medium/small variants; '%s?albumArt=true' marks upstream art requests
- **flags:** enableSecureAlbumArt feature flag gates a secured art fetch path; AlbumArtistDisplayOption + GetAlbumArtistDisplayOption control whether album-artist metadata is displayed (microsoft:artistAlbumArtist DIDL extension supported in sort/filter caps)
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e76390, notes: /getaa route literal
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e8937c, notes: /getaa?u=%s&v=%u form
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f0df90, notes: /getaa?m=1&u=%s variant
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f0f3c4, notes: /getaa?s=1&u=%s variant
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ecd458, notes: AlbumArt_{GUID}_Large.jpg cache filename
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f9c1f0, notes: enableSecureAlbumArt flag
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x100b8c2c, notes: /getaa route handler — queue + singleton create
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x100c34fc, notes: request processor: m/s/vli/u param parse + u-terminator
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x100c3714, notes: Cache-Control: private, max-age=15780000 response header
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10299e5c, notes: worker thread: 32-slot ring + TCP_INFO abort check
- **status:** confirmed
- **request_grammar:** GET /getaa?{m\|s\|vli}...&u=<url>\[&v=<n>\] — query parsed by f_10c3b72c: param names <=32 chars, values <=1024 chars, '&'-separated. Recognized params (compared in order m,s,vli,u via strcmp at 0x100c35cc-0x100c3618): 'm' medium-variant flag, 's' small-variant flag, 'vli' virtual-line-in image flag, 'u' upstream image URL. IMPORTANT: 'u' is the TERMINATOR — when encountered, parsing stops and the request proceeds; any params AFTER u= are never read. 'v' is NOT parsed by the handler at all — it appears in emitted URIs (/getaa?u=%s&v=%u) purely as a client-side cache-buster/etag. Unknown params are skipped silently
- **response:** image bytes streamed back via vliStreamImage (f_101867c8), logged as 'invoking vliStreamImage on %s %u %u %u %s' and 'Fetching album art for %s: %s'. Response header: Cache-Control: private, max-age=15780000 (~6 months). Failure path: 'vliStreamImage failed on %s %u %u %u %s' then status 0x194 sent via f_100b4614 — upstream fetch failures surface as 404
- **async_model:** handler f_100b8c2c is async: logs 'queueing album art request %s %u %u %u', lazily creates the mod_zp_aa server singleton (new 0x428a0, ctor f_10299a48) at 0x11096c98, enqueues the request into a 32-slot ring of 0x2134-byte entries (f_10299c34) and returns. Worker thread f_10299e5c blocks on a condvar, pops slots, probes the client socket with getsockopt(TCP_INFO) and takes an abort path (f_100c34fc slot-discard) when the peer is already in CLOSE/CLOSE_WAIT/CLOSING — clients that give up early are never served
- **param_semantics:** m/s/vli select the image path BEFORE the request object is built: no flags -> default fetch (u URL streamed direct); m -> f_100c2f94 variant; s -> f_100c31c8 variant; vli -> direct vli-image fetch f_100be6ec. The three u16 fields carried on the request (+0x180/+0x182/+0x184) ride through to the vliStreamImage call - request dimensions/ids, not user params
- **arturi_cap:** albumArtURI emission capped at 1024 bytes (buffer obj+0x54, len at +0x458, f_10381528); overflow logs 'AlbumArtURI longer than expected.' in the favorites log domain

## `muse_route_verbs`

The complete operation list of the muse (app/cloud) API: every resource and what you can call on it — playback controls, cloud-queue sessions, volume, groups, settings (in privilege tiers), home-theater accessories, Trueplay measurement sessions, alarms, timers, voice onboarding, remote control and diagnostics. It also exposes verbs for hardware this unit lacks (battery cells, water detection, PoE, ship mode), because the API surface is shared across the whole product line.

**Technical description:**

- **name:** muse route registration verbs — complete table
- **role:** every muse route registers as a (param,resource,verb) triple; this is the decoded verb inventory per resource — the muse API's real operation surface, 70+ resources
- **verbs:**
  - **settings:** `getAllSettings`, `getPlayerSettings`, `getProtectedAdminSettings`, `getProtectedSettings`, `getPublicSettings`, `getRestrictedAdminSettings`, `getSettings`, `setAllowMicrophone`, `setEnablePositioningMeasurement`, `setPlayerSettings`, `setProtectedAdminSettings`, `setRestrictedAdminSettings`, `setSelfTruePlay`, `setSonosNetChannel`, `setUserMetricsTracking`, `updateAllSettings`
  - **alarms:** `createAlarm`, `getAlarms`, `snoozeAlarm`
  - **areas:** `createArea`, `getAreas`
  - **authorization:** `authenticateClient`, `authorizeDevice`, `createInvite`, `deleteInvite`, `getUsers`, `redeemInvite`, `resolveToken`
  - **devices:** `getDeviceRegistrations`, `getDevices`, `getLocalDevices`, `getRegistrationStatus`, `getUserDeviceRegistrations`, `initDeviceRegistration`, `setRegistrationState`, `transferDeviceRegistration`
  - **diagnostics:** `getMetadata`, `reportStatus`, `submitDiagnostics`
  - **effectiveSettings:** `getAllSettings`, `updateAllSettings`
  - **entitlements:** `getEntitlements`, `getUserEntitlements`
  - **favorites:** `getFavorites`, `loadFavorite`
  - **groups:** `createGroup`, `getGroups`, `getGroupsEx`, `modifyGroupMembers`, `setGroupMembers`
  - **groupVolume:** `getVolume`, `setMute`, `setRelativeVolume`, `setVolume`
  - **hardwareStatus:** `changeBatteryStatus`, `getBatteryCells`, `getBatteryStatus`, `getBluetoothStatus`, `getEthernetStatus`, `getLineInStatus`, `getLineInStatuses`, `getMicrophoneSwitchState`, `getPoeStatus`, `getWaterStatus`, `getWiredSubStatus`, `getWirelessNetworkStatus`, `initiateOrderlyShutdown`, `setBluetoothPairing`, `transitionToShipMode`
  - **hdmi:** `edid`, `powercycle`, `status`
  - **history:** `clearHistory`, `getHistory`, `postHistory`
  - **homeTheater:** `addAccessoryWifi`, `disconnectAccessory`, `getAccessoryList`, `getAccessorySwapStatus`, `getConnectedAccessoryList`, `getOptions`, `getSwapModelInfo`, `getTVAudioSignalStatus`, `loadHomeTheaterPlayback`, `removeAccessory`, `setOptions`, `setTvPowerState`
  - **households:** `getHouseholdLocation`, `getHouseholds`, `setLocation`, `setName`
  - **householdUpdate:** `beginHouseholdSoftwareUpdate`, `getHouseholdUpdateStatus`
  - **ircontrol:** `getIRControl`, `setIRControl`
  - **localContentLibrary:** `addShare`, `getIndexerStatus`, `getShares`, `reindex`
  - **management:** `factoryReset`, `reboot`
  - **musicServiceAccounts:** `endDirectControl`, `getPreferredMusicServiceAccount`, `match`, `setPreferredMusicServiceAccount`, `startDirectControlEx`
  - **networkTest:** `startNetworkTests`, `temporarilyDisableNetwork`
  - **pinewood:** `back`, `dpad`, `home`, `loadResource`, `power`, `settings`, `toggleMute`, `togglePlay`, `volumeDown`, `volumeUp`
  - **platformInternal:** `invalidateCache`, `reboot`, `sync`
  - **playback:** `getPlaybackStatus`, `loadContainer`, `loadContent`, `loadLineIn`, `loadStream`, `loadTrackList`, `pause`, `play`, `seek`, `seekRelative`, `setPlayModes`, `skipBack`, `skipToNextTrack`, `skipToPreviousTrack`, `skipToTrack`, `togglePlayPause`
  - **playbackMetadata:** `getMetadataStatus`, `rate`
  - **playbackSession:** `createSession`, `joinOrCreateSession`, `joinSession`, `leaveSession`, `loadCloudQueue`, `loadCloudQueueWithWindow`, `loadStreamUrl`, `loadStreamUrlWithContext`, `refreshCloudQueue`, `rejoinSession`, `seek`, `seekRelative`, `skipToItem`, `skipToItemWithWindow`, `suspend`
  - **playerVolume:** `duck`, `getVolume`, `setMute`, `setRelativeVolume`, `setVolume`, `unduck`
  - **playlists:** `getPlaylists`, `loadPlaylist`, `postPlaylist`
  - **positioning:** `applyAction`, `cancelSession`, `getDeviceMeasurements`, `getMeasurementCapabilities`, `getSessionMap`, `getStimulusTuning`, `notifyDeviceStatus`, `notifySessionError`, `notifySessionStatus`, `playStimulus`, `sendMeasurements`, `setStimulusTuning`, `setTelemetryLevel`, `startSession`
  - **sleepTimer:** `configureSleepTimer`, `getSleepTimer`
  - **soundSwap:** `requestSwap`, `triggerSwap`
  - **svc:** `getWeatherConfig`, `setWeatherConfig`, `voiceCommand`
  - **systemReporting:** `reportAccountSubscription`, `reportFirmwareDownload`, `reportProductEvent`, `reportSoftwareDownload`
  - **systemTime:** `getTimeZoneInfo`, `setTimeZoneInfo`
  - **timers:** `createTimer`, `getTimers`
  - **trueplay:** `detectSpeakerPresence`, `detectSpeakers`, `getTrueplayStatus`, `resetDetectedSpeaker`, `setSpeakerPresenceRate`
  - **trueroom:** `adaptation`, `estimatorConfiguration`, `getCalibrationStatus`, `playSuccessTone`, `setSwapInputMute`
  - **update:** `beginSoftwareUpdate`, `checkForUpdate`, `getUpdateStatus`
  - **upnpAlarmClock:** `call`, `subscribe`
  - **upnpAudioIn:** `call`, `subscribe`
  - **upnpAVTransport:** `call`, `subscribe`
  - **upnpConnectionManager:** `call`, `subscribe`
  - **upnpContentDirectory:** `call`, `subscribe`
  - **upnpDeviceProperties:** `call`, `subscribe`
  - **upnpGroupManagement:** `call`, `subscribe`
  - **upnpGroupRenderingControl:** `call`, `subscribe`
  - **upnpHTControl:** `call`, `subscribe`
  - **upnpMusicServices:** `call`, `subscribe`
  - **upnpQueue:** `call`, `subscribe`
  - **upnpRenderingControl:** `call`, `subscribe`
  - **upnpSystemProperties:** `call`, `subscribe`
  - **upnpVirtualLineIn:** `call`, `subscribe`
  - **upnpZoneGroupTopology:** `call`, `subscribe`
  - **virtualLineIn:** `selectSource`, `sendBackChannelCmd`, `startAudio`, `startTransmission`, `stopAudio`, `stopTransmission`
  - **voice:** `createAmazonChallenge`, `createVoiceAccount`, `getVoiceAccounts`, `notifyInitiateOnboarding`
  - **zones:** `addMissingZoneDefinition`, `addZoneDefinition`, `getActiveZoneList`, `getZoneDefinitionList`
- **notable:**
  - **authorization:** the auth model: authenticateClient, authorizeDevice, createInvite, redeemInvite, deleteInvite, resolveToken, getUsers
  - **hardwareStatus:** exposes features beyond this hardware: getBatteryCells, getWaterStatus, getPoeStatus, getWiredSubStatus, getMicrophoneSwitchState, transitionToShipMode, initiateOrderlyShutdown
  - **settings:** privilege-tiered: getPublicSettings/getProtectedSettings/getProtectedAdminSettings/getRestrictedAdminSettings + setRestrictedAdminSettings/setProtectedAdminSettings; setAllowMicrophone, setSonosNetChannel, setSelfTruePlay
  - **positioning:** the Trueplay measurement-session API: startSession/playStimulus/sendMeasurements/setStimulusTuning/getStimulusTuning/getSessionMap/notifySessionStatus
  - **soundSwap:** requestSwap/triggerSwap — accessory-swap feature also under homeTheater (getAccessorySwapStatus/getSwapModelInfo)
  - **hdmi:** edid/powercycle/status — direct HDMI control
  - **management:** factoryReset + reboot reachable over muse
  - **upnp*:** every SOAP service exposes exactly {call, subscribe} — a thin proxy, not a reimplementation
  - **virtualRemoteControl:** sendButtonCommand — cloud-injected button presses
  - **platformInternal:** invalidateCache/reboot/sync
  - **svc:** getWeatherConfig/setWeatherConfig/voiceCommand — a voice-service config proxy
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e7d060, notes: (param,resource,verb) registration triples, e.g. userId,entitlements,getUserEntitlements
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e7f660, notes: playerId,pinewood,toggleMute — pinewood verb form
- **status:** confirmed

## `enum_tables`

- **status:** confirmed
- **name:** Static enum name->integer registration tables
- **note:** 48 {name*, strlen, enumval} record arrays in .data.rel.ro — the binary's own enum registration tables, giving proven integer values for the name vocabularies elsewhere catalogued as unordered literals (muse roles/auth-types/playModes, SMAPI capability bitmask, CHSRC source classes, alarm/timer/power/replication FSM states, remote buttons, speaker orientation, netmodes, trueroom data types, content-object classes, ratings, update-FSM results, vanish reasons). Values are sequential (enum) or power-of-two (bitmask) as marked.
- **tables:**
  - **10ea5b08:**
    - none
    - 1
    - free
    - 2
    - paidLimited
    - 3
    - paidPremium
    - 4
  - **10ea5b44:**
    - radio
    - 1
    - reporting
    - 2
    - audiobook
    - 3
    - browse
    - 4
  - **10f9939c:**
    - NORMAL
    - 1
    - REPEAT_ALL
    - 2
    - SHUFFLE
    - 3
    - SHUFFLE_NOREPEAT
    - 4
  - **10f99420:**
    - OWNER
    - 1
    - GUEST
    - 2
    - CRM
    - 3
    - ADMIN
    - 4
    - EMPLOYEE
    - 5
    - PLAYER_TO_PLAYER
    - 6
    - BLE_DTLS
    - 7
  - **10f99514:**
    - AUTHZTOKENS
    - 1
    - AUTHZPOLICIES
    - 2
    - DEVICES
    - 3
    - ENTITLEMENTS
    - 4
    - FCS
    - 5
    - SETTINGS
    - 6
    - HISTORY
    - 7
  - **10f995c0:**
    - PAUSE_CONTENT
    - 1
    - PLAY_TO_BONDED
    - 2
    - STOP_CONTENT
    - 3
    - USE_SHARED_QUEUE
    - 4
  - **10f996b0:**
    - ALBUM
    - 1
    - ARTIST
    - 2
    - AUDIOBOOK
    - 3
    - CHAPTER
    - 4
    - SMAPI_CONTAINER
    - 5
    - EPISODE
    - 6
    - PLAYLIST
    - 7
    - PODCAST
    - 8
    - PROGRAM
    - 9
    - STREAM
    - 10
    - TRACK
    - 11
  - **10f99788:**
    - GUEST_TOKEN
    - 1
    - ACCESS_TOKEN
    - 2
    - API_KEY
    - 3
    - GUEST_TOKEN_PIN
    - 4
  - **10f99838:**
    - SRADIO_NO_ADS
    - 1
    - SRADIO_HD_CONTENT
    - 2
    - SRADIO_SPECIAL_CONTENT
    - 3
    - SRADIO_ONDEMAND_ARCHIVE
    - 4
    - SRADIO_CAN_SKIP
    - 5
    - SFB_BASIC_UI
    - 6
    - SFB_COMMERCIAL_MSP
    - 7
    - SFB_ESSENTIALS_MSP
    - 8
    - SFB_PREMIUM_MSP
    - 9
    - SFB_DASHBOARD_ACCESS
    - 10
    - SFB_CNTRL_MEDIA_SRCS
    - 11
    - SFB_CNTRL_THIRD_PARTY
    - 12
    - SFB_RSTC_CONTENT_ACS
    - 13
    - SFB_RSTC_SAVE_CONTENT_ACS
    - 14
    - SFB_RSTC_SETTINGS_ACS
    - 15
    - SFB_RSTC_ALARMS_ACS
    - 16
    - SFB_RSTC_MESSAGING_ACS
    - 17
    - SFB_RSTC_SAVE_GROUPS_ACS
    - 18
    - SFB_SCHEDULES_ACCESS
    - 19
  - **10f99b8c:**
    - PLAYBACK_STATE_IDLE
    - 1
    - PLAYBACK_STATE_BUFFERING
    - 2
    - PLAYBACK_STATE_PAUSED
    - 3
    - PLAYBACK_STATE_PLAYING
    - 4
  - **10f99c8c:**
    - REPLACE
    - 1
    - APPEND
    - 2
    - INSERT
    - 3
    - INSERT_NEXT
    - 4
    - PLAY_NOW
    - 5
  - **10f99d88:**
    - STAR
    - 1
    - THUMBSUP
    - 2
    - THUMBSDOWN
    - 3
    - LOVE
    - 4
    - HATE
    - 5
    - BAN
    - 6
    - NONE
    - 7
    - SHELVED
    - 8
  - **10f99e30:**
    - UNKNOWN
    - 1
    - UNREGISTERED
    - 2
    - LEGACY_REGISTERED
    - 3
    - SECURE_REGISTERED
    - 4
    - TRANSFER
    - 5
    - OFFLINE
    - 6
    - PREP_TRANSFER
    - 7
  - **10f99f80:**
    - NETMODE_SONOSNET_WIRED
    - 1
    - NETMODE_SONOSNET_WIRELESS
    - 2
    - NETMODE_WIRED
    - 3
    - NETMODE_WIRED_NO_WIFI
    - 4
    - NETMODE_STATION
    - 5
    - NETMODE_SATELLITE_V1
    - 6
    - NETMODE_SATELLITE_V1_WIRED
    - 7
    - NETMODE_SATELLITE_V2
    - 8
  - **10f9a0a4:**
    - SONOSNET
    - 1
    - STATION
    - 2
    - DISCONNECTED
    - 3
    - STATION_SATELLITE
    - 4
  - **10f9f654:**
    - basic-ui
    - 1
    - commercial-msp
    - 2
    - essentials-msp
    - 4
    - premium-msp
    - 8
    - dashboard-access
    - 16
    - schedules-access
    - 32
    - content
    - 1
    - content-saving
    - 2
    - settings
    - 4
    - alarms
    - 8
    - messaging
    - 16
    - save-groups
    - 32
    - no-ads
    - 1
    - hd-content
    - 2
    - special-content
    - 4
    - on-demand-archive
    - 8
    - can-skip
    - 16
    - media-sources
    - 1
    - third-party-integ
    - 2
  - **10fac83c:**
    - ALARM_DISABLED
    - 1
    - ALARM_PENDING
    - 2
    - ALARM_SNOOZED
    - 3
    - ALARM_FIRING
    - 4
  - **10fac904:**
    - ACTIVE
    - 1
    - DONE
    - 2
    - DISMISSED
    - 3
    - INACTIVE
    - 4
    - INTERRUPTED
    - 5
    - ERROR
    - 6
  - **10fac9bc:**
    - POWER
    - 1
    - BACK
    - 2
    - HOME
    - 3
    - MENU
    - 4
    - PLAY_PAUSE
    - 5
    - MUSIC
    - 6
    - DPAD_UP
    - 7
    - DPAD_DOWN
    - 8
    - DPAD_LEFT
    - 9
    - DPAD_RIGHT
    - 10
    - DPAD_SELECT
    - 11
  - **10facad0:**
    - PLAYBACK
    - 1
    - CLOUD
    - 2
    - HT_PLAYBACK
    - 3
    - HT_POWER_STATE
    - 4
    - AIRPLAY
    - 5
    - LINE_IN
    - 6
    - AUDIO_CLIP
    - 7
    - VOICE
    - 8
    - SPEAKER_DETECTION
    - 9
    - FIXED_VOLUME
    - 10
    - ROOM_DETECTION
    - 11
    - MICROPHONE_SWITCH
    - 12
    - HDMI
    - 13
    - IR_CONTROL
    - 14
    - SVC
    - 15
    - ALEXA_CBL
    - 16
  - **10facc88:**
    - CLOSED
    - 1
    - ERROR
    - 2
    - INIT
    - 3
    - OFFLINE
    - 4
    - CONFIGURING
    - 5
    - NO_LOGICAL_ADDRESS
    - 6
    - READY
    - 7
  - **10facd4c:**
    - HEALTHCHECK
    - 1
    - SERVER
    - 2
    - USER
    - 3
    - SNF
    - 4
    - FEEDBACK
    - 5
    - EXTRALOCAL
    - 6
  - **10facdb8:**
    - UP
    - 1
    - DOWN
    - 2
    - LEFT
    - 3
    - RIGHT
    - 4
    - SELECT
    - 5
  - **10face10:**
    - NONE
    - 1
    - ABORT_UNRECOGNIZED_OP
    - 2
    - ABORT_INCORRECT_MODE
    - 3
    - ABORT_NO_SOURCE
    - 4
    - ABORT_INVALID_OP
    - 5
    - ABORT_REFUSED
    - 6
    - ABORT_UNDETERMINED
    - 7
    - DEVICE
    - 8
    - NACK
    - 9
    - REPLY_TIMEOUT
    - 10
    - ROOT_INDIRECT
    - 11
    - BROADCAST_BLOCKED
    - 12
    - UNKNOWN
    - 13
  - **10facf88:**
    - DISCOGS
    - 1
    - IPI
    - 2
    - ISNI
    - 3
    - ISRC
    - 4
    - MBID
    - 5
    - MUSICOBJECTID
    - 6
  - **10fad080:**
    - NO_CONNECTION
    - 1
    - CONNECTED
    - 2
    - SONGLE
    - 3
    - UNKNOWN
    - 4
  - **10fad0cc:**
    - NO_DEVICES_NEED_UPDATE
    - 1
    - UPDATE_COMPLETE
    - 2
    - INFO_FILE_WRITE_FAILED
    - 3
    - BSU_FAILED
    - 4
    - UPGRADE_MGR_SPAWN_FAILED
    - 5
    - MANIFEST_DOWNLOAD_FAILED
    - 6
    - MANIFEST_PARSE_FAILED
    - 7
    - UPDATE_NEVER_RUN
    - 8
    - FINAL_RESULT_UNKNOWN
    - 9
  - **10fad230:**
    - UNDEFINED
    - 1
    - HORIZONTAL
    - 2
    - VERTICAL_WALL_ABOVE
    - 3
    - VERTICAL_WALL_BELOW
    - 4
    - VERTICAL_TAG_LEFT
    - 5
    - VERTICAL_TAG_RIGHT
    - 6
    - HORIZONTAL_WALL_MOUNTED
    - 7
    - HORIZONTAL_LEFT
    - 8
    - HORIZONTAL_RIGHT
    - 9
    - VERTICAL_WALL_MOUNTED
    - 10
    - VERTICAL_WALL_LEFT
    - 11
    - VERTICAL_WALL_RIGHT
    - 12
    - FACEDOWN
    - 13
    - INVERTED
    - 14
    - INVALID
    - 15
  - **10fad3ac:**
    - UNKNOWN
    - 1
    - SW_GEN
    - 2
    - SECURE_REG
    - 3
    - UPNP_OVER_TLS
    - 4
  - **10fad40c:**
    - SU
    - 1
    - MO
    - 2
    - TU
    - 3
    - WE
    - 4
    - TH
    - 5
    - FR
    - 6
    - SA
    - 7
  - **10fad520:**
    - PENDING_ADD
    - 1
    - ADD_IN_PROGRESS
    - 2
    - ADD_COMPLETE
    - 3
    - PENDING_REINDEXING
    - 4
    - REINDEXING_IN_PROGRESS
    - 5
    - REINDEXING_COMPLETE
    - 6
    - REPLICATION_IN_PROGRESS
    - 7
    - REPLICATION_COMPLETE
    - 8
    - PENDING_DELETE
    - 9
    - DELETE_COMPLETE
    - 10
  - **10fad660:**
    - UNDEFINED
    - 1
    - CONNECT
    - 2
    - HELLO
    - 3
    - DOWNLOAD
    - 4
    - FLASHWRITE
    - 5
    - WAIT
    - 6
    - REBOOT
    - 7
    - ERROR
    - 8
    - FINISHED
    - 9
  - **10fad6d8:**
    - INIT
    - 1
    - HELLO
    - 2
    - HELLO_DONE
    - 3
    - DOWNLOAD
    - 4
    - DOWNLOAD_DONE
    - 5
    - FLASHWRITE
    - 6
    - FLASHWRITE_DONE
    - 7
    - REBOOT
    - 8
    - REBOOTING_DONE
    - 9
  - **10fad750:**
    - UNDEFINED
    - 1
    - ENABLED_AVAILABLE
    - 2
    - ENABLED_UNAVAILABLE
    - 3
    - DISABLED_AVAILABLE
    - 4
    - DISABLED_UNAVAILABLE
    - 5
    - SECONDARY_STATE_IGNORED_BY_CR
    - 6
  - **10fad834:**
    - OFF
    - 1
    - LOW
    - 2
    - DEFAULT
    - 3
    - MAX
    - 4
  - **10fad874:**
    - RESET
    - 1
    - OFFLINE
    - 2
    - INITIATING
    - 3
    - ONLINE
    - 4
    - TERMINATING
    - 5
    - ERROR
    - 6
  - **10fad8e8:**
    - RESET
    - 1
    - OFFLINE
    - 2
    - ONLINE
    - 3
    - ROOT_INDIRECT
    - 4
    - BROADCAST_BLOCKED
    - 5
  - **10fad930:**
    - RESET
    - 1
    - OFFLINE
    - 2
    - INITIATING
    - 3
    - ONLINE
    - 4
    - ERROR
    - 5
  - **10fadb4c:**
    - UNKNOWN
    - 1
    - ON
    - 2
    - STANDBY
    - 3
    - TO_ON
    - 4
    - TO_STANDBY
    - 5
  - **10fadc30:**
    - BLUETOOTH
    - 1
    - ERROR
    - 2
    - EXPIRED
    - 3
    - LOW_BATTERY
    - 4
    - NEW_IP
    - 5
    - NEW_SSID
    - 6
    - POWERED_OFF
    - 7
    - SLEEPING
    - 8
    - UNKNOWN
    - 9
    - UPGRADE
    - 10
  - **10fadccc:**
    - PLAY
    - 1
    - PAUSE
    - 2
    - NEXT_TRACK
    - 3
    - PREV_TRACK
    - 4
  - **10fadd94:**
    - INACTIVE
    - 1
    - WIFI_ENABLING
    - 2
    - ACK_AWAIT
    - 3
    - WIFI_DISABLING
    - 4
    - WIFI_DISABLED
    - 5
    - ACK_NOT_RECEIVED
    - 6
  - **10faec64:**
    - MOTION_DETECTED
    - 1
    - MOTION_SETTLED
    - 2
    - SLEEPING
    - 3
    - WAKING_UP
    - 4
    - POWERING_DOWN
    - 5
    - POWERING_UP
    - 6
    - SMART_DOCKED
    - 7
    - CHARGING
    - 8
    - PRIMARY_PLAYBACK_STARTED
    - 9
    - POWERING_UP_UPDATED
    - 10
    - WAKING_UP_FROM_USER
    - 11
    - PRIMARY_NETWORK_STATUS_CHANGE
    - 12
  - **10faee08:**
    - INAUDIBLE
    - 1
    - MULTI_INAUDIBLE
    - 2
    - INAUDIBLE_WIDE
    - 3
    - MULTI_INAUDIBLE_WIDE
    - 4
    - AUDIBLE
    - 5
    - MULTI_AUDIBLE
    - 6
    - BLE
    - 7
  - **10faeed0:**
    - READY
    - 1
    - ACTIVE
    - 2
    - CANCELED
    - 3
    - ERROR
    - 4
    - STIMULUS_PLAYBACK_COMPLETE
    - 5
    - COMPLETE
    - 6
  - **10faef4c:**
    - ANGLE
    - 1
    - BEARING
    - 2
    - DISTANCE
    - 3
    - MAP
    - 4
    - ACOUSTIC_SPACE_MAP
    - 5
    - PORTABLE_SURROUNDS
    - 6
  - **10faefd4:**
    - NONE
    - 1
    - SESSION_RESULTS
    - 2
    - MEASUREMENT_RESULTS
    - 3
    - MEASUREMENT_RAW_AUDIO
    - 4
  - **10ff1700:**
    - DD_SAT_CONF
    - 1
    - DD_NO_SURROUND
    - 2
    - DD_NO_SURROUND_TO_SAT
    - 3
    - DD_SURROUND
    - 4
    - DD_SURROUND_TO_SAT
    - 5
  - **r_led_mask:**
    - **provenance:** per-use extraction: applyLEDMode f_10c918a0 bit-test chain — each R_LED_* name logs its tested mask bit as (hi<<32)\|lo constants; PROVEN from code, not registration table
    - **kind:** bitmask64
    - **names:**
      - **R_LED_MUTED:** 0x1
      - **R_LED_HHID:** 0x2
      - **R_LED_JOIN_HH:** 0x4
      - **R_LED_SHUTDOWN:** 0x10
      - **R_LED_UPGRADE:** 0x20
      - **R_LED_WARN:** 0x40
      - **R_LED_FAULT:** 0x80
      - **R_LED_WAITING_TO_PLAY:** 0x400
      - **R_LED_AUDIO_OFF:** 0x800
      - **R_LED_DEMO_CONFIGURE_IR:** 0x1000
      - **R_LED_DEMO_MODE:** 0x2000
      - **R_LED_JOIN_HH_OPEN:** 0x4000
      - **R_LED_WAITING_TO_PAUSE:** 0x10000
      - **R_LED_WAC:** 0x20000
      - **R_LED_WAC_TIMEOUT:** 0x40000
      - **R_LED_TRANSFER_REGISTRATION:** 0x80000
      - **R_LED_BROKEN_DEVICE:** 0x100000
      - **R_LED_BEGIN_SETUP_MODE:** 0x8000000
      - **R_LED_IN_SETUP_MODE:** 0x10000000
      - **R_LED_CONTROL_FEEDBACK:** 0x100000000
      - **R_LED_BREAK_POP:** 0x800000000
      - **R_LED_IDENTIFY_PLAYER:** 0x4000000000
      - **R_LED_PLAYING:** 0x0 (else/default case — mask with no bit set)
    - **note:** 64-bit LED-state mask; !R_LED_HHID logs the same 0x2 bit inverted (set vs clear both logged)
  - **r_play_op:**
    - **provenance:** jump-table dispatch in f_104c9270: cmplwi bound 6 + PIC offset table @0x10ed8640; each case logs its R_PLAY_OP name — PROVEN
    - **kind:** enum
    - **names:**
      - **0:** (no R_ log in case — likely NONE/nop)
      - **1:** R_PLAY_OP_BOUNDARY
      - **2:** R_PLAY_OP_RESYNC (immed log site)
      - **3:** R_PLAY_OP_ERROR
      - **4:** shared case: R_PLAY_OP_RESYNC (sched), R_PLAY_OP_CHANGE_SRC, R_PLAY_OP_SAMPLE all logged here
      - **5:** R_PLAY_OP_CODEC_SELECTED
      - **6:** R_PLAY_OP_ORIGIN_TIME_SELECTED
  - **r_stream_op:**
    - **provenance:** jump-table dispatch in f_104c6264 (stream op handler); case->log-name bucketing — PROVEN
    - **kind:** enum
    - **names:**
      - **0:** (no R_ log)
      - **1:** R_STREAM_OP_OPEN
      - **2:** R_STREAM_OP_CLOSE
      - **3:** R_STREAM_OP_INTERRUPT
      - **4:** shared case: R_STREAM_OP_SAMPLE + R_STREAM_OP_ACK
      - **5:** R_STREAM_OP_ERROR
      - **6:** R_STREAM_OP_BOUNDARY
      - **7:** R_STREAM_OP_IMMED_RESYNC
      - **8:** R_STREAM_OP_SCHED_RESYNC
      - **9:** R_STREAM_OP_ORIGIN_TIME_SELECTED
      - **10:** R_STREAM_OP_QUALITY_SELECTED
  - **muse_result_codes:**
    - **provenance:** direct-indexed char* table @0x10f94d14; consumer f_109e0d14 does cmplwi 106 bound-check + table\[code\] name lookup; f_109e0e10 the reverse (name->code). PROVEN — index IS the wire result code
    - **kind:** enum
    - **count:** 107
    - **names:**
      - **0:** ERROR_ALARM_CONFLICT
      - **1:** ERROR_ALARM_NO_SPACE
      - **2:** ERROR_ALARM_BAD_TIME_SERVER
      - **3:** ERROR_AREAS_READ_ONLY
      - **4:** ERROR_AUDIO_CLIP_ID_NOT_FOUND
      - **5:** ERROR_AUDIO_CLIP_MEDIA_ERROR
      - **6:** ERROR_AUDIO_CLIP_PAUSE_CONTENT_FAILED
      - **7:** ERROR_AUDIO_CLIP_VOICE_ASSISTANT_PLAYING
      - **8:** ERROR_CACHE_NOT_FOUND
      - **9:** ERROR_CACHE_RECORD_NOT_FOUND
      - **10:** ERROR_CANT_CONNECT_REMOTE
      - **11:** ERROR_NO_UPDATE_AVAILABLE
      - **12:** ERROR_INVALID_UPM_FORMAT
      - **13:** ERROR_INSUFFICIENT_POWER_FOR_UPDATE
      - **14:** ERROR_DEVICE_ALREADY_REGISTERED
      - **15:** ERROR_DEVICE_UNAVAILABLE
      - **16:** ERROR_INVALID_ACTION
      - **17:** ERROR_DOWNSTREAM_CONNECT_FAILED
      - **18:** ERROR_CANT_CONNECT
      - **19:** ERROR_PLAYBACK_FAILED
      - **20:** ERROR_PLAYBACK_NO_CONTENT
      - **21:** ERROR_PLAYBACK_NO_PLAYABLE_CONTENT
      - **22:** ERROR_PLAYBACK_EXPLICIT_NOT_ALLOWED
      - **23:** ERROR_PLAYBACK_EXPIRED_TOKEN
      - **24:** ERROR_NOT_PLAYABLE
      - **25:** ERROR_SPOTIFY_CONNECT
      - **26:** ERROR_FAILURE_TO_ENQUEUE
      - **27:** ERROR_CLOUD_QUEUE_SERVER
      - **28:** ERROR_SKIP_LIMIT_REACHED
      - **29:** ERROR_PLAYBACK_STREAM_LIMIT
      - **30:** ERROR_PLAYERS_HAVE_INCOMPATIBLE_FIRMWARE
      - **31:** ERROR_PREFERRED_ACCOUNT_NOT_SET
      - **32:** ERROR_PREFERRED_ACCOUNT_NOT_FOUND
      - **33:** ERROR_ROOM_DETECTION_SIGNALLING_FAILED
      - **34:** ERROR_ROOM_DETECTION_SIGNALLING_BUSY
      - **35:** ERROR_SESSION_IN_PROGRESS
      - **36:** ERROR_SESSION_JOIN_FAILED
      - **37:** ERROR_SESSION_EVICTED
      - **38:** ERROR_SHARES_CONFLICT
      - **39:** ERROR_SHARES_NO_SUCH_SHARE
      - **40:** ERROR_SHARES_NO_SPACE
      - **41:** ERROR_SHARES_REQUEST_FAILED
      - **42:** ERROR_STIMULUS_ALREADY_PLAYING
      - **43:** ERROR_MICROPHONE_NOT_ENABLED
      - **44:** ERROR_INVALID_SESSION_ID
      - **45:** ERROR_NO_POSITIONING_RESULTS
      - **46:** ERROR_UNSUPPORTED_POSITIONING_REQUEST
      - **47:** ERROR_SVC_DISABLED
      - **48:** ERROR_TIMER_NOT_FOUND
      - **49:** ERROR_UNSUPPORTED_VOLUME_MODE
      - **50:** ERROR_INVALID_RESOURCE
      - **51:** ERROR_UPDATE_IN_PROGRESS
      - **52:** OK
      - **53:** CREATED
      - **54:** ACCEPTED
      - **55:** SUCCESS_NO_CONTENT
      - **56:** SUCCESS_NOT_MODIFIED
      - **57:** ERROR_ACCOUNT_FULL
      - **58:** ERROR_ACCOUNT_INVALID_ID
      - **59:** ERROR_ACCOUNT_NO_DEFAULT_FOUND
      - **60:** ERROR_ACCOUNT_REAUTH_REQUIRED
      - **61:** ERROR_ACCOUNT_UPGRADE_REQUIRED
      - **62:** ERROR_ACCOUNT_WRONG_SERVICE
      - **63:** ERROR_COMMAND_FAILED
      - **64:** ERROR_CONTENT_TYPE_NOT_SUPPORTED
      - **65:** ERROR_DISALLOWED_BY_POLICY
      - **66:** ERROR_GROUP_CHANGED
      - **67:** ERROR_INTERNAL
      - **68:** ERROR_COMMAND_TIMEOUT
      - **69:** ERROR_INVALID_AUTH_HEADER
      - **70:** ERROR_INVALID_CERT
      - **71:** ERROR_INVALID_OBJECT_ID
      - **72:** ERROR_INVALID_PARAMETER
      - **73:** ERROR_INVALID_SYNTAX
      - **74:** ERROR_TARGET_ID_NOT_FOUND
      - **75:** ERROR_LOAD_COMMAND_FAILED
      - **76:** ERROR_MISSING_PARAMETERS
      - **77:** ERROR_NO_CONTENT
      - **78:** ERROR_NO_PERMISSION
      - **79:** ERROR_NOT_AUTHORIZED
      - **80:** ERROR_NOT_CAPABLE
      - **81:** ERROR_PRECONDITION_FAILED
      - **82:** ERROR_QUEUE_FULL
      - **83:** ERROR_RESOURCE_GONE
      - **84:** ERROR_RESOURCE_CONFLICT
      - **85:** ERROR_REQUIRES_GROUP_COORDINATOR
      - **86:** ERROR_SERVICE_NOT_AVAILABLE
      - **87:** ERROR_SERVICE_NOT_CONFIGURED
      - **88:** ERROR_SERVICE_NOT_SUPPORTED
      - **89:** ERROR_UNSUPPORTED_NAMESPACE
      - **90:** ERROR_UNSUPPORTED_COMMAND
      - **91:** ERROR_UNSUPPORTED_REQUEST
      - **92:** ERROR_UNSUPPORTED_REQUEST_METHOD
      - **93:** ERROR_API_KEY_VALIDATION_FAILED
      - **94:** ERROR_SERVICE_UNAVAILABLE
      - **95:** ERROR_NYI
      - **96:** ERROR_CMD_FUTURE
      - **97:** ERROR_CMD_REMOVED
      - **98:** ERROR_INSUFFICIENT_RESOURCES
      - **99:** ERROR_INCORRECT_STATE
      - **100:** ERROR_INVALID_HEADER
      - **101:** ERROR_INVALID_LENGTH
      - **102:** ERROR_INVALID_TRANSPORT
      - **103:** ERROR_EXPECTATION_FAILED
      - **104:** ERROR_INCOMPATIBLE_API_VERSION
      - **105:** ERROR_INCOMPATIBLE_CLIENT_VERSION
      - **106:** ERROR_NOT_DESIGNATED_DEVICE
    - **note:** the muse/lechmere result-code enum (systemResult/result fields, cmd responses). 0-51 domain errors, 52-56 success (OK/CREATED/ACCEPTED/NO_CONTENT/NOT_MODIFIED mirroring HTTP 200/201/202/204/304), 57-106 protocol/request errors. Out-of-range renders UNKNOWN
  - **media_service_errors:**
    - **provenance:** ordered char* name table @0x110925dc, 71 entries; duplicate-name codes share pointers (ACCESS_DENIED x3, NO_RESOURCE x3) confirming index semantics. Consumer not yet located — value binding inferred from table order, lower confidence than muse_result_codes
    - **kind:** enum
    - **count:** 71
    - **names:**
      - **0:** ERROR_OCCURRED
      - **1:** ERROR_CANT_REACH_SERVER
      - **2:** ERROR_ACCESS_DENIED
      - **3:** ERROR_ACCESS_DENIED
      - **4:** ERROR_NO_RESOURCE
      - **5:** ERROR_NO_RESOURCE
      - **6:** ERROR_LOST_CONNECTION
      - **7:** ERROR_UNSUPPORTED_FORMAT
      - **8:** ERROR_UNSUPPORTED_FREQ
      - **9:** ERROR_UNSUPPORTED_DRM
      - **10:** ERROR_CORRUPT_FILE
      - **11:** ERROR_ACCESS_DENIED
      - **12:** ERROR_TOO_MANY_MOUNTED
      - **13:** ERROR_NO_RESOURCE
      - **14:** ERROR_TOO_MANY_USERS
      - **15:** ERROR_BAD_INET_RADIO
      - **16:** ERROR_BUFFERING
      - **17:** ERROR_CANT_RESOLVE_NAME
      - **18:** ERROR_RHAP_STREAM_LIMIT
      - **19:** ERROR_RHAP_UNAVAILABLE
      - **20:** ERROR_RHAP_BAD_ACCOUNT
      - **21:** ERROR_RHAP_TRIAL_EXPIRED
      - **22:** ERROR_RHAP_NO_ACCOUNT
      - **23:** ERROR_RHAP_UNSUPP_ACCOUNT
      - **24:** ERROR_AUDIBLE_BAD_CODEC
      - **25:** ERROR_AUDIBLE_DRM
      - **26:** ERROR_AUDIBLE_ZP_MISSING
      - **27:** ERROR_WMP_ACCESS_DENIED
      - **28:** ERROR_WMP_NO_LICENSE
      - **29:** ERROR_SIRIUS_STREAM_LIMIT
      - **30:** ERROR_SIRIUS_STREAM_LIMIT_EXT
      - **31:** ERROR_SIRIUS_BAD_ACCOUNT
      - **32:** ERROR_SIRIUS_TRIAL_EXPIRED
      - **33:** ERROR_SIRIUS_INACTIVE
      - **34:** ERROR_SIRIUS_NO_ACCOUNT
      - **35:** ERROR_SIRIUS_BAD_SUBLEVEL
      - **36:** ERROR_SIRIUS_AUTH_GEN_FAIL
      - **37:** ERROR_SIRIUS_AUTH_INACTIVE
      - **38:** ERROR_PAND_BAD_ACCOUNT
      - **39:** ERROR_PAND_TRIAL_EXPIRED
      - **40:** ERROR_PAND_NO_ACCOUNT
      - **41:** ERROR_PAND_BAD_SUBLEVEL
      - **42:** ERROR_PAND_READ_ONLY
      - **43:** ERROR_PAND_STATION_GONE
      - **44:** ERROR_PAND_SUSPENDED
      - **45:** ERROR_SONOS_BAD_ACCOUNT
      - **46:** ERROR_SONOS_NO_ACCOUNT
      - **47:** ERROR_SONOS_TRIAL_EXPIRED
      - **48:** ERROR_LASTFM_BAD_SUBLEVEL
      - **49:** ERROR_LASTFM_STREAM_LIMIT
      - **50:** ERROR_LASTFM_NO_ACCOUNT
      - **51:** ERROR_LASTFM_NO_CONTENT
      - **52:** ERROR_DOCK_INTERRUPT
      - **53:** ERROR_SONOS_STREAM_LIMIT
      - **54:** ERROR_SONOS_UNSUPP_ACCOUNT
      - **55:** ERROR_LASTFM_BAD_ACCOUNT
      - **56:** ERROR_MOBILE_CANT_REACH_SERVER
      - **57:** ERROR_SONOS_TOKEN_EXPIRED
      - **58:** ERROR_SONOS_BAD_LOCATION
      - **59:** ERROR_SONOS_INACTIVE
      - **60:** ERROR_CLOUD_QUEUE_SERVICE_ERROR
      - **61:** ERROR_CLOUD_QUEUE_ACCESS_DENIED
      - **62:** ERROR_CLOUD_QUEUE_STREAM_LIMIT
      - **63:** ERROR_CLOUD_QUEUE_SERVICE_UNRESPONSIVE
      - **64:** ERROR_CLOUD_QUEUE_CANT_REACH_SERVER
      - **65:** ERROR_CERT_DENYLISTED
      - **66:** ERROR_CERT_NEEDED
      - **67:** ERROR_ACCESS_DENIED_EXPLICIT
      - **68:** ERROR_NO_CONTENT
      - **69:** ERROR_RESOURCE_NO_LONGER_AVAILABLE
      - **70:** ERROR_NO_PLAYABLE_CONTENT
    - **note:** legacy media/service playback error enum: generic transport errors 0-17, then per-service ranges (RHAP 18-23, AUDIBLE 24-26, WMP 27-28, SIRIUS 29-37, PAND 38-44, SONOS 45-47, LASTFM 48-51,55, DOCK 52, SONOS extras 53-54,56-59, CLOUD_QUEUE 60-64, CERT 65-66, tail 67-70)
  - **speaker_mask:**
    - **provenance:** ordered char* name table @0x10fbe650, 6 entries (same index-table shape as muse_result_codes)
    - **kind:** enum
    - **count:** 6
    - **names:**
      - **0:** SPEAKER_MASK_UNSPECIFIED
      - **1:** SPEAKER_MASK_THREE_DOT_ONE
      - **2:** SPEAKER_MASK_FIVE_DOT_ONE
      - **3:** SPEAKER_MASK_FIVE_DOT_ONE_DOT_TWO
      - **4:** SPEAKER_MASK_SEVEN_DOT_ONE
      - **5:** SPEAKER_MASK_NINE_DOT_ONE_DOT_FOUR
    - **note:** HT channel-mask enum (three.1=3.1ch, five.1.2/9.1.4 = Atmos heights)
  - **security_errors:**
    - **provenance:** contiguous literal run @0x10f92018-0x10f92274, 19 names; order likely = enum order but NO pointer table found — values unproven
    - **kind:** enum_unproven
    - **count:** 19
    - **names:** `SECURITY_ERROR_AUTH_GENERAL`, `SECURITY_ERROR_LOGIN_DENIED`, `SECURITY_ERROR_PEER_FAILED_VERIFICATION`, `SECURITY_ERROR_REMOTE_ACCESS_DENIED`, `SECURITY_ERROR_SSL_CACERT`, `SECURITY_ERROR_SSL_CACERT_BADFILE`, `SECURITY_ERROR_SSL_CERTPROBLEM`, `SECURITY_ERROR_SSL_CIPHER`, `SECURITY_ERROR_SSL_CLIENTCERT`, `SECURITY_ERROR_SSL_CONNECT`, `SECURITY_ERROR_SSL_CRL_BADFILE`, `SECURITY_ERROR_SSL_ENGINE_INITFAILED`, `SECURITY_ERROR_SSL_ENGINE_NOTFOUND`, `SECURITY_ERROR_SSL_ENGINE_SETFAILED`, `SECURITY_ERROR_SSL_INVALIDCERTSTATUS`, `SECURITY_ERROR_SSL_ISSUER`, `SECURITY_ERROR_SSL_PINNEDPUBKEYNOTMATCH`, `SECURITY_ERROR_SSL_SHUTDOWN_FAILED`, `SECURITY_ERROR_USE_SSL_FAILED`
    - **note:** auth/TLS client error vocabulary (curl-style SSL error family); adjacent HTTP-fetch run: ERROR_USE_SSL_FAILED,ERROR_POST_FAILED,ERROR_RETURNED,ERROR_MALFORMED_URL,ERROR_TOO_MANY_REDIRECTS
  - **channel_codes_ht:**
    - **provenance:** ordered char* name table @0x11092550, 18 entries
    - **kind:** enum
    - **count:** 18
    - **names:**
      - **0:** LF
      - **1:** RF
      - **2:** CC
      - **3:** SW
      - **4:** LR
      - **5:** RR
      - **6:** LS
      - **7:** RS
      - **8:** LTF
      - **9:** RTF
      - **10:** LTR
      - **11:** RTR
      - **12:** LW
      - **13:** RW
      - **14:** LTM
      - **15:** RTM
      - **16:** AX1
      - **17:** AX2
    - **note:** full home-theater channel vocabulary: fronts, center, sub, rear/surround, top front/middle/rear (Atmos heights), wide, aux1/2
  - **channel_codes_short:**
    - **provenance:** ordered char* name table @0x10ff0d88, 12 entries
    - **kind:** enum
    - **count:** 12
    - **names:**
      - **0:** L
      - **1:** R
      - **2:** C
      - **3:** SUB
      - **4:** LS
      - **5:** RS
      - **6:** LRS
      - **7:** RRS
      - **8:** LTM
      - **9:** RTM
      - **10:** LW
      - **11:** RW
  - **channel_map_profiles:**
    - **provenance:** ordered char* table @0x11095308, 31 entries = 4 concatenated channel-map profiles
    - **kind:** profile_set
    - **names:**
      - **0:** LF
      - **1:** RF
      - **2:** C
      - **3:** LFE
      - **4:** LS
      - **5:** RS
      - **6:** LRS
      - **7:** RRS
      - **8:** LF
      - **9:** RF
      - **10:** C
      - **11:** LFE
      - **12:** LS
      - **13:** RS
      - **14:** LRS
      - **15:** RRS
      - **16:** LF
      - **17:** RF
      - **18:** C
      - **19:** LS
      - **20:** RS
      - **21:** LRS
      - **22:** RRS
      - **23:** LF
      - **24:** RF
      - **25:** C
      - **26:** LFE
      - **27:** LS
      - **28:** RS
      - **29:** LRS
      - **30:** RRS
    - **note:** 4 profile layouts (3x 8-ch with LFE + 1x 7-ch without LFE) — the stereo-pair+sub+surround+height map variants
  - **timezones:**
    - **provenance:** ordered char* table @0x11092824, 11 entries
    - **kind:** enum
    - **count:** 11
    - **names:**
      - **0:** PST
      - **1:** MST
      - **2:** CST
      - **3:** EST
      - **4:** AST
      - **5:** NST
      - **6:** CET
      - **7:** IST
      - **8:** EET
      - **9:** CST
      - **10:** JST
    - **note:** tz abbrev table (CST appears twice - US Central + China Standard)
  - **r_client_keycert_id:**
    - **provenance:** selector f_1057ac60 returns id in r3; each arm loads its R_CLIENT_KEYCERT_ID_* log string then returns 0-3 — PROVEN name->id
    - **kind:** enum
    - **count:** 4
    - **names:**
      - **0:** R_CLIENT_KEYCERT_ID_SONOS (generic sonos cert; logged "...for %s")
      - **1:** R_CLIENT_KEYCERT_ID_SONOS_DEVICE_ACCEPT_LEGACY
      - **2:** R_CLIENT_KEYCERT_ID_SONOS_DEVICE
      - **3:** R_CLIENT_KEYCERT_ID_SONOS_REGISTERED_DEVICE (registered-device cert; host arg %s)
    - **note:** selection driven by flag bits at cert-ctx+0x0c (bit0/bit2) plus a predicate call; consumer f_1057ade8 (cert path builder) feeds id into f_1056c738 which indexes bss tables 0x110a5670/0x110a56d8 (runtime-populated cert objects). Cert manager source units: devicecertmanager.cxx, regdevicecert.cxx, certmanager.cxx; mbedTLS does CA/client-cert file+blob loading; bundle download w/ ETag change detection; /regcert + /root_cert_bundles HTTP endpoints
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f99838, notes: SMAPI/SRADIO/SFB capability table {name*,strlen,enum} stride-12
- **r_star_status:** ALL genuine R_* namespaces now resolved or accounted: R_LED_* (proven mask), R_PLAY_OP_*/R_STREAM_OP_* (proven jump-table), R_CLIENT_KEYCERT_ID_* (proven selector returns 0-3), ~29 R_* settings keys (separate key vocabulary, no integer semantics). Earlier catalogued "R_*" families were substring artifacts of ERROR_*/FLAC__*/SPEAKER_MASK_* strings — those belong to the media_service_errors and muse_result_codes enums instead
