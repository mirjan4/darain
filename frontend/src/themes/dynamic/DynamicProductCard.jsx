import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShoppingBag, Eye } from 'lucide-react';
import { UPLOADS_BASE_URL } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';

const DynamicProductCard = ({ product }) => {
    const { whatsapp } = useSettings();
    const isOutOfStock = product.stock_status?.toLowerCase() === 'out of stock';
    
    const currentPrice = Number(product.price) || 0;
    const offerPrice = Number(product.offer_price) || 0;
    const hasOffer = offerPrice > 0 && offerPrice < currentPrice;
    const displayPrice = hasOffer ? offerPrice : currentPrice;

    const whatsappNum = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";
    const whatsappMessage = `Hi, I am interested in ${product.name} (Code: ${product.product_code || 'N/A'}). Can you provide more details?`;
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="group bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden relative border border-gray-100/50 flex flex-col h-full">
            {/* Image Section */}
            <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50 flex-shrink-0">
                {product.main_image ? (
                    <img 
                        src={`${UPLOADS_BASE_URL}/${product.main_image}`} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold tracking-widest uppercase">
                        Coming Soon
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isOutOfStock ? (
                        <span className="bg-gray-900 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                            Out of Stock
                        </span>
                    ) : hasOffer ? (
                        <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                            Offer
                        </span>
                    ) : (
                        <span className="bg-[#2A9D8F] text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                            New
                        </span>
                    )}
                </div>
            </Link>

            {/* Info Section */}
            <div className="p-4 md:p-5 flex flex-col flex-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                    {(product.category_name || product.category || 'Collection').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                </p>
                <Link to={`/product/${product.id}`} className="text-sm md:text-base font-bold text-gray-900 hover:text-[#2F468C] transition-colors line-clamp-1 leading-tight mb-2">
                    {product.name}
                </Link>
                
                <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                        <span className="text-base md:text-lg font-black text-[#2F468C]">
                            ₹{displayPrice.toLocaleString()}
                        </span>
                        {hasOffer && (
                            <span className="text-[10px] md:text-xs text-gray-300 line-through font-bold">
                                ₹{currentPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* WhatsApp Button */}
                <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] py-2.5 rounded-xl border border-[#25D366]/20 text-[10px] font-black uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all duration-300"
                >
                    <MessageCircle size={14} />
                    Enquire
                </a>
            </div>
        </div>
    );
};

export default DynamicProductCard;
