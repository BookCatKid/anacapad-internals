import json
D=json.load(open('docs/documentation.json'))
r=D['shared_primitives']['misc_health']
r['longpress']=(
 "longpress.cxx (uTlongpressHandler, tag 'longpress'): the hold-button handler. "
 "Two duties: (1) safe-listening/volume restore ('restore system volume to safe "
 "listening level (%u)'); (2) GC-cycle playback: maintains an MRU list of household "
 "group coordinators ('Adding new GC [%s]:[%s] to list as [%s]','Moving GC [%s] to "
 "head of list','Removing GC [%s] from list','Updating last PAUSED/STOPPED GC in "
 "HH','Last GC in HH to change playback state is no longer cloneable') and "
 "long-press cycles it ('cycling to %s:%s','end of list reached','GC list - "
 "head/tail/current'): tries to steal AVT state from the target GC ('Attempting to "
 "steal AVT state from [%s:%s]','Could not get AVT control URI for remote GC',"
 "'Failed to fetch AVT state from GC %s - %d'), else groups to it ('Attempting to "
 "group to [%s:%s]','x-rincon:%s'), else falls back to local play ('Unable to play "
 "or steal from [%s:%s]. Falling back to playing local'). Side effects: "
 "'Pausing','Muting','Becoming standalone due to button press','Device not "
 "grouped','not joinable','Untracked GC action'.")
r['topology_events_report']=(
 "topology_events_report.cxx (conditionallyReportTopologyEvents/onEvent, tag "
 "'topology_events_report'): rate-limited ZGT property-change reporter ('Report "
 "Topology Events: %s', 'reported %ds ago:limit','err sec<0'). Emits "
 "TopologyEventsReportEvent records for: local role transitions ('%s was GM to "
 "loc, %u GMs','%s was SAT to loc, %u sats','GroupCoordinator before/after: "
 "%u/%u','evt loc grp role chg','gen plbk corr ctx chg evt'), property deltas "
 "('chmap change %s to %s','HTsat defn change','wifi mode change %u','connection "
 "type change','ch frq change','wifi on change','eth link change'), satellite "
 "checks ('chk sats of GMs %s'), and release accounting ('updt top rel','loc!=GC. "
 "rel=oth','nRel b/a:%u/%u','ev rel dev top set chg'). Guards: 'Unkown "
 "TopologyEventsReportEvent type','fail:unparse cid. quit report','%s player %s "
 "not local'; band labels '3f.x'/'5f.x'.")
r['todo']=[
 "Established: both bodies decoded - longpress = safe-volume restore + "
 "household-GC MRU cycle/steal/group fallback chain; topology_events_report = "
 "rate-limited property-delta event emitter with role-transition and 6 property "
 "watch classes.",
 "Remaining: the 3f.x/5f.x band-label semantics (likely 2.4/5GHz channel fields) "
 "- bounded by the format strings context in the emitter."]
json.dump(D,open('docs/documentation.json','w'),indent=1)
print('ok')
