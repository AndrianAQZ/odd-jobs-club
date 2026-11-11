// Synthesised mechanical sounds. No remote assets, no copyrighted samples.
let context,noise;
const KEY='oj-sound';
let enabled;try{enabled=localStorage.getItem(KEY)!=='off'}catch{enabled=true}
function audio(){
 if(!enabled)return null;
 try{
  context=context||new(window.AudioContext||window.webkitAudioContext)();
  if(context.state==='suspended')context.resume();
  if(!noise){noise=context.createBuffer(1,Math.round(context.sampleRate*.045),context.sampleRate);let a=noise.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
  return context;
 }catch{return null}
}
export function unlock(){audio()}
export function soundOn(){return enabled}
export function setSound(on){enabled=Boolean(on);try{localStorage.setItem(KEY,on?'on':'off')}catch{}if(enabled)unlock();document.dispatchEvent(new Event('oj-sound-changed'))}
function tone(f=660,d=.06,level=.08,type='sine',when=0){const c=audio();if(!c)return;const now=c.currentTime+when,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,now);o.frequency.exponentialRampToValueAtTime(Math.max(75,f*.78),now+d);g.gain.setValueAtTime(.001,now);g.gain.linearRampToValueAtTime(level,now+.003);g.gain.exponentialRampToValueAtTime(.001,now+d);o.connect(g).connect(c.destination);o.start(now);o.stop(now+d+.01)}
function knock(level=.06,pitch=1400){const c=audio();if(!c)return;const now=c.currentTime;const n=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();n.buffer=noise;filter.type='bandpass';filter.frequency.value=pitch;filter.Q.value=1.1;gain.gain.setValueAtTime(level,now);gain.gain.exponentialRampToValueAtTime(.001,now+.026);n.connect(filter).connect(gain).connect(c.destination);n.start(now);n.stop(now+.03)}
let prevWheelTick=0,prevReelTick=0;
export function wheelTick(slow=0){const now=performance.now();if(now-prevWheelTick<24)return;prevWheelTick=now;knock(.10,1150-slow*120);tone(570-slow*75,.022,.018,'triangle')}
export function reelTick(which=0){const now=performance.now();if(now-prevReelTick<35)return;prevReelTick=now;knock(.06,1100+which*200)}
export function reelStop(which=0){knock(.22,620+which*180);tone(180+which*45,.12,.13,'triangle');tone(660+which*80,.13,.04,'sine',.035)}
export function wheelStop(rarity='common'){knock(.20,650);const f=rarity==='legendary'?920:rarity==='epic'?760:rarity==='rare'?650:520;tone(f,.25,.09,'triangle');tone(f*1.5,.22,.045,'sine',.09)}
export function jackpot(){for(let i=0;i<7;i++){tone([523,659,784,1047,1319,1568,2093][i],.24,.1,'triangle',i*.12);tone([784,988,1175,1568,1976,2349,3136][i],.23,.045,'sine',i*.12)}}
