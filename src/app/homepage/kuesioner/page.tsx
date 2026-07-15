'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserInput } from '@/lib/screening-types';
import { SVAS_QUESTIONS, SVAS_OPTIONS, PLATFORM_CONFIG } from '@/lib/screening-constants';
import { calculateSVAS6 } from '@/lib/svas-algorithm';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = 'intro' | 'svas' | 'platform' | 'sleep' | 'productivity';

interface PlatformValues {
  instagram: number;
  tiktok: number;
  youtube: number;
  twitter: number;
}

// ─── Step Metadata ───────────────────────────────────────────────────────────
const STEPS_ORDER: Step[] = ['intro', 'svas', 'platform', 'sleep', 'productivity'];

const STEP_INFO: Record<Step, { num: number; title: string; subtitle: string; icon: string }> = {
  intro: {
    num: 1, title: 'Pengantar', subtitle: 'Baca instruksi sebelum memulai', icon: 'menu_book',
  },
  svas: {
    num: 2, title: 'Kuesioner S-VAS', subtitle: 'Jawab 6 pertanyaan berikut', icon: 'psychology',
  },
  platform: {
    num: 3, title: 'Estimasi Penggunaan Media Sosial (Opsional)', subtitle: 'Rata-rata penggunaan harian', icon: 'devices',
  },
  sleep: {
    num: 4, title: 'Kualitas Tidur', subtitle: 'Jam tidur per malam', icon: 'bedtime',
  },
  productivity: {
    num: 5, title: 'Produktivitas', subtitle: 'Dampak menonton video pendek terhadap aktivitas', icon: 'work',
  },
};

const TOTAL_STEPS = 5;

// ─── Platform Icons ──────────────────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, { icon: string; gradient: string }> = {
  instagram: { icon: 'photo_camera', gradient: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
  tiktok: { icon: 'music_note', gradient: 'linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)' },
  youtube: { icon: 'play_arrow', gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)' },
  twitter: { icon: 'tag', gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0d8ddb 100%)' },
};

export default function KuesionerPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [step, setStep] = useState<Step>('intro');
  const [svasScores, setSvasScores] = useState<number[]>(Array(6).fill(-1));
  const [platforms, setPlatforms] = useState<PlatformValues>({ instagram: 0, tiktok: 0, youtube: 0, twitter: 0 });
  const [sleepHours, setSleepHours] = useState(7);
  const [productivityImpact, setProductivityImpact] = useState(5);
  const [isCalculating, setIsCalculating] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [name, setName] = useState('');

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    const role = sessionStorage.getItem('screening_user_role');
    const storedName = sessionStorage.getItem('screening_username');

    if (role === 'admin') {
      alert('Admin tidak diperbolehkan melakukan pengisian kuesioner.');
      router.push('/homepage/admin');
      return;
    }

    if (!storedName) {
      setShowNameModal(true);
      return;
    }

    setUserName(storedName);
  }, [router]);

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
      sessionStorage.setItem('screening_username', trimmedName);
      sessionStorage.setItem('screening_user_role', 'guest');
      sessionStorage.setItem('screening_logged_in', 'false');
      setUserName(trimmedName);
      setShowNameModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Derived values
  const info = STEP_INFO[step];
  const svasAnswered = svasScores.filter((s) => s !== -1).length;
  const svasComplete = svasAnswered === 6;
  const currentStepIndex = STEPS_ORDER.indexOf(step);

  // Navigation
  const goNext = () => {
    if (step === 'intro') setStep('svas');
    else if (step === 'svas') setStep('platform');
    else if (step === 'platform') setStep('sleep');
    else if (step === 'sleep') setStep('productivity');
    else if (step === 'productivity') handleCalculate();
  };

  const goBack = () => {
    if (step === 'svas') setStep('intro');
    else if (step === 'platform') setStep('svas');
    else if (step === 'sleep') setStep('platform');
    else if (step === 'productivity') setStep('sleep');
  };

  const isNextDisabled = () => {
    if (step === 'svas') return !svasComplete;
    return false;
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    const input: UserInput = {
      svasScores,
      platforms,
      sleepHours,
      productivityImpact,
    };
    try {
      const result = calculateSVAS6(input);
      sessionStorage.setItem('screening_input', JSON.stringify(input));
      sessionStorage.setItem('screening_result', JSON.stringify(result));
      // Clear auto-save flag so new results can be saved
      sessionStorage.removeItem('screening_auto_saved');
      router.push('/homepage/hasil');
    } catch (e) {
      console.error('SVAS calculation error:', e);
      setIsCalculating(false);
    }
  };

  const setPlatformValue = (key: keyof PlatformValues, val: number) => {
    setPlatforms((prev) => ({ ...prev, [key]: val }));
  };

  const setSvasScore = (idx: number, val: number) => {
    setSvasScores((prev) => {
      const next = [...prev];
      next[idx] = next[idx] === val ? -1 : val;
      return next;
    });
  };

  const progressPercent = Math.round((info.num / TOTAL_STEPS) * 100);

  // ─── Sleep label helper ──────────────────────────────────────────────────
  const getSleepLabel = (hours: number) => {
    if (hours <= 3) return { text: 'Sangat Kurang', color: '#EF4444' };
    if (hours <= 5) return { text: 'Kurang', color: '#F97316' };
    if (hours <= 7) return { text: 'Cukup', color: '#F59E0B' };
    if (hours <= 9) return { text: 'Ideal', color: '#10B981' };
    return { text: 'Berlebihan', color: '#6366F1' };
  };

  // ─── Productivity label helper ────────────────────────────────────────────
  const getProductivityLabel = (val: number) => {
    if (val <= 2) return { text: 'Minimal', color: '#10B981' };
    if (val <= 4) return { text: 'Ringan', color: '#F59E0B' };
    if (val <= 6) return { text: 'Sedang', color: '#F97316' };
    if (val <= 8) return { text: 'Berat', color: '#EF4444' };
    return { text: 'Sangat Berat', color: '#DC2626' };
  };

  const sleepInfo = getSleepLabel(sleepHours);
  const prodInfo = getProductivityLabel(productivityImpact);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col" ref={containerRef}>
      <main className="flex-grow flex flex-col items-center justify-start w-full">
        {/* ═══════════ TOP PROGRESS BAR ═══════════ */}
        <div className="w-full bg-surface-container-lowest border-b border-outline-variant sticky top-16 z-30">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-4">
            {/* Step indicators */}
            <div className="flex items-center justify-between mb-3">
              {STEPS_ORDER.map((s, idx) => {
                const si = STEP_INFO[s];
                const isCurrent = idx === currentStepIndex;
                const isDone = idx < currentStepIndex;
                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isCurrent
                          ? 'bg-primary text-on-primary shadow-md scale-110'
                          : isDone
                            ? 'bg-primary/20 text-primary'
                            : 'bg-surface-container text-on-surface-variant'
                          }`}
                      >
                        {isDone ? (
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        ) : (
                          si.num
                        )}
                      </div>
                      <div className="hidden md:block">
                        <p className={`text-xs font-bold leading-none ${isCurrent ? 'text-primary' : isDone ? 'text-primary/70' : 'text-on-surface-variant'}`}>
                          {si.title}
                        </p>
                      </div>
                    </div>
                    {idx < STEPS_ORDER.length - 1 && (
                      <div className="flex-1 mx-3 h-0.5 rounded-full overflow-hidden bg-surface-container">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: isDone ? '100%' : isCurrent ? '50%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Overall progress bar */}
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>

        {/* ═══════════ CONTENT AREA ═══════════ */}
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {/* ── Step Header ────────────────────────────── */}
              <div className="mb-5 md:mb-8">
                <div className="flex items-center gap-2.5 md:gap-3 mb-1 md:mb-2">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[22px] md:text-[28px]">{info.icon}</span>
                  </div>
                  <div>
                    <h1 className="text-xl md:text-3xl font-bold text-on-surface leading-tight">{info.title}</h1>
                  </div>
                </div>
                <div className="ml-[46px] md:ml-[60px] flex items-center flex-wrap gap-2">
                  <p className="text-xs md:text-lg text-on-surface-variant">{info.subtitle}</p>
                  {step === 'platform' && (
                    <span className="text-[10px] md:text-xs font-bold text-primary underline decoration-2 underline-offset-2">
                    </span>
                  )}
                </div>
              </div>

              {/* ══════════════════════════════════════════════════
                  1. INTRO STEP
                  ══════════════════════════════════════════════════ */}
              {step === 'intro' && (
                <div className="flex flex-col gap-6">
                  {/* Welcome card */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/15 rounded-2xl p-4 md:p-8">
                    <div className="flex items-start gap-3 md:gap-5 mb-6 md:mb-8">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-[28px] md:text-[36px]">waving_hand</span>
                      </div>
                      <div>
                        <h2 className="text-xl md:text-3xl font-bold text-on-surface mb-2 md:mb-3">
                          Halo{userName ? `, ${userName}` : ''}!
                        </h2>
                        <p className="text-base md:text-xl font-medium text-on-surface-variant leading-relaxed">
                          Kuesioner ini dirancang untuk mengukur tingkat kecanduan terhadap platform video berdurasi pendek
                          (TikTok, Instagram Reels, YouTube Shorts) menggunakan instrumen <strong>SVAS-6</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Instruction items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-2">
                      {[
                        { icon: 'quiz', text: 'Jawab 6 pertanyaan berdasarkan pengalaman 6 bulan terakhir.' },
                        { icon: 'tune', text: '5 pilihan jawaban dari "Tidak Pernah" hingga "Sangat Sering".' },
                        { icon: 'lock', text: 'Data kamu bersifat anonim dan terjaga kerahasiaannya.' },
                        { icon: 'thumb_up', text: 'Jawab dengan jujur agar hasil asesmen akurat.' },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                          className="flex items-start gap-3 md:gap-4 bg-surface-container-lowest/80 rounded-xl p-4 md:p-5 border border-outline-variant/50 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-primary text-[24px] md:text-[28px] mt-0.5">{item.icon}</span>
                          <p className="text-sm md:text-base font-medium text-on-surface-variant leading-relaxed">{item.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  2. S-VAS QUESTIONNAIRE
                  ══════════════════════════════════════════════════ */}
              {step === 'svas' && (
                <div className="flex flex-col gap-6">
                  {/* Progress info */}
                  <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[22px]">checklist</span>
                      <p className="text-sm text-on-surface-variant">
                        Dijawab: <strong className="text-primary">{svasAnswered}/6</strong> pertanyaan
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${svasScores[i] !== -1 ? 'bg-primary scale-110' : 'bg-surface-container'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Questions */}
                  {SVAS_QUESTIONS.map((q, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.3, delay: idx * 0.06 }}
                      key={q.id}
                      className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${svasScores[idx] !== -1
                        ? 'border-primary/30 bg-primary/[0.02] shadow-sm'
                        : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
                        }`}
                    >
                      {/* Question header */}
                      <div className="p-4 pb-2 md:p-5 md:pb-4">
                        <div className="flex items-start gap-3 md:gap-4 mb-3">
                          <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm md:text-base font-bold flex-shrink-0 transition-colors shadow-sm ${
                            svasScores[idx] !== -1 
                              ? 'bg-primary text-on-primary' 
                              : 'bg-surface-container-lowest text-primary border-2 border-primary/20'
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-on-primary rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                              {q.dimension}
                            </span>
                            <h3 className="text-base md:text-xl font-bold text-on-surface leading-relaxed">{q.text}</h3>
                          </div>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="px-4 pb-4 md:px-5 md:pb-5">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-1.5 md:gap-2">
                          {SVAS_OPTIONS.map((opt) => {
                            const isSelected = svasScores[idx] === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => setSvasScore(idx, opt.value)}
                                className={`relative flex flex-row md:flex-col items-center justify-start md:justify-center gap-3 md:gap-1.5 px-3 py-2 md:p-3 rounded-lg md:rounded-xl border md:border-2 transition-all duration-200 cursor-pointer group ${isSelected
                                  ? 'border-current shadow-sm md:scale-[1.02]'
                                  : 'border-transparent bg-surface-container hover:bg-surface-container-high'
                                  }`}
                                style={isSelected ? {
                                  color: opt.color,
                                  backgroundColor: `${opt.color}12`,
                                  borderColor: `${opt.color}60`,
                                } : undefined}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-current' : 'border-outline-variant'
                                    }`}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-current" />
                                  )}
                                </div>
                                <span className={`text-xs md:text-base font-medium text-center leading-tight ${isSelected ? '' : 'text-on-surface-variant'
                                  }`}>
                                  {opt.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        {q.contoh && (
                          <div className="mt-4 md:mt-5 p-3.5 md:p-4 bg-primary text-on-primary rounded-xl shadow-md text-xs md:text-sm font-medium leading-relaxed flex items-start gap-3">
                            <span className="material-symbols-outlined text-[20px] md:text-[24px] mt-0.5 opacity-90">lightbulb</span>
                            <i className="not-italic">{q.contoh}</i>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  3. PLATFORM USAGE
                  ══════════════════════════════════════════════════ */}
              {step === 'platform' && (
                <div className="flex flex-col gap-6">
                  {/* Platform cards */}
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {PLATFORM_CONFIG.map((config, i) => {
                      const pIcon = PLATFORM_ICONS[config.key] || { icon: 'apps', gradient: 'linear-gradient(135deg, #888 0%, #666 100%)' };
                      const val = platforms[config.key as keyof PlatformValues] || 0;
                      return (
                        <motion.div
                          key={config.key}
                          initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{ delay: i * 0.08, duration: 0.3 }}
                          className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-3 md:p-5 hover:border-outline transition-all group"
                        >
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mb-3 md:mb-4">
                            <div
                              className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-sm"
                              style={{ background: pIcon.gradient }}
                            >
                              <span className="material-symbols-outlined text-[18px] md:text-[22px]">{pIcon.icon}</span>
                            </div>
                            <div>
                              <h3 className="text-sm md:text-xl font-bold text-on-surface leading-tight">{config.name}</h3>
                              <p className="text-[9px] md:text-xs text-on-surface-variant">Jam / hari</p>
                            </div>
                          </div>

                          {/* Slider + number display */}
                          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            <div
                              className="w-full text-center py-1.5 md:py-2 rounded-lg text-lg md:text-2xl font-bold transition-colors"
                              style={{
                                backgroundColor: config.bgColor,
                                color: config.color,
                              }}
                            >
                              {val.toFixed(1)} <span className="text-xs md:text-sm font-medium opacity-80">jam</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="12"
                              step="0.5"
                              value={val}
                              onChange={(e) => setPlatformValue(config.key as keyof PlatformValues, parseFloat(e.target.value) || 0)}
                              className="screening-slider w-full mt-2 md:mt-0"
                            />
                          </div>
                          <div className="flex justify-between mt-1.5 text-[10px] text-on-surface-variant">
                            <span>0 jam</span>
                            <span>12 jam</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Info banner */}
                  <div className="bg-surface-container border border-outline-variant rounded-xl p-3 md:p-4 flex items-start gap-2.5 md:gap-3">
                    <span className="material-symbols-outlined text-tertiary text-[20px] md:text-[22px] mt-0.5 flex-shrink-0">info</span>
                    <p className="text-[11px] md:text-sm text-on-surface-variant leading-relaxed">
                      Data penggunaan platform hanya sebagai <strong>Informasi Pendukung</strong>.
                      Boleh Berupa estimasi saja. 
                    </p>
                  </div>

                  {/* Total summary */}
                  <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Total durasi harian</span>
                    <span className="text-lg font-bold text-primary">
                      {(platforms.instagram + platforms.tiktok + platforms.youtube + platforms.twitter).toFixed(1)} jam/hari
                    </span>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  4. SLEEP QUALITY
                  ══════════════════════════════════════════════════ */}
              {step === 'sleep' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-4 md:p-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                        <label className="text-base md:text-xl font-medium text-on-surface" htmlFor="sleep-scale">
                          Rata-rata jam tidur per malam
                        </label>
                        <span className="inline-flex items-center justify-center px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold w-fit" style={{ backgroundColor: `${sleepInfo.color}15`, color: sleepInfo.color }}>
                          Status: {sleepInfo.text}
                        </span>
                      </div>

                      <div className="relative pt-12 pb-4 px-1 md:px-2">
                        {/* Premium Tooltip */}
                        <div
                          className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
                          style={{ left: `calc(${(sleepHours / 12) * 100}% + ${16 - (sleepHours / 12) * 32}px)` }}
                        >
                          <div className="bg-primary text-on-primary font-bold text-lg md:text-xl px-4 py-1.5 rounded-xl shadow-lg flex items-baseline gap-1">
                            {sleepHours} <span className="text-[10px] md:text-xs font-medium opacity-80">jam</span>
                          </div>
                          <div className="w-3 h-3 bg-primary rotate-45 -mt-1.5 rounded-sm"></div>
                        </div>

                        <input
                          id="sleep-scale"
                          className="screening-slider w-full"
                          type="range" min="0" max="12" step="1"
                          value={sleepHours}
                          onChange={(e) => setSleepHours(parseInt(e.target.value))}
                        />

                        <div className="flex justify-between mt-4 text-on-surface-variant font-medium text-base md:text-lg">
                          <span>0 jam</span>
                          <span>12+ jam</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tip card */}
                  <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">lightbulb</span>
                    <p className="text-sm text-on-surface-variant">
                      National Sleep Foundation merekomendasikan <strong>7–9 jam</strong> tidur per malam untuk orang dewasa.
                      Kurang tidur sering dikaitkan dengan penggunaan layar yang berlebihan di malam hari.
                    </p>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  5. PRODUCTIVITY IMPACT
                  ══════════════════════════════════════════════════ */}
              {step === 'productivity' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-4 md:p-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                        <label className="text-base md:text-xl font-medium text-on-surface" htmlFor="productivity-scale">
                          Tingkat gangguan: 
                        </label>
                        <span className="inline-flex items-center justify-center px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold w-fit" style={{ backgroundColor: `${prodInfo.color}15`, color: prodInfo.color }}>
                          Status: {prodInfo.text}
                        </span>
                      </div>

                      <div className="relative pt-12 pb-4 px-1 md:px-2">
                        {/* Premium Tooltip */}
                        <div
                          className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
                          style={{ left: `calc(${((productivityImpact - 1) / 9) * 100}% + ${16 - ((productivityImpact - 1) / 9) * 32}px)` }}
                        >
                          <div className="bg-primary text-on-primary font-bold text-lg md:text-xl px-4 py-1.5 rounded-xl shadow-lg flex items-baseline gap-1">
                            {productivityImpact} <span className="text-[10px] md:text-xs font-medium opacity-80">/10</span>
                          </div>
                          <div className="w-3 h-3 bg-primary rotate-45 -mt-1.5 rounded-sm"></div>
                        </div>

                        <input
                          id="productivity-scale"
                          className="screening-slider w-full"
                          type="range" min="1" max="10" step="1"
                          value={productivityImpact}
                          onChange={(e) => setProductivityImpact(parseInt(e.target.value))}
                        />

                        <div className="flex justify-between mt-4 text-on-surface-variant font-medium text-base md:text-lg">
                          <span>Tidak Terganggu</span>
                          <span>Sangat Terganggu</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary before submit */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/15 rounded-xl p-5 flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-[24px] mt-0.5 flex-shrink-0">check_circle</span>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface mb-1">Langkah Terakhir!</h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed">

                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════ ACTION BUTTONS ═══════════ */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-outline-variant">
                {step !== 'intro' ? (
                  <button
                    onClick={goBack}
                    className="flex items-center gap-1.5 md:gap-2 text-on-surface-variant hover:text-primary transition-all px-3 py-2 md:px-4 md:py-2.5 rounded-xl hover:bg-primary/5 text-sm md:text-base font-medium"
                    disabled={isCalculating}
                  >
                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">arrow_back</span>
                    Kembali
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={goNext}
                  disabled={isNextDisabled() || isCalculating}
                  className="group bg-primary text-on-primary font-semibold text-sm md:text-base px-6 py-2.5 md:px-8 md:py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none min-w-[130px] md:min-w-[160px] flex items-center justify-center gap-1.5 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isCalculating ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px] md:text-[20px]">progress_activity</span>
                      Memproses...
                    </>
                  ) : step === 'productivity' ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">insights</span>
                      Lihat Hasil
                    </>
                  ) : (
                    <>
                      Lanjutkan
                      <span className="material-symbols-outlined text-[18px] md:text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

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
      </main>
    </div>
  );
}
