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
