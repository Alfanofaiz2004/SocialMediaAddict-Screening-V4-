'use client';

import React, { useState, useEffect } from 'react';
import { DIMENSION_DETAILS } from '@/lib/screening-constants';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

function AnimatedBar({ score, index }: { score: number, index: number }) {
  const maxScore = 5;
  const count = useMotionValue(0);
  const width = useTransform(count, (latest) => `${(latest / maxScore) * 100}%`);
  const color = useTransform(
    count,
    [0, 2, 3, 4, 5],
    ['#10B981', '#10B981', '#F59E0B', '#F97316', '#EF4444']
  );

  useEffect(() => {
    // Start animation slightly after the fade-in, staggered by index
    const timeout = setTimeout(() => {
      animate(count, score, { duration: 1.5, ease: [0.175, 0.885, 0.32, 1.1] });
    }, 100 + index * 150);
    return () => clearTimeout(timeout);
  }, [score, index, count]);

  return (
    <motion.div
      className="h-full rounded-full"
      style={{ width, backgroundColor: color }}
    />
  );
}

// ─── Custom Horizontal Bar Chart: S-VAS Dimension Breakdown ────────────────────
export function CriteriaBarChart({ criteria }: { criteria: { label: string; score: number; weight: number }[] }) {
  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {criteria.map((c, i) => {
        return (
          <motion.div
            key={i}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <span className="w-[130px] md:w-[180px] text-sm md:text-base text-on-surface-variant font-medium text-right flex-shrink-0 truncate">
              {c.label}
            </span>
            <div className="flex-grow h-8 bg-surface-variant/40 rounded-full overflow-hidden relative">
              <AnimatedBar score={c.score} index={i} />
            </div>
            <span className="text-base font-bold text-on-surface w-6 text-center flex-shrink-0">{c.score}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Platform Bar Chart with Average & Healthy Limit Lines ───────────────────
export function PlatformBarChart({ data }: { data: { name: string; hours: number }[] }) {
  const HEALTHY_LIMIT = 2; // jam per hari
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);
  const maxHours = Math.max(...data.map(d => d.hours), HEALTHY_LIMIT + 1, totalHours + 0.5, 1);
  const roundedMax = Math.ceil(maxHours);

  // Platform colors
  const platformColors: Record<string, string> = {
    'Instagram': '#E1306C',
    'TikTok': '#000000',
    'YouTube': '#FF0000',
    'Twitter': '#1DA1F2',
    'Twitter/X': '#1DA1F2',
  };

  // Y-axis ticks
  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => (roundedMax / tickCount) * i);

  const chartHeight = 240;
  const getYPosition = (hours: number) => chartHeight - (hours / roundedMax) * chartHeight;

  return (
    <div className="w-full flex flex-col pt-2 select-none">
      <div className="flex min-h-[260px]">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-xs text-on-surface-variant pr-3 select-none pb-1" style={{ height: chartHeight }}>
          {yTicks.slice().reverse().map((tick, i) => (
            <span key={i} className="leading-none text-right w-8">{tick.toFixed(1)}h</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-grow relative border-b border-l border-outline-variant" style={{ height: chartHeight }}>
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0">
            {yTicks.slice().reverse().map((_, i) => (
              <div key={i} className="border-b border-outline-variant/15 w-full h-0" />
            ))}
          </div>

          {/* Healthy limit line (2 jam) */}
          <div
            className="absolute w-full z-10 pointer-events-none"
            style={{ top: `${getYPosition(HEALTHY_LIMIT)}px` }}
          >
            <div className="w-full border-t-2 border-dashed border-red-400" />
            <span className="absolute right-0 -top-5 text-[11px] font-semibold text-red-500 bg-surface/80 px-1.5 py-0.5 rounded whitespace-nowrap">
              Batas Sehat (2 jam)
            </span>
          </div>

          {/* Total line */}
          {totalHours > 0 && (
            <div
              className="absolute w-full z-10 pointer-events-none"
              style={{ top: `${getYPosition(totalHours)}px` }}
            >
              <div className="w-full border-t-2 border-dashed border-blue-400" />
              <span className="absolute left-0 -top-5 text-[11px] font-semibold text-blue-500 bg-surface/80 px-1.5 py-0.5 rounded whitespace-nowrap">
                Total Pemakaian ({totalHours.toFixed(1)} jam)
              </span>
            </div>
          )}



          {/* Bars */}
          <div className="absolute inset-0 flex justify-around items-end px-4 md:px-6">
            {data.map((item) => {
              const heightPct = (item.hours / roundedMax) * 100;
              const barColor = platformColors[item.name] || '#00685f';
              return (
                <div key={item.name} className="flex-grow max-w-[64px] flex flex-col items-center group relative h-full justify-end gap-1">
                  {/* Value label on top of bar */}
                  <span className="text-xs font-bold text-on-surface whitespace-nowrap">
                    {item.hours.toFixed(1)}h
                  </span>
                  <div
                    className="w-full rounded-t transition-all duration-500 ease-out origin-bottom cursor-pointer hover:opacity-80"
                    style={{ height: `${heightPct}%`, backgroundColor: barColor, minHeight: item.hours > 0 ? '4px' : '0px' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex pl-[44px] pt-3 justify-around">
        {data.map((item) => (
          <div key={item.name} className="flex-grow max-w-[64px] text-center text-sm font-medium text-on-surface-variant truncate">
            {item.name}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-on-surface-variant">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-5 h-0 border-t-2 border-dashed border-red-400 inline-block" /> Batas Sehat (2 jam)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-5 h-0 border-t-2 border-dashed border-blue-400 inline-block" /> Total Pemakaian
        </span>
      </div>
    </div>
  );
}

// ─── Radar Chart (S-VAS) ───────────────────────────────────────────────
export function SVASRadarChart({ criteria }: { criteria: { label: string; score: number }[] }) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 100;
  const n = criteria.length;

  const getCoordinates = (val: number, i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = val * maxRadius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPaths = gridLevels.map((level) =>
    Array.from({ length: n }).map((_, i) => {
      const { x, y } = getCoordinates(level, i);
      return `${x},${y}`;
    }).join(' ')
  );

  const points = criteria.map((c, i) => {
    const { x, y } = getCoordinates(c.score / 5, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full select-none py-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {gridPaths.map((path, idx) => (
          <polygon
            key={idx}
            points={path}
            fill="none"
            stroke="var(--color-outline-variant, #bcc9c6)"
            strokeWidth="0.75"
            strokeDasharray={idx < 4 ? '3' : '0'}
          />
        ))}

        {Array.from({ length: n }).map((_, i) => {
          const outer = getCoordinates(1, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--color-outline-variant, #bcc9c6)"
              strokeWidth="0.75"
            />
          );
        })}

        {criteria.map((c, i) => {
          const outer = getCoordinates(1.32, i);
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          else if (Math.cos(angle) < -0.3) textAnchor = 'end';
          return (
            <text
              key={i}
              x={outer.x}
              y={outer.y + 4}
              textAnchor={textAnchor}
              className="text-[11px] font-medium fill-on-surface-variant"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {c.label}
            </text>
          );
        })}

        <polygon
          points={points}
          fill="rgba(0, 104, 95, 0.15)"
          stroke="#00685f"
          strokeWidth="2"
        />

        {criteria.map((c, i) => {
          const { x, y } = getCoordinates(c.score / 5, i);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#00685f"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── Dimension Detailed Accordion ──────────────────────────────────────────────
export function DimensionAccordion({ criteria }: { criteria: { key: string; label: string; score: number }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full mt-2">
      <div className="bg-[#00685f]/10 p-4 rounded-lg border border-[#00685f]/20 text-[#00685f] mb-2 text-base flex gap-3 items-start">
        <span className="material-symbols-outlined text-[24px] mt-0.5 flex-shrink-0">info</span>
        <p className="leading-relaxed">
          <strong>Catatan Penting:</strong> Hasil penjabaran tiap dimensi ini merupakan indikasi awal kecenderungan perilaku kamu, dan <strong>bukanlah sebuah diagnosis klinis</strong>. Jika kamu merasa kondisi ini sangat mengganggu, sangat disarankan untuk berkonsultasi dengan profesional atau psikolog.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {criteria.map((c, i) => {
          const detail = DIMENSION_DETAILS[c.key as keyof typeof DIMENSION_DETAILS] as any;
          if (!detail) return null;
          const isOpen = openIndex === i;

          let specificDesc = detail.scale12;
          let solusiDesc = detail.solusi12;
          if (c.score === 3) {
            specificDesc = detail.scale3;
            solusiDesc = detail.solusi3;
          }
          if (c.score >= 4) {
            specificDesc = detail.scale45;
            solusiDesc = detail.solusi45;
          }

          const colorCode = c.score <= 2 ? '#10B981' : c.score === 3 ? '#F59E0B' : '#EF4444';

          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="border border-outline-variant rounded-lg bg-surface overflow-hidden print:border-b print:break-inside-avoid pdf-avoid-break shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-variant/30 text-left transition-colors print:hidden"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ backgroundColor: colorCode }}
                  >
                    {c.score}/5
                  </div>
                  <span className="text-lg font-bold text-on-surface">{c.label}</span>
                </div>
                <span
                  className="material-symbols-outlined text-[28px] text-on-surface-variant transition-transform duration-300"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </button>
              
              {/* For Print: Always show header block */}
              <div className="hidden print:flex items-center gap-4 p-4 border-b border-outline-variant/30 bg-surface-variant/10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                  style={{ backgroundColor: colorCode }}
                >
                  {c.score}/5
                </div>
                <span className="text-lg font-bold text-on-surface">{c.label}</span>
              </div>

              <AnimatePresence initial={false}>
                  <motion.div
                    initial={{ height: 0, opacity: 0, filter: 'blur(10px)' }}
                    animate={{ 
                      height: isOpen ? 'auto' : 0, 
                      opacity: isOpen ? 1 : 0,
                      visibility: isOpen ? 'visible' : 'hidden'
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden print:!h-auto print:!opacity-100 print:!visible print:block"
                  >
                    <div className="p-5 pt-0 print:pt-5 border-t border-outline-variant/30 text-base text-on-surface-variant flex flex-col gap-4 bg-surface-container-lowest leading-relaxed">
                      <div className="mt-4 print:mt-0">
                        <span className="font-bold text-on-surface block mb-2 text-lg">Pengertian:</span>
                        {detail.basic}
                      </div>

                      <div
                        className="p-4 bg-surface-variant/20 rounded-lg border-l-[6px]"
                        style={{ borderColor: colorCode }}
                      >
                        <span className="font-bold text-on-surface block mb-2 text-lg">
                          Analisis Skor Kamu ({c.score}/5):
                        </span>
                        {specificDesc}

                        {solusiDesc && (
                          <div className="mt-4 pt-4 border-t border-outline-variant/30">
                            <span className="font-bold text-on-surface mb-2 text-lg flex items-center gap-2">
                              <span className="material-symbols-outlined text-[20px]" style={{ color: colorCode }}>lightbulb</span>
                              Solusi & Rekomendasi
                            </span>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-base text-on-surface-variant leading-relaxed">
                              {Array.isArray(solusiDesc) 
                                ? solusiDesc.map((item: string, idx: number) => <li key={idx}>{item}</li>)
                                : <li>{solusiDesc}</li>
                              }
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
