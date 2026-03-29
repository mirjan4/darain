import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getProductById, UPLOADS_BASE_URL, getAttributes } from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import EnquiryModal from '../components/EnquiryModal';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    const [allColors, setAllColors] = useState([]);
    
    const { theme } = useSettings();
    
    const uiMode = {
        'default': {
            primary: 'text-[#2F468C]',
            button: 'bg-[#2F468C] hover:bg-[#1a2b5c] shadow-[#2F468C]/20',
            radius: 'rounded-[2.5rem]',
            fontTitle: 'font-serif italic',
            fontBody: 'font-sans',
            accent: 'text-gray-400',
            price: 'text-gray-900',
            bg: 'bg-white',
            pill: 'bg-blue-50 text-[#2F468C]'
        },
        'dynamic': {
            primary: 'text-black',
            button: 'bg-black hover:bg-neutral-800 shadow-neutral-900/10',
            radius: 'rounded-none',
            fontTitle: 'font-outfit font-black',
            fontBody: 'font-outfit font-medium',
            accent: 'text-neutral-500',
            price: 'text-black',
            bg: 'bg-white',
            pill: 'bg-neutral-100 text-black'
        },
        'motion-green': {
            primary: 'text-[#5F7D70]',
            button: 'bg-[#7FBFA6] hover:bg-[#68A38E] shadow-[#7FBFA6]/20',
            radius: 'rounded-[2rem]',
            fontTitle: 'font-sans font-extrabold uppercase',
            fontBody: 'font-sans',
            accent: 'text-[#8BA79B]',
            price: 'text-[#2f3a36]',
            bg: 'bg-[#fcfdfc]',
            pill: 'bg-[#f1f7f4] text-[#7FBFA6]'
        }
    };

    const s = uiMode[theme] || uiMode['default'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pRes, aRes] = await Promise.all([getProductById(id), getAttributes()]);
                setProduct(pRes.data);
                setAllColors(aRes.data.data.colors || []);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className={`h-screen flex items-center justify-center ${s.bg} ${s.fontBody}`}>
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === 'motion-green' ? 'border-[#7FBFA6]' : 'border-[#2F468C]'}`}></div>
        </div>
    );

    if (!product) return <div className={`h-screen flex items-center justify-center ${s.bg} ${s.accent} uppercase text-[10px] font-black tracking-widest ${s.fontBody}`}>Item not found.</div>;

    const sizesArr = product.sizes ? product.sizes.split(',') : [];
    const colorsArr = product.colors ? product.colors.split(',') : [];
    const images = product.images && product.images.length > 0 ? product.images : [null];
    const isOutOfStock = product.stock_status?.toLowerCase() === 'out of stock';
    
    const currentPrice = Number(product.price) || 0;
    const offerPrice = Number(product.offer_price) || 0;
    const hasOffer = offerPrice > 0 && offerPrice < currentPrice;
    const displayPrice = hasOffer ? offerPrice : currentPrice;
    const discountPercent = hasOffer ? Math.round(((currentPrice - offerPrice) / currentPrice) * 100) : 0;

    const handleEnquiryClick = () => {
        if (sizesArr.length > 0 && !selectedSize) { 
            toast.error("Please select a size to continue.", {
                style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
            }); 
            return; 
        }
        if (colorsArr.length > 0 && !selectedColor) { 
            toast.error("Please select a color to continue.", {
                style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
            }); 
            return; 
        }
        setIsEnquiryOpen(true);
    };

    return (
        <div className={`pt-20 lg:pt-24 pb-12 ${s.bg} min-h-screen ${s.fontBody}`}>
            <div className="max-w-6xl mx-auto px-4 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                    
                    {/* Image Column */}
                    <div className="lg:col-span-5 space-y-3">
                        <div className={`aspect-[4/5] overflow-hidden ${s.radius} relative bg-gray-50/50 shadow-sm group`}>
                            {images[activeImageIndex] ? (
                                <img src={`${UPLOADS_BASE_URL}/${images[activeImageIndex]}`} alt="" className="w-full h-full object-cover animate-in fade-in duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-100"><Sparkles size={60} /></div>
                            )}
                            
                            {images.length > 1 && (
                                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                                    <button onClick={() => setActiveImageIndex(p => (p === 0 ? images.length-1 : p-1))} className={`w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 active:scale-95 transition-all ${s.primary}`}><ChevronLeft size={16}/></button>
                                    <button onClick={() => setActiveImageIndex(p => (p === images.length-1 ? 0 : p+1))} className={`w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:scale-110 active:scale-95 transition-all ${s.primary}`}><ChevronRight size={16}/></button>
                                </div>
                            )}
                        </div>
                        
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {images.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImageIndex(i)} className={`relative w-14 aspect-square ${s.radius} overflow-hidden flex-shrink-0 border-2 transition-all ${activeImageIndex === i ? (theme === 'motion-green' ? 'border-[#7FBFA6] scale-95' : 'border-[#2F468C] scale-95') : 'border-transparent opacity-40'}`}>
                                        <img src={`${UPLOADS_BASE_URL}/${img}`} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Column */}
                    <div className="lg:col-span-7 flex flex-col pt-0 lg:pt-4 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Link to="/collections" className={`text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1 ${s.primary}`}><ArrowLeft size={10}/> Collection</Link>
                                <span className="w-1 h-1 bg-gray-200 rounded-full"/>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${s.accent}`}>{product.category}</span>
                            </div>
                            <h1 className={`text-3xl lg:text-4xl ${s.fontTitle} ${s.primary} tracking-tight uppercase leading-none`}>{product.name}</h1>
                            
                            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                <div className="flex items-baseline gap-3">
                                    <p className={`text-2xl lg:text-3xl font-black ${s.price} tracking-tighter`}>₹{displayPrice}</p>
                                    {hasOffer && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-gray-300 line-through">₹{currentPrice}</p>
                                            <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-lg border border-red-100 uppercase tracking-widest">{discountPercent}% OFF</span>
                                        </div>
                                    )}
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isOutOfStock ? 'bg-red-50 text-red-500' : s.pill}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : (theme === 'motion-green' ? 'bg-[#7FBFA6] animate-pulse' : 'bg-[#2F468C] animate-pulse')}`} />
                                    {isOutOfStock ? 'Sold Out' : 'Ready'}
                                </span>
                            </div>
                        </div>

                        <p className={`text-[11px] font-bold ${s.accent} uppercase tracking-widest leading-relaxed line-clamp-2`}>
                            {product.description || "Premium modest wear designed for the modern woman. Sophisticated silhouette with effortless style."}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-3">
                                <h3 className={`text-[10px] font-black uppercase tracking-widest ${s.accent}`}>Select Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sizesArr.length > 0 ? (
                                        sizesArr.map(size => (
                                            <button 
                                                key={size} 
                                                onClick={() => setSelectedSize(size.trim())} 
                                                className={`h-10 px-4 ${s.radius} border-2 text-[11px] font-black transition-all ${selectedSize === size.trim() ? (theme === 'motion-green' ? 'border-[#7FBFA6] bg-[#7FBFA6] text-white' : 'border-[#2F468C] bg-[#2F468C] text-white') : 'border-gray-50 bg-white text-gray-400 hover:border-gray-100'}`}
                                            >
                                                {size.trim()}
                                            </button>
                                        ))
                                    ) : <div className={`text-[10px] font-black ${s.accent} uppercase tracking-widest italic opacity-50`}>Universal Case</div>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className={`text-[10px] font-black uppercase tracking-widest ${s.accent}`}>Select Color</h3>
                                <div className="flex flex-wrap gap-3">
                                    {colorsArr.length > 0 ? (
                                        colorsArr.map(c => {
                                            const name = c.trim();
                                            const colorData = allColors.find(col => col.name.toLowerCase() === name.toLowerCase());
                                            const isActive = selectedColor === name;
                                            return (
                                                <button key={name} onClick={() => setSelectedColor(name)} className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all ${isActive ? (theme === 'motion-green' ? 'border-[#7FBFA6] scale-110' : 'border-[#2F468C] scale-110') : 'border-transparent'}`}>
                                                    <div className="w-full h-full rounded-full border shadow-inner flex items-center justify-center overflow-hidden" style={{ backgroundColor: colorData?.hex_code || '#eee' }}>
                                                        {isActive && <Check size={12} className={colorData?.hex_code.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'} strokeWidth={4} />}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : <div className={`text-[10px] font-black ${s.accent} uppercase tracking-widest italic opacity-50`}>Standard</div>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                onClick={handleEnquiryClick}
                                disabled={isOutOfStock}
                                className={`w-full flex items-center justify-center gap-4 py-4 ${s.radius} font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl ${
                                    isOutOfStock 
                                    ? 'bg-gray-100 text-gray-300' 
                                    : `${s.button} text-white hover:-translate-y-1`
                                }`}
                            >
                                <MessageCircle size={18} className={isOutOfStock ? '' : 'animate-bounce'} />
                                <span>{isOutOfStock ? 'OUT OF STOCK' : 'Order via WhatsApp'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {product && (
                <EnquiryModal 
                    isOpen={isEnquiryOpen} 
                    onClose={() => setIsEnquiryOpen(false)} 
                    product={product}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                />
            )}
        </div>
    );
};

export default ProductDetails;
