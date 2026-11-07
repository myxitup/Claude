const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');
(async()=>{const [W,R,G,mode,arg2,arg3]=process.argv.slice(2);
const tl=JSON.parse(fs.readFileSync(R+'/tl_r2.json')),rk=JSON.parse(fs.readFileSync(R+'/ricky.json')),faces=JSON.parse(fs.readFileSync(G+'/mix/faces.json')),mm=JSON.parse(fs.readFileSync(G+'/mouths/mouths.json'));
const names=Object.keys(faces).filter(k=>k!=='skin');
const b=await chromium.launch({args:['--allow-file-access-from-files','--disable-web-security']});const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:mode==='video'?1.5:1});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+W+'/round_ricky.html');await p.evaluate(()=>window.ready);await p.evaluate(t=>{window.R1=t},tl);
await p.evaluate(([c,d,f])=>window.loadRicky(c,d,f),[{POSEDIR:'file://'+G+'/mix/',MOUTHDIR:'file://'+G+'/mouths/',MOUTHMETA:mm,RNAMES:names,MIX:true,NOCAP:true},rk,faces]);
if(mode==='still'){let i=0;for(const t of arg2.split(',').map(Number)){await p.evaluate(t=>render(t),t);await p.screenshot({path:`${R}/rk${String(i++).padStart(2,'0')}.png`})}console.log(errs.join('\n')||'no errors');await b.close();return}
const part=+arg2,parts=+arg3,fps=30,n=Math.floor(tl.totalReal*fps),a=Math.floor(n*part/parts),e=Math.floor(n*(part+1)/parts);
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',''+fps,'-i','-','-vf','scale=1920:1080','-c:v','libx264','-preset','medium','-pix_fmt','yuv420p','-crf','17',`${R}/rk_p${part}.mp4`],{stdio:['pipe','inherit','inherit']});
for(let f=a;f<e;f++){await p.evaluate(t=>render(t),f/fps);const buf=await p.screenshot({type:'jpeg',quality:95});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log(errs.join('\n')||'part '+part+' done')})();
