import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
import { getProducts, getCategories } from '../../utils/api';
import ModernProductCard from './ModernProductCard';

const ModernCollections = () => {
    const { category: urlCategory } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);

    const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low"];

    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [sortBy, setSortBy] = useState("Newest");
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    useEffect(() => {
        if (urlCategory) {
            setSelectedCategory(urlCategory); 
        } else {
            setSelectedCategory("All Categories");
        }
    }, [urlCategory]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
                setProducts(prodRes.data || []);
                setCategories(catRes.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching modern collections data:", error);
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        let results = products.filter(product => {
            const term = searchTerm.toLowerCase();
            const matchesSearch = 
                product.name.toLowerCase().includes(term) ||
                (product.product_code || '').toLowerCase().includes(term);

            const productCat = (product.category_name || product.category || '').toUpperCase();
            const selectedUpper = selectedCategory.toUpperCase();
            const selectedAsSlug = selectedCategory.replace(/-/g, ' ').toUpperCase();

            const matchesCategory = selectedCategory === "All Categories" || 
                                   productCat === selectedUpper || 
                                   productCat === selectedAsSlug;
            return matchesSearch && matchesCategory;
        });

        if (sortBy === "Price: Low to High") {
            results.sort((a, b) => (a.offer_price || a.price) - (b.offer_price || b.price));
        } else if (sortBy === "Price: High to Low") {
            results.sort((a, b) => (b.offer_price || b.price) - (a.offer_price || a.price));
        } else {
            // Newest relative fallback (assuming higher ID or newer created_at)
            results.sort((a, b) => (b.id || 0) - (a.id || 0)); 
        }

        setFilteredProducts(results);
    }, [searchTerm, products, sortBy, selectedCategory]);

    const PillButton = ({ label, value, onClick, hasDropdown }) => (
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
        <div className="bg-[#EBEBEB] min-h-screen">
            
            {/* HERO SECTION */}
            <section className="pt-24 pb-16 lg:pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6">
                    {selectedCategory === 'All Categories' ? 'Collections' : selectedCategory}
                </h1>
                <p className="text-gray-800 font-medium text-lg md:text-xl leading-relaxed max-w-3xl">
                    Discover our latest designs thoughtfully curated for elegance, versatility, and everyday comfort. Find your signature modest style.
                </p>
            </section>

            {/* FILTER SECTION */}
            <section className="pb-16 relative z-40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left Filters Group */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 relative w-full md:w-auto">
                        
                        <div className="flex-shrink-0">
                            <PillButton 
                                label="Search" 
                                value={searchTerm ? "Active" : "Catalog"} 
                                onClick={() => {
                                    const t = prompt("Search catalog:");
                                    if(t !== null) setSearchTerm(t);
                                }}
                                hasDropdown={false}
                            />
                        </div>

                        <div className="relative flex-shrink-0 z-[60]">
                            <PillButton 
                                label="Shop Collection" 
                                value={selectedCategory !== 'All Categories' ? selectedCategory : 'All Collections'} 
                                onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowSortDropdown(false); }}
                                hasDropdown={true}
                            />

                            {showCategoryDropdown && (
                                <div className="absolute top-16 left-0 w-56 bg-white border border-gray-100 rounded-3xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2">
                                    <button 
                                        onClick={() => { setSelectedCategory("All Categories"); setShowCategoryDropdown(false); }}
                                        className={`w-full text-left px-6 py-2.5 text-sm transition-colors ${selectedCategory === "All Categories" ? 'font-bold text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50/50'}`}
                                    >
                                        All Collections
                                    </button>
                                    {categories.map(cat => (
                                        <button 
                                            key={cat.id}
                                            onClick={() => { setSelectedCategory(cat.name); setShowCategoryDropdown(false); }}
                                            className={`w-full text-left px-6 py-2.5 text-sm transition-colors ${selectedCategory.toUpperCase() === cat.name.toUpperCase() ? 'font-bold text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50/50'}`}
                                        >
                                            {cat.name.charAt(0) + cat.name.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex-shrink-0">
                            <PillButton 
                                label="Results" 
                                value={`${filteredProducts.length} items`} 
                                hasDropdown={false}
                            />
                        </div>

                    </div>

                    {/* Right Sort Dropdown */}
                    <div className="flex justify-start md:justify-end border-t border-gray-300/30 md:border-0 pt-4 md:pt-0 relative">
                        <PillButton 
                            label="Sort" 
                            value={sortBy} 
                            onClick={() => { setShowSortDropdown(!showSortDropdown); setShowCategoryDropdown(false); }}
                            hasDropdown={true}
                        />
                         {showSortDropdown && (
                            <div className="absolute top-16 right-0 w-48 bg-white border border-gray-100 rounded-3xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2">
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
            </section>

            {/* PRODUCT GRID LISTINGS */}
            <section className="space-y-16">
                
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="animate-pulse space-y-4">
                                <div className="aspect-[4/5] bg-[#DBDBDB] rounded-sm" />
                                <div className="h-4 bg-[#DBDBDB] w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="py-20 text-gray-500 font-medium">
                        <p>No products available matching your criteria.</p>
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="mt-4 text-xs font-bold text-black border-b border-black">
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-4 md:gap-x-6">
                        {filteredProducts.map((product, index) => (
                            <div 
                                key={product.id} 
                                className="animate-in fade-in slide-in-from-bottom-4" 
                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                            >
                                <ModernProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ModernCollections;
