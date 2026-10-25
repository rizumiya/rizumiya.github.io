/**
 * Mochi Pocket SDK — Karakter Kustom Contoh: Ryuu si Naga Api Imut
 * Format: ES Module / JavaScript Object
 *
 * Panduan Penggunaan:
 * 1. Berkas ini siap langsung diunggah melalui tombol "Unggah & Pasang Mod" di menu Pengaturan Mochi Pocket!
 * 2. Anda juga bisa mengedit SVG, warna, dan dialognya sesuka hati.
 */

export default {
  // ID unik untuk karakter naga
  id: "custom_baby_dragon",

  // Nama tampilan karakter
  name: "Ryuu",

  // Nama pembuat / kreator
  author: "Mochi Pocket SDK",

  // Versi karakter
  version: "1.0.0",

  // Tag badge yang muncul di sudut bezel konsol
  tag: "🐲 RYUU",

  // Ikon emoji representatif
  icon: "🐲",

  // Level minimum pembuka karakter (1 = langsung terbuka sejak awal)
  unlockLevel: 1,

  // Palet warna tema karakter
  palette: {
    primary: "#10b981",    // Hijau zamrud naga cerah
    secondary: "#047857",  // Hijau gelap bayangan
    belly: "#fef08a",      // Kuning emas perut naga
    horns: "#f59e0b",      // Tanduk emas
    wings: "#f97316",      // Sayap api oranye
    blush: "#f43f5e"       // Pipi merah merona
  },

  // Komponen Anatomi SVG Karakter Naga
  anatomy: {
    // 1. SVG Kepala Naga Imut (ViewBox: 0 0 264 205)
    headSvg: `
      <svg class="svg-full" viewBox="0 0 264 205" fill="none">
        <!-- 2 Tanduk Naga Emas Mungil di Atas Kepala -->
        <path d="M 96 46 C 88 18, 72 6, 62 10 C 56 14, 62 30, 80 54 Z" fill="#f59e0b" stroke="#3b2322" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 168 46 C 176 18, 192 6, 202 10 C 208 14, 202 30, 184 54 Z" fill="#f59e0b" stroke="#3b2322" stroke-width="4.5" stroke-linejoin="round"/>

        <!-- 2 Telinga Bersirip Kiri & Kanan Naga -->
        <path d="M 38 90 C 16 70, 18 42, 32 38 C 44 34, 66 60, 78 84 Z" fill="#34d399" stroke="#3b2322" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 40 78 C 28 64, 30 48, 38 46 C 46 44, 60 62, 68 76 Z" fill="#fef08a" opacity="0.8"/>
        
        <path d="M 226 90 C 248 70, 246 42, 232 38 C 220 34, 198 60, 186 84 Z" fill="#34d399" stroke="#3b2322" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 224 78 C 236 64, 234 48, 226 46 C 218 44, 204 62, 196 76 Z" fill="#fef08a" opacity="0.8"/>

        <!-- Bentuk Wajah Bulat Mochi Naga Hijau Zamrud -->
        <path d="M 52 48 C 82 22, 182 22, 212 48 C 246 78, 252 142, 218 174 C 182 204, 82 204, 46 174 C 12 142, 18 78, 52 48 Z" fill="#10b981" stroke="#3b2322" stroke-width="5.5" stroke-linejoin="round"/>
        
        <!-- Sisik Dahi Hijau Cerah -->
        <ellipse cx="132" cy="52" rx="9" ry="6" fill="#6ee7b7" opacity="0.85"/>
        <ellipse cx="118" cy="62" rx="6" ry="4.5" fill="#6ee7b7" opacity="0.75"/>
        <ellipse cx="146" cy="62" rx="6" ry="4.5" fill="#6ee7b7" opacity="0.75"/>

        <!-- Pipi Kemerahan Imut Naga -->
        <circle cx="56" cy="134" r="14" fill="#f43f5e" opacity="0.78"/>
        <circle cx="208" cy="134" r="14" fill="#f43f5e" opacity="0.78"/>

        <!-- Lubang Hidung Naga Mungil -->
        <ellipse cx="125" cy="116" rx="3.5" ry="2.5" fill="#065f46"/>
        <ellipse cx="139" cy="116" rx="3.5" ry="2.5" fill="#065f46"/>

        <!-- Mulut Senyum Bahagia dengan Taring Mungil & Percikan Api Kecil -->
        <path d="M 118 126 Q 132 138 146 126" stroke="#3b2322" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <polygon points="124,126 128,126 126,131" fill="#ffffff" stroke="#3b2322" stroke-width="1.2"/>
        <polygon points="136,126 140,126 138,131" fill="#ffffff" stroke="#3b2322" stroke-width="1.2"/>
        <!-- Percikan Api Mungil di Sudut Mulut -->
        <path d="M 152 128 C 158 120, 164 125, 160 133 C 155 131, 150 132, 152 128 Z" fill="#f97316"/>
        <path d="M 154 127 C 158 123, 161 126, 158 130 Z" fill="#fde047"/>
      </svg>
    `,

    // 2. SVG Badan & Kaki Naga (ViewBox: 0 0 200 145)
    bodySvg: `
      <svg class="svg-full" viewBox="0 0 200 145" fill="none">
        <!-- Sayap Naga Oranye di Belakang Kiri & Kanan -->
        <path d="M 36 28 C 10 18, -4 44, 18 64 C 28 50, 42 42, 48 38 Z" fill="#f97316" stroke="#3b2322" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M 164 28 C 190 18, 204 44, 182 64 C 172 50, 158 42, 152 38 Z" fill="#f97316" stroke="#3b2322" stroke-width="4.5" stroke-linejoin="round"/>

        <!-- Siluet Badan Naga Duduk Bulat -->
        <path
          d="M 48 15 C 24 45, 18 92, 30 116 C 40 132, 65 135, 100 135 C 135 135, 160 132, 170 116 C 182 92, 176 45, 152 15 Z"
          fill="#10b981"
          stroke="#3b2322"
          stroke-width="5.5"
          stroke-linejoin="round"
        />

        <!-- Dada & Perut Bersisik Kuning Emas -->
        <path d="M 58 32 C 50 65, 56 126, 100 126 C 144 126, 150 65, 142 32 Z" fill="#fef08a"/>
        <!-- Garis-garis Segmen Sisik Perut Naga -->
        <line x1="72" y1="56" x2="128" y2="56" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
        <line x1="68" y1="78" x2="132" y2="78" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
        <line x1="74" y1="100" x2="126" y2="100" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>

        <!-- Kaki Depan / Tangan Cakar Naga Mungil Kiri & Kanan -->
        <g class="paw-left-group">
          <path d="M 55 64 C 55 102, 62 138, 80 138 C 94 138, 95 112, 91 84" fill="#10b981" stroke="#3b2322" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="72" y1="126" x2="72" y2="138" stroke="#3b2322" stroke-width="3" stroke-linecap="round"/>
          <line x1="84" y1="126" x2="84" y2="138" stroke="#3b2322" stroke-width="3" stroke-linecap="round"/>
        </g>
        <g class="paw-right-group">
          <path d="M 145 64 C 145 102, 138 138, 120 138 C 106 138, 105 112, 109 84" fill="#10b981" stroke="#3b2322" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="128" y1="126" x2="128" y2="138" stroke="#3b2322" stroke-width="3" stroke-linecap="round"/>
          <line x1="116" y1="126" x2="116" y2="138" stroke="#3b2322" stroke-width="3" stroke-linecap="round"/>
        </g>
      </svg>
    `,

    // 3. SVG Ekor Naga dengan Nyala Api Bara (ViewBox: 0 0 120 150)
    tailSvg: `
      <svg class="svg-full" viewBox="0 0 120 150" fill="none">
        <!-- Ekor Hijau Melengkung ke Belakang Kanan -->
        <path
          d="M 98 112 C 46 112, 22 76, 40 46 C 52 26, 78 30, 84 56 C 88 74, 70 82, 60 70"
          fill="#10b981"
          stroke="#3b2322"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- Nyala Api di Ujung Ekor Naga -->
        <path d="M 40 46 C 24 30, 28 8, 48 4 C 54 22, 62 26, 40 46 Z" fill="#ef4444"/>
        <path d="M 42 38 C 30 26, 34 14, 48 10 C 52 22, 56 24, 42 38 Z" fill="#f97316"/>
        <circle cx="44" cy="22" r="6" fill="#fde047"/>
      </svg>
    `
  },

  // Percakapan & Respon Spesifik Karakter Naga Ryuu
  dialogues: {
    greetings: [
      "Rawr! Aku Ryuu, naga api mungil penjaga semangatmu! 🔥✨",
      "Halo sahabatku! Hari ini ayo berpetualang dan koding bareng Ryuu! 🐲"
    ],
    idle: [
      "Hembusan nafasku hangat lho! Mau kupanggangkan jagung atau marshmallow? 🌽🔥",
      "Sayap mungilku sudah siap mengepak mengantarmu ke puncak kesuksesan! 🚀✨",
      "Percikan api di ekorku bergoyang gembira melihat kamu tersenyum! 🔥💖"
    ],
    feed: [
      "Nyam nyam! Daging panggang lezat sekali! Apinya berkobar puas~ 🍖🔥",
      "Kenyang dan bertenaga! Nafas apiku makin membara sekarang! 🐉💨"
    ],
    sleep: [
      "Zzz... sayapku melipat hangat... istirahat dulu ya manusia baik~ 💤🐲",
      "Mimpi indah menjaga gua harta karun bersama Ryuu... Zzz~ 💤✨"
    ]
  }
};
