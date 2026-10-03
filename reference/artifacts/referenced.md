# Artifacts: Referenced but not shipped on this model

Files the software knows about and can use, but which are not present in this model's firmware image. Some are downloaded on demand when a feature runs (like calibration tones), some belong to other models, and some are created at runtime rather than shipped. Documented here because the code references them by name.

::: details Technical details

Path and filename literals recovered from the binary that resolve to CDN downloads, other-model firmware trees, or runtime-created state rather than files in this squashfs.

:::

### `complete.ogg`

The 'finished' jingle played at the end of a calibration pass so you know the measurement succeeded. Named in the binary, fetched on demand.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

::: details Technical details

- **Path in image:** `/opt/buzzers/complete.ogg`
- **Category:** referenced

x-rincon-configmode:sonar-calibrate-complete / sonarcal complete.ogg family.


:::

### `complete_ht.ogg`

The completion tone for home-theater calibration specifically, the variant used when tuning a soundbar rig with satellites.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

::: details Technical details

- **Path in image:** `/opt/buzzers/complete_ht.ogg`
- **Category:** referenced

x-rincon-sonarcal:complete_ht.ogg; home-theater variant of the calibration-complete asset.


:::

### `leader.ogg`

The tone a group leader plays during the older Sonar room-calibration flow. The firmware references it by name, but it is not stored in this model's image; it is fetched when calibration runs.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

::: details Technical details

- **Path in image:** `/opt/buzzers/leader.ogg`
- **Category:** referenced

Referenced by the x-rincon-sonarcal:leader.ogg URI and the trueplay/sonarcal tone-download machinery; delivered on demand via the ETag-cached tone download path rather than shipped in /opt/buzzers.


:::

### `testtone.ogg`

The measurement tone used while calibrating a speaker's sound for the room. Referenced by name in the calibration code but downloaded only when a tuning session actually runs.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

::: details Technical details

- **Path in image:** `/opt/buzzers/testtone.ogg`
- **Category:** referenced

x-rincon-sonarcal:testtone.ogg; pulled through the tone_download machinery (etags.txt cache) at calibration time.


:::

### `trueroom_tone.ogg`

The tone for the trueroom tuning pass, a second-generation room measurement the firmware supports but does not ship as a file.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

::: details Technical details

- **Path in image:** `/opt/buzzers/trueroom_tone.ogg`
- **Category:** referenced

x-rincon-sonarcal:trueroom family; downloaded per-session like the other sonarcal assets.


:::

### `level.mp3`

A test tone that the smaller Play:1 model ships for audio level checks. On the Playbar build this file does not exist; the same menu of sounds is implemented but this asset was left out of this model.

*Not shipped in this build; documented because other firmware versions and binary string evidence reference it.*

::: details Technical details

- **Path in image:** `/opt/htdocs/audio/level.mp3`
- **Category:** referenced

271 KB in the m8/fenway rootfs (documented in the firmware-differences page); absent from the m9 image.


:::

