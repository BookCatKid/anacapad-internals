# `AlarmClock` — `/AlarmClock/Control`

**visibility** `advertised` · **status** `strong`

Alarm scheduler for the zone. Lets a client create, list, update and delete alarms, and read/set the household clock settings those alarms run against (current time, time zone, time server, 12/24h and date formats, and the daily music-index refresh time). Alarms target a single room by UUID and can play a stream URI or a library playlist at a fixed volume, optionally grouping linked zones. Changes are announced through the evented AlarmListVersion.

**Technical description:** Alarm and clock service: alarm CRUD plus household time/timezone/settings getters and setters. Alarm ops fan into the same alarm subsystem as AVTransport RunAlarm/SnoozeAlarm machinery.

## Availability

- capability flags `0x80`
- enabled gate: `0x1` at `0x1019557c` (const)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x80`
- dispatcher `0x10733b44` kind `table`
- action table `0x10f11580`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `CreateAlarm` | advertised | callable | `strong` | virtual | 402 |
| `DestroyAlarm` | advertised | callable | `strong` | virtual | 402 |
| `GetDailyIndexRefreshTime` | advertised | callable | `strong` | virtual | 402 |
| `GetFormat` | advertised | callable | `strong` | virtual | 402 |
| `GetHouseholdTimeAtStamp` | advertised | callable | `strong` | virtual | 401, 402 |
| `GetTimeNow` | advertised | callable | `strong` | virtual | 402 |
| `GetTimeServer` | advertised | callable | `strong` | virtual | 402 |
| `GetTimeZone` | advertised | callable | `strong` | virtual | 402 |
| `GetTimeZoneAndRule` | advertised | callable | `strong` | virtual | 402 |
| `GetTimeZoneRule` | advertised | callable | `strong` | virtual | 402 |
| `ListAlarms` | advertised | callable | `strong` | virtual | 402 |
| `SetDailyIndexRefreshTime` | advertised | callable | `strong` | virtual | 402 |
| `SetFormat` | advertised | callable | `strong` | virtual | 401, 402 |
| `SetTimeNow` | advertised | callable | `strong` | virtual | 401, 402 |
| `SetTimeServer` | advertised | callable | `strong` | virtual | 402 |
| `SetTimeZone` | advertised | callable | `strong` | virtual | 402 |
| `UpdateAlarm` | advertised | callable | `strong` | virtual | 402 |

### `CreateAlarm`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Creates a new alarm and returns its AssignedID, which is needed for UpdateAlarm and DestroyAlarm. StartLocalTime and Duration use 'HH:MM:SS'; Recurrence is a keyword such as ONCE, EVERYDAY, WEEKDAYS or WEEKENDS. RoomUUID selects the player, ProgramURI/ProgramMetaData choose what plays (a stream URI, or a Sonos playlist/library URI), PlayMode picks e.g. NORMAL or SHUFFLE_NOREPEAT, Volume is 0-100, and IncludeLinkedZones controls whether bonded players join in.

**Technical description:** Creates an alarm: StartLocalTime/Duration/Recurrence/Enabled/RoomUUID/ProgramURI/ProgramMetaData/PlayMode/Volume/IncludeLinkedZones -> impl->v\[+0x34\], returning AssignedID.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `StartLocalTime` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 8 chars | none; required input |
| `Duration` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 8 chars | none; required input |
| `Recurrence` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 10 chars | none; required input |
| `Enabled` | boolean/numeric flag | yes | 0/1 flag / 0/1 | none; required input |
| `RoomUUID` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 24 chars | none; required input |
| `ProgramURI` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 1024 chars | none; required input |
| `ProgramMetaData` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 4096 chars | none; required input |
| `PlayMode` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 31 chars | none; required input |
| `Volume` | signed int32 | yes | u16 volume (0-100 scale convention) / parsed integer; stored on the alarm record | none; required input |
| `IncludeLinkedZones` | boolean/numeric flag | yes | 0/1 flag / 0/1 | none; required input |

- **`StartLocalTime`** — Alarm start time (local HH:MM:SS)
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x9`
- **`Duration`** — Alarm duration (HH:MM:SS)
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x9`
- **`Recurrence`** — Alarm-record field Recurrence
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0xb`
- **`Enabled`** — Alarm enable flag
  - validation: stored in the alarm record
  - buffer cap: `0x18`
- **`RoomUUID`** — Alarm-record field RoomUUID
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x19`
- **`ProgramURI`** — Alarm-record field ProgramURI
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x401`
- **`ProgramMetaData`** — Alarm-record field ProgramMetaData
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x1001`
- **`PlayMode`** — Alarm-record field PlayMode
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x20`
- **`Volume`** — Alarm playback volume
  - validation: stored in the alarm record
  - buffer cap: `0x18`
- **`IncludeLinkedZones`** — Extend the alarm across linked zones
  - validation: stored in the alarm record
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `AssignedID` | unsigned int32 | u32 alarm id assigned by the alarm store / u32 id space |

- **`AssignedID`** — Newly allocated alarm id
  - validation: emitted via response vfuncs

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10734404 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×10, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10734404 — req-vfunc call map: {'0x1c': 10, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10734404 — member vfunc calls: \['*(r30+4) v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r30+4) v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x10734404 — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10734404 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10734404 — commit/fault slot usage: {'0x1c': 10, '0x8': 1, '0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`vret(*(r3-in+0x4),+0x34)`** `strong`

alarm-store vfunc 0x1027a980 (slot +0x34) domain: literal 402 gate (0x1027aa30) plus insert-result derived path (r31 = call result / arg-seeded)

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** literal 402 exit + derived insert path
**Bounded unknown — unresolved:** alarm-insert worker rc domain | commit chain: f_1027a8f8 -> f_1027f94c persist writer (rc = inner-call result, no literal faults observed)

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10734404`
- dispatch entry `0x10f11580` (voff `56`)
- impl call `0x10734618` obj `*(r3-in+0x4)` slot `52` arg4 `sp-0x147c`
- impl call `0x107346a0` obj `*(sp-0x14b0+0x14ac)` slot `12` arg4 `?`
- req vcall `0x107345c0` slot `8` (parse)

- fn 0x10734404 @ 0x10734404 — action wrapper handler
- @ 0x10f11580 — action dispatch table entry
- fn 0x1073505c — alarm impl = service vtable 0x10f11530 slot +0x34 (ctor stores svc vptr at svc+4)

</details>

### `DestroyAlarm`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Deletes the alarm with the given ID (an AssignedID previously returned by CreateAlarm, or an id from ListAlarms). Returns nothing; the change shows up in AlarmListVersion.

**Technical description:** Deletes alarm ID via impl->v\[+0x3c\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ID` | numeric argument (24-byte record) | yes | alarm id allocated at CreateAlarm / u32 id space | none; required input |

- **`ID`** — Alarm id to destroy
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x18`

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10734954 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x3c\]
<details><summary>Evidence (1)</summary>

- fn 0x10734954 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x3c\]
<details><summary>Evidence (1)</summary>

- fn 0x10734954 — member vfunc calls: \['*(r30+4) v\[+0x3c\]'\]

</details>


#### Side effects

- state mutation delegated to *(impl+0x4)->v\[+0x3c\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x3c\]
<details><summary>Evidence (1)</summary>

- fn 0x10734954 — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x3c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10734954 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10734954 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`vret(*(r3-in+0x4),+0x3c)`** `strong`

alarm-store vfunc 0x1027b134 (slot +0x3c) domain: accumulator r31 = remove-call result only (f_1027a8f8 / f_1027f94c) - no literal fault code observed

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** rc is fully call-derived
**Bounded unknown — unresolved:** remove/commit worker rc domain | commit chain: f_1027a8f8 -> f_1027f94c persist writer (rc = inner-call result, no literal faults observed)

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10734954`
- dispatch entry `0x10f1158c` (voff `64`)
- impl call `0x107349d0` obj `*(r3-in+0x4)` slot `60` arg4 `*(sp-0x30+0x18)`
- impl call `0x10734a34` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x107349b0` slot `8` (parse)

- fn 0x10734954 @ 0x10734954 — action wrapper handler
- @ 0x10f1158c — action dispatch table entry
- fn 0x107346ac — alarm impl = service vtable 0x10f11530 slot +0x3c (ctor stores svc vptr at svc+4)

</details>

### `GetDailyIndexRefreshTime`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns the 'HH:MM:SS' local time at which the player rebuilds the local music-library index each day.

**Technical description:** Returns CurrentDailyIndexRefreshTime via impl->v\[+0x8\].

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentDailyIndexRefreshTime` | response field | HH:MM:SS time string / per the response writer |

- **`CurrentDailyIndexRefreshTime`** — Configured daily index refresh time
  - validation: emitted via response vfuncs

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10734d18 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0x44\]
<details><summary>Evidence (1)</summary>

- fn 0x10734d18 — req-vfunc call map: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x44\]
<details><summary>Evidence (1)</summary>

- fn 0x10734d18 — member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x44\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x44\] -> out-arg via req->v\[+0x24\]); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x44\]
<details><summary>Evidence (1)</summary>

- fn 0x10734d18 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x44\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10734d18 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10734d18 — commit/fault slot usage: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`vret`** `strong`

alarm-store vfunc 0x102730fc (slot +0x44) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store level (wrapper parse failures may still fault 402 earlier)

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10734d18`
- dispatch entry `0x10f11598` (voff `76`)
- impl call `0x10734d50` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10734d74` obj `*(r3-in+0x4)` slot `68` arg4 `sp-0x20`
- impl call `0x10734d90` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0x44)`
- impl call `0x10734df4` obj `vret(*(sp-0x30+0x2c),+0x24)` slot `16` arg4 `sp+0x10`
- req vcall `0x10734e08` slot `12` (commit)

- fn 0x10734d18 @ 0x10734d18 — action wrapper handler
- @ 0x10f11598 — action dispatch table entry
- fn 0x10734b8c — alarm impl = service vtable 0x10f11530 slot +0x44 (ctor stores svc vptr at svc+4)

</details>

### `GetFormat`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns the player's time and date display preferences (e.g. 12h vs 24h clock).

**Technical description:** Returns CurrentTimeFormat/CurrentDateFormat via impl->v\[+0x8\].

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentTimeFormat` | response field | format enum string / per the response writer |
| `CurrentDateFormat` | response field | format enum string / per the response writer |

- **`CurrentTimeFormat`** — Configured time format
  - validation: emitted via response vfuncs
- **`CurrentDateFormat`** — Configured date format
  - validation: emitted via response vfuncs

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10734f28 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×2, raise-fault×1, out-arg write×2, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x10734f28 — req-vfunc call map: {'0x14': 1, '0x24': 2, '0x10': 2, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x10734f28 — member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+0xc\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x0c\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0xc\]
<details><summary>Evidence (1)</summary>

- fn 0x10734f28 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+0xc\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10734f28 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10734f28 — commit/fault slot usage: {'0x14': 1, '0x24': 2, '0x10': 2, '0xc': 1}

</details>


#### Errors

**`vret`** `strong`

alarm-store vfunc 0x10272f90 (slot +0xc) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store level (wrapper parse failures may still fault 402 earlier)

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10734f28`
- dispatch entry `0x10f115a4` (voff `16`)
- impl call `0x10734f60` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10734f8c` obj `*(r3-in+0x4)` slot `12` arg4 `sp-0x1c`
- impl call `0x10734fa8` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0xc)`
- impl call `0x1073500c` obj `vret(*(sp-0x30+0x2c),+0x24)` slot `16` arg4 `sp+0x14`
- impl call `0x1073503c` obj `vret(*(sp-0x30+0x2c),+0x24)` slot `16` arg4 `sp+0x18`
- req vcall `0x10735050` slot `12` (commit)

- fn 0x10734f28 @ 0x10734f28 — action wrapper handler
- @ 0x10f115a4 — action dispatch table entry
- fn 0x10733c8c — alarm impl = service vtable 0x10f11530 slot +0x0c (ctor stores svc vptr at svc+4)

</details>

### `GetHouseholdTimeAtStamp`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Converts a monotonically-increasing household timestamp (as used in event and queue bookkeeping) into an absolute UTC time.

**Technical description:** Converts TimeStamp to household UTC time via impl->v\[+0x2c\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `TimeStamp` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 63 chars | none; required input |

- **`TimeStamp`** — UTC timestamp to convert
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x40`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `HouseholdUTCTime` | response field | timestamp string / per the response writer |

- **`HouseholdUTCTime`** — Household-local time at the stamp
  - validation: emitted via response vfuncs

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10733fb4 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x2c\]
<details><summary>Evidence (1)</summary>

- fn 0x10733fb4 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x2c\]
<details><summary>Evidence (1)</summary>

- fn 0x10733fb4 — member vfunc calls: \['*(r30+4) v\[+0x2c\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x2c\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x2c\]
<details><summary>Evidence (1)</summary>

- fn 0x10733fb4 — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x2c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10733fb4 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10733fb4 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`401`** `strong`

alarm-store vfunc 0x10272f70 (slot +0x2c) is a 4-insn stub "li r3,0x191; blr" - validly parsed calls always fault 401; malformed requests may still fail earlier at wrapper parse

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10733fb4`
- dispatch entry `0x10f115b0` (voff `48`)
- impl call `0x1073403c` obj `*(r3-in+0x4)` slot `44` arg4 `sp-0x54`
- impl call `0x107340bc` obj `vret(*(sp-0x80+0x7c),+0x24)` slot `16` arg4 `sp+0x18`
- impl call `0x107340d0` obj `*(sp-0x80+0x7c)` slot `12` arg4 `?`
- req vcall `0x10734014` slot `8` (parse)

- fn 0x10733fb4 @ 0x10733fb4 — action wrapper handler
- @ 0x10f115b0 — action dispatch table entry
- fn 0x10733e98 — alarm impl = service vtable 0x10f11530 slot +0x2c (ctor stores svc vptr at svc+4)

</details>

### `GetTimeNow`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns the player's current UTC time, local time, time zone and TimeGeneration (a counter that increments whenever the household clock is set - useful for detecting clock changes).

**Technical description:** Returns CurrentUTCTime/CurrentLocalTime/CurrentTimeZone/CurrentTimeGeneration via impl->v\[+0x8\].

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentUTCTime` | response field | ISO time string / per the response writer |
| `CurrentLocalTime` | response field | local time string / per the response writer |
| `CurrentTimeZone` | response field | active timezone name/index from the timezone record / per the response writer |
| `CurrentTimeGeneration` | unsigned int32 | u32 generation counter of the time settings / per the response writer |

- **`CurrentUTCTime`** — Current UTC timestamp written to the response
  - validation: emitted via response vfuncs
- **`CurrentLocalTime`** — Current local time written to the response
  - validation: emitted via response vfuncs
- **`CurrentTimeZone`** — Time response field CurrentTimeZone
  - validation: emitted via response vfuncs
- **`CurrentTimeGeneration`** — Time response field CurrentTimeGeneration
  - validation: emitted via response vfuncs

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x1073505c — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×3, raise-fault×1, out-arg write×4, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x1073505c — req-vfunc call map: {'0x14': 1, '0x24': 4, '0x10': 3, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x1073505c — member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+?\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[...\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x1073505c — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x1073505c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x1073505c — commit/fault slot usage: {'0x14': 1, '0x24': 4, '0x10': 3, '0xc': 1}

</details>


#### Errors

**`vret`** `strong`

alarm-store vfunc 0x10273340 (slot +0x30) has two literal exits: 800 on the household-time query failure path (li r3,0x320 at 0x102733f0) and 0 on success (0x1027352c); call-derived paths in between remain possible

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** literal exits {800, 0} identified in store vfunc
**Bounded unknown — unresolved:** whether any call-derived exit can produce a third code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073505c`
- dispatch entry `0x10f115bc` (voff `52`)
- impl call `0x10735094` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x107350cc` obj `*(r3-in+0x4)` slot `48` arg4 `sp-0x5c`
- impl call `0x107350e8` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0x30)`
- impl call `0x1073514c` obj `vret(*(sp-0x70+0x6c),+0x24)` slot `16` arg4 `sp+0x14`
- impl call `0x1073517c` obj `vret(*(sp-0x70+0x6c),+0x24)` slot `16` arg4 `sp+0x28`
- impl call `0x107351ac` obj `vret(*(sp-0x70+0x6c),+0x24)` slot `16` arg4 `sp+0x3c`
- req vcall `0x107351e4` slot `12` (commit)

- fn 0x1073505c @ 0x1073505c — action wrapper handler
- @ 0x10f115bc — action dispatch table entry
- fn 0x10733fb4 — alarm impl = service vtable 0x10f11530 slot +0x30 (ctor stores svc vptr at svc+4)

</details>

### `GetTimeServer`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns the configured household time-server address used to keep zone clocks in sync.

**Technical description:** Returns CurrentTimeServer via impl->v\[+0x8\].

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentTimeServer` | response field | hostname/IP string / per the response writer |

- **`CurrentTimeServer`** — Configured NTP time server
  - validation: emitted via response vfuncs

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10734c1c — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0x24\]
<details><summary>Evidence (1)</summary>

- fn 0x10734c1c — req-vfunc call map: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x24\]
<details><summary>Evidence (1)</summary>

- fn 0x10734c1c — member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x24\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x24\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x24\]
<details><summary>Evidence (1)</summary>

- fn 0x10734c1c — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x24\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10734c1c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10734c1c — commit/fault slot usage: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`vret`** `strong`

alarm-store vfunc 0x10273090 (slot +0x24) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store level (wrapper parse failures may still fault 402 earlier)

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10734c1c`
- dispatch entry `0x10f115c8` (voff `40`)
- impl call `0x10734c54` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10734c78` obj `*(r3-in+0x4)` slot `36` arg4 `sp-0x98`
- impl call `0x10734c94` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0x24)`
- impl call `0x10734cf8` obj `vret(*(sp-0xb0+0xac),+0x24)` slot `16` arg4 `sp+0x18`
- req vcall `0x10734d0c` slot `12` (commit)

- fn 0x10734c1c @ 0x10734c1c — action wrapper handler
- @ 0x10f115c8 — action dispatch table entry
- fn 0x10733da8 — alarm impl = service vtable 0x10f11530 slot +0x24 (ctor stores svc vptr at svc+4)

</details>

### `GetTimeZone`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns the current time zone index and whether DST is auto-adjusted. Use GetTimeZoneRule to resolve the index to a tz rule string.

**Technical description:** Returns Index/AutoAdjustDst via impl->v\[+0x8\].

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Index` | signed int32 | u32 timezone-table index / per the response writer |
| `AutoAdjustDst` | boolean ('0'/'1') | DST auto-adjust flag from the timezone record / per the response writer |

- **`Index`** — Timezone response field Index
  - validation: emitted via response vfuncs
- **`AutoAdjustDst`** — Timezone response field AutoAdjustDst
  - validation: emitted via response vfuncs

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10734e14 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, out-arg write×2, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x10734e14 — req-vfunc call map: {'0x14': 1, '0x24': 2, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x10734e14 — member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x14\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x14\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x14\]
<details><summary>Evidence (1)</summary>

- fn 0x10734e14 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x14\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10734e14 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10734e14 — commit/fault slot usage: {'0x14': 1, '0x24': 2, '0xc': 1}

</details>


#### Errors

**`vret`** `strong`

alarm-store vfunc 0x10273020 (slot +0x14) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store level (wrapper parse failures may still fault 402 earlier)

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10734e14`
- dispatch entry `0x10f115d4` (voff `24`)
- impl call `0x10734e4c` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10734e70` obj `*(r3-in+0x4)` slot `20` arg4 `sp-0x18`
- impl call `0x10734e8c` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0x14)`
- req vcall `0x10734f1c` slot `12` (commit)

- fn 0x10734e14 @ 0x10734e14 — action wrapper handler
- @ 0x10f115d4 — action dispatch table entry
- fn 0x107342f0 — alarm impl = service vtable 0x10f11530 slot +0x14 (ctor stores svc vptr at svc+4)

</details>

### `GetTimeZoneAndRule`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Same as GetTimeZone but also returns the resolved CurrentTimeZone rule string in one call.

**Technical description:** Returns Index/AutoAdjustDst/CurrentTimeZone via impl->v\[+0x8\].

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Index` | signed int32 | u32 timezone-table index / per the response writer |
| `AutoAdjustDst` | boolean ('0'/'1') | DST auto-adjust flag 0/1 / per the response writer |
| `CurrentTimeZone` | response field | active timezone name from the record / per the response writer |

- **`Index`** — Timezone response field Index
  - validation: emitted via response vfuncs
- **`AutoAdjustDst`** — Timezone response field AutoAdjustDst
  - validation: emitted via response vfuncs
- **`CurrentTimeZone`** — Timezone response field CurrentTimeZone
  - validation: emitted via response vfuncs

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10734a40 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×3, commit×1); member delegates: r4 v\[+0x8\], *(r30+4) v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x10734a40 — req-vfunc call map: {'0x14': 1, '0x24': 3, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x10734a40 — member vfunc calls: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x18\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x18\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], *(r30+4) v\[+0x18\]
<details><summary>Evidence (1)</summary>

- fn 0x10734a40 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', '*(r30+4) v\[+0x18\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10734a40 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10734a40 — commit/fault slot usage: {'0x14': 1, '0x24': 3, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`vret`** `strong`

alarm-store vfunc 0x102731b4 (slot +0x18) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store level (wrapper parse failures may still fault 402 earlier)

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10734a40`
- dispatch entry `0x10f115e0` (voff `28`)
- impl call `0x10734a78` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10734aa4` obj `*(r3-in+0x4)` slot `24` arg4 `sp-0x38`
- impl call `0x10734ac0` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0x18)`
- impl call `0x10734b6c` obj `vret(*(sp-0x50+0x4c),+0x24)` slot `16` arg4 `sp+0x1c`
- req vcall `0x10734b80` slot `12` (commit)

- fn 0x10734a40 @ 0x10734a40 — action wrapper handler
- @ 0x10f115e0 — action dispatch table entry
- fn 0x10734e14 — alarm impl = service vtable 0x10f11530 slot +0x18 (ctor stores svc vptr at svc+4)

</details>

### `GetTimeZoneRule`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Looks up a time zone rule string (POSIX-style TZ spec) by Index.

**Technical description:** Returns the TimeZone rule for Index via impl->v\[+0x1c\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Index` | numeric argument (24-byte record) | yes | table index / u32 index | none; required input |

- **`Index`** — Timezone-table index to query
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `TimeZone` | response field | timezone rule entry / per the response writer |

- **`TimeZone`** — Timezone rule string at the requested index
  - validation: emitted via response vfuncs

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x107341cc — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x1c\]
<details><summary>Evidence (1)</summary>

- fn 0x107341cc — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x1c\]
<details><summary>Evidence (1)</summary>

- fn 0x107341cc — member vfunc calls: \['*(r30+4) v\[+0x1c\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x1c\] -> out-arg); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x1c\]
<details><summary>Evidence (1)</summary>

- fn 0x107341cc — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x1c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x107341cc — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x107341cc — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`vret(*(r3-in+0x4),+0x1c)`** `strong`

alarm-store vfunc 0x10273280 (slot +0x1c) is single-exit "li r3,0; blr" - cannot produce a nonzero rc; valid calls always succeed at store level (wrapper parse failures may still fault 402 earlier)

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107341cc`
- dispatch entry `0x10f115ec` (voff `32`)
- impl call `0x10734250` obj `*(r3-in+0x4)` slot `28` arg4 `*(sp-0x50+0x18)`
- impl call `0x107342d0` obj `vret(*(sp-0x50+0x4c),+0x24)` slot `16` arg4 `sp+0x1c`
- impl call `0x107342e4` obj `*(sp-0x50+0x4c)` slot `12` arg4 `?`
- req vcall `0x10734228` slot `8` (parse)

- fn 0x107341cc @ 0x107341cc — action wrapper handler
- @ 0x10f115ec — action dispatch table entry
- fn 0x10734a40 — alarm impl = service vtable 0x10f11530 slot +0x1c (ctor stores svc vptr at svc+4)

</details>

### `ListAlarms`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Returns the full alarm list as an XML document plus CurrentAlarmListVersion. The version counter is the cheap way to poll for changes; it is also evented.

**Technical description:** Lists all alarms via impl->v\[+0x8\].

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `CurrentAlarmList` | response field | impl-produced / per the parser/emitter |
| `CurrentAlarmListVersion` | response field | impl-produced / per the parser/emitter |

- **`CurrentAlarmList`** — serialized XML list of all registered alarms, emitted via req->v\[+0x24\] inside the alarm-list serializer
  - validation: arg-name string 'out' loaded at 0x102735bc inside f_10273538
  - producer binding: handler calls *(req+0xc)->v\[+0x08\] twice; f_10273538 is one of the two binary producers of this arg name — exact variant not resolved
- **`CurrentAlarmListVersion`** — version tag emitted right after CurrentAlarmList by the same serializer
  - validation: arg-name string 'out' loaded at 0x102735e0 inside f_10273538
  - emitted via req->v\[+0x24\] at 0x102735e8 inside f_10273538

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10734b8c — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (validate×1); member delegates: r4 v\[+0x3c\], *(r30+0xc) v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x10734b8c — req-vfunc call map: {'0x8': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x3c\], *(r30+0xc) v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x10734b8c — member vfunc calls: \['r4 v\[+0x3c\]', '*(r30+0xc) v\[+0x8\]'\]

</details>


#### Side effects

- read-only query: read-only query delegate on alarm-store member (*(impl+0xc)->v\[+0x08\] (alarm-store member serialize)); result emitted via out-arg; no state mutation in impl path

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x3c\], *(r30+0xc) v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x10734b8c — no transition-literal/store pattern; member delegates: \['r4 v\[+0x3c\]', '*(r30+0xc) v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10734b8c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10734b8c — commit/fault slot usage: {'0x8': 1}

</details>


#### Errors

**`vret`** `strong`

nonzero impl rc forwarded verbatim as the fault code (CR-return convention); recovered impl-side constants {402 impl-internal fault sites observed}

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10734b8c`
- dispatch entry `0x10f115f8` (voff `68`)
- impl call `0x10734c18` obj `*(*(sp-0x20+0x18)+0xc)` slot `8` arg4 `*(sp-0x20+0x1c)`
- req vcall `0x10734bb8` slot `60` (other)
- req vcall `0x10734bcc` slot `8` (parse)

- fn 0x10734b8c @ 0x10734b8c — action wrapper handler
- @ 0x10f115f8 — action dispatch table entry
- @ 0x10734c18 — impl dispatch site: *(*(req+0xc))->v\[+0x08\]

</details>

### `SetDailyIndexRefreshTime`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Changes the daily library-index refresh time ('HH:MM:SS').

**Technical description:** Sets the daily music-index refresh time via impl->v\[+0x40\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredDailyIndexRefreshTime` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 8 chars | none; required input |

- **`DesiredDailyIndexRefreshTime`** — Daily index refresh time to set (HH:MM:SS)
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x9`

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x107340dc — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x40\]
<details><summary>Evidence (1)</summary>

- fn 0x107340dc — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x40\]
<details><summary>Evidence (1)</summary>

- fn 0x107340dc — member vfunc calls: \['*(r30+4) v\[+0x40\]'\]

</details>


#### Side effects

- state mutation delegated to *(impl+0x4)->v\[+0x40\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x40\]
<details><summary>Evidence (1)</summary>

- fn 0x107340dc — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x40\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x107340dc — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x107340dc — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`vret(*(r3-in+0x4),+0x40)`** `strong`

alarm-store vfunc 0x1027d0c4 (slot +0x40) domain: literal 402 gate (0x1027d1f0) plus derived accumulator r30

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** literal 402 + derived
**Bounded unknown — unresolved:** store worker rc domain

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107340dc`
- dispatch entry `0x10f11604` (voff `72`)
- impl call `0x1073415c` obj `*(r3-in+0x4)` slot `64` arg4 `sp-0x20`
- impl call `0x107341c0` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x1073413c` slot `8` (parse)

- fn 0x107340dc @ 0x107340dc — action wrapper handler
- @ 0x10f11604 — action dispatch table entry
- fn 0x10734954 — alarm impl = service vtable 0x10f11530 slot +0x40 (ctor stores svc vptr at svc+4)

</details>

### `SetFormat`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Sets the 12/24-hour time format and the date format.

**Technical description:** Sets DesiredTimeFormat/DesiredDateFormat via impl->v\[+0x8\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredTimeFormat` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 3 chars | none; required input |
| `DesiredDateFormat` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 3 chars | none; required input |

- **`DesiredTimeFormat`** — Time format to set
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x4`
- **`DesiredDateFormat`** — Date format to set
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x4`

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10733c8c — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x10733c8c — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x10733c8c — member vfunc calls: \['*(r30+4) v\[+0x8\]'\]

</details>


#### Side effects

- state mutation delegated to *(impl+0x4)->v\[+0x08\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x8\]
<details><summary>Evidence (1)</summary>

- fn 0x10733c8c — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10733c8c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10733c8c — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`vret(*(r3-in+0x4),+0x8)`** `strong`

alarm-store vfunc 0x1027a410 (slot +0x8) domain: accumulator r31 in {0, call result} - DesiredFormat strings validated via five strcmp gates, then stored via strlcpy; no literal fault exit observed

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** strcmp validation gates present; r31 domain {0, call-derived}
**Bounded unknown — unresolved:** which code (if any) the reject path produces - likely 402 via accumulator

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`401`** `strong`

format-string validation gate

- format-string validation gate


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10733c8c`
- dispatch entry `0x10f11610` (voff `12`)
- impl call `0x10733d38` obj `*(r3-in+0x4)` slot `8` arg4 `sp-0x1c`
- impl call `0x10733d9c` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10733d14` slot `8` (parse)

- fn 0x10733c8c @ 0x10733c8c — action wrapper handler
- @ 0x10f11610 — action dispatch table entry
- fn 0x10733b44 — alarm impl = service vtable 0x10f11530 slot +0x08 (ctor stores svc vptr at svc+4)

</details>

### `SetTimeNow`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Sets the player's clock: DesiredTime is UTC 'HH:MM:SS'-style time plus a time zone so the local offset can be derived. Setting the clock bumps TimeGeneration.

**Technical description:** Sets the household clock: DesiredTime + TimeZoneForDesiredTime via impl->v\[+0x28\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredTime` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 19 chars | none; required input |
| `TimeZoneForDesiredTime` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 28 chars | none; required input |

- **`DesiredTime`** — UTC time to set
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x14`
- **`TimeZoneForDesiredTime`** — Timezone applying to DesiredTime
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x1d`

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10733e98 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x28\]
<details><summary>Evidence (1)</summary>

- fn 0x10733e98 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x28\]
<details><summary>Evidence (1)</summary>

- fn 0x10733e98 — member vfunc calls: \['*(r30+4) v\[+0x28\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x28\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x28\]
<details><summary>Evidence (1)</summary>

- fn 0x10733e98 — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x28\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10733e98 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10733e98 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`401`** `strong`

alarm-store vfunc 0x10272f60 (slot +0x28) is a 4-insn stub "li r3,0x191; blr" - validly parsed calls always fault 401; malformed requests may still fail earlier at wrapper parse

- the impl vfunc produced a nonzero code

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10733e98`
- dispatch entry `0x10f1161c` (voff `44`)
- impl call `0x10733f44` obj `*(r3-in+0x4)` slot `40` arg4 `sp-0x48`
- impl call `0x10733fa8` obj `*(sp-0x60+0x5c)` slot `12` arg4 `402`
- req vcall `0x10733f20` slot `8` (parse)

- fn 0x10733e98 @ 0x10733e98 — action wrapper handler
- @ 0x10f1161c — action dispatch table entry
- fn 0x10734c1c — alarm impl = service vtable 0x10f11530 slot +0x28 (ctor stores svc vptr at svc+4)

</details>

### `SetTimeServer`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Sets the address of the household time server (host/IP used for clock sync).

**Technical description:** Sets the NTP time server via impl->v\[+0x20\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `DesiredTimeServer` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 128 chars | none; required input |

- **`DesiredTimeServer`** — NTP server to set
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x81`

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x10733da8 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x20\]
<details><summary>Evidence (1)</summary>

- fn 0x10733da8 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x20\]
<details><summary>Evidence (1)</summary>

- fn 0x10733da8 — member vfunc calls: \['*(r30+4) v\[+0x20\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x20\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x20\]
<details><summary>Evidence (1)</summary>

- fn 0x10733da8 — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x20\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x10733da8 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x10733da8 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`vret(*(r3-in+0x4),+0x20)`** `strong`

alarm-store vfunc 0x1027a64c (slot +0x20) domain: accumulator r29/r30 seeded from arg/call results - no literal fault exit observed

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** rc call-derived
**Bounded unknown — unresolved:** lookup/store worker rc domain

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10733da8`
- dispatch entry `0x10f11628` (voff `36`)
- impl call `0x10733e28` obj `*(r3-in+0x4)` slot `32` arg4 `sp-0x98`
- impl call `0x10733e8c` obj `*(sp-0xb0+0xac)` slot `12` arg4 `402`
- req vcall `0x10733e08` slot `8` (parse)

- fn 0x10733da8 @ 0x10733da8 — action wrapper handler
- @ 0x10f11628 — action dispatch table entry
- fn 0x107341cc — alarm impl = service vtable 0x10f11530 slot +0x20 (ctor stores svc vptr at svc+4)

</details>

### `SetTimeZone`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Selects the time zone by Index and toggles automatic DST adjustment.

**Technical description:** Sets timezone Index/AutoAdjustDst via impl->v\[+0x10\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Index` | numeric argument (24-byte record) | yes | table index / u32 index | none; required input |
| `AutoAdjustDst` | boolean/numeric flag | yes | 0/1 flag / 0/1 | none; required input |

- **`Index`** — Timezone-table index to activate
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x18`
- **`AutoAdjustDst`** — DST auto-adjust flag
  - validation: stored in the timezone record
  - buffer cap: `0x18`

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x107342f0 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x107342f0 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x107342f0 — member vfunc calls: \['*(r30+4) v\[+0x10\]'\]

</details>


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x10\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x10\]
<details><summary>Evidence (1)</summary>

- fn 0x107342f0 — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x10\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x107342f0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x107342f0 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`vret(*(r3-in+0x4),+0x10)`** `strong`

alarm-store vfunc 0x1027cf5c (slot +0x10) domain: literal 402 (li r3,0x192 at 0x1027cf88) plus call-derived accumulator paths (r29/r30 from call results)

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** literal 402 exit + derived paths
**Bounded unknown — unresolved:** call-derived rc values from lookup/strlcpy chain

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107342f0`
- dispatch entry `0x10f11634` (voff `20`)
- impl call `0x10734394` obj `*(r3-in+0x4)` slot `16` arg4 `*(sp-0x30+0x18)`
- impl call `0x107343f8` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10734370` slot `8` (parse)

- fn 0x107342f0 @ 0x107342f0 — action wrapper handler
- @ 0x10f11634 — action dispatch table entry
- fn 0x10734f28 — alarm impl = service vtable 0x10f11530 slot +0x10 (ctor stores svc vptr at svc+4)

</details>

### `UpdateAlarm`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `virtual`

Edits an existing alarm in place. ID is the AssignedID from CreateAlarm or ListAlarms; the remaining arguments carry the complete replacement definition (same fields as CreateAlarm), so callers should send the full record rather than a diff.

**Technical description:** Updates an existing alarm by ID with the same field set via impl->v\[+0x38\].

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ID` | numeric argument (24-byte record) | yes | existing alarm id / u32 id space | none; required input |
| `StartLocalTime` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 8 chars | none; required input |
| `Duration` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 8 chars | none; required input |
| `Recurrence` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 10 chars | none; required input |
| `Enabled` | boolean/numeric flag | yes | 0/1 flag / 0/1 | none; required input |
| `RoomUUID` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 24 chars | none; required input |
| `ProgramURI` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 1024 chars | none; required input |
| `ProgramMetaData` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 4096 chars | none; required input |
| `PlayMode` | string argument | yes | string within the request parse cap; impl-side grammar applies / max 31 chars | none; required input |
| `Volume` | signed int32 | yes | u16 volume (0-100 scale convention) / parsed integer; stored on the alarm record | none; required input |
| `IncludeLinkedZones` | boolean/numeric flag | yes | 0/1 flag / 0/1 | none; required input |

- **`ID`** — Alarm id to update
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x18`
- **`StartLocalTime`** — Alarm-record field StartLocalTime
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x9`
- **`Duration`** — Alarm-record field Duration
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x9`
- **`Recurrence`** — Alarm-record field Recurrence
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0xb`
- **`Enabled`** — Alarm enable flag
  - validation: stored in the alarm record
  - buffer cap: `0x18`
- **`RoomUUID`** — Alarm-record field RoomUUID
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x19`
- **`ProgramURI`** — Alarm-record field ProgramURI
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x401`
- **`ProgramMetaData`** — Alarm-record field ProgramMetaData
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x1001`
- **`PlayMode`** — Alarm-record field PlayMode
  - validation: consumed by impl vfunc on the service vtable
  - buffer cap: `0x20`
- **`Volume`** — Alarm playback volume
  - validation: stored in the alarm record
  - buffer cap: `0x18`
- **`IncludeLinkedZones`** — Extend the alarm across linked zones
  - validation: stored in the alarm record
  - buffer cap: `0x18`

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details><summary>Evidence (1)</summary>

- @ 0x107346ac — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×11, validate×1, commit×1); member delegates: *(r30+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x107346ac — req-vfunc call map: {'0x1c': 11, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): *(r30+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x107346ac — member vfunc calls: \['*(r30+4) v\[+?\]'\]

</details>


#### Side effects

- state mutation delegated to *(impl+0x4)->v\[...\]; impl parses args then commits via req->v\[+0x0c\]

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+?\]
<details><summary>Evidence (1)</summary>

- fn 0x107346ac — no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details><summary>Evidence (1)</summary>

- fn 0x107346ac — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details><summary>Evidence (1)</summary>

- fn 0x107346ac — commit/fault slot usage: {'0x1c': 11, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`vret(*(r3-in+0x4),+0x38)`** `strong`

alarm-store vfunc 0x1027ac80 (slot +0x38) domain: literal 402 gate (0x1027ad34) plus accumulator r31 seeded from arg r5 / call results

- the impl vfunc produced a nonzero code


**Bounded unknown — proven:** literal 402 exit + derived paths
**Bounded unknown — unresolved:** update worker rc domain (f_10273bb8/f_10273ac0 field setters, f_1027a8f8 commit) | commit chain: f_1027a8f8 -> f_1027f94c persist writer (rc = inner-call result, no literal faults observed)

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


<details><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x107346ac`
- dispatch entry `0x10f11640` (voff `60`)
- impl call `0x107348e4` obj `*(r3-in+0x4)` slot `56` arg4 `*(sp-0x14b0+0x30)`
- impl call `0x10734948` obj `*(sp-0x14b0+0x14ac)` slot `12` arg4 `402`
- req vcall `0x1073488c` slot `8` (parse)

- fn 0x107346ac @ 0x107346ac — action wrapper handler
- @ 0x10f11640 — action dispatch table entry
- fn 0x10734404 — alarm impl = service vtable 0x10f11530 slot +0x38 (ctor stores svc vptr at svc+4)

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `A_ARG_TYPE_ISO8601Time` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Recurrence` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmID` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmList` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmEnabled` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmProgramURI` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmProgramMetaData` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmPlayMode` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmVolume` | ui2 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmIncludeLinkedZones` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlarmRoomUUID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TimeZoneIndex` | i4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TimeZoneAutoAdjustDst` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TimeZoneInformation` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TimeStamp` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `TimeZone` | string | yes | evented state variable — appears in AlarmClock LastChange/GENA event notifications |
| `TimeServer` | string | yes | evented state variable — appears in AlarmClock LastChange/GENA event notifications |
| `TimeGeneration` | ui4 | yes | evented state variable — appears in AlarmClock LastChange/GENA event notifications |
| `AlarmListVersion` | string | yes | evented state variable — appears in AlarmClock LastChange/GENA event notifications |
| `DailyIndexRefreshTime` | string | yes | evented state variable — appears in AlarmClock LastChange/GENA event notifications |
| `TimeFormat` | string | yes | evented state variable — appears in AlarmClock LastChange/GENA event notifications |
| `DateFormat` | string | yes | evented state variable — appears in AlarmClock LastChange/GENA event notifications |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /AlarmClock/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `alarmClock`, `alarmVersionChange`
- **notify_path:** f_10277d6c initial-state e:property dump {TimeServer, AlarmListVersion, TimeFormat, TimeGeneration, DateFormat} -> f_10676a44 writer
- **payload_model:** e:property doc via f_10676a44 writer family
- **wss_registry:**
  - idx: 5, name: alarmClock, id: 20, tag: 64
  - idx: 6, name: alarmVersionChange, id: 24, tag: 1

## Dispatcher-level errors

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search


Implementation sources (recovered): `zoneplayer/ac_impl.cxx`, `zoneplayer/areas.cxx`

<details><summary>Service evidence (3)</summary>

- @ 0x101953c8 — service router function
- @ 0x10f11530 — service vtable
- @ 0x10733b44 — service dispatcher

</details>
