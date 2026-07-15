'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ZONES, SVAS_QUESTIONS, SVAS_OPTIONS } from '@/lib/screening-constants';
import { ZoneType } from '@/lib/screening-types';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminResult {
  id: string;
  createdAt: string;
  userName: string;
  input: {
    svasScores: number[];
    platforms: Record<string, number>;
    sleepHours: number;
    productivityImpact: number;
  };
  result: any;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [results, setResults] = useState<AdminResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [viewModal, setViewModal] = useState<AdminResult | null>(null);
  
  // Filter State
  const [timeFilter, setTimeFilter] = useState<string>('all');
  
  // Pagination State
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter, itemsPerPage]);

  const fetchResults = () => {
    fetch('/api/admin/results')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResults(data.data);
        }
      })
      .catch((err) => console.error('Failed to fetch:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (sessionStorage.getItem('screening_admin_auth') !== 'true') {
      router.push('/homepage/admin/login');
      return;
    }
    fetchResults();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('screening_username');
    sessionStorage.removeItem('screening_auth_token');
    sessionStorage.removeItem('screening_admin_auth');
    sessionStorage.removeItem('screening_user_role');
    sessionStorage.removeItem('screening_logged_in');
    router.push('/homepage');
  };

  const handleExportCSV = () => {
    if (filteredResults.length === 0) return;
    const headers = [
      'ID', 'Date', 'User Name', 'Zone', 'Score %', 'SVAS Total',
      'Total Duration (hrs)', 'Sleep (hrs)', 'Productivity Impact',
      'Q1 (Salience)', 'Q2 (Mood)', 'Q3 (Tolerance)', 'Q4 (Withdrawal)', 'Q5 (Conflict)', 'Q6 (Relapse)'
    ];
    const rows = filteredResults.map(r => {
      const dateStr = new Date(r.createdAt).toLocaleString();
      const s = r.input.svasScores || [];
      return [
        r.id, `"${dateStr}"`, `"${r.userName}"`, r.result.zone, r.result.detoxPercentage,
        r.result.svasTotal || 0,
        r.result.contextScores?.totalDuration?.toFixed(1) || 0, r.input.sleepHours, r.input.productivityImpact || 0,
        s[0] ?? 0, s[1] ?? 0, s[2] ?? 0, s[3] ?? 0, s[4] ?? 0, s[5] ?? 0
      ].join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mindscroll_svas_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus data ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/admin/results?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResults(prev => prev.filter(r => r.id !== id));
      } else {
        alert('Failed to delete record');
      }
    } catch (e) {
      alert('Error deleting record');
    }
  };

  // Filtering Logic
  const filteredResults = results.filter((r) => {
    if (timeFilter === 'all') return true;
    
    const d = new Date(r.createdAt);
    const now = new Date();
    
    if (timeFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }
    if (timeFilter === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      return d >= lastWeek;
    }
    if (timeFilter === 'monthly') {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return d >= firstOfMonth;
    }
    if (timeFilter === 'past_1_month') {
      const pastMonth = new Date();
      pastMonth.setDate(now.getDate() - 30);
      return d >= pastMonth;
    }
    if (timeFilter === 'past_1_year') {
      const pastYear = new Date();
      pastYear.setFullYear(now.getFullYear() - 1);
      return d >= pastYear;
    }
    return true;
  });

  // KPIs Calculation based on filteredResults
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputsToday = filteredResults.filter(r => new Date(r.createdAt) >= today).length;
  const avgScore = filteredResults.length > 0 
    ? (filteredResults.reduce((acc, r) => acc + r.result.detoxPercentage, 0) / filteredResults.length).toFixed(1) 
    : 0;

  // Pagination Logic
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage) || 1;
  const paginatedResults = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center font-sans text-gray-500">Memuat Data Dashboard...</div>;
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col font-sans antialiased relative">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 w-full z-40 sticky top-0 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 max-w-7xl mx-auto h-16">
          <div className="flex items-center gap-3 font-semibold text-lg text-emerald-600">
            <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
            MindScroll Admin
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <span className="font-medium text-sm">Logout</span>
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Screening</h1>
            <p className="text-sm text-gray-500 mt-1">Mengelola data hasil skrining pengguna.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-1.5 shadow-sm">
            <span className="material-symbols-outlined text-gray-500 text-[20px]">filter_list</span>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm text-gray-700 font-medium cursor-pointer"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="weekly">7 Hari Terakhir</option>
              <option value="monthly">Bulan Ini</option>
              <option value="past_1_month">30 Hari Terakhir</option>
              <option value="past_1_year">1 Tahun Terakhir</option>
            </select>
          </div>
        </div>

        {/* Top KPIs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-center shadow-sm">
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">today</span> Input Hari Ini
            </div>
            <div className="text-3xl text-emerald-600 font-bold">{inputsToday}</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-center shadow-sm">
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">fact_check</span> Total Tes (Filtered)
            </div>
            <div className="text-3xl text-emerald-600 font-bold">{filteredResults.length}</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-center shadow-sm">
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">monitoring</span> Rata-rata Skor
            </div>
            <div className="text-3xl text-emerald-600 font-bold">{avgScore}%</div>
          </div>
        </div>

        {/* Data Table Area */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900">Riwayat Screening</h2>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-md px-3 py-1">
                <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
                  <span className="text-sm font-medium text-gray-600">Baris:</span>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-transparent border-none focus:outline-none text-sm text-gray-800 font-semibold cursor-pointer"
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[70px] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>

              <button onClick={handleExportCSV} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                <span className="material-symbols-outlined text-[18px]">download</span> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4">Waktu Tes</th>
                <th className="p-4">Nama Lengkap</th>
                <th className="p-4 text-center">Tingkat Bahaya</th>
                <th className="p-4 text-center">Skor Akhir</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedResults.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Tidak ada riwayat tes ditemukan.</td></tr>
              ) : (
                paginatedResults.map((r) => {
                  const zoneInfo = ZONES[r.result.zone as ZoneType] || ZONES['NORMAL'];
                  return (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(r.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year:'numeric'})} <span className="text-gray-400 ml-1">{new Date(r.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </td>
                      <td className="p-4 font-medium text-gray-900">{r.userName}</td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block"
                          style={{ backgroundColor: `${zoneInfo.color}15`, color: zoneInfo.color, border: `1px solid ${zoneInfo.color}30` }}>
                          {r.result.zone}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-gray-900">{r.result.detoxPercentage}%</td>
                      <td className="p-4 text-center flex justify-center gap-3">
                        <button onClick={() => setViewModal(r)} className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-md transition-colors" title="Lihat Detail">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors" title="Hapus Data">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
        </div>
      </main>

      {/* Simple View Modal */}
      <AnimatePresence>
        {viewModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-3xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              {(() => {
                const zoneInfo = ZONES[viewModal.result.zone as ZoneType] || ZONES['NORMAL'];
                return (
                  <>
                    <div className="p-6 border-b border-gray-200 flex justify-between items-start bg-gray-50">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Detail Skrining</h2>
                        <p className="text-sm text-gray-500">Nama: <span className="font-semibold text-gray-800">{viewModal.userName}</span> | Waktu: {new Date(viewModal.createdAt).toLocaleString('id-ID')}</p>
                      </div>
                      <button onClick={() => setViewModal(null)} className="text-gray-400 hover:text-gray-700 p-1">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto flex-1 bg-white">
                      <div className="flex gap-4 mb-8">
                        <div className="flex-1 bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Status</p>
                          <p className="text-lg font-bold" style={{ color: zoneInfo.color }}>{zoneInfo.label}</p>
                        </div>
                        <div className="flex-1 bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Skor Akhir</p>
                          <p className="text-xl font-bold text-gray-900">{viewModal.result.detoxPercentage}%</p>
                        </div>
                        <div className="flex-1 bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Total S-VAS</p>
                          <p className="text-xl font-bold text-gray-900">{viewModal.result.svasTotal || '-'}/30</p>
                        </div>
                      </div>

                      <h3 className="text-md font-bold text-gray-900 mb-4 border-b pb-2">Jawaban S-VAS</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {SVAS_QUESTIONS.map((q, idx) => {
                          const score = viewModal.input.svasScores?.[idx] ?? 0;
                          const option = SVAS_OPTIONS.find(o => o.value === score);
                          return (
                            <div key={q.id} className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex flex-col gap-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">{q.dimension}</span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700">{option?.label} ({score})</span>
                              </div>
                              <p className="text-sm text-gray-800">{q.text}</p>
                            </div>
                          );
                        })}
                      </div>

                      <h3 className="text-md font-bold text-gray-900 mb-4 border-b pb-2">Data Tambahan Konteks</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Durasi Platform (Total)</p>
                          <p className="text-md font-bold text-gray-900">{viewModal.result.contextScores?.totalDuration?.toFixed(1) || '-'} Jam</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Waktu Tidur</p>
                          <p className="text-md font-bold text-gray-900">{viewModal.input.sleepHours} Jam</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Gangguan Produktivitas</p>
                          <p className="text-md font-bold text-gray-900">{viewModal.input.productivityImpact} / 10</p>
                        </div>
                      </div>

                      <h3 className="text-md font-bold text-gray-900 mb-4 border-b pb-2">Saran Sistem</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {(viewModal.result.recommendations || []).map((rec: any, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700">
                            <strong>{rec.title}</strong>: {rec.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
