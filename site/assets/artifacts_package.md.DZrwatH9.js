import{_ as s,o as e,c as n,ag as p}from"./chunks/framework.BXn5fPR3.js";const g=JSON.parse('{"title":"Artifacts: Firmware package pieces","description":"","frontmatter":{},"headers":[],"relativePath":"artifacts/package.md","filePath":"artifacts/package.md"}'),t={name:"artifacts/package.md"};function i(l,a,o,r,c,d){return e(),n("div",null,[...a[0]||(a[0]=[p(`<h1 id="artifacts-firmware-package-pieces" tabindex="-1">Artifacts: Firmware package pieces <a class="header-anchor" href="#artifacts-firmware-package-pieces" aria-label="Permalink to &quot;Artifacts: Firmware package pieces&quot;">​</a></h1><p>The parts of the actual update file Sonos ships: the kernel image, the compressed filesystem that contains everything else on this page, the installer script, and the factory data block written per-device. Together these are what a firmware update physically delivers to the speaker.</p><details class="details custom-block"><summary>Technical details</summary><p>Sections extracted from the signed .upd update package: uImage kernel, squashfs rootfs, preinstall script, and the per-device NCD payload template.</p></details><h3 id="_86-10-80260-1-9-device-payload-bin" tabindex="-1"><code>86.10-80260-1-9-device-payload.bin</code> <a class="header-anchor" href="#_86-10-80260-1-9-device-payload-bin" aria-label="Permalink to &quot;\`86.10-80260-1-9-device-payload.bin\`&quot;">​</a></h3><p>The factory data template: a small binary block carrying the per-unit identity slots (serial, MAC, calibration) that get filled in when the device is manufactured. Amusingly, its embedded template still carries a 2012-era factory timestamp from the original Playbar.</p><p><a href="/anacapad-internals/files/package/86.10-80260-1-9-device-payload.bin">Download</a> · 53.5 KB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/package/86.10-80260-1-9-device-payload.bin</code></li><li><strong>Category:</strong> package</li><li><strong>Size:</strong> 53.5 KB (54757 bytes)</li><li><strong>SHA-256:</strong> <code>36b47a4c7ef9e974ccfa82efda203754f0316ddc38b836e66b050e71074ae7cc</code></li></ul><p>Section-13 payload from the .upd, about 55 KB. Its tagged-record layout (board ID &#39;3s50avq100&#39;, the &#39;2012/06/14&#39; template date, empty serial/MAC slots) is fully decoded on the firmware-differences page; mdputil -B initializes it.</p></details><h3 id="_86-10-80260-1-9-kernel-uimage" tabindex="-1"><code>86.10-80260-1-9-kernel.uImage</code> <a class="header-anchor" href="#_86-10-80260-1-9-kernel-uimage" aria-label="Permalink to &quot;\`86.10-80260-1-9-kernel.uImage\`&quot;">​</a></h3><p>The Linux kernel image for this firmware: the actual operating-system core the speaker boots. Everything else on this page runs on top of it.</p><p><a href="/anacapad-internals/files/package/86.10-80260-1-9-kernel.uImage">Download</a> · 1.7 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/package/86.10-80260-1-9-kernel.uImage</code></li><li><strong>Category:</strong> package</li><li><strong>Size:</strong> 1.7 MB (1792719 bytes)</li><li><strong>SHA-256:</strong> <code>f74b36a9a6ae5efe2fe0c1ea1daf05ed5e30212bfe48a30b2c4ea7af2da4ae34</code></li></ul><p>uImage-wrapped ARM kernel from the update package, about 1.8 MB. The modules/ and wifi/ kernel objects above load into this kernel at boot.</p></details><h3 id="_86-10-80260-1-9-preinstall-sh" tabindex="-1"><code>86.10-80260-1-9-preinstall.sh</code> <a class="header-anchor" href="#_86-10-80260-1-9-preinstall-sh" aria-label="Permalink to &quot;\`86.10-80260-1-9-preinstall.sh\`&quot;">​</a></h3><p>The installer script inside the update package: the small program that runs on the device when a firmware update lands, preparing the new image for installation.</p><p><a href="/anacapad-internals/files/package/86.10-80260-1-9-preinstall.sh">View</a> · <a href="/anacapad-internals/files/package/86.10-80260-1-9-preinstall.sh">Download</a> · 1.6 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 58 of 58 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span>kill_attempt () {</span></span>
<span class="line"><span>    echo &quot;Killing $1&quot;</span></span>
<span class="line"><span>    kill \`ps | grep $1 | grep -v grep | cut -c 1-5\`</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if [ &quot;$1&quot; = &quot;umountnone&quot; ]; then</span></span>
<span class="line"><span>    REGION=$(/bin/mdputil | /usr/sbin/keyval ^REGION)</span></span>
<span class="line"><span>    if [ &quot;$REGION&quot; = &quot;5&quot; ]; then</span></span>
<span class="line"><span>        echo &quot;Setting REGION=2&quot;</span></span>
<span class="line"><span>        /bin/mdputil -fwe 2</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>if [ &quot;$1&quot; = &quot;postinst&quot; ]; then</span></span>
<span class="line"><span>    echo &quot;Doing post-install steps...&quot;</span></span>
<span class="line"><span>    rm -f /jffs/upgrade_prev.log</span></span>
<span class="line"><span>    if [ -e /jffs/upgrade.log ]; then</span></span>
<span class="line"><span>	cp /jffs/upgrade.log /jffs/upgrade_prev.log</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    if [ -e /tmp/upgrade.log ]; then</span></span>
<span class="line"><span>        cp /tmp/upgrade.log /jffs/.</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        echo &quot;Manual upgrade. No log to copy.&quot; &gt; /jffs/upgrade.log</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    if [ ! -e /jffs/upgrade_sys_report.log ]; then</span></span>
<span class="line"><span>        touch /jffs/upgrade_sys_report.log</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    sync</span></span>
<span class="line"><span>    sync</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>echo &quot;Checking space on jffs&quot;</span></span>
<span class="line"><span>jffsusage=$(df -h | grep &#39;98%\\|99%\\|100% /jffs&#39;)</span></span>
<span class="line"><span>if [ &quot;$jffsusage&quot; ]; then</span></span>
<span class="line"><span>    echo &quot;WARNING: /jffs usage near or at capacity. Upgrade might fail as a result.&quot;</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    echo &quot;Enough /jffs space to continue upgrade.&quot;</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span>if [ -d /dev/mtd ]; then</span></span>
<span class="line"><span>    if [ -f /var/run/upgradeflag ]; then</span></span>
<span class="line"><span>        echo &quot;Proceeding with upgrade...&quot;</span></span>
<span class="line"><span>        exit 0</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    echo -n &quot;Checking to see if anacapad is running...&quot;</span></span>
<span class="line"><span>    ps | grep -v grep | grep anacapad &gt; /dev/null</span></span>
<span class="line"><span>    if [ $? = 0 ]; then</span></span>
<span class="line"><span>        echo &quot;Anacapa is running - please stop it and run upgrade again.&quot;</span></span>
<span class="line"><span>        exit 1</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>    echo &quot;Stopping ancillary processes...&quot;</span></span>
<span class="line"><span>    kill_attempt udhcpc</span></span>
<span class="line"><span>    kill_attempt inetd</span></span>
<span class="line"><span>    touch /var/run/stopnetstartd</span></span>
<span class="line"><span>    kill_attempt netstartd</span></span>
<span class="line"><span>    sleep 2</span></span>
<span class="line"><span>    touch /var/run/upgradeflag</span></span>
<span class="line"><span>    exit 0</span></span>
<span class="line"><span>fi</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/package/86.10-80260-1-9-preinstall.sh</code></li><li><strong>Category:</strong> package</li><li><strong>Size:</strong> 1.6 KB (1599 bytes)</li><li><strong>SHA-256:</strong> <code>feddb7ad14034b06c316ccbed244a11925093a882a9d7bd81ea64a61364cbe70</code></li></ul><p>Pre-install script from the .upd; runs ahead of the squashfs/rootfs swap during upgrade.</p></details><h3 id="_86-10-80260-1-9-rootfs-squashfs" tabindex="-1"><code>86.10-80260-1-9-rootfs.squashfs</code> <a class="header-anchor" href="#_86-10-80260-1-9-rootfs-squashfs" aria-label="Permalink to &quot;\`86.10-80260-1-9-rootfs.squashfs\`&quot;">​</a></h3><p>The compressed filesystem image: the single block that contains the entire root filesystem, all the files on this page included. This is what the device actually writes during an update.</p><p><a href="/anacapad-internals/files/package/86.10-80260-1-9-rootfs.squashfs">Download</a> · 13.3 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/package/86.10-80260-1-9-rootfs.squashfs</code></li><li><strong>Category:</strong> package</li><li><strong>Size:</strong> 13.3 MB (13918208 bytes)</li><li><strong>SHA-256:</strong> <code>c8deece292bf7025be0533ca4c238e582d2890872ce4681a8ade7666dbbb81d6</code></li></ul><p>Squashfs image (~14 MB) extracted from the .upd; the rootfs-86.10-80260-1-9 directory on this site was unpacked from this file.</p></details><h3 id="_86-10-80260-1-9-upd" tabindex="-1"><code>86.10-80260-1-9.upd</code> <a class="header-anchor" href="#_86-10-80260-1-9-upd" aria-label="Permalink to &quot;\`86.10-80260-1-9.upd\`&quot;">​</a></h3><p>The complete update package itself: the signed bundle Sonos&#39;s servers deliver when this model updates, containing the kernel, the filesystem, and the installer all in one signed file.</p><p><a href="/anacapad-internals/files/package/86.10-80260-1-9.upd">Download</a> · 15.2 MB</p><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/package/86.10-80260-1-9.upd</code></li><li><strong>Category:</strong> package</li><li><strong>Size:</strong> 15.2 MB (15919011 bytes)</li><li><strong>SHA-256:</strong> <code>6c82af3a66596cac485e30b8b8f2f89f7039f211a379686d011786173db447de</code></li></ul><p>The signed .upd for build 86.10-80260-1-9 (~16 MB). Everything under the other categories on this page ultimately comes from inside this file.</p></details>`,24)])])}const h=s(t,[["render",i]]);export{g as __pageData,h as default};
