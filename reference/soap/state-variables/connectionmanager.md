# State variables: `ConnectionManager`

### `CM.CurrentConnectionIDs`

The list of live connections against the player, which is the evented form of the connection-list command. It fires whenever a control session opens or closes.

::: details Technical details

ConnectionManager evented variable in f_10735918

:::


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
