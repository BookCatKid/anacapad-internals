import json,sys,struct,re
sys.path.insert(0,'.')
import extract_soap_api as X
elf=X.Elf('reference/public/files/opt/bin/anacapad')
S,_=X.build_funcmap(elf)
S=set(a for a in S if 0x10000000<a<0x11000000)
t=elf.sects['.text']
tb=elf.data[t['off']:t['off']+t['size']]
n=t['size']//4
words=struct.unpack('>%dI'%n,tb)
va0=t['va']
starts=sorted(S)
idx={a:i for i,a in enumerate(starts)}
def fn_range(a):
    i=idx[a]
    lo=(a-va0)//4
    hi=((starts[i+1]-va0)//4) if i+1<len(starts) else n
    return lo,min(hi,lo+400)
def cstr(va):
    fo=elf.v2f(va)
    if fo is None: return None
    e=elf.data.find(b'\x00',fo,fo+120)
    if e<0: return None
    s=elf.data[fo:e]
    if 3<=len(s)<=110 and all(32<=c<127 for c in s): return s.decode()
def u32m(va):
    fo=elf.v2f(va)
    if fo is None or fo+4>len(elf.data): return None
    return struct.unpack('>I',elf.data[fo:fo+4])[0]
def scan(a):
    """string refs + direct-call targets for fn a"""
    lo,hi=fn_range(a)
    hi_reg={}
    strs=[]; calls=set()
    for j in range(lo,hi):
        w=words[j]
        if w==0x4e800020: break
        op=w>>26
        if op==15:
            hi_reg[(w>>21)&0x1f]=((w&0xffff)<<16)
        elif op in (14,24,32,36):
            rd=(w>>21)&0x1f; ra=(w>>16)&0x1f; imm=w&0xffff
            simm=imm-0x10000 if (imm&0x8000) else imm
            if ra==2:  # r2 = _SDA2_BASE_ = .got2+0x8000
                ea=(0x11093824+simm)&0xffffffff
                ptr=u32m(ea) if op==32 else ea
                if ptr and 0x10e00000<ptr<0x11000000:
                    s=cstr(ptr)
                    if s: strs.append(s)
            elif ra in hi_reg:
                va=(hi_reg[ra]+simm)&0xffffffff
                if 0x10e00000<va<0x11000000:
                    s=cstr(va)
                    if s: strs.append(s)
            if rd==ra: hi_reg.pop(rd,None)
        elif op==0x12 and w&1:
            simm=w&0x3fffffc
            if simm&0x2000000: simm-=0x4000000
            tgt=va0+j*4+simm
            if tgt in S: calls.add(tgt)
    return strs,calls
D=json.load(open('docs/documentation.json'))
m=D['shared_primitives']['startup']['init_array_map']
res={}
for ent,callees in m.items():
    found=[]
    frontier=[int(c.split('_')[-1],16) for c in callees]
    seen=set(frontier)
    for _ in range(6):
        nf=set()
        for a in frontier:
            if a not in idx: continue
            strs,calls=scan(a)
            cxx=[s for s in strs if s.endswith(('.cxx','.cpp','.cc','.h'))]
            if cxx: found += [s.split('/')[-1] for s in cxx]
            nf|=calls-seen
        seen|=nf; frontier=list(nf)
        if found: break
    if found: res[ent]=sorted(set(found))
print(len(res),'entries attributed via module paths')
for k in list(res)[:20]: print(k,res[k])
json.dump(res,open('docs/_init_names.json','w'),indent=1)
