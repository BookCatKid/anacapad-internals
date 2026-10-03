# Artifacts: Audio files

Sounds the speaker itself can play on demand: button chimes, setup prompts, and calibration tones. None of these are music files; they are short built-in sounds the firmware keeps on board so it can answer instantly without downloading anything.

::: details Technical details

Playback is triggered through x-rincon-buzzer:, x-rincon-configmode: and x-rincon-sonarcal: URIs resolved against /opt/buzzers and (for downloaded tones) an ETag-managed cache.

:::

### `0.mp3`

The loudest of the four numbered button chimes. The player plays this through its own speaker when a physical button press needs a clear audible confirmation, such as the final step of a setup or pairing gesture.

::: audio /files/opt/buzzers/0.mp3
:::

[Download](/files/opt/buzzers/0.mp3) · 85.9 KB

::: details Technical details

- **Path in image:** `/opt/buzzers/0.mp3`
- **Category:** audio
- **Size:** 85.9 KB (87989 bytes)
- **SHA-256:** `9448835023747a67c6a060bc168b32fa11c9bb4018727a27d10e9961da3dc250`

Buzzer asset index 0, about 88 KB. Resolved by the x-rincon-buzzer:0 URI family and played through the mixer on the alert path rather than the music pipeline.


:::

### `1.mp3`

A quieter numbered chime used for softer confirmations. It sits alongside the other numbered buzzers as part of the small vocabulary of sounds the player can make without involving a music service.

::: audio /files/opt/buzzers/1.mp3
:::

[Download](/files/opt/buzzers/1.mp3) · 40.3 KB

::: details Technical details

- **Path in image:** `/opt/buzzers/1.mp3`
- **Category:** audio
- **Size:** 40.3 KB (41288 bytes)
- **SHA-256:** `e9ccea41f9c98e27b355fe68034dbf77274f3df004cfef18f9ead1817c33a28d`

Buzzer asset index 1, about 41 KB. Same alert-path playback as 0.mp3; the four numbered files form the graded confirmation set.


:::

### `100.mp3`

Another of the numbered confirmation sounds, used for a different stage or type of action than the low-numbered chimes.

::: audio /files/opt/buzzers/100.mp3
:::

[Download](/files/opt/buzzers/100.mp3) · 41.1 KB

::: details Technical details

- **Path in image:** `/opt/buzzers/100.mp3`
- **Category:** audio
- **Size:** 41.1 KB (42061 bytes)
- **SHA-256:** `35669519666e9a07838c621dfaf809fe2086d53790d02ddcfa5ed19622e41733`

Buzzer asset index 100, about 42 KB. The jump in numbering suggests a second group of sounds for a distinct event class inside the same directory.


:::

### `101.mp3`

The smallest buzzer file, a very short tick or blip used for the lightest possible confirmation.

::: audio /files/opt/buzzers/101.mp3
:::

[Download](/files/opt/buzzers/101.mp3) · 4.9 KB

::: details Technical details

- **Path in image:** `/opt/buzzers/101.mp3`
- **Category:** audio
- **Size:** 4.9 KB (5054 bytes)
- **SHA-256:** `6e68b9122065d617ec6c081365345d04091a48b646699e8f478798923c9f9a45`

Buzzer asset index 101, about 5 KB. Its size implies a sub-second clip, consistent with a minimal UI tick.


:::

### `speaker-detect.mp3`

The loud chirp a speaker emits when the app asks 'which box is this?' During setup or diagnostics the player plays this tone so you can identify which physical speaker you are configuring.

::: audio /files/opt/buzzers/speaker-detect.mp3
:::

[Download](/files/opt/buzzers/speaker-detect.mp3) · 248.8 KB

::: details Technical details

- **Path in image:** `/opt/buzzers/speaker-detect.mp3`
- **Category:** audio
- **Size:** 248.8 KB (254725 bytes)
- **SHA-256:** `1611d71bab8d9a7a7d72ae6afc662c6637a9d4eaca9272166de6e54e9c1ff934`

About 255 KB, the largest buzzer by far because it is a longer identification tone. This is the file behind the 'chirp' feature and the x-rincon-configmode:speaker-detect URI documented in the URI formats page.


:::

