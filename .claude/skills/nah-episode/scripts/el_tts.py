import json, subprocess, base64, sys, os
OUT = sys.argv[1]; MODEL = os.environ.get('EL_MODEL','eleven_multilingual_v2')
VOICES = {'N': 'UOcZh6rmTE0wZkipSyDT', 'K': '83rbhwXDTY5EOkzvd7V6'}
SET = {'N': {'stability': .5, 'similarity_boost': .8, 'style': .15, 'use_speaker_boost': True},
       'K': {'stability': .5, 'similarity': .95, 'similarity_boost': .95}}
LINES = json.load(open(sys.argv[2]))
for i, (who, text) in enumerate(LINES):
    fn = os.path.join(OUT, f'{i:02d}_{who}')
    if os.path.exists(fn+'.mp3'): continue
    body = json.dumps({'text': text, 'model_id': MODEL, 'voice_settings': SET[who]})
    r = subprocess.run(['curl', '-sS', '-X', 'POST', f'https://api.elevenlabs.io/v1/text-to-speech/{VOICES[who]}/with-timestamps?output_format=mp3_44100_128',
                        '-H', 'xi-api-key: proxy-injected', '-H', 'Content-Type: application/json', '-d', body], capture_output=True, text=True)
    d = json.loads(r.stdout)
    if 'audio_base64' not in d: print('ERR', i, str(d)[:300]); sys.exit(1)
    open(fn+'.mp3', 'wb').write(base64.b64decode(d['audio_base64']))
    json.dump(d.get('normalized_alignment') or d['alignment'], open(fn+'.json', 'w'))
    al = d['alignment']; print(i, who, f"{al['character_end_times_seconds'][-1]:.2f}s", text[:50])
