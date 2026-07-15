'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScreeningHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-surface/90 backdrop-blur-md border-b-[1.5px] border-primary/20 shadow-sm w-full z-50 sticky top-0 transition-all">
      <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-[1200px] mx-auto h-16 md:h-20">
        <Link href="/homepage" className="w-1/4 flex justify-start items-center cursor-pointer no-underline">
          <img src="/logo.png" alt="MindScroll Logo" className="h-[28px] md:h-[40px] w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex justify-center gap-6 h-full items-center flex-1">
          <Link
            href="/homepage"
            className={`whitespace-nowrap relative font-semibold text-base transition-all duration-300 pb-1 ${
              pathname === '/homepage' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center ${
              pathname === '/homepage' ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/homepage/kuesioner"
            className={`whitespace-nowrap relative font-semibold text-base transition-all duration-300 pb-1 ${
              pathname?.startsWith('/homepage/kuesioner') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center ${
              pathname?.startsWith('/homepage/kuesioner') ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Screening
          </Link>
          <Link
            href="/homepage#dimensi-ukur"
            className="whitespace-nowrap relative font-semibold text-base transition-all duration-300 pb-1 text-on-surface-variant hover:text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center after:scale-x-0 hover:after:scale-x-100"
          >
            Dimensi Ukur
          </Link>
          <Link
            href="/homepage#cara-kerja"
            className="whitespace-nowrap relative font-semibold text-base transition-all duration-300 pb-1 text-on-surface-variant hover:text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center after:scale-x-0 hover:after:scale-x-100"
          >
            Cara Kerja
          </Link>
          <Link
            href="/homepage/artikel"
            className={`whitespace-nowrap relative font-semibold text-base transition-all duration-300 pb-1 ${
              pathname?.startsWith('/homepage/artikel') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center ${
              pathname?.startsWith('/homepage/artikel') ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Tentang SVAS-6
          </Link>
        </nav>

        <div className="w-1/4 flex justify-end items-center gap-4 relative">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-on-surface-variant focus:outline-none w-10 h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={isMobileMenuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="material-symbols-outlined text-[28px]"
              >
                {isMobileMenuOpen ? 'close' : 'menu'}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden absolute top-16 left-0 w-full bg-surface border-b-[1.5px] border-primary/20 shadow-xl py-4 px-6 flex flex-col gap-4 z-40"
          >
            <Link
              href="/homepage"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-semibold text-base transition-colors ${
                pathname === '/homepage' ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/homepage/kuesioner"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-semibold text-base transition-colors ${
                pathname?.startsWith('/homepage/kuesioner') ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Screening
            </Link>
            <Link
              href="/homepage#dimensi-ukur"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-semibold text-base transition-colors text-on-surface-variant hover:text-primary"
            >
              Dimensi Ukur
            </Link>
            <Link
              href="/homepage#cara-kerja"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-semibold text-base transition-colors text-on-surface-variant hover:text-primary"
            >
              Cara Kerja
            </Link>
            <Link
              href="/homepage/artikel"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-semibold text-base transition-colors ${
                pathname?.startsWith('/homepage/artikel') ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Tentang SVAS-6
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
