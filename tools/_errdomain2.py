import re,sys,json
sys.path.insert(0,"tools")
import disas as D
D.init()
elf=D._elf
_SSET=set(D._starts)
TEXT_LO,TEXT_HI=0x10000000,0x11000000
def fn_body(start):
    pc=start; insns=[]
    for _ in range(3000):
        w=elf.u32(pc)
        if w is None: break
        insns.append((pc,w))
        if w in (0x4e800020,0x4e800420): break
        pc+=4
        if pc in _SSET and pc!=start: break
    return insns
def errcodes(start):
    codes=set()
    for pc,w in fn_body(start):
        op=w>>26
        if op==14:  # addi/li
            ra=(w>>16)&0x1f; simm=w&0xffff
            if simm&0x8000: simm-=0x10000
            if ra==0 and (simm>=100 or simm<=-20): codes.add(simm)
        elif op==24:  # ori
            imm=w&0xffff
            if 100<=imm<=1300: codes.add(imm)
        elif op==25:  # oris (hi16 of a 32-bit li)
            imm=w&0xffff
            if 100<=imm<=1300: codes.add(imm<<16 if False else imm)
    return sorted(codes)
d=json.load(open("docs/documentation.json"))
fns=set()
def grab(o):
    if isinstance(o,dict):
        for v in o.values(): grab(v)
    elif isinstance(o,list):
        for v in o: grab(v)
    elif isinstance(o,str):
        for m in re.finditer(r'\bf_([0-9a-f]{8})\b|\b(0x10[0-9a-f]{6})\b',o):
            a=m.group(1) or m.group(2); a=a if a.startswith('0x') else '0x'+a
            fns.add(int(a,16))
grab(d)
fns=[a for a in sorted(fns) if TEXT_LO<a<TEXT_HI]
print(len(fns),"fns")
for a in fns:
    c=errcodes(a)
    if c: print(f"0x{a:x}: {c}")
