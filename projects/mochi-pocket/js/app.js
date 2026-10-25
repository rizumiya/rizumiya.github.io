/**
 * Mochi Pocket — js/app.js
 * Titik Masuk Utama (Entry Point) & Siklus Hidup Aplikasi Mochi Pocket
 */

async function initApp() {
  pet = await db.load();

  if (!FORM_ORDER.includes(pet.activeForm)) {
    pet.activeForm = "orb";
  }
  pet.theme = applyConsoleTheme(pet.theme || "obsidian");

  const elapsedMinutes = Math.floor((Date.now() - (pet.lastUpdatedAt || Date.now())) / 60000);
  if (pet.isInitialized && elapsedMinutes > 0) {
    const steps = Math.min(20, elapsedMinutes);
    if (pet.isSleeping) {
      pet.energy = clampStat(pet.energy + steps * 4);
    } else {
      pet.hunger = clampStat(pet.hunger - Math.floor(steps * 0.5));
      pet.energy = clampStat(pet.energy - Math.floor(steps * 0.5));
    }
  }

  renderDashboard();
  setForm(pet.activeForm, false);

  if (pet.isSleeping) {
    switchState("sleep");
    say(`Zzz... ${petNameTag()} masih tertidur pulas~ 💤`, 0);
  } else {
    switchState("idle");
    const initLines = getSceneIdleLines(activeSceneKey);
    say(initLines[0], 0);
  }

  if (!pet.isInitialized) {
    openCharacterModal();
  }

  animateCursorTracking();
}

// Inisialisasi Mochi Pocket saat dokumen siap
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initApp();
  });
} else {
  initApp();
}
