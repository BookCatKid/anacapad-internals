# State variables: `MusicServices`

### `MS.ServiceListVersion`

A version counter for the music-service catalog. It bumps when the available-services list changes, so apps re-pull the catalog only when it moved.

::: details Technical details

MusicServices evented variable; emitted by f_100c7084 e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`
- **TODO:** Established: the variable's type (ui4), evented=True, and declared semantics are documented for MusicServices.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

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

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.
