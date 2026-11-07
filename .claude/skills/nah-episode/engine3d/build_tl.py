import json, os, re
E=os.path.dirname(os.path.abspath(__file__))
NL=json.load(open(f'{E}/narr.json')); KL=json.load(open(f'{E}/ricky.json'))
def al(who,i):
    d=json.load(open(f'{E}/vo/{who}/{i:02d}_{"N" if who=="n" else "K"}.json'))
    ch=d['characters'];a0=d['character_start_times_seconds'];a1=d['character_end_times_seconds']
    # speech start = first char outside tags that is a letter
    intag=False;s0=None
    for c,x in zip(ch,a0):
        if c=='[':intag=True
        if not intag and c.isalnum():s0=x;break
        if c==']':intag=False
    return ch,a0,a1,s0,a1[-1]
def vclass(c):
    c=c.lower()
    if c=='a':return'ah'
    if c in'eiy':return'ee'
    if c=='o':return'oh'
    if c in'uwq':return'oo'
    if c in'fv':return'fv'
    if c in'mbp':return'mbp'
    if c.isalpha():return'slight'
    return None
T=0.0; segs=[]; audio=[]; nwords=[]; rk={'poses':[{'t':0,'p':'h_smirk'}],'vis':[],'words':[],'show':[]}; cues={}
def words_of(ch,a0,a1,off):
    out=[];intag=False;w='';ws=0;we=0
    for c,x,y in zip(ch,a0,a1):
        if c=='[':intag=True
        if intag:
            if c==']':intag=False
            continue
        if c.isspace():
            if w:out.append([w,round(off+ws,3),round(off+we,3)]);w=''
        else:
            if not w:ws=x
            w+=c;we=y
    if w:out.append([w,round(off+ws,3),round(off+we,3)])
    return [x for x in out if x[0].strip('.')]
def N(i,cap=True):
    global T
    ch,a0,a1,s0,e=al('n',i);off=T-s0;audio.append({'f':f'vo/n/{i:02d}_N.mp3','t':round(off,3)})
    ws=words_of(ch,a0,a1,off)
    if cap:nwords.extend(ws)
    a=T;T=off+e;return {'who':'N','i':i,'a':round(a,3),'b':round(T,3),'words':ws}
def K(i,disp,first,cues_=()):
    global T
    ch,a0,a1,s0,e=al('k',i);off=T-s0;audio.append({'f':f'vo/k/{i:02d}_K.mp3','t':round(off,3)})
    text=''.join(ch)
    rk['poses'].append({'t':round(T-.12,3),'p':first})
    for ph,p in cues_:
        j=text.find(ph);assert j>=0,(i,ph);rk['poses'].append({'t':round(off+a0[j]-.06,3),'p':p})
    intag=False
    for c,x in zip(ch,a0):
        if c=='[':intag=True
        if intag:
            if c==']':intag=False
            continue
        rk['vis'].append({'t':round(off+x,3),'v':vclass(c) or 'rest'})
    rk['vis'].append({'t':round(off+e,3),'v':'rest'})
    rk['words'].extend(words_of(ch,a0,a1,off))
    rk['show'].append({'type':disp,'a':round(T-.15,3),'b':round(off+e+.3,3)})
    a=T;T=off+e;return {'who':'K','i':i,'a':round(a,3),'b':round(T,3)}
def gap(s):
    global T;T+=s
def seg(kind,scene,a,**kw):
    s={'kind':kind,'scene':scene,'a':round(a,3),'b':round(T,3)};s.update(kw);segs.append(s);return s
score=[0,0]
# ---------- intro ----------
gap(.4);a=T;l=N(0,False);gap(.35);seg('intro','studio',0,lines=[l],score=list(score))
a=T;gap(.1);K(0,'full','h_smirk',[("Let's go",'pointyou')]);gap(.35);seg('opener','den',a)
ROUNDS=[
 dict(n=1,scene='street',claim=1,verdict='TRUE',opener=(1,'h_skeptical',[('Prove','h_unimpressed')]),
      build=[('N',2),('P',2,'explain',[('even though','shrug'),('Nah','cross')]),('N',3)],
      think=(3,'h_thinking',[('but a hundred','h_skeptical'),('I dunno','h_unimpressed')]),decide=(4,'sideeye',[('believe','pointyou')]),pick='TRUE',
      why=5,react=(5,'laugh',[('Lowkey','h_sidegrin')]),src='Source: Yahoo News / World Economic Forum'),
 dict(n=2,scene='ocean',claim=6,verdict='FALSE',opener=(6,'h_skeptical',[('Hmm','h_smirk')]),
      build=[('N',7),('P',7,'sitlean',[('drowned','sitpoint')]),('N',8)],
      think=(8,'h_thinking',[('makes sense','h_smirk')]),decide=(9,'point',[('Gotta','pointyou')]),pick='TRUE',
      why=9,react=(10,'shocked',[('Bruv','h_grin')]),src='Source: Scientific American'),
 dict(n=3,scene='space',claim=10,verdict='TRUE',opener=(11,'h_skeptical',[('Prove','h_unimpressed')]),
      build=[('N',11),('P',12,'sitrelax',[("ain't",'sitcross')]),('N',12),('P',13,'h_skeptical',[('Nah','h_unimpressed')]),('N',13)],
      think=(14,'h_thinking',[('I dunno','h_skeptical'),('Sounds true','h_smirk')]),decide=(15,'pointyou',[('believe','cross')]),pick='FALSE',
      why=14,react=(16,'shocked',[('Backwards','excited'),('Venus is just','h_grin')]),src='Source: NASA'),
]
for R in ROUNDS:
    r=R['n']
    a=T;gap(1.15);seg('wipe','studio',a,round=r,score=list(score))
    a=T;gap(.15);l=N(R['claim'],False);gap(.5);seg('claim','studio',a,round=r,lines=[l],score=list(score))
    a=T;K(R['opener'][0],'full',R['opener'][1],R['opener'][2]);gap(.3);seg('opener','den',a,round=r)
    a=T;pauses=[];lines=[]
    for b in R['build']:
        if b[0]=='N':lines.append(N(b[1]));gap(.3)
        else:
            gap(-.1);p0=T;K(b[1],'pause',b[2],b[3]);gap(.2);pauses.append([round(p0-.2,3),round(T,3)]);gap(.1)
    seg('build','topic',a,round=r,scenename=R['scene'],lines=lines,pauses=pauses)
    a=T;l=N(4,False);gap(.15);cd=T;cues[f'count{r}']=T;K(R['think'][0],'box',R['think'][1],R['think'][2])
    T=max(T,cd+5.0);gap(.25);K(R['decide'][0],'box',R['decide'][1],R['decide'][2]);gap(.3)
    seg('lock','studio',a,round=r,count=round(cd,3),pick=R['pick'],score=list(score))
    a=T;gap(1.0);stamp=T;
    if R['pick']==R['verdict']:score[0]+=1
    else:score[1]+=1
    gap(1.7);seg('reveal','studio',a,round=r,stamp=round(stamp,3),verdict=R['verdict'],pick=R['pick'],score=list(score))
    a=T;gap(.1);l=N(R['why']);gap(.5);seg('why','topic',a,round=r,scenename=R['scene'],lines=[l],src=R['src'],verdict=R['verdict'])
    a=T;K(R['react'][0],'full',R['react'][1],R['react'][2]);gap(.35);seg('react','den',a,round=r)
a=T;gap(.3);l=N(15,False);gap(.4);seg('outro','studio',a,lines=[l],score=list(score))
a=T;K(17,'full','annoyed',[('Send me','pointyou')]);gap(.4);seg('react','den',a)
a=T;gap(3.0);seg('end','studio',a,score=list(score))
rk['poses'].sort(key=lambda p:p['t']);rk['vis'].sort(key=lambda v:v['t'])
m=[]
for x in rk['vis']:
    if m and (x['t']-m[-1]['t']<.07 or x['v']==m[-1]['v']):continue
    m.append(x)
rk['vis']=m;rk['total']=round(T,3)
json.dump({'total':round(T,3),'segs':segs,'audio':audio,'nwords':nwords,'ricky':rk,'cues':cues},open(f'{E}/tl.json','w'))
print('total',round(T,2));[print(s['kind'],s['scene'],s.get('scenename',''),s['a'],s['b']) for s in segs]
