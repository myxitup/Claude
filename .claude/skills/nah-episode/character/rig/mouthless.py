# For every talkable pose: (1) <name>__nm.png = drawn mouth removed, outline kept; (2) <name>__mask.png = skin area mouths may be drawn on
import sys, json, numpy as np
from PIL import Image
from collections import deque
D = sys.argv[1]; F = json.load(open(f'{D}/faces.json')); done = []
def comps(mask):
    seen = np.zeros_like(mask); out = []
    for y0, x0 in zip(*np.where(mask)):
        if seen[y0, x0]: continue
        q = deque([(y0, x0)]); seen[y0, x0] = True; pts = []
        while q:
            y, x = q.popleft(); pts.append((y, x))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y+dy, x+dx
                    if 0 <= ny < mask.shape[0] and 0 <= nx < mask.shape[1] and mask[ny, nx] and not seen[ny, nx]: seen[ny, nx] = True; q.append((ny, nx))
        out.append(pts)
    return out
for n, f in F.items():
    if n == 'skin' or not f.get('mouth') or f.get('noLip') or n in ('facepalm', 'laugh'): continue
    im = np.array(Image.open(f'{D}/{n}.png').convert('RGBA')).astype(int); h, w, _ = im.shape
    r, g, b, a = im[..., 0], im[..., 1], im[..., 2], im[..., 3]
    skin = (a > 200) & (abs(r-f.get('skinc', [195, 125, 82])[0]) < 34) & (abs(g-125) < 30) & (abs(b-82) < 30) & (r > g+40)
    sk = np.median(im[skin][:, :3], 0).astype(int)
    cx, cy, mw, mh = f.get('mouthRemove', f['mouth']); ms = f.get('ms', 1)
    rx, ry = mw/2+6*ms+2, max(mh/2, 4*ms)+4*ms+2
    yy, xx = np.mgrid[0:h, 0:w]; inreg = ((xx-cx)/rx)**2 + ((yy-cy)/ry)**2 <= 1
    # distance-to-background: pixels within 5 px of transparency are the head's outline -> keep
    trans = a < 30; near = trans.copy(); k = int(round(5*ms))
    for _ in range(k): near = near | np.roll(near,1,0) | np.roll(near,-1,0) | np.roll(near,1,1) | np.roll(near,-1,1)
    out = im.copy().astype(np.uint8)
    kill = inreg & ~skin & ~near & (a > 30)
    out[kill, :3] = sk; out[kill, 3] = 255
    Image.fromarray(out, 'RGBA').save(f'{D}/{n}__nm.png')
    # mask: skin of the mouthless image, eroded 1 px so drawn mouths stop short of the outline
    o = out.astype(int); m = (o[..., 3] > 200) & (abs(o[..., 0]-sk[0]) < 30) & (abs(o[..., 1]-sk[1]) < 30) & (abs(o[..., 2]-sk[2]) < 30)
    e = m.copy()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)): e &= np.roll(np.roll(m, dy, 0), dx, 1)
    mk = np.zeros((h, w, 4), np.uint8); mk[e] = (255, 255, 255, 255)
    Image.fromarray(mk, 'RGBA').save(f'{D}/{n}__mask.png'); done.append(n)
print(len(done), 'talkable poses:', ' '.join(done))
