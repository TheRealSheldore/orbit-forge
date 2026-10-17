const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'../src/game.js'),'utf8');
const start=code.indexOf('// Open-space coordinates are continuous;'),end=code.indexOf('function nativeDepartureAdvance(',start);
const stats=[0,0,32,1,0,0,0],engine={api:{orbit_ship_stat:(slot,field)=>stats[field]}};
const world={UQM_TICK:1/24,UQM_WIDTH:32704,UQM_HEIGHT:32704,TAU:Math.PI*2,shipSpeed:()=>12,combatRenderAngle:p=>p.a,uqmWrapDelta:(v,s)=>((v+s/2)%s+s)%s-s/2,encounter:{native:{engine},elapsed:0}};
vm.createContext(world);vm.runInContext(code.slice(start,end),world);
// Correct coasting toward a nearby goal by turning against excess momentum.
const player={x:0,y:0,a:0,vx:12,vy:0};world.encounter.player=player;
assert.equal(world.nativePilotInput(player,1,0)&4,0,'must not add forward thrust when overshooting');
player.a=Math.PI;assert.equal(world.nativePilotInput(player,1,0)&4,4,'must brake with reverse-facing thrust');
// A distant ship keeps its own continuous position across native arena seams.
const n={origin:{x:0,y:0},positions:new Map([[7,{rawX:32700,rawY:100,x:500,y:10}]])};
const body={x:500,y:10};let r=[];r[0]=7;r[6]=4;r[7]=100;
let pos=world.nativeShipPosition(n,body,r);assert.ok(Math.abs(pos.x-500.125)<1e-8);
r[6]=12;pos=world.nativeShipPosition(n,body,r);assert.ok(Math.abs(pos.x-500.25)<1e-8);
// Displayed position advances smoothly without changing simulation coordinates.
const p={x:1,y:2,a:0};world.recordCombatPosition(p,{x:2,y:4},1);let pose=world.combatRenderPose(p,1+1/48);assert.ok(Math.abs(pose.x-1.5)<1e-8);assert.ok(Math.abs(pose.y-3)<1e-8);assert.equal(p.x,2);assert.equal(p.y,4);
assert.ok(code.includes('if(r[2]&4||r[29])continue'),'ion trails must not become visible projectiles');
console.log('PASS: momentum braking, continuous distant positions, position interpolation, and ion-trail filtering.');
