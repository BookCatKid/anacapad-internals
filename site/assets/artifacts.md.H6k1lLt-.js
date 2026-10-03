import{_ as s,o as n,c as e,ag as t}from"./chunks/framework.BXn5fPR3.js";const l="/anacapad-internals/files/opt/htdocs/img/icon-S9.png",m=JSON.parse('{"title":"Firmware artifacts","description":"","frontmatter":{},"headers":[],"relativePath":"artifacts.md","filePath":"artifacts.md"}'),p={name:"artifacts.md"};function o(i,a,r,c,d,u){return n(),e("div",null,[...a[0]||(a[0]=[t('<h1 id="firmware-artifacts" tabindex="-1">Firmware artifacts <a class="header-anchor" href="#firmware-artifacts" aria-label="Permalink to &quot;Firmware artifacts&quot;">​</a></h1><p>This page is a complete shelf of everything inside the firmware image that you can actually open, read, listen to, or download. When this project describes a built-in sound, a public service contract, a settings file, or a program the speaker runs, the real file is here, copied straight out of the firmware. Each entry explains in plain words what the file is, what the speaker uses it for, and where it lives inside the device, with the exact size, checksum, and engineering notes folded underneath. Nothing here is a mock-up or a screenshot: every download is the genuine artifact as it ships on the player.</p><p>Every file below was extracted from the <code>rootfs-86.10-80260-1-9</code> firmware image (191 files, 64.1 MB total). Audio plays in the page, images render inline, and text files can be viewed or downloaded. Programs, libraries and modules are download-only: they are ARM binaries, not something a browser can open.</p><h2 id="audio-files" tabindex="-1">Audio files <a class="header-anchor" href="#audio-files" aria-label="Permalink to &quot;Audio files&quot;">​</a></h2><p>Sounds the speaker itself can play on demand: button chimes, setup prompts, and calibration tones. None of these are music files; they are short built-in sounds the firmware keeps on board so it can answer instantly without downloading anything.</p><details class="details custom-block"><summary>Technical details</summary><p>Playback is triggered through x-rincon-buzzer:, x-rincon-configmode: and x-rincon-sonarcal: URIs resolved against /opt/buzzers and (for downloaded tones) an ETag-managed cache.</p></details><h3 id="_0-mp3" tabindex="-1"><code>0.mp3</code> <a class="header-anchor" href="#_0-mp3" aria-label="Permalink to &quot;`0.mp3`&quot;">​</a></h3><p>The loudest of the four numbered button chimes. The player plays this through its own speaker when a physical button press needs a clear audible confirmation, such as the final step of a setup or pairing gesture.</p><div class="artifact-audio"><audio controls preload="none" src="/anacapad-internals/files/opt/buzzers/0.mp3"></audio></div><p><a href="/anacapad-internals/files/opt/buzzers/0.mp3">Download</a> · 85.9 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/buzzers/0.mp3</code></li><li><strong>Category:</strong> audio</li><li><strong>Size:</strong> 85.9 KB (87989 bytes)</li><li><strong>SHA-256:</strong> <code>9448835023747a67c6a060bc168b32fa11c9bb4018727a27d10e9961da3dc250</code></li></ul><p>Buzzer asset index 0, about 88 KB. Resolved by the x-rincon-buzzer:0 URI family and played through the mixer on the alert path rather than the music pipeline.</p></details><h3 id="_1-mp3" tabindex="-1"><code>1.mp3</code> <a class="header-anchor" href="#_1-mp3" aria-label="Permalink to &quot;`1.mp3`&quot;">​</a></h3><p>A quieter numbered chime used for softer confirmations. It sits alongside the other numbered buzzers as part of the small vocabulary of sounds the player can make without involving a music service.</p><div class="artifact-audio"><audio controls preload="none" src="/anacapad-internals/files/opt/buzzers/1.mp3"></audio></div><p><a href="/anacapad-internals/files/opt/buzzers/1.mp3">Download</a> · 40.3 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/buzzers/1.mp3</code></li><li><strong>Category:</strong> audio</li><li><strong>Size:</strong> 40.3 KB (41288 bytes)</li><li><strong>SHA-256:</strong> <code>e9ccea41f9c98e27b355fe68034dbf77274f3df004cfef18f9ead1817c33a28d</code></li></ul><p>Buzzer asset index 1, about 41 KB. Same alert-path playback as 0.mp3; the four numbered files form the graded confirmation set.</p></details><h3 id="_100-mp3" tabindex="-1"><code>100.mp3</code> <a class="header-anchor" href="#_100-mp3" aria-label="Permalink to &quot;`100.mp3`&quot;">​</a></h3><p>Another of the numbered confirmation sounds, used for a different stage or type of action than the low-numbered chimes.</p><div class="artifact-audio"><audio controls preload="none" src="/anacapad-internals/files/opt/buzzers/100.mp3"></audio></div><p><a href="/anacapad-internals/files/opt/buzzers/100.mp3">Download</a> · 41.1 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/buzzers/100.mp3</code></li><li><strong>Category:</strong> audio</li><li><strong>Size:</strong> 41.1 KB (42061 bytes)</li><li><strong>SHA-256:</strong> <code>35669519666e9a07838c621dfaf809fe2086d53790d02ddcfa5ed19622e41733</code></li></ul><p>Buzzer asset index 100, about 42 KB. The jump in numbering suggests a second group of sounds for a distinct event class inside the same directory.</p></details><h3 id="_101-mp3" tabindex="-1"><code>101.mp3</code> <a class="header-anchor" href="#_101-mp3" aria-label="Permalink to &quot;`101.mp3`&quot;">​</a></h3><p>The smallest buzzer file, a very short tick or blip used for the lightest possible confirmation.</p><div class="artifact-audio"><audio controls preload="none" src="/anacapad-internals/files/opt/buzzers/101.mp3"></audio></div><p><a href="/anacapad-internals/files/opt/buzzers/101.mp3">Download</a> · 4.9 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/buzzers/101.mp3</code></li><li><strong>Category:</strong> audio</li><li><strong>Size:</strong> 4.9 KB (5054 bytes)</li><li><strong>SHA-256:</strong> <code>6e68b9122065d617ec6c081365345d04091a48b646699e8f478798923c9f9a45</code></li></ul><p>Buzzer asset index 101, about 5 KB. Its size implies a sub-second clip, consistent with a minimal UI tick.</p></details><h3 id="speaker-detect-mp3" tabindex="-1"><code>speaker-detect.mp3</code> <a class="header-anchor" href="#speaker-detect-mp3" aria-label="Permalink to &quot;`speaker-detect.mp3`&quot;">​</a></h3><p>The loud chirp a speaker emits when the app asks &#39;which box is this?&#39; During setup or diagnostics the player plays this tone so you can identify which physical speaker you are configuring.</p><div class="artifact-audio"><audio controls preload="none" src="/anacapad-internals/files/opt/buzzers/speaker-detect.mp3"></audio></div><p><a href="/anacapad-internals/files/opt/buzzers/speaker-detect.mp3">Download</a> · 248.8 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/buzzers/speaker-detect.mp3</code></li><li><strong>Category:</strong> audio</li><li><strong>Size:</strong> 248.8 KB (254725 bytes)</li><li><strong>SHA-256:</strong> <code>1611d71bab8d9a7a7d72ae6afc662c6637a9d4eaca9272166de6e54e9c1ff934</code></li></ul><p>About 255 KB, the largest buzzer by far because it is a longer identification tone. This is the file behind the &#39;chirp&#39; feature and the x-rincon-configmode:speaker-detect URI documented in the URI formats page.</p></details><h2 id="images" tabindex="-1">Images <a class="header-anchor" href="#images" aria-label="Permalink to &quot;Images&quot;">​</a></h2><p>Picture files the speaker stores for its own use, mostly the small product icon shown to apps and other players so your speaker appears with the right picture in lists of devices.</p><details class="details custom-block"><summary>Technical details</summary><p>Served from /opt/htdocs/img and referenced by the device description&#39;s iconList so controllers can render the model correctly.</p></details><h3 id="icon-s9-png" tabindex="-1"><code>icon-S9.png</code> <a class="header-anchor" href="#icon-s9-png" aria-label="Permalink to &quot;`icon-S9.png`&quot;">​</a></h3><p>The little Playbar picture the speaker offers to apps and to other players. When a controller lists the devices in your home, this is the icon drawn next to the Playbar&#39;s name.</p><p><img src="'+l+`" alt="icon-S9.png"></p><p><a href="/anacapad-internals/files/opt/htdocs/img/icon-S9.png">Download</a> · 1.2 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/img/icon-S9.png</code></li><li><strong>Category:</strong> image</li><li><strong>Size:</strong> 1.2 KB (1263 bytes)</li><li><strong>SHA-256:</strong> <code>c3a409a2ae628cab55fb09e4f83fc0e11e28bd4978d43ae399e9dbaba7aa7d15</code></li></ul><p>Product icon for model S9 (Playbar). Served over HTTP from the device itself; referenced by the iconList in device_description.xml. Sister models ship icon-S1.png, icon-S3.png and Sub.png instead, which is how the topology page distinguishes products.</p></details><h2 id="service-specifications-and-device-descriptions-xml" tabindex="-1">Service specifications and device descriptions (XML) <a class="header-anchor" href="#service-specifications-and-device-descriptions-xml" aria-label="Permalink to &quot;Service specifications and device descriptions (XML)&quot;">​</a></h2><p>These XML files are the speaker&#39;s public contract. They describe, in a standard format, every service the player offers, every command each service accepts, and every value it reports. Apps and other software read these files straight off the speaker to learn what it can do before they ever send it a command.</p><details class="details custom-block"><summary>Technical details</summary><p>UPnP SCPD documents plus the #TOKEN#-templated device description, served verbatim from /opt/htdocs/xml over the device&#39;s embedded web server.</p></details><h3 id="zpmetricsconfigv2-xml" tabindex="-1"><code>zpMetricsConfigV2.xml</code> <a class="header-anchor" href="#zpmetricsconfigv2-xml" aria-label="Permalink to &quot;\`zpMetricsConfigV2.xml\`&quot;">​</a></h3><p>The telemetry rulebook: a 104-entry list of exactly which usage events the speaker is even capable of reporting to Sonos, with almost all of them switched off by default. It is the clearest evidence of what the player could measure about your usage, and proof that most of it is not collected unless enabled.</p><p><a href="/anacapad-internals/files/opt/conf/zpMetricsConfigV2.xml">View</a> · <a href="/anacapad-internals/files/opt/conf/zpMetricsConfigV2.xml">Download</a> · 7.8 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 109 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot;?&gt;</span></span>
<span class="line"><span>&lt;MetricsConfig version=&quot;1.0&quot; rev=&quot;13&quot; expires=&quot;0&quot; enabled=&quot;ON&quot; defaultUploader=&quot;&quot; optOutExemptUploader=&quot;optOutExempt&quot;&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.device.subscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.device.unsubscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.favorites.subscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.favorites.unsubscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.groupVolume.getVolume&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.groupVolume.subscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.groupVolume.unsubscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playback.getPlaybackStatus&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playback.subscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playback.unsubscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playbackMetadata.subscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playbackMetadata.unsubscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playbackSession.subscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playbackSession.unsubscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playerVolume.duck&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playerVolume.getVolume&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playerVolume.subscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playerVolume.unduck&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;muse.playerVolume.unsubscribe&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;nowplaying.playReport&quot; uploader-ref=&quot;optOutExempt&quot; level=&quot;ON&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetHouseholdTimeAtStamp&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetMute&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetPositionInfo&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetRemainingSleepTimerDuration&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetRunningAlarmProperties&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetString&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetTimeZoneAndRule&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetTransportInfo&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetTransportSettings&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.ReportUnresponsiveDevice&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.SetMute&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.SetRoomCalibrationStatus&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.ReportAlarmStartedRunning&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.reportPlaySeconds&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;zpAM.maintenance&quot; uploader-ref=&quot;&quot; level=&quot;ON&quot;/&gt;</span></span>
<span class="line"><span>    &lt;!-- Events added since 2023 R1 --&gt;</span></span>
<span class="line"><span>    &lt;!-- DO NOT CHANGE THIS ORDER, as old (S1) players only load up to a certain point --&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.CreateObject&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetAlbumArtistDisplayOption&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetAllPrefixLocations&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetAudioInputAttributes&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetBass&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetButtonState&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetCrossfadeMode&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetDailyIndexRefreshTime&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.getDeviceAuthToken&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.getDeviceLinkCode&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetEQ&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.getExtendedMetadata&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot; /&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetHeadphoneConnected&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.getLastUpdate&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetLEDFeedbackState&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetLEDState&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetLineInLevel&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetLoudness&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.GetMediaInfo&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.getMediaMetadata&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot; /&gt;</span></span>
<span class="line"><span>    &lt;Category name=&quot;upnp.getMetadata&quot; uploader-ref=&quot;&quot; level=&quot;OFF&quot;/&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/conf/zpMetricsConfigV2.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 7.8 KB (8015 bytes)</li><li><strong>SHA-256:</strong> <code>22632157b4ff286933f1792da55a19e673a1361d9b597e5d0c804041632ba7ab</code></li></ul><p>Metrics category table, revision 13. Positionally parsed for S1-era compatibility (the file carries a comment warning not to reorder it). Three categories default ON; the rest are opt-in. Referenced by telemetry_submission and the shipped_config record.</p></details><h3 id="s9-array-xml" tabindex="-1"><code>S9_array.xml</code> <a class="header-anchor" href="#s9-array-xml" aria-label="Permalink to &quot;\`S9_array.xml\`&quot;">​</a></h3><p>The Playbar&#39;s speaker-array description: which physical drivers exist, where they sit, and how they are wired. The audio processing reads this to know what hardware it is mixing sound for.</p><p><a href="/anacapad-internals/files/opt/dsp/S9_array.xml">View</a> · <a href="/anacapad-internals/files/opt/dsp/S9_array.xml">Download</a> · 13.5 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 72 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;arrayDefinition version=&quot;1.0&quot;&gt;</span></span>
<span class="line"><span>  &lt;date&gt;05-Feb-2016&lt;/date&gt;</span></span>
<span class="line"><span>  &lt;config entry=&quot;0&quot;&gt;</span></span>
<span class="line"><span>    &lt;driverset name=&quot;woofer&quot;&gt;</span></span>
<span class="line"><span>      &lt;numChan&gt;6&lt;/numChan&gt;</span></span>
<span class="line"><span>      &lt;numTaps&gt;16&lt;/numTaps&gt;</span></span>
<span class="line"><span>      &lt;description&gt;Production_H_design123&lt;/description&gt;</span></span>
<span class="line"><span>      &lt;digest&gt;tempmd5&lt;/digest&gt;</span></span>
<span class="line"><span>      &lt;arrayDef name=&quot;ArrayLeftLows&quot;&gt;</span></span>
<span class="line"><span>        &lt;weights&gt;0x3D881B03,0x3DE1E31C,0x3D9D7115,0xBDB021AD,0xBE74C3B1,0xBDDCCABB,0x3DA27639,0x3D22C0AC,0xBCF43317,0x3DA5DAE6,0x3DA00DBF,0xBCB68795,0x3D22ABD5,0x3B5A72EC,0xBCDBB4D5,0xBB5F525E,0xBD31E165,0x3D86D6B1,0x3D469DCC,0x3C982FEF,0xBE2CC9C2,0xBE0A520D,0x3DD1AF74,0x3D6CFDF5,0xBD670BED,0xBBA89B3D,0x3DF2E9BA,0xBBCE717B,0xBCE8829C,0x3D895248,0xBD4739F7,0xBB02EFA0,0xBC21CACF,0xBD69277D,0x3D5FFD41,0x3D44A280,0x3CAB5D51,0xBDC97318,0xBE36C4E0,0x3C4CA330,0x3E3B34AB,0x3DA03AFC,0xBDD56BD7,0x3D0E29FE,0x3D0D4C55,0xBDFAE22C,0x3D6C31DD,0xBBC0AE2F,0xBD03E5B0,0x3D8DBED3,0xBD513B3C,0x3D395C47,0xBD5DD5A4,0xBE31F6B8,0xBE17F511,0x3E0105B0,0x3DFB3E59,0xBDAD75F2,0x3DF668BC,0x3D97CB19,0xBDA91608,0x3D1A3985,0xBD605E60,0xBCE01EE3,0x3D0B2384,0xBCDA14F2,0x3CC1F136,0xBC1D16D0,0xBD19AEF6,0xBD0CB3C3,0xBE40DD06,0xBD3BE4D6,0x3E498890,0xBC5EA609,0xBCE96C2A,0x3DC315AE,0xBC7D8F9C,0x3C331849,0x3D1FB3E2,0xBD47F8F6,0xBB43159F,0xBBFDB628,0xBD0C62CF,0x3CA43079,0xBB89C6E2,0xBDA8CE74,0xBE26C3E1,0x3D8C5DB1,0x3E065E14,0xBD18BEAF,0x3D2275AC,0x3D295F18,0xBD4043EE,0x3CEE0DDD,0xBC0F9EAE,0xBD0A5EC0,0x3D00AA8E,0xBC965F09,0xBB4C3C97,0xBB90876C,0xBD03535D,0x3C3C43B1&lt;/weights&gt;</span></span>
<span class="line"><span>        &lt;alphas&gt;0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5&lt;/alphas&gt;</span></span>
<span class="line"><span>        &lt;delays&gt;44,33,8,14,0,0&lt;/delays&gt;</span></span>
<span class="line"><span>      &lt;/arrayDef&gt;</span></span>
<span class="line"><span>      &lt;arrayDef name=&quot;ArrayRightLows&quot;&gt;</span></span>
<span class="line"><span>        &lt;weights&gt;0xBDA8CE74,0xBE26C3E1,0x3D8C5DB1,0x3E065E14,0xBD18BEAF,0x3D2275AC,0x3D295F18,0xBD4043EE,0x3CEE0DDD,0xBC0F9EAE,0xBD0A5EC0,0x3D00AA8E,0xBC965F09,0xBB4C3C97,0xBB90876C,0xBD03535D,0x3C3C43B1,0xBD19AEF6,0xBD0CB3C3,0xBE40DD06,0xBD3BE4D6,0x3E498890,0xBC5EA609,0xBCE96C2A,0x3DC315AE,0xBC7D8F9C,0x3C331849,0x3D1FB3E2,0xBD47F8F6,0xBB43159F,0xBBFDB628,0xBD0C62CF,0x3CA43079,0xBB89C6E2,0x3D395C47,0xBD5DD5A4,0xBE31F6B8,0xBE17F511,0x3E0105B0,0x3DFB3E59,0xBDAD75F2,0x3DF668BC,0x3D97CB19,0xBDA91608,0x3D1A3985,0xBD605E60,0xBCE01EE3,0x3D0B2384,0xBCDA14F2,0x3CC1F136,0xBC1D16D0,0x3D5FFD41,0x3D44A280,0x3CAB5D51,0xBDC97318,0xBE36C4E0,0x3C4CA330,0x3E3B34AB,0x3DA03AFC,0xBDD56BD7,0x3D0E29FE,0x3D0D4C55,0xBDFAE22C,0x3D6C31DD,0xBBC0AE2F,0xBD03E5B0,0x3D8DBED3,0xBD513B3C,0x3D86D6B1,0x3D469DCC,0x3C982FEF,0xBE2CC9C2,0xBE0A520D,0x3DD1AF74,0x3D6CFDF5,0xBD670BED,0xBBA89B3D,0x3DF2E9BA,0xBBCE717B,0xBCE8829C,0x3D895248,0xBD4739F7,0xBB02EFA0,0xBC21CACF,0xBD69277D,0x3D881B03,0x3DE1E31C,0x3D9D7115,0xBDB021AD,0xBE74C3B1,0xBDDCCABB,0x3DA27639,0x3D22C0AC,0xBCF43317,0x3DA5DAE6,0x3DA00DBF,0xBCB68795,0x3D22ABD5,0x3B5A72EC,0xBCDBB4D5,0xBB5F525E,0xBD31E165&lt;/weights&gt;</span></span>
<span class="line"><span>        &lt;alphas&gt;0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5&lt;/alphas&gt;</span></span>
<span class="line"><span>        &lt;delays&gt;0,0,14,8,33,44&lt;/delays&gt;</span></span>
<span class="line"><span>      &lt;/arrayDef&gt;</span></span>
<span class="line"><span>      &lt;arrayDef name=&quot;ArrayCenterLows&quot;&gt;</span></span>
<span class="line"><span>        &lt;weights&gt;0x3CE33ADA,0x3D3FED12,0x3D299E2C,0xBB4672D7,0xBD4D1B04,0xBD1EA43B,0xBC8E0841,0xBBD55477,0x3C8CAD30,0x3CDED141,0x3C04E61A,0x3CA98045,0x3C8423F9,0xBCC28CDE,0xBC8F5E4E,0xBC624FC6,0xBC4F9DDB,0x3C5BC6F8,0x3B4FCE4D,0xBC803F23,0xBD8D9E18,0xBD3B4FA7,0x3D17ADDE,0x3D8DB852,0x3D1650A5,0x3C1020D4,0xBC862654,0xBD1A946F,0xBC8FFB66,0xBD07D4DF,0x3BE2D706,0x3CA9FCB4,0x3BFE4EA7,0x3CEA256A,0x3E020AB8,0xBE823A69,0xBEF6CB1A,0x3D8CA807,0x3EC6E6F9,0xBDBB1EC7,0x3E5D29FA,0x3D9F4F8B,0xBE265AC2,0x3DC224C3,0xBE778C1A,0x3C201D65,0xBD9ADD1B,0xBCB0A77F,0x3E0FDB95,0x3C8B78DA,0x3E11EEF1,0x3D0F5647,0xBD94C632,0xBE6FC4F7,0xBDA36246,0x3E39B97C,0x3DBF4C05,0x3D6AC31E,0x3DB8C360,0xBD654862,0xBD5E22BA,0xBD8B9E7E,0xBD9C1B7B,0xBADFC78C,0x3C01357E,0x3D4E0220,0x3D72AACB,0x3CF9E5AA,0x3BA288D6,0xBD41B92D,0xBD6B3F78,0x3BF815F1,0x3D00339B,0x3D874C2C,0x3D4582C8,0xBC865E1E,0xBD0703CE,0xBD2B8A5E,0xBD02EBE8,0xBC381434,0x3CA19770,0x3CC379CC,0x3CBAB215,0x3CA2B986,0xBABEDDFB,0x3D15317B,0x3D24B8BD,0x3C40E6CB,0xBC42024D,0xBC148991,0xBD09FDB4,0xBD1F53F8,0x3A630A59,0x3B00E9D9,0x3C363DDB,0x3D0EA5A4,0x3D04E141,0x3C9068EE,0xBC947E7E,0xBCCB243D,0xBCCE4195,0xBCE8348F&lt;/weights&gt;</span></span>
<span class="line"><span>        &lt;alphas&gt;0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215&lt;/alphas&gt;</span></span>
<span class="line"><span>        &lt;delays&gt;0,19,63,54,49,19&lt;/delays&gt;</span></span>
<span class="line"><span>      &lt;/arrayDef&gt;</span></span>
<span class="line"><span>    &lt;/driverset&gt;</span></span>
<span class="line"><span>  &lt;/config&gt;</span></span>
<span class="line"><span>  &lt;config entry=&quot;1&quot;&gt;</span></span>
<span class="line"><span>    &lt;driverset name=&quot;woofer&quot;&gt;</span></span>
<span class="line"><span>      &lt;numChan&gt;6&lt;/numChan&gt;</span></span>
<span class="line"><span>      &lt;numTaps&gt;16&lt;/numTaps&gt;</span></span>
<span class="line"><span>      &lt;description&gt;Production_VA_design123&lt;/description&gt;</span></span>
<span class="line"><span>      &lt;digest&gt;tempmd5&lt;/digest&gt;</span></span>
<span class="line"><span>      &lt;arrayDef name=&quot;ArrayLeftLows&quot;&gt;</span></span>
<span class="line"><span>        &lt;weights&gt;0x3D881B03,0x3DE1E31C,0x3D9D7115,0xBDB021AD,0xBE74C3B1,0xBDDCCABB,0x3DA27639,0x3D22C0AC,0xBCF43317,0x3DA5DAE6,0x3DA00DBF,0xBCB68795,0x3D22ABD5,0x3B5A72EC,0xBCDBB4D5,0xBB5F525E,0xBD31E165,0x3D86D6B1,0x3D469DCC,0x3C982FEF,0xBE2CC9C2,0xBE0A520D,0x3DD1AF74,0x3D6CFDF5,0xBD670BED,0xBBA89B3D,0x3DF2E9BA,0xBBCE717B,0xBCE8829C,0x3D895248,0xBD4739F7,0xBB02EFA0,0xBC21CACF,0xBD69277D,0x3D5FFD41,0x3D44A280,0x3CAB5D51,0xBDC97318,0xBE36C4E0,0x3C4CA330,0x3E3B34AB,0x3DA03AFC,0xBDD56BD7,0x3D0E29FE,0x3D0D4C55,0xBDFAE22C,0x3D6C31DD,0xBBC0AE2F,0xBD03E5B0,0x3D8DBED3,0xBD513B3C,0x3D395C47,0xBD5DD5A4,0xBE31F6B8,0xBE17F511,0x3E0105B0,0x3DFB3E59,0xBDAD75F2,0x3DF668BC,0x3D97CB19,0xBDA91608,0x3D1A3985,0xBD605E60,0xBCE01EE3,0x3D0B2384,0xBCDA14F2,0x3CC1F136,0xBC1D16D0,0xBD19AEF6,0xBD0CB3C3,0xBE40DD06,0xBD3BE4D6,0x3E498890,0xBC5EA609,0xBCE96C2A,0x3DC315AE,0xBC7D8F9C,0x3C331849,0x3D1FB3E2,0xBD47F8F6,0xBB43159F,0xBBFDB628,0xBD0C62CF,0x3CA43079,0xBB89C6E2,0xBDA8CE74,0xBE26C3E1,0x3D8C5DB1,0x3E065E14,0xBD18BEAF,0x3D2275AC,0x3D295F18,0xBD4043EE,0x3CEE0DDD,0xBC0F9EAE,0xBD0A5EC0,0x3D00AA8E,0xBC965F09,0xBB4C3C97,0xBB90876C,0xBD03535D,0x3C3C43B1&lt;/weights&gt;</span></span>
<span class="line"><span>        &lt;alphas&gt;0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5&lt;/alphas&gt;</span></span>
<span class="line"><span>        &lt;delays&gt;44,33,8,14,0,0&lt;/delays&gt;</span></span>
<span class="line"><span>      &lt;/arrayDef&gt;</span></span>
<span class="line"><span>      &lt;arrayDef name=&quot;ArrayRightLows&quot;&gt;</span></span>
<span class="line"><span>        &lt;weights&gt;0xBDA8CE74,0xBE26C3E1,0x3D8C5DB1,0x3E065E14,0xBD18BEAF,0x3D2275AC,0x3D295F18,0xBD4043EE,0x3CEE0DDD,0xBC0F9EAE,0xBD0A5EC0,0x3D00AA8E,0xBC965F09,0xBB4C3C97,0xBB90876C,0xBD03535D,0x3C3C43B1,0xBD19AEF6,0xBD0CB3C3,0xBE40DD06,0xBD3BE4D6,0x3E498890,0xBC5EA609,0xBCE96C2A,0x3DC315AE,0xBC7D8F9C,0x3C331849,0x3D1FB3E2,0xBD47F8F6,0xBB43159F,0xBBFDB628,0xBD0C62CF,0x3CA43079,0xBB89C6E2,0x3D395C47,0xBD5DD5A4,0xBE31F6B8,0xBE17F511,0x3E0105B0,0x3DFB3E59,0xBDAD75F2,0x3DF668BC,0x3D97CB19,0xBDA91608,0x3D1A3985,0xBD605E60,0xBCE01EE3,0x3D0B2384,0xBCDA14F2,0x3CC1F136,0xBC1D16D0,0x3D5FFD41,0x3D44A280,0x3CAB5D51,0xBDC97318,0xBE36C4E0,0x3C4CA330,0x3E3B34AB,0x3DA03AFC,0xBDD56BD7,0x3D0E29FE,0x3D0D4C55,0xBDFAE22C,0x3D6C31DD,0xBBC0AE2F,0xBD03E5B0,0x3D8DBED3,0xBD513B3C,0x3D86D6B1,0x3D469DCC,0x3C982FEF,0xBE2CC9C2,0xBE0A520D,0x3DD1AF74,0x3D6CFDF5,0xBD670BED,0xBBA89B3D,0x3DF2E9BA,0xBBCE717B,0xBCE8829C,0x3D895248,0xBD4739F7,0xBB02EFA0,0xBC21CACF,0xBD69277D,0x3D881B03,0x3DE1E31C,0x3D9D7115,0xBDB021AD,0xBE74C3B1,0xBDDCCABB,0x3DA27639,0x3D22C0AC,0xBCF43317,0x3DA5DAE6,0x3DA00DBF,0xBCB68795,0x3D22ABD5,0x3B5A72EC,0xBCDBB4D5,0xBB5F525E,0xBD31E165&lt;/weights&gt;</span></span>
<span class="line"><span>        &lt;alphas&gt;0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5&lt;/alphas&gt;</span></span>
<span class="line"><span>        &lt;delays&gt;0,0,14,8,33,44&lt;/delays&gt;</span></span>
<span class="line"><span>      &lt;/arrayDef&gt;</span></span>
<span class="line"><span>      &lt;arrayDef name=&quot;ArrayCenterLows&quot;&gt;</span></span>
<span class="line"><span>        &lt;weights&gt;0x3CE33ADA,0x3D3FED12,0x3D299E2C,0xBB4672D7,0xBD4D1B04,0xBD1EA43B,0xBC8E0841,0xBBD55477,0x3C8CAD30,0x3CDED141,0x3C04E61A,0x3CA98045,0x3C8423F9,0xBCC28CDE,0xBC8F5E4E,0xBC624FC6,0xBC4F9DDB,0x3C5BC6F8,0x3B4FCE4D,0xBC803F23,0xBD8D9E18,0xBD3B4FA7,0x3D17ADDE,0x3D8DB852,0x3D1650A5,0x3C1020D4,0xBC862654,0xBD1A946F,0xBC8FFB66,0xBD07D4DF,0x3BE2D706,0x3CA9FCB4,0x3BFE4EA7,0x3CEA256A,0x3E020AB8,0xBE823A69,0xBEF6CB1A,0x3D8CA807,0x3EC6E6F9,0xBDBB1EC7,0x3E5D29FA,0x3D9F4F8B,0xBE265AC2,0x3DC224C3,0xBE778C1A,0x3C201D65,0xBD9ADD1B,0xBCB0A77F,0x3E0FDB95,0x3C8B78DA,0x3E11EEF1,0x3D0F5647,0xBD94C632,0xBE6FC4F7,0xBDA36246,0x3E39B97C,0x3DBF4C05,0x3D6AC31E,0x3DB8C360,0xBD654862,0xBD5E22BA,0xBD8B9E7E,0xBD9C1B7B,0xBADFC78C,0x3C01357E,0x3D4E0220,0x3D72AACB,0x3CF9E5AA,0x3BA288D6,0xBD41B92D,0xBD6B3F78,0x3BF815F1,0x3D00339B,0x3D874C2C,0x3D4582C8,0xBC865E1E,0xBD0703CE,0xBD2B8A5E,0xBD02EBE8,0xBC381434,0x3CA19770,0x3CC379CC,0x3CBAB215,0x3CA2B986,0xBABEDDFB,0x3D15317B,0x3D24B8BD,0x3C40E6CB,0xBC42024D,0xBC148991,0xBD09FDB4,0xBD1F53F8,0x3A630A59,0x3B00E9D9,0x3C363DDB,0x3D0EA5A4,0x3D04E141,0x3C9068EE,0xBC947E7E,0xBCCB243D,0xBCCE4195,0xBCE8348F&lt;/weights&gt;</span></span>
<span class="line"><span>        &lt;alphas&gt;0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215,0xBF6E6215&lt;/alphas&gt;</span></span>
<span class="line"><span>        &lt;delays&gt;0,19,63,54,49,19&lt;/delays&gt;</span></span>
<span class="line"><span>      &lt;/arrayDef&gt;</span></span>
<span class="line"><span>    &lt;/driverset&gt;</span></span>
<span class="line"><span>  &lt;/config&gt;</span></span>
<span class="line"><span>  &lt;config entry=&quot;2&quot;&gt;</span></span>
<span class="line"><span>    &lt;driverset name=&quot;woofer&quot;&gt;</span></span>
<span class="line"><span>      &lt;numChan&gt;6&lt;/numChan&gt;</span></span>
<span class="line"><span>      &lt;numTaps&gt;16&lt;/numTaps&gt;</span></span>
<span class="line"><span>      &lt;description&gt;Production_VB_design123&lt;/description&gt;</span></span>
<span class="line"><span>      &lt;digest&gt;tempmd5&lt;/digest&gt;</span></span>
<span class="line"><span>      &lt;arrayDef name=&quot;ArrayLeftLows&quot;&gt;</span></span>
<span class="line"><span>        &lt;weights&gt;0x3D881B03,0x3DE1E31C,0x3D9D7115,0xBDB021AD,0xBE74C3B1,0xBDDCCABB,0x3DA27639,0x3D22C0AC,0xBCF43317,0x3DA5DAE6,0x3DA00DBF,0xBCB68795,0x3D22ABD5,0x3B5A72EC,0xBCDBB4D5,0xBB5F525E,0xBD31E165,0x3D86D6B1,0x3D469DCC,0x3C982FEF,0xBE2CC9C2,0xBE0A520D,0x3DD1AF74,0x3D6CFDF5,0xBD670BED,0xBBA89B3D,0x3DF2E9BA,0xBBCE717B,0xBCE8829C,0x3D895248,0xBD4739F7,0xBB02EFA0,0xBC21CACF,0xBD69277D,0x3D5FFD41,0x3D44A280,0x3CAB5D51,0xBDC97318,0xBE36C4E0,0x3C4CA330,0x3E3B34AB,0x3DA03AFC,0xBDD56BD7,0x3D0E29FE,0x3D0D4C55,0xBDFAE22C,0x3D6C31DD,0xBBC0AE2F,0xBD03E5B0,0x3D8DBED3,0xBD513B3C,0x3D395C47,0xBD5DD5A4,0xBE31F6B8,0xBE17F511,0x3E0105B0,0x3DFB3E59,0xBDAD75F2,0x3DF668BC,0x3D97CB19,0xBDA91608,0x3D1A3985,0xBD605E60,0xBCE01EE3,0x3D0B2384,0xBCDA14F2,0x3CC1F136,0xBC1D16D0,0xBD19AEF6,0xBD0CB3C3,0xBE40DD06,0xBD3BE4D6,0x3E498890,0xBC5EA609,0xBCE96C2A,0x3DC315AE,0xBC7D8F9C,0x3C331849,0x3D1FB3E2,0xBD47F8F6,0xBB43159F,0xBBFDB628,0xBD0C62CF,0x3CA43079,0xBB89C6E2,0xBDA8CE74,0xBE26C3E1,0x3D8C5DB1,0x3E065E14,0xBD18BEAF,0x3D2275AC,0x3D295F18,0xBD4043EE,0x3CEE0DDD,0xBC0F9EAE,0xBD0A5EC0,0x3D00AA8E,0xBC965F09,0xBB4C3C97,0xBB90876C,0xBD03535D,0x3C3C43B1&lt;/weights&gt;</span></span>
<span class="line"><span>        &lt;alphas&gt;0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5,0xBF671FA5&lt;/alphas&gt;</span></span>
<span class="line"><span>        &lt;delays&gt;44,33,8,14,0,0&lt;/delays&gt;</span></span>
<span class="line"><span>      &lt;/arrayDef&gt;</span></span>
<span class="line"><span>      &lt;arrayDef name=&quot;ArrayRightLows&quot;&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/dsp/S9_array.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 13.5 KB (13775 bytes)</li><li><strong>SHA-256:</strong> <code>9f918ed4a9ea9d584af2e72d5d9e61083a482fa55bf73b98bd02ac8841758e46</code></li></ul><p>Per-model driver/array map for model S9 consumed by the DSP configuration layer. Sister entries exist for other models (the S39/S41 variants referenced in dsp_files are not shipped here).</p></details><h3 id="avtransport1-xml" tabindex="-1"><code>AVTransport1.xml</code> <a class="header-anchor" href="#avtransport1-xml" aria-label="Permalink to &quot;\`AVTransport1.xml\`&quot;">​</a></h3><p>The official contract for the AVTransport service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/AVTransport1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/AVTransport1.xml">Download</a> · 51.3 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 1537 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;TransportState&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;STOPPED&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;PLAYING&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;PAUSED_PLAYBACK&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;TRANSITIONING&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;TransportStatus&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;TransportErrorDescription&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;TransportErrorURI&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;TransportErrorHttpCode&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;TransportErrorHttpHeaders&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;PlaybackStorageMedium&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;NONE&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;NETWORK&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;RecordStorageMedium&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;NONE&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;PossiblePlaybackStorageMedia&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;PossibleRecordStorageMedia&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/AVTransport1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 51.3 KB (52535 bytes)</li><li><strong>SHA-256:</strong> <code>37b60a5577dbc75d12d11574e6cfbfec0a8442363fb1590ebd3fa147df14d84d</code></li></ul><p>SCPD (Service Control Protocol Description) for AVTransport1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="alarmclock1-xml" tabindex="-1"><code>AlarmClock1.xml</code> <a class="header-anchor" href="#alarmclock1-xml" aria-label="Permalink to &quot;\`AlarmClock1.xml\`&quot;">​</a></h3><p>The official contract for the AlarmClock service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/AlarmClock1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/AlarmClock1.xml">Download</a> · 14.5 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 447 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_ISO8601Time&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Recurrence&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;ONCE&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;WEEKDAYS&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;WEEKENDS&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;DAILY&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AlarmID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AlarmList&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AlarmEnabled&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AlarmProgramURI&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AlarmProgramMetaData&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AlarmPlayMode&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;NORMAL&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;REPEAT_ALL&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;SHUFFLE_NOREPEAT&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;SHUFFLE&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>      &lt;defaultValue&gt;NORMAL&lt;/defaultValue&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AlarmVolume&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui2&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AlarmIncludeLinkedZones&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/AlarmClock1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 14.5 KB (14871 bytes)</li><li><strong>SHA-256:</strong> <code>548d73b396023dfb1bc1125cf195ff224dda63563f012a6ab43af38e9d1d0387</code></li></ul><p>SCPD (Service Control Protocol Description) for AlarmClock1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="audioin1-xml" tabindex="-1"><code>AudioIn1.xml</code> <a class="header-anchor" href="#audioin1-xml" aria-label="Permalink to &quot;\`AudioIn1.xml\`&quot;">​</a></h3><p>The official contract for the AudioIn service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/AudioIn1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/AudioIn1.xml">Download</a> · 4.2 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 137 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_MemberID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_TransportSettings&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;AudioInputName&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Icon&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;LineInConnected&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;LeftLineInLevel&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;i4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;RightLineInLevel&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;i4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_ObjectID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Playing&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>  &lt;/serviceStateTable&gt;</span></span>
<span class="line"><span>  &lt;actionList&gt;</span></span>
<span class="line"><span>    &lt;action&gt;</span></span>
<span class="line"><span>      &lt;name&gt;StartTransmissionToGroup&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;argumentList&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;ObjectID&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_ObjectID&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;CoordinatorID&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_MemberID&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;CurrentTransportSettings&lt;/name&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/AudioIn1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 4.2 KB (4282 bytes)</li><li><strong>SHA-256:</strong> <code>86b16d72f97cf9acd2838755c2fa2e1316e64328eb5b0a59618779f7d9bf9b2a</code></li></ul><p>SCPD (Service Control Protocol Description) for AudioIn1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="connectionmanager1-xml" tabindex="-1"><code>ConnectionManager1.xml</code> <a class="header-anchor" href="#connectionmanager1-xml" aria-label="Permalink to &quot;\`ConnectionManager1.xml\`&quot;">​</a></h3><p>The official contract for the ConnectionManager service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/ConnectionManager1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/ConnectionManager1.xml">Download</a> · 4.3 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 132 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;SourceProtocolInfo&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;SinkProtocolInfo&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;CurrentConnectionIDs&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_ConnectionStatus&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;OK&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;ContentFormatMismatch&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;InsufficientBandwidth&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;UnreliableChannel&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;Unknown&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_ConnectionManager&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Direction&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;Input&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;Output&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_ProtocolInfo&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_ConnectionID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;i4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AVTransportID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;i4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_RcsID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;i4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>  &lt;/serviceStateTable&gt;</span></span>
<span class="line"><span>  &lt;actionList&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/ConnectionManager1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 4.3 KB (4410 bytes)</li><li><strong>SHA-256:</strong> <code>e83cb407f88ee426584e81b72ec0cf6f81c9f7cc93d1fe0c781a76050e999c9f</code></li></ul><p>SCPD (Service Control Protocol Description) for ConnectionManager1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="contentdirectory1-xml" tabindex="-1"><code>ContentDirectory1.xml</code> <a class="header-anchor" href="#contentdirectory1-xml" aria-label="Permalink to &quot;\`ContentDirectory1.xml\`&quot;">​</a></h3><p>The official contract for the ContentDirectory service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/ContentDirectory1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/ContentDirectory1.xml">Download</a> · 12.1 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 387 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_ObjectID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Result&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_SearchCriteria&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_BrowseFlag&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;BrowseMetadata&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;BrowseDirectChildren&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Filter&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_SortCriteria&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Prefix&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Index&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Count&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_UpdateID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_TagValueList&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AlbumArtistDisplayOption&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/ContentDirectory1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 12.1 KB (12412 bytes)</li><li><strong>SHA-256:</strong> <code>da7fba3dbe2a6e1b2a5800d405acd9224ccc21b670486ba5b799da2b94d2759d</code></li></ul><p>SCPD (Service Control Protocol Description) for ContentDirectory1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="deviceproperties1-xml" tabindex="-1"><code>DeviceProperties1.xml</code> <a class="header-anchor" href="#deviceproperties1-xml" aria-label="Permalink to &quot;\`DeviceProperties1.xml\`&quot;">​</a></h3><p>The official contract for the DeviceProperties service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/DeviceProperties1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/DeviceProperties1.xml">Download</a> · 21.2 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 688 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;HouseholdID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;SettingsReplicationState&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;ZoneName&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Icon&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Configuration&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;TargetRoomName&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Invisible&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;IsZoneBridge&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;AirPlayEnabled&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;SupportsAudioIn&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;SupportsAudioClip&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;IsIdle&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;MoreInfo&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/DeviceProperties1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 21.2 KB (21692 bytes)</li><li><strong>SHA-256:</strong> <code>e28dca20dc7acd059a6793cb9b703b51b079204685772f50788e19c85909d95f</code></li></ul><p>SCPD (Service Control Protocol Description) for DeviceProperties1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="groupmanagement1-xml" tabindex="-1"><code>GroupManagement1.xml</code> <a class="header-anchor" href="#groupmanagement1-xml" aria-label="Permalink to &quot;\`GroupManagement1.xml\`&quot;">​</a></h3><p>The official contract for the GroupManagement service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/GroupManagement1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/GroupManagement1.xml">Download</a> · 4.1 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 130 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_MemberID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_TransportSettings&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AVTransportURI&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_BufferingResultCode&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;i4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_BootSeq&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;GroupCoordinatorIsLocal&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;LocalGroupUUID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;VirtualLineInGroupID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;SourceAreaIds&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;ResetVolumeAfter&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;VolumeAVTransportURI&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>  &lt;/serviceStateTable&gt;</span></span>
<span class="line"><span>  &lt;actionList&gt;</span></span>
<span class="line"><span>    &lt;action&gt;</span></span>
<span class="line"><span>      &lt;name&gt;AddMember&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;argumentList&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;MemberID&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_MemberID&lt;/relatedStateVariable&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/GroupManagement1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 4.1 KB (4192 bytes)</li><li><strong>SHA-256:</strong> <code>5d0aecb87832118364f3f0ebc25034d40d3d6113cddb20fdbd86966b4e187c67</code></li></ul><p>SCPD (Service Control Protocol Description) for GroupManagement1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="grouprenderingcontrol1-xml" tabindex="-1"><code>GroupRenderingControl1.xml</code> <a class="header-anchor" href="#grouprenderingcontrol1-xml" aria-label="Permalink to &quot;\`GroupRenderingControl1.xml\`&quot;">​</a></h3><p>The official contract for the GroupRenderingControl service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/GroupRenderingControl1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/GroupRenderingControl1.xml">Download</a> · 3.8 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 126 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;GroupMute&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;GroupVolume&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui2&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueRange&gt;</span></span>
<span class="line"><span>        &lt;minimum&gt;0&lt;/minimum&gt;</span></span>
<span class="line"><span>        &lt;maximum&gt;100&lt;/maximum&gt;</span></span>
<span class="line"><span>        &lt;step&gt;1&lt;/step&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueRange&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;GroupVolumeChangeable&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_InstanceID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_VolumeAdjustment&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;i4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>  &lt;/serviceStateTable&gt;</span></span>
<span class="line"><span>  &lt;actionList&gt;</span></span>
<span class="line"><span>    &lt;action&gt;</span></span>
<span class="line"><span>      &lt;name&gt;GetGroupMute&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;argumentList&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;InstanceID&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_InstanceID&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;CurrentMute&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;out&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;GroupMute&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>      &lt;/argumentList&gt;</span></span>
<span class="line"><span>    &lt;/action&gt;</span></span>
<span class="line"><span>    &lt;action&gt;</span></span>
<span class="line"><span>      &lt;name&gt;SetGroupMute&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;argumentList&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;InstanceID&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_InstanceID&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;DesiredMute&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/GroupRenderingControl1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 3.8 KB (3847 bytes)</li><li><strong>SHA-256:</strong> <code>b57c4da0060d81daeddbdcce776f6450e86b3a29444c9dd0f30d24b06d011fc1</code></li></ul><p>SCPD (Service Control Protocol Description) for GroupRenderingControl1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="htcontrol1-xml" tabindex="-1"><code>HTControl1.xml</code> <a class="header-anchor" href="#htcontrol1-xml" aria-label="Permalink to &quot;\`HTControl1.xml\`&quot;">​</a></h3><p>The official contract for the HTControl service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/HTControl1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/HTControl1.xml">Download</a> · 4.0 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 137 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;TOSLinkConnected&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;IRRepeaterState&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;On&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;Off&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;Disabled&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Timeout&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueRange&gt;</span></span>
<span class="line"><span>        &lt;minimum&gt;0&lt;/minimum&gt;</span></span>
<span class="line"><span>        &lt;maximum&gt;60000&lt;/maximum&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueRange&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_IRRemoteName&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_IRCode&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;RemoteConfigured&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;LEDFeedbackState&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;On&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;Off&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>  &lt;/serviceStateTable&gt;</span></span>
<span class="line"><span>  &lt;actionList&gt;</span></span>
<span class="line"><span>    &lt;action&gt;</span></span>
<span class="line"><span>      &lt;name&gt;SetIRRepeaterState&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;argumentList&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;DesiredIRRepeaterState&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;IRRepeaterState&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>      &lt;/argumentList&gt;</span></span>
<span class="line"><span>    &lt;/action&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/HTControl1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 4.0 KB (4096 bytes)</li><li><strong>SHA-256:</strong> <code>77f2bbc05da5be3f69c111e18caa6d0e382f9906ed3423f637fefe06ab9b2759</code></li></ul><p>SCPD (Service Control Protocol Description) for HTControl1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="musicservices1-xml" tabindex="-1"><code>MusicServices1.xml</code> <a class="header-anchor" href="#musicservices1-xml" aria-label="Permalink to &quot;\`MusicServices1.xml\`&quot;">​</a></h3><p>The official contract for the MusicServices service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/MusicServices1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/MusicServices1.xml">Download</a> · 2.4 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 78 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_ServiceDescriptorList&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_ServiceTypeList&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;ServiceId&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;ServiceListVersion&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;SessionId&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Username&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>  &lt;/serviceStateTable&gt;</span></span>
<span class="line"><span>  &lt;actionList&gt;</span></span>
<span class="line"><span>    &lt;action&gt;</span></span>
<span class="line"><span>      &lt;name&gt;GetSessionId&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;argumentList&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;ServiceId&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;ServiceId&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;Username&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;Username&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;SessionId&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;out&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;SessionId&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>      &lt;/argumentList&gt;</span></span>
<span class="line"><span>    &lt;/action&gt;</span></span>
<span class="line"><span>    &lt;action&gt;</span></span>
<span class="line"><span>      &lt;name&gt;ListAvailableServices&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;argumentList&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;AvailableServiceDescriptorList&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;out&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_ServiceDescriptorList&lt;/relatedStateVariable&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/MusicServices1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 2.4 KB (2437 bytes)</li><li><strong>SHA-256:</strong> <code>443c68da88cfaa81fb693ae95d61554d8d4cbf15636a56e88d2fe753e49141c4</code></li></ul><p>SCPD (Service Control Protocol Description) for MusicServices1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="qplay1-xml" tabindex="-1"><code>QPlay1.xml</code> <a class="header-anchor" href="#qplay1-xml" aria-label="Permalink to &quot;\`QPlay1.xml\`&quot;">​</a></h3><p>The official contract for the QPlay service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/QPlay1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/QPlay1.xml">Download</a> · 1.5 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 52 of 52 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Seed&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Code&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_MID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_DID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>  &lt;/serviceStateTable&gt;</span></span>
<span class="line"><span>  &lt;actionList&gt;</span></span>
<span class="line"><span>    &lt;action&gt;</span></span>
<span class="line"><span>      &lt;name&gt;QPlayAuth&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;argumentList&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;Seed&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_Seed&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;Code&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;out&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_Code&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;MID&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;out&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_MID&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;DID&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;out&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_DID&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>      &lt;/argumentList&gt;</span></span>
<span class="line"><span>    &lt;/action&gt;</span></span>
<span class="line"><span>  &lt;/actionList&gt;</span></span>
<span class="line"><span>&lt;/scpd&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/QPlay1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 1.5 KB (1541 bytes)</li><li><strong>SHA-256:</strong> <code>f24c1e176d29b120a34d4e45fdf08c624cc412a7456b50a4c1d0bfe04d58d7e3</code></li></ul><p>SCPD (Service Control Protocol Description) for QPlay1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="queue1-xml" tabindex="-1"><code>Queue1.xml</code> <a class="header-anchor" href="#queue1-xml" aria-label="Permalink to &quot;\`Queue1.xml\`&quot;">​</a></h3><p>The official contract for the Queue service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/Queue1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/Queue1.xml">Download</a> · 15.8 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 474 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;LastChange&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;UpdateID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Curated&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_UpdateID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_QueueID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_QueueOwnerID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_QueueOwnerContext&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_QueuePolicy&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_URI&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_LIST_URI&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_URIMetaData&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_ObjectID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_TrackNumber&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/Queue1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 15.8 KB (16218 bytes)</li><li><strong>SHA-256:</strong> <code>dc3a1fbf9ab423435c47898efe6155e70087aaece34f8b7de386fc9e1e14c897</code></li></ul><p>SCPD (Service Control Protocol Description) for Queue1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="renderingcontrol1-xml" tabindex="-1"><code>RenderingControl1.xml</code> <a class="header-anchor" href="#renderingcontrol1-xml" aria-label="Permalink to &quot;\`RenderingControl1.xml\`&quot;">​</a></h3><p>The official contract for the RenderingControl service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/RenderingControl1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/RenderingControl1.xml">Download</a> · 23.6 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 756 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;LastChange&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Mute&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Volume&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui2&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueRange&gt;</span></span>
<span class="line"><span>        &lt;minimum&gt;0&lt;/minimum&gt;</span></span>
<span class="line"><span>        &lt;maximum&gt;100&lt;/maximum&gt;</span></span>
<span class="line"><span>        &lt;step&gt;1&lt;/step&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueRange&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_LeftVolume&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui2&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueRange&gt;</span></span>
<span class="line"><span>        &lt;minimum&gt;0&lt;/minimum&gt;</span></span>
<span class="line"><span>        &lt;maximum&gt;100&lt;/maximum&gt;</span></span>
<span class="line"><span>        &lt;step&gt;1&lt;/step&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueRange&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_RightVolume&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui2&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueRange&gt;</span></span>
<span class="line"><span>        &lt;minimum&gt;0&lt;/minimum&gt;</span></span>
<span class="line"><span>        &lt;maximum&gt;100&lt;/maximum&gt;</span></span>
<span class="line"><span>        &lt;step&gt;1&lt;/step&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueRange&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;VolumeDB&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;i2&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Bass&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;i2&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueRange&gt;</span></span>
<span class="line"><span>        &lt;minimum&gt;-10&lt;/minimum&gt;</span></span>
<span class="line"><span>        &lt;maximum&gt;10&lt;/maximum&gt;</span></span>
<span class="line"><span>        &lt;step&gt;1&lt;/step&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueRange&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;Treble&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;i2&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueRange&gt;</span></span>
<span class="line"><span>        &lt;minimum&gt;-10&lt;/minimum&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/RenderingControl1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 23.6 KB (24173 bytes)</li><li><strong>SHA-256:</strong> <code>f2f3a113a1b4b1b6fc30466e6b63c7f38e92c24cf87ed396d698ac7d1175c656</code></li></ul><p>SCPD (Service Control Protocol Description) for RenderingControl1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="systemproperties1-xml" tabindex="-1"><code>SystemProperties1.xml</code> <a class="header-anchor" href="#systemproperties1-xml" aria-label="Permalink to &quot;\`SystemProperties1.xml\`&quot;">​</a></h3><p>The official contract for the SystemProperties service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/SystemProperties1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/SystemProperties1.xml">Download</a> · 13.9 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 429 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_VariableName&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_VariableStringValue&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AccountType&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AccountUID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AccountUDN&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AccountID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AccountPassword&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AccountNickname&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AccountCredential&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_AccountMd&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_IsExpired&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_StubsCreated&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_RDMEnabled&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/SystemProperties1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 13.9 KB (14284 bytes)</li><li><strong>SHA-256:</strong> <code>b28a3a00f1d8cadae1b518a1205366fc9bc19011106f36b30729fb8b637db993</code></li></ul><p>SCPD (Service Control Protocol Description) for SystemProperties1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="virtuallinein1-xml" tabindex="-1"><code>VirtualLineIn1.xml</code> <a class="header-anchor" href="#virtuallinein1-xml" aria-label="Permalink to &quot;\`VirtualLineIn1.xml\`&quot;">​</a></h3><p>The official contract for the VirtualLineIn service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/VirtualLineIn1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/VirtualLineIn1.xml">Download</a> · 4.6 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 152 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_InstanceID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui4&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_PlayerID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Volume&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;ui2&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_CurrentTransportSettings&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_Speed&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;CurrentTrackMetaData&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;EnqueuedTransportURIMetaData&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;AVTransportURIMetaData&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;CurrentTransportActions&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>  &lt;/serviceStateTable&gt;</span></span>
<span class="line"><span>  &lt;actionList&gt;</span></span>
<span class="line"><span>    &lt;action&gt;</span></span>
<span class="line"><span>      &lt;name&gt;StartTransmission&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;argumentList&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;InstanceID&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_InstanceID&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;CoordinatorID&lt;/name&gt;</span></span>
<span class="line"><span>          &lt;direction&gt;in&lt;/direction&gt;</span></span>
<span class="line"><span>          &lt;relatedStateVariable&gt;A_ARG_TYPE_PlayerID&lt;/relatedStateVariable&gt;</span></span>
<span class="line"><span>        &lt;/argument&gt;</span></span>
<span class="line"><span>        &lt;argument&gt;</span></span>
<span class="line"><span>          &lt;name&gt;CurrentTransportSettings&lt;/name&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/VirtualLineIn1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 4.6 KB (4665 bytes)</li><li><strong>SHA-256:</strong> <code>5cac437abedee9e253984bad999a9094c6b6b03dbb1792995719390dd80d5396</code></li></ul><p>SCPD (Service Control Protocol Description) for VirtualLineIn1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="zonegrouptopology1-xml" tabindex="-1"><code>ZoneGroupTopology1.xml</code> <a class="header-anchor" href="#zonegrouptopology1-xml" aria-label="Permalink to &quot;\`ZoneGroupTopology1.xml\`&quot;">​</a></h3><p>The official contract for the ZoneGroupTopology service: every command it accepts, every argument those commands take, and every state value it can report, written in the standard format apps understand. This file is what makes the commands on the matching service page &#39;real&#39; rather than guesswork.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/ZoneGroupTopology1.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/ZoneGroupTopology1.xml">Download</a> · 8.5 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 262 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;scpd xmlns=&quot;urn:schemas-upnp-org:service-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;serviceStateTable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;AvailableSoftwareUpdate&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;ZoneGroupState&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;ThirdPartyMediaServersX&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;AlarmRunSequence&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;MuseHouseholdId&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;ZoneGroupName&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;ZoneGroupID&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;yes&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;ZonePlayerUUIDsInGroup&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_UpdateType&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>      &lt;allowedValueList&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;All&lt;/allowedValue&gt;</span></span>
<span class="line"><span>        &lt;allowedValue&gt;Software&lt;/allowedValue&gt;</span></span>
<span class="line"><span>      &lt;/allowedValueList&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_CachedOnly&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;boolean&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_UpdateItem&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span>
<span class="line"><span>      &lt;name&gt;A_ARG_TYPE_UpdateURL&lt;/name&gt;</span></span>
<span class="line"><span>      &lt;dataType&gt;string&lt;/dataType&gt;</span></span>
<span class="line"><span>    &lt;/stateVariable&gt;</span></span>
<span class="line"><span>    &lt;stateVariable sendEvents=&quot;no&quot;&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/ZoneGroupTopology1.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 8.5 KB (8661 bytes)</li><li><strong>SHA-256:</strong> <code>326ef256aedc954c06984039a6c9940a9e537e27b37c5ed2031728a835fe330f</code></li></ul><p>SCPD (Service Control Protocol Description) for ZoneGroupTopology1. The advertised action list and state-variable table for that service; the analysis on this site is cross-validated against these documents.</p></details><h3 id="device-description-xml" tabindex="-1"><code>device_description.xml</code> <a class="header-anchor" href="#device-description-xml" aria-label="Permalink to &quot;\`device_description.xml\`&quot;">​</a></h3><p>The speaker&#39;s self-description document: the first file any controller downloads. It announces the model, the serial number, the icon, and the list of services the device offers, so everything else in the conversation starts from here.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/device_description.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/device_description.xml">Download</a> · 9.7 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 220 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot; ?&gt;</span></span>
<span class="line"><span>&lt;root xmlns=&quot;urn:schemas-upnp-org:device-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;device&gt;</span></span>
<span class="line"><span>    &lt;deviceType&gt;urn:schemas-upnp-org:device:ZonePlayer:1&lt;/deviceType&gt;</span></span>
<span class="line"><span>    &lt;friendlyName&gt;#HOST# - #VENDOR_NAME# #DISPLAY_NAME# - #UUID#&lt;/friendlyName&gt;</span></span>
<span class="line"><span>    &lt;manufacturer&gt;Sonos, Inc.&lt;/manufacturer&gt;</span></span>
<span class="line"><span>    &lt;manufacturerURL&gt;http://www.sonos.com&lt;/manufacturerURL&gt;</span></span>
<span class="line"><span>    &lt;modelNumber&gt;#MODEL#&lt;/modelNumber&gt;</span></span>
<span class="line"><span>    &lt;modelDescription&gt;#VENDOR_NAME# #DISPLAY_NAME#&lt;/modelDescription&gt;</span></span>
<span class="line"><span>    &lt;modelName&gt;#VENDOR_NAME# #DISPLAY_NAME#&lt;/modelName&gt;</span></span>
<span class="line"><span>    &lt;modelURL&gt;http://www.sonos.com/products/zoneplayers/#MODEL#&lt;/modelURL&gt;</span></span>
<span class="line"><span>    &lt;softwareVersion&gt;#SW_VERSION#&lt;/softwareVersion&gt;</span></span>
<span class="line"><span>    &lt;swGen&gt;#SW_GENERATION#&lt;/swGen&gt;</span></span>
<span class="line"><span>    &lt;hardwareVersion&gt;#HW_VERSION#&lt;/hardwareVersion&gt;</span></span>
<span class="line"><span>    &lt;serialNum&gt;#SERIAL_NUM#&lt;/serialNum&gt;</span></span>
<span class="line"><span>    &lt;MACAddress&gt;#MAC_ADDRESS#&lt;/MACAddress&gt;</span></span>
<span class="line"><span>    &lt;UDN&gt;uuid:#UUID#&lt;/UDN&gt;</span></span>
<span class="line"><span>    &lt;iconList&gt;</span></span>
<span class="line"><span>      &lt;icon&gt;</span></span>
<span class="line"><span>        &lt;id&gt;0&lt;/id&gt;</span></span>
<span class="line"><span>        &lt;mimetype&gt;image/png&lt;/mimetype&gt;</span></span>
<span class="line"><span>        &lt;width&gt;48&lt;/width&gt;</span></span>
<span class="line"><span>        &lt;height&gt;48&lt;/height&gt;</span></span>
<span class="line"><span>        &lt;depth&gt;24&lt;/depth&gt;</span></span>
<span class="line"><span>        &lt;url&gt;/img/icon-#MODEL#.png&lt;/url&gt;</span></span>
<span class="line"><span>      &lt;/icon&gt;</span></span>
<span class="line"><span>    &lt;/iconList&gt;</span></span>
<span class="line"><span>    &lt;minCompatibleVersion&gt;#SW_MINCOMPATVER#&lt;/minCompatibleVersion&gt;</span></span>
<span class="line"><span>    &lt;legacyCompatibleVersion&gt;#SW_LEGACYCOMPATVER#&lt;/legacyCompatibleVersion&gt;</span></span>
<span class="line"><span>    &lt;apiVersion&gt;#API_VERSION#&lt;/apiVersion&gt;</span></span>
<span class="line"><span>    &lt;minApiVersion&gt;#MIN_API_VERSION#&lt;/minApiVersion&gt;</span></span>
<span class="line"><span>    &lt;displayVersion&gt;#DISPLAY_VERSION#&lt;/displayVersion&gt;</span></span>
<span class="line"><span>    &lt;extraVersion&gt;#EXTRA_VERSION#&lt;/extraVersion&gt;</span></span>
<span class="line"><span>    &lt;nsVersion&gt;#NS_VERSION#&lt;/nsVersion&gt;</span></span>
<span class="line"><span>    &lt;versions&gt;</span></span>
<span class="line"><span>      &lt;audioTxProtocol&gt;#NODE_PROTO_VERSIONS#&lt;/audioTxProtocol&gt;</span></span>
<span class="line"><span>      &lt;htAudioTxProtocol&gt;#HTA_FRAME_VERSIONS#&lt;/htAudioTxProtocol&gt;</span></span>
<span class="line"><span>      &lt;controlAPI&gt;#MUSE_API_VERSIONS#&lt;/controlAPI&gt;</span></span>
<span class="line"><span>      &lt;trueplaySDK&gt;#TRUEPLAY_SDK_VERSIONS#&lt;/trueplaySDK&gt;</span></span>
<span class="line"><span>    &lt;/versions&gt;</span></span>
<span class="line"><span>    &lt;roomName&gt;#NAME#&lt;/roomName&gt;</span></span>
<span class="line"><span>    &lt;displayName&gt;#DISPLAY_NAME#&lt;/displayName&gt;</span></span>
<span class="line"><span>    &lt;zoneType&gt;#ZONETYPE#&lt;/zoneType&gt;</span></span>
<span class="line"><span>    &lt;feature1&gt;#FEATURE1#&lt;/feature1&gt;</span></span>
<span class="line"><span>    &lt;feature2&gt;#FEATURE2#&lt;/feature2&gt;</span></span>
<span class="line"><span>    &lt;feature3&gt;#FEATURE3#&lt;/feature3&gt;</span></span>
<span class="line"><span>    &lt;feature4&gt;#FEATURE4#&lt;/feature4&gt;</span></span>
<span class="line"><span>    &lt;seriesid&gt;#SERIESID#&lt;/seriesid&gt;</span></span>
<span class="line"><span>    &lt;variant&gt;#VARIANT#&lt;/variant&gt;</span></span>
<span class="line"><span>    &lt;internalSpeakerSize&gt;#INT_SPEAKER_SIZE#&lt;/internalSpeakerSize&gt;</span></span>
<span class="line"><span>    &lt;memory&gt;#MEMORY#&lt;/memory&gt;</span></span>
<span class="line"><span>    &lt;flash&gt;#FLASH#&lt;/flash&gt;</span></span>
<span class="line"><span>    &lt;ampOnTime&gt;#AMP_ONTIME#&lt;/ampOnTime&gt;</span></span>
<span class="line"><span>    &lt;retailMode&gt;#RETAIL_MODE#&lt;/retailMode&gt;</span></span>
<span class="line"><span>    &lt;SSLPort&gt;#SSL_PORT#&lt;/SSLPort&gt;</span></span>
<span class="line"><span>    &lt;securehhSSLPort&gt;#HHSSL_PORT#&lt;/securehhSSLPort&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/device_description.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 9.7 KB (9936 bytes)</li><li><strong>SHA-256:</strong> <code>58dabd2bfc174cafa5d524805c681a2c759bc1ee0636d364702df56b1d80633d</code></li></ul><p>The #TOKEN#-templated root UPnP device description. 35 substitution tokens (#UUID#, #HOST#, #MODEL#, #SW_VERSION#...) are filled in per-unit before serving. This is the file that makes the box discoverable and describable.</p></details><h3 id="factory-reset-xsl" tabindex="-1"><code>factory_reset.xsl</code> <a class="header-anchor" href="#factory-reset-xsl" aria-label="Permalink to &quot;\`factory_reset.xsl\`&quot;">​</a></h3><p>A stylesheet used to render a simple page during the factory-reset flow: the tiny bit of presentation logic behind the reset web screen.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/factory_reset.xsl">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/factory_reset.xsl">Download</a> · 647 B</p><details class="details custom-block"><summary>Preview</summary><p>First 15 of 15 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;xsl:stylesheet version=&quot;1.0&quot; xmlns:xsl=&quot;http://www.w3.org/1999/XSL/Transform&quot;&gt;&lt;xsl:template match=&quot;/&quot;&gt;</span></span>
<span class="line"><span>&lt;html xmlns=&quot;http://www.w3.org/1999/xhtml&quot;&gt;</span></span>
<span class="line"><span>    &lt;head&gt;&lt;/head&gt;</span></span>
<span class="line"><span>    &lt;body&gt;</span></span>
<span class="line"><span>        Challenge: &lt;xsl:value-of select=&quot;/factoryResetKeys/challenge&quot; /&gt;&lt;br /&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;form action=&quot;/reboot&quot; method=&quot;POST&quot;&gt;</span></span>
<span class="line"><span>            &lt;input type=&quot;hidden&quot; name=&quot;reset&quot; value=&quot;yes&quot;/&gt;</span></span>
<span class="line"><span>            &lt;label for=&quot;confirm&quot;&gt;Confirmation Token: &lt;/label&gt;&lt;input type=&quot;text&quot; name=&quot;confirm&quot; id=&quot;confirm&quot; /&gt;&lt;br /&gt;</span></span>
<span class="line"><span>            &lt;button type=&quot;submit&quot;&gt;Confirm&lt;/button&gt;</span></span>
<span class="line"><span>        &lt;/form&gt;</span></span>
<span class="line"><span>    &lt;/body&gt;</span></span>
<span class="line"><span>&lt;/html&gt;</span></span>
<span class="line"><span>&lt;/xsl:template&gt;&lt;/xsl:stylesheet&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/factory_reset.xsl</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 647 B (647 bytes)</li><li><strong>SHA-256:</strong> <code>27510614835b3191e769680c2a3bcd4fa618dcf9980cf966146bf54a67ba44d2</code></li></ul><p>XSL transform shipped alongside the XML specs; used when rendering reset-related status content in the embedded web UI.</p></details><h3 id="group-description-xml" tabindex="-1"><code>group_description.xml</code> <a class="header-anchor" href="#group-description-xml" aria-label="Permalink to &quot;\`group_description.xml\`&quot;">​</a></h3><p>The same kind of self-description, but for a grouped room rather than a single speaker. When a group of players acts as one, this document describes that combined identity to the outside world.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/group_description.xml">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/group_description.xml">Download</a> · 825 B</p><details class="details custom-block"><summary>Preview</summary><p>First 24 of 24 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot;?&gt;</span></span>
<span class="line"><span>&lt;root xmlns=&quot;urn:schemas-upnp-org:device-1-0&quot;&gt;</span></span>
<span class="line"><span>  &lt;specVersion&gt;</span></span>
<span class="line"><span>    &lt;major&gt;1&lt;/major&gt;</span></span>
<span class="line"><span>    &lt;minor&gt;0&lt;/minor&gt;</span></span>
<span class="line"><span>  &lt;/specVersion&gt;</span></span>
<span class="line"><span>  &lt;device&gt;</span></span>
<span class="line"><span>    &lt;deviceType&gt;urn:smartspeaker-audio:device:SpeakerGroup:1&lt;/deviceType&gt;</span></span>
<span class="line"><span>    &lt;friendlyName&gt;#GROUP_NAME#&lt;/friendlyName&gt;</span></span>
<span class="line"><span>    &lt;manufacturer&gt;SONOS&lt;/manufacturer&gt;</span></span>
<span class="line"><span>    &lt;UDN&gt;uuid:#UUID#&lt;/UDN&gt;</span></span>
<span class="line"><span>    &lt;apiVersion&gt;#API_VERSION#&lt;/apiVersion&gt;</span></span>
<span class="line"><span>    &lt;minApiVersion&gt;#MIN_API_VERSION#&lt;/minApiVersion&gt;</span></span>
<span class="line"><span>    &lt;serviceList&gt;</span></span>
<span class="line"><span>      &lt;service&gt;</span></span>
<span class="line"><span>        &lt;serviceType&gt;urn:smartspeaker-audio:service:SpeakerGroup:1&lt;/serviceType&gt;</span></span>
<span class="line"><span>        &lt;serviceId&gt;urn:smartspeaker-audio:serviceId:SpeakerGroup&lt;/serviceId&gt;</span></span>
<span class="line"><span>        &lt;controlURL&gt;/ssdp/notfound&lt;/controlURL&gt;</span></span>
<span class="line"><span>        &lt;eventSubURL&gt;/ssdp/notfound&lt;/eventSubURL&gt;</span></span>
<span class="line"><span>        &lt;SCPDURL&gt;/ssdp/notfound&lt;/SCPDURL&gt;</span></span>
<span class="line"><span>      &lt;/service&gt;</span></span>
<span class="line"><span>    &lt;/serviceList&gt;</span></span>
<span class="line"><span>  &lt;/device&gt;</span></span>
<span class="line"><span>&lt;/root&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/group_description.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 825 B (825 bytes)</li><li><strong>SHA-256:</strong> <code>cf5570ddb9e3f7ba505ef790c0f599bda7476390b856f58b7e413a8ee2513cc6</code></li></ul><p>The group-level device description variant. Distinct from satellite_device.xml on smaller models; here it presents the zone group&#39;s virtual device surface.</p></details><h3 id="review-xsl" tabindex="-1"><code>review.xsl</code> <a class="header-anchor" href="#review-xsl" aria-label="Permalink to &quot;\`review.xsl\`&quot;">​</a></h3><p>A companion stylesheet for rendering a review-style status page in the speaker&#39;s built-in web interface.</p><p><a href="/anacapad-internals/files/opt/htdocs/xml/review.xsl">View</a> · <a href="/anacapad-internals/files/opt/htdocs/xml/review.xsl">Download</a> · 90.1 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 2014 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; ?&gt;</span></span>
<span class="line"><span>&lt;xsl:stylesheet version=&quot;1.0&quot; xmlns:xsl=&quot;http://www.w3.org/1999/XSL/Transform&quot;&gt;</span></span>
<span class="line"><span>&lt;xsl:template match=&quot;/&quot;&gt;</span></span>
<span class="line"><span>&lt;html&gt;</span></span>
<span class="line"><span>&lt;head&gt;</span></span>
<span class="line"><span>&lt;style type=&quot;text/css&quot;&gt;</span></span>
<span class="line"><span>a { text-decoration: none; }</span></span>
<span class="line"><span>a:hover { text-decoration: underline; }</span></span>
<span class="line"><span>h1 {</span></span>
<span class="line"><span>    font-family: arial, helvetica, sans-serif;</span></span>
<span class="line"><span>    font-size: 18pt;</span></span>
<span class="line"><span>    font-weight: bold;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>h2 {</span></span>
<span class="line"><span>    font-family: arial, helvetica, sans-serif;</span></span>
<span class="line"><span>    font-size: 14pt;</span></span>
<span class="line"><span>    font-weight: bold;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>body, td {</span></span>
<span class="line"><span>    font-family: arial, helvetica, sans-serif;</span></span>
<span class="line"><span>    font-size: 10pt;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>th {</span></span>
<span class="line"><span>    font-family: arial, helvetica, sans-serif;</span></span>
<span class="line"><span>    font-size: 11pt;</span></span>
<span class="line"><span>    font-weight: bold;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>table,table.purple {</span></span>
<span class="line"><span>border-spacing:1px;</span></span>
<span class="line"><span>margin-bottom:20px;</span></span>
<span class="line"><span>margin-top: 20px;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>table.purple {</span></span>
<span class="line"><span>margin-left: auto;</span></span>
<span class="line"><span>margin-right: auto;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>table.purple tr {background:#cccccc;}</span></span>
<span class="line"><span>table.purple td {padding:3px; background:#cccccc;}</span></span>
<span class="line"><span>table.purple th {padding:3px; background:#9999cc;}</span></span>
<span class="line"><span>table.purple td.left {</span></span>
<span class="line"><span>font-weight: bold;</span></span>
<span class="line"><span>background:#ccccff;</span></span>
<span class="line"><span>padding-right:20px;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.l1 { }</span></span>
<span class="line"><span>.leftMargin { margin-left: 10pt}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#edidTable {table-layout:fixed; word-wrap:break-word; width:50%}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#networkTable {table-collapse:collapse; border-spacing:0}</span></span>
<span class="line"><span>#networkTable td {border:2px groove black; padding:7px}</span></span>
<span class="line"><span>#networkTable th {border:2px groove black; padding:7px}</span></span>
<span class="line"><span>.ctr {text-align:center}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.cellWithTooltip {</span></span>
<span class="line"><span>    position:relative;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.cellTooltip {</span></span>
<span class="line"><span>    display: none;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/xml/review.xsl</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 90.1 KB (92259 bytes)</li><li><strong>SHA-256:</strong> <code>61d6e6c46d29a2cb2a85d49cef6a01221ce4091422807894d37942300d8f0f82</code></li></ul><p>XSL transform under /opt/htdocs/xml; pairs with review.js in the web assets.</p></details><h3 id="musicservices-xml" tabindex="-1"><code>musicservices.xml</code> <a class="header-anchor" href="#musicservices-xml" aria-label="Permalink to &quot;\`musicservices.xml\`&quot;">​</a></h3><p>The seed list of music services the player knows about before the cloud supplies an updated catalog. On first boot this is how the speaker already knows names like Spotify before your account adds anything.</p><p><a href="/anacapad-internals/files/opt/musicservices/musicservices.xml">View</a> · <a href="/anacapad-internals/files/opt/musicservices/musicservices.xml">Download</a> · 293 B</p><details class="details custom-block"><summary>Preview</summary><p>First 6 of 6 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;Services&gt;</span></span>
<span class="line"><span>  &lt;Service Id=&quot;254&quot; Name=&quot;TuneIn&quot; Version=&quot;1.1&quot; Uri=&quot;http://legato.radiotime.com/Radio.asmx&quot; SecureUri=&quot;https://legato.radiotime.com/Radio.asmx&quot; ContainerType=&quot;MService&quot; Capabilities=&quot;0&quot;&gt;</span></span>
<span class="line"><span>    &lt;Policy Auth=&quot;Anonymous&quot; PollInterval=&quot;0&quot;/&gt;</span></span>
<span class="line"><span>    &lt;Presentation /&gt;</span></span>
<span class="line"><span>  &lt;/Service&gt;</span></span>
<span class="line"><span>&lt;/Services&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/musicservices/musicservices.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 293 B (293 bytes)</li><li><strong>SHA-256:</strong> <code>d3b7e14ddaf84f03c59b21ae228efc0dafe44c8d6800a849676ea4c10f361e8b</code></li></ul><p>Seed service catalog under /opt/musicservices. Replaced by the cloud-delivered service list at registration; replicated household-wide afterwards via the settings-replication machinery.</p></details><h3 id="timezones-xml" tabindex="-1"><code>timezones.xml</code> <a class="header-anchor" href="#timezones-xml" aria-label="Permalink to &quot;\`timezones.xml\`&quot;">​</a></h3><p>The timezone table the speaker keeps on board: the complete list of named time zones it understands, so when you set your location the player can convert it to the right clock offset and daylight-saving rules.</p><p><a href="/anacapad-internals/files/opt/timezones/timezones.xml">View</a> · <a href="/anacapad-internals/files/opt/timezones/timezones.xml">Download</a> · 7.1 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 157 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;TimeZoneRules Version=&quot;9&quot; &gt;</span></span>
<span class="line"><span>  &lt;TimeZones&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;0&quot; GMTBias=&quot;720&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;1&quot; GMTBias=&quot;660&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;2&quot; GMTBias=&quot;600&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;3&quot; GMTBias=&quot;540&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;11&quot; DayOfWeek=&quot;0&quot; Day=&quot;1&quot; Hour=&quot;2&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;3&quot; DayOfWeek=&quot;0&quot; Day=&quot;2&quot; Hour=&quot;2&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;4&quot; GMTBias=&quot;480&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;11&quot; DayOfWeek=&quot;0&quot; Day=&quot;1&quot; Hour=&quot;2&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;3&quot; DayOfWeek=&quot;0&quot; Day=&quot;2&quot; Hour=&quot;2&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;5&quot; GMTBias=&quot;420&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;6&quot; GMTBias=&quot;420&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;7&quot; GMTBias=&quot;420&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;11&quot; DayOfWeek=&quot;0&quot; Day=&quot;1&quot; Hour=&quot;2&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;3&quot; DayOfWeek=&quot;0&quot; Day=&quot;2&quot; Hour=&quot;2&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;8&quot; GMTBias=&quot;360&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;9&quot; GMTBias=&quot;360&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;11&quot; DayOfWeek=&quot;0&quot; Day=&quot;1&quot; Hour=&quot;2&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;3&quot; DayOfWeek=&quot;0&quot; Day=&quot;2&quot; Hour=&quot;2&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;10&quot; GMTBias=&quot;360&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;11&quot; GMTBias=&quot;360&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;12&quot; GMTBias=&quot;300&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;13&quot; GMTBias=&quot;300&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;11&quot; DayOfWeek=&quot;0&quot; Day=&quot;1&quot; Hour=&quot;2&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;3&quot; DayOfWeek=&quot;0&quot; Day=&quot;2&quot; Hour=&quot;2&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;14&quot; GMTBias=&quot;300&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;11&quot; DayOfWeek=&quot;0&quot; Day=&quot;1&quot; Hour=&quot;2&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;3&quot; DayOfWeek=&quot;0&quot; Day=&quot;2&quot; Hour=&quot;2&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;15&quot; GMTBias=&quot;240&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;11&quot; DayOfWeek=&quot;0&quot; Day=&quot;1&quot; Hour=&quot;2&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;3&quot; DayOfWeek=&quot;0&quot; Day=&quot;2&quot; Hour=&quot;2&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;16&quot; GMTBias=&quot;240&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;17&quot; GMTBias=&quot;240&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;5&quot; DayOfWeek=&quot;0&quot; Day=&quot;2&quot; Hour=&quot;0&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;8&quot; DayOfWeek=&quot;0&quot; Day=&quot;2&quot; Hour=&quot;0&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;18&quot; GMTBias=&quot;210&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;11&quot; DayOfWeek=&quot;0&quot; Day=&quot;1&quot; Hour=&quot;2&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;3&quot; DayOfWeek=&quot;0&quot; Day=&quot;2&quot; Hour=&quot;2&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;19&quot; GMTBias=&quot;180&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;2&quot; DayOfWeek=&quot;0&quot; Day=&quot;3&quot; Hour=&quot;0&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;10&quot; DayOfWeek=&quot;0&quot; Day=&quot;3&quot; Hour=&quot;0&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;20&quot; GMTBias=&quot;180&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;21&quot; GMTBias=&quot;180&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;10&quot; DayOfWeek=&quot;6&quot; Day=&quot;5&quot; Hour=&quot;23&quot; Bias=&quot;0&quot; /&gt;</span></span>
<span class="line"><span>      &lt;DaylightTime Month=&quot;3&quot; DayOfWeek=&quot;6&quot; Day=&quot;5&quot; Hour=&quot;22&quot; Bias=&quot;-60&quot; /&gt;</span></span>
<span class="line"><span>    &lt;/TimeZone&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;22&quot; GMTBias=&quot;120&quot; /&gt;</span></span>
<span class="line"><span>    &lt;TimeZone ID=&quot;23&quot; GMTBias=&quot;60&quot; &gt;</span></span>
<span class="line"><span>      &lt;StandardTime Month=&quot;10&quot; DayOfWeek=&quot;0&quot; Day=&quot;5&quot; Hour=&quot;1&quot; Bias=&quot;0&quot; /&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/timezones/timezones.xml</code></li><li><strong>Category:</strong> specs</li><li><strong>Size:</strong> 7.1 KB (7293 bytes)</li><li><strong>SHA-256:</strong> <code>2b944103333dae5995405bbf961f2e2efd5e3e7a9afd79594ac799206b27d879</code></li></ul><p>Zone index used by GetTimeZone/SetTimeZoneAndRule; the firmware&#39;s static mapping from index to POSIX timezone rule. Referenced by the timezone_table primitive entry.</p></details><h2 id="configuration-files" tabindex="-1">Configuration files <a class="header-anchor" href="#configuration-files" aria-label="Permalink to &quot;Configuration files&quot;">​</a></h2><p>Settings files that ship inside the firmware image itself. They set defaults and behaviors before anything personal is added: how the web server listens, how logs are recorded, which radio setups are allowed, and which background measurements are on.</p><details class="details custom-block"><summary>Technical details</summary><p>Static defaults under /opt/conf, /opt/ir, /opt/dsp, /opt/localsettings and /etc; runtime state that changes later lives separately under the writable /jffs partition.</p></details><h3 id="legacycompatver" tabindex="-1"><code>LEGACYCOMPATVER</code> <a class="header-anchor" href="#legacycompatver" aria-label="Permalink to &quot;\`LEGACYCOMPATVER\`&quot;">​</a></h3><p>The legacy-compatibility marker: how far back this firmware can interoperate with very old players still in a household.</p><p><a href="/anacapad-internals/files/LEGACYCOMPATVER">View</a> · <a href="/anacapad-internals/files/LEGACYCOMPATVER">Download</a> · 11 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>58.0-00000</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/LEGACYCOMPATVER</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 11 B (11 bytes)</li><li><strong>SHA-256:</strong> <code>ee22aa9ca28edb870170c612a3ef59ea2cb063c8c2816994e986aae308c67c69</code></li></ul><p>Compatibility marker for mixed-era households; checked during update rollout decisions alongside MINCOMPATVER.</p></details><h3 id="mincompatver" tabindex="-1"><code>MINCOMPATVER</code> <a class="header-anchor" href="#mincompatver" aria-label="Permalink to &quot;\`MINCOMPATVER\`&quot;">​</a></h3><p>The minimum compatible version marker: the oldest software version this image is willing to coexist with. It is one of the numbers that decides whether an update is allowed to proceed.</p><p><a href="/anacapad-internals/files/MINCOMPATVER">View</a> · <a href="/anacapad-internals/files/MINCOMPATVER">Download</a> · 11 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>85.0-00000</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/MINCOMPATVER</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 11 B (11 bytes)</li><li><strong>SHA-256:</strong> <code>41915dcb2732e231c1106044676f9225ac6040164dd713f291fcc9f92f18c848</code></li></ul><p>Compatibility floor consumed by the update machinery (the &#39;minimum auto-update version&#39; logic in update_machinery).</p></details><h3 id="version" tabindex="-1"><code>VERSION</code> <a class="header-anchor" href="#version" aria-label="Permalink to &quot;\`VERSION\`&quot;">​</a></h3><p>The plain version stamp of the firmware image, the file the update machinery and the system read to know what release is installed.</p><p><a href="/anacapad-internals/files/VERSION">View</a> · <a href="/anacapad-internals/files/VERSION">Download</a> · 12 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>86.10-80260</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/VERSION</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 12 B (12 bytes)</li><li><strong>SHA-256:</strong> <code>e8bdcaec2e1a5cf440f834ca2058e09221e4a5ef52877868dfba438840eab71d</code></li></ul><p>Top-level version marker for the squashfs image; pairs with MINCOMPATVER and LEGACYCOMPATVER in update compatibility checks.</p></details><h3 id="build-properties" tabindex="-1"><code>build.properties</code> <a class="header-anchor" href="#build-properties" aria-label="Permalink to &quot;\`build.properties\`&quot;">​</a></h3><p>The birth certificate of this exact firmware build: when it was compiled, on which machine, from which source revision, in release mode. It answers &#39;exactly which build is this&#39; better than any version number alone.</p><p><a href="/anacapad-internals/files/build.properties">View</a> · <a href="/anacapad-internals/files/build.properties">Download</a> · 806 B</p><details class="details custom-block"><summary>Preview</summary><p>First 20 of 20 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>build.version = 86.10-80260</span></span>
<span class="line"><span>build.date = 2026-08-26 17:51:31.641146</span></span>
<span class="line"><span>build.host = aws-jammy-sec-26</span></span>
<span class="line"><span>build.type = release</span></span>
<span class="line"><span>build.sysinfo = Linux aws-jammy-sec-26 6.8.0-1063-aws #66~22.04.1-Ubuntu SMP Fri Aug  7 17:45:18 UTC 2026 x86_64 x86_64</span></span>
<span class="line"><span>build.arch.type = limelight</span></span>
<span class="line"><span>build.docker = False</span></span>
<span class="line"><span>build.os.info = Ubuntu 22.04.5 LTS</span></span>
<span class="line"><span>build.locked = True</span></span>
<span class="line"><span>build.scm.path = N/A</span></span>
<span class="line"><span>build.scm.type = git</span></span>
<span class="line"><span>build.git.remote = git@github.com:Sonos-Inc/pdsw-sonos-controller-player-s2.git</span></span>
<span class="line"><span>build.git.branch = release/main_alt_release</span></span>
<span class="line"><span>build.github.url = git@github.com:Sonos-Inc/pdsw-sonos-controller-player-s2/commit/a78cd9a393d</span></span>
<span class="line"><span>build.git.dirty = False</span></span>
<span class="line"><span>build.scm.version = a78cd9a393d</span></span>
<span class="line"><span>build.source.date.epoch = 1787772128</span></span>
<span class="line"><span>build.strings.remote = SWPBL-250456</span></span>
<span class="line"><span>build.strings.branch = SWPBL-250456</span></span>
<span class="line"><span>build.strings.version = SWPBL-250456</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/build.properties</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 806 B (806 bytes)</li><li><strong>SHA-256:</strong> <code>693983d6e86275f5a2a34c589306733a3c214f9375e49c368626d57f7b483eb7</code></li></ul><p>Build metadata recorded at compile time: build 86.10-80260 dated 2026-08-26, limelight (Playbar) target, release type, git revision a78cd9a393d on branch release/main_alt_release of the Sonos-internal player repo.</p></details><h3 id="chrony-conf" tabindex="-1"><code>chrony.conf</code> <a class="header-anchor" href="#chrony-conf" aria-label="Permalink to &quot;\`chrony.conf\`&quot;">​</a></h3><p>The time-sync configuration: which time servers the speaker asks for the correct clock. Accurate shared time is what keeps rooms playing in perfect sync, so this file quietly matters a lot.</p><p><a href="/anacapad-internals/files/etc/chrony.conf">View</a> · <a href="/anacapad-internals/files/etc/chrony.conf">Download</a> · 915 B</p><details class="details custom-block"><summary>Preview</summary><p>First 24 of 24 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Resolve multiple server addresses for each Sonos NTP pool name.</span></span>
<span class="line"><span># Permit initial burst polling of newly used NTP servers.</span></span>
<span class="line"><span># Once a server in a given pool has responded, stop polling</span></span>
<span class="line"><span># the remaining servers in that pool.</span></span>
<span class="line"><span>pool 0.sonostime.pool.ntp.org iburst maxsources 1</span></span>
<span class="line"><span>pool 1.sonostime.pool.ntp.org iburst maxsources 1</span></span>
<span class="line"><span>pool 2.sonostime.pool.ntp.org iburst maxsources 1</span></span>
<span class="line"><span>pool 3.sonostime.pool.ntp.org iburst maxsources 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span># This file keeps track of how the system clock tends to drift relative to true time.</span></span>
<span class="line"><span>driftfile /jffs/chrony/chrony.drift</span></span>
<span class="line"><span></span></span>
<span class="line"><span># These logs are for debugging.</span></span>
<span class="line"><span>log tracking rawmeasurements statistics</span></span>
<span class="line"><span>logdir /var/log/chrony</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Permit chrony to step the clock up to once per operation,</span></span>
<span class="line"><span># only if the detected error is in excess of 60 seconds.</span></span>
<span class="line"><span>makestep 60 1</span></span>
<span class="line"><span>maxchange 60 1 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Disable NTP serving to prevent NTP requests from reaching chronyd</span></span>
<span class="line"><span># (this can help prevent DoS attacks on chronyd)</span></span>
<span class="line"><span>port 0</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/chrony.conf</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 915 B (915 bytes)</li><li><strong>SHA-256:</strong> <code>6245ff35b9e68a1d8738dcc430bc8b28e53efaa0c9a834010fde3c72fcc32789</code></li></ul><p>chronyd client config pointing at Sonos&#39;s *.sonostime.pool.ntp.org pool; drift state lands in /jffs/chrony/chrony.drift.</p></details><h3 id="host-conf" tabindex="-1"><code>host.conf</code> <a class="header-anchor" href="#host-conf" aria-label="Permalink to &quot;\`host.conf\`&quot;">​</a></h3><p>A small resolver rulebook: the order in which the speaker tries to turn names into addresses, such as checking its local hosts file before asking the network&#39;s name service.</p><p><a href="/anacapad-internals/files/etc/host.conf">View</a> · <a href="/anacapad-internals/files/etc/host.conf">Download</a> · 26 B</p><details class="details custom-block"><summary>Preview</summary><p>First 2 of 2 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>order hosts,bind</span></span>
<span class="line"><span>multi on</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/host.conf</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 26 B (26 bytes)</li><li><strong>SHA-256:</strong> <code>83b331f98a128e1721c54be5c07bd38ad0d146e89cdecbe0eb53cbc23ff6b86a</code></li></ul><p>Standard glibc resolver order file (hosts before DNS).</p></details><h3 id="nsswitch-conf" tabindex="-1"><code>nsswitch.conf</code> <a class="header-anchor" href="#nsswitch-conf" aria-label="Permalink to &quot;\`nsswitch.conf\`&quot;">​</a></h3><p>The name-service switch table: the classic Unix file deciding where the system looks up things like user names, hosts, and networks, and in what order.</p><p><a href="/anacapad-internals/files/etc/nsswitch.conf">View</a> · <a href="/anacapad-internals/files/etc/nsswitch.conf">Download</a> · 452 B</p><details class="details custom-block"><summary>Preview</summary><p>First 19 of 19 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /etc/nsswitch.conf</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Example configuration of GNU Name Service Switch functionality.</span></span>
<span class="line"><span># If you have the \`glibc-doc&#39; and \`info&#39; packages installed, try:</span></span>
<span class="line"><span># \`info libc &quot;Name Service Switch&quot;&#39; for information about this file.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>passwd:         files</span></span>
<span class="line"><span>group:          files</span></span>
<span class="line"><span>shadow:         files</span></span>
<span class="line"><span></span></span>
<span class="line"><span>hosts:          files dns</span></span>
<span class="line"><span>networks:       files</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protocols:      files</span></span>
<span class="line"><span>services:       files</span></span>
<span class="line"><span>ethers:         files</span></span>
<span class="line"><span>rpc:            files</span></span>
<span class="line"><span></span></span>
<span class="line"><span>netgroup:       files</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/nsswitch.conf</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 452 B (452 bytes)</li><li><strong>SHA-256:</strong> <code>5c24de7911e2eab827332ff98c40aa79f951b951c3106940ac049bdee7d083cc</code></li></ul><p>Standard NSS configuration; controls which sources answer name lookups.</p></details><h3 id="sddpd-conf" tabindex="-1"><code>sddpd.conf</code> <a class="header-anchor" href="#sddpd-conf" aria-label="Permalink to &quot;\`sddpd.conf\`&quot;">​</a></h3><p>Configuration for the device-announcement daemon, the component that keeps re-broadcasting &#39;here I am&#39; so your speakers and apps keep finding each other on the network.</p><p><a href="/anacapad-internals/files/etc/sddpd.conf">View</a> · <a href="/anacapad-internals/files/etc/sddpd.conf">Download</a> · 644 B</p><details class="details custom-block"><summary>Preview</summary><p>First 14 of 14 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>; The Search type/Namespace of device</span></span>
<span class="line"><span>Type = sonos:Zoneplayer</span></span>
<span class="line"><span>; The primary proxy type.  This must match the OnlineCategory specified in the referenced Driver</span></span>
<span class="line"><span>PrimaryProxy = media_service</span></span>
<span class="line"><span>; All proxies implemented by the referenced Driver</span></span>
<span class="line"><span>Proxies = media_service,amplifier</span></span>
<span class="line"><span>; The manufacturer of the device.  This must match the manufacturer specified in the referenced Driver</span></span>
<span class="line"><span>Manufacturer = Sonos</span></span>
<span class="line"><span>; The model of the device.  This should match the model specified in the referenced driver</span></span>
<span class="line"><span>Model = Zoneplayer</span></span>
<span class="line"><span>; The driver file name that is used on the online driver database</span></span>
<span class="line"><span>Driver = sonos.c4z</span></span>
<span class="line"><span>; The anouncement interval in seconds</span></span>
<span class="line"><span>MaxAge = 1800</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/sddpd.conf</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 644 B (644 bytes)</li><li><strong>SHA-256:</strong> <code>7f5c87bfb326d7fa91e28cf30f5696c2e4c6b789d71f9695d7486ca55029d204</code></li></ul><p>Config for the sddpd sibling daemon (Sonos&#39;s device-announcement layer); a development override exists at /jffs/dev_sddp.conf.</p></details><h3 id="syslog-conf" tabindex="-1"><code>syslog.conf</code> <a class="header-anchor" href="#syslog-conf" aria-label="Permalink to &quot;\`syslog.conf\`&quot;">​</a></h3><p>The routing table for system log messages: which kind of message goes to which log file, used by the classic system logger outside the main program.</p><p><a href="/anacapad-internals/files/etc/syslog.conf">View</a> · <a href="/anacapad-internals/files/etc/syslog.conf">Download</a> · 1.6 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 71 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#  /etc/syslog.conf	Configuration file for syslogd.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>#			For more information see syslog.conf(5)</span></span>
<span class="line"><span>#			manpage.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># First some standard logfiles.  Log by facility.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auth,authpriv.*			/var/log/auth.log</span></span>
<span class="line"><span>*.*;auth,authpriv.none		-/var/log/syslog</span></span>
<span class="line"><span>#cron.*				/var/log/cron.log</span></span>
<span class="line"><span>daemon.*			-/var/log/daemon.log</span></span>
<span class="line"><span>kern.*				-/var/log/kern.log</span></span>
<span class="line"><span>lpr.*				-/var/log/lpr.log</span></span>
<span class="line"><span>mail.*				/var/log/mail.log</span></span>
<span class="line"><span>user.*				-/var/log/user.log</span></span>
<span class="line"><span>uucp.*				-/var/log/uucp.log</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Logging for the mail system. Split it up so that</span></span>
<span class="line"><span># it is easy to write scripts to parse these files.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>mail.info			-/var/log/mail.info</span></span>
<span class="line"><span>mail.warn			-/var/log/mail.warn</span></span>
<span class="line"><span>mail.err			/var/log/mail.err</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Logging for INN news system</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>#news.crit			/var/log/news/news.crit</span></span>
<span class="line"><span>#news.err			/var/log/news/news.err</span></span>
<span class="line"><span>#news.notice			-/var/log/news/news.notice</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Some \`catch-all&#39; logfiles.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>*.=debug;\\</span></span>
<span class="line"><span>	auth,authpriv.none;\\</span></span>
<span class="line"><span>	news.none;mail.none	-/var/log/debug</span></span>
<span class="line"><span>*.=info;*.=notice;*.=warn;\\</span></span>
<span class="line"><span>	auth,authpriv.none;\\</span></span>
<span class="line"><span>	cron,daemon.none;\\</span></span>
<span class="line"><span>	mail,news.none		-/var/log/messages</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Emergencies are sent to everybody logged in.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>*.emerg				*</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># I like to have messages displayed on the console, but only on a virtual</span></span>
<span class="line"><span># console I usually leave idle.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>#daemon,mail.*;\\</span></span>
<span class="line"><span>#	news.=crit;news.=err;news.=notice;\\</span></span>
<span class="line"><span>#	*.=debug;*.=info;\\</span></span>
<span class="line"><span>#	*.=notice;*.=warn	/dev/tty8</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The named pipe /dev/xconsole is for the \`xconsole&#39; utility.  To use it,</span></span>
<span class="line"><span># you must invoke \`xconsole&#39; with the \`-file&#39; option:</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/syslog.conf</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 1.6 KB (1670 bytes)</li><li><strong>SHA-256:</strong> <code>0141a530669a95b7c8eb63b29e74b136660fa8d989d8b394acaa78e71483fcda</code></li></ul><p>syslogd routing rules for kernel/daemon messages outside anacapad&#39;s own logger framework.</p></details><h3 id="anacapa-conf" tabindex="-1"><code>anacapa.conf</code> <a class="header-anchor" href="#anacapa-conf" aria-label="Permalink to &quot;\`anacapa.conf\`&quot;">​</a></h3><p>The main configuration file for the player software itself: which ports the web server listens on, which features and directories it uses, and the base settings the program reads at launch. Port 1400 for the status website is defined here.</p><p><a href="/anacapad-internals/files/opt/conf/anacapa.conf">View</a> · <a href="/anacapad-internals/files/opt/conf/anacapa.conf">Download</a> · 2.7 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 84 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Anacapa Web Server configuration file</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Server TCP Port for HTTP operation</span></span>
<span class="line"><span>Port 1400</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Port for HTTPS traffic (0 for disabled)</span></span>
<span class="line"><span>SSLPort 1443</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Port for HTTPS traffic for household members only (0 for disabled)</span></span>
<span class="line"><span>SecureHHSSLPort 1843</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The Server Root (UNIX systems style)</span></span>
<span class="line"><span>ServerRoot /opt</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The Path option specifies the web files path.</span></span>
<span class="line"><span>Path htdocs</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The Default option contains the name of the files the server should</span></span>
<span class="line"><span># look for when only a path is given (e.g. http://myserver/info/).</span></span>
<span class="line"><span>Default index.html</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The TimeOut option tells the server how much seconds to wait for</span></span>
<span class="line"><span># an idle connection before closing it.</span></span>
<span class="line"><span>TimeOut 10</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The MimeTypes option specifies the location of the file</span></span>
<span class="line"><span># containing the mapping of MIME types and files extensions</span></span>
<span class="line"><span>MimeTypes conf/mime.types</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The path of the diagnostic file</span></span>
<span class="line"><span>DiagFile log/anacapa.trace</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The default max level for diagnostics logged to DiagFile</span></span>
<span class="line"><span>DiagLevel default=1</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Max_Conn is the maximum number of simultaneous connections</span></span>
<span class="line"><span># This should be greater than NumThreads to support persistent</span></span>
<span class="line"><span># connections.  The difference is the number of simultaneous</span></span>
<span class="line"><span># persistent connections supported.</span></span>
<span class="line"><span>MaxConn 36</span></span>
<span class="line"><span></span></span>
<span class="line"><span># NumThreads is the number of anacapa worker threads.</span></span>
<span class="line"><span># Previously this was equal to MaxConn but now MaxConn needs to be</span></span>
<span class="line"><span># greater than NumThreads to support persistent connections</span></span>
<span class="line"><span>NumThreads 4</span></span>
<span class="line"><span></span></span>
<span class="line"><span># The file where the pid of the server is logged (UNIX specific)</span></span>
<span class="line"><span>PidFile log/anacapa.pid</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Rincon-specific configuration settings</span></span>
<span class="line"><span># JFFSRoot </span></span>
<span class="line"><span># ZPMusicServicesBackstop ../../../../cc/anacapa/anacapa/pkg/htdocs/xml/musicservices.xml</span></span>
<span class="line"><span># ZPTimeZonesBackstop ../../../../cc/anacapa/anacapa/pkg/htdocs/xml/timezones.xml</span></span>
<span class="line"><span>ContinueAfterIPChange true</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Special Logging for direct control</span></span>
<span class="line"><span>DiagFile log/anacapa.dc.trace</span></span>
<span class="line"><span>DiagLevel main=0,muse=3,cloudqueue=3,spot=3,spot_abr=3,spot_q=3,spot_hal=3,museauth=2</span></span>
<span class="line"><span>DiagMin 16384</span></span>
<span class="line"><span>DiagMax 32768</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/conf/anacapa.conf</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 2.7 KB (2793 bytes)</li><li><strong>SHA-256:</strong> <code>2327552e496415e9fc97e8f9d8cc8e4deb881b00dade0a642d16e61c206e6b3b</code></li></ul><p>Central config consumed at anacapad startup: web listener ports (1400 HTTP / 1443 HTTPS / 1843 household TLS), paths, and feature flags. Some values get overridden by files in the writable /jffs/conf directory.</p></details><h3 id="anacapa-logger-toml" tabindex="-1"><code>anacapa_logger.toml</code> <a class="header-anchor" href="#anacapa-logger-toml" aria-label="Permalink to &quot;\`anacapa_logger.toml\`&quot;">​</a></h3><p>The logging configuration for the main player software: which subsystem writes which log file, how chatty each one is allowed to be, and where the logs land on disk. The 21 log channels described in the subsystems page map onto the rules in this file.</p><p><a href="/anacapad-internals/files/opt/conf/anacapa_logger.toml">View</a> · <a href="/anacapad-internals/files/opt/conf/anacapa_logger.toml">Download</a> · 4.9 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 188 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># This is a TOML configuration document</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>title = &quot;Anacapa logger configuration&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># SONOS_LOG_EMERGENCY = 0, /**&lt; the system is unusable */</span></span>
<span class="line"><span># SONOS_LOG_ALERT = 1, /**&lt; an action must be taken immediately else system is likely to become unusable */</span></span>
<span class="line"><span># SONOS_LOG_CRIT  = 2, /**&lt; critical conditions */</span></span>
<span class="line"><span># SONOS_LOG_ERR   = 3, /**&lt; error conditions */</span></span>
<span class="line"><span># SONOS_LOG_WARN  = 4, /**&lt; warning conditions */</span></span>
<span class="line"><span># SONOS_LOG_NOTE  = 5, /**&lt; notify about normal but significant condition */</span></span>
<span class="line"><span># SONOS_LOG_INFO  = 6, /**&lt; informational */</span></span>
<span class="line"><span># SONOS_LOG_DEBUG = 7, /**&lt; debug */</span></span>
<span class="line"><span># SONOS_LOG_DBG_1 = 8, /**&lt; beginning of the extra debug messages range */</span></span>
<span class="line"><span># SONOS_LOG_DBG_2 = 9,</span></span>
<span class="line"><span># SONOS_LOG_DBG_3 = 10,</span></span>
<span class="line"><span># SONOS_LOG_DBG_4 = 11, /**&lt; end of the extra debug messages range */</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Each section defines one log destination</span></span>
<span class="line"><span># defaultLevel = -1 means no default logging for this destination</span></span>
<span class="line"><span># default backup location: /jffs/app/log</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Main logging for anacapa</span></span>
<span class="line"><span>[[FILE]]</span></span>
<span class="line"><span>name = &quot;anacapa.log&quot;</span></span>
<span class="line"><span>fileSize = 262144</span></span>
<span class="line"><span>preserveSize = 65536</span></span>
<span class="line"><span>defaultLevel = 4</span></span>
<span class="line"><span>backup = true</span></span>
<span class="line"><span>filter = {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### additional destinations ###</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Special Logging for direct control</span></span>
<span class="line"><span>[[FILE]]</span></span>
<span class="line"><span>name = &quot;anacapa.dc.log&quot;</span></span>
<span class="line"><span>fileSize = 65536</span></span>
<span class="line"><span>preserveSize = 16384</span></span>
<span class="line"><span>defaultLevel = -1</span></span>
<span class="line"><span>filter = {main=3,muse=6,museauth=6,muse_token_service=6,cloudqueue=6,spot=6,spot_abr=6,spot_q=6,spot_hal=6,cb=6}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Special Logging for Muse Command and Response Messages</span></span>
<span class="line"><span>[[FILE]]</span></span>
<span class="line"><span>name = &quot;anacapa.musecmdandrsp.log&quot;</span></span>
<span class="line"><span>fileSize = 65336</span></span>
<span class="line"><span>preserveSize = 60000</span></span>
<span class="line"><span>defaultLevel = -1</span></span>
<span class="line"><span>filter = {muselogcmd=7, muselogrsp=7}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Special Logging for Muse debug statistics</span></span>
<span class="line"><span>[[FILE]]</span></span>
<span class="line"><span>name = &quot;anacapa.musedebug.log&quot;</span></span>
<span class="line"><span>fileSize = 65536</span></span>
<span class="line"><span>preserveSize = 16384</span></span>
<span class="line"><span>defaultLevel = -1</span></span>
<span class="line"><span>filter = {muse_debug=7,museperf=6}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Special Logging for Muse Event Messages</span></span>
<span class="line"><span>[[FILE]]</span></span>
<span class="line"><span>name = &quot;anacapa.museevt.log&quot;</span></span>
<span class="line"><span>fileSize = 16384</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/conf/anacapa_logger.toml</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 4.9 KB (4975 bytes)</li><li><strong>SHA-256:</strong> <code>4d2f14b7baa47e7fb3a33d0ec7b820bb84d018187329ec4d268e5e8f42a89eee</code></li></ul><p>TOML logger config for anacapad; defines per-domain sinks and severities. The domain list inside is effectively a module map of the program.</p></details><h3 id="mime-types" tabindex="-1"><code>mime.types</code> <a class="header-anchor" href="#mime-types" aria-label="Permalink to &quot;\`mime.types\`&quot;">​</a></h3><p>The web server&#39;s file-type table: it lets the built-in web server label each file it serves with the right content type so browsers handle them correctly.</p><p><a href="/anacapad-internals/files/opt/conf/mime.types">View</a> · <a href="/anacapad-internals/files/opt/conf/mime.types">Download</a> · 140 B</p><details class="details custom-block"><summary>Preview</summary><p>First 8 of 8 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># MIME type			Extension</span></span>
<span class="line"><span>text/html			htm</span></span>
<span class="line"><span>text/html			html</span></span>
<span class="line"><span>text/xml			xml</span></span>
<span class="line"><span>text/xml			xsl</span></span>
<span class="line"><span>text/css			css</span></span>
<span class="line"><span>text/javascript			js</span></span>
<span class="line"><span>image/png			png</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/conf/mime.types</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 140 B (140 bytes)</li><li><strong>SHA-256:</strong> <code>c9f310db9fc13a8f9a59a717e3c37f337aac5620d10480046d2259b9da5b3742</code></li></ul><p>Standard MIME map read by the embedded HTTP server when serving static files and status pages.</p></details><h3 id="sonosledmgrd-logger-toml" tabindex="-1"><code>sonosledmgrd_logger.toml</code> <a class="header-anchor" href="#sonosledmgrd-logger-toml" aria-label="Permalink to &quot;\`sonosledmgrd_logger.toml\`&quot;">​</a></h3><p>The logging configuration for the LED manager daemon, the small helper program that owns the speaker&#39;s status light. Same idea as the main logger config, but for the light show.</p><p><a href="/anacapad-internals/files/opt/conf/sonosledmgrd_logger.toml">View</a> · <a href="/anacapad-internals/files/opt/conf/sonosledmgrd_logger.toml">Download</a> · 1.0 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 27 of 27 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># This is a TOML configuration document</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>title = &quot;Sonos LED Manager server logger configuration&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># SONOS_LOG_EMERGENCY = 0, /**&lt; the system is unusable */</span></span>
<span class="line"><span># SONOS_LOG_ALERT = 1, /**&lt; an action must be taken immediately else system is likely to become unusable */</span></span>
<span class="line"><span># SONOS_LOG_CRIT  = 2, /**&lt; critical conditions */</span></span>
<span class="line"><span># SONOS_LOG_ERR   = 3, /**&lt; error conditions */</span></span>
<span class="line"><span># SONOS_LOG_WARN  = 4, /**&lt; warning conditions */</span></span>
<span class="line"><span># SONOS_LOG_NOTE  = 5, /**&lt; notify about normal but significant condition */</span></span>
<span class="line"><span># SONOS_LOG_INFO  = 6, /**&lt; informational */</span></span>
<span class="line"><span># SONOS_LOG_DEBUG = 7, /**&lt; debug */</span></span>
<span class="line"><span># SONOS_LOG_DBG_1 = 8, /**&lt; beginning of the extra debug messages range */</span></span>
<span class="line"><span># SONOS_LOG_DBG_2 = 9,</span></span>
<span class="line"><span># SONOS_LOG_DBG_3 = 10,</span></span>
<span class="line"><span># SONOS_LOG_DBG_4 = 11, /**&lt; end of the extra debug messages range */</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Each section defines one log destination</span></span>
<span class="line"><span># defaultLevel = -1 means no default logging for this destination</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Main logging</span></span>
<span class="line"><span>[[FILE]]</span></span>
<span class="line"><span>name = &quot;sonosledmgrd.log&quot;</span></span>
<span class="line"><span>fileSize = 262144</span></span>
<span class="line"><span>preserveSize = 65536</span></span>
<span class="line"><span>defaultLevel = 4</span></span>
<span class="line"><span>filter = {ledmgrd=6,LEDManager=6,ledmgr-server=6,leds_zp=6}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/conf/sonosledmgrd_logger.toml</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 1.0 KB (1042 bytes)</li><li><strong>SHA-256:</strong> <code>6dc66acb328836dd2139ffa4c12003fb493954614c4b03c8983eeff2cc81fd1d</code></li></ul><p>TOML logger config for the sonosledmgrd sibling daemon; controls its /opt/log output.</p></details><h3 id="v1-auth-offline-policy-guest-json" tabindex="-1"><code>v1_auth_offline_policy_guest.json</code> <a class="header-anchor" href="#v1-auth-offline-policy-guest-json" aria-label="Permalink to &quot;\`v1_auth_offline_policy_guest.json\`&quot;">​</a></h3><p>The offline permission list for the guest role: the rules for what a guest or unauthenticated visitor on your network may call when the speaker cannot reach Sonos&#39;s servers to ask. Even with no internet, the player still enforces who is allowed to do what.</p><p><a href="/anacapad-internals/files/opt/conf/v1_auth_offline_policy_guest.json">View</a> · <a href="/anacapad-internals/files/opt/conf/v1_auth_offline_policy_guest.json">Download</a> · 2.0 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;name&quot;:&quot;GUEST&quot;,&quot;version&quot;:1,&quot;permissions&quot;:[{&quot;ns&quot;:&quot;alarms&quot;,&quot;perm&quot;:5},{&quot;ns&quot;:&quot;areas&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;audioClip&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;authorization&quot;,&quot;perm&quot;:5},{&quot;ns&quot;:&quot;clientStatus&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;devices&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;devicesExtended&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;diagnostics&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;effectiveSettings&quot;,&quot;perm&quot;:97},{&quot;ns&quot;:&quot;entitlements&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;favorites&quot;,&quot;perm&quot;:5},{&quot;ns&quot;:&quot;groups&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;groupVolume&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;hardwareStatus&quot;,&quot;perm&quot;:37},{&quot;ns&quot;:&quot;hdmi&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;history&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;homeTheater&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;households&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;info&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;ircontrol&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;localContentLibrary&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;musicServiceAccounts&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;pinewood&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;playback&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;playbackExtended&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;playbackMetadata&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;playbackSession&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;playerVolume&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;playlists&quot;,&quot;perm&quot;:5},{&quot;ns&quot;:&quot;power&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;roomDetection&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;settings&quot;,&quot;perm&quot;:97},{&quot;ns&quot;:&quot;settings:playerBasic&quot;,&quot;perm&quot;:4},{&quot;ns&quot;:&quot;settings:playerLineIn&quot;,&quot;perm&quot;:4},{&quot;ns&quot;:&quot;settings:playerUI&quot;,&quot;perm&quot;:13},{&quot;ns&quot;:&quot;settings:security&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;sleepTimer&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;smartplay&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;soundSwap&quot;,&quot;perm&quot;:2},{&quot;ns&quot;:&quot;systemReporting&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;systemTime&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;time&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;timers&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;trueplay&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;trueroom&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;update&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;upnpAlarmClock&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpAudioIn&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpAVTransport&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpConnectionManager&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpContentDirectory&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpDeviceProperties&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpGroupManagement&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpGroupRenderingControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpHTControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpMusicServices&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpQueue&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpRenderingControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpSystemProperties&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpVirtualLineIn&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpZoneGroupTopology&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;virtualLineIn&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;virtualRemoteControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;voice&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;zones&quot;,&quot;perm&quot;:7}]}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/conf/v1_auth_offline_policy_guest.json</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 2.0 KB (2090 bytes)</li><li><strong>SHA-256:</strong> <code>4006046d5b8375a6b174af5ea402152dc42d066a8cd6de55a770401a3c664035</code></li></ul><p>v1 API authorization policy for the guest role, applied when the authz backend is unreachable (offline fallback). Defines the resource/verb whitelist enforced by the authz stage.</p></details><h3 id="v1-auth-offline-policy-owner-json" tabindex="-1"><code>v1_auth_offline_policy_owner.json</code> <a class="header-anchor" href="#v1-auth-offline-policy-owner-json" aria-label="Permalink to &quot;\`v1_auth_offline_policy_owner.json\`&quot;">​</a></h3><p>The offline permission list for the owner role: the rules for what the household owner&#39;s apps and controllers may call when the speaker cannot reach Sonos&#39;s servers to ask. Even with no internet, the player still enforces who is allowed to do what.</p><p><a href="/anacapad-internals/files/opt/conf/v1_auth_offline_policy_owner.json">View</a> · <a href="/anacapad-internals/files/opt/conf/v1_auth_offline_policy_owner.json">Download</a> · 2.5 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;name&quot;:&quot;OWNER&quot;,&quot;version&quot;:1,&quot;permissions&quot;:[{&quot;ns&quot;:&quot;alarms&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;areas&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;audioClip&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;authorization&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;catalog&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;clientStatus&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;devices&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;devicesExtended&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;diagnostics&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;effectiveSettings&quot;,&quot;perm&quot;:99},{&quot;ns&quot;:&quot;entitlements&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;favorites&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;global&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;groups&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;groupVolume&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;hardwareStatus&quot;,&quot;perm&quot;:127},{&quot;ns&quot;:&quot;hdmi&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;history&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;homeTheater&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;households&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;householdUpdate&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;info&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;ircontrol&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;liveActivities&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;localContentLibrary&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;management&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;musicServiceAccounts&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;networkTest&quot;,&quot;perm&quot;:6},{&quot;ns&quot;:&quot;pinewood&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;platformInternal&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;playback&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;playbackExtended&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;playbackMetadata&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;playbackSession&quot;,&quot;perm&quot;:31},{&quot;ns&quot;:&quot;playerVolume&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;playlists&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;positioning&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;power&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;roomDetection&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;settings&quot;,&quot;perm&quot;:127},{&quot;ns&quot;:&quot;settings:business&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;settings:frontierLlms&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;settings:global&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;settings:playback&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;settings:playerBasic&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;settings:playerLineIn&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;settings:playerUI&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;settings:preferences&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;settings:proDashboard&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;settings:security&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;sleepTimer&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;smartplay&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;soundSwap&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;svc&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;systemReporting&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;systemTime&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;timers&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;topology&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;trueplay&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;trueroom&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;update&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpAlarmClock&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpAudioIn&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpAVTransport&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpConnectionManager&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpContentDirectory&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpDeviceProperties&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpGroupManagement&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpGroupRenderingControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpHTControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpMusicServices&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpQueue&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpRenderingControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpSystemProperties&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpVirtualLineIn&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpZoneGroupTopology&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;virtualLineIn&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;virtualRemoteControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;voice&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;zones&quot;,&quot;perm&quot;:15}]}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/conf/v1_auth_offline_policy_owner.json</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 2.5 KB (2591 bytes)</li><li><strong>SHA-256:</strong> <code>52aec9a38aa1dce27aa7c1215cdf24ab7a5ee67c89da6e0501bc144d3431b4f4</code></li></ul><p>v1 API authorization policy for the owner role, applied when the authz backend is unreachable (offline fallback). Defines the resource/verb whitelist enforced by the authz stage.</p></details><h3 id="v1-auth-offline-policy-p2p-json" tabindex="-1"><code>v1_auth_offline_policy_p2p.json</code> <a class="header-anchor" href="#v1-auth-offline-policy-p2p-json" aria-label="Permalink to &quot;\`v1_auth_offline_policy_p2p.json\`&quot;">​</a></h3><p>The offline permission list for the peer-to-peer role: the rules for what other players in your household may call on each other when the speaker cannot reach Sonos&#39;s servers to ask. Even with no internet, the player still enforces who is allowed to do what.</p><p><a href="/anacapad-internals/files/opt/conf/v1_auth_offline_policy_p2p.json">View</a> · <a href="/anacapad-internals/files/opt/conf/v1_auth_offline_policy_p2p.json">Download</a> · 2.0 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;name&quot;:&quot;P2P&quot;,&quot;version&quot;:1,&quot;permissions&quot;:[{&quot;ns&quot;:&quot;areas&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;audioClip&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;authorization&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;clientStatus&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;devices&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;diagnostics&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;effectiveSettings&quot;,&quot;perm&quot;:99},{&quot;ns&quot;:&quot;entitlements&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;favorites&quot;,&quot;perm&quot;:5},{&quot;ns&quot;:&quot;groups&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;groupVolume&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;hardwareStatus&quot;,&quot;perm&quot;:5},{&quot;ns&quot;:&quot;hdmi&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;history&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;homeTheater&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;households&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;info&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;ircontrol&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;localContentLibrary&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;musicServiceAccounts&quot;,&quot;perm&quot;:4},{&quot;ns&quot;:&quot;playback&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;playbackExtended&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;playbackMetadata&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;playbackSession&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;playerVolume&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;playlists&quot;,&quot;perm&quot;:5},{&quot;ns&quot;:&quot;positioning&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;roomDetection&quot;,&quot;perm&quot;:2},{&quot;ns&quot;:&quot;settings&quot;,&quot;perm&quot;:103},{&quot;ns&quot;:&quot;settings:playerBasic&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;settings:playerLineIn&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;settings:playerUI&quot;,&quot;perm&quot;:15},{&quot;ns&quot;:&quot;settings:security&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;sleepTimer&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;smartplay&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;soundSwap&quot;,&quot;perm&quot;:2},{&quot;ns&quot;:&quot;svc&quot;,&quot;perm&quot;:7},{&quot;ns&quot;:&quot;systemTime&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;time&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;timers&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;trueplay&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;trueroom&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;update&quot;,&quot;perm&quot;:1},{&quot;ns&quot;:&quot;upnpAlarmClock&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpAudioIn&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpAVTransport&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpConnectionManager&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpContentDirectory&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpDeviceProperties&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpGroupManagement&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpGroupRenderingControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpHTControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpMusicServices&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpQueue&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpRenderingControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpSystemProperties&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpVirtualLineIn&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;upnpZoneGroupTopology&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;virtualLineIn&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;virtualRemoteControl&quot;,&quot;perm&quot;:3},{&quot;ns&quot;:&quot;voice&quot;,&quot;perm&quot;:13},{&quot;ns&quot;:&quot;zones&quot;,&quot;perm&quot;:15}]}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/conf/v1_auth_offline_policy_p2p.json</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 2.0 KB (2000 bytes)</li><li><strong>SHA-256:</strong> <code>ddabfd2ded8520c8e99014595934f05b065d784eebbd80eaa79982981bb57566</code></li></ul><p>v1 API authorization policy for the p2p role, applied when the authz backend is unreachable (offline fallback). Defines the resource/verb whitelist enforced by the authz stage.</p></details><h3 id="irconfig-txt" tabindex="-1"><code>irconfig.txt</code> <a class="header-anchor" href="#irconfig-txt" aria-label="Permalink to &quot;\`irconfig.txt\`&quot;">​</a></h3><p>The remote-control configuration: the learned infrared codes and receiver settings the soundbar uses to understand a TV remote&#39;s volume keys.</p><p><a href="/anacapad-internals/files/opt/ir/irconfig.txt">View</a> · <a href="/anacapad-internals/files/opt/ir/irconfig.txt">Download</a> · 98 B</p><details class="details custom-block"><summary>Preview</summary><p>First 9 of 9 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>:repeat_codes:</span></span>
<span class="line"><span>4f 13 05</span></span>
<span class="line"><span>:vol_up_codes:</span></span>
<span class="line"><span>2,25 01</span></span>
<span class="line"><span>:vol_down_codes:</span></span>
<span class="line"><span>2,27 01</span></span>
<span class="line"><span>:vol_mute_codes:</span></span>
<span class="line"><span>2,29 01</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/ir/irconfig.txt</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 98 B (98 bytes)</li><li><strong>SHA-256:</strong> <code>bd06bfd84d8332241b98afc27c38dbc2f375f1e850f291c38541323348811af6</code></li></ul><p>IR decoder config consumed by ir_decoder/ir_learn; holds the learned code list for volume up/down/mute/input. A per-device copy also lives at /jffs/irconfig.txt once learning has run.</p></details><h3 id="global-attrdata-json" tabindex="-1"><code>global_attrdata.json</code> <a class="header-anchor" href="#global-attrdata-json" aria-label="Permalink to &quot;\`global_attrdata.json\`&quot;">​</a></h3><p>The settings-schema records describing the household-wide settings surface: which keys exist, their types, and who may write them. These ship as templates; the live values you change are stored separately in the writable partition.</p><p><a href="/anacapad-internals/files/opt/localsettings/global_attrdata.json">View</a> · <a href="/anacapad-internals/files/opt/localsettings/global_attrdata.json">Download</a> · 547 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;global&quot;: {&quot;attributes&quot;: {&quot;enableContentAccess&quot;: {&quot;default&quot;: false}, &quot;overrideRemoveMSPCredentials&quot;: {&quot;default&quot;: true}}, &quot;schemaValidator&quot;: {&quot;type&quot;: &quot;object&quot;, &quot;properties&quot;: {&quot;attributes&quot;: {&quot;properties&quot;: {&quot;enableContentAccess&quot;: {&quot;type&quot;: &quot;boolean&quot;}, &quot;overrideRemoveMSPCredentials&quot;: {&quot;type&quot;: &quot;boolean&quot;}}, &quot;additionalProperties&quot;: false}, &quot;schemaVersion&quot;: {&quot;type&quot;: &quot;integer&quot;, &quot;minimum&quot;: 1}, &quot;eTag&quot;: {&quot;allOf&quot;: [{&quot;type&quot;: &quot;string&quot;}]}, &quot;timestamp&quot;: {&quot;allOf&quot;: [{&quot;type&quot;: &quot;string&quot;, &quot;pattern&quot;: &quot;^[0-9]+$&quot;, &quot;maxLength&quot;: 20}]}}, &quot;required&quot;: [&quot;schemaVersion&quot;]}}}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/localsettings/global_attrdata.json</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 547 B (547 bytes)</li><li><strong>SHA-256:</strong> <code>1f6910354c4eb6c2e7d587d824418d76e7634bb237b309b40cabe49358a18086</code></li></ul><p>Attribute-data schema for the global settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.</p></details><h3 id="playback-attrdata-json" tabindex="-1"><code>playback_attrdata.json</code> <a class="header-anchor" href="#playback-attrdata-json" aria-label="Permalink to &quot;\`playback_attrdata.json\`&quot;">​</a></h3><p>The settings-schema records for playback-related settings: the typed keys the playback surface accepts. These ship as templates; the live values you change are stored separately in the writable partition.</p><p><a href="/anacapad-internals/files/opt/localsettings/playback_attrdata.json">View</a> · <a href="/anacapad-internals/files/opt/localsettings/playback_attrdata.json">Download</a> · 584 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;playback&quot;: {&quot;attributes&quot;: {&quot;allowDirectControl&quot;: {&quot;default&quot;: true}, &quot;allowLineIn&quot;: {&quot;default&quot;: true}, &quot;allowAirplay&quot;: {&quot;default&quot;: true}}, &quot;schemaValidator&quot;: {&quot;type&quot;: &quot;object&quot;, &quot;properties&quot;: {&quot;attributes&quot;: {&quot;properties&quot;: {&quot;allowDirectControl&quot;: {&quot;type&quot;: &quot;boolean&quot;}, &quot;allowLineIn&quot;: {&quot;type&quot;: &quot;boolean&quot;}, &quot;allowAirplay&quot;: {&quot;type&quot;: &quot;boolean&quot;}}, &quot;additionalProperties&quot;: false}, &quot;schemaVersion&quot;: {&quot;type&quot;: &quot;integer&quot;, &quot;minimum&quot;: 1}, &quot;eTag&quot;: {&quot;allOf&quot;: [{&quot;type&quot;: &quot;string&quot;}]}, &quot;timestamp&quot;: {&quot;allOf&quot;: [{&quot;type&quot;: &quot;string&quot;, &quot;pattern&quot;: &quot;^[0-9]+$&quot;, &quot;maxLength&quot;: 20}]}}, &quot;required&quot;: [&quot;schemaVersion&quot;]}}}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/localsettings/playback_attrdata.json</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 584 B (584 bytes)</li><li><strong>SHA-256:</strong> <code>62e6d8e70979057c44d86116018034d73c6aac12bcf601a135b26fe7197749d5</code></li></ul><p>Attribute-data schema for the playback settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.</p></details><h3 id="playerbasic-attrdata-json" tabindex="-1"><code>playerBasic_attrdata.json</code> <a class="header-anchor" href="#playerbasic-attrdata-json" aria-label="Permalink to &quot;\`playerBasic_attrdata.json\`&quot;">​</a></h3><p>The settings-schema records for basic per-player settings like name, icon, and core behavior toggles. These ship as templates; the live values you change are stored separately in the writable partition.</p><p><a href="/anacapad-internals/files/opt/localsettings/playerBasic_attrdata.json">View</a> · <a href="/anacapad-internals/files/opt/localsettings/playerBasic_attrdata.json">Download</a> · 1.6 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;playerBasic&quot;: {&quot;attributes&quot;: {&quot;zoneName&quot;: {&quot;default&quot;: &quot;Unnamed Room&quot;}, &quot;icon&quot;: {&quot;default&quot;: &quot;&quot;}, &quot;configuration&quot;: {&quot;default&quot;: 0}, &quot;targetRoomName&quot;: {&quot;default&quot;: &quot;&quot;}, &quot;unpairedZoneName&quot;: {&quot;default&quot;: &quot;Unnamed Room&quot;, &quot;readPerm&quot;: &quot;0x00000000&quot;, &quot;writePerm&quot;: &quot;0x00000000&quot;}, &quot;unpairedIcon&quot;: {&quot;default&quot;: &quot;&quot;, &quot;readPerm&quot;: &quot;0x00000000&quot;, &quot;writePerm&quot;: &quot;0x00000000&quot;}, &quot;unpairedConfiguration&quot;: {&quot;default&quot;: 0, &quot;readPerm&quot;: &quot;0x00000000&quot;, &quot;writePerm&quot;: &quot;0x00000000&quot;}, &quot;unpairedStatusLight&quot;: {&quot;default&quot;: true, &quot;readPerm&quot;: &quot;0x00000000&quot;, &quot;writePerm&quot;: &quot;0x00000000&quot;}, &quot;unpairedButtonLockState&quot;: {&quot;default&quot;: false, &quot;readPerm&quot;: &quot;0x00000000&quot;, &quot;writePerm&quot;: &quot;0x00000000&quot;}}, &quot;schemaValidator&quot;: {&quot;type&quot;: &quot;object&quot;, &quot;properties&quot;: {&quot;attributes&quot;: {&quot;properties&quot;: {&quot;zoneName&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;maxLength&quot;: 64, &quot;minLength&quot;: 1, &quot;pattern&quot;: &quot;^(([^ \\\\n\\\\t].*[^ \\\\n\\\\t])|([^ \\\\n\\\\t]))$&quot;}, &quot;icon&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;maxLength&quot;: 128}, &quot;configuration&quot;: {&quot;type&quot;: &quot;integer&quot;, &quot;format&quot;: &quot;int32&quot;}, &quot;targetRoomName&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;maxLength&quot;: 64}, &quot;unpairedZoneName&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;maxLength&quot;: 64, &quot;minLength&quot;: 1, &quot;pattern&quot;: &quot;^(([^ \\\\n\\\\t].*[^ \\\\n\\\\t])|([^ \\\\n\\\\t]))$&quot;}, &quot;unpairedIcon&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;maxLength&quot;: 128}, &quot;unpairedConfiguration&quot;: {&quot;type&quot;: &quot;integer&quot;, &quot;format&quot;: &quot;int32&quot;}, &quot;unpairedStatusLight&quot;: {&quot;type&quot;: &quot;boolean&quot;}, &quot;unpairedButtonLockState&quot;: {&quot;type&quot;: &quot;boolean&quot;}}, &quot;additionalProperties&quot;: false}, &quot;schemaVersion&quot;: {&quot;type&quot;: &quot;integer&quot;, &quot;minimum&quot;: 1}, &quot;eTag&quot;: {&quot;allOf&quot;: [{&quot;type&quot;: &quot;string&quot;}]}, &quot;timestamp&quot;: {&quot;allOf&quot;: [{&quot;type&quot;: &quot;string&quot;, &quot;pattern&quot;: &quot;^[0-9]+$&quot;, &quot;maxLength&quot;: 20}]}}, &quot;required&quot;: [&quot;schemaVersion&quot;]}}}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/localsettings/playerBasic_attrdata.json</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 1.6 KB (1591 bytes)</li><li><strong>SHA-256:</strong> <code>3d0a4d482df44f5e4e39da4d59e3cad7ed7e528a5adb0b692c879c58c30f29f9</code></li></ul><p>Attribute-data schema for the playerBasic settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.</p></details><h3 id="playerui-attrdata-json" tabindex="-1"><code>playerUI_attrdata.json</code> <a class="header-anchor" href="#playerui-attrdata-json" aria-label="Permalink to &quot;\`playerUI_attrdata.json\`&quot;">​</a></h3><p>The settings-schema records for the player-facing interface options. These ship as templates; the live values you change are stored separately in the writable partition.</p><p><a href="/anacapad-internals/files/opt/localsettings/playerUI_attrdata.json">View</a> · <a href="/anacapad-internals/files/opt/localsettings/playerUI_attrdata.json">Download</a> · 560 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;playerUI&quot;: {&quot;attributes&quot;: {&quot;statusLight&quot;: {&quot;default&quot;: true, &quot;readPerm&quot;: &quot;0x00000004&quot;, &quot;writePerm&quot;: &quot;0x00000008&quot;}, &quot;buttonLockState&quot;: {&quot;default&quot;: false}}, &quot;schemaValidator&quot;: {&quot;type&quot;: &quot;object&quot;, &quot;properties&quot;: {&quot;attributes&quot;: {&quot;properties&quot;: {&quot;statusLight&quot;: {&quot;type&quot;: &quot;boolean&quot;}, &quot;buttonLockState&quot;: {&quot;type&quot;: &quot;boolean&quot;}}, &quot;additionalProperties&quot;: false}, &quot;schemaVersion&quot;: {&quot;type&quot;: &quot;integer&quot;, &quot;minimum&quot;: 1}, &quot;eTag&quot;: {&quot;allOf&quot;: [{&quot;type&quot;: &quot;string&quot;}]}, &quot;timestamp&quot;: {&quot;allOf&quot;: [{&quot;type&quot;: &quot;string&quot;, &quot;pattern&quot;: &quot;^[0-9]+$&quot;, &quot;maxLength&quot;: 20}]}}, &quot;required&quot;: [&quot;schemaVersion&quot;]}}}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/localsettings/playerUI_attrdata.json</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 560 B (560 bytes)</li><li><strong>SHA-256:</strong> <code>45ed16ae4064c927d1989f70d4486d1a6b7d90a5227e3fada01b7019e3fd067e</code></li></ul><p>Attribute-data schema for the playerUI settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.</p></details><h3 id="security-attrdata-json" tabindex="-1"><code>security_attrdata.json</code> <a class="header-anchor" href="#security-attrdata-json" aria-label="Permalink to &quot;\`security_attrdata.json\`&quot;">​</a></h3><p>The settings-schema records for security-relevant settings like credential and access-related keys. These ship as templates; the live values you change are stored separately in the writable partition.</p><p><a href="/anacapad-internals/files/opt/localsettings/security_attrdata.json">View</a> · <a href="/anacapad-internals/files/opt/localsettings/security_attrdata.json">Download</a> · 751 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;security&quot;: {&quot;attributes&quot;: {&quot;allowGuestAccess&quot;: {&quot;default&quot;: true}, &quot;allowInsecureUPnP&quot;: {&quot;default&quot;: true}, &quot;allowUnauthenticatedControl&quot;: {&quot;default&quot;: true}, &quot;authPin&quot;: {&quot;default&quot;: &quot;&quot;, &quot;readPerm&quot;: &quot;0x00000004&quot;, &quot;writePerm&quot;: &quot;0x00000004&quot;}}, &quot;schemaValidator&quot;: {&quot;type&quot;: &quot;object&quot;, &quot;properties&quot;: {&quot;attributes&quot;: {&quot;properties&quot;: {&quot;allowGuestAccess&quot;: {&quot;type&quot;: &quot;boolean&quot;}, &quot;allowInsecureUPnP&quot;: {&quot;type&quot;: &quot;boolean&quot;}, &quot;allowUnauthenticatedControl&quot;: {&quot;type&quot;: &quot;boolean&quot;}, &quot;authPin&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;maxLength&quot;: 64}}, &quot;additionalProperties&quot;: false}, &quot;schemaVersion&quot;: {&quot;type&quot;: &quot;integer&quot;, &quot;minimum&quot;: 1}, &quot;eTag&quot;: {&quot;allOf&quot;: [{&quot;type&quot;: &quot;string&quot;}]}, &quot;timestamp&quot;: {&quot;allOf&quot;: [{&quot;type&quot;: &quot;string&quot;, &quot;pattern&quot;: &quot;^[0-9]+$&quot;, &quot;maxLength&quot;: 20}]}}, &quot;required&quot;: [&quot;schemaVersion&quot;]}}}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/localsettings/security_attrdata.json</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 751 B (751 bytes)</li><li><strong>SHA-256:</strong> <code>a43e141699c153e8979a0f63af9e10a63cf6f98b5c3b8c5f5654f0799ec177c4</code></li></ul><p>Attribute-data schema for the security settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.</p></details><h3 id="settings-targettypes-json" tabindex="-1"><code>settings_targettypes.json</code> <a class="header-anchor" href="#settings-targettypes-json" aria-label="Permalink to &quot;\`settings_targettypes.json\`&quot;">​</a></h3><p>The master list of setting scopes: which settings apply to a whole household, which to a room, and which to a single speaker. The settings machinery uses it to decide where a change should be stored.</p><p><a href="/anacapad-internals/files/opt/localsettings/settings_targettypes.json">View</a> · <a href="/anacapad-internals/files/opt/localsettings/settings_targettypes.json">Download</a> · 128 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{&quot;fileFormatVersion&quot;: 1, &quot;targetTypes&quot;: {&quot;playerUI&quot;: &quot;LP&quot;, &quot;playerBasic&quot;: &quot;P&quot;, &quot;security&quot;: &quot;L&quot;, &quot;global&quot;: &quot;L&quot;, &quot;playback&quot;: &quot;L&quot;}}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/localsettings/settings_targettypes.json</code></li><li><strong>Category:</strong> config</li><li><strong>Size:</strong> 128 B (128 bytes)</li><li><strong>SHA-256:</strong> <code>58ddeee7de9389b2cd3dfc53d04746bf142b4f190b6b6b6010071ef499b6214d</code></li></ul><p>Target-type registry for the settings schema; defines the scope classes the settings validator routes keys into.</p></details><h2 id="base-system-files" tabindex="-1">Base system files <a class="header-anchor" href="#base-system-files" aria-label="Permalink to &quot;Base system files&quot;">​</a></h2><p>Standard Unix-era system files that every Linux-style appliance carries: the account list, the startup table, filesystem mounts, and network name resolution. They are unglamorous but they define the basic shape of the device as a small computer.</p><details class="details custom-block"><summary>Technical details</summary><p>Busybox-era /etc plumbing from the limelight buildroot: user database, init table, mount table, resolver config, and protocol/service name databases.</p></details><h3 id="configure" tabindex="-1"><code>Configure</code> <a class="header-anchor" href="#configure" aria-label="Permalink to &quot;\`Configure\`&quot;">​</a></h3><p>The legacy configuration entry point name used by older Sonos utilities: a small script-era file the toolchain still ships for compatibility.</p><p><a href="/anacapad-internals/files/etc/Configure">View</a> · <a href="/anacapad-internals/files/etc/Configure">Download</a> · 2.4 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 126 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;/etc/Configure: enter&quot; &gt; /dev/kmsg</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mount -t proc proc proc</span></span>
<span class="line"><span>mount -t sysfs sys sys</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/sbin/ifconfig lo 127.0.0.1 up</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mount -t ramfs ramfs /ramdisk</span></span>
<span class="line"><span>mkdir -m 777 -p /ramdisk/var \\</span></span>
<span class="line"><span>/ramdisk/var/run \\</span></span>
<span class="line"><span>/ramdisk/var/log \\</span></span>
<span class="line"><span>/ramdisk/tmp \\</span></span>
<span class="line"><span>/ramdisk/tmp/pub \\</span></span>
<span class="line"><span>/ramdisk/optlog \\</span></span>
<span class="line"><span>/ramdisk/smb \\</span></span>
<span class="line"><span>/dev/pts \\</span></span>
<span class="line"><span>/dev/mtd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ln -s ../mtd0 /dev/mtd/0</span></span>
<span class="line"><span>ln -s mtdblock4 /dev/nandjffs</span></span>
<span class="line"><span>ln -s mtd4 /dev/jffsmtd</span></span>
<span class="line"><span>. /etc/scripts/mount_jffs.sh</span></span>
<span class="line"><span>sonos_mount_jffs &gt;/dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mount -t devpts none /dev/pts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/etc/init.d/Srandom</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/sbin/insmod /modules/sonos_device.ko</span></span>
<span class="line"><span>/sbin/insmod /modules/chk.ko</span></span>
<span class="line"><span>/sbin/insmod /modules/hwevent_queue.ko</span></span>
<span class="line"><span>/sbin/insmod /modules/audiodev.ko</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -f /modules/ir_rcvr.ko ]; then</span></span>
<span class="line"><span>    /sbin/insmod /modules/ir_rcvr.ko</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>touch /var/run/sonosledmgrd.flash_booting_led</span></span>
<span class="line"><span>/sbin/frcheck</span></span>
<span class="line"><span>frcheck_stat=$?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ $frcheck_stat -ne 1 ]; then</span></span>
<span class="line"><span>  /opt/bin/sonosledmgrd --fr</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if [ $frcheck_stat -eq 0 ]; then</span></span>
<span class="line"><span>    /wifi/netstartd --hard-reset</span></span>
<span class="line"><span>  elif [ $frcheck_stat -eq 2 ]; then</span></span>
<span class="line"><span>    /wifi/netstartd --soft-reset</span></span>
<span class="line"><span>  fi</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mkdir -p /jffs/app/run \\</span></span>
<span class="line"><span>  /jffs/app/log \\</span></span>
<span class="line"><span>  /jffs/app/debug \\</span></span>
<span class="line"><span>  /jffs/app/debug/dsp \\</span></span>
<span class="line"><span>  /jffs/app/settings \\</span></span>
<span class="line"><span>  /jffs/sys/run \\</span></span>
<span class="line"><span>  /jffs/sys/log \\</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/Configure</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 2.4 KB (2488 bytes)</li><li><strong>SHA-256:</strong> <code>7820e289f6266bd6b11b02b979a700cb0c767417ef347676ac5969f26ca97460</code></li></ul><p>Historic configuration hook referenced by sibling tooling (Configure/Configure.dev naming appears in the jffs config layout too).</p></details><h3 id="arch" tabindex="-1"><code>arch</code> <a class="header-anchor" href="#arch" aria-label="Permalink to &quot;\`arch\`&quot;">​</a></h3><p>A small marker file naming the hardware architecture family the image was built for.</p><p><a href="/anacapad-internals/files/etc/arch">View</a> · <a href="/anacapad-internals/files/etc/arch">Download</a> · 10 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>limelight</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/arch</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 10 B (10 bytes)</li><li><strong>SHA-256:</strong> <code>e014957c02d19fce55760cb98e40b2613f849ac985abdeef6a7a267bf55e1065</code></li></ul><p>Records the limelight architecture identifier used by scripts and tooling.</p></details><h3 id="arch-attrs" tabindex="-1"><code>arch_attrs</code> <a class="header-anchor" href="#arch-attrs" aria-label="Permalink to &quot;\`arch_attrs\`&quot;">​</a></h3><p>Architecture attributes: a small data file describing the board family&#39;s properties for scripts that need to branch on hardware type.</p><p><a href="/anacapad-internals/files/etc/arch_attrs">View</a> · <a href="/anacapad-internals/files/etc/arch_attrs">Download</a> · 1020 B</p><details class="details custom-block"><summary>Preview</summary><p>First 54 of 54 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HAS_ORIENTATION_SENSOR</span></span>
<span class="line"><span>HAS_TV_INPUT</span></span>
<span class="line"><span>IS_CEP20</span></span>
<span class="line"><span>IS_HARDWARE</span></span>
<span class="line"><span>IS_HT_SOURCE</span></span>
<span class="line"><span>IS_HT_WIRELESS_PRIMARY</span></span>
<span class="line"><span>IS_STILL_MANUFACTURED</span></span>
<span class="line"><span>IS_ZONE_PLAYER</span></span>
<span class="line"><span>LACKS_ASAN</span></span>
<span class="line"><span>LACKS_AUDIO_ENCRYPTION</span></span>
<span class="line"><span>LACKS_BUTTONS_KERNEL_MODULE</span></span>
<span class="line"><span>LACKS_CLOCK_BOOTTIME</span></span>
<span class="line"><span>LACKS_DIAGS_BUILD</span></span>
<span class="line"><span>LACKS_DSMF</span></span>
<span class="line"><span>LACKS_DYNAMIC_DSP</span></span>
<span class="line"><span>LACKS_HEAPTRACK_SUPPORT</span></span>
<span class="line"><span>LACKS_KERNEL_SECTION_HEADER</span></span>
<span class="line"><span>LACKS_LKDTM</span></span>
<span class="line"><span>LACKS_MIXER_STATS</span></span>
<span class="line"><span>LACKS_MPEGDASH</span></span>
<span class="line"><span>LACKS_NATIVE_WAC</span></span>
<span class="line"><span>LACKS_OPUS</span></span>
<span class="line"><span>LACKS_SETUP_PIN</span></span>
<span class="line"><span>LACKS_STACK_USAGE</span></span>
<span class="line"><span>LACKS_TSAN</span></span>
<span class="line"><span>LACKS_UBSAN</span></span>
<span class="line"><span>LACKS_WIDEVINE</span></span>
<span class="line"><span>LEGACY_BACKTRACE_SUPPORT</span></span>
<span class="line"><span>MIGHT_SUPPORT_S1</span></span>
<span class="line"><span>SUPPORTS_ATHEROS_DIRECT_ATTACH</span></span>
<span class="line"><span>SUPPORTS_AUDIODEV</span></span>
<span class="line"><span>SUPPORTS_AUDIODEV_SENSOR_EVENTS</span></span>
<span class="line"><span>SUPPORTS_CHANNEL_SCAN</span></span>
<span class="line"><span>SUPPORTS_CHIRP_ROOM_DETECTION_SEND</span></span>
<span class="line"><span>SUPPORTS_CLONE_CHECK</span></span>
<span class="line"><span>SUPPORTS_CPU_TEMP_REPORT</span></span>
<span class="line"><span>SUPPORTS_DOLBY</span></span>
<span class="line"><span>SUPPORTS_DTS</span></span>
<span class="line"><span>SUPPORTS_DUAL_SUBS</span></span>
<span class="line"><span>SUPPORTS_EXTERNAL_EVENTS</span></span>
<span class="line"><span>SUPPORTS_FFMPEG_WMA</span></span>
<span class="line"><span>SUPPORTS_HWEVTQ</span></span>
<span class="line"><span>SUPPORTS_RDM</span></span>
<span class="line"><span>SUPPORTS_RX_HANG_CHECK</span></span>
<span class="line"><span>SUPPORTS_SOUNDSWAP</span></span>
<span class="line"><span>SUPPORTS_STATION</span></span>
<span class="line"><span>SUPPORTS_SYSSW_HAL</span></span>
<span class="line"><span>SUPPORTS_TXRX_STATS</span></span>
<span class="line"><span>SUPPORTS_V2_CERTS</span></span>
<span class="line"><span>SUPPORTS_VLI</span></span>
<span class="line"><span>SUPPORTS_WIRELESS_DISABLE</span></span>
<span class="line"><span>SUPPORTS_WIRELESS_SETUP</span></span>
<span class="line"><span>USES_LLA</span></span>
<span class="line"><span>USES_LONG_AMP_POWER_TIMEOUT</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/arch_attrs</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 1020 B (1020 bytes)</li><li><strong>SHA-256:</strong> <code>56c5c16a238b04190906c57e617e05a4e4dcbcdb18a3adc4a24f908b42bccf8b</code></li></ul><p>Architecture attribute table consumed by board-level scripts (see Configure and soc_arch).</p></details><h3 id="dhcp-script" tabindex="-1"><code>dhcp.script</code> <a class="header-anchor" href="#dhcp-script" aria-label="Permalink to &quot;\`dhcp.script\`&quot;">​</a></h3><p>The DHCP handler script: what the device does each time it receives an address from your router, including updating its name resolution and recording the lease details.</p><p><a href="/anacapad-internals/files/etc/dhcp.script">View</a> · <a href="/anacapad-internals/files/etc/dhcp.script">Download</a> · 1.2 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 54 of 54 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[ -z &quot;$1&quot; ] &amp;&amp; echo &quot;Error: should be called from udhcpc&quot; &amp;&amp; exit 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RESOLV_CONF=&quot;/etc/resolv.conf&quot;</span></span>
<span class="line"><span>[ -n &quot;$broadcast&quot; ] &amp;&amp; BROADCAST=&quot;broadcast $broadcast&quot;</span></span>
<span class="line"><span>[ -n &quot;$subnet&quot; ] &amp;&amp; NETMASK=&quot;netmask $subnet&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>case &quot;$1&quot; in</span></span>
<span class="line"><span>	nak)</span></span>
<span class="line"><span>		echo received a NAK: $message</span></span>
<span class="line"><span>		;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	deconfig)</span></span>
<span class="line"><span>		ifconfig $interface 0.0.0.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		route del 255.255.255.255 2&gt; /dev/null</span></span>
<span class="line"><span>		route add 255.255.255.255 $interface</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		route del -net 224.0.0.0 netmask 240.0.0.0 2&gt; /dev/null</span></span>
<span class="line"><span>		route add -net 224.0.0.0 netmask 240.0.0.0 $interface</span></span>
<span class="line"><span>		;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	renew|bound)</span></span>
<span class="line"><span>		echo -n &gt; $RESOLV_CONF</span></span>
<span class="line"><span>		[ -n &quot;$domain&quot; ] &amp;&amp; echo search $domain &gt;&gt; $RESOLV_CONF</span></span>
<span class="line"><span>		for i in $dns ; do</span></span>
<span class="line"><span>			echo adding dns $i</span></span>
<span class="line"><span>			echo nameserver $i &gt;&gt; $RESOLV_CONF</span></span>
<span class="line"><span>		done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		ifconfig $interface $ip $BROADCAST $NETMASK</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		if [ -n &quot;$router&quot; ] ; then</span></span>
<span class="line"><span>			while route del default gw 0.0.0.0 dev $interface 2&gt; /dev/null ; do</span></span>
<span class="line"><span>				:</span></span>
<span class="line"><span>			done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>			for i in $router ; do</span></span>
<span class="line"><span>				route add default gw $i dev $interface</span></span>
<span class="line"><span>			done</span></span>
<span class="line"><span>		fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		route del 255.255.255.255 2&gt; /dev/null</span></span>
<span class="line"><span>		route add 255.255.255.255 $interface</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		route del -net 224.0.0.0 netmask 240.0.0.0 2&gt; /dev/null</span></span>
<span class="line"><span>                route add -net 224.0.0.0 netmask 240.0.0.0 $interface</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		rm /var/run/waitforip 2&gt; /dev/null</span></span>
<span class="line"><span>		;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exit 0</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/dhcp.script</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 1.2 KB (1209 bytes)</li><li><strong>SHA-256:</strong> <code>e21b831e538f132d86422ead668e0f6e9c3e1d7c7f6a2e0aed4e0783e22c7f07</code></li></ul><p>udhcpc hook script; writes lease info and refreshes resolv.conf/hosts on the writable side.</p></details><h3 id="diagprocessd" tabindex="-1"><code>diagprocessd</code> <a class="header-anchor" href="#diagprocessd" aria-label="Permalink to &quot;\`diagprocessd\`&quot;">​</a></h3><p>The diagnostic coprocessor helper: a tiny FIFO-driven menu the factory uses to run production-line commands over a pipe interface.</p><p><a href="/anacapad-internals/files/etc/diagprocessd">View</a> · <a href="/anacapad-internals/files/etc/diagprocessd">Download</a> · 2.2 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 86 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span># -- WARNING ---- WARNING ---- WARNING ---- WARNING ---- WARNING --</span></span>
<span class="line"><span># DO NOT MODIFY BY HAND.</span></span>
<span class="line"><span># THIS IS AUTOMATICALLY GENERATED FROM: configs/arch/limelight.toml</span></span>
<span class="line"><span># ANY CHANGES MUST BE MADE ONLY TO THE CONFIG FILES, NOT HERE.</span></span>
<span class="line"><span># -- WARNING ---- WARNING ---- WARNING ---- WARNING ---- WARNING --</span></span>
<span class="line"><span></span></span>
<span class="line"><span>stdin=/tmp/diagstdin</span></span>
<span class="line"><span>stdout=/tmp/diagstdout</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ ! -p $stdin ]; then</span></span>
<span class="line"><span>    mkfifo $stdin</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ ! -p $stdout ]; then</span></span>
<span class="line"><span>    mkfifo $stdout</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>while true</span></span>
<span class="line"><span>do</span></span>
<span class="line"><span>    if read line &lt; $stdin; then</span></span>
<span class="line"><span>        case &quot;$line&quot; in</span></span>
<span class="line"><span>            0)</span></span>
<span class="line"><span>                /bin/date &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            1)</span></span>
<span class="line"><span>                /bin/ls --full-time /jffs/app/debug /jffs/sys/debug /jffs/net/debug &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            2)</span></span>
<span class="line"><span>                /bin/df &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            3)</span></span>
<span class="line"><span>                /usr/bin/du -a -d 5 -k -x /jffs | sort -rn | head -n100 &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            4)</span></span>
<span class="line"><span>                /usr/bin/free &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            5)</span></span>
<span class="line"><span>                /sbin/ifconfig &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            6)</span></span>
<span class="line"><span>                /sbin/lsmod &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            7)</span></span>
<span class="line"><span>                /bin/mount &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            8)</span></span>
<span class="line"><span>                /bin/netstat -an &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            9)</span></span>
<span class="line"><span>                /bin/ps &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            10)</span></span>
<span class="line"><span>                /sbin/route -n &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            11)</span></span>
<span class="line"><span>                /usr/sbin/brctl showmacs br0 &gt; $stdout 2&gt;&amp;1</span></span>
<span class="line"><span>                ;;</span></span>
<span class="line"><span>            12)</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/diagprocessd</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 2.2 KB (2304 bytes)</li><li><strong>SHA-256:</strong> <code>b5489037250b71ffaf6f6bf22192730dd9b36da829141a0ef886dd157285a079</code></li></ul><p>mkfifo-based command loop (diagstdin/diagstdout) dispatching numbered commands; generated from configs/arch/limelight.toml per the build system.</p></details><h3 id="fallback-trusted-roots-rcb" tabindex="-1"><code>fallback_trusted_roots.rcb</code> <a class="header-anchor" href="#fallback-trusted-roots-rcb" aria-label="Permalink to &quot;\`fallback_trusted_roots.rcb\`&quot;">​</a></h3><p>The backup set of root certificates: the trust anchors the player uses to check secure connections when its primary bundle is unavailable or being updated. It is the device&#39;s emergency list of who to trust.</p><p><a href="/anacapad-internals/files/etc/fallback_trusted_roots.rcb">Download</a> · 26.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/fallback_trusted_roots.rcb</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 26.6 KB (27215 bytes)</li><li><strong>SHA-256:</strong> <code>e47699bd55299b5447add14a24a04a1a1044648755ce5637267fe634aa34139e</code></li></ul><p>RCB-format certificate bundle under /etc; managed by libsonos-certval with runtime bundle updates watched for (documented under libsonos_certval).</p></details><h3 id="fstab" tabindex="-1"><code>fstab</code> <a class="header-anchor" href="#fstab" aria-label="Permalink to &quot;\`fstab\`&quot;">​</a></h3><p>The filesystem mount table: which storage areas exist (system files, the writable settings partition, temporary memory disks) and where they attach. It explains why settings survive reboots while scratch space does not.</p><p><a href="/anacapad-internals/files/etc/fstab">View</a> · <a href="/anacapad-internals/files/etc/fstab">Download</a> · 501 B</p><details class="details custom-block"><summary>Preview</summary><p>First 8 of 8 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /etc/fstab: static file system information.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># &lt;file system&gt; &lt;mount point&gt;   &lt;type&gt;  &lt;options&gt;               &lt;dump&gt;  &lt;pass&gt;</span></span>
<span class="line"><span>#/dev/root       /               auto    defaults,errors=remount-ro      0 0</span></span>
<span class="line"><span>/dev/mapper/crroot	/	auto	noatime,nodiratime,defaults     0 0</span></span>
<span class="line"><span>proc            /proc           proc    defaults                        0 0</span></span>
<span class="line"><span>none            /dev/pts        devpts  gid=5,mode=620                  0 0</span></span>
<span class="line"><span>tmpfs           /dev/shm        tmpfs   defaults,noexec,nodev,nosuid,mode=600  0 0</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/fstab</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 501 B (501 bytes)</li><li><strong>SHA-256:</strong> <code>f8d2d28e0d0f6c3f37b2a5635f02d9801d5f9b5b7e257891fe79ac6b19706af4</code></li></ul><p>Mounts jffs2 (persistent) alongside tmpfs runtime dirs; the rootfs itself is read-only squashfs.</p></details><h3 id="group" tabindex="-1"><code>group</code> <a class="header-anchor" href="#group" aria-label="Permalink to &quot;\`group\`&quot;">​</a></h3><p>The group list matching the account file: which user groups exist on the device.</p><p><a href="/anacapad-internals/files/etc/group">View</a> · <a href="/anacapad-internals/files/etc/group">Download</a> · 504 B</p><details class="details custom-block"><summary>Preview</summary><p>First 44 of 44 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>root:x:0:</span></span>
<span class="line"><span>daemon:x:1:</span></span>
<span class="line"><span>bin:x:2:</span></span>
<span class="line"><span>sys:x:3:</span></span>
<span class="line"><span>adm:x:4:</span></span>
<span class="line"><span>tty:x:5:</span></span>
<span class="line"><span>disk:x:6:</span></span>
<span class="line"><span>lp:x:7:</span></span>
<span class="line"><span>mail:x:8:</span></span>
<span class="line"><span>news:x:9:</span></span>
<span class="line"><span>uucp:x:10:</span></span>
<span class="line"><span>man:x:12:</span></span>
<span class="line"><span>proxy:x:13:</span></span>
<span class="line"><span>kmem:x:15:</span></span>
<span class="line"><span>chrony:x:19:</span></span>
<span class="line"><span>sonos:x:20:</span></span>
<span class="line"><span>fax:x:21:</span></span>
<span class="line"><span>voice:x:22:</span></span>
<span class="line"><span>cdrom:x:24:</span></span>
<span class="line"><span>floppy:x:25:</span></span>
<span class="line"><span>tape:x:26:</span></span>
<span class="line"><span>sudo:x:27:</span></span>
<span class="line"><span>audio:x:29:</span></span>
<span class="line"><span>dip:x:30:</span></span>
<span class="line"><span>www-data:x:33:</span></span>
<span class="line"><span>backup:x:34:</span></span>
<span class="line"><span>operator:x:37:</span></span>
<span class="line"><span>list:x:38:</span></span>
<span class="line"><span>irc:x:39:</span></span>
<span class="line"><span>src:x:40:</span></span>
<span class="line"><span>gnats:x:41:</span></span>
<span class="line"><span>shadow:x:42:</span></span>
<span class="line"><span>utmp:x:43:</span></span>
<span class="line"><span>video:x:44:</span></span>
<span class="line"><span>sasl:x:45:</span></span>
<span class="line"><span>plugdev:x:46:</span></span>
<span class="line"><span>kvm:x:47:</span></span>
<span class="line"><span>sgx:x:48:</span></span>
<span class="line"><span>staff:x:50:</span></span>
<span class="line"><span>games:x:60:</span></span>
<span class="line"><span>shutdown:x:70:</span></span>
<span class="line"><span>wheel:x:80:</span></span>
<span class="line"><span>users:x:100:</span></span>
<span class="line"><span>nogroup:x:65534:</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/group</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 504 B (504 bytes)</li><li><strong>SHA-256:</strong> <code>662a6eac5e3759afce5eaee7200c75525d8ffae965c9d958a60d5a9d8180668c</code></li></ul><p>Standard group file; mostly stock groups plus the anacapa service account.</p></details><h3 id="hosts-orig" tabindex="-1"><code>hosts.orig</code> <a class="header-anchor" href="#hosts-orig" aria-label="Permalink to &quot;\`hosts.orig\`&quot;">​</a></h3><p>The original hosts file: a few built-in name shortcuts the firmware ships with before the system generates its working copy at boot.</p><p><a href="/anacapad-internals/files/etc/hosts.orig">View</a> · <a href="/anacapad-internals/files/etc/hosts.orig">Download</a> · 100 B</p><details class="details custom-block"><summary>Preview</summary><p>First 3 of 3 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1       localhost.localdomain   localhost</span></span>
<span class="line"><span>255.255.255.255 all-ones                all-ones</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/hosts.orig</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 100 B (100 bytes)</li><li><strong>SHA-256:</strong> <code>cc9e641227208bec49d4f7b234aeb564656daa63b4ab542e4a70cba6c12bb828</code></li></ul><p>Template copied to /jffs/hosts during bring-up (the generated live file sits on the writable side).</p></details><h3 id="inittab" tabindex="-1"><code>inittab</code> <a class="header-anchor" href="#inittab" aria-label="Permalink to &quot;\`inittab\`&quot;">​</a></h3><p>The startup table: the ordered list of what the device runs when it boots, including which console and service launchers come up and in what order. It is the first page of the boot story.</p><p><a href="/anacapad-internals/files/etc/inittab">View</a> · <a href="/anacapad-internals/files/etc/inittab">Download</a> · 679 B</p><details class="details custom-block"><summary>Preview</summary><p>First 14 of 14 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># autogenerated by gen_inittab.py for ARCH limelight; DO NOT EDIT</span></span>
<span class="line"><span>::sysinit:/etc/Configure &gt; /dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span>null::respawn:/etc/scripts/run_sshd.sh &gt; /dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span>null::respawn:/etc/runledmgrd &gt; /dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span>null::respawn:/etc/runnetstartd &gt; /dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span>null::respawn:/etc/runmdns &gt; /dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span>null::respawn:/etc/rundiagprocessd &gt; /dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span>null::respawn:/etc/runanacapa &gt; /dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span>null::respawn:/etc/runchrony &gt; /dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span>null::respawn:/etc/runsddp &gt; /dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span>null::respawn:/usr/sbin/secure_console_login.sh /dev/ttyS0 0 -n -l /usr/sbin/secure_console.sh &gt; /dev/kmsg 2&gt;&amp;1</span></span>
<span class="line"><span>::ctrlaltdel:/sbin/reboot</span></span>
<span class="line"><span>::shutdown:/etc/init.d/rcK</span></span>
<span class="line"><span>::restart:/sbin/init</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/inittab</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 679 B (679 bytes)</li><li><strong>SHA-256:</strong> <code>44c96d00788087c4e852552c19a557abe6642b4fcdfc4ef543a53dc1ad32a3ec</code></li></ul><p>SysV-style inittab for busybox init; wires getty, the rc.d runlevels, and the rcK shutdown sequence.</p></details><h3 id="inputrc" tabindex="-1"><code>inputrc</code> <a class="header-anchor" href="#inputrc" aria-label="Permalink to &quot;\`inputrc\`&quot;">​</a></h3><p>Readline keybinding configuration: how command-line editing behaves in an interactive shell session.</p><p><a href="/anacapad-internals/files/etc/inputrc">View</a> · <a href="/anacapad-internals/files/etc/inputrc">Download</a> · 421 B</p><details class="details custom-block"><summary>Preview</summary><p>First 12 of 12 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /etc/inputrc - global inputrc for libreadline</span></span>
<span class="line"><span># See readline(3readline) and \`info readline&#39; for more information.</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Be 8 bit clean.</span></span>
<span class="line"><span>set input-meta on</span></span>
<span class="line"><span>set output-meta on</span></span>
<span class="line"><span></span></span>
<span class="line"><span># To allow the use of 8bit-characters like the german umlauts, comment out</span></span>
<span class="line"><span># the line below. However this makes the meta key not work as a meta key,</span></span>
<span class="line"><span># which is annoying to those which don&#39;t need to type in 8-bit characters.</span></span>
<span class="line"><span></span></span>
<span class="line"><span># set convert-meta off</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/inputrc</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 421 B (421 bytes)</li><li><strong>SHA-256:</strong> <code>01946fd5134804a8f5ba087fb4fe9dbf17f450213e8a47b9973eec167a588fd2</code></li></ul><p>Standard inputrc for readline-based shells.</p></details><h3 id="issue" tabindex="-1"><code>issue</code> <a class="header-anchor" href="#issue" aria-label="Permalink to &quot;\`issue\`&quot;">​</a></h3><p>The login banner text shown before a login prompt on a console. On most appliances it is leftover decoration, but it is part of the image.</p><p><a href="/anacapad-internals/files/etc/issue">View</a> · <a href="/anacapad-internals/files/etc/issue">Download</a> · 29 B</p><details class="details custom-block"><summary>Preview</summary><p>First 3 of 3 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>Welcome to Rincon Networks</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/issue</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 29 B (29 bytes)</li><li><strong>SHA-256:</strong> <code>c99e814fd5e8a7a6753ab2a693bc2451f225d64723f8e513b11dddc158ebe19a</code></li></ul><p>Stock /etc/issue banner.</p></details><h3 id="issue-net" tabindex="-1"><code>issue.net</code> <a class="header-anchor" href="#issue-net" aria-label="Permalink to &quot;\`issue.net\`&quot;">​</a></h3><p>The network variant of the login banner, shown by remote login services such as the SSH daemon when a session opens.</p><p><a href="/anacapad-internals/files/etc/issue.net">View</a> · <a href="/anacapad-internals/files/etc/issue.net">Download</a> · 38 B</p><details class="details custom-block"><summary>Preview</summary><p>First 4 of 4 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>Welcome to Rincon Networks</span></span>
<span class="line"><span>%s/%m %r</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/issue.net</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 38 B (38 bytes)</li><li><strong>SHA-256:</strong> <code>b2efa8dd090865fb16c2a2246992cdc1514fb6afa1589627f80cf72fef62e7c5</code></li></ul><p>Banner presented by dropbear/ssh on connect.</p></details><h3 id="motd" tabindex="-1"><code>motd</code> <a class="header-anchor" href="#motd" aria-label="Permalink to &quot;\`motd\`&quot;">​</a></h3><p>The &#39;message of the day&#39; text shown after login. On a shipping appliance it is usually a placeholder.</p><p><a href="/anacapad-internals/files/etc/motd">View</a> · <a href="/anacapad-internals/files/etc/motd">Download</a> · 29 B</p><details class="details custom-block"><summary>Preview</summary><p>First 3 of 3 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>Welcome to Rincon Networks</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/motd</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 29 B (29 bytes)</li><li><strong>SHA-256:</strong> <code>c99e814fd5e8a7a6753ab2a693bc2451f225d64723f8e513b11dddc158ebe19a</code></li></ul><p>Standard motd file.</p></details><h3 id="mtab" tabindex="-1"><code>mtab</code> <a class="header-anchor" href="#mtab" aria-label="Permalink to &quot;\`mtab\`&quot;">​</a></h3><p>The file reporting which filesystems are currently mounted. On this build it is a link into the kernel&#39;s live mount list rather than a static file.</p><p><a href="/anacapad-internals/files/etc/mtab">View</a> · <a href="/anacapad-internals/files/etc/mtab">Download</a> · 193 B</p><details class="details custom-block"><summary>Preview</summary><p>First 7 of 7 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>rootfs / rootfs rw 0 0</span></span>
<span class="line"><span>/dev/root / ext3 rw 0 0</span></span>
<span class="line"><span>/proc /proc proc rw 0 0</span></span>
<span class="line"><span>usbdevfs /proc/bus/usb usbdevfs rw 0 0</span></span>
<span class="line"><span>/dev/hda1 /boot ext3 rw 0 0</span></span>
<span class="line"><span>none /dev/pts devpts rw 0 0</span></span>
<span class="line"><span>none /dev/shm tmpfs rw 0 0</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/mtab</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 193 B (193 bytes)</li><li><strong>SHA-256:</strong> <code>2b4f42d7e66f82fe677f6b514512f877cee048147a8ccdd87a33848d882c2206</code></li></ul><p>Symlink to /proc/mounts (live kernel view), standard on embedded systems.</p></details><h3 id="passwd" tabindex="-1"><code>passwd</code> <a class="header-anchor" href="#passwd" aria-label="Permalink to &quot;\`passwd\`&quot;">​</a></h3><p>The device&#39;s account list: which usernames exist on the box (root, the web user, the player software&#39;s own user, and the usual service accounts). This is the classic Unix roster, present on almost every Linux appliance.</p><p><a href="/anacapad-internals/files/etc/passwd">View</a> · <a href="/anacapad-internals/files/etc/passwd">Download</a> · 868 B</p><details class="details custom-block"><summary>Preview</summary><p>First 20 of 20 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>root:x:0:0:root:/:/bin/sh</span></span>
<span class="line"><span>daemon:x:1:1:daemon:/usr/sbin:/sbin/nologin</span></span>
<span class="line"><span>bin:x:2:2:bin:/bin:/sbin/nologin</span></span>
<span class="line"><span>sys:x:3:3:sys:/dev:/sbin/nologin</span></span>
<span class="line"><span>sync:x:4:65534:sync:/bin:/bin/sync</span></span>
<span class="line"><span>games:x:5:60:games:/usr/games:/sbin/nologin</span></span>
<span class="line"><span>man:x:6:12:man:/var/cache/man:/sbin/nologin</span></span>
<span class="line"><span>lp:x:7:7:lp:/var/spool/lpd:/sbin/nologin</span></span>
<span class="line"><span>mail:x:8:8:mail:/var/mail:/sbin/nologin</span></span>
<span class="line"><span>news:x:9:9:news:/var/spool/news:/sbin/nologin</span></span>
<span class="line"><span>uucp:x:10:10:uucp:/var/spool/uucp:/sbin/nologin</span></span>
<span class="line"><span>proxy:x:13:13:proxy:/bin:/sbin/nologin</span></span>
<span class="line"><span>chrony:x:19:19::/tmp:/bin/false</span></span>
<span class="line"><span>anacapa:x:20:20::/tmp:/bin/false</span></span>
<span class="line"><span>www-data:x:33:33:www-data:/var/www:/sbin/nologin</span></span>
<span class="line"><span>backup:x:34:34:backup:/var/backups:/sbin/nologin</span></span>
<span class="line"><span>list:x:38:38:Mailing List Manager:/var/list:/sbin/nologin</span></span>
<span class="line"><span>irc:x:39:39:ircd:/run/ircd:/sbin/nologin</span></span>
<span class="line"><span>gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/sbin/nologin</span></span>
<span class="line"><span>nobody:x:65534:65534:nobody:/nonexistent:/sbin/nologin</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/passwd</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 868 B (868 bytes)</li><li><strong>SHA-256:</strong> <code>a44fe8e73007ba8dba381d054e99bda955bb1a7d39ed5403187a40be906296b8</code></li></ul><p>Standard passwd file. No password hashes here (those live in shadow); notable entries: root, chrony, anacapa (uid 20), www-data.</p></details><h3 id="pointercal" tabindex="-1"><code>pointercal</code> <a class="header-anchor" href="#pointercal" aria-label="Permalink to &quot;\`pointercal\`&quot;">​</a></h3><p>Touchscreen calibration parameters. The Playbar has no touchscreen; this file is inherited from the shared base image that also serves products that do.</p><p><a href="/anacapad-internals/files/etc/pointercal">View</a> · <a href="/anacapad-internals/files/etc/pointercal">Download</a> · 14 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1 0 0 0 1 0 1</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/pointercal</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 14 B (14 bytes)</li><li><strong>SHA-256:</strong> <code>2e7213cec5f47e7e9aade9d17b6d565d64395a39a1117f6dac56ce079478a84b</code></li></ul><p>Calibrate-touchscreen constants retained from the common buildroot; vestigial on this model.</p></details><h3 id="profile" tabindex="-1"><code>profile</code> <a class="header-anchor" href="#profile" aria-label="Permalink to &quot;\`profile\`&quot;">​</a></h3><p>The shell profile: environment defaults applied when a login shell starts, such as search paths for commands.</p><p><a href="/anacapad-internals/files/etc/profile">View</a> · <a href="/anacapad-internals/files/etc/profile">Download</a> · 375 B</p><details class="details custom-block"><summary>Preview</summary><p>First 18 of 18 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /etc/profile: system-wide .profile file for the Bourne shell (sh(1))</span></span>
<span class="line"><span># and Bourne compatible shells (bash(1), ksh(1), ash(1), ...).</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PATH=&quot;/usr/bin:/bin:/usr/sbin:/sbin&quot;</span></span>
<span class="line"><span>if [ -f /proc/sonos-lock/fallback_state ] ; then</span></span>
<span class="line"><span>	if [ &quot;\`cat /proc/sonos-lock/fallback_state\`&quot; != &quot;0&quot; ]; then</span></span>
<span class="line"><span>		PS1=&#39;Fallback# &#39; ;</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>		PS1=&#39;# &#39; ;</span></span>
<span class="line"><span>	fi</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>	PS1=&#39;# &#39; ;</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export PATH PS1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>umask 022</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/profile</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 375 B (375 bytes)</li><li><strong>SHA-256:</strong> <code>3b4fd21ee8a7ad3a7de4894e7515759cfaf54cf0448810e900a1bc11a7fe5275</code></li></ul><p>System-wide shell profile for the busybox environment.</p></details><h3 id="protocols" tabindex="-1"><code>protocols</code> <a class="header-anchor" href="#protocols" aria-label="Permalink to &quot;\`protocols\`&quot;">​</a></h3><p>The protocol-name database: the table mapping names like &#39;tcp&#39; and &#39;udp&#39; to their protocol numbers, a classic Unix leftover that networking tools still consult.</p><p><a href="/anacapad-internals/files/etc/protocols">View</a> · <a href="/anacapad-internals/files/etc/protocols">Download</a> · 5.7 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 149 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /etc/protocols:</span></span>
<span class="line"><span># $Id: protocols,v 1.3 2001/07/07 07:07:15 nalin Exp $</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Internet (IP) protocols</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>#	from: @(#)protocols	5.1 (Berkeley) 4/17/89</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Updated for NetBSD based on RFC 1340, Assigned Numbers (July 1992).</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># See also http://www.iana.org/assignments/protocol-numbers</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ip	0	IP		# internet protocol, pseudo protocol number</span></span>
<span class="line"><span>#hopopt	0	HOPOPT		# hop-by-hop options for ipv6</span></span>
<span class="line"><span>icmp	1	ICMP		# internet control message protocol</span></span>
<span class="line"><span>igmp	2	IGMP		# internet group management protocol</span></span>
<span class="line"><span>ggp	3	GGP		# gateway-gateway protocol</span></span>
<span class="line"><span>ipencap	4	IP-ENCAP	# IP encapsulated in IP (officially \`\`IP&#39;&#39;)</span></span>
<span class="line"><span>st	5	ST		# ST datagram mode</span></span>
<span class="line"><span>tcp	6	TCP		# transmission control protocol</span></span>
<span class="line"><span>cbt	7	CBT		# CBT, Tony Ballardie &lt;A.Ballardie@cs.ucl.ac.uk&gt;</span></span>
<span class="line"><span>egp	8	EGP		# exterior gateway protocol</span></span>
<span class="line"><span>igp	9	IGP		# any private interior gateway (Cisco: for IGRP)</span></span>
<span class="line"><span>bbn-rcc	10	BBN-RCC-MON	# BBN RCC Monitoring</span></span>
<span class="line"><span>nvp	11	NVP-II		# Network Voice Protocol</span></span>
<span class="line"><span>pup	12	PUP		# PARC universal packet protocol</span></span>
<span class="line"><span>argus	13	ARGUS		# ARGUS</span></span>
<span class="line"><span>emcon	14	EMCON		# EMCON</span></span>
<span class="line"><span>xnet	15	XNET		# Cross Net Debugger</span></span>
<span class="line"><span>chaos	16	CHAOS		# Chaos</span></span>
<span class="line"><span>udp	17	UDP		# user datagram protocol</span></span>
<span class="line"><span>mux	18	MUX		# Multiplexing protocol</span></span>
<span class="line"><span>dcn	19	DCN-MEAS	# DCN Measurement Subsystems</span></span>
<span class="line"><span>hmp	20	HMP		# host monitoring protocol</span></span>
<span class="line"><span>prm	21	PRM		# packet radio measurement protocol</span></span>
<span class="line"><span>xns-idp	22	XNS-IDP		# Xerox NS IDP</span></span>
<span class="line"><span>trunk-1	23	TRUNK-1		# Trunk-1</span></span>
<span class="line"><span>trunk-2	24	TRUNK-2		# Trunk-2</span></span>
<span class="line"><span>leaf-1	25	LEAF-1		# Leaf-1</span></span>
<span class="line"><span>leaf-2	26	LEAF-2		# Leaf-2</span></span>
<span class="line"><span>rdp	27	RDP		# &quot;reliable datagram&quot; protocol</span></span>
<span class="line"><span>irtp	28	IRTP		# Internet Reliable Transaction Protocol</span></span>
<span class="line"><span>iso-tp4	29	ISO-TP4		# ISO Transport Protocol Class 4</span></span>
<span class="line"><span>netblt	30	NETBLT		# Bulk Data Transfer Protocol</span></span>
<span class="line"><span>mfe-nsp	31	MFE-NSP		# MFE Network Services Protocol</span></span>
<span class="line"><span>merit-inp	32	MERIT-INP	# MERIT Internodal Protocol</span></span>
<span class="line"><span>sep	33	SEP		# Sequential Exchange Protocol</span></span>
<span class="line"><span>3pc	34	3PC		# Third Party Connect Protocol</span></span>
<span class="line"><span>idpr	35	IDPR		# Inter-Domain Policy Routing Protocol</span></span>
<span class="line"><span>xtp	36	XTP		# Xpress Tranfer Protocol</span></span>
<span class="line"><span>ddp	37	DDP		# Datagram Delivery Protocol</span></span>
<span class="line"><span>idpr-cmtp	38	IDPR-CMTP	# IDPR Control Message Transport Proto</span></span>
<span class="line"><span>tp++	39	TP++		# TP++ Transport Protocol</span></span>
<span class="line"><span>il	40	IL		# IL Transport Protocol</span></span>
<span class="line"><span>ipv6	41	IPv6		# IPv6</span></span>
<span class="line"><span>sdrp	42	SDRP		# Source Demand Routing Protocol</span></span>
<span class="line"><span>ipv6-route	43	IPv6-Route 	# Routing Header for IPv6</span></span>
<span class="line"><span>ipv6-frag	44	IPv6-Frag	# Fragment Header for IPv6</span></span>
<span class="line"><span>idrp	45	IDRP		# Inter-Domain Routing Protocol</span></span>
<span class="line"><span>rsvp	46	RSVP		# Resource ReSerVation Protocol</span></span>
<span class="line"><span>gre	47	GRE		# Generic Routing Encapsulation</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/protocols</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 5.7 KB (5834 bytes)</li><li><strong>SHA-256:</strong> <code>aa00b2cb0b6f77291c6e244774438f367e1407cb96e6c76189451243c26d9ca1</code></li></ul><p>Standard protocols database.</p></details><h3 id="rpc" tabindex="-1"><code>rpc</code> <a class="header-anchor" href="#rpc" aria-label="Permalink to &quot;\`rpc\`&quot;">​</a></h3><p>The RPC program-number table, another standard Unix database file mapping remote-procedure names to numbers.</p><p><a href="/anacapad-internals/files/etc/rpc">View</a> · <a href="/anacapad-internals/files/etc/rpc">Download</a> · 1.6 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 68 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ident	&quot;@(#)rpc	1.11	95/07/14 SMI&quot;	/* SVr4.0 1.2	*/</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>#	rpc</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>portmapper	100000	portmap sunrpc rpcbind</span></span>
<span class="line"><span>rstatd		100001	rstat rup perfmeter rstat_svc</span></span>
<span class="line"><span>rusersd		100002	rusers</span></span>
<span class="line"><span>nfs		100003	nfsprog</span></span>
<span class="line"><span>ypserv		100004	ypprog</span></span>
<span class="line"><span>mountd		100005	mount showmount</span></span>
<span class="line"><span>ypbind		100007</span></span>
<span class="line"><span>walld		100008	rwall shutdown</span></span>
<span class="line"><span>yppasswdd	100009	yppasswd</span></span>
<span class="line"><span>etherstatd	100010	etherstat</span></span>
<span class="line"><span>rquotad		100011	rquotaprog quota rquota</span></span>
<span class="line"><span>sprayd		100012	spray</span></span>
<span class="line"><span>3270_mapper	100013</span></span>
<span class="line"><span>rje_mapper	100014</span></span>
<span class="line"><span>selection_svc	100015	selnsvc</span></span>
<span class="line"><span>database_svc	100016</span></span>
<span class="line"><span>rexd		100017	rex</span></span>
<span class="line"><span>alis		100018</span></span>
<span class="line"><span>sched		100019</span></span>
<span class="line"><span>llockmgr	100020</span></span>
<span class="line"><span>nlockmgr	100021</span></span>
<span class="line"><span>x25.inr		100022</span></span>
<span class="line"><span>statmon		100023</span></span>
<span class="line"><span>status		100024</span></span>
<span class="line"><span>bootparam	100026</span></span>
<span class="line"><span>ypupdated	100028	ypupdate</span></span>
<span class="line"><span>keyserv		100029	keyserver</span></span>
<span class="line"><span>sunlink_mapper	100033</span></span>
<span class="line"><span>tfsd		100037</span></span>
<span class="line"><span>nsed		100038</span></span>
<span class="line"><span>nsemntd		100039</span></span>
<span class="line"><span>showfhd		100043	showfh</span></span>
<span class="line"><span>ioadmd		100055	rpc.ioadmd</span></span>
<span class="line"><span>NETlicense	100062</span></span>
<span class="line"><span>sunisamd	100065</span></span>
<span class="line"><span>debug_svc 	100066  dbsrv</span></span>
<span class="line"><span>ypxfrd		100069  rpc.ypxfrd</span></span>
<span class="line"><span>bugtraqd	100071</span></span>
<span class="line"><span>kerbd		100078</span></span>
<span class="line"><span>event		100101	na.event	# SunNet Manager</span></span>
<span class="line"><span>logger		100102	na.logger	# SunNet Manager</span></span>
<span class="line"><span>sync		100104	na.sync</span></span>
<span class="line"><span>hostperf	100107	na.hostperf</span></span>
<span class="line"><span>activity	100109	na.activity	# SunNet Manager</span></span>
<span class="line"><span>hostmem		100112	na.hostmem</span></span>
<span class="line"><span>sample		100113	na.sample</span></span>
<span class="line"><span>x25		100114	na.x25</span></span>
<span class="line"><span>ping		100115	na.ping</span></span>
<span class="line"><span>rpcnfs		100116	na.rpcnfs</span></span>
<span class="line"><span>hostif		100117	na.hostif</span></span>
<span class="line"><span>etherif		100118	na.etherif</span></span>
<span class="line"><span>iproutes	100120	na.iproutes</span></span>
<span class="line"><span>layers		100121	na.layers</span></span>
<span class="line"><span>snmp		100122	na.snmp snmp-cmc snmp-synoptics snmp-unisys snmp-utk</span></span>
<span class="line"><span>traffic		100123	na.traffic</span></span>
<span class="line"><span>nfs_acl		100227</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/rpc</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 1.6 KB (1595 bytes)</li><li><strong>SHA-256:</strong> <code>ebc43541c32b314942f92b105755b192ac8451e0e50e9a5c196e3b02c4a789a7</code></li></ul><p>Standard RPC database; part of the buildroot base image.</p></details><h3 id="services" tabindex="-1"><code>services</code> <a class="header-anchor" href="#services" aria-label="Permalink to &quot;\`services\`&quot;">​</a></h3><p>The service-name database: which named services correspond to which port numbers (http = 80 and so on). Networking code consults it when translating names.</p><p><a href="/anacapad-internals/files/etc/services">View</a> · <a href="/anacapad-internals/files/etc/services">Download</a> · 15.0 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 407 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># /etc/services:</span></span>
<span class="line"><span># $Id: services,v 1.4 1997/05/20 19:41:21 tobias Exp $</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Network services, Internet style</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Note that it is presently the policy of IANA to assign a single well-known</span></span>
<span class="line"><span># port number for both TCP and UDP; hence, most entries here have two entries</span></span>
<span class="line"><span># even if the protocol doesn&#39;t support UDP operations.</span></span>
<span class="line"><span># Updated from RFC 1700, \`\`Assigned Numbers&#39;&#39; (October 1994).  Not all ports</span></span>
<span class="line"><span># are included, only the more common ones.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tcpmux		1/tcp				# TCP port service multiplexer</span></span>
<span class="line"><span>echo		7/tcp</span></span>
<span class="line"><span>echo		7/udp</span></span>
<span class="line"><span>discard		9/tcp		sink null</span></span>
<span class="line"><span>discard		9/udp		sink null</span></span>
<span class="line"><span>systat		11/tcp		users</span></span>
<span class="line"><span>daytime		13/tcp</span></span>
<span class="line"><span>daytime		13/udp</span></span>
<span class="line"><span>netstat		15/tcp</span></span>
<span class="line"><span>qotd		17/tcp		quote</span></span>
<span class="line"><span>msp		18/tcp				# message send protocol</span></span>
<span class="line"><span>msp		18/udp				# message send protocol</span></span>
<span class="line"><span>chargen		19/tcp		ttytst source</span></span>
<span class="line"><span>chargen		19/udp		ttytst source</span></span>
<span class="line"><span>ftp-data	20/tcp</span></span>
<span class="line"><span>ftp		21/tcp</span></span>
<span class="line"><span>fsp		21/udp		fspd</span></span>
<span class="line"><span>ssh		22/tcp				# SSH Remote Login Protocol</span></span>
<span class="line"><span>ssh		22/udp				# SSH Remote Login Protocol</span></span>
<span class="line"><span>telnet		23/tcp</span></span>
<span class="line"><span># 24 - private</span></span>
<span class="line"><span>smtp		25/tcp		mail</span></span>
<span class="line"><span># 26 - unassigned</span></span>
<span class="line"><span>time		37/tcp		timserver</span></span>
<span class="line"><span>time		37/udp		timserver</span></span>
<span class="line"><span>rlp		39/udp		resource	# resource location</span></span>
<span class="line"><span>nameserver	42/tcp		name		# IEN 116</span></span>
<span class="line"><span>whois		43/tcp		nicname</span></span>
<span class="line"><span>re-mail-ck	50/tcp				# Remote Mail Checking Protocol</span></span>
<span class="line"><span>re-mail-ck	50/udp				# Remote Mail Checking Protocol</span></span>
<span class="line"><span>domain		53/tcp		nameserver	# name-domain server</span></span>
<span class="line"><span>domain		53/udp		nameserver</span></span>
<span class="line"><span>mtp		57/tcp				# deprecated</span></span>
<span class="line"><span>bootps		67/tcp				# BOOTP server</span></span>
<span class="line"><span>bootps		67/udp</span></span>
<span class="line"><span>bootpc		68/tcp				# BOOTP client</span></span>
<span class="line"><span>bootpc		68/udp</span></span>
<span class="line"><span>tftp		69/udp</span></span>
<span class="line"><span>gopher		70/tcp				# Internet Gopher</span></span>
<span class="line"><span>gopher		70/udp</span></span>
<span class="line"><span>rje		77/tcp		netrjs</span></span>
<span class="line"><span>finger		79/tcp</span></span>
<span class="line"><span>www		80/tcp		http		# WorldWideWeb HTTP</span></span>
<span class="line"><span>www		80/udp				# HyperText Transfer Protocol</span></span>
<span class="line"><span>link		87/tcp		ttylink</span></span>
<span class="line"><span>kerberos	88/tcp		kerberos5 krb5 kerberos-sec	# Kerberos v5</span></span>
<span class="line"><span>kerberos	88/udp		kerberos5 krb5 kerberos-sec	# Kerberos v5</span></span>
<span class="line"><span>supdup		95/tcp</span></span>
<span class="line"><span># 100 - reserved</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/services</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 15.0 KB (15319 bytes)</li><li><strong>SHA-256:</strong> <code>9bc2ae7e79ef825a57eecb90681b0d9e2415fe8fc1be0cc5a2ecefebfb3ac611</code></li></ul><p>Standard services database.</p></details><h3 id="shadow" tabindex="-1"><code>shadow</code> <a class="header-anchor" href="#shadow" aria-label="Permalink to &quot;\`shadow\`&quot;">​</a></h3><p>The account password table. It shows a factory-set root password hash plus locked service accounts, which is normal for an appliance where root login is not meant to be used day to day.</p><p><em>Security-sensitive file: it is published firmware data and stays downloadable, but its contents are not previewed inline.</em></p><p><a href="/anacapad-internals/files/etc/shadow">Download</a> · 565 B</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/shadow</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 565 B (565 bytes)</li><li><strong>SHA-256:</strong> <code>0150ca4b759cfeb1d1df4d2f819b55b5db556a24bdd11399652df3269df7ed68</code></li></ul><p>MD5-crypt ($1$) root hash as shipped. This is a published firmware default, not a per-device secret; the diag build history around SSH access is documented under ssh_authorized_keys and the secure_console scripts.</p></details><h3 id="shells" tabindex="-1"><code>shells</code> <a class="header-anchor" href="#shells" aria-label="Permalink to &quot;\`shells\`&quot;">​</a></h3><p>The list of shells the system considers legal login shells. Mostly boilerplate on an appliance.</p><p><a href="/anacapad-internals/files/etc/shells">View</a> · <a href="/anacapad-internals/files/etc/shells">Download</a> · 53 B</p><details class="details custom-block"><summary>Preview</summary><p>First 5 of 5 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/bin/bash</span></span>
<span class="line"><span>/bin/sh</span></span>
<span class="line"><span>/bin/ash</span></span>
<span class="line"><span>/bin/ash.static</span></span>
<span class="line"><span>/bin/sash</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/shells</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 53 B (53 bytes)</li><li><strong>SHA-256:</strong> <code>82f4ce9af632497f688c4e48917e6f8aa00ad959677a4980731ef1dfd983b58d</code></li></ul><p>Standard shells file.</p></details><h3 id="soc-arch" tabindex="-1"><code>soc_arch</code> <a class="header-anchor" href="#soc-arch" aria-label="Permalink to &quot;\`soc_arch\`&quot;">​</a></h3><p>The system-on-chip identifier: which processor family this firmware targets.</p><p><a href="/anacapad-internals/files/etc/soc_arch">View</a> · <a href="/anacapad-internals/files/etc/soc_arch">Download</a> · 10 B</p><details class="details custom-block"><summary>Preview</summary><p>First 1 of 1 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>limelight</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/soc_arch</code></li><li><strong>Category:</strong> system</li><li><strong>Size:</strong> 10 B (10 bytes)</li><li><strong>SHA-256:</strong> <code>e014957c02d19fce55760cb98e40b2613f849ac985abdeef6a7a267bf55e1065</code></li></ul><p>SoC family marker used by the launch and diagnostic scripts.</p></details><h2 id="boot-and-service-scripts" tabindex="-1">Boot and service scripts <a class="header-anchor" href="#boot-and-service-scripts" aria-label="Permalink to &quot;Boot and service scripts&quot;">​</a></h2><p>Small shell scripts that start and stop the device&#39;s programs in the right order, bring the network up, and recover when something crashes. Reading them is the clearest way to see how the player actually boots.</p><details class="details custom-block"><summary>Technical details</summary><p>POSIX shell launchers and lifecycle scripts under /etc; they glue the kernel, the sibling daemons, and anacapad together during boot, shutdown, and reset.</p></details><h3 id="krandom" tabindex="-1"><code>Krandom</code> <a class="header-anchor" href="#krandom" aria-label="Permalink to &quot;\`Krandom\`&quot;">​</a></h3><p>The shutdown-time entropy script: preserves randomness state across reboots so the device&#39;s cryptographic operations do not restart from a predictable seed.</p><p><a href="/anacapad-internals/files/etc/init.d/Krandom">View</a> · <a href="/anacapad-internals/files/etc/init.d/Krandom">Download</a> · 499 B</p><details class="details custom-block"><summary>Preview</summary><p>First 17 of 17 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span>echo &quot;Saving random seed...&quot;</span></span>
<span class="line"><span>random_seed=/jffs/random-seed</span></span>
<span class="line"><span>touch $random_seed</span></span>
<span class="line"><span>chmod 600 $random_seed</span></span>
<span class="line"><span>poolfile=/proc/sys/kernel/random/poolsize</span></span>
<span class="line"><span>#  linux 2.4 has the poolsize in bytes, &gt;= 2.6 in bits</span></span>
<span class="line"><span>case \`uname -r\` in</span></span>
<span class="line"><span>    2.4.*)</span></span>
<span class="line"><span>        [ -r $poolfile ] &amp;&amp; bytes=\`cat $poolfile\` || bytes=512</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>        [ -r $poolfile ] &amp;&amp; bits=\`cat $poolfile\` || bits=4096</span></span>
<span class="line"><span>        bytes=$(expr $bits / 8)</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span>dd if=/dev/urandom &quot;of=$random_seed&quot; count=1 &quot;bs=$bytes&quot; 2&gt; /dev/null</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/init.d/Krandom</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 499 B (499 bytes)</li><li><strong>SHA-256:</strong> <code>43ba173153df8d85b25e6257324ea471938a7bd0cd1ce12faeea81791ba50b0f</code></li></ul><p>Saves/restores the random seed (cf. /jffs/random-seed) in the K-order shutdown sequence.</p></details><h3 id="srandom" tabindex="-1"><code>Srandom</code> <a class="header-anchor" href="#srandom" aria-label="Permalink to &quot;\`Srandom\`&quot;">​</a></h3><p>The boot-time entropy script: seeds the random number generator early so keys, tokens, and nonces are unpredictable from the very first connection.</p><p><a href="/anacapad-internals/files/etc/init.d/Srandom">View</a> · <a href="/anacapad-internals/files/etc/init.d/Srandom">Download</a> · 246 B</p><details class="details custom-block"><summary>Preview</summary><p>First 8 of 8 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span>echo &quot;Initializing random number generator...&quot;</span></span>
<span class="line"><span>random_seed=/jffs/random-seed</span></span>
<span class="line"><span># Carry a random seed from start-up to start-up</span></span>
<span class="line"><span># Load and then save the whole entropy pool</span></span>
<span class="line"><span>if [ -f $random_seed ]; then</span></span>
<span class="line"><span>    cat $random_seed &gt;/dev/urandom</span></span>
<span class="line"><span>fi</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/init.d/Srandom</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 246 B (246 bytes)</li><li><strong>SHA-256:</strong> <code>0a52cb3a89b1b93982143ba9bfc9f426249e4a6dfc7090887798f91e39635219</code></li></ul><p>Restores /jffs/random-seed into urandom at boot (S-order init step).</p></details><h3 id="rck" tabindex="-1"><code>rcK</code> <a class="header-anchor" href="#rck" aria-label="Permalink to &quot;\`rcK\`&quot;">​</a></h3><p>The kill script: the ordered teardown list run at shutdown or reboot, stopping services in the right sequence before power-off.</p><p><a href="/anacapad-internals/files/etc/init.d/rcK">View</a> · <a href="/anacapad-internals/files/etc/init.d/rcK">Download</a> · 719 B</p><details class="details custom-block"><summary>Preview</summary><p>First 35 of 35 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span># Preserve seed</span></span>
<span class="line"><span>/etc/init.d/Krandom</span></span>
<span class="line"><span></span></span>
<span class="line"><span>daemonkill() {</span></span>
<span class="line"><span>    for daemon in sonosledmgrd sonosdiagd \\</span></span>
<span class="line"><span>	sonospowercoordinator anacapad chronyd sddpd \\</span></span>
<span class="line"><span>	dropbear netstartd mdnsd udhcpc rngd ; do</span></span>
<span class="line"><span>	killall -$1 $daemon 2&gt; /dev/null</span></span>
<span class="line"><span>    done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for stop in stopupgrade stopledmgrd stopdiagapp \\</span></span>
<span class="line"><span>    stopsonospowercoordinator \\</span></span>
<span class="line"><span>    stopmdns stopdiagprocessd stopanacapa stopchrony stopsddp stopnetstartd; do</span></span>
<span class="line"><span>    touch /var/run/$stop</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo Sending SIGTERM</span></span>
<span class="line"><span>daemonkill TERM</span></span>
<span class="line"><span>sync</span></span>
<span class="line"><span>sleep 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo Sending SIGKILL</span></span>
<span class="line"><span>daemonkill KILL</span></span>
<span class="line"><span>sync</span></span>
<span class="line"><span>sleep 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -x /etc/scripts/ampmcu-down.sh ]; then</span></span>
<span class="line"><span>    echo Disabling AMPMCU instances</span></span>
<span class="line"><span>    /etc/scripts/ampmcu-down.sh</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo Unmounting /jffs</span></span>
<span class="line"><span>grep -q /jffs /proc/mounts &amp;&amp; umount /jffs</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/init.d/rcK</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 719 B (719 bytes)</li><li><strong>SHA-256:</strong> <code>1970b0bb740fb4d244af646e2567fb6f16aaea2c9cbf2987403605058729e08b</code></li></ul><p>Init runlevel-K aggregation; pairs with the inittab shutdown entries.</p></details><h3 id="runanacapa" tabindex="-1"><code>runanacapa</code> <a class="header-anchor" href="#runanacapa" aria-label="Permalink to &quot;\`runanacapa\`&quot;">​</a></h3><p>The launcher for the main player software: the script that starts anacapad with its config file, drops privileges to its own user, and sets up its environment. The player&#39;s whole life starts here at every boot.</p><p><a href="/anacapad-internals/files/etc/runanacapa">View</a> · <a href="/anacapad-internals/files/etc/runanacapa">Download</a> · 568 B</p><details class="details custom-block"><summary>Preview</summary><p>First 28 of 28 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart anacapa /var/run/anacapa.start 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -f /var/run/upgradeinfo ]; then</span></span>
<span class="line"><span>    mkdir /tmp</span></span>
<span class="line"><span>    rm /jffs/upgrade_tmp_prev.log</span></span>
<span class="line"><span>    mv /tmp/upgrade.log /jffs/upgrade_tmp_prev.log</span></span>
<span class="line"><span>    echo Running upgrade ...</span></span>
<span class="line"><span>    /bin/upgrade &gt;&gt; /tmp/upgrade.log 2&gt;&amp;1</span></span>
<span class="line"><span>    rr=$?</span></span>
<span class="line"><span>    echo RESULT = $rr &gt;&gt; /tmp/upgrade.log</span></span>
<span class="line"><span>    rm /var/run/upgradeinfo</span></span>
<span class="line"><span>    exit $rr</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>for X in /tmp/smb/*</span></span>
<span class="line"><span>do </span></span>
<span class="line"><span>    if [ -d &quot;$X&quot; ] </span></span>
<span class="line"><span>    then</span></span>
<span class="line"><span>        umount &quot;$X&quot;</span></span>
<span class="line"><span>        rmdir &quot;$X&quot;</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span>waitwhiletrue &quot;[ -f /var/run/stopanacapa ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exec /opt/bin/anacapactl start-demo</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runanacapa</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 568 B (568 bytes)</li><li><strong>SHA-256:</strong> <code>3c701e472a5ea6ff664deb092dbecbb1642e12799f8f92095955dc0e3cc999fb</code></li></ul><p>Launches &#39;anacapad -c /opt/conf/anacapa.conf -u anacapa -C all=eip&#39; with the pid file at /opt/log/anacapa.pid; supports gdb-wrapped debug starts and the demo-mode direct exec (documented on the rootfs_boot_chain entry).</p></details><h3 id="runchrony" tabindex="-1"><code>runchrony</code> <a class="header-anchor" href="#runchrony" aria-label="Permalink to &quot;\`runchrony\`&quot;">​</a></h3><p>The launcher for the time-sync daemon: starts the component that keeps the speaker&#39;s clock correct, which everything from multi-room sync to alarm timing depends on.</p><p><a href="/anacapad-internals/files/etc/runchrony">View</a> · <a href="/anacapad-internals/files/etc/runchrony">Download</a> · 2.8 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 70 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#####</span></span>
<span class="line"><span># Handler script for chronyd, the NTP daemon which sets the system clock.</span></span>
<span class="line"><span># This is meant to be run in perpetuity thanks to the inittab.</span></span>
<span class="line"><span># If you must use another technique to set the system clock, touch</span></span>
<span class="line"><span># /var/run/stopchrony and run \`killall chronyd\` first.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># chrony detects errors in the system clock relative to the real UTC time it</span></span>
<span class="line"><span># determines by polling NTP servers. These errors can be either &quot;small&quot; or</span></span>
<span class="line"><span># &quot;big&quot; (see all/mtools/gen_chronyconf.py for the threshhold between these).</span></span>
<span class="line"><span># Whenever it&#39;s running, chronyd corrects small errors by &quot;slewing&quot; the system</span></span>
<span class="line"><span># clock (adjusting how fast it ticks so that it matches up with UTC time fairly</span></span>
<span class="line"><span># quickly, but not immediately). When clock errors are big, chronyd can correct</span></span>
<span class="line"><span># them by instead &quot;stepping&quot; the system clock (correcting it immediately).</span></span>
<span class="line"><span># Stepping the clock can theoretically be dangerous to running processes, so we</span></span>
<span class="line"><span># only let chronyd do it once per operation.</span></span>
<span class="line"><span>#####</span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart chrony /var/run/chrony.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Wait until the platform has an IP address AND a DNS server is available:</span></span>
<span class="line"><span># until both conditions are met, chronyd cannot make forward progress.</span></span>
<span class="line"><span>waitfordns</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ -f /var/run/stopchrony ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Set up directories chrony needs</span></span>
<span class="line"><span>mkdir -p /jffs/chrony</span></span>
<span class="line"><span>chown -R chrony:sonos /jffs/chrony</span></span>
<span class="line"><span>mkdir -p /var/lib/chrony</span></span>
<span class="line"><span>chown -R chrony:sonos /var/lib/chrony</span></span>
<span class="line"><span></span></span>
<span class="line"><span># It&#39;s possible (though rare) for the system clock to get set too far ahead of</span></span>
<span class="line"><span># detected NTP time. If this happens, chrony logs this, increments the count in</span></span>
<span class="line"><span># this file, and exits. We restart chrony in case we got unlucky and synced with</span></span>
<span class="line"><span># bad servers, but to prevent perpetual restarting, we do so less and less</span></span>
<span class="line"><span># frequently the more we fail.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># If an RTC is present, we set its value to match the detected NTP time,</span></span>
<span class="line"><span># so that if forward drift of the RTC was the cause of the system clock&#39;s</span></span>
<span class="line"><span># inaccuracy, the system clock will be set more accurately during the next</span></span>
<span class="line"><span># reboot.</span></span>
<span class="line"><span>if [ -f /var/lib/chrony/sync_failure_count ]; then</span></span>
<span class="line"><span>  if grep -Fxq HAS_RTC /etc/arch_attrs &amp;&amp; \\</span></span>
<span class="line"><span>     [ -f /var/lib/chrony/sync_time_offset ]; then</span></span>
<span class="line"><span>    hwclock -u -w$(cat /var/lib/chrony/sync_time_offset)</span></span>
<span class="line"><span>  fi</span></span>
<span class="line"><span>  fail_count=$(cat /var/lib/chrony/sync_failure_count)</span></span>
<span class="line"><span>  if [ $fail_count -eq 1 ]; then</span></span>
<span class="line"><span>    echo &quot;sysclock uncorrectably fast of true; trying again in 5 minutes&quot;</span></span>
<span class="line"><span>    sleep 300</span></span>
<span class="line"><span>  elif [ $fail_count -eq 2 ]; then</span></span>
<span class="line"><span>    echo &quot;sysclock uncorrectably fast of true; trying again in 30 minutes&quot;</span></span>
<span class="line"><span>    sleep 1800</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>    echo &quot;sysclock uncorrectably fast of true; trying again in 60 minutes&quot;</span></span>
<span class="line"><span>    sleep 3600</span></span>
<span class="line"><span>  fi</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runchrony</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 2.8 KB (2851 bytes)</li><li><strong>SHA-256:</strong> <code>dca6c5babccbc7a1166106912ea0dc736aab27c10a2a3effb12457e55934194f</code></li></ul><p>Starts chronyd against /etc/chrony.conf; drift persisted to /jffs/chrony.</p></details><h3 id="rundaemon-sh" tabindex="-1"><code>rundaemon.sh</code> <a class="header-anchor" href="#rundaemon-sh" aria-label="Permalink to &quot;\`rundaemon.sh\`&quot;">​</a></h3><p>A shared daemon-runner script: a generic wrapper used to start background services with the right bookkeeping instead of each launcher reinventing it.</p><p><a href="/anacapad-internals/files/etc/rundaemon.sh">View</a> · <a href="/anacapad-internals/files/etc/rundaemon.sh">Download</a> · 847 B</p><details class="details custom-block"><summary>Preview</summary><p>First 35 of 35 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># waitwhiletrue executes a shell command until it returns false, sleeping</span></span>
<span class="line"><span># 10 seconds between retries</span></span>
<span class="line"><span>waitwhiletrue() {</span></span>
<span class="line"><span>    while eval &quot;$1&quot;; do</span></span>
<span class="line"><span>	sleep 10</span></span>
<span class="line"><span>    done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># waitfordns waits until DNS and networking are available</span></span>
<span class="line"><span># Wait until the platform has an IP address AND a DNS server is available:</span></span>
<span class="line"><span>waitfordns() {</span></span>
<span class="line"><span>    while [ -f /var/run/waitforip ] || ! grep -qs nameserver /etc/resolv.conf; do</span></span>
<span class="line"><span>	sleep 1</span></span>
<span class="line"><span>    done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># trackrestart tracks starts/restarts</span></span>
<span class="line"><span># trackrestart daemon-name track-file &lt;optional sleep time&gt;</span></span>
<span class="line"><span>trackrestart() {</span></span>
<span class="line"><span>    if [ -f $2 ]; then</span></span>
<span class="line"><span>	echo &quot;Restarting $1 - last started&quot; \`tail -n -1 $2\`</span></span>
<span class="line"><span>	if [ -n &quot;$3&quot; ]; then</span></span>
<span class="line"><span>	    sleep $3</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>	    sleep 5</span></span>
<span class="line"><span>	fi	    </span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    date &gt;&gt; $2</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># waitwhilestopped waits while a daemon is stopped</span></span>
<span class="line"><span># waitwhilestopped daemon-stop-name</span></span>
<span class="line"><span>waitwhilestopped() {</span></span>
<span class="line"><span>    waitwhiletrue &quot;[ -f /var/run/$1 ]&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/rundaemon.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 847 B (847 bytes)</li><li><strong>SHA-256:</strong> <code>6f76a74572f19e09223d9876b30b0d9bef2dfaf4036529bf7aa6a5a55f4a7c38</code></li></ul><p>Generic daemon launcher shared by the run* scripts; also referenced by the sibling-daemon IPC work (see multi_daemon_boundary).</p></details><h3 id="rundiagprocessd" tabindex="-1"><code>rundiagprocessd</code> <a class="header-anchor" href="#rundiagprocessd" aria-label="Permalink to &quot;\`rundiagprocessd\`&quot;">​</a></h3><p>The launcher for the diagnostic coprocessor menu: brings up the FIFO command interface used for factory and service diagnostics.</p><p><a href="/anacapad-internals/files/etc/rundiagprocessd">View</a> · <a href="/anacapad-internals/files/etc/rundiagprocessd">Download</a> · 160 B</p><details class="details custom-block"><summary>Preview</summary><p>First 9 of 9 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart diagprocessd /var/run/diagprocessd.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ -f /var/run/stopdiagprocessd ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exec /etc/diagprocessd</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/rundiagprocessd</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 160 B (160 bytes)</li><li><strong>SHA-256:</strong> <code>391f9002a197c91e482230680636757415fdfd2b26e8fc90ba8e9983af9003ff</code></li></ul><p>Starts the /etc/diagprocessd FIFO loop.</p></details><h3 id="runledmgrd" tabindex="-1"><code>runledmgrd</code> <a class="header-anchor" href="#runledmgrd" aria-label="Permalink to &quot;\`runledmgrd\`&quot;">​</a></h3><p>The launcher for the LED manager daemon: starts the little program that owns the speaker&#39;s lights and runs the animated patterns.</p><p><a href="/anacapad-internals/files/etc/runledmgrd">View</a> · <a href="/anacapad-internals/files/etc/runledmgrd">Download</a> · 995 B</p><details class="details custom-block"><summary>Preview</summary><p>First 27 of 27 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart sonosledmgrd /var/run/sonosledmgrd.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>while [ -f /var/run/stopledmgrd ] || [ -e /var/run/sonosledmgrd.pid ]; do</span></span>
<span class="line"><span>    # If we are not deliberately stopping and a pid file exists, check to make</span></span>
<span class="line"><span>    # sure that the pid is actually running. If not, the process has exited abnormally</span></span>
<span class="line"><span>    # and needs to be kicked after logging a message.</span></span>
<span class="line"><span>    if  [ ! -f /var/run/stopledmgrd ]; then</span></span>
<span class="line"><span>        curpid=\`pidof sonosledmgrd\`</span></span>
<span class="line"><span>        if [ $? = 1 ]; then</span></span>
<span class="line"><span>            pid=\`cat /var/run/sonosledmgrd.pid\`</span></span>
<span class="line"><span>            _dat=\`date &quot;+%h %d %H:%m:%S runledmgrd&quot;\`</span></span>
<span class="line"><span>            # this is a system daemon.. so use &#39;3&#39; for message priority</span></span>
<span class="line"><span>            echo &quot;&lt;3&gt; $_dat LED Manager PID $pid is stale. Likely caused by an abnormal exit. Check logs. Restarting LED Manager&quot; &gt;&gt; /opt/log/sonosledmgrd.log</span></span>
<span class="line"><span>            unset _dat</span></span>
<span class="line"><span>            unset pid</span></span>
<span class="line"><span>            break</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        unset curpid</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    sleep 5</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span>echo &quot;Starting LED Manager&quot;</span></span>
<span class="line"><span>exec /opt/bin/sonosledmgrd</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runledmgrd</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 995 B (995 bytes)</li><li><strong>SHA-256:</strong> <code>5dd6c8b9b8e4ea32fecd923aa6b281ef4037199b1e477c6f9de912f79ab3a2b2</code></li></ul><p>Starts sonosledmgrd; the daemon owns /dev/ledctl and the LED scripting engine documented in led_engine.</p></details><h3 id="runmdns" tabindex="-1"><code>runmdns</code> <a class="header-anchor" href="#runmdns" aria-label="Permalink to &quot;\`runmdns\`&quot;">​</a></h3><p>The launcher for the discovery daemon: starts the service that announces the speaker on the network and finds its siblings.</p><p><a href="/anacapad-internals/files/etc/runmdns">View</a> · <a href="/anacapad-internals/files/etc/runmdns">Download</a> · 94 B</p><details class="details custom-block"><summary>Preview</summary><p>First 7 of 7 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ -f /var/run/stopmdns ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exec /sbin/mdnsd -f</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runmdns</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 94 B (94 bytes)</li><li><strong>SHA-256:</strong> <code>3172ecf3a73d634a681441d73e371ac41e47e62e5eccc4989f5fb0e8541350b2</code></li></ul><p>Starts mdnsd for multicast-DNS announce/browse; feeds the discovery_layer machinery.</p></details><h3 id="runnetstartd" tabindex="-1"><code>runnetstartd</code> <a class="header-anchor" href="#runnetstartd" aria-label="Permalink to &quot;\`runnetstartd\`&quot;">​</a></h3><p>The launcher for the network-startup daemon: starts the component that brings up WiFi and Ethernet in the right order during boot and setup.</p><p><a href="/anacapad-internals/files/etc/runnetstartd">View</a> · <a href="/anacapad-internals/files/etc/runnetstartd">Download</a> · 134 B</p><details class="details custom-block"><summary>Preview</summary><p>First 9 of 9 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart netstartd /var/run/netstartd.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhilestopped stopnetstartd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exec /wifi/netstartd</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runnetstartd</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 134 B (134 bytes)</li><li><strong>SHA-256:</strong> <code>79a483bfb764152467a90515b8c597b7381e64a0ddee82823840f1b7705bf3a8</code></li></ul><p>Starts netstartd, the process anacapad talks to over /tmp/netstartd.ipc for network state and setup transitions.</p></details><h3 id="runsddp" tabindex="-1"><code>runsddp</code> <a class="header-anchor" href="#runsddp" aria-label="Permalink to &quot;\`runsddp\`&quot;">​</a></h3><p>The launcher for the device-announcement daemon: starts the broadcaster that keeps the household map populated.</p><p><a href="/anacapad-internals/files/etc/runsddp">View</a> · <a href="/anacapad-internals/files/etc/runsddp">Download</a> · 651 B</p><details class="details custom-block"><summary>Preview</summary><p>First 26 of 26 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#####</span></span>
<span class="line"><span># Handler script for sddpd, the Device Discovery Protocol daemon developed</span></span>
<span class="line"><span># by Control4. This is meant to be run in perpetuity thanks to the inittab.</span></span>
<span class="line"><span># If you must use another technique for SDDP, touch</span></span>
<span class="line"><span># /var/run/stopsddp and run \`killall sddpd\`.</span></span>
<span class="line"><span>#####</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart sddpd /var/run/sddpd.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span># sddpd requires IP and DNS.</span></span>
<span class="line"><span>waitfordns</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ -f /var/run/stopsddp ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>sddpd_opts=&quot;-n&quot; # don&#39;t daemonize</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -f /jffs/dev_sddp.conf ]; then</span></span>
<span class="line"><span>  echo &quot;Found /jffs/dev_sddp.conf; using it instead of default /etc/sddp.conf.&quot;</span></span>
<span class="line"><span>  sddpd_opts=&quot;$sddpd_opts -c /jffs/dev_sddp.conf&quot;</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exec /sbin/sddpd $sddpd_opts</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runsddp</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 651 B (651 bytes)</li><li><strong>SHA-256:</strong> <code>60984a4598d37a6ac93bc3be3a29708537bbd8c4118ca884452ed2d99bcc66aa</code></li></ul><p>Starts sddpd with /etc/sddpd.conf.</p></details><h3 id="mount-jffs-sh" tabindex="-1"><code>mount_jffs.sh</code> <a class="header-anchor" href="#mount-jffs-sh" aria-label="Permalink to &quot;\`mount_jffs.sh\`&quot;">​</a></h3><p>The script that mounts the writable partition: the step during boot that makes the speaker&#39;s saved settings, logs, and queues available. Until this runs, the device only has its read-only image.</p><p><a href="/anacapad-internals/files/etc/scripts/mount_jffs.sh">View</a> · <a href="/anacapad-internals/files/etc/scripts/mount_jffs.sh">Download</a> · 389 B</p><details class="details custom-block"><summary>Preview</summary><p>First 21 of 21 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Copyright (c) 2022, Sonos, Inc.  All rights reserved.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>sonos_mount_jffs()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    mount -t jffs2 -o noatime /dev/nandjffs /jffs</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>sonos_unmount_jffs()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    grep -q /jffs /proc/mounts</span></span>
<span class="line"><span>    ret=$?</span></span>
<span class="line"><span>    if [ $ret -eq 0 ]; then</span></span>
<span class="line"><span>        umount /jffs</span></span>
<span class="line"><span>        ret=$?</span></span>
<span class="line"><span>        if [ $ret -ne 0 ]; then</span></span>
<span class="line"><span>            echo &quot;error umounting /jffs: $ret&quot; 1&gt;&amp;2</span></span>
<span class="line"><span>            return $ret</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/scripts/mount_jffs.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 389 B (389 bytes)</li><li><strong>SHA-256:</strong> <code>af1c5c97306ffd2b06366562b5ea601814310739d671c2f938a4958cabee4d69</code></li></ul><p>Mounts the jffs2 flash partition at /jffs; ordering matters because nearly every subsystem reads persisted state from it.</p></details><h3 id="run-sshd-sh" tabindex="-1"><code>run_sshd.sh</code> <a class="header-anchor" href="#run-sshd-sh" aria-label="Permalink to &quot;\`run_sshd.sh\`&quot;">​</a></h3><p>The script that conditionally starts the SSH daemon: SSH exists on the box but is gated, and this is the gatekeeper deciding whether remote shell access is allowed at all.</p><p><a href="/anacapad-internals/files/etc/scripts/run_sshd.sh">View</a> · <a href="/anacapad-internals/files/etc/scripts/run_sshd.sh">Download</a> · 499 B</p><details class="details custom-block"><summary>Preview</summary><p>First 18 of 18 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span># Copyright (c) 2019-2023, Sonos, Inc.  All rights reserved.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart dropbear /var/run/dropbear.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ ! -f /tmp/device_unlocked_flag ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mkdir -p /jffs/persist/ssh</span></span>
<span class="line"><span>mkdir -m 700 -p /jffs/sys/debug/ssh</span></span>
<span class="line"><span>if [ ! -f /jffs/sys/debug/ssh/authorized_keys ]; then</span></span>
<span class="line"><span>    touch /jffs/sys/debug/ssh/authorized_keys</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>if [ ! -s /jffs/persist/ssh/dropbear_ecdsa_host_key ]; then</span></span>
<span class="line"><span>    rm /jffs/persist/ssh/dropbear_ecdsa_host_key</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>exec /usr/bin/dropbear -R -F</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/scripts/run_sshd.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 499 B (499 bytes)</li><li><strong>SHA-256:</strong> <code>822523d641bd6ee7ea0b271e4dadb05ebe598249f86d0717f03cc6394ba97732</code></li></ul><p>Starts dropbear only when the device is in a permitted state (engineering/unlock path); installs host keys under /jffs/persist/ssh on first run.</p></details><h3 id="netconfig-sh" tabindex="-1"><code>netconfig.sh</code> <a class="header-anchor" href="#netconfig-sh" aria-label="Permalink to &quot;\`netconfig.sh\`&quot;">​</a></h3><p>The network reconfiguration state machine in a single shell script: one call with a mode argument moves the player between Sonos&#39;s mesh, normal home WiFi, the open setup hotspot, credential-checking, or a standalone island mode. It is why the speaker can hop between network setups without reflashing.</p><p><a href="/anacapad-internals/files/usr/sbin/netconfig.sh">View</a> · <a href="/anacapad-internals/files/usr/sbin/netconfig.sh">Download</a> · 10.7 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 449 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>case &quot;$1&quot; in</span></span>
<span class="line"><span>    sonosnet|station|satellite|sta_and_sat|open|credcheck|deauth|wacexit|island|up)</span></span>
<span class="line"><span>        MODE=&quot;$1&quot;</span></span>
<span class="line"><span>        WAC=0</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    wacstart|wacapclose|wactimeout)</span></span>
<span class="line"><span>        MODE=&quot;$1&quot;</span></span>
<span class="line"><span>        WAC=1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    waccredcheck)</span></span>
<span class="line"><span>        MODE=credcheck</span></span>
<span class="line"><span>        WAC=1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    wacapopen)</span></span>
<span class="line"><span>        MODE=open</span></span>
<span class="line"><span>        WAC=1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    wacstation)</span></span>
<span class="line"><span>        MODE=station</span></span>
<span class="line"><span>        WAC=1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>        echo &quot;Illegal mode!&quot;</span></span>
<span class="line"><span>        exit 1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span></span></span>
<span class="line"><span>case &quot;$2&quot; in</span></span>
<span class="line"><span>    stp_disable)</span></span>
<span class="line"><span>        STPSTATE=&quot;off&quot;</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    stp_enable)</span></span>
<span class="line"><span>        STPSTATE=&quot;on&quot;</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>        echo &quot;Illegal STP state!&quot;</span></span>
<span class="line"><span>        exit 1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PARAM1=&quot;$3&quot;</span></span>
<span class="line"><span>PARAM2=&quot;$4&quot;</span></span>
<span class="line"><span>PARAM3=&quot;$5&quot;</span></span>
<span class="line"><span>PARAM4=&quot;$6&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>ARCH_ATTRS=/etc/arch_attrs</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -f /jffs/debug/testpoints.sh ] &amp;&amp; \\</span></span>
<span class="line"><span>   [ &quot;\`cat /proc/sonos-lock/exec_enable\`&quot; == &quot;1&quot; ]; then</span></span>
<span class="line"><span>    . /jffs/debug/testpoints.sh || true</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ &quot;\${WAC}&quot; = &quot;0&quot; ]; then</span></span>
<span class="line"><span>    if [ -f /tmp/wacd.pid ]; then</span></span>
<span class="line"><span>        kill \`cat /tmp/wacd.pid\`</span></span>
<span class="line"><span>        rm -f /tmp/wacd.pid</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/usr/sbin/netconfig.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 10.7 KB (10932 bytes)</li><li><strong>SHA-256:</strong> <code>13f8bb6219d077e3eac73df1005b42547306f7d506ce62752a5db9cbcd2aea83</code></li></ul><p>The netconfig FSM documented under netconfig_fsm: modes include SonosNet join, infrastructure join, open-AP setup, check-only, and island; touches wpa_supplicant, ssidlist, and the flag files under /var/run.</p></details><h3 id="secure-console-sh" tabindex="-1"><code>secure_console.sh</code> <a class="header-anchor" href="#secure-console-sh" aria-label="Permalink to &quot;\`secure_console.sh\`&quot;">​</a></h3><p>The secure console gate: the script that decides whether the device will expose a debug console, checking the unlock state before offering a shell.</p><p><a href="/anacapad-internals/files/usr/sbin/secure_console.sh">View</a> · <a href="/anacapad-internals/files/usr/sbin/secure_console.sh">Download</a> · 236 B</p><details class="details custom-block"><summary>Preview</summary><p>First 7 of 7 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span># This is a wrapper script called by getty, which is unable to pass</span></span>
<span class="line"><span># arguments to the program it starts (typically login). We need to pass</span></span>
<span class="line"><span># the user to login as (-f root).</span></span>
<span class="line"><span>echo &quot;Starting console...&quot;</span></span>
<span class="line"><span>exec /bin/login -f root</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/usr/sbin/secure_console.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 236 B (236 bytes)</li><li><strong>SHA-256:</strong> <code>fa1827c45a7048097e57a0660942022f10ef4420b0e53d50fb35e68078f4f30b</code></li></ul><p>Gates console access on the device-unlock flag (/tmp/device_unlocked_flag family); part of the engineering surfaces documented under dev_unlock.</p></details><h3 id="secure-console-login-sh" tabindex="-1"><code>secure_console_login.sh</code> <a class="header-anchor" href="#secure-console-login-sh" aria-label="Permalink to &quot;\`secure_console_login.sh\`&quot;">​</a></h3><p>The login half of the secure console: how a permitted console session is actually opened once the gate allows it.</p><p><a href="/anacapad-internals/files/usr/sbin/secure_console_login.sh">View</a> · <a href="/anacapad-internals/files/usr/sbin/secure_console_login.sh">Download</a> · 1.0 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 33 of 33 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Wrapper around getty to wait for dynamic devices (USB) and enforce</span></span>
<span class="line"><span># console security. Passed tty, baud rate, and other parameters, which</span></span>
<span class="line"><span># are then passed to getty.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tty=\`basename $1\`</span></span>
<span class="line"><span>baud=$2</span></span>
<span class="line"><span>extra=$3</span></span>
<span class="line"><span>shift 3</span></span>
<span class="line"><span>while [ $# -gt 0 ]</span></span>
<span class="line"><span>	do extra=&quot;$extra $1&quot;</span></span>
<span class="line"><span>	shift</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart getty-$tty /var/run/getty-\${tty}.start 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ ! -c /dev/$tty ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># In early development, this file may not exist. Also, it will not</span></span>
<span class="line"><span># exist on pre-secure boot plauers. In both cases, we&#39;ll enable the</span></span>
<span class="line"><span># console by default. Note that on pre-secure boot players, the</span></span>
<span class="line"><span># console is disabled by other methods.</span></span>
<span class="line"><span>[ -f /proc/sonos-lock/console_enable ] &amp;&amp;</span></span>
<span class="line"><span>	waitwhiletrue &quot;[ \`cat /proc/sonos-lock/console_enable\` != &#39;1&#39; ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Start a getty on the tty passed in as our parameter.</span></span>
<span class="line"><span># Since USB may be hot-plugged, and because initialization happens</span></span>
<span class="line"><span># this device might not instantiated at the time the script starts,</span></span>
<span class="line"><span># so the scripts I/O is set to be logged at first.</span></span>
<span class="line"><span>exec getty -L -w $extra $tty $baud linux &lt; /dev/$tty &gt; /dev/$tty 2&gt;&amp;1</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/usr/sbin/secure_console_login.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 1.0 KB (1048 bytes)</li><li><strong>SHA-256:</strong> <code>69e775c702e96d1688c33ab498e286f88bbf682d503eef70a1223ed8b1ce59de</code></li></ul><p>Companion to secure_console.sh; performs the session setup after the gate check.</p></details><h2 id="programs" tabindex="-1">Programs <a class="header-anchor" href="#programs" aria-label="Permalink to &quot;Programs&quot;">​</a></h2><p>The runnable programs shipped on the speaker: the main player software itself, the daemons that manage networking and LEDs, and the utility tools used for upgrades, diagnostics, and factory procedures. These are compiled machine code, so you can download them but not read them like a text file.</p><details class="details custom-block"><summary>Technical details</summary><p>ELF executables for the limelight (ARM) target. anacapad is the analysis subject of this site; the rest are sibling daemons and vendor/board utilities.</p></details><h3 id="busybox" tabindex="-1"><code>busybox</code> <a class="header-anchor" href="#busybox" aria-label="Permalink to &quot;\`busybox\`&quot;">​</a></h3><p>The Swiss Army knife of the system: one small program providing all the everyday Unix commands (ls, cp, ping, ps, and dozens more). Most of the other tools in /bin are just shortcuts to this one file.</p><p><a href="/anacapad-internals/files/bin/busybox">Download</a> · 513.8 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/bin/busybox</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 513.8 KB (526096 bytes)</li><li><strong>SHA-256:</strong> <code>f04f6646c7d054e995cd09d4c17205d1cd71a080171e97a80750de6a190f16c7</code></li></ul><p>busybox multi-call binary; the /bin utilities (cat, ls, mount, netstat, ping, ps, ...) are symlinks into it.</p></details><h3 id="chronyc" tabindex="-1"><code>chronyc</code> <a class="header-anchor" href="#chronyc" aria-label="Permalink to &quot;\`chronyc\`&quot;">​</a></h3><p>The command-line client for the time daemon: the tool scripts and diagnostics use to ask &#39;what does the clock think right now?&#39;.</p><p><a href="/anacapad-internals/files/bin/chronyc">Download</a> · 129.7 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/bin/chronyc</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 129.7 KB (132812 bytes)</li><li><strong>SHA-256:</strong> <code>723675cde72cd0a37754828c9463877c9d303301424d4e36aa0e6906d1d81afe</code></li></ul><p>chrony control client; referenced by the exec-page diagnostics (chronyc source tracking).</p></details><h3 id="dropbearmulti" tabindex="-1"><code>dropbearmulti</code> <a class="header-anchor" href="#dropbearmulti" aria-label="Permalink to &quot;\`dropbearmulti\`&quot;">​</a></h3><p>The SSH server toolkit in one binary: provides the secure shell access the device can open for engineering, plus the key tools that go with it.</p><p><a href="/anacapad-internals/files/bin/dropbearmulti">Download</a> · 258.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/bin/dropbearmulti</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 258.4 KB (264552 bytes)</li><li><strong>SHA-256:</strong> <code>4fdab40a039cd989323458024aa010600c7849afc54e728d2735871b381583fc</code></li></ul><p>Dropbear multi-call binary (sshd/dropbearkey in one); gated by run_sshd.sh and the unlock flags; host keys persist under /jffs/persist/ssh.</p></details><h3 id="mdputil" tabindex="-1"><code>mdputil</code> <a class="header-anchor" href="#mdputil" aria-label="Permalink to &quot;\`mdputil\`&quot;">​</a></h3><p>The device-data utility: reads and writes the small factory data block that carries this unit&#39;s identity like its serial number and calibration slots, programmed at manufacturing.</p><p><a href="/anacapad-internals/files/bin/mdputil">Download</a> · 66.0 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/bin/mdputil</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 66.0 KB (67596 bytes)</li><li><strong>SHA-256:</strong> <code>e3b2f55b3ecd50b3b26aeb1771f0e9b1b0ed30dea84fa759e7adfa70f6a0cd61</code></li></ul><p>MDP (manufacturing data payload) tool; initializes the device-payload.bin template documented in firmware-differences; source of serial/MAC/calibration fields.</p></details><h3 id="pcap" tabindex="-1"><code>pcap</code> <a class="header-anchor" href="#pcap" aria-label="Permalink to &quot;\`pcap\`&quot;">​</a></h3><p>The packet-capture tool: records network traffic for diagnostics, used when Sonos needs to see what the speaker is actually receiving.</p><p><a href="/anacapad-internals/files/bin/pcap">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/bin/pcap</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 65.4 KB (66996 bytes)</li><li><strong>SHA-256:</strong> <code>1f774e76d0904d94c3321eead021c9063e111a3bd6a82e2ad476aa250d8fb52f</code></li></ul><p>pcap capture utility invoked from the diagnostics surface.</p></details><h3 id="upgrade" tabindex="-1"><code>upgrade</code> <a class="header-anchor" href="#upgrade" aria-label="Permalink to &quot;\`upgrade\`&quot;">​</a></h3><p>The low-level updater: the program that actually writes a downloaded firmware image to flash during an update.</p><p><a href="/anacapad-internals/files/bin/upgrade">Download</a> · 195.3 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/bin/upgrade</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 195.3 KB (200036 bytes)</li><li><strong>SHA-256:</strong> <code>6777928534592ccec85ff9505334fb0c85f842565aab9cc64fcc23e41d03eca6</code></li></ul><p>Update applier invoked by upgrade_mgr; the recovery path runs it in a loop (documented in update_machinery&#39;s sibling-binaries record).</p></details><h3 id="upgrade-mgr" tabindex="-1"><code>upgrade_mgr</code> <a class="header-anchor" href="#upgrade-mgr" aria-label="Permalink to &quot;\`upgrade_mgr\`&quot;">​</a></h3><p>The update manager: orchestrates a downloaded update, verifies it, and schedules the reboot into the new firmware.</p><p><a href="/anacapad-internals/files/bin/upgrade_mgr">Download</a> · 65.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/bin/upgrade_mgr</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 65.6 KB (67160 bytes)</li><li><strong>SHA-256:</strong> <code>b806c0df7934b9fd3fa367aa1a9eb73a09c4f0c81cd06e6b3ec28fb34636cd2c</code></li></ul><p>Upgrade orchestrator; its status and report files land under /tmp/upgrade_mgr_* and /jffs/upgrade*.</p></details><h3 id="anacapactl" tabindex="-1"><code>anacapactl</code> <a class="header-anchor" href="#anacapactl" aria-label="Permalink to &quot;\`anacapactl\`&quot;">​</a></h3><p>The supervisor script for the main player: a shell wrapper that starts anacapad with the right privileges, watches it, and can launch it under a debugger for development. It is the little harness around the big program.</p><p><a href="/anacapad-internals/files/opt/bin/anacapactl">View</a> · <a href="/anacapad-internals/files/opt/bin/anacapactl">Download</a> · 2.0 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 128 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#! /bin/sh</span></span>
<span class="line"><span>anacapaHome=/opt</span></span>
<span class="line"><span>anacapaPidFile=$anacapaHome/log/anacapa.pid</span></span>
<span class="line"><span>anacapaBin=&quot;$anacapaHome/bin/anacapad&quot;</span></span>
<span class="line"><span>anacapaOpts=&quot;-c $anacapaHome/conf/anacapa.conf -u anacapa -C all=eip&quot;</span></span>
<span class="line"><span>anacapaStart=&quot;$anacapaBin $anacapaOpts&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PATH=/usr/bin:/bin:/usr/sbin:/sbin:$anacapaHome/bin</span></span>
<span class="line"><span>export PATH</span></span>
<span class="line"><span>LD_LIBRARY_PATH=$anacapaHome/lib</span></span>
<span class="line"><span>export LD_LIBRARY_PATH</span></span>
<span class="line"><span>ANACAPA_LIBDIR=$anacapaHome/lib</span></span>
<span class="line"><span>export ANACAPA_LIBDIR</span></span>
<span class="line"><span></span></span>
<span class="line"><span>arch=\`uname -m\`</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># CheckRunning</span></span>
<span class="line"><span># Check to see if Anacapa is running, and if so, set the &quot;pid&quot; var.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>CheckRunning() {</span></span>
<span class="line"><span>	pid=&quot;&quot;</span></span>
<span class="line"><span>	if [ -f $anacapaPidFile ]; then</span></span>
<span class="line"><span>		pid=\`cat $anacapaPidFile 2&gt; /dev/null\`</span></span>
<span class="line"><span>	fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	if [ -n &quot;$pid&quot; ]; then</span></span>
<span class="line"><span>		kill -0 $pid 2&gt; /dev/null</span></span>
<span class="line"><span>		if [ $? != 0 ]; then</span></span>
<span class="line"><span>			rm -f $anacapaPidFile</span></span>
<span class="line"><span>			pid=&quot;&quot;</span></span>
<span class="line"><span>		fi</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>		rm -f $anacapaPidFile</span></span>
<span class="line"><span>		pid=&quot;&quot;</span></span>
<span class="line"><span>	fi</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Stop</span></span>
<span class="line"><span># Stop the anacapa and wait until the primary process is dead.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>Stop() {</span></span>
<span class="line"><span>	kill -15 $pid</span></span>
<span class="line"><span>	CheckRunning</span></span>
<span class="line"><span>	while [ -n &quot;$pid&quot; ]; do</span></span>
<span class="line"><span>		sleep 1</span></span>
<span class="line"><span>		CheckRunning</span></span>
<span class="line"><span>	done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CheckRunning</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Hup</span></span>
<span class="line"><span># Hup the anacapa</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>Hup() {</span></span>
<span class="line"><span>	kill -HUP $pid</span></span>
<span class="line"><span>}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/bin/anacapactl</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 2.0 KB (2015 bytes)</li><li><strong>SHA-256:</strong> <code>546ecdef28593ecdd6dfdbe81cf96e62b0bd41773cf9984dd469b287a3a9d0c5</code></li></ul><p>POSIX sh supervisor (fully readable text): handles start/stop/restart, demo-mode exec, cache-drop on certain boards, and gdb wrapping via $SONOS_GDB_ARGS.</p></details><h3 id="anacapad" tabindex="-1"><code>anacapad</code> <a class="header-anchor" href="#anacapad" aria-label="Permalink to &quot;\`anacapad\`&quot;">​</a></h3><p>The main event: the Sonos player daemon itself. This single program implements nearly everything this site documents, from the classic remote-control commands to the modern app API to the media pipeline. If you download one file, this is the one.</p><p><a href="/anacapad-internals/files/opt/bin/anacapad">Download</a> · 16.5 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/bin/anacapad</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 16.5 MB (17329076 bytes)</li><li><strong>SHA-256:</strong> <code>f60262a152aac48bd39bf0285d17d080e6820e37be12d0af9de7bffee8d3e257</code></li></ul><p>The analysis subject: ~4 MB ARM ELF (limelight). Every dispatch table, URI grammar, and subsystem entry on this site was recovered from this binary. Build 86.10-80260 per build.properties.</p></details><h3 id="sonosledmgrd" tabindex="-1"><code>sonosledmgrd</code> <a class="header-anchor" href="#sonosledmgrd" aria-label="Permalink to &quot;\`sonosledmgrd\`&quot;">​</a></h3><p>The LED manager daemon: the small program that owns the speaker&#39;s status light and plays the animation patterns for states like setup, playing, and muted.</p><p><a href="/anacapad-internals/files/opt/bin/sonosledmgrd">Download</a> · 1.2 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/bin/sonosledmgrd</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 1.2 MB (1248340 bytes)</li><li><strong>SHA-256:</strong> <code>4a4afe45e2b31f26458268e1b7cc7a01ac57a7631337753c9d914135cf1c540f</code></li></ul><p>ELF daemon; owns /dev/ledctl. Its animated pattern engine and per-model feature map are documented under led_engine/leds_zp/led_hw.</p></details><h3 id="capsh" tabindex="-1"><code>capsh</code> <a class="header-anchor" href="#capsh" aria-label="Permalink to &quot;\`capsh\`&quot;">​</a></h3><p>A capability-inspection utility from the libcap package, used for checking process privileges.</p><p><a href="/anacapad-internals/files/sbin/capsh">Download</a> · 66.8 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/sbin/capsh</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 66.8 KB (68432 bytes)</li><li><strong>SHA-256:</strong> <code>4ddf9eef05b0be1aca5e03e082c8062dd7e5ccfb6844e7298f52585058ce2875</code></li></ul><p>Standard libcap tool; ships with the capability-aware launch path (anacapactl&#39;s -C keep-set).</p></details><h3 id="chronyd" tabindex="-1"><code>chronyd</code> <a class="header-anchor" href="#chronyd" aria-label="Permalink to &quot;\`chronyd\`&quot;">​</a></h3><p>The time-sync daemon: the program that keeps the speaker&#39;s clock disciplined against internet time servers, which is the quiet foundation of sample-accurate multi-room playback.</p><p><a href="/anacapad-internals/files/sbin/chronyd">Download</a> · 258.0 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/sbin/chronyd</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 258.0 KB (264144 bytes)</li><li><strong>SHA-256:</strong> <code>df82a031253bbf53f2c0b491525eeaeae0f67e3f3368df879777a4c16871721f</code></li></ul><p>chrony daemon build; Sonos&#39;s sntp layer plus chrony is documented under sntp/sntp_server.</p></details><h3 id="frcheck" tabindex="-1"><code>frcheck</code> <a class="header-anchor" href="#frcheck" aria-label="Permalink to &quot;\`frcheck\`&quot;">​</a></h3><p>The factory-reset checker: looks at the button/reset state at boot and reports whether the device should wipe itself clean before anything else starts.</p><p><a href="/anacapad-internals/files/sbin/frcheck">Download</a> · 65.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/sbin/frcheck</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 65.5 KB (67080 bytes)</li><li><strong>SHA-256:</strong> <code>8bd04de01ac8d4ed07ba3daee7a3d32db13fbad53486dc9da6ad06602ff1fde5</code></li></ul><p>Its return code feeds the rootfs boot chain: on m8 it maps to netstartd --soft-reset, on m9 to --hard-reset (a real per-model behavioral difference).</p></details><h3 id="mdnsd" tabindex="-1"><code>mdnsd</code> <a class="header-anchor" href="#mdnsd" aria-label="Permalink to &quot;\`mdnsd\`&quot;">​</a></h3><p>The discovery daemon: the standalone program that handles announcing and finding devices on the local network, shared across the system.</p><p><a href="/anacapad-internals/files/sbin/mdnsd">Download</a> · 513.8 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/sbin/mdnsd</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 513.8 KB (526152 bytes)</li><li><strong>SHA-256:</strong> <code>5e1bf99fe4ca077de4e71d4713afe8ce49f7450a4674b3ab1f8a655a2b4710a3</code></li></ul><p>Multicast-DNS daemon; the mdns/mdnsd log and the discovery layer on this site trace back to it.</p></details><h3 id="sddpd" tabindex="-1"><code>sddpd</code> <a class="header-anchor" href="#sddpd" aria-label="Permalink to &quot;\`sddpd\`&quot;">​</a></h3><p>The device-announcement daemon: the sibling process running Sonos&#39;s own broadcast protocol that keeps players aware of each other.</p><p><a href="/anacapad-internals/files/sbin/sddpd">Download</a> · 65.9 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/sbin/sddpd</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 65.9 KB (67464 bytes)</li><li><strong>SHA-256:</strong> <code>3b49f832d445c0f5c3c3bb15ffa5c596b22710ac8ae766615d2695fe38823521</code></li></ul><p>Sonos Discovery Protocol daemon configured by /etc/sddpd.conf; complements multicast DNS with Sonos&#39;s proprietary announce layer.</p></details><h3 id="udhcpc" tabindex="-1"><code>udhcpc</code> <a class="header-anchor" href="#udhcpc" aria-label="Permalink to &quot;\`udhcpc\`&quot;">​</a></h3><p>The DHCP client: the tiny program that asks your router for an address when the speaker boots on a normal network.</p><p><a href="/anacapad-internals/files/sbin/udhcpc">Download</a> · 66.3 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/sbin/udhcpc</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 66.3 KB (67852 bytes)</li><li><strong>SHA-256:</strong> <code>26803ab4fa77327f3f9518800c91aa35a37077955bb6ed35ce2fec7d7399a4ba</code></li></ul><p>busybox-style udhcp client driving /etc/dhcp.script on lease events.</p></details><h3 id="brctl" tabindex="-1"><code>brctl</code> <a class="header-anchor" href="#brctl" aria-label="Permalink to &quot;\`brctl\`&quot;">​</a></h3><p>The bridge control tool: manages the network bridge interface the speaker uses to share its connection in SonosNet setups.</p><p><a href="/anacapad-internals/files/usr/sbin/brctl">Download</a> · 66.0 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/usr/sbin/brctl</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 66.0 KB (67624 bytes)</li><li><strong>SHA-256:</strong> <code>6ffee508067d9163c73ae2c9ff256355ef4ca54cace0589ce12d20cfb3695ba7</code></li></ul><p>Ethernet-bridging utility for the bridged-wireless topology SonosNet requires.</p></details><h3 id="keyval" tabindex="-1"><code>keyval</code> <a class="header-anchor" href="#keyval" aria-label="Permalink to &quot;\`keyval\`&quot;">​</a></h3><p>The key-value store tool: reads and writes small system-level settings keys used by the lower-level services.</p><p><a href="/anacapad-internals/files/usr/sbin/keyval">Download</a> · 65.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/usr/sbin/keyval</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 65.6 KB (67128 bytes)</li><li><strong>SHA-256:</strong> <code>3bd52f3d28928b29ca3da547485bf4e5b71744b3db22c57a0930a4a73b99c859</code></li></ul><p>Keyval utility referenced by updater and network scripts; one of the persistent-state primitives below anacapad.</p></details><h3 id="setmac" tabindex="-1"><code>setmac</code> <a class="header-anchor" href="#setmac" aria-label="Permalink to &quot;\`setmac\`&quot;">​</a></h3><p>The MAC-address assignment tool: programs the unit&#39;s network hardware address during manufacturing or recovery.</p><p><a href="/anacapad-internals/files/usr/sbin/setmac">Download</a> · 65.7 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/usr/sbin/setmac</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 65.7 KB (67248 bytes)</li><li><strong>SHA-256:</strong> <code>fb3f727de446ffe5100c85b314eec2f19f037b15476aa189201e4ea9b7ea32c2</code></li></ul><p>Writes the device MAC; paired with mdputil&#39;s factory provisioning.</p></details><h3 id="radartool" tabindex="-1"><code>radartool</code> <a class="header-anchor" href="#radartool" aria-label="Permalink to &quot;\`radartool\`&quot;">​</a></h3><p>The radar-detection tool: on 5 GHz bands the radio must listen for radar before transmitting, and this utility performs those checks. It exists on this build because the Playbar can master SonosNet on radar-controlled channels.</p><p><a href="/anacapad-internals/files/wifi/N/radartool">Download</a> · 65.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/N/radartool</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 65.5 KB (67084 bytes)</li><li><strong>SHA-256:</strong> <code>93d9c6e54e9abe4a3769123d8cc42afcf79cc101d71ced4303b3fe5e0aad36b6</code></li></ul><p>DFS (radar) utility for the wifi/N modules; the dfs.ko module + this tool satisfy regulatory radar-detection requirements.</p></details><h3 id="athconfig" tabindex="-1"><code>athconfig</code> <a class="header-anchor" href="#athconfig" aria-label="Permalink to &quot;\`athconfig\`&quot;">​</a></h3><p>The Atheros radio configuration utility: low-level control of the WiFi chipset for modes like SonosNet mesh that the normal client stack does not handle.</p><p><a href="/anacapad-internals/files/wifi/athconfig">Download</a> · 65.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/athconfig</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 65.6 KB (67208 bytes)</li><li><strong>SHA-256:</strong> <code>cde6b1233c354fc940b00b44678694ebe2956785373df54a7d6acec1a7e6f545</code></li></ul><p>Atheros-specific tool for the radio&#39;s mesh/AP modes (SonosNet operates through this layer).</p></details><h3 id="netstartd" tabindex="-1"><code>netstartd</code> <a class="header-anchor" href="#netstartd" aria-label="Permalink to &quot;\`netstartd\`&quot;">​</a></h3><p>The network-startup daemon: the sibling process that actually brings the network up, manages setup mode, and hands connection status back to the main program. When the speaker joins WiFi, this is the program doing the joining.</p><p><a href="/anacapad-internals/files/wifi/netstartd">Download</a> · 257.9 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/netstartd</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 257.9 KB (264076 bytes)</li><li><strong>SHA-256:</strong> <code>9654a16c9b5c07c84131b574e216e7ba311be405c4a831e360a59d10ac35de7e</code></li></ul><p>ELF daemon; anacapad reaches it over /tmp/netstartd.ipc (the multi_daemon_boundary contract). It drives netconfig.sh and the flag files under /var/run.</p></details><h3 id="sta-assoc" tabindex="-1"><code>sta-assoc</code> <a class="header-anchor" href="#sta-assoc" aria-label="Permalink to &quot;\`sta-assoc\`&quot;">​</a></h3><p>A small association-status helper: used to check or report the radio&#39;s link state.</p><p><a href="/anacapad-internals/files/wifi/sta-assoc">View</a> · <a href="/anacapad-internals/files/wifi/sta-assoc">Download</a> · 1.1 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 64 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>usage() {</span></span>
<span class="line"><span>  echo &quot;Usage: $(basename $0) &lt;open|wpa&gt; &lt;ssid&gt; ( &lt;key&gt; )&quot;</span></span>
<span class="line"><span>  exit 1</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>a2h() {</span></span>
<span class="line"><span>    temp=&quot;$1&quot;</span></span>
<span class="line"><span>    while test -n &quot;$temp&quot;; do</span></span>
<span class="line"><span>        c=\`expr substr &quot;$temp&quot; 1 1\`</span></span>
<span class="line"><span>        printf &#39;%x&#39; &quot;&#39;$c&#39;&quot;</span></span>
<span class="line"><span>        temp=\`expr substr &quot;$temp&quot; 2 32\`</span></span>
<span class="line"><span>    done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>get_supp_conf() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  mode=&quot;$1&quot;</span></span>
<span class="line"><span>  ssid=&quot;$2&quot;</span></span>
<span class="line"><span>  key=&quot;$3&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ssid_hex=$(a2h &quot;$ssid&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  case $mode in</span></span>
<span class="line"><span>    open)</span></span>
<span class="line"><span>      /wifi/athconfig stasetkeylen ath0 0</span></span>
<span class="line"><span>      echo &quot;network={&quot;</span></span>
<span class="line"><span>      echo &quot;ssid=$ssid_hex&quot;</span></span>
<span class="line"><span>      echo &quot;scan_ssid=1&quot;</span></span>
<span class="line"><span>      echo &quot;key_mgmt=NONE&quot;</span></span>
<span class="line"><span>      echo &quot;priority=0&quot;</span></span>
<span class="line"><span>      echo &quot;}&quot;</span></span>
<span class="line"><span>      ;;</span></span>
<span class="line"><span>    wpa)</span></span>
<span class="line"><span>      if [ -z &quot;$key&quot; ] ; then usage ; fi</span></span>
<span class="line"><span>      key_hex=$(a2h &quot;$key&quot;)</span></span>
<span class="line"><span>      /wifi/athconfig stasetkeylen ath0 \${#key_hex}</span></span>
<span class="line"><span>      echo &quot;network={&quot;</span></span>
<span class="line"><span>      echo &quot;ssid=$ssid_hex&quot;</span></span>
<span class="line"><span>      echo &quot;scan_ssid=1&quot;</span></span>
<span class="line"><span>      echo &quot;psk=$key_hex&quot;</span></span>
<span class="line"><span>      echo &quot;priority=0&quot;</span></span>
<span class="line"><span>      echo &quot;}&quot;</span></span>
<span class="line"><span>      ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>      usage ;;</span></span>
<span class="line"><span>  esac</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -z &quot;$1&quot; ] || [ -z &quot;$2&quot; ]; then</span></span>
<span class="line"><span>  usage</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>killall wpa_supplicant &gt; /dev/null 2&gt;&amp;1</span></span>
<span class="line"><span>get_supp_conf &quot;$1&quot; &quot;$2&quot; &quot;$3&quot; &gt; /tmp/supplicant_conf.tmp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/wifi/wpa_supplicant -s -B -D sonos -i ath0 -b br0 -c /tmp/supplicant_conf.tmp</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/sta-assoc</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 1.1 KB (1169 bytes)</li><li><strong>SHA-256:</strong> <code>a376a1f0774a09b3a642ce4626ccd335d81a52d9a527a21cb9cfd3d0c2c3267e</code></li></ul><p>Station-association utility tied to the Atheros stack and the assoctracker monitoring.</p></details><h3 id="wacd" tabindex="-1"><code>wacd</code> <a class="header-anchor" href="#wacd" aria-label="Permalink to &quot;\`wacd\`&quot;">​</a></h3><p>The setup-mode daemon: the program that runs the temporary open network your phone joins during initial setup, where the player receives its first WiFi credentials.</p><p><a href="/anacapad-internals/files/wifi/wacd">Download</a> · 65.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/wacd</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 65.6 KB (67128 bytes)</li><li><strong>SHA-256:</strong> <code>a51d696f54f86c637ceac00ee8d9e83b20e354fee7219a2de37f89b133570305</code></li></ul><p>Wireless-accessory-configuration daemon; the /var/run/wac_mode flag and WAC timeout are documented under wac_mode.</p></details><h3 id="wpa-supplicant" tabindex="-1"><code>wpa_supplicant</code> <a class="header-anchor" href="#wpa-supplicant" aria-label="Permalink to &quot;\`wpa_supplicant\`&quot;">​</a></h3><p>The WiFi client program: the standard open-source component that handles the actual handshake joining your home network. Practically every Linux WiFi device carries this.</p><p><a href="/anacapad-internals/files/wifi/wpa_supplicant">Download</a> · 322.0 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/wpa_supplicant</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 322.0 KB (329684 bytes)</li><li><strong>SHA-256:</strong> <code>b3ed6402fc388bd7aa73919b1dd7828a011186d1e384fdb6487c7c85c9737ddf</code></li></ul><p>wpa_supplicant build for the Atheros radio; driven by configs like /var/run/htapsatwpa.conf and the jffs debug overrides.</p></details><h3 id="wpaconfig" tabindex="-1"><code>wpaconfig</code> <a class="header-anchor" href="#wpaconfig" aria-label="Permalink to &quot;\`wpaconfig\`&quot;">​</a></h3><p>A small helper used to generate or adjust WiFi client configuration for the supplicant.</p><p><a href="/anacapad-internals/files/wifi/wpaconfig">View</a> · <a href="/anacapad-internals/files/wifi/wpaconfig">Download</a> · 2.2 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 85 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ &quot;\${#1}&quot; -eq &quot;0&quot; ]; then</span></span>
<span class="line"><span>    echo &quot;usage: \${0} &lt;settings file&gt; [wpa config file]&quot;</span></span>
<span class="line"><span>    exit</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ &quot;\${#2}&quot; -ne &quot;0&quot; ]; then</span></span>
<span class="line"><span>    WPACONFIG=\${2}</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    WPACONFIG=/var/run/wpa_supplicant.conf</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -f /jffs/debug/wpa_proto ]; then</span></span>
<span class="line"><span>    WPAPROTO=\`cat /jffs/debug/wpa_proto\`</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>if [ -f /jffs/debug/wpa_ptk ]; then</span></span>
<span class="line"><span>    WPAPTK=\`cat /jffs/debug/wpa_ptk\`</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>if [ -f /jffs/debug/wpa_gtk ]; then</span></span>
<span class="line"><span>    WPAGTK=\`cat /jffs/debug/wpa_gtk\`</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;eapol_version=1&quot;    &gt;  \${WPACONFIG}</span></span>
<span class="line"><span>echo &quot;ap_scan=1&quot;          &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print_entry()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    SSIDHEX=$1</span></span>
<span class="line"><span>    KEYHEX=$2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if [ \${#KEYHEX} -gt &quot;15&quot; ] &amp;&amp; [ \${#KEYHEX} -lt &quot;129&quot; ]; then</span></span>
<span class="line"><span>        echo &quot;network={&quot;              &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>        echo &quot;ssid=\${SSIDHEX}&quot;        &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>        echo &quot;scan_ssid=1&quot;            &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>        echo &quot;psk=\${KEYHEX}&quot;          &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>        if [ &quot;\${#WPAPROTO}&quot; -ne &quot;0&quot; ];then</span></span>
<span class="line"><span>            echo &quot;proto=\${WPAPROTO}&quot;  &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        if [ &quot;\${#WPAPTK}&quot; -ne &quot;0&quot; ];then</span></span>
<span class="line"><span>            echo &quot;pairwise=\${WPAPTK}&quot; &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        if [ &quot;\${#WPAGTK}&quot; -ne &quot;0&quot; ];then</span></span>
<span class="line"><span>            echo &quot;group=\${WPAGTK}&quot;    &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        echo &quot;priority=2&quot;             &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>        echo &quot;}&quot;                      &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    echo &quot;network={&quot;          &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>    echo &quot;ssid=\${SSIDHEX}&quot;    &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>    echo &quot;scan_ssid=1&quot;        &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>    echo &quot;key_mgmt=NONE&quot;      &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span>    echo &quot;}&quot;                  &gt;&gt; \${WPACONFIG}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /wifi/athconfig stassidlistadd ath0 \${SSIDHEX} \${#KEYHEX}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/wifi/athconfig stassidlistclr ath0</span></span>
<span class="line"><span>/wifi/athconfig wossidclr ath0</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/wpaconfig</code></li><li><strong>Category:</strong> binaries</li><li><strong>Size:</strong> 2.2 KB (2236 bytes)</li><li><strong>SHA-256:</strong> <code>883675c1177bd4ce329e34fe2a861dd0fbc64bac8288b17328e27f388eb082ac</code></li></ul><p>WPA config utility invoked by the netconfig script family.</p></details><h2 id="shared-libraries" tabindex="-1">Shared libraries <a class="header-anchor" href="#shared-libraries" aria-label="Permalink to &quot;Shared libraries&quot;">​</a></h2><p>Reusable code bundles the programs load at runtime. Each one provides a specialty, like playing a music format, encrypting a connection, or talking to a database, so the main program does not have to carry everything itself.</p><details class="details custom-block"><summary>Technical details</summary><p>Dynamically linked ELF shared objects under /lib and /usr/lib; includes Sonos-internal libsonos-* components plus bundled third-party libraries.</p></details><h3 id="ld-so-1" tabindex="-1"><code>ld.so.1</code> <a class="header-anchor" href="#ld-so-1" aria-label="Permalink to &quot;\`ld.so.1\`&quot;">​</a></h3><p>The dynamic loader itself: the very first piece of code that runs when any program starts, responsible for finding and linking all the shared libraries below.</p><p><a href="/anacapad-internals/files/lib/ld.so.1">Download</a> · 197.3 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/ld.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 197.3 KB (202084 bytes)</li><li><strong>SHA-256:</strong> <code>925663a234c829c93f0a154a888d475cd5f529d4e8bb78093052db73a0286484</code></li></ul><p>Runtime linker/loader (glibc ld.so); resolves every .so dependency at process start.</p></details><h3 id="libanl-so-1" tabindex="-1"><code>libanl.so.1</code> <a class="header-anchor" href="#libanl-so-1" aria-label="Permalink to &quot;\`libanl.so.1\`&quot;">​</a></h3><p>A resolver helper for asynchronous name lookups, part of the standard C library family.</p><p><a href="/anacapad-internals/files/lib/libanl.so.1">Download</a> · 65.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libanl.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.6 KB (67216 bytes)</li><li><strong>SHA-256:</strong> <code>bf44349ff423df018391a8c8c33717e3b43bcb82f3e710f7a69ced43276ff374</code></li></ul><p>glibc async DNS stub resolver library.</p></details><h3 id="libatomic-so-1" tabindex="-1"><code>libatomic.so.1</code> <a class="header-anchor" href="#libatomic-so-1" aria-label="Permalink to &quot;\`libatomic.so.1\`&quot;">​</a></h3><p>Provides atomic operations for code that needs to update shared values safely across threads.</p><p><a href="/anacapad-internals/files/lib/libatomic.so.1">Download</a> · 65.3 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libatomic.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.3 KB (66888 bytes)</li><li><strong>SHA-256:</strong> <code>936d09871114ec00675d9dca65d9ee65602f8cfff561a9d1600f2f0951765d8e</code></li></ul><p>GCC runtime for atomic builtins used by the C++ concurrency primitives.</p></details><h3 id="libavcodec-so-59" tabindex="-1"><code>libavcodec.so.59</code> <a class="header-anchor" href="#libavcodec-so-59" aria-label="Permalink to &quot;\`libavcodec.so.59\`&quot;">​</a></h3><p>One of the FFmpeg libraries: provides the codecs that decode compressed audio formats the speaker receives.</p><p><a href="/anacapad-internals/files/lib/libavcodec.so.59">Download</a> · 513.8 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libavcodec.so.59</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 513.8 KB (526112 bytes)</li><li><strong>SHA-256:</strong> <code>b76beb0d832bcd54646196e33459fb06ef16e15b71fbd6619d68f95d87fb3772</code></li></ul><p>FFmpeg codec library (avcodec 59); backs part of the decode layer alongside the dedicated decoders.</p></details><h3 id="libavformat-so-59" tabindex="-1"><code>libavformat.so.59</code> <a class="header-anchor" href="#libavformat-so-59" aria-label="Permalink to &quot;\`libavformat.so.59\`&quot;">​</a></h3><p>The FFmpeg container-format library: understands the file and stream wrappers that audio arrives in, like MP4 or streaming containers.</p><p><a href="/anacapad-internals/files/lib/libavformat.so.59">Download</a> · 321.7 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libavformat.so.59</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 321.7 KB (329396 bytes)</li><li><strong>SHA-256:</strong> <code>8fdf976dca64b38bc36953b83b1ebd21962d1aecc5b3861232c26c4a1ab7d778</code></li></ul><p>FFmpeg demuxer library; parses container formats for the audio pipeline.</p></details><h3 id="libavutil-so-57" tabindex="-1"><code>libavutil.so.57</code> <a class="header-anchor" href="#libavutil-so-57" aria-label="Permalink to &quot;\`libavutil.so.57\`&quot;">​</a></h3><p>The FFmpeg utility foundation: shared helpers the other FFmpeg libraries use for buffers, math, and data structures.</p><p><a href="/anacapad-internals/files/lib/libavutil.so.57">Download</a> · 770.2 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libavutil.so.57</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 770.2 KB (788656 bytes)</li><li><strong>SHA-256:</strong> <code>c5410f65833a122f6d03945554ab28150085733e8091179ad25c85318d99a082</code></li></ul><p>FFmpeg utility library (libavutil 57).</p></details><h3 id="libc-so-6" tabindex="-1"><code>libc.so.6</code> <a class="header-anchor" href="#libc-so-6" aria-label="Permalink to &quot;\`libc.so.6\`&quot;">​</a></h3><p>The core C library: the basic building blocks every program uses, from memory and strings to files and sockets. The single most fundamental library on the device.</p><p><a href="/anacapad-internals/files/lib/libc.so.6">Download</a> · 1.5 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libc.so.6</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 1.5 MB (1593260 bytes)</li><li><strong>SHA-256:</strong> <code>68480e345dae7c02b16cce5797c23f7205baf08e0b491e11c34eccaae4121c74</code></li></ul><p>glibc 6; the platform C runtime.</p></details><h3 id="libcrypt-so-1" tabindex="-1"><code>libcrypt.so.1</code> <a class="header-anchor" href="#libcrypt-so-1" aria-label="Permalink to &quot;\`libcrypt.so.1\`&quot;">​</a></h3><p>The password-hashing library: implements the cryptographic hashing used for account passwords in the shadow file.</p><p><a href="/anacapad-internals/files/lib/libcrypt.so.1">Download</a> · 65.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libcrypt.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.6 KB (67152 bytes)</li><li><strong>SHA-256:</strong> <code>6045bf5a663a0b035f0dde6fb858ecb01b53215ee81ad27411d1d799db5bf39d</code></li></ul><p>libcrypt with MD5-crypt ($1$) and friends; the format etc/shadow uses.</p></details><h3 id="libdcadec-so-0" tabindex="-1"><code>libdcadec.so.0</code> <a class="header-anchor" href="#libdcadec-so-0" aria-label="Permalink to &quot;\`libdcadec.so.0\`&quot;">​</a></h3><p>The DTS decoder: handles the DTS surround format that some TVs and discs send instead of Dolby. Its presence is a Playbar-specific feature; smaller speakers do not ship it.</p><p><a href="/anacapad-internals/files/lib/libdcadec.so.0">Download</a> · 385.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libdcadec.so.0</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 385.6 KB (394888 bytes)</li><li><strong>SHA-256:</strong> <code>4bd12f82476b9b10cd5ae7007143f7207923bb85f98b465a61426b28c906b50d</code></li></ul><p>DTS decode library (dcadec); an m9-only component flagged in the firmware-differences page.</p></details><h3 id="libdl-so-2" tabindex="-1"><code>libdl.so.2</code> <a class="header-anchor" href="#libdl-so-2" aria-label="Permalink to &quot;\`libdl.so.2\`&quot;">​</a></h3><p>The dynamic-loading helper: lets programs open extra shared libraries on demand after they have already started.</p><p><a href="/anacapad-internals/files/lib/libdl.so.2">Download</a> · 65.7 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libdl.so.2</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.7 KB (67268 bytes)</li><li><strong>SHA-256:</strong> <code>4af444ffc67a8ce5e9a7c69b6890a9a28de563c97ccd083020be98213d332faf</code></li></ul><p>glibc dlopen/dlsym stubs.</p></details><h3 id="libdns-sd-so-1" tabindex="-1"><code>libdns_sd.so.1</code> <a class="header-anchor" href="#libdns-sd-so-1" aria-label="Permalink to &quot;\`libdns_sd.so.1\`&quot;">​</a></h3><p>The service-discovery client library: the piece programs use to announce and find services on the local network.</p><p><a href="/anacapad-internals/files/lib/libdns_sd.so.1">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libdns_sd.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.4 KB (66968 bytes)</li><li><strong>SHA-256:</strong> <code>7f0c4057b48f02e4586370837b83148c62eea8951a06562c2bcf2234d5a4bf33</code></li></ul><p>DNS-SD client library backing the mDNS/discovery layer.</p></details><h3 id="libflash-so-1" tabindex="-1"><code>libflash.so.1</code> <a class="header-anchor" href="#libflash-so-1" aria-label="Permalink to &quot;\`libflash.so.1\`&quot;">​</a></h3><p>The flash-memory library: safe read/write access to the device&#39;s flash storage, used by the updater and the factory-data tooling.</p><p><a href="/anacapad-internals/files/lib/libflash.so.1">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libflash.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.4 KB (67016 bytes)</li><li><strong>SHA-256:</strong> <code>454a6c5e2bde42f0f6fa64854dc738a3d1b4731a99f4af6c9272576ca2ff641d</code></li></ul><p>Sonos flash/NCD access library; backs mdputil and the device-payload handling.</p></details><h3 id="libgcc-s-so-1" tabindex="-1"><code>libgcc_s.so.1</code> <a class="header-anchor" href="#libgcc-s-so-1" aria-label="Permalink to &quot;\`libgcc_s.so.1\`&quot;">​</a></h3><p>A small GCC support runtime providing helpers the compiler emits calls into, like long-division on hardware that lacks the instruction.</p><p><a href="/anacapad-internals/files/lib/libgcc_s.so.1">Download</a> · 129.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libgcc_s.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 129.5 KB (132564 bytes)</li><li><strong>SHA-256:</strong> <code>3210e9d6b8605e995224f9f65cd1eb2a09edd67d2b690198059184d785450ae2</code></li></ul><p>GCC shared runtime support library.</p></details><h3 id="libhwmessagelib-so-1" tabindex="-1"><code>libhwmessagelib.so.1</code> <a class="header-anchor" href="#libhwmessagelib-so-1" aria-label="Permalink to &quot;\`libhwmessagelib.so.1\`&quot;">​</a></h3><p>Sonos&#39;s hardware-message library: the shared code for sending events between the kernel drivers and the programs, covering things like button presses and jacks.</p><p><a href="/anacapad-internals/files/lib/libhwmessagelib.so.1">Download</a> · 65.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libhwmessagelib.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.5 KB (67068 bytes)</li><li><strong>SHA-256:</strong> <code>f9a8118a37378555d5e0015135c53db84119f4cda90b4ac5eab95c411c58e1c4</code></li></ul><p>Sonos-internal lib; backs hwmessagelib/hw_input_events.</p></details><h3 id="libm-so-6" tabindex="-1"><code>libm.so.6</code> <a class="header-anchor" href="#libm-so-6" aria-label="Permalink to &quot;\`libm.so.6\`&quot;">​</a></h3><p>The math library: floating-point and transcendental functions used by audio processing and anything else that computes.</p><p><a href="/anacapad-internals/files/lib/libm.so.6">Download</a> · 1.1 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libm.so.6</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 1.1 MB (1196608 bytes)</li><li><strong>SHA-256:</strong> <code>b50c76409e06d9d4d44318a5ef80acebe3bb20e99f28946a31419c51fa782363</code></li></ul><p>glibc math library.</p></details><h3 id="libmbedcrypto-so-16" tabindex="-1"><code>libmbedcrypto.so.16</code> <a class="header-anchor" href="#libmbedcrypto-so-16" aria-label="Permalink to &quot;\`libmbedcrypto.so.16\`&quot;">​</a></h3><p>The cryptographic primitives library: the raw math for encryption, hashing, and signing that the TLS layer builds on.</p><p><a href="/anacapad-internals/files/lib/libmbedcrypto.so.16">Download</a> · 385.7 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libmbedcrypto.so.16</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 385.7 KB (394952 bytes)</li><li><strong>SHA-256:</strong> <code>a1963eed20b9837f13c0d8620ec78508e3a096174d799ca3556dea9988bdb866</code></li></ul><p>mbedTLS crypto core; underpins the secure channels (lechmere, TLS to music services, cert verification).</p></details><h3 id="libmbedtls-so-21" tabindex="-1"><code>libmbedtls.so.21</code> <a class="header-anchor" href="#libmbedtls-so-21" aria-label="Permalink to &quot;\`libmbedtls.so.21\`&quot;">​</a></h3><p>The secure-connection library: implements the encrypted protocol behind every https and secure-socket conversation the speaker has, from cloud calls to music services.</p><p><a href="/anacapad-internals/files/lib/libmbedtls.so.21">Download</a> · 129.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libmbedtls.so.21</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 129.5 KB (132560 bytes)</li><li><strong>SHA-256:</strong> <code>c61d42e59c107c5a8bf9d01358322d2cef656e890e3c46141cc4ae3599694cde</code></li></ul><p>mbedTLS TLS implementation; the tls_stack entry documents the layer built on it.</p></details><h3 id="libmbedx509-so-7" tabindex="-1"><code>libmbedx509.so.7</code> <a class="header-anchor" href="#libmbedx509-so-7" aria-label="Permalink to &quot;\`libmbedx509.so.7\`&quot;">​</a></h3><p>The certificate-parsing library: understands the format of digital certificates so the device can verify who it is talking to.</p><p><a href="/anacapad-internals/files/lib/libmbedx509.so.7">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libmbedx509.so.7</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.4 KB (66976 bytes)</li><li><strong>SHA-256:</strong> <code>730be3bbb923833a5fdb17c4bd65b0eb16a96ab962f12276492bab287016b437</code></li></ul><p>mbedTLS X.509 parser; used with libsonos-certval for device identity.</p></details><h3 id="libmpg123-so-0" tabindex="-1"><code>libmpg123.so.0</code> <a class="header-anchor" href="#libmpg123-so-0" aria-label="Permalink to &quot;\`libmpg123.so.0\`&quot;">​</a></h3><p>The MP3 decoder library: fast, mature MPEG-audio decoding for one of the oldest formats the player accepts.</p><p><a href="/anacapad-internals/files/lib/libmpg123.so.0">Download</a> · 194.0 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libmpg123.so.0</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 194.0 KB (198636 bytes)</li><li><strong>SHA-256:</strong> <code>18566d9f255bcbd5d41ec649738c5a7b1e06180458fcb97eebbdc51f2c362fda</code></li></ul><p>mpg123 decode library.</p></details><h3 id="libnl-3-so-200" tabindex="-1"><code>libnl-3.so.200</code> <a class="header-anchor" href="#libnl-3-so-200" aria-label="Permalink to &quot;\`libnl-3.so.200\`&quot;">​</a></h3><p>The netlink library: how userspace programs talk to the kernel&#39;s networking subsystem for things like interface and route events.</p><p><a href="/anacapad-internals/files/lib/libnl-3.so.200">Download</a> · 129.9 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libnl-3.so.200</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 129.9 KB (132980 bytes)</li><li><strong>SHA-256:</strong> <code>7860c4c6239085ecab4c42092796f9e58b4da6788c5509a1001eeb8863361e35</code></li></ul><p>netlink-3 core library.</p></details><h3 id="libnl-genl-3-so-200" tabindex="-1"><code>libnl-genl-3.so.200</code> <a class="header-anchor" href="#libnl-genl-3-so-200" aria-label="Permalink to &quot;\`libnl-genl-3.so.200\`&quot;">​</a></h3><p>The generic-netlink extension: the modern netlink flavor used for wireless and other kernel subsystems.</p><p><a href="/anacapad-internals/files/lib/libnl-genl-3.so.200">Download</a> · 66.0 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libnl-genl-3.so.200</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 66.0 KB (67584 bytes)</li><li><strong>SHA-256:</strong> <code>a757566c04cebbb4db3d4b435d6de7cbb5506a4238722a3e92f26cb6cc540104</code></li></ul><p>netlink-3 generic library; consumed by WiFi tooling.</p></details><h3 id="libnss-dns-so-2" tabindex="-1"><code>libnss_dns.so.2</code> <a class="header-anchor" href="#libnss-dns-so-2" aria-label="Permalink to &quot;\`libnss_dns.so.2\`&quot;">​</a></h3><p>The DNS name-service module: the piece that actually performs name lookups when a program asks for a hostname&#39;s address.</p><p><a href="/anacapad-internals/files/lib/libnss_dns.so.2">Download</a> · 65.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libnss_dns.so.2</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.5 KB (67060 bytes)</li><li><strong>SHA-256:</strong> <code>dbd9e2ce0f5805dfabdcbcf41068d44b2c23e0ec9160db8e9123b02a434f288a</code></li></ul><p>glibc NSS DNS plugin loaded per nsswitch.conf.</p></details><h3 id="libnss-files-so-2" tabindex="-1"><code>libnss_files.so.2</code> <a class="header-anchor" href="#libnss-files-so-2" aria-label="Permalink to &quot;\`libnss_files.so.2\`&quot;">​</a></h3><p>The file-based name-service module: answers lookups from flat files like hosts and passwd before the network is consulted.</p><p><a href="/anacapad-internals/files/lib/libnss_files.so.2">Download</a> · 65.7 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libnss_files.so.2</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.7 KB (67228 bytes)</li><li><strong>SHA-256:</strong> <code>0dacf4f54ea6e3bf02dd6839aa0e15686220c9860e78e69d34d33b112c4a3a4b</code></li></ul><p>glibc NSS files plugin.</p></details><h3 id="libpcap-so-1" tabindex="-1"><code>libpcap.so.1</code> <a class="header-anchor" href="#libpcap-so-1" aria-label="Permalink to &quot;\`libpcap.so.1\`&quot;">​</a></h3><p>The packet-capture library: the standard API for sniffing network traffic, backing the pcap diagnostic tool.</p><p><a href="/anacapad-internals/files/lib/libpcap.so.1">Download</a> · 260.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libpcap.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 260.5 KB (266780 bytes)</li><li><strong>SHA-256:</strong> <code>a41237fb615ad5af53c1fbfa8a853b0d17d0be44a6aae177a68188eddf9785f6</code></li></ul><p>libpcap; used by bin/pcap for diagnostic captures.</p></details><h3 id="libprotobuf-nanopb-so-0" tabindex="-1"><code>libprotobuf-nanopb.so.0</code> <a class="header-anchor" href="#libprotobuf-nanopb-so-0" aria-label="Permalink to &quot;\`libprotobuf-nanopb.so.0\`&quot;">​</a></h3><p>A small protocol-buffers implementation for structured data: the lightweight serialization used in the embedded plumbing.</p><p><a href="/anacapad-internals/files/lib/libprotobuf-nanopb.so.0">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libprotobuf-nanopb.so.0</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.4 KB (66976 bytes)</li><li><strong>SHA-256:</strong> <code>5cf58557c28f238743c16c45ca6aa69f473abf75e6b12674426932162dea48a3</code></li></ul><p>nanopb protobuf runtime; pairs with the decoded protobuf descriptor set documented under protobuf_descriptors.</p></details><h3 id="libpthread-so-0" tabindex="-1"><code>libpthread.so.0</code> <a class="header-anchor" href="#libpthread-so-0" aria-label="Permalink to &quot;\`libpthread.so.0\`&quot;">​</a></h3><p>The threading library: lets programs run many things at once, which a speaker needs constantly for playback, networking, and control at the same time.</p><p><a href="/anacapad-internals/files/lib/libpthread.so.0">Download</a> · 131.1 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libpthread.so.0</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 131.1 KB (134284 bytes)</li><li><strong>SHA-256:</strong> <code>a7e61be7e6fc906d4a8ae1b241c02fedca47c5aac4d3161b4e3687e43d06fec1</code></li></ul><p>glibc POSIX threads.</p></details><h3 id="libresolv-so-2" tabindex="-1"><code>libresolv.so.2</code> <a class="header-anchor" href="#libresolv-so-2" aria-label="Permalink to &quot;\`libresolv.so.2\`&quot;">​</a></h3><p>The resolver library: full DNS query machinery beyond the simple name lookups.</p><p><a href="/anacapad-internals/files/lib/libresolv.so.2">Download</a> · 130.2 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libresolv.so.2</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 130.2 KB (133324 bytes)</li><li><strong>SHA-256:</strong> <code>36bd8c24be52922455395f6399ac6d02cb5d7b03ba1d1d797be7c33d9a7117a3</code></li></ul><p>glibc resolver library.</p></details><h3 id="libsbc-so-1" tabindex="-1"><code>libsbc.so.1</code> <a class="header-anchor" href="#libsbc-so-1" aria-label="Permalink to &quot;\`libsbc.so.1\`&quot;">​</a></h3><p>The Bluetooth audio codec library: decodes the standard Bluetooth audio format on products that ship a Bluetooth radio. It is present here because the codebase is shared across models.</p><p><a href="/anacapad-internals/files/lib/libsbc.so.1">Download</a> · 129.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsbc.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 129.5 KB (132612 bytes)</li><li><strong>SHA-256:</strong> <code>a1a5998d4a6d6a6563185296da0515997cede5d88449419bbc150fbfedca6c9a</code></li></ul><p>SBC codec library; dormant on this wired-only Playbar (documented under bt_sbc).</p></details><h3 id="libsmb2-so-1" tabindex="-1"><code>libsmb2.so.1</code> <a class="header-anchor" href="#libsmb2-so-1" aria-label="Permalink to &quot;\`libsmb2.so.1\`&quot;">​</a></h3><p>The Windows file-sharing client library: the component that lets the speaker mount and read music stored on computers and NAS drives.</p><p><a href="/anacapad-internals/files/lib/libsmb2.so.1">Download</a> · 193.9 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsmb2.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 193.9 KB (198556 bytes)</li><li><strong>SHA-256:</strong> <code>ba823cc96747f662227885c14134a735f24d1338d6c53b659816468a7ec0805a</code></li></ul><p>SMB2 client library backing the smb/mntmgr music-share machinery.</p></details><h3 id="libsonos-certval-so-2" tabindex="-1"><code>libsonos-certval.so.2</code> <a class="header-anchor" href="#libsonos-certval-so-2" aria-label="Permalink to &quot;\`libsonos-certval.so.2\`&quot;">​</a></h3><p>The device-certificate verifier: Sonos&#39;s own library for checking that a presented certificate chains back to a trusted Sonos root. It is what &#39;a genuine Sonos device&#39; means in code.</p><p><a href="/anacapad-internals/files/lib/libsonos-certval.so.2">Download</a> · 1.6 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsonos-certval.so.2</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 1.6 MB (1706972 bytes)</li><li><strong>SHA-256:</strong> <code>6a3aaba84eea36d6ea0fafbcce1321199958950a62d4a8ded483fc796fa4f230</code></li></ul><p>Sonos-internal cert validation library; manages the RCB bundles including /etc/fallback_trusted_roots.rcb (see libsonos_certval).</p></details><h3 id="libsonos-mdp-so-1" tabindex="-1"><code>libsonos-mdp.so.1</code> <a class="header-anchor" href="#libsonos-mdp-so-1" aria-label="Permalink to &quot;\`libsonos-mdp.so.1\`&quot;">​</a></h3><p>The manufacturing-data library: reads and writes the factory data block carrying serial number, MAC, and per-unit calibration values.</p><p><a href="/anacapad-internals/files/lib/libsonos-mdp.so.1">Download</a> · 65.3 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsonos-mdp.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.3 KB (66888 bytes)</li><li><strong>SHA-256:</strong> <code>919a36bec2cd00aaa31efefff2b0cf7d4ba3247d63f1ac88f5739a6a630b628c</code></li></ul><p>Sonos-internal MDP library behind mdputil and the device-payload.bin template.</p></details><h3 id="libsonos-root-cert-bundle-so-2" tabindex="-1"><code>libsonos-root-cert-bundle.so.2</code> <a class="header-anchor" href="#libsonos-root-cert-bundle-so-2" aria-label="Permalink to &quot;\`libsonos-root-cert-bundle.so.2\`&quot;">​</a></h3><p>The packaged root-cert bundle: the primary set of trust anchors for secure connections, shipped as its own updatable library.</p><p><a href="/anacapad-internals/files/lib/libsonos-root-cert-bundle.so.2">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsonos-root-cert-bundle.so.2</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.4 KB (66984 bytes)</li><li><strong>SHA-256:</strong> <code>4cd8ae0486d1d68f01e25408f98b572b6e55ae41f77912d8adaeae812f9803a6</code></li></ul><p>Sonos cert-bundle carrier; its runtime-update path is documented under libsonos_certval/rcb_bundle_format.</p></details><h3 id="libsonos-time-c-so-1" tabindex="-1"><code>libsonos-time-c.so.1</code> <a class="header-anchor" href="#libsonos-time-c-so-1" aria-label="Permalink to &quot;\`libsonos-time-c.so.1\`&quot;">​</a></h3><p>Sonos&#39;s own time library: the company&#39;s shared clock code that the sync machinery builds on.</p><p><a href="/anacapad-internals/files/lib/libsonos-time-c.so.1">Download</a> · 65.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsonos-time-c.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.5 KB (67116 bytes)</li><li><strong>SHA-256:</strong> <code>c3b34b1a671da66b2e61f8cb2c6bf47991d6f9c0777fd726f06e71b2666c1325</code></li></ul><p>Sonos-internal time library feeding the sntp/time-sync layer.</p></details><h3 id="libsonoscrypto-so-3" tabindex="-1"><code>libsonoscrypto.so.3</code> <a class="header-anchor" href="#libsonoscrypto-so-3" aria-label="Permalink to &quot;\`libsonoscrypto.so.3\`&quot;">​</a></h3><p>Sonos&#39;s cryptographic wrapper: the company&#39;s own layer on top of the base crypto, used for signing and key handling across the household protocols.</p><p><a href="/anacapad-internals/files/lib/libsonoscrypto.so.3">Download</a> · 65.7 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsonoscrypto.so.3</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.7 KB (67316 bytes)</li><li><strong>SHA-256:</strong> <code>7ba2531b9c5921e414af50404e202d5ad0f3f015214d8f2578355fb6ea69f681</code></li></ul><p>Sonos-internal crypto utility library; the PSK hierarchy entries describe what it protects.</p></details><h3 id="libsonoseventreporter-so-1" tabindex="-1"><code>libsonoseventreporter.so.1</code> <a class="header-anchor" href="#libsonoseventreporter-so-1" aria-label="Permalink to &quot;\`libsonoseventreporter.so.1\`&quot;">​</a></h3><p>The event-reporting library: the shared machinery for packaging and shipping telemetry and diagnostic events up to Sonos.</p><p><a href="/anacapad-internals/files/lib/libsonoseventreporter.so.1">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsonoseventreporter.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.4 KB (66984 bytes)</li><li><strong>SHA-256:</strong> <code>e0f4b82d2d4d85a1d53eafb0d0e02cf3172f8d2f279f4990f453a9c96b8684f5</code></li></ul><p>Sonos-internal reporter library; part of the telemetry/reporting pipeline.</p></details><h3 id="libsonosminiutils-so-1" tabindex="-1"><code>libsonosminiutils.so.1</code> <a class="header-anchor" href="#libsonosminiutils-so-1" aria-label="Permalink to &quot;\`libsonosminiutils.so.1\`&quot;">​</a></h3><p>A grab-bag Sonos utility library: small shared helpers the daemons and tools reuse.</p><p><a href="/anacapad-internals/files/lib/libsonosminiutils.so.1">Download</a> · 65.9 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsonosminiutils.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.9 KB (67500 bytes)</li><li><strong>SHA-256:</strong> <code>94c1afdcdff05f2696a13878de75d209f36c6086938059d501f91c68af81a192</code></li></ul><p>Sonos-internal utility library.</p></details><h3 id="libsonossbcpacket-so-1" tabindex="-1"><code>libsonossbcpacket.so.1</code> <a class="header-anchor" href="#libsonossbcpacket-so-1" aria-label="Permalink to &quot;\`libsonossbcpacket.so.1\`&quot;">​</a></h3><p>The Sonos channel-protocol packet library: framing for the proprietary audio-distribution protocol that keeps grouped players in sync.</p><p><a href="/anacapad-internals/files/lib/libsonossbcpacket.so.1">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsonossbcpacket.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.4 KB (66976 bytes)</li><li><strong>SHA-256:</strong> <code>64fa1ab7469501d0e8cc43b882b4b3dbb3fef287a90921a6bf98249a959e8dee</code></li></ul><p>Sonos-internal packet library for the chsrc/chsnk group-audio channel (see native_protocols).</p></details><h3 id="libsonossyslog-so-1" tabindex="-1"><code>libsonossyslog.so.1</code> <a class="header-anchor" href="#libsonossyslog-so-1" aria-label="Permalink to &quot;\`libsonossyslog.so.1\`&quot;">​</a></h3><p>Sonos&#39;s logging glue: the internal library that routes messages into the per-subsystem log files.</p><p><a href="/anacapad-internals/files/lib/libsonossyslog.so.1">Download</a> · 65.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsonossyslog.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.5 KB (67056 bytes)</li><li><strong>SHA-256:</strong> <code>d329c65f3724229a9303f9b9b0db3f2c61a1c7178db44b69dfd0da575c931cec</code></li></ul><p>Sonos-internal syslog/log plumbing tied to the log_domains machinery.</p></details><h3 id="libsonosutils-so-1" tabindex="-1"><code>libsonosutils.so.1</code> <a class="header-anchor" href="#libsonosutils-so-1" aria-label="Permalink to &quot;\`libsonosutils.so.1\`&quot;">​</a></h3><p>Sonos&#39;s general utility library: the shared toolbox of helpers used across the daemons, from containers to string handling.</p><p><a href="/anacapad-internals/files/lib/libsonosutils.so.1">Download</a> · 65.8 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsonosutils.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.8 KB (67388 bytes)</li><li><strong>SHA-256:</strong> <code>c8c1c75905f955c5d7c9759171a7f7e207930a18bb62f3e8c2444fb9fda622de</code></li></ul><p>Sonos-internal general-purpose library.</p></details><h3 id="libsqlite3-so-0" tabindex="-1"><code>libsqlite3.so.0</code> <a class="header-anchor" href="#libsqlite3-so-0" aria-label="Permalink to &quot;\`libsqlite3.so.0\`&quot;">​</a></h3><p>The embedded database library: a whole SQL database engine in one file, used for structured stores like the timer and alarm records.</p><p><a href="/anacapad-internals/files/lib/libsqlite3.so.0">Download</a> · 904.9 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsqlite3.so.0</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 904.9 KB (926600 bytes)</li><li><strong>SHA-256:</strong> <code>3a96ea0afd93227345d6d8e6155e13440eb0a4d2ae2968d215755a5cee73a795</code></li></ul><p>SQLite3; the embedded_sqlite entry documents its use (timer.db prepared statements and friends).</p></details><h3 id="libsyslib-hal-so-1" tabindex="-1"><code>libsyslib_hal.so.1</code> <a class="header-anchor" href="#libsyslib-hal-so-1" aria-label="Permalink to &quot;\`libsyslib_hal.so.1\`&quot;">​</a></h3><p>The hardware-abstraction library: gives programs a uniform way to talk to the board&#39;s LEDs, buttons, and sensors without caring about the exact chips.</p><p><a href="/anacapad-internals/files/lib/libsyslib_hal.so.1">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libsyslib_hal.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.4 KB (66972 bytes)</li><li><strong>SHA-256:</strong> <code>3f1fc46c69ee388ef4783910c9d5dc15e09997c7d3e609fd14762184017eb628</code></li></ul><p>Sonos hardware-abstraction library sitting above the kernel modules.</p></details><h3 id="libthread-db-so-1" tabindex="-1"><code>libthread_db.so.1</code> <a class="header-anchor" href="#libthread-db-so-1" aria-label="Permalink to &quot;\`libthread_db.so.1\`&quot;">​</a></h3><p>A debugger-support library: helps tools like gdb understand a program&#39;s threads. Harmless plumbing that ships with the toolchain.</p><p><a href="/anacapad-internals/files/lib/libthread_db.so.1">Download</a> · 66.1 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libthread_db.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 66.1 KB (67680 bytes)</li><li><strong>SHA-256:</strong> <code>e8be7d7c581e0d939c54812d6ddaf1be4c146303034b97b055b03209794f4840</code></li></ul><p>glibc thread-debug helper (gdb support).</p></details><h3 id="libtomlc99-so-1" tabindex="-1"><code>libtomlc99.so.1</code> <a class="header-anchor" href="#libtomlc99-so-1" aria-label="Permalink to &quot;\`libtomlc99.so.1\`&quot;">​</a></h3><p>The config-file parser library: reads the TOML format used by the logger configs and other modern config files in the image.</p><p><a href="/anacapad-internals/files/lib/libtomlc99.so.1">Download</a> · 65.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libtomlc99.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.5 KB (67052 bytes)</li><li><strong>SHA-256:</strong> <code>9e2650c723f9b70b9a05a495588ecf75b90ea1a263746201af9af49236d94223</code></li></ul><p>tomlc99 parser; backs the *_logger.toml files and limelight.toml-style configs (see toml_config).</p></details><h3 id="libutil-so-1" tabindex="-1"><code>libutil.so.1</code> <a class="header-anchor" href="#libutil-so-1" aria-label="Permalink to &quot;\`libutil.so.1\`&quot;">​</a></h3><p>A small utility library with terminal and process helpers from the C library family.</p><p><a href="/anacapad-internals/files/lib/libutil.so.1">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libutil.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.4 KB (67004 bytes)</li><li><strong>SHA-256:</strong> <code>9c933e83204eb337114efeed4e6beefa6869e9e9f7c19282492e3f6974e53fbf</code></li></ul><p>glibc libutil (pty/login helpers).</p></details><h3 id="libuuid-so-1" tabindex="-1"><code>libuuid.so.1</code> <a class="header-anchor" href="#libuuid-so-1" aria-label="Permalink to &quot;\`libuuid.so.1\`&quot;">​</a></h3><p>The unique-ID library: generates and parses the long identifier strings the system uses everywhere for devices, groups, and accounts.</p><p><a href="/anacapad-internals/files/lib/libuuid.so.1">Download</a> · 65.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libuuid.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.6 KB (67184 bytes)</li><li><strong>SHA-256:</strong> <code>a179176cfee5b04bd400183110013ec12372db62432a99d3127052fb6abdc8e7</code></li></ul><p>libuuid; produces the RINCON_-style UUIDs documented under rincon_uuid.</p></details><h3 id="libwifi-so-1" tabindex="-1"><code>libwifi.so.1</code> <a class="header-anchor" href="#libwifi-so-1" aria-label="Permalink to &quot;\`libwifi.so.1\`&quot;">​</a></h3><p>The wireless support library: a shared layer for controlling and querying the WiFi hardware, used by the network daemons.</p><p><a href="/anacapad-internals/files/lib/libwifi.so.1">Download</a> · 65.4 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libwifi.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.4 KB (66964 bytes)</li><li><strong>SHA-256:</strong> <code>911d6f28bd36442832a749e7a3c066939de53a2d8044cc9216d0668df9a506ef</code></li></ul><p>WiFi utility library for the Atheros stack (wifi_hal).</p></details><h3 id="libz-so-1" tabindex="-1"><code>libz.so.1</code> <a class="header-anchor" href="#libz-so-1" aria-label="Permalink to &quot;\`libz.so.1\`&quot;">​</a></h3><p>The compression library: the classic zlib, used anywhere data gets squeezed or unpacked, from saved files to network payloads.</p><p><a href="/anacapad-internals/files/lib/libz.so.1">Download</a> · 129.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/lib/libz.so.1</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 129.6 KB (132740 bytes)</li><li><strong>SHA-256:</strong> <code>510c0897069e9837bb3af133f2d95ec2e752773ea7c13e5d0fe8f45bb3250e04</code></li></ul><p>zlib; the iocompress queue/state compression wraps it.</p></details><h3 id="libcap-so-2" tabindex="-1"><code>libcap.so.2</code> <a class="header-anchor" href="#libcap-so-2" aria-label="Permalink to &quot;\`libcap.so.2\`&quot;">​</a></h3><p>The capabilities library: manages the fine-grained Linux privilege bits that let a program keep only the powers it needs instead of running fully as root.</p><p><a href="/anacapad-internals/files/usr/lib/libcap.so.2">Download</a> · 65.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/usr/lib/libcap.so.2</code></li><li><strong>Category:</strong> libs</li><li><strong>Size:</strong> 65.6 KB (67196 bytes)</li><li><strong>SHA-256:</strong> <code>b4b2bd747773e10fda5f2d0fa3f47b17a4bb46c6d5b42acba0c486332bd0b0ec</code></li></ul><p>libcap; supports the capability keep-set on the anacapad launch line.</p></details><h2 id="kernel-modules" tabindex="-1">Kernel modules <a class="header-anchor" href="#kernel-modules" aria-label="Permalink to &quot;Kernel modules&quot;">​</a></h2><p>Drivers that plug into the Linux kernel at boot: the audio hardware driver, the infrared receiver, the watchdog, and the WiFi chipset modules. They are the lowest software layer, sitting between the operating system and the physical chips.</p><details class="details custom-block"><summary>Technical details</summary><p>Loadable kernel objects under /modules and /wifi (Atheros driver family for the SonosNet-capable radio stack).</p></details><h3 id="audiodev-ko" tabindex="-1"><code>audiodev.ko</code> <a class="header-anchor" href="#audiodev-ko" aria-label="Permalink to &quot;\`audiodev.ko\`&quot;">​</a></h3><p>The audio device driver: the kernel module that exposes the sound hardware to the programs above, carrying the actual digital audio to the amplifiers.</p><p><a href="/anacapad-internals/files/modules/audiodev.ko">Download</a> · 142.9 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/modules/audiodev.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 142.9 KB (146328 bytes)</li><li><strong>SHA-256:</strong> <code>65bb803d74054376cad1f9305696ad0df921763981c3071fb10c70cfbf138ba4</code></li></ul><p>Core audio driver; the lla and tdm_driver entries document the interface layered on it.</p></details><h3 id="chk-ko" tabindex="-1"><code>chk.ko</code> <a class="header-anchor" href="#chk-ko" aria-label="Permalink to &quot;\`chk.ko\`&quot;">​</a></h3><p>The hardware-check module: a small kernel piece the system uses to verify board identity and hardware health.</p><p><a href="/anacapad-internals/files/modules/chk.ko">Download</a> · 4.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/modules/chk.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 4.6 KB (4736 bytes)</li><li><strong>SHA-256:</strong> <code>f099055a15c41e29074bd0855c3c0add5f30d23df2a5d7c14f172bc3df00978e</code></li></ul><p>Board-check module; its device node (/dev/chk) appears in the updater&#39;s sibling-binary inventory.</p></details><h3 id="hwevent-queue-ko" tabindex="-1"><code>hwevent_queue.ko</code> <a class="header-anchor" href="#hwevent-queue-ko" aria-label="Permalink to &quot;\`hwevent_queue.ko\`&quot;">​</a></h3><p>The hardware-event queue: delivers physical events like button presses and jack insertions from the kernel up to the programs that handle them.</p><p><a href="/anacapad-internals/files/modules/hwevent_queue.ko">Download</a> · 17.2 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/modules/hwevent_queue.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 17.2 KB (17596 bytes)</li><li><strong>SHA-256:</strong> <code>b569eb24c4d5591dd4874e2ca99b6c8109465eb442e7484c79cf08bfbe5eb2ea</code></li></ul><p>Kernel queue feeding hw_input_events / hwmessagelib, the layer that turns physical presses into internal messages.</p></details><h3 id="ir-rcvr-ko" tabindex="-1"><code>ir_rcvr.ko</code> <a class="header-anchor" href="#ir-rcvr-ko" aria-label="Permalink to &quot;\`ir_rcvr.ko\`&quot;">​</a></h3><p>The infrared receiver driver: the kernel piece that captures remote-control signals from the IR sensor on models that have one, like the Playbar.</p><p><a href="/anacapad-internals/files/modules/ir_rcvr.ko">Download</a> · 7.8 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/modules/ir_rcvr.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 7.8 KB (7948 bytes)</li><li><strong>SHA-256:</strong> <code>467aaf41cc857a0109c1b4d124a9031c291188f238fc1f93917118f21ccff715</code></li></ul><p>IR receiver driver feeding /opt/ir config and the ir_decoder/ir_learn machinery. Absent on models without an IR sensor (a documented m8-vs-m9 difference).</p></details><h3 id="sonos-device-ko" tabindex="-1"><code>sonos_device.ko</code> <a class="header-anchor" href="#sonos-device-ko" aria-label="Permalink to &quot;\`sonos_device.ko\`&quot;">​</a></h3><p>The Sonos board-support module: kernel glue for the custom hardware bits specific to the player.</p><p><a href="/anacapad-internals/files/modules/sonos_device.ko">Download</a> · 3.6 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/modules/sonos_device.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 3.6 KB (3640 bytes)</li><li><strong>SHA-256:</strong> <code>c5047d17c5bf529db12a3009b21c6f432d0fd51fb47f1949e83ba6bdacb2a571</code></li></ul><p>Board-support kernel module for the limelight platform.</p></details><h3 id="adf-ko" tabindex="-1"><code>adf.ko</code> <a class="header-anchor" href="#adf-ko" aria-label="Permalink to &quot;\`adf.ko\`&quot;">​</a></h3><p>A lower-level Atheros driver framework module the WiFi stack loads beneath the main radio driver.</p><p><a href="/anacapad-internals/files/wifi/N/adf.ko">Download</a> · 24.2 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/N/adf.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 24.2 KB (24776 bytes)</li><li><strong>SHA-256:</strong> <code>7a137d22cbc1cf94d2eabe2aa093867b11d8cddb75f14aa133c6fa5f23ea4705</code></li></ul><p>Atheros Driver Framework layer for the wifi/N radio build.</p></details><h3 id="asf-ko" tabindex="-1"><code>asf.ko</code> <a class="header-anchor" href="#asf-ko" aria-label="Permalink to &quot;\`asf.ko\`&quot;">​</a></h3><p>Another Atheros support layer in the WiFi stack, handling shared services the radio driver relies on.</p><p><a href="/anacapad-internals/files/wifi/N/asf.ko">Download</a> · 12.8 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/N/asf.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 12.8 KB (13124 bytes)</li><li><strong>SHA-256:</strong> <code>537acdbc2de81b9c75f3aed2849ad37ebaa3768c78a8671554ae4f1e0b734bf1</code></li></ul><p>Atheros Service Framework layer for the wifi/N radio build.</p></details><h3 id="ath-driver-ko" tabindex="-1"><code>ath_driver.ko</code> <a class="header-anchor" href="#ath-driver-ko" aria-label="Permalink to &quot;\`ath_driver.ko\`&quot;">​</a></h3><p>The main WiFi radio driver: the kernel module that actually talks to the Atheros wireless chip and does the work of joining networks and carrying traffic.</p><p><a href="/anacapad-internals/files/wifi/N/ath_driver.ko">Download</a> · 353.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/N/ath_driver.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 353.5 KB (362008 bytes)</li><li><strong>SHA-256:</strong> <code>13e8c2658306cb55464fc942fb01d9be49b9ec53f62518367812b36454e43778</code></li></ul><p>Primary ath driver for the Atheros-based radio in this generation of hardware.</p></details><h3 id="ath-hal-ko" tabindex="-1"><code>ath_hal.ko</code> <a class="header-anchor" href="#ath-hal-ko" aria-label="Permalink to &quot;\`ath_hal.ko\`&quot;">​</a></h3><p>The radio&#39;s hardware-abstraction module: the closed-off layer between the open driver and the actual radio silicon.</p><p><a href="/anacapad-internals/files/wifi/N/ath_hal.ko">Download</a> · 341.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/N/ath_hal.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 341.5 KB (349744 bytes)</li><li><strong>SHA-256:</strong> <code>bf6fa38237599dc0c7551eb8c8dd850874dc922b3db907f8bfaede36f8d9f3db</code></li></ul><p>Atheros HAL (hardware abstraction layer), the proprietary core of the driver stack.</p></details><h3 id="dfs-ko" tabindex="-1"><code>dfs.ko</code> <a class="header-anchor" href="#dfs-ko" aria-label="Permalink to &quot;\`dfs.ko\`&quot;">​</a></h3><p>The radar-detection module: watches for radar on restricted WiFi channels so the speaker can legally operate on them, part of the 5 GHz regulatory machinery.</p><p><a href="/anacapad-internals/files/wifi/N/dfs.ko">Download</a> · 56.7 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/N/dfs.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 56.7 KB (58024 bytes)</li><li><strong>SHA-256:</strong> <code>7721e59669177601410ee881d03d935ddc7b33edb6ece2c618bce130773debd1</code></li></ul><p>DFS (Dynamic Frequency Selection) module; pairs with the radartool utility.</p></details><h3 id="bridge-ko" tabindex="-1"><code>bridge.ko</code> <a class="header-anchor" href="#bridge-ko" aria-label="Permalink to &quot;\`bridge.ko\`&quot;">​</a></h3><p>The network-bridge module: lets the speaker bridge wired and wireless interfaces so SonosNet members can share a connection.</p><p><a href="/anacapad-internals/files/wifi/bridge.ko">Download</a> · 76.2 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/wifi/bridge.ko</code></li><li><strong>Category:</strong> modules</li><li><strong>Size:</strong> 76.2 KB (78056 bytes)</li><li><strong>SHA-256:</strong> <code>1f738329dd9016b52f1872a5fde659ca2291fca638253adc94024fb52215252a</code></li></ul><p>Kernel bridge support used by brctl in the SonosNet topology.</p></details><h2 id="diagnostics-web-pages" tabindex="-1">Diagnostics web pages <a class="header-anchor" href="#diagnostics-web-pages" aria-label="Permalink to &quot;Diagnostics web pages&quot;">​</a></h2><p>The raw ingredients of the speaker&#39;s hidden status website: JavaScript and HTML pages you can reach in a browser at the player&#39;s address. Sonos support and engineers use these pages to inspect a player; this is what the site actually is under the hood.</p><details class="details custom-block"><summary>Technical details</summary><p>Static assets served by the embedded web server from /opt/htdocs and the locked variant /opt/htdocs_locked (gated DSP console pages).</p></details><h3 id="perfcounters-js" tabindex="-1"><code>perfcounters.js</code> <a class="header-anchor" href="#perfcounters-js" aria-label="Permalink to &quot;\`perfcounters.js\`&quot;">​</a></h3><p>The JavaScript behind the performance-counters status page: it fetches the counter data from the speaker and draws it in your browser when you visit the diagnostics site.</p><p><a href="/anacapad-internals/files/opt/htdocs/perfcounters.js">View</a> · <a href="/anacapad-internals/files/opt/htdocs/perfcounters.js">Download</a> · 9.0 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 218 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/// Copyright (c) 2023, Sonos, Inc.  All rights reserved.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>let perfcounter = {</span></span>
<span class="line"><span>    // entry function which actually generates two top level elements:</span></span>
<span class="line"><span>    // a &lt;header&gt; for the title and miscellaneous metadata and a &lt;table&gt; for the actual data</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    generateTableForEach: function (id, counters) </span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //clear old</span></span>
<span class="line"><span>        let div = document.getElementById(id);</span></span>
<span class="line"><span>        div.innerHTML = &#39;&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        const captionText = document.createTextNode(&#39;Hover over each column header for a detailed description&#39;);</span></span>
<span class="line"><span>        div.appendChild(captionText);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        counters.forEach(counter =&gt; {</span></span>
<span class="line"><span>            this.generateTable(id, counter);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    generateTable: function (id, perfcounter) </span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        const div = document.getElementById(id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.generateTableMetadata(perfcounter, div);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        const table = document.createElement(&#39;table&#39;);</span></span>
<span class="line"><span>        table.classList.add(&quot;purple&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.generateTableHeader(table, perfcounter);</span></span>
<span class="line"><span>        this.generateTableBody(table, perfcounter);</span></span>
<span class="line"><span>        div.appendChild(table);</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // display the title and list metadata values (besides the counter metadata which is rendered as tooltips)</span></span>
<span class="line"><span>    generateTableMetadata: function (perfcounter, div)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        const header = document.createElement(&#39;header&#39;);</span></span>
<span class="line"><span>        const heading = document.createElement(&#39;h2&#39;);</span></span>
<span class="line"><span>        const headingText = document.createTextNode(perfcounter.table);</span></span>
<span class="line"><span>        heading.appendChild(headingText);</span></span>
<span class="line"><span>        header.appendChild(heading);</span></span>
<span class="line"><span>        div.appendChild(header);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // process the non-counters metadata</span></span>
<span class="line"><span>        const noncountersList = document.createElement(&#39;ul&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        const keys = Object.keys(perfcounter.metadata);</span></span>
<span class="line"><span>        for (const key of keys) {</span></span>
<span class="line"><span>            if (key != &#39;counters&#39;) {</span></span>
<span class="line"><span>                noncountersList.appendChild(this.createMetadataListItem(key, perfcounter.metadata[key]));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        div.appendChild(noncountersList);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!perfcounter.metadata.counters.length) {</span></span>
<span class="line"><span>            heading.textContent += &#39; contains no counters&#39;;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    },</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/perfcounters.js</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 9.0 KB (9230 bytes)</li><li><strong>SHA-256:</strong> <code>ac4fb0d72fa0a4dfffcd4921e0461cb14018ab929841d18028bc0c89b52efaff</code></li></ul><p>Client-side script for the perf-counter status page; pairs with the perf_counters schema documented on the subsystems page.</p></details><h3 id="review-js" tabindex="-1"><code>review.js</code> <a class="header-anchor" href="#review-js" aria-label="Permalink to &quot;\`review.js\`&quot;">​</a></h3><p>The script for a review-style page in the built-in web UI, working with the matching stylesheet file.</p><p><a href="/anacapad-internals/files/opt/htdocs/review.js">View</a> · <a href="/anacapad-internals/files/opt/htdocs/review.js">Download</a> · 15.5 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 448 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function trimAll( strValue ) {</span></span>
<span class="line"><span> var objRegExp = /^(\\s*)$/;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //check for all spaces</span></span>
<span class="line"><span>    if(objRegExp.test(strValue)) {</span></span>
<span class="line"><span>       strValue = strValue.replace(objRegExp, &#39;&#39;);</span></span>
<span class="line"><span>       if( strValue.length == 0)</span></span>
<span class="line"><span>          return strValue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   //check for leading &amp; trailing spaces</span></span>
<span class="line"><span>   objRegExp = /^(\\s*)([\\W\\w]*)(\\b\\s*$)/;</span></span>
<span class="line"><span>   if(objRegExp.test(strValue)) {</span></span>
<span class="line"><span>       //remove leading and trailing whitespace characters</span></span>
<span class="line"><span>       strValue = strValue.replace(objRegExp, &#39;$2&#39;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  return strValue;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var strengthData = new Array();</span></span>
<span class="line"><span>var macAddrs = new Array();</span></span>
<span class="line"><span>var macAddrsToZoneNames = new Array();</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>function finishDrawTable(tbodyID) {</span></span>
<span class="line"><span>    var th, tr, td, txt, br;</span></span>
<span class="line"><span>	var zp,nf,ofdm;</span></span>
<span class="line"><span>    tbody = document.getElementById(tbodyID);</span></span>
<span class="line"><span>    // create holder for accumulated tbody elements and text nodes</span></span>
<span class="line"><span>    var frag = document.createDocumentFragment();</span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span>    // Make column headings</span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span>    tr = document.createElement(&quot;tr&quot;);</span></span>
<span class="line"><span>    th = document.createElement(&quot;th&quot;); tr.appendChild(th);</span></span>
<span class="line"><span>    for (var i = 0; i &lt; macAddrs.length; i++) {</span></span>
<span class="line"><span>	if(macAddrs[i] != &quot;eth0&quot; &amp;&amp; macAddrs[i] != &quot;eth1&quot;)</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>        th = document.createElement(&quot;th&quot;);</span></span>
<span class="line"><span>	txt = document.createTextNode(&quot;Strength to&quot;); th.appendChild(txt);</span></span>
<span class="line"><span>	br = document.createElement(&quot;br&quot;); th.appendChild(br);</span></span>
<span class="line"><span>        txt = document.createTextNode(macAddrs[i]); th.appendChild(txt);</span></span>
<span class="line"><span>	br = document.createElement(&quot;br&quot;); th.appendChild(br);</span></span>
<span class="line"><span>        txt = document.createTextNode(macAddrsToZoneNames[macAddrs[i]]); th.appendChild(txt);</span></span>
<span class="line"><span>	tr.appendChild(th);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    frag.appendChild(tr);</span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span>    // loop through data source</span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span>    for (var i = 0; i &lt; strengthData.length; i++) {</span></span>
<span class="line"><span>        var sd = strengthData[i];</span></span>
<span class="line"><span>    	tr = document.createElement(&quot;tr&quot;);</span></span>
<span class="line"><span>    	</span></span>
<span class="line"><span>    	td = document.createElement(&quot;td&quot;);</span></span>
<span class="line"><span>    	td.setAttribute(&quot;class&quot;, &quot;ctr&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    	txt = document.createTextNode(sd.macAddr); td.appendChild(txt);</span></span>
<span class="line"><span>        br = document.createElement(&quot;br&quot;); td.appendChild(br);</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/review.js</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 15.5 KB (15822 bytes)</li><li><strong>SHA-256:</strong> <code>58300bba90ff52b053921a08e494df9d839bb747a08fbe701ecfbbf99ce6b710</code></li></ul><p>Companion to xml/review.xsl for the status site&#39;s review page.</p></details><h3 id="configdsp-css" tabindex="-1"><code>configDSP.css</code> <a class="header-anchor" href="#configdsp-css" aria-label="Permalink to &quot;\`configDSP.css\`&quot;">​</a></h3><p>The stylesheet for the DSP console page.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.css">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.css">Download</a> · 5.8 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 282 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>body {</span></span>
<span class="line"><span>	font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, Geneva, sans-serif;</span></span>
<span class="line"><span>	background-color: #ebf0f6;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>h1 {</span></span>
<span class="line"><span>	color: #4f555c;</span></span>
<span class="line"><span>	margin-left: 25px;</span></span>
<span class="line"><span>	font-weight: bold;</span></span>
<span class="line"><span>	font-size: 2.5em;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#message {</span></span>
<span class="line"><span>	font-size: 1em;</span></span>
<span class="line"><span>	margin: 0;</span></span>
<span class="line"><span>	padding: 5px 10px;</span></span>
<span class="line"><span>	background-color: #fcda78;</span></span>
<span class="line"><span>	border: 1px solid #d0b463;</span></span>
<span class="line"><span>	display: inline;</span></span>
<span class="line"><span>	line-height: 1.75em;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#cant_load_warning {</span></span>
<span class="line"><span>	font-size: 1.0em;</span></span>
<span class="line"><span>	color: #ececec;</span></span>
<span class="line"><span>	padding: 25px;</span></span>
<span class="line"><span>	background-color: #d3050a;</span></span>
<span class="line"><span>	font-weight: bold;</span></span>
<span class="line"><span>	text-align: center;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#cant_load_warning h2 {</span></span>
<span class="line"><span>	font-size: 1.5em;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#cant_load_warning a {</span></span>
<span class="line"><span>	color: #fdf73a;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ab_control {</span></span>
<span class="line"><span>    border: 1px solid black;</span></span>
<span class="line"><span>    background-color: #c8c8c8;</span></span>
<span class="line"><span>	padding: 4px 8px;</span></span>
<span class="line"><span>	position: fixed;</span></span>
<span class="line"><span>	right: 15px;</span></span>
<span class="line"><span>	top: 15px;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#ab_control:hover {</span></span>
<span class="line"><span>	background-color: #9c9c9c;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#ab_control:active {</span></span>
<span class="line"><span>	background-color: #898989;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#AB_indicator {</span></span>
<span class="line"><span>	font-size: 6em;</span></span>
<span class="line"><span>	font-weight: bold;</span></span>
<span class="line"><span>	text-align: center;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#import_export {</span></span>
<span class="line"><span>	position: fixed;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/configDSP.css</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 5.8 KB (5958 bytes)</li><li><strong>SHA-256:</strong> <code>e0f5761e73fd0e00e15400ca5a285b0303576457c1f5e35b67d9ded25cb51780</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h3 id="configdsp-htm" tabindex="-1"><code>configDSP.htm</code> <a class="header-anchor" href="#configdsp-htm" aria-label="Permalink to &quot;\`configDSP.htm\`&quot;">​</a></h3><p>The HTML shell of the hidden DSP console: a gated page in the diagnostics site that exposes the audio-processing knobs, meant for engineering rather than daily use.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.htm">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.htm">Download</a> · 1.7 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 46 of 46 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;html&gt;</span></span>
<span class="line"><span>&lt;head&gt;</span></span>
<span class="line"><span>  &lt;title&gt;Config DSP&lt;/title&gt;</span></span>
<span class="line"><span>  &lt;script type=&quot;text/javascript&quot; src=&quot;configDSP.js&quot;&gt;&lt;/script&gt;</span></span>
<span class="line"><span>  &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;configDSP.css&quot; /&gt;</span></span>
<span class="line"><span>&lt;/head&gt;</span></span>
<span class="line"><span>&lt;body onload=&quot; onPageLoad();&quot;&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;export_overlay&quot; onclick=&quot;exportOverlayOff()&quot;&gt;</span></span>
<span class="line"><span>    &lt;div id=&quot;export_table_div&quot; style=&quot;padding:20px&quot;&gt;Exported Blocks:&lt;br&gt;</span></span>
<span class="line"><span>      &lt;table id=&quot;export_table&quot;&gt;</span></span>
<span class="line"><span>      &lt;/table&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;ab_control&quot; onclick=&quot;toggleAB();&quot;&gt;</span></span>
<span class="line"><span>    &lt;div id=&quot;toggle_button&quot;&gt;Toggle A/B&lt;/div&gt;</span></span>
<span class="line"><span>    &lt;div id=&quot;AB_indicator&quot;&gt; &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;import_export&quot;&gt;</span></span>
<span class="line"><span>    &lt;span id=&quot;import_export_title&quot; onclick=&quot;toggleImportExport();&quot;&gt;Import/Export&lt;/span&gt;</span></span>
<span class="line"><span>    &lt;div id=&quot;import_export_body&quot; style=&quot;display:none;&quot;&gt;</span></span>
<span class="line"><span>      &lt;div class=&quot;section&quot;&gt;</span></span>
<span class="line"><span>        &lt;div style=&quot;width: 50%; float:center&quot;&gt;</span></span>
<span class="line"><span>          &lt;button class=&quot;button&quot; onclick=&quot;onExport();&quot; &gt;Export&lt;/button&gt;</span></span>
<span class="line"><span>        &lt;/div&gt;</span></span>
<span class="line"><span>        &lt;div style=&quot;width: 50%; float:center; padding-top: 10px;&quot;&gt;</span></span>
<span class="line"><span>          &lt;button class=&quot;button&quot; onclick=&quot;onExportSelectedBlocks();&quot;&gt;Export Selected Blocks</span></span>
<span class="line"><span>          &lt;/button&gt;</span></span>
<span class="line"><span>        &lt;/div&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>      &lt;div class=&quot;section&quot;&gt;</span></span>
<span class="line"><span>        Import Presets:</span></span>
<span class="line"><span>        &lt;input type=&quot;file&quot; id=&quot;fileInput&quot;/&gt;</span></span>
<span class="line"><span>        &lt;div id=&quot;import_form&quot; style=&quot;display:none;&quot;&gt;</span></span>
<span class="line"><span>        &lt;/div&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;h1&gt;DSP System (Version: 0.25.3)&lt;/h1&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;cant_load_warning&quot;&gt;&lt;h2&gt;There was an error loading the page.&lt;/h2&gt;&lt;p&gt;Make sure you are using &lt;a href=&quot;http://getfirefox.com&quot;&gt;Firefox 3&lt;/a&gt;, and that you have JavaScript enabled.&lt;/p&gt;&lt;/div&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;message&quot; style=&quot;visibility:hidden;&quot;&gt;&amp;nbsp;&lt;/div&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;!-- These are build dynamically by the script --&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;tabBar&quot;&gt;&lt;/div&gt;</span></span>
<span class="line"><span>  &lt;form id=&quot;dynForm&quot;&gt;&lt;/form&gt;</span></span>
<span class="line"><span>&lt;/body&gt;</span></span>
<span class="line"><span>&lt;/html&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/configDSP.htm</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 1.7 KB (1699 bytes)</li><li><strong>SHA-256:</strong> <code>c0c1ab3d462adeb5847244c9f353d338d1d8345898d5bc2cb9cbdbba8fec5af6</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h3 id="configdsp-js" tabindex="-1"><code>configDSP.js</code> <a class="header-anchor" href="#configdsp-js" aria-label="Permalink to &quot;\`configDSP.js\`&quot;">​</a></h3><p>The JavaScript driving the DSP console page: it reads and writes the audio-processing parameters behind the gated interface.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.js">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.js">Download</a> · 94.2 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 1650 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//7/6/13 : update to load getDSP on page load</span></span>
<span class="line"><span>//7/9/13: cleanup dead code</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//TODO: set up POLLING</span></span>
<span class="line"><span>//TODO: validateForm()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//------------------------------------------------------------------------------</span></span>
<span class="line"><span>// global data object - holds all the preset data locally</span></span>
<span class="line"><span>var gMainData;</span></span>
<span class="line"><span>var gMaxNumPresets = 20;</span></span>
<span class="line"><span>var gTextFieldWidth = 12;</span></span>
<span class="line"><span>var gXmlDoc;</span></span>
<span class="line"><span>var gCurrentlyWorking;</span></span>
<span class="line"><span>var gCurrentlyWorkingMessage = &#39;Still working... please wait a moment and try again.&#39;</span></span>
<span class="line"><span>var messageBox;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// A-B Toggling Stuff</span></span>
<span class="line"><span>var ABinfo = [</span></span>
<span class="line"><span>    { name: &quot;A&quot;, preset: -1, bgcolor: &quot;#AE6662&quot;, active: true},</span></span>
<span class="line"><span>    { name: &quot;B&quot;, preset: -1, bgcolor: &quot;#6FA0FF&quot;, active: false},</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Form buttons, so their ids can be changed but we can still get to them</span></span>
<span class="line"><span>var gButtons = new Array();</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>var gIIRFilterOptions = new Array( {option:&quot;highpass2&quot;,         valueType:[&quot;Freq&quot;,&quot;Q&quot;],        defaultValues:[&quot;999&quot;,&quot;0.707&quot;] },</span></span>
<span class="line"><span>                                   {option:&quot;highpass1&quot;,         valueType:[&quot;Freq&quot;],            defaultValues:[&quot;999&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;lowpass2&quot;,          valueType:[&quot;Freq&quot;,&quot;Q&quot;],        defaultValues:[&quot;999&quot;,&quot;0.707&quot;] },</span></span>
<span class="line"><span>                                   {option:&quot;lowpass1&quot;,          valueType:[&quot;Freq&quot;],            defaultValues:[&quot;999&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;shelving bandpass&quot;, valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;rbj shelving bandpass&quot;, valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;lfshelf&quot;,           valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;hfshelf&quot;,           valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;rbj lfshelf&quot;,       valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;rbj hfshelf&quot;,       valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;bandpassQ&quot;,         valueType:[&quot;Freq&quot;,&quot;Q&quot;],        defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;allpass&quot;,           valueType:[&quot;Freq&quot;,&quot;Q&quot;],        defaultValues:[&quot;999&quot;,&quot;0.707&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;allpass1&quot;,          valueType:[&quot;Freq&quot;],            defaultValues:[&quot;999&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;gain&quot;,              valueType:[&quot;gain linear&quot;],     defaultValues:[&quot;1.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;bass1&quot;,             valueType:[&quot;gain dB&quot;],         defaultValues:[&quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;treble1&quot;,           valueType:[&quot;gain dB&quot;],         defaultValues:[&quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;blank&quot;,             valueType:[],                  defaultValues:[]},</span></span>
<span class="line"><span>                                   {option:&quot;mute&quot;,              valueType:[],                  defaultValues:[]},</span></span>
<span class="line"><span>                                   {option:&quot;loudness&quot;,          valueType:[&quot;FreqLF&quot;,&quot;gainLF&quot;,&quot;FreqHF&quot;,&quot;gainHF&quot;], defaultValues:[&quot;999&quot;,&quot;0.0&quot;, &quot;999&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;custom&quot;,            valueType:[&quot;b0&quot;,&quot;b1&quot;,&quot;b2&quot;,&quot;a1&quot;,&quot;a2&quot;],    defaultValues:[&quot;3f800000&quot;,&quot;bfe66666&quot;,&quot;3f4f5c29&quot;,&quot;bfe66666&quot;,&quot;3f4f5c29&quot;]} );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var modeOptions = [ &quot;Off&quot;, &quot;Mute&quot;, &quot;Bypass&quot;, &quot;Active&quot;];</span></span>
<span class="line"><span>var controlModeOptions = [ &quot;Off&quot;, &quot;Active&quot;];</span></span>
<span class="line"><span>var debugOptions = [&quot;Off&quot;, &quot;On&quot;];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function onPageLoad ()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // Require Firefox 3.0 or Safari; i.e. exclude MS Internet Explorer. WHY?</span></span>
<span class="line"><span>    var browser=navigator.appName;</span></span>
<span class="line"><span>    var version=parseFloat(navigator.appVersion);</span></span>
<span class="line"><span>    if ((browser === &quot;Netscape&quot;) &amp;&amp; (version &gt;= 5)) {</span></span>
<span class="line"><span>        document.getElementById(&quot;cant_load_warning&quot;).style.display = &quot;none&quot;;</span></span>
<span class="line"><span>        configDSP();</span></span>
<span class="line"><span>    }</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/configDSP.js</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 94.2 KB (96410 bytes)</li><li><strong>SHA-256:</strong> <code>f5218ecb1c633c9634d4b25014a10a99f66c2773fa56b9f4ea6ec5d9912f1bb2</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h3 id="meters-css" tabindex="-1"><code>meters.css</code> <a class="header-anchor" href="#meters-css" aria-label="Permalink to &quot;\`meters.css\`&quot;">​</a></h3><p>The stylesheet for the meters page.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.css">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.css">Download</a> · 240 B</p><details class="details custom-block"><summary>Preview</summary><p>First 15 of 15 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span>    Document   : meters.css</span></span>
<span class="line"><span>    Created on : Feb 24, 2013, 6:27:30 PM</span></span>
<span class="line"><span>    Author     : Simon.Jarvis</span></span>
<span class="line"><span>    Description:</span></span>
<span class="line"><span>        Purpose of the stylesheet follows.</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>root { </span></span>
<span class="line"><span>    display: block;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>meter {</span></span>
<span class="line"><span>  width: 150px;</span></span>
<span class="line"><span>  height: 15px;</span></span>
<span class="line"><span>}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/meters.css</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 240 B (240 bytes)</li><li><strong>SHA-256:</strong> <code>160125d1a65cb0d7242daef7195264d29e6b32d7929952ce4e9d937c44bd4c20</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h3 id="meters-htm" tabindex="-1"><code>meters.htm</code> <a class="header-anchor" href="#meters-htm" aria-label="Permalink to &quot;\`meters.htm\`&quot;">​</a></h3><p>The HTML shell of the input-level meters page: shows live signal levels per channel, used for audio debugging.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.htm">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.htm">Download</a> · 587 B</p><details class="details custom-block"><summary>Preview</summary><p>First 16 of 16 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;html&gt;</span></span>
<span class="line"><span>&lt;head&gt;</span></span>
<span class="line"><span>  &lt;title&gt;Meters Test Page&lt;/title&gt;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  &lt;script type=&quot;text/javascript&quot; src=&quot;meters.js&quot;&gt;&lt;/script&gt;</span></span>
<span class="line"><span>  &lt;link rel=&quot;stylesheet&quot; href=&quot;meters.css&quot; type=&quot;text/css&quot; /&gt; </span></span>
<span class="line"><span>&lt;/head&gt;</span></span>
<span class="line"><span>&lt;body onload=&quot; onPageLoad();&quot;&gt;</span></span>
<span class="line"><span>  &lt;h1&gt;Meters Page&lt;/h1&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;cant_load_warning&quot;&gt;&lt;h2&gt;There was an error loading the page.&lt;/h2&gt;&lt;p&gt;Make sure you are using &lt;a href=&quot;http://getfirefox.com&quot;&gt;Firefox 3&lt;/a&gt;, and that you have JavaScript enabled.&lt;/p&gt;&lt;/div&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;message&quot; style=&quot;visibility:hidden;&quot;&gt;&amp;nbsp;&lt;/div&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;!-- script dynamically builds for dynForm --&gt;</span></span>
<span class="line"><span>  &lt;form id=&quot;dynForm&quot;&gt;&lt;/form&gt;</span></span>
<span class="line"><span>&lt;/body&gt;</span></span>
<span class="line"><span>&lt;/html&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/meters.htm</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 587 B (587 bytes)</li><li><strong>SHA-256:</strong> <code>aad190d5fd301239fe1cd4f014e177f8c5fb13b0d56b7c44a6c56fe0bc2797e0</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h3 id="meters-js" tabindex="-1"><code>meters.js</code> <a class="header-anchor" href="#meters-js" aria-label="Permalink to &quot;\`meters.js\`&quot;">​</a></h3><p>The JavaScript that polls the meter data and draws the live channel levels on the meters page.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.js">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.js">Download</a> · 12.2 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 402 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//TODO: set up POLLING</span></span>
<span class="line"><span>//TODO: convert JSON to XML and submit to ZP</span></span>
<span class="line"><span></span></span>
<span class="line"><span>gTextFieldWidth = 6;</span></span>
<span class="line"><span>gMeterWidth = 6;</span></span>
<span class="line"><span>var gMeterIds;</span></span>
<span class="line"><span>var gMeterValues;</span></span>
<span class="line"><span>var gMeterMins;</span></span>
<span class="line"><span>var gMeterMaxs;</span></span>
<span class="line"><span>var gStrMeterBlock;</span></span>
<span class="line"><span>var gIsDebugMeter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var gFilterTypes = [&quot;highpass&quot;,</span></span>
<span class="line"><span>                    &quot;1st Order HP&quot;,</span></span>
<span class="line"><span>                    &quot;lowpass&quot;,</span></span>
<span class="line"><span>                    &quot;1st Order LP&quot;,</span></span>
<span class="line"><span>                    &quot;Shelfing Bandpass&quot;,</span></span>
<span class="line"><span>                    &quot;Lowpass Shelf&quot;,</span></span>
<span class="line"><span>                    &quot;Highpass Shelf&quot;,</span></span>
<span class="line"><span>                    &quot;Bandpass with Q&quot;,</span></span>
<span class="line"><span>                    &quot;allpass&quot;,</span></span>
<span class="line"><span>                    &quot;ZP120 HP Cross&quot;,</span></span>
<span class="line"><span>                    &quot;ZP120 LP Cross&quot;,</span></span>
<span class="line"><span>                    &quot;Bass1&quot;,</span></span>
<span class="line"><span>                    &quot;Treble1&quot;,</span></span>
<span class="line"><span>                    &quot;blank&quot;,</span></span>
<span class="line"><span>                    &quot;Mute&quot;,</span></span>
<span class="line"><span>                    &quot;loudness&quot;,</span></span>
<span class="line"><span>                    &quot;bandpass&quot;,</span></span>
<span class="line"><span>                    &quot;Custom&quot; ];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function onPageLoad ()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // Require Firefox 3.0 or Safari; i.e. exclude MS Internet Explorer. WHY?</span></span>
<span class="line"><span>    var browser=navigator.appName;</span></span>
<span class="line"><span>    var version=parseFloat(navigator.appVersion);</span></span>
<span class="line"><span>    if ((browser === &quot;Netscape&quot;) &amp;&amp; (version &gt;= 5)) {</span></span>
<span class="line"><span>        document.getElementById(&quot;cant_load_warning&quot;).style.display = &quot;none&quot;;</span></span>
<span class="line"><span>        configDSP();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//------------------------------------------------------------------------------</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function onDropdownUpdate(elem)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span>    //clear out the old meters</span></span>
<span class="line"><span>    //get a new meter values</span></span>
<span class="line"><span>    //add them to this page/form</span></span>
<span class="line"><span>    //then kick off the polling</span></span>
<span class="line"><span>    removeMetersFromTable(&quot;&quot;);</span></span>
<span class="line"><span>    gStrMeterBlock = this.value;</span></span>
<span class="line"><span>    if gIsDebugMeter[this.selectedIndex] {</span></span>
<span class="line"><span>        getDebugMeters(gStrMeterBlock);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        getMeters(gStrMeterBlock);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    addToForm(createMeterTable());</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/meters.js</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 12.2 KB (12471 bytes)</li><li><strong>SHA-256:</strong> <code>1bf1c14a27e27e9b08ae6b3206a6d266ba8a93515540a9c4c525cef4b8bd914b</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h2 id="firmware-package-pieces" tabindex="-1">Firmware package pieces <a class="header-anchor" href="#firmware-package-pieces" aria-label="Permalink to &quot;Firmware package pieces&quot;">​</a></h2><p>The parts of the actual update file Sonos ships: the kernel image, the compressed filesystem that contains everything else on this page, the installer script, and the factory data block written per-device. Together these are what a firmware update physically delivers to the speaker.</p><details class="details custom-block"><summary>Technical details</summary><p>Sections extracted from the signed .upd update package: uImage kernel, squashfs rootfs, preinstall script, and the per-device NCD payload template.</p></details><h3 id="_86-10-80260-1-9-device-payload-bin" tabindex="-1"><code>86.10-80260-1-9-device-payload.bin</code> <a class="header-anchor" href="#_86-10-80260-1-9-device-payload-bin" aria-label="Permalink to &quot;\`86.10-80260-1-9-device-payload.bin\`&quot;">​</a></h3><p>The factory data template: a small binary block carrying the per-unit identity slots (serial, MAC, calibration) that get filled in when the device is manufactured. Amusingly, its embedded template still carries a 2012-era factory timestamp from the original Playbar.</p><p><a href="/anacapad-internals/files/package/86.10-80260-1-9-device-payload.bin">Download</a> · 53.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/package/86.10-80260-1-9-device-payload.bin</code></li><li><strong>Category:</strong> package</li><li><strong>Size:</strong> 53.5 KB (54757 bytes)</li><li><strong>SHA-256:</strong> <code>36b47a4c7ef9e974ccfa82efda203754f0316ddc38b836e66b050e71074ae7cc</code></li></ul><p>Section-13 payload from the .upd, about 55 KB. Its tagged-record layout (board ID &#39;3s50avq100&#39;, the &#39;2012/06/14&#39; template date, empty serial/MAC slots) is fully decoded on the firmware-differences page; mdputil -B initializes it.</p></details><h3 id="_86-10-80260-1-9-kernel-uimage" tabindex="-1"><code>86.10-80260-1-9-kernel.uImage</code> <a class="header-anchor" href="#_86-10-80260-1-9-kernel-uimage" aria-label="Permalink to &quot;\`86.10-80260-1-9-kernel.uImage\`&quot;">​</a></h3><p>The Linux kernel image for this firmware: the actual operating-system core the speaker boots. Everything else on this page runs on top of it.</p><p><a href="/anacapad-internals/files/package/86.10-80260-1-9-kernel.uImage">Download</a> · 1.7 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/package/86.10-80260-1-9-kernel.uImage</code></li><li><strong>Category:</strong> package</li><li><strong>Size:</strong> 1.7 MB (1792719 bytes)</li><li><strong>SHA-256:</strong> <code>f74b36a9a6ae5efe2fe0c1ea1daf05ed5e30212bfe48a30b2c4ea7af2da4ae34</code></li></ul><p>uImage-wrapped ARM kernel from the update package, about 1.8 MB. The modules/ and wifi/ kernel objects above load into this kernel at boot.</p></details><h3 id="_86-10-80260-1-9-preinstall-sh" tabindex="-1"><code>86.10-80260-1-9-preinstall.sh</code> <a class="header-anchor" href="#_86-10-80260-1-9-preinstall-sh" aria-label="Permalink to &quot;\`86.10-80260-1-9-preinstall.sh\`&quot;">​</a></h3><p>The installer script inside the update package: the small program that runs on the device when a firmware update lands, preparing the new image for installation.</p><p><a href="/anacapad-internals/files/package/86.10-80260-1-9-preinstall.sh">View</a> · <a href="/anacapad-internals/files/package/86.10-80260-1-9-preinstall.sh">Download</a> · 1.6 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 58 of 58 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span>kill_attempt () {</span></span>
<span class="line"><span>    echo &quot;Killing $1&quot;</span></span>
<span class="line"><span>    kill \`ps | grep $1 | grep -v grep | cut -c 1-5\`</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if [ &quot;$1&quot; = &quot;umountnone&quot; ]; then</span></span>
<span class="line"><span>    REGION=$(/bin/mdputil | /usr/sbin/keyval ^REGION)</span></span>
<span class="line"><span>    if [ &quot;$REGION&quot; = &quot;5&quot; ]; then</span></span>
<span class="line"><span>        echo &quot;Setting REGION=2&quot;</span></span>
<span class="line"><span>        /bin/mdputil -fwe 2</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>if [ &quot;$1&quot; = &quot;postinst&quot; ]; then</span></span>
<span class="line"><span>    echo &quot;Doing post-install steps...&quot;</span></span>
<span class="line"><span>    rm -f /jffs/upgrade_prev.log</span></span>
<span class="line"><span>    if [ -e /jffs/upgrade.log ]; then</span></span>
<span class="line"><span>	cp /jffs/upgrade.log /jffs/upgrade_prev.log</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    if [ -e /tmp/upgrade.log ]; then</span></span>
<span class="line"><span>        cp /tmp/upgrade.log /jffs/.</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        echo &quot;Manual upgrade. No log to copy.&quot; &gt; /jffs/upgrade.log</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    if [ ! -e /jffs/upgrade_sys_report.log ]; then</span></span>
<span class="line"><span>        touch /jffs/upgrade_sys_report.log</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    sync</span></span>
<span class="line"><span>    sync</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>echo &quot;Checking space on jffs&quot;</span></span>
<span class="line"><span>jffsusage=$(df -h | grep &#39;98%\\|99%\\|100% /jffs&#39;)</span></span>
<span class="line"><span>if [ &quot;$jffsusage&quot; ]; then</span></span>
<span class="line"><span>    echo &quot;WARNING: /jffs usage near or at capacity. Upgrade might fail as a result.&quot;</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    echo &quot;Enough /jffs space to continue upgrade.&quot;</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>if [ -d /dev/mtd ]; then</span></span>
<span class="line"><span>    if [ -f /var/run/upgradeflag ]; then</span></span>
<span class="line"><span>        echo &quot;Proceeding with upgrade...&quot;</span></span>
<span class="line"><span>        exit 0</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    echo -n &quot;Checking to see if anacapad is running...&quot;</span></span>
<span class="line"><span>    ps | grep -v grep | grep anacapad &gt; /dev/null</span></span>
<span class="line"><span>    if [ $? = 0 ]; then</span></span>
<span class="line"><span>        echo &quot;Anacapa is running - please stop it and run upgrade again.&quot;</span></span>
<span class="line"><span>        exit 1</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    echo &quot;Stopping ancillary processes...&quot;</span></span>
<span class="line"><span>    kill_attempt udhcpc</span></span>
<span class="line"><span>    kill_attempt inetd</span></span>
<span class="line"><span>    touch /var/run/stopnetstartd</span></span>
<span class="line"><span>    kill_attempt netstartd</span></span>
<span class="line"><span>    sleep 2</span></span>
<span class="line"><span>    touch /var/run/upgradeflag</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/package/86.10-80260-1-9-preinstall.sh</code></li><li><strong>Category:</strong> package</li><li><strong>Size:</strong> 1.6 KB (1599 bytes)</li><li><strong>SHA-256:</strong> <code>feddb7ad14034b06c316ccbed244a11925093a882a9d7bd81ea64a61364cbe70</code></li></ul><p>Pre-install script from the .upd; runs ahead of the squashfs/rootfs swap during upgrade.</p></details><h3 id="_86-10-80260-1-9-rootfs-squashfs" tabindex="-1"><code>86.10-80260-1-9-rootfs.squashfs</code> <a class="header-anchor" href="#_86-10-80260-1-9-rootfs-squashfs" aria-label="Permalink to &quot;\`86.10-80260-1-9-rootfs.squashfs\`&quot;">​</a></h3><p>The compressed filesystem image: the single block that contains the entire root filesystem, all the files on this page included. This is what the device actually writes during an update.</p><p><a href="/anacapad-internals/files/package/86.10-80260-1-9-rootfs.squashfs">Download</a> · 13.3 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/package/86.10-80260-1-9-rootfs.squashfs</code></li><li><strong>Category:</strong> package</li><li><strong>Size:</strong> 13.3 MB (13918208 bytes)</li><li><strong>SHA-256:</strong> <code>c8deece292bf7025be0533ca4c238e582d2890872ce4681a8ade7666dbbb81d6</code></li></ul><p>Squashfs image (~14 MB) extracted from the .upd; the rootfs-86.10-80260-1-9 directory on this site was unpacked from this file.</p></details><h3 id="_86-10-80260-1-9-upd" tabindex="-1"><code>86.10-80260-1-9.upd</code> <a class="header-anchor" href="#_86-10-80260-1-9-upd" aria-label="Permalink to &quot;\`86.10-80260-1-9.upd\`&quot;">​</a></h3><p>The complete update package itself: the signed bundle Sonos&#39;s servers deliver when this model updates, containing the kernel, the filesystem, and the installer all in one signed file.</p><p><a href="/anacapad-internals/files/package/86.10-80260-1-9.upd">Download</a> · 15.2 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/package/86.10-80260-1-9.upd</code></li><li><strong>Category:</strong> package</li><li><strong>Size:</strong> 15.2 MB (15919011 bytes)</li><li><strong>SHA-256:</strong> <code>6c82af3a66596cac485e30b8b8f2f89f7039f211a379686d011786173db447de</code></li></ul><p>The signed .upd for build 86.10-80260-1-9 (~16 MB). Everything under the other categories on this page ultimately comes from inside this file.</p></details><h2 id="referenced-but-not-shipped-on-this-model" tabindex="-1">Referenced but not shipped on this model <a class="header-anchor" href="#referenced-but-not-shipped-on-this-model" aria-label="Permalink to &quot;Referenced but not shipped on this model&quot;">​</a></h2><p>Files the software knows about and can use, but which are not present in this model&#39;s firmware image. Some are downloaded on demand when a feature runs (like calibration tones), some belong to other models, and some are created at runtime rather than shipped. Documented here because the code references them by name.</p><details class="details custom-block"><summary>Technical details</summary><p>Path and filename literals recovered from the binary that resolve to CDN downloads, other-model firmware trees, or runtime-created state rather than files in this squashfs.</p></details><h3 id="complete-ogg" tabindex="-1"><code>complete.ogg</code> <a class="header-anchor" href="#complete-ogg" aria-label="Permalink to &quot;\`complete.ogg\`&quot;">​</a></h3><p>The &#39;finished&#39; jingle played at the end of a calibration pass so you know the measurement succeeded. Named in the binary, fetched on demand.</p><p><em>Not shipped in this build; documented because other firmware versions and binary string evidence reference it.</em></p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/buzzers/complete.ogg</code></li><li><strong>Category:</strong> referenced</li></ul><p>x-rincon-configmode:sonar-calibrate-complete / sonarcal complete.ogg family.</p></details><h3 id="complete-ht-ogg" tabindex="-1"><code>complete_ht.ogg</code> <a class="header-anchor" href="#complete-ht-ogg" aria-label="Permalink to &quot;\`complete_ht.ogg\`&quot;">​</a></h3><p>The completion tone for home-theater calibration specifically, the variant used when tuning a soundbar rig with satellites.</p><p><em>Not shipped in this build; documented because other firmware versions and binary string evidence reference it.</em></p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/buzzers/complete_ht.ogg</code></li><li><strong>Category:</strong> referenced</li></ul><p>x-rincon-sonarcal:complete_ht.ogg; home-theater variant of the calibration-complete asset.</p></details><h3 id="leader-ogg" tabindex="-1"><code>leader.ogg</code> <a class="header-anchor" href="#leader-ogg" aria-label="Permalink to &quot;\`leader.ogg\`&quot;">​</a></h3><p>The tone a group leader plays during the older Sonar room-calibration flow. The firmware references it by name, but it is not stored in this model&#39;s image; it is fetched when calibration runs.</p><p><em>Not shipped in this build; documented because other firmware versions and binary string evidence reference it.</em></p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/buzzers/leader.ogg</code></li><li><strong>Category:</strong> referenced</li></ul><p>Referenced by the x-rincon-sonarcal:leader.ogg URI and the trueplay/sonarcal tone-download machinery; delivered on demand via the ETag-cached tone download path rather than shipped in /opt/buzzers.</p></details><h3 id="testtone-ogg" tabindex="-1"><code>testtone.ogg</code> <a class="header-anchor" href="#testtone-ogg" aria-label="Permalink to &quot;\`testtone.ogg\`&quot;">​</a></h3><p>The measurement tone used while calibrating a speaker&#39;s sound for the room. Referenced by name in the calibration code but downloaded only when a tuning session actually runs.</p><p><em>Not shipped in this build; documented because other firmware versions and binary string evidence reference it.</em></p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/buzzers/testtone.ogg</code></li><li><strong>Category:</strong> referenced</li></ul><p>x-rincon-sonarcal:testtone.ogg; pulled through the tone_download machinery (etags.txt cache) at calibration time.</p></details><h3 id="trueroom-tone-ogg" tabindex="-1"><code>trueroom_tone.ogg</code> <a class="header-anchor" href="#trueroom-tone-ogg" aria-label="Permalink to &quot;\`trueroom_tone.ogg\`&quot;">​</a></h3><p>The tone for the trueroom tuning pass, a second-generation room measurement the firmware supports but does not ship as a file.</p><p><em>Not shipped in this build; documented because other firmware versions and binary string evidence reference it.</em></p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/buzzers/trueroom_tone.ogg</code></li><li><strong>Category:</strong> referenced</li></ul><p>x-rincon-sonarcal:trueroom family; downloaded per-session like the other sonarcal assets.</p></details><h3 id="level-mp3" tabindex="-1"><code>level.mp3</code> <a class="header-anchor" href="#level-mp3" aria-label="Permalink to &quot;\`level.mp3\`&quot;">​</a></h3><p>A test tone that the smaller Play:1 model ships for audio level checks. On the Playbar build this file does not exist; the same menu of sounds is implemented but this asset was left out of this model.</p><p><em>Not shipped in this build; documented because other firmware versions and binary string evidence reference it.</em></p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/audio/level.mp3</code></li><li><strong>Category:</strong> referenced</li></ul><p>271 KB in the m8/fenway rootfs (documented in the firmware-differences page); absent from the m9 image.</p></details>`,931)])])}const h=s(p,[["render",o]]);export{m as __pageData,h as default};
