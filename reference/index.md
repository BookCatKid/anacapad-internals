# anacapad internals

This site documents what a Sonos player's main control program actually does on the network: every command it accepts, every setting it stores, and every update it can push out, all recovered by reading the device's firmware rather than by guessing from the outside. Sonos speakers don't publish this level of detail. The company documents a small set of commands for app developers, but the real surface inside the device is far larger, and everything here was verified against the actual program that ships inside a Playbar-era player. You'll find two kinds of text on every page. The plain paragraphs you see first explain each piece in everyday language: what it does, why it exists, and what it means for you. The collapsed 'Technical details' sections hold the engineer-facing evidence, meaning memory addresses, table layouts, and the reasoning that proves each claim, so you can check the work without wading through it. The aim throughout: if it isn't proven by the firmware, it doesn't appear here.

Binary `anacapad`, build `86.10-80260`, model-9 (Playbar/limelight). Generated from the frozen canonical static-analysis dataset (`docs/documentation.json`); no runtime verification was performed. The binary implementation is the ground truth throughout.

## Authoritative counts

The counts below distinguish three things that are easy to conflate, and conflating them is exactly how 'the speaker has 205 commands' myths start. First: what the product's specification documents promise. Sonos ships each player with small description files listing the commands it claims to support. That's the advertised surface, and it can over-promise, because a command can stay in the spec after the code behind it was removed. Second: what the player actually dispatches, meaning the commands a request will really reach code for. Third: what that code does. A few advertised commands are wired to empty routines that accept your request and change nothing, and a few more reject every call with an error. This site tracks all three layers separately, so for every command you can see whether it's genuinely live, a stub that does nothing, or a ghost that only exists in the paperwork.

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

Every fact on this site carries a confidence tag so nothing is overstated. 'Confirmed' means the code path was followed end to end: we traced the command from arrival through its routine and saw exactly what it does. 'Strong' means the evidence is solid but some detail remains inferred, for example the command's job is proven but one internal branch wasn't worth mapping. 'Weak' means structure suggests the claim but the trail runs cold partway. Where a behavior can't be resolved without running the device (and remember, this whole project is static analysis: no player was ever touched), the page says so explicitly rather than guessing.

- **visibility**: action/service surface classification: 'advertised' = declared in a shipped SCPD document AND (at service level) present in the served device_description.xml serviceList (16 of 17 services, everything except AudioIn); 'hidden' = service omitted from the serviceList even though its SCPD ships (AudioIn only); 'internal' = callable on the wire but not SCPD-declared; supported class, EMPTY on this build (verified: all 205 canonical actions appear in their service's SCPD actionList)
- **reachability**: 'callable' = dispatched to a real implementation; 'hidden-callable' = reachable by action name on the control path but not SCPD-declared: EMPTY on this build
- **confidence**: confirmed = direct binary proof; strong = strong static evidence; inferred = heuristic; unresolved = not yet determined
- **fault_vocabulary_caveat**: identical fault-code vocabularies across builds do NOT prove identical error behavior; a fault-code vocabulary delta claim is made only where control flow was also compared

## Sections

- [Architecture](architecture.md): routing, dispatch, request lifecycle, shared subsystems
- [SOAP / UPnP](soap/index.md): the seventeen services, state variables, eventing, errors, and wire grammars
- [muse API](muse/index.md): the v1 REST surface, resources, outbound client, and spec streams
- [HTTP layer](http/index.md): non-SOAP HTTP endpoints, discovery, auth, and outbound clients
- [Subsystems](subsystems/index.md): non-SOAP protocols and engines with coverage levels
- [Firmware differences](firmware-differences.md): cross-build/cross-model deltas
- [Firmware artifacts](artifacts/index.md): every extractable file in the image, playable or downloadable
