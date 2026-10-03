import json
D=json.load(open('docs/documentation.json'))
r=D['shared_primitives']['xml_schema_clusters']
r['decomposed']={
 "cloudconfig.json":"FeatureConfigManager/RFeatureConfigManager feature-flag store: fields {swVersion,hwVersion}; three-tier load precedence: cloudconfig_override.json ('Using override config') > cloud-cached ('Using %s cloud-cached config','Error parsing cached config','stale' marker) > cloud-persisted ('Using cloud-persisted config'); fetched with 'cache-control: no-cache'; 'Error parsing feature config.'",
 "householdsettings.json":"hhsettingsfile: fields {fileVersion,fileSchemaVersion,householdSettings,userMetricsTracking,restricted-admin,'frozen:1','auto:%u'}; guards 'Attempt to set swgen to an invalid value','Input string too long. Returning VALUE_INVALID'; NOTE literal: 'ALERT! Display of these settings on status page (/householdsettings.json) needs to be addressed' - the file doubles as a status page",
 "zones.json":"zones_storage/ZonesStorage: {schemaVersion,counter} header + zone defs {name,id,channelMap}; lifecycle 'loading saved zones during setup succeeded'/'saved zones successfully migrated during setup'/'creating new zones config file'; 'created new zone: name/id/channelMap'; 'reached maximum zone definitions'; remote writes 'remote settings change: gainTrimDB [%.2f] on %s'",
 "alarmclock.xml":"sysclock/alarm store: {TimeSource,DailyIndexRefresh,NTPTimeOffset (timeDiff + pbLargeAdjustmentMade),AutoAdjustDst,StartTime,Recurrence} + the alarm element set from alarm_persist_writer; companion sysclock_state file ('Read \"%s\" from sysclock_state file','sysclock_state file is corrupt')",
 "zpMetricsConfigV2.xml":"conf/zpMetricsConfigV2.xml + zpMetricsConfigV2.meta: {metricsConfig,failReason} wrapped in <Incoming>; drives 'Begin discovery mode %d'",
 "LedPattern":"<LedPatternInfo> containing <LedPatternEntry time=\"%s\" led_ids=\"%08x\" repeats=\"%u\" steps=\"%u\"> entries; led_set_resumeDefaultLedPattern(Flash) restores saved pattern when bFlashMode",
 "RadioStationLog":"'<RadioStationLog>'-wrapped station-play log (radiolog.cxx)",
 "PerformanceCounter":"<PerformanceCounterTables> root for the perfcounter XML dump",
 "household_state_machine":"nearby household-HHID states {first household, No valid HHID, wrong household - mismatched HHID in localsetting and netsetting, lost household - no HHID in netsetting, newHHDebug,'household ID changed to %s'} + tunnel flags {x-sonos-upnp-tunnel, tunnel, insecureUpnpAllowed}",
}
r['todo']=["Established: every catalogued file schema decomposed - cloudconfig 3-tier precedence, householdsettings fields + the status-page alert, zones defs+lifecycle, alarmclock fields, zpMetricsConfig Incoming wrapper, LedPattern/LedPatternInfo entry grammar, RadioStationLog wrapper, PerformanceCounterTables root, household HHID state vocabulary.",
 "Remaining: per-element cardinality inside each schema (which fields repeat) - bounded by the parsers' loops."]
json.dump(D,open('docs/documentation.json','w'),indent=1)
print('ok')
