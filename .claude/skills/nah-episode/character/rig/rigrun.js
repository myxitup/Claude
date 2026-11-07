// usage: node rigrun.js <config.json> still t1,t2,...   |  node rigrun.js <config.json> video
const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');
(async()=>{const C=JSON.parse(fs.readFileSync(process.argv[2]));const mode=process.argv[3];
const d=JSON.parse(fs.readFileSync(C.data)),f=JSON.parse(fs.readFileSync(C.faces)),mm=JSON.parse(fs.readFileSync(C.mouthdir+'/mouths.json'));
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:mode==='video'?1.5:1});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(c=>{window.POSEDIR='file://'+c.posedir+'/';window.MOUTHDIR='file://'+c.mouthdir+'/';window.MOUTHMETA=c.mm;window.RNAMES=c.names;if(c.rsc)window.RSC=c.rsc;if(c.rfl)window.RFL=c.rfl;if(c.rax)window.RAX=c.rax;window.BUST=!!c.bust},{...C,mm});
await p.goto('file://'+C.page);await p.evaluate(()=>window.ready());await p.evaluate(([a,c])=>{D=a;F=c},[d,f]);
if(mode==='still'){let i=0;for(const t of process.argv[4].split(',').map(Number)){await p.evaluate(t=>render(t),t);await p.screenshot({path:`${C.stilldir}/${C.tag}${String(i++).padStart(2,'0')}.png`})}console.log(errs.join('\n')||'no errors');await b.close();return}
const fps=30,n=Math.floor(d.total*fps);
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',''+fps,'-i','-','-i',C.wav,'-vf','scale=1920:1080','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',C.out],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<n;i++){await p.evaluate(t=>render(t),i/fps);const buf=await p.screenshot({type:'jpeg',quality:95});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log(errs.join('\n')||'done',C.out)})();
