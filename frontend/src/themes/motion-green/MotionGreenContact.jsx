import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const MotionGreenContact = () => {
    const { contact } = useSettings();

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen pt-40 pb-48 px-6 bg-[#F8FAF9]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="h-[2px] w-12 bg-[#7FBFA6]"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7FBFA6]">Connect with us</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-[#1A1A1A] tracking-tighter leading-none uppercase">Get in <br/><span className="text-[#7FBFA6]">Touch</span></h1>
                        <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-sm">We'd love to hear from you. Whether you have questions about our latest collection or need assistance with an order, our team is here to help.</p>
                    </div>

                    <div className="space-y-8 pt-8">
                        <div className="flex items-center gap-6 group">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#7FBFA6] shadow-xl group-hover:bg-[#7FBFA6] group-hover:text-white transition-all cursor-default">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Phone</h4>
                                <p className="text-lg font-bold text-[#1A1A1A]">{contact?.phone || "+91-123456789"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#7FBFA6] shadow-xl group-hover:bg-[#7FBFA6] group-hover:text-white transition-all cursor-default">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email</h4>
                                <p className="text-lg font-bold text-[#1A1A1A]">{contact?.email || "hello@darain.com"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#7FBFA6] shadow-xl group-hover:bg-[#7FBFA6] group-hover:text-white transition-all cursor-default">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Boutique Address</h4>
                                <p className="text-sm font-bold text-[#1A1A1A] max-w-[200px] leading-relaxed uppercase">{contact?.address || "Mumbai, Maharashtra, India"}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                    className="relative rounded-[60px] overflow-hidden aspect-[4/5] bg-[#EEF5F2] shadow-2xl"
                >
                    <img src="https://images.unsplash.com/photo-1594235412402-b1cd9697d82f?auto=format&fit=crop&q=80&w=1500" className="w-full h-full object-cover mix-blend-multiply opacity-80" alt="Contact" />
                    <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black/20 to-transparent">
                        <div className="bg-white/90 backdrop-blur p-12 rounded-[50px] space-y-4">
                            <h3 className="text-xl font-black tracking-tight text-[#1A1A1A] uppercase">Opening Hours</h3>
                            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-2">
                                <span>Mon - Sat</span>
                                <span className="text-[#7FBFA6]">{contact?.business_hours || "10am - 9pm"}</span>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Instagram size={18} className="text-gray-400 hover:text-[#7FBFA6] cursor-pointer transition-colors" />
                                <Facebook size={18} className="text-gray-400 hover:text-[#7FBFA6] cursor-pointer transition-colors" />
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default MotionGreenContact;
