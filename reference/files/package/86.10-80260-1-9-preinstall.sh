#!/bin/sh
kill_attempt () {
    echo "Killing $1"
    kill `ps | grep $1 | grep -v grep | cut -c 1-5`
}
if [ "$1" = "umountnone" ]; then
    REGION=$(/bin/mdputil | /usr/sbin/keyval ^REGION)
    if [ "$REGION" = "5" ]; then
        echo "Setting REGION=2"
        /bin/mdputil -fwe 2
    fi
fi
if [ "$1" = "postinst" ]; then
    echo "Doing post-install steps..."
    rm -f /jffs/upgrade_prev.log
    if [ -e /jffs/upgrade.log ]; then
	cp /jffs/upgrade.log /jffs/upgrade_prev.log
    fi
    if [ -e /tmp/upgrade.log ]; then
        cp /tmp/upgrade.log /jffs/.
    else
        echo "Manual upgrade. No log to copy." > /jffs/upgrade.log
    fi
    if [ ! -e /jffs/upgrade_sys_report.log ]; then
        touch /jffs/upgrade_sys_report.log
    fi
    sync
    sync
    exit 0
fi
echo "Checking space on jffs"
jffsusage=$(df -h | grep '98%\|99%\|100% /jffs')
if [ "$jffsusage" ]; then
    echo "WARNING: /jffs usage near or at capacity. Upgrade might fail as a result."
    exit 0
else
    echo "Enough /jffs space to continue upgrade."
fi
if [ -d /dev/mtd ]; then
    if [ -f /var/run/upgradeflag ]; then
        echo "Proceeding with upgrade..."
        exit 0
    fi
    echo -n "Checking to see if anacapad is running..."
    ps | grep -v grep | grep anacapad > /dev/null
    if [ $? = 0 ]; then
        echo "Anacapa is running - please stop it and run upgrade again."
        exit 1
    fi
    echo "Stopping ancillary processes..."
    kill_attempt udhcpc
    kill_attempt inetd
    touch /var/run/stopnetstartd
    kill_attempt netstartd
    sleep 2
    touch /var/run/upgradeflag
    exit 0
fi
