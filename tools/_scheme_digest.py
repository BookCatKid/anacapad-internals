#!/usr/bin/env python3
"""For each URI-scheme record: enumerate every printf-variant literal and
every function that references a scheme-prefixed literal (the accepting
parsers/emitters), plus the compare vocabulary inside those functions.
Writes docs/_scheme_digest.json as a work artifact."""
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

# build lis+addi xref map over .text once: va -> [(pc, func)]
XREFS = {}
text_lo, text_hi = 0x10000000, 0x11000000
tf, tsz = None, 0
for v0, o0, sz in segs:
    if v0 <= text_lo < v0 + sz:
        tf, tva, tsz = o0, v0, sz
        break
arr = struct.unpack('>%dI' % (tsz // 4), d[tf:tf + tsz // 4 * 4])
hi = {}
for i, w in enumerate(arr):
    pc = tva + 4 * i
    op = w >> 26
    if op == 15:
        rt = (w >> 21) & 31
        ra = (w >> 16) & 31
        imm = ((w & 0xffff if w & 0x8000 == 0 else (w & 0xffff) - 0x10000) << 16) & 0xffffffff
        hi[rt] = ((hi.get(ra, 0) + imm) & 0xffffffff) if ra else imm
    elif op == 14:
        rt = (w >> 21) & 31
        ra = (w >> 16) & 31
        if ra in hi:
            va = (hi[ra] + (w & 0xffff if w & 0x8000 == 0 else (w & 0xffff) - 0x10000)) & 0xffffffff
            XREFS.setdefault(va, []).append(pc)
        hi.pop(rt, None)
print('xrefs:', len(XREFS), file=sys.stderr)

def digest_scheme(tok):
    """tok e.g. 'x-rincon-stream:' -> {variants, sites}"""
    out = {'variants': [], 'sites': {}}
    for m in re.finditer(re.escape(tok.encode()), d):
        f = m.start()
        e = d.find(b'\x00', f, f + 200)
        s = d[f:e]
        if not s or not all(32 <= c < 127 or c == 0 for c in s):
            continue
        va = va_of(f)
        if va is None:
            continue
        out['variants'].append((hex(va), s.decode(errors='replace')[:120]))
        for pc in XREFS.get(va, []):
            fn = fof(pc)
            out['sites'].setdefault(hex(fn), []).append(hex(pc))
    return out

D = json.load(open('docs/documentation.json'))
SCHEMES = {
    'x-rincon-queue': 'x-rincon-queue:',
    'x-rincon-stream': 'x-rincon-stream:',
    'x-rincon-mp3radio': 'x-rincon-mp3radio://',
    'x-rincon-buzzer': 'x-rincon-buzzer:',
    'x-rincon-cpcontainer': 'x-rincon-cpcontainer:',
    'x-sonos-vli': 'x-sonos-vli:',
    'x-sonos-misc': 'x-sonos-',
    'x-rincon-configmode-sonar': 'x-rincon-configmode:',
    'x-rincon-playlist': 'x-rincon-playlist:',
    'sonos-schemes': 'sonos:',
    'sonos_queue_track_uri': 'x-rincon-queue:',
    'sonos_albumart_path': '/getaa',
    'explore_scheme': 'explore:',
    'rdradio_scheme': 'rdradio:',
    'x-sonosapi-radio': 'x-sonosapi-radio:',
    'spotify_scheme': 'spotify:',
    'pndrradioad': 'pndrradioad:',
    'hls-radio': 'hls-radio:',
    'hls-aac': 'hls-aac:',
    'hls_radio': 'hls:',
    'stub': 'stub://',
    'stub_scheme': 'stub://',
    'hm': 'hm:',
    'sonos_com-hls-radio': 'sonos.com-hls-radio:',
    'pandora_com-pndrradioad': 'pandora.com-pndrradioad:',
    'x-sonosapi-*': 'x-sonosapi-',
    'skd': 'skd:',
    'oauth_jwt_urn': 'urn:sonos:',
    'rinconnetworks_urn': 'rinconnetworks:',
    'misc_schemes': 'x-sonosprog-',
    'x-sonos-spotify': 'x-sonos-spotify:',
    'sonos_settings_rest': '/settings/',
}
res = {}
for key, tok in SCHEMES.items():
    if key in (D.get('uri_formats') or {}):
        res[key] = digest_scheme(tok)
        print(key, len(res[key]['variants']), 'lits,',
              len(res[key]['sites']), 'fns', file=sys.stderr)
json.dump(res, open('docs/_scheme_digest.json', 'w'), indent=1)
