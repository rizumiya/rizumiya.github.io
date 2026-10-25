/**
 * Mochi Pocket Extension — content_script.js
 * Memuat Layar Asli Mochi Pocket di Pojok Kiri Bawah Tab Browser & Meneruskan Mouse Tracking
 */

(function () {
  // Hindari duplikasi script
  if (window.__MOCHI_CONTENT_SCRIPT_INITIALIZED__) return;
  window.__MOCHI_CONTENT_SCRIPT_INITIALIZED__ = true;

  // 1. Cek apakah pengguna sedang berada di halaman Web Console Mochi Pocket
  const isWebConsolePage = Boolean(
    document.getElementById("gameboy-shell") ||
    window.location.pathname.includes("/projects/mochi-pocket") ||
    (window.location.hostname.includes("rizumiya.github.io") && window.location.pathname.includes("mochi-pocket"))
  );

  // Jika di Web Console, JANGAN INJECT WIDGET (agar tidak terdouble), melainkan jalankan Realtime Sync Bridge!
  if (isWebConsolePage) {
    initWebConsoleSyncBridge();
    return;
  }

  // 2. Jika di tab browser biasa (Google, YouTube, GitHub, kerja, dll.):
  // Cek pengaturan ekstensi apakah widget diaktifkan
  chrome.storage.local.get(["mochi_settings"], (data) => {
    const settings = data.mochi_settings || { enabled: true, autoFeed: true };
    if (!settings.enabled) return;

    initMochiFloatingScreen();
  });

  /**
   * Baca data pet langsung dari Web Storage tab ini (IndexedDB & localStorage)
   * Berfungsi 100% bahkan jika website belum di-redeploy!
   */
  async function readWebStoragePet() {
    let candidate = null;

    // 1. Baca langsung dari localStorage origin ini
    try {
      const raw = window.localStorage.getItem("__ERI_BOT_PET_STATE__");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && (parsed.level || parsed.name)) {
          candidate = parsed;
        }
      }
    } catch (err) {}

    // 2. Baca langsung dari IndexedDB origin ini (EriBotPetDB -> petStore -> main)
    try {
      const idbPet = await new Promise((resolve) => {
        if (!("indexedDB" in window)) return resolve(null);
        const req = window.indexedDB.open("EriBotPetDB", 1);
        req.onerror = () => resolve(null);
        req.onupgradeneeded = () => resolve(null);
        req.onsuccess = (e) => {
          const database = e.target.result;
          if (!database || !database.objectStoreNames.contains("petStore")) {
            return resolve(null);
          }
          try {
            const tx = database.transaction("petStore", "readonly");
            const store = tx.objectStore("petStore");
            const getReq = store.get("main");
            getReq.onsuccess = () => resolve(getReq.result || null);
            getReq.onerror = () => resolve(null);
          } catch (e2) {
            resolve(null);
          }
        };
      });

      if (idbPet && typeof idbPet === "object" && (idbPet.level || idbPet.name)) {
        if (!candidate || (idbPet.level || 1) >= (candidate.level || 1)) {
          candidate = idbPet;
        }
      }
    } catch (err) {}

    return candidate;
  }

  /**
   * Jembatan Sinkronisasi 1 Database antara Web Console & Ekstensi Browser
   */
  function initWebConsoleSyncBridge() {
    console.log("[Mochi Sync Bridge] Terhubung dengan Web Console Mochi Pocket!");

    // Fungsi sinkronisasi langsung dari web storage ke chrome.storage.local
    async function doDirectWebSync() {
      const webPet = await readWebStoragePet();
      if (!webPet || !webPet.level) return;

      chrome.storage.local.get(["mochi_pet"], (data) => {
        const extPet = data ? data.mochi_pet : null;
        const extLevel = extPet ? (extPet.level || 1) : 1;
        const webLevel = webPet.level || 1;
        const extTime = extPet ? (extPet.lastUpdatedAt || extPet.lastUpdated || 0) : 0;
        const webTime = webPet.lastUpdatedAt || webPet.lastUpdated || 0;

        // Jika data di Web lebih maju (misal di Web Lv.6 sedangkan di ekstensi Lv.1):
        if (!extPet || webLevel > extLevel || (webLevel === extLevel && webTime >= extTime)) {
          chrome.storage.local.set({ mochi_pet: webPet, lastSyncedWeb: Date.now() }, () => {
            console.log(`[Mochi Sync Bridge] ✅ Sukses sinkronkan karakter dari Web ke Ekstensi: ${webPet.name} (Lv.${webLevel}, Wujud: ${webPet.activeForm || 'orb'})`);
          });
        }
      });
    }

    // Ekstraksi sinkronisasi satu kali saat tab web console dibuka
    doDirectWebSync();
    setTimeout(doDirectWebSync, 800);

    // Dengarkan pesan simpan dari Web Console (Satu Arah: Web Console -> Extension Storage)
    // JANGAN kirim event balik ke Web Console agar TIDAK terjadi feedback loop berkedip!
    window.addEventListener("message", (event) => {
      if (!event.data || typeof event.data !== "object") return;

      if (event.data.type === "MOCHI_WEB_SYNC_SAVE") {
        const incomingPet = event.data.pet;
        if (incomingPet && typeof incomingPet === "object" && incomingPet.level) {
          chrome.storage.local.set({ mochi_pet: incomingPet, lastSyncedWeb: Date.now() });
        }
      }
    });
  }

  /**
   * Tampilkan Layar Peliharaan Melayang di Pojok Kiri Bawah Tab Browser Biasa
   */
  function initMochiFloatingScreen() {
    if (document.getElementById("mochi-pocket-extension-root")) return;

    // A. Buat Wrapper Iframe Mengambang di Pojok Kiri Bawah
    const iframeWrap = document.createElement("div");
    iframeWrap.id = "mochi-pocket-extension-root";
    iframeWrap.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      left: 20px !important;
      width: 236px !important;
      height: 246px !important;
      z-index: 2147483647 !important;
      border-radius: 22px !important;
      overflow: visible !important;
      box-shadow: 0 14px 38px rgba(0, 0, 0, 0.45), 0 0 0 1.5px rgba(255, 255, 255, 0.15) !important;
      transition: transform 0.2s ease, opacity 0.2s ease !important;
      pointer-events: auto !important;
    `;

    // B. Buat Iframe yang Memuat widget.html (Layar Asli 100% Mochi Pocket)
    const widgetFrame = document.createElement("iframe");
    widgetFrame.src = chrome.runtime.getURL("widget.html");
    widgetFrame.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      border-radius: 22px !important;
      overflow: hidden !important;
      background: transparent !important;
      display: block !important;
    `;
    widgetFrame.allow = "autoplay";

    iframeWrap.appendChild(widgetFrame);
    document.documentElement.appendChild(iframeWrap);

    // C. Meneruskan Posisi Kursor Mouse Tab ke Layar Pet (Tracking Mouse Paralaks)
    let lastMouseMoveTime = 0;
    window.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - lastMouseMoveTime < 35) return; // Throttle 30 FPS untuk performa mulus
      lastMouseMoveTime = now;

      try {
        if (widgetFrame && widgetFrame.contentWindow) {
          widgetFrame.contentWindow.postMessage({
            type: "MOCHI_MOUSE_MOVE",
            clientX: e.clientX,
            clientY: e.clientY,
            screenW: window.innerWidth,
            screenH: window.innerHeight
          }, "*");
        }
      } catch (err) {
        // Frame belum siap
      }
    }, { passive: true });

    // D. Dengarkan Pesan dari Iframe (Sembunyikan Widget)
    window.addEventListener("message", (e) => {
      if (e.data && e.data.type === "MOCHI_HIDE_WIDGET") {
        iframeWrap.style.transform = "scale(0.8) translateY(20px)";
        iframeWrap.style.opacity = "0";
        setTimeout(() => {
          iframeWrap.style.display = "none";
        }, 220);

        chrome.storage.local.get(["mochi_settings"], (data) => {
          const s = data.mochi_settings || {};
          s.enabled = false;
          chrome.storage.local.set({ mochi_settings: s });
        });
      }
    });

    // E. Dengarkan Perubahan Pengaturan dari Popup Ekstensi
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.mochi_settings) {
        const s = changes.mochi_settings.newValue;
        if (s) {
          if (s.enabled) {
            iframeWrap.style.display = "block";
            iframeWrap.style.transform = "scale(1) translateY(0)";
            iframeWrap.style.opacity = "1";
          } else {
            iframeWrap.style.display = "none";
          }
        }
      }
    });
  }
})();
