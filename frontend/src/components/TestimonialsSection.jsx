import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Sarah Al-Rashid",
        role: "Verified Customer",
        review: "The quality of the silk abaya I purchased surpassed all my expectations. It feels like a second skin and the drape is simply breathtaking. I've finally found my go-to boutique for modest luxury.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: 2,
        name: "Fatima Zahra",
        role: "Luxury Buyer",
        review: "Darain's attention to detail is remarkable. Every stitch is perfect, and the customer service made me feel like royalty. Truly a premium experience from start to finish.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: 3,
        name: "Aisha Qureshi",
        role: "Fashion Enthusiast",
        review: "I love how they blend traditional modesty with modern aesthetic trends. The 'Dynamic Multi' collection is a masterpiece of storytelling through design. Highly recommended!",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    }
];

const TestimonialsSection = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextTestimonial = () => setIndex((prev) => (prev + 1) % testimonials.length);

    return (
        <section className="bg-[#FAF7F2] py-32 md:py-48 px-6 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-20 left-10 w-64 h-64 bg-[#E8DCCF] rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#E8DCCF] rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-[1440px] mx-auto text-center relative z-10">
                {/* Heading Area */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center gap-6 mb-24"
                >
                    <div className="flex items-center gap-3">
                        <Sparkles size={16} className="text-[#2F468C]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2F468C]">Trusted Feedback</span>
                        <Sparkles size={16} className="text-[#2F468C]" />
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black font-outfit text-gray-900 tracking-tighter leading-none">
                        Loved by Our Customers
                    </h2>
                    <p className="text-gray-500 font-medium text-sm md:text-lg max-w-xl font-outfit">
                        Real experiences from women who trust our modest fashion. Discover why discerning buyers choose Darain.
                    </p>
                </motion.div>

                {/* Testimonial Stack */}
                <div className="relative h-[450px] md:h-[400px] flex items-center justify-center cursor-pointer" onClick={nextTestimonial}>
                    <AnimatePresence mode="popLayout">
                        {testimonials.map((item, i) => {
                            // Calculate position in stack
                            // index is the current active one
                            const position = (i - index + testimonials.length) % testimonials.length;
                            
                            // Only show top 3 cards in stack
                            if (position > 2) return null;

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ 
                                        opacity: 1 - position * 0.3, 
                                        scale: 1 - position * 0.05,
                                        y: position * 40,
                                        zIndex: testimonials.length - position
                                    }}
                                    exit={{ opacity: 0, scale: 0.5, x: -100, transition: { duration: 0.4 } }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute w-full max-w-2xl bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-[#2F468C]/5 border border-white/50 flex flex-col items-center gap-8 md:gap-10"
                                >
                                    {/* Quote Icon */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#2F468C] text-white rounded-2xl flex items-center justify-center shadow-xl shadow-[#2F468C]/20">
                                        <Quote size={20} fill="currentColor" />
                                    </div>

                                    {/* Customer Info */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-gradient-to-tr from-[#2F468C] to-transparent rounded-full blur-sm opacity-30"></div>
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover relative border-2 border-white shadow-lg"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-lg md:text-xl font-black text-gray-900 font-outfit uppercase tracking-tighter">{item.name}</h4>
                                            <span className="text-[10px] font-bold text-[#2F468C] uppercase tracking-[0.2em] bg-[#2F468C]/5 px-3 py-1 rounded-full">{item.role}</span>
                                        </div>
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-gray-600 text-sm md:text-lg italic font-medium leading-relaxed font-outfit text-center max-w-lg">
                                        "{item.review}"
                                    </p>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Progress Indicators */}
                <div className="mt-12 md:mt-24 flex items-center justify-center gap-3">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${index === i ? 'w-12 bg-[#2F468C]' : 'w-3 bg-gray-200 hover:bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
