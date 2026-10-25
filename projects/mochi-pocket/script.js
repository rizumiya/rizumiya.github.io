/**
 * Mochi Pocket — Konsol Virtual Pet & Tamagotchi Elegan Minimalis
 * Mendukung 6 Wujud Hidup (Puni Mochi, Neko, Hamster, Anjing Shiba, Landak, Live2D) & IndexedDB
 */

const FORM_ORDER = ["orb", "cat", "hamster", "dog", "hedgehog", "live2d"];

const FORM_META = {
  orb: { tag: "PUNI", name: "Puni Mochi", icon: "🫧" },
  cat: { tag: "NEKO", name: "Kucing Neko", icon: "🐱" },
  hamster: { tag: "MOCHI", name: "Hamster Mochi", icon: "🐹" },
  dog: { tag: "SHIBA", name: "Anjing Shiba", icon: "🐶" },
  hedgehog: { tag: "UNI", name: "Landak Mini", icon: "🦔" },
  live2d: { tag: "L2D", name: "Avatar Live2D", icon: "✨" }
};

const LIVE2D_PRESETS = {
  koharu: {
    label: "Koharu (Chibi Anime Girl)",
    url: "https://cdn.jsdelivr.net/npm/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json"
  },
  wanko: {
    label: "Wanko (Anjing Mangkuk Live2D)",
    url: "https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json"
  },
  shizuku: {
    label: "Shizuku (Meja Belajar)",
    url: "https://cdn.jsdelivr.net/npm/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json"
  },
  z16: {
    label: "Z16 (Gadis Anime)",
    url: "https://cdn.jsdelivr.net/npm/live2d-widget-model-z16@1.0.5/assets/z16.model.json"
  },
  haruto: {
    label: "Haruto (Chibi Boy)",
    url: "https://cdn.jsdelivr.net/npm/live2d-widget-model-haruto@1.0.5/assets/haruto.model.json"
  },
  chitose: {
    label: "Chitose (Karakter Anime)",
    url: "https://cdn.jsdelivr.net/npm/live2d-widget-model-chitose@1.0.5/assets/chitose.model.json"
  }
};

const DEFAULT_PET_STATE = {
  id: "main",
  name: "Eri",
  isInitialized: false,
  activeForm: "orb",
  theme: "obsidian",
  scenePreference: "auto",
  live2dPreset: "koharu",
  customLive2dUrl: "",
  level: 1,
  exp: 15,
  hunger: 85,
  happiness: 90,
  energy: 95,
  isSleeping: false,
  createdAt: Date.now(),
  lastUpdatedAt: Date.now()
};

const VALID_THEMES = ["obsidian", "twilight", "slate", "matcha", "cream", "sakura"];

const SCENE_ORDER = [
  "default",
  "sunny_park",
  "rainy_day",
  "flower_garden",
  "haunted_house",
  "starry_night"
];

const SCENE_META = {
  default: {
    id: "default",
    unlockLevel: 2,
    icon: "🏠",
    name: "Kamar",
    label: "🏠 Kamar (Lv.2)"
  },
  sunny_park: {
    id: "sunny_park",
    unlockLevel: 4,
    icon: "🌤️",
    name: "Taman",
    label: "🌤️ Taman (Lv.4)"
  },
  rainy_day: {
    id: "rainy_day",
    unlockLevel: 6,
    icon: "🌧️",
    name: "Hujan",
    label: "🌧️ Hujan (Lv.6)"
  },
  flower_garden: {
    id: "flower_garden",
    unlockLevel: 8,
    icon: "🌸",
    name: "Bunga",
    label: "🌸 Bunga (Lv.8)"
  },
  haunted_house: {
    id: "haunted_house",
    unlockLevel: 10,
    icon: "🪦",
    name: "Kuburan",
    label: "🪦 Kuburan (Lv.10)"
  },
  starry_night: {
    id: "starry_night",
    unlockLevel: 12,
    icon: "🌌",
    name: "Bintang",
    label: "🌌 Bintang (Lv.12)"
  }
};

function applyConsoleTheme(themeKey) {
  const safeTheme = VALID_THEMES.includes(themeKey) ? themeKey : "obsidian";
  document.body.dataset.theme = safeTheme;
  return safeTheme;
}

/* ==========================================================================
   1. DATABASE BROWSER (IndexedDB + Fallback localStorage)
   ========================================================================== */

class PetDatabase {
  constructor() {
    this.dbName = "EriBotPetDB";
    this.storeName = "petStore";
    this.fallbackKey = "__ERI_BOT_PET_STATE__";
    this.dbPromise = this.initDB();
  }

  initDB() {
    return new Promise((resolve) => {
      if (!("indexedDB" in window)) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }

  async load() {
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        const req = store.get("main");
        req.onsuccess = () => {
          if (req.result) {
            resolve({ ...DEFAULT_PET_STATE, ...req.result });
          } else {
            resolve(this.loadFallback());
          }
        };
        req.onerror = () => resolve(this.loadFallback());
      });
    }
    return this.loadFallback();
  }

  loadFallback() {
    try {
      const raw = localStorage.getItem(this.fallbackKey);
      return raw ? { ...DEFAULT_PET_STATE, ...JSON.parse(raw) } : { ...DEFAULT_PET_STATE };
    } catch {
      return { ...DEFAULT_PET_STATE };
    }
  }

  async save(state) {
    const payload = { ...state, id: "main", lastUpdatedAt: Date.now() };
    try {
      localStorage.setItem(this.fallbackKey, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }

    const db = await this.dbPromise;
    if (!db) return payload;

    return new Promise((resolve) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      store.put(payload);
      tx.oncomplete = () => resolve(payload);
      tx.onerror = () => resolve(payload);
    });
  }

  async clear() {
    try {
      localStorage.removeItem(this.fallbackKey);
    } catch {
      // Ignore
    }
    const db = await this.dbPromise;
    if (!db) return;
    return new Promise((resolve) => {
      const tx = db.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).delete("main");
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }
}

/* ==========================================================================
   2. REFERENSI ELEMEN DOM
   ========================================================================== */

const petStageEl = document.getElementById("pet-stage");
const petInteractive = document.getElementById("pet-interactive");
const formElements = {
  orb: document.getElementById("form-orb"),
  cat: document.getElementById("form-cat"),
  hamster: document.getElementById("form-hamster"),
  dog: document.getElementById("form-dog"),
  hedgehog: document.getElementById("form-hedgehog"),
  live2d: document.getElementById("form-live2d")
};

const auroraDiaEl = document.getElementById("Aurora-Dia");
const auroraEyesEl = document.getElementById("Aurora-Dia--eyes");
const auroraLeftEye = document.getElementById("Aurora-Dia--left-eye");
const auroraRightEye = document.getElementById("Aurora-Dia--right-eye");
const tipsWrapperEl = document.getElementById("Aurora-Dia--tips-wrapper");
const tipsTextEl = document.getElementById("Aurora-Dia--tips");

const petNameDisplay = document.getElementById("pet-name-display");
const petLevelBadge = document.getElementById("pet-level-badge");
const petSceneBadge = document.getElementById("pet-scene-badge");
const sceneBgLayer = document.getElementById("scene-bg-layer");
const bezelFormName = document.getElementById("bezel-form-name");
const statusDot = document.getElementById("status-dot");
const statusLabel = document.getElementById("status-label");
const transformBurst = document.getElementById("transform-burst");
const particlesContainer = document.getElementById("particles-container");

const gaugeHunger = document.getElementById("gauge-hunger");
const gaugeHappy = document.getElementById("gauge-happy");
const gaugeEnergy = document.getElementById("gauge-energy");
const gaugeExp = document.getElementById("gauge-exp");

const live2dStageBox = document.getElementById("live2d-stage-box");
const live2dOverlay = document.getElementById("live2d-status-overlay");
const live2dStatusText = document.getElementById("live2d-status-text");
const live2dModelSelect = document.getElementById("live2d-model-select");
const live2dCustomUrl = document.getElementById("live2d-custom-url");

const guideModal = document.getElementById("guide-modal");
const characterModal = document.getElementById("character-modal");
const characterForm = document.getElementById("character-form");
const settingsModal = document.getElementById("settings-modal");
const settingsForm = document.getElementById("settings-form");
const petNameInput = document.getElementById("pet-name-input");

const minigameHud = document.getElementById("minigame-hud");
const minigameLayer = document.getElementById("minigame-layer");
const minigameIconEl = document.getElementById("minigame-icon");
const minigameScoreEl = document.getElementById("minigame-score");
const minigameTimerEl = document.getElementById("minigame-timer");

const gameSelectorDrawer = document.getElementById("game-selector-drawer");
const gameCardsTrack = document.getElementById("game-cards-track");
const gameCardButtons = Array.from(document.querySelectorAll(".game-card-option"));
const btnCloseGameSelector = document.getElementById("btn-close-game-selector");
const btnGameScrollLeft = document.getElementById("game-scroll-left");
const btnGameScrollRight = document.getElementById("game-scroll-right");

/* ==========================================================================
   3. STATE UTAMA & HELPER
   ========================================================================== */

const db = new PetDatabase();
let pet = { ...DEFAULT_PET_STATE };

let currentState = "idle"; // "idle" | "surprised" | "happy" | "angry" | "sleep"
let stateTimeout = null;
let messageTimeout = null;
let petStopTimeout = null;
let orbEyesResetTimer = null;

let clickTimestamps = [];
let isPointerDown = false;
let lastDragX = null;
let rubDistanceAccumulated = 0;
let lastHeartTime = 0;
let lastPetRewardTime = 0;

let loadedLive2dUrl = "";
let talkIndex = 0;
let activeSceneKey = "default";
let renderedSceneKey = "";

function getHighestUnlockedScene(level = 1) {
  let best = "";
  SCENE_ORDER.forEach((key) => {
    if (level >= SCENE_META[key].unlockLevel) {
      best = key;
    }
  });
  return best;
}

function resolveActiveScene() {
  const pref = pet.scenePreference || "auto";
  if (pref !== "auto" && SCENE_META[pref] && (pet.level || 1) >= SCENE_META[pref].unlockLevel) {
    return pref;
  }
  return getHighestUnlockedScene(pet.level || 1);
}

function renderSceneBackground(sceneKey) {
  const safeScene = (sceneKey && SCENE_META[sceneKey])
    ? sceneKey
    : getHighestUnlockedScene(pet.level || 1);
  activeSceneKey = safeScene;

  if (petStageEl) {
    petStageEl.dataset.scene = safeScene || "none";
  }

  if (petSceneBadge) {
    if (safeScene && SCENE_META[safeScene]) {
      const meta = SCENE_META[safeScene];
      petSceneBadge.textContent = meta.icon;
      petSceneBadge.title = `Latar: ${meta.name} (Terbuka Lv.${meta.unlockLevel})`;
    } else {
      petSceneBadge.textContent = "🎮";
      petSceneBadge.title = "Latar: Netral (Naik ke Lv.2 untuk membuka Kamar!)";
    }
  }

  if (!sceneBgLayer || renderedSceneKey === safeScene) return;
  renderedSceneKey = safeScene;
  sceneBgLayer.innerHTML = "";

  if (safeScene === "default") {
    sceneBgLayer.innerHTML = `
      <div class="scene-room-window" title="Jendela Kamar">🪟</div>
      <div class="scene-room-frame" title="Lukisan Foto">🖼️</div>
      <div class="scene-room-clock" title="Jam Dinding">⏰</div>
      <div class="scene-room-lamp" title="Lampu Hangat">💡</div>
      <div class="scene-room-plant" title="Tanaman Hias">🪴</div>
      <div class="scene-room-rug" title="Karpet Lembut"></div>
    `;
  } else if (safeScene === "sunny_park") {
    sceneBgLayer.innerHTML = `
      <div class="scene-sun"></div>
      <div class="scene-cloud" style="top: 42px; left: 12%; --drift-dur: 11s;">☁️</div>
      <div class="scene-cloud" style="top: 66px; left: 56%; --drift-dur: 15s;">⛅</div>
      <div class="scene-horizon-deco">
        <span>🌼</span><span>🌱</span><span>🌷</span><span>🍀</span><span>🌻</span>
      </div>
    `;
  } else if (safeScene === "rainy_day") {
    let dropsHtml = "";
    for (let i = 0; i < 14; i += 1) {
      const leftPct = 6 + i * 6.6;
      const dur = (0.62 + (i % 4) * 0.11).toFixed(2);
      const delay = ((i * 0.17) % 0.9).toFixed(2);
      dropsHtml += `<div class="scene-raindrop" style="left:${leftPct.toFixed(1)}%; --rain-dur:${dur}s; --rain-delay:${delay}s;"></div>`;
    }
    sceneBgLayer.innerHTML = `
      <div class="scene-cloud" style="top: 36px; left: 14%; --drift-dur: 10s; opacity: 0.55;">🌧️</div>
      <div class="scene-cloud" style="top: 40px; right: 16%; --drift-dur: 13s; opacity: 0.55;">⛈️</div>
      ${dropsHtml}
      <div class="scene-puddle"></div>
    `;
  } else if (safeScene === "flower_garden") {
    const petals = ["🌸", "💮", "🌼", "🌸", "🌷", "💮", "🌸", "🌼"];
    let petalsHtml = "";
    petals.forEach((sym, idx) => {
      const leftPct = 8 + idx * 11.5;
      const dur = (4.6 + (idx % 3) * 0.9).toFixed(2);
      const delay = (idx * 0.55).toFixed(2);
      petalsHtml += `<div class="scene-petal" style="left:${leftPct.toFixed(1)}%; --petal-dur:${dur}s; --petal-delay:${delay}s;">${sym}</div>`;
    });
    sceneBgLayer.innerHTML = `
      ${petalsHtml}
      <div class="scene-horizon-deco">
        <span>🌸</span><span>🌷</span><span>🌺</span><span>🌼</span><span>🌻</span><span>🌷</span>
      </div>
    `;
  } else if (safeScene === "haunted_house") {
    sceneBgLayer.innerHTML = `
      <div class="scene-spooky-moon"></div>
      <div class="scene-cobweb">🕸️</div>
      <div class="scene-wisp" style="top: 84px; left: 14%; --wisp-dur: 2.7s;">👻</div>
      <div class="scene-wisp" style="top: 114px; right: 14%; --wisp-dur: 3.4s;">🕯️</div>
      <div class="scene-wisp" style="top: 62px; right: 28%; --wisp-dur: 3.9s;">🟣</div>
      <div class="scene-horizon-deco" style="opacity: 0.48; bottom: 29%;">
        <span>🪦</span><span>🥀</span><span>🪦</span><span>🦇</span>
      </div>
      <div class="scene-fog"></div>
    `;
  } else if (safeScene === "starry_night") {
    let starsHtml = "";
    for (let i = 0; i < 12; i += 1) {
      const leftPct = 8 + ((i * 19) % 84);
      const topPct = 14 + ((i * 13) % 44);
      const dur = (1.5 + (i % 4) * 0.45).toFixed(2);
      starsHtml += `<div class="scene-star" style="left:${leftPct}%; top:${topPct}%; --star-dur:${dur}s;">✦</div>`;
    }
    sceneBgLayer.innerHTML = `
      <div class="scene-cloud" style="top: 38px; right: 20px; font-size: 1.45rem; --drift-dur: 18s;">🌙</div>
      ${starsHtml}
      <div class="scene-horizon-deco" style="opacity: 0.65;">
        <span>✨</span><span>🌾</span><span>🌟</span><span>🌾</span><span>✨</span>
      </div>
    `;
  }
}

function updateScenePickerLocks() {
  const currentLevel = pet.level || 1;
  if (
    pet.scenePreference &&
    pet.scenePreference !== "auto" &&
    SCENE_META[pet.scenePreference] &&
    currentLevel < SCENE_META[pet.scenePreference].unlockLevel
  ) {
    pet.scenePreference = "auto";
  }

  document.querySelectorAll('input[name="scene-bg"]').forEach((radioEl) => {
    const val = radioEl.value;
    const cardWrap = radioEl.closest(".pick-card") || radioEl.closest(".picker-option");
    if (!cardWrap) return;

    if (val === "auto") {
      radioEl.disabled = false;
      cardWrap.classList.remove("locked-scene");
      return;
    }

    const meta = SCENE_META[val];
    if (!meta) return;
    const isUnlocked = currentLevel >= meta.unlockLevel;
    radioEl.disabled = !isUnlocked;
    if (!isUnlocked && radioEl.checked) {
      radioEl.checked = false;
      const autoRadio = document.querySelector('input[name="scene-bg"][value="auto"]');
      if (autoRadio) autoRadio.checked = true;
    }
    cardWrap.classList.toggle("locked-scene", !isUnlocked);

    // Overlay gembok pada kartu format baru
    const lockEl = cardWrap.querySelector(".pick-card-lock");
    if (lockEl) {
      lockEl.textContent = isUnlocked ? "" : `🔒 Lv.${meta.unlockLevel}`;
    }

    // Nama label pemandangan
    const spanEl = cardWrap.querySelector("span[data-scene-label]");
    if (spanEl) {
      spanEl.textContent = meta.name;
    }
  });
}

const GAME_MODES = ["coin", "catcher", "header"];
const GAME_META = {
  coin: { icon: "🪙", title: "Koin Hoki", duration: 15, unit: "koin" },
  catcher: { icon: "🍙", title: "Tangkap Makan", duration: 20, unit: "poin" },
  header: { icon: "⚽", title: "Sundul Bola", duration: 25, unit: "sundulan" }
};

let isGameSelectorOpen = false;
let selectedGameIndex = 0;

let isPlayingMinigame = false;
let activeMinigameType = "coin"; // "coin" | "catcher" | "header"
let minigameScore = 0;
let minigameSeconds = 15;
let minigameSpawnTimer = null;
let minigameCountdownTimer = null;
let minigameRafId = null;
let lastFrameTime = 0;

// Kontrol Gerak Karakter Kiri-Kanan untuk Game 2 (Tangkap Makan) & Game 3 (Sundul Bola)
let playerX = 50; // Persentase posisi horizontal (16% s/d 84%)
let moveLeftHeld = false;
let moveRightHeld = false;
let isDraggingStagePlayer = false;
let catcherItems = [];
let soccerBall = null;

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[ch] || ch;
  });
}

function petNameTag() {
  return `<span>${escapeHtml(pet.name || "Eri")}</span>`;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clampStat(val) {
  return Math.max(0, Math.min(100, Math.round(val)));
}

/* ==========================================================================
   4. BALON BICARA HEXO AURORA & EFEK PANTULAN HIDUP (.talking)
   ========================================================================== */

function setActorsTalking(isTalking) {
  // Saat berada di Rumah Angker dalam keadaan idle, pertahankan efek menggigil ketakutan
  if (activeSceneKey === "haunted_house" && currentState === "idle") {
    auroraDiaEl.classList.remove("active");
    document.querySelectorAll(".lifelike-actor").forEach((actor) => {
      actor.classList.remove("talking");
    });
    return;
  }
  auroraDiaEl.classList.toggle("active", isTalking);
  document.querySelectorAll(".lifelike-actor").forEach((actor) => {
    actor.classList.toggle("talking", isTalking);
  });
}

function say(htmlMessage, duration = 5200) {
  if (messageTimeout) {
    clearTimeout(messageTimeout);
    messageTimeout = null;
  }

  tipsTextEl.innerHTML = htmlMessage;
  tipsWrapperEl.classList.add("active");

  // Memicu pantulan bicara (bounce-then-breathe) di semua wujud seperti Orb!
  setActorsTalking(false);
  void petInteractive.offsetWidth;
  setActorsTalking(true);

  if (duration > 0) {
    messageTimeout = setTimeout(() => {
      tipsWrapperEl.classList.remove("active");
      setActorsTalking(false);
    }, duration);
  }
}

function getGreetingByHour() {
  const h = new Date().getHours();
  const n = petNameTag();
  if (h >= 5 && h < 11) {
    return `Selamat pagi! ${n} sudah siap menemani harimu~ ✨`;
  }
  if (h >= 11 && h < 15) {
    return `Selamat siang~ Jangan lupa makan siang bareng ${n} ya! 🍙`;
  }
  if (h >= 15 && h < 19) {
    return `Selamat sore! Ayo istirahat sejenak dan elus kepala ${n}~ 💕`;
  }
  if (h >= 19 && h < 23) {
    return `Selamat malam! Bagaimana harimu? Ceritakan pada ${n} yuk~ 🌙`;
  }
  return `Sudah larut malam... ${n} masih setia menemanimu~ ⭐`;
}

/* ==========================================================================
   5. RENDER INDIKATOR IKON MEMUDAR (TANPA BAR!) & STATUS KONSOL
   ========================================================================== */

function updateIconGauge(el, pct, label) {
  const safePct = clampStat(pct);
  const visualPct =
    safePct <= 0 ? 0 : safePct >= 100 ? 100 : Math.round(12 + (safePct / 100) * 76);
  el.style.setProperty("--pct", `${visualPct}%`);
  el.dataset.tooltip = `${label}: ${safePct}%`;
  el.classList.toggle("low-stat", safePct <= 25 && !label.startsWith("EXP"));
}

function renderDashboard() {
  petNameDisplay.textContent = pet.name || "Eri";
  petLevelBadge.textContent = `Lv.${pet.level}`;

  const meta = FORM_META[pet.activeForm] || FORM_META.orb;
  bezelFormName.textContent = `${meta.icon} ${meta.tag}`;

  const nextScene = resolveActiveScene();
  renderSceneBackground(nextScene);
  updateScenePickerLocks();

  const difficultyMultiplier = Math.pow(1.5, Math.max(0, (pet.level || 1) - 1));
  updateIconGauge(gaugeHunger, pet.hunger, "Kenyang");
  updateIconGauge(gaugeHappy, pet.happiness, "Bahagia");
  updateIconGauge(gaugeEnergy, pet.energy, "Energi");
  updateIconGauge(
    gaugeExp,
    pet.exp,
    `EXP Lv.${pet.level} (Usaha x${difficultyMultiplier.toFixed(1)})`
  );

  if (live2dModelSelect && pet.live2dPreset) {
    live2dModelSelect.value = pet.live2dPreset;
  }
}

function getSceneUnlockDialogue(sceneKey) {
  const n = petNameTag();
  if (sceneKey === "default") {
    return `🎉 Latar Baru Terbuka: <span>Kamar</span>! Hore, ${n} sekarang punya kamar sendiri yang hangat & nyaman~ 🏠`;
  }
  if (sceneKey === "sunny_park") {
    return `🌤️ Latar Baru Terbuka: <span>Taman</span>! Wah udaranya segar banget, ayo jalan-jalan bareng ${n}~`;
  }
  if (sceneKey === "rainy_day") {
    return `🌧️ Latar Baru Terbuka: <span>Hujan</span>! Brrr... rintik hujannya dingin, jangan lupa hangatkan ${n} ya~ ☔`;
  }
  if (sceneKey === "flower_garden") {
    return `🌸 Latar Baru Terbuka: <span>Bunga</span>! Kelopak bunganya harum dan indah sekali~ 💐`;
  }
  if (sceneKey === "haunted_house") {
    return `🪦 Latar Baru Terbuka: <span>Kuburan</span>! Hiii... tempat apa ini?! Gelap dan seram, jangan tinggalkan ${n} sendirian!! 😱👻`;
  }
  if (sceneKey === "starry_night") {
    return `🌌 Latar Baru Terbuka: <span>Bintang</span>! Langit malamnya indah sekali bersama ${n}~ ✨`;
  }
  return "";
}

function addExpAndStats({ exp = 0, hunger = 0, happiness = 0, energy = 0 }) {
  pet.hunger = clampStat(pet.hunger + hunger);
  pet.happiness = clampStat(pet.happiness + happiness);
  pet.energy = clampStat(pet.energy + energy);

  // Penambahan EXP dipersulit 1.5x (+50% usaha lebih banyak) di setiap kenaikan level!
  const prevLevel = pet.level || 1;
  const difficultyMultiplier = Math.pow(1.5, Math.max(0, prevLevel - 1));
  const scaledExp = exp > 0 ? exp / difficultyMultiplier : exp;
  pet.exp = Math.max(0, Number((pet.exp + scaledExp).toFixed(2)));

  let leveledUp = false;
  let newlyUnlockedScene = null;

  while (pet.exp >= 100) {
    pet.exp = Number((pet.exp - 100).toFixed(2));
    pet.level += 1;
    leveledUp = true;

    const unlocked = SCENE_ORDER.find((k) => SCENE_META[k].unlockLevel === pet.level);
    if (unlocked) {
      newlyUnlockedScene = unlocked;
    }
  }

  renderDashboard();
  db.save(pet);

  if (leveledUp) {
    if (newlyUnlockedScene) {
      const unlockMsg = getSceneUnlockDialogue(newlyUnlockedScene);
      spawnBurstParticles([SCENE_META[newlyUnlockedScene].icon, "🎉", "⭐", "✨"]);
      say(`🎉 Naik ke <span>Level ${pet.level}</span>! ${unlockMsg}`, 6500);
    } else {
      spawnBurstParticles(["🎉", "⭐", "✨", "💖"]);
      say(
        `🎉 Hore! ${petNameTag()} naik ke <span>Level ${pet.level}</span>! Makasih sudah merawatku~`
      );
    }
  }
}

/* ==========================================================================
   6. GESTUR MOUSE INTERAKTIF (HOVER 1X, ELUS KIRI-KANAN, KLIK 3X)
   ========================================================================== */

const STATE_LED = {
  idle: { led: "led-idle", text: "SANTAI" },
  surprised: { led: "led-surprised", text: "KAGET!" },
  happy: { led: "led-happy", text: "SENANG~" },
  angry: { led: "led-angry", text: "NGAMBEK" },
  sleep: { led: "led-sleep", text: "TIDUR" }
};

function switchState(newState, duration = null) {
  if (stateTimeout) {
    clearTimeout(stateTimeout);
    stateTimeout = null;
  }

  currentState = newState;
  const hasHeadbutt = petInteractive.classList.contains("headbutt-pop");
  petInteractive.className = `pet-interactive state-${newState}${hasHeadbutt ? " headbutt-pop" : ""}`;

  const info = STATE_LED[newState] || STATE_LED.idle;
  statusDot.className = `battery-led ${info.led}`;
  statusLabel.textContent = info.text;

  if (newState !== "happy") {
    resetPetSway();
  }

  if (duration) {
    stateTimeout = setTimeout(() => {
      if (currentState === newState) {
        switchState(pet.isSleeping ? "sleep" : "idle");
      }
    }, duration);
  }
}

let smoothedSwayX = 0;

function resetPetSway() {
  smoothedSwayX = 0;
  auroraDiaEl.style.transform = "";
  live2dStageBox.style.transform = "";
  document.querySelectorAll(".chara-squash").forEach((el) => {
    el.style.transform = "";
  });
}

function applyPetSway(rawDeltaX) {
  if (pet.activeForm === "orb") {
    const swayX = Math.max(-10, Math.min(10, rawDeltaX * 0.65));
    const tiltDeg = swayX * 0.45;
    auroraDiaEl.style.transform = `translateX(${swayX}px) rotate(${tiltDeg}deg) scale(1.06, 0.94)`;
  } else if (pet.activeForm === "live2d") {
    const swayX = Math.max(-9, Math.min(9, rawDeltaX * 0.55));
    const tiltDeg = swayX * 0.3;
    live2dStageBox.style.transform = `translateX(${swayX}px) rotate(${tiltDeg}deg) scale(1.03, 0.97)`;
  } else {
    // Untuk wujud hewan (Neko, Hamster, Shiba, Landak): perhalus & batasi maksimal geser kiri-kanan agar lembut
    const clampedTarget = Math.max(-6.5, Math.min(6.5, rawDeltaX * 0.42));
    smoothedSwayX += (clampedTarget - smoothedSwayX) * 0.38;
    const tiltDeg = smoothedSwayX * 0.32;
    const activeFormEl = formElements[pet.activeForm];
    const squashEl = activeFormEl && activeFormEl.querySelector(".chara-squash");
    if (squashEl) {
      squashEl.style.transform = `translateX(${smoothedSwayX.toFixed(2)}px) rotate(${tiltDeg.toFixed(2)}deg) scale(1.03, 0.97)`;
    }
  }
}

function spawnParticleAt(x, y, symbols = ["💕", "💖", "✨", "💗"]) {
  const stageRect = particlesContainer.getBoundingClientRect();
  const item = document.createElement("div");
  item.className = "heart-particle";
  item.textContent = randomPick(symbols);

  const relX = x - stageRect.left + (Math.random() * 36 - 18);
  const relY = y - stageRect.top - 12;

  item.style.left = `${relX}px`;
  item.style.top = `${relY}px`;

  particlesContainer.appendChild(item);
  setTimeout(() => item.remove(), 1000);
}

function spawnBurstParticles(symbols = ["✨", "💕", "⭐"]) {
  const rect = petInteractive.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  for (let i = 0; i < 6; i += 1) {
    setTimeout(() => {
      spawnParticleAt(
        centerX + (Math.random() * 80 - 40),
        centerY + (Math.random() * 50 - 25),
        symbols
      );
    }, i * 65);
  }
}

// 1. Interaksi Hover: Terkejut 1x Saja (Menyesuaikan Latar Dunia Karakter!)
function getSceneHoverLines(sceneKey) {
  const n = petNameTag();
  if (sceneKey === "haunted_house") {
    return [
      `Hiii!! K-kamu bikin ${n} jantungan! Kirain hantu tadi!! 😱👻`,
      `Waaaa!! Jangan ngagetin di Kuburan dong, bulu kuduk ${n} merinding semua! 😭`,
      `Kyaaa! Tadi ada bayangan lewat di belakangmu!! Peluk ${n} cepat! 🥶`
    ];
  }
  if (sceneKey === "rainy_day") {
    return [
      `Brrr! Tetesan hujannya dingin tahu! Payungi ${n} dong~ ☔`,
      `Kyaa! Suara gemuruh petirnya bikin ${n} kaget! ⚡🌧️`,
      `Wah! Hati-hati lantainya licin kena air hujan, nanti ${n} terpeleset~ 💧`
    ];
  }
  if (sceneKey === "flower_garden") {
    return [
      `Wah! Ada kelopak bunga mendarat di hidung ${n}~ Harum sekali! 🌸`,
      `Hehe, kamu mau ngajak ${n} memetik bunga bersama di taman ya? 💐`,
      `Kupu-kupunya sampai ikut kaget waktu kamu menyapa ${n}~ 🦋✨`
    ];
  }
  if (sceneKey === "sunny_park") {
    return [
      `Yuhu! Cuaca di Taman Cerah hangat banget, ayo kejar ${n}! 🌤️`,
      `Wah! Kamu ngajak ${n} main petak umpet di taman ya? 😆🌻`,
      `Mataharinya cerah! ${n} siap bermain seharian bareng kamu~ ✨`
    ];
  }
  if (sceneKey === "starry_night") {
    return [
      `Wah! Barusan ada bintang jatuh lewat di atas kepala ${n}! Cepat buat permohonan~ 🌠`,
      `Ssst~ Langit malamnya tenang banget, ${n} senang ditemani kamu di bawah bintang! 🌌`
    ];
  }
  return [
    `Waaaa... sedang apa kamu? ${n} kaget tahu! O.O`,
    `Pelan-pelan dong, ${n} ini mungil dan menggemaskan~ O.O`,
    `<span>Siap kapten!</span> Ada yang bisa ${n} bantu? ✨`
  ];
}

function getSceneIdleLines(sceneKey) {
  const n = petNameTag();
  if (sceneKey === "haunted_house") {
    return [
      `Huuu... tempat ini gelap dan seram sekali... Jangan tinggalkan ${n} di sini sendirian ya... 🥺🕯️`,
      `S-suara derit apa itu barusan?! Pegang tangan ${n} jangan dilepas ya... 👻`,
      `${n} takut hantu... Ayo elus kepala ${n} biar lebih berani... 😭`,
      `Jangan jauh-jauh dari ${n} ya, di pojok sana kayak ada yang mengintip... 🥶`
    ];
  }
  if (sceneKey === "rainy_day") {
    return [
      `Hujannya belum reda ya... Enaknya makan onigiri hangat sambil ditemani kamu~ 🌧️🍙`,
      `Suara rintik hujan bikin suasana teduh, tapi ${n} agak kedinginan nih~ ☔`,
      `Jangan lupa pakai jaket kalau keluar ya, ${n} tidak mau kamu masuk angin~ 💕`
    ];
  }
  if (sceneKey === "flower_garden") {
    return [
      `Lihat! Banyak kelopak bunga berterbangan mengelilingi ${n}~ Indah banget! 🌸`,
      `Wangi bunga di taman ini bikin hati ${n} tenang dan bahagia sekali~ 🌷✨`,
      `Kalau ${n} selipkan bunga di telinga, kelihatan makin imut tidak? 🌺`
    ];
  }
  if (sceneKey === "sunny_park") {
    return [
      `Angin sepoi-sepoi di Taman Cerah bikin ${n} semangat seharian! 🌤️🌻`,
      `Rumputnya hijau dan hangat~ Ayo main Sundul Bola bareng ${n}! ⚽`,
      `Senangnya bisa piknik di Taman Cerah bareng sahabat terbaik ${n}~ 🍙✨`
    ];
  }
  if (sceneKey === "starry_night") {
    return [
      `Langit malamnya penuh bintang berkilauan~ Terima kasih sudah merawat ${n} sampai sejauh ini! 🌌✨`,
      `Di bawah cahaya bulan, ${n} berdoa semoga harimu selalu menyenangkan~ 🌙💖`
    ];
  }
  return [
    `Hai, aku ${n}, aku di sini untuk membantumu~`,
    getGreetingByHour(),
    `Elus kepala ${n} atau tekan <span>Tombol B</span> untuk memilih 3 Mini-Game seru! 🎮`,
    `Tekan <span>D-Pad &#x25C0;&#xFE0E; / &#x25B6;&#xFE0E;</span> untuk mengubah wujudku jadi Kucing, Hamster, Anjing, Landak, atau Live2D~ ✨`
  ];
}

petInteractive.addEventListener("mouseenter", () => {
  if (pet.isSleeping || isPlayingMinigame) return;
  if (currentState === "idle" && !isPointerDown) {
    const duration = activeSceneKey === "haunted_house" ? 920 : 820;
    switchState("surprised", duration);
    if (activeSceneKey === "haunted_house") {
      spawnBurstParticles(["😱", "👻", "💦"]);
    }
    const lines = getSceneHoverLines(activeSceneKey);
    say(randomPick(lines), 4500);
  }
});

// 2. Interaksi Klik 3x Cepat: Marah / Ngambek
petInteractive.addEventListener("click", () => {
  if (isPlayingMinigame) return;
  if (pet.isSleeping) {
    say(`Zzz... ${petNameTag()} masih tidur, tekan <span>D-Pad &#x25BC;&#xFE0E;</span> untuk membangunkanku~ 💤`);
    return;
  }

  const now = performance.now();
  clickTimestamps.push(now);
  clickTimestamps = clickTimestamps.filter((t) => now - t < 650);

  if (clickTimestamps.length >= 3) {
    clickTimestamps = [];
    isPointerDown = false;
    switchState("angry", 2600);
    const angryLines = [
      `Hmph! Jangan ketuk ${petNameTag()} cepat-cepat terus, kepalaku pusing! 💢`,
      `${petNameTag()} ngambek nih kalau dijahili terus! 💢`,
      `*Memukul jarimu dengan tangan mungil ${petNameTag()}* Jangan iseng dong! 💢`
    ];
    say(randomPick(angryLines), 4200);
  }
});

// 3. Interaksi Tahan & Geser Kiri-Kanan: Senang (Dielus)
function startPetting(clientX) {
  if (isPlayingMinigame || currentState === "angry" || pet.isSleeping) return;
  isPointerDown = true;
  lastDragX = clientX;
  rubDistanceAccumulated = 0;
}

function movePetting(clientX, clientY) {
  if (isPlayingMinigame || !isPointerDown || currentState === "angry" || pet.isSleeping) return;

  const deltaX = clientX - lastDragX;
  lastDragX = clientX;
  rubDistanceAccumulated += Math.abs(deltaX);

  if (rubDistanceAccumulated > 12) {
    if (currentState !== "happy") {
      switchState("happy");
      const happyLines = [
        `Purrrr~ Enak banget dielus! ${petNameTag()} sayang kamu~ 💕`,
        `Hehe, geli tahu~ Elus kepala ${petNameTag()} lagi dong! ✨`,
        `Nyaman sekali~ Bersama kamu membuat ${petNameTag()} bahagia! 💖`
      ];
      say(randomPick(happyLines), 4800);
    }

    applyPetSway(deltaX);

    const now = performance.now();
    if (now - lastHeartTime > 210) {
      spawnParticleAt(clientX, clientY, ["💕", "💖", "✨", "💗"]);
      lastHeartTime = now;
    }

    if (now - lastPetRewardTime > 1400) {
      addExpAndStats({ exp: 5, happiness: 3 });
      lastPetRewardTime = now;
    }

    if (petStopTimeout) clearTimeout(petStopTimeout);
    petStopTimeout = setTimeout(() => {
      if (currentState === "happy") {
        switchState("idle");
      }
    }, 520);
  }
}

function endPetting() {
  isPointerDown = false;
  lastDragX = null;
  rubDistanceAccumulated = 0;
  if (petStopTimeout) clearTimeout(petStopTimeout);
  if (currentState === "happy") {
    switchState(pet.isSleeping ? "sleep" : "idle");
  }
}

petInteractive.addEventListener("mousedown", (e) => startPetting(e.clientX));
window.addEventListener("mouseup", () => endPetting());

petInteractive.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length > 0) startPetting(e.touches[0].clientX);
  },
  { passive: true }
);
window.addEventListener("touchend", () => endPetting());

/* ==========================================================================
   7. PELACAKAN KURSOR MATA & PARALLAX UNTUK SEMUA WUJUD
   ========================================================================== */

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let animalEyesResetTimer = null;

function resetCursorTrackingTarget() {
  targetX = 0;
  targetY = 0;
  clearTimeout(animalEyesResetTimer);
  clearTimeout(orbEyesResetTimer);
  if (auroraEyesEl) {
    auroraEyesEl.style.transform = "translate3d(0, 0, 0)";
  }
}

function handlePointerMove(clientX, clientY) {
  if (pet.isSleeping) return;

  // Pelacakan Mata Wujud Puni Mochi (Hexo Aurora): responsif, jangkauan mendangak luas & halus meluncur
  if (pet.activeForm === "orb" && auroraEyesEl) {
    clearTimeout(orbEyesResetTimer);
    const rect = auroraEyesEl.getBoundingClientRect();
    const ox = -(rect.left - clientX) / 80;
    const oy = -(rect.top - clientY) / 72;
    // Jangkauan leluasa agar bisa mendangak tinggi saat kursor di atas pet
    const clampedOx = Math.max(-15, Math.min(15, ox));
    const clampedOy = Math.max(-18, Math.min(12, oy));
    auroraEyesEl.style.transform = `translate3d(${clampedOx.toFixed(2)}px, ${clampedOy.toFixed(2)}px, 0)`;

    // Kembali meluncur halus ke titik semula setelah 2.2 detik kursor diam di tempat
    orbEyesResetTimer = setTimeout(() => {
      auroraEyesEl.style.transform = "translate3d(0, 0, 0)";
    }, 2200);
    return;
  }

  // Pelacakan Kursor Wujud Hewan (Neko, Hamster, Shiba, Landak)
  const activeFormEl = formElements[pet.activeForm];
  if (!activeFormEl) return;
  const rect = activeFormEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  const dist = Math.hypot(dx, dy);
  const factor = Math.min(dist / 220, 1);
  const angle = Math.atan2(dy, dx);

  targetX = Math.cos(angle) * factor;
  targetY = Math.sin(angle) * factor;

  // Kembalikan mata & kepala ke titik semula setelah 2.2 detik kursor diam di tempat
  clearTimeout(animalEyesResetTimer);
  animalEyesResetTimer = setTimeout(() => {
    targetX = 0;
    targetY = 0;
  }, 2200);
}

window.addEventListener("mousemove", (e) => {
  handlePointerMove(e.clientX, e.clientY);
  if (isPlayingMinigame && (activeMinigameType === "catcher" || activeMinigameType === "header")) {
    if (isDraggingStagePlayer) {
      updatePlayerXFromClientX(e.clientX);
    }
    return;
  }
  movePetting(e.clientX, e.clientY);
});

window.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      if (isPlayingMinigame && (activeMinigameType === "catcher" || activeMinigameType === "header")) {
        if (isDraggingStagePlayer) {
          if (e.cancelable) e.preventDefault();
          updatePlayerXFromClientX(t.clientX);
        }
        return;
      }
      if (isPointerDown && e.cancelable) {
        e.preventDefault();
      }
      handlePointerMove(t.clientX, t.clientY);
      movePetting(t.clientX, t.clientY);
    }
  },
  { passive: false }
);

document.addEventListener("mouseleave", () => {
  resetCursorTrackingTarget();
  endPetting();
});

document.documentElement.addEventListener("mouseleave", () => {
  resetCursorTrackingTarget();
  endPetting();
});

window.addEventListener("mouseout", (e) => {
  if (!e.relatedTarget && !e.toElement) {
    resetCursorTrackingTarget();
  }
});

window.addEventListener("blur", () => {
  resetCursorTrackingTarget();
  endPetting();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    resetCursorTrackingTarget();
    endPetting();
  }
});

function animateCursorTracking() {
  if (!pet.isSleeping && pet.activeForm !== "orb" && pet.activeForm !== "live2d") {
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;
    if (Math.abs(currentX) < 0.005 && targetX === 0) currentX = 0;
    if (Math.abs(currentY) < 0.005 && targetY === 0) currentY = 0;
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;

    const activeFormEl = formElements[pet.activeForm];
    if (activeFormEl) {
      const eyes = activeFormEl.querySelectorAll(".tracking-eye");
      const irises = activeFormEl.querySelectorAll(".tracking-iris");
      const head = activeFormEl.querySelector(".parallax-head");
      const muzzle = activeFormEl.querySelector(".parallax-muzzle");
      const blush = activeFormEl.querySelector(".parallax-blush");
      const accent = activeFormEl.querySelector(".parallax-accent");
      const whiskers = activeFormEl.querySelector(".parallax-whiskers");

      const eyeScale = 10;
      eyes.forEach((eye) => {
        eye.style.transform = `translate3d(${currentX * eyeScale}px, ${currentY * (eyeScale * 0.85)}px, 0)`;
      });

      irises.forEach((iris) => {
        iris.style.transform = `translate3d(${currentX * 4}px, ${currentY * 4}px, 0)`;
      });

      if (head) {
        head.style.transform = `translate3d(calc(-50% + ${currentX * 4.5}px), ${currentY * 3}px, 0) rotate(${currentX * 4}deg)`;
      }
      if (muzzle) {
        muzzle.style.transform = `translate3d(calc(-50% + ${currentX * 5.5}px), ${currentY * 4}px, 0)`;
      }
      if (blush) {
        blush.style.transform = `translate3d(${currentX * 4.5}px, ${currentY * 3}px, 0)`;
      }
      if (accent) {
        if (pet.activeForm === "dog") {
          accent.style.transform = `translate3d(${currentX * 4}px, ${currentY * 2.5}px, 0)`;
        } else {
          accent.style.transform = `translate3d(calc(-50% + ${currentX * 4}px), ${currentY * 2.5}px, 0)`;
        }
      }
      if (whiskers) {
        whiskers.style.transform = `translate3d(calc(-50% + ${currentX * 4}px), ${currentY * 3}px, 0)`;
      }
    }
  }

  requestAnimationFrame(animateCursorTracking);
}

/* ==========================================================================
   8. SISTEM PERUBAHAN 6 WUJUD & LOADER LIVE2D (loadlive2d)
   ========================================================================== */

let live2dRuntimePromise = null;

function ensureLive2dRuntime() {
  if (typeof window.loadlive2d === "function") {
    return Promise.resolve(true);
  }
  if (live2dRuntimePromise) return live2dRuntimePromise;

  const fallbackCdns = [
    "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js",
    "https://unpkg.com/live2d-widget@3.1.4/lib/L2Dwidget.min.js"
  ];

  live2dRuntimePromise = new Promise((resolve) => {
    let idx = 0;
    const tryNext = () => {
      if (typeof window.loadlive2d === "function") {
        resolve(true);
        return;
      }
      if (idx >= fallbackCdns.length) {
        resolve(false);
        return;
      }
      const s = document.createElement("script");
      s.src = fallbackCdns[idx++];
      s.onload = () => resolve(typeof window.loadlive2d === "function");
      s.onerror = tryNext;
      document.head.appendChild(s);
    };
    setTimeout(tryNext, 350);
  });

  return live2dRuntimePromise;
}

async function loadLive2dModel(modelUrl) {
  if (!modelUrl) return;
  if (loadedLive2dUrl === modelUrl && document.getElementById("live2d-canvas")) {
    live2dOverlay.hidden = true;
    return;
  }

  live2dOverlay.hidden = false;
  live2dStatusText.textContent = "Memuat avatar Live2D...";

  const ready = await ensureLive2dRuntime();
  if (!ready || typeof window.loadlive2d !== "function") {
    live2dStatusText.textContent = "Runtime Live2D memerlukan koneksi internet.";
    return;
  }

  try {
    // Buat ulang elemen canvas bersih berasio potret (260x340) agar kepala/topi atas utuh
    const oldCanvas = document.getElementById("live2d-canvas");
    if (oldCanvas) {
      const freshCanvas = document.createElement("canvas");
      freshCanvas.id = "live2d-canvas";
      freshCanvas.width = 260;
      freshCanvas.height = 340;
      oldCanvas.replaceWith(freshCanvas);
    }

    window.loadlive2d("live2d-canvas", modelUrl);
    loadedLive2dUrl = modelUrl;
    setTimeout(() => {
      live2dOverlay.hidden = true;
    }, 450);
  } catch (err) {
    console.warn("Gagal memuat Live2D:", err);
    live2dStatusText.textContent = "Gagal memuat model Live2D.";
  }
}

function setForm(newForm, announce = true) {
  const targetForm = FORM_ORDER.includes(newForm) ? newForm : "orb";

  pet.activeForm = targetForm;
  petInteractive.dataset.activeForm = targetForm;

  // Efek Kilatan Transformasi
  transformBurst.classList.remove("burst-active");
  void transformBurst.offsetWidth;
  transformBurst.classList.add("burst-active");

  FORM_ORDER.forEach((key) => {
    if (formElements[key]) {
      formElements[key].hidden = key !== targetForm;
    }
  });

  renderDashboard();
  db.save(pet);

  if (targetForm === "live2d") {
    const preset = LIVE2D_PRESETS[pet.live2dPreset] || LIVE2D_PRESETS.koharu;
    const urlToLoad = pet.customLive2dUrl || preset.url;
    loadLive2dModel(urlToLoad);
  }

  if (announce) {
    const meta = FORM_META[targetForm] || FORM_META.orb;
    spawnBurstParticles(["✨", meta.icon, "💫"]);
    say(
      `✨ Taraaa! ${petNameTag()} berubah wujud menjadi <span>${meta.name}</span>! Lucu kan?`
    );
  }
}

function stepForm(delta = 1) {
  const idx = FORM_ORDER.indexOf(pet.activeForm);
  const nextIdx = (idx + delta + FORM_ORDER.length) % FORM_ORDER.length;
  setForm(FORM_ORDER[nextIdx], true);
}

/* ==========================================================================
   9. AKSI TAMAGOTCHI (MAKAN, NGOBROL, TIDUR, & MINI-GAME)
   ========================================================================== */

function feedPet() {
  if (pet.isSleeping) {
    say(`Zzz... ${petNameTag()} sedang tidur, tekan <span>D-Pad &#x25BC;&#xFE0E;</span> untuk membangunkanku~ 💤`);
    return;
  }
  if (pet.hunger >= 100) {
    say(`Perut ${petNameTag()} sudah kenyang 100%! Ayo main atau elus aku saja~ 🍙`);
    return;
  }

  switchState("happy", 1200);
  spawnBurstParticles(["🍙", "🌻", "🍣", "✨", "💕"]);
  addExpAndStats({ exp: 14, hunger: 22, happiness: 6, energy: 5 });

  const feedLines = [
    `Nyam nyam~ Terima kasih makanannya! Perut ${petNameTag()} jadi kenyang dan hangat~ 🍙`,
    `Wah enak sekali! ${petNameTag()} makin bersemangat menemanimu! ✨`,
    `Makanan favorit ${petNameTag()}! Makasih banyak ya~ 💖`
  ];
  say(randomPick(feedLines));
}

function talkToPet() {
  if (pet.isSleeping) {
    say(`Zzz... *${petNameTag()} mengigau pelan dalam tidurnya* 💤`);
    return;
  }

  const n = petNameTag();
  const meta = FORM_META[pet.activeForm] || FORM_META.orb;
  const sceneMeta = SCENE_META[activeSceneKey] || SCENE_META.default;
  const sceneLines = getSceneIdleLines(activeSceneKey);
  const talkPool = [
    ...sceneLines,
    `Sekarang ${n} sudah <span>Level ${pet.level}</span> di <span>${sceneMeta.icon} ${sceneMeta.name}</span> dalam wujud <span>${meta.name}</span>!`,
    `Status ${n}: Kenyang <span>${pet.hunger}%</span>, Bahagia <span>${pet.happiness}%</span>, Energi <span>${pet.energy}%</span>!`
  ];

  const chosen = talkPool[talkIndex % talkPool.length];
  talkIndex += 1;
  addExpAndStats({ exp: 6, happiness: 4 });
  say(chosen);
}

function toggleSleep() {
  if (isPlayingMinigame) stopMinigame(false);
  if (isGameSelectorOpen) closeGameSelector();

  pet.isSleeping = !pet.isSleeping;
  renderDashboard();
  db.save(pet);

  if (pet.isSleeping) {
    switchState("sleep");
    spawnBurstParticles(["💤", "🌙", "✨"]);
    say(`Hoaaam~ ${petNameTag()} tidur dulu ya untuk mengisi energi... Selamat istirahat~ 💤`, 0);
  } else {
    switchState("idle");
    spawnBurstParticles(["☀️", "✨", "💕"]);
    say(`Pagi! ${petNameTag()} sudah bangun dan segar bugar kembali! Ayo bermain~ ✨`);
  }
}

/* ==========================================================================
   10. LACI PILIHAN 3 MINI-GAME (SCROLL KANAN-KIRI) & ENGINE PERMAINAN
   ========================================================================== */

function highlightGameCard(index, scrollIntoView = true) {
  selectedGameIndex = (index + GAME_MODES.length) % GAME_MODES.length;
  gameCardButtons.forEach((btn, idx) => {
    const isActive = idx === selectedGameIndex;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
    if (isActive && scrollIntoView && gameCardsTrack) {
      const trackRect = gameCardsTrack.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const offset =
        btnRect.left - trackRect.left - trackRect.width / 2 + btnRect.width / 2;
      gameCardsTrack.scrollBy({ left: offset, behavior: "smooth" });
    }
  });
}

function openGameSelector() {
  if (isPlayingMinigame) {
    stopMinigame(false);
    return;
  }
  if (pet.isSleeping) {
    say(`Bangunkan ${petNameTag()} dulu dengan <span>D-Pad &#x25BC;&#xFE0E;</span> sebelum bermain ya~ 💤`);
    return;
  }
  if (pet.energy < 15) {
    say(`Energi ${petNameTag()} tinggal sedikit (${pet.energy}%)... Tidur atau makan dulu yuk! ⚡`);
    return;
  }

  isGameSelectorOpen = true;
  if (gameSelectorDrawer) gameSelectorDrawer.hidden = false;
  if (petStageEl) petStageEl.classList.add("game-selector-open");
  highlightGameCard(selectedGameIndex, true);
}

function closeGameSelector() {
  isGameSelectorOpen = false;
  if (gameSelectorDrawer) gameSelectorDrawer.hidden = true;
  if (petStageEl) petStageEl.classList.remove("game-selector-open");
}

function toggleGameSelector() {
  if (isPlayingMinigame) {
    stopMinigame(false);
    return;
  }
  if (isGameSelectorOpen) {
    closeGameSelector();
  } else {
    openGameSelector();
  }
}

// Drag-to-scroll horizontal dengan mouse pada daftar kartu game
if (gameCardsTrack) {
  let isTrackDown = false;
  let startTrackX = 0;
  let scrollLeftStart = 0;

  gameCardsTrack.addEventListener("mousedown", (e) => {
    isTrackDown = true;
    startTrackX = e.pageX - gameCardsTrack.offsetLeft;
    scrollLeftStart = gameCardsTrack.scrollLeft;
  });
  window.addEventListener("mouseup", () => {
    isTrackDown = false;
  });
  gameCardsTrack.addEventListener("mousemove", (e) => {
    if (!isTrackDown) return;
    e.preventDefault();
    const x = e.pageX - gameCardsTrack.offsetLeft;
    const walk = (x - startTrackX) * 1.4;
    gameCardsTrack.scrollLeft = scrollLeftStart - walk;
  });
}

if (btnCloseGameSelector) {
  btnCloseGameSelector.addEventListener("click", (e) => {
    e.stopPropagation();
    closeGameSelector();
  });
}

if (btnGameScrollLeft) {
  btnGameScrollLeft.addEventListener("click", (e) => {
    e.stopPropagation();
    highlightGameCard(selectedGameIndex - 1, true);
  });
}

if (btnGameScrollRight) {
  btnGameScrollRight.addEventListener("click", (e) => {
    e.stopPropagation();
    highlightGameCard(selectedGameIndex + 1, true);
  });
}

gameCardButtons.forEach((btn, idx) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedGameIndex = idx;
    const mode = btn.dataset.game || "coin";
    startMinigame(mode);
  });
});

function setPlayerX(nextPct) {
  playerX = Math.max(16, Math.min(84, nextPct));
  if (petStageEl) {
    petStageEl.style.setProperty("--player-x", `${playerX.toFixed(2)}%`);
  }
}

function updatePlayerXFromClientX(clientX) {
  if (!petStageEl) return;
  const rect = petStageEl.getBoundingClientRect();
  if (rect.width <= 0) return;
  const pct = ((clientX - rect.left) / rect.width) * 100;
  setPlayerX(pct);
}

// Drag/sentuh langsung di layar konsol untuk menggerakkan karakter saat Game 2 & 3
if (petStageEl) {
  petStageEl.addEventListener("mousedown", (e) => {
    if (!isPlayingMinigame || activeMinigameType === "coin") return;
    if (e.target.closest("button")) return;
    isDraggingStagePlayer = true;
    updatePlayerXFromClientX(e.clientX);
  });

  petStageEl.addEventListener("mousemove", (e) => {
    if (!isPlayingMinigame || activeMinigameType === "coin") return;
    if (e.target.closest("button")) return;
    updatePlayerXFromClientX(e.clientX);
  });

  petStageEl.addEventListener(
    "touchstart",
    (e) => {
      if (!isPlayingMinigame || activeMinigameType === "coin") return;
      if (e.target.closest("button")) return;
      if (e.touches.length > 0) {
        isDraggingStagePlayer = true;
        updatePlayerXFromClientX(e.touches[0].clientX);
      }
    },
    { passive: true }
  );
}

window.addEventListener("mouseup", () => {
  isDraggingStagePlayer = false;
  moveLeftHeld = false;
  moveRightHeld = false;
});

window.addEventListener("touchend", () => {
  isDraggingStagePlayer = false;
  moveLeftHeld = false;
  moveRightHeld = false;
});

function createOnScreenMoveButtons() {
  const leftBtn = document.createElement("button");
  leftBtn.type = "button";
  leftBtn.className = "minigame-move-btn left";
  leftBtn.innerHTML = "&#x25C0;&#xFE0E;";
  leftBtn.title = "Geser Kiri";

  const rightBtn = document.createElement("button");
  rightBtn.type = "button";
  rightBtn.className = "minigame-move-btn right";
  rightBtn.innerHTML = "&#x25B6;&#xFE0E;";
  rightBtn.title = "Geser Kanan";

  const bindHold = (btn, dir) => {
    const start = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (dir < 0) {
        moveLeftHeld = true;
        setPlayerX(playerX - 6);
      } else {
        moveRightHeld = true;
        setPlayerX(playerX + 6);
      }
    };
    const end = () => {
      if (dir < 0) moveLeftHeld = false;
      else moveRightHeld = false;
    };
    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", end);
    btn.addEventListener("pointercancel", end);
    btn.addEventListener("pointerleave", end);
  };

  bindHold(leftBtn, -1);
  bindHold(rightBtn, 1);

  minigameLayer.appendChild(leftBtn);
  minigameLayer.appendChild(rightBtn);
}

function startMinigame(gameType = "coin") {
  if (isPlayingMinigame) {
    stopMinigame(false);
    return;
  }
  if (pet.isSleeping) {
    say(`Bangunkan ${petNameTag()} dulu dengan <span>D-Pad &#x25BC;&#xFE0E;</span> sebelum bermain ya~ 💤`);
    return;
  }
  if (pet.energy < 15) {
    say(`Energi ${petNameTag()} tinggal sedikit (${pet.energy}%)... Tidur atau makan dulu yuk! ⚡`);
    return;
  }

  closeGameSelector();

  activeMinigameType = GAME_MODES.includes(gameType) ? gameType : "coin";
  const meta = GAME_META[activeMinigameType];

  isPlayingMinigame = true;
  minigameScore = 0;
  minigameSeconds = meta.duration;
  if (minigameIconEl) minigameIconEl.textContent = meta.icon;
  minigameScoreEl.textContent = "0";
  minigameTimerEl.textContent = String(minigameSeconds);

  if (messageTimeout) {
    clearTimeout(messageTimeout);
    messageTimeout = null;
  }
  tipsWrapperEl.classList.remove("active");

  if (petStageEl) {
    petStageEl.classList.add("minigame-active");
    petStageEl.classList.toggle("minigame-player-mode", activeMinigameType !== "coin");
  }

  setPlayerX(50);
  moveLeftHeld = false;
  moveRightHeld = false;
  catcherItems = [];
  soccerBall = null;

  minigameHud.hidden = false;
  minigameLayer.hidden = false;
  minigameLayer.innerHTML = "";

  if (activeMinigameType === "coin") {
    spawnFallingCoin();
    minigameSpawnTimer = setInterval(spawnFallingCoin, 680);
  } else if (activeMinigameType === "catcher") {
    createOnScreenMoveButtons();
    spawnCatcherItem();
    minigameSpawnTimer = setInterval(spawnCatcherItem, 620);
    lastFrameTime = performance.now();
    minigameRafId = requestAnimationFrame(updateMinigameFrame);
  } else if (activeMinigameType === "header") {
    createOnScreenMoveButtons();
    initSoccerBall();
    lastFrameTime = performance.now();
    minigameRafId = requestAnimationFrame(updateMinigameFrame);
  }

  minigameCountdownTimer = setInterval(() => {
    minigameSeconds -= 1;
    minigameTimerEl.textContent = String(minigameSeconds);
    if (minigameSeconds <= 0) {
      stopMinigame(true);
    }
  }, 1000);
}

// --- GAME 1: KOIN HOKI (Ketuk Koin & Permata Jatuh) ---
function spawnFallingCoin() {
  if (!isPlayingMinigame || activeMinigameType !== "coin") return;
  const coin = document.createElement("button");
  coin.type = "button";
  coin.className = "falling-star";
  const symbol = randomPick(["🪙", "🪙", "🌟", "💎"]);
  coin.textContent = symbol;
  coin.style.left = `${8 + Math.random() * 76}%`;

  const fallSeconds = (3.4 + Math.random() * 0.7).toFixed(2);
  coin.style.setProperty("--fall-duration", `${fallSeconds}s`);

  const catchCoin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (coin.dataset.caught === "1") return;
    coin.dataset.caught = "1";

    const bonus = symbol === "💎" ? 2 : 1;
    minigameScore += bonus;
    minigameScoreEl.textContent = String(minigameScore);

    const rect = coin.getBoundingClientRect();
    const cx = e.clientX || rect.left + rect.width / 2;
    const cy = e.clientY || rect.top + rect.height / 2;
    spawnParticleAt(cx, cy, ["🪙", "✨", "⭐"]);

    coin.classList.add("star-caught");
    setTimeout(() => {
      if (coin.parentNode) coin.remove();
    }, 200);
  };

  coin.addEventListener("pointerdown", catchCoin);
  coin.addEventListener("click", catchCoin);

  minigameLayer.appendChild(coin);
  setTimeout(() => {
    if (coin.parentNode && coin.dataset.caught !== "1") {
      coin.remove();
    }
  }, 4400);
}

// --- GAME 2: TANGKAP MAKANAN & HINDARI RACUN ---
function spawnCatcherItem() {
  if (!isPlayingMinigame || activeMinigameType !== "catcher") return;
  const isPoison = Math.random() < 0.28;
  const el = document.createElement("div");
  el.className = `catcher-item ${isPoison ? "poison-item" : "food-item"}`;
  el.textContent = isPoison
    ? randomPick(["☠️", "🧪", "🍄", "💣"])
    : randomPick(["🍙", "🍓", "🍰", "🍩", "🌻", "🍣"]);

  const xPct = 14 + Math.random() * 72;
  const yPx = -24;
  const speedY = 2.0 + Math.random() * 1.15;

  el.style.left = `${xPct}%`;
  el.style.top = `${yPx}px`;
  minigameLayer.appendChild(el);

  catcherItems.push({ el, xPct, yPx, speedY, isPoison });
}

// --- GAME 3: SUNDUL BOLA (Keepie-Uppie Physics) ---
function initSoccerBall() {
  const el = document.createElement("div");
  el.className = "soccer-ball-el";
  el.textContent = "⚽";
  minigameLayer.appendChild(el);

  soccerBall = {
    el,
    xPct: 50,
    yPx: 58,
    vxPct: (Math.random() < 0.5 ? -1 : 1) * 0.48,
    vyPx: 1.6,
    gravity: 0.145,
    angle: 0,
    cooldown: 0
  };
}

function triggerHeadbuttBounce() {
  petInteractive.classList.remove("headbutt-pop");
  void petInteractive.offsetWidth;
  petInteractive.classList.add("headbutt-pop");
}

function updateMinigameFrame(now) {
  if (!isPlayingMinigame) return;
  const dt = Math.min(32, Math.max(8, now - (lastFrameTime || now)));
  lastFrameTime = now;
  const dtScale = dt / 16.67;

  // Perbarui posisi horizontal pet jika tombol kiri/kanan ditahan
  if (moveLeftHeld) {
    setPlayerX(playerX - 1.75 * dtScale);
  }
  if (moveRightHeld) {
    setPlayerX(playerX + 1.75 * dtScale);
  }

  const stageH = petStageEl ? petStageEl.clientHeight : 300;
  const petRect = petInteractive.getBoundingClientRect();
  const petCenterX = petRect.left + petRect.width / 2;
  const petTopY = petRect.top + 18;

  if (activeMinigameType === "catcher") {
    const catchTopY = pet.activeForm === "orb" ? stageH - 76 : stageH - 106;
    const catchBottomY = stageH - 14;

    for (let i = catcherItems.length - 1; i >= 0; i -= 1) {
      const item = catcherItems[i];
      item.yPx += item.speedY * dtScale;
      item.el.style.top = `${item.yPx.toFixed(1)}px`;

      const hitVertical = item.yPx >= catchTopY && item.yPx <= catchBottomY;
      const hitHorizontal = Math.abs(item.xPct - playerX) <= 13.8;

      if (hitVertical && hitHorizontal) {
        if (item.isPoison) {
          minigameScore = Math.max(0, minigameScore - 2);
          minigameScoreEl.textContent = String(minigameScore);
          switchState("angry", 680);
          spawnParticleAt(petCenterX, petTopY, ["💥", "☠️", "💢"]);
        } else {
          minigameScore += 1;
          minigameScoreEl.textContent = String(minigameScore);
          switchState("happy", 380);
          spawnParticleAt(petCenterX, petTopY, ["🍙", "💖", "✨"]);
        }
        item.el.remove();
        catcherItems.splice(i, 1);
      } else if (item.yPx > stageH + 28) {
        item.el.remove();
        catcherItems.splice(i, 1);
      }
    }
  } else if (activeMinigameType === "header" && soccerBall) {
    if (soccerBall.cooldown > 0) {
      soccerBall.cooldown -= dtScale;
    }

    soccerBall.vyPx += soccerBall.gravity * dtScale;
    soccerBall.xPct += soccerBall.vxPct * dtScale;
    soccerBall.yPx += soccerBall.vyPx * dtScale;
    soccerBall.angle += soccerBall.vxPct * 9 * dtScale;

    // Pantulan dinding kiri & kanan
    if (soccerBall.xPct <= 8) {
      soccerBall.xPct = 8;
      soccerBall.vxPct = Math.abs(soccerBall.vxPct);
    } else if (soccerBall.xPct >= 92) {
      soccerBall.xPct = 92;
      soccerBall.vxPct = -Math.abs(soccerBall.vxPct);
    }

    // Pantulan atap layar
    if (soccerBall.yPx <= 42) {
      soccerBall.yPx = 42;
      soccerBall.vyPx = Math.abs(soccerBall.vyPx) * 0.85;
    }

    // Deteksi sundulan kepala karakter
    const headHitY = pet.activeForm === "orb" ? stageH - 72 : stageH - 102;
    const dxPct = soccerBall.xPct - playerX;

    if (
      soccerBall.cooldown <= 0 &&
      soccerBall.vyPx > 0 &&
      soccerBall.yPx >= headHitY - 14 &&
      soccerBall.yPx <= headHitY + 28 &&
      Math.abs(dxPct) <= 15.8
    ) {
      soccerBall.cooldown = 10;
      soccerBall.yPx = headHitY - 15;
      const speedBoost = Math.min(1.5, minigameScore * 0.05);
      soccerBall.vyPx = -(5.35 + speedBoost);

      const normOffset = dxPct / 15.8;
      soccerBall.vxPct =
        normOffset * 1.15 + (Math.random() * 0.24 - 0.12);
      soccerBall.vxPct = Math.max(-1.45, Math.min(1.45, soccerBall.vxPct));

      minigameScore += 1;
      minigameScoreEl.textContent = String(minigameScore);

      triggerHeadbuttBounce();
      switchState("happy", 360);
      spawnParticleAt(petCenterX, petTopY, ["⚽", "✨", "⭐"]);
    } else if (soccerBall.yPx > stageH - 8) {
      // Bola jatuh ke tanah: karakter cemberut sebentar lalu bola di-serve ulang dari atas
      switchState("angry", 560);
      spawnParticleAt(petCenterX, petTopY, ["💢", "💨"]);
      soccerBall.xPct = 24 + Math.random() * 52;
      soccerBall.yPx = 56;
      soccerBall.vyPx = 1.35;
      soccerBall.vxPct = (Math.random() < 0.5 ? -1 : 1) * 0.45;
      soccerBall.cooldown = 12;
    }

    soccerBall.el.style.left = `${soccerBall.xPct.toFixed(2)}%`;
    soccerBall.el.style.top = `${soccerBall.yPx.toFixed(1)}px`;
    soccerBall.el.style.transform = `translate(-50%, -50%) rotate(${soccerBall.angle.toFixed(1)}deg)`;
  }

  minigameRafId = requestAnimationFrame(updateMinigameFrame);
}

function stopMinigame(completed = true) {
  isPlayingMinigame = false;
  moveLeftHeld = false;
  moveRightHeld = false;
  isDraggingStagePlayer = false;

  clearInterval(minigameSpawnTimer);
  clearInterval(minigameCountdownTimer);
  if (minigameRafId) {
    cancelAnimationFrame(minigameRafId);
    minigameRafId = null;
  }

  catcherItems = [];
  soccerBall = null;

  if (petStageEl) {
    petStageEl.classList.remove("minigame-active", "minigame-player-mode");
    petStageEl.style.removeProperty("--player-x");
  }
  petInteractive.classList.remove("headbutt-pop");

  minigameHud.hidden = true;
  minigameLayer.hidden = true;
  minigameLayer.innerHTML = "";

  const meta = GAME_META[activeMinigameType] || GAME_META.coin;

  if (completed) {
    const expGain = Math.max(12, minigameScore * 6);
    const happyGain = Math.min(25, 6 + minigameScore * 2);
    const hungerBonus = activeMinigameType === "catcher" ? Math.min(14, minigameScore * 2) : -5;
    addExpAndStats({ exp: expGain, happiness: happyGain, energy: -10, hunger: hungerBonus });
    switchState("happy", 1400);
    say(
      `🎉 Skor <span>${meta.title}: ${minigameScore} ${meta.unit}</span>! ${petNameTag()} dapat <span>+${expGain} EXP</span> &amp; <span>+${happyGain}% Bahagia</span>!`
    );
  } else {
    switchState(pet.isSleeping ? "sleep" : "idle");
    say(`Permainan dihentikan. Kapan-kapan main lagi bareng ${petNameTag()} ya~`);
  }
}

/* ==========================================================================
   11. KONTROL TOMBOL GAMEBOY, KEYBOARD, & MODAL PENGATURAN
   ========================================================================== */

const btnPrevForm = document.getElementById("btn-prev-form");
const btnNextForm = document.getElementById("btn-next-form");

function handleDpadLeft() {
  if (isPlayingMinigame && activeMinigameType !== "coin") {
    setPlayerX(playerX - 8);
    return;
  }
  if (isGameSelectorOpen) {
    highlightGameCard(selectedGameIndex - 1, true);
    return;
  }
  stepForm(-1);
}

function handleDpadRight() {
  if (isPlayingMinigame && activeMinigameType !== "coin") {
    setPlayerX(playerX + 8);
    return;
  }
  if (isGameSelectorOpen) {
    highlightGameCard(selectedGameIndex + 1, true);
    return;
  }
  stepForm(1);
}

btnPrevForm.addEventListener("click", handleDpadLeft);
btnNextForm.addEventListener("click", handleDpadRight);

// Dukungan tahan tombol D-Pad Kiri/Kanan untuk menggerakkan karakter dengan mulus saat Mini-Game
btnPrevForm.addEventListener("pointerdown", () => {
  if (isPlayingMinigame && activeMinigameType !== "coin") moveLeftHeld = true;
});
btnNextForm.addEventListener("pointerdown", () => {
  if (isPlayingMinigame && activeMinigameType !== "coin") moveRightHeld = true;
});
["pointerup", "pointercancel", "pointerleave"].forEach((evt) => {
  btnPrevForm.addEventListener(evt, () => {
    moveLeftHeld = false;
  });
  btnNextForm.addEventListener(evt, () => {
    moveRightHeld = false;
  });
});

document.getElementById("btn-talk").addEventListener("click", talkToPet);
document.getElementById("btn-sleep").addEventListener("click", toggleSleep);
document.getElementById("btn-feed").addEventListener("click", () => {
  if (isGameSelectorOpen) {
    const chosenMode = GAME_MODES[selectedGameIndex] || "coin";
    startMinigame(chosenMode);
    return;
  }
  feedPet();
});
document.getElementById("btn-play").addEventListener("click", toggleGameSelector);
document.getElementById("btn-stop-minigame").addEventListener("click", () => stopMinigame(false));

// Modal Panduan (SELECT)
document.getElementById("btn-open-guide").addEventListener("click", () => {
  guideModal.hidden = false;
});
document.getElementById("btn-close-guide").addEventListener("click", () => {
  guideModal.hidden = true;
});

// Modal Karakter (Nama, Bentuk Wujud, & Latar Dunia Karakter)
function openCharacterModal() {
  petNameInput.value = pet.name || "Eri";
  const avatarEl = document.getElementById("char-name-avatar");
  if (avatarEl && FORM_META[pet.activeForm]) {
    avatarEl.textContent = FORM_META[pet.activeForm].icon;
  }
  const radio = document.querySelector(`input[name="starter-form"][value="${pet.activeForm}"]`);
  if (radio) radio.checked = true;
  updateScenePickerLocks();
  const scenePref = pet.scenePreference || "auto";
  const sceneRadio = document.querySelector(`input[name="scene-bg"][value="${scenePref}"]`);
  if (sceneRadio && !sceneRadio.disabled) {
    sceneRadio.checked = true;
  } else {
    const autoRadio = document.querySelector('input[name="scene-bg"][value="auto"]');
    if (autoRadio) autoRadio.checked = true;
  }
  if (characterModal) {
    characterModal.hidden = false;
    setTimeout(() => petNameInput.focus(), 50);
  }
}

// Navigasi Tab Folder Modal Karakter (Bentuk vs Latar)
document.querySelectorAll(".char-tab").forEach((tabBtn) => {
  tabBtn.addEventListener("click", () => {
    const tabKey = tabBtn.dataset.tab;
    document.querySelectorAll(".char-tab").forEach((btn) => {
      const isActive = btn === tabBtn;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    document.querySelectorAll(".char-panel").forEach((panel) => {
      const isActive = panel.dataset.panel === tabKey;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  });
});

// Modal Pengaturan Global (Tema Konsol, Preset Live2D, & Database IndexedDB)
function openSettingsModal() {
  const themeRadio = document.querySelector(
    `input[name="console-theme"][value="${pet.theme || "obsidian"}"]`
  );
  if (themeRadio) themeRadio.checked = true;
  if (live2dModelSelect) live2dModelSelect.value = pet.live2dPreset || "koharu";
  live2dCustomUrl.value = pet.customLive2dUrl || "";
  settingsModal.hidden = false;
}

// Pratinjau langsung tema konsol saat diklik di modal pengaturan global
document.querySelectorAll('input[name="console-theme"]').forEach((radioEl) => {
  radioEl.addEventListener("change", (e) => {
    const chosenTheme = applyConsoleTheme(e.target.value);
    pet.theme = chosenTheme;
    db.save(pet);
  });
});

// Pratinjau langsung Bentuk/Wujud Karakter saat diklik di modal karakter
document.querySelectorAll('input[name="starter-form"]').forEach((radioEl) => {
  radioEl.addEventListener("change", (e) => {
    const chosenVal = e.target.value;
    setForm(chosenVal, false);
    const avatarEl = document.getElementById("char-name-avatar");
    if (avatarEl && FORM_META[chosenVal]) {
      avatarEl.textContent = FORM_META[chosenVal].icon;
    }
  });
});

// Pratinjau langsung Latar Karakter saat diklik di modal karakter (Hanya yang sudah terbuka!)
document.querySelectorAll('input[name="scene-bg"]').forEach((radioEl) => {
  const cardWrap = radioEl.closest(".pick-card") || radioEl.closest(".picker-option");
  if (cardWrap) {
    cardWrap.addEventListener("click", (e) => {
      const val = radioEl.value;
      const meta = SCENE_META[val];
      if (meta && (pet.level || 1) < meta.unlockLevel) {
        e.preventDefault();
        e.stopPropagation();
        say(
          `🔒 Latar <span>${meta.name}</span> masih terkunci! Rawat ${petNameTag()} sampai <span>Level ${meta.unlockLevel}</span> untuk membukanya~`
        );
      }
    });
  }

  radioEl.addEventListener("change", (e) => {
    const val = e.target.value || "auto";
    const meta = SCENE_META[val];
    if (meta && (pet.level || 1) < meta.unlockLevel) {
      e.target.checked = false;
      const autoRadio = document.querySelector('input[name="scene-bg"][value="auto"]');
      if (autoRadio) autoRadio.checked = true;
      return;
    }
    pet.scenePreference = val;
    renderDashboard();
    db.save(pet);
    const activeScene = resolveActiveScene();
    const lines = getSceneIdleLines(activeScene);
    say(randomPick(lines), 5200);
  });
});

document.getElementById("btn-open-character").addEventListener("click", openCharacterModal);
document.getElementById("btn-quick-rename").addEventListener("click", openCharacterModal);
if (bezelFormName) {
  bezelFormName.addEventListener("click", openCharacterModal);
}
document.getElementById("btn-close-character").addEventListener("click", () => {
  if (characterModal) characterModal.hidden = true;
});

document.getElementById("btn-open-settings").addEventListener("click", openSettingsModal);
document.getElementById("btn-close-settings").addEventListener("click", () => {
  settingsModal.hidden = true;
});

if (characterForm) {
  characterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName = petNameInput.value.trim() || "Eri";
    const selectedRadio = document.querySelector('input[name="starter-form"]:checked');
    const chosenForm = selectedRadio ? selectedRadio.value : pet.activeForm;
    const selectedSceneRadio = document.querySelector('input[name="scene-bg"]:checked');
    const chosenScenePref = selectedSceneRadio
      ? selectedSceneRadio.value
      : pet.scenePreference || "auto";

    pet.name = newName;
    pet.scenePreference = chosenScenePref;
    pet.isInitialized = true;
    if (characterModal) characterModal.hidden = true;

    setForm(chosenForm, false);
    renderDashboard();
    await db.save(pet);
    spawnBurstParticles(["🎉", "💖", "✨"]);
    const activeScene = resolveActiveScene();
    say(randomPick(getSceneIdleLines(activeScene)), 5200);
  });
}

settingsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const selectedThemeRadio = document.querySelector('input[name="console-theme"]:checked');
  const chosenTheme = selectedThemeRadio ? selectedThemeRadio.value : pet.theme || "obsidian";

  pet.theme = applyConsoleTheme(chosenTheme);
  pet.live2dPreset = live2dModelSelect.value || "koharu";
  pet.customLive2dUrl = live2dCustomUrl.value.trim();
  pet.isInitialized = true;
  settingsModal.hidden = true;

  loadedLive2dUrl = ""; // Paksa muat ulang jika preset Live2D berubah
  if (pet.activeForm === "live2d") {
    setForm("live2d", false);
  }
  renderDashboard();
  await db.save(pet);
  spawnBurstParticles(["✨", "💖"]);
  say(`⚙️ Pengaturan global &amp; Live2D untuk ${petNameTag()} berhasil disimpan!`);
});

document.getElementById("btn-load-custom-live2d").addEventListener("click", () => {
  const customUrl = live2dCustomUrl.value.trim();
  if (!customUrl) return;
  pet.customLive2dUrl = customUrl;
  const live2dRadio = document.querySelector('input[name="starter-form"][value="live2d"]');
  if (live2dRadio) live2dRadio.checked = true;
  settingsModal.hidden = true;
  loadedLive2dUrl = "";
  setForm("live2d", false);
  say(`✨ Memuat model Live2D kustom untuk ${petNameTag()}...`);
});

// Ekspor, Impor, & Reset IndexedDB
document.getElementById("btn-export-save").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(pet, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(pet.name || "eri").toLowerCase().replace(/\s+/g, "-")}-pocket-save.json`;
  a.click();
  URL.revokeObjectURL(url);
  say(`📥 Data ${petNameTag()} berhasil diekspor ke berkas JSON!`);
});

document.getElementById("input-import-save").addEventListener("change", async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    pet = { ...DEFAULT_PET_STATE, ...imported, id: "main", isInitialized: true };
    pet.theme = applyConsoleTheme(pet.theme || "obsidian");
    await db.save(pet);
    settingsModal.hidden = true;
    loadedLive2dUrl = "";
    setForm(pet.activeForm, false);
    if (pet.isSleeping) switchState("sleep");
    say(`📤 Data ${petNameTag()} (Lv.${pet.level}) berhasil dipulihkan!`);
  } catch {
    say(`⚠️ Berkas JSON tidak valid.`);
  }
});

document.getElementById("btn-reset-save").addEventListener("click", async () => {
  await db.clear();
  pet = { ...DEFAULT_PET_STATE };
  pet.theme = applyConsoleTheme(pet.theme);
  settingsModal.hidden = true;
  setForm("orb", false);
  switchState("idle");
  renderDashboard();
  openCharacterModal();
});

// Dukungan Keyboard Layaknya Konsol GameBoy Asli
window.addEventListener("keydown", (e) => {
  if (!guideModal.hidden || !settingsModal.hidden || (characterModal && !characterModal.hidden)) {
    if (e.key === "Escape") {
      guideModal.hidden = true;
      settingsModal.hidden = true;
      if (characterModal) characterModal.hidden = true;
    }
    return;
  }
  if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

  if (e.key === "Escape") {
    if (isPlayingMinigame) stopMinigame(false);
    else if (isGameSelectorOpen) closeGameSelector();
    return;
  }

  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    e.preventDefault();
    if (isPlayingMinigame && activeMinigameType !== "coin") {
      moveLeftHeld = true;
      return;
    }
    handleDpadLeft();
  } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    e.preventDefault();
    if (isPlayingMinigame && activeMinigameType !== "coin") {
      moveRightHeld = true;
      return;
    }
    handleDpadRight();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    talkToPet();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    toggleSleep();
  } else if (e.key === "z" || e.key === "Z" || e.key === "Enter") {
    e.preventDefault();
    if (isGameSelectorOpen) {
      const chosenMode = GAME_MODES[selectedGameIndex] || "coin";
      startMinigame(chosenMode);
      return;
    }
    feedPet();
  } else if (e.key === "x" || e.key === "X") {
    e.preventDefault();
    toggleGameSelector();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    moveLeftHeld = false;
  } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    moveRightHeld = false;
  }
});

// Event Copy & Visibility Change (Warisan Autentik Hexo Aurora)
document.addEventListener("copy", () => {
  say(`Apa yang telah kamu salin? Ingat untuk menambahkan sumbernya ya, kata ${petNameTag()}!`);
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !pet.isSleeping) {
    say(`Selamat datang kembali, temanku! ${petNameTag()} merindukanmu~`);
  }
});

// Siklus Tamagotchi Otomatis (Tiap 25 detik)
setInterval(() => {
  if (!pet.isInitialized) return;

  if (pet.isSleeping) {
    pet.energy = clampStat(pet.energy + 5);
    pet.hunger = clampStat(pet.hunger - 1);
    if (pet.energy >= 100) {
      pet.isSleeping = false;
      switchState("idle");
      say(`☀️ Energi ${petNameTag()} sudah penuh (100%)! Aku bangun sekarang ya~`);
    }
  } else {
    pet.hunger = clampStat(pet.hunger - 1);
    pet.energy = clampStat(pet.energy - 1);
    if (pet.hunger < 30) {
      pet.happiness = clampStat(pet.happiness - 1);
    }
  }

  renderDashboard();
  db.save(pet);
}, 25000);

// Pesan Idle Otomatis (Tiap 28 detik)
setInterval(() => {
  if (!pet.isInitialized || isPlayingMinigame || isGameSelectorOpen || document.hidden) return;
  if (pet.isSleeping) {
    spawnBurstParticles(["💤"]);
    return;
  }

  if (pet.hunger <= 25) {
    say(`Kruyuk~ Perut ${petNameTag()} lapar nih (${pet.hunger}%)... Tekan <span>Tombol A</span> untuk memberi makan! 🍙`);
    return;
  }
  if (pet.energy <= 20) {
    say(`Hoaaam... Energi ${petNameTag()} tinggal ${pet.energy}%, tidurkan aku lewat <span>D-Pad &#x25BC;&#xFE0E;</span> yuk~ 💤`);
    return;
  }

  const idleLines = getSceneIdleLines(activeSceneKey);
  say(randomPick(idleLines));
}, 28000);

/* ==========================================================================
   12. INISIALISASI KONSOL SAAT DIMUAT
   ========================================================================== */

async function initApp() {
  pet = await db.load();

  if (!FORM_ORDER.includes(pet.activeForm)) {
    pet.activeForm = "orb";
  }
  pet.theme = applyConsoleTheme(pet.theme || "obsidian");

  const elapsedMinutes = Math.floor((Date.now() - (pet.lastUpdatedAt || Date.now())) / 60000);
  if (pet.isInitialized && elapsedMinutes > 0) {
    const steps = Math.min(20, elapsedMinutes);
    if (pet.isSleeping) {
      pet.energy = clampStat(pet.energy + steps * 4);
    } else {
      pet.hunger = clampStat(pet.hunger - Math.floor(steps * 0.5));
      pet.energy = clampStat(pet.energy - Math.floor(steps * 0.5));
    }
  }

  renderDashboard();
  setForm(pet.activeForm, false);

  if (pet.isSleeping) {
    switchState("sleep");
    say(`Zzz... ${petNameTag()} masih tertidur pulas~ 💤`, 0);
  } else {
    switchState("idle");
    const initLines = getSceneIdleLines(activeSceneKey);
    say(initLines[0], 0);
  }

  if (!pet.isInitialized) {
    openCharacterModal();
  }

  animateCursorTracking();
}

initApp();
