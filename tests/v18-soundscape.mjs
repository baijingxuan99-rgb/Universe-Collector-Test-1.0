// Run from repository root: node tests/v18-soundscape.mjs
// Deterministic day-night strategy model; not a GUI/audio test.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

const html=readFileSync('public/lab/sound-shift.html','utf8');
const match=html.match(/ const compute=\(scene,arr,c,p\)=>\{[\s\S]*?\n \};/);
assert.ok(match,'Soundscape profit calculator exists');
const compute=new Function('return '+match[0].trim().replace(/^const compute=/,'').replace(/;$/,''))();

const cases=[
 {name:'书商来街口',rush:4,stay:1,expected:'quick'},
 {name:'画师的小展览',rush:2,stay:3,expected:'rest'},
 {name:'雨后普通夜晚',rush:3,stay:2,expected:'rest'}
];
for(const scene of cases){
 const winner={};
 for(const arrangement of ['quick','rest']){
  let best=-Infinity,stock=null;
  for(let candy=0;candy<=6;candy++){
   const paper=6-candy,result=compute(scene,arrangement,candy,paper);
   assert.ok(Number.isFinite(result.profit));
   assert.ok(result.soldC<=candy&&result.soldP<=paper);
   assert.equal(result.profit,result.sales+result.serviceTip-result.cost);
   if(result.profit>best){best=result.profit;stock={candy,paper};}
  }
  winner[arrangement]={profit:best,stock};
 }
 assert.ok(winner[scene.expected].profit>winner[scene.expected==='quick'?'rest':'quick'].profit,
  scene.name+' must reward a different arrangement');
 console.log('PASS',scene.name,JSON.stringify(winner));
}
console.log('PASS demand, stock constraints, pricing and differentiated strategy choices');
