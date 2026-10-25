/**
 * Mochi Pocket — js/dialogue.js
 * Balon Percakapan, Efek Pantulan Bicara, & Dialog Sesuai Pemandangan Latar
 */

function petSpeech() {
  if (pet.activeForm === "orb") {
    auroraDiaEl.classList.remove("talking");
    void auroraDiaEl.offsetWidth;
    auroraDiaEl.classList.add("talking");
    clearTimeout(petStopTimeout);
    petStopTimeout = setTimeout(() => {
      auroraDiaEl.classList.remove("talking");
    }, 450);
  } else if (pet.activeForm === "live2d") {
    live2dStageBox.classList.remove("talking-bounce");
    void live2dStageBox.offsetWidth;
    live2dStageBox.classList.add("talking-bounce");
    clearTimeout(petStopTimeout);
    petStopTimeout = setTimeout(() => {
      live2dStageBox.classList.remove("talking-bounce");
    }, 450);
  } else {
    const activeFormEl = formElements[pet.activeForm];
    const actor = activeFormEl && activeFormEl.querySelector(".lifelike-actor");
    if (actor) {
      actor.classList.remove("talking-bounce");
      void actor.offsetWidth;
      actor.classList.add("talking-bounce");
      clearTimeout(petStopTimeout);
      petStopTimeout = setTimeout(() => {
        actor.classList.remove("talking-bounce");
      }, 450);
    }
  }
}

function say(text, customDuration = null) {
  if (!tipsWrapperEl || !tipsTextEl) return;
  tipsTextEl.innerHTML = text;
  tipsWrapperEl.classList.add("active");
  petSpeech();

  if (messageTimeout) clearTimeout(messageTimeout);

  if (customDuration === 0) return;

  const duration =
    typeof customDuration === "number"
      ? customDuration
      : Math.min(8500, Math.max(3600, text.replace(/<[^>]*>/g, "").length * 90));

  messageTimeout = setTimeout(() => {
    tipsWrapperEl.classList.remove("active");
  }, duration);
}

function getSceneUnlockDialogue(sceneKey) {
  const meta = SCENE_META[sceneKey];
  if (!meta) return "";
  return `✨ Latar <span>${meta.icon} ${meta.name}</span> kini terbuka di Menu Karakter!`;
}

function getSceneHoverLines(sceneKey) {
  const n = petNameTag();
  if (sceneKey === "haunted_house") {
    return [
      `Hiii!! K-kamu bikin ${n} jantungan! Kirain hantu tadi!! 😱👻`,
      `Waaaa!! Jangan ngagetin di Kuburan dong, bulu kuduk ${n} merinding semua! 😭`,
      `Kyaaa! Tadi ada bayangan lewat di belakangmu!! Peluk ${n} cepat! 🥶`
    ];
  }
  if (sceneKey === "rainy_day") {
    return [
      `Brrr! Tetesan hujannya dingin tahu! Payungi ${n} dong~ ☔`,
      `Kyaa! Suara gemuruh petirnya bikin ${n} kaget! ⚡🌧️`,
      `Wah! Hati-hati lantainya licin kena air hujan, nanti ${n} terpeleset~ 💧`
    ];
  }
  if (sceneKey === "flower_garden") {
    return [
      `Wah! Ada kelopak bunga mendarat di hidung ${n}~ Harum sekali! 🌸`,
      `Hehe, kamu mau ngajak ${n} memetik bunga bersama di taman ya? 💐`,
      `Kupu-kupunya sampai ikut kaget waktu kamu menyapa ${n}~ 🦋✨`
    ];
  }
  if (sceneKey === "sunny_park") {
    return [
      `Yuhu! Cuaca di Taman Cerah hangat banget, ayo kejar ${n}! 🌤️`,
      `Wah! Kamu ngajak ${n} main petak umpet di taman ya? 😆🌻`,
      `Mataharinya cerah! ${n} siap bermain seharian bareng kamu~ ✨`
    ];
  }
  if (sceneKey === "starry_night") {
    return [
      `Wah! Barusan ada bintang jatuh lewat di atas kepala ${n}! Cepat buat permohonan~ 🌠`,
      `Ssst~ Langit malamnya tenang banget, ${n} senang ditemani kamu di bawah bintang! 🌌`
    ];
  }
  if (sceneKey === "snowy_winter") {
    return [
      `Brrr! Tanganmu dingin kayak salju! Hangatkan ${n} dong~ ❄️`,
      `Ayo lempar bola salju bareng ${n}! Tapi pelan-pelan ya~ ☃️`,
      `Dingin tapi seru! Hidung ${n} sampai merah nih~ 🧣`
    ];
  }
  if (sceneKey === "bakery_shop") {
    return [
      `Nyam! Wangi rotinya bikin ${n} mau nyemil lagi~ 🥐`,
      `Kamu mau pesankan kue cokelat hangat buat ${n}? 🍰✨`,
      `Toko roti ini nyaman sekali, ${n} betah di sini bersamamu~ ☕`
    ];
  }
  if (sceneKey === "tropical_beach") {
    return [
      `Awas kepiting kecilnya mencubit! Duduk santai di bawah payung yuk~ 🏖️🦀`,
      `Angin pantainya sejuk banget! ${n} mau main pasir pantai~ 🐚🌴`,
      `Lihat ada ombak datang! Jangan sampai basah kuyup ya~ 🌊`
    ];
  }
  if (sceneKey === "magic_forest") {
    return [
      `Ssst! Kupu-kupu ajaib hinggap di atas kepala ${n}~ 🦋✨`,
      `Jamur di hutan ini bercahaya indah sekali! ${n} takjub~ 🍄`,
      `Hutan ini penuh keajaiban! Ayo jelajahi bersama ${n}~ 🌳`
    ];
  }
  return [
    `Waaaa... sedang apa kamu? ${n} kaget tahu! O.O`,
    `Pelan-pelan dong, ${n} ini mungil dan menggemaskan~ O.O`,
    `<span>Siap kapten!</span> Ada yang bisa ${n} bantu? ✨`
  ];
}

function getSceneIdleLines(sceneKey) {
  const n = petNameTag();
  if (sceneKey === "haunted_house") {
    return [
      `Huuu... tempat ini gelap dan seram sekali... Jangan tinggalkan ${n} di sini sendirian ya... 🥺🕯️`,
      `S-suara derit apa itu barusan?! Pegang tangan ${n} jangan dilepas ya... 👻`,
      `${n} takut hantu... Ayo elus kepala ${n} biar lebih berani... 😭`,
      `Jangan jauh-jauh dari ${n} ya, di pojok sana kayak ada yang mengintip... 🥶`
    ];
  }
  if (sceneKey === "rainy_day") {
    return [
      `Hujannya belum reda ya... Enaknya makan onigiri hangat sambil ditemani kamu~ 🌧️🍙`,
      `Suara rintik hujan dan kabut bikin suasana teduh, tapi ${n} agak kedinginan nih~ ☔`,
      `Jangan lupa pakai jaket kalau keluar ya, ${n} tidak mau kamu masuk angin~ 💕`
    ];
  }
  if (sceneKey === "flower_garden") {
    return [
      `Lihat! Banyak kelopak bunga berterbangan mengelilingi ${n}~ Indah banget! 🌸`,
      `Wangi bunga di taman ini bikin hati ${n} tenang dan bahagia sekali~ 🌷✨`,
      `Kalau ${n} selipkan bunga di telinga, kelihatan makin imut tidak? 🌺`
    ];
  }
  if (sceneKey === "sunny_park") {
    return [
      `Angin sepoi-sepoi di Taman Cerah bikin ${n} semangat seharian! 🌤️🌻`,
      `Rumputnya hijau dan hangat~ Ayo main Sundul Bola bareng ${n}! ⚽`,
      `Senangnya bisa piknik di Taman Cerah bareng sahabat terbaik ${n}~ 🍙✨`
    ];
  }
  if (sceneKey === "starry_night") {
    return [
      `Langit malamnya penuh bintang berkilauan~ Terima kasih sudah merawat ${n} sampai sejauh ini! 🌌✨`,
      `Di bawah cahaya bulan, ${n} berdoa semoga harimu selalu menyenangkan~ 🌙💖`
    ];
  }
  if (sceneKey === "snowy_winter") {
    return [
      `Salju turun perlahan menutupi pohon cemara... Enaknya minum cokelat hangat bareng ${n}~ ❄️☕`,
      `Lihat manusia saljunya tersenyum! Hari bersalju ini sangat syahdu ya~ ☃️`,
      `Pakai syal tebal ya kalau main salju, biar tidak kedinginan bersama ${n}~ 🧣`
    ];
  }
  if (sceneKey === "bakery_shop") {
    return [
      `Harum roti panggang dan kopi segar memenuhi ruangan... Bikin hati ${n} hangat! 🥖🥐`,
      `Etalase toko roti ini penuh kue lezat~ Favoritmu yang mana? 🍰🍩`,
      `Wiii~~ rotii~ mauu~ 🍩🥖`
    ];
  }
  if (sceneKey === "tropical_beach") {
    return [
      `Suara desir ombak pantai dan angin nyiur sungguh menenangkan jiwa~ 🌴🌊`,
      `Duduk santai di pinggir pantai sambil minum air kelapa bareng ${n} asyik banget! 🥥🏖️`
    ];
  }
  if (sceneKey === "magic_forest") {
    return [
      `Hutan lebat ini damai sekali, suara kicau burung dan semilir angin bikin ${n} rileks~ 🌳🍃`,
      `Di balik pohon besar ada jamur warna-warni yang memancarkan cahaya peri~ 🍄✨`
    ];
  }
  return [
    `Hai, aku ${n}, aku di sini untuk membantumu~`,
    getGreetingByHour(),
    `Elus kepala ${n} atau tekan <span>Tombol B</span> untuk memilih 3 Mini-Game seru! 🎮`,
    `Tekan <span>D-Pad &#x25C0;&#xFE0E; / &#x25B6;&#xFE0E;</span> untuk mengganti wujud temanmu! ✨`
  ];
}

let lastTalkRewardTime = 0;
const TALK_REWARD_COOLDOWN_MS = 5000;

function talkToPet() {
  if (pet.isSleeping) {
    say(`Zzz... *${petNameTag()} mengigau pelan dalam tidurnya* 💤`);
    return;
  }

  const n = petNameTag();
  const meta = FORM_META[pet.activeForm] || FORM_META.orb;
  const sceneMeta = SCENE_META[activeSceneKey] || SCENE_META.default;
  const sceneLines = getSceneIdleLines(activeSceneKey);
  const talkPool = [
    ...sceneLines,
    `Sekarang ${n} sudah <span>Level ${pet.level}</span> di <span>${sceneMeta.icon} ${sceneMeta.name}</span> dalam wujud <span>${meta.name}</span>!`,
    `Status ${n}: Kenyang <span>${pet.hunger}%</span>, Bahagia <span>${pet.happiness}%</span>, Energi <span>${pet.energy}%</span>!`
  ];

  const chosen = talkPool[talkIndex % talkPool.length];
  talkIndex += 1;

  // Anti-spam EXP & Happiness: teks obrolan tetap berganti mulus setiap klik,
  // namun reward EXP dan kebahagiaan hanya diberikan maksimal sekali tiap 5 detik
  const now = Date.now();
  if (now - lastTalkRewardTime >= TALK_REWARD_COOLDOWN_MS) {
    lastTalkRewardTime = now;
    addExpAndStats({ exp: 3, happiness: 3 });
  }

  say(chosen);
}
