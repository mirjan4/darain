import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';


const ModernFooter = () => {
    const { 
        address, 
        phone, 
        email, 
        map_embed_url,
        business_hours,
        whatsapp,
        brand_name
    } = useSettings();

    const whatsappNum = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";
    const waLink = `https://wa.me/${whatsappNum}?text=Hello`;
    const loc = useLocation();
    const isHome = loc.pathname === '/';

    // Safely extract the `src` URL if the user accidentally pasted an entire <iframe src="..."> HTML block.
    let cleanMapUrl = map_embed_url;
    if (cleanMapUrl && cleanMapUrl.includes('<iframe') && cleanMapUrl.includes('src=')) {
        const srcMatch = cleanMapUrl.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
            cleanMapUrl = srcMatch[1];
        }
    }

    return (
        <>
            {/* Premium Conditional Map & Boutique Section exclusively for Home Page */}
            {isHome && cleanMapUrl && (
                 <div className="py-12 md:py-16 border-t border-gray-100">
            <div
                className="flex flex-col md:flex-row w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                data-aos="fade-up"
            >
                {/* Left Side: Contact Info */}
                <div className="w-full md:w-5/12 p-6 md:p-8 flex flex-col justify-center bg-gray-50/30 gap-4">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-[#2F468C]">
                        Visit Our Boutique
                    </h3>

                    {address && (
                        <div className="flex items-start gap-3">
                            <MapPin size={16} className="text-[#2F468C] mt-0.5 flex-shrink-0" />
                            <p className="text-gray-600 font-sans text-sm leading-relaxed">{address}</p>
                        </div>
                    )}

                    {phone && (
                        <div className="flex items-center gap-3">
                            <Phone size={16} className="text-[#2F468C] flex-shrink-0" />
                            <a href={`tel:${phone.replace(/\s/g,'')}`} className="text-gray-600 font-sans text-sm hover:text-[#2F468C] transition-colors">
                                {phone}
                            </a>
                        </div>
                    )}

                    {email && (
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-[#2F468C] flex-shrink-0" />
                            <a href={`mailto:${email}`} className="text-gray-600 font-sans text-sm hover:text-[#2F468C] transition-colors">
                                {email}
                            </a>
                        </div>
                    )}

                    {business_hours && (
                        <div className="flex items-center gap-3">
                            <Clock size={16} className="text-[#2F468C] flex-shrink-0" />
                            <p className="text-gray-600 font-sans text-sm">{business_hours}</p>
                        </div>
                    )}

                    <div className="mt-2">
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-[#2F468C] text-white px-6 py-3 rounded-full font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-sm hover:bg-[#1a237e] hover:-translate-y-0.5"
                        >
                            <MessageCircle size={16} />
                            WhatsApp Us
                        </a>
                    </div>
                </div>

                {/* Right Side: Map */}
                <div className="w-full md:w-7/12 h-64 md:h-80 relative border-t md:border-t-0 md:border-l border-gray-200">
                    {cleanMapUrl ? (
                        <iframe
                            src={cleanMapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Darain Boutique Location"
                            className="grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                            Map not configured
                        </div>
                    )}
                </div>
            </div>
        </div>
            )}

            {/* Dark 4-Column Footer */}
            <footer className="bg-[#1f273d] text-[#a0aabf] py-16 font-sans">
                <div className="w-full px-6 md:px-12">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                        
                        {/* Column 1: Brand & Social */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold font-serif text-white tracking-widest uppercase">{brand_name || "DARAIN"}</h2>
                            <p className="text-sm leading-relaxed max-w-xs">
                                Exquisite Abaya and Pardha collection for the modern woman who values elegance, modesty, and quality.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <a href="#" className="text-white hover:text-gray-300 transition-colors">
                                    <Instagram size={18} />
                                </a>
                                <a href="#" className="text-white hover:text-gray-300 transition-colors">
                                    <Facebook size={18} />
                                </a>
                                <a href="#" className="text-white hover:text-gray-300 transition-colors">
                                    <Twitter size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold font-serif text-white">Quick Links</h3>
                            <div className="flex flex-col gap-4">
                                <Link to="/" className="text-sm hover:text-white transition-colors">Home</Link>
                                <Link to="/collections" className="text-sm hover:text-white transition-colors">Collections</Link>
                                <Link to="/about" className="text-sm hover:text-white transition-colors">Our Story</Link>
                                <Link to="/contact" className="text-sm hover:text-white transition-colors">Contact Us</Link>
                            </div>
                        </div>

                        {/* Column 3: Customer Care */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold font-serif text-white">Customer Care</h3>
                            <div className="flex flex-col gap-4">
                                <a href="#" className="text-sm hover:text-white transition-colors">Shipping Policy</a>
                                <a href="#" className="text-sm hover:text-white transition-colors">Returns & Exchanges</a>
                                <a href="#" className="text-sm hover:text-white transition-colors">Size Guide</a>
                                <a href="#" className="text-sm hover:text-white transition-colors">FAQs</a>
                            </div>
                        </div>

                        {/* Column 4: Contact Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold font-serif text-white">Contact Info</h3>
                            <div className="flex flex-col gap-4">
                                <a href={`tel:${phone}`} className="flex items-center gap-3 text-sm hover:text-white transition-colors">
                                    <Phone size={16} className="shrink-0" />
                                    <span>{phone || "7994199309"}</span>
                                </a>
                                <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm hover:text-white transition-colors break-words">
                                    <Mail size={16} className="shrink-0" />
                                    <span>{email || "ahammedmirjan786@gmail.com"}</span>
                                </a>
                                <div className="flex items-start gap-3 text-sm text-[#a0aabf] max-w-[250px]">
                                    <MapPin size={16} className="shrink-0 mt-0.5" />
                                    <span className="leading-relaxed uppercase">
                                        {address || "MARHAMA NANDANATH\nMUDUPALAM PERUMANNA"}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Copyright */}
                    <div className="pt-8 border-t border-white/10 text-center">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#626d8a]">
                            © {new Date().getFullYear()} {brand_name || "DARAIN FASHIONS"}. ALL RIGHTS RESERVED.
                        </p>
                    </div>

                </div>
            </footer>
        </>
    );
};

export default ModernFooter;
