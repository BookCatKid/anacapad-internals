# `QPlay` — `/QPlay/Control`

**visibility** `advertised` · **status** `confirmed`

Tencent QPlay handshake - the single-action auth protocol used by QQ Music clients on Chinese-market zones. The device description advertises QPlay:2 capability via qq:X_QPlay_SoftwareCapability rather than a serviceType.

**Technical description:** QPlay (QQ Music) authentication service stub; the extractor resolved no handler for QPlayAuth — likely registered but dispatch entry unresolved in this build.

## Availability

- capability flags `0x800`
- enabled gate: `xor(*(r3-in+0x571c))` at `0x10195670` (field_inverted)
- Service object constructed at zone-player init; always registered in this build - no feature-gate found at the registration site

## Dispatch

- router `0x101953c8`, cap flags `0x800`
- dispatcher `0x1073a4f0` kind `strcmp`

## Actions

| Action | Visibility | Reachability | Confidence | Dispatch | Error codes |
|---|---|---|---|---|---|
| `QPlayAuth` | advertised | callable | `confirmed` | strcmp-dispatched | 401, 402 |

### `QPlayAuth`

visibility `advertised` · reachability `callable` · confidence `confirmed` · dispatch `strcmp-dispatched`

Auth exchange: client sends a Seed string; the player returns Code, MID and DID used to derive the session key. Faults if the seed doesn't decode.

**Technical description:** QPlay authentication: parses required Seed, computes a device-bound auth Code plus MID/DID device identifiers, and returns them. Fully decoded: dispatcher f_1073a4f0 strcmp-matches the action name -> svc->v\[+0x0c\]=f_1073a5d0 parses Seed (cap 0x80, f_1056157c) -> req->v\[+0x08\] gate (402 on fail) -> impl->v\[+0x08\]=f_104666b4 computes Code via f_10906304 over Seed + device material -> emits Code/MID/DID via req->v\[+0x24\] -> commits via req->v\[+0x0c\]. Impl unconditionally returns 0.

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Seed` | string argument | yes | seed string consumed verbatim by auth hash f_10906304 / max 127 chars | none; required input |

- **`Seed`** — client seed string feeding the auth-code computation f_10906304; required
  - validation: required-arg parse precedes impl call; req->v\[+0x08\] gate emits 402 on failure
  - buffer cap: `0x80`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Code` | response field | impl-produced / per the response writer |
| `MID` | response field | impl-produced / per the response writer |
| `DID` | response field | impl-produced / per the response writer |

- **`Code`** — auth code computed by impl f_104666b4 via f_10906304 over Seed + device material
  - validation: emitted via req->v\[+0x24\] tagged emitter
- **`MID`** — device value formatted via snprintf_chk (%u)
  - validation: emitted via req->v\[+0x24\] tagged emitter
- **`DID`** — device value formatted via snprintf_chk (%u)
  - validation: emitted via req->v\[+0x24\] tagged emitter

#### Validation `confirmed`

req->v\[+0x08\] validation gate; failure emits 402 (literal 0x192 at 0x1073a6b8)
<details><summary>Evidence (2)</summary>

- @ 0x1073a5d0 — validate gate + 0x192 literal
- @ 0x1073a6b8 — 0x192 -> req->v\[+0x14\]

</details>


#### Requirements / preconditions `confirmed`

Seed is required: parse via f_1056157c precedes the impl call and the req->v\[+0x08\] gate rejects missing/malformed args with 402
<details><summary>Evidence (1)</summary>

- @ 0x1073a5d0 — required-arg parse order + gate

</details>


#### State dependencies `confirmed`

auth computation reads device-identity material via f_106453a8/f_1064548c lookups inside impl f_104666b4; impl object injected into svc+4 by ctor f_1073a768 (called at 0x1018f28c)
<details><summary>Evidence (2)</summary>

- @ 0x104666b4 — device-material lookups
- @ 0x1018f28c — impl ctor injection site

</details>


#### Side effects

- Stores the action-name pointer into ctx+0x70 member +0xe0 and TLS+0x28 (f_100ad1bc/f_100a9750); auth computation itself returns 0 with no persistent mutation in this build.

#### State transitions `confirmed`

none: no state-machine mutation in handler f_1073a5d0 or impl f_104666b4 beyond the action-name/TLS stores
<details><summary>Evidence (1)</summary>

- @ 0x104666b4 — read-only auth computation + return 0

</details>


#### Events `confirmed`

none emitted: impl f_104666b4 returns 0 unconditionally with no event/notify call; the only side effect is the action-name store into ctx+0x70 member +0xe0 and TLS+0x28
<details><summary>Evidence (1)</summary>

- @ 0x104666b4 — unconditional return 0, no event emitter calls

</details>


#### Return behavior `confirmed`

impl returns 0 unconditionally -> success response commits Code/MID/DID via req->v\[+0x24\] emitters then req->v\[+0x0c\]; nonzero would surface via the same fault/commit path
<details><summary>Evidence (2)</summary>

- @ 0x104666b4 — return 0
- @ 0x1073a5d0 — emit + commit tail

</details>


#### Errors

**`402`** `confirmed`

request-validate gate failed (req->v\[+0x08\] returned 0)

- req->v\[+0x08\] request gate fails (handler literal 0x192 at 0x1073a6b8)

**`401`** `confirmed`

unknown action name on QPlay dispatcher

- action name != QPlayAuth (dispatcher strcmp) (dispatcher fault 0x1073a548)


<details><summary>Implementation & reverse-engineering evidence</summary>

- Dispatcher f_1073a4f0 strcmp-matches "QPlayAuth", stores the action name into ctx+0x70 member +0xe0 and into TLS+0x28 via f_100ad1bc/f_100a9750, then calls svc->v\[+0x0c\] = f_1073a5d0: parses required Seed (cap 0x80 via f_1056157c), req->v\[+0x08\] gate (else 402), then impl->v\[+0x08\] = f_104666b4 which computes Code via f_10906304 over the Seed plus device material (f_106453a8/f_1064548c lookups), formats a %u device value into the MID/DID buffers via snprintf_chk, and unconditionally returns 0. Success emits Code/MID/DID via req->v\[+0x24\] then commits via req->v\[+0x0c\].

- @ 0x1073a528 — strcmp dispatch site
- fn 0x1073a5d0 — svc vfunc +0x0c: Seed parse, 402 gate, impl call, Code/MID/DID emission
- fn 0x104666b4 — impl: auth-code computation + %u format; unconditional return 0

</details>

## State variables

| Name | Type | Evented | Description |
|---|---|---|---|
| `A_ARG_TYPE_Seed` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_Code` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_MID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |
| `A_ARG_TYPE_DID` | string | no | argument-type state variable (SCPD type declaration for action args; not device state, not evented) |

## Events

- **Mechanism:** GENA SUBSCRIBE accepted at /QPlay/Event via f_105e8290 (NT:upnp:event + NTS:upnp:propchange validated); notify emission path not recovered for this service
- Only 3 LastChange/event doc templates exist in rodata (RCS 0x10e88928, AVT 0x10eb29e8, Queue 0x10ed1c6c); the event-namespace registry at 0x10f0bedc-0x10f0bfa8 lists only AVT/RCS/Queue - proven: this service emits no LastChange payload
- No WSS registry name maps to this service in the 73-entry table; event surface likely absent or folded into another namespace
- **notify_path:** 'updateSharedTQPlayMode' worker ('...bad context!' log) is the QPlay state-update path; X_QPlay_SoftwareCapability static; no dedicated emitter recovered

## Dispatcher-level errors

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search


Implementation sources (recovered): `compiled lib (qplay) — no path literal`

<details><summary>Service evidence (3)</summary>

- @ 0x101953c8 — service router function
- @ 0x10f11d48 — service vtable
- @ 0x1073a4f0 — service dispatcher

</details>
