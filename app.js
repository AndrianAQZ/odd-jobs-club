'use strict';
const $ = id => document.getElementById(id);
const formatter = new Intl.NumberFormat('en');
const categories = ['All industries','Technology & data','Healthcare & science','Business & finance','Art, media & entertainment','Education & research','Engineering & manufacturing','Construction & trades','Food & hospitality','Transport & logistics','Nature & agriculture','Public service & law','Sport & fitness','Beauty & lifestyle','Adult industry','Odd & unusual','Other occupations'];
const rules = [
 ['Adult industry',/\b(adult entertainment|adult performer|adult film|adult content|online adult|erotic|sex worker|sexual wellness|stripper|exotic dancer|escort|pornograph|cam model|intimacy coordinator)/i],
 ['Odd & unusual',/\b(snake milker|professional sleeper|odor judge|odour judge|pet food taster|water slide tester|worm grunter|golf ball diver|fortune cookie writer|chicken sexer|professional mourner|crime scene cleaner|bed tester|island caretaker|iceberg mover|animal inseminator|underwater pizza|professional cuddler|human statue|ghost hunter|mermaid performer|line stander|queuer|toilet tester|bug eater|stunt double)/i],
 ['Technology & data',/\b(software|programmer|coding|developer|cyber|information technology|IT |data |database|machine learning|artificial intelligence|web |cloud |network|computer|blockchain|digital|UX |UI |security engineer|systems engineer|product manager|robotics|app |game design|game develop|QA analyst)/i],
 ['Healthcare & science',/\b(doctor|surgeon|nurs|physician|dentist|medical|clinical|hospital|pharmac|therap|psychol|scientist|chem|biology|biolog|physicist|labora|health|midwi|veterinar|researcher|radiograph|biotech|paramedic|epidemiolog|orthodont|nutritionist|dietitian|genetic|patholog|neuroscien)/i],
 ['Business & finance',/\b(financ|account|bank|investment|insur|tax |auditor|econom|consultant|marketing|sales|business|recruit|human resources|payroll|chief executive|CEO|entrepreneur|stock|trading|trader|asset management|broker|actuar|operations manager|project manager)/i],
 ['Art, media & entertainment',/\b(artist|art director|illustrat|design|photograph|film|cinema|video|music|musician|singer|actor|actress|stage|theatre|theater|animat|producer|editor|author|writer|journalist|reporter|broadcast|podcast|dancer|choreograph|performer|fashion|costume|voice over|voice actor|entertain|sculptor|curator|painter)/i],
 ['Education & research',/\b(teacher|tutor|educat|school|lecturer|professor|academic|pedagog|principal|librarian|training instructor|curriculum|archaeolog|historian|school counsellor|childcare educator|research assistant)/i],
 ['Engineering & manufacturing',/\b(engineer|manufactur|mechanic|machinist|welder|fabricat|industrial|factory|production|assembler|electronic technician|quality control|metallurg|plant operator|toolmaker|maintenance technician|machinery)/i],
 ['Construction & trades',/\b(building|construction|carpenter|electrician|plumber|bricklayer|roofer|tiler|builder|stonemason|architect|survey|glazier|contractor|flooring|excavator|scaffolder|landscap|pest control)/i],
 ['Food & hospitality',/\b(chef|cook|kitchen|restaurant|cater|waiter|waitress|bartender|barista|bakery|baker|hotel|hospitality|sommelier|brewer|food service|pastry|butcher|tour guide|housekeeper|concierge|receptionist)/i],
 ['Transport & logistics',/\b(driver|pilot|aviat|flight|airline|ship|sailor|captain|marine|seafarer|train conductor|transport|logistic|warehouse|delivery|courier|truck|shipping|supply chain|forklift|dispatcher|air traffic|traffic controller)/i],
 ['Nature & agriculture',/\b(farm|agricultur|animal|wildlife|zoo|forest|botan|garden|horticultur|fisher|marine biolog|ecolog|environment|conserv|ranger|beekeep|florist|horse|crop|livestock|aquacultur|geolog|meteorolog|climate|oceanograph)/i],
 ['Public service & law',/\b(lawyer|attorney|judge|legal|police|detective|firefighter|military|soldier|government|politic|diplomat|immigration|border|correctional|prison|social worker|counsellor|public policy|emergency response|security guard|criminal|forensic)/i],
 ['Sport & fitness',/\b(athlete|sport|coach|fitness|trainer|gym|yoga|swim|football|soccer|tennis|climb|surf|ski instructor|referee|lifeguard|martial arts|personal training)/i],
 ['Beauty & lifestyle',/\b(hair|beauty|cosmet|makeup|spa |massage|nail technician|barber|stylist|tattoo|personal shopper|wellness|jeweller|jewelry|interior decorator|pet groomer)/i]
];
const extras = ['Snake milker','Professional sleeper','Water slide tester','Pet food taster','Golf ball diver','Professional mourner','Fortune cookie writer','Chicken sexer','Island caretaker','Human statue performer','Odour judge','Worm grunter','Iceberg mover','Mermaid performer','Ghost hunter','Professional cuddler','Crime scene cleaner','Bed tester','Queue stander','Stunt double','Adult film performer','Adult content creator','Erotic fiction writer','Exotic dancer','Intimacy coordinator','Adult entertainment producer','Sexual wellness educator','Erotic photographer','Adult entertainment venue manager','Online adult performer'];
const spotlight = ['AI Research Scientist','Neurosurgeon','Wildlife Photographer','Astronaut','Marine Biologist','Film Director','Architect','Cybersecurity Engineer','Airline Pilot','Veterinarian','Video Game Designer','Climate Scientist','Pastry Chef','Investigative Journalist','Travel Photographer','Robotics Engineer','Conservation Ranger','Theme Park Designer','Oceanographer','Forensic Scientist','Creative Director','Sports Physiotherapist','Electrician','University Professor','Adult Entertainment Producer','Professional Sleeper','Lawyer','Conservation Ranger','Barber','Chef','Carpenter','Formula One Engineer','Social Worker','Professional Athlete','Financial Analyst','Art Curator','Industrial Designer','Aerospace Engineer'];
const highFlyers=['Neurosurgeon','Anesthesiologist','Chief Executive Officer','Quantitative Researcher','Specialist Surgeon','Airline Captain','Investment Banking Managing Director','AI Research Director','Private Equity Partner','Corporate Lawyer'];
const dreams=['Astronaut','Wildlife Photographer','Film Director','Video Game Designer','Marine Biologist','Formula One Engineer','Music Producer','National Park Ranger','Fashion Designer','Travel Journalist','Animation Director','Pilot'];
const everyday=['Teacher','Registered Nurse','Software Engineer','Chef','Electrician','Photographer','Veterinarian','Firefighter','Architect','Paramedic','Carpenter','Graphic Designer','Social Worker'];
const tough=['Sewer Maintenance Worker','Industrial Cleaner','Waste Collection Worker','Oil Rig Roughneck','Crime Scene Cleaner','Deep Mine Worker','Slaughterhouse Cleaner','Hazardous Waste Technician','Extreme Weather Field Technician','Landfill Worker'];
let jobs=[], filtered=[], pool=[], currentResult='', slotResult='', saved=new Set(), page=0, savedOnly=false, spinning=false, slotSpinning=false, draws=0, angle=0, audioCtx;
try{saved=new Set(JSON.parse(localStorage.getItem('oddjobs-saved')||'[]'));}catch{}
function random(n){if(n<=0)throw Error('Empty draw');const upper=4294967296,limit=upper-(upper%n);let x;do{x=crypto.getRandomValues(new Uint32Array(1))[0]}while(x>=limit);return x%n}
const pick=a=>a[random(a.length)];
function categoryOf(t){for(const [name,rule] of rules)if(rule.test(t))return name;return 'Other occupations'}
function count(n){return formatter.format(n)}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),2400)}
function chime(freq=660,duration=.09){if(!$('sound').checked)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.07,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration)}catch{}}
// Wedges are decorative: they are not a finite list of possible jobs.
const wheel=$('wheel'),ctx=wheel.getContext('2d'),SEGMENTS=14;
function drawWheel(){
 const n=SEGMENTS,r=450,sector=2*Math.PI/n;
 ctx.clearRect(0,0,900,900);ctx.save();ctx.translate(450,450);
 for(let i=0;i<n;i++){
  const start=-Math.PI/2-sector/2+i*sector;
  ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r-5,start,start+sector);ctx.closePath();
  ctx.fillStyle=['#b93d31','#e1b66d','#225844','#e9d7a5','#31483b','#dc6646','#132d25'][i%7];
  ctx.fill();ctx.lineWidth=5;ctx.strokeStyle='#c59b58';ctx.stroke();
  ctx.save();ctx.rotate(start+sector/2);ctx.translate(291,0);ctx.rotate(Math.PI/2);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=[1,3].includes(i%7)?'#26382b':'#fff5d8';
  ctx.font='bold 29px "Space Grotesk",sans-serif';ctx.fillText(String(i+1).padStart(2,'0'),0,0);
  ctx.restore();
 }
 ctx.beginPath();ctx.arc(0,0,425,0,Math.PI*2);ctx.strokeStyle='#f0c477';ctx.lineWidth=9;ctx.stroke();
 ctx.beginPath();ctx.arc(0,0,124,0,Math.PI*2);ctx.fillStyle='#162d21';ctx.fill();ctx.strokeStyle='#c3964e';ctx.lineWidth=12;ctx.stroke();ctx.restore();
}
function updatePool(){
 const cat=$('category').value;
 pool=cat==='All industries'?jobs.map(j=>j.title):jobs.filter(j=>j.category===cat).map(j=>j.title);
 $('pool-count').textContent=count(pool.length);
 $('spin').disabled=spinning||pool.length===0;
}
function beginWheel(){
 if(spinning||!pool.length)return;
 spinning=true;
 const eligible=pool.slice(); // Snapshot the chosen pool; every title gets one equal ticket.
 $('category').disabled=true;$('spin').disabled=true;
 $('spin').firstChild.textContent='THE WHEEL IS SPINNING ';
 $('wheel-empty').hidden=true;
 const wedge=random(SEGMENTS),sector=360/SEGMENTS;
 angle=angle+2160+((360-wedge*sector-(angle%360))%360);
 wheel.style.transform='rotate('+angle+'deg)';chime(440,.18);
 const wait=matchMedia('(prefers-reduced-motion: reduce)').matches?30:6100;
 setTimeout(()=>{
  // The outcome is selected independently of the 14 decorative wedges.
  // The selection is uniform across ALL occupations in the eligible pool.
  const winner=pick(eligible);
  currentResult=winner;spinning=false;draws++;
  $('draw-number').textContent='DRAW #'+String(draws).padStart(3,'0');
  $('result-title').textContent=winner;
  $('result-category').textContent=categoryOf(winner);
  $('wheel-result').hidden=false;
  $('spin').firstChild.textContent='SPIN THE WHEEL ';
  $('category').disabled=false;updatePool();chime(850,.2);
  $('wheel-result').scrollIntoView({behavior:'smooth',block:'nearest'});
 },wait);
}
function renderDirectory(){const q=$('search').value.trim().toLocaleLowerCase(),cat=$('browse-category').value;filtered=jobs.filter(j=>(cat==='All industries'||j.category===cat)&&(!savedOnly||saved.has(j.title))&&(!q||j.lower.includes(q)));const pages=Math.max(1,Math.ceil(filtered.length/18));page=Math.min(page,pages-1);$('match-count').textContent=count(filtered.length)+' MATCHING JOBS';$('page-number').textContent='PAGE '+(page+1)+' OF '+pages;$('prev-page').disabled=page===0;$('next-page').disabled=page>=pages-1;$('save-count').textContent=saved.size;const list=filtered.slice(page*18,page*18+18);const grid=$('job-grid');grid.replaceChildren();for(let i=0;i<list.length;i++){const j=list[i];const el=document.createElement('article');el.className='job-card';const top=document.createElement('div');top.className='job-card-top';const tag=document.createElement('span');tag.textContent=j.category.toUpperCase();const heart=document.createElement('button');heart.className=saved.has(j.title)?'saved':'';heart.textContent=saved.has(j.title)?'♥':'♡';heart.setAttribute('aria-label',(saved.has(j.title)?'Unsave ':'Save ')+j.title);heart.addEventListener('click',()=>toggleSaved(j.title));top.append(tag,heart);const title=document.createElement('h3');title.textContent=j.title;const bottom=document.createElement('div');bottom.className='job-card-bottom';const idx=document.createElement('span');idx.textContent='#'+String(page*18+i+1).padStart(5,'0');const action=document.createElement('button');action.textContent='TRY THIS ↗';action.addEventListener('click',()=>{currentResult=j.title;$('wheel-empty').hidden=true;$('result-title').textContent=j.title;$('result-category').textContent=j.category;$('wheel-result').hidden=false;$('wheel-result').scrollIntoView({behavior:'smooth',block:'center'});toast('Career selected from directory')});bottom.append(idx,action);el.append(top,title,bottom);grid.append(el)}if(!list.length){const p=document.createElement('p');p.textContent='No jobs found. Try a different search.';grid.append(p)}}
function toggleSaved(title){if(!title)return;if(saved.has(title)){saved.delete(title);toast('Removed from saved jobs')}else{saved.add(title);toast('Saved to your shortlist')}try{localStorage.setItem('oddjobs-saved',JSON.stringify([...saved]))}catch{}renderDirectory()}
async function copyTitle(title){if(!title)return;try{await navigator.clipboard.writeText('Odd Jobs Club picked: '+title+' — '+location.href.split('#')[0]);toast('Copied to clipboard')}catch{toast('Clipboard is unavailable here')}}
function slotTier(a){const k=a.join('');if(k==='777')return ['JACKPOT / HIGH-FLYER CAREER',highFlyers,'A career from our high-earning-potential shortlist. Actual pay depends heavily on experience, country and employer.'];if(k==='000')return ['THE GRITTY SHIFT / TOUGH GIG',tough,'A physically demanding or unpleasant line of work. Difficult does not mean unimportant — these jobs keep the world running.'];if(a[0]===a[1]&&a[1]===a[2])return ['TRIPLE MATCH / DREAM CAREER',dreams,'A career from our editorial dream-job shortlist.'];if(a[0]===a[1]||a[0]===a[2]||a[1]===a[2])return ['MATCHING PAIR / EVERYDAY LEGEND',everyday,'Everyday careers that deserve more appreciation.'];return ['WILD CARD / ABSOLUTELY ANYTHING',jobs.map(j=>j.title),'You drew a complete wildcard from the entire job catalogue.']}
function runSlots(){if(slotSpinning||!jobs.length)return;slotSpinning=true;$('slots-spin').disabled=true;$('slot-result').hidden=true;$('slot-status').textContent='THE REELS ARE TURNING…';const digits=[random(10),random(10),random(10)],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let finished=0;for(let i=0;i<3;i++){const el=$('digit-'+(i+1));el.classList.add('rolling');const ms=reduced?0:800+i*850;let ticker;if(!reduced)ticker=setInterval(()=>{el.textContent=random(10);chime(260+i*65,.04)},75);setTimeout(()=>{clearInterval(ticker);el.classList.remove('rolling');el.textContent=digits[i];chime(480+i*140,.16);finished++;if(finished===3){const [tier,options,description]=slotTier(digits);slotResult=pick(options);$('slot-tier').textContent='✳ '+tier+' / '+digits.join('–');$('slot-job').textContent=slotResult;$('slot-desc').textContent=description;$('slot-result').hidden=false;$('slot-status').textContent=digits.join(' • ')+' — RESULT LOCKED';$('slots-spin').disabled=false;slotSpinning=false;chime(900,.24);$('slot-result').scrollIntoView({behavior:'smooth',block:'nearest'})}},ms)} }
function init(){for(const id of ['category','browse-category']){const select=$(id);for(const name of categories){const o=document.createElement('option');o.value=name;o.textContent=name;select.append(o)}}$('category').addEventListener('change',updatePool);$('spin').addEventListener('click',beginWheel);$('spin-again').addEventListener('click',beginWheel);$('copy-wheel').addEventListener('click',()=>copyTitle(currentResult));$('save-wheel').addEventListener('click',()=>toggleSaved(currentResult));$('slots-spin').addEventListener('click',runSlots);$('slot-copy').addEventListener('click',()=>copyTitle(slotResult));$('slot-save').addEventListener('click',()=>toggleSaved(slotResult));$('browse-category').addEventListener('change',()=>{page=0;renderDirectory()});$('search').addEventListener('input',()=>{page=0;renderDirectory()});$('saved-filter').addEventListener('click',()=>{savedOnly=!savedOnly;$('saved-filter').classList.toggle('chosen',savedOnly);page=0;renderDirectory()});$('prev-page').addEventListener('click',()=>{page--;renderDirectory();$('directory-section').scrollIntoView()});$('next-page').addEventListener('click',()=>{page++;renderDirectory();$('directory-section').scrollIntoView()});document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='SELECT'){e.preventDefault();$('search').focus()}});drawWheel();updatePool()}
init();
(async()=>{try{const [raw,esco]=await Promise.all([fetch('data/additional-titles.json').then(r=>{if(!r.ok)throw Error('Job titles unavailable');return r.json()}),fetch('data/occupations.json').then(r=>r.ok?r.json():[])]);const set=new Map();for(const title of [...raw,...esco.map(j=>j.title),...extras,...spotlight,...highFlyers,...dreams,...everyday,...tough]){if(typeof title!=='string')continue;const clean=title.trim();if(!clean||clean.length>100)continue;const key=clean.toLocaleLowerCase();if(!set.has(key))set.set(key,{title:clean,lower:key,category:categoryOf(clean)})}jobs=[...set.values()].sort((a,b)=>a.title.localeCompare(b.title));$('total-header').textContent=count(jobs.length)+' CAREERS IN PLAY';$('total-stat').textContent=count(jobs.length);updatePool();renderDirectory()}catch(err){console.error(err);jobs=[...new Set([...extras,...spotlight,...highFlyers,...dreams,...everyday,...tough])].map(title=>({title,lower:title.toLowerCase(),category:categoryOf(title)}));$('total-header').textContent=count(jobs.length)+' OFFLINE CAREERS';$('total-stat').textContent=count(jobs.length);updatePool();renderDirectory();toast('Full catalogue unavailable. Showing offline jobs.')}})();
