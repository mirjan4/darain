import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronRight, Grid, LayoutGrid, Search, ShoppingBag } from 'lucide-react';
import { getProducts, getCategories } from '../../utils/api';
import MotionGreenProductCard from './MotionGreenProductCard';

const MotionGreenCollections = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (category) {
            setActiveFilter(category);
        } else {
            setActiveFilter('All');
        }
    }, [category]);

    useEffect(() => {
        const loadCollectionData = async () => {
            setLoading(true);
            try {
                const [pRes, cRes] = await Promise.all([getProducts(), getCategories()]);
                setProducts(pRes.data || []);
                setCategories(cRes.data || []);
            } catch (err) {
                console.error("Collection Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadCollectionData();
    }, []);

    useEffect(() => {
        let results = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (product.product_code || '').toLowerCase().includes(searchTerm.toLowerCase());
            
            if (activeFilter === 'All') return matchesSearch;

            // Normalized matching like we did in fixed pages
            const pCat = (product.category_name || product.category || '').toUpperCase();
            const fUpper = activeFilter.toUpperCase();
            const fSlug = activeFilter.replace(/-/g, ' ').toUpperCase();

            const matchesCategory = pCat === fUpper || pCat === fSlug;
            return matchesSearch && matchesCategory;
        });
        setFilteredProducts(results);
    }, [activeFilter, products, searchTerm]);

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] pb-48 font-outfit overflow-hidden">
            
            {/* 1. MINIMAL HEADER SECTION */}
            <div className="relative pt-32 pb-24 px-6 md:px-12 text-center max-w-4xl mx-auto space-y-6">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center gap-4 text-[#7FBFA6] py-1 px-4 bg-[#EEF5F2] rounded-full text-[10px] font-black uppercase tracking-[0.2em] w-fit mx-auto border border-white"
                >
                    <ShoppingBag size={14} /> Refined Selection
                </motion.div>
                
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl md:text-8xl font-black text-[#1A1A1A] tracking-tighter uppercase leading-none"
                >
                    {activeFilter === 'All' ? 'OUR COLLECTIONS' : activeFilter.replace(/-/g, ' ')}
                </motion.h1>

                <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-300">
                    <Link to="/" className="hover:text-black">HOME</Link>
                    <ChevronRight size={14} className="opacity-40" />
                    <span className="text-[#7FBFA6]">{activeFilter.toUpperCase()}</span>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                
                {/* 2. FILTER & SEARCH CONTROL BAR */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 p-8 rounded-[40px] bg-white shadow-2xl shadow-black/5 border border-[#EEF5F2] transition-all hover:shadow-black/10">
                    
                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {['All', ...categories.map(c => c.name)].map(f => (
                            <button 
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-6 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 border-2 ${activeFilter.toUpperCase() === f.toUpperCase() ? 'bg-[#7FBFA6] border-[#7FBFA6] text-white shadow-lg shadow-[#7FBFA6]/20' : 'bg-[#F8FAF9] border-[#F8FAF9] text-gray-400 hover:border-gray-200 hover:text-gray-600'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Search Field */}
                    <div className="relative group w-full md:w-[300px]">
                        <input 
                            type="text" 
                            placeholder="SEARCH CATALOG..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#F8FAF9] border-2 border-transparent focus:border-[#7FBFA6] px-6 py-3.5 pl-14 rounded-full text-[10px] font-black uppercase tracking-[0.1em] text-gray-900 outline-none transition-all placeholder:text-gray-300"
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#7FBFA6] transition-colors" size={16} />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* 3. PRODUCT GRID WITH STAGGER MOTION */}
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="space-y-6 animate-pulse">
                                <div className="aspect-[3/4] bg-white rounded-[50px]" />
                                <div className="h-4 bg-white/60 w-3/4 rounded-full" />
                                <div className="h-4 bg-white/40 w-1/2 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <motion.div 
                        initial="hidden" animate="visible" variants={fadeUp}
                        className="py-40 text-center flex flex-col items-center gap-8"
                    >
                        <div className="w-32 h-32 bg-[#EEF5F2] rounded-full flex items-center justify-center text-[#7FBFA6]">
                            <Filter size={48} strokeWidth={1} />
                        </div>
                        <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tighter">No designs found matching your selection</h2>
                        <button onClick={() => { setActiveFilter('All'); setSearchTerm(""); }} className="bg-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-black hover:text-white transition-all shadow-xl shadow-black/5">Reset Filters</button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 md:gap-x-12 md:gap-y-24">
                        {filteredProducts.map((product, idx) => (
                            <MotionGreenProductCard key={product.id} product={product} index={idx % 4} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default MotionGreenCollections;
