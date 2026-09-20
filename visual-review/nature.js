/* VISUAL REVIEW COPY
Extracted from index.html on main for isolated review.
NOT loaded by the game yet; runtime remains unchanged intentionally.
*/

function drawGround() {
  // Original procedural game map restored. Uploaded map images are no longer used.
  drawProceduralGround();
}

function drawTrees() {
  const palettes=[
    {dark:'#17361f',mid:'#24502c',light:'#3f7040',hi:'#6f9560'},
    {dark:'#183b23',mid:'#285b34',light:'#477d49',hi:'#7da06b'},
    {dark:'#142f1d',mid:'#21482a',light:'#386a3d',hi:'#688e59'}
  ];
  for(const o of obs){
    if(o.t!=='t')continue;
    const cx=o.x+o.w/2,cy=o.y+o.h/2,cr=o.cr;
    if(!vis(cx-cr*1.35,cy-cr*1.35,cr*2.7,cr*2.8,24))continue;
    const p=palettes[(o.shade||0)%palettes.length];
    const sway=Math.sin(anim*.85+cx*.011+cy*.008)*cr*.035;
    ctx.save();
    // Yumuşak zemin gölgesi: ağacı zemine oturtur.
    ctx.fillStyle='rgba(0,0,0,.30)';ctx.beginPath();ctx.ellipse(cx+12,cy+cr*.66,cr*.82,cr*.38,-.12,0,TAU);ctx.fill();
    // Gövde: konik, kabuk çizgili ve hacimli.
    const trunkTop=cy-cr*.22,trunkBottom=cy+cr*.64,tw=Math.max(8,o.w*.42);
    const tg=ctx.createLinearGradient(cx-tw,0,cx+tw,0);
    tg.addColorStop(0,'#2b1b10');tg.addColorStop(.35,'#5b3a20');tg.addColorStop(.68,'#795132');tg.addColorStop(1,'#352115');
    ctx.fillStyle=tg;ctx.beginPath();ctx.moveTo(cx-tw*.32,trunkTop);ctx.lineTo(cx-tw*.62,trunkBottom);ctx.lineTo(cx+tw*.58,trunkBottom);ctx.lineTo(cx+tw*.30,trunkTop);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(25,13,7,.55)';ctx.lineWidth=1.5;
    for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(cx+k*tw*.18,trunkBottom-3);ctx.lineTo(cx+k*tw*.12,trunkTop+8);ctx.stroke();}
    // Dallar.
    ctx.strokeStyle='#4a2d19';ctx.lineWidth=Math.max(3,tw*.22);ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(cx,cy+cr*.10);ctx.lineTo(cx-cr*.34+sway*.25,cy-cr*.30);
    ctx.moveTo(cx,cy+cr*.03);ctx.lineTo(cx+cr*.36+sway*.25,cy-cr*.25);ctx.stroke();
    // Çok katmanlı, düzensiz taç. Tek yuvarlak top görünümü yok.
    const blobs=[
      [-.48,.02,.48,p.dark],[-.30,-.34,.53,p.mid],[.05,-.48,.57,p.mid],
      [.38,-.30,.50,p.dark],[.52,.04,.43,p.mid],[.16,.14,.57,p.light],
      [-.20,.18,.55,p.mid],[-.02,-.08,.66,p.mid]
    ];
    for(let j=0;j<blobs.length;j++){
      const b=blobs[j],bx=cx+b[0]*cr+sway*(.45+j*.04),by=cy+b[1]*cr;
      ctx.fillStyle=b[3];ctx.beginPath();
      ctx.arc(bx,by,cr*b[2],0,TAU);ctx.fill();
    }
    // Alt gölge + üstten ışık lekeleri.
    ctx.fillStyle='rgba(5,18,10,.22)';ctx.beginPath();ctx.ellipse(cx+sway*.3,cy+cr*.20,cr*.70,cr*.30,0,0,TAU);ctx.fill();
    ctx.fillStyle=p.hi;
    const highlights=[[-.32,-.54,.17],[.02,-.70,.15],[.34,-.48,.13],[-.50,-.20,.11],[.15,-.34,.12]];
    for(const h of highlights){ctx.globalAlpha=.34;ctx.beginPath();ctx.ellipse(cx+h[0]*cr+sway,cy+h[1]*cr,cr*h[2],cr*h[2]*.62,-.35,0,TAU);ctx.fill();}
    ctx.globalAlpha=1;
    // v147: leaf-edge breakup and fine branch silhouettes make crowns less cartoon-like.
    ctx.strokeStyle='rgba(19,42,23,.42)';ctx.lineWidth=1.2;ctx.lineCap='round';
    for(let k=0;k<9;k++){const aa=k*2.399+(cx%17)*.03,rr=cr*(.42+(k%3)*.13),ex=cx+Math.cos(aa)*rr+sway,ey=cy-cr*.12+Math.sin(aa)*rr*.72;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex+Math.cos(aa)*cr*.12,ey+Math.sin(aa)*cr*.09);ctx.stroke();}
    ctx.fillStyle='rgba(105,145,82,.30)';
    for(let k=0;k<11;k++){const aa=k*2.17+(cy%13)*.04,rr=cr*(.28+(k%4)*.11);ctx.beginPath();ctx.ellipse(cx+Math.cos(aa)*rr+sway,cy-cr*.12+Math.sin(aa)*rr*.75,cr*.055,cr*.025,aa,0,TAU);ctx.fill();}
    // Kesme hasarı: 1-2 vuruşta gövdede gerçekçi balta izi.
    const hits=o.woodHits||0;
    if(hits>0){
      ctx.fillStyle='#d0a06a';ctx.beginPath();ctx.moveTo(cx-tw*.38,cy+cr*.30);ctx.lineTo(cx+tw*.08,cy+cr*.22);ctx.lineTo(cx-tw*.22,cy+cr*.43);ctx.closePath();ctx.fill();
      if(hits>1){ctx.fillStyle='#ead0a0';ctx.beginPath();ctx.moveTo(cx+tw*.30,cy+cr*.34);ctx.lineTo(cx-tw*.02,cy+cr*.25);ctx.lineTo(cx+tw*.18,cy+cr*.46);ctx.closePath();ctx.fill();}
    }
    ctx.strokeStyle='rgba(38,22,13,.58)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-tw*.25,trunkBottom-2);ctx.lineTo(cx-tw*.78,trunkBottom+7);ctx.moveTo(cx+tw*.22,trunkBottom-2);ctx.lineTo(cx+tw*.78,trunkBottom+6);ctx.stroke();
    ctx.fillStyle='rgba(24,18,12,.42)';ctx.beginPath();ctx.ellipse(cx+tw*.12,cy+cr*.28,tw*.13,tw*.20,.2,0,TAU);ctx.fill();
    for(let k=0;k<18;k++){const aa=k*2.47+(cx+cy)*.001,rr=cr*(.20+(k%6)*.105);ctx.fillStyle=k%3===0?'rgba(128,157,91,.20)':'rgba(8,30,15,.16)';ctx.beginPath();ctx.arc(cx+Math.cos(aa)*rr+sway,cy-cr*.12+Math.sin(aa)*rr*.68,cr*(.035+(k%3)*.012),0,TAU);ctx.fill();}
    ctx.restore();
  }
}

function drawTreeFalls(){
 for(const f of treeFalls){
  if(!vis(f.x-f.cr*1.5,f.y-f.cr*1.5,f.cr*3,f.cr*3,50))continue;
  const pal=[['#17361f','#3f7040'],['#183b23','#477d49'],['#142f1d','#386a3d']][f.shade%3];
  ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.a*f.d);ctx.globalAlpha=Math.max(0,1-Math.max(0,f.t-.72)/.43);
  ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(12,f.cr*.72,f.cr*.75,f.cr*.25,0,0,TAU);ctx.fill();
  ctx.fillStyle='#55351e';ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(-9,f.cr*1.35);ctx.lineTo(9,f.cr*1.35);ctx.lineTo(6,0);ctx.closePath();ctx.fill();
  const b=[[-.35,-.08,.55],[.08,-.28,.66],[.43,-.04,.48],[-.02,.18,.58]];
  for(let j=0;j<b.length;j++){ctx.fillStyle=j%2?pal[1]:pal[0];ctx.beginPath();ctx.arc(b[j][0]*f.cr,b[j][1]*f.cr,f.cr*b[j][2],0,TAU);ctx.fill();}
  ctx.restore();
 }
}