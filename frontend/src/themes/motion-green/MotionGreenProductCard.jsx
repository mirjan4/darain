import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { UPLOADS_BASE_URL } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';

const MotionGreenProductCard = ({ product, index }) => {
    const { whatsapp } = useSettings();
    const isOutOfStock = product.stock_status?.toLowerCase() === 'out of stock';
    
    const currentPrice = Number(product.price) || 0;
    const offerPrice = Number(product.offer_price) || 0;
    const hasOffer = offerPrice > 0 && offerPrice < currentPrice;
    const displayPrice = hasOffer ? offerPrice : currentPrice;

    const whatsappNum = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";
    const whatsappMessage = `Hi, I am interested in ${product.name} (Code: ${product.product_code}). Can you provide more details?`;
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMessage)}`;

    // Stagger animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }
        }
    };

    return (
        <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col bg-white rounded-[32px] md:rounded-[40px] overflow-hidden transition-all duration-500 border border-[#EEF5F2] shadow-sm hover:shadow-xl hover:shadow-[#7FBFA6]/10"
        >
            <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-[#F8FAF9]">
                <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    src={product.main_image ? `${UPLOADS_BASE_URL}/${product.main_image}` : 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1072&auto=format&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1.5">
                    {hasOffer && (
                        <span className="bg-[#7FBFA6] text-white text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-full shadow-lg backdrop-blur-md">
                            Special Offer
                        </span>
                    )}
                    {isOutOfStock && (
                        <span className="bg-gray-400 text-white text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-full shadow-lg">
                            Sold Out
                        </span>
                    )}
                </div>

                {/* DESKTOP ONLY: Hover Overlay Actions */}
                <div className="hidden md:flex absolute inset-x-0 bottom-6 px-6 translate-y-full group-hover:translate-y-0 transition-all duration-700 ease-[0.16, 1, 0.3, 1] items-center gap-3">
                    <div className="flex-1 bg-white/95 backdrop-blur-sm text-[#1A1A1A] py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] shadow-xl hover:bg-[#7FBFA6] hover:text-white transition-all flex items-center justify-center gap-2">
                        <Eye size={14} /> View
                    </div>
                    <div className="w-12 h-12 bg-[#7FBFA6] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#6FAE95] transition-all">
                        <MessageCircle size={18} />
                    </div>
                </div>
            </Link>

            {/* Info Section */}
            <div className="p-4 md:p-6 space-y-2 md:space-y-3">
                <div className="space-y-0.5 md:space-y-1">
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#7FBFA6]/80 px-0.5">
                        {(product.category_name || product.category || 'Collection').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </p>
                    <Link to={`/product/${product.id}`} className="block">
                        <h3 className="text-xs md:text-base font-black text-[#1A1A1A] line-clamp-1 h-5 md:h-6 uppercase tracking-tight font-outfit hover:text-[#7FBFA6] transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2">
                        <span className="text-sm md:text-lg font-black text-[#1A1A1A]">₹{displayPrice}</span>
                        {hasOffer && (
                            <span className="text-[9px] md:text-xs text-gray-300 line-through">₹{product.price}</span>
                        )}
                    </div>
                    
                    {/* MOBILE ACTION ROW (HIDDEN ON DESKTOP) */}
                    <div className="flex md:hidden items-center gap-2">
                         <a 
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 bg-[#EEF5F2] text-[#7FBFA6] rounded-full flex items-center justify-center hover:bg-[#7FBFA6] hover:text-white transition-all border border-[#7FBFA6]/10"
                        >
                            <MessageCircle size={14} />
                        </a>
                        <Link 
                            to={`/product/${product.id}`}
                            className="w-8 h-8 rounded-full border border-[#EEF5F2] flex items-center justify-center text-gray-300 hover:bg-[#7FBFA6] hover:text-white hover:border-[#7FBFA6] transition-all"
                        >
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* DESKTOP ACTION BUTTON */}
                    <Link 
                        to={`/product/${product.id}`}
                        className="hidden md:flex w-10 h-10 rounded-full border border-[#EEF5F2] items-center justify-center text-gray-400 hover:bg-[#7FBFA6] hover:text-white hover:border-[#7FBFA6] transition-all"
                    >
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default MotionGreenProductCard;
