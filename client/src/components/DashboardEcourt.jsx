// client/src/components/DashboardEcourt.jsx
import { useState, useEffect } from "react";

const DashboardEcourt = () => {
  const [data, setData] = useState({ persentase: 0, ecourt: 0, total: 0 });

  useEffect(() => {
    fetch("http://localhost/simonev-pn/api/kinerja_ecourt.php")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            IKU 1.10 - E-Court
          </h3>
          <p className="text-xs text-slate-400 mt-1">Layanan Perdata Online</p>
        </div>
        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Visual Donut Chart dengan CSS Native */}
        <div 
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{
                background: `conic-gradient(#3b82f6 ${data.persentase * 3.6}deg, #eff6ff 0deg)`
            }}
        >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                <span className="text-xl font-bold text-blue-600">{data.persentase}%</span>
            </div>
        </div>

        <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-800">{data.ecourt}</p>
            <p className="text-xs text-slate-500">Perkara Masuk<br/>via E-Court</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400 flex justify-between">
         <span>Total Perdata: {data.total}</span>
         <span className={data.persentase >= 50 ? "text-blue-600 font-bold" : "text-orange-500 font-bold"}>
            {data.persentase >= 50 ? "Target Tercapai" : "Tingkatkan"}
         </span>
      </div>
    </div>
  );
};

export default DashboardEcourt;