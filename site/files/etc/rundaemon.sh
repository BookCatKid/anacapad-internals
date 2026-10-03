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
