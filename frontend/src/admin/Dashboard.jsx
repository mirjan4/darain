import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageSquare, PlusSquare, Image as ImageIcon } from 'lucide-react';
import { getProducts, getEnquiries } from '../utils/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalImages: 0,
        totalEnquiries: 0,
        recentProducts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [prodRes, enqRes] = await Promise.all([
                    getProducts(),
                    getEnquiries()
                ]);
                const products = prodRes.data;
                const enquiries = enqRes.data;

                setStats({
                    totalProducts: products.length,
                    totalImages: products.reduce((acc, p) => acc + (p.images ? p.images.length : 1), 0),
                    totalEnquiries: enquiries.length,
                    recentProducts: products.slice(0, 5)
                });
                setLoading(false);
            } catch (error) {
                console.error("Dashboard error:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-20 text-center font-bold uppercase tracking-[0.3em] text-gray-300 animate-pulse">Initializing Atelier Dashboard...</div>;

    const cards = [
        { title: 'Signature Pieces', value: stats.totalProducts, icon: <ShoppingBag />, color: 'bg-accent text-white' },
        { title: 'Customer Enquiries', value: stats.totalEnquiries, icon: <MessageSquare />, color: 'bg-primary-100 text-accent' },
        { title: 'Catalogue Assets', value: stats.totalImages, icon: <ImageIcon />, color: 'bg-primary-50 text-accent' },
    ];

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-accent mb-2 italic">Performance Atelier</h1>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Welcome back, manager. Here is your collection summary.</p>
                </div>
          
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl premium-shadow border border-gray-50 flex flex-col justify-between h-48 group hover:border-accent/10 transition-all">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color} shadow-lg`}>
                            {React.cloneElement(card.icon, { size: 20 })}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">{card.title}</p>
                            <p className="text-4xl font-serif font-bold text-accent tracking-tighter">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl premium-shadow border border-gray-50 overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-bold text-lg uppercase tracking-widest text-accent">Latest Additions</h3>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Hand-curated pieces from this week</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/30 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-50">
                                <th className="px-10 py-5">Code</th>
                                <th className="px-10 py-5">Piece Name</th>
                                <th className="px-10 py-5">Category</th>
                                <th className="px-10 py-5">Stock</th>
                                <th className="px-10 py-5 text-right">Added Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.recentProducts.map((prod, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-6 font-bold text-primary-400 text-xs">{prod.product_code}</td>
                                    <td className="px-10 py-6 font-bold text-accent uppercase text-sm tracking-wider">{prod.name}</td>
                                    <td className="px-10 py-6 text-[10px] text-gray-500 font-bold uppercase">{prod.category}</td>
                                    <td className="px-10 py-6">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${prod.stock_status === 'In Stock' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                            {prod.stock_status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-[10px] text-gray-400 font-bold text-right uppercase">
                                        {new Date(prod.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
