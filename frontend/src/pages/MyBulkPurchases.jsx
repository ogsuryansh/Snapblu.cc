import { useState, useEffect } from 'react';
import { Layers, Download, Copy, Check, Calendar, Tag, Loader2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config/api';
import EmptyState from '../components/common/EmptyState';

const MyBulkPurchases = () => {
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        fetchLots();
    }, []);

    const fetchLots = async () => {
        try {
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/orders/myorders`, config);
            setLots(data.filter(p => p.type === 'bulk'));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bulk purchases:', error);
            setLoading(false);
        }
    };

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDownload = (text, filename) => {
        const element = document.createElement("a");
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${filename}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 opacity-50 grayscale">
                <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                <p className="text-gray-400 font-medium tracking-widest uppercase">Fetching Your Lots...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">My Bulk Lots</h1>
                <p className="text-gray-400">Manage and download your purchased card packages</p>
            </div>

            {lots.length === 0 ? (
                <div className="card">
                    <EmptyState
                        icon={Layers}
                        title="No bulk purchases found"
                        description="You haven't made any bulk card purchases yet. Browse the Bulk shop for great deals."
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {lots.map((lot) => (
                        <div key={lot._id} className="card p-0 overflow-hidden border-orange-500/10 hover:border-orange-500/20 transition-all">
                            <div className="p-6 border-b border-slate-700 bg-slate-800/30">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-orange-600/20 rounded-xl text-orange-500">
                                            <Layers size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{lot.name}</h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase">
                                                    <Tag size={12} className="text-blue-500" /> {lot.category}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase">
                                                    <Calendar size={12} className="text-blue-500" /> {new Date(lot.soldAt || lot.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleCopy(lot.data, lot._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                                        >
                                            {copiedId === lot._id ? (
                                                <><Check size={14} className="text-green-500" /> COPIED</>
                                            ) : (
                                                <><Copy size={14} className="text-blue-500" /> COPY ALL</>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDownload(lot.data, `bulk_lot_${lot._id.slice(-6)}`)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/40"
                                        >
                                            <Download size={14} /> DOWNLOAD TXT
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-950/50">
                                <div className="relative">
                                    <pre className="p-6 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm text-green-400/80 overflow-x-auto max-h-[300px] whitespace-pre-wrap leading-relaxed">
                                        {lot.data}
                                    </pre>
                                    <div className="absolute top-0 right-0 p-4 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none">
                                        <span className="text-[10px] font-black text-slate-700 tracking-widest uppercase">ENCRYPTED DATA STREAM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBulkPurchases;
