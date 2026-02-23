const drugData = {
  Canine: {
    NSAID: {
      Meloxicam: {
        refDoseMin: 0.2, // shown in first section (mg/kg)
        refDoseMax: 0.3, // 1️⃣ shown in first section (mg/kg)
        customDose: 0.2, // 2️⃣ used in custom/vial section (mg/kg)
        manualDose: 0.2, // 3️⃣ used in manual section if mg not entered
        manualConc: 5, // mg/ml (hidden, manual section)
        route: "IM / IV / SC / PO"
      }
    },
    "Anti Allergic": {
      CPM: {
        refDoseMin: 0.4, // shown in first section (mg/kg)
        refDoseMax: 2, // 1️⃣ shown in first section (mg/kg)
        customDose: 0.4, // 2️⃣ used in custom/vial section (mg/kg)
        manualDose: 0.4, // 3️⃣ used in manual section if mg not entered
        manualConc: 10, // mg/ml (hidden, manual section)
        route: "IM / IV / SC"
      },
      Avil: {
        refDoseMin: 0.5, // shown in first section (mg/kg)
        refDoseMax: 0.5, // 1️⃣ shown in first section (mg/kg)
        customDose: 0.5, // 2️⃣ used in custom/vial section (mg/kg)
        manualDose: 0.5, // 3️⃣ used in manual section if mg not entered
        manualConc: 22.75, // mg/ml (hidden, manual section)
        route: "IM / IV / SC/ PO"
      }
    },
    "Anti Spasmodics": {
      Dicyclomine: {
        refDoseMin: 0.1, // shown in first section (mg/kg)
        refDoseMax: 0.1, // 1️⃣ shown in first section (mg/kg)
        customDose: 0.1, // 2️⃣ used in custom/vial section (mg/kg)
        manualDose: 0.1, // 3️⃣ used in manual section if mg not entered
        manualConc: 10, // mg/ml (hidden, manual section)
        route: "IM / IV / SC / PO"
      }
    },
    "Anti Emetic": {
      Ondansetron: {
        refDoseMin: 0.5, // shown in first section (mg/kg)
        refDoseMax: 0.5, // 1️⃣ shown in first section (mg/kg)
        customDose: 0.5, // 2️⃣ used in custom/vial section (mg/kg)
        manualDose: 0.5, // 3️⃣ used in manual section if mg not entered
        manualConc:   2, // mg/ml (hidden, manual section)
        route: "IM / IV / SC / PO"
      }
    },
    "Antiarrhythmic": {
      AtropineSulphate: {
        refDoseMin: 0.02, // shown in first section (mg/kg)
        refDoseMax: 0.04, // 1️⃣ shown in first section (mg/kg)
        customDose: 0.02, // 2️⃣ used in custom/vial section (mg/kg)
        manualDose: 0.02, // 3️⃣ used in manual section if mg not entered
        manualConc:   0.06, // mg/ml (hidden, manual section)
        route: "IM / IV / SC / PO"
      }
    },
  },

  Feline: {
    NSAID: {
      Meloxicam: {
        refDoseMin: 0.2, // shown in first section (mg/kg)
        refDoseMax: 0.3, // 1️⃣ shown in first section (mg/kg)
        customDose: 0.2, // 2️⃣ used in custom/vial section (mg/kg)
        manualDose: 0.2, // 3️⃣ used in manual section if mg not entered
        manualConc: 5, // mg/ml (hidden, manual section)
        route: "IM / IV / SC"
      }
    }
  },
};


