
const sample = {
  users:[{name:"System Administrator",username:"superadmin",role:"superadmin",province:"",municipality:"",status:"Active"},{name:"Regional Encoder",username:"regional.encoder",role:"regional_admin",province:"",municipality:"",status:"Active"},{name:"Bohol Encoder",username:"bohol.encoder",role:"provincial_encoder",province:"Bohol",municipality:"",status:"Active"}],
  provinces:["Bohol","Cebu"],
  municipalities:[{name:"Tagbilaran City",province:"Bohol"},{name:"Ubay",province:"Bohol"},{name:"Carmen",province:"Bohol"},{name:"Cebu City",province:"Cebu"},{name:"Danao City",province:"Cebu"}],
  barangays:[{name:"Poblacion",municipality:"Ubay"},{name:"Nueva Esperanza",municipality:"Ubay"},{name:"Cogon",municipality:"Tagbilaran City"}],
  water:[{name:"Ubay Communal Irrigation System",type:"Communal Irrigation System",province:"Bohol",municipality:"Ubay",barangay:"Poblacion",status:"Sufficient",capacity:"120",unit:"ha",lat:"10.056",lng:"124.472"},{name:"Farm Pond 01",type:"Farm Pond",province:"Bohol",municipality:"Carmen",barangay:"",status:"Declining",capacity:"35",unit:"m³",lat:"9.82",lng:"124.20"},{name:"Deep Well - Demo",type:"Deep Well",province:"Cebu",municipality:"Danao City",barangay:"",status:"Low",capacity:"",unit:"",lat:"10.52",lng:"124.03"}],
  climate:[{date:"2026-11-20",province:"Bohol",municipality:"Ubay",barangay:"Poblacion",rain:"12.5",temp:"29.4",moist:"68",level:"Normal",source:"Sample station"},{date:"2026-11-18",province:"Bohol",municipality:"Carmen",barangay:"",rain:"2.0",temp:"31.2",moist:"38",level:"Watch",source:"Field report"},{date:"2026-11-16",province:"Cebu",municipality:"Danao City",barangay:"",rain:"0",temp:"32.1",moist:"24",level:"Warning",source:"Sample station"}],
  farmers:[{first:"Juan",last:"Dela Cruz",sex:"Male",province:"Bohol",municipality:"Ubay",barangay:"Poblacion",organization:"Ubay Farmers Association",rsbsa:"RSBSA-0001"},{first:"Maria",last:"Santos",sex:"Female",province:"Bohol",municipality:"Carmen",barangay:"",organization:"",rsbsa:"RSBSA-0002"}],
  farms:[{code:"FARM-0001",farmer:"Juan Dela Cruz",commodity:"Rice",area:"1.50",province:"Bohol",municipality:"Ubay",irrigation:"Irrigated",season:"Wet Season"},{code:"FARM-0002",farmer:"Maria Santos",commodity:"Corn",area:"0.75",province:"Bohol",municipality:"Carmen",irrigation:"Rainfed",season:"Dry Season"}]
};
function load(key){let v=localStorage.getItem("eamews_"+key);if(v)return JSON.parse(v);localStorage.setItem("eamews_"+key,JSON.stringify(sample[key]||[]));return sample[key]||[]}
function save(key,data){localStorage.setItem("eamews_"+key,JSON.stringify(data))}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function status(s){let c=["Sufficient","Normal","Active"].includes(s)?"good":["Declining","Watch","For Validation"].includes(s)?"warn":["Low","Dry","Warning","Critical","Inactive"].includes(s)?"bad":"";return `<span class="status ${c}">${esc(s)}</span>`}
function renderTable(key,cols){let data=load(key),body=data.map((r,i)=>`<tr>${cols.map(c=>`<td>${c==="status"?status(r[c]):esc(r[c]??"—")}</td>`).join("")}<td><button class="btn small secondary" onclick="removeRow('${key}',${i})">Delete</button></td></tr>`).join("");return `<div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th>${esc(c.replace(/([A-Z])/g," $1"))}</th>`).join("")}<th>Action</th></tr></thead><tbody>${body||`<tr><td colspan="${cols.length+1}" class="empty">No records yet. Add a record using the form.</td></tr>`}</tbody></table></div>`}
function removeRow(key,i){if(confirm("Delete this sample record?")){let d=load(key);d.splice(i,1);save(key,d);location.reload()}}
function bindForm(formId,key,fields){let f=document.getElementById(formId);if(!f)return;f.addEventListener("submit",e=>{e.preventDefault();let d=load(key),r={};fields.forEach(x=>r[x]=f.elements[x]?.value||"");d.unshift(r);save(key,d);f.reset();alert("Saved in this browser's local storage.");location.reload()})}
function filterTable(inputId,tableId){let inp=document.getElementById(inputId),t=document.getElementById(tableId);if(inp&&t)inp.addEventListener("input",()=>{let q=inp.value.toLowerCase();[...t.querySelectorAll("tbody tr")].forEach(r=>r.hidden=!r.innerText.toLowerCase().includes(q))})}
document.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll("[data-year]").forEach(x=>x.textContent=new Date().getFullYear());
 const login=document.getElementById("loginForm");if(login)login.addEventListener("submit",e=>{e.preventDefault();localStorage.setItem("eamews_user",login.username.value||"Demo User");location.href="dashboard.html"});
 const logout=document.getElementById("logoutLink");if(logout)logout.addEventListener("click",e=>{e.preventDefault();localStorage.removeItem("eamews_user");location.href="login.html"});
 const user=localStorage.getItem("eamews_user")||"Demo User";document.querySelectorAll("[data-user]").forEach(x=>x.textContent=user);
});

document.addEventListener("DOMContentLoaded",()=>{
 const specs=[
  ["provinceForm","provinces",["name"]],["municipalityForm","municipalities",["name","province"]],["barangayForm","barangays",["name","municipality"]],
  ["userForm","users",["name","username","role","province","municipality","status"]],
  ["waterForm","water",["name","type","province","municipality","barangay","status","capacity","unit","lat","lng"]],
  ["climateForm","climate",["date","province","municipality","barangay","rain","temp","moist","level","source"]],
  ["farmerForm","farmers",["first","last","sex","province","municipality","barangay","organization","rsbsa"]],
  ["farmForm","farms",["code","farmer","commodity","area","province","municipality","irrigation","season"]]
 ];
 specs.forEach(([id,key,fields])=>{let f=document.getElementById(id);if(f)f.addEventListener("submit",e=>{e.preventDefault();let row={};fields.forEach(k=>row[k]=f.elements[k]?.value||"");let d=load(key);d.unshift(row);save(key,d);alert("Record saved locally.");location.reload()})});
 const tableSpecs=[
  ["usersTable","users",["name","username","role","province","municipality","status"],"userSearch"],
  ["waterTable","water",["name","type","province","municipality","status"],"waterSearch"],
  ["climateTable","climate",["date","province","municipality","rain","temp","level"],"climateSearch"],
  ["farmersTable","farmers",["first","last","sex","province","municipality","rsbsa"],"farmerSearch"],
  ["farmsTable","farms",["code","farmer","commodity","area","province","municipality","irrigation"],"farmsSearch"]
 ];
 tableSpecs.forEach(([id,key,cols,search])=>{let el=document.getElementById(id);if(el){el.innerHTML=renderTable(key,cols);let inp=document.getElementById(search);if(inp)inp.addEventListener("input",()=>{let q=inp.value.toLowerCase();el.querySelectorAll("tbody tr").forEach(r=>r.hidden=!r.innerText.toLowerCase().includes(q))})}});
 const psel=document.getElementById("provinceSelect");if(psel)psel.innerHTML=load("provinces").map(p=>`<option>${esc(typeof p==="string"?p:p.name)}</option>`).join("");
 const msel=document.getElementById("municipalitySelect");if(msel)msel.innerHTML=load("municipalities").map(m=>`<option>${esc(m.name)}</option>`).join("");
 const lists=[["provinceList","provinces",x=>typeof x==="string"?x:x.name],["municipalityList","municipalities",x=>x.name+" · "+x.province],["barangayList","barangays",x=>x.name+" · "+x.municipality]];
 lists.forEach(([id,key,fmt])=>{let el=document.getElementById(id);if(el)el.innerHTML=load(key).map(x=>`<p class="sub" style="border-bottom:1px solid var(--line);padding:5px 0">${esc(fmt(x))}</p>`).join("")||"<p class='muted'>No entries</p>"});
 ["uCount","fCount","farmCount","wCount","waterCount","waterTotal"].forEach((id,i)=>{let el=document.getElementById(id);if(el){let key=["users","farmers","farms","water","water","water"][i];el.textContent=load(key).length}});
});
