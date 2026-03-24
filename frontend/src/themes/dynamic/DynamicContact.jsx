import React, { useState } from 'react';
import { 
    MapPin, 
    MessageCircle, 
    Phone, 
    Mail, 
    Clock, 
    Send, 
    ArrowRight,
    Globe,
    Instagram,
    Facebook
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const DynamicContact = () => {
    const { phone, whatsapp, email, address, business_hours, map_embed_url, brand_name } = useSettings();
    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });

    const waLink = whatsapp
        ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Hello`
        : 'https://wa.me/916238186495?text=Hello';

    // Safely extract the src if a full iframe tag was accidentally saved to the database
    let safeMapUrl = map_embed_url;
    if (safeMapUrl && safeMapUrl.startsWith('<iframe')) {
        const match = safeMapUrl.match(/src=["']([^"']+)["']/);
        if (match) safeMapUrl = match[1];
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Enquiry sent successfully! We will get back to you soon.");
    };

    return (
        <div className="min-h-screen bg-white font-outfit text-gray-900 pb-32 overflow-hidden">
            
            {/* 1. Page Header Section */}
            <div className="bg-[#F4EDE4] py-32 px-6 text-center border-b border-gray-100">
                <div className="max-w-4xl mx-auto space-y-6" data-aos="fade-up">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2F468C]">Reach Out</p>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-gray-900 drop-shadow-sm">
                       Let's stay connected.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Have a question about our collections or need style advice? Our team is here to help you define your unique modest look.
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* 2. Left: Contact Details & Store Info (Col 5) */}
                    <div className="lg:col-span-5 space-y-12" data-aos="fade-right">
                        <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl shadow-black/5 border border-gray-50 space-y-16">
                            
                            <div className="space-y-10">
                                <h3 className="text-2xl font-black tracking-tighter text-[#2F468C]">Our Boutique</h3>
                                
                                <div className="space-y-8">
                                    <div className="flex gap-6 group hover:translate-x-2 transition-transform duration-500">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#2F468C] group-hover:bg-[#2F468C] group-hover:text-white transition-all duration-500">
                                            <MapPin size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Location</p>
                                            <p className="text-base font-bold text-gray-700 leading-relaxed">{address || "Kottakkal, Kerala, India"}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 group hover:translate-x-2 transition-transform duration-500">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#2F468C] group-hover:bg-[#2F468C] group-hover:text-white transition-all duration-500">
                                            <Phone size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-1 text-base font-bold text-gray-700">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Call Us</p>
                                            <a href={`tel:${phone}`} className="hover:text-[#2F468C] transition-colors">{phone || "7994199309"}</a>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 group hover:translate-x-2 transition-transform duration-500">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#2F468C] group-hover:bg-[#2F468C] group-hover:text-white transition-all duration-500">
                                            <Mail size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-1 text-base font-bold text-gray-700">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Email</p>
                                            <a href={`mailto:${email}`} className="hover:text-[#2F468C] transition-colors break-all">{email || "fd786darain@gmail.com"}</a>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 group hover:translate-x-2 transition-transform duration-500">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#2F468C] group-hover:bg-[#2F468C] group-hover:text-white transition-all duration-500">
                                            <Clock size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-1 text-base font-bold text-gray-700">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Visiting Hours</p>
                                            <p>{business_hours || "Mon - Sat: 9:00 AM – 9:00 PM"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-0 border-t border-gray-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-4">Socials</p>
                                <div className="flex gap-4">
                                    <a href="#" className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all"><Instagram size={20} /></a>
                                    <a href="#" className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all"><Facebook size={20} /></a>
                                    <a href="#" className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all"><Globe size={20} /></a>
                                </div>
                                <br />
                                <a 
                            href={waLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center justify-between w-full bg-[#25D366] text-white p-6 rounded-[30px] shadow-2xl shadow-[#25D366]/20 hover:scale-[1.02] active:scale-95 transition-all group mb-3"
                        >
                            
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center shrink-0"><MessageCircle size={12} /></div>
                                <div className="space-y-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Quick Support</p>
                                    <p className="text-sm font-black tracking-tighter">Chat on WhatsApp</p>
                                </div>
                            </div>
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </a>
                            </div>
                        </div>

                        
                    </div>

                    {/* 3. Right: Specialized Contact Form (Col 7) */}
                    <div className="lg:col-span-7" data-aos="fade-left">
                        <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl shadow-black/[0.03] border border-gray-50">
                            <h2 className="text-3xl font-black tracking-tighter text-gray-900 mb-4">Send a message</h2>
                            <p className="text-gray-400 text-sm font-bold mb-12">We usually respond within 24 hours on business days.</p>
                            
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#2F468C] ml-1">Your Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formState.name}
                                            onChange={e => setFormState({...formState, name: e.target.value})}
                                            placeholder="Jane Doe" 
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 text-sm font-bold placeholder:text-gray-300 focus:ring-4 focus:ring-[#2F468C]/5 transition-all" 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#2F468C] ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formState.email}
                                            onChange={e => setFormState({...formState, email: e.target.value})}
                                            placeholder="jane@example.com" 
                                            className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 text-sm font-bold placeholder:text-gray-300 focus:ring-4 focus:ring-[#2F468C]/5 transition-all" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#2F468C] ml-1">Subject</label>
                                    <input 
                                        type="text" 
                                        value={formState.subject}
                                        onChange={e => setFormState({...formState, subject: e.target.value})}
                                        placeholder="Order Inquiry / Collaboration" 
                                        className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 text-sm font-bold placeholder:text-gray-300 focus:ring-4 focus:ring-[#2F468C]/5 transition-all" 
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#2F468C] ml-1">How can we help?</label>
                                    <textarea 
                                        rows={6} 
                                        value={formState.message}
                                        onChange={e => setFormState({...formState, message: e.target.value})}
                                        placeholder="Tell us about your request..." 
                                        className="w-full bg-gray-50 border-none rounded-[32px] px-8 py-6 text-sm font-bold placeholder:text-gray-300 focus:ring-4 focus:ring-[#2F468C]/5 transition-all resize-none" 
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit"
                                    className="group flex items-center justify-center gap-5 w-full bg-gray-900 text-white rounded-full py-6 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-[#2F468C] hover:-translate-y-1 transition-all duration-500 active:scale-95"
                                >
                                    Send Message
                                    <Send size={18} className="transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* 4. Full-Width Map Display Segment */}
                <div className="mt-32 w-full rounded-[60px] overflow-hidden h-[600px] shadow-2xl shadow-black/5 relative group border-8 border-white" data-aos="zoom-in">
                    {safeMapUrl ? (
                         <iframe
                            src={safeMapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Boutique Location"
                            className="grayscale hover:grayscale-0 transition-all duration-1000"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                            <p className="text-gray-300 font-black uppercase tracking-widest">Map Configuration Needed</p>
                        </div>
                    )}
                    <div className="absolute top-10 left-10 p-10 bg-white shadow-2xl rounded-[40px] max-w-sm hidden md:block group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="space-y-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#2F468C]">Our Flagship Store</span>
                            <h4 className="text-2xl font-black tracking-tight">{brand_name || "Darain Boutique"}</h4>
                            <p className="text-xs font-bold text-gray-400 leading-relaxed">{address || "Vist us for an exclusive in-store experience."}</p>
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || 'Kottakkal')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1"
                            >
                                Get Directions <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicContact;
