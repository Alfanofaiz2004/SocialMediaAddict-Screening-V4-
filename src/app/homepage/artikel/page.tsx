'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ScreeningHeader from '@/components/ScreeningHeader';

export default function ArtikelPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased">
      <ScreeningHeader />

      <main className="flex-grow w-full flex flex-col items-center pb-24">
        {/* Article Container - Diperlebar menjadi max-w-5xl */}
        <article className="w-full max-w-7xl px-6 md:px-12 mt-12 md:mt-16">
          
          {/* ─── HEADER ARTIKEL ─── */}
          <header className="mb-12 border-b border-outline-variant pb-8">
            <div className="flex items-center gap-3 text-primary text-sm md:text-base font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              Deep Dive & Edukasi
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface leading-tight mb-6 text-left">
              Membedah SVAS-6: Landasan Ilmiah di Balik Kecanduan Video Pendek
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-sm md:text-base">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>Ditulis oleh Tim MindScroll</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span>Waktu Baca: ~8 Menit</span>
              </div>
            </div>
          </header>

          {/* ─── ISI ARTIKEL ─── */}
          <div className="prose md:prose-lg max-w-none text-on-surface-variant leading-relaxed space-y-6 text-justify [&_h2]:text-left [&_h3]:text-left">
            <p>
              Pernah nggak sih, kamu niatnya cuma mau ngecek TikTok, Instagram Reels, atau YouTube Shorts selama 5 menit aja... eh pas lihat jam, tahu-tahu udah subuh? Tenang, kamu nggak sendirian. Di era digital sekarang, algoritma super canggih bekerja siang-malam buat bikin kamu nggak bisa berhenti nge-<em>scroll</em>.
            </p>
            <p>
              Fenomena ini sering disebut sebagai <strong>"Dopamine Economy"</strong>. Saat kamu nemu konten menarik, otakmu melepaskan dopamin (hormon bahagia). Masalahnya, kalau otak keseringan ditembak dopamin instan, kegiatan dunia nyata yang ritmenya lambat bakal terasa super ngebosenin. Dari keresahan inilah website <em>screening</em> ini lahir. Kami pengen bantu kamu mengukur secara objektif: sejauh mana perilaku <em>scrolling</em> ini udah masuk ke tahap adiktif?
            </p>

            <h2 className="text-2xl md:text-4xl font-bold text-on-surface mt-14 mb-6">
              Kenalan Dulu Sama SVAS-6 (Short Video Addiction Scale)
            </h2>
            <p>
              Tes yang kamu kerjain di website ini tuh bukan kuis tebak-tebakan abal-abal, lho. Kami menggunakan instrumen psikometrik asli bernama <strong>Short Video Addiction Scale (SVAS)</strong>. Skala ini awalnya dikembangkan dan divalidasi oleh para peneliti di China (Ye et al., 2024) di bidang psikologi dan perilaku digital, sebagai respons terhadap betapa gilanya fenomena kecanduan platform video pendek secara global.
            </p>
            <p>
              Secara ilmiah, SVAS dirancang berdasarkan konsep <em>behavioral addiction</em> (kecanduan perilaku). Instrumen ini awalnya diadaptasi dari <em>Bergen Facebook Addiction Scale (BFAS)</em>, yang kemudian dioptimalkan lagi menjadi versi super ringkas yang disebut <strong>SVAS-6 items</strong>. Dengan cuma enam butir pernyataan, alat ini udah bisa mengidentifikasi kecenderungan perilaku adiktif seseorang dengan sangat presisi.
            </p>
            <p>
              Biar kamu makin yakin, instrumen ini punya performa psikometrik yang "sakti" banget di dunia akademik! Pengujian konsistensi internalnya menunjukkan nilai koefisien <em>Cronbach's alpha</em> sebesar 0,799 dan <em>McDonald's omega</em> 0,808. Stabilitas metrik skala ini juga diperkuat oleh nilai <em>intraclass correlation coefficient (ICC)</em> sebesar 0,994 serta rentang <em>Cohen's kappa</em> antara 0,667 hingga 0,913. Ditambah lagi, lewat analisis faktor konfirmatori, SVAS-6 terbukti sebagai instrumen satu faktor yang sangat ringkas dan efisien (Katsiroumpa et al., 2025).
            </p>

            <h2 className="text-2xl md:text-4xl font-bold text-on-surface mt-14 mb-6">
              Anatomi Candu: Bedah 6 Dimensi Indikator SVAS-6
            </h2>
            <p>
              Kalau kamu udah ikut tesnya, pasti kamu lihat grafik radar keren yang bentuknya punya 6 sudut, kan? Keenam sudut itu mewakili 6 indikator utama dari instrumen SVAS-6. Yuk, kita bedah satu per satu!
            </p>

            <h3 className="text-xl md:text-3xl font-bold text-on-surface mt-12 mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[32px]">psychology</span>
              1. Fokus Utama (Salience)
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-on-surface font-medium">
              Salience adalah kondisi ketika aktivitas menonton video pendek menjadi bagian yang paling dominan dalam kehidupan sehari-hari. Seseorang mulai memikirkan media sosial bahkan ketika sedang tidak menggunakannya. Keinginan untuk membuka aplikasi muncul secara terus-menerus sehingga perhatian terhadap aktivitas lain menjadi berkurang.
            </p>
            <p className="mt-2 text-on-surface-variant/80 italic md:text-lg">
              Misalnya, ketika sedang belajar, bekerja, makan bersama keluarga, atau berkumpul dengan teman, pikiran tetap tertuju pada video-video terbaru yang ingin ditonton.
            </p>
            <div className="mt-5 bg-surface-variant/30 rounded-xl p-5 md:p-6 space-y-4 text-sm md:text-base border border-outline-variant">
              <div>
                <strong className="text-primary block mb-1">Contoh perilaku:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sering membuka TikTok tanpa tujuan tertentu.</li>
                  <li>Merasa ada yang kurang jika belum membuka media sosial.</li>
                  <li>Sulit berkonsentrasi karena terus memikirkan konten terbaru.</li>
                  <li>Secara otomatis membuka aplikasi setiap kali merasa bosan.</li>
                </ul>
              </div>
              <div>
                <strong className="text-error block mb-1">Dampak:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Konsentrasi menurun & produktivitas berkurang.</li>
                  <li>Sulit menyelesaikan pekerjaan.</li>
                  <li>Hubungan sosial mulai terganggu.</li>
                </ul>
              </div>
              <div>
                <strong className="text-secondary block mb-1">Cara mengatasinya:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tentukan waktu khusus untuk membuka media sosial.</li>
                  <li>Matikan notifikasi aplikasi yang tidak penting.</li>
                  <li>Letakkan aplikasi media sosial pada folder tersembunyi agar tidak mudah dibuka.</li>
                  <li>Isi waktu luang dengan aktivitas lain seperti membaca buku, berolahraga, atau berbicara dengan keluarga.</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl md:text-3xl font-bold text-on-surface mt-12 mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[32px]">mood</span>
              2. Pengubah Suasana Hati (Mood Modification)
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-on-surface font-medium">
              Mood Modification adalah kondisi ketika seseorang menggunakan media sosial sebagai cara utama untuk mengurangi stres, menghilangkan rasa bosan, mengatasi kesepian, atau memperbaiki suasana hati. Video pendek memberikan hiburan secara instan sehingga otak mulai menganggap aktivitas tersebut sebagai "pelarian" dari masalah.
            </p>
            <div className="mt-5 bg-surface-variant/30 rounded-xl p-5 md:p-6 space-y-4 text-sm md:text-base border border-outline-variant">
              <div>
                <strong className="text-primary block mb-1">Contoh perilaku:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Membuka TikTok setiap kali merasa sedih.</li>
                  <li>Menonton Reels saat sedang stres.</li>
                  <li>Menggunakan media sosial ketika merasa kesepian.</li>
                  <li>Sulit merasa tenang tanpa menonton video.</li>
                </ul>
              </div>
              <div>
                <strong className="text-error block mb-1">Dampak:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ketergantungan emosional terhadap media sosial.</li>
                  <li>Kesulitan mengelola emosi secara sehat.</li>
                  <li>Masalah yang sebenarnya tidak pernah diselesaikan.</li>
                </ul>
              </div>
              <div>
                <strong className="text-secondary block mb-1">Cara mengatasinya:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cobalah teknik relaksasi seperti pernapasan dalam.</li>
                  <li>Berjalan santai selama 15–30 menit.</li>
                  <li>Mendengarkan musik atau menulis jurnal harian.</li>
                  <li>Berbicara dengan teman atau keluarga yang dipercaya.</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl md:text-3xl font-bold text-on-surface mt-12 mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[32px]">update</span>
              3. Toleransi Waktu (Tolerance)
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-on-surface font-medium">
              Tolerance adalah kondisi ketika seseorang membutuhkan waktu penggunaan media sosial yang semakin lama untuk memperoleh kepuasan yang sama. Jika sebelumnya merasa puas setelah menonton selama 15 menit, lama-kelamaan durasi tersebut meningkat menjadi satu jam, dua jam, bahkan lebih.
            </p>
            <div className="mt-5 bg-surface-variant/30 rounded-xl p-5 md:p-6 space-y-4 text-sm md:text-base border border-outline-variant">
              <div>
                <strong className="text-primary block mb-1">Contoh perilaku:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Durasi penggunaan terus bertambah.</li>
                  <li>Sulit berhenti setelah satu video.</li>
                  <li>Selalu berkata "sebentar lagi" tetapi akhirnya menonton jauh lebih lama.</li>
                </ul>
              </div>
              <div>
                <strong className="text-error block mb-1">Dampak:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Waktu belajar dan tidur terganggu.</li>
                  <li>Aktivitas fisik dan produktivitas menurun.</li>
                </ul>
              </div>
              <div>
                <strong className="text-secondary block mb-1">Cara mengatasinya:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Gunakan fitur Screen Time atau Digital Wellbeing.</li>
                  <li>Pasang batas penggunaan harian.</li>
                  <li>Gunakan teknik Pomodoro saat belajar.</li>
                  <li>Letakkan ponsel jauh dari tempat belajar atau bekerja.</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl md:text-3xl font-bold text-on-surface mt-12 mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[32px]">sick</span>
              4. Gelisah saat Berhenti (Withdrawal)
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-on-surface font-medium">
              Withdrawal adalah munculnya perasaan tidak nyaman ketika tidak dapat mengakses media sosial. Perasaan tersebut dapat berupa gelisah, bosan, mudah marah, atau cemas ketika akses terhadap aplikasi dibatasi. Perlu dipahami bahwa pada kecanduan perilaku, withdrawal lebih banyak berupa gejala psikologis, bukan gejala fisik seperti pada ketergantungan zat.
            </p>
            <div className="mt-5 bg-surface-variant/30 rounded-xl p-5 md:p-6 space-y-4 text-sm md:text-base border border-outline-variant">
              <div>
                <strong className="text-primary block mb-1">Contoh perilaku:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Gelisah saat ponsel tertinggal.</li>
                  <li>Terus memikirkan media sosial ketika tidak ada internet.</li>
                  <li>Mudah marah ketika diminta berhenti menggunakan ponsel.</li>
                </ul>
              </div>
              <div>
                <strong className="text-error block mb-1">Dampak:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Konsentrasi terganggu.</li>
                  <li>Emosi menjadi tidak stabil.</li>
                  <li>Sulit menikmati aktivitas tanpa media sosial.</li>
                </ul>
              </div>
              <div>
                <strong className="text-secondary block mb-1">Cara mengatasinya:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Kurangi durasi penggunaan secara bertahap.</li>
                  <li>Mulailah dengan periode bebas gawai selama 30–60 menit setiap hari.</li>
                  <li>Lakukan aktivitas yang tidak melibatkan layar, seperti membaca atau berolahraga.</li>
                  <li>Mintalah dukungan keluarga atau teman agar proses pengurangan konsisten.</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl md:text-3xl font-bold text-on-surface mt-12 mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[32px]">gavel</span>
              5. Konflik & Gangguan Hidup (Conflict)
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-on-surface font-medium">
              Conflict terjadi ketika penggunaan media sosial mulai mengganggu tanggung jawab, hubungan sosial, maupun aktivitas sehari-hari. Konflik dapat terjadi dengan diri sendiri karena merasa bersalah telah menghabiskan banyak waktu, maupun dengan orang lain akibat penggunaan media sosial yang berlebihan.
            </p>
            <div className="mt-5 bg-surface-variant/30 rounded-xl p-5 md:p-6 space-y-4 text-sm md:text-base border border-outline-variant">
              <div>
                <strong className="text-primary block mb-1">Contoh perilaku:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Nilai akademik menurun atau pekerjaan tertunda.</li>
                  <li>Sering mengabaikan keluarga.</li>
                  <li>Bertengkar karena terlalu sering bermain ponsel.</li>
                </ul>
              </div>
              <div>
                <strong className="text-error block mb-1">Dampak:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Prestasi menurun dan hubungan sosial memburuk.</li>
                  <li>Stres meningkat dan muncul rasa bersalah.</li>
                </ul>
              </div>
              <div>
                <strong className="text-secondary block mb-1">Cara mengatasinya:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Susun jadwal harian yang seimbang.</li>
                  <li>Dahulukan pekerjaan sebelum membuka media sosial.</li>
                  <li>Terapkan aturan "tidak menggunakan ponsel" saat makan bersama atau belajar.</li>
                  <li>Evaluasi penggunaan media sosial setiap minggu.</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl md:text-3xl font-bold text-on-surface mt-12 mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[32px]">sync_problem</span>
              6. Kambuh Kembali (Relapse)
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-on-surface font-medium">
              Relapse adalah kondisi ketika seseorang kembali menggunakan media sosial secara berlebihan setelah sebelumnya berhasil mengurangi atau menghentikan penggunaannya. Kondisi ini umum terjadi dalam proses perubahan perilaku dan bukan berarti seluruh usaha sebelumnya gagal.
            </p>
            <div className="mt-5 bg-surface-variant/30 rounded-xl p-5 md:p-6 space-y-4 text-sm md:text-base border border-outline-variant">
              <div>
                <strong className="text-primary block mb-1">Contoh perilaku:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Berhasil mengurangi penggunaan selama beberapa hari, tetapi kembali menghabiskan waktu berjam-jam.</li>
                  <li>Menghapus aplikasi, kemudian memasangnya kembali karena tidak dapat menahan keinginan.</li>
                </ul>
              </div>
              <div>
                <strong className="text-error block mb-1">Dampak:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Motivasi menurun.</li>
                  <li>Merasa gagal.</li>
                  <li>Sulit mempertahankan kebiasaan baru.</li>
                </ul>
              </div>
              <div>
                <strong className="text-secondary block mb-1">Cara mengatasinya:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Jangan menyalahkan diri sendiri jika terjadi kekambuhan.</li>
                  <li>Identifikasi situasi yang memicu penggunaan berlebihan (misalnya stres, bosan).</li>
                  <li>Tetapkan target yang realistis, seperti mengurangi durasi sedikit demi sedikit.</li>
                  <li>Gunakan fitur pengingat waktu penggunaan dan minta dukungan.</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-on-surface mt-14 mb-6">
              Skoring SVAS-6 dan 3 Tujuan Utama Skrining
            </h2>
            <p>
              Dalam penelitian aslinya, skala SVAS-6 menetapkan nilai ambang batas (<em>cut-off point</em>) optimal sebesar 15. Artinya, kalau skor totalmu <strong>≥ 15</strong>, itu mengindikasikan kecenderungan penggunaan video pendek yang problematis dengan probabilitas kecanduan tinggi. Sebaliknya, kalau skormu <strong>&lt; 15</strong>, kamu dikategorikan sebagai pengguna yang sehat (Katsiroumpa et al., 2025). 
            </p>
            <p>
              Di website kami, perhitungan tersebut dikonversi secara otomatis ke dalam sistem persentase dan visual zona skor (Normal, Waspada, Kritis) agar lebih gampang kamu pahami. Penggunaan instrumen SVAS dalam penelitian dan praktik klinis (termasuk website ini) sebenarnya mencakup 3 aspek utama:
            </p>
            <ul className="list-disc pl-6 space-y-4 my-6 marker:text-primary">
              <li>
                <strong>Sebagai Sarana Skrining (Deteksi Dini):</strong> Mengidentifikasi individu yang berisiko mengalami gangguan perilaku akibat penggunaan video pendek yang berlebihan sebelum jadi makin parah.
              </li>
              <li>
                <strong>Sebagai Instrumen Pemetaan Perilaku:</strong> Membantu kita memahami dimensi kecanduan mana yang paling dominan. Misalnya, apakah kamu paling bermasalah di hilangnya kontrol (Relapse) atau malah di gangguan tanggung jawab (Conflict)?
              </li>
              <li>
                <strong>Sebagai Alat Evaluasi Intervensi:</strong> Dipakai untuk menilai efektivitas tindakan pencegahan. Coba tes lagi bulan depan setelah kamu ngurangin jatah main HP, dan lihat apakah skor SVAS-mu membaik!
              </li>
            </ul>

            <h2 className="text-2xl md:text-4xl font-bold text-on-surface mt-14 mb-6">
              Kenapa Kami Juga Menanyakan Kualitas Tidur & Produktivitas?
            </h2>
            <p>
              Mungkin kamu bingung, "Tes kecanduan kok nanyain jam tidur sama gangguan produktivitas?" <em>Well</em>, kecanduan medsos itu nggak pernah menyerang sendirian. Dia bakal ngerusak pilar utama kesehatanmu melalui dua jalur ini:
            </p>
            
            <h3 className="text-xl md:text-3xl font-bold text-on-surface mt-12 mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[32px]">brightness_4</span>
              1. Manipulasi Sirkadian (Efek Blue Light)
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-on-surface font-medium">
              Layar HP memancarkan cahaya biru (<em>blue light</em>) yang menipu kelenjar di otakmu buat mikir "Oh, masih siang nih." Akibatnya, produksi melatonin (hormon tidur) mandek. Efeknya? Kamu jadi susah tidur, kualitas tidur memburuk, dan siklus sirkadianmu berantakan.
            </p>

            <h3 className="text-xl md:text-3xl font-bold text-on-surface mt-12 mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[32px]">battery_alert</span>
              2. Attention Span yang Ciut (Context-Switching Fatigue)
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-on-surface font-medium">
              Otak yang telanjur kebiasaan ngeproses informasi baru setiap 15 detik bakal kelabakan kalau disuruh fokus ngerjain satu tugas berat berjam-jam (kayak nulis laporan atau belajar). Otakmu bakal ngerasa bosan luar biasa dan produktivitas kerjamu pun hancur lebur.
            </p>

            <h2 className="text-2xl md:text-4xl font-bold text-on-surface mt-14 mb-6">
              <em>So, What's Next?</em>
            </h2>
            <p>
              Memahami landasan ilmiah dan cara kerja algoritma yang memanipulasi psikologimu adalah langkah pertama buat merebut kembali kebebasan digitalmu. Kalau informasi dari penelitian-penelitian di atas bikin kamu mikir "Wah, ini *gue* banget," tapi kamu belum ngambil tesnya... yuk, cobain sekarang!
            </p>
          </div>

          {/* ─── CTA BUTTON ─── */}
          <div className="mt-16 pt-10 border-t border-outline-variant flex justify-center">
            <Link
              href="/homepage/kuesioner"
              className="inline-flex items-center gap-3 bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold text-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <span className="material-symbols-outlined text-[28px]">assignment</span>
              Cek Skor Kecanduanmu Sekarang!
            </Link>
          </div>

        </article>
      </main>
    </div>
  );
}
