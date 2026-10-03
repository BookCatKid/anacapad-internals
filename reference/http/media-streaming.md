# HTTP: Media & streaming

## `hls_radio`

The HLS radio path: playing Apple's segmented-stream format for radio, covering playlist parsing and segment fetching for continuous audio.

::: details Technical details

- **status:** confirmed
- **schemes:** x-sonosapi-hls:%s?sid=%u&flags=288 + x-sonosapi-hls-static: + x-sonosapi-hls{,-static}:*:*:* + hls-static:// + sonos.com-hls-{static,radio,aac}
- **ops:** hls-{live,static,???} + hlsradio + hlsmeta/hlsplaylist/hlsrenditions + 'hls-%s said: %u (%g) %d %d' telemetry
- **routes:** /hls local route

:::


## `websocket_impl`

The websocket implementation: the persistent-channel plumbing the modern event layer uses, which is the machinery behind websocket connections.

::: details Technical details

- **status:** confirmed
- **files:** websocketserver.cxx + websocketclient.cxx + lechmere.cxx
- **handshake:** Upgrade: websocket + Sec-WebSocket-{Key,Version,Accept,Protocol,Extensions}
- **frames:** opcode set {data,ping,pong,close,cont}; 'Illegal opcode'/'Privileged opcode'/'Websocket protocol error'; write fail logs opcode+len
- **state:** <WebSocketHistory> + <TruncatedConnectionList maxwebsockets=%zu connections=%zu>; <WebsocketRegistration>{%s (%s),/} reg element; WebSocketReceiveCB close handling

:::


## `icy_metadata`

ICY stream metadata: the in-band 'now playing' info inside MP3 radio streams, which is how the player reads the song titles stations embed in the audio feed.

::: details Technical details

- **status:** strong
- **name:** ICY/Shoutcast inline metadata
- **description:** mp3radio streams carry ICY metadata: '@icy-metaint:' interval header parsed for in-band track metadata.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ed461b, notes: @icy-metaint

:::


## `didl_classes_ext`

The extended metadata classes: the object types beyond plain songs in the metadata vocabulary, covering audiobooks, podcasts, episodes, and their containers, so catalogs can distinguish them.

::: details Technical details

- **status:** strong
- **name:** Extended DIDL object classes
- **description:** DIDL class vocabulary beyond the core audioItem set: audioBook/audioBook.chapter/podcast containers+items, episode.podcast, chapter.audiobook, the ':audiobooks' browse id, mswmext=.asx WMP playlist mapping.
- **classes:** `object.item.audioItem.audioBook`, `object.item.audioItem.audioBook.chapter`, `object.item.audioItem.podcast`, `object.container.podcast`, `episode.podcast`, `chapter.audiobook`
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ec1264, notes: object.item.audioItem.audioBook
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10f08788, notes: object.container.podcast
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10ed693c, notes: mswmext=.asx

:::


## `protocol_info_full`

The full protocol-info string: the verbatim capability declaration the player returns, listing every format it claims to handle in its own words.

::: details Technical details

- **status:** confirmed
- **name:** Complete GetProtocolInfo Source CSV
- **description:** Verbatim protocol-info CSV returned by ConnectionManager.GetProtocolInfo: captures the sonos.com-{http,mms,spotify,rtrecent} transport prefixes, x-file-cifs local-share scheme, DASH and every MIME type the renderer claims.
- **csv:** http-get:*:audio/mp3:*,x-file-cifs:*:audio/mp3:*,http-get:*:audio/mp4:*,x-file-cifs:*:audio/mp4:*,http-get:*:audio/x-m4a:*,x-file-cifs:*:audio/x-m4a:*,http-get:*:audio/mpeg:*,x-file-cifs:*:audio/mpeg:*,http-get:*:audio/mpegurl:*,x-file-cifs:*:audio/mpegurl:*,file:*:audio/mpegurl:*,http-get:*:audio/x-mpegurl:*,x-file-cifs:*:audio/x-mpegurl:*,http-get:*:application/x-mpegurl:*,x-file-cifs:*:application/x-mpegurl:*,http-get:*:application/vnd.apple.mpegurl:*,x-file-cifs:*:application/vnd.apple.mpegurl:*,http-get:*:application/dash+xml:*,x-file-cifs:*:application/dash+xml:*,http-get:*:audio/mpeg3:*,x-file-cifs:*:audio/mpeg3:*,http-get:*:audio/wav:*,x-file-cifs:*:audio/wav:*,http-get:*:audio/x-wav:*,x-file-cifs:*:audio/x-wav:*,http-get:*:audio/wma:*,x-file-cifs:*:audio/wma:*,http-get:*:audio/x-ms-wma:*,x-file-cifs:*:audio/x-ms-wma:*,http-get:*:audio/aiff:*,x-file-cifs:*:audio/aiff:*,http-get:*:audio/x-aiff:*,x-file-cifs:*:audio/x-aiff:*,http-get:*:audio/flac:*,x-file-cifs:*:audio/flac:*,http-get:*:application/ogg:*,x-file-cifs:*:application/ogg:*,http-get:*:audio/ogg:*,x-file-cifs:*:audio/ogg:*,sonos.com-mms:*:audio/x-ms-wma:*,sonos.com-http:*:audio/mp3:*,sonos.com-http:*:audio/mpeg:*,sonos.com-http:*:audio/mpeg3:*,sonos.com-http:*:audio/wma:*,sonos.com-http:*:audio/mp4:*,sonos.com-http:*:audio/x-m4a:*,sonos.com-http:*:audio/wav:*,sonos.com-http:*:audio/aiff:*,sonos.com-http:*:audio/flac:*,sonos.com-http:*:application/ogg:*,sonos.com-http:*:application/x-mpegURL:*,sonos.com-http:*:application/dash+xml:*,sonos.com-spotify:*:audio/x-spotify:*,sonos.com-rtrecent:*:audio/x-sonos-recent:*,x-rincon:*:*:*,x-rincon-mp3radio:*:*:*,x-rincon-playlist:*:*:*,x-rincon-queue:*:*:*,x-rincon-stream:*:*:*,x-sonosapi-stream:*:*:*,x-sonosapi-hls:*:*:*,x-sonosapi-hls-static:*:*:*,x-sonosapi-radio:*:audio/x-sonosapi-radio:*,x-rincon-cpcontainer:*:*:*,
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eb87e4, notes: http-get:*:audio/mp3

:::

