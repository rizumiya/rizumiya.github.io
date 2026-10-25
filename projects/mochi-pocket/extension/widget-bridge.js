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
      // Posisi mouse di layar tab pengguna
      const pageX = data.clientX;
      const pageY = data.clientY;

      // Hitung posisi relatif ke widget yang berada di pojok kiri bawah
      const screenW = data.screenW || window.innerWidth;
      const screenH = data.screenH || window.innerHeight;

      // Widget berada di pojok kiri bawah: target pusat sekitar x=120, y=screenH - 120
      const relX = pageX - 120;
      const relY = pageY - (screenH - 120);

      // Gerakkan mata dan kepala karakter mengikuti kursor mouse di tab web
      if (typeof handleTrackingEyes === "function") {
        // Skala delta kursor agar paralaks mata terasa hidup
        const eyeDeltaX = Math.max(-18, Math.min(18, relX * 0.035));
        const eyeDeltaY = Math.max(-14, Math.min(14, relY * 0.035));

        const trackingEyes = document.querySelectorAll(".tracking-eye");
        const trackingIrises = document.querySelectorAll(".tracking-iris");

        trackingEyes.forEach((eye) => {
          eye.style.transform = `translate(${eyeDeltaX.toFixed(1)}px, ${eyeDeltaY.toFixed(1)}px)`;
        });

        trackingIrises.forEach((iris) => {
          iris.style.transform = `translate(${(eyeDeltaX * 1.3).toFixed(1)}px, ${(eyeDeltaY * 1.3).toFixed(1)}px)`;
        });

        // Paralaks kepala
        const heads = document.querySelectorAll(".parallax-head");
        heads.forEach((h) => {
          h.style.transform = `translate3d(${(eyeDeltaX * 0.45).toFixed(1)}px, ${(eyeDeltaY * 0.35).toFixed(1)}px, 0)`;
        });
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

