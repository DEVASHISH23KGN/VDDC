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

  if (toggle && passField) {
    toggle.onclick = () => {
      passField.type = passField.type === "password" ? "text" : "password";
    };
  }
});

// Data structure: drugData[group][drug][species]
let drugData = {};

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

function clearResults() {
  output.innerHTML = "";
  customOutput.innerHTML = "";
  manualOnlyOutput.innerHTML = "";
}

function resetSelect(select, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
}

function getSelectedDrug() {
  const group = groupSel.value;
  const drug = drugSel.value;
  const species = speciesSel.value;

  if (!group || !drug || !species) return null;
  return drugData[group]?.[drug]?.[species] ?? null;
}

// Load the CSV and populate the first selector (Drug Group).
fetch("drug_data.csv")
  .then(res => {
    if (!res.ok) throw new Error(`Could not load drug_data.csv (${res.status})`);
    return res.text();
  })
  .then(csvText => {
    const rows = csvText.trim().split(/\r?\n/);
    rows.shift(); // remove header row

    rows.forEach(row => {
      if (!row.trim()) return;

      const cols = row.split(",");
      // Expected columns: species, group, drug, refDoseMin, refDoseMax,
      // customDose, manualDose, manualConc, route
      if (cols.length < 9) {
        console.warn("Skipping incomplete CSV row:", row);
        return;
      }

      const species = cols[0].trim();
      const group = cols[1].trim();
      const drug = cols[2].trim();

      if (!species || !group || !drug) return;

      drugData[group] ??= {};
      drugData[group][drug] ??= {};

      drugData[group][drug][species] = {
        refDoseMin: parseFloat(cols[3]),
        refDoseMax: parseFloat(cols[4]),
        customDose: parseFloat(cols[5]),
        manualDose: parseFloat(cols[6]),
        manualConc: parseFloat(cols[7]),
        route: cols[8].trim()
      };
    });

    populateGroups();
    console.log("VDDC CSV loaded:", drugData);
  })
  .catch(err => {
    console.error("CSV Load Error:", err);
    output.innerHTML = "Unable to load drug data. Check that drug_data.csv is available and correctly formatted.";
  });

/* STEP 1: LOAD DRUG GROUPS */
function populateGroups() {
  resetSelect(groupSel, "Select Drug Group");
  resetSelect(drugSel, "Select Drug");
  resetSelect(speciesSel, "Select Species");

  Object.keys(drugData).sort().forEach(group => {
    groupSel.add(new Option(group, group));
  });
}

/* STEP 2: WHEN GROUP IS SELECTED, SHOW ONLY ITS DRUGS */
groupSel.onchange = () => {
  resetSelect(drugSel, "Select Drug");
  resetSelect(speciesSel, "Select Species");
  clearResults();

  const group = groupSel.value;
  if (!group || !drugData[group]) return;

  Object.keys(drugData[group]).sort().forEach(drug => {
    drugSel.add(new Option(drug, drug));
  });
};

/* STEP 3: WHEN DRUG IS SELECTED, SHOW ONLY SPECIES WITH DATA FOR IT */
drugSel.onchange = () => {
  resetSelect(speciesSel, "Select Species");
  clearResults();

  const group = groupSel.value;
  const drug = drugSel.value;
  if (!group || !drug || !drugData[group]?.[drug]) return;

  Object.keys(drugData[group][drug]).sort().forEach(species => {
    speciesSel.add(new Option(species, species));
  });
};

/* STEP 4: WHEN SPECIES IS SELECTED, SHOW DOSE INFORMATION */
speciesSel.onchange = () => {
  clearResults();
  referenceCalc();
  customCalc();
  manualCalc();
};

/* REFERENCE DOSE */
function referenceCalc() {
  const drug = getSelectedDrug();
  if (!drug) {
    output.innerHTML = "";
    return;
  }

  const w = parseFloat(weightInput.value);
  const doseRangeValid = Number.isFinite(drug.refDoseMin) && Number.isFinite(drug.refDoseMax);

  let requiredLine = "";
  if (Number.isFinite(w) && w > 0 && doseRangeValid) {
    const mgMin = w * drug.refDoseMin;
    const mgMax = w * drug.refDoseMax;
    requiredLine = `Required drug: <b>${mgMin.toFixed(2)} – ${mgMax.toFixed(2)} mg</b><br>`;
  }

  output.innerHTML = `
    <b>${drugSel.value}</b><br>
    ${doseRangeValid ? `Dose range: ${drug.refDoseMin}–${drug.refDoseMax} mg/kg<br>` : ""}
    ${requiredLine}
    Route: ${drug.route || "Not specified"}
  `;
}

/* VIAL & VOLUME CALCULATOR */
function customCalc() {
  const w = parseFloat(weightInput.value);
  const vialMg = parseFloat(vialMgInput.value);
  const vialMl = parseFloat(vialMlInput.value);
  const customMg = parseFloat(customMgInput.value);
  const hasVial = Number.isFinite(vialMg) && vialMg > 0 &&
                  Number.isFinite(vialMl) && vialMl > 0;

  // Standalone mode: manually enter the required mg and vial strength.
  if (Number.isFinite(customMg) && customMg > 0 && hasVial) {
    const volume = customMg / (vialMg / vialMl);
    customOutput.innerHTML = `
      Required drug: <b>${customMg.toFixed(2)} mg</b><br>
      Volume to administer: <b>${volume.toFixed(2)} mL</b>
    `;
    return;
  }

  const drug = getSelectedDrug();
  if (!drug || !hasVial || !Number.isFinite(w) || w <= 0 ||
      !Number.isFinite(drug.customDose) || drug.customDose <= 0) {
    customOutput.innerHTML = "";
    return;
  }

  const requiredMg = w * drug.customDose;
  const volume = requiredMg / (vialMg / vialMl);

  customOutput.innerHTML = `
    <b>${drugSel.value} — Vial & Volume</b><br>
    Drug required: <b>${requiredMg.toFixed(2)} mg</b><br>
    Volume to administer: <b>${volume.toFixed(2)} mL</b>
  `;
}

/* QUICK CALC PANEL */
function manualCalc() {
  const drug = getSelectedDrug();
  const w = parseFloat(weightInput.value);

  if (!drug || !Number.isFinite(w) || w <= 0 ||
      !Number.isFinite(drug.manualDose) || drug.manualDose <= 0 ||
      !Number.isFinite(drug.manualConc) || drug.manualConc <= 0) {
    manualOnlyOutput.innerHTML = "";
    return;
  }

  const mg = w * drug.manualDose;
  const volume = mg / drug.manualConc;

  manualOnlyOutput.innerHTML = `
    <b>${drugSel.value} — Quick Calc</b><br>
    Drug required: <b>${mg.toFixed(2)} mg</b><br>
    Volume to administer: <b>${volume.toFixed(2)} mL</b>
    <br><small style="color:#888;">Concentration: ${drug.manualConc} mg/mL</small>
  `;
}

/* EVENTS */
weightInput.oninput = () => {
  referenceCalc();
  customCalc();
  manualCalc();
};
customMgInput.oninput = customCalc;
vialMgInput.oninput = customCalc;
vialMlInput.oninput = customCalc;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(reg => {
    reg.update();
  }).catch(err => console.warn("Service worker registration failed:", err));
}
