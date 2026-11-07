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
ROUNDS=[
 dict(n=1,scene='street',claim=1,verdict='TRUE',opener=(1,'h_skeptical',[('Prove','h_unimpressed')]),
      build=[('N',2),('P',2,'explain',[('even though','shrug'),('Nah','cross')]),('N',3)],
      think=(3,'h_thinking',[('but a hundred','h_skeptical'),('I dunno','h_unimpressed')]),decide=(4,'sideeye',[('believe','pointyou')]),pick='TRUE',
      why=5,react=(5,'laugh',[('Lowkey','h_sidegrin')]),src='Source: Yahoo News / World Economic Forum'),
 dict(n=2,scene='digital',claim=16,verdict='FALSE',opener=(18,'h_skeptical',[('loads','h_smirk')]),
      build=[('N',17),('P',19,'sitpoint',[('fifty','sitlean')]),('N',18)],
      think=(20,'h_thinking',[('everyone','h_skeptical'),('I dunno','h_unimpressed')]),decide=(21,'point',[('Sounds','pointyou')]),pick='TRUE',
      why=19,react=(22,'shocked',[('Half','h_grin')]),src='Source: Google (2025)'),
 dict(n=3,scene='ocean',claim=6,verdict='FALSE',opener=(6,'h_skeptical',[('Hmm','h_smirk')]),
      build=[('N',7),('P',7,'sitlean',[('drowned','sitpoint')]),('N',8)],
      think=(8,'h_thinking',[('makes sense','h_smirk')]),decide=(9,'point',[('Gotta','pointyou')]),pick='TRUE',
      why=9,react=(10,'shocked',[('Bruv','h_grin')]),src='Source: Scientific American'),
 dict(n=4,scene='sky',claim=20,verdict='TRUE',opener=(23,'h_skeptical',[('No way','h_unimpressed')]),
      build=[('N',21),('P',24,'explain',[('weighs','shrug'),('chillin','sideeye'),('Nah','cross')]),('N',22)],
      think=(25,'h_thinking',[('but','h_skeptical')]),decide=(26,'sideeye',[('believe','cross')]),pick='FALSE',
      why=23,react=(27,'shocked',[('stayin','h_grin')]),src='Source: USGS / Smithsonian'),
 dict(n=5,scene='harbour',claim=24,verdict='FALSE',opener=(28,'h_skeptical',[('Hmm','h_smirk')]),
      build=[('N',25),('P',29,'sitlean',[('group','sitpoint')]),('N',26)],
      think=(30,'h_thinking',[('three days is','h_skeptical'),('Could','h_smirk')]),decide=(31,'pointyou',[('Shorter','cross')]),pick='FALSE',
      why=27,react=(32,'shocked',[('Told','pointyou')]),src='Source: Britannica'),
 dict(n=6,scene='space',claim=10,verdict='TRUE',opener=(11,'h_skeptical',[('Prove','h_unimpressed')]),
      build=[('N',11),('P',12,'sitrelax',[("ain't",'sitcross')]),('N',12),('P',13,'h_skeptical',[('Nah','h_unimpressed')]),('N',13)],
      think=(14,'h_thinking',[('I dunno','h_skeptical'),('Sounds true','h_smirk')]),decide=(15,'pointyou',[('believe','cross')]),pick='FALSE',
      why=14,react=(16,'shocked',[('Backwards','excited'),('Venus is just','h_grin')]),src='Source: NASA'),
 dict(n=7,scene='station',claim=28,verdict='FALSE',opener=(33,'h_skeptical',[('Prove','h_unimpressed')]),
      build=[('N',29),('P',34,'h_unimpressed',[('afford','h_skeptical')]),('N',30)],
      think=(35,'h_thinking',[('go up','h_smirk')]),decide=(36,'point',[('grow','pointyou')]),pick='FALSE',
      why=31,react=(37,'h_grin',[('Book','pointyou')]),src='Source: NASA / Space.com'),
 dict(n=8,scene='bush',claim=32,verdict='TRUE',opener=(38,'h_grin',[('What','h_skeptical')]),
      build=[('N',33),('P',39,'sitcross',[('talkin','sit')]),('N',34)],
      think=(40,'h_thinking',[('nothin','h_skeptical')]),decide=(41,'sideeye',[('believe','cross')]),pick='FALSE',
      why=35,react=(42,'shocked',[('Nature','h_unimpressed')]),src='Source: Smithsonian Magazine'),
]
gap(.05)
for R in ROUNDS:
    r=R['n']
    if r>1:
        a=T;gap(1.15);seg('wipe','studio',a,round=r,score=list(score))
    a=T;gap(.15);l=N(R['claim'],False);gap(.5);seg('claim','studio',a,round=r,lines=[l],score=list(score))
    a=T;K(R['opener'][0],'full',R['opener'][1],R['opener'][2]);gap(.3);seg('opener','den',a,round=r)
    a=T;pauses=[];lines=[]
    for b in R['build']:
        if b[0]=='N':
            lines.append(N(b[1]));gap(.3)
        else:
            gap(-.1);p0=T;K(b[1],'pause',b[2],b[3]);gap(.2);pauses.append([round(p0-.2,3),round(T,3)]);gap(.1)
    seg('build','topic',a,round=r,scenename=R['scene'],lines=lines,pauses=pauses)
    a=T;l=N(4,False);gap(.15);cd=T;K(R['think'][0],'box',R['think'][1],R['think'][2])
    T=max(T,cd+5.0);gap(.25);K(R['decide'][0],'box',R['decide'][1],R['decide'][2]);gap(.3)
    seg('lock','studio',a,round=r,count=round(cd,3),pick=R['pick'],score=list(score))
    a=T;gap(1.0);stamp=T
    if R['pick']==R['verdict']:score[0]+=1
    else:score[1]+=1
    gap(1.7);seg('reveal','studio',a,round=r,stamp=round(stamp,3),verdict=R['verdict'],pick=R['pick'],score=list(score))
    a=T;gap(.1);l=N(R['why']);gap(.5);seg('why','topic',a,round=r,scenename=R['scene'],lines=[l],src=R['src'],verdict=R['verdict'])
    a=T;K(R['react'][0],'full',R['react'][1],R['react'][2]);gap(.35);seg('react','den',a,round=r)
    if r==1:
        a=T;gap(.35);l=N(37,False);gap(.35);seg('intro','studio',a,lines=[l],score=list(score))
        a=T;gap(.1);K(44,'full','h_smirk',[("Let's go",'pointyou')]);gap(.35);seg('opener','den',a)
a=T;gap(.3);l=N(36,False);gap(.4);seg('outro','studio',a,lines=[l],score=list(score))
a=T;K(43,'full','annoyed',[('Send me','pointyou')]);gap(.4);seg('react','den',a)
a=T;gap(.3);l=N(38,False);gap(.6);seg('tease','studio',a,lines=[l],score=list(score))
a=T;gap(.6);K(45,'box','h_grin',[('or','pointyou')]);T=a+12.0;seg('end','studio',a,score=list(score))
rk['poses'].sort(key=lambda p:p['t']);rk['vis'].sort(key=lambda v:v['t'])
m=[]
for x in rk['vis']:
    if m and (x['t']-m[-1]['t']<.07 or x['v']==m[-1]['v']):continue
    m.append(x)
rk['vis']=m;rk['total']=round(T,3)
json.dump({'total':round(T,3),'segs':segs,'audio':audio,'nwords':nwords,'ricky':rk,'cues':cues},open(f'{E}/tl.json','w'))
print('total',round(T,2));[print(s['kind'],s['scene'],s.get('scenename',''),s['a'],s['b']) for s in segs]
