import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Filter } from 'lucide-react';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import { Link } from 'react-router-dom';

const Collections = () => {
    const { category: urlCategory } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    const categories = [
        "All",
        "Children's Abaya",
        "Gloves & Socks",
        "Niqab",
        "Premium Abaya",
        "Scarf",
        "Standard Abaya"
    ];

    useEffect(() => {
        if (urlCategory) {
            const categoryMap = {
                'childrens-abaya': "Children's Abaya",
                'gloves-socks': "Gloves & Socks",
                'niqab': "Niqab",
                'premium-abaya': "Premium Abaya",
                'scarf': "Scarf",
                'standard-abaya': "Standard Abaya"
            };
            const mapped = categoryMap[urlCategory];
            if (mapped) {
                setSelectedCategory(mapped);
            } else {
                setSelectedCategory("All");
            }
        } else {
            setSelectedCategory("All");
        }
    }, [urlCategory]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data);
                setFilteredProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let results = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.product_code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        if (sortBy === "price-low") {
            results.sort((a, b) => (a.offer_price || a.price) - (b.offer_price || b.price));
        } else if (sortBy === "price-high") {
            results.sort((a, b) => (b.offer_price || b.price) - (a.offer_price || a.price));
        } else if (sortBy === "newest") {
            results.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }

        setFilteredProducts(results);
    }, [searchTerm, products, sortBy, selectedCategory]);

    return (
        <div className="pt-0">
            {/* LUXURY HERO HEADER */}
           <div className="relative w-full bg-gradient-to-b from-[#fcfcfc] to-white pt-28 pb-20 lg:pt-36 lg:pb-28 flex flex-col items-center justify-center text-center overflow-hidden border-b border-gray-100">

    <div className="relative z-10 px-6 max-w-3xl mx-auto" data-aos="fade-up">

        {/* Small Label */}
        <span className="text-xs uppercase tracking-[0.35em] text-gray-400 font-semibold block mb-4">
            The Collection
        </span>

        {/* Main Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1e3066] leading-tight mb-6">
            Our Collections
        </h1>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-[#2F468C] mx-auto mb-6"></div>

        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto"><Link to="/">Home</Link>/Products</p>

    </div>

</div>

            {/* BOXED CONTENT */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="pt-8 lg:pt-12  pb-24 min-h-[70vh] bg-white w-full ">

                {/* Filters & Search */}
                <div className=" flex flex-col md:flex-row justify-between items-center border-y border-gray-200 py-6 mb-16 gap-8" data-aos="fade-up" data-aos-delay="100">
                    <div className="relative w-full md:w-80 group border border-gray-200">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2F468C] transition-colors " size={18} />
                        <input 
                            type="text" 
                            placeholder="SEARCH PIECE..." 
                            className="w-full pl-8 pr-4 py-2 bg-transparent focus:outline-none text-[10px] font-bold uppercase tracking-widest placeholder:text-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
                        {/* Category Filter */}
                        <div className="flex items-center space-x-3 border border-gray-200">
                            <Filter size={14} className="text-gray-400" />
                            <select 
                                className="bg-transparent border-none py-2 text-[10px] font-bold uppercase tracking-widest focus:ring-0 outline-none cursor-pointer"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-px h-4 bg-gray-200 hidden md:block"></div>

                        {/* Sort Filter */}
                        <div className="flex items-center space-x-3 border border-gray-200">
                            <SlidersHorizontal size={14} className="text-gray-400" />
                            <select 
                                className="bg-transparent border-none py-2 text-[10px] font-bold uppercase tracking-widest focus:ring-0 outline-none cursor-pointer"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Latest Releases</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="animate-pulse space-y-4">
                                <div className="aspect-[4/5] bg-gray-50 rounded-lg"></div>
                                <div className="h-4 bg-gray-100 w-3/4 mx-auto rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                            {filteredProducts.map((product, index) => (
                                <div key={product.id} className="flex justify-start" data-aos="fade-up" data-aos-delay={(index % 8) * 100}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-40">
                                <p className="text-gray-300 uppercase tracking-[0.4em] font-bold text-xs">No matching designs found in our archive.</p>
                                <button 
                                    onClick={() => {setSearchTerm(""); setSelectedCategory("All"); setSortBy("newest")}}
                                    className="mt-8 text-[#2F468C] border-b border-[#2F468C] font-bold text-[10px] uppercase tracking-widest pb-1 hover:opacity-60 transition-all"
                                >
                                    View Full Catalogue
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    </div>
    );
};

export default Collections;
