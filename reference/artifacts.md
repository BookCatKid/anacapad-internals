# Firmware artifacts

This page is a complete shelf of everything inside the firmware image that you can actually open, read, listen to, or download. When this project describes a built-in sound, a public service contract, a settings file, or a program the speaker runs, the real file is here, copied straight out of the firmware. Each entry explains in plain words what the file is, what the speaker uses it for, and where it lives inside the device, with the exact size, checksum, and engineering notes folded underneath. Nothing here is a mock-up or a screenshot: every download is the genuine artifact as it ships on the player.

Every file below was extracted from the `rootfs-86.10-80260-1-9` firmware image (191 files, 64.1 MB total). Audio plays in the page, images render inline, and text files can be viewed or downloaded. Programs, libraries and modules are download-only: they are ARM binaries, not something a browser can open.

## Audio files

Sounds the speaker itself can play on demand: button chimes, setup prompts, and calibration tones. None of these are music files; they are short built-in sounds the firmware keeps on board so it can answer instantly without downloading anything.

<details markdown="1"><summary><b>Technical details</b></summary>

Playback is triggered through x-rincon-buzzer:, x-rincon-configmode: and x-rincon-sonarcal: URIs resolved against /opt/buzzers and (for downloaded tones) an ETag-managed cache.

</details>

### `0.mp3`

The loudest of the four numbered button chimes. The player plays this through its own speaker when a physical button press needs a clear audible confirmation, such as the final step of a setup or pairing gesture.

<audio controls preload="none" src="../files/opt/buzzers/0.mp3"></audio>

[Download](files/opt/buzzers/0.mp3) · 85.9 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/buzzers/0.mp3`
- **Category:** audio
- **Size:** 85.9 KB (87989 bytes)
- **SHA-256:** `9448835023747a67c6a060bc168b32fa11c9bb4018727a27d10e9961da3dc250`

Buzzer asset index 0, about 88 KB. Resolved by the x-rincon-buzzer:0 URI family and played through the mixer on the alert path rather than the music pipeline.


</details>

### `1.mp3`

A quieter numbered chime used for softer confirmations. It sits alongside the other numbered buzzers as part of the small vocabulary of sounds the player can make without involving a music service.

<audio controls preload="none" src="../files/opt/buzzers/1.mp3"></audio>

[Download](files/opt/buzzers/1.mp3) · 40.3 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/buzzers/1.mp3`
- **Category:** audio
- **Size:** 40.3 KB (41288 bytes)
- **SHA-256:** `e9ccea41f9c98e27b355fe68034dbf77274f3df004cfef18f9ead1817c33a28d`

Buzzer asset index 1, about 41 KB. Same alert-path playback as 0.mp3; the four numbered files form the graded confirmation set.


</details>

### `100.mp3`

Another of the numbered confirmation sounds, used for a different stage or type of action than the low-numbered chimes.

<audio controls preload="none" src="../files/opt/buzzers/100.mp3"></audio>

[Download](files/opt/buzzers/100.mp3) · 41.1 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/buzzers/100.mp3`
- **Category:** audio
- **Size:** 41.1 KB (42061 bytes)
- **SHA-256:** `35669519666e9a07838c621dfaf809fe2086d53790d02ddcfa5ed19622e41733`

Buzzer asset index 100, about 42 KB. The jump in numbering suggests a second group of sounds for a distinct event class inside the same directory.


</details>

### `101.mp3`

The smallest buzzer file, a very short tick or blip used for the lightest possible confirmation.

<audio controls preload="none" src="../files/opt/buzzers/101.mp3"></audio>

[Download](files/opt/buzzers/101.mp3) · 4.9 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/buzzers/101.mp3`
- **Category:** audio
- **Size:** 4.9 KB (5054 bytes)
- **SHA-256:** `6e68b9122065d617ec6c081365345d04091a48b646699e8f478798923c9f9a45`

Buzzer asset index 101, about 5 KB. Its size implies a sub-second clip, consistent with a minimal UI tick.


</details>

### `speaker-detect.mp3`

The loud chirp a speaker emits when the app asks 'which box is this?' During setup or diagnostics the player plays this tone so you can identify which physical speaker you are configuring.

<audio controls preload="none" src="../files/opt/buzzers/speaker-detect.mp3"></audio>

[Download](files/opt/buzzers/speaker-detect.mp3) · 248.8 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/buzzers/speaker-detect.mp3`
- **Category:** audio
- **Size:** 248.8 KB (254725 bytes)
- **SHA-256:** `1611d71bab8d9a7a7d72ae6afc662c6637a9d4eaca9272166de6e54e9c1ff934`

About 255 KB, the largest buzzer by far because it is a longer identification tone. This is the file behind the 'chirp' feature and the x-rincon-configmode:speaker-detect URI documented in the URI formats page.


</details>


## Images

Picture files the speaker stores for its own use, mostly the small product icon shown to apps and other players so your speaker appears with the right picture in lists of devices.

<details markdown="1"><summary><b>Technical details</b></summary>

Served from /opt/htdocs/img and referenced by the device description's iconList so controllers can render the model correctly.

</details>

### `icon-S9.png`

The little Playbar picture the speaker offers to apps and to other players. When a controller lists the devices in your home, this is the icon drawn next to the Playbar's name.

<img src="../files/opt/htdocs/img/icon-S9.png" alt="icon-S9.png" style="max-width:120px">

[Download](files/opt/htdocs/img/icon-S9.png) · 1.2 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/img/icon-S9.png`
- **Category:** image
- **Size:** 1.2 KB (1263 bytes)
- **SHA-256:** `c3a409a2ae628cab55fb09e4f83fc0e11e28bd4978d43ae399e9dbaba7aa7d15`

Product icon for model S9 (Playbar). Served over HTTP from the device itself; referenced by the iconList in device_description.xml. Sister models ship icon-S1.png, icon-S3.png and Sub.png instead, which is how the topology page distinguishes products.


</details>


## Service specifications and device descriptions (XML)

These XML files are the speaker's public contract. They describe, in a standard format, every service the player offers, every command each service accepts, and every value it reports. Apps and other software read these files straight off the speaker to learn what it can do before they ever send it a command.

<details markdown="1"><summary><b>Technical details</b></summary>

UPnP SCPD documents plus the #TOKEN#-templated device description, served verbatim from /opt/htdocs/xml over the device's embedded web server.

</details>

### `zpMetricsConfigV2.xml`

The telemetry rulebook: a 104-entry list of exactly which usage events the speaker is even capable of reporting to Sonos, with almost all of them switched off by default. It is the clearest evidence of what the player could measure about your usage, and proof that most of it is not collected unless enabled.

[View](files/opt/conf/zpMetricsConfigV2.xml) · [Download](files/opt/conf/zpMetricsConfigV2.xml) · 7.8 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 109 lines:

```
<?xml version="1.0"?>
<MetricsConfig version="1.0" rev="13" expires="0" enabled="ON" defaultUploader="" optOutExemptUploader="optOutExempt">
    <Category name="muse.device.subscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.device.unsubscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.favorites.subscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.favorites.unsubscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.groupVolume.getVolume" uploader-ref="" level="OFF"/>
    <Category name="muse.groupVolume.subscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.groupVolume.unsubscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.playback.getPlaybackStatus" uploader-ref="" level="OFF"/>
    <Category name="muse.playback.subscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.playback.unsubscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.playbackMetadata.subscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.playbackMetadata.unsubscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.playbackSession.subscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.playbackSession.unsubscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.playerVolume.duck" uploader-ref="" level="OFF"/>
    <Category name="muse.playerVolume.getVolume" uploader-ref="" level="OFF"/>
    <Category name="muse.playerVolume.subscribe" uploader-ref="" level="OFF"/>
    <Category name="muse.playerVolume.unduck" uploader-ref="" level="OFF"/>
    <Category name="muse.playerVolume.unsubscribe" uploader-ref="" level="OFF"/>
    <Category name="nowplaying.playReport" uploader-ref="optOutExempt" level="ON"/>
    <Category name="upnp.GetHouseholdTimeAtStamp" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetMute" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetPositionInfo" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetRemainingSleepTimerDuration" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetRunningAlarmProperties" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetString" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetTimeZoneAndRule" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetTransportInfo" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetTransportSettings" uploader-ref="" level="OFF"/>
    <Category name="upnp.ReportUnresponsiveDevice" uploader-ref="" level="OFF"/>
    <Category name="upnp.SetMute" uploader-ref="" level="OFF"/>
    <Category name="upnp.SetRoomCalibrationStatus" uploader-ref="" level="OFF"/>
    <Category name="upnp.ReportAlarmStartedRunning" uploader-ref="" level="OFF"/>
    <Category name="upnp.reportPlaySeconds" uploader-ref="" level="OFF"/>
    <Category name="zpAM.maintenance" uploader-ref="" level="ON"/>
    <!-- Events added since 2023 R1 -->
    <!-- DO NOT CHANGE THIS ORDER, as old (S1) players only load up to a certain point -->
    <Category name="upnp.CreateObject" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetAlbumArtistDisplayOption" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetAllPrefixLocations" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetAudioInputAttributes" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetBass" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetButtonState" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetCrossfadeMode" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetDailyIndexRefreshTime" uploader-ref="" level="OFF"/>
    <Category name="upnp.getDeviceAuthToken" uploader-ref="" level="OFF"/>
    <Category name="upnp.getDeviceLinkCode" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetEQ" uploader-ref="" level="OFF"/>
    <Category name="upnp.getExtendedMetadata" uploader-ref="" level="OFF" />
    <Category name="upnp.GetHeadphoneConnected" uploader-ref="" level="OFF"/>
    <Category name="upnp.getLastUpdate" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetLEDFeedbackState" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetLEDState" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetLineInLevel" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetLoudness" uploader-ref="" level="OFF"/>
    <Category name="upnp.GetMediaInfo" uploader-ref="" level="OFF"/>
    <Category name="upnp.getMediaMetadata" uploader-ref="" level="OFF" />
    <Category name="upnp.getMetadata" uploader-ref="" level="OFF"/>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/conf/zpMetricsConfigV2.xml`
- **Category:** specs
- **Size:** 7.8 KB (8015 bytes)
- **SHA-256:** `22632157b4ff286933f1792da55a19e673a1361d9b597e5d0c804041632ba7ab`

Metrics category table, revision 13. Positionally parsed for S1-era compatibility (the file carries a comment warning not to reorder it). Three categories default ON; the rest are opt-in. Referenced by telemetry_submission and the shipped_config record.


</details>

### `S9_array.xml`

The Playbar's speaker-array description: which physical drivers exist, where they sit, and how they are wired. The audio processing reads this to know what hardware it is mixing sound for.

[View](files/opt/dsp/S9_array.xml) · [Download](files/opt/dsp/S9_array.xml) · 13.5 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 72 lines:

```
<arrayDefinition version="1.0">
  <date>05-Feb-2016</date>
  <config entry="0">
    <driverset name="woofer">
      <numChan>6</numChan>
      <numTaps>16</numTaps>
      <description>Production_H_design123</description>
      <digest>tempmd5</digest>
      <arrayDef name="ArrayLeftLows">
        <weights>0x3D881B03,0x3DE1E31C,0x3D9D7115,0xBDB021AD,0xBE74C3B1,0xBDDCCABB,0x3DA27639,0x3D22C0AC,0xBCF43317,0x3DA5DAE6,0x3DA00DBF,0xBCB68795,0x3D22ABD5,0x3B5A72EC,0xBCDBB4D5,0xBB5F525E,0xBD31E165,0x3D86D6B1,0x3D469DCC,0x3C982FEF,0xBE2CC9C2,0xBE0A520D,0x3DD1AF74,0x3D6CFDF5,0xBD670BED,0xBBA89B3D,0x3DF2E9BA,0xBBCE717B,0xBCE8829C,0x3D895248,0xBD4739F7,0xBB02EFA0,0xBC21CACF,0xBD69277D,0x3D5FFD41,0x3D44A280,0x3CAB5D51,0xBDC97318,0xBE36C4E0,0x3C4CA330,0x3E3B34AB,0x3DA03AFC,0xBDD56BD7,0x3D0E29FE,0x3D0D4C55,0xBDFAE22C,0x3D6C31DD,0xBBC0AE2F,0xBD03E5B0,0x3D8DBED3,0xBD513B3C,0x3D395C47,0xBD5DD5A4,0xBE31F6B8,0xBE17F511,0x3E0105B0,0x3DFB3E59,0xBDAD75F2,0x3DF668BC,0x3D97CB19,0xBDA91608,0x3D1A3985,0xBD605E60,0xBCE01EE3,0x3D0B2384,0xBCDA14F2,0x3CC1F136,0xBC1D16D0,0xBD19AEF6,0xBD0CB3C3,0xBE40DD06,0xBD3BE4D6,0x3E498890,0xBC5EA609,0xBCE96C2A,0x3DC315AE,0xBC7D8F9C,0x3C331849,0x3D1FB3E2,0xBD47F8F6,0xBB43159F,0xBBFDB628,0xBD0C62CF,0x3CA43079,0xBB89C6E2,0xBDA8CE74,0xBE26C3E1,0x3D8C5DB1,0x3E065E14,0xBD18BEAF,0x3D2275AC,0x3D295F18,0xBD4043EE,0x3CEE0DDD,0xBC0F9EAE,0xBD0A5EC0,0x3D00AA8E,0xBC965F09,0xBB4C3C97,0xBB90876C,0xBD03535D,0x3C3C43B1</weights>
        <alphas>0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5</alphas>
        <delays>44,33,8,14,0,0</delays>
      </arrayDef>
      <arrayDef name="ArrayRightLows">
        <weights>0xBDA8CE74,0xBE26C3E1,0x3D8C5DB1,0x3E065E14,0xBD18BEAF,0x3D2275AC,0x3D295F18,0xBD4043EE,0x3CEE0DDD,0xBC0F9EAE,0xBD0A5EC0,0x3D00AA8E,0xBC965F09,0xBB4C3C97,0xBB90876C,0xBD03535D,0x3C3C43B1,0xBD19AEF6,0xBD0CB3C3,0xBE40DD06,0xBD3BE4D6,0x3E498890,0xBC5EA609,0xBCE96C2A,0x3DC315AE,0xBC7D8F9C,0x3C331849,0x3D1FB3E2,0xBD47F8F6,0xBB43159F,0xBBFDB628,0xBD0C62CF,0x3CA43079,0xBB89C6E2,0x3D395C47,0xBD5DD5A4,0xBE31F6B8,0xBE17F511,0x3E0105B0,0x3DFB3E59,0xBDAD75F2,0x3DF668BC,0x3D97CB19,0xBDA91608,0x3D1A3985,0xBD605E60,0xBCE01EE3,0x3D0B2384,0xBCDA14F2,0x3CC1F136,0xBC1D16D0,0x3D5FFD41,0x3D44A280,0x3CAB5D51,0xBDC97318,0xBE36C4E0,0x3C4CA330,0x3E3B34AB,0x3DA03AFC,0xBDD56BD7,0x3D0E29FE,0x3D0D4C55,0xBDFAE22C,0x3D6C31DD,0xBBC0AE2F,0xBD03E5B0,0x3D8DBED3,0xBD513B3C,0x3D86D6B1,0x3D469DCC,0x3C982FEF,0xBE2CC9C2,0xBE0A520D,0x3DD1AF74,0x3D6CFDF5,0xBD670BED,0xBBA89B3D,0x3DF2E9BA,0xBBCE717B,0xBCE8829C,0x3D895248,0xBD4739F7,0xBB02EFA0,0xBC21CACF,0xBD69277D,0x3D881B03,0x3DE1E31C,0x3D9D7115,0xBDB021AD,0xBE74C3B1,0xBDDCCABB,0x3DA27639,0x3D22C0AC,0xBCF43317,0x3DA5DAE6,0x3DA00DBF,0xBCB68795,0x3D22ABD5,0x3B5A72EC,0xBCDBB4D5,0xBB5F525E,0xBD31E165</weights>
        <alphas>0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5</alphas>
        <delays>0,0,14,8,33,44</delays>
      </arrayDef>
      <arrayDef name="ArrayCenterLows">
        <weights>0x3CE33ADA,0x3D3FED12,0x3D299E2C,0xBB4672D7,0xBD4D1B04,0xBD1EA43B,0xBC8E0841,0xBBD55477,0x3C8CAD30,0x3CDED141,0x3C04E61A,0x3CA98045,0x3C8423F9,0xBCC28CDE,0xBC8F5E4E,0xBC624FC6,0xBC4F9DDB,0x3C5BC6F8,0x3B4FCE4D,0xBC803F23,0xBD8D9E18,0xBD3B4FA7,0x3D17ADDE,0x3D8DB852,0x3D1650A5,0x3C1020D4,0xBC862654,0xBD1A946F,0xBC8FFB66,0xBD07D4DF,0x3BE2D706,0x3CA9FCB4,0x3BFE4EA7,0x3CEA256A,0x3E020AB8,0xBE823A69,0xBEF6CB1A,0x3D8CA807,0x3EC6E6F9,0xBDBB1EC7,0x3E5D29FA,0x3D9F4F8B,0xBE265AC2,0x3DC224C3,0xBE778C1A,0x3C201D65,0xBD9ADD1B,0xBCB0A77F,0x3E0FDB95,0x3C8B78DA,0x3E11EEF1,0x3D0F5647,0xBD94C632,0xBE6FC4F7,0xBDA36246,0x3E39B97C,0x3DBF4C05,0x3D6AC31E,0x3DB8C360,0xBD654862,0xBD5E22BA,0xBD8B9E7E,0xBD9C1B7B,0xBADFC78C,0x3C01357E,0x3D4E0220,0x3D72AACB,0x3CF9E5AA,0x3BA288D6,0xBD41B92D,0xBD6B3F78,0x3BF815F1,0x3D00339B,0x3D874C2C,0x3D4582C8,0xBC865E1E,0xBD0703CE,0xBD2B8A5E,0xBD02EBE8,0xBC381434,0x3CA19770,0x3CC379CC,0x3CBAB215,0x3CA2B986,0xBABEDDFB,0x3D15317B,0x3D24B8BD,0x3C40E6CB,0xBC42024D,0xBC148991,0xBD09FDB4,0xBD1F53F8,0x3A630A59,0x3B00E9D9,0x3C363DDB,0x3D0EA5A4,0x3D04E141,0x3C9068EE,0xBC947E7E,0xBCCB243D,0xBCCE4195,0xBCE8348F</weights>
        <alphas>0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215</alphas>
        <delays>0,19,63,54,49,19</delays>
      </arrayDef>
    </driverset>
  </config>
  <config entry="1">
    <driverset name="woofer">
      <numChan>6</numChan>
      <numTaps>16</numTaps>
      <description>Production_VA_design123</description>
      <digest>tempmd5</digest>
      <arrayDef name="ArrayLeftLows">
        <weights>0x3D881B03,0x3DE1E31C,0x3D9D7115,0xBDB021AD,0xBE74C3B1,0xBDDCCABB,0x3DA27639,0x3D22C0AC,0xBCF43317,0x3DA5DAE6,0x3DA00DBF,0xBCB68795,0x3D22ABD5,0x3B5A72EC,0xBCDBB4D5,0xBB5F525E,0xBD31E165,0x3D86D6B1,0x3D469DCC,0x3C982FEF,0xBE2CC9C2,0xBE0A520D,0x3DD1AF74,0x3D6CFDF5,0xBD670BED,0xBBA89B3D,0x3DF2E9BA,0xBBCE717B,0xBCE8829C,0x3D895248,0xBD4739F7,0xBB02EFA0,0xBC21CACF,0xBD69277D,0x3D5FFD41,0x3D44A280,0x3CAB5D51,0xBDC97318,0xBE36C4E0,0x3C4CA330,0x3E3B34AB,0x3DA03AFC,0xBDD56BD7,0x3D0E29FE,0x3D0D4C55,0xBDFAE22C,0x3D6C31DD,0xBBC0AE2F,0xBD03E5B0,0x3D8DBED3,0xBD513B3C,0x3D395C47,0xBD5DD5A4,0xBE31F6B8,0xBE17F511,0x3E0105B0,0x3DFB3E59,0xBDAD75F2,0x3DF668BC,0x3D97CB19,0xBDA91608,0x3D1A3985,0xBD605E60,0xBCE01EE3,0x3D0B2384,0xBCDA14F2,0x3CC1F136,0xBC1D16D0,0xBD19AEF6,0xBD0CB3C3,0xBE40DD06,0xBD3BE4D6,0x3E498890,0xBC5EA609,0xBCE96C2A,0x3DC315AE,0xBC7D8F9C,0x3C331849,0x3D1FB3E2,0xBD47F8F6,0xBB43159F,0xBBFDB628,0xBD0C62CF,0x3CA43079,0xBB89C6E2,0xBDA8CE74,0xBE26C3E1,0x3D8C5DB1,0x3E065E14,0xBD18BEAF,0x3D2275AC,0x3D295F18,0xBD4043EE,0x3CEE0DDD,0xBC0F9EAE,0xBD0A5EC0,0x3D00AA8E,0xBC965F09,0xBB4C3C97,0xBB90876C,0xBD03535D,0x3C3C43B1</weights>
        <alphas>0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5</alphas>
        <delays>44,33,8,14,0,0</delays>
      </arrayDef>
      <arrayDef name="ArrayRightLows">
        <weights>0xBDA8CE74,0xBE26C3E1,0x3D8C5DB1,0x3E065E14,0xBD18BEAF,0x3D2275AC,0x3D295F18,0xBD4043EE,0x3CEE0DDD,0xBC0F9EAE,0xBD0A5EC0,0x3D00AA8E,0xBC965F09,0xBB4C3C97,0xBB90876C,0xBD03535D,0x3C3C43B1,0xBD19AEF6,0xBD0CB3C3,0xBE40DD06,0xBD3BE4D6,0x3E498890,0xBC5EA609,0xBCE96C2A,0x3DC315AE,0xBC7D8F9C,0x3C331849,0x3D1FB3E2,0xBD47F8F6,0xBB43159F,0xBBFDB628,0xBD0C62CF,0x3CA43079,0xBB89C6E2,0x3D395C47,0xBD5DD5A4,0xBE31F6B8,0xBE17F511,0x3E0105B0,0x3DFB3E59,0xBDAD75F2,0x3DF668BC,0x3D97CB19,0xBDA91608,0x3D1A3985,0xBD605E60,0xBCE01EE3,0x3D0B2384,0xBCDA14F2,0x3CC1F136,0xBC1D16D0,0x3D5FFD41,0x3D44A280,0x3CAB5D51,0xBDC97318,0xBE36C4E0,0x3C4CA330,0x3E3B34AB,0x3DA03AFC,0xBDD56BD7,0x3D0E29FE,0x3D0D4C55,0xBDFAE22C,0x3D6C31DD,0xBBC0AE2F,0xBD03E5B0,0x3D8DBED3,0xBD513B3C,0x3D86D6B1,0x3D469DCC,0x3C982FEF,0xBE2CC9C2,0xBE0A520D,0x3DD1AF74,0x3D6CFDF5,0xBD670BED,0xBBA89B3D,0x3DF2E9BA,0xBBCE717B,0xBCE8829C,0x3D895248,0xBD4739F7,0xBB02EFA0,0xBC21CACF,0xBD69277D,0x3D881B03,0x3DE1E31C,0x3D9D7115,0xBDB021AD,0xBE74C3B1,0xBDDCCABB,0x3DA27639,0x3D22C0AC,0xBCF43317,0x3DA5DAE6,0x3DA00DBF,0xBCB68795,0x3D22ABD5,0x3B5A72EC,0xBCDBB4D5,0xBB5F525E,0xBD31E165</weights>
        <alphas>0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5</alphas>
        <delays>0,0,14,8,33,44</delays>
      </arrayDef>
      <arrayDef name="ArrayCenterLows">
        <weights>0x3CE33ADA,0x3D3FED12,0x3D299E2C,0xBB4672D7,0xBD4D1B04,0xBD1EA43B,0xBC8E0841,0xBBD55477,0x3C8CAD30,0x3CDED141,0x3C04E61A,0x3CA98045,0x3C8423F9,0xBCC28CDE,0xBC8F5E4E,0xBC624FC6,0xBC4F9DDB,0x3C5BC6F8,0x3B4FCE4D,0xBC803F23,0xBD8D9E18,0xBD3B4FA7,0x3D17ADDE,0x3D8DB852,0x3D1650A5,0x3C1020D4,0xBC862654,0xBD1A946F,0xBC8FFB66,0xBD07D4DF,0x3BE2D706,0x3CA9FCB4,0x3BFE4EA7,0x3CEA256A,0x3E020AB8,0xBE823A69,0xBEF6CB1A,0x3D8CA807,0x3EC6E6F9,0xBDBB1EC7,0x3E5D29FA,0x3D9F4F8B,0xBE265AC2,0x3DC224C3,0xBE778C1A,0x3C201D65,0xBD9ADD1B,0xBCB0A77F,0x3E0FDB95,0x3C8B78DA,0x3E11EEF1,0x3D0F5647,0xBD94C632,0xBE6FC4F7,0xBDA36246,0x3E39B97C,0x3DBF4C05,0x3D6AC31E,0x3DB8C360,0xBD654862,0xBD5E22BA,0xBD8B9E7E,0xBD9C1B7B,0xBADFC78C,0x3C01357E,0x3D4E0220,0x3D72AACB,0x3CF9E5AA,0x3BA288D6,0xBD41B92D,0xBD6B3F78,0x3BF815F1,0x3D00339B,0x3D874C2C,0x3D4582C8,0xBC865E1E,0xBD0703CE,0xBD2B8A5E,0xBD02EBE8,0xBC381434,0x3CA19770,0x3CC379CC,0x3CBAB215,0x3CA2B986,0xBABEDDFB,0x3D15317B,0x3D24B8BD,0x3C40E6CB,0xBC42024D,0xBC148991,0xBD09FDB4,0xBD1F53F8,0x3A630A59,0x3B00E9D9,0x3C363DDB,0x3D0EA5A4,0x3D04E141,0x3C9068EE,0xBC947E7E,0xBCCB243D,0xBCCE4195,0xBCE8348F</weights>
        <alphas>0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215</alphas>
        <delays>0,19,63,54,49,19</delays>
      </arrayDef>
    </driverset>
  </config>
  <config entry="2">
    <driverset name="woofer">
      <numChan>6</numChan>
      <numTaps>16</numTaps>
      <description>Production_VB_design123</description>
      <digest>tempmd5</digest>
      <arrayDef name="ArrayLeftLows">
        <weights>0x3D881B03,0x3DE1E31C,0x3D9D7115,0xBDB021AD,0xBE74C3B1,0xBDDCCABB,0x3DA27639,0x3D22C0AC,0xBCF43317,0x3DA5DAE6,0x3DA00DBF,0xBCB68795,0x3D22ABD5,0x3B5A72EC,0xBCDBB4D5,0xBB5F525E,0xBD31E165,0x3D86D6B1,0x3D469DCC,0x3C982FEF,0xBE2CC9C2,0xBE0A520D,0x3DD1AF74,0x3D6CFDF5,0xBD670BED,0xBBA89B3D,0x3DF2E9BA,0xBBCE717B,0xBCE8829C,0x3D895248,0xBD4739F7,0xBB02EFA0,0xBC21CACF,0xBD69277D,0x3D5FFD41,0x3D44A280,0x3CAB5D51,0xBDC97318,0xBE36C4E0,0x3C4CA330,0x3E3B34AB,0x3DA03AFC,0xBDD56BD7,0x3D0E29FE,0x3D0D4C55,0xBDFAE22C,0x3D6C31DD,0xBBC0AE2F,0xBD03E5B0,0x3D8DBED3,0xBD513B3C,0x3D395C47,0xBD5DD5A4,0xBE31F6B8,0xBE17F511,0x3E0105B0,0x3DFB3E59,0xBDAD75F2,0x3DF668BC,0x3D97CB19,0xBDA91608,0x3D1A3985,0xBD605E60,0xBCE01EE3,0x3D0B2384,0xBCDA14F2,0x3CC1F136,0xBC1D16D0,0xBD19AEF6,0xBD0CB3C3,0xBE40DD06,0xBD3BE4D6,0x3E498890,0xBC5EA609,0xBCE96C2A,0x3DC315AE,0xBC7D8F9C,0x3C331849,0x3D1FB3E2,0xBD47F8F6,0xBB43159F,0xBBFDB628,0xBD0C62CF,0x3CA43079,0xBB89C6E2,0xBDA8CE74,0xBE26C3E1,0x3D8C5DB1,0x3E065E14,0xBD18BEAF,0x3D2275AC,0x3D295F18,0xBD4043EE,0x3CEE0DDD,0xBC0F9EAE,0xBD0A5EC0,0x3D00AA8E,0xBC965F09,0xBB4C3C97,0xBB90876C,0xBD03535D,0x3C3C43B1</weights>
        <alphas>0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5</alphas>
        <delays>44,33,8,14,0,0</delays>
      </arrayDef>
      <arrayDef name="ArrayRightLows">
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/dsp/S9_array.xml`
- **Category:** specs
- **Size:** 13.5 KB (13775 bytes)
- **SHA-256:** `9f918ed4a9ea9d584af2e72d5d9e61083a482fa55bf73b98bd02ac8841758e46`

Per-model driver/array map for model S9 consumed by the DSP configuration layer. Sister entries exist for other models (the S39/S41 variants referenced in dsp_files are not shipped here).


</details>

### `AVTransport1.xml`

The official contract for the AVTransport service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/AVTransport1.xml) · [Download](files/opt/htdocs/xml/AVTransport1.xml) · 51.3 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 1537 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="no">
      <name>TransportState</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>STOPPED</allowedValue>
        <allowedValue>PLAYING</allowedValue>
        <allowedValue>PAUSED_PLAYBACK</allowedValue>
        <allowedValue>TRANSITIONING</allowedValue>
      </allowedValueList>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>TransportStatus</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>TransportErrorDescription</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>TransportErrorURI</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>TransportErrorHttpCode</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>TransportErrorHttpHeaders</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>PlaybackStorageMedium</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>NONE</allowedValue>
        <allowedValue>NETWORK</allowedValue>
      </allowedValueList>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>RecordStorageMedium</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>NONE</allowedValue>
      </allowedValueList>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>PossiblePlaybackStorageMedia</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>PossibleRecordStorageMedia</name>
      <dataType>string</dataType>
    </stateVariable>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/AVTransport1.xml`
- **Category:** specs
- **Size:** 51.3 KB (52535 bytes)
- **SHA-256:** `37b60a5577dbc75d12d11574e6cfbfec0a8442363fb1590ebd3fa147df14d84d`

SCPD (Service Control Protocol Description) for AVTransport1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `AlarmClock1.xml`

The official contract for the AlarmClock service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/AlarmClock1.xml) · [Download](files/opt/htdocs/xml/AlarmClock1.xml) · 14.5 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 447 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_ISO8601Time</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Recurrence</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>ONCE</allowedValue>
        <allowedValue>WEEKDAYS</allowedValue>
        <allowedValue>WEEKENDS</allowedValue>
        <allowedValue>DAILY</allowedValue>
      </allowedValueList>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AlarmID</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AlarmList</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AlarmEnabled</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AlarmProgramURI</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AlarmProgramMetaData</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AlarmPlayMode</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>NORMAL</allowedValue>
        <allowedValue>REPEAT_ALL</allowedValue>
        <allowedValue>SHUFFLE_NOREPEAT</allowedValue>
        <allowedValue>SHUFFLE</allowedValue>
      </allowedValueList>
      <defaultValue>NORMAL</defaultValue>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AlarmVolume</name>
      <dataType>ui2</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AlarmIncludeLinkedZones</name>
      <dataType>boolean</dataType>
    </stateVariable>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/AlarmClock1.xml`
- **Category:** specs
- **Size:** 14.5 KB (14871 bytes)
- **SHA-256:** `548d73b396023dfb1bc1125cf195ff224dda63563f012a6ab43af38e9d1d0387`

SCPD (Service Control Protocol Description) for AlarmClock1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `AudioIn1.xml`

The official contract for the AudioIn service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/AudioIn1.xml) · [Download](files/opt/htdocs/xml/AudioIn1.xml) · 4.2 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 137 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_MemberID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_TransportSettings</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>AudioInputName</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>Icon</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>LineInConnected</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>LeftLineInLevel</name>
      <dataType>i4</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>RightLineInLevel</name>
      <dataType>i4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_ObjectID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>Playing</name>
      <dataType>boolean</dataType>
    </stateVariable>
  </serviceStateTable>
  <actionList>
    <action>
      <name>StartTransmissionToGroup</name>
      <argumentList>
        <argument>
          <name>ObjectID</name>
          <direction>in</direction>
          <relatedStateVariable>A_ARG_TYPE_ObjectID</relatedStateVariable>
        </argument>
        <argument>
          <name>CoordinatorID</name>
          <direction>in</direction>
          <relatedStateVariable>A_ARG_TYPE_MemberID</relatedStateVariable>
        </argument>
        <argument>
          <name>CurrentTransportSettings</name>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/AudioIn1.xml`
- **Category:** specs
- **Size:** 4.2 KB (4282 bytes)
- **SHA-256:** `86b16d72f97cf9acd2838755c2fa2e1316e64328eb5b0a59618779f7d9bf9b2a`

SCPD (Service Control Protocol Description) for AudioIn1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `ConnectionManager1.xml`

The official contract for the ConnectionManager service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/ConnectionManager1.xml) · [Download](files/opt/htdocs/xml/ConnectionManager1.xml) · 4.3 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 132 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="yes">
      <name>SourceProtocolInfo</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>SinkProtocolInfo</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>CurrentConnectionIDs</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_ConnectionStatus</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>OK</allowedValue>
        <allowedValue>ContentFormatMismatch</allowedValue>
        <allowedValue>InsufficientBandwidth</allowedValue>
        <allowedValue>UnreliableChannel</allowedValue>
        <allowedValue>Unknown</allowedValue>
      </allowedValueList>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_ConnectionManager</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Direction</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>Input</allowedValue>
        <allowedValue>Output</allowedValue>
      </allowedValueList>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_ProtocolInfo</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_ConnectionID</name>
      <dataType>i4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AVTransportID</name>
      <dataType>i4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_RcsID</name>
      <dataType>i4</dataType>
    </stateVariable>
  </serviceStateTable>
  <actionList>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/ConnectionManager1.xml`
- **Category:** specs
- **Size:** 4.3 KB (4410 bytes)
- **SHA-256:** `e83cb407f88ee426584e81b72ec0cf6f81c9f7cc93d1fe0c781a76050e999c9f`

SCPD (Service Control Protocol Description) for ConnectionManager1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `ContentDirectory1.xml`

The official contract for the ContentDirectory service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/ContentDirectory1.xml) · [Download](files/opt/htdocs/xml/ContentDirectory1.xml) · 12.1 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 387 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_ObjectID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Result</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_SearchCriteria</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_BrowseFlag</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>BrowseMetadata</allowedValue>
        <allowedValue>BrowseDirectChildren</allowedValue>
      </allowedValueList>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Filter</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_SortCriteria</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Prefix</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Index</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Count</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_UpdateID</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_TagValueList</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AlbumArtistDisplayOption</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/ContentDirectory1.xml`
- **Category:** specs
- **Size:** 12.1 KB (12412 bytes)
- **SHA-256:** `da7fba3dbe2a6e1b2a5800d405acd9224ccc21b670486ba5b799da2b94d2759d`

SCPD (Service Control Protocol Description) for ContentDirectory1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `DeviceProperties1.xml`

The official contract for the DeviceProperties service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/DeviceProperties1.xml) · [Download](files/opt/htdocs/xml/DeviceProperties1.xml) · 21.2 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 688 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="no">
      <name>HouseholdID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>SettingsReplicationState</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>ZoneName</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>Icon</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>Configuration</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>TargetRoomName</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>Invisible</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>IsZoneBridge</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>AirPlayEnabled</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>SupportsAudioIn</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>SupportsAudioClip</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>IsIdle</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>MoreInfo</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/DeviceProperties1.xml`
- **Category:** specs
- **Size:** 21.2 KB (21692 bytes)
- **SHA-256:** `e28dca20dc7acd059a6793cb9b703b51b079204685772f50788e19c85909d95f`

SCPD (Service Control Protocol Description) for DeviceProperties1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `GroupManagement1.xml`

The official contract for the GroupManagement service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/GroupManagement1.xml) · [Download](files/opt/htdocs/xml/GroupManagement1.xml) · 4.1 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 130 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_MemberID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_TransportSettings</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AVTransportURI</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_BufferingResultCode</name>
      <dataType>i4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_BootSeq</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>GroupCoordinatorIsLocal</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>LocalGroupUUID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>VirtualLineInGroupID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>SourceAreaIds</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>ResetVolumeAfter</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>VolumeAVTransportURI</name>
      <dataType>string</dataType>
    </stateVariable>
  </serviceStateTable>
  <actionList>
    <action>
      <name>AddMember</name>
      <argumentList>
        <argument>
          <name>MemberID</name>
          <direction>in</direction>
          <relatedStateVariable>A_ARG_TYPE_MemberID</relatedStateVariable>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/GroupManagement1.xml`
- **Category:** specs
- **Size:** 4.1 KB (4192 bytes)
- **SHA-256:** `5d0aecb87832118364f3f0ebc25034d40d3d6113cddb20fdbd86966b4e187c67`

SCPD (Service Control Protocol Description) for GroupManagement1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `GroupRenderingControl1.xml`

The official contract for the GroupRenderingControl service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/GroupRenderingControl1.xml) · [Download](files/opt/htdocs/xml/GroupRenderingControl1.xml) · 3.8 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 126 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="yes">
      <name>GroupMute</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>GroupVolume</name>
      <dataType>ui2</dataType>
      <allowedValueRange>
        <minimum>0</minimum>
        <maximum>100</maximum>
        <step>1</step>
      </allowedValueRange>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>GroupVolumeChangeable</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_InstanceID</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_VolumeAdjustment</name>
      <dataType>i4</dataType>
    </stateVariable>
  </serviceStateTable>
  <actionList>
    <action>
      <name>GetGroupMute</name>
      <argumentList>
        <argument>
          <name>InstanceID</name>
          <direction>in</direction>
          <relatedStateVariable>A_ARG_TYPE_InstanceID</relatedStateVariable>
        </argument>
        <argument>
          <name>CurrentMute</name>
          <direction>out</direction>
          <relatedStateVariable>GroupMute</relatedStateVariable>
        </argument>
      </argumentList>
    </action>
    <action>
      <name>SetGroupMute</name>
      <argumentList>
        <argument>
          <name>InstanceID</name>
          <direction>in</direction>
          <relatedStateVariable>A_ARG_TYPE_InstanceID</relatedStateVariable>
        </argument>
        <argument>
          <name>DesiredMute</name>
          <direction>in</direction>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/GroupRenderingControl1.xml`
- **Category:** specs
- **Size:** 3.8 KB (3847 bytes)
- **SHA-256:** `b57c4da0060d81daeddbdcce776f6450e86b3a29444c9dd0f30d24b06d011fc1`

SCPD (Service Control Protocol Description) for GroupRenderingControl1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `HTControl1.xml`

The official contract for the HTControl service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/HTControl1.xml) · [Download](files/opt/htdocs/xml/HTControl1.xml) · 4.0 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 137 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="yes">
      <name>TOSLinkConnected</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>IRRepeaterState</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>On</allowedValue>
        <allowedValue>Off</allowedValue>
        <allowedValue>Disabled</allowedValue>
      </allowedValueList>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Timeout</name>
      <dataType>ui4</dataType>
      <allowedValueRange>
        <minimum>0</minimum>
        <maximum>60000</maximum>
      </allowedValueRange>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_IRRemoteName</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_IRCode</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>RemoteConfigured</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>LEDFeedbackState</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>On</allowedValue>
        <allowedValue>Off</allowedValue>
      </allowedValueList>
    </stateVariable>
  </serviceStateTable>
  <actionList>
    <action>
      <name>SetIRRepeaterState</name>
      <argumentList>
        <argument>
          <name>DesiredIRRepeaterState</name>
          <direction>in</direction>
          <relatedStateVariable>IRRepeaterState</relatedStateVariable>
        </argument>
      </argumentList>
    </action>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/HTControl1.xml`
- **Category:** specs
- **Size:** 4.0 KB (4096 bytes)
- **SHA-256:** `77f2bbc05da5be3f69c111e18caa6d0e382f9906ed3423f637fefe06ab9b2759`

SCPD (Service Control Protocol Description) for HTControl1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `MusicServices1.xml`

The official contract for the MusicServices service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/MusicServices1.xml) · [Download](files/opt/htdocs/xml/MusicServices1.xml) · 2.4 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 78 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_ServiceDescriptorList</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_ServiceTypeList</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>ServiceId</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>ServiceListVersion</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>SessionId</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>Username</name>
      <dataType>string</dataType>
    </stateVariable>
  </serviceStateTable>
  <actionList>
    <action>
      <name>GetSessionId</name>
      <argumentList>
        <argument>
          <name>ServiceId</name>
          <direction>in</direction>
          <relatedStateVariable>ServiceId</relatedStateVariable>
        </argument>
        <argument>
          <name>Username</name>
          <direction>in</direction>
          <relatedStateVariable>Username</relatedStateVariable>
        </argument>
        <argument>
          <name>SessionId</name>
          <direction>out</direction>
          <relatedStateVariable>SessionId</relatedStateVariable>
        </argument>
      </argumentList>
    </action>
    <action>
      <name>ListAvailableServices</name>
      <argumentList>
        <argument>
          <name>AvailableServiceDescriptorList</name>
          <direction>out</direction>
          <relatedStateVariable>A_ARG_TYPE_ServiceDescriptorList</relatedStateVariable>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/MusicServices1.xml`
- **Category:** specs
- **Size:** 2.4 KB (2437 bytes)
- **SHA-256:** `443c68da88cfaa81fb693ae95d61554d8d4cbf15636a56e88d2fe753e49141c4`

SCPD (Service Control Protocol Description) for MusicServices1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `QPlay1.xml`

The official contract for the QPlay service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/QPlay1.xml) · [Download](files/opt/htdocs/xml/QPlay1.xml) · 1.5 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 52 of 52 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Seed</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Code</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_MID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_DID</name>
      <dataType>string</dataType>
    </stateVariable>
  </serviceStateTable>
  <actionList>
    <action>
      <name>QPlayAuth</name>
      <argumentList>
        <argument>
          <name>Seed</name>
          <direction>in</direction>
          <relatedStateVariable>A_ARG_TYPE_Seed</relatedStateVariable>
        </argument>
        <argument>
          <name>Code</name>
          <direction>out</direction>
          <relatedStateVariable>A_ARG_TYPE_Code</relatedStateVariable>
        </argument>
        <argument>
          <name>MID</name>
          <direction>out</direction>
          <relatedStateVariable>A_ARG_TYPE_MID</relatedStateVariable>
        </argument>
        <argument>
          <name>DID</name>
          <direction>out</direction>
          <relatedStateVariable>A_ARG_TYPE_DID</relatedStateVariable>
        </argument>
      </argumentList>
    </action>
  </actionList>
</scpd>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/QPlay1.xml`
- **Category:** specs
- **Size:** 1.5 KB (1541 bytes)
- **SHA-256:** `f24c1e176d29b120a34d4e45fdf08c624cc412a7456b50a4c1d0bfe04d58d7e3`

SCPD (Service Control Protocol Description) for QPlay1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `Queue1.xml`

The official contract for the Queue service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/Queue1.xml) · [Download](files/opt/htdocs/xml/Queue1.xml) · 15.8 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 474 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="yes">
      <name>LastChange</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>UpdateID</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>Curated</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_UpdateID</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_QueueID</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_QueueOwnerID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_QueueOwnerContext</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_QueuePolicy</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_URI</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_LIST_URI</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_URIMetaData</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_ObjectID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_TrackNumber</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/Queue1.xml`
- **Category:** specs
- **Size:** 15.8 KB (16218 bytes)
- **SHA-256:** `dc3a1fbf9ab423435c47898efe6155e70087aaece34f8b7de386fc9e1e14c897`

SCPD (Service Control Protocol Description) for Queue1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `RenderingControl1.xml`

The official contract for the RenderingControl service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/RenderingControl1.xml) · [Download](files/opt/htdocs/xml/RenderingControl1.xml) · 23.6 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 756 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="yes">
      <name>LastChange</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>Mute</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>Volume</name>
      <dataType>ui2</dataType>
      <allowedValueRange>
        <minimum>0</minimum>
        <maximum>100</maximum>
        <step>1</step>
      </allowedValueRange>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_LeftVolume</name>
      <dataType>ui2</dataType>
      <allowedValueRange>
        <minimum>0</minimum>
        <maximum>100</maximum>
        <step>1</step>
      </allowedValueRange>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_RightVolume</name>
      <dataType>ui2</dataType>
      <allowedValueRange>
        <minimum>0</minimum>
        <maximum>100</maximum>
        <step>1</step>
      </allowedValueRange>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>VolumeDB</name>
      <dataType>i2</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>Bass</name>
      <dataType>i2</dataType>
      <allowedValueRange>
        <minimum>-10</minimum>
        <maximum>10</maximum>
        <step>1</step>
      </allowedValueRange>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>Treble</name>
      <dataType>i2</dataType>
      <allowedValueRange>
        <minimum>-10</minimum>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/RenderingControl1.xml`
- **Category:** specs
- **Size:** 23.6 KB (24173 bytes)
- **SHA-256:** `f2f3a113a1b4b1b6fc30466e6b63c7f38e92c24cf87ed396d698ac7d1175c656`

SCPD (Service Control Protocol Description) for RenderingControl1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `SystemProperties1.xml`

The official contract for the SystemProperties service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/SystemProperties1.xml) · [Download](files/opt/htdocs/xml/SystemProperties1.xml) · 13.9 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 429 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_VariableName</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_VariableStringValue</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AccountType</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AccountUID</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AccountUDN</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AccountID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AccountPassword</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AccountNickname</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AccountCredential</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_AccountMd</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_IsExpired</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_StubsCreated</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_RDMEnabled</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/SystemProperties1.xml`
- **Category:** specs
- **Size:** 13.9 KB (14284 bytes)
- **SHA-256:** `b28a3a00f1d8cadae1b518a1205366fc9bc19011106f36b30729fb8b637db993`

SCPD (Service Control Protocol Description) for SystemProperties1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `VirtualLineIn1.xml`

The official contract for the VirtualLineIn service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/VirtualLineIn1.xml) · [Download](files/opt/htdocs/xml/VirtualLineIn1.xml) · 4.6 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 152 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_InstanceID</name>
      <dataType>ui4</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_PlayerID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Volume</name>
      <dataType>ui2</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_CurrentTransportSettings</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_Speed</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>CurrentTrackMetaData</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>EnqueuedTransportURIMetaData</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>AVTransportURIMetaData</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>CurrentTransportActions</name>
      <dataType>string</dataType>
    </stateVariable>
  </serviceStateTable>
  <actionList>
    <action>
      <name>StartTransmission</name>
      <argumentList>
        <argument>
          <name>InstanceID</name>
          <direction>in</direction>
          <relatedStateVariable>A_ARG_TYPE_InstanceID</relatedStateVariable>
        </argument>
        <argument>
          <name>CoordinatorID</name>
          <direction>in</direction>
          <relatedStateVariable>A_ARG_TYPE_PlayerID</relatedStateVariable>
        </argument>
        <argument>
          <name>CurrentTransportSettings</name>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/VirtualLineIn1.xml`
- **Category:** specs
- **Size:** 4.6 KB (4665 bytes)
- **SHA-256:** `5cac437abedee9e253984bad999a9094c6b6b03dbb1792995719390dd80d5396`

SCPD (Service Control Protocol Description) for VirtualLineIn1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `ZoneGroupTopology1.xml`

The official contract for the ZoneGroupTopology service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](files/opt/htdocs/xml/ZoneGroupTopology1.xml) · [Download](files/opt/htdocs/xml/ZoneGroupTopology1.xml) · 8.5 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 262 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<scpd xmlns="urn:schemas-upnp-org:service-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <serviceStateTable>
    <stateVariable sendEvents="yes">
      <name>AvailableSoftwareUpdate</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>ZoneGroupState</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>ThirdPartyMediaServersX</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>AlarmRunSequence</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>MuseHouseholdId</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>ZoneGroupName</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>ZoneGroupID</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="yes">
      <name>ZonePlayerUUIDsInGroup</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_UpdateType</name>
      <dataType>string</dataType>
      <allowedValueList>
        <allowedValue>All</allowedValue>
        <allowedValue>Software</allowedValue>
      </allowedValueList>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_CachedOnly</name>
      <dataType>boolean</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_UpdateItem</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
      <name>A_ARG_TYPE_UpdateURL</name>
      <dataType>string</dataType>
    </stateVariable>
    <stateVariable sendEvents="no">
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/ZoneGroupTopology1.xml`
- **Category:** specs
- **Size:** 8.5 KB (8661 bytes)
- **SHA-256:** `326ef256aedc954c06984039a6c9940a9e537e27b37c5ed2031728a835fe330f`

SCPD (Service Control Protocol Description) for ZoneGroupTopology1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


</details>

### `device_description.xml`

The speaker's self-description document: the first file any controller downloads. It announces the model, the serial number, the icon, and the list of services the device offers, so everything else in the conversation starts from here.

[View](files/opt/htdocs/xml/device_description.xml) · [Download](files/opt/htdocs/xml/device_description.xml) · 9.7 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 220 lines:

```
<?xml version="1.0" encoding="utf-8" ?>
<root xmlns="urn:schemas-upnp-org:device-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <device>
    <deviceType>urn:schemas-upnp-org:device:ZonePlayer:1</deviceType>
    <friendlyName>#HOST# - #VENDOR_NAME# #DISPLAY_NAME# - #UUID#</friendlyName>
    <manufacturer>Sonos, Inc.</manufacturer>
    <manufacturerURL>http://www.sonos.com</manufacturerURL>
    <modelNumber>#MODEL#</modelNumber>
    <modelDescription>#VENDOR_NAME# #DISPLAY_NAME#</modelDescription>
    <modelName>#VENDOR_NAME# #DISPLAY_NAME#</modelName>
    <modelURL>http://www.sonos.com/products/zoneplayers/#MODEL#</modelURL>
    <softwareVersion>#SW_VERSION#</softwareVersion>
    <swGen>#SW_GENERATION#</swGen>
    <hardwareVersion>#HW_VERSION#</hardwareVersion>
    <serialNum>#SERIAL_NUM#</serialNum>
    <MACAddress>#MAC_ADDRESS#</MACAddress>
    <UDN>uuid:#UUID#</UDN>
    <iconList>
      <icon>
        <id>0</id>
        <mimetype>image/png</mimetype>
        <width>48</width>
        <height>48</height>
        <depth>24</depth>
        <url>/img/icon-#MODEL#.png</url>
      </icon>
    </iconList>
    <minCompatibleVersion>#SW_MINCOMPATVER#</minCompatibleVersion>
    <legacyCompatibleVersion>#SW_LEGACYCOMPATVER#</legacyCompatibleVersion>
    <apiVersion>#API_VERSION#</apiVersion>
    <minApiVersion>#MIN_API_VERSION#</minApiVersion>
    <displayVersion>#DISPLAY_VERSION#</displayVersion>
    <extraVersion>#EXTRA_VERSION#</extraVersion>
    <nsVersion>#NS_VERSION#</nsVersion>
    <versions>
      <audioTxProtocol>#NODE_PROTO_VERSIONS#</audioTxProtocol>
      <htAudioTxProtocol>#HTA_FRAME_VERSIONS#</htAudioTxProtocol>
      <controlAPI>#MUSE_API_VERSIONS#</controlAPI>
      <trueplaySDK>#TRUEPLAY_SDK_VERSIONS#</trueplaySDK>
    </versions>
    <roomName>#NAME#</roomName>
    <displayName>#DISPLAY_NAME#</displayName>
    <zoneType>#ZONETYPE#</zoneType>
    <feature1>#FEATURE1#</feature1>
    <feature2>#FEATURE2#</feature2>
    <feature3>#FEATURE3#</feature3>
    <feature4>#FEATURE4#</feature4>
    <seriesid>#SERIESID#</seriesid>
    <variant>#VARIANT#</variant>
    <internalSpeakerSize>#INT_SPEAKER_SIZE#</internalSpeakerSize>
    <memory>#MEMORY#</memory>
    <flash>#FLASH#</flash>
    <ampOnTime>#AMP_ONTIME#</ampOnTime>
    <retailMode>#RETAIL_MODE#</retailMode>
    <SSLPort>#SSL_PORT#</SSLPort>
    <securehhSSLPort>#HHSSL_PORT#</securehhSSLPort>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/device_description.xml`
- **Category:** specs
- **Size:** 9.7 KB (9936 bytes)
- **SHA-256:** `58dabd2bfc174cafa5d524805c681a2c759bc1ee0636d364702df56b1d80633d`

The #TOKEN#-templated root UPnP device description. 35 substitution tokens (#UUID#, #HOST#, #MODEL#, #SW_VERSION#...) are filled in per-unit before serving. This is the file that makes the box discoverable and describable.


</details>

### `factory_reset.xsl`

A stylesheet used to render a simple page during the factory-reset flow: the tiny bit of presentation logic behind the reset web screen.

[View](files/opt/htdocs/xml/factory_reset.xsl) · [Download](files/opt/htdocs/xml/factory_reset.xsl) · 647 B

<details markdown="1"><summary><b>Preview</b></summary>

First 15 of 15 lines:

```
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head></head>
    <body>
        Challenge: <xsl:value-of select="/factoryResetKeys/challenge" /><br />
        
        <form action="/reboot" method="POST">
            <input type="hidden" name="reset" value="yes"/>
            <label for="confirm">Confirmation Token: </label><input type="text" name="confirm" id="confirm" /><br />
            <button type="submit">Confirm</button>
        </form>
    </body>
</html>
</xsl:template></xsl:stylesheet>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/factory_reset.xsl`
- **Category:** specs
- **Size:** 647 B (647 bytes)
- **SHA-256:** `27510614835b3191e769680c2a3bcd4fa618dcf9980cf966146bf54a67ba44d2`

XSL transform shipped alongside the XML specs; used when rendering reset-related status content in the embedded web UI.


</details>

### `group_description.xml`

The same kind of self-description, but for a grouped room rather than a single speaker. When a group of players acts as one, this document describes that combined identity to the outside world.

[View](files/opt/htdocs/xml/group_description.xml) · [Download](files/opt/htdocs/xml/group_description.xml) · 825 B

<details markdown="1"><summary><b>Preview</b></summary>

First 24 of 24 lines:

```
<?xml version="1.0"?>
<root xmlns="urn:schemas-upnp-org:device-1-0">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <device>
    <deviceType>urn:smartspeaker-audio:device:SpeakerGroup:1</deviceType>
    <friendlyName>#GROUP_NAME#</friendlyName>
    <manufacturer>SONOS</manufacturer>
    <UDN>uuid:#UUID#</UDN>
    <apiVersion>#API_VERSION#</apiVersion>
    <minApiVersion>#MIN_API_VERSION#</minApiVersion>
    <serviceList>
      <service>
        <serviceType>urn:smartspeaker-audio:service:SpeakerGroup:1</serviceType>
        <serviceId>urn:smartspeaker-audio:serviceId:SpeakerGroup</serviceId>
        <controlURL>/ssdp/notfound</controlURL>
        <eventSubURL>/ssdp/notfound</eventSubURL>
        <SCPDURL>/ssdp/notfound</SCPDURL>
      </service>
    </serviceList>
  </device>
</root>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/group_description.xml`
- **Category:** specs
- **Size:** 825 B (825 bytes)
- **SHA-256:** `cf5570ddb9e3f7ba505ef790c0f599bda7476390b856f58b7e413a8ee2513cc6`

The group-level device description variant. Distinct from satellite_device.xml on smaller models; here it presents the zone group's virtual device surface.


</details>

### `review.xsl`

A companion stylesheet for rendering a review-style status page in the speaker's built-in web interface.

[View](files/opt/htdocs/xml/review.xsl) · [Download](files/opt/htdocs/xml/review.xsl) · 90.1 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 2014 lines:

```
<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
<style type="text/css">
a { text-decoration: none; }
a:hover { text-decoration: underline; }
h1 {
    font-family: arial, helvetica, sans-serif;
    font-size: 18pt;
    font-weight: bold;
}
h2 {
    font-family: arial, helvetica, sans-serif;
    font-size: 14pt;
    font-weight: bold;
}
body, td {
    font-family: arial, helvetica, sans-serif;
    font-size: 10pt;
}
th {
    font-family: arial, helvetica, sans-serif;
    font-size: 11pt;
    font-weight: bold;
}
table,table.purple {
border-spacing:1px;
margin-bottom:20px;
margin-top: 20px;
}
table.purple {
margin-left: auto;
margin-right: auto;
}
table.purple tr {background:#cccccc;}
table.purple td {padding:3px; background:#cccccc;}
table.purple th {padding:3px; background:#9999cc;}
table.purple td.left {
font-weight: bold;
background:#ccccff;
padding-right:20px;
}
.l1 { }
.leftMargin { margin-left: 10pt}

#edidTable {table-layout:fixed; word-wrap:break-word; width:50%}

#networkTable {table-collapse:collapse; border-spacing:0}
#networkTable td {border:2px groove black; padding:7px}
#networkTable th {border:2px groove black; padding:7px}
.ctr {text-align:center}

.cellWithTooltip {
    position:relative;
}

.cellTooltip {
    display: none;
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/xml/review.xsl`
- **Category:** specs
- **Size:** 90.1 KB (92259 bytes)
- **SHA-256:** `61d6e6c46d29a2cb2a85d49cef6a01221ce4091422807894d37942300d8f0f82`

XSL transform under /opt/htdocs/xml; pairs with review.js in the web assets.


</details>

### `musicservices.xml`

The seed list of music services the player knows about before the cloud supplies an updated catalog. On first boot this is how the speaker already knows names like Spotify before your account adds anything.

[View](files/opt/musicservices/musicservices.xml) · [Download](files/opt/musicservices/musicservices.xml) · 293 B

<details markdown="1"><summary><b>Preview</b></summary>

First 6 of 6 lines:

```
<Services>
  <Service Id="254" Name="TuneIn" Version="1.1" Uri="http://legato.radiotime.com/Radio.asmx" SecureUri="https://legato.radiotime.com/Radio.asmx" ContainerType="MService" Capabilities="0">
    <Policy Auth="Anonymous" PollInterval="0"/>
    <Presentation />
  </Service>
</Services>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/musicservices/musicservices.xml`
- **Category:** specs
- **Size:** 293 B (293 bytes)
- **SHA-256:** `d3b7e14ddaf84f03c59b21ae228efc0dafe44c8d6800a849676ea4c10f361e8b`

Seed service catalog under /opt/musicservices. Replaced by the cloud-delivered service list at registration; replicated household-wide afterwards via the settings-replication machinery.


</details>

### `timezones.xml`

The timezone table the speaker keeps on board: the complete list of named time zones it understands, so when you set your location the player can convert it to the right clock offset and daylight-saving rules.

[View](files/opt/timezones/timezones.xml) · [Download](files/opt/timezones/timezones.xml) · 7.1 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 157 lines:

```
<TimeZoneRules Version="9" >
  <TimeZones>
    <TimeZone ID="0" GMTBias="720" />
    <TimeZone ID="1" GMTBias="660" />
    <TimeZone ID="2" GMTBias="600" />
    <TimeZone ID="3" GMTBias="540" >
      <StandardTime Month="11" DayOfWeek="0" Day="1" Hour="2" Bias="0" />
      <DaylightTime Month="3" DayOfWeek="0" Day="2" Hour="2" Bias="-60" />
    </TimeZone>
    <TimeZone ID="4" GMTBias="480" >
      <StandardTime Month="11" DayOfWeek="0" Day="1" Hour="2" Bias="0" />
      <DaylightTime Month="3" DayOfWeek="0" Day="2" Hour="2" Bias="-60" />
    </TimeZone>
    <TimeZone ID="5" GMTBias="420" />
    <TimeZone ID="6" GMTBias="420" />
    <TimeZone ID="7" GMTBias="420" >
      <StandardTime Month="11" DayOfWeek="0" Day="1" Hour="2" Bias="0" />
      <DaylightTime Month="3" DayOfWeek="0" Day="2" Hour="2" Bias="-60" />
    </TimeZone>
    <TimeZone ID="8" GMTBias="360" />
    <TimeZone ID="9" GMTBias="360" >
      <StandardTime Month="11" DayOfWeek="0" Day="1" Hour="2" Bias="0" />
      <DaylightTime Month="3" DayOfWeek="0" Day="2" Hour="2" Bias="-60" />
    </TimeZone>
    <TimeZone ID="10" GMTBias="360" />
    <TimeZone ID="11" GMTBias="360" />
    <TimeZone ID="12" GMTBias="300" />
    <TimeZone ID="13" GMTBias="300" >
      <StandardTime Month="11" DayOfWeek="0" Day="1" Hour="2" Bias="0" />
      <DaylightTime Month="3" DayOfWeek="0" Day="2" Hour="2" Bias="-60" />
    </TimeZone>
    <TimeZone ID="14" GMTBias="300" >
      <StandardTime Month="11" DayOfWeek="0" Day="1" Hour="2" Bias="0" />
      <DaylightTime Month="3" DayOfWeek="0" Day="2" Hour="2" Bias="-60" />
    </TimeZone>
    <TimeZone ID="15" GMTBias="240" >
      <StandardTime Month="11" DayOfWeek="0" Day="1" Hour="2" Bias="0" />
      <DaylightTime Month="3" DayOfWeek="0" Day="2" Hour="2" Bias="-60" />
    </TimeZone>
    <TimeZone ID="16" GMTBias="240" />
    <TimeZone ID="17" GMTBias="240" >
      <StandardTime Month="5" DayOfWeek="0" Day="2" Hour="0" Bias="0" />
      <DaylightTime Month="8" DayOfWeek="0" Day="2" Hour="0" Bias="-60" />
    </TimeZone>
    <TimeZone ID="18" GMTBias="210" >
      <StandardTime Month="11" DayOfWeek="0" Day="1" Hour="2" Bias="0" />
      <DaylightTime Month="3" DayOfWeek="0" Day="2" Hour="2" Bias="-60" />
    </TimeZone>
    <TimeZone ID="19" GMTBias="180" >
      <StandardTime Month="2" DayOfWeek="0" Day="3" Hour="0" Bias="0" />
      <DaylightTime Month="10" DayOfWeek="0" Day="3" Hour="0" Bias="-60" />
    </TimeZone>
    <TimeZone ID="20" GMTBias="180" />
    <TimeZone ID="21" GMTBias="180" >
      <StandardTime Month="10" DayOfWeek="6" Day="5" Hour="23" Bias="0" />
      <DaylightTime Month="3" DayOfWeek="6" Day="5" Hour="22" Bias="-60" />
    </TimeZone>
    <TimeZone ID="22" GMTBias="120" />
    <TimeZone ID="23" GMTBias="60" >
      <StandardTime Month="10" DayOfWeek="0" Day="5" Hour="1" Bias="0" />
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/timezones/timezones.xml`
- **Category:** specs
- **Size:** 7.1 KB (7293 bytes)
- **SHA-256:** `2b944103333dae5995405bbf961f2e2efd5e3e7a9afd79594ac799206b27d879`

Zone index used by GetTimeZone/SetTimeZoneAndRule; the firmware's static mapping from index to POSIX timezone rule. Referenced by the timezone_table primitive entry.


</details>


## Configuration files

Settings files that ship inside the firmware image itself. They set defaults and behaviors before anything personal is added: how the web server listens, how logs are recorded, which radio setups are allowed, and which background measurements are on.

<details markdown="1"><summary><b>Technical details</b></summary>

Static defaults under /opt/conf, /opt/ir, /opt/dsp, /opt/localsettings and /etc; runtime state that changes later lives separately under the writable /jffs partition.

</details>

### `LEGACYCOMPATVER`

The legacy-compatibility marker: how far back this firmware can interoperate with very old players still in a household.

[View](files/LEGACYCOMPATVER) · [Download](files/LEGACYCOMPATVER) · 11 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
58.0-00000
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/LEGACYCOMPATVER`
- **Category:** config
- **Size:** 11 B (11 bytes)
- **SHA-256:** `ee22aa9ca28edb870170c612a3ef59ea2cb063c8c2816994e986aae308c67c69`

Compatibility marker for mixed-era households; checked during update rollout decisions alongside MINCOMPATVER.


</details>

### `MINCOMPATVER`

The minimum compatible version marker: the oldest software version this image is willing to coexist with. It is one of the numbers that decides whether an update is allowed to proceed.

[View](files/MINCOMPATVER) · [Download](files/MINCOMPATVER) · 11 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
85.0-00000
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/MINCOMPATVER`
- **Category:** config
- **Size:** 11 B (11 bytes)
- **SHA-256:** `41915dcb2732e231c1106044676f9225ac6040164dd713f291fcc9f92f18c848`

Compatibility floor consumed by the update machinery (the 'minimum auto-update version' logic in update_machinery).


</details>

### `VERSION`

The plain version stamp of the firmware image, the file the update machinery and the system read to know what release is installed.

[View](files/VERSION) · [Download](files/VERSION) · 12 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
86.10-80260
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/VERSION`
- **Category:** config
- **Size:** 12 B (12 bytes)
- **SHA-256:** `e8bdcaec2e1a5cf440f834ca2058e09221e4a5ef52877868dfba438840eab71d`

Top-level version marker for the squashfs image; pairs with MINCOMPATVER and LEGACYCOMPATVER in update compatibility checks.


</details>

### `build.properties`

The birth certificate of this exact firmware build: when it was compiled, on which machine, from which source revision, in release mode. It answers 'exactly which build is this' better than any version number alone.

[View](files/build.properties) · [Download](files/build.properties) · 806 B

<details markdown="1"><summary><b>Preview</b></summary>

First 20 of 20 lines:

```
build.version = 86.10-80260
build.date = 2026-08-26 17:51:31.641146
build.host = aws-jammy-sec-26
build.type = release
build.sysinfo = Linux aws-jammy-sec-26 6.8.0-1063-aws #66~22.04.1-Ubuntu SMP Fri Aug  7 17:45:18 UTC 2026 x86_64 x86_64
build.arch.type = limelight
build.docker = False
build.os.info = Ubuntu 22.04.5 LTS
build.locked = True
build.scm.path = N/A
build.scm.type = git
build.git.remote = git@github.com:Sonos-Inc/pdsw-sonos-controller-player-s2.git
build.git.branch = release/main_alt_release
build.github.url = git@github.com:Sonos-Inc/pdsw-sonos-controller-player-s2/commit/a78cd9a393d
build.git.dirty = False
build.scm.version = a78cd9a393d
build.source.date.epoch = 1787772128
build.strings.remote = SWPBL-250456
build.strings.branch = SWPBL-250456
build.strings.version = SWPBL-250456
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/build.properties`
- **Category:** config
- **Size:** 806 B (806 bytes)
- **SHA-256:** `693983d6e86275f5a2a34c589306733a3c214f9375e49c368626d57f7b483eb7`

Build metadata recorded at compile time: build 86.10-80260 dated 2026-08-26, limelight (Playbar) target, release type, git revision a78cd9a393d on branch release/main_alt_release of the Sonos-internal player repo.


</details>

### `chrony.conf`

The time-sync configuration: which time servers the speaker asks for the correct clock. Accurate shared time is what keeps rooms playing in perfect sync, so this file quietly matters a lot.

[View](files/etc/chrony.conf) · [Download](files/etc/chrony.conf) · 915 B

<details markdown="1"><summary><b>Preview</b></summary>

First 24 of 24 lines:

```
# Resolve multiple server addresses for each Sonos NTP pool name.
# Permit initial burst polling of newly used NTP servers.
# Once a server in a given pool has responded, stop polling
# the remaining servers in that pool.
pool 0.sonostime.pool.ntp.org iburst maxsources 1
pool 1.sonostime.pool.ntp.org iburst maxsources 1
pool 2.sonostime.pool.ntp.org iburst maxsources 1
pool 3.sonostime.pool.ntp.org iburst maxsources 1

# This file keeps track of how the system clock tends to drift relative to true time.
driftfile /jffs/chrony/chrony.drift

# These logs are for debugging.
log tracking rawmeasurements statistics
logdir /var/log/chrony

# Permit chrony to step the clock up to once per operation,
# only if the detected error is in excess of 60 seconds.
makestep 60 1
maxchange 60 1 0

# Disable NTP serving to prevent NTP requests from reaching chronyd
# (this can help prevent DoS attacks on chronyd)
port 0
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/chrony.conf`
- **Category:** config
- **Size:** 915 B (915 bytes)
- **SHA-256:** `6245ff35b9e68a1d8738dcc430bc8b28e53efaa0c9a834010fde3c72fcc32789`

chronyd client config pointing at Sonos's *.sonostime.pool.ntp.org pool; drift state lands in /jffs/chrony/chrony.drift.


</details>

### `host.conf`

A small resolver rulebook: the order in which the speaker tries to turn names into addresses, such as checking its local hosts file before asking the network's name service.

[View](files/etc/host.conf) · [Download](files/etc/host.conf) · 26 B

<details markdown="1"><summary><b>Preview</b></summary>

First 2 of 2 lines:

```
order hosts,bind
multi on
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/host.conf`
- **Category:** config
- **Size:** 26 B (26 bytes)
- **SHA-256:** `83b331f98a128e1721c54be5c07bd38ad0d146e89cdecbe0eb53cbc23ff6b86a`

Standard glibc resolver order file (hosts before DNS).


</details>

### `nsswitch.conf`

The name-service switch table: the classic Unix file deciding where the system looks up things like user names, hosts, and networks, and in what order.

[View](files/etc/nsswitch.conf) · [Download](files/etc/nsswitch.conf) · 452 B

<details markdown="1"><summary><b>Preview</b></summary>

First 19 of 19 lines:

```
# /etc/nsswitch.conf
#
# Example configuration of GNU Name Service Switch functionality.
# If you have the `glibc-doc' and `info' packages installed, try:
# `info libc "Name Service Switch"' for information about this file.

passwd:         files
group:          files
shadow:         files

hosts:          files dns
networks:       files

protocols:      files
services:       files
ethers:         files
rpc:            files

netgroup:       files
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/nsswitch.conf`
- **Category:** config
- **Size:** 452 B (452 bytes)
- **SHA-256:** `5c24de7911e2eab827332ff98c40aa79f951b951c3106940ac049bdee7d083cc`

Standard NSS configuration; controls which sources answer name lookups.


</details>

### `sddpd.conf`

Configuration for the device-announcement daemon, the component that keeps re-broadcasting 'here I am' so your speakers and apps keep finding each other on the network.

[View](files/etc/sddpd.conf) · [Download](files/etc/sddpd.conf) · 644 B

<details markdown="1"><summary><b>Preview</b></summary>

First 14 of 14 lines:

```
; The Search type/Namespace of device
Type = sonos:Zoneplayer
; The primary proxy type.  This must match the OnlineCategory specified in the referenced Driver
PrimaryProxy = media_service
; All proxies implemented by the referenced Driver
Proxies = media_service,amplifier
; The manufacturer of the device.  This must match the manufacturer specified in the referenced Driver
Manufacturer = Sonos
; The model of the device.  This should match the model specified in the referenced driver
Model = Zoneplayer
; The driver file name that is used on the online driver database
Driver = sonos.c4z
; The anouncement interval in seconds
MaxAge = 1800
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/sddpd.conf`
- **Category:** config
- **Size:** 644 B (644 bytes)
- **SHA-256:** `7f5c87bfb326d7fa91e28cf30f5696c2e4c6b789d71f9695d7486ca55029d204`

Config for the sddpd sibling daemon (Sonos's device-announcement layer); a development override exists at /jffs/dev_sddp.conf.


</details>

### `syslog.conf`

The routing table for system log messages: which kind of message goes to which log file, used by the classic system logger outside the main program.

[View](files/etc/syslog.conf) · [Download](files/etc/syslog.conf) · 1.6 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 71 lines:

```
#  /etc/syslog.conf	Configuration file for syslogd.
#
#			For more information see syslog.conf(5)
#			manpage.

#
# First some standard logfiles.  Log by facility.
#

auth,authpriv.*			/var/log/auth.log
*.*;auth,authpriv.none		-/var/log/syslog
#cron.*				/var/log/cron.log
daemon.*			-/var/log/daemon.log
kern.*				-/var/log/kern.log
lpr.*				-/var/log/lpr.log
mail.*				/var/log/mail.log
user.*				-/var/log/user.log
uucp.*				-/var/log/uucp.log

#
# Logging for the mail system. Split it up so that
# it is easy to write scripts to parse these files.
#
mail.info			-/var/log/mail.info
mail.warn			-/var/log/mail.warn
mail.err			/var/log/mail.err

# Logging for INN news system
#
#news.crit			/var/log/news/news.crit
#news.err			/var/log/news/news.err
#news.notice			-/var/log/news/news.notice

#
# Some `catch-all' logfiles.
#
*.=debug;\
	auth,authpriv.none;\
	news.none;mail.none	-/var/log/debug
*.=info;*.=notice;*.=warn;\
	auth,authpriv.none;\
	cron,daemon.none;\
	mail,news.none		-/var/log/messages

#
# Emergencies are sent to everybody logged in.
#
*.emerg				*

#
# I like to have messages displayed on the console, but only on a virtual
# console I usually leave idle.
#
#daemon,mail.*;\
#	news.=crit;news.=err;news.=notice;\
#	*.=debug;*.=info;\
#	*.=notice;*.=warn	/dev/tty8

# The named pipe /dev/xconsole is for the `xconsole' utility.  To use it,
# you must invoke `xconsole' with the `-file' option:
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/syslog.conf`
- **Category:** config
- **Size:** 1.6 KB (1670 bytes)
- **SHA-256:** `0141a530669a95b7c8eb63b29e74b136660fa8d989d8b394acaa78e71483fcda`

syslogd routing rules for kernel/daemon messages outside anacapad's own logger framework.


</details>

### `anacapa.conf`

The main configuration file for the player software itself: which ports the web server listens on, which features and directories it uses, and the base settings the program reads at launch. Port 1400 for the status website is defined here.

[View](files/opt/conf/anacapa.conf) · [Download](files/opt/conf/anacapa.conf) · 2.7 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 84 lines:

```
# Anacapa Web Server configuration file

# Server TCP Port for HTTP operation
Port 1400

# Port for HTTPS traffic (0 for disabled)
SSLPort 1443

# Port for HTTPS traffic for household members only (0 for disabled)
SecureHHSSLPort 1843

# The Server Root (UNIX systems style)
ServerRoot /opt

# The Path option specifies the web files path.
Path htdocs

# The Default option contains the name of the files the server should
# look for when only a path is given (e.g. http://myserver/info/).
Default index.html

# The TimeOut option tells the server how much seconds to wait for
# an idle connection before closing it.
TimeOut 10

# The MimeTypes option specifies the location of the file
# containing the mapping of MIME types and files extensions
MimeTypes conf/mime.types

# The path of the diagnostic file
DiagFile log/anacapa.trace

# The default max level for diagnostics logged to DiagFile
DiagLevel default=1

# Max_Conn is the maximum number of simultaneous connections
# This should be greater than NumThreads to support persistent
# connections.  The difference is the number of simultaneous
# persistent connections supported.
MaxConn 36

# NumThreads is the number of anacapa worker threads.
# Previously this was equal to MaxConn but now MaxConn needs to be
# greater than NumThreads to support persistent connections
NumThreads 4

# The file where the pid of the server is logged (UNIX specific)
PidFile log/anacapa.pid

# Rincon-specific configuration settings
# JFFSRoot 
# ZPMusicServicesBackstop ../../../../cc/anacapa/anacapa/pkg/htdocs/xml/musicservices.xml
# ZPTimeZonesBackstop ../../../../cc/anacapa/anacapa/pkg/htdocs/xml/timezones.xml
ContinueAfterIPChange true

# Special Logging for direct control
DiagFile log/anacapa.dc.trace
DiagLevel main=0,muse=3,cloudqueue=3,spot=3,spot_abr=3,spot_q=3,spot_hal=3,museauth=2
DiagMin 16384
DiagMax 32768
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/conf/anacapa.conf`
- **Category:** config
- **Size:** 2.7 KB (2793 bytes)
- **SHA-256:** `2327552e496415e9fc97e8f9d8cc8e4deb881b00dade0a642d16e61c206e6b3b`

Central config consumed at anacapad startup: web listener ports (1400 HTTP / 1443 HTTPS / 1843 household TLS), paths, and feature flags. Some values get overridden by files in the writable /jffs/conf directory.


</details>

### `anacapa_logger.toml`

The logging configuration for the main player software: which subsystem writes which log file, how chatty each one is allowed to be, and where the logs land on disk. The 21 log channels described in the subsystems page map onto the rules in this file.

[View](files/opt/conf/anacapa_logger.toml) · [Download](files/opt/conf/anacapa_logger.toml) · 4.9 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 188 lines:

```
# This is a TOML configuration document
#
title = "Anacapa logger configuration"

# SONOS_LOG_EMERGENCY = 0, /**< the system is unusable */
# SONOS_LOG_ALERT = 1, /**< an action must be taken immediately else system is likely to become unusable */
# SONOS_LOG_CRIT  = 2, /**< critical conditions */
# SONOS_LOG_ERR   = 3, /**< error conditions */
# SONOS_LOG_WARN  = 4, /**< warning conditions */
# SONOS_LOG_NOTE  = 5, /**< notify about normal but significant condition */
# SONOS_LOG_INFO  = 6, /**< informational */
# SONOS_LOG_DEBUG = 7, /**< debug */
# SONOS_LOG_DBG_1 = 8, /**< beginning of the extra debug messages range */
# SONOS_LOG_DBG_2 = 9,
# SONOS_LOG_DBG_3 = 10,
# SONOS_LOG_DBG_4 = 11, /**< end of the extra debug messages range */

# Each section defines one log destination
# defaultLevel = -1 means no default logging for this destination
# default backup location: /jffs/app/log

# Main logging for anacapa
[[FILE]]
name = "anacapa.log"
fileSize = 262144
preserveSize = 65536
defaultLevel = 4
backup = true
filter = {}

### additional destinations ###

# Special Logging for direct control
[[FILE]]
name = "anacapa.dc.log"
fileSize = 65536
preserveSize = 16384
defaultLevel = -1
filter = {main=3,muse=6,museauth=6,muse_token_service=6,cloudqueue=6,spot=6,spot_abr=6,spot_q=6,spot_hal=6,cb=6}

# Special Logging for Muse Command and Response Messages
[[FILE]]
name = "anacapa.musecmdandrsp.log"
fileSize = 65336
preserveSize = 60000
defaultLevel = -1
filter = {muselogcmd=7, muselogrsp=7}

# Special Logging for Muse debug statistics
[[FILE]]
name = "anacapa.musedebug.log"
fileSize = 65536
preserveSize = 16384
defaultLevel = -1
filter = {muse_debug=7,museperf=6}

# Special Logging for Muse Event Messages
[[FILE]]
name = "anacapa.museevt.log"
fileSize = 16384
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/conf/anacapa_logger.toml`
- **Category:** config
- **Size:** 4.9 KB (4975 bytes)
- **SHA-256:** `4d2f14b7baa47e7fb3a33d0ec7b820bb84d018187329ec4d268e5e8f42a89eee`

TOML logger config for anacapad; defines per-domain sinks and severities. The domain list inside is effectively a module map of the program.


</details>

### `mime.types`

The web server's file-type table: it lets the built-in web server label each file it serves with the right content type so browsers handle them correctly.

[View](files/opt/conf/mime.types) · [Download](files/opt/conf/mime.types) · 140 B

<details markdown="1"><summary><b>Preview</b></summary>

First 8 of 8 lines:

```
# MIME type			Extension
text/html			htm
text/html			html
text/xml			xml
text/xml			xsl
text/css			css
text/javascript			js
image/png			png 
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/conf/mime.types`
- **Category:** config
- **Size:** 140 B (140 bytes)
- **SHA-256:** `c9f310db9fc13a8f9a59a717e3c37f337aac5620d10480046d2259b9da5b3742`

Standard MIME map read by the embedded HTTP server when serving static files and status pages.


</details>

### `sonosledmgrd_logger.toml`

The logging configuration for the LED manager daemon, the small helper program that owns the speaker's status light. Same idea as the main logger config, but for the light show.

[View](files/opt/conf/sonosledmgrd_logger.toml) · [Download](files/opt/conf/sonosledmgrd_logger.toml) · 1.0 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 27 of 27 lines:

```
# This is a TOML configuration document
#
title = "Sonos LED Manager server logger configuration"

# SONOS_LOG_EMERGENCY = 0, /**< the system is unusable */
# SONOS_LOG_ALERT = 1, /**< an action must be taken immediately else system is likely to become unusable */
# SONOS_LOG_CRIT  = 2, /**< critical conditions */
# SONOS_LOG_ERR   = 3, /**< error conditions */
# SONOS_LOG_WARN  = 4, /**< warning conditions */
# SONOS_LOG_NOTE  = 5, /**< notify about normal but significant condition */
# SONOS_LOG_INFO  = 6, /**< informational */
# SONOS_LOG_DEBUG = 7, /**< debug */
# SONOS_LOG_DBG_1 = 8, /**< beginning of the extra debug messages range */
# SONOS_LOG_DBG_2 = 9,
# SONOS_LOG_DBG_3 = 10,
# SONOS_LOG_DBG_4 = 11, /**< end of the extra debug messages range */

# Each section defines one log destination
# defaultLevel = -1 means no default logging for this destination

# Main logging
[[FILE]]
name = "sonosledmgrd.log"
fileSize = 262144
preserveSize = 65536
defaultLevel = 4
filter = {ledmgrd=6,LEDManager=6,ledmgr-server=6,leds_zp=6}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/conf/sonosledmgrd_logger.toml`
- **Category:** config
- **Size:** 1.0 KB (1042 bytes)
- **SHA-256:** `6dc66acb328836dd2139ffa4c12003fb493954614c4b03c8983eeff2cc81fd1d`

TOML logger config for the sonosledmgrd sibling daemon; controls its /opt/log output.


</details>

### `v1_auth_offline_policy_guest.json`

The offline permission list for the guest role: the rules for what a guest or unauthenticated visitor on your network may call when the speaker cannot reach Sonos's servers to ask. Even with no internet, the player still enforces who is allowed to do what.

[View](files/opt/conf/v1_auth_offline_policy_guest.json) · [Download](files/opt/conf/v1_auth_offline_policy_guest.json) · 2.0 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
{"name":"GUEST","version":1,"permissions":[{"ns":"alarms","perm":5},{"ns":"areas","perm":1},{"ns":"audioClip","perm":3},{"ns":"authorization","perm":5},{"ns":"clientStatus","perm":3},{"ns":"devices","perm":1},{"ns":"devicesExtended","perm":1},{"ns":"diagnostics","perm":7},{"ns":"effectiveSettings","perm":97},{"ns":"entitlements","perm":1},{"ns":"favorites","perm":5},{"ns":"groups","perm":3},{"ns":"groupVolume","perm":3},{"ns":"hardwareStatus","perm":37},{"ns":"hdmi","perm":1},{"ns":"history","perm":3},{"ns":"homeTheater","perm":3},{"ns":"households","perm":1},{"ns":"info","perm":1},{"ns":"ircontrol","perm":1},{"ns":"localContentLibrary","perm":1},{"ns":"musicServiceAccounts","perm":3},{"ns":"pinewood","perm":3},{"ns":"playback","perm":3},{"ns":"playbackExtended","perm":1},{"ns":"playbackMetadata","perm":3},{"ns":"playbackSession","perm":15},{"ns":"playerVolume","perm":3},{"ns":"playlists","perm":5},{"ns":"power","perm":3},{"ns":"roomDetection","perm":3},{"ns":"settings","perm":97},{"ns":"settings:playerBasic","perm":4},{"ns":"settings:playerLineIn","perm":4},{"ns":"settings:playerUI","perm":13},{"ns":"settings:security","perm":1},{"ns":"sleepTimer","perm":3},{"ns":"smartplay","perm":3},{"ns":"soundSwap","perm":2},{"ns":"systemReporting","perm":1},{"ns":"systemTime","perm":1},{"ns":"time","perm":1},{"ns":"timers","perm":3},{"ns":"trueplay","perm":3},{"ns":"trueroom","perm":1},{"ns":"update","perm":1},{"ns":"upnpAlarmClock","perm":3},{"ns":"upnpAudioIn","perm":3},{"ns":"upnpAVTransport","perm":3},{"ns":"upnpConnectionManager","perm":3},{"ns":"upnpContentDirectory","perm":3},{"ns":"upnpDeviceProperties","perm":3},{"ns":"upnpGroupManagement","perm":3},{"ns":"upnpGroupRenderingControl","perm":3},{"ns":"upnpHTControl","perm":3},{"ns":"upnpMusicServices","perm":3},{"ns":"upnpQueue","perm":3},{"ns":"upnpRenderingControl","perm":3},{"ns":"upnpSystemProperties","perm":3},{"ns":"upnpVirtualLineIn","perm":3},{"ns":"upnpZoneGroupTopology","perm":3},{"ns":"virtualLineIn","perm":3},{"ns":"virtualRemoteControl","perm":3},{"ns":"voice","perm":1},{"ns":"zones","perm":7}]}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/conf/v1_auth_offline_policy_guest.json`
- **Category:** config
- **Size:** 2.0 KB (2090 bytes)
- **SHA-256:** `4006046d5b8375a6b174af5ea402152dc42d066a8cd6de55a770401a3c664035`

v1 API authorization policy for the guest role, applied when the authz backend is unreachable (offline fallback). Defines the resource/verb whitelist enforced by the authz stage.


</details>

### `v1_auth_offline_policy_owner.json`

The offline permission list for the owner role: the rules for what the household owner's apps and controllers may call when the speaker cannot reach Sonos's servers to ask. Even with no internet, the player still enforces who is allowed to do what.

[View](files/opt/conf/v1_auth_offline_policy_owner.json) · [Download](files/opt/conf/v1_auth_offline_policy_owner.json) · 2.5 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
{"name":"OWNER","version":1,"permissions":[{"ns":"alarms","perm":7},{"ns":"areas","perm":3},{"ns":"audioClip","perm":3},{"ns":"authorization","perm":15},{"ns":"catalog","perm":1},{"ns":"clientStatus","perm":3},{"ns":"devices","perm":15},{"ns":"devicesExtended","perm":3},{"ns":"diagnostics","perm":7},{"ns":"effectiveSettings","perm":99},{"ns":"entitlements","perm":3},{"ns":"favorites","perm":7},{"ns":"global","perm":3},{"ns":"groups","perm":3},{"ns":"groupVolume","perm":3},{"ns":"hardwareStatus","perm":127},{"ns":"hdmi","perm":3},{"ns":"history","perm":3},{"ns":"homeTheater","perm":7},{"ns":"households","perm":3},{"ns":"householdUpdate","perm":3},{"ns":"info","perm":3},{"ns":"ircontrol","perm":3},{"ns":"liveActivities","perm":3},{"ns":"localContentLibrary","perm":7},{"ns":"management","perm":7},{"ns":"musicServiceAccounts","perm":7},{"ns":"networkTest","perm":6},{"ns":"pinewood","perm":3},{"ns":"platformInternal","perm":7},{"ns":"playback","perm":7},{"ns":"playbackExtended","perm":3},{"ns":"playbackMetadata","perm":3},{"ns":"playbackSession","perm":31},{"ns":"playerVolume","perm":3},{"ns":"playlists","perm":7},{"ns":"positioning","perm":3},{"ns":"power","perm":3},{"ns":"roomDetection","perm":3},{"ns":"settings","perm":127},{"ns":"settings:business","perm":3},{"ns":"settings:frontierLlms","perm":7},{"ns":"settings:global","perm":3},{"ns":"settings:playback","perm":7},{"ns":"settings:playerBasic","perm":15},{"ns":"settings:playerLineIn","perm":15},{"ns":"settings:playerUI","perm":15},{"ns":"settings:preferences","perm":3},{"ns":"settings:proDashboard","perm":3},{"ns":"settings:security","perm":7},{"ns":"sleepTimer","perm":3},{"ns":"smartplay","perm":3},{"ns":"soundSwap","perm":3},{"ns":"svc","perm":3},{"ns":"systemReporting","perm":1},{"ns":"systemTime","perm":3},{"ns":"timers","perm":3},{"ns":"topology","perm":3},{"ns":"trueplay","perm":3},{"ns":"trueroom","perm":3},{"ns":"update","perm":3},{"ns":"upnpAlarmClock","perm":3},{"ns":"upnpAudioIn","perm":3},{"ns":"upnpAVTransport","perm":3},{"ns":"upnpConnectionManager","perm":3},{"ns":"upnpContentDirectory","perm":3},{"ns":"upnpDeviceProperties","perm":3},{"ns":"upnpGroupManagement","perm":3},{"ns":"upnpGroupRenderingControl","perm":3},{"ns":"upnpHTControl","perm":3},{"ns":"upnpMusicServices","perm":3},{"ns":"upnpQueue","perm":3},{"ns":"upnpRenderingControl","perm":3},{"ns":"upnpSystemProperties","perm":3},{"ns":"upnpVirtualLineIn","perm":3},{"ns":"upnpZoneGroupTopology","perm":3},{"ns":"virtualLineIn","perm":3},{"ns":"virtualRemoteControl","perm":3},{"ns":"voice","perm":15},{"ns":"zones","perm":15}]}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/conf/v1_auth_offline_policy_owner.json`
- **Category:** config
- **Size:** 2.5 KB (2591 bytes)
- **SHA-256:** `52aec9a38aa1dce27aa7c1215cdf24ab7a5ee67c89da6e0501bc144d3431b4f4`

v1 API authorization policy for the owner role, applied when the authz backend is unreachable (offline fallback). Defines the resource/verb whitelist enforced by the authz stage.


</details>

### `v1_auth_offline_policy_p2p.json`

The offline permission list for the peer-to-peer role: the rules for what other players in your household may call on each other when the speaker cannot reach Sonos's servers to ask. Even with no internet, the player still enforces who is allowed to do what.

[View](files/opt/conf/v1_auth_offline_policy_p2p.json) · [Download](files/opt/conf/v1_auth_offline_policy_p2p.json) · 2.0 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
{"name":"P2P","version":1,"permissions":[{"ns":"areas","perm":1},{"ns":"audioClip","perm":3},{"ns":"authorization","perm":3},{"ns":"clientStatus","perm":3},{"ns":"devices","perm":1},{"ns":"diagnostics","perm":7},{"ns":"effectiveSettings","perm":99},{"ns":"entitlements","perm":1},{"ns":"favorites","perm":5},{"ns":"groups","perm":3},{"ns":"groupVolume","perm":3},{"ns":"hardwareStatus","perm":5},{"ns":"hdmi","perm":1},{"ns":"history","perm":3},{"ns":"homeTheater","perm":3},{"ns":"households","perm":1},{"ns":"info","perm":1},{"ns":"ircontrol","perm":1},{"ns":"localContentLibrary","perm":7},{"ns":"musicServiceAccounts","perm":4},{"ns":"playback","perm":3},{"ns":"playbackExtended","perm":1},{"ns":"playbackMetadata","perm":1},{"ns":"playbackSession","perm":15},{"ns":"playerVolume","perm":3},{"ns":"playlists","perm":5},{"ns":"positioning","perm":3},{"ns":"roomDetection","perm":2},{"ns":"settings","perm":103},{"ns":"settings:playerBasic","perm":15},{"ns":"settings:playerLineIn","perm":15},{"ns":"settings:playerUI","perm":15},{"ns":"settings:security","perm":1},{"ns":"sleepTimer","perm":1},{"ns":"smartplay","perm":3},{"ns":"soundSwap","perm":2},{"ns":"svc","perm":7},{"ns":"systemTime","perm":3},{"ns":"time","perm":1},{"ns":"timers","perm":3},{"ns":"trueplay","perm":3},{"ns":"trueroom","perm":3},{"ns":"update","perm":1},{"ns":"upnpAlarmClock","perm":3},{"ns":"upnpAudioIn","perm":3},{"ns":"upnpAVTransport","perm":3},{"ns":"upnpConnectionManager","perm":3},{"ns":"upnpContentDirectory","perm":3},{"ns":"upnpDeviceProperties","perm":3},{"ns":"upnpGroupManagement","perm":3},{"ns":"upnpGroupRenderingControl","perm":3},{"ns":"upnpHTControl","perm":3},{"ns":"upnpMusicServices","perm":3},{"ns":"upnpQueue","perm":3},{"ns":"upnpRenderingControl","perm":3},{"ns":"upnpSystemProperties","perm":3},{"ns":"upnpVirtualLineIn","perm":3},{"ns":"upnpZoneGroupTopology","perm":3},{"ns":"virtualLineIn","perm":3},{"ns":"virtualRemoteControl","perm":3},{"ns":"voice","perm":13},{"ns":"zones","perm":15}]}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/conf/v1_auth_offline_policy_p2p.json`
- **Category:** config
- **Size:** 2.0 KB (2000 bytes)
- **SHA-256:** `ddabfd2ded8520c8e99014595934f05b065d784eebbd80eaa79982981bb57566`

v1 API authorization policy for the p2p role, applied when the authz backend is unreachable (offline fallback). Defines the resource/verb whitelist enforced by the authz stage.


</details>

### `irconfig.txt`

The remote-control configuration: the learned infrared codes and receiver settings the soundbar uses to understand a TV remote's volume keys.

[View](files/opt/ir/irconfig.txt) · [Download](files/opt/ir/irconfig.txt) · 98 B

<details markdown="1"><summary><b>Preview</b></summary>

First 9 of 9 lines:

```
:repeat_codes:
4f 13 05
:vol_up_codes:
2,25 01
:vol_down_codes:
2,27 01
:vol_mute_codes:
2,29 01

```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/ir/irconfig.txt`
- **Category:** config
- **Size:** 98 B (98 bytes)
- **SHA-256:** `bd06bfd84d8332241b98afc27c38dbc2f375f1e850f291c38541323348811af6`

IR decoder config consumed by ir_decoder/ir_learn; holds the learned code list for volume up/down/mute/input. A per-device copy also lives at /jffs/irconfig.txt once learning has run.


</details>

### `global_attrdata.json`

The settings-schema records describing the household-wide settings surface: which keys exist, their types, and who may write them. These ship as templates; the live values you change are stored separately in the writable partition.

[View](files/opt/localsettings/global_attrdata.json) · [Download](files/opt/localsettings/global_attrdata.json) · 547 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
{"global": {"attributes": {"enableContentAccess": {"default": false}, "overrideRemoveMSPCredentials": {"default": true}}, "schemaValidator": {"type": "object", "properties": {"attributes": {"properties": {"enableContentAccess": {"type": "boolean"}, "overrideRemoveMSPCredentials": {"type": "boolean"}}, "additionalProperties": false}, "schemaVersion": {"type": "integer", "minimum": 1}, "eTag": {"allOf": [{"type": "string"}]}, "timestamp": {"allOf": [{"type": "string", "pattern": "^[0-9]+$", "maxLength": 20}]}}, "required": ["schemaVersion"]}}}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/localsettings/global_attrdata.json`
- **Category:** config
- **Size:** 547 B (547 bytes)
- **SHA-256:** `1f6910354c4eb6c2e7d587d824418d76e7634bb237b309b40cabe49358a18086`

Attribute-data schema for the global settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.


</details>

### `playback_attrdata.json`

The settings-schema records for playback-related settings: the typed keys the playback surface accepts. These ship as templates; the live values you change are stored separately in the writable partition.

[View](files/opt/localsettings/playback_attrdata.json) · [Download](files/opt/localsettings/playback_attrdata.json) · 584 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
{"playback": {"attributes": {"allowDirectControl": {"default": true}, "allowLineIn": {"default": true}, "allowAirplay": {"default": true}}, "schemaValidator": {"type": "object", "properties": {"attributes": {"properties": {"allowDirectControl": {"type": "boolean"}, "allowLineIn": {"type": "boolean"}, "allowAirplay": {"type": "boolean"}}, "additionalProperties": false}, "schemaVersion": {"type": "integer", "minimum": 1}, "eTag": {"allOf": [{"type": "string"}]}, "timestamp": {"allOf": [{"type": "string", "pattern": "^[0-9]+$", "maxLength": 20}]}}, "required": ["schemaVersion"]}}}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/localsettings/playback_attrdata.json`
- **Category:** config
- **Size:** 584 B (584 bytes)
- **SHA-256:** `62e6d8e70979057c44d86116018034d73c6aac12bcf601a135b26fe7197749d5`

Attribute-data schema for the playback settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.


</details>

### `playerBasic_attrdata.json`

The settings-schema records for basic per-player settings like name, icon, and core behavior toggles. These ship as templates; the live values you change are stored separately in the writable partition.

[View](files/opt/localsettings/playerBasic_attrdata.json) · [Download](files/opt/localsettings/playerBasic_attrdata.json) · 1.6 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
{"playerBasic": {"attributes": {"zoneName": {"default": "Unnamed Room"}, "icon": {"default": ""}, "configuration": {"default": 0}, "targetRoomName": {"default": ""}, "unpairedZoneName": {"default": "Unnamed Room", "readPerm": "0x00000000", "writePerm": "0x00000000"}, "unpairedIcon": {"default": "", "readPerm": "0x00000000", "writePerm": "0x00000000"}, "unpairedConfiguration": {"default": 0, "readPerm": "0x00000000", "writePerm": "0x00000000"}, "unpairedStatusLight": {"default": true, "readPerm": "0x00000000", "writePerm": "0x00000000"}, "unpairedButtonLockState": {"default": false, "readPerm": "0x00000000", "writePerm": "0x00000000"}}, "schemaValidator": {"type": "object", "properties": {"attributes": {"properties": {"zoneName": {"type": "string", "maxLength": 64, "minLength": 1, "pattern": "^(([^ \\n\\t].*[^ \\n\\t])|([^ \\n\\t]))$"}, "icon": {"type": "string", "maxLength": 128}, "configuration": {"type": "integer", "format": "int32"}, "targetRoomName": {"type": "string", "maxLength": 64}, "unpairedZoneName": {"type": "string", "maxLength": 64, "minLength": 1, "pattern": "^(([^ \\n\\t].*[^ \\n\\t])|([^ \\n\\t]))$"}, "unpairedIcon": {"type": "string", "maxLength": 128}, "unpairedConfiguration": {"type": "integer", "format": "int32"}, "unpairedStatusLight": {"type": "boolean"}, "unpairedButtonLockState": {"type": "boolean"}}, "additionalProperties": false}, "schemaVersion": {"type": "integer", "minimum": 1}, "eTag": {"allOf": [{"type": "string"}]}, "timestamp": {"allOf": [{"type": "string", "pattern": "^[0-9]+$", "maxLength": 20}]}}, "required": ["schemaVersion"]}}}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/localsettings/playerBasic_attrdata.json`
- **Category:** config
- **Size:** 1.6 KB (1591 bytes)
- **SHA-256:** `3d0a4d482df44f5e4e39da4d59e3cad7ed7e528a5adb0b692c879c58c30f29f9`

Attribute-data schema for the playerBasic settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.


</details>

### `playerUI_attrdata.json`

The settings-schema records for the player-facing interface options. These ship as templates; the live values you change are stored separately in the writable partition.

[View](files/opt/localsettings/playerUI_attrdata.json) · [Download](files/opt/localsettings/playerUI_attrdata.json) · 560 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
{"playerUI": {"attributes": {"statusLight": {"default": true, "readPerm": "0x00000004", "writePerm": "0x00000008"}, "buttonLockState": {"default": false}}, "schemaValidator": {"type": "object", "properties": {"attributes": {"properties": {"statusLight": {"type": "boolean"}, "buttonLockState": {"type": "boolean"}}, "additionalProperties": false}, "schemaVersion": {"type": "integer", "minimum": 1}, "eTag": {"allOf": [{"type": "string"}]}, "timestamp": {"allOf": [{"type": "string", "pattern": "^[0-9]+$", "maxLength": 20}]}}, "required": ["schemaVersion"]}}}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/localsettings/playerUI_attrdata.json`
- **Category:** config
- **Size:** 560 B (560 bytes)
- **SHA-256:** `45ed16ae4064c927d1989f70d4486d1a6b7d90a5227e3fada01b7019e3fd067e`

Attribute-data schema for the playerUI settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.


</details>

### `security_attrdata.json`

The settings-schema records for security-relevant settings like credential and access-related keys. These ship as templates; the live values you change are stored separately in the writable partition.

[View](files/opt/localsettings/security_attrdata.json) · [Download](files/opt/localsettings/security_attrdata.json) · 751 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
{"security": {"attributes": {"allowGuestAccess": {"default": true}, "allowInsecureUPnP": {"default": true}, "allowUnauthenticatedControl": {"default": true}, "authPin": {"default": "", "readPerm": "0x00000004", "writePerm": "0x00000004"}}, "schemaValidator": {"type": "object", "properties": {"attributes": {"properties": {"allowGuestAccess": {"type": "boolean"}, "allowInsecureUPnP": {"type": "boolean"}, "allowUnauthenticatedControl": {"type": "boolean"}, "authPin": {"type": "string", "maxLength": 64}}, "additionalProperties": false}, "schemaVersion": {"type": "integer", "minimum": 1}, "eTag": {"allOf": [{"type": "string"}]}, "timestamp": {"allOf": [{"type": "string", "pattern": "^[0-9]+$", "maxLength": 20}]}}, "required": ["schemaVersion"]}}}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/localsettings/security_attrdata.json`
- **Category:** config
- **Size:** 751 B (751 bytes)
- **SHA-256:** `a43e141699c153e8979a0f63af9e10a63cf6f98b5c3b8c5f5654f0799ec177c4`

Attribute-data schema for the security settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.


</details>

### `settings_targettypes.json`

The master list of setting scopes: which settings apply to a whole household, which to a room, and which to a single speaker. The settings machinery uses it to decide where a change should be stored.

[View](files/opt/localsettings/settings_targettypes.json) · [Download](files/opt/localsettings/settings_targettypes.json) · 128 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
{"fileFormatVersion": 1, "targetTypes": {"playerUI": "LP", "playerBasic": "P", "security": "L", "global": "L", "playback": "L"}}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/localsettings/settings_targettypes.json`
- **Category:** config
- **Size:** 128 B (128 bytes)
- **SHA-256:** `58ddeee7de9389b2cd3dfc53d04746bf142b4f190b6b6b6010071ef499b6214d`

Target-type registry for the settings schema; defines the scope classes the settings validator routes keys into.


</details>


## Base system files

Standard Unix-era system files that every Linux-style appliance carries: the account list, the startup table, filesystem mounts, and network name resolution. They are unglamorous but they define the basic shape of the device as a small computer.

<details markdown="1"><summary><b>Technical details</b></summary>

Busybox-era /etc plumbing from the limelight buildroot: user database, init table, mount table, resolver config, and protocol/service name databases.

</details>

### `Configure`

The legacy configuration entry point name used by older Sonos utilities: a small script-era file the toolchain still ships for compatibility.

[View](files/etc/Configure) · [Download](files/etc/Configure) · 2.4 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 126 lines:

```
#!/bin/sh

echo "/etc/Configure: enter" > /dev/kmsg

mount -t proc proc proc
mount -t sysfs sys sys

/sbin/ifconfig lo 127.0.0.1 up

mount -t ramfs ramfs /ramdisk
mkdir -m 777 -p /ramdisk/var \
/ramdisk/var/run \
/ramdisk/var/log \
/ramdisk/tmp \
/ramdisk/tmp/pub \
/ramdisk/optlog \
/ramdisk/smb \
/dev/pts \
/dev/mtd

ln -s ../mtd0 /dev/mtd/0
ln -s mtdblock4 /dev/nandjffs
ln -s mtd4 /dev/jffsmtd
. /etc/scripts/mount_jffs.sh
sonos_mount_jffs >/dev/kmsg 2>&1

mount -t devpts none /dev/pts

/etc/init.d/Srandom

/sbin/insmod /modules/sonos_device.ko
/sbin/insmod /modules/chk.ko
/sbin/insmod /modules/hwevent_queue.ko
/sbin/insmod /modules/audiodev.ko

if [ -f /modules/ir_rcvr.ko ]; then
    /sbin/insmod /modules/ir_rcvr.ko
fi

touch /var/run/sonosledmgrd.flash_booting_led
/sbin/frcheck
frcheck_stat=$?

if [ $frcheck_stat -ne 1 ]; then
  /opt/bin/sonosledmgrd --fr

  if [ $frcheck_stat -eq 0 ]; then
    /wifi/netstartd --hard-reset
  elif [ $frcheck_stat -eq 2 ]; then
    /wifi/netstartd --soft-reset
  fi
fi

mkdir -p /jffs/app/run \
  /jffs/app/log \
  /jffs/app/debug \
  /jffs/app/debug/dsp \
  /jffs/app/settings \
  /jffs/sys/run \
  /jffs/sys/log \
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/Configure`
- **Category:** system
- **Size:** 2.4 KB (2488 bytes)
- **SHA-256:** `7820e289f6266bd6b11b02b979a700cb0c767417ef347676ac5969f26ca97460`

Historic configuration hook referenced by sibling tooling (Configure/Configure.dev naming appears in the jffs config layout too).


</details>

### `arch`

A small marker file naming the hardware architecture family the image was built for.

[View](files/etc/arch) · [Download](files/etc/arch) · 10 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
limelight
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/arch`
- **Category:** system
- **Size:** 10 B (10 bytes)
- **SHA-256:** `e014957c02d19fce55760cb98e40b2613f849ac985abdeef6a7a267bf55e1065`

Records the limelight architecture identifier used by scripts and tooling.


</details>

### `arch_attrs`

Architecture attributes: a small data file describing the board family's properties for scripts that need to branch on hardware type.

[View](files/etc/arch_attrs) · [Download](files/etc/arch_attrs) · 1020 B

<details markdown="1"><summary><b>Preview</b></summary>

First 54 of 54 lines:

```
HAS_ORIENTATION_SENSOR
HAS_TV_INPUT
IS_CEP20
IS_HARDWARE
IS_HT_SOURCE
IS_HT_WIRELESS_PRIMARY
IS_STILL_MANUFACTURED
IS_ZONE_PLAYER
LACKS_ASAN
LACKS_AUDIO_ENCRYPTION
LACKS_BUTTONS_KERNEL_MODULE
LACKS_CLOCK_BOOTTIME
LACKS_DIAGS_BUILD
LACKS_DSMF
LACKS_DYNAMIC_DSP
LACKS_HEAPTRACK_SUPPORT
LACKS_KERNEL_SECTION_HEADER
LACKS_LKDTM
LACKS_MIXER_STATS
LACKS_MPEGDASH
LACKS_NATIVE_WAC
LACKS_OPUS
LACKS_SETUP_PIN
LACKS_STACK_USAGE
LACKS_TSAN
LACKS_UBSAN
LACKS_WIDEVINE
LEGACY_BACKTRACE_SUPPORT
MIGHT_SUPPORT_S1
SUPPORTS_ATHEROS_DIRECT_ATTACH
SUPPORTS_AUDIODEV
SUPPORTS_AUDIODEV_SENSOR_EVENTS
SUPPORTS_CHANNEL_SCAN
SUPPORTS_CHIRP_ROOM_DETECTION_SEND
SUPPORTS_CLONE_CHECK
SUPPORTS_CPU_TEMP_REPORT
SUPPORTS_DOLBY
SUPPORTS_DTS
SUPPORTS_DUAL_SUBS
SUPPORTS_EXTERNAL_EVENTS
SUPPORTS_FFMPEG_WMA
SUPPORTS_HWEVTQ
SUPPORTS_RDM
SUPPORTS_RX_HANG_CHECK
SUPPORTS_SOUNDSWAP
SUPPORTS_STATION
SUPPORTS_SYSSW_HAL
SUPPORTS_TXRX_STATS
SUPPORTS_V2_CERTS
SUPPORTS_VLI
SUPPORTS_WIRELESS_DISABLE
SUPPORTS_WIRELESS_SETUP
USES_LLA
USES_LONG_AMP_POWER_TIMEOUT
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/arch_attrs`
- **Category:** system
- **Size:** 1020 B (1020 bytes)
- **SHA-256:** `56c5c16a238b04190906c57e617e05a4e4dcbcdb18a3adc4a24f908b42bccf8b`

Architecture attribute table consumed by board-level scripts (see Configure and soc_arch).


</details>

### `dhcp.script`

The DHCP handler script: what the device does each time it receives an address from your router, including updating its name resolution and recording the lease details.

[View](files/etc/dhcp.script) · [Download](files/etc/dhcp.script) · 1.2 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 54 of 54 lines:

```
#!/bin/sh

[ -z "$1" ] && echo "Error: should be called from udhcpc" && exit 1

RESOLV_CONF="/etc/resolv.conf"
[ -n "$broadcast" ] && BROADCAST="broadcast $broadcast"
[ -n "$subnet" ] && NETMASK="netmask $subnet"

case "$1" in
	nak)
		echo received a NAK: $message
		;;

	deconfig)
		ifconfig $interface 0.0.0.0

		route del 255.255.255.255 2> /dev/null
		route add 255.255.255.255 $interface

		route del -net 224.0.0.0 netmask 240.0.0.0 2> /dev/null
		route add -net 224.0.0.0 netmask 240.0.0.0 $interface
		;;

	renew|bound)
		echo -n > $RESOLV_CONF
		[ -n "$domain" ] && echo search $domain >> $RESOLV_CONF
		for i in $dns ; do
			echo adding dns $i
			echo nameserver $i >> $RESOLV_CONF
		done

		ifconfig $interface $ip $BROADCAST $NETMASK

		if [ -n "$router" ] ; then
			while route del default gw 0.0.0.0 dev $interface 2> /dev/null ; do
				:
			done

			for i in $router ; do
				route add default gw $i dev $interface
			done
		fi

		route del 255.255.255.255 2> /dev/null
		route add 255.255.255.255 $interface

		route del -net 224.0.0.0 netmask 240.0.0.0 2> /dev/null
                route add -net 224.0.0.0 netmask 240.0.0.0 $interface

		rm /var/run/waitforip 2> /dev/null
		;;
esac

exit 0
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/dhcp.script`
- **Category:** system
- **Size:** 1.2 KB (1209 bytes)
- **SHA-256:** `e21b831e538f132d86422ead668e0f6e9c3e1d7c7f6a2e0aed4e0783e22c7f07`

udhcpc hook script; writes lease info and refreshes resolv.conf/hosts on the writable side.


</details>

### `diagprocessd`

The diagnostic coprocessor helper: a tiny FIFO-driven menu the factory uses to run production-line commands over a pipe interface.

[View](files/etc/diagprocessd) · [Download](files/etc/diagprocessd) · 2.2 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 86 lines:

```
#!/bin/sh

# -- WARNING ---- WARNING ---- WARNING ---- WARNING ---- WARNING --
# DO NOT MODIFY BY HAND.
# THIS IS AUTOMATICALLY GENERATED FROM: configs/arch/limelight.toml
# ANY CHANGES MUST BE MADE ONLY TO THE CONFIG FILES, NOT HERE.
# -- WARNING ---- WARNING ---- WARNING ---- WARNING ---- WARNING --

stdin=/tmp/diagstdin
stdout=/tmp/diagstdout

if [ ! -p $stdin ]; then
    mkfifo $stdin
fi

if [ ! -p $stdout ]; then
    mkfifo $stdout
fi

while true
do
    if read line < $stdin; then
        case "$line" in
            0)
                /bin/date > $stdout 2>&1
                ;;
            1)
                /bin/ls --full-time /jffs/app/debug /jffs/sys/debug /jffs/net/debug > $stdout 2>&1
                ;;
            2)
                /bin/df > $stdout 2>&1
                ;;
            3)
                /usr/bin/du -a -d 5 -k -x /jffs | sort -rn | head -n100 > $stdout 2>&1
                ;;
            4)
                /usr/bin/free > $stdout 2>&1
                ;;
            5)
                /sbin/ifconfig > $stdout 2>&1
                ;;
            6)
                /sbin/lsmod > $stdout 2>&1
                ;;
            7)
                /bin/mount > $stdout 2>&1
                ;;
            8)
                /bin/netstat -an > $stdout 2>&1
                ;;
            9)
                /bin/ps > $stdout 2>&1
                ;;
            10)
                /sbin/route -n > $stdout 2>&1
                ;;
            11)
                /usr/sbin/brctl showmacs br0 > $stdout 2>&1
                ;;
            12)
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/diagprocessd`
- **Category:** system
- **Size:** 2.2 KB (2304 bytes)
- **SHA-256:** `b5489037250b71ffaf6f6bf22192730dd9b36da829141a0ef886dd157285a079`

mkfifo-based command loop (diagstdin/diagstdout) dispatching numbered commands; generated from configs/arch/limelight.toml per the build system.


</details>

### `fallback_trusted_roots.rcb`

The backup set of root certificates: the trust anchors the player uses to check secure connections when its primary bundle is unavailable or being updated. It is the device's emergency list of who to trust.

[Download](files/etc/fallback_trusted_roots.rcb) · 26.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/fallback_trusted_roots.rcb`
- **Category:** system
- **Size:** 26.6 KB (27215 bytes)
- **SHA-256:** `e47699bd55299b5447add14a24a04a1a1044648755ce5637267fe634aa34139e`

RCB-format certificate bundle under /etc; managed by libsonos-certval with runtime bundle updates watched for (documented under libsonos_certval).


</details>

### `fstab`

The filesystem mount table: which storage areas exist (system files, the writable settings partition, temporary memory disks) and where they attach. It explains why settings survive reboots while scratch space does not.

[View](files/etc/fstab) · [Download](files/etc/fstab) · 501 B

<details markdown="1"><summary><b>Preview</b></summary>

First 8 of 8 lines:

```
# /etc/fstab: static file system information.
#
# <file system> <mount point>   <type>  <options>               <dump>  <pass>
#/dev/root       /               auto    defaults,errors=remount-ro      0 0
/dev/mapper/crroot	/	auto	noatime,nodiratime,defaults     0 0
proc            /proc           proc    defaults                        0 0
none            /dev/pts        devpts  gid=5,mode=620                  0 0
tmpfs           /dev/shm        tmpfs   defaults,noexec,nodev,nosuid,mode=600  0 0
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/fstab`
- **Category:** system
- **Size:** 501 B (501 bytes)
- **SHA-256:** `f8d2d28e0d0f6c3f37b2a5635f02d9801d5f9b5b7e257891fe79ac6b19706af4`

Mounts jffs2 (persistent) alongside tmpfs runtime dirs; the rootfs itself is read-only squashfs.


</details>

### `group`

The group list matching the account file: which user groups exist on the device.

[View](files/etc/group) · [Download](files/etc/group) · 504 B

<details markdown="1"><summary><b>Preview</b></summary>

First 44 of 44 lines:

```
root:x:0:
daemon:x:1:
bin:x:2:
sys:x:3:
adm:x:4:
tty:x:5:
disk:x:6:
lp:x:7:
mail:x:8:
news:x:9:
uucp:x:10:
man:x:12:
proxy:x:13:
kmem:x:15:
chrony:x:19:
sonos:x:20:
fax:x:21:
voice:x:22:
cdrom:x:24:
floppy:x:25:
tape:x:26:
sudo:x:27:
audio:x:29:
dip:x:30:
www-data:x:33:
backup:x:34:
operator:x:37:
list:x:38:
irc:x:39:
src:x:40:
gnats:x:41:
shadow:x:42:
utmp:x:43:
video:x:44:
sasl:x:45:
plugdev:x:46:
kvm:x:47:
sgx:x:48:
staff:x:50:
games:x:60:
shutdown:x:70:
wheel:x:80:
users:x:100:
nogroup:x:65534:
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/group`
- **Category:** system
- **Size:** 504 B (504 bytes)
- **SHA-256:** `662a6eac5e3759afce5eaee7200c75525d8ffae965c9d958a60d5a9d8180668c`

Standard group file; mostly stock groups plus the anacapa service account.


</details>

### `hosts.orig`

The original hosts file: a few built-in name shortcuts the firmware ships with before the system generates its working copy at boot.

[View](files/etc/hosts.orig) · [Download](files/etc/hosts.orig) · 100 B

<details markdown="1"><summary><b>Preview</b></summary>

First 3 of 3 lines:

```
127.0.0.1       localhost.localdomain   localhost
255.255.255.255 all-ones                all-ones

```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/hosts.orig`
- **Category:** system
- **Size:** 100 B (100 bytes)
- **SHA-256:** `cc9e641227208bec49d4f7b234aeb564656daa63b4ab542e4a70cba6c12bb828`

Template copied to /jffs/hosts during bring-up (the generated live file sits on the writable side).


</details>

### `inittab`

The startup table: the ordered list of what the device runs when it boots, including which console and service launchers come up and in what order. It is the first page of the boot story.

[View](files/etc/inittab) · [Download](files/etc/inittab) · 679 B

<details markdown="1"><summary><b>Preview</b></summary>

First 14 of 14 lines:

```
# autogenerated by gen_inittab.py for ARCH limelight; DO NOT EDIT
::sysinit:/etc/Configure > /dev/kmsg 2>&1
null::respawn:/etc/scripts/run_sshd.sh > /dev/kmsg 2>&1
null::respawn:/etc/runledmgrd > /dev/kmsg 2>&1
null::respawn:/etc/runnetstartd > /dev/kmsg 2>&1
null::respawn:/etc/runmdns > /dev/kmsg 2>&1
null::respawn:/etc/rundiagprocessd > /dev/kmsg 2>&1
null::respawn:/etc/runanacapa > /dev/kmsg 2>&1
null::respawn:/etc/runchrony > /dev/kmsg 2>&1
null::respawn:/etc/runsddp > /dev/kmsg 2>&1
null::respawn:/usr/sbin/secure_console_login.sh /dev/ttyS0 0 -n -l /usr/sbin/secure_console.sh > /dev/kmsg 2>&1
::ctrlaltdel:/sbin/reboot
::shutdown:/etc/init.d/rcK
::restart:/sbin/init
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/inittab`
- **Category:** system
- **Size:** 679 B (679 bytes)
- **SHA-256:** `44c96d00788087c4e852552c19a557abe6642b4fcdfc4ef543a53dc1ad32a3ec`

SysV-style inittab for busybox init; wires getty, the rc.d runlevels, and the rcK shutdown sequence.


</details>

### `inputrc`

Readline keybinding configuration: how command-line editing behaves in an interactive shell session.

[View](files/etc/inputrc) · [Download](files/etc/inputrc) · 421 B

<details markdown="1"><summary><b>Preview</b></summary>

First 12 of 12 lines:

```
# /etc/inputrc - global inputrc for libreadline
# See readline(3readline) and `info readline' for more information.

# Be 8 bit clean.
set input-meta on
set output-meta on

# To allow the use of 8bit-characters like the german umlauts, comment out
# the line below. However this makes the meta key not work as a meta key,
# which is annoying to those which don't need to type in 8-bit characters.

# set convert-meta off
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/inputrc`
- **Category:** system
- **Size:** 421 B (421 bytes)
- **SHA-256:** `01946fd5134804a8f5ba087fb4fe9dbf17f450213e8a47b9973eec167a588fd2`

Standard inputrc for readline-based shells.


</details>

### `issue`

The login banner text shown before a login prompt on a console. On most appliances it is leftover decoration, but it is part of the image.

[View](files/etc/issue) · [Download](files/etc/issue) · 29 B

<details markdown="1"><summary><b>Preview</b></summary>

First 3 of 3 lines:

```

Welcome to Rincon Networks

```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/issue`
- **Category:** system
- **Size:** 29 B (29 bytes)
- **SHA-256:** `c99e814fd5e8a7a6753ab2a693bc2451f225d64723f8e513b11dddc158ebe19a`

Stock /etc/issue banner.


</details>

### `issue.net`

The network variant of the login banner, shown by remote login services such as the SSH daemon when a session opens.

[View](files/etc/issue.net) · [Download](files/etc/issue.net) · 38 B

<details markdown="1"><summary><b>Preview</b></summary>

First 4 of 4 lines:

```

Welcome to Rincon Networks
%s/%m %r

```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/issue.net`
- **Category:** system
- **Size:** 38 B (38 bytes)
- **SHA-256:** `b2efa8dd090865fb16c2a2246992cdc1514fb6afa1589627f80cf72fef62e7c5`

Banner presented by dropbear/ssh on connect.


</details>

### `motd`

The 'message of the day' text shown after login. On a shipping appliance it is usually a placeholder.

[View](files/etc/motd) · [Download](files/etc/motd) · 29 B

<details markdown="1"><summary><b>Preview</b></summary>

First 3 of 3 lines:

```

Welcome to Rincon Networks

```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/motd`
- **Category:** system
- **Size:** 29 B (29 bytes)
- **SHA-256:** `c99e814fd5e8a7a6753ab2a693bc2451f225d64723f8e513b11dddc158ebe19a`

Standard motd file.


</details>

### `mtab`

The file reporting which filesystems are currently mounted. On this build it is a link into the kernel's live mount list rather than a static file.

[View](files/etc/mtab) · [Download](files/etc/mtab) · 193 B

<details markdown="1"><summary><b>Preview</b></summary>

First 7 of 7 lines:

```
rootfs / rootfs rw 0 0
/dev/root / ext3 rw 0 0
/proc /proc proc rw 0 0
usbdevfs /proc/bus/usb usbdevfs rw 0 0
/dev/hda1 /boot ext3 rw 0 0
none /dev/pts devpts rw 0 0
none /dev/shm tmpfs rw 0 0
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/mtab`
- **Category:** system
- **Size:** 193 B (193 bytes)
- **SHA-256:** `2b4f42d7e66f82fe677f6b514512f877cee048147a8ccdd87a33848d882c2206`

Symlink to /proc/mounts (live kernel view), standard on embedded systems.


</details>

### `passwd`

The device's account list: which usernames exist on the box (root, the web user, the player software's own user, and the usual service accounts). This is the classic Unix roster, present on almost every Linux appliance.

[View](files/etc/passwd) · [Download](files/etc/passwd) · 868 B

<details markdown="1"><summary><b>Preview</b></summary>

First 20 of 20 lines:

```
root:x:0:0:root:/:/bin/sh
daemon:x:1:1:daemon:/usr/sbin:/sbin/nologin
bin:x:2:2:bin:/bin:/sbin/nologin
sys:x:3:3:sys:/dev:/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/sbin/nologin
man:x:6:12:man:/var/cache/man:/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/sbin/nologin
mail:x:8:8:mail:/var/mail:/sbin/nologin
news:x:9:9:news:/var/spool/news:/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/sbin/nologin
proxy:x:13:13:proxy:/bin:/sbin/nologin
chrony:x:19:19::/tmp:/bin/false
anacapa:x:20:20::/tmp:/bin/false
www-data:x:33:33:www-data:/var/www:/sbin/nologin
backup:x:34:34:backup:/var/backups:/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/sbin/nologin
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/passwd`
- **Category:** system
- **Size:** 868 B (868 bytes)
- **SHA-256:** `a44fe8e73007ba8dba381d054e99bda955bb1a7d39ed5403187a40be906296b8`

Standard passwd file. No password hashes here (those live in shadow); notable entries: root, chrony, anacapa (uid 20), www-data.


</details>

### `pointercal`

Touchscreen calibration parameters. The Playbar has no touchscreen; this file is inherited from the shared base image that also serves products that do.

[View](files/etc/pointercal) · [Download](files/etc/pointercal) · 14 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
1 0 0 0 1 0 1
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/pointercal`
- **Category:** system
- **Size:** 14 B (14 bytes)
- **SHA-256:** `2e7213cec5f47e7e9aade9d17b6d565d64395a39a1117f6dac56ce079478a84b`

Calibrate-touchscreen constants retained from the common buildroot; vestigial on this model.


</details>

### `profile`

The shell profile: environment defaults applied when a login shell starts, such as search paths for commands.

[View](files/etc/profile) · [Download](files/etc/profile) · 375 B

<details markdown="1"><summary><b>Preview</b></summary>

First 18 of 18 lines:

```
# /etc/profile: system-wide .profile file for the Bourne shell (sh(1))
# and Bourne compatible shells (bash(1), ksh(1), ash(1), ...).

PATH="/usr/bin:/bin:/usr/sbin:/sbin"
if [ -f /proc/sonos-lock/fallback_state ] ; then
	if [ "`cat /proc/sonos-lock/fallback_state`" != "0" ]; then
		PS1='Fallback# ' ;
	else
		PS1='# ' ;
	fi
else
	PS1='# ' ;
fi

export PATH PS1

umask 022

```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/profile`
- **Category:** system
- **Size:** 375 B (375 bytes)
- **SHA-256:** `3b4fd21ee8a7ad3a7de4894e7515759cfaf54cf0448810e900a1bc11a7fe5275`

System-wide shell profile for the busybox environment.


</details>

### `protocols`

The protocol-name database: the table mapping names like 'tcp' and 'udp' to their protocol numbers, a classic Unix leftover that networking tools still consult.

[View](files/etc/protocols) · [Download](files/etc/protocols) · 5.7 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 149 lines:

```
# /etc/protocols:
# $Id: protocols,v 1.3 2001/07/07 07:07:15 nalin Exp $
#
# Internet (IP) protocols
#
#	from: @(#)protocols	5.1 (Berkeley) 4/17/89
#
# Updated for NetBSD based on RFC 1340, Assigned Numbers (July 1992).
#
# See also http://www.iana.org/assignments/protocol-numbers

ip	0	IP		# internet protocol, pseudo protocol number
#hopopt	0	HOPOPT		# hop-by-hop options for ipv6
icmp	1	ICMP		# internet control message protocol
igmp	2	IGMP		# internet group management protocol
ggp	3	GGP		# gateway-gateway protocol
ipencap	4	IP-ENCAP	# IP encapsulated in IP (officially ``IP'')
st	5	ST		# ST datagram mode
tcp	6	TCP		# transmission control protocol
cbt	7	CBT		# CBT, Tony Ballardie <A.Ballardie@cs.ucl.ac.uk>
egp	8	EGP		# exterior gateway protocol
igp	9	IGP		# any private interior gateway (Cisco: for IGRP)
bbn-rcc	10	BBN-RCC-MON	# BBN RCC Monitoring
nvp	11	NVP-II		# Network Voice Protocol
pup	12	PUP		# PARC universal packet protocol
argus	13	ARGUS		# ARGUS
emcon	14	EMCON		# EMCON
xnet	15	XNET		# Cross Net Debugger
chaos	16	CHAOS		# Chaos
udp	17	UDP		# user datagram protocol
mux	18	MUX		# Multiplexing protocol
dcn	19	DCN-MEAS	# DCN Measurement Subsystems
hmp	20	HMP		# host monitoring protocol
prm	21	PRM		# packet radio measurement protocol
xns-idp	22	XNS-IDP		# Xerox NS IDP
trunk-1	23	TRUNK-1		# Trunk-1
trunk-2	24	TRUNK-2		# Trunk-2
leaf-1	25	LEAF-1		# Leaf-1
leaf-2	26	LEAF-2		# Leaf-2
rdp	27	RDP		# "reliable datagram" protocol
irtp	28	IRTP		# Internet Reliable Transaction Protocol
iso-tp4	29	ISO-TP4		# ISO Transport Protocol Class 4
netblt	30	NETBLT		# Bulk Data Transfer Protocol
mfe-nsp	31	MFE-NSP		# MFE Network Services Protocol
merit-inp	32	MERIT-INP	# MERIT Internodal Protocol
sep	33	SEP		# Sequential Exchange Protocol
3pc	34	3PC		# Third Party Connect Protocol
idpr	35	IDPR		# Inter-Domain Policy Routing Protocol
xtp	36	XTP		# Xpress Tranfer Protocol
ddp	37	DDP		# Datagram Delivery Protocol
idpr-cmtp	38	IDPR-CMTP	# IDPR Control Message Transport Proto
tp++	39	TP++		# TP++ Transport Protocol
il	40	IL		# IL Transport Protocol
ipv6	41	IPv6		# IPv6
sdrp	42	SDRP		# Source Demand Routing Protocol
ipv6-route	43	IPv6-Route 	# Routing Header for IPv6
ipv6-frag	44	IPv6-Frag	# Fragment Header for IPv6
idrp	45	IDRP		# Inter-Domain Routing Protocol
rsvp	46	RSVP		# Resource ReSerVation Protocol
gre	47	GRE		# Generic Routing Encapsulation
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/protocols`
- **Category:** system
- **Size:** 5.7 KB (5834 bytes)
- **SHA-256:** `aa00b2cb0b6f77291c6e244774438f367e1407cb96e6c76189451243c26d9ca1`

Standard protocols database.


</details>

### `rpc`

The RPC program-number table, another standard Unix database file mapping remote-procedure names to numbers.

[View](files/etc/rpc) · [Download](files/etc/rpc) · 1.6 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 68 lines:

```
#ident	"@(#)rpc	1.11	95/07/14 SMI"	/* SVr4.0 1.2	*/
#
#	rpc
#
portmapper	100000	portmap sunrpc rpcbind
rstatd		100001	rstat rup perfmeter rstat_svc
rusersd		100002	rusers
nfs		100003	nfsprog
ypserv		100004	ypprog
mountd		100005	mount showmount
ypbind		100007
walld		100008	rwall shutdown
yppasswdd	100009	yppasswd
etherstatd	100010	etherstat
rquotad		100011	rquotaprog quota rquota
sprayd		100012	spray
3270_mapper	100013
rje_mapper	100014
selection_svc	100015	selnsvc
database_svc	100016
rexd		100017	rex
alis		100018
sched		100019
llockmgr	100020
nlockmgr	100021
x25.inr		100022
statmon		100023
status		100024
bootparam	100026
ypupdated	100028	ypupdate
keyserv		100029	keyserver
sunlink_mapper	100033
tfsd		100037
nsed		100038
nsemntd		100039
showfhd		100043	showfh
ioadmd		100055	rpc.ioadmd
NETlicense	100062
sunisamd	100065
debug_svc 	100066  dbsrv
ypxfrd		100069  rpc.ypxfrd
bugtraqd	100071
kerbd		100078
event		100101	na.event	# SunNet Manager
logger		100102	na.logger	# SunNet Manager
sync		100104	na.sync
hostperf	100107	na.hostperf
activity	100109	na.activity	# SunNet Manager
hostmem		100112	na.hostmem
sample		100113	na.sample
x25		100114	na.x25
ping		100115	na.ping
rpcnfs		100116	na.rpcnfs
hostif		100117	na.hostif
etherif		100118	na.etherif
iproutes	100120	na.iproutes
layers		100121	na.layers
snmp		100122	na.snmp snmp-cmc snmp-synoptics snmp-unisys snmp-utk
traffic		100123	na.traffic
nfs_acl		100227
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/rpc`
- **Category:** system
- **Size:** 1.6 KB (1595 bytes)
- **SHA-256:** `ebc43541c32b314942f92b105755b192ac8451e0e50e9a5c196e3b02c4a789a7`

Standard RPC database; part of the buildroot base image.


</details>

### `services`

The service-name database: which named services correspond to which port numbers (http = 80 and so on). Networking code consults it when translating names.

[View](files/etc/services) · [Download](files/etc/services) · 15.0 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 407 lines:

```
# /etc/services:
# $Id: services,v 1.4 1997/05/20 19:41:21 tobias Exp $
#
# Network services, Internet style
#
# Note that it is presently the policy of IANA to assign a single well-known
# port number for both TCP and UDP; hence, most entries here have two entries
# even if the protocol doesn't support UDP operations.
# Updated from RFC 1700, ``Assigned Numbers'' (October 1994).  Not all ports
# are included, only the more common ones.

tcpmux		1/tcp				# TCP port service multiplexer
echo		7/tcp
echo		7/udp
discard		9/tcp		sink null
discard		9/udp		sink null
systat		11/tcp		users
daytime		13/tcp
daytime		13/udp
netstat		15/tcp
qotd		17/tcp		quote
msp		18/tcp				# message send protocol
msp		18/udp				# message send protocol
chargen		19/tcp		ttytst source
chargen		19/udp		ttytst source
ftp-data	20/tcp
ftp		21/tcp
fsp		21/udp		fspd
ssh		22/tcp				# SSH Remote Login Protocol
ssh		22/udp				# SSH Remote Login Protocol
telnet		23/tcp
# 24 - private
smtp		25/tcp		mail
# 26 - unassigned
time		37/tcp		timserver
time		37/udp		timserver
rlp		39/udp		resource	# resource location
nameserver	42/tcp		name		# IEN 116
whois		43/tcp		nicname
re-mail-ck	50/tcp				# Remote Mail Checking Protocol
re-mail-ck	50/udp				# Remote Mail Checking Protocol
domain		53/tcp		nameserver	# name-domain server
domain		53/udp		nameserver
mtp		57/tcp				# deprecated
bootps		67/tcp				# BOOTP server
bootps		67/udp
bootpc		68/tcp				# BOOTP client
bootpc		68/udp
tftp		69/udp
gopher		70/tcp				# Internet Gopher
gopher		70/udp
rje		77/tcp		netrjs
finger		79/tcp
www		80/tcp		http		# WorldWideWeb HTTP
www		80/udp				# HyperText Transfer Protocol
link		87/tcp		ttylink
kerberos	88/tcp		kerberos5 krb5 kerberos-sec	# Kerberos v5
kerberos	88/udp		kerberos5 krb5 kerberos-sec	# Kerberos v5
supdup		95/tcp
# 100 - reserved
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/services`
- **Category:** system
- **Size:** 15.0 KB (15319 bytes)
- **SHA-256:** `9bc2ae7e79ef825a57eecb90681b0d9e2415fe8fc1be0cc5a2ecefebfb3ac611`

Standard services database.


</details>

### `shadow`

The account password table. It shows a factory-set root password hash plus locked service accounts, which is normal for an appliance where root login is not meant to be used day to day.

*Security-sensitive file: it is published firmware data and stays downloadable, but its contents are not previewed inline.*

[Download](files/etc/shadow) · 565 B

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/shadow`
- **Category:** system
- **Size:** 565 B (565 bytes)
- **SHA-256:** `0150ca4b759cfeb1d1df4d2f819b55b5db556a24bdd11399652df3269df7ed68`

MD5-crypt ($1$) root hash as shipped. This is a published firmware default, not a per-device secret; the diag build history around SSH access is documented under ssh_authorized_keys and the secure_console scripts.


</details>

### `shells`

The list of shells the system considers legal login shells. Mostly boilerplate on an appliance.

[View](files/etc/shells) · [Download](files/etc/shells) · 53 B

<details markdown="1"><summary><b>Preview</b></summary>

First 5 of 5 lines:

```
/bin/bash
/bin/sh
/bin/ash
/bin/ash.static
/bin/sash
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/shells`
- **Category:** system
- **Size:** 53 B (53 bytes)
- **SHA-256:** `82f4ce9af632497f688c4e48917e6f8aa00ad959677a4980731ef1dfd983b58d`

Standard shells file.


</details>

### `soc_arch`

The system-on-chip identifier: which processor family this firmware targets.

[View](files/etc/soc_arch) · [Download](files/etc/soc_arch) · 10 B

<details markdown="1"><summary><b>Preview</b></summary>

First 1 of 1 lines:

```
limelight
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/soc_arch`
- **Category:** system
- **Size:** 10 B (10 bytes)
- **SHA-256:** `e014957c02d19fce55760cb98e40b2613f849ac985abdeef6a7a267bf55e1065`

SoC family marker used by the launch and diagnostic scripts.


</details>


## Boot and service scripts

Small shell scripts that start and stop the device's programs in the right order, bring the network up, and recover when something crashes. Reading them is the clearest way to see how the player actually boots.

<details markdown="1"><summary><b>Technical details</b></summary>

POSIX shell launchers and lifecycle scripts under /etc; they glue the kernel, the sibling daemons, and anacapad together during boot, shutdown, and reset.

</details>

### `Krandom`

The shutdown-time entropy script: preserves randomness state across reboots so the device's cryptographic operations do not restart from a predictable seed.

[View](files/etc/init.d/Krandom) · [Download](files/etc/init.d/Krandom) · 499 B

<details markdown="1"><summary><b>Preview</b></summary>

First 17 of 17 lines:

```
#!/bin/sh
echo "Saving random seed..."
random_seed=/jffs/random-seed
touch $random_seed
chmod 600 $random_seed
poolfile=/proc/sys/kernel/random/poolsize
#  linux 2.4 has the poolsize in bytes, >= 2.6 in bits
case `uname -r` in
    2.4.*)
        [ -r $poolfile ] && bytes=`cat $poolfile` || bytes=512
        ;;
    *)
        [ -r $poolfile ] && bits=`cat $poolfile` || bits=4096
        bytes=$(expr $bits / 8)
        ;;
esac
dd if=/dev/urandom "of=$random_seed" count=1 "bs=$bytes" 2> /dev/null
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/init.d/Krandom`
- **Category:** scripts
- **Size:** 499 B (499 bytes)
- **SHA-256:** `43ba173153df8d85b25e6257324ea471938a7bd0cd1ce12faeea81791ba50b0f`

Saves/restores the random seed (cf. /jffs/random-seed) in the K-order shutdown sequence.


</details>

### `Srandom`

The boot-time entropy script: seeds the random number generator early so keys, tokens, and nonces are unpredictable from the very first connection.

[View](files/etc/init.d/Srandom) · [Download](files/etc/init.d/Srandom) · 246 B

<details markdown="1"><summary><b>Preview</b></summary>

First 8 of 8 lines:

```
#!/bin/sh
echo "Initializing random number generator..."
random_seed=/jffs/random-seed
# Carry a random seed from start-up to start-up
# Load and then save the whole entropy pool
if [ -f $random_seed ]; then
    cat $random_seed >/dev/urandom
fi
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/init.d/Srandom`
- **Category:** scripts
- **Size:** 246 B (246 bytes)
- **SHA-256:** `0a52cb3a89b1b93982143ba9bfc9f426249e4a6dfc7090887798f91e39635219`

Restores /jffs/random-seed into urandom at boot (S-order init step).


</details>

### `rcK`

The kill script: the ordered teardown list run at shutdown or reboot, stopping services in the right sequence before power-off.

[View](files/etc/init.d/rcK) · [Download](files/etc/init.d/rcK) · 719 B

<details markdown="1"><summary><b>Preview</b></summary>

First 35 of 35 lines:

```
#!/bin/sh
# Preserve seed
/etc/init.d/Krandom

daemonkill() {
    for daemon in sonosledmgrd sonosdiagd \
	sonospowercoordinator anacapad chronyd sddpd \
	dropbear netstartd mdnsd udhcpc rngd ; do
	killall -$1 $daemon 2> /dev/null
    done
}

for stop in stopupgrade stopledmgrd stopdiagapp \
    stopsonospowercoordinator \
    stopmdns stopdiagprocessd stopanacapa stopchrony stopsddp stopnetstartd; do
    touch /var/run/$stop
done

echo Sending SIGTERM
daemonkill TERM
sync
sleep 2

echo Sending SIGKILL
daemonkill KILL
sync
sleep 1

if [ -x /etc/scripts/ampmcu-down.sh ]; then
    echo Disabling AMPMCU instances
    /etc/scripts/ampmcu-down.sh
fi

echo Unmounting /jffs
grep -q /jffs /proc/mounts && umount /jffs
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/init.d/rcK`
- **Category:** scripts
- **Size:** 719 B (719 bytes)
- **SHA-256:** `1970b0bb740fb4d244af646e2567fb6f16aaea2c9cbf2987403605058729e08b`

Init runlevel-K aggregation; pairs with the inittab shutdown entries.


</details>

### `runanacapa`

The launcher for the main player software: the script that starts anacapad with its config file, drops privileges to its own user, and sets up its environment. The player's whole life starts here at every boot.

[View](files/etc/runanacapa) · [Download](files/etc/runanacapa) · 568 B

<details markdown="1"><summary><b>Preview</b></summary>

First 28 of 28 lines:

```
#!/bin/sh

. /etc/rundaemon.sh

trackrestart anacapa /var/run/anacapa.start 1

if [ -f /var/run/upgradeinfo ]; then
    mkdir /tmp
    rm /jffs/upgrade_tmp_prev.log
    mv /tmp/upgrade.log /jffs/upgrade_tmp_prev.log
    echo Running upgrade ...
    /bin/upgrade >> /tmp/upgrade.log 2>&1
    rr=$?
    echo RESULT = $rr >> /tmp/upgrade.log
    rm /var/run/upgradeinfo
    exit $rr
fi
for X in /tmp/smb/*
do 
    if [ -d "$X" ] 
    then
        umount "$X"
        rmdir "$X"
    fi
done
waitwhiletrue "[ -f /var/run/stopanacapa ]"

exec /opt/bin/anacapactl start-demo
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/runanacapa`
- **Category:** scripts
- **Size:** 568 B (568 bytes)
- **SHA-256:** `3c701e472a5ea6ff664deb092dbecbb1642e12799f8f92095955dc0e3cc999fb`

Launches 'anacapad -c /opt/conf/anacapa.conf -u anacapa -C all=eip' with the pid file at /opt/log/anacapa.pid; supports gdb-wrapped debug starts and the demo-mode direct exec (documented on the rootfs_boot_chain entry).


</details>

### `runchrony`

The launcher for the time-sync daemon: starts the component that keeps the speaker's clock correct, which everything from multi-room sync to alarm timing depends on.

[View](files/etc/runchrony) · [Download](files/etc/runchrony) · 2.8 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 70 lines:

```
#!/bin/sh

#####
# Handler script for chronyd, the NTP daemon which sets the system clock.
# This is meant to be run in perpetuity thanks to the inittab.
# If you must use another technique to set the system clock, touch
# /var/run/stopchrony and run `killall chronyd` first.
#
# chrony detects errors in the system clock relative to the real UTC time it
# determines by polling NTP servers. These errors can be either "small" or
# "big" (see all/mtools/gen_chronyconf.py for the threshhold between these).
# Whenever it's running, chronyd corrects small errors by "slewing" the system
# clock (adjusting how fast it ticks so that it matches up with UTC time fairly
# quickly, but not immediately). When clock errors are big, chronyd can correct
# them by instead "stepping" the system clock (correcting it immediately).
# Stepping the clock can theoretically be dangerous to running processes, so we
# only let chronyd do it once per operation.
#####
. /etc/rundaemon.sh

trackrestart chrony /var/run/chrony.start

# Wait until the platform has an IP address AND a DNS server is available:
# until both conditions are met, chronyd cannot make forward progress.
waitfordns

waitwhiletrue "[ -f /var/run/stopchrony ]"

# Set up directories chrony needs
mkdir -p /jffs/chrony
chown -R chrony:sonos /jffs/chrony
mkdir -p /var/lib/chrony
chown -R chrony:sonos /var/lib/chrony

# It's possible (though rare) for the system clock to get set too far ahead of
# detected NTP time. If this happens, chrony logs this, increments the count in
# this file, and exits. We restart chrony in case we got unlucky and synced with
# bad servers, but to prevent perpetual restarting, we do so less and less
# frequently the more we fail.
#
# If an RTC is present, we set its value to match the detected NTP time,
# so that if forward drift of the RTC was the cause of the system clock's
# inaccuracy, the system clock will be set more accurately during the next
# reboot.
if [ -f /var/lib/chrony/sync_failure_count ]; then
  if grep -Fxq HAS_RTC /etc/arch_attrs && \
     [ -f /var/lib/chrony/sync_time_offset ]; then
    hwclock -u -w$(cat /var/lib/chrony/sync_time_offset)
  fi
  fail_count=$(cat /var/lib/chrony/sync_failure_count)
  if [ $fail_count -eq 1 ]; then
    echo "sysclock uncorrectably fast of true; trying again in 5 minutes"
    sleep 300
  elif [ $fail_count -eq 2 ]; then
    echo "sysclock uncorrectably fast of true; trying again in 30 minutes"
    sleep 1800
  else
    echo "sysclock uncorrectably fast of true; trying again in 60 minutes"
    sleep 3600
  fi
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/runchrony`
- **Category:** scripts
- **Size:** 2.8 KB (2851 bytes)
- **SHA-256:** `dca6c5babccbc7a1166106912ea0dc736aab27c10a2a3effb12457e55934194f`

Starts chronyd against /etc/chrony.conf; drift persisted to /jffs/chrony.


</details>

### `rundaemon.sh`

A shared daemon-runner script: a generic wrapper used to start background services with the right bookkeeping instead of each launcher reinventing it.

[View](files/etc/rundaemon.sh) · [Download](files/etc/rundaemon.sh) · 847 B

<details markdown="1"><summary><b>Preview</b></summary>

First 35 of 35 lines:

```
# waitwhiletrue executes a shell command until it returns false, sleeping
# 10 seconds between retries
waitwhiletrue() {
    while eval "$1"; do
	sleep 10
    done
}

# waitfordns waits until DNS and networking are available
# Wait until the platform has an IP address AND a DNS server is available:
waitfordns() {
    while [ -f /var/run/waitforip ] || ! grep -qs nameserver /etc/resolv.conf; do
	sleep 1
    done
}

# trackrestart tracks starts/restarts
# trackrestart daemon-name track-file <optional sleep time>
trackrestart() {
    if [ -f $2 ]; then
	echo "Restarting $1 - last started" `tail -n -1 $2`
	if [ -n "$3" ]; then
	    sleep $3
	else
	    sleep 5
	fi	    
    fi
    date >> $2
}

# waitwhilestopped waits while a daemon is stopped
# waitwhilestopped daemon-stop-name
waitwhilestopped() {
    waitwhiletrue "[ -f /var/run/$1 ]"
}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/rundaemon.sh`
- **Category:** scripts
- **Size:** 847 B (847 bytes)
- **SHA-256:** `6f76a74572f19e09223d9876b30b0d9bef2dfaf4036529bf7aa6a5a55f4a7c38`

Generic daemon launcher shared by the run* scripts; also referenced by the sibling-daemon IPC work (see multi_daemon_boundary).


</details>

### `rundiagprocessd`

The launcher for the diagnostic coprocessor menu: brings up the FIFO command interface used for factory and service diagnostics.

[View](files/etc/rundiagprocessd) · [Download](files/etc/rundiagprocessd) · 160 B

<details markdown="1"><summary><b>Preview</b></summary>

First 9 of 9 lines:

```
#!/bin/sh

. /etc/rundaemon.sh

trackrestart diagprocessd /var/run/diagprocessd.start

waitwhiletrue "[ -f /var/run/stopdiagprocessd ]"

exec /etc/diagprocessd
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/rundiagprocessd`
- **Category:** scripts
- **Size:** 160 B (160 bytes)
- **SHA-256:** `391f9002a197c91e482230680636757415fdfd2b26e8fc90ba8e9983af9003ff`

Starts the /etc/diagprocessd FIFO loop.


</details>

### `runledmgrd`

The launcher for the LED manager daemon: starts the little program that owns the speaker's lights and runs the animated patterns.

[View](files/etc/runledmgrd) · [Download](files/etc/runledmgrd) · 995 B

<details markdown="1"><summary><b>Preview</b></summary>

First 27 of 27 lines:

```
#!/bin/sh

. /etc/rundaemon.sh

trackrestart sonosledmgrd /var/run/sonosledmgrd.start

while [ -f /var/run/stopledmgrd ] || [ -e /var/run/sonosledmgrd.pid ]; do
    # If we are not deliberately stopping and a pid file exists, check to make
    # sure that the pid is actually running. If not, the process has exited abnormally
    # and needs to be kicked after logging a message.
    if  [ ! -f /var/run/stopledmgrd ]; then
        curpid=`pidof sonosledmgrd`
        if [ $? = 1 ]; then
            pid=`cat /var/run/sonosledmgrd.pid`
            _dat=`date "+%h %d %H:%m:%S runledmgrd"`
            # this is a system daemon.. so use '3' for message priority
            echo "<3> $_dat LED Manager PID $pid is stale. Likely caused by an abnormal exit. Check logs. Restarting LED Manager" >> /opt/log/sonosledmgrd.log
            unset _dat
            unset pid
            break
        fi
        unset curpid
    fi
    sleep 5
done
echo "Starting LED Manager"
exec /opt/bin/sonosledmgrd
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/runledmgrd`
- **Category:** scripts
- **Size:** 995 B (995 bytes)
- **SHA-256:** `5dd6c8b9b8e4ea32fecd923aa6b281ef4037199b1e477c6f9de912f79ab3a2b2`

Starts sonosledmgrd; the daemon owns /dev/ledctl and the LED scripting engine documented in led_engine.


</details>

### `runmdns`

The launcher for the discovery daemon: starts the service that announces the speaker on the network and finds its siblings.

[View](files/etc/runmdns) · [Download](files/etc/runmdns) · 94 B

<details markdown="1"><summary><b>Preview</b></summary>

First 7 of 7 lines:

```
#!/bin/sh

. /etc/rundaemon.sh

waitwhiletrue "[ -f /var/run/stopmdns ]"

exec /sbin/mdnsd -f
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/runmdns`
- **Category:** scripts
- **Size:** 94 B (94 bytes)
- **SHA-256:** `3172ecf3a73d634a681441d73e371ac41e47e62e5eccc4989f5fb0e8541350b2`

Starts mdnsd for multicast-DNS announce/browse; feeds the discovery_layer machinery.


</details>

### `runnetstartd`

The launcher for the network-startup daemon: starts the component that brings up WiFi and Ethernet in the right order during boot and setup.

[View](files/etc/runnetstartd) · [Download](files/etc/runnetstartd) · 134 B

<details markdown="1"><summary><b>Preview</b></summary>

First 9 of 9 lines:

```
#!/bin/sh

. /etc/rundaemon.sh

trackrestart netstartd /var/run/netstartd.start

waitwhilestopped stopnetstartd

exec /wifi/netstartd
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/runnetstartd`
- **Category:** scripts
- **Size:** 134 B (134 bytes)
- **SHA-256:** `79a483bfb764152467a90515b8c597b7381e64a0ddee82823840f1b7705bf3a8`

Starts netstartd, the process anacapad talks to over /tmp/netstartd.ipc for network state and setup transitions.


</details>

### `runsddp`

The launcher for the device-announcement daemon: starts the broadcaster that keeps the household map populated.

[View](files/etc/runsddp) · [Download](files/etc/runsddp) · 651 B

<details markdown="1"><summary><b>Preview</b></summary>

First 26 of 26 lines:

```
#!/bin/sh

#####
# Handler script for sddpd, the Device Discovery Protocol daemon developed
# by Control4. This is meant to be run in perpetuity thanks to the inittab.
# If you must use another technique for SDDP, touch
# /var/run/stopsddp and run `killall sddpd`.
#####

. /etc/rundaemon.sh

trackrestart sddpd /var/run/sddpd.start

# sddpd requires IP and DNS.
waitfordns

waitwhiletrue "[ -f /var/run/stopsddp ]"

sddpd_opts="-n" # don't daemonize

if [ -f /jffs/dev_sddp.conf ]; then
  echo "Found /jffs/dev_sddp.conf; using it instead of default /etc/sddp.conf."
  sddpd_opts="$sddpd_opts -c /jffs/dev_sddp.conf"
fi

exec /sbin/sddpd $sddpd_opts
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/runsddp`
- **Category:** scripts
- **Size:** 651 B (651 bytes)
- **SHA-256:** `60984a4598d37a6ac93bc3be3a29708537bbd8c4118ca884452ed2d99bcc66aa`

Starts sddpd with /etc/sddpd.conf.


</details>

### `mount_jffs.sh`

The script that mounts the writable partition: the step during boot that makes the speaker's saved settings, logs, and queues available. Until this runs, the device only has its read-only image.

[View](files/etc/scripts/mount_jffs.sh) · [Download](files/etc/scripts/mount_jffs.sh) · 389 B

<details markdown="1"><summary><b>Preview</b></summary>

First 21 of 21 lines:

```
# Copyright (c) 2022, Sonos, Inc.  All rights reserved.

sonos_mount_jffs()
{
    mount -t jffs2 -o noatime /dev/nandjffs /jffs
}

sonos_unmount_jffs()
{
    grep -q /jffs /proc/mounts
    ret=$?
    if [ $ret -eq 0 ]; then
        umount /jffs
        ret=$?
        if [ $ret -ne 0 ]; then
            echo "error umounting /jffs: $ret" 1>&2
            return $ret
        fi
    fi
}

```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/scripts/mount_jffs.sh`
- **Category:** scripts
- **Size:** 389 B (389 bytes)
- **SHA-256:** `af1c5c97306ffd2b06366562b5ea601814310739d671c2f938a4958cabee4d69`

Mounts the jffs2 flash partition at /jffs; ordering matters because nearly every subsystem reads persisted state from it.


</details>

### `run_sshd.sh`

The script that conditionally starts the SSH daemon: SSH exists on the box but is gated, and this is the gatekeeper deciding whether remote shell access is allowed at all.

[View](files/etc/scripts/run_sshd.sh) · [Download](files/etc/scripts/run_sshd.sh) · 499 B

<details markdown="1"><summary><b>Preview</b></summary>

First 18 of 18 lines:

```
#!/bin/sh
# Copyright (c) 2019-2023, Sonos, Inc.  All rights reserved.

. /etc/rundaemon.sh

trackrestart dropbear /var/run/dropbear.start

waitwhiletrue "[ ! -f /tmp/device_unlocked_flag ]"

mkdir -p /jffs/persist/ssh
mkdir -m 700 -p /jffs/sys/debug/ssh
if [ ! -f /jffs/sys/debug/ssh/authorized_keys ]; then
    touch /jffs/sys/debug/ssh/authorized_keys
fi
if [ ! -s /jffs/persist/ssh/dropbear_ecdsa_host_key ]; then
    rm /jffs/persist/ssh/dropbear_ecdsa_host_key
fi
exec /usr/bin/dropbear -R -F
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/etc/scripts/run_sshd.sh`
- **Category:** scripts
- **Size:** 499 B (499 bytes)
- **SHA-256:** `822523d641bd6ee7ea0b271e4dadb05ebe598249f86d0717f03cc6394ba97732`

Starts dropbear only when the device is in a permitted state (engineering/unlock path); installs host keys under /jffs/persist/ssh on first run.


</details>

### `netconfig.sh`

The network reconfiguration state machine in a single shell script: one call with a mode argument moves the player between Sonos's mesh, normal home WiFi, the open setup hotspot, credential-checking, or a standalone island mode. It is why the speaker can hop between network setups without reflashing.

[View](files/usr/sbin/netconfig.sh) · [Download](files/usr/sbin/netconfig.sh) · 10.7 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 449 lines:

```
#!/bin/sh


case "$1" in
    sonosnet|station|satellite|sta_and_sat|open|credcheck|deauth|wacexit|island|up)
        MODE="$1"
        WAC=0
        ;;
    wacstart|wacapclose|wactimeout)
        MODE="$1"
        WAC=1
        ;;
    waccredcheck)
        MODE=credcheck
        WAC=1
        ;;
    wacapopen)
        MODE=open
        WAC=1
        ;;
    wacstation)
        MODE=station
        WAC=1
        ;;
    *)
        echo "Illegal mode!"
        exit 1
        ;;
esac

case "$2" in
    stp_disable)
        STPSTATE="off"
        ;;
    stp_enable)
        STPSTATE="on"
        ;;
    *)
        echo "Illegal STP state!"
        exit 1
        ;;
esac

PARAM1="$3"
PARAM2="$4"
PARAM3="$5"
PARAM4="$6"


ARCH_ATTRS=/etc/arch_attrs

if [ -f /jffs/debug/testpoints.sh ] && \
   [ "`cat /proc/sonos-lock/exec_enable`" == "1" ]; then
    . /jffs/debug/testpoints.sh || true
fi

if [ "${WAC}" = "0" ]; then
    if [ -f /tmp/wacd.pid ]; then
        kill `cat /tmp/wacd.pid`
        rm -f /tmp/wacd.pid
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/usr/sbin/netconfig.sh`
- **Category:** scripts
- **Size:** 10.7 KB (10932 bytes)
- **SHA-256:** `13f8bb6219d077e3eac73df1005b42547306f7d506ce62752a5db9cbcd2aea83`

The netconfig FSM documented under netconfig_fsm: modes include SonosNet join, infrastructure join, open-AP setup, check-only, and island; touches wpa_supplicant, ssidlist, and the flag files under /var/run.


</details>

### `secure_console.sh`

The secure console gate: the script that decides whether the device will expose a debug console, checking the unlock state before offering a shell.

[View](files/usr/sbin/secure_console.sh) · [Download](files/usr/sbin/secure_console.sh) · 236 B

<details markdown="1"><summary><b>Preview</b></summary>

First 7 of 7 lines:

```
#!/bin/sh

# This is a wrapper script called by getty, which is unable to pass
# arguments to the program it starts (typically login). We need to pass
# the user to login as (-f root).
echo "Starting console..."
exec /bin/login -f root
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/usr/sbin/secure_console.sh`
- **Category:** scripts
- **Size:** 236 B (236 bytes)
- **SHA-256:** `fa1827c45a7048097e57a0660942022f10ef4420b0e53d50fb35e68078f4f30b`

Gates console access on the device-unlock flag (/tmp/device_unlocked_flag family); part of the engineering surfaces documented under dev_unlock.


</details>

### `secure_console_login.sh`

The login half of the secure console: how a permitted console session is actually opened once the gate allows it.

[View](files/usr/sbin/secure_console_login.sh) · [Download](files/usr/sbin/secure_console_login.sh) · 1.0 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 33 of 33 lines:

```
#!/bin/sh

# Wrapper around getty to wait for dynamic devices (USB) and enforce
# console security. Passed tty, baud rate, and other parameters, which
# are then passed to getty.

. /etc/rundaemon.sh

tty=`basename $1`
baud=$2
extra=$3
shift 3
while [ $# -gt 0 ]
	do extra="$extra $1"
	shift
done

trackrestart getty-$tty /var/run/getty-${tty}.start 1

waitwhiletrue "[ ! -c /dev/$tty ]"

# In early development, this file may not exist. Also, it will not
# exist on pre-secure boot plauers. In both cases, we'll enable the
# console by default. Note that on pre-secure boot players, the
# console is disabled by other methods.
[ -f /proc/sonos-lock/console_enable ] &&
	waitwhiletrue "[ `cat /proc/sonos-lock/console_enable` != '1' ]"

# Start a getty on the tty passed in as our parameter.
# Since USB may be hot-plugged, and because initialization happens
# this device might not instantiated at the time the script starts,
# so the scripts I/O is set to be logged at first.
exec getty -L -w $extra $tty $baud linux < /dev/$tty > /dev/$tty 2>&1
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/usr/sbin/secure_console_login.sh`
- **Category:** scripts
- **Size:** 1.0 KB (1048 bytes)
- **SHA-256:** `69e775c702e96d1688c33ab498e286f88bbf682d503eef70a1223ed8b1ce59de`

Companion to secure_console.sh; performs the session setup after the gate check.


</details>


## Programs

The runnable programs shipped on the speaker: the main player software itself, the daemons that manage networking and LEDs, and the utility tools used for upgrades, diagnostics, and factory procedures. These are compiled machine code, so you can download them but not read them like a text file.

<details markdown="1"><summary><b>Technical details</b></summary>

ELF executables for the limelight (ARM) target. anacapad is the analysis subject of this site; the rest are sibling daemons and vendor/board utilities.

</details>

### `busybox`

The Swiss Army knife of the system: one small program providing all the everyday Unix commands (ls, cp, ping, ps, and dozens more). Most of the other tools in /bin are just shortcuts to this one file.

[Download](files/bin/busybox) · 513.8 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/bin/busybox`
- **Category:** binaries
- **Size:** 513.8 KB (526096 bytes)
- **SHA-256:** `f04f6646c7d054e995cd09d4c17205d1cd71a080171e97a80750de6a190f16c7`

busybox multi-call binary; the /bin utilities (cat, ls, mount, netstat, ping, ps, ...) are symlinks into it.


</details>

### `chronyc`

The command-line client for the time daemon: the tool scripts and diagnostics use to ask 'what does the clock think right now?'.

[Download](files/bin/chronyc) · 129.7 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/bin/chronyc`
- **Category:** binaries
- **Size:** 129.7 KB (132812 bytes)
- **SHA-256:** `723675cde72cd0a37754828c9463877c9d303301424d4e36aa0e6906d1d81afe`

chrony control client; referenced by the exec-page diagnostics (chronyc source tracking).


</details>

### `dropbearmulti`

The SSH server toolkit in one binary: provides the secure shell access the device can open for engineering, plus the key tools that go with it.

[Download](files/bin/dropbearmulti) · 258.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/bin/dropbearmulti`
- **Category:** binaries
- **Size:** 258.4 KB (264552 bytes)
- **SHA-256:** `4fdab40a039cd989323458024aa010600c7849afc54e728d2735871b381583fc`

Dropbear multi-call binary (sshd/dropbearkey in one); gated by run_sshd.sh and the unlock flags; host keys persist under /jffs/persist/ssh.


</details>

### `mdputil`

The device-data utility: reads and writes the small factory data block that carries this unit's identity like its serial number and calibration slots, programmed at manufacturing.

[Download](files/bin/mdputil) · 66.0 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/bin/mdputil`
- **Category:** binaries
- **Size:** 66.0 KB (67596 bytes)
- **SHA-256:** `e3b2f55b3ecd50b3b26aeb1771f0e9b1b0ed30dea84fa759e7adfa70f6a0cd61`

MDP (manufacturing data payload) tool; initializes the device-payload.bin template documented in firmware-differences; source of serial/MAC/calibration fields.


</details>

### `pcap`

The packet-capture tool: records network traffic for diagnostics, used when Sonos needs to see what the speaker is actually receiving.

[Download](files/bin/pcap) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/bin/pcap`
- **Category:** binaries
- **Size:** 65.4 KB (66996 bytes)
- **SHA-256:** `1f774e76d0904d94c3321eead021c9063e111a3bd6a82e2ad476aa250d8fb52f`

pcap capture utility invoked from the diagnostics surface.


</details>

### `upgrade`

The low-level updater: the program that actually writes a downloaded firmware image to flash during an update.

[Download](files/bin/upgrade) · 195.3 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/bin/upgrade`
- **Category:** binaries
- **Size:** 195.3 KB (200036 bytes)
- **SHA-256:** `6777928534592ccec85ff9505334fb0c85f842565aab9cc64fcc23e41d03eca6`

Update applier invoked by upgrade_mgr; the recovery path runs it in a loop (documented in update_machinery's sibling-binaries record).


</details>

### `upgrade_mgr`

The update manager: orchestrates a downloaded update, verifies it, and schedules the reboot into the new firmware.

[Download](files/bin/upgrade_mgr) · 65.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/bin/upgrade_mgr`
- **Category:** binaries
- **Size:** 65.6 KB (67160 bytes)
- **SHA-256:** `b806c0df7934b9fd3fa367aa1a9eb73a09c4f0c81cd06e6b3ec28fb34636cd2c`

Upgrade orchestrator; its status and report files land under /tmp/upgrade_mgr_* and /jffs/upgrade*.


</details>

### `anacapactl`

The supervisor script for the main player: a shell wrapper that starts anacapad with the right privileges, watches it, and can launch it under a debugger for development. It is the little harness around the big program.

[View](files/opt/bin/anacapactl) · [Download](files/opt/bin/anacapactl) · 2.0 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 128 lines:

```
#! /bin/sh
anacapaHome=/opt
anacapaPidFile=$anacapaHome/log/anacapa.pid
anacapaBin="$anacapaHome/bin/anacapad"
anacapaOpts="-c $anacapaHome/conf/anacapa.conf -u anacapa -C all=eip"
anacapaStart="$anacapaBin $anacapaOpts"

PATH=/usr/bin:/bin:/usr/sbin:/sbin:$anacapaHome/bin
export PATH
LD_LIBRARY_PATH=$anacapaHome/lib
export LD_LIBRARY_PATH
ANACAPA_LIBDIR=$anacapaHome/lib
export ANACAPA_LIBDIR

arch=`uname -m`
#
# CheckRunning
# Check to see if Anacapa is running, and if so, set the "pid" var.
#
CheckRunning() {
	pid=""
	if [ -f $anacapaPidFile ]; then
		pid=`cat $anacapaPidFile 2> /dev/null`
	fi

	if [ -n "$pid" ]; then
		kill -0 $pid 2> /dev/null
		if [ $? != 0 ]; then
			rm -f $anacapaPidFile
			pid=""
		fi
	else
		rm -f $anacapaPidFile
		pid=""
	fi
}

#
# Stop
# Stop the anacapa and wait until the primary process is dead.
#
Stop() {
	kill -15 $pid
	CheckRunning
	while [ -n "$pid" ]; do
		sleep 1
		CheckRunning
	done
}

CheckRunning

#
# Hup
# Hup the anacapa
#
Hup() {
	kill -HUP $pid
}

```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/bin/anacapactl`
- **Category:** binaries
- **Size:** 2.0 KB (2015 bytes)
- **SHA-256:** `546ecdef28593ecdd6dfdbe81cf96e62b0bd41773cf9984dd469b287a3a9d0c5`

POSIX sh supervisor (fully readable text): handles start/stop/restart, demo-mode exec, cache-drop on certain boards, and gdb wrapping via $SONOS_GDB_ARGS.


</details>

### `anacapad`

The main event: the Sonos player daemon itself. This single program implements nearly everything this site documents, from the classic remote-control commands to the modern app API to the media pipeline. If you download one file, this is the one.

[Download](files/opt/bin/anacapad) · 16.5 MB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/bin/anacapad`
- **Category:** binaries
- **Size:** 16.5 MB (17329076 bytes)
- **SHA-256:** `f60262a152aac48bd39bf0285d17d080e6820e37be12d0af9de7bffee8d3e257`

The analysis subject: ~4 MB ARM ELF (limelight). Every dispatch table, URI grammar, and subsystem entry on this site was recovered from this binary. Build 86.10-80260 per build.properties.


</details>

### `sonosledmgrd`

The LED manager daemon: the small program that owns the speaker's status light and plays the animation patterns for states like setup, playing, and muted.

[Download](files/opt/bin/sonosledmgrd) · 1.2 MB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/bin/sonosledmgrd`
- **Category:** binaries
- **Size:** 1.2 MB (1248340 bytes)
- **SHA-256:** `4a4afe45e2b31f26458268e1b7cc7a01ac57a7631337753c9d914135cf1c540f`

ELF daemon; owns /dev/ledctl. Its animated pattern engine and per-model feature map are documented under led_engine/leds_zp/led_hw.


</details>

### `capsh`

A capability-inspection utility from the libcap package, used for checking process privileges.

[Download](files/sbin/capsh) · 66.8 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/sbin/capsh`
- **Category:** binaries
- **Size:** 66.8 KB (68432 bytes)
- **SHA-256:** `4ddf9eef05b0be1aca5e03e082c8062dd7e5ccfb6844e7298f52585058ce2875`

Standard libcap tool; ships with the capability-aware launch path (anacapactl's -C keep-set).


</details>

### `chronyd`

The time-sync daemon: the program that keeps the speaker's clock disciplined against internet time servers, which is the quiet foundation of sample-accurate multi-room playback.

[Download](files/sbin/chronyd) · 258.0 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/sbin/chronyd`
- **Category:** binaries
- **Size:** 258.0 KB (264144 bytes)
- **SHA-256:** `df82a031253bbf53f2c0b491525eeaeae0f67e3f3368df879777a4c16871721f`

chrony daemon build; Sonos's sntp layer plus chrony is documented under sntp/sntp_server.


</details>

### `frcheck`

The factory-reset checker: looks at the button/reset state at boot and reports whether the device should wipe itself clean before anything else starts.

[Download](files/sbin/frcheck) · 65.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/sbin/frcheck`
- **Category:** binaries
- **Size:** 65.5 KB (67080 bytes)
- **SHA-256:** `8bd04de01ac8d4ed07ba3daee7a3d32db13fbad53486dc9da6ad06602ff1fde5`

Its return code feeds the rootfs boot chain: on m8 it maps to netstartd --soft-reset, on m9 to --hard-reset (a real per-model behavioral difference).


</details>

### `mdnsd`

The discovery daemon: the standalone program that handles announcing and finding devices on the local network, shared across the system.

[Download](files/sbin/mdnsd) · 513.8 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/sbin/mdnsd`
- **Category:** binaries
- **Size:** 513.8 KB (526152 bytes)
- **SHA-256:** `5e1bf99fe4ca077de4e71d4713afe8ce49f7450a4674b3ab1f8a655a2b4710a3`

Multicast-DNS daemon; the mdns/mdnsd log and the discovery layer on this site trace back to it.


</details>

### `sddpd`

The device-announcement daemon: the sibling process running Sonos's own broadcast protocol that keeps players aware of each other.

[Download](files/sbin/sddpd) · 65.9 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/sbin/sddpd`
- **Category:** binaries
- **Size:** 65.9 KB (67464 bytes)
- **SHA-256:** `3b49f832d445c0f5c3c3bb15ffa5c596b22710ac8ae766615d2695fe38823521`

Sonos Discovery Protocol daemon configured by /etc/sddpd.conf; complements multicast DNS with Sonos's proprietary announce layer.


</details>

### `udhcpc`

The DHCP client: the tiny program that asks your router for an address when the speaker boots on a normal network.

[Download](files/sbin/udhcpc) · 66.3 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/sbin/udhcpc`
- **Category:** binaries
- **Size:** 66.3 KB (67852 bytes)
- **SHA-256:** `26803ab4fa77327f3f9518800c91aa35a37077955bb6ed35ce2fec7d7399a4ba`

busybox-style udhcp client driving /etc/dhcp.script on lease events.


</details>

### `brctl`

The bridge control tool: manages the network bridge interface the speaker uses to share its connection in SonosNet setups.

[Download](files/usr/sbin/brctl) · 66.0 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/usr/sbin/brctl`
- **Category:** binaries
- **Size:** 66.0 KB (67624 bytes)
- **SHA-256:** `6ffee508067d9163c73ae2c9ff256355ef4ca54cace0589ce12d20cfb3695ba7`

Ethernet-bridging utility for the bridged-wireless topology SonosNet requires.


</details>

### `keyval`

The key-value store tool: reads and writes small system-level settings keys used by the lower-level services.

[Download](files/usr/sbin/keyval) · 65.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/usr/sbin/keyval`
- **Category:** binaries
- **Size:** 65.6 KB (67128 bytes)
- **SHA-256:** `3bd52f3d28928b29ca3da547485bf4e5b71744b3db22c57a0930a4a73b99c859`

Keyval utility referenced by updater and network scripts; one of the persistent-state primitives below anacapad.


</details>

### `setmac`

The MAC-address assignment tool: programs the unit's network hardware address during manufacturing or recovery.

[Download](files/usr/sbin/setmac) · 65.7 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/usr/sbin/setmac`
- **Category:** binaries
- **Size:** 65.7 KB (67248 bytes)
- **SHA-256:** `fb3f727de446ffe5100c85b314eec2f19f037b15476aa189201e4ea9b7ea32c2`

Writes the device MAC; paired with mdputil's factory provisioning.


</details>

### `radartool`

The radar-detection tool: on 5 GHz bands the radio must listen for radar before transmitting, and this utility performs those checks. It exists on this build because the Playbar can master SonosNet on radar-controlled channels.

[Download](files/wifi/N/radartool) · 65.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/N/radartool`
- **Category:** binaries
- **Size:** 65.5 KB (67084 bytes)
- **SHA-256:** `93d9c6e54e9abe4a3769123d8cc42afcf79cc101d71ced4303b3fe5e0aad36b6`

DFS (radar) utility for the wifi/N modules; the dfs.ko module + this tool satisfy regulatory radar-detection requirements.


</details>

### `athconfig`

The Atheros radio configuration utility: low-level control of the WiFi chipset for modes like SonosNet mesh that the normal client stack does not handle.

[Download](files/wifi/athconfig) · 65.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/athconfig`
- **Category:** binaries
- **Size:** 65.6 KB (67208 bytes)
- **SHA-256:** `cde6b1233c354fc940b00b44678694ebe2956785373df54a7d6acec1a7e6f545`

Atheros-specific tool for the radio's mesh/AP modes (SonosNet operates through this layer).


</details>

### `netstartd`

The network-startup daemon: the sibling process that actually brings the network up, manages setup mode, and hands connection status back to the main program. When the speaker joins WiFi, this is the program doing the joining.

[Download](files/wifi/netstartd) · 257.9 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/netstartd`
- **Category:** binaries
- **Size:** 257.9 KB (264076 bytes)
- **SHA-256:** `9654a16c9b5c07c84131b574e216e7ba311be405c4a831e360a59d10ac35de7e`

ELF daemon; anacapad reaches it over /tmp/netstartd.ipc (the multi_daemon_boundary contract). It drives netconfig.sh and the flag files under /var/run.


</details>

### `sta-assoc`

A small association-status helper: used to check or report the radio's link state.

[View](files/wifi/sta-assoc) · [Download](files/wifi/sta-assoc) · 1.1 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 64 lines:

```
#!/bin/sh

usage() {
  echo "Usage: $(basename $0) <open|wpa> <ssid> ( <key> )"
  exit 1
}

a2h() {
    temp="$1"
    while test -n "$temp"; do
        c=`expr substr "$temp" 1 1`
        printf '%x' "'$c'"
        temp=`expr substr "$temp" 2 32`
    done
}


get_supp_conf() {

  mode="$1"
  ssid="$2"
  key="$3"

  ssid_hex=$(a2h "$ssid")

  case $mode in
    open)
      /wifi/athconfig stasetkeylen ath0 0
      echo "network={"
      echo "ssid=$ssid_hex"
      echo "scan_ssid=1"
      echo "key_mgmt=NONE"
      echo "priority=0"
      echo "}"
      ;;
    wpa)
      if [ -z "$key" ] ; then usage ; fi
      key_hex=$(a2h "$key")
      /wifi/athconfig stasetkeylen ath0 ${#key_hex}
      echo "network={"
      echo "ssid=$ssid_hex"
      echo "scan_ssid=1"
      echo "psk=$key_hex"
      echo "priority=0"
      echo "}"
      ;;
    *)
      usage ;;
  esac
}

if [ -z "$1" ] || [ -z "$2" ]; then
  usage
fi

killall wpa_supplicant > /dev/null 2>&1
get_supp_conf "$1" "$2" "$3" > /tmp/supplicant_conf.tmp

/wifi/wpa_supplicant -s -B -D sonos -i ath0 -b br0 -c /tmp/supplicant_conf.tmp

```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/sta-assoc`
- **Category:** binaries
- **Size:** 1.1 KB (1169 bytes)
- **SHA-256:** `a376a1f0774a09b3a642ce4626ccd335d81a52d9a527a21cb9cfd3d0c2c3267e`

Station-association utility tied to the Atheros stack and the assoctracker monitoring.


</details>

### `wacd`

The setup-mode daemon: the program that runs the temporary open network your phone joins during initial setup, where the player receives its first WiFi credentials.

[Download](files/wifi/wacd) · 65.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/wacd`
- **Category:** binaries
- **Size:** 65.6 KB (67128 bytes)
- **SHA-256:** `a51d696f54f86c637ceac00ee8d9e83b20e354fee7219a2de37f89b133570305`

Wireless-accessory-configuration daemon; the /var/run/wac_mode flag and WAC timeout are documented under wac_mode.


</details>

### `wpa_supplicant`

The WiFi client program: the standard open-source component that handles the actual handshake joining your home network. Practically every Linux WiFi device carries this.

[Download](files/wifi/wpa_supplicant) · 322.0 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/wpa_supplicant`
- **Category:** binaries
- **Size:** 322.0 KB (329684 bytes)
- **SHA-256:** `b3ed6402fc388bd7aa73919b1dd7828a011186d1e384fdb6487c7c85c9737ddf`

wpa_supplicant build for the Atheros radio; driven by configs like /var/run/htapsatwpa.conf and the jffs debug overrides.


</details>

### `wpaconfig`

A small helper used to generate or adjust WiFi client configuration for the supplicant.

[View](files/wifi/wpaconfig) · [Download](files/wifi/wpaconfig) · 2.2 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 85 lines:

```
#!/bin/sh

if [ "${#1}" -eq "0" ]; then
    echo "usage: ${0} <settings file> [wpa config file]"
    exit
fi

if [ "${#2}" -ne "0" ]; then
    WPACONFIG=${2}
else
    WPACONFIG=/var/run/wpa_supplicant.conf
fi

if [ -f /jffs/debug/wpa_proto ]; then
    WPAPROTO=`cat /jffs/debug/wpa_proto`
fi
if [ -f /jffs/debug/wpa_ptk ]; then
    WPAPTK=`cat /jffs/debug/wpa_ptk`
fi
if [ -f /jffs/debug/wpa_gtk ]; then
    WPAGTK=`cat /jffs/debug/wpa_gtk`
fi

echo "eapol_version=1"    >  ${WPACONFIG}
echo "ap_scan=1"          >> ${WPACONFIG}

print_entry()
{
    SSIDHEX=$1
    KEYHEX=$2

    if [ ${#KEYHEX} -gt "15" ] && [ ${#KEYHEX} -lt "129" ]; then
        echo "network={"              >> ${WPACONFIG}
        echo "ssid=${SSIDHEX}"        >> ${WPACONFIG}
        echo "scan_ssid=1"            >> ${WPACONFIG}
        echo "psk=${KEYHEX}"          >> ${WPACONFIG}
        if [ "${#WPAPROTO}" -ne "0" ];then
            echo "proto=${WPAPROTO}"  >> ${WPACONFIG}
        fi
        if [ "${#WPAPTK}" -ne "0" ];then
            echo "pairwise=${WPAPTK}" >> ${WPACONFIG}
        fi
        if [ "${#WPAGTK}" -ne "0" ];then
            echo "group=${WPAGTK}"    >> ${WPACONFIG}
        fi
        echo "priority=2"             >> ${WPACONFIG}
        echo "}"                      >> ${WPACONFIG}
    fi

    echo "network={"          >> ${WPACONFIG}
    echo "ssid=${SSIDHEX}"    >> ${WPACONFIG}
    echo "scan_ssid=1"        >> ${WPACONFIG}
    echo "key_mgmt=NONE"      >> ${WPACONFIG}
    echo "}"                  >> ${WPACONFIG}

    /wifi/athconfig stassidlistadd ath0 ${SSIDHEX} ${#KEYHEX}
}

/wifi/athconfig stassidlistclr ath0
/wifi/athconfig wossidclr ath0
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/wpaconfig`
- **Category:** binaries
- **Size:** 2.2 KB (2236 bytes)
- **SHA-256:** `883675c1177bd4ce329e34fe2a861dd0fbc64bac8288b17328e27f388eb082ac`

WPA config utility invoked by the netconfig script family.


</details>


## Shared libraries

Reusable code bundles the programs load at runtime. Each one provides a specialty, like playing a music format, encrypting a connection, or talking to a database, so the main program does not have to carry everything itself.

<details markdown="1"><summary><b>Technical details</b></summary>

Dynamically linked ELF shared objects under /lib and /usr/lib; includes Sonos-internal libsonos-* components plus bundled third-party libraries.

</details>

### `ld.so.1`

The dynamic loader itself: the very first piece of code that runs when any program starts, responsible for finding and linking all the shared libraries below.

[Download](files/lib/ld.so.1) · 197.3 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/ld.so.1`
- **Category:** libs
- **Size:** 197.3 KB (202084 bytes)
- **SHA-256:** `925663a234c829c93f0a154a888d475cd5f529d4e8bb78093052db73a0286484`

Runtime linker/loader (glibc ld.so); resolves every .so dependency at process start.


</details>

### `libanl.so.1`

A resolver helper for asynchronous name lookups, part of the standard C library family.

[Download](files/lib/libanl.so.1) · 65.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libanl.so.1`
- **Category:** libs
- **Size:** 65.6 KB (67216 bytes)
- **SHA-256:** `bf44349ff423df018391a8c8c33717e3b43bcb82f3e710f7a69ced43276ff374`

glibc async DNS stub resolver library.


</details>

### `libatomic.so.1`

Provides atomic operations for code that needs to update shared values safely across threads.

[Download](files/lib/libatomic.so.1) · 65.3 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libatomic.so.1`
- **Category:** libs
- **Size:** 65.3 KB (66888 bytes)
- **SHA-256:** `936d09871114ec00675d9dca65d9ee65602f8cfff561a9d1600f2f0951765d8e`

GCC runtime for atomic builtins used by the C++ concurrency primitives.


</details>

### `libavcodec.so.59`

One of the FFmpeg libraries: provides the codecs that decode compressed audio formats the speaker receives.

[Download](files/lib/libavcodec.so.59) · 513.8 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libavcodec.so.59`
- **Category:** libs
- **Size:** 513.8 KB (526112 bytes)
- **SHA-256:** `b76beb0d832bcd54646196e33459fb06ef16e15b71fbd6619d68f95d87fb3772`

FFmpeg codec library (avcodec 59); backs part of the decode layer alongside the dedicated decoders.


</details>

### `libavformat.so.59`

The FFmpeg container-format library: understands the file and stream wrappers that audio arrives in, like MP4 or streaming containers.

[Download](files/lib/libavformat.so.59) · 321.7 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libavformat.so.59`
- **Category:** libs
- **Size:** 321.7 KB (329396 bytes)
- **SHA-256:** `8fdf976dca64b38bc36953b83b1ebd21962d1aecc5b3861232c26c4a1ab7d778`

FFmpeg demuxer library; parses container formats for the audio pipeline.


</details>

### `libavutil.so.57`

The FFmpeg utility foundation: shared helpers the other FFmpeg libraries use for buffers, math, and data structures.

[Download](files/lib/libavutil.so.57) · 770.2 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libavutil.so.57`
- **Category:** libs
- **Size:** 770.2 KB (788656 bytes)
- **SHA-256:** `c5410f65833a122f6d03945554ab28150085733e8091179ad25c85318d99a082`

FFmpeg utility library (libavutil 57).


</details>

### `libc.so.6`

The core C library: the basic building blocks every program uses, from memory and strings to files and sockets. The single most fundamental library on the device.

[Download](files/lib/libc.so.6) · 1.5 MB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libc.so.6`
- **Category:** libs
- **Size:** 1.5 MB (1593260 bytes)
- **SHA-256:** `68480e345dae7c02b16cce5797c23f7205baf08e0b491e11c34eccaae4121c74`

glibc 6; the platform C runtime.


</details>

### `libcrypt.so.1`

The password-hashing library: implements the cryptographic hashing used for account passwords in the shadow file.

[Download](files/lib/libcrypt.so.1) · 65.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libcrypt.so.1`
- **Category:** libs
- **Size:** 65.6 KB (67152 bytes)
- **SHA-256:** `6045bf5a663a0b035f0dde6fb858ecb01b53215ee81ad27411d1d799db5bf39d`

libcrypt with MD5-crypt ($1$) and friends; the format etc/shadow uses.


</details>

### `libdcadec.so.0`

The DTS decoder: handles the DTS surround format that some TVs and discs send instead of Dolby. Its presence is a Playbar-specific feature; smaller speakers do not ship it.

[Download](files/lib/libdcadec.so.0) · 385.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libdcadec.so.0`
- **Category:** libs
- **Size:** 385.6 KB (394888 bytes)
- **SHA-256:** `4bd12f82476b9b10cd5ae7007143f7207923bb85f98b465a61426b28c906b50d`

DTS decode library (dcadec); an m9-only component flagged in the firmware-differences page.


</details>

### `libdl.so.2`

The dynamic-loading helper: lets programs open extra shared libraries on demand after they have already started.

[Download](files/lib/libdl.so.2) · 65.7 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libdl.so.2`
- **Category:** libs
- **Size:** 65.7 KB (67268 bytes)
- **SHA-256:** `4af444ffc67a8ce5e9a7c69b6890a9a28de563c97ccd083020be98213d332faf`

glibc dlopen/dlsym stubs.


</details>

### `libdns_sd.so.1`

The service-discovery client library: the piece programs use to announce and find services on the local network.

[Download](files/lib/libdns_sd.so.1) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libdns_sd.so.1`
- **Category:** libs
- **Size:** 65.4 KB (66968 bytes)
- **SHA-256:** `7f0c4057b48f02e4586370837b83148c62eea8951a06562c2bcf2234d5a4bf33`

DNS-SD client library backing the mDNS/discovery layer.


</details>

### `libflash.so.1`

The flash-memory library: safe read/write access to the device's flash storage, used by the updater and the factory-data tooling.

[Download](files/lib/libflash.so.1) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libflash.so.1`
- **Category:** libs
- **Size:** 65.4 KB (67016 bytes)
- **SHA-256:** `454a6c5e2bde42f0f6fa64854dc738a3d1b4731a99f4af6c9272576ca2ff641d`

Sonos flash/NCD access library; backs mdputil and the device-payload handling.


</details>

### `libgcc_s.so.1`

A small GCC support runtime providing helpers the compiler emits calls into, like long-division on hardware that lacks the instruction.

[Download](files/lib/libgcc_s.so.1) · 129.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libgcc_s.so.1`
- **Category:** libs
- **Size:** 129.5 KB (132564 bytes)
- **SHA-256:** `3210e9d6b8605e995224f9f65cd1eb2a09edd67d2b690198059184d785450ae2`

GCC shared runtime support library.


</details>

### `libhwmessagelib.so.1`

Sonos's hardware-message library: the shared code for sending events between the kernel drivers and the programs, covering things like button presses and jacks.

[Download](files/lib/libhwmessagelib.so.1) · 65.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libhwmessagelib.so.1`
- **Category:** libs
- **Size:** 65.5 KB (67068 bytes)
- **SHA-256:** `f9a8118a37378555d5e0015135c53db84119f4cda90b4ac5eab95c411c58e1c4`

Sonos-internal lib; backs hwmessagelib/hw_input_events.


</details>

### `libm.so.6`

The math library: floating-point and transcendental functions used by audio processing and anything else that computes.

[Download](files/lib/libm.so.6) · 1.1 MB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libm.so.6`
- **Category:** libs
- **Size:** 1.1 MB (1196608 bytes)
- **SHA-256:** `b50c76409e06d9d4d44318a5ef80acebe3bb20e99f28946a31419c51fa782363`

glibc math library.


</details>

### `libmbedcrypto.so.16`

The cryptographic primitives library: the raw math for encryption, hashing, and signing that the TLS layer builds on.

[Download](files/lib/libmbedcrypto.so.16) · 385.7 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libmbedcrypto.so.16`
- **Category:** libs
- **Size:** 385.7 KB (394952 bytes)
- **SHA-256:** `a1963eed20b9837f13c0d8620ec78508e3a096174d799ca3556dea9988bdb866`

mbedTLS crypto core; underpins the secure channels (lechmere, TLS to music services, cert verification).


</details>

### `libmbedtls.so.21`

The secure-connection library: implements the encrypted protocol behind every https and secure-socket conversation the speaker has, from cloud calls to music services.

[Download](files/lib/libmbedtls.so.21) · 129.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libmbedtls.so.21`
- **Category:** libs
- **Size:** 129.5 KB (132560 bytes)
- **SHA-256:** `c61d42e59c107c5a8bf9d01358322d2cef656e890e3c46141cc4ae3599694cde`

mbedTLS TLS implementation; the tls_stack entry documents the layer built on it.


</details>

### `libmbedx509.so.7`

The certificate-parsing library: understands the format of digital certificates so the device can verify who it is talking to.

[Download](files/lib/libmbedx509.so.7) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libmbedx509.so.7`
- **Category:** libs
- **Size:** 65.4 KB (66976 bytes)
- **SHA-256:** `730be3bbb923833a5fdb17c4bd65b0eb16a96ab962f12276492bab287016b437`

mbedTLS X.509 parser; used with libsonos-certval for device identity.


</details>

### `libmpg123.so.0`

The MP3 decoder library: fast, mature MPEG-audio decoding for one of the oldest formats the player accepts.

[Download](files/lib/libmpg123.so.0) · 194.0 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libmpg123.so.0`
- **Category:** libs
- **Size:** 194.0 KB (198636 bytes)
- **SHA-256:** `18566d9f255bcbd5d41ec649738c5a7b1e06180458fcb97eebbdc51f2c362fda`

mpg123 decode library.


</details>

### `libnl-3.so.200`

The netlink library: how userspace programs talk to the kernel's networking subsystem for things like interface and route events.

[Download](files/lib/libnl-3.so.200) · 129.9 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libnl-3.so.200`
- **Category:** libs
- **Size:** 129.9 KB (132980 bytes)
- **SHA-256:** `7860c4c6239085ecab4c42092796f9e58b4da6788c5509a1001eeb8863361e35`

netlink-3 core library.


</details>

### `libnl-genl-3.so.200`

The generic-netlink extension: the modern netlink flavor used for wireless and other kernel subsystems.

[Download](files/lib/libnl-genl-3.so.200) · 66.0 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libnl-genl-3.so.200`
- **Category:** libs
- **Size:** 66.0 KB (67584 bytes)
- **SHA-256:** `a757566c04cebbb4db3d4b435d6de7cbb5506a4238722a3e92f26cb6cc540104`

netlink-3 generic library; consumed by WiFi tooling.


</details>

### `libnss_dns.so.2`

The DNS name-service module: the piece that actually performs name lookups when a program asks for a hostname's address.

[Download](files/lib/libnss_dns.so.2) · 65.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libnss_dns.so.2`
- **Category:** libs
- **Size:** 65.5 KB (67060 bytes)
- **SHA-256:** `dbd9e2ce0f5805dfabdcbcf41068d44b2c23e0ec9160db8e9123b02a434f288a`

glibc NSS DNS plugin loaded per nsswitch.conf.


</details>

### `libnss_files.so.2`

The file-based name-service module: answers lookups from flat files like hosts and passwd before the network is consulted.

[Download](files/lib/libnss_files.so.2) · 65.7 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libnss_files.so.2`
- **Category:** libs
- **Size:** 65.7 KB (67228 bytes)
- **SHA-256:** `0dacf4f54ea6e3bf02dd6839aa0e15686220c9860e78e69d34d33b112c4a3a4b`

glibc NSS files plugin.


</details>

### `libpcap.so.1`

The packet-capture library: the standard API for sniffing network traffic, backing the pcap diagnostic tool.

[Download](files/lib/libpcap.so.1) · 260.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libpcap.so.1`
- **Category:** libs
- **Size:** 260.5 KB (266780 bytes)
- **SHA-256:** `a41237fb615ad5af53c1fbfa8a853b0d17d0be44a6aae177a68188eddf9785f6`

libpcap; used by bin/pcap for diagnostic captures.


</details>

### `libprotobuf-nanopb.so.0`

A small protocol-buffers implementation for structured data: the lightweight serialization used in the embedded plumbing.

[Download](files/lib/libprotobuf-nanopb.so.0) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libprotobuf-nanopb.so.0`
- **Category:** libs
- **Size:** 65.4 KB (66976 bytes)
- **SHA-256:** `5cf58557c28f238743c16c45ca6aa69f473abf75e6b12674426932162dea48a3`

nanopb protobuf runtime; pairs with the decoded protobuf descriptor set documented under protobuf_descriptors.


</details>

### `libpthread.so.0`

The threading library: lets programs run many things at once, which a speaker needs constantly for playback, networking, and control at the same time.

[Download](files/lib/libpthread.so.0) · 131.1 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libpthread.so.0`
- **Category:** libs
- **Size:** 131.1 KB (134284 bytes)
- **SHA-256:** `a7e61be7e6fc906d4a8ae1b241c02fedca47c5aac4d3161b4e3687e43d06fec1`

glibc POSIX threads.


</details>

### `libresolv.so.2`

The resolver library: full DNS query machinery beyond the simple name lookups.

[Download](files/lib/libresolv.so.2) · 130.2 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libresolv.so.2`
- **Category:** libs
- **Size:** 130.2 KB (133324 bytes)
- **SHA-256:** `36bd8c24be52922455395f6399ac6d02cb5d7b03ba1d1d797be7c33d9a7117a3`

glibc resolver library.


</details>

### `libsbc.so.1`

The Bluetooth audio codec library: decodes the standard Bluetooth audio format on products that ship a Bluetooth radio. It is present here because the codebase is shared across models.

[Download](files/lib/libsbc.so.1) · 129.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsbc.so.1`
- **Category:** libs
- **Size:** 129.5 KB (132612 bytes)
- **SHA-256:** `a1a5998d4a6d6a6563185296da0515997cede5d88449419bbc150fbfedca6c9a`

SBC codec library; dormant on this wired-only Playbar (documented under bt_sbc).


</details>

### `libsmb2.so.1`

The Windows file-sharing client library: the component that lets the speaker mount and read music stored on computers and NAS drives.

[Download](files/lib/libsmb2.so.1) · 193.9 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsmb2.so.1`
- **Category:** libs
- **Size:** 193.9 KB (198556 bytes)
- **SHA-256:** `ba823cc96747f662227885c14134a735f24d1338d6c53b659816468a7ec0805a`

SMB2 client library backing the smb/mntmgr music-share machinery.


</details>

### `libsonos-certval.so.2`

The device-certificate verifier: Sonos's own library for checking that a presented certificate chains back to a trusted Sonos root. It is what 'a genuine Sonos device' means in code.

[Download](files/lib/libsonos-certval.so.2) · 1.6 MB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsonos-certval.so.2`
- **Category:** libs
- **Size:** 1.6 MB (1706972 bytes)
- **SHA-256:** `6a3aaba84eea36d6ea0fafbcce1321199958950a62d4a8ded483fc796fa4f230`

Sonos-internal cert validation library; manages the RCB bundles including /etc/fallback_trusted_roots.rcb (see libsonos_certval).


</details>

### `libsonos-mdp.so.1`

The manufacturing-data library: reads and writes the factory data block carrying serial number, MAC, and per-unit calibration values.

[Download](files/lib/libsonos-mdp.so.1) · 65.3 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsonos-mdp.so.1`
- **Category:** libs
- **Size:** 65.3 KB (66888 bytes)
- **SHA-256:** `919a36bec2cd00aaa31efefff2b0cf7d4ba3247d63f1ac88f5739a6a630b628c`

Sonos-internal MDP library behind mdputil and the device-payload.bin template.


</details>

### `libsonos-root-cert-bundle.so.2`

The packaged root-cert bundle: the primary set of trust anchors for secure connections, shipped as its own updatable library.

[Download](files/lib/libsonos-root-cert-bundle.so.2) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsonos-root-cert-bundle.so.2`
- **Category:** libs
- **Size:** 65.4 KB (66984 bytes)
- **SHA-256:** `4cd8ae0486d1d68f01e25408f98b572b6e55ae41f77912d8adaeae812f9803a6`

Sonos cert-bundle carrier; its runtime-update path is documented under libsonos_certval/rcb_bundle_format.


</details>

### `libsonos-time-c.so.1`

Sonos's own time library: the company's shared clock code that the sync machinery builds on.

[Download](files/lib/libsonos-time-c.so.1) · 65.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsonos-time-c.so.1`
- **Category:** libs
- **Size:** 65.5 KB (67116 bytes)
- **SHA-256:** `c3b34b1a671da66b2e61f8cb2c6bf47991d6f9c0777fd726f06e71b2666c1325`

Sonos-internal time library feeding the sntp/time-sync layer.


</details>

### `libsonoscrypto.so.3`

Sonos's cryptographic wrapper: the company's own layer on top of the base crypto, used for signing and key handling across the household protocols.

[Download](files/lib/libsonoscrypto.so.3) · 65.7 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsonoscrypto.so.3`
- **Category:** libs
- **Size:** 65.7 KB (67316 bytes)
- **SHA-256:** `7ba2531b9c5921e414af50404e202d5ad0f3f015214d8f2578355fb6ea69f681`

Sonos-internal crypto utility library; the PSK hierarchy entries describe what it protects.


</details>

### `libsonoseventreporter.so.1`

The event-reporting library: the shared machinery for packaging and shipping telemetry and diagnostic events up to Sonos.

[Download](files/lib/libsonoseventreporter.so.1) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsonoseventreporter.so.1`
- **Category:** libs
- **Size:** 65.4 KB (66984 bytes)
- **SHA-256:** `e0f4b82d2d4d85a1d53eafb0d0e02cf3172f8d2f279f4990f453a9c96b8684f5`

Sonos-internal reporter library; part of the telemetry/reporting pipeline.


</details>

### `libsonosminiutils.so.1`

A grab-bag Sonos utility library: small shared helpers the daemons and tools reuse.

[Download](files/lib/libsonosminiutils.so.1) · 65.9 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsonosminiutils.so.1`
- **Category:** libs
- **Size:** 65.9 KB (67500 bytes)
- **SHA-256:** `94c1afdcdff05f2696a13878de75d209f36c6086938059d501f91c68af81a192`

Sonos-internal utility library.


</details>

### `libsonossbcpacket.so.1`

The Sonos channel-protocol packet library: framing for the proprietary audio-distribution protocol that keeps grouped players in sync.

[Download](files/lib/libsonossbcpacket.so.1) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsonossbcpacket.so.1`
- **Category:** libs
- **Size:** 65.4 KB (66976 bytes)
- **SHA-256:** `64fa1ab7469501d0e8cc43b882b4b3dbb3fef287a90921a6bf98249a959e8dee`

Sonos-internal packet library for the chsrc/chsnk group-audio channel (see native_protocols).


</details>

### `libsonossyslog.so.1`

Sonos's logging glue: the internal library that routes messages into the per-subsystem log files.

[Download](files/lib/libsonossyslog.so.1) · 65.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsonossyslog.so.1`
- **Category:** libs
- **Size:** 65.5 KB (67056 bytes)
- **SHA-256:** `d329c65f3724229a9303f9b9b0db3f2c61a1c7178db44b69dfd0da575c931cec`

Sonos-internal syslog/log plumbing tied to the log_domains machinery.


</details>

### `libsonosutils.so.1`

Sonos's general utility library: the shared toolbox of helpers used across the daemons, from containers to string handling.

[Download](files/lib/libsonosutils.so.1) · 65.8 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsonosutils.so.1`
- **Category:** libs
- **Size:** 65.8 KB (67388 bytes)
- **SHA-256:** `c8c1c75905f955c5d7c9759171a7f7e207930a18bb62f3e8c2444fb9fda622de`

Sonos-internal general-purpose library.


</details>

### `libsqlite3.so.0`

The embedded database library: a whole SQL database engine in one file, used for structured stores like the timer and alarm records.

[Download](files/lib/libsqlite3.so.0) · 904.9 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsqlite3.so.0`
- **Category:** libs
- **Size:** 904.9 KB (926600 bytes)
- **SHA-256:** `3a96ea0afd93227345d6d8e6155e13440eb0a4d2ae2968d215755a5cee73a795`

SQLite3; the embedded_sqlite entry documents its use (timer.db prepared statements and friends).


</details>

### `libsyslib_hal.so.1`

The hardware-abstraction library: gives programs a uniform way to talk to the board's LEDs, buttons, and sensors without caring about the exact chips.

[Download](files/lib/libsyslib_hal.so.1) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libsyslib_hal.so.1`
- **Category:** libs
- **Size:** 65.4 KB (66972 bytes)
- **SHA-256:** `3f1fc46c69ee388ef4783910c9d5dc15e09997c7d3e609fd14762184017eb628`

Sonos hardware-abstraction library sitting above the kernel modules.


</details>

### `libthread_db.so.1`

A debugger-support library: helps tools like gdb understand a program's threads. Harmless plumbing that ships with the toolchain.

[Download](files/lib/libthread_db.so.1) · 66.1 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libthread_db.so.1`
- **Category:** libs
- **Size:** 66.1 KB (67680 bytes)
- **SHA-256:** `e8be7d7c581e0d939c54812d6ddaf1be4c146303034b97b055b03209794f4840`

glibc thread-debug helper (gdb support).


</details>

### `libtomlc99.so.1`

The config-file parser library: reads the TOML format used by the logger configs and other modern config files in the image.

[Download](files/lib/libtomlc99.so.1) · 65.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libtomlc99.so.1`
- **Category:** libs
- **Size:** 65.5 KB (67052 bytes)
- **SHA-256:** `9e2650c723f9b70b9a05a495588ecf75b90ea1a263746201af9af49236d94223`

tomlc99 parser; backs the *_logger.toml files and limelight.toml-style configs (see toml_config).


</details>

### `libutil.so.1`

A small utility library with terminal and process helpers from the C library family.

[Download](files/lib/libutil.so.1) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libutil.so.1`
- **Category:** libs
- **Size:** 65.4 KB (67004 bytes)
- **SHA-256:** `9c933e83204eb337114efeed4e6beefa6869e9e9f7c19282492e3f6974e53fbf`

glibc libutil (pty/login helpers).


</details>

### `libuuid.so.1`

The unique-ID library: generates and parses the long identifier strings the system uses everywhere for devices, groups, and accounts.

[Download](files/lib/libuuid.so.1) · 65.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libuuid.so.1`
- **Category:** libs
- **Size:** 65.6 KB (67184 bytes)
- **SHA-256:** `a179176cfee5b04bd400183110013ec12372db62432a99d3127052fb6abdc8e7`

libuuid; produces the RINCON_-style UUIDs documented under rincon_uuid.


</details>

### `libwifi.so.1`

The wireless support library: a shared layer for controlling and querying the WiFi hardware, used by the network daemons.

[Download](files/lib/libwifi.so.1) · 65.4 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libwifi.so.1`
- **Category:** libs
- **Size:** 65.4 KB (66964 bytes)
- **SHA-256:** `911d6f28bd36442832a749e7a3c066939de53a2d8044cc9216d0668df9a506ef`

WiFi utility library for the Atheros stack (wifi_hal).


</details>

### `libz.so.1`

The compression library: the classic zlib, used anywhere data gets squeezed or unpacked, from saved files to network payloads.

[Download](files/lib/libz.so.1) · 129.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/lib/libz.so.1`
- **Category:** libs
- **Size:** 129.6 KB (132740 bytes)
- **SHA-256:** `510c0897069e9837bb3af133f2d95ec2e752773ea7c13e5d0fe8f45bb3250e04`

zlib; the iocompress queue/state compression wraps it.


</details>

### `libcap.so.2`

The capabilities library: manages the fine-grained Linux privilege bits that let a program keep only the powers it needs instead of running fully as root.

[Download](files/usr/lib/libcap.so.2) · 65.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/usr/lib/libcap.so.2`
- **Category:** libs
- **Size:** 65.6 KB (67196 bytes)
- **SHA-256:** `b4b2bd747773e10fda5f2d0fa3f47b17a4bb46c6d5b42acba0c486332bd0b0ec`

libcap; supports the capability keep-set on the anacapad launch line.


</details>


## Kernel modules

Drivers that plug into the Linux kernel at boot: the audio hardware driver, the infrared receiver, the watchdog, and the WiFi chipset modules. They are the lowest software layer, sitting between the operating system and the physical chips.

<details markdown="1"><summary><b>Technical details</b></summary>

Loadable kernel objects under /modules and /wifi (Atheros driver family for the SonosNet-capable radio stack).

</details>

### `audiodev.ko`

The audio device driver: the kernel module that exposes the sound hardware to the programs above, carrying the actual digital audio to the amplifiers.

[Download](files/modules/audiodev.ko) · 142.9 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/modules/audiodev.ko`
- **Category:** modules
- **Size:** 142.9 KB (146328 bytes)
- **SHA-256:** `65bb803d74054376cad1f9305696ad0df921763981c3071fb10c70cfbf138ba4`

Core audio driver; the lla and tdm_driver entries document the interface layered on it.


</details>

### `chk.ko`

The hardware-check module: a small kernel piece the system uses to verify board identity and hardware health.

[Download](files/modules/chk.ko) · 4.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/modules/chk.ko`
- **Category:** modules
- **Size:** 4.6 KB (4736 bytes)
- **SHA-256:** `f099055a15c41e29074bd0855c3c0add5f30d23df2a5d7c14f172bc3df00978e`

Board-check module; its device node (/dev/chk) appears in the updater's sibling-binary inventory.


</details>

### `hwevent_queue.ko`

The hardware-event queue: delivers physical events like button presses and jack insertions from the kernel up to the programs that handle them.

[Download](files/modules/hwevent_queue.ko) · 17.2 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/modules/hwevent_queue.ko`
- **Category:** modules
- **Size:** 17.2 KB (17596 bytes)
- **SHA-256:** `b569eb24c4d5591dd4874e2ca99b6c8109465eb442e7484c79cf08bfbe5eb2ea`

Kernel queue feeding hw_input_events / hwmessagelib, the layer that turns physical presses into internal messages.


</details>

### `ir_rcvr.ko`

The infrared receiver driver: the kernel piece that captures remote-control signals from the IR sensor on models that have one, like the Playbar.

[Download](files/modules/ir_rcvr.ko) · 7.8 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/modules/ir_rcvr.ko`
- **Category:** modules
- **Size:** 7.8 KB (7948 bytes)
- **SHA-256:** `467aaf41cc857a0109c1b4d124a9031c291188f238fc1f93917118f21ccff715`

IR receiver driver feeding /opt/ir config and the ir_decoder/ir_learn machinery. Absent on models without an IR sensor (a documented m8-vs-m9 difference).


</details>

### `sonos_device.ko`

The Sonos board-support module: kernel glue for the custom hardware bits specific to the player.

[Download](files/modules/sonos_device.ko) · 3.6 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/modules/sonos_device.ko`
- **Category:** modules
- **Size:** 3.6 KB (3640 bytes)
- **SHA-256:** `c5047d17c5bf529db12a3009b21c6f432d0fd51fb47f1949e83ba6bdacb2a571`

Board-support kernel module for the limelight platform.


</details>

### `adf.ko`

A lower-level Atheros driver framework module the WiFi stack loads beneath the main radio driver.

[Download](files/wifi/N/adf.ko) · 24.2 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/N/adf.ko`
- **Category:** modules
- **Size:** 24.2 KB (24776 bytes)
- **SHA-256:** `7a137d22cbc1cf94d2eabe2aa093867b11d8cddb75f14aa133c6fa5f23ea4705`

Atheros Driver Framework layer for the wifi/N radio build.


</details>

### `asf.ko`

Another Atheros support layer in the WiFi stack, handling shared services the radio driver relies on.

[Download](files/wifi/N/asf.ko) · 12.8 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/N/asf.ko`
- **Category:** modules
- **Size:** 12.8 KB (13124 bytes)
- **SHA-256:** `537acdbc2de81b9c75f3aed2849ad37ebaa3768c78a8671554ae4f1e0b734bf1`

Atheros Service Framework layer for the wifi/N radio build.


</details>

### `ath_driver.ko`

The main WiFi radio driver: the kernel module that actually talks to the Atheros wireless chip and does the work of joining networks and carrying traffic.

[Download](files/wifi/N/ath_driver.ko) · 353.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/N/ath_driver.ko`
- **Category:** modules
- **Size:** 353.5 KB (362008 bytes)
- **SHA-256:** `13e8c2658306cb55464fc942fb01d9be49b9ec53f62518367812b36454e43778`

Primary ath driver for the Atheros-based radio in this generation of hardware.


</details>

### `ath_hal.ko`

The radio's hardware-abstraction module: the closed-off layer between the open driver and the actual radio silicon.

[Download](files/wifi/N/ath_hal.ko) · 341.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/N/ath_hal.ko`
- **Category:** modules
- **Size:** 341.5 KB (349744 bytes)
- **SHA-256:** `bf6fa38237599dc0c7551eb8c8dd850874dc922b3db907f8bfaede36f8d9f3db`

Atheros HAL (hardware abstraction layer), the proprietary core of the driver stack.


</details>

### `dfs.ko`

The radar-detection module: watches for radar on restricted WiFi channels so the speaker can legally operate on them, part of the 5 GHz regulatory machinery.

[Download](files/wifi/N/dfs.ko) · 56.7 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/N/dfs.ko`
- **Category:** modules
- **Size:** 56.7 KB (58024 bytes)
- **SHA-256:** `7721e59669177601410ee881d03d935ddc7b33edb6ece2c618bce130773debd1`

DFS (Dynamic Frequency Selection) module; pairs with the radartool utility.


</details>

### `bridge.ko`

The network-bridge module: lets the speaker bridge wired and wireless interfaces so SonosNet members can share a connection.

[Download](files/wifi/bridge.ko) · 76.2 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/wifi/bridge.ko`
- **Category:** modules
- **Size:** 76.2 KB (78056 bytes)
- **SHA-256:** `1f738329dd9016b52f1872a5fde659ca2291fca638253adc94024fb52215252a`

Kernel bridge support used by brctl in the SonosNet topology.


</details>


## Diagnostics web pages

The raw ingredients of the speaker's hidden status website: JavaScript and HTML pages you can reach in a browser at the player's address. Sonos support and engineers use these pages to inspect a player; this is what the site actually is under the hood.

<details markdown="1"><summary><b>Technical details</b></summary>

Static assets served by the embedded web server from /opt/htdocs and the locked variant /opt/htdocs_locked (gated DSP console pages).

</details>

### `perfcounters.js`

The JavaScript behind the performance-counters status page: it fetches the counter data from the speaker and draws it in your browser when you visit the diagnostics site.

[View](files/opt/htdocs/perfcounters.js) · [Download](files/opt/htdocs/perfcounters.js) · 9.0 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 218 lines:

```
/// Copyright (c) 2023, Sonos, Inc.  All rights reserved.

let perfcounter = {
    // entry function which actually generates two top level elements:
    // a <header> for the title and miscellaneous metadata and a <table> for the actual data

    generateTableForEach: function (id, counters) 
    {
        //clear old
        let div = document.getElementById(id);
        div.innerHTML = '';

        const captionText = document.createTextNode('Hover over each column header for a detailed description');
        div.appendChild(captionText);

        counters.forEach(counter => {
            this.generateTable(id, counter);
        });
    },

    generateTable: function (id, perfcounter) 
    {
        const div = document.getElementById(id);

        this.generateTableMetadata(perfcounter, div);

        const table = document.createElement('table');
        table.classList.add("purple");

        this.generateTableHeader(table, perfcounter);
        this.generateTableBody(table, perfcounter);
        div.appendChild(table);
    },

    // display the title and list metadata values (besides the counter metadata which is rendered as tooltips)
    generateTableMetadata: function (perfcounter, div)
    {
        const header = document.createElement('header');
        const heading = document.createElement('h2');
        const headingText = document.createTextNode(perfcounter.table);
        heading.appendChild(headingText);
        header.appendChild(heading);
        div.appendChild(header);

        // process the non-counters metadata
        const noncountersList = document.createElement('ul');

        const keys = Object.keys(perfcounter.metadata);
        for (const key of keys) {
            if (key != 'counters') {
                noncountersList.appendChild(this.createMetadataListItem(key, perfcounter.metadata[key]));
            }
        }

        div.appendChild(noncountersList);

        if (!perfcounter.metadata.counters.length) {
            heading.textContent += ' contains no counters';
        }
    },
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/perfcounters.js`
- **Category:** webui
- **Size:** 9.0 KB (9230 bytes)
- **SHA-256:** `ac4fb0d72fa0a4dfffcd4921e0461cb14018ab929841d18028bc0c89b52efaff`

Client-side script for the perf-counter status page; pairs with the perf_counters schema documented on the subsystems page.


</details>

### `review.js`

The script for a review-style page in the built-in web UI, working with the matching stylesheet file.

[View](files/opt/htdocs/review.js) · [Download](files/opt/htdocs/review.js) · 15.5 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 448 lines:

```
function trimAll( strValue ) {
 var objRegExp = /^(\s*)$/;

    //check for all spaces
    if(objRegExp.test(strValue)) {
       strValue = strValue.replace(objRegExp, '');
       if( strValue.length == 0)
          return strValue;
    }

   //check for leading & trailing spaces
   objRegExp = /^(\s*)([\W\w]*)(\b\s*$)/;
   if(objRegExp.test(strValue)) {
       //remove leading and trailing whitespace characters
       strValue = strValue.replace(objRegExp, '$2');
    }
  return strValue;
}

var strengthData = new Array();
var macAddrs = new Array();
var macAddrsToZoneNames = new Array();
	
function finishDrawTable(tbodyID) {
    var th, tr, td, txt, br;
	var zp,nf,ofdm;
    tbody = document.getElementById(tbodyID);
    // create holder for accumulated tbody elements and text nodes
    var frag = document.createDocumentFragment();
    //
    // Make column headings
    //
    tr = document.createElement("tr");
    th = document.createElement("th"); tr.appendChild(th);
    for (var i = 0; i < macAddrs.length; i++) {
	if(macAddrs[i] != "eth0" && macAddrs[i] != "eth1")
	{
        th = document.createElement("th");
	txt = document.createTextNode("Strength to"); th.appendChild(txt);
	br = document.createElement("br"); th.appendChild(br);
        txt = document.createTextNode(macAddrs[i]); th.appendChild(txt);
	br = document.createElement("br"); th.appendChild(br);
        txt = document.createTextNode(macAddrsToZoneNames[macAddrs[i]]); th.appendChild(txt);
	tr.appendChild(th);
	}
    }
    frag.appendChild(tr);
    //
    // loop through data source
    //
    for (var i = 0; i < strengthData.length; i++) {
        var sd = strengthData[i];
    	tr = document.createElement("tr");
    	
    	td = document.createElement("td");
    	td.setAttribute("class", "ctr");

    	txt = document.createTextNode(sd.macAddr); td.appendChild(txt);
        br = document.createElement("br"); td.appendChild(br);

```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/review.js`
- **Category:** webui
- **Size:** 15.5 KB (15822 bytes)
- **SHA-256:** `58300bba90ff52b053921a08e494df9d839bb747a08fbe701ecfbbf99ce6b710`

Companion to xml/review.xsl for the status site's review page.


</details>

### `configDSP.css`

The stylesheet for the DSP console page.

[View](files/opt/htdocs_locked/dsp/configDSP.css) · [Download](files/opt/htdocs_locked/dsp/configDSP.css) · 5.8 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 282 lines:

```
body {
	font-family: "Helvetica Neue", Arial, Helvetica, Geneva, sans-serif;
	background-color: #ebf0f6;
}

h1 {
	color: #4f555c;
	margin-left: 25px;
	font-weight: bold;
	font-size: 2.5em;
}

#message {
	font-size: 1em;
	margin: 0;
	padding: 5px 10px;
	background-color: #fcda78;
	border: 1px solid #d0b463;
	display: inline;
	line-height: 1.75em;
}

#cant_load_warning {
	font-size: 1.0em;
	color: #ececec;
	padding: 25px;
	background-color: #d3050a;
	font-weight: bold;
	text-align: center;
}
#cant_load_warning h2 {
	font-size: 1.5em;
}
#cant_load_warning a {
	color: #fdf73a;
}

#ab_control {
    border: 1px solid black;
    background-color: #c8c8c8;
	padding: 4px 8px;
	position: fixed;
	right: 15px;
	top: 15px;
}
#ab_control:hover {
	background-color: #9c9c9c;
}
#ab_control:active {
	background-color: #898989;
}

#AB_indicator {
	font-size: 6em;
	font-weight: bold;
	text-align: center;
}

#import_export {
	position: fixed;
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs_locked/dsp/configDSP.css`
- **Category:** webui
- **Size:** 5.8 KB (5958 bytes)
- **SHA-256:** `e0f5761e73fd0e00e15400ca5a285b0303576457c1f5e35b67d9ded25cb51780`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


</details>

### `configDSP.htm`

The HTML shell of the hidden DSP console: a gated page in the diagnostics site that exposes the audio-processing knobs, meant for engineering rather than daily use.

[View](files/opt/htdocs_locked/dsp/configDSP.htm) · [Download](files/opt/htdocs_locked/dsp/configDSP.htm) · 1.7 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 46 of 46 lines:

```
<html>
<head>
  <title>Config DSP</title>
  <script type="text/javascript" src="configDSP.js"></script>
  <link rel="stylesheet" type="text/css" href="configDSP.css" />
</head>
<body onload=" onPageLoad();">
  <div id="export_overlay" onclick="exportOverlayOff()">
    <div id="export_table_div" style="padding:20px">Exported Blocks:<br>
      <table id="export_table">
      </table>
    </div>
  </div>
  <div id="ab_control" onclick="toggleAB();">
    <div id="toggle_button">Toggle A/B</div>
    <div id="AB_indicator"> </div>
  </div>
  <div id="import_export">
    <span id="import_export_title" onclick="toggleImportExport();">Import/Export</span>
    <div id="import_export_body" style="display:none;">
      <div class="section">
        <div style="width: 50%; float:center">
          <button class="button" onclick="onExport();" >Export</button>
        </div>
        <div style="width: 50%; float:center; padding-top: 10px;">
          <button class="button" onclick="onExportSelectedBlocks();">Export Selected Blocks
          </button>
        </div>
      </div>
      <div class="section">
        Import Presets:
        <input type="file" id="fileInput"/>
        <div id="import_form" style="display:none;">
        </div>
      </div>
    </div>
  </div>
  <h1>DSP System (Version: 0.25.3)</h1>
  <div id="cant_load_warning"><h2>There was an error loading the page.</h2><p>Make sure you are using <a href="http://getfirefox.com">Firefox 3</a>, and that you have JavaScript enabled.</p></div>
  <div id="message" style="visibility:hidden;">&nbsp;</div>

  <!-- These are build dynamically by the script -->
  <div id="tabBar"></div>
  <form id="dynForm"></form>
</body>
</html>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs_locked/dsp/configDSP.htm`
- **Category:** webui
- **Size:** 1.7 KB (1699 bytes)
- **SHA-256:** `c0c1ab3d462adeb5847244c9f353d338d1d8345898d5bc2cb9cbdbba8fec5af6`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


</details>

### `configDSP.js`

The JavaScript driving the DSP console page: it reads and writes the audio-processing parameters behind the gated interface.

[View](files/opt/htdocs_locked/dsp/configDSP.js) · [Download](files/opt/htdocs_locked/dsp/configDSP.js) · 94.2 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 1650 lines:

```
//7/6/13 : update to load getDSP on page load
//7/9/13: cleanup dead code

//TODO: set up POLLING
//TODO: validateForm()

//------------------------------------------------------------------------------
// global data object - holds all the preset data locally
var gMainData;
var gMaxNumPresets = 20;
var gTextFieldWidth = 12;
var gXmlDoc;
var gCurrentlyWorking;
var gCurrentlyWorkingMessage = 'Still working... please wait a moment and try again.'
var messageBox;

// A-B Toggling Stuff
var ABinfo = [
    { name: "A", preset: -1, bgcolor: "#AE6662", active: true},
    { name: "B", preset: -1, bgcolor: "#6FA0FF", active: false},
];

// Form buttons, so their ids can be changed but we can still get to them
var gButtons = new Array();


var gIIRFilterOptions = new Array( {option:"highpass2",         valueType:["Freq","Q"],        defaultValues:["999","0.707"] },
                                   {option:"highpass1",         valueType:["Freq"],            defaultValues:["999"]},
                                   {option:"lowpass2",          valueType:["Freq","Q"],        defaultValues:["999","0.707"] },
                                   {option:"lowpass1",          valueType:["Freq"],            defaultValues:["999"]},
                                   {option:"shelving bandpass", valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"rbj shelving bandpass", valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"lfshelf",           valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"hfshelf",           valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"rbj lfshelf",       valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"rbj hfshelf",       valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"bandpassQ",         valueType:["Freq","Q"],        defaultValues:["999","0.707", "0.0"]},
                                   {option:"allpass",           valueType:["Freq","Q"],        defaultValues:["999","0.707"]},
                                   {option:"allpass1",          valueType:["Freq"],            defaultValues:["999"]},
                                   {option:"gain",              valueType:["gain linear"],     defaultValues:["1.0"]},
                                   {option:"bass1",             valueType:["gain dB"],         defaultValues:["0.0"]},
                                   {option:"treble1",           valueType:["gain dB"],         defaultValues:["0.0"]},
                                   {option:"blank",             valueType:[],                  defaultValues:[]},
                                   {option:"mute",              valueType:[],                  defaultValues:[]},
                                   {option:"loudness",          valueType:["FreqLF","gainLF","FreqHF","gainHF"], defaultValues:["999","0.0", "999", "0.0"]},
                                   {option:"custom",            valueType:["b0","b1","b2","a1","a2"],    defaultValues:["3f800000","bfe66666","3f4f5c29","bfe66666","3f4f5c29"]} );

var modeOptions = [ "Off", "Mute", "Bypass", "Active"];
var controlModeOptions = [ "Off", "Active"];
var debugOptions = ["Off", "On"];

function onPageLoad ()
{
    // Require Firefox 3.0 or Safari; i.e. exclude MS Internet Explorer. WHY?
    var browser=navigator.appName;
    var version=parseFloat(navigator.appVersion);
    if ((browser === "Netscape") && (version >= 5)) {
        document.getElementById("cant_load_warning").style.display = "none";
        configDSP();
    }
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs_locked/dsp/configDSP.js`
- **Category:** webui
- **Size:** 94.2 KB (96410 bytes)
- **SHA-256:** `f5218ecb1c633c9634d4b25014a10a99f66c2773fa56b9f4ea6ec5d9912f1bb2`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


</details>

### `meters.css`

The stylesheet for the meters page.

[View](files/opt/htdocs_locked/dsp/meters.css) · [Download](files/opt/htdocs_locked/dsp/meters.css) · 240 B

<details markdown="1"><summary><b>Preview</b></summary>

First 15 of 15 lines:

```
/* 
    Document   : meters.css
    Created on : Feb 24, 2013, 6:27:30 PM
    Author     : Simon.Jarvis
    Description:
        Purpose of the stylesheet follows.
*/

root { 
    display: block;
}
meter {
  width: 150px;
  height: 15px;
}
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs_locked/dsp/meters.css`
- **Category:** webui
- **Size:** 240 B (240 bytes)
- **SHA-256:** `160125d1a65cb0d7242daef7195264d29e6b32d7929952ce4e9d937c44bd4c20`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


</details>

### `meters.htm`

The HTML shell of the input-level meters page: shows live signal levels per channel, used for audio debugging.

[View](files/opt/htdocs_locked/dsp/meters.htm) · [Download](files/opt/htdocs_locked/dsp/meters.htm) · 587 B

<details markdown="1"><summary><b>Preview</b></summary>

First 16 of 16 lines:

```
<html>
<head>
  <title>Meters Test Page</title>
  
  <script type="text/javascript" src="meters.js"></script>
  <link rel="stylesheet" href="meters.css" type="text/css" /> 
</head>
<body onload=" onPageLoad();">
  <h1>Meters Page</h1>
  <div id="cant_load_warning"><h2>There was an error loading the page.</h2><p>Make sure you are using <a href="http://getfirefox.com">Firefox 3</a>, and that you have JavaScript enabled.</p></div>
  <div id="message" style="visibility:hidden;">&nbsp;</div>

  <!-- script dynamically builds for dynForm -->
  <form id="dynForm"></form>
</body>
</html>
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs_locked/dsp/meters.htm`
- **Category:** webui
- **Size:** 587 B (587 bytes)
- **SHA-256:** `aad190d5fd301239fe1cd4f014e177f8c5fb13b0d56b7c44a6c56fe0bc2797e0`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


</details>

### `meters.js`

The JavaScript that polls the meter data and draws the live channel levels on the meters page.

[View](files/opt/htdocs_locked/dsp/meters.js) · [Download](files/opt/htdocs_locked/dsp/meters.js) · 12.2 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 60 of 402 lines:

```
//TODO: set up POLLING
//TODO: convert JSON to XML and submit to ZP

gTextFieldWidth = 6;
gMeterWidth = 6;
var gMeterIds;
var gMeterValues;
var gMeterMins;
var gMeterMaxs;
var gStrMeterBlock;
var gIsDebugMeter;

var gFilterTypes = ["highpass",
                    "1st Order HP",
                    "lowpass",
                    "1st Order LP",
                    "Shelfing Bandpass",
                    "Lowpass Shelf",
                    "Highpass Shelf",
                    "Bandpass with Q",
                    "allpass",
                    "ZP120 HP Cross",
                    "ZP120 LP Cross",
                    "Bass1",
                    "Treble1",
                    "blank",
                    "Mute",
                    "loudness",
                    "bandpass",
                    "Custom" ];

function onPageLoad ()
{
    // Require Firefox 3.0 or Safari; i.e. exclude MS Internet Explorer. WHY?
    var browser=navigator.appName;
    var version=parseFloat(navigator.appVersion);
    if ((browser === "Netscape") && (version >= 5)) {
        document.getElementById("cant_load_warning").style.display = "none";
        configDSP();
    }
}

//------------------------------------------------------------------------------

function onDropdownUpdate(elem)
{
    //
    //clear out the old meters
    //get a new meter values
    //add them to this page/form
    //then kick off the polling
    removeMetersFromTable("");
    gStrMeterBlock = this.value;
    if gIsDebugMeter[this.selectedIndex] {
        getDebugMeters(gStrMeterBlock);
    }
    else {
        getMeters(gStrMeterBlock);
    }
    addToForm(createMeterTable());
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs_locked/dsp/meters.js`
- **Category:** webui
- **Size:** 12.2 KB (12471 bytes)
- **SHA-256:** `1bf1c14a27e27e9b08ae6b3206a6d266ba8a93515540a9c4c525cef4b8bd914b`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


</details>


## Firmware package pieces

The parts of the actual update file Sonos ships: the kernel image, the compressed filesystem that contains everything else on this page, the installer script, and the factory data block written per-device. Together these are what a firmware update physically delivers to the speaker.

<details markdown="1"><summary><b>Technical details</b></summary>

Sections extracted from the signed .upd update package: uImage kernel, squashfs rootfs, preinstall script, and the per-device NCD payload template.

</details>

### `86.10-80260-1-9-device-payload.bin`

The factory data template: a small binary block carrying the per-unit identity slots (serial, MAC, calibration) that get filled in when the device is manufactured. Amusingly, its embedded template still carries a 2012-era factory timestamp from the original Playbar.

[Download](files/package/86.10-80260-1-9-device-payload.bin) · 53.5 KB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/package/86.10-80260-1-9-device-payload.bin`
- **Category:** package
- **Size:** 53.5 KB (54757 bytes)
- **SHA-256:** `36b47a4c7ef9e974ccfa82efda203754f0316ddc38b836e66b050e71074ae7cc`

Section-13 payload from the .upd, about 55 KB. Its tagged-record layout (board ID '3s50avq100', the '2012/06/14' template date, empty serial/MAC slots) is fully decoded on the firmware-differences page; mdputil -B initializes it.


</details>

### `86.10-80260-1-9-kernel.uImage`

The Linux kernel image for this firmware: the actual operating-system core the speaker boots. Everything else on this page runs on top of it.

[Download](files/package/86.10-80260-1-9-kernel.uImage) · 1.7 MB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/package/86.10-80260-1-9-kernel.uImage`
- **Category:** package
- **Size:** 1.7 MB (1792719 bytes)
- **SHA-256:** `f74b36a9a6ae5efe2fe0c1ea1daf05ed5e30212bfe48a30b2c4ea7af2da4ae34`

uImage-wrapped ARM kernel from the update package, about 1.8 MB. The modules/ and wifi/ kernel objects above load into this kernel at boot.


</details>

### `86.10-80260-1-9-preinstall.sh`

The installer script inside the update package: the small program that runs on the device when a firmware update lands, preparing the new image for installation.

[View](files/package/86.10-80260-1-9-preinstall.sh) · [Download](files/package/86.10-80260-1-9-preinstall.sh) · 1.6 KB

<details markdown="1"><summary><b>Preview</b></summary>

First 58 of 58 lines:

```
#!/bin/sh
kill_attempt () {
    echo "Killing $1"
    kill `ps | grep $1 | grep -v grep | cut -c 1-5`
}
if [ "$1" = "umountnone" ]; then
    REGION=$(/bin/mdputil | /usr/sbin/keyval ^REGION)
    if [ "$REGION" = "5" ]; then
        echo "Setting REGION=2"
        /bin/mdputil -fwe 2
    fi
fi
if [ "$1" = "postinst" ]; then
    echo "Doing post-install steps..."
    rm -f /jffs/upgrade_prev.log
    if [ -e /jffs/upgrade.log ]; then
	cp /jffs/upgrade.log /jffs/upgrade_prev.log
    fi
    if [ -e /tmp/upgrade.log ]; then
        cp /tmp/upgrade.log /jffs/.
    else
        echo "Manual upgrade. No log to copy." > /jffs/upgrade.log
    fi
    if [ ! -e /jffs/upgrade_sys_report.log ]; then
        touch /jffs/upgrade_sys_report.log
    fi
    sync
    sync
    exit 0
fi
echo "Checking space on jffs"
jffsusage=$(df -h | grep '98%\|99%\|100% /jffs')
if [ "$jffsusage" ]; then
    echo "WARNING: /jffs usage near or at capacity. Upgrade might fail as a result."
    exit 0
else
    echo "Enough /jffs space to continue upgrade."
fi
if [ -d /dev/mtd ]; then
    if [ -f /var/run/upgradeflag ]; then
        echo "Proceeding with upgrade..."
        exit 0
    fi
    echo -n "Checking to see if anacapad is running..."
    ps | grep -v grep | grep anacapad > /dev/null
    if [ $? = 0 ]; then
        echo "Anacapa is running - please stop it and run upgrade again."
        exit 1
    fi
    echo "Stopping ancillary processes..."
    kill_attempt udhcpc
    kill_attempt inetd
    touch /var/run/stopnetstartd
    kill_attempt netstartd
    sleep 2
    touch /var/run/upgradeflag
    exit 0
fi
```

</details>

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/package/86.10-80260-1-9-preinstall.sh`
- **Category:** package
- **Size:** 1.6 KB (1599 bytes)
- **SHA-256:** `feddb7ad14034b06c316ccbed244a11925093a882a9d7bd81ea64a61364cbe70`

Pre-install script from the .upd; runs ahead of the squashfs/rootfs swap during upgrade.


</details>

### `86.10-80260-1-9-rootfs.squashfs`

The compressed filesystem image: the single block that contains the entire root filesystem, all the files on this page included. This is what the device actually writes during an update.

[Download](files/package/86.10-80260-1-9-rootfs.squashfs) · 13.3 MB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/package/86.10-80260-1-9-rootfs.squashfs`
- **Category:** package
- **Size:** 13.3 MB (13918208 bytes)
- **SHA-256:** `c8deece292bf7025be0533ca4c238e582d2890872ce4681a8ade7666dbbb81d6`

Squashfs image (~14 MB) extracted from the .upd; the rootfs-86.10-80260-1-9 directory on this site was unpacked from this file.


</details>

### `86.10-80260-1-9.upd`

The complete update package itself: the signed bundle Sonos's servers deliver when this model updates, containing the kernel, the filesystem, and the installer all in one signed file.

[Download](files/package/86.10-80260-1-9.upd) · 15.2 MB

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/package/86.10-80260-1-9.upd`
- **Category:** package
- **Size:** 15.2 MB (15919011 bytes)
- **SHA-256:** `6c82af3a66596cac485e30b8b8f2f89f7039f211a379686d011786173db447de`

The signed .upd for build 86.10-80260-1-9 (~16 MB). Everything under the other categories on this page ultimately comes from inside this file.


</details>


## Referenced but not shipped on this model

Files the software knows about and can use, but which are not present in this model's firmware image. Some are downloaded on demand when a feature runs (like calibration tones), some belong to other models, and some are created at runtime rather than shipped. Documented here because the code references them by name.

<details markdown="1"><summary><b>Technical details</b></summary>

Path and filename literals recovered from the binary that resolve to CDN downloads, other-model firmware trees, or runtime-created state rather than files in this squashfs.

</details>

### `complete.ogg`

The 'finished' jingle played at the end of a calibration pass so you know the measurement succeeded. Named in the binary, fetched on demand.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/buzzers/complete.ogg`
- **Category:** referenced

x-rincon-configmode:sonar-calibrate-complete / sonarcal complete.ogg family.


</details>

### `complete_ht.ogg`

The completion tone for home-theater calibration specifically, the variant used when tuning a soundbar rig with satellites.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/buzzers/complete_ht.ogg`
- **Category:** referenced

x-rincon-sonarcal:complete_ht.ogg; home-theater variant of the calibration-complete asset.


</details>

### `leader.ogg`

The tone a group leader plays during the older Sonar room-calibration flow. The firmware references it by name, but it is not stored in this model's image; it is fetched when calibration runs.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/buzzers/leader.ogg`
- **Category:** referenced

Referenced by the x-rincon-sonarcal:leader.ogg URI and the trueplay/sonarcal tone-download machinery; delivered on demand via the ETag-cached tone download path rather than shipped in /opt/buzzers.


</details>

### `testtone.ogg`

The measurement tone used while calibrating a speaker's sound for the room. Referenced by name in the calibration code but downloaded only when a tuning session actually runs.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/buzzers/testtone.ogg`
- **Category:** referenced

x-rincon-sonarcal:testtone.ogg; pulled through the tone_download machinery (etags.txt cache) at calibration time.


</details>

### `trueroom_tone.ogg`

The tone for the trueroom tuning pass, a second-generation room measurement the firmware supports but does not ship as a file.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/buzzers/trueroom_tone.ogg`
- **Category:** referenced

x-rincon-sonarcal:trueroom family; downloaded per-session like the other sonarcal assets.


</details>

### `level.mp3`

A test tone that the smaller Play:1 model ships for audio level checks. On the Playbar build this file does not exist; the same menu of sounds is implemented but this asset was left out of this model.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

<details markdown="1"><summary><b>Technical details</b></summary>

- **Path in image:** `/opt/htdocs/audio/level.mp3`
- **Category:** referenced

271 KB in the m8/fenway rootfs (documented in the firmware-differences page); absent from the m9 image.


</details>

