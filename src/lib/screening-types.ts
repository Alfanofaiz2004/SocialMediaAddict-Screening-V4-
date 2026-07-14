// === Screening SVAS-6: Type Definitions ===
// Short-Form Video Addiction Scale (SVAS-6)
// Total Score: 6 - 30

export interface PlatformUsage {
  instagram: number; // hours/day
  tiktok: number;    // hours/day
  youtube: number;   // hours/day
  twitter: number;   // hours/day
}

export interface UserInput {
  svasScores: number[];       // 6 items, each 1-5 (Likert)
  platforms: PlatformUsage;   // hours/day per platform
  sleepHours: number;         // hours/night
  productivityImpact: number; // 1-10 scale
}

export type ZoneType = 'NORMAL' | 'BERISIKO' | 'KECANDUAN_TINGGI';

export interface ZoneInfo {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  emoji: string;
}

export interface Recommendation {
  priority: number;
  title: string;
  description: string;
  icon: string;
  urgent?: boolean;
}

export interface SVASCriterion {
  key: string;
  label: string;
  score: number;       // raw 1-5
}

export interface ContextScores {
  totalDuration: number;      // hours/day
  sleepHours: number;         // hours/night
  productivityImpact: number; // 1-10
}

export interface PlatformData {
  name: string;
  hours: number;
  color: string;
  bgColor: string;
  icon: string;
}

export interface DominantAnalysis {
  criterionKey: string;
  criterionLabel: string;
  score: number;
  explanation: string;
}

export interface ScreeningResult {
  detoxPercentage: number;   // (total - 6) / 24 * 100
  zone: ZoneType;
  svasCriteria: SVASCriterion[];
  contextScores: ContextScores;
  platformBreakdown: PlatformData[];
  dominantAnalysis: DominantAnalysis;
  recommendations: Recommendation[];
  svasTotal: number;         // raw sum of 6 scores (6-30)
}

export interface AssessmentResult {
  id?: string;
  username: string;
  userId?: number;
  date: string | Date;
  overallScore: string;
  zone: ZoneType;
  svasTotal: number;
  rawInput: any;
  rawResult: any;
}
