'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScreeningHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal states
  const [showNameModal, setShowNameModal] = useState(false);
  const [name, setName] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Scroll tracking state
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    if (pathname !== '/homepage') {
      setActiveHash('');
      return;
    }

    const handleScroll = () => {
      // Check from bottom-most section upwards
      const sections = ['cara-kerja', 'dimensi-ukur'];
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is in the top half of the screen
          if (rect.top <= window.innerHeight * 0.4) {
            current = `#${section}`;
            break;
          }
        }
      }
      setActiveHash(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    const handleOpen = () => setShowNameModal(true);
    window.addEventListener('open-screening-modal', handleOpen);
    return () => window.removeEventListener('open-screening-modal', handleOpen);
  }, []);

  const handleScreeningClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const storedName = sessionStorage.getItem('screening_username');
    if (storedName) {
      router.push('/homepage/kuesioner');
    } else {
      setShowNameModal(true);
      setIsMobileMenuOpen(false);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const lowerName = trimmedName.toLowerCase();
    if (lowerName === 'admin' || lowerName === 'guest') {
      alert('Nama ini tidak dapat digunakan.');
      return;
    }

    try {
      sessionStorage.setItem('screening_username', trimmedName);
      sessionStorage.setItem('screening_user_role', 'guest');
      sessionStorage.setItem('screening_logged_in', 'false');
      setShowNameModal(false);
      window.dispatchEvent(new Event('name-submitted'));
      router.push('/homepage/kuesioner');
    } catch (err) {
      console.error(err);
    }
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-surface/90 backdrop-blur-md border-b-[1.5px] border-primary/20 shadow-sm w-full z-[100] fixed top-0 left-0 right-0 transition-all">
      <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-[1200px] mx-auto h-16 md:h-20">
        <Link href="/homepage" className="w-1/4 flex justify-start items-center cursor-pointer no-underline">
          <img src="/logo.png" alt="MindScroll Logo" className="h-[28px] md:h-[40px] w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex justify-center gap-6 h-full items-center flex-1">
          <Link
            href="/homepage"
            className={`whitespace-nowrap relative font-semibold text-base transition-all duration-300 pb-1 ${
              pathname === '/homepage' && activeHash === '' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center ${
              pathname === '/homepage' && activeHash === '' ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Beranda
          </Link>

          <Link
            href="/homepage#dimensi-ukur"
            className={`whitespace-nowrap relative font-semibold text-base transition-all duration-300 pb-1 ${
              pathname === '/homepage' && activeHash === '#dimensi-ukur' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center ${
              pathname === '/homepage' && activeHash === '#dimensi-ukur' ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Dimensi Ukur
          </Link>
          <Link
            href="/homepage#cara-kerja"
            className={`whitespace-nowrap relative font-semibold text-base transition-all duration-300 pb-1 ${
              pathname === '/homepage' && activeHash === '#cara-kerja' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center ${
              pathname === '/homepage' && activeHash === '#cara-kerja' ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Cara Kerja
          </Link>
          <Link
            href="/homepage/kuesioner"
            onClick={handleScreeningClick}
            className={`whitespace-nowrap relative font-semibold text-base transition-all duration-300 pb-1 ${
              pathname?.startsWith('/homepage/kuesioner') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:transition-transform after:duration-300 after:origin-center ${
              pathname?.startsWith('/homepage/kuesioner') ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Screening
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
                pathname === '/homepage' && activeHash === '' ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/homepage#dimensi-ukur"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-semibold text-base transition-colors ${
                pathname === '/homepage' && activeHash === '#dimensi-ukur' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Dimensi Ukur
            </Link>
            <Link
              href="/homepage#cara-kerja"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-semibold text-base transition-colors ${
                pathname === '/homepage' && activeHash === '#cara-kerja' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Cara Kerja
            </Link>
            <Link
              href="/homepage/kuesioner"
              onClick={handleScreeningClick}
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
              Tentang SVAS-6
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ═══════════ GLOBAL NAME INPUT MODAL ═══════════ */}
      {mounted && createPortal(
        <AnimatePresence>
          {showNameModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="fixed inset-0 bg-on-background/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-surface-container-lowest border border-outline-variant p-6 sm:p-8 rounded-2xl shadow-xl w-[90vw] max-w-[420px] min-w-[300px] relative mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowNameModal(false)}
                  className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5 mx-auto">
                  <span className="material-symbols-outlined text-[32px]">person_add</span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface mb-2 text-center">Selamat Datang!</h2>
                <p className="text-base text-on-surface-variant mb-6 text-center leading-relaxed">
                  Masukkan nama kamu untuk memulai proses screening.
                </p>

                <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      Nama Panjang
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3.5 text-on-surface text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                      required
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-base px-4 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 mt-1"
                  >
                    Lanjutkan ke Screening
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
