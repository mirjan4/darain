import React, { useState } from 'react';
import { X, Send, Phone, User, MessageCircle, CheckCircle2 } from 'lucide-react';
import { addEnquiry, UPLOADS_BASE_URL } from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';

const EnquiryModal = ({ isOpen, onClose, product, selectedSize, selectedColor }) => {
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { whatsapp, theme } = useSettings();

    const uiMode = {
        'default': {
            primary: 'bg-[#2F468C]',
            text: 'text-[#2F468C]',
            accent: 'border-[#2F468C]',
            hover: 'hover:bg-[#1a2b5c]',
            shadow: 'shadow-[#2F468C]/20',
            radius: 'rounded-2xl',
            fontTitle: 'font-serif italic',
            fontBody: 'font-sans',
            price: 'text-gray-900',
            bg: 'bg-white',
            glass: 'bg-white/95'
        },
        'dynamic': {
            primary: 'bg-black',
            text: 'text-black',
            accent: 'border-black',
            hover: 'hover:bg-neutral-800',
            shadow: 'shadow-neutral-900/10',
            radius: 'rounded-none',
            fontTitle: 'font-outfit font-black uppercase tracking-tighter',
            fontBody: 'font-outfit font-bold',
            price: 'text-black',
            bg: 'bg-white',
            glass: 'bg-white'
        },
        'motion-green': {
            primary: 'bg-[#7FBFA6]',
            text: 'text-[#5F7D70]',
            accent: 'border-[#7FBFA6]',
            hover: 'hover:bg-[#68A38E]',
            shadow: 'shadow-[#7FBFA6]/20',
            radius: 'rounded-3xl',
            fontTitle: 'font-sans font-extrabold uppercase tracking-widest text-[#2f3a36]',
            fontBody: 'font-sans',
            price: 'text-[#2f3a36]',
            bg: 'bg-[#fcfdfc]',
            glass: 'bg-[#fcfdfc]/98'
        }
    };

    const s = uiMode[theme] || uiMode['default'];

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 10-digit phone validation
        const cleanedPhone = formData.phone.replace(/\D/g, ''); // strip non-digits
        if (cleanedPhone.length !== 10) {
            toast.error("Contact number must be exactly 10 digits.", {
                style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
            });
            return;
        }

        setIsSubmitting(true);

        const whatsappNumber = whatsapp ? whatsapp.replace(/\D/g, '') : "916238186495";
        const whatsappMessage = `Hi Darain! I am ${formData.name}.\n\nEnquiry Details:\n- Product: ${product.name}\n- Code: ${product.product_code}\n- Size: ${selectedSize || "N/A"}\n- Color: ${selectedColor || "N/A"}\n- Phone: ${formData.phone}\n\nI'd like to chat about this item!`;
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;

        try {
            await addEnquiry({
                name: formData.name,
                phone: formData.phone,
                message: `Enquiry for ${product.name} (${product.product_code})`,
                product_id: product.id,
                selected_size: selectedSize || 'N/A',
                selected_color: selectedColor || 'N/A'
            });

            setIsSuccess(true);
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                onClose();
            }, 1000);
        } catch (err) {
            toast.error("Connection error. Please try again.", {
                style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`${s.bg} w-full max-w-md ${s.radius} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20`}>
                {/* Header */}
                <div className={`${s.primary} p-6 text-white relative flex flex-col items-center text-center`}>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white hover:rotate-90 transition-all"
                    >
                        <X size={22} />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                        <MessageCircle size={24} className="text-white" />
                    </div>
                    <h3 className={`text-xl ${s.fontTitle}`}>Product Enquiry</h3>
                    <p className={`text-[9px] text-white/70 mt-1 uppercase tracking-[0.2em] font-black`}>Secure Checkout Preview</p>
                </div>

                <div className="p-6 sm:p-8">
                    {isSuccess ? (
                        <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in slide-in-from-bottom-4">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce">
                                <CheckCircle2 size={40} />
                            </div>
                            <div>
                                <h4 className={`text-lg font-black text-gray-900 ${s.fontBody}`}>DRAFT SAVED!</h4>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-widest">Bridging to WhatsApp...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={`space-y-6 ${s.fontBody}`}>
                            {/* Product Info Bar */}
                            <div className="flex items-center gap-4 p-3 bg-gray-50/80 rounded-xl border border-gray-100 hover:bg-white transition-all group">
                                <div className={`w-14 h-14 ${s.radius} overflow-hidden bg-white shrink-0 border border-gray-100 shadow-sm`}>
                                    <img 
                                        src={product.main_image ? `${UPLOADS_BASE_URL}/${product.main_image}` : (product.images && product.images[0] ? `${UPLOADS_BASE_URL}/${product.images[0]}` : '')} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                        alt="" 
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
                                    <p className={`text-sm font-black text-gray-900 truncate leading-tight tracking-tighter`}>{product.name}</p>
                                    <div className="flex gap-3 mt-1 text-[10px] font-black uppercase text-gray-400">
                                        <span className={s.text}>{selectedSize || 'STD'} SIZE</span>
                                        <span className="w-px h-3 bg-gray-200" />
                                        <span className={s.text}>{selectedColor || 'STD'} COLOR</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Customer Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-300 pointer-events-none">
                                            <User size={16} />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 ${s.radius} text-sm focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-200 transition-all placeholder:text-gray-300`}
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Contact Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-300 pointer-events-none">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => {
                                                const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setFormData({ ...formData, phone: cleaned });
                                            }}
                                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 ${s.radius} text-sm focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-200 transition-all placeholder:text-gray-300`}
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full ${s.primary} ${s.hover} text-white py-4 ${s.radius} font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl ${s.shadow} disabled:opacity-50 active:scale-95`}
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={16} className="animate-pulse" />
                                        Start Conversation
                                    </>
                                )}
                            </button>
                            <p className="text-[9px] text-center text-gray-400 font-extrabold uppercase tracking-widest leading-relaxed">
                                Clicking above will open WhatsApp <br/> and send your curated selection to our team.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnquiryModal;
