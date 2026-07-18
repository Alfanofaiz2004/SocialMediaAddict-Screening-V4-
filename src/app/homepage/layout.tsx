import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MindScroll Screening | Digital Wellbeing Assessment',
  description:
    'A clinical-grade screening tool using the SVAS-6 scale to evaluate digital addiction and mental health impact.',
};

import ScreeningLayoutWrapper from './ScreeningLayoutWrapper';

export default function ScreeningLayout({ children }: { children: React.ReactNode }) {
  return <ScreeningLayoutWrapper>{children}</ScreeningLayoutWrapper>;
}
