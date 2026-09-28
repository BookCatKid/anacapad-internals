# Payload formats

Opaque payload/field grammars recovered from sscanf/printf templates and parser functions.

## `SonosAvtStateFile` `strong`

AVT persisted-state vocabulary: contiguous name pool at 0x10eb3330-0x10eb3410 used by the AVT save/restore machinery ("/avt.txt" persistence; "Restoring AVT"/"Restored AVT from file" log lines adjacent). Field names are reached via base+offset addressing - the save/restore worker serializes these keys.

```
keyed field names {CurrentGroupID, OtherMembers, ..., SleepTimerState, AlarmState, StreamRestartState, SharedQueueTrackList, PrivateQueueTrackList, CurrentVLIState, CurrentAVTTrackList, CurrentSourceState, ResumePlayback, NewCoordinator, RejoinGroup, ClearSource, RestartSink, ...} serialized to /avt.txt
```

Fields: `order_in_f_102f9c00`, `order_in_f_102f9e9c`, `note`

Used by: AVTransport save/restore on zone lifecycle (not a SOAP-visible payload)

Field-to-offset mapping and value formats per key are not yet decoded - requires the restore worker loop (loads base once, emits/consumes fields by offset).

- **workers:**
  - **read_a:** 0x102f9c00
  - **read_b:** 0x102f9e9c
  - **xml_layer_a:** 0x106f1780
  - **xml_layer_b:** 0x106f1b9c
  - **note:** all four use v\[+0x1c\] named-record lookups + f_1056157c unpack; the WRITE/serialize counterpart not yet located

<details><summary>Evidence (1)</summary>

- @ 0x10eb3330 — contiguous name pool; no direct code xrefs - reached via base+offset from AVT restore worker; "/avt.txt" and restore-log strings at 0x10eb2xxx pool above

</details>

## `SonosRcChannel` `confirmed`

RenderingControl channel token compared verbatim by impl strcmp chains: 'Master', 'LF', 'RF' universally; 'FocusMode' accepted additionally by SetMute only (maps to impl byte +0x7f4). Unknown tokens -> impl rc 402.

```
case-sensitive ASCII exact match
```

Used by: RenderingControl.GetMute; RenderingControl.SetMute (adds FocusMode); RenderingControl.GetVolume (forwarded)

- **accepted_values:** `Master`, `LF`, `RF`, `FocusMode (SetMute only)`
- **parser:** per-action strcmp chains in impl fns (e.g. f_100d71e0, f_100d99b0)

<details><summary>Evidence (2)</summary>

- fn 0x100d71e0 — GetMute: 3-channel map
- fn 0x100d99b0 — SetMute: 4-channel map incl. FocusMode->+0x7f4

</details>

## `SonosRcInstance` `confirmed`

RenderingControl InstanceID convention: impls that check it accept only 0 and return 702 for nonzero (NOT 718 like AVTransport). Several impls execute the compare but leave it dead (SetVolume/worker) or never read the arg (GetTreble) - the check is inconsistent across actions.

```
type-tag-4 integer record
```

Used by: all RenderingControl actions (inconsistent enforcement)

- **accepted_values:** `0 (where checked)`

<details><summary>Evidence (2)</summary>

- fn 0x100e43b4 — 702 shim
- fn 0x100dcb00 @ 0x100dcb08 — dead cmpwi - flag test overwrites cr7

</details>

## `SonosSeekTime` `confirmed`

Sonos time-position operand produced by f_102ab830: an optional leading '-' sets a separate sign flag, then sscanf('%hhu:%hhu:%hhu') must convert exactly three decimal fields. Each %hhu applies strtoul semantics per component - leading whitespace skipped, own optional +/- sign allowed, result truncated to u8 so >255 wraps mod 256. The ':' separators match literally (no whitespace before them); trailing characters after the third field are ignored. Output is a {seconds_word, fraction_word=0} pair (printed as '%lld.%06lld') plus the sign byte; a leading '-' negates only the seconds word. Total range 0..934575 s (255:255:255); there is no upper-bound check.

```
[-]H:M:S where each component is a scanf %hhu (u8, mod-256 wrap); exactly three required; trailing junk ignored
```

Used by: AVTransport.Seek (Target for REL_TIME/TIME_DELTA, both indexed and stream modes)

Action-specific restrictions layer on top: e.g. Seek indexed mode rejects a set sign flag unless Unit==TIME_DELTA, and treats a zero-magnitude pair as a silent no-op success. Stream mode performs no sign or zero gating.

<details><summary>Evidence (1)</summary>

- fn 0x102ab830 @ 0x102ab830 — sign skip via cmplwi '-' + r3+=cr4.eq; sscanf fmt at 0x10eafc7c; secs=(h*60+m)*60+s; neg on cr4.eq; stw {secs,0} pair + sign byte

</details>

## `SonosTrackOrdinal` `confirmed`

Sonos track-ordinal operand: strtol(text,NULL,10) on the raw string - base 10, leading whitespace and +/- accepted, endptr NULL so trailing junk is silently ignored ('5junk' -> 5), saturates at LONG_MIN/MAX. Acceptance range is validated on the UNMASKED strtol result as (value-1) <= 0xFFFD unsigned, i.e. exactly 1..65534; a separate u16 truncation (value & 0xffff) sizes the downstream record field and cannot wrap an out-of-range input into validity.

```
decimal integer, strtol base 10; accepted lexical range 1..65534
```

Used by: AVTransport.Seek (Target for TRACK_NR, indexed mode)

The mask-before-validate ordering looks alarming but is inert: the record field is computed pre-check, the check uses the raw value, and a rejected record is destroyed unsubmitted.

<details><summary>Evidence (1)</summary>

- fn 0x102b9088 @ 0x102b9350 — strtol(r26,0,10); rlwinm &0xffff at 0x102b938c sizes the record field; addi r30,-1 + cmplwi 0xFFFD at 0x102b9394-0x102b939c validates the raw value

</details>

## `device_description` `confirmed`

UPnP root device-description htdocs template + 35 substitution tokens; advertises 16 SCPD service descriptions

- **tokens:** #UUID# #HOST# #SW_VERSION# #SW_GENERATION# #SW_MINCOMPATVER# #SW_LEGACYCOMPATVER# — template substitution into the root descriptor
- **note:** device_description.xml (htdocs) IS the served #TOKEN# template — substitutes 35 tokens (#UUID#,#HOST#,#MODEL#,#SW_VERSION#,#SW_GENERATION#,#SW_MINCOMPATVER#,#SW_LEGACYCOMPATVER#,#MAC_ADDRESS#,#SERIAL_NUM#,#API_VERSION#,#MIN_API_VERSION#,#DISPLAY_VERSION#,#EXTRA_VERSION#,#NS_VERSION#,#HW_VERSION#,#ZONETYPE#,#CD_NAMESPACE#,#MEDIASERVER_NAMESPACE#,#VENDOR_NAME#,#DISPLAY_NAME#,#VARIANT#,#RETAIL_MODE#,#HHSSL_PORT#,#SSL_PORT#,#MUSE_API_VERSIONS#,#NODE_PROTO_VERSIONS#,#HTA_FRAME_VERSIONS#,#TRUEPLAY_SDK_VERSIONS#,#AMP_ONTIME#,#INT_SPEAKER_SIZE#,#MEMORY#,#FLASH#,#QPLAY_SUPPORT#,#API_VERSION#). It DOES advertise SCPDs — 16 <SCPDURL>/xml/<Svc>1.xml elements. AudioIn is NOT in the advertised serviceList (consistent with its reject-all stub). ContentDirectory serviceType is the #CD_NAMESPACE# runtime token (upnp-org vs sonos-com CD namespace substituted per build).
- **advertised_services:** 16: AlarmClock,MusicServices,DeviceProperties,SystemProperties,ZoneGroupTopology,GroupManagement,HTControl,QPlay,ContentDirectory(#CD_NAMESPACE#),ConnectionManager(MS),RenderingControl,ConnectionManager(MR),AVTransport,Queue(sonos-com),GroupRenderingControl,VirtualLineIn — AudioIn absent (internal stub)

<details><summary>Evidence (1)</summary>

- firmware — rodata template literals

</details>

## `didl_cdudn_desc` `strong`

DIDL desc element: <desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/"> — ContentDirectory UDN descriptor (0x10eb0c4c)

<details><summary>Evidence (1)</summary>

- @ 0x10eb0c4c — literal

</details>

## `didl_lite` `confirmed`

DIDL-Lite metadata envelope + full object.* class/protocolInfo/search-criteria grammar + r: rinconnetworks extension ns

- **root:** <DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"> — r: is the Sonos extension ns
- **classes:** `object.item`, `object.item.playlistItem`, `object.item.sonos-favorite`, `object.item.audioItem.musicTrack{,.recentShow}`, `object.item.audioItem.audioBroadcast{,.live}`, `object.item.audioItem.linein{,.homeTheater,.airplay,.bluetooth}`, `object.item.audioItem.{podcast,show,audioBook.chapter}`, `object.container.{album.musicAlbum{,.compilation},playlistContainer{,.sameArtist,.tracklist},albumlist,person.musicArtist,person.composer,genre.musicGenre,podcast,sonos-searchTypes}`
- **protocolInfo:** `x-rincon-{playlist,queue}:*:*:*`, `x-sonos-vli:*:audio:*`, `file:*:audio/mpegurl:*`, `spdif`, `http-get:*`
- **search_grammar:** SearchCriteria supports: derivedfrom + @refID exists + = + and; '+'-prefixed sort keys; projections 'dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber'; microsoft:artistAlbumArtist (WMP interop)
- **dom_keys:** \|DIDL-Lite\|item\|container\|res\|vli element keys; 'truncated DIDL metadata' bounds

<details><summary>Evidence (1)</summary>

- firmware — DIDL-Lite template + object.* class vocabulary + protocolInfo literals + search-criteria predicates in rodata

</details>

## `didl_lite_header` `confirmed`

DIDL-Lite document header (verbatim literal at 0x10ee8958): <DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">

<details><summary>Evidence (1)</summary>

- @ 0x10ee8958 — literal

</details>

## `didl_res_protocolinfo` `strong`

DIDL res protocolInfo emitters by scheme: x-rincon-playlist:*:*:* (0x10e89314), x-rincon-queue:*:*:* (0x10ebb874), x-rincon-mp3radio:*:*:* (0x10ec11a8), x-sonosapi-show:*:*:* (0x10ec11d8), file:*:audio/mpegurl:* (0x10ed33dc)

<details><summary>Evidence (1)</summary>

- @ 0x10e89314 — literal family

</details>

## `gena_event_envelope` `confirmed`

GENA event wire envelope — <e:propertyset>/<e:property> var elements + NT/NTS/SEQ/SID + X-RINCON-BOOTSEQ/VARIANT headers

- **grammar:** <e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><VAR>val</VAR></e:property>...</e:propertyset>
- **note:** GENA event body: DOM node 'urn:schemas-upnp-org:event-1-0\|propertyset'; each changed var emitted as <e:property> wrapper via f_10676a44
- **headers:** NT: upnp:event \| NTS: upnp:propchange \| SEQ: %d \| Sonos extensions X-RINCON-BOOTSEQ:%s X-RINCON-VARIANT:%u; 403 on denial; version-conditional eventing ('DiscoveredZP using %s eventing')

<details><summary>Evidence (1)</summary>

- fn f_10676a44 @ 0x10676a44 — e:propertyset/e:property literals + ns key 'urn:schemas-upnp-org:event-1-0\|propertyset' at rodata 0x10eec165; NT/NTS/SEQ/X-RINCON headers in upnpeventing_sender.cxx

</details>

## `group_effective_values_blob` `strong`

Version-11 sibling section of sonos_signed_blob_json: ',\n{"magic":"(=^+^=)","version":11}\]' terminator emitted/parsed by the same group.cxx effective-values family

<details><summary>Evidence (1)</summary>

- @ 0x10bf8058 — literal at 0x10fb035c; second site 0x10bf8a94

</details>

## `itunes_plist_importer` `strong`

iTunes-library XML plist import vocabulary (rodata key table @0x11091a24 cluster)

Apple plist-XML grammar keys; importer maps iTunes XML library (Tracks/Playlists/Master structure) into the content index. Adjacent to selthrd.RIRDecoder/RHWEvtHandlerZP thread descriptors

- **keys:** `Audiobooks`, `Location`, `Master`, `Movies`, `Music`, `Name`, `Playlist ID`, `Playlist Items`, `Playlist Persistent ID`, `Playlists`, `TV Shows`, `Track ID`, `Tracks`, `array`, `dict`, `integer`, `key`, `plist`, `string`, `true`

<details><summary>Evidence (1)</summary>

- firmware — rodata plist-key table 0x11091a24; Master/Track ID/Playlist Persistent ID/Audiobooks literal keys

</details>

## `lastchange_templates` `confirmed`

the three LastChange/Event doc root templates + per-service xmlns

- **templates:**
  - **AVTransport:** <Event xmlns="urn:schemas-upnp-org:metadata-1-0/AVT/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/"> @0x10eb29e8 — uses r: extension ns
  - **RenderingControl:** <Event xmlns="urn:schemas-upnp-org:metadata-1-0/RCS/"> @0x10e88928 — standard upnp-org ns, no r:
  - **Queue:** <Event xmlns="urn:schemas-sonos-com:metadata-1-0/Queue/"> @0x10ed1c6c — schemas-sonos-com (proprietary, NOT upnp-org)
- **model:** <Event> root + <VarName val="..."/> attribute-form var elements inside (LastChange/Event doc); only these 3 services emit LastChange
- **var_sets:**
  - **RenderingControl:** Volume{Master,LF,RF}, Mute{Master,LF,RF}, Bass, Treble, Loudness{Master}, OutputFixed, SpeakerSize, SubGain, SubCrossover, SubPolarity, SubEnabled, DialogLevel, SpeechEnhanceEnabled, SupportsMaxDialogLevel, SurroundLevel, MusicSurroundLevel, AudioDelay, AudioDelay{Left,Right}Rear, NightMode, SurroundEnabled, SurroundMode, HeightChannelLevel, SonarEnabled, SonarCalibrationAvailable, PresetNameList='FactoryDefaults'; <VolumeScale>%u</VolumeScale> elem; per-channel Master/LF/RF for stereo pairs
  - **AVTransport:** inside <InstanceID val='0'>: TransportState, CurrentPlayMode, CurrentCrossfadeMode, NumberOfTracks, CurrentTrack, CurrentSection, CurrentTrack{URI,Duration,MetaData}, PlaybackStorageMedium, AVTransportURI{,MetaData}, NextAVTransportURI{,MetaData}, CurrentTransportActions, TransportStatus, TransportError{Description,URI,HttpCode,HttpHeaders}; fixed NOT_IMPLEMENTED: TransportPlaySpeed, CurrentMediaDuration, RecordStorageMedium, PossibleRecordStorageMedia, RecordMediumWriteStatus, CurrentRecordQualityMode, PossibleRecordQualityModes; PossiblePlaybackStorageMedia='NONE, NETWORK'
  - **Queue:** QueueOwnerID %s, QueueID %.20s, UpdateID %u, Curated (truncated) — QueueID capped 20 chars
  - **note:** <LastChange>%s</LastChange> — the e:property value is the escaped XML doc

<details><summary>Evidence (1)</summary>

- firmware — three <Event> template open-tags in rodata w/ distinct xmlns

</details>

## `protocolinfo` `confirmed`

ConnectionManager protocolInfo capability set (libavcodec decoder) — complete sink/source mime+scheme vocabulary

- **decoder:** libavcodec.so.59 (FFmpeg avcodec) — avcodec_{find_decoder,alloc_context3,parameters_to_context,open2,send_packet,receive_frame,flush_buffers,free_context}; 'starting %s audio decoder at %d.%06d (dc:%d.%06d)' timed decode
- **sink_protocolInfo:** http-get: and x-file-cifs: x {audio/{mp3,mp4,x-m4a,mpeg,mpegurl,x-mpegurl,mpeg3,wav,x-wav,wma,x-ms-wma,aiff,x-aiff,flac,ogg}, application/{x-mpegurl,vnd.apple.mpegurl,dash+xml,ogg}} + file:*:audio/mpegurl:* + sonos.com-{mms:*:audio/x-ms-wma:*, http:* x same mime set, spotify:*:audio/x-spotify:*, rtrecent:*:audio/x-sonos-recent:*} + x-rincon{,-mp3radio,-playlist,-queue,-stream}:*:*:* + x-sonosapi-{stream,hls,hls-static}:*:*:* + x-sonosapi-radio:*:audio/x-sonosapi-radio:* + x-rincon-cpcontainer:*:*:* + real.com-rhapsody-direct:*:audio/mp3:*
- **source_protocolInfo:** file:*:audio/mpegurl:*,x-file-cifs:*:*:*,x-rincon:*:*:*,x-rincon-{mp3radio,playlist,queue,stream}:*:*:*
- **source_full:** file:*:audio/mpegurl + x-file-cifs:*:*:* + http-get/x-file-cifs:*: with {mp3,mp4,x-m4a,mpeg,mpegurl,x-mpegurl,apple.mpegurl,dash+xml,mpeg3,wav,x-wav,wma,x-ms-wma,aiff,x-aiff,flac,ogg} + sonos.com-{mms,http,spotify,rtrecent} + x-sonosapi-{stream,hls,hls-static,radio} + x-rincon-{mp3radio,playlist,queue,stream,cpcontainer} + real.com-rhapsody-direct + pandora.com-pndrradio + audio/vnd.radiotime
- **content_types:** application/sonos_service_catalog.v1.xml (SMAPI catalog) + application/merge-patch+json (RFC7396) + application/xml;listing + application/dns-message (DoH) + image/{jpg,gif,png,svg+xml} + application/pdf + audio/{vnd.wave,L16}
- **audio_types:** audio/{aacp,aac,x-aac,x-scpls,wav,aiff,x-aiff,flac,mp4,x-m4a,mpeg,mp3,mpeg3,ogg,x-spotify-ogg,x-wav,vnd.wave,wma,x-ms-wma,x-mpegurl,mpegurl,L16}

<details><summary>Evidence (1)</summary>

- firmware — giant protocolInfo literal in rodata + libavcodec.so.59 dynamic dependency + codecout decoder trace

</details>

## `savedqueues_rsq` `confirmed`

savedqueues.rsq persisted-queue store — SavedQueues/SavedQueue XML w/ LUD+Version+Next+Curated+NumTracks, atomic .tmp write, gzip

Fields: `LastUpdateDevice`, `Version`, `Next`, `Curated`, `NumTracks`

replicated via nodetx like netsettings; 'Migrated tracks for account sn=%u' migration path; 'Reorder tracks returned %u. QueueID: %d; Tracks: %s; NewPos: %s'

- **file:** file:///jffs/settings/savedqueues.rsq (atomic write via .tmp; dir savedqueues.d.rsq; 'application/gzip' adjacency suggests gzip variant)
- **grammar:** <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"><SavedQueue Id=".." Curated=".." NumTracks=".."><track elements/></SavedQueues>
- **validation:** `'Replicated SavedQueue file is not valid'`, `'SavedQueue file at boot is not valid'`, `'Could not import saved queues file'`, `'Could not access playlists'`, `'Could not find given playlistId'`

<details><summary>Evidence (1)</summary>

- firmware — '/jffs/settings/savedqueues.rsq' + SavedQueues LastUpdateDevice/Version/Next/SavedQueue Id/Curated/NumTracks literals

</details>

## `scpd` `confirmed`

SCPD (Service Control Point Definition) XML served at /xml/<Svc>1.xml — advertised via <SCPDURL> in device_description

- **files:** 21 XML files in opt/htdocs/xml: 16 advertised SCPDs + AudioIn1.xml (unadvertised) + device_description.xml + group_description.xml + musicservices.xml + xsl
- **advertised_actions:** 208 total actions across 16 services; 414 in-args, 206 out-args; state-variable tables per service
- **advertised_not_implemented:** 8 advertised actions not individually dispatched in 86.10: 6 AudioIn (real impl 34.16/57.10 -> reject-all 401 stub in 86.x) + ProvisionCredentialedTrialAccountX (dispatched 34.16, hard-removed 57.10+, stale ad) + ResetThirdPartyCredentials (dispatched 34.16, soft-removed 57.10+, dead string). All other advertised actions dispatched in every build.

<details><summary>Evidence (1)</summary>

- firmware — opt/htdocs/xml/*.xml + device_description.xml SCPDURL

</details>

## `soap_envelope` `confirmed`

SOAP request/response/fault wire envelope: <s:Envelope><s:Header><s:Body><u:{action}{Response} xmlns:u={serviceType}> + UPnPError fault + secure/sensitive param redaction

- **request_parse:** recognizes http://schemas.xmlsoap.org/soap/envelope/\|{Envelope,Header,Body,Fault} ns-qualified paths
- **response:** <s:Envelope xmlns:s="soap/envelope/" s:encodingStyle="soap/encoding/"><s:Header>{hdrs}</s:Header><s:Body><u:{action}{suffix} xmlns:u="{serviceType}">...</u:{action}{suffix}></s:Body></s:Envelope>
- **generic_elem:** <%s%s xmlns="%s"> — non-u:-prefixed element form also emitted
- **fault:** <s:Fault><faultcode>s:Client</faultcode><faultstring>UPnPError</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>%d</errorCode>\[<errorDescription>%s</errorDescription>\]</UPnPError></detail></s:Fault> — faultcode always s:Client; detail carries UPnPError{errorCode,errorDescription}
- **param_redaction:** SOAP params flagged secure/sensitive/trackIDing — 'not logging %s, sensitive' + 'not logging %s, secure %d, prevent %d, sensitive %d, trackIDing %d' + 'Invalid secure param %s' — credential/PII params excluded from logging

<details><summary>Evidence (1)</summary>

- firmware — envelope+fault+redaction literals at strings ~147624

</details>

## `soap_envelope_variants` `confirmed`

Two SOAP envelope open-templates: with encodingStyle (0x10eebc90: s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/") and without (0x10eebd10). Action body wrapper: <u:%s%s xmlns:u="%s"> (0x10eebd78) — action-name, in-arg block, service URN

<details><summary>Evidence (1)</summary>

- @ 0x10eebc90 — literal pair + u: wrapper at 0x10eebd78

</details>

## `soap_fault_wire` `confirmed`

SOAP fault body emitted for every req->v\[+0x14\] fault. DOM-built via ns|localname element keys (rodata '...control-1-0|UPnPError', '.../envelope/|Body', '.../envelope/|Envelope' at 0x10eec165 family). The code is stored at req+0x10 by f_10731560 and rendered as digits; faultcode is fixed 's:Client', faultstring fixed 'UPnPError'. There is NO errorDescription element - the numeric code is the entire machine-visible vocabulary.

```
<s:Fault><faultcode>s:Client</faultcode><faultstring>UPnPError</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>%d</errorCode></UPnPError></detail></s:Fault>
```

Used by: all 199 action fault paths via req->v\[+0x14\]

{'literal_rodata': 'prefix 0x10eebdcc, suffix 0x10eebe60', 'code_vocabulary': '705 verified vtable+0x14 dispatch sites: literal codes {0,1..17,100,250,252,255,401,402,10048}; 582 sites pass computed worker/subsystem rc (bounded per-worker into error bounded_domain). Log-level split at code>=1000 in f_10731560.', 'proven_code_set': 'union of all literal-code records + worker bounded_domain exits: {0,401,402,501,701,702,706,710,711,712,717,718,800,801,802,803,804,808,810,1000,1028,1240} - 401/402 request-layer, 501 action-failed, 701-721 UPnP-AV standard (718=invalid instanceID, 42 sites), 800-811 queue/CD family, 1000+ Sonos-internal (level-8 logging)'}

<details><summary>Evidence (1)</summary>

- fn 0x10731560 @ 0x10eebdcc — literal doc pieces 0x10eebdcc/0x10eebe60; DOM keys 0x10eec165; raise-fault stores code at req+0x10, level-8 log when >=1000

</details>

## `soapaction_header` `confirmed`

SOAPACTION HTTP header grammar: SOAPACTION: "{serviceType}#{action}" targeting the control endpoint

- **form:** SOAPACTION: "{serviceType}#{action}" / SOAPACTION: "%s%s%s" / "%s#%s"
- **semantics:** UPnP-standard quoted serviceType#actionName targeting the control endpoint

<details><summary>Evidence (1)</summary>

- firmware — SOAPACTION templates

</details>

## `sonos_access_settings_json` `strong`

Access-control settings document template: \[{"version":%u,"lastUpdateDevice":"%24s"}, \[{"name":"restricted-admin", "readPer... — JSON permission list parsed by f_105c7248 (two scanf passes)

Fields: `version`, `lastUpdateDevice`, `named-permission entries`

<details><summary>Evidence (1)</summary>

- @ 0x105c72e0 — fmt at 0x10fe58a4

</details>

## `sonos_alarm_doc` `confirmed`

Alarm document grammar: <Alarms LastUpdateDevice="%s" Version="0" SchemaVersion="%d"> / <AlarmClock LastUpdateDevice="%s" Version="0"> containers; alarm-state section <Alarm><Mode><Scheduler><UTCTime><LocalTime><Pending><PendingAlarm> with <ID>%u</ID> <Type>%s</Type> <Time>%s</Time> <TimeUTC> <Recurrence>%s</Recurrence> <NextUTC> <NextLocal> (0x10eaab44..0x10eab564)

<details><summary>Evidence (1)</summary>

- @ 0x10eaab44 — literal family

</details>

## `sonos_audio_settings_line` `strong`

Packed audio-settings serialization: AMV%hd LV%hd RV%hd B%hd T%hd L%c F%c SS%hd LEV%hd SW%c SC%hd SP%hd DL%hd SL%hd AD%hd NM%... — {autoplay-music-vol, line-in-vol, rec-vol, bass, treble, loudness, fixed, sub…} emitted by f_100d78a4

Fields: `AMV`, `LV`, `RV`, `B`, `T`, `L`, `F`, `SS`, `LEV`, `SW`, `SC`, `SP`, `DL`, `SL`, `AD`, `NM`

<details><summary>Evidence (1)</summary>

- @ 0x100d78a4 — fmt site

</details>

## `sonos_browse_filter_vocab` `strong`

Browse-filter capability lists: dc:title,upnp:artist,upnp:album,res@duration,res (0x10e942a8) and dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber (0x10f0dfa0) + sort fragments +upnp:album,+upnp:originalTrackNumber,+dc:title,+microsoft:artistAlbumArtist

<details><summary>Evidence (1)</summary>

- @ 0x10e942a8 — literal lists

</details>

## `sonos_buzzer_uri` `strong`

Buzzer asset URIs: file:///opt/buzzers/%s and file://%s/buzzers/0.mp3 (f_1026badc, f_10278354 — alarm-tone emitters)

<details><summary>Evidence (1)</summary>

- @ 0x1026badc — fmt sites

</details>

## `sonos_class_audioBook` `strong`

<upnp:class>object.item.audioItem.audioBook — audiobook item class literal (0x10ec1258)

<details><summary>Evidence (1)</summary>

- @ 0x10ec1258 — literal

</details>

## `sonos_diag_filename` `strong`

Diagnostic/log filename grammar: %d.%d.%d.%d_%4d-%2d-%2d_%2d-%2d-%2d — IPv4_date_time; parser f_10d96b10

<details><summary>Evidence (1)</summary>

- @ 0x10d96bcc — fmt at 0x11028dfc

</details>

## `sonos_duration_hhmmss` `strong`

SleepTimer duration argument grammar: sscanf format %02hu:%02hu:%02hu — HH:MM:SS, three 2-digit unsigned-short fields; parser f_10c3d2c4 returns success only when all 3 fields convert (else 402 upstream) (variant %hhu:%hhu:%hhu parser at f_102ab830 — same grammar, non-zero-padded accepted)

Fields: `HH`, `MM`, `SS`

<details><summary>Evidence (2)</summary>

- @ 0x10c3d2c4 — sscanf call site; fmt string at 0x10fb1618 = %02hu:%02hu:%02hu
- @ 0x102ab890 — variant sscanf %hhu:%hhu:%hhu at 0x102ab830; fmt at 0x10f9b47c

</details>

## `sonos_favorites_version` `strong`

Favorites-version token grammar: sscanf FV:%zu — FV: prefix + size_t; parser f_100e1654 (RenderingControl-region worker)

Fields: `FV prefix`, `version int`

<details><summary>Evidence (1)</summary>

- @ 0x100e18a8 — sscanf site; fmt at 0x10ea0374

</details>

## `sonos_hex_blob_line` `strong`

Hex blob/record line grammar (f_10803f38): %02X: / %08X:%08X:%016llX: / %02X%02X%02X%02X%02X%02X%02X%02X:%04X:%04X — digest/ID-line serialization

<details><summary>Evidence (1)</summary>

- @ 0x10804048 — fmts at 0x11018a84/0x11018a8c/0x11018aa0

</details>

## `sonos_http_date` `strong`

HTTP Date parsers (f_100a6724): RFC1123 %*s %d %d:%d:%d %d%*s, RFC850 %d %n%*s %d %d:%d:%d GMT%*s, %d-%n%*\[A-Za-z\]-%d %d:%d:%d GMT%*s

<details><summary>Evidence (1)</summary>

- @ 0x100a67e0 — three fmts 0x10f9ba20/0x10f9ba38/0x10f9ba54

</details>

## `sonos_http_date_emit` `strong`

HTTP Date emit: %s, %02d %s %04d %02d:%02d:%02d GMT (f_100a663c)

<details><summary>Evidence (1)</summary>

- @ 0x100a663c — fmt site

</details>

## `sonos_http_statusline` `strong`

HTTP status-line parsers HTTP/%d.%d (f_100a4b24), HTTP/1.1 %d + HTTP/1.0 %d (f_106fb460 outbound client)

<details><summary>Evidence (1)</summary>

- @ 0x106fb498 — fmts at 0x10fdb774/0x10fdb780

</details>

## `sonos_https_ep` `strong`

HTTPS endpoint emit: https://%d.%d.%d.%d:%d — IPv4:port (f_10653a34)

<details><summary>Evidence (1)</summary>

- @ 0x10653a34 — fmt site

</details>

## `sonos_iso8601_timestamps` `strong`

ISO-8601 timestamp grammars (parser f_103c1f50): compact %04hu%02hu%02huT%02hu%02hu%02hu.%03huZ and extended %04hu-%02hu-%02huT%02hu:%02hu:%02hu.%03hu+%*02u:%*02u — both accepted; used by alarm/datetime fields (alarmClock XML ProgramTime etc)

Fields: `compact+extended ISO-8601 with ms and optional tz`

<details><summary>Evidence (1)</summary>

- @ 0x103c201c — two sscanf sites in f_103c1f50; fmts at 0x10f9d4e4/0x10f9d50c

</details>

## `sonos_iv_token` `strong`

IV= prefixed token scan in f_103c0364

<details><summary>Evidence (1)</summary>

- @ 0x103c05cc — fmt at 0x10f98f0c

</details>

## `sonos_lastchange_attr_form` `confirmed`

Sonos LastChange serializes variables in ATTRIBUTE form <r:NAME val="..."/> (rincon namespace) not element form. Recovered element set: EnqueuedTransportURI, EnqueuedTransportURIMetaData, CurrentValidPlayModes, DirectControlClientID, DirectControlIsSuspended, DirectControlAccountID, SleepTimerGeneration, RestartPending, NextTrackURI, NextTrackMetaData, AlarmRunning, SnoozeRunning (0x10eb2b38..0x10eb2e00) plus CurrentTrackURI (0x10eb2ae8)

<details><summary>Evidence (1)</summary>

- @ 0x10eb2b38 — literal family

</details>

## `sonos_linein_demo` `strong`

Settings field: LineInDemoMode: \[%hu\] parsed by f_100a6ce0

<details><summary>Evidence (1)</summary>

- @ 0x100a6d04 — fmt at 0x10f9bfa0

</details>

## `sonos_mac_dash` `strong`

MAC grammar variant: %02hhX-%02hhX-%02hhX-%02hhX-%02hhX-%02hhX:%*c — dash-separated + trailing char; parser f_1055e790

<details><summary>Evidence (1)</summary>

- @ 0x1055e7c0 — fmt at 0x10fe4f8c

</details>

## `sonos_mac_parse` `strong`

MAC-address parser: sscanf %02hhX:%02hhX:%02hhX:%02hhX:%02hhX:%02hhX — six 2-digit hex octets; parser f_10551d68

Fields: `6 hex octets`

<details><summary>Evidence (1)</summary>

- @ 0x10551dd4 — sscanf site; fmt at 0x10fe1064

</details>

## `sonos_metadata_urn` `strong`

Metadata URN scan: urn:schemas-rinconnetworks-com:metadata-1-0/|rating — content-rating namespace parsed by f_106fa350

<details><summary>Evidence (1)</summary>

- @ 0x106fa66c — fmt at 0x10fd29a4

</details>

## `sonos_packed_object_id` `strong`

Packed binary object-ID grammar: sscanf %04hX%08X%08X%08X%04hX%02hhX%08X%08X%08X%08X%08X%08X%08X%08X%02X — 14-field hex-packed ID parsed by f_1032d7f8 (ContentDirectory region; likely the cpcontainer/track binary-ID form)

Fields: `14 packed hex fields`

<details><summary>Evidence (1)</summary>

- @ 0x1032d8dc — fmt at 0x10f9aad0

</details>

## `sonos_path_two_seg` `strong`

Two-segment path split %\[^/\]/%\[^/\] by f_1055c55c

<details><summary>Evidence (1)</summary>

- @ 0x1055c71c — fmt at 0x10fe2f98

</details>

## `sonos_queue_doc` `strong`

Queue doc attribute emit: " NumTracks="%u"" — the queue XML serialization writes NumTracks; emitters f_10476270, f_1047be68, f_1047df28, f_1047e16c

Fields: `NumTracks attr`

<details><summary>Evidence (1)</summary>

- @ 0x10476270 — fmt sites

</details>

## `sonos_saved_queue_file` `strong`

Saved-queue persist filename savedqueues.rsq (f_104791b0)

<details><summary>Evidence (1)</summary>

- @ 0x104791b0 — filename literal

</details>

## `sonos_saved_queue_id` `strong`

Saved-queue object-ID grammar: sscanf SQ:%d — decimal index after SQ: prefix; parsed by saved-queue workers f_10479fb8, f_1047a3bc, f_10476690, f_104794d4 (AddURIToSavedQueue/ReorderTracksInSavedQueue/queue-engine paths)

Fields: `SQ prefix`, `decimal index`

<details><summary>Evidence (1)</summary>

- @ 0x1047a050 — sscanf site; fmt at 0x10fea010

</details>

## `sonos_signed_blob_json` `strong`

Signed/checksummed blob envelope: {"magic":"`|_(:/)_|`","length":%u,"checksum":"0x%08X","counter":%u} parsed by f_10bf85f4 — magic literal + hex checksum integrity wrapper; RESOLVED consumer: group.cxx group effective-values persistence (grkId-keyed store, '\[Mg\]' log tag, version:11 sibling section, jump-table dispatch 0x10fb03b4)

Fields: `magic`, `length`, `checksum`, `counter`

- **consumer:** f_10bf8xxx..f_10bfefxx group.cxx family; 'internalReadEffectiveValuesLocked_jsonValue' worker

<details><summary>Evidence (1)</summary>

- @ 0x10bf87c0 — fmt at 0x11316218

</details>

## `sonos_state_flags` `strong`

Zone state-flag tokens frozen:%d / allow:%d / auto:%d parsed by f_1076ff3c (zoneplayer settings path)

Fields: `frozen`, `allow`, `auto`

<details><summary>Evidence (1)</summary>

- @ 0x10770028 — three scanf sites

</details>

## `sonos_track_encryption_meta` `strong`

Track-encryption metadata elements: <TrackEncryptionMethod>%s</..> and <TrackEncryptionFormat>%s</..> (0x10ec55fc/0x10ec5630) — DRM metadata in track docs

<details><summary>Evidence (1)</summary>

- @ 0x10ec55fc — literals

</details>

## `sonos_track_summary_doc` `confirmed`

Queue-summary doc roots: <TrackQueueSummary> (0x10ea978c) and <TrackSummary> (0x10e89708) — emitted by the /track_queue_summary + /tracks_summary diagnostic endpoints

<details><summary>Evidence (1)</summary>

- @ 0x10ea978c — literals

</details>

## `sonos_version_pair` `strong`

Version-pair grammar: sscanf %d.%d — major.minor; parsers f_10553e94, f_10554218

Fields: `major`, `minor`

<details><summary>Evidence (1)</summary>

- @ 0x10553edc — sscanf site; fmt at 0x10fe1074

</details>

## `status_doc` `confirmed`

complete /status + diagnostic XML doc element grammar

- **psk_material:** <ControlPsk>+<BackupControlPsk>+<HhPsk>+<BackupHhPsk>+<LanSwapPsk>+<BackupLanSwapPsk>+<BackupRoomEncPsk> id= — SonosNet key material present in status dumps
- **settings_tasks:** <inflightTask_{addTaskMoment,completionStatus,correlationId,locationId,repeatFailureCount,retryCount,settingsGroupName,updateReason,updateTaskType}>+<pendingTask_{...}>+<IsConnectedToCloud>+<IsQuiescent>+<NumOf{Tasks*,SettingsGroupsInvalidated,Refetch,GroupInvalidations}>
- **entitlement:** <Entitlement type= isTrial= sku= startDate= endDate= codes=/>
- **audio:** <ActiveDecoder>{DTS,PCM,None}+<DTSProfile>+<DialNorm>+<BitDepth>+<BitRate>%lld+<FrameRate>+<FrameSize>+<InputChannelCount>+<ChanMap>/<ChannelMap>+<GMDownMixState>+<FreshestFilterBank>+<FrontSatDelay>+<Delay>+<HLSVersion>
- **network:** <Addr>+<DHCPServerMac>+<IP>/<IPAddress>+<Host>/<HostName>+<Eth>+<ConnectionType>+<ConnectionTypeString>+<IsEncrypted>+<IsFallback>+<IsSecure>+<IsStatic>+<Conflicts>
- **device:** <CPUTemperature>+<HardwareVersion>+<BuildType>+<Copyright>+<CustomerID>+<DevMode>+<DeviceTime>%d.%06d+<HouseholdID>+<HouseholdControlID>+<HTSwap>+<HwFailure>+<HwFeatures>+<HwFlags>+<IdleState>+<HHSwgenState>+<Bundle{ID,Version}>+<Cert{Name,Serial}>+<DateCode>+<DspVersion>
- **diag:** <Job{Allowed,ForceAllowed,LastRun,Scheduled}>+<Anomalies>+<BusyClients>+<ConsecutiveFailures>+<FailureCount>+<FaultState>+<Happy>%u/%u+<Denylisted>+<Expires{,In,Utc}>+<EventKey>+<EventURI>+<ExpectedSeq>+<Location{,Moment}>+<locationTarget_%d_{data,id}>+<Counter name='CPU Performance \[%u\]'/'Completed Location Settings Updates'>+<Command namespace= cmd= method= credType=> (lechmere cmd elem)
- **lechmere_conn:** <NotificationAddr>wss://%s:%u (muse)+<LogicalSID>%6s+<PerMsgDeflate>+<NextRenew>+<LastWebSocketCode>+<Milliseconds{Open,Closed,ToNextConnect,ToResolve}>+<PingTimeWeightedAverage>+<NextPing>+<LastPingTime>+<OpenCount>/<CloseCount>+<UnackedPings>+<NotifyErrors>+<NSDResult>+<TruncatedConnectionList>+<RemoteEndpoint>+<PrimaryEthernet>+<Total{,Un}compressedKBytes{Received,Sent}>+<TotalCompressedKBytesDecompressed> (deflate stats)
- **subscription:** <Subscription name= type=/>+<SubscriptionID>+<SubState>+<UPnPSID>+<NextRenew>+<UnackedPings>
- **sonosnet:** <SonosNet Disable=>+<SonosNet Frequency=>+<SonosNetDisabled>+<RoomEncPsk id=>+<Network SSID= Flags=/>+<NetworkHash>+<NetworkIPAddress>+<NetworkMask>+<MACAddress>
- **satellite_ht:** <Satellite{Subs,Total,TxMixerRate ms,Version}>+<SURRMOD>+<Surround{Level,Mode,State}>+<TVGroupMemberDelay>%uus+<HTAudioInCode>+<HTSwap>+<LFEPresence>+<LastActiveDecoder>+<StreamChannels>%d.%d.%d+<StreamInfo>+<Sample{Rate,BitDepth,Width}>+<ProcessRate>bps+<StartupLatency>%uus+<SilentSeconds>+<Signal>{active,inactive}+<InputBitstreamStride>+<NumPrimaryChannels>+<PlaybackStreamSampleType>
- **replicated_stores:** <Radio LastUpdateDevice Version NextFavorite>+<Services LastUpdateDevice Version SchemaVersion>+<Shares LastUpdateDevice Version>+<Setting idx lud version/>+<Setting Name=R_CustomerID/R_HideTuneIn>+<ReplicatedNetSettings LastUpdateDevice Version FileSchemaVersion>
- **version_identity:** <SWGen>+<Software{Date,Scm,Version}>+<MinCompatibleVersion>+<LegacyCompatibleVersion>+<ProtocolVersion>+<SerialNumber>+<SeriesID>+<SonosID>+<MfgLocation>+<RetailMode>+<Unlocked>+<UpgradeManager>+<RegState>+<Tweaks>0x%08X
- **time:** <TimeSource Server=/>+<TimeStamp>+<TimeToExpire>+<TimeSinceLast{Access,Refresh}>+<TargetDurationSec>+<LastAccessTime>+<Format Time= Date=>
- **led_script:** <LedPatternEntry time= led_ids=%08x repeats= steps=>+<LedStepEntry rgb=%06X hold= fade=/> — LED pattern programs
- **track_drm:** <TrackEncryption{Format,Method}>+<Repeat>+<Shuffle>+<Recurrence>+<SodVolume>+<Crossfade>+<Gain>
- **upnp_fault:** <UPnPError xmlns='urn:schemas-upnp-org:control-1-0'> — fault element root

<details><summary>Evidence (1)</summary>

- firmware — ~200 <Elem>fmt templates in rodata

</details>

## `trackqueue_rsq` `confirmed`

trackqueue.rsq live-queue persistence store — transactional append/replace w/ txn-id guard + range-remap algorithm

- **file:** trackqueue.rsq (live queue persistence; 'file://%s#%d' URI form, /trackqueue.rsq#0); TQD (track-queue-descriptor) context decode 'decoded len %zu exceeds buffer len %zu'
- **transactions:** append/replace are transactional: 'commitAppend'/'commitAppend (replace)' + txn-id check 'Append transaction ID mismatch. Aborting commitAppend/commitReplace'
- **replaceall:** 'ReplaceAll: search c:%d/%d m:%d r:%d cti:%d/%d'; 'mapping not valid (%u > %u)'; 'old:%d-%d new:%d-%d cur:%d new:%s/%d' — range remap algorithm
- **objects:** `trackQueue`, `trackQueueRAM`, `spotifyTrackQueue`, `savedq_mdcache`, `trackQueueSummary`, `<TrackQueueSummary>`
- **streaming_proto:** media client accepts 'HTTP/1.0 200 OK' AND 'ICY 200 OK' (Shoutcast ICY) response lines + 'metadata' marker

<details><summary>Evidence (1)</summary>

- firmware — 'trackqueue.rsq' + commitAppend/commitReplace txn-id + ReplaceAll range-remap literals

</details>

## `upnp_gena_event_doc` `confirmed`

GENA event document: <e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"> (0x10f005b0); LastChange wrapper <LastChange>%s</LastChange> (0x10e89d80); <InstanceID val="0"> always emitted (0x10e88960)

<details><summary>Evidence (1)</summary>

- @ 0x10f005b0 — literals

</details>

## `upnp_search_criteria_vocab` `strong`

UPnP search-criteria grammar accepted by CD search: upnp:class = "object.container.*" and @refID exists false (0x10f0dcd4..0x10f0df24); derivedfrom operator also supported: upnp:class derivedfrom "object.item.audioItem"

<details><summary>Evidence (1)</summary>

- @ 0x10f0dcd4 — literal criteria samples

</details>

## `zone_audio_state` `confirmed`

extended per-zone audio/EQ + queue-state status blocks

- **blocks:**
  - **volume_ducking:** <Zone><Zone>%d</Zone><UnscaledVolume><Volume><DeferredVolume><Ducked><DuckingVolume><DuckingPercent><OverrideVolume><Muted><DeferredMute><ExtSrcVolume><SurroundLevel><ZoneChannelCount></Zone>
  - **eq_full:** <Zone>...<IsSatellite><Volume><GainTrimDB><SPLdB><LoudnessSPLdB><LoudnessScaling><BassLevel><TrebleLevel><LoudnessEnabled><StereoPairEnabled><IsOnLeft><Balance{,Initial}><LeftMute><RightMute><HeightLevel><HeightLeveldB><NumBondedSubs><BondedSubModel><SubwooferEnabled><SubwooferJackConnected><DRCVolumeScaling><NightMode><DialogEnhancementLevel><TrueplayEnabled><SubLeveldB><InvertSub><ConstrainSubLevelToVolume><SubDefaultInversion><SourceGainOffsetdB><MusicSurroundLeveldB><TVSurroundLeveldB><FullSurroundMode><PlaybackStreamSampleType><MonoMode><SubCrossover>%dHz<SpeakerSize>
- **queue_status:** <Queue Name='%s'><EntriesMax><EntriesUsed><EntriesHighWater><StringTableSize><StringTableUsed><StringTableHighWater><UpdateID><ObjectID><OwnerID><Policy><CloudQueueHost></Queue>
- **updateid_vocabulary:** SystemUpdateID, ContainerUpdateIDs, FavoritesUpdateID, RadioFavoritesUpdateID, RadioLocationUpdateID, SavedQueuesUpdateID, ShareListUpdateID, NewQueueLength, NewUpdateID, QueueLengthChange, notifyUpdateID('%s',%u), GetSystemUpdateID

<details><summary>Evidence (1)</summary>

- firmware — rodata template literals

</details>
