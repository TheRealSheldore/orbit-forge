const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');
const src=fs.readFileSync(path.join(__dirname,'../src/game.js'),'utf8'),html=fs.readFileSync(process.argv.slice(2).find(x=>!x.startsWith('--'))||path.join(__dirname,'../../Orbit-Forge-v0.9.64.html'),'utf8');
const lines=src.split('\n');
function declaration(prefix){let i=lines.findIndex(l=>l.startsWith(prefix));if(i<0)throw Error(prefix);let s='';for(;i<lines.length;i++){s+=lines[i]+'\n';try{new vm.Script(s);return s}catch{}}throw Error(prefix)}
const w={console,WebAssembly,atob,btoa,performance,Uint8Array,Uint32Array,Int32Array,Math,globalThis:null};w.globalThis=w;vm.createContext(w);
for(const line of lines)if(line.startsWith('function ')){const name=line.match(/^function (\w+)/)[1];vm.runInContext(declaration('function '+name+'('),w)}
for(const key of ['ALIEN_HULLS','PLAYER_HULL_SIZE','COMBAT_MASKS','ALIEN_COMBAT','SHIP_SPRITE_RECTS','ALIEN_SOURCE','ALIEN_STATS','combatVisualTurns','combatVisualPositions','shipVisualMotion','PLAYER_TURRET_REACH','defaults','SHIP_SYSTEMS','SYSTEM_BASE_COST','MERCHANT_RELICS','EQUIPMENT'])vm.runInContext(declaration('const '+key+'='),w);
vm.runInContext("const TAU=Math.PI*2,UQM_TICK=1/24,UQM_WIDTH=32704,UQM_HEIGHT=32704;",w);
vm.runInContext(declaration('const WEAPONS='),w);
for(const key of ['ALIEN_ENGINES','PLAYER_ENGINES','PLAYER_WEAPON_COLORS','ALIEN_WEAPON_SPRITES'])vm.runInContext(declaration('const '+key+'='),w);
const zero=()=>{},one=()=>1;
Object.assign(w,{dev:{hp:true},s:{planet:1,universe:1,hull:0,shield:0,weaponTotals:Array.from({length:10},()=>({damage:0,best:0,blocks:0}))},damageSamples:[],followShip:false,camera:{x:0,y:0},shipSpeed:one,turnRate:()=>3,weaponDamage:one,weaponRate:()=>2,weaponRange:()=>5,weaponOn:()=>true,weaponFeature:()=>1,droneCount:()=>2,weaponSound:zero,prepareMerchant:zero,drawMerchant:zero,combatEvasion:()=>null,updateMerchantOverlay:zero,equipped:()=>false,upgradeHas:()=>false,alienWeaponSound:zero,shipExplosionSound:zero,storeCargo:zero,renderUI:zero,save:zero,notice:zero,merchantSound:zero});
(async()=>{
 w.encounter=null;w.cells=[];w.playerTurretSprite={complete:false};
 const gradient={addColorStop(){}};w.ctx=new Proxy({arc(x,y,r){if(r<0)throw Error('Negative arc radius')}},{get:(t,k)=>k in t?t[k]:k.startsWith('create')?()=>gradient:()=>{},set:(t,k,v)=>(t[k]=v,true)});
 Object.assign(w,{cv:{clientWidth:420,clientHeight:850},mapZoom:1,mapScale:()=>10,simulationTime:1000,ship:{a:0},draw:zero,updateCombatStats:zero,drawShipHull:zero,drawWeaponSprite:zero,drawAlienBeamEffect:()=>false,drawLightningEffect:zero,fmt:String});
 vm.runInContext(declaration('function drawMerchant('),w);
 for(const value of [NaN,Infinity,-Infinity,-5,1e12]){const clock={clock:value};let ticks=w.nativeTickBudget(clock,.05);assert.ok(ticks>=1&&ticks<=12);assert.ok(Number.isFinite(clock.clock)&&clock.clock<=.5)}
 const saved={clock:0};let ticks=0;for(let i=0;i<240;i++){let n=w.nativeTickBudget(saved,1/60);ticks+=n;saved.clock-=n/24}assert.equal(ticks,96);
 let pointChecks=0,originalPoint=w.hullPoint;w.hullPoint=(...a)=>{pointChecks++;return originalPoint(...a)};
 const testHull={x:0,y:0,a:0,style:0,collisionPrev:{x:0,y:0,a:0}};
 assert.ok(Number.isFinite(w.hullSweep(testHull,-1e6,0,1e6,0,.08)));assert.ok(pointChecks<=129);
 assert.equal(w.hullSweep({...testHull,x:Infinity},0,0,1,1,.08),Infinity);
 assert.equal(w.hullSweep(testHull,-1e6,1000,1e6,1000,.08),Infinity);
 console.log('PASS: damaged clocks recover, normal tick cadence is preserved, and million-block sweeps remain bounded.');
 vm.runInContext([...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1],w);await w.UQMNative.ready;
 for(let style of (process.argv.includes('--fleet')?[0,3,4,7,8,13,15,24]:Array.from({length:25},(_,i)=>i))){
  w.s=vm.runInContext('defaults()',w);w.dev.hp=true;
  const m={style,x:0,y:-7,a:Math.PI/2,vx:0,vy:0,thrust:0,blocks:[{x:0,y:0,hp:42,max:42}],crew:42,crewMax:42};
  w.encounter={type:'merchant',phase:'combat',elapsed:0,player:{x:0,y:0,a:-Math.PI/2,vx:0,vy:0,hp:10,max:10,shield:0,shieldMax:0},ships:[m,...Array.from({length:process.argv.includes('--fleet')?7:0},(_,i)=>({...m,x:(i+1)*4,y:-10,blocks:[{x:0,y:0,hp:42,max:42}]}))],fired:Array(10).fill(-100),shots:[],effects:[],actors:[],crewPods:[],combatBalance:{resistance:120,attack:2},kills:0,rewards:[]};
  const start=performance.now();const initial={x:m.x,y:m.y};
  try{for(let i=0;i<24*45;i++)w.stepMerchant(1/24);assert.ok(Number.isFinite(m.x)&&Number.isFinite(m.y));assert.ok(Math.hypot(m.x-initial.x,m.y-initial.y)>.01,`ship ${style} must move`);console.log('PASS style',style,'ms',Math.round(performance.now()-start));}catch(e){console.error('FAIL style',style,'time',w.encounter.elapsed,e.stack);throw e}
 }
})().catch(error=>{console.error(error);process.exitCode=1});
