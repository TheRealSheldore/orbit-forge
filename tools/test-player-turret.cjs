const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../src/game.js'),'utf8');
const w={Math,TAU:Math.PI*2};vm.createContext(w);
vm.runInContext(source.slice(source.indexOf('function rotateSpacecraft('),source.indexOf('function flyAlien(')),w);
vm.runInContext(source.slice(source.indexOf('const PLAYER_TURRET_REACH='),source.indexOf('function spawnBullet(')),w);
const ship={x:0,y:0,a:0,vx:1,vy:0};w.aimPlayerTurret(ship,0,4,1/60);
assert.ok(ship.turretAngle>0&&ship.turretAngle<.02);assert.equal(ship.a,0);assert.equal(ship.vx,1);assert.equal(w.turretOnTarget(ship,0,4),false);
for(let i=0;i<120;i++)w.aimPlayerTurret(ship,0,4,1/60);
assert.ok(w.turretOnTarget(ship,0,4));assert.equal(ship.a,0);
const muzzle=w.playerTurretMuzzle(ship),straight=w.createTurretShot(ship,ship.turretAngle,2,0,'basic',5),left=w.createTurretShot(ship,ship.turretAngle-.2,2,6,'scatter',6),right=w.createTurretShot(ship,ship.turretAngle+.2,2,6,'scatter',6);
assert.equal(straight.x,muzzle.x);assert.equal(straight.y,muzzle.y);assert.ok(Math.abs(Math.hypot(muzzle.x,muzzle.y)-.78)<1e-9);
assert.equal(left.x,right.x);assert.equal(left.y,right.y);assert.notEqual(left.vx,right.vx);
assert.ok(Math.abs(straight.travel+straight.life*23-5)<1e-9,'barrel must not extend weapon range');
// Mine fire uses the barrel direction and waits for alignment.
w.ship=ship;w.bullets=[];w.shotDistance=()=>4;vm.runInContext(source.slice(source.indexOf('function fireAt('),source.indexOf('function traceEffect(')),w);
ship.turretAngle=0;w.fireAt({x:-.5,y:4,hp:4},1);assert.equal(w.bullets.length,0);
ship.turretAngle=Math.PI/2;w.fireAt({x:-.5,y:4,hp:4},1);assert.equal(w.bullets.length,1);assert.ok(Math.abs(w.bullets[0].x)<1e-8);assert.ok(w.bullets[0].y>.7);
// Draw in world coordinates, with turret rotation independent of hull heading.
let rotation=0,circles=0;w.ctx={save(){},restore(){},translate(){},rotate(a){rotation=a},beginPath(){},arc(){circles++},fill(){},stroke(){},fillRect(){},strokeRect(){},createLinearGradient(){return {addColorStop(){}}}};
w.drawPlayerTurret(ship,0,0,10);assert.equal(rotation,ship.turretAngle);assert.equal(circles,2);
console.log('PASS: independent aiming, finite turn speed, alignment gating, one barrel origin for scatter, unchanged range, and turret drawing.');
