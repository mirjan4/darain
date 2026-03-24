import React from 'react';
import { MapPin, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Contact = () => {
    const { phone, whatsapp, email, address, business_hours, map_embed_url } = useSettings();

    const waLink = whatsapp
        ? `https://api.whatsapp.com/send/?phone=${whatsapp.replace(/\D/g, '')}`
        : 'https://api.whatsapp.com/send/?phone=916238186495';

    // Safely extract the src if a full iframe tag was accidentally saved to the database
    let safeMapUrl = map_embed_url;
    if (safeMapUrl && safeMapUrl.startsWith('<iframe')) {
        const match = safeMapUrl.match(/src=["']([^"']+)["']/);
        if (match) safeMapUrl = match[1];
    }

    return (
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
                    {safeMapUrl ? (
                        <iframe
                            src={safeMapUrl}
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
    );
};

export default Contact;
