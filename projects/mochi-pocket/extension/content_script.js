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
   * Jembatan Sinkronisasi 1 Database antara Web Console & Ekstensi Browser
   */
  function initWebConsoleSyncBridge() {
    console.log("[Mochi Sync Bridge] Terhubung dengan Web Console Mochi Pocket!");

    // A. Saat web console pertama kali dibuka, kirimkan data dari extension storage (jika ada)
    chrome.storage.local.get(["mochi_pet"], (data) => {
      if (data && data.mochi_pet) {
        window.postMessage({
          type: "MOCHI_EXT_SYNC_LOAD",
          pet: data.mochi_pet
        }, "*");
      }
    });

    // B. Dengarkan pesan simpan / minta muat dari Web Console
    window.addEventListener("message", (event) => {
      if (!event.data || typeof event.data !== "object") return;

      if (event.data.type === "MOCHI_WEB_SYNC_SAVE") {
        const incomingPet = event.data.pet;
        if (incomingPet && typeof incomingPet === "object") {
          chrome.storage.local.set({ mochi_pet: incomingPet, lastSyncedWeb: Date.now() });
        }
      }

      if (event.data.type === "MOCHI_WEB_REQUEST_LOAD") {
        chrome.storage.local.get(["mochi_pet"], (data) => {
          window.postMessage({
            type: "MOCHI_EXT_SYNC_LOAD",
            pet: data.mochi_pet || null
          }, "*");
        });
      }
    });

    // C. Dengarkan pembaruan data dari background / tab lain dan teruskan ke Web Console
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.mochi_pet && changes.mochi_pet.newValue) {
        window.postMessage({
          type: "MOCHI_EXT_SYNC_UPDATE",
          pet: changes.mochi_pet.newValue
        }, "*");
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
