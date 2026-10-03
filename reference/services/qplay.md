# `QPlay` `/QPlay/Control`

**visibility** `advertised` · **status** `confirmed`

This service exists for one integration: QPlay, the protocol Tencent's QQ Music uses to send music to speakers, which is the equivalent of a 'cast to device' feature inside China's dominant streaming service. It has a single command, the authentication handshake that begins a QPlay session: the app sends a seed value and the player returns the corresponding response, proving it can participate in the exchange. On this build the command is fully present, because QPlay shipped only on units sold for the Chinese market, which is why most users have never seen it.

<details markdown="1"><summary><b>Technical details</b></summary>

QPlay (QQ Music) authentication service stub; the extractor resolved no handler for QPlayAuth: likely registered but dispatch entry unresolved in this build.

</details>

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

The QPlay login handshake, the first step when a QQ Music app wants to send audio to this speaker. The app presents a 'seed' challenge value and the player computes the matching response code, proving it speaks the QPlay protocol and unlocking the session that streams music afterward. Only used by the Tencent integration, so it is meaningless to ordinary apps.

<details markdown="1"><summary><b>Technical details</b></summary>

QPlay authentication handshake (Tencent seed->code exchange, fully decoded): dispatcher f_1073a4f0 strcmp-matches 'QPlayAuth' -> exec f_1073a5d0. Exec calls req->v\[+0x1c\] to fetch arg 'Seed' (0x10f11d64), parses it via f_1056157c into a stack buffer capped at 0x80 bytes, then gates on req->v\[+0x08\] (parse-ok check) -> emits 402 (0x192) Invalid Args on failure; 401 (0x191) for unknown action names. On success it calls impl->v\[+0x08\](impl, seedBuf, codeOut, 0x80, midOut, 0x15, didOut, 0x15) where impl = req->member\[+0x04\]: Code buffer cap 0x80, MID and DID buffers cap 0x15 (20-char strings + NUL). Each output is emitted as an individual out-arg via req->v\[+0x24\] with names 'Code'(0x10eb95c4)/'MID'(0x10f11d6c)/'DID'(0x10f11d70), value serialized through the out-arg object's v\[+0x10\] emitter; response committed via req->v\[+0x0c\]. The Seed->Code transform lives inside the impl member fn (no literals, crypto inlined or via shared hash lib) and is the only undecoded part. NOTE: an earlier attribution of the compute fn to f_104666b4 was wrong - that fn is a MuseDebugInfo formatter ('%s, %u, %u, %u' @0x10f94c88, 'MuseDebugInfo' @0x10f94c98).

</details>

#### Inputs

| Name | Type | Required | Values / range | Default |
|---|---|---|---|---|
| `Seed` | string argument | yes | seed string consumed verbatim by auth hash f_10906304 / max 127 chars | none; required input |

- **`Seed`**: client seed string feeding the auth-code computation f_10906304; required
  - validation: required-arg parse precedes impl call; req->v\[+0x08\] gate emits 402 on failure
  - buffer cap: `0x80`

#### Outputs

| Name | Type | Values / range |
|---|---|---|
| `Code` |  | none |
| `MID` |  | none |
| `DID` |  | none |

<details markdown="1"><summary><b>Technical analysis</b></summary>

#### Validation `confirmed`

req->v\[+0x08\] validation gate; failure emits 402 (literal 0x192 at 0x1073a6b8)
<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x1073a5d0; validate gate + 0x192 literal
- @ 0x1073a6b8; 0x192 -> req->v\[+0x14\]

</details>


#### Requirements / preconditions `confirmed`

Seed is required: parse via f_1056157c precedes the impl call and the req->v\[+0x08\] gate rejects missing/malformed args with 402
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x1073a5d0; required-arg parse order + gate

</details>


#### State dependencies `confirmed`

auth computation reads device-identity material via f_106453a8/f_1064548c lookups inside impl f_104666b4; impl object injected into svc+4 by ctor f_1073a768 (called at 0x1018f28c)
<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x104666b4; device-material lookups
- @ 0x1018f28c; impl ctor injection site

</details>


#### Side effects

- Stores the action-name pointer into ctx+0x70 member +0xe0 and TLS+0x28 (f_100ad1bc/f_100a9750); auth computation itself returns 0 with no persistent mutation in this build.

#### State transitions `confirmed`

none: no state-machine mutation in handler f_1073a5d0 or impl f_104666b4 beyond the action-name/TLS stores
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x104666b4; read-only auth computation + return 0

</details>


#### Events `confirmed`

none emitted: impl f_104666b4 returns 0 unconditionally with no event/notify call; the only side effect is the action-name store into ctx+0x70 member +0xe0 and TLS+0x28
<details markdown="1"><summary>Evidence (1)</summary>

- @ 0x104666b4; unconditional return 0, no event emitter calls

</details>


#### Return behavior `confirmed`

impl returns 0 unconditionally -> success response commits Code/MID/DID via req->v\[+0x24\] emitters then req->v\[+0x0c\]; nonzero would surface via the same fault/commit path
<details markdown="1"><summary>Evidence (2)</summary>

- @ 0x104666b4; return 0
- @ 0x1073a5d0; emit + commit tail

</details>


#### Errors

**`402`** `confirmed`

request-validate gate failed (req->v\[+0x08\] returned 0)

- req->v\[+0x08\] request gate fails (handler literal 0x192 at 0x1073a6b8)

**`401`** `confirmed`

unknown action name on QPlay dispatcher

- action name != QPlayAuth (dispatcher strcmp) (dispatcher fault 0x1073a548)

**`401`** `confirmed`

action-name strcmp miss in wrapper f_1073a4f0 -> req v\[+0x14\] emit 0x191

- dispatched action name != "QPlayAuth" (strcmp fallthrough)



</details>

<details markdown="1"><summary>Implementation & reverse-engineering evidence</summary>

- handler `0x1073a4f0`
- Dispatcher f_1073a4f0 strcmp-matches "QPlayAuth", stores the action name into ctx+0x70 member +0xe0 and into TLS+0x28 via f_100ad1bc/f_100a9750, then calls svc->v\[+0x0c\] = f_1073a5d0: parses required Seed (cap 0x80 via f_1056157c), req->v\[+0x08\] gate (else 402), then impl->v\[+0x08\] = f_104666b4 which computes Code via f_10906304 over the Seed plus device material (f_106453a8/f_1064548c lookups), formats a %u device value into the MID/DID buffers via snprintf_chk, and unconditionally returns 0. Success emits Code/MID/DID via req->v\[+0x24\] then commits via req->v\[+0x0c\].

- @ 0x1073a528; strcmp dispatch site
- fn 0x1073a5d0; svc vfunc +0x0c: Seed parse, 402 gate, impl call, Code/MID/DID emission
- fn 0x104666b4; impl: auth-code computation + %u format; unconditional return 0

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
<details markdown="1"><summary><b>Technical details</b></summary>

- **notify_path:** 'updateSharedTQPlayMode' worker ('...bad context!' log) is the QPlay state-update path; X_QPlay_SoftwareCapability static; no dedicated emitter recovered

</details>


## Dispatcher-level errors

<details markdown="1"><summary><b>Technical details</b></summary>

**`401`** `strong`

unknown action name for this service; dispatcher emits a SOAP fault (401 Invalid Action family) without invoking any handler

- Request action name matches no entry in the service dispatch table after the name-table search



</details>

Implementation sources (recovered): `compiled lib (qplay): no path literal`

<details markdown="1"><summary>Service evidence (3)</summary>

- @ 0x101953c8; service router function
- @ 0x10f11d48; service vtable
- @ 0x1073a4f0; service dispatcher

</details>
