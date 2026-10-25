/**
 * Mochi Pocket — js/controls.js
 * Kontrol Tombol GameBoy, Navigasi Modal, Dukungan Keyboard, & Fitur Dev Mode Lokal
 */

const btnPrevForm = document.getElementById("btn-prev-form");
const btnNextForm = document.getElementById("btn-next-form");

function handleDpadLeft() {
  if (isPlayingMinigame && activeMinigameType !== "coin") {
    setPlayerX(playerX - 8);
    return;
  }
  if (isGameSelectorOpen) {
    highlightGameCard(selectedGameIndex - 1, true);
    return;
  }
  stepForm(-1);
}

function handleDpadRight() {
  if (isPlayingMinigame && activeMinigameType !== "coin") {
    setPlayerX(playerX + 8);
    return;
  }
  if (isGameSelectorOpen) {
    highlightGameCard(selectedGameIndex + 1, true);
    return;
  }
  stepForm(1);
}

if (btnPrevForm) {
  btnPrevForm.addEventListener("click", handleDpadLeft);
  btnPrevForm.addEventListener("pointerdown", () => {
    if (isPlayingMinigame && activeMinigameType !== "coin") moveLeftHeld = true;
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((evt) => {
    btnPrevForm.addEventListener(evt, () => {
      moveLeftHeld = false;
    });
  });
}

if (btnNextForm) {
  btnNextForm.addEventListener("click", handleDpadRight);
  btnNextForm.addEventListener("pointerdown", () => {
    if (isPlayingMinigame && activeMinigameType !== "coin") moveRightHeld = true;
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((evt) => {
    btnNextForm.addEventListener(evt, () => {
      moveRightHeld = false;
    });
  });
}

const btnTalk = document.getElementById("btn-talk");
if (btnTalk) btnTalk.addEventListener("click", talkToPet);

const btnSleep = document.getElementById("btn-sleep");
if (btnSleep) btnSleep.addEventListener("click", toggleSleep);

const btnFeed = document.getElementById("btn-feed");
if (btnFeed) {
  btnFeed.addEventListener("click", () => {
    if (isGameSelectorOpen) {
      const chosenMode = GAME_MODES[selectedGameIndex] || "coin";
      startMinigame(chosenMode);
      return;
    }
    feedPet();
  });
}

const btnPlay = document.getElementById("btn-play");
if (btnPlay) btnPlay.addEventListener("click", toggleGameSelector);

const btnStopMinigame = document.getElementById("btn-stop-minigame");
if (btnStopMinigame) {
  btnStopMinigame.addEventListener("click", () => stopMinigame(false));
}

// Modal Panduan (SELECT)
const btnOpenGuide = document.getElementById("btn-open-guide");
if (btnOpenGuide) {
  btnOpenGuide.addEventListener("click", () => {
    if (guideModal) guideModal.hidden = false;
  });
}
const btnCloseGuide = document.getElementById("btn-close-guide");
if (btnCloseGuide) {
  btnCloseGuide.addEventListener("click", () => {
    if (guideModal) guideModal.hidden = true;
  });
}

// Modal Karakter (Nama, Bentuk Wujud, & Latar Dunia Karakter)
function openCharacterModal() {
  if (petNameInput) petNameInput.value = pet.name || "Eri";
  const avatarEl = document.getElementById("char-name-avatar");
  if (avatarEl && FORM_META[pet.activeForm]) {
    avatarEl.textContent = FORM_META[pet.activeForm].icon;
  }
  updateFormPickerLocks();
  const radio = document.querySelector(`input[name="starter-form"][value="${pet.activeForm}"]`);
  if (radio && !radio.disabled) {
    radio.checked = true;
  } else {
    const orbRadio = document.querySelector('input[name="starter-form"][value="orb"]');
    if (orbRadio) orbRadio.checked = true;
  }
  updateScenePickerLocks();
  const scenePref = pet.scenePreference || "auto";
  const sceneRadio = document.querySelector(`input[name="scene-bg"][value="${scenePref}"]`);
  if (sceneRadio && !sceneRadio.disabled) {
    sceneRadio.checked = true;
  } else {
    const autoRadio = document.querySelector('input[name="scene-bg"][value="auto"]');
    if (autoRadio) autoRadio.checked = true;
  }
  if (characterModal) {
    characterModal.hidden = false;
  }
}

// Navigasi Tab Folder Modal Karakter (Bentuk vs Latar)
document.querySelectorAll(".char-tab").forEach((tabBtn) => {
  tabBtn.addEventListener("click", () => {
    const tabKey = tabBtn.dataset.tab;
    document.querySelectorAll(".char-tab").forEach((btn) => {
      const isActive = btn === tabBtn;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    document.querySelectorAll(".char-panel").forEach((panel) => {
      const isActive = panel.dataset.panel === tabKey;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  });
});

// Modal Pengaturan Global (Tema Konsol, Preset Live2D, & Database IndexedDB)
function openSettingsModal() {
  const themeRadio = document.querySelector(
    `input[name="console-theme"][value="${pet.theme || "obsidian"}"]`
  );
  if (themeRadio) themeRadio.checked = true;
  if (live2dModelSelect) live2dModelSelect.value = pet.live2dPreset || "koharu";
  if (live2dCustomUrl) live2dCustomUrl.value = pet.customLive2dUrl || "";
  if (settingsModal) settingsModal.hidden = false;
}

// Pratinjau langsung tema konsol saat diklik di modal pengaturan global
document.querySelectorAll('input[name="console-theme"]').forEach((radioEl) => {
  radioEl.addEventListener("change", (e) => {
    const chosenTheme = applyConsoleTheme(e.target.value);
    pet.theme = chosenTheme;
    db.save(pet);
  });
});

// Pratinjau langsung Bentuk/Wujud Karakter saat diklik di modal karakter
document.querySelectorAll('input[name="starter-form"]').forEach((radioEl) => {
  const cardWrap = radioEl.closest(".pick-card");
  if (cardWrap) {
    cardWrap.addEventListener("click", (e) => {
      const val = radioEl.value;
      const meta = FORM_META[val];
      const reqLevel = meta ? meta.unlockLevel || 1 : 1;
      if ((pet.level || 1) < reqLevel) {
        e.preventDefault();
        e.stopPropagation();
        say(
          `🔒 Wujud <span>${meta.name}</span> masih terkunci! Rawat ${petNameTag()} sampai <span>Level ${reqLevel}</span> untuk membukanya~`
        );
      }
    });
  }

  radioEl.addEventListener("change", (e) => {
    const chosenVal = e.target.value;
    const meta = FORM_META[chosenVal];
    const reqLevel = meta ? meta.unlockLevel || 1 : 1;
    if ((pet.level || 1) < reqLevel) {
      e.target.checked = false;
      const activeRadio = document.querySelector(`input[name="starter-form"][value="${pet.activeForm}"]`);
      if (activeRadio) activeRadio.checked = true;
      return;
    }
    setForm(chosenVal, false);
    const avatarEl = document.getElementById("char-name-avatar");
    if (avatarEl && FORM_META[chosenVal]) {
      avatarEl.textContent = FORM_META[chosenVal].icon;
    }
  });
});

// Pratinjau langsung Latar Karakter saat diklik di modal karakter (Hanya yang sudah terbuka!)
document.querySelectorAll('input[name="scene-bg"]').forEach((radioEl) => {
  const cardWrap = radioEl.closest(".pick-card") || radioEl.closest(".picker-option");
  if (cardWrap) {
    cardWrap.addEventListener("click", (e) => {
      const val = radioEl.value;
      const meta = SCENE_META[val];
      if (meta && (pet.level || 1) < meta.unlockLevel) {
        e.preventDefault();
        e.stopPropagation();
        say(
          `🔒 Latar <span>${meta.name}</span> masih terkunci! Rawat ${petNameTag()} sampai <span>Level ${meta.unlockLevel}</span> untuk membukanya~`
        );
      }
    });
  }

  radioEl.addEventListener("change", (e) => {
    const val = e.target.value || "auto";
    const meta = SCENE_META[val];
    if (meta && (pet.level || 1) < meta.unlockLevel) {
      e.target.checked = false;
      const autoRadio = document.querySelector('input[name="scene-bg"][value="auto"]');
      if (autoRadio) autoRadio.checked = true;
      return;
    }
    pet.scenePreference = val;
    renderDashboard();
    db.save(pet);
    const activeScene = resolveActiveScene();
    const lines = getSceneIdleLines(activeScene);
    say(randomPick(lines), 5200);
  });
});

const btnOpenChar = document.getElementById("btn-open-character");
if (btnOpenChar) btnOpenChar.addEventListener("click", openCharacterModal);

const btnQuickRename = document.getElementById("btn-quick-rename");
if (btnQuickRename) btnQuickRename.addEventListener("click", openCharacterModal);

if (bezelFormName) {
  bezelFormName.addEventListener("click", openCharacterModal);
}
const btnCloseChar = document.getElementById("btn-close-character");
if (btnCloseChar) {
  btnCloseChar.addEventListener("click", () => {
    if (characterModal) characterModal.hidden = true;
  });
}

const btnOpenSettings = document.getElementById("btn-open-settings");
if (btnOpenSettings) btnOpenSettings.addEventListener("click", openSettingsModal);

const btnCloseSettings = document.getElementById("btn-close-settings");
if (btnCloseSettings) {
  btnCloseSettings.addEventListener("click", () => {
    if (settingsModal) settingsModal.hidden = true;
  });
}

if (characterForm) {
  characterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let newName = (petNameInput ? petNameInput.value.trim() : "") || "Eri";
    if (pet.generation && pet.generation > 1) {
      const genTag = `#${pet.generation}`;
      newName = newName.replace(/#\d+$/, "").trim();
      if (!newName) newName = "Eri";
      newName = `${newName} ${genTag}`;
    }
    const selectedRadio = document.querySelector('input[name="starter-form"]:checked');
    const chosenForm = selectedRadio ? selectedRadio.value : pet.activeForm;
    const selectedSceneRadio = document.querySelector('input[name="scene-bg"]:checked');
    let chosenScenePref = selectedSceneRadio
      ? selectedSceneRadio.value
      : pet.scenePreference || "auto";

    if (
      chosenScenePref !== "auto" &&
      SCENE_META[chosenScenePref] &&
      (pet.level || 1) < SCENE_META[chosenScenePref].unlockLevel
    ) {
      chosenScenePref = "auto";
    }

    pet.name = newName;
    pet.scenePreference = chosenScenePref;
    pet.isInitialized = true;
    if (characterModal) characterModal.hidden = true;

    setForm(chosenForm, false);
    renderDashboard();
    await db.save(pet);
    spawnBurstParticles(["🎉", "💖", "✨"]);
    const activeScene = resolveActiveScene();
    say(randomPick(getSceneIdleLines(activeScene)), 5200);
  });
}

if (settingsForm) {
  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const selectedThemeRadio = document.querySelector('input[name="console-theme"]:checked');
    const chosenTheme = selectedThemeRadio ? selectedThemeRadio.value : pet.theme || "obsidian";

    pet.theme = applyConsoleTheme(chosenTheme);
    pet.live2dPreset = (live2dModelSelect ? live2dModelSelect.value : "") || "koharu";
    pet.customLive2dUrl = live2dCustomUrl ? live2dCustomUrl.value.trim() : "";
    pet.isInitialized = true;
    if (settingsModal) settingsModal.hidden = true;

    loadedLive2dUrl = ""; // Paksa muat ulang jika preset Live2D berubah
    if (pet.activeForm === "live2d") {
      setForm("live2d", false);
    }
    renderDashboard();
    await db.save(pet);
    spawnBurstParticles(["✨", "💖"]);
    say(`⚙️ Pengaturan global &amp; Live2D untuk ${petNameTag()} berhasil disimpan!`);
  });
}

const btnLoadCustomLive2d = document.getElementById("btn-load-custom-live2d");
if (btnLoadCustomLive2d) {
  btnLoadCustomLive2d.addEventListener("click", () => {
    const customUrl = live2dCustomUrl ? live2dCustomUrl.value.trim() : "";
    if (!customUrl) return;
    pet.customLive2dUrl = customUrl;
    const live2dRadio = document.querySelector('input[name="starter-form"][value="live2d"]');
    if (live2dRadio) live2dRadio.checked = true;
    if (settingsModal) settingsModal.hidden = true;
    loadedLive2dUrl = "";
    setForm("live2d", false);
    say(`✨ Memuat model Live2D kustom untuk ${petNameTag()}...`);
  });
}

// Ekspor, Impor, & Reset IndexedDB
const btnExportSave = document.getElementById("btn-export-save");
if (btnExportSave) {
  btnExportSave.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(pet, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(pet.name || "eri").toLowerCase().replace(/\s+/g, "-")}-pocket-save.json`;
    a.click();
    URL.revokeObjectURL(url);
    say(`📥 Data ${petNameTag()} berhasil diekspor ke berkas JSON!`);
  });
}

const inputImportSave = document.getElementById("input-import-save");
if (inputImportSave) {
  inputImportSave.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      pet = { ...DEFAULT_PET_STATE, ...imported, id: "main", isInitialized: true };
      pet.theme = applyConsoleTheme(pet.theme || "obsidian");
      await db.save(pet);
      if (settingsModal) settingsModal.hidden = true;
      loadedLive2dUrl = "";
      setForm(pet.activeForm, false);
      if (pet.isSleeping) switchState("sleep");
      say(`📤 Data ${petNameTag()} (Lv.${pet.level}) berhasil dipulihkan!`);
    } catch {
      say(`⚠️ Berkas JSON tidak valid.`);
    }
  });
}

const btnResetSave = document.getElementById("btn-reset-save");
if (btnResetSave) {
  btnResetSave.addEventListener("click", async () => {
    await db.clear();
    pet = { ...DEFAULT_PET_STATE };
    pet.theme = applyConsoleTheme(pet.theme);
    if (settingsModal) settingsModal.hidden = true;
    setForm("orb", false);
    switchState("idle");
    renderDashboard();
    openCharacterModal();
  });
}

// ==========================================================================
// STUDIO MOD: UNDUH TEMPLATE SDK & UNGGAH MOD KUSTOM (.JS / .JSON)
// ==========================================================================

const btnDownloadPetTemplate = document.getElementById("btn-download-pet-template");
if (btnDownloadPetTemplate) {
  btnDownloadPetTemplate.addEventListener("click", () => {
    if (typeof downloadSdkFile === "function") downloadSdkFile("pet");
  });
}

const btnDownloadSceneTemplate = document.getElementById("btn-download-scene-template");
if (btnDownloadSceneTemplate) {
  btnDownloadSceneTemplate.addEventListener("click", () => {
    if (typeof downloadSdkFile === "function") downloadSdkFile("scene");
  });
}

const btnDownloadDragonSample = document.getElementById("btn-download-dragon-sample");
if (btnDownloadDragonSample) {
  btnDownloadDragonSample.addEventListener("click", () => {
    if (typeof downloadSdkFile === "function") downloadSdkFile("dragon");
  });
}

const btnDownloadVolcanoSample = document.getElementById("btn-download-volcano-sample");
if (btnDownloadVolcanoSample) {
  btnDownloadVolcanoSample.addEventListener("click", () => {
    if (typeof downloadSdkFile === "function") downloadSdkFile("volcano");
  });
}

// ==========================================================================
// MODAL EKSTENSI BROWSER (Bawa Aku Bersamamu di Mana Saja)
// ==========================================================================

const extensionModal = document.getElementById("extension-modal");
const btnOpenExtBottom = document.getElementById("btn-open-ext-bottom");
const btnCloseExtModal = document.getElementById("btn-close-ext-modal");
const btnCloseExtModalX = document.getElementById("btn-close-ext-modal-x");

function openExtensionModal() {
  if (extensionModal) extensionModal.hidden = false;
}

function closeExtensionModal() {
  if (extensionModal) extensionModal.hidden = true;
}

if (btnOpenExtBottom) btnOpenExtBottom.addEventListener("click", openExtensionModal);
if (btnCloseExtModal) btnCloseExtModal.addEventListener("click", closeExtensionModal);
if (btnCloseExtModalX) btnCloseExtModalX.addEventListener("click", closeExtensionModal);

if (extensionModal) {
  extensionModal.addEventListener("click", (e) => {
    if (e.target === extensionModal) closeExtensionModal();
  });
}

const inputUploadMod = document.getElementById("input-upload-mod");
if (inputUploadMod) {
  inputUploadMod.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      if (typeof importCustomMod === "function") {
        importCustomMod(text, file.name);
      }
      if (settingsModal) settingsModal.hidden = true;
    } catch (err) {
      say(`❌ Gagal membaca berkas mod: ${err.message}`);
    }
  });
}

// ==========================================================================
// DEV MODE LOKAL: BUKA SEMUA LEVEL UNTUK TESTING
// Aktif HANYA di lingkungan lokal (localhost / 127.0.0.1 / file://)
// Di GitHub Pages / produksi otomatis dinonaktifkan
// ==========================================================================

function unlockAllLevelsDev() {
  if (!IS_DEV_MODE) return;
  pet.level = 20;
  pet.exp = 0;
  pet.expNeeded = 600;
  db.save(pet);
  updateFormPickerLocks();
  updateScenePickerLocks();
  renderDashboard();
  spawnBurstParticles(["⚡", "👑", "🌟"]);
  say(`🛠️ <strong>[Dev Mode Lokal]</strong> Semua wujud & latar (Lv. 20) berhasil dibuka untuk pengetesan!`);
}

function resetLevelDev() {
  if (!IS_DEV_MODE) return;
  pet.level = 1;
  pet.exp = 0;
  pet.expNeeded = 100;
  db.save(pet);
  updateFormPickerLocks();
  updateScenePickerLocks();
  renderDashboard();
  say(`🛠️ <strong>[Dev Mode Lokal]</strong> Level dikembalikan ke Lv. 1 untuk pengujian progres gameplay normal.`);
}

function setupDevModeControls() {
  if (!IS_DEV_MODE) return;

  // Klik badge level di HUD konsol saat di lokal memicu toggle unlock level dev
  if (petLevelBadge) {
    petLevelBadge.style.cursor = "pointer";
    petLevelBadge.title = "⚡ Dev Mode: Klik untuk buka semua level!";
    petLevelBadge.addEventListener("click", (e) => {
      e.stopPropagation();
      if (pet.level >= 20) {
        resetLevelDev();
      } else {
        unlockAllLevelsDev();
      }
    });
  }

  // Tampilkan dev toolbar di dalam Character Modal
  const charHeader = document.querySelector("#character-modal .modal-header");
  if (charHeader && !document.getElementById("dev-mode-bar")) {
    const devBar = document.createElement("div");
    devBar.id = "dev-mode-bar";
    devBar.className = "dev-mode-bar";
    devBar.innerHTML = `
      <div class="dev-mode-badge">⚡ DEV MODE (Lokal)</div>
      <div class="dev-mode-actions">
        <button type="button" class="btn-dev-action" id="btn-dev-unlock-all" title="Buka Level 20 dan semua wujud/latar">
          🔓 Buka Semua Level (Lv.20)
        </button>
        <button type="button" class="btn-dev-action dev-reset" id="btn-dev-reset-lv" title="Kembalikan ke Lv.1">
          🔄 Reset Lv.1
        </button>
      </div>
    `;
    charHeader.insertAdjacentElement("afterend", devBar);

    const btnUnlock = document.getElementById("btn-dev-unlock-all");
    if (btnUnlock) btnUnlock.addEventListener("click", unlockAllLevelsDev);

    const btnReset = document.getElementById("btn-dev-reset-lv");
    if (btnReset) btnReset.addEventListener("click", resetLevelDev);
  }
}

// Panggil setupDevModeControls saat script dimuat
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupDevModeControls);
} else {
  setupDevModeControls();
}

// Dukungan Keyboard Layaknya Konsol GameBoy Asli
window.addEventListener("keydown", (e) => {
  if (
    (guideModal && !guideModal.hidden) ||
    (settingsModal && !settingsModal.hidden) ||
    (characterModal && !characterModal.hidden) ||
    (extensionModal && !extensionModal.hidden)
  ) {
    if (e.key === "Escape") {
      if (guideModal) guideModal.hidden = true;
      if (settingsModal) settingsModal.hidden = true;
      if (characterModal) characterModal.hidden = true;
      if (extensionModal) extensionModal.hidden = true;
    }
    return;
  }
  if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

  if (e.key === "Escape") {
    if (isPlayingMinigame) stopMinigame(false);
    else if (isGameSelectorOpen) closeGameSelector();
    return;
  }

  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    e.preventDefault();
    if (isPlayingMinigame && activeMinigameType !== "coin") {
      moveLeftHeld = true;
      return;
    }
    handleDpadLeft();
  } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    e.preventDefault();
    if (isPlayingMinigame && activeMinigameType !== "coin") {
      moveRightHeld = true;
      return;
    }
    handleDpadRight();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    talkToPet();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    toggleSleep();
  } else if (e.key === "z" || e.key === "Z" || e.key === "Enter") {
    e.preventDefault();
    if (isGameSelectorOpen) {
      const chosenMode = GAME_MODES[selectedGameIndex] || "coin";
      startMinigame(chosenMode);
      return;
    }
    feedPet();
  } else if (e.key === "x" || e.key === "X") {
    e.preventDefault();
    toggleGameSelector();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    moveLeftHeld = false;
  } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    moveRightHeld = false;
  }
});
