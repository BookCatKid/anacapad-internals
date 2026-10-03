# State variables: `GroupRenderingControl`

### `GRC.GroupMute`

The group's mute state. It is the evented flag every controller follows for the group mute button, so when it changes anywhere, every app sees it flip.

::: details Technical details

GroupRenderingControl evented variable (SetGroupMute rc-log literal)

:::


### `GRC.GroupVolume`

The group's aggregate volume, which is the number behind the group slider. The coordinator re-derives it as member levels change.

::: details Technical details

GroupRenderingControl evented variable (SetGroupVolume rc-log literal)

:::


### `GRC.GroupVolumeChangeable`

Whether the group volume can currently be changed. In some configurations the group level is locked or derived, and this flag tells the app the slider should be disabled.

::: details Technical details

GroupRenderingControl evented variable (GroupVolumeChangedEvent pool)

:::


### `GroupRenderingControl.A_ARG_TYPE_InstanceID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetGroupMute`, `GetGroupVolume`, `SetGroupMute`, `SetGroupVolume`, `SetRelativeGroupVolume`, `SnapshotGroupVolume`

### `GroupRenderingControl.A_ARG_TYPE_VolumeAdjustment`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SetRelativeGroupVolume`

### `GroupRenderingControl.GroupMute`

::: details Technical details

evented state variable: appears in GroupRenderingControl LastChange/GENA event notifications

:::

- related actions: `GetGroupMute`, `SetGroupMute`

### `GroupRenderingControl.GroupVolume`

::: details Technical details

evented state variable: appears in GroupRenderingControl LastChange/GENA event notifications

:::

- range: `minimum` = 0; `maximum` = 100; `step` = 1
- related actions: `GetGroupVolume`, `SetGroupVolume`, `SetRelativeGroupVolume`

### `GroupRenderingControl.GroupVolumeChangeable`

::: details Technical details

evented state variable: appears in GroupRenderingControl LastChange/GENA event notifications

:::

