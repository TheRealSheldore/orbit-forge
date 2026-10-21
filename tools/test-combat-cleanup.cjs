const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const lines=fs.readFileSync(require('path').join(__dirname,'../src/game.js'),'utf8').split('\n');
function get(name){let start=lines.findIndex(l=>l.startsWith('function '+name+'(')),s='';assert.ok(start>=0);for(let i=start;i<lines.length;i++){s+=lines[i]+'\n';try{new vm.Script(s);return s}catch{}}throw Error(name)}
const w={};vm.createContext(w);
for(const name of ['clearCombatProjectiles','finishMerchantCombat','completeMerchantCombat','drawNativeEntities'])vm.runInContext(get(name),w);
for(const result of ['victory','retreat','defeat','complete']){
 const e=w.encounter={phase:'combat',player:{hp:result==='defeat'?0:10},ships:[],elapsed:4,shots:[{}],nativeProjectiles:[{}],nativeActors:[{}],combatDrones:[{}],actors:[{}],effects:[{kind:'beam'},{kind:'lightning'},{kind:'burst'}],native:{playerProjectiles:new Map([[1,{}]]),playerCommand:12}};
 w.renderUI=()=>{throw Error('stop after transition')};w.merchantSound=()=>{throw Error('stop after cleanup')};
 try{if(result==='complete')w.completeMerchantCombat(true);else w.finishMerchantCombat(result==='victory',result==='retreat')}catch(error){assert.match(error.message,/stop after/)}
 for(const key of ['shots','nativeProjectiles','nativeActors','combatDrones','actors'])assert.equal(e[key].length,0,result+': '+key);
 assert.equal(e.native.playerProjectiles.size,0);assert.equal(e.native.playerCommand,0);assert.equal(e.effects.length,1);assert.equal(e.effects[0].kind,'burst');
}
for(const phase of ['aftermath','result','choice'])w.drawNativeEntities({phase,nativeProjectiles:[{}],nativeActors:[{}]},0,0,1);
console.log('PASS: victory, retreat, defeat and direct completion clear combat weapons; stale saved entities do not render outside combat.');
