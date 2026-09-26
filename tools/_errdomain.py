import subprocess,re,sys,json
def errcodes(addr):
    out=subprocess.run(["python3","tools/disas.py",hex(addr)],capture_output=True,text=True).stdout
    codes=set()
    for l in out.splitlines():
        parts=l.split(None,1)
        if len(parts)<2: continue
        ins=parts[1]
        m=re.search(r'\b(?:li|addi)\s+r\d+,\s*(-?0x[0-9a-f]+|-?\d+)\(r0\)',ins) or re.search(r'\bli\s+r\d+,\s*(-?0x[0-9a-f]+|-?\d+)\b',ins)
        if m:
            v=m.group(1); v=int(v,16) if v.startswith('0x') else int(v)
            if v>=100 or v<-20: codes.add(v)  # error-band only
    return sorted(codes),len(out.splitlines())
d=json.load(open("docs/documentation.json"))
fns=set()
def grab(o):
    if isinstance(o,dict):
        for v in o.values(): grab(v)
    elif isinstance(o,list):
        for v in o: grab(v)
    elif isinstance(o,str):
        for m in re.finditer(r'\bf_([0-9a-f]{8})\b|\b(0x10[0-9a-f]{6})\b',o):
            a=m.group(1) or m.group(2)
            a=a if a.startswith('0x') else '0x'+a
            fns.add(int(a,16))
grab(d)
fns=sorted(fns)
print(len(fns),"worker fns referenced")
for a in fns:
    c,n=errcodes(a)
    if c: print(f"0x{a:x}: err {c}")
