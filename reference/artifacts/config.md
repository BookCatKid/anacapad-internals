# Artifacts: Configuration files

Settings files that ship inside the firmware image itself. They set defaults and behaviors before anything personal is added: how the web server listens, how logs are recorded, which radio setups are allowed, and which background measurements are on.

::: details Technical details

Static defaults under /opt/conf, /opt/ir, /opt/dsp, /opt/localsettings and /etc; runtime state that changes later lives separately under the writable /jffs partition.

:::

### `LEGACYCOMPATVER`

The legacy-compatibility marker: how far back this firmware can interoperate with very old players still in a household.

[View](/files/LEGACYCOMPATVER) · [Download](/files/LEGACYCOMPATVER) · 11 B

::: details Preview

First 1 of 1 lines:

```
58.0-00000
```

:::

::: details Technical details

- **Path in image:** `/LEGACYCOMPATVER`
- **Category:** config
- **Size:** 11 B (11 bytes)
- **SHA-256:** `ee22aa9ca28edb870170c612a3ef59ea2cb063c8c2816994e986aae308c67c69`

Compatibility marker for mixed-era households; checked during update rollout decisions alongside MINCOMPATVER.


:::

### `MINCOMPATVER`

The minimum compatible version marker: the oldest software version this image is willing to coexist with. It is one of the numbers that decides whether an update is allowed to proceed.

[View](/files/MINCOMPATVER) · [Download](/files/MINCOMPATVER) · 11 B

::: details Preview

First 1 of 1 lines:

```
85.0-00000
```

:::

::: details Technical details

- **Path in image:** `/MINCOMPATVER`
- **Category:** config
- **Size:** 11 B (11 bytes)
- **SHA-256:** `41915dcb2732e231c1106044676f9225ac6040164dd713f291fcc9f92f18c848`

Compatibility floor consumed by the update machinery (the 'minimum auto-update version' logic in update_machinery).


:::

### `VERSION`

The plain version stamp of the firmware image, the file the update machinery and the system read to know what release is installed.

[View](/files/VERSION) · [Download](/files/VERSION) · 12 B

::: details Preview

First 1 of 1 lines:

```
86.10-80260
```

:::

::: details Technical details

- **Path in image:** `/VERSION`
- **Category:** config
- **Size:** 12 B (12 bytes)
- **SHA-256:** `e8bdcaec2e1a5cf440f834ca2058e09221e4a5ef52877868dfba438840eab71d`

Top-level version marker for the squashfs image; pairs with MINCOMPATVER and LEGACYCOMPATVER in update compatibility checks.


:::

### `build.properties`

The birth certificate of this exact firmware build: when it was compiled, on which machine, from which source revision, in release mode. It answers 'exactly which build is this' better than any version number alone.

[View](/files/build.properties) · [Download](/files/build.properties) · 806 B

::: details Preview

First 20 of 20 lines:

```
build.version = 86.10-80260
build.date = 2026-08-26 17:51:31.641146
build.host = aws-jammy-sec-26
build.type = release
build.sysinfo = Linux aws-jammy-sec-26 6.8.0-1063-aws #66~22.04.1-Ubuntu SMP Fri Aug  7 17:45:18 UTC 2026 x86_64 x86_64
build.arch.type = limelight
build.docker = False
build.os.info = Ubuntu 22.04.5 LTS
build.locked = True
build.scm.path = N/A
build.scm.type = git
build.git.remote = git@github.com:Sonos-Inc/pdsw-sonos-controller-player-s2.git
build.git.branch = release/main_alt_release
build.github.url = git@github.com:Sonos-Inc/pdsw-sonos-controller-player-s2/commit/a78cd9a393d
build.git.dirty = False
build.scm.version = a78cd9a393d
build.source.date.epoch = 1787772128
build.strings.remote = SWPBL-250456
build.strings.branch = SWPBL-250456
build.strings.version = SWPBL-250456
```

:::

::: details Technical details

- **Path in image:** `/build.properties`
- **Category:** config
- **Size:** 806 B (806 bytes)
- **SHA-256:** `693983d6e86275f5a2a34c589306733a3c214f9375e49c368626d57f7b483eb7`

Build metadata recorded at compile time: build 86.10-80260 dated 2026-08-26, limelight (Playbar) target, release type, git revision a78cd9a393d on branch release/main_alt_release of the Sonos-internal player repo.


:::

### `chrony.conf`

The time-sync configuration: which time servers the speaker asks for the correct clock. Accurate shared time is what keeps rooms playing in perfect sync, so this file quietly matters a lot.

[View](/files/etc/chrony.conf) · [Download](/files/etc/chrony.conf) · 915 B

::: details Preview

First 24 of 24 lines:

```
# Resolve multiple server addresses for each Sonos NTP pool name.
# Permit initial burst polling of newly used NTP servers.
# Once a server in a given pool has responded, stop polling
# the remaining servers in that pool.
pool 0.sonostime.pool.ntp.org iburst maxsources 1
pool 1.sonostime.pool.ntp.org iburst maxsources 1
pool 2.sonostime.pool.ntp.org iburst maxsources 1
pool 3.sonostime.pool.ntp.org iburst maxsources 1

# This file keeps track of how the system clock tends to drift relative to true time.
driftfile /jffs/chrony/chrony.drift

# These logs are for debugging.
log tracking rawmeasurements statistics
logdir /var/log/chrony

# Permit chrony to step the clock up to once per operation,
# only if the detected error is in excess of 60 seconds.
makestep 60 1
maxchange 60 1 0

# Disable NTP serving to prevent NTP requests from reaching chronyd
# (this can help prevent DoS attacks on chronyd)
port 0
```

:::

::: details Technical details

- **Path in image:** `/etc/chrony.conf`
- **Category:** config
- **Size:** 915 B (915 bytes)
- **SHA-256:** `6245ff35b9e68a1d8738dcc430bc8b28e53efaa0c9a834010fde3c72fcc32789`

chronyd client config pointing at Sonos's *.sonostime.pool.ntp.org pool; drift state lands in /jffs/chrony/chrony.drift.


:::

### `host.conf`

A small resolver rulebook: the order in which the speaker tries to turn names into addresses, such as checking its local hosts file before asking the network's name service.

[View](/files/etc/host.conf) · [Download](/files/etc/host.conf) · 26 B

::: details Preview

First 2 of 2 lines:

```
order hosts,bind
multi on
```

:::

::: details Technical details

- **Path in image:** `/etc/host.conf`
- **Category:** config
- **Size:** 26 B (26 bytes)
- **SHA-256:** `83b331f98a128e1721c54be5c07bd38ad0d146e89cdecbe0eb53cbc23ff6b86a`

Standard glibc resolver order file (hosts before DNS).


:::

### `nsswitch.conf`

The name-service switch table: the classic Unix file deciding where the system looks up things like user names, hosts, and networks, and in what order.

[View](/files/etc/nsswitch.conf) · [Download](/files/etc/nsswitch.conf) · 452 B

::: details Preview

First 19 of 19 lines:

```
# /etc/nsswitch.conf
#
# Example configuration of GNU Name Service Switch functionality.
# If you have the `glibc-doc' and `info' packages installed, try:
# `info libc "Name Service Switch"' for information about this file.

passwd:         files
group:          files
shadow:         files

hosts:          files dns
networks:       files

protocols:      files
services:       files
ethers:         files
rpc:            files

netgroup:       files
```

:::

::: details Technical details

- **Path in image:** `/etc/nsswitch.conf`
- **Category:** config
- **Size:** 452 B (452 bytes)
- **SHA-256:** `5c24de7911e2eab827332ff98c40aa79f951b951c3106940ac049bdee7d083cc`

Standard NSS configuration; controls which sources answer name lookups.


:::

### `sddpd.conf`

Configuration for the device-announcement daemon, the component that keeps re-broadcasting 'here I am' so your speakers and apps keep finding each other on the network.

[View](/files/etc/sddpd.conf) · [Download](/files/etc/sddpd.conf) · 644 B

::: details Preview

First 14 of 14 lines:

```
; The Search type/Namespace of device
Type = sonos:Zoneplayer
; The primary proxy type.  This must match the OnlineCategory specified in the referenced Driver
PrimaryProxy = media_service
; All proxies implemented by the referenced Driver
Proxies = media_service,amplifier
; The manufacturer of the device.  This must match the manufacturer specified in the referenced Driver
Manufacturer = Sonos
; The model of the device.  This should match the model specified in the referenced driver
Model = Zoneplayer
; The driver file name that is used on the online driver database
Driver = sonos.c4z
; The anouncement interval in seconds
MaxAge = 1800
```

:::

::: details Technical details

- **Path in image:** `/etc/sddpd.conf`
- **Category:** config
- **Size:** 644 B (644 bytes)
- **SHA-256:** `7f5c87bfb326d7fa91e28cf30f5696c2e4c6b789d71f9695d7486ca55029d204`

Config for the sddpd sibling daemon (Sonos's device-announcement layer); a development override exists at /jffs/dev_sddp.conf.


:::

### `syslog.conf`

The routing table for system log messages: which kind of message goes to which log file, used by the classic system logger outside the main program.

[View](/files/etc/syslog.conf) · [Download](/files/etc/syslog.conf) · 1.6 KB

::: details Preview

First 60 of 71 lines:

```
#  /etc/syslog.conf	Configuration file for syslogd.
#
#			For more information see syslog.conf(5)
#			manpage.

#
# First some standard logfiles.  Log by facility.
#

auth,authpriv.*			/var/log/auth.log
*.*;auth,authpriv.none		-/var/log/syslog
#cron.*				/var/log/cron.log
daemon.*			-/var/log/daemon.log
kern.*				-/var/log/kern.log
lpr.*				-/var/log/lpr.log
mail.*				/var/log/mail.log
user.*				-/var/log/user.log
uucp.*				-/var/log/uucp.log

#
# Logging for the mail system. Split it up so that
# it is easy to write scripts to parse these files.
#
mail.info			-/var/log/mail.info
mail.warn			-/var/log/mail.warn
mail.err			/var/log/mail.err

# Logging for INN news system
#
#news.crit			/var/log/news/news.crit
#news.err			/var/log/news/news.err
#news.notice			-/var/log/news/news.notice

#
# Some `catch-all' logfiles.
#
*.=debug;\
	auth,authpriv.none;\
	news.none;mail.none	-/var/log/debug
*.=info;*.=notice;*.=warn;\
	auth,authpriv.none;\
	cron,daemon.none;\
	mail,news.none		-/var/log/messages

#
# Emergencies are sent to everybody logged in.
#
*.emerg				*

#
# I like to have messages displayed on the console, but only on a virtual
# console I usually leave idle.
#
#daemon,mail.*;\
#	news.=crit;news.=err;news.=notice;\
#	*.=debug;*.=info;\
#	*.=notice;*.=warn	/dev/tty8

# The named pipe /dev/xconsole is for the `xconsole' utility.  To use it,
# you must invoke `xconsole' with the `-file' option:
```

:::

::: details Technical details

- **Path in image:** `/etc/syslog.conf`
- **Category:** config
- **Size:** 1.6 KB (1670 bytes)
- **SHA-256:** `0141a530669a95b7c8eb63b29e74b136660fa8d989d8b394acaa78e71483fcda`

syslogd routing rules for kernel/daemon messages outside anacapad's own logger framework.


:::

### `anacapa.conf`

The main configuration file for the player software itself: which ports the web server listens on, which features and directories it uses, and the base settings the program reads at launch. Port 1400 for the status website is defined here.

[View](/files/opt/conf/anacapa.conf) · [Download](/files/opt/conf/anacapa.conf) · 2.7 KB

::: details Preview

First 60 of 84 lines:

```
# Anacapa Web Server configuration file

# Server TCP Port for HTTP operation
Port 1400

# Port for HTTPS traffic (0 for disabled)
SSLPort 1443

# Port for HTTPS traffic for household members only (0 for disabled)
SecureHHSSLPort 1843

# The Server Root (UNIX systems style)
ServerRoot /opt

# The Path option specifies the web files path.
Path htdocs

# The Default option contains the name of the files the server should
# look for when only a path is given (e.g. http://myserver/info/).
Default index.html

# The TimeOut option tells the server how much seconds to wait for
# an idle connection before closing it.
TimeOut 10

# The MimeTypes option specifies the location of the file
# containing the mapping of MIME types and files extensions
MimeTypes conf/mime.types

# The path of the diagnostic file
DiagFile log/anacapa.trace

# The default max level for diagnostics logged to DiagFile
DiagLevel default=1

# Max_Conn is the maximum number of simultaneous connections
# This should be greater than NumThreads to support persistent
# connections.  The difference is the number of simultaneous
# persistent connections supported.
MaxConn 36

# NumThreads is the number of anacapa worker threads.
# Previously this was equal to MaxConn but now MaxConn needs to be
# greater than NumThreads to support persistent connections
NumThreads 4

# The file where the pid of the server is logged (UNIX specific)
PidFile log/anacapa.pid

# Rincon-specific configuration settings
# JFFSRoot 
# ZPMusicServicesBackstop ../../../../cc/anacapa/anacapa/pkg/htdocs/xml/musicservices.xml
# ZPTimeZonesBackstop ../../../../cc/anacapa/anacapa/pkg/htdocs/xml/timezones.xml
ContinueAfterIPChange true

# Special Logging for direct control
DiagFile log/anacapa.dc.trace
DiagLevel main=0,muse=3,cloudqueue=3,spot=3,spot_abr=3,spot_q=3,spot_hal=3,museauth=2
DiagMin 16384
DiagMax 32768
```

:::

::: details Technical details

- **Path in image:** `/opt/conf/anacapa.conf`
- **Category:** config
- **Size:** 2.7 KB (2793 bytes)
- **SHA-256:** `2327552e496415e9fc97e8f9d8cc8e4deb881b00dade0a642d16e61c206e6b3b`

Central config consumed at anacapad startup: web listener ports (1400 HTTP / 1443 HTTPS / 1843 household TLS), paths, and feature flags. Some values get overridden by files in the writable /jffs/conf directory.


:::

### `anacapa_logger.toml`

The logging configuration for the main player software: which subsystem writes which log file, how chatty each one is allowed to be, and where the logs land on disk. The 21 log channels described in the subsystems page map onto the rules in this file.

[View](/files/opt/conf/anacapa_logger.toml) · [Download](/files/opt/conf/anacapa_logger.toml) · 4.9 KB

::: details Preview

First 60 of 188 lines:

```
# This is a TOML configuration document
#
title = "Anacapa logger configuration"

# SONOS_LOG_EMERGENCY = 0, /**< the system is unusable */
# SONOS_LOG_ALERT = 1, /**< an action must be taken immediately else system is likely to become unusable */
# SONOS_LOG_CRIT  = 2, /**< critical conditions */
# SONOS_LOG_ERR   = 3, /**< error conditions */
# SONOS_LOG_WARN  = 4, /**< warning conditions */
# SONOS_LOG_NOTE  = 5, /**< notify about normal but significant condition */
# SONOS_LOG_INFO  = 6, /**< informational */
# SONOS_LOG_DEBUG = 7, /**< debug */
# SONOS_LOG_DBG_1 = 8, /**< beginning of the extra debug messages range */
# SONOS_LOG_DBG_2 = 9,
# SONOS_LOG_DBG_3 = 10,
# SONOS_LOG_DBG_4 = 11, /**< end of the extra debug messages range */

# Each section defines one log destination
# defaultLevel = -1 means no default logging for this destination
# default backup location: /jffs/app/log

# Main logging for anacapa
[[FILE]]
name = "anacapa.log"
fileSize = 262144
preserveSize = 65536
defaultLevel = 4
backup = true
filter = {}

### additional destinations ###

# Special Logging for direct control
[[FILE]]
name = "anacapa.dc.log"
fileSize = 65536
preserveSize = 16384
defaultLevel = -1
filter = {main=3,muse=6,museauth=6,muse_token_service=6,cloudqueue=6,spot=6,spot_abr=6,spot_q=6,spot_hal=6,cb=6}

# Special Logging for Muse Command and Response Messages
[[FILE]]
name = "anacapa.musecmdandrsp.log"
fileSize = 65336
preserveSize = 60000
defaultLevel = -1
filter = {muselogcmd=7, muselogrsp=7}

# Special Logging for Muse debug statistics
[[FILE]]
name = "anacapa.musedebug.log"
fileSize = 65536
preserveSize = 16384
defaultLevel = -1
filter = {muse_debug=7,museperf=6}

# Special Logging for Muse Event Messages
[[FILE]]
name = "anacapa.museevt.log"
fileSize = 16384
```

:::

::: details Technical details

- **Path in image:** `/opt/conf/anacapa_logger.toml`
- **Category:** config
- **Size:** 4.9 KB (4975 bytes)
- **SHA-256:** `4d2f14b7baa47e7fb3a33d0ec7b820bb84d018187329ec4d268e5e8f42a89eee`

TOML logger config for anacapad; defines per-domain sinks and severities. The domain list inside is effectively a module map of the program.


:::

### `mime.types`

The web server's file-type table: it lets the built-in web server label each file it serves with the right content type so browsers handle them correctly.

[View](/files/opt/conf/mime.types) · [Download](/files/opt/conf/mime.types) · 140 B

::: details Preview

First 8 of 8 lines:

```
# MIME type			Extension
text/html			htm
text/html			html
text/xml			xml
text/xml			xsl
text/css			css
text/javascript			js
image/png			png 
```

:::

::: details Technical details

- **Path in image:** `/opt/conf/mime.types`
- **Category:** config
- **Size:** 140 B (140 bytes)
- **SHA-256:** `c9f310db9fc13a8f9a59a717e3c37f337aac5620d10480046d2259b9da5b3742`

Standard MIME map read by the embedded HTTP server when serving static files and status pages.


:::

### `sonosledmgrd_logger.toml`

The logging configuration for the LED manager daemon, the small helper program that owns the speaker's status light. Same idea as the main logger config, but for the light show.

[View](/files/opt/conf/sonosledmgrd_logger.toml) · [Download](/files/opt/conf/sonosledmgrd_logger.toml) · 1.0 KB

::: details Preview

First 27 of 27 lines:

```
# This is a TOML configuration document
#
title = "Sonos LED Manager server logger configuration"

# SONOS_LOG_EMERGENCY = 0, /**< the system is unusable */
# SONOS_LOG_ALERT = 1, /**< an action must be taken immediately else system is likely to become unusable */
# SONOS_LOG_CRIT  = 2, /**< critical conditions */
# SONOS_LOG_ERR   = 3, /**< error conditions */
# SONOS_LOG_WARN  = 4, /**< warning conditions */
# SONOS_LOG_NOTE  = 5, /**< notify about normal but significant condition */
# SONOS_LOG_INFO  = 6, /**< informational */
# SONOS_LOG_DEBUG = 7, /**< debug */
# SONOS_LOG_DBG_1 = 8, /**< beginning of the extra debug messages range */
# SONOS_LOG_DBG_2 = 9,
# SONOS_LOG_DBG_3 = 10,
# SONOS_LOG_DBG_4 = 11, /**< end of the extra debug messages range */

# Each section defines one log destination
# defaultLevel = -1 means no default logging for this destination

# Main logging
[[FILE]]
name = "sonosledmgrd.log"
fileSize = 262144
preserveSize = 65536
defaultLevel = 4
filter = {ledmgrd=6,LEDManager=6,ledmgr-server=6,leds_zp=6}
```

:::

::: details Technical details

- **Path in image:** `/opt/conf/sonosledmgrd_logger.toml`
- **Category:** config
- **Size:** 1.0 KB (1042 bytes)
- **SHA-256:** `6dc66acb328836dd2139ffa4c12003fb493954614c4b03c8983eeff2cc81fd1d`

TOML logger config for the sonosledmgrd sibling daemon; controls its /opt/log output.


:::

### `v1_auth_offline_policy_guest.json`

The offline permission list for the guest role: the rules for what a guest or unauthenticated visitor on your network may call when the speaker cannot reach Sonos's servers to ask. Even with no internet, the player still enforces who is allowed to do what.

[View](/files/opt/conf/v1_auth_offline_policy_guest.json) · [Download](/files/opt/conf/v1_auth_offline_policy_guest.json) · 2.0 KB

::: details Preview

First 1 of 1 lines:

```
{"name":"GUEST","version":1,"permissions":[{"ns":"alarms","perm":5},{"ns":"areas","perm":1},{"ns":"audioClip","perm":3},{"ns":"authorization","perm":5},{"ns":"clientStatus","perm":3},{"ns":"devices","perm":1},{"ns":"devicesExtended","perm":1},{"ns":"diagnostics","perm":7},{"ns":"effectiveSettings","perm":97},{"ns":"entitlements","perm":1},{"ns":"favorites","perm":5},{"ns":"groups","perm":3},{"ns":"groupVolume","perm":3},{"ns":"hardwareStatus","perm":37},{"ns":"hdmi","perm":1},{"ns":"history","perm":3},{"ns":"homeTheater","perm":3},{"ns":"households","perm":1},{"ns":"info","perm":1},{"ns":"ircontrol","perm":1},{"ns":"localContentLibrary","perm":1},{"ns":"musicServiceAccounts","perm":3},{"ns":"pinewood","perm":3},{"ns":"playback","perm":3},{"ns":"playbackExtended","perm":1},{"ns":"playbackMetadata","perm":3},{"ns":"playbackSession","perm":15},{"ns":"playerVolume","perm":3},{"ns":"playlists","perm":5},{"ns":"power","perm":3},{"ns":"roomDetection","perm":3},{"ns":"settings","perm":97},{"ns":"settings:playerBasic","perm":4},{"ns":"settings:playerLineIn","perm":4},{"ns":"settings:playerUI","perm":13},{"ns":"settings:security","perm":1},{"ns":"sleepTimer","perm":3},{"ns":"smartplay","perm":3},{"ns":"soundSwap","perm":2},{"ns":"systemReporting","perm":1},{"ns":"systemTime","perm":1},{"ns":"time","perm":1},{"ns":"timers","perm":3},{"ns":"trueplay","perm":3},{"ns":"trueroom","perm":1},{"ns":"update","perm":1},{"ns":"upnpAlarmClock","perm":3},{"ns":"upnpAudioIn","perm":3},{"ns":"upnpAVTransport","perm":3},{"ns":"upnpConnectionManager","perm":3},{"ns":"upnpContentDirectory","perm":3},{"ns":"upnpDeviceProperties","perm":3},{"ns":"upnpGroupManagement","perm":3},{"ns":"upnpGroupRenderingControl","perm":3},{"ns":"upnpHTControl","perm":3},{"ns":"upnpMusicServices","perm":3},{"ns":"upnpQueue","perm":3},{"ns":"upnpRenderingControl","perm":3},{"ns":"upnpSystemProperties","perm":3},{"ns":"upnpVirtualLineIn","perm":3},{"ns":"upnpZoneGroupTopology","perm":3},{"ns":"virtualLineIn","perm":3},{"ns":"virtualRemoteControl","perm":3},{"ns":"voice","perm":1},{"ns":"zones","perm":7}]}
```

:::

::: details Technical details

- **Path in image:** `/opt/conf/v1_auth_offline_policy_guest.json`
- **Category:** config
- **Size:** 2.0 KB (2090 bytes)
- **SHA-256:** `4006046d5b8375a6b174af5ea402152dc42d066a8cd6de55a770401a3c664035`

v1 API authorization policy for the guest role, applied when the authz backend is unreachable (offline fallback). Defines the resource/verb whitelist enforced by the authz stage.


:::

### `v1_auth_offline_policy_owner.json`

The offline permission list for the owner role: the rules for what the household owner's apps and controllers may call when the speaker cannot reach Sonos's servers to ask. Even with no internet, the player still enforces who is allowed to do what.

[View](/files/opt/conf/v1_auth_offline_policy_owner.json) · [Download](/files/opt/conf/v1_auth_offline_policy_owner.json) · 2.5 KB

::: details Preview

First 1 of 1 lines:

```
{"name":"OWNER","version":1,"permissions":[{"ns":"alarms","perm":7},{"ns":"areas","perm":3},{"ns":"audioClip","perm":3},{"ns":"authorization","perm":15},{"ns":"catalog","perm":1},{"ns":"clientStatus","perm":3},{"ns":"devices","perm":15},{"ns":"devicesExtended","perm":3},{"ns":"diagnostics","perm":7},{"ns":"effectiveSettings","perm":99},{"ns":"entitlements","perm":3},{"ns":"favorites","perm":7},{"ns":"global","perm":3},{"ns":"groups","perm":3},{"ns":"groupVolume","perm":3},{"ns":"hardwareStatus","perm":127},{"ns":"hdmi","perm":3},{"ns":"history","perm":3},{"ns":"homeTheater","perm":7},{"ns":"households","perm":3},{"ns":"householdUpdate","perm":3},{"ns":"info","perm":3},{"ns":"ircontrol","perm":3},{"ns":"liveActivities","perm":3},{"ns":"localContentLibrary","perm":7},{"ns":"management","perm":7},{"ns":"musicServiceAccounts","perm":7},{"ns":"networkTest","perm":6},{"ns":"pinewood","perm":3},{"ns":"platformInternal","perm":7},{"ns":"playback","perm":7},{"ns":"playbackExtended","perm":3},{"ns":"playbackMetadata","perm":3},{"ns":"playbackSession","perm":31},{"ns":"playerVolume","perm":3},{"ns":"playlists","perm":7},{"ns":"positioning","perm":3},{"ns":"power","perm":3},{"ns":"roomDetection","perm":3},{"ns":"settings","perm":127},{"ns":"settings:business","perm":3},{"ns":"settings:frontierLlms","perm":7},{"ns":"settings:global","perm":3},{"ns":"settings:playback","perm":7},{"ns":"settings:playerBasic","perm":15},{"ns":"settings:playerLineIn","perm":15},{"ns":"settings:playerUI","perm":15},{"ns":"settings:preferences","perm":3},{"ns":"settings:proDashboard","perm":3},{"ns":"settings:security","perm":7},{"ns":"sleepTimer","perm":3},{"ns":"smartplay","perm":3},{"ns":"soundSwap","perm":3},{"ns":"svc","perm":3},{"ns":"systemReporting","perm":1},{"ns":"systemTime","perm":3},{"ns":"timers","perm":3},{"ns":"topology","perm":3},{"ns":"trueplay","perm":3},{"ns":"trueroom","perm":3},{"ns":"update","perm":3},{"ns":"upnpAlarmClock","perm":3},{"ns":"upnpAudioIn","perm":3},{"ns":"upnpAVTransport","perm":3},{"ns":"upnpConnectionManager","perm":3},{"ns":"upnpContentDirectory","perm":3},{"ns":"upnpDeviceProperties","perm":3},{"ns":"upnpGroupManagement","perm":3},{"ns":"upnpGroupRenderingControl","perm":3},{"ns":"upnpHTControl","perm":3},{"ns":"upnpMusicServices","perm":3},{"ns":"upnpQueue","perm":3},{"ns":"upnpRenderingControl","perm":3},{"ns":"upnpSystemProperties","perm":3},{"ns":"upnpVirtualLineIn","perm":3},{"ns":"upnpZoneGroupTopology","perm":3},{"ns":"virtualLineIn","perm":3},{"ns":"virtualRemoteControl","perm":3},{"ns":"voice","perm":15},{"ns":"zones","perm":15}]}
```

:::

::: details Technical details

- **Path in image:** `/opt/conf/v1_auth_offline_policy_owner.json`
- **Category:** config
- **Size:** 2.5 KB (2591 bytes)
- **SHA-256:** `52aec9a38aa1dce27aa7c1215cdf24ab7a5ee67c89da6e0501bc144d3431b4f4`

v1 API authorization policy for the owner role, applied when the authz backend is unreachable (offline fallback). Defines the resource/verb whitelist enforced by the authz stage.


:::

### `v1_auth_offline_policy_p2p.json`

The offline permission list for the peer-to-peer role: the rules for what other players in your household may call on each other when the speaker cannot reach Sonos's servers to ask. Even with no internet, the player still enforces who is allowed to do what.

[View](/files/opt/conf/v1_auth_offline_policy_p2p.json) · [Download](/files/opt/conf/v1_auth_offline_policy_p2p.json) · 2.0 KB

::: details Preview

First 1 of 1 lines:

```
{"name":"P2P","version":1,"permissions":[{"ns":"areas","perm":1},{"ns":"audioClip","perm":3},{"ns":"authorization","perm":3},{"ns":"clientStatus","perm":3},{"ns":"devices","perm":1},{"ns":"diagnostics","perm":7},{"ns":"effectiveSettings","perm":99},{"ns":"entitlements","perm":1},{"ns":"favorites","perm":5},{"ns":"groups","perm":3},{"ns":"groupVolume","perm":3},{"ns":"hardwareStatus","perm":5},{"ns":"hdmi","perm":1},{"ns":"history","perm":3},{"ns":"homeTheater","perm":3},{"ns":"households","perm":1},{"ns":"info","perm":1},{"ns":"ircontrol","perm":1},{"ns":"localContentLibrary","perm":7},{"ns":"musicServiceAccounts","perm":4},{"ns":"playback","perm":3},{"ns":"playbackExtended","perm":1},{"ns":"playbackMetadata","perm":1},{"ns":"playbackSession","perm":15},{"ns":"playerVolume","perm":3},{"ns":"playlists","perm":5},{"ns":"positioning","perm":3},{"ns":"roomDetection","perm":2},{"ns":"settings","perm":103},{"ns":"settings:playerBasic","perm":15},{"ns":"settings:playerLineIn","perm":15},{"ns":"settings:playerUI","perm":15},{"ns":"settings:security","perm":1},{"ns":"sleepTimer","perm":1},{"ns":"smartplay","perm":3},{"ns":"soundSwap","perm":2},{"ns":"svc","perm":7},{"ns":"systemTime","perm":3},{"ns":"time","perm":1},{"ns":"timers","perm":3},{"ns":"trueplay","perm":3},{"ns":"trueroom","perm":3},{"ns":"update","perm":1},{"ns":"upnpAlarmClock","perm":3},{"ns":"upnpAudioIn","perm":3},{"ns":"upnpAVTransport","perm":3},{"ns":"upnpConnectionManager","perm":3},{"ns":"upnpContentDirectory","perm":3},{"ns":"upnpDeviceProperties","perm":3},{"ns":"upnpGroupManagement","perm":3},{"ns":"upnpGroupRenderingControl","perm":3},{"ns":"upnpHTControl","perm":3},{"ns":"upnpMusicServices","perm":3},{"ns":"upnpQueue","perm":3},{"ns":"upnpRenderingControl","perm":3},{"ns":"upnpSystemProperties","perm":3},{"ns":"upnpVirtualLineIn","perm":3},{"ns":"upnpZoneGroupTopology","perm":3},{"ns":"virtualLineIn","perm":3},{"ns":"virtualRemoteControl","perm":3},{"ns":"voice","perm":13},{"ns":"zones","perm":15}]}
```

:::

::: details Technical details

- **Path in image:** `/opt/conf/v1_auth_offline_policy_p2p.json`
- **Category:** config
- **Size:** 2.0 KB (2000 bytes)
- **SHA-256:** `ddabfd2ded8520c8e99014595934f05b065d784eebbd80eaa79982981bb57566`

v1 API authorization policy for the p2p role, applied when the authz backend is unreachable (offline fallback). Defines the resource/verb whitelist enforced by the authz stage.


:::

### `irconfig.txt`

The remote-control configuration: the learned infrared codes and receiver settings the soundbar uses to understand a TV remote's volume keys.

[View](/files/opt/ir/irconfig.txt) · [Download](/files/opt/ir/irconfig.txt) · 98 B

::: details Preview

First 9 of 9 lines:

```
:repeat_codes:
4f 13 05
:vol_up_codes:
2,25 01
:vol_down_codes:
2,27 01
:vol_mute_codes:
2,29 01

```

:::

::: details Technical details

- **Path in image:** `/opt/ir/irconfig.txt`
- **Category:** config
- **Size:** 98 B (98 bytes)
- **SHA-256:** `bd06bfd84d8332241b98afc27c38dbc2f375f1e850f291c38541323348811af6`

IR decoder config consumed by ir_decoder/ir_learn; holds the learned code list for volume up/down/mute/input. A per-device copy also lives at /jffs/irconfig.txt once learning has run.


:::

### `global_attrdata.json`

The settings-schema records describing the household-wide settings surface: which keys exist, their types, and who may write them. These ship as templates; the live values you change are stored separately in the writable partition.

[View](/files/opt/localsettings/global_attrdata.json) · [Download](/files/opt/localsettings/global_attrdata.json) · 547 B

::: details Preview

First 1 of 1 lines:

```
{"global": {"attributes": {"enableContentAccess": {"default": false}, "overrideRemoveMSPCredentials": {"default": true}}, "schemaValidator": {"type": "object", "properties": {"attributes": {"properties": {"enableContentAccess": {"type": "boolean"}, "overrideRemoveMSPCredentials": {"type": "boolean"}}, "additionalProperties": false}, "schemaVersion": {"type": "integer", "minimum": 1}, "eTag": {"allOf": [{"type": "string"}]}, "timestamp": {"allOf": [{"type": "string", "pattern": "^[0-9]+$", "maxLength": 20}]}}, "required": ["schemaVersion"]}}}
```

:::

::: details Technical details

- **Path in image:** `/opt/localsettings/global_attrdata.json`
- **Category:** config
- **Size:** 547 B (547 bytes)
- **SHA-256:** `1f6910354c4eb6c2e7d587d824418d76e7634bb237b309b40cabe49358a18086`

Attribute-data schema for the global settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.


:::

### `playback_attrdata.json`

The settings-schema records for playback-related settings: the typed keys the playback surface accepts. These ship as templates; the live values you change are stored separately in the writable partition.

[View](/files/opt/localsettings/playback_attrdata.json) · [Download](/files/opt/localsettings/playback_attrdata.json) · 584 B

::: details Preview

First 1 of 1 lines:

```
{"playback": {"attributes": {"allowDirectControl": {"default": true}, "allowLineIn": {"default": true}, "allowAirplay": {"default": true}}, "schemaValidator": {"type": "object", "properties": {"attributes": {"properties": {"allowDirectControl": {"type": "boolean"}, "allowLineIn": {"type": "boolean"}, "allowAirplay": {"type": "boolean"}}, "additionalProperties": false}, "schemaVersion": {"type": "integer", "minimum": 1}, "eTag": {"allOf": [{"type": "string"}]}, "timestamp": {"allOf": [{"type": "string", "pattern": "^[0-9]+$", "maxLength": 20}]}}, "required": ["schemaVersion"]}}}
```

:::

::: details Technical details

- **Path in image:** `/opt/localsettings/playback_attrdata.json`
- **Category:** config
- **Size:** 584 B (584 bytes)
- **SHA-256:** `62e6d8e70979057c44d86116018034d73c6aac12bcf601a135b26fe7197749d5`

Attribute-data schema for the playback settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.


:::

### `playerBasic_attrdata.json`

The settings-schema records for basic per-player settings like name, icon, and core behavior toggles. These ship as templates; the live values you change are stored separately in the writable partition.

[View](/files/opt/localsettings/playerBasic_attrdata.json) · [Download](/files/opt/localsettings/playerBasic_attrdata.json) · 1.6 KB

::: details Preview

First 1 of 1 lines:

```
{"playerBasic": {"attributes": {"zoneName": {"default": "Unnamed Room"}, "icon": {"default": ""}, "configuration": {"default": 0}, "targetRoomName": {"default": ""}, "unpairedZoneName": {"default": "Unnamed Room", "readPerm": "0x00000000", "writePerm": "0x00000000"}, "unpairedIcon": {"default": "", "readPerm": "0x00000000", "writePerm": "0x00000000"}, "unpairedConfiguration": {"default": 0, "readPerm": "0x00000000", "writePerm": "0x00000000"}, "unpairedStatusLight": {"default": true, "readPerm": "0x00000000", "writePerm": "0x00000000"}, "unpairedButtonLockState": {"default": false, "readPerm": "0x00000000", "writePerm": "0x00000000"}}, "schemaValidator": {"type": "object", "properties": {"attributes": {"properties": {"zoneName": {"type": "string", "maxLength": 64, "minLength": 1, "pattern": "^(([^ \\n\\t].*[^ \\n\\t])|([^ \\n\\t]))$"}, "icon": {"type": "string", "maxLength": 128}, "configuration": {"type": "integer", "format": "int32"}, "targetRoomName": {"type": "string", "maxLength": 64}, "unpairedZoneName": {"type": "string", "maxLength": 64, "minLength": 1, "pattern": "^(([^ \\n\\t].*[^ \\n\\t])|([^ \\n\\t]))$"}, "unpairedIcon": {"type": "string", "maxLength": 128}, "unpairedConfiguration": {"type": "integer", "format": "int32"}, "unpairedStatusLight": {"type": "boolean"}, "unpairedButtonLockState": {"type": "boolean"}}, "additionalProperties": false}, "schemaVersion": {"type": "integer", "minimum": 1}, "eTag": {"allOf": [{"type": "string"}]}, "timestamp": {"allOf": [{"type": "string", "pattern": "^[0-9]+$", "maxLength": 20}]}}, "required": ["schemaVersion"]}}}
```

:::

::: details Technical details

- **Path in image:** `/opt/localsettings/playerBasic_attrdata.json`
- **Category:** config
- **Size:** 1.6 KB (1591 bytes)
- **SHA-256:** `3d0a4d482df44f5e4e39da4d59e3cad7ed7e528a5adb0b692c879c58c30f29f9`

Attribute-data schema for the playerBasic settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.


:::

### `playerUI_attrdata.json`

The settings-schema records for the player-facing interface options. These ship as templates; the live values you change are stored separately in the writable partition.

[View](/files/opt/localsettings/playerUI_attrdata.json) · [Download](/files/opt/localsettings/playerUI_attrdata.json) · 560 B

::: details Preview

First 1 of 1 lines:

```
{"playerUI": {"attributes": {"statusLight": {"default": true, "readPerm": "0x00000004", "writePerm": "0x00000008"}, "buttonLockState": {"default": false}}, "schemaValidator": {"type": "object", "properties": {"attributes": {"properties": {"statusLight": {"type": "boolean"}, "buttonLockState": {"type": "boolean"}}, "additionalProperties": false}, "schemaVersion": {"type": "integer", "minimum": 1}, "eTag": {"allOf": [{"type": "string"}]}, "timestamp": {"allOf": [{"type": "string", "pattern": "^[0-9]+$", "maxLength": 20}]}}, "required": ["schemaVersion"]}}}
```

:::

::: details Technical details

- **Path in image:** `/opt/localsettings/playerUI_attrdata.json`
- **Category:** config
- **Size:** 560 B (560 bytes)
- **SHA-256:** `45ed16ae4064c927d1989f70d4486d1a6b7d90a5227e3fada01b7019e3fd067e`

Attribute-data schema for the playerUI settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.


:::

### `security_attrdata.json`

The settings-schema records for security-relevant settings like credential and access-related keys. These ship as templates; the live values you change are stored separately in the writable partition.

[View](/files/opt/localsettings/security_attrdata.json) · [Download](/files/opt/localsettings/security_attrdata.json) · 751 B

::: details Preview

First 1 of 1 lines:

```
{"security": {"attributes": {"allowGuestAccess": {"default": true}, "allowInsecureUPnP": {"default": true}, "allowUnauthenticatedControl": {"default": true}, "authPin": {"default": "", "readPerm": "0x00000004", "writePerm": "0x00000004"}}, "schemaValidator": {"type": "object", "properties": {"attributes": {"properties": {"allowGuestAccess": {"type": "boolean"}, "allowInsecureUPnP": {"type": "boolean"}, "allowUnauthenticatedControl": {"type": "boolean"}, "authPin": {"type": "string", "maxLength": 64}}, "additionalProperties": false}, "schemaVersion": {"type": "integer", "minimum": 1}, "eTag": {"allOf": [{"type": "string"}]}, "timestamp": {"allOf": [{"type": "string", "pattern": "^[0-9]+$", "maxLength": 20}]}}, "required": ["schemaVersion"]}}}
```

:::

::: details Technical details

- **Path in image:** `/opt/localsettings/security_attrdata.json`
- **Category:** config
- **Size:** 751 B (751 bytes)
- **SHA-256:** `a43e141699c153e8979a0f63af9e10a63cf6f98b5c3b8c5f5654f0799ec177c4`

Attribute-data schema for the security settings bucket (the _settings.json / _attrdata.json / _effective.json / _exclude.json family the local settings manager resolves). Static template shipped under /opt/localsettings.


:::

### `settings_targettypes.json`

The master list of setting scopes: which settings apply to a whole household, which to a room, and which to a single speaker. The settings machinery uses it to decide where a change should be stored.

[View](/files/opt/localsettings/settings_targettypes.json) · [Download](/files/opt/localsettings/settings_targettypes.json) · 128 B

::: details Preview

First 1 of 1 lines:

```
{"fileFormatVersion": 1, "targetTypes": {"playerUI": "LP", "playerBasic": "P", "security": "L", "global": "L", "playback": "L"}}
```

:::

::: details Technical details

- **Path in image:** `/opt/localsettings/settings_targettypes.json`
- **Category:** config
- **Size:** 128 B (128 bytes)
- **SHA-256:** `58ddeee7de9389b2cd3dfc53d04746bf142b4f190b6b6b6010071ef499b6214d`

Target-type registry for the settings schema; defines the scope classes the settings validator routes keys into.


:::

