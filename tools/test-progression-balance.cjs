const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'../src/game.js'),'utf8');
const line=name=>code.split('\n').find(l=>l.startsWith('function '+name+'('));
const state=()=>({planet:1,universe:1,drill:1,permanent:0,reactor:0,targeting:0,merchantRelics:0,weaponLevels:Array(10).fill(1),weaponPriceBases:Array(10).fill(0),weaponDamageScales:Array(10).fill(1),ownedWeapons:1,weaponOrder:[0],newestWeapon:0,weaponOffersMask:0,breakthroughClaims:Array(10).fill(0),inventory:{},credits:1e7,runEarnedCredits:0});
const w={s:state(),Math,WEAPONS:Array.from({length:10},()=>['Weapon']),bioFactor:()=>1,equipmentFactor:()=>1,universeFactor:()=>1,weaponUpgradeMultiplier:()=>1,upgradeHas:()=>false,equipped:()=>false,dev:{credits:false,materials:true},craftOwned:()=>0};
vm.createContext(w);vm.runInContext(code.split('\n').find(l=>l.startsWith('function gameSetting(')),w);
vm.runInContext(`const PLANET_MULT=[1,11.1963,7.4666,2.58,2.5,2.42,2.34,2.26,2.18,2.1];const MILESTONES=[10,25,50,75,100,150,200,250,300];const weaponStars=i=>MILESTONES.filter(x=>x<=s.weaponLevels[i]).length;const weaponFeature=i=>Math.floor((weaponStars(i)+1)/2);const STAR_ACTIVE_MS=9000,STAR_FLIGHT_MS=400,STAR_REST_MS=1500;`,w);
for(const name of ['breakthroughCount','breakthroughLevel','breakthroughMultiplier','planetTotalHp','weaponBaseRate','droneCount','weaponRate','unscaledWeaponDamage','weaponBaseDamage','weaponUpgradeCost','weaponDamage','weaponDpsFactor','weaponDps','nextWeaponPriceBase','ownedWeaponCount','newWeaponCost','universeReward'])vm.runInContext(line(name),w);
vm.runInContext(code.slice(code.indexOf('function newWeaponProfile('),code.indexOf('let weaponChoiceOpen=false;')),w);
w.initializeWeaponEconomy();
const totals=[];for(let p=1;p<=5;p++){w.s.planet=p;const u1=w.planetTotalHp();w.s.universe=2;const u2=w.planetTotalHp();w.s.universe=1;assert.equal(u1,u2);if(p>=4)assert.ok(u1>=[2369500,5923750][p-4]*16);totals.push({planet:p,firstUniverseHP:u1,laterUniverseHP:u2});}
assert.equal(w.s.weaponPriceBases[0],25);
w.s.weaponLevels[0]=25;
const reference=w.weaponDamage(0)*w.weaponRate(0)*Math.min(4,w.weaponDpsFactor(0));
const snapshots=JSON.stringify(w.s),offers=[];
for(let i=1;i<10;i++){
 const p=w.newWeaponProfile(i);assert.equal(JSON.stringify(w.s),snapshots,'preview must not mutate state');
 assert.equal(p.priceBase,Math.max(75,Math.ceil(w.weaponUpgradeCost(0)*.25)));
 w.s.weaponDamageScales[i]=p.damageScale;
 const effective=w.weaponDamage(i)*w.weaponRate(i)*Math.min(4,w.weaponDpsFactor(i));
 assert.ok(Math.abs(effective-reference*.6)<1e-8,`balanced initial output ${i}`);
 w.s.weaponPriceBases[i]=p.priceBase;
 assert.equal(w.weaponUpgradeCost(i),p.priceBase);
 w.s.weaponLevels[i]=10;assert.equal(w.weaponUpgradeCost(i),Math.ceil(p.priceBase*1.12**9));
 offers.push({weapon:i,startingDamage:+p.damage.toFixed(3),fireRate:p.rate,firstUpgrade:p.priceBase});
 w.s=JSON.parse(snapshots);
}
// A purchased weapon's price and strength must not shift with wallet, planet or reference weapon.
const profile=w.newWeaponProfile(5);w.s.weaponPriceBases[5]=profile.priceBase;w.s.weaponDamageScales[5]=profile.damageScale;
const price=w.weaponUpgradeCost(5),damage=w.weaponDamage(5);w.s.credits=0;w.s.planet=100;w.s.weaponLevels[0]=150;
assert.equal(w.weaponUpgradeCost(5),price);assert.equal(w.weaponDamage(5),damage);
// Legacy migration keeps damage, fills missing prices, and is idempotent.
w.s=state();w.s.ownedWeapons=37;w.s.weaponOrder=[0,5,2];w.s.newestWeapon=2;
w.initializeWeaponEconomy();assert.equal(w.s.weaponPriceBases[5],75);assert.ok(w.s.weaponPriceBases[2]>75);assert.equal(w.s.weaponDamageScales[2],1);
const migrated=JSON.stringify(w.s);w.initializeWeaponEconomy();assert.equal(JSON.stringify(w.s),migrated);
// Batch quote agrees with sequential purchases and restores levels after a quote.
vm.runInContext('let weaponBuyAmount=10;function weaponTierRecipe(){return {}}',w);vm.runInContext(line('weaponBuyPlan'),w);
w.s.credits=1e9;const starting=w.s.weaponLevels[2],plan=w.weaponBuyPlan(2);assert.equal(w.s.weaponLevels[2],starting);let sum=0;
for(let j=0;j<10;j++){sum+=w.weaponUpgradeCost(2);w.s.weaponLevels[2]++;}assert.equal(plan.credits,sum);assert.equal(plan.count,10);
w.s=state();w.s.planet=3;w.s.runEarnedCredits=20000;assert.equal(w.universeReward(),0);w.s.planet=4;assert.equal(w.universeReward(),4);
assert.ok(code.includes('economyBalance:2'));assert.ok(code.includes('hp*newFactor/oldFactor'));assert.ok(code.includes('s.weaponPriceBases=Array(10).fill(0);s.weaponPriceBases[0]=25;s.weaponDamageScales=Array(10).fill(1);'));
console.table(totals);console.table(offers);
console.log('PASS: ascent wall, every weapon preview, stable acquisition values, legacy migration, batch prices, and first ascent eligibility.');
// Editing the separate settings file must change gameplay without changing source.
w.s=state();w.initializeWeaponEconomy();const originalDamage=w.weaponDamage(0),originalRate=w.weaponRate(0),originalCost=w.weaponUpgradeCost(0),originalHp=w.planetTotalHp();
w.ORBIT_FORGE_SETTINGS={weaponDamageMultiplier:2,weaponFireRateMultiplier:1.5,weaponUpgradeCostMultiplier:2,planetHpMultiplier:3};
assert.equal(w.weaponDamage(0),originalDamage*2);assert.equal(w.weaponRate(0),originalRate*1.5);assert.equal(w.weaponUpgradeCost(0),originalCost*2);assert.equal(w.planetTotalHp(),originalHp*3);
w.ORBIT_FORGE_SETTINGS.weaponDamageMultiplier='invalid';assert.equal(w.weaponDamage(0),originalDamage);
console.log('PASS: external damage, rate, price and HP settings change gameplay, and invalid settings fall back safely.');
