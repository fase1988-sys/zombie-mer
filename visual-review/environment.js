/* VISUAL REVIEW COPY
Extracted from index.html on main for isolated review.
NOT loaded by the game yet; runtime remains unchanged intentionally.
*/

function drawCrates() {
  for (const o of obs) {
    if (o.t !== 'c' || !vis(o.x, o.y, o.w + 6, o.h + 6)) continue;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(o.x + 4, o.y + 5, o.w, o.h);
    ctx.fillStyle = '#7a5a34'; ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.strokeStyle = '#4d3820'; ctx.lineWidth = 3; ctx.strokeRect(o.x + 1.5, o.y + 1.5, o.w - 3, o.h - 3);
    ctx.beginPath(); ctx.moveTo(o.x + 4, o.y + 4); ctx.lineTo(o.x + o.w - 4, o.y + o.h - 4);
    ctx.moveTo(o.x + o.w - 4, o.y + 4); ctx.lineTo(o.x + 4, o.y + o.h - 4); ctx.stroke();
  }
}

function drawBuilt() {
  for (const o of built) {
    if (!vis(o.x, o.y, o.w + 10, o.h + 24)) continue;
    const f = clamp(o.hp / o.max, 0, 1);
    if (o.t === 'block') {
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(o.x + 4, o.y + 5, o.w, o.h);
      ctx.fillStyle = f > .5 ? '#a9773f' : f > .25 ? '#8f6234' : '#74502a'; ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = '#5a3d1e'; ctx.lineWidth = 2;
      for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(o.x, o.y + i * 10); ctx.lineTo(o.x + o.w, o.y + i * 10); ctx.stroke(); }
      ctx.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2);
      ctx.strokeStyle='rgba(235,190,125,.25)';ctx.lineWidth=1;
      for(let yy=6;yy<o.h;yy+=10){ctx.beginPath();ctx.moveTo(o.x+3,o.y+yy);ctx.lineTo(o.x+o.w-3,o.y+yy);ctx.stroke();}
      ctx.strokeStyle='rgba(45,27,14,.65)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(o.x+5,o.y+o.h-5);ctx.lineTo(o.x+o.w-5,o.y+5);ctx.stroke();
      ctx.fillStyle='#2f2922';for(const nx of [7,o.w-7])for(const ny of [7,o.h-7]){ctx.beginPath();ctx.arc(o.x+nx,o.y+ny,1.5,0,TAU);ctx.fill();}
      if (f < .6) { ctx.strokeStyle = 'rgba(20,10,0,.7)'; ctx.beginPath(); ctx.moveTo(o.x + 8, o.y + 4); ctx.lineTo(o.x + 20, o.y + 20); ctx.lineTo(o.x + 14, o.y + 34); ctx.stroke(); }
      if (f < .3) { ctx.beginPath(); ctx.moveTo(o.x + 34, o.y + 6); ctx.lineTo(o.x + 24, o.y + 24); ctx.stroke(); }
    } else if (o.t === 'door') {
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(o.x + 4, o.y + 5, o.w, o.h);
      ctx.fillStyle = f > .5 ? '#8b5a2b' : f > .25 ? '#70451f' : '#543318'; ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = '#d2a66b'; ctx.lineWidth = 3; ctx.strokeRect(o.x + 2, o.y + 2, o.w - 4, o.h - 4);
      ctx.strokeStyle = '#5a3518'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(o.x + 8, o.y + 4); ctx.lineTo(o.x + 8, o.y + o.h - 4); ctx.moveTo(o.x + o.w - 8, o.y + 4); ctx.lineTo(o.x + o.w - 8, o.y + o.h - 4); ctx.stroke();
      ctx.fillStyle = '#e7c27d'; ctx.beginPath(); ctx.arc(o.x + o.w - 10, o.y + o.h / 2, 3, 0, TAU); ctx.fill();
    } else if(o.t==='campfire'){
      const cx=o.x+o.w/2,cy=o.y+o.h/2;
      const flameScale=fireBossActive?0:clamp(firePower/FIRE_MAX,.08,1), f1=(Math.sin(anim*13)*2.2+Math.sin(anim*21)*1.2)*flameScale, f2=Math.sin(anim*17+1.7)*2*flameScale;
      // v105: daha doğal taş çemberi, yanmış odunlar, köz, kıvılcım, duman ve dinamik ışık.
      ctx.fillStyle='rgba(0,0,0,.34)';ctx.beginPath();ctx.ellipse(cx+4,cy+10,31,18,0,0,TAU);ctx.fill();
      ctx.fillStyle='rgba(42,20,12,.72)';ctx.beginPath();ctx.ellipse(cx,cy+4,21,12,0,0,TAU);ctx.fill();
      for(let i=0;i<12;i++){const aa=i*TAU/12,rx=22+Math.sin(i*3.7)*2,ry=13+Math.cos(i*2.1);ctx.fillStyle=i%3===0?'#948a79':i%2?'#625d55':'#797166';ctx.beginPath();ctx.ellipse(cx+Math.cos(aa)*rx,cy+Math.sin(aa)*ry,6.5,4.7,aa+.2,0,TAU);ctx.fill();ctx.strokeStyle='rgba(35,30,26,.55)';ctx.lineWidth=1;ctx.stroke();}
      // kömürleşmiş üç odun
      ctx.lineCap='round';ctx.strokeStyle='#2b1b13';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(cx-16,cy+8);ctx.lineTo(cx+16,cy-8);ctx.moveTo(cx-17,cy-6);ctx.lineTo(cx+16,cy+9);ctx.moveTo(cx-13,cy+11);ctx.lineTo(cx+11,cy+11);ctx.stroke();
      ctx.strokeStyle='#704126';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx-14,cy+6);ctx.lineTo(cx+13,cy-7);ctx.moveTo(cx-14,cy-5);ctx.lineTo(cx+13,cy+8);ctx.stroke();ctx.lineCap='butt';
      // kızgın közler
      for(let i=0;i<7;i++){const aa=i*2.4,rrr=4+(i%3)*4;ctx.fillStyle=i%2?'#ff6a18':'#d53b14';ctx.globalAlpha=.55+.35*Math.sin(anim*8+i);ctx.beginPath();ctx.arc(cx+Math.cos(aa)*rrr,cy+5+Math.sin(aa)*4,1.7+(i%2),0,TAU);ctx.fill();}ctx.globalAlpha=1;
      // alevler
      ctx.fillStyle='rgba(198,45,14,.94)';ctx.beginPath();ctx.moveTo(cx-14,cy+6);ctx.quadraticCurveTo(cx-19,cy-11*flameScale,cx-6,cy-(8+21*flameScale)-f1);ctx.quadraticCurveTo(cx-1,cy-21*flameScale,cx+5,cy-(8+34*flameScale)+f2);ctx.quadraticCurveTo(cx+21,cy-13,cx+13,cy+6);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ff8b16';ctx.beginPath();ctx.moveTo(cx-10,cy+6);ctx.quadraticCurveTo(cx-11,cy-9,cx,cy-29+f2);ctx.quadraticCurveTo(cx+14,cy-8,cx+9,cy+6);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ffe08a';ctx.beginPath();ctx.moveTo(cx-5,cy+5);ctx.quadraticCurveTo(cx-5,cy-5,cx+2,cy-18-f1*.35);ctx.quadraticCurveTo(cx+8,cy-4,cx+5,cy+5);ctx.closePath();ctx.fill();
      // kıvılcımlar + ince duman
      for(let i=0;i<4;i++){const sy=cy-24-((anim*24+i*17)%42),sx=cx+Math.sin(anim*4+i*2.2)*8;ctx.globalAlpha=Math.max(0,1-(cy-24-sy)/45);ctx.fillStyle='#ffc45a';ctx.beginPath();ctx.arc(sx,sy,1.2,0,TAU);ctx.fill();}ctx.globalAlpha=1;
      for(let i=0;i<3;i++){const sy=cy-39-((anim*10+i*23)%48),sx=cx+Math.sin(anim*1.2+i)*9;ctx.fillStyle='rgba(110,110,105,.08)';ctx.beginPath();ctx.arc(sx,sy,7+i*2,0,TAU);ctx.fill();}
      const glow=ctx.createRadialGradient(cx,cy,3,cx,cy,72+f1);glow.addColorStop(0,'rgba(255,166,60,.25)');glow.addColorStop(.45,'rgba(255,105,25,.10)');glow.addColorStop(1,'rgba(255,80,15,0)');ctx.fillStyle=glow;ctx.fillRect(cx-80,cy-80,160,160);
    } else if(o.t==='workbench'){
      // v105: kalın ahşap tabla, ayaklar, raf, mengene ve gerçek alet detayları.
      ctx.fillStyle='rgba(0,0,0,.34)';ctx.beginPath();ctx.ellipse(o.x+o.w/2+5,o.y+o.h-1,o.w*.55,12,0,0,TAU);ctx.fill();
      // sağlam ayaklar ve alt bağlantı kirişi
      ctx.fillStyle='#422817';ctx.fillRect(o.x+7,o.y+18,10,o.h-5);ctx.fillRect(o.x+o.w-17,o.y+18,10,o.h-5);
      ctx.fillStyle='#5a361d';ctx.fillRect(o.x+12,o.y+32,o.w-24,7);
      ctx.strokeStyle='#2d1b11';ctx.lineWidth=2;ctx.strokeRect(o.x+12,o.y+32,o.w-24,7);
      // alt rafta kutu ve odun parçaları
      ctx.fillStyle='#6d492b';ctx.fillRect(o.x+21,o.y+29,18,8);ctx.strokeStyle='#342217';ctx.strokeRect(o.x+21,o.y+29,18,8);
      ctx.strokeStyle='#7d512c';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(o.x+43,o.y+35);ctx.lineTo(o.x+61,o.y+31);ctx.stroke();
      // kalın, çizgili çalışma tablası
      ctx.fillStyle='#6d4324';ctx.fillRect(o.x-4,o.y+7,o.w+8,15);
      ctx.fillStyle='#a56e3b';ctx.fillRect(o.x-5,o.y+3,o.w+10,13);
      ctx.fillStyle='#bd8248';ctx.fillRect(o.x-3,o.y+4,o.w+6,4);
      ctx.strokeStyle='#5c371e';ctx.lineWidth=1;for(let xx=o.x+5;xx<o.x+o.w;xx+=15){ctx.beginPath();ctx.moveTo(xx,o.y+4);ctx.lineTo(xx-4,o.y+15);ctx.stroke();}
      // metal mengene
      ctx.fillStyle='#444d50';ctx.fillRect(o.x+6,o.y-2,20,11);ctx.fillStyle='#788185';ctx.fillRect(o.x+8,o.y-5,16,6);ctx.fillStyle='#9aa0a1';ctx.fillRect(o.x+9,o.y-4,14,2);
      ctx.strokeStyle='#303638';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(o.x+25,o.y+4);ctx.lineTo(o.x+33,o.y+10);ctx.stroke();ctx.fillStyle='#697174';ctx.beginPath();ctx.arc(o.x+34,o.y+11,3,0,TAU);ctx.fill();
      // çekiç
      ctx.strokeStyle='#7b4a28';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(o.x+38,o.y+4);ctx.lineTo(o.x+49,o.y+16);ctx.stroke();ctx.fillStyle='#4a5052';ctx.fillRect(o.x+34,o.y+1,14,6);
      // el testeresi
      ctx.strokeStyle='#8a552d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(o.x+57,o.y+3);ctx.lineTo(o.x+64,o.y+15);ctx.stroke();ctx.fillStyle='#c7ccca';ctx.beginPath();ctx.moveTo(o.x+52,o.y+3);ctx.lineTo(o.x+68,o.y+2);ctx.lineTo(o.x+64,o.y+9);ctx.closePath();ctx.fill();ctx.strokeStyle='#6b7273';ctx.lineWidth=1;ctx.stroke();
      // birkaç çivi / metal parça
      ctx.fillStyle='#c0c5c4';for(let i=0;i<3;i++)ctx.fillRect(o.x+29+i*5,o.y+17-(i%2)*2,4,1.5);
      ctx.fillStyle='#f4ead4';ctx.font='900 12px '+FONT;ctx.textAlign='center';ctx.shadowColor='#000';ctx.shadowBlur=4;ctx.fillText('ÇALIŞMA TEZGÂHI',o.x+o.w/2,o.y-12);ctx.shadowBlur=0;ctx.lineCap='butt';
    } else {
      const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.arc(cx + 3, cy + 4, 20, 0, TAU); ctx.fill();
      ctx.fillStyle = '#2c3a44'; ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeStyle = '#7f96a6'; ctx.lineWidth = 2; ctx.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.ang || 0);
      ctx.fillStyle = '#48606f'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill();
      ctx.fillStyle = '#11181d'; ctx.fillRect(4, -3, 20, 6);
      ctx.restore();
    }

    if(o.utility)continue;
    // Can çubuğu ve sayısal can HER ZAMAN görünür.
    const by = o.y - 14;
    ctx.fillStyle = 'rgba(0,0,0,.78)'; ctx.fillRect(o.x, by, o.w, 6);
    ctx.fillStyle = f > .5 ? '#7fbf5a' : f > .25 ? '#e0a530' : '#d64534';
    ctx.fillRect(o.x, by, o.w * f, 6);
    ctx.font = '700 10px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#000'; ctx.shadowBlur = 3;
    ctx.fillText(Math.max(0, Math.ceil(o.hp)) + '/' + o.max, o.x + o.w / 2, by - 1);
    ctx.shadowBlur = 0; ctx.textBaseline = 'alphabetic';
  }
}

function drawPlantedSeeds(){
 for(const p of plantedTrees){
  if(!vis(p.x-12,p.y-18,24,30,10))continue;
  ctx.fillStyle='#6a4a28';ctx.beginPath();ctx.arc(p.x,p.y+5,4,0,TAU);ctx.fill();
  ctx.strokeStyle='#79a85a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x,p.y+3);ctx.lineTo(p.x,p.y-9);ctx.stroke();
  ctx.fillStyle='#88b866';ctx.beginPath();ctx.ellipse(p.x-5,p.y-7,6,3,-.5,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(p.x+5,p.y-5,6,3,.5,0,TAU);ctx.fill();
 }
}

function drawDecals() {
  for (const d of decals) {
    if (!vis(d.x - 80, d.y - 80, 160, 160)) continue;
    if (d.blood) {
      const al=clamp(d.life/4,0,1);ctx.save();ctx.translate(d.x,d.y);
      ctx.fillStyle='rgba(72,8,12,'+(.58*al)+')';ctx.beginPath();ctx.ellipse(0,0,d.r*1.15,d.r*.72,.18,0,TAU);ctx.fill();
      ctx.fillStyle='rgba(126,14,18,'+(.42*al)+')';
      for(let i=0;i<4;i++){const a=i*1.71+d.r*.07,rr=d.r*(.45+(i%2)*.18);ctx.beginPath();ctx.arc(Math.cos(a)*d.r*.55,Math.sin(a)*d.r*.34,rr*.42,0,TAU);ctx.fill();}
      ctx.fillStyle='rgba(225,70,65,'+(.10*al)+')';ctx.beginPath();ctx.ellipse(-d.r*.18,-d.r*.16,d.r*.28,d.r*.10,-.25,0,TAU);ctx.fill();ctx.restore();
    }
    else if (d.scorch) { ctx.fillStyle = 'rgba(10,10,10,' + (0.55 * clamp(d.life / 3, 0, 1)) + ')'; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, TAU); ctx.fill(); }
    else if (d.corpse) {
      const T = ZT[d.type], al = clamp(d.life / 2, 0, 1) * 0.8;
      ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(d.a + 1.2); ctx.globalAlpha = al;
      ctx.fillStyle = T.col; ctx.beginPath(); ctx.ellipse(0, 0, d.r * 1.05, d.r * .78, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = T.head; ctx.beginPath(); ctx.arc(d.r * .7, 0, d.r * .5, 0, TAU); ctx.fill();
      ctx.restore();
    }
  }
}

function drawDrops() {
  for (const dr of drops) {
    if (!vis(dr.x - 30, dr.y - 30, 60, 60)) continue;
    const pulse = 1 + Math.sin(anim * 5) * 0.08;
    ctx.save(); ctx.translate(dr.x, dr.y); ctx.scale(pulse, pulse);
    ctx.fillStyle = 'rgba(200,56,43,.25)'; ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fill();
    ctx.fillStyle = '#ece6d6'; ctx.fillRect(-12, -12, 24, 24);
    ctx.fillStyle = '#c8382b'; ctx.fillRect(-3, -9, 6, 18); ctx.fillRect(-9, -3, 18, 6);
    ctx.restore();
  }
}