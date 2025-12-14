# Permainan Tebak Angka

Permainan tebak angka interaktif berbasis web di mana pemain harus menebak angka 4 digit rahasia. Permainan ini menggunakan mekanisme klasik serupa Bulls and Cows, tetapi dengan penamaan yang berbeda: A | P (Angka benar di Posisi benar) dan A | S (Angka benar di posisi Salah).

## 🎯 Cara Bermain

1. **Pendaftaran**: Masukkan nama Anda untuk mulai bermain
2. **Tebak Angka**: Masukkan tebakan 4 digit unik (tanpa angka duplikat)
3. **Umpan Balik**:
   - **A**: Jumlah angka yang benar (tidak peduli posisi)
   - **P**: Jumlah posisi yang benar (angka di posisi yang benar)
4. **Contoh**: Jika angka rahasia adalah 1234 dan tebakan Anda adalah 1354, maka hasilnya adalah 3 A dan 2 P
   - A: Ada 3 angka yang benar yaitu 1, 3, dan 4
   - P: Ada 2 posisi yang benar yaitu angka 1 dan 4
5. **Tujuan**: Tebak angka rahasia dalam maksimal 10 percobaan

## 🎮 Fitur Utama

- **Sistem Tebakan Interaktif**: Masukkan tebakan Anda dan lihat umpan balik secara instan
- **Riwayat Tebakan**: Lacak semua tebakan Anda beserta hasil posisi angka yang benar dan salah
- **Validasi Input**: Sistem validasi canggih untuk memastikan tebakan sesuai aturan
- **Tampilan Responsif**: Dapat dimainkan di berbagai perangkat
- **Statistik Percobaan**: Lacak jumlah percobaan yang telah Anda gunakan
- **Mode Main Lagi**: Mulai permainan baru tanpa harus me-refresh halaman

## 🔢 Aturan Permainan

- Angka rahasia terdiri dari 4 digit unik (0-9) tanpa duplikasi
- Player harus menebak angka tersebut dalam maksimal 10 percobaan
- Setiap tebakan juga harus 4 digit unik tanpa duplikasi
- Umpan balik diberikan untuk setiap tebakan:
  - A: Jumlah digit yang benar (tanpa memperhatikan posisi)
  - P: Jumlah posisi yang benar (digit yang berada di posisi yang benar)

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur halaman web
- **CSS3**: Styling dan tampilan responsif dengan tema gelap
- **JavaScript ES6+**: Logika permainan dan manipulasi DOM
- **LocalStorage**: Menyimpan informasi pemain dan preferensi

## 📁 Struktur Proyek

```
number-guessing/
├── index.html          # Halaman utama permainan
├── style.css           # Gaya dan tampilan permainan
├── script.js           # Logika permainan dan interaktivitas
└── README.md           # Dokumentasi proyek
```

## 🎨 Desain Antarmuka

- Desain responsif yang dapat diakses dari berbagai perangkat
- Tema gelap yang nyaman untuk mata
- Animasi transisi untuk pengalaman bermain yang lebih menyenangkan
- Tampilan yang jelas untuk status permainan, tebakan, dan umpan balik
- Sistem penyorotan untuk elemen penting seperti posisi angka yang benar dan salah

## 🚀 Cara Menjalankan

1. Clone repositori ini atau unduh file ZIP
2. Buka file `index.html` di browser Anda
3. Masukkan nama Anda dan mulai bermain!

## 📈 Strategi Menang

- Gunakan tebakan pertama untuk mengidentifikasi digit yang ada
- Fokus pada tebakan berikutnya berdasarkan umpan balik posisi angka yang benar dan salah
- Jaga catatan mental atau tulis kemungkinan kombinasi
- Eliminasi kemungkinan secara sistematis berdasarkan umpan balik

## 🔄 Pengembangan Lanjutan

- Penambahan tingkat kesulitan (angka 5-6 digit)
- Implementasi sistem leaderboard
- Penambahan statistik permainan (rata-rata tebakan, waktu bermain)
- Mode kompetitif antar pemain
- Pemilihan bahasa (Indonesia/Inggris)
- Animasi dan efek suara untuk pengalaman bermain yang lebih imersif