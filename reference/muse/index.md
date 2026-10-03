# muse API (v1)

The modern Sonos API: the REST-style interface the current app and the cloud channel drive, distinct from the older device-control protocol surface documented on the service pages. Where the classic commands are verbose XML exchanges from the early-2000s device-control world, this is the cleaner JSON-over-HTTP design a modern app expects: named resources like 'playback' or 'alarms', standard verbs like GET and PATCH, and structured request bodies. Everything on this page was recovered from the firmware's own route registration tables (hundreds of routes across dozens of resource groups) rather than from any public documentation, which makes this the most complete map of the modern Sonos API available anywhere.

Every route is registered as a small record holding three things: the URL pattern (with placeholders like a player ID), which HTTP methods it accepts, and a machine-name string naming the operation. Most operations exist in two spellings, one addressing a single player directly and one going through the household, which is why the route count is nearly double the operation count. The tables below are the complete recovered route registry.

::: details Technical details

the complete muse route registration table recovered from rodata: 603 route records across 67 resources / 332 distinct operations. Each record is 24 bytes {path_template*, flags, 0, handler*, 0, csv_descriptor*}. The csv descriptor 'scope,resource,verb\[,subparam\]' names the operation; the path template carries {param} bindings. Most ops exist twice: unscoped (v1/players/{playerId}/...) and household-scoped (v1/households/{householdId}/players/{playerId}/...). All muse routes are mounted under the /api prefix: the master HTTP table registers '/api' -> f_100d2cf8 which installs the muse dispatcher (stubs f_100d36c0/f_100d36e4 -> pipeline f_100d2e18), so on the wire paths are /api/v1/... .

:::

Each route carries a bitmask saying which HTTP verbs it accepts (GET for reads, POST for creates, PUT and PATCH for edits, DELETE for removals) plus a marker dividing 'settings' operations from 'playback' operations. That division turns out to be meaningful, because the pipeline treats the two classes differently when checking permissions.

Every route funnels into one shared router: a single front door that all API traffic passes through. Two thin entry points merely record which channel the request arrived on (local network versus the cloud tunnel) before joining the same machinery, so every operation sees a uniform request no matter where it came from.

Routes are registered in two dialect tables: one phrased in terms of household IDs (the cloud-flavored form, where requests name the household and the player inside it) and one in player IDs (the local form used on your home network). The same operation appears in both, which is why the tables look like near-copies of each other.

::: details Route record internals

**flags decode:** flags low byte = HTTP method bitmask: 0x01 GET, 0x02 POST, 0x04 PUT, 0x08 DELETE, 0x10 PATCH (settings-only). Bit 0x100 set = household/settings-class routes; clear (0x2000000x) = playback/volume-class (playback, groupVolume, playerVolume, playbackMetadata). 0x20000000 = muse marker bit on all records.

**dispatch:** two stubs only: f_100d36c0 (r8=0) serves 332 records, f_100d36e4 (r8=1) 271; both tail-call f_100d2e18 which normalizes the request into a 0x2a00-byte context (header/flag block at +0x416.., buf +0x2594) and dispatches on the parsed csv op name. r6==NULL fast-path returns 0.

Registration arrays: `primary`: 0x10e7a68c.. (householdId dialect incl. protectedAdmin); `secondary`: 0x10e783f8.. ({HHID} dialect incl. protected-admin)

:::

## How operations are built

Every operation is a small object built from the same template: a shared 'may I run?' check, its own execute step that does the real work, and a ladder of optional hooks. The early hooks read fields out of the request body (each overridden hook corresponds to one declared parameter), and the later hooks build whatever internal request the operation forwards to the player's engines. Reading which hooks each operation overrides is exactly how each command's parameter list was recovered.

::: details Technical details

Every op is a C++ object sharing one vtable skeleton: `+0x00`/`+0x04` destructors (per-op), `+0x08` shared run-gate (`0x109c9854`, same in all 682 vtables), `+0x0c` the per-op **execute** (unique per op class, shown as Exec in the tables below), `+0x10` shared default, and `+0x14`..`+0x60` a fixed hook ladder whose base defaults live at `0x101c0638..0x101c06ac`. Ops override subsets of the hooks: the low hooks read body params; each overridden hook is one **declared parameter**, reading exactly one named JSON member through `f_108337b0` (e.g. setVolume: `+0x1c`→`muted`, `+0x20`→`volume`; seek: `+0x1c`→`playOnCompletion`, `+0x20`→`positionMillis`, `+0x28`→`itemId`, `+0x2c`→`window`) (the Params column lists them) and higher hooks build forwarded requests (e.g. `setVolume` overrides `+0x60` to emit `v1/players/{id}/playerVolume/mute` and `v1/groups/{id}/groupVolume`). Each verb registers two op classes: a player-channel variant and a fatter household-channel variant.

:::

Before any operation runs, a shared validation library checks the request body field by field for missing required fields, wrong types, out-of-range values, and unknown fields that shouldn't be there. It's the same idea as the argument checking on the classic command surface, just generalized for JSON documents: every operation gets uniform, thorough input checking without implementing it itself.

::: details Technical details

**Body validation library** (`0x109c74b0..0x109ca92c`): typed validators keyed by field name; `f_109ca3b4` emits 'Missing required field: ', `f_109c9cc0` 'Unexpected type given for key: ', `f_109c8c60` 'Found unexpected array for '/'Unable to parse array for ', `f_109c90ec` 'Found object for ', `f_109ca92c` coerces strings ('Unable to coerce string to boolean for key: '/' to number for key: '), `f_109c7cb4`/`f_109c8004`/`f_109c8354`/`f_109c86dc` numeric bounds ('below minimum of '/'above maximum of '), `f_109c7954` 'Parameter '…' out of range: ', `f_109c74b0` timestamps (' failed timestamp validation'), `f_109c7740` ' not a valid Muse error code'.

:::

## Request pipeline

The gauntlet each API request runs before it reaches real work: the incoming HTTP request is unpacked, its content type checked, the caller's credentials verified, the URL's numeric placeholders parsed, the body decoded as JSON and validated field-by-field, and only then does the operation's own execute step run. Each stage can reject the request with its own error before any music-relevant code is touched, which is why the API fails so uniformly: the failures all happen here, not in the operations.

Stage one: the incoming HTTP request is unpacked into a working context made of headers, flags, and a scratch space the later stages fill in. From here on, the request is a structured object, not raw text.

::: details Technical details

**request envelope.** f_100d2e18 builds a 0x2a00-byte request context (headers/flags at +0x416.., scratch buf at +0x2594). Route lookup by path template -> 24-byte record {path*, method_flags, 0, stub*, 0, csv*}. Stubs f_100d36c0 (channel r8=0) / f_100d36e4 (r8=1) tail-call the dispatcher.

:::

Stage two: requests carrying a body must declare they're sending JSON, and edit operations (PATCH) additionally demand the merge-patch content type. Wrong or missing declarations are rejected here, because the API refuses to guess what format a body is in.

::: details Technical details

**content type.** Body-bearing requests must send Content-Type: application/json (verified by strcmp at 0x100d3230-0x100d3240); PATCH routes require application/merge-patch+json (0x10e7bd1c) instead. Violation -> error 'missing or invalid Content-Type; must be %s' (0x10e7bd3c) with status class 0x19f (415) via f_100d23d8.

:::

Stage three: an API-key check guards the whole surface. A missing or wrong key fails with 'Invalid API key' before anything else is examined, making it the bouncer at the door of the modern API. On local requests the check is typically satisfied by the household's own credentials, and it's what stops arbitrary network neighbors from driving your speakers.

::: details Technical details

**auth.** API-key check in f_106d9880 (called at 0x100d35b0 with arg 0x1058439c); failure -> 'Invalid api key' (0x10e7bd68), status class 0x190 (400), error code 0x5d (93).

:::

Stage four: numeric placeholders in the URL (the player, group, and household IDs embedded in the path) are parsed as integers. A non-numeric or malformed ID is rejected here, before it can confuse an operation.

::: details Technical details

**path params.** Path params parsed with strtoul(base 10) at 0x100d3210 for numeric ids.

:::

Stage five: the JSON body is decoded into a working store, the structured document the operation's parameter hooks will read from. Malformed JSON fails here, and then the field-by-field validation library checks what was decoded.

::: details Technical details

**body.** JSON body parsed by f_106d966c/f_106d98e0 into a value store; response serialized by f_106db220 via the writer object at 0x11095f88+0xf10.

:::

How pipeline failures are reported: each stage can abort with its own status code and error string before the operation ever runs. That's why API errors are so uniform: they all come from this shared gauntlet, not from the operations themselves.

::: details Technical details

**errors.** Errors are a 0x40-byte serialized envelope built at rsp+0x8c and emitted by f_100d23d8(ctx, buf, status_class, errcode, msg).

:::

Stage six: with everything validated, the named operation's own execute method finally runs. This is the stage that actually does the work, reading its parameters from the body store via its hooks and forwarding the real request to the player's engines.

::: details Technical details

**op dispatch.** The parsed csv verb is looked up in a per-resource op map (see find-by-name loops f_108337b0 users such as f_10b23e3c). Ops are C++ objects created by per-verb factory functions; each op class installs its own vtable (slot 0 = per-op execute; +8 = shared run trampoline f_109c9854).

:::

## Event channels

The named event channels available on the modern websocket connection: how an app subscribes to live updates from the API layer rather than polling. Each channel name identifies a feed of changes (playback state, group membership, settings) the app can opt into.

The complete muse event-channel namespace emitted over /websocket/api: each channel name below is a subscription target in the muse event bus (SUBSCRIBE/NOTIFY per channel). Includes several channels with no public documentation: waterStatus, poeStatus, speakerPresenceRateChange, microphoneSwitchStatus, bluetoothPairingStatus/ConnectionStatus, wiredSubConnectionStatus, trueroomAdaptationStatusEvent.

`groups`, `groupVolume`, `localDevices`, `playbackError`, `playerVolume`, `queue`, `timers`, `accessorySwapStatus`, `tvAudioSignalStatus`, `activeZonesChange`, `zoneDefinitionsChange`, `zoneError`, `alarmClock`, `alarmVersionChange`, `areasVersionChange`, `audioClipStatus`, `audioInput`, `availableSoftwareUpdate`, `avTransport`, `batteryStatus`, `wirelessNetworkStatus`, `microphoneSwitchStatus`, `waterStatus`, `bluetoothPairingStatus`, `bluetoothConnectionStatus`, `poeStatus`, `lineInStatus`, `wiredSubConnectionStatus`, `cloudRegistration`, `connectionManager`, `contentDirectory`, `deviceProperties`, `diagnosticSubmissionResults`, `diagnosticMetadata`, `effectiveSettingsDataChanged`, `entitlementsVersionChanged`, `extendedDeviceStatus`, `extendedPlaybackStatus`, `favoritesVersionChange`, `groupCoordinatorChanged`, `groupManagement`, `groupRendering`, `hdmiStatus`, `historyVersionChanged`, `householdUpdateStatus`, `upgradeManager`, `htControl`, `indexerStatus`, `musicServices`, `musicServicesChanged`, `playbackMetadataStatus`, `playbackStatus`, `playlistsVersionChange`, `positioningSessionStatus`, `positioningSessionError`, `positioningDeviceStatus`, `renderingControl`, `sessionError`, `sessionInfo`, `settingsVersionChanged`, `settingsDataChanged`, `settingsPlayerSettingsChanged`, `sleepTimerStatus`, `systemProperties`, `trueplayStatus`, `speakerPresenceStatus`, `speakerPresenceRateChange`, `trueroomAdaptationStatusEvent`, `trueroomCalibrationStatus`, `trueroomStatusEvent`, `virtualLineIn`, `voiceAccountsVersionChange`, `zoneGroupTopology`

## Resources

The 67 resource groups ('playback', 'groupVolume', 'alarms', 'devices', and the rest) with the operations each supports. This is the modern API's table of contents: everything the app can do, organized by what it operates on.

| Resource | Ops | Methods | Scope params |
|---|---|---|---|
| [`alarms`](resources/alarms-timers.md#alarms) | 7 | DELETE, GET, POST, PUT | groupId, householdId |
| [`areas`](resources/households-zones.md#areas) | 4 | DELETE, GET, POST, PUT | householdId |
| [`audioClip`](resources/content.md#audioclip) | 4 | DELETE, POST | playerId |
| [`authorization`](resources/authorization.md#authorization) | 15 | DELETE, GET, POST | householdId, none, playerId |
| [`catalog`](resources/content.md#catalog) | 4 | GET | serviceId |
| [`devices`](resources/device-hardware.md#devices) | 16 | DELETE, GET, POST, PUT | householdId, playerId, userId |
| [`devicesExtended`](resources/device-hardware.md#devicesextended) | 1 | GET | householdId |
| [`diagnostics`](resources/system.md#diagnostics) | 6 | GET, POST | playerId |
| [`effectiveSettings`](resources/settings.md#effectivesettings) | 8 | GET, PATCH | playerId |
| [`entitlements`](resources/content.md#entitlements) | 3 | GET | householdId, userId |
| [`favorites`](resources/content.md#favorites) | 3 | GET, POST | groupId, householdId |
| [`groupVolume`](resources/volume-home-theater.md#groupvolume) | 8 | GET, POST | groupId |
| [`groups`](resources/households-zones.md#groups) | 7 | GET, POST | groupId, householdId |
| [`hardwareStatus`](resources/device-hardware.md#hardwarestatus) | 34 | DELETE, GET, POST | playerId |
| [`hdmi`](resources/volume-home-theater.md#hdmi) | 6 | GET | playerId |
| [`history`](resources/content.md#history) | 4 | DELETE, GET, POST | householdId |
| [`homeTheater`](resources/volume-home-theater.md#hometheater) | 24 | DELETE, GET, POST | playerId |
| [`householdUpdate`](resources/system.md#householdupdate) | 4 | GET, POST | deviceId |
| [`households`](resources/households-zones.md#households) | 7 | GET, POST, PUT | householdId, none |
| [`info`](resources/system.md#info) | 2 | GET | playerId |
| [`ircontrol`](resources/device-hardware.md#ircontrol) | 4 | GET, POST | playerId |
| [`localContentLibrary`](resources/content.md#localcontentlibrary) | 6 | DELETE, GET, POST | householdId, playerId |
| [`management`](resources/system.md#management) | 4 | POST | playerId |
| [`musicServiceAccounts`](resources/content.md#musicserviceaccounts) | 7 | GET, POST | groupId, householdId |
| [`networkTest`](resources/system.md#networktest) | 6 | GET, POST | playerId |
| [`pinewood`](resources/volume-home-theater.md#pinewood) | 20 | POST | playerId |
| [`platformInternal`](resources/system.md#platforminternal) | 4 | POST | householdId, playerId |
| [`playback`](resources/playback.md#playback) | 32 | GET, POST | groupId |
| [`playbackExtended`](resources/playback.md#playbackextended) | 2 | GET | groupId |
| [`playbackMetadata`](resources/playback.md#playbackmetadata) | 4 | GET, POST | groupId |
| [`playbackSession`](resources/playback.md#playbacksession) | 30 | DELETE, POST | groupId, sessionId |
| [`playerVolume`](resources/volume-home-theater.md#playervolume) | 12 | GET, POST | playerId |
| [`playlists`](resources/content.md#playlists) | 5 | GET, POST | groupId, householdId |
| [`positioning`](resources/calibration.md#positioning) | 28 | DELETE, GET, POST | playerId |
| [`power`](resources/device-hardware.md#power) | 2 | POST | playerId |
| [`roomDetection`](resources/calibration.md#roomdetection) | 4 | DELETE, POST | playerId |
| [`settings`](resources/settings.md#settings) | 34 | GET, PATCH, POST, PUT | householdId, playerId, userId |
| [`sleepTimer`](resources/playback.md#sleeptimer) | 4 | GET, POST | groupId |
| [`smartplay`](resources/voice-control.md#smartplay) | 1 | GET | householdId |
| [`soundSwap`](resources/volume-home-theater.md#soundswap) | 4 | POST | playerId |
| [`svc`](resources/system.md#svc) | 6 | GET, POST | playerId |
| [`systemReporting`](resources/system.md#systemreporting) | 8 | POST | none |
| [`systemTime`](resources/system.md#systemtime) | 2 | GET, PUT | householdId |
| [`time`](resources/system.md#time) | 2 | GET | playerId |
| [`timers`](resources/alarms-timers.md#timers) | 14 | DELETE, GET, POST, PUT | playerId |
| [`trueplay`](resources/calibration.md#trueplay) | 14 | DELETE, GET, POST | playerId |
| [`trueroom`](resources/calibration.md#trueroom) | 10 | GET, POST | playerId |
| [`update`](resources/system.md#update) | 6 | GET, POST | playerId |
| [`upnpAVTransport`](resources/upnp-bridge.md#upnpavtransport) | 8 | DELETE, POST | playerId |
| [`upnpAlarmClock`](resources/upnp-bridge.md#upnpalarmclock) | 8 | DELETE, POST | playerId |
| [`upnpAudioIn`](resources/upnp-bridge.md#upnpaudioin) | 8 | DELETE, POST | playerId |
| [`upnpConnectionManager`](resources/upnp-bridge.md#upnpconnectionmanager) | 8 | DELETE, POST | playerId |
| [`upnpContentDirectory`](resources/upnp-bridge.md#upnpcontentdirectory) | 8 | DELETE, POST | playerId |
| [`upnpDeviceProperties`](resources/upnp-bridge.md#upnpdeviceproperties) | 8 | DELETE, POST | playerId |
| [`upnpGroupManagement`](resources/upnp-bridge.md#upnpgroupmanagement) | 8 | DELETE, POST | playerId |
| [`upnpGroupRenderingControl`](resources/upnp-bridge.md#upnpgrouprenderingcontrol) | 8 | DELETE, POST | playerId |
| [`upnpHTControl`](resources/upnp-bridge.md#upnphtcontrol) | 8 | DELETE, POST | playerId |
| [`upnpMusicServices`](resources/upnp-bridge.md#upnpmusicservices) | 8 | DELETE, POST | playerId |
| [`upnpQueue`](resources/upnp-bridge.md#upnpqueue) | 8 | DELETE, POST | playerId |
| [`upnpRenderingControl`](resources/upnp-bridge.md#upnprenderingcontrol) | 8 | DELETE, POST | playerId |
| [`upnpSystemProperties`](resources/upnp-bridge.md#upnpsystemproperties) | 8 | DELETE, POST | playerId |
| [`upnpVirtualLineIn`](resources/upnp-bridge.md#upnpvirtuallinein) | 8 | DELETE, POST | playerId |
| [`upnpZoneGroupTopology`](resources/upnp-bridge.md#upnpzonegrouptopology) | 8 | DELETE, POST | playerId |
| [`virtualLineIn`](resources/audio-input.md#virtuallinein) | 12 | POST | playerId |
| [`virtualRemoteControl`](resources/voice-control.md#virtualremotecontrol) | 2 | POST | playerId |
| [`voice`](resources/voice-control.md#voice) | 12 | DELETE, GET, POST | playerId |
| [`zones`](resources/households-zones.md#zones) | 15 | DELETE, GET, POST, PUT | householdId, playerId |

Resource pages, grouped by function:

- [Playback & sessions](resources/playback.md)
- [Volume & home theater](resources/volume-home-theater.md)
- [Audio input](resources/audio-input.md)
- [Households, zones & grouping](resources/households-zones.md)
- [Alarms & timers](resources/alarms-timers.md)
- [Content, library & music services](resources/content.md)
- [Calibration & positioning](resources/calibration.md)
- [Settings](resources/settings.md)
- [Device & hardware](resources/device-hardware.md)
- [Voice & remote control](resources/voice-control.md)
- [System, updates & diagnostics](resources/system.md)
- [Authorization](resources/authorization.md)
- [UPnP bridge resources](resources/upnp-bridge.md)


::: details Evidence (5)

- @ 0x10e7a68c; route record array head (householdId dialect)
- @ 0x10e783f8; route record array head ({HHID} dialect)
- @ 0x100d36c0; handler stub r8=0 -> f_100d2e18
- @ 0x100d36e4; handler stub r8=1 -> f_100d2e18
- @ 0x100d2e18; request normalizer + dispatcher

:::
