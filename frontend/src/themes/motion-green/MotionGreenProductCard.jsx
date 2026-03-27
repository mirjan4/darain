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
            className="group relative flex flex-col bg-white rounded-[40px] overflow-hidden transition-all duration-500 border border-[#EEF5F2]"
        >
            {/* Image Section */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#F8FAF9]">
                <Link to={`/product/${product.id}`} className="block h-full">
                    <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        src={product.main_image ? `${UPLOADS_BASE_URL}/${product.main_image}` : 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1072&auto=format&fit=crop'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </Link>

                {/* Overlays */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {hasOffer && (
                        <span className="bg-[#7FBFA6] text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-sm">
                            Special Offer
                        </span>
                    )}
                    {isOutOfStock && (
                        <span className="bg-gray-400 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-sm">
                            Sold Out
                        </span>
                    )}
                </div>

                {/* Hover Quick Actions */}
                <div className="absolute inset-x-0 bottom-6 px-6 translate-y-full group-hover:translate-y-0 transition-all duration-700 ease-[0.16, 1, 0.3, 1] flex items-center gap-3">
                    <Link 
                        to={`/product/${product.id}`}
                        className="flex-1 bg-white/95 backdrop-blur-sm text-[#1A1A1A] py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] shadow-xl hover:bg-[#7FBFA6] hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Eye size={14} /> View
                    </Link>
                    <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-[#7FBFA6] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#6FAE95] transition-all"
                    >
                        <MessageCircle size={18} />
                    </a>
                </div>
            </div>

            {/* Info Section */}
            <div className="p-6 md:p-8 space-y-3">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7FBFA6]/80 px-1">
                        {(product.category_name || product.category || 'Collection').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </p>
                    <h3 className="text-base font-medium text-[#1A1A1A] line-clamp-1 h-6">
                        {product.name}
                    </h3>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#1A1A1A]">₹{displayPrice}</span>
                        {hasOffer && (
                            <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                        )}
                    </div>
                    <Link 
                        to={`/product/${product.id}`}
                        className="w-8 h-8 rounded-full border border-[#EEF5F2] flex items-center justify-center text-gray-400 hover:bg-[#7FBFA6] hover:text-white hover:border-[#7FBFA6] transition-all"
                    >
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default MotionGreenProductCard;
