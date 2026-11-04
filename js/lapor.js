document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "EcoHub_reports_en_v1";
  const COUNTER_KEY = "EcoHub_report_counter_en";

  // Initial Sample Reports if empty
  const defaultReports = [
    {
      id: "ECO-2026-1001",
      nama: "Ahmad Fauzi",
      email: "ahmad.f@example.com",
      whatsapp: "081234567890",
      kota: "Jakarta",
      jenis: "Air Pollution",
      judul: "Dense Toxic Smoke from Open Waste Burning",
      severity: "Severe",
      lokasi: "Rawa Buaya Street, West Jakarta",
      lat: -6.1558,
      lng: 106.7214,
      deskripsi: "Continuous open combustion of plastic cables and household trash every night creates dense, foul-smelling smog impacting nearby residents' respiratory health.",
      foto: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=600",
      status: "In Progress",
      tanggal: "Nov 03, 2026",
      timestamp: Date.now() - 3600000 * 24,
    },
    {
      id: "ECO-2026-1002",
      nama: "Siti Rahmawati",
      email: "siti.r@example.com",
      whatsapp: "082198765432",
      kota: "Bandung",
      jenis: "Illegal Dumping",
      judul: "Plastic Waste Pile Clogging River Waterway",
      severity: "Moderate",
      lokasi: "Cikapundung Riverbank, Dago, Bandung",
      lat: -6.8856,
      lng: 107.6136,
      deskripsi: "Nighttime illegal dumping along the riverbank has accumulated over a 15-meter stretch, posing serious flash flood hazards as rains intensify.",
      foto: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600",
      status: "Received",
      tanggal: "Nov 04, 2026",
      timestamp: Date.now() - 3600000 * 5,
    },
    {
      id: "ECO-2026-1003",
      nama: "Budi Santoso",
      email: "budi.s@example.com",
      whatsapp: "",
      kota: "Surabaya",
      jenis: "Water Pollution",
      judul: "Foamy Chemical Discharge in Urban Canal",
      severity: "Severe",
      lokasi: "Jagir Canal, Wonokromo, Surabaya",
      lat: -7.3005,
      lng: 112.7482,
      deskripsi: "River water turned murky brownish with dense white foam and a pungent chemical odor. Several dead fish observed near the watergate.",
      foto: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=600",
      status: "Resolved",
      tanggal: "Nov 01, 2026",
      timestamp: Date.now() - 3600000 * 72,
    },
    {
      id: "ECO-2026-1004",
      nama: "Dewi Lestari",
      email: "dewi.l@example.com",
      whatsapp: "085612349876",
      kota: "Denpasar",
      jenis: "Illegal Dumping",
      judul: "Discarded Single-Use Plastic along Public Beach",
      severity: "Minor",
      lokasi: "Sunrise Beach, Sanur, Denpasar",
      lat: -8.6738,
      lng: 115.2631,
      deskripsi: "Leftover plastic drink bottles, food wrappers, and styrofoam containers scattered along the shoreline following the weekend.",
      foto: "",
      status: "Resolved",
      tanggal: "Oct 30, 2026",
      timestamp: Date.now() - 3600000 * 96,
    },
  ];

  function getStoredReports() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReports));
        return defaultReports;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : defaultReports;
    } catch (_) {
      return defaultReports;
    }
  }

  function saveStoredReports(reports) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn("Storage quota full, attempting quota optimization...", e);
      try {
        const optimized = reports.map((rep, idx) => {
          if (idx > 2 && rep.foto && rep.foto.startsWith("data:")) {
            return { ...rep, foto: "" };
          }
          return rep;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(optimized));
      } catch (err2) {
        console.error("Failed to save report to localStorage", err2);
      }
    }
  }

  function getNextReference() {
    let counter = parseInt(localStorage.getItem(COUNTER_KEY), 10);
    if (!Number.isFinite(counter) || counter < 1005) {
      counter = 1005;
    }
    const nextRef = `ECO-2026-${counter}`;
    localStorage.setItem(COUNTER_KEY, String(counter + 1));
    return nextRef;
  }

  // DOM Elements
  const form = document.getElementById("lapor-form");
  const formCard = document.getElementById("report-form-card");
  const successState = document.getElementById("success-state");
  const successName = document.getElementById("success-name");
  const refNumEl = document.getElementById("ref-num");

  const deskripsiInput = document.getElementById("deskripsi");
  const charVal = document.getElementById("char-val");
  const lokasiInput = document.getElementById("lokasi");
  const btnGetLocation = document.getElementById("btn-get-location");

  const dropZone = document.getElementById("drop-zone");
  const fileUpload = document.getElementById("file-upload");
  const filePreview = document.getElementById("file-preview");
  const fileNameSpan = document.getElementById("filename");

  const feedList = document.getElementById("feed-list");
  const checkRefInput = document.getElementById("check-ref-input");
  const checkStatusBtn = document.getElementById("check-status-btn");
  const checkResult = document.getElementById("check-result");

  const reportModal = document.getElementById("report-modal");

  let uploadedImageData = "";
  let pickerMap = null;
  let pickerMarker = null;
  let currentPickerCoords = { lat: -6.2088, lng: 106.8456 };

  let sebaranMap = null;
  let sebaranLayerGroup = null;

  // 1. Initialize Form Picker Map
  function initPickerMap() {
    const mapContainer = document.getElementById("picker-map");
    if (!mapContainer || !window.L) return;

    pickerMap = window.L.map(mapContainer, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([currentPickerCoords.lat, currentPickerCoords.lng], 13);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(pickerMap);

    pickerMarker = window.L.marker([currentPickerCoords.lat, currentPickerCoords.lng], {
      draggable: true,
      title: "Drag pin to mark issue location",
    }).addTo(pickerMap);

    function onMarkerMoved(latlng) {
      currentPickerCoords = { lat: latlng.lat, lng: latlng.lng };
      reverseGeocode(latlng.lat, latlng.lng);
    }

    pickerMarker.on("dragend", () => {
      onMarkerMoved(pickerMarker.getLatLng());
    });

    pickerMap.on("click", (e) => {
      pickerMarker.setLatLng(e.latlng);
      onMarkerMoved(e.latlng);
    });
  }

  // Reverse Geocoding with Nominatim
  async function reverseGeocode(lat, lng) {
    if (lokasiInput) {
      lokasiInput.placeholder = "Looking up street/location name...";
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(",").map((s) => s.trim());
          const cleanName = parts.slice(0, 4).join(", ");
          if (lokasiInput) {
            lokasiInput.value = cleanName;
            return;
          }
        }
      }
    } catch (_) {
      // Fallback below
    }
    if (lokasiInput && !lokasiInput.value) {
      lokasiInput.value = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  }

  // Geolocation Button
  btnGetLocation?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support automatic location detection.");
      return;
    }
    btnGetLocation.disabled = true;
    btnGetLocation.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        btnGetLocation.disabled = false;
        btnGetLocation.innerHTML = '<i class="fas fa-crosshairs"></i>';
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        currentPickerCoords = { lat, lng };

        if (pickerMap && pickerMarker) {
          pickerMap.setView([lat, lng], 15);
          pickerMarker.setLatLng([lat, lng]);
        }
        reverseGeocode(lat, lng);
      },
      (err) => {
        btnGetLocation.disabled = false;
        btnGetLocation.innerHTML = '<i class="fas fa-crosshairs"></i>';
        alert("Could not retrieve your location. Please check your browser location permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });

  // 2. Character Counter
  deskripsiInput?.addEventListener("input", () => {
    if (charVal) {
      charVal.textContent = String(deskripsiInput.value.length);
    }
  });

  // 3. Drag and Drop File Upload
  if (dropZone && fileUpload) {
    ["dragenter", "dragover"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
      });
    });

    dropZone.addEventListener("drop", (e) => {
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    dropZone.addEventListener("click", () => {
      fileUpload.click();
    });

    fileUpload.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (fileNameSpan && filePreview) {
      fileNameSpan.textContent = file.name;
      filePreview.classList.remove("hidden");
      filePreview.style.display = "flex";
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawData = event.target.result;
      const img = new Image();
      img.onload = () => {
        try {
          const maxDimension = 1000;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          uploadedImageData = canvas.toDataURL("image/jpeg", 0.78);
        } catch (err) {
          console.warn("Failed to compress image with canvas, using raw data", err);
          uploadedImageData = rawData;
        }
      };
      img.onerror = () => {
        uploadedImageData = rawData;
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  }

  // Remove File
  const removeFileBtn = document.getElementById("remove-file-btn");
  removeFileBtn?.addEventListener("click", () => {
    uploadedImageData = "";
    if (fileUpload) fileUpload.value = "";
    if (filePreview) {
      filePreview.classList.add("hidden");
      filePreview.style.display = "none";
    }
  });

  // 4. Form Submission
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama")?.value.trim() || "Anonymous";
    const email = document.getElementById("email")?.value.trim() || "";
    const whatsapp = document.getElementById("whatsapp")?.value.trim() || "";
    const kota = document.getElementById("kota")?.value || "Indonesia";
    const jenis = document.getElementById("jenis")?.value || "Environmental Issue";
    const judul = document.getElementById("judul")?.value.trim() || jenis;
    const severityEl = document.querySelector('input[name="severity"]:checked');
    const severity = severityEl ? severityEl.value : "Moderate";
    const lokasi = lokasiInput?.value.trim() || `${kota}, Indonesia`;
    const deskripsi = deskripsiInput?.value.trim() || "";

    const submitBtn = form.querySelector(".submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Report...';
    }

    setTimeout(() => {
      const newRef = getNextReference();
      const newReport = {
        id: newRef,
        nama,
        email,
        whatsapp,
        kota,
        jenis,
        judul,
        severity,
        lokasi,
        lat: currentPickerCoords.lat,
        lng: currentPickerCoords.lng,
        deskripsi,
        foto: uploadedImageData,
        status: "Received",
        tanggal: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        timestamp: Date.now(),
      };

      const reports = getStoredReports();
      reports.unshift(newReport);
      saveStoredReports(reports);

      // Render success state
      if (form) form.classList.add("hidden");
      if (successState) {
        successState.classList.remove("hidden");
        successState.style.display = "block";
      }
      if (successName) successName.textContent = nama;
      if (refNumEl) refNumEl.textContent = newRef;

      // Update Map & Feed
      renderFeedList();
      renderSebaranMap();

      if (formCard) {
        formCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 600);
  });

  // 5. Initialize Issue Map
  function initSebaranMap() {
    const mapEl = document.getElementById("lapor-map");
    if (!mapEl || !window.L) return;

    sebaranMap = window.L.map(mapEl, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([-2.5, 118], 4);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(sebaranMap);

    sebaranLayerGroup = window.L.layerGroup().addTo(sebaranMap);
    renderSebaranMap();
  }

  function renderSebaranMap() {
    if (!sebaranMap || !sebaranLayerGroup || !window.L) return;
    sebaranLayerGroup.clearLayers();

    const reports = getStoredReports();
    const bounds = [];

    reports.forEach((item) => {
      if (!Number.isFinite(item.lat) || !Number.isFinite(item.lng)) return;

      bounds.push([item.lat, item.lng]);

      const markerColor =
        item.severity === "Severe" || item.severity === "Parah"
          ? "#DC2626"
          : item.severity === "Moderate" || item.severity === "Sedang"
          ? "#D97706"
          : "#2D5A27";

      const popupHtml = `
        <div style="font-family: inherit; font-size: 13px; min-width: 180px;">
          <strong style="color: #1f2a1f; display: block; margin-bottom: 4px;">${item.judul}</strong>
          <span style="font-size: 11px; color: #666; display: block; margin-bottom: 6px;">
            <i class="fas fa-map-marker-alt"></i> ${item.lokasi}
          </span>
          <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; background: ${markerColor}; color: #fff;">
            ${item.severity} • ${item.status}
          </span>
          <div style="margin-top: 8px;">
            <a href="#" onclick="window.openReportModal('${item.id}'); return false;" style="color: #2D5A27; font-weight: 600; text-decoration: none;">
              View Details &rarr;
            </a>
          </div>
        </div>
      `;

      window.L.circleMarker([item.lat, item.lng], {
        radius: 7,
        fillColor: markerColor,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      })
        .bindPopup(popupHtml)
        .addTo(sebaranLayerGroup);
    });

    if (bounds.length > 0) {
      sebaranMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  }

  // 6. Render Latest Reports Feed
  function renderFeedList() {
    if (!feedList) return;

    const reports = getStoredReports();
    if (!reports.length) {
      feedList.innerHTML = '<p class="text-muted" style="font-size: 13px;">No reports submitted yet.</p>';
      return;
    }

    feedList.innerHTML = reports
      .slice(0, 8)
      .map((item) => {
        const catClass = (item.jenis || "other")
          .toLowerCase()
          .replace(/\s+/g, "-");
        const statusClass = (item.status || "received")
          .toLowerCase()
          .replace(/\s+/g, "");

        return `
          <div class="feed-item" onclick="window.openReportModal('${item.id}')">
            <div class="feed-header">
              <span class="feed-category ${catClass}">${item.jenis}</span>
              <span class="feed-time">${item.tanggal}</span>
            </div>
            <div class="feed-title">${item.judul}</div>
            <div class="feed-location">
              <i class="fas fa-map-marker-alt" style="color: #2D5A27;"></i>
              <span>${item.lokasi}</span>
            </div>
            <div class="feed-footer">
              <span class="feed-ref">${item.id}</span>
              <span class="status-pill ${statusClass}">${item.status}</span>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // 7. Check Report Status Search
  checkStatusBtn?.addEventListener("click", () => {
    const query = (checkRefInput?.value || "").trim().toUpperCase();
    if (!query) {
      if (checkResult) {
        checkResult.className = "check-result-box not-found";
        checkResult.innerHTML = "Please enter your report reference ID.";
        checkResult.classList.remove("hidden");
      }
      return;
    }

    const reports = getStoredReports();
    const found = reports.find((item) => item.id.toUpperCase() === query);

    if (!found) {
      if (checkResult) {
        checkResult.className = "check-result-box not-found";
        checkResult.innerHTML = `Report with reference <strong>${query}</strong> was not found.`;
        checkResult.classList.remove("hidden");
      }
      return;
    }

    const statusClass = (found.status || "received").toLowerCase().replace(/\s+/g, "");
    if (checkResult) {
      checkResult.className = "check-result-box";
      checkResult.innerHTML = `
        <div style="margin-bottom: 6px;">
          <strong>${found.judul}</strong>
        </div>
        <div style="margin-bottom: 8px; font-size: 12px; color: var(--color-text-secondary);">
          ${found.lokasi}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="status-pill ${statusClass}">${found.status}</span>
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;" onclick="window.openReportModal('${found.id}')">Details</button>
        </div>
      `;
      checkResult.classList.remove("hidden");
    }
  });

  // 8. Modal Detail
  window.openReportModal = function (reportId) {
    const reports = getStoredReports();
    const found = reports.find((item) => item.id === reportId);
    if (!found || !reportModal) return;

    document.getElementById("modal-type").textContent = found.judul;
    document.getElementById("modal-ref").textContent = found.id;
    document.getElementById("modal-date").textContent = found.tanggal;
    document.getElementById("modal-loc").textContent = found.lokasi;

    const statusPill = document.getElementById("modal-status-pill");
    if (statusPill) {
      statusPill.textContent = found.status;
      statusPill.className = `status-pill ${(found.status || "received").toLowerCase().replace(/\s+/g, "")}`;
    }

    const severityVal = document.getElementById("modal-severity");
    if (severityVal) {
      severityVal.textContent = `${found.severity} (${found.jenis})`;
    }

    const reporterVal = document.getElementById("modal-reporter");
    if (reporterVal) {
      reporterVal.textContent = `${found.nama} • ${found.kota}`;
    }

    document.getElementById("modal-desc").textContent = found.deskripsi;

    const imageContainer = document.getElementById("modal-image-container");
    if (imageContainer) {
      if (found.foto) {
        imageContainer.innerHTML = `<img src="${found.foto}" alt="Photo Evidence" class="modal-image" />`;
        imageContainer.style.display = "block";
      } else {
        imageContainer.innerHTML = "";
        imageContainer.style.display = "none";
      }
    }

    reportModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeReportModal = function () {
    if (!reportModal) return;
    reportModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", window.closeReportModal);
  });

  reportModal?.addEventListener("click", (e) => {
    if (e.target === reportModal) {
      window.closeReportModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && reportModal?.classList.contains("active")) {
      window.closeReportModal();
    }
  });

  // Initialize
  initPickerMap();
  initSebaranMap();
  renderFeedList();
});
