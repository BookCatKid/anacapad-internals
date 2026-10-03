# State variables: `internal schemas`

### `ht_input_session`

The telemetry fields captured for a home-theater input session: the bookkeeping the soundbar keeps about an active TV or optical input session, covering source, timing, and session state.

::: details Technical details

HT input-session telemetry fields

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `netsettings_schema`

The layout of the player's replicated network-settings store: the on-disk document holding WiFi credentials and network configuration that all devices in the household share. This is where your WiFi password actually lives inside the system: encrypted per-household and replicated across players so any of them can join the network.

::: details Technical details

netsettings.json replicated network+PSK store

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `playstatemanager_schema`

The fields of the play-state manager page on the diagnostics site. It is the component's own view of who's playing what where, exposed for debugging group playback issues.

::: details Technical details

/status page

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `replicated_netsettings_schema`

The layout of the replicated network-settings document exchanged between players. It is the shared network config (including WiFi details) every household member keeps in sync, so any player can stand up the same network configuration.

::: details Technical details

netsettings replicated XML

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `sounddevice_status_schema`

The fields of the SoundDevice diagnostics page, which is per-zone audio bookkeeping: each player's volume, ducking state, and output details as the player reports them internally.

::: details Technical details

SoundDevice page (per-zone volume/ducking)

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `update_info_schema`

The fields of the update-info diagnostics page: what the player reports about its firmware status, covering current version, what updates are pending or downloading, and update history.

::: details Technical details

UpdateInfo page

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `userradio_schema`

The layout of the user-radio favorites file: the document storing your saved radio stations, plus the delta-file format used to apply incremental changes without rewriting the whole list.

::: details Technical details

userradio.xml (+.d.xml delta) replicated favorites

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `zoneplayers_status_schema`

The fields of the ZonePlayers diagnostics page: the player's internal census of every speaker it knows about, including IDs, rooms, versions, and addresses, exposed for debugging.

::: details Technical details

/status ZonePlayers page

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `zp_support_info`

The layout of the support-information bundle: the structured data gathered when you submit diagnostics, covering versions, hardware details, state, and configuration, packaged so Sonos support can read it.

::: details Technical details

ZPSupportInfo schema

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `zpinfo_schema`

The layout of the player's self-description documents: the fields a speaker publishes about itself, covering identity, device info, and play-mode capabilities, used by the rest of the household to recognize it.

::: details Technical details

ZPInfo + DeviceInfo + Playmode

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.

### `zps_page`

The fields of the household update-status page: the diagnostics view showing each player's update state during a rollout, covering who's updated, who's downloading, and who's pending or failed.

::: details Technical details

household update status page fields

:::

- **TODO:** Established: the emitted field set for this internal structure is decoded and listed in this record.
- **TODO:** Still unknown: which impl-side fields or storage produce each emitted value; the producers behind the schema are not traced field-by-field.
- **TODO:** Next step: trace the emitter's field reads to their backing storage to confirm each field's source.
