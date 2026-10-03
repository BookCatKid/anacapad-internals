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
