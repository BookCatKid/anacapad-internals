#!/usr/bin/env python3
"""Bind state vars to backing fields: xref the var-name literal, find the
emitter fn, then capture the value-producing instruction (load/arith on the
state object) between startElem(name) and write(value)."""
import sys, struct, json, bisect, re
sys.path.insert(0, '.')
import extract_soap_api as X

elf = X.Elf('reference/public/files/opt/bin/anacapad')
d = elf.data
S, E = X.build_funcmap(elf)
Ss = sorted(S)
segs = [(ph['va'], ph['off'], ph['fsz']) for ph in elf.phdrs if ph['type'] == 1]

def va_of(off):
    for v0, o0, sz in segs:
        if o0 <= off < o0 + sz:
            return v0 + off - o0
    return None

def fnext(fn):
    i = bisect.bisect_right(Ss, fn)
    return Ss[i] if i < len(Ss) else fn + 0x800

def fof(a):
    i = bisect.bisect_right(Ss, a) - 1
    return Ss[i] if i >= 0 else None

XREFS = {}
for v0, o0, sz in segs:
    if v0 <= 0x10000000 < v0 + sz:
        tf, tva, tsz = o0, v0, sz
        break
arr = struct.unpack('>%dI' % (tsz // 4), d[tf:tf + tsz // 4 * 4])
hi = {}
for i, w in enumerate(arr):
    pc = tva + 4 * i
    op = w >> 26
    if op == 15:
        rt = (w >> 21) & 31; ra = (w >> 16) & 31
        imm = ((w & 0xffff if w & 0x8000 == 0 else (w & 0xffff) - 0x10000) << 16) & 0xffffffff
        hi[rt] = ((hi.get(ra, 0) + imm) & 0xffffffff) if ra else imm
    elif op == 14:
        rt = (w >> 21) & 31; ra = (w >> 16) & 31
        if ra in hi:
            va = (hi[ra] + (w & 0xffff if w & 0x8000 == 0 else (w & 0xffff) - 0x10000)) & 0xffffffff
            XREFS.setdefault(va, []).append(pc)
        hi.pop(rt, None)
print('xrefs built', file=sys.stderr)

OPS = {32: 'lwz', 34: 'lbz', 40: 'lhz', 42: 'lha', 35: 'lbu'}

def field_after(fn, pc):
    """From xref pc of the name literal, scan forward: the value arg (r4)
    built before the next bl is the backing-field expression."""
    end = fnext(fn)
    a = pc
    steps = 0
    exprs = []
    while a < end and steps < 30:
        f = elf.v2f(a)
        w = struct.unpack('>I', d[f:f + 4])[0]
        op = w >> 26
        if op == 18 and (w & 3) == 1:  # bl -> element call boundary
            steps = 0 if not exprs else 99
            if exprs:
                return exprs
        elif op in OPS:
            rt = (w >> 21) & 31; ra = (w >> 16) & 31; imm = w & 0xffff
            if rt in (4, 9, 10) and ra in (3, 30, 31) and imm > 0x40:
                exprs.append((hex(a), OPS[op], hex(imm)))
        elif op == 14:
            rt = (w >> 21) & 31; ra = (w >> 16) & 31; imm = w & 0xffff
            if imm & 0x8000:
                imm -= 0x10000
            if rt == 4 and exprs:
                exprs.append((hex(a), 'addi', hex(imm)))
        a += 4
        steps += 1
    return exprs

D = json.load(open('docs/documentation.json'))
out = {}
for k, v in (D.get('state_variables') or {}).items():
    t = v.get('todo') or []
    if not t or 'LastChange/update emitter' not in str(t[-1]):
        continue
    var = k.split('.')[-1]
    hits = []
    for m in re.finditer(re.escape(var.encode()) + rb'\x00', d):
        va = va_of(m.start())
        if va and XREFS.get(va):
            hits.append(va)
    rec = {'name_lits': [hex(h) for h in hits[:6]], 'fields': []}
    for va in hits[:4]:
        for pc in XREFS.get(va, []):
            fn = fof(pc)
            fld = field_after(fn, pc)
            if fld:
                rec['fields'].append({'fn': hex(fn), 'pc': hex(pc),
                                      'loads': fld})
    out[k] = rec
json.dump(out, open('docs/_emitter_fields.json', 'w'), indent=1)
for k, v in out.items():
    print(k, '->', v['fields'][:2])
