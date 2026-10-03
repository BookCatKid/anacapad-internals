# `ContentDirectory` — `/MediaServer/ContentDirectory/Control`

**visibility** `advertised` · **status** `strong`

This service is the front door to the speaker's music library — the index it builds from your music shares (a NAS folder, a computer's shared drive) so albums and artists can be browsed without a computer being involved at playback time. Browsing lives here: ask for the children of a folder, a playlist, an artist, and get back tracks and containers with their metadata. So does library maintenance: kicking off a rescan of your shares, forcing a re-sort, checking whether indexing is in progress, and creating or editing library objects. In short, everything the app does under 'Music Library' routes through these commands.

<details markdown="1"><summary><b>Technical details</b></summary>

UPnP ContentDirectory for the local music index: browse, object create/destroy/update, prefix lookups, index refresh/resort and capability getters. impl = content-index subsystem member.

</details>

## Availability

- capability flags `0x20`
- enabled gate: `xor(*(r3-in+0x571c))` at `0x1019567c` (field_inverted)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x20`
- dispatcher `0x10307608` kind `table`
- action table `0x10eb4264`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `Browse` | advertised | callable | `strong` | direct | 402, 701 |
| `CreateObject` | advertised | callable | `strong` | direct | 402 |
| `DestroyObject` | advertised | callable | `strong` | direct | 402 |
| `FindPrefix` | advertised | callable | `strong` | direct | 402, 800 |
| `GetAlbumArtistDisplayOption` | advertised | callable | `strong` | direct | 402 |
| `GetAllPrefixLocations` | advertised | callable | `strong` | direct | 402, 800 |
| `GetBrowseable` | advertised | callable | `strong` | direct | 402 |
| `GetLastIndexChange` | advertised | callable | `strong` | direct | 402 |
| `GetSearchCapabilities` | advertised | callable | `strong` | direct | 402 |
| `GetShareIndexInProgress` | advertised | callable | `strong` | direct | 402 |
| `GetSortCapabilities` | advertised | callable | `strong` | direct | 402 |
| `GetSystemUpdateID` | advertised | callable | `strong` | direct | 402 |
| `RefreshShareIndex` | advertised | callable | `strong` | direct | 402 |
| `RequestResort` | advertised | callable | `strong` | direct | 402 |
| `SetBrowseable` | advertised | callable | `strong` | direct | 402, 800 |
| `UpdateObject` | advertised | callable | `strong` | direct | 402 |

### `Browse`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

The one command that does nearly all library navigation. You name a container — the library root, an artist, a folder, a playlist — and ask for either its own metadata or its children, with a starting offset and a count for paging, plus which fields you want and how to sort. Everything from 'show my albums' to 'list tracks in this playlist' reduces to Browse calls; the app pages through large collections a slice at a time.

<details markdown="1"><summary><b>Technical details</b></summary>

Browse the content directory. Parses all six spec args into a request record (ObjectID/BrowseFlag/Filter/SortCriteria capped 0x400, StartingIndex/RequestedCount via int helper), runs executor f_103042f0 which dispatches on BrowseFlag: BrowseDirectChildren -> children enumeration vfunc v\[+0x28\] on the browse object, BrowseMetadata -> metadata path, anything else -> 402. Result/DIDL is emitted per-item through callback writers f_10306088/0x10306098/0x103060a8 via request v\[+0x24\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | SonosStringArg | yes | unrestricted/impl-validated per 0x103042f0 / <=0x400 chars | none |
| `BrowseFlag` | SonosEnumArg | yes | unrestricted/impl-validated per 0x103042f0 / 2 literals | none |
| `Filter` | SonosStringArg | yes | unrestricted/impl-validated per 0x103042f0 / <=0x400 chars | none |
| `StartingIndex` | SonosUintArg | yes | unrestricted/impl-validated per 0x103042f0 / see impl 0x103042f0 | none |
| `RequestedCount` | SonosUintArg | yes | unrestricted/impl-validated per 0x103042f0 / see impl 0x103042f0 | none |
| `SortCriteria` | SonosStringArg | yes | unrestricted/impl-validated per 0x103042f0 / <=0x400 chars | none |

- **`ObjectID`** — request-layer string/int parsed and handed to media-store impl 0x103042f0
  - special values: impl-defined roots
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`BrowseFlag`** — request-layer string/int parsed and handed to media-store impl 0x103042f0
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`Filter`** — request-layer string/int parsed and handed to media-store impl 0x103042f0
  - special values: * / empty impl-defined
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`StartingIndex`** — request-layer string/int parsed and handed to media-store impl 0x103042f0
  - unit: index
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x18`
- **`RequestedCount`** — request-layer string/int parsed and handed to media-store impl 0x103042f0
  - unit: count
  - special values: 0
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x18`
- **`SortCriteria`** — request-layer string/int parsed and handed to media-store impl 0x103042f0
  - special values: empty string
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Result` | SonosMetaDataArg | unrestricted/impl-validated per 0x103042f0 / response-sized |
| `NumberReturned` | SonosUintArg | unrestricted/impl-validated per 0x103042f0 / 0..N |
| `TotalMatches` | SonosUintArg | unrestricted/impl-validated per 0x103042f0 / 0..N |
| `UpdateID` | SonosUintArg | unrestricted/impl-validated per 0x103042f0 / monotonic counter |

- **`Result`** — produced by impl 0x103042f0 via media-store member this+0x168
  - special values: empty DIDL for empty containers
  - validation: impl-produced
- **`NumberReturned`** — produced by impl 0x103042f0 via media-store member this+0x168
  - unit: count
  - special values: 0 for empty result
  - validation: impl-produced
- **`TotalMatches`** — produced by impl 0x103042f0 via media-store member this+0x168
  - unit: count
  - special values: 0
  - validation: impl-produced
- **`UpdateID`** — produced by impl 0x103042f0 via media-store member this+0x168
  - special values: 0
  - validation: impl-produced

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10306b3c — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (none); member delegates: r4 v\[+0x3c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306b3c — req-vfunc call map: {}

</details>


#### State dependencies

Content-directory index state at browse object +0x168 supplies the UpdateID

#### Side effects

- read-only query delegate: r4 v\[+0x3c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x3c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306b3c — no transition-literal/store pattern; member delegates: \['r4 v\[+0x3c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306b3c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306b3c — commit/fault slot usage: {}

</details>


#### Errors

**`701`** `strong`

impl accumulator r31: {701 when object resolver f_1034a224 fails on ObjectID (preset 0x1030430c), 0 on success, call/lwz-derived}; rc forwarded verbatim via req v\[+0x14\]

- impl/store gate failed


**Bounded unknown — proven:** literal exit paths bounded by accumulator scan
**Bounded unknown — unresolved:** call-derived rc values from worker/delegate chain | resolver f_1034a224 -> f_10349d00 path-walk (ptr/NULL)

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`402`** `confirmed`

invalid BrowseFlag: value is neither "BrowseDirectChildren" nor "BrowseMetadata" (literal strcmp inside executor f_103042f0)

- BrowseFlag fails both strcmps; executor presets r9=0x192
- Any of the six arg parse helpers fails



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10306b3c`
- dispatch entry `0x10eb4264`
- req vcall `0x10306b64` slot `60` (other)
- table entry is a trampoline; real chain: req v\[+0x3c\] then f_10304390 -> shared executor f_103042f0 (BrowseFlag strcmp -> 402, resolver -> 701)

- fn 0x10306b3c @ 0x10306b3c — action wrapper handler
- @ 0x10eb4264 — action dispatch table entry

</details>

### `CreateObject`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Creates a new library object — for example a new playlist container inside the library tree. You give the parent container and the object's details; the library assigns it an ID and returns it.

<details markdown="1"><summary><b>Technical details</b></summary>

Creates a CDS object: ContainerID/Elements -> impl->v\[+0x20\], returning ObjectID/Result.

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ContainerID` | SonosStringArg | yes | unrestricted/impl-validated per 0x103026f8 / max 1023 chars | none - required argument |
| `Elements` | SonosStringArg | yes | unrestricted/impl-validated per 0x103026f8 / max 16383 chars | none - required argument |

- **`ContainerID`** — request-layer string/int parsed and handed to media-store impl 0x103026f8
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`Elements`** — request-layer string/int parsed and handed to media-store impl 0x103026f8
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x4000`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `ObjectID` | SonosStringArg | unrestricted/impl-validated per 0x103026f8 / length-bounded by parse-helper buffer cap |
| `Result` | SonosStringArg | unrestricted/impl-validated per 0x103026f8 / length-bounded by parse-helper buffer cap |

- **`ObjectID`** — produced by impl 0x103026f8 via media-store member this+0x168
  - special values: see impl 0x103026f8
  - validation: impl-produced
- **`Result`** — produced by impl 0x103026f8 via media-store member this+0x168
  - special values: see impl 0x103026f8
  - validation: impl-produced

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10306b84 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×2, raise-fault×1, required-arg fetch×2, out-arg write×2, validate×1, commit×1); member delegates: r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306b84 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 2, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306b84 — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306b84 — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306b84 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306b84 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 2, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl accumulator r29: {710 literal (0x10302800), arg r7-seeded, call/lwz-derived}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

favorites/userradio store-commit layer (dirObjFavorites vfunc -> f_10384490 userradio.xml atomic save): reachable codes {402,501,701,702,803,805,806,807}. Proven rungs in f_10384490: 805 = store count field *(ctx+0x20)>=70 (favorites cap); 806 = ftell()>0x20000 (serialized XML >128KiB); 807 = phase *(ctx+0x1c)>=6 with flag +0x30; 803 = phase *(ctx+0x1c)<2; 702 = flag *(ctx+0x2e); 501 = .tmp open failure; 402/701 = arg/resolver gates. Internal error strings (Invalid favorite id / Could not access favorites / initContentResource parse URI,extract item ID,Invalid item ID,No valid mapping for item type / Failed to parse account service ID) collapse into this rc domain on the wire. Applies when the ObjectID resolves into the favorites/userradio directory (FV:/R: prefixes).

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved

indirect dirObj-vfunc edge - bl-scan cannot see it; vtable xref proves reachability



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10306b84`
- dispatch entry `0x10eb4270`
- impl call `0x10306c50` obj `r5-in` slot `32` arg4 `sp+0x1c`
- impl call `0x10306cd8` obj `vret(*(*(sp+0x0)+0xfffffffc),+0x24)` slot `16` arg4 `*(sp+0x0)+0x41c`
- impl call `0x10306d08` obj `vret(*(*(sp+0x0)+0xfffffffc),+0x24)` slot `16` arg4 `*(sp+0x0)+0x481c`
- impl call `0x10306d1c` obj `*(*(sp+0x0)+0xfffffffc)` slot `12` arg4 `?`
- req vcall `0x10306c1c` slot `8` (parse)

- fn 0x10306b84 @ 0x10306b84 — action wrapper handler
- @ 0x10eb4270 — action dispatch table entry

</details>

### `DestroyObject`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Deletes a library object by ID — removing a playlist or another entry from the library tree. Removing a playlist or another entry from the library tree by its ID.

<details markdown="1"><summary><b>Technical details</b></summary>

Destroys ObjectID via impl->v\[+0x28\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | SonosStringArg | yes | unrestricted/impl-validated per 0x10302834 / max 1023 chars | none - required argument |

- **`ObjectID`** — request-layer string/int parsed and handed to media-store impl 0x10302834
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10306e70 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x28\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306e70 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x28\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306e70 — member vfunc calls: \['r30 v\[+0x28\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x28\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x28\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306e70 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x28\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306e70 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306e70 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl accumulator r30: {701 on object-resolve failure (0x10302858), call/lwz-derived}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

favorites/userradio store-commit layer (dirObjFavorites vfunc -> f_10384490 userradio.xml atomic save): reachable codes {402,501,701,702,803,805,806,807}. Proven rungs in f_10384490: 805 = store count field *(ctx+0x20)>=70 (favorites cap); 806 = ftell()>0x20000 (serialized XML >128KiB); 807 = phase *(ctx+0x1c)>=6 with flag +0x30; 803 = phase *(ctx+0x1c)<2; 702 = flag *(ctx+0x2e); 501 = .tmp open failure; 402/701 = arg/resolver gates. Internal error strings (Invalid favorite id / Could not access favorites / initContentResource parse URI,extract item ID,Invalid item ID,No valid mapping for item type / Failed to parse account service ID) collapse into this rc domain on the wire. Applies when the ObjectID resolves into the favorites/userradio directory (FV:/R: prefixes).

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved

indirect dirObj-vfunc edge - bl-scan cannot see it; vtable xref proves reachability



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10306e70`
- dispatch entry `0x10eb427c`
- impl call `0x10306ef0` obj `r5-in` slot `40` arg4 `sp-0x414`
- impl call `0x10306f54` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x10306ed0` slot `8` (parse)

- fn 0x10306e70 @ 0x10306e70 — action wrapper handler
- @ 0x10eb427c — action dispatch table entry

</details>

### `FindPrefix`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Locates items in a container whose titles start with a given prefix — the backing operation for alphabet-jump scrolling in a long list: 'take me to the S's'. It returns the index where matches begin.

<details markdown="1"><summary><b>Technical details</b></summary>

Finds Prefix under ObjectID, returning StartingIndex/UpdateID via impl->v\[+0x18\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | SonosStringArg | yes | unrestricted/impl-validated per 0x10302d78 / max 1023 chars | none - required argument |
| `Prefix` | SonosStringArg | yes | unrestricted/impl-validated per 0x10302d78 / max 1023 chars | none - required argument |

- **`ObjectID`** — request-layer string/int parsed and handed to media-store impl 0x10302d78
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`Prefix`** — request-layer string/int parsed and handed to media-store impl 0x10302d78
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `StartingIndex` | unsigned int32 | unrestricted/impl-validated per 0x10302d78 / see impl 0x10302d78 |
| `UpdateID` | unsigned int32 | unrestricted/impl-validated per 0x10302d78 / length-bounded by parse-helper buffer cap |

- **`StartingIndex`** — produced by impl 0x10302d78 via media-store member this+0x168
  - validation: impl-produced
- **`UpdateID`** — produced by impl 0x10302d78 via media-store member this+0x168
  - special values: see impl 0x10302d78
  - validation: impl-produced

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10307140 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, out-arg write×2, validate×1, commit×1); member delegates: r30 v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307140 — req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 2, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307140 — member vfunc calls: \['r30 v\[+0x18\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x18\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x18\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307140 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x18\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307140 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307140 — commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 2, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl accumulator r30: {701 resolver fail (0x10302da0), 800 resolved-object vfunc type check fail - vtbl\[+0x14\] != f_10113d94 (0x10302dc4), call-derived via vfunc +0x28}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** literal exit paths bounded by accumulator scan
**Bounded unknown — unresolved:** call-derived rc values from worker/delegate chain | resolver f_1034a224 -> f_10349d00 path-walk (ptr/NULL)

**`800`** `strong`

Resolved-object capability check: vtbl\[+0x14\] must equal the prefix-search entry point f_10113d94; resolved objects whose class fills that slot with a different implementation fault 800 ("not a prefix-searchable directory object"). Census of .rodata finds SEVENTEEN vtables carrying f_10113d94@+0x14 + f_10113da4@+0x18: the 10-member queue/share/saved-queue family @0x10ebb598-0x10ebb7f4, the three favorites classes @0x10ec0ad4/0x10ec0b08/0x10ec0c28, dirObjAttr @0x10eadf80, two audio-in classes @0x10ea11f4/0x10ea129c (SPDIF/dioInputZP neighborhood), plus a 9-slot variant @0x10ea0f7c carrying the pair at +0x0c/+0x10 (older/alternate interface layout). 800 therefore fires on unresolved objects and on non-directory classes, not on most real dirObj classes.



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10307140`
- dispatch entry `0x10eb4288`
- impl call `0x103071f4` obj `r5-in` slot `24` arg4 `sp-0x814`
- impl call `0x103072a0` obj `*(sp-0x830+0x82c)` slot `12` arg4 `?`
- req vcall `0x103071c8` slot `8` (parse)

- fn 0x10307140 @ 0x10307140 — action wrapper handler
- @ 0x10eb4288 — action dispatch table entry

</details>

### `GetAlbumArtistDisplayOption`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports how the library is configured to treat album artists — the display option that decides whether compilations and guest-artist tracks group under the album artist or the track artist.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns the album-artist display option via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `AlbumArtistDisplayOption` | response field | impl-produced / per the parser/emitter |

- **`AlbumArtistDisplayOption`** — AlbumArtistDisplayOption capability field emitted by impl 0x10307aa4
  - validation: arg-name string 'out' loaded at 0x10307af8 inside f_10307aa4

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10307b70 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307b70 — req-vfunc call map: {'0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307b70 — member vfunc calls: \['r4 v\[+0x8\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x8\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307b70 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307b70 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307b70 — commit/fault slot usage: {'0x14': 1}

</details>


#### Errors

**`402`** `strong`

impl single-call impl: rc = worker call result verbatim (mr r3 at 0x10307ab8 is the call arg setup; r31 exit is lwz-restored spill - real exit is the call); rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** literal exit paths bounded by accumulator scan
**Bounded unknown — unresolved:** call-derived rc values from worker/delegate chain



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10307b70`
- dispatch entry `0x10eb4294`
- impl call `0x10307b9c` obj `r4-in` slot `8` arg4 `r4-in`

- fn 0x10307b70 @ 0x10307b70 — action wrapper handler
- @ 0x10eb4294 — action dispatch table entry
- @ 0x10307aa4 — tail target of handler

</details>

### `GetAllPrefixLocations`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports the alphabet positions inside the library — where each letter's section starts — so an app can build an A-Z jump index over a large collection.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns TotalPrefixes/PrefixAndIndexCSV/UpdateID via impl->v\[+0x1c\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | SonosStringArg | yes | impl-side grammar applies / max 1023 chars | none - required argument |

- **`ObjectID`** — CD object identifier to enumerate prefix locations for
  - validation: consumed by the impl vfunc

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `TotalPrefixes` | unsigned int32 | unrestricted/impl-validated per 0x10302cb4 / length-bounded by parse-helper buffer cap |
| `PrefixAndIndexCSV` | SonosUintArg | unrestricted/impl-validated per 0x10302cb4 / see impl 0x10302cb4 |
| `UpdateID` | unsigned int32 | unrestricted/impl-validated per 0x10302cb4 / length-bounded by parse-helper buffer cap |

- **`TotalPrefixes`** — produced by impl 0x10302cb4 via media-store member this+0x168
  - special values: see impl 0x10302cb4
  - validation: impl-produced
- **`PrefixAndIndexCSV`** — produced by impl 0x10302cb4 via media-store member this+0x168
  - validation: impl-produced
- **`UpdateID`** — produced by impl 0x10302cb4 via media-store member this+0x168
  - special values: see impl 0x10302cb4
  - validation: impl-produced

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x103072ac — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×3, validate×1, commit×1); member delegates: r30 v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103072ac — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 3, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103072ac — member vfunc calls: \['r30 v\[+0x1c\]'\]

</details>


#### Side effects

- read-only query delegate: r30 v\[+0x1c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x1c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103072ac — no transition-literal/store pattern; member delegates: \['r30 v\[+0x1c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103072ac — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103072ac — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 3, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl accumulator r30: {701 resolver fail (0x10302ce4), 800 vfunc type check fail - vtbl\[+0x18\] != f_10113da4 (0x10302d08), call-derived}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** literal exit paths bounded by accumulator scan
**Bounded unknown — unresolved:** call-derived rc values from worker/delegate chain | resolver f_1034a224 -> f_10349d00 path-walk (ptr/NULL)

**`800`** `strong`

Resolved-object capability check: vtbl\[+0x18\] must equal the prefix-search entry point f_10113da4; resolved objects whose class fills that slot with a different implementation fault 800 ("not a prefix-searchable directory object"). Census of .rodata finds SEVENTEEN vtables carrying f_10113d94@+0x14 + f_10113da4@+0x18: the 10-member queue/share/saved-queue family @0x10ebb598-0x10ebb7f4, the three favorites classes @0x10ec0ad4/0x10ec0b08/0x10ec0c28, dirObjAttr @0x10eadf80, two audio-in classes @0x10ea11f4/0x10ea129c (SPDIF/dioInputZP neighborhood), plus a 9-slot variant @0x10ea0f7c carrying the pair at +0x0c/+0x10 (older/alternate interface layout). 800 therefore fires on unresolved objects and on non-directory classes, not on most real dirObj classes.



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x103072ac`
- dispatch entry `0x10eb42a0`
- impl call `0x103072ec` obj `r4-in` slot `28` arg4 `ObjectID`
- impl call `0x1030730c` obj `r4-in` slot `8` arg4 `?`
- impl call `0x1030733c` obj `r5-in` slot `28` arg4 `sp-0x814`
- impl call `0x10307358` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x1c)`
- impl call `0x103073e0` obj `vret(*(sp-0x830+0x82c),+0x24)` slot `16` arg4 `sp+0x41c`
- req vcall `0x10307418` slot `12` (commit)

- fn 0x103072ac @ 0x103072ac — action wrapper handler
- @ 0x10eb42a0 — action dispatch table entry

</details>

### `GetBrowseable`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports whether the library is currently browseable at all — during a rescan or certain states the index can be temporarily unavailable, and apps check this before offering browse screens.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns IsBrowseable via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `IsBrowseable` | signed int32 | unrestricted/impl-validated per 0x10302470 / {0,1} |

- **`IsBrowseable`** — produced by impl 0x10302470 via media-store member this+0x168
  - validation: impl-produced

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x103077d0 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x3c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103077d0 — req-vfunc call map: {'0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x3c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103077d0 — member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x3c\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x8\], r30 v\[+0x3c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x3c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103077d0 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x3c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103077d0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103077d0 — commit/fault slot usage: {'0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`402`** `confirmed`

impl 0x10302470: writes byte 1 to out then returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x103077d0`
- dispatch entry `0x10eb42ac`
- impl call `0x10307808` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10307828` obj `r5-in` slot `60` arg4 `sp-0x15`
- impl call `0x10307844` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x3c)`
- req vcall `0x103078b0` slot `12` (commit)

- fn 0x103077d0 @ 0x103077d0 — action wrapper handler
- @ 0x10eb42ac — action dispatch table entry

</details>

### `GetLastIndexChange`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports when the library index last changed — the timestamp an app uses to decide whether its cached view of your music is stale and needs re-browsing.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns LastIndexChange timestamp via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `LastIndexChange` | SonosUintArg | unrestricted/impl-validated per 0x1030259c / see impl 0x1030259c |

- **`LastIndexChange`** — produced by impl 0x1030259c via media-store member this+0x168
  - validation: impl-produced

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x103079a8 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x2c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103079a8 — req-vfunc call map: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x2c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103079a8 — member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x2c\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x8\], r30 v\[+0x2c\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x2c\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103079a8 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x2c\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103079a8 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103079a8 — commit/fault slot usage: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

</details>


#### Errors

**`402`** `confirmed`

impl 0x1030259c: single exit returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x103079a8`
- dispatch entry `0x10eb42b8`
- impl call `0x103079e0` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10307a04` obj `r5-in` slot `44` arg4 `sp-0x2c`
- impl call `0x10307a20` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x2c)`
- impl call `0x10307a84` obj `vret(*(sp-0x40+0x3c),+0x24)` slot `16` arg4 `sp+0x14`
- req vcall `0x10307a98` slot `12` (commit)

- fn 0x103079a8 @ 0x103079a8 — action wrapper handler
- @ 0x10eb42b8 — action dispatch table entry

</details>

### `GetSearchCapabilities`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports which fields the library's search can match on — which kinds of queries are supported (title, artist, album, and so on). Which fields the library's search can match on — what kinds of queries are legal to send.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns search capabilities via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `SearchCaps` | response field | impl-produced / per the parser/emitter |

- **`SearchCaps`** — SearchCaps capability field emitted by impl 0x10307d44
  - validation: arg-name string 'out' loaded at 0x10307d98 inside f_10307d44

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10307e10 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307e10 — req-vfunc call map: {'0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307e10 — member vfunc calls: \['r4 v\[+0x8\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x8\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307e10 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307e10 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307e10 — commit/fault slot usage: {'0x14': 1}

</details>


#### Errors

**`402`** `strong`

impl single-call impl: rc = worker call result verbatim; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** literal exit paths bounded by accumulator scan
**Bounded unknown — unresolved:** call-derived rc values from worker/delegate chain



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10307e10`
- dispatch entry `0x10eb42c4`
- impl call `0x10307e3c` obj `r4-in` slot `8` arg4 `r4-in`

- fn 0x10307e10 @ 0x10307e10 — action wrapper handler
- @ 0x10eb42c4 — action dispatch table entry
- @ 0x10307d44 — tail target of handler

</details>

### `GetShareIndexInProgress`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports whether a library rescan is running right now — the 'updating music index' spinner's data source. The 'updating music index' spinner's data source — on while a rescan walks your folders.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns IsIndexing flag via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `IsIndexing` | signed int32 | unrestricted/impl-validated per 0x1030269c / see impl 0x1030269c |

- **`IsIndexing`** — produced by impl 0x1030269c via media-store member this+0x168
  - validation: impl-produced

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x103078bc — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x38\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103078bc — req-vfunc call map: {'0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x38\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103078bc — member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x38\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x8\], r30 v\[+0x38\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x38\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103078bc — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x38\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103078bc — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x103078bc — commit/fault slot usage: {'0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`402`** `confirmed`

impl 0x1030269c: single exit returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x103078bc`
- dispatch entry `0x10eb42d0`
- impl call `0x103078f4` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10307914` obj `r5-in` slot `56` arg4 `sp-0x15`
- impl call `0x10307930` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x38)`
- req vcall `0x1030799c` slot `12` (commit)

- fn 0x103078bc @ 0x103078bc — action wrapper handler
- @ 0x10eb42d0 — action dispatch table entry

</details>

### `GetSortCapabilities`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports which orderings the library can return results in — which sorts you can legally ask Browse for. Which orderings the library can return — what sorts you can legally ask a browse for.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns sort capabilities via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `SortCaps` | response field | impl-produced / per the parser/emitter |

- **`SortCaps`** — SortCaps capability field emitted by impl 0x10307bf4
  - validation: arg-name string 'out' loaded at 0x10307c48 inside f_10307bf4

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10307cc0 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307cc0 — req-vfunc call map: {'0x14': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307cc0 — member vfunc calls: \['r4 v\[+0x8\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x8\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307cc0 — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307cc0 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307cc0 — commit/fault slot usage: {'0x14': 1}

</details>


#### Errors

**`402`** `strong`

impl single-call impl: rc = worker call result verbatim; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** literal exit paths bounded by accumulator scan
**Bounded unknown — unresolved:** call-derived rc values from worker/delegate chain



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10307cc0`
- dispatch entry `0x10eb42dc`
- impl call `0x10307cec` obj `r4-in` slot `8` arg4 `r4-in`

- fn 0x10307cc0 @ 0x10307cc0 — action wrapper handler
- @ 0x10eb42dc — action dispatch table entry
- @ 0x10307bf4 — tail target of handler

</details>

### `GetSystemUpdateID`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Reports the library's global version number — a counter that increments whenever anything in the library changes. Apps compare it against what they last saw to detect that the collection changed under them.

<details markdown="1"><summary><b>Technical details</b></summary>

Returns the system update Id via impl->v\[+0x8\].

</details>

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Id` | unsigned int32 | unrestricted/impl-validated per 0x10302640 / length-bounded by parse-helper buffer cap |

- **`Id`** — produced by impl 0x10302640 via media-store member this+0x168
  - special values: see impl 0x10302640
  - validation: impl-produced

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1030751c — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x10\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1030751c — req-vfunc call map: {'0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x10\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1030751c — member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x10\]'\]

</details>


#### Side effects

- read-only query delegate: r4 v\[+0x8\], r30 v\[+0x10\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x10\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1030751c — no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x10\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1030751c — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x1030751c — commit/fault slot usage: {'0x14': 1, '0x24': 1, '0xc': 1}

</details>


#### Errors

**`402`** `confirmed`

impl 0x10302640: single exit returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1030751c`
- dispatch entry `0x10eb42e8`
- impl call `0x10307554` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10307574` obj `r5-in` slot `16` arg4 `sp-0x18`
- impl call `0x10307590` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x10)`
- req vcall `0x103075fc` slot `12` (commit)

- fn 0x1030751c @ 0x1030751c — action wrapper handler
- @ 0x10eb42e8 — action dispatch table entry

</details>

### `RefreshShareIndex`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Triggers a rescan of the music shares — the 'Update Music Library' command. The player re-walks the shared folders and rebuilds its index of what's available.

<details markdown="1"><summary><b>Technical details</b></summary>

Triggers a share-index refresh (AlbumArtistDisplayOption) via impl->v\[+0x30\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AlbumArtistDisplayOption` | SonosUintArg | yes | unrestricted/impl-validated per 0x10302b78 / max 1023 chars | none - required argument |

- **`AlbumArtistDisplayOption`** — request-layer string/int parsed and handed to media-store impl 0x10302b78
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10306f60 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x30\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306f60 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x30\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306f60 — member vfunc calls: \['r30 v\[+0x30\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x30\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x30\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306f60 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x30\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306f60 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306f60 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl impl literal exit returns 0; two out-branches tail into sched thunks -> f_1010eafc domain {0,720}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** literal exit paths bounded by accumulator scan
**Bounded unknown — unresolved:** call-derived rc values from worker/delegate chain

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

worker/delegate rc domain adds \[710\] beyond the documented accumulator bound

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved

propagated reachability; site-level trigger undecoded



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10306f60`
- dispatch entry `0x10eb42f4`
- impl call `0x10306fe0` obj `r5-in` slot `48` arg4 `sp-0x414`
- impl call `0x10307044` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x10306fc0` slot `8` (parse)

- fn 0x10306f60 @ 0x10306f60 — action wrapper handler
- @ 0x10eb42f4 — action dispatch table entry

</details>

### `RequestResort`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Asks the library to re-sort its index — the housekeeping operation after changes that affect ordering, such as a new album-artist display setting. Housekeeping after changes that affect ordering — like a new album-artist display setting.

<details markdown="1"><summary><b>Technical details</b></summary>

Requests an index resort (SortOrder) via impl->v\[+0x34\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `SortOrder` | SonosStringArg | yes | unrestricted/impl-validated per 0x103028f0 / max 1023 chars | none - required argument |

- **`SortOrder`** — request-layer string/int parsed and handed to media-store impl 0x103028f0
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10307050 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x34\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307050 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x34\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307050 — member vfunc calls: \['r30 v\[+0x34\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x34\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x34\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307050 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x34\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307050 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307050 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl impl literal exit returns 0; one out-branch tail into sched thunk -> f_1010eafc domain {0,720}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

worker/delegate rc domain adds \[701, 711\] beyond the documented accumulator bound

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved

propagated reachability; site-level trigger undecoded



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10307050`
- dispatch entry `0x10eb4300`
- impl call `0x103070d0` obj `r5-in` slot `52` arg4 `sp-0x414`
- impl call `0x10307134` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x103070b0` slot `8` (parse)

- fn 0x10307050 @ 0x10307050 — action wrapper handler
- @ 0x10eb4300 — action dispatch table entry

</details>

### `SetBrowseable`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Turns the library's browseability on or off — effectively hiding or exposing the local index to controllers. Effectively hides or exposes the local index to controllers — an off library doesn't show up to browse.

<details markdown="1"><summary><b>Technical details</b></summary>

Sets Browseable flag via impl->v\[+0x40\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Browseable` | SonosStringArg | yes | unrestricted/impl-validated per 0x10302488 / length-bounded by parse-helper buffer cap | none - required argument |

- **`Browseable`** — request-layer string/int parsed and handed to media-store impl 0x10302488
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x18`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10307424 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307424 — req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307424 — member vfunc calls: \['r30 v\[+?\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307424 — no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307424 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10307424 — commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`800`** `confirmed`

dead action: validly parsed calls always fault with this code; malformed requests may still fail earlier at the request-validation gate (402)

- any invocation; impl body is li r3,0x320; blr

**`402`** `confirmed`

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10307424`
- dispatch entry `0x10eb430c`
- impl call `0x103074ac` obj `r5-in` slot `64` arg4 `*(sp-0x30+0x18)`
- impl call `0x10307510` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10307480` slot `8` (parse)
- impl f_10302488 = unconditional 0x320 stub (dead action). Dead-action semantics: every structurally valid call reaches the impl and faults with the fixed code; malformed requests can still fail earlier inside the wrapper (402 gate).

- fn 0x10307424 @ 0x10307424 — action wrapper handler
- @ 0x10eb430c — action dispatch table entry

</details>

### `UpdateObject`

visibility `advertised` · reachability `callable` · confidence `strong` · dispatch `direct`

Edits one field of a library object — renames a playlist or tweaks an item's stored metadata: 'change this tag's value to that'. 'Change this tag's value to that' — renames a playlist or tweaks an item's stored metadata.

<details markdown="1"><summary><b>Technical details</b></summary>

Updates ObjectID: CurrentTagValue -> NewTagValue via impl->v\[+0x24\].

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | SonosStringArg | yes | unrestricted/impl-validated per 0x10302e2c / max 1023 chars | none - required argument |
| `CurrentTagValue` | SonosBoolArg | yes | unrestricted/impl-validated per 0x10302e2c / max 4095 chars | none - required argument |
| `NewTagValue` | SonosBoolArg | yes | unrestricted/impl-validated per 0x10302e2c / max 4095 chars | none - required argument |

- **`ObjectID`** — request-layer string/int parsed and handed to media-store impl 0x10302e2c
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`CurrentTagValue`** — request-layer string/int parsed and handed to media-store impl 0x10302e2c
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x1000`
- **`NewTagValue`** — request-layer string/int parsed and handed to media-store impl 0x10302e2c
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x1000`

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x10306d28 — wrapper family decode

</details>


#### Requirements / preconditions `strong`

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1, commit×1); member delegates: r30 v\[+0x24\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306d28 — req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### State dependencies `strong`

service-internal state reached through member delegate(s): r30 v\[+0x24\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306d28 — member vfunc calls: \['r30 v\[+0x24\]'\]

</details>


#### Side effects

- state-mutation delegate: r30 v\[+0x24\] (call-derived member-method semantics)

#### State transitions `strong`

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x24\]
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306d28 — no transition-literal/store pattern; member delegates: \['r30 v\[+0x24\]'\]

</details>


#### Events `strong`

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306d28 — bl call scan: notify-family sites = \[\]

</details>


#### Return behavior `strong`

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
<details markdown="1"><summary>Evidence (1)</summary>

- fn 0x10306d28 — commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

</details>


#### Errors

**`402`** `strong`

impl accumulator r30: {711 literal (0x10302e88), 701 resolver fail (0x10302ef0), arg r5-seeded, call/lwz-derived}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown — proven:** literal exit paths bounded by accumulator scan
**Bounded unknown — unresolved:** call-derived rc values from worker/delegate chain | resolver f_1034a224 -> f_10349d00 path-walk (ptr/NULL)

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`** `inferred`

favorites/userradio store-commit layer (dirObjFavorites vfunc -> f_10384490 userradio.xml atomic save): reachable codes {402,501,701,702,803,805,806,807}. Proven rungs in f_10384490: 805 = store count field *(ctx+0x20)>=70 (favorites cap); 806 = ftell()>0x20000 (serialized XML >128KiB); 807 = phase *(ctx+0x1c)>=6 with flag +0x30; 803 = phase *(ctx+0x1c)<2; 702 = flag *(ctx+0x2e); 501 = .tmp open failure; 402/701 = arg/resolver gates. Internal error strings (Invalid favorite id / Could not access favorites / initContentResource parse URI,extract item ID,Invalid item ID,No valid mapping for item type / Failed to parse account service ID) collapse into this rc domain on the wire. Applies when the ObjectID resolves into the favorites/userradio directory (FV:/R: prefixes).

- the backing store-commit worker returned a nonzero code — propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved

indirect dirObj-vfunc edge - bl-scan cannot see it; vtable xref proves reachability



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x10306d28`
- dispatch entry `0x10eb4318`
- impl call `0x10306e00` obj `r5-in` slot `36` arg4 `sp-0x2414`
- impl call `0x10306e64` obj `*(sp-0x2430+0x242c)` slot `12` arg4 `402`
- req vcall `0x10306dd8` slot `8` (parse)

- fn 0x10306d28 @ 0x10306d28 — action wrapper handler
- @ 0x10eb4318 — action dispatch table entry

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `A_ARG_TYPE_ObjectID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Result` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_SearchCriteria` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_BrowseFlag` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Filter` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_SortCriteria` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Prefix` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Index` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Count` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UpdateID` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_TagValueList` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AlbumArtistDisplayOption` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_SortOrder` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_LastIndexChange` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `SearchCapabilities` | string | no | non-evented ContentDirectory state variable — read via action out-args, not pushed |
| `SortCapabilities` | string | no | non-evented ContentDirectory state variable — read via action out-args, not pushed |
| `SystemUpdateID` | ui4 | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `ContainerUpdateIDs` | string | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `ShareIndexInProgress` | boolean | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `ShareIndexLastError` | string | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `UserRadioUpdateID` | string | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `SavedQueuesUpdateID` | string | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `ShareListUpdateID` | string | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `RecentlyPlayedUpdateID` | string | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `Browseable` | boolean | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `RadioFavoritesUpdateID` | ui4 | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `RadioLocationUpdateID` | ui4 | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |
| `FavoritesUpdateID` | string | yes | evented state variable — appears in ContentDirectory LastChange/GENA event notifications |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /MediaServer/ContentDirectory/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `contentDirectory`, `indexerStatus`, `favoritesVersionChange`, `playlistsVersionChange`
<details markdown="1"><summary><b>Technical details</b></summary>

- **notify_path:** f_103035c4 emits {ContainerUpdateIDs, ShareIndexInProgress} + f_10303de4 emits {FavoritesUpdateID, SavedQueuesUpdateID, ShareListUpdateID, RadioFavoritesUpdateID} via event-bus workers f_1067693c/f_1067cdd0
- **wss_registry:**
  - idx: 23, name: contentDirectory, id: 80, tag: 68
  - idx: 42, name: indexerStatus, id: 152, tag: 23
  - idx: 31, name: favoritesVersionChange, id: 115, tag: 11
  - idx: 50, name: playlistsVersionChange, id: 195, tag: 34

</details>


## Dispatcher-level errors

<details markdown="1"><summary><b>Technical details</b></summary>

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search



</details>

## Notes

<details markdown="1"><summary><b>Technical details</b></summary>

None Browse internals decoded: handler shim 0x10306b3c -> real handler f_10304390 -> executor f_103042f0. BrowseFlag is literal-validated (BrowseDirectChildren / BrowseMetadata, else 402); DIDL output is generated by per-item writer callbacks (f_10306088/0x10306098/0x103060a8) driven through request v\[+0x24\]. UpdateID comes from the container record via f_1034a224(obj+0x168, selector 0x2bd).

</details>

Implementation sources (recovered): `compiled lib (libsonos-upnp family) — impl classes generated/static`

<details markdown="1"><summary>Service evidence (3)</summary>

- @ 0x101953c8 — service router function
- @ 0x10eb4258 — service vtable
- @ 0x10307608 — service dispatcher

</details>
