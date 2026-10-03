# State variables: `Queue`

### `Queue.A_ARG_TYPE_Count`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `Queue.A_ARG_TYPE_EnqueueAsNext`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`

### `Queue.A_ARG_TYPE_Index`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `Queue.A_ARG_TYPE_LIST_URI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::


### `Queue.A_ARG_TYPE_LIST_URI_AND_METADATA`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_NumTracks`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_ObjectID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_QueueID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `AttachQueue`, `Browse`, `CreateQueue`, `RemoveAllTracks`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`, `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_QueueOwnerContext`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AttachQueue`, `CreateQueue`

### `Queue.A_ARG_TYPE_QueueOwnerID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AttachQueue`, `CreateQueue`

### `Queue.A_ARG_TYPE_QueuePolicy`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateQueue`

### `Queue.A_ARG_TYPE_Result`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `Queue.A_ARG_TYPE_SavedQueueTitle`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SaveAsSonosPlaylist`

### `Queue.A_ARG_TYPE_TrackNumber`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_TrackNumbersCSV`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_URI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_URIMetaData`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `ReplaceAllTracks`

### `Queue.A_ARG_TYPE_UpdateID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `AddMultipleURIs`, `AddURI`, `Browse`, `RemoveAllTracks`, `RemoveTrackRange`, `ReorderTracks`, `ReplaceAllTracks`

### `Queue.Curated`

Whether a queue is 'curated', meaning marked as managed by some system component rather than a raw user queue.

::: details Technical details

curated-queue flag

:::


### `Queue.LastChange`

::: details Technical details

evented state variable: appears in Queue LastChange/GENA event notifications

:::


### `Queue.QueueID`

The identifier of the queue being described, naming which managed queue an event or answer refers to.

::: details Technical details

queue identifier assigned at AttachQueue/CreateQueue

:::


### `Queue.QueueOwnerID`

Which component owns a queue: the entity (an internal module or a session) holding edit rights over it.

::: details Technical details

queue owner UDN

:::


### `Queue.UpdateID`

A queue's version stamp. It bumps on every edit, and apps send it back to prove they're editing the version they last saw, which prevents lost updates.

::: details Technical details

queue content update id

:::


### `savedqueues_rsq_schema`

The file format of the saved-queues store on disk, meaning how Sonos playlists are actually persisted on the speaker. It is the record structure that survives reboots, written by the queue-backup commands.

::: details Technical details

savedqueues.rsq persistence

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.
