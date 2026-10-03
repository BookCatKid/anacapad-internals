# State variables: `ContentDirectory`

### `CD.ContainerUpdateIDs`

The change-markers for library containers: a list of which folders and playlists changed since the last check. It lets an app refresh only the parts of its browse view that moved instead of re-reading the whole library.

::: details Technical details

ContentDirectory evented variable in f_103035c4

:::

- **TODO:** Established: the variable's type (string), evented=True, and declared semantics are documented for ContentDirectory.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `CD.FavoritesUpdateID`

A version counter for the favorites list. It bumps whenever your saved stations, playlists, or items change, which tells apps their favorites view is stale.

::: details Technical details

ContentDirectory evented variable in f_10303de4

:::

- **TODO:** Established: the variable's type (ui4), evented=True, and declared semantics are documented for ContentDirectory.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `CD.RadioFavoritesUpdateID`

A version counter for saved radio favorites. It bumps when your radio presets change, so the stations list refreshes only when it needs to.

::: details Technical details

ContentDirectory evented variable in f_10303de4

:::

- **TODO:** Established: the variable's type (ui4), evented=True, and declared semantics are documented for ContentDirectory.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `CD.SavedQueuesUpdateID`

A version counter for Sonos playlists. It bumps when any saved queue is created, edited, or deleted, making it the 'your playlists changed' signal.

::: details Technical details

ContentDirectory evented variable in f_10303de4

:::

- **TODO:** Established: the variable's type (ui4), evented=True, and declared semantics are documented for ContentDirectory.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `CD.ShareIndexInProgress`

Whether a music-library rescan is running right now. It is the flag behind the 'updating music index' spinner, on while a rescan walks your folders.

::: details Technical details

ContentDirectory evented variable in f_103035c4

:::

- **TODO:** Established: the variable's type (string), evented=True, and declared semantics are documented for ContentDirectory.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `CD.ShareListUpdateID`

A version counter for the music-shares list. It bumps when folders are added to or removed from the library, so apps re-fetch the share list only when it changed.

::: details Technical details

ContentDirectory evented variable in f_10303de4

:::

- **TODO:** Established: the variable's type (ui4), evented=True, and declared semantics are documented for ContentDirectory.
- **TODO:** Still unknown: the runtime producer - which impl field or event path writes and emits this variable - is not traced.
- **TODO:** Next step: trace the variable's LastChange/update emitter back to its backing field.

### `ContentDirectory.A_ARG_TYPE_AlbumArtistDisplayOption`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetAlbumArtistDisplayOption`, `RefreshShareIndex`

### `ContentDirectory.A_ARG_TYPE_BrowseFlag`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_Count`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`, `GetAllPrefixLocations`

### `ContentDirectory.A_ARG_TYPE_Filter`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_Index`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`, `FindPrefix`

### `ContentDirectory.A_ARG_TYPE_LastIndexChange`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetLastIndexChange`

### `ContentDirectory.A_ARG_TYPE_ObjectID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`, `CreateObject`, `DestroyObject`, `FindPrefix`, `GetAllPrefixLocations`, `UpdateObject`

### `ContentDirectory.A_ARG_TYPE_Prefix`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `FindPrefix`

### `ContentDirectory.A_ARG_TYPE_Result`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`, `CreateObject`, `GetAllPrefixLocations`

### `ContentDirectory.A_ARG_TYPE_SearchCriteria`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::


### `ContentDirectory.A_ARG_TYPE_SortCriteria`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`

### `ContentDirectory.A_ARG_TYPE_SortOrder`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `RequestResort`

### `ContentDirectory.A_ARG_TYPE_TagValueList`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `UpdateObject`

### `ContentDirectory.A_ARG_TYPE_UpdateID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `Browse`, `FindPrefix`, `GetAllPrefixLocations`

### `ContentDirectory.Browseable`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::

- related actions: `GetBrowseable`, `SetBrowseable`

### `ContentDirectory.ContainerUpdateIDs`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.FavoritesUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.RadioFavoritesUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.RadioLocationUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.RecentlyPlayedUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.SavedQueuesUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.SearchCapabilities`

::: details Technical details

non-evented ContentDirectory state variable: read via action out-args, not pushed

:::

- related actions: `GetSearchCapabilities`

### `ContentDirectory.ShareIndexInProgress`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::

- related actions: `GetShareIndexInProgress`

### `ContentDirectory.ShareIndexLastError`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.ShareListUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `ContentDirectory.SortCapabilities`

::: details Technical details

non-evented ContentDirectory state variable: read via action out-args, not pushed

:::

- related actions: `GetSortCapabilities`

### `ContentDirectory.SystemUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::

- related actions: `GetSystemUpdateID`

### `ContentDirectory.UserRadioUpdateID`

::: details Technical details

evented state variable: appears in ContentDirectory LastChange/GENA event notifications

:::


### `shares_schema`

The layout of the replicated share registry: the document listing your music-library folders that all household players keep a copy of, so every speaker can index and play from the same shares.

::: details Technical details

replicated share registry XML

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.
