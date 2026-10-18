const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const source=process.env.ORBIT_URL||'http://127.0.0.1:8000/';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(source);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1200);
  assert(await page.locator('.identity-badge img').isVisible());
  assert.equal(await page.locator('#discoveryLog').count(),0);
  const holeBefore=await page.locator('#blackholeFlow').evaluate(c=>c.toDataURL());
  await page.waitForTimeout(200);assert.notEqual(await page.locator('#blackholeFlow').evaluate(c=>c.toDataURL()),holeBefore);
  await page.locator('#anomaly').click();assert(await page.locator('#home').evaluate(el=>el.classList.contains('gravity-surge')));
  await page.mouse.move(400,300);await page.mouse.move(500,350,{steps:6});
  assert(await page.locator('html').evaluate(el=>el.classList.contains('star-cursor')));
  await page.locator('#mapToggle').focus();await page.keyboard.press('Enter');assert(await page.locator('#starMap').isVisible());
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'mapToggle');
  await page.locator('#moonProfile').click();assert(await page.locator('[data-profile-panel="moon"]').isVisible());
  assert(!(await page.locator('[data-profile-panel="earth"]').isVisible()));
  assert.equal(await page.locator('#moonProfile').getAttribute('aria-pressed'),'true');
  await page.locator('#earthProfile').focus();await page.keyboard.press('Enter');assert(await page.locator('[data-profile-panel="earth"]').isVisible());
  await page.locator('[data-skill="2"]').click();assert.equal(await page.locator('#skillTitle').textContent(),'Frontend development');
  await page.locator('#lostStar').click();assert(await page.locator('.constellation').evaluate(el=>el.classList.contains('wishing')));
  await page.locator('#projects').scrollIntoViewIfNeeded();await page.mouse.move(20,150);await page.locator('h1').evaluate(el=>el.tabIndex=-1);await page.locator('h1').evaluate(el=>el.focus({preventScroll:true}));
  await page.waitForTimeout(200);const orbitA=await page.locator('[data-project="0"]').getAttribute('style');
  await page.waitForTimeout(300);assert.notEqual(await page.locator('[data-project="0"]').getAttribute('style'),orbitA);
  await page.locator('.solar-system').hover();const held=await page.locator('[data-project="0"]').getAttribute('style');await page.waitForTimeout(200);
  assert.equal(await page.locator('[data-project="0"]').getAttribute('style'),held);
  await page.waitForTimeout(3800);
  const heldBox=await page.locator('[data-project="0"]').boundingBox();
  await page.mouse.move(20,150);await page.waitForTimeout(150);
  const resumedBox=await page.locator('[data-project="0"]').boundingBox();
  assert(Math.hypot(resumedBox.x-heldBox.x,resumedBox.y-heldBox.y)<5,'Orbit must resume without a jump');
  await page.locator('[data-project="1"]').click();assert.equal(await page.locator('#projectCount').textContent(),'02 / 02');
  assert(await page.locator('[data-panel="1"]').isVisible());await page.locator('#nextProject').click();assert.equal(await page.locator('#projectCount').textContent(),'01 / 02');
  await page.locator('#previousProject').click();assert.equal(await page.locator('#projectCount').textContent(),'02 / 02');
  assert.equal(await page.locator('.milestone-detail').count(),3);
  for(const note of await page.locator('.field-note:visible,.milestone-detail').all()){
   await note.locator('summary').focus();await page.keyboard.press('Enter');
   await page.waitForFunction(el=>el.open,await note.elementHandle());
   assert(await note.locator('.note-body').isVisible());
   await page.keyboard.press('Space');await page.waitForFunction(el=>!el.open,await note.elementHandle());
  }
  await page.locator('#portal').hover();await page.waitForTimeout(200);assert.equal(await page.locator('#portal').getAttribute('aria-busy'),null,'Hover must not trigger explosion');
  const galaxyBefore=await page.locator('#portalDust').evaluate(c=>c.toDataURL());await page.waitForTimeout(180);assert.notEqual(await page.locator('#portalDust').evaluate(c=>c.toDataURL()),galaxyBefore);
  await page.locator('#portal').click();assert.equal(await page.locator('#portal').getAttribute('aria-busy'),'true');
  await page.waitForTimeout(1100);await page.screenshot({path:path.join(__dirname,'preview-stardust.png')});
  await page.waitForFunction(()=>!document.querySelector('#portal').hasAttribute('aria-busy'));assert.match(await page.locator('#portalCaption').textContent(),/Reformed/);
  await page.locator('#transformImage').click();await page.locator('#motionToggle').click();assert.equal(await page.locator('#portal').getAttribute('aria-busy'),null);
  assert.equal(await page.locator('html').getAttribute('data-motion'),'paused');
  const paused=await page.locator('#starfield').evaluate(c=>c.toDataURL());await page.waitForTimeout(220);assert.equal(await page.locator('#starfield').evaluate(c=>c.toDataURL()),paused);
  assert.equal(await page.locator('.sphere .surface').first().evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
  await page.reload();assert.equal(await page.locator('html').getAttribute('data-motion'),'paused');assert.equal(await page.locator('.hero-content').evaluate(el=>getComputedStyle(el).opacity),'1');
  await page.locator('#motionToggle').click();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.documentElement.dataset.motion==='paused');
  await page.locator('#transformImage').click();assert.equal(await page.locator('#portal').getAttribute('aria-busy'),null);assert.match(await page.locator('#portalCaption').textContent(),/Reformed/);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>document.documentElement.dataset.motion==='running');
  await page.locator('#themeToggle').click();await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');await page.locator('#themeToggle').click();
  await page.emulateMedia({reducedMotion:'reduce'});
  const darkGalaxy=await page.locator('#portalDust').evaluate(c=>c.toDataURL());
  await page.locator('#themeToggle').click();
  assert.notEqual(await page.locator('#portalDust').evaluate(c=>c.toDataURL()),darkGalaxy,'Paused galaxy must repaint for the theme');
  assert.equal(await page.locator('.system-planet').evaluate(el=>getComputedStyle(el).clipPath),'none');
  await page.locator('#observatory').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(__dirname,'preview-galaxy-light.png')});
  await page.locator('#themeToggle').click();
  await page.locator('details:not(#credits)').evaluateAll(notes=>notes.forEach(note=>note.open=true));
  for(const w of [320,390,768,1024,1440,1920]){
   await page.setViewportSize({width:w,height:900});
   for(const id of ['home','about','skills','projects','experience','education','certificates','observatory','contact']){
    await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(40);
    const layout=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,clipped:[...document.querySelectorAll('h1,h2,h3,p,.world-button,.skill-star,.project-satellite')].filter(el=>{const r=el.getBoundingClientRect();return r.width&&(r.right>innerWidth+1||r.left<0)}).map(el=>el.textContent.slice(0,40))}));
    assert(layout.width<=layout.viewport,`${w}px ${id} overflow`);assert.deepEqual(layout.clipped,[],`${w}px clipped content`);
   }
  }
  await page.setViewportSize({width:1440,height:1000});await page.locator('#skills').scrollIntoViewIfNeeded();await page.waitForTimeout(100);
  const comet=Number(await page.locator('#cometHead').getAttribute('cy'));
  await page.locator('#about').scrollIntoViewIfNeeded();await page.waitForTimeout(100);assert(Number(await page.locator('#cometHead').getAttribute('cy'))<comet);
  await page.evaluate(()=>{const y=document.querySelector('#skills .waypoint').getBoundingClientRect().top+scrollY;scrollTo(0,y-innerHeight*.55+11)});await page.waitForTimeout(100);
  assert(await page.locator('#skills').evaluate(el=>el.classList.contains('arriving')));
  for(const id of ['home','about','skills','projects','experience','education','certificates','observatory']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(120);await page.screenshot({path:path.join(__dirname,id==='home'?'preview-desktop.png':`preview-${id}.png`)});}
  await page.locator('#home').scrollIntoViewIfNeeded();await page.locator('#themeToggle').click();await page.screenshot({path:path.join(__dirname,'preview-light.png')});await page.locator('#themeToggle').click();
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(__dirname,'preview-mobile.png')});
  assert.deepEqual(errors,[]);
  const mobile=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await mobile.goto(source);
  await mobile.locator('#moonProfile').tap();assert(await mobile.locator('[data-profile-panel="moon"]').isVisible());
  await mobile.locator('[data-project="1"]').tap();await mobile.waitForTimeout(900);
  assert(await mobile.locator('[data-panel="1"]').isVisible());
  assert((await mobile.locator('#projectDetail').boundingBox()).y<844*.7,'Mobile selection brings details into view');
  await mobile.locator('[data-panel="1"] summary').tap();assert(await mobile.locator('[data-panel="1"] .note-body').isVisible());
  await mobile.waitForTimeout(700);await mobile.screenshot({path:path.join(__dirname,'preview-mobile-brief.png')});
  await mobile.locator('#portal').tap();await mobile.waitForFunction(()=>document.querySelector('#portalCaption').textContent.includes('Reformed'));
  assert(!(await mobile.locator('html').evaluate(el=>el.classList.contains('star-cursor'))));
  const offline=await browser.newPage(),remote=[];offline.on('request',r=>{if(/^https?:/.test(r.url()))remote.push(r.url());});
  await offline.context().setOffline(true);await offline.goto(pathToFileURL(path.join(__dirname,'portfolio-preview.html')).href);
  await offline.locator('#transformImage').click();await offline.waitForFunction(()=>document.querySelector('#portalCaption').textContent.includes('Reformed'));assert.deepEqual(remote,[]);
  const noJS=await browser.newPage({javaScriptEnabled:false});await noJS.goto(source);
  for(const panel of await noJS.locator('.project-panel,[data-profile-panel]').all())assert(await panel.isVisible());
  assert(await noJS.locator('#portalImage').isVisible());
  for(const button of await noJS.locator('[data-js-control]').all())assert(await button.isDisabled());
  await noJS.locator('#experience summary').click();assert(await noJS.locator('#experience .note-body').isVisible());
  console.log('PASS: live port 8000, identity, Earth/Moon details, orbit hold/resume, project controls, keyboard portfolio disclosures, constellation, black-hole surge, galaxy explosion/reassembly, star cursor, checkpoint arrival/reflow/reverse scroll, 6 expanded responsive widths, touch, themes, motion pause, reduced motion, offline and no-JS.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
