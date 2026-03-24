import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

const ExploreCollections = () => {

const categories = [
{ name: "Children's Abaya", path: "/collections/childrens-abaya" },
{ name: "Gloves & Socks", path: "/collections/gloves-socks" },
{ name: "Niqab", path: "/collections/niqab" },
{ name: "Premium Abaya", path: "/collections/premium-abaya" },
{ name: "Scarf", path: "/collections/scarf" },
{ name: "Standard Abaya", path: "/collections/standard-abaya" }
];

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


{/* Buttons Row */}
<div className="flex flex-wrap items-center justify-center gap-3">

{categories.map((cat,index)=>(
<Link
key={index}
to={cat.path}
className="px-5 py-2 text-sm rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-[#2F468C] hover:text-white hover:border-[#2F468C] transition"
>
{cat.name}
</Link>
))}


{/* Shop All Button */}
<Link
to="/collections"
className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#2F468C] text-white text-sm shadow hover:bg-[#24366E] transition"
>
<ShoppingBag size={16}/>
Shop All Products
</Link>

</div>

</div>

</section>

);

};

export default ExploreCollections;