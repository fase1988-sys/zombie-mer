/* VISUAL REVIEW COPY
Extracted from index.html on main for isolated review.
NOT loaded by the game yet; runtime remains unchanged intentionally.
*/

function makeHouse(c, id, roofs) {
  const T = 16, dw = 84;
  const side = ['N', 'S', 'E', 'W'][Math.floor(R() * 4)];
  const hs = { id, x: c.x, y: c.y, w: c.w, h: c.h, T, side, roof: roofs[Math.floor(R() * roofs.length)],
               vents: [], furn: [], chests: [], walls: [] };
  let d;
  if (side === 'N' || side === 'S') {
    d = { x: c.x + rr(T + dw / 2 + 26, c.w - T - dw / 2 - 26), y: side === 'N' ? c.y + T / 2 : c.y + c.h - T / 2, nx: 0, ny: side === 'N' ? -1 : 1 };
  } else {
    d = { x: side === 'W' ? c.x + T / 2 : c.x + c.w - T / 2, y: c.y + rr(T + dw / 2 + 26, c.h - T - dw / 2 - 26), nx: side === 'W' ? -1 : 1, ny: 0 };
  }
  d.w = dw; hs.door = d;
  hs.inner = { x: c.x + T, y: c.y + T, w: c.w - 2 * T, h: c.h - 2 * T };
  // Evlerin bir kısmı tek katlı, bir kısmı 2 katlıdır.
  hs.floors = R() < 0.38 ? 2 : 1;
  hs.stairs = null;
  if(hs.floors===2){
    if(side==='N') hs.stairs={x:c.x+c.w-62,y:c.y+c.h+18,w:44,h:72};
    else if(side==='S') hs.stairs={x:c.x+18,y:c.y-90,w:44,h:72};
    else if(side==='W') hs.stairs={x:c.x+c.w+18,y:c.y+18,w:72,h:44};
    else hs.stairs={x:c.x-90,y:c.y+c.h-62,w:72,h:44};
    hs.stairs.outside=true;
  }

  const x = c.x, y = c.y, w = c.w, h = c.h, segs = [];
  if (side === 'N') segs.push([x, y, d.x - dw / 2 - x, T], [d.x + dw / 2, y, x + w - (d.x + dw / 2), T]); else segs.push([x, y, w, T]);
  if (side === 'S') segs.push([x, y + h - T, d.x - dw / 2 - x, T], [d.x + dw / 2, y + h - T, x + w - (d.x + dw / 2), T]); else segs.push([x, y + h - T, w, T]);
  if (side === 'W') segs.push([x, y, T, d.y - dw / 2 - y], [x, d.y + dw / 2, T, y + h - (d.y + dw / 2)]); else segs.push([x, y, T, h]);
  if (side === 'E') segs.push([x + w - T, y, T, d.y - dw / 2 - y], [x + w - T, d.y + dw / 2, T, y + h - (d.y + dw / 2)]); else segs.push([x + w - T, y, T, h]);
  for (const s of segs) if (s[2] > 0 && s[3] > 0) {
    const o = { x: s[0], y: s[1], w: s[2], h: s[3], t: 'w', sb: true, hs };
    obs.push(o); hs.walls.push(o);
  }
  const nv = 1 + Math.floor(R() * 3);
  for (let i = 0; i < nv; i++) hs.vents.push({ x: rr(30, w - 66), y: rr(30, h - 66), s: rr(18, 34) });

  // İç eşyalar ve sandıklar
  const inX = d.x - d.nx * 60, inY = d.y - d.ny * 60, inn = hs.inner;
  const taken = () => hs.furn.concat(hs.chests);
  const spot = (sw, sh) => {
    for (let i = 0; i < 40; i++) {
      const sx = rr(inn.x + 8, inn.x + inn.w - sw - 8), sy = rr(inn.y + 8, inn.y + inn.h - sh - 8);
      const r = { x: sx, y: sy, w: sw, h: sh };
      if (Math.hypot(sx + sw / 2 - inX, sy + sh / 2 - inY) < 120) continue;
      if (taken().some(o => rectsNear(r, o, 30))) continue;
      return r;
    }
    return null;
  };
  const nf = 1 + Math.floor(R() * 3);
  for (let i = 0; i < nf; i++) {
    const bed = R() < 0.4, s = spot(bed ? 42 : 58, bed ? 74 : 36);
    if (s) { s.t = 'f'; s.kind = bed ? 'bed' : 'table'; s.sb = false; hs.furn.push(s); obs.push(s); }
  }
  const nc = R() < 0.5 ? 2 : 1;
  for (let i = 0; i < nc; i++) {
    let placed = null;
    for (let k = 0; k < 30 && !placed; k++) {
      const wall = Math.floor(R() * 4), cw = 38, ch = 26;
      let cx, cy;
      if (wall === 0) { cx = rr(inn.x + 10, inn.x + inn.w - cw - 10); cy = inn.y + 4; }
      else if (wall === 1) { cx = rr(inn.x + 10, inn.x + inn.w - cw - 10); cy = inn.y + inn.h - ch - 4; }
      else if (wall === 2) { cx = inn.x + 4; cy = rr(inn.y + 10, inn.y + inn.h - ch - 10); }
      else { cx = inn.x + inn.w - cw - 4; cy = rr(inn.y + 10, inn.y + inn.h - ch - 10); }
      const r = { x: cx, y: cy, w: cw, h: ch };
      if (Math.hypot(cx + cw / 2 - inX, cy + ch / 2 - inY) < 110) continue;
      if (taken().some(o => rectsNear(r, o, 24))) continue;
      placed = r;
    }
    if (placed) {
      placed.t = 'k'; placed.sb = false; placed.open = false; placed.floor = 1; placed.hs = hs;
      hs.chests.push(placed); chests.push(placed); obs.push(placed);
    }
  }
  // Yalnızca 2 katlı evlerde bağımsız üst kat sandıkları oluştur.
  const downstairs=hs.floors===2?hs.chests.filter(q=>(q.floor||1)===1).slice():[];
  for(const q of downstairs){
    const up={x:inn.x+inn.w-(q.x-inn.x)-q.w,y:inn.y+inn.h-(q.y-inn.y)-q.h,w:q.w,h:q.h,t:'k',sb:false,open:false,floor:2,hs};
    // Merdivenin üstüne sandık koyma.
    hs.chests.push(up);chests.push(up);
  }
  return hs;
}

function drawRoof(h) {
  if (!vis(h.x, h.y, h.w + 14, h.h + 14)) return;
  ctx.fillStyle = 'rgba(0,0,0,.38)'; ctx.fillRect(h.x + 10, h.y + 12, h.w, h.h);
  ctx.fillStyle = h.roof; ctx.fillRect(h.x, h.y, h.w, h.h);
  ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(h.x, h.y, h.w, 7);
  ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 4; ctx.strokeRect(h.x + 2, h.y + 2, h.w - 4, h.h - 4);
  ctx.strokeStyle = 'rgba(255,255,255,.09)'; ctx.lineWidth = 2; ctx.strokeRect(h.x + 18, h.y + 18, h.w - 36, h.h - 36);
  // v146 roof material: seams, weathering and directional highlights.
  ctx.save();ctx.beginPath();ctx.rect(h.x+3,h.y+3,h.w-6,h.h-6);ctx.clip();
  ctx.strokeStyle='rgba(20,16,14,.18)';ctx.lineWidth=1;
  for(let yy=h.y+14;yy<h.y+h.h;yy+=14){ctx.beginPath();ctx.moveTo(h.x+4,yy);ctx.lineTo(h.x+h.w-4,yy);ctx.stroke();}
  ctx.fillStyle='rgba(255,220,175,.035)';ctx.fillRect(h.x+5,h.y+5,h.w-10,10);
  ctx.fillStyle='rgba(0,0,0,.07)';ctx.fillRect(h.x+5,h.y+h.h-15,h.w-10,10);
  ctx.restore();
  for (const v of h.vents) {
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(h.x + v.x, h.y + v.y, v.s, v.s);
    ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 2; ctx.strokeRect(h.x + v.x, h.y + v.y, v.s, v.s);
  }
  // İki katlı ev dışarıdan temiz ve okunaklı: alt çatı + daha küçük üst kat + pencereler.
  if(h.floors===2){
    const inset=30,ux=h.x+inset,uy=h.y+inset,uw=h.w-inset*2,uh=h.h-inset*2;
    ctx.fillStyle='rgba(0,0,0,.38)';ctx.fillRect(ux+8,uy+9,uw,uh);
    ctx.fillStyle='#66584a';ctx.fillRect(ux,uy,uw,uh);
    ctx.strokeStyle='#2c241d';ctx.lineWidth=4;ctx.strokeRect(ux+2,uy+2,uw-4,uh-4);
    // Üst kat pencereleri.
    const wins=[[ux+12,uy+12],[ux+uw-34,uy+12],[ux+12,uy+uh-28],[ux+uw-34,uy+uh-28]];
    for(const [wx,wy] of wins){
      ctx.fillStyle='rgba(244,190,95,.28)';ctx.fillRect(wx,wy,22,16);
      ctx.strokeStyle='#c9a66d';ctx.lineWidth=2;ctx.strokeRect(wx,wy,22,16);
      ctx.beginPath();ctx.moveTo(wx+11,wy);ctx.lineTo(wx+11,wy+16);ctx.stroke();
    }
    // Üst çatı merkezi; alt katın dış hattı görünür kalır.
    ctx.fillStyle=h.roof;ctx.fillRect(ux+20,uy+18,Math.max(24,uw-40),Math.max(24,uh-36));
    ctx.strokeStyle='rgba(255,255,255,.11)';ctx.lineWidth=2;ctx.strokeRect(ux+22,uy+20,Math.max(20,uw-44),Math.max(20,uh-40));
    // Baca.
    ctx.fillStyle='#493a31';ctx.fillRect(ux+uw-48,uy+8,16,25);
    ctx.fillStyle='#826958';ctx.fillRect(ux+uw-50,uy+7,20,5);
  }
  // Dış merdiven: sandıklardan ve iç mobilyalardan tamamen ayrı.
  if(h.stairs){
    const s=h.stairs;
    ctx.fillStyle='rgba(0,0,0,.34)';ctx.fillRect(s.x+5,s.y+6,s.w,s.h);
    ctx.fillStyle='#70543a';ctx.fillRect(s.x,s.y,s.w,s.h);
    ctx.strokeStyle='#c49b62';ctx.lineWidth=2;
    if(s.h>=s.w){for(let yy=s.y+7;yy<s.y+s.h;yy+=9){ctx.beginPath();ctx.moveTo(s.x+4,yy);ctx.lineTo(s.x+s.w-4,yy);ctx.stroke();}}
    else{for(let xx=s.x+7;xx<s.x+s.w;xx+=9){ctx.beginPath();ctx.moveTo(xx,s.y+4);ctx.lineTo(xx,s.y+s.h-4);ctx.stroke();}}
    ctx.strokeStyle='#3a281b';ctx.lineWidth=3;ctx.strokeRect(s.x,s.y,s.w,s.h);
  }

  // kapı işareti
  const d = h.door;
  ctx.fillStyle = '#9a7a4e';
  if (d.nx === 0) { ctx.fillRect(d.x - d.w / 2, d.y - h.T / 2, d.w, h.T); ctx.fillStyle = '#c4a473'; ctx.fillRect(d.x - d.w / 2 + 6, d.y - 3 + d.ny * 0, d.w - 12, 6); }
  else { ctx.fillRect(d.x - h.T / 2, d.y - d.w / 2, h.T, d.w); ctx.fillStyle = '#c4a473'; ctx.fillRect(d.x - 3, d.y - d.w / 2 + 6, 6, d.w - 12); }
  drawUltraHouseExterior(h);
}