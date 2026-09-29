# anacapad SOAP/UPnP reference

Binary `anacapad`, build `86.10-80260` — model-9 (Playbar/limelight). Generated from the frozen canonical static-analysis dataset (`docs/documentation.json`); no runtime verification was performed. The binary implementation is the ground truth throughout.

## Authoritative counts

| Count | Value | Definition |
|---|---|---|
| **device-advertised** | 201 (incl. 2 without canonical records) | SCPD-defined actions on the 16 service registrations present in the served device_description.xml serviceList; excludes AudioIn whose service is hidden (SCPD ships but service unlisted); includes the 2 stale SystemProperties advertisements |
| **SCPD-defined** | 207 (incl. 2 without canonical records) | actions declared in shipped SCPD documents (opt/htdocs/xml/<Svc>1.xml actionLists): all 205 canonical records + 2 removed SystemProperties actions (ProvisionCredentialedTrialAccountX, ResetThirdPartyCredentials) that remain SCPD-advertised but have no canonical record because they are absent from the 86.x dispatch surface |
| **binary-dispatched** | 205 | canonical records that resolve to a binary dispatch path; 199 reach a real implementation handler (141 ptr-table 'direct', 57 id-table 'virtual', 1 strcmp chain) and 6 resolve to the AudioIn reject-all stub |
| **implemented** | 199 | binary-dispatched records whose dispatch reaches a real implementation (excludes the 6 reject-all stubs) |
| **removed/stale** | 8 (incl. 2 without canonical records) | SCPD-defined actions removed from the live dispatch surface in 86.x: 6 canonical records dispatched to the AudioIn reject-all 401 stub + 2 SystemProperties actions absent from the dispatch table entirely (a stub name lookup miss faults 401 identically, so wire behavior matches the stubs) |
| **internal / hidden-callable** | 0 | callable by action name but not SCPD-advertised |
| **canonical action records** | 205 | every action object under services.*.actions in this dataset; 195 unique action names (some names recur across services) |
| unique action names | 195 | some names recur across services |

## Confidence vocabulary

- **visibility** — action/service surface classification: 'advertised' = declared in a shipped SCPD document AND (at service level) present in the served device_description.xml serviceList (16 of 17 services — everything except AudioIn); 'hidden' = service omitted from the serviceList even though its SCPD ships (AudioIn only); 'internal' = callable on the wire but not SCPD-declared — supported class, EMPTY on this build (verified: all 205 canonical actions appear in their service's SCPD actionList)
- **reachability** — 'callable' = dispatched to a real implementation; 'hidden-callable' = reachable by action name on the control path but not SCPD-declared — EMPTY on this build
- **confidence** — confirmed = direct binary proof; strong = strong static evidence; inferred = heuristic; unresolved = not yet determined
- **fault_vocabulary_caveat** — identical fault-code vocabularies across builds do NOT prove identical error behavior; a fault-code vocabulary delta claim is made only where control flow was also compared

## Services

| Service | Control path | Visibility | Actions | Status |
|---|---|---|---|---|
| [AVTransport](services/av-transport.md) | `/MediaRenderer/AVTransport/Control` | advertised | 42 | `strong` |
| [AlarmClock](services/alarm-clock.md) | `/AlarmClock/Control` | advertised | 17 | `strong` |
| [AudioIn](services/audio-in.md) | `/AudioIn/Control` | hidden | 6 (6 stub) | `confirmed` |
| [ConnectionManager](services/connection-manager-renderer.md) | `/MediaRenderer/ConnectionManager/Control` | advertised | 3 | `strong` |
| [ConnectionManager](services/connection-manager-server.md) | `/MediaServer/ConnectionManager/Control` | advertised | 3 | `strong` |
| [ContentDirectory](services/content-directory.md) | `/MediaServer/ContentDirectory/Control` | advertised | 16 | `strong` |
| [DeviceProperties](services/device-properties.md) | `/DeviceProperties/Control` | advertised | 27 | `strong` |
| [GroupManagement](services/group-management.md) | `/GroupManagement/Control` | advertised | 4 | `strong` |
| [GroupRenderingControl](services/group-rendering-control.md) | `/MediaRenderer/GroupRenderingControl/Control` | advertised | 6 | `strong` |
| [HTControl](services/ht-control.md) | `/HTControl/Control` | advertised | 8 | `strong` |
| [MusicServices](services/music-services.md) | `/MusicServices/Control` | advertised | 3 | `strong` |
| [QPlay](services/qplay.md) | `/QPlay/Control` | advertised | 1 | `confirmed` |
| [Queue](services/queue.md) | `/MediaRenderer/Queue/Control` | advertised | 11 | `strong` |
| [RenderingControl](services/rendering-control.md) | `/MediaRenderer/RenderingControl/Control` | advertised | 27 | `strong` |
| [SystemProperties](services/system-properties.md) | `/SystemProperties/Control` | advertised | 15 | `strong` |
| [VirtualLineIn](services/virtual-line-in.md) | `/MediaRenderer/VirtualLineIn/Control` | advertised | 8 | `strong` |
| [ZoneGroupTopology](services/zone-group-topology.md) | `/ZoneGroupTopology/Control` | advertised | 8 | `strong` |

## Sections

- [Architecture](architecture.md) — routing, dispatch, request lifecycle, shared subsystems
- [Availability matrix](availability-matrix.md) — the full action-by-action surface
- [State variables](state-variables.md) — evented and argument type variables
- [Events](events.md) — GENA/LastChange and WSS eventing
- [Errors](errors.md) — SOAP fault wire format and code vocabulary
- [URI formats](uri-formats.md) — URI scheme grammars
- [Payload formats](payload-formats.md) — opaque field/payload grammars
- [HTTP API](http-api.md) — non-SOAP HTTP endpoints and diagnostics
- [muse API](muse-api.md) — the v1 REST surface (route table, methods, op names)
- [Subsystems](subsystems.md) — non-SOAP protocols and engines with coverage levels
- [Firmware differences](firmware-differences.md) — cross-build/cross-model deltas
