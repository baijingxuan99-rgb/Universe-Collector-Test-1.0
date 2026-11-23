// Run from repository root: node tests/v18-smoke.mjs
// Runs the isolated V18 patch with minimal stubs. Browser E2E and audio QA still required.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const patch=readFileSync('public/v18-patch.js','utf8');
const mock=`
const console={info:()=>{}};
let s={day:2,penalty:0,unlock:['candy'],familyCards:[],tab:'dream',muted:true};
let open=null,audio=null;
const items={candy:{price:3},paper:{price:4},moon:{price:5},score:{price:5}};
const memories={sugar:{n:'糖',tones:[60]},pond:{n:'水',tones:[67]},cat:{n:'猫',tones:[65]}},slotDefs=[['a','','sugar'],['b','','pond'],['c','','cat']],theme=[60,67];
const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
const dayRoll=(day,salt)=>0.1;
const needs=q=>q.reduce((o,v)=>(o[v.k]=(o[v.k]||0)+v.n,o),{candy:0,paper:0,moon:0,score:0});
const tonightQueue=()=>dayQueue(),windowOption=()=>null,b=()=>'',allFound=()=>true,say=()=>{},render=()=>{},label=k=>k;let regularDemand=()=>'';
const musicProgress=()=>s.minuet??(s.minuet={day:0});
const turcaProgress=()=>s.turca??(s.turca={index:0});
const collectFamily=k=>{if(s.familyCards.includes(k))return '';s.familyCards.push(k);return k;};
let dayQueue=()=>[{k:'candy',n:1}],openingRequirements=()=>({}),recommend=()=>({}),
minuetAction=a=>{if(a==='minuetSend')musicProgress().day++},
turcaAction=a=>{if(a==='turcaSend')turcaProgress().index++},
familyVisit=()=>{s.familyCards.push('random')},sound=()=>{},
dreamDialog=()=>'',finaleView=()=>'<div class="row"></div>',perform=()=>{},
archive=()=>'<div>紫卡来自母亲委托与小店偶遇。</div>';
`;
const checks=`
const results=[];
const check=(description,ok)=>{assert.ok(ok,description);results.push(description)};
check('locked SKU safely falls back to candy',dayQueue(2).every(v=>v.k==='candy'));
s.unlock=['candy','paper','moon','score'];
check('paper demand exists on even business days',dayQueue(2).some(v=>v.k==='paper'));
check('moon demand exists on odd business days',dayQueue(3).some(v=>v.k==='moon'));
check('score demand exists after music discovery',dayQueue(4)[0].k==='score');
check('customer tender follows item price',dayQueue(2).every(v=>v.tender>=items[v.k].price*v.n));
check('appointment HUD names paper',regularDemand(dayQueue(2)).includes('paper'));
check('appointment HUD names moon',regularDemand(dayQueue(3)).includes('moon'));
s.penalty=1;
check('shortage penalty reduces regular customer count',dayQueue(2).length===2);
s.penalty=0;s.minuet={day:1};s.turca={index:0};
minuetAction('minuetSend');check('sister card from second Paris quest',s.familyCards.includes('sister'));
turcaAction('turcaSend');check('mother card from first family quest',s.familyCards.includes('mother'));
turcaAction('turcaSend');check('father card from second family quest',s.familyCards.includes('father'));
const count=s.familyCards.length;familyVisit({served:1});
check('narrative card is not awarded by random night sales',s.familyCards.length===count);
check('album shows main quest acquisition',archive().includes('主线委托'));
return results;
`;
const results=new Function(mock+'\n'+patch+'\n'+checks)();
process.stdout.write('PASS '+results.length+' isolated V18 checks\n'+results.map(n=>'✓ '+n).join('\n')+'\n');
