import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Upload, Trash2, Plus, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { addProduct, updateProduct, getProductById, uploadImage, UPLOADS_BASE_URL } from '../utils/api';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        product_code: '',
        name: '',
        description: '',
        category: 'Premium Abaya',
        price: '',
        offer_price: '',
        stock_status: 'In Stock',
        sizes: [], 
        images: []
    });
    
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const availableSizes = ['S', 'M', 'L', 'XL'];

    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                try {
                    const res = await getProductById(id);
                    const prod = res.data;
                    setFormData({
                        ...prod,
                        sizes: prod.sizes ? prod.sizes.split(',') : [],
                        images: prod.images || []
                    });
                    if (prod.images) {
                        setPreviews(prod.images.map(img => `${UPLOADS_BASE_URL}/${img}`));
                    }
                } catch (err) {
                    console.error("Load failed", err);
                }
            };
            fetchProduct();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes: newSizes };
        });
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setLoading(true);
        try {
            const newImages = [];
            const newPreviews = [];

            for (const file of files) {
                const uploadData = new FormData();
                uploadData.append('image', file);
                const uploadRes = await uploadImage(uploadData);
                const filename = uploadRes.data.filename || uploadRes.data.image_url;
                newImages.push(filename);
                newPreviews.push(`${UPLOADS_BASE_URL}/${filename}`);
            }

            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
            setPreviews(prev => [...prev, ...newPreviews]);
        } catch (error) {
            alert("Image upload failed");
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.images.length === 0) {
            alert("Please upload at least one image");
            return;
        }
        
        setLoading(true);
        try {
            const payload = {
                ...formData,
                sizes: formData.sizes.join(',')
            };

            if (isEdit) {
                await updateProduct(payload);
            } else {
                await addProduct(payload);
            }

            navigate('/admin/products');
        } catch (error) {
            console.error("Submit failed", error);
            alert("Action failed. Check product code uniqueness.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin/products')} 
                        className="p-2 -ml-2 text-gray-400 hover:text-gray-900 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition-all"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                        <p className="text-xs text-gray-500 mt-0.5">{isEdit ? 'Update details for your collection piece.' : 'List a new design in your boutique.'}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                         type="button"
                         onClick={() => navigate('/admin/products')}
                         className="px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading || !formData.name}
                        className="flex items-center gap-2 bg-[#2F468C] text-white px-5 py-2 rounded-lg text-xs font-bold transition-all hover:bg-[#24366e] shadow-sm disabled:opacity-50"
                    >
                        <Save size={14} />
                        <span>{loading ? 'Saving...' : (isEdit ? 'Save Product' : 'Publish Product')}</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
                
                {/* Left Side: General Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Code *</label>
                                <input 
                                    type="text" 
                                    name="product_code"
                                    required
                                    value={formData.product_code}
                                    onChange={handleChange}
                                    placeholder="e.g. AB-123"
                                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F468C]/10 focus:border-[#2F468C] text-xs outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Title / Name *</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Product Name"
                                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F468C]/10 focus:border-[#2F468C] text-xs outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category *</label>
                                <select 
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F468C]/10 focus:border-[#2F468C] text-xs outline-none cursor-pointer transition-all"
                                >
                                    <option value="Children's Abaya">Children's Abaya</option>
                                    <option value="Gloves & Socks">Gloves & Socks</option>
                                    <option value="Niqab">Niqab</option>
                                    <option value="Premium Abaya">Premium Abaya</option>
                                    <option value="Scarf">Scarf</option>
                                    <option value="Standard Abaya">Standard Abaya</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock Status *</label>
                                <div className="flex gap-4 pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="stock_status" 
                                            value="In Stock" 
                                            checked={formData.stock_status === 'In Stock'}
                                            onChange={handleChange}
                                            className="w-3.5 h-3.5 text-[#2F468C] border-gray-300 focus:ring-0"
                                        />
                                        <span className={`text-[11px] font-bold uppercase tracking-tighter ${formData.stock_status === 'In Stock' ? 'text-[#2F468C]' : 'text-gray-400 group-hover:text-gray-600'}`}>In Stock</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="stock_status" 
                                            value="Out of Stock" 
                                            checked={formData.stock_status === 'Out of Stock'}
                                            onChange={handleChange}
                                            className="w-3.5 h-3.5 text-red-500 border-gray-300 focus:ring-0"
                                        />
                                        <span className={`text-[11px] font-bold uppercase tracking-tighter ${formData.stock_status === 'Out of Stock' ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'}`}>Sold Out</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Base Price (₹) *</label>
                                <input 
                                    type="number" 
                                    name="price"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00" 
                                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F468C]/10 focus:border-[#2F468C] text-xs transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Offer Price (₹)</label>
                                <input 
                                    type="number" 
                                    name="offer_price"
                                    value={formData.offer_price || ''}
                                    onChange={handleChange}
                                    placeholder="Optional" 
                                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F468C]/10 focus:border-[#2F468C] text-xs transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Available Sizes</label>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {availableSizes.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSizeToggle(size)}
                                        className={`w-10 h-10 rounded-lg text-[11px] font-bold transition-all border ${formData.sizes.includes(size) ? 'bg-[#2F468C] text-white border-[#2F468C] shadow-sm' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description / Details</label>
                            <textarea 
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Fabric specifications, wash care, etc..."
                                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2F468C]/10 focus:border-[#2F468C] text-xs outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Gallery</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Drag to reorder not available (main image is first)</p>
                            </div>
                            <label className="cursor-pointer bg-gray-50 text-[#2F468C] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all flex items-center gap-1.5">
                                <Plus size={14} /> Add Images
                                <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {previews.map((url, i) => (
                                <div key={i} className="relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 group">
                                    <img src={url} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage(i)}
                                            className="text-white bg-red-500 p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                    {i === 0 && (
                                        <div className="absolute top-1.5 left-1.5 bg-[#2F468C] text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shadow-sm">Main</div>
                                    )}
                                </div>
                            ))}
                            {previews.length === 0 && !loading && (
                                <label className="col-span-full border-2 border-dashed border-gray-100 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-[#2F468C]/30 hover:bg-gray-50/50 transition-all group">
                                    <Upload size={24} className="text-gray-300 group-hover:text-[#2F468C] mb-2" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-500">Select Images</span>
                                    <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
                                </label>
                            )}
                            {loading && (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center gap-3">
                                   <div className="w-8 h-8 border-2 border-gray-100 border-t-[#2F468C] rounded-full animate-spin" />
                                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Uploading Gallery...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Preview / Actions */}
                <div className="space-y-6">
                    <div className="bg-[#1a2340] p-6 rounded-xl shadow-xl text-white space-y-5 sticky top-24">
                        <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <ImageIcon size={16} className="text-blue-400" />
                            </div>
                            <h3 className="font-bold text-sm tracking-tight text-white/90">Preview</h3>
                        </div>

                        <div className="space-y-4 pt-1">
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Reference & Category</p>
                                <p className="text-xs font-medium text-white/80">{formData.product_code || 'No Code'} • {formData.category}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Title</p>
                                <p className="font-bold text-base uppercase tracking-wider truncate text-white">{formData.name || 'Set a name'}</p>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Price</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-xl font-bold">₹{formData.offer_price || formData.price || '0.00'}</p>
                                    {formData.offer_price && (
                                        <p className="text-[10px] text-white/40 line-through">₹{formData.price}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Stock Status</p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${formData.stock_status === 'In Stock' ? 'text-green-400' : 'text-red-400'}`}>
                                    {formData.stock_status}
                                </p>
                            </div>

                            <div className="flex gap-1.5 pt-1">
                                {formData.sizes.map(s => (
                                    <span key={s} className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-bold bg-white/5">{s}</span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="pt-4 space-y-3">
                            <button 
                                onClick={handleSubmit}
                                disabled={loading || !formData.name}
                                className="w-full bg-white text-[#2F468C] py-3.5 rounded-lg font-bold uppercase tracking-[0.15em] text-[11px] hover:bg-gray-100 transition-all shadow-lg shadow-black/20 disabled:opacity-50"
                            >
                                {isEdit ? 'Update Details' : 'Launch Design'}
                            </button>
                            <p className="text-[10px] text-center text-white/30 italic">Check all details before publishing</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
