import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-[110px] right-8 z-[90] flex flex-col items-center gap-4 group transition-all duration-700 animate-in fade-in slide-in-from-bottom-10"
        >
            {/* The Vertical Button */}
            <div className="bg-[#F4EDE4] text-[#281c15] w-14 py-5 rounded-full flex flex-col items-center justify-center gap-6 shadow-xl shadow-black/5 hover:bg-[#281c15] hover:text-white transition-all duration-500 scale-90 hover:scale-100 group">
                <ArrowUp size={18} className="translate-y-1 group-hover:-translate-y-1 transition-transform duration-500" />
            </div>

            {/* Premium Subtle Pulse for the background */}
            <div className="absolute inset-0 bg-[#F4EDE4]/20 rounded-full scale-125 -z-10 animate-pulse"></div>
        </button>
    );
};

export default ScrollToTop;
