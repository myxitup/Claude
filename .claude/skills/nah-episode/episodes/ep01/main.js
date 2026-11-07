// ===== main: timeline -> frame =====
let TL,SEGS;
const segAt=t=>{for(const s of SEGS)if(t>=s.a&&t<s.b)return s;return SEGS[SEGS.length-1]};
const showAt=t=>RD.show.find(s=>t>=s.a&&t<=s.b);
function pausedBefore(seg,t){let p=0;for(const[a,b]of seg.pauses||[]){if(t>b)p+=b-a;else if(t>a)p+=t-a}return p}
const localT=(seg,t)=>t-seg.a-pausedBefore(seg,t);
const clean=s=>s.toLowerCase().replace(/[^a-z0-9\-']/g,'');
function wordT(seg,word,n=0){const ws=(seg.lines||[]).flatMap(l=>l.words||[]);let k=0;for(const w of ws)if(clean(w[0]).startsWith(clean(word))){if(k++===n)return localT(seg,w[1])}console.warn('word not found',word,seg.kind);return 0}
function scoreAt(t){let r=0,f=0;for(const s of SEGS)if(s.kind==='reveal'&&t>=s.stamp){if(s.pick===s.verdict)r++;else f++}return[r,f]}
const BOX={x:W-468,y:H-292,w:440,h:248},PBOX={x:W-590,y:H-372,w:560,h:315};
window.render=function(t){
  const seg=segAt(t),show=showAt(t);let mode=show?show.type:null;if(seg.scene==='den')mode='full';
  const den=SETS.den;const{cur}=poseAt(t);const dctx={t,shot:shotOf(cur.p),shotT:t-shotChangeT(t)};let box=null,ctx=null;
  if(mode==='full'){den.update(dctx);den.comp.render()}
  else{const set=seg.scene==='topic'?SETS[seg.scenename]:SETS[seg.scene];const lt=localT(seg,t);ctx={t,lt,seg,dur:seg.b-seg.a-pausedBefore(seg,seg.b),w:(s,n)=>wordT(seg,s,n)};set.update(ctx);set.comp.render();ctx.set=set;
    if(mode==='box'||mode==='pause'){const B=mode==='pause'?PBOX:BOX;const ui=clamp((t-show.a)/.18),uo=clamp((show.b-t)/.18);const off=(1-eo(Math.min(ui,uo)))*(W-B.x+20);box={...B,x:B.x+off};
      den.update(dctx);den.cam.aspect=B.w/B.h;den.cam.updateProjectionMatrix();renderer.setScissorTest(true);renderer.setViewport(box.x,H-box.y-box.h,box.w,box.h);renderer.setScissor(box.x,H-box.y-box.h,box.w,box.h);renderer.render(den.scene,den.cam);
      renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);den.cam.aspect=W/H;den.cam.updateProjectionMatrix()}}
  // ---------- HUD ----------
  X.setTransform(DPR,0,0,DPR,0,0);X.clearRect(0,0,W,H);
  if(mode==='full'){drawRicky(t);karaoke(RD.words,t,86,{size:50})}
  else{
    if(mode==='pause'){X.save();X.fillStyle='rgba(10,5,30,.45)';X.beginPath();X.rect(0,0,W,H);X.roundRect(box.x,box.y,box.w,box.h,18);X.fill('evenodd');X.restore();
      const pa=clamp((t-show.a)/.12);X.save();X.globalAlpha=pa*(t<show.b-.25?1:clamp((show.b-t)/.25));X.fillStyle='rgba(0,0,0,.55)';X.beginPath();X.arc(300,H/2-30,70,0,TAU);X.fill();X.fillStyle='#fff';X.fillRect(272,H/2-62,18,64);X.fillRect(310,H/2-62,18,64);
      rrect(W-170,24,140,42,8,'#e5383b',null);txt('PAUSED',W-100,46,28,'#fff');X.fillStyle='rgba(255,255,255,.3)';X.fillRect(30,H-26,W-60,6);const pr=t/TL.total;X.fillStyle='#e5383b';X.fillRect(30,H-26,(W-60)*pr,6);X.beginPath();X.arc(30+(W-60)*pr,H-23,10,0,TAU);X.fill();X.restore()}
    overlays(t,seg,ctx);
    if(box){X.save();X.beginPath();X.roundRect(box.x,box.y,box.w,box.h,18);X.clip();X.translate(box.x,box.y);X.scale(box.w/W,box.h/H);drawRicky(t);X.restore();rrect(box.x,box.y,box.w,box.h,18,null,'#fff',7);rrect(box.x,box.y,box.w,box.h,18,null,INK,3);
      X.save();X.translate(box.x+20,box.y-6);X.rotate(-.06);rrect(-6,-20,120,40,8,'#e5383b',INK,4);txt('RICKY',54,1,28,'#fff');X.restore();
      karaoke(RD.words.filter(w=>w[1]>=show.a-.2&&w[2]<=show.b+.2),t,H-70,{size:46,cx:box.x/2+10,maxw:box.x-40})}
    if(show&&mode==='pause'&&t>show.b-.3){const k=clamp((show.b-t)/.3);X.save();X.globalAlpha=k;X.fillStyle='rgba(0,0,0,.5)';X.beginPath();X.arc(300,H/2-30,70,0,TAU);X.fill();X.fillStyle='#fff';X.beginPath();X.moveTo(278,H/2-66);X.lineTo(338,H/2-30);X.lineTo(278,H/2+6);X.fill();X.restore()}
  }
  // score bug (not in intro)
  if(seg.kind!=='end'){const[r,f]=scoreAt(t);X.save();X.translate(24,22);rrect(0,0,250,46,10,'rgba(27,18,64,.85)','#ffd23f',3);txt('RICKY',58,24,26,'#3ec6ff',{stroke:4});txt(`${r} : ${f}`,125,24,30,'#fff',{stroke:5});txt('FACTS',192,24,26,'#ff4f8b',{stroke:4});X.restore()}
  // scene-change flash
  const prevSeg=SEGS[SEGS.indexOf(seg)-1];const fromS=prevSeg&&(prevSeg.scene==='topic'?prevSeg.scenename:prevSeg.scene),toS=seg.scene==='topic'?seg.scenename:seg.scene;
  const sa=t-seg.a;if(prevSeg&&fromS!==toS&&sa<.12){X.fillStyle=`rgba(255,255,255,${.5*(1-sa/.12)})`;X.fillRect(0,0,W,H)}
  if(ctx&&ctx.flash){X.fillStyle=`rgba(255,255,255,${ctx.flash})`;X.fillRect(0,0,W,H)}
  const v=X.createRadialGradient(W/2,H/2,H*.5,W/2,H/2,H*.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(20,10,40,.2)');X.fillStyle=v;X.fillRect(0,0,W,H);
  const f=Math.max(1-clamp(t/.08),clamp((t-(TL.total-.5))/.5));if(f>0){X.fillStyle=`rgba(0,0,0,${f})`;X.fillRect(0,0,W,H)}};
function overlays(t,seg,ctx){const k=seg.kind,sa=t-seg.a,d=seg.b-seg.a;const W2=W/2;
  const cap=()=>{if(seg.lines)karaoke(seg.lines.flatMap(l=>l.words),t,H-70)};
  const lw=(s,n)=>{const ws=(seg.lines||[]).flatMap(l=>l.words||[]);let c=0;for(const w of ws)if(clean(w[0]).startsWith(clean(s))){if(c++===(n||0))return w[1]}return 1e9};
  if(k==='intro'){const a=.2;X.save();X.translate(W2,200);const s=pop(t,a,.35);X.scale(s,s);X.rotate(-.04);txt('NAH, I DON’T',0,-60,110,'#fff',{stroke:18});txt('BELIEVE THAT S-',0,50,110,'#ffd23f',{stroke:18});X.restore();
    chip(t,lw('Seven'),d,'7 MORE CLAIMS',W2-270,560,{size:46,bg:'#3ec6ff'});chip(t,lw('Ricky'),d,'RICKY vs FACTS',W2,600,{size:46,bg:'#ff4f8b',fg:'#fff'});chip(t,lw('do'),d,'DO YOU?',W2+270,560,{size:46,bg:'#7cff6b'});cap()}
  if(k==='wipe'){const u=sa/d;const x=u<.3?lerp(-W*1.4,0,eo(u/.3)):u>.75?lerp(0,W*1.4,ei((u-.75)/.25)):0;X.save();X.translate(x,0);X.fillStyle='#7b2ff2';X.beginPath();X.moveTo(-200,0);X.lineTo(W+200,0);X.lineTo(W,H);X.lineTo(-400,H);X.fill();
    X.fillStyle='#ffd23f';X.fillRect(-300,H/2+70,W+600,14);txt(`ROUND ${seg.round}`,W2,H/2-30,150,'#fff',{stroke:20});const[r,f]=seg.score;txt(`RICKY ${r} : ${f} FACTS`,W2,H/2+130,50,'#ffd23f',{stroke:9});X.restore()}
  if(k==='claim'){const ws=seg.lines[0].words;const k2=pop(t,seg.a+.05,.3);X.save();X.translate(W2,250);X.scale(k2,k2);X.rotate(-.015);rrect(-470,-150,940,300,26,'rgba(0,0,0,.3)',null);rrect(-480,-160,940,300,26,'#fffaf0',INK,7);
    rrect(-480,-200,260,56,12,'#e5383b',INK,5);txt('TRUE OR FALSE?',-350,-172,34,'#fff');
    X.font='52px Bang';let lines=[''],cw=0;const shown=ws.filter(w=>t>=w[1]-.05).map(w=>w[0].toUpperCase());if(/^TRUE$|^OR$|^FALSE\?$/.test(shown[0]||''))shown.splice(0,Math.min(3,shown.length));
    for(const s of shown){const ww=X.measureText(s+' ').width;if(cw+ww>840){lines.push('');cw=0}lines[lines.length-1]+=s+' ';cw+=ww}lines.forEach((l,i)=>txt(l.trim(),-10,-60+i*66-(lines.length-1)*10,52,INK));X.restore();
    const tp=seg.lines[0].b;chip(t,tp-.2,d+seg.a,'TRUE',W2-170,520,{size:64,bg:'#2fbf71',fg:'#fff',rot:-.05});chip(t,tp,d+seg.a,'FALSE',W2+170,520,{size:64,bg:'#e5383b',fg:'#fff',rot:.05})}
  if(k==='lock'){const c0=seg.count;if(t<c0+.1){const s=pop(t,seg.a+.05,.3);X.save();X.translate(W2,H/2-60);X.scale(s,s);txt('TRUE OR FALSE?',0,-40,96,'#fff',{stroke:16});txt('LOCK IT IN!',0,60,96,'#ffd23f',{stroke:16});X.restore()}
    chip(t,c0-.4,seg.b,'COMMENT YOUR GUESS!',250,H-60,{size:38,bg:'#ff4f8b',fg:'#fff'});
    const u=t-c0;if(u>=0&&u<5.2){const n=Math.max(1,5-Math.floor(u)),fr=u%1;X.save();X.translate(150,210);X.scale(.75,.75);X.fillStyle='rgba(27,18,64,.85)';X.beginPath();X.arc(0,0,110,0,TAU);X.fill();X.strokeStyle='#ffd23f';X.lineWidth=16;X.beginPath();X.arc(0,0,92,-PI/2,-PI/2+TAU*(1-clamp(u/5)));X.stroke();
      const s=1+.25*(1-eo(fr*3));X.scale(s,s);txt(u<5?String(n):'0',0,6,130,'#fff',{stroke:14});X.restore()}
    // Ricky says chip
    let pickS=null;if(u>0&&u<5){const sp=Math.floor(Math.pow(u,1.6)*2.2);pickS=sp%2?'FALSE':'TRUE';if(u>4.3)pickS=seg.pick}else if(u>=5)pickS=seg.pick;
    if(pickS){X.save();X.translate(BOX.x+BOX.w/2,BOX.y-110);rrect(-130,-34,260,68,14,'#1b1240','#fff',4);txt('RICKY SAYS',-50,0,26,'#fff');rrect(10,-24,110,48,10,pickS==='TRUE'?'#2fbf71':'#e5383b',INK,3);txt(pickS,65,2,30,'#fff');X.restore()}}
  if(k==='reveal'){const st=seg.stamp;if(t<st){const n=Math.floor((t-seg.a)*6)%4;txt('.'.repeat(n),W2,H/2-140,120,'#fff',{stroke:14})}
    else{const v=t-st,s=v<.18?lerp(2.4,1,eo(v/.18)):1;X.save();X.translate(W2,190);X.rotate(-.1);X.scale(s,s);const ok=seg.verdict==='TRUE';rrect(-250,-90,500,180,24,ok?'#2fbf71':'#e5383b','#fff',10);txt(seg.verdict+'!',0,6,150,'#fff',{stroke:16});X.restore();
      X.save();X.translate(W2,H-120);rrect(-150,-38,300,76,14,'#1b1240','#fff',4);txt('RICKY SAID',-60,0,28,'#fff');rrect(20,-26,110,52,10,seg.pick==='TRUE'?'#2fbf71':'#e5383b',INK,3);txt(seg.pick,75,2,30,'#fff');
      if(v>.35){const right=seg.pick===seg.verdict,q=pop(t,st+.35);X.translate(150,-30);X.scale(q,q);if(right){X.strokeStyle='#7cff6b';X.lineWidth=18;X.lineCap='round';X.beginPath();X.moveTo(-30,0);X.lineTo(-5,25);X.lineTo(40,-30);X.stroke()}
        else{X.strokeStyle='#ff2a2a';X.lineWidth=18;X.lineCap='round';X.beginPath();X.moveTo(-30,-30);X.lineTo(30,30);X.moveTo(30,-30);X.lineTo(-30,30);X.stroke()}}X.restore()}}
  if(k==='build'||k==='why'){const sn=seg.scenename,S=SETS[sn];
    if(sn==='street'&&k==='build'){flag(t,lw('Finland'),lw('day-fines')-.1,W-200,170);if(t>=lw('day-fines')&&t<lw('earn')+1.4)coins(t,lw('day-fines'),W-240,200);
      if(t>=lw('bigger')&&t<seg.b)bars(t,lw('bigger'),[{label:'SALARY',v:.9,col:'#2fbf71',t0:lw('salary'),val:'€€€'},{label:'TICKET',v:.9,col:'#e5383b',t0:lw('bigger',1),val:'€€€'}],W-520,130,480);
      chip(t,lw('rich'),seg.b,'VERY RICH MAN',260,190,{size:44,bg:'#ffd23f'})}
    if(sn==='street'&&k==='why'){chip(t,lw('fined'),seg.b,'€121,000 FINE',W2-330,140,{size:46,bg:'#e5383b',fg:'#fff'});chip(t,lw('income'),seg.b,'BASED ON INCOME',W2+330,140,{size:44,bg:'#ffd23f'})}
    if(sn==='ocean'&&k==='build'){chip(t,lw('fish'),lw('breathe')+1.2,'NOT A FISH',W2-300,150,{size:50,bg:'#e5383b',fg:'#fff'});chip(t,lw('breathe'),lw('blowhole')-.2,'BREATHES AIR',W2+280,150,{size:46,bg:'#3ec6ff'});
      const D=S.d[0];label(t,lw('blowhole'),lw('choice')-.1,'BLOWHOLE',project(D.localToWorld(new THREE.Vector3(.78,.38,0)),S.cam),{dx:-160,dy:-110});
      chip(t,lw('choice'),lw('So')-.1,'EVERY BREATH = ON PURPOSE',W2,150,{size:44,bg:'#ffd23f'});if(t>lw('tired'))chip(t,lw('tired'),seg.b,'?',W2+260,220,{size:110,bg:'#ff4f8b',fg:'#fff'})}
    if(sn==='ocean'&&k==='why'){if(t>lw('half'))brain(t,lw('half'),W-200,190);chip(t,lw('eye'),seg.b,'ONE EYE OPEN',300,160,{size:46,bg:'#ffd23f'})}
    if(sn==='space'&&k==='build'){chip(t,lw('spin'),lw('year')-.1,'1 SPIN = 1 DAY',W2,140,{size:52,bg:'#7cff6b',sub:'24 HOURS'});chip(t,lw('lap'),lw('Venus')-.1,'1 LAP = 1 YEAR',W2,140,{size:52,bg:'#3ec6ff',sub:'365 DAYS'});
      const ws=lw('year')+.3,we=lw('spins');if(t>ws&&t<we){label(t,ws,we,'SUN',project(new THREE.Vector3(0,6,0),S.cam),{dx:60,dy:-70,col:'#ffd23f'});label(t,ws,we,'EARTH',project(S.earthO.position.clone().add(new THREE.Vector3(0,1.7,0)),S.cam),{dx:70,dy:-70,col:'#3ec6ff'});label(t,lw('Venus'),we,'VENUS',project(S.venusO.position.clone().add(new THREE.Vector3(0,1.6,0)),S.cam),{dx:-70,dy:-70,col:'#ff4f8b'})}
      chip(t,lw('shorter'),lw('spins')-.1,'SHORTER LAP',W2+300,170,{size:46,bg:'#ffd23f'});chip(t,lw('slowly'),lw('which')-.1,'S  L  O  W . . .',W2,150,{size:56,bg:'#ff4f8b',fg:'#fff'});
      if(t>lw('which'))bars(t,lw('which'),[{label:'1 SPIN',v:0,col:'#7cff6b'},{label:'1 LAP',v:0,col:'#3ec6ff'}],W2-280,120,560)}
    if(sn==='space'&&k==='why'){bars(t,lw('two'),[{label:'1 SPIN',v:1,col:'#7cff6b',t0:lw('two'),d:1.6,val:v=>Math.round(243*v)+' DAYS'},{label:'1 LAP',v:225/243,col:'#3ec6ff',t0:lw('two',1),d:1.4,val:v=>Math.round(243*v)+' DAYS'}],W2-300,110,600);
      chip(t,lw('backwards'),seg.b,'SPINS BACKWARDS!',300,330,{size:46,bg:'#ff4f8b',fg:'#fff'});chip(t,lw('west'),seg.b,'SUN RISES IN THE WEST',W-320,330,{size:42,bg:'#ffd23f'})}
    if(k==='why'&&seg.src){X.save();X.globalAlpha=clamp(sa/.5);txt(seg.src,W-24,H-22,22,'rgba(255,255,255,.9)',{font:'Hand',align:'right',stroke:5});X.restore()}
    if(!(showAt(t)))cap()}

  if(k==='tease'){const s=pop(t,seg.a+.05,.3);X.save();X.translate(W2,170);X.scale(s,s);X.rotate(-.04);txt('NEXT TIME...',0,0,90,'#ffd23f',{stroke:14});X.restore();
    chip(t,seg.a+.9,seg.b+1,'A JELLYFISH THAT LIVES FOREVER?',W2,360,{size:54,bg:'#fffaf0'});cap()}
  if(k==='build'||k==='why'){const sn=seg.scenename,S=SETS[sn];
    if(sn==='digital'&&k==='build'){chip(t,lw('type'),lw('weather')-.1,'1 QUESTION = 1 SEARCH',W2,150,{size:46,bg:'#ffd23f'});chip(t,lw('Billions'),lw('how')-.1,'BILLIONS OF PEOPLE',W2-280,170,{size:44,bg:'#3ec6ff'});chip(t,lw('day'),seg.b,'PER DAY = ?',W2+280,520,{size:48,bg:'#ff4f8b',fg:'#fff'})}
    if(sn==='digital'&&k==='why'){chip(t,lw('false'),lw('five')-.1,'NOT 100 MILLION',W2,520,{size:50,bg:'#e5383b',fg:'#fff'});chip(t,lw('five'),seg.b,'5 TRILLION+ A YEAR',W2-300,520,{size:44,bg:'#3ec6ff'});chip(t,lw('thirteen'),seg.b,'≈13.7 BILLION A DAY',W2+300,520,{size:44,bg:'#7cff6b'})}
    if(sn==='sky'&&k==='build'){if(S.drops[0].visible)label(t,lw('droplets'),lw('billions'),'WATER DROPLET',project(S.drops[5].position,S.cam),{dx:140,dy:-90,col:'#3ec6ff'});chip(t,lw('dust'),lw('billions')-.1,'SMALLER THAN DUST',300,160,{size:44,bg:'#ffd23f'});
      chip(t,lw('billions'),lw('scale')-.1,'BILLIONS AND BILLIONS',W2,150,{size:48,bg:'#ff4f8b',fg:'#fff'});chip(t,lw('heavy'),seg.b,'?',W2+300,240,{size:110,bg:'#ffd23f'})}
    if(sn==='sky'&&k==='why'){chip(t,lw('five'),lw('floats')-.1,'≈500 TONNES OF WATER',W2-300,150,{size:44,bg:'#3ec6ff'});const ne=Math.floor(clamp((t-lw('elephants')+1.2)/1.6)*100);if(t>lw('elephants')-1.2&&t<lw('floats'))chip(t,lw('elephants')-1.2,lw('floats')-.1,'ELEPHANTS: '+ne,W2+300,150,{size:44,bg:'#ffd23f'});
      chip(t,lw('rising'),seg.b,'RISING WARM AIR',W2,560,{size:48,bg:'#ff8a3d',fg:'#fff'})}
    if(sn==='harbour'&&k==='build'){chip(t,lw('1896'),lw('Britain')+.2,'1896',W2,170,{size:90,bg:'#ffd23f'});chip(t,lw('Britain'),lw('deadline')-.1,'BRITAIN',W2-260,170,{size:52,bg:'#1d4fa8',fg:'#fff'});chip(t,lw('Zanzibar'),lw('deadline')-.1,'ZANZIBAR',W2+260,170,{size:52,bg:'#e5383b',fg:'#fff'});
      chip(t,lw('deadline'),lw('ran')-.1,'DEADLINE: 9:00 AM',W2,560,{size:48,bg:'#fffaf0'});chip(t,lw('long'),seg.b,'HOW LONG?',W2,170,{size:70,bg:'#ff4f8b',fg:'#fff'})}
    if(sn==='harbour'&&k==='why'){stopwatch(t,seg.a+.2,190,250,ctx&&ctx.clock||0);chip(t,lw('thirty-eight'),seg.b,'38–45 MINUTES',W2+260,170,{size:52,bg:'#ffd23f'});chip(t,lw('shortest'),seg.b,'SHORTEST WAR EVER',W2+260,300,{size:46,bg:'#e5383b',fg:'#fff'})}
    if(sn==='station'&&k==='build'){if(t>=lw('gravity')&&t<lw('station'))spine(t,lw('gravity'),170,320,0,'ON EARTH');chip(t,lw('gravity'),lw('station')-.1,'GRAVITY ↓',W2+180,160,{size:48,bg:'#ff4f8b',fg:'#fff'});
      chip(t,lw('station'),lw('almost')-.1,'SPACE STATION',W2,160,{size:48,bg:'#3ec6ff'});chip(t,lw('almost'),lw('body')-.1,'ALMOST NO GRAVITY',W2,160,{size:46,bg:'#ffd23f'});chip(t,lw('body'),seg.b,'?',W2-300,240,{size:110,bg:'#ff4f8b',fg:'#fff'})}
    if(sn==='station'&&k==='why'){const g=ctx&&ctx.grow||0;if(t>lw('grow'))spine(t,lw('grow'),170,320,g,'IN SPACE');chip(t,lw('three'),lw('back')-.1,'+3% ≈ 5 CM TALLER',W2+250,160,{size:46,bg:'#7cff6b'});chip(t,lw('back'),seg.b,'SHRINK BACK ON EARTH',W2+200,160,{size:44,bg:'#ffd23f'})}
    if(sn==='bush'&&k==='build'){chip(t,lw('Australia'),lw('poop')-.1,'AUSTRALIA',W2+300,160,{size:52,bg:'#ff8a3d',fg:'#fff'});censor(t,lw('poop'),seg.b+1,project(new THREE.Vector3(3,1.7,-3.6),S.cam));chip(t,lw('shape'),seg.b,'WHAT SHAPE?',W2-280,170,{size:52,bg:'#ffd23f'})}
    if(sn==='bush'&&k==='why'){chip(t,lw('cubes'),lw('gut')-.1,'CUBES!',W2-250,170,{size:80,bg:'#7cff6b'});if(t>=lw('gut')&&t<lw('bum')-.2)gut(t,lw('gut'),W2,190);chip(t,lw('bum'),seg.b,'ROUND BUM',W2+260,170,{size:56,bg:'#ff4f8b',fg:'#fff'})}
  }
  if(k==='outro'){const s=pop(t,seg.a+.1,.35);X.save();X.translate(W2,180);X.scale(s,s);txt('FINAL SCORE',0,0,100,'#fff',{stroke:16});X.restore();const[r,f]=seg.score;chip(t,seg.a+.5,seg.b,`RICKY ${r} : ${f} FACTS`,W2,320,{size:64,bg:'#ffd23f'});cap()}
  if(k==='end'){const s=pop(t,seg.a+.1,.35);X.save();X.translate(W2,120);X.scale(s,s);X.rotate(-.04);txt('NAH, I DON’T',0,-55,96,'#fff',{stroke:16});txt('BELIEVE THAT S-',0,40,96,'#ffd23f',{stroke:16});X.restore();
    chip(t,seg.a+5.2,seg.b+1,'SUBSCRIBE',W2-200,640,{size:56,bg:'#e5383b',fg:'#fff'});chip(t,seg.a+5.5,seg.b+1,'SEND US A COMMENT',W2+210,640,{size:44,bg:'#3ec6ff'})}
}
window.engineReady=(async()=>{
  TL=window.TLDATA;SEGS=TL.segs;RD=TL.ricky;RF=window.FACES;RMM=window.MOUTHMETA;
  const L=(src)=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
  const names=[...new Set(RD.poses.map(p=>p.p))];await Promise.all(names.map(async n=>{RIMG[n]=await L(window.POSEDIR+n+'.png');RNM[n]=await L(window.POSEDIR+n+'__nm.png');RMK[n]=await L(window.POSEDIR+n+'__mask.png')}));
  await Promise.all(['rest','smile','slight','ah','ee','oh','oo','fv','mbp'].map(async n=>{RMO[n]=await L(window.MOUTHDIR+n+'.png')}));
  // re-draw textures that use fonts
  SETS.studio.drawBoard(0,0);return true})();
window.TOTAL=()=>TL.total;
