# `SystemProperties` `/SystemProperties/Control`

**visibility** `advertised`

This service is two things bolted together. First, it's the player's generic settings store: a key/value cupboard where the system keeps configuration strings that other features read, with commands to get, set, and delete named settings. Second, it holds the entire account-management family: every command for adding, editing, replacing, and removing the service-account credentials stored on the speaker, which are the saved logins that let it reach Spotify and friends without your phone. It also carries a remote-diagnostics flag Sonos support uses, a web-code command for account linking, a post-update housekeeping hook, and two ghost entries that are still advertised but dead in this build.

**TODO:** Established: the service's action surface, dispatch records, and state variables are fully documented.
**TODO:** Still unknown: arg optionality is measured per action, but the account-store impl objects behind virtual dispatch are unresolved.
**TODO:** Next step: resolve the impl functions behind each action's handler and record them per action.

::: details Technical details

System properties service: generic config string store (Get/Set/Remove) plus the account-credential management family (AddAccountX/AddOAuthAccountX/Edit*/Remove*/Replace*/Refresh*/SetAccountNicknameX/GetWebCode), RDM flag, and post-update tasks.

:::

## Availability

- capability flags `0x4`
- enabled gate: `vret(r3-in,+0x88)` at `0x1068bd5c` (expr)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x1068bc0c`, cap flags `0x4`
- dispatcher `0x1073186c` kind `table`
- action table `0x10f110f0`

## Removed / stale advertisements

- `ProvisionCredentialedTrialAccountX`: SCPD-advertised but absent from the 86.x dispatch surface; related_action references in A_ARG_TYPE_* vars are SCPD-derived
- `ResetThirdPartyCredentials`: SCPD-advertised but absent from the 86.x dispatch surface

## Actions

| Action | Visibility | Reachability | Dispatch | Error codes |
|---|---|---|---|---|
| `AddAccountX` | advertised | callable | virtual | 402 |
| `AddOAuthAccountX` | advertised | callable | virtual | 402 |
| `DoPostUpdateTasks` | advertised | callable | virtual | 402 |
| `EditAccountMd` | advertised | callable | virtual | 402 |
| `EditAccountPasswordX` | advertised | callable | virtual | 402 |
| `EnableRDM` | advertised | callable | virtual | 402 |
| `GetRDM` | advertised | callable | virtual | 402 |
| `GetString` | advertised | callable | virtual | 402 |
| `GetWebCode` | advertised | callable | virtual | 402 |
| `RefreshAccountCredentialsX` | advertised | callable | virtual | 402 |
| `Remove` | advertised | callable | virtual | 402 |
| `RemoveAccount` | advertised | callable | virtual | 402 |
| `ReplaceAccountX` | advertised | callable | virtual | 402 |
| `SetAccountNicknameX` | advertised | callable | virtual | 402 |
| `SetString` | advertised | callable | virtual | 402 |

### `AddAccountX`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Adds a new service account to the speaker, the classic username-and-password path for attaching a music service. You supply the service type plus the login ID and password, and the account is stored so the player can reach the service on its own.

**TODO:** Established: virtual dispatch to handler 0x10731f28; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10731f28, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Adds a service account: AccountType/AccountID/AccountPassword via impl->v\[+0x18\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AccountType` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / parser-type bounded | none; required |
| `AccountID` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 127 chars | none; required |
| `AccountPassword` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 63 chars | none; required |

- **`AccountType`**: music-service account type code
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x105614e0) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountType` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountType`'s use inside the action's impl worker.
  - buffer cap: `0x18`
- **`AccountID`**: existing account id
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountID` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountID`'s use inside the action's impl worker.
  - buffer cap: `0x80`
- **`AccountPassword`**: account password string forwarded to account-add impl
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountPassword` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountPassword`'s use inside the action's impl worker.
  - buffer cap: `0x40`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `AccountUDN` | response field | impl-produced / per the response writer |

- **`AccountUDN`**: issued service-account UDN
  - validation: emitted via req->v\[+0x24/+0x28\] response writer vfunc

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10731f28; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, optional-arg fetch×2, 0x28×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x18\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, optional-arg fetch×2, 0x28×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x18\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731f28; req-vfunc call map: {'0x1c': 1, '0x20': 2, '0x8': 1, '0x14': 1, '0x28': 1, '0x10': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x18\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x18\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731f28; member vfunc calls: \['*(r30+4) v\[+0x18\]'\]

:::


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x18\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: *(r30+4) v\[+0x18\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x18\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x18\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731f28; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x18\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731f28; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731f28; commit/fault slot usage: {'0x1c': 1, '0x20': 2, '0x8': 1, '0x14': 1, '0x28': 1, '0x10': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(*(r3-in+0x4),+0x18); parse/req-layer; sites: 0x10732030).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; CR0.eq = success
**Bounded unknown (unresolved):** concrete rc domain of this impl

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803,806,809,810}): 'UserIdHash already exists', 'Failure to mark accounts for reporting', 'Account added. Returning UDN=%s' paths

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Optionality measured per-arg: \['AccountType'\] via required-lookup v\[+0x1c\], \['AccountID', 'AccountPassword'\] via optional-lookup v\[+0x20\].


:::

::: details Implementation & reverse-engineering evidence

- handler `0x10731f28`
- dispatch entry `0x10f110f0` (voff `28`)
- impl call `0x10732014` obj `*(r3-in+0x4)` slot `24` arg4 `*(sp-0x180+0x18)`
- impl call `0x10732094` obj `vret(*(sp-0x180+0x17c),+0x28)` slot `16` arg4 `sp+0xdc`
- impl call `0x107320a8` obj `*(sp-0x180+0x17c)` slot `12` arg4 `?`
- req vcall `0x10731fe4` slot `8` (parse)
- req vcall `0x10732080` slot `40` (other)

- fn 0x10731f28 @ 0x10731f28; action wrapper handler
- @ 0x10f110f0; action dispatch table entry
- fn 0x1068f8cc; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x18

:::

### `AddOAuthAccountX`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Adds a service account using OAuth-style credentials instead of a raw password. This is the modern login flow where the app hands the player a token and key obtained from the service's sign-in page. It takes a full bundle of credential fields and registers the account.

**TODO:** Established: virtual dispatch to handler 0x10732454; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10732454, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Adds an OAuth account: 8 credential fields via impl->v\[+0x1c\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AccountType` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / parser-type bounded | none; required |
| `AccountToken` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 2049 chars | none; required |
| `AccountKey` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 2049 chars | none; required |
| `OAuthDeviceID` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 65 chars | none; required |
| `AuthorizationCode` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 1025 chars | none; required |
| `RedirectURI` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 8193 chars | none; required |
| `UserIdHashCode` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 25 chars | none; required |
| `AccountTier` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / parser-type bounded | none; required |

- **`AccountType`**: music-service account type code
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x105614e0) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountType` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountType`'s use inside the action's impl worker.
  - buffer cap: `0x18`
- **`AccountToken`**: OAuth token string
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountToken` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountToken`'s use inside the action's impl worker.
  - buffer cap: `0x802`
- **`AccountKey`**: OAuth key string
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountKey` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountKey`'s use inside the action's impl worker.
  - buffer cap: `0x802`
- **`OAuthDeviceID`**: OAuth device identifier arg to account-add impl
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `OAuthDeviceID` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `OAuthDeviceID`'s use inside the action's impl worker.
  - buffer cap: `0x42`
- **`AuthorizationCode`**: OAuth authorization code
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AuthorizationCode` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AuthorizationCode`'s use inside the action's impl worker.
  - buffer cap: `0x402`
- **`RedirectURI`**: OAuth redirect URI
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `RedirectURI` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `RedirectURI`'s use inside the action's impl worker.
  - buffer cap: `0x2002`
- **`UserIdHashCode`**: user id hash arg to account-add impl
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `UserIdHashCode` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `UserIdHashCode`'s use inside the action's impl worker.
  - buffer cap: `0x1a`
- **`AccountTier`**: account tier code
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x105614e0) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountTier` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountTier`'s use inside the action's impl worker.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `AccountUDN` | response field | impl-produced / per the response writer |
| `AccountNickname` | response field | impl-produced / per the response writer |

- **`AccountUDN`**: issued service-account UDN
  - validation: emitted via req->v\[+0x24/+0x28\] response writer vfunc
- **`AccountNickname`**: issued account nickname
  - validation: emitted via req->v\[+0x24/+0x28\] response writer vfunc

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10732454; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (none)
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (none).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732454; req-vfunc call map: {}

:::


#### State dependencies

service-internal state reached through member delegate(s): none - impl works on req/inline members only
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): none - impl works on req/inline members only.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732454; member vfunc calls: \[\]

:::


#### Side effects

- impl delegates op internally (no member vfunc call captured); arg-driven, stores=0
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - impl delegates op internally (no member vfunc call captured); arg-driven, stores=0.
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): none
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): none.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732454; no transition-literal/store pattern; member delegates: \[\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732454; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732454; commit/fault slot usage: {}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; sites: 0x10732650, 0x107327c8).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0)

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; CR0.eq = success
**Bounded unknown (unresolved):** concrete rc domain of this impl

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803,806,809,810}): 'UserIdHash already exists', 'Failure to mark accounts for reporting', 'Account added. Returning UDN=%s' paths

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Optionality measured per-arg: \['AccountType', 'AccountTier'\] via required-lookup v\[+0x1c\], \['AccountToken', 'AccountKey', 'OAuthDeviceID', 'AuthorizationCode', 'RedirectURI', 'UserIdHashCode'\] via optional-lookup v\[+0x20\].


:::

::: details Implementation & reverse-engineering evidence

- handler `0x10732454`
- dispatch entry `0x10f110fc` (voff `32`)
- impl call `0x1073272c` obj `*(r3-in+0x4)` slot `28` arg4 `*(sp+0x0+0x24)`
- impl call `0x10732768` obj `vret(r4-in,+0x28)` slot `16` arg4 `sp+0xcc`
- impl call `0x10732798` obj `vret(r4-in,+0x28)` slot `16` arg4 `sp+0x48`
- req vcall `0x10732620` slot `8` (parse)
- req vcall `0x10732754` slot `40` (other)
- req vcall `0x10732784` slot `40` (other)
- req vcall `0x107327ac` slot `12` (commit)

- fn 0x10732454 @ 0x10732454; action wrapper handler
- @ 0x10f110fc; action dispatch table entry
- fn 0x1068b7d0; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x1c

:::

### `DoPostUpdateTasks`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Runs the housekeeping jobs that should happen after a firmware update, meaning the migration and cleanup steps the system wants performed once the new software is up. It is invoked by the update flow rather than by users.

**TODO:** Established: virtual dispatch to handler 0x10732e24; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10732e24, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Runs post-update migration/cleanup tasks via impl->v\[+0x14\].

:::

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10732e24; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, commit×1); member delegates: *(r3+4) v\[+0x38\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, commit×1); member delegates: *(r3+4) v\[+0x38\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732e24; req-vfunc call map: {'0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r3+4) v\[+0x38\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r3+4) v\[+0x38\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732e24; member vfunc calls: \['*(r3+4) v\[+0x38\]'\]

:::


#### Side effects

- state-mutation delegate: *(r3+4) v\[+0x38\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: *(r3+4) v\[+0x38\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r3+4) v\[+0x38\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r3+4) v\[+0x38\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732e24; no transition-literal/store pattern; member delegates: \['*(r3+4) v\[+0x38\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732e24; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732e24; commit/fault slot usage: {'0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret; parse/req-layer; sites: 0x10732e24).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; CR0.eq = success
**Bounded unknown (unresolved):** concrete rc domain of this impl

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10732e24`
- dispatch entry `0x10f11108` (voff `60`)
- impl call `0x10732e74` obj `r4-in` slot `20` arg4 `vret(*(r3-in+0x4),+0x38)`
- impl call `0x10732e90` obj `*(*(r4-in+0x0)+0x14)` slot `12` arg4 `vret(*(r3-in+0x4),+0x38)`
- req vcall `0x10732e48` slot `56` (commit)

- fn 0x10732e24 @ 0x10732e24; action wrapper handler
- @ 0x10f11108; action dispatch table entry
- @ 0x10732e24; handler body: impl call + fault/commit only; no parse or emit arg sites

:::

### `EditAccountMd`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Edits the metadata attached to a stored service account, which is the extra descriptive data the service keeps about a login, distinct from the password itself.

**TODO:** Established: virtual dispatch to handler 0x10732310; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10732310, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Edits account metadata: AccountType/AccountID/NewAccountMd via impl->v\[+0x30\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AccountType` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / parser-type bounded | none; required |
| `AccountID` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / max 127 chars | none; required |
| `NewAccountMd` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / max 127 chars | none; required |

- **`AccountType`**: music-service account type code
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x105614e0) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountType` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountType`'s use inside the action's impl worker.
  - buffer cap: `0x18`
- **`AccountID`**: existing account id
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountID` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountID`'s use inside the action's impl worker.
  - buffer cap: `0x80`
- **`NewAccountMd`**: new account metadata payload arg
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `NewAccountMd` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `NewAccountMd`'s use inside the action's impl worker.
  - buffer cap: `0x80`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10732310; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1, commit×1); member delegates: *(r30+4) v\[+0x30\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×3, validate×1, commit×1); member delegates: *(r30+4) v\[+0x30\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732310; req-vfunc call map: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x30\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x30\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732310; member vfunc calls: \['*(r30+4) v\[+0x30\]'\]

:::


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x30\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: *(r30+4) v\[+0x30\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x30\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x30\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732310; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x30\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732310; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732310; commit/fault slot usage: {'0x1c': 3, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(*(r3-in+0x4),+0x30); parse/req-layer; sites: 0x10732400).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803,806,809,810}): 'UserIdHash already exists', 'Failure to mark accounts for reporting', 'Account added. Returning UDN=%s' paths

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10732310`
- dispatch entry `0x10f11114` (voff `52`)
- impl call `0x107323e4` obj `*(r3-in+0x4)` slot `48` arg4 `*(sp-0x130+0x18)`
- impl call `0x10732448` obj `*(sp-0x130+0x12c)` slot `12` arg4 `402`
- req vcall `0x107323bc` slot `8` (parse)

- fn 0x10732310 @ 0x10732310; action wrapper handler
- @ 0x10f11114; action dispatch table entry
- fn 0x101953c0; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x30

:::

### `EditAccountPasswordX`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Supposed to change the password on a stored service account, but in this firmware build it is a documented no-op: the routine behind it is an empty routine that accepts the request, returns success, and updates nothing. The command remains advertised in the spec, but the actual password-edit feature was removed. Account credentials now change through the replace and refresh commands instead.

**TODO:** Established: virtual dispatch to handler 0x107321cc; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x107321cc, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Parses AccountID + NewAccountPassword, then calls impl->v\[+0x24\] which is the null stub f_1019d288 (stwu/addi/blr - no work, no state write). In this build the password-edit request is accepted and an empty success response is emitted without performing any operation.

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AccountType` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / parser-type bounded | none; required |
| `AccountID` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 127 chars | none; required |
| `NewAccountPassword` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 63 chars | none; required |

- **`AccountType`**: music-service account type code
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x105614e0) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountType` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountType`'s use inside the action's impl worker.
  - buffer cap: `0x18`
- **`AccountID`**: existing account id Parsed but provably unused: the impl is a no-op.
  - validation: consumed by impl vfunc on the shared manager object
  - buffer cap: `0x80`
- **`NewAccountPassword`**: argument NewAccountPassword Parsed but provably unused: the impl is a no-op.
  - validation: consumed by impl vfunc on the shared manager object
  - buffer cap: `0x40`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x107321cc; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, optional-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x24\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, optional-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x24\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107321cc; req-vfunc call map: {'0x1c': 1, '0x20': 2, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x24\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x24\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107321cc; member vfunc calls: \['*(r30+4) v\[+0x24\]'\]

:::


#### Side effects

- none - impl is a null stub; no state is read or written

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x24\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x24\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107321cc; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x24\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107321cc; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107321cc; commit/fault slot usage: {'0x1c': 1, '0x20': 2, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Wrapper parse layer rejected an argument before the impl call. | request-validate failure (req->v\[+0x08\] returned 0)

- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage
- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803,806,809,810}): 'UserIdHash already exists', 'Failure to mark accounts for reporting', 'Account added. Returning UDN=%s' paths

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Optionality measured per-arg: \['AccountType'\] via required-lookup v\[+0x1c\], \['AccountID', 'NewAccountPassword'\] via optional-lookup v\[+0x20\].


:::

::: details Implementation & reverse-engineering evidence

- handler `0x107321cc`
- dispatch entry `0x10f11120` (voff `40`)
- impl call `0x107322a0` obj `*(r3-in+0x4)` slot `36` arg4 `*(sp-0xf0+0x18)`
- impl call `0x10732304` obj `*(sp-0xf0+0xec)` slot `12` arg4 `402`
- req vcall `0x10732278` slot `8` (parse)

- fn 0x107321cc @ 0x107321cc; action wrapper handler
- @ 0x10f11120; action dispatch table entry
- fn 0x1019d288; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x24
- fn 0x1019d288; impl vfunc +0x24 -> null stub

:::

### `EnableRDM`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Turns the remote-diagnostics feature on or off, the flag that controls whether Sonos's support tooling is allowed deeper access to the player for troubleshooting. Support sessions that need more than the normal logs get it by enabling RDM through this command.

**TODO:** Established: virtual dispatch to handler 0x10732c80; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10732c80, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Sets the RDM (remote diagnostics) flag via impl->v\[+0x3c\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `RDMValue` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / parser-type bounded | none; required |

- **`RDMValue`**: RDM (remote diagnostics) flag
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x10561444) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `RDMValue` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `RDMValue`'s use inside the action's impl worker.
  - buffer cap: `0x18`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10732c80; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x3c\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x3c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732c80; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x3c\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x3c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732c80; member vfunc calls: \['*(r30+4) v\[+0x3c\]'\]

:::


#### Side effects

- state mutation delegated to *(impl+0x4)->v\[+0x3c\]; impl parses args then commits via req->v\[+0x0c\]
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state mutation delegated to *(impl+0x4)->v\[+0x3c\]; impl parses args then commits via req->v\[+0x0c\].
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x3c\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x3c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732c80; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x3c\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732c80; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732c80; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(*(r3-in+0x4),+0x3c); parse/req-layer; sites: 0x10732d18).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10732c80`
- dispatch entry `0x10f1112c` (voff `64`)
- impl call `0x10732cfc` obj `*(r3-in+0x4)` slot `60` arg4 `*(sp-0x30+0x1b)`
- impl call `0x10732d60` obj `*(sp-0x30+0x2c)` slot `12` arg4 `402`
- req vcall `0x10732cdc` slot `8` (parse)

- fn 0x10732c80 @ 0x10732c80; action wrapper handler
- @ 0x10f1112c; action dispatch table entry
- fn 0x10188180; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x3c

:::

### `GetRDM`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Reports whether remote diagnostics are currently enabled. It reads back the flag set by EnableRDM, so an app or support tool can see whether deeper diagnostic access is switched on.

**TODO:** Established: virtual dispatch to handler 0x10732d6c; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10732d6c, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Reads the RDM flag via impl->v\[+0x40\].

:::

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `RDMValue` | response field | impl-produced / per the response writer |

- **`RDMValue`**: RDM flag/value emitted by handler 0x10732d6c
  - validation: arg-name string loaded at 0x10732df0 inside impl 0x1019db98; emitted via the response writer

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10732d6c; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: *(r3+4) v\[+0x40\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, out-arg write×1, commit×1); member delegates: *(r3+4) v\[+0x40\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732d6c; req-vfunc call map: {'0x14': 1, '0x24': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r3+4) v\[+0x40\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r3+4) v\[+0x40\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732d6c; member vfunc calls: \['*(r3+4) v\[+0x40\]'\]

:::


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x40\] -> out-arg); result emitted via out-arg; no state mutation in impl path
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x40\] -> out-arg); result emitted via out-arg; no state mutation in impl path.
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r3+4) v\[+0x40\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r3+4) v\[+0x40\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732d6c; no transition-literal/store pattern; member delegates: \['*(r3+4) v\[+0x40\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732d6c; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10732d6c; commit/fault slot usage: {'0x14': 1, '0x24': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(*(r3-in+0x4),+0x40); parse/req-layer; sites: 0x10732dbc).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; CR0.eq = success
**Bounded unknown (unresolved):** concrete rc domain of this impl

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10732d6c`
- dispatch entry `0x10f11138` (voff `68`)
- impl call `0x10732da0` obj `*(r3-in+0x4)` slot `64` arg4 `sp-0x15`
- impl call `0x10732dfc` obj `xor(*(r2+0xffff8ff8))` slot `36` arg4 `RDMValue`
- impl call `0x10732e18` obj `*(sp-0x30+0x2c)` slot `12` arg4 `?`
- Outputs recovered from arg-name string loads inside the impl function (extractor missed them).

- fn 0x10732d6c @ 0x10732d6c; action wrapper handler
- @ 0x10f11138; action dispatch table entry
- fn 0x10195810; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x40

:::

### `GetString`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Reads one named setting from the player's generic settings store, answering 'what is the value of this configuration key'. Other features stash strings here and fetch them back through this command.

**TODO:** Established: virtual dispatch to handler 0x107319b4; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x107319b4, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Reads config VariableName -> StringValue via impl->v\[+0xc\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `VariableName` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / max 1023 chars | none; required |

- **`VariableName`**: property variable name
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `VariableName` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `VariableName`'s use inside the action's impl worker.
  - buffer cap: `0x400`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `StringValue` | string/numeric argument record | value within the request parse cap for its type tag; consumed by the impl vfunc / parser-type bounded |

- **`StringValue`**: property string value
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (the request parser) and declared constraints are documented.
  - **TODO:** Still unknown: which impl field or worker produces `StringValue`'s emitted value is not traced.
  - **TODO:** Next step: trace `StringValue`'s use inside the action's impl worker.

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x107319b4; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0xc\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0xc\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107319b4; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0xc\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0xc\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107319b4; member vfunc calls: \['*(r30+4) v\[+0xc\]'\]

:::


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x0c\] -> out-arg); result emitted via out-arg; no state mutation in impl path
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x0c\] -> out-arg); result emitted via out-arg; no state mutation in impl path.
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0xc\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0xc\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107319b4; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0xc\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107319b4; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107319b4; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(*(r3-in+0x4),+0xc); parse/req-layer; sites: 0x10731a58).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl vfunc rc surfaced
**Bounded unknown (unresolved):** concrete rc vocabulary for this operation

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



:::

::: details Implementation & reverse-engineering evidence

- handler `0x107319b4`
- dispatch entry `0x10f11144` (voff `12`)
- impl call `0x10731a3c` obj `*(r3-in+0x4)` slot `12` arg4 `sp-0xc14`
- impl call `0x10731abc` obj `vret(*(sp-0xc30+0xc2c),+0x24)` slot `16` arg4 `sp+0x41c`
- impl call `0x10731ad0` obj `*(sp-0xc30+0xc2c)` slot `12` arg4 `?`
- req vcall `0x10731a14` slot `8` (parse)

- fn 0x107319b4 @ 0x107319b4; action wrapper handler
- @ 0x10f11144; action dispatch table entry
- fn 0x10537870; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x0c; NULL STUB impl (2-insn no-op)

:::

### `GetWebCode`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Requests a short web code for a service account type. This is the short-lived code used in link-your-account flows, where the speaker produces a code you enter on a website to connect a service without typing a password on the player.

**TODO:** Established: virtual dispatch to handler 0x10731e04; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10731e04, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Returns a WebCode for AccountType via impl->v\[+0x14\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AccountType` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / parser-type bounded | none; required |

- **`AccountType`**: music-service account type code
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x105614e0) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountType` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountType`'s use inside the action's impl worker.
  - buffer cap: `0x18`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `WebCode` | string/numeric argument record | value within the request parse cap for its type tag; consumed by the impl vfunc / parser-type bounded |

- **`WebCode`**: web-pairing code produced by impl
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (the request parser) and declared constraints are documented.
  - **TODO:** Still unknown: which impl field or worker produces `WebCode`'s emitted value is not traced.
  - **TODO:** Next step: trace `WebCode`'s use inside the action's impl worker.

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10731e04; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x14\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (out-arg store×1, raise-fault×1, required-arg fetch×1, out-arg write×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x14\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731e04; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x14\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x14\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731e04; member vfunc calls: \['*(r30+4) v\[+0x14\]'\]

:::


#### Side effects

- read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x14\] -> out-arg); result emitted via out-arg; no state mutation in impl path
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - read-only query: read-only query delegate on impl+0x4 member (*(impl+0x4)->v\[+0x14\] -> out-arg); result emitted via out-arg; no state mutation in impl path.
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x14\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x14\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731e04; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x14\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731e04; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731e04; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0x24': 1, '0x10': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(*(r3-in+0x4),+0x14); parse/req-layer; sites: 0x10731ea4).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10731e04`
- dispatch entry `0x10f11150` (voff `24`)
- impl call `0x10731e88` obj `*(r3-in+0x4)` slot `20` arg4 `*(sp-0x430+0x18)`
- impl call `0x10731f08` obj `vret(*(sp-0x430+0x42c),+0x24)` slot `16` arg4 `sp+0x1c`
- impl call `0x10731f1c` obj `*(sp-0x430+0x42c)` slot `12` arg4 `?`
- req vcall `0x10731e60` slot `8` (parse)

- fn 0x10731e04 @ 0x10731e04; action wrapper handler
- @ 0x10f11150; action dispatch table entry
- fn 0x10690b78; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x14

:::

### `RefreshAccountCredentialsX`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Refreshes the stored credentials for a music-service account, the token-renewal path. Modern services rotate credentials, and when a session token nears expiry the app calls this with the fresh token/key/ID bundle so the speaker replaces the old ones, keeping the account logged in without a full re-login.

**TODO:** Established: virtual dispatch to handler 0x107327d4; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x107327d4, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Refreshes AccountType credentials with AccountToken/AccountKey/AccountUID via impl->v\[+0x14\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AccountType` | SonosStringArg | yes | value within the request parse cap; consumed by the impl vfunc / length-bounded by parse-helper buffer cap | none - required argument |
| `AccountToken` | SonosStringArg | conditional | value within the request parse cap; consumed by the impl vfunc / max 2049 chars | absent tolerated - optional lookup via request v\[+0x20\] |
| `AccountKey` | SonosStringArg | conditional | value within the request parse cap; consumed by the impl vfunc / max 2049 chars | absent tolerated - optional lookup via request v\[+0x20\] |
| `AccountUID` | SonosStringArg | yes | value within the request parse cap; consumed by the impl vfunc / length-bounded by parse-helper buffer cap | none - required argument |

- **`AccountType`**: Account credential field consumed by impl vfunc +0x2c
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x105614e0) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountType` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountType`'s use inside the action's impl worker.
  - buffer cap: `0x18`
- **`AccountToken`**: Account credential field consumed by impl vfunc +0x2c
  - validation: optional arg fetched via request v\[+0x20\]; absent value tolerated, content capped at helper bound
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountToken` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountToken`'s use inside the action's impl worker.
  - buffer cap: `0x802`
- **`AccountKey`**: Account credential field consumed by impl vfunc +0x2c
  - validation: optional arg fetched via request v\[+0x20\]; absent value tolerated, content capped at helper bound
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountKey` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountKey`'s use inside the action's impl worker.
  - buffer cap: `0x802`
- **`AccountUID`**: Account credential field consumed by impl vfunc +0x2c
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x105614e0) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountUID` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountUID`'s use inside the action's impl worker.
  - buffer cap: `0x18`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x107327d4; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×2, required-arg fetch×2, optional-arg fetch×2, validate×1, commit×1); member delegates: *(r28+4) v\[+0x2c\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×2, required-arg fetch×2, optional-arg fetch×2, validate×1, commit×1); member delegates: *(r28+4) v\[+0x2c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107327d4; req-vfunc call map: {'0x1c': 2, '0x20': 2, '0x8': 1, '0x14': 2, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r28+4) v\[+0x2c\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r28+4) v\[+0x2c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107327d4; member vfunc calls: \['*(r28+4) v\[+0x2c\]'\]

:::


#### Side effects

- state-mutation delegate: *(r28+4) v\[+0x2c\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: *(r28+4) v\[+0x2c\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r28+4) v\[+0x2c\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r28+4) v\[+0x2c\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107327d4; no transition-literal/store pattern; member delegates: \['*(r28+4) v\[+0x2c\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107327d4; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107327d4; commit/fault slot usage: {'0x1c': 2, '0x20': 2, '0x8': 1, '0x14': 2, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; parse/req-layer; sites: 0x10732904).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; CR0.eq = success
**Bounded unknown (unresolved):** concrete rc domain of this impl

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803,806,809,810}): 'UserIdHash already exists', 'Failure to mark accounts for reporting', 'Account added. Returning UDN=%s' paths

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Optionality measured per-arg: \['AccountType'\] via required-lookup v\[+0x1c\], \['AccountToken', 'AccountKey'\] via optional-lookup v\[+0x20\].


:::

::: details Implementation & reverse-engineering evidence

- handler `0x107327d4`
- dispatch entry `0x10f1115c` (voff `48`)
- impl call `0x10732958` obj `*(sp-0x1040+0x103c)` slot `20` arg4 `402`
- impl call `0x10732980` obj `*(*(sp-0x1040+0x1030)+0x4)` slot `44` arg4 `*(sp+0x0+0x1c)`
- impl call `0x107329a0` obj `*(sp-0x1040+0x103c)` slot `12` arg4 `vret(*(*(sp-0x1040+0x1030)+0x4),+0x2c)`
- req vcall `0x107328c4` slot `8` (parse)

- fn 0x107327d4 @ 0x107327d4; action wrapper handler
- @ 0x10f1115c; action dispatch table entry
- fn 0x1019399c; shared manager secondary-base impl, slot +0x2c (thunk)

:::

### `Remove`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Deletes one named setting from the generic settings store. It is the counterpart of GetString and SetString for keys that should no longer exist.

**TODO:** Established: virtual dispatch to handler 0x10731bf8; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10731bf8, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Deletes config VariableName via impl->v\[+0x10\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `VariableName` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / max 1023 chars | none; required |

- **`VariableName`**: property variable name
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `VariableName` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `VariableName`'s use inside the action's impl worker.
  - buffer cap: `0x400`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10731bf8; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x10\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×1, validate×1, commit×1); member delegates: *(r30+4) v\[+0x10\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731bf8; req-vfunc call map: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x10\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x10\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731bf8; member vfunc calls: \['*(r30+4) v\[+0x10\]'\]

:::


#### Side effects

- state mutation delegated to *(impl+0x4)->v\[+0x10\]; impl parses args then commits via req->v\[+0x0c\]
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state mutation delegated to *(impl+0x4)->v\[+0x10\]; impl parses args then commits via req->v\[+0x0c\].
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x10\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x10\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731bf8; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x10\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731bf8; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731bf8; commit/fault slot usage: {'0x1c': 1, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(*(r3-in+0x4),+0x10); parse/req-layer; sites: 0x10731c94).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl vfunc rc surfaced
**Bounded unknown (unresolved):** concrete rc vocabulary for this operation

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803,806,809,810}): 'UserIdHash already exists', 'Failure to mark accounts for reporting', 'Account added. Returning UDN=%s' paths

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10731bf8`
- dispatch entry `0x10f11168` (voff `20`)
- impl call `0x10731c78` obj `*(r3-in+0x4)` slot `16` arg4 `sp-0x414`
- impl call `0x10731cdc` obj `*(sp-0x430+0x42c)` slot `12` arg4 `402`
- req vcall `0x10731c58` slot `8` (parse)

- fn 0x10731bf8 @ 0x10731bf8; action wrapper handler
- @ 0x10f11168; action dispatch table entry
- fn 0x10537870; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x10; NULL STUB impl (2-insn no-op)

:::

### `RemoveAccount`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Removes a stored service account by deleting the saved login for a music service, given its type and account ID. This is what happens when you remove a service from Sonos in the app.

**TODO:** Established: virtual dispatch to handler 0x107320b4; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x107320b4, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Removes AccountType/AccountID via impl->v\[+0x20\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AccountType` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / parser-type bounded | none; required |
| `AccountID` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / max 127 chars | none; required |

- **`AccountType`**: music-service account type code
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x105614e0) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountType` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountType`'s use inside the action's impl worker.
  - buffer cap: `0x18`
- **`AccountID`**: existing account id
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountID` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountID`'s use inside the action's impl worker.
  - buffer cap: `0x80`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x107320b4; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x20\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x20\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107320b4; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x20\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x20\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107320b4; member vfunc calls: \['*(r30+4) v\[+0x20\]'\]

:::


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x20\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: *(r30+4) v\[+0x20\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x20\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x20\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107320b4; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x20\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107320b4; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107320b4; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(*(r3-in+0x4),+0x20); parse/req-layer; sites: 0x10732178).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; CR0.eq = success
**Bounded unknown (unresolved):** concrete rc domain of this impl

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803,806,809,810}): 'UserIdHash already exists', 'Failure to mark accounts for reporting', 'Account added. Returning UDN=%s' paths

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



:::

::: details Implementation & reverse-engineering evidence

- handler `0x107320b4`
- dispatch entry `0x10f11174` (voff `36`)
- impl call `0x1073215c` obj `*(r3-in+0x4)` slot `32` arg4 `*(sp-0xb0+0x18)`
- impl call `0x107321c0` obj `*(sp-0xb0+0xac)` slot `12` arg4 `402`
- req vcall `0x10732138` slot `8` (parse)

- fn 0x107320b4 @ 0x107320b4; action wrapper handler
- @ 0x10f11174; action dispatch table entry
- fn 0x1069039c; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x20

:::

### `ReplaceAccountX`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Replaces one stored account's credentials wholesale, which is the command for switching a service slot from one login to another. You identify the existing account and supply the full new credential set (ID, password, token, key, and the OAuth device marker), and the speaker swaps them, returning the new account's identifier. This is the working path for account credential changes on this build, since EditAccountPasswordX is a no-op.

**TODO:** Established: virtual dispatch to handler 0x107329ac; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x107329ac, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Replaces an account's credentials: AccountUDN plus five new fields via impl->v\[+0x34\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AccountUDN` | SonosStringArg | conditional | value within the request parse cap; consumed by the impl vfunc / max 145 chars | absent tolerated - optional lookup via request v\[+0x20\] |
| `NewAccountID` | SonosStringArg | conditional | value within the request parse cap; consumed by the impl vfunc / max 129 chars | absent tolerated - optional lookup via request v\[+0x20\] |
| `NewAccountPassword` | SonosBoolArg | conditional | value within the request parse cap; consumed by the impl vfunc / max 65 chars | absent tolerated - optional lookup via request v\[+0x20\] |
| `AccountToken` | SonosStringArg | conditional | value within the request parse cap; consumed by the impl vfunc / max 2049 chars | absent tolerated - optional lookup via request v\[+0x20\] |
| `AccountKey` | SonosStringArg | conditional | value within the request parse cap; consumed by the impl vfunc / max 2049 chars | absent tolerated - optional lookup via request v\[+0x20\] |
| `OAuthDeviceID` | SonosStringArg | conditional | value within the request parse cap; consumed by the impl vfunc / max 65 chars | absent tolerated - optional lookup via request v\[+0x20\] |

- **`AccountUDN`**: Account credential field consumed by impl vfunc +0x34
  - validation: optional arg fetched via request v\[+0x20\]; absent value tolerated, content capped at helper bound
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountUDN` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountUDN`'s use inside the action's impl worker.
  - buffer cap: `0x92`
- **`NewAccountID`**: Account credential field consumed by impl vfunc +0x34
  - validation: optional arg fetched via request v\[+0x20\]; absent value tolerated, content capped at helper bound
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `NewAccountID` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `NewAccountID`'s use inside the action's impl worker.
  - buffer cap: `0x82`
- **`NewAccountPassword`**: Account credential field consumed by impl vfunc +0x34
  - validation: optional arg fetched via request v\[+0x20\]; absent value tolerated, content capped at helper bound
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `NewAccountPassword` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `NewAccountPassword`'s use inside the action's impl worker.
  - buffer cap: `0x42`
- **`AccountToken`**: Account credential field consumed by impl vfunc +0x34
  - validation: optional arg fetched via request v\[+0x20\]; absent value tolerated, content capped at helper bound
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountToken` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountToken`'s use inside the action's impl worker.
  - buffer cap: `0x802`
- **`AccountKey`**: Account credential field consumed by impl vfunc +0x34
  - validation: optional arg fetched via request v\[+0x20\]; absent value tolerated, content capped at helper bound
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountKey` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountKey`'s use inside the action's impl worker.
  - buffer cap: `0x802`
- **`OAuthDeviceID`**: Account credential field consumed by impl vfunc +0x34
  - validation: optional arg fetched via request v\[+0x20\]; absent value tolerated, content capped at helper bound
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `OAuthDeviceID` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `OAuthDeviceID`'s use inside the action's impl worker.
  - buffer cap: `0x42`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `NewAccountUDN` | response field | impl-produced / per the response writer |

- **`NewAccountUDN`**: replacement account UDN
  - validation: emitted via req->v\[+0x24/+0x28\] response writer vfunc

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x107329ac; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (out-arg store×1, raise-fault×2, optional-arg fetch×6, 0x28×1, validate×1, commit×1); member delegates: *(r28+4) v\[+?\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (out-arg store×1, raise-fault×2, optional-arg fetch×6, 0x28×1, validate×1, commit×1); member delegates: *(r28+4) v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x107329ac; req-vfunc call map: {'0x20': 6, '0x8': 1, '0x14': 2, '0x28': 1, '0x10': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r28+4) v\[+?\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r28+4) v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x107329ac; member vfunc calls: \['*(r28+4) v\[+?\]'\]

:::


#### Side effects

- state-mutation delegate: *(r28+4) v\[+?\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: *(r28+4) v\[+?\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
  - **TODO:** Next step: resolve that target and re-derive this section's semantics.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r28+4) v\[+?\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r28+4) v\[+?\].
**TODO:** Still unknown: the delegate/element this section flags as unresolved - `v\[+?\]` - is not resolved
**TODO:** Next step: resolve that target and re-derive this section's semantics.
::: details Evidence (1)

- fn 0x107329ac; no transition-literal/store pattern; member delegates: \['*(r28+4) v\[+?\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107329ac; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x107329ac; commit/fault slot usage: {'0x20': 6, '0x8': 1, '0x14': 2, '0x28': 1, '0x10': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: const; parse/req-layer; sites: 0x10732b48).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803,806,809,810}): 'UserIdHash already exists', 'Failure to mark accounts for reporting', 'Account added. Returning UDN=%s' paths

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Optionality measured per-arg: \[\] via required-lookup v\[+0x1c\], \['AccountUDN', 'NewAccountID', 'NewAccountPassword', 'AccountToken', 'AccountKey', 'OAuthDeviceID'\] via optional-lookup v\[+0x20\].


:::

::: details Implementation & reverse-engineering evidence

- handler `0x107329ac`
- dispatch entry `0x10f11180` (voff `56`)
- impl call `0x10732c08` obj `*(*(sp-0x1260+0x1250)+0x4)` slot `52` arg4 `sp+0x1b0`
- impl call `0x10732c44` obj `vret(*(sp-0x1260+0x125c),+0x28)` slot `16` arg4 `sp+0x120`
- impl call `0x10732c58` obj `*(sp-0x1260+0x125c)` slot `12` arg4 `?`
- impl call `0x10732c74` obj `*(sp-0x1260+0x125c)` slot `20` arg4 `402`
- req vcall `0x10732b18` slot `8` (parse)
- req vcall `0x10732c30` slot `40` (other)

- fn 0x107329ac @ 0x107329ac; action wrapper handler
- @ 0x10f11180; action dispatch table entry
- fn 0x1017fbe0; shared manager secondary-base impl, slot +0x34 (thunk)

:::

### `SetAccountNicknameX`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Sets the friendly name on a stored account, the label like 'Home Spotify' that shows in the app's service list when several accounts for the same service exist.

**TODO:** Established: virtual dispatch to handler 0x10731ce8; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10731ce8, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Sets AccountNickname for AccountUDN via impl->v\[+0x28\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `AccountUDN` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 143 chars | none; required |
| `AccountNickname` | string/numeric argument record | conditional | value within the request parse cap for its type tag; consumed by the impl vfunc / max 63 chars | none; required |

- **`AccountUDN`**: device UDN arg
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountUDN` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountUDN`'s use inside the action's impl worker.
  - buffer cap: `0x90`
- **`AccountNickname`**: nickname string arg
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `AccountNickname` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `AccountNickname`'s use inside the action's impl worker.
  - buffer cap: `0x40`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10731ce8; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, optional-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x28\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, optional-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x28\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731ce8; req-vfunc call map: {'0x20': 2, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x28\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x28\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731ce8; member vfunc calls: \['*(r30+4) v\[+0x28\]'\]

:::


#### Side effects

- state-mutation delegate: *(r30+4) v\[+0x28\] (call-derived member-method semantics)
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state-mutation delegate: *(r30+4) v\[+0x28\] (call-derived member-method semantics).
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x28\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x28\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731ce8; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x28\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731ce8; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731ce8; commit/fault slot usage: {'0x20': 2, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(*(r3-in+0x4),+0x28); parse/req-layer; sites: 0x10731db0).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage


**Bounded unknown (proven):** impl result in r3 -> req v\[+0x14\] fault code; CR0.eq = success
**Bounded unknown (unresolved):** concrete rc domain of this impl

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803,806,809,810}): 'UserIdHash already exists', 'Failure to mark accounts for reporting', 'Account added. Returning UDN=%s' paths

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved


#### Notes

None Optionality measured per-arg: \[\] via required-lookup v\[+0x1c\], \['AccountUDN', 'AccountNickname'\] via optional-lookup v\[+0x20\].


:::

::: details Implementation & reverse-engineering evidence

- handler `0x10731ce8`
- dispatch entry `0x10f1118c` (voff `44`)
- impl call `0x10731d94` obj `*(r3-in+0x4)` slot `40` arg4 `sp-0xa4`
- impl call `0x10731df8` obj `*(sp-0x100+0xfc)` slot `12` arg4 `402`
- req vcall `0x10731d70` slot `8` (parse)

- fn 0x10731ce8 @ 0x10731ce8; action wrapper handler
- @ 0x10f1118c; action dispatch table entry
- fn 0x1019d06c; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x28

:::

### `SetString`

visibility `advertised` · reachability `callable` · dispatch `virtual`

Writes one named setting into the player's generic settings store: 'save this configuration key with this value'. It is the generic write that the settings store accepts.

**TODO:** Established: virtual dispatch to handler 0x10731adc; the wrapper-level behavior (argument validation and fault ladder) is documented.
**TODO:** Still unknown: the implementation function behind the handler - which impl/engine function it calls and what it does there - has not been traced into this record.
**TODO:** Next step: disassemble handler 0x10731adc, follow its impl/vfunc call, and record the resolved impl function.

::: details Technical details

Writes VariableName=StringValue via impl->v\[+0x8\].

:::

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `VariableName` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / max 1023 chars | none; required |
| `StringValue` | string/numeric argument record | yes | value within the request parse cap for its type tag; consumed by the impl vfunc / max 2047 chars | none; required |

- **`VariableName`**: property variable name
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `VariableName` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `VariableName`'s use inside the action's impl worker.
  - buffer cap: `0x400`
- **`StringValue`**: property string value
  - validation: consumed by impl vfunc on the shared manager object
  - **TODO:** Established: the arg's parse path (0x1056157c) and declared constraints are documented.
  - **TODO:** Still unknown: the impl's post-parse handling of `StringValue` - which values it rejects or which impl field consumes it - is not traced.
  - **TODO:** Next step: trace `StringValue`'s use inside the action's impl worker.
  - buffer cap: `0x800`

::: details Technical analysis

#### Validation

Wrapper convention (verified on sibling handlers): inputs fetched via req->v\[+0x1c\] named lookup + typed parse helpers; req->v\[+0x8\] validity check (nonzero proceeds); impl->v\[slot\] rc -> cr0.eq emits outputs, nonzero faults through req->v\[+0x14\].
::: details Evidence (1)

- @ 0x10731adc; wrapper family decode

:::


#### Requirements / preconditions

impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x8\]
**TODO:** Established: this requirements/precondition analysis is backed by binary evidence - impl consumes in-args via req slots (raise-fault×1, required-arg fetch×2, validate×1, commit×1); member delegates: *(r30+4) v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731adc; req-vfunc call map: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### State dependencies

service-internal state reached through member delegate(s): *(r30+4) v\[+0x8\]
**TODO:** Established: this state-dependency analysis is backed by binary evidence - service-internal state reached through member delegate(s): *(r30+4) v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731adc; member vfunc calls: \['*(r30+4) v\[+0x8\]'\]

:::


#### Side effects

- state mutation delegated to *(impl+0x4)->v\[+0x08\]; impl parses args then commits via req->v\[+0x0c\]
  - **TODO:** Established: this side-effect analysis is backed by binary evidence - state mutation delegated to *(impl+0x4)->v\[+0x08\]; impl parses args then commits via req->v\[+0x0c\].
  - **TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
  - **TODO:** Next step: trace the impl/delegate path feeding this section.

#### State transitions

no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x8\]
**TODO:** Established: this state-transition analysis is backed by binary evidence - no state-machine transition literal in impl; transition, if any, inside member delegate(s): *(r30+4) v\[+0x8\].
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731adc; no transition-literal/store pattern; member delegates: \['*(r30+4) v\[+0x8\]'\]

:::


#### Events

direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method
**TODO:** Established: this event-emission analysis is backed by binary evidence - direct notify-family call(s) in impl: none - no f_1067c6ec/settings-notify call present in impl; event emission, if any, is inside the delegated member method.
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731adc; bl call scan: notify-family sites = \[\]

:::


#### Return behavior

0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\])
**TODO:** Established: this return-behavior analysis is backed by binary evidence - 0/ok -> out-args via req->v\[+0x24/+0x10\] then req->v\[+0x0c\] commit (200); failure -> req->v\[+0x14\] raise-fault with impl code (r4 lits: \[\]).
**TODO:** Still unknown: the impl-level internals behind the documented call map - which delegate or member method produces the described behavior - are not fully traced.
**TODO:** Next step: trace the impl/delegate path feeding this section.
::: details Evidence (1)

- fn 0x10731adc; commit/fault slot usage: {'0x1c': 2, '0x8': 1, '0x14': 1, '0xc': 1}

:::


#### Errors

**`402`**

Established: fault sites and trigger conditions are documented with binary evidence (expression: vret(*(r3-in+0x4),+0x8); parse/req-layer; sites: 0x10731ba4).
Still unknown: the impl-side predicate chain producing the nonzero code - the upstream worker's complete condition set is not enumerated.
Next step: trace the impl vfunc's return-code production for this action and enumerate every predicate that selects a code.
request-validate failure (req->v\[+0x08\] returned 0) | Wrapper parse layer rejected an argument before the impl call.

- request-layer validation failed; handler loads literal 0x192 and calls fault emitter svc/req->v\[+0x14\]
- Missing or unparseable input at the req->v\[+0x1c\]/helper parse stage

impl rc passthrough also present: nonzero impl r3 is passed to ->v\[+0x14\] verbatim

**`store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v[+0x14])`**

Established: the emit mechanism and code expression (store-commit rc (directory-object vfunc -> store save fn; surfaced verbatim via req v\[+0x14\])) are confirmed by binary evidence; fault path via propagated return codes (no direct fault site in this action).
Still unknown: the per-code trigger conditions are inferred from context, not decoded from the upstream worker's predicates.
Next step: disassemble the upstream worker named in the code expression and map each return code to its trigger predicate.
settings/account store rc domain (sp_impl f_1066a788 {402,501,800,811,812}; accountsmgr f_10289d48/f_1028a224/f_1028b760/f_1028ef24 {802,803,806,809,810}): 'UserIdHash already exists', 'Failure to mark accounts for reporting', 'Account added. Returning UDN=%s' paths

- the backing store-commit worker returned a nonzero code: propagated verbatim through the request-object commit vfunc; per-rung triggers decoded for the favorites ladder (count>=70->805, size>128KiB->806) and partly for savedqueues; other stores’ per-code triggers unresolved



:::

::: details Implementation & reverse-engineering evidence

- handler `0x10731adc`
- dispatch entry `0x10f11198` (voff `16`)
- impl call `0x10731b88` obj `*(r3-in+0x4)` slot `8` arg4 `sp-0xc14`
- impl call `0x10731bec` obj `*(sp-0xc30+0xc2c)` slot `12` arg4 `402`
- req vcall `0x10731b64` slot `8` (parse)

- fn 0x10731adc @ 0x10731adc; action wrapper handler
- @ 0x10f11198; action dispatch table entry
- fn 0x101935f0; shares the manager secondary-base impl object (vtable 0x10e98278) with DeviceProperties; slot +0x08

:::

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `A_ARG_TYPE_VariableName` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_VariableStringValue` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AccountType` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AccountUID` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AccountUDN` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AccountID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AccountPassword` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AccountNickname` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AccountCredential` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AccountMd` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_IsExpired` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_StubsCreated` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_RDMEnabled` | boolean | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_OAuthDeviceID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AuthorizationCode` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_UserIdHashCode` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_AccountTier` | ui4 | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_RedirectURI` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `CustomerID` | string | yes | evented state variable: appears in SystemProperties LastChange/GENA event notifications |
| `UpdateID` | ui4 | yes | evented state variable: appears in SystemProperties LastChange/GENA event notifications |
| `UpdateIDX` | ui4 | yes | evented state variable: appears in SystemProperties LastChange/GENA event notifications |
| `VoiceUpdateID` | ui4 | yes | evented state variable: appears in SystemProperties LastChange/GENA event notifications |
| `ThirdPartyHash` | string | yes | evented state variable: appears in SystemProperties LastChange/GENA event notifications |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /SystemProperties/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- Event delivery for this service's state is attributed to the WSS subscription registry (0x110b8ce8) names above - name-based attribution, registry is confirmed runtime structure
- **WSS event names:** `systemProperties`, `settingsVersionChanged`, `settingsDataChanged`, `effectiveSettingsDataChanged`, `settingsPlayerSettingsChanged`, `entitlementsVersionChanged`, `voiceAccountsVersionChange`
::: details Technical details

- **notify_path:** settings-key event path: impl setters append key\0value\0 pairs via f_10557d70 -> member->v\[+0x10\] notify -> internal event bus (SettingsNeedsUpdateEvent pool) -> GENA/WSS delivery; no dedicated per-service e:property emitter found - event source = the settings store's change list
- **payload_model:** settings-key notifications (Desired*/Current* key changes) delivered via bus; GENA initial-notify serializes current keys
- **wss_registry:**
  - idx: 62, name: systemProperties, id: 274, tag: 76
  - idx: 58, name: settingsVersionChanged, id: 252, tag: 38
  - idx: 59, name: settingsDataChanged, id: 253, tag: 38
  - idx: 27, name: effectiveSettingsDataChanged, id: 101, tag: 9
  - idx: 60, name: settingsPlayerSettingsChanged, id: 254, tag: 38
  - idx: 28, name: entitlementsVersionChanged, id: 106, tag: 10
  - idx: 71, name: voiceAccountsVersionChange, id: 313, tag: 81
- **todo:** `Established: the GENA SUBSCRIBE acceptance path is documented; no LastChange template exists for this service (the registry only carries AVT/RCS/Queue); WSS event names attributed: `systemProperties`, `settingsVersionChanged`, `settingsDataChanged`, `effectiveSettingsDataChanged`, `settingsPlayerSettingsChanged`, `entitlementsVersionChanged`.`, `Still unknown: the notify emission path inside the binary is not recovered; the WSS attribution is name-based, not call-site-proven.`, `Next step: trace the service's notify emit call (GENA sender or WSS registry consumer) to recover the emission path.`

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

Impl object is the SAME secondary-base manager subobject (vtable 0x10e98278, manager+0x3a8) used by DeviceProperties; SP and DP actions dispatch onto the same impl functions. GetString and Remove map to a 2-insn null stub (confirmed no-ops). Shares the DeviceProperties impl object (vtable 0x10e98278, mgr+0x3a8 secondary base). Slots +0x08..+0x40 alias with DP actions; +0x0c/+0x10/+0x24 are proven null stubs (GetString/Remove/EditAccountPasswordX are no-ops).

:::

## Additional records

### `dispatch`

::: details Technical details

- **kind:** name-table
- **table_addr:** 0x10f110f0
- **entry_stride:** 0xc
- **entry_shape:** {name_ptr,action_id,0}
- **entries:** 15 sorted: AddAccountX=29,AddOAuthAccountX=33,DoPostUpdateTasks=61,EditAccountMd=53,EditAccountPasswordX=41,EnableRDM=65,GetRDM=69,GetString=13,GetWebCode=25,RefreshAccountCredentialsX=49,Remove=21,RemoveAccount=37,ReplaceAccountX=57,SetAccountNicknameX=45,SetString=17
- **note:** name->action_id map; action_id is the SOAP request dispatch key; ProvisionCredentialedTrialAccountX+ResetThirdPartyCredentials absent (removed in 86.10)
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10f110f0, notes: name-table

:::

### `dispatch note`

::: details Technical details

name->action_id map at 0x10f110f0 (stride 0xc {name_ptr,id,0}); EXACTLY 15 dispatched actions (AddAccountX,AddOAuthAccountX,DoPostUpdateTasks,EditAccountMd,EditAccountPasswordX,EnableRDM,GetRDM,GetString,GetWebCode,RefreshAccountCredentialsX,Remove,RemoveAccount,ReplaceAccountX,SetAccountNicknameX,SetString) matching the DB table. 2 advertised-but-undispatched: ProvisionCredentialedTrialAccountX (string absent -> removed after 34.16, dispatched in 34.16) and ResetThirdPartyCredentials (dead string 0x10f184cc, zero ptr/code refs -> never wired; present in both 86.8 & 86.10 binaries as a leftover).

:::

Implementation sources (recovered): `common/netsettings_mgr.cxx`, `oc/common/src/devmode.cxx`, `zoneplayer/sharelist.cxx`

::: details Service evidence (3)

- @ 0x1068bc0c; service router function
- @ 0x10f110a8; service vtable
- @ 0x1073186c; service dispatcher

:::
