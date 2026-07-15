import { UserInput, ScreeningResult, ZoneType, SVASCriterion } from './screening-types';
import { 
  SVAS_QUESTIONS, 
  DOMINANT_EXPLANATIONS, 
  RECOMMENDATIONS, 
  PLATFORM_CONFIG 
} from './screening-constants';

/** Tentukan zona klasifikasi berdasarkan total skor SVAS-6 */
function determineZone(totalScore: number): ZoneType {
  if (totalScore >= 19) return 'KECANDUAN';
  if (totalScore >= 15) return 'BERISIKO';
  return 'SEHAT';
}

/** Tentukan dimensi paling bermasalah (skor tertinggi) */
function getDominantAnalysis(criteria: SVASCriterion[]) {
  const sorted = [...criteria].sort((a, b) => b.score - a.score);
  const dominant = sorted[0];

  return {
    criterionKey: dominant.key,
    criterionLabel: dominant.label,
    score: dominant.score,
    explanation: DOMINANT_EXPLANATIONS[dominant.key] || 'Kriteria ini menjadi fokus perhatian utama berdasarkan respons kamu.',
  };
}

/**
 * Fungsi Utama: Kalkulasi Skrining menggunakan SVAS-6 (Skor Absolut)
 * Menghapus algoritma SAW dan menggunakan rentang 6 - 30.
 */
export function calculateSVAS6(input: UserInput): ScreeningResult {
  if (input.svasScores.length !== 6) {
    throw new Error('SVAS-6 membutuhkan tepat 6 jawaban.');
  }

  // 1. Kalkulasi Total Skor
  const svasTotal = input.svasScores.reduce((sum, val) => sum + val, 0);

  // 2. Tentukan Zona
  const zone = determineZone(svasTotal);

  // 3. Mapping Criteria
  const svasCriteria: SVASCriterion[] = input.svasScores.map((score, index) => {
    const q = SVAS_QUESTIONS[index];
    return {
      key: q.key,
      label: q.dimension,
      score: score,
    };
  });

  // 4. Analisis Dimensi Dominan
  const dominantAnalysis = getDominantAnalysis(svasCriteria);

  // 5. Normalisasi Persentase (hanya untuk grafik UI, (score - 6) / 24 * 100)
  const detoxPercentage = Math.round(((svasTotal - 6) / 24) * 100);

  // 6. Data Konteks & Platform (Sebagai data historis/visualisasi tambahan, tidak memengaruhi skor)
  const contextScores = {
    totalDuration: Object.values(input.platforms).reduce((sum, val) => sum + val, 0),
    sleepHours: input.sleepHours,
    productivityImpact: input.productivityImpact,
  };

  const platformBreakdown = PLATFORM_CONFIG.map((p) => ({
    name: p.name,
    hours: input.platforms[p.key as keyof typeof input.platforms] || 0,
    color: p.color,
    bgColor: p.bgColor,
    icon: '',
  })).sort((a, b) => b.hours - a.hours);

  return {
    detoxPercentage: Math.max(0, Math.min(100, detoxPercentage)),
    zone,
    svasTotal,
    svasCriteria,
    contextScores,
    platformBreakdown,
    dominantAnalysis,
    recommendations: RECOMMENDATIONS[zone],
  };
}
