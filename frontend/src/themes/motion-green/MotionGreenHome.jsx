import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, ChevronRight, ShoppingBag, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { getProducts, getHeroSlides, getCategories, UPLOADS_BASE_URL } from '../../utils/api';
import MotionGreenProductCard from './MotionGreenProductCard';
import TestimonialsSection from '../../components/TestimonialsSection';
import { useSettings } from '../../context/SettingsContext';

const MotionGreenHome = () => {
    const [products, setProducts] = useState([]);
    const [slides, setSlides] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    const { settings } = useSettings();
    const slideSpeed = parseInt(settings?.slider_interval) || 7000;
    
    // Scroll Hooks for Advanced Animations
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scaleHero = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
    const rotateHero = useTransform(scrollYProgress, [0, 1], [0, 5]);

    // Section 3 Scroll Transform
    const collectionRef = useRef(null);
    const { scrollYProgress: collectionSroll } = useScroll({ target: collectionRef, offset: ["start end", "end start"] });
    const collectionScale = useTransform(collectionSroll, [0, 0.5], [0.8, 1]);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const [pRes, sRes, cRes] = await Promise.all([getProducts(), getHeroSlides(), getCategories()]);
                setProducts(pRes.data || []);
                const slideData = sRes.data?.data || sRes.data || [];
                setSlides(slideData);
                const categoryData = cRes.data?.data || cRes.data || [];
                const sortedCats = Array.isArray(categoryData) ? [...categoryData].sort((a, b) => {
                    const order = ["PREMIUM ABAYA", "STANDARD ABAYA"];
                    const aIndex = order.indexOf(a.name.toUpperCase());
                    const bIndex = order.indexOf(b.name.toUpperCase());
                    
                    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                    if (aIndex !== -1) return -1;
                    if (bIndex !== -1) return 1;
                    return 0; // Keep the rest in their original (likely latest ID) order
                }) : [];
                setCategories(sortedCats);
            } catch (err) {
                console.error("Home load failed", err);
            } finally {
                setLoading(false);
            }
        };
        loadHomeData();
    }, []);

    const nextSlide = () => setActiveSlideIndex(prev => (prev + 1) % (slides.length || 1));

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(nextSlide, slideSpeed);
        return () => clearInterval(timer);
    }, [slides.length, slideSpeed]);

    // Hero Image Logic (Current Active Slide)
    const currentSlide = slides[activeSlideIndex] || (slides.length > 0 ? slides[0] : null);
    const heroImage = currentSlide?.image 
        ? `${UPLOADS_BASE_URL}/${currentSlide.image}`
        : "https://images.unsplash.com/photo-1583391733924-46c59d997f76?auto=format&fit=crop&q=80&w=1500";

    // Animation Variants
    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const staggerContainer = {
        visible: { 
            transition: { staggerChildren: 0.1 } 
        }
    };

    return (
        <div className="space-y-32 md:space-y-48 pb-48 overflow-hidden">
            
            {/* 1. HERO SECTION - MOTION LUXURY */}
            <section ref={heroRef} className="relative h-screen min-h-[700px] w-full bg-[#F8FAF9] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
                <motion.div style={{ y: yHero }} className="absolute inset-0 opacity-10 pointer-events-none">
                   <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7FBFA6] rounded-full blur-[160px] animate-pulse"></div>
                   <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#EEF5F2] rounded-full blur-[140px] animate-pulse delay-1000"></div>
                </motion.div>
                
                <motion.div style={{ y: yHero, opacity: opacityHero, scale: scaleHero }} className="max-w-[1440px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center z-10">
                    <div className="space-y-8 md:space-y-12 order-2 lg:order-1">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeSlideIndex}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 group">
                                    <span className="h-[2px] w-12 bg-[#7FBFA6] transition-all group-hover:w-20 duration-700"></span>
                                    <span className="text-xs font-black uppercase tracking-[0.4em] text-[#7FBFA6]">{currentSlide?.subtitle || "EST. 2024 COLLECTION"}</span>
                                </div>
                                
                                <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter text-[#1A1A1A] leading-[0.95] md:leading-[0.9] uppercase">
                                    {currentSlide?.title ? currentSlide.title.split(' ')[0] : 'SEAMLESS'} <br/>
                                    <span className="text-[#7FBFA6]">{currentSlide?.title ? currentSlide.title.split(' ').slice(1).join(' ') : 'ELEGANCE'}</span>
                                </h1>
                                
                                <p className="text-base md:text-2xl text-gray-500 max-w-lg font-medium tracking-tight">
                                    {currentSlide?.description || 'Experience the future of modest luxury. Soft fabrics, fluid motion, and timeless designs curated for the modern woman.'}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <Link to="/collections" className="group relative bg-[#7FBFA6] text-white px-8 md:px-12 py-5 md:py-6 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#7FBFA6]/30 overflow-hidden text-center">
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    DISCOVER NOW <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                                </span>
                                <div className="absolute inset-0 bg-[#6FAE95] translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-full" />
                            </Link>
                            <Link to="/about" className="group px-8 md:px-12 py-5 md:py-6 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border border-gray-200 text-gray-500 hover:text-[#1A1A1A] hover:bg-white transition-all text-center">
                                OUR CRAFT
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div style={{ rotate: rotateHero }} className="relative order-1 lg:order-2 h-[400px] md:h-[600px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeSlideIndex}
                                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full h-full relative"
                            >
                                <img 
                                    src={heroImage} 
                                    className="w-full h-full object-cover rounded-[40px] md:rounded-[60px] shadow-2xl shadow-black/5" 
                                    alt="Hero" 
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1583391733924-46c59d997f76?auto=format&fit=crop&q=80&w=1500"; }}
                                />
                                <div className="absolute -bottom-6 -left-4 md:-bottom-10 md:-left-10 bg-white p-5 md:p-8 rounded-[30px] md:rounded-[40px] shadow-2xl border border-gray-50 max-w-[150px] md:max-w-[200px] space-y-2 md:space-y-3">
                                    <div className="p-2 w-8 h-8 md:w-10 md:h-10 bg-[#EEF5F2] text-[#7FBFA6] rounded-xl md:rounded-2xl flex items-center justify-center"><Sparkles size={16}/></div>
                                    <h4 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-[#1A1A1A] leading-tight">
                                        {currentSlide?.title ? currentSlide.title.split(' ')[0] : 'CURATED SILK'}
                                    </h4>
                                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-relaxed">
                                        {currentSlide?.subtitle || "Handpicked premium fabrics."}
                                    </p>
                                </div>
                                <div className="absolute inset-0 rounded-[40px] md:rounded-[60px] border border-white/20"></div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* SCROLL INDICATOR */}
                <motion.div 
                    style={{ opacity: opacityHero }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hidden md:flex"
                >
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 rotate-90 origin-left translate-x-1 mb-10 whitespace-nowrap">SCROLL TO DISCOVER</span>
                    <div className="w-[1px] h-20 bg-gradient-to-b from-[#7FBFA6] to-transparent"></div>
                </motion.div>
            </section>

            {/* 2. CATEGORY TILES - SOFT GREEN BREEZE */}
            <section className="max-w-[1440px] mx-auto px-6">
                <motion.div 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3"><span className="w-8 h-[2px] bg-[#7FBFA6]"></span><span className="text-[10px] font-black uppercase tracking-widest text-[#7FBFA6]">Our Universe</span></div>
                        <h2 className="text-4xl md:text-6xl font-black font-outfit tracking-tighter text-[#1A1A1A]">Select Your Style</h2>
                    </div>
                    <Link to="/collections" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#7FBFA6] flex items-center gap-2 group transition-all">
                        Browse all <ChevronRight size={16} className="transition-transform group-hover:translate-x-2" />
                    </Link>
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {categories.slice(0, 4).map((cat, idx) => {
                        const product = products.find(p => (p.category_name || p.category || '').toUpperCase() === cat.name.toUpperCase());
                        const catImg = product ? `${UPLOADS_BASE_URL}/${product.main_image}` : null;
                        return (
                            <motion.div 
                                key={cat.name}
                                variants={fadeUp}
                                whileHover={{ y: -10 }}
                                className="group relative h-[450px] rounded-[50px] overflow-hidden bg-[#EEF5F2] shadow-xl hover:shadow-[#7FBFA6]/10 transition-all duration-500"
                            >
                                <Link to={`/collections/${cat.name}`} className="block h-full relative">
                                    {catImg ? (
                                        <img 
                                            src={catImg} 
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                                            alt={cat.name} 
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                            <Sparkles size={100} className="text-[#7FBFA6]" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60 transition-opacity duration-1000 opacity-60 group-hover:opacity-80"></div>
                                    <div className="absolute inset-0 p-12 flex flex-col justify-end items-center text-center space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7FBFA6] opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-700">Explore Collection</span>
                                        <h3 className="text-2xl font-black tracking-tight text-white uppercase">{cat.name}</h3>
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#7FBFA6] scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* 3. NEW ARRIVALS - STAGGER MOTION */}
            <motion.section 
                ref={collectionRef}
                style={{ scale: collectionScale }}
                className="relative bg-[#EEF5F2]/50 py-32 md:py-48 rounded-[80px] md:mx-6 overflow-hidden"
            >
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col items-center space-y-6 mb-24 text-center">
                        <motion.div 
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                            className="flex items-center gap-4 py-2 px-6 rounded-full bg-white text-[#7FBFA6] shadow-sm border border-white/50"
                        >
                            <Sparkles size={16} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Latest Arrivals</span><Sparkles size={16} />
                        </motion.div>
                        <motion.h2 
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                            className="text-4xl md:text-6xl font-black tracking-tighter text-[#1A1A1A]"
                        >
                            Sophisticated Simplicity
                        </motion.h2>
                        <motion.p 
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                            className="text-gray-400 font-medium text-sm md:text-lg tracking-tight max-w-lg"
                        >
                            Every thread tells a story of craftsmanship. Discover our latest creations designed to move with you.
                        </motion.p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="space-y-6 animate-pulse p-4">
                                    <div className="aspect-[3/4] bg-white rounded-[40px]" />
                                    <div className="h-4 bg-white/60 w-3/4 rounded-full mx-auto" />
                                    <div className="h-4 bg-white/40 w-1/2 rounded-full mx-auto" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            initial="hidden" whileInView="visible" viewport={{ once: true }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 md:gap-x-12 md:gap-y-20"
                        >
                            {products.slice(0, 8).map((product, idx) => (
                                <MotionGreenProductCard key={product.id} product={product} index={idx} />
                            ))}
                        </motion.div>
                    )}

                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                        className="mt-32 flex justify-center"
                    >
                        <Link to="/collections" className="group flex items-center gap-6 bg-[#1A1A1A] text-white px-16 py-7 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:bg-[#7FBFA6] transition-all duration-700 shadow-2xl hover:scale-105 active:scale-95">
                           Explore Catalog <ShoppingBag size={18} className="text-[#7FBFA6] group-hover:text-white transition-colors" />
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* 4. PREMIUM TESTIMONIALS SECTION */}
            <TestimonialsSection />

            {/* 5. BRAND VALUES - MINIMAL CARDS */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                    {[
                        { icon: ShieldCheck, title: "AUTHENTIC CRAFT", desc: "Every design is original and manufactured in our dedicated boutique factory." },
                        { icon: Truck, title: "GLOBAL DELIVERY", desc: "Reliable shipping worldwide with specialized care for luxury fabrics." },
                        { icon: CreditCard, title: "SECURE EXPERIENCE", desc: "Seamless and protected multi-currency payment options for global clientele." }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="flex flex-col items-center text-center space-y-6 p-8 rounded-[40px] hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 group"
                        >
                            <div className="w-20 h-20 bg-[#EEF5F2] rounded-[30px] flex items-center justify-center text-[#7FBFA6] group-hover:bg-[#7FBFA6] group-hover:text-white transition-all duration-700 shadow-inner">
                                <item.icon size={32} strokeWidth={1} />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#1A1A1A]">{item.title}</h4>
                                <p className="text-gray-400 font-medium text-xs leading-relaxed max-w-[200px]">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MotionGreenHome;
