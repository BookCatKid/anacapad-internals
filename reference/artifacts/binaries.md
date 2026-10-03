# Artifacts: Programs

The runnable programs shipped on the speaker: the main player software itself, the daemons that manage networking and LEDs, and the utility tools used for upgrades, diagnostics, and factory procedures. These are compiled machine code, so you can download them but not read them like a text file.

::: details Technical details

ELF executables for the limelight (ARM) target. anacapad is the analysis subject of this site; the rest are sibling daemons and vendor/board utilities.

:::

### `busybox`

The Swiss Army knife of the system: one small program providing all the everyday Unix commands (ls, cp, ping, ps, and dozens more). Most of the other tools in /bin are just shortcuts to this one file.

[Download](/files/bin/busybox) · 513.8 KB

::: details Technical details

- **Path in image:** `/bin/busybox`
- **Category:** binaries
- **Size:** 513.8 KB (526096 bytes)
- **SHA-256:** `f04f6646c7d054e995cd09d4c17205d1cd71a080171e97a80750de6a190f16c7`

busybox multi-call binary; the /bin utilities (cat, ls, mount, netstat, ping, ps, ...) are symlinks into it.


:::

### `chronyc`

The command-line client for the time daemon: the tool scripts and diagnostics use to ask 'what does the clock think right now?'.

[Download](/files/bin/chronyc) · 129.7 KB

::: details Technical details

- **Path in image:** `/bin/chronyc`
- **Category:** binaries
- **Size:** 129.7 KB (132812 bytes)
- **SHA-256:** `723675cde72cd0a37754828c9463877c9d303301424d4e36aa0e6906d1d81afe`

chrony control client; referenced by the exec-page diagnostics (chronyc source tracking).


:::

### `dropbearmulti`

The SSH server toolkit in one binary: provides the secure shell access the device can open for engineering, plus the key tools that go with it.

[Download](/files/bin/dropbearmulti) · 258.4 KB

::: details Technical details

- **Path in image:** `/bin/dropbearmulti`
- **Category:** binaries
- **Size:** 258.4 KB (264552 bytes)
- **SHA-256:** `4fdab40a039cd989323458024aa010600c7849afc54e728d2735871b381583fc`

Dropbear multi-call binary (sshd/dropbearkey in one); gated by run_sshd.sh and the unlock flags; host keys persist under /jffs/persist/ssh.


:::

### `mdputil`

The device-data utility: reads and writes the small factory data block that carries this unit's identity like its serial number and calibration slots, programmed at manufacturing.

[Download](/files/bin/mdputil) · 66.0 KB

::: details Technical details

- **Path in image:** `/bin/mdputil`
- **Category:** binaries
- **Size:** 66.0 KB (67596 bytes)
- **SHA-256:** `e3b2f55b3ecd50b3b26aeb1771f0e9b1b0ed30dea84fa759e7adfa70f6a0cd61`

MDP (manufacturing data payload) tool; initializes the device-payload.bin template documented in firmware-differences; source of serial/MAC/calibration fields.


:::

### `pcap`

The packet-capture tool: records network traffic for diagnostics, used when Sonos needs to see what the speaker is actually receiving.

[Download](/files/bin/pcap) · 65.4 KB

::: details Technical details

- **Path in image:** `/bin/pcap`
- **Category:** binaries
- **Size:** 65.4 KB (66996 bytes)
- **SHA-256:** `1f774e76d0904d94c3321eead021c9063e111a3bd6a82e2ad476aa250d8fb52f`

pcap capture utility invoked from the diagnostics surface.


:::

### `upgrade`

The low-level updater: the program that actually writes a downloaded firmware image to flash during an update.

[Download](/files/bin/upgrade) · 195.3 KB

::: details Technical details

- **Path in image:** `/bin/upgrade`
- **Category:** binaries
- **Size:** 195.3 KB (200036 bytes)
- **SHA-256:** `6777928534592ccec85ff9505334fb0c85f842565aab9cc64fcc23e41d03eca6`

Update applier invoked by upgrade_mgr; the recovery path runs it in a loop (documented in update_machinery's sibling-binaries record).


:::

### `upgrade_mgr`

The update manager: orchestrates a downloaded update, verifies it, and schedules the reboot into the new firmware.

[Download](/files/bin/upgrade_mgr) · 65.6 KB

::: details Technical details

- **Path in image:** `/bin/upgrade_mgr`
- **Category:** binaries
- **Size:** 65.6 KB (67160 bytes)
- **SHA-256:** `b806c0df7934b9fd3fa367aa1a9eb73a09c4f0c81cd06e6b3ec28fb34636cd2c`

Upgrade orchestrator; its status and report files land under /tmp/upgrade_mgr_* and /jffs/upgrade*.


:::

### `anacapactl`

The supervisor script for the main player: a shell wrapper that starts anacapad with the right privileges, watches it, and can launch it under a debugger for development. It is the little harness around the big program.

[View](/files/opt/bin/anacapactl) · [Download](/files/opt/bin/anacapactl) · 2.0 KB

::: details Preview

First 60 of 128 lines:

```
#! /bin/sh
anacapaHome=/opt
anacapaPidFile=$anacapaHome/log/anacapa.pid
anacapaBin="$anacapaHome/bin/anacapad"
anacapaOpts="-c $anacapaHome/conf/anacapa.conf -u anacapa -C all=eip"
anacapaStart="$anacapaBin $anacapaOpts"

PATH=/usr/bin:/bin:/usr/sbin:/sbin:$anacapaHome/bin
export PATH
LD_LIBRARY_PATH=$anacapaHome/lib
export LD_LIBRARY_PATH
ANACAPA_LIBDIR=$anacapaHome/lib
export ANACAPA_LIBDIR

arch=`uname -m`
#
# CheckRunning
# Check to see if Anacapa is running, and if so, set the "pid" var.
#
CheckRunning() {
	pid=""
	if [ -f $anacapaPidFile ]; then
		pid=`cat $anacapaPidFile 2> /dev/null`
	fi

	if [ -n "$pid" ]; then
		kill -0 $pid 2> /dev/null
		if [ $? != 0 ]; then
			rm -f $anacapaPidFile
			pid=""
		fi
	else
		rm -f $anacapaPidFile
		pid=""
	fi
}

#
# Stop
# Stop the anacapa and wait until the primary process is dead.
#
Stop() {
	kill -15 $pid
	CheckRunning
	while [ -n "$pid" ]; do
		sleep 1
		CheckRunning
	done
}

CheckRunning

#
# Hup
# Hup the anacapa
#
Hup() {
	kill -HUP $pid
}

```

:::

::: details Technical details

- **Path in image:** `/opt/bin/anacapactl`
- **Category:** binaries
- **Size:** 2.0 KB (2015 bytes)
- **SHA-256:** `546ecdef28593ecdd6dfdbe81cf96e62b0bd41773cf9984dd469b287a3a9d0c5`

POSIX sh supervisor (fully readable text): handles start/stop/restart, demo-mode exec, cache-drop on certain boards, and gdb wrapping via $SONOS_GDB_ARGS.


:::

### `anacapad`

The main event: the Sonos player daemon itself. This single program implements nearly everything this site documents, from the classic remote-control commands to the modern app API to the media pipeline. If you download one file, this is the one.

[Download](/files/opt/bin/anacapad) · 16.5 MB

::: details Technical details

- **Path in image:** `/opt/bin/anacapad`
- **Category:** binaries
- **Size:** 16.5 MB (17329076 bytes)
- **SHA-256:** `f60262a152aac48bd39bf0285d17d080e6820e37be12d0af9de7bffee8d3e257`

The analysis subject: ~4 MB ARM ELF (limelight). Every dispatch table, URI grammar, and subsystem entry on this site was recovered from this binary. Build 86.10-80260 per build.properties.


:::

### `sonosledmgrd`

The LED manager daemon: the small program that owns the speaker's status light and plays the animation patterns for states like setup, playing, and muted.

[Download](/files/opt/bin/sonosledmgrd) · 1.2 MB

::: details Technical details

- **Path in image:** `/opt/bin/sonosledmgrd`
- **Category:** binaries
- **Size:** 1.2 MB (1248340 bytes)
- **SHA-256:** `4a4afe45e2b31f26458268e1b7cc7a01ac57a7631337753c9d914135cf1c540f`

ELF daemon; owns /dev/ledctl. Its animated pattern engine and per-model feature map are documented under led_engine/leds_zp/led_hw.


:::

### `capsh`

A capability-inspection utility from the libcap package, used for checking process privileges.

[Download](/files/sbin/capsh) · 66.8 KB

::: details Technical details

- **Path in image:** `/sbin/capsh`
- **Category:** binaries
- **Size:** 66.8 KB (68432 bytes)
- **SHA-256:** `4ddf9eef05b0be1aca5e03e082c8062dd7e5ccfb6844e7298f52585058ce2875`

Standard libcap tool; ships with the capability-aware launch path (anacapactl's -C keep-set).


:::

### `chronyd`

The time-sync daemon: the program that keeps the speaker's clock disciplined against internet time servers, which is the quiet foundation of sample-accurate multi-room playback.

[Download](/files/sbin/chronyd) · 258.0 KB

::: details Technical details

- **Path in image:** `/sbin/chronyd`
- **Category:** binaries
- **Size:** 258.0 KB (264144 bytes)
- **SHA-256:** `df82a031253bbf53f2c0b491525eeaeae0f67e3f3368df879777a4c16871721f`

chrony daemon build; Sonos's sntp layer plus chrony is documented under sntp/sntp_server.


:::

### `frcheck`

The factory-reset checker: looks at the button/reset state at boot and reports whether the device should wipe itself clean before anything else starts.

[Download](/files/sbin/frcheck) · 65.5 KB

::: details Technical details

- **Path in image:** `/sbin/frcheck`
- **Category:** binaries
- **Size:** 65.5 KB (67080 bytes)
- **SHA-256:** `8bd04de01ac8d4ed07ba3daee7a3d32db13fbad53486dc9da6ad06602ff1fde5`

Its return code feeds the rootfs boot chain: on m8 it maps to netstartd --soft-reset, on m9 to --hard-reset (a real per-model behavioral difference).


:::

### `mdnsd`

The discovery daemon: the standalone program that handles announcing and finding devices on the local network, shared across the system.

[Download](/files/sbin/mdnsd) · 513.8 KB

::: details Technical details

- **Path in image:** `/sbin/mdnsd`
- **Category:** binaries
- **Size:** 513.8 KB (526152 bytes)
- **SHA-256:** `5e1bf99fe4ca077de4e71d4713afe8ce49f7450a4674b3ab1f8a655a2b4710a3`

Multicast-DNS daemon; the mdns/mdnsd log and the discovery layer on this site trace back to it.


:::

### `sddpd`

The device-announcement daemon: the sibling process running Sonos's own broadcast protocol that keeps players aware of each other.

[Download](/files/sbin/sddpd) · 65.9 KB

::: details Technical details

- **Path in image:** `/sbin/sddpd`
- **Category:** binaries
- **Size:** 65.9 KB (67464 bytes)
- **SHA-256:** `3b49f832d445c0f5c3c3bb15ffa5c596b22710ac8ae766615d2695fe38823521`

Sonos Discovery Protocol daemon configured by /etc/sddpd.conf; complements multicast DNS with Sonos's proprietary announce layer.


:::

### `udhcpc`

The DHCP client: the tiny program that asks your router for an address when the speaker boots on a normal network.

[Download](/files/sbin/udhcpc) · 66.3 KB

::: details Technical details

- **Path in image:** `/sbin/udhcpc`
- **Category:** binaries
- **Size:** 66.3 KB (67852 bytes)
- **SHA-256:** `26803ab4fa77327f3f9518800c91aa35a37077955bb6ed35ce2fec7d7399a4ba`

busybox-style udhcp client driving /etc/dhcp.script on lease events.


:::

### `brctl`

The bridge control tool: manages the network bridge interface the speaker uses to share its connection in SonosNet setups.

[Download](/files/usr/sbin/brctl) · 66.0 KB

::: details Technical details

- **Path in image:** `/usr/sbin/brctl`
- **Category:** binaries
- **Size:** 66.0 KB (67624 bytes)
- **SHA-256:** `6ffee508067d9163c73ae2c9ff256355ef4ca54cace0589ce12d20cfb3695ba7`

Ethernet-bridging utility for the bridged-wireless topology SonosNet requires.


:::

### `keyval`

The key-value store tool: reads and writes small system-level settings keys used by the lower-level services.

[Download](/files/usr/sbin/keyval) · 65.6 KB

::: details Technical details

- **Path in image:** `/usr/sbin/keyval`
- **Category:** binaries
- **Size:** 65.6 KB (67128 bytes)
- **SHA-256:** `3bd52f3d28928b29ca3da547485bf4e5b71744b3db22c57a0930a4a73b99c859`

Keyval utility referenced by updater and network scripts; one of the persistent-state primitives below anacapad.


:::

### `setmac`

The MAC-address assignment tool: programs the unit's network hardware address during manufacturing or recovery.

[Download](/files/usr/sbin/setmac) · 65.7 KB

::: details Technical details

- **Path in image:** `/usr/sbin/setmac`
- **Category:** binaries
- **Size:** 65.7 KB (67248 bytes)
- **SHA-256:** `fb3f727de446ffe5100c85b314eec2f19f037b15476aa189201e4ea9b7ea32c2`

Writes the device MAC; paired with mdputil's factory provisioning.


:::

### `radartool`

The radar-detection tool: on 5 GHz bands the radio must listen for radar before transmitting, and this utility performs those checks. It exists on this build because the Playbar can master SonosNet on radar-controlled channels.

[Download](/files/wifi/N/radartool) · 65.5 KB

::: details Technical details

- **Path in image:** `/wifi/N/radartool`
- **Category:** binaries
- **Size:** 65.5 KB (67084 bytes)
- **SHA-256:** `93d9c6e54e9abe4a3769123d8cc42afcf79cc101d71ced4303b3fe5e0aad36b6`

DFS (radar) utility for the wifi/N modules; the dfs.ko module + this tool satisfy regulatory radar-detection requirements.


:::

### `athconfig`

The Atheros radio configuration utility: low-level control of the WiFi chipset for modes like SonosNet mesh that the normal client stack does not handle.

[Download](/files/wifi/athconfig) · 65.6 KB

::: details Technical details

- **Path in image:** `/wifi/athconfig`
- **Category:** binaries
- **Size:** 65.6 KB (67208 bytes)
- **SHA-256:** `cde6b1233c354fc940b00b44678694ebe2956785373df54a7d6acec1a7e6f545`

Atheros-specific tool for the radio's mesh/AP modes (SonosNet operates through this layer).


:::

### `netstartd`

The network-startup daemon: the sibling process that actually brings the network up, manages setup mode, and hands connection status back to the main program. When the speaker joins WiFi, this is the program doing the joining.

[Download](/files/wifi/netstartd) · 257.9 KB

::: details Technical details

- **Path in image:** `/wifi/netstartd`
- **Category:** binaries
- **Size:** 257.9 KB (264076 bytes)
- **SHA-256:** `9654a16c9b5c07c84131b574e216e7ba311be405c4a831e360a59d10ac35de7e`

ELF daemon; anacapad reaches it over /tmp/netstartd.ipc (the multi_daemon_boundary contract). It drives netconfig.sh and the flag files under /var/run.


:::

### `sta-assoc`

A small association-status helper: used to check or report the radio's link state.

[View](/files/wifi/sta-assoc) · [Download](/files/wifi/sta-assoc) · 1.1 KB

::: details Preview

First 60 of 64 lines:

```
#!/bin/sh

usage() {
  echo "Usage: $(basename $0) <open|wpa> <ssid> ( <key> )"
  exit 1
}

a2h() {
    temp="$1"
    while test -n "$temp"; do
        c=`expr substr "$temp" 1 1`
        printf '%x' "'$c'"
        temp=`expr substr "$temp" 2 32`
    done
}


get_supp_conf() {

  mode="$1"
  ssid="$2"
  key="$3"

  ssid_hex=$(a2h "$ssid")

  case $mode in
    open)
      /wifi/athconfig stasetkeylen ath0 0
      echo "network={"
      echo "ssid=$ssid_hex"
      echo "scan_ssid=1"
      echo "key_mgmt=NONE"
      echo "priority=0"
      echo "}"
      ;;
    wpa)
      if [ -z "$key" ] ; then usage ; fi
      key_hex=$(a2h "$key")
      /wifi/athconfig stasetkeylen ath0 ${#key_hex}
      echo "network={"
      echo "ssid=$ssid_hex"
      echo "scan_ssid=1"
      echo "psk=$key_hex"
      echo "priority=0"
      echo "}"
      ;;
    *)
      usage ;;
  esac
}

if [ -z "$1" ] || [ -z "$2" ]; then
  usage
fi

killall wpa_supplicant > /dev/null 2>&1
get_supp_conf "$1" "$2" "$3" > /tmp/supplicant_conf.tmp

/wifi/wpa_supplicant -s -B -D sonos -i ath0 -b br0 -c /tmp/supplicant_conf.tmp

```

:::

::: details Technical details

- **Path in image:** `/wifi/sta-assoc`
- **Category:** binaries
- **Size:** 1.1 KB (1169 bytes)
- **SHA-256:** `a376a1f0774a09b3a642ce4626ccd335d81a52d9a527a21cb9cfd3d0c2c3267e`

Station-association utility tied to the Atheros stack and the assoctracker monitoring.


:::

### `wacd`

The setup-mode daemon: the program that runs the temporary open network your phone joins during initial setup, where the player receives its first WiFi credentials.

[Download](/files/wifi/wacd) · 65.6 KB

::: details Technical details

- **Path in image:** `/wifi/wacd`
- **Category:** binaries
- **Size:** 65.6 KB (67128 bytes)
- **SHA-256:** `a51d696f54f86c637ceac00ee8d9e83b20e354fee7219a2de37f89b133570305`

Wireless-accessory-configuration daemon; the /var/run/wac_mode flag and WAC timeout are documented under wac_mode.


:::

### `wpa_supplicant`

The WiFi client program: the standard open-source component that handles the actual handshake joining your home network. Practically every Linux WiFi device carries this.

[Download](/files/wifi/wpa_supplicant) · 322.0 KB

::: details Technical details

- **Path in image:** `/wifi/wpa_supplicant`
- **Category:** binaries
- **Size:** 322.0 KB (329684 bytes)
- **SHA-256:** `b3ed6402fc388bd7aa73919b1dd7828a011186d1e384fdb6487c7c85c9737ddf`

wpa_supplicant build for the Atheros radio; driven by configs like /var/run/htapsatwpa.conf and the jffs debug overrides.


:::

### `wpaconfig`

A small helper used to generate or adjust WiFi client configuration for the supplicant.

[View](/files/wifi/wpaconfig) · [Download](/files/wifi/wpaconfig) · 2.2 KB

::: details Preview

First 60 of 85 lines:

```
#!/bin/sh

if [ "${#1}" -eq "0" ]; then
    echo "usage: ${0} <settings file> [wpa config file]"
    exit
fi

if [ "${#2}" -ne "0" ]; then
    WPACONFIG=${2}
else
    WPACONFIG=/var/run/wpa_supplicant.conf
fi

if [ -f /jffs/debug/wpa_proto ]; then
    WPAPROTO=`cat /jffs/debug/wpa_proto`
fi
if [ -f /jffs/debug/wpa_ptk ]; then
    WPAPTK=`cat /jffs/debug/wpa_ptk`
fi
if [ -f /jffs/debug/wpa_gtk ]; then
    WPAGTK=`cat /jffs/debug/wpa_gtk`
fi

echo "eapol_version=1"    >  ${WPACONFIG}
echo "ap_scan=1"          >> ${WPACONFIG}

print_entry()
{
    SSIDHEX=$1
    KEYHEX=$2

    if [ ${#KEYHEX} -gt "15" ] && [ ${#KEYHEX} -lt "129" ]; then
        echo "network={"              >> ${WPACONFIG}
        echo "ssid=${SSIDHEX}"        >> ${WPACONFIG}
        echo "scan_ssid=1"            >> ${WPACONFIG}
        echo "psk=${KEYHEX}"          >> ${WPACONFIG}
        if [ "${#WPAPROTO}" -ne "0" ];then
            echo "proto=${WPAPROTO}"  >> ${WPACONFIG}
        fi
        if [ "${#WPAPTK}" -ne "0" ];then
            echo "pairwise=${WPAPTK}" >> ${WPACONFIG}
        fi
        if [ "${#WPAGTK}" -ne "0" ];then
            echo "group=${WPAGTK}"    >> ${WPACONFIG}
        fi
        echo "priority=2"             >> ${WPACONFIG}
        echo "}"                      >> ${WPACONFIG}
    fi

    echo "network={"          >> ${WPACONFIG}
    echo "ssid=${SSIDHEX}"    >> ${WPACONFIG}
    echo "scan_ssid=1"        >> ${WPACONFIG}
    echo "key_mgmt=NONE"      >> ${WPACONFIG}
    echo "}"                  >> ${WPACONFIG}

    /wifi/athconfig stassidlistadd ath0 ${SSIDHEX} ${#KEYHEX}
}

/wifi/athconfig stassidlistclr ath0
/wifi/athconfig wossidclr ath0
```

:::

::: details Technical details

- **Path in image:** `/wifi/wpaconfig`
- **Category:** binaries
- **Size:** 2.2 KB (2236 bytes)
- **SHA-256:** `883675c1177bd4ce329e34fe2a861dd0fbc64bac8288b17328e27f388eb082ac`

WPA config utility invoked by the netconfig script family.


:::

