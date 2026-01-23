import { useState, useEffect } from "react";

const DashboardMinutasi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/projectKP/api/get_kinerja_minutasi.php")
      .then((res) => res.json())
      .then((res) => { setData(res); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-48 bg-slate-200 rounded-3xl animate-pulse"></div>;

  return (
    // Style Card: Gradasi Biru Muda seperti di gambar referensi
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-[32px] shadow-sm border border-white hover:shadow-md transition-all overflow-hidden group">
      
      {/* Header */}
      <div className="flex justify-between items-start z-10 relative">
        <div>
           <p className="text-slate-500 text-sm font-medium mb-1">Total Penyelesaian</p>
           <h2 className="text-4xl font-bold text-slate-800">{data?.total_perkara || 0}</h2>
        </div>
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-600 shadow-sm border border-white">
           ↗ {data?.persentase}% Sukses
        </div>
      </div>

      {/* Visualisasi Bar Chart Abstrak di Bawah */}
      <div className="flex items-end space-x-2 mt-8 h-20 opacity-80">
         {/* Simulasi Bar Chart dengan CSS */}
         <div className="flex-1 bg-blue-200 rounded-t-lg h-[40%] group-hover:h-[50%] transition-all duration-500"></div>
         <div className="flex-1 bg-blue-300 rounded-t-lg h-[60%] group-hover:h-[70%] transition-all duration-500"></div>
         <div className="flex-1 bg-indigo-300 rounded-t-lg h-[30%] group-hover:h-[45%] transition-all duration-500"></div>
         <div className="flex-1 bg-indigo-400 rounded-t-lg h-[80%] group-hover:h-[90%] transition-all duration-500"></div>
         <div className="flex-1 bg-slate-800 rounded-t-lg h-[55%] shadow-lg shadow-slate-400/50"></div> {/* Bar Utama */}
         <div className="flex-1 bg-indigo-300 rounded-t-lg h-[40%] group-hover:h-[50%] transition-all duration-500"></div>
      </div>

      <p className="mt-4 text-xs text-slate-500 relative z-10">
        <span className="font-bold text-slate-800">{data?.tepat_waktu}</span> Perkara Tepat Waktu
      </p>
    </div>
  );
};

export default DashboardMinutasi;