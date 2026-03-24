import React, { useState, useEffect } from 'react';
import { getProducts, getHeroSlides } from '../../utils/api';
import ModernProductCard from './ModernProductCard';
import { ChevronDown } from 'lucide-react';

const ModernHome = () => {
    const [products, setProducts] = useState([]);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters state
    const [activeCategory, setActiveCategory] = useState('All Categories');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [sortBy, setSortBy] = useState("Newest");
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, slideRes] = await Promise.all([
                    getProducts(),
                    getHeroSlides()
                ]);
                setProducts(prodRes.data || []);
                setSlides(slideRes.data?.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const categories = [
        "Children's Abaya",
        "Gloves & Socks",
        "Niqab",
        "Premium Abaya",
        "Scarf",
        "Standard Abaya"
    ];

    // Filter logic
    let displayedProducts = [...products];
    if (activeCategory !== 'All Categories') {
        displayedProducts = displayedProducts.filter(p => p.category === activeCategory);
    }

    if (sortBy === "Price: Low to High") {
        displayedProducts.sort((a, b) => (a.offer_price || a.price) - (b.offer_price || b.price));
    } else if (sortBy === "Price: High to Low") {
        displayedProducts.sort((a, b) => (b.offer_price || b.price) - (a.offer_price || a.price));
    } else {
        displayedProducts.sort((a, b) => (b.id || 0) - (a.id || 0)); 
    }

    const activeSlide = slides.length > 0 ? slides[0] : {
        title: "Get Inspired",
        description: "Browsing for your next long-haul trip, everyday journey, or just fancy a look at what's new? From community favourites to about-to-sell-out items, see them all here."
    };

    const PillButton = ({ label, value, onClick, hasDropdown, active }) => (
        <button 
            onClick={onClick}
            className={`flex items-center justify-between px-4 py-2.5 md:px-6 md:py-4 rounded-[32px] bg-white transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-w-[130px] md:min-w-[180px] text-left hover:scale-[1.01]`}
        >
            <div className="flex flex-col md:gap-0.5">
                <span className="text-[8px] md:text-[9px] font-bold text-gray-400">{label}</span>
                <span className="text-xs md:text-sm font-bold text-black tracking-tight leading-tight">{value}</span>
            </div>
            {hasDropdown && (
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50/50 shrink-0 ml-2">
                    <ChevronDown size={10} className="text-gray-500" />
                </div>
            )}
        </button>
    );

    return (
        <div className="bg-[#eaeaea]">
            {/* HERO SECTION */}
            <section 
                className="pt-24 pb-16 lg:pb-24 max-w-4xl"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6">
                    {activeSlide.title}
                </h1>
                <p className="text-gray-800 font-medium text-lg md:text-xl leading-relaxed max-w-3xl">
                    {activeSlide.description || activeSlide.subtitle}
                </p>
            </section>

            {/* FILTER SECTION */}
            <section 
                className="pb-16 relative z-40"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left Filters Group */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 relative w-full md:w-auto">
                        <div className="flex-shrink-0">
                            <PillButton 
                                label="Category" 
                                value="All Categories" 
                                onClick={() => { setActiveCategory('All Categories'); setShowCategoryDropdown(false); }}
                                hasDropdown={false}
                            />
                        </div>

                        <div className="relative flex-shrink-0 z-[60]">
                            <PillButton 
                                label="Shop Collection" 
                                value={activeCategory !== 'All Categories' ? activeCategory : 'All Collections'} 
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                hasDropdown={true}
                            />

                            {showCategoryDropdown && (
                                <div className="absolute top-16 left-0 w-56 bg-white border border-gray-100 rounded-3xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2">
                                    <button 
                                        onClick={() => { setActiveCategory('All Categories'); setShowCategoryDropdown(false); }}
                                        className={`w-full text-left px-6 py-2.5 text-sm transition-colors ${activeCategory === 'All Categories' ? 'font-bold text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50/50'}`}
                                    >
                                        All Collections
                                    </button>
                                    {categories.map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => { setActiveCategory(cat); setShowCategoryDropdown(false); }}
                                            className={`w-full text-left px-6 py-2.5 text-sm transition-colors ${activeCategory === cat ? 'font-bold text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50/50'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative flex-shrink-0 z-[50]">
                            <PillButton 
                                label="Sort & Price" 
                                value={sortBy} 
                                onClick={() => { setShowSortDropdown(!showSortDropdown); setShowCategoryDropdown(false); }}
                                hasDropdown={true}
                            />
                            {showSortDropdown && (
                                <div className="absolute top-16 left-0 w-48 bg-white border border-gray-100 rounded-3xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2">
                                    {sortOptions.map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                                            className={`w-full text-left px-6 py-2.5 text-sm transition-colors ${sortBy === opt ? 'font-bold text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50/50'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sort Dropdown */}
                                                                                                                                
                </div>
            </section>

            {/* PRODUCT GRID LISTINGS */}
            <section 
                className="space-y-16"
                data-aos="fade-up"
                data-aos-delay="300"
            >
                
                {/* Dynamically Filtered View OR General Front Page */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="animate-pulse space-y-4">
                                <div className="aspect-[4/5] bg-[#DBDBDB] rounded-sm" />
                                <div className="h-4 bg-[#DBDBDB] w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : displayedProducts.length === 0 ? (
                    <div className="py-20 text-gray-500 font-medium">
                        <p>No products available matching your criteria.</p>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-4 md:gap-x-6">
                            {displayedProducts.map((product, index) => (
                                <div 
                                    key={product.id} 
                                    className="animate-in fade-in slide-in-from-bottom-4" 
                                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                                >
                                    <ModernProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ModernHome;
