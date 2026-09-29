# Architecture

## Routing

| Router | Kind | Records |
|---|---|---|
| `0x10191bec` | path_referencing_nonrouter | 0 |
| `0x101953c8` | soap_path_router | 13 |
| `0x1043318c` | path_referencing_nonrouter | 0 |
| `0x104340c4` | path_referencing_nonrouter | 0 |
| `0x1068bc0c` | soap_path_router | 4 |

### `0x101953c8` records

| Path | Service | Cap flags | Enabled gate |
|---|---|---|---|
| `/AlarmClock/Control` | AlarmClock | `0x80` | const (`0x1`) |
| `/AudioIn/Control` | AudioIn | `0x100` | field (`*(r3-in+0x5704)`) |
| `/MusicServices/Control` | MusicServices | `0x200` | field_inverted (`xor(*(r3-in+0x571c))`) |
| `/QPlay/Control` | QPlay | `0x800` | field_inverted (`xor(*(r3-in+0x571c))`) |
| `/MediaServer/ConnectionManager/Control` | ConnectionManager | `0x10` | field_inverted (`xor(*(r3-in+0x571c))`) |
| `/MediaServer/ContentDirectory/Control` | ContentDirectory | `0x20` | field_inverted (`xor(*(r3-in+0x571c))`) |
| `/MediaRenderer/ConnectionManager/Control` | ConnectionManager | `0x40` | field_inverted (`xor(*(r3-in+0x571c))`) |
| `/MediaRenderer/RenderingControl/Control` | RenderingControl | `0x1000` | const (`0x1`) |
| `/MediaRenderer/AVTransport/Control` | AVTransport | `0x2000` | field_inverted (`xor(*(r3-in+0x571c))`) |
| `/MediaRenderer/GroupRenderingControl/Control` | GroupRenderingControl | `0x4000` | field_inverted (`xor(*(r3-in+0x571c))`) |
| `/MediaRenderer/Queue/Control` | Queue | `0x8000` | field_inverted (`xor(*(r3-in+0x571c))`) |
| `/MediaRenderer/VirtualLineIn/Control` | VirtualLineIn | `0x10000` | field_inverted (`xor(*(r3-in+0x571c))`) |
| `/HTControl/Control` | HTControl | `0x400` | field_inverted (`xor(*(r3-in+0x571c))`) |

### `0x1068bc0c` records

| Path | Service | Cap flags | Enabled gate |
|---|---|---|---|
| `/DeviceProperties/Control` | DeviceProperties | `0x1` | expr (`vret(r3-in,+0x78)`) |
| `/GroupManagement/Control` | GroupManagement | `0x2` | expr (`vret(r3-in,+0x7c)`) |
| `/SystemProperties/Control` | SystemProperties | `0x4` | expr (`vret(r3-in,+0x88)`) |
| `/ZoneGroupTopology/Control` | ZoneGroupTopology | `0x8` | field (`*(r2+0xffff8ff8)`) |

### Router chain

- `0x101953c8` → `0x1068bc0c` (at `0x101956e4`)

## Request object vtable

Every action wrapper interacts with the request through these vfunc slots (confidence: `inferred`).

| Slot | Purpose |
|---|---|
| `0x08` | parse/validate args (rc -> 402) |
| `0x0c` | commit response |
| `0x14` | raise fault (r4 = code) |
| `0x1c` | get in-arg record by name |
| `0x20` | get in-arg record by name (variant accessor) |
| `0x24` | get/create out-arg record by name |
| `0x38` | finalize |
| `0x3c` | in-arg fetch (alternate) |

## Capability fields

Object fields the firmware reads to gate behavior. Read/write sites are static evidence; the *predicate* each gates is noted honestly where unresolved.

| Field | Effect | Status | Load sites |
|---|---|---|---|
| `0x3a8` | Read by firmware to gate or select behavior; exact predicate unresolved - see load sites | `strong` | 24 |
| `0x934` | Read by firmware to gate or select behavior; exact predicate unresolved - see load sites | `strong` | 13 |
| `0xcdc` | Read by firmware to gate or select behavior; exact predicate unresolved - see load sites | `strong` | 17 |
| `0x5704` | Read by firmware to gate or select behavior; exact predicate unresolved - see load sites | `strong` | 24 |
| `0x571c` | Read by firmware to gate or select behavior; exact predicate unresolved - see load sites | `strong` | 16 |
| `0xaa6c` | Read by firmware to gate or select behavior; exact predicate unresolved - see load sites | `strong` | 9 |
| `0xffff8ff8` | Read by firmware to gate or select behavior; exact predicate unresolved - see load sites | `strong` | 24 |

### `0x5704`

Affected services: AudioIn (/AudioIn/Control)

### `0x571c`

Affected services: HTControl (/HTControl/Control), AVTransport (/MediaRenderer/AVTransport/Control), ConnectionManager (/MediaRenderer/ConnectionManager/Control), GroupRenderingControl (/MediaRenderer/GroupRenderingControl/Control), Queue (/MediaRenderer/Queue/Control), VirtualLineIn (/MediaRenderer/VirtualLineIn/Control), ConnectionManager (/MediaServer/ConnectionManager/Control), ContentDirectory (/MediaServer/ContentDirectory/Control), MusicServices (/MusicServices/Control), QPlay (/QPlay/Control)

## Internal functions

| Address | Role | Description |
|---|---|---|
| `0x1056157c` | input_arg_parser | String input-argument record initializer/parser (type tag 7, caller-supplied capacity 0x400); produces the C string consumed by the impl for Unit and Target. |
| `0x10561444` | input_arg_parser | Byte-width numeric argument parser used for DesiredMute. |
| `0x10561478` | input_arg_parser | u16-width numeric argument parser used for DesiredVolume. |
| `0x1055fcbc` | output_formatter | Response-serializer printf writer: %-family formatter supporting %u/%d/%lld; contains literal 'BC3000 & LT-19E610' — a TV-model device-name edge case (XML-escap |
| `0x105614e0` | input_arg_parser | Numeric input-argument record initializer/parser (type tag 4, 24-byte record); produces the integer value the wrapper forwards as InstanceID. |
| `0x1055fcf4` | output_formatter | Signed integer (%d/%lld) response-format variant |
| `0x1055fc08` | output_formatter | Boolean+numeric response formatter: serializes bools as '0'/'1' then %u/%d — the boolean-as-int wire encoding |
| `0x10561514` | input_arg_parser | Arg-descriptor ctor, type-5 enum: embedded 24B buffer at +0x18 (+0xc=self-ptr,+0x10=cap 0x18), +0x8=name arg, +0x4=type5, +0x14=0,+0x31=0 — used by scalar/enum  |
| `0x1055fc4c` | output_formatter | Unsigned (%u)/signed (%d) numeric response formatter |
| `0x105615a8` | input_arg_parser | Arg-descriptor ctor, type-8 optional-ptr: embedded-buffer descriptor for nullable/ptr args |
| `0x1055fc84` | output_formatter | Numeric response formatter: %d/%u/%lld variant |
| `0x105614ac` | input_arg_parser | Arg-descriptor ctor, type-3 int16: same embedded-24B layout, +0x4=type3 — EQ/range int16 args (Bass,Treble,Volume) |
| `0x102b95a8` | seek_dispatch | AVTransport impl vfunc +0x34 entry: locks engine mutex +0x458, rejects nonzero InstanceID with 718, calls seek engine f_102b9088(engine,Unit,Target), stores Ins |
| `0x102b9088` | seek_engine | Seek engine: branches on source-mode field engine+0x4654; indexed mode (==2) enforces capability mask from f_10258ab0 (0x400000 track-seek, 0x200000 time-seek), |
| `0x102ab830` | time_parser | Target time parser for REL_TIME/TIME_DELTA: consumes at most one leading '-' manually (sign flag byte -> *arg2, cr4 captured before sscanf); sscanf(str,'%hhu:%h |
| `0x10255f64` |  | Indexed-source request submitter: f(impl+0x580, &record). Returns engine rc: 0=accepted, 2 and 3 are distinct rejection codes (mapped to SOAP 800/711 by Next),  |
| `0x1032e270` |  | Initializes the transport request record that impls fill and pass to f_10255f64/f_102aff9c. |
| `0x106a7930` | streamer_seek | Direct streamer seek used when engine+0x4654 != 2: locks streamer+0x150, obtains current stream session via *(obj+0x354)->+4->vfunc\[+0x2c\], calls session vfun |
| `0x10258ab0` |  | Capability query f(impl+0x580,sel1,sel2) returning a mask; bit 0x00100000 gates Previous indexed path. |
| `0x102b5ddc` |  | Pre-submission step shared by indexed Next/Previous - probably pauses/quiets the current streamer session. |
| `0x100d71e0` | impl | GetMute impl / 3-channel resolver: instID!=0 -> 702; locks impl+0x938; Master/LF/RF -> byte +0x7f1/0x7f2/0x7f3 written to out; unknown channel -> 402. |
| `0x100db3fc` | impl | SetMute impl shim: locks impl+0x938, logs 'SetMuteWithoutProxy ch:%s, on:%d', delegates to worker f_100d99b0, returns its rc. |
| `0x100d99b0` | impl_worker | SetMute worker: instID!=0 -> 702; 4-channel strcmp (Master/LF/RF/FocusMode -> +0x7f1..+0x7f4, else 402); Master path syncs +0x7e0->+0x7da when flags +0x7ff&&+0x |
| `0x100dcb00` | impl_worker | Shared volume worker reached by SetVolume (direct), SetRelativeVolume (thunk mode=1) and GetVolumeDB (thunk mode=0): dead instID compare, zeroes channel-record  |
| `0x100dcc44` | impl_thunk | Arg-remap thunk: -> f_100dcb00(impl,1,instID,0,chanrec,adjustment). |
| `0x100dcc64` | impl_thunk | Arg-remap thunk: -> f_100dcb00(impl,0,instID,1,chanrec,val). |
| `0x100dcc84` | impl_anomaly | Installed at SOAP slot +0x28 (SetVolumeDB) in vtable A: ignores args, toggles impl+0x7f1 (Master mute), syncs +0x7da->+0x3c8 when +0x7ff==0, applies f_100d7f34, |
| `0x100dcd88` | impl_anomaly | Installed at SOAP slot +0x2c (GetVolumeDBRange): calls f_100d9b4c(this,0,'Master',...), logs 'ButtonSetMute on:%d src:%s'. |
| `0x100e43b4` | impl_shim | GetVolume impl shim: instID!=0 -> 702 else tail-call worker f_100e42a8. |
| `0x100e42a8` | impl_worker | GetVolume worker: ctx acquire (f_10118278, f_1011fdd0 on impl+0x3c4/+0x9c8), lock +0x938, readiness gate f_102a5028(*(impl+0x3ac)) -> 501, read f_100da830, 'spa |
| `0x102a5028` | state_gate | Readiness/state predicate on the audio-context object (*(impl+0x3ac)); failure -> impl rc 501. |
| `0x100da830` | read_helper | rc_impl worker handling 'spectral'/'spatial' EQ modes |
| `0x102a50b8` | read_helper | Nested-object volume read: *(impl+0x3ac)->+0x34->+0xd0 then f_107ea964 writes the u16 via stack-byte out-param. |
| `0x100d65f4` | null_stub | 3-instruction null stub (stwu/addi/blr): returns r3=impl ptr, writes nothing, leaves stale cr0. Installed at slots +0x30 (GetBass) and +0x3c (SetTreble) in both |
| `0x100d72dc` | impl | SetBass impl: (impl, recordptr); *rec == -1 -> no-op; else lock +0x938 and stw *rec -> impl+0x898. |
| `0x100e3450` | impl | GetTreble impl: ignores instID and out ptr entirely; ctx acquire + worker f_100e1fec; returns worker rc. |
| `0x100e1fec` | impl_worker (497i): mutex + XML doc build (f_10807034 appends) + f_1067c6ec notify-all call - produces event/doc then notifies subscribers | Treble ctx-worker (~0x11e0 frame, SPE ops): computes the EQ value consumed by GetTreble.; recovered literals: 'inprocess-events','Change in event loop detected' |
| `0x100d7f34` | apply | Apply committed rendering state (called after mute/volume writes; takes impl). |
| `0x1067c6ec` | notify-all-subscribers thunk: tails f_1067c46c(obj,0,0); that fn iterates subscriber list at obj+0xa0 calling f_10686048 per entry | Notification call on impl+8 with r10=0x1f5 following state writes. |
| `0x100d993c` | release/free helper: calls 0x11098b08 (free) + f_10572ab0 | rc_impl Master-channel volume worker |
| `0x100d9b4c` | locked apply helper: f_10988268 lock -> f_100d8568 worker | rc_impl 'FocusMode' setter |
| `0x100da1e0` | locked apply helper: f_10988268 lock -> f_100d8784 worker | Locked rc_impl worker — acquires impl+0x938 lock (0x10988268) + inner 0x100d8784 |
| `0x1046dff0` | grouped-op coordinator (327i): orchestrates member calls f_1053ce34/f_1053db38/f_10759984 + XML append f_10807034 + notify; multi-phase op | Derived-class prelude: builds an operation object at sp+0xa0 from impl+0xbc8 and impl+0x9c8, readiness-checks it (f_1053ce34), returns a handle consumed by f_10 |
| `0x1046c3cc` | refcount/resume gate: *(r3+0xc54)++; <=2 returns, else tails f_1046c148 | Derived-class prelude companion to f_1046dff0, invoked before tail-calling the base impl. |
| `0x10988564` | sync | Lock-guard constructor on impl+0x938 (recursive mutex); paired with f_10988990 destructor/unlock. |
| `0x100e382c` | impl_worker | Shared EQ/context read worker invoked by GetEQ (f_100e4188) and the GetVolume 'spatial' branch; operates on (impl,&ctxobj).; recovered literals: 'Device does no |
| `0x100e27b0` | impl_worker | EQ apply worker called by SetEQ as f_100e27b0(this, arg, flag) once per zero-valued selector arg.; recovered literals: '<Event xmlns="urn:schemas-upnp-org:metad |
| `0x100d66cc` | impl | GetHeadphoneConnected impl: locks impl+0x938, fills {vol32@+8 (from +0x7da or +0x7e0 by flags +0x7ff/+0x801), mute-byte@+0xc, flag@+0xd} record, returns 1. |
| `0x100d6764` | impl | GetSupportsOutputFixed impl: builds record via f_10203ec8, calls impl->v\[+0xf0\], returns 63 on rc==0 (no out write) or 52 on rc!=0 (writes rec+0x24 to out). |
| `0x100d6610` | impl_thunk | GetOutputFixed impl: pure tail-forward impl->v\[+0xe0\](impl,0,r4). |
| `0x100dbcd4` | impl | GetRoomCalibrationStatus impl: 0x34-record init, lock +0x938, f_100dbb74(rec, arg>>16) sonar-calibration query. |
| `0x100dcfc0` | result-record builder: zeroes {+0..+0x1c}, sets +0=0x34 size, calls obj->v\[+0xe4\] and stores result code | SetOutputFixed impl: 0x34-record zero-init + flag reads +0x7ff/+0x801 on the r4 object; likely writer of the +0x7ff fixed-output flag. |
| `0x100d7400` | impl | SetChannelMap impl: cr0-input entry gate, v+0x5c==f_100d7364 override detection, flag +0x7ff check, 'Master' strcmp dispatch. |
| `0x100d9d40` | locked settings op: f_10988268 + strcmp(0x11098d98) + f_100d7f34 + notify f_1067c6ec + f_100d993c | Shared per-channel parameter worker used by ResetBasicEQ and ResetExtEQ with (this, arg1, arg2, val) shape. |
| `0x10988268` | sync | Alternative lock/enter call on impl+0x938 used by f_100d99b0/f_100d66cc with a rc_impl.cxx source-line arg (e.g. 0x49a/0x1009) - location-tagged mutex acquisiti |
| `0x10988558` | sync | Simple lock on impl+0x938 (no location arg) used by several impls; paired with f_10988984 unlock. |
| `0x10988984` | sync | Unlock/sub-lock call on impl+0x938 returning a byte consumed by callers (e.g. SetChannelMap). |
| `0x10203ec8` | thin wrapper -> f_109ec9f0 (19i) | Small record-builder used by GetSupportsOutputFixed before the v+0xf0 delegate call. |
| `0x100dbb74` | locked settings-store op: f_10988268 + f_100ecbac + f_100d7f34 + f_10557fa8/f_105587f0/f_10558000/f_10559024 settings family + f_100d993c | rc_impl 'SetVolumeScaling' worker |
| `0x100dee74` | virtual-base this-adjust thunk: r3-8 -> f_100de178 | RestoreVolumePriorToRamp impl (vtable A) |
| `0x1053ce34` | member bool getter: lbz *(r3+0) return | Readiness/predicate check on the prelude object built by f_1046dff0 in derived-class impls. |
| `0x1053db38` | no-op stub (blr only); next fn 0x1053db44 = idx*0x28 stride accessor | Cleanup/teardown of the prelude object in derived-class impls. |
| `0x10759984` | helper (179i): f_1053daf0 + mutex pair + f_10765a00/f_10762df8 list ops | Constructor for the prelude object at sp+0xa0 from impl+0xbc8 and impl+0x9c8 in derived-class impls. |
| `0x103a1b8c` |  | Group member fan-out worker (SetGroupMute path): builds per-member {service:'urn:schemas-upnp-org:service:RenderingControl:1',action:'SetMute'} request records  |
| `0x103a2430` |  | SetGroupVolume impl-side worker logging 'SetGroupVolume: local:%d netops:%u zones:%u' - counts local writes, outstanding network ops, and zone count during fan- |
| `0x1039fbd4` |  | 'process GroupVolumeSetActionEvent (%u,%d)' - processor for the internal group-volume bookkeeping event. |
| `0x104164e4` |  | 'firing GroupVolumeSetActionEvent (vol:%u,mute:%d,from_sonos:%d,vligrouping:%d)' - posts the group-volume event. |
| `0x103a3f28` |  | Per-member request callback installed in the 0x2740-byte member records built by f_103a1b8c. |
| `0x1039d11c` |  | Builds the 'GroupMute' and 'GroupVolumeChangeable' evented state-variable names. |
| `0x10214790` |  | 'Sent group volume change %u to eSDK (mute %d)' - pushes group volume/mute to the eSDK/cloud channel. |
| `0x102aff9c` |  | Worker dispatching via table @0x11098d98 + helper 0x10687e54 |
| `0x10557cac` |  | mutex-lock counterpart of f_10557848 for impl+0x458 |
| `0x10557afc` |  | RAII-scope variant locking impl+0x458, used by the wide-arg getter impls with a scoped-context guard (callback f_100caad8). |
| `0x10557848` |  | Unlock counterpart of f_10557cac for the impl+0x458 mutex. |
| `0x1032e550` |  | Fills a request record for a mode/flag operation (e.g. crossfade value). |
| `0x1032e494` |  | Fills a request record from impl+0x5dc state plus a u16 target (track advance ops). |
| `0x1032e2d8` |  | Destroys/releases a request record (called on both success and failure paths). |
| `0x102b8c44` |  | UPnP action logger: emits 'upnp' '<action-name>' records ('pause','stop','next','previous','play','change play mode','change crossfade'). |
| `0x106a7880` |  | Streamer-session pause vfunc invoked on *(impl+0x5a0) after control submission; nonzero result = accepted. |
| `0x106a7a34` |  | Streamer-session next-track vfunc invoked on *(impl+0x5a0); nonzero = accepted. |
| `0x106a9e88` |  | Streamer-session mode-set call f(streamer,1,mode_enum,0,0) used to forward play-mode changes to the streamer. |
| `0x102d0ac8` |  | Mode-agnostic transport-command fallback: f(impl,1,1,-1,-1) used by Pause when the direct streamer path fails; -1,-1 sentinels = current track/pos. |
| `0x102cfa50` |  | Capability-gated worker — queries impl+0x5dc caps (0x10148308) before proceeding |
| `0x102b0058` |  | Pre-play check called by Play; when it returns 0 the impl proceeds to f_102cfa50 submission. |
| `0x102d39ac` |  | Source-classification call f(impl,'upnp') in Play; result==1 selects the non-muse-source rebuild path. |
| `0x102c350c` |  | State-mutating worker — scoped-context (0x102ab4dc) + notify impl+8 r10=0x1f5 (0x1067c6ec) + guard dtor (0x10807034); queue/avt family |
| `0x102b2ee4` |  | Source-state query used by the Play non-muse path to decide whether a rebuild is needed. |
| `0x102b1c5c` |  | avt_impl queue/transport worker |
| `0x102b4b48` |  | Post-advance activation call f(impl,1) used after successful indexed Next (and mirrored in Stop). |
| `0x10256a84` |  | Indexed session operation call f(impl+0x580,op,rec_ctx,name,flag): op 5 = activate-next-source (Next/Stop), op 1 = stop. |
| `0x102b0a48` |  | Stream-mode stop worker: f(impl,0) invoked when mode==1 in Stop. |
| `0x102b05e4` |  | Transport-state update tail: f(impl,1) run by Stop after the mode-specific work; its rc is returned as the impl status. |
| `0x102931f0` |  | Stop-precondition check on impl+0x5dc: cr0.eq must be set or Stop returns 701 before any work. |
| `0x102ae2d0` | mutex-guarded worker: f_10988564 lock -> f_103d7e8c -> f_10988990 unlock | Member-object call on impl+0xaaa0 run at the start of Stop before the precondition check. |
| `0x102d094c` | dispatch helper: f_102d086c -> f_102ceb40 | Conditional teardown call in Stop chime-restore path and Play tail. |
| `0x102d2bec` |  | Stop worker (impl arg2=1): clears impl+0x7778, calls f_102ae2d0(impl+0xaaa0), checks f_102931f0(impl+0x5dc) -> 701, then mode-dispatches the stop and runs f_102 |
| `0x102b00cc` |  | Pause worker: f_102aff9c(impl+0x5dc,rec,0x19,0) then streamer f_106a7880(*(impl+0x5a0)); returns 0 on submit-fail else the streamer result. |
| `0x102b0140` |  | Stream-mode Next worker: submit op-0x19 then streamer next vfunc f_106a7a34(*(impl+0x5a0)); returns streamer result or 0 on submit-fail. |
| `0x102b01b4` |  | Stream-mode Previous worker: submit op-0x19 then streamer prev vfunc (*(impl+0x5a0)); returns streamer result or 0 on submit-fail. |
| `0x102b60b0` |  | Next worker: mode==2 -> indexed submit (f_10255f64, rc map 2->800/3->711/else->701) with next-source escalation via f_102b1c5c; mode!=2 -> f_102b0140 stream pat |
| `0x102b6214` |  | Previous worker: mode==2 -> capability check (f_10258ab0(impl+0x580,0,1) bit 0x00100000; incapable => silent success no-op) then indexed submit (rc!=0 -> 711);  |
| `0x102b24dc` |  | SetPlayMode worker: maps {NORMAL=0,SHUFFLE_NOREPEAT=1,REPEAT_ALL=2,SHUFFLE=3,REPEAT_ONE=4,SHUFFLE_REPEAT_ONE=5}; non-NORMAL needs f_10147928+f_10148308+impl+0x1 |
| `0x102b26dc` |  | SetCrossfadeMode worker: requires mode==2; requires f_101471f0/f_101475dc caps and non-HLS URI (strncmp 'x-sonosapi-hls:'); arg==0 silently succeeds on incapabl |
| `0x102b1684` |  | GetTransportInfo worker: mode dispatch filling the three out strings; default path runs f_10308aec(impl+0x5d4) + strlcpy of impl+0x5dc source name. |
| `0x10147928` |  | Source/queue presence query on impl+0x5dc; nonzero required before any non-NORMAL play mode is accepted. |
| `0x10148308` |  | Capability query on impl+0x5dc (returns a caps/u16 word used by Next deep path and SetPlayMode gates). |
| `0x101471f0` |  | Crossfade-capability query on impl+0x5dc; must be nonzero before nonzero crossfade is accepted. |
| `0x101475dc` | string/mem op via 0x110999f8 (37i) | Second crossfade-capability query on impl+0x5dc; must be nonzero. |
| `0x10688070` |  | Stream-session liveness check on impl+0x5dc used by the mode==1 play-mode path before calling the streamer. |
| `0x10308aec` | string copy via strlcpy(0x11098ad8) (85i) | Default-path transport-state filler: f(impl+0x5d4,&outs...) used when mode is neither 1 nor 2. |
| `0x102587b4` |  | Capability-mask reader on the session/queue object (pair with f_10258ab0). |
| `0x100caad8` | leaf combiner, no calls (17i) | Deferred-scope callback / transport-changed emit helper installed in the getter scope-guard and invoked on Play submit path. |
| `0x102ab4dc` |  | Scoped-context builder taking (buf,name,name_end) - wraps the impl+0x3dc name for logging scope. |
| `0x102ab5d4` | strlen wrapper via 0x11098920 (22i) | Scoped log-record initializer used by Play non-muse path. |
| `0x10807034` | XML/doc append-alloc via 0x110991a0 (16i) | Scope-guard destructor invoked when the scoped-context self-check fails. |
| `0x102ab010` | single-insn stub | Deferred function pointer (at 0x10eaea90) swapped in by Play/GetTransportInfo boilerplate. |
| `0x10479bb4` |  | CreateSavedQueue worker on queue-manager singleton 0x11096770 (mutex via f_10988558 on this+0x28). Builds a 0x4040-byte job record through f_103d1aec (job vtabl |
| `0x10479fb8` |  | Saved-queue URI-append worker on the queue-manager singleton (0x11096770). Reached through the refcounted-session protocol: caller atomically increments *(sessi |
| `0x1047a3bc` |  | Saved-queue reorder worker on the queue-manager singleton (0x11096770); same refcounted-session protocol as f_10479fb8. |
| `0x104794d4` |  | Queue persistence worker invoked by the AVTransport SaveQueue path; performs the on-disk queue save after Title validation. |
| `0x100c5050` |  | Refcount release helper for the queue-session token object (global 0x11096774); decrements *(obj+4) and frees at zero. Pairs with the atomic stwcx. increment pe |
| `0x1047851c` |  | Queue-subsystem worker called inside the Queue-service registration helper f_104634c4 during singleton refcount setup. |
| `0x104791b0` |  | Queue-subsystem worker called from the service-registration path f_101981f0 alongside session-token installation on the zoneplayer object. |
| `0x10465fac` |  | Queue-manager ctor: initializes the Queue-tagged manager object, stores vtable 0x10ed1bcc, builds member sub-objects via f_1067aec4 and f_10807034. |
| `0x10466280` |  | Queue-manager Browse vfunc body (vtable 0x10ed1bcc +0x28); larger function than the forwarder thunks - performs the queue browse enumeration. |
| `0x10465f7c` |  | Queue-manager SaveAsSonosPlaylist vfunc body (vtable +0x24); persists the attached queue as a Sonos playlist. |
| `0x10465a44` |  | Queue-manager vfunc forwarder thunk: replaces `this` with *(this+0x128) (shared queue engine) and tail-calls 0x102b6948. |
| `0x10465a54` |  | Queue-manager vfunc forwarder thunk: replaces `this` with *(this+0x128) (shared queue engine) and tail-calls 0x102b2da4. |
| `0x10465a64` |  | Queue-manager vfunc forwarder thunk: replaces `this` with *(this+0x128) (shared queue engine) and tail-calls 0x102dff24. |
| `0x10465a74` |  | Queue-manager vfunc forwarder thunk: replaces `this` with *(this+0x128) (shared queue engine) and tail-calls 0x102b3a84. |
| `0x10465a84` |  | Queue-manager vfunc forwarder thunk: replaces `this` with *(this+0x128) (shared queue engine) and tail-calls 0x102b3954. |
| `0x10465a94` |  | Queue-manager vfunc forwarder thunk: replaces `this` with *(this+0x128) (shared queue engine) and tail-calls 0x102b3924. |
| `0x102b6948` |  | Engine add-to-queue worker: logs URI+MD under avt_impl tag, takes engine mutex +0x458, forwards to insert op f_102b674c; single exit returns insert rc verbatim. |
| `0x102b3a84` |  | Shared remove-all-tracks engine worker. Reached from AVTransport.RemoveAllTracksFromQueue and Queue.RemoveAllTracks (vfunc f_10465a74 via *(qm+0x128)). |
| `0x1090ad44` |  | Zonegroup-topology singleton accessor: returns the topology/group object from global 0x110c8478 (via f_108073a0/f_1090acf4 refresh). Used by every group-engine  |
| `0x109089f0` |  | Group membership/state predicate on the topology object: reads obj+0xcc, compares against 0x1d family - nonzero means the zone is in a group-managed state. |
| `0x1075c4d0` |  | Record/lookup precondition on engine field impl+0x44c against the source object (r31+0x3dc): walks a linked record, nonzero result = precondition satisfied/entr |
| `0x10513230` |  | Class-B SetAVTransportURI vfunc: thin shim that tail-calls group worker f_10512bc0 with an extra rodata descriptor arg (0x10ea6a2c). |
| `0x10512bc0` |  | Group-aware SetAVTransportURI worker reached only from the class-B engine; performs URI set with group/coordinator semantics unresolved. |
| `0x10513244` |  | Class-B BecomeCoordinatorOfStandaloneGroup impl: gates on topology-singleton state (f_1090ad44+f_109089f0) and record precondition f_1075c4d0(impl+0x44c, src),  |
| `0x105133e4` |  | Class-B BecomeGroupCoordinator impl: if the topology singleton/state check FAILS it tail-calls the class-A impl f_102de740 verbatim (standalone semantics); othe |
| `0x105134a8` |  | Class-B BecomeGroupCoordinatorAndSource impl: identical gating - delegates to class-A f_102df410 when the group state check fails, else group path. |
| `0x109b6fe4` |  | avt_impl-tagged log/error helper called in the group coordinator paths (arg 3 context selector). |
| `0x104000c4` |  | Class-B (group-capable) engine ctor storing vtable 0x10edfbb8; sibling of the standalone ctor f_102cc070. |
| `0x10304390` |  | Real ContentDirectory.Browse handler: parses ObjectID, BrowseFlag, Filter, StartingIndex, RequestedCount, SortCriteria (0x400-capped strings, int helpers), acqu |
| `0x103042f0` |  | Browse executor: locks/looks up UpdateID via f_1034a224 on browse obj+0x168 (selector 0x2bd), strcmp-dispatches BrowseFlag - BrowseDirectChildren -> children en |
| `0x10305fec` |  | Browse result-record callback (2-ins stub at its head - real body follows); stored at +0x48 of the browse request record. |
| `0x102e17a8` |  | StartAutoplay impl (engine v+0x9c): null arg-vector gate returns 0x2ce (718), then tail-calls the autoplay installer f_102e14e0. |
| `0x102e14e0` |  | Autoplay-install worker (engine mutex +0x458). Reads suppression flag engine+0x465c: set -> logs "preventing autoplay because operation is overridden" (avt_impl |
| `0x102e1d68` |  | RunAlarm impl (engine v+0x98): null arg-vector gate returns 0x2ce (718), then tail-calls alarm worker f_102e17dc. |
| `0x102e17dc` |  | Alarm-run worker (0x1300 frame): requires r6 non-null else 0x102e1928 path; uses time/duration helper table 0x1108b284 (f_10c3eb60) to resolve the pending alarm |
| `0x102d1fc4` |  | SnoozeAlarm impl (engine v+0xa4). |
| `0x102ad8fc` |  | GetRunningAlarmProperties impl (engine v+0xa0). |
| `0x102ada98` |  | GetRemainingSleepTimerDuration impl (engine v+0x94). |
| `0x102b4de8` |  | ConfigureSleepTimer impl (engine v+0x90). |
| `0x10424ac4` |  | Stored-URI/path formatter: fills a 0x1000-byte destination with the autoplay/alarm source spec read from saved state. |
| `0x102da774` |  | URI-install helper shared with the class-B SetAVTransportURI path (same descriptor 0x10ea6a2c); applies a URI+metadata to the engine session. |
| `0x103d1aec` |  | Job-record constructor for queue mutations: stores job vtable 0x10ec7be0 at record+0, +0x403c=-1, +0x4018=0, +0x4044=flags arg. |
| `0x10462c80` |  | M3U/M3U8 playlist expansion worker (playlist log tag, iterateM3UPlayList %s): copies the source URI into a 0x401 buffer, opens a stream via f_10545064, iterates |
| `0x10545064` |  | Stream open helper used by playlist parsers to fetch the playlist document (URI -> stream object). |
| `0x10546520` |  | Stream line-reader: yields successive playlist lines until exhausted (nonzero = line read). |
| `0x1054103c` |  | Stream-close helper for playlist sources — closes via 0x10551300 + 0x10540b4c |
| `0x10460764` |  | Per-line URI parse/normalize helper applied to each playlist entry before job submission. |
| `0x104614b4` |  | Playlist-entry record builder used per parsed line (writes into the 0x5474 entry record). |
| `0x1010a2c0` |  | Delegate-object initializer invoked by the per-entry job ctors (0x10ed1750/0x10ed1770 vtables). |
| `0x10461e04` |  | ASX/WAX/WMX playlist expansion worker - same skeleton as the M3U worker: playlist log tag, iterateASXPlayList %s, stream open via f_10545064, per-entry job subm |
| `0x10463164` |  | PLS playlist expansion worker - same skeleton: iteratePLSPlayList %s, stream open via f_10545064. |
| `0x10462f54` |  | WPL playlist expansion worker - same skeleton: iterateWLPPlayList %s (WPL), stream open via f_10545064. |
| `0x102b6a9c` | worker | AddURIToQueue impl vfunc +0x64 (both engine classes): InstanceID!=0 -> returns 0x2ce (718); else arg-shifts and tail-calls engine add worker f_102b6948. |
| `0x102b674c` | worker | Queue-container insert op: builds decimal track-id from *(this+0x580)+0x30000, resolves queue record by id string; missing record -> rc 0x2ce (718); f_10149b24  |
| `0x102b62e8` | worker | Queue commit op: preloads rc 800 (unable to process) on three failure paths (0x102b635c/0x102b667c/0x102b66b0); forwards record-write rcs from f_1014f808 (0x102 |
| `0x1019d288` | impl_noop_stub | Null-stub implementation vfunc (stwu/addi/blr). Backs impl vtable 0x10e98278 slot +0x24, shared by DeviceProperties.SeparateStereoPair and SystemProperties.Edit |
| `0x100ad1bc` | tls_action_name_stash | Stashes the action name into the request-internal object (*(req+0x70)+0xe0). Begins with `cmpwi cr0,r3,0`: if the inner object is NULL it returns early leaving  |
| `0x1068f8cc` | shared_impl_v18 | Impl vfunc at shared-manager vtable 0x10e98278 +0x18, shared by DeviceProperties.AddBondedZones and SystemProperties.AddAccountX. Obtains a refcounted subobject |
| `svc_impl_model` | object_model | Service objects embed in the zoneplayer context and share the layout {vptr@+0x00, shared_ptr<Impl>.px@+0x04, shared_ptr<Impl>.pn@+0x08}. ctors zero +4/+8; the i |
| `cr_return_convention` | abi_convention | Impl-return ABI: impls signal outcome as r3=code + CR0.eq=(code==0) set inside the impl (e.g. cmpwi cr0,r3,0 or mr. before blr - proven in f_102d0ac8 at 0x102d0 |
| `f_1034a224` | named_worker_resolver | Search-criteria/filter parser worker: strcmp(name,'0') -> returns candidate worker else tails f_10349d00; sibling f_1034a294 validates fields (2x f_10347ad8 par |

## Dispatch candidates

Functions that looked like dispatchers, with the verdict each received.

### `0x105cd004`

RESOLVED: HTTP-client auth-retry method. Detects 'HTTP/1.1 401'/'HTTP/1.0 401' status lines (0x105cd030/0x105cd04c); vtable slots at 0x10edee00/0x10edeeb0/0x10ef4ae4 = same method installed on 3 HTTP-client subclass vtables - shared auth-retry base behavior. NOT a SOAP dispatcher.

Compares: `HTTP/1.1 401`, `HTTP/1.0 401`

### `0x10651eec`

RESOLVED: RINCON repset/content-format endpoint. 'x-rincon-content-format' hdr -> paranoid_atoui -> fmt index; handler table obj\[fmt+0x21\] (0x10651f50): null slot -> 404 (0x194); fmt<=4 requires auth ctx r31 else 401 (0x191) - low formats privileged; dispatch obj->v\[+0x8\](obj,fmt,arg,req) at 0x10651f90; f_10652038 installs handler vfunc f_10653a34; f_10652008 tail emits text/xml 'RINCON_FFFFFFFFFFFF99999' descriptor. Runtime-registered route (no static caller).

### `0x1068e65c`

NOT a SOAP dispatcher — native binary protocol handler. Parses a TLV-ish record via f_109dd184, reads tag byte at buf+2 and u16 at buf+0, f_109e10d8 maps to a command id (compared 0x4a), calls f_1067c700 worker; result stored at r31+0x30 with a 0x34-length path. Same TLV helper family as 0x1068e904/0x1068ec54 — a non-SOAP native protocol surface (SCI/netstart/zone-bus candidate). Body literals identify the surface: Invalid transport: WSS is required / Invalid namespace: UPnP renew not supported / Invalid namespace: UPnP unsubscribe not supported -> websocket (WSS) eventing handler carrying a binary/TLV-framed command set (cmd 0x4a seen); UPnP-style SUBSCRIBE/RENEW/UNSUBSCRIBE namespaces rejected by name.

### `0x1068e904`

RESOLVED: shared WSS SUBSCRIBE completion. ~10 per-service wrappers at stride ~0x308 (0x10610018,0x10610320,...) each resolve 'logicalSID' via f_1060b590 then bl f_1068e904. Uses TLV helpers f_109dd184/f_109e10d8 + f_109dcb6c + inet_aton (callback host resolution). Sibling of f_1068e65c which does the same path for the GENA/SUBSCRIBE request object.

### `0x1068ec54`

RESOLVED: shared WSS event-delivery/UNSUBSCRIBE worker. ~10 per-service wrappers at stride ~0x2cc (0x1060d5a8,0x1060d874,...) call it. Operates on subscription message object fields +0xec/+0xf0/+0xf4/+0x108/+0x10c; span copies via f_1068c040.

### `0x106bb20c`

RESOLVED: settings config-key dispatcher (registered by name). Compares key 'explicitContentFiltering' at 0x106bb274/0x106bb3f4; fault-code 0x191(401) at 0x106bb318. No static callers/vtable -> bound through runtime settings-handler registry. NOT a SOAP dispatcher; part of the HTTP settings/config surface.

Compares: `explicitContentFiltering`, `explicitContentFiltering`

### `0x1073d8f8`

RESOLVED: dispatcher 0x1073d8f8 is the AudioIn service dispatcher (vtable 0x10f11f70 at svc+0, installed by ctor f_1073d930 into *(r3-in+0xaa6c)). Reject-all: emits 401 for every action — the service is a registered stub in this build. Evidence is definitive: unconditional 401 emit (li r4,0x191) + vtable 0x10f11f70 at svc+0 installed by ctor f_1073d930.

## Shared subsystems

Reusable primitives recovered from the binary — prefer these over re-reading per-action detail.

### `soap_fault_wire_format`

- **name:** SOAP fault wire template
- **format:** <s:Fault><faultcode>s:Client</faultcode><faultstring>UPnPError</faultstring><detail><UPnPError xmlns="urn:schemas-upnp-org:control-1-0"><errorCode>%d</errorCode></UPnPError></s:Fault>
- **note:** fault detail carries ONLY the numeric errorCode - no errorDescription element on the wire; literal detail strings (e.g. Update URL is malformed) travel via out-arg records, not this template
- **status:** confirmed
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eebdcc, notes: prefix template
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10eebe60, notes: suffix template; %d errorCode interpolated between them

### `soap_fault_code_vocabulary`

- **status:** strong
- **extraction:** li/ori immediates in error-band scanned across all 1848 worker/impl functions referenced in the DB (tools/_errdomain2.py); per-function literal sets persisted in docs/worker_err_literals.json
- **upnp_band** (79):

  ```
  101, 102, 103, 104, 105, 106, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 400, 401, 402, 403, 404, 405, 408, 411, 501, 606, 608, 624, 640, 651, 652, 664, 680, 699, 701, 702, 705, 706, 710, 711, 712, 717, 718, 720, 728, 800, 801, 802, 803, 804, 806, 807, 808, 810, 1000, 1003, 1021, 1023, 1024, 1025, 1026, 1028, 1040, 1043, 1046, 1056, 1057, 1100, 1104, 1143, 1152, 1161, 1178, 1200, 1221, 1224, 1266, 1272, 1287
  ```
- **semantics:** every 'vret'/passthrough error domain is bounded by the union of its impl worker's exit literals + this aggregate vocabulary; concrete per-action subset requires exit-block dataflow (runtime boundary for the impl->engine delegation chains)
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: strong, notes: 1848 fn literal scan; canonical UPnP bands {101-118,400-411,501,600-730,800-813,1000-1300}

### `soap_client`

- **status:** confirmed
- **wire:** SOAPACTION header grammar: '%s%sSOAPACTION: "%s%s%s"' and '%sSOAPACTION: "%s#%s"' — urn#action forms
- **logging:** 'UPnP call: %s:%s from %s:%d' inbound / 'returned %d to %s:%d' outbound; Tunneled UPnP call variant — SOAP relayed over the cloud tunnel shares the dispatcher
- **impl:** protocol/client/src/{sonos_cprovider,request,client,renew}.cxx — outbound control-point stack

### `soap_param_redaction`

- **status:** confirmed
- **flags:** secure + sensitive + trackIDing + prevent per-param flags
- **semantics:** params (passwords, tokens, account data) flagged to be excluded from SOAP request logging; 'Invalid secure param' when a redacted param is malformed

### `upnp_client_stack`

- **status:** confirmed
- **lifecycle:** Subscribe{Logical SID,Port,Secure Eventing,srRet} -> SID+UDN assigned -> renew (HTTP result/SR codes) -> 'Unsubscribe in renew' resubscribe-on-4xx -> unsubscribe
- **tracking:** dual SID model: wire SID + stable 'logical SID' surviving resubscribe; per-UDN binding; X-RINCON-BOOTSEQ detects publisher reboot
- **ordering:** OOS SEQ detection: 'Received OOS %u/%u for SID' + 'last handled: %u'; 'changedMap: 0x%x' per-var changed bitmask
- **cloud_mirror:** each service's subscription also exposed as v1/players/{playerId}/upnp<svc>/subscription/{logicalSID} {subscribe,renew,unsubscribe} ops

### `upnp_eventing_impl`

- **status:** confirmed
- **files:** upnpeventing_{sender,source}.cxx + cprovider/sonos_cprovider.cxx
- **opt:** enableUPnPEventingGNDOptimization flag — GENA notify-dedup/batching
- **semantics:** upnpeventing module w/ 'svc:%s' service tagging

### `upnp_genaclient`

- **status:** confirmed
- **files:** `/oc/protocol/client/src/renew.cxx`, `/oc/protocol/client/src/request.cxx`, `request.cxx`

### `gena_eventing`

- **status:** confirmed
- **files:** `/oc/zone/common/upnpeventing_source.cxx`, `/oc/zone/common/eventing.cxx`, `eventing.cxx`

### `subscription_manager`

- **singleton:** 0x11097680
- **register:** v\[+0x3c\] invoked by GENA handler f_105e8290 on valid SUBSCRIBE (NT/NTS/SID/SEQ checks pass); concrete class runtime-bound
- **sid:** generated by f_109e117c via sonos_uuid_generate+unparse
- **record_fields:** sub obj: frame@+0x30, flag@+0x34, state@+0x38
- **status:** strong

### `wss_event_vocabulary`

- **name:** WSS eventing subscription-type registry
- **role:** websocket (secure) event-subscription surface; TLV frame {u16 tag@+0, u8 type@+2} mapped to {id,name} via 73-entry runtime table
- **table:** 0x110b8ce8 (.bss, stride 0x14, count 0x49)
- **populator:** f_10098d34 (unrolled name/tag/handler stores)
- **lookup:** f_109e10d8 (tag/type -> entry+0 value; cmd 0x4a compared at call site)
- **reject_paths:** `Invalid transport: WSS is required (0x10f02958)`, `Invalid namespace: UPnP renew not supported (0x10f0297c)`, `Invalid namespace: UPnP unsubscribe not supported (0x10f029a8)`
- **entry_layout:** {+0x0 id/value, +0x4 name_ptr, +0x8 u32 monotonic event-type id (3..355), +0xc u16 tag, +0xe s8 type, +0x10 u32 kind}
- **names** (66):

  ```
  accessorySwapStatus, tvAudioSignalStatus, activeZonesChange, zoneDefinitionsChange, alarmClock, alarmVersionChange, areasVersionChange, zoneError, audioClipStatus, audioInput, availableSoftwareUpdate, avTransport, batteryStatus, wirelessNetworkStatus, microphoneSwitchStatus, waterStatus, bluetoothPairingStatus, bluetoothConnectionStatus, poeStatus, cloudRegistration, connectionManager, contentDirectory, lineInStatus, wiredSubConnectionStatus, deviceProperties, diagnosticSubmissionResults, diagnosticMetadata, effectiveSettingsDataChanged, entitlementsVersionChanged, extendedDeviceStatus, extendedPlaybackStatus, favoritesVersionChange, groupCoordinatorChanged, groupManagement, groupRendering, hdmiStatus, historyVersionChanged, householdUpdateStatus, upgradeManager, htControl, indexerStatus, musicServices, musicServicesChanged, playbackMetadataStatus, playbackStatus, playlistsVersionChange, positioningSessionStatus, positioningSessionError, positioningDeviceStatus, renderingControl, sessionError, sessionInfo, settingsVersionChanged, settingsDataChanged, settingsPlayerSettingsChanged, systemProperties, sleepTimerStatus, trueplayStatus, speakerPresenceStatus, speakerPresenceRateChange, trueroomAdaptationStatusEvent, trueroomCalibrationStatus, trueroomStatusEvent, virtualLineIn, voiceAccountsVersionChange, zoneGroupTopology
  ```
- **status:** confirmed
- **note:** 73 WSS event-subscription types; each {name,id,tag,type} via runtime .bss table; kind field at +0x10 (kind==2 predicate at f_109e12b0); reject paths WSS-required/renew-not-supported/unsubscribe-not-supported
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x10098d34, notes: populator writes name/tag/handler triples
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x109e10d8, notes: 73-iteration lookup loop, entry stride 0x14
- **entries** (73):

  ```
  accessorySwapStatus, tvAudioSignalStatus, activeZonesChange, zoneDefinitionsChange, alarmClock, alarmVersionChange, areasVersionChange, zoneError, audioClipStatus, audioInput, availableSoftwareUpdate, avTransport, batteryStatus, wirelessNetworkStatus, microphoneSwitchStatus, waterStatus, bluetoothPairingStatus, bluetoothConnectionStatus, poeStatus, cloudRegistration, connectionManager, contentDirectory, lineInStatus, wiredSubConnectionStatus, deviceProperties, diagnosticSubmissionResults, diagnosticMetadata, effectiveSettingsDataChanged, entitlementsVersionChanged, extendedDeviceStatus, extendedPlaybackStatus, favoritesVersionChange, groups, groupCoordinatorChanged, groupManagement, groupRendering, groupVolume, hdmiStatus, historyVersionChanged, householdUpdateStatus, upgradeManager, htControl, indexerStatus, localDevices, musicServices, musicServicesChanged, playbackMetadataStatus, playbackStatus, playbackError, playerVolume, playlistsVersionChange, positioningSessionStatus, positioningSessionError, positioningDeviceStatus, queue, renderingControl, sessionError, sessionInfo, settingsVersionChanged, settingsDataChanged, settingsPlayerSettingsChanged, systemProperties, sleepTimerStatus, timers, trueplayStatus, speakerPresenceStatus, speakerPresenceRateChange, trueroomAdaptationStatusEvent, trueroomCalibrationStatus, trueroomStatusEvent, virtualLineIn, voiceAccountsVersionChange, zoneGroupTopology
  ```
- **field_notes:** slot idx=0..72; +0x8 aux = monotonic global event-type id (3..355); +0xc u16 = TLV subscription-category tag (grouped: 0xf device-status family, 0x7d-0x89 UPnP-service family, 0x5a-0x60 playback/session, 0x3d trueplay, 0x26 settings, 0x52 zone); +0xe u8 type=0; +0x10 flags/handler
- **protocol:**
  - **frame_format:**
    - **layout:** {u16 tag @+0, s8 type @+2, payload...}
    - **lookup:** f_109e10d8(tag,type): scans table 0x110b8ce8 stride 0x14 x 0x49 entries matching e+0xc==tag AND (e+0xe==-1 wildcard \| type rules); returns entry index or 0x4a=invalid
    - **evidence:** f_109e10d8; call site 0x1068e6e0
  - **subscription_lifecycle:**
    - **create:** f_109e117c: sonos_uuid_generate -> sonos_uuid_unparse = new SID
    - **record:** subscription obj: frame ptr @+0x30, flag byte @+0x34, state word @+0x38
    - **renew:** rejected: 'Invalid namespace: UPnP renew not supported' @0x1068e830
    - **transport:** 'Invalid transport: WSS is required' @0x1068e794 - WSS-only
  - **f10_field:** entry +0x10 u32 in {0,4} - flag/category; consumer semantics undecoded
  - **error_path:** f_1068c138 appends error text into a doc buffer (strlen -> f_1068c040 span-append via doc-writer adaptor) - WSS errors are doc-embedded, not HTTP-status; f_1068c190 namespace strcmp(obj+0x124) matcher used for 'UPnP renew' rejection
- **f10_field:**
  - **field:** entry +0x10 u32 kind/category
  - **consumer:** f_109e12b0(idx): bounds idx<=0x48, entry=0x110b8ce8+idx*0x14, returns (entry\[+0x10\]==2) predicate
  - **writer_semantics:** literal stores of {0,1,2} observed in the f_109d8bxx/f_109d8bxx registration-path region; kind values enumerate entry categories (0/1/2); kind==2 = the service-visible category gated by the predicate accessor
  - **status:** strong
  - **evidence:**
    - type: disassembly, locator: 0x109e12b0..0x109e12e8, note: lwz +0x10 -> xori 0x2 -> cntlzw -> rlwinm = ==2 predicate
- **name_order:** registry index order from f_10098d34 sequential stores
- **table_full:**
  - idx: 0, name: accessorySwapStatus, id: 78, tag: 18
  - idx: 1, name: tvAudioSignalStatus, id: 4, tag: 18
  - idx: 2, name: activeZonesChange, id: 12, tag: 82
  - idx: 3, name: zoneDefinitionsChange, id: 13, tag: 82
  - idx: 4, name: zoneError, id: 14, tag: 82
  - idx: 5, name: alarmClock, id: 20, tag: 64
  - idx: 6, name: alarmVersionChange, id: 24, tag: 1
  - idx: 7, name: areasVersionChange, id: 34, tag: 2
  - idx: 8, name: audioClipStatus, id: 38, tag: 3
  - idx: 9, name: audioInput, id: 40, tag: 65
  - idx: 10, name: availableSoftwareUpdate, id: 51, tag: 63
  - idx: 11, name: avTransport, id: 52, tag: 66
  - idx: 12, name: batteryStatus, id: 55, tag: 15
  - idx: 13, name: wirelessNetworkStatus, id: 56, tag: 15
  - idx: 14, name: microphoneSwitchStatus, id: 57, tag: 15
  - idx: 15, name: waterStatus, id: 58, tag: 15
  - idx: 16, name: bluetoothPairingStatus, id: 59, tag: 15
  - idx: 17, name: bluetoothConnectionStatus, id: 58, tag: 15
  - idx: 18, name: poeStatus, id: 61, tag: 15
  - idx: 19, name: lineInStatus, id: 62, tag: 15
  - idx: 20, name: wiredSubConnectionStatus, id: 63, tag: 15
  - idx: 21, name: cloudRegistration, id: 74, tag: 19
  - idx: 22, name: connectionManager, id: 77, tag: 67
  - idx: 23, name: contentDirectory, id: 80, tag: 68
  - idx: 24, name: deviceProperties, id: 90, tag: 69
  - idx: 25, name: diagnosticSubmissionResults, id: 95, tag: 8
  - idx: 26, name: diagnosticMetadata, id: 96, tag: 8
  - idx: 27, name: effectiveSettingsDataChanged, id: 101, tag: 9
  - idx: 28, name: entitlementsVersionChanged, id: 106, tag: 10
  - idx: 29, name: extendedDeviceStatus, id: 110, tag: 7
  - idx: 30, name: extendedPlaybackStatus, id: 111, tag: 30
  - idx: 31, name: favoritesVersionChange, id: 115, tag: 11
  - idx: 32, name: groups, id: 133, tag: 13
  - idx: 33, name: groupCoordinatorChanged, id: 134, tag: 12
  - idx: 34, name: groupManagement, id: 136, tag: 70
  - idx: 35, name: groupRendering, id: 137, tag: 71
  - idx: 36, name: groupVolume, id: 138, tag: 14
  - idx: 37, name: hdmiStatus, id: 140, tag: 16
  - idx: 38, name: historyVersionChanged, id: 141, tag: 17
  - idx: 39, name: householdUpdateStatus, id: 147, tag: 20
  - idx: 40, name: upgradeManager, id: 148, tag: 20
  - idx: 41, name: htControl, id: 149, tag: 72
  - idx: 42, name: indexerStatus, id: 152, tag: 23
  - idx: 43, name: localDevices, id: 160, tag: 6
  - idx: 44, name: musicServices, id: 166, tag: 73
  - idx: 45, name: musicServicesChanged, id: 167, tag: 25
  - idx: 46, name: playbackMetadataStatus, id: 181, tag: 31
  - idx: 47, name: playbackStatus, id: 184, tag: 29
  - idx: 48, name: playbackError, id: 185, tag: 29
  - idx: 49, name: playerVolume, id: 192, tag: 33
  - idx: 50, name: playlistsVersionChange, id: 195, tag: 34
  - idx: 51, name: positioningSessionStatus, id: 211, tag: 35
  - idx: 52, name: positioningSessionError, id: 212, tag: 35
  - idx: 53, name: positioningDeviceStatus, id: 213, tag: 35
  - idx: 54, name: queue, id: 223, tag: 74
  - idx: 55, name: renderingControl, id: 237, tag: 75
  - idx: 56, name: sessionError, id: 246, tag: 32
  - idx: 57, name: sessionInfo, id: 247, tag: 32
  - idx: 58, name: settingsVersionChanged, id: 252, tag: 38
  - idx: 59, name: settingsDataChanged, id: 253, tag: 38
  - idx: 60, name: settingsPlayerSettingsChanged, id: 254, tag: 38
  - idx: 61, name: sleepTimerStatus, id: 259, tag: 52
  - idx: 62, name: systemProperties, id: 274, tag: 76
  - idx: 63, name: timers, id: 276, tag: 59
  - idx: 64, name: trueplayStatus, id: 288, tag: 61
  - idx: 65, name: speakerPresenceStatus, id: 289, tag: 61
  - idx: 66, name: speakerPresenceRateChange, id: 290, tag: 61
  - idx: 67, name: trueroomAdaptationStatusEvent, id: 292, tag: 62
  - idx: 68, name: trueroomCalibrationStatus, id: 293, tag: 62
  - idx: 69, name: trueroomStatusEvent, id: 294, tag: 62
  - idx: 70, name: virtualLineIn, id: 309, tag: 77
  - idx: 71, name: voiceAccountsVersionChange, id: 313, tag: 81
  - idx: 72, name: zoneGroupTopology, id: 322, tag: 78
- **entry_semantics:** {+0x4 name, +0x8 event-type-id (3..355), +0xc u16 wire tag, +0xe s8 type, +0x10 kind} — idx==registry slot, id==internal event enum, tag==on-wire TLV tag

### `internal_event_bus`

- **status:** confirmed
- **src:** ../anacapa-1.0/oc/zone/common/internalevts.cxx; observer perf bound 'Internal event observer (%s.%s) took too long \[%llu ms\]'
- **vocabulary** (84):

  ```
  AVTBecomeStandaloneEvent, AVTStateChangedEvent, AVTStateLastChangedEvent, ActiveZonesChangedEvent, AdvertisementUrlChangedEvent, AlarmClockTimeZoneChangedEvent, AmplifierPowerStateChangedEvent, AreasVersionChangedEvent, AudioClipEvent, AudioInputAttributesEvent, AudioInputDisconnectedEvent, AutoPlaySettingsEvent, AvtHaltActionEvent, BootSequenceEvent, ChsrcEvent, CloudConnectionChangedEvent, CloudSessionEvent, DefunctDeviceRemovedEvent, DesignatedDeviceChangedEvent, DeviceNetInterfaceStateEvent, DeviceStartupEvent, DuckingEvent, EsdkEvent, ExtAudioPlayStateChangedEvent, FeatureConfigChangedEvent, GroupAdvertiseRequestEvent, GroupChangedEvent, GroupVolumeChangedEvent, GroupVolumeSetActionEvent, HouseholdSettingsChangeEvent, InfoUpdatedEvent, LineInStateChangedEvent, LocalIpChangedEvent, LocalPlayerChangeEvent, MissingBondedZoneMemberDetectedEvent, MusePlaybackContextChangeEvent, MusicAccountChangedEvent, NetworkIpAddrAssignedEvent, NewCertRegistrationEvent, NewLocationIdEvent, NewMuseHHIDEvent, NewSSIDEvent, NewZPEvent, OrientationChangeEvent, PlaybackEvent, PlaybackStateChangedEvent, PortableWifiReconnectEvent, PreportProtoEvent, ProxiedFastVol0Event, RManualResetEvent, RcNotifyGrcEvent, RegCertUpdateEvent, RemoteConnectionTypeChangedEvent, RemoteHTSwapStateChangedEvent, RemoteIpChangedEvent, ReplicatedSettingsChangedEvent, ReplicatedSettingsNeedsUpdateEvent, RequestTVTransitionEvent, SatConfigEvent, SecureRegistrationChangeEvent, SecureRegistrationStateUpdateEvent, ServerHandleShutdownEvent, SpotifyInternalEvent, StereoPairStateEvent, SwitchingRadiosEvent, SystemPropertiesChangeEvent, TVInputSelectedEvent, TVSignalDetectedEvent, TopologyEventsReportEvent, TopologyGroupMemberRemovedEvent, TopologyZpListChangedEvent, TrueplayCalibrationChangedEvent, TrueplayStateEvent, TrustDevCertChangedEvent, UTCTimeAvailableEvent, UpdateSonarEvent, UpdatedZPExpirationEvent, VliTransportActionEvent, VoiceAccountTransactionEvent, VolumeChangedEvent, VolumeSetActionEvent, WakeOnLANRequestEvent, ZonePlayerConfigurationEvent, ZonesDefinitionsChangedEvent
  ```
- **count:** 84
- **channels:**
  - **status:** confirmed
  - **note:** init-table registrants (0x11085328) each subscribe named internal events to three observer classes: ie-obs (immediate observers), ie-schd (scheduled dispatch), ie-cache (cached/latest-value subscribers). ~60 *Event names recovered from registrant string refs.
  - **classes:** `ie-obs`, `ie-schd`, `ie-cache`
  - **events** (60):
  
    ```
    PlaybackEvent, RuntimePolicyEvent, CdNotifyUpdateId, DeviceNetInterfaceStateEvent, ZoneMemberSettingsChangedEvt, ZonesDefinitionsChangedEvent, MusicAccountChangedEvent, AVTBecomeStandaloneEvent, BootSequenceEvent, SpotifyInternalEvent, RequestTVTransitionEvent, TVSignalDetectedEvent, TVInputSelectedEvent, PlaybackCorrelationEvt, ChsrcEvent, ChsrcSysSettingsEvt, UTCTimeAvailableEvent, AlarmClockTimeZoneChangedEvent, AreasVersionChangedEvent, OrientationChangeEvent, VliTransportActionEvent, DuckingEvent, RecordDuckingActionEvent, CloudConnectionChangedEvent, ExtAudioPlayStateChangedEvent, HouseholdSettingsChangeEvent, MissingBondedZoneMemberDetectedEvent, DefunctDeviceRemovedEvent, FeatureConfigChangedEvent, GroupAdvertiseRequestEvent, LineInStateChangedEvent, NetworkIfaceBouncedEvt, LocalIpChangedEvent, NewCertRegistrationEvent, SatConfigEvent, WakeOnLANRequestEvent, AvtHaltActionEvent, AutoPlaySettingsEvent, AirplayIncludeGroupedEvt, AVTStateLastChangedEvent, RemoteIpChangedEvent, AdvertisementUrlChangedEvent, DeferredSettingsChangeEvent, PortableWifiReconnectEvent, RegCertUpdateEvent, ReplicatedSettingsNeedsUpdateEvent, ReplicatedSettingsChangedEvent, SystemPropertiesChangeEvent, TrustDevCertChangedEvent, NewZPEvent, UpdatedZPExpirationEvent, TopologyZpListChangedEvent, InfoUpdatedEvent, PlaybackStateChangedEvent, VliVolumeProcessingCompleteEvt, VolumeSetActionEvent, RcSetEqActionEvt, AudioClipEvent, AmplifierPowerStateChangedEvent, CdNotifyShareIx
    ```
- **bus_name:** inprocess-events
- **observer_api:** Registering "%s" observer "%s". Total observers: %zu — events are named *Event objects; observers register by event name; delivery logs "Queued %s(%u) from \"%s\" : { %s }" and "Beginning delivery of %s(%u) event on thread %zu" — each event has a name, numeric id and a {json} payload string.

### `device_description_template`

- **status:** confirmed
- **mechanism:** placeholder substitution ('Sending device_description.xml to %s (cv=%d)')
- **device_types:** `urn:schemas-upnp-org:device:ZonePlayer:1`, `urn:schemas-upnp-org:device:MediaServer:1`, `urn:schemas-sonos-com:device:MediaServer:1`
- **placeholders** (40):

  ```
  #UUID#, #HOST#, #DISPLAY_VERSION#, #SW_VERSION#, #SW_GENERATION#, #NODE_PROTO_VERSIONS#, #HTA_FRAME_VERSIONS#, #MUSE_API_VERSIONS#, #TRUEPLAY_SDK_VERSIONS#, #HW_VERSION#, #EXTRA_VERSION#, #SERIAL_NUM#, #MAC_ADDRESS#, #SW_MINCOMPATVER#, #SW_LEGACYCOMPATVER#, #API_VERSION#, #MIN_API_VERSION#, #MODEL#, #ZONETYPE#, #NAME#, #DISPLAY_NAME#, #VENDOR_NAME#, #FEATURE1#, #FEATURE2#, #FEATURE3#, #FEATURE4#, #SERIESID#, #VARIANT#, #INT_SPEAKER_SIZE#, #QPLAY_SUPPORT#, #AMP_ONTIME#, #MEMORY#, #FLASH#, #FLASH_REPARTITIONED#, #RETAIL_MODE#, #SSL_PORT#, #HHSSL_PORT#, #MEDIASERVER_NAMESPACE#, #CD_NAMESPACE#, #NS_VERSION#
  ```
- **proprietary_extensions:** `<qq:X_QPlay_SoftwareCapability>QPlay:2</qq:X_QPlay_SoftwareCapability> @0x10ef8cc6`
- **adjacent_surfaces:**
  - **muse_async_command:** muse_async_command_handler_impl.cxx; '%s/api/v%d/%s'+'%s/v%d/%s' route formats; Bearer auth; cmdId dedup ('Duplicate cmdId','Invalid cmdId','Command was preempted by a newer command'); queue 'muse-async-cmdq-'; scopeAsyncMuse
- **scpd_present:** SCPDURL elements present in served device_description.xml — 16 /xml/<Svc>1.xml service descriptions advertised (CORRECTED: earlier 'no SCPDURL' claim was wrong — it checked the binary's generated-doc path, but the served doc is the htdocs template which has SCPDURL)

### `svcmanifest`

- **status:** confirmed
- **file:** svcmanifests.json per-account manifest; downloaded per sid/sn; 'replicating manifest file from %s' — manifests household-replicated via nodetx
- **impl:** svcmanifestfile.cxx

### `xml_parser`

- **status:** confirmed
- **library:** expat 2.5.0 with EXPAT_ACCOUNTING_DEBUG + EXPAT_ENTITY_DEBUG + EXPAT_ENTROPY_DEBUG instrumented (billion-laughs amplification accounting + entropy checks); xmlparse.c:%d debug sites
- **wrapper:** 'xmlprs' parser-ctx allocator f_10c3fc68 ('parser ctx allocation failed; parameters are not correct'); callback table installed (f_10c3fbcc); mutex-guarded via RabortIfUnlocked
- **client_parse_error:** 'error parsing XML returned from SOAP request / (utf8 issue?)' (f_10562cac prints ***** banner on outbound-response parse failure)
- **usage:** inbound SOAP body (req +0x08 -> f_10562d64 -> f_10562cac), outbound SOAP responses, DIDL-Lite metadata, ZGT state, plist XML

### `mega_impl_object`

- **status:** confirmed
- **description:** f_101a22c4 constructs a ~0x1b8 multi-base implementation object installing ~30 sub-vptrs from the 0x10e97* vtable family (0x10e97644..0x10e97e8c). Bound to svc px fields via shared_ptr{px,pn} assigns with new(0x14) control blocks (vptr 0x10e98974, strong/weak=1). Each service px points at a different base slice; DP/SP impl vtable 0x10e97e10 belongs to this family - DP and SP literally share one heap impl instance.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x101a22c4, notes: impl ctor: ~30 sub-vptr installs
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x1018fd14, notes: f_101b08a0 arg-pack build
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x1018fd48, notes: px=r19 store + control-block bind
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, notes: topology +0x124 slice vptr is 0x10e8b1bc (stw at f_10125b54:0x10126250); its slots +0x08..+0x14 = 0x1073e8f0/0x1073e980/0x10752ad4/0x1074d568, all r4(-0x124)-adjustor thunks to f_1073e7c8/f_1073e8f8/f_10752780/f_1074d02c — a member-serializer interface with convention f(r3=out-struct, r4=member-arg+0x124, r5=emit-buf): f_1073e7c8 emits arg+8 via tag-writers f_109dadb8/f_109dad10, f_1073e8f8 via f_109daf48, f_10753110 reads arg+0x438/+0x4c8/+0x4cc; a second vtable 0x10f123dc (installed by sub-ctor f_1074043c inside the same mega-ctor chain) exposes the same run shifted by one slot (+0x08..+0x14 = 0x1073e980/0x10752ad4/0x1074d568/0x107533fc)
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, notes: GroupManagement impl hunt (final negative result): AddMember's impl call at 0x1073874c has an 8-arg out-fill signature — f(r3=impl, r4=&MemberIDbuf(sp+0x30), r5=BootSeq byte, r6=&out(sp+0x70), stack args 0x24/&sp+0x2b/&sp+0x4f8/0x401). Neither serializer-interface vtable matches: their vfuncs take (out, argobj, emitbuf) and would consume r5 as an emit target, not the BootSeq byte. Vtable-signature, thunk-signature, direct-store, indexed-store, registration-table, and px-address-compute searches all exhausted — GM px (ctx+0x3fa48) is bound by a shared_ptr copy-assign helper (f_101a20d0, dst=new/getter-returned ptr, src=ptr-to-{px,pn}) inside the master impl factory f_103fa434, where the dst address is produced by callees and resists static recovery
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, notes: RESOLVED: GroupManagement impl = dedicated 'gm_impl' class (primary vptr 0x10ec2bc0, ctor f_103938f0 registers name 'gm_impl' via f_10391210, ~0xda8-byte multi-base object), NOT a topology-mega-impl slice. Bound via f_101a20d0 shared_ptr copy-assign at f_103fa434:0x103fbfe8. All four action impls verified: AddMember f_10394d10, RemoveMember f_10395b0c->f_10395854, ReportTrackBufferingResult f_105c53d0 (unconditional-402 stub), SetSourceAreaIds f_10395564 — resolved via the 'gm_impl' debug-tag string inside the ctor

### `svc_array`

- **status:** confirmed
- **description:** Embedded service array in service ctx (r31=ctx+0x40000): 0xc-stride {vptr,px,pn} objects. ctx+0x3fa44 GroupManagement f_107389bc, +0x3fa50 GroupRenderingControl f_10739428, +0x3fa5c f_1073ca24, +0x3fa68 ContentDirectory f_10307e94, +0x3fa74 f_104656d0, +0x3fa80 VirtualLineIn f_1073d65c. Getter f_1019dbe4 computes base+0x3fa44 (svc array head); per-service getters adjust secondary base -0x3a8. px=impl shared_ptr ptr, pn=control block; dtor decrefs pn.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x1018fb74, notes: ctor batch in f_1018d27c
  - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, address: 0x1019dbe4, notes: array getter +0x3fa44

### `composite_subobject_interfaces`

- **signal_accessor:** +0x124-family vtable slots (0x10e98098 etc.): f_10187d14 = this-adjust thunk (-0x124) -> f_10187c18; the real method mutex-guarded (f_1098dfe0/f_10990bcc) registers a {callback f_101804d4, dtor f_10180cf4} pair via f_10694308 (signal-connect) and returns a shared_ptr'd observable (stwcx. atomic refcount in f_10187d1c at 0x10187da8) - the composite's per-subsystem event-source accessors
- **doc_writer:** f_100e5628 = adapted span-writer: stw self-ptr fixup then f_100d698c(*(in+4), *(in+4)+*(in+8)) byte-span append into a doc; sibling f_100e5670 = mode dispatch on {1,2,3}
- **implication:** the 'queue engine' and sibling embedded objects are the composite's OBSERVABLE SURFACE - runtime-wired interfaces bridging subsystems to the subscription/event layer; their vtables are runtime-bound exactly as documented
- **status:** strong

### `native_protocols`

- **sp_tlv:**
  - **name:** secure-pairing TLV stream (log tag 'sp_a5335660d494963ab7b783a270417bb8')
  - **framing:** 7-byte header {u16 tag @+0, u8 type @+2, u32 len @+3} + MAC-verified payload; reader advances +7 per record (0x10d0b2ac addi r28,0x7)
  - **integrity:** per-packet MAC via f_10d49490/f_10d4a88c -> memcmp -> 'Corrupted packet, invalid MAC' reject (0x10d0b1fc)
  - **transport:** buffered socket read f_10d0ae04: recv buf obj+0x4484/+0x4488 cap/+0x448c fill/+0x4490 off; f_10d0d970 raw read; f_10d0deb0 error -> obj+0x64a4
  - **errors:** 'Failed reading TLV header %d %d/7 oserr %d' (0x10fd7c40), 'Skipped %s(%d) (%d > %d)' oversized-record skip
  - **frame:** \[7B hdr {u16 tag,u8 type,u32 len}\]\[len-4 payload\]\[4B MAC\]; consume=len+7; MAC covers pkt+3..pkt+3+len (hdr-word+payload+tag region per 0x10d0b194..0x10d0b1d0)
  - **mac:**
    - **algorithm:** proprietary rotate-xor stream mixer (NOT md5/sha/hmac): per-byte xor-shift into ctx+0xc8 state with byte-counter at +0xcc; block round over ctx+0x00..0x40 state array every 32 bits (f_10d49504..f_10d49564); final squeeze emits 4 bytes via f_10d4a88c (rlwinm rot-xor rounds: x7\|x5, x19\|x22 mixing)
    - **ctx:** reader obj +0x659c MAC context; buffered stream fields +0x4484 base / +0x448c remaining / +0x4490 offset / +0x58 current-pkt len / +0x64a4 oserr / +0x6850 last-result
    - **verify:** memcmp(computed_tag, pkt+3+len, 4); fail -> 'Corrupted packet, invalid MAC' rc=-13; oversize -> 'Skipped %s(%d) (%d > %d)'
    - **status:** strong
    - **evidence:**
      - type: disassembly, locator: 0x10d0b178-0x10d0b2b4, 0x10d49490, 0x10d4a88c, note: full MAC pipeline + consume arithmetic
  - **attribution:** esdk AP-connection packet layer: src /var/lib/spotify/buildagent/.../esdk/src/modules/mod_ap_conn.c; asserts 'ap->packet_size <= 16384', 'Packet from AP is too large! Type: %d / Size: %d' (cap 0x4000)
  - **log_tags:** `sp_a5335660d494963ab7b783a270417bb8`, `sp_60e43b6e629920e455e243bab25b488a`, `sp_e943d8e115bd54bd41443240074a6853`
  - **frame_detail:** per-packet: 7B TLV header {type-byte, size} + payload + proprietary rotate-xor 4B trailing MAC verified via memcmp; 'ap os error code: %d' oserr path
  - **status:** confirmed
  - **sp_id_note:** ~330 'sp_<md5>' literals exist — esdk per-module log-channel identifiers (hash of module name), NOT distinct protocols; sp_a5335660d494963ab7b783a270417bb8 is the mod_ap_conn packet tag
- **wss_tlv:**
  - **name:** websocket UPnP event TLV (see wss_event_vocabulary.protocol)
  - **framing:** {u16 tag, s8 type} selector -> table lookup; 73 entries
  - **relation:** same tag/type header family as sp_tlv; WSS path carries subscription mgmt
  - **status:** confirmed
- **netstart_ipc:**
  - **name:** netstartd Unix-socket IPC client (the 'netstart' surface in this build - no 'netstart2' literal exists)
  - **transport:** /tmp/netstartd.ipc; hello handshake 'netstartd hello'
  - **files:** /jffs/netstartd_prev.log, /opt/log/netstartd.log, netstartd.dmp, netstartd.properties, netstartd.count, /netstartd-external, /var/run/netstart_mode, /tmp/netstartd.pid
  - **messages:** settings push ('...settings update to netstartd'), PSK update ('...ushed PSK update to netstartd'), pull ('...ettings update from netstartd'), type update '\[%s\]', 'SSID, cannot notify netstartd', refusal handling 'netstart refused'/'meshDisable (netstart refused)'
  - **status:** confirmed
- **mrpc:**
  - **name:** MRPC
  - **status:** ZERO literals in anacapad-86.10 - no 'mrpc' string anywhere. Either absent from this binary or unlabeled; honest negative result
- **sci:**
  - **resolution:** 'SCI' = SCI_BOARD enum #48 in the hardware-source name table @0x10ef4ed0 (60 entries, idx 0-59), NOT a separate wire protocol
  - **table:** 0x10ef4ed0: str*\[60\] bound-checked cmplwi 0x3d -> 'UNKNOWN'; enum: NO_SOURCE,AMP,LEDS,IR,HEADPHONE,SUBWOOFER,ORIENTATION,BUTTON_PLAYPAUSE/VOL_UP/VOL_DN/JOIN/MODE/POWER/MICMUTE/PAIRING,CAPZONEA/B/C/M/CAT,LINEIN,DAC,ADC,CPU,SOC,SONGLE,POWER,AVTRIGGER,LIGHT_SENSOR,LINEOUT,SPDIF_OUT,HDMI,BANANA_PLUG,NFC,MOTION_DETECTOR,BLE,WIFI,LAN,BATTERY,CHARGER,RTC,FUEL_GAUGE,MICMUTE_SWITCH,LEAN_UI_JOIN/OPENAP_DIAG/PREV/NEXT/SLIDER,SCI_BOARD,PSOC,CEC,UART,PMU,MCU1..4_AMP_L/R
  - **accessors:** `f_105d0220 (bound 0x3d)`, `f_105d0258`, `f_105d028c (bound 0x31)`, `f_105d02c0`, `f_105d02e0`, `f_105d0318`
  - **event_states:** `NO_EVENT`, `PRESSED`, `RELEASED`, `REPEATED`, `CONNECTED`, `DISCONNECTED`
  - **status:** confirmed
- **netstartd_ipc:**
  - **channel:** /tmp/netstartd.ipc unix socket; ipc_msg.cxx client (0x105d3664-region) with performReset/reconnect logic; handshake 'netstartd hello' (0x10691400 via f_109b72ac)
  - **message_format:** key-value event frames: msg obj built by f_10557fa8(init)+f_1055847c(set-field)+v\[+0x1c\](send); fields: eventType=<name>, hardware=wifi
  - **outbound_events:** `wifiConnected`, `wifiDisconnected`, `netsettings update (Pushed netsettings update to netstartd)`, `PSK update (Pushed PSK update to netstartd)`, `satellite addition (Failed to send IPC message to netstartd to notify about satellite addition)`, `meshDisable signal (signaling netstartd (%s) %s)`
  - **inbound_events:** `netsettings update (Received netsettings update from netstartd)`, `connection type update (Got connection type update from netstartd: \[%s\])`, `SSID decode failure path (Error decoding SSID, cannot notify netstartd)`
  - **files:** `/tmp/netstartd.ipc`, `/tmp/netstartd.pid`, `/var/run/netstart_mode`, `/jffs/netstartd_prev.log`, `/opt/log/netstartd.log`, `netstartd.{dmp,properties,count}`, `/netstartd-external`
  - **netstart2:** 'netstart refused'/'meshDisable (netstart refused)' indicate a netstart mode-gate (/var/run/netstart_mode); 'netstart2' as a protocol name does NOT appear - honest negative
  - **status:** strong
  - **evidence:**
    - type: firmware, binary: anacapad, build: 86.10-80260, status: strong, address: 0x10691400, function: 0x105d33a4, notes: msg build/send at 0x10691458-0x106914a4; ipc client 0x105d3664; source path ipc_msg.cxx at 0x10ef5f70
  - **full_event_vocabulary:** `netstartd hello (handshake)`, `Netstart is idle`, `Netstart alive`, `Netstart open`, `Netstart SSID set`, `Netstart SSID clear`, `Netstart triggered upgrade (0x%x): %s`, `Got connection type update from netstartd: \[%s\]`, `refusals: 'netstart refused', 'meshDisable (netstart refused)', 'Netstart failed to modify {wifi settings,meshDisable,SonosNet disable}'`, `Pushed netsettings update / PSK update`, `Received netsettings update`
- **websocket_lechmere:**
  - **status:** confirmed
  - **name:** 'lechmere.%u' — RFC6455 Sec-WebSocket-Protocol subprotocol token (version-suffixed)
  - **handshake:** sec-websocket-key + sec-websocket-version headers -> Sec-WebSocket-Accept; ../anacapa-1.0/oc/zone/common/websocketserver.cxx (webSocketServer)
  - **endpoints:** `/websocket/api`, `/api/v1/websocket`
  - **ops:** `websocket_close`, `Websocket protocol error`, `Write to websocket failed. opcode: %u, len: %zu`, `'websocket(data)' frame tag`, `'crt.poll' ping (0x10ef1aa0) + 'failed to ping'`
  - **status_doc_elements:** `<WebsocketRegistration>%s (%s)</WebsocketRegistration>`, `<WebsocketRegistration/>`, `<TruncatedConnectionList maxwebsockets='%zu' connections='%zu'/>`, `<WebSocketHistory>`
  - **protocol_model:** namespace-multiplexed bidirectional ws channel; namespaces route to actor objects (RZPMuseActor::setupWholeDevicePointers); e.g. namespace 'api.smartspeaker.audio'
  - **versioning:** subprotocol token 'lechmere.%u' offered, parsed via 'lechmere.%hhu%n'; 'lechmere-v1' version literal
  - **outbound:** client dials lechmere.%s.ws.sonos.com (cloud endpoint); 'Lechmere connection %s' lifecycle; SONOS_SERVER_LECHMERE_RECONNECT_LATER reconnect directive
  - **authorization:** authzPolicyKeyLechmere: policy key carries roles ('Could not parse role from lechmere policy key'); per-namespace check 'isAuthorizedForNamespace(0x%X) wA:%d \[%s\] isW:%d isA:%d'
  - **upnp_namespace_policy:** 'Invalid namespace: UPnP renew/subscribe/unsubscribe not supported' — UPnP namespace accepts control ops but not subscription-family ops
  - **logging:** /opt/log/anacapa.lechmere.event.log dedicated event log; 'failed to read lechmere header: %d'
  - **command_grammar:** <Command namespace="%s" cmd="%s" method="%s" credType="%s" />
  - **namespaces_versioned:** `v1.api.smartspeaker.audio`, `v2.api.smartspeaker.audio`, `(UPnP namespace: control-ops only, no subscribe/renew/unsubscribe)`
  - **activation:** RMuseController activating namespace (apiVersion=%u, ns=%s, cmd=%s); 'Successfully retrieved policy mapping for %zu muse namespaces'; ERROR_UNSUPPORTED_NAMESPACE
  - **debug_form:** <html><body>set: namespace=%s, command=%s, interval=%d, delayMs=%d</body></html> (namespace test page, likely /musedebug)
- **chirp_acoustic:**
  - **status:** confirmed
  - **sdk:** chirp-sdk core (/code/src/chirp-sdk + /code/chirp-core): 'Chirp SDK with "%s" profile v%u \[max %u bytes in %.2fs\], supporting %u channel(s), using %s modulation'
  - **modulations:** `cdma (encoder/decoder + codebook)`, `fsk`, `multitone`
  - **coding:** reed-solomon + crc + payload/bitstring/template pipeline; decoder: peaks/voter/scorer/weighting/rms
  - **chirp_types:** `SETUP_CHIRP`, `ROOM_DETECTION_CHIRP`, `EXT_CHIRP`, `ext-chirp-as/setup-chirp-as audio sources`, `as-dspin-ext-chirp / as-dspout-ext-chirp DSP taps`
  - **semantics:** 'Start chirping with unique device value:%d'; payload must match profile ('Chirp payload %s not supported'); 'Chirp volume not yet calibrated' gate; one chirp at a time ('already playing with playId %d')
  - **cloud_routes:** `v1/players/{playerId}/roomDetection/chirp`, `v1/players/{playerId}/roomDetection/chirp/{playId}`, `+household-scoped variants`
  - **soap_actions:** `RoomDetectionStartChirping`, `RoomDetectionStopChirping (added 86.8)`
  - **profile:** 'sonos-cdma' profile (protocol.c/protocol-acoustic.c/protocol-encoding.c/config-voter-config.c)
  - **modulation:** dual: CDMA primary (chirp_cdma_{encoder,decoder}, match/add_score) + FSK fallback (chirp_private_fsk.c, _chirp_on_sending_fsk)
  - **payload:** symbol-coded: chirp_payload_t {symbol_bits,length,total_bits}; preamble+parity payloads; Reed-Solomon FEC (reed-solomon.c/chirp_rs_t); chirp_levenshtein fuzzy match; unknown-symbol rejection; corrupt-random-symbols fuzz path
  - **playback:** playId model: 'Start chirping with unique device value', 'already playing with playId %d', 'Stop playId %d differ than m_chirpPlayId'; volume calibration ('Chirp volume not yet calibrated','current chirp output volume')
  - **wiring:** ext-chirp-as/setup-chirp-as + as-dspin/ext-chirp dsp taps; ChirpExtAudioSrc source; REST v1/.../roomDetection/chirp/{playId} maps here
- **settings_replication:**
  - **status:** confirmed
  - **src:** ../anacapa-1.0/oc/zone/common/{nodetx,replicated_settings}.cxx
  - **channels:** `nodetx_chsrc`, `nodetx_ht%d (HT NodeTX Blocks)`, `Hnodetx`, `settingsReplication`, `netsettingsReplication`, `nodetx_vli`
  - **wire_grammar:** <ReplicatedNetSettings LastUpdateDevice="%s" Version="%d" FileSchemaVersion="%d">...</ReplicatedNetSettings>
  - **accept_policy:** 'deciding whether to accept replicated list from: %s; ver: %u format: %u' -> accept on source+ver+format; rejects 'corrupt file','incompatible schema','Replicated SavedQueue file is not valid'
  - **version_handshake:** informLocalReplicatedSettingVersion setting %u LUD %s version %u (LUD=LastUpdateDevice); 'ReplicatedSettings must be setup before calling informLocalReplicatedSettingVersion'
  - **events:** `ReplicatedSettingsNeedsUpdateEvent`, `ReplicatedSettingsChangedEvent`, `SettingsReplicationState`
  - **status_doc:** `<ReplicatedSettingsState>`, `<NodeTXBuffer>%.3lf sec %s</NodeTXBuffer>`
  - **side_effects:** 'Settings Replication changed SN Disable from %d to %d (source: %s)'; 'Pending netsettings.json update discarded after replicating'; 'failed to rename offered replicated file'
  - **nodetx_generalized:** NodeTX is the generic inter-zone block transport, not just settings: channels nodetx_chsrc, nodetx_ht%d (HT blocks), nodetx_vli (VLI audio blocks, 'NodeTx configured to handle %s audio (qos: %d)', 'VLI NodeTX Blocks'); transport = chunked HTTP (TRANSFER-Encoding: chunked literals in nodetx.cxx)
- **virtual_linein:**
  - **status:** confirmed
  - **src:** media_player_vli_ctrl.cxx (mpvlictrl), vli_source_manager.cxx, vli_playback_tracker.cxx, vli_sink.cxx
  - **sessions:** onVirtualLineIn{StartSession,StopSession,SuspendSession,SessionStartInfoUpdated}; action codes AHA_{END,SUSPEND,PAUSE}_VLI_SESSION; group actions JOIN_GROUP_BASED_ON_VLI_STATE / BECOME_STANDALONE_BASED_ON_VLI_STATE
  - **source_types:** `vli_airplay`, `vli_bt (Bluetooth)`, `vli_ot (optical?)`
  - **transport:** setTransportToVLIStreamURI URI:%s autoplay:%d become-gc:%d + installClock; vliStreamImage(%s %u %u %u %s); blocks over nodetx_vli
  - **ops:** 6-op control surface: selectSource, startTransmission, stopTransmission, startAudio, stopAudio + sendBackChannelCmd — bidirectional back-channel (sink→source cmds for delay/volume negotiation)
  - **model:** source-transmits model: startTransmission publishes nodetx_vli stream; sinks join; VliTransportActionEvent lifecycle; delegated sessions handoff via seamless-delegation
- **airplay:**
  - **status:** confirmed
  - **transport:** AirPlay enters via VLI channel (vli_airplay); RTSP layer present ('RTSP CSeq mismatch or invalid CSeq')
  - **gates:** `allowAirplay/allowAirplaySetting`, `AirPlayEnabled (settings+ZGT var)`, `informLocalAirPlay`
  - **didl:** object.item.audioItem.linein.airplay; linein.airplay; airplay:; com.sonos.airplay
  - **grouping:** R_AirplayIncludeLinked; AirplayIncludeGroupedEvt; 'airplay include zones: %d'
  - **interactions:** SpZeroConfAnnounce{Pause,Resume} — Spotify Connect announce paused during AirPlay; log /tmp/AirPlay.log
- **bluetooth:**
  - **status:** strong
  - **model:** no local BT stack in anacapad — cloud-managed only: v1/players/{playerId}/hardwareStatus/{bluetooth,bluetoothPairing,pairedBluetoothDevices/{bluetoothAddress}} routes + scope cmds getBluetoothStatus/setBluetoothPairing/activatePairedBluetoothDevice/removePairedBluetoothDevice; 'Supported only on devices with bluetooth' gate; vli_bt stream source; hal_detect_get_cable_states
- **netstart2:**
  - **status:** confirmed-absent
  - **finding:** no 'netstart2' literal in any of 4 builds (34.16/57.10/86.8/86.10); netstartd IPC is the only netstart surface
- **chsrc_chsnk:**
  - **status:** confirmed
  - **model:** CHSRC (channel source, chsrc.cxx) multicasts group audio to CHSNK (channel sink) receivers via nodetx_chsrc; chsnk refreshes multicast join on NetworkIfaceBouncedEvent/NetworkIpAddrAssignedEvent
  - **sync:** chsnkSync + SNTP-aligned play clock: 'chsnk playing remote chsrc at %d.%06d'
  - **transactions:** 'RCHSRCReq Current Op: %s, Current TransactionID: %d'; 'RChannelSource Reported Spotify position: %lldms, state: %s, transitionAck: %d'
  - **delegation:** 'Chsnk restart requested by the new coordinator to avoid seamless delegation'; 'stop CHSNK to avoid seamless delegation for adaptive bitrate stream'; 'Using CHSRC TX for GM %s'
  - **constraints:** 'Count of off box members for VLISrcMgr \[%u\] must be <= CHSRC \[%u\]! Aborting'; 'ignore %s playOnCompletion; chsrc is already playing'; 'contacting remote chsnks'/'configuring local chsnk'
  - **dsp_taps:** `as-srcin-chsnk0`, `as-srcout-chsnk0`, `chsnk-sat-as`
  - **events:** chsrc-state-change/ChsrcEvent/ChsrcSysSettingsEvt/CHSRC Fill Level/chsrc_behind; /opt/log/anacapa.chsrc.state.log
  - **log:** /opt/log/anacapa.chsrc.state.log
  - **framing:** 'chsrc:framed'/'chsrc:te'/'chsnk_framed' block modes; block-buffered w/ ms-precision play-ahead: 'Socket has %zu bytes (%zu blocks). CHSRC ms ahead: %ld'
  - **control:** RCHSRCReq {Op,TransactionID} request/reply channel ('rchsrcreq','request retry loop timed out')
  - **transport:** multicast — 'chsnk refreshing multicast join' re-joins on NetworkIfaceBounced/IpAddrAssigned; nodetx_chsrc channel; per-instance chsnk%d audio streams
  - **modes:** chsnk playing local {chsrc,AI,VLI} / remote chsrc; count of off-box VLISrcMgr members <= CHSRC bound
  - **errors:** chsnk_lse, chsnk_ch_data_full, chsnk_w_err, chsrc_framer_uflw (framer underflow)
- **seamless_delegation:**
  - **status:** confirmed
  - **model:** coordinator handoff preserving playback state; DelegateGroupCoordinationTo -> 'will try to delegate to %s' (rejects 'delegation target %s not primary','cannot delegate to oneself','%s (type: %u) does not support seamless delegation','HT audio does not support seamless delegation')
  - **state_transfer:** 'Seeking to %ims in support of seamless delegation' (position carryover); 'Resetting track queue info' on receive; delegated source-area-ids parse; 'Refreshing expired content during delegation'; pullContext()/become-active guard (SWPBL-259788)
  - **input_suppression:** during setting-state/delegating: ignores audio flush, track-changed, seeks, pause, became-inactive, volume change
  - **esdk_path:** 'Seeking to %ims in support of seamless delegation'; 'Timed out waiting for AudioStart from eSDK during seamless delegation'; SpotifyDelegationNotification
  - **vli_guard:** 'Delegated VLI session is not playing; skipping pullContext()/become active device ... to avoid re-initiating Direct Control (SWPBL-259788)'
  - **transport:** 'sdbt' packet channel (seamless-delegation binary transport): 'sdbt receive packet failed', 'packet from remote src has incompatible protocol version' — versioned handoff packets
  - **handshake:** prepareToBeDelegationTarget -> 'Starting seamless handoff wait loop' -> 'Completed ... in %dms'; SpotifyDelegationNotification waits eSDK AudioStart (timeout)
  - **eligibility:** type-gated: HT audio + adaptive-bitrate streams unsupported (CHSNK stopped to avoid); 'delegation target not primary'/'cannot delegate to oneself'/'will try to delegate to'
  - **coordinator_ops:** BecomeGroupCoordinator{,AndSource} (Clone on non-member); 'change coordinator: old/new/ts/uri'; installClock + VLI-tx paths; 'seamless transition to {remote,local} src' w/ timeout
- **hwmessage_bus:**
  - **status:** confirmed
  - **encoding:** nanopb protobuf (pb_encode/pb_decode + pb_encode_submessage/tag_for_field/string); 'could not parse protobuf filter type'
  - **api:** hwmessagelib_connection_{init,getReadFD,readNextMsg,destroy}; enumStr_hwmessage_multicastGroupAddFailure
  - **multicast_groups:** `AUDIO`, `BATTERY`, `BUTTON`, `CAPZONE`, `HT`, `LED`, `SENSOR`, `SWITCH`, `TEMP`
  - **consumer:** RHWEvtHandlerZP select-thread reads via getReadFD + readNextMsg -> feeds hardware-source enum events (SCI_BOARD entry #48 = the SCI carrier board)
  - **other_protobuf:** 'Could not convert loaded satellite protobuf to HTChProcConfig' — HT satellite channel-processor config is protobuf too
  - **rpath:** $ORIGIN/../../../cc/{sonos-utils,wifi/libwifi,hwmessagelib/lib}
- **nts_stream_callbacks:**
  - **status:** confirmed
  - **description:** NTS (stream-delivery) callback interface between the transport layer and stream sources (esdk/SMAPI/VLI)
  - **callbacks:** `NTSCallbackStreamStart: id: %u, fmt: %u, drm: %u, size: %u, gain: %d`, `NTSCallbackStreamEnd`, `NTSCallbackStreamFlush`, `NTSCallbackStreamGetPosition`, `NTSCallbackStreamSeekToPosition`, `NTSCallbackPlaybackApplyVolume`, `NTSCallbackPlaybackNotify`, `NTSCallbackConnectionMessage`, `NTSCallbackConnectionNewCreds`, `NTSCallbackConnectionNotify`, `NTSCallbackError`
  - **fields:** stream {id, fmt-index, drm-id, size, gain} — format/DRM are numeric indexes into codec/DRM tables
- **smb_library:**
  - **status:** confirmed
  - **library:** libsmb2.so.1 — smb2_{init_context,set_version,get_dialect,set_security_mode,set_user,set_password,parse_url,connect_share,open/read/lseek/fstat/close,lazy_opendir/lazy_readdir/closedir,stat,get_error,get_nterror,disconnect_share,destroy_url/context}
  - **sharelist:** sharelist.cxx: XML '<Share Path=...' list; proposeUpdatedShareList + ShareListUpdateID; 'Rejecting invalid sharelist'/'path already exists' validation; backs x-file-cifs:* playback + /shares status
- **sntp_sync:**
  - **status:** confirmed
  - **role:** synchronizedPlay gates group playback on SNTP validity: 'SNTP waiting for valid at %d.%06d' -> 'SNTP valid %d continue to play %d at %d.%06d'; noderx I/O error while waiting
  - **transport:** vli src tx has own 'sntp port: %u' — SNTP timebase rides the VLI distribution port; 'Starting/Completed SNTP server switch in %dms'; htsnk_invld_sntp error; {sntppoll config; error %.0f ms %s
- **ir_decoder:**
  - **status:** confirmed
  - **impl:** irdecoder.cxx -> selthrd.RIRDecoder thread {reset,data,except,timeout fds} reading 'IR Event read: %zd, msgcount: %u' — hardware IR remote events feed the player
- **mntmgr:**
  - **status:** confirmed
  - **impl:** mntmgr.cxx — share mount manager shells /bin/mount + umount
  - **semantics:** mountShareDirectlyInternal/unmountShareDirectlyInternal; <Mount> XML doc; trial-mount across protocols w/ strike counter 'unsupported protocol %s (strike %d/%d)'; http-vs-fs mount distinction; credential-change→unmount; idle-share reaper; 'too many shares mounted' cap; mountID validation; temporary-share handling; mount-dir mkdir retry
  - **evidence:**
    - type: firmware, binary: anacapad, build: 86.10-80260, status: confirmed, notes: mntmgr.cxx log vocabulary, address: mntmgr.cxx
- **ducking_protocol:**
  - **status:** confirmed
  - **impl:** duck.cxx
  - **wire:** distributed 64-bit ducking-flag bitmasks (0x%016llx) exchanged zone-to-zone: 'Queueing/Dequeueing ducking bit from %s', 'zone %d received ducking bit', 'too many pending ducking bits'
  - **events:** DuckingEvent; LastChange vars <PlaybackDucked>%u <DuckingFlags>%s; RecordDuckingActionEvent telemetry
  - **policy:** R_MuseDuckingPolicy ('muse ducking policy: %x -> %x'); gates: voice-enabled→drop, playing-tv→drop, globally-disabled→drop, gc/avt-acquire-fail→honor; fastvolduck mode
  - **lifecycle:** runDuckingHeartbeat keepalive + expireRemoteDuckingFlags TTL; duck_tracker_mtx; forward-duck-command '%s to %s'
  - **http:** /duck /unduck endpoints (duckOrUnduck)
  - **state:** /tmp/crashed_play_state persistence
- **dropout_logging:**
  - **status:** confirmed
  - **impl:** dropout_event_logging.cxx
  - **semantics:** collectDropoutTriggered -> /dropout_triggered.xml (the /raw doc); modZPShutdown_DropoutEventHandler; fault injector 'injectdropout'/'Injected dropout error' for test
- **ht_audio:**
  - **status:** confirmed
  - **impl:** htaudio.cxx/htaudio_satellite_tx.cxx (+chprocessing/chsnk_processor*)
  - **semantics:** <HTAudioInCode>%u var; 'Using HTAudio TV TX for GM %s' — TV-source TX selection for group; RHTAudioSatelliteTx feeds bonded satellites
- **nodetx_channels:**
  - **status:** confirmed
  - **channels:** `nodetx_chsrc (group-audio source)`, `nodetx_vli (VirtualLineIn audio)`, `nodetx_ht%d (numbered home-theater channels)`, `settings-replication channel`
  - **qos:** 'NodeTx configured to handle %s audio (qos: %d)' — per-channel QoS tags
  - **stats:** <NodeTXBuffer>%.3lf sec %s</NodeTXBuffer>; 'HT NodeTX Blocks'/'VLI NodeTX Blocks' block accounting
  - **impl:** nodetx.cxx
- **secure_eventing:**
  - **status:** confirmed
  - **flags:** UPNP_OVER_TLS + 'Secure Eventing: %d' in Subscribe; 'securehhSSLPort'/'securehhsslport' + kSecureHHHttpsPortDeltaFromBase — household secure HTTPS port (base+delta); 'secure HH SSL server creds updated/cleared (port %u)'; SecureRegistration{State,Change}UpdateEvent state machine
- **lechmere_detail:**
  - **status:** confirmed
  - **impl:** lechmere.cxx
  - **subprotocols:** Sec-WebSocket-Protocol: lechmere.%u / lechmere-v1 / lechmere.%hhu%n — versioned ws subprotocol
  - **wire:** <Command namespace="%s" cmd="%s" method="%s" credType="%s" /> — XML command envelope over ws
  - **outbound:** dials lechmere.%s.ws.sonos.com; /opt/log/anacapa.lechmere.event.log event log
  - **authz:** policy mapping per muse namespace + role from lechmere policy key; RMuseController 'activating namespace (apiVersion=%u, ns=%s, cmd=%s)'
  - **blocks:** 'Invalid namespace: UPnP subscribe/unsubscribe/renew not supported'; 'Namespace has no actor'; 'namespace is not supported'; SONOS_SERVER_LECHMERE_RECONNECT_LATER reconnect
- **spotify_esdk:**
  - **status:** confirmed
  - **impl:** spotify/*.cxx + esdk mod_*
  - **playback_ops:** RSpotifyPlayback{Play,Pause,Seek,SeekRelative,SkipToNext,SkipToPrev,BecomeActiveDevice,SetDeviceInactive}
  - **media_delivery:** 'eSDK media delivery stream {start(id,type,size),data(id,size,offset),end(id),flush(id,pos),getPosition(id)}' + DUAL position tracking '(VLI: %d \[%d\], SMAPI: %d \[%d\])'
  - **connect:** _spotify-connect._tcp mDNS register/unregister/update; SpotifyMDNSRequest; spotifyTransferZeroConf; spotifyConnectTransferLoggedIn; SpotifyDelegationNotification (eSDK AudioStart wait in seamless delegation)
  - **sessions:** SpotifySessions; 'Couldn't find a Spotify SID'; eSDK logged out; group volume 'Sent group volume change %u to eSDK (mute %d)'
  - **uris:** spotify: + x-spotify:// / x-spotify-file:// + spotify:{track,episode}:; <Library Name='Spotify eSDK'>; esdk_api/esdk_spi; 'W esdk pump' thread; /opt/log/anacapa.spotify{,.debug}.log
- **qplay:**
  - **status:** confirmed
  - **surface:** /QPlay/Control + QPlayAuth(Seed,MID,DID) action + updateSharedTQPlayMode mode op
  - **advertisement:** <qq:X_QPlay_SoftwareCapability xmlns:qq=http://www.tencent.com>QPlay:2</..> in device description via #QPLAY_SUPPORT# placeholder
  - **note:** Tencent QPlay DLNA extension — seeded auth handshake
- **muse_async_commands:**
  - **status:** confirmed
  - **impl:** muse_async_command_handler_impl.cxx
  - **wire:** <muse_async_command ...> XML envelopes consumed off the cloud channel (lechmere)
  - **model:** thread-pool dispatch: queues muse-async-cmdq-* keyed by muse-async-cmd-id-*; scopeAsyncMuse + asyncMuseModZp scopes; modZPShutdown_AsyncMuseThreadPool shutdown; 'Cancelling all async Muse commands' on teardown; %s::%s async command execution failed
  - **wsclient:** websocketclient.cxx — outbound ws client w/ permessage-deflate ('could not initialize per message deflate on ws client')
- **http2_client:**
  - **status:** confirmed
  - **lib:** nghttp2
  - **role:** cloud transport — REST/ws API sessions over HTTP/2
  - **surface:** nghttp2_session_{send,upgrade2}; nghttp2_submit_{request,ping,goaway,settings,window_update}; nghttp2_{set_,session_set_}local_window_size
  - **behavior:** h1->h2 upgrade ('(via h1 upgrade)','(upgraded to SSL)','session_upgrade2'); ping/goaway keepalive; per-stream window mgmt; 'send request NOT allowed (via nghttp2)' gating; 'PRIORITY: stream_id == 0' frame error; 'pack_settings_payload' path
- **status:** strong

### `hwmessagelib`

- **status:** confirmed
- **api:** hwmessagelib_connection_{init,destroy,getReadFD,readNextMsg} — fd-based protobuf connection; libhwmessagelib.so.1 + libprotobuf-nanopb.so.0
- **multicast_groups:** 9 groups: {HT,LED,BUTTON,TEMP,SENSOR,BATTERY,CAPZONE,SWITCH,AUDIO} — multicast subscriptions by hardware-domain
- **handler_thread:** selthrd.RHWEvtHandlerZP.{reset,data,except,timeout} — dedicated hw-event select thread
- **features:** temperature_volume + ST_SCHEDULED_POST_WOW + IN_BUTTON_OBSERVATION_MODE + ENABLED_{,UN}AVAILABLE/DISABLED_{,UN}AVAILABLE state enum + hwmodel field
- **semantics:** the protobuf hardware-message bus (functional 'SCI') carrying button/LED/temp/sensor/battery/capzone/switch/audio/HT events from hardware daemons into anacapad

### `wifi_sonosnet`

- **status:** confirmed
- **mgmt:** wifictrl cmd channel (Ignoring wifictrl cmd=%d) + netstart daemon applies settings + wifi mode change/on change transitions
- **breadcrumb:** 'Unable to leave breadcrumb, can't disable wifi' + 'No controller confirmation, re-enabling wifi' — persistent recovery breadcrumb: on a Wi-Fi config change the ZP leaves a known-good marker; absent controller confirmation it self-reverts
- **state_desc:** dev-wifi-state/dev_wifi/wifi_dev — fields {mode, freq, ext, enabled, eth} via 'update wifi mode:%d freq:%u ext:%u enabled:%d eth:%d'
- **channel:** SonosNet channel-change propagation ('Pushed SonosNet channel change to %u for %u ms from now') — coordinated mesh channel hop + channelization data + channelNumber
- **health:** assoctracker + fire event 'health %s rssi %d' + beaconLostEvent + O_SLOW_WIFI_REPORTING_INTERVAL
- **netsettings:** wifi_pwd requires wifi_ssid + invalid wifi_pwd — credential grammar
- **power:** wifiDisable (reason) + wifiPowerSave
- **files:** `/oc/zone/common/wifi_idle_mgr.cxx`

### `bt_sbc`

- **status:** confirmed
- **libs:** libsbc.so.1 + libsonossbcpacket.so.1
- **codec:** sbc_{init,finish,parse,decode,encode,get_codesize,get_frame_length} — dual decode+encode (sink AND source)
- **packets:** 'invalid number of frames per sbc packet'; 'unexpected sbc {config,encode} result expected=%u->%u got=%zd->%zd'
- **led:** BT-mode LED state: m_bIsInExclusiveBTMode + m_bIsBTConnected + bFlashMode

### `ssdp_discovery`

- **status:** confirmed
- **wire:** M-SEARCH * HTTP/1.1 + HOST:239.255.255.250 + USN: + ssdp:alive/ssdp:byebye; 'Sent MSEARCH reply to %s:%u'; '%s unicast MSEARCH from %s'
- **headers:** X-RINCON-{HOUSEHOLD,BOOTSEQ,PROXY,VARIANT,REASON} extension headers; MX: search window
- **signing:** HMAC-signed M-SEARCH: X-SONOS-SIG: %s + X-Sonos-MS-Sig: headers; 'signature HMAC init failed'/'Failed to calculate/add M-SEARCH signature'/'base64 encoding failed'; signed manifests ('Got manifest with invalid signature', '<!-- SIGNATURE:')
- **handler:** RMSearchNotifyHandler thread + disHandleMSearchAsync dispatch; 'Failed to setup MSearchNotifyHandler'
- **dedup:** dual-discovery: 'handleDefunctZP %s reason %s IGNORED from MDNS - discovered by SSDP'/'from SSDP - discovered by MDNS but not SSDP'
- **containers:** x-rincon-cpcontainer:{RDCPA,RDCPI,*}:* grammar; 'Unknown old Rhapsody x-rincon-cpcontainer'

### `ssdp_signed_msearch`

- **status:** confirmed
- **wire:** M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1900\r\nMAN: "ssdp:discover"\r\nMX: %d\r\nST: %s\r\nUSER-AGENT: %s\r\n%s\r\n (trailer = signature block)
- **signature:** HMAC over request -> base64 ('M-SEARCH signature HMAC init failed','Failed to add M-SEARCH signature'); inbound verify: 'hmac sig verify error'; keys hmacDigest/hmac
- **response_headers:** `BOOTID.UPNP.ORG: %s`, `CONFIGID.UPNP.ORG: %d`, `CACHE-CONTROL: max-age = %u`

### `proprietary_headers`

- **status:** confirmed
- **outbound:** `X-Sonos-Playback-Id: %.*s`, `X-Sonos-SWGen: %u`, `X-RINCON-BOOTSEQ: %s`, `X-RINCON-VARIANT: %u`, `X-Sonos-Household-Id`, `X-Sonos-Corr-Id`, `x-sonos-target-udn`, `x-sonos-upnp-loopback-token`, `x-rincon-content-format (repset)`, `x-rincon-roomicon:generic`
- **hls_vocabulary:** `#EXT-X-VERSION`, `#EXT-X-TARGETDURATION`, `#EXT-X-MEDIA-SEQUENCE`, `#EXT-X-PLAYLIST-TYPE`, `#EXT-X-INDEPENDENT-SEGMENTS`, `#EXT-X-KEY:`, `#EXT-X-SESSION-KEY:`, `#EXT-X-MAP:`, `#EXT-X-DISCONTINUITY`, `#EXT-X-BYTERANGE`, `#EXT-X-ENDLIST`, `#EXT-X-MEDIA`, `#EXT-X-STREAM-INF`, `#EXT-X-PROGRAM-DATE-TIME`
- **hls_validation:** 'attempted to store an invalid rendition that doesn't begin with #EXT-X-MEDIA' (rendition-group enforcement)
- **mime_vocabulary:** `application/x-mpegurl`, `audio/x-mpegurl`, `audio/x-scpls`, `audio/x-sonos-recent`, `audio/x-spotify`, `audio/x-spotify-ogg`, `audio/x-aac`, `audio/x-aiff`, `audio/x-m4a`, `audio/x-ms-wma`, `audio/x-wav`

### `chirp_sdk`

- **status:** confirmed
- **name:** Chirp ultrasonic SDK 4.2.3 (chirp-sdk, build 1898)
- **evidence:**
  - type: firmware, address: 0x10fcf2d4, notes: chirp_sdk error-string table + /code/src/chirp-sdk/ paths + version literals
- **note:** Asynchronous Inc's Chirp SDK v4.2.3 — ultrasonic data-over-audio for device setup (sonos-cdma profile). Error vocabulary recovered: profile/channel validation, modulation-scheme mismatches, payload decode failures ('payload contains unknown symbols', 'Couldn't decode the payload'), gain-level errors, muted-device guard. Source paths leak the SDK layout: /code/src/chirp-sdk/chirp_sdk_process.c, chirp_sdk_states.c, /code/chirp-core/source/utils/src/utils/helpers.c; internal funcs chirp_sdk_process_shorts_{input,output}, chirp_sdk_send, chirp_levenshtein.
- **version:** 4.2.3
- **build:** 1898
- **internals:** `chirp_sdk_process_shorts_input`, `chirp_sdk_process_shorts_output`, `chirp_sdk_send`, `chirp_levenshtein`

### Other recovered subsystems

Additional primitives recorded in the database (see `documentation.json` `shared_primitives`):

`alarm_persist_writer`, `alarm_store_object`, `albumart_proxy`, `alert_engine`, `arping`, `assoctracker`, `audio_clip`, `audio_pipeline`, `audio_subsystem_files`, `audioin_impl`, `audiotap`, `auth_capability`, `autoplay`, `avt_session_lock`, `bonded_zones`, `cd_object_resolver`, `cert_identity`, `chsnk_processor`, `circuitbreaker`, `cloud_registration`, `cloud_request`, `cloudqueue`, `component_map`, `config_parsers`, `content_managers`, `csrf_protection`, `ddthrd`, `device_account_endpoint`, `device_auth`, `device_description_variants`, `device_registration`, `device_state_store`, `deviceproperties_impl_vtable`, `devmode`, `diagnostic_manifest`, `diagnostics`, `didl_classes_ext`, `discovery_layer`, `dns_sd`, `dropout_logging`, `entitlements`, `enum_tables`, `extaudiosrc`, `gena_internals`, `group_coordination`, `group_modes`, `hdmi`, `healthcheck`, `hls_radio`, `household_psk_vocabulary`, `ht_bonded_zones`, `ht_chsnk_processing`, `http_chunked_strictness`, `http_extra_endpoints`, `http_range`, `http_status_endpoints`, `httpcache_manager`, `hw_input_events`, `ibt_engine`, `icy_metadata`, `idle_events`, `internal_error_families`, `internal_result_namespace`, `ir_remote`, `lechmere_cmds`, `linked_libraries`, `location`, `location_engine`, `mdns`, `mdp_flash`, `media_player_mgr`, `migrationmanager`, `misc_components`, `misc_health`, `misc_mgrs`, `mod_zp`, `muse_authhelper`, `muse_common`, `muse_route_verbs`, `netsettings_mgr`, `netstart_ipc`, `noncehandler`, `ota_update`, `ota_upgrade`, `persistent_stores`, `pinewood_remote`, `play_state_mgr`, `protocol_info_full`, `queue_engine`, `queue_engine_object`, `replication_elements`, `reporting_policy`, `rmd_op_worker_class`, `runtime_policy`, `service_accounts`, `smapi_auth_policies`, `smapi_capability_vocabulary`, `smapi_layer`, `smartplay`, `sonarcal`, `sonos_concurrency`, `sonos_libs`, `sounddev`, `sp_store_object`, `spotify_esdk`, `sqlite_timers`, `startup`, `system_overrides`, `system_property_keys`, `target_udn_routing`, `telemetry_pipeline`, `testenv_logger`, `thread_inventory`, `timedjobs`, `timers`, `tls_stack`, `token_refresh_state_machine`, `toml_config`, `topology`, `topology_engine`, `trackplaymonitor`, `tsclient`, `upnp_cloud_tunnel`, `usage_data_sharing`, `vli_transport_detail`, `wake_on_lan`, `watchdog`, `websocket_impl`, `wifi_hal`, `xml_schema_clusters`, `zone_experiments`
