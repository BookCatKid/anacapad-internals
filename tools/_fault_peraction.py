import json,sys,struct
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
    return lo,min(hi,lo+3000)
edges={}
lit={}
for a in starts:
    lo,hi=fn_range(a)
    tg=set(); codes=set()
    for j in range(lo,hi):
        w=words[j]
        if w==0x4e800020: break
        op=w>>26
        if op==0x12 and w&1:
            simm=w&0x3fffffc
            if simm&0x2000000: simm-=0x4000000
            tgt=va0+j*4+simm
            if tgt in S: tg.add(tgt)
        elif op==14:   # addi/li
            ra=(w>>16)&0x1f; simm=w&0xffff
            if simm&0x8000: simm-=0x10000
            if ra==0 and (100<=simm<=1300 or -3000<=simm<=-100):
                codes.add(simm)
        elif op==24:   # ori
            imm=w&0xffff
            if 100<=imm<=1300: codes.add(imm)
        elif op==25:   # oris
            imm=w&0xffff
            if 100<=imm<=1300: codes.add(imm)
    if tg: edges[a]=tg
    if codes: lit[a]=codes
print(len(edges),'fns with edges;',len(lit),'fns with error literals')
def reach(start,depth=6,cap=400):
    seen={start}; fr={start}
    for _ in range(depth):
        nf=set()
        for f in fr: nf|=edges.get(f,set())
        nf-=seen; fr=nf; seen|=nf
        if not fr or len(seen)>cap: break
    return seen
d=json.load(open('docs/documentation.json'))
out={}
for svc,sv in d['services'].items():
    for an,a in sv['actions'].items():
        h=a.get('handler_func') or a.get('handler')
        if not h: continue
        hi=int(h,16)
        if hi not in S: continue
        codes=set()
        for f in reach(hi): codes|=lit.get(f,set())
        if codes: out[svc+'/'+an]=sorted(codes)
json.dump(out,open('docs/_peraction_faults.json','w'),indent=0)
print(len(out),'actions with propagated codes')
