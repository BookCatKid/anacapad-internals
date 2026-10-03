# Artifacts: Base system files

Standard Unix-era system files that every Linux-style appliance carries: the account list, the startup table, filesystem mounts, and network name resolution. They are unglamorous but they define the basic shape of the device as a small computer.

::: details Technical details

Busybox-era /etc plumbing from the limelight buildroot: user database, init table, mount table, resolver config, and protocol/service name databases.

:::

### `Configure`

The legacy configuration entry point name used by older Sonos utilities: a small script-era file the toolchain still ships for compatibility.

[View](/files/etc/Configure) · [Download](/files/etc/Configure) · 2.4 KB

::: details Preview

First 60 of 126 lines:

```
#!/bin/sh

echo "/etc/Configure: enter" > /dev/kmsg

mount -t proc proc proc
mount -t sysfs sys sys

/sbin/ifconfig lo 127.0.0.1 up

mount -t ramfs ramfs /ramdisk
mkdir -m 777 -p /ramdisk/var \
/ramdisk/var/run \
/ramdisk/var/log \
/ramdisk/tmp \
/ramdisk/tmp/pub \
/ramdisk/optlog \
/ramdisk/smb \
/dev/pts \
/dev/mtd

ln -s ../mtd0 /dev/mtd/0
ln -s mtdblock4 /dev/nandjffs
ln -s mtd4 /dev/jffsmtd
. /etc/scripts/mount_jffs.sh
sonos_mount_jffs >/dev/kmsg 2>&1

mount -t devpts none /dev/pts

/etc/init.d/Srandom

/sbin/insmod /modules/sonos_device.ko
/sbin/insmod /modules/chk.ko
/sbin/insmod /modules/hwevent_queue.ko
/sbin/insmod /modules/audiodev.ko

if [ -f /modules/ir_rcvr.ko ]; then
    /sbin/insmod /modules/ir_rcvr.ko
fi

touch /var/run/sonosledmgrd.flash_booting_led
/sbin/frcheck
frcheck_stat=$?

if [ $frcheck_stat -ne 1 ]; then
  /opt/bin/sonosledmgrd --fr

  if [ $frcheck_stat -eq 0 ]; then
    /wifi/netstartd --hard-reset
  elif [ $frcheck_stat -eq 2 ]; then
    /wifi/netstartd --soft-reset
  fi
fi

mkdir -p /jffs/app/run \
  /jffs/app/log \
  /jffs/app/debug \
  /jffs/app/debug/dsp \
  /jffs/app/settings \
  /jffs/sys/run \
  /jffs/sys/log \
```

:::

::: details Technical details

- **Path in image:** `/etc/Configure`
- **Category:** system
- **Size:** 2.4 KB (2488 bytes)
- **SHA-256:** `7820e289f6266bd6b11b02b979a700cb0c767417ef347676ac5969f26ca97460`

Historic configuration hook referenced by sibling tooling (Configure/Configure.dev naming appears in the jffs config layout too).


:::

### `arch`

A small marker file naming the hardware architecture family the image was built for.

[View](/files/etc/arch) · [Download](/files/etc/arch) · 10 B

::: details Preview

First 1 of 1 lines:

```
limelight
```

:::

::: details Technical details

- **Path in image:** `/etc/arch`
- **Category:** system
- **Size:** 10 B (10 bytes)
- **SHA-256:** `e014957c02d19fce55760cb98e40b2613f849ac985abdeef6a7a267bf55e1065`

Records the limelight architecture identifier used by scripts and tooling.


:::

### `arch_attrs`

Architecture attributes: a small data file describing the board family's properties for scripts that need to branch on hardware type.

[View](/files/etc/arch_attrs) · [Download](/files/etc/arch_attrs) · 1020 B

::: details Preview

First 54 of 54 lines:

```
HAS_ORIENTATION_SENSOR
HAS_TV_INPUT
IS_CEP20
IS_HARDWARE
IS_HT_SOURCE
IS_HT_WIRELESS_PRIMARY
IS_STILL_MANUFACTURED
IS_ZONE_PLAYER
LACKS_ASAN
LACKS_AUDIO_ENCRYPTION
LACKS_BUTTONS_KERNEL_MODULE
LACKS_CLOCK_BOOTTIME
LACKS_DIAGS_BUILD
LACKS_DSMF
LACKS_DYNAMIC_DSP
LACKS_HEAPTRACK_SUPPORT
LACKS_KERNEL_SECTION_HEADER
LACKS_LKDTM
LACKS_MIXER_STATS
LACKS_MPEGDASH
LACKS_NATIVE_WAC
LACKS_OPUS
LACKS_SETUP_PIN
LACKS_STACK_USAGE
LACKS_TSAN
LACKS_UBSAN
LACKS_WIDEVINE
LEGACY_BACKTRACE_SUPPORT
MIGHT_SUPPORT_S1
SUPPORTS_ATHEROS_DIRECT_ATTACH
SUPPORTS_AUDIODEV
SUPPORTS_AUDIODEV_SENSOR_EVENTS
SUPPORTS_CHANNEL_SCAN
SUPPORTS_CHIRP_ROOM_DETECTION_SEND
SUPPORTS_CLONE_CHECK
SUPPORTS_CPU_TEMP_REPORT
SUPPORTS_DOLBY
SUPPORTS_DTS
SUPPORTS_DUAL_SUBS
SUPPORTS_EXTERNAL_EVENTS
SUPPORTS_FFMPEG_WMA
SUPPORTS_HWEVTQ
SUPPORTS_RDM
SUPPORTS_RX_HANG_CHECK
SUPPORTS_SOUNDSWAP
SUPPORTS_STATION
SUPPORTS_SYSSW_HAL
SUPPORTS_TXRX_STATS
SUPPORTS_V2_CERTS
SUPPORTS_VLI
SUPPORTS_WIRELESS_DISABLE
SUPPORTS_WIRELESS_SETUP
USES_LLA
USES_LONG_AMP_POWER_TIMEOUT
```

:::

::: details Technical details

- **Path in image:** `/etc/arch_attrs`
- **Category:** system
- **Size:** 1020 B (1020 bytes)
- **SHA-256:** `56c5c16a238b04190906c57e617e05a4e4dcbcdb18a3adc4a24f908b42bccf8b`

Architecture attribute table consumed by board-level scripts (see Configure and soc_arch).


:::

### `dhcp.script`

The DHCP handler script: what the device does each time it receives an address from your router, including updating its name resolution and recording the lease details.

[View](/files/etc/dhcp.script) · [Download](/files/etc/dhcp.script) · 1.2 KB

::: details Preview

First 54 of 54 lines:

```
#!/bin/sh

[ -z "$1" ] && echo "Error: should be called from udhcpc" && exit 1

RESOLV_CONF="/etc/resolv.conf"
[ -n "$broadcast" ] && BROADCAST="broadcast $broadcast"
[ -n "$subnet" ] && NETMASK="netmask $subnet"

case "$1" in
	nak)
		echo received a NAK: $message
		;;

	deconfig)
		ifconfig $interface 0.0.0.0

		route del 255.255.255.255 2> /dev/null
		route add 255.255.255.255 $interface

		route del -net 224.0.0.0 netmask 240.0.0.0 2> /dev/null
		route add -net 224.0.0.0 netmask 240.0.0.0 $interface
		;;

	renew|bound)
		echo -n > $RESOLV_CONF
		[ -n "$domain" ] && echo search $domain >> $RESOLV_CONF
		for i in $dns ; do
			echo adding dns $i
			echo nameserver $i >> $RESOLV_CONF
		done

		ifconfig $interface $ip $BROADCAST $NETMASK

		if [ -n "$router" ] ; then
			while route del default gw 0.0.0.0 dev $interface 2> /dev/null ; do
				:
			done

			for i in $router ; do
				route add default gw $i dev $interface
			done
		fi

		route del 255.255.255.255 2> /dev/null
		route add 255.255.255.255 $interface

		route del -net 224.0.0.0 netmask 240.0.0.0 2> /dev/null
                route add -net 224.0.0.0 netmask 240.0.0.0 $interface

		rm /var/run/waitforip 2> /dev/null
		;;
esac

exit 0
```

:::

::: details Technical details

- **Path in image:** `/etc/dhcp.script`
- **Category:** system
- **Size:** 1.2 KB (1209 bytes)
- **SHA-256:** `e21b831e538f132d86422ead668e0f6e9c3e1d7c7f6a2e0aed4e0783e22c7f07`

udhcpc hook script; writes lease info and refreshes resolv.conf/hosts on the writable side.


:::

### `diagprocessd`

The diagnostic coprocessor helper: a tiny FIFO-driven menu the factory uses to run production-line commands over a pipe interface.

[View](/files/etc/diagprocessd) · [Download](/files/etc/diagprocessd) · 2.2 KB

::: details Preview

First 60 of 86 lines:

```
#!/bin/sh

# -- WARNING ---- WARNING ---- WARNING ---- WARNING ---- WARNING --
# DO NOT MODIFY BY HAND.
# THIS IS AUTOMATICALLY GENERATED FROM: configs/arch/limelight.toml
# ANY CHANGES MUST BE MADE ONLY TO THE CONFIG FILES, NOT HERE.
# -- WARNING ---- WARNING ---- WARNING ---- WARNING ---- WARNING --

stdin=/tmp/diagstdin
stdout=/tmp/diagstdout

if [ ! -p $stdin ]; then
    mkfifo $stdin
fi

if [ ! -p $stdout ]; then
    mkfifo $stdout
fi

while true
do
    if read line < $stdin; then
        case "$line" in
            0)
                /bin/date > $stdout 2>&1
                ;;
            1)
                /bin/ls --full-time /jffs/app/debug /jffs/sys/debug /jffs/net/debug > $stdout 2>&1
                ;;
            2)
                /bin/df > $stdout 2>&1
                ;;
            3)
                /usr/bin/du -a -d 5 -k -x /jffs | sort -rn | head -n100 > $stdout 2>&1
                ;;
            4)
                /usr/bin/free > $stdout 2>&1
                ;;
            5)
                /sbin/ifconfig > $stdout 2>&1
                ;;
            6)
                /sbin/lsmod > $stdout 2>&1
                ;;
            7)
                /bin/mount > $stdout 2>&1
                ;;
            8)
                /bin/netstat -an > $stdout 2>&1
                ;;
            9)
                /bin/ps > $stdout 2>&1
                ;;
            10)
                /sbin/route -n > $stdout 2>&1
                ;;
            11)
                /usr/sbin/brctl showmacs br0 > $stdout 2>&1
                ;;
            12)
```

:::

::: details Technical details

- **Path in image:** `/etc/diagprocessd`
- **Category:** system
- **Size:** 2.2 KB (2304 bytes)
- **SHA-256:** `b5489037250b71ffaf6f6bf22192730dd9b36da829141a0ef886dd157285a079`

mkfifo-based command loop (diagstdin/diagstdout) dispatching numbered commands; generated from configs/arch/limelight.toml per the build system.


:::

### `fallback_trusted_roots.rcb`

The backup set of root certificates: the trust anchors the player uses to check secure connections when its primary bundle is unavailable or being updated. It is the device's emergency list of who to trust.

[Download](/files/etc/fallback_trusted_roots.rcb) · 26.6 KB

::: details Technical details

- **Path in image:** `/etc/fallback_trusted_roots.rcb`
- **Category:** system
- **Size:** 26.6 KB (27215 bytes)
- **SHA-256:** `e47699bd55299b5447add14a24a04a1a1044648755ce5637267fe634aa34139e`

RCB-format certificate bundle under /etc; managed by libsonos-certval with runtime bundle updates watched for (documented under libsonos_certval).


:::

### `fstab`

The filesystem mount table: which storage areas exist (system files, the writable settings partition, temporary memory disks) and where they attach. It explains why settings survive reboots while scratch space does not.

[View](/files/etc/fstab) · [Download](/files/etc/fstab) · 501 B

::: details Preview

First 8 of 8 lines:

```
# /etc/fstab: static file system information.
#
# <file system> <mount point>   <type>  <options>               <dump>  <pass>
#/dev/root       /               auto    defaults,errors=remount-ro      0 0
/dev/mapper/crroot	/	auto	noatime,nodiratime,defaults     0 0
proc            /proc           proc    defaults                        0 0
none            /dev/pts        devpts  gid=5,mode=620                  0 0
tmpfs           /dev/shm        tmpfs   defaults,noexec,nodev,nosuid,mode=600  0 0
```

:::

::: details Technical details

- **Path in image:** `/etc/fstab`
- **Category:** system
- **Size:** 501 B (501 bytes)
- **SHA-256:** `f8d2d28e0d0f6c3f37b2a5635f02d9801d5f9b5b7e257891fe79ac6b19706af4`

Mounts jffs2 (persistent) alongside tmpfs runtime dirs; the rootfs itself is read-only squashfs.


:::

### `group`

The group list matching the account file: which user groups exist on the device.

[View](/files/etc/group) · [Download](/files/etc/group) · 504 B

::: details Preview

First 44 of 44 lines:

```
root:x:0:
daemon:x:1:
bin:x:2:
sys:x:3:
adm:x:4:
tty:x:5:
disk:x:6:
lp:x:7:
mail:x:8:
news:x:9:
uucp:x:10:
man:x:12:
proxy:x:13:
kmem:x:15:
chrony:x:19:
sonos:x:20:
fax:x:21:
voice:x:22:
cdrom:x:24:
floppy:x:25:
tape:x:26:
sudo:x:27:
audio:x:29:
dip:x:30:
www-data:x:33:
backup:x:34:
operator:x:37:
list:x:38:
irc:x:39:
src:x:40:
gnats:x:41:
shadow:x:42:
utmp:x:43:
video:x:44:
sasl:x:45:
plugdev:x:46:
kvm:x:47:
sgx:x:48:
staff:x:50:
games:x:60:
shutdown:x:70:
wheel:x:80:
users:x:100:
nogroup:x:65534:
```

:::

::: details Technical details

- **Path in image:** `/etc/group`
- **Category:** system
- **Size:** 504 B (504 bytes)
- **SHA-256:** `662a6eac5e3759afce5eaee7200c75525d8ffae965c9d958a60d5a9d8180668c`

Standard group file; mostly stock groups plus the anacapa service account.


:::

### `hosts.orig`

The original hosts file: a few built-in name shortcuts the firmware ships with before the system generates its working copy at boot.

[View](/files/etc/hosts.orig) · [Download](/files/etc/hosts.orig) · 100 B

::: details Preview

First 3 of 3 lines:

```
127.0.0.1       localhost.localdomain   localhost
255.255.255.255 all-ones                all-ones

```

:::

::: details Technical details

- **Path in image:** `/etc/hosts.orig`
- **Category:** system
- **Size:** 100 B (100 bytes)
- **SHA-256:** `cc9e641227208bec49d4f7b234aeb564656daa63b4ab542e4a70cba6c12bb828`

Template copied to /jffs/hosts during bring-up (the generated live file sits on the writable side).


:::

### `inittab`

The startup table: the ordered list of what the device runs when it boots, including which console and service launchers come up and in what order. It is the first page of the boot story.

[View](/files/etc/inittab) · [Download](/files/etc/inittab) · 679 B

::: details Preview

First 14 of 14 lines:

```
# autogenerated by gen_inittab.py for ARCH limelight; DO NOT EDIT
::sysinit:/etc/Configure > /dev/kmsg 2>&1
null::respawn:/etc/scripts/run_sshd.sh > /dev/kmsg 2>&1
null::respawn:/etc/runledmgrd > /dev/kmsg 2>&1
null::respawn:/etc/runnetstartd > /dev/kmsg 2>&1
null::respawn:/etc/runmdns > /dev/kmsg 2>&1
null::respawn:/etc/rundiagprocessd > /dev/kmsg 2>&1
null::respawn:/etc/runanacapa > /dev/kmsg 2>&1
null::respawn:/etc/runchrony > /dev/kmsg 2>&1
null::respawn:/etc/runsddp > /dev/kmsg 2>&1
null::respawn:/usr/sbin/secure_console_login.sh /dev/ttyS0 0 -n -l /usr/sbin/secure_console.sh > /dev/kmsg 2>&1
::ctrlaltdel:/sbin/reboot
::shutdown:/etc/init.d/rcK
::restart:/sbin/init
```

:::

::: details Technical details

- **Path in image:** `/etc/inittab`
- **Category:** system
- **Size:** 679 B (679 bytes)
- **SHA-256:** `44c96d00788087c4e852552c19a557abe6642b4fcdfc4ef543a53dc1ad32a3ec`

SysV-style inittab for busybox init; wires getty, the rc.d runlevels, and the rcK shutdown sequence.


:::

### `inputrc`

Readline keybinding configuration: how command-line editing behaves in an interactive shell session.

[View](/files/etc/inputrc) · [Download](/files/etc/inputrc) · 421 B

::: details Preview

First 12 of 12 lines:

```
# /etc/inputrc - global inputrc for libreadline
# See readline(3readline) and `info readline' for more information.

# Be 8 bit clean.
set input-meta on
set output-meta on

# To allow the use of 8bit-characters like the german umlauts, comment out
# the line below. However this makes the meta key not work as a meta key,
# which is annoying to those which don't need to type in 8-bit characters.

# set convert-meta off
```

:::

::: details Technical details

- **Path in image:** `/etc/inputrc`
- **Category:** system
- **Size:** 421 B (421 bytes)
- **SHA-256:** `01946fd5134804a8f5ba087fb4fe9dbf17f450213e8a47b9973eec167a588fd2`

Standard inputrc for readline-based shells.


:::

### `issue`

The login banner text shown before a login prompt on a console. On most appliances it is leftover decoration, but it is part of the image.

[View](/files/etc/issue) · [Download](/files/etc/issue) · 29 B

::: details Preview

First 3 of 3 lines:

```

Welcome to Rincon Networks

```

:::

::: details Technical details

- **Path in image:** `/etc/issue`
- **Category:** system
- **Size:** 29 B (29 bytes)
- **SHA-256:** `c99e814fd5e8a7a6753ab2a693bc2451f225d64723f8e513b11dddc158ebe19a`

Stock /etc/issue banner.


:::

### `issue.net`

The network variant of the login banner, shown by remote login services such as the SSH daemon when a session opens.

[View](/files/etc/issue.net) · [Download](/files/etc/issue.net) · 38 B

::: details Preview

First 4 of 4 lines:

```

Welcome to Rincon Networks
%s/%m %r

```

:::

::: details Technical details

- **Path in image:** `/etc/issue.net`
- **Category:** system
- **Size:** 38 B (38 bytes)
- **SHA-256:** `b2efa8dd090865fb16c2a2246992cdc1514fb6afa1589627f80cf72fef62e7c5`

Banner presented by dropbear/ssh on connect.


:::

### `motd`

The 'message of the day' text shown after login. On a shipping appliance it is usually a placeholder.

[View](/files/etc/motd) · [Download](/files/etc/motd) · 29 B

::: details Preview

First 3 of 3 lines:

```

Welcome to Rincon Networks

```

:::

::: details Technical details

- **Path in image:** `/etc/motd`
- **Category:** system
- **Size:** 29 B (29 bytes)
- **SHA-256:** `c99e814fd5e8a7a6753ab2a693bc2451f225d64723f8e513b11dddc158ebe19a`

Standard motd file.


:::

### `mtab`

The file reporting which filesystems are currently mounted. On this build it is a link into the kernel's live mount list rather than a static file.

[View](/files/etc/mtab) · [Download](/files/etc/mtab) · 193 B

::: details Preview

First 7 of 7 lines:

```
rootfs / rootfs rw 0 0
/dev/root / ext3 rw 0 0
/proc /proc proc rw 0 0
usbdevfs /proc/bus/usb usbdevfs rw 0 0
/dev/hda1 /boot ext3 rw 0 0
none /dev/pts devpts rw 0 0
none /dev/shm tmpfs rw 0 0
```

:::

::: details Technical details

- **Path in image:** `/etc/mtab`
- **Category:** system
- **Size:** 193 B (193 bytes)
- **SHA-256:** `2b4f42d7e66f82fe677f6b514512f877cee048147a8ccdd87a33848d882c2206`

Symlink to /proc/mounts (live kernel view), standard on embedded systems.


:::

### `passwd`

The device's account list: which usernames exist on the box (root, the web user, the player software's own user, and the usual service accounts). This is the classic Unix roster, present on almost every Linux appliance.

[View](/files/etc/passwd) · [Download](/files/etc/passwd) · 868 B

::: details Preview

First 20 of 20 lines:

```
root:x:0:0:root:/:/bin/sh
daemon:x:1:1:daemon:/usr/sbin:/sbin/nologin
bin:x:2:2:bin:/bin:/sbin/nologin
sys:x:3:3:sys:/dev:/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/sbin/nologin
man:x:6:12:man:/var/cache/man:/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/sbin/nologin
mail:x:8:8:mail:/var/mail:/sbin/nologin
news:x:9:9:news:/var/spool/news:/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/sbin/nologin
proxy:x:13:13:proxy:/bin:/sbin/nologin
chrony:x:19:19::/tmp:/bin/false
anacapa:x:20:20::/tmp:/bin/false
www-data:x:33:33:www-data:/var/www:/sbin/nologin
backup:x:34:34:backup:/var/backups:/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/sbin/nologin
```

:::

::: details Technical details

- **Path in image:** `/etc/passwd`
- **Category:** system
- **Size:** 868 B (868 bytes)
- **SHA-256:** `a44fe8e73007ba8dba381d054e99bda955bb1a7d39ed5403187a40be906296b8`

Standard passwd file. No password hashes here (those live in shadow); notable entries: root, chrony, anacapa (uid 20), www-data.


:::

### `pointercal`

Touchscreen calibration parameters. The Playbar has no touchscreen; this file is inherited from the shared base image that also serves products that do.

[View](/files/etc/pointercal) · [Download](/files/etc/pointercal) · 14 B

::: details Preview

First 1 of 1 lines:

```
1 0 0 0 1 0 1
```

:::

::: details Technical details

- **Path in image:** `/etc/pointercal`
- **Category:** system
- **Size:** 14 B (14 bytes)
- **SHA-256:** `2e7213cec5f47e7e9aade9d17b6d565d64395a39a1117f6dac56ce079478a84b`

Calibrate-touchscreen constants retained from the common buildroot; vestigial on this model.


:::

### `profile`

The shell profile: environment defaults applied when a login shell starts, such as search paths for commands.

[View](/files/etc/profile) · [Download](/files/etc/profile) · 375 B

::: details Preview

First 18 of 18 lines:

```
# /etc/profile: system-wide .profile file for the Bourne shell (sh(1))
# and Bourne compatible shells (bash(1), ksh(1), ash(1), ...).

PATH="/usr/bin:/bin:/usr/sbin:/sbin"
if [ -f /proc/sonos-lock/fallback_state ] ; then
	if [ "`cat /proc/sonos-lock/fallback_state`" != "0" ]; then
		PS1='Fallback# ' ;
	else
		PS1='# ' ;
	fi
else
	PS1='# ' ;
fi

export PATH PS1

umask 022

```

:::

::: details Technical details

- **Path in image:** `/etc/profile`
- **Category:** system
- **Size:** 375 B (375 bytes)
- **SHA-256:** `3b4fd21ee8a7ad3a7de4894e7515759cfaf54cf0448810e900a1bc11a7fe5275`

System-wide shell profile for the busybox environment.


:::

### `protocols`

The protocol-name database: the table mapping names like 'tcp' and 'udp' to their protocol numbers, a classic Unix leftover that networking tools still consult.

[View](/files/etc/protocols) · [Download](/files/etc/protocols) · 5.7 KB

::: details Preview

First 60 of 149 lines:

```
# /etc/protocols:
# $Id: protocols,v 1.3 2001/07/07 07:07:15 nalin Exp $
#
# Internet (IP) protocols
#
#	from: @(#)protocols	5.1 (Berkeley) 4/17/89
#
# Updated for NetBSD based on RFC 1340, Assigned Numbers (July 1992).
#
# See also http://www.iana.org/assignments/protocol-numbers

ip	0	IP		# internet protocol, pseudo protocol number
#hopopt	0	HOPOPT		# hop-by-hop options for ipv6
icmp	1	ICMP		# internet control message protocol
igmp	2	IGMP		# internet group management protocol
ggp	3	GGP		# gateway-gateway protocol
ipencap	4	IP-ENCAP	# IP encapsulated in IP (officially ``IP'')
st	5	ST		# ST datagram mode
tcp	6	TCP		# transmission control protocol
cbt	7	CBT		# CBT, Tony Ballardie <A.Ballardie@cs.ucl.ac.uk>
egp	8	EGP		# exterior gateway protocol
igp	9	IGP		# any private interior gateway (Cisco: for IGRP)
bbn-rcc	10	BBN-RCC-MON	# BBN RCC Monitoring
nvp	11	NVP-II		# Network Voice Protocol
pup	12	PUP		# PARC universal packet protocol
argus	13	ARGUS		# ARGUS
emcon	14	EMCON		# EMCON
xnet	15	XNET		# Cross Net Debugger
chaos	16	CHAOS		# Chaos
udp	17	UDP		# user datagram protocol
mux	18	MUX		# Multiplexing protocol
dcn	19	DCN-MEAS	# DCN Measurement Subsystems
hmp	20	HMP		# host monitoring protocol
prm	21	PRM		# packet radio measurement protocol
xns-idp	22	XNS-IDP		# Xerox NS IDP
trunk-1	23	TRUNK-1		# Trunk-1
trunk-2	24	TRUNK-2		# Trunk-2
leaf-1	25	LEAF-1		# Leaf-1
leaf-2	26	LEAF-2		# Leaf-2
rdp	27	RDP		# "reliable datagram" protocol
irtp	28	IRTP		# Internet Reliable Transaction Protocol
iso-tp4	29	ISO-TP4		# ISO Transport Protocol Class 4
netblt	30	NETBLT		# Bulk Data Transfer Protocol
mfe-nsp	31	MFE-NSP		# MFE Network Services Protocol
merit-inp	32	MERIT-INP	# MERIT Internodal Protocol
sep	33	SEP		# Sequential Exchange Protocol
3pc	34	3PC		# Third Party Connect Protocol
idpr	35	IDPR		# Inter-Domain Policy Routing Protocol
xtp	36	XTP		# Xpress Tranfer Protocol
ddp	37	DDP		# Datagram Delivery Protocol
idpr-cmtp	38	IDPR-CMTP	# IDPR Control Message Transport Proto
tp++	39	TP++		# TP++ Transport Protocol
il	40	IL		# IL Transport Protocol
ipv6	41	IPv6		# IPv6
sdrp	42	SDRP		# Source Demand Routing Protocol
ipv6-route	43	IPv6-Route 	# Routing Header for IPv6
ipv6-frag	44	IPv6-Frag	# Fragment Header for IPv6
idrp	45	IDRP		# Inter-Domain Routing Protocol
rsvp	46	RSVP		# Resource ReSerVation Protocol
gre	47	GRE		# Generic Routing Encapsulation
```

:::

::: details Technical details

- **Path in image:** `/etc/protocols`
- **Category:** system
- **Size:** 5.7 KB (5834 bytes)
- **SHA-256:** `aa00b2cb0b6f77291c6e244774438f367e1407cb96e6c76189451243c26d9ca1`

Standard protocols database.


:::

### `rpc`

The RPC program-number table, another standard Unix database file mapping remote-procedure names to numbers.

[View](/files/etc/rpc) · [Download](/files/etc/rpc) · 1.6 KB

::: details Preview

First 60 of 68 lines:

```
#ident	"@(#)rpc	1.11	95/07/14 SMI"	/* SVr4.0 1.2	*/
#
#	rpc
#
portmapper	100000	portmap sunrpc rpcbind
rstatd		100001	rstat rup perfmeter rstat_svc
rusersd		100002	rusers
nfs		100003	nfsprog
ypserv		100004	ypprog
mountd		100005	mount showmount
ypbind		100007
walld		100008	rwall shutdown
yppasswdd	100009	yppasswd
etherstatd	100010	etherstat
rquotad		100011	rquotaprog quota rquota
sprayd		100012	spray
3270_mapper	100013
rje_mapper	100014
selection_svc	100015	selnsvc
database_svc	100016
rexd		100017	rex
alis		100018
sched		100019
llockmgr	100020
nlockmgr	100021
x25.inr		100022
statmon		100023
status		100024
bootparam	100026
ypupdated	100028	ypupdate
keyserv		100029	keyserver
sunlink_mapper	100033
tfsd		100037
nsed		100038
nsemntd		100039
showfhd		100043	showfh
ioadmd		100055	rpc.ioadmd
NETlicense	100062
sunisamd	100065
debug_svc 	100066  dbsrv
ypxfrd		100069  rpc.ypxfrd
bugtraqd	100071
kerbd		100078
event		100101	na.event	# SunNet Manager
logger		100102	na.logger	# SunNet Manager
sync		100104	na.sync
hostperf	100107	na.hostperf
activity	100109	na.activity	# SunNet Manager
hostmem		100112	na.hostmem
sample		100113	na.sample
x25		100114	na.x25
ping		100115	na.ping
rpcnfs		100116	na.rpcnfs
hostif		100117	na.hostif
etherif		100118	na.etherif
iproutes	100120	na.iproutes
layers		100121	na.layers
snmp		100122	na.snmp snmp-cmc snmp-synoptics snmp-unisys snmp-utk
traffic		100123	na.traffic
nfs_acl		100227
```

:::

::: details Technical details

- **Path in image:** `/etc/rpc`
- **Category:** system
- **Size:** 1.6 KB (1595 bytes)
- **SHA-256:** `ebc43541c32b314942f92b105755b192ac8451e0e50e9a5c196e3b02c4a789a7`

Standard RPC database; part of the buildroot base image.


:::

### `services`

The service-name database: which named services correspond to which port numbers (http = 80 and so on). Networking code consults it when translating names.

[View](/files/etc/services) · [Download](/files/etc/services) · 15.0 KB

::: details Preview

First 60 of 407 lines:

```
# /etc/services:
# $Id: services,v 1.4 1997/05/20 19:41:21 tobias Exp $
#
# Network services, Internet style
#
# Note that it is presently the policy of IANA to assign a single well-known
# port number for both TCP and UDP; hence, most entries here have two entries
# even if the protocol doesn't support UDP operations.
# Updated from RFC 1700, ``Assigned Numbers'' (October 1994).  Not all ports
# are included, only the more common ones.

tcpmux		1/tcp				# TCP port service multiplexer
echo		7/tcp
echo		7/udp
discard		9/tcp		sink null
discard		9/udp		sink null
systat		11/tcp		users
daytime		13/tcp
daytime		13/udp
netstat		15/tcp
qotd		17/tcp		quote
msp		18/tcp				# message send protocol
msp		18/udp				# message send protocol
chargen		19/tcp		ttytst source
chargen		19/udp		ttytst source
ftp-data	20/tcp
ftp		21/tcp
fsp		21/udp		fspd
ssh		22/tcp				# SSH Remote Login Protocol
ssh		22/udp				# SSH Remote Login Protocol
telnet		23/tcp
# 24 - private
smtp		25/tcp		mail
# 26 - unassigned
time		37/tcp		timserver
time		37/udp		timserver
rlp		39/udp		resource	# resource location
nameserver	42/tcp		name		# IEN 116
whois		43/tcp		nicname
re-mail-ck	50/tcp				# Remote Mail Checking Protocol
re-mail-ck	50/udp				# Remote Mail Checking Protocol
domain		53/tcp		nameserver	# name-domain server
domain		53/udp		nameserver
mtp		57/tcp				# deprecated
bootps		67/tcp				# BOOTP server
bootps		67/udp
bootpc		68/tcp				# BOOTP client
bootpc		68/udp
tftp		69/udp
gopher		70/tcp				# Internet Gopher
gopher		70/udp
rje		77/tcp		netrjs
finger		79/tcp
www		80/tcp		http		# WorldWideWeb HTTP
www		80/udp				# HyperText Transfer Protocol
link		87/tcp		ttylink
kerberos	88/tcp		kerberos5 krb5 kerberos-sec	# Kerberos v5
kerberos	88/udp		kerberos5 krb5 kerberos-sec	# Kerberos v5
supdup		95/tcp
# 100 - reserved
```

:::

::: details Technical details

- **Path in image:** `/etc/services`
- **Category:** system
- **Size:** 15.0 KB (15319 bytes)
- **SHA-256:** `9bc2ae7e79ef825a57eecb90681b0d9e2415fe8fc1be0cc5a2ecefebfb3ac611`

Standard services database.


:::

### `shadow`

The account password table. It shows a factory-set root password hash plus locked service accounts, which is normal for an appliance where root login is not meant to be used day to day.

*Security-sensitive file: it is published firmware data and stays downloadable, but its contents are not previewed inline.*

[Download](/files/etc/shadow) · 565 B

::: details Technical details

- **Path in image:** `/etc/shadow`
- **Category:** system
- **Size:** 565 B (565 bytes)
- **SHA-256:** `0150ca4b759cfeb1d1df4d2f819b55b5db556a24bdd11399652df3269df7ed68`

MD5-crypt ($1$) root hash as shipped. This is a published firmware default, not a per-device secret; the diag build history around SSH access is documented under ssh_authorized_keys and the secure_console scripts.


:::

### `shells`

The list of shells the system considers legal login shells. Mostly boilerplate on an appliance.

[View](/files/etc/shells) · [Download](/files/etc/shells) · 53 B

::: details Preview

First 5 of 5 lines:

```
/bin/bash
/bin/sh
/bin/ash
/bin/ash.static
/bin/sash
```

:::

::: details Technical details

- **Path in image:** `/etc/shells`
- **Category:** system
- **Size:** 53 B (53 bytes)
- **SHA-256:** `82f4ce9af632497f688c4e48917e6f8aa00ad959677a4980731ef1dfd983b58d`

Standard shells file.


:::

### `soc_arch`

The system-on-chip identifier: which processor family this firmware targets.

[View](/files/etc/soc_arch) · [Download](/files/etc/soc_arch) · 10 B

::: details Preview

First 1 of 1 lines:

```
limelight
```

:::

::: details Technical details

- **Path in image:** `/etc/soc_arch`
- **Category:** system
- **Size:** 10 B (10 bytes)
- **SHA-256:** `e014957c02d19fce55760cb98e40b2613f849ac985abdeef6a7a267bf55e1065`

SoC family marker used by the launch and diagnostic scripts.


:::

