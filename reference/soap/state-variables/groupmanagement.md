# State variables: `GroupManagement`

### `GM.DelegatedGroupCoordinatorID`

Which member group leadership was delegated to. It is set during a coordinator hand-off so the topology knows who is taking over the group.

::: details Technical details

GroupManagement evented variable (event-pool literal)

:::

- **TODO:** Established: the variable's type (string), evented=True, and declared semantics are documented for GroupManagement.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `GM.LocalGroupUUID`

The identifier of the group this speaker currently belongs to. It is its group membership expressed in one value, and it changes on every group and ungroup.

::: details Technical details

GroupManagement evented variable (event-pool literal)

:::

- **TODO:** Established: the variable's type (string), evented=True, and declared semantics are documented for GroupManagement.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `GM.VirtualLineInGroupID`

The group associated with a virtual line-in session. It is set while an external feed session exists, tying the session to the group it serves.

::: details Technical details

GroupManagement evented variable (setVirtualLineInGroupIDLocked worker)

:::

- **TODO:** Established: the variable's type (string), evented=True, and declared semantics are documented for GroupManagement.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `GroupManagement.A_ARG_TYPE_AVTransportURI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMember`

### `GroupManagement.A_ARG_TYPE_BootSeq`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMember`

### `GroupManagement.A_ARG_TYPE_BufferingResultCode`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ReportTrackBufferingResult`

### `GroupManagement.A_ARG_TYPE_MemberID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMember`, `RemoveMember`, `ReportTrackBufferingResult`

### `GroupManagement.A_ARG_TYPE_TransportSettings`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMember`

### `GroupManagement.GroupCoordinatorIsLocal`

::: details Technical details

evented state variable: appears in GroupManagement LastChange/GENA event notifications

:::


### `GroupManagement.LocalGroupUUID`

::: details Technical details

evented state variable: appears in GroupManagement LastChange/GENA event notifications

:::

- related actions: `AddMember`

### `GroupManagement.ResetVolumeAfter`

::: details Technical details

evented state variable: appears in GroupManagement LastChange/GENA event notifications

:::

- related actions: `AddMember`

### `GroupManagement.SourceAreaIds`

::: details Technical details

non-evented GroupManagement state variable: read via action out-args, not pushed

:::

- related actions: `SetSourceAreaIds`

### `GroupManagement.VirtualLineInGroupID`

::: details Technical details

evented state variable: appears in GroupManagement LastChange/GENA event notifications

:::


### `GroupManagement.VolumeAVTransportURI`

::: details Technical details

evented state variable: appears in GroupManagement LastChange/GENA event notifications

:::

- related actions: `AddMember`
