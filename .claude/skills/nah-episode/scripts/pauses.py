import re, numpy as np, json, subprocess, wave, os, sys
R=sys.argv[1]; SR=44100; FPS=30
tl=json.load(open(os.path.join(R,'tl_full.json')))
w=wave.open(os.path.join(R,'mix.wav')); M=np.frombuffer(w.readframes(w.getnframes()),np.int16).reshape(-1,2).T.astype(float)/32768
FR_ALL=[3.85,7.925,15.32,19.2]; SEL=[int(x) for x in os.environ.get('SEL','0,1,2,3').split(',')]; FR=[FR_ALL[i] for i in SEL]; LEAD,TAIL=.5,.45; rng=np.random.default_rng(5); SUF=os.environ.get('SUF','')
def tt(d): return np.arange(int(d*SR))/SR
def glide(f0,f1,d): t=tt(d); f=f0*(f1/f0)**(t/d); return np.sin(2*np.pi*np.cumsum(f)/SR)
def click(): return rng.standard_normal(int(.012*SR))*np.exp(-tt(.012)*500)*.3
def fade(x,n=300):
    x=x.copy(); r=np.linspace(0,1,min(n,x.shape[-1])); x[...,:len(r)]*=r; x[...,-len(r):]*=r[::-1]; return x
out=[]; fz=[]; qwords=[]; cur=0; T=0; qm=[]
for i,tv in enumerate(FR):
    out.append(fade(M[:,int(cur*SR):int(tv*SR)])); T+=tv-cur
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',os.path.join(R,'vo_q',f'{SEL[i]:02d}_K.mp3'),'-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    q=np.frombuffer(raw,np.int16).astype(float)/32768; q=q/np.max(np.abs(q))*.85
    dur=LEAD+len(q)/SR+TAIL; n=int(dur*SR); seg=np.zeros((2,n))
    seg+=np.convolve(rng.standard_normal(n),np.ones(30)/30,'same')*.015
    c=click(); seg[:,:len(c)]+=c; ts=glide(220,40,.3)*np.exp(-tt(.3)*6)*.2; seg[:,200:200+len(ts)]+=ts
    k=int(LEAD*SR); seg[:,k:k+len(q)]+=q; c=click(); e=n-int(.12*SR); seg[:,e:e+len(c)]+=c
    out.append(fade(seg)); fz.append({'tv':tv,'T0':T,'dur':dur,'line':SEL[i],'lead':LEAD,'len':len(q)/SR})
    al=json.load(open(os.path.join(R,'vo_q',f'{SEL[i]:02d}_K.json'))); wd=''; ws=0
    for ch,a,b in zip(al['characters'],al['character_start_times_seconds'],al['character_end_times_seconds']):
        if ch.isspace():
            if wd: qwords.append([re.sub(r'\[[^\]]*\]','',wd),round(T+LEAD+ws,3),round(T+LEAD+we,3),'K',100+SEL[i]]); wd=''
        else:
            if not wd: ws=a
            wd+=ch; we=b
    if wd: qwords.append([re.sub(r'\[[^\]]*\]','',wd),round(T+LEAD+ws,3),round(T+LEAD+we,3),'K',100+SEL[i]])
    qm.append((T+LEAD,q)); T+=dur; cur=tv
out.append(fade(M[:,int(cur*SR):])); T+=M.shape[1]/SR-cur
mix=np.concatenate(out,1); mix=mix/np.max(np.abs(mix))*.95
with wave.open(os.path.join(R,'final'+SUF+'.wav'),'wb') as w2: w2.setnchannels(2);w2.setsampwidth(2);w2.setframerate(SR);w2.writeframes((mix.T*32767).astype(np.int16).tobytes())
mo=np.zeros(int(T*FPS)+2)
for st,q in qm:
    for f in range(int(st*FPS),int((st+len(q)/SR)*FPS)+1):
        a=int((f/FPS-st)*SR)
        if 0<=a<len(q): mo[f]=np.sqrt(np.mean(q[a:a+SR//FPS]**2))
mo=np.clip(mo/np.percentile(mo[mo>0],90),0,1)
qwords=[w for w in qwords if w[0].strip('.')!='']  # TAGFILTER
tl['freezes']=fz; tl['qwords']=qwords; tl['qmouth']=[round(float(x),3) for x in mo]; tl['totalReal']=T
json.dump(tl,open(os.path.join(R,'tl_real'+SUF+'.json'),'w')); print('real total',round(T,2),[round(f['dur'],2) for f in fz])
