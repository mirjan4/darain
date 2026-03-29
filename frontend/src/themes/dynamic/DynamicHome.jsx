import React, { useState, useEffect } from 'react';
import { getProducts, getHeroSlides, UPLOADS_BASE_URL } from '../../utils/api';
import DynamicProductCard from './DynamicProductCard';
import { 
    ChevronRight, 
    ChevronLeft, 
    ArrowRight, 
    ShieldCheck, 
    Truck, 
    CreditCard, 
    Sparkles,
    ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TestimonialsSection from '../../components/TestimonialsSection';
import { useSettings } from '../../context/SettingsContext';

const DynamicHome = () => {
    const [products, setProducts] = useState([]);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const { settings } = useSettings();
    const slideSpeed = parseInt(settings?.slider_interval) || 8000;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, slideRes] = await Promise.all([
                    getProducts(),
                    getHeroSlides()
                ]);
                const productsArray = prodRes.data || [];
                setProducts(productsArray);
                // Handle both {data:[...]} and {data:{data:[...]}} structures
                const slideData = slideRes.data?.data || slideRes.data || [];
                const slidesArray = Array.isArray(slideData) ? slideData : [];
                setSlides(slidesArray);
                
                console.log(`DynamicHome Loaded: ${productsArray.length} products, ${slidesArray.length} slides`);
            } catch (error) {
                console.error("DynamicHome Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getLatestImageFor = (categoryName) => {
        if (!products || products.length === 0 || !Array.isArray(products)) return null;
        
        // Match case-insensitively against name or category
        const search = categoryName.toUpperCase();
        const matchingProduct = products.find(p => {
             const pCat = (p.category_name || p.category || '').toUpperCase();
             return pCat === search || (p.name && p.name.toUpperCase().includes(search));
        });

        const imgPath = matchingProduct?.main_image || matchingProduct?.image;
        if (imgPath) return `${UPLOADS_BASE_URL}/${imgPath}`;
        
        // Fallbacks for empty categories
        const fallbacks = {
            'PREMIUM ABAYA': 'https://images.unsplash.com/photo-1583391733924-46c59d997f76?auto=format&fit=crop&q=80&w=800',
            'STANDARD ABAYA': 'https://images.unsplash.com/photo-1594235412402-b1cd9697d82f?auto=format&fit=crop&q=80&w=800',
            'MADRASA ABAYA': 'https://images.unsplash.com/photo-1606161741793-1389c926bc5a?auto=format&fit=crop&q=80&w=800',
            'NIQAB': 'https://images.unsplash.com/photo-1620786938953-ad98a96e987c?auto=format&fit=crop&q=80&w=800',
            'GLOVES & SOCKS': 'https://images.unsplash.com/photo-1581404196944-59e38f6b0bda?auto=format&fit=crop&q=80&w=800'
        };
        return fallbacks[search] || 'https://images.unsplash.com/photo-1583391733924-46c59d997f76?auto=format&fit=crop&q=80&w=800';
    };

    const categoriesData = [
        { name: "Premium Abaya",  slug: "premium-abaya" },
        { name: "Standard Abaya", slug: "standard-abaya" },
        { name: "Madrasa Abaya",  slug: "madrasa-abaya" },
        { name: "Scarf",          slug: "scarf" },
        { name: "Niqab",          slug: "niqab" },
        { name: "Gloves & Socks", slug: "gloves-socks" },
    ];

    const currentSlide = slides[activeSlideIndex] || {
        title: "Elegance defined by Modesty",
        description: "Discover the new season's collection featuring premium fabrics and timeless designs tailored for the modern woman.",
        button_text: "Discover Now"
    };

    const nextSlide = () => setActiveSlideIndex((prev) => (prev + 1) % (slides.length || 1));
    const prevSlide = () => setActiveSlideIndex((prev) => (prev - 1 + (slides.length || 1)) % (slides.length || 1));

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(nextSlide, slideSpeed);
        return () => clearInterval(interval);
    }, [slides.length, slideSpeed]);

    return (
        <div className="flex flex-col gap-24 pb-24 font-sans overflow-hidden">
            
            {/* 1. SHOPPY HERO HERO SLIDER SECTION */}
            <section className="relative h-[85vh] md:h-[92vh] w-full overflow-hidden bg-black flex flex-col justify-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    {slides.length > 0 && slides.map((slide, idx) => (
                        <div 
                            key={slide.id || idx}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${idx === activeSlideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                        >
                             {slide.image ? (
                                <img 
                                    src={`${UPLOADS_BASE_URL}/${slide.image}`} 
                                    className="w-full h-full object-cover"
                                    alt={slide.title}
                                />
                             ) : (
                                <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                                    <Sparkles className="text-white/10" size={100} />
                                </div>
                             )}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                        </div>
                    ))}
                    {slides.length === 0 && (
                        <div className="absolute inset-0 bg-[#2F468C]/20 flex items-center justify-center">
                            <Sparkles className="text-white/20 animate-pulse" size={100} />
                        </div>
                    )}
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full">
                    <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
                        <div className="flex items-center gap-4 group cursor-default">
                           <span className="h-[2px] w-12 bg-[#2F468C] transition-all group-hover:w-20"></span>
                           <span className="text-xs font-black uppercase tracking-[0.4em] text-white/80">Premium Modest Wear</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-outfit text-white tracking-tighter leading-[0.9] drop-shadow-sm">
                           {currentSlide.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/70 font-medium leading-relaxed max-w-xl font-outfit">
                           {currentSlide.description || currentSlide.subtitle}
                        </p>
                        <div className="pt-6 flex flex-col sm:flex-row gap-5 font-outfit">
                            <Link to="/collections" className="group bg-white text-black px-12 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:bg-[#2F468C] hover:text-white transition-all duration-500 flex items-center justify-center gap-3 active:scale-95">
                                {currentSlide.button_text || "Shop Now"}
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                            </Link>
                            <Link to="/about" className="group border-2 border-white/20 text-white backdrop-blur-md px-12 py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white transition-all duration-500 flex items-center justify-center gap-3">
                                View Lookbook
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Slider Navigation Controls (Desktop) */}
                {slides.length > 1 && (
                    <div className="absolute bottom-12 right-12 z-20 flex gap-4">
                        <button onClick={prevSlide} className="w-14 h-14 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 border border-white/10 active:scale-90 shadow-xl">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextSlide} className="w-14 h-14 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 border border-white/10 active:scale-90 shadow-xl">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </section>

            {/* 2. FEATURED COLLECTIONS (Storytelling Segments) */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-12 w-full overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16" data-aos="fade-up">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3"><span className="w-8 h-[2px] bg-[#2F468C]"></span><span className="text-[10px] font-black uppercase tracking-widest text-[#2F468C]">Categories</span></div>
                        <h2 className="text-3xl md:text-4xl font-black font-outfit tracking-tighter text-gray-900 leading-none">Curated Collections</h2>
                    </div>
                    <Link to="/collections" className="text-xs font-black font-outfit uppercase tracking-widest text-gray-400 hover:text-gray-900 border-b-2 border-transparent hover:border-[#2F468C] transition-all pb-1 flex items-center gap-2 group">
                        Browse all categories <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {categoriesData.map((cat, idx) => (
                        <Link 
                            key={cat.slug}
                            to={`/collections/${cat.slug}`}
                            className="group block relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm shadow-black/5"
                            data-aos="zoom-in"
                            data-aos-delay={idx * 100}
                        >
                            <img src={getLatestImageFor(cat.name)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={cat.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                            <div className="absolute bottom-10 left-10 right-10 flex flex-col items-center">
                                <h3 className="text-2xl font-black font-outfit text-white tracking-tight">{cat.name}</h3>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mt-2 opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-1">View Shop</span>
                                <div className="mt-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 scale-0 group-hover:scale-100 transition-all duration-300">
                                    <ShoppingBag size={18} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. TRENDING PRODUCTS GRID */}
            <section className="bg-[#F4EDE4]/50 py-32 w-full overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                   <div className="flex flex-col items-center space-y-4 mb-20 text-center" data-aos="fade-up">
                        <div className="flex items-center gap-3"><span className="w-8 h-[2px] bg-[#2F468C]"></span><span className="text-[10px] font-black uppercase tracking-widest text-[#2F468C]">Most Wanted</span><span className="w-8 h-[2px] bg-[#2F468C]"></span></div>
                        <h2 className="text-3xl md:text-5xl font-black font-outfit tracking-tighter text-gray-900 leading-none">New Releases</h2>
                        <p className="text-gray-400 text-sm font-bold tracking-tight font-outfit">Our latest design curated for the current season.</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="space-y-6 animate-pulse">
                                    <div className="aspect-[3/4] bg-gray-200 rounded-3xl" />
                                    <div className="h-4 bg-gray-200 w-3/4 rounded-full" />
                                    <div className="h-6 bg-gray-200 w-1/2 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                            {products.slice(0, 8).map((product, idx) => (
                                <div key={product.id} data-aos="fade-up" data-aos-delay={idx * 100}>
                                    <DynamicProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-24 flex justify-center" data-aos="fade-up">
                        <Link to="/collections" className="group inline-flex items-center gap-5 bg-gray-900 text-white px-14 py-6 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-[#2F468C] transition-all hover:-translate-y-1 active:scale-95 duration-500">
                           Explore Full Catalog
                           <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. PREMIUM TESTIMONIALS SECTION (REPLACED PHILOSOPHY) */}
            <TestimonialsSection />

            {/* 5. DYNAMIC FEATURE HIGHLIGHTS */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-12 w-full py-20 bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden" data-aos="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="flex flex-col items-center text-center gap-6 group hover:scale-105 transition-transform duration-500">
                        <div className="w-20 h-20 bg-[#2F468C]/5 rounded-[30px] flex items-center justify-center text-[#2F468C] group-hover:bg-[#2F468C] group-hover:text-white transition-all duration-700 shadow-sm">
                            <ShieldCheck size={32} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 font-outfit">Premium Quality</h4>
                            <p className="text-xs font-bold text-gray-400 tracking-tight font-outfit">Finest fabrics sourced globally for durability.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-6 pt-16 md:pt-0 group hover:scale-105 transition-transform duration-500">
                        <div className="w-20 h-20 bg-[#2F468C]/5 rounded-[30px] flex items-center justify-center text-[#2F468C] group-hover:bg-[#2F468C] group-hover:text-white transition-all duration-700 shadow-sm">
                            <Truck size={32} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 font-outfit">Fast Delivery</h4>
                            <p className="text-xs font-bold text-gray-400 tracking-tight font-outfit">Fast pan-india shipping within 3-5 days.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-6 pt-16 md:pt-0 group hover:scale-105 transition-transform duration-500">
                        <div className="w-20 h-20 bg-[#2F468C]/5 rounded-[30px] flex items-center justify-center text-[#2F468C] group-hover:bg-[#2F468C] group-hover:text-white transition-all duration-700 shadow-sm">
                            <CreditCard size={32} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 font-outfit">Secure Payment</h4>
                            <p className="text-xs font-bold text-gray-400 tracking-tight font-outfit">100% encrypted & safe payment gateways.</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default DynamicHome;
