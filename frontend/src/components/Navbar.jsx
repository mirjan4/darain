import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, MoreVertical } from 'lucide-react';
import logoImg from '../assets/logo.webp';
import { UPLOADS_BASE_URL } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { whatsapp, logo, brand_name } = useSettings();
  
  const waLink = whatsapp
    ? `https://api.whatsapp.com/send/?phone=${whatsapp.replace(/\D/g, '')}`
    : 'https://api.whatsapp.com/send/?phone=916238186495';

  const logoSrc = logo ? `${UPLOADS_BASE_URL}/${logo}` : null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-xl py-2 md:py-3' : 'bg-white/80 backdrop-blur-md py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center relative">
          
          {/* Left: Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
            {logoSrc ? (
                <img src={logoSrc} alt={brand_name || "Darain Logo"} className="h-9 md:h-11 w-auto" />
            ) : brand_name ? (
                <span className="text-2xl font-bold font-serif text-[#2F468C] tracking-wide">{brand_name}</span>
            ) : (
                <img src={logoImg} alt="Darain Logo" className="h-9 md:h-11 w-auto" />
            )}
          </Link>

          {/* Center: Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="group relative"
              >
                <span className={`text-[10px] uppercase font-bold tracking-[0.2em] transition-colors duration-300 ${
                  location.pathname === item.path ? 'text-[#2F468C]' : 'text-gray-500 hover:text-[#2F468C]'
                }`}>
                  {item.name}
                </span>
                <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-[#2F468C] transition-all duration-300 group-hover:w-full ${
                  location.pathname === item.path ? 'w-full' : ''
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Right: WhatsApp Button & Mobile Toggle */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <a 
                href={waLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center space-x-2 bg-[#2F468C] text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            >
                <MessageCircle size={14} />
                <span>Enquiry</span>
            </a>

            {/* Desktop Three-Dot Menu (Categories) */}
            <div className="hidden md:block relative group p-2">
                <button className="flex items-center justify-center text-gray-700 group-hover:text-[#2F468C] transition-colors focus:outline-none">
                    <MoreVertical size={18} />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                   <div className="px-5 py-2">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Shop Categories</span>
                   </div>
                   <div className="flex flex-col">
                        <Link to="/collections/premium-abaya" className="px-5 py-2.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2F468C] transition-all">PREMIUM ABAYA</Link>
                        <Link to="/collections/niqab" className="px-5 py-2.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2F468C] transition-all">NIQAB</Link>
                        <Link to="/collections/scarf" className="px-5 py-2.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2F468C] transition-all">SCARF</Link>
                        <Link to="/collections/childrens-abaya" className="px-5 py-2.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2F468C] transition-all">CHILDREN'S ABAYA</Link>
                        <Link to="/collections/gloves-socks" className="px-5 py-2.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2F468C] transition-all">GLOVES & SOCKS</Link>
                   </div>
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-[#2F468C] hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center h-10 w-10 focus:outline-none"
                aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-x-0 top-[72px] bg-white border-t border-gray-100 overflow-hidden transition-all duration-700 ease-in-out z-40 ${isOpen ? 'max-h-screen opacity-100 shadow-2xl' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col items-center py-10 space-y-8 px-6 text-center">
            <div className="flex flex-col items-center space-y-6">
                {menuItems.map((item) => (
                <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-bold uppercase tracking-[0.2em] text-gray-700 hover:text-[#2F468C] transition-colors"
                >
                    {item.name}
                </Link>
                ))}
            </div>

            {/* Mobile Categories Menu */}
            <div className="w-full flex flex-col items-center pt-4 border-t border-gray-100 space-y-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Categories</span>
                <Link to="/collections/childrens-abaya" onClick={() => setIsOpen(false)} className="text-xs font-semibold text-gray-600 uppercase tracking-widest hover:text-[#2F468C]">Children's Abaya</Link>
                <Link to="/collections/gloves-socks" onClick={() => setIsOpen(false)} className="text-xs font-semibold text-gray-600 uppercase tracking-widest hover:text-[#2F468C]">Gloves & Socks</Link>
                <Link to="/collections/niqab" onClick={() => setIsOpen(false)} className="text-xs font-semibold text-gray-600 uppercase tracking-widest hover:text-[#2F468C]">Niqab</Link>
                <Link to="/collections/premium-abaya" onClick={() => setIsOpen(false)} className="text-xs font-semibold text-gray-600 uppercase tracking-widest hover:text-[#2F468C]">Premium Abaya</Link>
                <Link to="/collections/scarf" onClick={() => setIsOpen(false)} className="text-xs font-semibold text-gray-600 uppercase tracking-widest hover:text-[#2F468C]">Scarf</Link>
            </div>

            <a 
                href={waLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-[#2F468C] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest"
            >
                <MessageCircle size={16} />
                <span>WhatsApp Enquiry</span>
            </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;