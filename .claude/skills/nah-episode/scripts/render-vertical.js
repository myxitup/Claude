const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');
(async()=>{const [D,R,part,parts]=[process.argv[2],process.argv[3],+process.argv[4],+process.argv[5]];
const tl=JSON.parse(fs.readFileSync(R+'/tl_real_short.json'));const fps=30,n=Math.floor(tl.totalReal*fps),a=Math.floor(n*part/parts),bnd=Math.floor(n*(part+1)/parts);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:2});
await p.goto('file://'+D+'/round1v.html');await p.evaluate(()=>window.ready);await p.evaluate(t=>{window.R1=t},tl);
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',''+fps,'-i','-','-vf','scale=1080:1920','-c:v','libx264','-preset','medium','-pix_fmt','yuv420p','-crf','17',`${R}/vp${part}.mp4`],{stdio:['pipe','inherit','inherit']});
for(let f=a;f<bnd;f++){await p.evaluate(t=>render(t),f/fps);const buf=await p.screenshot({type:'jpeg',quality:95});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('part',part,'done')})();
