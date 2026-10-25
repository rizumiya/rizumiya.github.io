/**
 * Mochi Pocket — script.js
 * 
 * Kode telah dimodularisasi ke dalam folder js/ agar rapi dan mudah dirawat:
 * - js/config.js       : Konstanta, order wujud/latar, metadata, IS_DEV_MODE, helper
 * - js/db.js           : PetDatabase (IndexedDB + localStorage fallback)
 * - js/elements.js     : Referensi DOM & variabel runtime state
 * - js/dialogue.js     : Sistem dialog, petSpeech(), balon tips, & percakapan
 * - js/dashboard.js    : Rendering HUD, status gauges, latar dinamis (hujan petir, taman bertingkat)
 * - js/interactions.js : Hover kaget, klik marah, elusan partikel cinta, pelacakan mata kursor
 * - js/forms.js        : Transformasi wujud & runtime Live2D
 * - js/tamagotchi.js   : Aksi makan, tidur, & siklus loop tamagotchi
 * - js/minigames.js    : Drawer pemilih & 3 engine mini-game (Koin Hoki, Tangkap Makan, Sundul Bola)
 * - js/controls.js     : Kontrol tombol GameBoy, modal panduan/karakter/pengaturan, keyboard, & dev mode lokal
 * - js/app.js          : Entry point inisialisasi aplikasi
 */
