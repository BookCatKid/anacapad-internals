import json
D=json.load(open('docs/documentation.json'))

r=D['shared_primitives']['usage_data_sharing']
r['key_surface']="usagedatasharing.cxx string set: keys {RUsageDataSharing, UMTracking} both compared against 'NoReport' - RUsageDataSharing is the R_* system-property form; UMTracking the replicated-key form read via vfunc+0xc at f_10577870"
r['value_vocabulary']="only distinguished value is 'NoReport' (opt-out sentinel) - any other/unset value opts in; no second literal appears in the module, so the accepted vocabulary is open-ended beyond the sentinel"
r['todo']=["Established: complete value vocabulary - 'NoReport' is the only distinguished literal; dual key surface {RUsageDataSharing R-prop, UMTracking replicated} both gated on the same sentinel.",
 "Remaining: none at this granularity - the gate, keys, sentinel, and consumers are fully decoded."]

n=D['shared_primitives']['native_protocols']
n['bluetooth_muse_bindings']={
 "paths":["v1/players/{playerId}/hardwareStatus/bluetooth",
          "v1/households/{householdId}/players/{playerId}/hardwareStatus/bluetooth",
          "v1/players/{playerId}/hardwareStatus/bluetoothPairing",
          "v1/households/{householdId}/players/{playerId}/hardwareStatus/bluetoothPairing"],
 "notes":"player-local and household-scoped forms of both topics; 'bluetooth:' prefix also present (auth/capability tag)"}
if n.get('todo'):
    n['todo']=[t.replace('the exact muse resource path bindings for the bluetooth topic names (which muse URL each topic registers)','DONE: bindings decoded - hardwareStatus/bluetooth + hardwareStatus/bluetoothPairing, each in player-local and household-scoped forms') for t in n['todo']]

json.dump(D,open('docs/documentation.json','w'),indent=1)
print('ok')
