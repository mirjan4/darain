import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import ExploreCollections from '../components/ExploreCollections';
import Contact from '../components/Contact';
import HeroCarousel from '../components/HeroCarousel';
import Features from '../components/Features';


const Home = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const hash = location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.hash, products]); // Re-run when hash or products change

    // Filtered products for specific sections
    const premiumAbayas = products.filter(p => p.category === 'Premium Abaya').slice(0, 4);
    const standardAbayas = products.filter(p => p.category === 'Standard Abaya').slice(0, 4);

    const SectionHeader = ({ subtitle, title, path }) => (
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 border-b border-gray-100 pb-6 gap-6" data-aos="fade-up">
            <div className="space-y-1 text-left">
                <p className="text-[9px] font-bold text-gray-400 tracking-[.3em] uppercase">{subtitle}</p>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#2F468C]">{title}</h2>
            </div>
            <div className="flex justify-start">
                <Link 
                    to={path} 
                    className="px-6 py-2 rounded-full border border-gray-200 text-[#2F468C] font-bold text-[10px] uppercase tracking-widest hover:bg-[#2F468C] hover:text-white transition-all shadow-sm flex items-center gap-2 group"
                >
                    View All
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );

    const ProductShowcaseGrid = ({ items }) => (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {items.map((product, index) => (
                <div key={product.id} className="flex justify-start" data-aos="fade-up" data-aos-delay={index * 100}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(n => (
                <div key={n} className="animate-pulse space-y-4">
                    <div className="aspect-[4/5] bg-gray-50 rounded-lg"></div>
                    <div className="h-4 bg-gray-100 w-3/4 mx-auto rounded"></div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="pt-0">
            {/* HERO CAROUSEL - FULL WIDTH */}
            <HeroCarousel />

            {/* BOXED CONTENT */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* FEATURES SECTION */}
                <Features />

        

            {/* MAIN SHOWCASE CONTENT */}
            <div id="collections" className="py-12 space-y-24">
                
                {/* 1. PREMIUM ABAYA SECTION */}
                <section className="py-8">
                    <SectionHeader 
                        subtitle="Exclusive Collection" 
                        title="Premium Abaya" 
                        path="/collections/premium-abaya" 
                    />
                    {loading ? <LoadingSkeleton /> : <ProductShowcaseGrid items={premiumAbayas} />}
                    {!loading && premiumAbayas.length === 0 && (
                        <p className="text-center text-gray-300 py-10 uppercase tracking-widest text-xs">A new premium collection is being prepared.</p>
                    )}
                </section>

                {/* 2. STANDARD ABAYA SECTION */}
                <section className="py-8">
                    <SectionHeader 
                        subtitle="Exclusive Collection" 
                        title="Standard Abaya" 
                        path="/collections/standard-abaya" 
                    />
                    {loading ? <LoadingSkeleton /> : <ProductShowcaseGrid items={standardAbayas} />}
                    {!loading && standardAbayas.length === 0 && (
                        <p className="text-center text-gray-300 py-10 uppercase tracking-widest text-xs">Standard collections coming back soon.</p>
                    )}
                </section>

            </div>
            
                {/* Explore All Collections */}
                <ExploreCollections />
                
                {/* Contact & Map Section */}
                <Contact />
            </div>
        </div>
    );
};

export default Home;
