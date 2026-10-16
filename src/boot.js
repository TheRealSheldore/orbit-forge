
window.orbitBoot={ready:false,report(message){let box=document.getElementById('startupStatus');box.hidden=false;box.textContent='Orbit Forge could not start.\n\n'+String(message)+'\n\nPlease send a screenshot of this message.'}};
window.addEventListener('error',e=>{if(e.message)window.orbitBoot.report(e.message+' (line '+e.lineno+')')});
window.addEventListener('unhandledrejection',e=>window.orbitBoot.report(e.reason?.message||e.reason));
setTimeout(()=>{if(!window.orbitBoot.ready)window.orbitBoot.report('The game script did not finish loading. Open the fully downloaded HTML in Chrome or Edge, then reload.')},15000);
