# Music services: analyst's reading guide

This guide covers `anacapad` build `86.10-80260`. Start with the public
operation you are investigating, then follow its technical evidence. The
[interface map](../reference/subsystems/index.md#music-services-interfaces)
connects the records. Specific unresolved behavior remains marked with TODOs;
coverage of a topic does not imply every internal branch has been recovered.

| Task | Start here | Important distinction |
|---|---|---|
| Discover services or refresh their catalog | [MusicServices](../reference/soap/music-services.md) | A listed service is not necessarily a logged-in or playable account. |
| Add, replace, remove or rename an account | [SystemProperties](../reference/soap/system-properties.md) | Use each action's byte limits, outputs and fault conditions. |
| Understand OAuth routing and sign-in | [Account actions](../reference/subsystems/index.md#account-actions), [SMAPI client](../reference/subsystems/index.md#smapi-client) | Token/code selection, credential acquisition and account persistence are separate stages. |
| Register a custom service | [Custom service form](../reference/subsystems/index.md#customsd) | Form acceptance does not guarantee external authentication or playback. |
| Read descriptors, capabilities or manifests | [Descriptor](../reference/subsystems/index.md#smapi-descriptor), [manifest](../reference/subsystems/index.md#svc-manifest), [payload formats](../reference/soap/payload-formats.md) | Catalog XML and nested manifest JSON are different schemas. |
| Match or choose an account through Muse | [Muse content resources](../reference/muse/resources/content.md) | `musicServiceAccounts` exposes matching/preference/direct control, rather than generic account CRUD. |
| Call the bridge or manage subscriptions | [Muse UPnP bridge](../reference/muse/resources/upnp-bridge.md) | Route registration does not prove every bridged action or delivery guarantee. |
| Browse content and resolve identifiers | [ContentDirectory](../reference/soap/content-directory.md), [URI formats](../reference/soap/uri-formats.md) | Object IDs select a collection or item; they do not establish a playable resource. |
| Load content or investigate playback | [Content loading](../reference/subsystems/index.md#load-content), [cloud queue](../reference/subsystems/index.md#cloud-queue), [stream fetcher](../reference/subsystems/index.md#stream-fetcher) | Selection, resolution, loading and playback start are distinct outcomes. |
| Investigate protected media | [Content keys](../reference/subsystems/index.md#drm-content-keys), [certificate lifecycle](../reference/subsystems/index.md#account-cert-lifecycle) | Key metadata does not establish a persistent decrypted-key cache. |
| Investigate reporting or listening history | [Reporting](../reference/subsystems/index.md#reporting), [scrobbler](../reference/subsystems/index.md#scrobbler), [history](../reference/subsystems/index.md#play-history) | Collection, submission and successful upload are different observations. |
| Investigate Spotify | [Spotify](../reference/subsystems/index.md#spotify), [Connect](../reference/subsystems/index.md#spotify-connect), [ZeroConf](../reference/subsystems/index.md#spotify-zeroconf) | Local discovery, credentials, SDK control and playback have separate paths. |

## Public contracts worth checking first

- Account commands are under `/SystemProperties/Control`. The three catalog
  and session commands are under `/MusicServices/Control`.
- `GetWebCode` returns `800` for valid requests with this build's installed
  delegate. Its generic success/output branch is unreachable here.
- `RemoveAccount` with TuneIn account type `65031` writes
  `R_HideTuneIn=true` instead of entering normal account deletion.
- `EditAccountPasswordX` reaches the account modifier. The earlier claim that
  it was an unconditional successful no-op was incorrect.
- `AddOAuthAccountX` prioritizes a nonempty token, then an authorization code,
  then the preinstalled-service path. Its shared OAuth worker requires a
  supplied/generated token and `OAuthDeviceID`.
- OAuth add/refresh/replace handlers enforce explicit byte-length checks.
  Parse-buffer capacity is not the accepted content limit. See each argument
  record for the corrected limits.
- `/customsd` requires a CSRF token and the exact
  `application/x-www-form-urlencoded` content type. Custom SIDs are
  `240..253` or `255`. Its success path reloads descriptors and requests
  reconciliation, without guaranteeing a successful service login.
- The RDM commands read/write `R_RDM`. The actual product effect is unresolved;
  the command names do not establish remote diagnostic access.

- Nickname changes use `AccountUDN`, not a bare service ID. A case-sensitive
  duplicate on another eligible account of the same stored type returns `802`.
- Account save failure is not a rollback guarantee. A fallback can replace
  `accounts.xml` with a metadata-only document containing no account rows and
  still cause the command to report failure. See the account-file commit and
  fallback records in `music_accounts`.

- The normal account-removal `del` report is diagnostic data. The separate
  post-commit callback refreshes local account state; its presence alone does
  not prove a controller received an account-list event.

## Interpreting the evidence

A wrapper can accept an operation while a downstream service rejects it.
The shared HTTP loop becoming idle does not establish SOAP success, and
entering the serializer does not establish that a response arrived. Follow
status translation, response acceptance and persistence separately when
analysing a failure.

The most thoroughly traced areas are catalog/descriptor/manifest handling,
account wrapper contracts and their installed settings delegate, the custom
service form, and selected manifest/playback consumers. Important remaining
work includes exact Muse operation schemas and effects, complete account
persistence/notifications, transport and retry policy, reporting triggers and
service-specific sign-in details. These are listed in the
[open-work inventory](../reference/subsystems/open-work.md) and the
[research log](music-services-research.md).

The authoritative semantic records are in [documentation.json](documentation.json),
with reader summaries in [client_text.json](client_text.json). The reference
and site are regenerated from those sources. Validation and build success
check documentation consistency, not exhaustive firmware behavior.
