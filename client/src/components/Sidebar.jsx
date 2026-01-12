// client/src/components/Sidebar.jsx
import { useState } from "react";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Data menu dengan ikon SVG path
  const menus = [
    { name: "Dashboard", icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { name: "Perkara (SIPP)", icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { name: "Kepegawaian", icon: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
    { name: "Anggaran & Aset", icon: <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { name: "Laporan", icon: <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl fixed left-0 top-0 z-50">
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-wider text-emerald-400">SIMONEV</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">PN Yogyakarta</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase px-4 mb-2">Menu Utama</p>
        
        {menus.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveMenu(item.name)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeMenu === item.name
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {/* PERBAIKAN DI SINI: SVG RENDER */}
            <svg
              className={`w-5 h-5 ${activeMenu === item.name ? "text-white" : "text-slate-500 group-hover:text-white"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={item.icon.props.d} 
              />
            </svg>
            <span className="font-medium text-sm">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white py-2 rounded-lg transition-colors text-sm">
          <span>Logout</span>
        </button>
        <p className="text-[10px] text-center text-slate-600 mt-4">v2025.1.0 (Beta)</p>
      </div>
    </aside>
  );
};

export default Sidebar;