# muse resources: Authorization

The auth surface: token issuance and revocation, household membership proofs and the lechmere policy checks every other resource is gated behind. This is the mechanism that decides which app on which account may call which op.

## `authorization`

The sign-in and credential surface for the modern API, where API keys and authorization tokens are issued, presented, and checked. Every other resource group in the modern API trusts the credentials established here, so this is the foundation under the whole security model: get a valid credential here first, or nothing else will talk to you.

| Method | Path | Op | Trailing param | Flags | Exec (vtable +0x0c) | Params | Spec lists (classId: root, field:type pairs) |
|---|---|---|---|---|---|---|---|
| `POST` | `v1/households/{householdId}/authorization/tokens` | `resolveToken` | `-` | `0x20000102` | `0x10ad4b7c` | `token`, `attributes`, `attributes` | c1: |
| `GET` | `v1/households/{householdId}/authorization/policy/{policyKey}` | `getPolicyKey` | `policyKey` | `0x20000101` | `0x10ad4b7c` `0x10ad4b8c` desc:`10ad88f8` `10ad8908` `10ad8918` | `token`, `attributes`, `attributes`, `policyKey` | c1:<br>c1:`authzPolicyKey`:`upnpEvent` |
| `GET` | `v1/households/{householdId}/authorization/permissions/{role}` | `getPermissions` | `role` | `0x20000101` | `0x10ad4b8c` `0x10ad4b9c` desc:`10ad8928` `10ad8938` `10ad8948` | `policyKey`, `role` | c1:`authzPolicyKey`:`upnpEvent`<br>c2:`authzPermissions`:`upnpEvent` `globalError`:`chirpRequest` |
| `POST` | `v1/\[error:  'none' is not a valid target\]/authorization/invite` | `createInvite` | `-` | `0x20000102` | outbound-fwd | none | none |
| `POST` | `v1/households/{householdId}/authorization/invite` | `createInvite` | `-` | `0x20000102` | outbound-fwd | none | none |
| `POST` | `v1/\[error:  'none' is not a valid target\]/authorization/redeem` | `redeemInvite` | `-` | `0x20000102` | outbound-fwd | none | none |
| `POST` | `v1/households/{householdId}/authorization/redeem` | `redeemInvite` | `-` | `0x20000102` | outbound-fwd | none | none |
| `GET` | `v1/\[error:  'none' is not a valid target\]/authorization/users` | `getUsers` | `-` | `0x20000101` | outbound-fwd | none | none |
| `GET` | `v1/households/{householdId}/authorization/users` | `getUsers` | `-` | `0x20000101` | outbound-fwd | none | none |
| `DELETE` | `v1/\[error:  'none' is not a valid target\]/authorization/users` | `deleteInvite` | `-` | `0x20000108` | outbound-fwd | none | none |
| `DELETE` | `v1/households/{householdId}/authorization/users` | `deleteInvite` | `-` | `0x20000108` | outbound-fwd | none | none |
| `POST` | `v1/players/{playerId}/authorization/authorizeDevice` | `authorizeDevice` | `-` | `0x20000102` | `0x10ad4b9c` `0x10ad4bac` | `role`, `grantType` | c2:`authzPermissions`:`upnpEvent` `globalError`:`chirpRequest`<br>c2:`authzPermissions`:`upnpEvent` `globalError`:`chirpRequest`<br>c5:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`container`<br>c5:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`container` |
| `POST` | `v1/households/{householdId}/players/{playerId}/authorization/authorizeDevice` | `authorizeDevice` | `-` | `0x20000102` | `0x10ad4b9c` `0x10ad4bac` | `role`, `grantType` | c2:`authzPermissions`:`upnpEvent` `globalError`:`chirpRequest`<br>c2:`authzPermissions`:`upnpEvent` `globalError`:`chirpRequest`<br>c5:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`container`<br>c5:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`container` |
| `POST` | `v1/players/{playerId}/authorization/authenticateClient` | `authenticateClient` | `-` | `0x20000102` | `0x10ad4bac` `0x10ad4bbc` | `grantType` | c5:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`container`<br>c5:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`container`<br>c6:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`diagnosticInfo` `globalError`:`content` `globalError`:`cloudDevice`<br>c6:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`diagnosticInfo` `globalError`:`content` `globalError`:`cloudDevice` |
| `POST` | `v1/households/{householdId}/players/{playerId}/authorization/authenticateClient` | `authenticateClient` | `-` | `0x20000102` | `0x10ad4bac` `0x10ad4bbc` | `grantType` | c5:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`container`<br>c5:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`chirpRequest` `globalError`:`commandHeader` `globalError`:`container`<br>c6:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`diagnosticInfo` `globalError`:`content` `globalError`:`cloudDevice`<br>c6:`authorizationGrantResponse`:`upnpEvent` `globalError`:`wiredSubStatus` `globalError`:`diagnosticInfo` `globalError`:`content` `globalError`:`cloudDevice` |

::: details Recovered vocabulary & internals

Related enum registrations (proven integer values, see `enum_tables`):

- **auth_roles**: `OWNER`=1, `GUEST`=2, `CRM`=3, `ADMIN`=4, `EMPLOYEE`=5, `PLAYER_TO_PLAYER`=6, `BLE_DTLS`=7
- **authz_namespaces**: `AUTHZTOKENS`=1, `AUTHZPOLICIES`=2, `DEVICES`=3, `ENTITLEMENTS`=4, `FCS`=5, `SETTINGS`=6, `HISTORY`=7
- **shared_queue_policies**: `PAUSE_CONTENT`=1, `PLAY_TO_BONDED`=2, `STOP_CONTENT`=3, `USE_SHARED_QUEUE`=4
- **token_types**: `GUEST_TOKEN`=1, `ACCESS_TOKEN`=2, `API_KEY`=3, `GUEST_TOKEN_PIN`=4

Op-level JSON keys recovered from op-object methods: `token`, `objectId`, `objectType`, `attributes`, `muse`, `policyKey`, `role`, `route`, `protocolVersion`, `grantType`, `assertion`

Field vocabulary (request/response keys seen in the resource's client tables, not yet bound to individual ops): `objectIds`, `query:accountId`, `query:destinationServiceId`, `query:inviteId`, `query:mainAccountId`, `query:protocolVersion`, `query:route`


:::
