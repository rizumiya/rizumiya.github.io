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
      <div class="scene-room-clock" title="Jam Dinding">🕧</div>
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
    // 4. Kuburan Angker (Bulan Ungu, Kelelawar Terbang di Langit, Banyak Nisan Tertata, Lilin, Hantu, Jaring Laba-laba Setengah di Pojok Bawah, & Kabut Menjalar)
    sceneBgLayer.innerHTML = `
      <div class="scene-spooky-moon"></div>
      <div class="scene-bat bat-left">🦇</div>
      <div class="scene-bat bat-right">🦇</div>
      <div class="scene-ghost-float">👻</div>

      <!-- Kompleks Makam Kiri (Nisan Bertingkat Depan & Belakang) -->
      <div class="graveyard-cluster left">
        <span class="graveyard-tombstone back" title="Nisan Tua">🪦</span>
        <span class="graveyard-tombstone front" title="Nisan Kuno">🪦</span>
        <span class="graveyard-grass">🌾</span>
      </div>

      <!-- Kompleks Makam Kanan (Nisan Bertingkat Depan & Belakang + Lilin Makam) -->
      <div class="graveyard-cluster right">
        <span class="graveyard-tombstone back" title="Nisan Tua">🪦</span>
        <span class="graveyard-tombstone front" title="Nisan Kuno">🪦</span>
        <span class="graveyard-candle">🕯️</span>
      </div>

      <!-- Jaring Laba-laba Setengah di Pojok Bawah -->
      <div class="scene-cobweb-corner bottom-right">🕸️</div>
      <div class="scene-cobweb-corner bottom-left">🕸️</div>

      <!-- Kabut Menjalar di Tanah Kuburan -->
      <div class="scene-fog"></div>
    `;
  } else if (safeScene === "starry_night") {
    // 5. Malam Berbintang (Bulan Sabit Emas, Bintang Gemerlap di Langit, & Awan Malam Melayang)
    let starsHtml = "";
    for (let i = 0; i < 18; i += 1) {
      const leftPct = 6 + ((i * 17) % 86);
      const topPct = 8 + ((i * 13) % 48);
      const dur = (1.5 + (i % 4) * 0.45).toFixed(2);
      const delay = ((i * 0.28) % 1.6).toFixed(2);
      const symbol = i % 3 === 0 ? "✨" : (i % 3 === 1 ? "⭐" : "✦");
      starsHtml += `<div class="scene-star" style="left:${leftPct}%; top:${topPct}%; --star-dur:${dur}s; animation-delay:${delay}s;">${symbol}</div>`;
    }
    sceneBgLayer.innerHTML = `
      <!-- Langit Malam: Bulan Sabit Emas & Awan Malam Melayang (Murni Langit Bintang, Tanpa Tanaman/Padi) -->
      <div class="scene-crescent-moon">🌙</div>
      <div class="scene-cloud" style="top: 38px; right: 20px; font-size: 1.45rem; --drift-dur: 20s; opacity: 0.75;">☁️</div>
      <!-- Bintang Jatuh (Shooting Star) Sesekali Meluncur di Langit -->
      <div class="scene-shooting-star"></div>
      ${starsHtml}
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
    `;
  } else if (safeScene === "bakery_shop") {
    // 7. Toko Roti (Etalase Kaca Roti Hangat & Awning Kanopi Manis)
    sceneBgLayer.innerHTML = `
      <!-- Kanopi Tenda Toko Roti di Atas -->
      <div class="bakery-awning">
        <div class="bakery-sign">🥖 MOCHI BAKERY 🥐</div>
      </div>

      <!-- Lemari Kaca Etalase Toko Roti (Bakery Glass Showcase) -->
      <div class="bakery-showcase">
        <div class="showcase-glass-sheen"></div>

        <!-- Rak Atas Etalase: Roti Hangat & Croissant -->
        <div class="showcase-shelf shelf-top">
          <div class="shelf-items">
            <span class="pastry-item" title="Croissant">🥐</span>
            <span class="pastry-item" title="Baguette">🥖</span>
            <span class="pastry-item" title="Roti Tawar">🍞</span>
          </div>
          <div class="shelf-plank"></div>
        </div>

        <!-- Rak Tengah Etalase: Donat & Cupcake Manis -->
        <div class="showcase-shelf shelf-mid">
          <div class="shelf-items">
            <span class="pastry-item" title="Cupcake">🧁</span>
            <span class="pastry-item" title="Donut">🍩</span>
            <span class="pastry-item" title="Cookie">🍪</span>
          </div>
          <div class="shelf-plank"></div>
        </div>
      </div>

      <!-- Meja Konter Samping Pet: Kopi & Cake Slice -->
      <div class="bakery-counter-decor">
        <div class="counter-item left" title="Secangkir Kopi Hangat">☕</div>
        <div class="counter-item right" title="Sepotong Kue Stroberi">🍰</div>
      </div>
    `;
  } else if (safeScene === "tropical_beach") {
    // 8. Pantai Tropis (Matahari Cerah, Pohon Kelapa Menjulang Besar, Payung Pantai Lebar, & Kepiting)
    sceneBgLayer.innerHTML = `
      <div class="scene-sun" style="background: radial-gradient(circle, #ffe066 30%, #ff922b 100%);"></div>
      <div class="scene-cloud" style="top: 36px; left: 24%; --drift-dur: 15s;">☁️</div>
      <div class="scene-palm">🌴</div>
      <div class="scene-umbrella">🏖️</div>
      <div class="scene-crab">🦀</div>
      <div class="beach-shell left">🐚</div>
      <div class="beach-shell right">⭐</div>
    `;
  } else if (safeScene === "magic_forest") {
    // 9. Hutan Rimba Ajaib (Pepohonan Rimbun Berlapis di Latar Belakang, Pohon Besar, Jamur Cahaya, & Kupu-kupu)
    sceneBgLayer.innerHTML = `
      <!-- Kanopi Barisan Pepohonan Hutan di Latar Belakang -->
      <div class="forest-canopy-back">
        <span class="canopy-tree" style="left: 2%; font-size: 3.4rem;">🌲</span>
        <span class="canopy-tree" style="left: 20%; font-size: 3.8rem;">🌳</span>
        <span class="canopy-tree" style="left: 42%; font-size: 3.2rem;">🌲</span>
        <span class="canopy-tree" style="left: 64%; font-size: 3.9rem;">🌳</span>
        <span class="canopy-tree" style="left: 82%; font-size: 3.5rem;">🌲</span>
      </div>

      <!-- Pepohonan Rindang Utama di Kiri & Kanan (Besar & Megah) -->
      <div class="scene-big-tree left" title="Pohon Rindang">🌳</div>
      <div class="scene-big-tree right" title="Pohon Cemara Kuno">🌲</div>

      <!-- Jamur Hutan Menyala di Kanan & Semanggi Hutan di Kiri -->
      <div class="scene-mushroom">🍄</div>
      <div class="forest-floor-flora">
        <span class="flora-sprout left">🌿</span>
        <span class="flora-sprout right">🍀</span>
      </div>

      <!-- Kupu-kupu & Kilau Peri Ajaib -->
      <div class="scene-butterfly" style="top: 68px; right: 26%; font-size: 2.1rem;">🦋</div>
      <div class="scene-butterfly" style="top: 96px; left: 28%; font-size: 1.6rem; animation-delay: 1.2s;">✨</div>
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
