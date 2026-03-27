import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, Instagram, Facebook, Mail, Phone, ChevronRight, MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const MotionGreenLayout = ({ children }) => {
    const { contact, whatsapp, brand_name } = useSettings();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const whatsappNum = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";
    const shopName = brand_name || "Darain Boutique";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Collection', path: '/collections' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A] font-outfit"
        >
            {/* STICKY NAV BAR */}
            <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-700 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4' : 'bg-transparent py-8'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    
                    {/* Logo */}
                    <Link to="/" className="relative group overflow-hidden">
                        <motion.span 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl font-black uppercase tracking-tighter text-[#1A1A1A] block transition-transform group-hover:-translate-y-full duration-500"
                        >
                            {shopName}
                        </motion.span>
                        <motion.span 
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="absolute inset-0 text-2xl font-black uppercase tracking-tighter text-[#7FBFA6] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                        >
                            {shopName}
                        </motion.span>
                    </Link>

                    {/* Nav Desktop */}
                    <div className="hidden lg:flex items-center gap-12 font-bold uppercase tracking-widest text-[10px]">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path} 
                                className="relative group text-gray-400 hover:text-[#1A1A1A] transition-colors"
                            >
                                {link.name}
                                <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#7FBFA6] transition-all duration-500 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`} />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-white transition-all"
                        >
                            <Search size={18} />
                        </motion.button>
                        <Link 
                            to="/collections"
                            className="relative w-10 h-10 rounded-full flex items-center justify-center bg-[#7FBFA6] text-white shadow-lg shadow-[#7FBFA6]/20 transition-all hover:bg-[#6FAE95]"
                        >
                            <ShoppingBag size={18} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-400 text-[8px] font-black flex items-center justify-center text-white border-2 border-white animate-bounce">2</span>
                        </Link>
                        <motion.button 
                            onClick={() => setIsMenuOpen(true)}
                            whileTap={{ scale: 0.9 }}
                            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 bg-white"
                        >
                            <Menu size={18} />
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[200] bg-white flex flex-col p-12"
                    >
                        <button 
                            onClick={() => setIsMenuOpen(false)}
                            className="self-end w-12 h-12 rounded-full flex items-center justify-center bg-[#EEF5F2] text-gray-500 mb-20"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="space-y-8">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path} 
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block text-5xl font-black tracking-tighter transition-colors ${location.pathname === link.path ? 'text-[#1A1A1A]' : 'text-gray-400 hover:text-[#7FBFA6]'}`}
                                >
                                    {link.name.toUpperCase()}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto pt-10 border-t border-gray-100 flex flex-col gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">FOLLOW US</span>
                            <div className="flex gap-6 text-[#1A1A1A]">
                                <Instagram size={20} />
                                <Facebook size={20} />
                                <Mail size={20} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CONTENT AREA */}
            <main className="pt-24 min-h-[70vh]">
                {children}
            </main>

            {/* LUXURY FOOTER */}
            <footer className="bg-[#EEF5F2] pt-32 pb-16 px-6">
                <div className="max-w-7xl mx-auto space-y-24">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="max-w-sm space-y-6">
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">{shopName}</h2>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                Designing timeless elegance with a focus on modern modesty. Curated fabrics, master tailoring, and a commitment to quality.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#7FBFA6] hover:text-white transition-all shadow-sm">
                                    <Instagram size={16} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#7FBFA6] hover:text-white transition-all shadow-sm">
                                    <Facebook size={16} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#7FBFA6] hover:text-white transition-all shadow-sm">
                                    <Mail size={16} />
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-20">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7FBFA6]">Quick Links</h3>
                                <div className="flex flex-col gap-3 font-medium text-sm text-gray-500">
                                    <Link to="/collections">All Collections</Link>
                                    <Link to="/about">Our Story</Link>
                                    <Link to="/contact">Support</Link>
                                    <Link to="/about">Privacy Policy</Link>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7FBFA6]">Contact</h3>
                                <div className="flex flex-col gap-3 font-medium text-sm text-gray-500">
                                    <span className="flex items-center gap-2"><Phone size={14} className="text-[#7FBFA6]" /> {contact?.phone || "+91-123456789"}</span>
                                    <span className="flex items-center gap-2 font-bold tracking-tight text-[#1A1A1A] uppercase text-xs">VISIT OUR BOUTIQUE <ChevronRight size={14} /></span>
                                    <p className="text-[10px] leading-relaxed max-w-[200px] text-gray-400">
                                        Located in the heart of Mumbai. Open Mon-Sat, 10am to 9pm.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                            © {new Date().getFullYear()} {shopName}. REFINED MODESTY.
                        </p>
                        <div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                            <span>Terms</span>
                            <span>Privacy</span>
                            <span>Cookies</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* FLOATING WHATSAPP */}
            <motion.a 
                href={`https://wa.me/${whatsappNum}?text=Hello! I was browsing your website and had a question.`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-[#7FBFA6] text-white rounded-full shadow-2xl shadow-[#7FBFA6]/40 flex items-center justify-center animate-bounce duration-[2000ms]"
            >
                <MessageCircle size={24} />
            </motion.a>
        </motion.div>
    );
};

export default MotionGreenLayout;
