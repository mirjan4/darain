import React from 'react';
import { Plus, Pencil, X, Hash } from 'lucide-react';

const AttributeModal = ({ isOpen, data, saving, onClose, onSave, onChange }) => {
    if (!isOpen) return null;

    const colorPalettes = ['#000000','#FFFFFF','#E8DCC8','#7FBFA6','#800000','#704214','#D4AF37'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-950/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#2F468C]">
                            {data.action === 'add' ? <Plus size={20} strokeWidth={3}/> : <Pencil size={18}/>}
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[.2em] text-[#2F468C]">{data.action} {data.type}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update your boutique configuration</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 transition-all"><X size={20} /></button>
                </div>
                
                <form onSubmit={onSave} className="p-10 space-y-8 text-left">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Display Name</label>
                            <input 
                                type="text" 
                                required
                                value={data.name}
                                onChange={(e) => onChange({...data, name: e.target.value})}
                                placeholder={`Enter ${data.type} name`}
                                className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#2F468C] focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
                            />
                        </div>

                        {data.type === 'color' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-6">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Hex Code</label>
                                        <div className="relative">
                                            <Hash size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input 
                                                type="text" 
                                                required
                                                value={data.hex_code}
                                                onChange={(e) => onChange({...data, hex_code: e.target.value})}
                                                placeholder="#000000"
                                                className="w-full bg-gray-50/50 border-2 border-transparent focus:border-[#2F468C] focus:bg-white rounded-2xl pl-12 pr-6 py-4 text-sm font-mono font-bold transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-20 h-20 rounded-3xl border-2 border-gray-100 shadow-inner flex-shrink-0" style={{ backgroundColor: data.hex_code }}></div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {colorPalettes.map(c => (
                                        <button key={c} type="button" onClick={() => onChange({...data, hex_code: c})} className="w-7 h-7 rounded-lg border border-gray-100 shadow-sm transition-transform hover:scale-110" style={{backgroundColor: c}}></button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-[#2F468C] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-[#2F468C]/30 hover:shadow-[#2F468C]/50 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {saving ? 'Processing...' : data.action === 'add' ? 'Create Attribute' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl bg-gray-50 text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] border border-gray-100 hover:bg-gray-100 transition-all">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AttributeModal;
