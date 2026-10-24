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
const settingsModal = document.getElementById("settings-modal");
const settingsForm = document.getElementById("settings-form");
const petNameInput = document.getElementById("pet-name-input");

const minigameHud = document.getElementById("minigame-hud");
const minigameLayer = document.getElementById("minigame-layer");
const minigameScoreEl = document.getElementById("minigame-score");
const minigameTimerEl = document.getElementById("minigame-timer");

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

let isPlayingMinigame = false;
let minigameScore = 0;
let minigameSeconds = 15;
let minigameSpawnTimer = null;
let minigameCountdownTimer = null;

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

  updateIconGauge(gaugeHunger, pet.hunger, "Kenyang");
  updateIconGauge(gaugeHappy, pet.happiness, "Bahagia");
  updateIconGauge(gaugeEnergy, pet.energy, "Energi");
  updateIconGauge(gaugeExp, pet.exp, `EXP Lv.${pet.level}`);

  if (live2dModelSelect && pet.live2dPreset) {
    live2dModelSelect.value = pet.live2dPreset;
  }
}

function addExpAndStats({ exp = 0, hunger = 0, happiness = 0, energy = 0 }) {
  pet.hunger = clampStat(pet.hunger + hunger);
  pet.happiness = clampStat(pet.happiness + happiness);
  pet.energy = clampStat(pet.energy + energy);
  pet.exp = Math.max(0, pet.exp + exp);

  let leveledUp = false;
  while (pet.exp >= 100) {
    pet.exp -= 100;
    pet.level += 1;
    leveledUp = true;
  }

  renderDashboard();
  db.save(pet);

  if (leveledUp) {
    spawnBurstParticles(["🎉", "⭐", "✨", "💖"]);
    say(`🎉 Hore! ${petNameTag()} naik ke <span>Level ${pet.level}</span>! Makasih sudah merawatku~`);
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
  petInteractive.className = `pet-interactive state-${newState}`;

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

// 1. Interaksi Hover: Terkejut 1x Saja
petInteractive.addEventListener("mouseenter", () => {
  if (pet.isSleeping || isPlayingMinigame) return;
  if (currentState === "idle" && !isPointerDown) {
    switchState("surprised", 820);
    const lines = [
      `Waaaa... sedang apa kamu? ${petNameTag()} kaget tahu! O.O`,
      `Pelan-pelan dong, ${petNameTag()} ini mungil dan menggemaskan~ O.O`,
      `<span>Siap kapten!</span> Ada yang bisa ${petNameTag()} bantu? ✨`
    ];
    say(randomPick(lines), 4200);
  }
});

// 2. Interaksi Klik 3x Cepat: Marah / Ngambek
petInteractive.addEventListener("click", () => {
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
  if (currentState === "angry" || pet.isSleeping) return;
  isPointerDown = true;
  lastDragX = clientX;
  rubDistanceAccumulated = 0;
}

function movePetting(clientX, clientY) {
  if (!isPointerDown || currentState === "angry" || pet.isSleeping) return;

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

function handlePointerMove(clientX, clientY) {
  if (pet.isSleeping) return;

  // Pelacakan Mata Asli Wujud Orb (Hexo Aurora)
  if (pet.activeForm === "orb" && auroraEyesEl) {
    clearTimeout(orbEyesResetTimer);
    auroraEyesEl.classList.add("moving");
    const rect = auroraEyesEl.getBoundingClientRect();
    const ox = -(rect.left - clientX) / 95;
    const oy = -(rect.top - clientY) / 115;
    auroraLeftEye.style.transform = `translateY(${oy}px) translateX(${ox}px)`;
    auroraRightEye.style.transform = `translateY(${oy}px) translateX(${ox}px)`;

    orbEyesResetTimer = setTimeout(() => {
      auroraLeftEye.style.transform = "translateY(0) translateX(0)";
      auroraRightEye.style.transform = "translateY(0) translateX(0)";
      auroraEyesEl.classList.remove("moving");
    }, 2000);
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
}

window.addEventListener("mousemove", (e) => {
  handlePointerMove(e.clientX, e.clientY);
  movePetting(e.clientX, e.clientY);
});

window.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      handlePointerMove(t.clientX, t.clientY);
      movePetting(t.clientX, t.clientY);
    }
  },
  { passive: true }
);

window.addEventListener("mouseleave", () => {
  targetX = 0;
  targetY = 0;
  endPetting();
});

function animateCursorTracking() {
  if (!pet.isSleeping && pet.activeForm !== "orb" && pet.activeForm !== "live2d") {
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
  const talkPool = [
    `Hai, aku ${n}, aku di sini untuk membantumu~`,
    `Sekarang ${n} sudah <span>Level ${pet.level}</span> dalam wujud <span>${meta.name}</span>!`,
    `Tekan <span>D-Pad &#x25C0;&#xFE0E; / &#x25B6;&#xFE0E;</span> kalau ingin melihat ${n} berubah wujud jadi hewan lain ya~ ✨`,
    `Lama tidak bertemu, waktu berlalu begitu cepat saat bersama ${n}...`,
    `Jangan lupa istirahat dan minum air putih ya! ${n} selalu peduli padamu~ 💕`,
    `Status ${n}: Kenyang <span>${pet.hunger}%</span>, Bahagia <span>${pet.happiness}%</span>, Energi <span>${pet.energy}%</span>!`
  ];

  const chosen = talkPool[talkIndex % talkPool.length];
  talkIndex += 1;
  addExpAndStats({ exp: 6, happiness: 4 });
  say(chosen);
}

function toggleSleep() {
  if (isPlayingMinigame) stopMinigame(false);

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
   10. MINI-GAME: TANGKAP BINTANG
   ========================================================================== */

function startMinigame() {
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

  isPlayingMinigame = true;
  minigameScore = 0;
  minigameSeconds = 15;
  minigameScoreEl.textContent = "0";
  minigameTimerEl.textContent = "15";

  // Sembunyikan balon percakapan selama mini-game agar layar lega untuk klik bintang
  if (messageTimeout) {
    clearTimeout(messageTimeout);
    messageTimeout = null;
  }
  tipsWrapperEl.classList.remove("active");

  if (petStageEl) petStageEl.classList.add("minigame-active");
  minigameHud.hidden = false;
  minigameLayer.hidden = false;
  minigameLayer.innerHTML = "";

  spawnFallingStar();
  minigameSpawnTimer = setInterval(spawnFallingStar, 720);
  minigameCountdownTimer = setInterval(() => {
    minigameSeconds -= 1;
    minigameTimerEl.textContent = String(minigameSeconds);
    if (minigameSeconds <= 0) {
      stopMinigame(true);
    }
  }, 1000);
}

function spawnFallingStar() {
  if (!isPlayingMinigame) return;
  const star = document.createElement("button");
  star.type = "button";
  star.className = "falling-star";
  star.textContent = randomPick(["✦", "⭐", "💎", "🌟"]);
  star.style.left = `${8 + Math.random() * 76}%`;

  const fallSeconds = (3.6 + Math.random() * 0.7).toFixed(2);
  star.style.setProperty("--fall-duration", `${fallSeconds}s`);

  const catchStar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (star.dataset.caught === "1") return;
    star.dataset.caught = "1";

    minigameScore += 1;
    minigameScoreEl.textContent = String(minigameScore);

    const rect = star.getBoundingClientRect();
    const cx = e.clientX || rect.left + rect.width / 2;
    const cy = e.clientY || rect.top + rect.height / 2;
    spawnParticleAt(cx, cy, ["✨", "⭐", "💖"]);

    star.classList.add("star-caught");
    setTimeout(() => {
      if (star.parentNode) star.remove();
    }, 200);
  };

  // Gunakan pointerdown agar bintang yang bergerak langsung tertangkap begitu disentuh/diklik!
  star.addEventListener("pointerdown", catchStar);
  star.addEventListener("click", catchStar);

  minigameLayer.appendChild(star);
  setTimeout(() => {
    if (star.parentNode && star.dataset.caught !== "1") {
      star.remove();
    }
  }, 4500);
}

function stopMinigame(completed = true) {
  isPlayingMinigame = false;
  clearInterval(minigameSpawnTimer);
  clearInterval(minigameCountdownTimer);
  if (petStageEl) petStageEl.classList.remove("minigame-active");
  minigameHud.hidden = true;
  minigameLayer.hidden = true;
  minigameLayer.innerHTML = "";

  if (completed) {
    const expGain = Math.max(12, minigameScore * 6);
    const happyGain = Math.min(25, 6 + minigameScore * 2);
    addExpAndStats({ exp: expGain, happiness: happyGain, energy: -10, hunger: -5 });
    switchState("happy", 1400);
    say(
      `🎉 Skor <span>${minigameScore} bintang</span>! ${petNameTag()} dapat <span>+${expGain} EXP</span> &amp; <span>+${happyGain}% Bahagia</span>!`
    );
  } else {
    say(`Permainan dihentikan. Kapan-kapan main lagi bareng ${petNameTag()} ya~`);
  }
}

/* ==========================================================================
   11. KONTROL TOMBOL GAMEBOY, KEYBOARD, & MODAL PENGATURAN
   ========================================================================== */

document.getElementById("btn-prev-form").addEventListener("click", () => stepForm(-1));
document.getElementById("btn-next-form").addEventListener("click", () => stepForm(1));
document.getElementById("btn-talk").addEventListener("click", talkToPet);
document.getElementById("btn-sleep").addEventListener("click", toggleSleep);
document.getElementById("btn-feed").addEventListener("click", feedPet);
document.getElementById("btn-play").addEventListener("click", startMinigame);
document.getElementById("btn-stop-minigame").addEventListener("click", () => stopMinigame(false));

// Modal Panduan (SELECT)
document.getElementById("btn-open-guide").addEventListener("click", () => {
  guideModal.hidden = false;
});
document.getElementById("btn-close-guide").addEventListener("click", () => {
  guideModal.hidden = true;
});

// Modal Pengaturan & Database (START / Klik Badge Nama)
function openSettingsModal() {
  petNameInput.value = pet.name || "Eri";
  const radio = document.querySelector(`input[name="starter-form"][value="${pet.activeForm}"]`);
  if (radio) radio.checked = true;
  const themeRadio = document.querySelector(
    `input[name="console-theme"][value="${pet.theme || "obsidian"}"]`
  );
  if (themeRadio) themeRadio.checked = true;
  if (live2dModelSelect) live2dModelSelect.value = pet.live2dPreset || "koharu";
  live2dCustomUrl.value = pet.customLive2dUrl || "";
  settingsModal.hidden = false;
  setTimeout(() => petNameInput.focus(), 50);
}

// Pratinjau langsung tema saat diklik di modal pengaturan
document.querySelectorAll('input[name="console-theme"]').forEach((radioEl) => {
  radioEl.addEventListener("change", (e) => {
    const chosenTheme = applyConsoleTheme(e.target.value);
    pet.theme = chosenTheme;
    db.save(pet);
  });
});

document.getElementById("btn-open-settings").addEventListener("click", openSettingsModal);
document.getElementById("btn-quick-rename").addEventListener("click", openSettingsModal);
document.getElementById("btn-close-settings").addEventListener("click", () => {
  settingsModal.hidden = true;
});

settingsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newName = petNameInput.value.trim() || "Eri";
  const selectedRadio = document.querySelector('input[name="starter-form"]:checked');
  const chosenForm = selectedRadio ? selectedRadio.value : pet.activeForm;
  const selectedThemeRadio = document.querySelector('input[name="console-theme"]:checked');
  const chosenTheme = selectedThemeRadio ? selectedThemeRadio.value : pet.theme || "obsidian";

  pet.name = newName;
  pet.theme = applyConsoleTheme(chosenTheme);
  pet.live2dPreset = live2dModelSelect.value || "koharu";
  pet.customLive2dUrl = live2dCustomUrl.value.trim();
  pet.isInitialized = true;
  settingsModal.hidden = true;

  loadedLive2dUrl = ""; // Paksa muat ulang jika preset Live2D berubah
  setForm(chosenForm, false);
  await db.save(pet);
  spawnBurstParticles(["🎉", "💖", "✨"]);
  say(`Hai! Aku ${petNameTag()}, senang bertemu denganmu! Rawat dan ajak aku bermain ya~`);
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
  openSettingsModal();
});

// Dukungan Keyboard Layaknya Konsol GameBoy Asli
window.addEventListener("keydown", (e) => {
  if (!guideModal.hidden || !settingsModal.hidden) {
    if (e.key === "Escape") {
      guideModal.hidden = true;
      settingsModal.hidden = true;
    }
    return;
  }
  if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    stepForm(-1);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    stepForm(1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    talkToPet();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    toggleSleep();
  } else if (e.key === "z" || e.key === "Z") {
    e.preventDefault();
    feedPet();
  } else if (e.key === "x" || e.key === "X") {
    e.preventDefault();
    startMinigame();
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
  if (!pet.isInitialized || isPlayingMinigame || document.hidden) return;
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

  const idleLines = [
    `Hai, aku ${petNameTag()}, aku di sini untuk membantumu~`,
    getGreetingByHour(),
    `Elus kepala ${petNameTag()} atau tekan <span>Tombol B</span> untuk main Tangkap Bintang! ⭐`,
    `Tekan <span>D-Pad &#x25C0;&#xFE0E; / &#x25B6;&#xFE0E;</span> untuk mengubah wujudku jadi Kucing, Hamster, Anjing, Landak, atau Live2D~ ✨`
  ];
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
    say(`Hai, aku ${petNameTag()}, aku di sini untuk membantumu~`, 0);
  }

  if (!pet.isInitialized) {
    openSettingsModal();
  }

  animateCursorTracking();
}

initApp();
