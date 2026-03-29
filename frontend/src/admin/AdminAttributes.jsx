import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, Layers, Maximize, Palette } from 'lucide-react';
import { getAttributes, manageAttribute } from '../utils/api';

// Sub-components
import AttributeList from './components/Attributes/AttributeList';
import AttributeModal from './components/Attributes/AttributeModal';

const AdminAttributes = () => {
    const [attributes, setAttributes] = useState({ categories: [], sizes: [], colors: [] });
    const [loading, setLoading] = useState(true);
    const [openSections, setOpenSections] = useState({ categories: true, sizes: false, colors: false });
    const [searchTerm, setSearchTerm] = useState({ categories: '', sizes: '', colors: '' });
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modalData, setModalData] = useState({ type: '', action: '', id: '', name: '', hex_code: '#000000' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAttributes();
            setAttributes(res.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            await manageAttribute(modalData);
            setShowModal(false);
            fetchData();
        } catch (err) { alert("Action failed: " + err.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (type, id) => {
        if (!confirm(`Are you sure?`)) return;
        try {
            await manageAttribute({ type, action: 'delete', id });
            fetchData();
        } catch (err) { alert(err.message); }
    };

    const handleToggle = async (type, id) => {
        try {
            await manageAttribute({ type, action: 'toggle', id });
            fetchData();
        } catch (err) { alert(err.message); }
    };

    const openModal = (type, action, item = null) => {
        setModalData({
            type, action,
            id: item?.id || '',
            name: item?.name || '',
            hex_code: item?.hex_code || '#000000'
        });
        setShowModal(true);
    };

    const toggleSection = (sectionId) => {
        setOpenSections(prev => {
            const isCurrentlyOpen = prev[sectionId];
            return {
                categories: false,
                sizes: false,
                colors: false,
                [sectionId]: !isCurrentlyOpen
            };
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F468C]"></div>
        </div>
    );

    const sections = [
        { id: 'categories', label: 'Product Categories', icon: <Layers size={16} />, plural: 'Categories', singular: 'category' },
        { id: 'sizes', label: 'Sizing Units', icon: <Maximize size={16} />, plural: 'Sizes', singular: 'size' },
        { id: 'colors', label: 'Color Palette', icon: <Palette size={16} />, plural: 'Colors', singular: 'color' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-4 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="text-left mb-8">
                <h1 className="text-xl font-black text-gray-900 tracking-tight font-serif uppercase">System Attributes</h1>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest leading-relaxed">Manage your store's core classification and variations.</p>
            </div>

            {/* Accordion Stack */}
            <div className="space-y-4">
                {sections.map(section => (
                    <div key={section.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-500">
                        {/* Section Header */}
                        <div 
                            onClick={() => toggleSection(section.id)}
                            className={`flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50/50 transition-all ${openSections[section.id] ? 'bg-gray-50/30 border-b border-gray-50' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${openSections[section.id] ? 'bg-[#2F468C] text-white shadow-lg shadow-[#2F468C]/20' : 'bg-gray-50 text-gray-400'} transition-all`}>
                                    {section.icon}
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-800">{section.label}</h3>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
                                        {attributes[section.id]?.length || 0} ITEMS TOTAL
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        openModal(section.singular, 'add'); 
                                    }}
                                    className="p-2.5 rounded-xl bg-white border border-gray-100 text-[#2F468C] hover:bg-[#2F468C] hover:text-white transition-all shadow-sm group/btn"
                                >
                                    <Plus size={16} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                                <div className="text-gray-300">
                                    {openSections[section.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Content */}
                        <div className={`transition-all duration-500 ease-in-out ${openSections[section.id] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                            <div className="p-6">
                                <AttributeList 
                                    singular={section.singular}
                                    activeTab={section.id}
                                    list={(attributes[section.id] || []).filter(i => i.name.toLowerCase().includes(searchTerm[section.id].toLowerCase()))}
                                    searchTerm={searchTerm[section.id]}
                                    onSearch={(val) => setSearchTerm(prev => ({ ...prev, [section.id]: val }))}
                                    onToggle={handleToggle}
                                    onEdit={openModal}
                                    onDelete={handleDelete}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AttributeModal 
                isOpen={showModal}
                data={modalData}
                saving={saving}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                onChange={setModalData}
            />
        </div>
    );
};

export default AdminAttributes;
