# State variables: `VirtualLineIn`

### `VirtualLineIn.AVTransportURIMetaData`

::: details Technical details

non-evented VirtualLineIn state variable: read via action out-args, not pushed

:::


### `VirtualLineIn.A_ARG_TYPE_CurrentTransportSettings`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartTransmission`

### `VirtualLineIn.A_ARG_TYPE_InstanceID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Next`, `Pause`, `Play`, `Previous`, `SetVolume`, `StartTransmission`, `Stop`, `StopTransmission`

### `VirtualLineIn.A_ARG_TYPE_PlayerID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `StartTransmission`, `StopTransmission`

### `VirtualLineIn.A_ARG_TYPE_Speed`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Play`

### `VirtualLineIn.A_ARG_TYPE_Volume`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SetVolume`

### `VirtualLineIn.CurrentTrackMetaData`

::: details Technical details

evented state variable: appears in VirtualLineIn LastChange/GENA event notifications

:::


### `VirtualLineIn.CurrentTransportActions`

::: details Technical details

non-evented VirtualLineIn state variable: read via action out-args, not pushed

:::


### `VirtualLineIn.EnqueuedTransportURIMetaData`

::: details Technical details

non-evented VirtualLineIn state variable: read via action out-args, not pushed

:::


### `vli_state_snapshot`

The snapshot recorded when a virtual line-in session changes state: the fields captured at transitions so the session can be handed off or resumed, covering source, coordinator, and transport settings at that moment.

::: details Technical details

VLI handoff snapshot recorded at state transitions

:::

