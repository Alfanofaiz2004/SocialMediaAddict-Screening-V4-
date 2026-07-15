'use client';

import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminCharts({ results }: { results: any[] }) {
  if (!results || results.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center text-on-surface-variant p-xl border border-outline-variant border-dashed rounded-xl">
        <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">bar_chart</span>
        <p>No data available for analytics</p>
      </div>
    );
  }

  // 1. Zone Distribution (Donut)
  const zoneData = {
    green: results.filter((r) => r.result.zone === 'NORMAL').length,
    yellow: results.filter((r) => r.result.zone === 'BERISIKO').length,
    red: results.filter((r) => r.result.zone === 'KECANDUAN_TINGGI').length,
  };
  const zoneOptions: any = {
    chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
    labels: ['Normal', 'Berisiko', 'Kecanduan Tinggi'],
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    plotOptions: { pie: { donut: { size: '70%' } } },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    legend: { position: 'bottom' }
  };

  // 2. Average Platform Usage (Horizontal Bar)
  const platformTotals: Record<string, number> = {};
  const platformCounts: Record<string, number> = {};
  results.forEach(r => {
    if (r.input?.platforms) {
      Object.entries(r.input.platforms).forEach(([plat, hrs]) => {
        platformTotals[plat] = (platformTotals[plat] || 0) + (hrs as number);
        platformCounts[plat] = (platformCounts[plat] || 0) + 1;
      });
    }
  });
  
  const platformLabels = Object.keys(platformTotals).map(k => k.charAt(0).toUpperCase() + k.slice(1));
  const platformAvg = Object.keys(platformTotals).map(k => {
    return Number((platformTotals[k] / platformCounts[k]).toFixed(1));
  });

  const platformOptions: any = {
    chart: { type: 'bar', fontFamily: 'Inter, sans-serif', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, dataLabels: { position: 'top' } } },
    colors: ['#006a60'],
    dataLabels: { enabled: true, offsetX: 20, style: { colors: ['#191c1e'] }, formatter: (val: number) => val + 'h' },
    xaxis: { categories: platformLabels, labels: { style: { colors: '#586377' } } },
    yaxis: { labels: { style: { colors: '#191c1e', fontWeight: 500 } } }
  };

  // 3. SVAS-6 Severity (Vertical Column)
  let normal = 0, berisiko = 0, kecanduan = 0;
  results.forEach(r => {
    const s = r.result.svasTotal || 0;
    if (s <= 14) normal++;
    else if (s <= 18) berisiko++;
    else kecanduan++;
  });

  const svasOptions: any = {
    chart: { type: 'bar', fontFamily: 'Inter, sans-serif', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, distributed: true } },
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: { 
      categories: ['Sehat (6-14)', 'Berisiko (15-18)', 'Kecanduan (19-30)'],
      labels: { style: { colors: '#586377' } }
    },
    yaxis: { labels: { style: { colors: '#586377' } } }
  };

  // 4. Sleep Correlation (Stacked Bar)
  let sleepBuckets = {
    '< 6h': { green: 0, yellow: 0, red: 0 },
    '6 - 8h': { green: 0, yellow: 0, red: 0 },
    '> 8h': { green: 0, yellow: 0, red: 0 }
  };

  results.forEach(r => {
    const sleep = r.input.sleepHours || 7;
    const z = r.result.zone;
    let bucket = '';
    if (sleep < 6) bucket = '< 6h';
    else if (sleep <= 8) bucket = '6 - 8h';
    else bucket = '> 8h';

    if (z === 'NORMAL') sleepBuckets[bucket as keyof typeof sleepBuckets].green++;
    else if (z === 'BERISIKO') sleepBuckets[bucket as keyof typeof sleepBuckets].yellow++;
    else if (z === 'KECANDUAN_TINGGI') sleepBuckets[bucket as keyof typeof sleepBuckets].red++;
  });

  const sleepOptions: any = {
    chart: { type: 'bar', stacked: true, fontFamily: 'Inter, sans-serif', toolbar: { show: false } },
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    plotOptions: { bar: { borderRadius: 2 } },
    xaxis: { categories: ['< 6 hrs', '6 - 8 hrs', '> 8 hrs'], labels: { style: { colors: '#586377' } } },
    yaxis: { labels: { style: { colors: '#586377' } } },
    legend: { position: 'bottom' }
  };

  const sleepSeries = [
    { name: 'Normal', data: [sleepBuckets['< 6h'].green, sleepBuckets['6 - 8h'].green, sleepBuckets['> 8h'].green] },
    { name: 'Berisiko', data: [sleepBuckets['< 6h'].yellow, sleepBuckets['6 - 8h'].yellow, sleepBuckets['> 8h'].yellow] },
    { name: 'Kecanduan', data: [sleepBuckets['< 6h'].red, sleepBuckets['6 - 8h'].red, sleepBuckets['> 8h'].red] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md w-full">
      {/* Zone Chart */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col items-center">
        <h3 className="w-full font-label-md text-on-surface-variant uppercase tracking-wider text-left mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">pie_chart</span> Zone Distribution
        </h3>
        <div className="flex-grow flex items-center justify-center w-full max-w-[350px]">
          <ReactApexChart options={zoneOptions} series={[zoneData.green, zoneData.yellow, zoneData.red]} type="donut" height={300} />
        </div>
      </div>

      {/* Platform Chart */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col items-center">
        <h3 className="w-full font-label-md text-on-surface-variant uppercase tracking-wider text-left mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">phone_iphone</span> Avg Platform Usage
        </h3>
        <div className="flex-grow flex items-center justify-center w-full">
          <ReactApexChart options={platformOptions} series={[{ name: 'Hours', data: platformAvg }]} type="bar" height={300} width="100%" />
        </div>
      </div>

      {/* S-VAS Severity Chart */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col items-center">
        <h3 className="w-full font-label-md text-on-surface-variant uppercase tracking-wider text-left mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">psychology</span> S-VAS Severity
        </h3>
        <div className="flex-grow flex items-center justify-center w-full">
          <ReactApexChart options={svasOptions} series={[{ name: 'Users', data: [normal, berisiko, kecanduan] }]} type="bar" height={300} width="100%" />
        </div>
      </div>

      {/* Sleep Chart */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col items-center">
        <h3 className="w-full font-label-md text-on-surface-variant uppercase tracking-wider text-left mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">bedtime</span> Sleep vs Zone Correlation
        </h3>
        <div className="flex-grow flex items-center justify-center w-full">
          <ReactApexChart options={sleepOptions} series={sleepSeries} type="bar" height={300} width="100%" />
        </div>
      </div>
    </div>
  );
}
