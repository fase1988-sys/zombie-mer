/* VISUAL REVIEW COPY
Extracted from index.html on main for isolated review.
NOT loaded by the game yet; runtime remains unchanged intentionally.
*/

function drawRealismObjectLighting(){
  ctx.save();
  // Warm campfire bounce light on nearby ground/objects.
  const cf=campfireObject();
  if(cf&&!fireBossActive){
    const x=cf.x+cf.w/2,y=cf.y+cf.h/2,p=clamp(firePower/FIRE_MAX,.08,1);
    const flick=.92+Math.sin(anim*13)*.04+Math.sin(anim*21)*.025;
    const g=ctx.createRadialGradient(x,y,18,x,y,235*p*flick);
    g.addColorStop(0,'rgba(255,177,76,.20)');g.addColorStop(.35,'rgba(255,112,35,.10)');g.addColorStop(1,'rgba(255,70,15,0)');
    ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,240*p,0,TAU);ctx.fill();
  }
  // Character contact/AO rings add depth without altering hitboxes.
  ctx.globalCompositeOperation='source-over';
  for(const z of zombies){
    if(z.dead||z.hi>=0||!vis(z.x-45,z.y-45,90,90))continue;
    const g=ctx.createRadialGradient(z.x+4,z.y+8,2,z.x+4,z.y+8,z.r*1.45);
    g.addColorStop(0,'rgba(0,0,0,.18)');g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(z.x+5,z.y+9,z.r*1.35,z.r*.72,0,0,TAU);ctx.fill();
  }
  ctx.restore();
}

function drawRealismPostFX(){
  ctx.save();
  // Directional moon/sky wash and cinematic contrast; intentionally subtle so HUD stays readable.
  const daylight=(state==='intermission'||state==='craft')?(dayPhase==='day'?1:dayPhase==='dawn'?dawnFade:dayPhase==='dusk'?1-duskFade:0):0;
  const sky=ctx.createLinearGradient(0,0,W,H);
  sky.addColorStop(0,daylight>.5?'rgba(255,224,172,.035)':'rgba(112,148,190,.055)');
  sky.addColorStop(.52,'rgba(0,0,0,0)');
  sky.addColorStop(1,daylight>.5?'rgba(85,55,28,.025)':'rgba(8,14,26,.075)');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  // Fine deterministic grain avoids the flat digital-canvas look.
  ctx.globalAlpha=.055;
  ctx.fillStyle='#d8d3c5';
  const t=Math.floor(anim*8);
  for(let i=0;i<70;i++){
    const x=((i*173+t*47)%Math.max(1,W)),y=((i*97+t*29)%Math.max(1,H));
    ctx.fillRect(x,y,1,1);
  }
  ctx.globalAlpha=1;
  // Large slow cloud shadow creates moving natural light over the terrain.
  if(daylight>.35){
    const cx=((anim*8)%(W+500))-250,cy=H*.28+Math.sin(anim*.08)*90;
    const cloud=ctx.createRadialGradient(cx,cy,30,cx,cy,310);
    cloud.addColorStop(0,'rgba(20,28,25,.10)');cloud.addColorStop(.65,'rgba(20,28,25,.035)');cloud.addColorStop(1,'rgba(20,28,25,0)');
    ctx.fillStyle=cloud;ctx.fillRect(0,0,W,H);
  }
  // Lens vignette.
  const vg=ctx.createRadialGradient(W*.5,H*.46,Math.min(W,H)*.18,W*.5,H*.5,Math.max(W,H)*.74);
  vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(.72,'rgba(0,0,0,.025)');vg.addColorStop(1,'rgba(0,0,0,.22)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  ctx.restore();
}

function drawCampfireVisibility(){
  // Night visibility is physically centered on the campfire, not on the camera/player.
  // Near the fire the scene stays warm and readable; distance falls smoothly into darkness.
  if(!player||player.hi>=0||currentTent())return;
  const cf=campfireObject();if(!cf)return;
  const wx=cf.x+cf.w/2,wy=cf.y+cf.h/2;
  const sx=wx-cam.x,sy=wy-cam.y;
  const power=fireBossActive?0:clamp(firePower/FIRE_MAX,0,1);
  const cycle=(state==='intermission'||state==='craft');
  const night=cycle?(dayPhase==='night'?1:dayPhase==='dusk'?duskFade:dayPhase==='dawn'?1-dawnFade:0):1;
  if(night<=.02)return;
  const flicker=.98+Math.sin(anim*11)*.018+Math.sin(anim*19)*.012;
  const inner=(150+power*95)*flicker, outer=(430+power*300)*flicker;
  ctx.save();
  // Darkness everywhere, punched out by a radial gradient around the actual fire.
  const dark=ctx.createRadialGradient(sx,sy,inner,sx,sy,outer);
  dark.addColorStop(0,'rgba(2,5,8,'+(0.02*night)+')');
  dark.addColorStop(.34,'rgba(2,5,8,'+(0.10*night)+')');
  dark.addColorStop(.68,'rgba(2,5,8,'+(0.48*night)+')');
  dark.addColorStop(1,'rgba(1,3,6,'+(0.82*night)+')');
  ctx.fillStyle=dark;ctx.fillRect(0,0,W,H);
  // Warm fire color in the visible zone.
  if(power>0){
    const warm=ctx.createRadialGradient(sx,sy,8,sx,sy,outer*.58);
    warm.addColorStop(0,'rgba(255,177,74,'+(0.18*power*night)+')');
    warm.addColorStop(.38,'rgba(255,111,34,'+(0.075*power*night)+')');
    warm.addColorStop(1,'rgba(255,80,20,0)');
    ctx.globalCompositeOperation='screen';ctx.fillStyle=warm;ctx.fillRect(0,0,W,H);
  }
  ctx.restore();
}

function drawHeadlampWorldReveal(sx=0,sy=0){
  if(!headlampOn||!player||player.hi>=0||currentTent())return;
  const px=player.x-cam.x+sx,py=player.y-cam.y+sy;
  const a=Number.isFinite(player.ang)?player.ang:0,ux=Math.cos(a),uy=Math.sin(a);
  const reach=560,half=.40;

  // v175 performance: redraw the world ONCE instead of six complete scene redraws.
  // A wide soft-looking reveal is produced by one curved clip; drawHeadlamp supplies the feathered visual falloff.
  ctx.save();
  ctx.globalAlpha=.78;
  ctx.beginPath();
  ctx.moveTo(px+ux*18,py+uy*18);
  ctx.quadraticCurveTo(px+ux*reach*.46+Math.cos(a-Math.PI/2)*150,py+uy*reach*.46+Math.sin(a-Math.PI/2)*150,px+Math.cos(a-half)*reach,py+Math.sin(a-half)*reach);
  ctx.arc(px,py,reach,a-half,a+half);
  ctx.quadraticCurveTo(px+ux*reach*.46+Math.cos(a+Math.PI/2)*150,py+uy*reach*.46+Math.sin(a+Math.PI/2)*150,px+ux*18,py+uy*18);
  ctx.closePath();ctx.clip();
  ctx.translate(-cam.x+sx,-cam.y+sy);
  drawGround();drawUltraEnvironment();drawRealismGroundDetails();drawAbandonedCamps();drawUltraCampDetails();
  drawDecals();drawDrops();drawCrates();drawBaseDangerCircle();drawBuilt();drawPlantedSeeds();drawTrees();drawTreeFalls();
  for(const h of houses)drawRoof(h);
  for(const z of zombies)if(z.hi<0)drawZombie(z);
  drawBombs();drawPlayer();drawWornHeadlamp();drawPeers();drawBulletsParts();drawGhost();drawRealismObjectLighting();
  ctx.restore();

  // Cheap edge veil: darkens only the outer/end region to hide the clip boundary without extra world redraws.
  ctx.save();
  const fx=px+ux*reach*.43,fy=py+uy*reach*.43;
  const veil=ctx.createRadialGradient(fx,fy,reach*.30,fx,fy,reach*.66);
  veil.addColorStop(0,'rgba(2,5,8,0)');
  veil.addColorStop(.55,'rgba(2,5,8,.04)');
  veil.addColorStop(.80,'rgba(2,5,8,.20)');
  veil.addColorStop(1,'rgba(1,3,6,.62)');
  ctx.fillStyle=veil;
  ctx.beginPath();ctx.moveTo(px,py);ctx.arc(px,py,reach,a-half,a+half);ctx.closePath();ctx.fill();
  ctx.restore();
}

function drawHeadlamp(){
  if(!headlampOn||!player)return;
  const px=player.x-cam.x,py=player.y-cam.y,a=Number.isFinite(player.ang)?player.ang:0;
  const ux=Math.cos(a),uy=Math.sin(a),reach=560;
  ctx.save();ctx.globalCompositeOperation='screen';

  // Tiny spill at the lamp itself.
  const local=ctx.createRadialGradient(px,py,0,px,py,58);
  local.addColorStop(0,'rgba(255,238,190,.12)');local.addColorStop(1,'rgba(255,210,140,0)');
  ctx.fillStyle=local;ctx.beginPath();ctx.arc(px,py,58,0,TAU);ctx.fill();

  // Broad projected hotspot like the approved reference image.
  const hx=px+ux*reach*.46,hy=py+uy*reach*.46;
  const glow=ctx.createRadialGradient(hx,hy,0,hx,hy,reach*.48);
  glow.addColorStop(0,'rgba(255,250,218,.24)');
  glow.addColorStop(.18,'rgba(255,241,194,.18)');
  glow.addColorStop(.42,'rgba(255,224,164,.105)');
  glow.addColorStop(.67,'rgba(255,207,137,.052)');
  glow.addColorStop(.86,'rgba(255,194,118,.018)');
  glow.addColorStop(1,'rgba(255,185,105,0)');
  ctx.fillStyle=glow;ctx.beginPath();ctx.arc(hx,hy,reach*.48,0,TAU);ctx.fill();

  // Soft directional shaft; no opaque polygon and no sharp edge.
  ctx.save();ctx.translate(px,py);ctx.rotate(a);
  const shaft=ctx.createLinearGradient(0,0,reach,0);
  shaft.addColorStop(0,'rgba(255,239,194,.045)');
  shaft.addColorStop(.18,'rgba(255,238,190,.075)');
  shaft.addColorStop(.48,'rgba(255,228,174,.065)');
  shaft.addColorStop(.75,'rgba(255,211,148,.032)');
  shaft.addColorStop(1,'rgba(255,195,125,0)');
  ctx.fillStyle=shaft;ctx.beginPath();ctx.moveTo(10,-10);
  ctx.bezierCurveTo(reach*.22,-35,reach*.58,-112,reach,-178);
  ctx.lineTo(reach,178);
  ctx.bezierCurveTo(reach*.58,112,reach*.22,35,10,10);ctx.closePath();ctx.fill();ctx.restore();
  ctx.restore();
}