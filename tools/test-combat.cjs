// Combat is now executed by the native engine, not the retired JavaScript AI.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const code=fs.readFileSync(path.join(__dirname,'../src/game.js'),'utf8');
const active=code.slice(code.indexOf('function stepMerchant('),code.indexOf('function drawMerchant('));
assert.ok(active.includes('stepNativeEncounter(e,dt)'));
assert.ok(!active.includes('stepAlienCombat('));
assert.ok(!active.includes('resolveCombatHulls('));
require('./test-native.cjs');
