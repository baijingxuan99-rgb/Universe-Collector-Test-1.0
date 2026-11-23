/* 宇宙收藏家 V18 迭代层：保留 V17 存档与场景；仅适用于同源 iframe。 */
(() => {
  'use strict';
  const old = {
    dayQueue, openingRequirements, recommend, minuetAction, turcaAction,
    familyVisit, sound, dreamDialog, finaleView, perform, archive
  };
  const familySource = {mother:'家庭画室第一委托',sister:'巴黎琴房第二委托',father:'家庭画室第二委托'};
  // P0: 恢复当日真实商品类型。未解锁的商品暂以已有星星糖填单。
  dayQueue = function(day=s.day, penalty=s.penalty) {
    const first=[{k:'candy',n:3},{k:'candy',n:1},{k:'candy',n:1},{k:'candy',n:1}];
    const grouping=dayRoll(day,1234)<.5;
    const orders=day===1?first:
      day%2===0?(grouping?[{k:'paper',n:2},{k:'candy',n:3},{k:'paper',n:1}]:
        [{k:'paper',n:2},{k:'candy',n:2},{k:'paper',n:1},{k:'candy',n:1}]):
      (grouping?[{k:'candy',n:3},{k:'moon',n:2},{k:'paper',n:1}]:
        [{k:'candy',n:2},{k:'moon',n:2},{k:'candy',n:1},{k:'paper',n:1}]);
    const active=orders.slice(0,Math.max(2,orders.length-penalty));
    const hasScore=s.unlock.includes('score')&&day>=4;
    return active.map((row,i)=>{
      const type=hasScore&&i===0?'score':s.unlock.includes(row.k)?row.k:'candy';
      const tender=items[type].price*row.n+((day===1?[1,2,3,5]:[5,3,2,1])[i%4]);
      return { ...row,k:type,tender };
    });
  };
  // Extra营业仍须备齐基础预约；普通营业不强制全预约但提示缺货。
  openingRequirements = function(queue=tonightQueue(),option=windowOption()) {
    const demand=needs(dayQueue());
    const missing=Object.keys(demand).filter(k=>demand[k]>s.shelf[k])
      .map(k=>({k,have:s.shelf[k],need:demand[k]}));
    const required=option?needs(queue)[option.key]+option.quantity:0;
    return {
      shelfShort:Math.max(0,10-sum(s.shelf)), required,missing,
      baseShort:option?missing.reduce((n,x)=>n+x.need-x.have,0):0,
      productShort:option?Math.max(0,required-s.shelf[option.key]):0,
      feeShort:option?.fee?Math.max(0,option.fee+6-s.money):0
    };
  };
  // P0: 故事核心卡改为任务固定奖励；原来已抽到的卡一概保留。
  familyVisit = () => {};
  const grant=(type)=>{if(!s.familyCards?.includes(type)){const line=collectFamily(type);if(line)say(line);}};
  const backfill=()=>{
    if((s.minuet?.day||0)>=2)grant('sister');
    if((s.turca?.index||0)>=1)grant('mother');
    if((s.turca?.index||0)>=2)grant('father');
  };
  minuetAction = function(a,k) {
    const before=musicProgress().day;
    const result=old.minuetAction(a,k);
    if(a==='minuetSend'&&before===1&&musicProgress().day===2)grant('sister');
    return result;
  };
  turcaAction = function(a,k) {
    const before=turcaProgress().index;
    const result=old.turcaAction(a,k);
    const after=turcaProgress().index;
    if(after>before&&after===1)grant('mother');
    if(after>before&&after===2)grant('father');
    return result;
  };
  // 音高轨迹和物体自身音色，仅用于场景推理。录音层以后替换。
  const voices={sugar:'sine',pond:'triangle',cat:'square'};
  const glyph=(note)=>note>=69?'▇':note>=67?'▆':note>=65?'▅':note>=64?'▄':note>=62?'▂':'▁';
  const notes=(key)=>memories[key]?.tones||[];
  const rememberSound=(sequence,voice='triangle',delay=0)=>{
    if(s.muted)return;
    try {
      audio??=new (window.AudioContext||window.webkitAudioContext)();
      audio.resume().catch(()=>{});
      const start=audio.currentTime+delay;
      sequence.forEach((n,i)=>{
        if(n===null)return;
        const o=audio.createOscillator(),g=audio.createGain(),t=start+i*.25;
        o.type=voice;
        o.frequency.value=440*Math.pow(2,(n-69)/12);
        g.gain.setValueAtTime(.001,t);
        g.gain.exponentialRampToValueAtTime(voice==='square'?.04:.095,t+.02);
        g.gain.exponentialRampToValueAtTime(.001,t+.22);
        o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.23);
      });
    }catch {}
  };
  sound = function(sequence=[72],spacing=.20) {
    const key=Object.keys(memories).find(k=>sequence===memories[k].tones);
    if(key) return rememberSound(sequence,voices[key]);
    return old.sound(sequence,spacing);
  };
  const audition=()=>{
    let delay=.05;
    for(const key of s.slots) {
      if(key){rememberSound(notes(key),voices[key],delay);delay+=notes(key).length*.25;}
      else delay+=.75;
    }
  };
  dreamDialog = function(){
    let html=old.dreamDialog();
    if(open==='piano'&&allFound()){
      const rows=slotDefs.map(([name,,key])=>
        '<p><b>'+name+' · '+memories[key].n+'</b> · 音高走向 '+notes(key).map(glyph).join(' ')+
        ' · 可点击上方道具试听</p>').join('');
      html+='<section class="notice" aria-label="道具声音研究"><h3>物件音高 · 组合草稿</h3>'+
        '<p>音高标记从低到高排列，比较旋律升降，不需要懂乐理。</p>'+rows+
        b('▶ 试听当前归位的道具乐句','v18Audition',{cls:'primary',disabled:!s.slots.some(Boolean)})+
        '</section>';
    }
    return html;
  };
  finaleView = function(){
    return old.finaleView().replace(
      '<div class="row">',
      '<div class="notice"><p>已经从物件声响拼出乐句。这里改用钢琴演奏层来呈现音乐作品，当前仍是合成音原型。</p>'+
      b('▶ 先听正式编排的钢琴旋律草稿','v18ScorePreview')+'</div><div class="row">'
    );
  };
  // 去除以随机掉落表述重要人物奖励的旧 UI。
  archive = function(){
    return old.archive().replace('紫卡来自母亲委托与小店偶遇。',
      '紫卡由巴黎琴房与家庭画室的主线委托获得，旧版本已收录的卡保留。')
      .replace(/<div class="notice"><h3>测试存档 · 下次有效营业<\/h3>[\s\S]*?<\/div>/,'');
  };
  perform = function(a,k){
    if(a==='v18Audition'){audition();return;}
    if(a==='v18ScorePreview'){rememberSound(theme,'triangle');return;}
    if(a==='testFamily'){say('V18 重要人物卡通过剧情获得，测试时请跳过对应委托。');return;}
    return old.perform(a,k);
  };
  backfill();
  if(s.tab==='archive')render();
  console.info('Universe Collector V18 overlay enabled', {shopQueue:true,storyCards:true,sourceMusic:true});
})();