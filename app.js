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
  document.getElementById("plantsGrid").innerHTML = list.map(p=>`
    <article class="card ${String(p.priority).includes("ridicată")?'high':''}">
      <h3>${esc(p.name)}</h3>
      ${p.plantImage ? `<img src="${p.plantImage}" alt="${esc(p.name)}" class="card-plant-image">` : ''}
      <div class="meta">${esc(p.id)} · ${esc(p.category)}</div>
      <span class="badge">nr: ${esc(p.count)}</span><span class="badge">${esc(p.status)}</span><span class="badge">${esc(p.state)}</span><span class="badge">prioritate: ${esc(p.priority)}</span>
      <p>${esc(p.notes)}</p>
      <button onclick="editPlant('${esc(p.id)}')">Editează</button>
      <button onclick="deletePlant('${esc(p.id)}')" class="danger">Șterge</button>
    </article>`).join("");
}
function editPlant(id){
  const p = data.plants.find(x=>x.id===id); if(!p) return;
  document.querySelector('nav button[data-tab="add"]').click();
  editId.value=p.id; name.value=p.name; category.value=p.category; count.value=p.count; status.value=p.status; state.value=p.state; priority.value=p.priority.includes("ridicată")?"ridicată":p.priority; notes.value=p.notes;
  if(p.plantImage){
    const preview = document.getElementById("imagePreview");
    preview.innerHTML = `<img src="${p.plantImage}" alt="Preview">`;
  }
}
function deletePlant(id){
  if(!confirm("Ștergi această plantă?")) return;
  data.plants = data.plants.filter(p=>p.id!==id); saveData();
}
plantForm.addEventListener("submit", e=>{
  e.preventDefault();
  const id = editId.value || uid("P");
  const previewImg = document.querySelector("#imagePreview img");
  const item = {id, name:name.value, category:category.value, count:count.value, status:status.value, state:state.value, priority:priority.value, notes:notes.value, plantImage: previewImg ? previewImg.src : ""};
  const i = data.plants.findIndex(p=>p.id===id);
  if(i>=0) data.plants[i]=item; else data.plants.push(item);
  plantForm.reset(); editId.value=""; count.value="1"; status.value="confirmat"; state.value="de verificat"; priority.value="medie"; document.getElementById("imagePreview").innerHTML="";
  saveData(); document.querySelector('nav button[data-tab="plants"]').click();
});
resetForm.addEventListener("click",()=>{ plantForm.reset(); editId.value=""; count.value="1"; status.value="confirmat"; state.value="de verificat"; priority.value="medie"; document.getElementById("imagePreview").innerHTML=""; });

// Handle image upload
document.getElementById("plantImage").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    const preview = document.getElementById("imagePreview");
    preview.innerHTML = `<img src="${reader.result}" alt="Preview">`;
  };
  reader.readAsDataURL(file);
});

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

window.exportImagesForGitHub = async function(){
  const zip = new JSZip();
  const imagesToExport = data.plants.filter(p => p.plantImage);
  if(imagesToExport.length === 0){ alert("Nu ai adaugat imagini!"); return; }
  const metadata = { exportDate: new Date().toISOString(), totalPlants: data.plants.length, plantsWithImages: imagesToExport.length, plants: imagesToExport.map(p => ({id: p.id, name: p.name, category: p.category, count: p.count, status: p.status, state: p.state, priority: p.priority, notes: p.notes, imageName: `images/${p.id}/image.png`})) };
  zip.file("plants-metadata.json", JSON.stringify(metadata, null, 2));
  for(const plant of imagesToExport){ const base64 = plant.plantImage; const data_part = base64.split(",")[1]; zip.folder(`images/${plant.id}`).file("image.png", data_part, {base64: true}); }
  const content = await zip.generateAsync({type: "blob"}); const url = URL.createObjectURL(content); const a = document.createElement("a"); a.href = url; a.download = `Gradina_Mea_Imagini_${new Date().toISOString().slice(0,10)}.zip`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
};

document.getElementById("exportGithub").addEventListener("click", window.exportImagesForGitHub);
renderAll();
