# 🐾 Mochi Pocket — Teman Mungil Interaktif

Konsol peliharaan virtual (*Virtual Pet* & *Tamagotchi*) bergaya *handheld* retro minimalis modern yang hidup di browser dan desktop Anda. Dilengkapi wujud animasi kawaii, integrasi model Live2D WebGL, 6 tema casing konsol solid elegan, siklus hidup otomatis, serta **ekstensi browser resmi** dengan layar melayang interaktif yang mengikuti kursor mouse Anda ke mana pun Anda berselancar.

---

## 🌟 Fitur Utama

- **Handheld GameBoy Console**: Tampilan konsol retro modern dengan D-Pad tactile, tombol A/B, lampu status LED, dan bezel elegan.
- **Wujud Karakter Hidup**:
  - Wujud Hewan SVG Dinamis: Puni Mochi (`🫧`), Kucing Neko (`🐱`), Hamster Mochi (`🐹`), Anjing Shiba (`🐶`), Landak Mini (`🦔`), Anak Ayam Piyo (`🐤`), dan lainnya.
  - Model Live2D WebGL: Menampilkan model anime interaktif beresolusi tinggi (Koharu, Wanko, Shizuku, Z16, Haruto, Chitose) atau model `.model.json` kustom via URL.
  - Karakter Kustom Mod SDK: Pasang karakter buatan sendiri!
- **Indikator Status Gauges (Memudar Tanpa Bar Kaku)**:
  - 🍙 **Kenyang**: Berkurang secara berkala saat beraktivitas; bergetar keroncongan (`〰️`) saat memasuki zona kritis (`<= 25%`).
  - 💖 **Bahagia**: Meningkat saat dielus (*cursor scratch*) atau diajak bicara; masuk ke mode ngambek jika `< 15%`.
  - ⚡ **Energi**: Mengisi daya saat tidur pulas (D-Pad ▼); lelah mengantuk jika `<= 25%`.
  - ⭐ **EXP & Leveling**: Dapatkan EXP dari makan, dielus, dan bermain mini-game untuk membuka wujud serta latar dunia baru.
- **Dunia Panggung Berdasarkan Level**:
  - Lv.2: 🏠 Kamar Hangat (Jendela, jam dinding, tanaman hias, karpet)
  - Lv.4: 🌤️ Taman Cerah (Matahari, awan berarak, rerumputan bergoyang)
  - Lv.6: 🌧️ Hari Hujan (Awan mendung, tetesan hujan berkilau, riak genangan air)
  - Lv.8+: 🌸 Taman Bunga, 🪦 Kuburan Mistis, 🌌 Malam Bintang, dan lainnya.
- **6 Pilihan Tema Konsol Solid Elegan**:
  - 🌑 Hitam Matte (*Obsidian Dark*)
  - 🌆 Senja Teduh (*Twilight Purple*)
  - ☁️ Abu Teduh (*Slate Gray*)
  - 🍵 Matcha Teduh (*Forest Green*)
  - 🥛 Krim Cerah (*Warm Cream*)
  - 🌸 Sakura Cerah (*Pastel Pink*)
- **Studio Modding SDK V2**: Koding karakter dan latar duniamu sendiri lalu pasang langsung ke dalam konsol!

---

## 🧩 Ekstensi Browser Resmi (Chrome & Microsoft Edge)

Bawa Mochi bersamamu di setiap tab browser yang kamu buka (Google, YouTube, GitHub, kerja, belajar)!

### Fitur Ekstensi:
1. **Layar Mungil Melayang di Pojok Layar**: Tampil estetik di pojok kiri bawah tanpa menghalangi konten pekerjaan atau video yang sedang kamu tonton.
2. **Pelacakan Kursor Mouse Real-time (*Eye Tracking Parallax*)**: Mata dan kepala karakter akan menoleh dan melirik mengikuti ke mana pun kursor mouse kamu bergerak di tab browser.
3. **Bilah Aksi Cepat (*Quick Action Bar*)**: Tombol melayang di bawah kaki karakter untuk Beri Makan (`🍙`), Tidur (`💤`), Bicara (`💬`), Ganti Wujud (`🐾`), dan Buka Web Konsol (`↗`).
4. **Auto-Feeder (Beri Makan Otomatis)**: Peliharaan tidak akan mati kelaparan saat kamu sibuk! Service Worker background akan mengecek dan menyuapi karakter jika kenyang menyentuh ambang kritis `<= 25%`.
5. **Sinkronisasi 1 Database**: Level, nama, wujud, dan status karakter antara Web Console dan Ekstensi selalu sinkron.

### Cara Memasang Ekstensi di Browser:
1. Unduh berkas **`mochi-pocket-extension.zip`** dari tombol *Unduh / Info ↗* di web Mochi Pocket.
2. Ekstrak zip tersebut ke dalam sebuah folder di komputer kamu.
3. Buka browser (Chrome / Edge / Brave), lalu ketikkan `chrome://extensions` di kolom alamat.
4. Aktifkan **Mode Pengembang (*Developer Mode*)** di pojok kanan atas.
5. Klik tombol **Muat yang belum dibongkar (*Load Unpacked*)**, lalu pilih folder ekstensi hasil ekstrak.
6. Selesai! Karakter Mochi Pocket akan langsung muncul di pojok kiri bawah tab browsing kamu.

---

## 🎨 Panduan Lengkap Modding SDK (Membuat Karakter & Latar Sendiri)

Mochi Pocket dilengkapi **Modding SDK** berbasis berkas JavaScript (`.js`) atau JSON (`.json`). Kamu bisa mengunduh template mod langsung dari menu **Setelan Konsol ➔ Mod & Data ➔ Studio Mod SDK**.

Semua kartu mod kustom yang berhasil dipasang akan ditandai dengan **lencana lencana ungu `CUSTOM`** di menu pemilihan Karakter dan Latar.

---

### 1. Membuat Karakter Kustom (`custom-pet-*.js`)

Karakter kustom diekspor sebagai objek modul JavaScript atau JSON dengan skema berikut:

```javascript
export default {
  id: "custom_kucing_oren",       // Wajib: ID unik (huruf kecil, garis bawah)
  name: "Oren",                   // Wajib: Nama karakter yang ditampilkan
  author: "Nama Kamu",            // Nama kreator
  version: "1.0.0",               // Versi mod
  tag: "🐱 OREN",                 // Label pendek pada bezel
  icon: "🐱",                     // Emoji ikon
  unlockLevel: 1,                 // Level minimal untuk membuka karakter ini

  // Palet warna (opsional sebagai referensi tema)
  palette: {
    primary: "#f97316",
    belly: "#fef08a",
    accents: "#c2410c"
  },

  // Anatomi Gambar SVG Karakter
  anatomy: {
    // 1. Kepala: Disarankan menggunakan class 'parallax-head' dan menyertakan 'tracking-eye'
    headSvg: `
      <svg class="svg-full" viewBox="0 0 264 205" fill="none">
        <!-- Telinga Kiri & Kanan -->
        <path d="M 28 92 C 16 52, 24 16, 38 12 C 52 8, 86 32, 102 64 Z" fill="#ea580c" stroke="#3b2322" stroke-width="5" stroke-linejoin="round"/>
        <path d="M 236 92 C 248 52, 240 16, 226 12 C 212 8, 178 32, 162 64 Z" fill="#ea580c" stroke="#3b2322" stroke-width="5" stroke-linejoin="round"/>
        
        <!-- Bentuk Wajah / Kepala -->
        <path d="M 52 48 C 82 22, 182 22, 212 48 C 246 78, 252 142, 218 174 C 182 204, 82 204, 46 174 C 12 142, 18 78, 52 48 Z" fill="#f97316" stroke="#3b2322" stroke-width="5.5" stroke-linejoin="round"/>
        
        <!-- Pipi Merona Kawaii -->
        <circle cx="56" cy="132" r="14" fill="#fb7185" opacity="0.85"/>
        <circle cx="208" cy="132" r="14" fill="#fb7185" opacity="0.85"/>

        <!-- Hidung & Mulut -->
        <ellipse cx="132" cy="120" rx="4.5" ry="3.5" fill="#3b2322"/>
        <path d="M 124 126 Q 132 134 132 126 Q 132 134 140 126" stroke="#3b2322" stroke-width="3" stroke-linecap="round" fill="none"/>

        <!-- RIG MATA PELACAK KURSOR (IKUTI MOUSE) -->
        <!-- Sclera / Bola Mata Putih -->
        <ellipse cx="94" cy="102" rx="13" ry="17" fill="#ffffff" stroke="#3b2322" stroke-width="3.5"/>
        <ellipse cx="170" cy="102" rx="13" ry="17" fill="#ffffff" stroke="#3b2322" stroke-width="3.5"/>

        <!-- Iris Mata yang Bergerak (Wajib class 'tracking-eye') -->
        <g class="tracking-eye" style="transition: transform 0.08s ease-out;">
          <ellipse cx="95" cy="102" rx="7.5" ry="10.5" fill="#3b2322"/>
          <ellipse cx="169" cy="102" rx="7.5" ry="10.5" fill="#3b2322"/>
          <!-- Kilau Mata Bintang Kawaii -->
          <circle cx="92" cy="98" r="3" fill="#ffffff"/>
          <circle cx="166" cy="98" r="3" fill="#ffffff"/>
        </g>
      </svg>
    `,

    // 2. Badan & Kaki
    bodySvg: `
      <svg class="svg-full" viewBox="0 0 200 145" fill="none">
        <path d="M 48 15 C 24 45, 18 92, 30 116 C 40 132, 65 135, 100 135 C 135 135, 160 132, 170 116 C 182 92, 176 45, 152 15 Z" fill="#f97316" stroke="#3b2322" stroke-width="5" stroke-linejoin="round"/>
        <!-- Perut Putih -->
        <path d="M 72 25 C 85 45, 115 45, 128 25 C 140 60, 132 105, 100 108 C 68 105, 60 60, 72 25 Z" fill="#fff7ed"/>
        <!-- Kaki Kiri & Kanan -->
        <path d="M 68 85 C 68 115, 75 138, 86 138 C 96 138, 96 115, 94 85" fill="#f97316" stroke="#3b2322" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 132 85 C 132 115, 125 138, 114 138 C 104 138, 104 115, 106 85" fill="#f97316" stroke="#3b2322" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
    `,

    // 3. Ekor
    tailSvg: `
      <svg class="svg-full" viewBox="0 0 120 150" fill="none">
        <path d="M 102 114 C 54 118, 16 90, 26 42 C 30 22, 54 22, 54 40 C 54 50, 44 58, 46 74 C 48 90, 74 96, 102 92 Z" fill="#f97316" stroke="#3b2322" stroke-width="9" stroke-linejoin="round"/>
      </svg>
    `
  },

  // Kumpulan Kalimat Dialog Karakter
  dialogues: {
    greetings: ["Meow! Aku Oren, siap menemanimu bekerja hari ini! 🐾"],
    idle: ["Sedang coding apa hari ini? Oren bantu pantau ya! 💻✨"],
    feed: ["Nyam nyam! Ikan bakar ini lezat sekali! 🐟💖"],
    sleep: ["Hoaaam... Oren tidur sebentar di keyboard-mu ya... 💤"]
  }
};
```

> [!TIP]
> **Cara Mengaktifkan Mouse Tracking pada Karakter Baru:**
> Bungkus elemen pupil/iris di dalam grup `<g class="tracking-eye">...</g>`. Mesin paralaks Mochi Pocket secara otomatis akan menggerakkan elemen tersebut mengikuti koordinat kursor mouse!

---

### 2. Membuat Latar Dunia Kustom (`custom-scene-*.js`)

Latar panggung baru dapat dibuat dengan menggabungkan gradien latar CSS dan ornamen dekorasi bertingkat:

```javascript
export default {
  id: "custom_pulau_tropis",      // Wajib: ID unik
  name: "Pantai Tropis",          // Nama latar panggung
  icon: "🏖️",                     // Emoji ikon
  unlockLevel: 1,                 // Level minimal membuka latar ini

  // Gradien CSS untuk Langit dan Lantai Panggung
  backgroundCSS: `
    radial-gradient(circle at 75% 25%, rgba(253, 224, 71, 0.45) 0%, transparent 60%),
    linear-gradient(180deg, #38bdf8 0%, #bae6fd 62%, #fde047 62%, #eab308 100%)
  `,

  // Warna aksen pendaran cahaya panggung
  ambientColor: "rgba(56, 189, 248, 0.2)",

  // Daftar Dekorasi Ornamen di Panggung
  decorations: [
    {
      id: "matahari",
      emoji: "☀️",
      style: "position: absolute; top: 32px; right: 36px; font-size: 2.8rem; filter: drop-shadow(0 0 14px #facc15);"
    },
    {
      id: "pohon_kelapa",
      emoji: "🌴",
      style: "position: absolute; bottom: 35%; left: 16px; font-size: 3.2rem; z-index: 2;"
    },
    {
      id: "ombak_laut",
      emoji: "🌊",
      style: "position: absolute; bottom: 37%; right: 20px; font-size: 2rem; z-index: 1;"
    }
  ],

  // Kumpulan dialog khusus saat karakter berada di latar ini
  dialogues: [
    "Wah, deburan ombak dan angin pantainya sejuk sekali ya! 🏖️🌊",
    "Ayo bangun istana pasir bersama! 🏰✨",
    "Mataharinya hangat dan cerah, jangan lupa minum air putih ya~ 🥥☀️"
  ]
};
```

---

### 3. Cara Mengunggah & Memasang Mod ke Mochi Pocket

1. Di konsol GameBoy Mochi Pocket, tekan tombol pill **SETELAN** di bagian bawah bodi konsol.
2. Pada modal Pengaturan Global, pilih tab **🛠️ Mod & Data**.
3. Pada bagian *Studio Mod & Template SDK V2*, klik tombol hijau solid:
   **📤 Unggah & Pasang Mod (.js / .json)**
4. Pilih berkas modul yang sudah kamu buat (`.js` atau `.json`).
5. Sistem akan memvalidasi skema modul:
   - Jika berhasil, partikel perayaan akan meletus dan karakter/latar barumu langsung aktif!
   - Modul otomatis tersimpan secara permanen di database lokal browser (`localStorage` / `IndexedDB`), dan langsung dapat dipilih kapan saja melalui menu **KARAKTER** dengan tanda badge ungu **CUSTOM**.

---

## 🛠️ Struktur Berkas Proyek

```text
mochi-pocket/
├── index.html                   # Halaman konsol utama (GameBoy Handheld)
├── style.css                    # Seluruh styling tema, tata letak, & animasi
├── js/
│   ├── app.js                   # Siklus hidup utama (Lifecycle & Bootloader)
│   ├── config.js                # Definisi level, form meta, tema, & scenes
│   ├── controls.js              # Penanganan tombol D-Pad, A/B, & modal form
│   ├── custom-mods.js           # Mesin Modding SDK V2 (Parser & Storage)
│   ├── dashboard.js             # Render panggung, gauge, status, & visual
│   ├── db.js                    # Database browser (IndexedDB & Chrome Storage bridge)
│   ├── dialogue.js              # Kumpulan pesan percakapan & speech bubble
│   ├── elements.js              # Referensi elemen DOM
│   ├── forms.js                 # Transformasi wujud & rig SVG hewan
│   ├── minigames.js             # Mini-game Tangkap Bintang
│   └── tamagotchi.js            # Sistem metabolisme Tamagotchi & idle decay
├── sdk/
│   ├── README-SDK.md            # Dokumentasi singkat SDK modding
│   ├── custom-pet-template.js   # Berkas template karakter kustom
│   ├── custom-pet-dragon.js     # Sampel bawaan: Naga Ryuu (Eye-tracking)
│   ├── custom-scene-template.js # Berkas template latar kustom
│   └── custom-scene-volcano.js  # Sampel bawaan: Pulau Vulkano Megah
├── extension/                   # Ekstensi Browser Resmi (Manifest V3)
│   ├── manifest.json            # Konfigurasi ekstensi Chrome & Edge
│   ├── background.js            # Service worker background & Auto-Feeder alarm
│   ├── content_script.js        # Jembatan sinkronisasi 1 database & tracking mouse
│   ├── widget.html              # Layar Mochi Pocket melayang di pojok tab
│   ├── widget.css               # Styling floating screen & quick action bar
│   ├── widget-bridge.js         # Jembatan tracking kursor & tombol aksi
│   ├── popup.html               # Menu saklar ekstensi di toolbar browser
│   └── popup.js                 # Logika interaksi popup toolbar
└── mochi-pocket-extension.zip   # Paket siap pasang untuk Chrome / Edge
```

---

## 📜 Lisensi & Atribusi
Dibuat dengan ❤️ untuk menemani aktivitas harian, belajar, dan bekerja. Bebas digunakan, dimodifikasi, dan dikembangkan lebih lanjut.
