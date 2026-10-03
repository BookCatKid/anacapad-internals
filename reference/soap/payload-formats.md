# Payload formats

Some command arguments look like plain text but are actually packed data: bit flags where each bit is a separate on/off switch, comma-separated tuples, and small structured documents riding inside string fields. The state-variable spec calls them 'string', but they have real internal grammar. This page decodes each packed format: which fields exist inside, what each one means, and where the format shows up. It's the difference between seeing 'a string argument' and knowing it's really a settings record.

::: details Technical details

Opaque payload/field grammars recovered from sscanf/printf templates and parser functions.

:::

## `SonosAvtStateFile`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: AVTransport save/restore on zone lifecycle (not a SOAP-visible payload).
**TODO:** Still unknown: Field-to-offset mapping and value formats per key are not yet decoded - requires the restore worker loop (loads base once, emits/consumes fields by offset).
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The vocabulary of names used in the transport's save and restore machinery: the keys the player writes when it persists playback state so it can resume after a reboot.

```
keyed field names {CurrentGroupID, OtherMembers, ..., SleepTimerState, AlarmState, StreamRestartState, SharedQueueTrackList, PrivateQueueTrackList, CurrentVLIState, CurrentAVTTrackList, CurrentSourceState, ResumePlayback, NewCoordinator, RejoinGroup, ClearSource, RestartSink, ...} serialized to /avt.txt
```

Fields: `order_in_f_102f9c00`, `order_in_f_102f9e9c`, `note`

Used by: AVTransport save/restore on zone lifecycle (not a SOAP-visible payload)

::: details Technical details

**Description**

AVT persisted-state vocabulary: contiguous name pool at 0x10eb3330-0x10eb3410 used by the AVT save/restore machinery ("/avt.txt" persistence; "Restoring AVT"/"Restored AVT from file" log lines adjacent). Field names are reached via base+offset addressing - the save/restore worker serializes these keys.

**Notes**

Field-to-offset mapping and value formats per key are not yet decoded - requires the restore worker loop (loads base once, emits/consumes fields by offset).

**Additional data**

- **workers:**
  - **read_a:** 0x102f9c00
  - **read_b:** 0x102f9e9c
  - **xml_layer_a:** 0x106f1780
  - **xml_layer_b:** 0x106f1b9c
  - **note:** all four use v\[+0x1c\] named-record lookups + f_1056157c unpack; the WRITE/serialize counterpart not yet located


:::

::: details Evidence (1)

- @ 0x10eb3330; contiguous name pool; no direct code xrefs - reached via base+offset from AVT restore worker; "/avt.txt" and restore-log strings at 0x10eb2xxx pool above

:::

## `SonosRcChannel`

**TODO:** The SonosRcChannel operand description admits unresolved detail in its accepted-value domain. Next step: trace the channel-token comparisons in the RenderingControl wrapper to enumerate the accepted tokens.

The channel names the volume and tone commands accept: 'Master', 'LF' (left-front), 'RF' (right-front), plus some extended tokens used internally. Sending an unrecognized channel name is an error, so the accepted vocabulary is documented exactly.

```
case-sensitive ASCII exact match
```

Used by: RenderingControl.GetMute; RenderingControl.SetMute (adds FocusMode); RenderingControl.GetVolume (forwarded)

::: details Technical details

**Description**

RenderingControl channel token compared verbatim by impl strcmp chains: 'Master', 'LF', 'RF' universally; 'FocusMode' accepted additionally by SetMute only (maps to impl byte +0x7f4). Unknown tokens -> impl rc 402.

**Additional data**

- **accepted_values:** `Master`, `LF`, `RF`, `FocusMode (SetMute only)`
- **parser:** per-action strcmp chains in impl fns (e.g. f_100d71e0, f_100d99b0)


:::

::: details Evidence (2)

- fn 0x100d71e0; GetMute: 3-channel map
- fn 0x100d99b0; SetMute: 4-channel map incl. FocusMode->+0x7f4

:::

## `SonosRcInstance`

The instance-number convention on the volume service: the commands expect the instance to be 0 and reject anything else. It uses a different rejection code than the transport service, a quirk worth knowing when an app gets a fault back.

```
type-tag-4 integer record
```

Used by: all RenderingControl actions (inconsistent enforcement)

::: details Technical details

**Description**

RenderingControl InstanceID convention: impls that check it accept only 0 and return 702 for nonzero (NOT 718 like AVTransport). Several impls execute the compare but leave it dead (SetVolume/worker) or never read the arg (GetTreble) - the check is inconsistent across actions.

**Additional data**

- **accepted_values:** `0 (where checked)`


:::

::: details Evidence (2)

- fn 0x100e43b4; 702 shim
- fn 0x100dcb00 @ 0x100dcb08; dead cmpwi - flag test overwrites cr7

:::

## `SonosSeekTime`

How a seek-time argument is written. When you scrub to a position, the time arrives as text with a specific grammar: an optional minus sign for 'go back', then numbers. The parser is strict enough that the exact accepted shapes were recovered, and this entry documents what the seek argument can legally look like.

```
[-]H:M:S where each component is a scanf %hhu (u8, mod-256 wrap); exactly three required; trailing junk ignored
```

Used by: AVTransport.Seek (Target for REL_TIME/TIME_DELTA, both indexed and stream modes)

::: details Technical details

**Description**

Sonos time-position operand produced by f_102ab830: an optional leading '-' sets a separate sign flag, then sscanf('%hhu:%hhu:%hhu') must convert exactly three decimal fields. Each %hhu applies strtoul semantics per component - leading whitespace skipped, own optional +/- sign allowed, result truncated to u8 so >255 wraps mod 256. The ':' separators match literally (no whitespace before them); trailing characters after the third field are ignored. Output is a {seconds_word, fraction_word=0} pair (printed as '%lld.%06lld') plus the sign byte; a leading '-' negates only the seconds word. Total range 0..934575 s (255:255:255); there is no upper-bound check.

**Notes**

Action-specific restrictions layer on top: e.g. Seek indexed mode rejects a set sign flag unless Unit==TIME_DELTA, and treats a zero-magnitude pair as a silent no-op success. Stream mode performs no sign or zero gating.


:::

::: details Evidence (1)

- fn 0x102ab830 @ 0x102ab830; sign skip via cmplwi '-' + r3+=cr4.eq; sscanf fmt at 0x10eafc7c; secs=(h*60+m)*60+s; neg on cr4.eq; stw {secs,0} pair + sign byte

:::

## `SonosTrackOrdinal`

How 'play track N' is expressed: the number you send to select a track by position. The parser accepts ordinary decimal text with the usual tolerance for spacing and signs, and this documents what counts as a valid track number.

```
decimal integer, strtol base 10; accepted lexical range 1..65534
```

Used by: AVTransport.Seek (Target for TRACK_NR, indexed mode)

::: details Technical details

**Description**

Sonos track-ordinal operand: strtol(text,NULL,10) on the raw string - base 10, leading whitespace and +/- accepted, endptr NULL so trailing junk is silently ignored ('5junk' -> 5), saturates at LONG_MIN/MAX. Acceptance range is validated on the UNMASKED strtol result as (value-1) <= 0xFFFD unsigned, i.e. exactly 1..65534; a separate u16 truncation (value & 0xffff) sizes the downstream record field and cannot wrap an out-of-range input into validity.

**Notes**

The mask-before-validate ordering looks alarming but is inert: the record field is computed pre-check, the check uses the raw value, and a rejected record is destroyed unsubmitted.


:::

::: details Evidence (1)

- fn 0x102b9088 @ 0x102b9350; strtol(r26,0,10); rlwinm &0xffff at 0x102b938c sizes the record field; addi r30,-1 + cmplwi 0xFFFD at 0x102b9394-0x102b939c validates the raw value

:::

## `codec_mime_flags`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The decoder and format flag packing: how audio-format capabilities are encoded as bit flags alongside their MIME descriptions.

::: details Technical details

**Additional data**

- **name:** codec/MIME flag tables
- **summary:** Two adjacent tables: format-name flags at .rodata 0x10ecc540 {wav=0x1, wma=0x2, adts=0x4} and the MIME->flag map at 0x10ecc618 {audio/wav\|audio/x-wav\|audio/vnd.wave=0x1, audio/wma\|audio/x-ms-wma=0x2, audio/x-mpegurl=0x8}. x-mpegurl carries bit 0x8 (playlist/m3u class) - the MIME table drives stream-type classification for HTTP fetches.


:::

::: details Evidence (2)

- @ 0x10ecc540; format flags
- @ 0x10ecc618; MIME map

:::

## `contentdir_root_map`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The top of the music library tree: the fixed root containers every browse starts from, including artists, albums, tracks, genres, playlists, and folders, recovered from the enumeration code.

Fields: `object-id prefix`, `UpdateID state variable`

::: details Technical details

**Description**

Top-level ContentDirectory browse tree recovered from the root-enumeration function (f_10303de4, 'cd' log domain): each well-known object ID is paired with its UpdateID state variable. FV:2->FavoritesUpdateID, R:0->RadioFavoritesUpdateID, R:->RadioLocationUpdateID, SQ:->SavedQueuesUpdateID, S:->ShareListUpdateID. R: prefix = radio favourites (TuneIn-era 'Favorite Stations'), SQ: = saved Sonos playlists (.rsq store), S: = music-library shares.


:::

::: details Evidence (1)

- @ 0x10304098; literal table load: FV:2, FavoritesUpdateID, R:0, RadioFavoritesUpdateID, R:, RadioLocationUpdateID, SQ:, SavedQueuesUpdateID, S:, ShareListUpdateID, near 'cdMediaServer'/'cd' domain

:::

## `device_description`

The root device-description document: the file every client fetches first, containing the player's self-description with its substitution tokens filled and the list of all 16 service specs it advertises.

::: details Technical details

**Description**

UPnP root device-description htdocs template + 35 substitution tokens; advertises 16 SCPD service descriptions

**Additional data**

- **tokens:** #UUID# #HOST# #SW_VERSION# #SW_GENERATION# #SW_MINCOMPATVER# #SW_LEGACYCOMPATVER#: template substitution into the root descriptor
- **note:** device_description.xml (htdocs) IS the served #TOKEN# template (substitutes 35 tokens (#UUID#,#HOST#,#MODEL#,#SW_VERSION#,#SW_GENERATION#,#SW_MINCOMPATVER#,#SW_LEGACYCOMPATVER#,#MAC_ADDRESS#,#SERIAL_NUM#,#API_VERSION#,#MIN_API_VERSION#,#DISPLAY_VERSION#,#EXTRA_VERSION#,#NS_VERSION#,#HW_VERSION#,#ZONETYPE#,#CD_NAMESPACE#,#MEDIASERVER_NAMESPACE#,#VENDOR_NAME#,#DISPLAY_NAME#,#VARIANT#,#RETAIL_MODE#,#HHSSL_PORT#,#SSL_PORT#,#MUSE_API_VERSIONS#,#NODE_PROTO_VERSIONS#,#HTA_FRAME_VERSIONS#,#TRUEPLAY_SDK_VERSIONS#,#AMP_ONTIME#,#INT_SPEAKER_SIZE#,#MEMORY#,#FLASH#,#QPLAY_SUPPORT#,#API_VERSION#). It DOES advertise SCPDs) 16 <SCPDURL>/xml/<Svc>1.xml elements. AudioIn is NOT in the advertised serviceList (consistent with its reject-all stub). ContentDirectory serviceType is the #CD_NAMESPACE# runtime token (upnp-org vs sonos-com CD namespace substituted per build).
- **advertised_services:** 16: AlarmClock,MusicServices,DeviceProperties,SystemProperties,ZoneGroupTopology,GroupManagement,HTControl,QPlay,ContentDirectory(#CD_NAMESPACE#),ConnectionManager(MS),RenderingControl,ConnectionManager(MR),AVTransport,Queue(sonos-com),GroupRenderingControl,VirtualLineIn: AudioIn absent (internal stub)


:::

::: details Evidence (1)

- firmware; rodata template literals

:::

## `didl_cdudn_desc`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

A special descriptor element in track metadata: the 'cdudn' desc that tags which content directory an item came from. It lets the system trace an item back to its source library.

::: details Technical details

**Description**

DIDL desc element: <desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">: ContentDirectory UDN descriptor (0x10eb0c4c)


:::

::: details Evidence (1)

- @ 0x10eb0c4c; literal

:::

## `didl_lite`

The track-metadata format end to end: the XML envelope carrying title, artist, album, artwork, class, and resource for every track the player describes, plus the Sonos-specific extension fields. This is the single most-seen document in the system, because everything 'now playing' passes through it.

::: details Technical details

**Description**

DIDL-Lite metadata envelope + full object.* class/protocolInfo/search-criteria grammar + r: rinconnetworks extension ns

**Additional data**

- **root:** <DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">: r: is the Sonos extension ns
- **classes:** `object.item`, `object.item.playlistItem`, `object.item.sonos-favorite`, `object.item.audioItem.musicTrack{,.recentShow}`, `object.item.audioItem.audioBroadcast{,.live}`, `object.item.audioItem.linein{,.homeTheater,.airplay,.bluetooth}`, `object.item.audioItem.{podcast,show,audioBook.chapter}`, `object.container.{album.musicAlbum{,.compilation},playlistContainer{,.sameArtist,.tracklist},albumlist,person.musicArtist,person.composer,genre.musicGenre,podcast,sonos-searchTypes}`
- **protocolInfo:** `x-rincon-{playlist,queue}:*:*:*`, `x-sonos-vli:*:audio:*`, `file:*:audio/mpegurl:*`, `spdif`, `http-get:*`
- **search_grammar:** SearchCriteria supports: derivedfrom + @refID exists + = + and; '+'-prefixed sort keys; projections 'dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber'; microsoft:artistAlbumArtist (WMP interop)
- **dom_keys:** \|DIDL-Lite\|item\|container\|res\|vli element keys; 'truncated DIDL metadata' bounds


:::

::: details Evidence (1)

- firmware; DIDL-Lite template + object.* class vocabulary + protocolInfo literals + search-criteria predicates in rodata

:::

## `didl_lite_header`

The opening lines of the track-metadata XML the player emits when describing tracks: the namespace declarations every track description starts with.

::: details Technical details

**Description**

DIDL-Lite document header (verbatim literal at 0x10ee8958): <DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">


:::

::: details Evidence (1)

- @ 0x10ee8958; literal

:::

## `didl_res_protocolinfo`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

How a track's resource line describes its format: the 'protocolInfo' field pattern the player writes per source scheme, declaring the MIME type and addressing each item uses.

::: details Technical details

**Description**

DIDL res protocolInfo emitters by scheme: x-rincon-playlist:*:*:* (0x10e89314), x-rincon-queue:*:*:* (0x10ebb874), x-rincon-mp3radio:*:*:* (0x10ec11a8), x-sonosapi-show:*:*:* (0x10ec11d8), file:*:audio/mpegurl:* (0x10ed33dc)


:::

::: details Evidence (1)

- @ 0x10e89314; literal family

:::

## `fixed_volume_tokens`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

'FV' markers and related tokens the tone machinery parses for fixed-volume handling: the small vocabulary inside the extended-EQ router that decides when volume stays locked.

Fields: `FV`, `FV:<n>`, `FV:GC`, `FV:GC-HB`, `FVPXY`

::: details Technical details

**Description**

RenderingControl-internal token space parsed by the extended SetEQ/EQType dispatcher in rc_impl: 'FV' (bare), 'FV:%zu' (numeric form), 'FV:GC' (group-coordinator), 'FV:GC-HB' (coordinator with household-bonded satellites), 'FVPXY'. Sits in the same dispatcher as SubGain, SubCrossover, SubPolarity, SpeakerSize, VolumeScalingFactor: i.e. the hidden home-theatre parameter surface exposed through the EQ-type argument.


:::

::: details Evidence (1)

- @ 0x100e173c; strncasecmp 'FV:' / strcmp 'FV' / strcasecmp 'FVPXY' chain in f_100e1654

:::

## `gena_event_envelope`

The wire envelope of a classic event notification: the propertyset body plus the headers (event type, sequence number, subscription ID, and Sonos's own boot counter) that make a notification a valid subscription message.

::: details Technical details

**Description**

GENA event wire envelope: <e:propertyset>/<e:property> var elements + NT/NTS/SEQ/SID + X-RINCON-BOOTSEQ/VARIANT headers

**Additional data**

- **grammar:** <e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"><e:property><VAR>val</VAR></e:property>...</e:propertyset>
- **note:** GENA event body: DOM node 'urn:schemas-upnp-org:event-1-0\|propertyset'; each changed var emitted as <e:property> wrapper via f_10676a44
- **headers:** NT: upnp:event \| NTS: upnp:propchange \| SEQ: %d \| Sonos extensions X-RINCON-BOOTSEQ:%s X-RINCON-VARIANT:%u; 403 on denial; version-conditional eventing ('DiscoveredZP using %s eventing')


:::

::: details Evidence (1)

- fn f_10676a44 @ 0x10676a44; e:propertyset/e:property literals + ns key 'urn:schemas-upnp-org:event-1-0\|propertyset' at rodata 0x10eec165; NT/NTS/SEQ/X-RINCON headers in upnpeventing_sender.cxx

:::

## `group_effective_values_blob`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

A second signed-blob variant: the version-11 sibling envelope used for group effective-values data, with its own magic marker distinguishing it.

::: details Technical details

**Description**

Version-11 sibling section of sonos_signed_blob_json: ',\n{"magic":"(=^+^=)","version":11}\]' terminator emitted/parsed by the same group.cxx effective-values family


:::

::: details Evidence (1)

- @ 0x10bf8058; literal at 0x10fb035c; second site 0x10bf8a94

:::

## `http_status_map`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The player's HTTP status-code tables: two parallel maps translating internal results into web status codes, covering the extended set of statuses its web layer can emit.

::: details Technical details

**Description**

| SECOND parallel map @0x10f94fa8 (51 entries, HTTP-status domain {400,401,403,404,405,409,410,412,415,417,490,491,499,500,501,503,504}): \[499,499,499,499,499,499,499,415,499,404,500,504,403,403,400,400,400,404,400,400,499,403,401,499,412,499,410,409,410,499,499,499,404,404,404,405,401,503,499,404,404,499,499,400,400,400,417,490,491,499,500\]. Neither map has a direct lis/addi reference - reached via computed base (names-table-relative) or object-field; index alignment with muse_result_codes segments is inferred, NOT proven (map2\[0\]=499 does not match OK->200 naively).

**Additional data**

- **name:** HTTP status mapping table (objectStatusMap)
- **summary:** .rodata table at 0x10f94ec4 (+second page 0x10f94fa8): dense u16/u32 HTTP-status index->code map with sentinel 499. Recognized values {400,401,403,404,405,409,410,412,415,417,490,491,499,500,501,503,504}; unmapped -> 499. Consumed by the client-error mapping layer f_1038e82c ('Client error' string, internal codes {401,402,501,1000,1001,1002,1004}) - this is the 'objectStatusMap' referenced by the auth-layer string 'Error code not found in objectStatusMap'. HTTP errors from SMaPI/lechmere/cloud calls are normalized through this table into the internal fault space.


:::

::: details Evidence (3)

- @ 0x10f94ec4; status map table, 499 sentinel
- @ 0x1038e82c; client-error mapper fn; internal codes {401,402,501,1001,1002,1004}
- @ 0x10f94fa8; second HTTP-status map, 51 u32 entries; layout sits immediately after map1 and before the ERROR_* name strings

:::

## `itunes_plist_importer`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The vocabulary of the iTunes-library importer: the keys the player recognizes when importing an iTunes XML playlist file. It's the bridge that lets an iTunes library become a Sonos library.

::: details Technical details

**Description**

iTunes-library XML plist import vocabulary (rodata key table @0x11091a24 cluster)

**Notes**

Apple plist-XML grammar keys; importer maps iTunes XML library (Tracks/Playlists/Master structure) into the content index. Adjacent to selthrd.RIRDecoder/RHWEvtHandlerZP thread descriptors

**Additional data**

- **keys:** `Audiobooks`, `Location`, `Master`, `Movies`, `Music`, `Name`, `Playlist ID`, `Playlist Items`, `Playlist Persistent ID`, `Playlists`, `TV Shows`, `Track ID`, `Tracks`, `array`, `dict`, `integer`, `key`, `plist`, `string`, `true`


:::

::: details Evidence (1)

- firmware; rodata plist-key table 0x11091a24; Master/Track ID/Playlist Persistent ID/Audiobooks literal keys

:::

## `lastchange_templates`

The three LastChange document roots: the envelope shapes each service's bundled-change report uses, with their per-service namespaces. Every service uses one of these roots, and this is the shared shape underneath the per-service details.

::: details Technical details

**Description**

the three LastChange/Event doc root templates + per-service xmlns

**Additional data**

- **templates:**
  - **AVTransport:** <Event xmlns="urn:schemas-upnp-org:metadata-1-0/AVT/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/"> @0x10eb29e8: uses r: extension ns
  - **RenderingControl:** <Event xmlns="urn:schemas-upnp-org:metadata-1-0/RCS/"> @0x10e88928: standard upnp-org ns, no r:
  - **Queue:** <Event xmlns="urn:schemas-sonos-com:metadata-1-0/Queue/"> @0x10ed1c6c: schemas-sonos-com (proprietary, NOT upnp-org)
- **model:** <Event> root + <VarName val="..."/> attribute-form var elements inside (LastChange/Event doc); only these 3 services emit LastChange
- **var_sets:**
  - **RenderingControl:** Volume{Master,LF,RF}, Mute{Master,LF,RF}, Bass, Treble, Loudness{Master}, OutputFixed, SpeakerSize, SubGain, SubCrossover, SubPolarity, SubEnabled, DialogLevel, SpeechEnhanceEnabled, SupportsMaxDialogLevel, SurroundLevel, MusicSurroundLevel, AudioDelay, AudioDelay{Left,Right}Rear, NightMode, SurroundEnabled, SurroundMode, HeightChannelLevel, SonarEnabled, SonarCalibrationAvailable, PresetNameList='FactoryDefaults'; <VolumeScale>%u</VolumeScale> elem; per-channel Master/LF/RF for stereo pairs
  - **AVTransport:** inside <InstanceID val='0'>: TransportState, CurrentPlayMode, CurrentCrossfadeMode, NumberOfTracks, CurrentTrack, CurrentSection, CurrentTrack{URI,Duration,MetaData}, PlaybackStorageMedium, AVTransportURI{,MetaData}, NextAVTransportURI{,MetaData}, CurrentTransportActions, TransportStatus, TransportError{Description,URI,HttpCode,HttpHeaders}; fixed NOT_IMPLEMENTED: TransportPlaySpeed, CurrentMediaDuration, RecordStorageMedium, PossibleRecordStorageMedia, RecordMediumWriteStatus, CurrentRecordQualityMode, PossibleRecordQualityModes; PossiblePlaybackStorageMedia='NONE, NETWORK'
  - **Queue:** QueueOwnerID %s, QueueID %.20s, UpdateID %u, Curated (truncated): QueueID capped 20 chars
  - **note:** <LastChange>%s</LastChange>: the e:property value is the escaped XML doc


:::

::: details Evidence (1)

- firmware; three <Event> template open-tags in rodata w/ distinct xmlns

:::

## `ncd_device_payload`

The factory-default configuration blob: the template of non-volatile config data programmed into each unit at manufacture, found embedded in the firmware as a payload.

::: details Technical details

**Description**

device-payload.bin (section type 13, 54757B) = the factory-default NCD (non-volatile config data) template programmed per-device at manufacturing. Header 0009 0ff0 0ff0 0ff0 0ff0 0000 0161; ASCII node "top_level.ncd;UserID=0xFFFFFFFF"; tagged records {tag u8, len u8, data}: 62="3s50avq100" (limelight board ID), 63="2012/06/14", 64="23:19:49" (template mfg date, the ORIGINAL 2012 Playbar factory image embedded verbatim in the 2026 update), 65=20x0xFF empty serial/MAC slots; ffaa99 marker @0x7e; then packed field records with nibble-typed tags (30/31/32/33 container+attr, 20* = 16-char space-padded placeholder strings). Serial/MAC/calibration fields shipped EMPTY, filled at factory. This is the blob mdputil -B initializes.


:::

## `protocolinfo`

The full capability vocabulary the player declares in its format strings: every MIME type and scheme it claims to send or accept. It's the complete 'what can this box play' contract.

::: details Technical details

**Description**

ConnectionManager protocolInfo capability set (libavcodec decoder): complete sink/source mime+scheme vocabulary

**Additional data**

- **decoder:** libavcodec.so.59 (FFmpeg avcodec): avcodec_{find_decoder,alloc_context3,parameters_to_context,open2,send_packet,receive_frame,flush_buffers,free_context}; 'starting %s audio decoder at %d.%06d (dc:%d.%06d)' timed decode
- **sink_protocolInfo:** http-get: and x-file-cifs: x {audio/{mp3,mp4,x-m4a,mpeg,mpegurl,x-mpegurl,mpeg3,wav,x-wav,wma,x-ms-wma,aiff,x-aiff,flac,ogg}, application/{x-mpegurl,vnd.apple.mpegurl,dash+xml,ogg}} + file:*:audio/mpegurl:* + sonos.com-{mms:*:audio/x-ms-wma:*, http:* x same mime set, spotify:*:audio/x-spotify:*, rtrecent:*:audio/x-sonos-recent:*} + x-rincon{,-mp3radio,-playlist,-queue,-stream}:*:*:* + x-sonosapi-{stream,hls,hls-static}:*:*:* + x-sonosapi-radio:*:audio/x-sonosapi-radio:* + x-rincon-cpcontainer:*:*:* + real.com-rhapsody-direct:*:audio/mp3:*
- **source_protocolInfo:** file:*:audio/mpegurl:*,x-file-cifs:*:*:*,x-rincon:*:*:*,x-rincon-{mp3radio,playlist,queue,stream}:*:*:*
- **source_full:** file:*:audio/mpegurl + x-file-cifs:*:*:* + http-get/x-file-cifs:*: with {mp3,mp4,x-m4a,mpeg,mpegurl,x-mpegurl,apple.mpegurl,dash+xml,mpeg3,wav,x-wav,wma,x-ms-wma,aiff,x-aiff,flac,ogg} + sonos.com-{mms,http,spotify,rtrecent} + x-sonosapi-{stream,hls,hls-static,radio} + x-rincon-{mp3radio,playlist,queue,stream,cpcontainer} + real.com-rhapsody-direct + pandora.com-pndrradio + audio/vnd.radiotime
- **content_types:** application/sonos_service_catalog.v1.xml (SMAPI catalog) + application/merge-patch+json (RFC7396) + application/xml;listing + application/dns-message (DoH) + image/{jpg,gif,png,svg+xml} + application/pdf + audio/{vnd.wave,L16}
- **audio_types:** audio/{aacp,aac,x-aac,x-scpls,wav,aiff,x-aiff,flac,mp4,x-m4a,mpeg,mp3,mpeg3,ogg,x-spotify-ogg,x-wav,vnd.wave,wma,x-ms-wma,x-mpegurl,mpegurl,L16}


:::

::: details Evidence (1)

- firmware; giant protocolInfo literal in rodata + libavcodec.so.59 dynamic dependency + codecout decoder trace

:::

## `savedqueues_rsq`

The saved-playlists file format: the structure of the file where Sonos playlists persist, with per-playlist records carrying versioning and track lists. It's written atomically so a crash can't leave a corrupt store.

Fields: `LastUpdateDevice`, `Version`, `Next`, `Curated`, `NumTracks`

::: details Technical details

**Description**

savedqueues.rsq persisted-queue store: SavedQueues/SavedQueue XML w/ LUD+Version+Next+Curated+NumTracks, atomic .tmp write, gzip

**Notes**

replicated via nodetx like netsettings; 'Migrated tracks for account sn=%u' migration path; 'Reorder tracks returned %u. QueueID: %d; Tracks: %s; NewPos: %s'

**Additional data**

- **file:** file:///jffs/settings/savedqueues.rsq (atomic write via .tmp; dir savedqueues.d.rsq; 'application/gzip' adjacency suggests gzip variant)
- **grammar:** <SavedQueues LastUpdateDevice="%s" Version="%u" Next="%s"><SavedQueue Id=".." Curated=".." NumTracks=".."><track elements/></SavedQueues>
- **validation:** `'Replicated SavedQueue file is not valid'`, `'SavedQueue file at boot is not valid'`, `'Could not import saved queues file'`, `'Could not access playlists'`, `'Could not find given playlistId'`


:::

::: details Evidence (1)

- firmware; '/jffs/settings/savedqueues.rsq' + SavedQueues LastUpdateDevice/Version/Next/SavedQueue Id/Curated/NumTracks literals

:::

## `scpd`

The service-specification documents: the advertised command lists served at /xml/*.xml, describing what the product claims to support as distinct from what the binary actually implements. This page's whole availability story rests on that comparison.

::: details Technical details

**Description**

SCPD (Service Control Point Definition) XML served at /xml/<Svc>1.xml: advertised via <SCPDURL> in device_description

**Additional data**

- **files:** 21 XML files in opt/htdocs/xml: 16 advertised SCPDs + AudioIn1.xml (unadvertised) + device_description.xml + group_description.xml + musicservices.xml + xsl
- **advertised_actions:** 208 total actions across 16 services; 414 in-args, 206 out-args; state-variable tables per service
- **advertised_not_implemented:** 8 advertised actions not individually dispatched in 86.10: 6 AudioIn (real impl 34.16/57.10 -> reject-all 401 stub in 86.x) + ProvisionCredentialedTrialAccountX (dispatched 34.16, hard-removed 57.10+, stale ad) + ResetThirdPartyCredentials (dispatched 34.16, soft-removed 57.10+, dead string). All other advertised actions dispatched in every build.
- **satellite_template:** opt/htdocs/xml/satellite_device.xml (m8 rootfs) (the bonded-satellite device description: deviceType urn:schemas-upnp-org:device:ZonePlayer:1 with #PLACEHOLDER# vars {#HOST#, #VENDOR_NAME#, #DISPLAY_NAME#, #UUID#, #MODEL#, #SW_VERSION#, #SW_GENERATION#, #HW_VERSION#, #SERIAL_NUM#, #MAC_ADDRESS#, #SW_MINCOMPATVER#, #SW_LEGACYCOMPATVER#, #API_VERSION#, #MIN_API_VERSION#, #DISPLAY_VERSION#, #EXTRA_VERSION#, #NS_VERSION#, #NODE_PROTO_VERSIONS#} + icon /img/icon-#MODEL#.png) the substitution vocabulary for device-description rendering; satellites re-advertise as ZonePlayer:1.


:::

::: details Evidence (1)

- firmware; opt/htdocs/xml/*.xml + device_description.xml SCPDURL

:::

## `scrobble_submission`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The scrobbling submission format: the form a last.fm-style 'now playing report' takes when the player submits your listening history to a scrobble service, carrying session, artist, title, timestamp, and source per track.

Fields: `s`, `a\[\]`, `t\[\]`, `i\[\]`, `o\[\]`, `r\[\]`, `l\[\]`, `b\[\]`, `n\[\]`, `m\[\]`

::: details Technical details

**Description**

Audioscrobbler submissions-protocol form body: s=<session>&a\[n\]=artist&t\[n\]=title&i\[n\]=timestamp&o\[n\]=source&r\[n\]=rating&l\[n\]=secs&b\[n\]=album&n\[n\]=tracknum&m\[n\]=MBID. Handshake GET /?hs=true&p=1.2&c=<client>; BADTIME answered by re-reading the HTTP Date: header.


:::

::: details Evidence (1)

- @ 0x10523e18; 's=' then &a\[0\]= &t\[0\]= &i\[0\]= &o\[0\]= &r\[0\]=&l\[0\]= &b\[0\]= &n\[0\]= &m\[0\]= emit order in f_105236c8

:::

## `skip_restriction_bits`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The packed skip-restriction flags: the bits describing what a source forbids (no next, no previous), used when a service constrains navigation.

::: details Technical details

**Additional data**

- **name:** skip/restriction bitmask (stream restriction enum)
- **summary:** {name,u32} table at .rodata 0x10ed9d30 - proven bit values for the restriction enum previously documented name-only: 'Already Paused'=0x2, 'Not Paused'=0x4, 'License Restriction'=0x8, 'Ad'=0x10, 'No Previous Track'=0x20, 'No Next Track'=0x40. Bit0/0x1 unused in the table; 'Restriction Unknown'/'Full reset' are non-table sentinels. These bits are what SMaPI streams OR into their skip/track-control metadata (e.g. Ad blocks skip).


:::

::: details Evidence (1)

- @ 0x10ed9d30; restriction bit table, 6 entries

:::

## `smapi_capability_bits`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The capability bitfield for music-service integrations: the packed flags word where each bit declares a feature a service supports (seeking, skipping, metadata kinds), decoded bit by bit.

::: details Technical details

**Additional data**

- **name:** SMaPI capability bitmask (Capabilities field)
- **summary:** {name,u32} table at .rodata 0x10e769cc - the full 22-bit SMaPI Capabilities vocabulary with PROVEN bit assignments: search=0x1, trFavorites=0x2 (track favorites), authorizationHeader=0x8, alFavorites=0x10 (album), arFavorites=0x20 (artist), logging=0x40, extendedMD=0x200, disableAlarms=0x400, ucPlaylists=0x800 (user-content playlists), playbackLogging=0x1000, accountLogging=0x2000, noMultiAccount=0x4000, mediaUriActions=0x8000, contextHeaders=0x10000, deviceCerts=0x20000, playerIds=0x40000, contextReporting=0x80000, userInfo=0x100000, contentFiltering=0x200000, manifest=0x400000, radioExtendedMD=0x800000, playlistExtendedMD=0x1000000. This is the bitmask OR'd into a music service's Capabilities value; the favorites trio (tr/al/ar) gates which favorite classes a service may contribute to the FV: store.


:::

::: details Evidence (1)

- @ 0x10e769cc; {name,flag} table, 22 entries, 8-byte records

:::

## `soap_envelope`

The request and response envelope: the wrapping document every command call and reply is built inside, consisting of header, body, and the per-command element naming the operation and its service.

::: details Technical details

**Description**

SOAP request/response/fault wire envelope: <s:Envelope><s:Header><s:Body><u:{action}{Response} xmlns:u={serviceType}> + UPnPError fault + secure/sensitive param redaction

**Additional data**

- **request_parse:** recognizes http://schemas.xmlsoap.org/soap/envelope/\|{Envelope,Header,Body,Fault} ns-qualified paths
- **response:** <s:Envelope xmlns:s="soap/envelope/" s:encodingStyle="soap/encoding/"><s:Header>{hdrs}</s:Header><s:Body><u:{action}{suffix} xmlns:u="{serviceType}">...</u:{action}{suffix}></s:Body></s:Envelope>
- **generic_elem:** <%s%s xmlns="%s">: non-u:-prefixed element form also emitted
- **fault:** <s:Fault><faultcode>s:Client</faultcode><faultstring>UPnPError</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>%d</errorCode>\[<errorDescription>%s</errorDescription>\]</UPnPError></detail></s:Fault>: faultcode always s:Client; detail carries UPnPError{errorCode,errorDescription}
- **param_redaction:** SOAP params flagged secure/sensitive/trackIDing ('not logging %s, sensitive' + 'not logging %s, secure %d, prevent %d, sensitive %d, trackIDing %d' + 'Invalid secure param %s') credential/PII params excluded from logging


:::

::: details Evidence (1)

- firmware; envelope+fault+redaction literals at strings ~147624

:::

## `soap_envelope_variants`

The two envelope openings the command layer uses: one with an explicit encoding-style declaration and one without. Both wrap the same request and response bodies.

::: details Technical details

**Description**

Two SOAP envelope open-templates: with encodingStyle (0x10eebc90: s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/") and without (0x10eebd10). Action body wrapper: <u:%s%s xmlns:u="%s"> (0x10eebd78): action-name, in-arg block, service URN


:::

::: details Evidence (1)

- @ 0x10eebc90; literal pair + u: wrapper at 0x10eebd78

:::

## `soap_fault_wire`

The body of a fault reply: the exact document skeleton every error response is built as, carrying the code and description fields that tell a caller what failed.

```
<s:Fault><faultcode>s:Client</faultcode><faultstring>UPnPError</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>%d</errorCode></UPnPError></detail></s:Fault>
```

Used by: all 199 action fault paths via req->v\[+0x14\]

::: details Technical details

**Description**

SOAP fault body emitted for every req->v\[+0x14\] fault. DOM-built via ns|localname element keys (rodata '...control-1-0|UPnPError', '.../envelope/|Body', '.../envelope/|Envelope' at 0x10eec165 family). The code is stored at req+0x10 by f_10731560 and rendered as digits; faultcode is fixed 's:Client', faultstring fixed 'UPnPError'. There is NO errorDescription element - the numeric code is the entire machine-visible vocabulary.

**Notes**

{'literal_rodata': 'prefix 0x10eebdcc, suffix 0x10eebe60', 'code_vocabulary': '705 verified vtable+0x14 dispatch sites: literal codes {0,1..17,100,250,252,255,401,402,10048}; 582 sites pass computed worker/subsystem rc (bounded per-worker into error bounded_domain). Log-level split at code>=1000 in f_10731560.', 'proven_code_set': 'union of all literal-code records + worker bounded_domain exits: {0,401,402,501,701,702,706,710,711,712,717,718,800,801,802,803,804,808,810,1000,1028,1240} - 401/402 request-layer, 501 action-failed, 701-721 UPnP-AV standard (718=invalid instanceID, 42 sites), 800-811 queue/CD family, 1000+ Sonos-internal (level-8 logging)'}


:::

::: details Evidence (1)

- fn 0x10731560 @ 0x10eebdcc; literal doc pieces 0x10eebdcc/0x10eebe60; DOM keys 0x10eec165; raise-fault stores code at req+0x10, level-8 log when >=1000

:::

## `soapaction_header`

The command-name header: the HTTP header that says which operation a request wants (service type plus action name). It's the routing key telling the player which command to run.

::: details Technical details

**Description**

SOAPACTION HTTP header grammar: SOAPACTION: "{serviceType}#{action}" targeting the control endpoint

**Additional data**

- **form:** SOAPACTION: "{serviceType}#{action}" / SOAPACTION: "%s%s%s" / "%s#%s"
- **semantics:** UPnP-standard quoted serviceType#actionName targeting the control endpoint


:::

::: details Evidence (1)

- firmware; SOAPACTION templates

:::

## `sonos_access_settings_json`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The template of the access-control settings document: the small JSON record controlling restricted-admin and read-access levels on the player.

Fields: `version`, `lastUpdateDevice`, `named-permission entries`

::: details Technical details

**Description**

Access-control settings document template: \[{"version":%u,"lastUpdateDevice":"%24s"}, \[{"name":"restricted-admin", "readPer...: JSON permission list parsed by f_105c7248 (two scanf passes)


:::

::: details Evidence (1)

- @ 0x105c72e0; fmt at 0x10fe58a4

:::

## `sonos_alarm_doc`

The alarm document's opening structure: the versioned envelope the stored alarm list is written in, carrying which device last updated it.

::: details Technical details

**Description**

Alarm document grammar: <Alarms LastUpdateDevice="%s" Version="0" SchemaVersion="%d"> / <AlarmClock LastUpdateDevice="%s" Version="0"> containers; alarm-state section <Alarm><Mode><Scheduler><UTCTime><LocalTime><Pending><PendingAlarm> with <ID>%u</ID> <Type>%s</Type> <Time>%s</Time> <TimeUTC> <Recurrence>%s</Recurrence> <NextUTC> <NextLocal> (0x10eaab44..0x10eab564)


:::

::: details Evidence (1)

- @ 0x10eaab44; literal family

:::

## `sonos_audio_settings_line`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The packed audio-settings line: a compact serialization stuffing every tone and volume setting into one text record, covering volume, balance, bass, treble, loudness, and the surround and sub fields in a fixed order.

Fields: `AMV`, `LV`, `RV`, `B`, `T`, `L`, `F`, `SS`, `LEV`, `SW`, `SC`, `SP`, `DL`, `SL`, `AD`, `NM`

::: details Technical details

**Description**

Packed audio-settings serialization: AMV%hd LV%hd RV%hd B%hd T%hd L%c F%c SS%hd LEV%hd SW%c SC%hd SP%hd DL%hd SL%hd AD%hd NM%...: {autoplay-music-vol, line-in-vol, rec-vol, bass, treble, loudness, fixed, sub…} emitted by f_100d78a4


:::

::: details Evidence (1)

- @ 0x100d78a4; fmt site

:::

## `sonos_browse_filter_vocab`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

Which metadata fields a browse request can ask for: the accepted filter lists (title, artist, album, duration, resource) so callers know what they can select back.

::: details Technical details

**Description**

Browse-filter capability lists: dc:title,upnp:artist,upnp:album,res@duration,res (0x10e942a8) and dc:title,res,res@duration,upnp:artist,upnp:artist@role,upnp:album,upnp:originalTrackNumber (0x10f0dfa0) + sort fragments +upnp:album,+upnp:originalTrackNumber,+dc:title,+microsoft:artistAlbumArtist


:::

::: details Evidence (1)

- @ 0x10e942a8; literal lists

:::

## `sonos_buzzer_uri`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The file paths of the built-in alarm buzzers: where the speaker's own software keeps its wake-up tones. These files live inside the device's storage and aren't something you can browse to or change.

::: details Technical details

**Description**

Buzzer asset URIs: file:///opt/buzzers/%s and file://%s/buzzers/0.mp3 (f_1026badc, f_10278354: alarm-tone emitters)


:::

::: details Evidence (1)

- @ 0x1026badc; fmt sites

:::

## `sonos_class_audioBook`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The object class for audiobook items: the tag marking a library item as an audiobook rather than music, so apps can shelve it correctly.

::: details Technical details

**Description**

<upnp:class>object.item.audioItem.audioBook: audiobook item class literal (0x10ec1258)


:::

::: details Evidence (1)

- @ 0x10ec1258; literal

:::

## `sonos_diag_filename`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The diagnostic filename pattern: IP address plus date and time baked into the name, so a diagnostics bundle names which machine and moment it came from at a glance.

::: details Technical details

**Description**

Diagnostic/log filename grammar: %d.%d.%d.%d_%4d-%2d-%2d_%2d-%2d-%2d: IPv4_date_time; parser f_10d96b10


:::

::: details Evidence (1)

- @ 0x10d96bcc; fmt at 0x11028dfc

:::

## `sonos_duration_hhmmss`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

How durations are written: the sleep timer's hours:minutes:seconds format, where 'stop in 20 minutes' travels as 00:20:00. This documents the exact accepted shape of the duration argument.

Fields: `HH`, `MM`, `SS`

::: details Technical details

**Description**

SleepTimer duration argument grammar: sscanf format %02hu:%02hu:%02hu (HH:MM:SS, three 2-digit unsigned-short fields; parser f_10c3d2c4 returns success only when all 3 fields convert (else 402 upstream) (variant %hhu:%hhu:%hhu parser at f_102ab830) same grammar, non-zero-padded accepted)


:::

::: details Evidence (2)

- @ 0x10c3d2c4; sscanf call site; fmt string at 0x10fb1618 = %02hu:%02hu:%02hu
- @ 0x102ab890; variant sscanf %hhu:%hhu:%hhu at 0x102ab830; fmt at 0x10f9b47c

:::

## `sonos_favorites_version`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The 'FV:' version token: a marker used in two different places, inside the EQ parameter machinery and as a favorites-list version. It's documented separately so the same-looking token isn't misread.

Fields: `FV prefix`, `version int \| 'GC' literal \| 'GC-HB' suffix`

::: details Technical details

**Description**

FV: token grammar (DUAL-USE prefix. In f_100e1654 (rc_impl/RenderingControl SetEQ param parser): sscanf 'FV:%zu' parses FV:<n>, then strcmp(arg+3,'GC') catches the literal 'FV:GC' form; the same function also accepts bare 'FV' and 'FVPXY') this is the Fixed-Volume parameter space sitting alongside SubGain/SubCrossover/SpeakerSize/VolumeScalingFactor. In ContentDirectory, 'FV:2' is the favourites root container object ID (see favorites_root_map). duck.cxx uses 'FV:GC'/'FV:GC-HB'/'C-HB' as correlation IDs when forwarding duck/unduck commands to bonded peers ('Forward %s %d to %s %s', 'all secondaries', muse route {playerId}/playerVolume/unduck).


:::

::: details Evidence (3)

- @ 0x100e18a8; sscanf('FV:%zu') inside rc_impl SetEQ param parser; fmt at 0x10e88574
- @ 0x10e885a8; 'FVPXY' token, same function
- @ 0x10eb40c8; 'FV:2' favourites container literal, ContentDirectory side

:::

## `sonos_hex_blob_line`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The hex-dump record line format: colon-separated hex fields of specific widths, a debugging line shape the player parses.

::: details Technical details

**Description**

Hex blob/record line grammar (f_10803f38): %02X: / %08X:%08X:%016llX: / %02X%02X%02X%02X%02X%02X%02X%02X:%04X:%04X: digest/ID-line serialization


:::

::: details Evidence (1)

- @ 0x10804048; fmts at 0x11018a84/0x11018a8c/0x11018aa0

:::

## `sonos_http_date`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

How the player reads HTTP Date headers. The three date spellings web standards allow are all accepted, so servers writing any of them parse correctly.

::: details Technical details

**Description**

HTTP Date parsers (f_100a6724): RFC1123 %*s %d %d:%d:%d %d%*s, RFC850 %d %n%*s %d %d:%d:%d GMT%*s, %d-%n%*\[A-Za-z\]-%d %d:%d:%d GMT%*s


:::

::: details Evidence (1)

- @ 0x100a67e0; three fmts 0x10f9ba20/0x10f9ba38/0x10f9ba54

:::

## `sonos_http_date_emit`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

How the player writes HTTP Date headers: the single canonical date format it emits when dating its own responses.

::: details Technical details

**Description**

HTTP Date emit: %s, %02d %s %04d %02d:%02d:%02d GMT (f_100a663c)


:::

::: details Evidence (1)

- @ 0x100a663c; fmt site

:::

## `sonos_http_statusline`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

How the player reads an HTTP status line: the 'HTTP/1.1 200' shape its own HTTP client and server machinery parses.

::: details Technical details

**Description**

HTTP status-line parsers HTTP/%d.%d (f_100a4b24), HTTP/1.1 %d + HTTP/1.0 %d (f_106fb460 outbound client)


:::

::: details Evidence (1)

- @ 0x106fb498; fmts at 0x10fdb774/0x10fdb780

:::

## `sonos_https_ep`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The secure-endpoint address pattern: 'https://' plus IP and port, which is how a direct secure endpoint is written when the player names one.

::: details Technical details

**Description**

HTTPS endpoint emit: https://%d.%d.%d.%d:%d: IPv4:port (f_10653a34)


:::

::: details Evidence (1)

- @ 0x10653a34; fmt site

:::

## `sonos_iso8601_timestamps`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

How timestamps are written. Two shapes are accepted: the compact form (20241031T153000.000Z) and the dashed extended form, used wherever times travel in arguments.

Fields: `compact+extended ISO-8601 with ms and optional tz`

::: details Technical details

**Description**

ISO-8601 timestamp grammars (parser f_103c1f50): compact %04hu%02hu%02huT%02hu%02hu%02hu.%03huZ and extended %04hu-%02hu-%02huT%02hu:%02hu:%02hu.%03hu+%*02u:%*02u: both accepted; used by alarm/datetime fields (alarmClock XML ProgramTime etc)


:::

::: details Evidence (1)

- @ 0x103c201c; two sscanf sites in f_103c1f50; fmts at 0x10f9d4e4/0x10f9d50c

:::

## `sonos_iv_token`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

An 'IV=' prefixed token the firmware scans for: an initialization-vector style field seen where encrypted data is handled.

::: details Technical details

**Description**

IV= prefixed token scan in f_103c0364


:::

::: details Evidence (1)

- @ 0x103c05cc; fmt at 0x10f98f0c

:::

## `sonos_lastchange_attr_form`

A Sonos formatting choice worth knowing: the player's LastChange documents write each changed variable as an attribute-valued element rather than the element-body style other devices use. A parser expecting the standard shape will misread these.

::: details Technical details

**Description**

Sonos LastChange serializes variables in ATTRIBUTE form <r:NAME val="..."/> (rincon namespace) not element form. Recovered element set: EnqueuedTransportURI, EnqueuedTransportURIMetaData, CurrentValidPlayModes, DirectControlClientID, DirectControlIsSuspended, DirectControlAccountID, SleepTimerGeneration, RestartPending, NextTrackURI, NextTrackMetaData, AlarmRunning, SnoozeRunning (0x10eb2b38..0x10eb2e00) plus CurrentTrackURI (0x10eb2ae8)


:::

::: details Evidence (1)

- @ 0x10eb2b38; literal family

:::

## `sonos_linein_demo`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The line-in demo-mode settings field: a bracketed flag the settings store carries for the line-in feature, which is stubbed on this build.

::: details Technical details

**Description**

Settings field: LineInDemoMode: \[%hu\] parsed by f_100a6ce0


:::

::: details Evidence (1)

- @ 0x100a6d04; fmt at 0x10f9bfa0

:::

## `sonos_mac_dash`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

A MAC-address variant using dashes instead of colons: the second accepted hardware-address shape, so both common spellings parse.

::: details Technical details

**Description**

MAC grammar variant: %02hhX-%02hhX-%02hhX-%02hhX-%02hhX-%02hhX:%*c: dash-separated + trailing char; parser f_1055e790


:::

::: details Evidence (1)

- @ 0x1055e7c0; fmt at 0x10fe4f8c

:::

## `sonos_mac_parse`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

How the player reads a MAC address: the six-hex-pairs-with-colons shape it accepts for hardware identifiers, parsed strictly so malformed addresses are rejected.

Fields: `6 hex octets`

::: details Technical details

**Description**

MAC-address parser: sscanf %02hhX:%02hhX:%02hhX:%02hhX:%02hhX:%02hhX: six 2-digit hex octets; parser f_10551d68


:::

::: details Evidence (1)

- @ 0x10551dd4; sscanf site; fmt at 0x10fe1064

:::

## `sonos_metadata_urn`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The metadata URN for content ratings: the namespace tag marking rating metadata inside track descriptions so rating fields get recognized.

::: details Technical details

**Description**

Metadata URN scan: urn:schemas-rinconnetworks-com:metadata-1-0/|rating: content-rating namespace parsed by f_106fa350


:::

::: details Evidence (1)

- @ 0x106fa66c; fmt at 0x10fd29a4

:::

## `sonos_packed_object_id`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The packed object-ID format: a long hex string encoding many fields into one identifier, used where an item's ID must carry several pieces of information at once.

Fields: `14 packed hex fields`

::: details Technical details

**Description**

Packed binary object-ID grammar: sscanf %04hX%08X%08X%08X%04hX%02hhX%08X%08X%08X%08X%08X%08X%08X%08X%02X: 14-field hex-packed ID parsed by f_1032d7f8 (ContentDirectory region; likely the cpcontainer/track binary-ID form)


:::

::: details Evidence (1)

- @ 0x1032d8dc; fmt at 0x10f9aad0

:::

## `sonos_path_two_seg`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

A two-segment path split: the 'first/second' grammar used where a route or locator is divided into exactly two parts.

::: details Technical details

**Description**

Two-segment path split %\[^/\]/%\[^/\] by f_1055c55c


:::

::: details Evidence (1)

- @ 0x1055c71c; fmt at 0x10fe2f98

:::

## `sonos_queue_doc`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The 'NumTracks' attribute the queue's XML documents carry, meaning how the queue's track count is written in its stored form.

Fields: `NumTracks attr`

::: details Technical details

**Description**

Queue doc attribute emit: " NumTracks="%u"": the queue XML serialization writes NumTracks; emitters f_10476270, f_1047be68, f_1047df28, f_1047e16c


:::

::: details Evidence (1)

- @ 0x10476270; fmt sites

:::

## `sonos_saved_queue_file`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The saved-playlists filename, 'savedqueues.rsq': the on-disk file where Sonos playlists persist across reboots.

::: details Technical details

**Description**

Saved-queue persist filename savedqueues.rsq (f_104791b0)


:::

::: details Evidence (1)

- @ 0x104791b0; filename literal

:::

## `sonos_saved_queue_id`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

How a saved-playlist ID is written: 'SQ:' followed by a number. It's the identifier commands use to name which stored playlist they mean.

Fields: `SQ prefix`, `decimal index`

::: details Technical details

**Description**

Saved-queue object-ID grammar: sscanf SQ:%d: decimal index after SQ: prefix; parsed by saved-queue workers f_10479fb8, f_1047a3bc, f_10476690, f_104794d4 (AddURIToSavedQueue/ReorderTracksInSavedQueue/queue-engine paths)


:::

::: details Evidence (1)

- @ 0x1047a050; sscanf site; fmt at 0x10fea010

:::

## `sonos_signed_blob_json`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The signed-blob envelope: a JSON wrapper carrying a magic marker, a length, a checksum, and a counter. It's used where the player needs a self-verifying data block that can't be silently truncated or corrupted.

Fields: `magic`, `length`, `checksum`, `counter`

::: details Technical details

**Description**

Signed/checksummed blob envelope: {"magic":"`|_(:/)_|`","length":%u,"checksum":"0x%08X","counter":%u} parsed by f_10bf85f4: magic literal + hex checksum integrity wrapper; RESOLVED consumer: group.cxx group effective-values persistence (grkId-keyed store, '\[Mg\]' log tag, version:11 sibling section, jump-table dispatch 0x10fb03b4)

**Additional data**

- **consumer:** f_10bf8xxx..f_10bfefxx group.cxx family; 'internalReadEffectiveValuesLocked_jsonValue' worker


:::

::: details Evidence (1)

- @ 0x10bf87c0; fmt at 0x11316218

:::

## `sonos_state_flags`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

Zone state flags as written: the 'frozen / allowed / auto' style fields the zone settings carry as packed text rather than separate booleans.

Fields: `frozen`, `allow`, `auto`

::: details Technical details

**Description**

Zone state-flag tokens frozen:%d / allow:%d / auto:%d parsed by f_1076ff3c (zoneplayer settings path)


:::

::: details Evidence (1)

- @ 0x10770028; three scanf sites

:::

## `sonos_track_encryption_meta`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The track-encryption metadata fields: elements describing how a track's data is encrypted, for the protected content the player can handle.

::: details Technical details

**Description**

Track-encryption metadata elements: <TrackEncryptionMethod>%s</..> and <TrackEncryptionFormat>%s</..> (0x10ec55fc/0x10ec5630): DRM metadata in track docs


:::

::: details Evidence (1)

- @ 0x10ec55fc; literals

:::

## `sonos_track_summary_doc`

The track-summary document roots: the envelope the player's queue-summary endpoints emit when describing what's in the queue.

::: details Technical details

**Description**

Queue-summary doc roots: <TrackQueueSummary> (0x10ea978c) and <TrackSummary> (0x10e89708): emitted by the /track_queue_summary + /tracks_summary diagnostic endpoints


:::

::: details Evidence (1)

- @ 0x10ea978c; literals

:::

## `sonos_version_pair`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

How version numbers are written: 'major.minor' pairs like 86.10, which is the shape the firmware's version comparisons and update checks accept.

Fields: `major`, `minor`

::: details Technical details

**Description**

Version-pair grammar: sscanf %d.%d: major.minor; parsers f_10553e94, f_10554218


:::

::: details Evidence (1)

- @ 0x10553edc; sscanf site; fmt at 0x10fe1074

:::

## `status_doc`

The complete element grammar of the diagnostics pages: every field the built-in status website can emit, so the diagnostics surface is fully documented rather than just its route list.

::: details Technical details

**Description**

complete /status + diagnostic XML doc element grammar

**Additional data**

- **psk_material:** <ControlPsk>+<BackupControlPsk>+<HhPsk>+<BackupHhPsk>+<LanSwapPsk>+<BackupLanSwapPsk>+<BackupRoomEncPsk> id=: SonosNet key material present in status dumps
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
- **led_script:** <LedPatternEntry time= led_ids=%08x repeats= steps=>+<LedStepEntry rgb=%06X hold= fade=/>: LED pattern programs
- **track_drm:** <TrackEncryption{Format,Method}>+<Repeat>+<Shuffle>+<Recurrence>+<SodVolume>+<Crossfade>+<Gain>
- **upnp_fault:** <UPnPError xmlns='urn:schemas-upnp-org:control-1-0'>: fault element root


:::

::: details Evidence (1)

- firmware; ~200 <Elem>fmt templates in rodata

:::

## `trackqueue_rsq`

The live-queue persistence format: how the current play queue is written to disk. It's a transactional store with a guard mechanism so an interrupted write doesn't destroy the queue.

::: details Technical details

**Description**

trackqueue.rsq live-queue persistence store: transactional append/replace w/ txn-id guard + range-remap algorithm

**Additional data**

- **file:** trackqueue.rsq (live queue persistence; 'file://%s#%d' URI form, /trackqueue.rsq#0); TQD (track-queue-descriptor) context decode 'decoded len %zu exceeds buffer len %zu'
- **transactions:** append/replace are transactional: 'commitAppend'/'commitAppend (replace)' + txn-id check 'Append transaction ID mismatch. Aborting commitAppend/commitReplace'
- **replaceall:** 'ReplaceAll: search c:%d/%d m:%d r:%d cti:%d/%d'; 'mapping not valid (%u > %u)'; 'old:%d-%d new:%d-%d cur:%d new:%s/%d': range remap algorithm
- **objects:** `trackQueue`, `trackQueueRAM`, `spotifyTrackQueue`, `savedq_mdcache`, `trackQueueSummary`, `<TrackQueueSummary>`
- **streaming_proto:** media client accepts 'HTTP/1.0 200 OK' AND 'ICY 200 OK' (Shoutcast ICY) response lines + 'metadata' marker


:::

::: details Evidence (1)

- firmware; 'trackqueue.rsq' + commitAppend/commitReplace txn-id + ReplaceAll range-remap literals

:::

## `transport_action_bits`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The packed transport-actions field: how the 'currently legal commands' answer is encoded as bits, and which bit means play, pause, seek, and the rest.

::: details Technical details

**Additional data**

- **name:** transport-action capability bitmask (GetCurrentTransportActions)
- **summary:** {name,u32} table at .rodata 0x10eb39d4 - action-name->bit map used to synthesize the CSV in GetCurrentTransportActions: Set=0x10000, X_DLNA_SeekTime=0x20000, Play=0x200000, Next=0x100000, Previous=0x400000, Pause=0x1000000, Stop=0x8000. The 'action list computed live from engine capability state' noted on that action resolves to this fixed name->bit vocabulary; which bits are set at runtime is engine-state-dependent.


:::

::: details Evidence (1)

- @ 0x10eb39d4; action bit table, 7 entries

:::

## `upnp_gena_event_doc`

The envelope of a classic event notification: the 'propertyset' document the player sends when it announces changed variables to subscribers, plus the LastChange wrapper for bundled updates.

::: details Technical details

**Description**

GENA event document: <e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0"> (0x10f005b0); LastChange wrapper <LastChange>%s</LastChange> (0x10e89d80); <InstanceID val="0"> always emitted (0x10e88960)


:::

::: details Evidence (1)

- @ 0x10f005b0; literals

:::

## `upnp_search_criteria_vocab`

**TODO:** Established: the grammar/variant set is decoded from string literals and validator call sites; consumers: see record.
**TODO:** Still unknown: the complete accepted-input set - every printf variant and every parser that accepts this format - is not exhaustively traced.
**TODO:** Next step: trace the consuming parser's compare/parse path and enumerate all accepted variants.

The search grammar the library accepts: which 'where' clauses a search request can legally use, namely matching by object class and reference-ID existence.

::: details Technical details

**Description**

UPnP search-criteria grammar accepted by CD search: upnp:class = "object.container.*" and @refID exists false (0x10f0dcd4..0x10f0df24); derivedfrom operator also supported: upnp:class derivedfrom "object.item.audioItem"


:::

::: details Evidence (1)

- @ 0x10f0dcd4; literal criteria samples

:::

## `vli_mimes`

The content types a virtual line-in session accepts: the whitelist of formats an external source may push at the player.

Fields: `audio/x-aiff`, `audio/flac`, `audio/mp4`, `audio/x-m4a`, `audio/mpeg`, `audio/mp3`, `audio/mpeg3`, `application/ogg`, `audio/ogg`, `audio/x-spotify-ogg`, `audio/x-wav`, `audio/vnd.wave`, `audio/wma`, `audio/x-ms-wma`, `audio/x-mpegurl`, `audio/mpegurl`, `application/x-mpegurl`, `application/vnd.apple.mpegurl`, `audio/L16`, `application/dash+xml`

::: details Technical details

**Description**

VLI/queue accepted MIME whitelist


:::

## `zone_audio_state`

The extended per-zone audio state blocks: the status records the player keeps for each zone's audio, covering volume, EQ, and queue-related flags beyond the headline values.

::: details Technical details

**Description**

extended per-zone audio/EQ + queue-state status blocks

**Additional data**

- **blocks:**
  - **volume_ducking:** <Zone><Zone>%d</Zone><UnscaledVolume><Volume><DeferredVolume><Ducked><DuckingVolume><DuckingPercent><OverrideVolume><Muted><DeferredMute><ExtSrcVolume><SurroundLevel><ZoneChannelCount></Zone>
  - **eq_full:** <Zone>...<IsSatellite><Volume><GainTrimDB><SPLdB><LoudnessSPLdB><LoudnessScaling><BassLevel><TrebleLevel><LoudnessEnabled><StereoPairEnabled><IsOnLeft><Balance{,Initial}><LeftMute><RightMute><HeightLevel><HeightLeveldB><NumBondedSubs><BondedSubModel><SubwooferEnabled><SubwooferJackConnected><DRCVolumeScaling><NightMode><DialogEnhancementLevel><TrueplayEnabled><SubLeveldB><InvertSub><ConstrainSubLevelToVolume><SubDefaultInversion><SourceGainOffsetdB><MusicSurroundLeveldB><TVSurroundLeveldB><FullSurroundMode><PlaybackStreamSampleType><MonoMode><SubCrossover>%dHz<SpeakerSize>
- **queue_status:** <Queue Name='%s'><EntriesMax><EntriesUsed><EntriesHighWater><StringTableSize><StringTableUsed><StringTableHighWater><UpdateID><ObjectID><OwnerID><Policy><CloudQueueHost></Queue>
- **updateid_vocabulary:** SystemUpdateID, ContainerUpdateIDs, FavoritesUpdateID, RadioFavoritesUpdateID, RadioLocationUpdateID, SavedQueuesUpdateID, ShareListUpdateID, NewQueueLength, NewUpdateID, QueueLengthChange, notifyUpdateID('%s',%u), GetSystemUpdateID


:::

::: details Evidence (1)

- firmware; rodata template literals

:::
