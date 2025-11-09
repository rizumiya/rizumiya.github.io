# Permainan Tebak-tebakan

Permainan tebak kata interaktif yang menantang pemain untuk menebak kata berdasarkan kategori dan level kesulitan yang dipilih. Permainan ini menyediakan fitur hint dan sistem penilaian yang bervariasi berdasarkan level dan jumlah hint yang digunakan.

## 🎯 Fitur Utama

- **Pemilihan Kategori**: Pemain dapat memilih dari berbagai kategori seperti hewan, buah, kota, dan profesi
- **Tiga Level Kesulitan**: Mudah, sedang, dan sulit dengan aturan permainan yang berbeda
- **Sistem Hint**: Petunjuk unik dan menarik tentang objek yang harus ditebak
- **Mekanisme Permainan**: Kotak-kotak untuk menampilkan huruf dan sistem kesalahan dengan tanda X
- **Sistem Penilaian**: Skor bervariasi berdasarkan level kesulitan dan jumlah hint yang digunakan
- **Enkripsi Data**: Database soal dienkripsi menggunakan Caesar cipher

## 🎮 Cara Bermain

1. **Pendaftaran**: Masukkan nama Anda untuk mulai bermain
2. **Pemilihan**: Pilih kategori dan level kesulitan
3. **Permainan**: 
   - Tebak huruf satu per satu untuk membuka huruf dalam kata
   - Gunakan fitur hint untuk mendapatkan petunjuk (akan mengurangi skor)
   - Jumlah maksimal kesalahan berdasarkan jumlah huruf dalam kata
   - Perbedaan level:
     - *Mudah*: Hewan yang familiar (contoh: GAJAH, KERBAU, PANDA)
     - *Sedang*: Hewan yang lumayan dikenal (contoh: GURITA, YUSU, SELAKA)
     - *Sulit*: Hewan langka/unik (contoh: BELUGA, DUGONG, HIU, KOMODO)
4. **Penilaian**: Skor dihitung berdasarkan level dan jumlah hint yang digunakan
5. **Lanjutkan**: Pilih untuk memainkan kembali atau ganti kategori dan level

## 📊 Sistem Penilaian

### Level Kesulitan:
- **Mudah**: Maksimal kesalahan = jumlah huruf dalam kata
  - Maksimal poin tanpa hint: 5
  - Pengurangan poin per hint: 1
- **Sedang**: Maksimal kesalahan = jumlah huruf dalam kata
  - Maksimal poin tanpa hint: 10
  - Pengurangan poin per hint: 3
- **Sulit**: Maksimal kesalahan = jumlah huruf dalam kata
  - Maksimal poin tanpa hint: 15
  - Pengurangan poin per hint: 5

## 🔐 Sistem Enkripsi

Database soal disimpan dalam format JSON yang dienkripsi menggunakan Caesar cipher dengan shift 3. Setiap kata dan keterangan dienkripsi untuk meningkatkan keamanan dan menyembunyikan informasi dari pemain.

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur halaman web
- **CSS3**: Styling dan tampilan responsif
- **JavaScript ES6+**: Logika permainan dan manipulasi DOM
- **JSON**: Format database soal
- **Caesar Cipher**: Metode enkripsi sederhana

## 📁 Struktur Proyek

```
guessing-game/
├── index.html          # Halaman utama permainan
├── style.css           # Gaya dan tampilan permainan
├── script.js           # Logika permainan dan interaktivitas
├── questions.json      # Database soal terenkripsi
└── README.md           # Dokumentasi proyek
```

## 🎨 Desain Antarmuka

- Desain responsif yang dapat diakses dari berbagai perangkat
- Warna yang kontras dan mudah dibaca
- Animasi transisi untuk pengalaman bermain yang lebih menyenangkan
- Tampilan yang jelas untuk status permainan, skor, dan hint

## 📈 Progress dan Skor

- Skor total akumulatif dari semua permainan
- Opsi untuk mereset skor kapan saja
- Tampilan skor permainan dan total di semua halaman

## 🔄 Pengembangan Lanjutan

- Penambahan lebih banyak kategori dan soal
- Implementasi sistem leaderboard
- Peningkatan enkripsi dan keamanan data
- Penambahan efek suara dan visual
- Mode multiplayer sederhana