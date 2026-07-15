import { ZoneInfo, ZoneType, Recommendation } from './screening-types';

// ============================================================
// Zona Klasifikasi (3 Zona — SVAS-6)
// Total Skor: 6 - 30
// 6 - 14: SEHAT (Low Risk)
// 15 - 18: BERISIKO (Moderate Risk)
// 19 - 30: KECANDUAN (High Risk / Problematic)
// ============================================================
export const ZONES: Record<ZoneType, ZoneInfo> = {
  SEHAT: {
    label: 'Sehat',
    color: '#10B981', // Green
    bgColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    textColor: '#065f46',
    description: 'Penggunaan media sosial berada dalam batas wajar. Tidak ada indikasi ketergantungan yang mengganggu aktivitas sehari-hari.',
    emoji: '🟢',
  },
  BERISIKO: {
    label: 'Berisiko',
    color: '#F59E0B', // Yellow/Orange
    bgColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    textColor: '#92400e',
    description: 'Kamu mulai menunjukkan tanda-tanda ketergantungan yang berisiko mengganggu keseharian. Diperlukan intervensi ringan untuk membatasi durasi.',
    emoji: '🟡',
  },
  KECANDUAN: {
    label: 'Kecanduan',
    color: '#EF4444', // Red
    bgColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
    textColor: '#7f1d1d',
    description: 'Kamu memiliki Indikasi adanya kecanduan konsumsi video pendek. Sangat disarankan untuk segera melakukan intervensi atau Pengurangan Penggunaan (Digital Detox).',
    emoji: '🔴',
  },
};

// ============================================================
// SVAS-6 Questions
// ============================================================
export const SVAS_QUESTIONS = [
  {
    id: 1,
    key: 'Q1_salience',
    dimension: 'Salience',
    text: 'Aku sering kepikiran buat nonton video pendek (Tiktok, Reels, Shorts). Padahal lagi nggak megang hp.',
    subtitle: 'Fokus Utama',
    contoh: 'Misalnya: Lagi makan atau ngerjain tugas, tapi pengen  nonton video Tiktok.',
  },
  {
    id: 2,
    key: 'Q2_mood_modification',
    dimension: 'Mood Modification',
    text: 'Aku sering jadiin sosmed video pendek buat ngubah mood, entah pas lagi banyak pikiran, butuh hiburan, atau sekadar pengen tenang.',
    subtitle: 'Pengubah Suasana Hati',
    contoh: 'Misalnya: Lagi stres atau bete, Nonton IG Reels buat pelarian biar tenang.',
  },
  {
    id: 3,
    key: 'Q3_tolerance',
    dimension: 'Tolerance',
    text: 'Aku merasa butuh waktu nonton video pendek dan scrolling yang lama sampai bener-bener puas.',
    subtitle: 'Toleransi Waktu',
    contoh: 'Misalnya: Niatnya cuma scroll 5 menit, tapi tahu-tahu bablas sampai sejam karena kurang puas.',
  },
  {
    id: 4,
    key: 'Q4_withdrawal',
    dimension: 'Withdrawal',
    text: 'Aku ngerasa gelisah, cemas, atau gampang bete kalau kebetulan lagi nggak bisa buka aplikasi video pendek.',
    subtitle: 'Gelisah saat Berhenti',
    contoh: 'Misalnya: Pas kuota habis atau nggak ada sinyal, mood kamu langsung anjlok atau gampang bete.',
  },
  {
    id: 5,
    key: 'Q5_conflict',
    dimension: 'Conflict',
    text: 'Aku jadi sering punya masalah dengan orang lain, atau tugas & kerjaanku jadi sering berantakan gara-gara keseringan nonton video pendek di Sosmed.',
    subtitle: 'Konflik & Gangguan Hidup',
    contoh: 'Misalnya: Tugas jadi sering telat atau sering dimarahi gara-gara terus nunda buat nge-scroll HP.',
  },
  {
    id: 6,
    key: 'Q6_relapse',
    dimension: 'Relapse',
    text: 'Aku udah berkali-kali nyoba ngurangin atau berhenti nonton, tapi pada akhirnya selalu gagal dan balik lagi ke kebiasaan lama.',
    subtitle: 'Kambuh Kembali',
    contoh: 'Misalnya: Udah niat banget ngurangin main HP, tapi besoknya bablas lagi nge-scroll seharian.',
  },
] as const;

export const SVAS_OPTIONS = [
  { label: 'Sangat Jarang', value: 1, color: '#047857' },
  { label: 'Jarang', value: 2, color: '#34D399' },
  { label: 'Kadang-kadang', value: 3, color: '#FBBF24' },
  { label: 'Sering', value: 4, color: '#F97316' },
  { label: 'Sangat Sering', value: 5, color: '#EF4444' },
] as const;

// ============================================================
// Dominant Dimension Explanations (SVAS-6)
// ============================================================
export const DOMINANT_EXPLANATIONS: Record<string, string> = {
  Q1_salience: 'Kamu sering terpaku pada pemikiran tentang video pendek bahkan saat tidak membuka aplikasi. Ini menandakan bahwa aplikasi telah merebut fokus kognitif kamu secara berkelanjutan.',
  Q2_mood_modification: 'Kamu sangat mengandalkan video pendek sebagai satu-satunya cara untuk mengatasi masalah emosional (seperti stres atau kesedihan), menghambat strategi penyelesaian masalah yang nyata.',
  Q3_tolerance: 'Kamu merasa perlu menambah durasi menonton dari waktu ke waktu untuk mendapatkan kepuasan yang sama. Ini adalah tanda toleransi yang mulai terbangun.',
  Q4_withdrawal: 'Kamu merasa gelisah, cemas, atau tidak nyaman ketika tidak bisa mengakses video pendek. Ini merupakan tanda awal dari siklus adiksi psikologis.',
  Q5_conflict: 'Kebiasaan menontonmu telah memicu konflik di dunia nyata, baik itu pertengkaran, terganggunya hubungan sosial, atau kacaunya produktivitas dan tugas.',
  Q6_relapse: 'Kamu sudah mencoba untuk berhenti atau mengurangi menonton, tapi selalu gagal. Ini menunjukkan bahwa kamu mulai kehilangan kontrol atas kebiasaanmu.',
};

// ============================================================
// Detailed Dimension Explanations (For Accordion UI)
// ============================================================
export const DIMENSION_DETAILS: Record<string, { basic: string; scale12: string; scale3: string; scale45: string; solusi12: string[]; solusi3: string[]; solusi45: string[] }> = {
  Q1_salience: {
    basic: 'Salience (Fokus Utama) adalah kondisi ketika aktivitas menonton video pendek menjadi bagian yang paling dominan dalam kehidupan sehari-hari. Seseorang mulai memikirkan media sosial bahkan ketika sedang tidak menggunakannya. Keinginan untuk membuka aplikasi muncul secara terus-menerus sehingga perhatian terhadap aktivitas lain menjadi berkurang. Misalnya, ketika sedang belajar, bekerja, makan bersama keluarga, atau berkumpul dengan teman, pikiran tetap tertuju pada video-video terbaru yang ingin ditonton.',
    scale12: 'Penggunaan media sosial masih wajar. Pengguna tidak terlalu sering memikirkan media sosial dan masih mampu memprioritaskan aktivitas lain seperti belajar, bekerja, istirahat, atau berinteraksi langsung.',
    scale3: 'Media sosial mulai cukup sering muncul dalam pikiran atau kebiasaan harian. Pengguna mungkin sering mengecek media sosial saat bosan atau senggang, tetapi masih bisa mengendalikan diri.',
    scale45: 'Media sosial sudah menjadi pusat perhatian yang kuat. Pengguna sering merasa terdorong untuk membuka media sosial, bahkan saat sedang belajar, bekerja, beristirahat, atau melakukan aktivitas penting lain.',
    solusi12: [
      'Jadikan media sosial sebatas hiburan tambahan saja, dan atur waktu penggunaannya agar tetap wajar.',
      'Coba matikan notifikasi aplikasi yang kurang penting biar kamu nggak mudah terdistraksi.',
      'Hindari kebiasaan langsung membuka media sosial begitu bangun tidur.',
      'Tetap rutin lakukan aktivitas di dunia nyata, seperti belajar, berolahraga, dan pastikan jam tidurmu cukup.'
    ],
    solusi3: [
      'Mulai tentukan jadwal khusus untuk mengecek media sosial, misalnya cukup 3-4 kali sehari saja.',
      'Pindahkan aplikasi dari layar utamamu supaya tangan nggak otomatis membukanya.',
      'Jangan ragu memakai fitur \'mode fokus\' di HP saat kamu sedang harus konsentrasi belajar atau bekerja.',
      'Kalau tiba-tiba muncul dorongan kuat untuk membuka HP, alihkan perhatian dengan hal simpel seperti minum air putih atau berjalan sebentar.'
    ],
    solusi45: [
      'Sudah saatnya kamu pasang batas waktu (screen time limit) yang tegas atau gunakan pemblokir aplikasi.',
      'Tetapkan aturan "zona bebas ponsel" saat kamu sedang makan, beribadah, atau bersiap tidur.',
      'Kurangi waktumu perlahan-lahan saja, supaya kamu nggak merasa ketinggalan zaman (FOMO) secara berlebihan.',
      'Mintalah bantuan keluarga atau teman dekat untuk ikut menegur dan mengingatkanmu kalau sudah mulai berlebihan.'
    ]
  },
  Q2_mood_modification: {
    basic: 'Mood Modification (Pengubah Suasana Hati) adalah kondisi ketika seseorang menggunakan media sosial sebagai cara utama untuk mengurangi stres, menghilangkan rasa bosan, mengatasi kesepian, atau memperbaiki suasana hati. Video pendek memberikan hiburan secara instan sehingga otak mulai menganggap aktivitas tersebut sebagai "pelarian" dari masalah.',
    scale12: 'Pengguna mungkin memakai media sosial untuk hiburan, tetapi tidak menjadikannya cara utama untuk mengatasi emosi negatif.',
    scale3: 'Pengguna cukup sering membuka media sosial saat sedang bosan, stres, atau tidak nyaman secara emosional. Namun, pengguna masih memiliki cara lain untuk mengatur suasana hati.',
    scale45: 'Pengguna sangat bergantung pada media sosial untuk merasa lebih baik. Saat sedih, cemas, bosan, atau kesepian, media sosial menjadi pelarian utama dan sulit digantikan oleh aktivitas lain.',
    solusi12: [
      'Gunakan media sosial sekadar untuk hiburan santai, bukan sebagai pelarian utama saat suasana hati sedang buruk.',
      'Lakukan cara yang lebih sehat untuk melepas penat, seperti berolahraga, melakukan hobi, atau sekadar tidur cukup.',
      'Kenali dulu emosi dan perasaanmu sendiri sebelum memutuskan untuk tenggelam di media sosial.'
    ],
    solusi3: [
      'Biasakan memberi jeda 5-10 menit sebelum membuka aplikasi, terutama saat kamu sedang merasa bad mood atau sedih.',
      'Sadari dulu apa yang sedang kamu rasakan (apakah hanya bosan, lelah, atau memang sedang stres).',
      'Coba tenangkan diri tanpa layar HP dulu, misalnya dengan menarik napas panjang atau jalan kaki sebentar di luar.',
      'Mulai kurangi atau unfollow konten-konten yang justru bikin kamu suka membanding-bandingkan diri dengan orang lain.'
    ],
    solusi45: [
      'Sebisa mungkin hindari scrolling terus-menerus (doomscrolling) saat pikiranmu sedang penat atau stres.',
      'Buat alternatif kegiatan lain saat kamu butuh pelarian, misalnya langsung mengobrol santai dengan teman atau pergi berolahraga.',
      'Kalau rasa cemas dan gelisahmu masih terus mengganggu, nggak ada salahnya lho untuk mengobrol dengan psikolog atau konselor profesional.'
    ]
  },
  Q3_tolerance: {
    basic: 'Tolerance (Toleransi Waktu) adalah kondisi ketika seseorang membutuhkan waktu penggunaan media sosial yang semakin lama untuk memperoleh kepuasan yang sama. Jika sebelumnya merasa puas setelah menonton selama 15 menit, lama-kelamaan durasi tersebut meningkat menjadi satu jam, dua jam, bahkan lebih.',
    scale12: 'Pengguna masih merasa puas dengan durasi menonton yang sama dari waktu ke waktu.',
    scale3: 'Pengguna kadang merasa perlu menambah sedikit durasi menonton untuk merasa terhibur.',
    scale45: 'Pengguna harus menonton lebih lama secara signifikan karena durasi yang sebelumnya tidak lagi memberikan kepuasan.',
    solusi12: [
      'Ketahui dengan jelas apa tujuanmu membuka aplikasi, supaya kamu nggak cuma scrolling tanpa arah.',
      'Sesekali pasang timer atau alarm agar kamu sadar sudah berapa lama kamu memegang HP.',
      'Coba biasakan mengecek laporan screen time mingguanmu di HP agar tetap terkontrol.'
    ],
    solusi3: [
      'Mulai gunakan fitur pembatas waktu untuk aplikasi-aplikasi yang bikin kamu lupa waktu.',
      'Biasakan mendisiplinkan diri untuk menyelesaikan tugas atau pekerjaan penting dulu sebelum bebas mengecek media sosial.',
      'Gunakan metode Pomodoro (fokus belajar dengan jeda istirahat), dan cobalah logout dari aplikasi favoritmu supaya kamu nggak otomatis membukanya.'
    ],
    solusi45: [
      'Jangan ragu untuk mengatur aplikasi pemblokir otomatis yang mengunci HP-mu pada jam-jam rawan.',
      'Kalau dirasa perlu, hapus saja dulu aplikasi yang paling sering bikin kamu candu untuk sementara waktu.',
      'Taruh ponsel agak jauh dari pandanganmu saat kamu butuh konsentrasi penuh atau saat mau tidur.',
      'Libatkan orang di sekitarmu untuk bantu memantau targetmu mengurangi waktu bermain HP.'
    ]
  },
  Q4_withdrawal: {
    basic: 'Withdrawal (Gelisah saat Berhenti) adalah munculnya perasaan tidak nyaman ketika tidak dapat mengakses media sosial. Perasaan tersebut dapat berupa gelisah, bosan, mudah marah, atau cemas ketika akses terhadap aplikasi dibatasi. Perlu dipahami bahwa pada kecanduan perilaku, withdrawal lebih banyak berupa gejala psikologis, bukan gejala fisik seperti pada ketergantungan zat.',
    scale12: 'Pengguna tetap merasa nyaman dan tenang saat tidak membuka media sosial.',
    scale3: 'Pengguna mulai merasa kurang nyaman atau sedikit gelisah jika tidak membuka media sosial dalam waktu tertentu.',
    scale45: 'Pengguna merasa sangat gelisah, cemas, atau tidak nyaman saat tidak bisa mengakses video pendek yang dapat mengganggu keseharian.',
    solusi12: [
      'Biasakan luangkan waktu sejenak tanpa memegang HP sama sekali, misalnya waktu lagi asyik makan atau mandi.',
      'Sadari bahwa nggak semua kegiatan mengharuskanmu terus mengantongi HP.',
      'Cobalah tahan diri sebentar saat sedang menunggu sesuatu, tanpa langsung refleks membuka aplikasi.'
    ],
    solusi3: [
      'Latihlah dirimu untuk tidak menyentuh media sosial selama 15-30 menit sehari, dan naikkan batas waktunya secara perlahan.',
      'Kalau kamu mulai merasa gelisah karena terlepas dari HP, coba tenangkan dirimu (misalnya dengan menarik napas panjang dan teratur).',
      'Atur jam berapa saja kamu boleh mengecek notifikasi, supaya rasa penasaranmu tidak menumpuk dan bisa lebih terkontrol.'
    ],
    solusi45: [
      'Jangan terburu-buru, kurangi saja waktumu bermain HP sedikit demi sedikit, misalnya turunkan target 15-30 menit setiap harinya.',
      'Cari aktivitas seru atau menenangkan lainnya untuk menggantikan posisi media sosial di keseharianmu.',
      'Hindari langsung berhenti total dari media sosial secara mendadak, karena itu malah bisa bikin kamu makin cemas dan stres.'
    ]
  },
  Q5_conflict: {
    basic: 'Conflict (Konflik & Gangguan Hidup) terjadi ketika penggunaan media sosial mulai mengganggu tanggung jawab, hubungan sosial, maupun aktivitas sehari-hari. Konflik dapat terjadi dengan diri sendiri karena merasa bersalah telah menghabiskan banyak waktu, maupun dengan orang lain akibat penggunaan media sosial yang berlebihan.',
    scale12: 'Penggunaan media sosial belum menyebabkan konflik atau masalah yang berarti di dunia nyata.',
    scale3: 'Mulai muncul gangguan kecil seperti menunda tugas penting atau teguran dari orang terdekat karena terlalu sering bermain HP.',
    scale45: 'Kebiasaan menonton telah memicu pertengkaran serius atau mengacaukan produktivitas dan hubungan sosial secara signifikan.',
    solusi12: [
      'Jaga selalu pola tidurmu agar tetap cukup dan teratur setiap harinya.',
      'Berusahalah untuk sama sekali tidak melirik media sosial saat sedang serius belajar, bekerja, ataupun berkendara.',
      'Selektiflah memilih konten; ikuti hal-hal yang bikin suasana hati membaik dan tinggalkan yang bikin kamu jadi pusing sendiri.'
    ],
    solusi3: [
      'Kalau tidurmu mulai kacau, wajibkan dirimu untuk mematikan media sosial minimal satu jam sebelum masuk kamar tidur.',
      'Saat pekerjaan menumpuk, manfaatkan mode fokus di HP dan taruh ponsel sedikit lebih jauh dari jangkauan tanganmu.',
      'Mulailah membatasi atau langsung unfollow akun-akun yang sering kali memancing emosi atau merusak konsentrasimu.'
    ],
    solusi45: [
      'Susun komitmen yang jelas untuk mengurangi jam main HP, serta utamakan kesehatan tidur, urusan kampus/pekerjaan, dan pertemananmu.',
      'Cobalah mengatur ponselmu agar otomatis memblokir aplikasi hiburan saat sudah larut malam.',
      'Jika kondisinya membuatmu sulit tidur parah hingga menjauh dari lingkungan sosial, jangan ragu untuk mencari bantuan dari ahli.'
    ]
  },
  Q6_relapse: {
    basic: 'Relapse (Kambuh Kembali) adalah kondisi ketika seseorang kembali menggunakan media sosial secara berlebihan setelah sebelumnya berhasil mengurangi atau menghentikan penggunaannya. Kondisi ini umum terjadi dalam proses perubahan perilaku dan bukan berarti seluruh usaha sebelumnya gagal.',
    scale12: 'Pengguna masih mampu menahan diri dan konsisten dengan batasan waktu yang telah dibuat.',
    scale3: 'Pengguna kadang melanggar janji sendiri untuk mengurangi durasi, tetapi masih mencoba untuk memperbaikinya.',
    scale45: 'Pengguna selalu gagal setiap kali mencoba mengurangi waktu menonton dan terus terjebak di pola yang sama.',
    solusi12: [
      'Biasakan melirik catatan waktu layar (screen time) di ponselmu setiap akhir pekan sebagai bahan evaluasi.',
      'Tahan godaan untuk mengunduh aplikasi-aplikasi hiburan baru yang rawan bikin candu.',
      'Buat batasan pribadi yang realistis, terutama untuk durasi scroll konten video pendek yang sering bikin lupa waktu.'
    ],
    solusi3: [
      'Terus turunkan target bermain ponselmu perlahan, sekitar 10-20% setiap minggunya agar tubuh dan pikiranmu lebih mudah beradaptasi.',
      'Coba sadari jenis konten seperti apa yang paling banyak membuang waktumu, lalu mulai batasi konsumsinya.',
      'Gantikan jam layar tersebut dengan kesibukan yang lebih bermanfaat, seperti melakukan hobi baru atau sekadar nongkrong bersama teman.'
    ],
    solusi45: [
      'Buatlah target mingguan yang terukur dan realistis supaya niatmu mengurangi kecanduan bisa lebih konsisten terwujud.',
      'Kalau batasan waktu terasa nggak mempan, kumpulkan keberanian untuk menghapus sementara aplikasi yang paling bikin candu tersebut.',
      'Sengaja jadwalkan kegiatan offline yang bisa kasih kamu rasa bangga saat menyelesaikannya, agar perlahan menjauh dari layar HP.'
    ]
  }
};

// ============================================================
// Platform Configuration
// ============================================================
export const PLATFORM_CONFIG = [
  {
    key: 'instagram' as const,
    name: 'Instagram',
    color: '#E1306C',
    bgColor: 'rgba(225, 48, 108, 0.08)',
    borderColor: 'rgba(225, 48, 108, 0.2)',
    emoji: '',
  },
  {
    key: 'tiktok' as const,
    name: 'TikTok',
    color: '#00F2EA',
    bgColor: 'rgba(0, 242, 234, 0.08)',
    borderColor: 'rgba(0, 242, 234, 0.2)',
    emoji: '',
  },
  {
    key: 'youtube' as const,
    name: 'YouTube',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.08)',
    borderColor: 'rgba(255, 0, 0, 0.2)',
    emoji: '',
  },
  {
    key: 'twitter' as const,
    name: 'Twitter / X',
    color: '#1D9BF0',
    bgColor: 'rgba(29, 155, 240, 0.08)',
    borderColor: 'rgba(29, 155, 240, 0.2)',
    emoji: '',
  },
] as const;

// ============================================================
// Rekomendasi per Zona
// ============================================================// Rekomendasi dibagi berdasarkan Zona
export const RECOMMENDATIONS: Record<ZoneType, Recommendation[]> = {
  SEHAT: [
    {
      priority: 1,
      title: 'Pesan Motivasi',
      description: 'Selamat! Penggunaan Kamu saat ini tergolong sehat. Pertahankan literasi digital dan batasan yang sudah ada.',
      icon: 'sentiment_very_satisfied',
    },
    {
      priority: 2,
      title: 'Evaluasi Mandiri Berkala',
      description: 'Sarankan melakukan tes ulang dalam 1 bulan untuk memastikan kebiasaan tetap terkontrol.',
      icon: 'fact_check',
    },
  ],
  BERISIKO: [
    {
      priority: 1,
      title: 'Batasi Durasi Akses (Segera)',
      description: 'Segera batasi durasi penggunaan aplikasi video pendek.',
      icon: 'timer',
      urgent: true,
    },
    {
      priority: 2,
      title: 'Matikan Autoplay',
      description: 'Matikan fitur autoplay di pengaturan aplikasi (TikTok/Reels) untuk mencegah transisi tontonan otomatis.',
      icon: 'app_blocking',
    },
    {
      priority: 3,
      title: 'Waktu Bebas Gadget',
      description: 'Tentukan jam "Bebas Gadget" setiap harinya, misalnya 1 jam penuh sebelum waktu tidur.',
      icon: 'schedule',
    },
  ],
  KECANDUAN: [
    {
      priority: 1,
      title: 'Tindakan Segera Pemulihan Mental',
      description: 'Dibutuhkan tindakan segera untuk pemulihan mental. Hentikan eksploitasi reward dopamin instan.',
      icon: 'warning',
      urgent: true,
    },
    {
      priority: 2,
      title: 'Modifikasi Visual (Grayscale)',
      description: 'Ubah layar HP ke mode Hitam-Putih (Grayscale) dari aksesibilitas untuk menghilangkan daya tarik visual yang adiktif.',
      icon: 'color_lens',
    },
    {
      priority: 3,
      title: 'Digital Detox',
      description: 'Lakukan Digital Detox. Hapus aplikasi video pendek dari smartphone kamu selama minimal 24 jam.',
      icon: 'delete_forever',
      urgent: true,
    },
    {
      priority: 4,
      title: 'Bantuan Profesional (Hotline)',
      description: 'Segera hubungi layanan konseling psikologi jika merasakan kecemasan berat atau depresi berkepanjangan.',
      icon: 'support_agent',
      urgent: true,
    },
  ],
};
