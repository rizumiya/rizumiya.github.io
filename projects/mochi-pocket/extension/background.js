/**
 * Mochi Pocket Extension — background.js (Service Worker Manifest V3)
 * Mengelola siklus Tamagotchi background, timer Auto-Feeder, dan sinkronisasi lintas tab
 */

const DEFAULT_PET_STATE = {
  name: "Eri",
  level: 1,
  exp: 0,
  hunger: 80,
  happiness: 90,
  energy: 85,
  activeForm: "cat",
  isSleeping: false,
  isDead: false,
  generation: 1,
  lastUpdated: Date.now()
};

const DEFAULT_SETTINGS = {
  enabled: true,
  position: "bottom-left",
  size: "normal", // "compact" | "normal"
  autoFeedEnabled: true,
  autoFeedThreshold: 25 // Beri makan otomatis jika kenyang <= 25%
};

// Inisialisasi awal saat ekstensi dipasang
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(["mochi_pet", "mochi_settings"]);
  if (!data.mochi_pet) {
    await chrome.storage.local.set({ mochi_pet: DEFAULT_PET_STATE });
  }
  if (!data.mochi_settings) {
    await chrome.storage.local.set({ mochi_settings: DEFAULT_SETTINGS });
  }

  // Atur Alarm Berkala: Siklus Tamagotchi (tiap 1 menit)
  chrome.alarms.create("mochi_lifecycle_tick", { periodInMinutes: 1 });
  // Atur Alarm Auto-Feeder Cerdas (tiap 3 menit)
  chrome.alarms.create("mochi_autofeed_check", { periodInMinutes: 3 });

  console.log("[Mochi Background] Ekstensi berhasil diinisialisasi.");
});

// Penanganan Alarm Terjadwal
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const data = await chrome.storage.local.get(["mochi_pet", "mochi_settings"]);
  let pet = data.mochi_pet || { ...DEFAULT_PET_STATE };
  const settings = data.mochi_settings || { ...DEFAULT_SETTINGS };

  if (pet.isDead) return;

  if (alarm.name === "mochi_lifecycle_tick") {
    // 1. Siklus Hidup Alami di Background
    if (pet.isSleeping) {
      pet.energy = Math.min(100, (pet.energy || 0) + 4);
      pet.hunger = Math.max(0, (pet.hunger || 0) - 0.4);
      pet.happiness = Math.max(0, (pet.happiness || 0) - 0.5);
      if (pet.energy >= 100) {
        pet.isSleeping = false;
      }
    } else {
      // Saat bangun didiamkan: Bahagia (-1.2) > Kenyang (-1.0) > Energi (-0.7) per menit background
      pet.happiness = Math.max(0, (pet.happiness || 0) - 1.2);
      pet.hunger = Math.max(0, (pet.hunger || 0) - 1.0);
      pet.energy = Math.max(0, (pet.energy || 0) - 0.7);
    }

    // Cek kematian kelaparan jika kenyang habis
    if (pet.hunger <= 0) {
      pet.isDead = true;
    }

    pet.lastUpdated = Date.now();
    await chrome.storage.local.set({ mochi_pet: pet });
  }

  if (alarm.name === "mochi_autofeed_check") {
    // 2. Timer Beri Makan Otomatis (Auto-Feeder Caretaker)
    if (settings.autoFeedEnabled && !pet.isDead && !pet.isSleeping) {
      const threshold = settings.autoFeedThreshold || 25;
      if (pet.hunger <= threshold) {
        // Auto-feeder memberi makan 1 mangkok penuh (+25% kenyang)
        pet.hunger = Math.min(100, pet.hunger + 25);
        pet.happiness = Math.min(100, pet.happiness + 5);
        pet.energy = Math.min(100, pet.energy + 3);
        pet.lastAutoFed = Date.now();
        pet.lastUpdated = Date.now();

        await chrome.storage.local.set({ mochi_pet: pet });
        console.log(`[Auto-Feeder] ${pet.name} telah diberi makan otomatis! Kenyang sekarang: ${pet.hunger}%`);
      }
    }
  }
});

// Listener Pesan Sinkronisasi dari Web Blog atau Popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SYNC_PET_STATE_FROM_WEB") {
    chrome.storage.local.set({ mochi_pet: message.pet, lastSyncedWeb: Date.now() }, () => {
      sendResponse({ status: "ok" });
    });
    return true;
  }
  if (message.type === "GET_PET_STATE") {
    chrome.storage.local.get(["mochi_pet", "mochi_settings", "mochi_custom_mods"], (res) => {
      sendResponse(res);
    });
    return true;
  }
});
