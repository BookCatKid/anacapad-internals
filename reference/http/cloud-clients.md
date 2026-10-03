# HTTP: Outbound clients & cloud

## `upnp_cloud_tunnel`

The classic-protocol cloud tunnel: the channel carrying classic-protocol traffic over the cloud connection, which is how remote commands reach the player from off-network.

::: details Technical details

- **status:** confirmed
- **surface:** every service's upnp<Service> cloud resource exposes {subscribe, renew(logicalSID), unsubscribe(logicalSID)}: GENA subscription management relayed cloud->local
- **semantics:** renewSubs op; local SUBSCRIBE/UNSUBSCRIBE handled by f_105e8290 GENA handler; cloud mirror proxies event subscription state (logicalSID keys)

:::


## `soap_client`

The classic command-protocol client: the machinery for outbound classic-API calls, used when the player itself calls another device's commands like group fan-out to members.

::: details Technical details

- **status:** confirmed
- **wire:** SOAPACTION header grammar: '%s%sSOAPACTION: "%s%s%s"' and '%sSOAPACTION: "%s#%s"': urn#action forms
- **logging:** 'UPnP call: %s:%s from %s:%d' inbound / 'returned %d to %s:%d' outbound; Tunneled UPnP call variant: SOAP relayed over the cloud tunnel shares the dispatcher
- **impl:** protocol/client/src/{sonos_cprovider,request,client,renew}.cxx: outbound control-point stack

:::


## `cloud_request`

The cloud request machinery: how the player forms and sends requests to Sonos's servers, which is the outbound half of the cloud connection.

::: details Technical details

- **status:** confirmed
- **files:** `/oc/zone/common/cloudrequest.cxx`

:::


## `cloud_registration`

Cloud registration: the flow enrolling this player under a Sonos account. Without it the speaker is local-only, and it's the enrollment that ties hardware to your account.

::: details Technical details

- **status:** confirmed
- **tls:** secure reg over SSL ('Invalid secure reg SSL port','Could not create secure reg SSL Context'); 'Curl - using R_CLIENT_KEYCERT_ID_SONOS_REGISTERED_DEVICE for %s': client-cert identity
- **cloud_routes:** `v1/households/{householdId}/devices/registrations (+GET registrations, initDeviceRegistration)`, `v1/households/{householdId}/devices/registrations/{deviceId} (complete/refresh/deregister)`, `v1/users/{userId}/devices/registrations`, `v1/players/{playerId}/devices/registration (getRegistrationStatus/setRegistrationState/transferDeviceRegistration)`
- **events:** `NewCertRegistrationEvent`, `SecureRegistrationStateUpdateEvent`, `SecureRegistrationChangeEvent`, `RegCertUpdateEvent`
- **objects:** `cloud_registration`, `CloudRegistration`, `makeMuseCloudRegistrationStatus`
- **local_route:** /registration status endpoint
- **errors:** `REGISTRATION_CHIME_UNAVAILABLE`, `'updating boot sequence due to registration event'`, `'Account registration for service %u res %hu'`

:::


## `service_accounts`

The service accounts machinery: the saved-login store where music-service credentials live and how they're retrieved when a service authenticates.

::: details Technical details

- **status:** confirmed
- **impl:** zpserviceaccounts.cxx -> RZPServiceAccounts
- **accounts:** sn (service-account serial) + sid (service id); musicServiceAccounts ops {match,preferred set/get,startDirectControlEx,endDirectControl}
- **oauth_migration:** 'migrated account to OAuth, type:%u, sn:%u' / 'failed to migrate' / 'Authentication failed during migration': legacy->OAuth migration path
- **manifests:** per-account manifest download 'failed to download manifest file for account sid:%u, sn:%u'
- **events:** NewMuseHHIDEvent/NewLocationIdEvent -> RZPServiceAccounts; userInfo updates 'updating userInfo for account SN: %u' + user-hash cleanup

:::


## `device_registration`

Device registration: the machinery enrolling the player with Sonos's services, which turns 'a box on the network' into 'your registered product'.

::: details Technical details

- **status:** confirmed
- **impl:** register.cxx + regdevicecert.cxx + cloudregistration.cxx
- **wire:** RegistrationReqMsg/RegistrationRespMsg pair; registration/{state,status,id,state/transfer} endpoints; <WebsocketRegistration> element
- **signing:** registration signing key {set,cleared}; 'signature required/invalid': requests signed via IPC-provisioned key
- **cert:** R_CLIENT_KEYCERT_ID_SONOS_REGISTERED_DEVICE: the registered-device client-cert for curl cloud calls; Loading/Unloading secure reg cert; 'reg cert not available; cannot generate token'; fetchRegDeviceCert/refreshRegDeviceCert; NewCertRegistrationEvent/RegCertUpdateEvent
- **states:** during suspend/time expired/success/error/retrying; secureReg/secureRegState/secureRegTransfer; SecureRegistration{State,Change}UpdateEvent
- **gating:** 'not securely registered' blocks config fetch; 'should be quarantined (secure reg required)'; 'Removing settings denylists after registration': registration lifts settings restrictions
- **cloud:** makeMuseCloudRegistrationStatus; 'Updating cloud registration due to %s. MuseSessionId %s->%s'; 'defer due to missing required field(s)'; cached event; wifi-monitor jobs; SET_CONFIG sends registration

:::


## `device_account_endpoint`

The device-account endpoint: the web surface for the account-registration flow, where a speaker registers itself against a Sonos account.

::: details Technical details

- **handler:** f_1065bd70
- **flow:** path claim '/device_account' (f_10655ea4) -> f_106570bc validate -> f_1065b730('int_setTransferMode') transfer-mode int; serialize device-account via f_1065a8dc(strlen+encode)/f_109cd7a4/f_1065e99c; state word *(r30+8) in {3,4} selects account variant; constant block 0x110b9044 (6 bytes) feeds the blob; f_10807034 XML append; stack-canary guarded
- **semantics:** device-account provisioning/read endpoint; response is an encoded account blob whose variant depends on registration state (3 vs 4)
- **status:** strong

:::

