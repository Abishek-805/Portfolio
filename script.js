(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const $ = id => document.getElementById(id);
  document.querySelectorAll('[data-js-control]').forEach(button => { button.disabled = false; });
  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const SURGE_DURATION=1000;
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = media.matches;
  let paused = read('orbit-motion') === 'paused';
  const still = () => reduced || paused;
  let toastTimer;
  function toast(message) {
    $('toast').textContent = message;
    $('toast').classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 4500);
  }
  function setTheme(theme) {
    root.dataset.theme = theme;
    $('themeToggle').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#07090e' : '#e7eaf1';
  }
  const colorPreference=matchMedia('(prefers-color-scheme: light)');
  setTheme(read('portfolio-theme') || (colorPreference.matches?'light':'dark'));
  colorPreference.addEventListener('change',()=>{if(!read('portfolio-theme')){setTheme(colorPreference.matches?'light':'dark');paintStars();paintGalaxy();}});
  $('themeToggle').addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    save('portfolio-theme', root.dataset.theme);
    paintStars();paintGalaxy();
  });

  // Keep Tab in the page's modal sequence as well as native Escape restoration.
  for (const id of ['mapToggle', 'quickMap']) $(id).addEventListener('click', () => { $('starMap').showModal();$(id).setAttribute('aria-expanded','true'); });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close',()=>{for(const id of ['mapToggle','quickMap'])$(id).setAttribute('aria-expanded','false');});
    dialog.addEventListener('keydown',event=>{
      if(event.key!=='Tab')return;
      const controls=dialog.querySelectorAll('button,a[href]'),first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    });
    dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
      }
    });
    dialog.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
      dialog.close();
      const target = document.querySelector(link.getAttribute('href'));
      target.setAttribute('tabindex', '-1');
      target.focus({preventScroll:true});
    }));
  });

  function reveal(element, duration=650) {
    element.getAnimations().forEach(animation => animation.cancel());
    if (!still()) element.animate([{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration,easing:'cubic-bezier(.16,1,.3,1)'});
  }
  document.querySelectorAll('details').forEach(details => details.addEventListener('toggle', () => {
    const body=details.querySelector('.note-body');
    if(details.open && body)reveal(body);
    queueScroll();
  }));
  function showSelectedDetails(element) {
    if (innerWidth <= 600 && element.getBoundingClientRect().top > innerHeight * .7) {
      element.scrollIntoView({block:'nearest',behavior:still()?'instant':'smooth'});
    }
  }
  const profileButtons = [$('earthProfile'), $('moonProfile')];
  function selectProfile(kind) {
    document.querySelector('.home-system').dataset.profile=kind;
    document.querySelectorAll('[data-profile-panel]').forEach(panel => { panel.hidden = panel.dataset.profilePanel !== kind; });
    profileButtons.forEach(button => {
      const active = button.id === `${kind}Profile`;
      button.classList.toggle('selected',active);
      button.setAttribute('aria-pressed',String(active));
    });
    reveal($('profileDetails'));
  }
  profileButtons.forEach(button => button.addEventListener('click',()=>{
    selectProfile(button.id.startsWith('earth')?'earth':'moon');
    showSelectedDetails($('profileDetails'));
  }));
  document.querySelectorAll('[data-body-profile]').forEach(button=>button.addEventListener('click',()=>{selectProfile(button.dataset.bodyProfile);showSelectedDetails($('profileDetails'));}));
  selectProfile('earth');

  const skillData = [
    ['Artificial intelligence', 'Exploring how intelligent systems can make complex information easier to use.'],
    ['Python', 'Turning questions into experiments through scripting, data processing, and application logic.'],
    ['Frontend development', 'Building interfaces with clear structure, thoughtful interactions, and accessible details.'],
    ['Systems thinking', 'Connecting components into useful systems, with attention to behavior and real-world constraints.'],
    ['Creative prototyping', 'Making an idea tangible, testing the experience, and learning from what happens next.']
  ];
  function selectSkill(button) {
    const constellation=document.querySelector('.constellation');
    if(constellation.dataset.activeSkill===button.dataset.skill&&$('skillTitle').textContent===skillData[Number(button.dataset.skill)][0])return;
    const [title, description] = skillData[Number(button.dataset.skill)];
    $('skillTitle').textContent = title;
    $('skillDescription').textContent = description;
    reveal(document.querySelector('.skill-readout'),220);
    document.querySelectorAll('[data-skill]').forEach(star => {
      star.classList.toggle('selected', star === button);
      star.setAttribute('aria-pressed', String(star === button));
    });
    constellation.dataset.activeSkill=button.dataset.skill;
    const edges=['M80 150 L245 75 M80 150 L115 300','M80 150 L245 75 L405 170 M245 75 L325 310','M245 75 L405 170 L325 310','M405 170 L325 310 L115 300 M325 310 L245 75','M80 150 L115 300 L325 310'];
    $('skillConnection').setAttribute('d',edges[Number(button.dataset.skill)]);
  }
  document.querySelectorAll('[data-skill]').forEach(button=>{
    button.addEventListener('click',()=>selectSkill(button));
    button.addEventListener('focus',()=>selectSkill(button));
    button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')selectSkill(button);});
  });

  let project = 0;
  const projectButtons = [...document.querySelectorAll('[data-project]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  function selectProject(index) {
    project = (index + panels.length) % panels.length;
    panels.forEach((panel, i) => { panel.hidden = i !== project; });
    projectButtons.forEach((button, i) => {
      button.classList.toggle('selected', i === project);
      button.setAttribute('aria-pressed', String(i === project));
    });
    $('projectCount').textContent = `${String(project + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')}`;
    document.querySelector('.solar-system').dataset.selected=String(project);
    $('projects').dataset.selected=String(project);
    $('worldCaption').textContent=project?'THE SIGNAL WORLD / ADAPTIVE TRAFFIC':'THE ARCHIVE WORLD / KNOWLEDGE ENGINE';
    document.querySelectorAll('[data-world]').forEach(world=>world.classList.toggle('selected',Number(world.dataset.world)===project));
    reveal(panels[project]);
  }
  projectButtons.forEach(button => button.addEventListener('click', () => {
    selectProject(Number(button.dataset.project));
    showSelectedDetails($('projectDetail'));
  }));
  document.querySelectorAll('[data-world]').forEach(world=>world.addEventListener('click',()=>{selectProject(Number(world.dataset.world));showSelectedDetails($('projectDetail'));}));
  $('previousProject').addEventListener('click', () => selectProject(project - 1));
  $('nextProject').addEventListener('click', () => selectProject(project + 1));
  selectProject(0);
  function selectHash(){const match=location.hash.match(/^#project-(0|1)$/);if(match){selectProject(Number(match[1]));$('projects').scrollIntoView({behavior:'instant',block:'start'});}}
  window.addEventListener('hashchange',selectHash);

  // The trail follows the measured chapter waypoints, including after responsive reflow.
  const expedition = $('expedition');
  const stations = [...document.querySelectorAll('.station,#observatory,#contact')];
  const path = $('flightActive');
  let pathLength = 0, expeditionTop = 0, expeditionHeight = 0, chapterPositions = [], chapterProgress=[], frameQueued = false, previousCometLength=0, cometDirection=1, lastArrival=-1, arrivalTimer;
  const destinations = [
    ['home','Departure'], ['journey','Flight plan'], ['about','Origin'], ['skills','Toolkit'],
    ['projects','Experiments'], ['experience','Experience'], ['education','Learning'],
    ['certificates','Milestones'], ['observatory','Observatory'], ['contact','First contact']
  ];
  let destinationPositions = [],routePoints=[],scrollFrame=0;
  function measure() {
    const box = expedition.getBoundingClientRect();
    expeditionTop = box.top + scrollY;
    const width = expedition.clientWidth, height = $('contact').getBoundingClientRect().bottom-box.top;
    expeditionHeight = height;
    const points = stations.map(station => {
      const rect = station.querySelector('.waypoint').getBoundingClientRect();
      return {x:rect.left - box.left + rect.width / 2, y:rect.top - box.top + rect.height / 2};
    });
    destinationPositions = destinations.map(([id, name]) => {
      const stop=$(id).querySelector('.waypoint'),rect=(stop||$(id)).getBoundingClientRect();
      return {id,name,top:rect.top+scrollY+(stop?rect.height/2:0)};
    });
    $('flightSvg').setAttribute('viewBox', `0 0 ${width} ${height}`);
    $('flightSvg').style.height=`${height}px`;
    chapterPositions = points.map(point => point.y);
    let d = `M ${points[0].x} 0 L ${points[0].x} ${points[0].y}`;
    routePoints=[{x:points[0].x,y:0,length:0},{...points[0],length:points[0].y}];
    function sampleCurve(start,a,b,end){
      for(let i=1;i<=48;i++){
        const t=i/48,u=1-t,previous=routePoints[routePoints.length-1];
        const x=u*u*u*start.x+3*u*u*t*a.x+3*u*t*t*b.x+t*t*t*end.x;
        const y=u*u*u*start.y+3*u*u*t*a.y+3*u*t*t*b.y+t*t*t*end.y;
        routePoints.push({x,y,length:previous.length+Math.hypot(x-previous.x,y-previous.y)});
      }
    }
    points.forEach((point,i)=>{
      const next=points[i+1]||{x:point.x,y:height},delta=next.y-point.y;
      const lane=width<700?point.x+(i%2?4:-4):(point.x>width*.5?width*.95:width*.045);
      // Cross the clear inter-chapter band; keep the reading area's middle unobstructed.
      const approach=Math.min(110,delta*.22);
      d+=` C ${point.x} ${point.y+delta*.18}, ${lane} ${point.y+delta*.18}, ${lane} ${point.y+delta*.4}`;
      d+=` C ${lane} ${next.y-approach}, ${next.x} ${next.y-approach}, ${next.x} ${next.y}`;
      const middle={x:lane,y:point.y+delta*.4};
      sampleCurve(point,{x:point.x,y:point.y+delta*.18},{x:lane,y:point.y+delta*.18},middle);
      sampleCurve(middle,{x:lane,y:next.y-approach},{x:next.x,y:next.y-approach},next);
    });
    path.setAttribute('d', d);
    $('flightGhost').setAttribute('d', d);
    pathLength = path.getTotalLength();
    const scale=pathLength/routePoints[routePoints.length-1].length;
    routePoints.forEach(point=>point.length*=scale);
    chapterProgress=chapterPositions.map(y=>distanceAtY(y)/pathLength);
    path.style.strokeDasharray = String(pathLength);
    queueScroll();
  }
  function distanceAtY(y){
    let low=0,high=routePoints.length-1;
    while(high-low>1){const middle=(low+high)>>1;if(routePoints[middle].y<y)low=middle;else high=middle;}
    const a=routePoints[low],b=routePoints[high],t=clamp((y-a.y)/Math.max(.001,b.y-a.y));
    return a.length+(b.length-a.length)*t;
  }
  function pointAtDistance(length){
    let low=0,high=routePoints.length-1;
    while(high-low>1){const middle=(low+high)>>1;if(routePoints[middle].length<length)low=middle;else high=middle;}
    const a=routePoints[low],b=routePoints[high],t=clamp((length-a.length)/Math.max(.001,b.length-a.length));
    return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
  }
  const cometDust=Array.from({length:innerWidth<=600?4:8},()=>{const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('r','1');$('cometDust').append(dot);return dot;});
  let cometLength=0,lastDustPaint=-Infinity;
  function paintCometDust(time){
    const head=pointAtDistance(cometLength),screenY=expeditionTop+head.y-scrollY;
    $('cometDust').style.opacity=still()||screenY< -220||screenY>innerHeight+220?'0':'1';
    if(still()||screenY< -220||screenY>innerHeight+220)return;
    if(time-lastDustPaint<100)return;lastDustPaint=time;
    cometDust.forEach((dot,i)=>{const age=((time/1300+i/cometDust.length)%1),s=clamp(cometLength-cometDirection*(15+age*165),0,pathLength),p=pointAtDistance(s),a=pointAtDistance(clamp(s-1,0,pathLength)),b=pointAtDistance(clamp(s+1,0,pathLength)),n=Math.max(.01,Math.hypot(b.x-a.x,b.y-a.y)),spread=Math.sin(i*7.3)*age*8;dot.setAttribute('cx',p.x-(b.y-a.y)/n*spread);dot.setAttribute('cy',p.y+(b.x-a.x)/n*spread);dot.setAttribute('opacity',String((1-age)*.55));dot.setAttribute('r',String(.5+(1-age)*.6));});
  }
  function renderScroll() {
    frameQueued = false;
    const y = scrollY;
    if(!still())$('deepSky').style.transform=`translate3d(0,${-Math.min(70,y*.006)}px,0)`;
    $('pageProgress').style.transform = `scaleX(${clamp(y / Math.max(1, root.scrollHeight - innerHeight))})`;
    document.querySelector('.navigation').classList.toggle('scrolled', y > 50);
    const current = destinationPositions.filter(item => item.top <= y + innerHeight * .55).pop() || destinationPositions[0];
    if (current) {
      $('currentDestination').textContent = current.name;
      document.querySelector('.travel-indicator').hidden=current.id==='contact'||current.id==='home';
      document.querySelectorAll('.navigation nav a').forEach(link => {
        const section = ['about','skills','experience','education','certificates'].includes(current.id) ? 'journey' : current.id;
        if (link.hash === `#${section}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    if (!pathLength) return;
    const targetY = clamp(y + innerHeight * .55 - expeditionTop, 0, expeditionHeight);
    // Sample the unchanged cubic route once; scroll frames never query SVG geometry.
    const length=distanceAtY(targetY),progress=length/pathLength;
    expedition.dataset.routeProgress=progress.toFixed(6);
    path.style.strokeDashoffset = String(pathLength - length);
    const head = pointAtDistance(length);
    $('cometHead').setAttribute('cx', head.x);
    $('cometHead').setAttribute('cy', head.y);
    $('cometSpark').setAttribute('transform',`translate(${head.x} ${head.y})`);
    if(Math.abs(length-previousCometLength)>.5)cometDirection=length<previousCometLength?-1:1;
    const direction=cometDirection;
    previousCometLength=length;if(Math.abs(length-cometLength)>80)lastDustPaint=-Infinity;cometLength=length;expedition.dataset.cometDirection=String(direction);
    let tail = '';const sides=[[],[]],trailSize=innerWidth<=600?130:190;
    for (let i = 0; i <= 14; i++) {
      const s=clamp(length-direction*(trailSize-i*trailSize/14),0,pathLength),point=pointAtDistance(s),a=pointAtDistance(clamp(s-1,0,pathLength)),b=pointAtDistance(clamp(s+1,0,pathLength)),normal=Math.max(.01,Math.hypot(b.x-a.x,b.y-a.y)),radius=3.5*Math.pow(i/14,1.7);
      tail += `${i ? ' L' : 'M'} ${point.x} ${point.y}`;
      sides[0].push(`${point.x-(b.y-a.y)/normal*radius} ${point.y+(b.x-a.x)/normal*radius}`);
      sides[1].push(`${point.x+(b.y-a.y)/normal*radius} ${point.y-(b.x-a.x)/normal*radius}`);
    }
    const end=pointAtDistance(clamp(length-direction*trailSize,0,pathLength)),gradient=$('cometColor');
    for(const [key,value] of Object.entries({x1:end.x,y1:end.y,x2:head.x,y2:head.y}))gradient.setAttribute(key,value);
    const before=pointAtDistance(clamp(length-1,0,pathLength)),after=pointAtDistance(clamp(length+1,0,pathLength)),angle=Math.atan2((after.y-before.y)*direction,(after.x-before.x)*direction)*180/Math.PI;
    $('cometAura').setAttribute('transform',`translate(${head.x} ${head.y}) rotate(${angle})`);
    $('cometWake').setAttribute('d',still()?'':`M ${[...sides[0],...sides[1].reverse()].join(' L ')} Z`);
    $('cometTail').setAttribute('d', still() ? '' : tail);
    paintCometDust(universeTime);
    const currentChapter = chapterProgress.findLastIndex(stop => stop <= progress+2/pathLength);
    const arrival=chapterProgress.findIndex(stop=>Math.abs(stop-progress)*pathLength<36);
    if(arrival>=0&&arrival!==lastArrival){
      clearTimeout(arrivalTimer);stations.forEach(station=>station.classList.remove('arrival-flash'));
      stations[arrival].classList.add('arrival-flash');arrivalTimer=setTimeout(()=>stations[arrival].classList.remove('arrival-flash'),900);
    }
    lastArrival=arrival;
    stations.forEach((station, i) => {
      station.classList.toggle('current', i === currentChapter);
      station.classList.toggle('reached', progress >= chapterProgress[i]-2/pathLength);
      station.classList.toggle('arriving', i===arrival);
    });
  }
  function queueScroll() {
    frameQueued=true;
    if(still()&&!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;if(frameQueued)renderScroll();});
  }
  window.addEventListener('scroll', queueScroll, {passive:true});
  const routeObserver=new ResizeObserver(measure);
  [expedition,$('observatory'),$('contact')].forEach(section=>routeObserver.observe(section));
  window.addEventListener('resize', measure, {passive:true});
  document.fonts.ready.then(measure);
  window.addEventListener('load', measure);

  // One clock drives the background and visible scenes; pause preserves their positions.
  const canvas = $('starfield'), ctx = canvas.getContext('2d');
  const portal = $('portal'), dust = $('portalDust'), dustCtx = dust.getContext('2d');
  const heroMedia=document.querySelector('.hero-media'),holeVideo=$('holeVideo'),startPlayback=$('startPlayback');
  let videoLoaded=false,videoFailed=false;
  const nebulaWindow=$('nebulaWindow'),nebulaCanvas=$('nebulaDust'),nebulaCtx=nebulaCanvas.getContext('2d');
  const homeVisual=document.querySelector('.home-visual'),moonWorld=document.querySelector('.moon-world');
  const solar = document.querySelector('.solar-system');
  const lowPower=(navigator.deviceMemory||8)<=4||(navigator.hardwareConcurrency||8)<=4||navigator.connection?.saveData===true;
  root.dataset.quality=lowPower?'low':'standard';
  let width=0,height=0,galaxyWidth=0,galaxyHeight=0,solarWidth=0,solarHeight=0,homeWidth=0,homeHeight=0,nebulaWidth=0,nebulaHeight=0;
  let stars=[],galaxy=[],meteors=[],frame=0,lastTime=0,lastPaint=0,lastSkyPaint=0,universeTime=0,orbitTime=0,moonTime=0,nextMeteor=2400,shower=0;
  let pointer={x:0,y:0},camera={x:0,y:0},galaxyBusy=false,galaxyStart=0,galaxyView=0,warpUntil=0;
  let nebulaValue=0,nebulaFrom=0,nebulaTarget=0,nebulaStart=0,nebulaPinned=false;
  const visible = new Set();
  const worlds=[...document.querySelectorAll('.home-visual .sphere,.project-world .sphere,.saturn-body .sphere')].map(sphere=>{
    const image=new Image(),canvas=document.createElement('canvas');canvas.className='world-material';canvas.setAttribute('aria-hidden','true');
    canvas.width=canvas.height=lowPower?160:320;sphere.append(canvas);
    image.src=getComputedStyle(sphere.querySelector('.surface')).backgroundImage.slice(5,-2);
    const world={sphere,image,canvas,context:canvas.getContext('2d'),section:sphere.closest('section')};
    image.addEventListener('load',()=>paintWorld(world));return world;
  });
  function paintWorld(world){
    const {sphere,image,canvas,context}=world;if(!context)return;
    context.clearRect(0,0,canvas.width,canvas.height);
    const rendered=window.OrbitMaterials?.draw(context,image,universeTime,0,canvas.width,canvas.height,0,lowPower);
    sphere.classList.toggle('material-ready',Boolean(rendered));
  }
  const sceneObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
    entry.target.classList.toggle('offscreen',!entry.isIntersecting);
    if(entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target);
    if(entry.isIntersecting && !entry.target.dataset.entered) {
      entry.target.dataset.entered='true';
      entry.target.querySelectorAll(':scope > .station-copy, :scope > .section-heading, :scope > .observatory-copy, :scope > .intro-layout, :scope > h2').forEach(reveal);
    }
    if(entry.target.id==='home')syncHeroVideo();
    if(entry.target.id==='observatory'&&!entry.isIntersecting&&galaxyBusy) finishGalaxy();
  }),{rootMargin:'80px'});
  document.querySelectorAll('main section').forEach(section=>sceneObserver.observe(section));
  function fitCanvas(element,w,h,density=1) {
    const context=element.getContext('2d');
    if(!context) return;
    const cw=Math.round(w*density),ch=Math.round(h*density);
    if(element.width!==cw||element.height!==ch){element.width=cw;element.height=ch;}
    context.setTransform(cw/w,0,0,ch/h,0,0);
  }
  function resizeScenes() {
    width=innerWidth;height=innerHeight;
    const box=portal.getBoundingClientRect();galaxyWidth=box.width;galaxyHeight=box.height;
    solarWidth=solar.clientWidth;solarHeight=solar.clientHeight;
    homeWidth=homeVisual.clientWidth;homeHeight=homeVisual.clientHeight;
    const nebulaBox=nebulaWindow.getBoundingClientRect();nebulaWidth=nebulaBox.width;nebulaHeight=nebulaBox.height;
    const density=Math.min(devicePixelRatio||1,lowPower?1:1.5);
    fitCanvas(canvas,width,height,density);
    fitCanvas(dust,galaxyWidth,galaxyHeight,density);
    fitCanvas(nebulaCanvas,nebulaWidth,nebulaHeight,density);
    fitCanvas($('cursorTrail'),width,height,Math.min(devicePixelRatio||1,2));
    let seed=4107;
    const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    stars=Array.from({length:lowPower?65:width<600?80:145},()=>({x:random()*width,y:random()*height,r:.3+random()*1.1,a:.15+random()*.5,z:.2+random()*.8,phase:random()*6.28}));
    galaxy=Array.from({length:lowPower?850:width<600?1200:2200},(_,i)=>{
      const radius=i%4===0?Math.pow(random(),2)*.25:Math.pow(random(),.7),arm=i%2;
      const angle=arm*Math.PI+radius*6+(random()-.5)*.5;
      return {u:Math.cos(angle)*radius*.47,v:Math.sin(angle)*radius*.4,scatter:random()*6.28,size:.8+random()*1.2,light:random(),color:i%3?'#b5b9d3':'#f3d0a2'};
    });
    sampleGalaxy();paintStars();paintGalaxy();movePlanets();moveMoon();paintNebula();
    if(width<=600)clearCursor();
  }
  function sampleGalaxy(){
    const image=$('portalImage');
    if(!image.complete||!image.naturalWidth)return;
    const sample=document.createElement('canvas');sample.width=240;sample.height=Math.round(240*image.naturalHeight/image.naturalWidth);
    const context=sample.getContext('2d',{willReadFrequently:true});if(!context)return;
    try{
      context.drawImage(image,0,0,sample.width,sample.height);
      const limit=lowPower?650:width<600?1200:2200;
      const pixels=context.getImageData(0,0,sample.width,sample.height).data,points=[];
      let seed=90210;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
      for(let attempt=0;attempt<limit*24&&points.length<limit;attempt++){
        const x=random()*(sample.width-2)+1,y=random()*(sample.height-2)+1;
        const i=(Math.floor(y)*sample.width+Math.floor(x))*4,light=Math.max(pixels[i],pixels[i+1],pixels[i+2])/255*(pixels[i+3]/255);
        if(light<.12||random()>Math.sqrt(light))continue;
        points.push({u:x/sample.width-.5,v:y/sample.height-.5,scatter:random()*Math.PI*2,spread:.4+random()*.6,light,size:.65+random()*.8,color:`rgb(${pixels[i]},${pixels[i+1]},${pixels[i+2]})`});
      }
      galaxy=points;
      portal.dataset.particleSource='image';
    }catch{
      // shortcut: file:// can restrict pixel reads; the standalone export embeds data URLs.
      portal.dataset.particleSource='procedural-fallback';
    }
  }
  function paintNebula(){
    if(!nebulaCtx||!nebulaWidth)return;
    const first=$('nebulaImage');
    if(!first.complete||!first.naturalWidth)return;
    const progress=still()?1:clamp((universeTime-nebulaStart)/1100);
    nebulaValue=nebulaFrom+(nebulaTarget-nebulaFrom)*(progress*progress*(3-2*progress));
    const c=nebulaCtx,w=nebulaWidth,h=nebulaHeight;c.clearRect(0,0,w,h);
    const scale=Math.min(w/first.naturalWidth,h/first.naturalHeight),iw=first.naturalWidth*scale,ih=first.naturalHeight*scale;
    c.drawImage(first,(w-iw)/2,(h-ih)/2,iw,ih);
    c.globalCompositeOperation='lighter';
    for(let i=0;i<6;i++){
      const birth=clamp(nebulaValue*1.6-i*.12),angle=i*2.39996;
      const x=w*(.5+Math.cos(angle)*(.1+i*.025)),y=h*(.5+Math.sin(angle)*(.1+i*.025));
      const glow=c.createRadialGradient(x,y,0,x,y,w*.065);glow.addColorStop(0,'#ffe6b9b0');glow.addColorStop(1,'#ffe6b900');
      c.globalAlpha=birth*.7;c.fillStyle=glow;c.fillRect(x-w*.065,y-w*.065,w*.13,w*.13);
      c.globalAlpha=birth;c.fillStyle='#fff4da';c.beginPath();c.arc(x,y,1.4+birth,0,Math.PI*2);c.fill();
      c.strokeStyle='#fff0d0';c.lineWidth=.8;c.beginPath();c.moveTo(x-8*birth,y);c.lineTo(x+8*birth,y);c.moveTo(x,y-11*birth);c.lineTo(x,y+11*birth);c.stroke();
    }
    c.globalCompositeOperation='source-over';
    c.globalAlpha=1;nebulaWindow.classList.add('transition-ready');
    nebulaWindow.dataset.view=progress===1?(nebulaTarget?'stars':'nebula'):'transition';
  }
  function setNebulaView(value){
    if(value===nebulaTarget){paintNebula();return;}
    nebulaFrom=nebulaValue;nebulaTarget=value;nebulaStart=universeTime;
    nebulaWindow.setAttribute('aria-pressed',String(value===1));
    if(!nebulaCtx){nebulaValue=value;nebulaWindow.dataset.view=value?'stars':'nebula';return;}
    paintNebula();
  }
  nebulaWindow.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')setNebulaView(1);});
  nebulaWindow.addEventListener('pointerleave',()=>{if(!nebulaPinned)setNebulaView(0);});
  nebulaWindow.addEventListener('focus',()=>setNebulaView(1));
  nebulaWindow.addEventListener('blur',()=>{if(!nebulaPinned)setNebulaView(0);});
  nebulaWindow.addEventListener('click',()=>{nebulaPinned=!nebulaPinned;setNebulaView(nebulaPinned?1:0);});
  $('nebulaImage').addEventListener('load',paintNebula);
  $('portalImage').addEventListener('load',()=>{sampleGalaxy();paintGalaxy();});
  function paintStars() {
    if(!ctx)return;
    ctx.clearRect(0,0,width,height);
    const light=root.dataset.theme==='light';
    // Small distant worlds stay at the edge of the reading area.
    for(const [x,y,r,color] of [[.035,.31,14,'#7a94ba'],[.96,.67,22,'#b58c67'],[.92,.13,7,'#adb6c9']]){
      const px=width*x+camera.x*.3,py=height*y+Math.sin(universeTime*.0002+x)*5;
      const shade=ctx.createRadialGradient(px-r*.4,py-r*.4,0,px,py,r);
      shade.addColorStop(0,color);shade.addColorStop(1,light?'#d9deea':'#080b13');
      ctx.globalAlpha=light?.22:.36;ctx.fillStyle=shade;ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fill();
    }
    for(const star of stars){
      const x=(star.x+camera.x*star.z+width)%width,y=(star.y+camera.y*star.z+height)%height;
      ctx.globalAlpha=star.a*(.7+.3*Math.sin(universeTime*.0008+star.phase));ctx.fillStyle=light?'#526079':'#d9e3f8';
      ctx.beginPath();ctx.arc(x,y,star.r,0,Math.PI*2);ctx.fill();
    }
    for(const meteor of meteors){
      const age=(universeTime-meteor.start)/meteor.duration;if(age<0||age>1)continue;
      const vx=meteor.vx,vy=meteor.vy,x=meteor.x+age*vx,y=meteor.y+age*vy,len=meteor.length;
      const distance=Math.hypot(vx,vy),tx=vx/distance*len,ty=vy/distance*len;
      const gradient=ctx.createLinearGradient(x-tx,y-ty,x,y);
      gradient.addColorStop(0,'transparent');gradient.addColorStop(.65,light?'#8d765a':'#8eacc6');gradient.addColorStop(1,light?'#7d6648':'#fff1d2');
      ctx.globalAlpha=Math.sin(age*Math.PI)*.65;ctx.strokeStyle=gradient;ctx.lineWidth=meteor.size;
      ctx.beginPath();ctx.moveTo(x-tx,y-ty);ctx.lineTo(x,y);ctx.stroke();
      ctx.globalAlpha=Math.sin(age*Math.PI);ctx.fillStyle=light?'#79522d':'#fff5df';ctx.shadowColor=light?'#79522d':'#d4e9ff';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x,y,meteor.size+1,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    }
    if(warpUntil>universeTime){
      const force=Math.sin((1-(warpUntil-universeTime)/SURGE_DURATION)*Math.PI);
      ctx.strokeStyle=light?'#8b633e':'#edc99a';ctx.globalAlpha=force*.38;
      stars.slice(0,70).forEach(star=>{const dx=star.x-width*.7,dy=star.y-height*.5;ctx.beginPath();ctx.moveTo(star.x,star.y);ctx.lineTo(star.x+dx*.11*force,star.y+dy*.11*force);ctx.stroke();});
    }
    ctx.globalAlpha=1;
  }
  function syncHeroVideo(){
    const run=!still()&&!document.hidden&&visible.has($('home'));
    if(!run){holeVideo.pause();startPlayback.hidden=true;return;}
    if(videoFailed)return;
    if(!videoLoaded){
      videoLoaded=true;
      // Create sources only when needed; empty parsed sources can queue stale errors in the offline export.
      for(const [file,type] of [[holeVideo.dataset.webm,'video/webm'],[holeVideo.dataset.mp4,'video/mp4']]){
        const source=document.createElement('source');source.src=file;source.type=type;
        source.addEventListener('error',()=>{if(source===holeVideo.lastElementChild)videoUnavailable();});holeVideo.append(source);
      }
      holeVideo.load();
    }
    holeVideo.play().then(()=>{startPlayback.hidden=true;}).catch(error=>{
      if(error.name==='AbortError'||still()||document.hidden||!visible.has($('home'))||videoFailed)return;
      heroMedia.dataset.mediaState='playback-blocked';startPlayback.hidden=false;
    });
  }
  function videoUnavailable(){
    videoFailed=true;holeVideo.pause();heroMedia.classList.remove('video-ready');
    heroMedia.dataset.mediaState='image-fallback';startPlayback.hidden=true;
  }
  holeVideo.addEventListener('error',videoUnavailable);
  holeVideo.addEventListener('playing',()=>{
    const presented=()=>{if(!videoFailed){heroMedia.classList.add('video-ready');heroMedia.dataset.mediaState='video';}};
    if(holeVideo.requestVideoFrameCallback)holeVideo.requestVideoFrameCallback(presented);else presented();
  });
  startPlayback.addEventListener('click',syncHeroVideo);
  function movePlanets(){
    if(solar.matches(':hover'))return;
    const angle=orbitTime*.000055,x=Math.cos(angle)*solarWidth*.46,y=Math.sin(angle)*solarHeight*.2;
    document.querySelector('.orbit-probe').style.transform=`translate(${x}px,${y}px)`;
  }
  function moveMoon(){
    if(moonWorld.matches(':hover'))return;
    const angle=moonTime*.00024-.9,tilt=-17*Math.PI/180,ox=Math.cos(angle)*homeWidth*.39,oy=Math.sin(angle)*homeHeight*.22;
    const x=ox*Math.cos(tilt)-oy*Math.sin(tilt),y=ox*Math.sin(tilt)+oy*Math.cos(tilt),depth=Math.sin(angle);
    moonWorld.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(${.88+depth*.12})`;
    moonWorld.style.zIndex=depth>0?'3':'1';
  }
  function paintGalaxy(){
    if(!dustCtx||!galaxyWidth)return;
    const c=dustCtx,w=galaxyWidth,h=galaxyHeight;
    c.clearRect(0,0,w,h);
    const progress=galaxyBusy?clamp((universeTime-galaxyStart)/3200):0;
    const light=root.dataset.theme==='light';
    const blast=galaxyBusy?Math.pow(Math.sin(progress*Math.PI),.8):0;
    const image=$('portalImage'),scale=Math.min(w/(image.naturalWidth||1280),h/(image.naturalHeight||730));
    const iw=(image.naturalWidth||1280)*scale,ih=(image.naturalHeight||730)*scale;
    c.save();c.translate(w/2,h/2);
    for(let i=0;i<galaxy.length;i+=galaxyBusy?1:61){
      const star=galaxy[i];
      const sx=star.u*iw,sy=star.v*ih,twist=blast*.45;
      const dx=Math.cos(star.scatter+twist),dy=Math.sin(star.scatter+twist)*.7;
      const core=Math.hypot(star.u,star.v)<.075;
      const reach=Math.min(w*.27*(star.spread||.7),(w*.48-Math.abs(sx))/Math.max(Math.abs(dx),.01),(h*.48-Math.abs(sy))/Math.max(Math.abs(dy),.01));
      const offset=blast*Math.max(0,reach)*(core?.12:1),x=sx+dx*offset,y=sy+dy*offset;
      c.globalAlpha=galaxyBusy?(.65+star.light*.35):(.1+.12*Math.sin(universeTime*.001+i))*(light?.4:1);
      c.fillStyle=star.color;
      const size=star.size*(galaxyBusy?1.8:1);
      c.fillRect(x-size/2,y-size/2,size,size);
    }
    c.restore();c.globalAlpha=1;
    portal.style.setProperty('--galaxy-opacity',String(galaxyBusy?1-blast*.72:1));
    portal.classList.add('ready');
    if(galaxyBusy&&progress>=1)finishGalaxy();
  }
  function finishGalaxy(){
    if(!galaxyBusy)return;
    galaxyBusy=false;galaxyView++;portal.classList.remove('busy');portal.removeAttribute('aria-busy');portal.dataset.galaxyState='rest';
    $('portalCaption').textContent=`Reformed / ORBIT galaxy / ${galaxyView} gravity ${galaxyView===1?'surge':'surges'}`;
    paintGalaxy();
  }
  function explodeGalaxy(){
    if(galaxyBusy){
      // A click during reassembly reverses it at the same particle positions.
      const progress=clamp((universeTime-galaxyStart)/3200);
      if(progress>.5)galaxyStart=universeTime-(1-progress)*3200;
      return;
    }
    galaxyBusy=true;galaxyStart=universeTime;portal.classList.add('busy');portal.setAttribute('aria-busy','true');
    portal.dataset.galaxyState='scattering';
    $('portalCaption').textContent='Gravity, briefly interrupted.';
    if(still()||!dustCtx)finishGalaxy();
  }
  portal.addEventListener('click',explodeGalaxy);$('transformImage').addEventListener('click',explodeGalaxy);
  $('anomaly').addEventListener('click',()=>{
    if(still()){toast('Gravity surge. Motion is paused; the universe stays still.');return;}
    warpUntil=universeTime+SURGE_DURATION;$('home').classList.add('gravity-surge');
  });
  $('horizonTarget').addEventListener('click',()=>$('anomaly').click());
  $('lostStar').addEventListener('click',()=>{
    if(still()){toast('Motion is paused. Resume motion, then make another wish.');return;}
    meteors=[];shower=(lowPower||innerWidth<=600)?7:16;nextMeteor=universeTime;document.querySelector('.constellation').classList.add('wishing');toast('Wish received. Look up.');
  });
  function animate(time){
    frame=0;if(still()||document.hidden)return;
    if(frameQueued)renderScroll();
    const delta=lastTime?time-lastTime:16;lastTime=time;universeTime+=delta;
    if(visible.has($('projects'))&&!solar.matches(':hover'))orbitTime+=delta;
    if(visible.has($('about'))&&!moonWorld.matches(':hover'))moonTime+=delta;
    if(time-lastPaint>=(lowPower?50:33)){
      camera.x+=(pointer.x-camera.x)*.07;camera.y+=(pointer.y-camera.y)*.07;
      if(universeTime>=nextMeteor){
        const x=width*(.1+Math.random()*.75),y=-40-Math.random()*height*.15;
        meteors.push({x,y,vx:(x-width*.15)*.7+width*.16,vy:height*.8,start:universeTime,length:(lowPower||width<=600?75:140)+Math.random()*(lowPower||width<=600?75:150),duration:1200+Math.random()*650,size:.7+Math.random()*1.2});
        shower=Math.max(0,shower-1);nextMeteor=universeTime+(shower>0?90+Math.random()*210:18000+Math.random()*22000);
      }
      meteors=meteors.filter(meteor=>universeTime-meteor.start<meteor.duration);
      if(meteors.length||warpUntil>universeTime||time-lastSkyPaint>(lowPower?180:100)){paintStars();lastSkyPaint=time;}
      paintCometDust(universeTime);
      worlds.forEach(world=>{if(visible.has(world.section))paintWorld(world);});
      if(visible.has($('observatory')))paintGalaxy();
      if(visible.has($('projects')))movePlanets();
      if(visible.has($('about')))moveMoon();
      if(visible.has($('education'))&&nebulaValue!==nebulaTarget)paintNebula();
      if(warpUntil<=universeTime)$('home').classList.remove('gravity-surge');
      if(!shower&&!meteors.length)document.querySelector('.constellation').classList.remove('wishing');
      lastPaint=time;
    }
    frame=requestAnimationFrame(animate);
  }
  function syncScenes(){
    syncHeroVideo();
    cancelAnimationFrame(frame);frame=0;lastTime=0;
    if(!still()&&!document.hidden)frame=requestAnimationFrame(animate);
  }

  // The native cursor stays available for touch, keyboard use, dialogs and reduced motion.
  const trailCanvas=$('cursorTrail'),trailCtx=trailCanvas.getContext('2d'),cursor=$('starCursor');
  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
  let cursorFrame=0,trail=[],cursorTarget=null,cursorPosition=null,lastCursorTime=0,burstUntil=0;
  function clearCursor(){
    root.classList.remove('star-cursor','cursor-link');trail=[];cursorTarget=null;cursorPosition=null;lastCursorTime=0;burstUntil=0;
    cancelAnimationFrame(cursorFrame);cursorFrame=0;
    if(trailCtx)trailCtx.clearRect(0,0,width,height);
  }
  function paintCursor(time){
    cursorFrame=0;if(!trailCtx||!cursorTarget)return;
    const delta=lastCursorTime?Math.min(40,time-lastCursorTime):16,alpha=1-Math.exp(-delta/10);lastCursorTime=time;
    cursorPosition.x+=(cursorTarget.x-cursorPosition.x)*alpha;cursorPosition.y+=(cursorTarget.y-cursorPosition.y)*alpha;
    const dx=cursorTarget.x-cursorPosition.x,dy=cursorTarget.y-cursorPosition.y,lag=Math.hypot(dx,dy);
    if(lag>6){cursorPosition.x=cursorTarget.x-dx/lag*6;cursorPosition.y=cursorTarget.y-dy/lag*6;}
    cursor.style.transform=`translate(${cursorPosition.x-9}px,${cursorPosition.y-9}px)`;
    const previous=trail[trail.length-1];
    if(!previous||Math.hypot(previous.x-cursorPosition.x,previous.y-cursorPosition.y)>.25){trail.push({...cursorPosition,time});if(trail.length>32)trail.shift();}
    trail=trail.filter(point=>time-point.time<220);
    trailCtx.clearRect(0,0,width,height);
    const c=trailCtx,color=root.dataset.theme==='light'?'#865523':'#edc99a',limit=root.classList.contains('cursor-link')?32:64;
    const points=[{...cursorPosition,distance:0}];let distance=0;
    for(let i=trail.length-1;i>=0;i--){
      const a=points[points.length-1],b=trail[i],length=Math.hypot(b.x-a.x,b.y-a.y);if(length<.1)continue;
      const fraction=Math.min(1,(limit-distance)/length);distance+=length*fraction;
      points.push({x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction,distance});if(distance>=limit)break;
    }
    if(points.length>1){
      const end=points[points.length-1],gradient=c.createLinearGradient(end.x,end.y,cursorPosition.x,cursorPosition.y);
      gradient.addColorStop(0,'transparent');gradient.addColorStop(.65,root.dataset.theme==='light'?color:'#9dc9ec');gradient.addColorStop(1,color);c.fillStyle=gradient;c.globalAlpha=.72*Math.max(0,1-(time-trail[trail.length-1].time)/220);
      const sides=[[],[]];
      points.forEach((point,i)=>{const next=points[Math.min(i+1,points.length-1)],prev=points[Math.max(0,i-1)],dx=next.x-prev.x,dy=next.y-prev.y,length=Math.max(.01,Math.hypot(dx,dy)),radius=1.5*Math.pow(1-point.distance/Math.max(1,distance),.8);sides[0].push({x:point.x-dy/length*radius,y:point.y+dx/length*radius});sides[1].push({x:point.x+dy/length*radius,y:point.y-dx/length*radius});});
      c.beginPath();[...sides[0],...sides[1].reverse()].forEach((point,i)=>i?c.lineTo(point.x,point.y):c.moveTo(point.x,point.y));c.closePath();c.fill();
      c.fillStyle=color;points.filter((_,i)=>i>0&&i%Math.ceil(points.length/6)===0).forEach(point=>{c.globalAlpha=.35*(1-point.distance/limit);c.fillRect(point.x-.6,point.y-.6,1.2,1.2);});
    }
    if(burstUntil>time){const progress=1-(burstUntil-time)/220;c.globalAlpha=(1-progress)*.65;c.strokeStyle=color;c.lineWidth=1;c.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3,r=4+progress*9;c.moveTo(cursorPosition.x+Math.cos(a)*r,cursorPosition.y+Math.sin(a)*r);c.lineTo(cursorPosition.x+Math.cos(a)*(r+3),cursorPosition.y+Math.sin(a)*(r+3));}c.stroke();}
    c.globalAlpha=1;
    if(trail.length||burstUntil>time)cursorFrame=requestAnimationFrame(paintCursor);
  }
  window.addEventListener('pointermove',event=>{
    if(!trailCtx||event.pointerType!=='mouse'||innerWidth<=600||still()||lowPower||!finePointer.matches||document.querySelector('dialog[open]')||event.target.closest('input,textarea,select,[contenteditable]')){clearCursor();return;}
    pointer={x:(event.clientX/innerWidth-.5)*20,y:(event.clientY/innerHeight-.5)*16};
    root.classList.add('star-cursor');root.classList.toggle('cursor-link',Boolean(event.target.closest('a,button,summary')));
    cursorTarget={x:event.clientX,y:event.clientY};
    if(!cursorPosition){cursorPosition={...cursorTarget};cursor.style.transform=`translate(${cursorPosition.x-9}px,${cursorPosition.y-9}px)`;}
    if(!cursorFrame)cursorFrame=requestAnimationFrame(paintCursor);
  },{passive:true});
  window.addEventListener('pointerdown',()=>{if(!cursorTarget)return;burstUntil=performance.now()+220;if(!cursorFrame)cursorFrame=requestAnimationFrame(paintCursor);},{passive:true});
  document.addEventListener('pointerleave',clearCursor);window.addEventListener('blur',clearCursor);
  document.addEventListener('keydown',clearCursor);finePointer.addEventListener('change',clearCursor);
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('toggle',clearCursor));
  function updateMotion(){
    root.dataset.motion=still()?'paused':'running';
    $('motionToggle').setAttribute('aria-pressed',String(still()));
    $('motionToggle').setAttribute('aria-label',reduced?'Motion reduced by system preference':paused?'Resume motion':'Pause motion');
    $('motionToggle').textContent=still()?'▷':'Ⅱ';
    $('motionToggle').title=reduced?'Your system requests reduced motion':paused?'Resume motion':'Pause motion';
    if(still()){
      finishGalaxy();clearCursor();meteors=[];shower=0;warpUntil=0;
      $('home').classList.remove('gravity-surge');document.querySelector('.constellation').classList.remove('wishing');
      document.getAnimations().filter(animation=>!(animation instanceof CSSAnimation)&&Number.isFinite(animation.effect?.getComputedTiming().endTime)).forEach(animation=>animation.finish());
      paintStars();paintGalaxy();paintNebula();
    }
    syncScenes();queueScroll();
  }
  $('motionToggle').addEventListener('click',()=>{
    if(reduced){toast('Your system has reduced motion enabled. Every destination remains available.');return;}
    paused=!paused;save('orbit-motion',paused?'paused':'running');updateMotion();
  });
  media.addEventListener('change',event=>{reduced=event.matches;updateMotion();});
  document.addEventListener('visibilitychange',()=>{
    root.dataset.hidden=String(document.hidden);
    if(document.hidden){finishGalaxy();clearCursor();}
    syncScenes();
  });
  let resizeTimer;
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resizeScenes,100);},{passive:true});
  document.querySelector('.hero-media img').addEventListener('load',resizeScenes);
  document.fonts.ready.then(resizeScenes);
  resizeScenes();updateMotion();measure();selectHash();
})();
