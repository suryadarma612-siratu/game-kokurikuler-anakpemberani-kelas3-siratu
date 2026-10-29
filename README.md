# Petualangan Anak Pemberani dan Berintegritas

Game edukasi 2D untuk siswa kelas 3 SD (Pendidikan Antikorupsi: keberanian, kemandirian, kejujuran).

## Cara menjalankan
1. Simpan `index.html`, `style.css`, dan `script.js` dalam **satu folder**.
2. Klik dua kali `index.html` (atau buka di Chrome/Edge/Firefox/Safari di komputer atau HP Android).
3. Tidak perlu server, internet, maupun file suara (musik dan efek dibuat langsung oleh browser).
4. Browser baru membunyikan suara setelah layar disentuh/diklik pertama kali. Musik dan efek suara bisa dimatikan lewat tombol 🎵 dan 🔔 di pojok kanan atas.

## Cara bermain (siswa)
1. Masuk dengan **nama dan kelas**.
2. Pilih **Mulai Petualangan**, lalu pilih level. Level berikutnya terbuka setelah nilai 60 ke atas.
3. Jalan ke kanan (tombol ◀ ▶ dan LONCAT di layar; di komputer pakai panah dan spasi).
4. Baca cerita, **tulis jawaban sendiri**, tekan KIRIM JAWABAN.
5. Setiap level: **3 nyawa ❤️** dan **batas waktu ⏱**. Nilai di bawah 60 atau waktu habis mengurangi 1 nyawa. Jika nyawa habis, siswa bisa mengulang level itu (tanpa hukuman lain).
6. Bintang: 90-100 = 3, 75-89 = 2, 60-74 = 1.

## Fitur
- Login nama dan kelas (data tiap siswa tersimpan terpisah)
- Papan skor (urut skor, lalu bintang, lalu waktu tercepat; bisa disaring per kelas)
- Musik latar + efek suara (bisa dimatikan)
- Nyawa dan waktu per level
- 10 level dengan jawaban tertulis, penilaian rubrik 40/30/20/10, petunjuk 3 tahap, dan perbaikan jawaban

## Cara guru meninjau jawaban
1. Di halaman login, tekan **Panel Guru** (atau di menu lewat Ganti Pemain, lalu Panel Guru).
2. Masukkan PIN (bawaan: **1234**; segera ganti lewat "Ganti PIN guru").
3. Buka nama siswa untuk melihat jawaban tiap level, nilai otomatis, dan jumlah percobaan.
4. Isi **Nilai guru** (0-100) dan catatan, lalu Simpan. Nilai guru menggantikan nilai otomatis (termasuk untuk papan skor dan pembukaan level).
5. Tombol **Unduh CSV** menghasilkan file nilai yang bisa dibuka di Excel/Spreadsheet.

## Catatan penting
- Penilaian otomatis berbasis kata kunci dan **tidak memahami makna jawaban secara sempurna**. Jawaban dengan kata yang berbeda tetap bisa benar, karena itu tersedia peninjauan guru.
- Semua data (nilai, jawaban, papan skor) tersimpan di **localStorage browser pada perangkat yang dipakai**. Papan skor tidak otomatis menggabungkan perangkat berbeda. Untuk satu kelas, sebaiknya gunakan satu komputer/laptop yang sama, atau unduh CSV dari tiap perangkat.
- Menghapus data browser/situs akan menghapus nilai. Unduh CSV secara berkala.
- Kata kunci dan rubrik tiap level ada di `script.js` pada bagian `LEVELS` (`rubric`), mudah ditambah atau diubah.
