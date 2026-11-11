import sys,struct,json
sys.path.insert(0,'.')
import extract_soap_api as X
elf=X.Elf('reference/public/files/opt/bin/anacapad')
t=elf.sects['.text']; d=elf.data; va0=t['va']
nw=t['size']//4
words=struct.unpack('>%dI'%nw,d[t['off']:t['off']+t['size']])
def cstr(va):
    fo=elf.v2f(va)
    if fo is None: return None
    e=d.find(b'\0',fo,fo+64); s=d[fo:e]
    return s.decode() if 2<len(s)<60 and all(32<=c<127 for c in s) else None
lo=(0x1008e000-va0)//4; hi=(0x10090000-va0)//4
pairs=[]
for j in range(lo,hi):
    w=words[j]
    # pattern: addis r4,H ... addi r4,L(r4) within a few insns, plus an addis r9 (mask) nearby, ending in bl f_1008e76c
    if w>>26==15 and (w>>21)&0x1f==4 and (w>>16)&0x1f==0:
        h=w&0xffff
        for m in range(j+1,min(j+4,hi)):
            w3=words[m]
            if w3>>26==14 and (w3>>21)&0x1f==4 and (w3>>16)&0x1f==4:
                simm=w3&0xffff
                if simm&0x8000: simm-=0x10000
                va=(h<<16)+simm
                nm=cstr(va)
                if not nm: break
                # find mask: scan j..m+4 for addis/addi r9 or r10 non-stack imm
                mask=None
                for q in range(j,min(m+5,hi)):
                    wq=words[q]; op=wq>>26
                    rr=(wq>>21)&0x1f; ra=(wq>>16)&0x1f
                    if rr in (9,10) and ra==0 and op==15:
                        imm=wq&0xffff
                        mask=((imm-0x10000)<<16)&0xffffffff if imm&0x8000 else imm<<16
                    elif rr in (9,10) and ra==0 and op==14:
                        imm=wq&0xffff
                        mask=(imm-0x10000)&0xffffffff if imm&0x8000 else imm
                if mask is not None:
                    pairs.append((nm,mask))
                break
seen={}
for nm,bit in pairs: seen[nm]=bit
print(len(seen))
for nm,bit in sorted(seen.items(),key=lambda x:x[1]): print('0x%08x'%bit,nm)
json.dump({nm:'0x%08x'%b for nm,b in seen.items()},open('docs/_capbits.json','w'),indent=1)
