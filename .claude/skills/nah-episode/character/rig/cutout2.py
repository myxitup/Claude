import sys, numpy as np, json
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = np.array(Image.open(src).convert('RGBA')); H, W, _ = im.shape
names = ['stand', 'sit', 'point', 'facepalm', 'cross', 'laugh', 'shrug', 'thumbs']; meta = {}
for k, name in enumerate(names):
    r, c = divmod(k, 4); x0, y0 = c*W//4, r*H//2; cell = im[y0:y0+H//2, x0:x0+W//4]
    a = cell[..., 3]; ys, xs = np.where(a > 8)
    bx0, bx1, by0, by1 = xs.min(), xs.max()+1, ys.min(), ys.max()+1
    Image.fromarray(cell[by0:by1, bx0:bx1], 'RGBA').save(f'{out}/{name}.png')
    meta[name] = {'w': int(bx1-bx0), 'h': int(by1-by0), 'sheet_x': int(x0+bx0), 'sheet_y': int(y0+by0)}
json.dump(meta, open(f'{out}/poses.json', 'w'), indent=1); print(json.dumps(meta))
