import React, { useState, useEffect } from 'react';
import { FaCog, FaDatabase, FaDownload, FaUpload, FaSpinner, FaClock, FaChartPie, FaSync, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/simonev-pn2/api';

const Settings = () => {
  const { isLoggedIn } = useAuth();
  const [apiStatus, setApiStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);
  const [syncData, setSyncData] = useState(null);
  const [backups, setBackups] = useState([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const checkApiStatus = async () => {
    setApiStatus('checking');
    try {
      const res = await api.get('', { action: 'summary' });
      if (res.status === 'success') {
        setApiStatus('connected');
        setLastCheck(new Date().toLocaleString('id-ID'));
      } else {
        setApiStatus('error');
      }
    } catch {
      setApiStatus('error');
    }
  };

  const fetchSyncStatus = async () => {
    try {
      const res = await api.get('', { action: 'sync_status' });
      if (res.status === 'success') {
        setSyncData(res.data);
      }
    } catch { }
  };

  const fetchBackups = async () => {
    try {
      const res = await api.backup.list();
      if (res.status === 'success') {
        setBackups(res.data);
      }
    } catch { }
  };

  useEffect(() => {
    checkApiStatus();
    fetchSyncStatus();
    if (isLoggedIn()) {
      fetchBackups();
    }
  }, []);

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await api.backup.create();
      if (res.status === 'success') {
        alert('Backup berhasil dibuat: ' + res.filename);
        // Download the backup
        window.open(`${API_URL}/${res.download_url}`, '_blank');
        fetchBackups();
      } else {
        alert('Gagal: ' + res.message);
      }
    } catch (e) {
      alert('Error membuat backup');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) {
      alert('Pilih file backup terlebih dahulu');
      return;
    }
    if (!confirm('Restore akan mengganti semua data yang ada. Lanjutkan?')) return;

    setRestoreLoading(true);
    try {
      const res = await api.backup.restore(restoreFile);
      if (res.status === 'success') {
        alert(res.message);
        setRestoreFile(null);
        window.location.reload();
      } else {
        alert('Gagal: ' + res.message);
      }
    } catch (e) {
      alert('Error restore database');
    } finally {
      setRestoreLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#4e73df] mb-6 flex items-center gap-2">
        <FaCog /> Pengaturan
      </h2>

      {/* API Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FaChartPie className="text-[#4e73df]" />
          Status Koneksi API
        </h3>

        <div className={`p-4 rounded-lg mb-4 ${apiStatus === 'connected' ? 'bg-green-50 border border-green-200' :
          apiStatus === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-yellow-50 border border-yellow-200'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${apiStatus === 'connected' ? 'bg-green-500' :
              apiStatus === 'error' ? 'bg-red-500' :
                'bg-yellow-500 animate-pulse'
              }`}></div>
            <div>
              <p className="text-sm font-medium">
                {apiStatus === 'connected' && '✅ API Terhubung'}
                {apiStatus === 'error' && '❌ API Tidak Terhubung'}
                {apiStatus === 'checking' && '⏳ Memeriksa koneksi...'}
              </p>
              {lastCheck && apiStatus === 'connected' && (
                <p className="text-xs text-gray-500 mt-1">Terakhir dicek: {lastCheck}</p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={checkApiStatus}
          disabled={apiStatus === 'checking'}
          className="bg-[#4e73df] hover:bg-[#2e59d9] text-white font-bold px-4 py-2 rounded text-sm disabled:opacity-50 flex items-center gap-2"
        >
          <FaSync /> Cek Ulang Koneksi
        </button>
      </div>

      {/* Auto Sync Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FaClock className="text-[#1cc88a]" />
          Status Auto Sync e-Berpadu
        </h3>

        {syncData?.last_sync ? (
          <>
            <div className={`p-4 rounded-lg mb-4 ${syncData.last_result === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
              <p className="text-sm font-medium">
                {syncData.last_result === 'success' ? '✅ Sync Terakhir Berhasil' : '❌ Sync Terakhir Gagal'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Waktu: {syncData.last_sync}</p>
              {syncData.error_message && (
                <p className="text-xs text-red-600 mt-1">Error: {syncData.error_message}</p>
              )}
            </div>

            {syncData.stats && (
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center border">
                  <p className="text-2xl font-bold text-gray-700">{syncData.stats.total}</p>
                  <p className="text-xs text-gray-500">Total Data</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                  <p className="text-2xl font-bold text-green-600">{syncData.stats.created}</p>
                  <p className="text-xs text-gray-500">Data Baru</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">{syncData.stats.updated}</p>
                  <p className="text-xs text-gray-500">Diupdate</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center border border-red-200">
                  <p className="text-2xl font-bold text-red-600">{syncData.stats.failed}</p>
                  <p className="text-xs text-gray-500">Gagal</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Belum ada data sync. Auto sync akan berjalan sesuai jadwal Task Scheduler.</p>
          </div>
        )}
      </div>

      {/* Backup & Restore - Only for logged in users */}
      {isLoggedIn() ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <FaDatabase className="text-[#f6c23e]" />
            Backup & Restore Database
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup Section */}
            <div className="border rounded-lg p-4">
              <h4 className="font-bold text-gray-600 mb-3 flex items-center gap-2">
                <FaDownload className="text-green-500" /> Backup Database
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Buat backup database untuk menyimpan semua data. File backup dapat diunduh dan disimpan sebagai cadangan.
              </p>
              <button
                onClick={handleBackup}
                disabled={backupLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {backupLoading ? <><FaSpinner className="animate-spin" /> Membuat Backup...</> : <><FaDownload /> Buat Backup Sekarang</>}
              </button>
            </div>

            {/* Restore Section */}
            <div className="border rounded-lg p-4">
              <h4 className="font-bold text-gray-600 mb-3 flex items-center gap-2">
                <FaUpload className="text-blue-500" /> Restore Database
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Pulihkan database dari file backup. Perhatian: ini akan mengganti semua data yang ada.
              </p>
              <input
                type="file"
                accept=".sql"
                onChange={(e) => setRestoreFile(e.target.files[0])}
                className="w-full border rounded px-3 py-2 text-sm mb-2"
              />
              {restoreFile && <p className="text-xs text-blue-600 mb-2">{restoreFile.name}</p>}
              <button
                onClick={handleRestore}
                disabled={!restoreFile || restoreLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {restoreLoading ? <><FaSpinner className="animate-spin" /> Memulihkan...</> : <><FaUpload /> Restore Database</>}
              </button>
            </div>
          </div>

          {/* Backup History */}
          {backups.length > 0 && (
            <div className="mt-6">
              <h4 className="font-bold text-gray-600 mb-3">Riwayat Backup</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left font-bold text-gray-600">Nama File</th>
                      <th className="p-3 text-center font-bold text-gray-600">Ukuran</th>
                      <th className="p-3 text-center font-bold text-gray-600">Tanggal</th>
                      <th className="p-3 text-center font-bold text-gray-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.slice(0, 5).map((backup, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs">{backup.filename}</td>
                        <td className="p-3 text-center text-gray-500">{formatBytes(backup.size)}</td>
                        <td className="p-3 text-center text-gray-500">{backup.created}</td>
                        <td className="p-3 text-center">
                          <a
                            href={`${API_URL}/backups/${backup.filename}`}
                            className="text-blue-500 hover:text-blue-700"
                            download
                          >
                            <FaDownload />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
          <strong>Info:</strong> Silakan login untuk mengakses fitur Backup & Restore.
        </div>
      )}
    </div>
  );
};

export default Settings;
