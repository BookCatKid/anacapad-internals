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
| diag | fenway | `sonos-research/fenway-public` | ELF `anacapad-diag-jffs` |
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

## 2. Dispatch architecture (shared, two mechanisms)

Both fenway and limelight use the same two action-dispatch schemes.

**Pointer-table dispatch** — `{name_ptr, func_ptr, flags}` triples, direct
C-style handler call. Used by AVTransport, RenderingControl, Queue,
VirtualLineIn, ContentDirectory, DeviceProperties, GroupManagement,
GroupRenderingControl and the misc/ZGT-adjacent families.

**ID-table (vtable-offset) dispatch** — `{name_ptr, id, flags}` where `id` is a
virtual-method slot offset. A dispatcher **binary-searches** the sorted table,
reads the `id`, then calls `*(object.vtable + id)` (the low bit selects the
virtual-call path). Used by AlarmClock, SystemProperties, ZoneGroupTopology,
MusicServices, ConnectionManager — and HTControl on limelight. Confirmed by
`GetZoneGroupState` = `{name, id=41, 0}` in `.rodata`, identical in m8 and m9.

The shared request-object vtable contract (in-arg parse at `+0x8`, commit at
`+0xc`, fault-raise at `+0x14`, input-lookup at `+0x1c`, output at `+0x24`) is
identical across models — the same SOAP plumbing under both products.

### Dispatch-mechanism evolution

| build | ptr-table | id-table | str-only | absent |
|-------|-----------|----------|----------|--------|
| fenway 34.16 | 0 | 181 | 8 | 8 |
| fenway 57.10 | 0 | 184 | 10 | 3 |
| fenway 86.8 (m8) | 134 | 46 | 16 | 1 |

Between 57.x and 86.x the large services migrated from all-C++-vtable (id) to
C-function (ptr) dispatch — an architecture evolution, not a model difference.

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

So across the **entire 204-action surface** the impl code is shared source; the
single exception is HTControl, whose dispatch table is simply not linked on
fenway.

The **only** structural SOAP difference:

| Service | model-8 fenway | model-9 limelight |
|---------|----------------|-------------------|
| HTControl | **registered + advertised + stubbed** (8 action names are dead strings, 0 code refs; `/HTControl/Control` route still bound to the shared dispatcher) | **live** (all 8 actions id-table-dispatched) |
| AudioIn | dead/stub (reject-all `401`) | dead/stub (reject-all `401`) |
| QPlay | strcmp-dispatched | strcmp-dispatched |
| everything else | identical | identical |

HTControl actions: `SetIRRepeaterState`, `GetIRRepeaterState`,
`IdentifyIRRemote`, `LearnIRCode`, `CommitLearnedIRCodes`,
`IsRemoteConfigured`, `SetLEDFeedbackState`, `GetLEDFeedbackState`. On fenway
the service route is bound but no `{name,id}` table is linked, so all eight
fault at dispatch — a *product-capability* gate expressed by **not linking the
action table**, not by removing the service.

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
- **URI/payload grammars** — shared `x-rincon-*` grammar; fenway sonar-cal
  completion `x-rincon-sonarcal:complete.ogg` vs limelight
  `complete_ht.ogg`; limelight-only IR-upload `ir.ws.sonos.com/IRCode/` and
  buzzer `file://%s/buzzers/0.mp3`.

---

## 8. Native protocols

CHSRC/CHSNK core is **shared** (`chsrc.cxx`, `chsnk.cxx`, `CHSNK`, `CHSNK_SAT`,
`chsnk%d-as`, chsnk playing/stopped states) — group-audio source/sink fabric.
limelight adds the HT-specific processors (`htaudio_chsnk_processor_stream.cxx`,
`as-srcin/out-chsnk`, CHSRC TX for group master, `chsnk drain time`) — the
optical/TV source into the sink. fenway has the satellite-sink side. Shared
request/vtable plumbing (§2) underlies both.

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

- **Two dispatch mechanisms** (ptr-table + vfunc-offset id-table) are
  model-invariant.
- **SOAP impl source is shared** across fenway/limelight — identical per-impl
  profiles; products differ by table-linking, not code.
- **Request-object vtable contract** identical across models.
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
| model-8 Ghidra decompile | disk was at 100% (died 3×); now relaunched with headroom — enables deeper id-table-impl + native-protocol worker tracing |
| per-arg `buf_cap` bounds | caps live in heap descriptors built by generated init code — needs per-init-function emulation (documented extractor limitation) |
| error-condition passthroughs | runtime-produced residuals inside named transaction boundaries — runtime-bound, not statically provable |
| runtime/live verification | explicitly out of scope (frozen at static ceiling) |

---

## Evidence & provenance

- `docs/crossbuild_matrix.json` — the full per-action/per-build availability
  matrix + all recorded deltas above.
- `docs/documentation.json` — the frozen model-9 `86.10` baseline database.
- m8 binary: `sonos-research/play1-model8/anacapad-m8-86.8.extracted`
  (Ghidra project `ghidra_proj_m8/`).
- m9 86.8: `sonos-research/playbar-model9/rootfs/opt/bin/anacapad`
  (Ghidra `ghidra_proj_868/`); m9 86.10 baseline `ghidra_proj/`.
