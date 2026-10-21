const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../src/game.js'),'utf8');
const w={Math,ship:{},encounter:null};vm.createContext(w);vm.runInContext(source.split('\n').find(l=>l.startsWith('function gameSetting(')),w);
vm.runInContext(source.slice(source.indexOf('function rotateSpacecraft('),source.indexOf('function moveAlienTo(')),w);
const body=()=>({x:0,y:0,a:0,vx:1,vy:0,thrust:0});
// No thrust, no drag. Heading may change without rotating the velocity vector.
let p=body();for(let i=0;i<60;i++)w.flyAlien(p,1,0,1,2.5,1/60);assert.ok(Math.abs(p.x-1)<1e-9);assert.equal(p.vx,1);assert.equal(p.vy,0);
p=body();w.rotateSpacecraft(p,Math.PI,2.5,.02);assert.ok(p.a>0&&p.a<.01);assert.equal(p.vx,1);assert.equal(p.vy,0);
// A reversal must turn through intermediate headings and brake the old momentum.
p=body();let last=p.a,maxStep=0,backwardHeadingSeen=false,backwardFlightSeen=false;
for(let i=0;i<600;i++){
 w.flyAlien(p,-1,0,1,2.5,1/120);maxStep=Math.max(maxStep,Math.abs(p.a-last));last=p.a;
 assert.ok([p.x,p.y,p.a,p.vx,p.vy,p.thrust,p.angularVelocity].every(Number.isFinite));
 if(Math.cos(p.a)<0&&p.vx>0)backwardHeadingSeen=true;
 if(p.vx<-.5)backwardFlightSeen=true;
}
assert.ok(maxStep<2.5/120+1e-8);assert.ok(backwardHeadingSeen);assert.ok(backwardFlightSeen);
// Undefined throttle on newly launched drones must not produce NaN.
p=body();delete p.thrust;w.flyAlien(p,0,1,1,2.5,1/60);assert.ok(Number.isFinite(p.thrust));
// Crossing the angle wrap must take the short route, without a full flip.
p=body();p.a=Math.PI-.02;w.rotateSpacecraft(p,-Math.PI+.02,2.5,.02);assert.ok(p.a>Math.PI-.02);assert.ok(p.a<Math.PI+.02);
// Visual reversals are bounded too, including jumps greater than 135 degrees.
vm.runInContext(source.slice(source.indexOf('const shipVisualMotion='),source.indexOf('function nativePilotInput(')),w);
p=body();w.smoothShipVisual(p,0);let v=w.smoothShipVisual(p,.02,Math.PI);assert.ok(v.a>0&&v.a<.02);
console.log('PASS: coasting, independent heading, gradual reversal, bounded turns, forward thrust, fresh drones, angle wrapping, and visual no-snap turns.');
// Exercise the actual drawing entry point, including its default render clock.
vm.runInContext(source.split('\n').find(l=>l.startsWith('const combatVisualTurns=')),w);
vm.runInContext(source.slice(source.indexOf('function combatRenderAngle('),source.indexOf('function recordCombatTurn(')),w);
vm.runInContext(source.split('\n').find(l=>l.startsWith('const combatVisualPositions=')),w);
vm.runInContext(source.split('\n').find(l=>l.startsWith('function drawPlayerShip(')),w);
let rendered=0;Object.assign(w,{mapZoom:1,PLAYER_HULL_SIZE:.65,ctx:{save(){},restore(){},translate(){},rotate(a){rendered=a-Math.PI/2},scale(){}},drawPlayerThrusters(){},drawShipHull(){},drawPlayerTurret(){}});
for(const mode of ['mining','combat']){
 const craft=body();w.encounter=mode==='combat'?{elapsed:0}:null;w.simulationTime=0;w.drawPlayerShip(craft,0,0,1,0);const start=rendered;
 for(let i=1;i<=120;i++){w.simulationTime=i*1000/60;if(w.encounter)w.encounter.elapsed=i/60;craft.a=Math.PI/2;w.drawPlayerShip(craft,0,0,1,w.simulationTime)}
 assert.ok(rendered-start>1.4,mode+' displayed heading must rotate');
}
console.log('PASS: actual player drawing rotates during both mining and combat.');
