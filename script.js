(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const $ = id => document.getElementById(id);
  document.querySelectorAll('[data-js-control]').forEach(button => { button.disabled = false; });
  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
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
  setTheme(read('portfolio-theme') === 'light' ? 'light' : 'dark');
  $('themeToggle').addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    save('portfolio-theme', root.dataset.theme);
    paintStars();paintGalaxy();
  });

  // Native dialogs provide focus trapping, Escape handling, and focus restoration.
  for (const id of ['mapToggle', 'quickMap']) $(id).addEventListener('click', () => $('starMap').showModal());
  document.querySelectorAll('dialog').forEach(dialog => {
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

  function reveal(element) {
    element.getAnimations().forEach(animation => animation.cancel());
    if (!still()) element.animate([{opacity:.1,transform:'translateY(18px)',filter:'blur(5px)'},{opacity:1,transform:'none',filter:'blur(0)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});
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
  selectProfile('earth');

  const skillData = [
    ['Artificial intelligence', 'Exploring how intelligent systems can make complex information easier to use.'],
    ['Python', 'Turning questions into experiments through scripting, data processing, and application logic.'],
    ['Frontend development', 'Building interfaces with clear structure, thoughtful interactions, and accessible details.'],
    ['Systems thinking', 'Connecting components into useful systems, with attention to behavior and real-world constraints.'],
    ['Creative prototyping', 'Making an idea tangible, testing the experience, and learning from what happens next.']
  ];
  document.querySelectorAll('[data-skill]').forEach(button => button.addEventListener('click', () => {
    const [title, description] = skillData[Number(button.dataset.skill)];
    $('skillTitle').textContent = title;
    $('skillDescription').textContent = description;
    reveal(document.querySelector('.skill-readout'));
    document.querySelectorAll('[data-skill]').forEach(star => {
      star.classList.toggle('selected', star === button);
      star.setAttribute('aria-pressed', String(star === button));
    });
  }));

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
    reveal(panels[project]);
  }
  projectButtons.forEach(button => button.addEventListener('click', () => {
    selectProject(Number(button.dataset.project));
    showSelectedDetails($('projectDetail'));
  }));
  $('previousProject').addEventListener('click', () => selectProject(project - 1));
  $('nextProject').addEventListener('click', () => selectProject(project + 1));
  selectProject(0);

  // The trail follows the measured chapter waypoints, including after responsive reflow.
  const expedition = $('expedition');
  const stations = [...document.querySelectorAll('.station')];
  const path = $('flightActive');
  let pathLength = 0, expeditionTop = 0, expeditionHeight = 0, chapterPositions = [], frameQueued = false;
  const destinations = [
    ['home','Departure'], ['journey','Flight plan'], ['about','Origin'], ['skills','Toolkit'],
    ['projects','Experiments'], ['experience','Experience'], ['education','Learning'],
    ['certificates','Milestones'], ['observatory','Observatory'], ['contact','First contact']
  ];
  let destinationPositions = [];
  function measure() {
    const box = expedition.getBoundingClientRect();
    expeditionTop = box.top + scrollY;
    const width = expedition.clientWidth, height = expedition.offsetHeight;
    expeditionHeight = height;
    const points = stations.map(station => {
      const rect = station.querySelector('.waypoint').getBoundingClientRect();
      return {x:rect.left - box.left + rect.width / 2, y:rect.top - box.top + rect.height / 2};
    });
    destinationPositions = destinations.map(([id, name]) => ({id,name,top:$(id).getBoundingClientRect().top + scrollY}));
    $('flightSvg').setAttribute('viewBox', `0 0 ${width} ${height}`);
    chapterPositions = points.map(point => point.y);
    points.unshift({x:points[0].x,y:0});
    points.push({x:points[points.length-1].x,y:height});
    let d = `M ${points[0].x} 0`;
    points.slice(1).forEach((point, i) => {
      const previous = points[i];
      const delta = point.y - previous.y;
      const bend = width < 600 ? 0 : (i % 2 ? -1 : 1) * Math.min(width * .17, delta * .3);
      d += ` C ${previous.x + bend} ${previous.y + delta * .35}, ${point.x - bend} ${point.y - delta * .35}, ${point.x} ${point.y}`;
    });
    path.setAttribute('d', d);
    $('flightGhost').setAttribute('d', d);
    pathLength = path.getTotalLength();
    path.style.strokeDasharray = String(pathLength);
    queueScroll();
  }
  function renderScroll() {
    frameQueued = false;
    const y = scrollY;
    $('pageProgress').style.transform = `scaleX(${clamp(y / Math.max(1, root.scrollHeight - innerHeight))})`;
    document.querySelector('.navigation').classList.toggle('scrolled', y > 50);
    const current = destinationPositions.filter(item => item.top < y + innerHeight * .45).pop() || destinationPositions[0];
    if (current) {
      $('currentDestination').textContent = current.name;
      document.querySelectorAll('.navigation nav a').forEach(link => {
        const section = ['about','skills','experience','education','certificates'].includes(current.id) ? 'journey' : current.id;
        if (link.hash === `#${section}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    if (!pathLength) return;
    const targetY = clamp(y + innerHeight * .55 - expeditionTop, 0, expeditionHeight);
    // The curve's Y is monotonic. Binary search keeps the comet at the reader's height.
    let low = 0, high = pathLength;
    for (let i = 0; i < 12; i++) {
      const middle = (low + high) / 2;
      if (path.getPointAtLength(middle).y < targetY) low = middle; else high = middle;
    }
    const length = (low + high) / 2;
    path.style.strokeDashoffset = String(pathLength - length);
    const head = path.getPointAtLength(length);
    $('cometHead').setAttribute('cx', head.x);
    $('cometHead').setAttribute('cy', head.y);
    let tail = '';
    for (let i = 0; i <= 14; i++) {
      const point = path.getPointAtLength(Math.max(0, length - 160 + i * 160 / 14));
      tail += `${i ? ' L' : 'M'} ${point.x} ${point.y}`;
    }
    $('cometTail').setAttribute('d', still() ? '' : tail);
    const currentChapter = Math.max(0, chapterPositions.findLastIndex(top => top <= targetY));
    stations.forEach((station, i) => {
      station.classList.toggle('current', i === currentChapter);
      station.classList.toggle('reached', targetY >= chapterPositions[i] - 35);
      station.classList.toggle('arriving', Math.abs(targetY - chapterPositions[i]) < 85);
    });
  }
  function queueScroll() { if (!frameQueued) { frameQueued = true; requestAnimationFrame(renderScroll); } }
  window.addEventListener('scroll', queueScroll, {passive:true});
  new ResizeObserver(measure).observe(expedition);
  window.addEventListener('resize', measure, {passive:true});
  document.fonts.ready.then(measure);
  window.addEventListener('load', measure);

  // One clock drives the background and visible scenes; pause preserves their positions.
  const canvas = $('starfield'), ctx = canvas.getContext('2d');
  const portal = $('portal'), dust = $('portalDust'), dustCtx = dust.getContext('2d');
  const flow = $('blackholeFlow'), flowCtx = flow.getContext('2d');
  const solar = document.querySelector('.solar-system');
  let width=0,height=0,galaxyWidth=0,galaxyHeight=0,flowWidth=0,flowHeight=0,solarWidth=0,solarHeight=0;
  let stars=[],galaxy=[],meteors=[],frame=0,lastTime=0,lastPaint=0,universeTime=0,orbitTime=0,nextMeteor=1200,shower=0;
  let pointer={x:0,y:0},camera={x:0,y:0},galaxyBusy=false,galaxyStart=0,galaxyView=0,warpUntil=0;
  const visible = new Set();
  const sceneObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
    entry.target.classList.toggle('offscreen',!entry.isIntersecting);
    if(entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target);
    if(entry.isIntersecting && !entry.target.dataset.entered) {
      entry.target.dataset.entered='true';
      entry.target.querySelectorAll(':scope > .station-copy, :scope > .section-heading, :scope > .observatory-copy, :scope > .intro-layout, :scope > h2').forEach(reveal);
    }
    if(entry.target.id==='observatory'&&!entry.isIntersecting&&galaxyBusy) finishGalaxy();
  }),{rootMargin:'80px'});
  document.querySelectorAll('main section').forEach(section=>sceneObserver.observe(section));
  function fitCanvas(element,w,h,density=1) {
    const context=element.getContext('2d');
    if(!context) return;
    element.width=Math.round(w*density);element.height=Math.round(h*density);
    context.setTransform(density,0,0,density,0,0);
  }
  function resizeScenes() {
    width=innerWidth;height=innerHeight;
    fitCanvas(canvas,width,height,Math.min(devicePixelRatio||1,1.5));
    const box=portal.getBoundingClientRect();galaxyWidth=box.width;galaxyHeight=box.height;
    fitCanvas(dust,galaxyWidth,galaxyHeight,Math.min(devicePixelRatio||1,1.5));
    const hero=document.querySelector('.hero-media').getBoundingClientRect();flowWidth=hero.width;flowHeight=hero.height;
    fitCanvas(flow,flowWidth,flowHeight);
    solarWidth=solar.clientWidth;solarHeight=solar.clientHeight;
    fitCanvas($('cursorTrail'),width,height);
    let seed=4107;
    const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    stars=Array.from({length:width<600?85:180},()=>({x:random()*width,y:random()*height,r:.3+random()*1.1,a:.15+random()*.5,z:.2+random()*.8,phase:random()*6.28}));
    galaxy=Array.from({length:width<600?1600:3200},(_,i)=>{
      const radius=i%4===0?Math.pow(random(),2)*.25:Math.pow(random(),.7),arm=i%2;
      return {radius,angle:i%7===0?random()*6.28:arm*Math.PI+radius*6+(random()-.5)*(1.1-radius*.4),scatter:random()*6.28,depth:random()-.5,size:.35+random()*1.1,light:random()};
    });
    paintStars();paintGalaxy();paintFlow();movePlanets();
    if(width<=600)clearCursor();
  }
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
      const age=(universeTime-meteor.start)/1700;if(age<0||age>1)continue;
      const x=meteor.x+age*width*.48,y=meteor.y+age*height*.45,len=meteor.length;
      const gradient=ctx.createLinearGradient(x-len,y-len*.6,x,y);
      gradient.addColorStop(0,'transparent');gradient.addColorStop(1,light?'#7d6648':'#edddbd');
      ctx.globalAlpha=Math.sin(age*Math.PI)*.5;ctx.strokeStyle=gradient;ctx.lineWidth=1.2;
      ctx.beginPath();ctx.moveTo(x-len,y-len*.6);ctx.lineTo(x,y);ctx.stroke();
    }
    if(warpUntil>universeTime){
      const force=Math.sin((1-(warpUntil-universeTime)/2800)*Math.PI);
      ctx.strokeStyle=light?'#8b633e':'#edc99a';ctx.globalAlpha=force*.38;
      stars.slice(0,70).forEach(star=>{const dx=star.x-width*.7,dy=star.y-height*.5;ctx.beginPath();ctx.moveTo(star.x,star.y);ctx.lineTo(star.x+dx*.11*force,star.y+dy*.11*force);ctx.stroke();});
    }
    ctx.globalAlpha=1;
  }
  function paintFlow(){
    if(!flowCtx)return;
    const c=flowCtx,w=flowWidth,h=flowHeight;
    c.clearRect(0,0,w,h);
    const mobile=w<600,cx=w*(mobile?.61:.71),cy=h*(mobile?.7:.55),r=w*(mobile?.3:.17);
    c.save();c.translate(cx,cy);c.rotate(-.17);
    for(let i=0;i<120;i++){
      const angle=i*2.39996+universeTime*.00012*(1+i%3*.2),radius=r*(1.04+(i%17)/23);
      const x=Math.cos(angle)*radius*1.8,y=Math.sin(angle)*radius*.3;
      // Back-side fragments disappear behind the event horizon.
      if(y<0&&Math.abs(x)<r*.82)continue;
      c.globalAlpha=.2+(i%5)*.08;c.strokeStyle=i%3?'#f5c286':'#fff3d7';c.lineWidth=.6+(i%3)*.35;
      c.beginPath();c.ellipse(0,0,radius*1.8,radius*.3,0,angle,angle+.035);c.stroke();
    }
    c.restore();c.globalAlpha=1;
  }
  function movePlanets(){
    if(solar.matches(':hover, :focus-within'))return;
    projectButtons.forEach((button,i)=>{
      const angle=orbitTime*.000045+Math.PI*(i+.85),tilt=-.35;
      const x=Math.cos(angle)*solarWidth*.35,y=Math.sin(angle)*solarHeight*.25;
      button.style.setProperty('--orbit-x',`${x*Math.cos(tilt)-y*Math.sin(tilt)}px`);
      button.style.setProperty('--orbit-y',`${x*Math.sin(tilt)+y*Math.cos(tilt)}px`);
    });
  }
  function paintGalaxy(){
    if(!dustCtx||!galaxyWidth)return;
    const c=dustCtx,w=galaxyWidth,h=galaxyHeight;
    c.clearRect(0,0,w,h);
    const progress=galaxyBusy?clamp((universeTime-galaxyStart)/3200):0;
    const blend=progress*progress*(3-2*progress);
    const view=galaxyView+(galaxyBusy?(1-2*galaxyView)*blend:0);
    const light=root.dataset.theme==='light';
    const from=light?[61,83,128]:[174,190,255],to=light?[126,67,109]:[223,173,206];
    const armColor=`rgb(${from.map((value,i)=>Math.round(value+(to[i]-value)*view)).join(',')})`;
    const blast=galaxyBusy?Math.pow(Math.sin(progress*Math.PI),.7):0;
    c.save();c.translate(w/2,h/2);c.rotate(-.35);
    const glow=c.createRadialGradient(0,0,0,0,0,w*.3);
    glow.addColorStop(0,`rgba(${light?'148,100,48':'255,224,176'},${.6*(1-blast)})`);glow.addColorStop(.22,`rgba(${light?'129,103,78':'229,191,148'},${.23*(1-blast)})`);glow.addColorStop(1,'transparent');
    c.fillStyle=glow;c.fillRect(-w/2,-h/2,w,h);
    const turn=universeTime*.000025+view*.7;
    for(const star of galaxy){
      const angle=star.angle+turn,radius=star.radius*w*.43;
      const offset=blast*w*(.12+star.light*.32);
      const x=Math.cos(angle)*radius+Math.cos(star.scatter)*offset;
      const y=Math.sin(angle)*radius*.56+star.depth*w*.03+Math.sin(star.scatter)*offset;
      c.globalAlpha=(.35+star.light*.65)*(1-blast*.3);
      c.fillStyle=star.radius<.2?(light?'#875320':'#ffe2ad'):star.light>.7?armColor:(light?'#62677c':'#e6d8c5');
      c.beginPath();c.arc(x,y,star.size*(1-blast*.35),0,Math.PI*2);c.fill();
    }
    if(galaxyBusy){c.globalAlpha=(1-progress)*.45;c.strokeStyle=light?'#865523':'#edc99a';c.lineWidth=1;c.beginPath();c.ellipse(0,0,w*progress*.7,h*progress*.45,0,0,Math.PI*2);c.stroke();}
    c.restore();c.globalAlpha=1;
    portal.classList.add('ready');
    if(galaxyBusy&&progress>=1)finishGalaxy();
  }
  function finishGalaxy(){
    if(!galaxyBusy)return;
    galaxyBusy=false;galaxyView=1-galaxyView;portal.classList.remove('busy');portal.removeAttribute('aria-busy');
    $('portalCaption').textContent=galaxyView?'Reformed / a new constellation of possibilities':'Spiral galaxy / ready to explode';
    paintGalaxy();
  }
  function explodeGalaxy(){
    if(galaxyBusy)return;
    galaxyBusy=true;galaxyStart=universeTime;portal.classList.add('busy');portal.setAttribute('aria-busy','true');
    $('portalCaption').textContent='Gravity, briefly interrupted.';
    if(still()||!dustCtx)finishGalaxy();
  }
  portal.addEventListener('click',explodeGalaxy);$('transformImage').addEventListener('click',explodeGalaxy);
  $('anomaly').addEventListener('click',()=>{
    if(still()){toast('Gravity surge. Motion is paused; the universe stays still.');return;}
    warpUntil=universeTime+2800;$('home').classList.add('gravity-surge');
  });
  $('lostStar').addEventListener('click',()=>{
    if(still()){toast('Wish received. The meteor shower waits until motion is enabled.');return;}
    shower=7;nextMeteor=universeTime;document.querySelector('.constellation').classList.add('wishing');
  });
  function animate(time){
    frame=0;if(still()||document.hidden)return;
    const delta=lastTime?Math.min(time-lastTime,60):16;lastTime=time;universeTime+=delta;
    if(visible.has($('projects'))&&!solar.matches(':hover, :focus-within'))orbitTime+=delta;
    if(time-lastPaint>=33){
      camera.x+=(pointer.x-camera.x)*.07;camera.y+=(pointer.y-camera.y)*.07;
      if(universeTime>=nextMeteor){
        meteors.push({x:Math.random()*width*.8,y:Math.random()*height*.5-100,start:universeTime,length:75+Math.random()*90});
        nextMeteor=universeTime+(shower>0?230:4600);shower=Math.max(0,shower-1);
      }
      meteors=meteors.filter(meteor=>universeTime-meteor.start<1800);
      paintStars();
      if(visible.has($('home')))paintFlow();
      if(visible.has($('observatory')))paintGalaxy();
      if(visible.has($('projects')))movePlanets();
      if(warpUntil<=universeTime)$('home').classList.remove('gravity-surge');
      if(!shower&&!meteors.length)document.querySelector('.constellation').classList.remove('wishing');
      lastPaint=time;
    }
    frame=requestAnimationFrame(animate);
  }
  function syncScenes(){
    cancelAnimationFrame(frame);frame=0;lastTime=0;
    if(!still()&&!document.hidden)frame=requestAnimationFrame(animate);
  }

  // The native cursor stays available for touch, keyboard use, dialogs and reduced motion.
  const trailCanvas=$('cursorTrail'),trailCtx=trailCanvas.getContext('2d'),cursor=$('starCursor');
  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
  let cursorFrame=0,trail=[];
  function clearCursor(){
    root.classList.remove('star-cursor','cursor-link');trail=[];
    cancelAnimationFrame(cursorFrame);cursorFrame=0;
    if(trailCtx)trailCtx.clearRect(0,0,width,height);
  }
  function paintCursor(time){
    cursorFrame=0;if(!trailCtx)return;
    trail=trail.filter(point=>time-point.time<280);
    trailCtx.clearRect(0,0,width,height);
    trail.forEach((point,i)=>{
      trailCtx.globalAlpha=(1-(time-point.time)/280)*.5;trailCtx.fillStyle='#edc99a';
      trailCtx.beginPath();trailCtx.arc(point.x,point.y,Math.max(.4,i/trail.length*2),0,Math.PI*2);trailCtx.fill();
    });trailCtx.globalAlpha=1;
    if(trail.length)cursorFrame=requestAnimationFrame(paintCursor);
  }
  window.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||innerWidth<=600||still()||!finePointer.matches||document.querySelector('dialog[open]')){clearCursor();return;}
    pointer={x:(event.clientX/innerWidth-.5)*20,y:(event.clientY/innerHeight-.5)*16};
    root.classList.add('star-cursor');root.classList.toggle('cursor-link',Boolean(event.target.closest('a,button,summary')));
    cursor.style.transform=`translate(${event.clientX-12}px,${event.clientY-12}px)`;
    trail.push({x:event.clientX,y:event.clientY,time:performance.now()});if(trail.length>30)trail.shift();
    if(!cursorFrame)cursorFrame=requestAnimationFrame(paintCursor);
  },{passive:true});
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
      paintStars();paintFlow();paintGalaxy();
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
  window.addEventListener('resize',resizeScenes,{passive:true});
  document.fonts.ready.then(resizeScenes);
  resizeScenes();updateMotion();measure();
})();
