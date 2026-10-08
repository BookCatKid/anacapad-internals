import sys, json, os, signal
def _timeout(signum, frame):
    raise TimeoutError
sys.path.insert(0,'tools'); sys.path.insert(0,'.')
import extract_soap_api as X

lo_i, hi_i, tag = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
elf = X.Elf("reference/public/files/opt/bin/anacapad")
text = X.Text(elf)
starts, extents = X.build_funcmap(elf)
plt = elf.plt_names
fns = sorted(extents)[lo_i:hi_i]
out = {}
for i, f in enumerate(fns):
    em = X.emu(elf, text, starts, extents, f, plt)
    if i % 500 == 0:
        print("  %d/%d" % (i, len(fns)), flush=True)
        X._EMU.clear()
    if em is None:
        continue
    for pc, kind, ev in em.events:
        if kind != "store":
            continue
        # vstr can recurse pathologically on deep expressions; bound it
        def _vstr(v):
            prev = signal.setitimer(signal.ITIMER_REAL, 5)
            try:
                return X.vstr(v)
            except TimeoutError:
                return "<deep-expr>"
            finally:
                signal.setitimer(signal.ITIMER_REAL, 0)
        signal.signal(signal.SIGALRM, _timeout)
        b, k = X.flat_off(ev["addr"][0])
        kk = X.sgn32(ev["addr"][1])
        if not isinstance(k, int) or not isinstance(kk, int):
            continue
        off = (k + kk) & 0xFFFFFFFF
        if isinstance(b, tuple) and b[0] == "sdata":
            # record sdata-based stores too: sp spills are the
            # callee-visible arg/spill cells and r2/r13 globals
            bstr = "sdata:" + b[1]
        else:
            bstr = _vstr(b)
        src = ev.get("src")
        if src is None:
            continue
        out.setdefault(f"{off:#x}", []).append(
            {"fn": f"{f:#x}", "pc": f"{pc:#x}",
             "base": bstr, "src": _vstr(src)})
json.dump(out, open(f".scratch/xref_{tag}.json","w"))
print("chunk %s: %d offsets" % (tag, len(out)), flush=True)
