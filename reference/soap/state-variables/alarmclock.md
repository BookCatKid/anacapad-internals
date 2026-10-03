# State variables: `AlarmClock`

### `AC.AlarmListVersion`

A version counter for the alarm list that ticks up every time an alarm is created, edited, or deleted. Apps watch this single number to know their cached alarm list went stale instead of re-fetching the whole list constantly.

::: details Technical details

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AC.DateFormat`

The speaker's preferred date display format. It is the setting behind how dates render in anything that asks the player rather than guessing at your region's convention.

::: details Technical details

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeFormat`

The speaker's preferred clock format: 12-hour versus 24-hour. It is read by anything displaying times the way the speaker was configured to.

::: details Technical details

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeGeneration`

A counter that bumps whenever the household clock settings change, covering timezone switches, manual time sets, and server changes. It lets other devices notice 'the clock just moved' and react.

::: details Technical details

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AC.TimeServer`

The address of the network time source the speaker syncs against. It reports where the household clock comes from so apps and diagnostics can see the configured time server.

::: details Technical details

AlarmClock evented variable; emitted by f_10277d6c e:property dump.

:::

- form: `<e:property><NAME>value</e:property>`

### `AlarmClock.A_ARG_TYPE_AlarmEnabled`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `DestroyAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmIncludeLinkedZones`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmList`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `ListAlarms`

### `AlarmClock.A_ARG_TYPE_AlarmPlayMode`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmProgramMetaData`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmProgramURI`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmRoomUUID`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_AlarmVolume`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_ISO8601Time`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `GetHouseholdTimeAtStamp`, `GetTimeNow`, `SetTimeNow`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_Recurrence`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `CreateAlarm`, `UpdateAlarm`

### `AlarmClock.A_ARG_TYPE_TimeStamp`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetHouseholdTimeAtStamp`

### `AlarmClock.A_ARG_TYPE_TimeZoneAutoAdjustDst`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetTimeZone`, `GetTimeZoneAndRule`, `SetTimeZone`

### `AlarmClock.A_ARG_TYPE_TimeZoneIndex`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `GetTimeZone`, `GetTimeZoneAndRule`, `GetTimeZoneRule`, `SetTimeZone`

### `AlarmClock.A_ARG_TYPE_TimeZoneInformation`

::: details Technical details

argument-type state variable (SCPD type declaration for action args; not device state, not evented)

:::

- related actions: `SetTimeNow`

### `AlarmClock.AlarmListVersion`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `ListAlarms`

### `AlarmClock.DailyIndexRefreshTime`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetDailyIndexRefreshTime`, `SetDailyIndexRefreshTime`

### `AlarmClock.DateFormat`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetFormat`, `SetFormat`

### `AlarmClock.TimeFormat`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetFormat`, `SetFormat`

### `AlarmClock.TimeGeneration`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetTimeNow`

### `AlarmClock.TimeServer`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetTimeServer`, `SetTimeServer`

### `AlarmClock.TimeZone`

::: details Technical details

evented state variable: appears in AlarmClock LastChange/GENA event notifications

:::

- related actions: `GetTimeNow`, `GetTimeZoneAndRule`, `GetTimeZoneRule`

### `alarm_status_schema`

The field list for the alarm page on the player's built-in diagnostics website: which alarm details the player exposes when you or support tools visit its status pages, covering what's scheduled, what's ringing, and the bookkeeping around each.

::: details Technical details

/status/alarm emitted XML

:::

