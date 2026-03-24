import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { UPLOADS_BASE_URL } from '../utils/api';

const AboutUs = () => {
    const { 
        about_title, 
        about_subtitle, 
        about_description, 
        about_image, 
        logo 
    } = useSettings();

    // Split paragraphs based on double new-lines if content exists
    const paragraphs = about_description 
        ? about_description.split('\n\n') 
        : [
            "Darain Modest Fashion is a dedicated modest wear brand offering beautifully crafted abayas and pardhas for women who value elegance, comfort, and simplicity.",
            "Our collections are thoughtfully designed using premium fabrics and refined tailoring, ensuring a graceful fit suitable for everyday wear as well as special occasions. Each piece reflects our commitment to quality, modesty, and timeless fashion.",
            "At Darain, we believe modest fashion is not just clothing — it is confidence, identity, and effortless grace."
        ];

    return (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <section className="py-40 bg-transparent">
                <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-32">
                    
                    {/* Left Side: Brand Identity Image */}
                    <div className="w-full md:w-auto flex justify-center md:justify-start" data-aos="fade-right">
                        <div className="w-[300px] sm:w-[360px] aspect-[4/5] sm:aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/5 border border-black/5 bg-transparent flex items-center justify-center relative group p-1 transition-all duration-700 hover:shadow-black/10">
                            {about_image ? (
                                <img 
                                    src={`${UPLOADS_BASE_URL}/${about_image}`} 
                                    alt="About Darain" 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            ) : (
                                <div className="p-12 w-full h-full flex items-center justify-center bg-gray-50/30">
                                    {logo && (
                                        <img 
                                            src={`${UPLOADS_BASE_URL}/${logo}`} 
                                            alt="Darain Brand" 
                                            className="w-full h-auto object-contain transition-all duration-700 opacity-60 group-hover:opacity-90 grayscale-[20%] group-hover:grayscale-0 scale-90 group-hover:scale-100"
                                        />
                                    )}
                                </div>
                            )}
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-3xl" />
                        </div>
                    </div>

                    {/* Right Side: Brand Story Content */}
                    <div className="flex-1 text-center md:text-left space-y-8" data-aos="fade-left" data-aos-delay="200">
                        <div className="space-y-4">
                            <span className="text-[9px] font-bold text-gray-400 tracking-[.3em] uppercase block">
                                {about_subtitle || "About Us"}
                            </span>
                            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#2F468C]">
                                {about_title || "Where Modesty Meets Elegance"}
                            </h2>
                        </div>

                        <div className="space-y-6 text-gray-600 font-sans leading-relaxed text-[15px] max-w-2xl mx-auto md:mx-0">
                            {paragraphs.map((p, idx) => (
                                <p key={idx}>
                                    {p}
                                </p>
                            ))}
                        </div>

                        {/* Signet Signature (Optional) */}
                        <div className="pt-4 flex flex-col items-center md:items-start">
                             <div className="h-px w-16 bg-gray-100" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
