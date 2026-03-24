import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Menu, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { UPLOADS_BASE_URL } from '../../utils/api';
import ModernFooter from './ModernFooter';
import WhatsAppButton from '../../components/WhatsAppButton';

const ModernLayout = ({ children }) => {
    const { logo, whatsapp, brand_name } = useSettings();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const whatsappNum = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";

    return (
        <div className="font-sans bg-[#EBEBEB] min-h-screen flex flex-col selection:bg-black selection:text-white text-gray-900">
            {/* Elevated Top Decorative Ornaments */}
            <div className="w-full pt-4 px-6 md:px-12 flex flex-col gap-[2px] md:gap-[3px]">
                <div className="h-[10px] md:h-[12px] w-full bg-black"></div>
                <div className="h-[6px] md:h-[8px] w-full bg-black"></div>
                <div className="h-[4px] md:h-[5px] w-full bg-black"></div>
                <div className="h-[2px] md:h-[3px] w-full bg-black"></div>
                <div className="h-[1.5px] md:h-[2px] w-full bg-black"></div>
                <div className="h-[1px] md:h-[1.5px] w-full bg-black"></div>
                <div className="h-[0.5px] md:h-[1px] w-full bg-black opacity-80"></div>
                <div className="h-[0.5px] w-full bg-black opacity-50"></div>
            </div>

            {/* Minimal Header */}
            <header className="w-full mt-2">
                <div className="px-6 md:px-12 h-16 flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            {logo ? (
                                <img src={`${UPLOADS_BASE_URL}/${logo}`} alt={brand_name || "Brand Logo"} className="h-6 object-contain" />
                            ) : (
                                <span className="font-serif font-black tracking-widest text-lg uppercase">{brand_name || "DARAIN"}</span>
                            )}
                        </Link>
                    </div>

                    {/* Center: Links */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-12">
                        <Link to="/" className={`text-xs font-medium px-1 pb-1 border-b-2 ${location.pathname === '/' ? 'border-black text-black' : 'border-transparent text-gray-900 hover:border-black/30'} transition-all`}>Home</Link>
                        <Link to="/collections" className={`text-xs font-medium px-1 pb-1 border-b-2 ${location.pathname.includes('/collections') ? 'border-black text-black' : 'border-transparent text-gray-900 hover:border-black/30'} transition-all`}>Collections</Link>
                        <Link to="/about" className={`text-xs font-medium px-1 pb-1 border-b-2 ${location.pathname === '/about' ? 'border-black text-black' : 'border-transparent text-gray-900 hover:border-black/30'} transition-all`}>About</Link>
                        <span className="text-xs font-medium text-gray-900">...</span>
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-6 md:gap-8">
                        <a 
                            href={`https://wa.me/${whatsappNum}?text=Hello,%20I%20have%20an%20enquiry.`}
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[11px] font-medium text-black flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                        >
                            <MessageCircle size={14} strokeWidth={2} />
                            <span>Enquiry</span>
                        </a>

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-black p-1"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[100] md:hidden">
                        {/* Backdrop */}
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                        
                        {/* Content */}
                        <div className="fixed left-0 top-0 h-full w-[280px] bg-white shadow-2xl p-8 flex flex-col gap-10 animate-in slide-in-from-left duration-300">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                <span className="font-serif font-black tracking-widest text-[#2A3F74]">{brand_name || "DARAIN"}</span>
                                <button onClick={() => setIsMenuOpen(false)} className="text-gray-400"><X size={20} /></button>
                            </div>
                            
                            <nav className="flex flex-col gap-8">
                                <Link to="/" onClick={() => setIsMenuOpen(false)} className={`text-sm font-bold tracking-widest uppercase ${location.pathname === '/' ? 'text-[#2A3F74]' : 'text-gray-400'}`}>Home</Link>
                                <Link to="/collections" onClick={() => setIsMenuOpen(false)} className={`text-sm font-bold tracking-widest uppercase ${location.pathname.includes('/collections') ? 'text-[#2A3F74]' : 'text-gray-400'}`}>Collections</Link>
                                <Link to="/about" onClick={() => setIsMenuOpen(false)} className={`text-sm font-bold tracking-widest uppercase ${location.pathname === '/about' ? 'text-[#2A3F74]' : 'text-gray-400'}`}>Our Story</Link>
                                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase text-gray-400">Contact</Link>
                            </nav>

                            <div className="mt-auto border-t border-gray-100 pt-10">
                                <a 
                                    href={`https://wa.me/${whatsappNum}?text=Hello`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 bg-[#2A3F74] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#2A3F74]/20"
                                >
                                    <MessageCircle size={14} />
                                    WhatsApp Us
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Space */}
            <main className="flex-grow pt-4">
                <div className="px-6 md:px-12 pb-24">
                    {children}
                </div>
            </main>

            {/* WhatsApp Floating Button */}
            <WhatsAppButton />

            {/* Premium Minimal Footer */}
            <ModernFooter />
        </div>
    );
};

export default ModernLayout;
