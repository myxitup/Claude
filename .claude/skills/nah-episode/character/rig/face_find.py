import sys, json, numpy as np
from PIL import Image
from collections import deque
P = sys.argv[1]; meta = json.load(open(P+'/poses.json')); out = {}
for n in meta:
    a = np.array(Image.open(f'{P}/{n}.png').convert('RGBA')).astype(int); h, w, _ = a.shape
    top = a[:115]; r, g, b, al = top[...,0], top[...,1], top[...,2], top[...,3]
    white = (al > 200) & (r > 200) & (g > 195) & (b > 180)
    seen = np.zeros_like(white); blobs = []
    for y0, x0 in zip(*np.where(white)):
        if seen[y0, x0]: continue
        q = deque([(y0, x0)]); seen[y0, x0] = True; pts = []
        while q:
            y, x = q.popleft(); pts.append((y, x))
            for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
                ny, nx = y+dy, x+dx
                if 0 <= ny < white.shape[0] and 0 <= nx < w and white[ny, nx] and not seen[ny, nx]: seen[ny, nx] = True; q.append((ny, nx))
        if len(pts) >= 12:
            ys, xs = zip(*pts); blobs.append({'n': len(pts), 'cx': round(float(np.mean(xs)),1), 'cy': round(float(np.mean(ys)),1), 'x0': min(xs), 'x1': max(xs), 'y0': min(ys), 'y1': max(ys)})
    # skin colour: median of mid-brown pixels in head area
    skin = top[(al > 200) & (r > 150) & (r < 215) & (g > 95) & (g < 150) & (b > 50) & (b < 110)][:, :3]
    out[n] = {'blobs': sorted(blobs, key=lambda b: -b['n'])[:5], 'skin': [int(v) for v in np.median(skin, 0)] if len(skin) else None}
    print(n, out[n]['skin'], [(b['n'], b['cx'], b['cy'], b['x1']-b['x0']+1, b['y1']-b['y0']+1) for b in out[n]['blobs']])
json.dump(out, open(P+"/faces_raw.json", "w"), indent=1, default=int)
