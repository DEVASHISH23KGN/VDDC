const drugData = {
  Canine: {
    NSAID: {
      Meloxicam: {
        refDoseMin: 0.2,  // shown in first section (mg/kg)
        refDoseMax: 0.3, // 1️⃣ shown in first section (mg/kg)
        customDose: 0.2,    // 2️⃣ used in custom/vial section (mg/kg)
        manualDose: 0.2,     // 3️⃣ used in manual section if mg not entered
        manualConc: 5,       // mg/ml (hidden, manual section)
        route: "IM / IV / SC"
      }
    },
    "Anti Allergic": {
      CPM: {
        refDoseMin: 0.4,  // shown in first section (mg/kg)
        refDoseMax: 2, // 1️⃣ shown in first section (mg/kg)
        customDose: 0.4,    // 2️⃣ used in custom/vial section (mg/kg)
        manualDose: 0.4,     // 3️⃣ used in manual section if mg not entered
        manualConc: 10,       // mg/ml (hidden, manual section)
        route: "IM / IV / SC"
      }
    }
  },

Feline: {
  NSAID: {
      Meloxicam: {
        refDoseMin: 0.2,  // shown in first section (mg/kg)
        refDoseMax: 0.3, // 1️⃣ shown in first section (mg/kg)
        customDose: 0.2,    // 2️⃣ used in custom/vial section (mg/kg)
        manualDose: 0.2,     // 3️⃣ used in manual section if mg not entered
        manualConc: 5,       // mg/ml (hidden, manual section)
        route: "IM / IV / SC"
      }
    }
  },
};

