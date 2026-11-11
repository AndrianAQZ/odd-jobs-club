import {catalogue,CATEGORIES,tierFor,roleUrl,savedJobs,toggleSave} from './core.js';
const $=id=>document.getElementById(id),list=$('job-list'),query=$('search'),industry=$('filter-industry'),tier=$('filter-tier');
let data,page=0,filtered=[],savedOnly=false;const PAGE=24;
for(const c of CATEGORIES){const option=document.createElement('option');option.value=c;option.textContent=c;industry.append(option)}
const params=new URLSearchParams(location.search);if(params.has('q'))query.value=params.get('q');if(params.has('tier'))tier.value=params.get('tier');if(params.has('category')&&CATEGORIES.includes(params.get('category')))industry.value=params.get('category');
function filter(){if(!data)return;const q=query.value.trim().toLowerCase(),c=industry.value,t=tier.value,saved=savedJobs();
 filtered=data.jobs.filter(x=>(!q||x.lower.includes(q))&&(!c||c==='All industries'||x.category===c)&&(!t||tierFor(x.title,data)===t)&&(!savedOnly||saved.has(x.title)));
 page=0;render()}
function render(){if(!data)return;const count=filtered.length,pages=Math.max(1,Math.ceil(count/PAGE));page=Math.min(page,pages-1);
 $('match-status').textContent=count.toLocaleString('en-AU')+' MATCHING TITLES';$('saved-total').textContent=savedJobs().size;
 $('pagination').textContent='PAGE '+(page+1)+' / '+pages;$('prev').disabled=page===0;$('next').disabled=page>=pages-1;
 list.replaceChildren();const part=filtered.slice(page*PAGE,page*PAGE+PAGE);const fragment=document.createDocumentFragment();
 for(const job of part){
  const tag=tierFor(job.title,data);const row=document.createElement('article');row.className='job-row';
  const titleLink=document.createElement('a');titleLink.href=roleUrl(job.title);titleLink.textContent=job.title;titleLink.className='row-title';
  const sector=document.createElement('span');sector.textContent=job.category;sector.className='row-sector';
  const pill=document.createElement('span');pill.className='mini-tier tier-'+tag;pill.textContent=tag.toUpperCase();
  const end=document.createElement('div');end.className='row-actions';
  const save=document.createElement('button');save.className='row-save';save.type='button';const sync=()=>{save.textContent=savedJobs().has(job.title)?'♥':'♡';save.setAttribute('aria-label',(savedJobs().has(job.title)?'Unsave ':'Save ')+job.title)};
  sync();save.onclick=()=>{toggleSave(job.title);sync();$('saved-total').textContent=savedJobs().size;if(savedOnly)filter()};
  const go=document.createElement('a');go.textContent='VIEW ↗';go.href=roleUrl(job.title);go.className='row-go';end.append(save,go);
  row.append(titleLink,sector,pill,end);fragment.append(row);
 }
 list.append(fragment);if(!part.length){const el=document.createElement('p');el.className='no-results';el.textContent='No matching occupations. Adjust your search or filters.';list.append(el)}
}
query.addEventListener('input',filter);industry.addEventListener('change',filter);tier.addEventListener('change',filter);
$('show-saved').addEventListener('click',()=>{savedOnly=!savedOnly;$('show-saved').classList.toggle('selected',savedOnly);filter()});
$('prev').addEventListener('click',()=>{page--;render();$('main').scrollIntoView({behavior:'smooth'})});
$('next').addEventListener('click',()=>{page++;render();$('main').scrollIntoView({behavior:'smooth'})});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)){e.preventDefault();query.focus()}});
catalogue().then(d=>{data=d;filtered=d.jobs.slice();filter()}).catch(e=>{$('match-status').textContent='DATA UNAVAILABLE';console.error(e)});
