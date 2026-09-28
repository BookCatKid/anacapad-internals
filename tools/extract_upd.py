#!/usr/bin/env python3
"""Extract the embedded anacapad ELF from a Sonos .upd update container.
Scans for a big-endian PPC ELF header (0x7f E L F, class=1, data=2 BE,
machine=0x14 PPC) and extracts through the end of the section-header table."""
import sys,struct,os

def extract(upd_path, out_path):
    fb=open(upd_path,"rb").read()
    # scan for ELF magic
    off=0
    while True:
        i=fb.find(b"\x7fELF",off)
        if i<0:return None
        if i+0x34>len(fb):break
        # validate: class=1(32) data=2(BE) version=1 type=EXEC(2) machine=0x14(PPC)
        cls,dat,ver=fb[i+4],fb[i+5],fb[i+6]
        etype,mach=struct.unpack(">HH",fb[i+16:i+20])
        if cls==1 and dat==2 and etype==2 and mach==0x14:
            break
        off=i+1
    e_shoff=struct.unpack(">I",fb[i+32:i+36])[0]
    e_shentsize,e_shnum=struct.unpack(">HH",fb[i+46:i+50])
    extent=e_shoff+e_shentsize*e_shnum
    # sanity: also include any trailing non-ELF? just take through sht end
    blob=fb[i:i+extent]
    open(out_path,"wb").write(blob)
    return dict(offset=i,size=len(blob),entry=struct.unpack(">I",fb[i+24:i+28])[0],
                shoff=e_shoff,shnum=e_shnum,sha256=None)

if __name__=="__main__":
    upd,out=sys.argv[1],sys.argv[2]
    r=extract(upd,out)
    if r:print(f"extracted {out}: offset=0x{r['offset']:x} size={r['size']} entry=0x{r['entry']:x} sections={r['shnum']}")
    else:print("no PPC ELF found")
