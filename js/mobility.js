


document.addEventListener("DOMContentLoaded", () => {
  const COMMUNITY_ACTIVITIES_KEY = "Eco Hub_community_activities_v1";
  const MOCK_MODE = localStorage.getItem("Eco Hub_mock_mode") === "1";
  const DUMMY_MAP_MODE = window.ECO_HUB_MAP_CONFIG?.dummyOnly ?? true;
  const INDONESIA_BOUNDS = [
    [-11.2, 94.5],
    [6.8, 141.5],
  ];
  const PROVINCE_ZONES = [
    { name: "Aceh", minLat: 3.2, maxLat: 5.9, minLng: 95.0, maxLng: 98.3 },
    { name: "Sumatera Utara", minLat: 1.0, maxLat: 3.7, minLng: 97.0, maxLng: 100.6 },
    { name: "Sumatera Barat", minLat: -1.6, maxLat: 1.3, minLng: 98.5, maxLng: 101.3 },
    { name: "Riau", minLat: -0.8, maxLat: 1.7, minLng: 100.4, maxLng: 103.1 },
    { name: "DKI Jakarta", minLat: -6.35, maxLat: -6.05, minLng: 106.7, maxLng: 107.0 },
    { name: "Jawa Barat", minLat: -7.8, maxLat: -5.85, minLng: 106.0, maxLng: 108.9 },
    { name: "Jawa Tengah", minLat: -8.1, maxLat: -6.2, minLng: 108.5, maxLng: 111.8 },
    { name: "DI Yogyakarta", minLat: -8.05, maxLat: -7.55, minLng: 110.15, maxLng: 110.7 },
    { name: "Jawa Timur", minLat: -8.95, maxLat: -6.75, minLng: 111.0, maxLng: 114.6 },
    { name: "Bali", minLat: -8.9, maxLat: -8.0, minLng: 114.4, maxLng: 115.8 },
    { name: "Nusa Tenggara Barat", minLat: -9.4, maxLat: -8.0, minLng: 115.7, maxLng: 119.2 },
    { name: "Nusa Tenggara Timur", minLat: -10.9, maxLat: -8.0, minLng: 118.6, maxLng: 125.5 },
    { name: "Kalimantan Barat", minLat: -3.3, maxLat: 2.3, minLng: 108.0, maxLng: 114.2 },
    { name: "Kalimantan Tengah", minLat: -3.9, maxLat: 0.8, minLng: 111.0, maxLng: 115.8 },
    { name: "Kalimantan Timur", minLat: -2.8, maxLat: 2.6, minLng: 115.7, maxLng: 119.6 },
    { name: "Sulawesi Selatan", minLat: -6.9, maxLat: -1.8, minLng: 118.7, maxLng: 121.8 },
    { name: "Sulawesi Tengah", minLat: -2.8, maxLat: 2.2, minLng: 119.2, maxLng: 123.6 },
    { name: "Maluku", minLat: -8.4, maxLat: -1.0, minLng: 124.0, maxLng: 131.4 },
    { name: "Papua", minLat: -9.8, maxLat: 0.2, minLng: 131.0, maxLng: 141.5 },
  ];

  // g CO2 per km per person (estimasi edukasi)
  const MODE_FACTORS = {
    walk: { label: "Jalan Kaki", factor: 0, color: "#4a7c42" },
    bike: { label: "Sepeda", factor: 8, color: "#6aa85f" },
    bus: { label: "Bus/Transum", factor: 68, color: "#8b6914" },
    carpool: { label: "Carpool", factor: 95, color: "#c48a2a" },
    motor: { label: "Kendaraan Pribadi", factor: 170, color: "#c0392b" },
  };

  const CITIES = {
    Jakarta: { lat: -6.2088, lon: 106.8456 },
    Bandung: { lat: -6.9175, lon: 107.6191 },
    Bekasi: { lat: -6.2349, lon: 106.9896 },
    Bogor: { lat: -6.5944, lon: 106.7892 },
    Depok: { lat: -6.4025, lon: 106.7942 },
    Tangerang: { lat: -6.1783, lon: 106.6319 },
    Semarang: { lat: -6.9667, lon: 110.4167 },
    Surabaya: { lat: -7.2575, lon: 112.7521 },
    Malang: { lat: -7.9666, lon: 112.6326 },
    Yogyakarta: { lat: -7.7956, lon: 110.3695 },
    Denpasar: { lat: -8.6705, lon: 115.2126 },
    Medan: { lat: 3.5952, lon: 98.6722 },
    Palembang: { lat: -2.9909, lon: 104.7567 },
    Batam: { lat: 1.0456, lon: 104.0305 },
    Pontianak: { lat: -0.0263, lon: 109.3425 },
    Balikpapan: { lat: -1.2379, lon: 116.8529 },
    Samarinda: { lat: -0.5022, lon: 117.1537 },
    Banjarmasin: { lat: -3.3186, lon: 114.5944 },
    Makassar: { lat: -5.1477, lon: 119.4328 },
    Manado: { lat: 1.4748, lon: 124.8421 },
  };

  const form = document.getElementById("mobility-form");
  const modeSelect = document.getElementById("mode-select");
  const tripsWeek = document.getElementById("trips-week");
  const fromPointLabel = document.getElementById("from-point-label");
  const toPointLabel = document.getElementById("to-point-label");
  const simulateBtn = document.getElementById("simulate-btn");

  const dashboardCitySelect = document.getElementById("dashboard-city-select");
  const refreshDashboardBtn = document.getElementById("refresh-dashboard-aqi");
  const dashboardMoreToggle = document.getElementById("dashboard-more-mobile");

  const resultCard = document.getElementById("mobility-result");
  const emptyCard = document.getElementById("mobility-empty");
  const routeDistanceEl = document.getElementById("route-distance");
  const currentEmissionEl = document.getElementById("current-emission");
  const targetEmissionEl = document.getElementById("target-emission");
  const savedEmissionEl = document.getElementById("saved-emission");
  const simulationInsight = document.getElementById("simulation-insight");
  const populationInsight = document.getElementById("population-insight");
  const modeComparison = document.getElementById("mode-comparison");
  const modeDetails = document.querySelector(".mode-details");
  const resultTag = document.getElementById("result-tag");
  const routeEtaEl = document.getElementById("route-eta");

  const dashboardAqi = document.getElementById("dashboard-aqi");
  const dashboardActions = document.getElementById("dashboard-actions");
  const dashboardSaved = document.getElementById("dashboard-saved");
  const aqiBadge = document.getElementById("aqi-badge");
  const aqiDesc = document.getElementById("aqi-desc");
  const dashboardPm25 = document.getElementById("dashboard-pm25");
  const dashboardPm10 = document.getElementById("dashboard-pm10");
  const dashboardHumidity = document.getElementById("dashboard-humidity");
  const areaScoreEl = document.getElementById("area-score");
  const areaScoreNote = document.getElementById("area-score-note");
  const communityActionMapEl = document.getElementById("community-action-map");

  const recGrid = document.getElementById("recommendation-grid");

          
  const heroInsightText = document.getElementById("hero-insight-text");
  const heroAqi = document.getElementById("hero-aqi");
  const heroSaving = document.getElementById("hero-saving");
          
  const mapEl = document.getElementById("mobility-map");
  const mapState = {
    from: null,
    to: null,
    map: null,
    tileLayer: null,
    tileIndex: 0,
    tileErrors: 0,
    fromMarker: null,
    toMarker: null,
    routeLine: null,
  };
  const geocodeCache = new Map();
  const aqiCache = new Map();
  const routeCache = new Map();
  const communityMapState = {
    map: null,
    layerGroup: null,
  };
  let lastGeocodeAt = 0;

  function provinceFromPoint(point) {
    if (point && typeof point.provinceHint === "string" && point.provinceHint) {
      return point.provinceHint;
    }
    const zone = PROVINCE_ZONES.find(
      (item) =>
        point.lat >= item.minLat &&
        point.lat <= item.maxLat &&
        point.lng >= item.minLng &&
        point.lng <= item.maxLng,
    );
    return zone?.name || nearestCityForPoint(point);
  }

  function setButtonLoading(button, loading, loadingText = "Memproses...") {
    if (!button) return;

    if (loading) {
      if (!button.dataset.originalLabel) {
        button.dataset.originalLabel = button.innerHTML;
      }
      button.disabled = true;
      button.classList.add("is-loading");
      button.innerHTML = `<span class="btn-inline-spinner" aria-hidden="true"></span><span>${loadingText}</span>`;
      return;
    }

    button.classList.remove("is-loading");
    const originalLabel = button.dataset.originalLabel;
    if (originalLabel) {
      button.innerHTML = originalLabel;
    }
    button.disabled = false;
  }

  function safeParse(raw, fallback = {}) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function routeCacheKey(from, to) {
    return `${from.lat.toFixed(5)},${from.lng.toFixed(5)}|${to.lat.toFixed(5)},${to.lng.toFixed(5)}`;
  }

  async function fetchRealRoute(from, to) {
    return routeCache.get(routeCacheKey(from, to)) || null;
  }

  function estimateEtaMinutes(distanceKm, mode, routeDurationMin = null) {
    const speedByMode = {
      walk: 4.5,
      bike: 14,
      bus: 24,
      carpool: 30,
      motor: 32,
    };

    if (typeof routeDurationMin === "number" && routeDurationMin > 0) {
      if (mode === "motor") return Math.max(1, Math.round(routeDurationMin));
      if (mode === "carpool") return Math.max(1, Math.round(routeDurationMin * 1.1));
      if (mode === "bus") return Math.max(1, Math.round(routeDurationMin * 1.35));
    }

    const speed = speedByMode[mode] || 25;
    return Math.max(1, Math.round((distanceKm / speed) * 60));
  }

  function formatEta(minutes) {
    if (!Number.isFinite(minutes) || minutes <= 0) return "-";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h <= 0) return `${m}m`;
    if (m === 0) return `${h}j`;
    return `${h}j ${m}m`;
  }

  function paintDummyMapBase(map) {
    if (!map || !window.L) return;

    const sumatra = [
      [5.4, 95.1],
      [4.4, 96.4],
      [3.0, 98.0],
      [1.8, 99.5],
      [0.2, 100.8],
      [-1.5, 102.1],
      [-3.5, 103.4],
      [-5.4, 104.8],
      [-5.8, 105.4],
      [-4.4, 104.0],
      [-2.0, 102.3],
      [0.8, 100.2],
      [3.0, 98.3],
      [4.8, 96.8],
    ];
    const javaBali = [
      [-6.1, 105.0],
      [-6.4, 106.2],
      [-6.8, 108.1],
      [-7.1, 110.3],
      [-7.7, 112.9],
      [-8.2, 114.6],
      [-8.5, 115.4],
      [-8.8, 116.5],
      [-8.9, 118.1],
      [-8.6, 119.9],
      [-8.9, 121.8],
      [-9.4, 123.7],
      [-10.0, 124.6],
      [-9.2, 122.4],
      [-8.7, 120.3],
      [-8.4, 118.2],
      [-8.0, 116.1],
      [-7.6, 113.8],
      [-7.1, 111.5],
      [-6.7, 109.1],
      [-6.2, 106.8],
    ];
    const kalimantan = [
      [3.9, 108.0],
      [3.2, 110.5],
      [2.5, 113.2],
      [1.8, 116.0],
      [0.5, 117.7],
      [-1.3, 118.3],
      [-2.7, 117.1],
      [-3.1, 114.6],
      [-2.5, 112.1],
      [-1.1, 109.5],
      [0.6, 108.3],
      [2.4, 108.1],
    ];
    const sulawesi = [
      [1.8, 119.1],
      [2.7, 121.0],
      [2.3, 123.2],
      [1.2, 124.8],
      [0.0, 124.2],
      [-1.8, 123.4],
      [-3.8, 122.3],
      [-4.9, 120.8],
      [-4.2, 119.3],
      [-2.3, 120.2],
      [-1.0, 121.2],
      [0.7, 121.0],
      [1.5, 120.0],
    ];
    const papua = [
      [-1.6, 130.0],
      [0.6, 131.5],
      [1.6, 133.8],
      [0.9, 136.2],
      [-0.7, 138.2],
      [-2.0, 140.1],
      [-3.8, 141.1],
      [-5.9, 139.2],
      [-6.5, 136.5],
      [-5.2, 133.5],
      [-3.9, 131.2],
    ];

    window.L.rectangle(
      INDONESIA_BOUNDS,
      {
        stroke: false,
        fillColor: "#eef3ea",
        fillOpacity: 0.96,
      },
    ).addTo(map);

    [sumatra, javaBali, kalimantan, sulawesi, papua].forEach((island) => {
      window.L.polygon(island, {
        color: "#9fb59a",
        weight: 1,
        fillColor: "#d9e8d0",
        fillOpacity: 0.92,
      }).addTo(map);
    });

    [
      [
        [3.6, 98.7],
        [-0.9, 104.5],
        [-6.2, 106.8],
        [-7.8, 110.4],
        [-7.3, 112.7],
        [-5.1, 119.4],
      ],
      [
        [-6.2, 106.8],
        [-0.0, 109.3],
        [-1.2, 116.9],
        [1.5, 124.8],
      ],
      [
        [-5.1, 119.4],
        [-3.7, 128.2],
        [-2.5, 140.7],
      ],
    ].forEach((path, idx) => {
      window.L.polyline(path, {
        color: idx === 0 ? "#8c968c" : "#a6aea6",
        weight: idx === 0 ? 4 : 3,
        opacity: 0.75,
      }).addTo(map);
    });
  }

  function animateNumber(el, toValue, suffix = "") {
    if (window.animateCount) {
      window.animateCount(el, toValue, 0, suffix);
    } else if (el) {
      el.textContent = `${toValue}${suffix}`;
    }
  }

  async function fetchAQI(city) {
    const cityData = CITIES[city] || CITIES.Jakarta;
    const cacheKey = city;
    const cached = aqiCache.get(cacheKey);
    if (cached) {
      return cached.value;
    }

    if (MOCK_MODE) {
      const mock = {
        aqi: 65,
        pm25: 22,
        pm10: 35,
        humidity: 60,
      };
      aqiCache.set(cacheKey, { value: mock, ts: Date.now() });
      return mock;
    }

    try {
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${cityData.lat}&longitude=${cityData.lon}&current=us_aqi,pm2_5,pm10`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.current && typeof data.current.us_aqi === "number") {
        const live = {
          aqi: data.current.us_aqi,
          pm25: data.current.pm2_5,
          pm10: data.current.pm10,
          humidity: 55 + Math.floor(Math.random() * 25),
        };
        aqiCache.set(cacheKey, { value: live, ts: Date.now() });
        return live;
      }
    } catch (error) {
      console.warn("AQI fetch failed", error);
    }

    const fallback = {
      aqi: 65,
      pm25: 22,
      pm10: 35,
      humidity: 60,
    };
    aqiCache.set(cacheKey, { value: fallback, ts: Date.now() });
    return fallback;
  }

  function getAqiDescriptor(aqi) {
    if (aqi <= 50) {
      return {
        label: "Baik",
        desc: "Udara relatif aman untuk aktivitas luar ruangan.",
        className: "good",
      };
    }

    if (aqi <= 100) {
      return {
        label: "Sedang",
        desc: "Kelompok sensitif disarankan mengurangi paparan lama.",
        className: "warn",
      };
    }

    return {
      label: "Tidak Sehat",
      desc: "Batasi aktivitas luar dan prioritaskan perlindungan pernapasan.",
      className: "danger",
    };
  }

  function updateAreaScore(aqi) {
    const normalizedAqi = Math.max(0, Math.min(220, Number(aqi || 0)));
    const score = Math.max(15, Math.round(100 - normalizedAqi * 0.42));

    if (areaScoreEl) areaScoreEl.textContent = String(score);

    const scoreState = score >= 75 ? "good" : score >= 55 ? "warn" : "danger";
    if (areaScoreEl) {
      areaScoreEl.classList.remove("score-good", "score-warn", "score-danger");
      areaScoreEl.classList.add(`score-${scoreState}`);
    }

    const areaScoreCard = areaScoreEl?.closest(".city-widget");
    if (areaScoreCard) {
      areaScoreCard.classList.remove(
        "area-score-good",
        "area-score-warn",
        "area-score-danger",
      );
      areaScoreCard.classList.add(`area-score-${scoreState}`);
    }

    if (areaScoreNote) {
      areaScoreNote.classList.remove("score-good", "score-warn", "score-danger");
      areaScoreNote.classList.add(`score-${scoreState}`);
      if (score >= 75) {
        areaScoreNote.textContent = "Area relatif sehat. Pertahankan transportasi rendah emisi.";
      } else if (score >= 55) {
        areaScoreNote.textContent = "Area butuh perbaikan bertahap melalui mobilitas hijau harian.";
      } else {
        areaScoreNote.textContent = "Area prioritas tinggi. Perlu intervensi cepat dan pengurangan emisi harian.";
      }
    }
  }

  function getCommunityActivitiesForMap(cityName) {
    const raw = safeParse(localStorage.getItem(COMMUNITY_ACTIVITIES_KEY), []);
    if (!Array.isArray(raw) || raw.length === 0) return [];

    const cityCoord = CITIES[cityName] || CITIES.Jakarta;
    const cityPoint = { lat: cityCoord.lat, lng: cityCoord.lon };

    const normalized = raw
      .map((item) => {
        const lat = Number(item?.whereCoords?.lat);
        const lng = Number(item?.whereCoords?.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

        const dt = item?.datetime ? new Date(item.datetime) : null;
        const timeText =
          dt && !Number.isNaN(dt.getTime())
            ? dt.toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Waktu belum ditetapkan";

        return {
          id: item?.id || "",
          title: item?.title || "Kegiatan Warga",
          type: "Kegiatan Warga",
          lat,
          lng,
          detail: `${item?.what || "Aksi komunitas"} | ${timeText}`,
          participants: Number(item?.participants || 0),
          distanceKm: haversineDistanceKm({ lat, lng }, cityPoint),
        };
      })
      .filter(Boolean);

    if (!normalized.length) return [];

    const nearby = normalized.filter((item) => item.distanceKm <= 70);
    const picked = (nearby.length ? nearby : normalized)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 8);

    return picked.map((item) => ({
      ...item,
      source: "community_activity",
    }));
  }

  function initCommunityActionMap() {
    if (!communityActionMapEl || !window.L || communityMapState.map) return;

    const map = window.L.map(communityActionMapEl, {
      attributionControl: false,
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      boxZoom: true,
      keyboard: true,
      tap: true,
    }).setView([-2.5, 118], 5);

    paintDummyMapBase(map);
    map.fitBounds(INDONESIA_BOUNDS, { padding: [10, 10] });

    communityMapState.map = map;
    communityMapState.layerGroup = window.L.layerGroup().addTo(map);
    setTimeout(() => map.invalidateSize(), 120);
  }

  function renderCommunityActionMap(cityName) {
    if (!communityActionMapEl) return;
    if (!window.L) {
      communityActionMapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--color-text-secondary);font-size:13px;">Peta aksi komunitas memerlukan Leaflet & koneksi internet.</div>';
      return;
    }

    initCommunityActionMap();
    if (!communityMapState.map || !communityMapState.layerGroup) return;

    const userActivities = getCommunityActivitiesForMap(cityName);
    const actions = [...userActivities];

    communityMapState.layerGroup.clearLayers();
    actions.forEach((item) => {
      const isCommunityActivity = item.source === "community_activity";
      const detailHref =
        isCommunityActivity && item.id
          ? `kegiatan.html#activity-${encodeURIComponent(item.id)}`
          : "kegiatan.html#activity-list";
      const popupHtml = isCommunityActivity
        ? `<strong>${item.title}</strong><br>${item.type}<br>${item.detail}<br>${item.participants} peserta<br><a class="map-detail-link" href="${detailHref}">Lihat Detail</a>`
            : `<strong>${item.title}</strong><br>${item.type}<br><a class="map-detail-link" href="${detailHref}">Lihat Detail</a>`;
      window.L.circleMarker([item.lat, item.lng], {
        radius: 6,
        color: isCommunityActivity ? "#1f4f8f" : "#2d5a27",
        fillColor: isCommunityActivity ? "#5f94d0" : "#73a567",
        fillOpacity: 0.92,
        weight: 1.2,
      })
        .bindPopup(popupHtml)
        .addTo(communityMapState.layerGroup);
    });

    if (DUMMY_MAP_MODE) {
      communityMapState.map.fitBounds(INDONESIA_BOUNDS, { padding: [10, 10] });
    } else {
      const bounds = window.L.latLngBounds(actions.map((item) => [item.lat, item.lng]));
      if (bounds.isValid()) {
        communityMapState.map.fitBounds(bounds, { padding: [22, 22], maxZoom: 13 });
      } else {
        communityMapState.map.setView([-2.5, 118], 5);
      }
    }
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

  function formatPointLabel(point) {
    if (!point) return "Belum dipilih";
    if (point.label) return point.label;
    return `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`;
  }

  function updatePointLabels() {
    if (fromPointLabel) fromPointLabel.textContent = formatPointLabel(mapState.from);
    if (toPointLabel) toPointLabel.textContent = formatPointLabel(mapState.to);
    const ready = Boolean(mapState.from && mapState.to);
    if (simulateBtn) {
      simulateBtn.disabled = !ready;
      simulateBtn.title = ready ? "" : "Pilih titik asal dan tujuan di peta terlebih dahulu";
    }
  }

  function syncModeDetailsByViewport() {
    if (!modeDetails) return;
    modeDetails.setAttribute("open", "open");
  }

  function updateMapVisuals() {
    if (!mapState.map || !window.L) return;

    if (mapState.fromMarker) {
      mapState.map.removeLayer(mapState.fromMarker);
      mapState.fromMarker = null;
    }
    if (mapState.toMarker) {
      mapState.map.removeLayer(mapState.toMarker);
      mapState.toMarker = null;
    }
    if (mapState.routeLine) {
      mapState.map.removeLayer(mapState.routeLine);
      mapState.routeLine = null;
    }

    if (mapState.from) {
      mapState.fromMarker = window.L.marker([mapState.from.lat, mapState.from.lng], { title: "Asal" })
        .addTo(mapState.map)
        .bindPopup("Titik Asal");
    }

    if (mapState.to) {
      mapState.toMarker = window.L.marker([mapState.to.lat, mapState.to.lng], { title: "Tujuan" })
        .addTo(mapState.map)
        .bindPopup("Titik Tujuan");
    }

    if (mapState.from && mapState.to) {
      mapState.routeLine = window.L.polyline(
        [
          [mapState.from.lat, mapState.from.lng],
          [mapState.to.lat, mapState.to.lng],
        ],
        { color: "#2d5a27", weight: 4, opacity: 0.85 },
      ).addTo(mapState.map);

      mapState.map.fitBounds(mapState.routeLine.getBounds(), { padding: [40, 40] });
    }
  }

  function initMap() {
    if (!mapEl) return;
    if (!window.L) {
      mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--color-text-secondary);font-size:14px;padding:20px;text-align:center;">Peta memerlukan koneksi internet untuk memuat Leaflet.</div>';
      return;
    }

    mapState.map = window.L.map(mapEl, { zoomControl: true }).setView([-2.5, 118], 5);
    paintDummyMapBase(mapState.map);
    mapState.map.fitBounds(INDONESIA_BOUNDS, { padding: [10, 10] });

    mapState.map.on("click", (event) => {
      const point = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        label: "Mencari alamat...",
      };
      if (!mapState.from) {
        mapState.from = point;
        resolvePointAddress("from");
      } else if (!mapState.to) {
        mapState.to = point;
        resolvePointAddress("to");
      } else {
        mapState.from = point;
        mapState.to = null;
        resolvePointAddress("from");
      }

      updatePointLabels();
      updateMapVisuals();
    });

    setTimeout(() => mapState.map.invalidateSize(), 120);
  }

  function recommendMode(distanceKm) {
    if (distanceKm <= 2) return "walk";
    if (distanceKm <= 8) return "bike";
    if (distanceKm <= 20) return "bus";
    return "carpool";
  }

  async function resolveAndDrawRoute(from, to, modeForEta = "motor") {
    const realRoute = await fetchRealRoute(from, to);
    const distanceKm =
      realRoute && Number.isFinite(realRoute.distanceKm) && realRoute.distanceKm > 0
        ? realRoute.distanceKm
        : haversineDistanceKm(from, to);
    const etaMinutes = estimateEtaMinutes(distanceKm, modeForEta, realRoute?.durationMin);

    if (mapState.routeLine && mapState.map) {
      mapState.map.removeLayer(mapState.routeLine);
      mapState.routeLine = null;
    }

    if (mapState.map && window.L) {
      const latlngs =
        realRoute && Array.isArray(realRoute.geometry) && realRoute.geometry.length > 1
          ? realRoute.geometry
          : [
              [from.lat, from.lng],
              [to.lat, to.lng],
            ];

      mapState.routeLine = window.L.polyline(latlngs, {
        color: "#2d5a27",
        weight: 4,
        opacity: 0.9,
      }).addTo(mapState.map);

      mapState.map.fitBounds(mapState.routeLine.getBounds(), { padding: [40, 40] });
    }

    return { realRoute, distanceKm, etaMinutes };
  }

  function renderModeComparison(distanceKm, tripsPerWeek, routeDurationMin = null) {
    if (!modeComparison) return;

    const roundTripKm = distanceKm * 2;
    const emissionByMode = Object.entries(MODE_FACTORS).map(([key, mode]) => {
      const kg = (mode.factor * roundTripKm * tripsPerWeek) / 1000;
      const etaMin = estimateEtaMinutes(distanceKm, key, routeDurationMin);
      return { key, ...mode, kg, etaMin };
    });

    const rows = emissionByMode.sort((a, b) => a.kg - b.kg);
    const maxKg = Math.max(...rows.map((item) => item.kg), 1);

    modeComparison.innerHTML = rows
      .map((item) => {
        const width = Math.max(2, (item.kg / maxKg) * 100);

        return `
          <div class="mode-row">
            <small>${item.label}</small>
            <div class="mode-bar-wrap">
              <div class="mode-bar" data-width="${width.toFixed(1)}" style="background:${item.color}"></div>
            </div>
            <div class="mode-value">${item.kg.toFixed(2)} kg <span>${formatEta(item.etaMin)}</span></div>
          </div>
        `;
      })
      .join("");

    requestAnimationFrame(() => {
      modeComparison.querySelectorAll(".mode-bar").forEach((bar) => {
        bar.style.width = `${bar.dataset.width}%`;
      });
    });
  }

  function simulateMobility({ distanceKm, tripsPerWeek, selectedMode }) {
    const weeklyKm = distanceKm * 2 * tripsPerWeek;
    const recommendedMode = recommendMode(distanceKm);

    const selectedKg = (MODE_FACTORS[selectedMode].factor * weeklyKm) / 1000;
    const suggestedKg = (MODE_FACTORS[recommendedMode].factor * weeklyKm) / 1000;
    const savedKg = Math.max(0, selectedKg - suggestedKg);

    return {
      selectedKg,
      suggestedKg,
      savedKg,
      recommendedMode,
      yearlySavedKg: savedKg * 52,
      people100SavedKg: savedKg * 100,
      weeklyKm,
    };
  }

  function getSimulationTag(savedKg) {
    if (savedKg >= 10) return { text: "Potensi Hemat Tinggi", className: "good" };
    if (savedKg >= 4) return { text: "Potensi Hemat Menengah", className: "warn" };
    return { text: "Potensi Hemat Rendah", className: "danger" };
  }

  function nearestCityFromPoints(from, to) {
    const mid = {
      lat: (from.lat + to.lat) / 2,
      lng: (from.lng + to.lng) / 2,
    };

    let nearest = "Jakarta";
    let minDistance = Infinity;

    Object.entries(CITIES).forEach(([name, coord]) => {
      const dist = haversineDistanceKm(mid, { lat: coord.lat, lng: coord.lon });
      if (dist < minDistance) {
        minDistance = dist;
        nearest = name;
      }
    });

    return nearest;
  }

  function renderRecommendations(context) {
    if (!recGrid) return;
    const items = [];

    if (context.aqi > 100) {
      items.push({
        title: "Mode Rendah Emisi Prioritas Hari Ini",
        desc: "AQI sedang tinggi. Gunakan bus/carpool atau kurangi perjalanan yang tidak mendesak.",
        chip: "Air Quality Alert",
        action: "Kurangi perjalanan jam 11.00-14.00",
      });
    } else {
      items.push({
        title: "Waktu Tepat untuk Mobilitas Hijau",
        desc: "Kualitas udara cukup baik. Jadwalkan jalan kaki atau bersepeda untuk perjalanan pendek.",
        chip: "Good Air Window",
        action: "Pilih rute hijau untuk jarak <2 km",
      });
    }

    if (context.savedKg > 0) {
      items.push({
        title: "Pertahankan Mode Alternatif",
        desc: `Pilihanmu berpotensi menekan emisi ${context.savedKg.toFixed(2)} kg CO2 per minggu. Konsisten 1 bulan akan berdampak besar.`,
        chip: "Behavior Shift",
        action: "Ulangi mode ini minimal 3 hari ke depan",
      });
    } else {
      items.push({
        title: "Optimalkan Mode Perjalanan",
        desc: "Coba mode dengan emisi lebih rendah untuk rute ini agar penghematan karbon lebih terasa.",
        chip: "Optimization",
        action: "Coba bus/carpool untuk perjalanan berikutnya",
      });
    }

    if (context.communityActionCount >= 3) {
      items.push({
        title: "Aktivasi Aksi Komunitas Lokal",
        desc: "Ada banyak agenda komunitas di sekitarmu. Pilih satu kegiatan akhir pekan untuk dampak langsung.",
        chip: "Community Action",
        action: "Gabung 1 kegiatan komunitas minggu ini",
      });
    }

    recGrid.innerHTML = items
      .slice(0, 4)
      .map(
        (item) => `
          <article class="card recommendation-card fade-up visible">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <p class="recommendation-action">Aksi cepat: <strong>${item.action}</strong></p>
            <span class="recommendation-chip">${item.chip}</span>
          </article>
        `,
      )
      .join("");

  }

  function updateHeroInsight(simResult, aqi) {
    const baseline = simResult?.savedKg || 0;
    const savedText = baseline > 0 ? `${baseline.toFixed(2)} kg/minggu` : "Belum ada";

    if (heroAqi) heroAqi.textContent = String(Math.round(aqi));
    if (heroSaving) heroSaving.textContent = savedText;

    if (!heroInsightText) return;
    heroInsightText.textContent =
      baseline > 0
        ? `Jika pola perjalanan ini dipertahankan, kamu bisa menghemat sekitar ${simResult.yearlySavedKg.toFixed(0)} kg CO2 per tahun.`
        : "Klik asal dan tujuan di peta lalu hitung untuk melihat potensi penghematan karbon tahunanmu.";
  }

  async function updateDashboardByCity(city, simResult = null) {
    const air = await fetchAQI(city);
    const descriptor = getAqiDescriptor(air.aqi);

    if (dashboardAqi) dashboardAqi.textContent = String(Math.round(air.aqi));
    if (aqiBadge) {
      aqiBadge.textContent = descriptor.label;
      aqiBadge.className = `state-chip ${descriptor.className}`;
    }
    if (aqiDesc) aqiDesc.textContent = descriptor.desc;
    if (dashboardPm25) dashboardPm25.textContent = `${Number(air.pm25).toFixed(0)} ug/m3`;
    if (dashboardPm10) dashboardPm10.textContent = `${Number(air.pm10).toFixed(0)} ug/m3`;
    if (dashboardHumidity) dashboardHumidity.textContent = `${air.humidity}%`;

    updateHeroInsight(simResult, air.aqi);
    updateAreaScore(air.aqi);
    const communityActions = getCommunityActivitiesForMap(city);
    renderCommunityActionMap(city);

    return {
      city,
      aqi: air.aqi,
      air,
      communityActionCount: communityActions.length,
    };
  }

    function setEmptyMessage(message) {
    if (!emptyCard) return;
    const msg = emptyCard.querySelector("p");
    if (msg) msg.textContent = message;
  }

  function geocodeCacheKey(point) {
    return `${point.lat.toFixed(5)},${point.lng.toFixed(5)}`;
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
    const province = provinceFromPoint(point);
    return `${province}, Indonesia`;
  }

  async function reverseGeocode(point) {
    if (point?.provinceHint) {
      return `${point.provinceHint}, Indonesia`;
    }

    const key = geocodeCacheKey(point);
    if (geocodeCache.has(key)) return geocodeCache.get(key);

    if (MOCK_MODE || DUMMY_MAP_MODE) {
      const mockAddress = mockAddressFromPoint(point);
      geocodeCache.set(key, mockAddress);
      return mockAddress;
    }

    const fallbackAddress = mockAddressFromPoint(point);
    geocodeCache.set(key, fallbackAddress);
    return fallbackAddress;
  }

  async function resolvePointAddress(role) {
    const target = role === "from" ? mapState.from : mapState.to;
    if (!target) return;
    if (target.provinceHint) {
      target.label = `${target.provinceHint}, Indonesia`;
      updatePointLabels();
      return;
    }

    const snapshot = { lat: target.lat, lng: target.lng };
    const address = await reverseGeocode(snapshot);

    const current = role === "from" ? mapState.from : mapState.to;
    if (!current) return;

    const samePoint =
      Math.abs(current.lat - snapshot.lat) < 0.000001 &&
      Math.abs(current.lng - snapshot.lng) < 0.000001;

    if (samePoint) {
      current.label = address;
      updatePointLabels();
    }
  }

  dashboardCitySelect?.addEventListener("change", async () => {
    await updateDashboardByCity(dashboardCitySelect.value);
  });

  refreshDashboardBtn?.addEventListener("click", async () => {
    refreshDashboardBtn.disabled = true;
    refreshDashboardBtn.classList.add("is-loading");
    await updateDashboardByCity(dashboardCitySelect.value);
    setTimeout(() => {
      refreshDashboardBtn.disabled = false;
      refreshDashboardBtn.classList.remove("is-loading");
    }, 300);
  });

  dashboardMoreToggle?.addEventListener("toggle", () => {
    if (!dashboardMoreToggle.open) return;
    if (!communityMapState.map) return;
    setTimeout(() => {
      communityMapState.map.invalidateSize();
    }, 180);
  });

  document.getElementById("export-png-btn")?.addEventListener("click", () => {
    window.print();
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!mapState.from || !mapState.to) {
      setEmptyMessage("Pilih titik asal dan tujuan dulu di peta, lalu klik hitung.");
      emptyCard?.classList.remove("hidden");
      resultCard?.classList.add("hidden");
      return;
    }

    const from = mapState.from;
    const to = mapState.to;
    const selectedMode = modeSelect?.value || "motor";
    const tripsPerWeek = Math.max(1, Number(tripsWeek?.value || 10));

    setButtonLoading(simulateBtn, true, "Menghitung...");
    try {
      const { realRoute, distanceKm, etaMinutes } = await resolveAndDrawRoute(
        from,
        to,
        selectedMode,
      );

      const simResult = simulateMobility({
        distanceKm,
        tripsPerWeek,
        selectedMode,
      });

      emptyCard?.classList.add("hidden");
      resultCard?.classList.remove("hidden");
      resultCard?.scrollIntoView({ behavior: "smooth", block: "start" });

      if (routeDistanceEl) routeDistanceEl.textContent = distanceKm.toFixed(2);
      if (routeEtaEl) routeEtaEl.textContent = formatEta(etaMinutes);
      if (currentEmissionEl) currentEmissionEl.textContent = simResult.selectedKg.toFixed(2);
      if (targetEmissionEl) targetEmissionEl.textContent = simResult.suggestedKg.toFixed(2);
      if (savedEmissionEl) savedEmissionEl.textContent = simResult.savedKg.toFixed(2);

      const tag = getSimulationTag(simResult.savedKg);
      if (resultTag) {
        resultTag.textContent = tag.text;
        resultTag.className = `state-chip ${tag.className}`;
      }

      const selectedLabel = MODE_FACTORS[selectedMode].label;
      const suggestedLabel = MODE_FACTORS[simResult.recommendedMode].label;

      if (simulationInsight) {
        const routeBasis = realRoute ? "rute jalan nyata" : "estimasi garis lurus";
        simulationInsight.textContent =
          `Jarak ${routeBasis} sekitar ${distanceKm.toFixed(2)} km dengan estimasi waktu ${formatEta(etaMinutes)}. Jika memakai ${selectedLabel} sebanyak ${tripsPerWeek}x pulang-pergi/minggu, emisi diperkirakan ${simResult.selectedKg.toFixed(2)} kg CO2.`;
      }

      if (populationInsight) {
        if (simResult.savedKg > 0) {
          populationInsight.textContent =
            `Untuk rute ini, mode yang lebih efisien adalah ${suggestedLabel}. Potensi hematmu ${simResult.savedKg.toFixed(2)} kg CO2 per minggu (${simResult.people100SavedKg.toFixed(0)} kg jika dilakukan 100 orang).`;
        } else {
          populationInsight.textContent =
            `Mode ${selectedLabel} sudah termasuk efisien untuk rute ini. Pertahankan kebiasaan ini agar dampaknya konsisten.`;
        }
      }

      renderModeComparison(distanceKm, tripsPerWeek, realRoute?.durationMin || null);
      const nearestCity = nearestCityFromPoints(mapState.from, mapState.to);
      if (dashboardCitySelect) dashboardCitySelect.value = nearestCity;

      const context = await updateDashboardByCity(nearestCity, simResult);
      renderRecommendations({ ...context, savedKg: simResult.savedKg });
    } finally {
      setButtonLoading(simulateBtn, false);
    }
  });

  (async function init() {
    initMap();
    syncModeDetailsByViewport();
    window.addEventListener("resize", syncModeDetailsByViewport);
    updatePointLabels();
    setEmptyMessage("Klik peta untuk memilih asal dan tujuan perjalanan.");
    const initialCity = dashboardCitySelect?.value || "Jakarta";
    const context = await updateDashboardByCity(initialCity);

    if (heroSaving) heroSaving.textContent = "Belum ada";
    if (context.communityActionCount === 0 && heroInsightText) {
      heroInsightText.textContent =
        "Mulai dengan klik peta untuk menentukan asal dan tujuan. Kami hitungkan emisinya secara otomatis.";
    }
  })();
});


