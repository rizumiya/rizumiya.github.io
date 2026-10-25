/**
 * Mochi Pocket SDK — Template Latar Belakang (Scene) Kustom
 * Format: ES Module / JavaScript Object
 *
 * Panduan Penggunaan:
 * 1. Salin berkas ini dan ubah gaya gradien latar serta ornamen dekorasi di bawah.
 * 2. Unggah berkas melalui menu "🎨 Studio Mod" di Mochi Pocket.
 */

export default {
  // ID unik latar (huruf kecil, angka, dan garis bawah)
  id: "custom_neon_cyber",

  // Nama tampilan latar
  name: "Kota Cyber Neon",

  // Ikon emoji latar
  icon: "🏙️",

  // Level minimum pembuka latar (1 = langsung terbuka)
  unlockLevel: 1,

  // Gaya Gradien Latar Belakang CSS (Langit atas s/d tanah bawah)
  backgroundCSS: `
    radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.4) 0%, transparent 60%),
    linear-gradient(180deg, #090d16 0%, #1e1035 62%, #38124d 62%, #1a0826 100%)
  `,

  // Efek ambient / warna cahaya tematik
  ambientColor: "rgba(192, 132, 252, 0.18)",

  // Daftar Ornamen Dekorasi di Latar Belakang
  decorations: [
    {
      id: "cyber_moon",
      emoji: "🌕",
      style: "position: absolute; top: 32px; right: 28px; font-size: 2.2rem; filter: drop-shadow(0 0 12px #c084fc);"
    },
    {
      id: "neon_tower",
      emoji: "🗼",
      style: "position: absolute; bottom: 36%; left: 18px; font-size: 2.8rem; filter: drop-shadow(0 0 8px #f43f5e);"
    },
    {
      id: "cyber_car",
      emoji: "🛸",
      style: "position: absolute; top: 72px; left: 24%; font-size: 1.4rem; animation: floatUfo 4s ease-in-out infinite alternate;"
    }
  ],

  // Percakapan Suasana saat Karakter Berada di Latar Ini
  dialogues: [
    "Cahaya neon ungu di latar ini keren banget ya! Seperti di masa depan! 🏙️✨",
    "Gedung pencakar langit di belakang sana tinggi sekali~ 🗼",
    "Suasana malam kota yang tenang... nyaman sekali bersamamu~ 🌌"
  ]
};
