
const Sidebar = ({ activeMenu, setActiveMenu }) => {
 

  const menus = [
    { name: "Dashboard", icon: <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
    { name: "Perkara", icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { name: "Pegawai", icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
    { name: "Laporan", icon: <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
  ];

  return (
    <aside className="w-24 lg:w-64 bg-white min-h-screen flex flex-col fixed left-0 top-0 z-50 border-r border-slate-200 shadow-sm transition-all duration-300">
      {/* Logo Area - Minimalist Circle */}
      <div className="h-24 flex items-center justify-center">
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-300">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 space-y-4 mt-4">
        {menus.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveMenu(item.name)}
            className={`w-full flex flex-col lg:flex-row items-center lg:space-x-4 px-2 lg:px-6 py-4 rounded-3xl transition-all duration-300 group ${
              activeMenu === item.name
                ? "bg-slate-900 text-white shadow-lg shadow-slate-300 transform scale-105"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon.props.d} />
            </svg>
            <span className="mt-1 lg:mt-0 text-[10px] lg:text-sm font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer Avatar */}
      <div className="p-6 flex justify-center pb-8">
         <img src="https://ui-avatars.com/api/?name=Admin&background=random" className="w-10 h-10 rounded-full border-2 border-white shadow-md" alt="Profile" />
      </div>
    </aside>
  );
};

export default Sidebar;