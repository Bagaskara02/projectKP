// client/src/components/DashboardMinutasi.jsx
import { useState, useEffect } from "react";

const DashboardMinutasi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi ambil data dari PHP Backend
  useEffect(() => {
    // Sesuaikan URL ini dengan path folder htdocs Anda
    fetch("http://localhost/simonev-pn/api/kinerja_minutasi.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server");
        }
        return response.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Tampilan saat Loading
  if (loading) {
    return (
      <div className="w-full p-6 bg-white rounded-2xl shadow-sm border border-slate-200 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  // Tampilan jika Error (misal lupa nyalakan XAMPP)
  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 rounded-2xl border border-red-200 text-red-600">
        <p className="font-bold">Terjadi Kesalahan:</p>
        <p className="text-sm">{error}</p>
        <p className="text-xs mt-2">Pastikan XAMPP (Apache & MySQL) sudah Start.</p>
      </div>
    );
  }

  // Logika Warna Dinamis (Tailwind v4)
  const colorMap = {
    HIJAU: "text-emerald-700 bg-emerald-100 border-emerald-200",
    KUNING: "text-amber-700 bg-amber-100 border-amber-200",
    MERAH: "text-rose-700 bg-rose-100 border-rose-200",
  };
  
  const barColorMap = {
    HIJAU: "bg-emerald-500",
    KUNING: "bg-amber-500",
    MERAH: "bg-rose-500",
  };

  // Default ke Merah jika status tidak dikenali
  const statusBadge = colorMap[data.status_kinerja] || colorMap.MERAH;
  const progressBar = barColorMap[data.status_kinerja] || barColorMap.MERAH;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
      
      {/* Header Kartu */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            IKU 1.1 - Minutasi Perkara
          </h3>
          <h2 className="text-4xl font-extrabold text-slate-800 mt-2">
            {data.persentase}%
          </h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge}`}>
          {data.status_kinerja}
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${progressBar}`}
          style={{ width: `${data.persentase}%` }}
        ></div>
      </div>

      {/* Footer Detail Data */}
      <div className="flex justify-between text-sm text-slate-600 border-t border-slate-100 pt-4">
        <div className="flex flex-col">
           <span className="text-xs text-slate-400">Target</span>
           <span className="font-bold">90%</span>
        </div>
        <div className="flex flex-col text-right">
           <span className="text-xs text-slate-400">Realisasi</span>
           <span className="font-bold">
             {data.tepat_waktu} <span className="font-normal text-slate-400">dari</span> {data.total_perkara} Perkara
           </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMinutasi;