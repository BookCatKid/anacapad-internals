# Music services firmware investigation

Status: active. Completion has not been established.

The objective covers every firmware component related to music services,
including indirect consumers and supporting assets. A SOAP action inventory
alone does not establish completion. Follow DOCUMENTATION_WORKFLOW.md: use
binary behavior as the source of truth, validate boundary instructions, and
retain specific TODOs for every recoverable unknown.

## Work sequence

1. Inventory services, actions, subsystems, formats, routes, libraries,
   configuration, web assets, model differences and cross-build evidence.
2. Trace MusicServices construction, dispatch, session lookup, catalog
   serialization, update, persistence, replication and notifications.
3. Trace descriptor and manifest parsing, authentication methods, capability
   bits, presentation maps, localized strings and custom service registration.
4. Trace accounts, credentials, OAuth, refresh, migration, matching, preferred
   accounts, replication, deletion and guest/direct-control accounts.
5. Trace outbound SMAPI, browsing/search, metadata, streaming URL resolution,
   encryption/content keys, caching, reporting, errors and retry scheduling.
6. Trace service-specific integrations, including Spotify, TuneIn, legacy
   migration and protocol-specific playback and metadata handling.
7. Reconcile all affected database records and client summaries; regenerate
   reference and site; run validation and relevant tests; audit completion
   against this full scope and the remaining recoverable work.

## Evidence log

Build: 86.10-80260. Binary: reference/public/files/opt/bin/anacapad.
SHA256: `f60262a152aac48bd39bf0285d17d080e6820e37be12d0af9de7bffee8d3e257`.
Addresses below refer to this binary. These findings are instruction-level
observations; unresolved connections must not be replaced with string-based
assumptions.

- Construction: 0x1018f488 calls 0x100c6950 with r19 as the catalog object;
  0x1018f490 passes that same object to SOAP constructor 0x1073a4b4.
  The latter stores it at service+4. Catalog construction installs the
  primary vtable 0x10e768a4 at object+0 and secondary vtable 0x10e76900 at
  object+4. Primary slots +8/+12 contain 0x100c997c/0x100c7fb4.
  Secondary slot +8 contains 0x100c6948, which subtracts four from this
  and branches to 0x100c6314. This disproves the existing claim that these
  implementations have no static vtable references.
  The secondary injection chain is also proven: 0x1018e5bc sets
  r19=r29-0x6d48, while 0x1018f48c passes r29-0x6d44=r19+4 as
  the second SOAP delegate. Both point into the same constructed object.
- GetSessionId: wrapper 0x1073a2f8 sets r7=0x101; 0x100c7fec copies r7
  into r31; raw word 0x2b9f0100 at 0x100c8054 compares that capacity
  against 256. The service ID remains in r29. The branch word 0x409dffc0
  at 0x100c805c returns 402 unless unsigned capacity >256. This is not
  a service-ID range check. The 401 path requires both result bytes at
  stack+0x18 and stack+0x14 to be nonzero. Either zero proceeds.
- Session worker 0x100c7c6c starts with result 806. It resolves a service
  descriptor through primary slot +0x20, loads account rows through
  0x101b688c, and compares row+4 to (ServiceId<<8)|7 and row+8 to Username.
  Each matching row constructs a provider with 0x10723e90 and invokes
  provider slot +0x0c with output buffer and zero as its next argument.
  The scan continues after a match; the last matching result is retained.
  Provider construction initializes this+0x13d0 to the embedded interface
  this+0x13d4 through 0x1071e01c. Its vtable 0x10f0e730 slot +0x0c
  contains 0x10724f50. That concrete method builds a Services/1.1
  getSessionId request, writes username/password credentials, binds
  getSessionIdResult with capacity 257 and executes 0x106ff03c. Byte
  0x110a9af4 nonzero plus the third argument zero selects an alternate
  0x1072fd50 path. Transport/parser internals and effects remain open.
- ListAvailableServices wrapper 0x1073a424 calls request slots +0x3c
  and +8. A zero result from +8 returns without a local fault call;
  nonzero tail-dispatches service+8 slot +8. Its serializer commits
  three named outputs. There is no wrapper-level implementation-status
  check or local 402 emission. Request-internal failures still need tracing.
- UpdateAvailableServices wrapper 0x1073a3b4 has no input parsing or
  request validation call. It forwards nonzero worker status through
  request slot +0x14 and commits zero through slot +0x0c.
  Worker 0x100c997c returns 800 if object+0x1d4 is already set, before
  starting the update. It sets that byte for an active update and clears
  it on the normal completion path. The outer fetch worker 0x100c8fdc
  returns zero or 801 through 804, as detailed below. Underlying helper
  predicates remain open.
- Event serializer 0x100c7084 writes ServiceListVersion as the string
  at object+0x1d7, a colon, and the unsigned word at object+0x1f0.
  A nonzero third argument forces a snapshot without clearing the dirty
  byte. With a zero third argument it emits only if object+0x1d5 is set,
  calls 0x101b7cd4 and clears that byte. Caller 0x100c71d0 invokes it
  for two writer arguments under the object+0x128 lock. Subscriber
  delivery and WSS bindings still require tracing.
- Dispatcher 0x1073a11c searches the three-entry action table with strcmp.
  A missing name loads 401 at 0x1073a1b4 and calls request fault slot
  +0x14 at 0x1073a1c4. Both failure and dispatched-action completion
  invoke request slot +0x38. Its local 401 condition is fully decoded.

## Catalog fetch findings

These describe concrete outer branches, not assumed shared save-file errors.

| Status | Immediate condition | Evidence |
|---|---|---|
| 0 | Unmodified flag is set, or processing and installation succeed | 0x100c97dc; 0x100c9920 |
| 800 | An update is already active | 0x100c99e8 through 0x100c99fc |
| 801 | HTTP helper returns nonzero, or a usable advertised response length is unavailable, including the gzip path | 0x100c9474 through 0x100c9484; 0x10541e00; 0x100c9798 |
| 802 | Revision rejected, candidate metadata parse fails, or rename fails | 0x100c795c; 0x100c7a18; 0x100c7aa8 |
| 803 | Temporary writer creation, XML feed/completion or explicit callback/write error | 0x100cc57c; 0x100cc6f8; 0x100cc7b8; 0x100cce4c |
| 804 | Advertised unsigned response total is at least 0x20000 bytes | 0x100c9700 through 0x100c9714 |

Raw 0x7f895040 at 0x100c9704 compares the body length against r10=0x20000;
0x409d010c at 0x100c9708 branches unless less-than. Equality is rejected.
The length helper 0x10541e00 reads known-length byte +0x44b4, gzip byte
+0x4a8 and total +0x44b8. It returns false for unknown length or gzip;
otherwise it copies the total to the caller. It does not read body bytes.
The header parser stores Content-Length and supported Content-Range totals
in that field. The gzip binding is proven by Content-Encoding comparison
at 0x10543990 and the literal gzip at 0x10543724.

The worker obtains clock-id 1 time and adds 30000ms using timevalAddMs at
0x100c9310. That deadline is passed to the HTTP operation and the catalog
processing callback. It builds a temporary path with suffix .tmp and sets
the media type application/sonos_service_catalog.v1.xml. It adds
If-None-Match only when current ETag is nonempty and its third argument is
nonzero. Missing response ETag and a modified response with unchanged ETag
log warnings and continue to body processing. Neither is itself an error.

## Stream conversion, installation and notifications

- Converter 0x100cc4f4 creates a temporary writer capped at 0x20000 bytes,
  writes a locally generated Services header with SchemaVersion=5, reads
  the HTTP stream through slot +8 in up to 4096-byte chunks and feeds XML
  parser 0x10c3fc68. It writes normalized service fields rather than storing
  the remote response verbatim. Explicit writer/callback errors and failed
  XML completion unlink the candidate. The separate input-length gate
  rejects equality with 0x20000; the output writer accepts equality.
- The final writer helper 0x1054b8e0 calls flush, fsync and close. It ignores
  fsync status and combines flush/close results. Converter 0x100cc4f4 ignores
  that combined result. Direct and buffered write helpers check only -1,
  so short writes can be treated as full writes. A later candidate reparse
  can detect invalid XML, but these paths do not prove durable storage from
  SOAP success. These are observed return-value behaviors, not runtime tests.
- Installer 0x100c7898 rejects revisions through 0x10660e58, parses candidate
  metadata through 0x10c4015c and calls rename. Each of those gates can
  return false and become 802. Successful rename invalidates the descriptor
  cache, sets dirty +0x1d5, calls the notifier, then writes source/version,
  ETag and ETag-present +0x1d6. A later cache-load failure still returns
  installer success. Source copies use capacity 25; ETag copies use 65.
  The source/version committed to memory come from caller arguments. The
  candidate metadata callback copies a header source only when its length
  is exactly 24 and captures header version in that case; ETag is separate.
  The installer uses parsed ETag without comparing parsed source/version
  against the caller values before committing those caller values.
- The comparison is unsigned. Incoming 0xffffffff has an explicit special
  case. Equal versions accept only lexicographically smaller incoming
  source text. A normal incoming version does not automatically replace
  local 0xffffffff. The old six-field ETag/source/version comparison claim
  was unsupported; those six fields are diagnostic attributes emitted by
  0x100cb8f0 in AvailableSvcsSummary.
- Descriptor reload 0x100c6d3c clears and reloads the cache under its mutex.
  Initializer 0x10554858 stores capacity 256 separately from the prior count.
  The optional output byte is set when the final count exceeds that prior
  count. It reports count growth, not capacity overflow or every catalog
  change. This determines one of the outer account-helper invocation paths.
- R_AvailableSvcTrials is compared and conditionally written by 0x100c72e8
  after stream conversion but before installation. An 802 install failure
  can therefore follow a trial-setting mutation.
- The notifier path is instruction-proven: installer 0x100c7b7c calls
  0x1067c6ec with object+8; it reaches 0x1067c46c, which marks the source
  pending and locates a live sender. Helper 0x10678c50 marks sender+0x10e
  and signals sender+0xb8. Registration, sender-loop serialization, actual
  subscriber transmission/retry and WSS producer edges still need tracing.

## Catalog parser and local overrides

The database now contains payload_formats.music_service_catalog for the
normalized file, separate from downloaded input, SOAP projections and the
service-manifest JSON file. Its remaining parser TODO is intentional.

- The generic XML start handler 0x10552c20 accepts unsigned SchemaVersion
  values through 5. Above 5 leaves its validity byte clear. Recognized
  header names are LastUpdateDevice, Version, SchemaVersion and ETag.
- Service Id is parsed with decimal strtoul and a null end pointer. The
  unsigned guard permits values through 0x00ffffff. Missing Name, SecureUri
  or Version pointers skip the service; these pointer tests do not establish
  nonempty strings. Per-service rejection need not reject the whole catalog.
- Version helper 0x10552b38 requires two sscanf conversions with %d.%d,
  then compares the unsigned major/minor pair with 1.2. It does not check
  that the input ends after the pair. Greater major rejects; equal major
  requires minor at most 2; smaller major is accepted by this helper.
- Numeric u16 helper 0x105527f8 uses decimal strtoul, preserves values
  through 65534 and saturates larger results to 65535. Descriptor policy
  storage is another step: it preserves polling values 1 through 29 and
  maps other values to 30. Exact auth strings map to UserId=0, Stateless=1,
  Anonymous=2, DeviceLink=3 and AppLink=4; unmatched strings preserve the
  previous stored enum.
- The Manifest URI guard uses strncmp(uri,"https",5) unless option query
  key 7 bypasses it. This is a prefix gate; it does not by itself validate
  a whole HTTPS scheme. URI storage/expansion and option semantics remain
  open work.
- Callback 0x100cb88c suppresses downloaded service rows whose ID matches
  any supplied local descriptor. Local rows are appended after streaming
  only if name and expanded secure endpoint are nonempty. A blank local
  row can suppress a remote row without supplying a usable replacement.
- Capability bit 0x400000 gates presentation/strings/map projection. The
  corresponding Manifest element has Version and Uri attributes. Helper
  0x100c757c serializes these references and does not fetch their resources.
- BuiltInService emits Type and Name. Its trial-list predicate is exactly
  (type &0x81)==0x80 and type!=0x84. No enum names are inferred from this
  predicate. The final comma is removed before the trial string is used.

Raw-word checks include schema branch 0x409d0414 at 0x10552d1c, service-ID
branch 0x41bdf934 at 0x1055340c and version isel words 0x7d3f4d9e and
0x7d204f5e at 0x10552bc0/0x10552c14. The version isel condition selectors
are CR5.eq and CR7.gt respectively. Conditional returns and fallthroughs
were inspected beyond heuristic function-map boundaries.

## Manifest JSON and persistence follow-up

The manifest schema now has direct JSON-parser-table and emitter evidence.
The previous catalog-XML-based inference remains withdrawn; it has been
replaced by the independent findings below.

- Cache root: `version`, `lastUpdateDevice`, `manifests`, from parser table
  0x10e8a6e0 and emitter 0x10119b90. Row emitter 0x10119034 writes `sid`,
  `version`, `uri`, `manifest`; its version load is a halfword at row+6.
  Row table 0x10e8a6a4 independently supplies those names and types.
- Nested JSON: table 0x10ea5bec and emitter 0x10239dc0 establish
  `schemaVersion`, `presentationMap`, `strings`, `endpoints`, `apiKey`,
  `accountTiers`, `advertising`. Versioned resources contain `uri` and
  `version`; endpoints contain `type` and `uri`; API key contains `zp`;
  advertising contains `headers`. Presence guards are in the database.
- Vocabulary: table 0x10ea5b44 maps radio=1, reporting=2, audiobook=3,
  browse=4; table 0x10ea5b08 maps none=1, free=2, paidLimited=3,
  paidPremium=4. Three endpoint slots and four tier slots are model-storage
  facts, not yet proven limits on accepted wire arrays.
- Schema callback 0x10118580 uses parser 0x10483e28 and comparator
  0x104840f8 against compiled supported version `1.0`. Malformed or greater
  version pairs produce callback code 16, mapped by 0x109bf390 to shared
  parser code 12. Required-field policy is now traced below; complete
  version-string syntax remains open.
- Download 0x1011b710 rejects concurrent work with 800; its shared HTTP/JSON
  deadline is clock-id 1 plus 10000 ms. HTTP, parse, upsert or save failure
  returns 801. Failure to load the prior cache warns and continues.
- Upsert 0x10119434 matches existing SID before checking append capacity.
  A new SID appends while count<=33; a 34-row cache can still replace an
  existing SID. Constructor 0x101191c8 initializes 34 rows at stride 0x4fc.
- Commit 0x1011ad40 normally emits the full cache to `.tmp`, renames while
  the writer is open, then closes. If full emission fails, it closes and
  reopens the temporary file in write mode, emits only version/source,
  renames, closes and can report success. Thus worker status zero does not
  prove every row was persisted. Writer open 0x1054f088 ignores its third
  argument and uses `fopen64(...,"w")`; close 0x1054f0e8 ignores flush/fsync
  statuses, and this caller ignores the destructor's close result.
- Successful commit updates revision/source and 0x10119dcc rebuilds a
  SID/version index. Wrapper 0x1011b65c invokes observer slot +0x14 with
  kind 13 only if the new 32-bit revision is nonzero. Replication consumers,
  rollover effects remain open. Header-only root acceptance is established
  in the later cache-load follow-up; reconciliation consumers remain open.
- API-header postprocessing 0x10118710 calls 0x10542708. Null extraction
  or length>1024 clears the stored key; otherwise it replaces the key with
  the extracted text. Cryptographic details and credential consumers remain
  unproven.

## Catalog callback and URL follow-up

- Rating start 0x1055317c recognizes Id/StringId/AutoSkip/OnSuccessStringId.
  Slot +0x30 receives the converted ID and the three raw string pointers.
  Missing strings default to null; AutoSkip is not converted to boolean in
  this adapter. Icon slot +0x34 receives ID/Controller/LastModified/Uri.
- Rating ID at parser+0x14 is initialized once at 0x10552918 and written
  on Id attributes at 0x10553720. An instruction scan through 0x10554c64
  finds no other halfword store to that offset. Missing Id therefore retains
  the prior ID, including across services in one parser instance. Raw words
  are 0xb11f0014 and 0xb07d0014; start clears only three string registers
  with 0x3ac00000/0x3ae00000/0x3b000000.
- Normalizer vtable 0x10e767a8 installs no-op void Ratings/Rating/Icon
  callbacks at +0x2c through +0x3c. These fields are discarded during local
  normalization. Other processor projections still need tracing.
- End adapter 0x10552938 prioritizes active Policy, Presentation, Manifest,
  Rating, Ratings, Service, BuiltInService, Services. An active branch returns
  on name mismatch rather than trying lower-priority branches. Unknown
  elements add no skip-depth state; recognized descendants can reach handlers
  under the current flags. XML well-formedness is enforced separately.
- Namespace setup: 0x105528ac -> 0x10c3fcd4 -> 0x10c3f81c uses option zero,
  selects 0x10c4a8cc and passes a null separator to 0x10c4a530. Namespace
  byte +0xe8 stays zero. Direct callback installation 0x10c3f27c and thunks
  0x10554c64/0x10554c70 perform no name transformation. The adapter uses
  case-sensitive literal names, not namespace URI/local-name matching.
- URL packer 0x10553994 uses table 0x10ee9eb0: https://www., http://www.,
  https://, http:// map to markers 1..4 in that order. Matched suffix length
  <=62 is accepted; plain string length <=63 is accepted. Rejection preserves
  destination bytes. Raw compare/branch pairs are 0x2b83003e/0x409d006c and
  0x2b83003f/0x419dffd0. Expansion 0x10553ab0 restores lowercase prefix
  literals and returns the destination without checking formatting status.
- Resource URL setters 0x105540f4/0x1055410c/0x10554124 write the version
  halfword before packing the URI. A failed URI update can leave the new
  version paired with the old URI; caller handling remains to be audited.
- Manifest URL reader 0x105543d0 replaces the first `{device}` with `zp`
  if capacity>=original_length-5. Raw 0x3923fffb computes that threshold;
  0x419c0094 takes the unsigned LT fallback. Insufficient capacity copies
  the original unexpanded URL via strlcpy and may log truncation. The token
  can remain intact even when the original URL fits. Subsequent occurrences
  are not replaced. Actual request callers and their capacities remain open.

## Manifest binder and streaming follow-up

- Binder 0x1023a214 marks schemaVersion required with flags=1, binds a
  17-byte fixed buffer, and leaves other named manifest fields optional.
  Constructor 0x109c0eb8 stores flags at descriptor+0x20. Completion checker
  0x109c3070 tests required bit 1 against descriptor+0x21 &9; 0x109c311c
  returns parser error 8 for an absent required field. Raw setup words are
  0x39000001/0x38c00011 at 0x1023a21c/0x1023a224.
- Schema table entries are name/parent-index/token-kind, not name/required/
  type. Parent-index filtering is in 0x109c20f4. Anonymous endpoint and tier
  entries name parents 4 and 7 respectively. Required policy is independent.
- presentationMap/strings URI, endpoint URI and apiKey.zp use dynamic string
  bindings with capacity 0x400. Resource version targets are 32-bit words.
  Advertising headers uses a byte boolean binding. Fixed-buffer decoded
  length>=capacity and excessive dynamic-string length set status bit 0x2;
  complete aggregate acceptance still needs tracing.
- Endpoint collector 0x10238144 receives object-end kind 1 for metadata
  index zero. It copies and clears scratch rows while count<=2; at count>2
  it returns zero without appending. Raw guard 0x2b890002/0x41bdffc0 is at
  0x102381b4/0x102381b8. Further endpoint callbacks do not grow the model.
- accountTiers uses a different generic binding: count maximum four, four
  4-byte enum values. Array completion 0x109c2490 stores min(parsed_count,
  maximum); isel word 0x7cc64f5e uses BC29 after unsigned comparison.
  Extra/repeated-array cursor effects and aggregate error behavior remain
  open rather than being inferred from the stored count.
- Enum converters 0x10238250/0x10238370 clear the output word and decode
  into 33-byte scratch buffers. Exact case-sensitive length/memcmp matching
  is used. Unknown names return converter code 3; decoded length>32 returns
  16. Generic custom-string handling maps these into field status bits 0x5
  and 0x3. These are conversion results, not independently established whole-
  manifest failures. Earlier vocabulary zero was an unnamed model value;
  it was not proof of an accepted unknown wire name.
- Stream reader 0x1011aabc creates fresh model/parser objects, reads up to
  1024 bytes using the supplied deadline, feeds the reported byte count
  without branching on the read return register, and repeats result 10
  only if reported length is nonzero. Result zero reaches root-status checks;
  root bit 0x2 yields local code 7. Accepted parsing postprocesses a nonempty
  API key and copies the model to the caller. Failure does not make this
  final copy and the outer worker returns 801.
- The shared parser limits incremented nesting depth to 15 at 0x109c29ec
  and 0x109c2a8c. This is separate from model collection capacity. EOF,
  trailing-data, null/type, duplicate/unknown fields and exception behavior
  remain open.

## Manifest acceptance and cache-load follow-up

- The shared string-value handler 0x109c3c58 accepts quoted booleans for
  boolean schema fields. Its 0x109c40b8 path uses strcasecmp against true
  and false, then stores through 0x109c1288. Advertising headers therefore
  has a quoted, case-insensitive boolean path. Other text sets parser error
  9. Quoted numeric fields use paranoid_atod at 0x109c3f94 and then
  0x109c1034; integer conversion/range behavior still needs SPE analysis.
- Null handler 0x109c2e64 first resolves/resets the binding, then emits
  callback kind 5 for string/null schema kinds without marking the string
  field seen. The schema-version callback ignores kind 5. Consequently null
  schemaVersion, including a duplicate null after a valid value, leaves the
  required field unsatisfied and fails at object completion with code 8.
- Recognized occurrences reset their descriptor status and typed target in
  0x109c2658 -> 0x109c1514 before assignment. Valid repeated scalars overwrite
  prior values, and repeated resource objects reset their nested members.
  This does not make every malformed duplicate document acceptable. Unknown
  scalar fields take the unmatched no-assignment path; the manifest binding
  does not enable flag 0x8 for unknown-field callbacks. Nested unknown states
  and mixed-type combinations remain open.
- Repeated endpoints members accumulate collector rows rather than replacing
  the collection: the array field has no count-target binding, and only the
  endpoint object collector increments the model count. Its three-row bound
  spans those repeated members. accountTiers has a separate explicit count
  binding and must not be assumed to share this behavior.
- Cache root binder 0x10119fe8 marks version and lastUpdateDevice required.
  Raw flags setup is 0x38a00001 at 0x1011a12c through 0x1011bc84 and
  0x39000001 at 0x1011a148. Source capacity is 25. The manifests array is
  optional, closing the header-only reload grammar question.
- Row binder 0x10119ec8 requires sid, version and URI; URI capacity is 1025.
  Nested manifest is optional at the row level, although a parsed nested
  object requires its schemaVersion. Missing-manifest round trips remain
  open because the emitter always writes a manifest object. Numeric version
  input targets row+4 while the emitter reads the low halfword at row+6.
- f_1011987c checks five top-level descriptor statuses after parser result
  zero; seen/default plus bit 0x2 yields code 7. f_1011991c adds no array-
  presence check. A header-only file with required headers can load into a
  fresh empty row table and rebuild an empty index. The parser does not
  itself clear an arbitrary supplied table merely because the array is absent.
- Row-end callback 0x10119568 calls 0x101194cc, which upserts directly into
  the supplied table and ignores the returned boolean. Extra new SIDs at
  capacity can be skipped without failing the file load. Existing SIDs can
  still be replaced; admitted duplicates replace in arrival order.
- Rows are committed before total file acceptance. A late failure leaves
  the parsed prefix in the supplied table; metadata/index updates in
  0x1011a4bc occur only after total success. The download worker constructs
  a fresh table at 0x1011b7c4, loads it at 0x1011b970, warns on load failure
  and continues to insert/save. It can therefore persist a partially loaded
  prior table together with the new downloaded row. This is separate from
  its successful nested-manifest parser's final-copy behavior.

## Runtime manifest views and endpoint consumers

- Constructor 0x1011c034 establishes a separate runtime view: base URI at
  +0, model at +0x404, valid byte +0x4f4, service ID +0x4f8. Catalog-bound
  constructor 0x1011c078 requires descriptor capability 0x400000, expands
  descriptor SecureUri into the base, retrieves a cached manifest by SID
  through 0x100c6b10 -> 0x1011a650 and copies its model before setting valid.
  The base is not the manifest download URI. Direct-model constructors can
  leave the base empty or take it from a supplied descriptor.
- Resolver 0x1011c34c rejects invalid views, type zero, no rows and no match.
  Null destination or zero capacity selects presence-query mode. It checks
  type alone, so even an empty matching URI can return true. In output mode
  all matches are processed; later ones overwrite earlier output unless a
  prior join failure returned. No-match exits do not clear the destination.
- A slash-prefixed endpoint with nonempty base joins the entire SecureUri
  string, removes one trailing base slash and appends the endpoint text.
  It does not implement origin-relative URL resolution. Non-slash endpoints
  and slash endpoints with empty base are copied directly, without a scheme
  check here. A final slash is added when output is nonempty and lacks one.
- Relative base/append operations require capacity greater than attempted
  length and return false on failure, possibly after partial output. Direct
  strlcpy ignores its return. Final-slash strlcat checks room only for logging
  and still reports success when the slash cannot fit. Raw relative guards
  are 0x409d003c/0x419dff64; final-slash branch is 0x419d00b8. The slash-strip
  instruction 0x7edc49ae is stbx, not isel. Presence-query isel at 0x1011c398
  is 0x7d004f9e with BC30 and RA=0.
- Strings/presentation-map readers require valid view, signed version>0 and
  nonempty URI, then copy the URI and expose the low halfword of version.
  The signed cmpwi/NOT-GT guards at 0x1011c584/0x1011c588 and
  0x1011c734/0x1011c738 are separate from the halfword stores at
  0x1011c69c/0x1011c790. Additional readers expose account-tier presence,
  advertising flag and API-key text under validity checks.
- Reporting wrapper 0x104c9bd8 requests type 2 through 0x1011c564 at
  0x104c9ccc but ignores resolver status and returns the original destination
  pointer. Gate 0x104c9acc accepts a nonempty provider slot +0x1c string
  immediately; otherwise it parses an item URI/SID and queries type 2 in a
  separate view. This is not proof of a valid or complete endpoint URL.
- Playback caller 0x102c4588 selects an endpoint into a 1025-byte buffer,
  then invokes URL helper 0x1011c864. Helper failure sets local code 800 at
  0x102c45c0. Item-prefix predicates, component escaping, version grammar,
  subsequent request execution and error propagation remain open.

## Playback selector, version grammar and CQ URL construction

- Selector 0x1011caec picks radio endpoint 1 for x-sonosapi-radio: through
  0x10147928 -> 0x101478ec. Non-radio cpcontainer input whose parsed kind
  word equals 0x13 selects audiobook endpoint 3 through 0x10148478. Other
  inputs select zero, rejected by the endpoint resolver. It does not map
  arbitrary containers to browse endpoint 4. Raw selector isel 0x7c804f9e
  uses BC30/RA0 at 0x1011cb70.
- Version parser 0x10483e28 requires decimal major.minor with optional patch.
  Digit helper 0x10483c1c rejects a non-digit first byte, uses decimal strtoul
  with errno cleared, and rejects errno 22/34. Leading zeros are not rejected.
  Patch/suffix fields are not cleared when absent, and failure does not roll
  back earlier writes. Callers must initialize defaults when required.
- Hyphen and plus suffixes must start with isalnum; subsequent bytes are not
  individually validated. Pre-release ends at the first plus or span end;
  build metadata consumes the remaining span. Each stored suffix is clamped
  to 32 bytes while the cursor advances over the complete suffix. Raw isel
  0x7fff489e chooses pre-release length, and 0x7f49ff5e/0x7feaff5e clamp
  storage lengths. This is looser than full Semantic Versioning validation.
- Manifest compatibility uses only major/minor from that parse, so a patch
  or suffix does not affect comparison with 1.0. Catalog XML still uses a
  separate sscanf version-pair grammar. The database now separates these.
- CQ extractor 0x10483cf0 uses the literal regex at 0x10ed4198, first regexec
  match from URI path, then skips /v. If the matched delimiter is slash,
  that slash ends the selected span; otherwise URI path end does. It does
  not verify that this slash is the final path separator. A qualifying
  version segment can precede more path despite the diagnostic wording.
- CQ checker 0x10338a34 returns 2 for parsed major==2 and zero otherwise;
  minor/patch have no separate compatibility maximum. Raw branch
  0x41beffb4 at 0x10338ad8 is equality. Optional diagnostics distinguish
  missing/malformed/unsupported version; builder 0x1011c864 passes no
  diagnostic object. The candidate regex has stricter suffix characters
  than the shared parser. Locale/regex lifetime/span assumptions remain open.
- Builder 0x1011c864 uses 257-byte item/path scratch buffers, clamps cpcontainer
  URI-path input to 256 bytes, invokes identifier validation/canonicalization,
  or extracts and percent-decodes item path through 0x1071ac00. It encodes the
  chosen text, formats endpoint base + encoded item + slash, then checks the
  resulting CQ version. Several component/formatter results are ignored;
  success does not prove lossless construction. Classifier and percent-decoder
  internals still need analysis.
- Encoder 0x10c3a294 -> 0x10c3a0f4 permits isalnum plus `$-_.!*'(),`; other
  bytes use lowercase percent hex. PIC GOT base 0x11095ccc resolves allow-list
  slot -0x7fcc to 0x10fb1330 and format slot -0x7fd4 to 0x10fb1318 (`%%%02x`).
  It stops before a copied byte/escape would consume terminator space,
  returns bytes written and supplies no separate truncation result. The CQ
  builder ignores its count. Percent bytes are encoded again rather than
  treated as preexisting escape sequences.

## Memory cache, replication receiver and deletion

- Lookup 0x1011a650 formats SID as unsigned decimal and matches key length
  plus memcmp under cache mutex +0x1f8. A hit refreshes access time and copies
  the full row without comparing manifest version, public index, file state
  or entry+0 time word. It takes no requested-version argument and performs
  no HTTP download. A miss loads a fresh 34-row file table and searches SID;
  successful load can update metadata/index even if that SID is absent.
- Constructor 0x10119a2c sets memory capacity three with stride 0x51c. Entry
  layout is time-derived word +0, last access +4, key object +8, row +0x20.
  Both explicit insert 0x1011be38 and miss-fill replace an existing key first,
  otherwise choose the smallest unsigned last-access word. Strict LT keeps
  the earlier candidate on ties; it does not independently prioritize empty
  entries. Raw victim isel words 0x7fbeef1e/0x7f9ee71e use CR7.lt.
- Lookup fill stores clock+1 at entry+0 and clock at +4. Explicit insert adds
  its fourth argument to clock for +0; the download caller passes one. The
  inspected lookup hit never tests +0 as an expiration gate. Default clock
  vtable 0x11089e3c slot +8 reaches 0x1098b4c0, which reads the first output
  word of sonosClockGetTime(1). Clock replacement and wrap remain open.
- Replication receiver 0x1011a204 compares current source/revision against
  caller-supplied r6/r7 through 0x10660e58, parses the incoming path r8 into
  fresh scratch rows and renames it over the live file. Only rename success
  commits supplied source/revision, rebuilds the index and clears all three
  cache keys/time words. It does not compare parsed file headers to supplied
  metadata. Kind-13 observer dispatch is unconditional after this success,
  unlike the nonzero-revision gate in the local save wrapper.
- Deletion 0x1011b310 holds the file mutex, loads rows, removes matching SID
  through 0x101195ac, saves, then invalidates the matching cache key only on
  true save result. Compaction preserves survivor order and removes every
  matching SID. No match returns false without saving. Earlier successful
  load can already update metadata/index before a no-match or save-failure
  false return. Shared header-only save fallback still applies. Observer
  dispatch requires nonzero output revision.
- Invalidation empties key text and zeroes both timestamps without overwriting
  the row model at entry+0x20. Subsequent keyed lookup misses that slot. Local
  download replaces its own entry without invalidating unrelated keys; a hit
  does not itself notice out-of-band file replacement.
- Full row copy 0x10118f64 preserves the 32-bit version word. File emission
  and public index use its low halfword. A memory hit can therefore expose
  the earlier full word while a later disk reload exposes the saved low-half
  version; lookup does not reconcile these representations.
- Remaining work includes all lookup/insertion/deletion callers, clock/cache
  writer census, concurrency and interrupted updates, replication transport
  and kind-13 observer delivery. Receiver ordering alone does not establish
  end-to-end replication or account/catalog reconciliation.

## Scope inventory

The following records are starting points, not proof of exhaustive coverage.
Absence of a TODO in an older record does not establish that its claims have
passed this investigation. Follow callers, consumers, data references and
related shipped files beyond the names in this table.

| Area | Existing records to audit | Status |
|---|---|---|
| SOAP and catalog | MusicServices actions; music_services; MS.ServiceListVersion | Construction, outer workers, stream conversion, install/cache and sender wakeup traced; deeper paths open |
| Descriptor/configuration | music_service_catalog; music_service_descriptor_uri; music_service_manifest_cache; music_service_manifest; smapi_descriptor; svc_manifest; customsd; smapi_capability_bits; smapi_auth_policies; smapi_capability_vocabulary | Catalog callbacks/URL packing and JSON schema/download/commit traced; JSON binders, projections and consumers open |
| Account lifecycle | music_accounts; account_actions; accounts_replication; account_migration; service_accounts; device_account_endpoint | Refresh preconditions and identity lookup/suffix helpers traced; remaining lifecycle and field-writer audit open |
| Authentication | token_refresh; token_refresh_state_machine; smapi_jwt; account_cert_lifecycle; HTTP authorization headers; registration/cert consumers | Device-token request, credential setup and outer executor traced; transport, renewal and lifecycle open |
| SMAPI and browsing | smapi_client; smapi_layer; browse_prefixes; browse_ids; catalog_translate; catalog_translation; content_directory | Session provider binding traced; transport and other actions open |
| Playback and reporting | drm_content_keys; stream_fetcher; stream_metadata; scrobbler; scrobble_submission; reporting; track_play_monitor; play_history; cloud_queue | Consumer and effect audit pending |
| Spotify | spotify; spotify_connect; spotify_esdk; spotify_vli_session; spotifyzc; spotify_zeroconf; spotify_smapi_ctrl; spotify_thread; esdk_api and other esdk records | Instruction audit pending |
| Other integrations and assets | TuneIn shipped descriptor; Pandora/Rhapsody URIs and migration; wmp_provider; business_msp; rootfs_data_files; related web forms and libraries | Binary/file inventory pending |
| Other protocol surfaces | DeviceProperties account actions; account/catalog Muse resources; WSS musicServices and musicServicesChanged; custom service HTTP routes | Injection/producer tracing pending |
| Cross-build coverage | crossbuild_matrix; firmware_differences; model2_25.2_surface; available sibling binaries and libraries | Scope and behavioral comparison pending |

## Next evidence to gather

- Trace processor return/error effects and descriptor/SOAP projections;
  audit malformed/repeated-element state interactions, URL call-site
  capacities, XML escaping and shared XML-engine lexical behavior.
- Trace underlying HTTP request execution 0x10545ff4 and read methods,
  redirect/header callback handling, candidate metadata parsing and file ABI.
- Trace runtime policy selector zero, provider transport/error paths
  0x106ff03c and 0x1072fd50, catalog projection callbacks, cache-reload/account
  reconciliation callers and notification callback registration.
- Finish manifest JSON nested/type/extra-array/oversized-status semantics,
  numeric coercion, missing-manifest round trips and malformed-tail load
  effects. Trace API-header extraction, endpoint/URI selection, cache
  writer/clock/race behavior and replication transport/observer consumers. Concrete binder and
  header-only reload evidence is above.
- Audit every related record's resolved_findings against control flow.
  Existing string inventories establish vocabulary, not branch ordering,
  side effects or exhaustive behavioral coverage.

## Verification

The documentation database and client summaries were updated, and the
generated reference was rebuilt. Initial checks passed: structural validator,
semantic validator, generator QA and all 47 unittest cases. The linter reports
17 warnings; comparing sorted warnings against HEAD shows the same preexisting
warning set outside this MusicServices change. The site build passed after
installing the locked npm dependencies. Build tooling warns about bundle size.
These checks verify the documentation pipeline, not exhaustive firmware
semantics. The goal remains active.

The subsequent catalog-deepening pass also passed validation, generator QA,
all 47 tests and the site build, with the same 17 baseline lint warnings.

The manifest-schema/persistence and catalog-callback/URL passes passed strict
validation, generator QA, all 47 tests and the site build. Sorted lint output
still matches the 17-warning baseline. Diff whitespace and newly added prose
pass the project dash checks. Locked Node dependencies were reinstalled with
`npm ci --no-audit --no-fund` because node_modules was absent. The site build
continues to warn about bundle size. These checks cover documentation integrity;
they do not close the remaining firmware investigation.

The manifest-binder follow-up also passed strict validation, generator QA,
all 47 tests and the site build, with the same 17 baseline lint warnings.
Whitespace and new-prose dash checks pass. Required-schema, field-binding,
collection and streaming findings retain explicit residual work for shared
JSON acceptance/error aggregation and consumers.

The acceptance/cache-load follow-up passed strict validation, generator QA,
all 47 tests and the site build. The linter still matches the 17-warning
baseline; whitespace and new-prose dash checks pass. The site build retains
its existing bundle-size warning. Completion remains unproven against the
full music-services scope.

The runtime-view/endpoint-consumer pass passed strict validation, generator
QA, all 47 tests and the site build. Lint remains at the same 17 baseline
warnings, with no new whitespace or forbidden-dash additions. Bundle-size
warnings remain unchanged. The reporting and playback links establish
specific consumers; full request execution and the broader scope remain open.

The playback-selector/version/CQ-construction pass passed strict validation,
generator QA and all 47 tests. Lint remains at the same 17 baseline warnings;
whitespace and new-prose dash checks pass. The site build passed with the
existing bundle-size warning and was repeated after narrowing the remaining
caller TODOs. The full objective remains active.

The cache-policy/replication-receiver/deletion pass passed strict validation,
generator QA, all 47 tests and the site build. Lint still matches the 17-warning
baseline; whitespace and new-prose dash checks pass. The existing bundle-size
warning remains. Caller/writer census, concurrency, transport and observer
delivery remain explicit open work within the full active objective.
New records include the normalized catalog payload and five externally
relevant internal functions. The initial temporary-file write failed because
the disk was full; atomic replacement preserved the source database. Removing
the generated site output freed enough space to apply the update and rebuild.

## Tool availability

The paseo-progress command reported that Paseo is unreachable or its progress
plugin is not installed. This file preserves the work sequence in the repo.

## Manifest freshness, download wrappers and replication sender

- Catalog constructor call0x100c6a98 embeds the manifest object at+0x13ad0.
  Predicate0x100c6b38 requires a descriptor and cap0x400000, reads its
  unsigned16-bit manifestVersion, and inverts the index predicate0x10119c80.
  That predicate compares indexed SID/version pairs under mutex. Raw
  0x7fff471e at0x10119d10 is isel r31,r31,r8,28 with r8=1, proving that
  stored version>=requested version sets true. Multiple matching entries
  cannot clear an earlier true. File contents, URI and row cache are not
  inspected by this freshness check.
- Download wrapper0x100c6c3c defaults to402. Missing descriptor or absent
  manifest capability retains402; otherwise URI expansion uses capacity1025
  and the unsigned16-bit descriptor version enters worker0x1011b710.
  Conditional wrapper0x100c7404 returns zero when no update is needed and
  tail-calls the download wrapper otherwise. Adapter0x100c7464 reads SID
  at argument+0x134; thunk0x100c7474 adjusts this by-0x124. Direct caller
  0x10287280 and adapter registration still need tracing. Reconciliation
  calls0x101b94bc/0x101b950c bypass this conditional wrapper.
- Vtable0x10e8a688 slots+8/+0xc bind sender0x10118acc and receiver0x1011a204.
  Sender locks the file object and supplies content format1, stored revision,
  stored source-device text and text/json to shared sender0x10660ff0.
  Header setup0x106611c4..0x1066122c supplies CONTENT-LENGTH,
  X-RINCON-LAST-UPDATE-DEVICE, X-RINCON-CONTENT-VERSION,
  X-RINCON-CONTENT-FORMAT and CONTENT-TYPE. Normal setup sets200;
  open failure or negative size sets500. Selector4 attempts signature
  generation and adds X-RINCON-SIGNATURE on success. Selector meanings,
  routes, signature failure and end-to-end delivery remain open.
- Read-size raw0x7caaf75e at0x1066127c is isel r5,r10,r30,29, selecting4096
  only when unsigned remaining>4096. Negative reads retry only for errno4.
  Header/status/body forwarding wrappers0x100b45e8/0x100b4614/0x100b434c
  lead to0x100a5d44/0x100a5cc4/0x100a5b04. Header insertion targets the
  response collection+0x8c; status writes halfword+0x3c. The body helper
  has direct and chunked branches leading to0x100acdf0. Those request and
  connection implementations need further tracing before claiming delivery.
- Account-manager worker0x1028c3b8 reaches a conditional manifest deletion.
  It extracts SID from account type>>8, requires descriptor cap0x400000,
  and calls findRecord0x10570e34 on stack+0x39c with null username and
  selector0. Only a null result invokes catalog wrapper0x100c6d14 at
  0x1028c5dc. It ignores the deletion result and joins the manager's del
  continuation through slot+0x28. Account-family normalization, eligibility,
  preceding mutation/persistence and observer effects remain open; this
  evidence alone does not establish a universal last-account policy.
- Corrected stale manifest-schema prose: required schemaVersion and optional
  remaining fields were already established by binder evidence. Specific
  JSON acceptance and numeric TODOs remain.
- Paseo progress reporting was retried. The installed CLI reports that its
  plugin is unavailable or Paseo is unreachable. Research and documentation
  work continue using this evidence log.

The freshness/wrapper/sender/account-deletion pass passed strict validation,
generator QA, all47 tests and the rendered site build. Lint output matches
the same17-warning baseline; diff whitespace and newly added prose pass
project dash checks. The site retains the existing bundle-size warning.
These checks do not establish exhaustive music-services coverage.

The next account-trigger entry is0x10287238: it computes SID from account
argument>>8, obtains the catalog through zone slot+0x130 (same direct getter
fast path), invokes conditional update0x100c7404 at0x10287280, and returns
zero immediately on zero result. Its nonzero continuation0x102872b0 and
outer callers remain to be traced before attributing a user-visible trigger.

## Account refresh preconditions and shared identity helpers

- Helper0x10287238 maps every nonzero conditional-refresh result to802.
  Both logging-enabled and disabled exits load0x322, at0x102872f4 and
  0x10287328. Raw0x40820028 at0x10287288 enters failure on nonzero.
  A zero includes an index-current/no-download result.
- Direct branch census finds five refresh-helper calls: user credentials
  0x10289df0, preinstalled service0x1028aec8, OAuth token0x1028b36c,
  OAuth code0x1028b4d0 and OAuth direct control0x1028b644. Operation names
  are actual string arguments and verified continuations establish that
  nonzero stops before each path's next account step. User credentials
  reaches its account lock only after refresh; token reaches its shared
  account worker only after refresh; code/direct-control reach credential
  acquisition0x10286e44 only after refresh.
- Account-family lookup0x10570e34 compares
  N(t)=((t & 0xffffff7f) - (1 - (t & 1))) modulo2^32. It uses count+0,
  rows+4 stride0x250, serial+0, type+4, username+8 and flags+0x1f4.
  Exact non-null username matches return before the flag test. Null-user
  scans skip flags&1. Special-candidate preference and smallest-serial
  fallback apply only with selector0. Smallest-serial replacement is strict
  unsigned less-than with initial0xffffffff, so that sentinel serial never
  supplies a fallback by itself. This also narrows the account-deletion
  condition; it is not universally equivalent to a count-of-accounts check.
- Classification0x1056fd48 checks record+0x1ec or a username longer than3
  with prefix X_#. First-hyphen hexadecimal reader0x1056fe5c has no
  end-pointer or errno check. Type reader0x1056feb0 requires X_#Svc then
  calls decimal strtoul but ignores the end pointer and errno.
- Corrected an older false OR-gate claim. In0x1028a224, r20 preserves
  argument6 and r24 preserves argument8. Null/empty r24 enters the error
  path; nonempty r24 reaches0x1028a518, where null/empty r20 enters that
  same path. Both strings are required. The pointer test0x1028a460 is a
  later optional output argument and cannot justify Token-versus-OAuth
  routing. Raw predicates at0x1028a404/410/51c/528 are
  0x419e0010/0x409e0108/0x41befef8/0x419efeec. Public argument mapping
  still needs a complete caller trace and is not inferred from the log.
- UID suffix helper0x1056ffb0 zeroes output after checking both pointers.
  Length<=32 accepts zero without checking characters. Longer text requires
  underscore at byte32, then base16 strtoul from byte33 must end at NUL.
  It does not require a digit or check errno. An empty suffix accepts zero.
  Boundary raw0x2b830020/0x409d0014 at0x1056fff4/ffc confirms <=32.
  Account-add failure returns4001 even with logging disabled0x1028a8cc.
- Direct UID-helper calls are0x1028a53c,0x1028c34c,0x10570104.
  Consistency checker0x1057007c immediately accepts unclassified records;
  classified records compare extracted username type with record+4, then
  compare username hex UID with UID from record+0x18c. It ignores the UID
  helper boolean, so failure with zero output can still pass equality with
  a zero username UID. Credential-name formatters emit
  X_#Svc%u-%x-Token and X_#Svc%u-%x-Key; extraction is less restrictive.
- Added concrete evidence and residual-work TODOs to music_accounts,
  corrected account_actions, extended manifest-trigger cross-references,
  and added the shared music_service_account_uid payload record. Broad
  account, authentication, replication and integration work remains open.

The account-trigger/identity pass passed strict validation, generator QA,
all47 tests and the site build. Lint still matches the17-warning baseline;
whitespace and added-prose dash checks pass. The site retains its existing
bundle-size warning. These checks validate the documentation pipeline;
account lifecycle, authentication and the full music-services scope remain
incomplete. The next concrete trace is credential acquisition0x10286e44
and its callers, followed by the public argument mapping and record writers
feeding0x1028a224,0x10570e34 and0x1057007c.

## Device-token acquisition and shared SMAPI request setup

- Account helper0x10286e44 has two direct callers, OAuth-code acquisition
  0x1028b568 and direct-control acquisition0x1028b6dc. It forwards provider
  results unchanged. Only the account-family7 descriptor lookup succeeding
  with authentication method4 preserves the incoming callbackPath; other
  paths pass null. Its final stack boolean controls timing telemetry around
  acquisition, not whether acquisition runs. The dcLogin object carries
  type=authToken, service=smapi, rsid=original accountType, ms and rc.
- Provider0x1072a2a4 uses the credential-type table0x10f0e4a4
  {3,3,1,2,2}; unsigned method>4 or table!=2 returns1000. Raw guards at
  0x1072a32c/34c are0x419d00a0/0x409e0080. This admits DeviceLink3 and
  AppLink4. The method is getDeviceAuthToken with Services/1.1 namespace,
  and its URI is expanded from descriptor SecureUri with capacity128.
- Credentials are constructed before transport and can fail setup. The
  body includes householdId; optional linkCode/linkDeviceId/callbackPath
  require non-null/nonempty strings. Optional login includes username and
  password only when both are non-null/nonempty. The manager helper passes
  null login inputs. Output bindings directly install caller authToken and
  privateKey destinations/capacities plus a nested userInfo parser. Missing,
  duplicate and oversized response policy and partial writes remain open.
- Full text direct-branch census for0x1072a2a4 finds0x101b8f6c,
  0x10286f40,0x10287000 and0x1028b0f8. Census for0x1071f0c0 finds
  0x10724dcc,0x107250cc and0x1072a3b0. Other call-site policy remains open.
- Manifest cap0x400000 enables interface0x11097928 slot+0x28 retrieval
  using (SID<<8)|7 and a129-byte empty buffer. The lookup return is ignored.
  The buffer is forwarded as raw header text through0x1071e208. That helper
  adds it only for an exact case-sensitive first5-byte https match or
  nonzero setting index25. The alternate warning branch continues setup;
  it does not itself return an error. The text is passed unchanged through
  request slot+0x30, with no API-header name prepended by this helper.
- Shared credential builder0x1071f0c0 gates zonePlayerId with cap0x40000
  and deviceCert with cap0x20000. Missing certificate provider returns zero
  without a certificate. Provider slot+8 state1 retains1045 and skips
  retrieval; other states attempt slot+0xc and false retrieval merely omits
  the certificate with zero result. All paths still add deviceId from
  global0x110a9ab0 and deviceProvider Sonos. Raw state1 equality branch
  0x419eff5c at0x1071f1cc bypasses the zero-result assignment0x1071f124.
  getDeviceAuthToken supplies certificate scratch capacity4097 and exits
  before transport on nonzero builder result.
- Request constructor0x106fe328 stores timing arguments at+c6a8/+c6ac.
  Device-token setup supplies20000/10000. Executor0x106ff03c calls helper
  0x1054b444, which reads clock1 and constructs two deadlines by adding
  those milliseconds to the same base. HTTP phase meanings remain open.
- Executor result defaults1001. Nonzero preflight0x106fdf60 skips HTTP.
  Otherwise core0x1053a060 runs. Byte+a45 gates result interpretation:
  nonzero core result is translated by0x10c3b8ac; zero core result plus
  byte+a47 and HTTP401 yields1037, otherwise0x10562e6c supplies the result.
  When+a45 is clear the default1001 remains. Flag/status writers, preflight,
  HTTP phases, fault parsing, retries and partial-output effects remain open.
- Added authoritative account acquisition, SMAPI method, manifest raw-header,
  device credential and executor-boundary detail records with specific
  residual TODOs. Authentication lifecycle, transport and the full scope
  remain open; constructing these requests does not establish delivery.

The device-token/SMAPI-setup pass passed strict validation, generator QA,
all47 tests and the site build. Lint matches the17-warning baseline;
whitespace and added-prose dash checks pass. Existing bundle-size warnings
remain. The next concrete transport trace is f_106fdf60 and f_1053a060,
plus writers of request+a45/+a47/+a48 and response-result f_10562e6c.
Those paths, response acceptance, public argument binding and the broader
music-services lifecycle remain incomplete.

## SMAPI preflight, transport callbacks and result acceptance

- Preflight0x106fdf60 calls0x1053b724 for executor selector0. It builds
  headers on return0 or11 but preserves that result in r31. Executor only
  executes HTTP for0; preflight11 still skips execution and retains1001.
  Raw equality branches0x419e0044/0x419e003c at0x106fdfc4/fcc prove the
  header conditions. Shared URI/setup0x1053b4a4 and0x1054a158 remain open.
- Header builder0x106fdca0 uses template0x10f0b980: POST HTTP/1.1,
  CONNECTION close, ACCEPT-ENCODING gzip, HOST, USER-AGENT, extra headers,
  CONTENT-LENGTH, XML UTF-8 content type and quoted namespace/method
  SOAPACTION. Target text adds X-SONOS-TARGET-UDN with capacity128.
  Header capacity32768 and unsigned snprintf return>32767 only produce a
  log; strlen of the resulting header is still stored. Extra header scratch
  capacity7918 and snprintf_append semantics need further tracing.
- Writer inspection identifies request+a45 as serializer entry, not response
  completion:0x106fd1ec sets it before calling SOAP writer0x10564540.
  Vtable0x10f0b7ec slots+c/+10/+28 bind this writer, response-input
  forwarder0x106fd260 and status-line callback0x106fd164. Constructor
  clears+a45/+a47 and initializes+a48 to0xffffffff. Status callback accepts
  exact HTTP/1.1-space or HTTP/1.0-space then strtol decimal from byte9,
  with no range/end-pointer/errno validation. Setter0x106fd828 controls+a47;
  bearer setup invokes it with1. Alias/indirect writer census remains open.
- Core0x1053a060 queries interest slots+c/+10 and returns zero when both
  are zero. Otherwise it chooses one of two supplied deadlines using bytes
  +c/+4424/+4425, checks clock1 and returns0x80000025 on now>=deadline.
  Raw0x7ebcb79e at0x1053a150 selects the second deadline when byte4425
  equals0 on that branch. Deadline phase meanings still require writers.
- poll uses the low halfword of the first interest and ORs bit4 when the
  second is nonzero. Raw0x7fde4f9e at0x1053a198 verifies this selection.
  Returned bit1 invokes slot+18 before bit4 invokes slot+1c. Poll return
  is not independently checked and other revents have no separate branch.
  Socket state and caller interpretation remain necessary to infer success.
- Response-input helper0x10562cac returns true for zero-length input without
  calling XML parsing; nonzero input goes to0x10c3fc68. This wrapper does
  not finalize XML on EOF. Result helper0x10562e6c prioritizes nonzero
  unsigned halfword+2e2, then maps nonzero byte+2e4 to1000, otherwise scans
  response descriptors through0x1055f358. Each descriptor needs byte31 or
  byte30 nonzero; bothzero returns1000, scan success/empty returns0.
  Flag meanings, required/optional policy, faults and whole-document
  acceptance remain open. The new records preserve those specific TODOs.

The shared-transport pass passed strict validation, generator QA, all47
tests and the site build. Lint matches the17-warning baseline; whitespace
and added-prose dash checks pass. Existing bundle-size warnings remain.
Next concrete work is shared URI/setup0x1053b4a4 and address resolver
0x1054a158, I/O-interest and event callbacks0x10538998/0x10538918 and
phase-state writers, then SOAP parser result/descriptor-flag writers and
fault handling. These checks do not establish full firmware coverage.

## Practical completion standard and public account-contract audit

The user clarified the objective: finish useful coverage across the whole
music-services area, especially user-facing behavior, without exhaustively
cataloguing internals that add no analytical value. Prioritize public actions,
inputs/outputs, errors, authentication, persistence, events, playback and
service integrations. Follow a helper only when it explains those behaviors
or proves a material claim. Retain honest uncertainty; do not present a
passing documentation build as proof of complete firmware semantics.

- Public account commands are on SystemProperties, not DeviceProperties.
  Corrected the account_actions subsystem label and ownership description.
- Re-audited AddOAuthAccountX0x10732454. Explicit handler strlen bounds
  are token/key2048, OAuthDeviceID64, AuthorizationCode1024, RedirectURI8192
  and UserIdHashCode24 bytes. Larger values raise402 before delegation.
  The prior capacity-minus-one ranges were one byte too large. Raw branches
  at0x10732638/690/6a0/6b0/6c0/6d4 confirm equality is admitted.
- Re-audited RefreshAccountCredentialsX0x107327d4: token/key2048 bytes,
  account delegate slot+0x2c (not+0x14), no output arguments, nonzero status
  surfaced unchanged. AccountUID storage starts at zero and its descriptor
  is marked to tolerate absence at0x107328b0.
- Re-audited ReplaceAccountX0x107329ac: UDN144, NewAccountID128,
  NewAccountPassword64, token/key2048 and OAuthDeviceID64 bytes. The handler
  marks replacement field descriptors for omission, but the account delegate
  still owns actual replacement semantics. Success emits AccountUDN.
- Corrected the three action records, argument contracts, local402 conditions,
  return descriptions and client summaries. Removed contradicted claims that
  AddOAuthAccountX has no post-parse compares and unrelated AlarmClock,
  favorites and generic-store explanations from those action error records.
  Delegate error predicates remain explicit TODOs instead of invented codes.
- Condensed the SMAPI client-facing summary around authentication and request
  outcomes. Existing detailed technical evidence remains available.
- URI/setup research in scratch listings identifies a case-insensitive
  HTTP/HTTPS scheme gate, first-colon port parsing and fragment removal.
  Further DNS/cache helper census is deferred until a public behavior needs
  it. It is lower priority than completing public contract coverage.

The public OAuth-contract correction passed strict validation, generator QA,
all47 tests and the site build. Lint still matches the17-warning baseline;
whitespace and added-prose dash checks pass. Existing bundle-size warnings
remain. This was a user-facing accuracy pass, not a claim that every account
worker is exhausted. The next practical audit is the remaining public account
handlers and their exposed results, custom-service registration and Muse
account/direct-control coverage. Deep DNS/cache implementation is deferred.

## Remaining account commands and custom-service HTTP form

- Audited all remaining account wrapper bodies, including nickname, web code,
  password add/edit, removal, metadata, RDM and post-update operations.
  DoPostUpdateTasks uses slot+0x38 and bypasses wrapper request validation;
  its installed delegate handles R_PromoVersion. The old+0x14 attribution
  and guaranteed migration/cleanup interpretation were incorrect.
- Zone construction0x1018e4f8 creates settings delegate0x104b0e84 and
  stores the pointer later passed at0x1018e594 to service constructor
  0x10732e94. Constructor stores it at service+4; settings constructor
  installs vtable0x10ed75c4 at0x104b0f94. This disproves the old blanket
  association with DeviceProperties vtable0x10e98278.
- EditAccountPasswordX slot+0x24 is0x104b0684, not empty stub0x1019d288.
  It forwards the replacement password to account modifier0x1028b760.
  EditAccountMd slot+0x30 similarly forwards metadata via0x104b06d0.
  Corrected the password action, its input descriptions, client summary,
  service notes and the unrelated stub's account association.
- GetWebCode slot+0x14 is0x104b0500, a constant800 return. Valid requests
  therefore return800 without WebCode; invalid request validation returns
  402. Replaced speculative pairing-code semantics with this concrete build
  limitation and closed generic delegate TODOs now disproven by the binding.
- AddOAuthAccountX adapter0x104b052c chooses nonempty token first, otherwise
  nonempty authorization code, otherwise preinstalled-service path. Targets
  are0x1028b2e4,0x1028b440 and0x1028ad54. OAuthDeviceID is forwarded in
  each branch; token AccountTier is clamped to65535. This establishes the
  public names of the shared worker's AND predicate: token and OAuthDeviceID
  must both be nonempty. Separate direct-control worker is not a fourth arm.
- RDM delegates0x104b0760/0x104b0b8c write/read R_RDM. Setter formats
  unsigned decimal text; getter defaults false and reduces accepted numeric
  text to zero/nonzero. Removed unsupported remote-diagnostic access and
  support-session claims. Downstream setting consumers remain unresolved.
- /customsd handler0x103429f4 applies context/feature gates, with400/403
  outcomes, and method1/5 dispatch for form/render submission; other methods
  get405. Renderer0x10342824 supplies text/html and no-cache headers, with
  500 on token generation failure. Submit0x10342988 requires exact
  case-insensitive application/x-www-form-urlencoded, including no extra
  media-type parameters. Body helper and CSRF token must pass; failures
  return400 and invalid/missing tokens invoke reset0x1054066c.
- Successful custom update calls0x100c8900, reloads descriptors and invokes
  account reconciliation before Success!; reconciliation result is not
  checked. Backend SID defaults255 and admits240..253 or255. Fixed descriptor
  version is1.1; update conversion uses clock1 plus10000ms. Detailed backend
  malformed/duplicate/delete and install failures remain explicit TODOs.
- Replaced unrelated generic store/favorites/AlarmClock explanations in the
  audited account error records with actual delegate-to-fault behavior.
  The public contracts now distinguish parser limits, actual implemented
  operations, unavailable WebCode behavior and unresolved worker effects.

The remaining-account/custom-service pass passed strict validation,
generator QA, all47 tests and the site build. Lint matches the17-warning
baseline; whitespace and added-prose dash checks pass. Existing bundle-size
warnings remain. Next is a bounded user-facing coverage review of Muse
account/direct-control and subscription routes, playback/browse entry points,
reporting and service-specific integrations, followed by a reader-oriented
coverage map. Internal helper enumeration remains deferred unless it resolves
an exposed behavior or a material contradiction.

## Muse routes and analyst reading map

- Reviewed the seven musicServiceAccounts routes: household match,
  preferred account POST/GET, and group startDirectControlEx/endDirectControl
  with household-qualified aliases. Corrected the client overview that
  previously described generic JSON add/edit/remove account commands.
- The eight upnpMusicServices route registrations identify the player bridge,
  subscription creation and logicalSID renew/delete with household aliases.
  Corrected the overview to avoid promising that every SOAP action is
  reachable or that subscription lifetime/delivery is established.
- Candidate exec helper0x10b01aac and adjacent helpers through0x10b01afc
  return zero. Vtables0x10fa32ec/0x10fa336c place them at+c; they do not
  establish actual route effects. Candidate fields/spec lists require
  request/response and operation-boundary recovery. Added explicit resource
  TODOs and visible cross-reference coverage rather than treating strings
  and interface members as complete behavior.
- Added authoritative subsystem music_services_interfaces to connect catalog,
  accounts, custom services, Muse, browse/load/playback, authentication/keys,
  reporting/history and service-specific integration records. It states the
  current coverage limits instead of implying all topics are exhausted.
- Corrected the unsupported identification of a static Spotify client GUID
  as the runtime player UUID. Added concrete handler/value/handoff work to
  the Spotify ZeroConf record rather than treating literal proximity as a
  proved response/credential contract.
- Added docs/music-services-guide.md as a concise analyst navigation guide,
  with public-contract corrections, pointers to generated reference sections
  and an explanation of what the remaining TODOs mean. The authoritative
  semantic record remains documentation.json with client_text summaries.

## Account password/metadata modification outcomes

- Followed the live password/metadata adapters into0x1028b760, keeping the
  investigation tied to exposed commands rather than unrelated helpers.
  Account-table load failure returns810; missing explicit AccountID/family
  match returns806; commit-helper failure returns809.
- The worker copies the selected row and applies the optional password or
  metadata argument. Metadata sets its present marker and replacement text.
  It then attempts table update through0x105709c0. A false result skips the
  commit while retaining status0. Successful commit unlocks before manager
  slot+0x34 callback; callback return does not change the result.
- Table updater false includes a no-difference result from0x1056efb0 as
  well as missing-row, capacity/upgrade and identity-consistency checks.
  Individual rejection-case reachability from the two public edit wrappers
  remains unresolved; do not describe every generic rejection as reachable
  from a password-only edit. Candidate/old revision comparisons and exact
  durable save/event delivery still need bounded follow-up.
- Added concrete modifier/error/side-effect records and revised both public
  summaries. Success is separate from a completed commit and from the
  external provider accepting changed credentials.
- Muse resource descriptions, TODOs and evidence are now rendered on their
  resource pages, with resource TODOs collected into open-work. A regression
  check verifies that musicServiceAccounts limits and evidence remain visible.
- The analyst guide's local file links were checked and all resolve.

The Muse-map/account-edit/rendering pass passed strict validation, generator
QA, all48 tests and the site build. Lint matches the17-warning baseline;
whitespace and new-prose dash checks pass. The site retains its existing
bundle-size warning. Guide links were checked against actual rendered anchor
IDs. That caught underscore-versus-hyphen links; corrected the guide and the
subsystem index/open-work link renderer. All guide file and section targets
now resolve, and tests/site were rerun after this change.

## Public account removal and TuneIn exception

- Installed RemoveAccount delegate0x104b0918 compares full AccountType
  with0xFE07 (65031, service254/type7). Equality branches to a settings
  operation writing R_HideTuneIn=true, bypassing normal account-row removal.
  AccountID is not consulted in this branch, though SOAP request validation
  precedes it. Zero settings status returns0; nonzero maps to809. Raw
  0x419e0044 at0x104b0944 proves exact equality;0x4182ff90 at0x104b09c8
  selects success on zero settings status.
- Other types enter0x1028c5f4. It locks, invokes deletion core0x1028c3b8,
  unlocks and invokes manager slot+0x34 only for zero core status. The core
  maps failed account-table load or failed commit to809 and propagates the
  row-removal helper status. Missing account in0x102863a8 returns806.
- Successful core commit precedes descriptor/remaining-family checks for
  conditional manifest deletion. The manifest-deletion result is ignored,
  and the del callback follows. The outer post-removal callback runs after
  unlock and cannot replace the returned removal status.
- Updated the public action, input special cases, error/side-effect/event
  records, account subsystem, client summary and reading guide. This
  distinguishes TuneIn visibility configuration from row deletion, cleanup,
  notifications and provider-side credential revocation. Exact deletion
  consistency/tombstone/save/notification details remain specific TODOs.

## Account-file commit and failure fallback

- Commit wrapper0x10289258 forwards to0x102890b0 with follow-up flag1.
  It proposes revision+1, resolves accounts.xml and invokes writer0x10508988.
  Only true writer result updates stored source/revision/next-serial and sends
  replication kind11 through interface slot+0x14. Follow-up eligibility and
  job submission can still run after a false writer result.
- Writer0x10508988 opens a .tmp file, performs full serialization and checks
  the close helper. If either full-write/close check fails, it can reopen and
  replace that temporary file with an Accounts header and closing tag, with
  no account rows. Fallback parameter fields reset Version0, NextSerialNum1
  and PreferredSerialNum0, using a fresh empty clock object.
- Fallback close/write success can rename this metadata-only document over
  the live accounts.xml; rename result is ignored and the function still
  returnsfalse. Caller809 therefore does not guarantee the old file survived.
  This differs from the separately documented manifest fallback result rules.
- Header emitter0x105071e4 names LastUpdateDevice, Version, NextSerialNum,
  SchemaVersion, PreferredSerialNum, VClockHousehold, VClockCloud and
  MuseHouseholdID; nullable clock attributes depend on clock state. Added the
  shared account-file payload record without claiming the row schema is done.
- Updated account actions, shared persistence records, client summaries and
  analyst guide with the failure-versus-file-state distinction. Full row
  grammar, recovery and actual replication/event delivery remain open.

The removal/account-file persistence pass passed strict validation,
generator QA, all48 tests and the site build. Lint matches the17-warning
baseline; whitespace, added-prose dash checks and guide file/anchor checks
pass. The site retains its existing bundle-size warning. Findings are static
firmware evidence; no account operations or failure injection were run on a
live device. Remaining public schemas, row-level persistence/recovery and
notification/integration behaviors are tracked explicitly.

## Nickname change and account-UDN selection

- Installed nickname adapter0x104b071c forwards AccountUDN and nickname to
  0x1028bb74. It decodes UDN through0x1056fc20, returning806 on failure,
  then calls the shared account modifier with decoded account type/ID.
- Duplicate nickname scan0x1028b974 compares exact stored account type,
  excludes the selected serial and skips rows with flags&1. Exact strcmp
  equality sets sticky802 through raw0x7fa8ef9e at0x1028b9f0, decoded as
  isel r29,r8,r29,30 with r8=802. The status is checked before table update
  or commit. The public nickname summary and error record now distinguish
  decoder/missing-account806, load810, conflict802 and commit809.
- UDN decoder requires exact SA_RINCON prefix, decimal type and underscore,
  with mapped type nonzero. It copies the remainder to AccountID with
  capacity129. Legacy1/2 map to0xCA07;13/14 to0xCB07. Raw0x7c634f5e at
  0x1056fc94 selects the original type on unsigned greater-than1 after the
  subtract13 comparison, otherwise0xCB07. Added the dedicated selection
  format record, keeping it distinct from service SID, serial and UID suffix.
- A search for R_SvcAccounts reached0x102897d8, where0x102898a0 reads the
  setting. This reference does not bind the post-commit notification or
  prove event delivery. No event payload was inferred from the string.

The nickname/UDN pass passed strict validation, generator QA, all48 tests
and the site build. Lint matches the17-warning baseline; whitespace,
new-prose dash and guide file/anchor checks pass. Existing bundle-size
warnings remain. The account event payload/delivery question remains open;
no event guarantee was inferred from the R_SvcAccounts setting read.

## Final practical coverage pass

The user narrowed the completion target to useful firmware-analysis
documentation, especially public behavior, without exhaustive low-value
internal enumeration. This pass ends that bounded documentation task. It
does not mark incompletely reversed records as finished: their specific
TODOs remain under the repository completeness policy.

- Constructor0x10285224 installs account-manager vtable0x10eabc6c.
  Slot+0x28 is diagnostic reporter0x10284950; slot+0x34 is0x102850c4.
- Normal removal's del callback records zpAM type, flags, rsid and asn.
  It is separate from account-list controller events. No diagnostic upload
  or delivery guarantee follows from this producer alone.
- Post-commit callback0x102850c4 returns when the global zone is null.
  Otherwise it invokes0x101b8048, which reads an account snapshot through
  0x1028903c, compares it with cached state and conditionally copies rows
  and invokes0x101bb1d0. Additional work through0x101b7620 is gated.
  Downstream event serializers, subscribers and delivery are still open.
- Updated password, metadata, nickname and removal event records with the
  concrete binding and the diagnostic-versus-refresh distinction.
- The guide maps catalog/session commands, all account command families,
  custom-service registration, Muse matching/preference/direct control,
  subscriptions, browsing/playback, protection, reporting and Spotify to
  their evidence-backed records. Unknown schemas and effects stay visible
  beside the relevant public surface and in the generated open-work list.

No live-device sign-in, account mutation or failure injection was performed.
Static findings describe this firmware build. The remaining work is deeper
behavioral recovery, not a claim that every music-service branch is proven.

Final checks: strict validation reports zero errors/incomplete objects;
generator QA reports zero errors/warnings; all48 tests pass. The15 public
catalog/account-related commands have client summaries and assessed contract
fields. Lint is unchanged from the17-warning baseline. The site build
passes with the existing bundle-size warning. All28 guide links and their
built-page anchors pass; diff whitespace and new-prose dash checks pass.
