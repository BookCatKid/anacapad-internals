# State variables: `ZoneGroupTopology`

### `ZGT.ZoneGroupState`

The entire household map as one variable: every player, its room name, its group, and each group's leader, packed into a single document. It is the heartbeat of multi-room awareness, because it changes and announces every time the system's shape changes.

::: details Technical details

ZGT evented state doc: full <ZoneGroupState>+<ZoneGroups>+<MediaServers> XML pushed via f_1074d9b4 emitter (serializer f_10743328, MediaServers section f_10129888); not LastChange attribute-form

:::

- form: `direct <e:property><ZoneGroupState> XML`

### `ZoneGroupTopology.A_ARG_TYPE_CachedOnly`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_IncludeControllers`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.A_ARG_TYPE_MemberID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ReportUnresponsiveDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceName`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileDeviceUDN`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_MobileIPAndPort`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RegisterMobileDevice`

### `ZoneGroupTopology.A_ARG_TYPE_Origin`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.A_ARG_TYPE_UnresponsiveDeviceActionType`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ReportUnresponsiveDevice`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateExtraOptions`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateFlags`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateItem`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateType`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_UpdateURL`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `BeginSoftwareUpdate`

### `ZoneGroupTopology.A_ARG_TYPE_Version`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CheckForUpdate`

### `ZoneGroupTopology.AlarmRunSequence`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.AreasUpdateID`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.AvailableSoftwareUpdate`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.DiagnosticID`

::: details Technical details

non-evented ZoneGroupTopology state variable: read via action out-args, not pushed

:::

- related actions: `SubmitDiagnostics`

### `ZoneGroupTopology.MuseHouseholdId`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.NetsettingsUpdateID`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.SourceAreasUpdateID`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.ThirdPartyMediaServersX`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::


### `ZoneGroupTopology.ZoneGroupID`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.ZoneGroupName`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::

- related actions: `GetZoneGroupAttributes`

### `ZoneGroupTopology.ZoneGroupState`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::

- related actions: `GetZoneGroupState`

### `ZoneGroupTopology.ZonePlayerUUIDsInGroup`

::: details Technical details

evented state variable: appears in ZoneGroupTopology LastChange/GENA event notifications

:::

- related actions: `GetZoneGroupAttributes`

### `zone_group_state_schema`

The layout of the household-map document, which is the same ZoneGroupState the topology service emits: every player, room, group, and coordinator, structured so any device can parse the whole system's shape.

::: details Technical details

evented ZoneGroupState XML emitted by topology_base

:::

