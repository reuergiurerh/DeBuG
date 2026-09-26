const $=s=>document.querySelector(s);
$("#login")?.addEventListener("click",async()=>{
 const password=$("#password").value;
 const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});
 if(r.ok) location.href="/dashboard"; else $("#msg").textContent="رمز عبور اشتباه است";
});
$("#logout")?.addEventListener("click",async()=>{await fetch("/api/logout",{method:"POST"});location.href="/";});
