// node run.js still t1,t2,.. outdir [dpr]   |   node run.js video part parts
const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');const path=require('path');
(async()=>{const [mode,a1,a2,a3]=process.argv.slice(2);const E=process.env.EP_DIR||__dirname,POSES=process.env.RIG_POSES||path.resolve(__dirname,'../character/rigset'),MOUTHS=process.env.RIG_MOUTHS||path.resolve(__dirname,'../character/mouths');
  const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1280,height:720}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});
  const init={TLDATA:JSON.parse(fs.readFileSync(E+'/tl.json')),FACES:JSON.parse(fs.readFileSync(POSES+'/faces.json')),MOUTHMETA:JSON.parse(fs.readFileSync(MOUTHS+'/mouths.json')),POSEDIR:'file://'+POSES+'/',MOUTHDIR:'file://'+MOUTHS+'/',DPR:mode==='still'?+(a3||1):1.5};
  await p.addInitScript(o=>Object.assign(window,o),init);await p.goto('file://'+__dirname+'/episode.html');await p.evaluate(()=>window.ready);
  if(mode==='still'){fs.mkdirSync(a2,{recursive:true});let i=0;const t0=Date.now();for(const t of a1.split(',').map(Number)){await p.evaluate(t=>render(t),t);await p.screenshot({path:`${a2}/f${String(i++).padStart(2,'0')}.png`})}
    console.log([...new Set(errs)].slice(0,8).join('\n')||'no errors','ms/frame',Math.round((Date.now()-t0)/i));await b.close();return}
  const part=+a1,parts=+a2,fps=30,total=init.TLDATA.total,n=Math.floor(total*fps),s=Math.floor(n*part/parts),e=Math.floor(n*(part+1)/parts);
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',''+fps,'-i','-','-vf','scale=1920:1080','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',`${E}/parts/p${part}.mp4`],{stdio:['pipe','inherit','inherit']});
  for(let f=s;f<e;f++){await p.evaluate(t=>render(t),f/fps);const buf=await p.screenshot({type:'jpeg',quality:94});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(f%300===0)console.log('part',part,'frame',f-s,'/',e-s)}
  ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log([...new Set(errs)].slice(0,5).join('\n'),'part',part,'done')})();
