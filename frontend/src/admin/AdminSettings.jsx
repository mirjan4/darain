import React, { useState, useEffect } from 'react';
import { 
    ImagePlus, Save, Globe, Phone, Mail, MapPin, 
    Check, Info, Type, FileText, Layers, Plus, 
    Pencil, Trash2, X, GripVertical 
} from 'lucide-react';
import { 
    getSettings, updateSettings, uploadImage, UPLOADS_BASE_URL,
    getHeroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide 
} from '../utils/api';
import { useSettings } from '../context/SettingsContext';

const emptySlide = { title: '', subtitle: '', description: '', image: '', sort_order: 0 };

const AdminSettings = () => {
    // Settings State
    const [settings, setSettings] = useState({
        logo: null, favicon: null, theme: 'default',
        phone: '', whatsapp: '', email: '', address: '', business_hours: '', map_embed_url: '',
        about_title: '', about_subtitle: '', about_description: '', about_image: null,
        top_bar_text: '',
    });
    
    // Global Context helper
    const { refreshSettings } = useSettings();
    
    // Hero Slides State
    const [slides, setSlides] = useState([]);
    const [slidesLoading, setSlidesLoading] = useState(true);
    const [showSlideForm, setShowSlideForm] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [slideForm, setSlideForm] = useState(emptySlide);
    const [slideImagePreview, setSlideImagePreview] = useState('');

    // Common UI State
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState({ logo: false, favicon: false, about_image: false, slide: false });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('branding');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [setRes, hRes] = await Promise.all([getSettings(), getHeroSlides()]);
                setSettings(prev => ({ ...prev, ...(setRes.data.data || {}) }));
                setSlides(hRes.data.data || []);
            } catch (e) {
                console.error("Fetch failed", e);
            } finally {
                setLoading(false);
                setSlidesLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- SETTINGS LOGIC ---
    const handleUpload = async (field, file) => {
        if (!file) return;
        setUploading(prev => ({ ...prev, [field]: true }));
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await uploadImage(formData);
            const filename = res.data.filename || res.data.image_url;
            setSettings(prev => ({ ...prev, [field]: filename }));
        } catch (e) { alert(`Upload failed for ${field}`); }
        finally { setUploading(prev => ({ ...prev, [field]: false })); }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            await updateSettings(settings);
            setSuccess('Settings saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) { alert('Failed to save settings.'); }
        finally { setSaving(false); }
    };

    const applyTheme = async (newTheme) => {
        setSaving(true);
        const updatedSettings = { ...settings, theme: newTheme };
        setSettings(updatedSettings);
        try {
            await updateSettings(updatedSettings);
            await refreshSettings(); // Update global context immediately
            setSuccess(`Switched to ${newTheme} theme!`);
            setTimeout(() => setSuccess(''), 2000);
        } catch (error) {
            alert('Failed to change theme.');
        } finally {
            setSaving(false);
        }
    };

    // --- HERO SLIDES LOGIC ---
    const openAddSlide = () => {
        setEditingSlide(null);
        setSlideForm(emptySlide);
        setSlideImagePreview('');
        setShowSlideForm(true);
    };

    const openEditSlide = (slide) => {
        setEditingSlide(slide);
        setSlideForm({ ...slide });
        setSlideImagePreview(slide.image ? `${UPLOADS_BASE_URL}/${slide.image}` : '');
        setShowSlideForm(true);
    };

    const handleSlideImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(prev => ({ ...prev, slide: true }));
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await uploadImage(formData);
            const filename = res.data.filename || res.data.image_url;
            setSlideForm(prev => ({ ...prev, image: filename }));
            setSlideImagePreview(`${UPLOADS_BASE_URL}/${filename}`);
        } catch (err) { alert('Slide image upload failed'); }
        finally { setUploading(prev => ({ ...prev, slide: false })); }
    };

    const handleSaveSlide = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingSlide) {
                await updateHeroSlide({ ...slideForm, id: editingSlide.id });
            } else {
                await addHeroSlide(slideForm);
            }
            const res = await getHeroSlides();
            setSlides(res.data.data || []);
            setShowSlideForm(false);
            setSuccess('Slide saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) { alert('Failed to save slide'); }
        finally { setSaving(false); }
    };

    const handleDeleteSlide = async (id) => {
        if (!confirm('Delete this slide?')) return;
        try {
            await deleteHeroSlide(id);
            setSlides(prev => prev.filter(s => s.id !== id));
        } catch (err) { alert('Delete failed'); }
    };

    const tabs = [
        { id: 'branding', label: 'Branding', icon: <Globe size={16} /> },
        { id: 'contact', label: 'Contact Info', icon: <Phone size={16} /> },
        { id: 'about', label: 'About Page', icon: <Info size={16} /> },
        { id: 'hero', label: 'Hero Slides', icon: <Layers size={16} /> },
    ];

    if (loading) return (
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 font-sans">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-serif">Site Configuration</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage brand identity, static pages, and the homepage slider.</p>
                </div>
                {activeTab !== 'hero' && (
                    <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="bg-[#2F468C] text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#1a2b5c] shadow-lg shadow-[#2F468C]/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                    </button>
                )}
                {activeTab === 'hero' && (
                    <button
                        onClick={openAddSlide}
                        className="bg-[#2F468C] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#1a2b5c] shadow-lg shadow-[#2F468C]/20 flex items-center gap-2"
                    >
                        <Plus size={16} /> Add New Slide
                    </button>
                )}
            </div>

            {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
                    <Check size={16} /> {success}
                </div>
            )}

            {/* TAB LIST - Responsive Scrollable Bar */}
            <div className="relative border-b border-gray-100">
                <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar scroll-smooth">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all text-[11px] font-bold uppercase tracking-widest whitespace-nowrap outline-none ${
                                activeTab === tab.id
                                    ? 'border-[#2F468C] text-[#2F468C]'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT VIEWS */}
            <div className="pb-24">
                
                {activeTab === 'branding' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 border-b border-gray-50 pb-4">
                                <Globe size={14} /> Store Visuals
                            </h2>
                            <div className="space-y-8">
                                <div className="space-y-4 border-b border-gray-50 pb-8">
                                    <label className="text-xs font-bold text-gray-700 block">Brand Name</label>
                                    <input 
                                        type="text" 
                                        name="brand_name"
                                        value={settings.brand_name || ''} 
                                        onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} 
                                        placeholder="e.g. Darain Fashion"
                                        className="w-full text-sm font-medium border-2 border-gray-100 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#2F468C] focus:ring-4 focus:ring-[#2F468C]/10 transition-all placeholder:font-normal placeholder:text-gray-300 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-4 border-b border-gray-50 pb-8">
                                    <label className="text-xs font-bold text-gray-700 block">Top Bar Announcement</label>
                                    <input 
                                        type="text" 
                                        name="top_bar_text"
                                        value={settings.top_bar_text || ''} 
                                        onChange={(e) => setSettings({ ...settings, top_bar_text: e.target.value })} 
                                        placeholder="e.g. Free Shipping Over $50! Returns are always on us."
                                        className="w-full text-sm font-medium border-2 border-gray-100 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-[#2F468C] focus:ring-4 focus:ring-[#2F468C]/10 transition-all placeholder:font-normal placeholder:text-gray-300 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-700 block">Navigation Logo</label>
                                    <div className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        <div className="w-24 h-24 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-3 shadow-inner overflow-hidden shrink-0">
                                            {settings.logo ? <img src={`${UPLOADS_BASE_URL}/${settings.logo}`} className="w-full h-full object-contain" /> : <Globe className="text-gray-100" size={32} />}
                                        </div>
                                        <label className="flex-1">
                                            <div className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-[#2F468C] hover:bg-gray-50 transition-all text-center justify-center shadow-sm">
                                                <ImagePlus size={16} /> {uploading.logo ? '...' : 'Replace Logo'}
                                            </div>
                                            <input type="file" accept="image/*" onChange={e => handleUpload('logo', e.target.files[0])} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-700 block">Tab Icon (Favicon)</label>
                                    <div className="flex items-center gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                        <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-3 shadow-inner overflow-hidden shrink-0">
                                            {settings.favicon ? <img src={`${UPLOADS_BASE_URL}/${settings.favicon}`} className="w-full h-full object-contain" /> : <Globe className="text-gray-100" size={20} />}
                                        </div>
                                        <label className="flex-1">
                                            <div className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#2F468C] hover:bg-gray-50 transition-all text-center justify-center shadow-sm">
                                                <ImagePlus size={16} /> {uploading.favicon ? '...' : 'Change Icon'}
                                            </div>
                                            <input type="file" accept="image/*,.ico" onChange={e => handleUpload('favicon', e.target.files[0])} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Theme Selection Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 border-b border-gray-50 pb-4">
                                <Layers size={14} /> UI Theme
                            </h2>
                            <div className="space-y-6">
                                <label className="text-xs font-bold text-gray-700 block mb-2">Select Active Theme</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <button 
                                        type="button"
                                        onClick={() => applyTheme('default')}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${settings.theme === 'default' || !settings.theme ? 'border-[#2F468C] bg-[#2F468C]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    >
                                        <div className="w-16 h-12 bg-gray-50 rounded shadow-sm border border-gray-100 mb-3 flex flex-col gap-1 p-1">
                                            <div className="w-full h-2 bg-gray-200 rounded-sm"></div>
                                            <div className="flex gap-1 h-3 mt-auto">
                                                <div className="w-1/2 h-full bg-gray-200 rounded-sm"></div>
                                                <div className="w-1/2 h-full bg-gray-200 rounded-sm"></div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900">Default Classic</span>
                                        <span className="text-[10px] text-gray-400 mt-1">Rich boutique style</span>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => applyTheme('modern')}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${settings.theme === 'modern' ? 'border-[#2F468C] bg-[#2F468C]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    >
                                        <div className="w-16 h-12 bg-white rounded shadow-sm border border-gray-100 mb-3 flex flex-col gap-1 p-1">
                                            <div className="w-1/2 mx-auto h-2 bg-gray-100 rounded-sm"></div>
                                            <div className="flex gap-1 h-3 mt-auto">
                                                <div className="w-1/3 h-full bg-gray-100 rounded-sm"></div>
                                                <div className="w-1/3 h-full bg-gray-100 rounded-sm"></div>
                                                <div className="w-1/3 h-full bg-gray-100 rounded-sm"></div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900">Modern Minimal</span>
                                        <span className="text-[10px] text-gray-400 mt-1">Clean and breathable</span>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => applyTheme('dynamic')}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${settings.theme === 'dynamic' ? 'border-[#2F468C] bg-[#2F468C]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    >
                                        <div className="w-16 h-12 bg-[#1a1a1a] rounded shadow-sm border border-gray-100 mb-3 flex flex-col gap-1 p-1 overflow-hidden relative text-center items-center justify-center">
                                            <span className="text-[6px] text-white opacity-40 font-black">DYNAMIC</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900">Dynamic Multi</span>
                                        <span className="text-[10px] text-gray-400 mt-1">interactive & storytelling</span>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => applyTheme('motion-green')}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${settings.theme === 'motion-green' ? 'border-[#7FBFA6] bg-[#7FBFA6]/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    >
                                        <div className="w-16 h-12 bg-[#F8FAF9] rounded shadow-sm border border-[#EEF5F2] mb-3 flex flex-col gap-1 p-1 overflow-hidden relative text-center items-center justify-center">
                                            <div className="w-4 h-4 bg-[#7FBFA6] rounded-full animate-bounce"></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900">Motion Green</span>
                                        <span className="text-[10px] text-gray-400 mt-1">Soft Luxury & Motion</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4 flex items-center gap-2">
                                <Phone size={14} /> Contact Details
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Phone</label>
                                    <input value={settings.phone || ''} onChange={e => setSettings(p => ({ ...p, phone: e.target.value }))} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C] bg-gray-50/30 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">WhatsApp</label>
                                    <input value={settings.whatsapp || ''} onChange={e => setSettings(p => ({ ...p, whatsapp: e.target.value }))} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C] bg-gray-50/30 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Email</label>
                                    <input value={settings.email || ''} onChange={e => setSettings(p => ({ ...p, email: e.target.value }))} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C] bg-gray-50/30 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Shop Opening Hours (Time)</label>
                                    <input value={settings.business_hours || ''} onChange={e => setSettings(p => ({ ...p, business_hours: e.target.value }))} placeholder="e.g. Mon - Sat: 9:00 AM - 9:00 PM" className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C] bg-gray-50/30 transition-all" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4 flex items-center gap-2">
                                <MapPin size={14} /> Location Info
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Address</label>
                                    <textarea value={settings.address || ''} onChange={e => setSettings(p => ({ ...p, address: e.target.value }))} rows={4} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C] bg-gray-50/30 transition-all resize-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Map Embed Link</label>
                                    <input value={settings.map_embed_url || ''} onChange={e => setSettings(p => ({ ...p, map_embed_url: e.target.value }))} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-mono focus:border-[#2F468C] bg-gray-50/30 transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4 flex items-center gap-2">
                                    <Type size={14} /> Brand Story
                                </h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Section Subtitle</label>
                                            <input value={settings.about_subtitle || ''} onChange={e => setSettings(p => ({ ...p, about_subtitle: e.target.value }))} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C] font-semibold" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Main Heading</label>
                                            <input value={settings.about_title || ''} onChange={e => setSettings(p => ({ ...p, about_title: e.target.value }))} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C] font-semibold" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">The Story Content</label>
                                        <textarea value={settings.about_description || ''} onChange={e => setSettings(p => ({ ...p, about_description: e.target.value }))} rows={12} className="w-full border border-gray-100 rounded-xl px-5 py-4 text-sm focus:border-[#2F468C] bg-gray-50/30 leading-relaxed font-body" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Featured Image</h2>
                            <div className="aspect-[4/5] rounded-3xl bg-gray-50 border-2 border-dashed border-gray-100 overflow-hidden relative group">
                                {settings.about_image ? <img src={`${UPLOADS_BASE_URL}/${settings.about_image}`} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full"><ImagePlus className="text-gray-100 mb-2" size={40} /></div>}
                                <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <label className="cursor-pointer bg-[#2F468C] text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                                        {uploading.about_image ? '...' : 'Upload Image'}
                                        <input type="file" accept="image/*" onChange={e => handleUpload('about_image', e.target.files[0])} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'hero' && (
                    <div className="space-y-6">
                        {slides.length === 0 ? (
                            <div className="bg-white p-24 text-center rounded-3xl border-2 border-dashed border-gray-100">
                                <Layers size={48} className="text-gray-100 mx-auto mb-6" />
                                <h3 className="text-gray-900 font-bold font-serif italic text-lg">No slides defined</h3>
                                <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Create hero images for your boutique's homepage.</p>
                                <button onClick={openAddSlide} className="mt-8 text-[#2F468C] text-xs font-bold flex items-center gap-2 mx-auto hover:bg-gray-50 px-6 py-2 rounded-full transition-all border border-gray-100">
                                    <Plus size={16} /> Add First Slide
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                                {slides.map((slide, i) => (
                                    <div key={slide.id} className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="aspect-[16/9] overflow-hidden bg-gray-50">
                                            {slide.image ? <img src={`${UPLOADS_BASE_URL}/${slide.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><Layers size={32} /></div>}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="bg-gray-50 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-gray-100 uppercase tracking-tighter">Slide {slide.sort_order || i + 1}</span>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                    <button onClick={() => openEditSlide(slide)} className="p-2 bg-white rounded-full border border-gray-100 text-gray-400 hover:text-[#2F468C] hover:border-[#2F468C]/30 transition-all shadow-sm"><Pencil size={14} /></button>
                                                    <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 bg-white rounded-full border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-sm truncate">{slide.title || 'Untitled Slide'}</h3>
                                            <p className="text-[11px] text-gray-400 mt-1 truncate">{slide.subtitle || 'No subtitle provided'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* SLIDE EDITOR MODAL */}
            {showSlideForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-sm transition-all duration-500 animate-in fade-in">
                    <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/20 flex justify-between items-center">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#2F468C]">{editingSlide ? 'Edit Slide' : 'New Hero Slide'}</h2>
                            <button onClick={() => setShowSlideForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveSlide} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Visual Asset</label>
                                <div className="aspect-[21/9] border-2 border-dashed border-gray-100 rounded-3xl overflow-hidden bg-gray-50 relative group cursor-pointer">
                                    {slideImagePreview ? <img src={slideImagePreview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2"><ImagePlus size={32} /><span className="text-[10px] font-bold">1920 x 800 recommended</span></div>}
                                    <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                        <label className="cursor-pointer bg-[#2F468C] text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                                            {uploading.slide ? '...' : 'Upload Media'}
                                            <input type="file" accept="image/*" onChange={handleSlideImageUpload} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Main Heading</label>
                                    <input value={slideForm.title} onChange={e => setSlideForm(p => ({ ...p, title: e.target.value }))} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C] font-semibold" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Short Subtitle</label>
                                    <input value={slideForm.subtitle} onChange={e => setSlideForm(p => ({ ...p, subtitle: e.target.value }))} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Display Order</label>
                                    <input type="number" value={slideForm.sort_order} onChange={e => setSlideForm(p => ({ ...p, sort_order: e.target.value }))} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Mini Description</label>
                                <textarea value={slideForm.description} onChange={e => setSlideForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#2F468C] resize-none" />
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-gray-50">
                                <button type="submit" disabled={saving || uploading.slide} className="flex-1 bg-[#2F468C] text-white py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl hover:shadow-[#2F468C]/30 transition-all active:scale-95 disabled:opacity-50">
                                    {saving ? 'Processing...' : (editingSlide ? 'Update Feature' : 'Add to Slider')}
                                </button>
                                <button type="button" onClick={() => setShowSlideForm(false)} className="px-8 py-4 rounded-2xl bg-gray-50 text-gray-500 font-bold uppercase tracking-[0.2em] text-[11px] border border-gray-100 hover:bg-gray-100 transition-all">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
