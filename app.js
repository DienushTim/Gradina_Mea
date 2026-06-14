const DEFAULT_DATA = window.GRADINA_DATA;
const KEY = "gradinaDianaDataV1";
let data = loadData();

const EXTERNAL_PHOTOS = [
  "https://gradina-mea.org/assets/image-001.jpg",
  "https://gradina-mea.org/assets/image-002.jpg",
  "https://gradina-mea.org/assets/image-003.jpg",
  "https://gradina-mea.org/assets/image-004.jpg",
  "https://gradina-mea.org/assets/image-005.jpg",
  "https://gradina-mea.org/assets/image-006.jpg",
  "https://gradina-mea.org/assets/image-007.jpg",
  "https://gradina-mea.org/assets/image-008.jpg",
  "https://gradina-mea.org/assets/image-009.jpg",
  "https://gradina-mea.org/assets/image-010.jpg",
  "https://gradina-mea.org/assets/image-011.jpg",
  "https://gradina-mea.org/assets/image-012.jpg",
  "https://gradina-mea.org/assets/image-013.jpg",
  "https://gradina-mea.org/assets/image-014.jpg",
  "https://gradina-mea.org/assets/image-015.jpg",
  "https://gradina-mea.org/assets/image-016.jpg",
  "https://gradina-mea.org/assets/image-017.jpg",
  "https://gradina-mea.org/assets/image-018.jpg"
];

const PLANT_CATEGORY_IMAGES = [
  {pattern: /arbori fructiferi/i, url: EXTERNAL_PHOTOS[0]},
  {pattern: /conifere|pin|tuia|ienupăr/i, url: EXTERNAL_PHOTOS[5]},
  {pattern: /arbori ornamentali/i, url: EXTERNAL_PHOTOS[3]},
  {pattern: /aromatique|melifere/i, url: EXTERNAL_PHOTOS[7]},
  {pattern: /fructifere|căpărătoare/i, url: EXTERNAL_PHOTOS[1]},
  {pattern: /ghiveci/i, url: EXTERNAL_PHOTOS[8]},
  {pattern: /trandafiri/i, url: EXTERNAL_PHOTOS[9]},
  {pattern: /fructifere mici|căpșuni|fragi/i, url: EXTERNAL_PHOTOS[2]},
  {pattern: /bulbi|toporași|narcise|zambile|iriși|gladiole/i, url: EXTERNAL_PHOTOS[11]},
  {pattern: /ornamentale/i, url: EXTERNAL_PHOTOS[4]}
];

const PLANT_IMAGE_OVERRIDES = {
  A01: EXTERNAL_PHOTOS[0],
  A02: EXTERNAL_PHOTOS[1],
  A03: EXTERNAL_PHOTOS[2],
  A04: EXTERNAL_PHOTOS[3],
  A05: EXTERNAL_PHOTOS[4],
  A06: EXTERNAL_PHOTOS[5],
  A07: EXTERNAL_PHOTOS[6],
  C01: EXTERNAL_PHOTOS[6],
  C02: EXTERNAL_PHOTOS[5],
  C03: EXTERNAL_PHOTOS[5],
  V01: EXTERNAL_PHOTOS[1],
  V02: EXTERNAL_PHOTOS[1],
  F01: EXTERNAL_PHOTOS[2],
  F02: EXTERNAL_PHOTOS[2],
  F03: EXTERNAL_PHOTOS[2],
  F04: EXTERNAL_PHOTOS[2],
  F05: EXTERNAL_PHOTOS[2],
  H01: EXTERNAL_PHOTOS[7],
  H02: EXTERNAL_PHOTOS[7],
  H03: EXTERNAL_PHOTOS[7],
  H04: EXTERNAL_PHOTOS[7],
  H05: EXTERNAL_PHOTOS[8],
  O01: EXTERNAL_PHOTOS[9],
  O02: EXTERNAL_PHOTOS[10],
  O03: EXTERNAL_PHOTOS[10],
  O04: EXTERNAL_PHOTOS[6],
  O05: EXTERNAL_PHOTOS[11],
  O06: EXTERNAL_PHOTOS[11],
  O07: EXTERNAL_PHOTOS[11],
  O08: EXTERNAL_PHOTOS[11],
  O09: EXTERNAL_PHOTOS[11],
  O10: EXTERNAL_PHOTOS[11],
  G01: EXTERNAL_PHOTOS[12],
  G02: EXTERNAL_PHOTOS[13],
  G03: EXTERNAL_PHOTOS[14],
  G04: EXTERNAL_PHOTOS[15]
};

function getPlantImage(plant){
  if(PLANT_IMAGE_OVERRIDES[plant.id]) return PLANT_IMAGE_OVERRIDES[plant.id];
  const found = PLANT_CATEGORY_IMAGES.find(item => item.pattern.test(plant.category || ""));
  return found ? found.url : EXTERNAL_PHOTOS[16];
}

function loadData(){
  const saved = localStorage.getItem(KEY);
  if(saved){ try { return JSON.parse(saved); } catch(e){} }
  return structuredClone(DEFAULT_DATA);
}
function saveData(){ localStorage.setItem(KEY, JSON.stringify(data)); renderAll(); }
function uid(prefix="P"){ return prefix + Math.random().toString(36).slice(2,7).toUpperCase(); }
function esc(s){ return String(s ?? "").replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m])); }

function renderExternalGallery(){
  const container = document.getElementById("externalGallery");
  if(!container) return;
  container.innerHTML = EXTERNAL_PHOTOS.map(url =>
    `<article class="card photo-card"><img src="${url}" alt="Galerie Gradina Mea"><div class="photo-caption">Imagine din proiectul original</div></article>`
  ).join("");
}

document.querySelectorAll("nav button").forEach(btn=>{
  btn.addEventListener("click",()=>{ document.querySelectorAll("nav button").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active")); document.getElementById(btn.dataset.tab).classList.add("active");
  });
});
document.querySelector('nav button[data-tab="plants"]').classList.add("active");

function renderStats(){
  document.getElementById("statPlants").textContent = data.plants.length;
  document.getElementById("statPriority").textContent = data.plants.filter(p=>String(p.priority).includes("ridicată")).length;
  document.getElementById("statJournal").textContent = data.journal.length;
}
function renderCategories(){
  const sel = document.getElementById("categoryFilter");
  const current = sel.value;
  const cats = [...new Set(data.plants.map(p=>p.category).filter(Boolean))].sort();
  sel.innerHTML = '<option value="">Toate categoriile</option>' + cats.map(c=>`<option>${esc(c)}</option>`).join("");
  sel.value = current;
}
function renderPlants(){
  const q = document.getElementById("search").value.toLowerCase();
  const cat = document.getElementById("categoryFilter").value;
  const list = data.plants.filter(p => (!cat || p.category===cat) && JSON.stringify(p).toLowerCase().includes(q));
  document.getElementById("plantsGrid").innerHTML = list.map(p=>{
    const imageUrl = getPlantImage(p);
    return `
    <article class="card plant-card ${String(p.priority).includes("ridicată")?'high':''}" style="background-image:url('${imageUrl}')">
      <div class="card-content">
        <h3>${esc(p.name)}</h3>
        <div class="meta">${esc(p.id)} · ${esc(p.category)}</div>
        <span class="badge">nr: ${esc(p.count)}</span><span class="badge">${esc(p.status)}</span><span class="badge">${esc(p.state)}</span><span class="badge">prioritate: ${esc(p.priority)}</span>
        <p>${esc(p.notes)}</p>
        <div class="card-actions">
          <button onclick="editPlant('${esc(p.id)}')">Editează</button>
          <button onclick="deletePlant('${esc(p.id)}')" class="danger">Șterge</button>
        </div>
      </div>
    </article>`;
  }).join("");
}
function editPlant(id){
  const p = data.plants.find(x=>x.id===id); if(!p) return;
  document.querySelector('nav button[data-tab="add"]').click();
  editId.value=p.id; name.value=p.name; category.value=p.category; count.value=p.count; status.value=p.status; state.value=p.state; priority.value=p.priority.includes("ridicată")?"ridicată":p.priority; notes.value=p.notes;
}
function deletePlant(id){
  if(!confirm("Ștergi această plantă?")) return;
  data.plants = data.plants.filter(p=>p.id!==id); saveData();
}
plantForm.addEventListener("submit", e=>{
  e.preventDefault();
  const id = editId.value || uid("P");
  const item = {id, name:name.value, category:category.value, count:count.value, status:status.value, state:state.value, priority:priority.value, notes:notes.value};
  const i = data.plants.findIndex(p=>p.id===id);
  if(i>=0) data.plants[i]=item; else data.plants.push(item);
  plantForm.reset(); editId.value=""; count.value="1"; status.value="confirmat"; state.value="de verificat"; priority.value="medie";
  saveData(); document.querySelector('nav button[data-tab="plants"]').click();
});
resetForm.addEventListener("click",()=>{ plantForm.reset(); editId.value=""; count.value="1"; status.value="confirmat"; state.value="de verificat"; priority.value="medie"; });

function renderCalendar(){
  calendarGrid.innerHTML = data.tasks.map(m=>`<div class="card"><h3>${esc(m.month)}</h3><ul>${m.tasks.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>`).join("");
}
function renderTreatments(){
  treatmentsTable.innerHTML = `<thead><tr><th>Perioadă</th><th>Plante</th><th>Lucrare</th></tr></thead><tbody>` + data.treatments.map(t=>`<tr><td>${esc(t.period)}</td><td>${esc(t.plants)}</td><td>${esc(t.work)}</td></tr>`).join("") + `</tbody>`;
}
function renderJournal(){
  journalTable.innerHTML = `<thead><tr><th>Data</th><th>Plantă</th><th>Observație</th><th>Lucrare</th><th>Rezultat</th></tr></thead><tbody>` + data.journal.map(j=>`<tr><td>${esc(j.date)}</td><td>${esc(j.plant)}</td><td>${esc(j.observation)}</td><td>${esc(j.work)}</td><td>${esc(j.result)}</td></tr>`).join("") + `</tbody>`;
}
journalForm.addEventListener("submit", e=>{
  e.preventDefault();
  data.journal.unshift({date:jDate.value || new Date().toISOString().slice(0,10), plant:jPlant.value, observation:jObservation.value, work:jWork.value, result:jResult.value});
  journalForm.reset(); saveData();
});
function download(name, text, type="application/json"){
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name; a.click(); URL.revokeObjectURL(a.href);
}
exportJson.onclick=()=>download("gradina-diana-backup.json", JSON.stringify(data,null,2));
exportCsv.onclick=()=>{
  const cols=["id","name","category","count","status","state","priority","notes"];
  const csv=[cols.join(",")].concat(data.plants.map(p=>cols.map(c=>`"${String(p[c]??"").replaceAll('"','""')}"`).join(","))).join("\n");
  download("gradina-diana-plante.csv", csv, "text/csv");
};
importJson.onchange=e=>{
  const file=e.target.files[0]; if(!file) return;
  const r=new FileReader(); r.onload=()=>{ try{ data=JSON.parse(r.result); saveData(); alert("Import realizat."); }catch(err){ alert("JSON invalid."); } }; r.readAsText(file);
};
resetData.onclick=()=>{ if(confirm("Revii la datele inițiale și pierzi modificările locale?")){ localStorage.removeItem(KEY); data=structuredClone(DEFAULT_DATA); renderAll(); } };
function renderExport(){ jsonPreview.value = JSON.stringify(data,null,2); }
function renderAll(){ renderStats(); renderCategories(); renderPlants(); renderCalendar(); renderTreatments(); renderJournal(); renderExport(); renderExternalGallery(); }
search.addEventListener("input", renderPlants); categoryFilter.addEventListener("change", renderPlants);
renderAll();
