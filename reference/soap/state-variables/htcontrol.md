# State variables: `HTControl`

### `HT.LEDFeedbackState`

Whether the remote-received LED flash is on. It is the home-theater feedback setting, evented so settings screens stay truthful about the device state.

::: details Technical details

HTControl evented variable in f_10739c34

:::

- **TODO:** Established: the variable's type (string), evented=True, and declared semantics are documented for HTControl.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `HT.RemoteConfigured`

Whether the speaker has a configured infrared remote. It is set once remote-learning is done, and it is the flag apps check before offering the setup wizard.

::: details Technical details

HTControl evented variable in f_10782194

:::

- **TODO:** Established: the variable's type (boolean), evented=True, and declared semantics are documented for HTControl.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `HTControl.A_ARG_TYPE_IRCode`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `LearnIRCode`

### `HTControl.A_ARG_TYPE_IRRemoteName`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CommitLearnedIRCodes`

### `HTControl.A_ARG_TYPE_Timeout`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- range: `minimum` = 0; `maximum` = 60000
- related actions: `IdentifyIRRemote`, `LearnIRCode`

### `HTControl.IRRepeaterState`

::: details Technical details

evented state variable: appears in HTControl LastChange/GENA event notifications

:::

- related actions: `GetIRRepeaterState`, `SetIRRepeaterState`

### `HTControl.LEDFeedbackState`

::: details Technical details

non-evented HTControl state variable: read via action out-args, not pushed

:::

- related actions: `GetLEDFeedbackState`, `SetLEDFeedbackState`

### `HTControl.RemoteConfigured`

::: details Technical details

non-evented HTControl state variable: read via action out-args, not pushed

:::

- related actions: `IsRemoteConfigured`

### `HTControl.TOSLinkConnected`

::: details Technical details

evented state variable: appears in HTControl LastChange/GENA event notifications

:::

