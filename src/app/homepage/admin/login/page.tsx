'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('screening_admin_auth', 'true');
        sessionStorage.setItem('screening_user_role', 'admin');
        sessionStorage.setItem('screening_username', 'admin');
        router.push('/homepage/admin');
      } else {
        setError(data.error || 'Login gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] min-w-[300px] bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Admin Login</h1>
          <p className="text-on-surface-variant text-sm mt-1">Sistem Screening MindScroll</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface-variant">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="Masukkan username admin"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface-variant">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary font-bold px-4 py-3.5 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 mt-2 shadow-md disabled:opacity-70"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">login</span>
            )}
            {isLoading ? 'Memproses...' : 'Login ke Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => router.push('/homepage')}
            className="text-primary hover:underline text-sm"
          >
            Kembali ke Beranda
          </button>
        </div>
      </motion.div>
    </div>
  );
}
