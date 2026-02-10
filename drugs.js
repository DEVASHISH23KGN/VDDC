let drugData = {};

fetch(SHEET_URL)
  .then(res => res.json())
  .then(rows => {
    rows.forEach(r => {
      if (!drugData[r.species]) drugData[r.species] = {};
      if (!drugData[r.species][r.group]) drugData[r.species][r.group] = {};

      drugData[r.species][r.group][r.drug] = {
        refDoseMin: parseFloat(r.refMin),
        refDoseMax: parseFloat(r.refMax),
        customDose: parseFloat(r.customDose),
        manualDose: parseFloat(r.manualDose),
        manualConc: parseFloat(r.mgPerMl),
        route: r.route
      };
    });

    populateSpecies(); // call your existing function
  });

