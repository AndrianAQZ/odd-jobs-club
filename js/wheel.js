import {catalogue,pools,profile,TIERS,rand,choose,roleUrl,aud,savedJobs,toggleSave} from './core.js';
import {unlock,wheelTick,wheelStop,jackpot} from './audio.js';
const canvas=document.getElementById('wheel-canvas'),ctx=canvas.getContext('2d');
const center=document.getElementById('spin-core'),result=document.getElementById('wheel-result'),status=document.getElementById('wheel-status');
const segments=['common','uncommon','common','rare','common','uncommon','common','epic','common','uncommon','common','rare','common','uncommon','common','legendary','common','uncommon','common','rare'];
const palette=Object.fromEntries(TIERS.map(t=>[t.key,t.colour]));
const DEG=360/segments.length;let spinAngle=0,spinning=false,grouped;
function drawWheel(){
 const R=435,inner=132,step=Math.PI*2/segments.length;
 ctx.clearRect(0,0,900,900);
 ctx.save();ctx.translate(450,450);
 for(let i=0;i<segments.length;i++){
  const start=-Math.PI/2-step/2+i*step,end=start+step;
  ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,start,end);ctx.closePath();
  ctx.fillStyle=palette[segments[i]];ctx.fill();
  ctx.strokeStyle='#0e182555';ctx.lineWidth=3;ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,start,end);ctx.closePath();
  const gleam=ctx.createRadialGradient(0,0,inner,0,0,R);
  gleam.addColorStop(0,'#ffffff0e');gleam.addColorStop(.68,'#ffffff00');gleam.addColorStop(1,'#ffffff18');
  ctx.fillStyle=gleam;ctx.fill();
 }
 ctx.beginPath();ctx.arc(0,0,R-2,0,Math.PI*2);
 ctx.strokeStyle='#eef4f4a0';ctx.lineWidth=5;ctx.stroke();
 ctx.beginPath();ctx.arc(0,0,R-21,0,Math.PI*2);
 ctx.strokeStyle='#ffffff15';ctx.lineWidth=2;ctx.stroke();
 ctx.beginPath();ctx.arc(0,0,inner,0,Math.PI*2);
 ctx.fillStyle='#101b20';ctx.fill();
 ctx.strokeStyle='#ffffff35';ctx.lineWidth=5;ctx.stroke();
 ctx.restore();
}
drawWheel();
function getAngle(){const tr=getComputedStyle(canvas).transform;if(!tr||tr==='none')return spinAngle%360;const m=new DOMMatrixReadOnly(tr);return (Math.atan2(m.b,m.a)*180/Math.PI+360)%360}
function tickDuring(startedAt,duration){let prev=null,steps=0;const step=(now)=>{
 if(!spinning)return;
 const angle=getAngle();if(prev!==null){const d=(angle-prev+360)%360;steps+=d;const stepCount=Math.floor(steps/DEG);if(stepCount>tickDuring.old){tickDuring.old=stepCount;wheelTick(Math.min(5,(now-startedAt)/duration*5))}}
 prev=angle;if(now-startedAt<duration+170)requestAnimationFrame(step);
 };tickDuring.old=0;requestAnimationFrame(step);
}
function stamp(tier,p){document.getElementById('result-tier').textContent=tier.label.toUpperCase();document.getElementById('result-tier').dataset.tier=tier.key;
 document.getElementById('result-job').textContent=p.title;document.getElementById('result-category').textContent=p.cat;
 document.getElementById('result-description').textContent=p.description;
 document.getElementById('result-pay').textContent=(p.official?'OFFICIAL MEDIAN · ':'ESTIMATE · ')+aud(p.lo)+'–'+aud(p.hi);
 document.getElementById('result-pay-note').textContent=p.official?'JSA occupation group; indicative range around reported median':p.confidence+' — not an official salary';
 document.getElementById('result-link').href=roleUrl(p.title);
 const save=document.getElementById('save-wheel');const renderSave=()=>{save.textContent=savedJobs().has(p.title)?'♥ Saved':'♡ Save'};save.onclick=()=>{toggleSave(p.title);renderSave()};renderSave();
 result.hidden=false;result.dataset.tier=tier.key;result.scrollIntoView({behavior:'smooth',block:'nearest'});
}
async function spin(){if(spinning||!grouped)return;unlock();spinning=true;center.disabled=true;result.hidden=true;status.textContent='SPINNING';center.querySelector('.spin-word').textContent='...';
 const idx=rand(segments.length),key=segments[idx],tier=TIERS.find(t=>t.key===key),duration=6800;
 const target=spinAngle+8*360+((360-idx*DEG-(spinAngle%360)+360)%360);spinAngle=target;
 canvas.style.transition='transform '+(duration/1000)+'s cubic-bezier(.11,.72,.08,1)';
 requestAnimationFrame(()=>{canvas.style.transform='rotate('+target+'deg)';tickDuring(performance.now(),duration)});
 setTimeout(async()=>{
  const title=choose(grouped[key]),p=await profile(title);
  spinning=false;center.disabled=false;center.querySelector('.spin-word').textContent='SPIN';status.textContent='READY';
  wheelStop(key);if(key==='legendary')jackpot();stamp(tier,p);
 },duration+80);
}
center.addEventListener('click',spin);
document.getElementById('replay-wheel')?.addEventListener('click',spin);
Promise.all([catalogue(),pools()]).then(([data,values])=>{
 grouped=values;const total=Object.values(values).reduce((s,x)=>s+x.length,0);
 document.getElementById('wheel-pool').textContent=total.toLocaleString('en-AU')+' CAREERS';
 document.getElementById('wheel-status').textContent='READY';center.disabled=false;
 for(const t of TIERS){const tag=document.getElementById('count-'+t.key);if(tag)tag.textContent=values[t.key].length.toLocaleString('en-AU')+' jobs'}
}).catch(e=>{status.textContent='COULD NOT LOAD JOBS';console.error(e)});
