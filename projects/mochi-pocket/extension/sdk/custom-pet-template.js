/**
 * Mochi Pocket SDK — Template Karakter Kustom
 * Format: ES Module / JavaScript Object
 *
 * Panduan Penggunaan:
 * 1. Salin berkas ini dan ubah properti di bawah sesuai karakter kreasi Anda.
 * 2. Anda dapat menggunakan komponen SVG bawaan atau menulis SVG Anda sendiri.
 * 3. Simpan dan unggah berkas ini melalui menu "🎨 Studio Mod" di Mochi Pocket.
 */

export default {
  // ID unik untuk karakter Anda (gunakan huruf kecil, angka, dan garis bawah)
  id: "custom_kuro_neko",

  // Nama tampilan karakter
  name: "Kuro",

  // Nama pembuat / kreator
  author: "Kreator Keren",

  // Versi karakter
  version: "1.0.0",

  // Tag badge yang muncul di sudut bezel konsol
  tag: "🐱 KURO",

  // Ikon emoji / simbol representatif
  icon: "🐱",

  // Level minimum pembuka karakter (1 = langsung terbuka dari awal)
  unlockLevel: 1,

  // Warna-warna tema karakter (opsional, jika menggunakan palet dinamis)
  palette: {
    primary: "#2d3748",    // Warna badan utama (misal hitam abu gelap)
    secondary: "#1a202c",  // Warna bayangan
    belly: "#f7fafc",      // Warna dada / perut
    blush: "#fc8181",      // Warna perona pipi
    ears: "#feb2b2",       // Warna telinga dalam
    eyes: "#f6e05e"        // Warna mata (misal kuning khas kucing hitam)
  },

  // Komponen Anatomi SVG Karakter (Dapat dikustomisasi penuh)
  // Sistem Mochi Pocket akan menyusun komponen ini ke dalam rig dinamis
  anatomy: {
    // 1. SVG Kepala (ViewBox rekomendasi: 0 0 264 205)
    headSvg: `
      <svg class="svg-full" viewBox="0 0 264 205" fill="none">
        <!-- Telinga Kiri & Kanan -->
        <path d="M 28 92 C 16 52, 24 16, 38 12 C 52 8, 86 32, 102 64 Z" fill="#2d3748" stroke="#1a202c" stroke-width="5" stroke-linejoin="round"/>
        <path d="M 38 82 C 30 54, 36 28, 46 26 C 56 24, 78 40, 90 64 Z" fill="#feb2b2"/>
        <path d="M 236 92 C 248 52, 240 16, 226 12 C 212 8, 178 32, 162 64 Z" fill="#2d3748" stroke="#1a202c" stroke-width="5" stroke-linejoin="round"/>
        <path d="M 226 82 C 234 54, 228 28, 218 26 C 208 24, 186 40, 174 64 Z" fill="#feb2b2"/>

        <!-- Bentuk Wajah Bulat Mochi -->
        <path d="M 52 48 C 82 22, 182 22, 212 48 C 246 78, 252 142, 218 174 C 182 204, 82 204, 46 174 C 12 142, 18 78, 52 48 Z" fill="#2d3748" stroke="#1a202c" stroke-width="5.5" stroke-linejoin="round"/>
        
        <!-- Pipi Kemerahan Imut -->
        <circle cx="56" cy="132" r="14" fill="#fc8181" opacity="0.85"/>
        <circle cx="208" cy="132" r="14" fill="#fc8181" opacity="0.85"/>

        <!-- Hidung Mungil & Mulut Kucing :3 -->
        <ellipse cx="132" cy="120" rx="4.5" ry="3.5" fill="#feb2b2"/>
        <path d="M 124 126 Q 132 134 132 126 Q 132 134 140 126" stroke="#f7fafc" stroke-width="3" stroke-linecap="round" fill="none"/>
        
        <!-- Kumis Kiri & Kanan -->
        <path d="M 36 120 Q 70 122 96 126 M 32 134 Q 70 132 94 134" stroke="#f7fafc" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 228 120 Q 194 122 168 126 M 232 134 Q 194 132 170 134" stroke="#f7fafc" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `,

    // 2. SVG Badan & Kaki (ViewBox rekomendasi: 0 0 200 145)
    bodySvg: `
      <svg class="svg-full" viewBox="0 0 200 145" fill="none">
        <!-- Badan Duduk Bulat -->
        <path d="M 48 15 C 24 45, 18 92, 30 116 C 40 132, 65 135, 100 135 C 135 135, 160 132, 170 116 C 182 92, 176 45, 152 15 Z" fill="#2d3748" stroke="#1a202c" stroke-width="5" stroke-linejoin="round"/>
        
        <!-- Corak Putih di Dada/Perut -->
        <path d="M 72 25 C 85 45, 115 45, 128 25 C 140 60, 132 105, 100 108 C 68 105, 60 60, 72 25 Z" fill="#f7fafc"/>
        
        <!-- Kaki Depan Kiri & Kanan -->
        <path d="M 68 85 C 68 115, 75 138, 86 138 C 96 138, 96 115, 94 85" fill="#2d3748" stroke="#1a202c" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 132 85 C 132 115, 125 138, 114 138 C 104 138, 104 115, 106 85" fill="#2d3748" stroke="#1a202c" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
    `,

    // 3. SVG Ekor (ViewBox rekomendasi: 0 0 120 150)
    tailSvg: `
      <svg class="svg-full" viewBox="0 0 120 150" fill="none">
        <path d="M 102 114 C 54 118, 16 90, 26 42 C 30 22, 54 22, 54 40 C 54 50, 44 58, 46 74 C 48 90, 74 96, 102 92 Z" fill="#2d3748" stroke="#1a202c" stroke-width="9" stroke-linejoin="round"/>
        <circle cx="40" cy="32" r="16" fill="#f7fafc"/>
      </svg>
    `
  },

  // Percakapan & Respon Spesifik Karakter Ini
  dialogues: {
    greetings: [
      "Meow! Aku Kuro, siap menemanimu bekerja atau santai! 🐾",
      "Kucing hitam pembawa keberuntungan hadir untukmu~ ✨"
    ],
    idle: [
      "Sedang coding apa hari ini? Kuro bantu perhatikan ya! 💻",
      "Kuro suka melihat jari-jarimu mengetik cepat di keyboard~ ⌨️",
      "Hangat sekali bersamamu... Purrr~ 💖"
    ],
    feed: [
      "Nyam nyam! Ikan tuna favorit Kuro enak sekali! Makasih~ 🐟🍙",
      "Perut Kuro sudah hangat dan kenyang, makasih ya! ✨"
    ],
    sleep: [
      "Hoaaam... Kuro tidur meringkuk dulu ya, bangunkan jika butuh bantuan~ 💤"
    ]
  }
};
