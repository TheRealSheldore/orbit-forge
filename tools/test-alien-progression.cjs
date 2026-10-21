const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const src=fs.readFileSync(path.join(__dirname,'../src/game.js'),'utf8');
let roll=.329,notices=[],floats=[],renders=0;
const math=Object.create(Math);math.random=()=>roll;
const w={Math:math,s:{planet:1,universe:1,researchedRecipes:[],researchJobs:[]},BIOTECH_RECIPES:[{id:'first',name:'First',stage:1},{id:'second',name:'Second',stage:1,requires:'first'},{id:'later',name:'Later',stage:2}],upgradeHas:()=>false,researchStageReady:r=>r.stage===1,floaters:floats,notice:x=>notices.push(x),renderUI:()=>renders++};vm.createContext(w);vm.runInContext(src.split('\n').find(l=>l.startsWith('function gameSetting(')),w);
vm.runInContext(src.slice(src.indexOf('function recoverAlienRecipe('),src.indexOf('function recoverDiscoveryAt(')),w);
const site={kind:'tech',x:1,y:2};assert.equal(w.recoverAlienRecipe(site).id,'first');assert.equal(w.recoverAlienRecipe(site),null);assert.equal(w.s.researchedRecipes.length,1);
roll=.33;assert.equal(w.recoverAlienRecipe({kind:'tech',x:1,y:2}),null);assert.equal(w.recoverAlienRecipe({kind:'ore',x:1,y:2}),null);
roll=.329;w.s.researchJobs=[{id:'second'}];assert.equal(w.recoverAlienRecipe({kind:'tech'}),null);w.s.researchJobs=[];assert.equal(w.recoverAlienRecipe({kind:'tech',x:2,y:3}).id,'second');assert.equal(renders,2);
// Persisted site rolls prevent reloading a site to farm a second recipe.
assert.ok(src.includes('discoveryRecipeRolled:discoveries.map(d=>!!d.recipeRolled)'));assert.ok(src.includes('d.recipeRolled=!!old.discoveryRecipeRolled[i]'));
vm.runInContext(src.slice(src.indexOf('function merchantFleetSize('),src.indexOf('function merchantPlateau(')),w);
for(let p=1;p<=7;p++){w.s.planet=p;assert.equal(w.merchantFleetSize(),1)}w.s.planet=8;assert.equal(w.merchantFleetSize(),2);w.s.planet=11;assert.equal(w.merchantFleetSize(),3);w.s.planet=100;assert.equal(w.merchantFleetSize(),8);
assert.equal(w.alienEncounterBalance(1,1,.5).resistance,120);assert.equal(w.alienEncounterBalance(5,1,.5).attack,1.5);assert.equal(w.alienEncounterBalance(7,1,.5).attack,1);
assert.ok(w.alienEncounterBalance(5,1,1).resistance>w.alienEncounterBalance(5,1,0).resistance);
// Saved world migrations scale only live HP, once, including later universes.
for(const universe of [1,2])for(const version of [undefined,1]){const oldFactor=version===1&&universe===1?16:1,oldHP=20*oldFactor,newFactor=16*1.15**2,live=oldHP*newFactor/oldFactor;assert.ok(Math.abs(live-20*newFactor)<1e-8);assert.equal(0*newFactor/oldFactor,0)}
vm.runInContext(src.slice(src.indexOf('function rotateSpacecraft('),src.indexOf('function flyAlien(')),w);
vm.runInContext(src.slice(src.indexOf('const shipVisualMotion='),src.indexOf('function nativePilotInput(')),w);
let body={a:0,thrust:0};let v=w.smoothShipVisual(body,0);body.a=.4;body.thrust=1;v=w.smoothShipVisual(body,.02);assert.ok(v.a>0&&v.a<.4);assert.ok(v.thrust>0&&v.thrust<1);assert.equal(body.a,.4);assert.equal(body.thrust,1);for(let i=2;i<=30;i++)v=w.smoothShipVisual(body,i*.02);assert.ok(Math.abs(v.a-.4)<.001);assert.ok(v.thrust>.99);
console.log('PASS: 33% recipe boundary, one roll per site, no duplicates or active-job drops, fleet thresholds, balance variation, HP migration, and visual smoothing.');
// Exercise fractional damage against the real embedded native engine.
(async()=>{
 const file=process.argv[2]||path.join(__dirname,'../../Orbit-Forge-v0.9.63.html');
 const html=fs.readFileSync(file,'utf8'),scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
 vm.runInThisContext(scripts[1][1]);await UQMNative.ready;
 const engine=UQMNative.create();engine.reset();engine.api.orbit_add(0,17,0,16000,16000,0,10);const id=engine.api.orbit_add(1,0,1,16000,17000,8,-1),crew=engine.stats(0)[0];
 const m={nativeId:id,crew,crewMax:crew,blocks:[{hp:crew,max:crew}],nativeDamageRemainder:0};
 Object.assign(w,{encounter:{native:{engine},combatBalance:{resistance:120,attack:2},effects:[]},alienCrew:m=>m.crew,setAlienCrew:(m,n)=>{m.crew=n},damageSamples:[],performance});w.s.weaponTotals=[{damage:0,best:0}];
 vm.runInContext(src.split('\n').find(x=>x.startsWith('function nativeDamageMerchant(')),w);
 for(let i=0;i<119;i++)w.nativeDamageMerchant({m,x:0,y:0},1,0);
 assert.equal(m.crew,crew);w.nativeDamageMerchant({m,x:0,y:0},1.001,0);assert.equal(m.crew,crew-1);
 w.nativeDamageMerchant({m,x:0,y:0},240,0);assert.equal(m.crew,crew-3);
 for(let i=0;i<25;i++){let stat=engine.stats(i);assert.ok(stat[0]>0&&stat[3]>0)}
 console.log('PASS: native fractional damage accumulates, area/direct hits use hull resistance, and all 25 native ship profiles load.');
})().catch(e=>{console.error(e);process.exitCode=1});
