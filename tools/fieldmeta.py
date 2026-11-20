#!/usr/bin/env python3
"""Extract f_109cc8f4 field-registration triples per caller.

Each callsite passes r3=model, r4=name ptr, r5=tag u8, r6=flag u8.
Forward-emulates each caller once: addis/addi/ori constant chains,
the bcl/mflr/lwz-embedded/add PIC idiom, and lwz rd,off(addr) loads
of rodata/got2 pointers. Output: {caller_va: [{va, name, tag, flag}]}"""
import os, sys, struct, bisect, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import extract_soap_api as X

ELF = os.environ.get("ANACAPAD", "reference/public/files/opt/bin/anacapad")
elf = X.Elf(ELF)
t = X.Text(elf)
data = t.words
def W(i): return struct.unpack_from(">I", data, i * 4)[0]

starts = set()
for i in range(t.size // 4):
    w = W(i)
    if (w >> 16) == 0x9421: starts.add(t.base + i * 4)
    if w >> 26 == 18:
        imm = w & 0x3fffffc
        if imm & 0x2000000: imm -= 0x4000000
        tgt = t.base + i * 4 + imm
        if t.base <= tgt < t.base + t.size: starts.add(tgt)
fstarts = sorted(starts)
def func_of(a):
    i = bisect.bisect_right(fstarts, a) - 1
    return fstarts[i] if i >= 0 else 0
def func_end(f):
    i = bisect.bisect_right(fstarts, f)
    return fstarts[i] if i < len(fstarts) else t.base + t.size

sites_by_func = {}
for i in range(t.size // 4):
    w = W(i)
    if w >> 26 == 18 and (w & 1) == 1:
        imm = w & 0x3fffffc
        if imm & 0x2000000: imm -= 0x4000000
        va = t.base + i * 4
        if (va + imm) & 0xffffffff == 0x109cc8f4:
            sites_by_func.setdefault(func_of(va), []).append(va)

def mem32(va):
    """file image word at va, or None"""
    for s in elf.sects.values():
        if s["va"] <= va < s["va"] + s["size"]:
            off = s["off"] + (va - s["va"])
            return struct.unpack_from(">I", elf.data, off)[0]
    return None

out = {}
for f, sites in sites_by_func.items():
    regs = {}
    lr = None          # last link value (for PIC base)
    end = min(func_end(f), f + 0x8000)
    res = []
    pending = None
    i = (f - t.base) // 4
    while t.base + i * 4 < end:
        va = t.base + i * 4
        w = W(i); op = w >> 26
        if op == 15:  # addis/lis
            rd = (w >> 21) & 0x1f
            regs[rd] = ('hi', (w & 0xffff) << 16)
        elif op == 14:  # addi
            rd = (w >> 21) & 0x1f; ra = (w >> 16) & 0x1f; imm = w & 0xffff
            if imm >= 0x8000: imm -= 0x10000
            if ra == 0: regs[rd] = ('imm', imm)
            elif regs.get(ra, (0, 0))[0] in ('hi', 'addr', 'imm'):
                regs[rd] = ('addr', (regs[ra][1] + imm) & 0xffffffff)
            else: regs[rd] = ('unk', 0)
        elif op == 24:  # ori
            rd = (w >> 16) & 0x1f; rs = (w >> 21) & 0x1f
            if regs.get(rs, (0, 0))[0] == 'hi':
                regs[rd] = ('addr', regs[rs][1] | (w & 0xffff))
            else: regs[rd] = ('unk', 0)
        elif op == 32:  # lwz
            rd = (w >> 21) & 0x1f; ra = (w >> 16) & 0x1f; off = w & 0xffff
            if off >= 0x8000: off -= 0x10000
            if regs.get(ra, (0, 0))[0] in ('addr', 'imm'):
                mv = mem32((regs[ra][1] + off) & 0xffffffff)
                regs[rd] = ('addr', mv) if mv else ('unk', 0)
            else: regs[rd] = ('unk', 0)
        elif op == 18:
            if (w & 0x3fffffc) == 4 and (w & 3) == 1:  # bcl +4
                lr = va + 4
        elif op == 31:
            xo = (w >> 1) & 0x3ff
            if xo == 467 and ((w >> 11) & 0x3ff) == 0x1a0:  # mflr rd
                regs[(w >> 21) & 0x1f] = ('addr', lr) if lr else ('unk', 0)
            elif xo == 444:  # or (mr)
                rd = (w >> 21) & 0x1f; rs = (w >> 11) & 0x1f
                regs[rd] = regs.get(rs, ('unk', 0))
            elif xo == 266:  # add
                rd = (w >> 21) & 0x1f; ra = (w >> 16) & 0x1f; rb = (w >> 11) & 0x1f
                a, b = regs.get(ra, (0, 0)), regs.get(rb, (0, 0))
                if a[0] in ('addr', 'imm') and b[0] in ('addr', 'imm'):
                    regs[rd] = ('addr', (a[1] + b[1]) & 0xffffffff)
                else: regs[rd] = ('unk', 0)
            else:
                rd = (w >> 21) & 0x1f
                if rd in (4, 5, 6): regs[rd] = ('unk', 0)
        elif op == 18:  # bl: args clobbered conservatively? keep constants
            pass
        if op == 18 and (w & 1) == 1:  # bl
            imm = w & 0x3fffffc
            if imm & 0x2000000: imm -= 0x4000000
            tgt = (va + imm) & 0xffffffff
            if tgt != 0x109cc8f4:
                k, v = regs.get(4, ('?', 0))
                if k in ('addr', 'imm'):
                    s = elf.cstr(v, 60)
                    if s: pending = s
            else:
                pass
        if va in sites:
            res.append({'va': '0x%x' % va, 'name': pending,
                        'tag': regs.get(5, ('?', None))[1],
                        'flag': regs.get(6, ('?', None))[1]})
            pending = None
        i += 1
    out['0x%x' % f] = res

json.dump(out, open('/private/var/folders/7l/33mzrw897qs9grwfn6wld66h0000gn/T/opencode/fieldmeta.json', 'w'), indent=1)
nf = sum(len(v) for v in out.values())
named = sum(1 for v in out.values() for f in v if f['name'])
print('functions', len(out), 'fields', nf, 'named', named)
