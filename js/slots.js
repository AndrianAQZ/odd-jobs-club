import {catalogue,pools,profile,choose,rand,roleUrl,aud,toggleSave,savedJobs} from './core.js';
import {unlock,reelTick,reelStop,jackpot} from './audio.js';
const windows=[...document.querySelectorAll('.reel-window')],button=document.getElementById('pull-lever'),machine=document.getElementById('slot-machine');
const status=document.getElementById('slot-status'),result=document.getElementById('slot-result');
let inMotion=false,groups;
// Keep each reel on the digit it last displayed between spins.
const reelDigits=[7,7,7];
const BASE_INDEX=10;
const LAST_SPIN_INDEX=80;
const tough=['Sewer Maintenance Worker','Industrial Cleaner','Waste Collection Worker','Oil Rig Roughneck','Crime Scene Cleaner','Deep Mine Worker','Slaughterhouse Cleaner','Hazardous Waste Technician','Landfill Worker','Mixed Runner','Bed Setter'];
function prepare(){for(let i=0;i<windows.length;i++){
 const track=windows[i].querySelector('.reel-track');track.replaceChildren();const frag=document.createDocumentFragment();
 for(let n=0;n<130;n++){const cell=document.createElement('span');cell.className='reel-cell';cell.textContent=n%10;frag.appendChild(cell)}
 track.append(frag);requestAnimationFrame(()=>{const height=windows[i].getBoundingClientRect().height;track.style.transition='none';track.style.transform='translateY(-'+(BASE_INDEX+reelDigits[i])*height+'px)'})
 }}
function reelPosition(track){const t=getComputedStyle(track).transform;if(t==='none')return 0;return new DOMMatrixReadOnly(t).m42}
function animateReel(win,i,target,duration){return new Promise(resolve=>{
 const track=win.querySelector('.reel-track'),cellH=win.clientHeight;
 // End on a cell with the SAME digit as the result (modulo ten).
 // The three reels complete different numbers of full revolutions.
 const endIndex=LAST_SPIN_INDEX+i*20+target;
 const end=endIndex*cellH;
 const startIndex=BASE_INDEX+reelDigits[i];
 win.classList.add('rolling');win.classList.remove('stopped');
 track.style.transition='none';track.style.transform='translateY(-'+startIndex*cellH+'px)';track.getBoundingClientRect();
 requestAnimationFrame(()=>{
 track.style.transition='transform '+duration+'ms cubic-bezier(.08,.74,.11,1)';track.style.transform='translateY(-'+end+'px)';
 });
 let prev=-startIndex*cellH,remainder=0,done=false;const started=performance.now();
 function frame(){if(done)return;const curr=reelPosition(track);remainder+=Math.max(0,prev-curr);prev=curr;
 if(remainder>=cellH){remainder%=cellH;reelTick(i)}
 if(performance.now()-started<duration+100)requestAnimationFrame(frame)}
 requestAnimationFrame(frame);
 setTimeout(()=>{
  done=true;
  // Rebase inside the identical repeating strip without changing the visible digit.
  track.style.transition='none';
  track.style.transform='translateY(-'+(BASE_INDEX+target)*cellH+'px)';
  reelDigits[i]=target;
  win.classList.remove('rolling');win.classList.add('stopped');
  reelStop(i);resolve();
 },duration+80);
 })}
function drawConfetti(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const colours=['#efc671','#f4e0b4','#b5393e','#668d7c','#e8bc77'];
 for(let i=0;i<80;i++){const el=document.createElement('i');el.className='confetti';el.style.setProperty('--x',(rand(900)-450)+'px');el.style.setProperty('--y',(rand(400)-160)+'px');el.style.setProperty('--rot',(rand(760)-380)+'deg');el.style.setProperty('--colour',colours[rand(colours.length)]);el.style.animationDelay=rand(350)+'ms';machine.append(el);setTimeout(()=>el.remove(),2300)}
}
function outcome(d){const v=d.join('');let tier,list,note;
 if(v==='777'){tier='JACKPOT';list=groups.legendary;note='Top-tier high-paying career pool.'}
 else if(v==='000'){tier='HARD MODE';list=tough;note='Challenging work. Essential does not mean easy.'}
 else if(d[0]===d[1]&&d[1]===d[2]){tier='TRIPLE MATCH';list=groups.epic;note='Specialist and exceptional career pool.'}
 else if(d[0]===d[1]||d[0]===d[2]||d[1]===d[2]){tier='DOUBLE MATCH';list=groups.rare;note='Selected from the rare career pool.'}
 else{tier='WILD CARD';list=[...groups.common,...groups.uncommon];note='Selected from the wider career pool.'}
 return {tier,title:choose(list),note}
}
async function spin(){if(inMotion||!groups)return;unlock();inMotion=true;button.disabled=true;result.hidden=true;
 machine.classList.remove('jackpot','triple','hard','double');status.textContent='ROLLING';
 const digits=[rand(10),rand(10),rand(10)];const times=matchMedia('(prefers-reduced-motion: reduce)').matches?[180,270,360]:[2400,3250,4050];
 await Promise.all(digits.map((d,i)=>animateReel(windows[i],i,d,times[i])));
 const o=outcome(digits),p=await profile(o.title);
 status.textContent=digits.join('  ·  ');if(o.tier==='JACKPOT'){machine.classList.add('jackpot');jackpot();drawConfetti()}
 else if(o.tier==='TRIPLE MATCH')machine.classList.add('triple');else if(o.tier==='DOUBLE MATCH')machine.classList.add('double');else if(o.tier==='HARD MODE')machine.classList.add('hard');
 document.getElementById('slot-draw').textContent=digits.join(' · ');
 document.getElementById('slot-result-tier').textContent=o.tier;
 document.getElementById('slot-result-tier').dataset.tier=o.tier==='JACKPOT'?'legendary':o.tier==='TRIPLE MATCH'?'epic':o.tier==='DOUBLE MATCH'?'rare':o.tier==='HARD MODE'?'common':'uncommon';
 document.getElementById('slot-job').textContent=p.title;
 document.getElementById('slot-job-category').textContent=p.cat;
 document.getElementById('slot-job-desc').textContent=p.description;
 document.getElementById('slot-pay').textContent=aud(p.lo)+'–'+aud(p.hi)+' / YEAR';
 document.getElementById('slot-pay-basis').textContent=p.official?'Official occupation median + illustrative range':'Australian pay estimate · '+p.confidence;
 document.getElementById('slot-profile').href=roleUrl(p.title);
 const save=document.getElementById('slot-save');const sync=()=>save.textContent=savedJobs().has(p.title)?'♥ Saved':'♡ Save';save.onclick=()=>{toggleSave(p.title);sync()};sync();
 result.hidden=false;button.disabled=false;inMotion=false;result.scrollIntoView({behavior:'smooth',block:'nearest'});
}
prepare();button.addEventListener('click',spin);document.getElementById('respin-slot').addEventListener('click',spin);
Promise.all([catalogue(),pools()]).then(([,p])=>{groups=p;status.textContent='READY';button.disabled=false}).catch(e=>{status.textContent='DATA UNAVAILABLE';console.error(e)});
