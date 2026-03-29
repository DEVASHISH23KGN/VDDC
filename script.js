const correctUsername = "admin";
const correctPassword = "1234";

// AUTO LOGIN
if (window.location.pathname.includes("login") && localStorage.getItem("loggedIn") === "true") {
  window.location.href = "index.html";
}

// LOGIN FUNCTION
function login() {
const user = document.getElementById("username").value;
const pass = document.getElementById("password").value;

if (user === correctUsername && pass === correctPassword) {
localStorage.setItem("loggedIn", "true");
window.location.href = "index.html";
} else {
document.getElementById("errorMsg").innerText = "Invalid Username or Password";
}
}

// SHOW/HIDE PASSWORD
document.addEventListener("DOMContentLoaded", () => {
const toggle = document.getElementById("togglePass");
const passField = document.getElementById("password");

if (toggle) {
toggle.onclick = () => {
passField.type = passField.type === "password" ? "text" : "password";
};
}
});

let drugData = {};

fetch("drug_data.csv")
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split("\n");

    // remove header
    rows.shift();

    rows.forEach(row => {
      const cols = row.split(",");

      if (cols.length < 8) return;

      const species = cols[0].trim();
      const group = cols[1].trim();
      const drug = cols[2].trim();

      if (!species || !group || !drug) return;

      drugData[species] ??= {};
      drugData[species][group] ??= {};

      drugData[species][group][drug] = {
        refDoseMin: parseFloat(cols[3]),
        refDoseMax: parseFloat(cols[4]),
        customDose: parseFloat(cols[5]),
        manualDose: parseFloat(cols[6]),
        manualConc: parseFloat(cols[7]),
        route: cols[8]
      };
    });

    console.log("✅ CSV Loaded:", drugData);

    populateSpecies(); // 🔥 VERY IMPORTANT
  })
  .catch(err => {
    console.error("❌ CSV Load Error:", err);
  });
const speciesSel = document.getElementById("species");
const groupSel = document.getElementById("group");
const drugSel = document.getElementById("drug");
const weightInput = document.getElementById("weight");

const output = document.getElementById("output");
const customOutput = document.getElementById("customOutput");
const manualOnlyOutput = document.getElementById("manualOnlyOutput");

const customMgInput = document.getElementById("customMg");
const vialMgInput = document.getElementById("vialMg");
const vialMlInput = document.getElementById("vialMl");

/* LOAD SPECIES */
for (let s in drugData) {
  speciesSel.innerHTML += `<option value="${s}">${s}</option>`;
}

speciesSel.onchange = () => {
  groupSel.innerHTML = '<option value="">Select Drug Group</option>';
  drugSel.innerHTML = '<option value="">Select Drug</option>';
  output.innerHTML = customOutput.innerHTML = manualOnlyOutput.innerHTML = "";

  for (let g in drugData[speciesSel.value]) {
    groupSel.innerHTML += `<option value="${g}">${g}</option>`;
  }
};

groupSel.onchange = () => {
  drugSel.innerHTML = '<option value="">Select Drug</option>';
  output.innerHTML = customOutput.innerHTML = manualOnlyOutput.innerHTML = "";

  for (let d in drugData[speciesSel.value][groupSel.value]) {
    drugSel.innerHTML += `<option value="${d}">${d}</option>`;
  }
};

/* REFERENCE */
function referenceCalc() {
  const w = parseFloat(weightInput.value);
  if (!w || !drugSel.value) return;

  const drug = drugData[speciesSel.value][groupSel.value][drugSel.value];
  const mgMin = w * drug.refDoseMin;
  const mgMax = w * drug.refDoseMax;


  output.innerHTML = `
  <b>${drugSel.value}</b><br>
  Dose range: ${drug.refDoseMin}–${drug.refDoseMax} mg/kg<br>
  Required drug: <b>${mgMin.toFixed(2)} – ${mgMax.toFixed(2)} mg<br>
  Route: ${drug.route}</br>
`;

}

/* CUSTOM */
function customCalc() {
  const w = parseFloat(weightInput.value);
  const vialMg = parseFloat(vialMgInput.value);
  const vialMl = parseFloat(vialMlInput.value);
const customMg = parseFloat(customMgInput.value);

// 🔥 SIMPLE CALCULATOR MODE
if (customMg && vialMg && vialMl && !w) {
  const conc = vialMg / vialMl;
  const volume = customMg / conc;

  customOutput.innerHTML = `
    Required drug: <b>${customMg.toFixed(2)} mg</b><br>
    Volume to administer: <b>${volume.toFixed(2)} ml</b>
  `;
  return;
}
  if (!vialMg || !vialMl) return;

  const drug = drugData[speciesSel.value][groupSel.value][drugSel.value];
  const requiredMg = customMgInput.value
    ? parseFloat(customMgInput.value)
    : w * drug.customDose;

  const volume = requiredMg / (vialMg / vialMl);

  customOutput.innerHTML = `
    <b>${drugSel.value} (Custom)</b><br>
    Drug required: ${requiredMg.toFixed(2)} mg<br>
    Volume to administer: <b>${volume.toFixed(2)} ml</b>
  `;
}

/* MANUAL */
function manualCalc() {
  const w = parseFloat(weightInput.value);
  if (!w || !drugSel.value) return;

  const drug = drugData[speciesSel.value][groupSel.value][drugSel.value];
  const mg = w * drug.manualDose;
  const volume = mg / drug.manualConc;

 let concLine = "";

if (drugSel.value) {
  const drug = drugData[speciesSel.value][groupSel.value][drugSel.value];

  if (drug && drug.manualConc) {
    concLine = `<br><small style="color:#888;">(FTC ${drug.manualConc} mg/ml)</small>`;
  }
}

manualOnlyOutput.innerHTML = `
  <b>${drugSel.value} (Manual)</b><br>
  Drug required: ${mg.toFixed(2)} mg<br>
  Volume to administer: <b>${volume.toFixed(2)} ml</b>
  ${concLine}
`;
}

/* EVENTS */
drugSel.onchange = () => { referenceCalc(); customCalc(); manualCalc(); };
weightInput.oninput = () => { referenceCalc(); customCalc(); manualCalc(); };
customMgInput.oninput = customCalc;
vialMgInput.oninput = customCalc;
vialMlInput.oninput = customCalc;

function populateSpecies() {
  const speciesSel = document.getElementById("species");

  speciesSel.innerHTML = '<option value="">Select Species</option>';

  for (let s in drugData) {
    speciesSel.innerHTML += `<option value="${s}">${s}</option>`;
  }
}
  


