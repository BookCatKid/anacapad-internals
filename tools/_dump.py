import sys
sys.path.insert(0, '.')
import extract_soap_api as X
elf = X.Elf('/Users/simon/MyDocuments/gpt/sonos-firmware-archive/artifacts/downloads/rootfs-86.10-80260-1-9/opt/bin/anacapad')
a = int(sys.argv[1], 16); b = int(sys.argv[2], 16)
for v in range(a, b, 4):
    w = elf.u32(v)
    s = X.string_at(elf, w) if 0x10e00000 < w < 0x10f40000 else ''
    fn = ''
    if 0x10000000 < w < 0x10e00000:
        import bisect
        st, _ = X.build_funcmap(elf)
        fn = ''
    print(hex(v), hex(w), s[:50])
