/* VISUAL REVIEW COPY
Extracted from index.html on main for isolated review.
NOT loaded by the game yet; runtime remains unchanged intentionally.
*/

function buildWorld(seed=90210) {
  worldSeed = (Number(seed)>>>0) || 90210;
  R = seeded(worldSeed);
  houses.length=0; obs.length=0; chests.length=0; tufts.length=0; patches.length=0; abandonedCamps.length=0;
  const roofs = ['#3a4046', '#4a3c37', '#34433d', '#3e3b4b', '#4b4a3a', '#3b4552'];
  let tries = 0;
  while (houses.length < 24 && tries++ < 8000) {
    const w = Math.floor(rr(230, 350)), h = Math.floor(rr(200, 290));
    const x = Math.floor(rr(140, WORLD - 140 - w)), y = Math.floor(rr(140, WORLD - 140 - h));
    const c = { x, y, w, h };
    if (onRoad(x, y, w, h, 60)) continue;
    if (distToRect(MID, MID, c) < 480) continue;
    if (houses.some(o => rectsNear(c, o, 100))) continue;
    houses.push(makeHouse(c, houses.length, roofs));
  }
  let t = 0; tries = 0;
  while (t < 90 && tries++ < 6000) {
    const s = 26, x = rr(90, WORLD - 120), y = rr(90, WORLD - 120);
    const c = { x, y, w: s, h: s, t: 't', sb: true, cr: rr(34, 56), shade: Math.floor(R() * 3) };
    if (onRoad(x - 40, y - 40, s + 80, s + 80, 0)) continue;
    if (distToRect(MID, MID, c) < 300) continue;
    if (houses.some(o => rectsNear(c, o, 70))) continue;
    if (obs.some(o => o.t === 't' && rectsNear(c, o, 50))) continue;
    obs.push(c); t++;
  }
  let k = 0; tries = 0;
  while (k < 34 && tries++ < 4000) {
    const s = 44, x = rr(120, WORLD - 160), y = rr(120, WORLD - 160);
    const c = { x, y, w: s, h: s, t: 'c', sb: true };
    if (distToRect(MID, MID, c) < 230) continue;
    if (houses.some(o => rectsNear(c, o, 60))) continue;
    if (obs.some(o => (o.t === 't' || o.t === 'c') && rectsNear(c, o, 40))) continue;
    obs.push(c); k++;
  }
  for (let i = 0; i < 1500; i++) tufts.push({ x: rr(0, WORLD), y: rr(0, WORLD), s: rr(4, 10), a: rr(0, TAU), v: R() });
  for (let i = 0; i < 90; i++) patches.push({ x: rr(0, WORLD), y: rr(0, WORLD), rx: rr(60, 190), ry: rr(40, 130), rot: rr(0, TAU), v: R() });
  // Terk edilmiş kamplar: haritada keşfedilebilen küçük survivor alanları.
  // v58: kamp için tek bina değil, kamp dikdörtgeniyle çakışan TÜM binalar kaldırılır.
  const chosen=[];
  const candidates=houses.filter(h=>distToRect(MID,MID,h)>650).sort((a,b)=>a.id-b.id);
  for(let i=0;i<candidates.length&&chosen.length<5;i++){
    const h=candidates[i],cx=h.x+h.w/2,cy=h.y+h.h/2;
    if(chosen.every(q=>Math.hypot(q.x-cx,q.y-cy)>1050))chosen.push({h,x:cx,y:cy});
  }
  for(let i=0;i<chosen.length;i++){
    const q=chosen[i],x=q.x,y=q.y,rad=225;
    // Çadırların ve ortak alanın tamamını kapsayan gerçek kamp sınırı.
    const plot={x:x-215,y:y-175,w:430,h:350};
    const clear={x:plot.x-95,y:plot.y-95,w:plot.w+190,h:plot.h+190};
    // Kamp alanı/tamponuyla çakışan bütün evleri bul.
    const doomed=houses.filter(h=>rectsNear(clear,h,0));
    const removeSet=new Set();
    for(const h of doomed){for(const o of h.walls)removeSet.add(o);for(const o of h.furn)removeSet.add(o);for(const o of h.chests)removeSet.add(o);}
    // Ev objeleri + kamp çevresindeki ağaç/kasalar tamamen temizlenir.
    for(let oi=obs.length-1;oi>=0;oi--){const o=obs[oi];const ox=o.x+o.w/2,oy=o.y+o.h/2;if(removeSet.has(o)||((o.t==='t'||o.t==='c')&&ox>clear.x&&ox<clear.x+clear.w&&oy>clear.y&&oy<clear.y+clear.h))obs.splice(oi,1);}
    for(let ci=chests.length-1;ci>=0;ci--)if(doomed.some(h=>h.chests.includes(chests[ci])))chests.splice(ci,1);
    for(let hi=houses.length-1;hi>=0;hi--)if(doomed.includes(houses[hi]))houses.splice(hi,1);
    // Çadırlar kampın iç kenarlarında; tampon bölge sayesinde komşu bina çatısı üstlerine gelemez.
    const offsets=[[0,-82]];
    const tentData=offsets.map(([ox,oy])=>({x:x+ox,y:y+oy,a:0,loot:false,inside:false}));
    abandonedCamps.push({id:i,x,y,r:rad,tents:tentData,fire:i%2===0,medical:i===1||i===3,discovered:false,plot});
  }
}