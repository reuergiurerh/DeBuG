async function load(){
 const r=await fetch("/api/configs"); if(r.status===401)return location.href="/";
 const items=await r.json();
 list.innerHTML=items.length?items.map(x=>`<div class="config"><div class="row"><b>${esc(x.name)}</b><span>${esc(x.protocol)}</span></div><small>${esc(x.address||"بدون آدرس")}:${x.port}</small><div class="row"><small>UUID: ${esc(x.uuid)}</small><button class="danger" onclick="del('${x.id}')">حذف</button></div></div>`).join(""):"هنوز کانفیگی ساخته نشده است";
}
function esc(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
async function del(id){if(!confirm("حذف شود؟"))return;await fetch("/api/configs/"+id,{method:"DELETE"});load()}
configForm.addEventListener("submit",async e=>{
 e.preventDefault(); const f=new FormData(e.target); const body=Object.fromEntries(f.entries());
 await fetch("/api/configs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
 e.target.reset(); load();
});
load();