'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function ScreeningHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant w-full z-50 sticky top-0">
      <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-[1200px] mx-auto h-16 md:h-20">
        <div className="w-1/3 md:hidden flex justify-start">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-on-surface-variant focus:outline-none">
            <span className="material-symbols-outlined text-[28px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
        <nav className="hidden md:flex gap-6 h-full items-center w-1/3">
          <Link
            href="/homepage"
            className={`relative font-semibold text-base transition-all duration-300 pb-1 ${
              pathname === '/homepage' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center ${
              pathname === '/homepage' ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/homepage/kuesioner"
            className={`relative font-semibold text-base transition-all duration-300 pb-1 ${
              pathname?.startsWith('/homepage/kuesioner') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center ${
              pathname?.startsWith('/homepage/kuesioner') ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Screening
          </Link>
          <Link
            href="/homepage/artikel"
            className={`relative font-semibold text-base transition-all duration-300 pb-1 ${
              pathname?.startsWith('/homepage/artikel') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center ${
              pathname?.startsWith('/homepage/artikel') ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Tentang Tes
          </Link>
        </nav>

        <Link href="/homepage" className="w-1/3 flex justify-center items-center cursor-pointer no-underline">
          <img src="/logo.png" alt="MindScroll Logo" className="h-[28px] md:h-[40px] w-auto object-contain" />
        </Link>

        {/* Empty div to balance flex layout */}
        <div className="w-1/3 flex justify-end items-center gap-4 relative">
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-surface border-b border-outline-variant shadow-lg py-4 px-6 flex flex-col gap-4 z-40">
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
            href="/homepage/artikel"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`font-semibold text-base transition-colors ${
              pathname?.startsWith('/homepage/artikel') ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            Tentang Tes
          </Link>
        </div>
      )}
    </header>
  );
}
