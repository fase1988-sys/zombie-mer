import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (message.type() === 'error' && !/supabase|phaser|cdn|network/i.test(message.text())) errors.push(message.text());
});
const results = [];
async function check(name, run) {
  try { await run(); results.push({ name, status: 'PASS' }); console.log('PASS', name); }
  catch (error) { results.push({ name, status: 'FAIL', reason: error.message }); console.error('FAIL', name, error); }
}

try {
  await page.addInitScript(() => { window.__TEST = {}; });
  await page.goto('http://127.0.0.1:8765/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__TEST?.api), { timeout: 15000 });
  await check('menu and canvas load', async () => {
    assert(await page.locator('#mainGameMenu').isVisible());
    assert(await page.locator('#game').isVisible());
    assert.equal(await page.evaluate(() => document.characterSet),'UTF-8');
  });
  await page.locator('#singleMode').click();
  await check('new game starts and draws', async () => {
    await page.waitForFunction(() => window.__TEST.api.state !== 'menu');
    const info = await page.evaluate(() => ({
      state: window.__TEST.api.state,
      player: Boolean(window.__TEST.api.player),
      opaquePixels: (() => {
        const c=document.querySelector('#game');
        const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
        let count=0;for(let i=3;i<d.length;i+=32)if(d[i]>0)count++;return count;
      })()
    }));
    assert(info.player && info.opaquePixels > 200, JSON.stringify(info));
  });
  await check('visual-v4 assets load', async () => {
    await page.waitForFunction(() => VISUAL_V4.ready('vegetation/tree_01') &&
      VISUAL_V4.ready('terrain/forest') && VISUAL_V4.ready('buildings/cabin_01') &&
      VISUAL_V4.ready('characters/player/player_idle') &&
      VISUAL_V4.ready('characters/player/player_walk_01') &&
      VISUAL_V4.ready('characters/player/player_shoot') &&
      VISUAL_V4.ready('characters/zombies/zombie_idle') &&
      VISUAL_V4.ready('characters/zombies/zombie_attack'), { timeout: 10000 });
  });
  await check('extracted characters draw and preserve gameplay positions', async () => {
    const info=await page.evaluate(() => {
      const api=window.__TEST.api,p=api.player,before={x:p.x,y:p.y,hp:p.hp};
      const c=document.createElement('canvas');c.width=c.height=128;
      const rendered=VISUAL_V4.character(c.getContext('2d'),'characters/player/player_idle',64,110,42,71);
      const pixels=c.getContext('2d').getImageData(40,38,48,72).data;
      let visible=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>32)visible++;
      return {rendered,visible,before,after:{x:p.x,y:p.y,hp:p.hp}};
    });
    assert(info.rendered && info.visible>200,JSON.stringify(info));
    assert.deepEqual(info.before,info.after);
  });
  await check('movement and camera', async () => {
    const before=await page.evaluate(() => ({x:window.__TEST.api.player.x,cam:window.__TEST.api.cam.x}));
    await page.keyboard.down('d');await page.waitForTimeout(300);await page.keyboard.up('d');
    const after=await page.evaluate(() => ({x:window.__TEST.api.player.x,cam:window.__TEST.api.cam.x}));
    assert(after.x>before.x+3,JSON.stringify({before,after}));
    assert(Number.isFinite(after.cam));
  });
  await check('inventory toggles without losing items', async () => {
    const amount=await page.evaluate(() => window.__TEST.api.inv.logs);
    await page.keyboard.press('i');await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() => window.__TEST.api.backpackOpen),true);
    await page.keyboard.press('i');
    assert.equal(await page.evaluate(() => window.__TEST.api.inv.logs),amount);
    assert.equal(await page.evaluate(() => window.__TEST.api.backpackOpen),false);
    assert.equal(await page.evaluate(() => window.__TEST.api.state),'playing');
  });
  await check('zombie simulation and weapon selection', async () => {
    await page.waitForFunction(() => window.__TEST.api.zombies.length>0,{timeout:10000});
    const before=await page.evaluate(() => ({x:window.__TEST.api.zombies[0].x,y:window.__TEST.api.zombies[0].y}));
    await page.keyboard.press('2');await page.waitForTimeout(200);
    const after=await page.evaluate(() => ({count:window.__TEST.api.zombies.length,slot:window.__TEST.api.player.sel}));
    assert.equal(after.slot,1);
    assert(after.count>0);
    await page.waitForTimeout(400);
    const moved=await page.evaluate(({x,y}) => {
      const z=window.__TEST.api.zombies[0];return z&&Math.hypot(z.x-x,z.y-y)>0.1;
    },before);
    assert(moved,'first zombie did not move during simulation');
  });
  await check('day/night switches keep world drawable', async () => {
    await page.evaluate(() => {window.__TEST.api.adminDay('morning');window.__TEST.api.draw();});
    assert.equal(await page.evaluate(() => window.__TEST.api.state),'intermission');
    await page.evaluate(() => {window.__TEST.api.adminDay('night');window.__TEST.api.draw();});
    assert.equal(await page.evaluate(() => window.__TEST.api.state),'playing');
  });
  await check('house, camp and depth painter render', async () => {
    const info=await page.evaluate(() => {
      window.__TEST.api.draw();
      return {houses:window.__TEST.api.houses.length,fire:window.__TEST.api.built.some(b=>b.t==='campfire')};
    });
    assert(info.houses>0&&info.fire,JSON.stringify(info));
  });
  await check('house interior can render', async () => {
    const info=await page.evaluate(() => {
      const api=window.__TEST.api,h=api.houses[0];
      api.player.x=h.inner.x+h.inner.w/2;api.player.y=h.inner.y+h.inner.h/2;
      api.player.hi=api.houseAt(api.player.x,api.player.y);api.draw();
      return {index:api.player.hi,inside:api.houseAt(api.player.x,api.player.y)};
    });
    assert(info.index>=0&&info.index===info.inside,JSON.stringify(info));
  });
  await check('woodcutting and campfire consume existing inventory', async () => {
    await page.evaluate(() => window.__TEST.api.adminDay('morning'));
    const start=await page.evaluate(() => {
      const api=window.__TEST.api,tree=api.obs.find(o=>o.t==='t');
      api.player.x=tree.x+tree.w/2+35;api.player.y=tree.y+tree.h/2;
      api.player.hi=-1;api.player.sel=api.slots().findIndex(s=>s?.k==='axe');
      return {treeId:tree.treeId,logs:api.inv.logs};
    });
    assert(start.treeId>=0);
    for(let i=0;i<5;i++){
      const hit=await page.evaluate(() => window.__TEST.api.chopTree());
      assert(hit,'tree hit '+(i+1)+' was rejected');
      if(i<4)await page.waitForTimeout(1050);
    }
    const cut=await page.evaluate(({treeId}) => {
      const api=window.__TEST.api;
      return {exists:api.obs.some(o=>o.treeId===treeId),logs:api.inv.logs};
    },start);
    assert(!cut.exists&&cut.logs>=start.logs+3,JSON.stringify(cut));
    const fire=await page.evaluate(() => {
      const api=window.__TEST.api,f=api.built.find(o=>o.t==='campfire');
      api.player.x=f.x+f.w/2;api.player.y=f.y+f.h/2;api.player.hi=-1;
      const before=api.inv.logs,success=api.feedCampfire();
      return {before,after:api.inv.logs,success};
    });
    assert(fire.success&&fire.after===fire.before-3,JSON.stringify(fire));
  });
  await check('admin panel and HUD remain mounted', async () => {
    await page.locator('#adminBtn').click();
    assert(await page.locator('#adminPanel').isVisible());
    await page.locator('#adminClose').click();
    assert(await page.locator('#game').isVisible());
  });
  await mkdir('test-results',{recursive:true});
  await page.screenshot({path:'test-results/camp-browser.png'});
  await check('no browser exceptions', async () => assert.deepEqual(errors,[]));
} finally {
  console.log(JSON.stringify({ results, errors },null,2));
  await browser.close();
}
if(results.some(r=>r.status==='FAIL')) process.exitCode=1;
