import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Check, ChevronLeft, ChevronRight, Share2, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { getProductById, UPLOADS_BASE_URL } from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import EnquiryModal from '../components/EnquiryModal';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    
    const { theme } = useSettings();
    const isDynamic = theme === 'dynamic' || theme === 'motion-green';
    const isMotionGreen = theme === 'motion-green';

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
            <div className={`pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-12 ${isDynamic ? 'font-outfit' : 'font-sans'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
                    <div className="aspect-[3/4] bg-gray-100 rounded-3xl" />
                    <div className="space-y-6 pt-12">
                        <div className="h-4 w-24 bg-gray-100 rounded-full" />
                        <div className="h-12 w-3/4 bg-gray-100 rounded-2xl" />
                        <div className="h-8 w-1/3 bg-gray-100 rounded-xl" />
                        <div className="h-32 w-full bg-gray-50 rounded-2xl" />
                    </div>
                </div>
            </div>
    );

    if (!product) return <div className={`pt-32 pb-24 text-center font-medium text-gray-400 ${isDynamic ? 'font-outfit' : 'font-sans'}`}>Inventory item not found.</div>;

    const sizesArr = product.sizes ? product.sizes.split(',') : [];
    const images = product.images && product.images.length > 0 ? product.images : [null];
    const isOutOfStock = product.stock_status?.toLowerCase() === 'out of stock';
    
    const currentPrice = Number(product.price) || 0;
    const offerPrice = Number(product.offer_price) || 0;
    const hasOffer = offerPrice > 0 && offerPrice < currentPrice;
    const displayPrice = hasOffer ? offerPrice : currentPrice;
    const discountPercent = hasOffer ? Math.round(((currentPrice - offerPrice) / currentPrice) * 100) : 0;

    const handleEnquiryClick = () => {
        if (sizesArr.length > 0 && !selectedSize) {
            alert("Please select a size first.");
            return;
        }
        setIsEnquiryOpen(true);
    };

    return (
        <div className={`pt-16 lg:pt-24 pb-24 bg-white min-h-screen ${isDynamic ? 'font-outfit' : 'font-sans'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                <div className="pt-4 lg:pt-8">
                    {/* Breadcrumb Navigation */}
                    <div className="mb-8 flex items-center justify-between">
                        <Link to="/collections" className={`inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#2F468C] transition-all group ${isDynamic ? 'font-outfit' : ''}`}>
                            <span className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center mr-3 group-hover:bg-[#2F468C] group-hover:text-white group-hover:border-[#2F468C] transition-all">
                                <ArrowLeft size={14} />
                            </span> 
                            Back to Collection
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Image Gallery Column */}
                        <div className="space-y-4">
                            <div className="aspect-[3/4] overflow-hidden rounded-3xl relative bg-gray-50/50 shadow-inner group">
                                {images[activeImageIndex] ? (
                                    <img 
                                        src={`${UPLOADS_BASE_URL}/${images[activeImageIndex]}`} 
                                        alt={product.name}
                                        className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Sparkles className="text-gray-100" size={80} />
                                    </div>
                                )}
                                
                                {images.length > 1 && (
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button 
                                            onClick={() => setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                                            className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-xl text-[#2F468C]"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button 
                                            onClick={() => setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                                            className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-xl text-[#2F468C]"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}

                                {hasOffer && (
                                    <div className="absolute top-4 left-4 lg:top-8 lg:left-8 bg-black text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                                        Special Offer
                                    </div>
                                )}
                            </div>
                            
                            {/* Gallery Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-gray-200">
                                    {images.map((img, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setActiveImageIndex(i)}
                                            className={`relative w-20 lg:w-24 aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                                                activeImageIndex === i 
                                                ? 'ring-2 ring-[#2F468C] ring-offset-4 scale-95 opacity-100' 
                                                : 'opacity-40 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={`${UPLOADS_BASE_URL}/${img}`} className="w-full h-full object-cover bg-gray-50" alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Information Column */}
                        <div className="flex flex-col py-2 lg:py-6">
                            <div className="mb-4">
                                <p className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">{(product.category_name || product.category || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</p>
                                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${isMotionGreen ? 'text-[#7FBFA6]' : 'text-[#2F468C]'} mb-4 lg:mb-6 leading-[1.15] tracking-tight ${isDynamic ? 'font-outfit' : 'font-serif italic'}`}>{product.name}</h1>
                                
                                <div className="flex items-baseline gap-4 mb-4">
                                    <p className={`text-3xl lg:text-4xl font-medium text-gray-900 tracking-tighter ${isDynamic ? 'font-outfit' : 'font-sans'}`}>₹{displayPrice}</p>
                                    {hasOffer && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg text-gray-400 line-through">₹{currentPrice}</p>
                                            <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-red-50 rounded italic">{discountPercent}% OFF</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-8">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isOutOfStock ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                                    {isOutOfStock ? 'Out of Stock' : 'Ready to Ship'}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ref: {product.product_code}</span>
                            </div>

                            <div className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed mb-10 pb-6 border-b border-gray-100">
                                <p className="text-sm font-medium">{product.description || "Sophisticated modest wear designed for the modern woman. Each piece is crafted from handpicked premium fabrics, offering timeless elegance and effortless style for any occasion."}</p>
                            </div>

                            {/* Size Selection Area */}
                            <div className="mb-12">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Select Your Size</h3>
                                    <button className="text-[10px] uppercase font-bold text-gray-400 underline underline-offset-4 hover:text-[#2F468C] tracking-widest transition-colors">Find My Size</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {sizesArr.length > 0 ? (
                                        sizesArr.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size.trim())}
                                                className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl border flex items-center justify-center font-bold text-sm transition-all duration-300 relative ${
                                                    selectedSize === size.trim() 
                                                        ? 'border-[#2F468C] bg-[#2F468C] text-white shadow-xl shadow-[#2F468C]/20 scale-105' 
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-[#2F468C]/30 hover:bg-gray-50/50'
                                                }`}
                                            >
                                                {size.trim()}
                                                {selectedSize === size.trim() && (
                                                    <div className="absolute -top-1.5 -right-1.5 bg-white text-[#2F468C] rounded-full shadow-lg border border-gray-100">
                                                        <Check size={14} className="p-0.5" />
                                                    </div>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">Free Size / Universal Fit</div>
                                    )}
                                </div>
                            </div>

                            {/* Trust Badge Section */}
                            <div className="grid grid-cols-3 gap-4 mb-10">
                                <div className="text-center p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                                    <ShieldCheck size={20} className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 leading-tight">Authentic Item</p>
                                </div>
                                <div className="text-center p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                                    <Truck size={20} className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 leading-tight">Swift Delivery</p>
                                </div>
                                <div className="text-center p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                                    <Sparkles size={20} className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 leading-tight">Premium Silk</p>
                                </div>
                            </div>

                            {/* Sticky Inquiry Button Area */}
                            <div className="mt-auto pt-6 border-t border-gray-50">
                                <button 
                                    onClick={handleEnquiryClick}
                                    disabled={isOutOfStock}
                                    className={`w-full group relative flex items-center justify-center gap-4 py-5 rounded-3xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-500 shadow-2xl ${
                                        isOutOfStock 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                                        : `${isMotionGreen ? 'bg-[#7FBFA6] hover:bg-[#6FAE95]' : 'bg-[#2F468C] hover:bg-[#1a2b5c]'} text-white shadow-[#2F468C]/20 hover:shadow-[#2F468C]/40 hover:-translate-y-1`
                                    }`}
                                >
                                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-opacity" />
                                    <MessageCircle size={20} className={isOutOfStock ? 'opacity-20' : 'animate-bounce'} />
                                    <span>{isOutOfStock ? 'Sold Out' : 'WhatsApp Enquiry'}</span>
                                </button>
                                {!isOutOfStock && <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest mt-4 opacity-60">Avg. response time: ~5 mins</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Enquiry Portal Modal */}
            {product && (
                <EnquiryModal 
                    isOpen={isEnquiryOpen} 
                    onClose={() => setIsEnquiryOpen(false)} 
                    product={product}
                    selectedSize={selectedSize}
                />
            )}
        </div>
    );
};

export default ProductDetails;
