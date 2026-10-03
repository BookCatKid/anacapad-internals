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
    fi
fi

if [ "${MODE}" = "wacexit" ]; then
    exit 0
fi

NETSETTINGSFILE=/jffs/netsettings.txt
if [ -f /ramdisk/tmp/netsettings_check.txt ]; then
    USE_SSIDLIST=0
    if [ "${MODE}" = "station" ] || [ "${MODE}" = "credcheck" ]; then
        NETSETTINGSFILE=/ramdisk/tmp/netsettings_check.txt
    fi
else
    USE_SSIDLIST=`cat /jffs/net/settings/ssidlist.txt | /usr/sbin/keyval ^UseSSIDList`
    if [ "${MODE}" = "credcheck" ]; then
        echo "credcheck file not found"
        exit 1
    fi
fi

ATHCONFIG=/wifi/athconfig

killall wpa_supplicant
if [ "${MODE}" = "station" ] || [ "${MODE}" = "credcheck" ] || [ "${MODE}" = "satellite" ] || [ "${MODE}" = "sta_and_sat" ]; then
    rm -f /var/run/wpa_supplicant.conf

    WPALOG="-s"

    if [ -f /jffs/debug/wpa_supplicant.conf ]; then
        WPACONFIG=/jffs/debug/wpa_supplicant.conf
        WPACONFIGOUT="/dev/null"
    else
        WPACONFIG=/var/run/wpa_supplicant.conf
        WPACONFIGOUT=${WPACONFIG}
    fi

    if [ "${USE_SSIDLIST}" = "1" ]; then
        if [ "${PARAM2}" = "recovery" ]; then
            SSID_FILE=1 /wifi/wpaconfig /var/run/softapssidlist.txt ${WPACONFIGOUT}
        else
            SSID_FILE=1 /wifi/wpaconfig /jffs/net/settings/ssidlist.txt ${WPACONFIGOUT}
        fi
    else
        SSID_FILE=0 /wifi/wpaconfig ${NETSETTINGSFILE} ${WPACONFIGOUT}
    fi

    if [ -f /jffs/debug/supplicant ]; then
        WPADEBUG="-dd -t -K"
    else
        WPADEBUG="-t"
    fi

    if [ -f /jffs/debug/wpa_supplicant ] && \
       [ "`cat /proc/sonos-lock/exec_enable`" == "1" ]; then
        WPABIN=/jffs/debug/wpa_supplicant
    else
        WPABIN=/wifi/wpa_supplicant
    fi

    WPADRIVER="sonos"
fi

if [ "${MODE}" = "credcheck" ]; then

    $ATHCONFIG stasetenable ath0 2
    ${WPABIN} ${WPALOG} -B -D ${WPADRIVER} -i ath0 -c ${WPACONFIG} ${WPADEBUG}

    exit 0
fi


if [ "${WAC}" = "0" ] && [ "${MODE}" != "open" ]; then
    touch /var/run/waitforip
else
    rm -f /var/run/waitforip
fi


killall udhcpc
$ATHCONFIG setopenmode ath0 DISABLE
$ATHCONFIG stasetenable ath0 0
$ATHCONFIG stasetenable ath1 0
$ATHCONFIG scanabort ath0
$ATHCONFIG satenable ath0 0

/usr/sbin/brctl delif br0 eth0
/usr/sbin/brctl delif br0 eth1

/sbin/ifconfig ath0 down
/sbin/ifconfig ath1 down

/sbin/ifconfig br0 down
/usr/sbin/brctl delbr br0

if [ "${MODE}" = "deauth" ]; then
    /usr/sbin/brctl addbr br0
    BRMAC=`/usr/sbin/setmac -S | /usr/sbin/keyval ^br0`
    /usr/sbin/brctl setmac br0 ${BRMAC}

    /sbin/ifconfig ath0 0.0.0.0
    exit 0
fi

AP=""
WEPKEY="disable"
HHID=""
CHANNEL=2412
BONJOURNAME=""
PRIMARYUUID=""
PRIORITYBR=0
NOMESH=0
HAVE_NETSETTINGS=0
if [ -f ${NETSETTINGSFILE} ]; then
    HAVE_NETSETTINGS=1
    WEPKEY=`/usr/sbin/keyval ^WEPKey ${NETSETTINGSFILE}`
    HHID=`/usr/sbin/keyval ^HouseholdID ${NETSETTINGSFILE}`
    CHANNEL=`/usr/sbin/keyval ^Channel ${NETSETTINGSFILE}`
    PRIORITYBR=`/usr/sbin/keyval ^PriorityBridge ${NETSETTINGSFILE}`
    BONJOURNAME=`/usr/sbin/keyval -s BonjourName ${NETSETTINGSFILE}`
    PRIMARYUUID=`/usr/sbin/keyval ^PrimaryUUID ${NETSETTINGSFILE}`
    NOMESH=`/usr/sbin/keyval ^ForceMeshDisable ${NETSETTINGSFILE}`
fi

if [ "${MODE}" = "open" ]; then

    if [ "${PARAM2}z" != "z" ]; then
        CHANNEL=${PARAM2}
    fi

    if [ -f /jffs/debug/openchannel ]; then
        CHANNEL=`cat /jffs/debug/openchannel`
    fi

    /usr/sbin/setmac -L

    /sbin/ifconfig eth0 0.0.0.0
    /sbin/ifconfig eth1 0.0.0.0

    $ATHCONFIG setchannel ath0 $CHANNEL
    $ATHCONFIG setopenmode ath0 $PARAM1

    /sbin/ifconfig ath0 10.69.69.1

    /sbin/route add 255.255.255.255 ath0
    /sbin/route add -net 224.0.0.0 netmask 240.0.0.0 ath0
    exit 0

fi

/usr/sbin/brctl addbr br0
/usr/sbin/brctl sethello br0 1.0
/usr/sbin/brctl setfd br0 4.0
/usr/sbin/brctl setmaxage br0 6.0

if [ "${MODE}" = "sonosnet" ] || [ "${MODE}" = "island" ]; then

    BRMAC=`/usr/sbin/setmac | /usr/sbin/keyval ^br0`

    if [ "${MODE}" = "sonosnet" ]; then
	/sbin/ifconfig eth0 0.0.0.0
	/sbin/ifconfig eth1 0.0.0.0

	/usr/sbin/brctl addif br0 eth0
	/usr/sbin/brctl addif br0 eth1
    else
	/sbin/ifconfig eth0 down
	/sbin/ifconfig eth1 down
    fi

    /usr/sbin/brctl uplink br0 0

    echo -n "0" > /var/run/netmanager_extender_flags.tmp
    mv -f /var/run/netmanager_extender_flags.tmp /var/run/netmanager_extender_flags

else

    BRMAC=`/usr/sbin/setmac -S | /usr/sbin/keyval ^br0`

    /sbin/ifconfig eth0 0.0.0.0
    /sbin/ifconfig eth1 0.0.0.0

    /usr/sbin/brctl uplink br0 1
fi

/usr/sbin/brctl setmac br0 ${BRMAC}


UUIDA=`/sbin/ifconfig eth0 | /usr/sbin/keyval -d: HWaddr`
UUIDP=`/usr/sbin/keyval ^Port /opt/conf/anacapa.conf`
UUID='RINCON_'$UUIDA'0'$UUIDP

$ATHCONFIG setwepkey ath0 $WEPKEY
$ATHCONFIG sethhid ath0 $HHID
$ATHCONFIG setchannel ath0 $CHANNEL
$ATHCONFIG ssidinbeaconenable ath0 0
$ATHCONFIG beaconenable ath0 0

if [ "${MODE}" = "station" ] || [ "${MODE}" = "satellite" ] || [ "${MODE}" = "sta_and_sat" ]; then

    $ATHCONFIG stasetenable ath0 1

elif [ "${MODE}" = "up" ]; then

    /sbin/ifconfig ath0 0.0.0.0
    exit 0

elif [ "${MODE}" = "wacstart" ] || [ "${MODE}" = "wactimeout" ]; then
    /sbin/ifconfig ath0 0.0.0.0

    if [ -f /tmp/wacd.pid ]; then kill `cat /tmp/wacd.pid`; fi

    if [ "${MODE}" = "wactimeout" ] ; then
	WACDARG="-timeout"
    fi

    /wifi/wacd $WACDARG

    exit 0

elif [ "${MODE}" = "wacapclose" ]; then
    exit 0
fi

ISHTSATELLITE=0
if [ "${PRIMARYUUID}z" != "z" ]; then
    if [ "${MODE}" != "island" ]; then
       ISHTSATELLITE=1
       $ATHCONFIG setprimaryuuid ath0 $PRIMARYUUID
       $ATHCONFIG satenable ath0 1
    fi

elif ( grep -Fxq IS_HT_WIRELESS_PRIMARY $ARCH_ATTRS ) && ( [ "${MODE}" = "sonosnet" ] || [ "${MODE}" = "station" ] ); then

    $ATHCONFIG setuuid ath0 $UUID

    $ATHCONFIG setuuid ath1 $UUID
    $ATHCONFIG acs ath1 1
    $ATHCONFIG acslmenable ath1 1
    $ATHCONFIG setwepkey ath1 $WEPKEY
    $ATHCONFIG sethhid ath1 $HHID

fi

if ( [ "${MODE}" = "island" ] || [ "${NOMESH}" = "0" ] ); then
    NOMESH=1
fi

$ATHCONFIG blockadvertisedpath ath0 $NOMESH

if [ "$PRIORITYBR" = "1" ]; then
    /usr/sbin/brctl setbridgeprio br0 28672  # 0x7000
else
    /usr/sbin/brctl setbridgeprio br0 38912  # 0x9800
fi

if [ "${STPSTATE}" = "off" ]; then
    /usr/sbin/brctl stp br0 off
fi

/sbin/ifconfig br0 0.0.0.0

/sbin/ifconfig ath0 0.0.0.0

/sbin/ifconfig ath1 0.0.0.0
if [ "${ISHTSATELLITE}" = "1" ]; then
    /sbin/ifconfig ath1 down
fi


if [ "${MODE}" = "station" ]; then
    ${WPABIN} ${WPALOG} -B -D ${WPADRIVER} -i ath0 -b br0 -c ${WPACONFIG} ${WPADEBUG}
fi

if [ "${MODE}" = "satellite" ]; then
    if [ "${PARAM1}" = "atheros" ]; then
        if [ "${#PARAM2}" -ne "0" ]; then
            if [ "${#PARAM3}" -ne "0" ]; then

                HTAPSATWPACONFIG=/var/run/htapsatwpa.conf
                echo "eapol_version=1" > ${HTAPSATWPACONFIG}
                echo "ap_scan=1" >> ${HTAPSATWPACONFIG}
                echo "network={" >> ${HTAPSATWPACONFIG}
                echo "ssid=${PARAM2}" >> ${HTAPSATWPACONFIG}
                echo "psk=${PARAM3}" >> ${HTAPSATWPACONFIG}
                echo "scan_ssid=1" >> ${HTAPSATWPACONFIG}
                echo "priority=4" >> ${HTAPSATWPACONFIG}

                if [ "${#PARAM4}" -ne "0" ]; then
                    echo "bssid=${PARAM4}" >> ${HTAPSATWPACONFIG}
                fi

                echo "}" >> ${HTAPSATWPACONFIG}

                /wifi/athconfig stassidlistclr ath0
                /wifi/athconfig wossidclr ath0

                /wifi/athconfig stassidlistadd ath0 ${PARAM2} ${#PARAM3}

                cat ${HTAPSATWPACONFIG} > ${WPACONFIG}

                rm ${HTAPSATWPACONFIG}
            fi
        fi

        ${WPABIN} ${WPALOG} -B -D ${WPADRIVER} -i ath0 -b br0 -c ${WPACONFIG} ${WPADEBUG}
    fi
fi

if [ "${MODE}" = "sta_and_sat" ]; then
    if [ "${PARAM1}" = "atheros" ]; then
        if [ "${#PARAM2}" -ne "0" ]; then
            if [ "${#PARAM3}" -ne "0" ]; then

                HTAPSATWPACONFIG=/var/run/htapsatwpa.conf
                echo "network={" > ${HTAPSATWPACONFIG}
                echo "ssid=${PARAM2}" >> ${HTAPSATWPACONFIG}
                echo "psk=${PARAM3}" >> ${HTAPSATWPACONFIG}
                echo "scan_ssid=1" >> ${HTAPSATWPACONFIG}
                echo "priority=4" >> ${HTAPSATWPACONFIG}
                echo "}" >> ${HTAPSATWPACONFIG}

                /wifi/athconfig stassidlistadd ath0 ${PARAM2} ${#PARAM3}

                cat ${HTAPSATWPACONFIG} >> ${WPACONFIG}

                rm ${HTAPSATWPACONFIG}
            fi
        fi

        ${WPABIN} ${WPALOG} -B -D ${WPADRIVER} -i ath0 -b br0 -c ${WPACONFIG} ${WPADEBUG}
    fi
fi

if [ "${BONJOURNAME}z" != "z" ]; then
    HOST="${BONJOURNAME}"
elif grep -Fxq IS_BRIDGE $ARCH_ATTRS; then
    HOST="SonosZB"
else
    HOST="SonosZP"
fi

/sbin/route add 255.255.255.255 br0
/sbin/route add -net 224.0.0.0 netmask 240.0.0.0 br0

if [ "${MODE}" = "station" ] || [ "${MODE}" = "satellite" ] || [ "${MODE}" = "sta_and_sat" ]; then
    DHCP_FLAGS="-z"
fi

waitForFile() {
    file=$1
    count=0
    while [ ! -f $file ]
    do
        sleep 1
        count=`expr $count + 1`
        if [ $count -gt 60 ]; then
            echo "File $1 was not created after 60 seconds! Bravely giving up"
            break
        fi
    done
}

if [ -f /jffs/debug/static_ipaddr ]; then
    ifconfig br0 $(cat /jffs/debug/static_ipaddr)
    rm -f /var/run/waitforip
else
    count=1
    while pidof udhcpc > /dev/null
    do
        sleep 1

        if [ $count -gt 5 ]; then
            killall -SIGKILL udhcpc
            break
        fi
        count=`expr $count + 1`
    done

    if [ "${MODE}" = "island" ]; then
	/sbin/udhcpc -fF -W 20 -s /etc/dhcp.script -i br0 -w ath0 -h "${HOST}" -d access.bestbuy.com ${DHCP_FLAGS} &
    else
	/sbin/udhcpc -f -s /etc/dhcp.script -i br0 -w ath0 -h "${HOST}" -d access.bestbuy.com ${DHCP_FLAGS} &
    fi

    waitForFile "/tmp/udhcpc.pid"
fi

exit 0
