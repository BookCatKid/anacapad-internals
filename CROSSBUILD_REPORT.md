# Cross-Model / Cross-Firmware Reverse-Engineering Report

Static comparison of `anacapad` across every extractable Sonos firmware/model
binary in the archive, built on top of the frozen model-9/`86.10` baseline
(`RESEARCH_REPORT.md` / `docs/documentation.json`). All findings are recorded
with evidence in `docs/crossbuild_matrix.json`; this document is the
human-readable synthesis of the cross-build dimension.

**Method.** Every claim is binary-derived: section/dispatch-table structure,
per-impl instruction profiles, code-reference counts, or literal/vocabulary
diffs. SCPDs/XML were used only as *comparison* evidence, never as truth over
the binary. `confirmed` = proven by structure or code path; `likely`/
`suggestive` = string-derived; `unknown` = runtime-dependent or statically
unresolvable. Weird/dead/removed behaviour is preserved, not smoothed over.

---

## 1. Binary / build inventory

| Build | Model / arch | Source | anacapad recovered as |
|-------|--------------|--------|------------------------|
| 25.2-50130 | model-2 (proto) | `recovery-work/candidates/model2` cramfs | flat raw image `hh.anacapad` (no ELF hdr) |
| 34.16 | fenway (multi-product) | `sonos-research/fenway-public` | ELF `anacapad-34.16` |
| 57.10 | fenway | `sonos-research/fenway-public` | ELF `anacapad-57.10` |
| diag | fenway (diagnostic jffs) | `sonos-research/fenway-public` | ELF `anacapad-diag-jffs` — 167 id-table actions, HTControl str-only, transport controls unwired, 18 absent (~34.x-era reduced build) |
| 86.8-78270 | **model-8** fenway (Play:1/3/Sub) | `.upd` type-23 `bin/` section | ELF `anacapad-m8-86.8.extracted` (~42.7k funcs) |
| 86.8-78270 | **model-9** limelight (Playbar) | rootfs squashfs | ELF `anacapad` (17.26MB) |
| 86.10-80260 | model-9 limelight | rootfs | ELF `anacapad` (frozen baseline) |

**`.upd` container crypto.** Payload sections carry an envelope `0x886499ca`:
RSA-unwrap an AES key (the `recipient_id` field is the recipient key's
fingerprint), then AES-CBC-decrypt. `src/sonos_firmware/extract.py`
`decrypt_envelope()` implements it; `legacy_model8` handles the model-8
variant. The recovery vault holds private keys for models **1, 8, 9, 12, 16,
17** only.

**Decryptable `.upd`s = only the three already-owned builds**
(`86.8-1-8` m8, `86.8-1-9` m9, `86.10-1-9` m9). The `57.23-74170` set (12
models: 5,13,14,20-26,28,29) and the recovery-work model20/model28 payloads
use *different* recipient IDs whose keys are not in the vault — **blocked**.

**device-payload section.** The model-9 `.upd` device-payload decrypts to a
**Xilinx Spartan-3 FPGA bitstream** (`3s50avq100`, `top_level.ncd`) — the
audio-fabric hardware that performs optical/TDM/IR routing. Identical between
86.8 and 86.10. This is the silicon behind the limelight-only HTControl / IR /
Dolby surface.

---

## 2. Dispatch architecture (shared, one polymorphic mechanism)

Both fenway and limelight use the same action-dispatch machinery. The two
"apparent" table formats resolve to **one polymorphic record format**, proven
by decompiling the per-service dispatcher in both binaries (m8 `FUN_10752428`,
m9 `FUN_1082b0fc` — semantically identical C):

```c
dispatch(svc_ctx, p2, req, p4, action_name):        // ptr-table services
    binary-search table[27] of {name_ptr, fn_or_id, ctx_off}   // stride 3 words
    on match:
        worker = *(svc_ctx + 4)                 // delegate/impl object
        if (worker == 0)  → req->vfunc(+0x14)(req, 0x191)   // 401 — the STUB path
        if (fn_or_id & 1)                        // low bit = vtable-id flag
            impl = *( (*(svc_ctx+ctx_off)).vtable + (fn_or_id & ~1) )
        else
            impl = fn_or_id                      // direct C function pointer
        impl(svc_ctx + ctx_off, req, worker)     // ctx_off selects 'this' sub-object
    no match → req->vfunc(+0x14)(req, 0x191)     // 401 unknown action
    always   → req->vfunc(+0x38)(req)            // finalize/flush
```

For **id-table services** (ZGT `FUN_1074ba18` / AlarmClock etc.) the same
search+discriminator runs but with a **2-arg call** — the impl is a *virtual
method on the impl object* and there is no dispatcher-side worker check:

```c
method = *( (*(impl_obj + ctx_off)).vtable + (id & ~1) );
method(impl_obj + ctx_off, req)                  // the method reads this->worker itself
```

because the method is a member of the impl object it reaches the backend via
`*(this+4)` directly (below).

- **Pointer-table entries** (`fn_or_id` low bit clear): direct C handler call.
  Used by AVTransport, RenderingControl, Queue, VirtualLineIn, ContentDirectory,
  DeviceProperties, GroupManagement, GroupRenderingControl and misc families.
- **ID-table entries** (`fn_or_id` odd): the value is a vtable byte-offset; the
  call target is `*(sub_object->vtable + id)`. Used by AlarmClock,
  SystemProperties, ZoneGroupTopology, MusicServices, ConnectionManager — and
  HTControl on limelight.
- `ctx_off` (record word 3, usually 0) selects which sub-object of the service
  context receives the call — for virtual entries it also supplies the vtable.
- In the **ptr-table** dispatcher a **null worker** (`svc_ctx+4`) produces the
  `0x191`/401 fault — a proven code path for services whose table exists but
  impl object is absent. The id-table dispatcher performs no worker check
  (each virtual method reads `this->worker` itself).
- On 86.x both AudioIn and HTControl (fenway) have **no action table at all** —
  their action names are dead strings, so calls reach the dispatcher's
  not-found path → `0x191`/401 (or a service-level rejection upstream; the
  service objects are runtime-allocated, so which of the two applies is
  runtime-dependent). This is exactly why "reject-all 401" was observed for
  AudioIn.
- `req->vfunc(+0x38)` finalizes/flushes the response after every dispatch; a
  trace hook logs the matched action name via `*(param_2+0x70)`.

**HTTP route layer** (decompiled `FUN_101875f4` / m9 `0x1019a58c` region): a
static 12-entry (fenway) / 13-entry (limelight) table of
`{handler_obj, path, svc_name, flag_bit, enable_byte}` maps each
`/…/Control` path to a handler object called via `vfunc+0x08`. Each entry has a
per-service **flag bit** (`0x10`…`0x10000`) that masks a telemetry field and a
runtime **enable byte** — most share one global UPnP-enable flag
(`*(zp+0x53e4)^1` m8 / `*(zp+0x544c)^1` m9); AudioIn has its own
(`*(zp+0x53cc)`). A `0` enable skips the entry → default 404 handler.

**Object model**: the zone-player aggregate (~28 KB) embeds 16 `UpnpService`
objects at a fixed `0x680`-byte stride (`DeviceProperties@+0x714` …
`VirtualLineIn@+0x6954`, wired by `FUN_10771084`). Each service object
(`vfunc+0x40` = dispatch) delegates to an impl object
`{vtable, worker@+4, refcounted@+8, …}` whose vtable sits in `.rodata`
directly before that service's action table. The vtable layout is
`{dtor, deleting-dtor, dispatch@+0x08, [virtual action methods]}` — it is only
3 slots for all-ptr-table services (the action impls live in the table, not the
vtable), but grows for id-table services: the ZGT impl vtable
(m8 `0x10c6f618`, m9 `0x10f0d1e0`) has 11 slots, the 8 action methods at
slots 3–10 matching ids 13→41 byte-for-byte. `worker@+4` is the
product-selected backend delegate in *both* dispatch styles. The full chain:

```
HTTP req → route table (enable byte) → handler->vfunc+0x08
  → FUN_10670ee4 master (SOAPAction parse, secure checks, target-udn proxy)
  → service_obj->vfunc+0x40 → svc_ctx->vfunc+0x08 (table dispatch)
  → impl(svc_ctx+ctx_off, req, worker=svc_ctx+4) → worker->vfunc+0x1c (backend)
```

The shared request-object vtable contract (in-arg parse at `+0x8`, commit at
`+0xc`, fault-raise at `+0x14`, input-lookup at `+0x1c`, output at `+0x24`,
finalize at `+0x38`, begin/telemetry at `+0x3c`) is identical across models —
the same SOAP plumbing under both products. The request-object vtable was
resolved in `.rodata` (m8 address-point `0x10c334d8`) by anchoring `+0x24` =
`0x104999c4`, which builds an arg descriptor against the parsed-body list at
`req+0x994`. Decompiled semantics: **`vfunc+0x08` is an
authorization/precondition gate**, not a per-arg type parser — it returns
status `0x33`(ok)/`0x3e`(denied)/`0x3fe`(mode) and enforces a
group-`"Master"`-coordinator check (`FUN_100ca658` → `req->vfunc+0x1c`/`+0xc`
`"Master"` + session sub-object `vfunc+0x5c`). Per-arg type conversion is done
by the descriptor machinery (`vfunc+0x1c` accessor + typed helpers), so the
`0x192` "Invalid Args" fault can be raised for **authorization denial** as well
as malformed arguments.

The `req` object is a **polymorphic per-service request-context subclass**:
three sibling vtables (m8 `0x10be20b8`, `0x10c3a640`, `0x10c334d8`) share one
SOAP-request base — fixed slots `+0x08`(Master-gate), `+0x0c`, `+0x14`, `+0x24`,
`+0x38`, `+0x3c` — and differ only in subclass overrides (`0x10c334d8` carries
`rc_impl.cxx`/`ButtonSetMute`/primary-only checks ⇒ the RenderingControl
context; m9 additionally compiles an `rc_impl_stp.cxx` submodule). The shared
volume backend `FUN_100cef4c` (m8) / `0x100dc8e8` (m9) — `[0,100]` clamp,
`Cannot set volume in fixed output mode`, audio object `vfunc+0xe0`/`+0xe4` —
is a base-class method inherited across the siblings. This single base contract
is exactly why all 204 impls use identical vfunc offsets.

**Two objects, kept distinct:** the `req` object is the SOAP plumbing
(request-context subclass, statically mappable); the `worker` (`svc_ctx+4`) is
the separate product audio/zone backend. `worker` is `NULL` in the ctor and
bound post-construction in device-init; it is not produced by an
`operator_new`+`store` pattern (likely an embedded aggregate member bound via
computed offsets), and `DSPControl{Play1,Play3,Sub}` names appear only as log
strings with no ctor/factory xref — so the concrete worker class is
**runtime-bound and not statically resolvable**. What is proven: a uniform
`worker->vfunc+SLOT` backend interface (`SetVolume`→`+0x1c`, `Play`→`+0x2c`,
`GetZoneGroupState`→`+0x28`).

### Dispatch-mechanism evolution

| build | ptr-table | id-table | str-only | absent |
|-------|-----------|----------|----------|--------|
| fenway 34.16 | 0 | 181 | 8 | 8 |
| fenway 57.10 | 0 | 184 | 10 | 3 |
| fenway 86.8 (m8) | 134 | 46 | 16 | 1 |

Between 57.x and 86.x the large services migrated from all-C++-vtable (id) to
C-function (ptr) dispatch — an architecture evolution, not a model difference.

The **request plumbing** evolved independently of the dispatch mechanism.
Across all three builds the backend architecture is conserved —
`worker@this+4` → `worker->vfunc+SLOT` delegate, `0x191`/`0x192` fault
constants, `out->vfunc+0x10` output write, and an impl-object vtable
`{lifecycle, dispatch@slot2, action-methods}` ending just before the
`{name,id,ctx}` table. What changed is how the impls reach the request ops:

| build | action lookup | request ops |
|-------|---------------|-------------|
| 34.16 | libc `bsearch` + low-bit id | direct free-function calls |
| 57.10 | inline binary search + low-bit id | direct calls (`parse FUN_10380aa4`, `fault FUN_10380fc8`, `out-accessor FUN_10366098` on `req+0x5fc`, `commit FUN_10380c24`) |
| 86.x | inline binary search + low-bit id | **`req->vfunc` virtual calls** (`+0x08/+0x14/+0x24/+0x0c/+0x38/+0x3c`) |

57.10 `GetZoneGroupState` (`0x10384a44`, id 41 → impl-vtable slot 10) is the
same impl shape as 86.x but calls these ops directly rather than through the
request object. So the **request-object vtable abstraction (and its per-service
subclasses) was introduced between 57.10 and 86.x** — the delegate/action/
output architecture is far older (≥34.x).

---

## 3. The model-8 ↔ model-9 delta (same firmware, 86.8)

The advertised surface is **identical**: 204 action entries / 197 unique names,
same per-service counts. The SOAP impl layer is **compiled from the same
source**, proven two ways:

- **Pointer-table impls** — a per-impl profile sweep
  (calls/cmpwi/vfunc-offsets/string-refs) across all 134 shared ptr-table impls
  shows identical call+compare counts on ~128/134; the residual diffs are
  stack-frame/codegen noise and tail-call scan bleed, confirmed by direct
  disassembly of `Backup`, `GetSearchCapabilities`.
- **ID-table impls** — all 48 shared `{name,id,0}` actions carry the *identical*
  vfunc-offset id in both binaries (e.g. `GetZoneGroupState`=41, `CreateAlarm`=
  57). Identical vtable slot numbers ⇒ identical service-object class layout ⇒
  same compiled impl. The only id-table divergence is exactly the 8 HTControl
  actions.

So the **196 shared actions** are shared impl source (proven below at the
decompiled-C level); the remaining 8 — HTControl — are limelight-only compiled
code that simply does not exist in the fenway binary.

**Decompiled-C proof** — `SetVolume` was decompiled in both binaries (m8
`FUN_10753c48`, m9 `FUN_1082ca5c`). The two functions are semantically
identical: each fetches `InstanceID`/`Channel`/`DesiredVolume` via
`req->vfunc(+0x1c)`, gates on `req->vfunc(+0x8)` (else raises `0x192`=402),
delegates via `worker->vfunc(+0x1c)(InstanceID,Channel,DesiredVolume)`, commits
`req->vfunc(+0xc)` on success, faults `req->vfunc(+0x14)` on failure. The only
difference is a stack-canary epilogue in the m9 build — compiler hardening, not
behaviour.

The proof extends to a **virtual (id-table) impl**: `GetZoneGroupState`
(id `0x29` → impl-object vtable slot 10) was resolved through the ZGT vtable in
both binaries — m8 `FUN_1074b910`, m9 `FUN_10823850`. The two are
instruction-identical in shape: `req->vfunc(+0x3c)` begin/telemetry →
`req->vfunc(+0x8)` input parse (`0x192` on fail) → `worker->vfunc(+0x28)` builds
the ZoneGroupState XML → `req->vfunc(+0x24)`("ZoneGroupState") output accessor →
`out->vfunc(+0x10)` writes the string → `req->vfunc(+0xc)` commit. Identical
worker slot `+0x28` ⇒ identical ZGT backend interface ⇒ same compiled source.

The **only** structural SOAP difference:

| Service | model-8 fenway | model-9 limelight |
|---------|----------------|-------------------|
| HTControl | **fully absent at every layer** — no `/HTControl/Control` route entry (HTTP 404 at the route table), no action table, no impl code (`irdecoder.cxx`, learn FSM, IRCode-DB client all missing). Only the service object (zp member `+0x3b14`) and advertised URN/SCPD persist via shared device-description data | **live** — 13th route entry (handler `zp+0x28da4`, enable `*(zp+0x544c)^1`), all 8 actions id-table-dispatched into real IR code |
| AudioIn | dead/stub (reject-all `401`) | dead/stub (reject-all `401`) |
| QPlay | strcmp-dispatched | strcmp-dispatched |
| everything else | identical | identical |

HTControl actions: `SetIRRepeaterState`, `GetIRRepeaterState`,
`IdentifyIRRemote`, `LearnIRCode`, `CommitLearnedIRCodes`,
`IsRemoteConfigured`, `SetLEDFeedbackState`, `GetLEDFeedbackState`. On fenway the
product-capability gate is expressed by **omitting the route-table entry
entirely** — the fenway router has 12 entries to limelight's 13, so HTControl
requests die with HTTP 404 at the route layer, before SOAP dispatch.

Deeper binary check (string+code-ref sweep): the IR **implementation is absent
from the fenway binary outright** — `irdecoder.cxx`, the whole learn-state
machine (`Entered one button learn`, `Pass %d length %d learn count`, `Learn
summary`, timeout/mismatch paths) and the IRCode cloud client
(`ir.ws.sonos.com/IRCode/`) have **no** presence. Only the action names and
shared constants (`IR_SENSOR`, `IR_TRANSMITTER`, `IRCode`,
`O_IR_DB_WS_IRCODE_URL`) survive as dead strings in shared registration data.
On limelight all of it is live code (6 refs to `irdecoder.cxx`, 8 action impls
wired). So HTControl is not "shared impl, unwired" — it is a **limelight-only
compiled subsystem**; the shared-source claim covers the 196 genuinely shared
actions.

---

## 4. Product architecture — one binary, many roles

The fenway `anacapad` is a **multi-product** binary, not Play:1-only:

- `DSPControlPlay1`, `DSPControlPlay3`, `DSPControlSub`, `DSPPlay1`,
  `DSPPlay3`, `DSPSub`, `DSPSysSub`, `supported_models`, `hwmodel`,
  `submodel_min/max`, `Unsupported Fenway Submodel` → one image serves Play:1,
  Play:3 and Sub.
- Full **HT-satellite receiver** mode: `ZP_MODE_HT_SATELLITE`,
  `HT_BONDED_SATELLITE`, `AddHTSatellite`, `RemoveHTSatellite`,
  `reconnectHTSatellites`, `satellite_device.xml`, `dsp_system_satellite.bin`,
  `htSatelliteStats`, `starting the satellite run loop`. A fenway box becomes a
  Playbar's bonded surround satellite.

**The product gate is a hardware-descriptor probe** (Ghidra-decompiled,
`FUN_10b84ce8`). A lazily-initialised singleton (guard-acquired via
`__cxa_guard_acquire`, built by `FUN_108d3fb8`) carries the detected hardware;
three ordered probes inspect it:

```c
probe FUN_108d2e44: desc[+0x10c]==8 && (desc[+0x110] & ~4)==2   → index 1
probe FUN_108d2e70: desc[+0x10c]==8 && (desc[+0x110] & ~4)==3   → index 2
probe FUN_108d2e1c: desc[+0x10c]==8 &&  desc[+0x110]     ==1    → index 3
no match            → returns 0, logs "Unsupported Fenway Submodel"
```

`desc[+0x10c]==8` is the **fenway family** tag; `desc[+0x110]` is the submodel
ID with bit 2 masked as a variant flag on the Play:1/Play:3 probes. First match
wins — one binary serves all fenway submodels, selected by the detected
hardware descriptor.

(An earlier reading attributed the gate to `FUN_1056b658`; decompilation shows
that function is the **update-manifest XML parser** — `image`, `model`,
`submodel_min/max`, `fromver_min/max`, `flags`, `milestone_index`,
`app_baseline`, `arch`, `supported_models`, `update_list`, `swgen` — used for
`.upd` validation, not runtime product selection.)

The limelight `anacapad` is the **HT-master** side: IR decoder+learning
(`irdecoder.cxx`, `hal_ir_*`, `IRCode`, `/jffs/irconfig.txt`), Dolby/optical
decode (`dolby_config.json`, `ActiveDecoder`, `DTS`, `SPDIFParser`, `ACMOD`,
`DialNorm`, `NightMode`), HT satellite TX (`htaudio_satellite_tx.cxx`,
`htaudio_chsnk_processor_stream.cxx`, `SatelliteSwitcher`), HDMI CEC.

**The capability split is runtime + dispatch-wiring, not compile-time.** Both
the SOAP impls (identical profiles) and the REST surface (below) are shared
source; products differ by which dispatch tables/subsystems get linked.

---

## 5. Capability / feature evolution (34.16 → 57.10 → 86.x)

| Action / group | 34.16 | 57.10 | 86.8 fenway | 86.8 limelight |
|----------------|-------|-------|-------------|----------------|
| AudioIn ×6 | live (id) | live (id) | dead/stub | dead/stub |
| `QPlayAuth` | live id=9 | dead | dead | dead |
| `ResetThirdPartyCredentials` | live id=77 | dead | dead | dead |
| `ProvisionCredentialedTrialAccountX` | live id=29 | **absent** | absent | absent |
| HTControl ×8 | dead | dead | dead | **live (id)** |

- `EndDirectControlSession`, `SetSourceAreaIds`, `Start/StopTransmission`,
  `Get/SetButtonLockState` appear by 57.10 (direct-control/QPlay + button-lock).
- `RoomDetectionStart/StopChirping` (sonar calibration) appears by 86.x.
- `ProvisionCredentialedTrialAccountX` is a confirmed **hard removal**
  34.16→57.10.
- `QPlayAuth`, `ResetThirdPartyCredentials` transition live→dead-string by 57.10.
- AudioIn was real on old firmware, became a reject-all `401` stub by 86.x.
- HTControl was **never live on fenway** across all examined builds — limelight
  only.

### `86.8 → 86.10` (both limelight)

`DelegateGroupCoordinationTo` gains a 4th in-arg `ClearSource` — **binary
confirmed**: the 86.8 wrapper fetches 3 args (`InstanceID`, `NewCoordinator`,
`RejoinGroup`), the 86.10 wrapper fetches 4. A whole-surface sweep found this is
the *only* arg-fetch delta across 124 shared pointer-table actions, and the
fault-code vocabulary is unchanged — the impl delta is confined to `ClearSource`.

---

## 6. HTTP / REST surface

m8 serves the **full household REST API** — the same multi-product grammar as
limelight: `{householdId}/players/{playerId}/...` with `homeTheater`
(accessoryList, swapModelInfo, tvAudioSignalStatus, addAccessoryWifi…), `hdmi`
(edid/powercycle/status), `pinewood` (remote-control verbs), `positioning` +
`roomDetection/chirp/{playId}` (sonar), `trueplay`/`trueroom`, `virtualLineIn`,
`voice`, `zones`, `timers`, `playbackSession`, `networkTest`, `management`,
`systemReporting`, `settings`, `hardwareStatus` (battery/bluetooth/ethernet/
lineIn/microphoneSwitch/poe/shipMode/water/wiredSub/wireless…). All `upnp*`
service routes carry `/subscription[/{logicalSID}]` — **including
`upnpHTControl/subscription`**, so the stubbed SOAP service still has its REST
mirror. ~3992 route/path templates scanned; the HTTP layer is shared
multi-product source gated at runtime.

---

## 7. Arguments / parsers / error / event deltas

- **Arguments** — shared actions fetch identical arg sets (same-source impls).
  The only fetch-count delta found across the corpus is `ClearSource`
  (86.8→86.10, limelight). `RoomDetection` chirping is a nested runtime
  dispatcher on m8 vs direct impl on m9 — *different plumbing, same arg
  surface* (all chirp arg-name strings present in m8); no proven arg delta.
- **Error vocabulary** — limelight carries the queue/transaction concurrency
  cluster `1026-1050` (richer queue error surface); fenway carries HTTP-level
  codes `405/411/413/415/416`. Shared core unchanged. (Vocabulary-level;
  per-action condition mapping is bounded by the same passthrough limits as the
  baseline.)
- **Eventing / LastChange** — limelight emits ~81 HT/optical/Dolby fields
  (`<ActiveDecoder>DTS/PCM`, `<ACMOD>`, `<DialNorm>/<DialogLevel>`,
  `<NightMode>/<SpeechEnhanceEnabled>`, `<AudioDelay*Rear>`, `<Satellite*>`,
  `<IRCode>`, `<SPDIFParser>`, surround levels) — the HT-master telemetry.
  fenway emits ~10 satellite/Sub fields (`<HTSNKPipelineVer>`, `<SubLeveldB>`,
  `<InvertSub>`, `<ConstrainSubLevelToVolume>`) — the satellite-receiver/Sub
  side.
- **GENA dispatcher decoded** (`FUN_1066bc50`): method `0xb`=SUBSCRIBE /
  `0xc`=UNSUBSCRIBE / other→`0x1f5`(501). `/DeviceProperties/Event` and
  `/GroupManagement/Event` are **exempt** from the secure-mode gate; all other
  event paths 403 (`0x193`) when denied. Timeout `Second-N` default+max
  `0x15180`=86400s, capped by a runtime global. New-sub requires
  `callback=<url>` (≤1024) + `nt=upnp:event` + no `sid` → 200 + SID + TIMEOUT +
  initial-burst; RENEW = `sid`-only; errors: 400 missing-headers, `0x19c`=412
  bad/missing `sid`, `0x1f7`=503 service-miss.
- **State-var model** — workers hold a named-node tree at `+0x498`;
  `FUN_1055b0cc(tree,name,0)` find-or-creates nodes, `node->vfunc+0x10` sets
  values; serialized into `e:propertyset`/`LastChange`. Output args on the
  request object: `req->vfunc+0x24` returns the out-arg handle, whose
  `vfunc+0x10` writes the value.
- **URI/payload grammars** — shared `x-rincon-*` grammar; fenway sonar-cal
  completion `x-rincon-sonarcal:complete.ogg` vs limelight
  `complete_ht.ogg`; limelight-only IR-upload `ir.ws.sonos.com/IRCode/` and
  buzzer `file://%s/buzzers/0.mp3`.

---

## 8. Native protocols

CHSRC/CHSNK core is **shared** (`chsrc.cxx`, `chsnk.cxx`, chsnk state-machine
log-sites `local chsrc`/`stopped` live in both) — the base channel source/sink
fabric for general group audio. The **home-theatre flow is asymmetric** —
complementary halves of one protocol:

- **limelight = CHSRC transmitter / HT-master.** `htaudio_satellite_tx.cxx`,
  `Using CHSRC TX for GM`, `RCHSRCReq(op,txnID)`, `chsrc_state_events`,
  `as-srcin/out-chsnk`, `chsnk-sat-as`, `nodetx_ht%d`, `HT NodeTX Blocks`,
  `SatelliteSwitcher`, `addSatellite`/`removeHTSatellite`/`HTSatelliteChecker`,
  `satelliteChannelMap`, satellite Spatial/Spectral Tuning, `EnterConfigMode`/
  `ExitConfigMode on satellite`. Plus the optical decode front-end:
  `spdif-input`, `SPDIFTap`, `Dolby Atmos(DD+/MAT/TrueHD)`, `dolby_config.json`,
  `/proc/driver/fpga`, `/proc/driver/tdm/rxring`.
- **fenway = HTSNK receiver / satellite.** `htsnk.cxx`, `as-*-htsnk`,
  `htsnk-as`, `HTSNKPipelineVer`, `HTSNK Latency/Missed Frames/Rx Time To Play`,
  `htSatelliteStats`, `satellite run loop`, `satellite audio disabled/mute/led`,
  `setting orientation to vertical for satellite`. fenway also has a live
  `chsnk playing local VLI` binding (VLI→chsnk relay) that limelight routes
  differently.

So `chsnk`/`chsrc` is the shared base; the HT-specific **TX** side is
limelight-only and the **RX** side is fenway-only — the Playbar decodes optical
and pushes audio to bonded satellites, which receive and render it. netstart,
SonosNet, SCI, TLV, nodetx, hwmessage, protobuf, internalevts are all present in
both binaries.

**CHSNK state machine decoded** (`FUN_1036b340`, `chsnk.cxx`): the sink object
(~0x29c0 bytes) loops on a state word at `+0x2880` (values 1–9) dispatched via
handler table `DAT_10c18b68` — `3`=`playing local chsrc`, `5`=`playing local
AI`, plus `local VLI` and `remote chsrc at %d.%06d` branches; stopped state
logs `Channel Sink in stopped state` and waits on a condvar at `+0x218`. Each
play branch calls `FUN_104c0e18(obj+0x2b8)` + `FUN_103697f0(obj,state)` +
`FUN_1061a4ac(&sub, obj+0x2b0, srctype)` + `FUN_10479988(obj+0x1be8, sub)`.
Notable: **local AI (AudioIn) is a live internal CHSNK source** in fenway even
though its SOAP surface is stubbed — the audio path exists in the shared
codebase. `Chsnk restart is requested by the new coordinator to avoid seamless
delegation` documents coordinator-handoff semantics; multicast joins refresh on
interface/IP events.

**Native infra (both)**: `netstartd` IPC (`/tmp/netstartd.ipc`,
`/var/run/netstart_mode`, SSID set/clear, satellite-add notify); SonosNet mesh
(`NETMODE_SONOSNET_WIRED/WIRELESS`, `Muse` enabled-state, disable test-mode
with auto-revert); `hwmessagelib` event channel; protobuf node req/resp for
nodetx telemetry (`nodetx_chsrc`/`nodetx_vli`/`nodetx_ht`,
`<NodeTXBuffer>`); 7-field TLV header reader.

The `netstartd` IPC protocol is decompiled (`ipc_msg.cxx`): a custom IPC over
`/tmp/netstartd.ipc` via `InitializeIPCContext`/`CloseIPCContext` —
`FUN_105be44c` connects, logs `IPC established for %s`, sets status `0x3c` and
sends a `hello` handshake via `obj->vfunc+0x40` (fail → status `5`).
`FUN_105be618` shapes a request (method name at `obj+0x1a` cap `0x6c`, mutex at
`+0x88`, async callback `vfunc+0x08`); `FUN_106697f0` reads
`/var/run/netstart_mode` as the operating-mode int. Identical strings in both
binaries — shared subsystem.

The **nodetx** telemetry path is also decompiled (`FUN_106992d8` = `nodetx_vli`
sender): a *named node-request* on the SonosNet/hwmessage node-comm object
(`obj+0x6c`). The sender builds a protobuf-style buffer (`FUN_1061e5c0` on
`obj+0x740`), serializes a message via `comm->vfunc+0x4c`, then sends the named
request via `comm->vfunc+0x08("nodetx_vli")`. `nodetx_chsrc`/`nodetx_vli`/
`nodetx_ht` are per-audio-source `<NodeTXBuffer>` request names (chsrc = the
limelight HT-master transmitter, vli = line-in, ht = home-theatre) — a shared
telemetry mechanism carrying product-specific payload names. The `"TLV header
%d %d/7 oserr %d"` reader is present but reached only via a log-descriptor
table (no direct code xref) — its 7-field header format is confirmed by the
format string, the reader itself not statically anchored.

The **internalevts** in-process event bus is decompiled (`FUN_105bbeac`
destructor, `subject.h` observer pattern): an event-manager object holding 7
event-type slots (`obj+0xb..+0x18`), each a doubly-linked list of 12-byte
subscriber nodes `{vtable, prev, next, flag@+0x14}` torn down via
`node->vfunc+0x04` + `operator_delete(node,0x18)` with a `"%u leaked
subscriptions"` audit. Event-name table (`0x10c509dc`): `invalid`,
`deferred_event_sub`, `generic_update`, `sat`, `sonar_cal_mode_changed`,
`avt_device_feedback`, `entitlements_changed` — the internal observer layer
that propagates state changes into GENA `LastChange` and cross-module signals
(satellite, Trueplay/sonar calibration, transport feedback, service
entitlements).

**DSP internals**: fenway-only `FUN_10b95dec` selects per-hwrev Play:1 EQ
curves by codename (`0xe`→ROYALE/`BEACON RollBack`, `0xf/0x14/0x18/0x28/0x2d`→
BOOTLEG, `0x16`→MARQUEE, `0x17`→LARGO, default→AMOEBA) — absent on limelight.
`DSPControlSub` (`FUN_10b968e4`) writes subwoofer level to `+0x1540` and commits
via `vfunc+0x15c`.

---

## 9. model-2 `25.2` proto anchor

The flat `hh.anacapad` image carries **178/197** action names and **13**
service URNs — a mature proto-surface. Absent: Queue, VirtualLineIn, QPlay
services entirely, plus `SetNextAVTransportURI`, `EnterConfigMode`/`ExitConfigMode`
(no HT satellite config), OAuth accounts, button-lock, sonar, direct-control
names. Its dispatch **cannot be resolved from the flat image** — no consistent
load base makes action names pointer-referenced, so it predates/differs from
the `{name,func}/{name,id}` table format. Need an ELF-headered or relocatable
25.x-era binary to decode its dispatch.

---

## 10. Shared architecture discovered

- **One polymorphic dispatch mechanism** (§2) is model-invariant: a
  binary-searched `{name, fn_or_id, ctx_off}` table where `fn_or_id&1` selects
  C-call vs vtable-id call, `worker = svc_ctx+4`, null/miss → `0x191` (401).
- **SOAP impl source is shared** across fenway/limelight — identical per-impl
  profiles; products differ by table-linking, not code.
- **Request-object vtable contract** identical across models.
- **Master UPnP dispatcher decoded** (Ghidra): `FUN_10670ee4` is the single
  entry all `/Control` routes funnel into. It parses the `soapaction` header,
  enforces secure-mode/loopback checks (403), then calls the service object via
  `service->vfunc(+0x40)`. It also implements **`x-sonos-target-udn` request
  proxying** — a request addressed at a target UDN is forwarded to that device
  (group-coordinator tunnelling; forwarding failure → `0x19c`/412 fault), and
  emits `zpUpnpSrv` dispatch-timing metrics. `FUN_1066bc50` is the parallel
  eventing dispatcher (`/DeviceProperties/Event`, `/GroupManagement/Event`).
- **Decompiled shared-source proof** — `SetVolume` decompiles to identical C in
  m8/m9 (see §3).
- **Multi-product single binary** — fenway serves Play:1/Play:3/Sub +
  HT-satellite; limelight is the HT-master/optical product. Capability =
  runtime + dispatch wiring.
- **Master/satellite split** is consistent across DSP classes, eventing fields,
  URI payloads and native-protocol processors.

---

## 11. Remaining static gaps

| Gap | Blocker / what's needed |
|-----|-------------------------|
| `57.23-74170` ×12 models + recovery model20/model28 | recipient private keys not in vault (have 1,8,9,12,16,17 only) — need the per-model RSA keys |
| model-2 25.2 dispatch | flat image has no reloc info — need ELF-headered 25.x binary or symbols |
| deeper worker/object-graph tracing | the `worker` backend (`svc_ctx+4`) is `NULL` in the ctor and bound post-construction in device-init — not an `operator_new`+`store` site (likely embedded aggregate members via computed offsets); `DSPControl{Play1,Play3,Sub}` names are log strings with no ctor xref. The backend *interface* (`worker->vfunc+SLOT`) is proven; the concrete class per service is runtime-bound. Request-context object graphs are now statically mapped (per-service subclasses of one SOAP-request base) |
| per-arg `buf_cap` bounds | caps live in heap descriptors built by generated init code — needs per-init-function emulation (documented extractor limitation) |
| error-condition passthroughs | runtime-produced residuals inside named transaction boundaries — runtime-bound, not statically provable |
| runtime/live verification | explicitly out of scope (frozen at static ceiling) |
| SCI/SonosNet/MRPC/TLV handler internals | strings are hardware-enum/job names (`SCI_BOARD`, `PSOC`, `UART`, `PMU`, `checkSonosNetDisableTestTimedJob`) with **no code xref and no data-pointer ref** — apparent `.rodata` hits are ASCII false-positives inside GENA error strings. Handlers dispatch through vtables/descriptor tables (the binary's pervasive virtual-call style), not statically linkable. Needs a full virtual-call call-graph reconstruction and/or runtime. netstart/nodetx/internalevts *are* decoded; these are not |

---

## Evidence & provenance

- `docs/crossbuild_matrix.json` — the full per-action/per-build availability
  matrix + all recorded deltas above.
- `docs/documentation.json` — the frozen model-9 `86.10` baseline database.
- m8 binary: `sonos-research/play1-model8/anacapad-m8-86.8.extracted`
  (Ghidra project `ghidra_proj_m8/`).
- m9 86.8: `sonos-research/playbar-model9/rootfs/opt/bin/anacapad`
  (Ghidra `ghidra_proj_868/`); m9 86.10 baseline `ghidra_proj/`.
