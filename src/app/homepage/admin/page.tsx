'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminCharts from '@/components/AdminCharts';
import { ZONES, SVAS_QUESTIONS, SVAS_OPTIONS } from '@/lib/screening-constants';
import { ZoneType } from '@/lib/screening-types';
import { CriteriaBarChart, PlatformBarChart, SVASRadarChart, DimensionAccordion } from '@/components/ResultVisualizations';
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
  const [editModal, setEditModal] = useState<AdminResult | null>(null);
  const [editName, setEditName] = useState('');
  const [showSvasDetails, setShowSvasDetails] = useState(false);

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

  const handleEditSave = async () => {
    if (!editModal || !editName.trim()) return;
    try {
      const res = await fetch('/api/admin/results', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editModal.id, userName: editName.trim() })
      });
      if (res.ok) {
        setResults(prev => prev.map(r => r.id === editModal.id ? { ...r, userName: editName.trim() } : r));
        setEditModal(null);
      } else {
        alert('Failed to update record');
      }
    } catch (e) {
      alert('Error updating record');
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
    return <div className="min-h-screen bg-background flex items-center justify-center font-body-md text-on-surface-variant">Memuat Data...</div>;
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased relative">
      {/* Admin Header */}
      <header className="bg-surface border-b border-outline-variant w-full z-40 sticky top-0">
        <div className="flex justify-between items-center w-full px-gutter max-w-[1200px] mx-auto h-16">
          <div className="flex items-center gap-xs font-headline-md text-primary font-bold">
            <span className="material-symbols-outlined mr-2">admin_panel_settings</span>
            MindScroll Admin Dashboard
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors">
            <span className="font-label-md">Logout</span>
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-gutter py-xl flex flex-col gap-lg">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Ringkasan Analitik</h1>
            <p className="font-body-md text-on-surface-variant">Menampilkan data dari {filteredResults.length} tes</p>
          </div>
          
          <div className="flex items-center gap-2 bg-surface border border-outline-variant rounded-lg px-3 py-1.5 shadow-sm">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">filter_list</span>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none font-label-md text-on-surface cursor-pointer pr-2"
            >
              <option value="today">Hari Ini</option>
              <option value="weekly">7 Hari Terakhir</option>
              <option value="monthly">Bulan Ini</option>
              <option value="past_1_month">30 Hari Terakhir</option>
              <option value="past_1_year">1 Tahun Terakhir</option>
              <option value="all">Semua Waktu</option>
            </select>
          </div>
        </div>

        {/* Top KPIs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md w-full">
          <motion.div 
            initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-center shadow-sm"
          >
            <div className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">today</span> Input Hari Ini
            </div>
            <div className="font-display-sm text-3xl text-primary font-bold">{inputsToday}</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-center shadow-sm"
          >
            <div className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">fact_check</span> Total Tes
            </div>
            <div className="font-display-sm text-3xl text-primary font-bold">{filteredResults.length}</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-center shadow-sm"
          >
            <div className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">monitoring</span> Rata-rata Skor
            </div>
            <div className="font-display-sm text-3xl text-primary font-bold">{avgScore}%</div>
          </motion.div>
        </div>

        {/* Analytics Section */}
        <div className="w-full mt-md mb-lg">
          <AdminCharts results={filteredResults} />
        </div>

        {/* Data Table Area */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm mt-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
            <h2 className="text-xl font-bold text-on-surface">Riwayat Screening</h2>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              {/* Pagination Controls */}
              <div className="flex items-center gap-4 bg-surface border border-outline-variant rounded-lg px-3 py-1 shadow-sm">
                <div className="flex items-center gap-2 border-r border-outline-variant pr-4">
                  <span className="font-label-md text-on-surface-variant">Baris:</span>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-transparent border-none focus:outline-none font-label-md text-on-surface cursor-pointer"
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
                    className="p-1 rounded-full hover:bg-surface-variant disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <span className="font-label-md text-on-surface min-w-[70px] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-full hover:bg-surface-variant disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>

              <button onClick={handleExportCSV} className="bg-primary hover:bg-primary-container text-on-primary font-label-md px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                <span className="material-symbols-outlined text-[20px]">download</span> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-sm uppercase tracking-wider">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Nama</th>
                <th className="p-4 text-center">Jawaban (Q1-Q6)</th>
                <th className="p-4 text-center">S-VAS</th>
                <th className="p-4">Zona</th>
                <th className="p-4">Skor</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedResults.length === 0 ? (
                <tr><td colSpan={6} className="p-lg text-center text-on-surface-variant">Tidak ada rekaman tes ditemukan.</td></tr>
              ) : (
                paginatedResults.map((r) => (
                  <tr key={r.id} className="border-b border-outline-variant hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-sm text-on-surface-variant">{new Date(r.createdAt).toLocaleDateString()} {new Date(r.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td className="p-4 font-medium text-on-surface">{r.userName}</td>
                    <td className="p-4">
                      {r.input.svasScores && r.input.svasScores.length > 0 ? (
                        <div className="flex justify-center gap-1">
                          {r.input.svasScores.map((score, i) => (
                            <span key={i} className={`w-6 h-6 flex items-center justify-center rounded text-[11px] font-bold ${
                              score >= 4 ? 'bg-error/10 text-error' :
                              score === 3 ? 'bg-[#f59e0b]/10 text-[#d97706]' :
                              'bg-primary/10 text-primary'
                            }`} title={`Q${i+1}: ${score}`}>
                              {score}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-xs text-on-surface-variant italic">-</div>
                      )}
                    </td>
                    <td className="p-4 text-center text-on-surface-variant">{r.result.svasTotal || '-'}/30</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        r.result.zone === 'SEHAT' ? 'bg-[#d1fae5] text-[#065f46]' : 
                        r.result.zone === 'BERISIKO' ? 'bg-[#fef3c7] text-[#92400e]' : 
                        'bg-[#fee2e2] text-[#991b1b]'
                      }`}>
                        {r.result.zone === 'KECANDUAN' ? 'Kecanduan' : r.result.zone === 'SEHAT' ? 'Sehat' : 'Berisiko'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-on-surface">{r.result.detoxPercentage}%</td>
                    <td className="p-4 text-center flex justify-center gap-3">
                      <button onClick={() => setViewModal(r)} className="text-primary hover:text-primary-container" title="View Details">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button onClick={() => { setEditModal(r); setEditName(r.userName); }} className="text-primary hover:text-primary-container" title="Edit Name">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="text-error hover:text-on-error-container" title="Delete Record">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="fixed inset-0 bg-on-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, filter: 'blur(10px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} exit={{ scale: 0.95, opacity: 0, filter: 'blur(10px)' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl w-full max-w-[448px] shadow-lg relative"
            >
              <button onClick={() => setEditModal(null)} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2 className="font-headline-md text-on-surface mb-xs">Edit Record</h2>
              <p className="font-body-sm text-on-surface-variant mb-md">Update the user's name for this assessment record.</p>
            
            <div className="flex flex-col gap-2 mb-lg">
              <label className="font-label-sm text-on-surface-variant">Full Name</label>
              <input 
                type="text" 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              />
            </div>
            
              <div className="flex justify-end gap-3">
                <button onClick={() => setEditModal(null)} className="px-4 py-2 font-label-md text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors">Cancel</button>
                <button onClick={handleEditSave} className="bg-primary text-on-primary px-4 py-2 font-label-md rounded-lg hover:bg-primary-container transition-colors">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewModal && (
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="fixed inset-0 bg-on-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20, filter: 'blur(10px)' }} 
              animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }} 
              exit={{ scale: 0.95, opacity: 0, y: 20, filter: 'blur(10px)' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-surface-container-lowest border border-outline-variant rounded-3xl w-full max-w-5xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
            >
              {(() => {
                const zoneInfo = ZONES[viewModal.result.zone as ZoneType] || ZONES['SEHAT'];
                return (
                  <>
                    {/* Premium Header with Zone Colors */}
                    <div className="p-xl relative overflow-hidden shrink-0 border-b border-outline-variant" style={{ backgroundColor: zoneInfo.bgColor }}>
                      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-[120px] leading-none transform translate-x-1/4 -translate-y-1/4">
                        {zoneInfo.emoji}
                      </div>
                      <button onClick={() => setViewModal(null)} className="absolute top-4 right-4 text-on-surface hover:bg-surface/50 rounded-full p-2 backdrop-blur-sm transition-all z-10">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                      
                      <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                          <div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-sm"
                              style={{ backgroundColor: zoneInfo.color, color: '#fff' }}
                            >
                              {zoneInfo.label}
                            </span>
                            <h2 className="font-display-md text-on-surface font-bold tracking-tight">{viewModal.userName}</h2>
                            <p className="font-body-sm text-on-surface-variant flex items-center gap-1.5 mt-2 opacity-80">
                              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                              {new Date(viewModal.createdAt).toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="flex gap-4">
                            <div className="bg-surface/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col items-center min-w-[120px]">
                              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Score Final</span>
                              <span className="font-display-lg font-bold" style={{ color: zoneInfo.color }}>{viewModal.result.detoxPercentage}%</span>
                            </div>
                            <div className="bg-surface/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col items-center min-w-[120px]">
                              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">S-VAS Total</span>
                              <span className="font-display-lg font-bold" style={{ color: zoneInfo.color }}>{viewModal.result.svasTotal || '-'}/30</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Scrollable Body */}
                    <div className="p-xl overflow-y-auto flex-1 flex flex-col gap-xl bg-surface-container-lowest">
                      
                      {/* Grid 1: Tingkat Kriteria */}
                      <div className="grid grid-cols-1 gap-8 mb-8">
                        <div className="bg-surface border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col">
                          <div className="flex items-center gap-2 mb-6 justify-center">
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">bar_chart</span>
                            <h3 className="font-label-md uppercase tracking-wider text-on-surface">Tingkat Kriteria</h3>
                          </div>
                          <div className="flex-1 w-full flex flex-col items-center justify-center mt-4 px-4 sm:px-12">
                            <CriteriaBarChart criteria={viewModal.result.svasCriteria || []} />
                            
                            <div className="w-full mt-10 pt-6 border-t border-outline-variant/50">
                              <h4 className="font-label-md uppercase tracking-wider text-on-surface mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">psychology</span>
                                Penjelasan Detail Dimensi
                              </h4>
                              <DimensionAccordion criteria={viewModal.result.svasCriteria || []} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SVAS Question Record */}
                      <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-surface-variant/30 p-lg border-b border-outline-variant flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-primary">fact_check</span>
                          <h3 className="font-label-md uppercase tracking-wider text-on-surface">Rekam Jawaban Tes S-VAS</h3>
                        </div>
                        <div className="p-lg bg-surface-container-lowest">
                          {viewModal.input.svasScores && viewModal.input.svasScores.length > 0 ? (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                              {SVAS_QUESTIONS.map((q, idx) => {
                                const score = viewModal.input.svasScores[idx] ?? 0;
                                const option = SVAS_OPTIONS.find(o => o.value === score);
                                return (
                                  <li key={q.id} className="flex flex-col gap-3 pb-6 border-b border-outline-variant/60 last:border-0 md:nth-last-child(-n+2):border-0 md:nth-last-child(-n+2):pb-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: option?.color || '#555' }}>
                                        {q.dimension}
                                      </span>
                                      <span 
                                        className="px-3 py-1 rounded-md text-[11px] font-bold shadow-sm border"
                                        style={{ backgroundColor: `${option?.color || '#ccc'}15`, color: option?.color || '#555', borderColor: `${option?.color || '#ccc'}30` }}
                                      >
                                        {option?.label || 'N/A'} ({score})
                                      </span>
                                    </div>
                                    <p className="text-base text-on-surface leading-relaxed">{q.text}</p>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-on-surface-variant text-sm italic py-4 text-center bg-surface-container-low rounded-lg border border-outline-variant/50">Data rekaman jawaban pertanyaan tidak tersedia untuk riwayat ini.</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                        <div className="bg-surface border border-outline-variant rounded-2xl p-lg shadow-sm">
                          <div className="flex items-center gap-2 mb-6 justify-center">
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">radar</span>
                            <h3 className="font-label-md uppercase tracking-wider text-on-surface">Pola Adiksi (S-VAS)</h3>
                          </div>
                          <div className="w-full flex justify-center">
                            <SVASRadarChart criteria={viewModal.result.svasCriteria || []} />
                          </div>
                        </div>
                        {/* Context Data */}
                        <div className="bg-surface border border-outline-variant rounded-2xl p-lg shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-6 justify-center">
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">analytics</span>
                            <h3 className="font-label-md uppercase tracking-wider text-on-surface">Data Konteks Saat Tes</h3>
                          </div>
                          <div className="flex flex-col gap-4 mt-4">
                            <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                              <div className="flex items-center gap-3 text-on-surface-variant">
                                <span className="material-symbols-outlined">timer</span>
                                <span className="font-medium">Durasi Tonton (Jam/Hari)</span>
                              </div>
                              <span className="font-bold text-lg text-primary">{viewModal.result.contextScores?.totalDuration?.toFixed(1) || '-'} Jam</span>
                            </div>
                            <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                              <div className="flex items-center gap-3 text-on-surface-variant">
                                <span className="material-symbols-outlined">bedtime</span>
                                <span className="font-medium">Waktu Tidur Semalam</span>
                              </div>
                              <span className="font-bold text-lg text-primary">{viewModal.input.sleepHours} Jam</span>
                            </div>
                            <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                              <div className="flex items-center gap-3 text-on-surface-variant">
                                <span className="material-symbols-outlined">trending_down</span>
                                <span className="font-medium">Ggn. Produktivitas</span>
                              </div>
                              <span className="font-bold text-lg text-primary">{viewModal.input.productivityImpact} / 10</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Platform Duration Breakdown */}
                        <div className="bg-surface border border-outline-variant rounded-2xl p-lg shadow-sm">
                          <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">pie_chart</span>
                            <h3 className="font-label-md uppercase tracking-wider text-on-surface">Distribusi Waktu Platform</h3>
                          </div>
                          <div className="bg-surface-container-lowest rounded-xl p-md">
                            <PlatformBarChart 
                              data={Object.entries(viewModal.input.platforms || {}).map(([name, hours]) => ({ name, hours: hours as number }))} 
                            />
                          </div>
                        </div>

                      {/* Recommendations */}
                        <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                          <div className="bg-primary/5 p-lg border-b border-outline-variant flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-primary">lightbulb</span>
                            <h3 className="font-label-md uppercase tracking-wider text-on-surface text-primary">Saran & Solusi Sistem</h3>
                          </div>
                          <div className="p-lg bg-surface-container-lowest">
                            <div className="grid grid-cols-1 gap-4">
                              {(viewModal.result.recommendations || []).map((rec: any, idx: number) => (
                                <div key={idx} className={`border rounded-xl p-md flex flex-col sm:flex-row gap-4 sm:items-start transition-colors hover:bg-surface-variant/20 ${rec.urgent ? 'border-error/30 bg-error/5' : 'border-outline-variant/50'}`}>
                                  <div className={`p-3 rounded-lg shrink-0 flex items-center justify-center ${rec.urgent ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                                    <span className="material-symbols-outlined text-[28px]">
                                      {rec.icon || 'star'}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-title-md text-on-surface mb-2 flex items-center gap-3">
                                      {rec.title}
                                      {rec.urgent && <span className="px-2 py-0.5 bg-error text-on-error rounded text-[10px] uppercase font-bold tracking-widest shadow-sm">Urgent</span>}
                                    </h4>
                                    <p className="text-base text-on-surface-variant leading-relaxed">{rec.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>                      
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
