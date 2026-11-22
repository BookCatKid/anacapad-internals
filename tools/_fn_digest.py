#!/usr/bin/env python3
"""Produce a decompile digest for every internal_function with an open
'disassemble/decompile' todo: size, direct calls, string refs, stores,
compares, returns. Writes docs/_fn_digest.json."""
import sys, struct, json, bisect, re
sys.path.insert(0, '.')
import extract_soap_api as X

elf = X.Elf('reference/public/files/opt/bin/anacapad')
d = elf.data
S, E = X.build_funcmap(elf)
Ss = sorted(S)
segs = [(ph['va'], ph['off'], ph['fsz']) for ph in elf.phdrs if ph['type'] == 1]

def fnext(fn):
    i = bisect.bisect_right(Ss, fn)
    return Ss[i] if i < len(Ss) else fn + 0x800

def sstr(va):
    f = elf.v2f(va)
    if f is None:
        return None
    e = d.find(b'\x00', f, f + 90)
    s = d[f:e]
    return s.decode(errors='replace') if 0 < len(s) < 90 and all(
        32 <= c < 127 for c in s) else None

PLT = dict(getattr(elf, 'plt_names', {}) or {})
DYN = {}
try:
    for nm, va in elf.dynsyms.items():
        DYN[va] = nm
except Exception:
    pass

def name_of(tgt):
    if tgt in DYN:
        return DYN[tgt]
    return 'f_%x' % tgt

def digest(fn):
    end = fnext(fn)
    a = fn
    hi = {}
    calls, strs, stores, cmps, loads = [], [], [], [], []
    n = 0
    ret = None
    while a < end:
        f = elf.v2f(a)
        if f is None:
            break
        w = struct.unpack('>I', d[f:f + 4])[0]
        op = w >> 26
        n += 1
        if op == 15:
            rt = (w >> 21) & 31; ra = (w >> 16) & 31
            imm = ((w & 0xffff if w & 0x8000 == 0 else (w & 0xffff) - 0x10000) << 16) & 0xffffffff
            hi[rt] = ((hi.get(ra, 0) + imm) & 0xffffffff) if ra else imm
        elif op == 14:
            rt = (w >> 21) & 31; ra = (w >> 16) & 31
            va = (hi.get(ra, 0) + (w & 0xffff if w & 0x8000 == 0 else (w & 0xffff) - 0x10000)) & 0xffffffff
            hi[rt] = va
            s = sstr(va) if 0x10e00000 < va < 0x11000000 else None
            if s:
                strs.append(s[:70])
        elif op == 18 and (w & 3) == 1:
            tgt = (a + ((w & 0x3fffffc) - (0x4000000 if w & 0x2000000 else 0))) & 0xffffffff
            calls.append((hex(a), name_of(tgt)))
        elif op == 36 or op == 38:  # stw/stb-ish (36=stw 37=sth 38=stb 39=stu)
            pass
        if op == 36:
            rt = (w >> 21) & 31; ra = (w >> 16) & 31; imm = w & 0xffff
            if imm & 0x8000:
                imm -= 0x10000
            stores.append(hex(imm))
        if op in (10, 11):  # cmpwi/cmplwi
            cmps.append(hex(w & 0xffff))
        if op == 19 and w == 0x4e800020:
            ret = a
        a += 4
    return {'insns': n, 'calls': calls, 'strings': list(dict.fromkeys(strs))[:14],
            'stores': stores[:20], 'cmps': list(dict.fromkeys(cmps))[:16]}

D = json.load(open('docs/documentation.json'))
out = {}
for k, v in (D.get('internal_functions') or {}).items():
    t = v.get('todo') or []
    if not t:
        continue
    if re.search(r'(disassemble|decompile pass over) 0x', str(t[-1])):
        fn = int(k, 16) if str(k).startswith('0x') else None
        if fn:
            out[k] = digest(fn)
json.dump(out, open('docs/_fn_digest.json', 'w'), indent=1)
print(len(out), 'digested')
