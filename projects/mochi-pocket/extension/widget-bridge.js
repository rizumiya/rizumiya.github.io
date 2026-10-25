/**
 * Mochi Pocket Extension — widget-bridge.js
 * Jembatan Komunikasi Tracking Kursor Tab Browser, Sinkronisasi Data & Aksi Cepat
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("[Mochi Widget] Layar asli Mochi Pocket aktif di browser!");

  // 1. Tangani Pesan Mouse Move dari Halaman Tab Browser Utama
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || typeof data !== "object") return;

    if (data.type === "MOCHI_MOUSE_MOVE") {
      const pageX = data.clientX;
      const pageY = data.clientY;
      const screenH = data.screenH || window.innerHeight;

      // Widget berada di pojok kiri bawah (left: 20px, bottom: 20px)
      // Pusat karakter pet di viewport sekitar x = 138px, y = screenH - 130px
      const petCenterX = 138;
      const petCenterY = screenH - 130;

      const dx = pageX - petCenterX;
      const dy = pageY - petCenterY;
      const dist = Math.hypot(dx, dy);
      const factor = Math.min(dist / 380, 1);
      const angle = Math.atan2(dy, dx);

      // Sinkronkan target koordinat ke engine tracking interaksi bawaan
      if (typeof targetX !== "undefined") {
        targetX = Math.cos(angle) * factor;
        targetY = Math.sin(angle) * factor;

        if (typeof animalEyesResetTimer !== "undefined") {
          clearTimeout(animalEyesResetTimer);
          animalEyesResetTimer = setTimeout(() => {
            targetX = 0;
            targetY = 0;
          }, 2400);
        }
      }

      // Dukungan wujud Orb (Puni Aurora Dia)
      if (typeof auroraEyesEl !== "undefined" && auroraEyesEl) {
        if (typeof orbEyesResetTimer !== "undefined") clearTimeout(orbEyesResetTimer);
        const clampedOx = Math.max(-15, Math.min(15, dx / 48));
        const clampedOy = Math.max(-18, Math.min(12, dy / 48));
        auroraEyesEl.style.transform = `translate3d(${clampedOx.toFixed(2)}px, ${clampedOy.toFixed(2)}px, 0)`;

        if (typeof orbEyesResetTimer !== "undefined") {
          orbEyesResetTimer = setTimeout(() => {
            auroraEyesEl.style.transform = "translate3d(0, 0, 0)";
          }, 2400);
        }
      }
    }
  });

  // 2. Tombol Aksi Cepat di Quick Bar Melayang
  const btnFeed = document.getElementById("btn-widget-feed");
  if (btnFeed) {
    btnFeed.addEventListener("click", (e) => {
      e.stopPropagation();
      if (typeof feedPet === "function") feedPet();
    });
  }

  const btnSleep = document.getElementById("btn-widget-sleep");
  if (btnSleep) {
    btnSleep.addEventListener("click", (e) => {
      e.stopPropagation();
      if (typeof toggleSleep === "function") toggleSleep();
    });
  }

  const btnTalk = document.getElementById("btn-widget-talk");
  if (btnTalk) {
    btnTalk.addEventListener("click", (e) => {
      e.stopPropagation();
      if (typeof talkToPet === "function") talkToPet();
    });
  }

  const btnForm = document.getElementById("btn-widget-form");
  if (btnForm) {
    btnForm.addEventListener("click", (e) => {
      e.stopPropagation();
      if (typeof handleDpadRight === "function") handleDpadRight();
    });
  }

  const btnOpenWeb = document.getElementById("btn-widget-open-web");
  if (btnOpenWeb) {
    btnOpenWeb.addEventListener("click", (e) => {
      e.stopPropagation();
      window.open("https://rizumiya.github.io/projects/mochi-pocket/", "_blank");
    });
  }

  const btnClose = document.getElementById("btn-widget-close");
  if (btnClose) {
    btnClose.addEventListener("click", (e) => {
      e.stopPropagation();
      window.parent.postMessage({ type: "MOCHI_HIDE_WIDGET" }, "*");
    });
  }
});
