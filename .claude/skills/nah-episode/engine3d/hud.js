// ===== HUD (2D overlay) + Ricky (cut-out rig drawn over the 3D den) =====
const hudC=document.getElementById('hud');hudC.width=W*DPR;hudC.height=H*DPR;const X=hudC.getContext('2d');
function txt(s,x,y,size,col,{stroke=0,font='Bang',align='center',sc=INK}={}){X.font=`${size}px ${font}`;X.textAlign=align;X.textBaseline='middle';X.lineJoin='round';if(stroke){X.lineWidth=stroke;X.strokeStyle=sc;X.strokeText(s,x,y)}X.fillStyle=col;X.fillText(s,x,y)}
function rrect(x,y,w,h,r,fill,stroke=INK,lw=5){X.beginPath();X.roundRect(x,y,w,h,r);if(fill){X.fillStyle=fill;X.fill()}if(stroke){X.lineWidth=lw;X.strokeStyle=stroke;X.stroke()}}
const pop=(t,t0,d=.25)=>t<t0?0:back((t-t0)/d);
function chip(t,t0,t1,s,x,y,{size=40,bg='#ffd23f',fg=INK,rot=-.03,sub=null}={}){if(t<t0||t>t1)return;const k=pop(t,t0)*(t>t1-.15?clamp((t1-t)/.15):1);if(k<=0)return;
  X.save();X.translate(x,y);X.rotate(rot);X.scale(k,k);X.font=`${size}px Bang`;const w=Math.max(X.measureText(s).width,sub?(X.font=`${size*.6}px Bang`,X.measureText(sub).width):0)+50,h=sub?size*1.9:size*1.35;
  rrect(-w/2+6,-h/2+8,w,h,14,'rgba(0,0,0,.35)',null);rrect(-w/2,-h/2,w,h,14,bg,INK,5);txt(s,0,sub?-size*.35:2,size,fg);if(sub)txt(sub,0,size*.5,size*.6,fg);X.restore()}
// ---- Ricky rig ----
let RD,RF,RIMG={},RNM={},RMK={},RMO={},RMM;
const shotOf=n=>n.startsWith('h_')?'bust':n.startsWith('sit')?'couch':'stand';
const RFR={bust:{sc:1.9,ax:640,fl:770},couch:{sc:1.25,ax:650,fl:700},stand:{sc:1.3,ax:640,fl:708}};
function poseAt(t){const P=RD.poses;let i=0;while(i+1<P.length&&t>=P[i+1].t)i++;return{cur:P[i],prev:P[i-1]||P[i],i}}
function shotChangeT(t){const P=RD.poses;const{i}=poseAt(t);let j=i;while(j>0&&shotOf(P[j-1].p)===shotOf(P[i].p))j--;return P[j].t}
function visAt(t){let v='rest';for(const x of RD.vis){if(x.t>t)break;v=x.v}return RD.words.some(w=>t>=w[1]-.05&&t<=w[2]+.08)?v:'rest'}
function blinkAt(t){const k=Math.floor(t/3.1),s=k*3.1+rnd(k)*1.6+.6;return t>s&&t<s+.13}
const TMP=document.createElement('canvas'),TX=TMP.getContext('2d');
function drawPose(name,t,alpha,squash,talkV,blink){const fr=RFR[shotOf(name)],im=RIMG[name],f=RF[name];if(!im||!f)return;const mx=f.ax||(f.mouth?f.mouth[0]:im.width/2);
  const bob=Math.sin(t*2.4)*.006,sway=Math.sin(t*1.1)*.006;X.save();X.globalAlpha=alpha;X.translate(fr.ax,fr.fl);X.rotate(sway);X.scale(fr.sc*(1+squash*.5),fr.sc*(1+bob-squash));
  if(name==='laugh')X.translate(0,-Math.abs(Math.sin(t*14))*3);X.translate(-mx,-im.height);
  const talk=f.mouth&&!f.noLip&&name!=='facepalm'&&name!=='laugh'&&talkV!=='rest'&&RMO[talkV]&&RNM[name]&&RMK[name];X.drawImage(talk?RNM[name]:im,0,0);
  if(talk){const[cx,cy,w,h]=f.mouth,mm=RMM[talkV],sc=w*.95/RMM.rest.w;if(TMP.width!==im.width||TMP.height!==im.height){TMP.width=im.width;TMP.height=im.height}
    TX.globalCompositeOperation='source-over';TX.clearRect(0,0,TMP.width,TMP.height);TX.drawImage(RMO[talkV],cx-mm.ax*sc,cy-mm.ay*sc,mm.w*sc,mm.h*sc);TX.globalCompositeOperation='destination-in';TX.drawImage(RMK[name],0,0);TX.globalCompositeOperation='source-over';X.drawImage(TMP,0,0)}
  if(blink&&f.eyes){const sk=`rgb(${RF.skin})`;for(const[ex,ey,ew,eh]of f.eyes){X.fillStyle=sk;X.beginPath();X.ellipse(ex,ey,ew/2+2.5*(f.ms||1),eh/2+2.5*(f.ms||1),0,0,TAU);X.fill();X.strokeStyle=INK;X.lineWidth=2.6*(f.ms||1);X.beginPath();X.moveTo(ex-ew/2,ey);X.quadraticCurveTo(ex,ey+3,ex+ew/2,ey-1);X.stroke()}}
  X.restore()}
function drawRicky(t){const{cur,prev}=poseAt(t),u=clamp((t-cur.t)/.14),squash=Math.sin(PI*clamp((t-cur.t)/.22))*.05;const cut=shotOf(prev.p)!==shotOf(cur.p);
  const sh=shotOf(cur.p),fr=RFR[sh];const ct=t-shotChangeT(t),punch=ct<.2?1+.05*(1-ct/.2):1;X.save();X.translate(W/2,H/2);X.scale(punch,punch);X.translate(-W/2,-H/2);
  if(sh!=='bust'){X.fillStyle='rgba(40,10,0,.25)';X.beginPath();X.ellipse(fr.ax+10,fr.fl+2,150,16,0,0,TAU);X.fill()}
  if(u<1&&prev!==cur&&!cut)drawPose(prev.p,t,1-u,0,'rest',false);drawPose(cur.p,t,cut?1:(u<1?u:1),cut?0:squash,visAt(t),blinkAt(t)&&sh!=='bust');X.restore();
  if(ct<.08){X.fillStyle=`rgba(255,255,255,${.25*(1-ct/.08)})`;X.fillRect(0,0,W,H)}}
function karaoke(words,t,y,{size=54,hi='#ffd23f',max=4,cx=W/2,maxw=W-80}={}){let cur=-1;for(let i=0;i<words.length;i++)if(t>=words[i][1]-.04&&t<=words[i][2]+.3)cur=i;if(cur<0)return;
  let s=cur;while(s>0&&cur-s<3&&!/[.?!,:]$/.test(words[s-1][0]))s--;const ch=[];for(let i=s;i<words.length&&ch.length<max;i++){ch.push(i);if(/[.?!,:]$/.test(words[i][0])&&i>=cur)break}
  X.font=`${size}px Bang`;const parts=ch.map(i=>words[i][0].replace(/\.\.\.$/,'…').toUpperCase()),wd=parts.map(p=>X.measureText(p).width),tot=wd.reduce((a,b)=>a+b,0)+16*(parts.length-1);const ks=Math.min(1,maxw/tot);X.save();X.translate(cx,y);X.scale(ks,ks);X.translate(-cx,-y);let x=cx-tot/2;
  parts.forEach((p,j)=>{const i=ch[j],on=t>=words[i][1]-.04&&t<=words[i][2]+.05,act=t>=words[i][1]-.04;X.save();X.translate(x+wd[j]/2,y);if(on)X.scale(1.1,1.1);txt(p,0,0,size,on?hi:(act?'#fff':'rgba(255,255,255,.55)'),{stroke:11});X.restore();x+=wd[j]+16});X.restore()}
// ---- graphics helpers ----
function bars(t,t0,rows,x,y,w){if(t<t0)return;const k=pop(t,t0);X.save();X.translate(x,y);X.scale(k,k);rrect(-20,-40,w+40,rows.length*78+40,18,'rgba(27,18,64,.88)','#ffd23f',5);
  rows.forEach((r,i)=>{const yy=i*78;txt(r.label,0,yy,34,'#fff',{align:'left',stroke:6});const v=r.t0==null?0:clamp((t-r.t0)/(r.d||1.2))*r.v;rrect(170,yy-20,w-180,40,10,'rgba(255,255,255,.12)',null);
    if(v>0)rrect(170,yy-20,(w-180)*v,40,10,r.col,INK,3);txt(r.val&&v>0?(typeof r.val==='function'?r.val(v):r.val):'?',w-10,yy,32,'#fff',{align:'right',stroke:6})});X.restore()}
function brain(t,t0,x,y){if(t<t0)return;const k=pop(t,t0);X.save();X.translate(x,y);X.scale(k,k);rrect(-150,-120,300,250,22,'rgba(27,18,64,.88)','#ffd23f',5);
  X.lineWidth=6;X.strokeStyle=INK;X.fillStyle='#5a6fa8';X.beginPath();X.ellipse(-52,0,62,78,0,0,TAU);X.fill();X.stroke();X.fillStyle='#ff8fb8';X.beginPath();X.ellipse(52,0,62,78,0,0,TAU);X.fill();X.stroke();
  const g=X.createRadialGradient(52,0,10,52,0,90);g.addColorStop(0,'rgba(255,240,150,.7)');g.addColorStop(1,'rgba(255,240,150,0)');X.fillStyle=g;X.fillRect(-10,-90,140,180);
  for(let i=0;i<3;i++){const u=(t*.8+i/3)%1;txt('Z',-52+u*30,-20-u*60,26+i*6,'#fff',{stroke:5})}txt('ASLEEP',-52,100,28,'#fff',{stroke:6});txt('AWAKE',52,100,28,'#ffd23f',{stroke:6});X.restore()}
function label(t,t0,t1,s,pt,{dx=120,dy=-80,col='#ffd23f'}={}){if(t<t0||t>t1||!pt||pt[2]>1)return;const k=pop(t,t0);const[x,y]=pt;X.save();X.globalAlpha=Math.min(1,k);X.strokeStyle='#fff';X.lineWidth=6;X.beginPath();X.moveTo(x,y);X.lineTo(x+dx*.8*k,y+dy*.8*k);X.stroke();
  X.fillStyle='#fff';X.beginPath();X.arc(x,y,8,0,TAU);X.fill();X.restore();chip(t,t0+.1,t1,s,x+dx,y+dy,{size:32,bg:col})}
function flag(t,t0,t1,x,y){if(t<t0||t>t1)return;const k=pop(t,t0);X.save();X.translate(x,y);X.rotate(-.05);X.scale(k,k);rrect(-90,-56,180,112,10,'#fff',INK,5);X.fillStyle='#1d4fa8';X.fillRect(-40,-53,26,106);X.fillRect(-87,-13,174,26);rrect(-90,-56,180,112,10,null,INK,5);txt('FINLAND',0,88,40,'#fff',{stroke:8});X.restore()}
function coins(t,t0,x,y){if(t<t0)return;const k=pop(t,t0);X.save();X.translate(x,y);X.scale(k,k);rrect(-200,-110,400,220,22,'rgba(27,18,64,.9)','#ffd23f',5);txt('DAY-FINES',0,-66,48,'#ffd23f',{stroke:8});
  txt('fine size depends on',0,-14,30,'#fff',{font:'Hand'});txt('HOW MUCH YOU EARN',0,34,40,'#fff',{stroke:7});for(let i=0;i<5;i++){X.fillStyle='#ffd23f';X.strokeStyle=INK;X.lineWidth=4;X.beginPath();X.ellipse(-60+i*30,80-((t*3+i)%1)*0,26,10,0,0,TAU);X.fill();X.stroke()}X.restore()}
