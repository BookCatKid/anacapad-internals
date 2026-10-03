import{_ as a,o as n,c as e,ag as p}from"./chunks/framework.BXn5fPR3.js";const u=JSON.parse('{"title":"Artifacts: Boot and service scripts","description":"","frontmatter":{},"headers":[],"relativePath":"artifacts/scripts.md","filePath":"artifacts/scripts.md"}'),t={name:"artifacts/scripts.md"};function l(i,s,o,c,r,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="artifacts-boot-and-service-scripts" tabindex="-1">Artifacts: Boot and service scripts <a class="header-anchor" href="#artifacts-boot-and-service-scripts" aria-label="Permalink to &quot;Artifacts: Boot and service scripts&quot;">​</a></h1><p>Small shell scripts that start and stop the device&#39;s programs in the right order, bring the network up, and recover when something crashes. Reading them is the clearest way to see how the player actually boots.</p><details class="details custom-block"><summary>Technical details</summary><p>POSIX shell launchers and lifecycle scripts under /etc; they glue the kernel, the sibling daemons, and anacapad together during boot, shutdown, and reset.</p></details><h3 id="krandom" tabindex="-1"><code>Krandom</code> <a class="header-anchor" href="#krandom" aria-label="Permalink to &quot;\`Krandom\`&quot;">​</a></h3><p>The shutdown-time entropy script: preserves randomness state across reboots so the device&#39;s cryptographic operations do not restart from a predictable seed.</p><p><a href="/anacapad-internals/files/etc/init.d/Krandom">View</a> · <a href="/anacapad-internals/files/etc/init.d/Krandom">Download</a> · 499 B</p><details class="details custom-block"><summary>Preview</summary><p>First 17 of 17 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span>echo &quot;Saving random seed...&quot;</span></span>
<span class="line"><span>random_seed=/jffs/random-seed</span></span>
<span class="line"><span>touch $random_seed</span></span>
<span class="line"><span>chmod 600 $random_seed</span></span>
<span class="line"><span>poolfile=/proc/sys/kernel/random/poolsize</span></span>
<span class="line"><span>#  linux 2.4 has the poolsize in bytes, &gt;= 2.6 in bits</span></span>
<span class="line"><span>case \`uname -r\` in</span></span>
<span class="line"><span>    2.4.*)</span></span>
<span class="line"><span>        [ -r $poolfile ] &amp;&amp; bytes=\`cat $poolfile\` || bytes=512</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>        [ -r $poolfile ] &amp;&amp; bits=\`cat $poolfile\` || bits=4096</span></span>
<span class="line"><span>        bytes=$(expr $bits / 8)</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span>dd if=/dev/urandom &quot;of=$random_seed&quot; count=1 &quot;bs=$bytes&quot; 2&gt; /dev/null</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/init.d/Krandom</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 499 B (499 bytes)</li><li><strong>SHA-256:</strong> <code>43ba173153df8d85b25e6257324ea471938a7bd0cd1ce12faeea81791ba50b0f</code></li></ul><p>Saves/restores the random seed (cf. /jffs/random-seed) in the K-order shutdown sequence.</p></details><h3 id="srandom" tabindex="-1"><code>Srandom</code> <a class="header-anchor" href="#srandom" aria-label="Permalink to &quot;\`Srandom\`&quot;">​</a></h3><p>The boot-time entropy script: seeds the random number generator early so keys, tokens, and nonces are unpredictable from the very first connection.</p><p><a href="/anacapad-internals/files/etc/init.d/Srandom">View</a> · <a href="/anacapad-internals/files/etc/init.d/Srandom">Download</a> · 246 B</p><details class="details custom-block"><summary>Preview</summary><p>First 8 of 8 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span>echo &quot;Initializing random number generator...&quot;</span></span>
<span class="line"><span>random_seed=/jffs/random-seed</span></span>
<span class="line"><span># Carry a random seed from start-up to start-up</span></span>
<span class="line"><span># Load and then save the whole entropy pool</span></span>
<span class="line"><span>if [ -f $random_seed ]; then</span></span>
<span class="line"><span>    cat $random_seed &gt;/dev/urandom</span></span>
<span class="line"><span>fi</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/init.d/Srandom</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 246 B (246 bytes)</li><li><strong>SHA-256:</strong> <code>0a52cb3a89b1b93982143ba9bfc9f426249e4a6dfc7090887798f91e39635219</code></li></ul><p>Restores /jffs/random-seed into urandom at boot (S-order init step).</p></details><h3 id="rck" tabindex="-1"><code>rcK</code> <a class="header-anchor" href="#rck" aria-label="Permalink to &quot;\`rcK\`&quot;">​</a></h3><p>The kill script: the ordered teardown list run at shutdown or reboot, stopping services in the right sequence before power-off.</p><p><a href="/anacapad-internals/files/etc/init.d/rcK">View</a> · <a href="/anacapad-internals/files/etc/init.d/rcK">Download</a> · 719 B</p><details class="details custom-block"><summary>Preview</summary><p>First 35 of 35 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span># Preserve seed</span></span>
<span class="line"><span>/etc/init.d/Krandom</span></span>
<span class="line"><span></span></span>
<span class="line"><span>daemonkill() {</span></span>
<span class="line"><span>    for daemon in sonosledmgrd sonosdiagd \\</span></span>
<span class="line"><span>	sonospowercoordinator anacapad chronyd sddpd \\</span></span>
<span class="line"><span>	dropbear netstartd mdnsd udhcpc rngd ; do</span></span>
<span class="line"><span>	killall -$1 $daemon 2&gt; /dev/null</span></span>
<span class="line"><span>    done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for stop in stopupgrade stopledmgrd stopdiagapp \\</span></span>
<span class="line"><span>    stopsonospowercoordinator \\</span></span>
<span class="line"><span>    stopmdns stopdiagprocessd stopanacapa stopchrony stopsddp stopnetstartd; do</span></span>
<span class="line"><span>    touch /var/run/$stop</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo Sending SIGTERM</span></span>
<span class="line"><span>daemonkill TERM</span></span>
<span class="line"><span>sync</span></span>
<span class="line"><span>sleep 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo Sending SIGKILL</span></span>
<span class="line"><span>daemonkill KILL</span></span>
<span class="line"><span>sync</span></span>
<span class="line"><span>sleep 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -x /etc/scripts/ampmcu-down.sh ]; then</span></span>
<span class="line"><span>    echo Disabling AMPMCU instances</span></span>
<span class="line"><span>    /etc/scripts/ampmcu-down.sh</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo Unmounting /jffs</span></span>
<span class="line"><span>grep -q /jffs /proc/mounts &amp;&amp; umount /jffs</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/init.d/rcK</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 719 B (719 bytes)</li><li><strong>SHA-256:</strong> <code>1970b0bb740fb4d244af646e2567fb6f16aaea2c9cbf2987403605058729e08b</code></li></ul><p>Init runlevel-K aggregation; pairs with the inittab shutdown entries.</p></details><h3 id="runanacapa" tabindex="-1"><code>runanacapa</code> <a class="header-anchor" href="#runanacapa" aria-label="Permalink to &quot;\`runanacapa\`&quot;">​</a></h3><p>The launcher for the main player software: the script that starts anacapad with its config file, drops privileges to its own user, and sets up its environment. The player&#39;s whole life starts here at every boot.</p><p><a href="/anacapad-internals/files/etc/runanacapa">View</a> · <a href="/anacapad-internals/files/etc/runanacapa">Download</a> · 568 B</p><details class="details custom-block"><summary>Preview</summary><p>First 28 of 28 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart anacapa /var/run/anacapa.start 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -f /var/run/upgradeinfo ]; then</span></span>
<span class="line"><span>    mkdir /tmp</span></span>
<span class="line"><span>    rm /jffs/upgrade_tmp_prev.log</span></span>
<span class="line"><span>    mv /tmp/upgrade.log /jffs/upgrade_tmp_prev.log</span></span>
<span class="line"><span>    echo Running upgrade ...</span></span>
<span class="line"><span>    /bin/upgrade &gt;&gt; /tmp/upgrade.log 2&gt;&amp;1</span></span>
<span class="line"><span>    rr=$?</span></span>
<span class="line"><span>    echo RESULT = $rr &gt;&gt; /tmp/upgrade.log</span></span>
<span class="line"><span>    rm /var/run/upgradeinfo</span></span>
<span class="line"><span>    exit $rr</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>for X in /tmp/smb/*</span></span>
<span class="line"><span>do </span></span>
<span class="line"><span>    if [ -d &quot;$X&quot; ] </span></span>
<span class="line"><span>    then</span></span>
<span class="line"><span>        umount &quot;$X&quot;</span></span>
<span class="line"><span>        rmdir &quot;$X&quot;</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span>waitwhiletrue &quot;[ -f /var/run/stopanacapa ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exec /opt/bin/anacapactl start-demo</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runanacapa</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 568 B (568 bytes)</li><li><strong>SHA-256:</strong> <code>3c701e472a5ea6ff664deb092dbecbb1642e12799f8f92095955dc0e3cc999fb</code></li></ul><p>Launches &#39;anacapad -c /opt/conf/anacapa.conf -u anacapa -C all=eip&#39; with the pid file at /opt/log/anacapa.pid; supports gdb-wrapped debug starts and the demo-mode direct exec (documented on the rootfs_boot_chain entry).</p></details><h3 id="runchrony" tabindex="-1"><code>runchrony</code> <a class="header-anchor" href="#runchrony" aria-label="Permalink to &quot;\`runchrony\`&quot;">​</a></h3><p>The launcher for the time-sync daemon: starts the component that keeps the speaker&#39;s clock correct, which everything from multi-room sync to alarm timing depends on.</p><p><a href="/anacapad-internals/files/etc/runchrony">View</a> · <a href="/anacapad-internals/files/etc/runchrony">Download</a> · 2.8 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 70 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#####</span></span>
<span class="line"><span># Handler script for chronyd, the NTP daemon which sets the system clock.</span></span>
<span class="line"><span># This is meant to be run in perpetuity thanks to the inittab.</span></span>
<span class="line"><span># If you must use another technique to set the system clock, touch</span></span>
<span class="line"><span># /var/run/stopchrony and run \`killall chronyd\` first.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># chrony detects errors in the system clock relative to the real UTC time it</span></span>
<span class="line"><span># determines by polling NTP servers. These errors can be either &quot;small&quot; or</span></span>
<span class="line"><span># &quot;big&quot; (see all/mtools/gen_chronyconf.py for the threshhold between these).</span></span>
<span class="line"><span># Whenever it&#39;s running, chronyd corrects small errors by &quot;slewing&quot; the system</span></span>
<span class="line"><span># clock (adjusting how fast it ticks so that it matches up with UTC time fairly</span></span>
<span class="line"><span># quickly, but not immediately). When clock errors are big, chronyd can correct</span></span>
<span class="line"><span># them by instead &quot;stepping&quot; the system clock (correcting it immediately).</span></span>
<span class="line"><span># Stepping the clock can theoretically be dangerous to running processes, so we</span></span>
<span class="line"><span># only let chronyd do it once per operation.</span></span>
<span class="line"><span>#####</span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart chrony /var/run/chrony.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Wait until the platform has an IP address AND a DNS server is available:</span></span>
<span class="line"><span># until both conditions are met, chronyd cannot make forward progress.</span></span>
<span class="line"><span>waitfordns</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ -f /var/run/stopchrony ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Set up directories chrony needs</span></span>
<span class="line"><span>mkdir -p /jffs/chrony</span></span>
<span class="line"><span>chown -R chrony:sonos /jffs/chrony</span></span>
<span class="line"><span>mkdir -p /var/lib/chrony</span></span>
<span class="line"><span>chown -R chrony:sonos /var/lib/chrony</span></span>
<span class="line"><span></span></span>
<span class="line"><span># It&#39;s possible (though rare) for the system clock to get set too far ahead of</span></span>
<span class="line"><span># detected NTP time. If this happens, chrony logs this, increments the count in</span></span>
<span class="line"><span># this file, and exits. We restart chrony in case we got unlucky and synced with</span></span>
<span class="line"><span># bad servers, but to prevent perpetual restarting, we do so less and less</span></span>
<span class="line"><span># frequently the more we fail.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># If an RTC is present, we set its value to match the detected NTP time,</span></span>
<span class="line"><span># so that if forward drift of the RTC was the cause of the system clock&#39;s</span></span>
<span class="line"><span># inaccuracy, the system clock will be set more accurately during the next</span></span>
<span class="line"><span># reboot.</span></span>
<span class="line"><span>if [ -f /var/lib/chrony/sync_failure_count ]; then</span></span>
<span class="line"><span>  if grep -Fxq HAS_RTC /etc/arch_attrs &amp;&amp; \\</span></span>
<span class="line"><span>     [ -f /var/lib/chrony/sync_time_offset ]; then</span></span>
<span class="line"><span>    hwclock -u -w$(cat /var/lib/chrony/sync_time_offset)</span></span>
<span class="line"><span>  fi</span></span>
<span class="line"><span>  fail_count=$(cat /var/lib/chrony/sync_failure_count)</span></span>
<span class="line"><span>  if [ $fail_count -eq 1 ]; then</span></span>
<span class="line"><span>    echo &quot;sysclock uncorrectably fast of true; trying again in 5 minutes&quot;</span></span>
<span class="line"><span>    sleep 300</span></span>
<span class="line"><span>  elif [ $fail_count -eq 2 ]; then</span></span>
<span class="line"><span>    echo &quot;sysclock uncorrectably fast of true; trying again in 30 minutes&quot;</span></span>
<span class="line"><span>    sleep 1800</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>    echo &quot;sysclock uncorrectably fast of true; trying again in 60 minutes&quot;</span></span>
<span class="line"><span>    sleep 3600</span></span>
<span class="line"><span>  fi</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runchrony</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 2.8 KB (2851 bytes)</li><li><strong>SHA-256:</strong> <code>dca6c5babccbc7a1166106912ea0dc736aab27c10a2a3effb12457e55934194f</code></li></ul><p>Starts chronyd against /etc/chrony.conf; drift persisted to /jffs/chrony.</p></details><h3 id="rundaemon-sh" tabindex="-1"><code>rundaemon.sh</code> <a class="header-anchor" href="#rundaemon-sh" aria-label="Permalink to &quot;\`rundaemon.sh\`&quot;">​</a></h3><p>A shared daemon-runner script: a generic wrapper used to start background services with the right bookkeeping instead of each launcher reinventing it.</p><p><a href="/anacapad-internals/files/etc/rundaemon.sh">View</a> · <a href="/anacapad-internals/files/etc/rundaemon.sh">Download</a> · 847 B</p><details class="details custom-block"><summary>Preview</summary><p>First 35 of 35 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># waitwhiletrue executes a shell command until it returns false, sleeping</span></span>
<span class="line"><span># 10 seconds between retries</span></span>
<span class="line"><span>waitwhiletrue() {</span></span>
<span class="line"><span>    while eval &quot;$1&quot;; do</span></span>
<span class="line"><span>	sleep 10</span></span>
<span class="line"><span>    done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># waitfordns waits until DNS and networking are available</span></span>
<span class="line"><span># Wait until the platform has an IP address AND a DNS server is available:</span></span>
<span class="line"><span>waitfordns() {</span></span>
<span class="line"><span>    while [ -f /var/run/waitforip ] || ! grep -qs nameserver /etc/resolv.conf; do</span></span>
<span class="line"><span>	sleep 1</span></span>
<span class="line"><span>    done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># trackrestart tracks starts/restarts</span></span>
<span class="line"><span># trackrestart daemon-name track-file &lt;optional sleep time&gt;</span></span>
<span class="line"><span>trackrestart() {</span></span>
<span class="line"><span>    if [ -f $2 ]; then</span></span>
<span class="line"><span>	echo &quot;Restarting $1 - last started&quot; \`tail -n -1 $2\`</span></span>
<span class="line"><span>	if [ -n &quot;$3&quot; ]; then</span></span>
<span class="line"><span>	    sleep $3</span></span>
<span class="line"><span>	else</span></span>
<span class="line"><span>	    sleep 5</span></span>
<span class="line"><span>	fi	    </span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    date &gt;&gt; $2</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># waitwhilestopped waits while a daemon is stopped</span></span>
<span class="line"><span># waitwhilestopped daemon-stop-name</span></span>
<span class="line"><span>waitwhilestopped() {</span></span>
<span class="line"><span>    waitwhiletrue &quot;[ -f /var/run/$1 ]&quot;</span></span>
<span class="line"><span>}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/rundaemon.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 847 B (847 bytes)</li><li><strong>SHA-256:</strong> <code>6f76a74572f19e09223d9876b30b0d9bef2dfaf4036529bf7aa6a5a55f4a7c38</code></li></ul><p>Generic daemon launcher shared by the run* scripts; also referenced by the sibling-daemon IPC work (see multi_daemon_boundary).</p></details><h3 id="rundiagprocessd" tabindex="-1"><code>rundiagprocessd</code> <a class="header-anchor" href="#rundiagprocessd" aria-label="Permalink to &quot;\`rundiagprocessd\`&quot;">​</a></h3><p>The launcher for the diagnostic coprocessor menu: brings up the FIFO command interface used for factory and service diagnostics.</p><p><a href="/anacapad-internals/files/etc/rundiagprocessd">View</a> · <a href="/anacapad-internals/files/etc/rundiagprocessd">Download</a> · 160 B</p><details class="details custom-block"><summary>Preview</summary><p>First 9 of 9 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart diagprocessd /var/run/diagprocessd.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ -f /var/run/stopdiagprocessd ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exec /etc/diagprocessd</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/rundiagprocessd</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 160 B (160 bytes)</li><li><strong>SHA-256:</strong> <code>391f9002a197c91e482230680636757415fdfd2b26e8fc90ba8e9983af9003ff</code></li></ul><p>Starts the /etc/diagprocessd FIFO loop.</p></details><h3 id="runledmgrd" tabindex="-1"><code>runledmgrd</code> <a class="header-anchor" href="#runledmgrd" aria-label="Permalink to &quot;\`runledmgrd\`&quot;">​</a></h3><p>The launcher for the LED manager daemon: starts the little program that owns the speaker&#39;s lights and runs the animated patterns.</p><p><a href="/anacapad-internals/files/etc/runledmgrd">View</a> · <a href="/anacapad-internals/files/etc/runledmgrd">Download</a> · 995 B</p><details class="details custom-block"><summary>Preview</summary><p>First 27 of 27 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart sonosledmgrd /var/run/sonosledmgrd.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>while [ -f /var/run/stopledmgrd ] || [ -e /var/run/sonosledmgrd.pid ]; do</span></span>
<span class="line"><span>    # If we are not deliberately stopping and a pid file exists, check to make</span></span>
<span class="line"><span>    # sure that the pid is actually running. If not, the process has exited abnormally</span></span>
<span class="line"><span>    # and needs to be kicked after logging a message.</span></span>
<span class="line"><span>    if  [ ! -f /var/run/stopledmgrd ]; then</span></span>
<span class="line"><span>        curpid=\`pidof sonosledmgrd\`</span></span>
<span class="line"><span>        if [ $? = 1 ]; then</span></span>
<span class="line"><span>            pid=\`cat /var/run/sonosledmgrd.pid\`</span></span>
<span class="line"><span>            _dat=\`date &quot;+%h %d %H:%m:%S runledmgrd&quot;\`</span></span>
<span class="line"><span>            # this is a system daemon.. so use &#39;3&#39; for message priority</span></span>
<span class="line"><span>            echo &quot;&lt;3&gt; $_dat LED Manager PID $pid is stale. Likely caused by an abnormal exit. Check logs. Restarting LED Manager&quot; &gt;&gt; /opt/log/sonosledmgrd.log</span></span>
<span class="line"><span>            unset _dat</span></span>
<span class="line"><span>            unset pid</span></span>
<span class="line"><span>            break</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>        unset curpid</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    sleep 5</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span>echo &quot;Starting LED Manager&quot;</span></span>
<span class="line"><span>exec /opt/bin/sonosledmgrd</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runledmgrd</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 995 B (995 bytes)</li><li><strong>SHA-256:</strong> <code>5dd6c8b9b8e4ea32fecd923aa6b281ef4037199b1e477c6f9de912f79ab3a2b2</code></li></ul><p>Starts sonosledmgrd; the daemon owns /dev/ledctl and the LED scripting engine documented in led_engine.</p></details><h3 id="runmdns" tabindex="-1"><code>runmdns</code> <a class="header-anchor" href="#runmdns" aria-label="Permalink to &quot;\`runmdns\`&quot;">​</a></h3><p>The launcher for the discovery daemon: starts the service that announces the speaker on the network and finds its siblings.</p><p><a href="/anacapad-internals/files/etc/runmdns">View</a> · <a href="/anacapad-internals/files/etc/runmdns">Download</a> · 94 B</p><details class="details custom-block"><summary>Preview</summary><p>First 7 of 7 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ -f /var/run/stopmdns ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exec /sbin/mdnsd -f</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runmdns</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 94 B (94 bytes)</li><li><strong>SHA-256:</strong> <code>3172ecf3a73d634a681441d73e371ac41e47e62e5eccc4989f5fb0e8541350b2</code></li></ul><p>Starts mdnsd for multicast-DNS announce/browse; feeds the discovery_layer machinery.</p></details><h3 id="runnetstartd" tabindex="-1"><code>runnetstartd</code> <a class="header-anchor" href="#runnetstartd" aria-label="Permalink to &quot;\`runnetstartd\`&quot;">​</a></h3><p>The launcher for the network-startup daemon: starts the component that brings up WiFi and Ethernet in the right order during boot and setup.</p><p><a href="/anacapad-internals/files/etc/runnetstartd">View</a> · <a href="/anacapad-internals/files/etc/runnetstartd">Download</a> · 134 B</p><details class="details custom-block"><summary>Preview</summary><p>First 9 of 9 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart netstartd /var/run/netstartd.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhilestopped stopnetstartd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exec /wifi/netstartd</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runnetstartd</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 134 B (134 bytes)</li><li><strong>SHA-256:</strong> <code>79a483bfb764152467a90515b8c597b7381e64a0ddee82823840f1b7705bf3a8</code></li></ul><p>Starts netstartd, the process anacapad talks to over /tmp/netstartd.ipc for network state and setup transitions.</p></details><h3 id="runsddp" tabindex="-1"><code>runsddp</code> <a class="header-anchor" href="#runsddp" aria-label="Permalink to &quot;\`runsddp\`&quot;">​</a></h3><p>The launcher for the device-announcement daemon: starts the broadcaster that keeps the household map populated.</p><p><a href="/anacapad-internals/files/etc/runsddp">View</a> · <a href="/anacapad-internals/files/etc/runsddp">Download</a> · 651 B</p><details class="details custom-block"><summary>Preview</summary><p>First 26 of 26 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#####</span></span>
<span class="line"><span># Handler script for sddpd, the Device Discovery Protocol daemon developed</span></span>
<span class="line"><span># by Control4. This is meant to be run in perpetuity thanks to the inittab.</span></span>
<span class="line"><span># If you must use another technique for SDDP, touch</span></span>
<span class="line"><span># /var/run/stopsddp and run \`killall sddpd\`.</span></span>
<span class="line"><span>#####</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart sddpd /var/run/sddpd.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span># sddpd requires IP and DNS.</span></span>
<span class="line"><span>waitfordns</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ -f /var/run/stopsddp ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>sddpd_opts=&quot;-n&quot; # don&#39;t daemonize</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -f /jffs/dev_sddp.conf ]; then</span></span>
<span class="line"><span>  echo &quot;Found /jffs/dev_sddp.conf; using it instead of default /etc/sddp.conf.&quot;</span></span>
<span class="line"><span>  sddpd_opts=&quot;$sddpd_opts -c /jffs/dev_sddp.conf&quot;</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>exec /sbin/sddpd $sddpd_opts</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/runsddp</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 651 B (651 bytes)</li><li><strong>SHA-256:</strong> <code>60984a4598d37a6ac93bc3be3a29708537bbd8c4118ca884452ed2d99bcc66aa</code></li></ul><p>Starts sddpd with /etc/sddpd.conf.</p></details><h3 id="mount-jffs-sh" tabindex="-1"><code>mount_jffs.sh</code> <a class="header-anchor" href="#mount-jffs-sh" aria-label="Permalink to &quot;\`mount_jffs.sh\`&quot;">​</a></h3><p>The script that mounts the writable partition: the step during boot that makes the speaker&#39;s saved settings, logs, and queues available. Until this runs, the device only has its read-only image.</p><p><a href="/anacapad-internals/files/etc/scripts/mount_jffs.sh">View</a> · <a href="/anacapad-internals/files/etc/scripts/mount_jffs.sh">Download</a> · 389 B</p><details class="details custom-block"><summary>Preview</summary><p>First 21 of 21 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Copyright (c) 2022, Sonos, Inc.  All rights reserved.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>sonos_mount_jffs()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    mount -t jffs2 -o noatime /dev/nandjffs /jffs</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>sonos_unmount_jffs()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    grep -q /jffs /proc/mounts</span></span>
<span class="line"><span>    ret=$?</span></span>
<span class="line"><span>    if [ $ret -eq 0 ]; then</span></span>
<span class="line"><span>        umount /jffs</span></span>
<span class="line"><span>        ret=$?</span></span>
<span class="line"><span>        if [ $ret -ne 0 ]; then</span></span>
<span class="line"><span>            echo &quot;error umounting /jffs: $ret&quot; 1&gt;&amp;2</span></span>
<span class="line"><span>            return $ret</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/scripts/mount_jffs.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 389 B (389 bytes)</li><li><strong>SHA-256:</strong> <code>af1c5c97306ffd2b06366562b5ea601814310739d671c2f938a4958cabee4d69</code></li></ul><p>Mounts the jffs2 flash partition at /jffs; ordering matters because nearly every subsystem reads persisted state from it.</p></details><h3 id="run-sshd-sh" tabindex="-1"><code>run_sshd.sh</code> <a class="header-anchor" href="#run-sshd-sh" aria-label="Permalink to &quot;\`run_sshd.sh\`&quot;">​</a></h3><p>The script that conditionally starts the SSH daemon: SSH exists on the box but is gated, and this is the gatekeeper deciding whether remote shell access is allowed at all.</p><p><a href="/anacapad-internals/files/etc/scripts/run_sshd.sh">View</a> · <a href="/anacapad-internals/files/etc/scripts/run_sshd.sh">Download</a> · 499 B</p><details class="details custom-block"><summary>Preview</summary><p>First 18 of 18 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span># Copyright (c) 2019-2023, Sonos, Inc.  All rights reserved.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart dropbear /var/run/dropbear.start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ ! -f /tmp/device_unlocked_flag ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mkdir -p /jffs/persist/ssh</span></span>
<span class="line"><span>mkdir -m 700 -p /jffs/sys/debug/ssh</span></span>
<span class="line"><span>if [ ! -f /jffs/sys/debug/ssh/authorized_keys ]; then</span></span>
<span class="line"><span>    touch /jffs/sys/debug/ssh/authorized_keys</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>if [ ! -s /jffs/persist/ssh/dropbear_ecdsa_host_key ]; then</span></span>
<span class="line"><span>    rm /jffs/persist/ssh/dropbear_ecdsa_host_key</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>exec /usr/bin/dropbear -R -F</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/etc/scripts/run_sshd.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 499 B (499 bytes)</li><li><strong>SHA-256:</strong> <code>822523d641bd6ee7ea0b271e4dadb05ebe598249f86d0717f03cc6394ba97732</code></li></ul><p>Starts dropbear only when the device is in a permitted state (engineering/unlock path); installs host keys under /jffs/persist/ssh on first run.</p></details><h3 id="netconfig-sh" tabindex="-1"><code>netconfig.sh</code> <a class="header-anchor" href="#netconfig-sh" aria-label="Permalink to &quot;\`netconfig.sh\`&quot;">​</a></h3><p>The network reconfiguration state machine in a single shell script: one call with a mode argument moves the player between Sonos&#39;s mesh, normal home WiFi, the open setup hotspot, credential-checking, or a standalone island mode. It is why the speaker can hop between network setups without reflashing.</p><p><a href="/anacapad-internals/files/usr/sbin/netconfig.sh">View</a> · <a href="/anacapad-internals/files/usr/sbin/netconfig.sh">Download</a> · 10.7 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 449 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>case &quot;$1&quot; in</span></span>
<span class="line"><span>    sonosnet|station|satellite|sta_and_sat|open|credcheck|deauth|wacexit|island|up)</span></span>
<span class="line"><span>        MODE=&quot;$1&quot;</span></span>
<span class="line"><span>        WAC=0</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    wacstart|wacapclose|wactimeout)</span></span>
<span class="line"><span>        MODE=&quot;$1&quot;</span></span>
<span class="line"><span>        WAC=1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    waccredcheck)</span></span>
<span class="line"><span>        MODE=credcheck</span></span>
<span class="line"><span>        WAC=1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    wacapopen)</span></span>
<span class="line"><span>        MODE=open</span></span>
<span class="line"><span>        WAC=1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    wacstation)</span></span>
<span class="line"><span>        MODE=station</span></span>
<span class="line"><span>        WAC=1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>        echo &quot;Illegal mode!&quot;</span></span>
<span class="line"><span>        exit 1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span></span></span>
<span class="line"><span>case &quot;$2&quot; in</span></span>
<span class="line"><span>    stp_disable)</span></span>
<span class="line"><span>        STPSTATE=&quot;off&quot;</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    stp_enable)</span></span>
<span class="line"><span>        STPSTATE=&quot;on&quot;</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>        echo &quot;Illegal STP state!&quot;</span></span>
<span class="line"><span>        exit 1</span></span>
<span class="line"><span>        ;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PARAM1=&quot;$3&quot;</span></span>
<span class="line"><span>PARAM2=&quot;$4&quot;</span></span>
<span class="line"><span>PARAM3=&quot;$5&quot;</span></span>
<span class="line"><span>PARAM4=&quot;$6&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>ARCH_ATTRS=/etc/arch_attrs</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ -f /jffs/debug/testpoints.sh ] &amp;&amp; \\</span></span>
<span class="line"><span>   [ &quot;\`cat /proc/sonos-lock/exec_enable\`&quot; == &quot;1&quot; ]; then</span></span>
<span class="line"><span>    . /jffs/debug/testpoints.sh || true</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [ &quot;\${WAC}&quot; = &quot;0&quot; ]; then</span></span>
<span class="line"><span>    if [ -f /tmp/wacd.pid ]; then</span></span>
<span class="line"><span>        kill \`cat /tmp/wacd.pid\`</span></span>
<span class="line"><span>        rm -f /tmp/wacd.pid</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/usr/sbin/netconfig.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 10.7 KB (10932 bytes)</li><li><strong>SHA-256:</strong> <code>13f8bb6219d077e3eac73df1005b42547306f7d506ce62752a5db9cbcd2aea83</code></li></ul><p>The netconfig FSM documented under netconfig_fsm: modes include SonosNet join, infrastructure join, open-AP setup, check-only, and island; touches wpa_supplicant, ssidlist, and the flag files under /var/run.</p></details><h3 id="secure-console-sh" tabindex="-1"><code>secure_console.sh</code> <a class="header-anchor" href="#secure-console-sh" aria-label="Permalink to &quot;\`secure_console.sh\`&quot;">​</a></h3><p>The secure console gate: the script that decides whether the device will expose a debug console, checking the unlock state before offering a shell.</p><p><a href="/anacapad-internals/files/usr/sbin/secure_console.sh">View</a> · <a href="/anacapad-internals/files/usr/sbin/secure_console.sh">Download</a> · 236 B</p><details class="details custom-block"><summary>Preview</summary><p>First 7 of 7 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span># This is a wrapper script called by getty, which is unable to pass</span></span>
<span class="line"><span># arguments to the program it starts (typically login). We need to pass</span></span>
<span class="line"><span># the user to login as (-f root).</span></span>
<span class="line"><span>echo &quot;Starting console...&quot;</span></span>
<span class="line"><span>exec /bin/login -f root</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/usr/sbin/secure_console.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 236 B (236 bytes)</li><li><strong>SHA-256:</strong> <code>fa1827c45a7048097e57a0660942022f10ef4420b0e53d50fb35e68078f4f30b</code></li></ul><p>Gates console access on the device-unlock flag (/tmp/device_unlocked_flag family); part of the engineering surfaces documented under dev_unlock.</p></details><h3 id="secure-console-login-sh" tabindex="-1"><code>secure_console_login.sh</code> <a class="header-anchor" href="#secure-console-login-sh" aria-label="Permalink to &quot;\`secure_console_login.sh\`&quot;">​</a></h3><p>The login half of the secure console: how a permitted console session is actually opened once the gate allows it.</p><p><a href="/anacapad-internals/files/usr/sbin/secure_console_login.sh">View</a> · <a href="/anacapad-internals/files/usr/sbin/secure_console_login.sh">Download</a> · 1.0 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 33 of 33 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Wrapper around getty to wait for dynamic devices (USB) and enforce</span></span>
<span class="line"><span># console security. Passed tty, baud rate, and other parameters, which</span></span>
<span class="line"><span># are then passed to getty.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>. /etc/rundaemon.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tty=\`basename $1\`</span></span>
<span class="line"><span>baud=$2</span></span>
<span class="line"><span>extra=$3</span></span>
<span class="line"><span>shift 3</span></span>
<span class="line"><span>while [ $# -gt 0 ]</span></span>
<span class="line"><span>	do extra=&quot;$extra $1&quot;</span></span>
<span class="line"><span>	shift</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>trackrestart getty-$tty /var/run/getty-\${tty}.start 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>waitwhiletrue &quot;[ ! -c /dev/$tty ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># In early development, this file may not exist. Also, it will not</span></span>
<span class="line"><span># exist on pre-secure boot plauers. In both cases, we&#39;ll enable the</span></span>
<span class="line"><span># console by default. Note that on pre-secure boot players, the</span></span>
<span class="line"><span># console is disabled by other methods.</span></span>
<span class="line"><span>[ -f /proc/sonos-lock/console_enable ] &amp;&amp;</span></span>
<span class="line"><span>	waitwhiletrue &quot;[ \`cat /proc/sonos-lock/console_enable\` != &#39;1&#39; ]&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Start a getty on the tty passed in as our parameter.</span></span>
<span class="line"><span># Since USB may be hot-plugged, and because initialization happens</span></span>
<span class="line"><span># this device might not instantiated at the time the script starts,</span></span>
<span class="line"><span># so the scripts I/O is set to be logged at first.</span></span>
<span class="line"><span>exec getty -L -w $extra $tty $baud linux &lt; /dev/$tty &gt; /dev/$tty 2&gt;&amp;1</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/usr/sbin/secure_console_login.sh</code></li><li><strong>Category:</strong> scripts</li><li><strong>Size:</strong> 1.0 KB (1048 bytes)</li><li><strong>SHA-256:</strong> <code>69e775c702e96d1688c33ab498e286f88bbf682d503eef70a1223ed8b1ce59de</code></li></ul><p>Companion to secure_console.sh; performs the session setup after the gate check.</p></details>`,83)])])}const m=a(t,[["render",l]]);export{u as __pageData,m as default};
