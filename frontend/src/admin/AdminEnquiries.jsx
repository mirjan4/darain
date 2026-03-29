import React, { useState, useEffect } from 'react';
import { 
    MessageCircle, Phone, Calendar, User, ShoppingBag, 
    Inbox, Tag, CheckCircle, Clock, 
    Zap, Play, XCircle, 
    Archive, Filter, Search, History,
    ChevronRight, ArrowRight, Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEnquiries, updateEnquiryStatus } from '../utils/api';
import toast from 'react-hot-toast';

const AdminEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Active');
    const [displayLimit, setDisplayLimit] = useState(10);

    const fetchEnquiries = async () => {
        try {
            const res = await getEnquiries();
            // Sort by latest first
            const data = (res.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setEnquiries(data);
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
        'New': 'bg-blue-50 text-blue-600 border-blue-100', // Legacy
        'New Lead': 'bg-blue-50 text-blue-600 border-blue-100',
        'Contacted': 'bg-amber-50 text-amber-600 border-amber-100',
        'In Progress': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'Confirmed': 'bg-teal-50 text-teal-600 border-teal-100',
        'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Closed Won': 'bg-green-600 text-white border-green-700 font-extrabold',
        'Rejected': 'bg-orange-50 text-orange-600 border-orange-100',
        'Closed': 'bg-red-50 text-red-600 border-red-100', // Legacy
        'Closed Lost': 'bg-red-600 text-white border-red-700 font-extrabold',
        'Archived': 'bg-gray-100 text-gray-500 border-gray-200'
    };

    const filtered = enquiries.filter(enq => {
        const matchesSearch = 
            enq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.phone?.includes(searchTerm);
        
        if (filterStatus === 'Active') {
            // New logic: Only hide if explicitly archived
            return matchesSearch && enq.is_archived != 1;
        }
        const matchesStatus = filterStatus === 'All' || enq.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const activeLeads = filtered;
    const displayLeads = activeLeads.slice(0, displayLimit);

    const renderEnquiryCard = (enq) => {
        // Force status to "New Lead" if null/empty for visual purposes
        const normalizedStatus = enq.status || 'New Lead';

        const nextStepsMapping = {
            'New': [
                { status: 'Contacted', label: 'Contacted', color: 'text-amber-500 border-amber-100 hover:bg-amber-50', icon: Phone },
            ],
            'New Lead': [
                { status: 'Contacted', label: 'Contacted', color: 'text-amber-500 border-amber-100 hover:bg-amber-50', icon: Phone },
            ],
            'Contacted': [
                { status: 'In Progress', label: 'Start Work', color: 'text-indigo-500 border-indigo-100 hover:bg-indigo-50', icon: Play },
            ],
            'In Progress': [
                { status: 'Confirmed', label: 'Confirmed', color: 'text-teal-500 border-teal-100 hover:bg-teal-50', icon: CheckCircle },
                { status: 'Closed Lost', label: 'Rejected', color: 'text-orange-500 border-orange-100 hover:bg-orange-50', icon: XCircle },
            ],
            'Confirmed': [
                { status: 'Closed Won', label: 'Delivered', color: 'text-emerald-500 border-emerald-100 hover:bg-emerald-50', icon: Truck },
            ],
            'Delivered': [
                { status: 'Closed Won', label: 'Approve Won', color: 'bg-green-600 text-white', icon: CheckCircle },
            ],
            'Rejected': [
                { status: 'Closed Lost', label: 'Approve Lost', color: 'bg-red-600 text-white', icon: XCircle },
            ],
            'Closed Won': [], // Finalized
            'Closed Lost': [], // Finalized
            'Closed': [
                 { status: 'Archived', label: 'Archive Record', color: 'text-gray-400 border-gray-100 hover:bg-gray-50', icon: Archive },
            ]
        };

        const currentSteps = nextStepsMapping[normalizedStatus] || [];
        const isFinalized = normalizedStatus === 'Closed Won' || normalizedStatus === 'Closed Lost';

        return (
            <div key={enq.id} className={`group bg-white rounded-2xl border ${isFinalized ? 'border-gray-100 opacity-95' : 'border-gray-100 shadow-sm'} hover:shadow-md transition-all flex flex-col xl:flex-row xl:items-center gap-6 p-6`}>
                {/* Meta Column */}
                <div className="flex-shrink-0 xl:w-48 bg-gray-50/50 p-4 rounded-xl border border-gray-50 flex flex-row xl:flex-col items-center xl:items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm ${isFinalized ? 'text-gray-400' : 'text-[#2F468C]'}`}>
                                <User size={14} />
                            </div>
                            <span className="text-sm font-black text-gray-900 truncate">{enq.name}</span>
                        </div>
                        <a href={`tel:${enq.phone}`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#2F468C] font-bold">
                            <Phone size={10} /> {enq.phone}
                        </a>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100 mt-2">
                        <Clock size={10} /> {timeAgo(enq.created_at)}
                    </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <ShoppingBag size={14} className="text-[#2F468C]" />
                            <span className="text-[11px] font-black uppercase text-gray-900 tracking-tight">{enq.product_name || "Boutique Request"}</span>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${statusColors[normalizedStatus] || statusColors['New Lead']}`}>
                            {normalizedStatus.toUpperCase()}
                        </div>
                        {enq.is_delivered == 1 && (
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-[9px] font-black uppercase border border-green-100 italic">
                                <CheckCircle size={10} /> Fully Delivered
                            </div>
                        )}
                        {enq.is_rejected == 1 && (
                            <div className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-[9px] font-black uppercase border border-red-100 italic">
                                <XCircle size={10} /> Order Rejected
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 relative group-hover:bg-white transition-all">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                            "{enq.message || "Customer requested details on WhatsApp."}"
                        </p>
                    </div>
                </div>

                {/* Action Column */}
                <div className="flex-shrink-0 flex flex-col md:flex-row xl:flex-col gap-2 min-w-[180px]">
                    <div className="flex flex-1 gap-2">
                        {currentSteps.map((step) => (
                            <button 
                                key={step.status}
                                onClick={() => handleStatusUpdate(enq.id, step.status)}
                                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 ${step.color}`}
                            >
                                <step.icon size={14} /> {step.label}
                            </button>
                        ))}
                        
                        {isFinalized && (
                            <button 
                                onClick={() => handleStatusUpdate(enq.id, 'In Progress')}
                                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all font-sans"
                            >
                                <Play size={14} /> Edit Status
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <a 
                            href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent("Hello! I am contacting you regarding your boutique enquiry on Darain.")}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#128C7E] transition-all shadow-lg shadow-[#25D366]/20"
                        >
                            <MessageCircle size={14} /> WhatsApp
                        </a>
                        <button 
                            onClick={() => handleStatusUpdate(enq.id, 'Archived')}
                            className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-red-400 hover:border-red-100 transition-all"
                            title="Move to Archive"
                        >
                            <Archive size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-serif text-blue-600">New Leads Pipeline</h1>
                    <p className="text-sm text-gray-500 mt-1">Focus on immediate priority customer enquiries.</p>
                </div>
                <Link to="/admin/enquiries/history" className="flex items-center gap-3 bg-white px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:text-black transition-all font-black text-[10px] uppercase tracking-widest shadow-sm">
                    <History size={16} /> View All History <ChevronRight size={14} />
                </Link>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Quick search pipeline..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2F468C]/10 transition-all shadow-inner"
                    />
                </div>
                <div className="bg-[#2F468C]/5 px-6 py-3 rounded-xl border border-[#2F468C]/10 text-[#2F468C] font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="animate-pulse" /> {activeLeads.length} Total Leads
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between border-l-4 border-blue-500 pl-4 py-1">
                    <h2 className="text-xs font-black uppercase tracking-widest text-blue-600">Active Pipeline (Latest {displayLimit})</h2>
                    {activeLeads.length > 10 && (
                        <button 
                            onClick={() => setDisplayLimit(displayLimit === 10 ? 20 : 10)}
                            className="text-[10px] font-black uppercase text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            {displayLimit === 10 ? 'View Top 20' : 'Show Less'}
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(n => <div key={n} className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
                    </div>
                ) : displayLeads.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {displayLeads.map(enq => renderEnquiryCard(enq))}
                        
                        {activeLeads.length > displayLimit && (
                            <button 
                                onClick={() => setDisplayLimit(displayLimit + 10)}
                                className="w-full py-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
                            >
                                <MoreHorizontal size={14} /> View 10 More Leads
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-24 text-center rounded-3xl border border-gray-100 flex flex-col items-center justify-center">
                        <Inbox size={64} className="text-gray-200 mb-6" />
                        <h3 className="text-gray-900 font-bold text-lg font-serif">Inbox Clean!</h3>
                        <p className="text-xs text-gray-400 font-medium mt-2 uppercase tracking-widest">No new hot leads at the moment.</p>
                        <Link to="/admin/enquiries/history" className="mt-6 text-blue-600 font-black text-[10px] uppercase flex items-center gap-2 hover:underline">
                            Search All History <ArrowRight size={14} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEnquiries;
