/**
 * Mochi Pocket Extension — popup.js
 * Logika Menu Popup Toolbar Ekstensi
 */

document.addEventListener("DOMContentLoaded", () => {
  const elName = document.getElementById("popup-pet-name");
  const elLvl = document.getElementById("popup-pet-lvl");
  const barHunger = document.getElementById("bar-hunger");
  const barHappy = document.getElementById("bar-happy");
  const barEnergy = document.getElementById("bar-energy");
  const barExp = document.getElementById("bar-exp");
  const txtHunger = document.getElementById("txt-hunger");
  const txtHappy = document.getElementById("txt-happy");
  const txtEnergy = document.getElementById("txt-energy");
  const txtExp = document.getElementById("txt-exp");

  const toggleFloating = document.getElementById("toggle-floating-pet");
  const toggleAutoFeed = document.getElementById("toggle-autofeed");

  const btnImportMod = document.getElementById("btn-import-mod");
  const fileInput = document.getElementById("file-mod-input");
  const btnOpenConsole = document.getElementById("btn-open-web-console");

  function renderPopup(pet, settings) {
    if (pet) {
      elName.textContent = pet.name || "Eri";
      elLvl.textContent = `Lv.${pet.level || 1}`;

      const h = Math.round(pet.hunger || 0);
      const hp = Math.round(pet.happiness || 0);
      const en = Math.round(pet.energy || 0);
      const ex = Math.round(pet.exp || 0);

      barHunger.style.width = `${h}%`;
      txtHunger.textContent = `${h}%`;

      barHappy.style.width = `${hp}%`;
      txtHappy.textContent = `${hp}%`;

      barEnergy.style.width = `${en}%`;
      txtEnergy.textContent = `${en}%`;

      barExp.style.width = `${ex}%`;
      txtExp.textContent = `${ex}%`;
    }

    if (settings) {
      toggleFloating.checked = settings.enabled !== false;
      toggleAutoFeed.checked = settings.autoFeedEnabled !== false;
    }
  }

  // Muat data awal
  chrome.storage.local.get(["mochi_pet", "mochi_settings"], (data) => {
    renderPopup(data.mochi_pet, data.mochi_settings);
  });

  // Listener Saklar Tampilkan Pet
  toggleFloating.addEventListener("change", () => {
    chrome.storage.local.get(["mochi_settings"], (data) => {
      const s = data.mochi_settings || {};
      s.enabled = toggleFloating.checked;
      chrome.storage.local.set({ mochi_settings: s });
    });
  });

  // Listener Saklar Auto-Feeder
  toggleAutoFeed.addEventListener("change", () => {
    chrome.storage.local.get(["mochi_settings"], (data) => {
      const s = data.mochi_settings || {};
      s.autoFeedEnabled = toggleAutoFeed.checked;
      chrome.storage.local.set({ mochi_settings: s });
    });
  });

  // Tombol Impor Mod
  btnImportMod.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        let raw = evt.target.result.trim();
        if (raw.startsWith("export default")) {
          raw = raw.replace(/^export\s+default\s+/, "");
        }
        if (raw.endsWith(";")) raw = raw.slice(0, -1);

        const modObj = new Function(`"use strict"; return (${raw});`)();
        if (modObj && modObj.name) {
          alert(`🎉 Berhasil memuat mod: ${modObj.name} (${modObj.icon || "🐾"})! Karakter siap digunakan.`);
        }
      } catch (err) {
        alert(`❌ Gagal membaca file mod: ${err.message}`);
      }
    };
    reader.readAsText(file);
  });

  // Tombol Buka Web Console
  btnOpenConsole.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://rizumiya.github.io/projects/mochi-pocket/" });
  });
});
