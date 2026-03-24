import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, ImagePlus, Save, X, GripVertical, Plus } from 'lucide-react';
import { getHeroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide, uploadImage, UPLOADS_BASE_URL } from '../utils/api';

const emptySlide = { title: '', subtitle: '', description: '', image: '', sort_order: 0 };

const AdminHeroSlides = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [form, setForm] = useState(emptySlide);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    const fetchSlides = async () => {
        try {
            const res = await getHeroSlides();
            setSlides(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSlides(); }, []);

    const openAdd = () => {
        setEditingSlide(null);
        setForm(emptySlide);
        setImagePreview('');
        setShowForm(true);
    };

    const openEdit = (slide) => {
        setEditingSlide(slide);
        setForm({ ...slide });
        setImagePreview(slide.image ? `${UPLOADS_BASE_URL}/${slide.image}` : '');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingSlide(null);
        setForm(emptySlide);
        setImagePreview('');
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await uploadImage(formData);
            const filename = res.data.filename || res.data.image_url;
            if (!filename) throw new Error('No filename returned from server');
            setForm(prev => ({ ...prev, image: filename }));
            setImagePreview(`${UPLOADS_BASE_URL}/${filename}`);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Upload failed';
            alert(`Image upload failed: ${msg}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title) { alert('Title is required'); return; }
        setSaving(true);
        try {
            if (editingSlide) {
                await updateHeroSlide({ ...form, id: editingSlide.id });
            } else {
                await addHeroSlide(form);
            }
            await fetchSlides();
            closeForm();
        } catch (err) {
            alert('Failed to save slide.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this hero slide?')) return;
        try {
            await deleteHeroSlide(id);
            setSlides(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            alert('Failed to delete slide.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-transparent">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Hero Slides</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Manage the homepage carousel slides.</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-[#2F468C] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all hover:bg-[#24366e] shadow-sm"
                >
                    <Plus size={16} />
                    <span>Add Slide</span>
                </button>
            </div>

            {/* Slides List */}
            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1,2,3].map(n => <div key={n} className="h-20 bg-gray-100 rounded-xl" />)}
                </div>
            ) : slides.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                    <ImagePlus size={40} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium text-sm italic">No slides found in the collection.</p>
                    <button onClick={openAdd} className="mt-4 text-[#2F468C] text-xs font-bold underline underline-offset-4">Create your first slide</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {slides.map((slide, i) => (
                        <div key={slide.id} className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 hover:shadow-md transition-all">
                            <div className="text-gray-300 group-hover:text-gray-400 transition-colors">
                                <GripVertical size={18} />
                            </div>
                            
                            {/* Thumbnail */}
                            <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                {slide.image ? (
                                    <img src={`${UPLOADS_BASE_URL}/${slide.image}`} alt={slide.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] uppercase font-bold tracking-tighter">No Image</div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-sm truncate">{slide.title}</h3>
                                <p className="text-[11px] text-gray-400 truncate mt-0.5">{slide.subtitle}</p>
                            </div>

                            {/* Order */}
                            <div className="hidden sm:flex flex-col items-center justify-center px-4 border-l border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Order</span>
                                <span className="text-xs font-bold text-gray-700">{slide.sort_order || i + 1}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 pl-4 border-l border-gray-100">
                                <button
                                    onClick={() => openEdit(slide)}
                                    className="p-2 text-gray-400 hover:text-[#2F468C] hover:bg-gray-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(slide.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Slide Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-sm font-bold text-gray-800">
                                {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                            </h2>
                            <button onClick={closeForm} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Slide Image</label>
                                <div className="relative border-2 border-dashed border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:border-[#2F468C] transition-colors group">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                <label className="cursor-pointer bg-white text-gray-900 font-bold text-[10px] uppercase px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                                                    <ImagePlus size={14} /> Change Image
                                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                                            <ImagePlus size={24} className="text-gray-300 mb-2" />
                                            <span className="text-[11px] font-medium text-gray-400">{uploading ? 'Processing...' : 'Upload slide image'}</span>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Title */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title *</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Headline title"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2F468C]/20 focus:border-[#2F468C] transition-all"
                                        required
                                    />
                                </div>

                                {/* Subtitle */}
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtitle</label>
                                    <input
                                        type="text"
                                        value={form.subtitle}
                                        onChange={e => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                                        placeholder="Sub-headline"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2F468C]/20 focus:border-[#2F468C] transition-all"
                                    />
                                </div>

                                {/* Sort Order */}
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort Order</label>
                                    <input
                                        type="number"
                                        value={form.sort_order}
                                        onChange={e => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                                        min={0}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2F468C]/20 focus:border-[#2F468C] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Marketing message for the slide..."
                                    rows={2}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2F468C]/20 focus:border-[#2F468C] transition-all resize-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving || uploading}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#2F468C] text-white px-6 py-2.5 rounded-lg font-bold text-xs hover:bg-[#24366e] transition-all disabled:opacity-50 shadow-sm"
                                >
                                    <Save size={14} />
                                    {saving ? 'Processing...' : (editingSlide ? 'Update Slide' : 'Save Slide')}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-6 py-2.5 rounded-lg font-bold text-xs text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHeroSlides;
