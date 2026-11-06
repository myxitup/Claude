const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [D,R]=[process.argv[2],process.argv[3]];const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+D+'/round1.html');await p.evaluate(()=>window.ready);
await p.evaluate(tl=>{window.R1=tl},JSON.parse(fs.readFileSync(R+'/tl_real.json')));
let i=0;for(const t of process.argv[4].split(',').map(Number)){await p.evaluate(t=>render(t),t);await p.screenshot({path:`${R}/st${String(i++).padStart(2,'0')}.png`})}
console.log(errs.join('\n')||'no errors');await b.close()})();
