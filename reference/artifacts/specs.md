# Artifacts: Service specifications and device descriptions (XML)

These XML files are the speaker's public contract. They describe, in a standard format, every service the player offers, every command each service accepts, and every value it reports. Apps and other software read these files straight off the speaker to learn what it can do before they ever send it a command.

::: details Technical details

UPnP SCPD documents plus the #TOKEN#-templated device description, served verbatim from /opt/htdocs/xml over the device's embedded web server.

:::

### `zpMetricsConfigV2.xml`

The telemetry rulebook: a 104-entry list of exactly which usage events the speaker is even capable of reporting to Sonos, with almost all of them switched off by default. It is the clearest evidence of what the player could measure about your usage, and proof that most of it is not collected unless enabled.

[View](/files/opt/conf/zpMetricsConfigV2.xml) · [Download](/files/opt/conf/zpMetricsConfigV2.xml) · 7.8 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/conf/zpMetricsConfigV2.xml`
- **Category:** specs
- **Size:** 7.8 KB (8015 bytes)
- **SHA-256:** `22632157b4ff286933f1792da55a19e673a1361d9b597e5d0c804041632ba7ab`

Metrics category table, revision 13. Positionally parsed for S1-era compatibility (the file carries a comment warning not to reorder it). Three categories default ON; the rest are opt-in. Referenced by telemetry_submission and the shipped_config record.


:::

### `S9_array.xml`

The Playbar's speaker-array description: which physical drivers exist, where they sit, and how they are wired. The audio processing reads this to know what hardware it is mixing sound for.

[View](/files/opt/dsp/S9_array.xml) · [Download](/files/opt/dsp/S9_array.xml) · 13.5 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/dsp/S9_array.xml`
- **Category:** specs
- **Size:** 13.5 KB (13775 bytes)
- **SHA-256:** `9f918ed4a9ea9d584af2e72d5d9e61083a482fa55bf73b98bd02ac8841758e46`

Per-model driver/array map for model S9 consumed by the DSP configuration layer. Sister entries exist for other models (the S39/S41 variants referenced in dsp_files are not shipped here).


:::

### `AVTransport1.xml`

The official contract for the AVTransport service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/AVTransport1.xml) · [Download](/files/opt/htdocs/xml/AVTransport1.xml) · 51.3 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/AVTransport1.xml`
- **Category:** specs
- **Size:** 51.3 KB (52535 bytes)
- **SHA-256:** `37b60a5577dbc75d12d11574e6cfbfec0a8442363fb1590ebd3fa147df14d84d`

SCPD (Service Control Protocol Description) for AVTransport1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `AlarmClock1.xml`

The official contract for the AlarmClock service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/AlarmClock1.xml) · [Download](/files/opt/htdocs/xml/AlarmClock1.xml) · 14.5 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/AlarmClock1.xml`
- **Category:** specs
- **Size:** 14.5 KB (14871 bytes)
- **SHA-256:** `548d73b396023dfb1bc1125cf195ff224dda63563f012a6ab43af38e9d1d0387`

SCPD (Service Control Protocol Description) for AlarmClock1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `AudioIn1.xml`

The official contract for the AudioIn service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/AudioIn1.xml) · [Download](/files/opt/htdocs/xml/AudioIn1.xml) · 4.2 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/AudioIn1.xml`
- **Category:** specs
- **Size:** 4.2 KB (4282 bytes)
- **SHA-256:** `86b16d72f97cf9acd2838755c2fa2e1316e64328eb5b0a59618779f7d9bf9b2a`

SCPD (Service Control Protocol Description) for AudioIn1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `ConnectionManager1.xml`

The official contract for the ConnectionManager service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/ConnectionManager1.xml) · [Download](/files/opt/htdocs/xml/ConnectionManager1.xml) · 4.3 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/ConnectionManager1.xml`
- **Category:** specs
- **Size:** 4.3 KB (4410 bytes)
- **SHA-256:** `e83cb407f88ee426584e81b72ec0cf6f81c9f7cc93d1fe0c781a76050e999c9f`

SCPD (Service Control Protocol Description) for ConnectionManager1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `ContentDirectory1.xml`

The official contract for the ContentDirectory service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/ContentDirectory1.xml) · [Download](/files/opt/htdocs/xml/ContentDirectory1.xml) · 12.1 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/ContentDirectory1.xml`
- **Category:** specs
- **Size:** 12.1 KB (12412 bytes)
- **SHA-256:** `da7fba3dbe2a6e1b2a5800d405acd9224ccc21b670486ba5b799da2b94d2759d`

SCPD (Service Control Protocol Description) for ContentDirectory1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `DeviceProperties1.xml`

The official contract for the DeviceProperties service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/DeviceProperties1.xml) · [Download](/files/opt/htdocs/xml/DeviceProperties1.xml) · 21.2 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/DeviceProperties1.xml`
- **Category:** specs
- **Size:** 21.2 KB (21692 bytes)
- **SHA-256:** `e28dca20dc7acd059a6793cb9b703b51b079204685772f50788e19c85909d95f`

SCPD (Service Control Protocol Description) for DeviceProperties1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `GroupManagement1.xml`

The official contract for the GroupManagement service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/GroupManagement1.xml) · [Download](/files/opt/htdocs/xml/GroupManagement1.xml) · 4.1 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/GroupManagement1.xml`
- **Category:** specs
- **Size:** 4.1 KB (4192 bytes)
- **SHA-256:** `5d0aecb87832118364f3f0ebc25034d40d3d6113cddb20fdbd86966b4e187c67`

SCPD (Service Control Protocol Description) for GroupManagement1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `GroupRenderingControl1.xml`

The official contract for the GroupRenderingControl service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/GroupRenderingControl1.xml) · [Download](/files/opt/htdocs/xml/GroupRenderingControl1.xml) · 3.8 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/GroupRenderingControl1.xml`
- **Category:** specs
- **Size:** 3.8 KB (3847 bytes)
- **SHA-256:** `b57c4da0060d81daeddbdcce776f6450e86b3a29444c9dd0f30d24b06d011fc1`

SCPD (Service Control Protocol Description) for GroupRenderingControl1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `HTControl1.xml`

The official contract for the HTControl service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/HTControl1.xml) · [Download](/files/opt/htdocs/xml/HTControl1.xml) · 4.0 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/HTControl1.xml`
- **Category:** specs
- **Size:** 4.0 KB (4096 bytes)
- **SHA-256:** `77f2bbc05da5be3f69c111e18caa6d0e382f9906ed3423f637fefe06ab9b2759`

SCPD (Service Control Protocol Description) for HTControl1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `MusicServices1.xml`

The official contract for the MusicServices service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/MusicServices1.xml) · [Download](/files/opt/htdocs/xml/MusicServices1.xml) · 2.4 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/MusicServices1.xml`
- **Category:** specs
- **Size:** 2.4 KB (2437 bytes)
- **SHA-256:** `443c68da88cfaa81fb693ae95d61554d8d4cbf15636a56e88d2fe753e49141c4`

SCPD (Service Control Protocol Description) for MusicServices1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `QPlay1.xml`

The official contract for the QPlay service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/QPlay1.xml) · [Download](/files/opt/htdocs/xml/QPlay1.xml) · 1.5 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/QPlay1.xml`
- **Category:** specs
- **Size:** 1.5 KB (1541 bytes)
- **SHA-256:** `f24c1e176d29b120a34d4e45fdf08c624cc412a7456b50a4c1d0bfe04d58d7e3`

SCPD (Service Control Protocol Description) for QPlay1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `Queue1.xml`

The official contract for the Queue service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/Queue1.xml) · [Download](/files/opt/htdocs/xml/Queue1.xml) · 15.8 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/Queue1.xml`
- **Category:** specs
- **Size:** 15.8 KB (16218 bytes)
- **SHA-256:** `dc3a1fbf9ab423435c47898efe6155e70087aaece34f8b7de386fc9e1e14c897`

SCPD (Service Control Protocol Description) for Queue1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `RenderingControl1.xml`

The official contract for the RenderingControl service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/RenderingControl1.xml) · [Download](/files/opt/htdocs/xml/RenderingControl1.xml) · 23.6 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/RenderingControl1.xml`
- **Category:** specs
- **Size:** 23.6 KB (24173 bytes)
- **SHA-256:** `f2f3a113a1b4b1b6fc30466e6b63c7f38e92c24cf87ed396d698ac7d1175c656`

SCPD (Service Control Protocol Description) for RenderingControl1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `SystemProperties1.xml`

The official contract for the SystemProperties service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/SystemProperties1.xml) · [Download](/files/opt/htdocs/xml/SystemProperties1.xml) · 13.9 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/SystemProperties1.xml`
- **Category:** specs
- **Size:** 13.9 KB (14284 bytes)
- **SHA-256:** `b28a3a00f1d8cadae1b518a1205366fc9bc19011106f36b30729fb8b637db993`

SCPD (Service Control Protocol Description) for SystemProperties1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `VirtualLineIn1.xml`

The official contract for the VirtualLineIn service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/VirtualLineIn1.xml) · [Download](/files/opt/htdocs/xml/VirtualLineIn1.xml) · 4.6 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/VirtualLineIn1.xml`
- **Category:** specs
- **Size:** 4.6 KB (4665 bytes)
- **SHA-256:** `5cac437abedee9e253984bad999a9094c6b6b03dbb1792995719390dd80d5396`

SCPD (Service Control Protocol Description) for VirtualLineIn1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `ZoneGroupTopology1.xml`

The official contract for the ZoneGroupTopology service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page 'real' rather than guesswork.

[View](/files/opt/htdocs/xml/ZoneGroupTopology1.xml) · [Download](/files/opt/htdocs/xml/ZoneGroupTopology1.xml) · 8.5 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/ZoneGroupTopology1.xml`
- **Category:** specs
- **Size:** 8.5 KB (8661 bytes)
- **SHA-256:** `326ef256aedc954c06984039a6c9940a9e537e27b37c5ed2031728a835fe330f`

SCPD (Service Control Protocol Description) for ZoneGroupTopology1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.


:::

### `device_description.xml`

The speaker's self-description document: the first file any controller downloads. It announces the model, the serial number, the icon, and the list of services the device offers, so everything else in the conversation starts from here.

[View](/files/opt/htdocs/xml/device_description.xml) · [Download](/files/opt/htdocs/xml/device_description.xml) · 9.7 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/device_description.xml`
- **Category:** specs
- **Size:** 9.7 KB (9936 bytes)
- **SHA-256:** `58dabd2bfc174cafa5d524805c681a2c759bc1ee0636d364702df56b1d80633d`

The #TOKEN#-templated root UPnP device description. 35 substitution tokens (#UUID#, #HOST#, #MODEL#, #SW_VERSION#...) are filled in per-unit before serving. This is the file that makes the box discoverable and describable.


:::

### `factory_reset.xsl`

A stylesheet used to render a simple page during the factory-reset flow: the tiny bit of presentation logic behind the reset web screen.

[View](/files/opt/htdocs/xml/factory_reset.xsl) · [Download](/files/opt/htdocs/xml/factory_reset.xsl) · 647 B

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/factory_reset.xsl`
- **Category:** specs
- **Size:** 647 B (647 bytes)
- **SHA-256:** `27510614835b3191e769680c2a3bcd4fa618dcf9980cf966146bf54a67ba44d2`

XSL transform shipped alongside the XML specs; used when rendering reset-related status content in the embedded web UI.


:::

### `group_description.xml`

The same kind of self-description, but for a grouped room rather than a single speaker. When a group of players acts as one, this document describes that combined identity to the outside world.

[View](/files/opt/htdocs/xml/group_description.xml) · [Download](/files/opt/htdocs/xml/group_description.xml) · 825 B

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/group_description.xml`
- **Category:** specs
- **Size:** 825 B (825 bytes)
- **SHA-256:** `cf5570ddb9e3f7ba505ef790c0f599bda7476390b856f58b7e413a8ee2513cc6`

The group-level device description variant. Distinct from satellite_device.xml on smaller models; here it presents the zone group's virtual device surface.


:::

### `review.xsl`

A companion stylesheet for rendering a review-style status page in the speaker's built-in web interface.

[View](/files/opt/htdocs/xml/review.xsl) · [Download](/files/opt/htdocs/xml/review.xsl) · 90.1 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/xml/review.xsl`
- **Category:** specs
- **Size:** 90.1 KB (92259 bytes)
- **SHA-256:** `61d6e6c46d29a2cb2a85d49cef6a01221ce4091422807894d37942300d8f0f82`

XSL transform under /opt/htdocs/xml; pairs with review.js in the web assets.


:::

### `musicservices.xml`

The seed list of music services the player knows about before the cloud supplies an updated catalog. On first boot this is how the speaker already knows names like Spotify before your account adds anything.

[View](/files/opt/musicservices/musicservices.xml) · [Download](/files/opt/musicservices/musicservices.xml) · 293 B

::: details Preview

First 6 of 6 lines:

```
<Services>
  <Service Id="254" Name="TuneIn" Version="1.1" Uri="http://legato.radiotime.com/Radio.asmx" SecureUri="https://legato.radiotime.com/Radio.asmx" ContainerType="MService" Capabilities="0">
    <Policy Auth="Anonymous" PollInterval="0"/>
    <Presentation />
  </Service>
</Services>
```

:::

::: details Technical details

- **Path in image:** `/opt/musicservices/musicservices.xml`
- **Category:** specs
- **Size:** 293 B (293 bytes)
- **SHA-256:** `d3b7e14ddaf84f03c59b21ae228efc0dafe44c8d6800a849676ea4c10f361e8b`

Seed service catalog under /opt/musicservices. Replaced by the cloud-delivered service list at registration; replicated household-wide afterwards via the settings-replication machinery.


:::

### `timezones.xml`

The timezone table the speaker keeps on board: the complete list of named time zones it understands, so when you set your location the player can convert it to the right clock offset and daylight-saving rules.

[View](/files/opt/timezones/timezones.xml) · [Download](/files/opt/timezones/timezones.xml) · 7.1 KB

::: details Preview

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

:::

::: details Technical details

- **Path in image:** `/opt/timezones/timezones.xml`
- **Category:** specs
- **Size:** 7.1 KB (7293 bytes)
- **SHA-256:** `2b944103333dae5995405bbf961f2e2efd5e3e7a9afd79594ac799206b27d879`

Zone index used by GetTimeZone/SetTimeZoneAndRule; the firmware's static mapping from index to POSIX timezone rule. Referenced by the timezone_table primitive entry.


:::

