document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "Eco Hub_community_activities_en_v1";
  const JOINED_KEY = "Eco Hub_community_joined_en_v1";
  const USER_PROFILE_KEY = "Eco Hub_user_profile_en_v1";

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
      title: "River Cleanup & Waste Segregation Drive",
      datetime: "2026-11-08T07:30",
      what: "Collective community effort to remove plastic waste from riverbank corridors and sort recyclable materials.",
      where: "Riverbank Corridor, South Jakarta",
      whereCoords: { lat: -6.2088, lng: 106.8456, label: "South Jakarta Corridor" },
      creator: "Clean River Initiative",
      participants: 28,
      createdAt: "2026-11-01T08:00:00.000Z",
    },
    {
      id: "act_bdg_01",
      title: "200 Native Tree Seedling Planting Drive",
      datetime: "2026-11-09T08:00",
      what: "Reforestation of hillside slopes to reinforce natural water catchment basins and prevent soil erosion.",
      where: "Dago Hills Nature Reserve, Bandung",
      whereCoords: { lat: -6.8650, lng: 107.6250, label: "Dago Hills, Bandung" },
      creator: "Bandung Eco Green",
      participants: 45,
      createdAt: "2026-11-02T09:00:00.000Z",
    },
    {
      id: "act_sby_01",
      title: "Mangrove Restoration & Coastal Beach Cleanup",
      datetime: "2026-11-10T06:30",
      what: "Ecotourism field excursion planting mangrove saplings and gathering plastic debris along the eastern coast.",
      where: "Wonorejo Mangrove Ecotourism, Surabaya",
      whereCoords: { lat: -7.3080, lng: 112.8210, label: "Wonorejo, Surabaya" },
      creator: "Coastal Guardians Collective",
      participants: 36,
      createdAt: "2026-11-02T10:00:00.000Z",
    },
    {
      id: "act_dps_01",
      title: "Morning Beach Cleanup & Microplastic Education",
      datetime: "2026-11-11T06:00",
      what: "Sunrise beach clean-up alongside local residents and visitors to reduce shoreline microplastic pollution.",
      where: "Sunrise Beach, Sanur, Denpasar",
      whereCoords: { lat: -8.6738, lng: 115.2631, label: "Sanur, Denpasar" },
      creator: "Bali Clean Waves",
      participants: 52,
      createdAt: "2026-11-03T07:00:00.000Z",
    },
    {
      id: "act_smg_01",
      title: "Biopore Infiltration Workshop & Community Composting",
      datetime: "2026-11-12T08:30",
      what: "Hands-on workshop installing 50 biopore infiltration holes for rainwater absorption and organic waste composting.",
      where: "Banyumanik Neighborhood, South Semarang",
      whereCoords: { lat: -7.0600, lng: 110.4150, label: "Banyumanik, Semarang" },
      creator: "Community Eco Pioneers",
      participants: 22,
      createdAt: "2026-11-03T08:00:00.000Z",
    },
    {
      id: "act_ygy_01",
      title: "Low-Emission Community Ride & River Plogging",
      datetime: "2026-11-13T06:30",
      what: "Eco-friendly leisure bike ride along the river followed by a collective jog and trash-pickup (plogging) session.",
      where: "Code River Trail, Yogyakarta",
      whereCoords: { lat: -7.7828, lng: 110.3725, label: "Code River, Yogyakarta" },
      creator: "Jogja Green Cyclists",
      participants: 31,
      createdAt: "2026-11-03T09:00:00.000Z",
    },
    {
      id: "act_mdn_01",
      title: "Urban Park Renewal & E-Waste Drop Point Setup",
      datetime: "2026-11-14T09:00",
      what: "Setting up a neighborhood electronic waste drop-off station and planting pollution-absorbing native shrubs.",
      where: "Cadika Public Park, Medan",
      whereCoords: { lat: 3.5350, lng: 98.6650, label: "Medan Johor, Medan" },
      creator: "Medan Green Movement",
      participants: 19,
      createdAt: "2026-11-03T11:00:00.000Z",
    },
    {
      id: "act_mks_01",
      title: "Losari Coast Cleanup & Reusable Bag Campaign",
      datetime: "2026-11-15T07:00",
      what: "Citizen cleanup at the coastal esplanade and free distribution of reusable cloth shopping bags.",
      where: "Losari Waterfront Esplanade, Makassar",
      whereCoords: { lat: -5.1477, lng: 119.4060, label: "Pantai Losari, Makassar" },
      creator: "Makassar Ocean Alliance",
      participants: 38,
      createdAt: "2026-11-03T12:00:00.000Z",
    },
    {
      id: "act_jkt_02",
      title: "Urban Farming & Household Composting Workshop",
      datetime: "2026-11-16T09:00",
      what: "Hands-on tutorial creating simple hydroponic vegetable systems and food-scrap bokashi composting at home.",
      where: "Kalijodo Eco Hub Center, Jakarta",
      whereCoords: { lat: -6.1450, lng: 106.7850, label: "Kalijodo, Jakarta" },
      creator: "Urban Farming Indonesia",
      participants: 25,
      createdAt: "2026-11-03T13:00:00.000Z",
    },
  ];

  // DOM Elements
  const formCard = document.getElementById("create-form-card");
  const form = document.getElementById("kegiatan-form");
  const openFormBtn = document.getElementById("open-form-btn");
  const closeFormBtn = document.getElementById("close-form-btn");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalOverlay = document.getElementById("activity-modal");
  const feedbackEl = document.getElementById("form-feedback");
  const createBtn = document.getElementById("create-activity-btn");

  const titleInput = document.getElementById("activity-title");
  const datetimeInput = document.getElementById("activity-datetime");
  const whatInput = document.getElementById("activity-what");
  const creatorInput = document.getElementById("activity-creator");
  const activityMapEl = document.getElementById("activity-map");
  const activityLocationDisplay = document.getElementById("activity-location-display");

  // Join Modal Elements
  const joinModalOverlay = document.getElementById("join-modal");
  const joinFormCard = document.getElementById("join-form-card");
  const joinForm = document.getElementById("join-activity-form");
  const joinActivityIdInput = document.getElementById("join-activity-id");
  const joinSummaryCategory = document.getElementById("join-summary-category");
  const joinSummaryParticipants = document.getElementById("join-summary-participants");
  const joinSummaryTitle = document.getElementById("join-summary-title");
  const joinSummaryDatetime = document.getElementById("join-summary-datetime");
  const joinSummaryLocation = document.getElementById("join-summary-location");
  const joinSummaryCreator = document.getElementById("join-summary-creator");
  const joinNameInput = document.getElementById("join-name");
  const joinPhoneInput = document.getElementById("join-phone");
  const joinEmailInput = document.getElementById("join-email");
  const joinNotesInput = document.getElementById("join-notes");
  const joinCommitmentInput = document.getElementById("join-commitment");
  const joinSubmitBtn = document.getElementById("join-submit-btn");
  const joinCloseBtn = document.getElementById("join-close-btn");
  const joinModalCloseBtn = document.getElementById("join-modal-close-btn");
  const joinFeedbackEl = document.getElementById("join-feedback");

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
      requestAnimationFrame(() => {
        modalOverlay.classList.add("active");
      });
    }
    if (formCard) {
      formCard.classList.remove("hidden");
    }
    document.body.style.overflow = "hidden";
    initActivityMap();
    setTimeout(() => {
      formMapState.map?.invalidateSize();
    }, 250);
    setTimeout(() => titleInput?.focus(), 250);
  }

  function hideForm() {
    if (modalOverlay) {
      modalOverlay.classList.remove("active");
      setTimeout(() => {
        if (!modalOverlay.classList.contains("active")) {
          modalOverlay.classList.add("hidden");
        }
      }, 350);
    }
    document.body.style.overflow = "";
    setFeedback("");
  }

  function setJoinFeedback(text, ok = false) {
    if (!joinFeedbackEl) return;
    joinFeedbackEl.textContent = text;
    joinFeedbackEl.classList.toggle("success", ok);
  }

  function showJoinModal(activity) {
    if (!joinModalOverlay || !activity) return;

    if (joinActivityIdInput) joinActivityIdInput.value = activity.id;
    if (joinSummaryTitle) joinSummaryTitle.textContent = activity.title;

    const cat = getCategoryBadge(activity);
    if (joinSummaryCategory) {
      joinSummaryCategory.textContent = cat.name;
      joinSummaryCategory.className = `activity-category-badge ${cat.className}`;
    }

    if (joinSummaryDatetime) {
      joinSummaryDatetime.textContent = formatDateTime(activity.datetime);
    }
    if (joinSummaryLocation) {
      joinSummaryLocation.textContent = activity.where || "Location to be announced";
    }
    if (joinSummaryCreator) {
      joinSummaryCreator.textContent = activity.creator || "Community Volunteer";
    }
    if (joinSummaryParticipants) {
      joinSummaryParticipants.textContent = String(activity.participants || 0);
    }

    const profile = safeParse(localStorage.getItem(USER_PROFILE_KEY), {});
    if (joinNameInput) joinNameInput.value = profile.name || "";
    if (joinPhoneInput) joinPhoneInput.value = profile.phone || "";
    if (joinEmailInput) joinEmailInput.value = profile.email || "";
    if (joinNotesInput) joinNotesInput.value = "";
    if (joinCommitmentInput) joinCommitmentInput.checked = true;

    setJoinFeedback("");

    joinModalOverlay.classList.remove("hidden");
    requestAnimationFrame(() => {
      joinModalOverlay.classList.add("active");
    });
    if (joinFormCard) joinFormCard.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      if (joinNameInput && !joinNameInput.value) {
        joinNameInput.focus();
      } else if (joinPhoneInput && !joinPhoneInput.value) {
        joinPhoneInput.focus();
      } else if (joinNotesInput) {
        joinNotesInput.focus();
      }
    }, 200);
  }

  function hideJoinModal() {
    if (joinModalOverlay) {
      joinModalOverlay.classList.remove("active");
      setTimeout(() => {
        if (!joinModalOverlay.classList.contains("active")) {
          joinModalOverlay.classList.add("hidden");
        }
      }, 350);
    }
    document.body.style.overflow = "";
    setJoinFeedback("");
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
    if (!point) return "No location pinned yet.";
    return point.label || `Near ${nearestCityForPoint(point)}`;
  }

  function updateMapLocationDisplay() {
    if (!activityLocationDisplay) return;
    if (!formMapState.location) {
      activityLocationDisplay.textContent = "Click a point on the interactive map above to pin the event location.";
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
        headers: { "Accept-Language": "en" },
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
    return `Near ${nearestCityForPoint({ lat, lng })}`;
  }

  function initActivityMap() {
    if (!activityMapEl || formMapState.map) return;

    if (!window.L) {
      activityMapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--color-text-secondary);font-size:14px;padding:20px;text-align:center;">Map requires an active connection to load Leaflet tiles.</div>';
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
        label: `Near ${nearestCity}`,
      };
      formMapState.location = point;

      if (formMapState.marker) {
        map.removeLayer(formMapState.marker);
      }
      formMapState.marker = window.L.marker([lat, lng], { title: "Event Location" })
        .addTo(map)
        .bindPopup("<strong>Selected Location:</strong><br>Looking up address...");

      updateMapLocationDisplay();

      reverseGeocodeActivity(lat, lng).then((addr) => {
        if (formMapState.location && formMapState.location.lat === lat && formMapState.location.lng === lng) {
          formMapState.location.label = addr;
          updateMapLocationDisplay();
          formMapState.marker?.setPopupContent("<strong>Selected Location:</strong><br>" + addr);
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
    if (!Number.isFinite(time) || Number.isNaN(time)) return "Date to be scheduled";
    const date = new Date(time);
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  let activeFilter = "All";

  function getCategoryBadge(item) {
    const text = `${item.title} ${item.what}`.toLowerCase();
    if (text.includes("river") || text.includes("sungai") || text.includes("water") || text.includes("kali code") || text.includes("ciliwung")) {
      return { name: "River & Water", className: "category-sungai", key: "River", icon: "fa-water" };
    }
    if (text.includes("tree") || text.includes("pohon") || text.includes("reforestation") || text.includes("greening") || text.includes("park") || text.includes("dago")) {
      return { name: "Greening & Trees", className: "category-penghijauan", key: "Trees", icon: "fa-tree" };
    }
    if (text.includes("mangrove") || text.includes("beach") || text.includes("coastal") || text.includes("ocean") || text.includes("pantai")) {
      return { name: "Coastal & Ocean", className: "category-pesisir", key: "Coastal", icon: "fa-umbrella-beach" };
    }
    if (text.includes("biopori") || text.includes("compost") || text.includes("waste") || text.includes("sampah")) {
      return { name: "Waste & Compost", className: "category-sampah", key: "Waste", icon: "fa-recycle" };
    }
    if (text.includes("ride") || text.includes("bike") || text.includes("cyclist") || text.includes("sepeda") || text.includes("plogging")) {
      return { name: "Green Mobility", className: "category-sepeda", key: "Mobility", icon: "fa-bicycle" };
    }
    if (text.includes("farming") || text.includes("hydroponic") || text.includes("garden")) {
      return { name: "Urban Farming", className: "category-farming", key: "Farming", icon: "fa-seedling" };
    }
    return { name: "Eco Action", className: "category-umum", key: "Action", icon: "fa-leaf" };
  }

  function formatEventDateTime(value) {
    const time = parseDateTimeLocal(value);
    if (!Number.isFinite(time) || Number.isNaN(time)) {
      return { date: "Date to be scheduled", time: "" };
    }
    const date = new Date(time);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return { date: dateStr, time: timeStr };
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
    if (activeFilter !== "All") {
      filteredActivities = activeActivities.filter((item) => {
        const cat = getCategoryBadge(item);
        return cat.key === activeFilter || cat.name.toLowerCase().includes(activeFilter.toLowerCase());
      });
    }

    if (!filteredActivities.length) {
      listEl.innerHTML = `
        <article class="card empty-state-card list-reveal">
          <h3>No Community Events in this Category</h3>
          <p>No active events match the filter "${activeFilter}".</p>
          <button class="btn btn-outline" data-action="reset-filter">Show All Events</button>
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
        const chipLabel = isPast ? "Completed" : isJoined ? "Registered" : "Active";
        const chipClass = isPast ? "chip-past" : isJoined ? "chip-joined" : "chip-active";
        const buttonLabel = isPast ? "Completed" : isJoined ? "Registered" : "Join Event";
        const buttonIcon = isPast ? "fa-calendar-check" : isJoined ? "fa-check" : "fa-plus";
        const buttonClass = isJoined ? "join-btn joined" : "join-btn";
        const cat = getCategoryBadge(item);
        const dt = formatEventDateTime(item.datetime);

        return `
          <article id="activity-${item.id}" class="activity-card list-reveal" style="animation-delay: ${Math.min(idx * 0.04, 0.28).toFixed(2)}s" data-id="${item.id}">
            <div class="activity-top-row">
              <span class="activity-category-badge ${cat.className}">
                <i class="fas ${cat.icon}" aria-hidden="true"></i> ${cat.name}
              </span>
              <span class="activity-chip ${chipClass}">
                <i class="fas ${isJoined ? "fa-check-circle" : isPast ? "fa-history" : "fa-circle"}" aria-hidden="true"></i> ${chipLabel}
              </span>
            </div>

            <h3 class="activity-title" title="${item.title}">${item.title}</h3>

            <div class="activity-schedule-bar">
              <span class="schedule-item"><i class="far fa-calendar-alt" aria-hidden="true"></i> ${dt.date}</span>
              ${
                dt.time
                  ? `<span class="schedule-sep" aria-hidden="true">•</span><span class="schedule-item"><i class="far fa-clock" aria-hidden="true"></i> ${dt.time}</span>`
                  : ""
              }
            </div>

            <p class="activity-body">${item.what}</p>

            <div class="activity-meta">
              <div class="activity-meta-item" title="${item.where}">
                <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                <span>${item.where}</span>
              </div>
              <div class="activity-meta-item" title="Initiated by ${item.creator || "Community Volunteers"}">
                <i class="fas fa-bullhorn" aria-hidden="true"></i>
                <span>Initiated by <strong>${item.creator || "Community Volunteers"}</strong></span>
              </div>
            </div>

            <div class="activity-footer">
              <div class="participant-count">
                <i class="fas fa-users" aria-hidden="true"></i>
                <span><strong>${item.participants || 0}</strong> citizens joined</span>
              </div>
              <button class="${buttonClass}" data-action="join" data-id="${item.id}" ${isPast ? "disabled" : ""} title="${isJoined ? "Click to cancel participation" : isPast ? "Event has completed" : "Click to RSVP for this action"}">
                <i class="fas ${buttonIcon}" aria-hidden="true"></i> <span>${buttonLabel}</span>
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
      createBtn.textContent = "Saving...";
      return;
    }
    createBtn.disabled = false;
    createBtn.textContent = "Create Event";
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
    const creator = String(creatorInput?.value || "").trim() || "Community Volunteer";
    const where = formMapState.location ? formatMapLocation(formMapState.location) : "";

    if (!title || !datetime || !what || !formMapState.location) {
      setFeedback("Please fill in all required fields and pin the location on the map.", false);
      return;
    }

    const time = parseDateTimeLocal(datetime);
    if (!Number.isFinite(time) || Number.isNaN(time)) {
      setFeedback("Invalid date format.", false);
      return;
    }
    if (time < Date.now() - 5 * 60 * 1000) {
      setFeedback("Event date cannot be in the past. Please select an upcoming date and time.", false);
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
    setFeedback("Event successfully created and added to the community board!", true);

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
      activeFilter = "All";
      document.querySelectorAll("#activity-filter-tabs .filter-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.filter === "All");
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
    const targetActivity = activities[index];

    if (isJoined) {
      const confirmCancel = window.confirm(
        `Cancel your RSVP for this event:\n"${targetActivity.title}"?`
      );
      if (!confirmCancel) return;

      delete joined[activityId];
      activities[index].participants = Math.max(1, Number(activities[index].participants || 1) - 1);
      saveActivities(activities);
      saveJoinedState(joined);
      renderActivities();
    } else {
      showJoinModal(targetActivity);
    }
  });

  // Handle Join Activity Form Submission
  joinForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const activityId = joinActivityIdInput?.value;
    if (!activityId) return;

    const name = String(joinNameInput?.value || "").trim();
    const phone = String(joinPhoneInput?.value || "").trim();
    const email = String(joinEmailInput?.value || "").trim();
    const notes = String(joinNotesInput?.value || "").trim();

    if (!name || !phone) {
      setJoinFeedback("Please provide your Full Name and WhatsApp/Phone Number.", false);
      return;
    }

    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify({ name, phone, email }));

    const activities = loadActivities();
    const joined = loadJoinedState();
    const actIndex = activities.findIndex((item) => item.id === activityId);
    if (actIndex < 0) {
      setJoinFeedback("Event not found.", false);
      return;
    }

    joined[activityId] = {
      joined: true,
      name,
      phone,
      email,
      notes,
      registeredAt: new Date().toISOString(),
    };

    activities[actIndex].participants = Number(activities[actIndex].participants || 0) + 1;

    saveActivities(activities);
    saveJoinedState(joined);

    setJoinFeedback(`RSVP Confirmed! Thank you ${name}, see you at the event location.`, true);

    if (joinSubmitBtn) {
      joinSubmitBtn.disabled = true;
      joinSubmitBtn.innerHTML = '<i class="fas fa-check"></i> Registered!';
    }

    setTimeout(() => {
      if (joinSubmitBtn) {
        joinSubmitBtn.disabled = false;
        joinSubmitBtn.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i> Confirm RSVP';
      }
      hideJoinModal();
      renderActivities();

      const el = document.getElementById(`activity-${activityId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.borderColor = "var(--color-green-primary)";
        el.style.boxShadow = "0 0 0 3px rgba(45, 90, 39, 0.25)";
        setTimeout(() => {
          el.style.boxShadow = "";
        }, 2200);
      }
    }, 700);
  });

  const filterTabsContainer = document.getElementById("activity-filter-tabs");
  filterTabsContainer?.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    const filter = btn.dataset.filter || "All";
    activeFilter = filter;
    filterTabsContainer.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderActivities();
  });

  // Modal Create Activity listeners
  openFormBtn?.addEventListener("click", showForm);
  closeFormBtn?.addEventListener("click", hideForm);
  modalCloseBtn?.addEventListener("click", hideForm);
  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) hideForm();
  });

  // Modal Join Activity listeners
  joinCloseBtn?.addEventListener("click", hideJoinModal);
  joinModalCloseBtn?.addEventListener("click", hideJoinModal);
  joinModalOverlay?.addEventListener("click", (e) => {
    if (e.target === joinModalOverlay) hideJoinModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (joinModalOverlay?.classList.contains("active")) {
        hideJoinModal();
      } else if (modalOverlay?.classList.contains("active")) {
        hideForm();
      }
    }
  });

  updateMapLocationDisplay();
  renderActivities();
});
