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
  if (pet.hunger >= 100) {
    say(`Perut ${petNameTag()} sudah kenyang 100%! Ayo main atau elus aku saja~ 🍙`);
    return;
  }

  switchState("happy", 1200);
  spawnBurstParticles(["🍙", "🌻", "🍣", "✨", "💕"]);
  addExpAndStats({ exp: 14, hunger: 22, happiness: 6, energy: 5 });

  const feedLines = [
    `Nyam nyam~ Terima kasih makanannya! Perut ${petNameTag()} jadi kenyang dan hangat~ 🍙`,
    `Wah enak sekali! ${petNameTag()} makin bersemangat menemanimu! ✨`,
    `Makanan favorit ${petNameTag()}! Makasih banyak ya~ 💖`
  ];
  say(randomPick(feedLines));
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

// Siklus Tamagotchi Otomatis (Tiap 25 detik)
setInterval(() => {
  if (!pet.isInitialized || pet.isDead) return;

  if (pet.isSleeping) {
    pet.energy = clampStat(pet.energy + 5);
    pet.hunger = clampStat(pet.hunger - 1);
    if (pet.energy >= 100) {
      pet.isSleeping = false;
      switchState("idle");
      say(`☀️ Energi ${petNameTag()} sudah penuh (100%)! Aku bangun sekarang ya~`);
    }
  } else {
    pet.hunger = clampStat(pet.hunger - 1);
    pet.energy = clampStat(pet.energy - 1);
    if (pet.hunger < 30) {
      pet.happiness = clampStat(pet.happiness - 1);
    }
  }

  checkPetCondition();
  renderDashboard();
  db.save(pet);
}, 25000);

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
    say(`*Kruyuuuk~* Perut ${petNameTag()} bergetar kelaparan nih (${pet.hunger}%)... Tekan <span>Tombol A</span> untuk memberi makan! 🍙🥺`);
    return;
  } else if (pet.hunger <= 50) {
    say(`*Kruyuk...* Perut ${petNameTag()} mulai lapar (${pet.hunger}%), ada rasa lapar yang bergetar nih~ 🍙`);
    return;
  }

  if (pet.energy <= 20) {
    say(`Hoaaam... Energi ${petNameTag()} tinggal ${pet.energy}%, tidurkan aku lewat <span>D-Pad &#x25BC;&#xFE0E;</span> yuk~ 💤`);
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
