/**
 * Mochi Pocket — js/custom-mods.js
 * Modding Engine: Dynamic Pet & Scene Loader, SDK Importer & Custom Rig Generator
 */

const STORAGE_KEY_CUSTOM_MODS = "mochi_pocket_custom_mods_v2";

let customMods = {
  pets: [],
  scenes: []
};

// Template sumber untuk tombol unduh SDK langsung dari browser
const SDK_TEMPLATES = {
  pet: `export default {
  id: "custom_kuro",
  name: "Kuro",
  author: "Kreator",
  version: "1.0.0",
  tag: "🐱 KURO",
  icon: "🐱",
  unlockLevel: 1,
  anatomy: {
    headSvg: \`<svg class="svg-full" viewBox="0 0 264 205" fill="none">
      <path d="M 28 92 C 16 52, 24 16, 38 12 C 52 8, 86 32, 102 64 Z" fill="#2d3748" stroke="#1a202c" stroke-width="5" stroke-linejoin="round"/>
      <path d="M 236 92 C 248 52, 240 16, 226 12 C 212 8, 178 32, 162 64 Z" fill="#2d3748" stroke="#1a202c" stroke-width="5" stroke-linejoin="round"/>
      <path d="M 52 48 C 82 22, 182 22, 212 48 C 246 78, 252 142, 218 174 C 182 204, 82 204, 46 174 C 12 142, 18 78, 52 48 Z" fill="#2d3748" stroke="#1a202c" stroke-width="5.5" stroke-linejoin="round"/>
      <circle cx="56" cy="132" r="14" fill="#fc8181" opacity="0.85"/>
      <circle cx="208" cy="132" r="14" fill="#fc8181" opacity="0.85"/>
      <ellipse cx="132" cy="120" rx="4.5" ry="3.5" fill="#feb2b2"/>
      <path d="M 124 126 Q 132 134 132 126 Q 132 134 140 126" stroke="#f7fafc" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>\`,
    bodySvg: \`<svg class="svg-full" viewBox="0 0 200 145" fill="none">
      <path d="M 48 15 C 24 45, 18 92, 30 116 C 40 132, 65 135, 100 135 C 135 135, 160 132, 170 116 C 182 92, 176 45, 152 15 Z" fill="#2d3748" stroke="#1a202c" stroke-width="5" stroke-linejoin="round"/>
      <path d="M 72 25 C 85 45, 115 45, 128 25 C 140 60, 132 105, 100 108 C 68 105, 60 60, 72 25 Z" fill="#f7fafc"/>
      <path d="M 68 85 C 68 115, 75 138, 86 138 C 96 138, 96 115, 94 85" fill="#2d3748" stroke="#1a202c" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M 132 85 C 132 115, 125 138, 114 138 C 104 138, 104 115, 106 85" fill="#2d3748" stroke="#1a202c" stroke-width="4.5" stroke-linecap="round"/>
    </svg>\`,
    tailSvg: \`<svg class="svg-full" viewBox="0 0 120 150" fill="none">
      <path d="M 102 114 C 54 118, 16 90, 26 42 C 30 22, 54 22, 54 40 C 54 50, 44 58, 46 74 C 48 90, 74 96, 102 92 Z" fill="#2d3748" stroke="#1a202c" stroke-width="9" stroke-linejoin="round"/>
    </svg>\`
  },
  dialogues: {
    greetings: ["Meow! Aku Kuro, siap menemanimu! 🐾"],
    idle: ["Sedang coding apa hari ini? Kuro bantu perhatikan ya! 💻"],
    feed: ["Nyam nyam! Ikan lezat sekali! 🐟"],
    sleep: ["Zzz... istirahat dulu ya~ 💤"]
  }
};`,
  scene: `export default {
  id: "custom_neon_city",
  name: "Kota Neon",
  icon: "🏙️",
  unlockLevel: 1,
  backgroundCSS: "linear-gradient(180deg, #090d16 0%, #1e1035 62%, #38124d 62%, #1a0826 100%)",
  ambientColor: "rgba(192, 132, 252, 0.18)",
  decorations: [
    {
      id: "moon",
      emoji: "🌕",
      style: "position: absolute; top: 32px; right: 28px; font-size: 2.2rem; filter: drop-shadow(0 0 12px #c084fc);"
    }
  ],
  dialogues: [
    "Pemandangan malam kota neon indah sekali ya! ✨"
  ]
};`
};

function loadCustomModsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_MODS);
    if (raw) {
      const parsed = JSON.parse(raw);
      customMods.pets = Array.isArray(parsed.pets) ? parsed.pets : [];
      customMods.scenes = Array.isArray(parsed.scenes) ? parsed.scenes : [];
    }
  } catch (err) {
    console.warn("[Mochi Modding] Gagal memuat custom mods dari localStorage:", err);
  }
}

function saveCustomModsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_MODS, JSON.stringify(customMods));
  } catch (err) {
    console.error("[Mochi Modding] Gagal menyimpan custom mods ke localStorage:", err);
  }
}

function registerCustomPet(petMod) {
  if (!petMod || !petMod.id || !petMod.name) return;

  // 1. Daftarkan ke FORM_META & FORM_ORDER
  FORM_META[petMod.id] = {
    tag: petMod.tag || `${petMod.icon || "🐾"} ${petMod.name.toUpperCase()}`,
    name: petMod.name,
    icon: petMod.icon || "🐾",
    desc: `Karakter Kustom kreasi ${petMod.author || "Pengguna"}`,
    unlockLevel: petMod.unlockLevel || 1,
    isCustom: true
  };

  if (!FORM_ORDER.includes(petMod.id)) {
    FORM_ORDER.push(petMod.id);
  }

  // 2. Buat Panggung DOM jika belum ada
  let formEl = document.getElementById(`form-${petMod.id}`);
  if (!formEl && petInteractive) {
    formEl = document.createElement("div");
    formEl.id = `form-${petMod.id}`;
    formEl.className = "pet-form form-animal custom-mod-actor";
    formEl.hidden = true;

    const headContent = petMod.anatomy?.headSvg || `<div class="custom-avatar-head">${petMod.icon || "🐾"}</div>`;
    const bodyContent = petMod.anatomy?.bodySvg || `<div class="custom-avatar-body"></div>`;
    const tailContent = petMod.anatomy?.tailSvg ? `<div class="tail-wrap">${petMod.anatomy.tailSvg}</div>` : "";

    formEl.innerHTML = `
      <div class="animal-stage">
        <div class="lifelike-actor">
          <div class="chara-rig custom-rig">
            <div class="chara-squash">
              ${tailContent}
              <div class="lower-body-group">${bodyContent}</div>
              <div class="head-group parallax-head">${headContent}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    petInteractive.appendChild(formEl);
    formElements[petMod.id] = formEl;
  }
}

function registerCustomScene(sceneMod) {
  if (!sceneMod || !sceneMod.id || !sceneMod.name) return;

  SCENE_META[sceneMod.id] = {
    name: sceneMod.name,
    icon: sceneMod.icon || "🏙️",
    unlockLevel: sceneMod.unlockLevel || 1,
    isCustom: true,
    backgroundCSS: sceneMod.backgroundCSS || "",
    decorations: sceneMod.decorations || [],
    dialogues: sceneMod.dialogues || []
  };

  if (!SCENE_ORDER.includes(sceneMod.id)) {
    SCENE_ORDER.push(sceneMod.id);
  }

  // Injeksi aturan CSS dinamis untuk scene ini
  if (sceneMod.backgroundCSS) {
    let customStyleTag = document.getElementById(`style-scene-${sceneMod.id}`);
    if (!customStyleTag) {
      customStyleTag = document.createElement("style");
      customStyleTag.id = `style-scene-${sceneMod.id}`;
      document.head.appendChild(customStyleTag);
    }
    customStyleTag.textContent = `
      .gb-screen[data-scene="${sceneMod.id}"] {
        background: ${sceneMod.backgroundCSS} !important;
      }
    `;
  }
}

function parseModCode(codeString) {
  let cleaned = codeString.trim();
  // Tangani "export default { ... }"
  if (cleaned.startsWith("export default")) {
    cleaned = cleaned.replace(/^export\s+default\s+/, "");
  }
  // Bersihkan titik koma di akhir
  if (cleaned.endsWith(";")) {
    cleaned = cleaned.slice(0, -1);
  }

  // Coba parse sebagai JSON terlebih dahulu
  try {
    return JSON.parse(cleaned);
  } catch (jsonErr) {
    // Jika format JavaScript Object literal, gunakan Function constructor yang aman
    try {
      const fn = new Function(`"use strict"; return (${cleaned});`);
      return fn();
    } catch (evalErr) {
      throw new Error(`Format kode mod tidak valid: ${evalErr.message}`);
    }
  }
}

function importCustomMod(rawContent, filename = "") {
  try {
    const modObj = parseModCode(rawContent);

    if (!modObj || typeof modObj !== "object") {
      throw new Error("Modul tidak menghasilkan objek konfigurasi yang valid.");
    }
    if (!modObj.id || !modObj.name) {
      throw new Error("Modul wajib memiliki properti 'id' dan 'name'.");
    }

    // Deteksi tipe mod (Scene atau Pet)
    if (modObj.backgroundCSS || modObj.decorations) {
      // Scene Mod
      const existingIdx = customMods.scenes.findIndex((s) => s.id === modObj.id);
      if (existingIdx >= 0) {
        customMods.scenes[existingIdx] = modObj;
      } else {
        customMods.scenes.push(modObj);
      }
      registerCustomScene(modObj);
      saveCustomModsToStorage();

      renderDashboard();
      say(`🎉 Latar kustom <span>${modObj.icon || "🏙️"} ${modObj.name}</span> berhasil dipasang! Pilih lewat menu Scene~ ✨`, 5000);
      spawnBurstParticles(["✨", "🎨", "🌟"]);
      return { success: true, type: "scene", mod: modObj };
    } else {
      // Pet Mod
      const existingIdx = customMods.pets.findIndex((p) => p.id === modObj.id);
      if (existingIdx >= 0) {
        customMods.pets[existingIdx] = modObj;
      } else {
        customMods.pets.push(modObj);
      }
      registerCustomPet(modObj);
      saveCustomModsToStorage();

      // Otomatis aktifkan karakter baru jika diinginkan
      setPetForm(modObj.id);
      renderDashboard();
      say(`🎉 Karakter kustom <span>${modObj.icon || "🐱"} ${modObj.name}</span> berhasil diimpor dan hidup! Selamat datang~ 💖`, 5000);
      spawnBurstParticles(["✨", "🐾", "💖"]);
      return { success: true, type: "pet", mod: modObj };
    }
  } catch (err) {
    console.error("[Mochi Modding] Gagal impor:", err);
    say(`❌ Gagal membaca mod: ${err.message}`, 4000);
    return { success: false, error: err.message };
  }
}

function downloadSdkFile(type = "pet") {
  const content = SDK_TEMPLATES[type] || SDK_TEMPLATES.pet;
  const filename = type === "scene" ? "custom-scene-template.js" : "custom-pet-template.js";
  const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function initCustomMods() {
  loadCustomModsFromStorage();

  // Daftarkan semua pet kustom yang tersimpan
  customMods.pets.forEach((p) => registerCustomPet(p));

  // Daftarkan semua latar kustom yang tersimpan
  customMods.scenes.forEach((s) => registerCustomScene(s));

  console.log(`[Mochi Modding] Mod loader siap: ${customMods.pets.length} pet, ${customMods.scenes.length} scene.`);
}

// Inisialisasi saat script dimuat
initCustomMods();
