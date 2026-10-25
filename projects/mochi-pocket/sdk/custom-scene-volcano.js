/**
 * Mochi Pocket SDK — Latar Belakang Kustom Contoh: Pulau Vulkano (Volcano Isle)
 * Format: ES Module / JavaScript Object
 *
 * Panduan Penggunaan:
 * 1. Berkas ini siap langsung diunggah melalui tombol "Unggah & Pasang Mod" di menu Pengaturan Mochi Pocket!
 * 2. Anda bisa mengubah warna gradien magma, menambah pohon, atau dekorasi bebatuan sesuka hati.
 */

export default {
  // ID unik latar (huruf kecil, angka, garis bawah)
  id: "custom_volcano_island",

  // Nama tampilan latar
  name: "Pulau Vulkano",

  // Ikon emoji latar
  icon: "🌋",

  // Level minimum pembuka latar (1 = langsung terbuka)
  unlockLevel: 1,

  // Gaya Gradien Latar Belakang CSS:
  // Langit senja merah tembaga membara di atas + kawah magma oranye menyala + tanah batuan basaltik hitam di bawah
  backgroundCSS: `
    radial-gradient(circle at 50% 32%, rgba(249, 115, 22, 0.42) 0%, transparent 68%),
    radial-gradient(circle at 18% 78%, rgba(239, 68, 68, 0.35) 0%, transparent 50%),
    radial-gradient(circle at 82% 78%, rgba(239, 68, 68, 0.35) 0%, transparent 50%),
    linear-gradient(180deg, #18090a 0%, #3b1114 42%, #6c230e 62%, #451508 62%, #1a0804 100%)
  `,

  // Efek ambient tematik (cahaya hangat magma)
  ambientColor: "rgba(249, 115, 22, 0.24)",

  // Daftar Ornamen Dekorasi di Latar Belakang (Gunung Berapi, Kawah Lahar, Pohon Tropis & Pinus, Bara Api)
  decorations: [
    // 1. Gunung Berapi Megah di Kejauhan dengan Asap Vulkanik
    {
      id: "distant_volcano",
      emoji: "🌋",
      style: "position: absolute; bottom: 35%; left: 50%; transform: translateX(-50%); font-size: 3.8rem; filter: drop-shadow(0 0 16px rgba(249, 115, 22, 0.7)); z-index: 1;"
    },
    // 2. Kepulan Asap Abu Vulkanik di Atas Kawah
    {
      id: "volcano_smoke",
      emoji: "☁️",
      style: "position: absolute; top: 38px; left: 47%; font-size: 1.8rem; opacity: 0.65; filter: blur(1px) drop-shadow(0 2px 8px rgba(0,0,0,0.5)); animation: smokeRise 5s ease-in-out infinite alternate; z-index: 1;"
    },
    // 3. Pohon Palem Tropis di Lereng Kiri (Tahan Panas)
    {
      id: "tropical_palm_left",
      emoji: "🌴",
      style: "position: absolute; bottom: 34%; left: 14px; font-size: 2.4rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6)); z-index: 2;"
    },
    // 4. Pohon Pinus Hijau di Lereng Kanan
    {
      id: "pine_tree_right",
      emoji: "🌲",
      style: "position: absolute; bottom: 34%; right: 18px; font-size: 2.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6)); z-index: 2;"
    },
    // 5. Pohon Kecil Kedua di Samping Kiri Kawah
    {
      id: "small_tree_left",
      emoji: "🌳",
      style: "position: absolute; bottom: 36%; left: 24%; font-size: 1.6rem; opacity: 0.9; z-index: 1;"
    },
    // 6. Percikan Bara Api Melayang di Udara Kiri
    {
      id: "fire_spark_left",
      emoji: "🔥",
      style: "position: absolute; top: 88px; left: 20%; font-size: 1.1rem; filter: drop-shadow(0 0 8px #f59e0b); animation: emberFloatLeft 3.6s ease-in-out infinite alternate; z-index: 3;"
    },
    // 7. Percikan Bara Api Melayang di Udara Kanan
    {
      id: "fire_spark_right",
      emoji: "✨",
      style: "position: absolute; top: 110px; right: 22%; font-size: 1.2rem; filter: drop-shadow(0 0 10px #ef4444); animation: emberFloatRight 4.2s ease-in-out infinite alternate; z-index: 3;"
    },
    // 8. Batuan Basaltik Lava di Sudut Bawah
    {
      id: "basalt_rock_left",
      emoji: "🪨",
      style: "position: absolute; bottom: 12px; left: 22px; font-size: 1.5rem; opacity: 0.85; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8)); z-index: 2;"
    },
    {
      id: "basalt_rock_right",
      emoji: "🪨",
      style: "position: absolute; bottom: 14px; right: 28px; font-size: 1.4rem; opacity: 0.85; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8)); z-index: 2;"
    }
  ],

  // Percakapan Tematik Karakter saat Berada di Gunung Berapi
  dialogues: [
    "Wah, udara di Pulau Vulkano ini hangat dan penuh energi! Laharnya berkilauan di kejauhan! 🌋🔥",
    "Lihat pohon-pohon palem dan pinus di lereng itu! Tetap tegak berdiri meski di samping kawah lahar! 🌴🌲",
    "Percikan bara api keemasan beterbangan seperti kembang api alami! Indah sekali ya~ ✨🔥",
    "Kawah gunung berapi di belakang sana megah sekali... Suasana yang sangat membakar semangat! 🌋💪"
  ]
};
