# Glyph Forge — Puzzle Kode

Glyph Forge adalah game puzzle browser untuk menyusun lambang dari empat bentuk SVG tinggi yang digambar langsung dengan kode dan ditumpuk pada koordinat yang sama.

## Cara bermain

- Ingat lambang target yang terbentuk saat empat bentuk tinggi bertumpuk. Setiap bentuk memiliki garis di beberapa bagian lambang dan hampir membentang dari atas ke bawah.
- Pilih satu dari empat objek pada deretan rakitan. Mulai dengan empat bentuk pilihan per objek; jumlahnya naik satu setiap dua level sampai maksimal sepuluh pilihan pada level 13. Hanya bentuk yang sedang dipakai yang terlihat. Gunakan tombol ↑ / ↓ pada kartu objek atau tombol panah keyboard untuk berganti bentuk.
- Klik kartu objek untuk memilihnya. Pemain baru dapat langsung memakai tombol ↑ / ↓ yang terlihat di samping setiap kartu; dengan keyboard, gunakan **kiri / kanan** untuk berpindah objek dan **atas / bawah** untuk berganti bentuk.
- Yang dinilai adalah gambar akhir dari tumpukan. Garis yang sama boleh berasal dari objek atau pilihan berbeda; susunan yang terlihat sama dengan target tetap dihitung menang.
- Objek aktif disorot kuning di depan tumpukan; perbandingan kecocokan mengabaikan perbedaan tipis antialias pada garis yang bertumpuk.
- Segitiga di target dibagi antara objek 2 dan 3, lalu disamarkan di dalam bentuk panjang yang memiliki garis lain. Objek 1 tetap memiliki pilihan segitiga utuh sebagai pengecoh; garis utuh itu bukan bagian target.
- Petunjuk menyorot bentuk satu objek pada target dengan biaya 60 poin, tetapi tidak memilihkan bentuk itu untukmu.
- Stopwatch menghitung durasi level dan berhenti setelah puzzle selesai. Durasi penyelesaian ditampilkan bersama hasilnya; skor memberi bonus untuk penyelesaian lebih cepat.
- Setelah level selesai, hasil dan tombol **Lanjut ke level berikutnya** akan ditampilkan. Level berikutnya baru dimulai setelah tombol ditekan.
- Kamu bisa mengulang level kapan saja tanpa batas waktu.

Semua simbol dibuat dari SVG dan kode—game tidak memerlukan aset gambar ataupun proses build. Skor terbaik tersimpan di browser.

## File

- `index.html` — struktur game dan kontrol aksesibel
- `style.css` — tampilan responsif
- `script.js` — komponen SVG, generator puzzle, skor, dan input
