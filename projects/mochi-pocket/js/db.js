/**
 * Mochi Pocket — js/db.js
 * Penyimpanan Data Pet (IndexedDB dengan Fallback localStorage)
 */

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
        const database = event.target.result;
        if (!database.objectStoreNames.contains(this.storeName)) {
          database.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }

  async load() {
    // 1. Jika di Extension Environment (widget.html, popup.html), utamakan muat dari chrome.storage.local!
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      try {
        const extPet = await new Promise((resolve) => {
          chrome.storage.local.get(["mochi_pet"], (res) => {
            resolve(res && res.mochi_pet ? res.mochi_pet : null);
          });
        });
        if (extPet && typeof extPet === "object" && (extPet.level || extPet.name || extPet.hunger !== undefined)) {
          return { ...DEFAULT_PET_STATE, ...extPet };
        }
      } catch (e) {
        // Fallback ke IndexedDB jika gagal
      }
    }

    // 2. Jika di Web Browser (halaman web https://...), muat dari IndexedDB / localStorage
    const database = await this.dbPromise;
    if (database) {
      return new Promise((resolve) => {
        const tx = database.transaction(this.storeName, "readonly");
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

    // Sinkronisasi Realtime dengan Ekstensi Browser jika tersedia
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      try {
        chrome.storage.local.set({ mochi_pet: payload });
      } catch (e) {
        // Abaikan jika tidak di extension context
      }
    }

    // Jika berjalan di Web Console (halaman web), kirimkan ke content script ekstensi via postMessage
    if (typeof window !== "undefined") {
      window.postMessage({ type: "MOCHI_WEB_SYNC_SAVE", pet: payload }, "*");
    }

    const database = await this.dbPromise;
    if (!database) return payload;

    return new Promise((resolve) => {
      const tx = database.transaction(this.storeName, "readwrite");
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
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      try {
        chrome.storage.local.remove(["mochi_pet"]);
      } catch (e) {}
    }
    const database = await this.dbPromise;
    if (!database) return;
    return new Promise((resolve) => {
      const tx = database.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).delete("main");
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }
}

const db = new PetDatabase();
let pet = { ...DEFAULT_PET_STATE };

// Sinkronisasi Dua Arah Realtime Lintas Tab Browser via Chrome Storage
if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.onChanged) {
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.mochi_pet && changes.mochi_pet.newValue) {
        const incoming = changes.mochi_pet.newValue;
        // Hindari menimpa jika state kita lebih baru
        if (!incoming.lastUpdatedAt || incoming.lastUpdatedAt >= (pet.lastUpdatedAt || 0)) {
          Object.assign(pet, incoming);
          if (typeof renderDashboard === "function") {
            renderDashboard();
          }
        }
      }
    });
  } catch (syncErr) {
    // Non-extension context
  }
}

// Sinkronisasi Realtime antara Web Console (halaman web) & Ekstensi Browser via Content Script Bridge
if (typeof window !== "undefined") {
  // Minta data dari ekstensi saat web dibuka
  setTimeout(() => {
    window.postMessage({ type: "MOCHI_WEB_REQUEST_LOAD" }, "*");
  }, 100);

  window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data !== "object") return;

    if (event.data.type === "MOCHI_EXT_SYNC_LOAD" || event.data.type === "MOCHI_EXT_SYNC_UPDATE") {
      const incoming = event.data.pet;
      if (!incoming || typeof incoming !== "object") {
        // Jika ekstensi belum memiliki data pet, segera kirim data lokal web ke ekstensi!
        if (pet && pet.level && pet.level >= 1) {
          window.postMessage({ type: "MOCHI_WEB_SYNC_SAVE", pet: pet }, "*");
        }
        return;
      }

      const currentLevel = pet.level || 1;
      const incomingLevel = incoming.level || 1;
      const currentTime = pet.lastUpdatedAt || 0;
      const incomingTime = incoming.lastUpdatedAt || incoming.lastUpdated || 0;

      // Jika data web lokal lebih maju (misal di web sudah Lv.6, sedangkan ekstensi baru Lv.1 bawaan):
      // Sinkronkan data web kita ke ekstensi agar ekstensi otomatis naik ke Lv.6!
      if (currentLevel > incomingLevel || (currentLevel === incomingLevel && currentTime > incomingTime)) {
        window.postMessage({ type: "MOCHI_WEB_SYNC_SAVE", pet: pet }, "*");
        return;
      }

      // Sebaliknya, jika data ekstensi sama atau lebih tinggi / lebih baru:
      Object.assign(pet, incoming);
      if (typeof applyConsoleTheme === "function" && pet.theme) {
        applyConsoleTheme(pet.theme);
      }
      if (typeof setForm === "function" && pet.activeForm) {
        setForm(pet.activeForm, false);
      }
      if (typeof renderDashboard === "function") {
        renderDashboard();
      }
    }
  });
}
