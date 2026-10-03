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

