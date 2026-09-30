# Payload formats

Some command arguments look like plain text but are really packed data - bit flags, delimited tuples, escaped XML documents. These entries decode what's actually inside each opaque field.

<details markdown="1"><summary><b>Technical details</b></summary>

Opaque payload/field grammars recovered from sscanf/printf templates and parser functions.

</details>

## `SonosAvtStateFile` `strong`

The AVTransport persisted-state vocabulary — what survives reboot for transport state.

<details markdown="1"><summary><b>Technical details</b></summary>

AVT persisted-state vocabulary: contiguous name pool at 0x10eb3330-0x10eb3410 used by the AVT save/restore machinery ("/avt.txt" persistence; "Restoring AVT"/"Restored AVT from file" log lines adjacent). Field names are reached via base+offset addressing - the save/restore worker serializes these keys.

</details>

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

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10eb3330 — contiguous name pool; no direct code xrefs - reached via base+offset from AVT restore worker; "/avt.txt" and restore-log strings at 0x10eb2xxx pool above

</details>

## `SonosRcChannel` `confirmed`

RenderingControl channel tokens — 'Master', 'LF', 'RF' etc.; other values are rejected.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl channel token compared verbatim by impl strcmp chains: 'Master', 'LF', 'RF' universally; 'FocusMode' accepted additionally by SetMute only (maps to impl byte +0x7f4). Unknown tokens -> impl rc 402.

</details>

```
case-sensitive ASCII exact match
```

Used by: RenderingControl.GetMute; RenderingControl.SetMute (adds FocusMode); RenderingControl.GetVolume (forwarded)

- **accepted_values:** `Master`, `LF`, `RF`, `FocusMode (SetMute only)`
- **parser:** per-action strcmp chains in impl fns (e.g. f_100d71e0, f_100d99b0)

<details markdown="1"><summary>Evidence (2)</summary>

- fn 0x100d71e0 — GetMute: 3-channel map
- fn 0x100d99b0 — SetMute: 4-channel map incl. FocusMode->+0x7f4

</details>

## `SonosRcInstance` `confirmed`

RenderingControl accepts only InstanceID 0 — anything else faults with 702.

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl InstanceID convention: impls that check it accept only 0 and return 702 for nonzero (NOT 718 like AVTransport). Several impls execute the compare but leave it dead (SetVolume/worker) or never read the arg (GetTreble) - the check is inconsistent across actions.

</details>

```
type-tag-4 integer record
```

Used by: all RenderingControl actions (inconsistent enforcement)

- **accepted_values:** `0 (where checked)`

<details markdown="1"><summary>Evidence (2)</summary>

- fn 0x100e43b4 — 702 shim
- fn 0x100dcb00 @ 0x100dcb08 — dead cmpwi - flag test overwrites cr7

</details>

## `SonosSeekTime` `confirmed`

The Seek target format — HH:MM:SS-ish time strings; leading '-' is handled.

<details markdown="1"><summary><b>Technical details</b></summary>

Sonos time-position operand produced by f_102ab830: an optional leading '-' sets a separate sign flag, then sscanf('%hhu:%hhu:%hhu') must convert exactly three decimal fields. Each %hhu applies strtoul semantics per component - leading whitespace skipped, own optional +/- sign allowed, result truncated to u8 so >255 wraps mod 256. The ':' separators match literally (no whitespace before them); trailing characters after the third field are ignored. Output is a {seconds_word, fraction_word=0} pair (printed as '%lld.%06lld') plus the sign byte; a leading '-' negates only the seconds word. Total range 0..934575 s (255:255:255); there is no upper-bound check.

</details>

```
[-]H:M:S where each component is a scanf %hhu (u8, mod-256 wrap); exactly three required; trailing junk ignored
```

Used by: AVTransport.Seek (Target for REL_TIME/TIME_DELTA, both indexed and stream modes)

Action-specific restrictions layer on top: e.g. Seek indexed mode rejects a set sign flag unless Unit==TIME_DELTA, and treats a zero-magnitude pair as a silent no-op success. Stream mode performs no sign or zero gating.

<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102ab830 @ 0x102ab830 — sign skip via cmplwi '-' + r3+=cr4.eq; sscanf fmt at 0x10eafc7c; secs=(h*60+m)*60+s; neg on cr4.eq; stw {secs,0} pair + sign byte

</details>

## `SonosTrackOrdinal` `confirmed`

The Seek 'track number' operand — a plain decimal index into the queue.

<details markdown="1"><summary><b>Technical details</b></summary>

Sonos track-ordinal operand: strtol(text,NULL,10) on the raw string - base 10, leading whitespace and +/- accepted, endptr NULL so trailing junk is silently ignored ('5junk' -> 5), saturates at LONG_MIN/MAX. Acceptance range is validated on the UNMASKED strtol result as (value-1) <= 0xFFFD unsigned, i.e. exactly 1..65534; a separate u16 truncation (value & 0xffff) sizes the downstream record field and cannot wrap an out-of-range input into validity.

</details>

```
decimal integer, strtol base 10; accepted lexical range 1..65534
```

Used by: AVTransport.Seek (Target for TRACK_NR, indexed mode)

The mask-before-validate ordering looks alarming but is inert: the record field is computed pre-check, the check uses the raw value, and a rejected record is destroyed unsubmitted.

<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x102b9088 @ 0x102b9350 — strtol(r26,0,10); rlwinm &0xffff at 0x102b938c sizes the record field; addi r30,-1 + cmplwi 0xFFFD at 0x102b9394-0x102b939c validates the raw value

</details>

## `codec_mime_flags` `strong`

A small lookup that tags audio formats (wav/wma/adts) and MIME types with internal flags — used to pick the right decoder for a stream before playback starts.

- **name:** codec/MIME flag tables
- **summary:** Two adjacent tables: format-name flags at .rodata 0x10ecc540 {wav=0x1, wma=0x2, adts=0x4} and the MIME->flag map at 0x10ecc618 {audio/wav\|audio/x-wav\|audio/vnd.wave=0x1, audio/wma\|audio/x-ms-wma=0x2, audio/x-mpegurl=0x8}. x-mpegurl carries bit 0x8 (playlist/m3u class) - the MIME table drives stream-type classification for HTTP fetches.

<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x10ecc540 — format flags
- @ 0x10ecc618 — MIME map

</details>

## `contentdir_root_map` `strong`

The ContentDirectory browse root map — FV:2→FavoritesUpdateID, R:0→RadioFavoritesUpdateID, SQ:→SavedQueuesUpdateID, S:→ShareListUpdateID — the top-level browse tree.

<details markdown="1"><summary><b>Technical details</b></summary>

Top-level ContentDirectory browse tree recovered from the root-enumeration function (f_10303de4, 'cd' log domain): each well-known object ID is paired with its UpdateID state variable. FV:2->FavoritesUpdateID, R:0->RadioFavoritesUpdateID, R:->RadioLocationUpdateID, SQ:->SavedQueuesUpdateID, S:->ShareListUpdateID. R: prefix = radio favourites (TuneIn-era 'Favorite Stations'), SQ: = saved Sonos playlists (.rsq store), S: = music-library shares.

</details>

Fields: `object-id prefix`, `UpdateID state variable`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10304098 — literal table load: FV:2, FavoritesUpdateID, R:0, RadioFavoritesUpdateID, R:, RadioLocationUpdateID, SQ:, SavedQueuesUpdateID, S:, ShareListUpdateID, near 'cdMediaServer'/'cd' domain

</details>

## `device_description` `confirmed`

The UPnP device description XML — services advertised, presentation URLs; AudioIn may be omitted by variant.

<details markdown="1"><summary><b>Technical details</b></summary>

UPnP root device-description htdocs template + 35 substitution tokens; advertises 16 SCPD service descriptions

</details>

- **tokens:** #UUID# #HOST# #SW_VERSION# #SW_GENERATION# #SW_MINCOMPATVER# #SW_LEGACYCOMPATVER# — template substitution into the root descriptor
- **note:** device_description.xml (htdocs) IS the served #TOKEN# template — substitutes 35 tokens (#UUID#,#HOST#,#MODEL#,#SW_VERSION#,#SW_GENERATION#,#SW_MINCOMPATVER#,#SW_LEGACYCOMPATVER#,#MAC_ADDRESS#,#SERIAL_NUM#,#API_VERSION#,#MIN_API_VERSION#,#DISPLAY_VERSION#,#EXTRA_VERSION#,#NS_VERSION#,#HW_VERSION#,#ZONETYPE#,#CD_NAMESPACE#,#MEDIASERVER_NAMESPACE#,#VENDOR_NAME#,#DISPLAY_NAME#,#VARIANT#,#RETAIL_MODE#,#HHSSL_PORT#,#SSL_PORT#,#MUSE_API_VERSIONS#,#NODE_PROTO_VERSIONS#,#HTA_FRAME_VERSIONS#,#TRUEPLAY_SDK_VERSIONS#,#AMP_ONTIME#,#INT_SPEAKER_SIZE#,#MEMORY#,#FLASH#,#QPLAY_SUPPORT#,#API_VERSION#). It DOES advertise SCPDs — 16 <SCPDURL>/xml/<Svc>1.xml elements. AudioIn is NOT in the advertised serviceList (consistent with its reject-all stub). ContentDirectory serviceType is the #CD_NAMESPACE# runtime token (upnp-org vs sonos-com CD namespace substituted per build).
- **advertised_services:** 16: AlarmClock,MusicServices,DeviceProperties,SystemProperties,ZoneGroupTopology,GroupManagement,HTControl,QPlay,ContentDirectory(#CD_NAMESPACE#),ConnectionManager(MS),RenderingControl,ConnectionManager(MR),AVTransport,Queue(sonos-com),GroupRenderingControl,VirtualLineIn — AudioIn absent (internal stub)

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — rodata template literals

</details>

## `didl_cdudn_desc` `strong`

A Sonos-specific DIDL <desc> element carrying the content-directory UDN — used to say which player owns an item.

<details markdown="1"><summary><b>Technical details</b></summary>

DIDL desc element: <desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/"> — ContentDirectory UDN descriptor (0x10eb0c4c)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10eb0c4c — literal

</details>

## `didl_lite` `confirmed`

The DIDL-Lite XML that carries track/container metadata — this is what you put in SetAVTransportURI's metadata arg and what Browse returns. The full grammar (classes, protocolInfo, search criteria) is decoded below.

<details markdown="1"><summary><b>Technical details</b></summary>

DIDL-Lite metadata envelope + full object.* class/protocolInfo/search-criteria grammar + r: rinconnetworks extension ns

</details>

- **root:** <DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"> — r: is the Sonos extension ns
- **classes:** `object.item`, `object.item.playlistItem`, `object.item.sonos-favorite`, `object.item.audioItem.musicTrack{,.recentShow}`, `object.item.audioItem.audioBroadcast{,.live}`, `object.item.audioItem.linein{,.homeTheater,.airplay,.bluetooth}`, `object.item.audioItem.{podcast,show,audioBook.chapter}`, `object.container.{album.musicAlbum{,.compilation},playlistContainer{,.sameArtist,.tracklist},albumlist,person.musicArtist,person.composer,genre.musicGenre,podcast,sonos-searchTypes}`
- **protocolInfo:** `x-rincon-{playlist,queue}:*:*:*`, `x-sonos-vli:*:audio:*`, `file:*:audio/mpegurl:*`, `spdif`, `http-get:*`
- **search_grammar:** SearchCriteria supports: derivedfrom + @refID exists + = + and; '+'-prefixed sort keys; projections 'dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber'; microsoft:artistAlbumArtist (WMP interop)
- **dom_keys:** \|DIDL-Lite\|item\|container\|res\|vli element keys; 'truncated DIDL metadata' bounds

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — DIDL-Lite template + object.* class vocabulary + protocolInfo literals + search-criteria predicates in rodata

</details>

## `didl_lite_header` `confirmed`

The exact DIDL-Lite document header the firmware emits — namespace list included, useful when building metadata by hand.

<details markdown="1"><summary><b>Technical details</b></summary>

DIDL-Lite document header (verbatim literal at 0x10ee8958): <DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10ee8958 — literal

</details>

## `didl_res_protocolinfo` `strong`

How the <res> element's protocolInfo attribute is formatted per URI scheme — the fourth field determines what decoder path handles it.

<details markdown="1"><summary><b>Technical details</b></summary>

DIDL res protocolInfo emitters by scheme: x-rincon-playlist:*:*:* (0x10e89314), x-rincon-queue:*:*:* (0x10ebb874), x-rincon-mp3radio:*:*:* (0x10ec11a8), x-sonosapi-show:*:*:* (0x10ec11d8), file:*:audio/mpegurl:* (0x10ed33dc)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e89314 — literal family

</details>

## `fixed_volume_tokens` `strong`

The FV: token space inside RenderingControl — Fixed Volume parameters (NOT the favourites FV:2 container — that dual-use is documented here).

<details markdown="1"><summary><b>Technical details</b></summary>

RenderingControl-internal token space parsed by the extended SetEQ/EQType dispatcher in rc_impl: 'FV' (bare), 'FV:%zu' (numeric form), 'FV:GC' (group-coordinator), 'FV:GC-HB' (coordinator with household-bonded satellites), 'FVPXY'. Sits in the same dispatcher as SubGain, SubCrossover, SubPolarity, SpeakerSize, VolumeScalingFactor — i.e. the hidden home-theatre parameter surface exposed through the EQ-type argument.

</details>

Fields: `FV`, `FV:<n>`, `FV:GC`, `FV:GC-HB`, `FVPXY`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x100e173c — strncasecmp 'FV:' / strcmp 'FV' / strcasecmp 'FVPXY' chain in f_100e1654

</details>

## `gena_event_envelope` `confirmed`

The GENA event notification format — the propertyset XML delivered to your SUBSCRIBE callback URL.

<details markdown="1"><summary><b>Technical details</b></summary>

GENA event wire envelope — <e:propertyset>/<e:property> var elements + NT/NTS/SEQ/SID + X-RINCON-BOOTSEQ/VARIANT headers

</details>

- **grammar:** <e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><VAR>val</VAR></e:property>...</e:propertyset>
- **note:** GENA event body: DOM node 'urn:schemas-upnp-org:event-1-0\|propertyset'; each changed var emitted as <e:property> wrapper via f_10676a44
- **headers:** NT: upnp:event \| NTS: upnp:propchange \| SEQ: %d \| Sonos extensions X-RINCON-BOOTSEQ:%s X-RINCON-VARIANT:%u; 403 on denial; version-conditional eventing ('DiscoveredZP using %s eventing')

<details markdown="1"><summary>Evidence (1)</summary>

- fn f_10676a44 @ 0x10676a44 — e:propertyset/e:property literals + ns key 'urn:schemas-upnp-org:event-1-0\|propertyset' at rodata 0x10eec165; NT/NTS/SEQ/X-RINCON headers in upnpeventing_sender.cxx

</details>

## `group_effective_values_blob` `strong`

The group-scoped variant of the signed-blob settings format (version 11).

<details markdown="1"><summary><b>Technical details</b></summary>

Version-11 sibling section of sonos_signed_blob_json: ',\n{"magic":"(=^+^=)","version":11}\]' terminator emitted/parsed by the same group.cxx effective-values family

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10bf8058 — literal at 0x10fb035c; second site 0x10bf8a94

</details>

## `http_status_map` `strong`

A lookup table that turns HTTP status codes from cloud/service calls into the player's own error numbers; anything unrecognized becomes 499. It's the 'objectStatusMap' that auth errors complain about.

<details markdown="1"><summary><b>Technical details</b></summary>

| SECOND parallel map @0x10f94fa8 (51 entries, HTTP-status domain {400,401,403,404,405,409,410,412,415,417,490,491,499,500,501,503,504}): \[499,499,499,499,499,499,499,415,499,404,500,504,403,403,400,400,400,404,400,400,499,403,401,499,412,499,410,409,410,499,499,499,404,404,404,405,401,503,499,404,404,499,499,400,400,400,417,490,491,499,500\]. Neither map has a direct lis/addi reference - reached via computed base (names-table-relative) or object-field; index alignment with muse_result_codes segments is inferred, NOT proven (map2\[0\]=499 does not match OK->200 naively).

</details>

- **name:** HTTP status mapping table (objectStatusMap)
- **summary:** .rodata table at 0x10f94ec4 (+second page 0x10f94fa8): dense u16/u32 HTTP-status index->code map with sentinel 499. Recognized values {400,401,403,404,405,409,410,412,415,417,490,491,499,500,501,503,504}; unmapped -> 499. Consumed by the client-error mapping layer f_1038e82c ('Client error' string, internal codes {401,402,501,1000,1001,1002,1004}) - this is the 'objectStatusMap' referenced by the auth-layer string 'Error code not found in objectStatusMap'. HTTP errors from SMaPI/lechmere/cloud calls are normalized through this table into the internal fault space.

<details markdown="1"><summary>Evidence (3)</summary>

- @ 0x10f94ec4 — status map table, 499 sentinel
- @ 0x1038e82c — client-error mapper fn; internal codes {401,402,501,1001,1002,1004}
- @ 0x10f94fa8 — second HTTP-status map, 51 u32 entries; layout sits immediately after map1 and before the ERROR_* name strings

</details>

## `itunes_plist_importer` `strong`

The iTunes-library XML key vocabulary the importer understands — for local library shares.

<details markdown="1"><summary><b>Technical details</b></summary>

iTunes-library XML plist import vocabulary (rodata key table @0x11091a24 cluster)

</details>

Apple plist-XML grammar keys; importer maps iTunes XML library (Tracks/Playlists/Master structure) into the content index. Adjacent to selthrd.RIRDecoder/RHWEvtHandlerZP thread descriptors

- **keys:** `Audiobooks`, `Location`, `Master`, `Movies`, `Music`, `Name`, `Playlist ID`, `Playlist Items`, `Playlist Persistent ID`, `Playlists`, `TV Shows`, `Track ID`, `Tracks`, `array`, `dict`, `integer`, `key`, `plist`, `string`, `true`

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — rodata plist-key table 0x11091a24; Master/Track ID/Playlist Persistent ID/Audiobooks literal keys

</details>

## `lastchange_templates` `confirmed`

The three LastChange event document templates (per-service namespaces) — the shape of change notifications.

<details markdown="1"><summary><b>Technical details</b></summary>

the three LastChange/Event doc root templates + per-service xmlns

</details>

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

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — three <Event> template open-tags in rodata w/ distinct xmlns

</details>

## `ncd_device_payload` `confirmed`

Inside the firmware update there's a small blob that's the factory-default manufacturing record — the template that gets filled in with a serial number, MAC addresses, and calibration data when a unit is built. Shipping it empty in the update is how every player starts with the right shape of identity data before the factory programs real values.

<details markdown="1"><summary><b>Technical details</b></summary>

device-payload.bin (section type 13, 54757B) = the factory-default NCD (non-volatile config data) template programmed per-device at manufacturing. Header 0009 0ff0 0ff0 0ff0 0ff0 0000 0161; ASCII node "top_level.ncd;UserID=0xFFFFFFFF"; tagged records {tag u8, len u8, data}: 62="3s50avq100" (limelight board ID), 63="2012/06/14", 64="23:19:49" (template mfg date — the ORIGINAL 2012 Playbar factory image embedded verbatim in the 2026 update), 65=20x0xFF empty serial/MAC slots; ffaa99 marker @0x7e; then packed field records with nibble-typed tags (30/31/32/33 container+attr, 20* = 16-char space-padded placeholder strings) — serial/MAC/calibration fields shipped EMPTY, filled at factory. This is the blob mdputil -B initializes.

</details>

## `protocolinfo` `confirmed`

The full GetProtocolInfo capability set — every MIME/protocolInfo pair the player accepts, i.e. what it can play.

<details markdown="1"><summary><b>Technical details</b></summary>

ConnectionManager protocolInfo capability set (libavcodec decoder) — complete sink/source mime+scheme vocabulary

</details>

- **decoder:** libavcodec.so.59 (FFmpeg avcodec) — avcodec_{find_decoder,alloc_context3,parameters_to_context,open2,send_packet,receive_frame,flush_buffers,free_context}; 'starting %s audio decoder at %d.%06d (dc:%d.%06d)' timed decode
- **sink_protocolInfo:** http-get: and x-file-cifs: x {audio/{mp3,mp4,x-m4a,mpeg,mpegurl,x-mpegurl,mpeg3,wav,x-wav,wma,x-ms-wma,aiff,x-aiff,flac,ogg}, application/{x-mpegurl,vnd.apple.mpegurl,dash+xml,ogg}} + file:*:audio/mpegurl:* + sonos.com-{mms:*:audio/x-ms-wma:*, http:* x same mime set, spotify:*:audio/x-spotify:*, rtrecent:*:audio/x-sonos-recent:*} + x-rincon{,-mp3radio,-playlist,-queue,-stream}:*:*:* + x-sonosapi-{stream,hls,hls-static}:*:*:* + x-sonosapi-radio:*:audio/x-sonosapi-radio:* + x-rincon-cpcontainer:*:*:* + real.com-rhapsody-direct:*:audio/mp3:*
- **source_protocolInfo:** file:*:audio/mpegurl:*,x-file-cifs:*:*:*,x-rincon:*:*:*,x-rincon-{mp3radio,playlist,queue,stream}:*:*:*
- **source_full:** file:*:audio/mpegurl + x-file-cifs:*:*:* + http-get/x-file-cifs:*: with {mp3,mp4,x-m4a,mpeg,mpegurl,x-mpegurl,apple.mpegurl,dash+xml,mpeg3,wav,x-wav,wma,x-ms-wma,aiff,x-aiff,flac,ogg} + sonos.com-{mms,http,spotify,rtrecent} + x-sonosapi-{stream,hls,hls-static,radio} + x-rincon-{mp3radio,playlist,queue,stream,cpcontainer} + real.com-rhapsody-direct + pandora.com-pndrradio + audio/vnd.radiotime
- **content_types:** application/sonos_service_catalog.v1.xml (SMAPI catalog) + application/merge-patch+json (RFC7396) + application/xml;listing + application/dns-message (DoH) + image/{jpg,gif,png,svg+xml} + application/pdf + audio/{vnd.wave,L16}
- **audio_types:** audio/{aacp,aac,x-aac,x-scpls,wav,aiff,x-aiff,flac,mp4,x-m4a,mpeg,mp3,mpeg3,ogg,x-spotify-ogg,x-wav,vnd.wave,wma,x-ms-wma,x-mpegurl,mpegurl,L16}

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — giant protocolInfo literal in rodata + libavcodec.so.59 dynamic dependency + codecout decoder trace

</details>

## `savedqueues_rsq` `confirmed`

The saved-queue persistence format — Sonos Playlists are stored as this XML and replicated between players.

<details markdown="1"><summary><b>Technical details</b></summary>

savedqueues.rsq persisted-queue store — SavedQueues/SavedQueue XML w/ LUD+Version+Next+Curated+NumTracks, atomic .tmp write, gzip

</details>

Fields: `LastUpdateDevice`, `Version`, `Next`, `Curated`, `NumTracks`

replicated via nodetx like netsettings; 'Migrated tracks for account sn=%u' migration path; 'Reorder tracks returned %u. QueueID: %d; Tracks: %s; NewPos: %s'

- **file:** file:///jffs/settings/savedqueues.rsq (atomic write via .tmp; dir savedqueues.d.rsq; 'application/gzip' adjacency suggests gzip variant)
- **grammar:** <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"><SavedQueue Id=".." Curated=".." NumTracks=".."><track elements/></SavedQueues>
- **validation:** `'Replicated SavedQueue file is not valid'`, `'SavedQueue file at boot is not valid'`, `'Could not import saved queues file'`, `'Could not access playlists'`, `'Could not find given playlistId'`

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — '/jffs/settings/savedqueues.rsq' + SavedQueues LastUpdateDevice/Version/Next/SavedQueue Id/Curated/NumTracks literals

</details>

## `scpd` `confirmed`

The SCPD service-description XML served per service — the action/argument definitions (note: binary behavior is ground truth; SCPDs are comparison evidence).

<details markdown="1"><summary><b>Technical details</b></summary>

SCPD (Service Control Point Definition) XML served at /xml/<Svc>1.xml — advertised via <SCPDURL> in device_description

</details>

- **files:** 21 XML files in opt/htdocs/xml: 16 advertised SCPDs + AudioIn1.xml (unadvertised) + device_description.xml + group_description.xml + musicservices.xml + xsl
- **advertised_actions:** 208 total actions across 16 services; 414 in-args, 206 out-args; state-variable tables per service
- **advertised_not_implemented:** 8 advertised actions not individually dispatched in 86.10: 6 AudioIn (real impl 34.16/57.10 -> reject-all 401 stub in 86.x) + ProvisionCredentialedTrialAccountX (dispatched 34.16, hard-removed 57.10+, stale ad) + ResetThirdPartyCredentials (dispatched 34.16, soft-removed 57.10+, dead string). All other advertised actions dispatched in every build.
- **satellite_template:** opt/htdocs/xml/satellite_device.xml (m8 rootfs) — the bonded-satellite device description: deviceType urn:schemas-upnp-org:device:ZonePlayer:1 with #PLACEHOLDER# vars {#HOST#, #VENDOR_NAME#, #DISPLAY_NAME#, #UUID#, #MODEL#, #SW_VERSION#, #SW_GENERATION#, #HW_VERSION#, #SERIAL_NUM#, #MAC_ADDRESS#, #SW_MINCOMPATVER#, #SW_LEGACYCOMPATVER#, #API_VERSION#, #MIN_API_VERSION#, #DISPLAY_VERSION#, #EXTRA_VERSION#, #NS_VERSION#, #NODE_PROTO_VERSIONS#} + icon /img/icon-#MODEL#.png — the substitution vocabulary for device-description rendering; satellites re-advertise as ZonePlayer:1.

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — opt/htdocs/xml/*.xml + device_description.xml SCPDURL

</details>

## `scrobble_submission` `strong`

The Last.fm scrobble POST body — Audioscrobbler 1.2 indexed fields (a\[0\], t\[0\], i\[0\]...).

<details markdown="1"><summary><b>Technical details</b></summary>

Audioscrobbler submissions-protocol form body: s=<session>&a\[n\]=artist&t\[n\]=title&i\[n\]=timestamp&o\[n\]=source&r\[n\]=rating&l\[n\]=secs&b\[n\]=album&n\[n\]=tracknum&m\[n\]=MBID. Handshake GET /?hs=true&p=1.2&c=<client>; BADTIME answered by re-reading the HTTP Date: header.

</details>

Fields: `s`, `a\[\]`, `t\[\]`, `i\[\]`, `o\[\]`, `r\[\]`, `l\[\]`, `b\[\]`, `n\[\]`, `m\[\]`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10523e18 — 's=' then &a\[0\]= &t\[0\]= &i\[0\]= &o\[0\]= &r\[0\]=&l\[0\]= &b\[0\]= &n\[0\]= &m\[0\]= emit order in f_105236c8

</details>

## `skip_restriction_bits` `strong`

Why a stream won't let you skip: a bitmask of restriction reasons — the track is an ad, licensing forbids it, there's no next/previous track, or you're paused. Radio services set these per-track.

- **name:** skip/restriction bitmask (stream restriction enum)
- **summary:** {name,u32} table at .rodata 0x10ed9d30 - proven bit values for the restriction enum previously documented name-only: 'Already Paused'=0x2, 'Not Paused'=0x4, 'License Restriction'=0x8, 'Ad'=0x10, 'No Previous Track'=0x20, 'No Next Track'=0x40. Bit0/0x1 unused in the table; 'Restriction Unknown'/'Full reset' are non-table sentinels. These bits are what SMaPI streams OR into their skip/track-control metadata (e.g. Ad blocks skip).

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10ed9d30 — restriction bit table, 6 entries

</details>

## `smapi_capability_bits` `strong`

The menu of features a music service can advertise: each name maps to one bit in the service's Capabilities number - search, three kinds of favorites (track/album/artist), extended metadata, alarms, playlists, logging, headers, and so on. When a service says it supports track favorites, that's the second bit set in this table.

- **name:** SMaPI capability bitmask (Capabilities field)
- **summary:** {name,u32} table at .rodata 0x10e769cc - the full 22-bit SMaPI Capabilities vocabulary with PROVEN bit assignments: search=0x1, trFavorites=0x2 (track favorites), authorizationHeader=0x8, alFavorites=0x10 (album), arFavorites=0x20 (artist), logging=0x40, extendedMD=0x200, disableAlarms=0x400, ucPlaylists=0x800 (user-content playlists), playbackLogging=0x1000, accountLogging=0x2000, noMultiAccount=0x4000, mediaUriActions=0x8000, contextHeaders=0x10000, deviceCerts=0x20000, playerIds=0x40000, contextReporting=0x80000, userInfo=0x100000, contentFiltering=0x200000, manifest=0x400000, radioExtendedMD=0x800000, playlistExtendedMD=0x1000000. This is the bitmask OR'd into a music service's Capabilities value; the favorites trio (tr/al/ar) gates which favorite classes a service may contribute to the FV: store.

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e769cc — {name,flag} table, 22 entries, 8-byte records

</details>

## `soap_envelope` `confirmed`

The SOAP request/response wire format — envelope, action element naming and fault shape.

<details markdown="1"><summary><b>Technical details</b></summary>

SOAP request/response/fault wire envelope: <s:Envelope><s:Header><s:Body><u:{action}{Response} xmlns:u={serviceType}> + UPnPError fault + secure/sensitive param redaction

</details>

- **request_parse:** recognizes http://schemas.xmlsoap.org/soap/envelope/\|{Envelope,Header,Body,Fault} ns-qualified paths
- **response:** <s:Envelope xmlns:s="soap/envelope/" s:encodingStyle="soap/encoding/"><s:Header>{hdrs}</s:Header><s:Body><u:{action}{suffix} xmlns:u="{serviceType}">...</u:{action}{suffix}></s:Body></s:Envelope>
- **generic_elem:** <%s%s xmlns="%s"> — non-u:-prefixed element form also emitted
- **fault:** <s:Fault><faultcode>s:Client</faultcode><faultstring>UPnPError</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>%d</errorCode>\[<errorDescription>%s</errorDescription>\]</UPnPError></detail></s:Fault> — faultcode always s:Client; detail carries UPnPError{errorCode,errorDescription}
- **param_redaction:** SOAP params flagged secure/sensitive/trackIDing — 'not logging %s, sensitive' + 'not logging %s, secure %d, prevent %d, sensitive %d, trackIDing %d' + 'Invalid secure param %s' — credential/PII params excluded from logging

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — envelope+fault+redaction literals at strings ~147624

</details>

## `soap_envelope_variants` `confirmed`

The two envelope templates — one with encodingStyle, one without — so generated clients should accept either.

<details markdown="1"><summary><b>Technical details</b></summary>

Two SOAP envelope open-templates: with encodingStyle (0x10eebc90: s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/") and without (0x10eebd10). Action body wrapper: <u:%s%s xmlns:u="%s"> (0x10eebd78) — action-name, in-arg block, service URN

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10eebc90 — literal pair + u: wrapper at 0x10eebd78

</details>

## `soap_fault_wire` `confirmed`

The exact XML a failed action returns — faultcode/faultstring/detail layout for error handling.

<details markdown="1"><summary><b>Technical details</b></summary>

SOAP fault body emitted for every req->v\[+0x14\] fault. DOM-built via ns|localname element keys (rodata '...control-1-0|UPnPError', '.../envelope/|Body', '.../envelope/|Envelope' at 0x10eec165 family). The code is stored at req+0x10 by f_10731560 and rendered as digits; faultcode is fixed 's:Client', faultstring fixed 'UPnPError'. There is NO errorDescription element - the numeric code is the entire machine-visible vocabulary.

</details>

```
<s:Fault><faultcode>s:Client</faultcode><faultstring>UPnPError</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>%d</errorCode></UPnPError></detail></s:Fault>
```

Used by: all 199 action fault paths via req->v\[+0x14\]

{'literal_rodata': 'prefix 0x10eebdcc, suffix 0x10eebe60', 'code_vocabulary': '705 verified vtable+0x14 dispatch sites: literal codes {0,1..17,100,250,252,255,401,402,10048}; 582 sites pass computed worker/subsystem rc (bounded per-worker into error bounded_domain). Log-level split at code>=1000 in f_10731560.', 'proven_code_set': 'union of all literal-code records + worker bounded_domain exits: {0,401,402,501,701,702,706,710,711,712,717,718,800,801,802,803,804,808,810,1000,1028,1240} - 401/402 request-layer, 501 action-failed, 701-721 UPnP-AV standard (718=invalid instanceID, 42 sites), 800-811 queue/CD family, 1000+ Sonos-internal (level-8 logging)'}

<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10731560 @ 0x10eebdcc — literal doc pieces 0x10eebdcc/0x10eebe60; DOM keys 0x10eec165; raise-fault stores code at req+0x10, level-8 log when >=1000

</details>

## `soapaction_header` `confirmed`

The SOAPACTION header format the router expects — serviceType#action quoted; wrong quoting is a common client bug.

<details markdown="1"><summary><b>Technical details</b></summary>

SOAPACTION HTTP header grammar: SOAPACTION: "{serviceType}#{action}" targeting the control endpoint

</details>

- **form:** SOAPACTION: "{serviceType}#{action}" / SOAPACTION: "%s%s%s" / "%s#%s"
- **semantics:** UPnP-standard quoted serviceType#actionName targeting the control endpoint

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — SOAPACTION templates

</details>

## `sonos_access_settings_json` `strong`

The access-control settings document — JSON versioned with a lastUpdateDevice field.

<details markdown="1"><summary><b>Technical details</b></summary>

Access-control settings document template: \[{"version":%u,"lastUpdateDevice":"%24s"}, \[{"name":"restricted-admin", "readPer... — JSON permission list parsed by f_105c7248 (two scanf passes)

</details>

Fields: `version`, `lastUpdateDevice`, `named-permission entries`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x105c72e0 — fmt at 0x10fe58a4

</details>

## `sonos_alarm_doc` `confirmed`

The alarm document format — <Alarms> root with version/update fields; what GetAlarmList-style state looks like.

<details markdown="1"><summary><b>Technical details</b></summary>

Alarm document grammar: <Alarms LastUpdateDevice="%s" Version="0" SchemaVersion="%d"> / <AlarmClock LastUpdateDevice="%s" Version="0"> containers; alarm-state section <Alarm><Mode><Scheduler><UTCTime><LocalTime><Pending><PendingAlarm> with <ID>%u</ID> <Type>%s</Type> <Time>%s</Time> <TimeUTC> <Recurrence>%s</Recurrence> <NextUTC> <NextLocal> (0x10eaab44..0x10eab564)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10eaab44 — literal family

</details>

## `sonos_audio_settings_line` `strong`

A packed audio-settings line — bass/treble/loudness/etc. serialized as tagged fields.

<details markdown="1"><summary><b>Technical details</b></summary>

Packed audio-settings serialization: AMV%hd LV%hd RV%hd B%hd T%hd L%c F%c SS%hd LEV%hd SW%c SC%hd SP%hd DL%hd SL%hd AD%hd NM%... — {autoplay-music-vol, line-in-vol, rec-vol, bass, treble, loudness, fixed, sub…} emitted by f_100d78a4

</details>

Fields: `AMV`, `LV`, `RV`, `B`, `T`, `L`, `F`, `SS`, `LEV`, `SW`, `SC`, `SP`, `DL`, `SL`, `AD`, `NM`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x100d78a4 — fmt site

</details>

## `sonos_browse_filter_vocab` `strong`

The browse-filter capability list — which DIDL fields you can request in Browse filter args.

<details markdown="1"><summary><b>Technical details</b></summary>

Browse-filter capability lists: dc:title,upnp:artist,upnp:album,res@duration,res (0x10e942a8) and dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber (0x10f0dfa0) + sort fragments +upnp:album,+upnp:originalTrackNumber,+dc:title,+microsoft:artistAlbumArtist

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e942a8 — literal lists

</details>

## `sonos_buzzer_uri` `strong`

Buzzer sound asset paths on disk.

<details markdown="1"><summary><b>Technical details</b></summary>

Buzzer asset URIs: file:///opt/buzzers/%s and file://%s/buzzers/0.mp3 (f_1026badc, f_10278354 — alarm-tone emitters)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1026badc — fmt sites

</details>

## `sonos_class_audioBook` `strong`

The audiobook DIDL class literal.

<details markdown="1"><summary><b>Technical details</b></summary>

<upnp:class>object.item.audioItem.audioBook — audiobook item class literal (0x10ec1258)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10ec1258 — literal

</details>

## `sonos_diag_filename` `strong`

Diagnostic filename format — IP_date_time naming for submitted bundles.

<details markdown="1"><summary><b>Technical details</b></summary>

Diagnostic/log filename grammar: %d.%d.%d.%d_%4d-%2d-%2d_%2d-%2d-%2d — IPv4_date_time; parser f_10d96b10

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10d96bcc — fmt at 0x11028dfc

</details>

## `sonos_duration_hhmmss` `strong`

Sleep-timer duration format — HH:MM:SS.

<details markdown="1"><summary><b>Technical details</b></summary>

SleepTimer duration argument grammar: sscanf format %02hu:%02hu:%02hu — HH:MM:SS, three 2-digit unsigned-short fields; parser f_10c3d2c4 returns success only when all 3 fields convert (else 402 upstream) (variant %hhu:%hhu:%hhu parser at f_102ab830 — same grammar, non-zero-padded accepted)

</details>

Fields: `HH`, `MM`, `SS`

<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x10c3d2c4 — sscanf call site; fmt string at 0x10fb1618 = %02hu:%02hu:%02hu
- @ 0x102ab890 — variant sscanf %hhu:%hhu:%hhu at 0x102ab830; fmt at 0x10f9b47c

</details>

## `sonos_favorites_version` `strong`

The FV: object-ID prefix — FV:2 is the favourites root in ContentDirectory; FV:<n>+FVPXY also mean Fixed Volume in RenderingControl (dual-use, both documented).

<details markdown="1"><summary><b>Technical details</b></summary>

FV: token grammar — DUAL-USE prefix. In f_100e1654 (rc_impl/RenderingControl SetEQ param parser): sscanf 'FV:%zu' parses FV:<n>, then strcmp(arg+3,'GC') catches the literal 'FV:GC' form; the same function also accepts bare 'FV' and 'FVPXY' — this is the Fixed-Volume parameter space sitting alongside SubGain/SubCrossover/SpeakerSize/VolumeScalingFactor. In ContentDirectory, 'FV:2' is the favourites root container object ID (see favorites_root_map). duck.cxx uses 'FV:GC'/'FV:GC-HB'/'C-HB' as correlation IDs when forwarding duck/unduck commands to bonded peers ('Forward %s %d to %s %s', 'all secondaries', muse route {playerId}/playerVolume/unduck).

</details>

Fields: `FV prefix`, `version int \| 'GC' literal \| 'GC-HB' suffix`

<details markdown="1"><summary>Evidence (3)</summary>

- @ 0x100e18a8 — sscanf('FV:%zu') inside rc_impl SetEQ param parser; fmt at 0x10e88574
- @ 0x10e885a8 — 'FVPXY' token, same function
- @ 0x10eb40c8 — 'FV:2' favourites container literal, ContentDirectory side

</details>

## `sonos_hex_blob_line` `strong`

A hex-record line format used in binary blob dumps.

<details markdown="1"><summary><b>Technical details</b></summary>

Hex blob/record line grammar (f_10803f38): %02X: / %08X:%08X:%016llX: / %02X%02X%02X%02X%02X%02X%02X%02X:%04X:%04X — digest/ID-line serialization

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10804048 — fmts at 0x11018a84/0x11018a8c/0x11018aa0

</details>

## `sonos_http_date` `strong`

The HTTP Date header formats parsed — RFC1123/RFC850/asctime variants.

<details markdown="1"><summary><b>Technical details</b></summary>

HTTP Date parsers (f_100a6724): RFC1123 %*s %d %d:%d:%d %d%*s, RFC850 %d %n%*s %d %d:%d:%d GMT%*s, %d-%n%*\[A-Za-z\]-%d %d:%d:%d GMT%*s

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x100a67e0 — three fmts 0x10f9ba20/0x10f9ba38/0x10f9ba54

</details>

## `sonos_http_date_emit` `strong`

The Date header format the player emits.

<details markdown="1"><summary><b>Technical details</b></summary>

HTTP Date emit: %s, %02d %s %04d %02d:%02d:%02d GMT (f_100a663c)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x100a663c — fmt site

</details>

## `sonos_http_statusline` `strong`

HTTP status-line parsing variants.

<details markdown="1"><summary><b>Technical details</b></summary>

HTTP status-line parsers HTTP/%d.%d (f_100a4b24), HTTP/1.1 %d + HTTP/1.0 %d (f_106fb460 outbound client)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x106fb498 — fmts at 0x10fdb774/0x10fdb780

</details>

## `sonos_https_ep` `strong`

IPv4:port HTTPS endpoint formatting.

<details markdown="1"><summary><b>Technical details</b></summary>

HTTPS endpoint emit: https://%d.%d.%d.%d:%d — IPv4:port (f_10653a34)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10653a34 — fmt site

</details>

## `sonos_iso8601_timestamps` `strong`

ISO-8601 timestamp formats accepted in scheduling/alarm fields.

<details markdown="1"><summary><b>Technical details</b></summary>

ISO-8601 timestamp grammars (parser f_103c1f50): compact %04hu%02hu%02huT%02hu%02hu%02hu.%03huZ and extended %04hu-%02hu-%02huT%02hu:%02hu:%02hu.%03hu+%*02u:%*02u — both accepted; used by alarm/datetime fields (alarmClock XML ProgramTime etc)

</details>

Fields: `compact+extended ISO-8601 with ms and optional tz`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x103c201c — two sscanf sites in f_103c1f50; fmts at 0x10f9d4e4/0x10f9d50c

</details>

## `sonos_iv_token` `strong`

An IV= prefixed token scan — crypto init-vector handling in some payload.

<details markdown="1"><summary><b>Technical details</b></summary>

IV= prefixed token scan in f_103c0364

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x103c05cc — fmt at 0x10f98f0c

</details>

## `sonos_lastchange_attr_form` `confirmed`

Sonos puts LastChange values in attributes (<r:X val="..."/>) not elements — parse attributes, not child text.

<details markdown="1"><summary><b>Technical details</b></summary>

Sonos LastChange serializes variables in ATTRIBUTE form <r:NAME val="..."/> (rincon namespace) not element form. Recovered element set: EnqueuedTransportURI, EnqueuedTransportURIMetaData, CurrentValidPlayModes, DirectControlClientID, DirectControlIsSuspended, DirectControlAccountID, SleepTimerGeneration, RestartPending, NextTrackURI, NextTrackMetaData, AlarmRunning, SnoozeRunning (0x10eb2b38..0x10eb2e00) plus CurrentTrackURI (0x10eb2ae8)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10eb2b38 — literal family

</details>

## `sonos_linein_demo` `strong`

A line-in demo-mode settings field.

<details markdown="1"><summary><b>Technical details</b></summary>

Settings field: LineInDemoMode: \[%hu\] parsed by f_100a6ce0

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x100a6d04 — fmt at 0x10f9bfa0

</details>

## `sonos_mac_dash` `strong`

MAC address variant — dash-separated with a trailing field.

<details markdown="1"><summary><b>Technical details</b></summary>

MAC grammar variant: %02hhX-%02hhX-%02hhX-%02hhX-%02hhX-%02hhX:%*c — dash-separated + trailing char; parser f_1055e790

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1055e7c0 — fmt at 0x10fe4f8c

</details>

## `sonos_mac_parse` `strong`

MAC address parse format — colon-separated hex.

<details markdown="1"><summary><b>Technical details</b></summary>

MAC-address parser: sscanf %02hhX:%02hhX:%02hhX:%02hhX:%02hhX:%02hhX — six 2-digit hex octets; parser f_10551d68

</details>

Fields: `6 hex octets`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10551dd4 — sscanf site; fmt at 0x10fe1064

</details>

## `sonos_metadata_urn` `strong`

The rinconnetworks metadata namespace used for Sonos extension fields (e.g. rating) in DIDL.

<details markdown="1"><summary><b>Technical details</b></summary>

Metadata URN scan: urn:schemas-rinconnetworks-com:metadata-1-0/|rating — content-rating namespace parsed by f_106fa350

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x106fa66c — fmt at 0x10fd29a4

</details>

## `sonos_packed_object_id` `strong`

A packed binary object-ID format — internal handle, not user-facing.

<details markdown="1"><summary><b>Technical details</b></summary>

Packed binary object-ID grammar: sscanf %04hX%08X%08X%08X%04hX%02hhX%08X%08X%08X%08X%08X%08X%08X%08X%02X — 14-field hex-packed ID parsed by f_1032d7f8 (ContentDirectory region; likely the cpcontainer/track binary-ID form)

</details>

Fields: `14 packed hex fields`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1032d8dc — fmt at 0x10f9aad0

</details>

## `sonos_path_two_seg` `strong`

Two-segment path splitting used by internal routers.

<details markdown="1"><summary><b>Technical details</b></summary>

Two-segment path split %\[^/\]/%\[^/\] by f_1055c55c

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1055c71c — fmt at 0x10fe2f98

</details>

## `sonos_queue_doc` `strong`

Queue XML serialization — carries NumTracks and per-track entries.

<details markdown="1"><summary><b>Technical details</b></summary>

Queue doc attribute emit: " NumTracks="%u"" — the queue XML serialization writes NumTracks; emitters f_10476270, f_1047be68, f_1047df28, f_1047e16c

</details>

Fields: `NumTracks attr`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10476270 — fmt sites

</details>

## `sonos_saved_queue_file` `strong`

The saved-queue file name — savedqueues.rsq on flash.

<details markdown="1"><summary><b>Technical details</b></summary>

Saved-queue persist filename savedqueues.rsq (f_104791b0)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x104791b0 — filename literal

</details>

## `sonos_saved_queue_id` `strong`

SQ:<n> object IDs address saved queues in ContentDirectory.

<details markdown="1"><summary><b>Technical details</b></summary>

Saved-queue object-ID grammar: sscanf SQ:%d — decimal index after SQ: prefix; parsed by saved-queue workers f_10479fb8, f_1047a3bc, f_10476690, f_104794d4 (AddURIToSavedQueue/ReorderTracksInSavedQueue/queue-engine paths)

</details>

Fields: `SQ prefix`, `decimal index`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1047a050 — sscanf site; fmt at 0x10fea010

</details>

## `sonos_signed_blob_json` `strong`

A checksummed JSON envelope used for protected settings blobs (magic + length + checksum fields).

<details markdown="1"><summary><b>Technical details</b></summary>

Signed/checksummed blob envelope: {"magic":"`|_(:/)_|`","length":%u,"checksum":"0x%08X","counter":%u} parsed by f_10bf85f4 — magic literal + hex checksum integrity wrapper; RESOLVED consumer: group.cxx group effective-values persistence (grkId-keyed store, '\[Mg\]' log tag, version:11 sibling section, jump-table dispatch 0x10fb03b4)

</details>

Fields: `magic`, `length`, `checksum`, `counter`

- **consumer:** f_10bf8xxx..f_10bfefxx group.cxx family; 'internalReadEffectiveValuesLocked_jsonValue' worker

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10bf87c0 — fmt at 0x11316218

</details>

## `sonos_state_flags` `strong`

Zone state flags — frozen/allow/auto booleans controlling zone behavior.

<details markdown="1"><summary><b>Technical details</b></summary>

Zone state-flag tokens frozen:%d / allow:%d / auto:%d parsed by f_1076ff3c (zoneplayer settings path)

</details>

Fields: `frozen`, `allow`, `auto`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10770028 — three scanf sites

</details>

## `sonos_track_encryption_meta` `strong`

Track-encryption metadata elements in DIDL — method/format fields for protected content.

<details markdown="1"><summary><b>Technical details</b></summary>

Track-encryption metadata elements: <TrackEncryptionMethod>%s</..> and <TrackEncryptionFormat>%s</..> (0x10ec55fc/0x10ec5630) — DRM metadata in track docs

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10ec55fc — literals

</details>

## `sonos_track_summary_doc` `confirmed`

Queue summary documents — TrackQueueSummary/TrackSummary roots used by /status and internal APIs.

<details markdown="1"><summary><b>Technical details</b></summary>

Queue-summary doc roots: <TrackQueueSummary> (0x10ea978c) and <TrackSummary> (0x10e89708) — emitted by the /track_queue_summary + /tracks_summary diagnostic endpoints

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10ea978c — literals

</details>

## `sonos_version_pair` `strong`

Simple major.minor version strings.

<details markdown="1"><summary><b>Technical details</b></summary>

Version-pair grammar: sscanf %d.%d — major.minor; parsers f_10553e94, f_10554218

</details>

Fields: `major`, `minor`

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10553edc — sscanf site; fmt at 0x10fe1074

</details>

## `status_doc` `confirmed`

The /status diagnostic XML document grammar — the full element inventory of the diagnostic pages.

<details markdown="1"><summary><b>Technical details</b></summary>

complete /status + diagnostic XML doc element grammar

</details>

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

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — ~200 <Elem>fmt templates in rodata

</details>

## `trackqueue_rsq` `confirmed`

The live queue persistence file — the queue survives reboots via this transactional store.

<details markdown="1"><summary><b>Technical details</b></summary>

trackqueue.rsq live-queue persistence store — transactional append/replace w/ txn-id guard + range-remap algorithm

</details>

- **file:** trackqueue.rsq (live queue persistence; 'file://%s#%d' URI form, /trackqueue.rsq#0); TQD (track-queue-descriptor) context decode 'decoded len %zu exceeds buffer len %zu'
- **transactions:** append/replace are transactional: 'commitAppend'/'commitAppend (replace)' + txn-id check 'Append transaction ID mismatch. Aborting commitAppend/commitReplace'
- **replaceall:** 'ReplaceAll: search c:%d/%d m:%d r:%d cti:%d/%d'; 'mapping not valid (%u > %u)'; 'old:%d-%d new:%d-%d cur:%d new:%s/%d' — range remap algorithm
- **objects:** `trackQueue`, `trackQueueRAM`, `spotifyTrackQueue`, `savedq_mdcache`, `trackQueueSummary`, `<TrackQueueSummary>`
- **streaming_proto:** media client accepts 'HTTP/1.0 200 OK' AND 'ICY 200 OK' (Shoutcast ICY) response lines + 'metadata' marker

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — 'trackqueue.rsq' + commitAppend/commitReplace txn-id + ReplaceAll range-remap literals

</details>

## `transport_action_bits` `strong`

The fixed vocabulary behind GetCurrentTransportActions — each transport verb (Play, Stop, Pause, Next, Previous, Seek, Set) owns one bit; the player sets the bits for whatever the current source can actually do and prints the names as a comma-separated list.

- **name:** transport-action capability bitmask (GetCurrentTransportActions)
- **summary:** {name,u32} table at .rodata 0x10eb39d4 - action-name->bit map used to synthesize the CSV in GetCurrentTransportActions: Set=0x10000, X_DLNA_SeekTime=0x20000, Play=0x200000, Next=0x100000, Previous=0x400000, Pause=0x1000000, Stop=0x8000. The 'action list computed live from engine capability state' noted on that action resolves to this fixed name->bit vocabulary; which bits are set at runtime is engine-state-dependent.

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10eb39d4 — action bit table, 7 entries

</details>

## `upnp_gena_event_doc` `confirmed`

The event document root element and namespace — the wrapper around LastChange payloads.

<details markdown="1"><summary><b>Technical details</b></summary>

GENA event document: <e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"> (0x10f005b0); LastChange wrapper <LastChange>%s</LastChange> (0x10e89d80); <InstanceID val="0"> always emitted (0x10e88960)

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10f005b0 — literals

</details>

## `upnp_search_criteria_vocab` `strong`

The search-criteria grammar ContentDirectory's Search accepts (upnp:class matching).

<details markdown="1"><summary><b>Technical details</b></summary>

UPnP search-criteria grammar accepted by CD search: upnp:class = "object.container.*" and @refID exists false (0x10f0dcd4..0x10f0df24); derivedfrom operator also supported: upnp:class derivedfrom "object.item.audioItem"

</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10f0dcd4 — literal criteria samples

</details>

## `vli_mimes` `confirmed`

The MIME whitelist for VLI/queue items: AIFF, FLAC, MP4/M4A, MP3 (multiple spellings), OGG variants including x-spotify-ogg, WAV/L16, WMA, and the mpegurl playlist types. A URI whose Content-Type isn't in this set is rejected before the transport tries it — this is the accepted-codec contract.

<details markdown="1"><summary><b>Technical details</b></summary>

VLI/queue accepted MIME whitelist

</details>

Fields: `audio/x-aiff`, `audio/flac`, `audio/mp4`, `audio/x-m4a`, `audio/mpeg`, `audio/mp3`, `audio/mpeg3`, `application/ogg`, `audio/ogg`, `audio/x-spotify-ogg`, `audio/x-wav`, `audio/vnd.wave`, `audio/wma`, `audio/x-ms-wma`, `audio/x-mpegurl`, `audio/mpegurl`, `application/x-mpegurl`, `application/vnd.apple.mpegurl`, `audio/L16`, `application/dash+xml`

## `zone_audio_state` `confirmed`

The per-zone audio state block — the 37-field EQ/DSP/volume schema used in status docs.

<details markdown="1"><summary><b>Technical details</b></summary>

extended per-zone audio/EQ + queue-state status blocks

</details>

- **blocks:**
  - **volume_ducking:** <Zone><Zone>%d</Zone><UnscaledVolume><Volume><DeferredVolume><Ducked><DuckingVolume><DuckingPercent><OverrideVolume><Muted><DeferredMute><ExtSrcVolume><SurroundLevel><ZoneChannelCount></Zone>
  - **eq_full:** <Zone>...<IsSatellite><Volume><GainTrimDB><SPLdB><LoudnessSPLdB><LoudnessScaling><BassLevel><TrebleLevel><LoudnessEnabled><StereoPairEnabled><IsOnLeft><Balance{,Initial}><LeftMute><RightMute><HeightLevel><HeightLeveldB><NumBondedSubs><BondedSubModel><SubwooferEnabled><SubwooferJackConnected><DRCVolumeScaling><NightMode><DialogEnhancementLevel><TrueplayEnabled><SubLeveldB><InvertSub><ConstrainSubLevelToVolume><SubDefaultInversion><SourceGainOffsetdB><MusicSurroundLeveldB><TVSurroundLeveldB><FullSurroundMode><PlaybackStreamSampleType><MonoMode><SubCrossover>%dHz<SpeakerSize>
- **queue_status:** <Queue Name='%s'><EntriesMax><EntriesUsed><EntriesHighWater><StringTableSize><StringTableUsed><StringTableHighWater><UpdateID><ObjectID><OwnerID><Policy><CloudQueueHost></Queue>
- **updateid_vocabulary:** SystemUpdateID, ContainerUpdateIDs, FavoritesUpdateID, RadioFavoritesUpdateID, RadioLocationUpdateID, SavedQueuesUpdateID, ShareListUpdateID, NewQueueLength, NewUpdateID, QueueLengthChange, notifyUpdateID('%s',%u), GetSystemUpdateID

<details markdown="1"><summary>Evidence (1)</summary>

- firmware — rodata template literals

</details>
