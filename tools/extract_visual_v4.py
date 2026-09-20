"""Crop reviewed, nonoverlapping regions of the supplied transparent asset sheet."""
from pathlib import Path
from PIL import Image
from collections import deque

source = Image.open(Path(__file__).resolve().parents[2] / 'upload/mappps.png').convert('RGBA')
root = Path(__file__).resolve().parents[1] / 'assets/visual-v4'
# Bounds exclude the printed captions underneath each sprite. Adjacent sprites are
# deliberately separated; questionable overlapped sprites are listed in README.
sprites = {
 'vegetation/tree_01': (2,187,137,422),
 'vegetation/tree_02': (139,191,246,422),
 'vegetation/tree_03': (247,186,369,422),
 'vegetation/tree_04': (372,198,467,422),
 'vegetation/tree_dead': (469,194,566,422),
 'vegetation/bush_01': (568,301,670,421),
 'vegetation/bush_02': (671,301,779,421),
 'vegetation/fern_01': (909,303,1021,421),
 'vegetation/flowers': (1302,312,1415,422),
 'vegetation/stump': (1424,319,1523,423),
 'props/campfire': (339,440,477,582),
 'props/woodpile': (481,449,620,580),
 'props/bench': (619,454,726,563),
 'props/crate': (786,461,875,559),
 'props/barrel': (878,466,936,565),
 'props/military_box': (998,465,1106,562),
 'props/shelf': (1107,454,1215,567),
 'props/sign_river': (1401,449,1523,564),
 'props/sign_stop': (1451,581,1524,740),
 'props/street_lamp': (1380,584,1467,749),
 'props/logs': (1165,674,1280,755),
 'props/rock_01': (1055,590,1136,674),
 'props/rock_02': (1137,590,1214,674),
 'buildings/cabin_01': (1,443,374,733),
 'vehicles/car_wreck_01': (374,585,704,748),
}
for name, box in sprites.items():
    im = source.crop(box)
    # Original transparent pixels include stray matte speckles. Drop near-zero
    # alpha without changing any of the visible source artwork.
    alpha = im.getchannel('A').point(lambda v: 0 if v < 12 else v)
    # Keep the main object; this removes neighboring cutoffs and small caption
    # fragments. No retouching or invented details are applied to the sprite.
    w,h=alpha.size; pixels=alpha.load(); seen=set(); components=[]
    for yy in range(h):
        for xx in range(w):
            if pixels[xx,yy]<24 or (xx,yy) in seen: continue
            queue=deque([(xx,yy)]);seen.add((xx,yy));piece=[]
            while queue:
                x,y=queue.popleft();piece.append((x,y))
                for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                    if 0<=nx<w and 0<=ny<h and pixels[nx,ny]>=24 and (nx,ny) not in seen:
                        seen.add((nx,ny));queue.append((nx,ny))
            components.append(piece)
    largest=max(components,key=len); keep=set(largest)
    for yy in range(h):
        for xx in range(w):
            if (xx,yy) not in keep: pixels[xx,yy]=0
    im.putalpha(alpha)
    bbox = im.getbbox()
    if not bbox: raise ValueError(f'empty sprite: {name}')
    dest = root / f'{name}.png'
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.crop(bbox).save(dest, optimize=True)

terrain = {
 'forest':(13,788,111,883), 'grass':(120,788,217,883),
 'mud':(227,788,324,883), 'asphalt':(340,788,437,883),
 'rocky':(777,788,874,883),
}
for name, box in terrain.items():
    im = source.crop(box).convert('RGB')
    dest = root / 'terrain' / f'{name}.png'
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, optimize=True)
