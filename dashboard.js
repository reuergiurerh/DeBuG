async function load(){
 const r=await fetch("/api/dashboard");
 if(r.status===401)return location.href="/";
 const d=await r.json();
 total.textContent=d.totalConfigs;
 active.textContent=d.activeConfigs;
 traffic.textContent=(d.traffic/1024/1024).toFixed(2)+" MB";
 uptime.textContent=Math.floor(d.uptime)+"s";
}
load();setInterval(load,5000);