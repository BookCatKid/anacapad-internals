# SOAP / UPnP

This is the classic UPnP control surface: the seventeen SOAP services the speaker advertises (plus the hidden ones it doesn't), every action they accept, every state variable they publish, and the wire rules that govern all of it. Each service gets its own page with a friendly walkthrough of what the actions actually do, followed by the reverse-engineered evidence: handler addresses, dispatch records, argument types, validation, and fault codes. The supporting pages cover the shared machinery underneath: how GENA eventing and LastChange documents push state to subscribers, the full fault-code vocabulary, the URI schemes used in SetAVTransportURI and friends, the opaque payload dialects embedded inside XML fields, and an action-by-action availability matrix across the whole surface.

## Services

| Service | Control path | Visibility | Actions | Status |
|---|---|---|---|---|
| [AVTransport](av-transport.md) | `/MediaRenderer/AVTransport/Control` | advertised | 42 | `strong` |
| [AlarmClock](alarm-clock.md) | `/AlarmClock/Control` | advertised | 17 | `strong` |
| [AudioIn](audio-in.md) | `/AudioIn/Control` | hidden | 6 (6 stub) | `confirmed` |
| [ConnectionManager](connection-manager-renderer.md) | `/MediaRenderer/ConnectionManager/Control` | advertised | 3 | `strong` |
| [ConnectionManager](connection-manager-server.md) | `/MediaServer/ConnectionManager/Control` | advertised | 3 | `strong` |
| [ContentDirectory](content-directory.md) | `/MediaServer/ContentDirectory/Control` | advertised | 16 | `strong` |
| [DeviceProperties](device-properties.md) | `/DeviceProperties/Control` | advertised | 27 | `strong` |
| [GroupManagement](group-management.md) | `/GroupManagement/Control` | advertised | 4 | `strong` |
| [GroupRenderingControl](group-rendering-control.md) | `/MediaRenderer/GroupRenderingControl/Control` | advertised | 6 | `strong` |
| [HTControl](ht-control.md) | `/HTControl/Control` | advertised | 8 | `strong` |
| [MusicServices](music-services.md) | `/MusicServices/Control` | advertised | 3 | `strong` |
| [QPlay](qplay.md) | `/QPlay/Control` | advertised | 1 | `confirmed` |
| [Queue](queue.md) | `/MediaRenderer/Queue/Control` | advertised | 11 | `strong` |
| [RenderingControl](rendering-control.md) | `/MediaRenderer/RenderingControl/Control` | advertised | 27 | `strong` |
| [SystemProperties](system-properties.md) | `/SystemProperties/Control` | advertised | 15 | `strong` |
| [VirtualLineIn](virtual-line-in.md) | `/MediaRenderer/VirtualLineIn/Control` | advertised | 8 | `strong` |
| [ZoneGroupTopology](zone-group-topology.md) | `/ZoneGroupTopology/Control` | advertised | 8 | `strong` |

## In this section

- [State variables](state-variables.md): evented and argument-type variables, one page per service
- [Events](events.md): GENA/LastChange and WSS eventing
- [Errors](errors.md): SOAP fault wire format and code vocabulary
- [URI formats](uri-formats.md): URI scheme grammars
- [Payload formats](payload-formats.md): opaque field/payload grammars
- [Availability matrix](availability-matrix.md): the full action-by-action surface
