import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MindScroll Screening | Digital Wellbeing Assessment',
  description:
    'A clinical-grade screening tool using the SVAS-6 scale to evaluate digital addiction and mental health impact.',
};

import TransitionWrapper from './TransitionWrapper';
import ScreeningHeader from '@/components/ScreeningHeader';

export default function ScreeningLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScreeningHeader />
      <TransitionWrapper>{children}</TransitionWrapper>
    </>
  );
}
