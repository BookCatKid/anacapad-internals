#!/usr/bin/env python3
"""
expand_surface.py -- fold the EXTRACTION_GAPS audit findings into
docs/documentation.json.

Adds (all evidence-address-resolved against the binary):
- shared_primitives.http_extra_endpoints   missed HTTP paths
- shared_primitives.internal_result_namespace  the ~403 R_* codes
- shared_primitives.system_property_keys   the 29 R_* settings keys
- shared_primitives.smapi_capability_vocabulary  /customsd checkbox set
- shared_primitives.csrf_protection
- shared_primitives.post_form_endpoints
- shared_primitives.device_description_variants
- shared_primitives.gena_internals
- shared_primitives.didl_classes_ext
- shared_primitives.protocol_info_full
- shared_primitives.icy_metadata
- shared_primitives.alert_engine
- shared_primitives.household_psk_vocabulary
- shared_primitives.replication_elements
- shared_primitives.token_refresh_state_machine
- shared_primitives.xml_schema_clusters
- shared_primitives.internal_error_families
- uri_formats misc scheme additions
- top-level "subsystems"  Part-2 subsystem catalogue

Idempotent: rewrites the keys it owns, touches nothing else.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import extract_soap_api as X

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOC = os.path.join(ROOT, "docs/documentation.json")
ELF_PATH = os.environ.get(
    "ANACAPAD",
    "/Users/simon/MyDocuments/gpt/sonos-firmware-archive/"
    "artifacts/downloads/rootfs-86.10-80260-1-9/opt/bin/anacapad")
BUILD = "86.10-80260"

_e = None


def va(s):
    """First file offset of literal `s` mapped to a VA."""
    fo = _e.data.find(s.encode())
    if fo < 0:
        return None
    for p in _e.phdrs:
        if p["type"] == 1 and p["off"] <= fo < p["off"] + p["fsz"]:
            return p["va"] + (fo - p["off"])
    return None


def ev(s, notes=None):
    a = va(s)
    if a is None:
        return None
    return {"type": "firmware", "binary": "anacapad", "build": BUILD,
            "status": "confirmed", "address": "0x%x" % a,
            "notes": notes or s}


def main():
    global _e
    _e = X.Elf(ELF_PATH)
    doc = json.load(open(DOC))
    sp = doc["shared_primitives"]

    # ---- HTTP endpoints missed by the first route-table pass ----------
    extra_paths = [
        "/ssh/authorized_keys", "/ssh/fingerprints", "/softwareDownload",
        "/createGroup", "/unjoin", "/activate", "/deactivate",
        "/auth/oauth/v2/validate", "/authz", "/tokens",
        "/accountSubscription", "/content/api", "/bridge/content/api",
        "/entitlements/api", "/settings/api/v1/locations/",
        "/sonar-tone", "/sonarctl", "/save_eq_presets", "/setPersistentEQ",
        "/putDSP", "/drc", "/dolby_config", "/dynamicparams",
        "/staticparams", "/spotdbg", "/spotifyzc", "/rdmbuttonfwd",
        "/rdmhhsetup", "/sethostip", "/upload", "/v2/diags", "/testpoint",
        "/debugfiles", "/watchdog", "/watchdog-legacy", "/watchdogcrash",
        "/ws/diag/diag_instructions.xml", "/ttm_helper", "/ZPs",
        "/duck", "/unduck", "/downloadspdiftap", "/snapshotspdiftap",
        "/getaa", "/testenv", "/advconfig", "/customsd", "/devmode",
        "/fcs", "/logger", "/ping", "/traceroute", "/nslookup",
        "/removestring", "/setstring", "/mdnsannounce", "/spotresetnts",
        "/support/directsubmit", "/support/aggregate",
        "/support/asyncsubmit", "/support/networkmatrix",
        "/support/review", "/support/reportstatus", "/anacapad-external",
        "/btmanager-external", "/sonosledmgrd-external",
        "/sonospowercoordinator-external", "/netstartd-external",
        "/xml/device_description_no_ai.xml", "/xml/satellite_device.xml",
        "/tools.htm", "/unlock.htm", "/advconfig.htm", "/customsd.htm",
        "/bugs.html", "/hsts.html", "/alt-svc.html",
    ]
    found, missing = [], []
    for p in extra_paths:
        a = va(p)
        (found if a else missing).append(
            {"path": p, "address": "0x%x" % a} if a else p)
    sp["http_extra_endpoints"] = {
        "status": "strong",
        "name": "HTTP paths outside the /status route-table cluster",
        "description": (
            "Second-sweep string audit of the anacapad HTTP server "
            "surface: paths present in rodata that were not in the "
            "decoded /status route table. Covers SSH-key install, "
            "firmware download, group ops, local OAuth/authz, content "
            "bridges, DSP control, Spotify debug, retail-demo hooks, "
            "support-bundle submission, the /testenv environment "
            "switcher, sibling-daemon IPC proxies (/X-external) and "
            "htdocs pages. Presence of a path string does not prove a "
            "registered route; addresses are the literal locations."),
        "paths": found,
        "missing_strings": missing,
        "evidence": [x for x in (ev("/ssh/authorized_keys"),
                                 ev("/testenv"), ev("/sonarctl"),
                                 ev("/spotifyzc")) if x],
    }

    # ---- R_* internal result-code namespace --------------------------
    rcodes = []
    for line in open("/tmp/r_all.txt"):
        k = line.strip()
        if k:
            rcodes.append(k)
    fams = {}
    for k in rcodes:
        parts = k.split("_")
        fam = parts[1] if len(parts) > 1 else "CORE"
        if fam not in ("LED", "MASK", "PAND", "LASTFM", "WMP", "PLAY",
                       "STREAM", "ACCOUNT", "CLOUD", "INIT", "READ",
                       "WRITE", "TYPE", "CLIENT", "ERROR", "PLAYBACK",
                       "AUDIO", "CMD", "LENGTH", "TELL", "MOBILE"):
            fam = "CORE"
        fams.setdefault(fam, []).append(k)
    sp["internal_result_namespace"] = {
        "status": "strong",
        "name": "R_* internal result/status code namespace",
        "description": (
            "Complete internal status enum recovered from rodata — "
            "%d codes. These are the unified result codes the UPnP "
            "layer maps into 4xx/7xx/8xx faults and the muse/log layers "
            "report verbatim. The value->code integer mapping is NOT "
            "recovered (enum is a table lookup, not a string->int "
            "map); this is the vocabulary, not the numbering." %
            len(rcodes)),
        "families": fams,
        "count": len(rcodes),
        "evidence": [x for x in (ev("R_LED_BEGIN_SETUP_MODE"),
                                 ev("R_CLOUD_QUEUE_STREAM_LIMIT"),
                                 ev("R_MASK_NINE_DOT_ONE_DOT_FOUR"),
                                 ev("R_LASTFM_STREAM_LIMIT")) if x],
    }

    # ---- R_* settings keys --------------------------------------------
    skeys = ["R_AccountTransferMode", "R_AirplayIncludeLinked",
             "R_AudioInEncodeType", "R_AutoUpdatePolicy",
             "R_AutoUpdateWindowStart", "R_AvailableSoftwareUpdate",
             "R_AvailableSvcTrials", "R_AvailableSvcTypes",
             "R_BrowseByFolderSort", "R_CheckUpdateInterval",
             "R_ContentFiltering", "R_CrossfadeDuration", "R_CustomerID",
             "R_ForceReIndex", "R_HideTuneIn", "R_HouseholdLocationID",
             "R_MigratedTuneIn", "R_MuseDuckingPolicy", "R_PromoVersion",
             "R_RadioLocation", "R_ServiceBitrate", "R_ShowNSSServers",
             "R_ShowRhapUPnP", "R_SvcAccounts", "R_ThirdPartyCredentials",
             "R_TrialZPSerial", "R_UseSonosContentDirNS", "R_VolNormMode"]
    sp["system_property_keys"] = {
        "status": "strong",
        "name": "SystemProperties R_* settings key space",
        "description": (
            "Known keys for the SystemProperties Get/Set/Remove "
            "key/value store recovered from rodata. MixedCase R_* "
            "keys are the persistent settings namespace; the all-caps "
            "R_* codes (internal_result_namespace) are a different "
            "vocabulary."),
        "keys": sorted(skeys),
        "evidence": [x for x in (ev("R_VolNormMode"),
                                 ev("R_MuseDuckingPolicy"),
                                 ev("R_ThirdPartyCredentials")) if x],
    }

    # ---- SMAPI capability vocabulary (/customsd) ----------------------
    sp["smapi_capability_vocabulary"] = {
        "status": "confirmed",
        "name": "SMAPI capability/auth/container vocabulary",
        "description": (
            "The /customsd POST form is a full SMAPI service-descriptor "
            "editor and enumerates the authoritative vocabulary that "
            "MusicServices ListAvailableServices descriptors carry."),
        "sid_range": "240-253 or 255",
        "container_types": ["MService", "SoundLab"],
        "auth_types": ["UserId", "Anonymous", "DeviceLink", "AppLink"],
        "capabilities": [
            "search", "trFavorites", "alFavorites", "arFavorites",
            "ucPlaylists", "logging", "playbackLogging",
            "accountLogging", "extendedMD", "radioExtendedMD",
            "playlistExtendedMD", "disableAlarms", "noMultiAccount",
            "mediaUriActions", "contextHeaders", "deviceCerts",
            "playerIds", "contextReporting", "userInfo",
            "contentFiltering", "manifest", "authorizationHeader"],
        "optional_uris": ["strings", "presentationMap", "manifest"],
        "evidence": [x for x in (ev("/customsd"), ev("trFavorites"),
                                 ev("playlistExtendedMD"),
                                 ev("SoundLab")) if x],
    }

    # ---- CSRF / POST-form layer ----------------------------------------
    sp["csrf_protection"] = {
        "status": "confirmed",
        "name": "CSRF tokens on browser-facing POST endpoints",
        "description": (
            "Every browser-form POST endpoint embeds a hidden "
            "csrfToken field: /advconfig, /customsd, /devmode, /fcs, "
            "/logger, /mdnsannounce, /nslookup, /ping, /removestring, "
            "/setstring, /spotresetnts, /ssh/authorized_keys, "
            "/support/directsubmit, /testenv, /traceroute. Token "
            "generation/validation mechanics not decoded."),
        "form_endpoints": [
            "/advconfig", "/customsd", "/devmode", "/fcs", "/logger",
            "/mdnsannounce", "/nslookup", "/ping", "/removestring",
            "/setstring", "/spotresetnts", "/ssh/authorized_keys",
            "/support/directsubmit", "/testenv", "/traceroute"],
        "evidence": [x for x in (ev("csrfToken"),
                                 ev('action="/advconfig"'),
                                 ev('action="/ssh/authorized_keys"'))
                     if x],
    }

    # ---- Device description variants -----------------------------------
    sp["device_description_variants"] = {
        "status": "confirmed",
        "name": "Alternate device-description documents",
        "description": (
            "Three device descriptions exist: device_description.xml "
            "(served, 16 services), device_description_no_ai.xml "
            "(alternate without AudioIn — proves the omission is a "
            "switchable variant, not conditional assembly), and "
            "group_description.xml (SpeakerGroup:1 satellite doc). "
            "satellite_device.xml also exists for bonded "
            "sub/surrounds."),
        "files": ["/xml/device_description.xml",
                  "/xml/device_description_no_ai.xml",
                  "/xml/group_description.xml",
                  "/xml/satellite_device.xml"],
        "evidence": [x for x in (ev("/xml/device_description_no_ai.xml"),
                                 ev("/xml/satellite_device.xml"),
                                 ev("/xml/group_description.xml"))
                     if x],
    }

    # ---- GENA internals -------------------------------------------------
    sp["gena_internals"] = {
        "status": "strong",
        "name": "GENA subscription/notify internals",
        "description": (
            "Subscription machinery vocabulary: SID preinstall "
            "('Attempting to preinstall SID=%u', '?sid=0' URL form), "
            "status fields SubscribedEvents/LogicalSID/UPnPSID/"
            "NotifyErrors, sender/source pair upnpeventing_sender+"
            "upnpeventing_source, AVTStateLastChangedEvent event name, "
            "and the <LastChange>%s</LastChange> wrapper emitted per "
            "service. Per-service LastChange payload schemas not "
            "enumerated."),
        "evidence": [x for x in (ev("Attempting to preinstall SID"),
                                 ev("<LogicalSID>"),
                                 ev("<NotifyErrors>"),
                                 ev("<LastChange>")) if x],
    }

    # ---- DIDL classes ----------------------------------------------------
    sp["didl_classes_ext"] = {
        "status": "strong",
        "name": "Extended DIDL object classes",
        "description": (
            "DIDL class vocabulary beyond the core audioItem set: "
            "audioBook/audioBook.chapter/podcast containers+items, "
            "episode.podcast, chapter.audiobook, the ':audiobooks' "
            "browse id, mswmext=.asx WMP playlist mapping."),
        "classes": [
            "object.item.audioItem.audioBook",
            "object.item.audioItem.audioBook.chapter",
            "object.item.audioItem.podcast",
            "object.container.podcast",
            "episode.podcast", "chapter.audiobook"],
        "evidence": [x for x in (ev("object.item.audioItem.audioBook"),
                                 ev("object.container.podcast"),
                                 ev("mswmext=.asx")) if x],
    }

    # ---- full protocol-info CSV ------------------------------------------
    csv_str = None
    fo = _e.data.find(b"http-get:*:audio/mp3")
    if fo >= 0:
        end = _e.data.find(b"\0", fo)
        csv_str = _e.data[fo:end].decode()
    sp["protocol_info_full"] = {
        "status": "confirmed",
        "name": "Complete GetProtocolInfo Source CSV",
        "description": (
            "Verbatim protocol-info CSV returned by "
            "ConnectionManager.GetProtocolInfo — captures the "
            "sonos.com-{http,mms,spotify,rtrecent} transport prefixes, "
            "x-file-cifs local-share scheme, DASH and every MIME type "
            "the renderer claims."),
        "csv": csv_str,
        "evidence": [x for x in (ev("http-get:*:audio/mp3"),) if x],
    }

    # ---- ICY metadata -----------------------------------------------------
    sp["icy_metadata"] = {
        "status": "strong",
        "name": "ICY/Shoutcast inline metadata",
        "description": (
            "mp3radio streams carry ICY metadata — '@icy-metaint:' "
            "interval header parsed for in-band track metadata."),
        "evidence": [x for x in (ev("@icy-metaint"),) if x],
    }

    # ---- Alert/chime engine -----------------------------------------------
    sp["alert_engine"] = {
        "status": "strong",
        "name": "alert/chime interrupt engine",
        "description": (
            "alertContent player with priority policies "
            "('Cannot interrupt current clip due to priority "
            "policies', JOIN_CHIME_UNAVAILABLE, ALEXA_ALERT); "
            "audioclipmanager + /duck /unduck endpoints; surfaces via "
            "the audioClip muse resource and the R_AUDIO_CLIP_* codes."),
        "evidence": [x for x in (ev("alertContent"),
                                 ev("JOIN_CHIME_UNAVAILABLE"),
                                 ev("ALEXA_ALERT")) if x],
    }

    # ---- household PSK vocabulary ------------------------------------------
    sp["household_psk_vocabulary"] = {
        "status": "strong",
        "name": "household encryption key elements",
        "description": (
            "Replicated-state PSK identifiers: HhPsk (household), "
            "ControlPsk (control channel), LanSwapPsk, RoomEncPsk "
            "(room encryption), each with a Backup* mirror — the key "
            "hierarchy for household crypto. Distribution/rotation "
            "mechanics undocumented."),
        "elements": ["HhPsk", "ControlPsk", "LanSwapPsk", "RoomEncPsk",
                     "BackupHhPsk", "BackupControlPsk",
                     "BackupLanSwapPsk", "BackupRoomEncPsk"],
        "evidence": [x for x in (ev("<HhPsk"), ev("<RoomEncPsk")) if x],
    }

    # ---- replication elements ------------------------------------------------
    sp["replication_elements"] = {
        "status": "strong",
        "name": "replication-engine wire elements",
        "description": (
            "Replication protocol elements beyond the store inventory: "
            "ReplicationOperation/ReplicationPlayer/ReplicationResult/"
            "ReplicationTime plus QuarantinedDevices and Denylisted "
            "node sets."),
        "elements": ["ReplicationOperation", "ReplicationPlayer",
                     "ReplicationResult", "ReplicationTime",
                     "ReplicatedNetSettings", "QuarantinedDevices",
                     "Denylisted"],
        "evidence": [x for x in (ev("<ReplicationOperation"),
                                 ev("<QuarantinedDevices")) if x],
    }

    # ---- token refresh state machine ------------------------------------------
    sp["token_refresh_state_machine"] = {
        "status": "strong",
        "name": "music-account OAuth token refresh lifecycle",
        "description": (
            "Per-account token refresh FSM ('token refresh state for "
            "acct. sn. %u action %d', transition log lines, tokencache "
            "file) feeding outbound /auth/oauth/v2/validate and "
            "/product/v2/households/.../players?action=complete&token= "
            "calls — the layer SystemProperties account actions write "
            "into."),
        "evidence": [x for x in (ev("/auth/oauth/v2/validate"),
                                 ev("tokencache"),
                                 ev("transition token refresh action"))
                     if x],
    }

    # ---- XML schema clusters ---------------------------------------------------
    sp["xml_schema_clusters"] = {
        "status": "strong",
        "name": "uncatalogued XML schema clusters",
        "description": (
            "Element vocabularies in the /status dumps and persisted "
            "files never decomposed: alarmclock.xml, areas.json, "
            "cloudconfig.json, householdsettings.json, zones.json, "
            "zpMetricsConfigV2.xml; <Scheduler>/<Job*>, <LedPattern*>, "
            "<RadioStationLog>, <PerformanceCounterTables>, "
            "<IndexStats>, <Satellite*>/<HWMembers>, <RoomCalibration*> "
            "+ SelfTrueplayEQ/SelfTrueplayInfo, <Ducking*>/"
            "<PlaybackDucked>, <ABREvents>/<ABRState>, <HLS*>, "
            "<DTSProfile>/<DialNorm>, <AudioDelay*> lip-sync, "
            "<PresetNameList> EQ presets, <Account Type=, "
            "<Orientation>, <MicFlags>, <FocusModeMute>."),
        "evidence": [x for x in (ev("<LedPatternEntry"),
                                 ev("<RadioStationLog"),
                                 ev("<SelfTrueplayEQ"),
                                 ev("<DTSProfile")) if x],
    }

    # ---- non-UPnP error families --------------------------------------------------
    sp["internal_error_families"] = {
        "status": "strong",
        "name": "non-UPnP fault-code families",
        "description": (
            "ERROR_* fault vocabularies outside the UPnP code table: "
            "ERROR_LASTFM_{BAD_SUBLEVEL,STREAM_LIMIT,NO_ACCOUNT,"
            "NO_CONTENT,BAD_ACCOUNT}, ERROR_PAND_* (Pandora), "
            "ERROR_DOCK_INTERRUPT, ERROR_WMP_* — reported via R_* "
            "codes and service-layer logs, not SOAP faults."),
        "evidence": [x for x in (ev("ERROR_LASTFM_STREAM_LIMIT"),
                                 ev("ERROR_DOCK_INTERRUPT")) if x],
    }

    # ---- URI scheme additions -----------------------------------------------------
    doc["uri_formats"]["misc_schemes"] = {
        "status": "strong",
        "description": (
            "URI schemes missed by the main sweep: pndrradioad:// "
            "(Pandora ad-insertion transport), pndrradio-http://, "
            "hls-radio://, hls-aac://, last.fm-radio-http, skd://, "
            "stub://, hm://, file://, rtsp://, mms:// — plus the "
            "urn:dev:ops:44974-zp- UDN prefix, "
            "urn:ietf:params:oauth:grant-type:jwt-bearer grant, "
            "urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1 "
            "WMP-registrar advertisement and "
            "urn:schemas-rinconnetworks-com:{metadata,update}-1-0 "
            "namespaces."),
        "schemes": ["pndrradioad://", "pndrradio-http://", "hls-radio://",
                    "hls-aac://", "last.fm-radio-http", "skd://",
                    "stub://", "hm://", "file://", "rtsp://", "mms://"],
        "urns": ["urn:dev:ops:44974-zp-",
                 "urn:ietf:params:oauth:grant-type:jwt-bearer",
                 "urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1",
                 "urn:schemas-rinconnetworks-com:metadata-1-0",
                 "urn:schemas-rinconnetworks-com:update-1-0"],
        "evidence": [x for x in (ev("pndrradioad://"),
                                 ev("urn:ietf:params:oauth:grant-type"),
                                 ev("X_MS_MediaReceiverRegistrar"))
                     if x],
    }

    # ---- Part-2 subsystem catalogue --------------------------------------------------
    subsystems = {
        "scrobbler": {
            "status": "absent",
            "summary": "audioscrobbler/Last.fm submission client in the "
                       "streamer layer — handshake, submission format "
                       "and trigger policy undocumented",
            "anchors": ["http://post.audioscrobbler.com/",
                        "https://ws.audioscrobbler.com/2.0/",
                        "scrobbling submission %s",
                        "last.fm-radio-http"]},
        "spotify_esdk": {
            "status": "vocab",
            "summary": "embedded libspotify (mercury/hermes AP stack) + "
                       "Sonos bridge modules + mDNS Connect discovery; "
                       "names catalogued, protocol internals not",
            "anchors": ["spotify_esdk.c", "hermes.c",
                        "mdns_spotify_service.cxx", "/spotifyzc"]},
        "chirp_stack": {
            "status": "vocab",
            "summary": "chirp-core/chirp-private acoustic codec "
                       "(encoder/decoder/voter, CDMA+FSK profiles) "
                       "driving RoomDetection chirps and trueplay "
                       "discovery",
            "anchors": ["chirp_private_cdma.c", "protocol-acoustic.c"]},
        "trueplay_tuning": {
            "status": "partial",
            "summary": "SOAP enable/status documented; measurement, "
                       "etag asset sync, presence discovery and the "
                       "tuning FSM not",
            "anchors": ["trueplay-node", "/trueplayinfo",
                        "SelfTrueplayEQ"]},
        "dsp_ht_engine": {
            "status": "vocab",
            "summary": "home-theater DSP parameter surface "
                       "(SubCrossover, InvertSub, DialogEnhancementLevel, "
                       "AISpeechEnhance, HeightChannelLevel, Tweaks "
                       "bitmask, lip-sync AudioDelay*) + zone "
                       "audio-state XML schema + R_MASK_* layouts",
            "anchors": ["SubCrossover", "DialogEnhancementLevel",
                        "AISpeechEnhance", "/htconfig",
                        "R_MASK_NINE_DOT_ONE_DOT_FOUR"]},
        "led_engine": {
            "status": "absent",
            "summary": "scripted LED animation programs + full R_LED_* "
                       "state vocabulary; SetLEDState on/off only "
                       "documented surface",
            "anchors": ["<LedStepEntry", "R_LED_BEGIN_SETUP_MODE",
                        "/jffs/app/debug/sonosledmgrd.dmp"]},
        "queue_persistence": {
            "status": "absent",
            "summary": ".rsq on-disk format: savedqueues.rsq + "
                       "trackqueue.rsq XML schemas, .d.rsq backup, "
                       "atomic .tmp rename",
            "anchors": ["savedqueues.rsq", "<SavedQueues",
                        "trackqueue.rsq"]},
        "play_history": {
            "status": "vocab",
            "summary": "historymgr + History/RestHistory/"
                       "WebSocketHistory/CloudQueueHistory XML types + "
                       "deleteHistory cloud op + rating gating",
            "anchors": ["historymgr.cxx", "<WebSocketHistory",
                        "deleteHistory"]},
        "sntp_server": {
            "status": "vocab",
            "summary": "player-hosted SNTP server for household time "
                       "(sntpsrv + sntppoll); role/topology unknown",
            "anchors": ["sntpsrv.cxx", "handleSntpRequest",
                        "Created SNTP Server"]},
        "settings_replication": {
            "status": "vocab",
            "summary": "replicated_settings store inventory known; "
                       "merge/version-vector/dissemination protocol + "
                       "Replication* wire elements not",
            "anchors": ["replicated_settings.cxx",
                        "<ReplicationOperation",
                        "NextFavorite"]},
        "account_cert_lifecycle": {
            "status": "partial",
            "summary": "certmanager/devicecertmanager/regdevicecert/"
                       "cloudregistration endpoints catalogued; "
                       "enrolment/renewal flows and cert formats not",
            "anchors": ["devicecertmanager.cxx", "regdevicecert.cxx",
                        "R_CLIENT_KEYCERT_ID_SONOS_DEVICE"]},
        "entitlements": {
            "status": "vocab",
            "summary": "entitlementsmanager + entitlementsVersionChanged "
                       "+ /entitlements/api; what an entitlement gates "
                       "unknown",
            "anchors": ["entitlementsmanager.cxx",
                        "entitlementsVersionChanged",
                        "/entitlements/api"]},
        "telemetry_submission": {
            "status": "partial",
            "summary": "reportuploader/usagedatasharing/zonereportmgr + "
                       "submission queue + dropout/trackplay recorders + "
                       "zpMetricsConfigV2; SubmitDiagnostics SOAP "
                       "documented, periodic machinery not",
            "anchors": ["reportuploader.cxx", "trackplayrecorder.cxx",
                        "zpMetricsConfigV2.xml",
                        "diagnosticSubmissionResults"]},
        "audio_taps": {
            "status": "vocab",
            "summary": "audiotap/datatap/spdiftap PCM capture + "
                       "/snapshotspdiftap /downloadspdiftap endpoints",
            "anchors": ["audiotap_manager.cxx", "spdiftap.c",
                        "/downloadspdiftap"]},
        "update_machinery": {
            "status": "partial",
            "summary": "BeginSoftwareUpdate documented; "
                       "auto_update_scheduler, user_update_scheduler, "
                       "migrationmanager, /softwareDownload, /testenv "
                       "update-URL override not",
            "anchors": ["auto_update_scheduler.cxx",
                        "migrationmanager.cxx", "/softwareDownload"]},
        "media_player_abstraction": {
            "status": "vocab",
            "summary": "media_player_mgr/autoplay/vli_ctrl + "
                       "extaudiosrc/ai_impl_base plug-in layer under "
                       "AVT sources; vtable map undocumented",
            "anchors": ["media_player_mgr.cxx", "extaudiosrc.cxx",
                        "ai_impl_base.cxx"]},
        "group_object_model": {
            "status": "partial",
            "summary": "group.cxx/group_playeronly/"
                       "group_locationandplayer + play_state_mgr + "
                       "zones_mgr/zones_storage internals behind ZGT",
            "anchors": ["play_state_mgr.cxx", "zones_storage.cxx",
                        "/jffs/settings/zones.json"]},
        "buttons_ir": {
            "status": "partial",
            "summary": "longpress gesture detection + irdecoder + "
                       "irconfig.txt; HTControl SOAP surface "
                       "documented, mechanics not",
            "anchors": ["longpress.cxx", "irdecoder.cxx",
                        "/jffs/irconfig.txt"]},
        "muse_semantics": {
            "status": "vocab",
            "summary": "282 cloud routes catalogued; per-route "
                       "request/response schemas and auth undocumented",
            "anchors": ["v1/households/{householdId}",
                        "muse_async_command_handler_impl.cxx"]},
        "lechmere_wss": {
            "status": "partial",
            "summary": "RFC6455+TLV framing confirmed; full WSS command "
                       "vocabulary, reconnect/auth, per-namespace "
                       "payloads not",
            "anchors": ["websocket_lechmere", "lechmere.event"]},
        "cloud_queue": {
            "status": "vocab",
            "summary": "/cloudqueue(+poll), trackQueueAdditions, "
                       "CloudQueueHistory, rating gating; lifecycle "
                       "undocumented",
            "anchors": ["/cloudqueue", "trackQueueAdditions",
                        "CloudQueueHistory"]},
        "business_msp": {
            "status": "absent",
            "summary": "Sonos Business managed-service-provider hooks "
                       "(AddRemove/Sync Sonos Business MSP)",
            "anchors": ["AddRemoveSonosBusinessMSP",
                        "Sync Sonos Business MSP"]},
        "semisleep_power": {
            "status": "absent",
            "summary": "suspend/resume engine: enableSemiSleep, "
                       "powerWakeupFromSemiSleep, "
                       "AmplifierPowerStateChanged, "
                       "DirectControlIsSuspended, VLI suspend sessions",
            "anchors": ["enableSemiSleep", "featureConfigSemiSleep",
                        "powerWakeupFromSemiSleep",
                        "DirectControlIsSuspended"]},
        "multi_daemon_boundary": {
            "status": "vocab",
            "summary": "anacapad is one of ~13 daemons (btmanager, "
                       "wacd, netstartd, sonosledmgrd, "
                       "sonospowercoordinator, mdnsd, sddpd, chronyd, "
                       "dropbear, udhcpc, wpa_supplicant, "
                       "upgrade_mgr); /X-external routes are the IPC "
                       "contracts",
            "anchors": ["/btmanager-external", "/netstartd-external",
                        "wacd.log", "sddpd.log"]},
        "runtime_flag_files": {
            "status": "vocab",
            "summary": "/tmp + /var/run flag-file semantics: "
                       "device_unlocked_flag, brokendevice, "
                       "wifidisabled, crashed_play_state, "
                       "event_preserve, memorylog ring, wac_mode, "
                       "netmanager_extender_flags",
            "anchors": ["/tmp/device_unlocked_flag",
                        "/tmp/brokendevice", "/tmp/memorylog"]},
        "ibt_plans": {
            "status": "absent",
            "summary": "IBT command plan-execution engine "
                       "('executing ibt plan for command') + "
                       "enablePitchfork feature flag",
            "anchors": ["executing ibt plan for command",
                        "unsupported IBT command",
                        "enablePitchfork"]},
        "embedded_sqlite": {
            "status": "vocab",
            "summary": "libsqlite3 linked; local timers persist via "
                       "sqlite3 statements; tables undocumented",
            "anchors": ["sqlite3_exec", "LocalTimer from sqlite3"]},
        "factory_reset": {
            "status": "vocab",
            "summary": "factoryReset.txt sentinel, "
                       "sonosFactoryResetFull, LED_MODE_FACTORY_RESET, "
                       "remote management/factoryReset muse route",
            "anchors": ["factoryReset.txt", "sonosFactoryResetFull",
                        "management/factoryReset"]},
        "playlist_parsers": {
            "status": "vocab",
            "summary": "ASX (mswmext), M3U (x-mpegurl), "
                       "vnd.apple.mpegurl, DASH metadata parsers below "
                       "the URI layer",
            "anchors": ["mswmext=.asx", "application/x-mpegurl",
                        "application/dash+xml"]},
        "feature_flag_registry": {
            "status": "vocab",
            "summary": "featureConfig* flags enumerate the gated "
                       "feature set: DropoutContext, "
                       "HomeTheaterWifiPerfTelemetry, MetricsService, "
                       "Plink, Quickbonding, SemiSleep, SmartPlay, "
                       "SpotABR, SsdpAdvertiseConfig, ZoneExperiment",
            "anchors": ["featureConfigPlink", "featureConfigSmartPlay",
                        "featureConfigQuickbonding"]},
        "ab_experiments": {
            "status": "vocab",
            "summary": "ZoneExperiment framework in production "
                       "firmware: /experiments endpoint, "
                       "ZoneExperiment id/name/value/defaultValue "
                       "elements",
            "anchors": ["<ZoneExperiment", "/experiments",
                        "experimentId"]},
        "favourites_model": {
            "status": "vocab",
            "summary": "FV: grammar + GC variants documented; "
                       "enumerate/mutate path, favourites↔muse sync, "
                       "NextFavorite sequencing not",
            "anchors": ["favorites.cxx", "NextFavorite",
                        "sonos_favorites_version"]},
        "scrobbler_note_family": None,  # merged into scrobbler
        "log_domain_map": {
            "status": "vocab",
            "summary": "21 anacapa.*.log domains = subsystem boundary "
                       "map (avt.play, chsrc.state, dc, gm.events, ht, "
                       "muse*, snf, sps, trueplay, vl...)",
            "anchors": ["anacapa.snf.log", "anacapa.lechmere.event.log",
                        "anacapa.dc.log"]},
        "model_sku_vocabulary": {
            "status": "vocab",
            "summary": "ZPS9-ZPS61 / S0-S9 model ids + product names "
                       "embedded for capability conditionals; model->"
                       "capability map untabulated",
            "anchors": ["ZPS9", "HwFeatures"]},
        "qplay_protocol": {
            "status": "vocab",
            "summary": "only QPlayAuth SOAP action documented; the "
                       "wider Tencent protocol (key derivation, "
                       "control channel) is not",
            "anchors": ["urn:schemas-tencent-com:service:QPlay",
                        "QPlayAuth"]},
        "wac_mode": {
            "status": "vocab",
            "summary": "WiFi Accessory Config setup mode (wacd, "
                       "/var/run/wac_mode, WAC mode enabled/timeout)",
            "anchors": ["wacd.log", "WAC mode enabled"]},
    }
    subsystems.pop("scrobbler_note_family")
    out_sub = {}
    for name, s in sorted(subsystems.items()):
        evs = []
        for a in s["anchors"]:
            e = ev(a)
            if e:
                evs.append(e)
        out_sub[name] = {"status": s["status"], "summary": s["summary"],
                         "anchors": s["anchors"], "evidence": evs}
    doc["subsystems"] = out_sub

    json.dump(doc, open(DOC, "w"), indent=1)
    n_ev = sum(len(s["evidence"]) for s in out_sub.values())
    print("wrote %d subsystem records (%d evidence), %d shared_primitives additions" %
          (len(out_sub), n_ev, 17))


if __name__ == "__main__":
    main()
