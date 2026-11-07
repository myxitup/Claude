// ===== Episode 1 sets: digital, sky, harbour, station, bush =====
function rbox(w,h,d,r){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.01,d-2*Math.min(r,d/2.2)),bevelEnabled:true,bevelThickness:Math.min(r,d/2.2),bevelSize:Math.min(r,d/2.2)*.6,bevelSegments:3});g.center();return g}
function liveTex(w,h){const t=canvasTex(w,h,()=>{});t.userData.key='';return t}
function setTex(t,key,draw){if(t.userData.key===key)return;t.userData.key=key;const c=t.userData.ctx,cv=t.userData.canvas;c.clearRect(0,0,cv.width,cv.height);draw(c,cv.width,cv.height);t.needsUpdate=true}

// ---------------- DIGITAL (Google searches) ----------------
(function(){const S=newSet('digital',{bg:new THREE.Color('#130d3d'),fog:new THREE.Fog(0x2a1460,30,140),fx:{focus:12,aperture:.0012,maxblur:.01}});const sc=S.scene;lights(sc,.9,.8,[5,20,10]);
  const grid=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#1b0f4d';c.fillRect(0,0,w,h);c.strokeStyle='#ff4fd8';c.lineWidth=6;for(let i=0;i<=8;i++){c.beginPath();c.moveTo(i*64,0);c.lineTo(i*64,h);c.stroke();c.beginPath();c.moveTo(0,i*64);c.lineTo(w,i*64);c.stroke()}});grid.wrapS=grid.wrapT=THREE.RepeatWrapping;grid.repeat.set(40,40);
  mesh(sc,new THREE.PlaneGeometry(400,400),basic(0xffffff,{map:grid}),{rx:-PI/2});
  const NE=['#3ec6ff','#ff4f8b','#ffd23f','#7cff6b','#b06bff','#ff8a3d'];
  const tower=(col,h)=>canvasTex(128,Math.round(128*h/3),(c,w,hh)=>{c.fillStyle='#2a1f6e';c.fillRect(0,0,w,hh);for(let y=12;y<hh-8;y+=22)for(let x=12;x<w-12;x+=26){c.fillStyle=rnd(x*7+y)>.4?col:'#3d3290';c.fillRect(x,y,16,10)}c.strokeStyle=INK;c.lineWidth=8;c.strokeRect(4,4,w-8,hh-8)});
  for(let i=0;i<60;i++){const a=rnd(i)*TAU,r=16+rnd(i+1)*50,h=4+rnd(i+2)*22,x=Math.cos(a)*r,z=Math.sin(a)*r-20;if(Math.abs(x)<9&&z>-40)continue;const tx=tower(NE[i%6],h);mesh(sc,new THREE.BoxGeometry(3,h,3),basic(0xffffff,{map:tx}),{x,y:h/2,z})}
  // giant search bar
  S.barTex=liveTex(1024,160);const bar=new THREE.Group();bar.position.set(0,6,-20);sc.add(bar);
  mesh(bar,rbox(14,2.2,.8,.8),toon(0xffffff),{inkT:.06});S.barFace=mesh(bar,new THREE.PlaneGeometry(13.2,2.06),basic(0xffffff,{map:S.barTex,transparent:true}),{z:.42});
  S.drawBar=(s,cur)=>setTex(S.barTex,s+cur,(c,w,h)=>{c.strokeStyle='#8a86a0';c.lineWidth=12;c.beginPath();c.arc(80,80,30,0,TAU);c.stroke();c.beginPath();c.moveTo(102,102);c.lineTo(130,130);c.stroke();
    ctxt(c,s+(cur?'|':''),170,84,68,'#2a2833',{font:'Hand',align:'left'});c.fillStyle='#3ec6ff';c.beginPath();c.roundRect(w-210,22,180,116,30);c.fill();ctxt(c,'SEARCH',w-120,82,48,'#fff')});
  // floating icons (sprites)
  const icon=(draw)=>canvasTex(256,256,draw);
  const IC=[icon((c,w,h)=>{c.fillStyle='#ffd23f';c.beginPath();c.arc(100,110,50,0,TAU);c.fill();c.strokeStyle=INK;c.lineWidth=8;c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(150,150,45,0,TAU);c.arc(110,165,35,0,TAU);c.arc(190,165,35,0,TAU);c.fill();c.stroke()}),
    icon((c,w,h)=>{c.fillStyle='#e5383b';c.strokeStyle=INK;c.lineWidth=8;c.beginPath();c.arc(128,100,60,PI,0);c.lineTo(128,220);c.closePath();c.fill();c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(128,100,24,0,TAU);c.fill()}),
    icon((c,w,h)=>{c.fillStyle='#b06bff';c.strokeStyle=INK;c.lineWidth=8;c.beginPath();c.ellipse(90,190,34,26,0,0,TAU);c.fill();c.stroke();c.fillRect(116,50,14,140);c.beginPath();c.moveTo(130,50);c.quadraticCurveTo(200,70,180,130);c.lineWidth=14;c.stroke()}),
    icon((c,w,h)=>ctxt(c,'?',128,135,220,'#7cff6b',{stroke:20}))];
  S.icons=[];const ipos=[[-7,9,-17],[7,9.5,-17],[-6,3,-16],[6.5,2.8,-16]];IC.forEach((t,i)=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true}));sp.position.set(...ipos[i]);sp.scale.set(0,0,1);sc.add(sp);S.icons.push(sp)});
  // data streams: little glowing bars flying into the search bar
  S.bits=[];for(let i=0;i<200;i++){const sp=glow(sc,new THREE.Color(NE[i%6]),.5);S.bits.push(sp)}
  // giant counter screen
  S.cntTex=liveTex(1024,256);const scr=new THREE.Group();scr.position.set(0,15,-34);sc.add(scr);mesh(scr,new THREE.BoxGeometry(22,6,.6),toon(0x1b1240),{inkT:.08});mesh(scr,new THREE.PlaneGeometry(21,5.4),basic(0xffffff,{map:S.cntTex}),{z:.31});
  S.drawCnt=(s,col)=>setTex(S.cntTex,s,(c,w,h)=>{c.fillStyle='#0d0830';c.fillRect(0,0,w,h);ctxt(c,'GOOGLE SEARCHES',w/2,46,40,'#9fd8ff');ctxt(c,s,w/2,160,120,col||'#ffd23f',{stroke:10})});
  const typed=(lt,t0,s)=>{const n=Math.floor(clamp((lt-t0)/.6)*s.length);return s.slice(0,n)};
  S.update=function(ctx){const{t,lt,seg,w}=ctx;let K;let bt='',cur=Math.floor(t*2)%2,cnt='???',ccol='#ffd23f',ic=[0,0,0,0];
    if(seg.kind==='build'){const tW=w('weather'),tD=w('directions'),tS=w('song'),tF=w('fact'),tB=w('Billions'),tH=w('how');
      bt=lt>tF?typed(lt,tF,'is this fact true'):lt>tS?typed(lt,tS,'song lyrics'):lt>tD?typed(lt,tD,'directions home'):lt>tW?typed(lt,tW,'weather today'):'';
      ic=[lt>tW,lt>tD,lt>tS,lt>tF];
      K=[[0,[0,18,40],[0,6,-20],40,55],[w('type'),[0,8,2],[0,6,-20],22,50],[tW-.2,[0,6.5,-8],[0,6,-20],12,46],[tF+1.4,[1.5,6.8,-9],[0,6,-20],11,46],[tB,[0,9,6],[0,8,-24],28,52],[tH,[0,13,0],[0,14,-34],34,50],[ctx.dur,[0,13.6,-6],[0,15,-34],28,48]];
    }else{const t5=w('five'),t13=w('thirteen');bt='how many searches a day';cur=0;ic=[1,1,1,1];
      const u=clamp((lt-t13+.3)/2.4);if(lt<t5)cnt='100,000,000?';else if(lt<t13-.3){cnt='5 TRILLION / YEAR';ccol='#7cff6b'}else{cnt=Math.round(eo(u)*13.7e9).toLocaleString('en-US');ccol='#7cff6b'}
      K=[[0,[0,13,-4],[0,15,-34],30,48],[t5-.2,[0,14,-12],[0,15,-34],22,46],[t13,[0,15,-18],[0,15,-34],16,44],[ctx.dur,[0,15,-21],[0,15,-34],13,42]]}
    S.drawBar(bt,cur);S.drawCnt(cnt,ccol);S.icons.forEach((sp,i)=>{const s=ic[i]?2.6+Math.sin(t*3+i)*.1:0;sp.scale.set(s,s,1);sp.position.y=ipos[i][1]+Math.sin(t*1.5+i)*.3});
    S.bits.forEach((b,i)=>{const u=(t*(.3+rnd(i)*.4)+rnd(i+1))%1,a=rnd(i+2)*TAU,r=60*(1-u);b.position.set(Math.cos(a)*r,6+Math.sin(a*3)*8*(1-u)+(1-u)*10,-20+Math.sin(a)*r*.6);b.scale.setScalar(.35+(seg.kind==='build'&&lt>w('Billions')?.4:0))});
    const c=keys(K,lt);applyCam(S.cam,c,t,.06);S.bokeh.uniforms.focus.value=c.f;S.after.uniforms.damp.value=c.speed>30?.7:0};
})();

// ---------------- SKY (cloud weight) ----------------
function mkElephantGeo(){const parts=[];const add=(g,x,y,z,s=[1,1,1],r=[0,0,0])=>{g.scale(...s);g.rotateX(r[0]);g.rotateY(r[1]);g.rotateZ(r[2]);g.translate(x,y,z);parts.push(g)};
  add(new THREE.SphereGeometry(1,20,14),0,1.5,0,[1.4,1,1]);add(new THREE.SphereGeometry(.7,18,12),1.45,1.95,0);
  for(const z of[-1,1])add(new THREE.CircleGeometry(.6,18),1.1,2.05,z*.62,[1,1.2,1],[0,z>0?0:PI,0]);
  add(new THREE.CylinderGeometry(.18,.12,1.3,10),2.05,1.35,0,[1,1,1],[0,0,.35]);
  for(const x of[-.75,.75])for(const z of[-.5,.5])add(new THREE.CylinderGeometry(.3,.3,1,12),x,.5,z);
  return THREE.BufferGeometryUtils.mergeBufferGeometries(parts.map(g=>{g.deleteAttribute('uv');return g.index?g.toNonIndexed():g}))}
(function(){const S=newSet('sky',{bg:skyTex('#3d9bff','#9fd4ff','#e8f6ff',false,true),fog:new THREE.Fog(0xd8efff,60,220),fx:{focus:20,aperture:.001,maxblur:.01}});const sc=S.scene;lights(sc,.95,.9,[-10,30,20]);
  const CW=toon(0xffffff),CB=toon(0xe6f2ff);
  function cloud(x,y,z,s,n=14,seed=0){const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(s);for(let i=0;i<n;i++){const a=rnd(i+seed)*TAU,r=rnd(i+seed+1)*2.2,h=rnd(i+seed+2);mesh(g,new THREE.SphereGeometry(1+rnd(i+seed+3)*.9,16,12),h>.5?CW:CB,{x:Math.cos(a)*r*1.4,y:h*1.4,z:Math.sin(a)*r*.8,inkT:.05})}sc.add(g);return g}
  S.hero=cloud(0,8,-20,2.2,22,3);for(let i=0;i<26;i++)cloud((rnd(i+40)-.5)*200,-6+rnd(i+41)*6,-30-rnd(i+42)*120,2+rnd(i+43)*3,8,i*20);
  const land=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#7ccf5a';c.fillRect(0,0,w,h);for(let i=0;i<60;i++){c.fillStyle=['#5fb84a','#9ad66a','#e7c25a'][i%3];c.beginPath();c.ellipse(rnd(i)*w,rnd(i+1)*h,20+rnd(i+2)*50,14+rnd(i+3)*30,0,0,TAU);c.fill()}});land.wrapS=land.wrapT=THREE.RepeatWrapping;land.repeat.set(6,6);
  mesh(sc,new THREE.PlaneGeometry(600,600),basic(0xffffff,{map:land}),{rx:-PI/2,y:-40});
  // droplets
  S.drops=[];for(let i=0;i<160;i++){const m=mesh(sc,new THREE.SphereGeometry(.12,8,6),toon(0x5ab8ff),{});m.userData.p=[(rnd(i)-.5)*6,8+(rnd(i+1)-.5)*4,-11+(rnd(i+2)-.5)*4];S.drops.push(m)}
  // giant balance scale
  const sca=new THREE.Group();sc.add(sca);S.scale=sca;const GOLD=toon(0xffc93d),DK=toon(0x6b4bd6);
  mesh(sca,new THREE.CylinderGeometry(.5,1.6,8,4),DK,{y:4,inkT:.06});S.beam=new THREE.Group();S.beam.position.y=8.4;sca.add(S.beam);mesh(S.beam,rbox(26,.6,.8,.25),GOLD,{inkT:.06});
  S.pans=[];for(const x of[-12,12]){const p=new THREE.Group();p.position.x=x;S.beam.add(p);const hang=new THREE.Group();p.add(hang);mesh(hang,new THREE.CylinderGeometry(.06,.06,4,6),GOLD,{y:-2});mesh(hang,new THREE.CylinderGeometry(4.2,3.4,.6,28),GOLD,{y:-4.2,inkT:.05});S.pans.push(hang)}
  S.panCloud=cloud(0,0,0,1.15,14,7);S.pans[0].add(S.panCloud);S.panCloud.position.set(0,-3.4,0);
  // 100 elephants (instanced) on the right pan
  const eg=mkElephantGeo();const em=new THREE.InstancedMesh(eg,toon(0x9a9ab0),100);let eig=eg.clone();eig=THREE.BufferGeometryUtils.mergeVertices(eig,1e-3);eig.computeVertexNormals();
  const im=new THREE.MeshBasicMaterial({color:0x141218,side:THREE.BackSide});im.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','vec3 transformed=position+normal*0.06;')};im.customProgramCacheKey=()=>'inkel';
  const emi=new THREE.InstancedMesh(eig,im,100);S.pans[1].add(em);S.pans[1].add(emi);S.el=[em,emi];
  S.scale.position.set(0,-30,-14);
  // rising air arrows
  S.arrows=[];for(let i=0;i<8;i++){const g=new THREE.Group();mesh(g,new THREE.CylinderGeometry(.2,.2,2,8),basic(0xff8a3d),{});mesh(g,new THREE.ConeGeometry(.5,.9,12),basic(0xff8a3d),{y:1.4});g.visible=false;sc.add(g);S.arrows.push(g)}
  const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),V=new THREE.Vector3(),SC=new THREE.Vector3();
  S.update=function(ctx){const{t,lt,seg,w}=ctx;let K,showScale=0,nel=0,tilt=.22,dropsOn=0,air=0;
    if(seg.kind==='build'){const tD=w('droplets'),tB=w('billions'),tS=w('scale');dropsOn=lt>tD-.3&&lt<tB+2?1:0;showScale=lt>tS-.4?clamp((lt-tS+.4)/1.2):0;
      K=[[0,[0,12,24],[0,9,-20],40,52],[tD-.3,[3,9.5,-5],[0,9,-12],6,44],[w('dust'),[2.5,9,-6.5],[0,8.5,-11],4.5,40],[tB,[0,10,10],[0,9,-20],30,52],[tS,[0,6,22],[0,2,-14],34,52],[ctx.dur,[0,5,26],[0,2,-14],38,52]];
    }else{const tE=w('elephants'),tF=w('floats');showScale=lt<tF-.2?1:0;nel=Math.floor(clamp((lt-tE+1.2)/1.6)*100);tilt=.22*(1-clamp((lt-tE+1.2)/1.8));air=lt>tF?1:0;
      K=[[0,[0,5,26],[0,2,-14],38,52],[tE-1.4,[17,4.5,-3],[12,1.8,-14],11,46],[tE+1.8,[15,5.5,0],[9,2.2,-14],15,48],[tF-.1,[0,12,14],[0,9,-20],30,52],[ctx.dur,[0,8,10],[0,8,-20],28,50]]}
    S.drops.forEach((d,i)=>{d.visible=!!dropsOn;const p=d.userData.p;d.position.set(p[0]+Math.sin(t*2+i)*.1,p[1]+Math.cos(t*1.7+i)*.1,p[2])});
    S.scale.position.y=lerp(-34,-3,eo(showScale));S.scale.visible=showScale>0;S.beam.rotation.z=tilt;S.pans.forEach(p=>p.rotation.z=-tilt);
    S.hero.visible=!(showScale>0&&seg.kind==='build'&&lt>w('scale')+.8)&&!(seg.kind==='why'&&lt<w('floats')-.2);S.panCloud.visible=showScale>0&&!S.hero.visible||(seg.kind==='build'&&lt>w('scale')+.8);
    for(let i=0;i<100;i++){const r=Math.floor(i/10),c=i%10,on=i<nel;const L=Math.floor(i/25),j=i%25;V.set(-2.5+(j%5)*1.25+(L%2)*.3,-3.9+L*1.05,-2.5+Math.floor(j/5)*1.25+(L%2)*.3);const s=on?.42*(i===nel-1?back(.5):1):0;SC.set(s,s,s);Q.setFromEuler(new THREE.Euler(0,-PI/2,0));M.compose(V,Q,SC);S.el[0].setMatrixAt(i,M);S.el[1].setMatrixAt(i,M)}
    S.el.forEach(e=>e.instanceMatrix.needsUpdate=true);
    S.arrows.forEach((a,i)=>{a.visible=!!air;const u=(t*.6+i/8)%1;a.position.set(-8+i*2.3,lerp(-2,9,u),-14+Math.sin(i)*2);a.scale.setScalar(.8+.4*Math.sin(u*PI))});
    S.hero.rotation.y=t*.03;const c=keys(K,lt);applyCam(S.cam,c,t,.08);S.bokeh.uniforms.focus.value=c.f};
})();

// ---------------- HARBOUR (Anglo-Zanzibar war, 1896) ----------------
(function(){const S=newSet('harbour',{bg:skyTex('#2f8cff','#8fd0ff','#ffe9c0'),fog:new THREE.Fog(0xffe9c0,60,200),fx:{focus:20,aperture:.0012,maxblur:.01}});const sc=S.scene;lights(sc,.9,1.0,[-12,25,15]);
  const wt=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#22b8c9';c.fillRect(0,0,w,h);c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=5;for(let i=0;i<70;i++){const x=rnd(i)*w,y=rnd(i+9)*h;c.beginPath();c.arc(x,y,12+rnd(i+3)*16,PI*1.1,PI*1.9);c.stroke()}});wt.wrapS=wt.wrapT=THREE.RepeatWrapping;wt.repeat.set(24,24);
  S.water=mesh(sc,new THREE.PlaneGeometry(500,500),basic(0xffffff,{map:wt}),{rx:-PI/2});
  const sand=toon(0xf2d59a);mesh(sc,new THREE.BoxGeometry(160,2,40),sand,{y:-.6,z:-60});
  // town: white buildings + palace with clock tower
  for(let i=0;i<22;i++){const w=3+rnd(i)*3,h=3+rnd(i+1)*4,x=-50+i*4.6,z=-48-rnd(i+2)*14;const col=['#fff6e6','#ffe0b8','#f4f0ff','#ffd2c2'][i%4];mesh(sc,new THREE.BoxGeometry(w,h,w),toon(col),{x,y:h/2+.4,z,inkT:.05});
    mesh(sc,new THREE.BoxGeometry(w*.3,h*.25,.1),basic(0x3a6aa0),{x,y:h*.6+.4,z:z+w/2+.06})}
  const pal=new THREE.Group();pal.position.set(6,0,-50);sc.add(pal);mesh(pal,new THREE.BoxGeometry(16,7,8),toon(0xfff6e6),{y:3.9,inkT:.06});for(let i=0;i<6;i++)mesh(pal,new THREE.BoxGeometry(1.2,5,.2),toon(0x2fbf71),{x:-6+i*2.4,y:3.6,z:4.1});
  mesh(pal,new THREE.BoxGeometry(4,10,4),toon(0xffe0b8),{x:0,y:12,inkT:.06});mesh(pal,new THREE.ConeGeometry(3.2,3,4),toon(0xe5383b),{y:18.5,ry:PI/4,inkT:.05});
  S.clockTex=liveTex(256,256);mesh(pal,new THREE.CircleGeometry(1.6,32),basic(0xffffff,{map:S.clockTex}),{y:14,z:2.02});S.clockPos=new THREE.Vector3(6,14,-47.9);
  S.drawClock=(m)=>setTex(S.clockTex,Math.round(m*10)+'',(c,w,h)=>{c.fillStyle='#fffaf0';c.beginPath();c.arc(128,128,124,0,TAU);c.fill();c.strokeStyle=INK;c.lineWidth=12;c.stroke();for(let i=0;i<12;i++){const a=i/12*TAU;c.lineWidth=8;c.beginPath();c.moveTo(128+Math.sin(a)*96,128-Math.cos(a)*96);c.lineTo(128+Math.sin(a)*112,128-Math.cos(a)*112);c.stroke()}
    const am=m/60*TAU,ah=(9+m/60)/12*TAU;c.lineCap='round';c.lineWidth=14;c.beginPath();c.moveTo(128,128);c.lineTo(128+Math.sin(ah)*55,128-Math.cos(ah)*55);c.stroke();c.strokeStyle='#e5383b';c.lineWidth=9;c.beginPath();c.moveTo(128,128);c.lineTo(128+Math.sin(am)*90,128-Math.cos(am)*90);c.stroke()});
  // palms
  for(let i=0;i<10;i++){const g=new THREE.Group();g.position.set(-40+i*9+rnd(i)*3,0,-42+rnd(i+1)*3);sc.add(g);mesh(g,new THREE.CylinderGeometry(.2,.35,7,8),toon(0x9a6a3a),{y:3.5,rz:.12,inkT:.03});for(let k=0;k<6;k++)mesh(g,new THREE.ConeGeometry(.6,4,4),toon(0x3fbf5a),{x:.4+Math.cos(k)*1.6,y:7,z:Math.sin(k)*1.6,rz:PI/2-Math.cos(k)*.6,rx:Math.sin(k)*.6,s:[1,1,.3],inkT:.02})}
  // warships
  function ship(x,z,ry){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);const hs=new THREE.Shape();hs.moveTo(-6,1.2);hs.lineTo(6.8,1.2);hs.lineTo(5.6,-.6);hs.lineTo(-5.4,-.6);hs.closePath();const hg=new THREE.ExtrudeGeometry(hs,{depth:2.6,bevelEnabled:false});hg.translate(0,0,-1.3);
    mesh(g,hg,toon(0x5b6070),{inkT:.05});mesh(g,new THREE.BoxGeometry(5,1.4,2),toon(0xe8e4d8),{x:-.5,y:1.9,inkT:.04});S.smokes.push(...[-1.6,.6].map(fx=>{mesh(g,new THREE.CylinderGeometry(.35,.4,2.6,12),toon(0xd9a640),{x:fx,y:3.6,inkT:.03});return{g,x:fx}}));
    mesh(g,new THREE.CylinderGeometry(.08,.08,6,6),toon(0x5a3a2a),{x:3,y:4});const fl=canvasTex(64,40,(c,w,h)=>{c.fillStyle='#fff';c.fillRect(0,0,w,h);c.fillStyle='#c81e2c';c.fillRect(0,16,w,8);c.fillRect(28,0,8,h)});mesh(g,new THREE.PlaneGeometry(1.4,.9),basic(0xffffff,{map:fl,side:THREE.DoubleSide}),{x:3.7,y:6.4});
    const guns=[];for(const gx of[4.6,-4.4]){mesh(g,new THREE.CylinderGeometry(.14,.14,1.6,8),toon(0x333344),{x:gx,y:1.6,z:1.4,rx:PI/2});guns.push(new THREE.Vector3(gx,1.6,2.4))}S.ships.push({g,guns});return g}
  S.smokes=[];S.ships=[];ship(-10,-22,.2);ship(12,-26,-.25);ship(1,-14,0);
  S.puffs=[];for(let i=0;i<60;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0x9a96a8,transparent:true,depthWrite:false,opacity:.7}));sp.visible=false;sc.add(sp);S.puffs.push(sp)}
  S.flashes=[];for(let i=0;i<6;i++){const f=glow(sc,0xffc040,.1);S.flashes.push(f)}
  S.update=function(ctx){const{t,lt,seg,w}=ctx;let K,clockM=50,firing=-1;S.water.material.map.offset.set(t*.01,t*.02);
    if(seg.kind==='build'){const tWs=w('warships'),tDl=w('deadline'),tR=w('ran'),tG=w('guns');clockM=lt<tR?lerp(50,59,clamp((lt-tDl)/(tR-tDl))):lerp(59,60,clamp((lt-tR)/1.2));firing=lt>tG?lt-tG:-1;
      K=[[0,[-30,10,30],[0,4,-40],50,52],[w('Britain'),[-14,6,18],[0,3,-30],34,50],[tWs,[-4,4,6],[0,2,-20],20,48],[tDl-.3,[2,9,-30],[6,14,-48],18,46],[tDl+1.4,[4,12,-38],[6,14,-48],10,42],[tR,[5,13,-41],[6,14,-48],7,40],[tG,[-6,5,4],[0,2,-20],22,50],[ctx.dur,[-8,6,8],[0,3,-24],26,52]];
    }else{const t38=w('thirty-eight'),tS=w('shortest');clockM=lt<t38?0:Math.min(38,(lt-t38+.2)*16);firing=lt<2?lt+4:-1;
      K=[[0,[2,9,-30],[6,14,-48],18,46],[t38,[4,12,-38],[6,14,-48],10,42],[tS,[-10,8,14],[0,4,-30],34,50],[ctx.dur,[-12,9,18],[0,4,-30],38,52]]}
    S.drawClock(seg.kind==='why'?clockM:clockM%60);ctx.clock=seg.kind==='why'?clockM:null;
    // smoke from funnels always
    S.puffs.forEach((p,i)=>{const s=S.smokes[i%S.smokes.length];const u=(t*.3+rnd(i))%1;const wp=new THREE.Vector3(s.x,4.9+u*4,0).applyMatrix4(s.g.matrixWorld);p.position.copy(wp);p.position.x+=u*2;p.scale.setScalar(.8+u*2.4);p.material.opacity=.6*(1-u);p.visible=true});
    S.flashes.forEach((f,i)=>{const sh=S.ships[i%3],gp=sh.guns[i>2?1:0].clone().applyMatrix4(sh.g.matrixWorld);f.position.copy(gp);const ph=firing<0?-1:(firing*1.3+i*.37)%1;const k=ph>=0&&ph<.15?1-ph/.15:0;f.scale.setScalar(.1+k*5)});
    const c=keys(K,lt);applyCam(S.cam,c,t,.07);S.bokeh.uniforms.focus.value=c.f;S.after.uniforms.damp.value=c.speed>30?.7:0;
    if(firing>0){const sh=(rnd(Math.floor(t*30))-.5)*.12;S.cam.position.x+=sh;S.cam.position.y+=sh*.6}};
})();

// ---------------- STATION (astronauts grow) ----------------
function mkAstro(sc){const g=new THREE.Group(),Wt=toon(0xf4f4f8),Gr=toon(0xc9ccd8);const body=new THREE.Group();g.add(body);
  mesh(body,rbox(1.1,1.4,.8,.3),Wt,{y:0,inkT:.03});mesh(body,new THREE.SphereGeometry(.55,20,14),Wt,{y:1.05,inkT:.03});mesh(body,new THREE.SphereGeometry(.4,20,14),toon(0xffb000),{y:1.08,z:.25,s:[1,.8,.5]});
  mesh(body,rbox(.9,1.1,.5,.15),Gr,{y:.1,z:-.6,inkT:.03});for(const x of[-1,1]){mesh(body,new THREE.CapsuleGeometry(.18,.7,6,10),Wt,{x:x*.72,y:.1,rz:x*.6,inkT:.025});mesh(body,new THREE.CapsuleGeometry(.2,.8,6,10),Wt,{x:x*.3,y:-1.1,rz:x*.15,inkT:.025})}
  mesh(body,new THREE.BoxGeometry(.45,.3,.1),toon(0x3ec6ff),{y:.25,z:.42});g.userData.body=body;sc.add(g);return g}
(function(){const S=newSet('station',{fx:{focus:12,aperture:.001,maxblur:.008}});const sc=S.scene;sc.add(new THREE.AmbientLight(0xffffff,.45));const sun=new THREE.DirectionalLight(0xfff4e0,1.3);sun.position.set(-20,10,20);sc.add(sun);
  const neb=SETS.space.scene.children.find(o=>o.geometry&&o.geometry.type==='SphereGeometry'&&o.geometry.parameters.radius===400);mesh(sc,neb.geometry,neb.material);
  const eT=canvasTex(1024,512,(c,w,h)=>{c.fillStyle='#2f8cff';c.fillRect(0,0,w,h);c.fillStyle='#3fbf5a';for(let i=0;i<16;i++){c.beginPath();c.ellipse(rnd(i)*w,60+rnd(i+1)*(h-120),40+rnd(i+2)*90,26+rnd(i+3)*60,rnd(i)*3,0,TAU);c.fill()}c.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<40;i++){c.beginPath();c.ellipse(rnd(i+20)*w,rnd(i+21)*h,50,12,0,0,TAU);c.fill()}});
  S.earth=mesh(sc,new THREE.SphereGeometry(60,64,40),toon(0xffffff,{map:eT}),{y:-72,inkT:.3});glow(sc,0x7ec8ff,170,{y:-72,z:-5,op:.35});
  // station: modules + solar wings
  const st=new THREE.Group();sc.add(st);S.st=st;const Wt=toon(0xf0f0f4),Gy=toon(0xb8bcc8);
  mesh(st,new THREE.CylinderGeometry(1.1,1.1,9,20),Wt,{rz:PI/2,inkT:.05});mesh(st,new THREE.CylinderGeometry(.9,.9,5,20),Gy,{z:-2.8,rx:PI/2,inkT:.05});mesh(st,new THREE.SphereGeometry(1.4,20,14),Wt,{inkT:.05});
  mesh(st,new THREE.BoxGeometry(22,.3,.3),Gy,{y:1.6,inkT:.03});const pT=canvasTex(256,128,(c,w,h)=>{c.fillStyle='#2a3f9a';c.fillRect(0,0,w,h);c.strokeStyle='#8fb6ff';c.lineWidth=4;for(let x=0;x<w;x+=32){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke()}for(let y=0;y<h;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}c.strokeStyle=INK;c.lineWidth=8;c.strokeRect(4,4,w-8,h-8)});
  for(const x of[-9,-5.5,5.5,9])for(const y of[1])mesh(st,new THREE.BoxGeometry(3,.08,7),basic(0xffffff,{map:pT}),{x,y:y+.6+.4,inkT:.02});
  st.position.set(0,0,-6);
  S.astro=mkAstro(sc);S.astro.position.set(2.8,.6,-2.5);
  S.update=function(ctx){const{t,lt,seg,w}=ctx;let K,grow=0;S.earth.rotation.y=t*.02;st.rotation.y=Math.sin(t*.1)*.1;
    S.astro.rotation.set(Math.sin(t*.4)*.2,-.5+Math.sin(t*.3)*.2,Math.sin(t*.5)*.15);S.astro.position.y=.6+Math.sin(t*.7)*.15;
    if(seg.kind==='build'){const tSt=w('station');S.astro.visible=lt>tSt-.5;
      K=[[0,[0,-4,26],[0,-14,0],30,50],[w('squashes'),[0,-6,22],[0,-14,0],28,50],[tSt-.4,[14,6,18],[0,0,-6],22,52],[tSt+1.4,[6,2,6],[1.5,.5,-4],8,46],[w('body'),[7.5,1.8,4.5],[2.8,.6,-2.5],8.4,46],[ctx.dur,[7.2,1.8,4.2],[2.8,.6,-2.5],8,46]];
    }else{const tG=w('grow'),tB=w('back');S.astro.visible=true;grow=lt<tB?clamp((lt-tG)/1.2):1-clamp((lt-tB-.5)/1.2);
      K=[[0,[7.2,1.8,4.2],[2.8,.6,-2.5],8,46],[tG,[7.8,1.6,4.6],[2.8,.8,-2.5],8.6,46],[tB,[3,-2,14],[0,-8,-4],18,50],[ctx.dur,[2,-3,18],[0,-10,-4],22,52]]}
    S.astro.userData.body.scale.set(1,1+grow*.12,1);ctx.grow=grow;
    const c=keys(K,lt);applyCam(S.cam,c,t,.05);S.bokeh.uniforms.focus.value=c.f;S.after.uniforms.damp.value=c.speed>25?.7:0};
})();

// ---------------- BUSH (wombats) ----------------
function mkWombat(sc){const g=new THREE.Group(),B=toon(0x8a6a4a),D=toon(0x5a4030);const body=new THREE.Group();g.add(body);
  mesh(body,new THREE.SphereGeometry(1,24,16),B,{y:.9,s:[1.45,.9,1],inkT:.04});mesh(body,new THREE.SphereGeometry(.7,22,14),B,{x:1.25,y:1.0,inkT:.04});
  mesh(body,new THREE.SphereGeometry(.32,16,10),D,{x:1.85,y:.9,s:[.8,.8,1.2],inkT:.025});for(const z of[-1,1]){mesh(body,new THREE.ConeGeometry(.18,.35,10),B,{x:1.15,y:1.62,z:z*.32,inkT:.02});
    const e=mesh(body,new THREE.SphereGeometry(.09,10,8),basic(0xffffff),{x:1.68,y:1.18,z:z*.33,inkT:.012});mesh(e,new THREE.SphereGeometry(.05,8,6),basic(0x141218),{x:.05})}
  const legs=[];for(const x of[-.7,.7])for(const z of[-.55,.55]){const l=mesh(body,new THREE.CylinderGeometry(.22,.24,.5,10),D,{x,y:.25,z,inkT:.02});legs.push(l)}
  g.userData={body,legs};sc.add(g);return g}
(function(){const S=newSet('bush',{bg:skyTex('#3d9bff','#a8d8ff','#ffe2b0'),fog:new THREE.Fog(0xffe2b0,50,180),fx:{focus:12,aperture:.0016,maxblur:.012}});const sc=S.scene;lights(sc,.9,1.1,[-10,25,15]);
  const gT=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#d9733a';c.fillRect(0,0,w,h);for(let i=0;i<120;i++){c.fillStyle=['#c4622e','#e8894a','#b8b04a'][i%3];c.beginPath();c.ellipse(rnd(i)*w,rnd(i+1)*h,6+rnd(i+2)*20,4+rnd(i+3)*10,0,0,TAU);c.fill()}});gT.wrapS=gT.wrapT=THREE.RepeatWrapping;gT.repeat.set(30,30);
  mesh(sc,new THREE.PlaneGeometry(500,500),basic(0xffffff,{map:gT}),{rx:-PI/2});
  // distant mesas
  for(let i=0;i<6;i++)mesh(sc,new THREE.CylinderGeometry(8+rnd(i)*6,12+rnd(i)*6,8+rnd(i+1)*6,8),toon(0xc0502a),{x:-80+i*32,y:5,z:-120-rnd(i)*30,inkT:.1});
  // gum trees
  for(let i=0;i<24;i++){const a=rnd(i)*TAU,r=10+rnd(i+1)*40;const g=new THREE.Group();g.position.set(Math.cos(a)*r,0,Math.sin(a)*r*.7-20);sc.add(g);const h=5+rnd(i+2)*4;mesh(g,new THREE.CylinderGeometry(.25,.45,h,8),toon(0xe8e0d4),{y:h/2,rz:(rnd(i)-.5)*.2,inkT:.03});
    for(let k=0;k<4;k++)mesh(g,new THREE.SphereGeometry(1.4+rnd(i+k)*.8,12,8),toon(0x8fae6a),{x:(rnd(i*3+k)-.5)*3,y:h+(rnd(i*5+k))*1.5,z:(rnd(i*7+k)-.5)*3,inkT:.04})}
  for(let i=0;i<30;i++)mesh(sc,new THREE.SphereGeometry(.6+rnd(i)*.6,8,6),toon(0xa8b85a),{x:(rnd(i+70)-.5)*60,y:.3,z:-rnd(i+71)*50,s:[1.4,.6,1.2],inkT:.03});
  // hero rock + log
  S.rock=mesh(sc,new THREE.DodecahedronGeometry(1.6),toon(0x9a8a80),{x:3,y:.8,z:-4,s:[1.3,.7,1.1],inkT:.05});mesh(sc,new THREE.CylinderGeometry(.6,.6,5,14),toon(0x8a5a3a),{x:-5,y:.6,z:-6,rz:PI/2,ry:.4,inkT:.04});
  // poop cubes (hidden until the reveal)
  S.cubes=[];const CT=toon(0x5a3a22);for(let i=0;i<5;i++){const m=mesh(sc,rbox(.42,.42,.42,.06),CT,{inkT:.02});S.cubes.push(m)}
  const cpos=[[2.5,1.55,-3.6],[3.0,1.55,-3.4],[3.5,1.55,-3.7],[2.8,1.98,-3.55],[3.3,1.98,-3.55]];
  S.wombat=mkWombat(sc);S.w2=mkWombat(sc);S.w2.scale.setScalar(.7);
  // gut diagram tube (3D)
  S.update=function(ctx){const{t,lt,seg,w}=ctx;let K,showCubes=0;const W=S.wombat;
    const walk=(m,x0,x1,t0,t1,tt)=>{const u=clamp((tt-t0)/(t1-t0));m.position.x=lerp(x0,x1,u);const moving=u>0&&u<1;m.userData.legs.forEach((l,i)=>l.rotation.z=moving?Math.sin(t*12+i*PI)*.5:0);m.userData.body.position.y=moving?Math.abs(Math.sin(t*12))*.06:0};
    S.w2.position.set(0,0,-14);S.w2.rotation.y=PI;walk(S.w2,12,-12,0,30,lt);
    if(seg.kind==='build'){const tR=w('rocks'),tSh=w('shape');W.position.z=-4.5;W.rotation.y=0;walk(W,-8,.4,0,tR,lt);showCubes=0;
      K=[[0,[-2,3,12],[-4,1,-4],14,50],[w('chunky'),[-3,1.6,4],[-3,1,-4.5],8,44],[tR,[1,2,3],[1.5,1,-4.5],7,44],[w('scientists'),[4,2.2,3],[3,1.4,-4],7,44],[tSh,[3.2,2.3,.4],[3,1.6,-3.8],4.4,40],[ctx.dur,[3.2,2.3,0],[3,1.6,-3.8],4,38]];
    }else{const tC=w('cubes'),tG=w('gut'),tB=w('bum');showCubes=1;W.position.set(.8,0,-4.8);W.rotation.y=lt>tB-.6?lerp(0,PI*.85,clamp((lt-tB+.6)/.8)):0;
      K=[[0,[3.2,2.3,.4],[3,1.6,-3.8],4.4,40],[tC+1,[3.6,2.6,-.2],[3,1.6,-3.6],3.8,38],[tG,[1,3,5],[2,1.2,-4],8,46],[tB-.6,[-1,1.6,1.5],[.5,1,-4.8],6,44],[ctx.dur,[-2,1.5,1],[.2,1,-4.8],5.5,42]]}
    S.cubes.forEach((m,i)=>{m.visible=!!showCubes;m.position.set(...cpos[i]);const p=seg.kind==='why'?pop(lt+seg.a,seg.a+.15+i*.12,.3):0;m.scale.setScalar(Math.max(.001,p))});
    ctx.cubesPt=cpos[2];const c=keys(K,lt);applyCam(S.cam,c,t,.05);S.bokeh.uniforms.focus.value=c.f};
})();
