// ===== Round 1: TRUE OR FALSE — Venus =====
const C=n=>window.R1.cues[n];
const GREEN='#2fae5b',RED='#e5383b',GOLD='#ffd23f';
function shake(t,t0,dur=.35,amp=10){const d=t-t0;if(d<0||d>dur)return{x:0,y:0};const k=(1-d/dur)*amp;return{x:(rnd(Math.floor(t*60))-.5)*k,y:(rnd(Math.floor(t*60)+9)-.5)*k}}
// ---------- planets ----------
function drawSun(x,y,r,t,face=true){
  X.save();const g=X.createRadialGradient(x,y,r*.4,x,y,r*2.6);g.addColorStop(0,'rgba(255,214,90,.55)');g.addColorStop(1,'rgba(255,170,40,0)');X.fillStyle=g;X.beginPath();X.arc(x,y,r*2.6,0,TAU);X.fill();
  X.translate(x,y);X.rotate(t*.25);X.fillStyle='#ffb22e';for(let i=0;i<12;i++){X.rotate(TAU/12);X.beginPath();X.moveTo(r*.85,-r*.18);X.lineTo(r*1.35+Math.sin(t*3+i)*r*.08,0);X.lineTo(r*.85,r*.18);X.fill()}X.restore();
  X.save();X.fillStyle='#ffd447';X.strokeStyle=INK;X.lineWidth=4;X.beginPath();X.arc(x,y,r,0,TAU);X.fill();X.stroke();
  if(face){X.fillStyle=INK;X.beginPath();X.arc(x-r*.3,y-r*.12,r*.08,0,TAU);X.arc(x+r*.3,y-r*.12,r*.08,0,TAU);X.fill();X.lineWidth=3;X.beginPath();X.arc(x,y+r*.08,r*.3,.15*PI,.85*PI);X.stroke()}X.restore()}
function drawPlanet(x,y,r,o,t){ // o:{base,spot,spin,face,glasses,ring}
  X.save();X.beginPath();X.arc(x,y,r,0,TAU);X.fillStyle=o.base;X.fill();X.clip();
  // rotating surface spots (front hemisphere only)
  for(let i=0;i<9;i++){const ph=rnd(i+o.seed)*TAU+o.spin,c=Math.cos(ph);if(c<-.05)continue;const sx=x+Math.sin(ph)*r*.85,sy=y+(rnd(i+o.seed+3)-.5)*r*1.3,sw=r*(.16+.14*rnd(i+o.seed+5))*Math.max(.15,c);
    X.fillStyle=o.spot;X.beginPath();X.ellipse(sx,sy,sw,r*(.1+.08*rnd(i+o.seed+7)),0,0,TAU);X.fill()}
  if(o.bands){X.strokeStyle=o.bands;X.lineWidth=r*.08;for(let k=-2;k<=2;k++){X.beginPath();X.ellipse(x,y+k*r*.32,r*1.1,r*.06,0,0,TAU);X.stroke()}}
  // shading
  const sg=X.createRadialGradient(x-r*.45,y-r*.45,r*.1,x,y,r*1.15);sg.addColorStop(0,'rgba(255,255,255,.28)');sg.addColorStop(.6,'rgba(255,255,255,0)');sg.addColorStop(1,'rgba(0,0,30,.35)');X.fillStyle=sg;X.fillRect(x-r,y-r,r*2,r*2);
  X.restore();
  X.save();X.strokeStyle=INK;X.lineWidth=Math.max(2.5,r*.035);X.beginPath();X.arc(x,y,r,0,TAU);X.stroke();
  if(o.face){const s=r/100;X.translate(x,y);X.scale(s,s);X.fillStyle=INK;X.strokeStyle=INK;X.lineWidth=5;
    if(o.face==='sleepy'){[-30,30].forEach(e=>{X.beginPath();X.arc(e,-8,12,.1*PI,.9*PI);X.stroke()});X.beginPath();X.ellipse(0,28,9,6+3*Math.sin(t*2),0,0,TAU);X.fill()}
    else if(o.face==='shock'){[-30,30].forEach(e=>{X.fillStyle='#fff';X.beginPath();X.arc(e,-10,15,0,TAU);X.fill();X.stroke();X.fillStyle=INK;X.beginPath();X.arc(e,-8,6,0,TAU);X.fill()});X.beginPath();X.ellipse(0,32,11,15,0,0,TAU);X.fill()}
    else if(o.face==='smug'){[-30,30].forEach(e=>{X.beginPath();X.arc(e,-8,6,0,TAU);X.fill()});X.beginPath();X.moveTo(-22,26);X.quadraticCurveTo(8,42,26,18);X.stroke()}
    else{[-30,30].forEach(e=>{X.beginPath();X.arc(e,-8,7,0,TAU);X.fill()});X.beginPath();X.arc(0,14,22,.15*PI,.85*PI);X.stroke()}
    if(o.glasses>0){X.save();X.scale(o.glasses,o.glasses);X.fillStyle='#111';X.beginPath();X.roundRect(-58,-26,48,32,10);X.roundRect(10,-26,48,32,10);X.fill();X.fillRect(-12,-18,24,6);X.fillStyle='rgba(255,255,255,.6)';X.fillRect(-50,-20,12,5);X.fillRect(18,-20,12,5);X.restore()}}
  X.restore()}
const EARTH={base:'#3a8ee6',spot:'#58b947',seed:3},VENUS={base:'#e9b25b',spot:'#f6d79a',bands:'rgba(190,120,40,.35)',seed:21};
function spinArrow(x,y,r,a0,dir,col,label,k){if(k<=0)return;X.save();X.globalAlpha=k;X.strokeStyle=col;X.lineWidth=6;X.lineCap='round';const a1=a0+dir*1.6*eo(k);
  X.beginPath();X.arc(x,y,r,a0,a1,dir<0);X.stroke();const hx=x+Math.cos(a1)*r,hy=y+Math.sin(a1)*r,ta=a1+dir*PI/2;X.fillStyle=col;X.beginPath();X.moveTo(hx+Math.cos(ta)*14,hy+Math.sin(ta)*14);X.lineTo(hx+Math.cos(ta+2.4)*12,hy+Math.sin(ta+2.4)*12);X.lineTo(hx+Math.cos(ta-2.4)*12,hy+Math.sin(ta-2.4)*12);X.closePath();X.fill();
  if(label)txt(label,x+Math.cos(a0+dir*.8)*(r+44),y+Math.sin(a0+dir*.8)*(r+30),30,col,'Bang','center',6);X.restore()}
// ---------- UI pieces ----------
function claimCard(t,cx,cy,sc,alpha){
  X.save();X.globalAlpha=alpha;X.translate(cx,cy);X.scale(sc,sc);X.rotate(-.012);
  X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.roundRect(-440,-112,880,224,22);X.fill();
  X.translate(-6,-8);X.fillStyle='#fffaf0';X.strokeStyle=INK;X.lineWidth=5;X.beginPath();X.roundRect(-440,-112,880,224,22);X.fill();X.stroke();
  X.save();X.translate(-440+26,-112);X.rotate(-.05);X.fillStyle=RED;X.beginPath();X.roundRect(0,-22,150,42,8);X.fill();X.stroke();txt('ROUND 1',75,0,30,'#fff','Bang');X.restore();
  // claim text typed in sync with narration words
  const full='A day on Venus is longer than its year.';const ws=window.R1.words.filter(w=>w[4]===0).slice(3);let shown=full;
  if(t<C('end0')+.1){let n=0;for(const w of ws)if(t>=w[1]-.05)n+=w[0].length+1;shown=full.slice(0,n)}
  txt('“'+shown+(shown.length<full.length?'':'”'),0,-10,56,INK,'Hand');X.restore()}
function tfButtons(t,cx,cy,sc,alpha,pick,reveal,t0){
  X.save();X.globalAlpha=alpha;X.translate(cx,cy);X.scale(sc,sc);
  const pulse=1+.04*Math.sin(t*8);
  [['TRUE',-170,GREEN],['FALSE',170,RED]].forEach(([s,x,col],i)=>{
    const k=back(clamp((t-(t0+i*.18))/.35));if(k<=0)return;let sz=k*(reveal?(s==='TRUE'?1.12:.9):pulse);
    X.save();X.translate(x,0);X.scale(sz,sz);if(reveal&&s==='FALSE')X.globalAlpha=alpha*.45;
    X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.roundRect(-118,-38,236,82,40);X.fill();X.fillStyle=col;X.strokeStyle=INK;X.lineWidth=5;X.beginPath();X.roundRect(-122,-44,236,82,40);X.fill();X.stroke();
    txt(s,-4,-2,56,'#fff','Bang','center',8);
    if(pick===s){X.strokeStyle=GOLD;X.lineWidth=6;X.setLineDash([12,8]);X.lineDashOffset=-t*40;X.beginPath();X.roundRect(-134,-56,260,106,50);X.stroke();X.setLineDash([]);
      X.save();X.translate(70,-58);X.rotate(.12);X.fillStyle='#7b4fd6';X.beginPath();X.roundRect(-58,-20,116,38,8);X.fill();X.stroke();txt("KRIS SAYS",0,0,22,'#fff','Bang');X.restore();
      if(reveal){const xk=back(clamp((t-C("It's true")-.1)/.3));X.save();X.scale(xk,xk);X.strokeStyle=RED;X.lineWidth=14;X.lineCap='round';X.beginPath();X.moveTo(-60,-34);X.lineTo(60,34);X.moveTo(60,-34);X.lineTo(-60,34);X.stroke();X.restore()}}
    X.restore()});
  if(!reveal)txt('or',0,-2,34,'#fff','Hand','center',6);
  X.restore()}
function stamp(x,y,word,col,k,rot=-.14,size=150){if(k<=0)return;const sc=1+(1-k)*1.8;X.save();X.translate(x,y);X.rotate(rot);X.scale(sc,sc);X.globalAlpha=Math.min(1,k*1.4);
  X.font=`${size}px Bang`;const w=X.measureText(word).width+70;X.strokeStyle=col;X.lineWidth=12;X.beginPath();X.roundRect(-w/2,-size*.62,w,size*1.2,18);X.stroke();X.lineWidth=4;X.beginPath();X.roundRect(-w/2+14,-size*.62+14,w-28,size*1.2-28,10);X.stroke();
  txt(word,0,4,size,col,'Bang');X.restore()}
function scoreboard(t,kris,facts,flipT){
  X.save();X.translate(W/2,38);const w=300;X.fillStyle='rgba(10,10,28,.75)';X.strokeStyle='rgba(255,255,255,.25)';X.lineWidth=2;X.beginPath();X.roundRect(-w/2,-24,w,48,24);X.fill();X.stroke();
  txt('KRIS',-92,1,26,'#c9b3ff','Bang');txt(String(kris),-38,1,30,'#fff','Bang');txt(':',0,0,28,'#888','Bang');
  const fk=flipT!==undefined&&t>flipT?clamp((t-flipT)/.35):1,fv=flipT!==undefined&&t>flipT?facts:facts-(flipT!==undefined?1:0);
  X.save();X.translate(38,1);X.scale(1,Math.abs(Math.cos(fk*PI))||.01);txt(String(fk<.5?Math.max(0,facts-1):fv),0,0,30,fk<1&&fk>0?GOLD:'#fff','Bang');X.restore();
  txt('FACTS',94,1,26,'#9be3b5','Bang');X.restore()}
function countdownRing(t,t0){const e=t-t0;if(e<0||e>5.4)return;const a=clamp(e/.3)*(1-clamp((e-5)/.4));const n=Math.max(1,5-Math.floor(e));const sub=e-Math.floor(e);
  X.save();X.globalAlpha=a;X.translate(W-110,110);X.fillStyle='rgba(10,10,28,.8)';X.beginPath();X.arc(0,0,62,0,TAU);X.fill();
  X.strokeStyle='rgba(255,255,255,.18)';X.lineWidth=10;X.beginPath();X.arc(0,0,50,0,TAU);X.stroke();X.strokeStyle=n<=2?RED:GOLD;X.beginPath();X.arc(0,0,50,-PI/2,-PI/2+TAU*(1-clamp(e/5)));X.stroke();
  const ps=1+.5*(1-eo(clamp(sub/.25)));X.scale(ps,ps);txt(e<5?String(n):'0',0,3,58,'#fff','Bang');X.restore()}
// karaoke captions from word timings
function karaoke(t){if(window.PAUSED)return;const ws=window.R1.words;let cur=-1;for(let i=0;i<ws.length;i++)if(t>=ws[i][1]-.04&&t<=ws[i][2]+.35){cur=i}
  if(cur<0)return;const li=ws[cur][4];if(li===0||li===2)return;
  // chunk: up to 5 words, break after punctuation
  const same=ws.map((w,i)=>[w,i]).filter(([w])=>w[4]===li);const chunks=[];let c=[];for(const[w,i]of same){c.push(i);if(c.length>=5||/[.?!,:]$/.test(w[0])&&c.length>=2){chunks.push(c);c=[]}}if(c.length)chunks.push(c);
  const ch=chunks.find(c=>c.includes(cur));if(!ch)return;const who=ws[cur][3];
  X.save();X.font='44px Bang';const parts=ch.map(i=>ws[i][0].toUpperCase());const sp=14;const widths=parts.map(p=>X.measureText(p).width);const tot=widths.reduce((a,b)=>a+b,0)+sp*(parts.length-1);
  let x=W/2-tot/2;const y=H-58;if(who==='K'){X.fillStyle='#7b4fd6';X.strokeStyle=INK;X.lineWidth=3;X.beginPath();X.roundRect(x-104,y-22,88,40,8);X.fill();X.stroke();txt('KRIS',x-60,y-1,26,'#fff','Bang')}
  parts.forEach((p,j)=>{const i=ch[j],active=t>=ws[i][1]-.04,now=active&&t<=ws[i][2]+.05;const sc=now?1.12:1;X.save();X.translate(x+widths[j]/2,y);X.scale(sc,sc);
    txt(p,0,0,44,now?(who==='K'?'#ff8a8a':GOLD):(active?'#fff':'rgba(255,255,255,.55)'),'Bang','center',9);X.restore();x+=widths[j]+sp});X.restore()}
// Kris PIP
const KSEQ={6:[[0,'palm','lid'],[.45,'cross','lid'],[.78,'shrug','wide']],3:[[0,'cross','lid'],[.06,'point','lid'],[.45,'shrug','wide'],[.86,'palm','lid']],5:[[0,'shrug','wide'],[.3,'talk','wide'],[.56,'shrug','lid'],[.9,'cross','lid']]};
function krisPIP(t,li,x0,y0,w,h,k){if(k<=0)return;const st=window.R1.start[li],en=C('end'+li),u=clamp((t-st)/(en-st));
  const x=x0+(1-k)*(w+120);
  X.save();X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=28;X.fillStyle='#000';X.beginPath();X.roundRect(x,y0,w,h,20);X.fill();X.restore();
  X.save();X.beginPath();X.roundRect(x,y0,w,h,20);X.clip();couchRoom(x,y0,w,h,t);
  const sq=KSEQ[li];let i=0;while(i+1<sq.length&&u>=sq[i+1][0])i++;let p=SP[sq[i][1]];if(i>0)p=mixP(SP[sq[i-1][1]],p,eio(clamp((u-sq[i][0])*8)));p={...p};
  if(sq[i][1]==='talk'||sq[i][1]==='shrug'){p.aR+=.18*Math.sin(t*7);p.aL+=.12*Math.sin(t*6+1)}
  const fr=Math.round(t*30),open=window.R1.mouth[fr]||0,talking=t>=st&&t<=en;
  const face={eyes:sq[i][2],mouth:talking?'talk':'flat',open,brow:sq[i][2]==='lid'?-1:1,look:.7,glasses:0};if((t*1.7)%3.1<.1&&face.eyes!=='happy')face.eyes='closed';
  drawFigure({x:x+w/2-10,y:y0+h-104,rot:0,s:1.7,pose:p,face,hat:'cap',hoodie:'#7b4fd6',flip:true,seed:90,hands:(hL,hR)=>{X.save();X.translate(hR.x,hR.y);X.rotate(.4);X.fillStyle='#222';X.beginPath();X.roundRect(-3,-12,8,20,3);X.fill();X.restore()}});
  X.restore();X.save();X.strokeStyle='#fff';X.lineWidth=5;X.beginPath();X.roundRect(x,y0,w,h,20);X.stroke();
  X.translate(x+20,y0-6);X.rotate(-.06);X.fillStyle=RED;X.strokeStyle=INK;X.lineWidth=3;X.beginPath();X.roundRect(0,-24,104,44,8);X.fill();X.stroke();txt('NAH.',52,-1,32,'#fff','Bang');X.restore()}
// race bars
function bars(t,x,y,w,spinV,lapV,showQ,labels){
  [['ONE SPIN',spinV,'#ffb547'],['ONE LAP',lapV,'#5ec8ff']].forEach(([lab,v,col],i)=>{const yy=y+i*92;
    txt(lab,x,yy-30,30,'#fff','Bang','left',6);X.fillStyle='rgba(255,255,255,.12)';X.beginPath();X.roundRect(x,yy-12,w,40,20);X.fill();
    X.fillStyle=col;X.beginPath();X.roundRect(x,yy-12,Math.max(40,w*v),40,20);X.fill();X.strokeStyle=INK;X.lineWidth=3;X.beginPath();X.roundRect(x,yy-12,w,40,20);X.stroke();
    if(labels&&labels[i])txt(labels[i],x+Math.max(40,w*v)-12,yy+8,26,INK,'Bang','right');
    if(showQ){const q=1+.12*Math.sin(t*6+i);X.save();X.translate(x+w*v+40,yy+8);X.scale(q,q);txt('?',0,0,48,GOLD,'Bang','center',7);X.restore()}})}
function infoCard(t,k,rows){if(k<=0)return;const x=760+(1-k)*560,y=120;X.save();X.fillStyle='rgba(12,12,32,.82)';X.strokeStyle='rgba(255,255,255,.25)';X.lineWidth=2;X.beginPath();X.roundRect(x,y,470,400,22);X.fill();X.stroke();
  rows.forEach((r,i)=>{if(r.k<=0)return;const yy=y+52+i*86;X.save();X.globalAlpha=r.k;X.translate(x+30,yy);
    drawPlanet(24,10,24,r.planet,t);txt(r.a,64,-4,28,'#fff','Bang','left');txt(r.b,64,26,30,r.col,'Hand','left');X.restore()});X.restore()}
function presenter(t,x,y,pointAng){ // pilot narrator on a floating rock
  X.save();X.fillStyle='#6b5b8a';X.strokeStyle=INK;X.lineWidth=4;X.beginPath();X.ellipse(x,y+8+Math.sin(t*2)*3,70,20,0,0,TAU);X.fill();X.stroke();X.restore();
  const pose={...P.stand,aR:pointAng,aRb:.1,aL:-.3};const yy=y-HIP+Math.sin(t*2)*3;
  drawScarf(t,{x,y:yy},0,1.2,{x:-30*Math.sin(t),y:0},{x:0,y:1});
  drawFigure({x,y:yy,rot:0,s:1.2,pose,face:{eyes:(t%3.7)<.1?'closed':'dot',mouth:'smile',brow:0,look:.6,glasses:0}})}
function round2(t,t0){const e=t-t0;if(e<0)return;const k=eio(clamp(e/.45));X.save();X.fillStyle='#5b33b8';X.beginPath();X.moveTo(W*(1-k)*1.3,0);X.lineTo(W*1.3,0);X.lineTo(W*1.3,H);X.lineTo(W*(1-k)*1.3-260,H);X.closePath();X.fill();
  if(e>.35){const s=back(clamp((e-.35)/.4));X.translate(W/2,H/2-30);X.scale(s,s);X.rotate(-.04);txt('ROUND 2',0,0,170,'#fff','Bang','center',16);txt('KRIS 0  :  1 FACTS',0,130,52,GOLD,'Bang','center',8)}X.restore()}
// ---------- main ----------
window.render=function(T){
  const t=T;BOIL=Math.floor(t*12);X.setTransform(1.5,0,0,1.5,0,0);cv.style.filter='none';
  const sk=shake(t,C("It's true")-.3,.45,16);X.translate(sk.x,sk.y);
  background(t,1,0);
  const endB=C('end1'),cd0=C('end2')+.12,kr0=window.R1.start[3],th0=window.R1.start[6],rv=C("It's true")-.3,re0=window.R1.start[5];
  // ---- title ----
  if(t<C('Here on Earth')+.6){const out=1-seg(t,C('Here on Earth')-.1,C('Here on Earth')+.5);
    drawPlanet(1170,650,170,{...VENUS,spin:t*.05,face:'sleepy'},t);
    claimCard(t,W/2,250+(1-back(clamp(t/.45)))*-500,1,out);tfButtons(t,W/2,470,1,out,null,false,C('True or false'))}
  // ---- build-up ----
  if(t>C('Here on Earth')-.2&&t<endB+.6){const a=clamp((t-C('Here on Earth')+.2)/.4)*(1-clamp((t-endB-.1)/.5));X.save();X.globalAlpha=a;
    const tE=C('Here on Earth'),tY=C('A year is one lap')+.12,tV=C('Venus is closer'),tS=C('But Venus also spins')+.12,tQ=C('So which takes longer');
    const cx=360,cy=370;
    if(t<tY+.8){const z=1-seg(t,tY,tY+.8);// earth close-up -> shrink into orbit
      const ex=lerp(cx+250,cx,z),ey=lerp(cy,cy,z),er=lerp(26,140,z);
      if(z<1)drawSun(cx,cy,lerp(60,20,z),t);
      drawPlanet(z>0.5?cx:ex,ey,er,{...EARTH,spin:(t-tE)*2.2,face:'happy'},t);
      if(z>.6){spinArrow(cx,cy,er+26,-2.2,1,'#5ec8ff','24 HOURS',seg(t,tE+.6,tE+1.4));
        const hrs=Math.min(24,Math.floor(clamp((t-tE-.6)/2.6)*24));txt(hrs+'h',cx,cy+er+48,44,'#fff','Bang','center',7)}}
    if(t>=tY&&t<tS+.6){const k=seg(t,tY,tY+.8);const sa=1-clamp((t-tS)/.6);X.save();X.globalAlpha=a*sa;
      drawSun(cx,cy,60,t);X.strokeStyle='rgba(255,255,255,.35)';X.lineWidth=2;X.setLineDash([6,8]);X.beginPath();X.ellipse(cx,cy,250,130,0,0,TAU);X.stroke();
      const ea=-PI/2+TAU*eio(clamp((t-tY-.4)/3.2))+(t>tY+3.6?(t-tY-3.6)*.6:0);
      // trail
      for(let i=0;i<28;i++){const aa=ea-i*.06;X.fillStyle=`rgba(94,200,255,${.5*(1-i/28)})`;X.beginPath();X.arc(cx+Math.cos(aa)*250,cy+Math.sin(aa)*130,6*(1-i/28),0,TAU);X.fill()}
      drawPlanet(cx+Math.cos(ea)*250,cy+Math.sin(ea)*130,30*k+.1,{...EARTH,spin:t*3,face:'happy'},t);
      const days=Math.round(365*eio(clamp((t-tY-.4)/3.2)));txt(days+' DAYS',cx,cy+175,40,'#5ec8ff','Bang','center',7);
      if(t>tV){const vk=back(clamp((t-tV)/.4));X.setLineDash([6,8]);X.strokeStyle='rgba(255,200,120,.45)';X.beginPath();X.ellipse(cx,cy,155,80,0,0,TAU);X.stroke();X.setLineDash([]);
        const va=PI/2+(t-tV)*2.4;drawPlanet(cx+Math.cos(va)*155,cy+Math.sin(va)*80,24*vk+.1,{...VENUS,spin:t*.1,face:'sleepy'},t);
        txt('closer = shorter lap',cx,cy-170,32,'#ffcf8a','Hand','center',6)}
      X.setLineDash([]);X.restore()}
    if(t>=tS&&t<tQ+.5){const k=back(clamp((t-tS)/.5)),o=1-clamp((t-tQ)/.5);X.save();X.globalAlpha=a*o;
      drawPlanet(cx,cy,150*k+.1,{...VENUS,spin:(t-tS)*.12,face:'sleepy'},t);
      for(let i=0;i<3;i++){const zt=(t*.6+i/3)%1;X.save();X.globalAlpha=a*o*(1-zt);txt('z',cx+120+zt*60+i*8,cy-120-zt*90,30+i*10,'#fff','Bang','center',5);X.restore()}
      if(t>C('really, really slowly')-.2){const gk=seg(t,C('really, really slowly')-.2,C('really, really slowly')+.3,back);X.save();X.translate(cx,cy+205);X.scale(gk,gk);
        X.fillStyle='rgba(10,10,28,.8)';X.beginPath();X.roundRect(-150,-34,300,62,14);X.fill();txt('SPIN SPEED',-70,-2,26,'#fff','Bang');X.fillStyle='rgba(255,255,255,.2)';X.fillRect(10,-12,120,22);X.fillStyle=RED;X.fillRect(10,-12,8+3*Math.sin(t*5),22);X.restore()}
      X.restore()}
    if(t>=tQ){const k=seg(t,tQ,tQ+.4);X.save();X.globalAlpha=a*k;drawPlanet(140,300,40,{...VENUS,spin:t*.05,face:'sleepy'},t);
      const v=.68*eio(clamp((t-tQ-.3)/2.4));bars(t,220,300,420,v,v,t>tQ+2.4);X.restore()}
    // info card
    infoCard(t,seg(t,tE+.3,tE+.9,back)*(1-clamp((t-endB)/.5)),[
      {planet:{...EARTH,spin:t*2},a:'EARTH  1 SPIN',b:'24 hours',col:'#5ec8ff',k:seg(t,tE+.9,tE+1.3)},
      {planet:{...EARTH,spin:t*2},a:'EARTH  1 LAP',b:'365 days',col:'#5ec8ff',k:seg(t,tY+.6,tY+1)},
      {planet:{...VENUS,spin:t*.1},a:'VENUS  1 LAP',b:'shorter...',col:'#ffcf8a',k:seg(t,tV+.6,tV+1)},
      {planet:{...VENUS,spin:t*.1},a:'VENUS  1 SPIN',b:'???',col:'#ffcf8a',k:seg(t,tS+.6,tS+1)}]);
    presenter(t,1190,684,-2.3-.1*Math.sin(t*2));
    X.restore()}
  // ---- countdown + Kris guess + reveal card ----
  if(t>endB+.2&&t<C('two hundred and forty-three')+.3){const inK=seg(t,endB+.2,endB+.7,back);
    const toLeft=seg(t,th0-.4,th0+.2),cx=lerp(W/2,380,toLeft),sc=lerp(1,.68,toLeft);
    const goUp=seg(t,C('two hundred and forty-three')-.6,C('two hundred and forty-three')+.2),y1=lerp(250,120,goUp),fade=1-goUp;
    const reveal=t>=rv;
    claimCard(t,cx,lerp(250,y1,1),sc*inK*(1-goUp*.4),1);
    tfButtons(t,cx,lerp(470,370,toLeft),sc,fade,t>kr0+.05?'FALSE':(t>C('end6')-1.4?'TRUE':(t>th0+.4?(Math.floor((t-th0-.4)*1.6)%2?'FALSE':'TRUE'):null)),reveal,endB+.4);
    if(t<kr0&&t>cd0){txt('COMMENT YOUR GUESS!',cx,lerp(580,470,toLeft),lerp(44,34,toLeft),'#fff','Bang','center',8)}
    countdownRing(t,cd0);
    // drumroll flash before reveal
    if(t>rv-.45&&t<rv){const f=Math.floor(t*16)%2;X.save();X.globalAlpha=.25;X.fillStyle=f?GREEN:RED;X.fillRect(0,0,W,H);X.restore()}
    if(reveal)stamp(cx+30,lerp(250,y1,1)+10,'TRUE',GREEN,seg(t,rv,rv+.28,ei),-.12,140*sc*(1-goUp*.4))}
  // Kris guess PIP
  const kIn=Math.min(seg(t,th0-.45,th0,back),1-seg(t,rv-.1,rv+.25));if(t>th0-.5&&t<rv+.3)krisPIP(t,t<kr0-.1?6:3,720,170,500,320,kIn);
  // ---- explanation ----
  const e0=C('two hundred and forty-three')-.4,tB=C('And it spins backwards'),tW=C('Sun rises in the west');
  if(t>e0&&t<re0+.3){const a=seg(t,e0,e0+.4)*(1-seg(t,re0-.3,re0+.3));X.save();X.globalAlpha=a;
    stamp(130,135,'TRUE',GREEN,1,-.08,64);
    if(t<tB+.4){const o=1-seg(t,tB-.1,tB+.4);X.save();X.globalAlpha=a*o;drawPlanet(170,350,48,{...VENUS,spin:t*.05,face:'shock'},t);
      const sv=243/260*eio(clamp((t-C('two hundred and forty-three'))/1.2)),lv=225/260*eio(clamp((t-C('only two hundred and twenty-five'))/1.2));
      bars(t,260,330,800,sv,lv,false,[sv>.1?Math.round(sv*260)+' DAYS':'',lv>.1?Math.round(lv*260)+' DAYS':'']);
      if(t>C('only two hundred and twenty-five')+1.3){const bk=back(clamp((t-C('only two hundred and twenty-five')-1.3)/.4));X.save();X.translate(260+800*.87,300);X.scale(bk,bk);txt('DAY > YEAR',0,-34,40,GOLD,'Bang','center',7);X.restore()}
      X.restore()}
    if(t>tB-.2){const k=seg(t,tB-.2,tB+.3,back);const vx=W/2,vy=420;X.save();
      drawSun(tW>t?vx-420:lerp(vx-420,vx-330,seg(t,tW,tW+1.2)),tW>t?vy+120:lerp(vy+140,vy-60,seg(t,tW,tW+1.4)),48,t,true);
      drawPlanet(vx,vy,170*k+.1,{...VENUS,spin:-(t-tB)*1.4,face:t>tW?'shock':'smug'},t);
      spinArrow(vx,vy,200,-.6,-1,RED,t<tW-.2?'BACKWARDS':'',seg(t,tB,tB+.7));
      if(t>tW-.1){const wk=seg(t,tW-.1,tW+.3,back);X.save();X.globalAlpha=wk;txt('W',vx-230,vy+30,50,'#fff','Bang','center',7);txt('E',vx+230,vy+30,50,'#fff','Bang','center',7);
        txt('SUN RISES',1040,330,48,GOLD,'Bang','center',8);txt('IN THE WEST',1040,385,48,GOLD,'Bang','center',8);X.restore();
        drawFigure({x:vx,y:vy-170-HIP*.8,rot:0,s:.8,pose:{...P.stand,aL:-2.4,aR:.3},face:{eyes:'wide',mouth:'o',brow:1,look:-.8,glasses:0}})}
      X.restore()}
    X.restore()}
  // ---- Kris reacts ----
  if(t>re0-.6&&t<C('end5')+.6){const k=Math.min(seg(t,re0-.5,re0,back),1-seg(t,C('end5')+.1,C('end5')+.5));
    const vk=seg(t,re0-.3,re0+.3);X.save();X.globalAlpha=vk*k;const gl=seg(t,C('Venus is just doing'),C('Venus is just doing')+.3,back);
    drawPlanet(330,380+Math.sin(t*3)*10,150,{...VENUS,spin:-(t-re0)*2.5,face:'smug',glasses:gl},t);
    spinArrow(330,380,180,-.6,-1,RED,'',vk);X.restore();krisPIP(t,5,700,170,520,330,k)}
  // scoreboard (always, except round 2 card)
  if(t<C('end5')+.8)scoreboard(t,0,1,C("It's true")+.2);
  if(t<endB+.6&&t>.3){X.save();X.globalAlpha=clamp((t-.3)/.3);X.translate(28,38);X.fillStyle=RED;X.strokeStyle=INK;X.lineWidth=3;X.beginPath();X.roundRect(0,-20,170,40,8);X.fill();X.stroke();txt('TRUE OR FALSE?',85,0,24,'#fff','Bang');X.restore()}
  karaoke(t);
  round2(t,C('end5')+.45);
  // vignette, grain, fades
  X.setTransform(1.5,0,0,1.5,0,0);const v=X.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,H*.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.35)');X.fillStyle=v;X.fillRect(0,0,W,H);
  const f=Math.max(1-clamp(t/.3),seg(t,window.R1.total-.4,window.R1.total));if(f>0){X.fillStyle=`rgba(0,0,0,${f})`;X.fillRect(0,0,W,H)}};

function karaokeQ(t){const ws=window.R1.qwords;let cur=-1;for(let i=0;i<ws.length;i++)if(t>=ws[i][1]-.04&&t<=ws[i][2]+.35){cur=i}
  if(cur<0)return;const li=ws[cur][4];
  // chunk: up to 5 words, break after punctuation
  const same=ws.map((w,i)=>[w,i]).filter(([w])=>w[4]===li);const chunks=[];let c=[];for(const[w,i]of same){c.push(i);if(c.length>=5||/[.?!,:]$/.test(w[0])&&c.length>=2){chunks.push(c);c=[]}}if(c.length)chunks.push(c);
  const ch=chunks.find(c=>c.includes(cur));if(!ch)return;const who=ws[cur][3];
  X.save();X.font='44px Bang';const parts=ch.map(i=>ws[i][0].toUpperCase());const sp=14;const widths=parts.map(p=>X.measureText(p).width);const tot=widths.reduce((a,b)=>a+b,0)+sp*(parts.length-1);
  let x=W/2-tot/2;const y=H-58;if(who==='K'){X.fillStyle='#7b4fd6';X.strokeStyle=INK;X.lineWidth=3;X.beginPath();X.roundRect(x-104,y-22,88,40,8);X.fill();X.stroke();txt('KRIS',x-60,y-1,26,'#fff','Bang')}
  parts.forEach((p,j)=>{const i=ch[j],active=t>=ws[i][1]-.04,now=active&&t<=ws[i][2]+.05;const sc=now?1.12:1;X.save();X.translate(x+widths[j]/2,y);X.scale(sc,sc);
    txt(p,0,0,44,now?(who==='K'?'#ff8a8a':GOLD):(active?'#fff':'rgba(255,255,255,.55)'),'Bang','center',9);X.restore();x+=widths[j]+sp});X.restore()}
SKL.length=0;SKL.push('','','','');
SSEQ.length=0;SSEQ.push([[0,'point','wide'],[.45,'cross','lid'],[.78,'talk','lid']],[[0,'talk','lid'],[.55,'palm','lid']],[[0,'point','wide'],[.5,'laugh','happy']],[[0,'shrug','wide'],[.5,'palm','lid']]);
const renderV=window.render;
window.render=function(T){const RR=window.R1;let acc=0,fz=null;
  for(const f of RR.freezes){if(T<f.tv+acc)break;if(T<f.tv+acc+f.dur){fz={f,pt:T-(f.tv+acc)};break}acc+=f.dur}
  if(!fz){window.PAUSED=false;renderV(T-acc);return}
  window.PAUSED=true;renderV(fz.f.tv);X.setTransform(1.5,0,0,1.5,0,0);window.TL={mouth:RR.qmouth};
  pauseFX(T/RR.totalReal*43,fz.pt,fz.f.dur);skeptic(T,fz.f,fz.pt);karaokeQ(T)};
