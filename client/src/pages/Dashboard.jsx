import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { indicatorsData } from '../data/indicators';
import { api } from '../utils/api';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(true);
  const { selectedYear } = useAuth();

  useEffect(() => {
    fetchSummary();
  }, [selectedYear]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get('', { action: 'summary', tahun: selectedYear });
      if (res.status === 'success') {
        setSummaryData(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch summary:', e);
    } finally {
      setLoading(false);
    }
  };

  const getCapaianColor = (pct) => {
    if (pct >= 80) return "bg-green-100 text-green-600";
    if (pct >= 50) return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-[#f6c23e] text-2xl font-extrabold mb-1 tracking-wide">SIMONEV-KIP</h2>
        <h5 className="text-[#858796] text-xs font-medium">Sistem Informasi Monitoring & Evaluasi Kinerja Instansi Pemerintah</h5>
        <h5 className="text-[#858796] text-xs font-medium">Tahun {selectedYear}</h5>
        <h5 className="text-[#5a5c69] text-sm font-bold mt-1">Pengadilan Negeri Yogyakarta</h5>
      </div>

      <div className="bg-[#fff3cd] border-l-4 border-[#f6c23e] text-[#856404] px-4 py-3 rounded-r-lg mb-6 text-sm font-medium shadow-sm">
        Sasaran Strategis (SK SEKMA 2025)
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {indicatorsData.map((section, idx) => {
          const colors = ["text-[#4e73df] border-[#4e73df]", "text-[#f6c23e] border-[#f6c23e]", "text-[#1cc88a] border-[#1cc88a]"];
          return (
            <div key={idx} className={`bg-white p-5 rounded-lg shadow-sm border-l-[5px] ${colors[idx % 3].split(' ')[1]}`}>
              <div className="flex items-start">
                <FaCheckCircle className={`${colors[idx % 3].split(' ')[0]} text-lg mt-1 mr-3 flex-shrink-0`} />
                <h5 className="text-[#5a5c69] font-bold text-[11px] leading-snug">{section.category}</h5>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h4 className="font-bold text-gray-700">
            Ringkasan Capaian {loading && <span className="text-xs text-gray-400 ml-2">(Loading...)</span>}
          </h4>
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
                      <td className="p-3 border-r text-center">
                        <span className={`${getCapaianColor(pct)} px-2 py-1 rounded font-bold`}>{pct}%</span>
                      </td>
                      <td className="p-3 text-center">
                        <Link to={`/input/${item.id}`} className="bg-[#eaecf4] text-[#4e73df] px-3 py-1 rounded font-bold hover:bg-[#d1d3e2]">
                          Input
                        </Link>
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

export default Dashboard;
