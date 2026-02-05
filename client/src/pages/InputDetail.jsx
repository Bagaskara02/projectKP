import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaSearch, FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaFileExcel, FaUpload, FaDownload, FaFile } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';
import { indicatorsData, getIndicatorConfig } from '../data/indicators';
import { api } from '../utils/api';

const InputDetail = () => {
  const { id } = useParams();
  const { isLoggedIn, selectedYear } = useAuth();
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
    jumlah_responden: "", nilai_ikm: "", keterangan: "", nilai_akhir: "", file_path: ""
  });

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  // Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  
  // Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Helper format tanggal
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  const monthToNum = (m) => ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].indexOf(m) + 1;

  // Load Data
  const fetchData = async (startDate, endDate) => {
    try {
      const params = { id, tahun: selectedYear };
      if (startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      }
      const res = await api.get('', params);
      if (res.status === 'success') setTableData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let found = null;
    indicatorsData.forEach(sec => {
      if (sec.items) {
        const item = sec.items.find(i => i.id === id);
        if (item) found = item;
      }
    });
    setDataItem(found);

    const newConfig = getIndicatorConfig(id);
    setConfig(newConfig);
    if (newConfig.options) setForm(f => ({ ...f, status_akhir: newConfig.options[0] }));

    if (found) fetchData();
  }, [id, selectedYear]);

  const handleApplyFilter = () => {
    const startDate = `${filterPeriod.startYear}-${String(monthToNum(filterPeriod.startMonth)).padStart(2, '0')}-01`;
    const endDate = `${filterPeriod.endYear}-${String(monthToNum(filterPeriod.endMonth)).padStart(2, '0')}-31`;
    fetchData(startDate, endDate);
  };

  // Export to Excel
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
    XLSX.writeFile(wb, `Indikator_${id}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return null;
    setUploading(true);
    try {
      const res = await api.upload.uploadFile(file);
      if (res.status === 'success') {
        return res.file.file_path;
      }
      alert('Gagal upload: ' + res.message);
      return null;
    } catch (e) {
      alert('Error upload file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle Add
  const handleAdd = async (e) => {
    e.preventDefault();
    
    let filePath = form.file_path;
    if (uploadFile) {
      filePath = await handleFileUpload(uploadFile);
      if (!filePath) return;
    }
    
    const payload = { ...form, indikator_id: id, tahun: selectedYear, file_path: filePath || '' };
    try {
      const res = await api.post('', payload);
      if (res.status === 'success') {
        setTableData([{ ...payload, id: res.new_id }, ...tableData]);
        setForm({ ...form, nomor_perkara: "", klasifikasi: "", tgl_register: "", tgl_sidang_pertama: "", tgl_putus: "", waktu_proses: "", status_teknis: "", file_path: "" });
        setUploadFile(null);
        alert("Data Tersimpan!");
      } else {
        alert("Gagal: " + res.message);
      }
    } catch (err) {
      alert("Error Koneksi API");
    }
  };

  // Handle Edit
  const handleEdit = (row) => {
    setEditForm({ ...row });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('', editForm, 'update');
      if (res.status === 'success') {
        setTableData(tableData.map(r => r.id === editForm.id ? editForm : r));
        setShowEditModal(false);
        alert("Data Berhasil Diupdate!");
      } else {
        alert("Gagal: " + res.message);
      }
    } catch (err) {
      alert("Error Koneksi API");
    }
  };

  // Handle Delete
  const handleDelete = async (rowId) => {
    if (!confirm("Hapus data ini?")) return;
    try {
      await api.post('', { id: rowId }, 'delete');
      setTableData(tableData.filter(r => r.id !== rowId));
    } catch (e) {
      alert("Gagal Hapus");
    }
  };

  // Handle Import
  const handleImport = async () => {
    if (!importFile) return;
    setImportLoading(true);
    try {
      const res = await api.import.importFile(importFile, id, selectedYear);
      if (res.status === 'success') {
        alert(res.message);
        setShowImportModal(false);
        setImportFile(null);
        fetchData();
      } else {
        alert("Gagal: " + res.message);
      }
    } catch (e) {
      alert("Error import");
    } finally {
      setImportLoading(false);
    }
  };

  // Download Template
  const downloadTemplate = async () => {
    try {
      const res = await api.import.getTemplate(id);
      if (res.status === 'success') {
        const ws = XLSX.utils.aoa_to_sheet([res.template.headers, res.template.sample]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, `Template_${id}.xlsx`);
      }
    } catch (e) {
      alert("Error download template");
    }
  };

  if (!dataItem) return <div className="p-10 text-center">Memuat Data...</div>;

  // Calculate stats
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

  // Pagination & Search
  const filteredData = tableData.filter(row => Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase()));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b pb-4 gap-4">
        <div className="w-full md:w-1/2">
          <h2 className="text-[#f6c23e] text-xl font-bold mb-1">{dataItem.label}</h2>
          <p className="text-gray-500 text-xs font-bold">Pengadilan Negeri Yogyakarta - Tahun {selectedYear}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#e3f2fd] p-2 rounded border border-blue-200 shadow-sm">
          <span className="text-xs font-bold text-[#f6c23e]">Periode:</span>
          <select className="border rounded px-2 py-1 text-xs outline-none cursor-pointer" value={filterPeriod.startMonth} onChange={e => setFilterPeriod({ ...filterPeriod, startMonth: e.target.value })}>
            {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map(m => <option key={m}>{m}</option>)}
          </select>
          <select className="border rounded px-2 py-1 text-xs outline-none cursor-pointer" value={filterPeriod.startYear} onChange={e => setFilterPeriod({ ...filterPeriod, startYear: e.target.value })}>
            <option>2024</option><option>2025</option><option>2026</option><option>2027</option>
          </select>
          <span className="text-xs font-bold text-gray-500">s.d.</span>
          <select className="border rounded px-2 py-1 text-xs outline-none cursor-pointer" value={filterPeriod.endMonth} onChange={e => setFilterPeriod({ ...filterPeriod, endMonth: e.target.value })}>
            {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map(m => <option key={m}>{m}</option>)}
          </select>
          <select className="border rounded px-2 py-1 text-xs outline-none cursor-pointer" value={filterPeriod.endYear} onChange={e => setFilterPeriod({ ...filterPeriod, endYear: e.target.value })}>
            <option>2024</option><option>2025</option><option>2026</option><option>2027</option>
          </select>
          <button onClick={handleApplyFilter} className="bg-[#4e73df] hover:bg-[#2e59d9] p-1.5 rounded text-white transition-colors" title="Terapkan Filter"><FaSearch size={10} /></button>
        </div>
      </div>

      {/* Formula & Notes */}
      <div className="bg-[#e8eaf6] text-[#3a3b45] p-4 rounded-lg border-l-[6px] border-[#4e73df] mb-4 font-bold text-xs shadow-sm">
        <span className="text-[#4e73df]">RUMUS:</span> {dataItem.formula}
      </div>
      <div className="bg-[#fff3cd] text-[#856404] p-4 rounded-lg mb-8 text-xs leading-relaxed border border-[#ffeeba] shadow-sm">
        <strong className="block mb-1 text-[#f6c23e]">CATATAN:</strong>
        <ul className="list-disc pl-4">{dataItem.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
      </div>

      {/* Stats Cards */}
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
          );
        })}
      </div>

      {/* Form Input - Only show if logged in */}
      {isLoggedIn() ? (
        <div className="bg-white rounded shadow-sm p-5 border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h4 className="font-bold text-gray-700 text-sm">Input Data</h4>
            <button onClick={() => setShowImportModal(true)} className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
              <FaUpload size={12} /> Import Excel
            </button>
          </div>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {config.type === "case" && (
                <>
                  <div><label className="text-xs font-bold text-gray-500">Nomor Perkara</label><input type="text" value={form.nomor_perkara} onChange={e => setForm({ ...form, nomor_perkara: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="No..." /></div>
                  <div><label className="text-xs font-bold text-gray-500">Klasifikasi</label><input type="text" value={form.klasifikasi} onChange={e => setForm({ ...form, klasifikasi: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs font-bold text-gray-500">{config.tableCols[2]}</label><input type="date" value={form.tgl_register} onChange={e => setForm({ ...form, tgl_register: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                  {config.showSidang && <div><label className="text-xs font-bold text-gray-500">Tgl Sidang 1</label><input type="date" value={form.tgl_sidang_pertama} onChange={e => setForm({ ...form, tgl_sidang_pertama: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>}
                  {config.tableCols.length > 3 && <div><label className="text-xs font-bold text-gray-500">{config.tableCols[config.showSidang ? 4 : 3]}</label><input type="date" value={form.tgl_putus} onChange={e => setForm({ ...form, tgl_putus: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>}
                  {config.showWaktu && <div><label className="text-xs font-bold text-gray-500">Waktu Proses</label><input type="text" value={form.waktu_proses} onChange={e => setForm({ ...form, waktu_proses: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>}
                  {config.showStatusTeknis && (
                    <div>
                      <label className="text-xs font-bold text-gray-500">Status Terakhir (Tabel)</label>
                      <input type="text" value={form.status_teknis} onChange={e => setForm({ ...form, status_teknis: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="Cth: Minutasi" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-gray-500">Kategori Kinerja (Kartu)</label>
                    <select value={form.status_akhir} onChange={e => setForm({ ...form, status_akhir: e.target.value })} className="w-full border rounded px-3 py-2 text-sm bg-white h-[38px]">
                      {config.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </>
              )}

              {config.type === "survey" && (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-500">Triwulan</label>
                    <select value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} className="w-full border rounded px-3 py-2 text-sm bg-white">
                      <option value="Triwulan 1">Triwulan 1</option>
                      <option value="Triwulan 2">Triwulan 2</option>
                      <option value="Triwulan 3">Triwulan 3</option>
                      <option value="Triwulan 4">Triwulan 4</option>
                    </select>
                  </div>
                  <div><label className="text-xs font-bold text-gray-500">Jumlah Responden</label><input type="number" value={form.jumlah_responden} onChange={e => setForm({ ...form, jumlah_responden: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="Contoh: 50" /></div>
                  <div><label className="text-xs font-bold text-gray-500">Nilai IKM</label><input type="number" step="0.0001" value={form.nilai_ikm} onChange={e => setForm({ ...form, nilai_ikm: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="Contoh: 3.6868" /></div>
                  <div><label className="text-xs font-bold text-gray-500">Link Bukti</label><input type="text" value={form.status_teknis} onChange={e => setForm({ ...form, status_teknis: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="https://..." /></div>
                </>
              )}

              {config.type === "score" && (
                <>
                  <div><label className="text-xs font-bold text-gray-500">Keterangan</label><input type="text" value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs font-bold text-gray-500">Nilai Akhir</label><input type="number" step="0.01" value={form.nilai_akhir} onChange={e => setForm({ ...form, nilai_akhir: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                </>
              )}

              {/* Upload Bukti */}
              <div>
                <label className="text-xs font-bold text-gray-500">Upload Bukti Dokumen</label>
                <input 
                  type="file" 
                  onChange={e => setUploadFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
                {uploadFile && <p className="text-xs text-green-600 mt-1"><FaFile className="inline mr-1" />{uploadFile.name}</p>}
              </div>
            </div>

            <div className="flex justify-end border-t pt-3">
              <button disabled={uploading} className="bg-[#4e73df] hover:bg-[#2e59d9] text-white font-bold py-2 px-6 rounded text-sm shadow-sm flex items-center gap-2 disabled:opacity-50">
                <FaPlus size={12} /> {uploading ? 'Uploading...' : 'Simpan Data'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6 text-sm">
          <strong>Info:</strong> Silakan login untuk menambah, mengubah, atau menghapus data.
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded shadow-sm p-5 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-gray-600 flex items-center">
            Tampilkan
            <select className="mx-1 border rounded px-1" value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}>
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
            </select>
            data per halaman
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportToExcel} className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"><FaFileExcel size={12} />Export Excel</button>
            <div className="text-xs flex items-center gap-2">
              <span className="text-gray-600">Cari:</span>
              <input type="text" className="border rounded px-2 py-1 outline-none focus:border-[#4e73df]" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-gray-100 font-bold uppercase border-b-2">
            <tr>
              {config.type === "case" && ["No", ...config.tableCols, "Bukti", isLoggedIn() ? "Aksi" : null].filter(Boolean).map((h, i) => <th key={i} className="p-3">{h}</th>)}
              {config.type === "survey" && ["No", "Triwulan", "Jumlah Responden", "Konversi Interval IKM", "IKM", "Link", "Bukti", isLoggedIn() ? "Aksi" : null].filter(Boolean).map((h, i) => <th key={i} className="p-3">{h}</th>)}
              {config.type === "score" && ["Keterangan", "Nilai Akhir", "Bukti", isLoggedIn() ? "Aksi" : null].filter(Boolean).map((h, i) => <th key={i} className="p-3">{h}</th>)}
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
                      <td className="p-3 text-center">{indexOfFirstItem + idx + 1}</td>
                      <td className="p-3">{row.keterangan}</td>
                      <td className="p-3">{row.jumlah_responden} Responden</td>
                      <td className="p-3">{(row.nilai_ikm * 25).toFixed(2)}</td>
                      <td className="p-3">{parseFloat(row.nilai_ikm).toFixed(4)}</td>
                      <td className="p-3">{row.status_teknis ? <a href={row.status_teknis} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lihat</a> : "-"}</td>
                    </>
                  )}
                  {config.type === "score" && (<><td className="p-3">{row.keterangan}</td><td className="p-3">{row.nilai_akhir}</td></>)}
                  
                  {/* Bukti Column */}
                  <td className="p-3">
                    {row.file_path ? (
                      <a href={`http://localhost/simonev-pn2/api/${row.file_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                        <FaDownload size={10} /> Download
                      </a>
                    ) : "-"}
                  </td>
                  
                  {isLoggedIn() && (
                    <td className="p-3 text-center flex gap-2 justify-center">
                      <button onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700" title="Edit"><FaEdit /></button>
                      <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700" title="Hapus"><FaTrash /></button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 text-xs">
          <span className="text-gray-500">Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} data</span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">Sebelumnya</button>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">Selanjutnya</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b bg-[#4e73df] text-white rounded-t-lg">
              <h3 className="font-bold">Edit Data</h3>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-white/20 p-1 rounded"><FaTimes /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {config.type === "case" && (
                  <>
                    <div><label className="text-xs font-bold text-gray-500">Nomor Perkara</label><input type="text" value={editForm.nomor_perkara || ''} onChange={e => setEditForm({ ...editForm, nomor_perkara: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Klasifikasi</label><input type="text" value={editForm.klasifikasi || ''} onChange={e => setEditForm({ ...editForm, klasifikasi: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Tgl Register</label><input type="date" value={editForm.tgl_register || ''} onChange={e => setEditForm({ ...editForm, tgl_register: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Tgl Sidang 1</label><input type="date" value={editForm.tgl_sidang_pertama || ''} onChange={e => setEditForm({ ...editForm, tgl_sidang_pertama: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Tgl Putus</label><input type="date" value={editForm.tgl_putus || ''} onChange={e => setEditForm({ ...editForm, tgl_putus: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Waktu Proses</label><input type="text" value={editForm.waktu_proses || ''} onChange={e => setEditForm({ ...editForm, waktu_proses: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Status Teknis</label><input type="text" value={editForm.status_teknis || ''} onChange={e => setEditForm({ ...editForm, status_teknis: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Status Akhir</label>
                      <select value={editForm.status_akhir || ''} onChange={e => setEditForm({ ...editForm, status_akhir: e.target.value })} className="w-full border rounded px-3 py-2 text-sm bg-white">
                        {config.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </>
                )}
                {config.type === "survey" && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-gray-500">Triwulan</label>
                      <select value={editForm.keterangan || ''} onChange={e => setEditForm({ ...editForm, keterangan: e.target.value })} className="w-full border rounded px-3 py-2 text-sm bg-white">
                        <option value="Triwulan 1">Triwulan 1</option>
                        <option value="Triwulan 2">Triwulan 2</option>
                        <option value="Triwulan 3">Triwulan 3</option>
                        <option value="Triwulan 4">Triwulan 4</option>
                      </select>
                    </div>
                    <div><label className="text-xs font-bold text-gray-500">Jumlah Responden</label><input type="number" value={editForm.jumlah_responden || ''} onChange={e => setEditForm({ ...editForm, jumlah_responden: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Nilai IKM</label><input type="number" step="0.0001" value={editForm.nilai_ikm || ''} onChange={e => setEditForm({ ...editForm, nilai_ikm: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Link Bukti</label><input type="text" value={editForm.status_teknis || ''} onChange={e => setEditForm({ ...editForm, status_teknis: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" placeholder="https://..." /></div>
                  </>
                )}
                {config.type === "score" && (
                  <>
                    <div><label className="text-xs font-bold text-gray-500">Keterangan</label><input type="text" value={editForm.keterangan || ''} onChange={e => setEditForm({ ...editForm, keterangan: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500">Nilai Akhir</label><input type="number" step="0.01" value={editForm.nilai_akhir || ''} onChange={e => setEditForm({ ...editForm, nilai_akhir: e.target.value })} className="w-full border rounded px-3 py-2 text-sm" /></div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Batal</button>
                <button type="submit" className="bg-[#4e73df] hover:bg-[#2e59d9] text-white font-bold px-4 py-2 rounded flex items-center gap-2"><FaSave size={12} />Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b bg-green-500 text-white rounded-t-lg">
              <h3 className="font-bold">Import Data dari Excel</h3>
              <button onClick={() => setShowImportModal(false)} className="hover:bg-white/20 p-1 rounded"><FaTimes /></button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <button onClick={downloadTemplate} className="text-blue-500 hover:underline text-sm flex items-center gap-1">
                  <FaDownload /> Download Template Excel
                </button>
              </div>
              <div className="mb-4">
                <label className="text-sm font-bold text-gray-600 block mb-2">Pilih File Excel/CSV:</label>
                <input 
                  type="file" 
                  accept=".csv,.xls,.xlsx"
                  onChange={e => setImportFile(e.target.files[0])}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              {importFile && <p className="text-xs text-green-600 mb-4"><FaFile className="inline mr-1" />{importFile.name}</p>}
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowImportModal(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Batal</button>
                <button onClick={handleImport} disabled={!importFile || importLoading} className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded disabled:opacity-50">
                  {importLoading ? 'Importing...' : 'Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputDetail;
