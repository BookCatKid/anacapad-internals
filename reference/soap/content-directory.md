# `ContentDirectory` `/MediaServer/ContentDirectory/Control`

**visibility** `advertised`

This service is the front door to the speaker's music library: the index it builds from your music shares (a NAS folder or a computer's shared drive) so albums and artists can be browsed without a computer being involved at playback time. Browsing lives here: ask for the children of a folder, a playlist, or an artist, and get back tracks and containers with their metadata. So does library maintenance: kicking off a rescan of your shares, forcing a re-sort, checking whether indexing is in progress, and creating or editing library objects. In short, everything the app does under 'Music Library' routes through these commands.

**TODO:** Established: the service's action surface, dispatch records, and state variables are fully documented.
**TODO:** Still unknown: browse/search dispatch is mapped to handlers; the backend browse resolver and per-container query construction are untraced.
**TODO:** Next step: resolve the impl functions behind each action's handler and record them per action.

::: details Technical details

UPnP ContentDirectory for the local music index: browse, object create/destroy/update, prefix lookups, index refresh/resort and capability getters. impl = content-index subsystem member.

:::

## Availability

- capability flags `0x20`
- enabled gate: `xor(*(r3-in+0x571c))` at `0x1019567c` (field_inverted)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x20`
- dispatcher `0x10307608` kind `table`
- action table `0x10eb4264`

## Actions

| Action | Visibility | Reachability | Dispatch | Error codes |
|---|---|---|---|---|
| `Browse` | advertised | callable | direct | 402, 701 |
| `CreateObject` | advertised | callable | direct | 402 |
| `DestroyObject` | advertised | callable | direct | 402 |
| `FindPrefix` | advertised | callable | direct | 402, 800 |
| `GetAlbumArtistDisplayOption` | advertised | callable | direct | 402 |
| `GetAllPrefixLocations` | advertised | callable | direct | 402, 800 |
| `GetBrowseable` | advertised | callable | direct | 402 |
| `GetLastIndexChange` | advertised | callable | direct | 402 |
| `GetSearchCapabilities` | advertised | callable | direct | 402 |
| `GetShareIndexInProgress` | advertised | callable | direct | 402 |
| `GetSortCapabilities` | advertised | callable | direct | 402 |
| `GetSystemUpdateID` | advertised | callable | direct | 402 |
| `RefreshShareIndex` | advertised | callable | direct | 402 |
| `RequestResort` | advertised | callable | direct | 402 |
| `SetBrowseable` | advertised | callable | direct | 402, 800 |
| `UpdateObject` | advertised | callable | direct | 402 |

### `Browse`

visibility `advertised` · reachability `callable` · dispatch `direct`

The one command that does nearly all library navigation. You name a container (the library root, an artist, a folder, a playlist) and ask for either its own metadata or its children, with a starting offset and a count for paging, plus which fields you want and how to sort. Everything from 'show my albums' to 'list tracks in this playlist' reduces to Browse calls, and the app pages through large collections a slice at a time.

**TODO:** Established: direct dispatch to handler 0x10306b3c; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10306b3c, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Browse the content directory. Parses all six spec args into a request record (ObjectID/BrowseFlag/Filter/SortCriteria capped 0x400, StartingIndex/RequestedCount via int helper), runs executor f_103042f0 which dispatches on BrowseFlag: BrowseDirectChildren -> children enumeration vfunc v\[+0x28\] on the browse object, BrowseMetadata -> metadata path, anything else -> 402. Result/DIDL is emitted per-item through callback writers f_10306088/0x10306098/0x103060a8 via request v\[+0x24\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | SonosStringArg | yes | unrestricted/impl-validated per 0x103042f0 / <=0x400 chars | none |
| `BrowseFlag` | SonosEnumArg | yes | unrestricted/impl-validated per 0x103042f0 / 2 literals | none |
| `Filter` | SonosStringArg | yes | unrestricted/impl-validated per 0x103042f0 / <=0x400 chars | none |
| `StartingIndex` | SonosUintArg | yes | unrestricted/impl-validated per 0x103042f0 / see impl 0x103042f0 | none |
| `RequestedCount` | SonosUintArg | yes | unrestricted/impl-validated per 0x103042f0 / see impl 0x103042f0 | none |
| `SortCriteria` | SonosStringArg | yes | unrestricted/impl-validated per 0x103042f0 / <=0x400 chars | none |

- **`ObjectID`**: request-layer string/int parsed and handed to media-store impl 0x103042f0
  - special values: impl-defined roots
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`BrowseFlag`**: request-layer string/int parsed and handed to media-store impl 0x103042f0
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`Filter`**: request-layer string/int parsed and handed to media-store impl 0x103042f0
  - special values: * / empty impl-defined
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`StartingIndex`**: request-layer string/int parsed and handed to media-store impl 0x103042f0
  - unit: index
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x18`
- **`RequestedCount`**: request-layer string/int parsed and handed to media-store impl 0x103042f0
  - unit: count
  - special values: 0
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x18`
- **`SortCriteria`**: request-layer string/int parsed and handed to media-store impl 0x103042f0
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

- **`Result`**: produced by impl 0x103042f0 via media-store member this+0x168
  - special values: empty DIDL for empty containers
  - validation: impl-produced
- **`NumberReturned`**: produced by impl 0x103042f0 via media-store member this+0x168
  - unit: count
  - special values: 0 for empty result
  - validation: impl-produced
- **`TotalMatches`**: produced by impl 0x103042f0 via media-store member this+0x168
  - unit: count
  - special values: 0
  - validation: impl-produced
- **`UpdateID`**: produced by impl 0x103042f0 via media-store member this+0x168
  - special values: 0
  - validation: impl-produced

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10306b3c; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (none); member delegates: r4 v\[+0x3c\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (none); member delegates: r4 v\[+0x3c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306b3c; req-vfunc call map: {}

:::


#### State dependencies

Content-directory index state at browse object +0x168 supplies the UpdateID

#### Side effects

- read-only query delegate: r4 v\[+0x3c\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r4 v\[+0x3c\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x3c\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x3c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306b3c; no transition-literal/store pattern; member delegates: \['r4 v\[+0x3c\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306b3c; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306b3c; commit/fault slot usage: {}

:::


#### Errors

**`701`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret; sites: 0x10306b3c).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl accumulator r31: {701 when object resolver f_1034a224 fails on ObjectID (preset 0x1030430c), 0 on success, call/lwz-derived}; rc forwarded verbatim via req v\[+0x14\]

- impl/store gate failed


**Bounded unknown (proven):** literal exit paths bounded by accumulator scan
**Bounded unknown (unresolved):** call-derived rc values from worker/delegate chain | resolver f_1034a224 -> f_10349d00 path-walk (ptr/NULL)

**`402`**

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`402`**

invalid BrowseFlag: value is neither "BrowseDirectChildren" nor "BrowseMetadata" (literal strcmp inside executor f_103042f0)

- BrowseFlag fails both strcmps; executor presets r9=0x192
- Any of the six arg parse helpers fails



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10306b3c`
- dispatch entry `0x10eb4264`
- req vcall `0x10306b64` slot `60` (other)
- table entry is a trampoline; real chain: req v\[+0x3c\] then f_10304390 -> shared executor f_103042f0 (BrowseFlag strcmp -> 402, resolver -> 701)

- fn 0x10306b3c @ 0x10306b3c; action wrapper handler
- @ 0x10eb4264; action dispatch table entry

:::

### `CreateObject`

visibility `advertised` · reachability `callable` · dispatch `direct`

Creates a new library object, for example a new playlist container inside the library tree. You give the parent container and the object's details, and the library assigns it an ID and returns it.

**TODO:** Established: direct dispatch to handler 0x10306b84; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10306b84, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Creates a CDS object: ContainerID/Elements -> impl->v\[+0x20\], returning ObjectID/Result.

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ContainerID` | SonosStringArg | yes | unrestricted/impl-validated per 0x103026f8 / max 1023 chars | none - required argument |
| `Elements` | SonosStringArg | yes | unrestricted/impl-validated per 0x103026f8 / max 16383 chars | none - required argument |

- **`ContainerID`**: request-layer string/int parsed and handed to media-store impl 0x103026f8
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`Elements`**: request-layer string/int parsed and handed to media-store impl 0x103026f8
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x4000`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `ObjectID` | SonosStringArg | unrestricted/impl-validated per 0x103026f8 / length-bounded by parse-helper buffer cap |
| `Result` | SonosStringArg | unrestricted/impl-validated per 0x103026f8 / length-bounded by parse-helper buffer cap |

- **`ObjectID`**: produced by impl 0x103026f8 via media-store member this+0x168
  - special values: see impl 0x103026f8
  - validation: impl-produced
- **`Result`**: produced by impl 0x103026f8 via media-store member this+0x168
  - special values: see impl 0x103026f8
  - validation: impl-produced

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10306b84; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (out-arg store×2, raise-fault×1, required-arg fetch×2, out-arg write×2, validate×1, commit×1); member delegates: r30 v\[+?\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (out-arg store×2, raise-fault×1, required-arg fetch×2, out-arg write×2, validate×1, commit×1); member delegates: r30 v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x10306b84; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 2, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r30 v\[+?\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r30 v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x10306b84; member vfunc calls: \['r30 v\[+?\]'\]

:::


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
  - **TODO:** Next step: resolve that target and re-derive this section's semantics.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x10306b84; no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306b84; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306b84; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 2, '0x10': 2, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(r5-in,+0x20); parse/req-layer; sites: 0x10306c6c).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl accumulator r29: {710 literal (0x10302800), arg r7-seeded, call/lwz-derived}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
favorites/userradio store-commit layer (dirObjFavorites vfunc -> f_10384490 userradio.xml atomic save): reachable codes {402,501,701,702,803,805,806,807}. Proven rungs in f_10384490: 805 = store count field *(ctx+0x20)>=70 (favorites cap); 806 = ftell()>0x20000 (serialized XML >128KiB); 807 = phase *(ctx+0x1c)>=6 with flag +0x30; 803 = phase *(ctx+0x1c)<2; 702 = flag *(ctx+0x2e); 501 = .tmp open failure; 402/701 = arg/resolver gates. Internal error strings (Invalid favorite id / Could not access favorites / initContentResource parse URI,extract item ID,Invalid item ID,No valid mapping for item type / Failed to parse account service ID) collapse into this rc domain on the wire. Applies when the ObjectID resolves into the favorites/userradio directory (FV:/R: prefixes).

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved

indirect dirObj-vfunc edge - bl-scan cannot see it; vtable xref proves reachability



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10306b84`
- dispatch entry `0x10eb4270`
- impl call `0x10306c50` obj `r5-in` slot `32` arg4 `sp+0x1c`
- impl call `0x10306cd8` obj `vret(*(*(sp+0x0)+0xfffffffc),+0x24)` slot `16` arg4 `*(sp+0x0)+0x41c`
- impl call `0x10306d08` obj `vret(*(*(sp+0x0)+0xfffffffc),+0x24)` slot `16` arg4 `*(sp+0x0)+0x481c`
- impl call `0x10306d1c` obj `*(*(sp+0x0)+0xfffffffc)` slot `12` arg4 `?`
- req vcall `0x10306c1c` slot `8` (parse)

- fn 0x10306b84 @ 0x10306b84; action wrapper handler
- @ 0x10eb4270; action dispatch table entry

:::

### `DestroyObject`

visibility `advertised` · reachability `callable` · dispatch `direct`

Deletes a library object by its ID, most commonly removing a playlist or another entry from the library tree.

**TODO:** Established: direct dispatch to handler 0x10306e70; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10306e70, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Destroys ObjectID via impl->v\[+0x28\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | SonosStringArg | yes | unrestricted/impl-validated per 0x10302834 / max 1023 chars | none - required argument |

- **`ObjectID`**: request-layer string/int parsed and handed to media-store impl 0x10302834
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10306e70; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x28\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x28\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306e70; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r30 v\[+0x28\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r30 v\[+0x28\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306e70; member vfunc calls: \['r30 v\[+0x28\]'\]

:::


#### Side effects

- state-mutation delegate: r30 v\[+0x28\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: r30 v\[+0x28\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x28\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x28\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306e70; no transition-literal/store pattern; member delegates: \['r30 v\[+0x28\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306e70; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306e70; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(r5-in,+0x28); parse/req-layer; sites: 0x10306f0c).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl accumulator r30: {701 on object-resolve failure (0x10302858), call/lwz-derived}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
favorites/userradio store-commit layer (dirObjFavorites vfunc -> f_10384490 userradio.xml atomic save): reachable codes {402,501,701,702,803,805,806,807}. Proven rungs in f_10384490: 805 = store count field *(ctx+0x20)>=70 (favorites cap); 806 = ftell()>0x20000 (serialized XML >128KiB); 807 = phase *(ctx+0x1c)>=6 with flag +0x30; 803 = phase *(ctx+0x1c)<2; 702 = flag *(ctx+0x2e); 501 = .tmp open failure; 402/701 = arg/resolver gates. Internal error strings (Invalid favorite id / Could not access favorites / initContentResource parse URI,extract item ID,Invalid item ID,No valid mapping for item type / Failed to parse account service ID) collapse into this rc domain on the wire. Applies when the ObjectID resolves into the favorites/userradio directory (FV:/R: prefixes).

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved

indirect dirObj-vfunc edge - bl-scan cannot see it; vtable xref proves reachability



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10306e70`
- dispatch entry `0x10eb427c`
- impl call `0x10306ef0` obj `r5-in` slot `40` arg4 `sp-0x414`
- impl call `0x10306f54` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x10306ed0` slot `8` (parse)

- fn 0x10306e70 @ 0x10306e70; action wrapper handler
- @ 0x10eb427c; action dispatch table entry

:::

### `FindPrefix`

visibility `advertised` · reachability `callable` · dispatch `direct`

Locates items in a container whose titles start with a given prefix, which is the backing operation for alphabet-jump scrolling in a long list: 'take me to the Ss'. It returns the index where matches begin.

**TODO:** Established: direct dispatch to handler 0x10307140; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10307140, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Finds Prefix under ObjectID, returning StartingIndex/UpdateID via impl->v\[+0x18\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | SonosStringArg | yes | unrestricted/impl-validated per 0x10302d78 / max 1023 chars | none - required argument |
| `Prefix` | SonosStringArg | yes | unrestricted/impl-validated per 0x10302d78 / max 1023 chars | none - required argument |

- **`ObjectID`**: request-layer string/int parsed and handed to media-store impl 0x10302d78
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`Prefix`**: request-layer string/int parsed and handed to media-store impl 0x10302d78
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `StartingIndex` | unsigned int32 | unrestricted/impl-validated per 0x10302d78 / see impl 0x10302d78 |
| `UpdateID` | unsigned int32 | unrestricted/impl-validated per 0x10302d78 / length-bounded by parse-helper buffer cap |

- **`StartingIndex`**: produced by impl 0x10302d78 via media-store member this+0x168
  - validation: impl-produced
- **`UpdateID`**: produced by impl 0x10302d78 via media-store member this+0x168
  - special values: see impl 0x10302d78
  - validation: impl-produced

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10307140; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, out-arg write×2, validate×1, commit×1); member delegates: r30 v\[+0x18\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, out-arg write×2, validate×1, commit×1); member delegates: r30 v\[+0x18\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307140; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 2, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r30 v\[+0x18\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r30 v\[+0x18\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307140; member vfunc calls: \['r30 v\[+0x18\]'\]

:::


#### Side effects

- state-mutation delegate: r30 v\[+0x18\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: r30 v\[+0x18\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x18\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x18\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307140; no transition-literal/store pattern; member delegates: \['r30 v\[+0x18\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307140; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307140; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0x24': 2, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(r5-in,+0x18); parse/req-layer; sites: 0x10307210).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl accumulator r30: {701 resolver fail (0x10302da0), 800 resolved-object vfunc type check fail - vtbl\[+0x14\] != f_10113d94 (0x10302dc4), call-derived via vfunc +0x28}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** literal exit paths bounded by accumulator scan
**Bounded unknown (unresolved):** call-derived rc values from worker/delegate chain | resolver f_1034a224 -> f_10349d00 path-walk (ptr/NULL)

**`800`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: r30 accumulator; sites: 0x10302dc4).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
Resolved-object capability check: vtbl\[+0x14\] must equal the prefix-search entry point f_10113d94; resolved objects whose class fills that slot with a different implementation fault 800 ("not a prefix-searchable directory object"). Census of .rodata finds SEVENTEEN vtables carrying f_10113d94@+0x14 + f_10113da4@+0x18: the 10-member queue/share/saved-queue family @0x10ebb598-0x10ebb7f4, the three favorites classes @0x10ec0ad4/0x10ec0b08/0x10ec0c28, dirObjAttr @0x10eadf80, two audio-in classes @0x10ea11f4/0x10ea129c (SPDIF/dioInputZP neighborhood), plus a 9-slot variant @0x10ea0f7c carrying the pair at +0x0c/+0x10 (older/alternate interface layout). 800 therefore fires on unresolved objects and on non-directory classes, not on most real dirObj classes.



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10307140`
- dispatch entry `0x10eb4288`
- impl call `0x103071f4` obj `r5-in` slot `24` arg4 `sp-0x814`
- impl call `0x103072a0` obj `*(sp-0x830+0x82c)` slot `12` arg4 `?`
- req vcall `0x103071c8` slot `8` (parse)

- fn 0x10307140 @ 0x10307140; action wrapper handler
- @ 0x10eb4288; action dispatch table entry

:::

### `GetAlbumArtistDisplayOption`

visibility `advertised` · reachability `callable` · dispatch `direct`

Reports how the library is configured to treat album artists. This display option decides whether compilations and guest-artist tracks group under the album artist or the track artist.

**TODO:** Established: direct dispatch to handler 0x10307b70; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10307b70, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Returns the album-artist display option via impl->v\[+0x8\].

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `AlbumArtistDisplayOption` | response field | impl-produced / per the parser/emitter |

- **`AlbumArtistDisplayOption`**: AlbumArtistDisplayOption capability field emitted by impl 0x10307aa4
  - validation: arg-name string 'out' loaded at 0x10307af8 inside f_10307aa4

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10307b70; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307b70; req-vfunc call map: {'0x14': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0x8\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307b70; member vfunc calls: \['r4 v\[+0x8\]'\]

:::


#### Side effects

- read-only query delegate: r4 v\[+0x8\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r4 v\[+0x8\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307b70; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307b70; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307b70; commit/fault slot usage: {'0x14': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; parse/req-layer; sites: 0x10307bf0).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl single-call impl: rc = worker call result verbatim (mr r3 at 0x10307ab8 is the call arg setup; r31 exit is lwz-restored spill - real exit is the call); rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** literal exit paths bounded by accumulator scan
**Bounded unknown (unresolved):** call-derived rc values from worker/delegate chain



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10307b70`
- dispatch entry `0x10eb4294`
- impl call `0x10307b9c` obj `r4-in` slot `8` arg4 `r4-in`

- fn 0x10307b70 @ 0x10307b70; action wrapper handler
- @ 0x10eb4294; action dispatch table entry
- @ 0x10307aa4; tail target of handler

:::

### `GetAllPrefixLocations`

visibility `advertised` · reachability `callable` · dispatch `direct`

Reports the alphabet positions inside the library, meaning where each letter's section starts, so an app can build an A-Z jump index over a large collection.

**TODO:** Established: direct dispatch to handler 0x103072ac; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x103072ac, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Returns TotalPrefixes/PrefixAndIndexCSV/UpdateID via impl->v\[+0x1c\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | SonosStringArg | yes | impl-side grammar applies / max 1023 chars | none - required argument |

- **`ObjectID`**: CD object identifier to enumerate prefix locations for
  - validation: consumed by the impl vfunc

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `TotalPrefixes` | unsigned int32 | unrestricted/impl-validated per 0x10302cb4 / length-bounded by parse-helper buffer cap |
| `PrefixAndIndexCSV` | SonosUintArg | unrestricted/impl-validated per 0x10302cb4 / see impl 0x10302cb4 |
| `UpdateID` | unsigned int32 | unrestricted/impl-validated per 0x10302cb4 / length-bounded by parse-helper buffer cap |

- **`TotalPrefixes`**: produced by impl 0x10302cb4 via media-store member this+0x168
  - special values: see impl 0x10302cb4
  - validation: impl-produced
- **`PrefixAndIndexCSV`**: produced by impl 0x10302cb4 via media-store member this+0x168
  - validation: impl-produced
- **`UpdateID`**: produced by impl 0x10302cb4 via media-store member this+0x168
  - special values: see impl 0x10302cb4
  - validation: impl-produced

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x103072ac; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×3, validate×1, commit×1); member delegates: r30 v\[+0x1c\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×3, validate×1, commit×1); member delegates: r30 v\[+0x1c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103072ac; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 3, '0x10': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r30 v\[+0x1c\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r30 v\[+0x1c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103072ac; member vfunc calls: \['r30 v\[+0x1c\]'\]

:::


#### Side effects

- read-only query delegate: r30 v\[+0x1c\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r30 v\[+0x1c\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x1c\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x1c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103072ac; no transition-literal/store pattern; member delegates: \['r30 v\[+0x1c\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103072ac; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103072ac; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 3, '0x10': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret; parse/req-layer; sites: 0x103072ac).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl accumulator r30: {701 resolver fail (0x10302ce4), 800 vfunc type check fail - vtbl\[+0x18\] != f_10113da4 (0x10302d08), call-derived}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** literal exit paths bounded by accumulator scan
**Bounded unknown (unresolved):** call-derived rc values from worker/delegate chain | resolver f_1034a224 -> f_10349d00 path-walk (ptr/NULL)

**`800`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: r30 accumulator; sites: 0x10302d08).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
Resolved-object capability check: vtbl\[+0x18\] must equal the prefix-search entry point f_10113da4; resolved objects whose class fills that slot with a different implementation fault 800 ("not a prefix-searchable directory object"). Census of .rodata finds SEVENTEEN vtables carrying f_10113d94@+0x14 + f_10113da4@+0x18: the 10-member queue/share/saved-queue family @0x10ebb598-0x10ebb7f4, the three favorites classes @0x10ec0ad4/0x10ec0b08/0x10ec0c28, dirObjAttr @0x10eadf80, two audio-in classes @0x10ea11f4/0x10ea129c (SPDIF/dioInputZP neighborhood), plus a 9-slot variant @0x10ea0f7c carrying the pair at +0x0c/+0x10 (older/alternate interface layout). 800 therefore fires on unresolved objects and on non-directory classes, not on most real dirObj classes.



:::

::: details Implementation & reverse-engineering evidence

- handler `0x103072ac`
- dispatch entry `0x10eb42a0`
- impl call `0x103072ec` obj `r4-in` slot `28` arg4 `ObjectID`
- impl call `0x1030730c` obj `r4-in` slot `8` arg4 `?`
- impl call `0x1030733c` obj `r5-in` slot `28` arg4 `sp-0x814`
- impl call `0x10307358` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x1c)`
- impl call `0x103073e0` obj `vret(*(sp-0x830+0x82c),+0x24)` slot `16` arg4 `sp+0x41c`
- req vcall `0x10307418` slot `12` (commit)

- fn 0x103072ac @ 0x103072ac; action wrapper handler
- @ 0x10eb42a0; action dispatch table entry

:::

### `GetBrowseable`

visibility `advertised` · reachability `callable` · dispatch `direct`

Reports whether the library is currently browseable at all. During a rescan or in certain states the index can be temporarily unavailable, and apps check this before offering browse screens.

**TODO:** Established: direct dispatch to handler 0x103077d0; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x103077d0, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Returns IsBrowseable via impl->v\[+0x8\].

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `IsBrowseable` | signed int32 | unrestricted/impl-validated per 0x10302470 / {0,1} |

- **`IsBrowseable`**: produced by impl 0x10302470 via media-store member this+0x168
  - validation: impl-produced

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x103077d0; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x3c\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x3c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103077d0; req-vfunc call map: {'0x14': 1, '0x24': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x3c\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x3c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103077d0; member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x3c\]'\]

:::


#### Side effects

- read-only query delegate: r4 v\[+0x8\], r30 v\[+0x3c\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r4 v\[+0x8\], r30 v\[+0x3c\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x3c\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x3c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103077d0; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x3c\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103077d0; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103077d0; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0xc': 1}

:::


#### Errors

**`402`**

impl 0x10302470: writes byte 1 to out then returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



:::

::: details Implementation & reverse-engineering evidence

- handler `0x103077d0`
- dispatch entry `0x10eb42ac`
- impl call `0x10307808` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10307828` obj `r5-in` slot `60` arg4 `sp-0x15`
- impl call `0x10307844` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x3c)`
- req vcall `0x103078b0` slot `12` (commit)

- fn 0x103077d0 @ 0x103077d0; action wrapper handler
- @ 0x10eb42ac; action dispatch table entry

:::

### `GetLastIndexChange`

visibility `advertised` · reachability `callable` · dispatch `direct`

Reports when the library index last changed. This is the timestamp an app uses to decide whether its cached view of your music is stale and needs re-browsing.

**TODO:** Established: direct dispatch to handler 0x103079a8; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x103079a8, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Returns LastIndexChange timestamp via impl->v\[+0x8\].

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `LastIndexChange` | SonosUintArg | unrestricted/impl-validated per 0x1030259c / see impl 0x1030259c |

- **`LastIndexChange`**: produced by impl 0x1030259c via media-store member this+0x168
  - validation: impl-produced

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x103079a8; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x2c\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (out-arg store×1, raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x2c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103079a8; req-vfunc call map: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x2c\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x2c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103079a8; member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x2c\]'\]

:::


#### Side effects

- read-only query delegate: r4 v\[+0x8\], r30 v\[+0x2c\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r4 v\[+0x8\], r30 v\[+0x2c\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x2c\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x2c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103079a8; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x2c\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103079a8; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103079a8; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

:::


#### Errors

**`402`**

impl 0x1030259c: single exit returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



:::

::: details Implementation & reverse-engineering evidence

- handler `0x103079a8`
- dispatch entry `0x10eb42b8`
- impl call `0x103079e0` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10307a04` obj `r5-in` slot `44` arg4 `sp-0x2c`
- impl call `0x10307a20` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x2c)`
- impl call `0x10307a84` obj `vret(*(sp-0x40+0x3c),+0x24)` slot `16` arg4 `sp+0x14`
- req vcall `0x10307a98` slot `12` (commit)

- fn 0x103079a8 @ 0x103079a8; action wrapper handler
- @ 0x10eb42b8; action dispatch table entry

:::

### `GetSearchCapabilities`

visibility `advertised` · reachability `callable` · dispatch `direct`

Reports which fields the library's search can match on, for example title, artist, or album. In other words, it tells a caller which kinds of queries are legal to send.

**TODO:** Established: direct dispatch to handler 0x10307e10; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10307e10, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Returns search capabilities via impl->v\[+0x8\].

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `SearchCaps` | response field | impl-produced / per the parser/emitter |

- **`SearchCaps`**: SearchCaps capability field emitted by impl 0x10307d44
  - validation: arg-name string 'out' loaded at 0x10307d98 inside f_10307d44

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10307e10; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307e10; req-vfunc call map: {'0x14': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0x8\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307e10; member vfunc calls: \['r4 v\[+0x8\]'\]

:::


#### Side effects

- read-only query delegate: r4 v\[+0x8\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r4 v\[+0x8\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307e10; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307e10; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307e10; commit/fault slot usage: {'0x14': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; parse/req-layer; sites: 0x10307e90).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl single-call impl: rc = worker call result verbatim; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** literal exit paths bounded by accumulator scan
**Bounded unknown (unresolved):** call-derived rc values from worker/delegate chain



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10307e10`
- dispatch entry `0x10eb42c4`
- impl call `0x10307e3c` obj `r4-in` slot `8` arg4 `r4-in`

- fn 0x10307e10 @ 0x10307e10; action wrapper handler
- @ 0x10eb42c4; action dispatch table entry
- @ 0x10307d44; tail target of handler

:::

### `GetShareIndexInProgress`

visibility `advertised` · reachability `callable` · dispatch `direct`

Reports whether a library rescan is running right now. This is the data source behind the 'updating music index' spinner, on while a rescan walks your folders.

**TODO:** Established: direct dispatch to handler 0x103078bc; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x103078bc, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Returns IsIndexing flag via impl->v\[+0x8\].

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `IsIndexing` | signed int32 | unrestricted/impl-validated per 0x1030269c / see impl 0x1030269c |

- **`IsIndexing`**: produced by impl 0x1030269c via media-store member this+0x168
  - validation: impl-produced

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x103078bc; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x38\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x38\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103078bc; req-vfunc call map: {'0x14': 1, '0x24': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x38\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x38\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103078bc; member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x38\]'\]

:::


#### Side effects

- read-only query delegate: r4 v\[+0x8\], r30 v\[+0x38\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r4 v\[+0x8\], r30 v\[+0x38\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x38\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x38\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103078bc; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x38\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103078bc; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x103078bc; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0xc': 1}

:::


#### Errors

**`402`**

impl 0x1030269c: single exit returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



:::

::: details Implementation & reverse-engineering evidence

- handler `0x103078bc`
- dispatch entry `0x10eb42d0`
- impl call `0x103078f4` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10307914` obj `r5-in` slot `56` arg4 `sp-0x15`
- impl call `0x10307930` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x38)`
- req vcall `0x1030799c` slot `12` (commit)

- fn 0x103078bc @ 0x103078bc; action wrapper handler
- @ 0x10eb42d0; action dispatch table entry

:::

### `GetSortCapabilities`

visibility `advertised` · reachability `callable` · dispatch `direct`

Reports which orderings the library can return results in. In other words, what sorts you can legally ask a Browse call for.

**TODO:** Established: direct dispatch to handler 0x10307cc0; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10307cc0, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Returns sort capabilities via impl->v\[+0x8\].

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `SortCaps` | response field | impl-produced / per the parser/emitter |

- **`SortCaps`**: SortCaps capability field emitted by impl 0x10307bf4
  - validation: arg-name string 'out' loaded at 0x10307c48 inside f_10307bf4

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10307cc0; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1); member delegates: r4 v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307cc0; req-vfunc call map: {'0x14': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0x8\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307cc0; member vfunc calls: \['r4 v\[+0x8\]'\]

:::


#### Side effects

- read-only query delegate: r4 v\[+0x8\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r4 v\[+0x8\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307cc0; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307cc0; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307cc0; commit/fault slot usage: {'0x14': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; parse/req-layer; sites: 0x10307d40).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl single-call impl: rc = worker call result verbatim; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** literal exit paths bounded by accumulator scan
**Bounded unknown (unresolved):** call-derived rc values from worker/delegate chain



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10307cc0`
- dispatch entry `0x10eb42dc`
- impl call `0x10307cec` obj `r4-in` slot `8` arg4 `r4-in`

- fn 0x10307cc0 @ 0x10307cc0; action wrapper handler
- @ 0x10eb42dc; action dispatch table entry
- @ 0x10307bf4; tail target of handler

:::

### `GetSystemUpdateID`

visibility `advertised` · reachability `callable` · dispatch `direct`

Reports the library's global version number, a counter that increments whenever anything in the library changes. Apps compare it against what they last saw to detect that the collection changed under them.

**TODO:** Established: direct dispatch to handler 0x1030751c; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x1030751c, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Returns the system update Id via impl->v\[+0x8\].

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Id` | unsigned int32 | unrestricted/impl-validated per 0x10302640 / length-bounded by parse-helper buffer cap |

- **`Id`**: produced by impl 0x10302640 via media-store member this+0x168
  - special values: see impl 0x10302640
  - validation: impl-produced

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x1030751c; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x10\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: r4 v\[+0x8\], r30 v\[+0x10\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1030751c; req-vfunc call map: {'0x14': 1, '0x24': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x10\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r4 v\[+0x8\], r30 v\[+0x10\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1030751c; member vfunc calls: \['r4 v\[+0x8\]', 'r30 v\[+0x10\]'\]

:::


#### Side effects

- read-only query delegate: r4 v\[+0x8\], r30 v\[+0x10\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query delegate: r4 v\[+0x8\], r30 v\[+0x10\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x10\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r4 v\[+0x8\], r30 v\[+0x10\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1030751c; no transition-literal/store pattern; member delegates: \['r4 v\[+0x8\]', 'r30 v\[+0x10\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1030751c; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x1030751c; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0xc': 1}

:::


#### Errors

**`402`**

impl 0x10302640: single exit returns 0; the action never faults from the impl -- only the handler request-gate can emit 402 | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



:::

::: details Implementation & reverse-engineering evidence

- handler `0x1030751c`
- dispatch entry `0x10eb42e8`
- impl call `0x10307554` obj `r4-in` slot `8` arg4 `r4-in`
- impl call `0x10307574` obj `r5-in` slot `16` arg4 `sp-0x18`
- impl call `0x10307590` obj `r4-in` slot `20` arg4 `vret(r5-in,+0x10)`
- req vcall `0x103075fc` slot `12` (commit)

- fn 0x1030751c @ 0x1030751c; action wrapper handler
- @ 0x10eb42e8; action dispatch table entry

:::

### `RefreshShareIndex`

visibility `advertised` · reachability `callable` · dispatch `direct`

Triggers a rescan of the music shares, which is the 'Update Music Library' command. The player re-walks the shared folders and rebuilds its index of what's available.

**TODO:** Established: direct dispatch to handler 0x10306f60; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10306f60, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Triggers a share-index refresh (AlbumArtistDisplayOption) via impl->v\[+0x30\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AlbumArtistDisplayOption` | SonosUintArg | yes | unrestricted/impl-validated per 0x10302b78 / max 1023 chars | none - required argument |

- **`AlbumArtistDisplayOption`**: request-layer string/int parsed and handed to media-store impl 0x10302b78
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10306f60; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x30\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x30\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306f60; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r30 v\[+0x30\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r30 v\[+0x30\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306f60; member vfunc calls: \['r30 v\[+0x30\]'\]

:::


#### Side effects

- state-mutation delegate: r30 v\[+0x30\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: r30 v\[+0x30\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x30\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x30\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306f60; no transition-literal/store pattern; member delegates: \['r30 v\[+0x30\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306f60; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306f60; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(r5-in,+0x30); parse/req-layer; sites: 0x10306ffc).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl impl literal exit returns 0; two out-branches tail into sched thunks -> f_1010eafc domain {0,720}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** literal exit paths bounded by accumulator scan
**Bounded unknown (unresolved):** call-derived rc values from worker/delegate chain

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
worker/delegate rc domain adds \[710\] beyond the documented accumulator bound

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved

propagated reachability; site-level trigger undecoded



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10306f60`
- dispatch entry `0x10eb42f4`
- impl call `0x10306fe0` obj `r5-in` slot `48` arg4 `sp-0x414`
- impl call `0x10307044` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x10306fc0` slot `8` (parse)

- fn 0x10306f60 @ 0x10306f60; action wrapper handler
- @ 0x10eb42f4; action dispatch table entry

:::

### `RequestResort`

visibility `advertised` · reachability `callable` · dispatch `direct`

Asks the library to re-sort its index. This is housekeeping after changes that affect ordering, like a new album-artist display setting.

**TODO:** Established: direct dispatch to handler 0x10307050; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10307050, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Requests an index resort (SortOrder) via impl->v\[+0x34\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `SortOrder` | SonosStringArg | yes | unrestricted/impl-validated per 0x103028f0 / max 1023 chars | none - required argument |

- **`SortOrder`**: request-layer string/int parsed and handed to media-store impl 0x103028f0
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10307050; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x34\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+0x34\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307050; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r30 v\[+0x34\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r30 v\[+0x34\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307050; member vfunc calls: \['r30 v\[+0x34\]'\]

:::


#### Side effects

- state-mutation delegate: r30 v\[+0x34\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: r30 v\[+0x34\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x34\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x34\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307050; no transition-literal/store pattern; member delegates: \['r30 v\[+0x34\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307050; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307050; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(r5-in,+0x34); parse/req-layer; sites: 0x103070ec).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl impl literal exit returns 0; one out-branch tail into sched thunk -> f_1010eafc domain {0,720}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- impl/store gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
worker/delegate rc domain adds \[701, 711\] beyond the documented accumulator bound

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved

propagated reachability; site-level trigger undecoded



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10307050`
- dispatch entry `0x10eb4300`
- impl call `0x103070d0` obj `r5-in` slot `52` arg4 `sp-0x414`
- impl call `0x10307134` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x103070b0` slot `8` (parse)

- fn 0x10307050 @ 0x10307050; action wrapper handler
- @ 0x10eb4300; action dispatch table entry

:::

### `SetBrowseable`

visibility `advertised` · reachability `callable` · dispatch `direct`

Turns the library's browseability on or off, effectively hiding or exposing the local index to controllers. An off library does not show up to browse.

**TODO:** Established: direct dispatch to handler 0x10307424; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10307424, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Sets Browseable flag via impl->v\[+0x40\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Browseable` | SonosStringArg | yes | unrestricted/impl-validated per 0x10302488 / length-bounded by parse-helper buffer cap | none - required argument |

- **`Browseable`**: request-layer string/int parsed and handed to media-store impl 0x10302488
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x18`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10307424; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+?\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: r30 v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x10307424; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r30 v\[+?\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r30 v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x10307424; member vfunc calls: \['r30 v\[+?\]'\]

:::


#### Side effects

- state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: r30 v\[+?\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
  - **TODO:** Next step: resolve that target and re-derive this section's semantics.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x10307424; no transition-literal/store pattern; member delegates: \['r30 v\[+?\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307424; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10307424; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`800`**

dead action: validly parsed calls always fault with this code; malformed requests may still fail earlier at the request-validation gate (402)

- any invocation; impl body is li r3,0x320; blr

**`402`**

Wrapper parse layer rejected an argument before the impl call.

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10307424`
- dispatch entry `0x10eb430c`
- impl call `0x103074ac` obj `r5-in` slot `64` arg4 `*(sp-0x30+0x18)`
- impl call `0x10307510` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10307480` slot `8` (parse)
- impl f_10302488 = unconditional 0x320 stub (dead action). Dead-action semantics: every structurally valid call reaches the impl and faults with the fixed code; malformed requests can still fail earlier inside the wrapper (402 gate).

- fn 0x10307424 @ 0x10307424; action wrapper handler
- @ 0x10eb430c; action dispatch table entry

:::

### `UpdateObject`

visibility `advertised` · reachability `callable` · dispatch `direct`

Edits one field of a library object, as in 'change this tag's value to that'. It is used to rename a playlist or tweak an item's stored metadata.

**TODO:** Established: direct dispatch to handler 0x10306d28; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10306d28, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Updates ObjectID: CurrentTagValue -> NewTagValue via impl->v\[+0x24\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `ObjectID` | SonosStringArg | yes | unrestricted/impl-validated per 0x10302e2c / max 1023 chars | none - required argument |
| `CurrentTagValue` | SonosBoolArg | yes | unrestricted/impl-validated per 0x10302e2c / max 4095 chars | none - required argument |
| `NewTagValue` | SonosBoolArg | yes | unrestricted/impl-validated per 0x10302e2c / max 4095 chars | none - required argument |

- **`ObjectID`**: request-layer string/int parsed and handed to media-store impl 0x10302e2c
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x400`
- **`CurrentTagValue`**: request-layer string/int parsed and handed to media-store impl 0x10302e2c
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x1000`
- **`NewTagValue`**: request-layer string/int parsed and handed to media-store impl 0x10302e2c
  - validation: request parse proven; impl applies media-store semantics
  - buffer cap: `0x1000`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10306d28; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1, commit×1); member delegates: r30 v\[+0x24\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1, commit×1); member delegates: r30 v\[+0x24\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306d28; req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): r30 v\[+0x24\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): r30 v\[+0x24\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306d28; member vfunc calls: \['r30 v\[+0x24\]'\]

:::


#### Side effects

- state-mutation delegate: r30 v\[+0x24\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: r30 v\[+0x24\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x24\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): r30 v\[+0x24\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306d28; no transition-literal/store pattern; member delegates: \['r30 v\[+0x24\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306d28; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10306d28; commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(r5-in,+0x24); parse/req-layer; sites: 0x10306e1c).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
impl accumulator r30: {711 literal (0x10302e88), 701 resolver fail (0x10302ef0), arg r5-seeded, call/lwz-derived}; rc forwarded verbatim via req v\[+0x14\] | Wrapper parse layer rejected an argument before the impl call.

- req or impl gate failed
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** literal exit paths bounded by accumulator scan
**Bounded unknown (unresolved):** call-derived rc values from worker/delegate chain | resolver f_1034a224 -> f_10349d00 path-walk (ptr/NULL)

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
favorites/userradio store-commit layer (dirObjFavorites vfunc -> f_10384490 userradio.xml atomic save): reachable codes {402,501,701,702,803,805,806,807}. Proven rungs in f_10384490: 805 = store count field *(ctx+0x20)>=70 (favorites cap); 806 = ftell()>0x20000 (serialized XML >128KiB); 807 = phase *(ctx+0x1c)>=6 with flag +0x30; 803 = phase *(ctx+0x1c)<2; 702 = flag *(ctx+0x2e); 501 = .tmp open failure; 402/701 = arg/resolver gates. Internal error strings (Invalid favorite id / Could not access favorites / initContentResource parse URI,extract item ID,Invalid item ID,No valid mapping for item type / Failed to parse account service ID) collapse into this rc domain on the wire. Applies when the ObjectID resolves into the favorites/userradio directory (FV:/R: prefixes).

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved

indirect dirObj-vfunc edge - bl-scan cannot see it; vtable xref proves reachability



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10306d28`
- dispatch entry `0x10eb4318`
- impl call `0x10306e00` obj `r5-in` slot `36` arg4 `sp-0x2414`
- impl call `0x10306e64` obj `*(sp-0x2430+0x242c)` slot `12` arg4 `402`
- req vcall `0x10306dd8` slot `8` (parse)

- fn 0x10306d28 @ 0x10306d28; action wrapper handler
- @ 0x10eb4318; action dispatch table entry

:::

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
| `SearchCapabilities` | string | no | non-evented ContentDirectory state variable: read via action out-args, not pushed |
| `SortCapabilities` | string | no | non-evented ContentDirectory state variable: read via action out-args, not pushed |
| `SystemUpdateID` | ui4 | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `ContainerUpdateIDs` | string | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `ShareIndexInProgress` | boolean | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `ShareIndexLastError` | string | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `UserRadioUpdateID` | string | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `SavedQueuesUpdateID` | string | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `ShareListUpdateID` | string | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `RecentlyPlayedUpdateID` | string | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `Browseable` | boolean | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `RadioFavoritesUpdateID` | ui4 | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `RadioLocationUpdateID` | ui4 | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |
| `FavoritesUpdateID` | string | yes | evented state variable: appears in ContentDirectory LastChange/GENA event notifications |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /MediaServer/ContentDirectory/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `contentDirectory`, `indexerStatus`, `favoritesVersionChange`, `playlistsVersionChange`
::: details Technical details

- **notify_path:** f_103035c4 emits {ContainerUpdateIDs, ShareIndexInProgress} + f_10303de4 emits {FavoritesUpdateID, SavedQueuesUpdateID, ShareListUpdateID, RadioFavoritesUpdateID} via event-bus workers f_1067693c/f_1067cdd0
- **wss_registry:**
  - idx: 23, name: contentDirectory, id: 80, tag: 68
  - idx: 42, name: indexerStatus, id: 152, tag: 23
  - idx: 31, name: favoritesVersionChange, id: 115, tag: 11
  - idx: 50, name: playlistsVersionChange, id: 195, tag: 34
- **todo:** `Established: the GENA SUBSCRIBE acceptance path is documented; no LastChange template exists for this service (the registry only carries AVT/RCS/Queue); WSS event names attributed: `contentDirectory`, `indexerStatus`, `favoritesVersionChange`, `playlistsVersionChange`.`, `Still unknown: the notify emission path inside the binary is not recovered; the WSS attribution is name-based, not call-site-proven.`, `Next step: trace the service's notify emit call (GENA sender or WSS registry consumer) to recover the emission path.`

:::


## Dispatcher-level errors

::: details Technical details

**`401`**

Established: fault sites and trigger conditions for code 401 are documented with binary evidence.
Still unknown: the complete emit-site set for this code across the dispatcher is not exhaustively enumerated.
Next step: sweep the dispatcher fault table for additional emit sites of this code.
unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search



:::

## Notes

::: details Technical details

None Browse internals decoded: handler shim 0x10306b3c -> real handler f_10304390 -> executor f_103042f0. BrowseFlag is literal-validated (BrowseDirectChildren / BrowseMetadata, else 402); DIDL output is generated by per-item writer callbacks (f_10306088/0x10306098/0x103060a8) driven through request v\[+0x24\]. UpdateID comes from the container record via f_1034a224(obj+0x168, selector 0x2bd).

:::

Implementation sources (recovered): `compiled lib (libsonos-upnp family): impl classes generated/static`

::: details Service evidence (3)

- @ 0x101953c8; service router function
- @ 0x10eb4258; service vtable
- @ 0x10307608; service dispatcher

:::
