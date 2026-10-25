/**
 * Mochi Pocket — js/forms.js
 * Manajemen Perubahan Wujud Karakter & Runtime Live2D
 */

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
  const currentLevel = pet.level || 1;
  let targetForm = FORM_ORDER.includes(newForm) ? newForm : "orb";
  const targetMeta = FORM_META[targetForm];
  if (targetMeta && currentLevel < (targetMeta.unlockLevel || 1)) {
    targetForm = "orb";
  }

  pet.activeForm = targetForm;
  petInteractive.dataset.activeForm = targetForm;

  // Efek Kilatan Transformasi
  if (transformBurst) {
    transformBurst.classList.remove("burst-active");
    void transformBurst.offsetWidth;
    transformBurst.classList.add("burst-active");
  }

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
  const currentLevel = pet.level || 1;
  const unlockedForms = FORM_ORDER.filter((key) => {
    const meta = FORM_META[key];
    return !meta || (meta.unlockLevel || 1) <= currentLevel;
  });
  if (!unlockedForms.length) return;

  const idx = unlockedForms.indexOf(pet.activeForm);
  const safeIdx = idx >= 0 ? idx : 0;
  const nextIdx = (safeIdx + delta + unlockedForms.length) % unlockedForms.length;
  setForm(unlockedForms[nextIdx], true);
}
