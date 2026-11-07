// ===== core: renderer, toon materials, ink outlines, helpers =====
const W=1280,H=720,INK='#141218',TAU=Math.PI*2,PI=Math.PI,DPR=window.DPR||1.5;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,u)=>a+(b-a)*u,eio=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2},eo=t=>1-Math.pow(1-clamp(t),3),ei=t=>Math.pow(clamp(t),3);
const back=t=>{t=clamp(t);const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const rnd=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
THREE.ColorManagement.legacyMode=false;
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('gl'),antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(DPR);renderer.setSize(W,H,false);renderer.outputEncoding=THREE.sRGBEncoding;
const GRAD=new THREE.DataTexture(new Uint8Array([110,110,110,255,190,190,190,255,255,255,255,255]),3,1);GRAD.minFilter=GRAD.magFilter=THREE.NearestFilter;GRAD.needsUpdate=true;
const toon=(col,o={})=>new THREE.MeshToonMaterial(Object.assign({color:col,gradientMap:GRAD},o));
const basic=(col,o={})=>new THREE.MeshBasicMaterial(Object.assign({color:col},o));
function ink(mesh,th=.03){let g=mesh.geometry.clone();for(const k of Object.keys(g.attributes))if(k!=='position')g.deleteAttribute(k);g=THREE.BufferGeometryUtils.mergeVertices(g,1e-3);g.computeVertexNormals();
  const m=new THREE.MeshBasicMaterial({color:0x141218,side:THREE.BackSide});m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','vec3 transformed=position+normal*'+th.toFixed(3)+';')};m.customProgramCacheKey=()=>'ink'+th;
  const o=new THREE.Mesh(g,m);mesh.add(o);return mesh}
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;t.userData={canvas:c,ctx:x};return t}
function mesh(scene,geo,mat,{x=0,y=0,z=0,rx=0,ry=0,rz=0,s=1,inkT=0}={}){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);if(typeof s==='number')m.scale.setScalar(s);else m.scale.set(...s);if(inkT)ink(m,inkT);if(scene)scene.add(m);return m}
function card(scene,tex,w,h,{x=0,y=0,z=0,ry=0,depthWrite=false,fog=true,bottom=true}={}){const m=new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.04,depthWrite,fog,side:THREE.DoubleSide});
  const g=new THREE.PlaneGeometry(w,h);if(bottom)g.translate(0,h/2,0);const ms=new THREE.Mesh(g,m);ms.position.set(x,y,z);ms.rotation.y=ry;if(scene)scene.add(ms);return ms}
const SHTEX={};function shadow(scene,x,z,r,op=.35){const k=op.toFixed(2);if(!SHTEX[k])SHTEX[k]=canvasTex(128,128,(c,w,h)=>{const g=c.createRadialGradient(64,64,4,64,64,62);g.addColorStop(0,`rgba(10,0,30,${op})`);g.addColorStop(1,'rgba(10,0,30,0)');c.fillStyle=g;c.fillRect(0,0,w,h)});
  const m=new THREE.Mesh(new THREE.PlaneGeometry(r*2,r),new THREE.MeshBasicMaterial({map:SHTEX[k],transparent:true,depthWrite:false}));m.rotation.x=-PI/2;m.position.set(x,.02,z);scene.add(m);return m}
const glowTex=canvasTex(256,256,(c,w,h)=>{const g=c.createRadialGradient(128,128,4,128,128,128);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,w,h)});
function glow(scene,col,s,{x=0,y=0,z=0,op=1}={}){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:op}));sp.position.set(x,y,z);sp.scale.set(s,s,1);scene.add(sp);return sp}
function lights(scene,amb=.75,sunI=1.1,pos=[-8,20,12]){scene.add(new THREE.HemisphereLight(0xffffff,0x9a90a8,amb));const s=new THREE.DirectionalLight(0xfff2dc,sunI);s.position.set(...pos);scene.add(s);return s}
function mkComposer(scene,cam,{focus=10,aperture=.0012,maxblur=.01}={}){const c=new THREE.EffectComposer(renderer);c.setPixelRatio(DPR);c.setSize(W,H);c.addPass(new THREE.RenderPass(scene,cam));
  const bokeh=new THREE.BokehPass(scene,cam,{focus,aperture,maxblur,width:W,height:H});c.addPass(bokeh);const after=new THREE.AfterimagePass(0);c.addPass(after);return{comp:c,bokeh,after}}
// camera keys: [t,[pos],[look],focus,fov?] ; eased between keys
function keys(K,t){let i=0;while(i+1<K.length&&t>K[i+1][0])i++;const a=K[i],b=K[Math.min(i+1,K.length-1)];const u=b===a?0:eio((t-a[0])/Math.max(.001,b[0]-a[0]));
  return{p:a[1].map((v,k)=>lerp(v,b[1][k],u)),l:a[2].map((v,k)=>lerp(v,b[2][k],u)),f:lerp(a[3],b[3],u),fov:lerp(a[4]||50,b[4]||50,u),speed:Math.hypot(...a[2].map((v,k)=>b[2][k]-v))/Math.max(.001,b[0]-a[0])}}
function applyCam(cam,c,t,sway=.05){cam.position.set(c.p[0]+Math.sin(t*1.3)*sway,c.p[1]+Math.sin(t*2.1)*sway*.5,c.p[2]+Math.cos(t*1.1)*sway*.5);cam.lookAt(...c.l);if(cam.fov!==c.fov){cam.fov=c.fov;cam.updateProjectionMatrix()}}
function project(v,cam){const p=v.clone().project(cam);return[(p.x+1)/2*W,(1-p.y)/2*H,p.z]}
// canvas text helper for textures
function ctxt(c,s,x,y,size,col,{font='Bang',stroke=0,sc=INK,align='center'}={}){c.font=`${size}px ${font}`;c.textAlign=align;c.textBaseline='middle';c.lineJoin='round';if(stroke){c.lineWidth=stroke;c.strokeStyle=sc;c.strokeText(s,x,y)}c.fillStyle=col;c.fillText(s,x,y)}
