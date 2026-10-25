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
