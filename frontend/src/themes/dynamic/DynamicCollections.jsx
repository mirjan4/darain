import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts, getCategories } from '../../utils/api';
import DynamicProductCard from './DynamicProductCard';
import { ChevronRight, Filter, LayoutGrid, List, Sparkles } from 'lucide-react';

const DynamicCollections = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(category || 'All');

    const [filters, setFilters] = useState(["All"]);

    useEffect(() => {
        const loadCollections = async () => {
            setLoading(true);
            try {
                const [pRes, cRes] = await Promise.all([getProducts(), getCategories()]);
                const prods = pRes.data || [];
                const cats = cRes.data || [];
                
                setFilters(["All", ...cats.map(c => c.name)]);
                
                // Filtering logic
                const filtered = prods.filter(product => {
                    if (activeFilter === 'All') return true;
                    
                    const pCat = (product.category_name || product.category || '').toUpperCase();
                    const fUpper = activeFilter.toUpperCase();
                    const fSlug = activeFilter.replace(/-/g, ' ').toUpperCase();
                    
                    return pCat === fUpper || pCat === fSlug;
                });
                
                setProducts(filtered);
            } catch (error) {
                console.error("Error fetching dynamic collection:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCollections();
    }, [activeFilter, category]);

    return (
        <div className="min-h-screen bg-white pb-32 font-sans overflow-hidden">
            
            {/* 1. Header Hero Page Banner Section */}
            <div className="relative h-[450px] w-full bg-[#1a1a1a] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                     <img 
                        src="https://images.unsplash.com/photo-1583391733924-46c59d997f76?auto=format&fit=crop&q=80&w=1500" 
                        className="w-full h-full object-cover transition-transform duration-[4000ms] scale-110" 
                        alt="Banner" 
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#2F468C]/30 to-black/60"></div>
                
                <div className="relative z-10 space-y-6" data-aos="fade-up">
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Curated Boutique</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black font-outfit text-white tracking-tighter leading-tight drop-shadow-md">
                        {activeFilter === 'All' ? 'Our Collections' : activeFilter}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-[#2F468C]/80 font-outfit">
                        <Link to="/" className="text-white hover:text-[#2F468C] transition-colors">Home</Link>
                        <ChevronRight size={14} className="text-white/20" />
                        <span className="text-white/40">Collections</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 -mt-16 relative z-20">
                {/* 2. Filter Sub-Header Bar Control View */}
                <div className="bg-white rounded-[32px] shadow-2xl shadow-black/5 p-4 md:p-6 mb-16 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-gray-100">
                    <div className="flex flex-wrap items-center gap-3">
                        {filters.map(f => (
                            <button 
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-6 py-3 rounded-full text-[10px] font-black font-outfit uppercase tracking-widest transition-all duration-500 border-2 ${activeFilter === f ? 'bg-[#2F468C] border-[#2F468C] text-white shadow-lg shadow-[#2F468C]/20 scale-105' : 'bg-gray-50 border-gray-50 text-gray-400 hover:border-gray-200 hover:bg-white'}`}
                            >
                                {f.charAt(0) + f.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 px-4 pt-4 lg:pt-0 lg:border-l border-gray-100 font-outfit">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{products.length} Products Found</span>
                         <div className="h-6 w-[1.5px] bg-gray-100 mx-2"></div>
                         <button className="text-gray-900 flex items-center gap-2 hover:text-[#2F468C] transition-colors"><LayoutGrid size={18} /></button>
                         <button className="text-gray-300 flex items-center gap-2 hover:text-[#2F468C] transition-colors"><List size={18} /></button>
                    </div>
                </div>

                {/* 3. Product Results Page List Display Segment */}
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="space-y-6 animate-pulse">
                                <div className="aspect-[3/4] bg-gray-50 rounded-[40px]" />
                                <div className="h-4 bg-gray-50 w-3/4 rounded-full" />
                                <div className="h-6 bg-gray-50 w-1/2 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-40 text-center flex flex-col items-center gap-6" data-aos="fade-up">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <Filter size={40} strokeWidth={1} />
                        </div>
                        <h2 className="text-3xl font-black font-outfit text-gray-900 tracking-tight">No items found matching your filter</h2>
                        <button onClick={() => setActiveFilter('All')} className="text-xs font-black font-outfit uppercase tracking-widest text-[#2F468C] border-b-2 border-[#2F468C] pb-1 hover:text-gray-900 hover:border-gray-900 transition-all">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-16">
                        {products.map((product, idx) => (
                            <div key={product.id} data-aos="fade-up" data-aos-delay={idx * 50}>
                                <DynamicProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}

                {/* 4. Infinite Scroll / Discovery Pagination Bottom Control View */}
                {!loading && products.length > 0 && (
                    <div className="mt-32 pt-20 border-t border-gray-50 flex flex-col items-center gap-8" data-aos="fade-up">
                         <div className="relative group">
                            <Sparkles className="absolute -top-12 left-1/2 -translate-x-1/2 text-[#2F468C] animate-pulse" size={40} strokeWidth={1} />
                            <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 font-outfit">End of catalog reached</p>
                         </div>
                         <h3 className="text-2xl font-black font-outfit text-gray-900 tracking-tighter text-center max-w-lg">Check back soon for new arrivals and restocked favorites.</h3>
                         <Link to="/" className="text-sm font-black uppercase tracking-widest text-gray-900 border-2 border-gray-900 rounded-full px-12 py-5 hover:bg-gray-900 hover:text-white transition-all duration-500 shadow-xl shadow-black/5">Return Home</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DynamicCollections;
