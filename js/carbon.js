document.addEventListener("DOMContentLoaded", () => {
  const carbonForm = document.getElementById("carbon-form");
  const resultBox = document.getElementById("result-box");
  const placeholder = document.getElementById("result-placeholder");
  const co2Span = document.getElementById("co2-value");
  const treeEquiv = document.getElementById("tree-equiv");
  const recList = document.getElementById("rec-list");
  const verdictBanner = document.getElementById("verdict-banner");
  const resetBtn = document.getElementById("reset-calc");

  if (!carbonForm) return;

  carbonForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get values
    const transport = document.getElementById("transport").value;
    const distance = parseFloat(document.getElementById("distance").value) || 0;
    const electricity =
      parseFloat(document.getElementById("electricity").value) || 0;
    const diet = document.getElementById("diet").value;
    const waste = document.getElementById("waste").value;

    // Calculate
    const result = calculateCarbon(
      transport,
      distance,
      electricity,
      diet,
      waste,
    );

    // Show result
    displayResult(result);
  });

  resetBtn.addEventListener("click", () => {
    carbonForm.reset();
    resultBox.classList.add("hidden");
    placeholder.classList.remove("hidden");
    placeholder.style.display = "flex"; // Restore flex display
  });

  function calculateCarbon(transport, distance, electricity, diet, waste) {
    const transportFactors = {
      motor: 0.113,
      mobil: 0.21,
      umum: 0.089,
      sepeda: 0,
      jalan: 0,
    };
    const dietFactors = { omnivora: 7.19, vegetarian: 3.81, vegan: 2.89 };
    const wasteFactors = { tidak: 1.5, sebagian: 0.9, penuh: 0.3 };

    const transportCO2 = (transportFactors[transport] || 0) * distance;
    const electricityCO2 = (electricity / 30) * 0.82; // Emisi listrik harian (kg CO2e)
    const safeDiet = dietFactors[diet] || 0; // Estimasi emisi konsumsi harian (kg CO2e)
    const safeWaste = wasteFactors[waste] || 0; // Estimasi emisi sampah harian (kg CO2e)

    const total = transportCO2 + electricityCO2 + safeDiet + safeWaste;
    return total.toFixed(2);
  }

  function displayResult(total) {
    placeholder.classList.add("hidden");
    placeholder.style.display = "none";
    resultBox.classList.remove("hidden");

    // Animate count up
    const target = parseFloat(total);
    let current = 0;
    const duration = 1000;
    const stepTime = 20;
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      co2Span.innerText = current.toFixed(2);
    }, stepTime);

    // Estimasi serapan pohon: ~0.06 kg CO2 per hari per pohon (~22 kg/tahun)
    const trees = Math.ceil(target / 0.06);
    treeEquiv.innerText = trees;

    // Verdict
    let verdict = "RENDAH";
    let color = "var(--color-green-primary)";

    if (target > 10 && target <= 20) {
      verdict = "MENENGAH";
      color = "var(--color-amber)";
    } else if (target > 20) {
      verdict = "TINGGI";
      color = "#e53e3e"; // Distinct Red for High Emission
    }

    verdictBanner.innerText = verdict;
    verdictBanner.style.backgroundColor = color;
    co2Span.style.color = color;

    // Add glow effect to the number if it's high for better urgency UI
    if (target > 20) {
      co2Span.style.textShadow = "0 0 10px rgba(229, 62, 62, 0.3)";
    } else {
      co2Span.style.textShadow = "none";
    }

    // Recommendations
    let recs = [];
    const transport = document.getElementById("transport").value;
    const electricity = parseFloat(
      document.getElementById("electricity").value,
    );

    if (transport === "mobil")
      recs.push("Coba gunakan transportasi umum atau carpooling 2x seminggu.");
    if (electricity > 100)
      recs.push(
        "Matikan alat elektronik saat tidak dipakai. Pertimbangkan lampu LED.",
      );
    if (document.getElementById("diet").value === "omnivora")
      recs.push(
        "Kurangi konsumsi daging merah untuk memangkas emisi signifikan.",
      );
    if (document.getElementById("waste").value === "tidak")
      recs.push("Mulai memilah sampah organik dan anorganik di rumah.");
    if (recs.length === 0)
      recs.push("Pertahankan gaya hidup ramah lingkunganmu!");

    recList.innerHTML = recs.map((r) => `<li>${r}</li>`).join("");
  }
});


