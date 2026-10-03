# Artifacts: Diagnostics web pages

The raw ingredients of the speaker's hidden status website: JavaScript and HTML pages you can reach in a browser at the player's address. Sonos support and engineers use these pages to inspect a player; this is what the site actually is under the hood.

::: details Technical details

Static assets served by the embedded web server from /opt/htdocs and the locked variant /opt/htdocs_locked (gated DSP console pages).

:::

### `perfcounters.js`

The JavaScript behind the performance-counters status page: it fetches the counter data from the speaker and draws it in your browser when you visit the diagnostics site.

[View](/files/opt/htdocs/perfcounters.js) · [Download](/files/opt/htdocs/perfcounters.js) · 9.0 KB

::: details Preview

First 60 of 218 lines:

```
/// Copyright (c) 2023, Sonos, Inc.  All rights reserved.

let perfcounter = {
    // entry function which actually generates two top level elements:
    // a <header> for the title and miscellaneous metadata and a <table> for the actual data

    generateTableForEach: function (id, counters) 
    {
        //clear old
        let div = document.getElementById(id);
        div.innerHTML = '';

        const captionText = document.createTextNode('Hover over each column header for a detailed description');
        div.appendChild(captionText);

        counters.forEach(counter => {
            this.generateTable(id, counter);
        });
    },

    generateTable: function (id, perfcounter) 
    {
        const div = document.getElementById(id);

        this.generateTableMetadata(perfcounter, div);

        const table = document.createElement('table');
        table.classList.add("purple");

        this.generateTableHeader(table, perfcounter);
        this.generateTableBody(table, perfcounter);
        div.appendChild(table);
    },

    // display the title and list metadata values (besides the counter metadata which is rendered as tooltips)
    generateTableMetadata: function (perfcounter, div)
    {
        const header = document.createElement('header');
        const heading = document.createElement('h2');
        const headingText = document.createTextNode(perfcounter.table);
        heading.appendChild(headingText);
        header.appendChild(heading);
        div.appendChild(header);

        // process the non-counters metadata
        const noncountersList = document.createElement('ul');

        const keys = Object.keys(perfcounter.metadata);
        for (const key of keys) {
            if (key != 'counters') {
                noncountersList.appendChild(this.createMetadataListItem(key, perfcounter.metadata[key]));
            }
        }

        div.appendChild(noncountersList);

        if (!perfcounter.metadata.counters.length) {
            heading.textContent += ' contains no counters';
        }
    },
```

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/perfcounters.js`
- **Category:** webui
- **Size:** 9.0 KB (9230 bytes)
- **SHA-256:** `ac4fb0d72fa0a4dfffcd4921e0461cb14018ab929841d18028bc0c89b52efaff`

Client-side script for the perf-counter status page; pairs with the perf_counters schema documented on the subsystems page.


:::

### `review.js`

The script for a review-style page in the built-in web UI, working with the matching stylesheet file.

[View](/files/opt/htdocs/review.js) · [Download](/files/opt/htdocs/review.js) · 15.5 KB

::: details Preview

First 60 of 448 lines:

```
function trimAll( strValue ) {
 var objRegExp = /^(\s*)$/;

    //check for all spaces
    if(objRegExp.test(strValue)) {
       strValue = strValue.replace(objRegExp, '');
       if( strValue.length == 0)
          return strValue;
    }

   //check for leading & trailing spaces
   objRegExp = /^(\s*)([\W\w]*)(\b\s*$)/;
   if(objRegExp.test(strValue)) {
       //remove leading and trailing whitespace characters
       strValue = strValue.replace(objRegExp, '$2');
    }
  return strValue;
}

var strengthData = new Array();
var macAddrs = new Array();
var macAddrsToZoneNames = new Array();
	
function finishDrawTable(tbodyID) {
    var th, tr, td, txt, br;
	var zp,nf,ofdm;
    tbody = document.getElementById(tbodyID);
    // create holder for accumulated tbody elements and text nodes
    var frag = document.createDocumentFragment();
    //
    // Make column headings
    //
    tr = document.createElement("tr");
    th = document.createElement("th"); tr.appendChild(th);
    for (var i = 0; i < macAddrs.length; i++) {
	if(macAddrs[i] != "eth0" && macAddrs[i] != "eth1")
	{
        th = document.createElement("th");
	txt = document.createTextNode("Strength to"); th.appendChild(txt);
	br = document.createElement("br"); th.appendChild(br);
        txt = document.createTextNode(macAddrs[i]); th.appendChild(txt);
	br = document.createElement("br"); th.appendChild(br);
        txt = document.createTextNode(macAddrsToZoneNames[macAddrs[i]]); th.appendChild(txt);
	tr.appendChild(th);
	}
    }
    frag.appendChild(tr);
    //
    // loop through data source
    //
    for (var i = 0; i < strengthData.length; i++) {
        var sd = strengthData[i];
    	tr = document.createElement("tr");
    	
    	td = document.createElement("td");
    	td.setAttribute("class", "ctr");

    	txt = document.createTextNode(sd.macAddr); td.appendChild(txt);
        br = document.createElement("br"); td.appendChild(br);

```

:::

::: details Technical details

- **Path in image:** `/opt/htdocs/review.js`
- **Category:** webui
- **Size:** 15.5 KB (15822 bytes)
- **SHA-256:** `58300bba90ff52b053921a08e494df9d839bb747a08fbe701ecfbbf99ce6b710`

Companion to xml/review.xsl for the status site's review page.


:::

### `configDSP.css`

The stylesheet for the DSP console page.

[View](/files/opt/htdocs_locked/dsp/configDSP.css) · [Download](/files/opt/htdocs_locked/dsp/configDSP.css) · 5.8 KB

::: details Preview

First 60 of 282 lines:

```
body {
	font-family: "Helvetica Neue", Arial, Helvetica, Geneva, sans-serif;
	background-color: #ebf0f6;
}

h1 {
	color: #4f555c;
	margin-left: 25px;
	font-weight: bold;
	font-size: 2.5em;
}

#message {
	font-size: 1em;
	margin: 0;
	padding: 5px 10px;
	background-color: #fcda78;
	border: 1px solid #d0b463;
	display: inline;
	line-height: 1.75em;
}

#cant_load_warning {
	font-size: 1.0em;
	color: #ececec;
	padding: 25px;
	background-color: #d3050a;
	font-weight: bold;
	text-align: center;
}
#cant_load_warning h2 {
	font-size: 1.5em;
}
#cant_load_warning a {
	color: #fdf73a;
}

#ab_control {
    border: 1px solid black;
    background-color: #c8c8c8;
	padding: 4px 8px;
	position: fixed;
	right: 15px;
	top: 15px;
}
#ab_control:hover {
	background-color: #9c9c9c;
}
#ab_control:active {
	background-color: #898989;
}

#AB_indicator {
	font-size: 6em;
	font-weight: bold;
	text-align: center;
}

#import_export {
	position: fixed;
```

:::

::: details Technical details

- **Path in image:** `/opt/htdocs_locked/dsp/configDSP.css`
- **Category:** webui
- **Size:** 5.8 KB (5958 bytes)
- **SHA-256:** `e0f5761e73fd0e00e15400ca5a285b0303576457c1f5e35b67d9ded25cb51780`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


:::

### `configDSP.htm`

The HTML shell of the hidden DSP console: a gated page in the diagnostics site that exposes the audio-processing knobs, meant for engineering rather than daily use.

[View](/files/opt/htdocs_locked/dsp/configDSP.htm) · [Download](/files/opt/htdocs_locked/dsp/configDSP.htm) · 1.7 KB

::: details Preview

First 46 of 46 lines:

```
<html>
<head>
  <title>Config DSP</title>
  <script type="text/javascript" src="configDSP.js"></script>
  <link rel="stylesheet" type="text/css" href="configDSP.css" />
</head>
<body onload=" onPageLoad();">
  <div id="export_overlay" onclick="exportOverlayOff()">
    <div id="export_table_div" style="padding:20px">Exported Blocks:<br>
      <table id="export_table">
      </table>
    </div>
  </div>
  <div id="ab_control" onclick="toggleAB();">
    <div id="toggle_button">Toggle A/B</div>
    <div id="AB_indicator"> </div>
  </div>
  <div id="import_export">
    <span id="import_export_title" onclick="toggleImportExport();">Import/Export</span>
    <div id="import_export_body" style="display:none;">
      <div class="section">
        <div style="width: 50%; float:center">
          <button class="button" onclick="onExport();" >Export</button>
        </div>
        <div style="width: 50%; float:center; padding-top: 10px;">
          <button class="button" onclick="onExportSelectedBlocks();">Export Selected Blocks
          </button>
        </div>
      </div>
      <div class="section">
        Import Presets:
        <input type="file" id="fileInput"/>
        <div id="import_form" style="display:none;">
        </div>
      </div>
    </div>
  </div>
  <h1>DSP System (Version: 0.25.3)</h1>
  <div id="cant_load_warning"><h2>There was an error loading the page.</h2><p>Make sure you are using <a href="http://getfirefox.com">Firefox 3</a>, and that you have JavaScript enabled.</p></div>
  <div id="message" style="visibility:hidden;">&nbsp;</div>

  <!-- These are build dynamically by the script -->
  <div id="tabBar"></div>
  <form id="dynForm"></form>
</body>
</html>
```

:::

::: details Technical details

- **Path in image:** `/opt/htdocs_locked/dsp/configDSP.htm`
- **Category:** webui
- **Size:** 1.7 KB (1699 bytes)
- **SHA-256:** `c0c1ab3d462adeb5847244c9f353d338d1d8345898d5bc2cb9cbdbba8fec5af6`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


:::

### `configDSP.js`

The JavaScript driving the DSP console page: it reads and writes the audio-processing parameters behind the gated interface.

[View](/files/opt/htdocs_locked/dsp/configDSP.js) · [Download](/files/opt/htdocs_locked/dsp/configDSP.js) · 94.2 KB

::: details Preview

First 60 of 1650 lines:

```
//7/6/13 : update to load getDSP on page load
//7/9/13: cleanup dead code

//TODO: set up POLLING
//TODO: validateForm()

//------------------------------------------------------------------------------
// global data object - holds all the preset data locally
var gMainData;
var gMaxNumPresets = 20;
var gTextFieldWidth = 12;
var gXmlDoc;
var gCurrentlyWorking;
var gCurrentlyWorkingMessage = 'Still working... please wait a moment and try again.'
var messageBox;

// A-B Toggling Stuff
var ABinfo = [
    { name: "A", preset: -1, bgcolor: "#AE6662", active: true},
    { name: "B", preset: -1, bgcolor: "#6FA0FF", active: false},
];

// Form buttons, so their ids can be changed but we can still get to them
var gButtons = new Array();


var gIIRFilterOptions = new Array( {option:"highpass2",         valueType:["Freq","Q"],        defaultValues:["999","0.707"] },
                                   {option:"highpass1",         valueType:["Freq"],            defaultValues:["999"]},
                                   {option:"lowpass2",          valueType:["Freq","Q"],        defaultValues:["999","0.707"] },
                                   {option:"lowpass1",          valueType:["Freq"],            defaultValues:["999"]},
                                   {option:"shelving bandpass", valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"rbj shelving bandpass", valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"lfshelf",           valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"hfshelf",           valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"rbj lfshelf",       valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"rbj hfshelf",       valueType:["Freq","Q","gain dB"], defaultValues:["999","0.707", "0.0"]},
                                   {option:"bandpassQ",         valueType:["Freq","Q"],        defaultValues:["999","0.707", "0.0"]},
                                   {option:"allpass",           valueType:["Freq","Q"],        defaultValues:["999","0.707"]},
                                   {option:"allpass1",          valueType:["Freq"],            defaultValues:["999"]},
                                   {option:"gain",              valueType:["gain linear"],     defaultValues:["1.0"]},
                                   {option:"bass1",             valueType:["gain dB"],         defaultValues:["0.0"]},
                                   {option:"treble1",           valueType:["gain dB"],         defaultValues:["0.0"]},
                                   {option:"blank",             valueType:[],                  defaultValues:[]},
                                   {option:"mute",              valueType:[],                  defaultValues:[]},
                                   {option:"loudness",          valueType:["FreqLF","gainLF","FreqHF","gainHF"], defaultValues:["999","0.0", "999", "0.0"]},
                                   {option:"custom",            valueType:["b0","b1","b2","a1","a2"],    defaultValues:["3f800000","bfe66666","3f4f5c29","bfe66666","3f4f5c29"]} );

var modeOptions = [ "Off", "Mute", "Bypass", "Active"];
var controlModeOptions = [ "Off", "Active"];
var debugOptions = ["Off", "On"];

function onPageLoad ()
{
    // Require Firefox 3.0 or Safari; i.e. exclude MS Internet Explorer. WHY?
    var browser=navigator.appName;
    var version=parseFloat(navigator.appVersion);
    if ((browser === "Netscape") && (version >= 5)) {
        document.getElementById("cant_load_warning").style.display = "none";
        configDSP();
    }
```

:::

::: details Technical details

- **Path in image:** `/opt/htdocs_locked/dsp/configDSP.js`
- **Category:** webui
- **Size:** 94.2 KB (96410 bytes)
- **SHA-256:** `f5218ecb1c633c9634d4b25014a10a99f66c2773fa56b9f4ea6ec5d9912f1bb2`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


:::

### `meters.css`

The stylesheet for the meters page.

[View](/files/opt/htdocs_locked/dsp/meters.css) · [Download](/files/opt/htdocs_locked/dsp/meters.css) · 240 B

::: details Preview

First 15 of 15 lines:

```
/* 
    Document   : meters.css
    Created on : Feb 24, 2013, 6:27:30 PM
    Author     : Simon.Jarvis
    Description:
        Purpose of the stylesheet follows.
*/

root { 
    display: block;
}
meter {
  width: 150px;
  height: 15px;
}
```

:::

::: details Technical details

- **Path in image:** `/opt/htdocs_locked/dsp/meters.css`
- **Category:** webui
- **Size:** 240 B (240 bytes)
- **SHA-256:** `160125d1a65cb0d7242daef7195264d29e6b32d7929952ce4e9d937c44bd4c20`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


:::

### `meters.htm`

The HTML shell of the input-level meters page: shows live signal levels per channel, used for audio debugging.

[View](/files/opt/htdocs_locked/dsp/meters.htm) · [Download](/files/opt/htdocs_locked/dsp/meters.htm) · 587 B

::: details Preview

First 16 of 16 lines:

```
<html>
<head>
  <title>Meters Test Page</title>
  
  <script type="text/javascript" src="meters.js"></script>
  <link rel="stylesheet" href="meters.css" type="text/css" /> 
</head>
<body onload=" onPageLoad();">
  <h1>Meters Page</h1>
  <div id="cant_load_warning"><h2>There was an error loading the page.</h2><p>Make sure you are using <a href="http://getfirefox.com">Firefox 3</a>, and that you have JavaScript enabled.</p></div>
  <div id="message" style="visibility:hidden;">&nbsp;</div>

  <!-- script dynamically builds for dynForm -->
  <form id="dynForm"></form>
</body>
</html>
```

:::

::: details Technical details

- **Path in image:** `/opt/htdocs_locked/dsp/meters.htm`
- **Category:** webui
- **Size:** 587 B (587 bytes)
- **SHA-256:** `aad190d5fd301239fe1cd4f014e177f8c5fb13b0d56b7c44a6c56fe0bc2797e0`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


:::

### `meters.js`

The JavaScript that polls the meter data and draws the live channel levels on the meters page.

[View](/files/opt/htdocs_locked/dsp/meters.js) · [Download](/files/opt/htdocs_locked/dsp/meters.js) · 12.2 KB

::: details Preview

First 60 of 402 lines:

```
//TODO: set up POLLING
//TODO: convert JSON to XML and submit to ZP

gTextFieldWidth = 6;
gMeterWidth = 6;
var gMeterIds;
var gMeterValues;
var gMeterMins;
var gMeterMaxs;
var gStrMeterBlock;
var gIsDebugMeter;

var gFilterTypes = ["highpass",
                    "1st Order HP",
                    "lowpass",
                    "1st Order LP",
                    "Shelfing Bandpass",
                    "Lowpass Shelf",
                    "Highpass Shelf",
                    "Bandpass with Q",
                    "allpass",
                    "ZP120 HP Cross",
                    "ZP120 LP Cross",
                    "Bass1",
                    "Treble1",
                    "blank",
                    "Mute",
                    "loudness",
                    "bandpass",
                    "Custom" ];

function onPageLoad ()
{
    // Require Firefox 3.0 or Safari; i.e. exclude MS Internet Explorer. WHY?
    var browser=navigator.appName;
    var version=parseFloat(navigator.appVersion);
    if ((browser === "Netscape") && (version >= 5)) {
        document.getElementById("cant_load_warning").style.display = "none";
        configDSP();
    }
}

//------------------------------------------------------------------------------

function onDropdownUpdate(elem)
{
    //
    //clear out the old meters
    //get a new meter values
    //add them to this page/form
    //then kick off the polling
    removeMetersFromTable("");
    gStrMeterBlock = this.value;
    if gIsDebugMeter[this.selectedIndex] {
        getDebugMeters(gStrMeterBlock);
    }
    else {
        getMeters(gStrMeterBlock);
    }
    addToForm(createMeterTable());
```

:::

::: details Technical details

- **Path in image:** `/opt/htdocs_locked/dsp/meters.js`
- **Category:** webui
- **Size:** 12.2 KB (12471 bytes)
- **SHA-256:** `1bf1c14a27e27e9b08ae6b3206a6d266ba8a93515540a9c4c525cef4b8bd914b`

Static asset for the locked DSP console under /opt/htdocs_locked; reachable only through gated diagnostic routes (ChProcInputMeter.xml-era surface, documented under dsp_params/exec_pages).


:::

