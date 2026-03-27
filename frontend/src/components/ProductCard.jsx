import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Eye } from 'lucide-react';
import { UPLOADS_BASE_URL } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

const ProductCard = ({ product }) => {
  const { whatsapp } = useSettings();
  const whatsappNumber = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";
  const whatsappMessage = `Hello, I am interested in this product.\n\nProduct Code: ${product.product_code}\nProduct Name: ${product.name}\n\nLink: ${window.location.origin}/product/${product.id}`;
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;
  const sizes = product.sizes ? product.sizes.split(',') : [];

  return (
    <div className="group flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-500 border border-gray-100 hover:-translate-y-1 max-w-[250px] w-full">
      {/* Image Area */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.main_image ? `${UPLOADS_BASE_URL}/${product.main_image}` : 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1072&auto=format&fit=crop'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
          />
        </Link>
        
        {/* Price Badge Overlay */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4">
            <div className="bg-[#2F468C] text-white px-2 py-1 md:px-4 md:py-2 rounded-full shadow-lg text-[10px] md:text-sm font-bold flex flex-col items-center">
                <span>₹{product.offer_price || product.price}</span>
                {product.offer_price && (
                    <span className="text-[8px] md:text-[10px] line-through opacity-60">₹{product.price}</span>
                )}
            </div>
        </div>

        {/* Stock Status Badge */}
        {product.stock_status === 'Out of Stock' && (
            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-red-500 text-white text-[8px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-widest shadow-lg">
                Sold Out
            </div>
        )}

        {/* Quick View Actions */}
        <div className="absolute inset-x-0 bottom-0 p-2 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center gap-1 md:gap-2 bg-gradient-to-t from-black/20 to-transparent">
            <Link 
                to={`/product/${product.id}`}
                className="bg-white/90 backdrop-blur-sm text-[#2F468C] p-2 md:px-4 md:py-3 rounded-full shadow-md hover:bg-white transition-all flex items-center justify-center flex-1"
                title="View Details"
            >
                <Eye size={16} />
            </Link>
            <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2F468C] text-white p-2 md:px-4 md:py-3 rounded-full shadow-md hover:bg-[#24366E] transition-all flex items-center justify-center flex-1 space-x-1 md:space-x-2"
            >
                <MessageCircle size={16} />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest hidden lg:block">Enquiry</span>
            </a>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        <div className="space-y-0.5 md:space-y-1 text-center">
            <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                {(product.category_name || product.category || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
            </p>
            <h3 className="text-sm md:text-base font-poppins font-semibold text-[#2F468C] truncate leading-tight group-hover:text-[#1a237e] transition-colors">
                {product.name}
            </h3>
            <p className="text-[8px] md:text-[10px] font-medium text-gray-400 tracking-wider">Code: {product.product_code}</p>
        </div>

        {/* Sizes Pills */}
        <div className="flex flex-wrap justify-center gap-1 md:gap-1.5 pt-2 md:pt-3 border-t border-gray-50">
            {sizes.length > 0 ? sizes.map(size => (
                <span key={size} className="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-gray-50 text-gray-500 text-[8px] md:text-[9px] font-bold rounded-full border border-gray-100 uppercase">
                    {size}
                </span>
            )) : (
                <span className="text-[8px] md:text-[9px] text-gray-300 italic">One Size</span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
