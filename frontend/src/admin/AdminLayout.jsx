import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  PlusCircle, 
  MessageSquare, 
  LogOut, 
  ExternalLink, 
  Layers, 
  Settings, 
  Menu, 
  X,
  User,
  ChevronRight,
  ListRestart
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { UPLOADS_BASE_URL } from '../utils/api';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logo } = useSettings();
  const adminUser = localStorage.getItem('admin_user') || 'Administrator';

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={16} /> },
    { name: 'Add Product', path: '/admin/add-product', icon: <PlusCircle size={16} /> },
    { name: 'Attributes', path: '/admin/attributes', icon: <ListRestart size={16} /> },
    { name: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare size={16} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={16} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#fcfdfe]/80 backdrop-blur-xl">
      {/* Brand Section */}
      <div className="h-16 flex items-center px-6 mb-4 mt-2">
        <Link to="/admin/products" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-gray-100 group-hover:border-[#2F468C]/30 transition-all duration-300 shadow-sm">
            {logo ? (
              <img src={`${UPLOADS_BASE_URL}/${logo}`} alt="Logo" className="w-5 h-5 object-contain" />
            ) : (
              <div className="w-3.5 h-3.5 bg-[#2F468C] rounded-sm" />
            )}
          </div>
          <div>
            <span className="text-sm font-bold text-gray-900 tracking-tight block">Darain</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest block -mt-0.5">Admin Portal</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] opacity-80">Menu</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between group px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-[#2F468C] text-white shadow-md shadow-[#2F468C]/20 scale-[1.02]'
                  : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-900 hover:translate-x-1'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#2F468C]'} transition-colors`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium tracking-tight">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={14} className="opacity-40" />}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link 
          to="/" 
          target="_blank"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100/50 transition-all text-sm font-medium"
        >
          <ExternalLink size={14} />
          <span>View Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] admin-portal">
      
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:block w-64 fixed h-full bg-[#fcfdfe] border-r border-gray-200/50 z-30 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
        <SidebarContent />
      </aside>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[40] bg-gray-900/20 backdrop-blur-[2px] lg:hidden transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ===== MOBILE SIDEBAR DRAWER ===== */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white z-[50] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 h-16 bg-white/70 backdrop-blur-md border-b border-gray-200/40 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-gray-800 font-serif">
                {menuItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-gray-50/50 border border-gray-100 transition-all hover:border-gray-200">
              <div className="w-6 h-6 rounded-full bg-[#2F468C]/10 flex items-center justify-center">
                <User size={12} className="text-[#2F468C]" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 hidden sm:inline-block">{adminUser}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
