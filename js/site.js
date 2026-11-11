import {navActive,catalogue,updateCount} from './core.js';
import {soundOn,setSound,unlock} from './audio.js';
navActive();
const sound=document.getElementById('sound-toggle');
function sync(){if(!sound)return;sound.setAttribute('aria-pressed',String(soundOn()));sound.querySelector('[data-sound-label]').textContent=soundOn()?'SOUND ON':'SOUND OFF';sound.querySelector('.sound-icon').textContent=soundOn()?'♫':'♪';sound.setAttribute('aria-label',soundOn()?'Mute sound effects':'Enable sound effects')}
if(sound){sound.addEventListener('click',()=>setSound(!soundOn()));sync();document.addEventListener('oj-sound-changed',sync)}
catalogue().then(d=>updateCount(d.jobs.length)).catch(()=>{});
document.querySelectorAll('[data-reload]').forEach(b=>b.addEventListener('click',()=>location.reload()));
