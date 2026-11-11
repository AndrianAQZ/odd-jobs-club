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
// Every occupation is eligible independently of the wheel colours.
// Wheel colours are a separate, explicitly cosmetic rarity draw.
const RARITY_WEDGES=['common','rare','common','uncommon','common','epic','common','uncommon','common','rare','common','uncommon','common','legendary','common','uncommon','common','rare','common','uncommon'];
const RARITY_COLOURS={common:'#3d866c',uncommon:'#3eaaa4',rare:'#3278d8',epic:'#9253db',legendary:'#f3c655'};
const SEGMENTS=RARITY_WEDGES.length,wheel=$('wheel'),ctx=wheel.getContext('2d');
function drawWheel(){
 const sector=2*Math.PI/SEGMENTS,r=450;
 ctx.clearRect(0,0,900,900);ctx.save();ctx.translate(450,450);
 for(let i=0;i<SEGMENTS;i++){
  const start=-Math.PI/2-sector/2+i*sector;
  ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r-5,start,start+sector);ctx.closePath();
  ctx.fillStyle=RARITY_COLOURS[RARITY_WEDGES[i]];ctx.fill();
  ctx.lineWidth=5;ctx.strokeStyle='#e6c38a';ctx.stroke();
  // Small inset highlights give every coloured wedge a traditional roulette finish.
  ctx.save();ctx.rotate(start+sector/2);
  ctx.beginPath();ctx.arc(330,0,9,0,Math.PI*2);ctx.fillStyle='#f5eddccc';ctx.fill();
  ctx.beginPath();ctx.moveTo(177,-1);ctx.lineTo(275,-1);ctx.strokeStyle='#ffffff4a';ctx.lineWidth=3;ctx.stroke();
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
 $('wheel-shell').setAttribute('aria-disabled',String(spinning||pool.length===0));
}
function beginWheel(){
 if(spinning||!pool.length)return;
 spinning=true;
 const eligible=pool.slice(); // All jobs, no wheel shortlists or pay-based filtering.
 const wedge=random(SEGMENTS),rarity=RARITY_WEDGES[wedge];
 $('category').disabled=true;$('spin').disabled=true;
 $('wheel-shell').setAttribute('aria-disabled','true');
 $('spin').firstChild.textContent='THE WHEEL IS SPINNING ';
 $('wheel-empty').hidden=true;
 const sector=360/SEGMENTS;
 angle=angle+2160+((360-wedge*sector-(angle%360))%360);
 wheel.style.transform='rotate('+angle+'deg)';chime(440,.18);
 const wait=matchMedia('(prefers-reduced-motion: reduce)').matches?30:6100;
 setTimeout(()=>{
  // One unbiased random job from the entire eligible catalogue, independent
  // of the rarity colour. No job requires a corresponding wheel wedge.
  const winner=pick(eligible);
  currentResult=winner;spinning=false;draws++;
  $('draw-number').textContent='DRAW #'+String(draws).padStart(3,'0');
  showWheelResult(winner,rarity);
  $('spin').firstChild.textContent='SPIN THE WHEEL ';
  $('category').disabled=false;updatePool();chime(850,.2);
  $('wheel-result').scrollIntoView({behavior:'smooth',block:'nearest'});
 },wait);
}
const JSA_ROOT='https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles',PAY_SOURCE=JSA_ROOT+'/occupations-anzsco';
let auRows=[],auByCode=new Map(),auByTitle=new Map();
function normaliseTitle(title){
 return String(title).toLocaleLowerCase('en-AU').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim().replace(/\b(and|the)\b/g,'').replace(/\s+/g,' ');
}
function singularForm(title){
 return normaliseTitle(title).split(' ').map(w=>w.endsWith('ies')&&w.length>4?w.slice(0,-3)+'y':w.endsWith('s')&&!w.endsWith('ss')&&w.length>3?w.slice(0,-1):w).join(' ');
}
function indexAustralianProfiles(rows){
 auRows=Array.isArray(rows)?rows:[];auByCode=new Map();auByTitle=new Map();
 for(const x of auRows){
  auByCode.set(x.code,x);
  for(const key of [normaliseTitle(x.title),singularForm(x.title)])if(!auByTitle.has(key))auByTitle.set(key,x);
 }
}
// Aliases are limited to confident occupation families; otherwise we display no pay figure.
const auAliases=[
 [/(?:software|application|app|full.stack|back.end|front.end|web) (?:engineer|developer|programmer)/i,'2613'],
 [/\b(?:registered nurse|clinical nurse|nursing officer)\b/i,'2544'],
 [/\b(?:chef|sous.chef|head chef|pastry chef)\b/i,'3513'],
 [/\b(?:electrician|electrical tradesperson)\b/i,'3411'],
 [/\b(?:carpenter|joiner)\b/i,'3312'],
 [/\b(?:plumber|gasfitter)\b/i,'3341'],
 [/\b(?:dentist|dental practitioner)\b/i,'2523'],
 [/\b(?:paramedic|ambulance officer)\b/i,'4111'],
 [/\b(?:firefighter|fire fighter)\b/i,'4412'],
 [/\b(?:secondary school teacher|high school teacher)\b/i,'2414'],
 [/\b(?:primary school teacher|elementary school teacher)\b/i,'2412'],
 [/^(?!.*\b(?:software|cloud|data|systems|enterprise|solution|security|network)\b).*\b(?:architect|landscape architect)\b/i,'2321'],
 [/\b(?:photographer|photojournalist)\b/i,'2113'],
 [/\b(?:airline pilot|commercial pilot|flight instructor)\b/i,'2311'],
 [/\b(?:anaesthetist|anesthesiologist)\b/i,'2532'],
 [/\b(?:accountant|certified public accountant)\b/i,'2211'],
 [/\b(?:graphic designer|visual designer)\b/i,'2324'],
 [/\b(?:veterinarian|veterinary surgeon)\b/i,'2347'],
 [/\b(?:civil engineer)\b/i,'2332']
];
const unusualDescriptions={
 'snake milker':'Carefully collects venom from live snakes for antivenom development and scientific research. The work requires specialist handling, strict safety procedures and controlled facilities.',
 'professional sleeper':'Participates in sleep research or short-term mattress and accommodation testing, sometimes recording sleep patterns and comfort. Usually an occasional assignment, not a conventional full-time job.',
 'water slide tester':'Trials waterslides and attractions, reporting issues involving ride experience, comfort and safety to operators or designers.',
 'pet food taster':'Evaluates pet-food qualities such as aroma, appearance and texture as part of a product assessment or quality-control process.',
 'golf ball diver':'Recovers lost golf balls from water hazards, often working underwater in low-visibility and challenging conditions.',
 'professional mourner':'Attends memorials or funerals as a hired participant to support ceremonial traditions or a family’s arrangements.',
 'fortune cookie writer':'Creates the short messages, jokes and sayings printed on slips placed inside fortune cookies.',
 'chicken sexer':'Identifies the sex of newly hatched chicks to assist hatchery operations. The work requires specialist training and precision.',
 'odour judge':'Assesses smells for research, product testing or quality control, typically using controlled protocols and consistent scoring.',
 'worm grunter':'Uses ground vibrations to encourage earthworms to surface, often for bait gathering or local competitions.',
 'iceberg mover':'Helps plan or carry out specialised marine operations involving the movement or management of icebergs in cold waters.',
 'mermaid performer':'Entertains audiences in a mermaid costume, often in an aquarium or event setting, combining performance with water-safety skills.',
 'intimacy coordinator':'Plans and supervises choreography, consent and professional boundaries during intimate scenes in film, television or theatre.',
 'adult film performer':'Performs in productions intended for adult audiences, under relevant workplace standards, contractual terms and local laws.',
 'adult content creator':'Produces and manages media intended for adult audiences, including content planning, distribution and audience management, where legal.',
 'erotic fiction writer':'Writes fiction intended for adult readers, developing characters, plots, dialogue and publishing or distribution plans.',
 'exotic dancer':'Performs dance routines for adult audiences in legally permitted live-entertainment settings.',
 'sexual wellness educator':'Provides factual education about sexual health, consent, communication and wellbeing, generally within relevant qualifications and legal scope.'
};
const overviewPatterns=[
 [/\bmanager|director|supervisor|head of\b/i,'organising people, schedules and decisions; setting priorities and making sure work is delivered safely and effectively'],
 [/\b(?:engineer|architect|technologist)\b/i,'designing, improving or maintaining technical systems and solving practical problems'],
 [/\b(?:developer|programmer|coder)\b/i,'building, testing and maintaining digital products, software or systems'],
 [/\b(?:nurse|therapist|doctor|clinician|medical)\b/i,'supporting healthcare, assessment or treatment within the relevant professional scope'],
 [/\b(?:analyst|researcher|scientist)\b/i,'investigating information, testing ideas and communicating evidence to support decisions'],
 [/\b(?:technician|mechanic|repairer)\b/i,'inspecting, maintaining, testing or repairing equipment and systems'],
 [/\b(?:teacher|instructor|tutor|trainer)\b/i,'helping people learn through instruction, preparation and feedback'],
 [/\b(?:designer|artist|illustrator|animator)\b/i,'developing creative concepts and producing visuals or other original work'],
 [/\b(?:cook|chef|baker)\b/i,'preparing food, managing ingredients and maintaining safe service standards'],
 [/\b(?:driver|pilot|captain|courier)\b/i,'operating transport or delivering people and goods safely and on schedule'],
 [/\b(?:operator|assembler|fabricator)\b/i,'operating machinery or carrying out production tasks to meet practical standards'],
 [/\b(?:assistant|associate|aide|attendant)\b/i,'supporting a team or service with day-to-day practical and administrative tasks'],
 [/\b(?:inspector|auditor|examiner)\b/i,'checking work, records or equipment against quality, safety or regulatory requirements'],
 [/\b(?:writer|journalist|editor|producer)\b/i,'researching, shaping and publishing information or creative content for an audience'],
 [/\b(?:farmer|gardener|ranger|forester)\b/i,'caring for land, plants or animals and managing outdoor work']
];
function generalDescription(title){
 const lower=normaliseTitle(title);
 if(unusualDescriptions[lower])return unusualDescriptions[lower];
 const found=overviewPatterns.find(([regex])=>regex.test(title));
 if(found)return 'A '+title+' typically focuses on '+found[1]+'. Exact duties, qualifications and working conditions depend on the employer and location.';
 return '“'+title+'” is a specialist job title. The responsibilities, skills and working conditions depend on the employer and industry; check an Australian job listing or occupation profile for a precise duty statement.';
}
function australianProfile(title){
 const exact=auByTitle.get(normaliseTitle(title))||auByTitle.get(singularForm(title));
 if(exact)return {row:exact,match:'exact'};
 const alias=auAliases.find(([regex,code])=>regex.test(title)&&auByCode.has(code));
 return alias?{row:auByCode.get(alias[1]),match:'group'}:null;
}
function sourceLink(row){
 if(!row)return PAY_SOURCE;
 const slug=row.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 return JSA_ROOT+'/occupations/'+row.code+'-'+slug;
}
function roleInfo(title){
 const found=australianProfile(title),row=found?.row||null;
 let salaryGroup=row;
 if(row?.parent)salaryGroup=auByCode.get(row.parent)||row;
 const weekly=Number.isFinite(salaryGroup?.weekly)?salaryGroup.weekly:null;
 const annual=weekly===null?null:weekly*52;
 const hasOfficialDesc=!!(row?.description&&found?.match==='exact');
 const description=hasOfficialDesc?row.description:found?.match==='group'&&row?.description?(generalDescription(title)+' This role is related to the Australian occupation group “'+row.title+'”.'):generalDescription(title);
 const descriptionNote=hasOfficialDesc?'Description: Jobs and Skills Australia ANZSCO occupation profile.':'General, title-based overview; not an officially verified job-specific description.';
 const pay=weekly===null?'Not available':'A$'+count(annual)+' / year';
 const payNote=weekly===null?'No reliable Australian pay figure for this exact title or matched occupation group.':'A$'+count(weekly)+'/week · median for '+salaryGroup.title+' (ANZSCO '+salaryGroup.code+') · ABS May 2025';
 return {title,category:categoryOf(title),description,descriptionNote,pay,payNote,weekly,source:sourceLink(salaryGroup),sourceName:weekly===null?'Browse Australian occupation data':'Source: '+salaryGroup.title+' (ANZSCO '+salaryGroup.code+')'};
}
function showWheelResult(title,rarity){
 const info=roleInfo(title);
 $('result-title').textContent=title;$('result-category').textContent=info.category;
 $('wheel-description').textContent=info.description;$('wheel-pay').textContent=info.pay;$('wheel-pay-note').textContent=info.payNote;
 const badge=$('result-rarity');badge.className='rarity-tag '+rarity;badge.textContent=rarity.toUpperCase()+' DRAW';
 $('wheel-result').hidden=false;
}
function showSlotRole(title){
 const info=roleInfo(title);$('slot-job-description').textContent=info.description;
 $('slot-pay').textContent=info.pay;$('slot-pay-note').textContent=info.payNote;
}
function openRoleDialog(title){
 if(!title)return;const info=roleInfo(title),dialog=$('job-dialog');
 $('dialog-category').textContent=info.category;$('dialog-job-title').textContent=title;
 $('dialog-job-description').textContent=info.description;$('dialog-description-note').textContent=info.descriptionNote;
 $('dialog-salary').textContent=info.pay;$('dialog-salary-note').textContent=info.payNote;
 $('dialog-source').href=info.source;$('dialog-source').textContent=info.sourceName+' ↗';
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
 $('close-dialog').focus();
}
function renderDirectory(){const q=$('search').value.trim().toLocaleLowerCase(),cat=$('browse-category').value;filtered=jobs.filter(j=>(cat==='All industries'||j.category===cat)&&(!savedOnly||saved.has(j.title))&&(!q||j.lower.includes(q)));const pages=Math.max(1,Math.ceil(filtered.length/18));page=Math.min(page,pages-1);$('match-count').textContent=count(filtered.length)+' MATCHING JOBS';$('page-number').textContent='PAGE '+(page+1)+' OF '+pages;$('prev-page').disabled=page===0;$('next-page').disabled=page>=pages-1;$('save-count').textContent=saved.size;const list=filtered.slice(page*18,page*18+18);const grid=$('job-grid');grid.replaceChildren();for(let i=0;i<list.length;i++){const j=list[i];const el=document.createElement('article');el.className='job-card';const top=document.createElement('div');top.className='job-card-top';const tag=document.createElement('span');tag.textContent=j.category.toUpperCase();const heart=document.createElement('button');heart.className=saved.has(j.title)?'saved':'';heart.textContent=saved.has(j.title)?'♥':'♡';heart.setAttribute('aria-label',(saved.has(j.title)?'Unsave ':'Save ')+j.title);heart.addEventListener('click',()=>toggleSaved(j.title));top.append(tag,heart);const title=document.createElement('h3');title.textContent=j.title;const bottom=document.createElement('div');bottom.className='job-card-bottom';const idx=document.createElement('span');idx.textContent='#'+String(page*18+i+1).padStart(5,'0');const action=document.createElement('button');action.textContent='VIEW JOB ↗';action.addEventListener('click',()=>openRoleDialog(j.title));bottom.append(idx,action);el.append(top,title,bottom);grid.append(el)}if(!list.length){const p=document.createElement('p');p.textContent='No jobs found. Try a different search.';grid.append(p)}}
function toggleSaved(title){if(!title)return;if(saved.has(title)){saved.delete(title);toast('Removed from saved jobs')}else{saved.add(title);toast('Saved to your shortlist')}try{localStorage.setItem('oddjobs-saved',JSON.stringify([...saved]))}catch{}renderDirectory()}
async function copyTitle(title){if(!title)return;try{await navigator.clipboard.writeText('Odd Jobs Club picked: '+title+' — '+location.href.split('#')[0]);toast('Copied to clipboard')}catch{toast('Clipboard is unavailable here')}}
function slotTier(a){const k=a.join('');if(k==='777')return ['JACKPOT / HIGH-FLYER CAREER',highFlyers,'A career from our high-earning-potential shortlist. Actual pay depends heavily on experience, country and employer.'];if(k==='000')return ['THE GRITTY SHIFT / TOUGH GIG',tough,'A physically demanding or unpleasant line of work. Difficult does not mean unimportant — these jobs keep the world running.'];if(a[0]===a[1]&&a[1]===a[2])return ['TRIPLE MATCH / DREAM CAREER',dreams,'A career from our editorial dream-job shortlist.'];if(a[0]===a[1]||a[0]===a[2]||a[1]===a[2])return ['MATCHING PAIR / EVERYDAY LEGEND',everyday,'Everyday careers that deserve more appreciation.'];return ['WILD CARD / ABSOLUTELY ANYTHING',jobs.map(j=>j.title),'You drew a complete wildcard from the entire job catalogue.']}
function runSlots(){if(slotSpinning||!jobs.length)return;slotSpinning=true;$('slots-spin').disabled=true;$('slot-result').hidden=true;$('slot-status').textContent='THE REELS ARE TURNING…';const digits=[random(10),random(10),random(10)],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let finished=0;for(let i=0;i<3;i++){const el=$('digit-'+(i+1));el.classList.add('rolling');const ms=reduced?0:800+i*850;let ticker;if(!reduced)ticker=setInterval(()=>{el.textContent=random(10);chime(260+i*65,.04)},75);setTimeout(()=>{clearInterval(ticker);el.classList.remove('rolling');el.textContent=digits[i];chime(480+i*140,.16);finished++;if(finished===3){const [tier,options,description]=slotTier(digits);slotResult=pick(options);$('slot-tier').textContent='✳ '+tier+' / '+digits.join('–');$('slot-job').textContent=slotResult;$('slot-desc').textContent=description;showSlotRole(slotResult);$('slot-result').hidden=false;$('slot-status').textContent=digits.join(' • ')+' — RESULT LOCKED';$('slots-spin').disabled=false;slotSpinning=false;chime(900,.24);$('slot-result').scrollIntoView({behavior:'smooth',block:'nearest'})}},ms)} }
function init(){for(const id of ['category','browse-category']){const select=$(id);for(const name of categories){const o=document.createElement('option');o.value=name;o.textContent=name;select.append(o)}}$('category').addEventListener('change',updatePool);$('spin').addEventListener('click',beginWheel);$('wheel-shell').addEventListener('click',beginWheel);$('wheel-shell').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();beginWheel()}});$('spin-again').addEventListener('click',beginWheel);$('copy-wheel').addEventListener('click',()=>copyTitle(currentResult));$('save-wheel').addEventListener('click',()=>toggleSaved(currentResult));$('wheel-details').addEventListener('click',()=>openRoleDialog(currentResult));$('slots-spin').addEventListener('click',runSlots);$('slot-copy').addEventListener('click',()=>copyTitle(slotResult));$('slot-save').addEventListener('click',()=>toggleSaved(slotResult));$('slot-details').addEventListener('click',()=>openRoleDialog(slotResult));$('close-dialog').addEventListener('click',()=>$('job-dialog').close());$('job-dialog').addEventListener('click',e=>{if(e.target===$('job-dialog'))$('job-dialog').close()});$('browse-category').addEventListener('change',()=>{page=0;renderDirectory()});$('search').addEventListener('input',()=>{page=0;renderDirectory()});$('saved-filter').addEventListener('click',()=>{savedOnly=!savedOnly;$('saved-filter').classList.toggle('chosen',savedOnly);page=0;renderDirectory()});$('prev-page').addEventListener('click',()=>{page--;renderDirectory();$('directory-section').scrollIntoView()});$('next-page').addEventListener('click',()=>{page++;renderDirectory();$('directory-section').scrollIntoView()});document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='SELECT'){e.preventDefault();$('search').focus()}});drawWheel();updatePool()}
init();
(async()=>{try{const [raw,esco,auData]=await Promise.all([fetch('data/additional-titles.json').then(r=>{if(!r.ok)throw Error('Job titles unavailable');return r.json()}),fetch('data/occupations.json').then(r=>r.ok?r.json():[]),fetch('data/au-occupations.json').then(r=>r.ok?r.json():[])]);indexAustralianProfiles(auData);const set=new Map();for(const title of [...raw,...esco.map(j=>j.title),...auData.map(j=>j.title),...extras,...spotlight,...highFlyers,...dreams,...everyday,...tough]){if(typeof title!=='string')continue;const clean=title.trim();if(!clean||clean.length>100)continue;const key=clean.toLocaleLowerCase();if(!set.has(key))set.set(key,{title:clean,lower:key,category:categoryOf(clean)})}jobs=[...set.values()].sort((a,b)=>a.title.localeCompare(b.title));$('total-header').textContent=count(jobs.length)+' CAREERS IN PLAY';$('total-stat').textContent=count(jobs.length);updatePool();renderDirectory()}catch(err){console.error(err);jobs=[...new Set([...extras,...spotlight,...highFlyers,...dreams,...everyday,...tough])].map(title=>({title,lower:title.toLowerCase(),category:categoryOf(title)}));$('total-header').textContent=count(jobs.length)+' OFFLINE CAREERS';$('total-stat').textContent=count(jobs.length);updatePool();renderDirectory();toast('Full catalogue unavailable. Showing offline jobs.')}})();
