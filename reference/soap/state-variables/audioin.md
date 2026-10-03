# State variables: `AudioIn`

### `AI.IRRepeaterState`

Whether the infrared repeater is currently on. It mirrors the home-theater IR setting so a change shows up as an event, though it is dead on this build along with the rest of the AudioIn surface.

::: details Technical details

AudioIn evented variable; emitted by f_10243170 e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`
- **TODO:** Established: the variable's type (string), evented=True, and declared semantics are documented for AudioIn.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `AI.TOSLinkConnected`

Whether something is plugged into the optical input, which is the line-in detection flag. It is part of the AudioIn surface that is a reject-everything stub on this firmware.

::: details Technical details

AudioIn evented variable; emitted by f_10243170 e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`
- **TODO:** Established: the variable's type (boolean), evented=True, and declared semantics are documented for AudioIn.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `AudioIn.A_ARG_TYPE_MemberID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartTransmissionToGroup`, `StopTransmissionToGroup`

### `AudioIn.A_ARG_TYPE_ObjectID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartTransmissionToGroup`

### `AudioIn.A_ARG_TYPE_TransportSettings`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartTransmissionToGroup`

### `AudioIn.AudioInputName`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::

- related actions: `GetAudioInputAttributes`, `SetAudioInputAttributes`

### `AudioIn.Icon`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::

- related actions: `GetAudioInputAttributes`, `SetAudioInputAttributes`

### `AudioIn.LeftLineInLevel`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::

- related actions: `GetLineInLevel`, `SetLineInLevel`

### `AudioIn.LineInConnected`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::


### `AudioIn.Playing`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::


### `AudioIn.RightLineInLevel`

::: details Technical details

evented state variable: appears in AudioIn LastChange/GENA event notifications

:::

- related actions: `GetLineInLevel`, `SetLineInLevel`
