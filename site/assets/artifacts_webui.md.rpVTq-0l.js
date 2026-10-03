import{_ as a,o as n,c as p,ag as e}from"./chunks/framework.BXn5fPR3.js";const g=JSON.parse('{"title":"Artifacts: Diagnostics web pages","description":"","frontmatter":{},"headers":[],"relativePath":"artifacts/webui.md","filePath":"artifacts/webui.md"}'),t={name:"artifacts/webui.md"};function l(o,s,i,c,r,u){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="artifacts-diagnostics-web-pages" tabindex="-1">Artifacts: Diagnostics web pages <a class="header-anchor" href="#artifacts-diagnostics-web-pages" aria-label="Permalink to &quot;Artifacts: Diagnostics web pages&quot;">​</a></h1><p>The raw ingredients of the speaker&#39;s hidden status website: JavaScript and HTML pages you can reach in a browser at the player&#39;s address. Sonos support and engineers use these pages to inspect a player; this is what the site actually is under the hood.</p><details class="details custom-block"><summary>Technical details</summary><p>Static assets served by the embedded web server from /opt/htdocs and the locked variant /opt/htdocs_locked (gated DSP console pages).</p></details><h3 id="perfcounters-js" tabindex="-1"><code>perfcounters.js</code> <a class="header-anchor" href="#perfcounters-js" aria-label="Permalink to &quot;\`perfcounters.js\`&quot;">​</a></h3><p>The JavaScript behind the performance-counters status page: it fetches the counter data from the speaker and draws it in your browser when you visit the diagnostics site.</p><p><a href="/anacapad-internals/files/opt/htdocs/perfcounters.js">View</a> · <a href="/anacapad-internals/files/opt/htdocs/perfcounters.js">Download</a> · 9.0 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 218 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/// Copyright (c) 2023, Sonos, Inc.  All rights reserved.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>let perfcounter = {</span></span>
<span class="line"><span>    // entry function which actually generates two top level elements:</span></span>
<span class="line"><span>    // a &lt;header&gt; for the title and miscellaneous metadata and a &lt;table&gt; for the actual data</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    generateTableForEach: function (id, counters) </span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        //clear old</span></span>
<span class="line"><span>        let div = document.getElementById(id);</span></span>
<span class="line"><span>        div.innerHTML = &#39;&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        const captionText = document.createTextNode(&#39;Hover over each column header for a detailed description&#39;);</span></span>
<span class="line"><span>        div.appendChild(captionText);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        counters.forEach(counter =&gt; {</span></span>
<span class="line"><span>            this.generateTable(id, counter);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    generateTable: function (id, perfcounter) </span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        const div = document.getElementById(id);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.generateTableMetadata(perfcounter, div);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        const table = document.createElement(&#39;table&#39;);</span></span>
<span class="line"><span>        table.classList.add(&quot;purple&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.generateTableHeader(table, perfcounter);</span></span>
<span class="line"><span>        this.generateTableBody(table, perfcounter);</span></span>
<span class="line"><span>        div.appendChild(table);</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // display the title and list metadata values (besides the counter metadata which is rendered as tooltips)</span></span>
<span class="line"><span>    generateTableMetadata: function (perfcounter, div)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        const header = document.createElement(&#39;header&#39;);</span></span>
<span class="line"><span>        const heading = document.createElement(&#39;h2&#39;);</span></span>
<span class="line"><span>        const headingText = document.createTextNode(perfcounter.table);</span></span>
<span class="line"><span>        heading.appendChild(headingText);</span></span>
<span class="line"><span>        header.appendChild(heading);</span></span>
<span class="line"><span>        div.appendChild(header);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // process the non-counters metadata</span></span>
<span class="line"><span>        const noncountersList = document.createElement(&#39;ul&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        const keys = Object.keys(perfcounter.metadata);</span></span>
<span class="line"><span>        for (const key of keys) {</span></span>
<span class="line"><span>            if (key != &#39;counters&#39;) {</span></span>
<span class="line"><span>                noncountersList.appendChild(this.createMetadataListItem(key, perfcounter.metadata[key]));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        div.appendChild(noncountersList);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!perfcounter.metadata.counters.length) {</span></span>
<span class="line"><span>            heading.textContent += &#39; contains no counters&#39;;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    },</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/perfcounters.js</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 9.0 KB (9230 bytes)</li><li><strong>SHA-256:</strong> <code>ac4fb0d72fa0a4dfffcd4921e0461cb14018ab929841d18028bc0c89b52efaff</code></li></ul><p>Client-side script for the perf-counter status page; pairs with the perf_counters schema documented on the subsystems page.</p></details><h3 id="review-js" tabindex="-1"><code>review.js</code> <a class="header-anchor" href="#review-js" aria-label="Permalink to &quot;\`review.js\`&quot;">​</a></h3><p>The script for a review-style page in the built-in web UI, working with the matching stylesheet file.</p><p><a href="/anacapad-internals/files/opt/htdocs/review.js">View</a> · <a href="/anacapad-internals/files/opt/htdocs/review.js">Download</a> · 15.5 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 448 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function trimAll( strValue ) {</span></span>
<span class="line"><span> var objRegExp = /^(\\s*)$/;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //check for all spaces</span></span>
<span class="line"><span>    if(objRegExp.test(strValue)) {</span></span>
<span class="line"><span>       strValue = strValue.replace(objRegExp, &#39;&#39;);</span></span>
<span class="line"><span>       if( strValue.length == 0)</span></span>
<span class="line"><span>          return strValue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   //check for leading &amp; trailing spaces</span></span>
<span class="line"><span>   objRegExp = /^(\\s*)([\\W\\w]*)(\\b\\s*$)/;</span></span>
<span class="line"><span>   if(objRegExp.test(strValue)) {</span></span>
<span class="line"><span>       //remove leading and trailing whitespace characters</span></span>
<span class="line"><span>       strValue = strValue.replace(objRegExp, &#39;$2&#39;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  return strValue;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var strengthData = new Array();</span></span>
<span class="line"><span>var macAddrs = new Array();</span></span>
<span class="line"><span>var macAddrsToZoneNames = new Array();</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>function finishDrawTable(tbodyID) {</span></span>
<span class="line"><span>    var th, tr, td, txt, br;</span></span>
<span class="line"><span>	var zp,nf,ofdm;</span></span>
<span class="line"><span>    tbody = document.getElementById(tbodyID);</span></span>
<span class="line"><span>    // create holder for accumulated tbody elements and text nodes</span></span>
<span class="line"><span>    var frag = document.createDocumentFragment();</span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span>    // Make column headings</span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span>    tr = document.createElement(&quot;tr&quot;);</span></span>
<span class="line"><span>    th = document.createElement(&quot;th&quot;); tr.appendChild(th);</span></span>
<span class="line"><span>    for (var i = 0; i &lt; macAddrs.length; i++) {</span></span>
<span class="line"><span>	if(macAddrs[i] != &quot;eth0&quot; &amp;&amp; macAddrs[i] != &quot;eth1&quot;)</span></span>
<span class="line"><span>	{</span></span>
<span class="line"><span>        th = document.createElement(&quot;th&quot;);</span></span>
<span class="line"><span>	txt = document.createTextNode(&quot;Strength to&quot;); th.appendChild(txt);</span></span>
<span class="line"><span>	br = document.createElement(&quot;br&quot;); th.appendChild(br);</span></span>
<span class="line"><span>        txt = document.createTextNode(macAddrs[i]); th.appendChild(txt);</span></span>
<span class="line"><span>	br = document.createElement(&quot;br&quot;); th.appendChild(br);</span></span>
<span class="line"><span>        txt = document.createTextNode(macAddrsToZoneNames[macAddrs[i]]); th.appendChild(txt);</span></span>
<span class="line"><span>	tr.appendChild(th);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    frag.appendChild(tr);</span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span>    // loop through data source</span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span>    for (var i = 0; i &lt; strengthData.length; i++) {</span></span>
<span class="line"><span>        var sd = strengthData[i];</span></span>
<span class="line"><span>    	tr = document.createElement(&quot;tr&quot;);</span></span>
<span class="line"><span>    	</span></span>
<span class="line"><span>    	td = document.createElement(&quot;td&quot;);</span></span>
<span class="line"><span>    	td.setAttribute(&quot;class&quot;, &quot;ctr&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    	txt = document.createTextNode(sd.macAddr); td.appendChild(txt);</span></span>
<span class="line"><span>        br = document.createElement(&quot;br&quot;); td.appendChild(br);</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs/review.js</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 15.5 KB (15822 bytes)</li><li><strong>SHA-256:</strong> <code>58300bba90ff52b053921a08e494df9d839bb747a08fbe701ecfbbf99ce6b710</code></li></ul><p>Companion to xml/review.xsl for the status site&#39;s review page.</p></details><h3 id="configdsp-css" tabindex="-1"><code>configDSP.css</code> <a class="header-anchor" href="#configdsp-css" aria-label="Permalink to &quot;\`configDSP.css\`&quot;">​</a></h3><p>The stylesheet for the DSP console page.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.css">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.css">Download</a> · 5.8 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 282 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>body {</span></span>
<span class="line"><span>	font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica, Geneva, sans-serif;</span></span>
<span class="line"><span>	background-color: #ebf0f6;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>h1 {</span></span>
<span class="line"><span>	color: #4f555c;</span></span>
<span class="line"><span>	margin-left: 25px;</span></span>
<span class="line"><span>	font-weight: bold;</span></span>
<span class="line"><span>	font-size: 2.5em;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#message {</span></span>
<span class="line"><span>	font-size: 1em;</span></span>
<span class="line"><span>	margin: 0;</span></span>
<span class="line"><span>	padding: 5px 10px;</span></span>
<span class="line"><span>	background-color: #fcda78;</span></span>
<span class="line"><span>	border: 1px solid #d0b463;</span></span>
<span class="line"><span>	display: inline;</span></span>
<span class="line"><span>	line-height: 1.75em;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#cant_load_warning {</span></span>
<span class="line"><span>	font-size: 1.0em;</span></span>
<span class="line"><span>	color: #ececec;</span></span>
<span class="line"><span>	padding: 25px;</span></span>
<span class="line"><span>	background-color: #d3050a;</span></span>
<span class="line"><span>	font-weight: bold;</span></span>
<span class="line"><span>	text-align: center;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#cant_load_warning h2 {</span></span>
<span class="line"><span>	font-size: 1.5em;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#cant_load_warning a {</span></span>
<span class="line"><span>	color: #fdf73a;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ab_control {</span></span>
<span class="line"><span>    border: 1px solid black;</span></span>
<span class="line"><span>    background-color: #c8c8c8;</span></span>
<span class="line"><span>	padding: 4px 8px;</span></span>
<span class="line"><span>	position: fixed;</span></span>
<span class="line"><span>	right: 15px;</span></span>
<span class="line"><span>	top: 15px;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#ab_control:hover {</span></span>
<span class="line"><span>	background-color: #9c9c9c;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#ab_control:active {</span></span>
<span class="line"><span>	background-color: #898989;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#AB_indicator {</span></span>
<span class="line"><span>	font-size: 6em;</span></span>
<span class="line"><span>	font-weight: bold;</span></span>
<span class="line"><span>	text-align: center;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#import_export {</span></span>
<span class="line"><span>	position: fixed;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/configDSP.css</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 5.8 KB (5958 bytes)</li><li><strong>SHA-256:</strong> <code>e0f5761e73fd0e00e15400ca5a285b0303576457c1f5e35b67d9ded25cb51780</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h3 id="configdsp-htm" tabindex="-1"><code>configDSP.htm</code> <a class="header-anchor" href="#configdsp-htm" aria-label="Permalink to &quot;\`configDSP.htm\`&quot;">​</a></h3><p>The HTML shell of the hidden DSP console: a gated page in the diagnostics site that exposes the audio-processing knobs, meant for engineering rather than daily use.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.htm">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.htm">Download</a> · 1.7 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 46 of 46 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;html&gt;</span></span>
<span class="line"><span>&lt;head&gt;</span></span>
<span class="line"><span>  &lt;title&gt;Config DSP&lt;/title&gt;</span></span>
<span class="line"><span>  &lt;script type=&quot;text/javascript&quot; src=&quot;configDSP.js&quot;&gt;&lt;/script&gt;</span></span>
<span class="line"><span>  &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;configDSP.css&quot; /&gt;</span></span>
<span class="line"><span>&lt;/head&gt;</span></span>
<span class="line"><span>&lt;body onload=&quot; onPageLoad();&quot;&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;export_overlay&quot; onclick=&quot;exportOverlayOff()&quot;&gt;</span></span>
<span class="line"><span>    &lt;div id=&quot;export_table_div&quot; style=&quot;padding:20px&quot;&gt;Exported Blocks:&lt;br&gt;</span></span>
<span class="line"><span>      &lt;table id=&quot;export_table&quot;&gt;</span></span>
<span class="line"><span>      &lt;/table&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;ab_control&quot; onclick=&quot;toggleAB();&quot;&gt;</span></span>
<span class="line"><span>    &lt;div id=&quot;toggle_button&quot;&gt;Toggle A/B&lt;/div&gt;</span></span>
<span class="line"><span>    &lt;div id=&quot;AB_indicator&quot;&gt; &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;import_export&quot;&gt;</span></span>
<span class="line"><span>    &lt;span id=&quot;import_export_title&quot; onclick=&quot;toggleImportExport();&quot;&gt;Import/Export&lt;/span&gt;</span></span>
<span class="line"><span>    &lt;div id=&quot;import_export_body&quot; style=&quot;display:none;&quot;&gt;</span></span>
<span class="line"><span>      &lt;div class=&quot;section&quot;&gt;</span></span>
<span class="line"><span>        &lt;div style=&quot;width: 50%; float:center&quot;&gt;</span></span>
<span class="line"><span>          &lt;button class=&quot;button&quot; onclick=&quot;onExport();&quot; &gt;Export&lt;/button&gt;</span></span>
<span class="line"><span>        &lt;/div&gt;</span></span>
<span class="line"><span>        &lt;div style=&quot;width: 50%; float:center; padding-top: 10px;&quot;&gt;</span></span>
<span class="line"><span>          &lt;button class=&quot;button&quot; onclick=&quot;onExportSelectedBlocks();&quot;&gt;Export Selected Blocks</span></span>
<span class="line"><span>          &lt;/button&gt;</span></span>
<span class="line"><span>        &lt;/div&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>      &lt;div class=&quot;section&quot;&gt;</span></span>
<span class="line"><span>        Import Presets:</span></span>
<span class="line"><span>        &lt;input type=&quot;file&quot; id=&quot;fileInput&quot;/&gt;</span></span>
<span class="line"><span>        &lt;div id=&quot;import_form&quot; style=&quot;display:none;&quot;&gt;</span></span>
<span class="line"><span>        &lt;/div&gt;</span></span>
<span class="line"><span>      &lt;/div&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;/div&gt;</span></span>
<span class="line"><span>  &lt;h1&gt;DSP System (Version: 0.25.3)&lt;/h1&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;cant_load_warning&quot;&gt;&lt;h2&gt;There was an error loading the page.&lt;/h2&gt;&lt;p&gt;Make sure you are using &lt;a href=&quot;http://getfirefox.com&quot;&gt;Firefox 3&lt;/a&gt;, and that you have JavaScript enabled.&lt;/p&gt;&lt;/div&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;message&quot; style=&quot;visibility:hidden;&quot;&gt;&amp;nbsp;&lt;/div&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;!-- These are build dynamically by the script --&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;tabBar&quot;&gt;&lt;/div&gt;</span></span>
<span class="line"><span>  &lt;form id=&quot;dynForm&quot;&gt;&lt;/form&gt;</span></span>
<span class="line"><span>&lt;/body&gt;</span></span>
<span class="line"><span>&lt;/html&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/configDSP.htm</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 1.7 KB (1699 bytes)</li><li><strong>SHA-256:</strong> <code>c0c1ab3d462adeb5847244c9f353d338d1d8345898d5bc2cb9cbdbba8fec5af6</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h3 id="configdsp-js" tabindex="-1"><code>configDSP.js</code> <a class="header-anchor" href="#configdsp-js" aria-label="Permalink to &quot;\`configDSP.js\`&quot;">​</a></h3><p>The JavaScript driving the DSP console page: it reads and writes the audio-processing parameters behind the gated interface.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.js">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/configDSP.js">Download</a> · 94.2 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 1650 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//7/6/13 : update to load getDSP on page load</span></span>
<span class="line"><span>//7/9/13: cleanup dead code</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//TODO: set up POLLING</span></span>
<span class="line"><span>//TODO: validateForm()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//------------------------------------------------------------------------------</span></span>
<span class="line"><span>// global data object - holds all the preset data locally</span></span>
<span class="line"><span>var gMainData;</span></span>
<span class="line"><span>var gMaxNumPresets = 20;</span></span>
<span class="line"><span>var gTextFieldWidth = 12;</span></span>
<span class="line"><span>var gXmlDoc;</span></span>
<span class="line"><span>var gCurrentlyWorking;</span></span>
<span class="line"><span>var gCurrentlyWorkingMessage = &#39;Still working... please wait a moment and try again.&#39;</span></span>
<span class="line"><span>var messageBox;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// A-B Toggling Stuff</span></span>
<span class="line"><span>var ABinfo = [</span></span>
<span class="line"><span>    { name: &quot;A&quot;, preset: -1, bgcolor: &quot;#AE6662&quot;, active: true},</span></span>
<span class="line"><span>    { name: &quot;B&quot;, preset: -1, bgcolor: &quot;#6FA0FF&quot;, active: false},</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Form buttons, so their ids can be changed but we can still get to them</span></span>
<span class="line"><span>var gButtons = new Array();</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>var gIIRFilterOptions = new Array( {option:&quot;highpass2&quot;,         valueType:[&quot;Freq&quot;,&quot;Q&quot;],        defaultValues:[&quot;999&quot;,&quot;0.707&quot;] },</span></span>
<span class="line"><span>                                   {option:&quot;highpass1&quot;,         valueType:[&quot;Freq&quot;],            defaultValues:[&quot;999&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;lowpass2&quot;,          valueType:[&quot;Freq&quot;,&quot;Q&quot;],        defaultValues:[&quot;999&quot;,&quot;0.707&quot;] },</span></span>
<span class="line"><span>                                   {option:&quot;lowpass1&quot;,          valueType:[&quot;Freq&quot;],            defaultValues:[&quot;999&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;shelving bandpass&quot;, valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;rbj shelving bandpass&quot;, valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;lfshelf&quot;,           valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;hfshelf&quot;,           valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;rbj lfshelf&quot;,       valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;rbj hfshelf&quot;,       valueType:[&quot;Freq&quot;,&quot;Q&quot;,&quot;gain dB&quot;], defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;bandpassQ&quot;,         valueType:[&quot;Freq&quot;,&quot;Q&quot;],        defaultValues:[&quot;999&quot;,&quot;0.707&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;allpass&quot;,           valueType:[&quot;Freq&quot;,&quot;Q&quot;],        defaultValues:[&quot;999&quot;,&quot;0.707&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;allpass1&quot;,          valueType:[&quot;Freq&quot;],            defaultValues:[&quot;999&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;gain&quot;,              valueType:[&quot;gain linear&quot;],     defaultValues:[&quot;1.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;bass1&quot;,             valueType:[&quot;gain dB&quot;],         defaultValues:[&quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;treble1&quot;,           valueType:[&quot;gain dB&quot;],         defaultValues:[&quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;blank&quot;,             valueType:[],                  defaultValues:[]},</span></span>
<span class="line"><span>                                   {option:&quot;mute&quot;,              valueType:[],                  defaultValues:[]},</span></span>
<span class="line"><span>                                   {option:&quot;loudness&quot;,          valueType:[&quot;FreqLF&quot;,&quot;gainLF&quot;,&quot;FreqHF&quot;,&quot;gainHF&quot;], defaultValues:[&quot;999&quot;,&quot;0.0&quot;, &quot;999&quot;, &quot;0.0&quot;]},</span></span>
<span class="line"><span>                                   {option:&quot;custom&quot;,            valueType:[&quot;b0&quot;,&quot;b1&quot;,&quot;b2&quot;,&quot;a1&quot;,&quot;a2&quot;],    defaultValues:[&quot;3f800000&quot;,&quot;bfe66666&quot;,&quot;3f4f5c29&quot;,&quot;bfe66666&quot;,&quot;3f4f5c29&quot;]} );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var modeOptions = [ &quot;Off&quot;, &quot;Mute&quot;, &quot;Bypass&quot;, &quot;Active&quot;];</span></span>
<span class="line"><span>var controlModeOptions = [ &quot;Off&quot;, &quot;Active&quot;];</span></span>
<span class="line"><span>var debugOptions = [&quot;Off&quot;, &quot;On&quot;];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function onPageLoad ()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // Require Firefox 3.0 or Safari; i.e. exclude MS Internet Explorer. WHY?</span></span>
<span class="line"><span>    var browser=navigator.appName;</span></span>
<span class="line"><span>    var version=parseFloat(navigator.appVersion);</span></span>
<span class="line"><span>    if ((browser === &quot;Netscape&quot;) &amp;&amp; (version &gt;= 5)) {</span></span>
<span class="line"><span>        document.getElementById(&quot;cant_load_warning&quot;).style.display = &quot;none&quot;;</span></span>
<span class="line"><span>        configDSP();</span></span>
<span class="line"><span>    }</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/configDSP.js</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 94.2 KB (96410 bytes)</li><li><strong>SHA-256:</strong> <code>f5218ecb1c633c9634d4b25014a10a99f66c2773fa56b9f4ea6ec5d9912f1bb2</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h3 id="meters-css" tabindex="-1"><code>meters.css</code> <a class="header-anchor" href="#meters-css" aria-label="Permalink to &quot;\`meters.css\`&quot;">​</a></h3><p>The stylesheet for the meters page.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.css">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.css">Download</a> · 240 B</p><details class="details custom-block"><summary>Preview</summary><p>First 15 of 15 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span>    Document   : meters.css</span></span>
<span class="line"><span>    Created on : Feb 24, 2013, 6:27:30 PM</span></span>
<span class="line"><span>    Author     : Simon.Jarvis</span></span>
<span class="line"><span>    Description:</span></span>
<span class="line"><span>        Purpose of the stylesheet follows.</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>root { </span></span>
<span class="line"><span>    display: block;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>meter {</span></span>
<span class="line"><span>  width: 150px;</span></span>
<span class="line"><span>  height: 15px;</span></span>
<span class="line"><span>}</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/meters.css</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 240 B (240 bytes)</li><li><strong>SHA-256:</strong> <code>160125d1a65cb0d7242daef7195264d29e6b32d7929952ce4e9d937c44bd4c20</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h3 id="meters-htm" tabindex="-1"><code>meters.htm</code> <a class="header-anchor" href="#meters-htm" aria-label="Permalink to &quot;\`meters.htm\`&quot;">​</a></h3><p>The HTML shell of the input-level meters page: shows live signal levels per channel, used for audio debugging.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.htm">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.htm">Download</a> · 587 B</p><details class="details custom-block"><summary>Preview</summary><p>First 16 of 16 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;html&gt;</span></span>
<span class="line"><span>&lt;head&gt;</span></span>
<span class="line"><span>  &lt;title&gt;Meters Test Page&lt;/title&gt;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  &lt;script type=&quot;text/javascript&quot; src=&quot;meters.js&quot;&gt;&lt;/script&gt;</span></span>
<span class="line"><span>  &lt;link rel=&quot;stylesheet&quot; href=&quot;meters.css&quot; type=&quot;text/css&quot; /&gt; </span></span>
<span class="line"><span>&lt;/head&gt;</span></span>
<span class="line"><span>&lt;body onload=&quot; onPageLoad();&quot;&gt;</span></span>
<span class="line"><span>  &lt;h1&gt;Meters Page&lt;/h1&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;cant_load_warning&quot;&gt;&lt;h2&gt;There was an error loading the page.&lt;/h2&gt;&lt;p&gt;Make sure you are using &lt;a href=&quot;http://getfirefox.com&quot;&gt;Firefox 3&lt;/a&gt;, and that you have JavaScript enabled.&lt;/p&gt;&lt;/div&gt;</span></span>
<span class="line"><span>  &lt;div id=&quot;message&quot; style=&quot;visibility:hidden;&quot;&gt;&amp;nbsp;&lt;/div&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  &lt;!-- script dynamically builds for dynForm --&gt;</span></span>
<span class="line"><span>  &lt;form id=&quot;dynForm&quot;&gt;&lt;/form&gt;</span></span>
<span class="line"><span>&lt;/body&gt;</span></span>
<span class="line"><span>&lt;/html&gt;</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/meters.htm</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 587 B (587 bytes)</li><li><strong>SHA-256:</strong> <code>aad190d5fd301239fe1cd4f014e177f8c5fb13b0d56b7c44a6c56fe0bc2797e0</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details><h3 id="meters-js" tabindex="-1"><code>meters.js</code> <a class="header-anchor" href="#meters-js" aria-label="Permalink to &quot;\`meters.js\`&quot;">​</a></h3><p>The JavaScript that polls the meter data and draws the live channel levels on the meters page.</p><p><a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.js">View</a> · <a href="/anacapad-internals/files/opt/htdocs_locked/dsp/meters.js">Download</a> · 12.2 KB</p><details class="details custom-block"><summary>Preview</summary><p>First 60 of 402 lines:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//TODO: set up POLLING</span></span>
<span class="line"><span>//TODO: convert JSON to XML and submit to ZP</span></span>
<span class="line"><span></span></span>
<span class="line"><span>gTextFieldWidth = 6;</span></span>
<span class="line"><span>gMeterWidth = 6;</span></span>
<span class="line"><span>var gMeterIds;</span></span>
<span class="line"><span>var gMeterValues;</span></span>
<span class="line"><span>var gMeterMins;</span></span>
<span class="line"><span>var gMeterMaxs;</span></span>
<span class="line"><span>var gStrMeterBlock;</span></span>
<span class="line"><span>var gIsDebugMeter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var gFilterTypes = [&quot;highpass&quot;,</span></span>
<span class="line"><span>                    &quot;1st Order HP&quot;,</span></span>
<span class="line"><span>                    &quot;lowpass&quot;,</span></span>
<span class="line"><span>                    &quot;1st Order LP&quot;,</span></span>
<span class="line"><span>                    &quot;Shelfing Bandpass&quot;,</span></span>
<span class="line"><span>                    &quot;Lowpass Shelf&quot;,</span></span>
<span class="line"><span>                    &quot;Highpass Shelf&quot;,</span></span>
<span class="line"><span>                    &quot;Bandpass with Q&quot;,</span></span>
<span class="line"><span>                    &quot;allpass&quot;,</span></span>
<span class="line"><span>                    &quot;ZP120 HP Cross&quot;,</span></span>
<span class="line"><span>                    &quot;ZP120 LP Cross&quot;,</span></span>
<span class="line"><span>                    &quot;Bass1&quot;,</span></span>
<span class="line"><span>                    &quot;Treble1&quot;,</span></span>
<span class="line"><span>                    &quot;blank&quot;,</span></span>
<span class="line"><span>                    &quot;Mute&quot;,</span></span>
<span class="line"><span>                    &quot;loudness&quot;,</span></span>
<span class="line"><span>                    &quot;bandpass&quot;,</span></span>
<span class="line"><span>                    &quot;Custom&quot; ];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function onPageLoad ()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // Require Firefox 3.0 or Safari; i.e. exclude MS Internet Explorer. WHY?</span></span>
<span class="line"><span>    var browser=navigator.appName;</span></span>
<span class="line"><span>    var version=parseFloat(navigator.appVersion);</span></span>
<span class="line"><span>    if ((browser === &quot;Netscape&quot;) &amp;&amp; (version &gt;= 5)) {</span></span>
<span class="line"><span>        document.getElementById(&quot;cant_load_warning&quot;).style.display = &quot;none&quot;;</span></span>
<span class="line"><span>        configDSP();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//------------------------------------------------------------------------------</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function onDropdownUpdate(elem)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //</span></span>
<span class="line"><span>    //clear out the old meters</span></span>
<span class="line"><span>    //get a new meter values</span></span>
<span class="line"><span>    //add them to this page/form</span></span>
<span class="line"><span>    //then kick off the polling</span></span>
<span class="line"><span>    removeMetersFromTable(&quot;&quot;);</span></span>
<span class="line"><span>    gStrMeterBlock = this.value;</span></span>
<span class="line"><span>    if gIsDebugMeter[this.selectedIndex] {</span></span>
<span class="line"><span>        getDebugMeters(gStrMeterBlock);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        getMeters(gStrMeterBlock);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    addToForm(createMeterTable());</span></span></code></pre></div></details><details class="details custom-block"><summary>Technical details</summary><ul><li><strong>Path in image:</strong> <code>/opt/htdocs_locked/dsp/meters.js</code></li><li><strong>Category:</strong> webui</li><li><strong>Size:</strong> 12.2 KB (12471 bytes)</li><li><strong>SHA-256:</strong> <code>1bf1c14a27e27e9b08ae6b3206a6d266ba8a93515540a9c4c525cef4b8bd914b</code></li></ul><p>Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).</p></details>`,43)])])}const h=a(t,[["render",l]]);export{g as __pageData,h as default};
