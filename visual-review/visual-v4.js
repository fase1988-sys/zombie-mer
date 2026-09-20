// Optional asset layer. Image loading never blocks gameplay; Canvas art remains
// a fallback if an asset is unavailable. Coordinates and hitboxes are untouched.
const VISUAL_V4 = (() => {
  const root='assets/visual-v4/';
  const names=['vegetation/tree_01','vegetation/tree_02','vegetation/tree_03','vegetation/tree_04',
    'vegetation/bush_01','vegetation/bush_02','vegetation/fern_01','props/rock_01',
    'props/rock_02','props/woodpile','props/bench','props/crate','props/barrel',
    'props/military_box','props/logs','props/campfire','vehicles/car_wreck_01',
    'props/sign_river','props/street_lamp','buildings/cabin_01','terrain/forest','terrain/grass',
    'terrain/mud','terrain/asphalt','terrain/rocky',
    'characters/player/player_idle','characters/player/player_walk_01',
    'characters/player/player_walk_02','characters/player/player_melee',
    'characters/player/player_shoot','characters/player/player_flashlight',
    'characters/zombies/zombie_idle','characters/zombies/zombie_walk',
    'characters/zombies/zombie_attack','characters/zombies/zombie_death'];
  const images={};
  for(const name of names){const img=new Image();img.src=root+name+'.png';images[name]=img;}
  const ready=name=>images[name]?.complete && images[name].naturalWidth>0;
  function sprite(ctx,name,x,y,w,h){if(!ready(name))return false;ctx.drawImage(images[name],x,y,w,h);return true;}
  function character(ctx,name,x,feetY,w,h,faceLeft=false){
    if(!ready(name))return false;
    ctx.save();ctx.translate(x,feetY);
    if(faceLeft)ctx.scale(-1,1);
    ctx.fillStyle='rgba(0,0,0,.30)';ctx.beginPath();ctx.ellipse(2,1,w*.30,5,0,0,Math.PI*2);ctx.fill();
    ctx.drawImage(images[name],-w/2,-h+2,w,h);
    ctx.restore();return true;
  }
  let forestPattern,roadPattern;
  function makeGround(ctx){
    if(forestPattern||!ready('terrain/forest')||!ready('terrain/grass')||!ready('terrain/mud')||!ready('terrain/rocky'))return;
    const size=768,canvas=document.createElement('canvas');canvas.width=canvas.height=size;
    const g=canvas.getContext('2d');g.fillStyle='#253023';g.fillRect(0,0,size,size);
    let seed=714225;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
    // Build a large irregular cached ground tile from feathered image fragments.
    // Copy fragments across both edges so the final texture joins seamlessly.
    const stamps=[];
    for(const name of ['forest','grass','mud']){
      const stamp=document.createElement('canvas');stamp.width=stamp.height=158;
      const s=stamp.getContext('2d');s.drawImage(images['terrain/'+name],0,0,158,158);
      s.globalCompositeOperation='destination-in';
      const fade=s.createRadialGradient(79,79,25,79,79,79);
      fade.addColorStop(0,'#fff');fade.addColorStop(1,'#0000');
      s.fillStyle=fade;s.fillRect(0,0,158,158);stamps.push(stamp);
    }
    for(let i=0;i<410;i++){
      const x=random()*size,y=random()*size,z=84+random()*130;
      const stamp=stamps[random()<.67?0:random()<.62?1:2];
      g.globalAlpha=.47+random()*.36;
      for(const dx of [-size,0,size])for(const dy of [-size,0,size])
        if(x+dx+z>0&&y+dy+z>0&&x+dx<size&&y+dy<size)g.drawImage(stamp,x+dx,y+dy,z,z);
    }
    g.globalAlpha=1;
    forestPattern=ctx.createPattern(canvas,'repeat');
    const road=document.createElement('canvas');road.width=road.height=384;
    const r=road.getContext('2d');r.fillStyle='#292c2a';r.fillRect(0,0,384,384);
    r.globalAlpha=.45;r.drawImage(images['terrain/rocky'],0,0,384,384);
    r.fillStyle='rgba(12,15,15,.56)';r.fillRect(0,0,384,384);
    roadPattern=ctx.createPattern(road,'repeat');
  }
  function terrain(ctx,cam,W,H,MID,ROAD){
    const l=Math.max(0,cam.x-32),t=Math.max(0,cam.y-32),r=cam.x+W+32,b=cam.y+H+32;
    makeGround(ctx);
    for(const [pattern,regions] of [
      [forestPattern,[[l,t,r-l,b-t]]],
      [roadPattern,[[MID-ROAD/2,t,ROAD,b-t],[l,MID-ROAD/2,r-l,ROAD]]]
    ]){
      if(!pattern)continue;
      for(const [x,y,w,h] of regions){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
        ctx.fillStyle=pattern;ctx.fillRect(x,y,w,h);
      }ctx.restore();}
  }
  function camp(ctx,cam,W,H,MID,ROAD){
    const positions=[['woodpile',-147,-128,92,70],['bench',102,-109,104,58],
      ['crate',-130,104,45,42],['barrel',-79,125,34,47],
      ['military_box',114,127,62,43],['logs',-178,45,66,45],
      ['car_wreck_01',ROAD*.78,ROAD*.73,177,94],
      ['sign_river',ROAD*.73,-ROAD*.62,63,85],
      ['bush_01',-292,-220,65,57],['bush_02',-354,170,60,57],
      ['fern_01',-236,240,64,65],['rock_01',220,-216,53,45],
      ['rock_02',-277,181,56,44]];
    for(const [name,dx,dy,w,h] of positions){const x=MID+dx,y=MID+dy;
      if(x+w<cam.x-30||y+h<cam.y-30||x>cam.x+W+30||y>cam.y+H+30)continue;
      sprite(ctx,(name==='car_wreck_01'?'vehicles/':name.startsWith('bush')||name.startsWith('fern')?'vegetation/':'props/')+name,x,y,w,h);
    }
  }
  return {sprite,character,terrain,camp,ready};
})();
