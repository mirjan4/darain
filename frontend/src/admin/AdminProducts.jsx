import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
    Edit2, Trash2, Plus, Search, Eye, Filter, 
    Package, ShoppingBag, Tag, X, Settings2,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { getProducts, deleteProduct, UPLOADS_BASE_URL } from '../utils/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    // --- State Management ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [stockFilter, setStockFilter] = useState("All");
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // Column Visibility State
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        details: true,
        category: true,
        value: true,
        status: true,
        actions: true
    });

    // Ref for detecting clicks outside the dropdown
    const menuRef = useRef(null);

    // --- Effects ---
    useEffect(() => {
        fetchProducts();
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, stockFilter]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowColumnMenu(false);
            }
        };

        if (showColumnMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColumnMenu]);

    // --- Actions ---
    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch error:", error);
            setLoading(false);
            toast.error("Failed to load products");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this piece from collection?")) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
                toast.success("Product deleted successfully");
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const toggleColumn = (column) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const resetFilters = () => {
        setSearchTerm("");
        setCategoryFilter("All");
        setStockFilter("All");
    };

    // --- Logic ---
    const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

    const filtered = products.filter(p => {
        const matchesSearch = 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (p.product_code && p.product_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
        const matchesStock = stockFilter === "All" || p.stock_status === stockFilter;

        return matchesSearch && matchesCategory && matchesStock;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-serif">Product Collection</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage, filter, and organize your boutique inventory.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="px-4 py-2 bg-[#2F468C]/5 border border-[#2F468C]/10 rounded-full text-[#2F468C] font-bold text-xs flex items-center gap-2">
                        <Package size={14} />
                        {filtered.length} Displayed
                    </div>
                    <Link 
                        to="/admin/add-product" 
                        className="flex-1 md:flex-none bg-[#2F468C] text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all hover:bg-[#24366e] shadow-lg shadow-[#2F468C]/20 hover:-translate-y-0.5"
                    >
                        <Plus size={16} />
                        <span>Add Product</span>
                    </Link>
                </div>
            </div>

            {/* Search & Filters Container */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col xl:flex-row gap-4">
                    
                    {/* Column Toggle Dropdown with outside-click detection */}
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setShowColumnMenu(!showColumnMenu)}
                            className="h-full bg-gray-50 border border-transparent hover:border-gray-200 text-gray-600 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
                        >
                            <Settings2 size={16} />
                            <span>Columns</span>
                        </button>

                        {showColumnMenu && (
                            <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in duration-200">
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black px-3 py-2">Toggle Display</p>
                                {Object.keys(visibleColumns).map((col) => (
                                    <label key={col} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                        <input 
                                            type="checkbox" 
                                            checked={visibleColumns[col]} 
                                            onChange={() => toggleColumn(col)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#2F468C] focus:ring-[#2F468C]"
                                        />
                                        <span className="text-xs font-bold text-gray-600 capitalize">
                                            {col === 'details' ? 'Product Details' : col}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Field */}
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2F468C] transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name, SKU or category..." 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2F468C]/10 transition-all placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Group - Grid style side-by-side */}
                    <div className="flex flex-row gap-3">
                        <div className="relative flex-1 sm:w-48">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <select 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full pl-9 pr-4 py-3 bg-gray-50 border-none rounded-xl text-[11px] font-bold uppercase tracking-wider text-gray-600 focus:ring-2 focus:ring-[#2F468C]/10 cursor-pointer appearance-none"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>)}
                            </select>
                        </div>
                        
                        <div className="relative flex-1 sm:w-44">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <select 
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="w-full pl-9 pr-4 py-3 bg-gray-50 border-none rounded-xl text-[11px] font-bold uppercase tracking-wider text-gray-600 focus:ring-2 focus:ring-[#2F468C]/10 cursor-pointer appearance-none"
                            >
                                <option value="All">All Stock Status</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>

                        {(searchTerm || categoryFilter !== "All" || stockFilter !== "All") && (
                            <button 
                                onClick={resetFilters}
                                className="px-4 py-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-[0.15em] text-gray-400 font-bold border-b border-gray-100">
                                {visibleColumns.details && <th className="px-8 py-5">Product Details</th>}
                                {visibleColumns.category && <th className="px-6 py-5">Category</th>}
                                {visibleColumns.value && <th className="px-6 py-5">Value</th>}
                                {visibleColumns.status && <th className="px-6 py-5">Status</th>}
                                {visibleColumns.actions && <th className="px-8 py-5 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={visibleColumnCount} className="px-8 py-8">
                                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : paginatedItems.length > 0 ? paginatedItems.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/30 transition-colors group">
                                    {visibleColumns.details && (
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-16 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 group-hover:shadow-md transition-all duration-300">
                                                    <img 
                                                        src={product.main_image ? `${UPLOADS_BASE_URL}/${product.main_image}` : `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='100' viewBox='0 0 80 100'%3E%3Crect width='80' height='100' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='9' fill='%23cbd5e1' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E`} 
                                                        className="w-full h-full object-cover"
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm tracking-tight">{product.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.product_code}</span>
                                                        {product.sizes && (
                                                            <span className="text-[9px] px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded-md border border-gray-100 font-bold">{product.sizes}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.category && (
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100/50 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-widest w-fit border border-gray-100">
                                                {product.category}
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.value && (
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">₹{product.offer_price || product.price}</span>
                                                {product.offer_price && (
                                                    <span className="text-[10px] text-red-300 line-through">₹{product.price}</span>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.status && (
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                                                product.stock_status === 'Out of Stock' 
                                                ? 'text-red-500 bg-red-50 border-red-100' 
                                                : 'text-green-600 bg-green-50 border-green-100'
                                            }`}>
                                                {product.stock_status}
                                            </span>
                                        </td>
                                    )}
                                    {visibleColumns.actions && (
                                        <td className="px-8 py-5">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/admin/edit-product/${product.id}`} className="p-2.5 text-gray-400 hover:text-[#2F468C] bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all shadow-none hover:shadow-sm" title="Edit Piece">
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2.5 text-gray-400 hover:text-red-500 bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all shadow-none hover:shadow-sm"
                                                    title="Remove from Collection"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="w-px h-8 bg-gray-100 mx-1 hidden sm:block"></div>
                                                <Link to={`/product/${product.id}`} target="_blank" className="p-2.5 text-white bg-[#2F468C] rounded-xl transition-all hover:bg-[#121b36] shadow-sm" title="Preview Live">
                                                    <Eye size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={visibleColumnCount} className="p-24 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <ShoppingBag size={48} className="text-gray-200 mb-4" />
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No matching pieces found</p>
                                            <button onClick={resetFilters} className="mt-4 text-[#2F468C] font-bold text-xs underline underline-offset-4">Reset all filters</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View (Hidden on Desktop) */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 animate-pulse space-y-3">
                            <div className="flex gap-4">
                                <div className="w-20 h-24 bg-gray-100 rounded-xl"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="h-10 bg-gray-50 rounded-xl"></div>
                        </div>
                    ))
                ) : paginatedItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {paginatedItems.map((product) => (
                            <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-20 h-24 bg-gray-100 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0">
                                        <img 
                                            src={product.main_image ? `${UPLOADS_BASE_URL}/${product.main_image}` : `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='100' viewBox='0 0 80 100'%3E%3Crect width='80' height='100' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='9' fill='%23cbd5e1' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E`} 
                                            className="w-full h-full object-cover"
                                            alt={product.name}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
                                        <h3 className="font-bold text-gray-900 text-sm truncate">{product.name}</h3>
                                        <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">{product.product_code}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex flex-col">
                                                <span className="font-black text-[#2F468C] text-sm">₹{product.offer_price || product.price}</span>
                                                {product.offer_price && product.offer_price > 0 && (
                                                    <span className="text-[10px] text-gray-500 line-through">₹{product.price}</span>
                                                )}
                                            </div>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                                                product.stock_status === 'Out of Stock' 
                                                ? 'text-red-500 bg-red-50 border-red-100' 
                                                : 'text-green-600 bg-green-50 border-green-100'
                                            }`}>
                                                {product.stock_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <Link to={`/admin/edit-product/${product.id}`} className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                        <Edit2 size={14} /> Edit
                                    </Link>
                                    <button onClick={() => handleDelete(product.id)} className="flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                        <Trash2 size={14} /> Remove
                                    </button>
                                    <Link to={`/product/${product.id}`} target="_blank" className="flex items-center justify-center gap-2 py-2.5 bg-[#2F468C] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                                        <Eye size={14} /> Pre
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center opacity-40">
                        <ShoppingBag size={48} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Empty Selection</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls - Shared */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                {!loading && filtered.length > 0 && (
                    <div className="px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-6 overflow-x-auto">
                        {/* Summary */}
                        <div className="text-sm font-medium text-gray-500 whitespace-nowrap">
                            Showing <span className="text-gray-900 font-bold">{startIndex + 1}</span> to <span className="text-gray-900 font-bold">{Math.min(startIndex + itemsPerPage, filtered.length)}</span> of <span className="text-gray-900 font-bold">{filtered.length}</span> results
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            {/* Rows per page */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-500">Rows per page</span>
                                <div className="relative">
                                    <select 
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-1.5 pr-8 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2F468C]/10 transition-all cursor-pointer"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                        <ChevronRight size={14} className="rotate-90" />
                                    </div>
                                </div>
                            </div>

                            {/* Page Info */}
                            <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5">
                                <button 
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'border-gray-50 text-gray-100 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95'}`}
                                >
                                    <ChevronsLeft size={16} />
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'border-gray-50 text-gray-100 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95'}`}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'border-gray-50 text-gray-100 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95'}`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'border-gray-50 text-gray-100 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95'}`}
                                >
                                    <ChevronsRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;