# State variables: `RenderingControl`

### `RCS.AudioDelay`

The lip-sync delay for the main output: how much audio delay is applied so sound lines up with the TV picture. It exists because video processing adds latency the audio must wait out.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.AudioDelayLeftRear`

Lip-sync delay for the left rear channel. It is the surround-specific version of the audio delay, letting the left rear be timed independently.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.AudioDelayRightRear`

Lip-sync delay for the right rear channel, the companion to the left-rear delay. It gives the right rear its own lip-sync trim.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Bass`

The bass level. It is the equalizer's bass setting, evented so the app's EQ panel tracks changes made anywhere in the system.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.DialogLevel`

The dialogue-boost amount: how much speech-enhancement lift is applied on products that offer it. It is a per-model tone control for making voices easier to hear.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.HeightChannelLevel`

The level of height or ceiling channels. It is a setting for surround products with upward-firing speakers, present here only for spec parity on this older unit.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Loudness`

The loudness toggle. Loudness is Sonos's fullness boost for quiet listening, and it is evented alongside the rest of the EQ state.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.MusicSurroundLevel`

How much music playback goes to the surround speakers. It is the 'ambient versus full' music-surround level in a home-theater setup.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Mute`

The mute flag per channel, the most basic evented variable on this service. It fires every time mute flips, whether the change came from an app or the physical button.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.NightMode`

Whether night mode is on. Night mode is the dynamic-range compressor that softens loud effects for late-night TV, reported here as a home-theater toggle.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.OutputFixed`

Whether output is fixed-level. It is the flag that locks the speaker at line level for feeding an external amplifier.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.PresetNameList`

The list of named EQ and volume presets available. It is the preset vocabulary some products expose for one-tap sound modes.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SonarCalibrationAvailable`

Whether sonar or room calibration can run on this device. It is a capability flag telling apps whether to offer the tuning feature.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SonarEnabled`

Whether sonar calibration is currently enabled, which is the tuning system's on/off state after a completed calibration.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SpeakerSize`

The speaker-size classification: the large/small designation the audio pipeline uses for bass handling in home-theater configuration.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SpeechEnhanceEnabled`

Whether speech enhancement is on. It is the dialogue-clarity feature on theater products, evented so the app's toggle follows the real device state.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubCrossover`

The subwoofer crossover frequency: where bass hands off from the soundbar to the bonded sub. It is one of the home-theater tuning values.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubEnabled`

Whether the bonded subwoofer is enabled. It is the variable behind the app switch for 'use the sub', toggling the sub's participation in the theater rig.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubGain`

The subwoofer gain, meaning the sub's level trim relative to the rest of the rig. In plain terms, it controls how hot the bass runs.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SubPolarity`

The subwoofer polarity: the phase setting (normal or inverted) that keeps the sub's bass in step with the bar's drivers.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SupportsMaxDialogLevel`

Whether this device supports the maximum dialogue-level setting. It is a capability flag that gates the strongest speech-boost option.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundEnabled`

Whether surround speakers are active in the rig. It is the rear-channel enable flag inside a bonded theater setup, toggling the rears' participation on or off.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundLevel`

The surround speakers' level trim, controlling how loud the rear speakers play relative to the soundbar.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.SurroundMode`

The surround mode for music playback: the 'ambient' versus 'full' setting that decides how much music goes to the rear speakers.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Treble`

The treble level. It is the equalizer's treble setting, evented alongside bass so every view reflects the new value as soon as it changes anywhere.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RCS.Volume`

The volume per channel, which is the most-watched variable on this service. Every slider move, button press, or remote command lands here.

::: details Technical details

RenderingControl evented variable; emit-literal at RCS template (per-channel via @channel)

:::

- form: `<NAME val="..."/> attribute inside LastChange/Event doc`

### `RenderingControl.A_ARG_TYPE_Channel`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetLoudness`, `GetVolume`, `GetVolumeDB`, `GetVolumeDBRange`, `RampToVolume`, `RestoreVolumePriorToRamp`, `SetLoudness`, `SetRelativeVolume`, `SetVolume`, `SetVolumeDB`

### `RenderingControl.A_ARG_TYPE_ChannelMap`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SetChannelMap`

### `RenderingControl.A_ARG_TYPE_EQType`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetEQ`, `ResetExtEQ`, `SetEQ`

### `RenderingControl.A_ARG_TYPE_InstanceID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetBass`, `GetEQ`, `GetHeadphoneConnected`, `GetLoudness`, `GetMute`, `GetOutputFixed`, `GetRoomCalibrationStatus`, `GetSupportsOutputFixed`, `GetTreble`, `GetVolume`, `GetVolumeDB`, `GetVolumeDBRange`, `RampToVolume`, `ResetBasicEQ`, `ResetExtEQ`, `RestoreVolumePriorToRamp`, `SetBass`, `SetChannelMap`, `SetEQ`, `SetLoudness`, `SetMute`, `SetOutputFixed`, `SetRelativeVolume`, `SetRoomCalibrationStatus`, `SetTreble`, `SetVolume`, `SetVolumeDB`

### `RenderingControl.A_ARG_TYPE_LeftVolume`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `ResetBasicEQ`

### `RenderingControl.A_ARG_TYPE_MuteChannel`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetMute`, `SetMute`

### `RenderingControl.A_ARG_TYPE_ProgramURI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RampTimeSeconds`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RampType`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_ResetVolumeAfter`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RampToVolume`

### `RenderingControl.A_ARG_TYPE_RightVolume`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `ResetBasicEQ`

### `RenderingControl.A_ARG_TYPE_VolumeAdjustment`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SetRelativeVolume`

### `RenderingControl.AudioDelay`

::: details Technical details

lip-sync audio delay

:::


### `RenderingControl.AudioDelayLeftRear`

::: details Technical details

left-rear delay

:::


### `RenderingControl.AudioDelayRightRear`

::: details Technical details

right-rear delay

:::


### `RenderingControl.Bass`

::: details Technical details

bass EQ level

:::


### `RenderingControl.DialogLevel`

::: details Technical details

dialog enhancement level

:::


### `RenderingControl.EQValue`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetEQ`, `SetEQ`

### `RenderingControl.HeadphoneConnected`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetHeadphoneConnected`

### `RenderingControl.HeightChannelLevel`

::: details Technical details

height/Atmos channel output level

:::


### `RenderingControl.LastChange`

::: details Technical details

evented state variable: appears in RenderingControl LastChange/GENA event notifications

:::


### `RenderingControl.Loudness`

::: details Technical details

loudness compensation state (Master)

:::


### `RenderingControl.MusicSurroundLevel`

::: details Technical details

surround level applied to music sources

:::


### `RenderingControl.Mute`

::: details Technical details

per-channel mute state

:::


### `RenderingControl.NightMode`

::: details Technical details

night-mode compression state

:::


### `RenderingControl.OutputFixed`

::: details Technical details

fixed line-out level enabled

:::


### `RenderingControl.PresetNameList`

::: details Technical details

list of available EQ preset names

:::

- accepted values: `FactoryDefaults`
- constant value in this build

### `RenderingControl.RoomCalibrationAvailable`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetRoomCalibrationStatus`

### `RenderingControl.RoomCalibrationBondedZoneInfo`

::: details Technical details

bonded-zone calibration info

:::


### `RenderingControl.RoomCalibrationCalibrationMode`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::


### `RenderingControl.RoomCalibrationCoefficients`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::


### `RenderingControl.RoomCalibrationEnabled`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetRoomCalibrationStatus`, `SetRoomCalibrationStatus`

### `RenderingControl.RoomCalibrationID`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::


### `RenderingControl.SonarCalibrationAvailable`

::: details Technical details

whether Sonar/Trueplay calibration data is available for this zone

:::


### `RenderingControl.SonarEnabled`

::: details Technical details

Trueplay/Sonar enabled

:::


### `RenderingControl.SpeakerSize`

::: details Technical details

speaker size class

:::


### `RenderingControl.SpeechEnhanceEnabled`

::: details Technical details

speech enhancement state

:::


### `RenderingControl.SubCrossover`

::: details Technical details

subwoofer crossover freq

:::


### `RenderingControl.SubEnabled`

::: details Technical details

whether the bonded subwoofer is enabled

:::


### `RenderingControl.SubGain`

::: details Technical details

subwoofer output gain level

:::


### `RenderingControl.SubPolarity`

::: details Technical details

subwoofer polarity phase setting

:::


### `RenderingControl.SupportsMaxDialogLevel`

::: details Technical details

whether the device supports the maximum dialog level

:::


### `RenderingControl.SupportsOutputFixed`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetSupportsOutputFixed`

### `RenderingControl.SurroundEnabled`

::: details Technical details

whether surround channels are enabled

:::


### `RenderingControl.SurroundLevel`

::: details Technical details

surround channel level

:::


### `RenderingControl.SurroundMode`

::: details Technical details

surround processing mode

:::


### `RenderingControl.Treble`

::: details Technical details

treble EQ level

:::


### `RenderingControl.Volume`

::: details Technical details

per-channel volume (Master/LF/RF elements)

:::


### `RenderingControl.VolumeDB`

::: details Technical details

non-evented RenderingControl state variable: read via action out-args, not pushed

:::

- related actions: `GetVolumeDB`, `GetVolumeDBRange`, `SetVolumeDB`

### `renderingcontrol_status_schema`

The fields on the diagnostics page for the volume and tone service. It is the player's internal view of channel volumes, mutes, EQ values, and flags, exposed for support and debugging.

::: details Technical details

/status/renderingcontrol emitted XML

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.
