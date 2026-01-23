// Terima props searchTerm
const PegawaiPage = ({ searchTerm }) => {
    const pegawai = [
        { nama: "Dr. Budi S.", role: "Ketua", nip: "198001...", score: 98, color: "from-blue-500 to-indigo-600" },
        { nama: "Siti A., S.H.", role: "Wakil Ketua", nip: "198205...", score: 95, color: "from-pink-500 to-rose-600" },
        { nama: "Rahmat H.", role: "Panitera", nip: "197512...", score: 92, color: "from-emerald-500 to-teal-600" },
        { nama: "Joko A.", role: "Sekretaris", nip: "199001...", score: 88, color: "from-amber-500 to-orange-600" },
    ];
    
    // LOGIKA FILTER
    const filteredPegawai = pegawai.filter(p => 
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div className="space-y-6">
        {filteredPegawai.length === 0 && (
             <div className="text-center text-slate-400 py-10">Pegawai tidak ditemukan.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPegawai.map((p, i) => (
                <div key={i} className="bg-white rounded-[32px] p-2 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                    {/* Header Warna Warni */}
                    <div className={`h-24 rounded-[24px] bg-gradient-to-r ${p.color} relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -mr-5 -mt-5"></div>
                    </div>
                    
                    {/* Foto Profil & Info */}
                    <div className="px-4 pb-4 -mt-10 flex flex-col items-center text-center relative z-10">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${p.nama}&background=fff&color=333`} 
                            className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-3" 
                        />
                        <h3 className="font-bold text-slate-800 text-lg">{p.nama}</h3>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">{p.role}</p>
                        <p className="text-[10px] text-slate-300 bg-slate-100 px-2 py-0.5 rounded-md">{p.nip}</p>

                        <div className="w-full mt-6 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-500">Nilai SKP</span>
                                <span className="text-indigo-600">{p.score}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-800 rounded-full" style={{width: `${p.score}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
};
  
export default PegawaiPage;