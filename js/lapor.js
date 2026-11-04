document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "EcoHub_reports_v1";
  const COUNTER_KEY = "EcoHub_report_counter";

  // Initial Sample Reports if empty
  const defaultReports = [
    {
      id: "ECO-2026-1001",
      nama: "Ahmad Fauzi",
      email: "ahmad.f@example.com",
      whatsapp: "081234567890",
      kota: "Jakarta",
      jenis: "Polusi Udara",
      judul: "Asap Tebal Pembakaran Sampah Ilegal",
      severity: "Parah",
      lokasi: "Jl. Rawa Buaya, Cengkareng, Jakarta Barat",
      lat: -6.1558,
      lng: 106.7214,
      deskripsi: "Pembakaran sampah kabel dan plastik terbuka setiap malam hari menyebabkan kabut asap pekat dan bau menyengat hingga mengganggu pernapasan warga perumahan sekitar.",
      foto: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=600",
      status: "Dalam Proses",
      tanggal: "03 Nov 2026",
      timestamp: Date.now() - 3600000 * 24,
    },
    {
      id: "ECO-2026-1002",
      nama: "Siti Rahmawati",
      email: "siti.r@example.com",
      whatsapp: "082198765432",
      kota: "Bandung",
      jenis: "Sampah Liar",
      judul: "Tumpukan Sampah Plastik Menutup Saluran Air",
      severity: "Sedang",
      lokasi: "Bantaran Sungai Cikapundung, Dago, Bandung",
      lat: -6.8856,
      lng: 107.6136,
      deskripsi: "Warga membuang sampah liar di pinggir sungai saat malam. Kondisi menumpuk hingga 15 meter dan rawan memicu banjir saat curah hujan meningkat.",
      foto: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600",
      status: "Diterima",
      tanggal: "04 Nov 2026",
      timestamp: Date.now() - 3600000 * 5,
    },
    {
      id: "ECO-2026-1003",
      nama: "Budi Santoso",
      email: "budi.s@example.com",
      whatsapp: "",
      kota: "Surabaya",
      jenis: "Pencemaran Air",
      judul: "Limbah Berbusa dan Berbau di Kali Jagir",
      severity: "Parah",
      lokasi: "Kali Jagir, Wonokromo, Surabaya",
      lat: -7.3005,
      lng: 112.7482,
      deskripsi: "Air sungai berubah warna kecokelatan berbusa putih dengan bau kimia yang tajam. Sejumlah ikan terlihat mati mengapung di dekat pintu air.",
      foto: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=600",
      status: "Selesai",
      tanggal: "01 Nov 2026",
      timestamp: Date.now() - 3600000 * 72,
    },
    {
      id: "ECO-2026-1004",
      nama: "Dewi Lestari",
      email: "dewi.l@example.com",
      whatsapp: "085612349876",
      kota: "Denpasar",
      jenis: "Sampah Liar",
      judul: "Sampah Plastik Wisatawan di Pesisir Pantai",
      severity: "Ringan",
      lokasi: "Pantai Matahari Terbit, Sanur, Denpasar",
      lat: -8.6738,
      lng: 115.2631,
      deskripsi: "Sisa botol kemasan plastik dan styrofoam berserakan di sepanjang bibir pantai setelah akhir pekan.",
      foto: "",
      status: "Selesai",
      tanggal: "30 Okt 2026",
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
      console.warn("Gagal menyimpan laporan", e);
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
      title: "Geser pin untuk menandai lokasi",
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

  // Reverse Geocoding with Nominatim (with coordinate fallback)
  async function reverseGeocode(lat, lng) {
    if (lokasiInput) {
      lokasiInput.placeholder = "Mencari nama jalan/lokasi...";
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "id" } }
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
      lokasiInput.value = `Koordinat: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  }

  // Geolocation Button
  btnGetLocation?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung deteksi lokasi otomatis.");
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
        alert("Tidak dapat mengambil lokasi Anda. Pastikan izin lokasi diaktifkan.");
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
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    });

    fileUpload.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    if (!file || !file.type.startsWith("image/")) {
      alert("Silakan unggah file gambar (JPG, PNG, WebP).");
      return;
    }
    if (fileNameSpan && filePreview) {
      fileNameSpan.textContent = file.name;
      filePreview.classList.remove("hidden");
      filePreview.style.display = "flex";
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      uploadedImageData = event.target.result;
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

    const nama = document.getElementById("nama")?.value.trim() || "Anonim";
    const email = document.getElementById("email")?.value.trim() || "";
    const whatsapp = document.getElementById("whatsapp")?.value.trim() || "";
    const kota = document.getElementById("kota")?.value || "Indonesia";
    const jenis = document.getElementById("jenis")?.value || "Isu Lingkungan";
    const judul = document.getElementById("judul")?.value.trim() || jenis;
    const severityEl = document.querySelector('input[name="severity"]:checked');
    const severity = severityEl ? severityEl.value : "Sedang";
    const lokasi = lokasiInput?.value.trim() || `${kota}, Indonesia`;
    const deskripsi = deskripsiInput?.value.trim() || "";

    const submitBtn = form.querySelector(".submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses Laporan...';
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
        status: "Diterima",
        tanggal: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
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

  // 5. Initialize Peta Sebaran Isu
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
        item.severity === "Parah"
          ? "#DC2626"
          : item.severity === "Sedang"
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
              Lihat Detail &rarr;
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
      feedList.innerHTML = '<p class="text-muted" style="font-size: 13px;">Belum ada laporan masuk.</p>';
      return;
    }

    feedList.innerHTML = reports
      .slice(0, 8)
      .map((item) => {
        const catClass = (item.jenis || "lainnya")
          .toLowerCase()
          .replace(/\s+/g, "-");
        const statusClass = (item.status || "diterima")
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

  // 7. Cek Status Laporan Search
  checkStatusBtn?.addEventListener("click", () => {
    const query = (checkRefInput?.value || "").trim().toUpperCase();
    if (!query) {
      if (checkResult) {
        checkResult.className = "check-result-box not-found";
        checkResult.innerHTML = "Masukkan nomor referensi laporan.";
        checkResult.classList.remove("hidden");
      }
      return;
    }

    const reports = getStoredReports();
    const found = reports.find((item) => item.id.toUpperCase() === query);

    if (!found) {
      if (checkResult) {
        checkResult.className = "check-result-box not-found";
        checkResult.innerHTML = `Laporan dengan referensi <strong>${query}</strong> tidak ditemukan.`;
        checkResult.classList.remove("hidden");
      }
      return;
    }

    const statusClass = (found.status || "diterima").toLowerCase().replace(/\s+/g, "");
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
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;" onclick="window.openReportModal('${found.id}')">Detail</button>
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
      statusPill.className = `status-pill ${(found.status || "diterima").toLowerCase().replace(/\s+/g, "")}`;
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
        imageContainer.innerHTML = `<img src="${found.foto}" alt="Bukti Foto" class="modal-image" />`;
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
