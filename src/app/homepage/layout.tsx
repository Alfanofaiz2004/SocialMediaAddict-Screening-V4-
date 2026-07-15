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
      <div className="pt-16 md:pt-20">
        <TransitionWrapper>{children}</TransitionWrapper>
      </div>
    </>
  );
}
