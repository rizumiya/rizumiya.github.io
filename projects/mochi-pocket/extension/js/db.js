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
