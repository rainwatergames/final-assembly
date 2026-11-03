/*! Final Assembly v0.3.1 ALPHA — © 2026 Rainwater Games (Jeff Rainwater). All rights reserved. */
(function(){'use strict';
const VERSION='0.3.1',SAVE='fa-save-v3';
const Q=new URLSearchParams(location.search),TEST=Q.get('test')||'';
let S=null;
function rnd(){let t=(S.rng=(S.rng+0x6D2B79F5)>>>0);t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;}
const d6=()=>1+Math.floor(rnd()*6);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const pick=a=>a[Math.floor(rnd()*a.length)];
// ---------- data ----------
const STA=[
 {k:'fus',n:'Fuselage',i:'🛢️',t:'ge',x:3,max:2},
 {k:'wing',n:'Wings',i:'🪽',t:'ge',x:7,max:2},
 {k:'tail',n:'Tail',i:'🔺',t:'odd',max:1},
 {k:'gear',n:'Gear',i:'🛞',t:'even',max:1},
 {k:'eng',n:'Engines',i:'🌀',t:'ge',x:5,max:2},
 {k:'cab',n:'Cockpit',i:'💺',t:'le',x:3,max:1}];
const AIR=[{n:'Bluebird Air',c:'#2f7de1',c2:'#ffd23f'},{n:'Crimson Pacific',c:'#d8342c',c2:'#fff'},{n:'Evergreen Jet',c:'#1f9a54',c2:'#e8f5e9'},{n:'Sunset Sky',c:'#ff8a1f',c2:'#6b2a8a'},{n:'Polar Air',c:'#3aa6d0',c2:'#163a5f'},{n:'Royal Violet',c:'#7a4bd1',c2:'#ffd23f'}];
const CARDS=[
 {k:'crew',n:'Extra Crew',c:8,i:'👷',d:'+1 crew die every week'},
 {k:'crew2',n:'Second Shift',c:11,i:'🌙',d:'+1 crew die every week'},
 {k:'wingjig',n:'Wing Jig',c:5,i:'🪽',d:'Wings need only sum 5+'},
 {k:'torque',n:'Torque Tools',c:4,i:'🔧',d:'Engines need only sum 3+'},
 {k:'crane',n:'Second Crane',c:6,i:'🏗️',d:'Tail & Gear take any die'},
 {k:'cabjig',n:'Cockpit Jig',c:4,i:'💺',d:'Cockpit takes any die'},
 {k:'paintbot',n:'Paint Robot',c:6,i:'🤖',d:'Paint takes any 1 die'},
 {k:'scanner',n:'QA Scanner',c:6,i:'🔍',d:'QA: any die stamps every jet'},
 {k:'cup',n:'Dice Cup',c:5,i:'🥤',d:'1 free reroll every week'},
 {k:'airline',n:'Airline Contract',c:6,i:'🤝',d:'Every sale pays +$3'},
 {k:'hall',n:'Union Hall',c:4,i:'✊',d:'+2 Pushbacks; breaks rest 1 more worker'}];
const EVENTS=[
 {k:'quiet',n:'Quiet week',i:'☀️',d:'Nothing new. Enjoy it.',w:4},
 {k:'payday',n:'Progress payment',i:'💵',d:'+$3 from the airline',w:2},
 {k:'pizza',n:'Pizza Friday',i:'🍕',d:'Union break rests 1 extra worker',w:2},
 {k:'rush',n:'Airline rush',i:'📈',d:'Sales pay +$4 this week',w:2},
 {k:'skies',n:'Clear skies',i:'🌤️',d:'Test flights take any die',w:2},
 {k:'picnic',n:'Union picnic',i:'🧺',d:'+1 Union Pushback',w:1},
 {k:'faa',n:'FAA visit',i:'📋',d:'QA needs 4+ this week',w:1}];
const TWISTS=[{k:'kudos',i:'🙌',n:'Shout-out',d:'+$2 now'},{k:'huddle',i:'🎲',n:'Huddle',d:'1 free reroll this week'},{k:'buddy',i:'🤝',n:'Buddy system',d:'Union break comes 2 placements sooner'},{k:'safe',i:'⛑️',n:'Safety star',d:'+1 Union Pushback'},{k:'focus',i:'🎨',n:'Paint focus',d:'Paint takes any 1 die this week'}];
const SCEN={q4:{n:'Q4 Push',weeks:12,qpw:12,quota:{easy:6,normal:7,hard:7}},
 annual:{n:'Annual Plan',weeks:24,qpw:6,quota:{easy:[3,3,4,4],normal:[3,4,4,5],hard:[3,4,4,4]}}};
const DIFF={easy:{crew:6,qa:2,money:4,mgr:.25,brk:3},normal:{crew:5,qa:3,money:3,mgr:.4,brk:4},hard:{crew:5,qa:4,money:1,mgr:.8,brk:6}};
const MONTHS=['Oct','Nov','Dec'];
const MGR_LINES=['Let\'s circle back','Any blockers?','Safety moment','Anyone have any conflicts?'];
const BUBS=['Synergy!','Quick sync…','Per my last email','Let\'s take this offline','Touch base!','Move the needle!','Low-hanging fruit','Can everyone see my screen?','You\'re on mute','Let\'s level-set','Parking lot that'];
const TIPS=['Lift with your legs, not your back. Your back has a long career ahead.','Safety glasses go on your face, not on top of your head like a sports car spoiler.','Clean as you go. FOD stands for Foreign Object Debris, not "Found On the Deck… whatever".','Count your tools out and count them back in. Wrenches do not belong in wings.','Hearing protection in the rivet bay. "WHAT?" is not a safety plan.','Don\'t walk under a suspended load. The crane is good, but gravity is undefeated.','Ladders: three points of contact. Your coffee cup is not a point of contact.','Lock out, tag out. If it\'s not your lock, it\'s not your machine.','Report near misses. A near miss is just a hit that ran out of luck.','Hydrate! Your body is 60% water and 40% traveled work.','Keep walkways clear. The forklift can\'t read your mind.','Gloves near rotating tools are a no-go. The drill wins every time.','Watch your head under the wing. The wing has never lost that fight.','If you see something, say something. If you drop something, PICK IT UP.','Know where the eyewash station is BEFORE you need it.','Stretch before shift. Hamstrings don\'t care about schedule pressure.','Never use compressed air to dust yourself off. You are not a workbench.','Torque to spec, not to "feels about right".','Sealant fumes are not a personality. Ventilate.','Don\'t ride the tug unless you\'re the tug driver.','Sharp edges on fresh-cut skin panels: deburr before you be-hurt.','Hard hats under the crane, even if it messes up your hair.','One person per stand rung. Ladders are not group activities.','Fire extinguisher check: P.A.S.S. — Pull, Aim, Squeeze, Sweep.'];
const STK=[{k:'wctno',t:'WE COWER TO NO ONE',c:'#d8342c'},{k:'fodfree',t:'FOD FREE ZONE',c:'#43c45d'},{k:'torque',t:'TORQUE IT TO SPEC',c:'#2f7de1'},{k:'union',t:'UNION STRONG',c:'#ff8a1f'},{k:'second',t:'SECOND SHIFT LEGEND',c:'#7a4bd1'},{k:'email',t:'THIS MEETING COULD HAVE BEEN AN EMAIL',c:'#5bc0de'},{k:'rivet',t:'RIVET ROYALTY',c:'#f4b400'},{k:'buyoff',t:'BOUGHT OFF FIRST TIME',c:'#1f9a54'}];
const ACH=[{k:'wctno',n:'We Cower to No One',d:'Send the manager packing with a Union Pushback.'},{k:'stk1',n:'Toolbox Detective',d:'Find a hidden toolbox sticker.'},{k:'stkall',n:'Sticker Bomber',d:'Collect all '+STK.length+' stickers.'},{k:'first',n:'First Delivery',d:'Sell a jet on the Flight Line.'},{k:'two',n:'Double Delivery',d:'Sell 2 jets in one week.'},{k:'quota',n:'Made Schedule',d:'Meet a quota.'},{k:'clean',n:'Gold Star Plant',d:'Finish with 3 stars.'}];
const LOCS=[...STA.map(s=>s.k),'qa','paint','flight'];
const LOCN={qa:'QA Buy-off',paint:'Paint Hangar',flight:'Flight Line'};
function locName(k){const s=STA.find(x=>x.k===k);return s?s.n:LOCN[k]||k;}
let UI={screen:'title',sel:null,diff:'normal',scen:'q4',coach:-1,modal:null,busy:0,fx:null,
 su:localStorage.getItem('fa-su')==='1',noAnim:localStorage.getItem('fa-noanim')==='1',noSave:false};
window.__FA=UI;
function getL(k){try{return JSON.parse(localStorage.getItem(k)||'[]');}catch(e){return[];}}
function ach(k){if(UI.noSave)return;const a=getL('fa-ach');if(a.includes(k))return;a.push(k);try{localStorage.setItem('fa-ach',JSON.stringify(a));}catch(e){}const x=ACH.find(x=>x.k===k);setTimeout(()=>toast('🏆 '+x.n),900);}
// ---------- game ----------
const SC=()=>SCEN[S.scen];
function has(k){return S.owned.includes(k);}
function quotaTotal(){const q=SC().quota[S.diff];return Array.isArray(q)?q.reduce((a,b)=>a+b,0):q;}
function qOf(w){return Math.floor((w-1)/SC().qpw);}
function qQuota(q){const x=SC().quota[S.diff];return Array.isArray(x)?x[q]:x;}
function weekLabel(w){return S.scen==='q4'?MONTHS[Math.floor((w-1)/4)]+' · Wk '+w+'/12':'Q'+(qOf(w)+1)+' · Wk '+w+'/24';}
function evOn(k){return S.ev===k;}
function log(t){S.log.unshift(t);S.log.length=Math.min(S.log.length,12);}
function newJet(st){const j={id:++S.next,air:(S.next-1)%AIR.length,st,done:[0,0,0,0,0,0],needQA:0,painted:0};for(let i=0;i<st;i++)j.done[i]=1;j.needQA=st>0?1:0;S.jets.push(j);return j;}
function newGame(o){
 const seed=o.seed!=null?o.seed:(Date.now()%1e9);
 S={v:VERSION,rng:seed>>>0,seed,diff:o.diff||'normal',scen:o.scen||'q4',daily:o.daily||0,test:o.test||'',week:0,money:DIFF[o.diff||'normal'].money,delivered:0,qDel:[0,0,0,0],
  jets:[],next:0,dice:[],pl:{},owned:[],deck:[],market:[],push:1,mgr:null,mgrNext:null,mgrBlk:0,stk:null,placedN:0,brkAt:4,brkDone:0,paintAcc:0,ev:'quiet',flags:{},log:[],over:0,phase:'roll',soldWk:0,stw:0,recap:null};
 for(let st=4;st>=0;st--)newJet(st);
 S.deck=shuffle(CARDS.map(c=>c.k));S.market=S.deck.splice(0,3);
 UNDO.length=0;startWeek();}
function crewN(){return DIFF[S.diff].crew+(has('crew')?1:0)+(has('crew2')?1:0);}
function drawEvent(){const tot=EVENTS.reduce((a,e)=>a+e.w,0);let r=rnd()*tot;for(const e of EVENTS){r-=e.w;if(r<0)return e.k;}return'quiet';}
function mgrSpots(){return[...STA.map(s=>s.k),'qa','paint'];}
function startWeek(){
 S.week++;S.pl={};LOCS.forEach(k=>S.pl[k]=[]);S.placedN=0;S.brkDone=0;S.paintAcc=0;S.flags={};S.mgrBlk=0;S.soldWk=0;S.suDone=0;
 S.mgr=S.mgrNext;S.mgrNext=(S.week<SC().weeks&&rnd()<DIFF[S.diff].mgr)?pick(mgrSpots()):null;
 S.ev=S.week===1?'quiet':drawEvent();
 if(evOn('payday'))S.money+=3;if(evOn('picnic'))S.push=Math.min(3,S.push+1);
 S.brkAt=DIFF[S.diff].brk;
 const own=getL('fa-stk'),left=STK.filter(s=>!own.includes(s.k));
 S.stk=null;if(left.length&&(rnd()<.35||S.test==='stickers'))S.stk={loc:pick(LOCS),k:pick(left).k};
 const n=crewN();S.dice=[];for(let i=0;i<n;i++)S.dice.push({id:i,v:1,loc:null});S.dice.push({id:99,v:6,loc:null,stw:1});
 S.phase='roll';
 S.tip=pick(TIPS);const req=MGR_LINES.filter(x=>x!=='Safety moment');S.bubs=shuffle([...req,pick(BUBS)]);
 const tw=shuffle(TWISTS.map(t=>t.k));S.twists=tw.slice(0,2);}
function roll(ids){S.dice.forEach(d=>{if(!ids||ids.includes(d.id))d.v=d6();});S.phase='place';}
function jetAt(i){return S.jets.find(j=>j.st===i);}
const hangar=()=>S.jets.filter(j=>j.st==='paint'),flightJets=()=>S.jets.filter(j=>j.st==='flight');
function needQAJets(){return S.jets.filter(j=>j.st!=='done'&&j.needQA).sort((a,b)=>rank(b)-rank(a));}
function rank(j){return j.st==='flight'?9:j.st==='paint'?8:j.st;}
function req(i){const s=STA[i];
 if(s.k==='wing'&&has('wingjig'))return{t:'ge',x:5,max:2};
 if(s.k==='eng'&&has('torque'))return{t:'ge',x:3,max:2};
 if((s.k==='tail'||s.k==='gear')&&has('crane'))return{t:'any',max:1};
 if(s.k==='cab'&&has('cabjig'))return{t:'any',max:1};
 return s;}
function reqTxt(r){return r.t==='ge'?(r.x<=6?'sum '+r.x+'+':'2 dice, sum '+r.x+'+'):r.t==='odd'?'odd':r.t==='even'?'even':r.t==='le'?'1–'+r.x:'any';}
function passR(r,vals){const sum=vals.reduce((a,b)=>a+b,0);
 if(r.t==='ge')return sum>=r.x;if(r.t==='odd')return vals.length===1&&vals[0]%2===1;if(r.t==='even')return vals.length===1&&vals[0]%2===0;if(r.t==='le')return vals.length===1&&vals[0]<=r.x;return vals.length===1;}
const dv=id=>S.dice.find(d=>d.id===id).v;
function qaT(){return evOn('faa')?4:DIFF[S.diff].qa;}
function paintAny(){return has('paintbot')||S.flags.paintAny;}
function flightMin(){return evOn('skies')?1:2;}
function canPlace(d,loc){
 if(!d||d.loc!=null)return'That worker is busy.';if(S.phase!=='place')return'Roll the crew first.';
 if(S.mgr===loc&&!S.mgrBlk)return'👔 The manager is hovering here. Use ✊ Pushback.';
 const si=STA.findIndex(s=>s.k===loc);
 if(si>=0){const j=jetAt(si);if(!j)return'No jet here yet.';if(j.done[si])return'Done ✓';const r=req(si),cur=S.pl[loc].map(dv);if(cur.length>=r.max)return'Full.';
  const vals=[...cur,d.v];if(passR(r,vals))return'';if(r.t==='ge'&&vals.length<r.max)return'';return'Needs '+reqTxt(r)+'.';}
 if(loc==='qa'){if(!needQAJets().length)return'Nothing needs QA.';if(S.pl.qa.length>=2)return'QA is full.';if(!has('scanner')&&d.v<qaT())return'QA needs '+qaT()+'+.';return'';}
 if(loc==='paint'){if(!hangar().length)return'No jet in the Paint Hangar.';if(S.pl.paint.length>=4)return'Full.';return'';}
 if(loc==='flight'){if(!flightJets().length)return'No jet on the Flight Line.';if(!flightJets().some(j=>!j.needQA))return'Needs a 🔍 QA stamp first.';if(d.v<flightMin())return'Test pilot needs '+flightMin()+'+.';return'';}
 return'?';}
const UNDO=[];
function snap(){UNDO.push(JSON.stringify(S));if(UNDO.length>60)UNDO.shift();}
function place(id,loc){
 const d=S.dice.find(x=>x.id===id);const why=canPlace(d,loc);if(why){msg(why);sfx('bad');return false;}
 snap();d.loc=loc;S.pl[loc].push(id);S.placedN++;
 const si=STA.findIndex(s=>s.k===loc);
 if(si>=0){const j=jetAt(si);if(passR(req(si),S.pl[loc].map(dv))){j.done[si]=1;j.needQA=1;sfx('work');fx('done',loc);}else sfx('place');}
 else if(loc==='qa'){const n=has('scanner')?99:(d.v>=5?3:d.v>=3?2:1);const js=needQAJets().slice(0,n);js.forEach(j=>j.needQA=0);sfx('pass');toast('🔍 QA stamped '+js.length+' jet'+(js.length>1?'s':''));}
 else if(loc==='paint'){S.paintAcc+=d.v;if(paintAny()||S.paintAcc>=4){const j=hangar()[0];j.painted=1;j.st='flight';S.paintAcc=0;sfx('work');toast('🎨 Painted in '+AIR[j.air].n+' colors!');}else sfx('place');}
 else if(loc==='flight'){sell(flightJets().find(j=>!j.needQA));}
 breakCheck();UI.sel=null;save();render();return true;}
function sell(j){j.st='done';S.delivered++;S.qDel[qOf(S.week)]++;S.soldWk++;let cash=8+(has('airline')?3:0)+(evOn('rush')?4:0);S.money+=cash;
 UI.fx={cash};sfx('cash');ach('first');if(S.soldWk>=2)ach('two');log('✈️ Sold '+AIR[j.air].n+' jet #'+j.id+' for $'+cash);}
function breakCheck(){if(S.brkDone||S.placedN<S.brkAt)return;S.brkDone=1;const n=1+(has('hall')?1:0)+(evOn('pizza')?1:0);
 const idle=S.dice.filter(d=>d.loc==null&&!d.stw&&d.v<6).sort((a,b)=>a.v-b.v).slice(0,n);
 idle.forEach(d=>{d.v=Math.min(6,d.v+2);d.rested=1;});UI.fx=Object.assign(UI.fx||{},{rest:idle.map(d=>d.id)});
 if(idle.length){toast('☕ Union break! '+idle.length+' rested worker'+(idle.length>1?'s':'')+' +2');sfx('pass');}}
function pushback(){if(!S.mgr||S.mgrBlk||S.push<1)return;snap();S.push--;S.mgrBlk=1;ach('wctno');toast('✊ We cower to no one! Manager heads back to his office.');sfx('pass');save();render();}
function collectStk(){if(!S.stk)return;const k=S.stk.k;S.stk=null;const own=getL('fa-stk');if(!own.includes(k))own.push(k);try{localStorage.setItem('fa-stk',JSON.stringify(own));}catch(e){}
 S.push=Math.min(3,S.push+1);const s=STK.find(x=>x.k===k);toast('🏷️ Sticker: "'+s.t+'" · +1 ✊');sfx('sale');ach('stk1');if(own.length>=STK.length)ach('stkall');save();render();}
function setStw(v){const d=S.dice.find(x=>x.stw);if(!d||S.flags.stw||d.loc!=null)return;snap();d.v=v;S.flags.stw=1;S.stw++;UI.sel=null;sfx('place');save();render();}
function rerollsLeft(){return(has('cup')?1:0)+(S.flags.huddle?1:0)-(S.flags.rr||0);}
function reroll(id){const d=S.dice.find(x=>x.id===id);if(!d||d.loc!=null||rerollsLeft()<1)return;snap();S.flags.rr=(S.flags.rr||0)+1;d.v=d6();UI.sel=null;save();animRoll([id]);}
function buy(k){const c=CARDS.find(c=>c.k===k);if(S.money<c.c)return msg('Not enough cash yet.');snap();S.money-=c.c;S.owned.push(k);const i=S.market.indexOf(k);S.market.splice(i,1);if(S.deck.length)S.market.splice(i,0,S.deck.shift());
 if(k==='hall')S.push=Math.min(5,S.push+2);log('🛠️ Bought '+c.n);sfx('sale');save();}
function applyTwist(k){S.suDone=1;if(!k)return;if(k==='kudos')S.money+=2;if(k==='huddle')S.flags.huddle=1;if(k==='buddy')S.brkAt=Math.max(1,S.brkAt-2);if(k==='safe')S.push=Math.min(5,S.push+1);if(k==='focus')S.flags.paintAny=1;S.twist=k;}
function lineMove(){let moved=0,out=0;
 for(let i=5;i>=0;i--){const j=jetAt(i);if(!j||!j.done[i])continue;if(i===5){j.st='paint';moved++;out++;}else if(!jetAt(i+1)){j.st=i+1;moved++;}}
 let nj=0;if(!jetAt(0)){newJet(0);nj=1;}return{moved,out,nj};}
function endWeek(){const r=lineMove();S.lastMove=r;const w=S.week;
 if(S.scen==='annual'&&w%SC().qpw===0){const q=qOf(w);S.recap={q,del:S.qDel[q],quota:qQuota(q),ytd:S.delivered,cash:S.money,up:S.owned.length,last:w>=SC().weeks};}
 if(w>=SC().weeks){finish();return r;}
 startWeek();return r;}
function finish(){const qt=quotaTotal(),met=S.delivered>=qt,ex=S.delivered-qt;const stars=met?1+(ex>=1?1:0)+(ex>=3?1:0):0;
 S.over=1;S.result={met,stars,qt};if(met)ach('quota');if(stars===3)ach('clean');
 if(!UI.noSave){try{const b=JSON.parse(localStorage.getItem('fa-best')||'{}'),k=S.scen+'-'+S.diff;if(!b[k]||S.delivered>b[k])b[k]=S.delivered;localStorage.setItem('fa-best',JSON.stringify(b));}catch(e){}}
 try{if(!UI.noSave)localStorage.removeItem(SAVE);}catch(e){}}
function undo(){if(!UNDO.length)return;S=JSON.parse(UNDO.pop());UI.sel=null;sfx('place');save();render();}
// ---------- bot ----------
const BOTPRI=['crew','wingjig','scanner','paintbot','crane','crew2','torque','cabjig','airline','hall','cup'];
function botNeeds(){const o=[];
 if(flightJets().some(j=>!j.needQA))o.push({loc:'flight',min:flightMin()});
 if([...flightJets(),...hangar()].some(j=>j.needQA)||(jetAt(5)&&jetAt(5).done[5]&&jetAt(5).needQA&&S.week>=SC().weeks-1))o.push({loc:'qa'});
 if(hangar().length)o.push({loc:'paint'});
 for(let i=5;i>=0;i--){const j=jetAt(i);if(j&&!j.done[i])o.push({loc:STA[i].k,si:i});}return o;}
function botTry(n){const free=S.dice.filter(d=>d.loc==null&&!(d.stw&&!S.flags.stw)).sort((a,b)=>a.v-b.v);const stw=S.dice.find(d=>d.stw&&d.loc==null&&!S.flags.stw);
 if(S.mgr===n.loc&&!S.mgrBlk)return false;
 const ok=d=>!canPlace(d,n.loc);
 const single=free.find(d=>{if(!ok(d))return false;if(n.si!=null){return passR(req(n.si),[...S.pl[n.loc].map(dv),d.v]);}if(n.loc==='paint')return paintAny()||S.paintAcc+d.v>=4;return true;});
 if(single){place(single.id,n.loc);return true;}
 if(n.si!=null&&req(n.si).t==='ge'&&S.pl[n.loc].length===0){const x=req(n.si).x;for(let a=0;a<free.length;a++)for(let b=a+1;b<free.length;b++)if(free[a].v+free[b].v>=x){place(free[a].id,n.loc);place(free[b].id,n.loc);return true;}}
 if(n.loc==='paint'&&!S.pl.paint.length){for(let a=0;a<free.length;a++)for(let b=a+1;b<free.length;b++)if(free[a].v+free[b].v>=4){place(free[a].id,'paint');place(free[b].id,'paint');return true;}}
 if(stw){const need=n.si!=null?req(n.si):null;let v=6;if(need){if(need.t==='odd')v=5;else if(need.t==='even')v=6;else if(need.t==='le')v=1;}
  S.dice.find(d=>d.stw).v=v;S.flags.stw=1;S.stw++;if(!canPlace(stw,n.loc)){place(stw.id,n.loc);if(n.si!=null&&!jetAt(n.si).done[n.si]){const f2=S.dice.filter(d=>d.loc==null&&!d.stw).sort((a,b)=>a.v-b.v).find(d=>!canPlace(d,n.loc));if(f2)place(f2.id,n.loc);}return true;}S.flags.stw=0;S.stw--;}
 return false;}
function botWeek(){if(!S.suDone&&UI.su)applyTwist(S.twists[0]);if(S.phase==='roll')roll();
 if(SC().weeks-S.week>=2)for(const k of BOTPRI){const c=CARDS.find(c=>c.k===k);if(S.market.includes(k)&&S.money>=c.c)buy(k);}
 if(S.mgr&&!S.mgrBlk&&S.push>0)pushback();
 let g=0;while(g++<40){let did=false;for(const n of botNeeds()){if(botTry(n)){did=true;break;}}if(!did)break;}
 endWeek();}
function botGame(diff,scen,seed){newGame({diff,scen,seed});let g=0;while(!S.over&&g++<60)botWeek();return{delivered:S.delivered,met:S.result.met,stars:S.result.stars,quota:quotaTotal(),stops:0,stw:S.stw};}
// ---------- audio ----------
let AC=null,MG=null,muted=localStorage.getItem('fa-mute')==='1',musicOn=false;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=muted?0:1;MG.connect(AC.destination);}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC;}
function tone(f,t0,dur,type,vol,f2){const a=AC;const o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+dur);
 g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(vol||.2,t0+.01);g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);o.connect(g);g.connect(MG);o.start(t0);o.stop(t0+dur+.05);}
function noise(t0,dur,vol,hp){const a=AC;const b=a.createBuffer(1,Math.max(1,a.sampleRate*dur|0),a.sampleRate),c=b.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=(Math.random()*2-1)*(1-i/c.length);
 const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type='highpass';f.frequency.value=hp||1500;const g=a.createGain();g.gain.value=vol||.2;s.connect(f);f.connect(g);g.connect(MG);s.start(t0);}
function sfx(k){if(UI.noSave||!ac()||muted)return;const t=AC.currentTime;
 if(k==='rattle'){for(let i=0;i<16;i++)noise(t+i*.055+Math.random()*.03,.03,.22,2200+Math.random()*1500);}
 else if(k==='clack'){noise(t,.025,.3,1800);tone(420+Math.random()*80,t,.04,'square',.05);}
 else if(k==='place'){tone(520,t,.07,'triangle',.16);noise(t,.03,.12,3000);}
 else if(k==='work'){tone(180,t,.08,'square',.1);tone(240,t+.09,.08,'square',.1);noise(t,.05,.18,800);}
 else if(k==='pass'){tone(660,t,.12,'sine',.18);tone(990,t+.1,.2,'sine',.18);}
 else if(k==='bad'){tone(220,t,.12,'triangle',.08,180);}
 else if(k==='move'){tone(110,t,.5,'sawtooth',.08,80);for(let i=0;i<4;i++)noise(t+.12*i,.05,.2,400);}
 else if(k==='cash'){noise(t,.08,.25,3000);tone(1318,t+.05,.5,'triangle',.18);tone(1760,t+.12,.6,'sine',.16);tone(2637,t+.12,.4,'sine',.06);[0,.06,.12,.18].forEach(x=>noise(t+.25+x,.03,.12,5000));}
 else if(k==='sale'){[523,659,784,1046].forEach((f,i)=>tone(f,t+i*.09,.22,'triangle',.15));}
 else if(k==='meet'){[400,420,380,440].forEach((f,i)=>tone(f,t+i*.16,.14,'triangle',.07));}}
let musT=null;function music(on){musicOn=on;if(!on||!ac()){clearInterval(musT);musT=null;return;}if(musT)return;let step=0;const ch=[[110,165,220],[98,147,196],[87,131,175],[98,147,196]];
 musT=setInterval(()=>{if(muted||document.hidden)return;const t=AC.currentTime+.05;const c=ch[Math.floor(step/16)%4];if(step%16===0)c.forEach(f=>tone(f,t,3.6,'triangle',.02));if(step%4===0)noise(t,.05,.04,200);if(step%8===6)tone(c[2]*2,t,.12,'square',.01);step++;},230);}
// ---------- save ----------
function save(){if(UI.noSave||!S)return;try{localStorage.setItem(SAVE,JSON.stringify(S));}catch(e){}}
function load(){try{const j=JSON.parse(localStorage.getItem(SAVE));if(j&&j.v===VERSION&&!j.over)return j;}catch(e){}return null;}
// ---------- render helpers ----------
const $=s=>document.querySelector(s),app=$('#app');
const PIPS={1:[5],2:[1,9],3:[1,5,9],4:[1,3,7,9],5:[1,3,5,7,9],6:[1,3,4,6,7,9]};
function pipsH(v){let h='';for(let i=1;i<=9;i++)if(PIPS[v].includes(i))h+='<i style="grid-area:'+Math.ceil(i/3)+'/'+((i-1)%3+1)+'"></i>';return h;}
function dieH(d,cls){return'<button class="die'+(d.stw?' stw':'')+(d.rested?' rested':'')+(cls?' '+cls:'')+'" data-die="'+d.id+'" aria-label="'+(d.stw?'Union Steward die ':'die ')+d.v+'">'+pipsH(d.v)+(d.stw?'<b class="mk">✊</b>':'')+(d.rested?'<b class="mk r">☕</b>':'')+'</button>';}
function planeSVG(j,w){const D=j.done,a=AIR[j.air],paint=j.painted;const body=paint?'#fbfcfd':'#9fb59a',acc=paint?a.c:'#86a07f',ln='#3c4a3a';
 const ghost='fill="none" stroke="#8a7a5e" stroke-dasharray="3 2"';const W=w||118;
 let s='<svg class="plane" viewBox="0 0 160 60" width="'+W+'" height="'+(W*.37|0)+'">';
 const fus='M10 30 Q14 22 26 22 L130 22 Q150 22 156 30 Q150 38 130 38 L26 38 Q14 38 10 30Z';
 s+=D[0]?'<path d="'+fus+'" fill="'+body+'" stroke="'+ln+'"/>':'<path d="'+fus+'" '+ghost+'/>';
 if(paint)s+='<path d="M20 31 L140 31 L136 35 L20 35Z" fill="'+a.c+'"/><rect x="20" y="35" width="110" height="1.6" fill="'+a.c2+'"/>';
 s+=D[1]?'<path d="M62 30 L96 30 L74 54 L64 54Z" fill="'+acc+'" stroke="'+ln+'"/>':'<path d="M62 30 L96 30 L74 54 L64 54Z" '+ghost+'/>';
 s+=D[2]?'<path d="M14 24 L6 4 L18 4 L34 23Z" fill="'+acc+'" stroke="'+ln+'"/>':'<path d="M14 24 L6 4 L18 4 L34 23Z" '+ghost+'/>';
 s+=D[3]?'<g><rect x="40" y="38" width="2" height="12" fill="#555"/><circle cx="41" cy="52" r="4" fill="#222"/><rect x="120" y="38" width="2" height="12" fill="#555"/><circle cx="121" cy="52" r="4" fill="#222"/></g>':'<circle cx="41" cy="52" r="4" '+ghost+'/><circle cx="121" cy="52" r="4" '+ghost+'/>';
 s+=D[4]?'<rect x="72" y="40" width="24" height="9" rx="4" fill="#8d97a1" stroke="#333"/><circle cx="95" cy="44.5" r="3.5" fill="#222"/>':'<rect x="72" y="40" width="24" height="9" rx="4" '+ghost+'/>';
 if(D[5]){s+='<path d="M140 25 L150 28 L142 29Z" fill="#1b3a5a"/>';for(let x=36;x<130;x+=9)s+='<rect x="'+x+'" y="25" width="4" height="4" rx="1" fill="#1b3a5a"/>';}
 return s+'</svg>';}
function jetStatus(j){if(j.st==='done')return['Delivered','✅'];if(j.st==='flight')return['Flight Line','✈️'];if(j.st==='paint')return['Paint Hangar','🎨'];return['Station '+(j.st+1)+'/6','🏭'];}
function jetProg(j){if(j.st==='done')return 100;return Math.round((j.done.reduce((a,b)=>a+b,0)+(j.painted?1:0))/8*100);}
function jetsH(){const act=S.jets.filter(j=>j.st!=='done').sort((a,b)=>rank(b)-rank(a));
 return'<div class="jets" id="jets">'+act.map(j=>{const [st,ic]=jetStatus(j);
  return'<div class="jc'+(j.st==='flight'?' fl':j.st==='paint'?' ph':'')+'"><div class="jt">'+planeSVG(j,84)+'</div><div class="jn"><b>#'+j.id+'</b> '+AIR[j.air].n+'</div><div class="js">'+ic+' '+st+'</div><div class="bar"><i style="width:'+jetProg(j)+'%"></i></div>'+
  (j.needQA?'<span class="qab">🔍 needs QA</span>':'<span class="qok">✔ QA ok</span>')+'</div>';}).join('')+
  '<div class="jc del"><div class="dn">'+S.delivered+'</div><div class="js">✅ delivered</div></div></div>';}
function hud(){return'<div class="hud"><div class="cash" id="cash"><span class="coin">$</span><b>'+S.money+'</b></div>'+
 '<div class="wk"><b>'+weekLabel(S.week)+'</b><span>'+SC().n+' · '+S.diff+'</span></div>'+
 '<div class="goal"><b>'+S.delivered+'<small>/'+quotaTotal()+'</small></b><span>jets delivered'+(S.scen==='annual'?' · Q'+(qOf(S.week)+1)+': '+S.qDel[qOf(S.week)]+'/'+qQuota(qOf(S.week)):'')+'</span></div></div>';}
function chipsH(){const e=EVENTS.find(x=>x.k===S.ev);let m='';
 if(S.mgr&&!S.mgrBlk)m='<div class="chip mg">👔 Manager hovering at <b>'+locName(S.mgr)+'</b> (spot closed)<button class="pb" data-push'+(S.push<1?' disabled':'')+'>✊ Pushback ×'+S.push+'</button></div>';
 else m='<div class="chip ok">👔 '+(S.mgrBlk?'Sent packing! ✊':'Manager in his office')+(S.mgrNext?' · next week: <b>'+locName(S.mgrNext)+'</b>':'')+'<span class="pt">✊×'+S.push+'</span></div>';
 const left=Math.max(0,S.brkAt-S.placedN);
 const b='<div class="chip br">☕ Union break '+(S.brkDone?'done — crew rested!':'in <b>'+left+'</b> placement'+(left===1?'':'s')+' · rested workers +2')+'</div>';
 return'<div class="chips"><div class="chip ev">'+e.i+' <b>'+e.n+'</b> · '+e.d+'</div>'+m+b+'</div>';}
function trayH(){const idle=S.dice.filter(d=>d.loc==null),sel=UI.sel!=null?S.dice.find(d=>d.id===UI.sel):null;
 let h='<div class="tray" id="tray"><div class="felt"><div class="dice">';
 if(S.phase==='roll')h+=idle.map(d=>dieH(d,'cup')).join('');else h+=idle.map(d=>dieH(d,UI.sel===d.id?'sel':'')).join('')||'<span class="none">All crew working 👍</span>';
 h+='</div></div><div class="acts">';
 if(S.phase==='roll')h+='<button class="big rollb" data-roll>🎲 Roll crew</button>';
 else{
  if(sel&&sel.stw&&!S.flags.stw)h+='<div class="pick">✊ Steward sets:'+[1,2,3,4,5,6].map(v=>'<button data-stwv="'+v+'">'+v+'</button>').join('')+'</div>';
  if(sel&&rerollsLeft()>0)h+='<button class="tb" data-rr>🎲 Reroll ('+rerollsLeft()+')</button>';
  h+='<button class="tb" data-undo'+(UNDO.length?'':' disabled')+'>↶ Undo</button><button class="tb end" data-end>End Week ▶</button>';}
 return h+'</div>'+(UI.msg?'<div class="msg">'+UI.msg+'</div>':'')+'</div>';}
function tgt(loc){const d=UI.sel!=null?S.dice.find(x=>x.id===UI.sel):null;return d&&!canPlace(d,loc)?' tgt':'';}
function slotsH(loc,cap){const ds=S.pl[loc].map(id=>dieH(S.dice.find(d=>d.id===id),'sm'));let h=ds.join('');for(let i=ds.length;i<cap;i++)h+='<span class="slot"></span>';return'<div class="slots">'+h+'</div>';}
function extrasH(loc){let h='';if(S.mgr===loc&&!S.mgrBlk)h+='<div class="pawn" title="Manager">👔</div>';
 h+=S.stk&&S.stk.loc===loc?'<button class="tbx has" data-stk title="Toolbox">🧰<i style="background:'+STK.find(s=>s.k===S.stk.k).c+'"></i></button>':'<span class="tbx">🧰</span>';return h;}
function boardH(){let h='<div class="board"><div class="lineh">🏭 Final Assembly Line <span>jets move right when their station is done</span></div><div class="line">';
 STA.forEach((s,i)=>{const j=jetAt(i),r=req(i),dn=j&&j.done[i];
  h+='<div class="sp st'+tgt(s.k)+(dn?' dn':'')+(S.mgr===s.k&&!S.mgrBlk?' mgr':'')+'" data-loc="'+s.k+'"><div class="sph"><span class="num">'+(i+1)+'</span>'+s.i+' '+s.n+'</div><div class="req">'+reqTxt(r)+'</div>'+
  '<div class="tok">'+(j?planeSVG(j,92):'<span class="empty">—</span>')+'</div>'+(dn?'<div class="chk">✓</div>':slotsH(s.k,j?r.max:0))+extrasH(s.k)+'</div>';});
 h+='</div><div class="fin">';
 const hg=hangar(),fl=flightJets();
 h+='<div class="sp qa'+tgt('qa')+(S.mgr==='qa'&&!S.mgrBlk?' mgr':'')+'" data-loc="qa"><div class="sph">🔍 QA Buy-off</div><div class="req">'+(has('scanner')?'any die · all jets':qaT()+'+ · stamps 1–3 jets')+'</div><div class="mini">'+needQAJets().length+' jet(s) need QA</div>'+slotsH('qa',2)+extrasH('qa')+'</div>';
 h+='<div class="sp ph'+tgt('paint')+(S.mgr==='paint'&&!S.mgrBlk?' mgr':'')+'" data-loc="paint"><div class="sph">🎨 Paint Hangar</div><div class="req">'+(paintAny()?'any die':'sum 4+')+'</div><div class="tok">'+(hg.map(j=>planeSVG(j,70)).join('')||'<span class="empty">empty</span>')+'</div>'+slotsH('paint',paintAny()?1:2)+extrasH('paint')+'</div>';
 h+='<div class="sp fl'+tgt('flight')+'" data-loc="flight"><div class="sph">✈️ Flight Line</div><div class="req">'+flightMin()+'+ · sells for $'+(8+(has('airline')?3:0)+(evOn('rush')?4:0))+'</div><div class="tok">'+(fl.map(j=>'<span class="fj">'+planeSVG(j,70)+(j.needQA?'<em>🔍</em>':'')+'</span>').join('')||'<span class="empty">empty</span>')+'</div>'+slotsH('flight',Math.max(1,fl.length))+extrasH('flight')+'</div>';
 return h+'</div></div>';}
function marketH(){return'<div class="market"><div class="lineh">🛠️ Upgrades <span>tap a card to buy</span></div><div class="cards">'+S.market.map(k=>{const c=CARDS.find(x=>x.k===k),ok=S.money>=c.c;
  return'<button class="card'+(ok?' ok':' no')+'" data-card="'+k+'"><span class="price">$'+c.c+'</span><span class="ci">'+c.i+'</span><b>'+c.n+'</b><span class="cd">'+c.d+'</span></button>';}).join('')+'</div>'+
 (S.owned.length?'<div class="owned">Owned: '+S.owned.map(k=>{const c=CARDS.find(x=>x.k===k);return'<span title="'+c.d+'">'+c.i+' '+c.n+'</span>';}).join('')+'</div>':'')+'</div>';}
function topbar(){return'<div class="topbar"><span class="logo">Final Assembly<span class="alpha">ALPHA</span></span><button class="ib" data-help aria-label="How to play">?</button><button class="ib" data-settings aria-label="Settings">⚙️</button><button class="ib" data-menu aria-label="Menu">☰</button></div>';}
const FOOT='<div class="foot">Final Assembly v'+VERSION+' ALPHA · © 2026 Rainwater Games (Jeff Rainwater)</div>';
function titleH(){const sv=load(),best=(()=>{try{return JSON.parse(localStorage.getItem('fa-best')||'{}');}catch(e){return{};}})();
 return'<div class="title"><div class="brand">RAINWATER GAMES</div><h1>Final Assembly</h1><div class="alpha big2">ALPHA v'+VERSION+'</div>'+
 '<svg viewBox="0 0 160 60" width="220" height="82" class="hero">'+planeSVG({done:[1,1,1,1,1,1],painted:1,air:0}).replace(/<svg[^>]*>|<\/svg>/g,'')+'</svg>'+
 '<p class="sub">Roll your crew. Build jets. Ship them on time.</p>'+
 '<div class="seg">'+Object.keys(SCEN).map(k=>'<button class="'+(UI.scen===k?'on':'')+'" data-scen="'+k+'">'+SCEN[k].n+'</button>').join('')+'</div>'+
 '<div class="seg">'+['easy','normal','hard'].map(k=>'<button class="'+(UI.diff===k?'on':'')+'" data-diff="'+k+'">'+k+'</button>').join('')+'</div>'+
 '<div class="menu">'+(sv?'<button class="big gr" data-cont>▶ Continue (week '+sv.week+')</button>':'')+'<button class="big" data-new>New Game</button><button class="big alt" data-tut>🎓 Tutorial</button>'+
 '<div class="row"><button class="big alt sm" data-help>? How to play</button><button class="big alt sm" data-settings>⚙️ Settings</button><button class="big alt sm" data-ach>🏆</button></div></div>'+
 (best[UI.scen+'-'+UI.diff]?'<div class="best">Best: '+best[UI.scen+'-'+UI.diff]+' jets</div>':'')+FOOT+'</div>';}
function render(){if(UI.noSave||UI.busy)return;
 document.querySelectorAll('.coach').forEach(e=>e.remove());
 if(UI.screen==='title'){app.innerHTML=titleH();return;}
 app.innerHTML=topbar()+hud()+jetsH()+chipsH()+trayH()+boardH()+marketH()+'<div class="log">'+S.log.slice(0,3).map(l=>'<div>'+l+'</div>').join('')+'</div>'+FOOT;
 if(S.over&&!document.getElementById('over'))overH();
 if(UI.fx){const f=UI.fx;UI.fx=null;
  if(f.cash){const c=$('#cash');c.classList.add('bump');const r=c.getBoundingClientRect(),p=document.createElement('div');p.className='coinpop';p.textContent='+$'+f.cash+' cha-ching!';p.style.left=(r.left+10)+'px';p.style.top=(r.bottom)+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),1600);}
  if(f.rest)f.rest.forEach(id=>{const e=document.querySelector('#tray [data-die="'+id+'"]');if(e)e.classList.add('land');});
  if(f.done){const e=document.querySelector('[data-loc="'+f.done+'"]');if(e)e.classList.add('pop');}}
 if(!S.over&&!UI.modal&&UI.su&&!S.suDone&&S.phase==='roll'&&!document.getElementById('standup'))standup();
 if(UI.modal&&!document.getElementById('modal'))modal(UI.modal);
 if(UI.coach>=0)coach();}
function fx(k,v){UI.fx=Object.assign(UI.fx||{},{[k]:v});}
function msg(t){if(UI.noSave)return;UI.msg=t;render();clearTimeout(msg.t);msg.t=setTimeout(()=>{UI.msg='';if(UI.screen==='game')render();},2600);}
function toast(t){if(UI.noSave)return;const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2600);}
// ---------- dice animation ----------
function animRoll(ids,cb){if(UI.noSave){cb&&cb();return;}UI.busy=0;render();
 if(UI.noAnim){sfx('clack');cb&&cb();return;}
 const els=ids.map(id=>document.querySelector('#tray [data-die="'+id+'"]')).filter(Boolean);if(!els.length){cb&&cb();return;}
 UI.busy=1;sfx('rattle');const n=els.length,t0=performance.now();
 const stops=els.map((e,k)=>650+k*(420/Math.max(1,n-1||1))+Math.random()*120);
 els.forEach((el,k)=>{el.classList.add('tumble');el.style.animationDelay=(k*40)+'ms';el.style.setProperty('--dx',(Math.random()*60-30|0)+'px');});
 const iv=setInterval(()=>{const t=performance.now()-t0;let all=true;
  els.forEach((el,k)=>{if(el.dataset.landed)return;if(t<stops[k]){all=false;const v=1+Math.random()*6|0;el.querySelectorAll('i').forEach(x=>x.remove());el.insertAdjacentHTML('afterbegin',pipsH(v));}
   else{el.dataset.landed=1;const d=S.dice.find(x=>x.id===+el.dataset.die);el.querySelectorAll('i').forEach(x=>x.remove());el.insertAdjacentHTML('afterbegin',pipsH(d.v));el.classList.remove('tumble');el.classList.add('land');sfx('clack');}});
  if(all){clearInterval(iv);setTimeout(()=>{UI.busy=0;render();cb&&cb();},380);}},70);}
function doRoll(){if(S.phase!=='roll')return;snap();roll();save();animRoll(S.dice.map(d=>d.id),()=>{if(UI.coach===0){UI.coach=1;render();}});}
// ---------- overlays ----------
function standup(){const ov=document.createElement('div');ov.className='ov';ov.id='standup';
 ov.innerHTML='<div class="box su"><h2>☕ Monday Stand-up <span class="tag">EXPANSION</span></h2>'+
 '<div class="safety">⛑️ <b>"Safety moment!"</b> '+S.tip+'</div>'+
 '<div class="huddle"><div class="boss">👔</div>'+S.bubs.map((b,i)=>'<div class="bub" style="animation-delay:'+(.3+i*.35)+'s">'+b+'</div>').join('')+'</div>'+
 '<p class="tw">Team focus this week — pick one:</p><div class="twists">'+S.twists.map(k=>{const t=TWISTS.find(x=>x.k===k);return'<button class="twb" data-tw="'+k+'"><span>'+t.i+'</span><b>'+t.n+'</b><small>'+t.d+'</small></button>';}).join('')+'</div>'+
 '<button class="lnk" data-tw="">Skip stand-up</button></div>';
 document.body.appendChild(ov);sfx('meet');
 ov.onclick=e=>{const b=e.target.closest('[data-tw]');if(!b)return;applyTwist(b.dataset.tw);if(b.dataset.tw)toast('🙌 Team focus: '+TWISTS.find(x=>x.k===b.dataset.tw).n);ov.remove();save();render();};}
const HELP='<h2>How to play</h2><ol class="help">'+
 '<li><b>🎲 Roll your crew.</b> Each die is a worker.</li>'+
 '<li><b>Place dice</b> (tap or drag) on a station that shows what it needs — like <i>odd</i> or <i>sum 7+</i>.</li>'+
 '<li><b>End Week ▶</b> moves the line: a jet moves right when its station is done. Station 6 → Paint Hangar.</li>'+
 '<li><b>🎨 Paint</b> → jet goes to the <b>✈️ Flight Line</b>. A test flight sells it: cha-ching!</li>'+
 '<li><b>🔍 QA:</b> a jet needs a QA stamp before it can fly. That\'s it — it just waits.</li>'+
 '<li><b>✊ Union:</b> the red Steward die can be set to any number once a week. Union breaks give rested workers +2. Pushback sends the 👔 manager away.</li>'+
 '<li><b>🛠️ Upgrades:</b> spend cash on cards. Hit the jet quota to win.</li></ol><p class="mini">🧰 Psst: check the toolboxes.</p>';
function overH(){const ov=document.createElement('div');ov.className='ov';ov.id='over';const r=S.result;
 ov.innerHTML='<div class="box"><h1 class="'+(r.met?'win':'lose')+'">'+(r.met?'QUOTA MET!':'SO CLOSE!')+'</h1><div class="stars">'+[0,1,2].map(i=>i<r.stars?'★':'☆').join('')+'</div>'+
 '<p class="bigt">'+S.delivered+' / '+r.qt+' jets delivered</p><p>'+(r.met?'The airlines are thrilled. Union picnic is on you.':'Tough dice this time. One more shift?')+'</p><p class="mini">Cash $'+S.money+' · '+S.owned.length+' upgrades · Steward used '+S.stw+'×</p>'+
 '<button class="big" data-again>Play again</button><button class="big alt" data-title>Title</button></div>';document.body.appendChild(ov);}
function modal(k){const ov=document.createElement('div');ov.className='ov';ov.id='modal';let h='';
 if(k==='help')h=HELP+'<button class="big w" data-close>Got it</button>';
 else if(k==='settings')h='<h2>⚙️ Settings</h2><div class="exp"><div class="exph">☕ Stand-up Meetings <span class="tag">EXPANSION</span></div><p>Adds a neat new twist each week: a safety moment and a team focus to choose. Makes the game a bit more complicated.</p><button class="tog'+(UI.su?' on':'')+'" data-set="su">'+(UI.su?'ON':'OFF')+'</button></div>'+
  '<div class="setr">🎲 Dice roll animation<button class="tog'+(UI.noAnim?'':' on')+'" data-set="anim">'+(UI.noAnim?'OFF':'ON')+'</button></div><div class="setr">🔊 Sound<button class="tog'+(muted?'':' on')+'" data-set="mute">'+(muted?'OFF':'ON')+'</button></div><button class="big w" data-close>Done</button>';
 else if(k==='menu')h='<h2>Menu</h2><button class="big alt w" data-restart>↻ Restart</button><button class="big alt w" data-title>⌂ Title screen</button><button class="big alt w" data-ach>🏆 Achievements</button><button class="big w" data-close>Back</button>';
 else if(k==='ach'){const a=getL('fa-ach'),s=getL('fa-stk');h='<h2>🏆 Achievements</h2>'+ACH.map(x=>'<div class="achr'+(a.includes(x.k)?' got':'')+'">'+(a.includes(x.k)?'🏆':'🔒')+' <b>'+x.n+'</b><span>'+x.d+'</span></div>').join('')+
  '<h3>🧰 Toolbox stickers '+s.length+'/'+STK.length+'</h3><div class="stks">'+STK.map(x=>'<span class="stkc'+(s.includes(x.k)?'':' lock')+'" style="background:'+(s.includes(x.k)?x.c:'#555')+'">'+(s.includes(x.k)?x.t:'???')+'</span>').join('')+'</div><button class="big w" data-close>Close</button>';}
 else if(k.startsWith('buy:')){const c=CARDS.find(x=>x.k===k.slice(4));h='<h2>Buy upgrade?</h2><div class="card big3 ok"><span class="price">$'+c.c+'</span><span class="ci">'+c.i+'</span><b>'+c.n+'</b><span class="cd">'+c.d+'</span></div><p class="mini">You have $'+S.money+' → $'+(S.money-c.c)+' after.</p><button class="big gr w" data-buyok="'+c.k+'">Buy for $'+c.c+'</button><button class="big alt w" data-close>Not now</button>';}
 else if(k==='recap'){const r=S.recap;if(!r){UI.modal=null;return;}const met=r.del>=r.quota;h='<h2>📊 Q'+(r.q+1)+' review</h2><div class="stamp '+(met?'g':'y')+'">'+(met?'QUARTER MET':'KEEP GOING')+'</div><table class="rt"><tr><td>Jets this quarter</td><td>'+r.del+' / '+r.quota+'</td></tr><tr><td>Year to date</td><td>'+r.ytd+' / '+quotaTotal()+'</td></tr><tr><td>Cash</td><td>$'+r.cash+'</td></tr><tr><td>Upgrades</td><td>'+r.up+'</td></tr></table><p class="mini">'+(met?'Great quarter, crew!':'No penalty — only the year total counts.')+' Next goal: Q'+(r.q+2)+' · '+qQuota(r.q+1)+' jets.</p><button class="big w" data-close>Start Q'+(r.q+2)+' ▶</button>';}
 ov.innerHTML='<div class="box">'+h+'</div>';document.body.appendChild(ov);
 ov.onclick=e=>{const t=e.target.closest('button');if(!t){if(e.target===ov){ov.remove();UI.modal=null;}return;}
  if(t.dataset.set){const s=t.dataset.set;if(s==='su'){UI.su=!UI.su;localStorage.setItem('fa-su',UI.su?'1':'0');if(S&&UI.su)S.suDone=1;}if(s==='anim'){UI.noAnim=!UI.noAnim;localStorage.setItem('fa-noanim',UI.noAnim?'1':'0');}if(s==='mute'){muted=!muted;localStorage.setItem('fa-mute',muted?'1':'0');if(MG)MG.gain.value=muted?0:1;}ov.remove();modal('settings');return;}
  if(t.dataset.buyok){buy(t.dataset.buyok);ov.remove();UI.modal=null;toast('🛠️ Upgrade installed!');render();return;}
  if(t.hasAttribute('data-ach')){ov.remove();modal('ach');return;}
  if(t.hasAttribute('data-close')){ov.remove();if(k==='recap')S.recap=null;UI.modal=null;render();return;}
  if(t.hasAttribute('data-title')){ov.remove();UI.modal=null;UI.screen='title';music(false);render();return;}
  if(t.hasAttribute('data-restart')){ov.remove();UI.modal=null;newGame({diff:S.diff,scen:S.scen});render();}};}
const COACH=['🎲 Tap <b>Roll crew</b> to roll your workers.','Each station shows what it needs (like <i>odd</i> or <i>sum 7+</i>). Tap a die, then a glowing station — or drag it there.',
 '✊ The red <b>Union Steward</b> die can be set to any number once a week. Tap it to pick.','Finished jets go 🎨 Paint → ✈️ Flight Line. A test flight sells the jet (needs a 🔍 QA stamp first).','💰 Cash buys upgrade cards. Tap <b>End Week ▶</b> to move the line. Have fun!'];
function coach(){if(UI.coach<0||UI.coach>=COACH.length||S.over)return;const c=document.createElement('div');c.className='coach';
 c.innerHTML='<div>'+COACH[UI.coach]+'</div><div class="cb"><button data-cn>'+(UI.coach===COACH.length-1?'Done':'Next ▶')+'</button><button data-cx>Skip</button><span>'+(UI.coach+1)+'/'+COACH.length+'</span></div>';
 document.body.appendChild(c);c.onclick=e=>{if(e.target.closest('[data-cx]')){UI.coach=-1;localStorage.setItem('fa-tut','1');}else if(e.target.closest('[data-cn]')){UI.coach++;if(UI.coach>=COACH.length){UI.coach=-1;localStorage.setItem('fa-tut','1');}}else return;render();};}
function start(o){ac();music(true);UI.screen='game';UI.modal=null;newGame(o);if(UI.su)S.suDone=0;render();}
// ---------- input ----------
app.addEventListener('click',e=>{if(dragSup||UI.busy)return;const t=e.target.closest('button,[data-loc]');if(!t)return;const ds=t.dataset;ac();
 if('help'in ds){modal('help');return;}if('settings'in ds){modal('settings');return;}if('ach'in ds){modal('ach');return;}if('menu'in ds){modal('menu');return;}
 if(UI.screen==='title'){
  if(ds.scen){UI.scen=ds.scen;render();}if(ds.diff){UI.diff=ds.diff;render();}
  if('new'in ds){start({diff:UI.diff,scen:UI.scen,seed:Q.get('seed')?+Q.get('seed'):null});if(!localStorage.getItem('fa-tut')){UI.coach=0;render();}}
  if('tut'in ds){UI.coach=0;start({diff:'easy',scen:'q4',seed:1234});}
  if('cont'in ds){S=load();UI.screen='game';music(true);render();}return;}
 if(!S||S.over)return;
 if('roll'in ds){doRoll();return;}
 if('stk'in ds){collectStk();return;}
 if('push'in ds){pushback();return;}
 if(ds.die!=null&&t.closest('#tray')){if(S.phase!=='place')return;const id=+ds.die;UI.sel=UI.sel===id?null:id;sfx('place');render();return;}
 if(ds.stwv){setStw(+ds.stwv);return;}
 if('rr'in ds){reroll(UI.sel);return;}
 if('undo'in ds){undo();return;}
 if(ds.card){const c=CARDS.find(x=>x.k===ds.card);if(S.money<c.c){msg('💰 Need $'+c.c+' — you have $'+S.money+'. Sell jets on the Flight Line!');return;}modal('buy:'+ds.card);return;}
 if('end'in ds){sfx('move');endWeek();if(S.over){render();sfx(S.result.met?'sale':'bad');return;}save();if(S.recap)UI.modal='recap';toast('🏭 Line moved'+(S.lastMove.out?' · a jet rolled into Paint!':''));render();return;}
 if(ds.loc){if(UI.sel==null){msg('Tap a die first, then a station.');return;}place(UI.sel,ds.loc);}});
document.body.addEventListener('click',e=>{const t=e.target.closest('#over button');if(!t)return;document.getElementById('over').remove();if('again'in t.dataset)start({diff:S.diff,scen:S.scen});else{UI.screen='title';music(false);render();}});
let drag=null,dragSup=false;
document.addEventListener('pointerdown',e=>{const t=e.target.closest('#tray .die');if(!t||UI.busy||UI.screen!=='game'||!S||S.phase!=='place'||document.querySelector('.ov'))return;const d=S.dice.find(x=>x.id===+t.dataset.die);if(!d||d.loc!=null)return;drag={id:d.id,x:e.clientX,y:e.clientY,el:t,g:null,hv:null};});
document.addEventListener('pointermove',e=>{if(!drag)return;const d=S.dice.find(x=>x.id===drag.id);
 if(!drag.g){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<10)return;drag.g=drag.el.cloneNode(true);drag.g.classList.add('ghost');drag.g.classList.remove('sel','land');document.body.appendChild(drag.g);drag.el.style.opacity=.3;
  document.querySelectorAll('[data-loc]').forEach(el=>el.classList.toggle('tgt',!canPlace(d,el.dataset.loc)));}
 drag.g.style.left=(e.clientX-23)+'px';drag.g.style.top=(e.clientY-23)+'px';
 const el=document.elementFromPoint(e.clientX,e.clientY),L=el&&el.closest('[data-loc]');if(drag.hv&&drag.hv!==L)drag.hv.classList.remove('hov');if(L)L.classList.add('hov');drag.hv=L;e.preventDefault();},{passive:false});
function endDrag(e,cancel){if(!drag)return;const g=drag.g,id=drag.id,el0=drag.el;drag=null;if(!g)return;g.remove();el0.style.opacity='';dragSup=true;setTimeout(()=>dragSup=false,60);
 const el=cancel?null:document.elementFromPoint(e.clientX,e.clientY),L=el&&el.closest('[data-loc]');if(L)place(id,L.dataset.loc);else{UI.sel=null;render();}}
document.addEventListener('pointerup',e=>endDrag(e));document.addEventListener('pointercancel',e=>endDrag(e,1));
UI.bot={botGame,botWeek,state:()=>S,render:()=>render()};
// ---------- boot ----------
function verCheck(){if(!/^https?:/.test(location.protocol))return;fetch('version.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{
 if(j&&j.v&&j.v!==VERSION&&sessionStorage.getItem('fa-rl')!==j.v){sessionStorage.setItem('fa-rl',j.v);location.reload();}}).catch(()=>{});}
verCheck();document.addEventListener('visibilitychange',()=>{if(!document.hidden)verCheck();});
if('serviceWorker'in navigator&&/^https?:/.test(location.protocol)&&!/^(localhost|127\.0\.0\.1)$/.test(location.hostname))navigator.serviceWorker.register('sw.js').catch(()=>{});
const sd=d=>+(Q.get('seed')||d);let after=null;
function G(o){UI.screen='game';newGame(Object.assign({diff:Q.get('diff')||'normal',scen:Q.get('scen')||'q4'},o));}
if(TEST)UI.su=false;
if(TEST==='tutorial'){UI.coach=0;G({diff:'easy',scen:'q4',seed:1234});}
else if(TEST==='roll'){G({seed:sd(5)});after=()=>setTimeout(doRoll,400);}
else if(TEST==='cash'){G({seed:sd(7)});S.money=24;roll();}
else if(TEST==='planes'){G({seed:sd(8)});const js=S.jets;js[0].st='flight';js[0].done=[1,1,1,1,1,1];js[0].painted=1;js[0].needQA=0;js[1].st='flight';js[1].done=[1,1,1,1,1,1];js[1].painted=1;js[1].needQA=1;js[2].st='paint';js[2].done=[1,1,1,1,1,1];
 js[3].st=4;js[3].done=[1,1,1,1,0,0];js[4].st=2;js[4].done=[1,1,0,0,0,0];newJet(0);S.delivered=2;S.qDel[0]=2;for(let i=0;i<2;i++){const j=newJet(0);j.st='done';j.painted=1;j.done=[1,1,1,1,1,1];}roll();}
else if(TEST==='qa'){G({seed:sd(9)});const j=S.jets[0];j.st='flight';j.done=[1,1,1,1,1,1];j.painted=1;j.needQA=1;roll();S.dice[0].v=4;S.dice[1].v=5;UI.sel=1;}
else if(TEST==='steward'){G({seed:sd(10)});roll();UI.sel=99;}
else if(TEST==='manager'){G({seed:sd(11)});S.mgr='wing';S.mgrNext='paint';roll();}
else if(TEST==='break'){G({seed:sd(12)});S.mgr=null;S.brkAt=2;roll();S.dice.slice(0,4).forEach((d,i)=>d.v=[1,2,1,3][i]);place(0,'cab');place(2,'tail');}
else if(TEST==='standup'){UI.su=true;G({seed:sd(21)});}
else if(TEST==='stickers'){G({seed:sd(31),test:'stickers'});roll();}
else if(TEST==='recap'){UI.noSave=true;G({diff:'normal',scen:'annual',seed:sd(41)});let g=0;while(S.week<=6&&!S.over&&g++<10)botWeek();UI.noSave=false;UI.modal='recap';}
else if(Q.get('seed')){G({seed:+Q.get('seed')});}
if(TEST&&TEST!=='recap')UI.noSaveT=1;
render();if(after)after();
document.addEventListener('pointerdown',()=>{if(UI.screen!=='title'&&!musicOn){ac();music(true);}},{once:true});
})();
