# HTTP: Discovery & routing

## `discovery_layer`

The discovery layer: how the player finds other devices and is found, covering the announcements and searches behind 'speakers see each other on the network'.

::: details Technical details

- **status:** strong
- **mdns:** mDNS controller on RZonePlayer (m_spMdnsController); '%s.local' hostname construct ('Failed construct mdns hostname'); refreshMdnsRegistration; log /opt/log/mdnsd.log; 'new cert updating mDNS service \[%s\]'
- **spotify_connect:** _spotify-connect._tcp service registered/unregistered dynamically ('Registering Spotify Connect mDNS service'); MdnsSpotifyService ../anacapa-1.0/oc/zone/zoneplayer/mdns_spotify_service.cxx; SpotifyMDNSRequest events
- **ssdp:** RMSearchNotifyHandler select-thread handles SSDP M-SEARCH/NOTIFY; dedup vs mDNS: 'handleDefunctZP %s reason %s IGNORED from MDNS - discovered by SSDP' and inverse
- **dedup_policy:** a zone-player defunct signal is ignored when the same ZP is discovered via the other discovery channel (mDNS-primary if SSDP-unseen, SSDP-primary if mDNS-unseen)

:::


## `ssdp_discovery`

Device-discovery announcements and searches: the classic find-each-other protocol where speakers announce presence, search for peers, and log who answered. It's the older discovery layer alongside the Sonos-specific mechanisms.

::: details Technical details

- **status:** confirmed
- **wire:** M-SEARCH * HTTP/1.1 + HOST:239.255.255.250 + USN: + ssdp:alive/ssdp:byebye; 'Sent MSEARCH reply to %s:%u'; '%s unicast MSEARCH from %s'
- **headers:** X-RINCON-{HOUSEHOLD,BOOTSEQ,PROXY,VARIANT,REASON} extension headers; MX: search window
- **signing:** HMAC-signed M-SEARCH: X-SONOS-SIG: %s + X-Sonos-MS-Sig: headers; 'signature HMAC init failed'/'Failed to calculate/add M-SEARCH signature'/'base64 encoding failed'; signed manifests ('Got manifest with invalid signature', '<!-- SIGNATURE:')
- **handler:** RMSearchNotifyHandler thread + disHandleMSearchAsync dispatch; 'Failed to setup MSearchNotifyHandler'
- **dedup:** dual-discovery: 'handleDefunctZP %s reason %s IGNORED from MDNS - discovered by SSDP'/'from SSDP - discovered by MDNS but not SSDP'
- **containers:** x-rincon-cpcontainer:{RDCPA,RDCPI,*}:* grammar; 'Unknown old Rhapsody x-rincon-cpcontainer'
- **outbound_templates:**
  - **alive:** 0x10eef678: NOTIFY * HTTP/1.1 \| HOST: 239.255.255.250:1900 \| CACHE-CONTROL: max-age = %u \| LOCATION: %s \| NT: %s \| NTS: ssdp:alive \| SERVER: %s \| USN: %s \| %s(trailer)
  - **byebye:** 0x10eef5fc: NOTIFY * HTTP/1.1 \| HOST: 239.255.255.250:1900 \| NT: %s \| NTS: ssdp:byebye \| SERVER: %s \| USN: %s \| %s(trailer) - note: byebye omits CACHE-CONTROL/LOCATION
  - **msearch_response:** 0x10eef97c: HTTP/1.1 200 OK \| CACHE-CONTROL: max-age = %u \| EXT: \| LOCATION: %s \| SERVER: %s \| ST: %s \| USN: %s \| %s(trailer) - the unicast reply to inbound M-SEARCH
  - **outbound_msearch:** 0x10eea4f4 = ssdp_signed_msearch template (MAN: "ssdp:discover", MX:%d, ST:%s, USER-AGENT:%s + signature trailer)
  - **notes:** alive/byebye/response trailer %s is the signature block (signed SSDP); all four are format literals confirmed at the listed .rodata addresses

:::


## `ssdp_signed_msearch`

Signed M-search: the authenticated form of discovery search, a signed variant protecting the exchange.

::: details Technical details

- **status:** confirmed
- **wire:** M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1900\r\nMAN: "ssdp:discover"\r\nMX: %d\r\nST: %s\r\nUSER-AGENT: %s\r\n%s\r\n (trailer = signature block)
- **signature:** HMAC over request -> base64 ('M-SEARCH signature HMAC init failed','Failed to add M-SEARCH signature'); inbound verify: 'hmac sig verify error'; keys hmacDigest/hmac
- **response_headers:** `BOOTID.UPNP.ORG: %s`, `CONFIGID.UPNP.ORG: %d`, `CACHE-CONTROL: max-age = %u`

:::


## `target_udn_routing`

Target-UDN routing: how requests addressed to a specific device ID get routed, which is the mechanism directing commands to the right unit.

::: details Technical details

- **status:** confirmed
- **header:** X-SONOS-TARGET-UDN: uuid:%s + targetUDN param: directs a SOAP action to a specific bonded-zone member UDN
- **semantics:** multi-device action routing: the coordinator/group proxy forwards actions to the target member identified by UDN; pairs w/ MobileDeviceUDN/playerUDN/HTPrimaryUDN identity fields

:::


## `assoctracker`

The association tracker: it watches which network devices the player is associated with, feeding the connectivity-state data diagnostics use.

::: details Technical details

- **status:** confirmed
- **semantics:** Wi-Fi station-association tracking

:::


## `gena_internals`

The internals of classic eventing: how subscriptions are installed and validated (including pre-installed IDs and URL forms), how notifications are sequenced, and how the subscription list is kept clean.

::: details Technical details

- **status:** strong
- **name:** GENA internals + per-service LastChange schemas
- **description:** Subscription machinery vocabulary: SID preinstall ('Attempting to preinstall SID=%u', '?sid=0' URL form), status fields SubscribedEvents/LogicalSID/UPnPSID/NotifyErrors, sender/source pair upnpeventing_sender+upnpeventing_source, AVTStateLastChangedEvent event name, and the <LastChange>%s</LastChange> wrapper emitted per service. Per-service LastChange payload schemas not enumerated.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e9b408, notes: Attempting to preinstall SID
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f0c580, notes: <LogicalSID>
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f00cb8, notes: <NotifyErrors>
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10e89d80, notes: <LastChange>
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ed1c6c, notes: <Event xmlns="urn:schemas-sonos-com:metadata-1-0/Queue/">: proprietary Queue LastChange
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ed1cd0, notes: <QueueID val="%.20s"> + QueueOwnerID/UpdateID/Curated elements
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eb29e8, notes: AVT LastChange envelope with r: namespace + full element sequence
- **lastchange_schemas:**
  - **RCS:** <Event xmlns="urn:schemas-upnp-org:metadata-1-0/RCS/"><InstanceID val="0">...: standard UPnP RCS event envelope
  - **AVT:** <Event xmlns="urn:schemas-upnp-org:metadata-1-0/AVT/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/"> then elements in order: TransportState, CurrentPlayMode, CurrentCrossfadeMode, NumberOfTracks, CurrentTrack, CurrentSection (non-standard), CurrentTrackURI, CurrentTrackDuration, CurrentTrackMetaData, r:EnqueuedTransportURI, r:EnqueuedTransportURIMetaData, PlaybackStorageMedium, AVTransportURI, AVTransportURIMetaData, NextAVTransportURI, NextAVTransportURIMetaData: all as <X val="..."> attribute-value form
  - **Queue:** proprietary Sonos namespace urn:schemas-sonos-com:metadata-1-0/Queue/ (NOT a UPnP standard schema. Elements: <QueueID val="%.20s"> (20-char truncated), <QueueOwnerID val="%s"/>, <UpdateID val="%u"/>, <Curated val="...">) the Curated flag matches the SavedQueue store schema
- **notes:** AVT envelopes carry the r: extension namespace for Sonos fields; Queue events live in a Sonos-private namespace (schemas-sonos-com, not rinconnetworks): clients parsing LastChange must handle all three namespaces; val="" attribute form used throughout

:::

