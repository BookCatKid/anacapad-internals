<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
<style type="text/css">
a { text-decoration: none; }
a:hover { text-decoration: underline; }
h1 {
    font-family: arial, helvetica, sans-serif;
    font-size: 18pt;
    font-weight: bold;
}
h2 {
    font-family: arial, helvetica, sans-serif;
    font-size: 14pt;
    font-weight: bold;
}
body, td {
    font-family: arial, helvetica, sans-serif;
    font-size: 10pt;
}
th {
    font-family: arial, helvetica, sans-serif;
    font-size: 11pt;
    font-weight: bold;
}
table,table.purple {
border-spacing:1px;
margin-bottom:20px;
margin-top: 20px;
}
table.purple {
margin-left: auto;
margin-right: auto;
}
table.purple tr {background:#cccccc;}
table.purple td {padding:3px; background:#cccccc;}
table.purple th {padding:3px; background:#9999cc;}
table.purple td.left {
font-weight: bold;
background:#ccccff;
padding-right:20px;
}
.l1 { }
.leftMargin { margin-left: 10pt}

#edidTable {table-layout:fixed; word-wrap:break-word; width:50%}

#networkTable {table-collapse:collapse; border-spacing:0}
#networkTable td {border:2px groove black; padding:7px}
#networkTable th {border:2px groove black; padding:7px}
.ctr {text-align:center}

.cellWithTooltip {
    position:relative;
}

.cellTooltip {
    display: none;
    position: absolute;
    z-index: 100;
    border: 1px;
    border-style: none;
    padding: 3px;
    color: red;
    font-size: 10pt;
    width: 500px;
    top: -25px;
    left: 0;
    right: 0;
    text-align: left;
}

.cellWithTooltip:hover span.cellTooltip {
    display: block;
}
</style>
<title>Sonos Support Info</title>
<script language="JavaScript">
<![CDATA[
function toggle(id) {
    var whichEl = document.getElementById(id);
    whichEl.style.display = (whichEl.style.display == "none" ) ? "" : "none";
}
]]>
</script>
<script src="/perfcounters.js" type="text/javascript"></script>
<script src="/review.js" type="text/javascript"></script>
</head>
<body>
<xsl:apply-templates select="ZPNetworkInfo/Timestamp"/>
<!-- Handles the case for a single zoneplayer packet -->
<xsl:apply-templates select="ZPSupportInfo"/>
<!-- Handles the case for aggregated zoneplayer packet -->
<xsl:apply-templates select="ZPNetworkInfo/ZPSupportInfo"/>
<!-- Handles the controllers in both cases -->
<xsl:apply-templates select="//Controllers/ZPSupportInfo"/>
<!-- Network matrix -->
<xsl:call-template name="NetworkMatrix"/>
</body>
</html>
</xsl:template>

<xsl:template match="Timestamp">
<p>Support Data Collected <xsl:value-of select="."/></p>
</xsl:template>

<xsl:template match="ZPSupportInfo">
<xsl:if test="count(*) > 1 and count(ZPInfo) > 0">
<br/><a>
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
<xsl:value-of select="ZPInfo/ZoneName"/> (<xsl:value-of select="ZPInfo/LocalUID"/>)
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(*) > 1 and count(ZPInfo) > 0">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:apply-templates select="ZPInfo"/>
<xsl:apply-templates select="DeviceInfo"/>
<xsl:apply-templates select="Registration"/>
<xsl:apply-templates select="ControllerInfo"/>
<xsl:apply-templates select="ZonePlayers"/>
<xsl:apply-templates select="MediaServers"/>
<xsl:apply-templates select="AvailableSvcsSummary"/>
<xsl:apply-templates select="TrackSummary"/>
<xsl:apply-templates select="TrackQueueSummary"/>
<xsl:apply-templates select="TrackQueueDetails"/>
<xsl:apply-templates select="Subscriptions/Incoming"/>
<xsl:apply-templates select="Subscriptions/Outgoing"/>
<xsl:apply-templates select="Cloud"/>
<xsl:apply-templates select="Muse"/>
<xsl:apply-templates select="CloudQueueHistory"/>
<xsl:apply-templates select="VoiceProcessingInfo"/>
<xsl:apply-templates select="AutoTrueplayInfo"/>
<xsl:apply-templates select="Shares"/>
<xsl:apply-templates select="RenderingControl"/>
<xsl:apply-templates select="AudioCore"/>
<xsl:apply-templates select="RoomCalibrationInfo"/>
<xsl:apply-templates select="Alarm"/>
<xsl:apply-templates select="Playmode"/>
<xsl:apply-templates select="DNSCache"/>
<xsl:apply-templates select="EnetPorts"/>
<xsl:apply-templates select="EthPrtStats"/>
<xsl:apply-templates select="RadioStationLog"/>
<xsl:apply-templates select="PerformanceCounterTables"/>
<xsl:apply-templates select="CpuMonitor"/>
<xsl:apply-templates select="CpuInfo"/>
<xsl:apply-templates select="TemperatureHistograms"/>
<xsl:apply-templates select="Decoder"/>
<xsl:apply-templates select="DialogExtractor"/>
<xsl:apply-templates select="MusicDecoder"/>
<xsl:apply-templates select="HTConfig"/>
<xsl:apply-templates select="TVProc"/>
<xsl:apply-templates select="ChannelStatusBlock"/>
<xsl:apply-templates select="AutoPlay"/>
<xsl:apply-templates select="SPDIFParser"/>
<xsl:apply-templates select="HDMI"/>
<xsl:apply-templates select="CecMessageLog"/>
<xsl:apply-templates select="ButtonTriggeredDump"/>
<xsl:apply-templates select="DropoutTriggeredDump"/>
<xsl:apply-templates select="Backtrace"/>
<xsl:apply-templates select="NetSettings"/>
<xsl:apply-templates select="SsidList"/>
<xsl:apply-templates select="ReplicatedNetSettings"/>
<xsl:apply-templates select="SystemSettings"/>
<xsl:apply-templates select="AccountsInfo"/>
<xsl:apply-templates select="DeviceCertInfo"/>
<xsl:apply-templates select="ThirdPartyLibraryInfo"/>
<xsl:apply-templates select="File"/>
<xsl:apply-templates select="Command"/>
<xsl:apply-templates select="Titles"/>
<xsl:apply-templates select="UpdateInfo"/>
<xsl:apply-templates select="ZoneExperiments"/>
<xsl:apply-templates select="LedPatternInfo"/>
<xsl:apply-templates select="Policies"/>
<xsl:apply-templates select="Entitlements"/>
<xsl:apply-templates select="CloudSettings"/>
<xsl:apply-templates select="LocalSettings"/>
<xsl:apply-templates select="SSLClientCache"/>
<xsl:apply-templates select="LocationSettingsUpdate"/>
<xsl:apply-templates select="DashInfo"/>
<xsl:apply-templates select="HLSInfo"/>
<xsl:apply-templates select="EncryptedAudioInfo"/>
<xsl:apply-templates select="BTStatusInfo"/>
<xsl:apply-templates select="RootCertBundleInfo"/>
<xsl:apply-templates select="ReplicatedSettingsState"/>
<xsl:apply-templates select="MuselibState"/>
<xsl:apply-templates select="HardwareStatusInfo"/>
<xsl:apply-templates select="AnalogInInfo"/>
<xsl:apply-templates select="Headphones"/>
<xsl:apply-templates select="Wireless"/>
<xsl:apply-templates select="SpeakerDetect"/>
</div>
</xsl:template>

<xsl:template match="Controllers/ZPSupportInfo">
<xsl:if test="count(*) > 0">
<br/><a>
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Controller
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(*) > 0">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:apply-templates select="ControllerInfo"/>
<xsl:apply-templates select="ZonePlayers"/>
<xsl:apply-templates select="MediaServers"/>
<xsl:apply-templates select="TrackSummary"/>
<xsl:apply-templates select="Subscriptions/Incoming"/>
<xsl:apply-templates select="Subscriptions/Outgoing"/>
<xsl:apply-templates select="File"/>
<xsl:apply-templates select="Command"/>
</div>
</xsl:template>

<xsl:template match="TrackSummary">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Track Summary
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<tr><th></th><th>Title</th></tr>
<tr>
<td>MAX</td>
<xsl:for-each select=".//Table">
    <td><xsl:value-of select="@max"/></td>
</xsl:for-each>
</tr>
<tr>
<td>COUNT</td>
<xsl:for-each select=".//Table">
    <td><xsl:value-of select="@count"/></td>
</xsl:for-each>
</tr>
<tr><td>Store Size</td><td align="right"><xsl:value-of select="StoreSize"/></td></tr>
<tr><td>Store Used</td><td align="right"><xsl:value-of select="StoreUsed"/></td></tr>
<tr><td>Entries Size</td><td align="right"><xsl:value-of select="EntriesSize"/></td></tr>
<tr><td>Entries Used</td><td align="right"><xsl:value-of select="EntriesUsed"/></td></tr>
<tr><td>Conflicts</td><td align="right"><xsl:value-of select="Conflicts"/></td></tr>
</table>
</div>
</xsl:template>

<xsl:template match="Titles">
<H3>Tracks</H3>
<table cols="8">
<tr><th>File</th><th>Leaf</th><th>Title</th><th>Album</th><th>Artist</th><th>Composer</th><th>Genre</th><th>Sort Key</th></tr>
<xsl:for-each select=".//Title">
<tr>
<td><xsl:value-of select="File"/></td>
<td><xsl:value-of select="Leaf"/></td>
<td><xsl:value-of select="Description"/></td>
<td><xsl:value-of select="Album"/></td>
<td><xsl:value-of select="Artist"/></td>
<td><xsl:value-of select="Composer"/></td>
<td><xsl:value-of select="Genre"/></td>
<td><xsl:value-of select="@track"/></td>
</tr>
</xsl:for-each>
</table>
</xsl:template>

<xsl:template match="Environment">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Environment
</a>
</xsl:if>
<div id="{generate-id()}">
<table class="purple">
<tr valign="middle" bgcolor="#9999cc">
<th>Variable</th><th>Value</th>
</tr>
<xsl:for-each select=".//Variable">
<tr valign="baseline" bgcolor="#cccccc">
<td bgcolor="#ccccff"><b><xsl:value-of select="@name"/></b></td>
<td align="left"><xsl:value-of select="."/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="File">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
<xsl:value-of select="@name"/>
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<tr valign="top" bgcolor="#cccccc">
<td align="left"><pre>contents of <xsl:value-of select="@name"/>
<br/><xsl:value-of select="."/></pre></td>
</tr>
</table>
</div>
</xsl:template>

<xsl:template match="Command">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
<xsl:value-of select="@cmdline"/>
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<tr valign="top" bgcolor="#cccccc">
<td align="left"><pre>running <xsl:value-of select="@cmdline"/>
<br/>
<xsl:value-of select="."/></pre></td>
</tr>
</table>
</div>
</xsl:template>

<xsl:template match="ZPInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Zone Player Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="DeviceInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Device Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="Registration">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Registration Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="ControllerInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Controller Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="ZonePlayers">
<xsl:if test="count(../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Zone Players
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table cellpadding="4">
<tr><th>Zone Name</th><th>Coordinator</th><th>DesignatedDevice</th><th>Group</th><th>PrevGroup</th><th>VLInGroupID</th><th>Location</th><th>UUID</th><th>Version</th><th>APIVersions</th><th>MinCompatVer</th><th>HWVersion</th><th>AudioTxVer</th><th>HTAudioTxVer</th><th>TPSdkVer</th><th>Model</th><th>ModelDisplayName</th><th>SerialNumber</th><th>InBondedZone</th><th>InHTConfig</th><th>Compat</th><th>WiMode</th><th>ConnType</th><th>HasSSID</th><th>WiFreq</th><th>WiEna</th><th>EthLink</th><th>BeEx</th><th>Idle</th><th>SSDP</th><th>mDNS</th><th>SWGen</th><th>QuarReason</th></tr>
<xsl:for-each select=".//ZonePlayer">
<tr>
    <td><xsl:value-of select="."/></td>
    <td><xsl:value-of select="@coordinator"/></td>
    <td><xsl:value-of select="@designateddevice"/></td>
    <td><xsl:value-of select="@group"/></td>
    <td><xsl:value-of select="@prevgroup"/></td>
    <td><xsl:value-of select="@virtuallineingroupid"/></td>
    <td><xsl:value-of select="@location"/></td>
    <td><xsl:value-of select="@uuid"/></td>
    <td><xsl:value-of select="@version"/></td>
    <td><xsl:value-of select="@apiversions"/></td>
    <td><xsl:value-of select="@mincompatibleversion"/></td>
    <td><xsl:value-of select="@hwversion"/></td>
    <td><xsl:value-of select="@audiotxver"/></td>
    <td><xsl:value-of select="@htaudiotxver"/></td>
    <td><xsl:value-of select="@tpsdkver"/></td>
    <td><xsl:value-of select="@model"/></td>
    <td><xsl:value-of select="@modeldisplayname"/></td>
    <td><xsl:value-of select="@serialnumber"/></td>
    <td><xsl:value-of select="@inbondedzone"/></td>
    <td><xsl:value-of select="@inhtconfig"/></td>
    <td><xsl:value-of select="@compatible"/></td>
    <td><xsl:value-of select="@wirelessmode"/></td>
    <td><xsl:value-of select="@connectiontype"/></td>
    <td><xsl:value-of select="@hasconfiguredssid"/></td>
    <td><xsl:value-of select="@channelfreq"/></td>
    <td><xsl:value-of select="@wifienabled"/></td>
    <td><xsl:value-of select="@ethlink"/></td>
    <td><xsl:value-of select="@behindwifiext"/></td>
    <td><xsl:value-of select="@idle"/></td>
    <td><xsl:value-of select="@ssdp"/></td>
    <td><xsl:value-of select="@mdns"/></td>
    <td><xsl:value-of select="@swgen"/></td>
    <td><xsl:value-of select="@quarantinereason"/></td>
</tr>
</xsl:for-each>
</table>
<table cellpadding="4">
<tr><th>Vanished Zone Name</th><th>UUID</th><th>CurGroup</th><th>PrevGroup</th><th>Location</th><th>Reason</th><th>Battery %</th><th>Battery Temp</th><th>Time Since</th><th>QuarReason</th></tr>
<xsl:for-each select=".//VanishedZonePlayer">
<tr>
    <td><xsl:value-of select="."/></td>
    <td><xsl:value-of select="@uuid"/></td>
    <td><xsl:value-of select="@curgroup"/></td>
    <td><xsl:value-of select="@prevgroup"/></td>
    <td><xsl:value-of select="@location"/></td>
    <td><xsl:value-of select="@reasonforvanish"/></td>
    <td><xsl:value-of select="@vanishbatterypercentage"/></td>
    <td><xsl:value-of select="@vanishbatterytemperature"/></td>
    <td><xsl:value-of select="@timesincevanish"/></td>
    <td><xsl:value-of select="@quarantinereason"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="MediaServers">
<xsl:if test="count(../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Media Servers
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table cellpadding="4">
<tr><th>Name</th><th>Location</th><th>UUID</th><th>Version</th><th>CanBeDisplayed</th><th>Unavailable</th><th>Type</th><th>Ext</th></tr>
<xsl:for-each select=".//MediaServer">
<tr>
    <td><xsl:value-of select="."/></td>
    <td><xsl:value-of select="@location"/></td>
    <td><xsl:value-of select="@uuid"/>      </td>
    <td><xsl:value-of select="@version"/>   </td>
    <td><xsl:value-of select="@canbedisplayed"/></td>
    <td><xsl:value-of select="@unavailable"/></td>
    <td><xsl:value-of select="@type"/></td>
    <td><xsl:value-of select="@ext"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="Subscriptions/Incoming">
<xsl:if test="count(../../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Incoming Subscriptions
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<tr valign="top" bgcolor="#cccccc">
<td align="left">
<pre>
<xsl:for-each select=".//Service">
subscriptions for: <xsl:value-of select="@name"/> current: <xsl:value-of select="@current"/> max: <xsl:value-of select="@max"/>
<xsl:for-each select=".//Subscription">
<br/><xsl:text>	</xsl:text>
<xsl:value-of select="./EventKey"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="./NotifyErrors"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="./SubscriptionID"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="./NotificationAddr"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="./IsSecure"/>
</xsl:for-each>
</xsl:for-each>
</pre>
</td>
</tr>
</table>
</div>
</xsl:template>

<xsl:template match="Subscriptions/Outgoing">
<xsl:if test="count(../../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Outgoing Subscriptions
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<tr valign="top" bgcolor="#cccccc">
<td align="left"><pre>
Outgoing Subscriptions<xsl:for-each select=".//Subscription">
<br/><xsl:text>	</xsl:text>
<xsl:value-of select="./LogicalSID"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="./FailureCount"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="./UPnPSID"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="./EventURI"/>
<xsl:text>	</xsl:text>
<xsl:value-of select="./IsSecure"/>
</xsl:for-each>
</pre>
</td>
</tr>
</table>
</div>
</xsl:template>

<xsl:template match="ConnectionDetails/*">
<li><xsl:value-of select="local-name()"/><xsl:text>: </xsl:text><xsl:value-of select="."/></li>
</xsl:template>

<xsl:template match="SubscribedEvents/Subscription">
<li><xsl:value-of select="@name"/></li>
</xsl:template>

<xsl:template match="History/Command">
<li><xsl:value-of select="@namespace"/> - <xsl:value-of select="@cmd"/> - <xsl:value-of select="@method"/> - <xsl:value-of select="@credType"/></li>
</xsl:template>

<xsl:template match="TruncatedConnectionList">
<p align="center"><i>This table might be incomplete. Found at least
<xsl:value-of select="@connections"/>
connections on a player that is configured to accept up to
<xsl:value-of select="@maxwebsockets"/> web sockets. Some connections are
hidden.</i></p>
</xsl:template>

<xsl:template match="Connection">
<tr>
<td><xsl:value-of select="@id"/></td>
<td><ul><xsl:apply-templates select="SubscribedEvents/Subscription"/></ul></td>
<td><ul><xsl:apply-templates select="History/Command"/></ul></td>
<td><xsl:value-of select="RemoteEndpoint"/></td>
<td><xsl:value-of select="LocalEndpoint"/></td>
<td><ul><xsl:apply-templates select="ConnectionDetails/*"/></ul></td>
</tr>
</xsl:template>

<xsl:template match="Muse/Active | Muse/WebSocketHistory | Muse/RestHistory">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Muse Server (<xsl:value-of select="local-name()"/>)
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<thead>
<tr>
<th>ID</th>
<th>Subscriptions</th>
<th>Command History</th>
<th>Remote Endpoint</th>
<th>Local Endpoint</th>
<th>Connection Details</th>
</tr>
</thead>
<tbody><xsl:apply-templates select="Connection"/></tbody>
</table>
<xsl:apply-templates select="TruncatedConnectionList"/>
</div>
</xsl:template>

<xsl:template match="ListEntry[@name]">
<li><xsl:value-of select="@name"/><xsl:text>: </xsl:text><xsl:value-of select="."/></li>
</xsl:template>
<xsl:template match="ListEntry">
<li><xsl:value-of select="."/></li>
</xsl:template>

<xsl:template match="Request">
<tr>
<td><xsl:value-of select="Time"/></td>
<td><xsl:value-of select="Duration"/><xsl:value-of select="Duration/@units"/></td>
<td><xsl:value-of select="ResponseCode"/></td>
<td><xsl:value-of select="RetryWait"/><xsl:value-of select="RetryWait/@units"/></td>
<td><ol><xsl:apply-templates select="Caller/ListEntry"/></ol></td>
<td><ul><xsl:apply-templates select="Info/ListEntry"/></ul></td>
<td><xsl:value-of select="Resource"/></td>
</tr>
</xsl:template>

<xsl:template match="Server">
<br/>
<a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
<xsl:value-of select="@service"/>[<xsl:value-of select="@account"/>] - <xsl:value-of select="@name"/> (<xsl:value-of select="@base"/>)
</a>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<thead>
<tr>
<th>Time</th>
<th>Duration</th>
<th>Response Code</th>
<th>Retry Wait</th>
<th>Caller</th>
<th>State</th>
<th>Resource</th>
</tr>
</thead>
<tbody><xsl:apply-templates select="Request"/></tbody>
</table>
</div>
</xsl:template>

<xsl:template match="CloudQueueHistory">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Cloud Queue
</a>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:apply-templates select="Server"/>
</div>
</xsl:template>

<xsl:template match="AutoTrueplayInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Auto Trueplay Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select="SelfTrueplayInfo/*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
<tr>
<td class="left">Coeffs</td>
<td>
<xsl:for-each select="SelfTrueplayEQ//param[@name='coeffs']">
<xsl:value-of select="@value"/><br/>
</xsl:for-each>
</td>
</tr>
</table>
</div>
</xsl:template>

<xsl:template match="VoiceProcessingInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Voice
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr><th colspan="4">Accounts</th></tr>
<tr><th>ID</th><th>Service</th><th>Status</th><th>WakeWord</th></tr>
<xsl:for-each select="VoiceAccounts">
<xsl:if test="(@numAccounts='0')">
<tr><td colspan="4">No Accounts</td></tr>
</xsl:if>
</xsl:for-each>
<xsl:for-each select="VoiceAccounts/VoiceAccountsEntry">
<tr>
<td><xsl:value-of select="@id"/></td>
<td><xsl:value-of select="@srv"/></td>
<td><xsl:value-of select="@stat"/></td>
<td><xsl:value-of select="@ww"/></td>
</tr>
</xsl:for-each>
</table>

<table class="purple">
<tr><th colspan="8">Services</th></tr>
<tr><th>Service</th><th>State</th><th>Last Disconnect</th><th>Endpoint</th><th>push-to-talk utterances</th><th>farfield utterances</th><th>Dialogs</th><th>ExtAudio plays</th></tr>
<xsl:for-each select="VoiceServices/VoiceService">
<tr>
<td><xsl:value-of select="@name"/></td>
<td><xsl:value-of select="State"/></td>
<td><xsl:value-of select="LastDisconReason"/></td>
<td><xsl:value-of select="Endpoint"/></td>
<td><xsl:value-of select="TotalPTT"/></td>
<td><xsl:value-of select="TotalFF"/></td>
<td><xsl:value-of select="TotalDialogs"/></td>
<td><xsl:value-of select="TotalExtAud"/></td>
</tr>
</xsl:for-each>
</table>

<table class="purple">
<tr><th colspan="2">Voice Processing</th></tr>
<xsl:for-each select="./*[not(self::VPTriggerHistory) and not(self::VPTriggerEntry) and not(self::VoiceAccounts) and not(self::VoiceServices) and not(self::VCStateTotals)]">
<tr>
<td class="left"><xsl:value-of select="local-name()"/></td>
<td><xsl:apply-templates select="current()/text()"/></td>
</tr>
</xsl:for-each>
<tr><td class="left">Total WW Utterances</td><td><xsl:value-of select="VPTriggerHistory/VPTotalWWs"/></td></tr>
<tr><td class="left">Total Self-reference blocks</td><td><xsl:value-of select="VPTriggerHistory/VPTotalSelfRefBlocks"/></td></tr>
</table>
<table class="purple">
<tr><th colspan="5">Trigger History</th></tr>
<tr>
<th>Time (s)</th><th>Service</th><th>Type</th><th>Trigger Beam</th><th>Samples uploaded</th>
</tr>
<xsl:for-each select="VPTriggerHistory/VPTriggers/VPTriggerEntry">
<tr>
<td><xsl:value-of select="@triggerTimestamp"/></td>
<td><xsl:value-of select="@service"/></td>
<td><xsl:value-of select="@triggerSource"/></td>
<td><xsl:value-of select="@triggerInitialBeam"/></td>
<td><xsl:value-of select="@triggerSamplesUpd"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="Shares">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Shares
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr>
<th>Share Path</th>
<th>Mount</th>
</tr>
<xsl:for-each select=".//Share">
<tr>
<td bgcolor="#ccccff"><b><xsl:value-of select="Path"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="Mount"/></b></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="RenderingControl">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Rendering Control
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="AudioCore">
<xsl:if test="count(../*) > 1">
  <br/><a class="leftMargin">
  <xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
  AudioCore
  </a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
  <xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>

<table class="purple">
<xsl:variable name="NumZones" select="count(.//SoundDevice/Zones/Zone)"/>
<tr><th><xsl:attribute name="colspan"><xsl:value-of select="$NumZones+1"/></xsl:attribute>
  Sound Device
</th></tr>
<xsl:for-each select=".//SoundDevice/Zones/Zone[1]/*">
  <xsl:variable name="FieldName" select="local-name()"/>
  <tr>
    <td class="left"><xsl:value-of select="$FieldName"/></td>
    <xsl:for-each select="../../Zone/*[name()=$FieldName]">
      <td><xsl:value-of select="current()/text()"/></td>
    </xsl:for-each>
  </tr>
</xsl:for-each>
</table>

<table class="purple">
<xsl:variable name="NumZones" select="count(.//DSPStateManager/Zones/Zone)"/>
<tr><th><xsl:attribute name="colspan"><xsl:value-of select="$NumZones+1"/></xsl:attribute>
  DSP State Manager
</th></tr>
<tr>
  <td class="left">OutputChannelMap</td>
  <td>
    <xsl:attribute name="colspan"><xsl:value-of select="$NumZones"/></xsl:attribute>
    <xsl:value-of select=".//DSPStateManager/OutputChannelMap"/>
  </td>
</tr>
<xsl:for-each select=".//DSPStateManager/Zones/Zone[1]/*">
  <xsl:variable name="FieldName" select="local-name()"/>
  <tr>
    <td class="left"><xsl:value-of select="$FieldName"/></td>
    <xsl:for-each select="../../Zone/*[name()=$FieldName]">
      <td><xsl:value-of select="current()/text()"/></td>
    </xsl:for-each>
  </tr>
</xsl:for-each>
</table>

<table class="purple">
<tr><th colspan="2">Play State Manager</th></tr>
<xsl:for-each select=".//PlayStateManager/*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>

</div>
</xsl:template>

<xsl:template match="DNSCache">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
DNS Cache
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<tr valign="middle" bgcolor="#9999cc">
<th>Hostname</th>
<th>Address</th>
<th>Expiration (s)</th>
</tr>
<xsl:for-each select=".//Entry">
<tr valign="baseline" bgcolor="#cccccc">
<td bgcolor="#ccccff"><b><xsl:value-of select="Host"/></b></td>
<td bgcolor="#ccccff" align="right"><b><xsl:value-of select="Addr"/></b></td>
<td bgcolor="#ccccff" align="right"><b><xsl:value-of select="Expires"/></b></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="Playmode">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Play Mode
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="Cloud">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Cloud Connection Status
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="RoomCalibrationInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Trueplay Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<p><b><u>Current Trueplay Information</u></b></p>
<table class="purple">
<tr>
<th>Trueplay State</th>
<td><xsl:value-of select="RoomCalibrationActiveState"/></td>
</tr>
<tr>
<th>User Intent</th>
<td><xsl:value-of select="RoomCalibrationUserIntent"/></td>
</tr>
<tr>
<th>Avail Cal ID</th>
<td><xsl:value-of select="RoomCalibrationAvailCalID"/></td>
</tr>
<tr>
<th>Orientation</th>
<td><xsl:value-of select="RoomCalibrationOrientation"/></td>
</tr>
<tr>
<th>BondedZoneInfo</th>
<td><xsl:value-of select="RoomCalibrationBondedZoneInfo"/></td>
</tr>
</table>
<p><b><u>Trueplay Config</u></b></p>
<table border="1">
<tr bgcolor="#9999cc" style="padding:3px">
<th style="width:400px">Active Channels</th>
</tr>
<xsl:for-each select="RoomCalibrationConfig/ActiveChannels/type">
<tr>
<td><xsl:value-of select="text()"/></td>
</tr>
</xsl:for-each>
</table>
<table border="1">
<tr bgcolor="#9999cc" style="padding:3px">
<th style="width:400px">Supported Channels</th>
<th style="width:400px">Direction</th>
</tr>
<xsl:for-each select="RoomCalibrationConfig/SupportedChannels/Channel">
<tr>
<td><xsl:value-of select="type"/></td>
<td><xsl:value-of select="direction"/></td>
</tr>
</xsl:for-each>
</table>
<p><u>Delay Mapping</u></p>
<table border="1">
<tr bgcolor="#9999cc" style="padding:3px">
<th style="width:400px">Channel</th>
<th style="width:400px">Channel Used</th>
</tr>
<xsl:for-each select="RoomCalibrationConfig/ChannelMappings/Delay/Mapping">
<tr>
<td><xsl:value-of select="source"/></td>
<td><xsl:value-of select="destination"/></td>
</tr>
</xsl:for-each>
</table>
<p><u>Gain Mapping</u></p>
<table border="1">
<tr bgcolor="#9999cc" style="padding:3px">
<th style="width:400px">Channel</th>
<th style="width:400px">Channel Used</th>
</tr>
<xsl:for-each select="RoomCalibrationConfig/ChannelMappings/Gain/Mapping">
<tr>
<td><xsl:value-of select="source"/></td>
<td><xsl:value-of select="destination"/></td>
</tr>
</xsl:for-each>
</table>
<p><b><u>Trueplay Calibrations</u></b></p>
<p><b><u>Spatial</u></b></p>
<table border="1">
<tr bgcolor="#9999cc" style="padding:3px">
<th style="width:400px">Channel</th>
<th style="width:400px">Delay(samples)</th>
</tr>
<xsl:for-each select="RoomCalibrationData/RoomCalibrationSpatial/Channel">
<tr>
<td><xsl:value-of select="type"/></td>
<td><xsl:value-of select="delay"/></td>
</tr>
</xsl:for-each>
</table>
<p><b><u>Spectral</u></b></p>
<table border="1">
<tr bgcolor="#9999cc" style="padding:3px">
<th style="width:400px">Channel</th>
<th style="width:400px">Gain</th>
<th style="width:400px">Coeffs</th>
</tr>
<xsl:for-each select="RoomCalibrationData/RoomCalibrationSpectral/Channel">
<tr>
<td><xsl:value-of select="type"/></td>
<td><xsl:value-of select="gain"/></td>
<td><table>
<xsl:for-each select="coeffs/set">
<tr>
<td><xsl:value-of select="text()"/>
</td>
</tr>
</xsl:for-each>
</table></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="Alarm">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Alarm Data
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr><th colspan="2">Time Server</th></tr>
<tr><th>Time Mode</th><td><xsl:value-of select="Mode"/></td></tr>
<tr><th>Stamp</th><td align="left"><xsl:value-of select="Stamp"/></td></tr>
<tr><th>Scheduled</th><td align="left"><xsl:value-of select="Scheduler"/></td></tr>
<tr><th>UTC Time</th><td><xsl:value-of select="UTCTime"/></td></tr>
<tr><th>Local Time</th><td><xsl:value-of select="LocalTime"/></td></tr>
</table>
<table class="purple">
<tr><th colspan="6">Pending Alarm Data</th></tr>
<tr><th>Type</th><th>ID</th><th>Time</th><th>Recurrence</th><th>NextUTC</th><th>NextLocal</th></tr>
<xsl:for-each select="./Pending/PendingAlarm">
<tr><td><xsl:value-of select="Type"/></td><td><xsl:value-of select="ID"/></td><td><xsl:value-of select="Time"/></td><td><xsl:value-of select="Recurrence"/></td><td><xsl:value-of select="NextUTC"/></td><td><xsl:value-of select="NextLocal"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template name="NetworkMatrix">
<xsl:if test="count(/*//ZPSupportInfo) > 1">
<br/><a>
<xsl:attribute name="href">javascript:makenetwork(); toggle('network');</xsl:attribute>
Network Matrix
</a>
<div id="network" style="display:none">
<table id="networkTable">
<tbody id="networkTableBody">
</tbody>
</table>

<form style="display:none" id="netdata" name="netdata">
<xsl:for-each select="/ZPNetworkInfo/ZPSupportInfo/File[@name = '/proc/ath_rincon/status']">
<div>
<xsl:attribute name="id">netdata_<xsl:value-of select="..//LocalUID"/></xsl:attribute>
<textarea>
<xsl:attribute name="id">status_<xsl:value-of select="..//LocalUID"/></xsl:attribute>
<xsl:value-of select="."/>
</textarea>
<textarea>
<xsl:attribute name="id">ifconfig_<xsl:value-of select="..//LocalUID"/></xsl:attribute>
<xsl:value-of select="../Command[@cmdline = '/sbin/ifconfig']"/>
</textarea>
<textarea>
<xsl:attribute name="id">stp_<xsl:value-of select="..//LocalUID"/></xsl:attribute>
<xsl:value-of select="../Command[@cmdline = '/usr/sbin/brctl showstp br0']"/>
</textarea>
<textarea>
<xsl:attribute name="id">zonename_<xsl:value-of select="..//LocalUID"/></xsl:attribute>
<xsl:value-of select="..//ZoneName"/>
</textarea>
</div>
</xsl:for-each>
</form>

</div>
</xsl:if>
</xsl:template>

<xsl:template match="EnetPorts">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Ethernet Ports
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table cols="3">
<tr><th>Port</th><th>Link</th><th>Speed</th></tr>
<xsl:for-each select=".//Port">
<tr>
<td><xsl:value-of select="@port"/></td>
<td><xsl:value-of select="Link"/></td>
<td><xsl:value-of select="Speed"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="EthPrtStats">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Ethernet Ports Statistics
</a>
</xsl:if>
<div id="{generate-id()}" align="center">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<tr style="text-align:center; vertical-align:middle" bgcolor="#9999cc">
<th>Port</th>
<th colspan="11">Statistics</th>
</tr>
<xsl:for-each select=".//EthIntrf">
<tr style="text-align:center; vertical-align:middle" bgcolor="#cccccc">
<!-- print the port number for the interface -->
<td rowspan="6" align="middle" bgcolor="#ccccff">
<div style="max-width:100px; overflow-x:auto"><b><xsl:value-of select="@id"/></b></div>
</td>
<!-- Summary -->
<th rowspan="2" bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Summary</b></div></th>
<!-- Summary Columns -->
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Packets Received</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Packets Trasmitted</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Bytes Received</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Bytes Transmitted</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Bad Packets Recieved</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Packet Transmit Problem</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Rx Packets Dropped</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Tx Packets Dropped</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Multicasts</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Collisions</b></div></th>
</tr>
<tr style="text-align:center; vertical-align:middle" >
<!-- Summary column data -->
<td bgcolor="#ccccff"><b><xsl:value-of select="@rxPackets"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@txPackets"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@rxBytes"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@txBytes"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@rxErrors"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@txErrors"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@rxDropped"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@txDropped"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@multicasts"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@collisions"/></b></td>
</tr>
<!-- Rx Detailed Errors-->
<tr style="text-align:center; vertical-align:middle" >
<th rowspan="2" bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Rx Detailed Errors</b></div></th>
<!-- Rx Detailed error names-->
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Rx Length Errors</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Overflow errors</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>CRC errors</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Frame errors</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Fifo errors</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Missed errors</b></div></th>
<!-- Padding -->
<th colspan="4" rowspan="2" bgcolor="#ccccdd"></th>
</tr>
<!-- Rx detailed errors data -->
<tr style="text-align:center; vertical-align:middle" >
<td bgcolor="#ccccff"><b><xsl:value-of select="RxDtlErr/@lngthErr"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="RxDtlErr/@ovrFlwErr"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="RxDtlErr/@crcErr"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="RxDtlErr/@frmeErr"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="RxDtlErr/@fifoErr"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="RxDtlErr/@missedErr"/></b></td>
</tr>

<!-- Tx detailed error names-->
<tr style="text-align:center; vertical-align:middle" >
<th rowspan="2" bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Tx Detailed Errors</b></div></th>
<!-- Tx Detailed Errors Column Names-->
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Aborted errors</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Carrier errors</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Fifo errors</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Heartbeat errors</b></div></th>
<th bgcolor="#cccccc"><div style="max-width:100px; overflow-x:auto"><b>Window errors</b></div></th>
<!-- Padding -->
<th colspan="5" rowspan="2" bgcolor="#ccccdd"></th>
</tr>
<!-- Tx detailed errors data -->
<tr style="text-align:center; vertical-align:middle" >
<td bgcolor="#ccccff"><b><xsl:value-of select="TxDtlErr/@abrtErr"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="TxDtlErr/@crErr"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="TxDtlErr/@fifoErr"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="TxDtlErr/@hrtBeatErr"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="TxDtlErr/@wndwErr"/></b></td>
</tr>
<th colspan="12" bgcolor="#ccbbdd"></th>
</xsl:for-each>
</table>
</div>
</xsl:template>

<!-- Entries into the RadioStationLog -->
<xsl:template match="Entry[Meta]">
<tr>
<td><xsl:value-of select="TimeStamp"/></td>
<td><xsl:value-of select="Meta"/></td>
<td><xsl:choose><xsl:when test="(MillisecondsToResolve >= 0)"><xsl:value-of select="MillisecondsToResolve"/></xsl:when></xsl:choose></td>
<td><xsl:value-of select="URI"/></td>
<td><xsl:value-of select="MimeType"/></td>
</tr>
</xsl:template>

<xsl:template match="RadioStationLog">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Radio Station Log
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<thead><th>Timestamp</th><th>Type</th><th>Milliseconds to Resolve</th><th>URI</th><th>MIME Type</th></thead>
<xsl:apply-templates select="Entry"/>
</table>
</div>
</xsl:template>

<xsl:template match="ButtonTriggeredDump">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Button Triggered XML Dump
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<div>
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">margin-left:2em</xsl:attribute>
</xsl:if>
<xsl:apply-templates select="ZPSupportInfo"/>
</div>
</div>
</xsl:template>

<xsl:template match="DropoutTriggeredDump">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Dropout Triggered XML Dump
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<div>
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">margin-left:2em</xsl:attribute>
</xsl:if>
<xsl:apply-templates select="ZPSupportInfo"/>
</div>
</div>
</xsl:template>

<xsl:template match="Backtrace">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Backtrace
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple"><tr><td>
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">margin-left:2em</xsl:attribute>
</xsl:if>
<pre><xsl:value-of select="text()"/></pre>
</td></tr></table>
</div>
</xsl:template>

<xsl:template match="NetSettings">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
netsettings.txt
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple"><tr><td>
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">margin-left:2em</xsl:attribute>
</xsl:if>
<pre><xsl:value-of select="text()"/></pre>
</td></tr></table>
</div>
</xsl:template>

<xsl:template match="SsidList">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
ssidlist.txt
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple"><tr><td>
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">margin-left:2em</xsl:attribute>
</xsl:if>
<pre><xsl:value-of select="text()"/></pre>
</td></tr></table>
</div>
</xsl:template>

<xsl:template match="ReplicatedNetSettings">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Household Netsettings
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr>
<th>LastUpdateDevice</th>
<td><xsl:value-of select="@LastUpdateDevice"/></td>
</tr>
<tr>
<th>Version</th>
<td><xsl:value-of select="@Version"/></td>
</tr>
<tr>
<th>FileSchemaVersion</th>
<td><xsl:value-of select="@FileSchemaVersion"/></td>
</tr>
</table>
<table class="purple">
<tr>
<th colspan="2">SonosNet</th>
</tr>
<tr>
<th>Disable</th>
<td><xsl:value-of select=".//SonosNet/@Disable"/></td>
</tr>
<tr>
<th>Frequency</th>
<td><xsl:value-of select=".//SonosNet/@Frequency"/></td>
</tr>
</table>
<table class="purple">
<tr>
<th colspan="2">Networks</th>
</tr>
<tr>
<th>SSID</th>
<th>Flags</th>
</tr>
<xsl:for-each select=".//Network">
<tr valign="baseline">
<td><xsl:value-of select="@SSID"/></td>
<td align="right"><xsl:value-of select="@Flags"/></td>
</tr>
</xsl:for-each>
</table>
<table class="purple">
<tr>
<th colspan="2">DTLS PSKs</th>
</tr>
<tr>
<th>Household</th>
<td><xsl:value-of select=".//HhPsk/@id"/></td>
</tr>
<tr>
<th>Backup Household</th>
<td><xsl:value-of select=".//BackupHhPsk/@id"/></td>
</tr>
<tr>
<th>Control</th>
<td><xsl:value-of select=".//ControlPsk/@id"/></td>
</tr>
<tr>
<th>Backup Control</th>
<td><xsl:value-of select=".//BackupControlPsk/@id"/></td>
</tr>
<tr>
<th>RoomEnc</th>
<td><xsl:value-of select=".//RoomEncPsk/@id"/></td>
</tr>
<tr>
<th>Backup RoomEnc</th>
<td><xsl:value-of select=".//BackupRoomEncPsk/@id"/></td>
</tr>
<tr>
<th>LanSwap</th>
<td><xsl:value-of select=".//LanSwapPsk/@id"/></td>
</tr>
<tr>
<th>Backup LanSwap</th>
<td><xsl:value-of select=".//BackupLanSwapPsk/@id"/></td>
</tr>
</table>
</div>
</xsl:template>

<xsl:template match="SystemSettings">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
SystemSettings
</a>
</xsl:if>
<div id="{generate-id()}" align="center">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<tr valign="middle" bgcolor="#9999cc">
<th>LastUpdateDevice</th>
<th>Version</th>
</tr>
<tr valign="baseline" bgcolor="#cccccc">
<td bgcolor="#ccccff"><div style="max-width:200px; overflow-x:auto"><b><xsl:value-of select="@LastUpdateDevice"/></b></div></td>
<td bgcolor="#ccccff"><div style="max-width:500px; overflow-x:auto"><b><xsl:value-of select="@Version"/></b></div></td>
</tr>
<tr valign="middle" bgcolor="#9999cc">
<th>Setting</th>
<th>Value</th>
</tr>
<xsl:for-each select=".//Setting">
<tr valign="baseline" bgcolor="#cccccc">
<td bgcolor="#ccccff"><div style="max-width:200px; overflow-x:auto"><b><xsl:value-of select="@Name"/></b></div></td>
<td bgcolor="#ccccff"><div style="max-width:500px; overflow-x:auto"><b><xsl:value-of select="@Value"/></b></div></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="AccountsInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Accounts
</a>
</xsl:if>
<div id="{generate-id()}" align="center">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr>
<th>LastUpdateDevice</th>
<th>Version</th>
<th>NextSerialNum</th>
<th>PreferredSerialNum</th>
<th colspan="2">VClockHousehold</th>
<th colspan="3">VClockCloud</th>
<th colspan="5">MuseHouseholdID</th>
</tr>
<tr valign="baseline" bgcolor="#cccccc">
<td bgcolor="#ccccff"><b><xsl:value-of select=".//Accounts/@LastUpdateDevice"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//Accounts/@Version"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//Accounts/@NextSerialNum"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//Accounts/@PreferredSerialNum"/></b></td>
<td colspan="2" bgcolor="#ccccff"><b><xsl:value-of select=".//Accounts/@VClockHousehold"/></b></td>
<td colspan="3" bgcolor="#ccccff"><b><xsl:value-of select=".//Accounts/@VClockCloud"/></b></td>
<td colspan="5" bgcolor="#ccccff"><b><xsl:value-of select=".//Accounts/@MuseHouseholdID"/></b></td>
</tr>
<tr valign="middle" bgcolor="#9999cc">
<th>UUID</th>
<th>Type</th>
<th>SerialNum</th>
<th>Deleted</th>
<th>UN</th>
<th>NN</th>
<th>MD</th>
<th>Flags</th>
<th>OADevID</th>
<th>Hash</th>
<th>Tier</th>
<th>VClockHousehold</th>
<th>VClockCloud</th>
</tr>
<xsl:for-each select=".//Account">
<tr valign="baseline" bgcolor="#cccccc">
<td bgcolor="#ccccff"><b><xsl:value-of select="@Id"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@Type"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@SerialNum"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@Deleted"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//UN"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//NN"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//MD"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@Flags"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//OADevID"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//Hash"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//Tier"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@VClockHousehold"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select="@VClockCloud"/></b></td>
</tr>
</xsl:for-each>
</table>
<table class="purple">
<tr>
<th>Replication Player (push requests)</th>
<th>Operation</th>
<th>Time</th>
<th>Result</th>
</tr>
<tr>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//ReplicationPlayer"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//ReplicationOperation"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//ReplicationTime"/></b></td>
<td bgcolor="#ccccff"><b><xsl:value-of select=".//ReplicationResult"/></b></td>
</tr>
</table>
</div>
</xsl:template>

<xsl:template match="DeviceCertInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Device Certificate (<xsl:value-of select="CertName"/>)
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select=".//*">
<tr><td align="right"><xsl:value-of select="local-name()"/></td>
<td><pre><xsl:value-of select="text()"/></pre></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>


<xsl:template match="PerformanceCounterTables">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Performance Counter Tables
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<script>perfcounter.generateTableForEach('<xsl:value-of select="generate-id()"/>',  [
<xsl:for-each select=".//CounterTable">
<xsl:if test="position() > 1">,</xsl:if>
<xsl:value-of select="."/>
</xsl:for-each>
]);
</script>
</div>
</xsl:template>

<xsl:template match="CpuMonitor">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
CPU Monitor
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<xsl:for-each select=".//Counter">
<tr valign="top" bgcolor="#cccccc"><td align="left"><pre>
<xsl:value-of select="@name"/>:
<xsl:value-of select="."/>
</pre></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="CpuInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
CPU Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<h3>CPU Info</h3>
<pre>
<xsl:value-of select="."/>
</pre>
</div>
</xsl:template>

<xsl:template match="TemperatureHistograms">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Temperature Histograms
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr><th colspan="2">Temperature Histograms</th></tr>
<xsl:for-each select=".//*">
<tr>
<td class="left"><xsl:value-of select="local-name()"/></td>
<td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="Decoder">
<xsl:if test="count(../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
TV Decoder Status
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
  <tr><th colspan="2">TV Decoder Status</th></tr>
    <xsl:for-each select="*">
      <tr>
        <td class="left"><xsl:value-of select="local-name()"/></td>
        <td><xsl:value-of select="current()/text()"/></td>
      </tr>
    </xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="DialogExtractor">
<xsl:if test="count(../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Dialog Extractor
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
  <tr><th colspan="2">Dialog Extractor</th></tr>
    <xsl:for-each select="*">
      <tr>
        <td class="left"><xsl:value-of select="local-name()"/></td>
        <td><xsl:value-of select="current()/text()"/></td>
      </tr>
    </xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="MusicDecoder">
<xsl:if test="count(../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Music Decoder Status
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
  <tr><th colspan="2">Music Decoder Status</th></tr>
    <xsl:for-each select="*">
      <tr>
        <td class="left"><xsl:value-of select="local-name()"/></td>
        <td><xsl:value-of select="current()/text()"/></td>
      </tr>
    </xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="HTConfig">
  <xsl:if test="count(../*) > 1">
    <br/>
    <a class="leftMargin">
      <xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
      Home Theater Configuration
    </a>
  </xsl:if>
  <div id="{generate-id()}">
    <xsl:if test="count(../*) > 1">
    <xsl:attribute name="style">display:none</xsl:attribute>
    </xsl:if>
    <table class="purple">
      <tr><th colspan="2">Home Theater Configuration</th></tr>
      <xsl:for-each select=".//General/*">
        <tr>
          <td class="left"><xsl:value-of select="local-name()"/></td>
          <td><xsl:apply-templates select="current()/text()"/></td>
        </tr>
      </xsl:for-each>
    </table>
    <table class="purple">
      <tr><th colspan="7">Satellites</th></tr>
      <tr><th>Channel</th><th>Delay</th><th>Gain</th><th>IP</th><th>Eth</th><th>WiEna</th><th>PktRate</th></tr>
      <xsl:for-each select=".//Satellites/*">
        <tr>
          <td class="left"><xsl:value-of select="current()/Channel/text()"/></td>
          <td><xsl:apply-templates select="current()/Delay/text()"/></td>
          <td><xsl:apply-templates select="current()/Gain/text()"/></td>
          <td><xsl:apply-templates select="current()/IP/text()"/></td>
          <td><xsl:apply-templates select="current()/Eth/text()"/></td>
          <td><xsl:apply-templates select="current()/WiEna/text()"/></td>
          <td><xsl:apply-templates select="current()/PktRate/text()"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </div>
</xsl:template>

<xsl:template match="TVProc">
<xsl:if test="count(../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
TV Processor Status
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
  <tr><th colspan="2">TV Processor Status</th></tr>

  <xsl:for-each select="*">
  <tr>
    <td class="left"><xsl:value-of select="local-name()"/></td>
    <td><xsl:value-of select="current()/text()"/></td>
  </tr>
  </xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="ChannelStatusBlock">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Channel Status Block
</a>
</xsl:if>
<div id="{generate-id()}">
<table class="purple">
<tr><th colspan="2">Channel Status Block</th></tr>
  <xsl:for-each select="*">

  <xsl:choose>
    <xsl:when test="local-name()='MultiChannel'">
      <tr>
        <td class="left"><xsl:value-of select="local-name()"/></td>
        <td>Layout(<xsl:value-of select="Layout"/>) Allocation(<xsl:value-of select="Allocation"/>)</td>
      </tr>
    </xsl:when>
    <xsl:otherwise>
      <tr>
        <td class="left"><xsl:value-of select="local-name()"/></td>
        <td><xsl:value-of select="current()/text()"/></td>
      </tr>
    </xsl:otherwise>
  </xsl:choose>

  </xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="AutoPlay">
<xsl:if test="count(../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Auto Play
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr><th colspan="2">Auto Play</th></tr>
  <xsl:for-each select="*">
    <tr>
      <td class="left"><xsl:value-of select="local-name()"/></td>
      <td><xsl:value-of select="current()/text()"/></td>
    </tr>
  </xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="SPDIFParser">
<xsl:if test="count(../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
SPDIF Parser Status
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
  <tr><th colspan="2">SPDIF Parser Status</th></tr>

  <xsl:for-each select="*">
  <tr>
    <td class="left"><xsl:value-of select="local-name()"/></td>
    <td><xsl:value-of select="current()/text()"/></td>
  </tr>
  </xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="HDMI">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
HDMI Status
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>

<table class="purple">
  <tr><th colspan="2">Status</th></tr>
  <xsl:for-each select=".//HDMIStatus/*">
    <tr>
      <td class="left"><xsl:value-of select="local-name()"/></td>
      <td><xsl:apply-templates select="current()/text()"/></td>
    </tr>
  </xsl:for-each>
</table>

<table class="purple">
  <tr><th colspan="2">CEC</th></tr>
  <xsl:for-each select=".//CEC/*">
    <tr>
      <td class="left"><xsl:value-of select="local-name()"/></td>
      <td><xsl:apply-templates select="current()/text()"/></td>
    </tr>
  </xsl:for-each>
</table>

<table class="purple">
<tr><th colspan="2">TV</th></tr>
<xsl:for-each select=".//TV/*">

<xsl:choose>
  <xsl:when test="not(local-name()='AudioFormats')">
    <tr>
    <td class="left"><xsl:value-of select="local-name()"/></td>
    <td><xsl:apply-templates select="current()/text()"/></td>
    </tr>
  </xsl:when>
  <xsl:otherwise>
    <xsl:for-each select=".//AudioFormat">
      <xsl:choose>
        <xsl:when test="position() = 1">
          <tr>
            <td class="left">
              <xsl:attribute name="rowspan">
                <xsl:value-of select="count(../AudioFormat)"/>
              </xsl:attribute>
              <xsl:value-of select="local-name()"/>
            </td>
            <td><xsl:value-of select="current()/text()"/></td>
          </tr>
        </xsl:when>
        <xsl:otherwise>
          <tr><td><xsl:value-of select="current()/text()"/></td></tr>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:otherwise>
</xsl:choose>

</xsl:for-each>
</table>

<table class="purple">
  <tr><th colspan="7">Topology</th></tr>

  <xsl:for-each select=".//Topology/*">
    <xsl:choose>
      <xsl:when test="not(local-name()='List')">
        <tr>
        <td class="left"><xsl:value-of select="local-name()"/></td>
        <td colspan="6"><xsl:apply-templates select="current()/text()"/></td>
        </tr>
      </xsl:when>
      <xsl:otherwise>
        <xsl:for-each select=".//Device">
          <xsl:choose>
            <xsl:when test="position() = 1">
              <tr>
                <th>LogicalAddress</th>
                <th>PhysicalAddress</th>
                <th>VendorId</th>
                <th>OsdName</th>
                <th>CecVersionDeclared</th>
                <th>Cec2MsgObserved</th>
                <th>LastUpdateSec</th>
              </tr>
            </xsl:when>
          </xsl:choose>
          <tr>
            <td><xsl:value-of select="LogicalAddress"/></td>
            <td><xsl:value-of select="PhysicalAddress"/></td>
            <td><xsl:value-of select="VendorId"/></td>
            <td><xsl:value-of select="OsdName"/></td>
            <td><xsl:value-of select="CecVersionDeclared"/></td>
            <td><xsl:value-of select="Cec2MsgObserved"/></td>
            <td><xsl:value-of select="LastUpdateSec"/></td>
          </tr>
        </xsl:for-each>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:for-each>
</table>

<table class="purple">
  <tr><th colspan="3">AudioCapabilities</th></tr>
  <xsl:for-each select=".//AudioCapabilities/*">
    <xsl:choose>
      <xsl:when test="local-name()='OrderedSADs'">
        <xsl:for-each select=".//SAD">
          <tr>
            <xsl:choose>
              <xsl:when test="position() = 1">
                <td class="left">
                  <xsl:attribute name="rowspan">
                    <xsl:value-of select="count(../*)"/>
                  </xsl:attribute>
                  OrderedSADs
                </td>
              </xsl:when>
            </xsl:choose>
            <td><xsl:value-of select="Hex"/></td>
            <td><xsl:value-of select="String"/></td>
          </tr>
        </xsl:for-each>
      </xsl:when>
      <xsl:otherwise>
        <tr>
          <td class="left"><xsl:value-of select="local-name()"/></td>
          <td><xsl:value-of select="Hex"/></td>
          <td><xsl:value-of select="String"/></td>
        </tr>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:for-each>
</table>

<xsl:if test=".//RawEdid">
  <table class="purple" id="edidTable">
    <tr><th>RawEdid</th></tr>
    <tr><td><xsl:value-of select=".//RawEdid"/></td></tr>
  </table>
</xsl:if>

</div>
</xsl:template>

<xsl:template match="CecMessageLog">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
HDMI CEC Messages
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<tr valign="top" bgcolor="#cccccc"><td align="left"><pre>
HDMI CEC Message Log:
<xsl:value-of select="."/>
</pre></td></tr>
</table>
</div>
</xsl:template>

<xsl:template match="Headphones">
<xsl:if test="count(../*) > 2">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Headphones
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 2">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
  <tr><th colspan="2">Headphones</th></tr>
    <xsl:for-each select="./Control/* | ./Pipeline/* | ./Renderer/* | ./Transport/*">
      <tr>
        <td class="left"><xsl:value-of select="local-name()"/></td>
        <td><xsl:value-of select="current()/text()"/></td>
      </tr>
    </xsl:for-each>
</table>
<table class="purple">
  <tr><th colspan="4">Paired Devices</th></tr>
  <tr><th>SerialNumber</th><th>Address</th><th>Name</th><th>HardwareVersion</th></tr>
  <xsl:for-each select="./Paired/Device">
    <tr>
      <xsl:for-each select="*">
        <td><xsl:value-of select="current()/text()"/></td>
      </xsl:for-each>
    </tr>
  </xsl:for-each>
</table>
<table class="purple">
  <tr><th colspan="4">Connected Devices</th></tr>
  <tr><th>Address</th><th>Name</th><th>FirmwareVersion</th><th>Streaming</th></tr>
  <xsl:for-each select="./WiFi/Device">
    <tr>
      <xsl:for-each select="*">
        <td><xsl:value-of select="current()/text()"/></td>
      </xsl:for-each>
    </tr>
  </xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="TrackQueueSummary">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Track Queue Summary
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:for-each select=".//Queue">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
</div>
</xsl:template>

<xsl:template match="ThirdPartyLibraryInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Third Party Libraries
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:for-each select=".//Library">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
</div>
</xsl:template>

<xsl:template match="AvailableSvcsSummary">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Service Ids</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr>
<th></th>
<th>File</th>
<th>Cached</th>
</tr>
<tr>
<th>ETag</th>
<td><xsl:value-of select="@rsETag"/></td>
<td><xsl:value-of select="@zpETag"/></td>
</tr>
<tr>
<th>Version</th>
<td><xsl:value-of select="@rsVer"/></td>
<td><xsl:value-of select="@zpVer"/></td>
</tr>
<tr>
<th>LUD</th>
<td><xsl:value-of select="@rsLUD"/></td>
<td><xsl:value-of select="@zpLUD"/></td>
</tr>
</table>
<p></p>
<table class="purple">
<tr>
<th>Total</th><td><xsl:value-of select="./Total"/></td>
</tr>
<tr>
<th>Service Ids</th><td><xsl:value-of select="./ServiceIds"/></td>
</tr>
</table>
</div>
</xsl:template>

<xsl:template match="TrackQueueDetails">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Track Queue Details (<xsl:value-of select="@Name"/>)
</a>
</xsl:if>
<div id="{generate-id()}">

<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr><th colspan="4"><xsl:value-of select="@Name"/> Queue Tracks</th></tr>
<tr>
    <th>TrackNum</th>
    <th>Track /<br/> Enqueued URL</th>
    <th>ExtraMd /<br/> EnqueuedMd</th>
</tr>
<xsl:for-each select=".//track">
<tr>
    <td class="left"><xsl:value-of select="@number"/></td>
    <td><xsl:value-of select="@url"/></td>
    <td><xsl:value-of select="extraMd"/></td>
</tr>
<tr>
    <td class="left"></td>
    <td><xsl:value-of select="@enqueuedUri"/></td>
    <td><xsl:value-of select="enqueuedMd"/></td>
</tr>
</xsl:for-each>
</table>

</div>
</xsl:template>

<xsl:template match="UpdateInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Update Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="ZoneExperiments">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Zone Experiments
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr>
    <th>id</th>
    <th>name</th>
    <th>value</th>
</tr>
<xsl:for-each select=".//ZoneExperiment">
<tr>
    <td><xsl:value-of select="@id"/></td>
    <td><xsl:value-of select="@name"/></td>
    <td><xsl:value-of select="@value"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="LedPatternInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Led Patterns
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr>
    <th colspan="7">Led Patterns</th>
</tr>
<tr>
    <th>Time</th>
    <th>IDs</th>
    <th>Repeats</th>
    <th>Steps</th>
    <th>RGB</th>
    <th>Hold</th>
    <th>Fade</th>
</tr>
<xsl:for-each select="LedPatternEntry">
<tr>
    <td><xsl:value-of select="@time"/></td>
    <td><xsl:value-of select="@led_ids"/></td>
    <td><xsl:value-of select="@repeats"/></td>
    <td><xsl:value-of select="@steps"/></td>
    <td></td>
    <td></td>
    <td></td>
</tr>
<xsl:for-each select="LedStepEntry">
<tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td><xsl:value-of select="@rgb"/></td>
    <td><xsl:value-of select="@hold"/></td>
    <td><xsl:value-of select="@fade"/></td>
</tr>
</xsl:for-each>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="Policies">
<xsl:if test="count(../*) > 3">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Runtime Policies
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 3">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select=".//Policy">
<tr>
    <td class="left"><xsl:value-of select="@name"/></td>
    <td><xsl:value-of select="@value"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="Entitlements">
<xsl:if test="count(../*) > 3">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Entitlements
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 3">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr>
    <th>type</th>
    <th>isTrial</th>
    <th>sku</th>
    <th>startDate</th>
    <th>endDate</th>
    <th>codes</th>
</tr>
<xsl:for-each select=".//Entitlement">
<tr>
    <td><xsl:value-of select="@type"/></td>
    <td><xsl:value-of select="@isTrial"/></td>
    <td><xsl:value-of select="@sku"/></td>
    <td><xsl:value-of select="@startDate"/></td>
    <td><xsl:value-of select="@endDate"/></td>
    <td><xsl:value-of select="@codes"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="CloudSettings">
<xsl:if test="count(../*) > 3">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Cloud Settings
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 3">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<tr valign="top" bgcolor="#cccccc">
  <td align="left">
    <code><xsl:apply-templates select="current()/text()"/></code>
  </td>
</tr>
</table>
</div>
</xsl:template>

<xsl:template match="LocalSettings">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
LocalSettings
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<pre>
<xsl:value-of select="."/>
</pre>
</div>
</xsl:template>

<xsl:template match="SSLClientCache">
<xsl:if test="count(../../*) > 1 and position() = 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('sslclientcache')</xsl:attribute>
SSL client cache
</a>
</xsl:if>
<div id="sslclientcache">
<xsl:if test="count(../../*) > 1 and position() = 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr>
<th colspan="7"><xsl:value-of select="Name"/> cache (<xsl:value-of select="CurrentEntries"/> entries / <xsl:value-of select="MaxEntries"/> max entries)</th>
</tr>
<tr>
<th>hostname</th>
<th>port</th>
<th>last access time (sec)</th>
<th>expire time (sec)</th>
<th>time since last access (sec)</th>
<th>time to expire (sec)</th>
<th>time since last refresh (sec)</th>
</tr>
<xsl:for-each select="Entry">
<tr>
<td><xsl:value-of select="HostName"/></td>
<td><xsl:value-of select="Port"/></td>
<td><xsl:value-of select="LastAccessTime"/></td>
<td><xsl:value-of select="ExpireTime"/></td>
<td><xsl:value-of select="TimeSinceLastAccess"/></td>
<td><xsl:value-of select="TimeToExpire"/></td>
<td><xsl:value-of select="TimeSinceLastRefresh"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="LocationSettingsUpdate">
<xsl:if test="count(../*) > 1">
<br/><a class="l2">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Location Settings Updates
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<xsl:for-each select="./Data">
<tr><td class="left"><xsl:value-of select="@name"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
<table>
<xsl:for-each select=".//Counter">
<tr valign="top" bgcolor="#cccccc"><td align="left"><pre>
<xsl:value-of select="@name"/>:
<xsl:value-of select="."/>
</pre></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="ABRState">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
ABRState
</a>
</xsl:if>
<div id="{generate-id()}">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select="*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="ABREvents">
<xsl:if test="count(../*) > 3">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
ABREvents
</a>
</xsl:if>
<div id="{generate-id()}">
<table class="purple">
<tr><th colspan="7">ABR Event History</th></tr>
<tr><th>Timestamp</th><th>Bitrate</th><th>SegAhead(SA)</th><th>AvgRate(a)</th><th>InstRate(r)</th><th>Cond(S|fS|Bh|Bl)</th><th>Happy</th></tr>
<xsl:for-each select="EventEntry">
<tr style="text-align:center; vertical-align:middle">
<td><xsl:value-of select="@ts"/></td>
<td><xsl:value-of select="@br"/></td>
<td><xsl:value-of select="@sa"/></td>
<td><xsl:value-of select="@a"/></td>
<td><xsl:value-of select="@r"/></td>
<td><xsl:value-of select="@flags"/></td>
<td><xsl:value-of select="@happy"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="BitrateStreams">
<xsl:if test="count(../*) > 3">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
BitrateStreams
</a>
</xsl:if>
<div id="{generate-id()}">
<table class="purple">
<tr><th colspan="4">Bitrate Streams</th></tr>
<tr><th>Bitrate</th><th>StreamIdx(A,R)</th><th>Codec</th><th>SegIdx</th></tr>
<xsl:for-each select="StreamEntry">
<tr style="text-align:center; vertical-align:middle">
<td><xsl:value-of select="@br"/></td>
<td><xsl:value-of select="@strm"/></td>
<td><xsl:value-of select="@codec"/></td>
<td><xsl:value-of select="@segidx"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="DashInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
MPEG DASH Streaming
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:for-each select=".//MPD">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
<xsl:apply-templates select="BitrateStreams"/>
<xsl:apply-templates select="ABRState"/>
<xsl:apply-templates select="ABREvents"/>
</div>
</xsl:template>

<xsl:template match="HLSInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
HLS Playlist Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:for-each select=".//HLS">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
<xsl:apply-templates select="BitrateStreams"/>
<xsl:apply-templates select="ABRState"/>
<xsl:apply-templates select="ABREvents"/>
</div>
</xsl:template>

<xsl:template match="EncryptedAudioInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Encrypted Audio Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table>
<xsl:for-each select=".//Counter">
<tr valign="top" bgcolor="#cccccc"><td align="left"><pre>
<xsl:value-of select="@name"/>:
<xsl:value-of select="."/>
</pre></td></tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="BTStatusInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Bluetooth Status Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:for-each select=".//BTStatusComponent">
<table class="purple" style="float: left;">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
</div>
</xsl:template>

<xsl:template match="HardwareStatusInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Hardware Status
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:for-each select=".//HW">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
<xsl:for-each select=".//HWMembers">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
<table class="purple">
<tr><th colspan="5">Feedback History</th></tr>
<tr><th>Timestamp</th><th>FeedbackType</th><th>OffsetMs</th><th>Volume</th><th>dB</th></tr>
<xsl:for-each select="AudioFeedbackHistory">
<xsl:if test="(@numFeedback='0')">
<tr><td colspan="5">No Feedback</td></tr>
</xsl:if>
</xsl:for-each>
<xsl:for-each select="AudioFeedbackHistory/FeedbackEntry">
<tr style="text-align:center; vertical-align:middle">
<td><xsl:value-of select="@ts"/></td>
<td><xsl:value-of select="@t"/></td>
<td><xsl:value-of select="@o"/></td>
<td><xsl:value-of select="@v"/></td>
<td><xsl:value-of select="@db"/></td>
</tr>
</xsl:for-each>
</table>
<xsl:for-each select=".//Faults">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
</div>
</xsl:template>

<xsl:template match="AnalogInInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Analog Input Status
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:for-each select=".//AnalogInStates">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>

</div>
</xsl:template>

<xsl:template match="Wireless">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Wireless Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:for-each select=".//WirelessInfo">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="@Name"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
</div>
</xsl:template>


<xsl:template match="RootCertBundleInfo">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Root Cert Bundle Info
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:for-each select=".//Bundles/*">
<table class="purple">
<tr><th colspan="2"><xsl:value-of select="local-name()"/></th></tr>
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
</div>
</xsl:template>

<xsl:template match="ReplicatedSettingsState">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Replicated Settings State
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<table class="purple">
<tr>
    <th>Setting</th>
    <th>Last Update Device</th>
    <th>Version</th>
</tr>
<xsl:for-each select=".//Setting">
<tr>
    <td><xsl:value-of select="@idx"/></td>
    <td><xsl:value-of select="@lud"/></td>
    <td><xsl:value-of select="@version"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="MuselibState">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Muselib State
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<h3 style="text-align:center; vertical-align:middle">Targets</h3>
<table class="purple">
<tr>
  <th>Target ID</th>
  <th>Connection Type</th>
  <th>Connection ID</th>
  <th>Subscriptions</th>
  <th>State</th>
  <th>Successful Reconnect Attempts</th>
  <th>Total Reconnect Attempts</th>
</tr>
<xsl:for-each select=".//Target">
<tr>
  <td><xsl:value-of select="tid"/></td>
  <td><xsl:value-of select="ctype"/></td>
  <td><xsl:value-of select="cid"/></td>
  <td><xsl:value-of select="subs"/></td>
  <td><xsl:value-of select="state"/></td>
  <td><xsl:value-of select="sra"/></td>
  <td><xsl:value-of select="tra"/></td>
</tr>
</xsl:for-each>
</table>
<h3 style="text-align:center; vertical-align:middle">Connections</h3>
<table class="purple">
<tr>
  <th>Target UUID</th>
  <th>Connection ID</th>
  <th>Original Connection ID</th>
  <th>Time Alive</th>
  <th>Setup Time (ms)</th>
  <th>Average Ping Time (ms)</th>
  <th>Alive</th>
  <th>Error</th>
</tr>
<xsl:for-each select=".//WebSocketConnection">
<tr>
  <td><xsl:value-of select="uuid"/></td>
  <td><xsl:value-of select="id"/></td>
  <td><xsl:value-of select="originalId"/></td>
  <td><xsl:value-of select="active"/></td>
  <td><xsl:value-of select="setup"/></td>
  <td><xsl:value-of select="ping"/></td>
  <td><xsl:value-of select="alive"/></td>
  <td><xsl:value-of select="error"/></td>
</tr>
</xsl:for-each>
</table>
</div>
</xsl:template>

<xsl:template match="SpeakerDetect">
<xsl:if test="count(../*) > 1">
<br/><a class="leftMargin">
<xsl:attribute name="href">javascript:toggle('<xsl:value-of select="generate-id()"/>')</xsl:attribute>
Speaker Detect
</a>
</xsl:if>
<div id="{generate-id()}">
<xsl:if test="count(../*) > 1">
<xsl:attribute name="style">display:none</xsl:attribute>
</xsl:if>
<xsl:for-each select=".//Output">
<table class="purple">
<xsl:for-each select=".//*">
<tr><td class="left"><xsl:value-of select="local-name()"/></td><td><xsl:apply-templates select="current()/text()"/></td></tr>
</xsl:for-each>
</table>
</xsl:for-each>
</div>
</xsl:template>

</xsl:stylesheet>
