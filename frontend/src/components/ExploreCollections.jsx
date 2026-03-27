import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { getCategories } from "../utils/api";

const ExploreCollections = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data))
            .catch(() => {
                // Fallback to static list if API fails
                setCategories([
                    { name: "PREMIUM ABAYA",   slug: "premium-abaya" },
                    { name: "STANDARD ABAYA",  slug: "standard-abaya" },
                    { name: "MADRASA ABAYA",   slug: "madrasa-abaya" },
                    { name: "SCARF",           slug: "scarf" },
                    { name: "NIQAB",           slug: "niqab" },
                    { name: "GLOVES & SOCKS",  slug: "gloves-socks" },
                ]);
            });
    }, []);

    // Pretty-print: "PREMIUM ABAYA" → "Premium Abaya"
    const toTitle = (str) =>
        str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    return (
        <section className="py-12 bg-white border-t border-gray-200 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6">

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#2F468C]">
                        Explore Our Collections
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Discover our complete range of modest wear and accessories
                    </p>
                </div>

                {/* Category Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id || cat.slug}
                            to={`/collections/${cat.slug}`}
                            className="px-5 py-2 text-sm rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-[#2F468C] hover:text-white hover:border-[#2F468C] transition"
                        >
                            {toTitle(cat.name)}
                        </Link>
                    ))}

                    {/* Shop All */}
                    <Link
                        to="/collections"
                        className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#2F468C] text-white text-sm shadow hover:bg-[#24366E] transition"
                    >
                        <ShoppingBag size={16} />
                        Shop All Products
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default ExploreCollections;