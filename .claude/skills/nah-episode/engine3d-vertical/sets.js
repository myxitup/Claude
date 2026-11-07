// ===== 3D sets =====
const SETS={};
function newSet(name,{bg,fog,fx}={}){const scene=new THREE.Scene();if(bg!==undefined)scene.background=bg;if(fog)scene.fog=fog;const cam=new THREE.PerspectiveCamera(50,W/H,.1,600);const f=mkComposer(scene,cam,fx);const S={name,scene,cam,...f};SETS[name]=S;return S}
const PAL=['#e9875a','#5ec8b4','#e7c25a','#c86fb0','#6f8fe0','#e46a6a','#8fd07a'];
function shade(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.round(k<0?v*(1+k):v+(255-v)*k);return'#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function flatTex(col){return canvasTex(64,64,(c,w,h)=>{c.fillStyle=col;c.fillRect(0,0,w,h);c.strokeStyle=INK;c.lineWidth=6;c.strokeRect(3,3,w-6,h-6)})}

// ---------------- STUDIO (game-show set) ----------------
(function(){const S=newSet('studio',{bg:new THREE.Color('#2a1a5e'),fog:new THREE.Fog(0x2a1a5e,40,110),fx:{focus:14,aperture:.0009,maxblur:.008}});const sc=S.scene;lights(sc,.8,1.0,[4,18,14]);
  // spinning ray backdrop
  const rays=canvasTex(1024,1024,(c,w,h)=>{const n=24;for(let i=0;i<n;i++){c.fillStyle=i%2?'#ffb547':'#ff7a3d';c.beginPath();c.moveTo(w/2,h/2);c.arc(w/2,h/2,w*.75,i/n*TAU,(i+1)/n*TAU);c.closePath();c.fill()}
    const g=c.createRadialGradient(w/2,h/2,40,w/2,h/2,w*.5);g.addColorStop(0,'rgba(255,240,180,.9)');g.addColorStop(1,'rgba(255,240,180,0)');c.fillStyle=g;c.fillRect(0,0,w,h)});
  S.rays=mesh(sc,new THREE.CircleGeometry(38,64),basic(0xffffff,{map:rays,fog:false}),{y:12,z:-30});
  mesh(sc,new THREE.TorusGeometry(38,1.2,12,80),toon(0x7b2ff2),{y:12,z:-29.8});
  // stage floor: tiles in a disc
  const floor=canvasTex(1024,1024,(c,w,h)=>{c.fillStyle='#3b1f7a';c.fillRect(0,0,w,h);const cols=['#ff4f8b','#ffd23f','#3ec6ff','#7cff6b','#b06bff'];
    for(let r=0;r<9;r++)for(let a=0;a<24;a++){c.fillStyle=cols[(r+a)%5];c.globalAlpha=.85;c.beginPath();const r0=r*56+40,r1=r0+50,a0=a/24*TAU,a1=(a+1)/24*TAU-.02;c.arc(w/2,h/2,r1,a0,a1);c.arc(w/2,h/2,r0,a1,a0,true);c.closePath();c.fill()}c.globalAlpha=1});
  mesh(sc,new THREE.CircleGeometry(30,64),basic(0xffffff,{map:floor}),{rx:-PI/2,y:0});
  const stage=mesh(sc,new THREE.CylinderGeometry(7,7.4,.7,48),toon(0x2b2b6e),{y:.35,inkT:.04});
  mesh(sc,new THREE.TorusGeometry(7.05,.12,8,64),basic(0xffe27a),{rx:PI/2,y:.72});
  S.bulbs=[];for(let i=0;i<36;i++){const a=i/36*TAU;S.bulbs.push(mesh(sc,new THREE.SphereGeometry(.13,8,6),basic(0xfff3b0),{x:Math.cos(a)*7.25,y:.35,z:Math.sin(a)*7.25}))}
  // TRUE / FALSE blocks on pedestals
  function block(label,col,x){const g=new THREE.Group();const face=canvasTex(512,256,(c,w,h)=>{c.fillStyle=col;c.fillRect(0,0,w,h);c.strokeStyle=INK;c.lineWidth=16;c.strokeRect(8,8,w-16,h-16);ctxt(c,label,w/2,h/2+8,150,'#fff',{stroke:22})});
    const side=toon(shade(col,-.25));const mats=[side,side,toon(shade(col,.15)),side,basic(0xffffff,{map:face}),side];
    const b=new THREE.Mesh(new THREE.BoxGeometry(4.2,2.1,1.2),mats);b.position.y=1.05;ink(b,.05);g.add(b);
    const ped=mesh(g,new THREE.CylinderGeometry(1.1,1.4,1.6,24),toon(0x4a3a9a),{y:-.8,inkT:.04});g.position.set(x,2.3,0);sc.add(g);g.userData.box=b;g.userData.face=face;return g}
  S.T=block('TRUE','#2fbf71',-3.3);S.F=block('FALSE','#e5383b',3.3);
  // scoreboard
  S.board=canvasTex(1024,300,()=>{});S.drawBoard=(r,f)=>{const c=S.board.userData.ctx,w=1024,h=300;c.clearRect(0,0,w,h);c.fillStyle='#1b1240';c.beginPath();c.roundRect(10,10,w-20,h-20,40);c.fill();c.strokeStyle='#ffd23f';c.lineWidth=14;c.stroke();
    ctxt(c,'RICKY',230,150,110,'#3ec6ff',{stroke:16});ctxt(c,'FACTS',800,150,110,'#ff4f8b',{stroke:16});ctxt(c,`${r} : ${f}`,512,155,150,'#fff',{stroke:18});S.board.needsUpdate=true};S.drawBoard(0,0);
  const bd=mesh(sc,new THREE.BoxGeometry(8.4,2.5,.5),toon(0x1b1240),{y:9.2,z:-4,inkT:.05});mesh(bd,new THREE.PlaneGeometry(8.2,2.4),basic(0xffffff,{map:S.board}),{z:.26});S.bd=bd;
  // floating question marks
  const qtex=canvasTex(256,256,(c,w,h)=>ctxt(c,'?',w/2,h/2+10,230,'#ffd23f',{stroke:26}));S.qs=[];
  for(let i=0;i<10;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:qtex,transparent:true}));const a=i/10*TAU;sp.position.set(Math.cos(a)*12,3+rnd(i)*7,Math.sin(a)*6-8);sp.scale.set(1.6,1.6,1);sp.userData.base=sp.position.clone();sc.add(sp);S.qs.push(sp)}
  // light beams
  S.beams=[];for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(2.2,22,24,1,true),new THREE.MeshBasicMaterial({color:['#ff4f8b','#3ec6ff','#ffd23f'][i%3],transparent:true,opacity:.13,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));
    m.geometry.translate(0,-11,0);m.position.set(-15+i*6,20,-6);sc.add(m);S.beams.push(m)}
  // confetti
  const cg=new THREE.PlaneGeometry(.18,.28);S.conf=[];const ccol=[0xff4f8b,0xffd23f,0x3ec6ff,0x7cff6b,0xffffff];
  for(let i=0;i<220;i++){const m=new THREE.Mesh(cg,new THREE.MeshBasicMaterial({color:ccol[i%5],side:THREE.DoubleSide}));m.visible=false;sc.add(m);S.conf.push(m)}
  S.update=function(ctx){const{t,lt,seg}=ctx;const k=seg.kind;if(window.SHORT)S.bd.visible=false;
    S.rays.rotation.z=t*.12;S.beams.forEach((b,i)=>{b.rotation.z=Math.sin(t*.7+i)*.35;b.rotation.x=Math.cos(t*.5+i*2)*.2});S.qs.forEach((q,i)=>{q.position.y=q.userData.base.y+Math.sin(t*1.5+i)*.4});
    S.bulbs.forEach((b,i)=>b.material.color.set(((i+Math.floor(t*6))%3)?0xfff3b0:0xff4f8b));
    const sc0=seg.score||[0,0];let sr=sc0[0],sf=sc0[1];
    // blocks idle bob
    let tj=0,fj=0,tg=1,fg=1;
    if(k==='lock'){const u=t-seg.count;if(u>0&&u<5){const s=Math.floor(u)%2;tj=s?0:.25;fj=s?.25:0}}
    if(k==='reveal'){const u=t-seg.a;if(t<seg.stamp){const s=Math.floor(u*10)%2;tg=s?1.6:.6;fg=s?.6:1.6}else{const win=seg.verdict==='TRUE'?S.T:S.F;const v=t-seg.stamp;if(seg.verdict==='TRUE'){tj=1.2*Math.sin(Math.min(PI,v*6))*.6+.5*eo(v*3);tg=1.8;fg=.35}else{fj=.5*eo(v*3)+1.2*Math.sin(Math.min(PI,v*6))*.6;fg=1.8;tg=.35}}}
    if(k==='outro'||k==='end'){tg=fg=1}
    if(VERT){S.T.position.x=-2.3;S.F.position.x=2.3;S.T.scale.setScalar(.85);S.F.scale.setScalar(.85)}S.T.position.y=2.3+Math.sin(t*2)*.08+tj;S.F.position.y=2.3+Math.sin(t*2+1)*.08+fj;
    S.T.userData.box.material[4].color.setScalar(Math.min(tg,1.4));S.F.userData.box.material[4].color.setScalar(Math.min(fg,1.4));
    const want=`${sr}:${sf}`;if(S._sc!==want){S._sc=want;S.drawBoard(sr,sf)}
    // confetti after stamp
    const cs=k==='reveal'?t-seg.stamp:(k==='end'?t-seg.a:-1);
    S.conf.forEach((m,i)=>{if(cs<0||cs>3){m.visible=false;return}m.visible=true;const a=rnd(i)*TAU,sp=4+rnd(i+1)*9,vy=6+rnd(i+2)*8;m.position.set(Math.cos(a)*sp*cs*.6+(seg.verdict==='FALSE'?3.3:-3.3)*(k==='reveal'),4+vy*cs-6*cs*cs,Math.sin(a)*sp*cs*.4);m.rotation.set(t*5+i,t*3+i*2,0)});
    // camera per segment kind
    let K;const d=seg.b-seg.a;
    if(k==='intro')K=[[0,[0,22,34],[0,6,-10],30,55],[d*.55,[0,6,15],[0,4,0],15,50],[d,[1.5,4.6,12.5],[0,4.2,0],13,48]];
    else if(k==='wipe')K=[[0,[-6,5,14],[0,6,-4],15,50],[d,[0,7.5,8],[0,9,-4],10,44]];
    else if(k==='claim')K=[[0,[-7,4.5,13],[0,3.8,0],14,50],[d,[6,4.8,12.5],[0,4,0],14,48]];
    else if(k==='lock'){const u=t-seg.a,c0=seg.count-seg.a;K=[[0,[0,5,14],[0,4,0],14,50],[c0,[0,4.4,11.5],[0,3.8,0],12,48],[c0+5,[0,3.8,8.5],[0,3.4,0],8.5,46],[d,[0,3.8,8.2],[0,3.4,0],8.5,46]]}
    else if(k==='reveal'){const st=seg.stamp-seg.a,x=seg.verdict==='TRUE'?-3.3:3.3;K=[[0,[0,4,9],[0,3.4,0],9,48],[st,[0,4.2,10.5],[0,3.6,0],10,50],[st+.35,[x*.6,4,7.5],[x,3.6,0],7.5,46],[d,[x*.7,4.2,7],[x,3.8,0],7,44]]}
    else if(k==='outro')K=[[0,[0,7,16],[0,8,-4],16,50],[d,[0,8.6,10],[0,9,-4],12,46]];
    else K=[[0,[0,8.6,10],[0,9,-4],12,46],[d,[0,14,24],[0,8,-4],24,52]];
    const c=keys(K,lt);applyCam(S.cam,c,t,.06);S.bokeh.uniforms.focus.value=c.f;
    let shake=0;if(k==='reveal'){const v=t-seg.stamp;if(v>0&&v<.35)shake=.25*(1-v/.35);if(t<seg.stamp)shake=.03}
    if(shake){S.cam.position.x+=(rnd(t*97)-.5)*shake;S.cam.position.y+=(rnd(t*71)-.5)*shake}
  };
})();

// ---------------- DEN (Ricky's room) ----------------
(function(){const S=newSet('den',{bg:new THREE.Color('#ffd9a0'),fx:{focus:6,aperture:.002,maxblur:.012}});const sc=S.scene;lights(sc,.85,.9,[-3,8,8]);
  // walls with stripes
  const wall=canvasTex(1024,512,(c,w,h)=>{c.fillStyle='#ffb04a';c.fillRect(0,0,w,h);c.fillStyle='#ffc46e';for(let x=0;x<w;x+=64)c.fillRect(x,0,30,h);c.fillStyle='#e8892e';c.fillRect(0,h-60,w,60);c.fillStyle=INK;c.fillRect(0,h-66,w,8)});
  mesh(sc,new THREE.PlaneGeometry(16,7),basic(0xffffff,{map:wall}),{y:3.5,z:-4});
  mesh(sc,new THREE.PlaneGeometry(10,7),basic(0xffffff,{map:wall}),{x:-8,y:3.5,z:1,ry:PI/2});mesh(sc,new THREE.PlaneGeometry(10,7),basic(0xffffff,{map:wall}),{x:8,y:3.5,z:1,ry:-PI/2});
  const fl=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#b5774a';c.fillRect(0,0,w,h);c.fillStyle='rgba(0,0,0,.12)';for(let y=0;y<h;y+=48)c.fillRect(0,y,w,4);for(let i=0;i<40;i++)c.fillRect(rnd(i)*w,Math.floor(rnd(i+3)*10)*48,4,48)});fl.wrapS=fl.wrapT=THREE.RepeatWrapping;fl.repeat.set(3,3);
  mesh(sc,new THREE.PlaneGeometry(16,12),basic(0xffffff,{map:fl}),{rx:-PI/2,z:1});
  // rug
  const rug=canvasTex(512,256,(c,w,h)=>{c.fillStyle='#7b2ff2';c.beginPath();c.ellipse(w/2,h/2,w/2-6,h/2-6,0,0,TAU);c.fill();c.strokeStyle=INK;c.lineWidth=8;c.stroke();c.strokeStyle='#ffd23f';c.lineWidth=14;c.beginPath();c.ellipse(w/2,h/2,w/2-40,h/2-30,0,0,TAU);c.stroke()});
  mesh(sc,new THREE.PlaneGeometry(6,3),basic(0xffffff,{map:rug,transparent:true}),{rx:-PI/2,y:.01,z:-.6});
  // window with daytime sky
  const sky=canvasTex(512,384,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#3d9bff');g.addColorStop(1,'#bfe6ff');c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='#fff';[[120,120,40],[170,110,50],[220,125,38],[380,220,30],[420,210,40]].forEach(([x,y,r])=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill()});
    c.fillStyle='#8fd07a';c.fillRect(0,h-70,w,70);c.fillStyle='#6f8fe0';c.fillRect(60,h-160,80,90);c.fillStyle='#e46a6a';c.fillRect(300,h-200,90,130)});
  mesh(sc,new THREE.PlaneGeometry(2.6,2),basic(0xffffff,{map:sky}),{x:-2.6,y:3.6,z:-3.98});
  const frm=toon(0xffffff);[[-2.6,4.62,2.8,.14],[-2.6,2.58,2.8,.14]].forEach(([x,y,w,h])=>mesh(sc,new THREE.BoxGeometry(w,h,.12),frm,{x,y,z:-3.92,inkT:.02}));[[-3.95],[-1.25],[-2.6]].forEach(([x])=>mesh(sc,new THREE.BoxGeometry(.12,2.1,.12),frm,{x,y:3.6,z:-3.92,inkT:.02}));
  // poster
  const post=canvasTex(256,320,(c,w,h)=>{c.fillStyle='#f4ead2';c.fillRect(0,0,w,h);c.strokeStyle=INK;c.lineWidth=10;c.strokeRect(5,5,w-10,h-10);ctxt(c,'NAH.',w/2,130,120,'#e5383b',{stroke:10});ctxt(c,'I don’t believe that',w/2,240,30,INK,{font:'Hand'})});
  const pm=mesh(sc,new THREE.PlaneGeometry(1.3,1.62),basic(0xffffff,{map:post}),{x:2.7,y:3.7,z:-3.97,rz:-.05});
  // shelf + plant + TV on side
  mesh(sc,new THREE.BoxGeometry(1.8,.12,.5),toon(0x8a5a3a),{x:4.6,y:2.9,z:-3.7,inkT:.02});
  mesh(sc,new THREE.CylinderGeometry(.25,.2,.4,16),toon(0xe5383b),{x:4.2,y:3.15,z:-3.7,inkT:.02});mesh(sc,new THREE.SphereGeometry(.42,14,10),toon(0x2fbf71),{x:4.2,y:3.65,z:-3.7,inkT:.02});
  mesh(sc,new THREE.BoxGeometry(.5,.6,.3),toon(0x3ec6ff),{x:5.0,y:3.26,z:-3.7,inkT:.02});
  // floor lamp
  mesh(sc,new THREE.CylinderGeometry(.04,.04,3,8),toon(0x3a3048),{x:4.6,y:1.5,z:-2.6});mesh(sc,new THREE.ConeGeometry(.5,.6,20,1,true),toon(0xffe0a6,{side:THREE.DoubleSide}),{x:4.6,y:3.1,z:-2.6,inkT:.02});glow(sc,0xffd090,3,{x:4.6,y:3.0,z:-2.5,op:.5});
  mesh(sc,new THREE.CylinderGeometry(.4,.45,.08,20),toon(0x3a3048),{x:4.6,y:.04,z:-2.6});
  // couch (rounded boxes)
  const C=toon(0x2fb5a3),C2=toon(0x38c7b4);const rb=(w,h,d,r)=>{const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const g=new THREE.ExtrudeGeometry(s,{depth:d-.1,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:2});g.translate(0,0,-(d-.1)/2);return g};
  const couch=new THREE.Group();sc.add(couch);couch.position.set(0,0,-2.6);
  mesh(couch,rb(3.8,1.1,.5,.2),C,{y:1.05,z:-.55,inkT:.03});mesh(couch,rb(3.8,.5,1.3,.15),C,{y:.38,z:0,inkT:.03});
  mesh(couch,rb(1.75,.26,1.1,.1),C2,{x:-.92,y:.74,z:.08,inkT:.025});mesh(couch,rb(1.75,.26,1.1,.1),C2,{x:.92,y:.74,z:.08,inkT:.025});
  for(const x of[-2.05,2.05])mesh(couch,rb(.45,1.0,1.5,.18),C,{x,y:.62,z:-.05,inkT:.03});
  mesh(couch,new THREE.SphereGeometry(.28,12,8),toon(0xffd23f),{x:-1.5,y:1.05,z:-.15,s:[1.2,.9,.6],inkT:.02});
  // coffee table with remote + popcorn
  mesh(sc,new THREE.CylinderGeometry(.9,.9,.1,28),toon(0x8a5a3a),{x:2.4,y:.55,z:-.3,inkT:.02});mesh(sc,new THREE.CylinderGeometry(.08,.08,.5,8),toon(0x5a3a2a),{x:2.4,y:.27,z:-.3});
  mesh(sc,new THREE.CylinderGeometry(.22,.17,.36,14),toon(0xe5383b),{x:2.2,y:.78,z:-.3,inkT:.02});
  // camera presets per shot type
  S.cam.userData.noBoost=true;S.SHOTS={couch:{p:[0,1.7,4.6],l:[0,1.25,-2],f:6.8,fov:50},stand:{p:[0,1.7,4.6],l:[0,1.25,-2],f:6.8,fov:50},bust:{p:[.2,2.05,2.2],l:[0,1.95,-2.6],f:3.2,fov:46}};
  S.update=function(ctx){const sh=S.SHOTS[ctx.shot||'couch'],t=ctx.t,u=ctx.shotT||0;const punch=u<.2?(1-u/.2)*3:0;
    applyCam(S.cam,{p:[sh.p[0]+Math.sin(t*.4)*.06,sh.p[1],sh.p[2]-Math.min(u,8)*.02],l:sh.l,f:sh.f,fov:sh.fov-punch},t,.015);S.bokeh.uniforms.focus.value=sh.f;S.bokeh.uniforms.aperture.value=ctx.shot==='bust'?.004:.0015};
})();

// ---------------- shared props ----------------
function mkCar(scene,col=0xe5383b,{stripe=0xffffff}={}){const g=new THREE.Group(),body=new THREE.Group();g.add(body);const RED=toon(col),GLASS=toon(0x9fd8ff),DARK=toon(0x2a2833),HUB=toon(0xc9ced6);
  const ex=(shape,depth,bev,mat)=>{const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev,bevelSegments:3,curveSegments:16});geo.translate(0,0,-depth/2);const m=new THREE.Mesh(geo,mat);body.add(m);return m};
  const s=new THREE.Shape();s.moveTo(-2.05,.38);s.lineTo(2.05,.38);s.quadraticCurveTo(2.25,.4,2.2,.72);s.quadraticCurveTo(2.12,1.02,1.45,1.08);s.lineTo(-1.75,1.12);s.quadraticCurveTo(-2.15,1.08,-2.05,.38);ink(ex(s,1.7,.14,RED),.035);
  const c=new THREE.Shape();c.moveTo(-1.5,1.05);c.lineTo(.95,1.05);c.quadraticCurveTo(.6,1.7,.15,1.78);c.lineTo(-.95,1.8);c.quadraticCurveTo(-1.3,1.78,-1.5,1.05);ink(ex(c,1.36,.1,RED),.03);
  const w=new THREE.Shape();w.moveTo(-1.32,1.15);w.lineTo(-.4,1.15);w.lineTo(-.4,1.68);w.lineTo(-.98,1.7);w.quadraticCurveTo(-1.22,1.66,-1.32,1.15);
  const w2=new THREE.Shape();w2.moveTo(-.25,1.15);w2.lineTo(.78,1.15);w2.quadraticCurveTo(.5,1.6,.12,1.67);w2.lineTo(-.25,1.68);w2.closePath();ex(w,1.6,0,GLASS);ex(w2,1.6,0,GLASS);
  const ws=new THREE.Shape();ws.moveTo(.98,1.12);ws.lineTo(1.04,1.14);ws.quadraticCurveTo(.68,1.78,.18,1.86);ws.lineTo(.16,1.8);ws.quadraticCurveTo(.62,1.72,.98,1.12);ex(ws,1.24,0,GLASS);
  const rs=new THREE.Shape();rs.moveTo(-1.6,1.16);rs.lineTo(-1.68,1.16);rs.quadraticCurveTo(-1.45,1.9,-.95,1.93);rs.lineTo(-.95,1.86);rs.quadraticCurveTo(-1.4,1.84,-1.6,1.16);ex(rs,1.2,0,GLASS);
  const st=new THREE.Mesh(new THREE.BoxGeometry(3.4,.1,2.02),toon(stripe));st.position.set(.05,.82,0);body.add(st);
  for(const x of[2.27,-2.17]){const b=new THREE.Mesh(new THREE.BoxGeometry(.18,.22,1.9),DARK);b.position.set(x,.48,0);body.add(b);ink(b,.025)}
  for(const z of[-.6,.6]){const hl=new THREE.Mesh(new THREE.SphereGeometry(.15,16,10),basic(0xfff6c0));hl.scale.set(.7,1,1.3);hl.position.set(2.27,.8,z);body.add(hl);ink(hl,.02);
    const tl=new THREE.Mesh(new THREE.BoxGeometry(.06,.18,.34),basic(0xff2a2a));tl.position.set(-2.18,.82,z);body.add(tl)}
  const wheels=[];for(const x of[-1.35,1.35])for(const z of[-.92,.92]){const wg=new THREE.Group();const ty=new THREE.Mesh(new THREE.CylinderGeometry(.44,.44,.34,28),DARK);ty.rotation.x=PI/2;wg.add(ty);ink(ty,.03);
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.38,6),HUB);hub.rotation.x=PI/2;wg.add(hub);wg.position.set(x,.44,z);g.add(wg);wheels.push(wg)}
  g.rotation.y=PI/2;g.scale.setScalar(1.1);g.userData={wheels,body};scene.add(g);return g}
function skyTex(top,mid,bot,clouds=true,sun=true){return canvasTex(1024,512,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(.7,mid);g.addColorStop(1,bot);c.fillStyle=g;c.fillRect(0,0,w,h);
  if(sun){c.fillStyle='#fff1a0';c.strokeStyle=INK;c.lineWidth=6;c.beginPath();c.arc(w*.82,h*.17,34,0,TAU);c.fill();c.stroke()}
  if(clouds){const cloud=(x,y,s)=>{const P=[[0,0,1],[.9,-.3,.8],[1.7,.05,.75],[-.85,.1,.7],[.4,.35,.8]];c.strokeStyle=INK;c.lineWidth=6;for(const[a,b,r]of P){c.beginPath();c.arc(x+a*s,y+b*s,r*s,0,TAU);c.stroke()}c.fillStyle='#fff';for(const[a,b,r]of P){c.beginPath();c.arc(x+a*s,y+b*s,r*s,0,TAU);c.fill()}};
  [[80,90,26],[330,60,20],[560,120,24],[760,70,16],[930,150,22],[200,190,14]].forEach(a=>cloud(...a))}})}

// ---------------- STREET (Finland) ----------------
(function(){const S=newSet('street',{bg:skyTex('#3d9bff','#9fd4ff','#dff2ff'),fog:new THREE.Fog(0xcbe7ff,45,150),fx:{focus:16,aperture:.0016,maxblur:.012}});const sc=S.scene;lights(sc);
  const road=canvasTex(512,2048,(c,w,h)=>{c.fillStyle='#5d5b6b';c.fillRect(0,0,w,h);c.fillStyle='#cfc7b8';c.fillRect(0,0,70,h);c.fillRect(w-70,0,70,h);c.fillStyle='#8f8878';for(let y=0;y<h;y+=64){c.fillRect(0,y,70,3);c.fillRect(w-70,y,70,3)}c.fillStyle='#2a2833';c.fillRect(70,0,8,h);c.fillRect(w-78,0,8,h);c.fillStyle='#fff4c8';for(let y=0;y<h;y+=120)c.fillRect(w/2-6,y,12,70)});
  road.wrapT=THREE.RepeatWrapping;road.repeat.set(1,4);mesh(sc,new THREE.PlaneGeometry(16,240),basic(0xffffff,{map:road}),{rx:-PI/2,z:-90});mesh(sc,new THREE.PlaneGeometry(60,240),basic(0xcfc7b8),{rx:-PI/2,y:-.01,z:-90});
  function building(i,h,col,w){return canvasTex(512,Math.round(512*h/w),(c,cw,ch)=>{c.fillStyle=col;c.strokeStyle=INK;c.lineWidth=14;c.fillRect(0,0,cw,ch);c.strokeRect(7,7,cw-14,ch-14);c.fillStyle='rgba(0,0,0,.10)';c.fillRect(cw-60,20,40,ch-30);c.fillStyle=shade(col,-.35);c.fillRect(0,0,cw,44);c.strokeRect(7,7,cw-14,37);
    const cols=3+(i%2),rows=Math.max(2,Math.floor((ch-180)/120)),ww=(cw-80)/cols;
    for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const x0=40+k*ww+10,y0=90+r*120,bw=ww-30;const open=rnd(i*31+r*7+k)>.7;c.fillStyle=open?'#3d5670':'#bfe6ff';c.lineWidth=8;c.beginPath();c.roundRect(x0,y0,bw,80,6);c.fill();c.stroke();
      if(!open){c.save();c.clip();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.moveTo(x0+bw*.2,y0);c.lineTo(x0+bw*.45,y0);c.lineTo(x0+bw*.1,y0+80);c.lineTo(x0-bw*.15,y0+80);c.fill();c.restore()}c.fillStyle=shade(col,-.2);c.fillRect(x0-6,y0+80,bw+12,10);c.strokeRect(x0-6,y0+80,bw+12,10)}
    const sh=rnd(i*13)>.5;c.fillStyle=sh?'#3a2a20':'#2f4a5e';c.lineWidth=10;c.beginPath();c.roundRect(cw/2-60,ch-150,120,150,8);c.fill();c.stroke();
    if(sh){c.fillStyle=['#e5383b','#2f8f6a','#e7a13a'][i%3];c.beginPath();c.moveTo(cw/2-110,ch-170);c.lineTo(cw/2+110,ch-170);c.lineTo(cw/2+130,ch-120);c.lineTo(cw/2-130,ch-120);c.closePath();c.fill();c.stroke()}})}
  for(let i=0;i<16;i++)for(const s of[-1,1]){const w=6+rnd(i*3+s)*3,h=8+rnd(i*5+s)*9,d=5,z=8-i*6.2-(s>0?3:0),col=PAL[(i+(s>0?3:0))%PAL.length];const B=m=>basic(0xffffff,{map:m}),side=B(flatTex(shade(col,-.22))),roof=B(flatTex(shade(col,-.45)));
    const geo=new THREE.BoxGeometry(w,h,d);geo.translate(0,h/2,-d/2);const m=new THREE.Mesh(geo,[side,side,roof,roof,B(building(i+(s>0?50:0),h,col,w)),side]);m.position.set(s*(10+rnd(i)*1.2),0,z);m.rotation.y=s>0?-PI/2:PI/2;sc.add(m)}
  card(sc,canvasTex(2048,512,(c,w,h)=>{for(let i=0;i<40;i++){const bw=40+rnd(i)*80,bh=120+rnd(i+2)*330,x=i*52;c.fillStyle='#93b8dd';c.fillRect(x,h-bh,bw,bh)}}),120,30,{z:-150,fog:false});
  function mkLamp(){const g=new THREE.Group(),M=toon(0x3b5a6e);mesh(g,new THREE.CylinderGeometry(.09,.14,5.4,12),M,{y:2.7,inkT:.025});
    mesh(g,new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,5.3,0),new THREE.Vector3(0,6.1,0),new THREE.Vector3(-1.1,5.8,0)),16,.07,8),M,{inkT:.02});mesh(g,new THREE.SphereGeometry(.34,20,12),M,{x:-1.15,y:5.68,s:[1.3,.5,1],inkT:.025});return g}
  const l0=mkLamp();for(let i=0;i<12;i++)for(const s of[-1,1]){const z=4-i*11-(s>0?5.5:0);const l=l0.clone();l.position.set(s*6.6,0,z);l.rotation.y=s>0?0:PI;sc.add(l)}
  const mkScam=()=>canvasTex(256,256,(c,w,h)=>{c.fillStyle='#ffd23f';c.fillRect(0,0,w,h);c.strokeStyle=INK;c.lineWidth=12;c.strokeRect(6,6,w-12,h-12);c.fillStyle=INK;c.beginPath();c.arc(w/2,105,62,0,TAU);c.fill();c.fillStyle='#4a5a80';c.beginPath();c.arc(w/2,105,40,0,TAU);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(w/2-14,92,11,0,TAU);c.fill();ctxt(c,'SPEED',w/2,226,54,INK)});
  S.SCZ=-46;const scam=new THREE.Group();mesh(scam,new THREE.CylinderGeometry(.09,.11,3.5,12),toon(0x8a8f9a),{y:1.75,inkT:.025});mesh(scam,new THREE.BoxGeometry(1.1,1.1,.9),toon(0xffd23f),{y:3.95,inkT:.03});mesh(scam,new THREE.BoxGeometry(1.2,.12,1.1),toon(0x3a3844),{y:4.55,z:.05,inkT:.02});
  S.scamFace=mesh(scam,new THREE.PlaneGeometry(1.06,1.06),basic(0xffffff,{map:mkScam()}),{y:3.95,z:.46});S.mkScam=mkScam;scam.position.set(5.2,0,S.SCZ);scam.rotation.y=-.45;sc.add(scam);shadow(sc,5.2,S.SCZ,1,.4);
  S.flash=glow(sc,0xffffff,.1,{x:5.0,y:3.85,z:S.SCZ+.6});
  S.car=mkCar(sc,0x3e7bd6,{});S.gold=mkCar(sc,0xf2c230,{stripe:0x1b1240});S.gold.scale.set(1.25,1.15,1.25);
  // giant 3D ticket
  const tk=canvasTex(1024,1300,(c,w,h)=>{c.fillStyle='#fffaf0';c.strokeStyle=INK;c.lineWidth=18;c.beginPath();c.roundRect(20,20,w-40,h-40,30);c.fill();c.stroke();c.fillStyle='#e5383b';c.fillRect(29,29,w-58,170);ctxt(c,'SPEEDING FINE',w/2,120,120,'#fff');
    ctxt(c,'AMOUNT DUE:',w/2,400,70,INK,{font:'Hand'});ctxt(c,'€121,000',w/2,640,230,'#e5383b');ctxt(c,'14 day-fines · based on income',w/2,820,54,'#5a5560',{font:'Hand'});for(let i=0;i<60;i++){c.fillStyle=INK;c.fillRect(120+i*13,940,i%3?6:11,150)}});
  S.mkTicketTex=()=>tk;S.ticket=new THREE.Group();const tm=mesh(S.ticket,new THREE.BoxGeometry(4,5.08,.12),[toon(0xfffaf0),toon(0xfffaf0),toon(0xfffaf0),toon(0xfffaf0),basic(0xffffff,{map:tk}),toon(0xfffaf0)],{y:2.54,inkT:.04});S.ticketMesh=tm;sc.add(S.ticket);
  const flashAt=(lt,tf)=>tf==null?0:(lt>tf?Math.max(0,1-(lt-tf)/.35):0);
  S.update=function(ctx){const{t,lt,seg,w}=ctx;let K,fl=0;S.ticket.visible=false;
    if(seg.kind==='build'){
      // car 1 passes from behind, flashed at the speed camera
      const c1=lt<.4?18:18-17.3*(lt-.4);S.car.position.set(-2.4,0,c1);S.car.visible=c1>-170;const tf1=.4+(18-S.SCZ)/17.3;fl=flashAt(lt,tf1);
      const tR=w('Which'),tC=w('caught')+.15,z0=-14;const gz=lt<tR?40:z0-(z0-S.SCZ)*(lt-tR)/(tC-tR);S.gold.position.set(2.4,0,gz);S.gold.rotation.y=PI/2;S.gold.visible=lt>tR;
      fl=Math.max(fl,flashAt(lt,tC));
      const tF=w('Finland'),tD=w('day-fines'),tB=w('bigger'),tE=w('earn');
      K=[[0,[0,2.6,14],[0,2.4,-20],16],[tf1-.4,[0,2.4,-14],[1.5,2.4,-46],18],[tf1+.2,[2.2,2.6,-34],[5.2,3.6,S.SCZ],12],[tD,[1.8,2.4,-35],[5.2,3.4,S.SCZ],12],
         [tE+.4,[-1,5.5,-28],[3,2.5,-46],18],[tB+.3,[-3,3.2,-24],[2,1.5,-40],18],[tR+.4,[4.2,2.0,-36.5],[1.5,1.2,-10],12],[tC,[4.4,2.2,-37.5],[2.4,1,-30],8],[ctx.dur,[4.4,2.1,-38.5],[2.4,1,-30],8]];
    }else{ // why: giant ticket slams onto the street next to the gold car
      S.car.visible=false;S.gold.visible=true;S.gold.position.set(-3.2,0,-60);S.gold.rotation.y=-.6;
      const tO=w('one'),u=clamp((lt-tO+.2)/.5);S.ticket.visible=lt>tO-.3;S.ticket.position.set(1.6,lerp(14,0,ei(u)),-62);S.ticket.rotation.set(0,-.25,(1-u)*.5);
      const sl=lt-(tO+.3);if(sl>0&&sl<.3){S.ticket.scale.set(1+.08*Math.sin(sl/.3*PI),1-.08*Math.sin(sl/.3*PI),1)}else S.ticket.scale.set(1,1,1);
      fl=flashAt(lt,.15);
      K=[[0,[-1,1.8,-51],[-3,1.2,-60],9,50],[tO-.2,[0.5,2.2,-51.5],[0,2.4,-61],10,52],[tO+.6,[1.0,2.6,-54],[1.2,2.6,-62],8,50],[w('income'),[1.2,2.8,-55.5],[1.4,2.6,-62],6.5,48],[ctx.dur,[1.3,2.8,-56],[1.4,2.6,-62],6,48]]}
    for(const car of[S.car,S.gold])car.userData.wheels.forEach(q=>q.rotation.z=-(car.position.z)/0.46);
    S.flash.scale.set(.1+fl*6,.1+fl*6,1);ctx.flash=fl*.3;
    const c=keys(K,lt);applyCam(S.cam,c,t,.05);S.bokeh.uniforms.focus.value=c.f;S.after.uniforms.damp.value=c.speed>40?.8:0};
})();

// ---------------- OCEAN (dolphins) ----------------
function mkDolphin(scene){const g=new THREE.Group(),B=toon(0x5b8fc9),L=toon(0xd6ecfa);const P=[[0,1.7],[.06,1.66],[.085,1.52],[.11,1.38],[.2,1.3],[.3,1.15],[.38,.9],[.43,.5],[.44,.2],[.41,-.2],[.34,-.6],[.24,-1.0],[.16,-1.3],[.12,-1.45],[0,-1.5]].reverse().map(([r,y])=>new THREE.Vector2(r,y));
  const lg=new THREE.LatheGeometry(P,28);lg.rotateZ(-PI/2);const body=mesh(g,lg,B,{s:[1,1,.86],inkT:.03});
  mesh(g,new THREE.SphereGeometry(.4,20,12),L,{x:.3,y:-.16,s:[2.2,.55,.78]});
  const fin=new THREE.Shape();fin.moveTo(-.35,0);fin.quadraticCurveTo(-.25,.35,-.55,.55);fin.quadraticCurveTo(.05,.4,.3,0);fin.closePath();const fg=new THREE.ExtrudeGeometry(fin,{depth:.06,bevelEnabled:false});fg.translate(0,0,-.03);mesh(g,fg,B,{x:-.1,y:.32,inkT:.02});
  const fl=new THREE.Shape();fl.moveTo(0,0);fl.quadraticCurveTo(-.25,.45,-.5,.62);fl.quadraticCurveTo(-.32,.2,-.12,0);fl.quadraticCurveTo(-.32,-.2,-.5,-.62);fl.quadraticCurveTo(-.25,-.45,0,0);
  const flg=new THREE.ExtrudeGeometry(fl,{depth:.05,bevelEnabled:false});flg.translate(0,0,-.025);flg.rotateX(PI/2);const tail=new THREE.Group();tail.position.set(-1.42,0,0);g.add(tail);mesh(tail,flg,B,{s:1.3,rx:1.25,inkT:.02});
  const fp=new THREE.Shape();fp.moveTo(0,0);fp.quadraticCurveTo(-.15,-.1,-.45,-.32);fp.quadraticCurveTo(-.1,-.2,.15,0);fp.closePath();const fpg=new THREE.ExtrudeGeometry(fp,{depth:.04,bevelEnabled:false});
  for(const z of[-1,1])mesh(g,fpg,B,{x:.65,y:-.2,z:z*.3,ry:z*.5,rx:z*.4,inkT:.015});
  const eyes={};for(const z of[-1,1]){const e=new THREE.Group();e.position.set(1.05,.12,z*.27);g.add(e);const wht=mesh(e,new THREE.SphereGeometry(.075,12,8),basic(0xffffff),{inkT:.012});const pu=mesh(e,new THREE.SphereGeometry(.045,10,8),basic(0x141218),{x:.02,z:z*.04});
    const lid=mesh(e,new THREE.BoxGeometry(.16,.025,.03),basic(0x141218),{z:z*.05,rz:.1});lid.visible=false;eyes[z]={wht,pu,lid}}
  mesh(g,new THREE.SphereGeometry(.05,10,8),basic(0x1b2a44),{x:.78,y:.36,s:[1,.4,1.6]});
  // smile line
  mesh(g,new THREE.TorusGeometry(.2,.012,6,16,1.4),basic(0x141218),{x:1.2,y:-.02,rz:-2.1,ry:0,s:[1,1,1]});
  g.userData={tail,eyes};scene.add(g);return g}
function sleepEye(d,side,closed){const e=d.userData.eyes[side];e.wht.visible=!closed;e.pu.visible=!closed;e.lid.visible=closed}
(function(){const S=newSet('ocean',{bg:new THREE.Color('#1a6fb5'),fog:new THREE.FogExp2(0x1a7fbf,.035),fx:{focus:8,aperture:.0018,maxblur:.012}});const sc=S.scene;lights(sc,.9,.9,[2,20,6]);
  S.skyTex=skyTex('#2f8cff','#8fd0ff','#d8f4ff');
  const wtex=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#2b8fd6';c.fillRect(0,0,w,h);c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=5;for(let i=0;i<60;i++){const x=rnd(i)*w,y=rnd(i+9)*h;c.beginPath();c.arc(x,y,14+rnd(i+3)*20,PI*1.1,PI*1.9);c.stroke()}});wtex.wrapS=wtex.wrapT=THREE.RepeatWrapping;wtex.repeat.set(20,20);
  S.top=mesh(sc,new THREE.PlaneGeometry(400,400),basic(0xffffff,{map:wtex}),{rx:-PI/2,y:0});
  const utex=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#8fe3ff';c.fillRect(0,0,w,h);c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=6;for(let i=0;i<70;i++){c.beginPath();c.moveTo(rnd(i)*w,rnd(i+2)*h);c.lineTo(rnd(i)*w+30,rnd(i+2)*h+10);c.stroke()}});utex.wrapS=utex.wrapT=THREE.RepeatWrapping;utex.repeat.set(30,30);
  S.under=mesh(sc,new THREE.PlaneGeometry(400,400),basic(0xffffff,{map:utex,side:THREE.BackSide,transparent:true,opacity:.85}),{rx:-PI/2,y:-.02});
  const sand=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#f2d59a';c.fillRect(0,0,w,h);c.fillStyle='rgba(180,130,70,.3)';for(let i=0;i<300;i++)c.fillRect(rnd(i)*w,rnd(i+4)*h,4,4);c.strokeStyle='rgba(200,150,90,.5)';c.lineWidth=4;for(let y=20;y<h;y+=40){c.beginPath();for(let x=0;x<=w;x+=16)c.lineTo(x,y+Math.sin(x/30)*6);c.stroke()}});sand.wrapS=sand.wrapT=THREE.RepeatWrapping;sand.repeat.set(12,12);
  mesh(sc,new THREE.PlaneGeometry(300,300),basic(0xffffff,{map:sand}),{rx:-PI/2,y:-14});
  const CC=[0xff5fa2,0xff8a3d,0xb06bff,0xffd23f,0x3ee0c8,0xff4f6b];S.kelp=[];
  for(let i=0;i<70;i++){const x=(rnd(i)-.5)*80,z=-rnd(i+1)*70+10,col=CC[i%CC.length];const k=i%4;
    if(k===0)mesh(sc,new THREE.SphereGeometry(1+rnd(i)*1.2,14,10),toon(col),{x,y:-14,z,s:[1,.6,1],inkT:.04});
    else if(k===1){for(let j=0;j<4;j++)mesh(sc,new THREE.CylinderGeometry(.12,.18,1.5+rnd(i+j)*2,8),toon(col),{x:x+(j-1.5)*.4,y:-13.2,z:z+rnd(j)*.4,rz:(j-1.5)*.25,inkT:.02})}
    else if(k===2){const g=new THREE.Group();g.position.set(x,-14,z);sc.add(g);const n=5+Math.floor(rnd(i)*4);for(let j=0;j<n;j++)mesh(g,new THREE.BoxGeometry(.25,1.6,.06),toon(0x37b24d),{y:.8+j*1.5,rz:.1,inkT:.015});S.kelp.push(g)}
    else mesh(sc,new THREE.DodecahedronGeometry(1+rnd(i)*1.5),toon(0x8a7bb5),{x,y:-13.6,z,inkT:.04})}
  // light rays
  const ray=canvasTex(64,256,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,w,h)});
  for(let i=0;i<14;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(2+rnd(i)*3,18),new THREE.MeshBasicMaterial({map:ray,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.5,side:THREE.DoubleSide}));m.position.set((rnd(i)-.5)*50,-9,-rnd(i+5)*50);m.rotation.z=.25;m.rotation.y=rnd(i)*PI;sc.add(m)}
  // bubbles
  const bt=canvasTex(64,64,(c,w,h)=>{c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=5;c.beginPath();c.arc(32,32,24,0,TAU);c.stroke();c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.arc(24,22,6,0,TAU);c.fill()});
  S.bub=[];for(let i=0;i<140;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:bt,transparent:true,depthWrite:false}));const s=.12+rnd(i)*.3;sp.scale.set(s,s,1);sp.userData={x:(rnd(i+1)-.5)*30,z:-rnd(i+2)*40+6,sp:.6+rnd(i+3)*1.4,o:rnd(i+4)*14};sc.add(sp);S.bub.push(sp)}
  // fish school
  S.fish=[];const fg=new THREE.ConeGeometry(.18,.6,8);fg.rotateZ(-PI/2);for(let i=0;i<30;i++){const m=mesh(sc,fg,toon(i%2?0xff8a3d:0xffd23f),{inkT:.012});S.fish.push(m)}
  S.d=[mkDolphin(sc),mkDolphin(sc),mkDolphin(sc)];
  // spray burst
  S.spray=[];for(let i=0;i<40;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffffff,transparent:true,depthWrite:false}));sp.scale.set(.3,.3,1);sp.visible=false;sc.add(sp);S.spray.push(sp)}
  function swim(d,t,ph){d.userData.tail.rotation.z=Math.sin(t*6+ph)*.35}
  S.update=function(ctx){const{t,lt,seg,w}=ctx;let K;const D=S.d;
    S.kelp.forEach((g,i)=>g.rotation.z=Math.sin(t*1.2+i)*.12);
    S.fish.forEach((f,i)=>{const a=t*.5+i/30*TAU;f.position.set(-8+Math.cos(a)*4,-8+Math.sin(i)*1.2,-14+Math.sin(a)*3);f.rotation.y=-a-PI/2+PI});
    S.bub.forEach(b=>{const u=b.userData;b.position.set(u.x+Math.sin(t+u.o)*.3,-14+((t*u.sp+u.o)%14),u.z)});
    let sprayT=-1;
    if(seg.kind==='build'){
      const tB=w('breathe'),tH=w('blowhole'),tK=w('take'),tS=w('So'),tT=w('tired');
      // dolphin 0: jumps out of the water at the start
      const j=clamp((lt-.2)/1.6);D[0].position.set(lerp(-6,6,j),-2+Math.sin(j*PI)*5.5,-10);D[0].rotation.set(0,0,Math.cos(j*PI)*.9);
      if(lt>tB-.5){const u=clamp((lt-(tB-.5))/(tH-tB+.6));D[0].position.set(lerp(-6,0,u),lerp(-6,-.35,eo(u)),-6);D[0].rotation.set(0,0,lerp(.3,0,u))}
      if(lt>tS){D[0].position.set(-2+(lt-tS)*.6,-3-Math.sin(lt)*.2,-6);D[0].rotation.set(0,0,-.05)}
      D[1].position.set(-12+lt*2.2,-7+Math.sin(lt*1.3),-16);D[1].rotation.set(0,0,Math.sin(lt*1.3)*.15);D[2].position.set(-18+lt*2.0,-9+Math.sin(lt*1.1+1),-20);
      sprayT=lt-tK;
      K=[[0,[0,1.8,8],[0,2.5,-10],14],[1.8,[0,1.2,6],[0,1,-10],14],[tB-.3,[0,.8,4],[0,-1,-8],10],[tB+.5,[0,-2.5,4],[-2,-3,-8],10],[tH-.1,[2.2,.6,-1.5],[0,-.2,-6],4.8,46],[tK+.8,[2.4,.8,-1.2],[0,0,-6],4.8,46],
         [tS,[3,-2.2,-1],[-1,-3,-6],5.2,48],[tT+.3,[1.2,-2.6,-2.5],[-.5,-3,-6],4,46],[ctx.dur,[.8,-2.7,-3],[0,-3,-6],3.5,44]];
      for(const d of D)for(const s of[-1,1])sleepEye(d,s,false)
    }else{
      const tH=w('half'),tE=w('eye'),tR=w('rests');
      D[0].position.set(-1+lt*.25,-1.4+Math.sin(lt*.8)*.12,-6);D[0].rotation.set(0,0,Math.sin(lt*.8)*.04);sleepEye(D[0],1,lt>tH-.3);sleepEye(D[0],-1,false);
      D[1].position.set(-14+lt*1.6,-6,-15);D[2].position.set(-20+lt*1.4,-8,-19);for(const d of[D[1],D[2]])for(const s of[-1,1])sleepEye(d,s,false);
      K=[[0,[2,-1,2],[0,-1.4,-6],8,50],[tH-.4,[1.4,-1.2,-2.2],[0,-1.4,-6],4,46],[tR,[1.2,-1.1,-2.4],[0,-1.4,-6],3.8,44],[tE-.6,[1.6,-1.0,-3.0],[.4,-1.3,-6],3.2,44],[tE+.4,[1.8,-1.1,-9.6],[.8,-1.3,-6],3.6,44],[ctx.dur,[1.6,-1.15,-9.4],[.9,-1.3,-6],3.4,42]]}
    D.forEach((d,i)=>swim(d,t*(seg.kind==='why'&&i===0?.4:1),i));
    S.spray.forEach((sp,i)=>{const u=sprayT;if(u<0||u>1.2){sp.visible=false;return}sp.visible=true;const a=rnd(i)*TAU,v=2+rnd(i+1)*2;const p=D[0].position;sp.position.set(p.x+.8+Math.cos(a)*u*.6,p.y+.5+v*u-4*u*u,p.z+Math.sin(a)*u*.6);sp.material.opacity=1-u/1.2});
    const c=keys(K,lt);applyCam(S.cam,c,t,.06);S.bokeh.uniforms.focus.value=c.f;
    const below=S.cam.position.y<0;S.scene.background=below?new THREE.Color('#1a6fb5'):S.skyTex;S.scene.fog.density=below?.035:.004;S.scene.fog.color.set(below?0x1a7fbf:0xbfe6ff);S.after.uniforms.damp.value=c.speed>30?.75:0;ctx.below=below};
})();

// ---------------- SPACE (Venus) ----------------
(function(){const neb=canvasTex(2048,1024,(c,w,h)=>{c.fillStyle='#120a3a';c.fillRect(0,0,w,h);const cols=['rgba(176,107,255,.35)','rgba(62,198,255,.3)','rgba(255,79,139,.28)','rgba(255,210,63,.18)'];
    for(let i=0;i<26;i++){const x=rnd(i)*w,y=rnd(i+1)*h,r=120+rnd(i+2)*320;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,cols[i%4]);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,w,h)}
    for(let i=0;i<1500;i++){c.fillStyle=`rgba(255,255,255,${.3+.7*rnd(i+50)})`;const s=rnd(i+60)>.97?3:1.5;c.fillRect(rnd(i+70)*w,rnd(i+80)*h,s,s)}});
  const S=newSet('space',{fx:{focus:20,aperture:.0008,maxblur:.008}});const sc=S.scene;sc.add(new THREE.AmbientLight(0xffffff,.35));const pl=new THREE.PointLight(0xfff0d0,2.2,0,0);sc.add(pl);
  mesh(sc,new THREE.SphereGeometry(400,48,24),basic(0xffffff,{map:neb,side:THREE.BackSide}));
  const sunT=canvasTex(512,256,(c,w,h)=>{c.fillStyle='#ffb000';c.fillRect(0,0,w,h);for(let i=0;i<80;i++){c.fillStyle=`rgba(255,${200+rnd(i)*55|0},80,.5)`;c.beginPath();c.arc(rnd(i+1)*w,rnd(i+2)*h,10+rnd(i+3)*30,0,TAU);c.fill()}});
  S.sun=mesh(sc,new THREE.SphereGeometry(6,40,24),basic(0xffffff,{map:sunT}),{inkT:.08});glow(sc,0xffc040,34,{op:.9});glow(sc,0xff7a20,60,{op:.5});
  const eT=canvasTex(512,256,(c,w,h)=>{c.fillStyle='#2f8cff';c.fillRect(0,0,w,h);c.fillStyle='#3fbf5a';for(let i=0;i<9;i++){c.beginPath();c.ellipse(rnd(i)*w,40+rnd(i+1)*(h-80),18+rnd(i+2)*34,12+rnd(i+3)*24,rnd(i)*3,0,TAU);c.fill()}c.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<20;i++){c.beginPath();c.ellipse(rnd(i+20)*w,rnd(i+21)*h,30,8,0,0,TAU);c.fill()}c.fillStyle='#fff';c.fillRect(0,0,w,14);c.fillRect(0,h-14,w,14)});
  const vT=canvasTex(512,256,(c,w,h)=>{c.fillStyle='#f0b35a';c.fillRect(0,0,w,h);for(let y=0;y<h;y+=18){c.strokeStyle=y%36?'rgba(255,230,160,.7)':'rgba(200,120,50,.5)';c.lineWidth=10;c.beginPath();for(let x=0;x<=w;x+=16)c.lineTo(x,y+Math.sin(x/40+y)*8);c.stroke()}});
  S.earthO=new THREE.Group();sc.add(S.earthO);S.earth=mesh(S.earthO,new THREE.SphereGeometry(1.7,32,20),toon(0xffffff,{map:eT}),{inkT:.05});S.earth.rotation.z=.4;
  S.venusO=new THREE.Group();sc.add(S.venusO);S.venus=mesh(S.venusO,new THREE.SphereGeometry(1.6,32,20),toon(0xffffff,{map:vT}),{inkT:.05});
  S.mars=mesh(sc,new THREE.SphereGeometry(1.1,24,16),toon(0xe0603a),{inkT:.04});S.merc=mesh(sc,new THREE.SphereGeometry(.7,20,12),toon(0xa89a90),{inkT:.03});
  S.RE=30;S.RV=21;
  const ring=(r,col,op)=>{const m=new THREE.Mesh(new THREE.RingGeometry(r-.08,r+.08,160),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:op,side:THREE.DoubleSide}));m.rotation.x=-PI/2;sc.add(m);return m};
  S.ringE=ring(S.RE,0x7ec8ff,.45);S.ringV=ring(S.RV,0xffd27a,.45);ring(13,0xffffff,.15);ring(40,0xffffff,.15);
  // spin arrows (torus arc + cone head)
  function arrow(parent,r,col){const g=new THREE.Group();const tor=new THREE.Mesh(new THREE.TorusGeometry(r,.09,8,48,PI*1.5),basic(col));tor.rotation.x=PI/2;g.add(tor);const hd=new THREE.Mesh(new THREE.ConeGeometry(.28,.6,12),basic(col));hd.position.set(0,0,-r);hd.rotation.z=PI/2;g.add(hd);parent.add(g);return g}
  S.arE=arrow(S.earthO,2.5,0x7cff6b);S.arV=arrow(S.venusO,2.4,0xff4f8b);
  // Earth lap trail
  S.trail=[];for(let i=0;i<60;i++){const sp=glow(sc,0x7ec8ff,.8,{op:.8});sp.visible=false;S.trail.push(sp)}
  S.update=function(ctx){const{t,lt,seg,w}=ctx;let K;let aE=.6,aV=2.2,sE=t*4,sV=t*.15,dirV=-1,lapE=0,lapV=0,tr=-1;
    if(seg.kind==='build'){const tY=w('year'),tV=w('Venus'),tSh=w('shorter'),tSp=w('spins'),tW=w('which'),tL=w('lap');
      if(lt>tY){lapE=clamp((lt-tY-.3)/3.2);aE=.6+lapE*TAU;tr=lapE}
      if(lt>tSh-.4){lapV=clamp((lt-tSh+.4)/2);aV=2.2+lapV*TAU}
      sV=lt>tSp?(lt-tSp)*.12:0;
      const E=[Math.cos(.6)*S.RE,0,-Math.sin(.6)*S.RE],V=[Math.cos(2.2)*S.RV,0,-Math.sin(2.2)*S.RV];
      K=[[0,[E[0]+4.5,1.2,E[2]+3.5],E,6,46],[2.8,[E[0]+5,1.6,E[2]+4],E,6.5,46],[tY+.3,[22,50,48],[0,0,-6],60,50],[tV-.4,[18,46,46],[0,0,-6],60,50],[tV+.8,[V[0]+9,6,V[2]+10],[V[0]*.7,0,V[2]*.7],14,50],[tSh+2,[V[0]+12,9,V[2]+16],[0,0,0],18,52],
         [tSp-.2,[V[0]+5,1.5,V[2]+4],V,6.5,46],[tSp+1.5,[V[0]+4,1.2,V[2]+3.4],V,5.2,44],[tW,[V[0]+4,1.2,V[2]+3.4],V,5.2,44],[tW+.6,[30,22,40],[2,0,-8],45,50],[ctx.dur,[28,20,36],[2,0,-8],42,50]];
    }else{const tB=w('backwards'),tWe=w('west');lapV=clamp(lt/6);aV=2.2+lapV*TAU*0;sV=lt*(lt>tB?-.6:.12);dirV=lt>tB?1:-1;
      const V=[Math.cos(2.2)*S.RV,0,-Math.sin(2.2)*S.RV];K=[[0,[V[0]+7,3,V[2]+7],V,9,48],[tB-.3,[V[0]+6,2.2,V[2]+5.5],V,8,46],[tB+.6,[V[0]+3.6,1.0,V[2]+3.0],V,4.6,44],[tWe,[V[0]+2.6,.4,V[2]+2.4],[V[0]-3,0,V[2]-1],3.6,44],[ctx.dur,[V[0]+2.5,.4,V[2]+2.2],[V[0]-3,.2,V[2]-1],3.4,44]]}
    S.earthO.position.set(Math.cos(aE)*S.RE,0,-Math.sin(aE)*S.RE);S.earth.rotation.y=sE;S.arE.rotation.y=-sE*.5;
    S.venusO.position.set(Math.cos(aV)*S.RV,0,-Math.sin(aV)*S.RV);S.venus.rotation.y=sV;S.arV.rotation.y=sV*1.5;S.arV.scale.set(1,1,dirV<0?1:-1);
    S.mars.position.set(Math.cos(4+t*.02)*40,0,-Math.sin(4+t*.02)*40);S.merc.position.set(Math.cos(1+t*.05)*13,0,-Math.sin(1+t*.05)*13);
    S.trail.forEach((sp,i)=>{const u=i/60;if(tr<0||u>tr){sp.visible=false;return}sp.visible=true;const a=.6+u*TAU;sp.position.set(Math.cos(a)*S.RE,0,-Math.sin(a)*S.RE)});
    S.ringV.material.opacity=lapV>0&&lapV<1?.9:.45;S.ringE.material.opacity=tr>0&&tr<1?.9:.45;
    const c=keys(K,lt);applyCam(S.cam,c,t,.08);S.bokeh.uniforms.focus.value=c.f;S.after.uniforms.damp.value=c.speed>25?.78:0};
})();
