import React, { useState, useEffect } from 'react';
import { 
    MessageCircle, Phone, Calendar, User, ShoppingBag, 
    Inbox, Tag, CheckCircle, Clock, 
    Trash2, Play, XCircle, 
    Archive, Filter, Search, ChevronLeft, RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEnquiries, updateEnquiryStatus } from '../utils/api';
import toast from 'react-hot-toast';

const AdminEnquiryHistory = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
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
        'New Lead': 'bg-blue-50 text-blue-600 border-blue-100',
        'Contacted': 'bg-amber-50 text-amber-600 border-amber-100',
        'In Progress': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'Confirmed': 'bg-teal-50 text-teal-600 border-teal-100',
        'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Closed Won': 'bg-green-600 text-white border-green-700 font-extrabold',
        'Rejected': 'bg-orange-50 text-orange-600 border-orange-100',
        'Closed': 'bg-red-50 text-red-600 border-red-100',
        'Closed Lost': 'bg-red-600 text-white border-red-700 font-extrabold',
        'Archived': 'bg-gray-100 text-gray-500 border-gray-200'
    };

    const filteredResults = enquiries.filter(enq => {
        const matchesSearch = 
            enq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.phone?.includes(searchTerm) ||
            enq.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.product_code?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'All' || enq.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <Link to="/admin/enquiries" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-bold text-xs uppercase tracking-widest">
                    <ChevronLeft size={16} /> Back to Dashboard
                </Link>
                <div className="bg-gray-100 px-4 py-2 rounded-full text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                    Total Database: {enquiries.length} Enquiries
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-serif">Enquiry History</h1>
                    <p className="text-sm text-gray-500 mt-1">Full archive of customer interactions and leads.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search archives..."
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
                        <option value="All">All Items</option>
                        <option value="New Lead">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(n => <div key={n} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
                </div>
            ) : filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredResults.map(enq => (
                        <div key={enq.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-6 p-6">
                            <div className="flex-shrink-0 md:w-48">
                                <p className="text-sm font-bold text-gray-900">{enq.name}</p>
                                <p className="text-xs text-gray-500 font-semibold">{enq.phone}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">{timeAgo(enq.created_at)}</p>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-100 tracking-tight">{enq.product_name || "General Enquiry"}</span>
                                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border shadow-sm ${statusColors[enq.status] || statusColors['New Lead']}`}>
                                        {enq.status || 'NEW LEAD'}
                                    </span>
                                    {enq.is_archived == 1 && (
                                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100 flex items-center gap-1 italic">
                                            <Archive size={10} /> In Storage
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 italic leading-relaxed">"{enq.message || "No message provided."}"</p>
                            </div>
                            <div className="flex gap-2">
                                {enq.is_archived == 1 ? (
                                    <button 
                                        onClick={() => handleStatusUpdate(enq.id, 'New Lead')} 
                                        className="px-4 py-2 bg-[#2F468C]/5 text-[#2F468C] font-black text-[10px] uppercase flex items-center gap-2 hover:bg-[#2F468C]/10 rounded-xl transition-all border border-[#2F468C]/10"
                                        title="Restore to Pipeline"
                                    >
                                        <RotateCcw size={14}/> Restore
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleStatusUpdate(enq.id, 'Archived')} 
                                        className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100" 
                                        title="Move to Archive"
                                    >
                                        <Archive size={18}/>
                                    </button>
                                )}
                                <a 
                                    href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent("Hello! Contacting you regarding your recent boutique enquiry.")}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-3 bg-green-50 text-green-500 hover:bg-green-100 rounded-xl transition-all border border-green-100"
                                    title="WhatsApp Follow-up"
                                >
                                    <MessageCircle size={18}/>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-24 text-center rounded-3xl border border-gray-100">
                    <Inbox size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No matching history found.</p>
                </div>
            )}
        </div>
    );
};

export default AdminEnquiryHistory;
