# Queued: not yet reverse-engineered

These records mark components that are shipped and known to matter but have not been reverse-engineered yet. Each entry names the artifact it refers to and what still needs decoding, so this page doubles as the project's open-work list.

## `bin_athconfig`

**coverage** `todo`

Low-level tools for the Atheros WiFi radio, including the DFS radar-handling utility that legally must move channels when radar is detected. Which radio controls they actually drive has not been mapped.

::: details Technical details

Atheros radio configuration and DFS radar tooling (wifi/athconfig, wifi/N/radartool). Undocumented: which ioctls they drive, how DFS channel moves are coordinated with dfs.ko.

- **name:** athconfig / radartool (Atheros tools)
- **todo:** `enumerate athconfig commands and ioctls`, `document DFS/radar handling with dfs.ko`
- **artifacts:** `wifi/athconfig`, `wifi/N/radartool`

:::

## `bin_busybox_applets`

**coverage** `todo`

Busybox is a well-known tool, but which applets Sonos actually compiled in is not, and that list defines what every boot and update script can assume exists. Dumping it is easy work that has just not been done.

::: details Technical details

bin/busybox is stock, but the build configuration is not: which applets are compiled in shapes what boot/update scripts can rely on. Cheap to extract from the binary's applet table.

- **name:** busybox applet inventory
- **todo:** `dump compiled-in applet list`, `note Sonos-relevant applets (httpd? tftp? flash tools?)`
- **artifacts:** `bin/busybox`

:::

## `bin_capsh`

**coverage** `todo`

A capabilities helper that does not appear anywhere in the dataset at all. It is probably used to launch some daemon with reduced privileges, but which one is a mystery until someone goes looking.

::: details Technical details

Linux capability-shell helper (sbin/capsh). Zero references anywhere in the dataset; probably used by a wrapper script to drop capabilities before launching a daemon.

- **name:** capsh
- **todo:** `find invocation site(s)`, `document which daemon runs with reduced caps`
- **artifacts:** `sbin/capsh`

:::

## `bin_chronyd`

**coverage** `todo`

The time-synchronization daemon that keeps the household agreeing on the clock, which alarms and schedules quietly depend on. Where it syncs from and how time flows through the rest of the system are only sketched.

::: details Technical details

NTP daemon pair (sbin/chronyd, bin/chronyc) with chrony.conf and sntp.txt shipped. Only incidental coverage: which sources it uses, how it feeds the household clock consensus, and the systemTime/time muse resources.

- **name:** chronyd / chronyc (time sync)
- **todo:** `document configured sources and drift behavior`, `tie to muse systemTime/time resources and AC.* time vars`
- **artifacts:** `sbin/chronyd`, `bin/chronyc`, `etc/chrony.conf`, `etc/sntp.txt`

:::

## `bin_dropbearmulti`

**coverage** `todo`

The SSH server built into the firmware. It is normally unreachable until the secure-console unlock path opens it, and while the unlock mechanism has some coverage, the daemon's full configuration and key handling have never been written up in one place.

::: details Technical details

The Dropbear SSH multicall binary. Coverage exists for the unlock gate (device_unlock, secure_console scripts, ssh_authorized_keys) but the daemon's config surface and the factory-vs-dev key paths need consolidating into one record.

- **name:** dropbearmulti (SSH)
- **todo:** `document enabled listeners and auth paths`, `consolidate the unlock/key story end to end`
- **artifacts:** `bin/dropbearmulti`, `usr/sbin/secure_console.sh`, `usr/sbin/secure_console_login.sh`, `etc/scripts/run_sshd.sh`

:::

## `bin_frcheck`

**coverage** `todo`

A verification tool run around boot and update time, most likely checking that a freshly written root filesystem is sane before the speaker trusts it. What exactly it validates has not been decoded.

::: details Technical details

Filesystem/rootfs verification binary (sbin/frcheck) invoked around update and boot. Undisassembled: what it validates (squashfs hash, partition table, manifest) and when it runs.

- **name:** frcheck
- **todo:** `determine invocation sites in boot/update flow`, `document what it verifies and its exit contract`
- **artifacts:** `sbin/frcheck`

:::

## `bin_keyval`

**coverage** `todo`

A tiny key-value store tool that boot and update scripts lean on for small bits of persistent state. Where it stores data and what reads it are unknown.

::: details Technical details

Key/value store utility (usr/sbin/keyval) used by boot and update scripts. Undocumented: backing store location, key namespace, consumers.

- **name:** keyval
- **todo:** `find the backing store and key namespace`, `enumerate script consumers`
- **artifacts:** `usr/sbin/keyval`

:::

## `bin_mdnsd`

**coverage** `todo`

Sonos's mDNS daemon, which announces services the household can browse. The surrounding records cover pieces of it, but the full list of service types it registers and how it differs from a stock mDNS responder are unfinished.

::: details Technical details

The multicast-DNS daemon. mdns/mdns_controller/mdns_device/mdns_discovery records exist but are partial: service-type table, TXT record schema, and where it diverges from stock mdns implementations are not fully mapped.

- **name:** mdnsd (Sonos mDNS fork)
- **todo:** `enumerate registered service types and TXT schemas`, `document divergence from stock mDNS daemons`, `document zone/group advertising flow`
- **artifacts:** `sbin/mdnsd`

:::

## `bin_mdputil`

**coverage** `todo`

A small helper binary that travels with the update machinery, probably for partition or manifest work. It has never been analyzed, so what commands it accepts and who calls it are open questions.

::: details Technical details

Small update-side utility shipped in bin/. Referenced by the update machinery; its verb set (probably partition/manifest helpers) has never been enumerated.

- **name:** mdputil
- **todo:** `enumerate command verbs and syscall surface`, `tie into the upgrade/upgrade_mgr call graph`
- **artifacts:** `bin/mdputil`

:::

## `bin_net_utils`

**coverage** `todo`

The small DHCP and bridge helpers that bring network interfaces up in the first place. The events they feed into the network state machine, and how SonosNet bridging is set up, are incidental notes at best right now.

::: details Technical details

The DHCP client and bridge control pair plus the udhcpc hook script (etc/dhcp.script). Incidental coverage only: which events they feed netconfig_fsm with, and bridge setup for SonosNet.

- **name:** udhcpc / brctl / dhcp.script
- **todo:** `document dhcp.script event emission`, `document bridge topology for SonosNet vs STA mode`
- **artifacts:** `sbin/udhcpc`, `usr/sbin/brctl`, `etc/dhcp.script`

:::

## `bin_netstartd`

**coverage** `todo`

The daemon behind the netstart/SCI bus, the internal channel that coordinates early networking and hardware bring-up. We know it exists and roughly where it sits in boot, but its message catalog and client list have never been fully decoded.

::: details Technical details

Daemon behind the netstart/SCI bus (wifi/netstartd). netstart_events and netstart_ipc coverage is partial: the SCI/MRPC message set, client roster, and boot-time role are not fully decoded.

- **name:** netstartd (netstart2)
- **todo:** `decode the SCI/MRPC message catalog end to end`, `document clients and registration handshake`, `document role in WiFi bring-up vs wpa_supplicant`
- **artifacts:** `wifi/netstartd`

:::

## `bin_pcap`

**coverage** `todo`

A packet-capture utility, most likely used by the diagnostics tooling. How it gets invoked and where captures end up is undetermined.

::: details Technical details

Packet-capture helper (bin/pcap). Referenced by diagnostic tooling; capture filters, output location and invocation path undocumented.

- **name:** pcap
- **todo:** `document invocation path (diagnostics? engineering pages?)`, `document output location and rotation`
- **artifacts:** `bin/pcap`

:::

## `bin_sddpd`

**coverage** `todo`

The daemon behind SDDP, Sonos's own device discovery protocol: the thing that lets a new speaker or app find players on the network before anything else is configured. Its config file ships in the image, but the actual wire protocol, the frame format and how it relates to normal SSDP discovery have never been documented.

::: details Technical details

The SDDP (Sonos Device Discovery Protocol) daemon. sddpd.conf ships its config but the wire protocol is undecoded: probe/announce frame format, multicast group, relationship to SSDP and the app discovery path.

- **name:** sddpd (Sonos discovery daemon)
- **todo:** `decode SDDP frame format and multicast details`, `document interaction with SSDP discovery layer`, `document sddpd.conf knobs in use`
- **artifacts:** `sbin/sddpd`, `etc/sddpd.conf`

:::

## `bin_setmac`

**coverage** `todo`

The tool that programs the speaker's factory MAC address. Which interfaces it touches and where the address comes from have not been documented.

::: details Technical details

MAC-address programming tool (usr/sbin/setmac). Undocumented: which interfaces it programs, where the factory MAC lives.

- **name:** setmac
- **todo:** `document target interfaces and MAC source`
- **artifacts:** `usr/sbin/setmac`

:::

## `bin_sonosledmgrd`

**coverage** `todo`

The daemon in charge of the LED: every blink pattern for pairing, errors, mute and setup flows is decided here. The LED vocabulary has partial coverage, but the daemon's own state machine and which other processes drive it deserve a dedicated writeup.

::: details Technical details

The LED manager daemon (opt/bin/sonosledmgrd) with its own logger config. led_engine/led_hw/leds_zp records cover the LED vocabulary partially; the daemon's state machine, client IPC and mute/wifi/error blink grammar need a dedicated decode.

- **name:** sonosledmgrd
- **todo:** `decode LED state machine and blink patterns`, `document IPC clients (anacapad, upgrade, netstartd)`, `document sonosledmgrd_logger.toml`
- **artifacts:** `opt/bin/sonosledmgrd`, `opt/conf/sonosledmgrd_logger.toml`

:::

## `bin_upgrade`

**coverage** `todo`

The pair of executables that actually install new firmware. When a .upd package arrives, this is the code that verifies it, writes it to flash and decides which partition the speaker boots next. We know the update flow around them from other records, but nobody has disassembled the binaries yet, so the signature checks, the payload layout and the fallback logic are all still unwritten.

::: details Technical details

The on-device firmware-update executables (bin/upgrade, bin/upgrade_mgr). Related records cover the update flow (update_machinery, update_coordinator, auto_update, user_update) but the binaries themselves have not been disassembled: launch chain, .upd envelope parsing and signature verification, partition selection, the device-payload.bin application path, and rollback behavior are all undecoded.

- **name:** upgrade / upgrade_mgr daemons
- **todo:** `disassemble upgrade and upgrade_mgr entry points`, `decode the .upd container layout end to end`, `document signature/cert verification path (upd_cert_bundle.rcb)`, `document device-payload.bin consumption and partition switching`, `document failure and rollback handling`
- **artifacts:** `bin/upgrade`, `bin/upgrade_mgr`, `package/86.10-80260-1-9.upd`, `package/86.10-80260-1-9-device-payload.bin`

:::

## `bin_wacd`

**coverage** `todo`

The provisioning daemon that runs when a brand-new speaker is being joined to WiFi from the app, before it has any network credentials. The handshake that transfers credentials, and how control then passes to the normal WiFi stack, still need a full writeup.

::: details Technical details

Daemon handling WAC-mode provisioning (joining the speaker to WiFi from app broadcast). wac_mode record is partial: the provisioning handshake, crypto, and SonosNet bridge path need full decode.

- **name:** wacd (wireless access config)
- **todo:** `decode the WAC provisioning handshake`, `document credential transfer and crypto`, `document handoff to wpa_supplicant/netstartd`
- **artifacts:** `wifi/wacd`

:::

## `bin_wpa_supplicant`

**coverage** `todo`

The standard WiFi supplicant, but the interesting part is everything around it: the Sonos helper tools that configure it, the control interface other daemons talk to, and which of its events get fed back into the system. That integration layer is undocumented.

::: details Technical details

The WiFi supplicant, driven via wpaconfig/sta-assoc helpers and htapsatwpa.conf. Stock baseline is known but the Sonos control interface (who talks to it, which events feed netstartd) is not documented.

- **name:** wpa_supplicant (Sonos build)
- **todo:** `document the control-interface consumers`, `document htapsatwpa.conf / ssidlist.txt inputs`, `document Sonos-specific build options if any`
- **artifacts:** `wifi/wpa_supplicant`, `wifi/wpaconfig`, `wifi/sta-assoc`, `etc/htapsatwpa.conf`, `etc/ssidlist.txt`

:::

## `fmt_device_payload`

**coverage** `todo`

The per-model payload image inside the update package, the actual blob that ends up written to flash. Its internal structure has never been decoded.

::: details Technical details

The per-model payload image inside the .upd. Format undecoded; presumably the rootfs+kernel bundle the updater writes to flash.

- **name:** device-payload.bin format
- **todo:** `decode header and section layout`, `document relationship to kernel.uImage/rootfs.squashfs`
- **artifacts:** `package/86.10-80260-1-9-device-payload.bin`, `package/86.10-80260-1-9-kernel.uImage`, `package/86.10-80260-1-9-rootfs.squashfs`

:::

## `fmt_upd`

**coverage** `todo`

The firmware package format itself: how a .upd file is laid out, where the manifest and signature live, and how minimum-version rules are enforced. Only partially explored so far.

::: details Technical details

The firmware update container (package/*.upd). Partially explored via update_machinery; the complete header/manifest/signature layout has never been written down end to end.

- **name:** .upd package format
- **todo:** `document container layout, manifest and signature`, `document minimum-version fields (MINCOMPATVER etc.)`
- **artifacts:** `package/86.10-80260-1-9.upd`, `package/86.10-80260-1-9-preinstall.sh`, `MINCOMPATVER`, `LEGACYCOMPATVER`, `VERSION`

:::

## `kmod_ath_wifi`

**coverage** `todo`

The Atheros WiFi driver modules that power the radio and SonosNet mesh. Vendor code underneath, but the load order, the Sonos-specific configuration surface and the radar channel-vacate flow are undocumented.

::: details Technical details

The Atheros radio stack: adf.ko, asf.ko, ath_driver.ko, ath_hal.ko, dfs.ko, bridge.ko under wifi/. Vendor-derived but load order, custom ioctls for SonosNet bonding, and DFS handling are undocumented.

- **name:** Atheros WiFi modules
- **todo:** `document load order and dependencies`, `document SonosNet-specific ioctl/config surface`, `document DFS channel-vacate flow`
- **artifacts:** `wifi/N/adf.ko`, `wifi/N/asf.ko`, `wifi/N/ath_driver.ko`, `wifi/N/ath_hal.ko`, `wifi/N/dfs.ko`, `wifi/bridge.ko`

:::

## `kmod_sonos`

**coverage** `todo`

The custom kernel modules that glue hardware to userland: the audio device interface, the hardware-event queue, the IR receiver and the core Sonos device module. Their device nodes, ioctl calls and consumers are essentially untouched.

::: details Technical details

Custom kernel modules: audiodev.ko (audio device glue), chk.ko, hwevent_queue.ko (hardware event ring), ir_rcvr.ko (IR receiver), sonos_device.ko. Essentially untouched: device nodes, ioctls, and which userland component consumes each.

- **name:** Sonos kernel modules
- **todo:** `enumerate device nodes and ioctl surfaces`, `map module -> userland consumer`, `document hwevent_queue consumer path`
- **artifacts:** `modules/audiodev.ko`, `modules/chk.ko`, `modules/hwevent_queue.ko`, `modules/ir_rcvr.ko`, `modules/sonos_device.ko`

:::

## `sonos_custom_libs`

**coverage** `todo`

Among the shared libraries, most are off-the-shelf code like mbedTLS or ffmpeg, but a handful are Sonos-built and contain real logic. Nobody has yet separated the custom set from the stock set and documented what each one exports.

::: details Technical details

Most .so files are stock (mbedTLS, ffmpeg, musl-era libc), but the Sonos-built set (libflash, libhwmessagelib, and any DSP/SONOS libs) has never been per-library documented: exports, consumers, and role.

- **name:** Sonos-custom shared libraries
- **todo:** `identify which libs are Sonos-built vs stock`, `per-lib export/consumer map for the custom set`
- **artifacts:** `lib/libflash.so.1`, `lib/libhwmessagelib.so.1`

:::
