# 🎨 Mochi Pocket Modding SDK Guide

Selamat datang di **Mochi Pocket SDK**! Panduan ini menjelaskan cara membuat karakter (*Pet*) dan latar belakang (*Scene*) buatanmu sendiri melalui koding, lalu mengimpornya langsung ke dalam Mochi Pocket tanpa me-reload aplikasi.

---

## 📁 Struktur Berkas Template
Di dalam folder ini terdapat dua berkas template utama:
1. `custom-pet-template.js`: Template untuk membuat karakter peliharaan baru.
2. `custom-scene-template.js`: Template untuk mendesain dunia / latar belakang baru.

---

## 🐱 1. Membuat Karakter Kustom (`custom-pet-template.js`)

Karakter diekspor sebagai objek JavaScript dengan spesifikasi berikut:

```javascript
export default {
  id: "custom_nama_karakter",   // Wajib: ID unik huruf kecil tanpa spasi
  name: "Nama Karakter",         // Wajib: Nama yang ditampilkan di layar
  author: "Nama Kamu",           // Nama kreator
  version: "1.0.0",              // Versi mod
  tag: "🐱 NAMA",                // Ikon & nama pendek pada bezel konsol
  icon: "🐱",                    // Emoji utama karakter
  unlockLevel: 1,                // Level minimal untuk menggunakan karakter ini

  // Bagian Anatomi SVG (Opsional jika ingin menggambar tubuh sendiri)
  anatomy: {
    headSvg: `<svg viewBox="0 0 264 205">...</svg>`,   // Bentuk kepala, mata, telinga
    bodySvg: `<svg viewBox="0 0 200 145">...</svg>`,   // Bentuk badan & kaki duduk
    tailSvg: `<svg viewBox="0 0 120 150">...</svg>`    // Bentuk ekor
  },

  // Kumpulan dialog khusus karakter saat berinteraksi
  dialogues: {
    greetings: ["Halo! Senang bertemu denganmu~ ✨"],
    idle: ["Aku suka menemanimu! 💕"],
    feed: ["Nyam nyam! Enak banget! 🍙"],
    sleep: ["Zzz... istirahat dulu ya~ 💤"]
  }
};
```

---

## 🏙️ 2. Membuat Latar Kustom (`custom-scene-template.js`)

Latar panggung karakter dapat dibuat menggunakan gradien CSS dan ornamen emoji/SVG:

```javascript
export default {
  id: "custom_nama_latar",
  name: "Nama Latar Panggung",
  icon: "🏙️",
  unlockLevel: 1,
  
  // Gradien CSS untuk langit dan lantai
  backgroundCSS: `
    radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.4) 0%, transparent 60%),
    linear-gradient(180deg, #090d16 0%, #1e1035 62%, #38124d 62%, #1a0826 100%)
  `,

  // Dekorasi ornamen (posisi dan emoji)
  decorations: [
    {
      id: "moon",
      emoji: "🌕",
      style: "position: absolute; top: 32px; right: 28px; font-size: 2.2rem;"
    }
  ],

  dialogues: [
    "Pemandangan di sini indah sekali ya! ✨"
  ]
};
```

---

## 🚀 3. Cara Mengimpor ke Mochi Pocket
1. Buka Mochi Pocket di web browser atau di ekstensi browser.
2. Buka menu **Pengaturan Konsol (START)** $\rightarrow$ pilih tab **🎨 Studio Mod**.
3. Klik tombol **"Pilih Berkas Mod (.js / .json)"** dan pilih berkas yang sudah kamu edit.
4. Karakter atau latar barumu akan langsung muncul dan tersimpan secara otomatis di perambanmu!
