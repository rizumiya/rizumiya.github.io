/**
 * Mochi Pocket — js/dashboard.js
 * Render Pemandangan Latar, Indikator Gauges, Kunci Latar & Bentuk, Serta Level Up
 */

function updateIconGauge(gaugeWrapEl, value, label) {
  if (!gaugeWrapEl) return;
  const safePct = clampStat(value);
  gaugeWrapEl.style.setProperty("--fill-pct", `${safePct}%`);
  gaugeWrapEl.dataset.tooltip = `${label}: ${safePct}%`;
  gaugeWrapEl.classList.toggle("low-stat", safePct <= 25 && !label.startsWith("EXP"));
}

function getHighestUnlockedScene(level = 1) {
  let best = "";
  SCENE_ORDER.forEach((key) => {
    if (level >= SCENE_META[key].unlockLevel) {
      best = key;
    }
  });
  return best;
}

function resolveActiveScene() {
  const pref = pet.scenePreference || "auto";
  if (pref !== "auto" && SCENE_META[pref] && (pet.level || 1) >= SCENE_META[pref].unlockLevel) {
    return pref;
  }
  return getHighestUnlockedScene(pet.level || 1);
}

function renderSceneBackground(sceneKey) {
  const safeScene = (sceneKey && SCENE_META[sceneKey])
    ? sceneKey
    : getHighestUnlockedScene(pet.level || 1);
  activeSceneKey = safeScene;

  if (petStageEl) {
    petStageEl.dataset.scene = safeScene || "none";
  }

  if (petSceneBadge) {
    if (safeScene && SCENE_META[safeScene]) {
      const meta = SCENE_META[safeScene];
      petSceneBadge.textContent = meta.icon;
      petSceneBadge.title = `Latar: ${meta.name} (Terbuka Lv.${meta.unlockLevel})`;
    } else {
      petSceneBadge.textContent = "🎮";
      petSceneBadge.title = "Latar: Netral (Naik ke Lv.2 untuk membuka Kamar!)";
    }
  }

  if (!sceneBgLayer || renderedSceneKey === safeScene) return;
  renderedSceneKey = safeScene;
  sceneBgLayer.innerHTML = "";

  if (safeScene === "default") {
    // 0. Kamar Hangat (Jendela Besar, Lukisan, Jam, Pot Bunga Rapi di Sudut, Karpet, Tanpa Lampu)
    sceneBgLayer.innerHTML = `
      <div class="scene-room-window" title="Jendela Kamar">🪟</div>
      <div class="scene-room-frame" title="Lukisan Foto">🖼️</div>
      <div class="scene-room-clock" title="Jam Dinding">⏰</div>
      <div class="scene-room-plant" title="Tanaman Hias">🪴</div>
      <div class="scene-room-rug" title="Karpet Lembut"></div>
    `;
  } else if (safeScene === "sunny_park") {
    // 1. Taman Cerah (Matahari, 2 Awan Putih Biasa, & Tumbuhan Asimetris Alami dengan Variasi Posisi & Ukuran)
    sceneBgLayer.innerHTML = `
      <div class="scene-sun"></div>
      <div class="scene-cloud" style="top: 42px; left: 12%; --drift-dur: 11s;">☁️</div>
      <div class="scene-cloud" style="top: 66px; left: 56%; --drift-dur: 15s;">☁️</div>
      <div class="scene-park-flora">
        <span class="park-plant" style="left: 4%; bottom: 18%; font-size: 1.7rem; --sway-dur: 3.4s;">🌸</span>
        <span class="park-plant" style="left: 14%; bottom: 29%; font-size: 1.35rem; --sway-dur: 4.2s;">🌱</span>
        <span class="park-plant" style="left: 23%; bottom: 12%; font-size: 2.1rem; --sway-dur: 3.8s;">🌻</span>
        <span class="park-plant" style="left: 31%; bottom: 24%; font-size: 1.25rem; --sway-dur: 4.6s;">🍀</span>
        <span class="park-plant" style="right: 28%; bottom: 25%; font-size: 1.25rem; --sway-dur: 3.9s;">🌱</span>
        <span class="park-plant" style="right: 20%; bottom: 13%; font-size: 1.95rem; --sway-dur: 4.4s;">🌷</span>
        <span class="park-plant" style="right: 12%; bottom: 30%; font-size: 1.4rem; --sway-dur: 3.6s;">🍀</span>
        <span class="park-plant" style="right: 4%; bottom: 19%; font-size: 1.65rem; --sway-dur: 4.1s;">🌼</span>
      </div>
    `;
  } else if (safeScene === "rainy_day") {
    // 2. Hari Hujan (Efek Kilatan Petir Halus, Awan Mendung, Tetesan Hujan, & Genangan Air)
    let dropsHtml = "";
    for (let i = 0; i < 14; i += 1) {
      const leftPct = 6 + i * 6.6;
      const dur = (0.62 + (i % 4) * 0.11).toFixed(2);
      const delay = ((i * 0.17) % 0.9).toFixed(2);
      dropsHtml += `<div class="scene-raindrop" style="left:${leftPct.toFixed(1)}%; --rain-dur:${dur}s; --rain-delay:${delay}s;"></div>`;
    }
    sceneBgLayer.innerHTML = `
      <div class="scene-lightning-flash"></div>
      <div class="scene-lightning-bolt">⚡</div>
      <div class="scene-cloud" style="top: 36px; left: 14%; --drift-dur: 10s; opacity: 0.65;">🌧️</div>
      <div class="scene-cloud" style="top: 40px; right: 16%; --drift-dur: 13s; opacity: 0.65;">⛈️</div>
      ${dropsHtml}
      <div class="scene-puddle"></div>
    `;
  } else if (safeScene === "flower_garden") {
    // 3. Taman Bunga (Rimbun Bertingkat, Kupu-kupu, Kilau, & Kelopak Melayang)
    const petals = ["🌸", "💮", "🌼", "🌸", "🌷", "💮", "🌸", "🌼", "🌸", "💮"];
    let petalsHtml = "";
    petals.forEach((sym, idx) => {
      const leftPct = 5 + idx * 9.5;
      const dur = (4.4 + (idx % 4) * 0.8).toFixed(2);
      const delay = (idx * 0.45).toFixed(2);
      petalsHtml += `<div class="scene-petal" style="left:${leftPct.toFixed(1)}%; --petal-dur:${dur}s; --petal-delay:${delay}s;">${sym}</div>`;
    });
    sceneBgLayer.innerHTML = `
      ${petalsHtml}
      <div class="scene-butterfly" style="top: 56px; right: 22%; font-size: 1.85rem; --bf-dur: 4.2s;">🦋</div>
      <div class="scene-butterfly" style="top: 86px; left: 16%; font-size: 1.35rem; animation-delay: 1.8s; opacity: 0.85;">✨</div>

      <div class="scene-flower-layer back">
        <span class="flower-item" style="left: 3%; bottom: 31%; font-size: 1.5rem; --sway-dur: 3.2s;">🌷</span>
        <span class="flower-item" style="left: 11%; bottom: 33%; font-size: 1.3rem; --sway-dur: 4.1s;">🌸</span>
        <span class="flower-item" style="left: 20%; bottom: 30%; font-size: 1.45rem; --sway-dur: 3.6s;">🌼</span>
        <span class="flower-item" style="left: 28%; bottom: 32%; font-size: 1.25rem; --sway-dur: 4.5s;">🌱</span>
        <span class="flower-item" style="right: 28%; bottom: 32%; font-size: 1.35rem; --sway-dur: 3.8s;">🌿</span>
        <span class="flower-item" style="right: 20%; bottom: 30%; font-size: 1.5rem; --sway-dur: 4.3s;">🌻</span>
        <span class="flower-item" style="right: 11%; bottom: 33%; font-size: 1.4rem; --sway-dur: 3.4s;">🌺</span>
        <span class="flower-item" style="right: 3%; bottom: 31%; font-size: 1.55rem; --sway-dur: 3.9s;">🌷</span>
      </div>

      <div class="scene-flower-layer mid-left">
        <span class="flower-item" style="left: 1%; bottom: 21%; font-size: 1.85rem; --sway-dur: 3.5s;">🌿</span>
        <span class="flower-item" style="left: 6%; bottom: 12%; font-size: 2.3rem; --sway-dur: 4.2s;">🌻</span>
        <span class="flower-item" style="left: 16%; bottom: 20%; font-size: 1.9rem; --sway-dur: 3.1s;">🌷</span>
        <span class="flower-item" style="left: 12%; bottom: 8%; font-size: 2.1rem; --sway-dur: 4.6s;">🌸</span>
        <span class="flower-item" style="left: 22%; bottom: 14%; font-size: 1.65rem; --sway-dur: 3.8s;">🍀</span>
      </div>

      <div class="scene-flower-layer mid-right">
        <span class="flower-item" style="right: 1%; bottom: 20%; font-size: 1.85rem; --sway-dur: 3.7s;">🌿</span>
        <span class="flower-item" style="right: 6%; bottom: 10%; font-size: 2.4rem; --sway-dur: 4.4s;">🌺</span>
        <span class="flower-item" style="right: 16%; bottom: 21%; font-size: 1.95rem; --sway-dur: 3.3s;">🌼</span>
        <span class="flower-item" style="right: 13%; bottom: 7%; font-size: 2.1rem; --sway-dur: 4.8s;">🌷</span>
        <span class="flower-item" style="right: 23%; bottom: 14%; font-size: 1.65rem; --sway-dur: 3.6s;">🌸</span>
      </div>
    `;
  } else if (safeScene === "haunted_house") {
    // 4. Rumah Kuburan (Bulan Ungu, Jaring Laba-laba, Lilin, Hantu, Nisan, & Kabut Menjalar)
    sceneBgLayer.innerHTML = `
      <div class="scene-spooky-moon"></div>
      <div class="scene-cobweb">🕸️</div>
      <div class="scene-wisp" style="top: 84px; left: 14%; --wisp-dur: 2.7s;">👻</div>
      <div class="scene-wisp" style="top: 114px; right: 14%; --wisp-dur: 3.4s;">🕯️</div>
      <div class="scene-wisp" style="top: 62px; right: 28%; --wisp-dur: 3.9s;">🟣</div>
      <div class="scene-horizon-deco" style="opacity: 0.48; bottom: 29%;">
        <span>🪦</span><span>🥀</span><span>🪦</span><span>🦇</span>
      </div>
      <div class="scene-fog"></div>
    `;
  } else if (safeScene === "starry_night") {
    // 5. Bintang Malam (Bulan Sabit, Bintang Gemerlap, & Padang Rumput Tenang)
    let starsHtml = "";
    for (let i = 0; i < 12; i += 1) {
      const leftPct = 8 + ((i * 19) % 84);
      const topPct = 14 + ((i * 13) % 44);
      const dur = (1.5 + (i % 4) * 0.45).toFixed(2);
      starsHtml += `<div class="scene-star" style="left:${leftPct}%; top:${topPct}%; --star-dur:${dur}s;">✦</div>`;
    }
    sceneBgLayer.innerHTML = `
      <div class="scene-cloud" style="top: 38px; right: 20px; font-size: 1.45rem; --drift-dur: 18s;">🌙</div>
      ${starsHtml}
      <div class="scene-horizon-deco" style="opacity: 0.65;">
        <span>✨</span><span>🌾</span><span>🌟</span><span>🌾</span><span>✨</span>
      </div>
    `;
  } else if (safeScene === "snowy_winter") {
    // 6. Musim Salju (Pohon Cemara, Manusia Salju, Kepingan Salju Berjatuhan)
    let flakesHtml = "";
    for (let i = 0; i < 14; i += 1) {
      const leftPct = 6 + i * 6.8;
      const dur = (3.4 + (i % 5) * 0.7).toFixed(2);
      const delay = ((i * 0.35) % 1.8).toFixed(2);
      flakesHtml += `<div class="scene-snowflake" style="left:${leftPct.toFixed(1)}%; --snow-dur:${dur}s; --snow-delay:${delay}s;">❄️</div>`;
    }
    sceneBgLayer.innerHTML = `
      <div class="scene-cloud" style="top: 38px; left: 16%; --drift-dur: 16s; opacity: 0.85;">🌨️</div>
      <div class="scene-pine">🌲</div>
      <div class="scene-snowman">☃️</div>
      ${flakesHtml}
      <div class="scene-horizon-deco" style="bottom: 24%; opacity: 0.75;">
        <span>❄️</span><span>🏔️</span><span>❄️</span>
      </div>
    `;
  } else if (safeScene === "bakery_shop") {
    // 7. Toko Roti (Etalase Roti Hangat, Secangkir Kopi, & Kue Manis)
    sceneBgLayer.innerHTML = `
      <div class="scene-bakery-shelf">
        <span>🥐</span><span>🥖</span><span>🍞</span>
      </div>
      <div class="scene-coffee">☕</div>
      <div class="scene-cake">🍰</div>
      <div class="scene-horizon-deco" style="bottom: 25%; opacity: 0.8;">
        <span>🧁</span><span>🍩</span><span>🍪</span><span>🥞</span>
      </div>
    `;
  } else if (safeScene === "tropical_beach") {
    // 8. Pantai Tropis (Matahari Cerah, Pohon Kelapa, Payung Pantai, & Kepiting)
    sceneBgLayer.innerHTML = `
      <div class="scene-sun" style="background: radial-gradient(circle, #ffe066 30%, #ff922b 100%);"></div>
      <div class="scene-cloud" style="top: 40px; left: 24%; --drift-dur: 15s;">☁️</div>
      <div class="scene-palm">🌴</div>
      <div class="scene-umbrella">🏖️</div>
      <div class="scene-crab">🦀</div>
      <div class="scene-horizon-deco" style="bottom: 22%; opacity: 0.7;">
        <span>🐚</span><span>🌊</span><span>🐚</span>
      </div>
    `;
  } else if (safeScene === "magic_forest") {
    // 9. Hutan Ajaib (Pohon Rindang, Jamur Cahaya, Kupu-kupu, & Kilau Peri)
    sceneBgLayer.innerHTML = `
      <div class="scene-big-tree">🌳</div>
      <div class="scene-mushroom">🍄</div>
      <div class="scene-butterfly" style="top: 72px; right: 28%; font-size: 2.2rem;">🦋</div>
      <div class="scene-butterfly" style="top: 110px; left: 26%; font-size: 1.6rem; animation-delay: 1.2s;">✨</div>
      <div class="scene-horizon-deco" style="bottom: 24%; opacity: 0.85;">
        <span>🌿</span><span>🍀</span><span>🍄</span><span>🌱</span><span>🌿</span>
      </div>
    `;
  }
}

function updateScenePickerLocks() {
  const currentLevel = pet.level || 1;
  if (
    pet.scenePreference &&
    pet.scenePreference !== "auto" &&
    SCENE_META[pet.scenePreference] &&
    currentLevel < SCENE_META[pet.scenePreference].unlockLevel
  ) {
    pet.scenePreference = "auto";
  }

  document.querySelectorAll('input[name="scene-bg"]').forEach((radioEl) => {
    const val = radioEl.value;
    const cardWrap = radioEl.closest(".pick-card") || radioEl.closest(".picker-option");
    if (!cardWrap) return;

    if (val === "auto") {
      radioEl.disabled = false;
      cardWrap.classList.remove("locked-scene");
      return;
    }

    const meta = SCENE_META[val];
    if (!meta) return;
    const isUnlocked = currentLevel >= meta.unlockLevel;
    radioEl.disabled = !isUnlocked;
    if (!isUnlocked && radioEl.checked) {
      radioEl.checked = false;
      const autoRadio = document.querySelector('input[name="scene-bg"][value="auto"]');
      if (autoRadio) autoRadio.checked = true;
    }
    cardWrap.classList.toggle("locked-scene", !isUnlocked);

    const lockEl = cardWrap.querySelector(".pick-card-lock");
    if (lockEl) {
      lockEl.textContent = isUnlocked ? "" : `🔒 Lv.${meta.unlockLevel}`;
    }

    const spanEl = cardWrap.querySelector("span[data-scene-label]");
    if (spanEl) {
      spanEl.textContent = meta.name;
    }
  });
}

function updateFormPickerLocks() {
  const currentLevel = pet.level || 1;
  const currentMeta = FORM_META[pet.activeForm];
  if (currentMeta && currentLevel < (currentMeta.unlockLevel || 1)) {
    pet.activeForm = "orb";
    petInteractive.dataset.activeForm = "orb";
  }

  document.querySelectorAll('input[name="starter-form"]').forEach((radioEl) => {
    const val = radioEl.value;
    const cardWrap = radioEl.closest(".pick-card");
    if (!cardWrap) return;

    const meta = FORM_META[val];
    if (!meta) return;

    const reqLevel = meta.unlockLevel || 1;
    const isUnlocked = currentLevel >= reqLevel;

    radioEl.disabled = !isUnlocked;
    if (!isUnlocked && radioEl.checked) {
      radioEl.checked = false;
      const orbRadio = document.querySelector('input[name="starter-form"][value="orb"]');
      if (orbRadio) orbRadio.checked = true;
    }

    cardWrap.classList.toggle("locked-form", !isUnlocked);

    const lockEl = cardWrap.querySelector(".pick-card-lock");
    if (lockEl) {
      lockEl.textContent = isUnlocked ? "" : `🔒 Lv.${reqLevel}`;
    }

    const spanEl = cardWrap.querySelector("span[data-form-label]");
    if (spanEl) {
      spanEl.textContent = meta.name.split(" ")[0];
    }
  });
}

function renderDashboard() {
  petNameDisplay.textContent = pet.name || "Eri";
  petLevelBadge.textContent = `Lv.${pet.level}`;

  const meta = FORM_META[pet.activeForm] || FORM_META.orb;
  bezelFormName.textContent = `${meta.icon} ${meta.tag}`;

  const nextScene = resolveActiveScene();
  renderSceneBackground(nextScene);
  updateScenePickerLocks();
  updateFormPickerLocks();

  const difficultyMultiplier = Math.pow(1.5, Math.max(0, (pet.level || 1) - 1));
  updateIconGauge(gaugeHunger, pet.hunger, "Kenyang");
  updateIconGauge(gaugeHappy, pet.happiness, "Bahagia");
  updateIconGauge(gaugeEnergy, pet.energy, "Energi");
  updateIconGauge(
    gaugeExp,
    pet.exp,
    `EXP Lv.${pet.level} (Usaha x${difficultyMultiplier.toFixed(1)})`
  );

  if (live2dModelSelect && pet.live2dPreset) {
    live2dModelSelect.value = pet.live2dPreset;
  }
}

function addExpAndStats({ exp = 0, hunger = 0, happiness = 0, energy = 0 }) {
  pet.hunger = clampStat(pet.hunger + hunger);
  pet.happiness = clampStat(pet.happiness + happiness);
  pet.energy = clampStat(pet.energy + energy);

  // Penambahan EXP dipersulit 1.5x (+50% usaha lebih banyak) di setiap kenaikan level!
  const prevLevel = pet.level || 1;
  const difficultyMultiplier = Math.pow(1.5, Math.max(0, prevLevel - 1));
  const scaledExp = exp > 0 ? exp / difficultyMultiplier : exp;
  pet.exp = Math.max(0, Number((pet.exp + scaledExp).toFixed(2)));

  let leveledUp = false;
  let newlyUnlockedScene = null;
  const newlyUnlockedForms = [];

  while (pet.exp >= 100) {
    pet.exp = Number((pet.exp - 100).toFixed(2));
    pet.level += 1;
    leveledUp = true;

    const unlockedScene = SCENE_ORDER.find((k) => SCENE_META[k].unlockLevel === pet.level);
    if (unlockedScene) {
      newlyUnlockedScene = unlockedScene;
    }

    const unlockedForms = FORM_ORDER.filter(
      (k) => FORM_META[k] && FORM_META[k].unlockLevel === pet.level
    );
    if (unlockedForms.length) {
      newlyUnlockedForms.push(...unlockedForms);
    }
  }

  renderDashboard();
  db.save(pet);

  if (leveledUp) {
    const announcements = [];
    if (newlyUnlockedScene) {
      announcements.push(getSceneUnlockDialogue(newlyUnlockedScene));
    }
    if (newlyUnlockedForms.length) {
      newlyUnlockedForms.forEach((fk) => {
        const meta = FORM_META[fk];
        announcements.push(
          `✨ Wujud <span>${meta.icon} ${meta.name}</span> kini terbuka!`
        );
      });
    }

    if (announcements.length) {
      const burstIcons = ["🎉", "⭐", "✨"];
      if (newlyUnlockedScene) burstIcons.push(SCENE_META[newlyUnlockedScene].icon);
      newlyUnlockedForms.forEach((fk) => burstIcons.push(FORM_META[fk].icon));
      spawnBurstParticles(burstIcons);
      say(`🎉 Hore! ${petNameTag()} naik ke <span>Level ${pet.level}</span>!<br>${announcements.join("<br>")}`, 6500);
    } else {
      spawnBurstParticles(["🎉", "⭐", "✨", "💖"]);
      say(
        `🎉 Hore! ${petNameTag()} naik ke <span>Level ${pet.level}</span>! Makasih sudah merawatku~`
      );
    }
  }
}
