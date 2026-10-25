/**
 * Mochi Pocket — js/tamagotchi.js
 * Aksi Pemeliharaan Pet (Makan, Tidur) & Loop Siklus Kehidupan
 */

function feedPet() {
  if (pet.isDead) return;
  if (pet.isSleeping) {
    say(`Zzz... ${petNameTag()} sedang tidur, tekan <span>D-Pad &#x25BC;&#xFE0E;</span> untuk membangunkanku~ 💤`);
    return;
  }
  // Indikator penerimaan makanan adalah kenyang (jika 100% makanan tidak diterima)
  if (pet.hunger >= 100) {
    say(`Perut ${petNameTag()} sudah kenyang 100%! Makanan tidak bisa masuk lagi, ayo main atau elus aku saja~ 🍙`);
    return;
  }

  switchState("happy", 1100);
  spawnBurstParticles(["🍙", "🌻", "🍣", "✨", "💕"]);

  // Urutan kenaikan: Kenyang (+5) > EXP (+2) > Bahagia (+1.5) > Energi (+0.8)
  // - 20x klik makan untuk 0% menjadi 100% kenyang (100 / 5 = 20)
  // - 50x klik makan di level 1 untuk naik ke level 2 (100 / 2 = 50, rentang 40-60x)
  addExpAndStats({
    hunger: 5,
    exp: 2,
    happiness: 1.5,
    energy: 0.8
  });

  const feedLines = [
    `Nyam nyam~ Terima kasih makanannya! Perut ${petNameTag()} makin kenyang dan hangat~ 🍙`,
    `Wah lezat sekali! ${petNameTag()} makin bersemangat menemanimu! ✨`,
    `Makanan favorit ${petNameTag()}! Makasih banyak ya~ 💖`
  ];
  say(randomPick(feedLines), 2400);
}

function toggleSleep() {
  if (pet.isDead) return;
  if (isPlayingMinigame) stopMinigame(false);
  if (isGameSelectorOpen) closeGameSelector();

  pet.isSleeping = !pet.isSleeping;
  renderDashboard();
  db.save(pet);

  if (pet.isSleeping) {
    switchState("sleep");
    spawnBurstParticles(["💤", "🌙", "✨"]);
    say(`Hoaaam~ ${petNameTag()} tidur dulu ya untuk mengisi energi... Selamat istirahat~ 💤`, 0);
  } else {
    switchState("idle");
    spawnBurstParticles(["☀️", "✨", "💕"]);
    say(`Pagi! ${petNameTag()} sudah bangun dan segar bugar kembali! Ayo bermain~ ✨`);
  }
}

// Siklus Tamagotchi Otomatis (Idle Decay System, Tiap 20 detik)
setInterval(() => {
  if (!pet.isInitialized || pet.isDead) return;

  if (pet.isSleeping) {
    // Saat tidur: Kenyang & Bahagia berkurang lebih lambat dibanding saat bangun
    pet.hunger = clampStat(pet.hunger - 0.4);
    pet.happiness = clampStat(pet.happiness - 0.5);
    pet.energy = clampStat(pet.energy + 5);

    if (pet.energy >= 100) {
      pet.isSleeping = false;
      switchState("idle");
      say(`☀️ Energi ${petNameTag()} sudah penuh (100%)! Aku bangun sekarang ya~`);
    }
  } else {
    // Saat bangun & didiamkan tanpa interaksi:
    // Bahagia berkurang sedikit lebih cepat dari Kenyang,
    // Sementara Energi berkurang sedikit lebih lambat dari Kenyang.
    // Urutan laju pengurangan: Bahagia (-1.4) > Kenyang (-1.0) > Energi (-0.7)
    pet.happiness = clampStat(pet.happiness - 1.4);
    pet.hunger = clampStat(pet.hunger - 1.0);
    pet.energy = clampStat(pet.energy - 0.7);
  }

  checkPetCondition();
  renderDashboard();
  db.save(pet);
}, 20000);

// Pesan Idle Otomatis (Tiap 28 detik)
setInterval(() => {
  if (!pet.isInitialized || pet.isDead || isPlayingMinigame || isGameSelectorOpen || document.hidden) return;
  if (pet.isSleeping) {
    spawnBurstParticles(["💤"]);
    return;
  }

  if (pet.isUnhappyTantrum) {
    say(`Hmph! ${petNameTag()} lagi ngambek berat nih! Bahagiaku 0%! Elus aku dong sampai minimal 10%... 😤💢`);
    return;
  }

  if (pet.hunger <= 25) {
    say(`*Kruyuuuk~* Perut ${petNameTag()} bergetar kelaparan nih (${Math.round(pet.hunger)}%)... Tekan <span>Tombol A</span> untuk memberi makan! 🍙🥺`);
    return;
  } else if (pet.hunger <= 50) {
    say(`*Kruyuk...* Perut ${petNameTag()} mulai lapar (${Math.round(pet.hunger)}%), getaran lapar mulai terasa nih~ 🍙`);
    return;
  }

  if (pet.energy <= 20) {
    say(`Hoaaam... Energi ${petNameTag()} tinggal ${Math.round(pet.energy)}%, tidurkan aku lewat <span>D-Pad &#x25BC;&#xFE0E;</span> yuk~ 💤`);
    return;
  }

  const idleLines = getSceneIdleLines(activeSceneKey);
  say(randomPick(idleLines));
}, 28000);

// Event Copy & Visibility Change (Warisan Autentik Hexo Aurora)
document.addEventListener("copy", () => {
  say(`Apa yang telah kamu salin? Ingat untuk menambahkan sumbernya ya, kata ${petNameTag()}!`);
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !pet.isSleeping) {
    say(`Selamat datang kembali, temanku! ${petNameTag()} merindukanmu~`);
  }
});
