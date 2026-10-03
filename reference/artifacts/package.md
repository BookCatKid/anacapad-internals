# Artifacts: Firmware package pieces

The parts of the actual update file Sonos ships: the kernel image, the compressed filesystem that contains everything else on this page, the installer script, and the factory data block written per-device. Together these are what a firmware update physically delivers to the speaker.

::: details Technical details

Sections extracted from the signed .upd update package: uImage kernel, squashfs rootfs, preinstall script, and the per-device NCD payload template.

:::

### `86.10-80260-1-9-device-payload.bin`

The factory data template: a small binary block carrying the per-unit identity slots (serial, MAC, calibration) that get filled in when the device is manufactured. Amusingly, its embedded template still carries a 2012-era factory timestamp from the original Playbar.

[Download](/files/package/86.10-80260-1-9-device-payload.bin) · 53.5 KB

::: details Technical details

- **Path in image:** `/package/86.10-80260-1-9-device-payload.bin`
- **Category:** package
- **Size:** 53.5 KB (54757 bytes)
- **SHA-256:** `36b47a4c7ef9e974ccfa82efda203754f0316ddc38b836e66b050e71074ae7cc`

Section-13 payload from the .upd, about 55 KB. Its tagged-record layout (board ID '3s50avq100', the '2012/06/14' template date, empty serial/MAC slots) is fully decoded on the firmware-differences page; mdputil -B initializes it.


:::

### `86.10-80260-1-9-kernel.uImage`

The Linux kernel image for this firmware: the actual operating-system core the speaker boots. Everything else on this page runs on top of it.

[Download](/files/package/86.10-80260-1-9-kernel.uImage) · 1.7 MB

::: details Technical details

- **Path in image:** `/package/86.10-80260-1-9-kernel.uImage`
- **Category:** package
- **Size:** 1.7 MB (1792719 bytes)
- **SHA-256:** `f74b36a9a6ae5efe2fe0c1ea1daf05ed5e30212bfe48a30b2c4ea7af2da4ae34`

uImage-wrapped ARM kernel from the update package, about 1.8 MB. The modules/ and wifi/ kernel objects above load into this kernel at boot.


:::

### `86.10-80260-1-9-preinstall.sh`

The installer script inside the update package: the small program that runs on the device when a firmware update lands, preparing the new image for installation.

[View](/files/package/86.10-80260-1-9-preinstall.sh) · [Download](/files/package/86.10-80260-1-9-preinstall.sh) · 1.6 KB

::: details Preview

First 58 of 58 lines:

```
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
```

:::

::: details Technical details

- **Path in image:** `/package/86.10-80260-1-9-preinstall.sh`
- **Category:** package
- **Size:** 1.6 KB (1599 bytes)
- **SHA-256:** `feddb7ad14034b06c316ccbed244a11925093a882a9d7bd81ea64a61364cbe70`

Pre-install script from the .upd; runs ahead of the squashfs/rootfs swap during upgrade.


:::

### `86.10-80260-1-9-rootfs.squashfs`

The compressed filesystem image: the single block that contains the entire root filesystem, all the files on this page included. This is what the device actually writes during an update.

[Download](/files/package/86.10-80260-1-9-rootfs.squashfs) · 13.3 MB

::: details Technical details

- **Path in image:** `/package/86.10-80260-1-9-rootfs.squashfs`
- **Category:** package
- **Size:** 13.3 MB (13918208 bytes)
- **SHA-256:** `c8deece292bf7025be0533ca4c238e582d2890872ce4681a8ade7666dbbb81d6`

Squashfs image (~14 MB) extracted from the .upd; the rootfs-86.10-80260-1-9 directory on this site was unpacked from this file.


:::

### `86.10-80260-1-9.upd`

The complete update package itself: the signed bundle Sonos's servers deliver when this model updates, containing the kernel, the filesystem, and the installer all in one signed file.

[Download](/files/package/86.10-80260-1-9.upd) · 15.2 MB

::: details Technical details

- **Path in image:** `/package/86.10-80260-1-9.upd`
- **Category:** package
- **Size:** 15.2 MB (15919011 bytes)
- **SHA-256:** `6c82af3a66596cac485e30b8b8f2f89f7039f211a379686d011786173db447de`

The signed .upd for build 86.10-80260-1-9 (~16 MB). Everything under the other categories on this page ultimately comes from inside this file.


:::

