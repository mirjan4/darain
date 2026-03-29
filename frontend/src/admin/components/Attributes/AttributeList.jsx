import React from 'react';
import { Search, AlertCircle, Check, X, Pencil, Trash2 } from 'lucide-react';

const AttributeList = ({ activeTab, list, searchTerm, onSearch, onToggle, onEdit, onDelete, singular }) => {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* COMPACT SEARCH BAR */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50/50 border border-gray-100 rounded-2xl group focus-within:bg-white focus-within:border-[#2F468C] transition-all">
                <Search size={14} className="text-gray-300 group-focus-within:text-[#2F468C]" />
                <input 
                    type="text" 
                    placeholder={`Filter ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="flex-1 py-1.5 text-[11px] font-bold text-gray-700 bg-transparent outline-none placeholder:text-gray-200 uppercase tracking-widest"
                />
            </div>

            {/* COMPACT TABLE */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-[#fcfdfe] border-b border-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Detail</th>
                            {activeTab === 'colors' && <th className="px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Preview</th>}
                            <th className="px-5 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-5 py-3 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {list.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-5 py-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-gray-200">
                                        <AlertCircle size={32} strokeWidth={1.5} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">No Matches</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            list.map(item => (
                                <tr key={item.id} className="group hover:bg-gray-50/30 transition-all font-sans">
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-gray-800 uppercase tracking-wide">{item.name}</span>
                                            {item.slug && <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter truncate max-w-[120px]">{item.slug}</span>}
                                            {item.hex_code && <span className="text-[8px] font-bold text-gray-300 uppercase font-mono tracking-tighter truncate">{item.hex_code}</span>}
                                        </div>
                                    </td>
                                    {activeTab === 'colors' && (
                                        <td className="px-5 py-4">
                                            <div 
                                                className="w-8 h-8 rounded-xl shadow-inner border border-gray-200" 
                                                style={{ backgroundColor: item.hex_code }}
                                            />
                                        </td>
                                    )}
                                    <td className="px-5 py-4 text-center">
                                        <button 
                                            onClick={() => onToggle(singular, item.id)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border ${
                                                item.is_active 
                                                ? 'bg-green-50 text-green-600 border-green-100' 
                                                : 'bg-gray-50 text-gray-400 border-gray-100 opacity-60'
                                            }`}
                                        >
                                            <div className={`w-1 h-1 rounded-full ${item.is_active ? 'bg-green-600' : 'bg-gray-400'}`} />
                                            {item.is_active ? 'Active' : 'Disabled'}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => onEdit(singular, item)} 
                                                className="p-2 text-gray-400 hover:text-[#2F468C] hover:bg-gray-100 rounded-lg transition-all"
                                            >
                                                <Pencil size={12} strokeWidth={2.5}/>
                                            </button>
                                            <button 
                                                onClick={() => onDelete(singular, item.id)} 
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={12} strokeWidth={2.5}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttributeList;
