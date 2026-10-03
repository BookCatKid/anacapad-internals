# HTTP: Endpoints & server behavior

## `http_status_endpoints`

The /status route table: the full registration map of the diagnostics website, covering every status page, what produces it, and its access flags. It's the complete inventory of the built-in support site.

::: details Technical details

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
- **note:** path literals proven in rodata; per-route handler output schemas harvested from handler+callee string refs: elements=XML/format templates emitted, files=shell/proc/jffs paths execd or read, misc_fields=field/token literals. Handlers dispatch through a module registry (vfunc +0x24) or call the shared command-stream helper f_1076b10c.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10e75c5c, notes: subhandler string cluster
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10e73e21, notes: ZPInfo field cluster
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
    - **description:** Sonos Logger admin form (POST, csrfToken): fields {dest:file\|"udp"\|"stderr",cat:category e.g. avt_impl,level:0-11 DIAGC(0)→SONOS_LOG(3)} + UDP {udp,udp_addr,udp_port,udp_default} + stderr {stderr,stderr_default} + Diag Msg {msg} + Log Backup {backup_dir,submitAction=logBackup→/jffs/app/log}; errors {Invalid log level/UDP port/UDP default/STDERR default,Log destination not found,UDP already enabled,Diag Msg not allowed}; "Private IP address is required for UDP logging"; dest charset `_ -./\`; status shows Active Destinations(default level)
    - **todo:** `Established: the route's registration, path, and documented behavior: Sonos Logger admin form (POST, csrfToken): fields {dest:file\|"udp"\|"stderr",cat:category e.g. avt_impl,level:0-11 DIAGC(.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: locate and trace the handler behind this route.`
  - **/devmode:**
    - **description:** dev-mode code entry: GET shows Model/Device ID/Version + form{csrfToken,statement textarea(11x80),button=submit\|delete} → "Statement installed."/"Statement removed.": signed statement mechanism
    - **todo:** `Established: the route's registration, path, and documented behavior: dev-mode code entry: GET shows Model/Device ID/Version + form{csrfToken,statement textarea(11x80),button=submit\|delete} .`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: locate and trace the handler behind this route.`
  - **/support:**
    - **detail:** ZPSupportInfo XML: <ZPSupportInfo><ZPNetworkInfo type="%s" %s="%s"><ZPSupportItem title="%s">… exec pages wrap <Command cmdline="…"> + /tmp/diagstdout+/tmp/diagstdin + <!-- SDT: %ld ms -->; path allowlist {/jffs/app/log,/jffs/app/settings,/jffs,/opt/log,/opt,/tmp,/var} + ambient caps dropped + child read timeout; application/octet downloads; CDATA escapes
- **description:** Full registration table decoded: 59 routes at .data 0x110908c8, entry {path, flags, handler} stride 0xc. Flag values: 0x2 default GET, 0xa/0xb/0xe privilege variants (dmesg/topology/upnp, enetports/wireless, cpumon/perfcounters), 0x82 prefix-mount (sub-dispatcher) (api/cloudqueue/leds), 0x6 (mdnsd log + playmode), 0x1 (/zp root page).
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
  - **flags_note:** w\[2\] flag field small-int space {1,3,0x100,0x101,0x102,0x200,0x30002,0x400,0x230101,0x232101}: likely method/capability bitmask (0x100=POST-ish, 0x200=WS upgrade, 0x400=internal); large values may pack method+auth+tier: undecoded
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
      - **todo:** `Established: the route's registration and handler address `f_10675234`: mfg unlock sibling.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_10675234 and document its accepted parameters and effects.`
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
      - **todo:** `Established: the route's registration and handler address `f_100c1230`: mDNS announce button on /spotifyzc.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100c1230 and document its accepted parameters and effects.`
    - **/pcap:**
      - **handler:** f_100d416c
      - **flags:** 
      - **detail:** Packet-capture download (f_100d416c). Internally execs "/bin/pcap - not (host %s and port %d)"; streams attachment trace.pcap application/octet-stream.
    - **/save_eq_presets:**
      - **handler:** f_100ba144
      - **flags:** 
      - **detail:** writes eqdata.txt via path-builder f_100b97f4 + form processor f_1068a70c
      - **todo:** `Established: the route's registration and handler address `f_100ba144`: writes eqdata.txt via path-builder f_100b97f4 + form processor f_1068a70c.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100ba144 and document its accepted parameters and effects.`
    - **/getDSP:**
      - **handler:** f_100bd9fc
      - **flags:** 
      - **detail:** DSP state XML dump (f_100bd9fc) text/xml <root>..</root>.
    - **/putDSP:**
      - **handler:** f_100bb63c
      - **flags:** 
      - **detail:** gate → obj->vt\[2\] commit + atomic refcount; uploads DSP config
      - **todo:** `Established: the route's registration and handler address `f_100bb63c`: gate → obj->vt\[2\] commit + atomic refcount; uploads DSP config.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100bb63c and document its accepted parameters and effects.`
    - **/setPersistentEQ:**
      - **handler:** f_100ba218
      - **flags:** 
      - **detail:** writes app/debug/dsp/persistentEQ.xml via same form processor
      - **todo:** `Established: the route's registration and handler address `f_100ba218`: writes app/debug/dsp/persistentEQ.xml via same form processor.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100ba218 and document its accepted parameters and effects.`
    - **/removeDSPDebugFiles:**
      - **handler:** f_100bc518
      - **flags:** 
      - **detail:** Deletes files under app/debug/dsp/ (f_100bc518).
    - **/dolby_config:**
      - **handler:** f_100be454
      - **flags:** 
      - **detail:** gate f_10548a14 → f_100be1cc writes config; else 500-class
      - **todo:** `Established: the route's registration and handler address `f_100be454`: gate f_10548a14 → f_100be1cc writes config; else 500-class.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100be454 and document its accepted parameters and effects.`
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
      - **todo:** `Established: the route's registration and handler address `f_100b85ec`: exec registry {init f_10571a84,run f_10571ae4,cleanup f_10571c88} over rodata struct 0x10e72a9c.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100b85ec and document its accepted parameters and effects.`
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
      - **todo:** `Established: the route's registration and handler address `f_105e935c`: Factory Reset / Reboot page: generic form "<h2>%s</h2> POST /%s csrfToken Submit" + "Remote factory reset." + "<h2>%s</h.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_105e935c and document its accepted parameters and effects.`
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
      - **todo:** `Established: the route's registration and handler address `f_105e9578`: tail f_10670638 reads fingerprint buffer 0x11097680+0x8d0; record fields {+15c,+158,+178,+182,+184}.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_105e9578 and document its accepted parameters and effects.`
    - **/snapshotspdiftap:**
      - **handler:** f_100bd5e4
      - **flags:** 
      - **detail:** gate → verifies vt+0x124==f_100c3f5c snapshot vfunc → takes snapshot
      - **todo:** `Established: the route's registration and handler address `f_100bd5e4`: gate → verifies vt+0x124==f_100c3f5c snapshot vfunc → takes snapshot.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100bd5e4 and document its accepted parameters and effects.`
    - **/downloadspdiftap:**
      - **handler:** f_100b9ed0
      - **flags:** 
      - **detail:** gate f_1054bdc8 → snprintf %s/%s spdiftap.compressed → streams file
      - **todo:** `Established: the route's registration and handler address `f_100b9ed0`: gate f_1054bdc8 → snprintf %s/%s spdiftap.compressed → streams file.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100b9ed0 and document its accepted parameters and effects.`
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
      - **todo:** `Established: the route's registration and handler address `f_1020f8c4`: Spotify Connect ZeroConf endpoint (f_1020f8c4). POST application/x-www-form-urlencoded; addUser action takes userName + .`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_1020f8c4 and document its accepted parameters and effects.`
    - **/spotdbg:**
      - **handler:** f_100b8140
      - **flags:** 
    - **/spotresetnts:**
      - **handler:** f_100b7fd8
      - **flags:** 
      - **detail:** Reset NTS button on /spotifyzc
      - **todo:** `Established: the route's registration and handler address `f_100b7fd8`: Reset NTS button on /spotifyzc.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100b7fd8 and document its accepted parameters and effects.`
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
      - **todo:** `Established: the route's registration and handler address `f_100b7cb4`: route record.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100b7cb4 and document its accepted parameters and effects.`
    - **/removestring:**
      - **handler:** f_100b79e0
      - **flags:** 
      - **form:** <h2>Remove System Setting</h2> POST {csrfToken hidden,key size=64}; responses {"Setting removed","HTTP Error %d"}; cache-control "no-cache, no-store, must-revalidate" + application/x-www-form-urlencoded
      - **todo:** `Established: the route's registration and handler address `f_100b79e0`: route record.`, `Still unknown: the handler function's internals - request fields it accepts and side effects it performs - are not decoded.`, `Next step: disassemble f_100b79e0 and document its accepted parameters and effects.`
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
    - **0xf8:** module render: writes the page XML into the response stream
    - **0x6c_0x178:** /device-class handlers call locator members +0x6c/+0x178 for shared header emit
  - **registry2_global:** 0x11095f88: second .bss registry used by the /accounts,/analoglinein,/registration class; handler verifies installed vfunc+0x24 against a per-module constant before indirect call
  - **module_tags** (89):
  
    ```
    AccountsInfo, Active, ActiveDeviceList, Alarm, Alarms, AudioCore, Backtrace, Bundles, Cert, ClientVersion, Cloud, ConnectionDetails, CpuMonitor, DNSCache, DSPStateManager, Decoder, DeviceInfo, DiagLevel, EnetPorts, Entry, General, HTConfig, HardwareStatusInfo, History, IRCode, IdxTrk, Incoming, LedPatternInfo, LocalSettings, LocalTime, MediaServers, Mode, Mount, Muse, MusicDecoder, NetSettings, NextLocal, NextUTC, Outgoing, Path, Pending, PendingAlarm, PerformanceCounterTables, Presentation, QuarantinedDevices, Registration, RenderingControl, Replication, RestHistory, RoomCalibrationActiveState, RoomCalibrationAvailCalID, RoomCalibrationBondedZoneInfo, RoomCalibrationInfo, RoomCalibrationOrientation, RoomCalibrationUserIntent, SPDIFTap, SSLClientCache, Satellites, Scheduler, SelfTrueplayEQ, SelfTrueplayInfo, ServiceIds, Services, SsidList, SubscribedEvents, Subscription, Subscriptions, Tables, ThirdPartyLibraryInfo, TimeUTC, Titles, Total, TrackQueueSummary, TrackSummary, UTCTime, UpdateInfo, UsageMetrics, UserAgent, VanishedDevices, Version, WebSocketHistory, Wireless, ZPInfo, ZPSupportInfo, ZoneGroupState, ZoneGroups, ZoneName, ZonePlayers, Zones
    ```
  - **note:** <Name> tags = the emitted root element AND the registered module identity; 90 tags in rodata vs 57 routed pages: unrouted tags (e.g. RoomCalibration*, VanishedDevices, UsageMetrics) are sub-documents emitted inside other pages
  - **resolve_slot:** locator->vt\[+0x84\] proven (resolves module; e.g. /wireless f_105eab50)
  - **render_slot:** module->vt\[+0xFC\] proven for /wireless shape (+0xF8 for other modules - per-module vtable layout)
  - **registry2_pattern:** Pattern A: handler reads *(0x11095f88)+N prebound module ptrs, verifies module->vt\[+0x24\] == per-page constant (the page method), calls it. Adjuster thunks (this+=off; b) bridge MI bases, e.g. /accounts f_101b6edc -> f_10427174.
  - **shared_base_renderer:** /ai_speech_enhance,/decoder,/htconfig,/spdiftap,/tvprocessor all verify f_100c3f5c (one base-class page method); /analoglinein verifies f_100c3b0c. Output = member dump via computed names - no static schema literals.
- **status_page_registry:**
  - **provenance:** stride-12 {name*, flag, source*/handler*} table at ~0x11090144-0x11090b6c (immediately precedes the master 102-record route table at 0x11090c00). Two page families: exec/file pages (source = shell cmd string like /sbin/lsmod, /bin/chronyc, or file path under /jffs /opt/log /proc/ath_rincon) and module pages (source = .text handler). flag values 1,2,6,0xa,0xb,0xe,0x43,0x46,0x82: semantics undecoded, likely content-type/auth bitmask (0x82 set on /api,/cloudqueue,/leds).
  - **exec_pages:** `/ifconfig->/sbin/...`, `/lsmod->/sbin/lsmod`, `/mount->/bin/mount`, `/netstat->/bin/netstat -an`, `/ntpsources->/bin/chronyc -n sources -v`, `/ps->/bin/ps`, `/route->/sbin/route -n`, `/scanresults->/wifi/athconfig scangetresults ath0 (flag 6)`, `/showmacs->brctl showmacs br0`, `/showports->brctl showports br0`, `/showstats->brctl showstats br0`, `/showstp->brctl showstp br0`, `/uptime->/usr/bin/uptime`, `/df`, `/du-jffs`, `/free`, `/date`, `/debugfiles`, `/dmesg`
  - **file_pages:** ~45 file-cat pages: /VERSION, /etc/resolv.conf, /jffs/{settings/*.json\|xml, *.log, irconfig.txt, localsettings.txt, shadow/stats, sys/log/setup*}, /opt/log/anacapa.*.log (18+ named logs incl. musecmdandrsp/museevt/lechmere.event/chsrc.state/trueplay), /proc/ath_rincon*/{device,dfs,fullstatus,mibcc,nf,phyerr,roam,station,status,primary}
  - **module_pages:**
    - **/accounts:** f_100ba480
    - **/activeZones:** f_100b9298
    - **/ai_speech_enhance:** f_100ba8b0
    - **/alarm:** f_100b9278
    - **/analoglinein:** f_100bced0
    - **/api:** f_105eb124 (flag 0x82: muse)
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
  - **flag_hypothesis:** superseded by flags_decode_attempt: flags are a per-page bitmask shared across handler/exec/file families (not page-type); 0x80 = prefix-mount. Best current hypothesis: support-bundle section mask - the flag-bit comparison site was not located statically.
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
    - **/policy:**
      - **render:** f_10372d34
      - **schema:** <Entitlements><Entitlement type="%s" isTrial="%s" sku="%s" startDate="%s" endDate="%s" codes="%s"/></Entitlements>
      - **fields:** `type`, `isTrial`, `sku`, `startDate`, `endDate`, `codes`
    - **/audiocore:** <AudioCore> + <SoundDevice><Zones>…</Zones></SoundDevice> + <DSPStateManager><Zones>…</Zones></DSPStateManager> + <PlayStateManager><PlayState>0x%08x</PlayState><PlaybackCount>%d</PlaybackCount><InfoCount>%d</InfoCount></PlayStateManager>
    - **/track_queue_summary:**
      - **render:** f_10265324
      - **schema:** <TrackQueueSummary> member dump </TrackQueueSummary>
    - **/accounts:**
      - **render:** f_101b6edc adjustor thunk this+=280 -> f_10427174
    - **/ethportstatistics:**
      - **schema:** EthPrtStats {rxPackets,txPackets,rxBytes,txBytes,rxErrors,rxDropped,txDropped,multicasts,collisions} + EthIntrf detail {lngthErr,ovrFlwErr,crcErr,frmeErr,fifoErr,missedErr,RxDtlErr,abrtErr,crErr,hrtBeatErr,wndwErr,TxDtlErr} read from /sys/class/net/eth0 (eth%u)
    - **/root_cert_bundles:**
      - **schema:** <RootCertBundleInfo><Bundles><CurrentBundle><BundleVersion/><BundleID/><IsFallback/></CurrentBundle><CachedCloudBundle><BundleVersion/><BundleID/><ETag/></CachedCloudBundle><PreviousBundle><BundleVersion/><BundleID/></PreviousBundle></Bundles></RootCertBundleInfo>
    - **/renderingcontrol:** <RenderingControl><DuckingFlags>%s</DuckingFlags><SodVolume>%d</SodVolume><ExtVolume>%d</ExtVolume><AudioCoreReady>%s</AudioCoreReady><DeviceTime>%d.%06d</DeviceTime></RenderingControl>: literals found in f_100b8f2c handler body (previously listed unresolved; the stub tail-calls into the shared emit fn but the schema literals sit in the handler itself)
    - **/decoder:** <MusicDecoder><LastActiveDecoder>%s</LastActiveDecoder></MusicDecoder>
    - **/topology:** <ReplicatedNetSettings LastUpdateDevice="%s" Version="%d" FileSchemaVersion="%d"><SonosNet Disable="%d"/><SonosNet Frequency="%d"/><Network SSID="%s" Flags="%d"/><BackupLanSwapPsk id="%s"/></ReplicatedNetSettings>: shared emitter also used by /wireless,/dmesg,/netsettings.*,/ssidlist.txt (same render lib)
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
      - **note:** raw SystemProperties write: arbitrary settings key/value with CSRF gate
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
  - **ranges_literal:** /ranges; boundary=##123456789###BOUNDARY @0x10e72241: multipart range-request response boundary template (HTTP 206 partial content)
- **resolved_extra_handlers:**
  - **/content/api:** f_102fd76c: translateId bridge: fields {objectId,serviceId->targetSid,targetObjectId}; outbound catalog/id/%s?destinationServiceId=%s; translation cache (cache.h) "saved/retrieved translation from cache"; errors objectId/serviceId/targetObjectId missing, "cannot perform translateId request"
  - **/bridge/content/api:** f_1048f3a4: getContent proxy w/ "service base path: %s", per-call timing "getContent took %ld ms: %s", "getContent parse failed"
  - **/entitlements/api:** f_1037120c: entmt obj; "using cloud URL: %s"; cache-control/etag headers; onCacheUpdate; "cloud entitlements: rc %d, http %d"
  - **/ZPs:** f_104d1b74: upgrade_mgr JSON report emit {SystemResult,Result,DownloadDuration,ExtendedError}; "report array size mismatch (%d/%zu)"
  - **/authz:** f_1060363c: resolveToken proxy to muse: logs token masked ******%s; fields {apiKey,credential,responseResolveToken}; cache-control passthrough; "Failed to resolve token http=%d"/"Failed to parse token response"
  - **/auth/oauth/v2/validate:** f_1063fe2c: outbound fmt /auth/oauth/v2/validate?access_token=%s
  - **/v2/diags:** f_106b6da0: diagnostic submit: form-data {originator,serial_num}; submit logs "%s for %s submitted (ID: %s, GUID: %s)" w/ guid-confirm mismatch check; "Local diagnostic" type; Diagnostic stub
  - **/settings/api/v1/locations/:** f_105dd808: locSetUpdMgr: processUpdateAllSettings GET /settings/api/v1/locations/%s/effectiveSettings conditional \[etag\|version\] + Last-Modified; X-Sonos-Corr-Id; keys {source,initial}
  - **/drc:** f_10d5ee28: dolby DRC config setter (see dsp_drc vocabulary)
  - **/staticparams:** f_10d5f1e4 shared with /dynamicparams: DSP param registry {virt_mode,dap,frontangle,heightangle,surrangle,rearsurrangle,oarBassExtraction,dapCutOff,upmix,hfilt,post,mode,vlamp,vmcal}
  - **/dynamicparams:** same fn as /staticparams
  - **/upload:** f_102537b0 shared crashdump uploader for /anacapad-external /sonospowercoordinator-external /watchdog(-legacy) /sonosledmgrd-external (/jffs/app/debug/sonosledmgrd.dmp) /netstartd-external /btmanager-external legacy-to-sentry; type=crashdump; "No URL found to upload dump file: %s"
  - **/watchdog:** f_100aaa04 shared with /devmode: internal HTTP subserver: routes /log /devmode /threadinfo /watchdogs /reboot /sonos_log? /unlock; "set log level: %s=%d"; serves anacapa.log; %d.%d.%d.%d host parse; HTML error pages
  - **/devmode:** f_105e8d90 -> trampoline 0x10789cbc (mp4 header parser region: dev-mode media tools)
  - **/testenv:** f_105eb9dc: locator module render via obj->vt\[+0x9c\], page field \[r3+356\]
  - **/sethostip:** f_100b9fac: permission gate 0x10550b24 else HTTP 403; delegates to setter 0x10551bfc
  - **/sonarctl:** f_100bc354: "flush" op on mod_zp: "flushing sonar tones"/"Flushed"
  - **/spotdbg:** f_100b8140: "spot: permission denied" gate; no-store response
  - **/snapshotspdiftap:** f_100bd5e4: "Internal SPDIF Tap Snapshotted. Tap must be uncompressed before use!"/"Feature not supported."
  - **/traceroute:** f_100d3ff4: exec /usr/bin/traceroute
  - **/ping:** f_100d3f88: exec (see /traceroute sibling; earlier finding /bin/ping -c 3)
  - **/ttm_helper:** f_100b9740: text/plain responder
  - **/networkmatrix:** f_105ea2f0: builds matrix record buffer (49-elem), responds 200
  - **/support/asyncsubmit:** f_105ea400: form {diagId,guid,flags,excludeFlags,type,coordinator,delay}; schedules diag submission; "already pending" conflict; "Unable to find player from UUID"
  - **/support/reportstatus:** f_105ea734: form {guid,uuid,success,controller}; updates submission status
  - **/support/directsubmit:** f_105e9b30: HTML "Diagnostic Submission to Sonos, Inc." w/ csrfToken form
  - **/support/aggregate:** f_105e9fb0: collects watchdog.dmesg, watchdog.log, button_triggered.xml, dropout_triggered.xml; "cleanup logs after diagnostic"; requires diag type
  - **/support/review:** f_105e9e60: XML review doc w/ /xml/review.xsl stylesheet
  - **/radiolog:** status-registry page {flag=2, handler=f_100b8ff8} radiolog.cxx
  - **/du-jffs:** status-registry exec page {flag=2, cmd="/usr/bin/du -a -d 5 -k -x /jffs"}
  - **/dsp/eqdata.txt:** serves app/debug/dsp/eqdata.txt + persistentEQ.xml (literal-adjacent, reference mechanism not table)
  - **/sonar-tone:** not in master table; .rodata-referenced near app/run/inverters + ZP_MODE_STANDALONE + variantDebuginfo: sonar variant-tone config path
  - **/debugfiles:** exec page flag=0xa: /bin/ls --full-time /jffs/app/debug /jffs/sys/debug /jffs/net/debug
  - **/customsd:** f_103429f4 (CSRF form "Add/update custom service descriptor": fields {sid(240-253\|255), name(blank erases), secureUri, pollInterval, authType in {UserId,Anonymous,DeviceLink,AppLink}, stringsVersion+stringsUri, presentationMapVersion+presentationMapUri, manifestVersion+manifestUri, containerType in {MService,SoundLab}, caps\[\] in {search,trFavorites,alFavorites,ucPlaylists,logging,playbackLogging,accountLogging,extendedMD,radioExtendedMD,playlistExtendedMD,disableAlarms,noMultiAccount,mediaUriActions,contextHeaders,deviceCerts,playerIds,contextReporting,userInfo,contentFiltering,manifest,authorizationHeader}}) full SMAPI SD capability set
- **flags_decode_attempt:** Static flag field ({name,flags,target} records, values 1,2,6,a,b,e,43,46,82) is NOT a page-type discriminator - all three page families (handler/exec/file) share the same values. Empirical groupings: 0x2 = bulk default; 0x82 = prefix-mount ({/api,/cloudqueue,/leds} + /opt/log/anacapa.dc.log; 0x80 = mount bit); 0xa = net/sys dumps (/date,/netstat,/uptime,/dmesg,/topology,/upnp + chronyd/udhcpc/ledmgrd/sonosledmgrd logs + arp + sysclock); 0xe = counters/verbose logs (/cpumon,/perfcounters,/showmacs,/showports + anacapa.log/netstartd/wpa_supplicant/fullstatus/netstat); 0xb = realtime link state (/enetports,/wireless,/showstp); 0x6 = wifi mib/dfs class (ath_rincon mibcc/nf/phyerr/primary,mdnsd.log,/playmode,/scanresults); 0x1 = identity (/VERSION,/zp,/ifconfig); 0x43/0x46 = ath_rincon status/dfs. HYPOTHESIS (unconfirmed): bitfield of support-bundle sections - the ZPSupportInfo generator (ap_status_handle_support_request, f_1076b5dc emits <ZPSupportInfo>...</ZPSupportInfo></ZPNetworkInfo>) pulls pages by flag bit. Dispatch path proven: f_105ebb20 -> f_105be5c8 match ctx -> lbz 0x110 matched-flag, accept-header text/plain shortcut, 200 + CONTENT-TYPE from a request-side helper, then per-page render. No static flag-bit comparison found in the walkers scanned; exact bit semantics remain undecoded.
- **bundle_file_manifest:** support-bundle table at 0x1109013c+ interleaves {name_ptr, flags_u32, cmd_or_path_ptr} records: shell-command sections {/date:/bin/date, /debugfiles:'ls --full-time /jffs/app/debug /jffs/sys/debug /jffs/net/debug', /df:/bin/df, /du-jffs, /free, /ifconfig, /lsmod, /mount, /netstat, /ntpsources, /ps, /route, /scanresults, /showmacs, /showports, /showstats, /showstp, /uptime} (flags 0x1/0x2/0x6/0xa/0xb/0xe gate conditional inclusion); file sections: /etc/resolv.conf, /VERSION, /jffs/{irconfig.txt,netstartd_prev.log,recovery.log,settings/{alarmclock.xml,areas.json,householdsettings.json,zones.json},shadow/stats,sys/log/{setup,setup_ok}/setup.{dmesg,log},upgrade_prev.log,upgrade_tmp_prev.log,watchdog.log,app/log/upgrade_mgr.log}, /opt/log/{anacapa.{alarm.job,chsrc.state,dc,ext.audio.action,gm.events,ht,hw.events,lechmere.event,log,musedebug,museevt,rc.upnp,snf,spotify.debug,spotify,sps,trueplay,vl},chronyd,dropbear,mdnsd,netstartd,sddpd,sonosledmgrd,udhcpc,wacd,wpa_supplicant}.log, /proc/ath_rincon{,_ath1}/{device,dfs,fullstatus,mibcc,nf,phyerr,primary,station,status}, /proc/driver/{accel,fpga/{circ,data},gravity-vector,ledctl/status,tdm/{regs,rxring,txring},temp-sensor}, /proc/{interrupts,net/{arp,snmp,sockstat,udp},slabinfo}, /tmp/memorylog{,.old}/log.*, /tmp/udhcpc_resp_mac_addr, /tmp/upgrade.log, /var/lib/chrony/sysclock_state
- **handler_table:** 56-entry {handler_fn, name, flags_u32} dispatch at 0x110908c4: /accounts, /activeZones, /ai_speech_enhance, /alarm, /analoglinein, /api(0x82), /audiocore, /backtrace, /button_triggered.xml, /cloud, /cloudqueue(0x82), /cpumon(0xe), /decoder, /device, /dmesg(0xa), /dnscache, /dropout_triggered.xml, /enetports(0xb), /ethportstatistics(0xa), /experiments, /hardwareevents, /hls, /htconfig, /leds(0x82), /libraries, /location_settings_update, /musicservices, /netsettings.json, /netsettings.txt, /opt/log/mdnsd.log, /perfcounters(0xe), /playmode, /policy, /radiolog, /regcert, /registration, /renderingcontrol, /root_cert_bundles, /rss, /settings/{effective,location,player}, /shares, /spdiftap, /ssidlist.txt, /ssl_client_cache, /syssettings, /temperature, /topology(0xa), /track_queue_summary, /tracks_summary, /trueplayinfo, /tvprocessor, /update, /upnp(0xa), /wireless(0xb), /zp(0x1); flag byte gates conditional visibility

:::


## `http_extra_endpoints`

Extra HTTP endpoints: the second sweep of web paths found in the binary beyond the main registration table, giving the fuller picture of the web surface.

::: details Technical details

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
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10efee2e, notes: /ssh/authorized_keys
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10e763d8, notes: /testenv
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10e76500, notes: /sonarctl
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10e765a4, notes: /spotifyzc
- **range:** "Session status 0x%x connected %d wantWrite %d wantRead %d" + "Current state: %d Current Status 0x%08x" + HTTP/1.1 206 partial-content support
- **decoded_handlers:**
  - **/setstring:** f_100b7cb4: POST application/x-www-form-urlencoded {key, value, csrfToken} -> "<h2>System Settings</h2>Setting changed" / "HTTP Error %d". CSRF-protected settings write (writes a raw key/value into the settings store).
  - **/removestring:** f_100b79e0: POST {key, csrfToken} -> "Setting removed" / "HTTP Error %d". CSRF-protected key delete.
  - **/sonarctl:** f_100bc354: param flush -> "flushing sonar tones" / "Flushed" (mod_zp). Sonar-test tone control.
  - **/mdnsannounce:** f_100c1230: POST {csrfToken} triggers mDNS ResendResponses ("Failed to trigger ResendResponses: %i" / "Success"). CSRF-protected.
  - **/ping:** f_100d3f88: execs /bin/ping -c 3 (host param from query). Shared literal block with /traceroute /pcap.
  - **/traceroute:** f_100d3ff4: execs /usr/bin/traceroute.
  - **/pcap:** f_100d416c: execs /bin/pcap - not (host %s and port %d); returns application/octet-stream as attachment; filename="trace.pcap". Live capture download.
  - **/jobs:** f_105523e8: POST {job, modjob?}: "Requesting \"%s\" job run" -> "Job \"%s\" scheduled" or "Please use a valid job shortname or index". Schedules timed-job registry entries on demand.
  - **/reboot:** f_105e92e0: minimal confirm page then reboot.
  - **/reset:** f_105e935c: minimal confirm page then factory reset.
  - **/sethostip:** f_100b9fac: HTML form page; sets the host IP override.
  - **/nslookup:** f_100b96d0: text/plain output; DNS lookup helper.
  - **/forcegtkrekey:** f_100b9640 ("Forced GTK rekey" / "Forbidden") auth-gated group-key rotation trigger.
  - **/advconfig:** f_105e8444 (+/advconfig.htm): advanced config form; fields {FirstZP,PriorityBridge} + csrfToken POST.
  - **/audio_tap:** f_100becc4 (params {tap,timeout,header}; source names {as-srcin-chsnk0,codecout,hta,irdecoder,linein,mixergm,mixersat,tv_}; "AudioTap: permission denied") gated raw-audio tap selector.
  - **/cloudqueuepoll:** f_100b8260 (flag 0x400): application/json {timeoutpaused,timeoutplaying} + %zu counts; cloud-queue poll control.
  - **/customsd:** f_103429f4 (+.htm): custom service-descriptor upload form (dp_impl.cxx).
  - **/device_account:** f_1065bd70 (flag 0x100): device-account endpoint; "Too Many Unlocks" rate limit; x-rincon-signature header.
  - **/devmode:** f_105e8d90: dev-mode toggle page; references /tmp/udhcpc_resp_mac_addr.
  - **/diaglevel /logger /diagmsg:** f_105e93d8 shared handler: minimal `></html>` diag-control pages.
  - **/dolby_config:** f_100be454: application/json Dolby config body.
  - **/downloadspdiftap:** f_100b9ed0: octet-stream download of %s/%s tap files; "Feature not supported." guard; spdiftap.compressed.
  - **/dsp:** f_100ba73c: serves /dsp/eqdata.txt and DSP debug files; htdocs_locked gate.
  - **/fcs:** f_105eba60: FCS (factory-config-service) page; accept/content-type only.
  - **/getDSP:** f_100bd9fc: returns text/xml <root>…</root> incl {ZPExpirationTime,ZPGroupExpirationTime,ZPLocalSettingsFile,sonos-dspid}.
  - **/putDSP:** f_100bb63c: accepts text/xml; charset=UTF-8 DSP data upload.
  - **/getrs /notify:** f_105e82a8 / f_105e82c8: GENA notify plumbing {nts,seq,sid,upnp:event,upnp:propchange}.
  - **/indexrepl:** f_100b8a10 (flag 0x230101): index replication proxy: params {bytes=,id=} + headers {x-rincon-content-version,x-rincon-last-update-device,x-rincon-range}; "queueing album art request %s %u %u %u" (mod_zp_aa).
  - **/info:** f_100c11e4: POST {csrfToken} → ResendResponses trigger (same fn family as /mdnsannounce).
  - **/mfgunlock:** f_10675234 (flag 0x100): manufacturing unlock: confirm= param; "refresh update info in %us" (updsched); Success page.
  - **/msprox:** f_100b88d0: music-service proxy: params {bytes=,id=,uuid} + rincon replication headers {x-rincon-content-version,x-rincon-last-update-device,x-rincon-range}.
  - **/mtmhhsetup:** f_105ec758 (flag 0x100): application/json MTM household-setup body.
  - **/musedebug:** f_100ba010: muse_debug page; <pre> dump.
  - **/raw:** f_105ea98c (flag 0x10000000): execs /bin/dmesg -s {131072,32768}; also serves /button_triggered,/dropout_triggered raw dumps.
  - **/rdmbuttonfwd:** f_100b9e58 (flag 0x100): retail-demo button forward; "invalid method" guard.
  - **/rdmhhsetup:** f_105ebeb4 (flag 0x100): Retail Display HHID setup; X-Sonos-Api-Key required; "...setup failed%s".
  - **/removeDSPDebugFiles:** f_100bc518: deletes {dsp_preset.xml,dsp_preset_default.xml,dsp_preset_satellite.xml,dsp_system_default.bin,persistentEQ.xml}.
  - **/save_eq_presets:** f_100ba144: writes preset via %s.tmp staging file.
  - **/setPersistentEQ:** f_100ba218: persistent EQ write via %s.tmp staging.
  - **/snapshotspdiftap:** f_100bd5e4: "Internal SPDIF Tap Snapshotted. Tap must be uncompressed before use!" / "Feature not supported."
  - **/spotdbg:** f_100b8140: spotify debug control {timeoutpaused,timeoutplaying}; "spot: permission denied".
  - **/spotifyzc:** f_1020f8c4: Spotify Connect zeroconf relay: POST {method,action,path,userAgent} → {esdkVersion,responseCode,spotifyzc}; "Invalid ZeroConf request %s" / SpotZc_Failure. Only getInfo served to GC per earlier note.
  - **/spotresetnts:** f_100b7fd8: POST {csrfToken} → reset spotify NTS; "spot: permission denied" / Success.
  - **/ssh/fingerprints:** f_105e9578 (flag 0x101): "Sending device_description.xml to %s (cv=%d)"; {association,Transfer-Encoding: chunked,text/xml}. SSH fingerprint/device-desc association service.
  - **/support/aggregate:** f_105e9fb0 (flag 0x10000000) (params {type,include_crs}) support-bundle aggregation.
  - **/support/asyncsubmit:** f_105ea400 (flag 0x30002): async diagnostic submission; body fields {coordinator,delay,diagId,diagType,excludeFlags,flags,guid} each with "Unable to extract X" error; "Invalid content type","Unable to read request body".
  - **/support/directsubmit:** f_105e9b30: "Diagnostic Submission to Sonos, Inc." <h2>%s</h2> / HTTP Error %d.
  - **/support/networkmatrix:** f_105ea2f0 (flag 0x30000): network-matrix diagnostic collection.
  - **/support/reportstatus:** f_105ea734 (flag 0x102): report-status poll.
  - **/support/review:** f_105e9e60: support-bundle review page.
  - **/testenv:** f_105eb9dc: environment switcher (PROD/PERF/STAGE/TEST/INT + OnlineUpdateBaseURL override).
  - **/testpoint:** f_100b85ec (flag 0x400): internal testpoint.
  - **/tools:** f_100d4060 (+.htm): tools page.
  - **/ttm_helper:** f_100b9740: trueplay/tone-test helper.
  - **/unlock:** f_10675244 (+.htm, flag 0x100): unlock flow w/ rate limit.
  - **/websocket/api:** f_100bb8ac (flag 0x200): websocket upgrade endpoint for the muse API.
  - **/device_account_note:** aux 0x100 = POST-ish routes (unlock family, rdm*, device_account); 0x200 = websocket; 0x400 = internal; 0x30000/0x30002 = support-submit variants; 0x10000000 = raw/streaming.
- **csrf_note:** All mutating form endpoints carry a csrfToken form field (setstring/removestring/mdnsannounce + the form posts) - the HTTP layer enforces CSRF on writes while reads are open.
- **todo:** `Established: the second-sweep endpoint inventory, decoded handlers (e.g. /setstring CSRF flow), and the CSRF-on-writes policy are documented.`, `Still unknown: the paths list is a rodata audit - handlers for most listed paths are not decoded, only the string evidence is catalogued.`, `Next step: decode the remaining listed endpoints' handlers the way /setstring was done.`

:::


## `diagnostic_manifest`

The diagnostics manifest: the packing list of what a diagnostics bundle contains, covering which logs, states, and files go into a support submission.

::: details Technical details

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
- **exec_backend:** etc/diagprocessd (generated from configs/arch/limelight.toml): FIFO menu (mkfifo /tmp/diagstdin + /tmp/diagstdout, read loop dispatching numeric commands: 0=date, 1=ls -l debug dirs, 2=df, 3=du jffs top100, 4=free, 5=ifconfig, 6=lsmod, 7=mount, 8=netstat -an, 9=ps, 10=route -n, 11-14=brctl showmacs/showports/showstats/showstp br0, 15=uptime, 16=dmesg -s 32768, 17=/wifi/athconfig scangetresults ath0, 18=chronyc -n sources -v, *=NA. The support-bundle shell_cmds (/df,/free,/ps,/lsmod,/netstat,/ntpsources,/showmacs,...) resolve THROUGH this daemon) anacapad sends the command index over the FIFO rather than exec'ing directly (privilege separation: diagprocessd runs as root).

:::


## `diagnostics`

The diagnostics machinery: the overall system for gathering health data, covering the /status pages, log collection, and support-bundle assembly. It's what's behind 'submit diagnostics' and the built-in status website.

::: details Technical details

- **files:** `/oc/zone/common/diag_progress.cxx`, `/oc/zone/common/diagnostics.cxx`

:::


## `proprietary_headers`

The proprietary HTTP headers: the Sonos-specific request and response headers the firmware recognizes, which are private extensions riding on ordinary HTTP.

::: details Technical details

- **outbound:** `X-Sonos-Playback-Id: %.*s`, `X-Sonos-SWGen: %u`, `X-RINCON-BOOTSEQ: %s`, `X-RINCON-VARIANT: %u`, `X-Sonos-Household-Id`, `X-Sonos-Corr-Id`, `x-sonos-target-udn`, `x-sonos-upnp-loopback-token`, `x-rincon-content-format (repset)`, `x-rincon-roomicon:generic`
- **hls_vocabulary:** `#EXT-X-VERSION`, `#EXT-X-TARGETDURATION`, `#EXT-X-MEDIA-SEQUENCE`, `#EXT-X-PLAYLIST-TYPE`, `#EXT-X-INDEPENDENT-SEGMENTS`, `#EXT-X-KEY:`, `#EXT-X-SESSION-KEY:`, `#EXT-X-MAP:`, `#EXT-X-DISCONTINUITY`, `#EXT-X-BYTERANGE`, `#EXT-X-ENDLIST`, `#EXT-X-MEDIA`, `#EXT-X-STREAM-INF`, `#EXT-X-PROGRAM-DATE-TIME`
- **hls_validation:** 'attempted to store an invalid rendition that doesn't begin with #EXT-X-MEDIA' (rendition-group enforcement)
- **mime_vocabulary:** `application/x-mpegurl`, `audio/x-mpegurl`, `audio/x-scpls`, `audio/x-sonos-recent`, `audio/x-spotify`, `audio/x-spotify-ogg`, `audio/x-aac`, `audio/x-aiff`, `audio/x-m4a`, `audio/x-ms-wma`, `audio/x-wav`
- **full_header_census:**
  - **method:** whole-.rodata scan for X-Sonos-*/X-RINCON-* literals; addresses are literal sites
  - **headers:**
    - **X-RINCON-BOOTSEQ:** 0x10eea2f8 (SSDP/discovery signature)
    - **X-RINCON-CONTENT-FORMAT:** 0x10efd058 (repset content-format index)
    - **X-RINCON-CONTENT-VERSION:** 0x10ed4510 (content sync)
    - **X-RINCON-HOUSEHOLD:** 0x10eea2e4
    - **X-RINCON-LAST-UPDATE-DEVICE:** 0x10ed4510
    - **X-RINCON-PROXY:** 0x10eea30c
    - **X-RINCON-RANGE:** 0x10ed4510
    - **X-RINCON-REASON:** 0x10eea378
    - **X-RINCON-SIGNATURE:** 0x10efd0a8 (repset sig)
    - **X-RINCON-VARIANT:** 0x10eea344
    - **X-Sonos-Accept-Language:** 0x10ec1f20 region (SMaPI)
    - **X-Sonos-Api-Key:** 0x10eb09b0
    - **X-Sonos-Context-TimeZone:** 0x10ec1f44
    - **X-Sonos-Corr-Id:** 0x10e74534
    - **X-Sonos-Denylisted:** 0x10ef241c
    - **X-Sonos-Device-Id:** 0x10eb9474
    - **X-Sonos-DeviceCert:** 0x10ec1f20 (SMaPI deviceCerts)
    - **X-Sonos-Diagnostics-Api-Key:** 0x10f08334
    - **X-Sonos-ErrorType:** 0x10ee6d7c (NEW: error-classification header)
    - **X-Sonos-Firmware:** 0x10ee8250
    - **X-Sonos-GroupAttribute:** 0x10ec221c (cloudqueue)
    - **X-Sonos-GroupCapability:** 0x10ec2238 (cloudqueue)
    - **X-Sonos-Household-Id:** 0x10f0ba54
    - **X-Sonos-Id-Hash:** 0x10ee8290 (NEW: sibling of X-Sonos-Firmware telemetry)
    - **X-Sonos-Latency:** 0x10f2c874
    - **X-Sonos-LatestSWGen:** 0x10f13708
    - **X-Sonos-Mac:** 0x10ef4b6c
    - **X-Sonos-MAID:** 0x10ec1f60
    - **X-Sonos-MessageType:** 0x10f03b4c (octet-stream POST)
    - **X-Sonos-MS-Sig:** 0x10ec1ee0 (music-service signature)
    - **X-Sonos-Muse-Api:** 0x10ee8250 (NEW: muse API version header)
    - **X-Sonos-MuseHouseholdId:** 0x10edef34 (NEW)
    - **X-Sonos-Playback-Id:** 0x10eb9460
    - **X-Sonos-Serial:** 0x10ef4bb8
    - **X-Sonos-SWGen:** 0x10ec280c
    - **X-Sonos-Type:** 0x10ec78b0
    - **X-Sonos-Udn:** 0x10ef64d4 (also Lechmere tunnel pseudo-header)
    - **X-Sonos-User-Id:** 0x10ebf930
    - **X-Sonos-User-Role:** 0x10ed96a4
    - **X-Sonos-UserId:** 0x10ef21e0
    - **X-Sonos-VClockCloud:** 0x10edef34 (NEW: vector-clock cloud sync)
  - **notes:** Case variants (X-Sonos-MuseHouseholdId vs -Muse-Household-Id) coexist as distinct literals.

:::


## `http_chunked_strictness`

How strictly the HTTP layer enforces chunked-transfer rules: the parsing strictness the player's web code applies to streamed request bodies.

::: details Technical details

- **rules:** `Reject response when 'chunked' is not the last Transfer-Encoding`, `Ignore duplicate 'chunked' decoder`, `Suppress chunked TE on HTTP version >= 2`, `'Chunky upload is not supported by HTTP 1.0'`, `Missing chunk/close/size -> assume close signals end`, `chunk hex-length max bound + hex-digit validation`, `'Chunk callback failed' / 'cf_body_send last CHUNK'`, `trailers accepted: 'added last chunk with trailers from client'`

:::


## `http_range`

HTTP range support: byte-range request handling for serving and requesting partial content, which is the machinery behind seeking inside remote files.

::: details Technical details

- **grammar:** Range: bytes=%s + =%d-%d + =%d- ; Content-Range: bytes {0-%lld/%lld, %s%lld/%lld, %s/%lld, %llu-%llu/%llu}: 64-bit
- **status_line:** 0x10ee6bcc 'HTTP/1.0 206' - range responses are emitted on the HTTP/1.0 status line (HTTP/1.1 variant not separately templated)

:::


## `httpcache_manager`

The HTTP cache manager: the component owning the web-content cache, covering what's stored, eviction, and freshness policies.

::: details Technical details

- **file:** httpcachemgr/httpcaches.json: httpcache_manager.cxx
- **protocol:** {cacheHashes, hashLocal, hashRemote} + Force-cleared cache + Invalidated local cache + Invalidating remote caches: distributed HTTP-cache invalidation across zones w/ hash comparison

:::


## `csrf_protection`

The CSRF protection on the web forms: every browser-facing POST endpoint embeds a hidden token the request must echo back, which stops a malicious web page from driving your speaker while you browse.

::: details Technical details

- **name:** CSRF tokens on browser-facing POST endpoints
- **description:** Every browser-form POST endpoint embeds a hidden csrfToken field: /advconfig, /customsd, /devmode, /fcs, /logger, /mdnsannounce, /nslookup, /ping, /removestring, /setstring, /spotresetnts, /ssh/authorized_keys, /support/directsubmit, /testenv, /traceroute. Token generation/validation mechanics not decoded.
- **form_endpoints:** `/advconfig`, `/customsd`, `/devmode`, `/fcs`, `/logger`, `/mdnsannounce`, `/nslookup`, `/ping`, `/removestring`, `/setstring`, `/spotresetnts`, `/ssh/authorized_keys`, `/support/directsubmit`, `/testenv`, `/traceroute`
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10e730f0, notes: csrfToken
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10efee26, notes: action="/ssh/authorized_keys"

:::


## `device_description_variants`

The device-description variants: the different self-description documents the player can serve, covering the normal player, a group-level variant, and a satellite variant, each presenting the unit's role differently to the outside.

::: details Technical details

- **description:** \["/xml/device_description.xml", "/xml/group_description.xml", "/xml/satellite_device.xml", "/xml/device_description_no_ai.xml"\]
- **todo:** `Established: the four device-description XML variant paths are listed.`, `Still unknown: the selection rule - which conditions serve which variant - is not decoded.`, `Next step: trace the variant-selection logic in the description endpoint.`

:::


## `albumart_proxy`

The album-art proxy: it serves artwork through the player's own web server so apps load covers from the speaker rather than fetching them remotely each time. This is why artwork in the app loads fast and keeps working offline.

::: details Technical details

- **name:** /getaa album-art proxy
- **role:** local HTTP album-art endpoint: serves cached/proxied art to controllers; URI forms /getaa?u=<url>&v=<ver>, /getaa?m=1&u=<url> and /getaa?s=1&u=<url> (m=/s= size variants), plus upstream '?albumArt=true' fetches; art cached as <dir>/AlbumArt_{GUID}_Large.jpg
- **params:** u= source URL (validated: 'AlbumArtURI longer than expected.'), v= version/etag-style param, m=1 / s=1 select medium/small variants; '%s?albumArt=true' marks upstream art requests
- **flags:** enableSecureAlbumArt feature flag gates a secured art fetch path; AlbumArtistDisplayOption + GetAlbumArtistDisplayOption control whether album-artist metadata is displayed (microsoft:artistAlbumArtist DIDL extension supported in sort/filter caps)
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10e76390, notes: /getaa route literal
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10e8937c, notes: /getaa?u=%s&v=%u form
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10f0df90, notes: /getaa?m=1&u=%s variant
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10f0f3c4, notes: /getaa?s=1&u=%s variant
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10ecd458, notes: AlbumArt_{GUID}_Large.jpg cache filename
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10f9c1f0, notes: enableSecureAlbumArt flag
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x100b8c2c, notes: /getaa route handler: queue + singleton create
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x100c34fc, notes: request processor: m/s/vli/u param parse + u-terminator
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x100c3714, notes: Cache-Control: private, max-age=15780000 response header
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10299e5c, notes: worker thread: 32-slot ring + TCP_INFO abort check
- **request_grammar:** GET /getaa?{m\|s\|vli}...&u=<url>\[&v=<n>\] (query parsed by f_10c3b72c: param names <=32 chars, values <=1024 chars, '&'-separated. Recognized params (compared in order m,s,vli,u via strcmp at 0x100c35cc-0x100c3618): 'm' medium-variant flag, 's' small-variant flag, 'vli' virtual-line-in image flag, 'u' upstream image URL. IMPORTANT: 'u' is the TERMINATOR) when encountered, parsing stops and the request proceeds; any params AFTER u= are never read. 'v' is NOT parsed by the handler at all: it appears in emitted URIs (/getaa?u=%s&v=%u) purely as a client-side cache-buster/etag. Unknown params are skipped silently
- **response:** image bytes streamed back via vliStreamImage (f_101867c8), logged as 'invoking vliStreamImage on %s %u %u %u %s' and 'Fetching album art for %s: %s'. Response header: Cache-Control: private, max-age=15780000 (~6 months). Failure path: 'vliStreamImage failed on %s %u %u %u %s' then status 0x194 sent via f_100b4614: upstream fetch failures surface as 404
- **async_model:** handler f_100b8c2c is async: logs 'queueing album art request %s %u %u %u', lazily creates the mod_zp_aa server singleton (new 0x428a0, ctor f_10299a48) at 0x11096c98, enqueues the request into a 32-slot ring of 0x2134-byte entries (f_10299c34) and returns. Worker thread f_10299e5c blocks on a condvar, pops slots, probes the client socket with getsockopt(TCP_INFO) and takes an abort path (f_100c34fc slot-discard) when the peer is already in CLOSE/CLOSE_WAIT/CLOSING: clients that give up early are never served
- **param_semantics:** m/s/vli select the image path BEFORE the request object is built: no flags -> default fetch (u URL streamed direct); m -> f_100c2f94 variant; s -> f_100c31c8 variant; vli -> direct vli-image fetch f_100be6ec. The three u16 fields carried on the request (+0x180/+0x182/+0x184) ride through to the vliStreamImage call - request dimensions/ids, not user params
- **arturi_cap:** albumArtURI emission capped at 1024 bytes (buffer obj+0x54, len at +0x458, f_10381528); overflow logs 'AlbumArtURI longer than expected.' in the favorites log domain

:::


## `alert_engine`

The alert and notification audio player: it plays short sounds like chimes, prompts, and doorbells with priority rules that decide whether an alert may interrupt whatever's playing. This is why a doorbell chime can be heard over music without stopping the song, because priorities decide who wins the speaker at any moment.

::: details Technical details

- **name:** alert/chime interrupt engine
- **description:** alertContent player with priority policies ('Cannot interrupt current clip due to priority policies', JOIN_CHIME_UNAVAILABLE, ALEXA_ALERT); audioclipmanager + /duck /unduck endpoints; surfaces via the audioClip muse resource and the R_AUDIO_CLIP_* codes.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10eaacd4, notes: alertContent
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10ec76ac, notes: JOIN_CHIME_UNAVAILABLE
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10ec0814, notes: ALEXA_ALERT
- **todo:** `Established: the alert/chime engine with priority policies, audioclipmanager, and /duck//unduck endpoints is identified.`, `Still unknown: the priority-policy evaluation order and the duck/unduck endpoint handler internals are untraced.`, `Next step: decode the policy table and the duck endpoint's flag semantics.`

:::

