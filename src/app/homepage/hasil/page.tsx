'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScreeningHeader from '@/components/ScreeningHeader';
import { ScreeningResult, UserInput, ZoneType } from '@/lib/screening-types';
import { ZONES, DIMENSION_DETAILS } from '@/lib/screening-constants';
import { CriteriaBarChart, PlatformBarChart, SVASRadarChart, DimensionAccordion } from '@/components/ResultVisualizations';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

// ─── Scroll-triggered animation wrapper ──────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

function AnimatedSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


export default function HasilPage() {
  const router = useRouter();
  const [isPrinting, setIsPrinting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [input, setInput] = useState<UserInput | null>(null);
  const [animated, setAnimated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const animatedColor = useTransform(
    count,
    [0, 50, 100],
    ['#10B981', '#F59E0B', '#EF4444'] // Green -> Yellow -> Red
  );

  const saveToServer = async (userName: string, inputData: UserInput, resultData: ScreeningResult) => {
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName,
          input: {
            svasScores: inputData.svasScores,
            platforms: inputData.platforms,
            sleepHours: inputData.sleepHours,
            productivityImpact: inputData.productivityImpact
          },
          result: {
            zone: resultData.zone,
            detoxPercentage: resultData.detoxPercentage,
            svasTotal: resultData.svasTotal,
            svasCriteria: resultData.svasCriteria,
            contextScores: resultData.contextScores
          }
        })
      });
      const data = await res.json();
      if (data.success && data.id) {
        sessionStorage.setItem('screening_saved_result_id', data.id);
      }
    } catch (e) {
      console.error("Failed to save to server:", e);
    }
  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current || !result) return;
    setIsPrinting(true);

    // Scroll ke atas dan beri jeda untuk animasi (4 detik) agar visualisasi sudah terisi
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 4000));

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const element = dashboardRef.current;

      // ── Helper: convert oklab/oklch colors to rgb ──
      const colorCvs = document.createElement('canvas');
      colorCvs.width = colorCvs.height = 1;
      const colorCtx = colorCvs.getContext('2d')!;

      const toRgb = (color: string): string => {
        colorCtx.clearRect(0, 0, 1, 1);
        colorCtx.fillStyle = '#000000';
        colorCtx.fillStyle = color;
        colorCtx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = colorCtx.getImageData(0, 0, 1, 1).data;
        if (a === 0) return 'transparent';
        return a < 255
          ? `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`
          : `rgb(${r},${g},${b})`;
      };

      const isModernColor = (c: string) =>
        c && (c.includes('oklab') || c.includes('oklch') || c.includes('lab(') || c.includes('lch(') || c.includes('color('));

      // ══════════════════════════════════════════════════════════════════
      // STEP 1: Convert oklab colors ke rgb pada real DOM
      // ══════════════════════════════════════════════════════════════════
      const savedColors: { el: HTMLElement; bg: string; fg: string; bc: string }[] = [];

      element.querySelectorAll('*').forEach(child => {
        const el = child as HTMLElement;
        const cs = getComputedStyle(el);
        const bg = cs.backgroundColor;
        const fg = cs.color;
        const bc = cs.borderColor;

        if (isModernColor(bg) || isModernColor(fg) || isModernColor(bc)) {
          savedColors.push({
            el,
            bg: el.style.backgroundColor,
            fg: el.style.color,
            bc: el.style.borderColor,
          });
          if (isModernColor(bg)) el.style.backgroundColor = toRgb(bg);
          if (isModernColor(fg)) el.style.color = toRgb(fg);
          if (isModernColor(bc)) el.style.borderColor = toRgb(bc);
        }
      });

      // ══════════════════════════════════════════════════════════════════
      // STEP 2: Hide elemen print:hidden (footer, tombol)
      // ══════════════════════════════════════════════════════════════════
      const hiddenEls: { el: HTMLElement; orig: string }[] = [];
      document.querySelectorAll('[class*="print:hidden"]').forEach(el => {
        const htmlEl = el as HTMLElement;
        hiddenEls.push({ el: htmlEl, orig: htmlEl.style.display });
        htmlEl.style.display = 'none';
      });

      // ══════════════════════════════════════════════════════════════════
      // STEP 3: Buka SEMUA accordion (Penjelasan Detail & Solusi)
      // ══════════════════════════════════════════════════════════════════
      const savedAccordions: { el: HTMLElement; origStyle: string }[] = [];

      // Target: motion.div dengan class overflow-hidden yang punya height: 0px
      element.querySelectorAll('.overflow-hidden').forEach(el => {
        const htmlEl = el as HTMLElement;
        const s = htmlEl.style;
        if (s.height === '0px' || s.height === '0' || s.visibility === 'hidden') {
          savedAccordions.push({ el: htmlEl, origStyle: htmlEl.getAttribute('style') || '' });
          s.height = 'auto';
          s.opacity = '1';
          s.visibility = 'visible';
          s.overflow = 'visible';
          s.filter = 'none';
        }
      });

      // Tampilkan juga header print-only (yang pakai hidden print:flex)
      element.querySelectorAll('[class*="print:flex"]').forEach(el => {
        const htmlEl = el as HTMLElement;
        if (getComputedStyle(htmlEl).display === 'none') {
          savedAccordions.push({ el: htmlEl, origStyle: htmlEl.getAttribute('style') || '' });
          htmlEl.style.display = 'flex';
        }
      });

      // Tunggu reflow agar DOM ter-update
      await new Promise(r => setTimeout(r, 300));

      // ══════════════════════════════════════════════════════════════════
      // STEP 4: Capture screenshot dengan html2canvas
      // ══════════════════════════════════════════════════════════════════
      // Simpan ukuran asli dan paksa ke ukuran desktop agar rapi walau di HP
      const origWidth = element.style.width;
      const origMaxWidth = element.style.maxWidth;
      element.style.width = '1024px';
      element.style.maxWidth = '1024px';
      
      // Tunggu reflow sekali lagi untuk ukuran baru
      await new Promise(r => setTimeout(r, 150));

      const captureHeight = element.scrollHeight;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        height: captureHeight,
        windowHeight: captureHeight,
        windowWidth: 1024,
        scrollY: -window.scrollY,
        scrollX: 0,
        onclone: (clonedDoc: Document) => {
          // Paksa semua elemen framer-motion terlihat di clone juga
          clonedDoc.querySelectorAll('*').forEach(el => {
            const htmlEl = el as HTMLElement;
            const s = htmlEl.style;
            if (s.opacity && s.opacity !== '1') s.opacity = '1';
            if (s.filter && s.filter.includes('blur')) s.filter = 'none';
            if (s.visibility === 'hidden') s.visibility = 'visible';
            if (s.height === '0px' || s.height === '0') {
              s.height = 'auto';
              s.overflow = 'visible';
            }
          });
        },
      });

      // ══════════════════════════════════════════════════════════════════
      // STEP 5: Restore semua perubahan DOM
      // ══════════════════════════════════════════════════════════════════
      element.style.width = origWidth;
      element.style.maxWidth = origMaxWidth;
      
      savedAccordions.forEach(({ el, origStyle }) => {
        el.setAttribute('style', origStyle);
      });
      hiddenEls.forEach(({ el, orig }) => {
        el.style.display = orig;
      });
      savedColors.forEach(({ el, bg, fg, bc }) => {
        el.style.backgroundColor = bg;
        el.style.color = fg;
        el.style.borderColor = bc;
      });

      // ══════════════════════════════════════════════════════════════════
      // STEP 6: Generate Pageless PDF
      // ══════════════════════════════════════════════════════════════════
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const canvasW = canvas.width;
      const canvasH = canvas.height;

      const pdfW = 210; // Lebar standard A4 dalam mm
      const margin = 5;
      const usableW = pdfW - margin * 2;
      const totalH = (canvasH * usableW) / canvasW;
      const pdfH = totalH + margin * 2;

      // Custom page size yang menyesuaikan tinggi konten (pageless)
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [pdfW, pdfH]
      });

      // Tambahkan seluruh image ke satu halaman tanpa memotong
      pdf.addImage(imgData, 'JPEG', margin, margin, usableW, totalH);

      // Auto-download
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
      const userName = sessionStorage.getItem('screening_username') || 'user';
      pdf.save(`Hasil-Screening-${userName}-${dateStr}.pdf`);

    } catch (error) {
      console.error('PDF export error:', error);
      alert('Gagal membuat PDF. Cek console untuk detail error.');
    } finally {
      setIsPrinting(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const storedResult = sessionStorage.getItem('screening_result');
    const storedInput = sessionStorage.getItem('screening_input');
    const userName = sessionStorage.getItem('screening_username') || 'Guest';
    const role = sessionStorage.getItem('screening_user_role');

    const checkUser = async () => {
      if (role === 'admin') {
        alert('Admin tidak diperbolehkan mengisi kuesioner.');
        router.push('/homepage/admin');
        return;
      }

      // Auto-save results for all users (Guest & Logged In)
      try {
        const alreadySaved = sessionStorage.getItem('screening_auto_saved');
        if (!alreadySaved && storedResult && storedInput) {
          sessionStorage.setItem('screening_auto_saved', 'true');
          const parsedResult = JSON.parse(storedResult);
          const parsedInput = JSON.parse(storedInput);
          const finalUserName = (userName && userName !== 'Guest') ? userName : `Guest User (${new Date().getTime().toString().slice(-4)})`;

          await saveToServer(finalUserName, parsedInput, parsedResult);
        }
      } catch (e) {
        console.error("Auto-save error:", e);
        sessionStorage.removeItem('screening_auto_saved');
      }
    };
    checkUser();

    try {
      const parsedResult = storedResult ? JSON.parse(storedResult) : null;
      const parsedInput = storedInput ? JSON.parse(storedInput) : null;
      if (!parsedResult || !parsedInput) throw new Error("No data");
      setResult(parsedResult);
      setInput(parsedInput);
      setTimeout(() => setAnimated(true), 200);
    } catch {
      router.push('/homepage/kuesioner');
    }
  }, [router]);

  useEffect(() => {
    if (result && animated) {
      animate(count, result.detoxPercentage, {
        duration: 2,
        ease: [0.175, 0.885, 0.32, 1.1],
      });
    }
  }, [result, animated, count]);

  if (!isMounted || !result || !input) {
    return (
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
          <p className="font-label-md text-label-md text-on-surface-variant">Memuat Data Hasil...</p>
        </div>
      </div>
    );
  }

  const zoneInfo = ZONES[result.zone];
  const statusColor = (zone: ZoneType) => {
    switch (zone) {
      case 'NORMAL': return { bg: '#d4edda', text: '#155724' };
      case 'BERISIKO': return { bg: '#fff3cd', text: '#856404' };
      case 'KECANDUAN_TINGGI': return { bg: '#f8d7da', text: '#721c24' };
      default: return { bg: '#e2e3e5', text: '#383d41' };
    }
  };
  const colorScheme = statusColor(result.zone);

  const handleSelesai = () => {
    sessionStorage.removeItem('screening_username');
    sessionStorage.removeItem('screening_auth_token');
    sessionStorage.removeItem('screening_admin_auth');
    sessionStorage.removeItem('screening_user_role');
    sessionStorage.removeItem('screening_logged_in');
    sessionStorage.removeItem('screening_result');
    sessionStorage.removeItem('screening_input');
    sessionStorage.removeItem('screening_auto_saved');
    sessionStorage.removeItem('screening_saved_result_id');
    router.push('/homepage');
  };

  // Premium Gauge Score
  const renderGaugeScore = () => {
    const percentage = result.detoxPercentage;
    const radius = 130;
    const cx = 160;
    const cy = 150;
    const strokeWidth = 24;

    // Half circle circumference = PI * r
    const circumference = Math.PI * radius;
    const targetOffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex flex-col items-center justify-center w-full max-w-[200px] md:max-w-[340px] mx-auto mt-2 md:mt-6 mb-1 md:mb-2">
        
        <div className="relative w-full flex flex-col items-center">
          <svg width="100%" height="100%" viewBox="0 0 320 170" className="overflow-visible">
            {/* Background Arc */}
            <path
              d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
              fill="none"
              stroke="rgba(188, 201, 198, 0.3)" // subtle outline variant
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Animated Foreground Arc */}
            <motion.path
              d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={animated ? targetOffset : circumference}
              style={{ 
                stroke: animatedColor, 
                transition: 'stroke-dashoffset 2s cubic-bezier(0.175, 0.885, 0.32, 1.1)' 
              }}
            />

            {/* Tick Markers */}
            {[0, 25, 50, 75, 100].map((tick) => {
              const angle = Math.PI - (tick / 100) * Math.PI;
              // Draw small dots instead of lines for a cleaner look
              const x = cx + (radius - strokeWidth / 2 - 12) * Math.cos(angle);
              const y = cy - (radius - strokeWidth / 2 - 12) * Math.sin(angle);
              return (
                <circle key={tick} cx={x} cy={y} r="2" fill="currentColor" className="text-on-surface-variant opacity-40" />
              )
            })}
          </svg>

          {/* Number Score inside the SVG arc */}
          <div className="absolute bottom-2 md:bottom-4 flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="font-display-lg text-[32px] md:text-[64px] font-extrabold leading-none tracking-tight flex items-center"
              style={{ color: animatedColor }}
            >
              <motion.span>{rounded}</motion.span>
              <span>%</span>
            </motion.span>
          </div>
        </div>

        {/* Skor Ketergantungan text completely below the chart */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="font-label-md text-[11px] md:text-sm text-on-surface-variant uppercase tracking-[0.05em] md:tracking-[0.1em] font-extrabold text-center leading-tight whitespace-nowrap mt-0 md:mt-2"
        >
          Skor Ketergantungan
        </motion.span>
      </div>
    );
  };

  return (
    <div className="bg-background print:bg-white text-on-background print:text-black min-h-screen flex flex-col font-body-md antialiased overflow-x-hidden">
      <div className="print:hidden">
        <ScreeningHeader />
      </div>

      <main ref={dashboardRef} className="flex-grow w-full flex flex-col">

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1: Hero Banner
        ══════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full bg-gradient-to-br from-[#00685f] via-[#00796b] to-[#004d40] text-white py-12 md:py-16 px-6 md:px-12 print:bg-[#00685f] print:py-8 pdf-avoid-break"
        >
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl md:text-6xl mb-4"
            >

            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
            >
              Yeayy! Hasil Screening Kamu Sudah Selesai!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto"
            >
              Scroll Ke Bawah Yaa Buat lihat Analisis Hasil Short-Form Video Addiction Scale (SVAS-6) Kamu!
            </motion.p>
          </div>
        </motion.div>


        <div className="w-full px-4 md:px-12 py-8 md:py-12">
          <AnimatedSection className="w-full max-w-5xl mx-auto">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl md:rounded-3xl p-3 md:p-10 shadow-sm flex flex-row items-center gap-2 md:gap-12 pdf-avoid-break">

              {/* Left Side: Gauge Visualization */}
              <div className="w-[50%] lg:w-[45%] flex justify-center flex-shrink-0">
                {renderGaugeScore()}
              </div>

              {/* Right Side: Status Banner Card */}
              <div className="w-[50%] lg:w-[55%]">
                <div
                  className="rounded-xl md:rounded-2xl p-3 md:p-8 flex flex-col justify-center gap-2 md:gap-4 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full"
                  style={{ backgroundColor: colorScheme.bg, border: `1px solid ${zoneInfo.color}40` }}
                >
                  {/* Decorative faint background icon */}
                  <span
                    className="material-symbols-outlined absolute -right-4 -bottom-4 md:-right-8 md:-bottom-8 text-[60px] md:text-[140px] opacity-[0.07] pointer-events-none select-none"
                    style={{ color: zoneInfo.color }}
                  >
                    {result.zone === 'NORMAL' ? 'verified' : result.zone === 'BERISIKO' ? 'warning' : 'dangerous'}
                  </span>

                  <div className="flex items-center gap-2 md:gap-4 relative z-10">
                    <div
                      className="w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: zoneInfo.color, color: '#fff' }}
                    >
                      <span className="material-symbols-outlined text-[16px] md:text-[32px]">
                        {result.zone === 'NORMAL' ? 'health_and_safety' : result.zone === 'BERISIKO' ? 'error' : 'warning'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest mb-0 md:mb-1 opacity-80" style={{ color: colorScheme.text }}>
                        Status
                      </span>
                      <h3 className="text-sm md:text-3xl font-extrabold leading-tight" style={{ color: colorScheme.text }}>
                        {zoneInfo.label}
                      </h3>
                    </div>
                  </div>

                  <div className="h-px w-full my-1 md:my-2 opacity-20" style={{ backgroundColor: colorScheme.text }} />

                  <p
                    className="text-[9px] md:text-lg font-medium leading-relaxed relative z-10"
                    style={{ color: colorScheme.text }}
                  >
                    {zoneInfo.description}
                  </p>
                </div>
              </div>

            </div>
          </AnimatedSection>
        </div>


        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3: Rincian Skor Kamu (Full-Width)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full px-6 md:px-12 pb-8 md:pb-12">
          <AnimatedSection delay={0.1} className="w-full max-w-5xl mx-auto">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm flex flex-col pdf-avoid-break">
              <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">bar_chart</span>
                Rincian Skor Kamu
              </h2>
              <div className="w-full">
                <CriteriaBarChart criteria={result.svasCriteria.map(c => ({ label: c.label, score: c.score, weight: 1 }))} />
              </div>
              <div className="mt-6 grid grid-rows-2 grid-flow-col gap-2 md:flex md:flex-wrap md:items-center md:justify-center md:gap-4 text-xs text-on-surface-variant">
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#10B981]" /> 1-2 Normal</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#F59E0B]" /> 3 Waspada</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#F97316]" /> 4 Tinggi</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#EF4444]" /> 5 Sangat Tinggi</span>
              </div>
            </div>
          </AnimatedSection>
        </div>


        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4: Penjelasan Detail & Solusi (Full-Width)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full px-6 md:px-12 pb-8 md:pb-12">
          <AnimatedSection delay={0.1} className="w-full max-w-5xl mx-auto">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm flex flex-col print:break-inside-avoid">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[28px]">psychology</span>
                <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Penjelasan Detail & Solusi</h2>
              </div>
              <DimensionAccordion criteria={result.svasCriteria} />
            </div>
          </AnimatedSection>
        </div>


        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5: Pola Penggunaan / Radar Chart (Full-Width)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full px-6 md:px-12 pb-8 md:pb-12">
          <AnimatedSection delay={0.1} className="w-full max-w-5xl mx-auto">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm flex flex-col pdf-avoid-break">
              <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">radar</span>
                Pola Penggunaan Kamu
              </h2>
              <div className="w-full min-h-[320px] flex items-center justify-center">
                <SVASRadarChart criteria={result.svasCriteria.map(c => ({ label: c.label, score: c.score }))} />
              </div>
            </div>
          </AnimatedSection>
        </div>


        {/* ══════════════════════════════════════════════════════════════════
            SECTION 6: Kualitas Tidur & Waktu di Media Sosial (GABUNGAN)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full px-6 md:px-12 pb-8 md:pb-12">
          <AnimatedSection delay={0.1} className="w-full max-w-5xl mx-auto">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm flex flex-col gap-8 pdf-avoid-break">

              <h2 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">monitoring</span>
                Kualitas Tidur & Waktu di Media Sosial
              </h2>

              {/* Konteks skor: 3 cards */}
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <div className="bg-surface-container rounded-lg md:rounded-xl p-2 md:p-5 text-center flex flex-col items-center justify-start gap-1 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[28px]">schedule</span>
                  <p className="text-base md:text-3xl font-bold text-on-surface mt-0.5 md:mt-1 leading-none">{result.contextScores.totalDuration.toFixed(1)}</p>
                  <p className="text-[9px] md:text-sm text-on-surface-variant leading-tight">Jam/Hari Total Medsos</p>
                </div>
                <div className="bg-surface-container rounded-lg md:rounded-xl p-2 md:p-5 text-center flex flex-col items-center justify-start gap-1 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[28px]">bedtime</span>
                  <p className="text-base md:text-3xl font-bold text-on-surface mt-0.5 md:mt-1 leading-none">{result.contextScores.sleepHours}</p>
                  <p className="text-[9px] md:text-sm text-on-surface-variant leading-tight">Jam Tidur Malam</p>
                </div>
                <div className="bg-surface-container rounded-lg md:rounded-xl p-2 md:p-5 text-center flex flex-col items-center justify-start gap-1 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[28px]">work</span>
                  <p className="text-base md:text-3xl font-bold text-on-surface mt-0.5 md:mt-1 leading-none">{result.contextScores.productivityImpact}/10</p>
                  <p className="text-[9px] md:text-sm text-on-surface-variant leading-tight">Gangguan Produktivitas</p>
                </div>
              </div>

              {/* Platform usage chart */}
              <div>
                <h3 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">phone_android</span>
                  Waktu Penggunaan Per Platform
                </h3>
                <div className="w-full min-h-[300px]">
                  <PlatformBarChart data={result.platformBreakdown} />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>


        {/* ══════════════════════════════════════════════════════════════════
            SECTION 7: Tombol Aksi (Paling Bawah, Horizontal)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full px-6 md:px-12 pb-8 md:pb-12 print:hidden">
          <AnimatedSection delay={0.1} className="w-full max-w-5xl mx-auto">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 md:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <Link
                  href="/homepage/kuesioner"
                  className="w-full sm:w-auto bg-surface border-2 border-primary text-primary hover:bg-primary/10 font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm no-underline text-sm hover:shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  Ulangi Tes
                </Link>

                <button
                  onClick={handleExportPDF}
                  disabled={isPrinting}
                  className="w-full sm:w-auto bg-primary text-on-primary font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 text-sm hover:shadow-md hover:brightness-110"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isPrinting ? 'animate-spin' : ''}`}>{isPrinting ? 'progress_activity' : 'download'}</span>
                  {isPrinting ? 'Mengunduh PDF...' : 'Download PDF'}
                </button>

                <button
                  onClick={handleSelesai}
                  className="w-full sm:w-auto bg-surface border-2 border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm no-underline text-sm hover:shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">home</span>
                  Selesai
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>

      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="print:hidden bg-surface-container border-t border-outline-variant mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full py-md px-gutter max-w-5xl mx-auto gap-xs">
          <div className="flex flex-col items-center md:items-start gap-xs">
            <span className="font-label-md text-label-md font-bold text-on-surface">MindScroll Screening</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center md:text-left max-w-[576px]">
              © 2026 MindScroll Clinical Systems. All rights reserved. Medical Disclaimer: This screening tool is for informational purposes only and does not substitute professional medical advice.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
