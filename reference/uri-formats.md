# URI formats

The address grammar the player understands. When a command says 'play this', it takes an address, meaning a URI: the URL-like string that identifies a song, a stream, a queue entry, a radio station, or a line-in source. Sonos uses its own family of address schemes on top of ordinary URLs. Some point at the local queue, some at another room's stream, some at music-service items, and many carry opaque fields whose meaning had to be recovered from the code that parses them. This page is the complete grammar: every address family the firmware recognizes, what each field means, and which commands accept which families.

<details markdown="1"><summary><b>Technical details</b></summary>

URI scheme grammars recovered from literal tables and parser call sites.

</details>

## `cloud_api_routes` `confirmed`

The full map of outbound cloud API calls the player can make: hundreds of route templates covering everything the player asks Sonos's cloud for, including accounts, services, updates, and telemetry. It's documented as the outbound counterpart of the API the player serves.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Complete outbound cloud API route+dispatch map: 533 route literals, 324 {scope,path,cmd} op tuples over 7 id scopes

**Additional data**

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
  - **grammar:** <scopeId>,<resourcePath>,<operation>\[,<param>...\]: the outbound client's dispatch tuples pairing route templates to named ops
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


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- fn locSetUpdMgr/cloud client @ 0x10e7bd84; rodata 0x10e7bd84..0x10e867f0 contiguous route+tuple table

</details>

## `explore_scheme` `strong`

The 'explore:' container scheme, an address family for explorable content collections that sits alongside the radio and container schemes. It marks browsable sections of service catalogs rather than individual playable items.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

explore:* container URI scheme: sibling to radio/container schemes for explorable content

**Notes**

music-service browse URI family; IDs prefixed alb./art./pp./mp.

**Additional data**

- **grammar:** explore:<kind>\[:<subkind>\]::<id>: 'explore:album::alb.%s','explore:artist::{,mainreleases,compilations,singlesandeps,toptracks}::art.%s','explore:playlist::{pp,mp}.%s'


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; 'explore:*' scheme literal adjacent to radio/container schemes

</details>

## `hls-aac` `strong`

An HLS AAC stream address: segmented AAC audio in the scheme vocabulary, distinct from the generic HLS token.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

HLS AAC variant

**Additional data**

- **scheme:** hls-aac://


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; scheme literal

</details>

## `hls-radio` `strong`

An HLS radio stream address: segmented radio appearing in the scheme vocabulary as its own token.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

HLS radio stream

**Additional data**

- **scheme:** hls-radio://


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; scheme literal

</details>

## `hls_aac` `strong`

An HLS variant in AAC encoding: a segmented-stream address whose marker steers the fetch machinery toward the right decoder for that format.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

HLS AAC variant scheme token in the protocol vocabulary.

**Additional data**

- **name:** hls-aac
- **pattern:** hls-aac


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e939c0; rodata scheme literal

</details>

## `hls_radio` `strong`

An HLS-radio stream variant, meaning Apple's segmented-stream format used for radio. The tag in the address tells the player to pick the right streaming machinery for it.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

HLS radio variant scheme token in the protocol vocabulary.

**Additional data**

- **name:** hls-radio
- **pattern:** hls-radio


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e939cc; rodata scheme literal

</details>

## `hm` `strong`

The Spotify 'Hermes' channel: the hardware bridge inside the embedded Spotify client that carries Connect traffic. It's what the hm:// addresses route to.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Spotify Hermes-style daemon channel (see hm_scheme): hwptp = hardware-platform player bridge carrying the Connect device API; hwp-events = v1/log_event sink. The Connect device paths (%s/devices/%s/{play,pause-state,volume,set_shuffle,set_repeat,pull_playback,queue}, content_encryption_key, offline/restrictions) are Spotify eSDK cache_restrictions.c/api layer.

**Additional data**

- **scheme:** hm://<daemon>/vN/


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; scheme literal

</details>

## `hm_scheme` `confirmed`

The 'hm://' address for the Spotify Connect channel. It routes to the embedded Spotify component (the 'Hermes' path) that lets the speaker appear as a Spotify Connect device in the Spotify app.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

hm:// host-scheme for the Spotify Connect Hermes channel: the embedded Spotify eSDK (buildagent esdk paths, sp_ auth keys) addresses the device's hardware-platform daemons as hm://<service>/vN/<path>. Confirmed hosts: 'hwptp' = hw-platform player bridge (hm://hwptp/v1/devices, hm://hwptp/v1/tsv, hm://hwptp/v2/resolve/%s/%d/%s) and 'hwp-events' = event sink (hm://hwp-events/v1/log_event). The Spotify Connect device API rides it: %s/devices/%s/{state,state_conflict,volume,play,set_shuffle,set_repeat,pull_playback,queue} plus %s/content_encryption_key/%s, %s/cache_key, %s/offline/restrictions.

**Additional data**

- **name:** hm:
- **pattern:** hm:


</details>

<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x10fd6244; rodata scheme literal
- @ 0x10fd6244; hm://hwptp/v1/devices literal

</details>

## `http-endpoints-muse` `strong`

The outbound API paths the player itself calls. When the player acts as a client toward other players or the cloud, these are the route templates it formats its requests against.

```
v1/<collection>/{id}/<action>
```

Used by: cloud alarm sync; UPnP-bridge subscription relay

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Outbound muse/HTTP API path templates (client side, plus local /avt.txt persistence): "v1/households/{householdId}/alarms\[/...\]", "v1/groups/{groupId}/alarms/snooze", "v1/players/{playerId}/upnpAlarmClock\[/subscription\[/{logicalSID}\]\]" families - REST CRUD + subscription surfaces consumed/emitted by the cloud bridge.


</details>

<details markdown="1"><summary>Evidence (3)</summary>

- @ 0x10e7bf40; v1/households/{householdId}/alarms
- @ 0x10e83a3c; v1/players/{playerId}/upnpAlarmClock
- @ 0x10e83b68; subscription renew path

</details>

## `last_fm-radio-http` `confirmed`

A Last.fm radio HTTP address: the service-namespaced radio scheme for the Last.fm integration, a leftover of one of the older service partnerships.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Last.fm radio HTTP scheme

**Additional data**

- **scheme:** last.fm-radio-http


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; scheme literal

</details>

## `misc_schemes` `strong`

Address schemes missed by the main sweep: oddballs like Pandora's ad-insertion transport and HLS radio variants. They're collected so the scheme inventory is genuinely complete rather than just the common cases.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

URI schemes missed by the main sweep: pndrradioad:// (Pandora ad-insertion transport), pndrradio-http://, hls-radio://, hls-aac://, last.fm-radio-http, skd://, stub://, hm://, file://, rtsp://, mms://: plus the urn:dev:ops:44974-zp- UDN prefix, urn:ietf:params:oauth:grant-type:jwt-bearer grant, urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1 WMP-registrar advertisement and urn:schemas-rinconnetworks-com:{metadata,update}-1-0 namespaces.

**Additional data**

- **schemes:** `pndrradioad://`, `pndrradio-http://`, `hls-radio://`, `hls-aac://`, `last.fm-radio-http`, `skd://`, `stub://`, `hm://`, `file://`, `rtsp://`, `mms://`
- **urns:** `urn:dev:ops:44974-zp-`, `urn:ietf:params:oauth:grant-type:jwt-bearer`, `urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1`, `urn:schemas-rinconnetworks-com:metadata-1-0`, `urn:schemas-rinconnetworks-com:update-1-0`


</details>

<details markdown="1"><summary>Evidence (3)</summary>

- @ 0x10ecd058; pndrradioad://
- @ 0x10f99030; urn:ietf:params:oauth:grant-type
- @ 0x10f0a9f6; X_MS_MediaReceiverRegistrar

</details>

## `oauth_jwt_urn` `strong`

A standard token-grant identifier from the OAuth world. It's part of the vocabulary used when the player exchanges credentials with services, recorded as reference rather than a playable address.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

IETF JWT-bearer OAuth grant URN used in token flows. Recorded as grant vocabulary; also listed under misc_schemes.

**Additional data**

- **name:** urn:ietf:params:oauth:grant-type:jwt-bearer
- **pattern:** urn:ietf:params:oauth:grant-type:jwt-bearer


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10f99030; rodata URN literal

</details>

## `pandora_com-pndrradioad` `strong`

A Pandora ad-insertion address with the service prefix: Pandora's ad stream with the provider prefix attached, in the service-namespaced form.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

pandora ad service prefix

**Additional data**

- **scheme:** pandora.com-pndrradioad


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; scheme literal

</details>

## `pndrradio-http` `strong`

Pandora's plain-HTTP radio variant: the non-ad stream address used for the normal station feed, as distinct from the ad-insertion variant.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Pandora radio HTTP variant

**Additional data**

- **scheme:** pndrradio-http://


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; scheme literal

</details>

## `pndrradioad` `strong`

Pandora's ad-insertion stream marker: the address variant used when Pandora injects ads into a stream. It lets the player treat those segments correctly rather than mistaking them for the station's audio.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Pandora ad-insertion stream marker; scheme strings embedded in the streamer URI dispatch vocabulary.

**Additional data**

- **name:** pndrradioad://
- **pattern:** pndrradioad://


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10ecd058; rodata scheme literal

</details>

## `protocol_info_schemes` `confirmed`

The scheme vocabulary the player advertises in its capability strings: the address families it tells the world it can accept or produce. Devices read them when checking compatibility before handing each other streams.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

protocolInfo URI scheme vocabulary: the GetProtocolInfo capability set across sink/source

**Additional data**

- **grammar:** ConnectionManager Source/SinkProtocolInfo vocabulary: transport:mimetype:extra triples
- **schemes:**
  - **standard:** http-get/file/x-file-cifs over audio{mp3,mp4,m4a,mpeg*,wma,aiff,flac,ogg,wav}+mpegurl/dash
  - **sonos:** sonos.com-{mms,http}:<mime>; sonos.com-spotify:*:audio/x-spotify; sonos.com-rtrecent:*:audio/x-sonos-recent
  - **rincon:** x-rincon{,-mp3radio,-playlist,-queue,-stream,-cpcontainer}:*:*:*: private wire schemes
  - **api:** x-sonosapi-{stream,hls,hls-static}:*:*; x-sonosapi-radio:*:audio/x-sonosapi-radio
- **source_csv_verbatim:** http-get:*:audio/mp3:*,x-file-cifs:*:audio/mp3:*,http-get:*:audio/mp4:*,x-file-cifs:*:audio/mp4:*,http-get:*:audio/x-m4a:*,x-file-cifs:*:audio/x-m4a:*,http-get:*:audio/mpeg:*,x-file-cifs:*:audio/mpeg:*,http-get:*:audio/mpegurl:*,x-file-cifs:*:audio/mpegurl:*,file:*:audio/mpegurl:*,http-get:*:audio/x-mpegurl:*,x-file-cifs:*:audio/x-mpegurl:*,http-get:*:application/x-mpegurl:*,x-file-cifs:*:application/x-mpegurl:*,http-get:*:application/vnd.apple.mpegurl:*,x-file-cifs:*:application/vnd.apple.mpegurl:*,http-get:*:application/dash+xml:*,x-file-cifs:*:application/dash+xml:*,http-get:*:audio/mpeg3:*,x-file-cifs:*:audio/mpeg3:*,http-get:*:audio/wav:*,x-file-cifs:*:audio/wav:*,http-get:*:audio/x-wav:*,x-file-cifs:*:audio/x-wav:*,http-get:*:audio/wma:*,x-file-cifs:*:audio/wma:*,http-get:*:audio/x-ms-wma:*,x-file-cifs:*:audio/x-ms-wma:*,http-get:*:audio/aiff:*,x-file-cifs:*:audio/aiff:*,http-get:*:audio/x-aiff:*,x-file-cifs:*:audio/x-aiff:*,http-get:*:audio/flac:*,x-file-cifs:*:audio/flac:*,http-get:*:application/ogg:*,x-file-cifs:*:application/ogg:*,http-get:*:audio/ogg:*,x-file-cifs:*:audio/ogg:*,sonos.com-mms:*:audio/x-ms-wma:*,sonos.com-http:*:audio/mp3:*,sonos.com-http:*:audio/mpeg:*,sonos.com-http:*:audio/mpeg3:*,sonos.com-http:*:audio/wma:*,sonos.com-http:*:audio/mp4:*,sonos.com-http:*:audio/x-m4a:*,sonos.com-http:*:audio/wav:*,sonos.com-http:*:audio/aiff:*,sonos.com-http:*:audio/flac:*,sonos.com-http:*:application/ogg:*,sonos.com-http:*:application/x-mpegURL:*,sonos.com-http:*:application/dash+xml:*,sonos.com-spotify:*:audio/x-spotify:*,sonos.com-rtrecent:*:audio/x-sonos-recent:*,x-rincon:*:*:*,x-rincon-mp3radio:*:*:*,x-rincon-playlist:*:*:*,x-rincon-queue:*:*:*,x-rincon-stream:*:*:*,x-sonosapi-stream:*:*:*,x-sonosapi-hls:*:*:*,x-sonosapi-hls-static:*:*:*,x-sonosapi-radio:*:audio/x-sonosapi-radio:*,x-rincon-cpcontainer:*:*:*, (@0x10eb87e4, 1855 bytes, verbatim SourceProtocolInfo response literal)
- **sink_csv_verbatim:** file:*:audio/mpegurl:*,x-file-cifs:*:*:*,x-rincon:*:*:*,x-rincon-mp3radio:*:*:*,x-rincon-playlist:*:*:*,x-rincon-queue:*:*:*,x-rincon-stream:*:*:* (@0x10eb8750, SinkProtocolInfo)
- **per_service_extras:** per-service protocolInfo literals also present: real.com-rhapsody-direct:*:audio/x-rhap-radio:*, pandora.com-pndrradio:*:audio/x-pandora-radio:*, x-sonosapi-radio:*:audio/x-sonosapi-radio:* (@0x10e77adc-0x10e77d50) - service-specific accepted types added per registration, not in the base CSV


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e8xxxx; single rodata literal enumerating all protocolInfo triples

</details>

## `rdradio_scheme` `strong`

The 'rdradio:' scheme, an address family marking radio-station items for the streaming-radio path. It's how a saved station is identified as something to tune into rather than a file to fetch.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

rdradio: radio-station URI scheme: streaming radio source selector

**Notes**

radio-service URI family

**Additional data**

- **grammar:** rdradio:<kind>:<prefix>.: 'rdradio:artist:Art.','rdradio:station:ps.' + bare 'rdradio:'


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; 'rdradio:' scheme literal

</details>

## `rhapsody_imageserver` `confirmed`

The Rhapsody (later Napster) image-server addresses, describing how artwork from that service's catalog was fetched. It's a leftover of one of Sonos's oldest music-service integrations, kept for compatibility.

Used by: album-art URL construction for Rhapsody-sourced content

<details markdown="1"><summary><b>Technical details</b></summary>

**Notes**

hardcoded Rhapsody/Napster album-art CDN template; %s = image id, fixed 300x300 size. One of few absolute non-Sonos host literals; distinct from the real.com-rhapsody-direct protocolInfo scheme and the old-Rhapsody cpcontainer migration paths

**Additional data**

- **grammar:** http://direct-ns.rhapsody.com/imageserver/images/%s/300x300


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e77c7c; format literal

</details>

## `rinconnetworks_urn` `strong`

The 'RinconNetworks' URN namespace prefix: the internal namespace Sonos's metadata and service identifiers use. 'Rincon' is the platform's internal codename, which is why it appears throughout these schemes.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

RinconNetworks URN namespace prefix observed in service/URN vocabulary.

**Additional data**

- **name:** urn:schemas-rinconnetworks-com
- **pattern:** urn:schemas-rinconnetworks-com


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e7761c; rodata scheme literal

</details>

## `skd` `strong`

A scheme token present in the streamer's vocabulary whose meaning couldn't be resolved. It's recorded for completeness with the honest note that its purpose is unknown rather than guessing.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Scheme token in the streamer URI vocabulary; semantics unresolved.

**Additional data**

- **name:** skd:
- **pattern:** skd:


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10f1032c; rodata scheme literal

</details>

## `sonos-schemes` `strong`

Bare 'sonos:' addresses used internally as templates and identifiers, a small family of Sonos-namespaced locators for housekeeping rather than playable content. They show up inside the system's own bookkeeping rather than in anything you'd browse to.

```
sonos:<kind>[:<value>]
```

Used by: internal IDs, muse token fields

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Bare sonos: forms used as printf templates and identifiers: "sonos:%d" (0x10ecc3cb), "sonos:%s" (0x10f0ec90), "sonos:hhid:"/"sonos:unit-hhid:" (0x10f9900c/0x10f9901c), plus structured-token prefixes sonos:device/udn/hhid/user/idtype/environment (muse/auth token namespacing, not playback URIs).


</details>

<details markdown="1"><summary>Evidence (3)</summary>

- @ 0x10ecc3cb; sonos:%d
- @ 0x10f9900c; sonos:hhid:
- @ 0x10eed968; sonos:device token prefix

</details>

## `sonos_albumart_path` `strong`

The filename pattern for album-art assets the player stores or serves. It's a GUID-shaped name so every image has a unique, stable address that apps can cache against.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Album-art asset path: %s/AlbumArt_{%08X-%04X-%04X-%02X%02X-%02X%02X%02X%02X%02X%02X}_Large.jpg: GUID-braced filename emitted by f_10421e70

**Additional data**

- **grammar:** <base>/AlbumArt_{GUID}_Large.jpg


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10421e70; fmt site

</details>

## `sonos_com-hls-radio` `strong`

An HLS-radio address carrying the 'sonos.com' service prefix: the service-namespaced form of the segmented-radio scheme, tagging which provider the stream belongs to.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

hls-radio service prefix

**Additional data**

- **scheme:** sonos.com-hls-radio


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; scheme literal

</details>

## `sonos_queue_track_uri` `strong`

How a queue-track reference looks when the player emits one: the device-and-queue address plus a fragment naming the track's position. It lets a reply identify exactly which entry is meant rather than just 'the queue'.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Queue URI emit form: x-rincon-queue:%s#%u: device selector + #track fragment (1-based position); %s#0 emits queue head; emitted by f_102d5974, f_102d8518, f_102dac20

**Additional data**

- **grammar:** x-rincon-queue:<selector>#<track-index>


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x102d5974; fmt sites

</details>

## `sonos_settings_rest` `strong`

The settings paths the player calls on the household's configuration service, which is where effective settings and per-location settings live on the REST surface.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Household settings REST paths: /settings/api/v1/locations/%s/effectiveSettings and .../%s: emitted by f_105dd808, f_105de198 (outbound settings client)

**Additional data**

- **grammar:** /settings/api/v1/locations/<id>/effectiveSettings\[/<sub>\]


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x105dd808; fmt sites

</details>

## `spotify_scheme` `strong`

Spotify's own address family: 'spotify:track:' and friends plus the x-spotify form. These are the markers telling the player an item comes through the Spotify integration rather than the generic service path, so the request routes through the Spotify machinery.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

spotify:{track,episode}: + x-spotify://: Spotify content URI schemes routed via spotify_smapi

**Notes**

native spotify URI passthrough family (image:%h = hex-encoded variant)

**Additional data**

- **grammar:** spotify:{ad,episode,image\[:%h\],interruption,track}:...


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; 'spotify:track:','spotify:episode:','x-spotify://' literals + spotify_smapi.cxx

</details>

## `stub` `strong`

A stub-player address: the placeholder used where a real source hasn't been selected yet. It's a stand-in address rather than playable content.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

stub player URI

**Additional data**

- **scheme:** stub://stub:%u


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; scheme literal

</details>

## `stub_scheme` `strong`

A stub scheme token, most likely a placeholder marking a source the player recognizes but can't actually play. It stands in where a real address would go.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Stub scheme token; likely a placeholder/no-op transport marker.

**Additional data**

- **name:** stub:
- **pattern:** stub:


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10f06b88; rodata scheme literal

</details>

## `tqueue_probe_chain` `strong`

The queue's address-sniffing chain. When a URI arrives that isn't obviously one type, the queue probes it through an ordered fallback sequence to figure out what it actually is.

```
queue probe chain: <ASX playlist detect; mime table /x-ms-,/x-mpegurl,audio/aacp,audio/aac,audio/x-aac,audio/x-scpls; "Trying MMS,RTSP next" scheme fallback; "max redirects(%d)"; HTTP/1.0+ICY 200 OK sniffing for SHOUTcast; "Possible URI truncation" warn; isAd tag -> linkUrl set
```

Used by: t; q; u; e; u; e; ; o; p; e; n

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

queue URI sniffing/fallback chain


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e93d14; ASX/mime/ICY literals

</details>

## `tqueue_scheme_registry` `strong`

The complete zoo of playable address schemes harvested from the queue engine's routing table: every scheme the queue knows how to direct, in one inventory. It is the master list of what kinds of source addresses exist.

```
{"x-rincon-queue": "x-rincon-queue:<hhid>#<idx|hex> (zone-queue URIs; #0 = shared queue root", "x-rincon-buzzer": "x-rincon-buzzer:%u:o) alarm/buzzer chime source", "x-rincon-stream": "x-rincon-stream:%s:%s (remote line-in stream URI", "x-rincon": "group URI (rejected when \"source or target is an ungroupable player\")", "x-sonos-vli": "x-sonos-vli:%s:%u,%s (see vli_grouping)", "stub": "stub://stub:%u) mdns stub target", "x-rincon-mp3radio": "x-rincon-mp3radio:// (mp3 radio streams", "x-sonosprog-http": "x-sonosprog-http:) programmatic http", "x-sonos-mms": "x-sonos-mms: / x-sonosprog-mms: (MMS radio", "x-sonosapi-rtrecent": "recently-tracked rt content", "x-sonosapi-hls": "x-sonosapi-hls: / x-sonosapi-hls-static: / hls-static: / hls-aac:// / hls-radio://) HLS family", "mms/rtsp/https/file": "mms://, rtsp://, https://, file:// direct", "sirradio": "sirradio: (Sirius", "x-sonos-spotify": "x-sonos-spotify: / x-sonosprog-spotify:", "x-sonosprog": "x-sonosprog base scheme", "x-rincon-configmode": "x-rincon-configmode:{sonar-calibrate-tone,sonar-calibrate-complete,speaker-detect,speaker-detect.mp3,trueroom-tone}) config-mode tone injection", "x-rincon-sonarcal": "x-rincon-sonarcal:{leader.ogg,testtone.ogg,complete_ht.ogg}: trueroom test-tone queue items", "x-rincon-trueroom": "x-rincon-trueroom: scheme"}
```

Used by: t; q; u; e; u; e; ; e; n; q; u; e; u; e; /; p; r; o; b; e

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

complete playable-URI scheme zoo harvested as a contiguous literal run from tqueue.cxx: the queue's scheme dispatch table


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e938e0; contiguous literal run 0x10e93904-0x10e93a7c

</details>

## `x-rincon-buzzer` `strong`

The address of the player's built-in alarm tones. Instead of waking to music, an alarm can play a buzzer sound stored inside the speaker's own software, and this scheme names those built-in assets so an alarm's 'sound' can be something that works with zero network. These files live inside the speaker itself, so there's nothing for you to download or configure.

```
x-rincon-buzzer:<n>[:o]
```

Used by: alarm fallback playback (AVT)

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Built-in buzzer/alarm-tone URI. "x-rincon-buzzer:" (0x10e93a38), "x-rincon-buzzer:1"/"x-rincon-buzzer:0" (0x10e99a04/0x10eaaef8), "x-rincon-buzzer:%u:o" (0x10eb1958 - %u=tone index,:o suffix).


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10eb1958; %u:o printf form - indexed tone + o-flag

</details>

## `x-rincon-configmode-sonar` `strong`

The addresses of the setup and calibration tones: the chirps and test sounds the player emits during speaker-detection and room-calibration. These point at built-in audio files used while configuring a system, not at music, and they live inside the speaker where you never interact with them directly.

```
x-rincon-configmode:<tone-name>[.mp3] | x-rincon-sonarcal:<asset>.ogg
```

Used by: speaker-detect/sonar calibration playback

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Setup/calibration tone URIs: x-rincon-configmode:{sonar-calibrate-tone, sonar-calibrate-complete, speaker-detect(.mp3), trueroom-tone} and x-rincon-sonarcal:{leader.ogg, testtone.ogg, complete_ht.ogg} - local asset playback for Sonar/trueroom calibration.


</details>

<details markdown="1"><summary>Evidence (5)</summary>

- @ 0x10e93df4; sonar-calibrate-tone
- @ 0x10e93e2c; leader.ogg
- @ 0x10e93eb0; complete_ht.ogg
- @ 0x10e93f0c; speaker-detect.mp3
- @ 0x10e93f34; trueroom-tone

</details>

## `x-rincon-cpcontainer` `strong`

How a music service's browsable folders are addressed. When an app browses a service's catalog (its playlists, charts, and stations), the containers it walks carry addresses in this scheme, tagging them as provider-hosted content rather than local items.

```
x-rincon-cpcontainer:<provider-ns>:<id>[/<sub>]
```

Used by: ContentDirectory object IDs; AVTransport EnqueueURI container refs

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

ContentDirectory provider container URI. Variants: "x-rincon-cpcontainer:RDCPA:" / "RDCPI:" (0x10e77970/0x10e7798c - provider-namespace prefixes), "x-rincon-cpcontainer:%s" (0x10e77a40), "x-rincon-cpcontainer:SCPB:%s/%s" (0x10f0dbd4).

**Notes**

RDCPA/RDCPI namespace semantics RESOLVED via the id->path map (cp_id_map). Residual: kind_enum/flag-word semantics inferred; the record layout switches to 8-word form for raw service-URI prefixes (radea/npsdy/rdradio).

**Additional data**

- **cp_id_map:**
  - **table:** 0x10e7747c
  - **stride:** 0x18
  - **record_shape:** {cp_id, kind_enum, flags, lib_flag(0x1000000=local-library), short_id_prefix, smapi_path_template}
  - **entries:**
    - **RDCPA:ARTALBUM::**
      - **kind:** 0xd
      - **flags:** 0x2064
      - **short:** Art.
      - **path:** explore:artist:mainreleases::art.%s
    - **RDCPA:ARTCOMPILATIONS::**
      - **kind:** 0xd
      - **flags:** 0x2064
      - **short:** Art.
      - **path:** explore:artist:compilations::art.%s
    - **RDCPA:ARTSINGLESEPS::**
      - **kind:** 0xd
      - **flags:** 0x2064
      - **short:** Art.
      - **path:** explore:artist:singlesandeps::art.%s
    - **RDCPA:ARTTOPTRACKS::**
      - **kind:** 0xf
      - **flags:** 0x206c
      - **short:** Art.
      - **path:** explore:artist:toptracks::art.%s
    - **RDCPA:GLBALBUM::**
      - **kind:** 0x4
      - **flags:** 0x20ec
      - **short:** Alb.
      - **path:** explore:album::alb.%s
    - **RDCPA:GLBARTIST::**
      - **kind:** 0x5
      - **flags:** 0xc4
      - **short:** Art.
      - **path:** explore:artist::art.%s
    - **RDCPA:GLBPLAYLIST::**
      - **kind:** 0xe
      - **flags:** 0x4c
      - **short:** pp.
      - **path:** explore:playlist::pp.%s
    - **RDCPA:LIBPLAYLISTS::**
      - **kind:** 0xe
      - **flags:** 0x4c
      - **lib:** True
      - **short:** mp.
      - **path:** explore:playlist::mp.%s
    - **RDCPA:LIBPLAYLISTS:**
      - **kind:** 0xd
      - **flags:** 0x2066
      - **lib:** True
      - **path:** mymusic:playlists
    - **RDCPA:LIBALBUM::**
      - **kind:** 0x4
      - **flags:** 0x20ec
      - **lib:** True
      - **short:** Alb.
      - **path:** mymusic:album::alb.%s
    - **RDCPI:ARTSTATION::**
      - **kind:** 0xc
      - **flags:** 0x4c
      - **short:** Art.
      - **path:** station::sas.%s
    - **RDCPI:GLBSTATION::**
      - **kind:** 0xc
      - **flags:** 0x4c
      - **short:** ps.
      - **path:** station::ps.%s
    - **RDCPI:GLBTRACK::**
      - **kind:** 0x3
      - **flags:** 0x2020
      - **short:** Tra.
      - **path:** ondemand_track::tra.%s
  - **status:** confirmed
  - **notes:** kind_enum f1 (4=album,5=artist,0xc=station,0xd=playlist/artist-album-list,0xe=playlist,0xf=track-list,3=track) and flag words f2 are inferred groupings, not proven semantics; f3=0x1000000 marks local-library entries. Extended 8-word records canonicalize legacy service URI domains (radea:/npsdy: on-demand track ids, rdradio: station ids) onto internal path templates + an explicit source scheme (x-sonos-http:/x-sonosapi-radio:) - i.e. service-URI rewrite rules.
  - **uri_rewrite_entries:**
    - **_shape:** 8 words: {match_prefix, kind_enum, flags, short_id, source_ext, path_template, source_scheme, trailer}
    - **radea:Tra.:**
      - **kind:** 0x3
      - **flags:** 0x2020
      - **short:** Tra.
      - **ext:** .mp3
      - **path:** ondemand_track::tra.%s
      - **scheme:** x-sonos-http:
      - **tail:** .mp4
    - **npsdy:Tra.:**
      - **kind:** 0x3
      - **flags:** 0x2020
      - **short:** Tra.
      - **ext:** .mp3
      - **path:** ondemand_track::tra.%s
      - **scheme:** x-sonos-http:
      - **tail:** .mp4
    - **rdradio:station:ps.:**
      - **kind:** 0xd
      - **flags:** 0x4c
      - **short:** ps.
      - **ext:** ?
      - **path:** station::ps.%s
      - **scheme:** x-sonosapi-radio:
      - **tail:** 0
    - **rdradio:artist:Art.:**
      - **kind:** 0xd
      - **flags:** 0x4c
      - **short:** Art.
      - **ext:** ?
      - **path:** station::sas.%s
      - **scheme:** x-sonosapi-radio:
      - **tail:** 0


</details>

<details markdown="1"><summary>Evidence (4)</summary>

- @ 0x10e77970; RDCPA ns
- @ 0x10e7798c; RDCPI ns
- @ 0x10f0dbd4; SCPB:%s/%s form
- @ 0x10e7747c; 12 x stride-0x18 cp-id translation records

</details>

## `x-rincon-mp3radio` `strong`

The address family for internet radio. A radio-station item carries this scheme so the player knows it's a live MP3 stream to tune into rather than a file or queue entry. It's the marker that sends the request down the streaming-radio path.

```
x-rincon-mp3radio://<url>
```

Used by: AVTransport radio playback

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

MP3-radio stream marker. "x-rincon-mp3radio://" (0x10e93918), "x-rincon-mp3radio:" (0x10eb8788), bare "x-rincon-mp3radio" (0x10ecce84).


</details>

<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x10e93918; // form
- @ 0x10eb8788; colon form

</details>

## `x-rincon-playlist` `strong`

The address of a saved Sonos playlist, which is how commands refer to a stored playlist rather than the live queue. Handing this scheme to 'play' loads the playlist as the current source.

```
x-rincon-playlist:<id>
```

Used by: saved-queue playlists

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Local playlist URI "x-rincon-playlist:" (0x10e89327).


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10e89327; scheme literal

</details>

## `x-rincon-queue` `strong`

How you address the local play queue. When a command says 'play the queue' or 'play track 5 of the queue', the address it hands the player starts with x-rincon-queue: followed by the player's own ID. The address identifies the queue itself rather than an item inside it, and a '#5' style suffix on some forms pins it to a specific queue position.

```
x-rincon-queue:[RINCON_<mac>[_<zone>]]
```

Used by: AVTransport queue-backed playback (EnqueueURI/SetAVTransportURI family)

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Local queue URI scheme. Variants: "x-rincon-queue:" (0x10e93904), "x-rincon-queue:%s" (0x10eb1710) - owner/queue selector printf-formatted.

**Notes**

Selector field semantics (room UDN vs queue owner) not yet resolved.


</details>

<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x10e93904; scheme literal
- @ 0x10eb1710; printf variant in AVT code pool

</details>

## `x-rincon-sonarcal` `confirmed`

The addresses of the sonar-calibration audio: the test tones played during this generation's room-tuning process, including the leader tone, the test tone, and the completion sound. They are kept as built-in assets inside the player rather than files on your network.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

x-rincon-sonarcal:{leader,testtone,complete_ht}.ogg: sonar-calibration audio URI scheme

**Additional data**

- **grammar:** x-rincon-sonarcal:{leader,testtone,complete_ht}.ogg; x-rincon-configmode:{sonar-calibrate-complete,speaker-detect,speaker-detect.mp3,trueroom-tone}; sonar-calibrate-tone
- **titles:** `ATrueplay`, `ATrueplay Complete`, `ASpeaker Detection`, `ATrueroom`


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; 'x-rincon-sonarcal' scheme literal + sonarctl/route cluster

</details>

## `x-rincon-stream` `strong`

How you point a player at another room's audio. When rooms are grouped, the followers don't fetch the music themselves; they play a stream served by the group leader, and this address names that stream using the source player's ID plus a stream reference. It's the address that makes 'play what the living room is playing' work across the network.

```
x-rincon-stream:<room-id>[:<sub>]
```

Used by: grouped zone playback - slaves pull coordinator stream

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Rincon inter-room stream URI. Variants: "x-rincon-stream:" (0x10eacf20), "x-rincon-stream:%s" (0x10e99a5c), "x-rincon-stream:%s:%s" (0x10eb1d08) - room-id\[:sub\] printf forms.


</details>

<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x10e99a5c; %s form
- @ 0x10eb1d08; %s:%s form

</details>

## `x-sonos-misc` `strong`

A catch-all of internal Sonos address schemes for odds and ends: home-theater audio streams, plain HTTP variants, MMS-era stream types, service locators. Individually rare, collectively the long tail of sources the player can address.

```
x-sonos-<kind>[:<arg>]
```

Used by: internal transport/sync/auth plumbing

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Assorted internal x-sonos schemes: x-sonos-htastream (HT audio stream), x-sonos-http\[:\], x-sonos-mms/x-sonosprog-mms, x-sonos-spotify/x-sonosprog-spotify, x-sonos-recent\[:\], x-sonos-dock:, x-sonos-clone-gc/x-sonos-gc-cleared-content (group-coordinator internal), x-sonos-upnp-tunnel/x-sonos-upnp-loopback-token, x-sonos-sync-method/x-sonos-method/x-sonos-uri (sync control), x-sonos-auth-https%s.

**Notes**

Catch-all record; split into per-scheme records as uses get traced.


</details>

<details markdown="1"><summary>Evidence (4)</summary>

- @ 0x10e99698; x-sonos-htastream
- @ 0x10eb36bc; x-sonos-clone-gc
- @ 0x10f0258c; x-sonos-upnp-tunnel
- @ 0x10f0f044; x-sonos-auth-https%s

</details>

## `x-sonos-unknown` `confirmed`

The 'unknown source' placeholder: the address the player uses when it can't identify what a source is. It's a safe label rather than a wrong guess.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

unknown-source placeholder URI

**Additional data**

- **scheme:** x-sonos-unknown:


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; scheme literal

</details>

## `x-sonos-vli` `strong`

The address of a virtual line-in source, the marker for audio being pushed at the player by an external feed rather than pulled from a queue or stream. Seeing this scheme means the sound originates outside the normal playback machinery.

```
x-sonos-vli:<member-id>:<channel>
```

Used by: VirtualLineIn source routing; AVTransport line-in playback

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Virtual line-in source URI. "x-sonos-vli" / "x-sonos-vli:" (0x10ecb64c/0x10ecc20a), "x-sonos-vli:%s:%u" (0x10f01804 - member-id:channel printf form).


</details>

<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x10f01804; %s:%u printf form
- @ 0x10ecb64c; bare token

</details>

## `x-sonosapi-*` `strong`

The address family for cloud and music-service items: the whole family of schemes that say 'this item lives behind a service's API', covering HLS streams, radio services, and streaming-service tracks. Each variant marks how the player should fetch and interpret the content.

```
x-sonosapi-<service>:[<token>]
```

Used by: AVTransport external-content playback; music-service tracks

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

Cloud/music-service API URI family: x-sonosapi-hls:%s, x-sonosapi-hls-static:, x-sonosapi-radio\[:ST:%s\], x-sonosapi-stream:, x-sonosapi-iqradio\[:\], x-sonosapi-rtrecent:, x-sonosapi-show:. These mark stream endpoints fetched through the Sonos cloud services rather than direct URLs.

**Notes**

One umbrella record for the family; per-service token grammars unresolved.


</details>

<details markdown="1"><summary>Evidence (4)</summary>

- @ 0x10e77930; x-sonosapi-hls:%s
- @ 0x10e77cf8; x-sonosapi-radio:ST:%s
- @ 0x10e93968; x-sonosapi-rtrecent:
- @ 0x10ec11eb; x-sonosapi-show:

</details>

## `x-sonosapi-radio` `strong`

The address of a Sonos Radio station. It carries the station identifier plus flags and a session number as parameters, and pairs with an API-key header when the station is fetched.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

x-sonosapi-radio:ST:%s?sid=&flags=&sn=: Sonos Radio station URI w/ sid/flags/sn params + X-Sonos-Api-Key

**Notes**

service-track radio URI carrying station id, flags, serial number

**Additional data**

- **grammar:** x-sonosapi-radio:ST:%s?sid=%d&flags=%x&sn=%d (sn optional: '&sn=%d' variant exists)


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- firmware; 'x-sonosapi-radio:ST:%s?sid=&flags=&sn=' format literal + X-Sonos-Api-Key header

</details>

## `x_rincon_schemes` `confirmed`

The x-rincon* scheme family as a group: the queue, radio, buzzer, calibration, and container address types collected under their shared 'rincon' prefix, rincon being Sonos's internal platform name.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

x-rincon* URI scheme family: queue/mp3radio/buzzer/configmode/sonarcal/trueroom/cpcontainer

**Additional data**

- **schemes:**
  - **x-rincon-cpcontainer:{RDCPA,RDCPI,...}:** ContentProvider container refs ('Unknown old Rhapsody x-rincon-cpcontainer' legacy)
  - **x-rincon-playlist::** DIDL res protocolInfo for playlist items
  - **x-rincon-queue::** queue references
  - **x-rincon-mp3radio://:** mp3 radio
  - **x-rincon-stream::** generic stream
  - **x-rincon-buzzer::** buzzer/chime audio
  - **x-rincon-configmode:{sonar-calibrate-tone,...}:** config-mode tones
  - **x-rincon-sonarcal:{leader,testtone}.ogg:** sonar/Trueplay calibration audio files


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10edxxxx; rodata scheme literals

</details>

## `x_sonos_schemes` `confirmed`

The x-sonos* scheme family as a group: every Sonos-prefixed address type and the headers that travel with them, collected so the whole family's grammar lives in one place.

<details markdown="1"><summary><b>Technical details</b></summary>

**Description**

x-sonos* URI scheme family: htastream/prog/api/service schemes + associated headers

**Additional data**

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


</details>

<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10edxxxx; rodata scheme templates + fmt params

</details>
