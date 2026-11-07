import json, subprocess, numpy as np, os, re, wave
def movavg(x,k):
    c=np.cumsum(np.concatenate([[0.],x]));y=(c[k:]-c[:-k])/k;p=(len(x)-len(y));return np.concatenate([np.full(p//2,y[0]),y,np.full(p-p//2,y[-1])])
E=os.path.dirname(os.path.abspath(__file__)); SR=48000
TL=json.load(open(f'{E}/tl.json')); T=TL['total']; N=int(SR*(T+1))
def load(f):
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',f,'-f','f32le','-ac','2','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(raw,np.float32).reshape(-1,2).copy()
C={}
def sfx(n):
    if n not in C: a=load(f'{E}/sfx/{n}.mp3'); C[n]=a/(np.abs(a).max()+1e-9)*.9
    return C[n]
VO=np.zeros((N,2)); FX=np.zeros((N,2)); AMB=np.zeros((N,2)); MUS=np.zeros((N,2))
def put(bus,a,t,g=1.0,off=0.0,dur=None):
    a=a[int(off*SR):]; 
    if dur: a=a[:int(dur*SR)]
    i=int(t*SR)
    if i<0: a=a[-i:]; i=0
    n=min(len(a),N-i)
    if n>0: bus[i:i+n]+=a[:n]*g
def fx(n,t,g=.6,**k): put(FX,sfx(n),t,g,**k)
def level(x,target=.11):
    m=np.abs(x).max(1); act=x[m>.02]
    r=np.sqrt((act**2).mean()) if len(act) else 1
    return x*(target/(r+1e-9))
for a in TL['audio']:
    x=level(load(f"{E}/{a['f']}"))
    put(VO,x,a['t'],1.12 if '/n/' in a['f'] else 1.0)
segs=TL['segs']; rk=TL['ricky']
clean=lambda s:re.sub(r"[^a-z0-9\-']","",s.lower())
def W(seg,word,n=0):
    k=0
    for l in seg.get('lines',[]):
        for w in l.get('words',[]):
            if clean(w[0]).startswith(clean(word)):
                if k==n: return w[1]
                k+=1
    raise Exception(word)
def loop(bus,name,a,b,g):
    s=sfx(name); t=a
    while t<b:
        d=min(len(s)/SR,b-t); seg=s[:int(d*SR)].copy(); f=int(.3*SR)
        if len(seg)>2*f: seg[:f]*=np.linspace(0,1,f)[:,None]; seg[-f:]*=np.linspace(1,0,f)[:,None]
        put(bus,seg,t,g); t+=(d-.3) if d>1 else d+1
scn=lambda s:s.get('scenename') or s['scene']
prev=None
for s in segs:
    a,b,k=s['a'],s['b'],s['kind']; sc=scn(s)
    if prev and scn(prev)!=sc: fx('whoosh',a-.18,.45)
    prev=s
    amb={'studio':('studio',.25),'street':('amb',.35),'ocean':('ocean',.45),'space':('space',.4),'digital':('digital',.4),'sky':('wind',.45),'harbour':('harbour',.45),'station':('station',.4),'bush':('bush',.45)}.get(sc)
    if amb: loop(AMB,amb[0],a,b,amb[1])
    if k=='intro': fx('whooshbig',a,.6); fx('slam',a+.25,.7); [fx('pop',W(s,w),.5) for w in ('Seven','Ricky','do')]; fx('sparkle',a+.3,.35)
    if k=='tease': fx('sting',a+.05,.5); fx('pop',a+.9,.5)
    if k=='wipe': fx('whooshbig',a,.6); fx('slam',a+.35,.55)
    if k=='claim': fx('pop',a+.05,.45); tp=s['lines'][0]['b']; fx('pop',tp-.2,.5); fx('pop',tp,.5)
    if k=='lock':
        fx('stamp',a+.05,.6); c=s['count']
        for i in range(5): fx('tick',c+i,.7)
        fx('buzzer',c+5,.45); fx('flip',c+4.4,.4)
    if k=='reveal':
        st=s['stamp']; fx('drumroll',a,.7,dur=st-a+.05); fx('stamp',st,.9); fx('slam',st,.6); fx('ding',st+.05,.55); fx('sparkle',st+.1,.4); fx('flip',st+.45,.45)
        if s['pick']==s['verdict']: fx('cheer',st+.3,.5)
        else: fx('trombone',st+.55,.5)
    if k=='build' and sc=='street':
        fx('car',a,.85,off=1.9); fx('flash',a+4.1-.3,.8); tc=W(s,'caught')+.15; fx('whooshbig',tc-.7,.5); fx('car',tc-2.6,.6,off=0); fx('flash',tc-.3,.8)
        fx('pop',W(s,'Finland'),.4); fx('pop',W(s,'day-fines'),.45); fx('pop',W(s,'bigger'),.4); fx('pop',W(s,'rich'),.4)
    if k=='why' and sc=='street':
        o=W(s,'one'); fx('whoosh',o-.35,.5); fx('slam',o+.25,.8); fx('flash',a,.5); fx('pop',W(s,'income'),.4)
    if k=='build' and sc=='ocean':
        fx('whooshbig',a+.1,.4); fx('bubbles',a+1.4,.5); fx('pop',W(s,'fish'),.4); fx('whooshbig',W(s,'breathe')-.2,.4); fx('bubbles',W(s,'breathe'),.6)
        fx('dolphin',a+2,.35); fx('pop',W(s,'blowhole'),.4); fx('bubbles',W(s,'take'),.6); fx('pop',W(s,'choice'),.4); fx('pop',W(s,'tired'),.45)
    if k=='why' and sc=='ocean': fx('dolphin',a+.4,.3); fx('pop',W(s,'half'),.45); fx('sparkle',W(s,'half'),.35); fx('pop',W(s,'eye'),.45)
    if k=='build' and sc=='space':
        fx('sparkle',W(s,'spin'),.4); fx('whooshbig',W(s,'year'),.45); fx('sparkle',W(s,'lap'),.4); fx('whooshbig',W(s,'Venus')+.2,.4); fx('pop',W(s,'shorter'),.4); fx('pop',W(s,'slowly'),.45); fx('whooshbig',W(s,'which')+.2,.4); fx('pop',W(s,'which'),.4)
    if k=='why' and sc=='space': fx('pop',W(s,'two'),.4); fx('pop',W(s,'two',1),.4); fx('whoosh',W(s,'backwards'),.5); fx('sparkle',W(s,'backwards'),.4); fx('pop',W(s,'west'),.45)
    if k=='build' and sc=='digital':
        for wd in ('weather','directions','song','fact'): fx('typing',W(s,wd),.45,dur=.7); fx('pop',W(s,wd),.35)
        fx('whooshbig',W(s,'Billions'),.45); fx('pop',W(s,'type'),.4); fx('pop',W(s,'day'),.45)
    if k=='why' and sc=='digital': fx('pop',W(s,'false'),.45); fx('pop',W(s,'five'),.45); fx('counter',W(s,'thirteen')-.3,.5); fx('ding',W(s,'thirteen')+2.2,.4)
    if k=='build' and sc=='sky':
        fx('whooshbig',W(s,'droplets')-.4,.45); fx('sparkle',W(s,'droplets'),.35); fx('pop',W(s,'dust'),.4); fx('whooshbig',W(s,'billions'),.4); fx('whooshbig',W(s,'scale')-.4,.45); fx('slam',W(s,'scale')+.8,.5); fx('pop',W(s,'heavy'),.45)
    if k=='why' and sc=='sky':
        te=W(s,'elephants'); fx('pop',W(s,'five'),.4); fx('trumpet',te-1.2,.5)
        for i in range(10): fx('plonk',te-1.2+i*.16,.3)
        fx('trumpet',te+.6,.4); fx('whoosh',W(s,'floats'),.45); fx('pop',W(s,'rising'),.4)
    if k=='build' and sc=='harbour':
        fx('pop',W(s,'1896'),.5); fx('pop',W(s,'Britain'),.4); fx('pop',W(s,'Zanzibar'),.4); fx('whoosh',W(s,'deadline')-.3,.45); fx('tick',W(s,'deadline'),.5); fx('bell',W(s,'ran'),.55)
        fx('cannon',W(s,'guns'),.75); fx('cannon',W(s,'guns')+2.2,.6); fx('pop',W(s,'long'),.45)
    if k=='why' and sc=='harbour': fx('cannon',a,.5); fx('counter',W(s,'thirty-eight')-.2,.4); fx('pop',W(s,'thirty-eight'),.45); fx('pop',W(s,'shortest'),.45)
    if k=='build' and sc=='station': fx('pop',W(s,'gravity'),.4); fx('whooshbig',W(s,'station')-.4,.5); fx('pop',W(s,'almost'),.4); fx('pop',W(s,'body'),.45)
    if k=='why' and sc=='station': fx('grow',W(s,'grow'),.55); fx('pop',W(s,'three'),.45); fx('whoosh',W(s,'back'),.45)
    if k=='build' and sc=='bush': fx('waddle',a+.3,.5); fx('waddle',a+1.8,.5); fx('pop',W(s,'Australia'),.4); fx('pop',W(s,'poop'),.45); fx('pop',W(s,'shape'),.45)
    if k=='why' and sc=='bush':
        for i in range(5): fx('plonk',a+.15+i*.12,.35)
        fx('pop',W(s,'cubes'),.5); fx('sparkle',W(s,'cubes'),.35); fx('pop',W(s,'gut'),.4); fx('whoosh',W(s,'bum')-.5,.4); fx('pop',W(s,'bum'),.45)
    if k=='outro': fx('sting',a+.1,.55); fx('pop',a+.5,.5); fx('ooh',a+1.2,.35)
    if k=='end': fx('whooshbig',a,.5); fx('pop',a+.5,.5); fx('pop',a+.8,.5)
# Ricky shows: pause click in/out, box pop
for sh in rk['show']:
    if sh['type']=='pause': fx('click',sh['a']-.05,.6); fx('click',sh['b']-.15,.45)
    if sh['type']=='box': fx('pop',sh['a'],.35)
# music: loop, duck under voice, drop out on drumrolls
m=load(f'{E}/sfx/music.mp3'); m/=np.abs(m).max()+1e-9; L=len(m); x=np.arange(N)%L; MUS=m[x]*1.0
vo_env=np.abs(VO).max(1); k=int(.25*SR); act=movavg((vo_env>.02).astype(float),k)>.01
g=np.where(act,.055,.2).astype(float)
for s in segs:
    if s['kind']=='reveal': g[int(s['a']*SR):int((s['stamp']+.6)*SR)]=0.0
    if s['kind']=='lock': g[int(s['count']*SR):int((s['count']+5)*SR)]*=.5
g=movavg(g,int(.15*SR))
MUS*=g[:,None]
amb_g=np.where(act,.35,.6)[:,None]
mix=VO*1.0+FX*.7+AMB*amb_g+MUS
fo=int(1.2*SR); end=int(T*SR); mix[end-fo:end]*=np.linspace(1,0,fo)[:,None]; mix[end:]=0
mix=np.tanh(mix*1.1)/np.tanh(1.1)
out=(np.clip(mix,-1,1)*32767).astype(np.int16)
with wave.open(f'{E}/mix.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print('mixed',round(T,2),'s')
