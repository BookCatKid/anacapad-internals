# State variables: `ConnectionManager`

### `CM.CurrentConnectionIDs`

The list of live connections against the player, which is the evented form of the connection-list command. It fires whenever a control session opens or closes.

::: details Technical details

ConnectionManager evented variable in f_10735918

:::

- **TODO:** Established: the variable's type (string), evented=True, and declared semantics are documented for ConnectionManager.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `ConnectionManager.A_ARG_TYPE_AVTransportID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionManager`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ConnectionStatus`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_Direction`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_ProtocolInfo`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.A_ARG_TYPE_RcsID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetCurrentConnectionInfo`

### `ConnectionManager.CurrentConnectionIDs`

::: details Technical details

evented state variable: appears in ConnectionManager LastChange/GENA event notifications

:::

- related actions: `GetCurrentConnectionIDs`

### `ConnectionManager.SinkProtocolInfo`

::: details Technical details

evented state variable: appears in ConnectionManager LastChange/GENA event notifications

:::

- related actions: `GetProtocolInfo`

### `ConnectionManager.SourceProtocolInfo`

::: details Technical details

evented state variable: appears in ConnectionManager LastChange/GENA event notifications

:::

- related actions: `GetProtocolInfo`
