// Terima props searchTerm
const PerkaraPage = ({ searchTerm }) => {
  const data = [
    { no: "12/Pdt.G/2025", tgl: "02 Jan", pihak: "Budi vs PT. Maju", status: "Minutasi", badge: "bg-emerald-100 text-emerald-600" },
    { no: "45/Pid.B/2025", tgl: "05 Jan", pihak: "JPU vs Andri", status: "Proses Sidang", badge: "bg-blue-100 text-blue-600" },
    { no: "03/Pdt.P/2025", tgl: "10 Jan", pihak: "Siti Aminah", status: "Putus", badge: "bg-purple-100 text-purple-600" },
    { no: "11/Pid.Sus/2025", tgl: "12 Jan", pihak: "Anak Berhadapan Hukum", status: "Diversi Gagal", badge: "bg-rose-100 text-rose-600" },
    { no: "08/Pdt.G/2025", tgl: "15 Jan", pihak: "Bank BRI vs Joko", status: "Mediasi", badge: "bg-amber-100 text-amber-600" },
  ];

  // LOGIKA FILTER: Cari berdasarkan Nomor ATAU Pihak
  const filteredData = data.filter(item => 
     item.no.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.pihak.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Jika hasil pencarian kosong */}
      {filteredData.length === 0 && (
         <div className="p-8 text-center text-slate-400 bg-white rounded-3xl border border-slate-100 border-dashed">
            Tidak ditemukan data perkara dengan kata kunci "{searchTerm}"
         </div>
      )}

      <div className="space-y-3">
        {/* Header Kolom (Tetap sama) */}
        <div className="grid grid-cols-12 gap-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-3">Nomor Perkara</div>
            <div className="col-span-4">Para Pihak</div>
            <div className="col-span-2">Tanggal</div>
            <div className="col-span-3 text-center">Status</div>
        </div>

        {/* Gunakan filteredData untuk looping */}
        {filteredData.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-50 hover:shadow-md transition-all cursor-pointer group">
                <div className="col-span-3 font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {item.no}
                </div>
                <div className="col-span-4 text-sm text-slate-500 font-medium truncate">
                    {item.pihak}
                </div>
                <div className="col-span-2 text-xs text-slate-400 bg-slate-50 py-1 px-2 rounded-lg w-fit">
                    {item.tgl}
                </div>
                <div className="col-span-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${item.badge}`}>
                        {item.status}
                    </span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PerkaraPage;