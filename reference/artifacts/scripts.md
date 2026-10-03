# Artifacts: Boot and service scripts

Small shell scripts that start and stop the device's programs in the right order, bring the network up, and recover when something crashes. Reading them is the clearest way to see how the player actually boots.

::: details Technical details

POSIX shell launchers and lifecycle scripts under /etc; they glue the kernel, the sibling daemons, and anacapad together during boot, shutdown, and reset.

:::

### `Krandom`

The shutdown-time entropy script: preserves randomness state across reboots so the device's cryptographic operations do not restart from a predictable seed.

[View](/files/etc/init.d/Krandom) · [Download](/files/etc/init.d/Krandom) · 499 B

::: details Preview

First 17 of 17 lines:

```
#!/bin/sh
echo "Saving random seed..."
random_seed=/jffs/random-seed
touch $random_seed
chmod 600 $random_seed
poolfile=/proc/sys/kernel/random/poolsize
#  linux 2.4 has the poolsize in bytes, >= 2.6 in bits
case `uname -r` in
    2.4.*)
        [ -r $poolfile ] && bytes=`cat $poolfile` || bytes=512
        ;;
    *)
        [ -r $poolfile ] && bits=`cat $poolfile` || bits=4096
        bytes=$(expr $bits / 8)
        ;;
esac
dd if=/dev/urandom "of=$random_seed" count=1 "bs=$bytes" 2> /dev/null
```

:::

::: details Technical details

- **Path in image:** `/etc/init.d/Krandom`
- **Category:** scripts
- **Size:** 499 B (499 bytes)
- **SHA-256:** `43ba173153df8d85b25e6257324ea471938a7bd0cd1ce12faeea81791ba50b0f`

Saves/restores the random seed (cf. /jffs/random-seed) in the K-order shutdown sequence.


:::

### `Srandom`

The boot-time entropy script: seeds the random number generator early so keys, tokens, and nonces are unpredictable from the very first connection.

[View](/files/etc/init.d/Srandom) · [Download](/files/etc/init.d/Srandom) · 246 B

::: details Preview

First 8 of 8 lines:

```
#!/bin/sh
echo "Initializing random number generator..."
random_seed=/jffs/random-seed
# Carry a random seed from start-up to start-up
# Load and then save the whole entropy pool
if [ -f $random_seed ]; then
    cat $random_seed >/dev/urandom
fi
```

:::

::: details Technical details

- **Path in image:** `/etc/init.d/Srandom`
- **Category:** scripts
- **Size:** 246 B (246 bytes)
- **SHA-256:** `0a52cb3a89b1b93982143ba9bfc9f426249e4a6dfc7090887798f91e39635219`

Restores /jffs/random-seed into urandom at boot (S-order init step).


:::

### `rcK`

The kill script: the ordered teardown list run at shutdown or reboot, stopping services in the right sequence before power-off.

[View](/files/etc/init.d/rcK) · [Download](/files/etc/init.d/rcK) · 719 B

::: details Preview

First 35 of 35 lines:

```
#!/bin/sh
# Preserve seed
/etc/init.d/Krandom

daemonkill() {
    for daemon in sonosledmgrd sonosdiagd \
	sonospowercoordinator anacapad chronyd sddpd \
	dropbear netstartd mdnsd udhcpc rngd ; do
	killall -$1 $daemon 2> /dev/null
    done
}

for stop in stopupgrade stopledmgrd stopdiagapp \
    stopsonospowercoordinator \
    stopmdns stopdiagprocessd stopanacapa stopchrony stopsddp stopnetstartd; do
    touch /var/run/$stop
done

echo Sending SIGTERM
daemonkill TERM
sync
sleep 2

echo Sending SIGKILL
daemonkill KILL
sync
sleep 1

if [ -x /etc/scripts/ampmcu-down.sh ]; then
    echo Disabling AMPMCU instances
    /etc/scripts/ampmcu-down.sh
fi

echo Unmounting /jffs
grep -q /jffs /proc/mounts && umount /jffs
```

:::

::: details Technical details

- **Path in image:** `/etc/init.d/rcK`
- **Category:** scripts
- **Size:** 719 B (719 bytes)
- **SHA-256:** `1970b0bb740fb4d244af646e2567fb6f16aaea2c9cbf2987403605058729e08b`

Init runlevel-K aggregation; pairs with the inittab shutdown entries.


:::

### `runanacapa`

The launcher for the main player software: the script that starts anacapad with its config file, drops privileges to its own user, and sets up its environment. The player's whole life starts here at every boot.

[View](/files/etc/runanacapa) · [Download](/files/etc/runanacapa) · 568 B

::: details Preview

First 28 of 28 lines:

```
#!/bin/sh

. /etc/rundaemon.sh

trackrestart anacapa /var/run/anacapa.start 1

if [ -f /var/run/upgradeinfo ]; then
    mkdir /tmp
    rm /jffs/upgrade_tmp_prev.log
    mv /tmp/upgrade.log /jffs/upgrade_tmp_prev.log
    echo Running upgrade ...
    /bin/upgrade >> /tmp/upgrade.log 2>&1
    rr=$?
    echo RESULT = $rr >> /tmp/upgrade.log
    rm /var/run/upgradeinfo
    exit $rr
fi
for X in /tmp/smb/*
do 
    if [ -d "$X" ] 
    then
        umount "$X"
        rmdir "$X"
    fi
done
waitwhiletrue "[ -f /var/run/stopanacapa ]"

exec /opt/bin/anacapactl start-demo
```

:::

::: details Technical details

- **Path in image:** `/etc/runanacapa`
- **Category:** scripts
- **Size:** 568 B (568 bytes)
- **SHA-256:** `3c701e472a5ea6ff664deb092dbecbb1642e12799f8f92095955dc0e3cc999fb`

Launches 'anacapad -c /opt/conf/anacapa.conf -u anacapa -C all=eip' with the pid file at /opt/log/anacapa.pid; supports gdb-wrapped debug starts and the demo-mode direct exec (documented on the rootfs_boot_chain entry).


:::

### `runchrony`

The launcher for the time-sync daemon: starts the component that keeps the speaker's clock correct, which everything from multi-room sync to alarm timing depends on.

[View](/files/etc/runchrony) · [Download](/files/etc/runchrony) · 2.8 KB

::: details Preview

First 60 of 70 lines:

```
#!/bin/sh

#####
# Handler script for chronyd, the NTP daemon which sets the system clock.
# This is meant to be run in perpetuity thanks to the inittab.
# If you must use another technique to set the system clock, touch
# /var/run/stopchrony and run `killall chronyd` first.
#
# chrony detects errors in the system clock relative to the real UTC time it
# determines by polling NTP servers. These errors can be either "small" or
# "big" (see all/mtools/gen_chronyconf.py for the threshhold between these).
# Whenever it's running, chronyd corrects small errors by "slewing" the system
# clock (adjusting how fast it ticks so that it matches up with UTC time fairly
# quickly, but not immediately). When clock errors are big, chronyd can correct
# them by instead "stepping" the system clock (correcting it immediately).
# Stepping the clock can theoretically be dangerous to running processes, so we
# only let chronyd do it once per operation.
#####
. /etc/rundaemon.sh

trackrestart chrony /var/run/chrony.start

# Wait until the platform has an IP address AND a DNS server is available:
# until both conditions are met, chronyd cannot make forward progress.
waitfordns

waitwhiletrue "[ -f /var/run/stopchrony ]"

# Set up directories chrony needs
mkdir -p /jffs/chrony
chown -R chrony:sonos /jffs/chrony
mkdir -p /var/lib/chrony
chown -R chrony:sonos /var/lib/chrony

# It's possible (though rare) for the system clock to get set too far ahead of
# detected NTP time. If this happens, chrony logs this, increments the count in
# this file, and exits. We restart chrony in case we got unlucky and synced with
# bad servers, but to prevent perpetual restarting, we do so less and less
# frequently the more we fail.
#
# If an RTC is present, we set its value to match the detected NTP time,
# so that if forward drift of the RTC was the cause of the system clock's
# inaccuracy, the system clock will be set more accurately during the next
# reboot.
if [ -f /var/lib/chrony/sync_failure_count ]; then
  if grep -Fxq HAS_RTC /etc/arch_attrs && \
     [ -f /var/lib/chrony/sync_time_offset ]; then
    hwclock -u -w$(cat /var/lib/chrony/sync_time_offset)
  fi
  fail_count=$(cat /var/lib/chrony/sync_failure_count)
  if [ $fail_count -eq 1 ]; then
    echo "sysclock uncorrectably fast of true; trying again in 5 minutes"
    sleep 300
  elif [ $fail_count -eq 2 ]; then
    echo "sysclock uncorrectably fast of true; trying again in 30 minutes"
    sleep 1800
  else
    echo "sysclock uncorrectably fast of true; trying again in 60 minutes"
    sleep 3600
  fi
```

:::

::: details Technical details

- **Path in image:** `/etc/runchrony`
- **Category:** scripts
- **Size:** 2.8 KB (2851 bytes)
- **SHA-256:** `dca6c5babccbc7a1166106912ea0dc736aab27c10a2a3effb12457e55934194f`

Starts chronyd against /etc/chrony.conf; drift persisted to /jffs/chrony.


:::

### `rundaemon.sh`

A shared daemon-runner script: a generic wrapper used to start background services with the right bookkeeping instead of each launcher reinventing it.

[View](/files/etc/rundaemon.sh) · [Download](/files/etc/rundaemon.sh) · 847 B

::: details Preview

First 35 of 35 lines:

```
# waitwhiletrue executes a shell command until it returns false, sleeping
# 10 seconds between retries
waitwhiletrue() {
    while eval "$1"; do
	sleep 10
    done
}

# waitfordns waits until DNS and networking are available
# Wait until the platform has an IP address AND a DNS server is available:
waitfordns() {
    while [ -f /var/run/waitforip ] || ! grep -qs nameserver /etc/resolv.conf; do
	sleep 1
    done
}

# trackrestart tracks starts/restarts
# trackrestart daemon-name track-file <optional sleep time>
trackrestart() {
    if [ -f $2 ]; then
	echo "Restarting $1 - last started" `tail -n -1 $2`
	if [ -n "$3" ]; then
	    sleep $3
	else
	    sleep 5
	fi	    
    fi
    date >> $2
}

# waitwhilestopped waits while a daemon is stopped
# waitwhilestopped daemon-stop-name
waitwhilestopped() {
    waitwhiletrue "[ -f /var/run/$1 ]"
}
```

:::

::: details Technical details

- **Path in image:** `/etc/rundaemon.sh`
- **Category:** scripts
- **Size:** 847 B (847 bytes)
- **SHA-256:** `6f76a74572f19e09223d9876b30b0d9bef2dfaf4036529bf7aa6a5a55f4a7c38`

Generic daemon launcher shared by the run* scripts; also referenced by the sibling-daemon IPC work (see multi_daemon_boundary).


:::

### `rundiagprocessd`

The launcher for the diagnostic coprocessor menu: brings up the FIFO command interface used for factory and service diagnostics.

[View](/files/etc/rundiagprocessd) · [Download](/files/etc/rundiagprocessd) · 160 B

::: details Preview

First 9 of 9 lines:

```
#!/bin/sh

. /etc/rundaemon.sh

trackrestart diagprocessd /var/run/diagprocessd.start

waitwhiletrue "[ -f /var/run/stopdiagprocessd ]"

exec /etc/diagprocessd
```

:::

::: details Technical details

- **Path in image:** `/etc/rundiagprocessd`
- **Category:** scripts
- **Size:** 160 B (160 bytes)
- **SHA-256:** `391f9002a197c91e482230680636757415fdfd2b26e8fc90ba8e9983af9003ff`

Starts the /etc/diagprocessd FIFO loop.


:::

### `runledmgrd`

The launcher for the LED manager daemon: starts the little program that owns the speaker's lights and runs the animated patterns.

[View](/files/etc/runledmgrd) · [Download](/files/etc/runledmgrd) · 995 B

::: details Preview

First 27 of 27 lines:

```
#!/bin/sh

. /etc/rundaemon.sh

trackrestart sonosledmgrd /var/run/sonosledmgrd.start

while [ -f /var/run/stopledmgrd ] || [ -e /var/run/sonosledmgrd.pid ]; do
    # If we are not deliberately stopping and a pid file exists, check to make
    # sure that the pid is actually running. If not, the process has exited abnormally
    # and needs to be kicked after logging a message.
    if  [ ! -f /var/run/stopledmgrd ]; then
        curpid=`pidof sonosledmgrd`
        if [ $? = 1 ]; then
            pid=`cat /var/run/sonosledmgrd.pid`
            _dat=`date "+%h %d %H:%m:%S runledmgrd"`
            # this is a system daemon.. so use '3' for message priority
            echo "<3> $_dat LED Manager PID $pid is stale. Likely caused by an abnormal exit. Check logs. Restarting LED Manager" >> /opt/log/sonosledmgrd.log
            unset _dat
            unset pid
            break
        fi
        unset curpid
    fi
    sleep 5
done
echo "Starting LED Manager"
exec /opt/bin/sonosledmgrd
```

:::

::: details Technical details

- **Path in image:** `/etc/runledmgrd`
- **Category:** scripts
- **Size:** 995 B (995 bytes)
- **SHA-256:** `5dd6c8b9b8e4ea32fecd923aa6b281ef4037199b1e477c6f9de912f79ab3a2b2`

Starts sonosledmgrd; the daemon owns /dev/ledctl and the LED scripting engine documented in led_engine.


:::

### `runmdns`

The launcher for the discovery daemon: starts the service that announces the speaker on the network and finds its siblings.

[View](/files/etc/runmdns) · [Download](/files/etc/runmdns) · 94 B

::: details Preview

First 7 of 7 lines:

```
#!/bin/sh

. /etc/rundaemon.sh

waitwhiletrue "[ -f /var/run/stopmdns ]"

exec /sbin/mdnsd -f
```

:::

::: details Technical details

- **Path in image:** `/etc/runmdns`
- **Category:** scripts
- **Size:** 94 B (94 bytes)
- **SHA-256:** `3172ecf3a73d634a681441d73e371ac41e47e62e5eccc4989f5fb0e8541350b2`

Starts mdnsd for multicast-DNS announce/browse; feeds the discovery_layer machinery.


:::

### `runnetstartd`

The launcher for the network-startup daemon: starts the component that brings up WiFi and Ethernet in the right order during boot and setup.

[View](/files/etc/runnetstartd) · [Download](/files/etc/runnetstartd) · 134 B

::: details Preview

First 9 of 9 lines:

```
#!/bin/sh

. /etc/rundaemon.sh

trackrestart netstartd /var/run/netstartd.start

waitwhilestopped stopnetstartd

exec /wifi/netstartd
```

:::

::: details Technical details

- **Path in image:** `/etc/runnetstartd`
- **Category:** scripts
- **Size:** 134 B (134 bytes)
- **SHA-256:** `79a483bfb764152467a90515b8c597b7381e64a0ddee82823840f1b7705bf3a8`

Starts netstartd, the process anacapad talks to over /tmp/netstartd.ipc for network state and setup transitions.


:::

### `runsddp`

The launcher for the device-announcement daemon: starts the broadcaster that keeps the household map populated.

[View](/files/etc/runsddp) · [Download](/files/etc/runsddp) · 651 B

::: details Preview

First 26 of 26 lines:

```
#!/bin/sh

#####
# Handler script for sddpd, the Device Discovery Protocol daemon developed
# by Control4. This is meant to be run in perpetuity thanks to the inittab.
# If you must use another technique for SDDP, touch
# /var/run/stopsddp and run `killall sddpd`.
#####

. /etc/rundaemon.sh

trackrestart sddpd /var/run/sddpd.start

# sddpd requires IP and DNS.
waitfordns

waitwhiletrue "[ -f /var/run/stopsddp ]"

sddpd_opts="-n" # don't daemonize

if [ -f /jffs/dev_sddp.conf ]; then
  echo "Found /jffs/dev_sddp.conf; using it instead of default /etc/sddp.conf."
  sddpd_opts="$sddpd_opts -c /jffs/dev_sddp.conf"
fi

exec /sbin/sddpd $sddpd_opts
```

:::

::: details Technical details

- **Path in image:** `/etc/runsddp`
- **Category:** scripts
- **Size:** 651 B (651 bytes)
- **SHA-256:** `60984a4598d37a6ac93bc3be3a29708537bbd8c4118ca884452ed2d99bcc66aa`

Starts sddpd with /etc/sddpd.conf.


:::

### `mount_jffs.sh`

The script that mounts the writable partition: the step during boot that makes the speaker's saved settings, logs, and queues available. Until this runs, the device only has its read-only image.

[View](/files/etc/scripts/mount_jffs.sh) · [Download](/files/etc/scripts/mount_jffs.sh) · 389 B

::: details Preview

First 21 of 21 lines:

```
# Copyright (c) 2022, Sonos, Inc.  All rights reserved.

sonos_mount_jffs()
{
    mount -t jffs2 -o noatime /dev/nandjffs /jffs
}

sonos_unmount_jffs()
{
    grep -q /jffs /proc/mounts
    ret=$?
    if [ $ret -eq 0 ]; then
        umount /jffs
        ret=$?
        if [ $ret -ne 0 ]; then
            echo "error umounting /jffs: $ret" 1>&2
            return $ret
        fi
    fi
}

```

:::

::: details Technical details

- **Path in image:** `/etc/scripts/mount_jffs.sh`
- **Category:** scripts
- **Size:** 389 B (389 bytes)
- **SHA-256:** `af1c5c97306ffd2b06366562b5ea601814310739d671c2f938a4958cabee4d69`

Mounts the jffs2 flash partition at /jffs; ordering matters because nearly every subsystem reads persisted state from it.


:::

### `run_sshd.sh`

The script that conditionally starts the SSH daemon: SSH exists on the box but is gated, and this is the gatekeeper deciding whether remote shell access is allowed at all.

[View](/files/etc/scripts/run_sshd.sh) · [Download](/files/etc/scripts/run_sshd.sh) · 499 B

::: details Preview

First 18 of 18 lines:

```
#!/bin/sh
# Copyright (c) 2019-2023, Sonos, Inc.  All rights reserved.

. /etc/rundaemon.sh

trackrestart dropbear /var/run/dropbear.start

waitwhiletrue "[ ! -f /tmp/device_unlocked_flag ]"

mkdir -p /jffs/persist/ssh
mkdir -m 700 -p /jffs/sys/debug/ssh
if [ ! -f /jffs/sys/debug/ssh/authorized_keys ]; then
    touch /jffs/sys/debug/ssh/authorized_keys
fi
if [ ! -s /jffs/persist/ssh/dropbear_ecdsa_host_key ]; then
    rm /jffs/persist/ssh/dropbear_ecdsa_host_key
fi
exec /usr/bin/dropbear -R -F
```

:::

::: details Technical details

- **Path in image:** `/etc/scripts/run_sshd.sh`
- **Category:** scripts
- **Size:** 499 B (499 bytes)
- **SHA-256:** `822523d641bd6ee7ea0b271e4dadb05ebe598249f86d0717f03cc6394ba97732`

Starts dropbear only when the device is in a permitted state (engineering/unlock path); installs host keys under /jffs/persist/ssh on first run.


:::

### `netconfig.sh`

The network reconfiguration state machine in a single shell script: one call with a mode argument moves the player between Sonos's mesh, normal home WiFi, the open setup hotspot, credential-checking, or a standalone island mode. It is why the speaker can hop between network setups without reflashing.

[View](/files/usr/sbin/netconfig.sh) · [Download](/files/usr/sbin/netconfig.sh) · 10.7 KB

::: details Preview

First 60 of 449 lines:

```
#!/bin/sh


case "$1" in
    sonosnet|station|satellite|sta_and_sat|open|credcheck|deauth|wacexit|island|up)
        MODE="$1"
        WAC=0
        ;;
    wacstart|wacapclose|wactimeout)
        MODE="$1"
        WAC=1
        ;;
    waccredcheck)
        MODE=credcheck
        WAC=1
        ;;
    wacapopen)
        MODE=open
        WAC=1
        ;;
    wacstation)
        MODE=station
        WAC=1
        ;;
    *)
        echo "Illegal mode!"
        exit 1
        ;;
esac

case "$2" in
    stp_disable)
        STPSTATE="off"
        ;;
    stp_enable)
        STPSTATE="on"
        ;;
    *)
        echo "Illegal STP state!"
        exit 1
        ;;
esac

PARAM1="$3"
PARAM2="$4"
PARAM3="$5"
PARAM4="$6"


ARCH_ATTRS=/etc/arch_attrs

if [ -f /jffs/debug/testpoints.sh ] && \
   [ "`cat /proc/sonos-lock/exec_enable`" == "1" ]; then
    . /jffs/debug/testpoints.sh || true
fi

if [ "${WAC}" = "0" ]; then
    if [ -f /tmp/wacd.pid ]; then
        kill `cat /tmp/wacd.pid`
        rm -f /tmp/wacd.pid
```

:::

::: details Technical details

- **Path in image:** `/usr/sbin/netconfig.sh`
- **Category:** scripts
- **Size:** 10.7 KB (10932 bytes)
- **SHA-256:** `13f8bb6219d077e3eac73df1005b42547306f7d506ce62752a5db9cbcd2aea83`

The netconfig FSM documented under netconfig_fsm: modes include SonosNet join, infrastructure join, open-AP setup, check-only, and island; touches wpa_supplicant, ssidlist, and the flag files under /var/run.


:::

### `secure_console.sh`

The secure console gate: the script that decides whether the device will expose a debug console, checking the unlock state before offering a shell.

[View](/files/usr/sbin/secure_console.sh) · [Download](/files/usr/sbin/secure_console.sh) · 236 B

::: details Preview

First 7 of 7 lines:

```
#!/bin/sh

# This is a wrapper script called by getty, which is unable to pass
# arguments to the program it starts (typically login). We need to pass
# the user to login as (-f root).
echo "Starting console..."
exec /bin/login -f root
```

:::

::: details Technical details

- **Path in image:** `/usr/sbin/secure_console.sh`
- **Category:** scripts
- **Size:** 236 B (236 bytes)
- **SHA-256:** `fa1827c45a7048097e57a0660942022f10ef4420b0e53d50fb35e68078f4f30b`

Gates console access on the device-unlock flag (/tmp/device_unlocked_flag family); part of the engineering surfaces documented under dev_unlock.


:::

### `secure_console_login.sh`

The login half of the secure console: how a permitted console session is actually opened once the gate allows it.

[View](/files/usr/sbin/secure_console_login.sh) · [Download](/files/usr/sbin/secure_console_login.sh) · 1.0 KB

::: details Preview

First 33 of 33 lines:

```
#!/bin/sh

# Wrapper around getty to wait for dynamic devices (USB) and enforce
# console security. Passed tty, baud rate, and other parameters, which
# are then passed to getty.

. /etc/rundaemon.sh

tty=`basename $1`
baud=$2
extra=$3
shift 3
while [ $# -gt 0 ]
	do extra="$extra $1"
	shift
done

trackrestart getty-$tty /var/run/getty-${tty}.start 1

waitwhiletrue "[ ! -c /dev/$tty ]"

# In early development, this file may not exist. Also, it will not
# exist on pre-secure boot plauers. In both cases, we'll enable the
# console by default. Note that on pre-secure boot players, the
# console is disabled by other methods.
[ -f /proc/sonos-lock/console_enable ] &&
	waitwhiletrue "[ `cat /proc/sonos-lock/console_enable` != '1' ]"

# Start a getty on the tty passed in as our parameter.
# Since USB may be hot-plugged, and because initialization happens
# this device might not instantiated at the time the script starts,
# so the scripts I/O is set to be logged at first.
exec getty -L -w $extra $tty $baud linux < /dev/$tty > /dev/$tty 2>&1
```

:::

::: details Technical details

- **Path in image:** `/usr/sbin/secure_console_login.sh`
- **Category:** scripts
- **Size:** 1.0 KB (1048 bytes)
- **SHA-256:** `69e775c702e96d1688c33ab498e286f88bbf682d503eef70a1223ed8b1ce59de`

Companion to secure_console.sh; performs the session setup after the gate check.


:::

