import json, os, sys
R = sys.argv[1]
START = [0.6, 4.3, 23.4, 31.08, 38.07, 47.99, 25.29]   # where each line starts in the round
lines = json.load(open(os.path.join(R, 'lines.json')))
words = []; cues = {}
def phrase_time(al, text, ph, t0):
    i = text.lower().find(ph.lower()); return None if i < 0 else round(t0+al['character_start_times_seconds'][i], 3)
for i, (who, text) in enumerate(lines):
    al = json.load(open(os.path.join(R, 'vo', f'{i:02d}_{who}.json')))
    ch = al['characters']; st = al['character_start_times_seconds']; en = al['character_end_times_seconds']
    t0 = START[i]; w = ''; ws = None
    for c, a, b in zip(ch, st, en):
        if c.isspace():
            if w: words.append([w, round(t0+ws, 3), round(t0+we, 3), who, i]); w = ''
        else:
            if not w: ws = a
            w += c; we = b
    if w: words.append([w, round(t0+ws, 3), round(t0+we, 3), who, i])
    for ph in ['True or false', 'A day on Venus', 'Here on Earth', 'A year is one lap', 'Venus is closer', 'But Venus also spins', 'really, really slowly', 'So which takes longer', 'One spin...', 'or one lap',
               'Lock it in', 'Nah.', 'Behave', "It's true", 'two hundred and forty-three', 'only two hundred and twenty-five', 'And it spins backwards', 'Sun rises in the west', 'Rah', 'Backwards as well', 'Venus is just doing']:
        t = phrase_time(al, text, ph, t0)
        if t is not None: cues.setdefault(ph, t)
    cues[f'end{i}'] = round(t0+en[-1], 3)
json.dump({'start': START, 'words': words, 'cues': cues, 'total': 56.99}, open(os.path.join(R, 'tl.json'), 'w'))
print(json.dumps(cues, indent=0))
