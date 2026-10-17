const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'../src/game.js'),'utf8');
const start=code.indexOf('// Render-only turn interpolation.');
const end=code.indexOf('// End render-only turn interpolation.',start);
const world={UQM_TICK:1/24,encounter:{elapsed:0}};vm.createContext(world);vm.runInContext(code.slice(start,end),world);
const {recordCombatTurn:set,combatRenderAngle:angle}=world,step=Math.PI/8;
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
// A slow native turn must have intermediate headings over its full turn period.
const ship={a:0,thrust:1,vx:2,vy:3};ship.a=set(ship,step,0,.25);const saved=JSON.stringify(ship);
close(angle(ship,0),0);close(angle(ship,.125),step/2);close(angle(ship,.25),step);
assert.equal(JSON.stringify(ship),saved,'drawing changed physical state');
// Sustained turning joins continuously across native updates.
const before=angle(ship,.25);ship.a=set(ship,step*2,.25,.25);close(angle(ship,.25),before);close(angle(ship,.375),step*1.5);
// Wrap through north along the short path, rather than spinning the long way.
const wrap={a:Math.PI*2-.02};wrap.a=set(wrap,.02,0,.1);close(angle(wrap,.05),Math.PI*2);
// Special abilities that reverse facing must remain instantaneous.
const reverse={a:0};reverse.a=set(reverse,Math.PI,0,.25);close(angle(reverse,0),Math.PI);
// Repeated render calls and different frame rates cannot change the result.
const heading=angle(ship,.4);for(let t=0;t<.4;t+=1/120)angle(ship,t);close(angle(ship,.4),heading);
assert.equal(JSON.stringify(ship),JSON.stringify({...ship,a:step*2}));
console.log('PASS: intermediate turns, continuous rotation, angle wrap, instant reversal, render-rate independence, and unchanged physical state.');
