# State variables: `MusicServices`

### `MS.ServiceListVersion`

A version counter for the music-service catalog. It bumps when the available-services list changes, so apps re-pull the catalog only when it moved.

::: details Technical details

MusicServices evented variable; emitted by f_100c7084 e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `MusicServices.A_ARG_TYPE_ServiceDescriptorList`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ListAvailableServices`

### `MusicServices.A_ARG_TYPE_ServiceTypeList`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ListAvailableServices`

### `MusicServices.ServiceId`

::: details Technical details

non-evented MusicServices state variable: read via action out-args, not pushed

:::

- related actions: `GetSessionId`

### `MusicServices.ServiceListVersion`

::: details Technical details

evented state variable: appears in MusicServices LastChange/GENA event notifications

:::

- related actions: `ListAvailableServices`

### `MusicServices.SessionId`

::: details Technical details

non-evented MusicServices state variable: read via action out-args, not pushed

:::

- related actions: `GetSessionId`

### `MusicServices.Username`

::: details Technical details

non-evented MusicServices state variable: read via action out-args, not pushed

:::

- related actions: `GetSessionId`

### `services_xml_schema`

The layout of the replicated services list: the document describing which music services exist on the household that all players share, so every speaker sees the same service catalog.

::: details Technical details

replicated services list XML

:::

