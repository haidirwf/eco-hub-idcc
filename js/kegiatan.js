document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "Eco Hub_community_activities_v1";
  const JOINED_KEY = "Eco Hub_community_joined_v1";

  const CITIES = {
    Jakarta: { lat: -6.2088, lon: 106.8456 },
    Bandung: { lat: -6.9175, lon: 107.6191 },
    Surabaya: { lat: -7.2575, lon: 112.7521 },
    Denpasar: { lat: -8.6705, lon: 115.2126 },
    Semarang: { lat: -6.9667, lon: 110.4167 },
    Yogyakarta: { lat: -7.7956, lon: 110.3695 },
    Medan: { lat: 3.5952, lon: 98.6722 },
    Makassar: { lat: -5.1477, lon: 119.4328 },
  };

  const DEFAULT_ACTIVITIES = [
    {
      id: "act_jkt_01",
      title: "Aksi Bersih Sungai Ciliwung & Pilah Sampah",
      datetime: "2026-11-08T07:30",
      what: "Gotong royong membersihkan sampah plastik di bantaran Sungai Ciliwung dan pemilahan material daur ulang bersama warga.",
      where: "Bantaran Sungai Ciliwung, Manggarai, Jakarta Selatan",
      whereCoords: { lat: -6.2088, lng: 106.8456, label: "Manggarai, Jakarta Selatan" },
      creator: "Komunitas Ciliwung Bersih",
      participants: 28,
      createdAt: "2026-11-01T08:00:00.000Z",
    },
    {
      id: "act_bdg_01",
      title: "Penanaman 200 Bibit Pohon di Kawasan Dago Atas",
      datetime: "2026-11-09T08:00",
      what: "Penghijauan lereng bukit Dago untuk memperkuat daerah resapan air Bandung Utara dan mencegah erosi tanah.",
      where: "Dago Pakar, Ciburial, Bandung",
      whereCoords: { lat: -6.8650, lng: 107.6250, label: "Dago Pakar, Bandung" },
      creator: "Bandung Eco Green",
      participants: 45,
      createdAt: "2026-11-02T09:00:00.000Z",
    },
    {
      id: "act_sby_01",
      title: "Restorasi Mangrove & Bersih Pesisir Wonorejo",
      datetime: "2026-11-10T06:30",
      what: "Ekowisata dan aksi penanaman bibit bakau serta pengumpulan sampah plastik di pesisir Timur Surabaya.",
      where: "Ekowisata Mangrove Wonorejo, Rungkut, Surabaya",
      whereCoords: { lat: -7.3080, lng: 112.8210, label: "Wonorejo, Surabaya" },
      creator: "Sahabat Pesisir Surabaya",
      participants: 36,
      createdAt: "2026-11-02T10:00:00.000Z",
    },
    {
      id: "act_dps_01",
      title: "Beach Clean Up & Edukasi Pilah Sampah Sanur",
      datetime: "2026-11-11T06:00",
      what: "Aksi bersih pantai pagi hari di Pantai Sanur bersama warga lokal dan turis untuk mengurangi polusi mikroplastik.",
      where: "Pantai Matahari Terbit, Sanur, Denpasar",
      whereCoords: { lat: -8.6738, lng: 115.2631, label: "Sanur, Denpasar" },
      creator: "Bali Clean Waves",
      participants: 52,
      createdAt: "2026-11-03T07:00:00.000Z",
    },
    {
      id: "act_smg_01",
      title: "Pemasangan Biopori Warga & Kompos Lingkungan",
      datetime: "2026-11-12T08:30",
      what: "Workshop dan pembuatan 50 lubang biopori percontohan di RW 04 untuk resapan air dan pengolahan sampah organik.",
      where: "Banyumanik, Semarang Selatan",
      whereCoords: { lat: -7.0600, lng: 110.4150, label: "Banyumanik, Semarang" },
      creator: "Kader Lingkungan Mandiri",
      participants: 22,
      createdAt: "2026-11-03T08:00:00.000Z",
    },
    {
      id: "act_ygy_01",
      title: "Sepeda Bersama & Plogging Kali Code",
      datetime: "2026-11-13T06:30",
      what: "Gowes santai rendah emisi menyusuri Kali Code dilanjutkan dengan jogging sambil memungut sampah (plogging).",
      where: "Kawasan Kali Code, Gondokusuman, Yogyakarta",
      whereCoords: { lat: -7.7828, lng: 110.3725, label: "Kali Code, Yogyakarta" },
      creator: "Jogja Hijau Bersepeda",
      participants: 31,
      createdAt: "2026-11-03T09:00:00.000Z",
    },
    {
      id: "act_mdn_01",
      title: "Revitalisasi Taman Kota & Drop Point Sampah Elektronik",
      datetime: "2026-11-14T09:00",
      what: "Pembuatan spot drop point e-waste dan penataan tanaman hias penyerap polutan di area publik warga.",
      where: "Taman Cadika, Medan Johor, Medan",
      whereCoords: { lat: 3.5350, lng: 98.6650, label: "Medan Johor, Medan" },
      creator: "Gerakan Medan Asri",
      participants: 19,
      createdAt: "2026-11-03T11:00:00.000Z",
    },
    {
      id: "act_mks_01",
      title: "Bersih Pantai Losari & Kampanye Kurangi Kantong Plastik",
      datetime: "2026-11-15T07:00",
      what: "Aksi gotong royong memungut sampah di anjungan Pantai Losari serta pembagian kantong belanja ramah lingkungan.",
      where: "Anjungan Pantai Losari, Makassar",
      whereCoords: { lat: -5.1450, lng: 119.4080, label: "Pantai Losari, Makassar" },
      creator: "Makassar Green Community",
      participants: 40,
      createdAt: "2026-11-03T12:00:00.000Z",
    },
    {
      id: "act_jkt_02",
      title: "Workshop Urban Farming & Kompos Sayur Dapur",
      datetime: "2026-11-16T09:00",
      what: "Belajar membuat instalasi hidroponik sederhana dari pipa bekas dan budidaya sayuran pekarangan sempit.",
      where: "RPTRA Kalijodo, Penjaringan, Jakarta Utara",
      whereCoords: { lat: -6.1415, lng: 106.7905, label: "Kalijodo, Jakarta Utara" },
      creator: "Urban Farming ID",
      participants: 25,
      createdAt: "2026-11-03T13:00:00.000Z",
    },
  ];

  const form = document.getElementById("kegiatan-form");
  const titleInput = document.getElementById("activity-title");
  const datetimeInput = document.getElementById("activity-datetime");
  const whatInput = document.getElementById("activity-what");
  const creatorInput = document.getElementById("activity-creator");
  const activityMapEl = document.getElementById("activity-map");
  const activityLocationDisplay = document.getElementById("activity-location-display");
  const feedbackEl = document.getElementById("form-feedback");
  const createBtn = document.getElementById("create-activity-btn");
  const openFormBtn = document.getElementById("open-form-btn");
  const closeFormBtn = document.getElementById("close-form-btn");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalOverlay = document.getElementById("activity-modal");
  const formCard = document.getElementById("create-form-card");

  const listEl = document.getElementById("activity-list");
  const totalActivitiesEl = document.getElementById("total-activities");
  const upcomingActivitiesEl = document.getElementById("upcoming-activities");
  const totalParticipantsEl = document.getElementById("total-participants");

  const formMapState = {
    map: null,
    marker: null,
    location: null,
  };

  function showForm() {
    if (modalOverlay) {
      modalOverlay.classList.remove("hidden");
      modalOverlay.classList.add("active");
    }
    if (formCard) {
      formCard.classList.remove("hidden");
    }
    document.body.style.overflow = "hidden";
    initActivityMap();
    setTimeout(() => {
      formMapState.map?.invalidateSize();
    }, 200);
    setTimeout(() => titleInput?.focus(), 150);
  }

  function hideForm() {
    if (modalOverlay) {
      modalOverlay.classList.remove("active");
      modalOverlay.classList.add("hidden");
    }
    document.body.style.overflow = "";
    setFeedback("");
  }

  function haversineDistanceKm(from, to) {
    const R = 6371;
    const dLat = ((to.lat - from.lat) * Math.PI) / 180;
    const dLon = ((to.lng - from.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((from.lat * Math.PI) / 180) * Math.cos((to.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function nearestCityForPoint(point) {
    let nearest = "Jakarta";
    let minDistance = Infinity;
    Object.entries(CITIES).forEach(([name, coord]) => {
      const dist = haversineDistanceKm(point, { lat: coord.lat, lng: coord.lon });
      if (dist < minDistance) {
        minDistance = dist;
        nearest = name;
      }
    });
    return nearest;
  }

  function formatMapLocation(point) {
    if (!point) return "Belum ada titik dipilih.";
    return point.label || `Sekitar ${nearestCityForPoint(point)}, Indonesia`;
  }

  function updateMapLocationDisplay() {
    if (!activityLocationDisplay) return;
    if (!formMapState.location) {
      activityLocationDisplay.textContent = "Klik titik pada peta di atas untuk memilih lokasi.";
      return;
    }
    activityLocationDisplay.textContent = formatMapLocation(formMapState.location);
  }

  async function reverseGeocodeActivity(lat, lng) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "id" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const addr = data.address || {};
          const road = addr.road || addr.pedestrian || addr.suburb || "";
          const village = addr.village || addr.neighbourhood || addr.suburb || "";
          const city = addr.city || addr.town || addr.municipality || addr.county || "";
          const parts = [road, village, city].filter(Boolean);
          return parts.length > 0 ? parts.join(", ") : data.display_name.split(",").slice(0, 3).join(",");
        }
      }
    } catch (_) {}
    return `Sekitar ${nearestCityForPoint({ lat, lng })}, Indonesia`;
  }

  function initActivityMap() {
    if (!activityMapEl || formMapState.map) return;

    if (!window.L) {
      activityMapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--color-text-secondary);font-size:14px;padding:20px;text-align:center;">Peta memerlukan koneksi internet untuk memuat Leaflet.</div>';
      return;
    }

    const map = window.L.map(activityMapEl, { zoomControl: true }).setView([-2.5, 118], 5);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    map.on("click", (event) => {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      const nearestCity = nearestCityForPoint({ lat, lng });

      const point = {
        lat,
        lng,
        label: `Sekitar ${nearestCity}, Indonesia`,
      };
      formMapState.location = point;

      if (formMapState.marker) {
        map.removeLayer(formMapState.marker);
      }
      formMapState.marker = window.L.marker([lat, lng], { title: "Lokasi Kegiatan" })
        .addTo(map)
        .bindPopup("<strong>Lokasi Terpilih:</strong><br>Sedang mencari alamat...");

      updateMapLocationDisplay();

      // Reverse geocode asynchronously to show real road/village address
      reverseGeocodeActivity(lat, lng).then((addr) => {
        if (formMapState.location && formMapState.location.lat === lat && formMapState.location.lng === lng) {
          formMapState.location.label = addr;
          updateMapLocationDisplay();
          formMapState.marker?.setPopupContent("<strong>Lokasi Terpilih:</strong><br>" + addr);
        }
      });
    });

    formMapState.map = map;
    setTimeout(() => map.invalidateSize(), 180);
  }

  function safeParse(raw, fallback) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function loadActivities() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACTIVITIES));
      return DEFAULT_ACTIVITIES;
    }
    const parsed = safeParse(raw, []);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACTIVITIES));
      return DEFAULT_ACTIVITIES;
    }
    return parsed;
  }

  function saveActivities(activities) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }

  function loadJoinedState() {
    const parsed = safeParse(localStorage.getItem(JOINED_KEY), {});
    return parsed && typeof parsed === "object" ? parsed : {};
  }

  function saveJoinedState(state) {
    localStorage.setItem(JOINED_KEY, JSON.stringify(state));
  }

  function sortActivitiesByDate(activities) {
    return [...activities].sort((a, b) => {
      const ta = parseDateTimeLocal(a.datetime) || 0;
      const tb = parseDateTimeLocal(b.datetime) || 0;
      return ta - tb;
    });
  }

  function parseDateTimeLocal(value) {
    const raw = String(value || "").trim();
    if (!raw) return NaN;
    const parts = raw.split("T");
    if (parts.length !== 2) return new Date(raw).getTime();

    const [datePart, timePart] = parts;
    const datePieces = datePart.split("-").map((n) => Number(n));
    const timePieces = timePart.split(":").map((n) => Number(n));
    if (datePieces.length !== 3 || timePieces.length < 2) return new Date(raw).getTime();

    const [year, month, day] = datePieces;
    const [hour, minute] = timePieces;
    const dt = new Date(year, month - 1, day, hour, minute, 0, 0);
    return dt.getTime();
  }

  function formatDateTime(value) {
    const time = parseDateTimeLocal(value);
    if (!Number.isFinite(time) || Number.isNaN(time)) return "Waktu belum ditetapkan";
    const date = new Date(time);
    return date.toLocaleString("id-ID", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  let activeFilter = "Semua";

  function getCategoryBadge(item) {
    const text = `${item.title} ${item.what}`.toLowerCase();
    if (text.includes("sungai") || text.includes("kali code") || text.includes("ciliwung") || text.includes("air")) {
      return { name: "Sungai & Air", className: "category-sungai", key: "Sungai" };
    }
    if (text.includes("pohon") || text.includes("penghijauan") || text.includes("taman") || text.includes("dago")) {
      return { name: "Penghijauan", className: "category-penghijauan", key: "Pohon" };
    }
    if (text.includes("mangrove") || text.includes("pantai") || text.includes("pesisir") || text.includes("laut")) {
      return { name: "Pesisir & Laut", className: "category-pesisir", key: "Pantai" };
    }
    if (text.includes("biopori") || text.includes("kompos") || text.includes("sampah") || text.includes("waste")) {
      return { name: "Sampah & Kompos", className: "category-sampah", key: "Sampah" };
    }
    if (text.includes("sepeda") || text.includes("plogging") || text.includes("gowes")) {
      return { name: "Mobilitas Hijau", className: "category-sepeda", key: "Sepeda" };
    }
    if (text.includes("farming") || text.includes("hidroponik") || text.includes("sayur")) {
      return { name: "Urban Farming", className: "category-farming", key: "Farming" };
    }
    return { name: "Aksi Lingkungan", className: "category-umum", key: "Umum" };
  }

  function syncSummary(activities) {
    const now = Date.now();
    const upcoming = activities.filter((item) => {
      const start = parseDateTimeLocal(item.datetime);
      if (!Number.isFinite(start) || Number.isNaN(start)) return true;
      return start + 2 * 60 * 60 * 1000 >= now;
    }).length;
    const participants = activities.reduce((acc, item) => acc + Number(item.participants || 0), 0);

    if (totalActivitiesEl) totalActivitiesEl.textContent = String(activities.length);
    if (upcomingActivitiesEl) upcomingActivitiesEl.textContent = String(upcoming);
    if (totalParticipantsEl) totalParticipantsEl.textContent = String(participants);
  }

  function renderActivities() {
    if (!listEl) return;

    const activities = sortActivitiesByDate(loadActivities());
    const joined = loadJoinedState();
    const now = Date.now();
    const isActiveActivity = (item) => {
      const start = parseDateTimeLocal(item?.datetime);
      if (!Number.isFinite(start) || Number.isNaN(start)) return true;
      return start + 2 * 60 * 60 * 1000 >= now;
    };
    const activeActivities = activities.filter((item) => isActiveActivity(item));
    syncSummary(activeActivities);

    let filteredActivities = activeActivities;
    if (activeFilter !== "Semua") {
      filteredActivities = activeActivities.filter((item) => {
        const cat = getCategoryBadge(item);
        return cat.key === activeFilter || cat.name.toLowerCase().includes(activeFilter.toLowerCase());
      });
    }

    if (!filteredActivities.length) {
      listEl.innerHTML = `
        <article class="card empty-state-card list-reveal">
          <h3>Tidak Ada Kegiatan untuk Kategori Ini</h3>
          <p>Belum ada kegiatan yang cocok dengan filter "${activeFilter}".</p>
          <button class="btn btn-outline" data-action="reset-filter">Tampilkan Semua Aksi</button>
        </article>
      `;
      return;
    }

    listEl.innerHTML = filteredActivities
      .map((item, idx) => {
        const isJoined = Boolean(joined[item.id]);
        const start = parseDateTimeLocal(item.datetime);
        const isPast =
          Number.isFinite(start) && !Number.isNaN(start) ? start + 2 * 60 * 60 * 1000 < Date.now() : false;
        const chipLabel = isPast ? "Selesai" : isJoined ? "Terdaftar" : "Aktif";
        const chipClass = isPast ? "chip-past" : isJoined ? "chip-joined" : "chip-active";
        const buttonLabel = isPast ? "Selesai" : isJoined ? "Batalkan" : "Ikut Aksi";
        const buttonIcon = isPast ? "fa-check" : isJoined ? "fa-times" : "fa-plus";
        const buttonClass = isJoined ? "join-btn joined" : "join-btn";
        const cat = getCategoryBadge(item);

        return `
          <article id="activity-${item.id}" class="activity-card list-reveal" style="animation-delay: ${Math.min(idx * 0.04, 0.28).toFixed(2)}s" data-id="${item.id}">
            <div class="activity-top-row">
              <span class="activity-category-badge ${cat.className}">${cat.name}</span>
              <span class="activity-chip ${chipClass}">
                <i class="fas fa-circle" style="font-size: 7px;"></i> ${chipLabel}
              </span>
            </div>

            <h3 class="activity-title" title="${item.title}">${item.title}</h3>

            <div class="activity-schedule">
              <i class="fas fa-calendar-alt" aria-hidden="true"></i>
              <span>${formatDateTime(item.datetime)}</span>
            </div>

            <p class="activity-body">${item.what}</p>

            <div class="activity-meta">
              <div class="activity-meta-item">
                <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                <span>${item.where}</span>
              </div>
              <div class="activity-meta-item">
                <i class="fas fa-user-circle" aria-hidden="true"></i>
                <span>Diinisiasi oleh <strong>${item.creator || "Warga Peduli"}</strong></span>
              </div>
            </div>

            <div class="activity-footer">
              <div class="participant-count">
                <i class="fas fa-users" style="color: var(--color-green-primary);"></i>
                <strong>${item.participants || 0}</strong> warga
              </div>
              <button class="${buttonClass}" data-action="join" data-id="${item.id}" ${isPast ? "disabled" : ""}>
                <i class="fas ${buttonIcon}"></i> ${buttonLabel}
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function setFeedback(text, ok = false) {
    if (!feedbackEl) return;
    feedbackEl.textContent = text;
    feedbackEl.classList.toggle("success", ok);
  }

  function setCreateLoading(loading) {
    if (!createBtn) return;
    if (loading) {
      createBtn.disabled = true;
      createBtn.textContent = "Menyimpan...";
      return;
    }
    createBtn.disabled = false;
    createBtn.textContent = "Buat Kegiatan";
  }

  function createActivity(payload) {
    const activities = loadActivities();
    activities.unshift(payload);
    saveActivities(activities);
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = String(titleInput?.value || "").trim();
    const datetime = String(datetimeInput?.value || "").trim();
    const what = String(whatInput?.value || "").trim();
    const creator = String(creatorInput?.value || "").trim() || "Warga Peduli";
    const where = formMapState.location ? formatMapLocation(formMapState.location) : "";

    if (!title || !datetime || !what || !formMapState.location) {
      setFeedback("Lengkapi semua field wajib dan tentukan lokasi di peta.", false);
      return;
    }

    const time = parseDateTimeLocal(datetime);
    if (!Number.isFinite(time) || Number.isNaN(time)) {
      setFeedback("Format waktu kegiatan tidak valid.", false);
      return;
    }
    if (time < Date.now() - 5 * 60 * 1000) {
      setFeedback("Waktu kegiatan sudah lewat. Pilih waktu sekarang atau yang akan datang.", false);
      return;
    }

    setCreateLoading(true);

    const activity = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title,
      datetime,
      what,
      where,
      whereCoords: formMapState.location,
      creator,
      participants: 1,
      createdAt: new Date().toISOString(),
    };

    createActivity(activity);
    setCreateLoading(false);
    setFeedback("Kegiatan berhasil dibuat dan masuk ke daftar!", true);

    form.reset();
    formMapState.location = null;
    if (formMapState.marker && formMapState.map) {
      formMapState.map.removeLayer(formMapState.marker);
      formMapState.marker = null;
    }
    updateMapLocationDisplay();

    setTimeout(() => {
      hideForm();
      renderActivities();
      const el = document.getElementById(`activity-${activity.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.borderColor = "var(--color-green-primary)";
      }
    }, 400);
  });

  listEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const resetFilterBtn = target.closest('button[data-action="reset-filter"]');
    if (resetFilterBtn) {
      activeFilter = "Semua";
      document.querySelectorAll("#activity-filter-tabs .filter-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.filter === "Semua");
      });
      renderActivities();
      return;
    }

    const openFromEmptyBtn = target.closest('button[data-action="open-form-empty"]');
    if (openFromEmptyBtn) {
      showForm();
      return;
    }

    const button = target.closest('button[data-action="join"]');
    if (!button) return;

    const activityId = button.getAttribute("data-id");
    if (!activityId) return;

    const activities = loadActivities();
    const joined = loadJoinedState();
    const index = activities.findIndex((item) => item.id === activityId);
    if (index < 0) return;

    const isJoined = Boolean(joined[activityId]);

    if (isJoined) {
      delete joined[activityId];
      activities[index].participants = Math.max(1, Number(activities[index].participants || 1) - 1);
    } else {
      joined[activityId] = true;
      activities[index].participants = Number(activities[index].participants || 0) + 1;
    }

    saveActivities(activities);
    saveJoinedState(joined);
    renderActivities();
  });

  const filterTabsContainer = document.getElementById("activity-filter-tabs");
  filterTabsContainer?.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    const filter = btn.dataset.filter || "Semua";
    activeFilter = filter;
    filterTabsContainer.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderActivities();
  });

  openFormBtn?.addEventListener("click", showForm);
  closeFormBtn?.addEventListener("click", hideForm);
  modalCloseBtn?.addEventListener("click", hideForm);
  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) hideForm();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay?.classList.contains("active")) {
      hideForm();
    }
  });

  updateMapLocationDisplay();
  renderActivities();
});
