import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle, ArrowRight } from 'lucide-react';

const DynamicFooter = () => {
    const { brand_name, address, phone, email, whatsapp } = useSettings();
    const currentYear = new Date().getFullYear();
    const whatsappNum = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";

    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12 font-sans overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 mb-20">
                    
                    {/* Brand Section */}
                    <div className="space-y-8 flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-black font-serif italic text-gray-900 tracking-tight lowercase">
                                {brand_name || "Darain"}
                            </h2>
                            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xs font-medium">
                                Curated elegance for the modern woman who values modesty and quality.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#2F468C] hover:text-white transition-all duration-300 shadow-sm"><Instagram size={18} strokeWidth={1.5} /></a>
                            <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#2F468C] hover:text-white transition-all duration-300 shadow-sm"><Facebook size={18} strokeWidth={1.5} /></a>
                        </div>
                    </div>

                    {/* Quick Navigation Links */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 border-b border-gray-100 pb-3">Shop Navigation</h3>
                        <nav className="flex flex-col gap-4">
                            {['Home', 'Collections', 'Our Story', 'Contact'].map((item) => (
                                <Link 
                                    key={item} 
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                                    className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors inline-flex items-center gap-2 group"
                                >
                                    <span className="w-0 h-[1.5px] bg-[#2F468C] transition-all duration-300 group-hover:w-3"></span>
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Detail Section */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 border-b border-gray-100 pb-3">Contact Support</h3>
                        <div className="flex flex-col gap-5">
                            <a href={`tel:${phone}`} className="flex items-start gap-4 text-gray-500 hover:text-gray-900 transition-colors group">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#2F468C]/10 group-hover:text-[#2F468C] transition-colors"><Phone size={18} strokeWidth={1.5} /></div>
                                <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Phone</span><span className="text-sm font-bold overflow-hidden text-ellipsis whitespace-nowrap">{phone || "7994199309"}</span></div>
                            </a>
                            <a href={`mailto:${email}`} className="flex items-start gap-4 text-gray-500 hover:text-gray-900 transition-colors group">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#2F468C]/10 group-hover:text-[#2F468C] transition-colors"><Mail size={18} strokeWidth={1.5} /></div>
                                <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Email</span><span className="text-sm font-bold overflow-hidden text-ellipsis whitespace-nowrap">{email || "ahammedmirjan786@gmail.com"}</span></div>
                            </a>
                        </div>
                    </div>

                    {/* Newsletter / Feature */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 border-b border-gray-100 pb-3">Newsletter</h3>
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-bold text-gray-400">Join our mailing list for updates on new collections and exclusive offers.</p>
                            <div className="relative group/input">
                                <input 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none focus:border-[#2F468C]/20 focus:bg-white transition-all shadow-sm"
                                />
                                <button className="absolute right-2 top-2 bottom-2 w-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-[#2F468C] transition-colors">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Section */}
                <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        &copy; {currentYear} {brand_name || "Darain"}. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        {['Privacy Policy', 'Terms of Service', 'Returns'].map(p => (
                            <a key={p} href="#" className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">{p}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default DynamicFooter;
