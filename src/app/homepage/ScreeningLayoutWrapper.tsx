'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ScreeningHeader from '@/components/ScreeningHeader';
import TransitionWrapper from './TransitionWrapper';

export default function ScreeningLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [questionnaireStep, setQuestionnaireStep] = useState<string>('intro');

  useEffect(() => {
    const handleStepChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setQuestionnaireStep(customEvent.detail);
    };
    window.addEventListener('screening-step-changed', handleStepChange);
    return () => window.removeEventListener('screening-step-changed', handleStepChange);
  }, []);

  const isHeaderHidden = pathname === '/homepage/kuesioner' && questionnaireStep !== 'intro';

  return (
    <>
      <AnimatePresence mode="wait">
        {!isHeaderHidden && (
          <ScreeningHeader 
            key={pathname === '/homepage/hasil' ? 'hasil' : 'normal'} 
            variant={pathname === '/homepage/hasil' ? 'hasil' : 'normal'} 
          />
        )}
      </AnimatePresence>
      <div className={isHeaderHidden ? '' : 'pt-16 md:pt-20'}>
        <TransitionWrapper>{children}</TransitionWrapper>
      </div>
    </>
  );
}
