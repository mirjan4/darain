import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    ShoppingBag, 
    Search, 
    User, 
    Menu, 
    X, 
    MessageCircle, 
    ChevronRight, 
    Heart, 
    Globe, 
    ArrowRightCircle, 
    MapPin, 
    Phone, 
    Mail,
    Clock 
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { UPLOADS_BASE_URL } from '../../utils/api';
import DynamicFooter from './DynamicFooter';
import WhatsAppButton from '../../components/WhatsAppButton';

const DynamicLayout = ({ children }) => {
    const { logo, whatsapp, brand_name, phone, email, address, top_bar_text, business_hours } = useSettings();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const whatsappNum = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";
    const marqueeText = top_bar_text || "";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-white font-outfit text-gray-900 selection:bg-black selection:text-white">
            
            {/* 1. DYNAMIC TOP BAR (Utility + Motion) */}
            <div className="bg-[#281c15] text-white border-b border-white/5 py-2.5 px-6 md:px-12 text-[10px] font-bold uppercase tracking-[0.15em] relative z-[110]">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-10">
                    
                    {/* Utlity Left */}
                    <div className="hidden lg:flex items-center gap-6 shrink-0">
                        <a href={`tel:${phone}`} className="hover:text-gray-300 transition-colors flex items-center gap-2">
                           <Phone size={10} strokeWidth={3} /> {phone || "7994199309"}
                        </a>
                        <a href={`mailto:${email}`} className="hover:text-gray-300 transition-colors flex items-center gap-2 border-l border-white/20 pl-6">
                           <Mail size={10} strokeWidth={3} /> {email || "fd786darain@gmail.com"}
                        </a>
                    </div>

                    {/* Scrolling Announcement */}
                    <div className="flex-1 overflow-hidden relative">
                        <div className="flex animate-marquee whitespace-nowrap">
                            <span className="px-10">{marqueeText}</span>
                            <span className="px-10">{marqueeText}</span>
                            <span className="px-10">{marqueeText}</span>
                        </div>
                    </div>

                    {/* Business Hours Right */}
                    <div className="hidden lg:flex items-center shrink-0 opacity-80">
                         <Clock size={10} className="mr-2" /> {business_hours || "Mon - Sat: 9:00 AM - 9:00 PM"}
                    </div>
                </div>
            </div>

            {/* 2. MAIN HEADER (Shopify Style) */}
            <header className={`sticky top-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-white py-6 md:py-8'}`}>
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-3 items-center">
                    
                    {/* LEFT: DESKTOP NAVIGATION */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/" className={`text-xs font-black uppercase tracking-widest hover:text-gray-400 transition-colors ${isActive('/') ? 'text-gray-900' : 'text-gray-500'}`}>Home</Link>
                        <Link to="/collections" className={`text-xs font-black uppercase tracking-widest hover:text-gray-400 transition-colors ${isActive('/collections') ? 'text-gray-900' : 'text-gray-500'}`}>Collections</Link>
                        <Link to="/about" className={`text-xs font-black uppercase tracking-widest hover:text-gray-400 transition-colors ${isActive('/about') ? 'text-gray-900' : 'text-gray-500'}`}>About</Link>
                        <Link to="/contact" className={`text-xs font-black uppercase tracking-widest hover:text-gray-400 transition-colors ${isActive('/contact') ? 'text-gray-900' : 'text-gray-500'}`}>Contact</Link>
                    </nav>

                    {/* MOBILE TOGGLE (LEFT ON MOBILE) */}
                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full">
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* CENTER: LOGO */}
                    <div className="flex justify-center flex-shrink-0">
                        <Link to="/" className="inline-block transition-transform duration-300 hover:scale-[1.02]">
                            {logo ? (
                                <img src={`${UPLOADS_BASE_URL}/${logo}`} alt={brand_name} className="h-8 md:h-12 w-auto object-contain" />
                            ) : (
                                <h1 className="text-2xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase leading-none drop-shadow-sm font-outfit">
                                    {brand_name || "DYNAMIC"}
                                </h1>
                            )}
                        </Link>
                    </div>

                    {/* RIGHT: ICONS */}
                    <div className="flex items-center justify-end gap-5 md:gap-8">
                        <button className="text-gray-900 hover:text-gray-400 transition-all p-1">
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                        <Link to="/account" className="hidden sm:block text-gray-900 hover:text-gray-400 transition-all p-1">
                            <User size={22} strokeWidth={1.5} />
                        </Link>
                        <Link to="/cart" className="relative text-gray-900 hover:text-gray-400 transition-all p-1">
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black">1</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Sidebar */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[1000] lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="absolute top-0 left-0 h-full w-[310px] bg-white shadow-2xl flex flex-col p-10 animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center mb-16">
                            <h3 className="font-serif italic font-black text-xl lowercase tracking-tighter">{brand_name || "Darain"}</h3>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button>
                        </div>

                        <nav className="flex flex-col gap-10">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-[0.25em] flex justify-between items-center group">
                                <span>Home</span> <ChevronRight size={14} className="text-gray-300 group-hover:text-[#2F468C] transition-colors" />
                            </Link>
                            <Link to="/collections" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-[0.25em] flex justify-between items-center group">
                                <span>Collections</span> <ChevronRight size={14} className="text-gray-300 group-hover:text-[#2F468C] transition-colors" />
                            </Link>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-[0.25em] flex justify-between items-center group">
                                <span>Our Story</span> <ChevronRight size={14} className="text-gray-300 group-hover:text-[#2F468C] transition-colors" />
                            </Link>
                            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-black uppercase tracking-[0.25em] flex justify-between items-center group">
                                <span>Contact</span> <ChevronRight size={14} className="text-gray-300 group-hover:text-[#2F468C] transition-colors" />
                            </Link>
                        </nav>

                        <div className="mt-auto border-t border-gray-100 pt-10">
                            <a href={`tel:${phone}`} className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500"><Phone size={18} /></div>
                                <div className="flex flex-col"><span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Call Us</span><span className="text-sm font-black">{phone || "7994199309"}</span></div>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Application Area */}
            <main className="w-full">
                {children}
            </main>

            <WhatsAppButton />
            <DynamicFooter />
        </div>
    );
};

export default DynamicLayout;
