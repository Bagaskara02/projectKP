import { useState, useEffect } from "react";

const DashboardEcourt = () => {
  const [data, setData] = useState({ persentase: 0, ecourt: 0, total: 0 });

  useEffect(() => {
    fetch("http://localhost/projectKP/api/kinerja_ecourt.php")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    // Style Card: Gradasi Pink-Ungu
    <div className="relative bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-[32px] shadow-sm border border-white hover:shadow-md transition-all overflow-hidden">
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">E-Court Users</p>
          <h2 className="text-4xl font-bold text-slate-800">+{data.ecourt}</h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-pink-500 shadow-sm">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
      </div>

      {/* Visualisasi Pattern Dots/Stripes seperti di gambar */}
      <div className="relative h-24 w-full flex items-end space-x-1">
         {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-1 bg-purple-300/30 rounded-t-md border-t border-r border-purple-400/20" 
                 style={{ height: `${Math.random() * 60 + 20}%` }}></div>
         ))}
         {/* Bar Highlight */}
         <div className="flex-1 bg-gradient-to-t from-purple-800 to-pink-600 rounded-t-lg h-[85%] shadow-lg shadow-purple-500/30"></div>
         {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-1 bg-pink-300/30 rounded-t-md border-t border-r border-pink-400/20" 
                 style={{ height: `${Math.random() * 50 + 20}%` }}></div>
         ))}
      </div>

      <div className="flex justify-between items-center mt-4 text-xs">
         <span className="text-slate-500">Dari {data.total} Perkara</span>
         <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-lg">{data.persentase}%</span>
      </div>
    </div>
  );
};

export default DashboardEcourt;