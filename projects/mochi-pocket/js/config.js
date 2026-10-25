/**
 * Mochi Pocket — js/config.js
 * Konfigurasi Karakter, Pemandangan Latar, Tema Konsol, Preset Live2D, Game & Helper
 */

const IS_DEV_MODE =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "file:" ||
    window.location.hostname === "");

const FORM_ORDER = [
  "orb",
  "cat",
  "hamster",
  "dog",
  "hedgehog",
  "duck",
  "sheep",
  "cow",
  "rabbit",
  "pig",
  "penguin",
  "live2d"
];

const FORM_META = {
  orb: { tag: "PUNI", name: "Puni Mochi", icon: "🫧", unlockLevel: 1 },
  cat: { tag: "NEKO", name: "Kucing Neko", icon: "🐱", unlockLevel: 1 },
  hamster: { tag: "MOCHI", name: "Hamster Mochi", icon: "🐹", unlockLevel: 1 },
  dog: { tag: "SHIBA", name: "Anjing Shiba", icon: "🐶", unlockLevel: 1 },
  hedgehog: { tag: "UNI", name: "Landak Mini", icon: "🦔", unlockLevel: 1 },
  duck: { tag: "PIYO", name: "Bebek Piyo", icon: "🐥", unlockLevel: 5 },
  sheep: { tag: "MOFU", name: "Domba Mofu", icon: "🐑", unlockLevel: 7 },
  cow: { tag: "USHI", name: "Sapi Chibi", icon: "🐮", unlockLevel: 9 },
  rabbit: { tag: "USAGI", name: "Kelinci Usagi", icon: "🐰", unlockLevel: 11 },
  pig: { tag: "BUTTY", name: "Babi Chibi", icon: "🐷", unlockLevel: 13 },
  penguin: { tag: "PINGU", name: "Penguin Pingu", icon: "🐧", unlockLevel: 15 },
  live2d: { tag: "L2D", name: "Avatar Live2D", icon: "✨", unlockLevel: 1 }
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
  "starry_night",
  "snowy_winter",
  "bakery_shop",
  "tropical_beach",
  "magic_forest"
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
  },
  snowy_winter: {
    id: "snowy_winter",
    unlockLevel: 14,
    icon: "❄️",
    name: "Salju",
    label: "❄️ Salju (Lv.14)"
  },
  bakery_shop: {
    id: "bakery_shop",
    unlockLevel: 16,
    icon: "🥖",
    name: "Roti",
    label: "🥖 Roti (Lv.16)"
  },
  tropical_beach: {
    id: "tropical_beach",
    unlockLevel: 18,
    icon: "🏖️",
    name: "Pantai",
    label: "🏖️ Pantai (Lv.18)"
  },
  magic_forest: {
    id: "magic_forest",
    unlockLevel: 20,
    icon: "🍄",
    name: "Hutan",
    label: "🍄 Hutan (Lv.20)"
  }
};

const GAME_MODES = ["coin", "catcher", "header"];
const GAME_META = {
  coin: { icon: "🪙", title: "Koin Hoki", duration: 15, unit: "koin" },
  catcher: { icon: "🍙", title: "Tangkap Makan", duration: 20, unit: "poin" },
  header: { icon: "⚽", title: "Sundul Bola", duration: 25, unit: "sundulan" }
};

const STATE_LED = {
  idle: { led: "led-idle", text: "SANTAI" },
  surprised: { led: "led-surprised", text: "KAGET!" },
  happy: { led: "led-happy", text: "SENANG~" },
  angry: { led: "led-angry", text: "NGAMBEK" },
  sleep: { led: "led-sleep", text: "TIDUR" }
};

function applyConsoleTheme(themeKey) {
  const safeTheme = VALID_THEMES.includes(themeKey) ? themeKey : "obsidian";
  document.body.dataset.theme = safeTheme;
  return safeTheme;
}

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

function getGreetingByHour() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return "Selamat pagi! Awali harimu dengan senyum manis ya~ ☀️";
  if (hour >= 11 && hour < 15) return "Selamat siang! Jangan lupa makan siang dan istirahat sejenak~ 🍙";
  if (hour >= 15 && hour < 18) return "Selamat sore! Hari ini menyenangkan sekali kan? 🌤️";
  return "Selamat malam! Istirahat yang cukup biar besok bugar lagi ya~ 🌙";
}
