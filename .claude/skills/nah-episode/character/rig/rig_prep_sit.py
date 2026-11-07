import json, os, sys, subprocess, re, numpy as np, wave
R, G = sys.argv[1], sys.argv[2]; SR = 44100
LINES = [('06_K', [('Closer','sitcross'),('I dunno','sitlean'),('Sounds true','sitrelax')]),
         ('03_K', [('Nah.','sitpoint'),('So man','sitlean'),('[laughs]','sitlaugh'),('Behave','sitfacepalm')]),
         ('05_K', [('Rah','sitshocked'),('Backwards','sitcross'),('[laughs]','sitlaugh'),('Venus is','sitrelax')])]
t = 1.3; poses = [{'t': 0, 'p': 'sitrelax'}, {'t': 0.35, 'p': 'sitremote'}]; vis = []; words = []; audio = []
def vclass(c):
    c = c.lower()
    if c == 'a': return 'ah'
    if c in 'eiy': return 'ee'
    if c == 'o': return 'oh'
    if c in 'uwq': return 'oo'
    if c in 'fv': return 'fv'
    if c in 'mbp': return 'mbp'
    if c.isalpha(): return 'slight'
    return None
for name, cues in LINES:
    al = json.load(open(f'{R}/vo/{name}.json')); ch = al['characters']; st = al['character_start_times_seconds']; en = al['character_end_times_seconds']
    text = ''.join(ch)
    poses.append({'t': round(t-.25, 3), 'p': cues[0][1]})
    for ph, p in cues[1:]:
        i = text.find(ph); poses.append({'t': round(t+st[i]-.08, 3), 'p': p})
    intag = False; w = ''; ws = 0
    for c, a, b in zip(ch, st, en):
        if c == '[': intag = True
        if intag:
            vis.append({'t': round(t+a, 3), 'v': 'ah'})
            if c == ']': intag = False
            continue
        v = vclass(c) or 'rest'
        vis.append({'t': round(t+a, 3), 'v': v})
        if c.isspace():
            if w: words.append([w, round(t+ws, 3), round(t+we, 3)]); w = ''
        else:
            if not w: ws = a
            w += c; we = b
    if w: words.append([w, round(t+ws, 3), round(t+we, 3)])
    vis.append({'t': round(t+en[-1], 3), 'v': 'rest'})
    raw = subprocess.run(['ffmpeg','-loglevel','error','-i',f'{R}/vo/{name}.mp3','-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    v = np.frombuffer(raw, np.int16).astype(float)/32768; audio.append((t, v)); t += len(v)/SR + .7
poses.append({'t': round(t-.6, 3), 'p': 'sitcross'}); total = round(t+1.0, 2)
# merge visemes: hold each shape at least 70 ms
merged = []
for x in vis:
    if merged and (x['t'] - merged[-1]['t'] < .07 or x['v'] == merged[-1]['v']): continue
    merged.append(x)
N = int(total*SR); mix = np.zeros(N)
for st0, v in audio: i = int(st0*SR); mix[i:i+len(v)] += v[:N-i]
rng = np.random.default_rng(1); tt = lambda d: np.arange(int(d*SR))/SR
for p in poses[1:]:  # soft pop on each pose change
    d = tt(.09); s = np.sin(2*np.pi*(500+700*d/.09)*d)*np.exp(-d*40)*.12; i = int(p['t']*SR); mix[i:i+len(s)] += s[:max(0, N-i)]
room = np.convolve(rng.standard_normal(N), np.ones(40)/40, 'same')*.01; mix += room
mix = mix/np.max(np.abs(mix))*.9
with wave.open(f'{G}/demo_sit.wav','wb') as wv: wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((mix*32767).astype(np.int16).tobytes())
words = [[re.sub(r'\[[^\]]*\]', '', w), a, b] for w, a, b in words]; words = [x for x in words if x[0].strip('.')]
json.dump({'total': total, 'poses': poses, 'vis': merged, 'words': words}, open(f'{G}/demo_sit.json','w'))
print('total', total, 'poses', [(p['t'], p['p']) for p in poses], 'visemes', len(merged))
