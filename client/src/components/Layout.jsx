import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaBookmark, FaChevronRight, FaChevronDown,
  FaBars, FaSignOutAlt, FaDownload, FaHistory,
  FaUserCircle, FaCog
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { indicatorsData } from '../data/indicators';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState({ 0: true, 1: true, 2: true });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoggedIn, selectedYear, setSelectedYear, availableYears } = useAuth();

  const toggleMenu = (idx) => setActiveMenu(prev => ({ ...prev, [idx]: !prev[idx] }));

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fc] font-sans text-[#5a5c69]">
      {/* SIDEBAR */}
      <div className={`fixed left-0 top-0 h-full bg-[#e3f2fd] border-r border-blue-200 z-50 w-[18rem] transition-transform duration-300 ${sidebarCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0'} ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
        <div className="h-[4.5rem] flex flex-col justify-center items-center border-b border-blue-200 bg-[#e3f2fd] shrink-0">
          <h1 className="text-[#4e73df] font-extrabold text-2xl tracking-tighter">SIMONEV-KIP</h1>
          <p className="text-[#858796] text-[7.5px] font-bold">Sistem Informasi Monitoring & Evaluasi Kinerja Instansi Pemerintah</p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hidden py-4 px-3">
          <Link to="/" className={`flex items-center hover:text-[#4e73df] font-bold px-3 py-2 mb-1 ${location.pathname === '/' ? 'text-[#4e73df]' : 'text-[#5a5c69]'}`}>
            <FaHome className="mr-3 text-lg" /> Dashboard
          </Link>
          
          {isLoggedIn() && (
            <>
              <Link to="/activity-log" className={`flex items-center hover:text-[#4e73df] font-bold px-3 py-2 mb-1 ${location.pathname === '/activity-log' ? 'text-[#4e73df]' : 'text-[#5a5c69]'}`}>
                <FaHistory className="mr-3 text-lg" /> Log Aktivitas
              </Link>
              <Link to="/settings" className={`flex items-center hover:text-[#4e73df] font-bold px-3 py-2 mb-2 ${location.pathname === '/settings' ? 'text-[#4e73df]' : 'text-[#5a5c69]'}`}>
                <FaCog className="mr-3 text-lg" /> Pengaturan
              </Link>
            </>
          )}
          
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
              Dasar Hukum : <a href="SK SEKMA 27101 IKU 10 11 2025.pdf" download className="text-[#4e73df] font-bold hover:underline block mt-1 cursor-pointer"><FaDownload size={8} className="inline mr-1" />SK SEKMA 27101 IKU 10 11 2025</a>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={`flex-1 flex flex-col transition-all duration-300 w-full relative ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-[18rem]'}`}>
        <div className="bg-white h-[4.5rem] shadow-sm flex justify-between items-center px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#4e73df] text-xl"><FaBars /></button>
            {/* Desktop sidebar toggle */}
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden md:flex items-center text-[#4e73df] hover:text-[#2e59d9] text-xl" title={sidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}>
              <FaBars />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn() ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-700">{user?.nama}</p>
                  <p className="text-xs text-gray-500">{user?.jabatan}</p>
                </div>
                <FaUserCircle className="text-3xl text-[#4e73df]" />
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-500 hover:text-red-500 cursor-pointer flex items-center"
                >
                  <FaSignOutAlt className="mr-1 text-lg text-red-400" /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-[#4e73df] hover:bg-[#2e59d9] text-white font-bold py-2 px-4 rounded text-sm flex items-center gap-2">
                <FaUserCircle /> Login
              </Link>
            )}
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
