import React from 'react';
import { Link } from 'react-router-dom';
import { UPLOADS_BASE_URL } from '../../utils/api';

const ModernProductCard = ({ product }) => {
    const isOutOfStock = product.stock_status?.toLowerCase() === 'out of stock';
    
    // Explicitly parse pricing to numbers to avoid strings bugs
    const currentPrice = Number(product.price) || 0;
    const offerPrice = Number(product.offer_price) || 0;
    const hasOffer = offerPrice > 0 && offerPrice < currentPrice;
    
    const displayPrice = hasOffer ? offerPrice : currentPrice;

    return (
        <Link 
            to={`/product/${product.id}`} 
            className="group block transition-all duration-300 hover:opacity-80 flex-shrink-0"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] md:aspect-square overflow-hidden bg-[#F2F2F2] flex items-center justify-center">
                {product.main_image ? (
                    <img 
                        src={`${UPLOADS_BASE_URL}/${product.main_image}`} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-multiply opacity-95 transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="text-gray-300 text-xs font-bold uppercase tracking-widest">
                        No Image
                    </div>
                )}
                
                {/* Minimal Color Indicator Dot (Top Right) */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4A4A4A] border border-black/10"></span>
                    <span className="text-[9px] font-bold text-black tracking-tight">+1</span>
                </div>

                {isOutOfStock && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-white/80 backdrop-blur text-black border border-gray-200 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            {/* Details Outside Image Container */}
            <div className="py-3 text-left">
                <h3 className="text-sm font-bold text-black leading-tight tracking-tight">
                    {product.name}
                </h3>
                
                <p className="text-[10px] text-gray-500 mt-1 mb-1 tracking-tight">
                    {product.category || 'Premium Collection'}
                </p>

                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-black">
                        ₹{displayPrice}
                    </span>
                    {hasOffer && (
                        <span className="text-[10px] font-medium text-gray-400 line-through">
                            ₹{currentPrice}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ModernProductCard;
