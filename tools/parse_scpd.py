import xml.etree.ElementTree as ET, glob, json, sys, os
NS='{urn:schemas-upnp-org:service-1-0}'
def parse(path):
    try: r=ET.parse(path).getroot()
    except Exception as e: return None
    st=r.findtext('.//'+NS+'serviceType') or ""
    acts={}
    for a in r.iter(NS+'action'):
        name=a.findtext(NS+'name')
        ins=[];outs=[]
        for arg in a.iter(NS+'argument'):
            an=arg.findtext(NS+'name'); d=arg.findtext(NS+'direction'); rel=arg.findtext(NS+'relatedStateVariable')
            rec={"name":an,"direction":d,"relatedStateVariable":rel}
            if d=='in': ins.append(rec)
            elif d=='out': outs.append(rec)
        if name: acts[name]={"in":ins,"out":outs}
    svs={}
    for v in r.iter(NS+'stateVariable'):
        vn=v.findtext(NS+'name'); ty=v.findtext(NS+'dataType'); se=v.get('sendEvents')
        svs[vn]={"dataType":ty,"sendEvents":se}
    return {"serviceType":st,"actions":acts,"stateVariables":svs}
out={}
for f in sorted(glob.glob(sys.argv[1]+"/*.xml")):
    p=parse(f)
    if p and p["actions"]:
        out[os.path.basename(f)]=p
json.dump(out,open(sys.argv[2],"w"),indent=1)
for svc,p in out.items():
    ni=sum(len(a["in"]) for a in p["actions"].values())
    no=sum(len(a["out"]) for a in p["actions"].values())
    print(f"{svc:32} {p['serviceType']:58} acts={len(p['actions']):3} in={ni} out={no} vars={len(p['stateVariables'])}")
