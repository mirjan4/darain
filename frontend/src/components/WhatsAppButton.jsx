import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const WhatsAppButton = () => {
    const { whatsapp } = useSettings();
    const phoneNumber = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent("Hello! I'm interested in your Abaya collections.")}`;

    return (
        <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-[100] bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
            title="Chat with us"
        >
            <div className="relative">
                <MessageCircle size={28} />
                <span className="absolute right-full mr-3 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg premium-shadow">
                    How can we help?
                </span>
            </div>
        </a>
    );
};

export default WhatsAppButton;
