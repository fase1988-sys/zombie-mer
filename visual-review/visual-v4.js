// Optional asset layer. Image loading never blocks gameplay; Canvas art remains
// a fallback if an asset is unavailable. Coordinates and hitboxes are untouched.
const VISUAL_V4 = (() => {
  const root='assets/visual-v4/';
  const names=['vegetation/tree_01','vegetation/tree_02','vegetation/tree_03','vegetation/tree_04',
    'vegetation/bush_01','vegetation/bush_02','vegetation/fern_01','props/rock_01',
    'props/rock_02','props/woodpile','props/bench','props/crate','props/barrel',
    'props/military_box','props/logs','props/campfire','vehicles/car_wreck_01',
    'props/sign_river','props/street_lamp','terrain/forest','terrain/grass',
    'terrain/mud','terrain/asphalt','terrain/rocky'];
  const images={};
  for(const name of names){const img=new Image();img.src=root+name+'.png';images[name]=img;}
  const ready=name=>images[name]?.complete && images[name].naturalWidth>0;
  function sprite(ctx,name,x,y,w,h){if(!ready(name))return false;ctx.drawImage(images[name],x,y,w,h);return true;}
  function terrain(ctx,cam,W,H,MID,ROAD){
    const l=Math.max(0,cam.x-32),t=Math.max(0,cam.y-32),r=cam.x+W+32,b=cam.y+H+32;
    if(r<MID-560||l>MID+560||b<MID-560||t>MID+560)return;
    // Mirrored tiles have no straight outer seam; repeat only over visible area.
    for(const [name,regions] of [
      ['forest',[[l,t,r-l,b-t]]],
      ['asphalt',[[MID-ROAD/2,t,ROAD,b-t],[l,MID-ROAD/2,r-l,ROAD]]]
    ]){
      if(!ready('terrain/'+name))continue;
      const img=images['terrain/'+name],size=192;
      for(const [x,y,w,h] of regions){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
        ctx.beginPath();ctx.rect(MID-560,MID-560,1120,1120);ctx.clip();
        for(let tx=Math.floor(x/size)*size;tx<x+w;tx+=size)
          for(let ty=Math.floor(y/size)*size;ty<y+h;ty+=size){
            ctx.save();ctx.translate(tx+(Math.floor(tx/size)&1?size:0),ty+(Math.floor(ty/size)&1?size:0));
            ctx.scale(Math.floor(tx/size)&1?-1:1,Math.floor(ty/size)&1?-1:1);
            ctx.drawImage(img,0,0,size,size);ctx.restore();
          }
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
  return {sprite,terrain,camp,ready};
})();
