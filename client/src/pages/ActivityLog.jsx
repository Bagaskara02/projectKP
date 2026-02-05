import React, { useState, useEffect } from 'react';
import { FaHistory, FaSearch, FaUser, FaCalendar, FaTable, FaPlus, FaEdit, FaTrash, FaSignInAlt, FaSignOutAlt, FaUpload, FaDownload, FaDatabase } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const ActivityLog = () => {
  const { isLoggedIn } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, total_pages: 0 });
  const [filters, setFilters] = useState({ action_type: '', start_date: '', end_date: '' });

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: pagination.limit, ...filters };
      // Remove empty params
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      
      const res = await api.audit.getLogs(params);
      if (res.status === 'success') {
        setLogs(res.data);
        setPagination(res.pagination);
      }
    } catch (e) {
      console.error('Failed to fetch logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      fetchLogs();
    }
  }, []);

  const handleFilter = () => {
    fetchLogs(1);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE': return <FaPlus className="text-green-500" />;
      case 'UPDATE': return <FaEdit className="text-blue-500" />;
      case 'DELETE': return <FaTrash className="text-red-500" />;
      case 'LOGIN': return <FaSignInAlt className="text-purple-500" />;
      case 'LOGOUT': return <FaSignOutAlt className="text-gray-500" />;
      case 'IMPORT': return <FaUpload className="text-orange-500" />;
      case 'EXPORT': return <FaDownload className="text-teal-500" />;
      case 'BACKUP': return <FaDatabase className="text-yellow-500" />;
      case 'RESTORE': return <FaDatabase className="text-indigo-500" />;
      default: return <FaHistory className="text-gray-400" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-700';
      case 'UPDATE': return 'bg-blue-100 text-blue-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      case 'LOGIN': return 'bg-purple-100 text-purple-700';
      case 'LOGOUT': return 'bg-gray-100 text-gray-700';
      case 'IMPORT': return 'bg-orange-100 text-orange-700';
      case 'EXPORT': return 'bg-teal-100 text-teal-700';
      case 'BACKUP': return 'bg-yellow-100 text-yellow-700';
      case 'RESTORE': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isLoggedIn()) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-8 rounded-lg text-center">
          <FaHistory className="text-4xl mx-auto mb-4 opacity-50" />
          <h3 className="font-bold text-lg mb-2">Akses Terbatas</h3>
          <p>Silakan login untuk melihat log aktivitas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-[#4e73df] mb-6 flex items-center gap-2">
        <FaHistory /> Log Aktivitas
      </h2>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Jenis Aksi</label>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filters.action_type}
              onChange={(e) => setFilters({ ...filters, action_type: e.target.value })}
            >
              <option value="">Semua</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="IMPORT">IMPORT</option>
              <option value="EXPORT">EXPORT</option>
              <option value="BACKUP">BACKUP</option>
              <option value="RESTORE">RESTORE</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Dari Tanggal</label>
            <input
              type="date"
              className="border rounded px-3 py-2 text-sm"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Sampai Tanggal</label>
            <input
              type="date"
              className="border rounded px-3 py-2 text-sm"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
            />
          </div>
          <button
            onClick={handleFilter}
            className="bg-[#4e73df] hover:bg-[#2e59d9] text-white font-bold px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            <FaSearch /> Filter
          </button>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaHistory className="text-4xl mx-auto mb-4 opacity-30" />
            <p>Belum ada aktivitas tercatat</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4 text-left font-bold">Waktu</th>
                  <th className="p-4 text-left font-bold">User</th>
                  <th className="p-4 text-center font-bold">Aksi</th>
                  <th className="p-4 text-left font-bold">Tabel</th>
                  <th className="p-4 text-left font-bold">Detail</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendar className="text-gray-400" />
                        <span className="text-xs">{formatDateTime(log.created_at)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        <span className="font-medium">{log.user_name || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4">
                      {log.table_name ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaTable className="text-gray-400" />
                          <span className="font-mono text-xs">{log.table_name}</span>
                          {log.record_id && <span className="text-gray-400">#{log.record_id}</span>}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {log.new_data ? (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-blue-500 hover:underline">Lihat Detail</summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto max-w-xs">
                            {JSON.stringify(log.new_data, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <span className="text-sm text-gray-500">
                Halaman {pagination.page} dari {pagination.total_pages} ({pagination.total} total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchLogs(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => fetchLogs(pagination.page + 1)}
                  disabled={pagination.page >= pagination.total_pages}
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
