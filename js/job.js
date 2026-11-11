import {catalogue,profile,aud,roleUrl,savedJobs,toggleSave} from './core.js';
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search),title=params.get('role')||params.get('title');
function label(s){return s.charAt(0).toUpperCase()+s.slice(1)}
async function init(){if(!title){location.replace('./directory.html');return}
 const d=await catalogue();if(!d.byTitle.has(title.toLowerCase())){location.replace('./directory.html');return}const p=await profile(title),tier=p.tier;
 document.title=title+' — Odd Jobs';$('crumb-title').textContent=title.toUpperCase();$('profile-title').textContent=title;
 $('profile-industry').textContent=p.cat.toUpperCase();
 $('profile-tier').textContent=tier.toUpperCase();$('profile-tier').className='tier-badge tier-'+tier;
 $('profile-desc').textContent=p.description;$('profile-desc-source').textContent=p.descriptionSource;
 $('profile-tasks').replaceChildren();for(const task of p.tasks.slice(0,5)){const li=document.createElement('li');li.textContent=task;$('profile-tasks').append(li)}
 $('profile-path').textContent=p.pathway;$('profile-context').textContent=p.context;
 $('salary-type').textContent=p.official?'OFFICIAL AUSTRALIAN GROUP MEDIAN':'MODELLED AUSTRALIAN ESTIMATE';
 $('salary-type').className='salary-kind'+(p.official?' verified':' modelled');
 $('salary-primary').textContent=aud(p.annual);$('salary-range').textContent=aud(p.lo)+' – '+aud(p.hi);
 $('salary-confidence').textContent=p.confidence;$('salary-basis').textContent=p.basis;
 const save=$('profile-save');const render=()=>save.textContent=savedJobs().has(title)?'♥ SAVED':'♡ SAVE CAREER';save.onclick=()=>{toggleSave(title);render()};render();
 const relatives=d.jobs.filter(x=>x.category===p.cat&&x.title!==title).map(x=>({x,score:proximity(x.title,title)})).sort((a,b)=>b.score-a.score).slice(0,6);
 const out=$('related-jobs');for(const {x} of relatives){const a=document.createElement('a');a.href=roleUrl(x.title);a.textContent=x.title+' ↗';out.append(a)}
}
function proximity(a,b){const t=new Set(b.toLowerCase().split(/\W+/).filter(x=>x.length>3));let count=0;for(const w of a.toLowerCase().split(/\W+/))if(t.has(w))count+=10;
 if(a[0]===b[0])count++;return count+Math.random()*.001}
init().catch(e=>{$('profile-title').textContent='Could not load this career';console.error(e)});
