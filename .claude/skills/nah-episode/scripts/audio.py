import numpy as np, json, subprocess, wave, os, sys
R=sys.argv[1]; SR=44100; tl=json.load(open(os.path.join(R,'tl.json'))); DUR=tl['total']; N=int(SR*DUR)
rng=np.random.default_rng(11); SFX=np.zeros((2,N)); MUS=np.zeros((2,N)); VO=np.zeros(N)
def tt(d): return np.arange(int(d*SR))/SR
def add(sig,t0,g=1,pan=0,bus=SFX):
    i=int(t0*SR); n=min(len(sig),N-i)
    if n<=0: return
    bus[0,i:i+n]+=sig[:n]*g*np.sqrt((1-pan)/2)*1.414; bus[1,i:i+n]+=sig[:n]*g*np.sqrt((1+pan)/2)*1.414
def band(x,lo,hi):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); m=((f>=lo)&(f<=hi)).astype(float); m=np.convolve(m,np.ones(64)/64,'same'); return np.fft.irfft(X*m,len(x))
def noise(d): return rng.standard_normal(int(d*SR))
def norm(x): return x/(np.max(np.abs(x))+1e-9)
def env(n,a,d): t=np.arange(n)/SR; return np.minimum(1,t/max(a,1e-4))*np.exp(-np.maximum(0,t-a)/d)
def glide(f0,f1,d,c=1.0): t=tt(d); f=f0*(f1/f0)**((t/d)**c); return np.sin(2*np.pi*np.cumsum(f)/SR)
midi=lambda m:440*2**((m-69)/12)
def marimba(f,d=.5): t=tt(d); return (np.sin(2*np.pi*f*t)+.35*np.sin(2*np.pi*4*f*t)*np.exp(-t*30))*np.exp(-t*7)*np.minimum(1,t/.003)
def pluck(f,d=.45): t=tt(d); return (np.sign(np.sin(2*np.pi*f*t))*.3+np.sin(2*np.pi*f*t))*np.exp(-t*9)*np.minimum(1,t/.004)
def hat(d=.05): x=band(noise(d),6000,16000); return x*env(len(x),.001,.015)
def thud(): t=tt(.35); return np.sin(2*np.pi*(55+90*np.exp(-t*30))*t)*np.exp(-t*9)
def whoosh(d,lo=400,hi=5000): x=norm(band(noise(d),lo,hi)); u=np.linspace(0,1,len(x)); return x*np.sin(np.pi*u)**2
def bell(f,d=1,g=1): t=tt(d); return (np.sin(2*np.pi*f*t)+.5*np.sin(2*np.pi*2.76*f*t)*np.exp(-t*4))*np.exp(-t*3/d)*np.minimum(1,t/.002)*g
# music bed
bpm=116; beat=60/bpm; prog=[(48,[64,67,72]),(53,[65,69,72]),(55,[62,67,71]),(48,[64,67,72])]; mel=[72,76,79,76,74,72,74,67,72,76,79,81,79,76,74,72]
def bed(t0,t1,g=1):
    b=0;t=t0
    while t<t1:
        root,ch=prog[int(b//4)%4]; pos=b%4
        if pos in(0,2): add(pluck(midi(root)),t,.18*g,-.1,MUS)
        if pos in(1,3): [add(marimba(midi(n),.3),t,.05*g,.25,MUS) for n in ch]
        add(marimba(midi(mel[int(b*2)%16]),.28),t,.07*g,.1,MUS); add(hat(),t+beat/2,.03*g,.4,MUS); b+=1;t+=beat
c=tl['cues']; st=tl['start']
bed(0.15,c['end1']+.3); bed(c["It's true"]+.5,c['end5']+.3,.8)
# title: whoosh + slam + button pops
add(whoosh(.35),0.0,.35); add(thud(),0.38,.7)
for k,tp in enumerate([c['True or false'],c['True or false']+.18]): add(glide(500,900+200*k,.1)*env(int(.1*SR),.003,.04),tp,.25)
# buildup accents
add(glide(300,1200,.25)*env(int(.25*SR),.01,.1),c['Here on Earth']+.6,.15)
add(whoosh(.6,300,3000),c['A year is one lap']+.4,.25); add(bell(1568,.8),c['A year is one lap']+3.6,.12)
add(glide(900,1500,.15)*env(int(.15*SR),.005,.06),c['Venus is closer'],.18)
t0=c['really, really slowly']; add(glide(400,120,1.2,.5)*env(int(1.2*SR),.05,.6),t0,.12)  # slow-mo droop
for i in range(6): add(glide(600,640,.12)*env(int(.12*SR),.005,.05),c['So which takes longer']+.3+i*.4,.08)
# countdown
cd=c['end2']+.12
for i in range(5):
    t=tt(.08); tick=np.sin(2*np.pi*(1800 if i<4 else 2200)*t)*np.exp(-t*60); add(tick,cd+i,.35); t=tt(.06); add(np.sin(2*np.pi*900*t)*np.exp(-t*80),cd+i+.5,.18)
d=5.0; t=tt(d); drone=(np.sin(2*np.pi*55*t)+.5*np.sin(2*np.pi*110.5*t)+.3*np.sin(2*np.pi*(164+20*t/d)*t))*np.minimum(1,t/1.5)*np.minimum(1,(d-t)/.1); add(drone,cd,.09)
add(glide(1200,400,.25)*env(int(.25*SR),.005,.1),cd+5.0,.2)  # buzzer-ish drop
add(glide(400,800,.12)*env(int(.12*SR),.005,.05),st[3]+.05,.2)  # Kris pick boop
# drumroll -> stamp
rv=c["It's true"]-.3; tr=rv-.9
for k in range(40):
    tk=tr+.9*(1-(1-k/40)**1.6)
    if tk<rv: x=band(noise(.04),200,4000); add(x*env(len(x),.001,.012),tk,.25*(.5+.5*k/40))
add(thud(),rv,1.0); add(norm(band(noise(.4),2000,10000))*env(int(.4*SR),.002,.12),rv,.18)
add(bell(1046,1),rv+.05,.2); add(bell(1318,1),rv+.17,.2); add(bell(1568,1.2),rv+.29,.2)
for k,(f0,dd) in enumerate([(392,.32),(370,.32),(349,.32),(330,1.0)]):  # sad trombone for Kris
    t=tt(dd); f=f0*(1+.02*np.sin(2*np.pi*6*t)*(k==3)); s=np.sin(2*np.pi*np.cumsum(f)/SR); s=np.tanh(3*s+.6*np.sin(2*np.pi*2*np.cumsum(f)/SR)); add(s*env(len(t),.02,dd*.8),rv+.55+k*.34,.07)
add(glide(800,1600,.1)*env(int(.1*SR),.003,.04),c["It's true"]+.2,.15)  # score flip
add(np.flip(whoosh(.7,300,5000)),c['And it spins backwards']-.5,.3)
add(bell(2093,.9),c['Sun rises in the west'],.08); add(bell(2637,.9),c['Sun rises in the west']+.1,.06)
add(bell(2600,.5),c.get('Venus is just doing',c['end5']-.6)+.05,.1)
# round 2 sting
r2=c['end5']+.45; add(whoosh(.5),r2-.1,.35)
for k,n in enumerate([72,76,79,84]): add(marimba(midi(n),.6),r2+.35+k*.07,.2,.1)
add(thud(),r2+.4,.5)
# voices
lines=json.load(open(os.path.join(R,'lines.json'))); mouth=np.zeros(int(DUR*30)+1)
for i,(who,_) in enumerate(lines):
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',os.path.join(R,'vo',f'{i:02d}_{who}.mp3'),'-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    v=np.frombuffer(raw,np.int16).astype(float)/32768; v=v/np.max(np.abs(v))*.85; s0=int(st[i]*SR); n=min(len(v),N-s0); VO[s0:s0+n]+=v[:n]
    if who=='K':
        for f in range(int(st[i]*30),int((st[i]+len(v)/SR)*30)+1):
            a=int((f/30-st[i])*SR); 
            if 0<=a<len(v): mouth[f]=np.sqrt(np.mean(v[a:a+SR//30]**2))
nz=mouth[mouth>0]; mouth=np.clip(mouth/np.percentile(nz,90),0,1)
e=np.convolve(np.abs(VO),np.ones(int(.08*SR))/int(.08*SR),'same'); e=np.convolve(e,np.ones(int(.25*SR))/int(.25*SR),'same'); duck=1-.6*np.clip(e/.05,0,1)
mix=np.stack([VO,VO])+SFX+MUS*duck
mix=np.tanh(mix*1.1)/np.tanh(1.1); mix=mix/np.max(np.abs(mix))*.95; fl=int(.4*SR); mix[:,-fl:]*=np.linspace(1,0,fl)
with wave.open(os.path.join(R,'mix.wav'),'wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix.T*32767).astype(np.int16).tobytes())
tl['mouth']=[round(float(m),3) for m in mouth]; json.dump(tl,open(os.path.join(R,'tl_full.json'),'w')); print('ok',DUR)
