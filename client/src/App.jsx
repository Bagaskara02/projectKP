// client/src/App.jsx
import Sidebar from "./components/Sidebar";
import DashboardMinutasi from "./components/DashboardMinutasi";
import DashboardEcourt from "./components/DashboardEcourt";    // <-- Import Baru
import DashboardAnggaran from "./components/DashboardAnggaran"; // <-- Import Baru

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* Sidebar (Kiri) */}
      <Sidebar />

      {/* Konten Utama (Kanan) */}
      <div className="flex-1 ml-64 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/80">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard Utama</h2>
            <p className="text-xs text-slate-500 mt-0.5">Pantauan Kinerja Real-time Pengadilan Negeri</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-700">Administrator</p>
              <div className="flex items-center justify-end space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-emerald-600 font-medium">Online</p>
              </div>
            </div>
            <img
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
              src="https://ui-avatars.com/api/?name=Admin+PN&background=0f172a&color=fff"
              alt="Profile"
            />
          </div>
        </header>

        {/* Isi Dashboard */}
        <main className="p-8">

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white mb-8 shadow-lg flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold">Halo, Ketua Pengadilan!</h3>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Berdasarkan SK SEKMA No. 27/01/2025, terdapat pembaruan pada indikator penilaian kinerja Mediasi dan E-Berpadu.
              </p>
            </div>
            <div className="hidden lg:block relative z-10">
              <a
                href="/sk_sekma_2025.pdf"             /* Path ke file di folder public */
                download="SK SEKMA 27101 IKU 10 11 2025"  /* Nama file saat disimpan user */
                target="_blank"                       /* Opsional: Buka di tab baru jika download gagal */
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/30 transition-all inline-flex items-center space-x-2"
              >
                {/* Ikon Download (Opsional, biar makin keren) */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Unduh Laporan PDF</span>
              </a>
            </div>
            {/* Hiasan background abstrak */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          </div>

          {/* GRID DASHBOARD UTAMA */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* 1. Kinerja Perkara (Minutasi) */}
            <DashboardMinutasi />

            {/* 2. Kinerja Layanan (E-Court) */}
            <DashboardEcourt />

            {/* 3. Kinerja Kesekretariatan (Anggaran) */}
            <DashboardAnggaran />

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;