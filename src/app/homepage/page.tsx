'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import ScreeningHeader from '@/components/ScreeningHeader';

// ─── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Floating App Icons (decorative) ───────────────────────────────────────────
function FloatingIcons() {
  const icons = [
    { icon: '📱', x: '10%', y: '20%', delay: 0, size: 32 },
    { icon: '🎬', x: '85%', y: '15%', delay: 0.5, size: 28 },
    { icon: '📲', x: '75%', y: '70%', delay: 1.0, size: 24 },
    { icon: '🔔', x: '15%', y: '75%', delay: 1.5, size: 26 },
    { icon: '⏰', x: '90%', y: '45%', delay: 0.8, size: 22 },
    { icon: '🧠', x: '5%', y: '50%', delay: 1.2, size: 30 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: item.x, top: item.y, fontSize: item.size }}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{
            opacity: [0, 0.15, 0.15, 0],
            y: [20, -10, -10, 20],
          }}
          transition={{
            duration: 6,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Dimension Card Data ───────────────────────────────────────────────────────
const DIMENSIONS = [
  {
    icon: 'psychology',
    title: 'Salience',
    subtitle: 'Fokus Utama',
    desc: 'Video pendek menjadi pikiran dominan yang terus mengalihkan fokus dari aktivitas keseharian.',
    color: '#00685f',
    bg: 'rgba(0, 104, 95, 0.08)',
  },
  {
    icon: 'mood',
    title: 'Mood Modification',
    subtitle: 'Pengubah Suasana Hati',
    desc: 'Menggunakan media sosial sebagai pelarian instan untuk meredakan stres, sedih, dan rasa bosan.',
    color: '#6750A4',
    bg: 'rgba(103, 80, 164, 0.08)',
  },
  {
    icon: 'update',
    title: 'Tolerance',
    subtitle: 'Toleransi Waktu',
    desc: 'Kebutuhan durasi menonton yang terus bertambah secara konstan demi mencapai kepuasan yang sama.',
    color: '#B3261E',
    bg: 'rgba(179, 38, 30, 0.08)',
  },
  {
    icon: 'sick',
    title: 'Withdrawal',
    subtitle: 'Gelisah saat Berhenti',
    desc: 'Munculnya rasa cemas, gelisah, atau emosi tidak stabil saat tidak bisa mengakses media sosial.',
    color: '#E8710A',
    bg: 'rgba(232, 113, 10, 0.08)',
  },
  {
    icon: 'gavel',
    title: 'Conflict',
    subtitle: 'Konflik & Gangguan Hidup',
    desc: 'Kebiasaan menonton yang mulai memicu masalah pada produktivitas kerja dan hubungan sosial.',
    color: '#7D5260',
    bg: 'rgba(125, 82, 96, 0.08)',
  },
  {
    icon: 'sync_problem',
    title: 'Relapse',
    subtitle: 'Kambuh Kembali',
    desc: 'Gagal menahan diri dan kembali menonton berlebihan meski sudah berusaha keras untuk berhenti.',
    color: '#386A20',
    bg: 'rgba(56, 106, 32, 0.08)',
  },
];

// ─── Steps Data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: '01',
    icon: 'edit_note',
    title: 'Isi Kuesioner',
    desc: 'Jawab 6 pertanyaan skala Likert (1-5) berdasarkan pengalaman kamu dalam 6 bulan terakhir.',
  },
  {
    num: '02',
    icon: 'data_usage',
    title: 'Lengkapi Data Konteks',
    desc: 'Masukkan durasi penggunaan platform, jam tidur, dan tingkat gangguan produktivitas harian.',
  },
  {
    num: '03',
    icon: 'analytics',
    title: 'Lihat Analisis Mendalam',
    desc: 'Dapatkan visualisasi skor, penjelasan per dimensi, serta rekomendasi yang dipersonalisasi.',
  },
];

export default function ScreeningLandingPage() {
  const router = useRouter();
  const [showNameModal, setShowNameModal] = useState(false);
  const [name, setName] = useState('');

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const role = sessionStorage.getItem('screening_user_role');
    if (role === 'admin') {
      // Auto-logout admin so they can test the screening as a user
      sessionStorage.removeItem('screening_admin_auth');
      sessionStorage.removeItem('screening_user_role');
      sessionStorage.removeItem('screening_username');
    }

    const storedName = sessionStorage.getItem('screening_username');
    if (storedName) {
      router.push('/homepage/kuesioner');
    } else {
      setShowNameModal(true);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const lowerName = trimmedName.toLowerCase();
    if (lowerName === 'admin' || lowerName === 'guest') {
      alert('Nama ini tidak dapat digunakan.');
      return;
    }

    try {
      // Allow duplicates: save name to session and proceed
      sessionStorage.setItem('screening_username', trimmedName);
      sessionStorage.setItem('screening_user_role', 'guest');
      sessionStorage.setItem('screening_logged_in', 'false');
      router.push('/homepage/kuesioner');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memeriksa nama pengguna.');
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col">
      <ScreeningHeader />

      <main className="flex-grow flex flex-col items-center justify-start w-full overflow-x-hidden">
        {/* ═══════════ HERO SECTION ═══════════ */}
        <section className="relative w-full py-16 md:py-24 overflow-hidden">
          <FloatingIcons />
          {/* Gradient blobs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-3xl -z-10" />

          <div className="max-w-max-width-content mx-auto px-gutter flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Text */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary font-label-md text-sm px-4 py-1.5 rounded-full mb-6"
              >
                <span className="material-symbols-outlined text-[18px]">science</span>
                Berbasis Skala SVAS-6 (Short Video Addiction Scale)
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-[56px] font-bold text-on-surface leading-tight tracking-tight mb-6"
              >
                Seberapa <span className="text-primary">Kecanduan</span> Kamu Terhadap Video Pendek?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-8 w-full"
              >
                Ukur tingkat kecenderungan adiksi kamu terhadap TikTok, Reels, dan Shorts melalui
                instrumen psikometri ilmiah — <strong>cukup 3 menit</strong>, hasilnya langsung keluar.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={handleStart}
                  className="group bg-primary text-on-primary font-extrabold text-base px-8 py-4 rounded-full hover:bg-primary-container transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Mulai Screening Gratis
                  <span className="material-symbols-outlined text-[22px] group-hover:translate-x-1 transition-transform font-bold">arrow_forward</span>
                </button>
                <a
                  href="#cara-kerja"
                  className="font-extrabold text-base text-primary bg-primary/5 border border-primary/30 hover:bg-primary/10 hover:border-primary/50 px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 no-underline whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[22px] font-bold">play_circle</span>
                  Pelajari Lebih Lanjut
                </a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-4 md:gap-6 mt-10 text-xs lg:text-sm text-on-surface-variant whitespace-nowrap"
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px] lg:text-[18px]">lock</span>
                  Data Privat & Anonim
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px] lg:text-[18px]">download</span>
                  Bisa Download PDF!
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px] lg:text-[18px]">verified</span>
                  Disertakan Visualisasi!
                </span>
              </motion.div>
            </div>

            {/* Right: Phone Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 60, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              <div className="relative w-[280px] md:w-[320px]">
                {/* Phone frame */}
                <div className="bg-on-surface rounded-[40px] p-3 shadow-2xl">
                  <div className="bg-surface rounded-[30px] overflow-hidden">
                    {/* Status bar */}
                    <div className="bg-surface-container-high px-4 py-2 flex justify-between items-center text-[10px] text-on-surface-variant">
                      <span>9:41</span>
                      <div className="flex gap-1 items-center">
                        <span className="material-symbols-outlined text-[12px]">signal_cellular_alt</span>
                        <span className="material-symbols-outlined text-[12px]">wifi</span>
                        <span className="material-symbols-outlined text-[12px]">battery_full</span>
                      </div>
                    </div>
                    {/* App content mock */}
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-[16px]">play_arrow</span>
                        </div>
                        <div>
                          <div className="h-2.5 w-20 bg-on-surface/10 rounded-full" />
                          <div className="h-2 w-14 bg-on-surface/5 rounded-full mt-1" />
                        </div>
                      </div>
                      {/* Fake video thumbnails */}
                      {[1, 2, 3].map((_, idx) => (
                        <motion.div
                          key={idx}
                          className="rounded-xl overflow-hidden"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 3, delay: idx * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <div
                            className="h-36 rounded-xl flex items-center justify-center relative"
                            style={{
                              background: idx === 0
                                ? 'linear-gradient(135deg, #00685f 0%, #004d46 100%)'
                                : idx === 1
                                  ? 'linear-gradient(135deg, #6750A4 0%, #4F378B 100%)'
                                  : 'linear-gradient(135deg, #B3261E 0%, #8C1D18 100%)',
                            }}
                          >
                            <span className="material-symbols-outlined text-white/30 text-[48px]">play_circle</span>
                            <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center">
                              <div className="flex gap-2">
                                <div className="h-2 w-8 bg-white/20 rounded-full" />
                                <div className="h-2 w-12 bg-white/10 rounded-full" />
                              </div>
                              <div className="flex gap-1.5">
                                <span className="material-symbols-outlined text-white/40 text-[14px]">favorite</span>
                                <span className="material-symbols-outlined text-white/40 text-[14px]">chat_bubble</span>
                                <span className="material-symbols-outlined text-white/40 text-[14px]">share</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Notification bubble */}
                <motion.div
                  className="absolute -top-3 -right-3 bg-error text-on-error text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  99+
                </motion.div>
                {/* Screen time badge */}
                <motion.div
                  className="absolute -bottom-2 -left-4 bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2 shadow-lg flex items-center gap-2"
                  initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <span className="material-symbols-outlined text-error text-[20px]">schedule</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface leading-none">5.2 jam/hari</p>
                    <p className="text-[10px] text-on-surface-variant">Screen Time</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ STATS BAR ═══════════ */}
        <section className="w-full bg-primary text-on-primary py-8">
          <div className="max-w-max-width-content mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: 6, suffix: '', label: 'Item Kuesioner', icon: 'quiz' },
              { value: 3, suffix: ' menit', label: 'Waktu Pengerjaan', icon: 'timer' },
              { value: 2, suffix: '', label: 'Fitur Menarik', icon: 'hub' },
              { value: 100, suffix: '%', label: 'Gratis & Anonim', icon: 'lock' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="material-symbols-outlined text-[28px] opacity-80 mb-1">{stat.icon}</span>
                <span className="text-3xl md:text-4xl font-bold">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-sm opacity-80">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════ 6 DIMENSIONS ═══════════ */}
        <section className="w-full py-16 md:py-20">
          <div className="max-w-max-width-content mx-auto px-gutter">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-label-md text-sm px-4 py-1.5 rounded-full mb-4">
                <span className="material-symbols-outlined text-[18px]">category</span>
                Berdasarkan Teori Griffiths (2005)
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-3">
                6 Dimensi yang Diukur
              </h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                Setiap dimensi mewakili aspek berbeda dari perilaku adiktif terhadap konten video pendek.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DIMENSIONS.map((dim, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-default"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: dim.bg, color: dim.color }}
                  >
                    <span className="material-symbols-outlined text-[24px]">{dim.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">{dim.title}</h3>
                  <p className="text-sm font-medium mb-2" style={{ color: dim.color }}>{dim.subtitle}</p>
                  <p className="text-base text-on-surface-variant leading-relaxed">{dim.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section id="cara-kerja" className="w-full bg-surface-container-low py-16 md:py-20 border-y border-outline-variant scroll-mt-20">
          <div className="max-w-max-width-content mx-auto px-gutter">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-label-md text-sm px-4 py-1.5 rounded-full mb-4">
                <span className="material-symbols-outlined text-[18px]">route</span>
                Prosedur Screening
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-3">
                Cara Kerjanya
              </h2>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                Tiga langkah sederhana untuk memahami pola perilaku digital kamu.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center hover:shadow-lg transition-all group"
                >
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-primary/30 z-10" />
                  )}
                  <div className="text-5xl font-black text-primary/10 absolute top-4 right-6">{step.num}</div>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[32px]">{step.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-3">{step.title}</h3>
                  <p className="text-base text-on-surface-variant leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ DISCLAIMER + CTA ═══════════ */}
        <section className="w-full py-16 md:py-20">
          <div className="max-w-max-width-content mx-auto px-gutter">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary to-[#004d46] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full" />
                <div className="absolute bottom-8 right-8 w-48 h-48 border-2 border-white rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white rounded-full" />
              </div>

              <div className="relative z-10">
                <span className="material-symbols-outlined text-[48px] mb-4 opacity-80">shield_with_heart</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Siap Mengenal Diri Kamu Lebih Dalam?
                </h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Hasil screening ini bersifat <strong>edukatif dan indikatif</strong> — bukan diagnosis klinis.
                  Jika kamu merasa membutuhkan bantuan profesional, kami sangat menyarankan untuk berkonsultasi
                  dengan psikolog atau konselor berlisensi.
                </p>
                <button
                  onClick={handleStart}
                  className="group bg-white text-primary font-bold text-lg px-10 py-4 rounded-2xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-3"
                >
                  Mulai Screening Sekarang
                  <span className="material-symbols-outlined text-[22px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="w-full bg-surface-container border-t border-outline-variant py-8 mt-auto">
        <div className="max-w-max-width-content mx-auto px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
            
            {/* Bagian Kiri */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-2xl font-bold text-primary tracking-tight">MindScroll</span>
              <span className="text-sm text-on-surface-variant text-center md:text-left">
                © 2024 MindScroll. Berbasis Skala Psikometri Ilmiah.
              </span>
            </div>

            {/* Bagian Kanan */}
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6 text-sm text-on-surface-variant font-medium">
              <a href="#" className="hover:text-primary transition-colors no-underline">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors no-underline">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors no-underline">Contact Us</a>
              <a href="#" className="hover:text-primary transition-colors no-underline">Scientific Basis</a>
            </div>

          </div>
        </div>
      </footer>

      {/* ═══════════ NAME INPUT MODAL ═══════════ */}
      <AnimatePresence>
        {showNameModal && (
          <div className="fixed inset-0 bg-on-background/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-surface-container-lowest border border-outline-variant p-6 sm:p-8 rounded-2xl shadow-xl w-[90vw] max-w-[420px] min-w-[300px] relative mx-auto"
            >
              <button
                onClick={() => setShowNameModal(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5 mx-auto">
                <span className="material-symbols-outlined text-[32px]">person_add</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2 text-center">Selamat Datang!</h2>
              <p className="text-base text-on-surface-variant mb-6 text-center leading-relaxed">
                Masukkan nama kamu untuk memulai proses screening.
              </p>

              <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Nama Panjang
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3.5 text-on-surface text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                    required
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-base px-4 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 mt-1"
                >
                  Lanjutkan ke Screening
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
