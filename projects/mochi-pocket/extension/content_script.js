/**
 * Mochi Pocket Extension — content_script.js
 * Injeksi Floating Screen-Only Pet Widget (Shadow DOM) di Pojok Kiri Bawah Setiap Tab Browser
 * & Bridge Sinkronisasi Realtime dengan Web Blog
 */

(function () {
  // 1. Deteksi apakah tab yang dibuka adalah halaman Web Blog Mochi Pocket
  const isMochiPocketPage =
    window.location.pathname.includes("/mochi-pocket") ||
    document.querySelector(".gameboy-shell") !== null;

  if (isMochiPocketPage) {
    // Mode Bridge Sinkronisasi Web Blog <-> Ekstensi
    window.addEventListener("message", (event) => {
      if (event.data && event.data.type === "MOCHI_WEB_STATE_UPDATE") {
        chrome.runtime.sendMessage({
          type: "SYNC_PET_STATE_FROM_WEB",
          pet: event.data.pet
        });
      }
    });

    // Kirim state dari ekstensi ke web blog saat dibuka
    chrome.runtime.sendMessage({ type: "GET_PET_STATE" }, (res) => {
      if (res && res.mochi_pet) {
        window.postMessage({ type: "MOCHI_EXT_STATE_SYNC", pet: res.mochi_pet }, "*");
      }
    });
    return;
  }

  // 2. Jika di Tab Browser Lain (YouTube, Docs, dll), Buat Floating Pet Widget
  let hostEl = document.getElementById("mochi-pocket-floating-root");
  if (hostEl) return; // Cegah duplikasi

  hostEl = document.createElement("div");
  hostEl.id = "mochi-pocket-floating-root";
  document.body.appendChild(hostEl);

  const shadowRoot = hostEl.attachShadow({ mode: "closed" });

  // Tautkan CSS
  const linkCss = document.createElement("link");
  linkCss.rel = "stylesheet";
  linkCss.href = chrome.runtime.getURL("floating-widget.css");
  shadowRoot.appendChild(linkCss);

  // Buat Kontainer Widget
  const widgetContainer = document.createElement("div");
  widgetContainer.className = "mochi-floating-container";
  widgetContainer.innerHTML = `
    <!-- Tombol Tutup Sembunyikan -->
    <button type="button" class="btn-close-widget" title="Sembunyikan">✕</button>

    <!-- Mini HUD -->
    <div class="mochi-mini-hud">
      <span class="mini-name-badge" id="mini-name">Eri Lv.1</span>
      <div class="mini-stats-icons">
        <span id="mini-hunger-icon" title="Kenyang">🍙</span>
        <span id="mini-happy-icon" title="Bahagia">💖</span>
      </div>
    </div>

    <!-- Balon Ucapan Mini -->
    <div class="mochi-mini-bubble" id="mini-bubble">Halo! Aku menemanimu di sini~ ✨</div>

    <!-- 3 Tilde Kelaparan di Sebelah Kanan Pinggang -->
    <div class="mini-hunger-waves" id="mini-hunger-waves" title="Perut lapar~">
      <span>~</span>
      <span>~</span>
      <span>~</span>
    </div>

    <!-- Panggung Karakter -->
    <div class="mochi-character-stage">
      <div class="mochi-bouncy-actor" id="mini-actor">
        <!-- SVG Neko Kawaii Bouncy -->
        <svg viewBox="0 0 160 160" width="100%" height="100%" fill="none" style="overflow: visible;">
          <!-- Ekor -->
          <path d="M 38 126 C 18 128, 6 112, 10 92 C 12 82, 24 82, 24 92 C 24 98, 20 102, 22 110 C 24 118, 36 120, 48 118 Z" fill="#f9b87c" stroke="#3b2322" stroke-width="4.5"/>
          <!-- Badan -->
          <path d="M 44 88 C 30 104, 30 128, 42 138 C 50 144, 75 144, 88 144 C 102 144, 126 144, 134 138 C 146 128, 146 104, 132 88 Z" fill="#ffffff" stroke="#3b2322" stroke-width="4.5"/>
          <!-- Kaki Depan -->
          <path d="M 66 116 C 66 134, 70 144, 78 144" stroke="#3b2322" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M 110 116 C 110 134, 106 144, 98 144" stroke="#3b2322" stroke-width="4.5" stroke-linecap="round"/>
          <!-- Telinga -->
          <path d="M 46 64 C 36 38, 42 20, 50 18 C 60 16, 74 30, 82 46 Z" fill="#ffffff" stroke="#3b2322" stroke-width="4.5"/>
          <path d="M 52 56 C 46 40, 50 26, 54 24 C 60 22, 70 32, 76 44 Z" fill="#f47392"/>
          <path d="M 130 64 C 140 38, 134 20, 126 18 C 116 16, 102 30, 94 46 Z" fill="#ffffff" stroke="#3b2322" stroke-width="4.5"/>
          <path d="M 124 56 C 130 40, 126 26, 122 24 C 116 22, 106 32, 100 44 Z" fill="#f47392"/>
          <!-- Kepala -->
          <path d="M 48 54 C 66 40, 110 40, 128 54 C 146 70, 148 102, 132 116 C 114 130, 62 130, 44 116 C 28 102, 30 70, 48 54 Z" fill="#ffffff" stroke="#3b2322" stroke-width="4.5"/>
          <!-- Pipi -->
          <ellipse cx="56" cy="98" rx="8" ry="5" fill="#f47392" opacity="0.8"/>
          <ellipse cx="120" cy="98" rx="8" ry="5" fill="#f47392" opacity="0.8"/>
          <!-- Mata Kucing Kawaii -->
          <ellipse cx="68" cy="88" rx="5.5" ry="7.5" fill="#3b2322"/>
          <circle cx="66" cy="85" r="2.2" fill="#ffffff"/>
          <ellipse cx="108" cy="88" rx="5.5" ry="7.5" fill="#3b2322"/>
          <circle cx="106" cy="85" r="2.2" fill="#ffffff"/>
          <!-- Hidung & Mulut -->
          <ellipse cx="88" cy="93" rx="2.5" ry="2" fill="#f47392"/>
          <path d="M 83 97 Q 88 102 88 97 Q 88 102 93 97" stroke="#3b2322" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        </svg>
      </div>
    </div>

    <!-- Bilah Aksi Cepat (Hover) -->
    <div class="mochi-hover-actions">
      <button type="button" class="mini-action-btn" id="btn-mini-feed" title="Beri Makan (+5%)">🍙</button>
      <button type="button" class="mini-action-btn" id="btn-mini-pet" title="Elus Sayang (+Bahagia)">💕</button>
    </div>
  `;

  shadowRoot.appendChild(widgetContainer);

  const miniName = shadowRoot.getElementById("mini-name");
  const miniBubble = shadowRoot.getElementById("mini-bubble");
  const miniHungerWaves = shadowRoot.getElementById("mini-hunger-waves");
  const btnClose = shadowRoot.querySelector(".btn-close-widget");
  const btnMiniFeed = shadowRoot.getElementById("btn-mini-feed");
  const btnMiniPet = shadowRoot.getElementById("btn-mini-pet");

  let bubbleTimeout = null;

  function showBubble(text, duration = 3000) {
    if (bubbleTimeout) clearTimeout(bubbleTimeout);
    miniBubble.textContent = text;
    miniBubble.classList.add("active");
    if (duration > 0) {
      bubbleTimeout = setTimeout(() => {
        miniBubble.classList.remove("active");
      }, duration);
    }
  }

  function updateWidgetUI(pet) {
    if (!pet) return;
    miniName.textContent = `${pet.name || "Eri"} Lv.${pet.level || 1}`;

    // Aktifkan 3 tilde gelombang kelaparan di kanan pinggang jika kenyang <= 50%
    const isHungry = (pet.hunger || 0) <= 50;
    miniHungerWaves.classList.toggle("active", isHungry);
  }

  // Muat data awal dari storage ekstensi
  chrome.storage.local.get(["mochi_pet", "mochi_settings"], (data) => {
    if (data.mochi_settings && data.mochi_settings.enabled === false) {
      hostEl.style.display = "none";
    }
    updateWidgetUI(data.mochi_pet);
  });

  // Dengarkan perubahan realtime (Cross-tab sync & Auto-feeder update)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
      if (changes.mochi_pet) {
        updateWidgetUI(changes.mochi_pet.newValue);
      }
      if (changes.mochi_settings) {
        const s = changes.mochi_settings.newValue;
        hostEl.style.display = s.enabled ? "block" : "none";
      }
    }
  });

  // Interaksi Widget
  widgetContainer.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    chrome.storage.local.get(["mochi_pet"], (data) => {
      const pet = data.mochi_pet;
      if (pet) {
        if (pet.happiness < 15) {
          showBubble(`Hmph! ${pet.name} lagi ngambek nih! Bahagiaku di bawah 15%! Elus aku dong... 😤💢`);
        } else {
          showBubble(`Hai! Aku ${pet.name}! Kenyang: ${Math.round(pet.hunger)}%, Bahagia: ${Math.round(pet.happiness)}%~ ✨`);
        }
      }
    });
  });

  btnMiniFeed.addEventListener("click", (e) => {
    e.stopPropagation();
    chrome.storage.local.get(["mochi_pet"], (data) => {
      let pet = data.mochi_pet || {};
      if (pet.hunger >= 100) {
        showBubble("Perutku sudah kenyang 100%! Makasih~ 🍙");
        return;
      }
      // Sesuai aturan V2: Kenyang +5, EXP +2, Bahagia +1.5, Energi +0.8
      pet.hunger = Math.min(100, (pet.hunger || 0) + 5);
      pet.exp = (pet.exp || 0) + 2;
      pet.happiness = Math.min(100, (pet.happiness || 0) + 1.5);
      pet.energy = Math.min(100, (pet.energy || 0) + 0.8);
      if (pet.exp >= 100) {
        pet.exp -= 100;
        pet.level = (pet.level || 1) + 1;
        showBubble(`🎉 Hore! Naik ke Level ${pet.level}!`);
      } else {
        showBubble("Nyam nyam! Lezat sekali~ 🍙");
      }
      chrome.storage.local.set({ mochi_pet: pet });
    });
  });

  btnMiniPet.addEventListener("click", (e) => {
    e.stopPropagation();
    chrome.storage.local.get(["mochi_pet"], (data) => {
      let pet = data.mochi_pet || {};
      pet.happiness = Math.min(100, (pet.happiness || 0) + 4);
      showBubble("Purrr~ Elusanmu nyaman sekali! 💕");
      chrome.storage.local.set({ mochi_pet: pet });
    });
  });

  btnClose.addEventListener("click", (e) => {
    e.stopPropagation();
    hostEl.style.display = "none";
    chrome.storage.local.get(["mochi_settings"], (data) => {
      const s = data.mochi_settings || {};
      s.enabled = false;
      chrome.storage.local.set({ mochi_settings: s });
    });
  });
})();
