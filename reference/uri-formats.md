# URI formats

URI scheme grammars recovered from literal tables and parser call sites.

## `cloud_api_routes` `confirmed`

The outbound cloud API route map — 533 route literals: the full set of Sonos cloud endpoints this firmware knows how to call.

**Technical description:**

Complete outbound cloud API route+dispatch map — 533 route literals, 324 {scope,path,cmd} op tuples over 7 id scopes

- **count:** 282
- **dispatch:** comma-tuple 'householdId,<resource>,<method>\[,<param>\]' strings select the REST call; base path 'v1/households/{householdId}/...' (one variant uses {HHID})
- **resources:**
  - **households/{householdId}** (22):
  
    ```
    alarms, areas, authorization, devices, devicesExtended, entitlements, favorites, groups, history, localContentLibrary, musicServiceAccounts, platformInternal, playbackSessions, players, playlists, services, settings, smartplay, systemReporting, systemTime, users, zones
    ```
  - **players/{playerId}** (31):
  
    ```
    audioClip, authorization, devices, diagnostics, effectiveSettings, hardwareStatus, hdmi, homeTheater, info, ircontrol, localContentLibrary, management, networkTest, pinewood, platformInternal, playerVolume, positioning, power, roomDetection, settings, soundSwap, svc, time, timers, trueplay, trueroom, update, virtualLineIn, virtualRemoteControl, voice, zones
    ```
  - **upnp_mirrors:** all 15 services proxied: upnpAlarmClock,upnpAudioIn,upnpAVTransport,upnpConnectionManager,upnpContentDirectory,upnpDeviceProperties,upnpGroupManagement,upnpGroupRenderingControl,upnpHTControl,upnpMusicServices,upnpQueue,upnpRenderingControl,upnpSystemProperties,upnpVirtualLineIn,upnpZoneGroupTopology
  - **other_scopes:** `playbackSessions/{sessionId}`, `users/{userId}`, `groups/{groupId}`, `devices/{deviceId}`, `services/{serviceId}`
- **note:** outbound cloud client surface; 'upnp<Service>' + '/subscription\[/{logicalSID}\]' resources mirror every SOAP service's GENA eventing into the cloud (all 17 services present)
- **sample:** `v1/households/{HHID}/settings/protected-admin/{setting}`, `v1/households/{HHID}/settings/protected-admin`, `v1/households/{HHID}/settings/protected/{setting}`, `v1/households/{HHID}/settings/protected`, `v1/households/{householdId}/alarms`, `v1/households/{householdId}/alarms/{alarmId}`, `v1/households/{householdId}/groups/{groupId}/alarms/snooze`, `v1/households/{householdId}/areas`, `v1/households/{householdId}/areas/{areaId}`, `v1/households/{householdId}/players/{playerId}/audioClip`, `v1/households/{householdId}/players/{playerId}/audioClip/{id}`, `v1/households/{householdId}/authorization/tokens`, `v1/households/{householdId}/authorization/policy/{policyKey}`, `v1/households/{householdId}/authorization/permissions/{role}`, `v1/households/{householdId}/authorization/invite`, `v1/households/{householdId}/authorization/redeem`, `v1/households/{householdId}/authorization/users`, `v1/households/{householdId}/players/{playerId}/authorization/authorizeDevice`, `v1/households/{householdId}/players/{playerId}/authorization/authenticateClient`, `v1/households/{householdId}/services/{serviceId}/catalog/id/{objectId}`
- **operation_tuples:**
  - **count:** 324
  - **grammar:** <scopeId>,<resourcePath>,<operation>\[,<param>...\] — the outbound client's dispatch tuples pairing route templates to named ops
  - **scopes:**
    - **playerId:** 46
    - **householdId:** 18
    - **groupId:** 11
    - **userId:** 3
    - **deviceId:** 1
    - **serviceId:** 1
    - **sessionId:** 1
  - **operations** (324):
  
    ```
    deviceId,householdUpdate,beginHouseholdSoftwareUpdate, deviceId,householdUpdate,getHouseholdUpdateStatus, groupId,alarms,snoozeAlarm, groupId,favorites,loadFavorite, groupId,groups,modifyGroupMembers, groupId,groups,setGroupMembers, groupId,groupVolume,getVolume, groupId,groupVolume,setMute, groupId,groupVolume,setRelativeVolume, groupId,groupVolume,setVolume, groupId,musicServiceAccounts,endDirectControl, groupId,musicServiceAccounts,startDirectControlEx, groupId,playback,getPlaybackStatus, groupId,playback,loadContainer, groupId,playback,loadContent, groupId,playback,loadLineIn, groupId,playback,loadStream, groupId,playback,loadTrackList, groupId,playback,pause, groupId,playback,play, groupId,playback,seek, groupId,playback,seekRelative, groupId,playback,setPlayModes, groupId,playback,skipBack, groupId,playback,skipToNextTrack, groupId,playback,skipToPreviousTrack, groupId,playback,skipToTrack, groupId,playback,togglePlayPause, groupId,playbackExtended,getExtendedPlaybackStatus, groupId,playbackMetadata,getMetadataStatus, groupId,playbackMetadata,rate, groupId,playbackSession,createSession, groupId,playbackSession,joinOrCreateSession, groupId,playbackSession,joinSession, groupId,playlists,loadPlaylist, groupId,sleepTimer,configureSleepTimer, groupId,sleepTimer,getSleepTimer, householdId,alarms,createAlarm, householdId,alarms,fetchAlarm,alarmId, householdId,alarms,getAlarms, householdId,alarms,removeAlarm,alarmId, householdId,alarms,updateAlarm,alarmId, householdId,areas,createArea, householdId,areas,getAreas, householdId,areas,removeArea,areaId, householdId,areas,updateArea,areaId, householdId,authorization,getPermissions,role, householdId,authorization,getPolicyKey,policyKey, householdId,authorization,resolveToken, householdId,devices,completeDeviceRegistration,deviceId, householdId,devices,deregisterDevice,deviceId, householdId,devices,getDeviceRegistrations, householdId,devices,getDevices, householdId,devices,getLocalDevices, householdId,devices,initDeviceRegistration, householdId,devices,refreshDeviceRegistration,deviceId, householdId,devices,removeDevice,playerId, householdId,devicesExtended,getExtendedDeviceStatus, householdId,entitlements,getEntitlements, householdId,favorites,getFavorites, householdId,groups,createGroup, householdId,groups,getGroups, householdId,groups,getGroupsEx, householdId,history,clearHistory, householdId,history,getHistory, householdId,history,postHistory, householdId,history,removeHistoryItem,id, householdId,households,getHouseholdLocation, householdId,households,setLocation, householdId,households,setName, householdId,localContentLibrary,addShare, householdId,localContentLibrary,getShares, householdId,localContentLibrary,reindex, householdId,localContentLibrary,removeShare,shareId, householdId,musicServiceAccounts,getPreferredMusicServiceAccount, householdId,musicServiceAccounts,match, householdId,musicServiceAccounts,setPreferredMusicServiceAccount, householdId,platformInternal,invalidateCache, householdId,platformInternal,sync, householdId,playlists,getPlaylist,playlistId, householdId,playlists,getPlaylists, householdId,playlists,postPlaylist, householdId,settings,getProtectedAdminSettings, householdId,settings,getProtectedAdminSettings,setting, householdId,settings,getProtectedSettings, householdId,settings,getProtectedSettings,setting, householdId,settings,getPublicSettings, householdId,settings,getRestrictedAdminSettings, householdId,settings,setProtectedAdminSettings, householdId,settings,setRestrictedAdminSettings, householdId,settings,setUserMetricsTracking, householdId,smartplay,getContent, householdId,systemTime,getTimeZoneInfo, householdId,systemTime,setTimeZoneInfo, householdId,zones,activateZone,zoneId, householdId,zones,addMissingZoneDefinition, householdId,zones,addZoneDefinition, householdId,zones,deactivateZone,zoneId, householdId,zones,getActiveZoneList, householdId,zones,getZoneDefinition,zoneId, householdId,zones,getZoneDefinitionList, householdId,zones,removeZoneDefinition,zoneId, householdId,zones,updateActiveZone,zoneId, householdId,zones,updateZoneDefinition,zoneId, householdId,zones,updateZoneMemberSettings,zoneId, playerId,audioClip,cancelAudioClip,id, playerId,audioClip,loadAudioClip, playerId,authorization,authenticateClient, playerId,authorization,authorizeDevice, playerId,devices,getRegistrationStatus, playerId,devices,setRegistrationState, playerId,devices,transferDeviceRegistration, playerId,diagnostics,getMetadata, playerId,diagnostics,reportStatus, playerId,diagnostics,submitDiagnostics, playerId,effectiveSettings,getAllSettings, playerId,effectiveSettings,getSettingsGroup,groupName, playerId,effectiveSettings,updateAllSettings, playerId,effectiveSettings,updateSettingsGroup,groupName, playerId,hardwareStatus,activatePairedBluetoothDevice,bluetoothAddress, playerId,hardwareStatus,changeBatteryStatus, playerId,hardwareStatus,getBatteryCells, playerId,hardwareStatus,getBatteryStatus, playerId,hardwareStatus,getBluetoothStatus, playerId,hardwareStatus,getEthernetStatus, playerId,hardwareStatus,getLineInStatus, playerId,hardwareStatus,getLineInStatuses, playerId,hardwareStatus,getMicrophoneSwitchState, playerId,hardwareStatus,getPoeStatus, playerId,hardwareStatus,getWaterStatus, playerId,hardwareStatus,getWiredSubStatus, playerId,hardwareStatus,getWirelessNetworkStatus, playerId,hardwareStatus,initiateOrderlyShutdown, playerId,hardwareStatus,removePairedBluetoothDevice,bluetoothAddress, playerId,hardwareStatus,setBluetoothPairing, playerId,hardwareStatus,transitionToShipMode, playerId,hdmi,edid, playerId,hdmi,powercycle, playerId,hdmi,status, playerId,homeTheater,addAccessoryWifi, playerId,homeTheater,disconnectAccessory, playerId,homeTheater,getAccessoryList, playerId,homeTheater,getAccessorySwapStatus, playerId,homeTheater,getConnectedAccessoryList, playerId,homeTheater,getOptions, playerId,homeTheater,getSwapModelInfo, playerId,homeTheater,getTVAudioSignalStatus, playerId,homeTheater,loadHomeTheaterPlayback, playerId,homeTheater,removeAccessory, playerId,homeTheater,setOptions, playerId,homeTheater,setTvPowerState, playerId,info,getInfo, playerId,ircontrol,getIRControl, playerId,ircontrol,setIRControl, playerId,localContentLibrary,getIndexerStatus, playerId,management,factoryReset, playerId,management,reboot, playerId,networkTest,getNetworkTestResults,networkTestId, playerId,networkTest,startNetworkTests, playerId,networkTest,temporarilyDisableNetwork, playerId,pinewood,back, playerId,pinewood,dpad, playerId,pinewood,home, playerId,pinewood,loadResource, playerId,pinewood,power, playerId,pinewood,settings, playerId,pinewood,toggleMute, playerId,pinewood,togglePlay, playerId,pinewood,volumeDown, playerId,pinewood,volumeUp, playerId,platformInternal,reboot, playerId,playerVolume,duck, playerId,playerVolume,getVolume, playerId,playerVolume,setMute, playerId,playerVolume,setRelativeVolume, playerId,playerVolume,setVolume, playerId,playerVolume,unduck, playerId,positioning,applyAction, playerId,positioning,cancelSession, playerId,positioning,getDeviceMeasurements, playerId,positioning,getMeasurementCapabilities, playerId,positioning,getSessionMap, playerId,positioning,getStimulusTuning, playerId,positioning,notifyDeviceStatus, playerId,positioning,notifySessionError, playerId,positioning,notifySessionStatus, playerId,positioning,playStimulus, playerId,positioning,sendMeasurements, playerId,positioning,setStimulusTuning, playerId,positioning,setTelemetryLevel, playerId,positioning,startSession, playerId,power,setPowerPolicy, playerId,roomDetection,startSignalling, playerId,roomDetection,stopSignalling,playId, playerId,settings,getAllSettings, playerId,settings,getPlayerSettings, playerId,settings,getSettingsGroup,groupName, playerId,settings,setAllowMicrophone, playerId,settings,setEnablePositioningMeasurement, playerId,settings,setPlayerSettings, playerId,settings,setSelfTruePlay, playerId,settings,setSonosNetChannel, playerId,settings,updateAllSettings, playerId,settings,updateSettingsGroup,groupName, playerId,soundSwap,requestSwap, playerId,soundSwap,triggerSwap, playerId,svc,getWeatherConfig, playerId,svc,setWeatherConfig, playerId,svc,voiceCommand, playerId,time,getRelativeTime, playerId,timers,abortTimer,timerId, playerId,timers,createTimer, playerId,timers,getTimers, playerId,timers,pauseTimer,timerId, playerId,timers,resumeTimer,timerId, playerId,timers,setDuration,timerId, playerId,timers,setRelativeDuration,timerId, playerId,trueplay,detectSpeakerPresence, playerId,trueplay,detectSpeakers, playerId,trueplay,getConfiguration,id, playerId,trueplay,getTrueplayStatus, playerId,trueplay,resetDetectedSpeaker, playerId,trueplay,setConfiguration,id, playerId,trueplay,setSpeakerPresenceRate, playerId,trueroom,adaptation, playerId,trueroom,estimatorConfiguration, playerId,trueroom,getCalibrationStatus, playerId,trueroom,playSuccessTone, playerId,trueroom,setSwapInputMute, playerId,update,beginSoftwareUpdate, playerId,update,checkForUpdate, playerId,update,getUpdateStatus, playerId,upnpAlarmClock,call, playerId,upnpAlarmClock,renew,logicalSID, playerId,upnpAlarmClock,subscribe, playerId,upnpAlarmClock,unsubscribe,logicalSID, playerId,upnpAudioIn,call, playerId,upnpAudioIn,renew,logicalSID, playerId,upnpAudioIn,subscribe, playerId,upnpAudioIn,unsubscribe,logicalSID, playerId,upnpAVTransport,call, playerId,upnpAVTransport,renew,logicalSID, playerId,upnpAVTransport,subscribe, playerId,upnpAVTransport,unsubscribe,logicalSID, playerId,upnpConnectionManager,call, playerId,upnpConnectionManager,renew,logicalSID, playerId,upnpConnectionManager,subscribe, playerId,upnpConnectionManager,unsubscribe,logicalSID, playerId,upnpContentDirectory,call, playerId,upnpContentDirectory,renew,logicalSID, playerId,upnpContentDirectory,subscribe, playerId,upnpContentDirectory,unsubscribe,logicalSID, playerId,upnpDeviceProperties,call, playerId,upnpDeviceProperties,renew,logicalSID, playerId,upnpDeviceProperties,subscribe, playerId,upnpDeviceProperties,unsubscribe,logicalSID, playerId,upnpGroupManagement,call, playerId,upnpGroupManagement,renew,logicalSID, playerId,upnpGroupManagement,subscribe, playerId,upnpGroupManagement,unsubscribe,logicalSID, playerId,upnpGroupRenderingControl,call, playerId,upnpGroupRenderingControl,renew,logicalSID, playerId,upnpGroupRenderingControl,subscribe, playerId,upnpGroupRenderingControl,unsubscribe,logicalSID, playerId,upnpHTControl,call, playerId,upnpHTControl,renew,logicalSID, playerId,upnpHTControl,subscribe, playerId,upnpHTControl,unsubscribe,logicalSID, playerId,upnpMusicServices,call, playerId,upnpMusicServices,renew,logicalSID, playerId,upnpMusicServices,subscribe, playerId,upnpMusicServices,unsubscribe,logicalSID, playerId,upnpQueue,call, playerId,upnpQueue,renew,logicalSID, playerId,upnpQueue,subscribe, playerId,upnpQueue,unsubscribe,logicalSID, playerId,upnpRenderingControl,call, playerId,upnpRenderingControl,renew,logicalSID, playerId,upnpRenderingControl,subscribe, playerId,upnpRenderingControl,unsubscribe,logicalSID, playerId,upnpSystemProperties,call, playerId,upnpSystemProperties,renew,logicalSID, playerId,upnpSystemProperties,subscribe, playerId,upnpSystemProperties,unsubscribe,logicalSID, playerId,upnpVirtualLineIn,call, playerId,upnpVirtualLineIn,renew,logicalSID, playerId,upnpVirtualLineIn,subscribe, playerId,upnpVirtualLineIn,unsubscribe,logicalSID, playerId,upnpZoneGroupTopology,call, playerId,upnpZoneGroupTopology,renew,logicalSID, playerId,upnpZoneGroupTopology,subscribe, playerId,upnpZoneGroupTopology,unsubscribe,logicalSID, playerId,virtualLineIn,selectSource, playerId,virtualLineIn,sendBackChannelCmd, playerId,virtualLineIn,startAudio, playerId,virtualLineIn,startTransmission, playerId,virtualLineIn,stopAudio, playerId,virtualLineIn,stopTransmission, playerId,virtualRemoteControl,sendButtonCommand, playerId,voice,createAmazonChallenge, playerId,voice,createVoiceAccount, playerId,voice,getVoiceAccounts, playerId,voice,notifyInitiateOnboarding, playerId,voice,removeVoiceAccount,accountId, playerId,voice,updateVoiceAccount,accountId, playerId,zones,joinZone,zoneId, playerId,zones,unjoinZone,zoneId, serviceId,catalog,batchTranslate, serviceId,catalog,translate,objectId, sessionId,playbackSession,leaveSession, sessionId,playbackSession,loadCloudQueue, sessionId,playbackSession,loadCloudQueueWithWindow, sessionId,playbackSession,loadStreamUrl, sessionId,playbackSession,loadStreamUrlWithContext, sessionId,playbackSession,refreshCloudQueue, sessionId,playbackSession,rejoinSession, sessionId,playbackSession,seek, sessionId,playbackSession,seekRelative, sessionId,playbackSession,skipToItem, sessionId,playbackSession,skipToItemWithWindow, sessionId,playbackSession,suspend, userId,devices,getUserDeviceRegistrations, userId,entitlements,getUserEntitlements, userId,settings,getSettings
    ```
- **route_count:** 533

<details><summary>Evidence (1)</summary>

- fn locSetUpdMgr/cloud client @ 0x10e7bd84 — rodata 0x10e7bd84..0x10e867f0 contiguous route+tuple table

</details>

## `explore_scheme` `strong`

explore:* container URIs — browsable 'explore' trees for services that expose them.

**Technical description:**

explore:* container URI scheme — sibling to radio/container schemes for explorable content

music-service browse URI family; IDs prefixed alb./art./pp./mp.

- **grammar:** explore:<kind>\[:<subkind>\]::<id> — 'explore:album::alb.%s','explore:artist::{,mainreleases,compilations,singlesandeps,toptracks}::art.%s','explore:playlist::{pp,mp}.%s'

<details><summary>Evidence (1)</summary>

- firmware — 'explore:*' scheme literal adjacent to radio/container schemes

</details>

## `hls-aac` `partial`

`hls-aac://` — the AAC-coded HLS variant; same engine as hls-radio with ADTS framing expectations.

**Technical description:**

HLS AAC variant

- **scheme:** hls-aac://

<details><summary>Evidence (1)</summary>

- firmware — scheme literal

</details>

## `hls-radio` `partial`

`hls-radio://` — marks a URI as an HLS radio stream, routing it to the hls-live player rather than a one-shot fetch.

**Technical description:**

HLS radio stream

- **scheme:** hls-radio://

<details><summary>Evidence (1)</summary>

- firmware — scheme literal

</details>

## `hls_aac` `strong`

Marker scheme for AAC-over-HLS streams.

**Technical description:**

HLS AAC variant scheme token in the protocol vocabulary.

- **name:** hls-aac
- **pattern:** hls-aac

<details><summary>Evidence (1)</summary>

- @ 0x10e939c0 — rodata scheme literal

</details>

## `hls_radio` `strong`

Marker scheme for HLS-based internet radio streams.

**Technical description:**

HLS radio variant scheme token in the protocol vocabulary.

- **name:** hls-radio
- **pattern:** hls-radio

<details><summary>Evidence (1)</summary>

- @ 0x10e939cc — rodata scheme literal

</details>

## `hm` `partial`

`hm://` — the Spotify hermes/mercury channel scheme; URIs under it address hermes resources (hwptp devices, tsv, resolve) rather than audio. Never a playable transport URI.

**Technical description:**

Spotify hermes/mercury channel URI

- **scheme:** hm://

<details><summary>Evidence (1)</summary>

- firmware — scheme literal

</details>

## `hm_scheme` `strong`

hm: scheme token — the hermes/mercury-style URI family used by the embedded Spotify stack for device registration and track resolution.

**Technical description:**

Scheme token in the streamer URI vocabulary; semantics unresolved.

- **name:** hm:
- **pattern:** hm:

<details><summary>Evidence (1)</summary>

- @ 0x10fd6244 — rodata scheme literal

</details>

## `http-endpoints-muse` `strong`

The outbound muse/HTTP path templates — the REST routes the player calls or serves, including cloud API routes.

**Technical description:**

Outbound muse/HTTP API path templates (client side, plus local /avt.txt persistence): "v1/households/{householdId}/alarms\[/...\]", "v1/groups/{groupId}/alarms/snooze", "v1/players/{playerId}/upnpAlarmClock\[/subscription\[/{logicalSID}\]\]" families - REST CRUD + subscription surfaces consumed/emitted by the cloud bridge.

```
v1/<collection>/{id}/<action>
```

Used by: cloud alarm sync; UPnP-bridge subscription relay

<details><summary>Evidence (3)</summary>

- @ 0x10e7bf40 — v1/households/{householdId}/alarms
- @ 0x10e83a3c — v1/players/{playerId}/upnpAlarmClock
- @ 0x10e83b68 — subscription renew path

</details>

## `last_fm-radio-http` `partial`

The `last.fm-radio-http` scheme — legacy Last.fm radio over HTTP; still accepted by the scheme table even though the service integration is historical.

**Technical description:**

Last.fm radio HTTP scheme

- **scheme:** last.fm-radio-http

<details><summary>Evidence (1)</summary>

- firmware — scheme literal

</details>

## `misc_schemes` `strong`

The long tail of URI schemes — file://, rtsp://, mms://, last.fm-radio-http, hls-*, pndrradio-*, hm://, skd:, stub: — mostly alternate transports for specific services.

**Technical description:**

URI schemes missed by the main sweep: pndrradioad:// (Pandora ad-insertion transport), pndrradio-http://, hls-radio://, hls-aac://, last.fm-radio-http, skd://, stub://, hm://, file://, rtsp://, mms:// — plus the urn:dev:ops:44974-zp- UDN prefix, urn:ietf:params:oauth:grant-type:jwt-bearer grant, urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1 WMP-registrar advertisement and urn:schemas-rinconnetworks-com:{metadata,update}-1-0 namespaces.

- **schemes:** `pndrradioad://`, `pndrradio-http://`, `hls-radio://`, `hls-aac://`, `last.fm-radio-http`, `skd://`, `stub://`, `hm://`, `file://`, `rtsp://`, `mms://`
- **urns:** `urn:dev:ops:44974-zp-`, `urn:ietf:params:oauth:grant-type:jwt-bearer`, `urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1`, `urn:schemas-rinconnetworks-com:metadata-1-0`, `urn:schemas-rinconnetworks-com:update-1-0`

<details><summary>Evidence (3)</summary>

- @ 0x10ecd058 — pndrradioad://
- @ 0x10f99030 — urn:ietf:params:oauth:grant-type
- @ 0x10f0a9f6 — X_MS_MediaReceiverRegistrar

</details>

## `oauth_jwt_urn` `strong`

The standard OAuth JWT-bearer grant URN used in token exchange flows.

**Technical description:**

IETF JWT-bearer OAuth grant URN used in token flows. Recorded as grant vocabulary; also listed under misc_schemes.

- **name:** urn:ietf:params:oauth:grant-type:jwt-bearer
- **pattern:** urn:ietf:params:oauth:grant-type:jwt-bearer

<details><summary>Evidence (1)</summary>

- @ 0x10f99030 — rodata URN literal

</details>

## `pandora_com-pndrradioad` `partial`

The `pandora.com-pndrradioad` service prefix — identifies Pandora ad-insertion streams distinctly from normal station audio.

**Technical description:**

pandora ad service prefix

- **scheme:** pandora.com-pndrradioad

<details><summary>Evidence (1)</summary>

- firmware — scheme literal

</details>

## `pndrradio-http` `partial`

`pndrradio-http://` — a Pandora radio variant served over plain HTTP. Appears in queue/transport URIs when a Pandora station uses the non-SMAPI path.

**Technical description:**

Pandora radio HTTP variant

- **scheme:** pndrradio-http://

<details><summary>Evidence (1)</summary>

- firmware — scheme literal

</details>

## `pndrradioad` `strong`

Pandora ad-insertion transport scheme — ad segments arrive as pndrradioad:// URIs.

**Technical description:**

Pandora ad-insertion stream marker; scheme strings embedded in the streamer URI dispatch vocabulary.

- **name:** pndrradioad://
- **pattern:** pndrradioad://

<details><summary>Evidence (1)</summary>

- @ 0x10ecd058 — rodata scheme literal

</details>

## `protocol_info_schemes` `confirmed`

The URI-scheme vocabulary the player advertises in GetProtocolInfo — i.e. what it claims it can play.

**Technical description:**

protocolInfo URI scheme vocabulary — the GetProtocolInfo capability set across sink/source

- **grammar:** ConnectionManager Source/SinkProtocolInfo vocabulary — transport:mimetype:extra triples
- **schemes:**
  - **standard:** http-get/file/x-file-cifs over audio{mp3,mp4,m4a,mpeg*,wma,aiff,flac,ogg,wav}+mpegurl/dash
  - **sonos:** sonos.com-{mms,http}:<mime>; sonos.com-spotify:*:audio/x-spotify; sonos.com-rtrecent:*:audio/x-sonos-recent
  - **rincon:** x-rincon{,-mp3radio,-playlist,-queue,-stream,-cpcontainer}:*:*:* — private wire schemes
  - **api:** x-sonosapi-{stream,hls,hls-static}:*:*; x-sonosapi-radio:*:audio/x-sonosapi-radio
- **source_csv_verbatim:** http-get:*:audio/mp3:*,x-file-cifs:*:audio/mp3:*,http-get:*:audio/mp4:*,x-file-cifs:*:audio/mp4:*,http-get:*:audio/x-m4a:*,x-file-cifs:*:audio/x-m4a:*,http-get:*:audio/mpeg:*,x-file-cifs:*:audio/mpeg:*,http-get:*:audio/mpegurl:*,x-file-cifs:*:audio/mpegurl:*,file:*:audio/mpegurl:*,http-get:*:audio/x-mpegurl:*,x-file-cifs:*:audio/x-mpegurl:*,http-get:*:application/x-mpegurl:*,x-file-cifs:*:application/x-mpegurl:*,http-get:*:application/vnd.apple.mpegurl:*,x-file-cifs:*:application/vnd.apple.mpegurl:*,http-get:*:application/dash+xml:*,x-file-cifs:*:application/dash+xml:*,http-get:*:audio/mpeg3:*,x-file-cifs:*:audio/mpeg3:*,http-get:*:audio/wav:*,x-file-cifs:*:audio/wav:*,http-get:*:audio/x-wav:*,x-file-cifs:*:audio/x-wav:*,http-get:*:audio/wma:*,x-file-cifs:*:audio/wma:*,http-get:*:audio/x-ms-wma:*,x-file-cifs:*:audio/x-ms-wma:*,http-get:*:audio/aiff:*,x-file-cifs:*:audio/aiff:*,http-get:*:audio/x-aiff:*,x-file-cifs:*:audio/x-aiff:*,http-get:*:audio/flac:*,x-file-cifs:*:audio/flac:*,http-get:*:application/ogg:*,x-file-cifs:*:application/ogg:*,http-get:*:audio/ogg:*,x-file-cifs:*:audio/ogg:*,sonos.com-mms:*:audio/x-ms-wma:*,sonos.com-http:*:audio/mp3:*,sonos.com-http:*:audio/mpeg:*,sonos.com-http:*:audio/mpeg3:*,sonos.com-http:*:audio/wma:*,sonos.com-http:*:audio/mp4:*,sonos.com-http:*:audio/x-m4a:*,sonos.com-http:*:audio/wav:*,sonos.com-http:*:audio/aiff:*,sonos.com-http:*:audio/flac:*,sonos.com-http:*:application/ogg:*,sonos.com-http:*:application/x-mpegURL:*,sonos.com-http:*:application/dash+xml:*,sonos.com-spotify:*:audio/x-spotify:*,sonos.com-rtrecent:*:audio/x-sonos-recent:*,x-rincon:*:*:*,x-rincon-mp3radio:*:*:*,x-rincon-playlist:*:*:*,x-rincon-queue:*:*:*,x-rincon-stream:*:*:*,x-sonosapi-stream:*:*:*,x-sonosapi-hls:*:*:*,x-sonosapi-hls-static:*:*:*,x-sonosapi-radio:*:audio/x-sonosapi-radio:*,x-rincon-cpcontainer:*:*:*, (@0x10eb87e4, 1855 bytes, verbatim SourceProtocolInfo response literal)
- **sink_csv_verbatim:** file:*:audio/mpegurl:*,x-file-cifs:*:*:*,x-rincon:*:*:*,x-rincon-mp3radio:*:*:*,x-rincon-playlist:*:*:*,x-rincon-queue:*:*:*,x-rincon-stream:*:*:* (@0x10eb8750, SinkProtocolInfo)
- **per_service_extras:** per-service protocolInfo literals also present: real.com-rhapsody-direct:*:audio/x-rhap-radio:*, pandora.com-pndrradio:*:audio/x-pandora-radio:*, x-sonosapi-radio:*:audio/x-sonosapi-radio:* (@0x10e77adc-0x10e77d50) - service-specific accepted types added per registration, not in the base CSV

<details><summary>Evidence (1)</summary>

- @ 0x10e8xxxx — single rodata literal enumerating all protocolInfo triples

</details>

## `rdradio_scheme` `strong`

rdradio: URIs select streaming-radio station sources.

**Technical description:**

rdradio: radio-station URI scheme — streaming radio source selector

radio-service URI family

- **grammar:** rdradio:<kind>:<prefix>. — 'rdradio:artist:Art.','rdradio:station:ps.' + bare 'rdradio:'

<details><summary>Evidence (1)</summary>

- firmware — 'rdradio:' scheme literal

</details>

## `rinconnetworks_urn` `strong`

The Sonos 'rinconnetworks' XML namespace — appears inside DIDL/LastChange metadata for Sonos extension fields.

**Technical description:**

RinconNetworks URN namespace prefix observed in service/URN vocabulary.

- **name:** urn:schemas-rinconnetworks-com
- **pattern:** urn:schemas-rinconnetworks-com

<details><summary>Evidence (1)</summary>

- @ 0x10e7761c — rodata scheme literal

</details>

## `skd` `strong`

skd: — a streamer vocabulary token; semantics unresolved (plausibly a secure-key-delivery or SDK marker).

**Technical description:**

Scheme token in the streamer URI vocabulary; semantics unresolved.

- **name:** skd:
- **pattern:** skd:

<details><summary>Evidence (1)</summary>

- @ 0x10f1032c — rodata scheme literal

</details>

## `sonos-schemes` `strong`

Bare sonos: printf templates (sonos:%d, sonos:%s) — internal identifier formatting, not a playable scheme.

**Technical description:**

Bare sonos: forms used as printf templates and identifiers: "sonos:%d" (0x10ecc3cb), "sonos:%s" (0x10f0ec90), "sonos:hhid:"/"sonos:unit-hhid:" (0x10f9900c/0x10f9901c), plus structured-token prefixes sonos:device/udn/hhid/user/idtype/environment (muse/auth token namespacing, not playback URIs).

```
sonos:<kind>[:<value>]
```

Used by: internal IDs, muse token fields

<details><summary>Evidence (3)</summary>

- @ 0x10ecc3cb — sonos:%d
- @ 0x10f9900c — sonos:hhid:
- @ 0x10eed968 — sonos:device token prefix

</details>

## `sonos_albumart_path` `strong`

The filename pattern for cached album art on disk: AlbumArt_{guid}_Large.jpg — where /getaa responses come from.

**Technical description:**

Album-art asset path: %s/AlbumArt_{%08X-%04X-%04X-%02X%02X-%02X%02X%02X%02X%02X%02X}_Large.jpg — GUID-braced filename emitted by f_10421e70

- **grammar:** <base>/AlbumArt_{GUID}_Large.jpg

<details><summary>Evidence (1)</summary>

- @ 0x10421e70 — fmt site

</details>

## `sonos_com-hls-radio` `partial`

The `sonos.com-hls-radio` service prefix — marks HLS-radio streams coming through the Sonos-hosted radio aggregation service.

**Technical description:**

hls-radio service prefix

- **scheme:** sonos.com-hls-radio

<details><summary>Evidence (1)</summary>

- firmware — scheme literal

</details>

## `sonos_queue_track_uri` `strong`

The emitted form of a queue track reference — x-rincon-queue:<device>#<position>. Useful when constructing 'play this specific track' URIs.

**Technical description:**

Queue URI emit form: x-rincon-queue:%s#%u — device selector + #track fragment (1-based position); %s#0 emits queue head; emitted by f_102d5974, f_102d8518, f_102dac20

- **grammar:** x-rincon-queue:<selector>#<track-index>

<details><summary>Evidence (1)</summary>

- @ 0x102d5974 — fmt sites

</details>

## `sonos_settings_rest` `strong`

Household settings REST endpoints (/settings/api/v1/locations/.../effectiveSettings) — the location/settings API paths.

**Technical description:**

Household settings REST paths: /settings/api/v1/locations/%s/effectiveSettings and .../%s — emitted by f_105dd808, f_105de198 (outbound settings client)

- **grammar:** /settings/api/v1/locations/<id>/effectiveSettings\[/<sub>\]

<details><summary>Evidence (1)</summary>

- @ 0x105dd808 — fmt sites

</details>

## `spotify_scheme` `strong`

Spotify content URIs — spotify:track: / spotify:episode: plus the x-spotify:// transport wrapper used when the embedded Spotify client owns playback.

**Technical description:**

spotify:{track,episode}: + x-spotify:// — Spotify content URI schemes routed via spotify_smapi

native spotify URI passthrough family (image:%h = hex-encoded variant)

- **grammar:** spotify:{ad,episode,image\[:%h\],interruption,track}:...

<details><summary>Evidence (1)</summary>

- firmware — 'spotify:track:','spotify:episode:','x-spotify://' literals + spotify_smapi.cxx

</details>

## `stub` `partial`

`stub://stub:%u` — a placeholder URI used by stub/dummy players in group handling. If it shows up in a queue, the source is a synthetic entry, not real media.

**Technical description:**

stub player URI

- **scheme:** stub://stub:%u

<details><summary>Evidence (1)</summary>

- firmware — scheme literal

</details>

## `stub_scheme` `strong`

stub: — a placeholder/no-op transport marker scheme.

**Technical description:**

Stub scheme token; likely a placeholder/no-op transport marker.

- **name:** stub:
- **pattern:** stub:

<details><summary>Evidence (1)</summary>

- @ 0x10f06b88 — rodata scheme literal

</details>

## `tqueue_probe_chain` `strong`

The queue's URI-sniffing fallback chain: when a scheme isn't directly recognized, the queue probes in this order — explaining why some oddly-schemed URIs still resolve.

**Technical description:**

queue URI sniffing/fallback chain

```
queue probe chain: <ASX playlist detect; mime table /x-ms-,/x-mpegurl,audio/aacp,audio/aac,audio/x-aac,audio/x-scpls; "Trying MMS,RTSP next" scheme fallback; "max redirects(%d)"; HTTP/1.0+ICY 200 OK sniffing for SHOUTcast; "Possible URI truncation" warn; isAd tag -> linkUrl set
```

Used by: t; q; u; e; u; e; ; o; p; e; n

<details><summary>Evidence (1)</summary>

- @ 0x10e93d14 — ASX/mime/ICY literals

</details>

## `tqueue_scheme_registry` `strong`

The queue's complete scheme-dispatch table: every URI scheme the track queue will accept, harvested as a contiguous literal run — the authoritative list of what can be enqueued.

**Technical description:**

complete playable-URI scheme zoo harvested as a contiguous literal run from tqueue.cxx — the queue's scheme dispatch table

```
{"x-rincon-queue": "x-rincon-queue:<hhid>#<idx|hex> — zone-queue URIs; #0 = shared queue root", "x-rincon-buzzer": "x-rincon-buzzer:%u:o — alarm/buzzer chime source", "x-rincon-stream": "x-rincon-stream:%s:%s — remote line-in stream URI", "x-rincon": "group URI (rejected when \"source or target is an ungroupable player\")", "x-sonos-vli": "x-sonos-vli:%s:%u,%s (see vli_grouping)", "stub": "stub://stub:%u — mdns stub target", "x-rincon-mp3radio": "x-rincon-mp3radio:// — mp3 radio streams", "x-sonosprog-http": "x-sonosprog-http: — programmatic http", "x-sonos-mms": "x-sonos-mms: / x-sonosprog-mms: — MMS radio", "x-sonosapi-rtrecent": "recently-tracked rt content", "x-sonosapi-hls": "x-sonosapi-hls: / x-sonosapi-hls-static: / hls-static: / hls-aac:// / hls-radio:// — HLS family", "mms/rtsp/https/file": "mms://, rtsp://, https://, file:// direct", "sirradio": "sirradio: — Sirius", "x-sonos-spotify": "x-sonos-spotify: / x-sonosprog-spotify:", "x-sonosprog": "x-sonosprog base scheme", "x-rincon-configmode": "x-rincon-configmode:{sonar-calibrate-tone,sonar-calibrate-complete,speaker-detect,speaker-detect.mp3,trueroom-tone} — config-mode tone injection", "x-rincon-sonarcal": "x-rincon-sonarcal:{leader.ogg,testtone.ogg,complete_ht.ogg} — trueroom test-tone queue items", "x-rincon-trueroom": "x-rincon-trueroom: scheme"}
```

Used by: t; q; u; e; u; e; ; e; n; q; u; e; u; e; /; p; r; o; b; e

<details><summary>Evidence (1)</summary>

- @ 0x10e938e0 — contiguous literal run 0x10e93904-0x10e93a7c

</details>

## `x-rincon-buzzer` `strong`

The built-in buzzer/alarm-tone URI — a local chime sound, usable as an alarm sound.

**Technical description:**

Built-in buzzer/alarm-tone URI. "x-rincon-buzzer:" (0x10e93a38), "x-rincon-buzzer:1"/"x-rincon-buzzer:0" (0x10e99a04/0x10eaaef8), "x-rincon-buzzer:%u:o" (0x10eb1958 - %u=tone index, :o suffix).

```
x-rincon-buzzer:<n>[:o]
```

Used by: alarm fallback playback (AVT)

<details><summary>Evidence (1)</summary>

- @ 0x10eb1958 — %u:o printf form - indexed tone + o-flag

</details>

## `x-rincon-configmode-sonar` `strong`

Setup-mode tone URIs used while the player is in calibration/config mode.

**Technical description:**

Setup/calibration tone URIs: x-rincon-configmode:{sonar-calibrate-tone, sonar-calibrate-complete, speaker-detect(.mp3), trueroom-tone} and x-rincon-sonarcal:{leader.ogg, testtone.ogg, complete_ht.ogg} - local asset playback for Sonar/trueroom calibration.

```
x-rincon-configmode:<tone-name>[.mp3] | x-rincon-sonarcal:<asset>.ogg
```

Used by: speaker-detect/sonar calibration playback

<details><summary>Evidence (5)</summary>

- @ 0x10e93df4 — sonar-calibrate-tone
- @ 0x10e93e2c — leader.ogg
- @ 0x10e93eb0 — complete_ht.ogg
- @ 0x10e93f0c — speaker-detect.mp3
- @ 0x10e93f34 — trueroom-tone

</details>

## `x-rincon-cpcontainer` `strong`

ContentDirectory provider containers — RDCPA:/RDCPI: variants address browsable music-service container roots.

**Technical description:**

ContentDirectory provider container URI. Variants: "x-rincon-cpcontainer:RDCPA:" / "RDCPI:" (0x10e77970/0x10e7798c - provider-namespace prefixes), "x-rincon-cpcontainer:%s" (0x10e77a40), "x-rincon-cpcontainer:SCPB:%s/%s" (0x10f0dbd4).

```
x-rincon-cpcontainer:<provider-ns>:<id>[/<sub>]
```

Used by: ContentDirectory object IDs; AVTransport EnqueueURI container refs

RDCPA/RDCPI/SCPB namespace semantics unresolved.

<details><summary>Evidence (3)</summary>

- @ 0x10e77970 — RDCPA ns
- @ 0x10e7798c — RDCPI ns
- @ 0x10f0dbd4 — SCPB:%s/%s form

</details>

## `x-rincon-mp3radio` `strong`

The marker for plain internet radio MP3 streams — when a service hands a direct MP3 URL the player wraps it in this scheme.

**Technical description:**

MP3-radio stream marker. "x-rincon-mp3radio://" (0x10e93918), "x-rincon-mp3radio:" (0x10eb8788), bare "x-rincon-mp3radio" (0x10ecce84).

```
x-rincon-mp3radio://<url>
```

Used by: AVTransport radio playback

<details><summary>Evidence (2)</summary>

- @ 0x10e93918 — // form
- @ 0x10eb8788 — colon form

</details>

## `x-rincon-playlist` `strong`

URI for the player's built-in Sonos playlists (the saved 'Sonos Playlists' list), not to be confused with the playback queue.

**Technical description:**

Local playlist URI "x-rincon-playlist:" (0x10e89327).

```
x-rincon-playlist:<id>
```

Used by: saved-queue playlists

<details><summary>Evidence (1)</summary>

- @ 0x10e89327 — scheme literal

</details>

## `x-rincon-queue` `strong`

How you address the local play queue: x-rincon-queue:<device> identifies a player's queue, and #<n> selects the 1-based track position. This is the URI you set as AVTransportURI to play a queue.

**Technical description:**

Local queue URI scheme. Variants: "x-rincon-queue:" (0x10e93904), "x-rincon-queue:%s" (0x10eb1710) - owner/queue selector printf-formatted.

```
x-rincon-queue:[RINCON_<mac>[_<zone>]]
```

Used by: AVTransport queue-backed playback (EnqueueURI/SetAVTransportURI family)

Selector field semantics (room UDN vs queue owner) not yet resolved.

<details><summary>Evidence (2)</summary>

- @ 0x10e93904 — scheme literal
- @ 0x10eb1710 — printf variant in AVT code pool

</details>

## `x-rincon-sonarcal` `confirmed`

URIs for the sonar-calibration tones (leader/testtone/complete_ht .ogg) — played during Trueplay setup; not normal content.

**Technical description:**

x-rincon-sonarcal:{leader,testtone,complete_ht}.ogg — sonar-calibration audio URI scheme

- **grammar:** x-rincon-sonarcal:{leader,testtone,complete_ht}.ogg; x-rincon-configmode:{sonar-calibrate-complete,speaker-detect,speaker-detect.mp3,trueroom-tone}; sonar-calibrate-tone
- **titles:** `ATrueplay`, `ATrueplay Complete`, `ASpeaker Detection`, `ATrueroom`

<details><summary>Evidence (1)</summary>

- firmware — 'x-rincon-sonarcal' scheme literal + sonarctl/route cluster

</details>

## `x-rincon-stream` `strong`

The URI for room-to-room streaming — pointing a player at x-rincon-stream:<source> makes it play another player's audio (this is what line-in sharing and grouping use underneath).

**Technical description:**

Rincon inter-room stream URI. Variants: "x-rincon-stream:" (0x10eacf20), "x-rincon-stream:%s" (0x10e99a5c), "x-rincon-stream:%s:%s" (0x10eb1d08) - room-id\[:sub\] printf forms.

```
x-rincon-stream:<room-id>[:<sub>]
```

Used by: grouped zone playback - slaves pull coordinator stream

<details><summary>Evidence (2)</summary>

- @ 0x10e99a5c — %s form
- @ 0x10eb1d08 — %s:%s form

</details>

## `x-sonos-misc` `strong`

Assorted internal x-sonos-* schemes (HT audio stream, http wrappers, service markers) — mostly internal transport plumbing.

**Technical description:**

Assorted internal x-sonos schemes: x-sonos-htastream (HT audio stream), x-sonos-http\[:\], x-sonos-mms/x-sonosprog-mms, x-sonos-spotify/x-sonosprog-spotify, x-sonos-recent\[:\], x-sonos-dock:, x-sonos-clone-gc/x-sonos-gc-cleared-content (group-coordinator internal), x-sonos-upnp-tunnel/x-sonos-upnp-loopback-token, x-sonos-sync-method/x-sonos-method/x-sonos-uri (sync control), x-sonos-auth-https%s.

```
x-sonos-<kind>[:<arg>]
```

Used by: internal transport/sync/auth plumbing

Catch-all record; split into per-scheme records as uses get traced.

<details><summary>Evidence (4)</summary>

- @ 0x10e99698 — x-sonos-htastream
- @ 0x10eb36bc — x-sonos-clone-gc
- @ 0x10f0258c — x-sonos-upnp-tunnel
- @ 0x10f0f044 — x-sonos-auth-https%s

</details>

## `x-sonos-unknown` `partial`

`x-sonos-unknown:` — the placeholder for a source whose type couldn't be determined. Shows up in transport state when metadata is missing or the source predates classification.

**Technical description:**

unknown-source placeholder URI

- **scheme:** x-sonos-unknown:

<details><summary>Evidence (1)</summary>

- firmware — scheme literal

</details>

## `x-sonos-vli` `strong`

Virtual line-in — a URI that references another player's line-in as a source, the mechanism behind 'line-in sharing'.

**Technical description:**

Virtual line-in source URI. "x-sonos-vli" / "x-sonos-vli:" (0x10ecb64c/0x10ecc20a), "x-sonos-vli:%s:%u" (0x10f01804 - member-id:channel printf form).

```
x-sonos-vli:<member-id>:<channel>
```

Used by: VirtualLineIn source routing; AVTransport line-in playback

<details><summary>Evidence (2)</summary>

- @ 0x10f01804 — %s:%u printf form
- @ 0x10ecb64c — bare token

</details>

## `x-sonosapi-*` `strong`

The cloud/music-service URI family — x-sonosapi-* URIs are content refs that resolve through Sonos cloud APIs rather than direct URLs.

**Technical description:**

Cloud/music-service API URI family: x-sonosapi-hls:%s, x-sonosapi-hls-static:, x-sonosapi-radio\[:ST:%s\], x-sonosapi-stream:, x-sonosapi-iqradio\[:\], x-sonosapi-rtrecent:, x-sonosapi-show:. These mark stream endpoints fetched through the Sonos cloud services rather than direct URLs.

```
x-sonosapi-<service>:[<token>]
```

Used by: AVTransport external-content playback; music-service tracks

One umbrella record for the family; per-service token grammars unresolved.

<details><summary>Evidence (4)</summary>

- @ 0x10e77930 — x-sonosapi-hls:%s
- @ 0x10e77cf8 — x-sonosapi-radio:ST:%s
- @ 0x10e93968 — x-sonosapi-rtrecent:
- @ 0x10ec11eb — x-sonosapi-show:

</details>

## `x-sonosapi-radio` `strong`

A Sonos Radio station URI: x-sonosapi-radio:ST:<id>?sid=&flags=&sn= — carries station id and flags for the radio service.

**Technical description:**

x-sonosapi-radio:ST:%s?sid=&flags=&sn= — Sonos Radio station URI w/ sid/flags/sn params + X-Sonos-Api-Key

service-track radio URI carrying station id, flags, serial number

- **grammar:** x-sonosapi-radio:ST:%s?sid=%d&flags=%x&sn=%d (sn optional: '&sn=%d' variant exists)

<details><summary>Evidence (1)</summary>

- firmware — 'x-sonosapi-radio:ST:%s?sid=&flags=&sn=' format literal + X-Sonos-Api-Key header

</details>

## `x_rincon_schemes` `confirmed`

The x-rincon-* scheme family overview — all the local/internal transports (queue, stream, radio, buzzer, calibration tones, containers).

**Technical description:**

x-rincon* URI scheme family — queue/mp3radio/buzzer/configmode/sonarcal/trueroom/cpcontainer

- **schemes:**
  - **x-rincon-cpcontainer:{RDCPA,RDCPI,...}:** ContentProvider container refs ('Unknown old Rhapsody x-rincon-cpcontainer' legacy)
  - **x-rincon-playlist::** DIDL res protocolInfo for playlist items
  - **x-rincon-queue::** queue references
  - **x-rincon-mp3radio://:** mp3 radio
  - **x-rincon-stream::** generic stream
  - **x-rincon-buzzer::** buzzer/chime audio
  - **x-rincon-configmode:{sonar-calibrate-tone,...}:** config-mode tones
  - **x-rincon-sonarcal:{leader,testtone}.ogg:** sonar/Trueplay calibration audio files

<details><summary>Evidence (1)</summary>

- @ 0x10edxxxx — rodata scheme literals

</details>

## `x_sonos_schemes` `confirmed`

The x-sonos-* scheme family overview — HT/streaming/API service markers.

**Technical description:**

x-sonos* URI scheme family — htastream/prog/api/service schemes + associated headers

- **schemes:**
  - **x-sonosapi-radio:ST:%s?sid=%d&flags=%x&sn=%d:** station-type + service-id + flags + service-number
  - **x-sonosapi-hls:%s?sid=%u&flags=288:** HLS stream w/ sid+flags
  - **x-sonosapi-{stream,hls,hls-static}:** api streams
  - **x-sonosapi-rtrecent:** recently-played feed
  - **x-sonos{,-http,-mms}:** base sonos streams
  - **x-sonosprog-{http,mms,spotify}:** program/progressive variants
  - **x-sonos-spotify:** spotify wrapper
  - **x-sonos-htastream:** home-theater audio stream
  - **x-sonos-clone-gc / x-sonos-gc-cleared-content:** group-coordinator clone/clear ops
  - **x-sonos-unknown:** fallback
- **headers:** `X-Sonos-Api-Key`, `X-Sonos-Corr-Id`, `X-RINCON-BOOTSEQ`, `X-RINCON-VARIANT`, `x-rincon-last-update-device`, `x-rincon-content-version`, `x-rincon-range`

<details><summary>Evidence (1)</summary>

- @ 0x10edxxxx — rodata scheme templates + fmt params

</details>
