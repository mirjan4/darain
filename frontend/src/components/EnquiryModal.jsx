import React, { useState } from 'react';
import { X, Send, Phone, User, MessageCircle, CheckCircle2 } from 'lucide-react';
import { addEnquiry, UPLOADS_BASE_URL } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

const EnquiryModal = ({ isOpen, onClose, product, selectedSize }) => {
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { whatsapp } = useSettings();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const whatsappNumber = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";
        const whatsappMessage = `Hi, I am ${formData.name}, interested in ${product.name}.\n\nProduct Details:\nProduct Name: ${product.name}\nProduct Code: ${product.product_code}\nSelected Size: ${selectedSize || "N/A"}\n\nPlease provide more information.`;
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;

        try {
            await addEnquiry({
                name: formData.name,
                phone: formData.phone,
                message: `Enquiry for ${product.name} (Code: ${product.product_code}, Size: ${selectedSize || 'N/A'})`,
                product_id: product.id,
                selected_size: selectedSize || 'N/A'
            });

            setIsSuccess(true);
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                onClose();
            }, 1500);
        } catch (err) {
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-[#2F468C] p-6 text-white relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h3 className="text-xl font-bold font-serif italic tracking-wide">Product Enquiry</h3>
                    <p className="text-xs text-white/70 mt-1 uppercase tracking-widest font-sans">Send details to start WhatsApp chat</p>
                </div>

                <div className="p-6 sm:p-8">
                    {isSuccess ? (
                        <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in slide-in-from-bottom-4">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                                <CheckCircle2 size={40} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">Enquiry Saved!</h4>
                                <p className="text-sm text-gray-500 mt-1">Opening WhatsApp to chat with us...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Product Summary */}
                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-2">
                                <div className="w-12 h-16 rounded overflow-hidden bg-white shrink-0">
                                    <img 
                                        src={product.main_image ? `${UPLOADS_BASE_URL}/${product.main_image}` : (product.images && product.images[0] ? `${UPLOADS_BASE_URL}/${product.images[0]}` : '')} 
                                        className="w-full h-full object-cover" 
                                        alt={product.name} 
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate">{product.category}</p>
                                    <p className="text-sm font-bold text-gray-900 truncate leading-tight">{product.name}</p>
                                    <p className="text-[11px] text-[#2F468C] font-bold mt-0.5">Size: {selectedSize || 'Standard'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Your Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-300 pointer-events-none">
                                            <User size={16} />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F468C]/10 focus:border-[#2F468C] transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-300 pointer-events-none">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F468C]/10 focus:border-[#2F468C] transition-all"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#2F468C] hover:bg-[#1a2b5c] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2F468C]/20 disabled:opacity-50 mt-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <MessageCircle size={18} />
                                        Submit & Chat
                                    </>
                                )}
                            </button>
                            <p className="text-[10px] text-center text-gray-400 font-medium">Your details are safe with us. We'll only use them for this enquiry.</p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnquiryModal;
