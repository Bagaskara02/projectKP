// client/src/components/DashboardAnggaran.jsx
import { useState, useEffect } from "react";

const DashboardAnggaran = () => {
  const [data, setData] = useState({ nilai_ikpa: 0, realisasi: 0, periode: "-" });

  useEffect(() => {
    fetch("http://localhost/simonev-pn/api/kinerja_anggaran.php")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all">
      <div className="mb-6">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            IKU 3.2 - Kinerja Anggaran
        </h3>
        <p className="text-xs text-slate-400 mt-1">Periode Data: {data.periode}</p>
      </div>

      <div className="space-y-6">
        
        {/* Indikator 1: IKPA (Kualitas) */}
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-bold text-slate-700">Nilai IKPA</span>
                <span className="text-sm font-bold text-emerald-600">{data.nilai_ikpa} / 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${data.nilai_ikpa}%` }}
                ></div>
            </div>
        </div>

        {/* Indikator 2: Realisasi (Penyerapan) */}
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-bold text-slate-700">Penyerapan DIPA</span>
                <span className="text-sm font-bold text-indigo-600">{data.realisasi}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${data.realisasi}%` }}
                ></div>
            </div>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-slate-50">
        <button className="w-full py-2 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors">
            Lihat Detail Rincian (DIPA 01 & 03)
        </button>
      </div>
    </div>
  );
};

export default DashboardAnggaran;