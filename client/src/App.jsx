import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardMinutasi from "./components/DashboardMinutasi";
import DashboardEcourt from "./components/DashboardEcourt";
import PerkaraPage from "./components/pages/PerkaraPage";
import PegawaiPage from "./components/pages/PegawaiPage";
import LaporanPage from "./components/pages/LaporanPage";

function App() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  
  // 1. STATE UNTUK SEARCH
  const [searchTerm, setSearchTerm] = useState("");

  // 2. STATE UNTUK NOTIFIKASI
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Laporan Bulan Januari belum diupload.", time: "2 jam lalu", read: false },
    { id: 2, text: "Rapat bulanan diundur ke hari Jumat.", time: "5 jam lalu", read: true },
  ]);
  const [showNotif, setShowNotif] = useState(false);
  const [showToast, setShowToast] = useState(false); // Untuk Pop-up Toast

  // Hitung jumlah notif belum dibaca
  const unreadCount = notifications.filter(n => !n.read).length;

  // 3. SIMULASI NOTIFIKASI MASUK (Pop Up Otomatis setelah 5 detik)
  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotif = { 
        id: Date.now(), 
        text: "Peringatan: Ada 3 Perkara yang akan habis masa tahanan!", 
        time: "Baru saja", 
        read: false 
      };
      setNotifications(prev => [newNotif, ...prev]);
      setShowToast(true); // Munculkan Toast
      
      // Hilangkan Toast setelah 3 detik
      setTimeout(() => setShowToast(false), 3000);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Fungsi Tandai Semua Dibaca
  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Fungsi Render Halaman + Oper Props SearchTerm
  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return (
          <div className="flex flex-col xl:flex-row gap-8 animate-fade-in-up">
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardMinutasi />
                <DashboardEcourt />
                <div className="relative bg-gradient-to-br from-indigo-50 to-blue-100 p-6 rounded-[32px] shadow-sm border border-white flex flex-col justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">Realisasi DIPA</p>
                    <h2 className="text-4xl font-bold text-slate-800">+75%</h2>
                  </div>
                  <div className="flex items-end space-x-1 h-24 opacity-80 mt-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex-1 bg-slate-800 rounded-t-md" style={{ height: `${i * 15}%`, opacity: i / 6 }}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabel Dashboard (Bisa difilter search juga kalau mau, tapi kita fokuskan page lain dulu) */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Monitoring Perkara Terkini</h3>
                </div>
                <div className="text-center py-10 text-slate-400 text-sm bg-slate-50 rounded-2xl">
                    Data realtime dari SIPP sedang dimuat...
                </div>
              </div>
            </div>
            
            <div className="w-full xl:w-80 space-y-6">
               <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4">Capaian IKU</h3>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-slate-800 h-full w-[60%]"></div></div>
               </div>
            </div>
          </div>
        );

      // KITA KIRIM PROP searchTerm KE HALAMAN PERKARA & PEGAWAI
      case "Perkara":
        return <PerkaraPage searchTerm={searchTerm} />;

      case "Pegawai":
        return <PegawaiPage searchTerm={searchTerm} />;

      case "Laporan":
        return <LaporanPage />;

      default:
        return <div>Halaman Dalam Pengembangan</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] font-sans selection:bg-indigo-100 relative">
      
      {/* TOAST POP UP NOTIFICATION */}
      {showToast && (
         <div className="fixed top-5 right-5 z-[100] animate-bounce-in">
            <div className="bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
                <div className="bg-red-500 w-2 h-2 rounded-full animate-ping"></div>
                <div>
                    <h4 className="font-bold text-sm">Notifikasi Baru!</h4>
                    <p className="text-xs text-slate-300">Cek lonceng notifikasi sekarang.</p>
                </div>
            </div>
         </div>
      )}

      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="flex-1 lg:ml-64 p-4 lg:p-8">
        
        {/* HEADER: KITA UBAH LAYOUTNYA DISINI */}
        <header className="flex flex-col lg:flex-row items-center mb-10 gap-4">
          
          {/* 1. BAGIAN KIRI: JUDUL (Width Fixed) */}
          <div className="lg:w-1/4">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {activeMenu === "Dashboard" ? "Good morning, Ketua." : activeMenu}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {activeMenu === "Dashboard" ? "Pantauan kinerja hari ini." : `Data ${activeMenu.toLowerCase()} terupdate.`}
            </p>
          </div>

          {/* 2. BAGIAN TENGAH: SEARCH BAR (Flex-1 agar mengisi ruang tengah) */}
          <div className="flex-1 w-full flex justify-center">
            <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Cari data ${activeMenu.toLowerCase()}...`}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border-none shadow-sm text-sm focus:ring-2 focus:ring-indigo-100 focus:outline-none placeholder-slate-400 text-slate-600 transition-all"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                {/* Tombol Clear Search */}
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                        ✕
                    </button>
                )}
            </div>
          </div>

          {/* 3. BAGIAN KANAN: AKSI & NOTIFIKASI (Width Fixed) */}
          <div className="lg:w-1/4 flex justify-end items-center gap-3 relative">
            
            {/* --- NOTIFICATION BELL --- */}
            <div className="relative">
                <button 
                    onClick={() => setShowNotif(!showNotif)}
                    className={`p-3 rounded-2xl transition-all shadow-sm relative ${showNotif ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  
                  {/* Titik Merah (Hanya muncul jika unreadCount > 0) */}
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </button>

                {/* --- DROPDOWN NOTIFIKASI --- */}
                {showNotif && (
                    <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-[24px] shadow-xl border border-slate-100 z-50 overflow-hidden animate-fade-in-up">
                        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                            <h4 className="font-bold text-slate-800">Notifikasi</h4>
                            <button onClick={markAllRead} className="text-[10px] text-indigo-600 font-bold hover:underline">Tandai dibaca</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="p-4 text-center text-xs text-slate-400">Tidak ada notifikasi.</p>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                                            <div>
                                                <p className={`text-sm ${!n.read ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{n.text}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Tombol Download (Tetap) */}
            <a href="/sk_sekma_2025.pdf" download className="p-3 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 shadow-lg shadow-slate-300 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </a>
          </div>
        </header>

        {renderContent()}

      </div>
    </div>
  );
}

export default App;