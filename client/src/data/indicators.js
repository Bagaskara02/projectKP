// Indicators Data
export const indicatorsData = [
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
          "Berdasarkan 9 unsur layanan (Persyaratan, Prosedur, Waktu, Biaya, dll).",
          "Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Republik Indonesia Nomor 14 Tahun 2017 tentang Pedoman Penyusunan Survei Kepuasan Masyarakat Unit Penyelengara Pelayanan Publik.",
          "Nilai Persepsi minimal 3,6 dengan nilai konversi interval IKM Index harus ≥80."
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

// Helper untuk mendapatkan konfigurasi per indikator
export const getIndicatorConfig = (id) => {
  let config = {
    type: "case",
    cards: ["Perkara Diselesaikan", "Tepat Waktu", "Tidak Tepat Waktu", "Persentase Tepat Waktu"],
    tableCols: ["Nomor Perkara", "Klasifikasi", "Tgl Register", "Tgl Sidang 1", "Tgl Putus", "Waktu", "Status Terakhir"],
    options: ["Tepat Waktu", "Tidak Tepat Waktu"],
    targetValue: "Tepat Waktu",
    showSidang: true,
    showWaktu: true,
    showStatusTeknis: true
  };

  switch (id) {
    case "1.6":
      config.cards = ["Permohonan Eksekusi", "Eksekusi Selesai", "Sisa / Proses", "Persentase Selesai"];
      config.tableCols = ["Nomor Eksekusi", "Klasifikasi", "Tgl Permohonan", "Tgl Pelaksanaan", "Lama Proses", "Status Pelaksanaan"];
      config.options = ["Berhasil", "Non-Executable", "Dicabut", "Dalam Proses"];
      config.targetValue = ["Berhasil", "Non-Executable", "Dicabut"];
      config.showSidang = false;
      config.showPutus = false;
      break;

    case "1.9":
      config.cards = ["Perkara Diversi", "Perkara Diversi Berhasil", "Perkara Diversi Tidak Berhasil", "Persentase Diversi Berhasil"];
      config.tableCols = ["Nomor Perkara", "Klasifikasi", "Tgl Musyawarah", "Tgl Pelaksanaan Diversi", "Hasil Diversi", "Status Terakhir"];
      config.options = ["Berhasil", "Tidak Berhasil"];
      config.targetValue = "Berhasil";
      config.showWaktu = false;
      break;

    case "1.10":
    case "1.11":
      config.cards = ["Total Perkara", "Elektronik", "Manual", "Persentase Elektronik"];
      config.tableCols = ["Nomor Perkara", "Klasifikasi", "Tgl Daftar", "Metode Pendaftaran"];
      config.options = ["Elektronik", "Manual"];
      config.targetValue = "Elektronik";
      config.showSidang = false;
      config.showWaktu = false;
      config.showPutus = false;
      config.showStatusTeknis = false;
      break;

    case "2.1":
      config.type = "survey";
      config.cards = ["Jumlah Responden", "Indeks Maksimum", "Nilai IKM", "Konversi Interval IKM"];
      config.tableCols = ["Triwulan", "Jumlah Responden", "Konversi Interval IKM", "IKM", "Link"];
      break;

    case "3.1":
    case "3.2":
    case "3.3":
    case "3.4":
      config.type = "score";
      config.cards = ["Nilai Saat Ini"];
      break;
  }
  return config;
};
