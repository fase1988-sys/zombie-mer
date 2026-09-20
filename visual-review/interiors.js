/* VISUAL REVIEW COPY
Extracted from index.html on main for isolated review.
NOT loaded by the game yet; runtime remains unchanged intentionally.
*/

function drawInteriorScene(hs) {
  const n=hs.inner, currentHouse=player&&player.hi>=0?houses[player.hi]:null, floor=(currentHouse===hs?houseFloor():1);
  // Katlar ayrı sahnelerdir: 1. kat sıcak ahşap, 2. kat açık taş/ahşap.
  const upper=floor===2;
  ctx.fillStyle=upper?'#59666b':'#49382a';ctx.fillRect(n.x,n.y,n.w,n.h);
  for(let yy=n.y;yy<n.y+n.h;yy+=20){
    const row=Math.floor((yy-n.y)/20),off=(row%2)*32;
    ctx.strokeStyle='rgba(20,12,8,.30)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(n.x,yy);ctx.lineTo(n.x+n.w,yy);ctx.stroke();
    for(let xx=n.x-off;xx<n.x+n.w;xx+=64){
      ctx.strokeStyle='rgba(25,15,9,.22)';ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx,Math.min(yy+20,n.y+n.h));ctx.stroke();
    }
    ctx.fillStyle='rgba(205,165,110,.035)';ctx.fillRect(n.x,yy+2,n.w,2);
  }
  // 1. ve 2. kat aynı temel tasarıma sahiptir.

    // Orta halı: çerçeve, desen ve hafif aşınma.
  const rx=n.x+n.w*.27,ry=n.y+n.h*.29,rw=n.w*.46,rh=n.h*.42;
  ctx.fillStyle=upper?'rgba(38,72,88,.72)':'rgba(105,35,32,.62)';ctx.fillRect(rx,ry,rw,rh);
  ctx.strokeStyle='rgba(218,176,118,.48)';ctx.lineWidth=4;ctx.strokeRect(rx+5,ry+5,rw-10,rh-10);
  ctx.strokeStyle='rgba(224,190,135,.22)';ctx.lineWidth=2;ctx.strokeRect(rx+12,ry+12,rw-24,rh-24);
  ctx.fillStyle='rgba(220,180,115,.16)';
  for(let x=rx+18;x<rx+rw-12;x+=22){ctx.beginPath();ctx.arc(x,ry+rh/2,3,0,TAU);ctx.fill();}

  if(upper){
    ctx.fillStyle='rgba(205,225,228,.10)';ctx.fillRect(n.x+8,n.y+8,n.w-16,n.h-16);
    ctx.strokeStyle='rgba(205,225,228,.28)';ctx.lineWidth=3;ctx.strokeRect(n.x+10,n.y+10,n.w-20,n.h-20);
  }

    // Üst kat mimarisi: pencereler, merdiven boşluğu ve korkuluk.
  if(floor===2&&hs.floors===2){
    const windowW=42,windowH=14;
    const wx1=n.x+34,wx2=n.x+n.w-34-windowW,wy=n.y+8;
    for(const wx of [wx1,wx2]){
      ctx.fillStyle='#17232a';ctx.fillRect(wx,wy,windowW,windowH);
      ctx.fillStyle='rgba(150,205,220,.18)';ctx.fillRect(wx+3,wy+3,windowW-6,windowH-6);
      ctx.strokeStyle='#b89562';ctx.lineWidth=2;ctx.strokeRect(wx,wy,windowW,windowH);
      ctx.beginPath();ctx.moveTo(wx+windowW/2,wy);ctx.lineTo(wx+windowW/2,wy+windowH);ctx.stroke();
    }
    const s=hs.stairs;
    ctx.fillStyle='#201710';ctx.fillRect(s.x-12,s.y-10,s.w+24,s.h+20);
    ctx.strokeStyle='#b28a55';ctx.lineWidth=4;ctx.strokeRect(s.x-15,s.y-13,s.w+30,s.h+26);
    // korkuluk dikmeleri
    ctx.lineWidth=2;
    for(let xx=s.x-10;xx<s.x+s.w+12;xx+=10){ctx.beginPath();ctx.moveTo(xx,s.y-12);ctx.lineTo(xx,s.y-2);ctx.stroke();}
    ctx.fillStyle='#d9c49a';ctx.font='800 11px '+FONT;ctx.textAlign='left';ctx.fillText(floor+'. KAT',n.x+12,n.y+n.h-12);
  }
    // Küçük duvar lambaları / sıcak iç mekân ışığı.
  const lamps=[[n.x+18,n.y+18],[n.x+n.w-18,n.y+18]];
  for(const [lx,ly] of lamps){
    const g=ctx.createRadialGradient(lx,ly,2,lx,ly,55);
    g.addColorStop(0,'rgba(255,205,110,.22)');g.addColorStop(1,'rgba(255,180,70,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(lx,ly,55,0,TAU);ctx.fill();
    ctx.fillStyle='#d7a64d';ctx.beginPath();ctx.arc(lx,ly,4,0,TAU);ctx.fill();
  }

  ctx.fillStyle='rgba(245,220,170,.72)';ctx.font='900 12px '+FONT;ctx.textAlign='left';
  ctx.fillText(floor+'. KAT',n.x+12,n.y+n.h-12);

    // Kapı eşiği.
  const d=hs.door;ctx.fillStyle='#8a704c';
  if(d.nx===0)ctx.fillRect(d.x-d.w/2,d.y-hs.T/2,d.w,hs.T);
  else ctx.fillRect(d.x-hs.T/2,d.y-d.w/2,hs.T,d.w);

  // Mobilyalar: alt katta mevcut eşyalar; üst katta sade yatak/masa köşesi.
  const floorFurn=floor===1?hs.furn:hs.furn.map(f=>({
    ...f,
    x:n.x+n.w-(f.x-n.x)-f.w,
    y:n.y+n.h-(f.y-n.y)-f.h
  }));
  for(const f of floorFurn){
    ctx.fillStyle='rgba(0,0,0,.34)';ctx.fillRect(f.x+5,f.y+6,f.w,f.h);
    if(f.kind==='bed'){
      ctx.fillStyle='#5b402d';ctx.fillRect(f.x,f.y,f.w,f.h);
      ctx.fillStyle='#8a9caf';ctx.fillRect(f.x+4,f.y+18,f.w-8,f.h-23);
      ctx.fillStyle='#d8d1c2';ctx.fillRect(f.x+5,f.y+4,f.w-10,13);
      ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(f.x+7,f.y+21,f.w-14,3);
      ctx.strokeStyle='#3e2b20';ctx.lineWidth=2;ctx.strokeRect(f.x+1,f.y+1,f.w-2,f.h-2);
    }else{
      ctx.fillStyle='#4a311e';
      ctx.fillRect(f.x+4,f.y+4,6,f.h-4);ctx.fillRect(f.x+f.w-10,f.y+4,6,f.h-4);
      ctx.fillStyle='#8a6037';ctx.fillRect(f.x,f.y,f.w,f.h-8);
      ctx.fillStyle='rgba(235,190,120,.12)';ctx.fillRect(f.x+3,f.y+3,f.w-6,3);
      ctx.strokeStyle='#49311c';ctx.lineWidth=2;ctx.strokeRect(f.x+1,f.y+1,f.w-2,f.h-10);
      // Masanın üzerinde küçük eşya.
      ctx.fillStyle='#b9b2a0';ctx.fillRect(f.x+f.w*.62,f.y+6,9,7);
      ctx.fillStyle='#6f3428';ctx.beginPath();ctx.arc(f.x+f.w*.30,f.y+8,4,0,TAU);ctx.fill();
    }
  }

  // Sandıklar yalnızca ait oldukları alt katta kalır.
  for(const c of hs.chests){
    if((c.floor||1)!==floor)continue;
    ctx.fillStyle='rgba(0,0,0,.32)';ctx.fillRect(c.x+4,c.y+5,c.w,c.h);
    ctx.fillStyle=c.open?'#554024':'#8b602d';ctx.fillRect(c.x,c.y,c.w,c.h);
    ctx.strokeStyle='#35240f';ctx.lineWidth=2;ctx.strokeRect(c.x+1,c.y+1,c.w-2,c.h-2);
    ctx.fillStyle='rgba(230,190,100,.20)';ctx.fillRect(c.x+3,c.y+4,c.w-6,3);
    if(c.open){ctx.fillStyle='#1b1209';ctx.fillRect(c.x+4,c.y+4,c.w-8,c.h-8);}
    else{
      ctx.fillStyle='#e0b83a';ctx.fillRect(c.x+c.w/2-4,c.y+c.h/2-5,8,10);
      if(nearChest===c){ctx.strokeStyle='#f0b429';ctx.lineWidth=3;ctx.strokeRect(c.x-3,c.y-3,c.w+6,c.h+6);}
    }
  }

  // Duvarlar: alt kat kahverengi, üst kat gri-mavi.
  for(const w of hs.walls){
    ctx.fillStyle=upper?'#77878b':'#704f37';ctx.fillRect(w.x,w.y,w.w,w.h);
    ctx.fillStyle=upper?'rgba(210,235,235,.14)':'rgba(220,170,105,.12)';ctx.fillRect(w.x+3,w.y+3,Math.max(0,w.w-6),Math.max(0,w.h-6));
    ctx.strokeStyle=upper?'#34464c':'#2a2017';ctx.lineWidth=2;ctx.strokeRect(w.x+1,w.y+1,w.w-2,w.h-2);
  }

  // v148 interior material pass: floor grain, edge grime and lived-in detail.
  ctx.save();ctx.beginPath();ctx.rect(n.x,n.y,n.w,n.h);ctx.clip();
  ctx.strokeStyle=upper?'rgba(225,235,230,.09)':'rgba(225,188,132,.13)';ctx.lineWidth=.8;
  for(let yy=n.y+7;yy<n.y+n.h;yy+=10){ctx.beginPath();ctx.moveTo(n.x,yy);ctx.lineTo(n.x+n.w,yy);ctx.stroke();}
  for(let xx=n.x+18;xx<n.x+n.w;xx+=47){ctx.strokeStyle='rgba(25,18,13,.13)';ctx.beginPath();ctx.moveTo(xx,n.y);ctx.lineTo(xx,n.y+n.h);ctx.stroke();}
  const roomShade=ctx.createRadialGradient(n.x+n.w/2,n.y+n.h/2,20,n.x+n.w/2,n.y+n.h/2,Math.max(n.w,n.h)*.72);roomShade.addColorStop(.45,'rgba(0,0,0,0)');roomShade.addColorStop(1,'rgba(0,0,0,.24)');ctx.fillStyle=roomShade;ctx.fillRect(n.x,n.y,n.w,n.h);
  ctx.fillStyle='rgba(45,28,19,.62)';ctx.fillRect(n.x+25,n.y+28,30,20);ctx.strokeStyle='rgba(190,156,100,.45)';ctx.strokeRect(n.x+27,n.y+30,26,16);
  ctx.fillStyle='rgba(77,104,86,.82)';ctx.fillRect(n.x+n.w-34,n.y+30,6,13);ctx.fillStyle='rgba(210,215,195,.42)';ctx.fillRect(n.x+n.w-33,n.y+27,4,4);ctx.restore();
}

function drawTentInterior(t){
 const x=t.x,y=t.y;ctx.save();
 // Büyük canvas çadır içi: zemin, kumaş kenarlar ve dikişler.
 ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(x+5,y+8,104,88,0,0,TAU);ctx.fill();
 ctx.fillStyle='#30372c';ctx.beginPath();ctx.ellipse(x,y,100,84,0,0,TAU);ctx.fill();
 ctx.strokeStyle='#8a8266';ctx.lineWidth=7;ctx.beginPath();ctx.ellipse(x,y,98,82,0,0,TAU);ctx.stroke();
 ctx.strokeStyle='rgba(220,210,170,.18)';ctx.lineWidth=2;
 ctx.beginPath();ctx.moveTo(x-88,y);ctx.quadraticCurveTo(x,y-24,x+88,y);ctx.moveTo(x,y-74);ctx.lineTo(x,y+74);ctx.stroke();
 // Katlanmış battaniye + büyük uyku tulumu.
 ctx.fillStyle='#4f6148';ctx.fillRect(x-72,y-48,43,93);ctx.strokeStyle='#20291e';ctx.lineWidth=3;ctx.strokeRect(x-72,y-48,43,93);
 ctx.fillStyle='#6f765d';ctx.fillRect(x-67,y-42,33,18);ctx.fillStyle='#394735';ctx.fillRect(x-67,y-18,33,57);
 ctx.strokeStyle='rgba(230,220,180,.18)';ctx.beginPath();ctx.moveTo(x-67,y+8);ctx.lineTo(x-34,y+8);ctx.stroke();
 // Sağ tarafta saha masası, radyo ve harita.
 ctx.fillStyle='#75593b';ctx.fillRect(x+25,y-47,58,31);ctx.strokeStyle='#35271b';ctx.strokeRect(x+25,y-47,58,31);
 ctx.fillStyle='#252a27';ctx.fillRect(x+34,y-41,22,16);ctx.fillStyle='#8e2e27';ctx.fillRect(x+39,y-36,4,4);
 ctx.strokeStyle='#b2a36d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+53,y-41);ctx.lineTo(x+61,y-57);ctx.stroke();
 ctx.fillStyle='#c9b98b';ctx.fillRect(x+60,y-40,17,13);ctx.strokeStyle='#756b50';ctx.lineWidth=1;ctx.strokeRect(x+60,y-40,17,13);
 // Sırt çantası, su matarası, konserve ve botlar.
 ctx.fillStyle='#665039';ctx.fillRect(x+34,y+2,32,34);ctx.fillStyle='#2d3028';ctx.fillRect(x+40,y+8,20,19);
 ctx.strokeStyle='#8b7653';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+50,y+3,12,Math.PI,TAU);ctx.stroke();
 ctx.fillStyle='#68736a';ctx.beginPath();ctx.arc(x+79,y+22,8,0,TAU);ctx.fill();ctx.fillRect(x+75,y+8,8,15);
 ctx.fillStyle='#a99763';ctx.beginPath();ctx.arc(x+14,y+39,7,0,TAU);ctx.fill();
 ctx.fillStyle='#282722';ctx.fillRect(x-9,y+48,18,9);ctx.fillRect(x+12,y+48,18,9);
 // Loot sandığı daha görünür.
 ctx.fillStyle=t.loot?'#383a34':'#9a6932';ctx.fillRect(x-12,y-11,31,24);ctx.strokeStyle='#171812';ctx.lineWidth=3;ctx.strokeRect(x-12,y-11,31,24);
 ctx.fillStyle='#c49a52';ctx.fillRect(x,y-2,7,7);
 // Fener ışığı.
 const g=ctx.createRadialGradient(x-8,y-58,2,x-8,y-58,45);g.addColorStop(0,'rgba(245,218,130,.24)');g.addColorStop(1,'rgba(245,218,130,0)');
 ctx.fillStyle=g;ctx.beginPath();ctx.arc(x-8,y-58,45,0,TAU);ctx.fill();ctx.fillStyle='#d7bd62';ctx.fillRect(x-12,y-63,8,17);
 ctx.font='900 11px '+FONT;ctx.textAlign='center';ctx.fillStyle='#eadba9';ctx.fillText(t.loot?'ÇADIR ARANDI':'E · MALZEMELERİ ARA',x,y+105);
 ctx.restore();
}