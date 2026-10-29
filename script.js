/* =====================================================================
   PETUALANGAN ANAK PEMBERANI DAN BERINTEGRITAS
   Game edukasi 2D untuk siswa kelas 3 SD (HTML5 + CSS3 + JavaScript)
   Bagian kode:
   1. Konstanta & data level      5. Penyimpanan (localStorage)
   2. Audio (musik & efek suara)  6. Layar, login, peta, nilai, panel guru
   3. Penilaian jawaban           7. Mesin permainan (canvas, nyawa, waktu)
   4. Menggambar karakter & latar 8. Inisialisasi
   ===================================================================== */
'use strict';

/* ---------- 1. KONSTANTA & DATA LEVEL ---------- */
const STORE_KEY = 'petualangan_anak_berani_v2';
const PIN_DEFAULT = '1234';
const PASS_SCORE = 60;       // nilai minimal untuk membuka level berikutnya
const LIVES_MAX = 3;         // nyawa per level
const W = 900, H = 450;      // ukuran kanvas (logis)
const GROUND = 365;          // garis tanah
const WORLD = 1500;          // lebar dunia permainan

// Kata penghubung yang menandakan siswa menuliskan alasan
const CONNECTORS = ['karena', 'agar', 'supaya', 'sebab', 'biar', 'soalnya', 'sehingga', 'dengan begitu', 'jadi'];
// Kata yang menunjukkan tindakan tidak aman / tidak sopan (diperiksa dengan pengecekan kata "tidak/jangan")
const BAD_WORDS = ['pukul', 'hajar', 'tendang', 'ejek', 'hina', 'bodoh', 'balas dendam', 'tonjok', 'dorong', 'melawan', 'bohong', 'menyembunyikan', 'sembunyikan', 'menyalahkan', 'marah marah', 'bentak'];

const LEVELS = [
  {
    id: 1, title: 'Berani Menjaga Kebersihan', place: 'Trotoar sekolah', theme: 'sidewalk', avatar: 'Niko', time: 240,
    story: 'Niko berjalan di trotoar dekat sekolah. Tiba-tiba ia melihat Miko membuang bungkus jajan dan botol plastik sembarangan. Padahal tempat sampah ada di dekatnya.',
    question: 'Apa yang akan kamu lakukan jika melihat teman membuang sampah sembarangan? Tuliskan tindakan dan alasanmu!',
    hint: 'Pikirkan: bagaimana cara menegur teman dengan sopan? Lalu, mengapa sampah harus dibuang di tempat sampah?',
    starter: 'Saya akan ... Miko dengan sopan agar ... karena ...',
    value: 'Peduli lingkungan, berani menegur dengan sopan, dan bertanggung jawab.',
    example: 'Saya akan menasihati Miko dengan sopan agar membuang sampah di tempat sampah. Sampah yang dibuang sembarangan membuat lingkungan kotor.',
    rubric: {
      action: { need: 1, groups: [['nasihat', 'tegur', 'ingatkan', 'bilang', 'katakan', 'minta', 'ajak', 'beritahu', 'memungut', 'pungut', 'ambil sampah', 'tempat sampah', 'buang sampah']] },
      reason: ['bersih', 'kotor', 'sehat', 'banjir', 'penyakit', 'lingkungan', 'indah', 'rapi', 'nyaman', 'bau', 'kuman', 'tanggung jawab'],
      safe: ['sopan', 'baik baik', 'dengan baik', 'tolong', 'ramah', 'pelan', 'lembut', 'ajak', 'minta', 'nasihat', 'ingatkan', 'maaf'],
      minWords: 8
    },
    scene: { trigger: 1120, npcs: [{ name: 'Miko', x: 1290, color: '#ff922b', hair: '#3b2a1a', kind: 'trash', bubble: '😛' }], props: [{ e: '🥤', x: 1340, s: 28 }, { e: '🍬', x: 1370, s: 24 }, { e: '🗑️', x: 1450, s: 52 }, { e: '🌳', x: 300, s: 110 }, { e: '🌳', x: 800, s: 110 }] }
  },
  {
    id: 2, title: 'Berani Melerai dengan Aman', place: 'Taman bermain', theme: 'park', avatar: 'Luki', time: 240,
    story: 'Luki berjalan-jalan di taman. Ia melihat Jay dan Ari sedang bertengkar. Mereka saling berteriak dan hampir berkelahi.',
    question: 'Apa yang sebaiknya dilakukan Luki ketika melihat Jay dan Ari bertengkar? Tuliskan cara menyelesaikan masalah tanpa kekerasan!',
    hint: 'Ingat, keselamatan nomor satu. Siapa yang bisa Luki panggil jika pertengkarannya berbahaya? Jika aman, bagaimana cara menenangkan mereka?',
    starter: 'Luki sebaiknya ... karena ...',
    value: 'Berani, peduli, cinta damai, dan mengutamakan keselamatan.',
    example: 'Luki sebaiknya meminta bantuan orang dewasa jika pertengkaran membahayakan. Jika aman, Luki dapat menenangkan mereka dan mengajak berbicara dengan baik.',
    rubric: {
      action: { need: 1, groups: [['bantuan', 'orang dewasa', 'guru', 'bapak', 'ibu', 'satpam', 'panggil', 'lapor', 'pisah', 'leraikan', 'melerai', 'tenang', 'bicara', 'berbicara', 'damai', 'baikan', 'berdamai', 'ajak']] },
      reason: ['bahaya', 'terluka', 'luka', 'sakit', 'aman', 'selamat', 'damai', 'baikan', 'kekerasan', 'teman', 'tidak boleh berkelahi', 'rukun'],
      safe: ['aman', 'orang dewasa', 'guru', 'tenang', 'bicara', 'damai', 'minta bantuan', 'lapor', 'baik baik', 'dengan baik'],
      minWords: 8
    },
    scene: { trigger: 1050, npcs: [{ name: 'Jay', x: 1260, color: '#e03131', hair: '#1b1b1b', kind: 'fight', face: 1, bubble: '💢' }, { name: 'Ari', x: 1340, color: '#7048e8', hair: '#3b2a1a', kind: 'fight', face: -1, seed: 2 }], props: [{ e: '🌳', x: 250, s: 120 }, { e: '🌼', x: 600, s: 30 }, { e: '🌳', x: 900, s: 120 }, { e: '🌷', x: 1100, s: 30 }] }
  },
  {
    id: 3, title: 'Berani Menghibur Teman', place: 'Halaman sekolah', theme: 'schoolyard', avatar: 'Niko', time: 240,
    story: 'Di halaman sekolah, Gina menangis. Ia mendapat nilai jelek pada ulangan Bahasa Indonesia dan harus mengikuti ulangan ulang. Seorang temannya sudah duduk menemaninya.',
    question: 'Jika Gina adalah temanmu, apa yang akan kamu katakan dan lakukan untuk membantunya?',
    hint: 'Apa kata-kata yang membuat Gina merasa lebih baik? Bagaimana kamu bisa membantunya belajar untuk ulangan ulang?',
    starter: 'Saya akan berkata kepada Gina ... Saya juga akan ... agar ...',
    value: 'Empati, kepedulian, persahabatan, dan semangat belajar.',
    example: 'Saya akan menghibur Gina, menyemangatinya agar tidak menyerah, dan mengajaknya belajar bersama untuk persiapan ulangan ulang.',
    rubric: {
      action: { need: 1, groups: [['hibur', 'semangat', 'tenangkan', 'peluk', 'temani', 'belajar bersama', 'ajak belajar', 'bantu belajar', 'ajari', 'mengajari', 'jangan sedih', 'jangan menyerah', 'bantu']] },
      reason: ['sedih', 'sahabat', 'teman', 'peduli', 'menyerah', 'bisa', 'nilai', 'lebih baik', 'ulangan', 'empati', 'senang', 'semangat', 'berhasil'],
      safe: ['baik', 'sopan', 'lembut', 'ramah', 'tolong', 'bersama', 'semangat', 'jangan sedih', 'hibur', 'temani', 'ajak'],
      minWords: 8
    },
    scene: { trigger: 1050, npcs: [{ name: 'Gina', x: 1280, color: '#f06595', hair: '#2b1b0e', girl: true, kind: 'cry', bubble: '😢' }, { name: 'Sari', x: 1350, color: '#fcc419', hair: '#5c3b1e', girl: true, kind: 'comfort', face: -1 }], props: [{ e: '📝', x: 1220, s: 30 }, { e: '🌳', x: 300, s: 120 }, { e: '⚽', x: 700, s: 26 }] }
  },
  {
    id: 4, title: 'Berani Bertanya kepada Guru', place: 'Ruang kelas', theme: 'classroom', avatar: 'Niko', time: 240,
    story: 'Di dalam kelas, Guru sedang menjelaskan pelajaran di papan tulis. Niko belum memahami materinya, tetapi ia merasa malu untuk bertanya.',
    question: 'Apa yang sebaiknya dilakukan Niko jika belum memahami pelajaran? Mengapa?',
    hint: 'Apa yang boleh dilakukan murid jika belum paham? Bagaimana caranya supaya sopan?',
    starter: 'Niko sebaiknya ... karena ...',
    value: 'Percaya diri, rasa ingin tahu, dan keberanian belajar.',
    example: 'Niko sebaiknya bertanya kepada guru dengan sopan karena bertanya dapat membantu memahami pelajaran.',
    rubric: {
      action: { need: 1, groups: [['bertanya', 'tanya', 'angkat tangan', 'mengangkat tangan', 'minta penjelasan', 'minta diulang', 'menjelaskan lagi', 'menanyakan']] },
      reason: ['paham', 'mengerti', 'tahu', 'belajar', 'pintar', 'jelas', 'tidak malu', 'berani', 'bisa', 'pelajaran'],
      safe: ['sopan', 'izin', 'permisi', 'angkat tangan', 'dengan baik', 'guru', 'dipersilakan', 'tunggu', 'baik baik'],
      minWords: 7
    },
    scene: { trigger: 1000, npcs: [{ name: 'Guru', x: 1330, color: '#8d6e63', hair: '#3b2a1a', adult: true, kind: 'idle', glasses: true, bubble: '📖' }], props: [] }
  },
  {
    id: 5, title: 'Berani Menjawab Pertanyaan', place: 'Ruang kelas', theme: 'classroom', avatar: 'Niko', time: 240,
    story: 'Guru mengajukan sebuah pertanyaan kepada seluruh kelas. Niko tahu jawabannya, tetapi teman-temannya masih diam.',
    question: 'Apa yang sebaiknya dilakukan Niko jika mengetahui jawaban dari pertanyaan guru?',
    hint: 'Bagaimana caranya menjawab dengan sopan di kelas? Perasaan apa yang perlu Niko miliki supaya berani menjawab?',
    starter: 'Niko sebaiknya ... lalu ... dengan ...',
    value: 'Keberanian, percaya diri, dan menghargai aturan kelas.',
    example: 'Niko sebaiknya mengangkat tangan terlebih dahulu dan menjawab dengan percaya diri setelah dipersilakan guru.',
    rubric: {
      action: { need: 1, groups: [['angkat tangan', 'mengangkat tangan', 'menjawab', 'jawab', 'sampaikan', 'mengatakan jawaban']] },
      reason: ['percaya diri', 'berani', 'yakin', 'pintar', 'benar', 'membantu', 'aktif', 'belajar', 'teman', 'tahu', 'hebat'],
      safe: ['dipersilakan', 'dipersilahkan', 'izin', 'sopan', 'angkat tangan', 'menunggu', 'tunggu', 'giliran', 'guru', 'tidak berteriak'],
      minWords: 7
    },
    scene: { trigger: 1000, npcs: [{ name: 'Guru', x: 1330, color: '#8d6e63', hair: '#3b2a1a', adult: true, kind: 'wave', glasses: true, bubble: '❓' }], props: [] }
  },
  {
    id: 6, title: 'Mandiri Berangkat ke Sekolah', place: 'Jalan menuju sekolah', theme: 'road', avatar: 'Niko', time: 300,
    story: 'Niko berjalan kaki ke sekolah sendiri. Sebelum berangkat, Ibu mengingatkan: "Hati-hati di jalan ya, Nak. Jangan ikut dengan orang yang tidak kamu kenal."',
    question: 'Apa yang harus dilakukan Niko agar aman ketika berangkat sekolah? Apa yang harus dilakukan jika orang asing mengajaknya pergi?',
    hint: 'Ada dua hal: (1) cara berjalan yang aman di jalan, dan (2) apa yang dilakukan jika orang asing mengajak pergi. Ingat, minta tolong kepada orang dewasa yang dipercaya!',
    starter: 'Agar aman, Niko harus ... Jika ada orang asing mengajak, Niko harus ...',
    value: 'Mandiri, waspada, disiplin, dan bertanggung jawab.',
    example: 'Niko harus mengikuti rute yang aman, mematuhi aturan lalu lintas, dan tidak menerima ajakan atau pemberian dari orang asing. Jika merasa terancam, ia harus menuju tempat aman dan meminta bantuan orang dewasa tepercaya.',
    rubric: {
      action: { need: 2, groups: [['rute', 'jalan', 'hati hati', 'waspada', 'lalu lintas', 'trotoar', 'menyeberang', 'zebra', 'berjalan', 'lampu'], ['orang asing', 'menolak', 'tidak ikut', 'tidak mau', 'jangan ikut', 'tolak', 'tidak menerima', 'jangan terima', 'lari', 'menjauh', 'minta tolong', 'orang dewasa', 'polisi', 'guru', 'satpam']] },
      reason: ['bahaya', 'aman', 'selamat', 'culik', 'jahat', 'tidak kenal', 'tersesat', 'kecelakaan', 'terluka', 'disiplin', 'mandiri'],
      safe: ['orang dewasa', 'tepercaya', 'dipercaya', 'polisi', 'guru', 'satpam', 'ibu', 'tempat ramai', 'tempat aman', 'minta tolong', 'lari', 'menjauh', 'toko', 'warga'],
      minWords: 12
    },
    scene: { trigger: 1150, npcs: [{ name: 'Ibu', x: 260, color: '#d6336c', hair: '#3b2a1a', girl: true, adult: true, kind: 'wave', bubble: '👋', face: 1 }], props: [] }
  },
  {
    id: 7, title: 'Berani Belajar dengan Disiplin', place: 'Rumah', theme: 'home', avatar: 'Niko', time: 240,
    story: 'Setelah makan malam, Niko duduk di meja belajarnya. Setiap hari ia belajar pukul 19.00 dengan teratur.',
    question: 'Jika kamu ingin menjadi anak yang rajin dan mandiri, bagaimana cara mengatur waktu belajar setiap hari?',
    hint: 'Apa yang bisa kamu buat supaya belajar jadi teratur? Apa yang kamu lakukan kalau ada pelajaran yang belum paham?',
    starter: 'Saya akan membuat ... supaya ... Jika belum paham, saya akan ...',
    value: 'Disiplin, mandiri, tanggung jawab, dan tekun.',
    example: 'Saya akan membuat jadwal belajar, belajar dengan teratur, menyelesaikan tugas, dan meminta bantuan jika ada materi yang belum dipahami.',
    rubric: {
      action: { need: 1, groups: [['jadwal', 'belajar rutin', 'belajar teratur', 'belajar setiap', 'belajar pukul', 'belajar malam', 'waktu belajar', 'mengerjakan tugas', 'kerjakan pr', 'mengerjakan pr', 'membaca', 'mengulang', 'teratur', 'rutin', 'setiap hari']] },
      reason: ['disiplin', 'rajin', 'pintar', 'teratur', 'tanggung jawab', 'mandiri', 'paham', 'nilai', 'berhasil', 'bagus', 'tidak lupa', 'tidak terlambat'],
      safe: ['jadwal', 'teratur', 'istirahat', 'tepat waktu', 'bantuan', 'tanya', 'ibu', 'bapak', 'orang tua', 'guru', 'tidak menunda', 'rutin', 'setiap hari'],
      minWords: 8
    },
    scene: { trigger: 1100, npcs: [], props: [] }
  },
  {
    id: 8, title: 'Mandiri Menjaga Diri Sebelum Tidur', place: 'Kamar tidur', theme: 'bedroom', avatar: 'Niko', time: 240,
    story: 'Setelah belajar, Niko menggosok gigi lalu tidur sendiri pada pukul 21.00. Ia melakukannya dengan tertib setiap malam.',
    question: 'Kebiasaan baik apa yang dilakukan Niko sebelum tidur? Tuliskan urutan kegiatan yang dapat kamu tiru!',
    hint: 'Coba urutkan kegiatan dari awal sampai tidur. Ada kegiatan untuk merapikan barang, menjaga kebersihan badan, berdoa, dan tidur tepat waktu.',
    starter: 'Pertama, saya ... Kemudian, saya ... Terakhir, saya ...',
    value: 'Mandiri, menjaga kebersihan diri, disiplin, dan tanggung jawab.',
    example: 'Saya akan merapikan buku, menggosok gigi, membersihkan diri, berdoa, dan tidur tepat waktu.',
    rubric: {
      action: { need: 3, groups: [['gosok gigi', 'menggosok gigi', 'sikat gigi', 'menyikat gigi'], ['rapikan', 'merapikan', 'membereskan', 'bereskan', 'siapkan', 'menyiapkan', 'tas', 'buku'], ['cuci muka', 'mencuci muka', 'cuci kaki', 'mencuci kaki', 'bersihkan diri', 'membersihkan diri', 'mandi', 'cuci tangan', 'pipis', 'buang air'], ['berdoa', 'doa'], ['tidur tepat waktu', 'tepat waktu', 'tidur', 'jam 9', 'pukul 9', 'pukul 21', 'jam 21']] },
      reason: ['sehat', 'bersih', 'gigi', 'kuman', 'sakit', 'segar', 'istirahat', 'disiplin', 'mandiri', 'bugar', 'bangun', 'cukup tidur', 'rapi'],
      safe: ['pertama', 'kedua', 'lalu', 'kemudian', 'setelah', 'terakhir', 'sebelum', 'urut', 'tepat waktu', 'teratur', 'rutin'],
      minWords: 10
    },
    scene: { trigger: 1100, npcs: [], props: [{ e: '🪥', x: 1000, s: 34 }] }
  },
  {
    id: 9, title: 'Berani Mengakui Kesalahan', place: 'Halaman sekolah', theme: 'schoolyard', avatar: 'Niko', time: 240,
    story: 'Dodi tidak sengaja menjatuhkan dan merusak mainan milik temannya. Dodi takut dan ragu untuk mengakuinya.',
    question: 'Apa yang sebaiknya dilakukan siswa tersebut? Mengapa kita harus jujur ketika melakukan kesalahan?',
    hint: 'Ada dua hal yang perlu dilakukan: mengatakan yang sebenarnya, lalu bertanggung jawab. Kenapa kejujuran membuat orang percaya kepada kita?',
    starter: 'Dodi harus ... dan ... karena ...',
    value: 'Jujur, bertanggung jawab, berani, dan menghargai hak orang lain.',
    example: 'Ia harus mengakui kesalahannya, meminta maaf, dan berusaha memperbaiki atau mengganti barang tersebut sesuai kemampuannya dengan bantuan orang dewasa.',
    rubric: {
      action: { need: 2, groups: [['mengaku', 'mengakui', 'jujur', 'berterus terang', 'bilang', 'memberitahu', 'mengatakan', 'cerita'], ['minta maaf', 'meminta maaf', 'maaf', 'mengganti', 'ganti', 'memperbaiki', 'perbaiki', 'tanggung jawab', 'bertanggung jawab']] },
      reason: ['jujur', 'percaya', 'dipercaya', 'hak', 'milik', 'tanggung jawab', 'salah', 'tenang', 'lega', 'kepercayaan', 'adil', 'sedih', 'menghargai'],
      safe: ['orang dewasa', 'guru', 'ibu', 'bapak', 'orang tua', 'sesuai kemampuan', 'sopan', 'baik baik', 'dengan baik', 'pelan', 'maaf', 'tenang'],
      minWords: 8
    },
    scene: { trigger: 1050, npcs: [{ name: 'Dodi', x: 1280, color: '#12b886', hair: '#2b1b0e', kind: 'worry', bubble: '😟' }, { name: 'Rani', x: 1360, color: '#e599f7', hair: '#2b1b0e', girl: true, kind: 'sad', face: -1 }], props: [{ e: '🧸', x: 1320, s: 30 }, { e: '🌳', x: 300, s: 120 }, { e: '🌳', x: 800, s: 120 }] }
  },
  {
    id: 10, title: 'Misi Akhir: Anak Pemberani dan Berintegritas', place: 'Sekolah dan sekitarnya', theme: 'schoolyard', avatar: 'Niko', time: 420,
    story: 'Niko menghadapi beberapa kejadian sekaligus: sampah berserakan, dua teman bertengkar, seorang teman bersedih, dan ada pelajaran yang belum dipahami.',
    question: 'Bayangkan kamu berada dalam semua situasi tersebut. Tuliskan tiga tindakan baik yang akan kamu lakukan dan jelaskan alasannya!',
    hint: 'Tulis tiga tindakan: (1) soal sampah, (2) soal teman yang bertengkar atau bersedih, (3) soal pelajaran yang belum paham. Jangan lupa alasannya dengan kata "karena" atau "agar".',
    starter: 'Pertama, saya akan ... agar ... Kedua, saya akan ... Ketiga, saya akan ...',
    value: 'Keberanian, kejujuran, kepedulian, kemandirian, tanggung jawab, dan percaya diri.',
    example: 'Pertama, saya akan membuang sampah pada tempatnya agar lingkungan bersih. Kedua, saya akan membantu teman yang sedih agar merasa lebih baik. Ketiga, saya akan bertanya kepada guru jika belum memahami pelajaran.',
    rubric: {
      action: { need: 3, groups: [['sampah', 'memungut', 'bersih'], ['bertengkar', 'berkelahi', 'melerai', 'leraikan', 'damai', 'orang dewasa', 'pisah', 'tenangkan'], ['sedih', 'hibur', 'semangat', 'temani', 'bantu teman', 'membantu teman', 'menolong'], ['bertanya', 'tanya', 'guru', 'paham', 'mengerti']] },
      reason: ['bersih', 'aman', 'sehat', 'senang', 'peduli', 'paham', 'damai', 'teman', 'pintar', 'baik', 'jujur', 'tanggung jawab', 'lebih baik'],
      safe: ['orang dewasa', 'sopan', 'baik', 'tenang', 'aman', 'guru', 'damai', 'dengan baik', 'tolong'],
      minWords: 18
    },
    scene: { trigger: 1150, npcs: [{ name: 'Miko', x: 520, color: '#ff922b', hair: '#3b2a1a', kind: 'trash' }, { name: 'Jay', x: 760, color: '#e03131', hair: '#1b1b1b', kind: 'fight', face: 1 }, { name: 'Ari', x: 830, color: '#7048e8', hair: '#3b2a1a', kind: 'fight', face: -1, seed: 2 }, { name: 'Gina', x: 1060, color: '#f06595', hair: '#2b1b0e', girl: true, kind: 'cry' }, { name: 'Guru', x: 1380, color: '#8d6e63', hair: '#3b2a1a', adult: true, kind: 'idle', glasses: true, bubble: '📖' }], props: [{ e: '🥤', x: 590, s: 26 }, { e: '🍬', x: 620, s: 22 }] }
  }
];

/* ---------- 2. AUDIO (dibuat dengan Web Audio, tanpa file) ---------- */
const Aud = {
  ctx: null, music: true, sfx: true, timer: null, step: 0, next: 0, master: null,
  hz: m => 440 * Math.pow(2, (m - 69) / 12),
  // Melodi ceria (tangga nada C mayor), 32 langkah, 0 = jeda
  mel: [72,0,76,0,79,0,76,0, 72,0,76,0,81,0,79,0, 77,0,81,0,84,0,81,0, 79,0,76,0,74,0,72,0],
  bass: [48, 45, 41, 43],
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 1;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (this.music) this.startMusic();
  },
  tone(freq, t, dur, type, vol) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.05);
  },
  startMusic() {
    if (!this.ctx || this.timer) return;
    this.next = this.ctx.currentTime + 0.1;
    this.timer = setInterval(() => this.schedule(), 100);
  },
  stopMusic() { clearInterval(this.timer); this.timer = null; },
  schedule() {
    while (this.next < this.ctx.currentTime + 0.4) {
      const s = this.step % 32, m = this.mel[s];
      if (m) this.tone(this.hz(m), this.next, 0.28, 'triangle', 0.07);
      if (s % 4 === 0) this.tone(this.hz(this.bass[Math.floor(s / 8)]), this.next, 0.45, 'sine', 0.09);
      if (s % 2 === 1) this.tone(this.hz(96), this.next, 0.04, 'square', 0.012); // detak halus
      this.next += 0.25; this.step++;
    }
  },
  setMusic(on) { this.music = on; if (on) { this.unlock(); this.startMusic(); } else this.stopMusic(); },
  play(name) {
    if (!this.sfx || !this.ctx) return;
    const t = this.ctx.currentTime, p = (m, d, o, ty, v) => this.tone(this.hz(m), t + o, d, ty || 'square', v || 0.08);
    if (name === 'click') p(84, 0.08, 0);
    else if (name === 'jump') { p(72, 0.1, 0, 'sine', 0.12); p(79, 0.12, 0.07, 'sine', 0.12); }
    else if (name === 'star') [84, 88, 91, 96].forEach((m, i) => p(m, 0.18, i * 0.1, 'triangle', 0.14));
    else if (name === 'win') [72, 76, 79, 84, 79, 84, 88].forEach((m, i) => p(m, 0.22, i * 0.12, 'triangle', 0.14));
    else if (name === 'wrong') { p(64, 0.2, 0, 'sawtooth', 0.07); p(58, 0.3, 0.18, 'sawtooth', 0.07); }
    else if (name === 'over') [60, 57, 53, 48].forEach((m, i) => p(m, 0.3, i * 0.22, 'sawtooth', 0.07));
    else if (name === 'story') { p(79, 0.12, 0, 'sine', 0.12); p(84, 0.18, 0.1, 'sine', 0.12); }
  }
};

/* ---------- 3. PENILAIAN JAWABAN (kata kunci + rubrik) ---------- */
// Merapikan teks: huruf kecil, tanpa tanda baca
function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(); }
function countWords(s) { const n = norm(s); return n ? n.split(' ').length : 0; }
// Cek kata tidak sopan, kecuali didahului "tidak / jangan / bukan / tanpa"
function findBad(t) {
  for (const raw of BAD_WORDS) {
    const w = norm(raw); let i = t.indexOf(w);
    while (i !== -1) {
      const before = t.slice(Math.max(0, i - 22), i);
      if (!/(tidak|jangan|bukan|tanpa|tak)\s*(\w+\s+)?$/.test(before)) return raw;
      i = t.indexOf(w, i + 1);
    }
  }
  return null;
}
const anyIn = (t, list) => list.some(k => t.includes(norm(k)));

/* Rubrik 100 poin: 40 tindakan, 30 alasan, 20 aman & sopan, 10 kejelasan */
function evaluate(L, text) {
  const t = norm(text), R = L.rubric, words = countWords(text);
  const matched = R.action.groups.filter(g => anyIn(t, g)).length;
  const action = Math.round(40 * Math.min(1, matched / R.action.need));
  const hasConn = anyIn(t, CONNECTORS), hasReason = anyIn(t, R.reason);
  const reason = hasConn && hasReason ? 30 : hasReason ? 20 : hasConn ? 10 : 0;
  const bad = findBad(t), hasSafe = anyIn(t, R.safe);
  const safe = bad ? 0 : hasSafe ? 20 : action > 0 ? 10 : 0;
  const clarity = words >= R.minWords ? 10 : words >= Math.ceil(R.minWords / 2) ? 5 : 0;
  const total = action + reason + safe + clarity;

  const notes = [];
  notes.push(action >= 40 ? ['ok', 'Tindakanmu sudah tepat. Bagus! (' + action + '/40)']
    : action > 0 ? ['tip', 'Tindakanmu sudah mulai tepat, tetapi masih kurang lengkap. Tambahkan tindakan lain yang diminta pertanyaan. (' + action + '/40)']
    : ['tip', 'Coba tuliskan dengan jelas apa yang akan kamu lakukan. (0/40)']);
  notes.push(reason >= 30 ? ['ok', 'Alasanmu masuk akal dan ditulis dengan jelas. (' + reason + '/30)']
    : reason > 0 ? ['tip', 'Alasanmu sudah ada. Tambahkan kata "karena" atau "agar" lalu jelaskan akibat baiknya. (' + reason + '/30)']
    : ['tip', 'Ayo tambahkan alasan. Mengapa tindakan itu baik? Pakai kata "karena" atau "agar". (0/30)']);
  notes.push(bad ? ['tip', 'Ada tindakan yang kurang aman atau kurang sopan ("' + bad + '"). Coba pikirkan cara yang damai, sopan, atau meminta bantuan orang dewasa. (0/20)']
    : hasSafe ? ['ok', 'Caramu aman dan sopan. (20/20)']
    : ['tip', 'Tambahkan bagaimana caranya dilakukan dengan aman dan sopan, misalnya dengan bantuan orang dewasa. (' + safe + '/20)']);
  notes.push(clarity >= 10 ? ['ok', 'Jawabanmu jelas dan cukup lengkap. (10/10)']
    : ['tip', 'Tulis jawabanmu lebih lengkap dalam beberapa kalimat. (' + clarity + '/10)']);
  return { action, reason, safe, clarity, total, notes, bad };
}
const starsFor = s => s >= 90 ? 3 : s >= 75 ? 2 : s >= PASS_SCORE ? 1 : 0;
const titleFor = s => s >= 90 ? 'Pemberani Hebat!' : s >= 75 ? 'Anak Berani!' : s >= PASS_SCORE ? 'Terus Berlatih!' : 'Ayo lengkapi jawabanmu!';

/* ---------- 5. PENYIMPANAN (localStorage) ---------- */
function loadDB() {
  try { const d = JSON.parse(localStorage.getItem(STORE_KEY)); if (d && d.students) return d; } catch (e) {}
  return { students: {}, current: null, pin: PIN_DEFAULT, settings: { music: true, sfx: true } };
}
let DB = loadDB();
function saveDB() { try { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); } catch (e) {} }
const sid = (name, kelas) => norm(name).replace(/ /g, '_') + '__' + norm(kelas).replace(/ /g, '');
const me = () => DB.students[DB.current] || null;
const effScore = r => r ? (r.teacher != null ? r.teacher : r.auto) : 0;
const levelStars = r => starsFor(effScore(r));
function totals(st) {
  let score = 0, stars = 0, done = 0;
  for (let i = 1; i <= 10; i++) { const r = st.levels[i]; if (r) { score += effScore(r); stars += levelStars(r); if (effScore(r) >= PASS_SCORE) done++; } }
  return { score, stars, done };
}
const unlocked = (st, n) => n === 1 || effScore(st.levels[n - 1]) >= PASS_SCORE;
function fmtTime(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }

/* ---------- 6. LAYAR, LOGIN, PETA, NILAI, PANEL GURU ---------- */
const $ = id => document.getElementById(id);
function el(tag, props, kids) {
  const e = document.createElement(tag);
  Object.assign(e, props || {});
  (kids || []).forEach(k => e.append(k));
  return e;
}
let currentScreen = 'login';
function show(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + name).classList.add('active');
  currentScreen = name;
  if (name === 'menu') $('menuHello').textContent = 'Halo, ' + me().name + ' (Kelas ' + me().kelas + ')! 👋';
  if (name === 'map') renderMap();
  if (name === 'score') renderScore();
  if (name === 'teacher') { renderTeacher(); }
}
let toastTimer;
function toast(msg, ms) {
  const t = $('toast'); t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add('hidden'), ms || 2200);
}

function doLogin(e) {
  e.preventDefault();
  const name = $('inName').value.trim().replace(/\s+/g, ' ');
  const kelas = $('inClass').value.trim().toUpperCase();
  if (name.length < 2) { $('loginMsg').textContent = 'Tulis namamu dulu ya.'; return; }
  if (!kelas) { $('loginMsg').textContent = 'Tulis kelasmu dulu ya.'; return; }
  const id = sid(name, kelas);
  if (!DB.students[id]) DB.students[id] = { id, name, kelas, levels: {}, seconds: 0, created: Date.now() };
  DB.students[id].last = Date.now();
  DB.current = id; loggedIn = true; saveDB();
  $('loginMsg').textContent = '';
  Aud.play('win');
  show('menu');
}

function renderMap() {
  const st = me(), t = totals(st), grid = $('levelGrid');
  $('mapInfo').textContent = 'Level selesai: ' + t.done + '/10  •  Bintang: ' + t.stars + ' ⭐  •  Skor: ' + t.score;
  grid.innerHTML = '';
  LEVELS.forEach(L => {
    const ok = unlocked(st, L.id), r = st.levels[L.id], stars = r ? levelStars(r) : 0;
    const b = el('button', { className: 'lv' + (ok ? '' : ' locked') + (stars ? ' done' : '') }, [
      el('div', { className: 'n', textContent: L.id }),
      el('div', { className: 't', textContent: L.title }),
      el('div', { className: 's', textContent: ok ? (stars ? '⭐'.repeat(stars) : '▶') : '🔒' })
    ]);
    b.onclick = () => { if (!ok) { toast('Selesaikan level sebelumnya dulu ya 🔒'); Aud.play('wrong'); return; } Aud.play('click'); startLevel(L.id); };
    grid.append(b);
  });
}

/* Papan skor semua pemain */
function boardRows(kelas) {
  return Object.values(DB.students)
    .filter(s => !kelas || s.kelas === kelas)
    .map(s => ({ s, t: totals(s) }))
    .filter(x => x.t.done > 0 || Object.keys(x.s.levels).length > 0)
    .sort((a, b) => b.t.score - a.t.score || b.t.stars - a.t.stars || a.s.seconds - b.s.seconds);
}
function classOptions(sel, includeAll) {
  const list = [...new Set(Object.values(DB.students).map(s => s.kelas))].sort();
  const keep = sel.value;
  sel.innerHTML = '';
  if (includeAll) sel.append(el('option', { value: '', textContent: 'Semua kelas' }));
  list.forEach(k => sel.append(el('option', { value: k, textContent: k })));
  if ([...sel.options].some(o => o.value === keep)) sel.value = keep;
}
function renderScore() {
  const st = me(), t = totals(st);
  $('myStats').innerHTML = '';
  [['Total skor', t.score], ['Bintang', t.stars + ' ⭐'], ['Level selesai', t.done + '/10'], ['Waktu main', fmtTime(st.seconds)]]
    .forEach(([k, v]) => $('myStats').append(el('div', { className: 'stat' }, [el('b', { textContent: v }), k])));
  const ml = $('myLevels'); ml.innerHTML = '';
  LEVELS.forEach(L => {
    const r = st.levels[L.id];
    ml.append(el('div', { className: 'ml', textContent: 'Level ' + L.id + ': ' + (r ? effScore(r) + ' ' + '⭐'.repeat(levelStars(r)) : '-') }));
  });
  classOptions($('scoreClass'), true);
  const tb = $('board').querySelector('tbody'); tb.innerHTML = '';
  const rows = boardRows($('scoreClass').value);
  if (!rows.length) tb.append(el('tr', {}, [el('td', { colSpan: 7, textContent: 'Belum ada nilai. Ayo bermain!' })]));
  rows.forEach((x, i) => {
    const medal = ['🥇', '🥈', '🥉'][i] || (i + 1);
    const tr = el('tr', { className: x.s.id === DB.current ? 'me' : '' }, [
      el('td', { textContent: medal }), el('td', { textContent: x.s.name }), el('td', { textContent: x.s.kelas }),
      el('td', { textContent: x.t.score }), el('td', { textContent: x.t.stars }), el('td', { textContent: x.t.done + '/10' }), el('td', { textContent: fmtTime(x.s.seconds) })
    ]);
    tb.append(tr);
  });
}

/* Panel guru: meninjau jawaban, mengubah nilai, unduh CSV */
let teacherOK = false;
let loggedIn = false; // sudah login pada sesi ini?
function renderTeacher() {
  $('teacherLock').classList.toggle('hidden', teacherOK);
  $('teacherBody').classList.toggle('hidden', !teacherOK);
  if (!teacherOK) return;
  classOptions($('teacherClass'), true);
  const box = $('teacherList'); box.innerHTML = '';
  const rows = boardRows($('teacherClass').value);
  if (!rows.length) box.append(el('p', { textContent: 'Belum ada data siswa.' }));
  rows.forEach(({ s, t }) => {
    const d = el('details', { className: 't-student' });
    d.append(el('summary', { textContent: s.name + ' (' + s.kelas + ') — skor ' + t.score + ', ' + t.stars + ' ⭐, waktu ' + fmtTime(s.seconds) }));
    LEVELS.forEach(L => {
      const r = s.levels[L.id]; if (!r) return;
      const num = el('input', { type: 'number', min: 0, max: 100, value: r.teacher != null ? r.teacher : '', placeholder: 'Nilai guru' });
      const note = el('input', { type: 'text', value: r.note || '', placeholder: 'Catatan guru', maxLength: 120 });
      const save = el('button', { className: 'btn tiny green', textContent: 'Simpan' });
      save.onclick = () => {
        const v = num.value === '' ? null : Math.max(0, Math.min(100, Math.round(+num.value)));
        r.teacher = v; r.note = note.value; saveDB(); toast('Tersimpan ✔'); renderTeacher();
      };
      d.append(el('div', { className: 't-level' }, [
        el('b', { textContent: 'Level ' + L.id + ' — ' + L.title }),
        el('pre', { textContent: r.answer || '(belum ada jawaban)' }),
        el('div', { textContent: 'Nilai otomatis: ' + r.auto + ' | Nilai akhir: ' + effScore(r) + ' | Percobaan: ' + (r.attempts || 0) }),
        el('div', { className: 't-edit' }, [num, note, save])
      ]));
    });
    const del = el('button', { className: 'btn tiny ghost', textContent: '🗑 Hapus data siswa ini' });
    del.onclick = () => { if (confirm('Hapus data ' + s.name + '?')) { delete DB.students[s.id]; if (DB.current === s.id) DB.current = null; saveDB(); renderTeacher(); } };
    d.append(el('div', { className: 't-level' }, [del]));
    box.append(d);
  });
}
function downloadCSV() {
  const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const lines = [['Nama', 'Kelas', 'Level', 'Judul', 'Skor Otomatis', 'Skor Guru', 'Skor Akhir', 'Bintang', 'Jawaban', 'Catatan Guru'].map(q).join(',')];
  Object.values(DB.students).forEach(s => LEVELS.forEach(L => {
    const r = s.levels[L.id]; if (!r) return;
    lines.push([s.name, s.kelas, L.id, L.title, r.auto, r.teacher == null ? '' : r.teacher, effScore(r), levelStars(r), r.answer, r.note].map(q).join(','));
  }));
  const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = el('a', { href: URL.createObjectURL(blob), download: 'nilai-siswa.csv' });
  document.body.append(a); a.click(); a.remove();
}

/* ---------- 4. MENGGAMBAR KARAKTER & LATAR ---------- */
const cv = $('gameCanvas'), ctx = cv.getContext('2d');
const SKIN = '#ffd7b5';
function circle(g, x, y, r) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
function rr(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
function emoji(g, e, x, y, size) { g.font = size + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText(e, x, y); }

/* Menggambar satu karakter kartun. c = data karakter, (x,y) = telapak kaki, s = skala */
function drawChar(g, c, x, y, s, t) {
  const kind = c.kind || 'idle', f = c.facing || 1, sc = (c.adult ? 1.18 : 1) * s;
  const moving = !!c.moving, air = !!c.air;
  const sw = moving ? Math.sin(t * 14) : 0;
  const jx = kind === 'fight' ? Math.sin(t * 18 + (c.seed || 0)) * 4 : 0;
  const sad = kind === 'cry' || kind === 'sad' || kind === 'worry';
  const mood = c.mood || (kind === 'fight' ? 'angry' : sad ? 'sad' : kind === 'think' ? 'think' : 'happy');

  // bayangan
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(x, y + 2, 22 * sc, 6 * sc, 0, 0, Math.PI * 2); g.fill();

  g.save(); g.translate(x + jx, y); g.scale(sc * f, sc);
  g.lineCap = 'round';
  // kaki / rok
  if (c.girl && c.adult) {
    g.fillStyle = c.color; g.beginPath(); g.moveTo(-17, -40); g.lineTo(17, -40); g.lineTo(24, -6); g.lineTo(-24, -6); g.closePath(); g.fill();
  } else {
    g.strokeStyle = c.pants || '#3b4a7a'; g.lineWidth = 10;
    g.beginPath(); g.moveTo(-7, -34); g.lineTo(-7 + sw * 11, -5); g.moveTo(7, -34); g.lineTo(7 - sw * 11, -5 - (air ? 9 : 0)); g.stroke();
  }
  g.fillStyle = '#222'; g.beginPath(); g.ellipse(-7 + sw * 11, -3, 8, 4, 0, 0, Math.PI * 2); g.ellipse(7 - sw * 11, -3 - (air ? 9 : 0), 8, 4, 0, 0, Math.PI * 2); g.fill();
  // badan
  g.fillStyle = c.color; rr(g, -17, -78, 34, 46, 10); g.fill();
  // lengan
  g.strokeStyle = SKIN; g.lineWidth = 8;
  const arm = (sx, ex, ey) => { g.beginPath(); g.moveTo(sx, -68); g.lineTo(ex, ey); g.stroke(); };
  if (kind === 'cry') { arm(-16, -9, -88); arm(16, 9, -88); }
  else if (kind === 'wave') { arm(-16, -26, -44); arm(16, 30, -104 + Math.sin(t * 10) * 9); }
  else if (c.raise) { arm(-16, -26, -44); arm(16, 24, -112); }
  else if (kind === 'fight') { arm(-16, -26, -76 + Math.sin(t * 16) * 8); arm(16, 26, -76 - Math.sin(t * 16) * 8); }
  else if (kind === 'comfort') { arm(-16, -26, -50); arm(16, 30, -58 + Math.sin(t * 4) * 5); }
  else if (kind === 'trash') { arm(-16, -26, -44); arm(16, 28 + Math.abs(Math.sin(t * 3)) * 8, -66 - Math.abs(Math.sin(t * 3)) * 18); }
  else { arm(-16, -24 - sw * 8, -46); arm(16, 24 + sw * 8, -46); }
  // kepala
  g.fillStyle = SKIN; circle(g, 0, -98, 23);
  // rambut
  g.fillStyle = c.hair || '#222';
  g.beginPath(); g.arc(0, -101, 25, Math.PI * 1.02, Math.PI * 1.98); g.fill();
  g.beginPath(); g.ellipse(-12, -112, 14, 8, 0.4, 0, Math.PI * 2); g.fill();
  if (c.girl && !c.adult) { circle(g, -26, -92, 9); circle(g, 26, -92, 9); g.fillStyle = '#ff6b9d'; circle(g, -24, -104, 4); circle(g, 24, -104, 4); }
  if (c.girl && c.adult) { g.fillStyle = c.hair; circle(g, 0, -126, 11); }
  // mata (berkedip)
  const blink = (t % 3.3) > 3.2;
  g.fillStyle = '#222';
  if (blink) { g.fillRect(-12, -99, 8, 2); g.fillRect(4, -99, 8, 2); }
  else { circle(g, -8, -98, 3.4); circle(g, 8, -98, 3.4); g.fillStyle = '#fff'; circle(g, -7, -99, 1.1); circle(g, 9, -99, 1.1); }
  // pipi
  g.fillStyle = 'rgba(255,120,120,.35)'; circle(g, -15, -90, 4.5); circle(g, 15, -90, 4.5);
  // kacamata
  if (c.glasses) { g.strokeStyle = '#222'; g.lineWidth = 2; g.beginPath(); g.arc(-8, -98, 7, 0, 7); g.moveTo(15, -98); g.arc(8, -98, 7, 0, 7); g.moveTo(-1, -98); g.lineTo(1, -98); g.stroke(); }
  // mulut & alis
  g.strokeStyle = '#a02828'; g.lineWidth = 2.5;
  g.beginPath();
  if (mood === 'happy') g.arc(0, -90, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  else if (mood === 'sad') g.arc(0, -80, 7, 1.15 * Math.PI, 1.85 * Math.PI);
  else if (mood === 'angry') { g.moveTo(-6, -84); g.lineTo(6, -84); }
  else g.arc(0, -86, 3, 0, Math.PI * 2);
  g.stroke();
  if (mood === 'angry') { g.strokeStyle = '#222'; g.lineWidth = 3; g.beginPath(); g.moveTo(-14, -108); g.lineTo(-3, -103); g.moveTo(14, -108); g.lineTo(3, -103); g.stroke(); }
  if (mood === 'sad') { g.strokeStyle = '#222'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-14, -104); g.lineTo(-3, -108); g.moveTo(14, -104); g.lineTo(3, -108); g.stroke(); }
  // air mata
  if (kind === 'cry') { g.fillStyle = '#4dabf7'; const d = (t * 45) % 22; circle(g, -10, -90 + d, 3.2); circle(g, 10, -90 + ((d + 10) % 22), 3.2); }
  g.restore();

  // nama
  g.font = 'bold 14px "Trebuchet MS",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const nw = g.measureText(c.name).width + 14;
  g.fillStyle = 'rgba(255,255,255,.9)'; rr(g, x - nw / 2, y + 10, nw, 20, 8); g.fill();
  g.fillStyle = '#27304a'; g.fillText(c.name, x, y + 20);
  // gelembung emoji
  const bub = kind === 'fight' ? (Math.sin(t * 8) > 0 ? '💢' : '😠') : c.bubble;
  if (bub) {
    const by = y - 150 * sc - 6;
    g.fillStyle = '#fff'; g.strokeStyle = '#27304a'; g.lineWidth = 2; rr(g, x - 20, by - 28, 40, 34, 12); g.fill(); g.stroke();
    g.fillStyle = '#000'; emoji(g, bub, x, by - 3, 22);
  }
}

function cloud(g, x, y) { g.fillStyle = 'rgba(255,255,255,.92)'; circle(g, x, y, 22); circle(g, x + 24, y - 8, 28); circle(g, x + 54, y, 22); g.fillRect(x, y, 54, 22); }

/* Latar belakang tiap lokasi */
function drawScene(g, L, cam, t) {
  const th = L.theme, indoor = th === 'classroom' || th === 'home' || th === 'bedroom';
  g.clearRect(0, 0, W, H);
  if (!indoor) {
    const gr = g.createLinearGradient(0, 0, 0, GROUND); gr.addColorStop(0, '#6cc7ff'); gr.addColorStop(1, '#e0f7ff');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = '#ffe066'; circle(g, 790, 70, 38);
    for (let i = 0; i < 5; i++) cloud(g, ((i * 330 - cam * 0.25 + t * 9) % 1700 + 1700) % 1700 - 150, 50 + (i % 2) * 45);
    // bukit jauh
    g.fillStyle = '#9fe08f';
    for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(i * 320 - cam * 0.4 % 320 + 100, GROUND + 40, 190, Math.PI, 0); g.fill(); }
  } else {
    const wall = th === 'bedroom' ? '#3c4a8a' : th === 'home' ? '#ffe3a3' : '#d7f0ff';
    g.fillStyle = wall; g.fillRect(0, 0, W, H);
  }
  // tanah / lantai
  const ground = { sidewalk: '#c4c6cc', park: '#7ad468', schoolyard: '#82d86f', road: '#8d8f96', classroom: '#d9a76a', home: '#c78f55', bedroom: '#6a4f3a' }[th];
  g.fillStyle = ground; g.fillRect(0, GROUND, W, H - GROUND);
  g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, GROUND, W, 5);

  g.save(); g.translate(-cam, 0);
  if (th === 'sidewalk') {
    for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? '#ffb4a2' : '#b5d99c'; g.fillRect(i * 150 + 20, GROUND - 190, 110, 190); g.fillStyle = '#fff6'; for (let k = 0; k < 3; k++) g.fillRect(i * 150 + 36 + k * 32, GROUND - 160, 20, 26); }
    g.fillStyle = '#7d808a'; g.fillRect(0, GROUND + 55, WORLD, 35);
  }
  if (th === 'road') {
    g.fillStyle = '#6d6f76'; g.fillRect(0, GROUND + 30, WORLD, 60);
    g.fillStyle = '#fff'; for (let i = 0; i < 20; i++) g.fillRect(i * 90, GROUND + 58, 45, 5);
    for (let i = 0; i < 6; i++) g.fillRect(740 + i * 22, GROUND + 30, 12, 60);
    emoji(g, '🏠', 90, GROUND + 5, 130); emoji(g, '🏫', 1400, GROUND + 5, 150);
    emoji(g, '🌳', 450, GROUND, 110); emoji(g, '🌳', 1000, GROUND, 110); emoji(g, '🚦', 700, GROUND, 70);
    emoji(g, '🚗', ((t * 140) % 1900) - 200, GROUND + 78, 54);
  }
  if (th === 'schoolyard') { emoji(g, '🏫', 160, GROUND - 5, 210); g.fillStyle = '#e03131'; g.fillRect(1100, GROUND - 200, 5, 200); g.fillRect(1105, GROUND - 200, 38, 24); }
  if (th === 'park') { g.fillStyle = '#b08968'; g.fillRect(500, GROUND - 40, 90, 10); g.fillRect(510, GROUND - 30, 8, 30); g.fillRect(572, GROUND - 30, 8, 30); }
  if (th === 'classroom') {
    g.fillStyle = '#6fd1ff'; for (let i = 0; i < 3; i++) { rr(g, 120 + i * 190, 60, 120, 120, 10); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 5; g.stroke(); }
    g.fillStyle = '#2f6f4f'; rr(g, 1130, 70, 330, 160, 8); g.fill(); g.strokeStyle = '#a87b4d'; g.lineWidth = 8; g.stroke();
    g.fillStyle = '#fff'; g.font = 'bold 28px "Comic Sans MS",cursive'; g.textAlign = 'center'; g.fillText('Ayo Belajar!', 1295, 140); g.font = '24px sans-serif'; g.fillText('2 + 3 = 5', 1295, 185);
    for (let i = 0; i < 3; i++) { g.fillStyle = '#b5834f'; g.fillRect(250 + i * 220, GROUND - 52, 110, 12); g.fillRect(260 + i * 220, GROUND - 40, 8, 40); g.fillRect(342 + i * 220, GROUND - 40, 8, 40); emoji(g, '📚', 305 + i * 220, GROUND - 52, 28); }
  }
  if (th === 'home') {
    g.fillStyle = '#ffd8a8'; rr(g, 150, 60, 130, 110, 8); g.fill();
    emoji(g, '🖼️', 215, 140, 60);
    g.fillStyle = '#fff'; circle(g, 600, 110, 44); g.fillStyle = '#27304a'; g.font = 'bold 18px sans-serif'; g.textAlign = 'center'; g.fillText('19.00', 600, 117);
    g.fillStyle = '#9c6a3a'; g.fillRect(1090, GROUND - 70, 230, 14); g.fillRect(1100, GROUND - 56, 12, 56); g.fillRect(1298, GROUND - 56, 12, 56);
    emoji(g, '📚', 1140, GROUND - 70, 40); emoji(g, '💡', 1270, GROUND - 70, 44); emoji(g, '✏️', 1205, GROUND - 70, 30);
    emoji(g, '🍽️', 400, GROUND, 40);
  }
  if (th === 'bedroom') {
    g.fillStyle = '#10163a'; rr(g, 150, 50, 140, 120, 10); g.fill(); emoji(g, '🌙', 220, 130, 64); emoji(g, '⭐', 180, 90, 24); emoji(g, '⭐', 260, 80, 20);
    g.fillStyle = '#fff'; circle(g, 600, 110, 44); g.fillStyle = '#27304a'; g.font = 'bold 18px sans-serif'; g.textAlign = 'center'; g.fillText('21.00', 600, 117);
    g.fillStyle = '#845ef7'; rr(g, 1180, GROUND - 70, 300, 70, 12); g.fill(); g.fillStyle = '#fff'; rr(g, 1190, GROUND - 90, 80, 34, 12); g.fill();
    g.fillStyle = '#b197fc'; g.fillRect(1180, GROUND - 40, 300, 12);
    emoji(g, '🧸', 900, GROUND, 40);
  }
  // alat peraga level
  L.scene.props.forEach(p => emoji(g, p.e, p.x, GROUND + (p.s > 60 ? 4 : 18), p.s));
  g.restore();
}

/* ---------- 7. MESIN PERMAINAN ---------- */
let G = null; // status permainan aktif
const keys = { left: false, right: false };

function levelById(n) { return LEVELS[n - 1]; }

function startLevel(n) {
  const L = levelById(n);
  G = {
    n, L, x: 90, y: 0, vy: 0, air: false, face: 1, moving: false, camX: 0,
    phase: 'walk', lives: LIVES_MAX, timeLeft: L.time, t: 0, hintStage: 0, lastSave: 0, submitted: false,
    npcs: L.scene.npcs.map(c => Object.assign({ facing: c.face || -1 }, c))
  };
  keys.left = keys.right = false;
  $('overlay').classList.add('hidden');
  $('panel').classList.add('hidden');
  $('controls').classList.remove('off');
  $('goHint').classList.remove('hidden');
  $('hudLevel').textContent = 'Level ' + n + ': ' + L.title;
  updateHud();
  show('game');
}

function updateHud() {
  if (!G) return;
  $('hudLives').textContent = '❤️'.repeat(G.lives) + '🖤'.repeat(LIVES_MAX - G.lives);
  const tm = $('hudTimer'); tm.textContent = '⏱ ' + fmtTime(G.timeLeft); tm.classList.toggle('low', G.timeLeft <= 30 && G.phase !== 'done');
  $('hudStars').textContent = '⭐ ' + totals(me()).stars;
  $('progressBar').style.width = (totals(me()).done / 10 * 100) + '%';
}

function openPanel() {
  const L = G.L;
  G.phase = 'panel';
  keys.left = keys.right = false;
  $('goHint').classList.add('hidden');
  $('controls').classList.add('off');
  $('panelTag').textContent = 'Level ' + L.id + ' • ' + L.place;
  $('storyText').textContent = '📖 ' + L.story;
  $('questionText').textContent = '❓ ' + L.question;
  const prev = me().levels[L.id];
  $('answer').value = '';
  $('answer').disabled = false;
  $('hintBox').classList.add('hidden');
  $('answerMsg').textContent = '';
  $('feedback').classList.add('hidden');
  $('answerBtns').classList.remove('hidden');
  $('btnSubmit').disabled = false;
  $('panel').classList.remove('hidden');
  $('panel').scrollTop = 0;
  Aud.play('story');
  if (prev && prev.answer && effScore(prev) >= PASS_SCORE) toast('Kamu sudah pernah menyelesaikan level ini. Coba tulis jawaban yang lebih baik! ⭐');
}

function showHint() {
  const L = G.L; G.hintStage++;
  const box = $('hintBox'); box.classList.remove('hidden');
  const txt = $('answer').value.trim();
  if (G.hintStage === 1) box.textContent = '💡 Petunjuk: ' + L.hint;
  else if (G.hintStage === 2 && countWords(txt) >= 3) {
    const r = evaluate(L, txt), tips = r.notes.filter(n => n[0] === 'tip').map(n => n[1].replace(/\s*\(\d+\/\d+\)/, ''));
    box.textContent = '💡 Petunjuk untuk jawabanmu: ' + (tips[0] || 'Jawabanmu sudah bagus! Periksa lagi, lalu kirim ya.');
  } else box.textContent = '💡 Kamu bisa memulai dengan kalimat ini: "' + L.starter + '"';
  Aud.play('click');
}

function submitAnswer() {
  if (!G || G.phase !== 'panel' || G.submitted) return;
  const L = G.L, text = $('answer').value.trim();
  if (countWords(text) < 3) {
    $('answerMsg').textContent = 'Ayo tulis jawabanmu dulu, minimal satu kalimat ya. Kamu pasti bisa! 😊';
    return;
  }
  $('answerMsg').textContent = '';
  const r = evaluate(L, text), st = me();
  const rec = st.levels[L.id] || (st.levels[L.id] = { auto: 0, answer: '', teacher: null, note: '', attempts: 0 });
  rec.attempts++;
  rec.lastAnswer = text;
  if (r.total >= rec.auto || !rec.answer) { rec.auto = Math.max(rec.auto, r.total); rec.answer = text; }
  saveDB();

  G.submitted = true;
  $('answer').disabled = true; $('btnSubmit').disabled = true;
  $('answerBtns').classList.add('hidden');
  const pass = r.total >= PASS_SCORE, stars = starsFor(r.total);
  const fb = $('feedback'); fb.classList.remove('hidden'); fb.classList.toggle('low', !pass);
  $('fbStars').innerHTML = ''; for (let i = 0; i < stars; i++) $('fbStars').append(el('span', { textContent: '⭐' }));
  if (!stars) $('fbStars').textContent = '💪';
  $('fbTitle').textContent = pass ? titleFor(r.total) : 'Bagus, kamu sudah mencoba!';
  $('fbScore').textContent = 'Nilai: ' + r.total + ' / 100';
  const ul = $('fbList'); ul.innerHTML = '';
  r.notes.forEach(n => ul.append(el('li', { textContent: (n[0] === 'ok' ? '✅ ' : '💡 ') + n[1] })));
  $('fbMoral').textContent = '🌈 Nilai karakter: ' + L.value;
  if (pass) {
    $('fbExample').textContent = '📝 Contoh jawaban lain: ' + L.example;
    $('fbExample').classList.remove('hidden');
    G.phase = 'done'; // waktu berhenti
    Aud.play(stars === 3 ? 'win' : 'star');
    $('btnNext').classList.remove('hidden');
    $('btnNext').textContent = L.id === 10 ? '🏆 SELESAI' : '➡ LANJUTKAN';
  } else {
    $('fbExample').classList.add('hidden');
    $('btnNext').classList.add('hidden');
    $('fbList').append(el('li', { textContent: '💡 Ayo lengkapi jawabanmu, lalu kirim lagi ya! Kamu pasti bisa. Berani berbuat baik adalah tindakan hebat!' }));
    loseLife('Nilainya belum 60, nyawa berkurang 1 ❤️');
  }
  updateHud();
  fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function retryAnswer() {
  if (!G || G.lives <= 0) return;
  if (G.phase === 'done') G.phase = 'panel'; // memperbaiki jawaban setelah lulus (tanpa batas waktu tambahan)
  G.submitted = false; G.retryAfterPass = true;
  $('feedback').classList.add('hidden');
  $('answerBtns').classList.remove('hidden');
  $('answer').disabled = false; $('btnSubmit').disabled = false;
  $('answer').focus();
}

function loseLife(msg) {
  G.lives--; Aud.play('wrong'); toast(msg, 2600); updateHud();
  if (G.lives <= 0) gameOver();
}

function gameOver() {
  G.phase = 'over'; Aud.play('over');
  showOverlay('😢', 'Nyawamu habis', 'Tidak apa-apa, jangan menyerah! Ayo coba lagi level ini. Kamu pasti bisa lebih baik!',
    '🔁 COBA LAGI LEVEL INI', () => startLevel(G.n), 'KEMBALI KE MENU', () => show('menu'));
}
function showOverlay(icon, title, text, b1, f1, b2, f2) {
  $('ovIcon').textContent = icon; $('ovTitle').textContent = title; $('ovText').textContent = text;
  $('ovBtn1').textContent = b1; $('ovBtn1').onclick = () => { Aud.play('click'); f1(); };
  $('ovBtn2').textContent = b2; $('ovBtn2').onclick = () => { Aud.play('click'); f2(); };
  $('overlay').classList.remove('hidden');
}
function timeUp() {
  G.timeLeft = G.L.time;
  loseLife('⏱ Waktu habis! Nyawa berkurang 1. Ayo lanjutkan!');
}
function nextLevel() {
  if (!G) return;
  if (G.n >= 10) {
    const t = totals(me());
    Aud.play('win');
    showOverlay('🏆', 'Hebat! Petualangan selesai!', 'Skor totalmu ' + t.score + ' dari 1000 dan kamu mendapat ' + t.stars + ' bintang. Berani berbuat baik adalah tindakan hebat!',
      '🏆 LIHAT PAPAN SKOR', () => show('score'), 'KEMBALI KE MENU', () => show('menu'));
  } else startLevel(G.n + 1);
}

/* Pembaruan tiap frame */
function update(dt) {
  if (currentScreen !== 'game' || !G) return;
  G.t += dt;
  // waktu bermain & hitung mundur
  if (G.phase === 'walk' || G.phase === 'panel') {
    G.timeLeft -= dt;
    me().seconds += dt;
    if (G.timeLeft <= 0) timeUp();
    if (G.t - G.lastSave > 5) { G.lastSave = G.t; saveDB(); }
    updateHudTimer();
  }
  // gerak karakter hanya saat fase jalan
  if (G.phase === 'walk') {
    const sp = 230;
    G.moving = false;
    if (keys.left) { G.x -= sp * dt; G.face = -1; G.moving = true; }
    if (keys.right) { G.x += sp * dt; G.face = 1; G.moving = true; }
    G.x = Math.max(40, Math.min(WORLD - 40, G.x));
    if (G.jumpReq && !G.air) { G.vy = -560; G.air = true; Aud.play('jump'); }
    G.jumpReq = false;
    if (G.air) { G.vy += 1500 * dt; G.y += G.vy * dt; if (G.y >= 0) { G.y = 0; G.vy = 0; G.air = false; } }
    if (G.x >= G.L.scene.trigger) openPanel();
  } else G.moving = false;
  // kamera mengikuti
  const target = Math.max(0, Math.min(WORLD - W, G.x - W * 0.4));
  G.camX += (target - G.camX) * Math.min(1, dt * 6);
}
let lastHud = 0;
function updateHudTimer() {
  const s = Math.ceil(G.timeLeft);
  if (s !== lastHud) { lastHud = s; const tm = $('hudTimer'); tm.textContent = '⏱ ' + fmtTime(G.timeLeft); tm.classList.toggle('low', G.timeLeft <= 30); }
}

function render(t) {
  if (currentScreen === 'game' && G) {
    drawScene(ctx, G.L, G.camX, t);
    ctx.save(); ctx.translate(-G.camX, 0);
    // karakter lain
    G.npcs.forEach(c => drawChar(ctx, c, c.x, GROUND, 1, t + (c.seed || 0)));
    // pemain
    const sad = G.phase === 'over';
    drawChar(ctx, { name: G.L.avatar, color: G.L.avatar === 'Luki' ? '#2f9e44' : '#228be6', hair: '#1b1b1b', facing: G.face, moving: G.moving, air: G.air,
      kind: G.phase === 'panel' && G.L.id === 5 ? 'idle' : 'idle', mood: sad ? 'sad' : G.phase === 'done' ? 'happy' : 'happy',
      raise: G.phase === 'panel' && G.L.id === 5, bubble: G.phase === 'panel' && G.L.id !== 5 ? '🤔' : G.phase === 'done' ? '😊' : null },
      G.x, GROUND + G.y, 1, t);
    ctx.restore();
  } else if (currentScreen === 'login' || currentScreen === 'menu') {
    drawHero($('heroLogin'), t); drawHero($('heroMenu'), t);
  }
}
function drawHero(c, t) {
  if (!c.offsetParent) return;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 220); gr.addColorStop(0, '#9be3ff'); gr.addColorStop(1, '#e8fbff');
  g.fillStyle = gr; g.fillRect(0, 0, 360, 220);
  cloud(g, 40 + Math.sin(t / 2) * 12, 40); cloud(g, 240 - Math.sin(t / 2) * 12, 30);
  g.fillStyle = '#7ad468'; g.fillRect(0, 175, 360, 45);
  emoji(g, '🌳', 40, 180, 60); emoji(g, '🏫', 320, 182, 66);
  drawChar(g, { name: 'Sari', color: '#fcc419', hair: '#5c3b1e', girl: true, kind: 'idle', facing: 1 }, 85, 185, 0.8, t);
  drawChar(g, { name: 'Niko', color: '#228be6', hair: '#1b1b1b', kind: 'wave', facing: 1 }, 180, 190, 1.05, t);
  drawChar(g, { name: 'Luki', color: '#2f9e44', hair: '#1b1b1b', kind: 'idle', facing: -1 }, 275, 185, 0.8, t);
}

let lastTs = 0;
function frame(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0); lastTs = ts;
  update(dt); render(ts / 1000);
  requestAnimationFrame(frame);
}

/* ---------- 8. INISIALISASI & PENGHUBUNG TOMBOL ---------- */
function holdButton(btn, key) {
  const on = e => { e.preventDefault(); keys[key] = true; btn.classList.add('on'); };
  const off = e => { e.preventDefault(); keys[key] = false; btn.classList.remove('on'); };
  btn.addEventListener('pointerdown', on); btn.addEventListener('pointerup', off);
  btn.addEventListener('pointerleave', off); btn.addEventListener('pointercancel', off);
  btn.addEventListener('contextmenu', e => e.preventDefault());
}
function refreshSoundButtons() {
  $('btnMusic').classList.toggle('off', !Aud.music); $('btnMusic').textContent = Aud.music ? '🎵' : '🔇';
  $('btnSfx').classList.toggle('off', !Aud.sfx); $('btnSfx').textContent = Aud.sfx ? '🔔' : '🔕';
}

function init() {
  Aud.music = DB.settings.music !== false; Aud.sfx = DB.settings.sfx !== false;
  refreshSoundButtons();
  // Browser meminta interaksi pertama sebelum suara boleh bunyi
  const unlock = () => { Aud.unlock(); };
  window.addEventListener('pointerdown', unlock); window.addEventListener('keydown', unlock);

  $('btnMusic').onclick = e => { e.stopPropagation(); Aud.unlock(); Aud.setMusic(!Aud.music); DB.settings.music = Aud.music; saveDB(); refreshSoundButtons(); };
  $('btnSfx').onclick = e => { e.stopPropagation(); Aud.unlock(); Aud.sfx = !Aud.sfx; DB.settings.sfx = Aud.sfx; saveDB(); refreshSoundButtons(); Aud.play('click'); };

  // login
  const cur = me();
  if (cur) { $('inName').value = cur.name; $('inClass').value = cur.kelas; }
  $('loginForm').addEventListener('submit', doLogin);
  $('btnLoginGuru').onclick = () => { Aud.play('click'); show('teacher'); };

  // menu
  $('btnStart').onclick = () => { Aud.play('click'); show('map'); };
  $('btnHow').onclick = () => { Aud.play('click'); show('how'); };
  $('btnMateri').onclick = () => { Aud.play('click'); show('materi'); };
  $('btnScore').onclick = () => { Aud.play('click'); show('score'); };
  $('btnLogout').onclick = () => { Aud.play('click'); teacherOK = false; loggedIn = false; show('login'); };
  document.querySelectorAll('.back').forEach(b => b.onclick = () => {
    Aud.play('click');
    if (!loggedIn) { teacherOK = false; show('login'); } else show('menu');
  });
  $('scoreClass').onchange = renderScore;

  // panel guru
  $('btnPin').onclick = () => {
    if ($('inPin').value === (DB.pin || PIN_DEFAULT)) { teacherOK = true; $('inPin').value = ''; $('pinMsg').textContent = ''; renderTeacher(); }
    else $('pinMsg').textContent = 'PIN salah. Coba lagi.';
  };
  $('teacherClass').onchange = renderTeacher;
  $('btnCsv').onclick = downloadCSV;
  $('btnNewPin').onclick = () => {
    const v = $('inNewPin').value.trim();
    if (!/^\d{4,8}$/.test(v)) { toast('PIN harus 4-8 angka.'); return; }
    DB.pin = v; saveDB(); $('inNewPin').value = ''; toast('PIN guru diganti ✔');
  };

  // permainan
  $('btnGameMenu').onclick = () => { Aud.play('click'); if (G) { keys.left = keys.right = false; saveDB(); } show('menu'); };
  $('btnHint').onclick = showHint;
  $('btnSubmit').onclick = submitAnswer;
  $('btnRetry').onclick = () => { Aud.play('click'); retryAnswer(); };
  $('btnNext').onclick = () => { Aud.play('click'); nextLevel(); };
  holdButton($('btnLeft'), 'left'); holdButton($('btnRight'), 'right');
  $('btnJump').addEventListener('pointerdown', e => { e.preventDefault(); if (G) G.jumpReq = true; });

  // papan tombol komputer
  window.addEventListener('keydown', e => {
    const tag = (document.activeElement || {}).tagName;
    if (tag === 'TEXTAREA' || tag === 'INPUT') return;
    if (e.key === 'ArrowLeft') { keys.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { keys.right = true; e.preventDefault(); }
    if ((e.key === 'ArrowUp' || e.key === ' ') && G) { G.jumpReq = true; e.preventDefault(); }
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
  });
  // simpan saat tab ditutup
  window.addEventListener('beforeunload', saveDB);

  requestAnimationFrame(frame);
}
init();
