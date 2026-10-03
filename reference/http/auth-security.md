# HTTP: Auth & security

## `cert_identity`

The certificate identity: the player's own digital credential, which is what it presents to prove it's a genuine Sonos device rather than an impersonator.

::: details Technical details

- **crypto:** mbedTLS; sonos::certval::validate(sonos_device_x509_fields*, mbedtls_x509_crt* cert, crt, crl, x509_crt_profile, name, flags, cb, RootCACertBundle*): custom device-x509 field validation
- **client_identities:** `R_CLIENT_KEYCERT_ID_SONOS`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE`, `R_CLIENT_KEYCERT_ID_SONOS_DEVICE_ACCEPT_LEGACY`, `R_CLIENT_KEYCERT_ID_SONOS_REGISTERED_DEVICE`
- **status_route:** /root_cert_bundles
- **reg_ids:** `RegisteredCertSonosID`, `newRegisteredCertSonosIDLocked`, `DeviceCertInvalid`
- **jwt:** 'JWT cert validation finished: %s': JWT validation path exists
- **curl:** 'Curl - set cert validation callbacks'/'Curl - set key and cert for client validation'; 'cert validation for %s (local port %u)'; 'Expected cert validation failure for %s'
- **bundle:**
  - **lib:** libsonos-root-cert-bundle.so.2
  - **fetch:** CertBundleDownloader: GET /certbundles/v4/trusted_roots.rcb w/ ETag conditional fetch ('unchanged (ETag: %s)'); scheduled 'for %ld seconds' + first-fetch delay
  - **docs:** /root_cert_bundles status route; <RootCertBundleInfo><Bundles> + <DeviceCertInfo> docs

:::


## `device_auth`

Device authentication: how the player proves itself to other devices and services, which is the credential-checking machinery guarding device-level trust.

::: details Technical details

- **headers:** `X-Sonos-DeviceCert: <cert>`, `X-Sonos-Device-Id`, `X-Sonos-Api-Key`, `X-Sonos-Corr-Id`
- **certval:** sonos::certval::validate(sonos_device_x509_fields, mbedtls crt+crl+profile, RootCACertBundle): full device-cert chain validation; sonosCertvalSetSSLToSonosDevice SSL profile
- **tokens:** v1/households/{householdId}/authorization/tokens + resolveToken; getAuthTokenResult/'Treating auth token as expired'; authToken{Changed,Refreshed} events; getDeviceAuthToken res==%d failure
- **regcert:** fetchRegDeviceCert/refreshRegDeviceCert -> /regcert local endpoint; RegCertUpdateEvent
- **oauth:** int_addAccountWithOAuthToken/addAccountWithOAuthToken/SpConnectionLoginOauthToken: OAuth-token SMAPI account linking; deviceCerts capability lets services request device certs
- **ssl:** /ssl_client_cache status endpoint: TLS session cache

:::


## `noncehandler`

The nonce routine: it generates and validates one-time values used to prevent replay in authentication flows.

::: details Technical details

- **semantics:** auth-nonce tracking for cloud requests

:::


## `token_refresh_state_machine`

The token-refresh state machine: the per-account logic renewing expiring credentials, covering the states and transitions that keep logins alive automatically.

::: details Technical details

- **name:** music-account OAuth token refresh lifecycle
- **description:** Per-account token refresh FSM ('token refresh state for acct. sn. %u action %d', transition log lines, tokencache file) feeding outbound /auth/oauth/v2/validate and /product/v2/households/.../players?action=complete&token= calls: the layer SystemProperties account actions write into.
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10efc408, notes: /auth/oauth/v2/validate
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10ed7a78, notes: tokencache
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10ec2567, notes: transition token refresh action
- **todo:** `Established: the per-account token refresh FSM, tokencache file, and the outbound validate/complete calls it feeds are documented.`, `Still unknown: the FSM's transition table - which states lead where on which events - is not enumerated.`, `Next step: enumerate the transition log lines into a full state table.`

:::


## `household_psk_vocabulary`

The household key vocabulary: the named shared secrets the system uses, with separate keys guarding the household channel, the control channel, the LAN swap, and room encryption.

::: details Technical details

- **name:** household encryption key elements
- **description:** Replicated-state PSK identifiers: HhPsk (household), ControlPsk (control channel), LanSwapPsk, RoomEncPsk (room encryption), each with a Backup* mirror: the key hierarchy for household crypto. Distribution/rotation mechanics undocumented.
- **elements:** `HhPsk`, `ControlPsk`, `LanSwapPsk`, `RoomEncPsk`, `BackupHhPsk`, `BackupControlPsk`, `BackupLanSwapPsk`, `BackupRoomEncPsk`
- **evidence:**
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10efae10, notes: <HhPsk
  - type: firmware, binary: anacapad, build: 86.10-80260, address: 0x10efae70, notes: <RoomEncPsk
- **todo:** `Established: the PSK identifier set (HhPsk/ControlPsk/LanSwapPsk/RoomEncPsk plus Backup mirrors) is catalogued as the key hierarchy.`, `Still unknown: the record itself flags it - distribution and rotation mechanics are undocumented.`, `Next step: trace a PSK consumer to its rotation/distribution path.`

:::


## `muse_authhelper`

The modern-API auth helper: the shared credential-checking machinery the API's auth stage calls whenever a request needs its credentials checked.

::: details Technical details

- **impl:** museclient_authhelper.cxx
- **semantics:** museauth module + museAuthzCache: cached cloud-authz tokens for Muse clients
- **oauth:**
  - **evidence:**
    - type: firmware, address: 0x1009a0d4, notes: grant/scope table (init table 0x11085328)
  - **grant_types:** `urn:ietf:params:oauth:grant-type:jwt-bearer`
  - **subject_urns:** `urn:sonos:hhid:`, `urn:sonos:unit-hhid:`
  - **scopes:** `playback-control-all`
  - **policy_keys:** `guestPermissionsPolicyKey`
  - **jwt_algs:** `RS256`, `HS256`
  - **thor:**
    - **name:** thor
    - **strings:** `UserAuthorization`, `ThorOperations`, `PolicyKeyTableMutex`
    - **note:** muse authorization is evaluated by the Thor policy subsystem: op calls carry credType through the <Command> envelope and Thor checks the caller against UserAuthorization policy keys

:::


## `circuitbreaker`

The circuit-breaker implementation: after enough failures to an endpoint, calls fail fast for a while instead of queueing up timeouts. It's why one dead service can't drag the whole player down.

::: details Technical details

- **semantics:** circuitBreakerTelemetry: breaker pattern on outbound paths w/ telemetry

:::

