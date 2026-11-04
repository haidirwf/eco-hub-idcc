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
    if (!formCard) return;
    formCard.classList.remove("hidden");
    initActivityMap();
    setTimeout(() => formMapState.map?.invalidateSize(), 140);
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => titleInput?.focus(), 100);
  }

  function hideForm() {
    if (!formCard) return;
    formCard.classList.add("hidden");
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

  function mockAddressFromPoint(point) {
    return `${nearestCityForPoint(point)}, Indonesia`;
  }

  function formatMapLocation(point) {
    if (!point) return "Belum ada titik dipilih.";
    return point.label || `Sekitar ${nearestCityForPoint(point)}`;
  }

  function updateMapLocationDisplay() {
    if (!activityLocationDisplay) return;
    if (!formMapState.location) {
      activityLocationDisplay.textContent = "Belum ada titik dipilih.";
      return;
    }
    activityLocationDisplay.textContent = formatMapLocation(formMapState.location);
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
      const point = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        label: `${nearestCityForPoint({ lat: event.latlng.lat, lng: event.latlng.lng })}, Indonesia`,
      };
      formMapState.location = point;

      if (formMapState.marker) {
        map.removeLayer(formMapState.marker);
      }
      formMapState.marker = window.L.marker([point.lat, point.lng], { title: "Lokasi Kegiatan" }).addTo(map);
      updateMapLocationDisplay();
    });

    formMapState.map = map;
    setTimeout(() => map.invalidateSize(), 120);
  }
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
    const parsed = safeParse(localStorage.getItem(STORAGE_KEY), []);
    return Array.isArray(parsed) ? parsed : [];
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
    if (!Number.isFinite(time) || Number.isNaN(time)) return "Waktu tidak valid";
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
      if (!Number.isFinite(start) || Number.isNaN(start)) return false;
      return start + 2 * 60 * 60 * 1000 >= now;
    };
    const activeActivities = activities.filter((item) => {
      return isActiveActivity(item);
    });
    syncSummary(activeActivities);

    if (!activeActivities.length) {
      listEl.innerHTML = `
        <article class="card empty-state-card list-reveal" style="animation-delay: 0.02s">
          <h3>Belum Ada Kegiatan</h3>
          <p>Jadi yang pertama membuat kegiatan warga di lokasimu.</p>
          <button class="btn btn-primary" data-action="open-form-empty">Buat Kegiatan</button>
        </article>
      `;
      return;
    }

    listEl.innerHTML = activeActivities
      .map((item, idx) => {
        const isJoined = Boolean(joined[item.id]);
        const start = parseDateTimeLocal(item.datetime);
        const isPast =
          Number.isFinite(start) && !Number.isNaN(start) ? start + 2 * 60 * 60 * 1000 < Date.now() : false;
        const chipLabel = isPast ? "Selesai" : isJoined ? "Joined" : "Aktif";
        const chipClass = isPast ? "chip-past" : isJoined ? "chip-joined" : "chip-active";
        const buttonLabel = isPast ? "Kegiatan Selesai" : isJoined ? "Batalkan Join" : "Join Kegiatan";
        const buttonClass = isJoined ? "btn btn-outline join-btn joined" : "btn btn-outline join-btn";

        return `
          <article id="activity-${item.id}" class="card activity-card list-reveal" style="animation-delay: ${Math.min(idx * 0.06, 0.36).toFixed(2)}s" data-id="${item.id}">
            <div class="activity-head">
              <h3 class="activity-title">${item.title}</h3>
              <span class="activity-chip ${chipClass}">${chipLabel}</span>
            </div>
            <div class="activity-time">
              <i class="fas fa-calendar-alt" size="14"></i>
              ${formatDateTime(item.datetime)}
            </div>
            <p class="activity-body">${item.what}</p>
            <div class="activity-meta">
              <span><i class="fas fa-map-marker-alt" size="14"></i>${item.where}</span>
              <span><i class="fas fa-user" size="14"></i>Penggagas: ${item.creator || "Warga"}</span>
            </div>
            <div class="activity-footer">
              <div class="participant-count">${item.participants || 0} peserta</div>
              <button class="${buttonClass}" data-action="join" data-id="${item.id}" ${isPast ? "disabled" : ""}>${buttonLabel}</button>
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
    activities.push(payload);
    saveActivities(activities);
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = String(titleInput?.value || "").trim();
    const datetime = String(datetimeInput?.value || "").trim();
    const what = String(whatInput?.value || "").trim();
    const creator = String(creatorInput?.value || "").trim() || "Warga";
    const where = formMapState.location ? formatMapLocation(formMapState.location) : "";

    if (!title || !datetime || !what || !where) {
      setFeedback("Lengkapi semua field wajib dan pilih lokasi di peta.");
      return;
    }

    const time = parseDateTimeLocal(datetime);
    if (!Number.isFinite(time) || Number.isNaN(time)) {
      setFeedback("Format waktu kegiatan tidak valid.");
      return;
    }
    if (time < Date.now() - 5 * 60 * 1000) {
      setFeedback("Waktu kegiatan sudah lewat. Pilih waktu sekarang atau yang akan datang.");
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
    setFeedback("Kegiatan berhasil dibuat dan masuk ke daftar.", true);

    form.reset();
    formMapState.location = null;
    if (formMapState.marker && formMapState.map) {
      formMapState.map.removeLayer(formMapState.marker);
      formMapState.marker = null;
    }
    updateMapLocationDisplay();
    hideForm();
    renderActivities();

    setTimeout(() => {
      document.getElementById("activity-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  });

  listEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

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

  openFormBtn?.addEventListener("click", showForm);
  closeFormBtn?.addEventListener("click", hideForm);

  updateMapLocationDisplay();
  renderActivities();
});

