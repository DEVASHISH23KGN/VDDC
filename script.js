document.addEventListener("DOMContentLoaded", () => { const SHEET_ID = "14HY9sD31hufPtcSd5yGsunPsqtbMqo63drTNaQl_duc";
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;
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
  Route: ${drug.route}<br>
  Required drug: <b>${mgMin.toFixed(2)} – ${mgMax.toFixed(2)} mg</b>
`;

}

/* CUSTOM */
function customCalc() {
  const w = parseFloat(weightInput.value);
  const vialMg = parseFloat(vialMgInput.value);
  const vialMl = parseFloat(vialMlInput.value);
  if (!w || !drugSel.value || !vialMg || !vialMl) return;

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

  manualOnlyOutput.innerHTML = `
    <b>${drugSel.value} (Manual)</b><br>
    Drug required: ${mg.toFixed(2)} mg<br>
    Volume to administer: <b>${volume.toFixed(2)} ml</b>
  `;
}

/* EVENTS */
drugSel.onchange = () => { referenceCalc(); customCalc(); manualCalc(); };
weightInput.oninput = () => { referenceCalc(); customCalc(); manualCalc(); };
customMgInput.oninput = customCalc;
vialMgInput.oninput = customCalc;
vialMlInput.oninput = customCalc;

  // ALL your existing JS code goes INSIDE here

});

  

