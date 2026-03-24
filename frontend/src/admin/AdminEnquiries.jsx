import React, { useState, useEffect } from 'react';
import { 
    MessageCircle, Phone, Calendar, User, ShoppingBag, 
    ExternalLink, Inbox, Tag, CheckCircle, Clock, 
    Check, Trash2, History, Zap, Play, XCircle, 
    Archive, Filter, Search, MoreHorizontal
} from 'lucide-react';
import { getEnquiries, updateEnquiryStatus } from '../utils/api';
import toast from 'react-hot-toast';

const AdminEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchEnquiries = async () => {
        try {
            const res = await getEnquiries();
            setEnquiries(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Enquiry fetch error", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateEnquiryStatus(id, status);
            toast.success(`Moved to ${status}`);
            fetchEnquiries();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString();
    };

    const statusColors = {
        'New': 'bg-blue-50 text-blue-600 border-blue-100',
        'Contacted': 'bg-amber-50 text-amber-600 border-amber-100',
        'In Progress': 'bg-purple-50 text-purple-600 border-purple-100',
        'Confirmed': 'bg-green-50 text-green-600 border-green-100',
        'Closed': 'bg-red-50 text-red-600 border-red-100',
        'Archived': 'bg-gray-100 text-gray-500 border-gray-200'
    };

    // SEARCH & FILTER Logic
    const filteredResults = enquiries.filter(enq => {
        const matchesSearch = 
            enq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.phone?.includes(searchTerm) ||
            enq.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.product_code?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'All' || enq.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // CRM Segmentation:
    // 1. New Enquiries (Latest 5)
    // 2. History (Everything else)
    const newEnquiries = filteredResults.filter(e => e.status === 'New').slice(0, 5);
    const historyEnquiries = filteredResults.filter(e => !newEnquiries.find(ne => ne.id === e.id));

    const renderEnquiryCard = (enq, isHistory = false) => (
        <div key={enq.id} className={`group bg-white rounded-2xl border ${isHistory ? 'border-gray-50 opacity-90' : 'border-gray-100 shadow-sm'} hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-6 p-6`}>
            
            {/* Lead Meta */}
            <div className="flex-shrink-0 md:w-48 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm ${statusColors[enq.status]?.split(' ')[1]}`}>
                        <User size={14} />
                    </div>
                    <span className="text-sm font-bold text-gray-900 truncate">{enq.name}</span>
                </div>
                <div className="space-y-2">
                    <a href={`tel:${enq.phone}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#2F468C] font-semibold">
                        <Phone size={14} className="opacity-40" />
                        {enq.phone}
                    </a>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-80">
                        <Clock size={14} className="opacity-40" />
                        {timeAgo(enq.created_at)}
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                        <ShoppingBag size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-700">{enq.product_name || "General Selection"}</span>
                    </div>
                    
                    {enq.selected_size && (
                        <div className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-bold uppercase border border-gray-100">
                            {enq.selected_size}
                        </div>
                    )}

                    <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusColors[enq.status] || statusColors['New']}`}>
                        {enq.status || 'New'}
                    </div>
                </div>

                <div className="bg-gray-50/70 p-4 rounded-xl relative group-hover:bg-gray-50 transition-colors border border-gray-50">
                     <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                        "{enq.message || "No message provided."}"
                     </p>
                </div>
            </div>

            {/* CRM Workflow Controls */}
            <div className="flex-shrink-0 flex flex-col gap-2 min-w-[160px]">
                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => handleStatusUpdate(enq.id, 'Contacted')}
                        className={`p-2 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${enq.status === 'Contacted' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-500 border-amber-100 hover:bg-amber-50'}`}
                        title="Mark as Contacted"
                    >
                        <Phone size={12} /> Contact
                    </button>
                    <button 
                        onClick={() => handleStatusUpdate(enq.id, 'In Progress')}
                        className={`p-2 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${enq.status === 'In Progress' ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-purple-500 border-purple-100 hover:bg-purple-50'}`}
                        title="Mark as In Progress"
                    >
                        <Play size={12} /> Progress
                    </button>
                    <button 
                        onClick={() => handleStatusUpdate(enq.id, 'Confirmed')}
                        className={`p-2 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${enq.status === 'Confirmed' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-green-500 border-green-100 hover:bg-green-50'}`}
                        title="Mark as Confirmed"
                    >
                        <CheckCircle size={12} /> Confirm
                    </button>
                    <button 
                        onClick={() => handleStatusUpdate(enq.id, 'Closed')}
                        className={`p-2 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${enq.status === 'Closed' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-500 border-red-100 hover:bg-red-50'}`}
                        title="Mark as Closed"
                    >
                        <XCircle size={12} /> Close
                    </button>
                </div>
                
                <button 
                    onClick={() => handleStatusUpdate(enq.id, 'Archived')}
                    className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${enq.status === 'Archived' ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    <Archive size={12} />
                    {enq.status === 'Archived' ? 'Archived' : 'Move to Archive'}
                </button>

                <a 
                    href={`https://api.whatsapp.com/send/?phone=${enq.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-all"
                >
                    <MessageCircle size={14} />
                    WhatsApp
                </a>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-serif">CRM Enquiries</h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time customer pipeline management.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all font-bold text-[11px] uppercase tracking-wider ${showHistory ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm'}`}
                    >
                        <History size={14} />
                        {showHistory ? 'Hide History' : 'View History'}
                    </button>
                    <div className="bg-[#2F468C]/5 px-4 py-2 rounded-full border border-[#2F468C]/10 text-[#2F468C] font-bold text-xs flex items-center gap-2">
                        <Zap size={14} />
                        {filteredResults.length} leads
                    </div>
                </div>
            </div>

            {/* CRM Search & Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search name, phone, or product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2F468C]/10 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Filter size={16} className="text-gray-400 ml-2" />
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full md:w-48 px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 focus:ring-2 focus:ring-[#2F468C]/10 cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Closed">Closed</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(n => <div key={n} className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
                </div>
            ) : filteredResults.length > 0 ? (
                <>
                    {/* Latest Section (Status New) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-900 border-l-4 border-blue-500 pl-4">
                             <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">New Leads (Top 5 Priority)</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {newEnquiries.map(enq => renderEnquiryCard(enq))}
                            {newEnquiries.length === 0 && (
                                <div className="bg-white/50 p-8 rounded-2xl border border-dashed border-gray-100 text-center">
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">No new priority leads.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* History / Other Enquiries */}
                    {showHistory && (
                        <div className="space-y-4 pt-6 mt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-gray-500 border-l-4 border-gray-300 pl-4">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Workflow History</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {historyEnquiries.length > 0 ? (
                                    historyEnquiries.map(enq => renderEnquiryCard(enq, true))
                                ) : (
                                    <p className="text-gray-400 text-xs italic p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">No history found for current filter.</p>
                                )}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white p-24 text-center rounded-3xl border border-gray-100 flex flex-col items-center justify-center">
                    <Inbox size={64} className="text-gray-200 mb-6" />
                    <h3 className="text-gray-900 font-bold text-lg font-serif">Inbox Clean!</h3>
                    <p className="text-xs text-gray-400 font-medium mt-2 uppercase tracking-widest">No matching enquiries found.</p>
                </div>
            )}
        </div>
    );
};

export default AdminEnquiries;
