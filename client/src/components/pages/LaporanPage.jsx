const LaporanPage = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Banner Download */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-300 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="relative z-10">
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Terbaru</span>
                    <h2 className="text-2xl font-bold mt-2">SK SEKMA No. 27101</h2>
                    <p className="text-slate-400 text-sm mt-1">Pedoman Indikator Kinerja Utama 2025.</p>
                </div>
                {/* Pastikan file sk_sekma_2025.pdf ada di folder public */}
                <a href="/sk_sekma_2025.pdf" download className="relative z-10 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition">
                    Unduh PDF
                </a>
                
                {/* Hiasan background */}
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-800 rounded-full opacity-50 -mb-10 -mr-10"></div>
            </div>

            {/* List Arsip */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Arsip Laporan Bulanan</h3>
                <div className="space-y-2">
                    {['Laporan Januari 2025', 'Laporan Februari 2025'].map((lap, i) => (
                        <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                </div>
                                <span className="text-sm font-medium text-slate-600">{lap}</span>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:text-indigo-600">Lihat</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Kolom Kanan: Statistik Kecil */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm h-fit">
            <h3 className="font-bold text-slate-800 mb-4">Statistik Laporan</h3>
            <div className="flex items-end gap-2 h-32">
                <div className="flex-1 bg-indigo-100 rounded-t-lg h-[40%]"></div>
                <div className="flex-1 bg-indigo-200 rounded-t-lg h-[60%]"></div>
                <div className="flex-1 bg-indigo-500 rounded-t-lg h-[80%] relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">100%</div>
                </div>
                <div className="flex-1 bg-indigo-100 rounded-t-lg h-[50%]"></div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">Kepatuhan Upload Laporan</p>
        </div>
      </div>
    );
};
  
export default LaporanPage;