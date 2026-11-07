import json, os, sys, re
R = sys.argv[1]; tl = json.load(open(os.path.join(R, 'tl_r2.json'))); st = tl['start']; fz = tl['freezes']
def real(tv): return tv + sum(f['dur'] for f in fz if f['tv'] <= tv)
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
# (alignment file, real start, first pose, cues, display)
segs = [('vo/07_K.json', real(st[7]), 'h_skeptical', [('Prove', 'h_unimpressed')], 'full'),
        ('vo_q2/00_K.json', fz[0]['T0']+fz[0]['lead'], 'sitlean', [('man', 'sitrelax')], 'pause'),
        ('vo_q2/01_K.json', fz[1]['T0']+fz[1]['lead'], 'h_skeptical', [('Nah', 'h_unimpressed')], 'pause'),
        ('vo/06_K.json', real(st[6]), 'h_thinking', [('I dunno', 'h_skeptical'), ('Sounds true', 'h_smirk')], 'box'),
        ('vo/03_K.json', real(st[3]), 'pointyou', [('believe', 'cross')], 'box'),
        ('vo/05_K.json', real(st[5]), 'shocked', [('true', 'excited')], 'full')]
poses = [{'t': 0, 'p': 'sitrelax'}]; vis = []; words = []; show = []
for f, t, first, cues, disp in segs:
    al = json.load(open(os.path.join(R, f))); ch = al['characters']; a0 = al['character_start_times_seconds']; a1 = al['character_end_times_seconds']; text = ''.join(ch)
    poses.append({'t': round(t-.12, 3), 'p': first})
    for ph, p in cues: i = text.find(ph); poses.append({'t': round(t+a0[i]-.06, 3), 'p': p})
    intag = False; w = ''; ws = 0
    for c, x, y in zip(ch, a0, a1):
        if c == '[': intag = True
        if intag:
            vis.append({'t': round(t+x, 3), 'v': 'ah'})
            if c == ']': intag = False
            continue
        vis.append({'t': round(t+x, 3), 'v': vclass(c) or 'rest'})
        if c.isspace():
            if w: words.append([re.sub(r'\[[^\]]*\]', '', w), round(t+ws, 3), round(t+we, 3)]); w = ''
        else:
            if not w: ws = x
            w += c; we = y
    if w: words.append([w, round(t+ws, 3), round(t+we, 3)])
    vis.append({'t': round(t+a1[-1], 3), 'v': 'rest'})
    show.append({'type': disp, 'a': round(t-.15, 3), 'b': round(t+a1[-1]+.3, 3)})
poses.sort(key=lambda p: p['t']); vis.sort(key=lambda v: v['t'])
merged = []
for x in vis:
    if merged and (x['t']-merged[-1]['t'] < .07 or x['v'] == merged[-1]['v']): continue
    merged.append(x)
json.dump({'total': tl['totalReal'], 'poses': poses, 'vis': merged, 'words': [w for w in words if w[0].strip('.')], 'show': show}, open(os.path.join(R, 'ricky.json'), 'w'))
print(json.dumps(show)); print([(p['t'], p['p']) for p in poses])
