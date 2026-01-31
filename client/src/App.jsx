import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from "react-router-dom";
import { 
  FaHome, FaBookmark, FaChevronRight, FaChevronDown, 
  FaBars, FaSignOutAlt, FaCheckCircle, FaSearch, 
  FaFileAlt, FaClock, FaTimesCircle, FaChartPie, FaPlus, FaTrash,
  FaDownload, FaUserFriends, FaStar, FaSave, FaEdit, FaFileExcel, FaTimes
} from "react-icons/fa";
import * as XLSX from "xlsx";

// =====================================================================
// 1. DATA INDIKATOR (FULL TEXT - TIDAK DISINGKAT)
// =====================================================================
const indicatorsData = [
  {
    key: "sasaran-1",
    category: "Terwujudnya Peradilan yang Efektif, Transparan, Akuntabel, Responsif dan Modern",
    color: "blue",
    items: [
      { 
        id: "1.1", 
        label: "1.1 Persentase Penyelesaian Perkara Secara Tepat Waktu",
        formula: "(Jumlah perkara yang diselesaikan tepat waktu / Jumlah perkara yang diselesaikan) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.1",
          "Perhitungan penyelesaian perkara tingkat pertama secara tepat waktu yaitu penyelesaian perkara sejak mendapatkan nomor register hingga perkara di minutasi sesuai ketentuan.",
          "Tidak termasuk perkara yang tergugat dipanggil via media massa/luar negeri.",
          "Dasar Hukum: SEMA No 2 Tahun 2014 & Surat Dirjen Badilum No 486/2021."
        ]
      },
      { 
        id: "1.2", 
        label: "1.2 Persentase Penyediaan/Pengiriman Salinan Putusan Tepat Waktu",
        formula: "(Jumlah salinan putusan yang tersedia/dikirimkan tepat waktu / Jumlah perkara yang diputus) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.2",
          "Perdata: Dihitung sejak putusan diucapkan sampai tersedianya salinan di SIPP.",
          "Pidana: Dihitung sejak putusan diucapkan sampai diterima para pihak (Jurusita/Elektronik/Pos)."
        ]
      },
      { 
        id: "1.3", 
        label: "1.3 Persentase Pengiriman Pemberitahuan Petikan/Amar Putusan Banding, Kasasi, PK Tepat Waktu",
        formula: "(Jumlah pemberitahuan petikan/amar putusan tepat waktu / Jumlah petikan/amar yang diterima) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.3",
          "Dihitung sejak pemberitahuan diterima pengadilan pengaju sampai disampaikan ke para pihak."
        ]
      },
      { 
        id: "1.4", 
        label: "1.4 Persentase Pengiriman Salinan Putusan Pidana Banding, Kasasi, PK Tepat Waktu",
        formula: "(Jumlah salinan putusan dikirimkan tepat waktu / Jumlah salinan putusan diterima) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.4",
          "Khusus perkara Pidana.",
          "Dihitung sejak salinan diterima pengadilan pengaju sampai disampaikan ke para pihak."
        ]
      },
      { 
        id: "1.5", 
        label: "1.5 Persentase Putusan yang Diunggah pada Direktori Putusan",
        formula: "(Jumlah putusan yang diunggah pada direktori putusan / Jumlah putusan yang telah diminutasi) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.5",
          "Mengukur kepatuhan unggah putusan paling lambat saat minutasi.",
          "Dasar Hukum: SK KMA Nomor 2-144/KMA/SK/VIII/2022."
        ]
      },
      { 
        id: "1.6", 
        label: "1.6 Persentase Penyelesaian Permohonan Eksekusi Putusan Perdata",
        formula: "(Jumlah permohonan eksekusi yang diselesaikan / Jumlah putusan perdata yang dimohonkan eksekusi) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.6",
          "Diselesaikan meliputi: Berhasil dilaksanakan, Dicabut, atau Dicoret (non executable)."
        ]
      },
      { 
        id: "1.7", 
        label: "1.7 Persentase Perkara yang Berhasil Diselesaikan Melalui Keadilan Restoratif",
        formula: "(Jumlah perkara berhasil RJ / Jumlah perkara yang memenuhi kriteria RJ) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.7",
          "Berpedoman pada PERMA 1 Tahun 2024.",
          "Termasuk tindak pidana ringan, delik aduan, anak, atau lalin."
        ]
      },
      { 
        id: "1.8", 
        label: "1.8 Persentase Perkara yang Berhasil Diselesaikan Melalui Mediasi",
        formula: "(Jumlah perkara berhasil mediasi / Jumlah perkara wajib mediasi) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.8",
          "Berhasil meliputi: Damai seluruhnya, Pencabutan perkara, atau Damai sebagian.",
          "Tidak termasuk perkara yang gagal karena ketidakhadiran salah satu pihak."
        ]
      },
      { 
        id: "1.9", 
        label: "1.9 Persentase Perkara Anak yang Berhasil Diselesaikan Melalui Diversi",
        formula: "(Jumlah perkara anak berhasil diversi / Jumlah perkara anak yang selesai proses diversi) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.9",
          "Syarat: Ancaman di bawah 7 tahun dan bukan pengulangan.",
          "Berhasil ditandai dengan penetapan diversi dari Ketua Pengadilan."
        ]
      },
      { 
        id: "1.10", 
        label: "1.10 Persentase Perkara Perdata Tingkat Pertama Menggunakan E-Court",
        formula: "(Jumlah perkara perdata via e-Court / Jumlah seluruh perkara perdata yang diajukan) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.10",
          "Dasar Hukum: PERMA No 7 Tahun 2022.",
          "Mencakup gugatan, bantahan, gugatan sederhana, dan permohonan."
        ]
      },
      { 
        id: "1.11", 
        label: "1.11 Persentase Perkara Pidana yang Dilimpahkan secara Elektronik (e-Berpadu)",
        formula: "(Jumlah perkara pidana via e-Berpadu / Jumlah perkara pidana yang dilimpahkan) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.11",
          "Mengukur pelimpahan berkas perkara pidana secara elektronik."
        ]
      },
      { 
        id: "1.12", 
        label: "1.12 Persentase Layanan Perkara Pidana yang Diajukan secara Elektronik (e-Berpadu)",
        formula: "(Jumlah layanan pidana via elektronik / Jumlah total layanan perkara pidana) x 100%",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 1.12",
          "Layanan meliputi: Penyitaan, Penggeledahan, Perpanjangan Penahanan, Izin Besuk, dll."
        ]
      }
    ]
  },
  {
    key: "sasaran-2",
    category: "Meningkatnya Tingkat Keyakinan dan Kepercayaan Publik",
    color: "orange",
    items: [
      { 
        id: "2.1", 
        label: "2.1 Indeks Kepuasan Pengguna Layanan Pengadilan",
        formula: "Hasil Survei Kepuasan Masyarakat (SKM)",
        notes: [
          "Sumber: Lampiran V SK SEKMA 2025 No 2.1",
          "Berdasarkan 9 unsur layanan (Persyaratan, Prosedur, Waktu, Biaya, dll)."
        ]
      }
    ]
  },
  {
    key: "sasaran-3",
    category: "Terwujudnya Manajemen Peradilan yang Transparan dan Profesional",
    color: "green",
    items: [
      { id: "3.1", label: "3.1 Indeks Profesionalitas ASN (IP ASN)", formula: "Nilai IP ASN dari BKN", notes: ["Komponen: Kompetensi, Kinerja, Kualifikasi, Disiplin."] },
      { id: "3.2", label: "3.2 Nilai Indikator Kinerja Pelaksanaan Anggaran (IKPA)", formula: "Nilai IKPA dari Kemenkeu", notes: ["Komponen: Revisi DIPA, Penyerapan, Capaian Output, dll."] },
      { id: "3.3", label: "3.3 Nilai Kinerja Perencanaan Anggaran", formula: "Nilai Evaluasi Kinerja Anggaran (SMART DJA)", notes: ["Efektifitas (75%) dan Efisiensi (25%)."] },
      { id: "3.4", label: "3.4 Nilai Indikator Pengelolaan Aset (IPA)", formula: "Nilai Indeks Pengelolaan Aset", notes: ["Sumber Data: SIMAN / e-Sadewa."] }
    ]
  }
];

// URL API
const API_URL = "http://localhost/simonev-pn2/api/api.php";

// ==========================================
// CONFIGURASI DINAMIS (PER INDIKATOR)
// ==========================================
const getIndicatorConfig = (id) => {
    // DEFAULT: PERKARA (1.1, 1.2, dll)
    let config = {
        type: "case",
        cards: ["Perkara Diselesaikan", "Tepat Waktu", "Tidak Tepat Waktu", "Persentase Tepat Waktu"],
        tableCols: ["Nomor Perkara", "Klasifikasi", "Tgl Register", "Tgl Sidang 1", "Tgl Putus", "Waktu", "Status Terakhir"],
        options: ["Tepat Waktu", "Tidak Tepat Waktu"],
        targetValue: "Tepat Waktu",
        showSidang: true,
        showWaktu: true,
        showStatusTeknis: true // Menampilkan input manual "Status Terakhir" (Minutasi, dll)
    };

    switch (id) {
        case "1.6": // EKSEKUSI
            config.cards = ["Permohonan Eksekusi", "Eksekusi Selesai", "Sisa / Proses", "Persentase Selesai"];
            config.tableCols = ["Nomor Eksekusi", "Klasifikasi", "Tgl Permohonan", "Tgl Pelaksanaan", "Lama Proses", "Status Pelaksanaan"];
            config.options = ["Berhasil", "Non-Executable", "Dicabut", "Dalam Proses"];
            config.targetValue = ["Berhasil", "Non-Executable", "Dicabut"]; 
            config.showSidang = false;
            config.showPutus = false;
            break;

        case "1.9": // DIVERSI ANAK
            config.cards = ["Perkara Diversi", "Perkara Diversi Berhasil", "Perkara Diversi Tidak Berhasil", "Persentase Diversi Berhasil"];
            config.tableCols = ["Nomor Perkara", "Klasifikasi", "Tgl Musyawarah", "Tgl Pelaksanaan Diversi", "Hasil Diversi", "Status Terakhir"];
            config.options = ["Berhasil", "Tidak Berhasil"];
            config.targetValue = "Berhasil";
            config.showWaktu = false;
            break;

        case "1.10": // E-COURT
        case "1.11": // E-BERPADU
            config.cards = ["Total Perkara", "Elektronik", "Manual", "Persentase Elektronik"];
            config.tableCols = ["Nomor Perkara", "Klasifikasi", "Tgl Daftar", "Metode Pendaftaran"];
            config.options = ["Elektronik", "Manual"];
            config.targetValue = "Elektronik";
            config.showSidang = false;
            config.showWaktu = false;
            config.showPutus = false;
            config.showStatusTeknis = false;
            break;

        case "2.1": // SURVEY
            config.type = "survey";
            config.cards = ["Jumlah Responden", "Indeks Maksimum", "Nilai IKM", "Konversi Mutu"];
            break;

        case "3.1": case "3.2": case "3.3": case "3.4": // SCORE
            config.type = "score";
            config.cards = ["Nilai Saat Ini"];
            break;
    }
    return config;
};

// ==========================================
// 2. LAYOUT & SIDEBAR
// ==========================================
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop sidebar toggle
  const [activeMenu, setActiveMenu] = useState({ 0: true, 1: true, 2: true });
  const location = useLocation();

  const toggleMenu = (idx) => setActiveMenu(prev => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="min-h-screen flex bg-[#f8f9fc] font-sans text-[#5a5c69]">
      {/* SIDEBAR */}
      <div className={`fixed left-0 top-0 h-full bg-[#e3f2fd] border-r border-blue-200 z-50 w-[18rem] transition-transform duration-300 ${sidebarCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0'} ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
        <div className="h-[4.5rem] flex flex-col justify-center items-center border-b border-blue-200 bg-[#e3f2fd] shrink-0">
          <h1 className="text-[#4e73df] font-extrabold text-2xl tracking-tighter">SIMONEV-KIP</h1>
          <p className="text-[#858796] text-[7.5px] font-bold">Sistem Informasi Monitoring & Evaluasi Kinerja Instansi Pemerintah</p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hidden py-4 px-3">
          <Link to="/" className="flex items-center text-[#5a5c69] hover:text-[#4e73df] font-bold px-3 py-2 mb-2"><FaHome className="mr-3 text-lg" /> Dashboard</Link>
          {indicatorsData.map((section, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex items-start px-3 py-2 text-[#4e73df] font-bold text-[10px] uppercase cursor-pointer hover:bg-blue-50 rounded" onClick={() => toggleMenu(idx)}>
                <FaBookmark className="mr-2 mt-0.5 min-w-[12px]" /> <span className="leading-tight">{section.category}</span>
              </div>
              <div className="bg-[#4e73df] text-white rounded-md flex justify-between items-center px-3 py-2 cursor-pointer mx-1 shadow-sm border-l-4 border-[#f6c23e] mt-1" onClick={() => toggleMenu(idx)}>
                <span className="text-xs font-bold flex items-center"><span className="mr-2">-</span> Indikator Kinerja</span>
                {activeMenu[idx] ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
              </div>
              {activeMenu[idx] && (
                <div className="ml-2 mt-1 bg-white rounded border border-blue-100 overflow-hidden shadow-sm">
                  {section.items.map((item) => (
                    <Link key={item.id} to={`/input/${item.id}`} className={`block py-2 px-3 text-[10px] font-medium border-b border-gray-100 last:border-0 hover:bg-gray-50 leading-snug ${location.pathname.includes(item.id) ? 'text-[#4e73df] font-bold bg-blue-50' : 'text-[#858796]'}`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 bg-[#f8f9fc] border-t border-blue-200 shrink-0 mt-auto">
            <div className="bg-[#eef2f9] rounded-lg p-3 text-center shadow-sm border border-blue-100">
                <p className="text-[10px] font-extrabold text-[#4e73df] mb-1">SIMONEV-KIP</p>
                <div className="text-[8px] text-gray-500 font-medium border-t border-gray-200 pt-2">
                    Dasar Hukum : <a href="/SK SEKMA 27101 IKU 10 11 2025.pdf" download className="text-[#4e73df] font-bold hover:underline block mt-1 cursor-pointer"><FaDownload size={8} className="inline mr-1"/> SK SEKMA NO. 271 TAHUN 2025</a>
                </div>
            </div>
        </div>
      </div>
      {/* MAIN CONTENT */}
      <div className={`flex-1 flex flex-col transition-all duration-300 w-full relative ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-[18rem]'}`}>
        <div className="bg-white h-[4.5rem] shadow-sm flex justify-between items-center px-6 sticky top-0 z-40">
          {/* Mobile menu toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#4e73df] text-xl"><FaBars /></button>
          {/* Desktop sidebar toggle */}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden md:flex items-center text-[#4e73df] hover:text-[#2e59d9] text-xl" title={sidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}>
            <FaBars />
          </button>
          <div className="ml-auto text-sm font-medium text-gray-500 hover:text-red-500 cursor-pointer flex items-center"><FaSignOutAlt className="mr-2 text-lg text-red-400" /> Login</div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ==========================================
// 3. DASHBOARD PAGE
// ==========================================
const Dashboard = () => {
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}?action=summary`)
      .then(res => res.json())
      .then(res => {
        if(res.status === 'success') setSummaryData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getCapaianColor = (pct) => {
    if(pct >= 80) return "bg-green-100 text-green-600";
    if(pct >= 50) return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-[#f6c23e] text-2xl font-extrabold mb-1 tracking-wide">SIMONEV-KIP</h2>
        <h5 className="text-[#858796] text-xs font-medium">Sistem Informasi Monitoring & Evaluasi Kinerja Instansi Pemerintah</h5>
        <h5 className="text-[#858796] text-xs font-medium">Tahun 2026</h5>
        <h5 className="text-[#5a5c69] text-sm font-bold mt-1">Pengadilan Negeri Yogyakarta</h5>
      </div>
      <div className="bg-[#fff3cd] border-l-4 border-[#f6c23e] text-[#856404] px-4 py-3 rounded-r-lg mb-6 text-sm font-medium shadow-sm">Sasaran Strategis (SK SEKMA 2025)</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {indicatorsData.map((section, idx) => {
           const colors = ["text-[#4e73df] border-[#4e73df]", "text-[#f6c23e] border-[#f6c23e]", "text-[#1cc88a] border-[#1cc88a]"];
           return (
            <div key={idx} className={`bg-white p-5 rounded-lg shadow-sm border-l-[5px] ${colors[idx%3].split(' ')[1]}`}>
              <div className="flex items-start">
                <FaCheckCircle className={`${colors[idx%3].split(' ')[0]} text-lg mt-1 mr-3 flex-shrink-0`} />
                <h5 className="text-[#5a5c69] font-bold text-[11px] leading-snug">{section.category}</h5>
              </div>
            </div>
           )
        })}
      </div>
      <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
           <h4 className="font-bold text-gray-700">Ringkasan Capaian {loading && <span className="text-xs text-gray-400 ml-2">(Loading...)</span>}</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-3 border font-bold text-center w-[5%]">No</th>
                <th className="p-3 border font-bold w-[40%]">Indikator Kinerja Utama</th>
                <th className="p-3 border font-bold text-center w-[15%]">Target</th>
                <th className="p-3 border font-bold text-center w-[15%]">Realisasi</th>
                <th className="p-3 border font-bold text-center w-[15%]">Capaian</th>
                <th className="p-3 border font-bold text-center w-[10%]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {indicatorsData.flatMap((sect) => 
                sect.items.map((item) => {
                  const data = summaryData[item.id] || { percentage: 0 };
                  const pct = data.percentage || 0;
                  return (
                    <tr key={item.id} className="hover:bg-[#f8f9fa] border-b border-gray-100">
                      <td className="p-3 border-r text-center">{item.id}</td>
                      <td className="p-3 border-r text-[#4e73df] font-medium">{item.label}</td>
                      <td className="p-3 border-r text-center font-bold">100%</td>
                      <td className="p-3 border-r text-center">{pct}%</td>
                      <td className="p-3 border-r text-center"><span className={`${getCapaianColor(pct)} px-2 py-1 rounded font-bold`}>{pct}%</span></td>
                      <td className="p-3 text-center">
                        <Link to={`/input/${item.id}`} className="bg-[#eaecf4] text-[#4e73df] px-3 py-1 rounded font-bold hover:bg-[#d1d3e2]">Input</Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. INPUT DETAIL PAGE
// ==========================================
const InputDetail = () => {
  const { id } = useParams();
  const [dataItem, setDataItem] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [config, setConfig] = useState(getIndicatorConfig("1.1"));
  
  // State: Filter, Search, Pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterPeriod, setFilterPeriod] = useState({ startMonth: "Januari", startYear: "2025", endMonth: "Januari", endYear: "2026" });

  // State Form
  const [form, setForm] = useState({
    nomor_perkara: "", klasifikasi: "", tgl_register: "", tgl_sidang_pertama: "", tgl_putus: "", 
    waktu_proses: "", status_akhir: "", status_teknis: "",
    jumlah_responden: "", nilai_ikm: "", keterangan: "", nilai_akhir: ""
  });

  // NEW: Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // HELPER FORMAT TANGGAL INDONESIA
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  // HELPER: Convert month name to number
  const monthToNum = (m) => ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"].indexOf(m) + 1;

  // Load Data with Filter
  const fetchData = (startDate, endDate) => {
    let url = `${API_URL}?id=${id}`;
    if(startDate && endDate) url += `&start_date=${startDate}&end_date=${endDate}`;
    fetch(url)
      .then(res => res.json())
      .then(res => { if(res.status === 'success') setTableData(res.data); })
      .catch(e => console.error(e));
  };

  useEffect(() => {
    let found = null;
    indicatorsData.forEach(sec => {
      if(sec.items) {
        const item = sec.items.find(i => i.id === id);
        if(item) found = item;
      }
    });
    setDataItem(found);
    
    const newConfig = getIndicatorConfig(id);
    setConfig(newConfig);
    if(newConfig.options) setForm(f => ({...f, status_akhir: newConfig.options[0]}));

    if(found) fetchData();
  }, [id]);

  // NEW: Apply Filter
  const handleApplyFilter = () => {
    const startDate = `${filterPeriod.startYear}-${String(monthToNum(filterPeriod.startMonth)).padStart(2,'0')}-01`;
    const endDate = `${filterPeriod.endYear}-${String(monthToNum(filterPeriod.endMonth)).padStart(2,'0')}-31`;
    fetchData(startDate, endDate);
  };

  // NEW: Export to Excel
  const exportToExcel = () => {
    const exportData = tableData.map((row, idx) => ({
      "No": idx + 1,
      "Nomor Perkara": row.nomor_perkara || "-",
      "Klasifikasi": row.klasifikasi || "-",
      "Tgl Register": row.tgl_register || "-",
      "Tgl Sidang 1": row.tgl_sidang_pertama || "-",
      "Tgl Putus": row.tgl_putus || "-",
      "Waktu Proses": row.waktu_proses || "-",
      "Status": row.status_akhir || "-",
      "Keterangan": row.keterangan || "-"
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `Indikator_${id}_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // NEW: Open Edit Modal
  const handleEdit = (row) => {
    setEditForm({...row});
    setShowEditModal(true);
  };

  // NEW: Update Data
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}?action=update`, { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(editForm) 
      });
      const json = await res.json();
      if(json.status === 'success') {
        setTableData(tableData.map(r => r.id === editForm.id ? editForm : r));
        setShowEditModal(false);
        alert("Data Berhasil Diupdate!");
      } else { alert("Gagal: " + json.message); }
    } catch(err) { alert("Error Koneksi API"); }
  };

  if (!dataItem) return <div className="p-10 text-center">Memuat Data...</div>;

  // --- LOGIKA KARTU ---
  let val1 = 0, val2 = 0, val3 = 0, val4 = "0.00";
  if (config.type === "survey") {
      val1 = tableData.reduce((acc, curr) => acc + parseInt(curr.jumlah_responden || 0), 0);
      val2 = 4.00;
      val3 = tableData.length > 0 ? parseFloat(tableData[0].nilai_ikm).toFixed(2) : "0.00";
      val4 = (parseFloat(val3) * 25).toFixed(2);
  } else if (config.type === "score") {
      val1 = tableData.length > 0 ? tableData[0].nilai_akhir : "0";
  } else {
      val1 = tableData.length;
      const target = config.targetValue;
      val2 = tableData.filter(r => {
          if (Array.isArray(target)) return target.includes(r.status_akhir);
          return r.status_akhir === target;
      }).length;
      val3 = val1 - val2;
      val4 = val1 > 0 ? ((val2 / val1) * 100).toFixed(2) : "0.00";
  }

  // --- PAGINATION & SEARCH ---
  const filteredData = tableData.filter(row => Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase()));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = { ...form, indikator_id: id };
    try {
        const res = await fetch(API_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
        const json = await res.json();
        if(json.status === 'success') {
            setTableData([{ ...payload, id: json.new_id }, ...tableData]);
            alert("Data Tersimpan!");
        } else { alert("Gagal: " + json.message); }
    } catch(err) { alert("Error Koneksi API"); }
  };

  const handleDelete = async (rowId) => {
    if(!confirm("Hapus data ini?")) return;
    try {
        await fetch(`${API_URL}?action=delete`, { method: 'POST', body: JSON.stringify({ id: rowId }) });
        setTableData(tableData.filter(r => r.id !== rowId));
    } catch(e) { alert("Gagal Hapus"); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* HEADER + PERIOD FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b pb-4 gap-4">
        <div className="w-full md:w-1/2">
            <h2 className="text-[#f6c23e] text-xl font-bold mb-1">{dataItem.label}</h2>
            <p className="text-gray-500 text-xs font-bold">Pengadilan Negeri Yogyakarta</p>
        </div>
        <div className="flex items-center gap-2 bg-[#e3f2fd] p-2 rounded border border-blue-200 shadow-sm">
            <span className="text-xs font-bold text-[#f6c23e]">Periode:</span>
            <select className="border rounded px-2 py-1 text-xs outline-none cursor-pointer" value={filterPeriod.startMonth} onChange={e=>setFilterPeriod({...filterPeriod, startMonth: e.target.value})}>
                {["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"].map(m=><option key={m}>{m}</option>)}
            </select>
            <select className="border rounded px-2 py-1 text-xs outline-none cursor-pointer" value={filterPeriod.startYear} onChange={e=>setFilterPeriod({...filterPeriod, startYear: e.target.value})}>
                <option>2025</option><option>2026</option>
            </select>
            <span className="text-xs font-bold text-gray-500">s.d.</span>
            <select className="border rounded px-2 py-1 text-xs outline-none cursor-pointer" value={filterPeriod.endMonth} onChange={e=>setFilterPeriod({...filterPeriod, endMonth: e.target.value})}>
                {["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"].map(m=><option key={m}>{m}</option>)}
            </select>
            <select className="border rounded px-2 py-1 text-xs outline-none cursor-pointer" value={filterPeriod.endYear} onChange={e=>setFilterPeriod({...filterPeriod, endYear: e.target.value})}>
                <option>2025</option><option>2026</option>
            </select>
            <button onClick={handleApplyFilter} className="bg-[#4e73df] hover:bg-[#2e59d9] p-1.5 rounded text-white transition-colors" title="Terapkan Filter"><FaSearch size={10}/></button>
        </div>
      </div>

      <div className="bg-[#e8eaf6] text-[#3a3b45] p-4 rounded-lg border-l-[6px] border-[#4e73df] mb-4 font-bold text-xs shadow-sm">
        <span className="text-[#4e73df]">RUMUS:</span> {dataItem.formula}
      </div>
      <div className="bg-[#fff3cd] text-[#856404] p-4 rounded-lg mb-8 text-xs leading-relaxed border border-[#ffeeba] shadow-sm">
        <strong className="block mb-1 text-[#f6c23e]">CATATAN:</strong>
        <ul className="list-disc pl-4">{dataItem.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
      </div>

      {/* STATISTIK */}
      <div className={`grid grid-cols-1 ${config.type === "score" ? "md:grid-cols-2" : "md:grid-cols-4"} gap-6 mb-10`}>
        {config.cards.map((label, idx) => {
            let val = idx === 0 ? val1 : idx === 1 ? val2 : idx === 2 ? val3 : val4;
            if (label.includes("Persentase") || label.includes("Konversi")) val += "%";
            const colors = ["text-[#f6c23e] border-[#f6c23e]", "text-[#4e73df] border-[#4e73df]", "text-[#e74a3b] border-[#e74a3b]", "text-[#1cc88a] border-[#1cc88a]"];
            return (
                <div key={idx} className={`bg-white p-5 rounded shadow-sm border-b-4 ${colors[idx].split(" ")[1]} relative`}>
                    <h3 className="text-3xl font-bold text-gray-800">{val}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{label}</p>
                </div>
            )
        })}
      </div>

      {/* FORM INPUT DENGAN LAYOUT TOMBOL SIMPAN YANG DIPERBAIKI */}
      <div className="bg-white rounded shadow-sm p-5 border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h4 className="font-bold text-gray-700 text-sm">Input Data</h4>
        </div>
        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            
            {/* INPUT DINAMIS */}
            {config.type === "case" && (
                <>
                    <div><label className="text-xs font-bold text-gray-500">Nomor Perkara</label><input type="text" value={form.nomor_perkara} onChange={e=>setForm({...form, nomor_perkara: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" placeholder="No..." /></div>
                    <div><label className="text-xs font-bold text-gray-500">Klasifikasi</label><input type="text" value={form.klasifikasi} onChange={e=>setForm({...form, klasifikasi: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">{config.tableCols[2]}</label><input type="date" value={form.tgl_register} onChange={e=>setForm({...form, tgl_register: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    
                    {config.showSidang && <div><label className="text-xs font-bold text-gray-500">Tgl Sidang 1</label><input type="date" value={form.tgl_sidang_pertama} onChange={e=>setForm({...form, tgl_sidang_pertama: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>}
                    
                    {config.tableCols.length > 3 && <div><label className="text-xs font-bold text-gray-500">{config.tableCols[config.showSidang ? 4 : 3]}</label><input type="date" value={form.tgl_putus} onChange={e=>setForm({...form, tgl_putus: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>}

                    {config.showWaktu && <div><label className="text-xs font-bold text-gray-500">Waktu Proses</label><input type="text" value={form.waktu_proses} onChange={e=>setForm({...form, waktu_proses: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>}

                    {config.showStatusTeknis && (
                        <div>
                            <label className="text-xs font-bold text-gray-500">Status Terakhir (Tabel)</label>
                            <input type="text" value={form.status_teknis} onChange={e=>setForm({...form, status_teknis: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" placeholder="Cth: Minutasi" />
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-gray-500">Kategori Kinerja (Kartu)</label>
                        <select value={form.status_akhir} onChange={e=>setForm({...form, status_akhir: e.target.value})} className="w-full border rounded px-3 py-2 text-sm bg-white h-[38px]">
                            {config.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </>
            )}

            {config.type === "survey" && (
                <>
                    <div><label className="text-xs font-bold text-gray-500">Keterangan</label><input type="text" value={form.keterangan} onChange={e=>setForm({...form, keterangan: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Jml Responden</label><input type="number" value={form.jumlah_responden} onChange={e=>setForm({...form, jumlah_responden: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Nilai IKM</label><input type="number" step="0.01" value={form.nilai_ikm} onChange={e=>setForm({...form, nilai_ikm: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                </>
            )}

            {config.type === "score" && (
                <>
                    <div><label className="text-xs font-bold text-gray-500">Keterangan</label><input type="text" value={form.keterangan} onChange={e=>setForm({...form, keterangan: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Nilai Akhir</label><input type="number" step="0.01" value={form.nilai_akhir} onChange={e=>setForm({...form, nilai_akhir: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                </>
            )}
          </div>

          {/* TOMBOL SIMPAN DI KANAN BAWAH */}
          <div className="flex justify-end border-t pt-3">
             <button className="bg-[#4e73df] hover:bg-[#2e59d9] text-white font-bold py-2 px-6 rounded text-sm shadow-sm flex items-center gap-2">
                <FaPlus size={12}/> Simpan Data
             </button>
          </div>
        </form>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded shadow-sm p-5 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <div className="text-xs text-gray-600 flex items-center">
                Tampilkan 
                <select className="mx-1 border rounded px-1" value={itemsPerPage} onChange={e=>setItemsPerPage(Number(e.target.value))}>
                    <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
                </select> 
                data per halaman
            </div>
            <div className="flex items-center gap-3">
                <button onClick={exportToExcel} className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"><FaFileExcel size={12}/>Export Excel</button>
                <div className="text-xs flex items-center gap-2">
                    <span className="text-gray-600">Cari:</span>
                    <input type="text" className="border rounded px-2 py-1 outline-none focus:border-[#4e73df]" value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
            </div>
        </div>

        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-gray-100 font-bold uppercase border-b-2">
            <tr>
              {config.type === "case" && ["No", ...config.tableCols, "Aksi"].map((h, i) => <th key={i} className="p-3">{h}</th>)}
              {config.type === "survey" && ["Keterangan", "Responden", "Nilai IKM", "Konversi Mutu", "Aksi"].map((h,i) => <th key={i} className="p-3">{h}</th>)}
              {config.type === "score" && ["Keterangan", "Nilai Akhir", "Aksi"].map((h,i) => <th key={i} className="p-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
                <tr><td colSpan="10" className="text-center p-6 text-gray-400 italic">Tidak ada data yang tersedia</td></tr>
            ) : (
                currentItems.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                        {config.type === "case" && (
                            <>
                                <td className="p-3">{indexOfFirstItem + idx + 1}</td>
                                <td className="p-3 font-bold text-[#4e73df]">{row.nomor_perkara}</td>
                                <td className="p-3">{row.klasifikasi}</td>
                                <td className="p-3">{formatDate(row.tgl_register)}</td>
                                {config.showSidang && <td className="p-3">{formatDate(row.tgl_sidang_pertama)}</td>}
                                {config.showPutus !== false && <td className="p-3">{formatDate(row.tgl_putus)}</td>}
                                {config.showWaktu && <td className="p-3">{row.waktu_proses}</td>}
                                {config.showStatusTeknis !== false && <td className="p-3">{row.status_teknis || row.status_akhir}</td>}
                            </>
                        )}
                        {config.type === "survey" && (
                            <>
                                <td className="p-3">{row.keterangan}</td>
                                <td className="p-3">{row.jumlah_responden}</td>
                                <td className="p-3">{row.nilai_ikm}</td>
                                <td className="p-3">{(row.nilai_ikm * 25).toFixed(2)}</td>
                            </>
                        )}
                        {config.type === "score" && (<><td className="p-3">{row.keterangan}</td><td className="p-3">{row.nilai_akhir}</td></>)}
                        <td className="p-3 text-center flex gap-2 justify-center">
                          <button onClick={()=>handleEdit(row)} className="text-blue-500 hover:text-blue-700" title="Edit"><FaEdit/></button>
                          <button onClick={()=>handleDelete(row.id)} className="text-red-500 hover:text-red-700" title="Hapus"><FaTrash/></button>
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 text-xs">
            <span className="text-gray-500">Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} data</span>
            <div className="flex gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage===1} className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">Sebelumnya</button>
                <button onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage===totalPages} className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">Selanjutnya</button>
            </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b bg-[#4e73df] text-white rounded-t-lg">
              <h3 className="font-bold">Edit Data</h3>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-white/20 p-1 rounded"><FaTimes/></button>
            </div>
            <form onSubmit={handleUpdate} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {config.type === "case" && (
                  <>
                    <div><label className="text-xs font-bold text-gray-500">Nomor Perkara</label><input type="text" value={editForm.nomor_perkara || ''} onChange={e=>setEditForm({...editForm, nomor_perkara: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Klasifikasi</label><input type="text" value={editForm.klasifikasi || ''} onChange={e=>setEditForm({...editForm, klasifikasi: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Tgl Register</label><input type="date" value={editForm.tgl_register || ''} onChange={e=>setEditForm({...editForm, tgl_register: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Tgl Sidang 1</label><input type="date" value={editForm.tgl_sidang_pertama || ''} onChange={e=>setEditForm({...editForm, tgl_sidang_pertama: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Tgl Putus</label><input type="date" value={editForm.tgl_putus || ''} onChange={e=>setEditForm({...editForm, tgl_putus: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Waktu Proses</label><input type="text" value={editForm.waktu_proses || ''} onChange={e=>setEditForm({...editForm, waktu_proses: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Status Teknis</label><input type="text" value={editForm.status_teknis || ''} onChange={e=>setEditForm({...editForm, status_teknis: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Status Akhir</label>
                      <select value={editForm.status_akhir || ''} onChange={e=>setEditForm({...editForm, status_akhir: e.target.value})} className="w-full border rounded px-3 py-2 text-sm bg-white">
                        {config.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </>
                )}
                {config.type === "survey" && (
                  <>
                    <div><label className="text-xs font-bold text-gray-500">Keterangan</label><input type="text" value={editForm.keterangan || ''} onChange={e=>setEditForm({...editForm, keterangan: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Jumlah Responden</label><input type="number" value={editForm.jumlah_responden || ''} onChange={e=>setEditForm({...editForm, jumlah_responden: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Nilai IKM</label><input type="number" step="0.01" value={editForm.nilai_ikm || ''} onChange={e=>setEditForm({...editForm, nilai_ikm: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                  </>
                )}
                {config.type === "score" && (
                  <>
                    <div><label className="text-xs font-bold text-gray-500">Keterangan</label><input type="text" value={editForm.keterangan || ''} onChange={e=>setEditForm({...editForm, keterangan: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Nilai Akhir</label><input type="number" step="0.01" value={editForm.nilai_akhir || ''} onChange={e=>setEditForm({...editForm, nilai_akhir: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" /></div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Batal</button>
                <button type="submit" className="bg-[#4e73df] hover:bg-[#2e59d9] text-white font-bold px-4 py-2 rounded flex items-center gap-2"><FaSave size={12}/>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. ROOT APP
// ==========================================
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/input/:id" element={<InputDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;