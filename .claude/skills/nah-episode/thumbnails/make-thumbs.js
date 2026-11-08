// Usage: node make-thumbs.js <config.json> <out-dir>
// Renders every thumbnail in the config to <out-dir>/<name>.png (1280x720) plus <out-dir>/phone-preview.png.
// Needs node_modules/@fontsource/{bangers,patrick-hand} next to thumb-maker.html, and Ricky's art in ../character/rigset/.
const {chromium} = require('playwright'); const fs = require('fs'); const path = require('path'); const {execFileSync} = require('child_process');
(async () => {
  const [cfgPath, out] = process.argv.slice(2); const cfg = JSON.parse(fs.readFileSync(cfgPath)); fs.mkdirSync(out, {recursive: true});
  const here = __dirname, rig = path.resolve(here, '../character/rigset');
  const imgs = new Set(); for (const t of cfg.thumbs) { if (t.ricky) imgs.add(['ricky:' + t.ricky.pose, 'file://' + rig + '/' + t.ricky.pose + '.png']); if (t.bg && t.bg.type === 'image') imgs.add([t.bg.key, 'file://' + path.resolve(path.dirname(cfgPath), t.bg.src)]); for (const s of t.subjects || []) if (s.type === 'image') imgs.add([s.key, 'file://' + path.resolve(path.dirname(cfgPath), s.src)]); }
  const b = await chromium.launch({args: ['--allow-file-access-from-files']}); const p = await b.newPage({viewport: {width: 1280, height: 720}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + here + '/thumb-maker.html'); await p.evaluate(l => window.loadImages(l), [...imgs].map(JSON.stringify).filter((v, i, a) => a.indexOf(v) === i).map(JSON.parse));
  const files = [];
  for (const t of cfg.thumbs) { await p.evaluate(c => window.makeThumb(c), t); const f = path.join(out, t.name + '.png'); await p.screenshot({path: f}); files.push(f); }
  await b.close();
  // phone-size preview strip (240x135 each, roughly how YouTube shows them in a feed)
  const args = []; files.forEach(f => args.push('-i', f));
  const fc = files.map((_, i) => `[${i}]scale=240:135,pad=250:155:5:10:color=0x1b1b22[v${i}]`).join(';') + ';' + files.map((_, i) => `[v${i}]`).join('') + `hstack=${files.length}`;
  if (files.length > 1) execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args, '-filter_complex', fc, path.join(out, 'phone-preview.png')]);
  console.log(errs.join('\n') || `made ${files.length} thumbnails in ${out}`);
})();
