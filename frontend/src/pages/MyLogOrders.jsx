import { useState, useEffect } from 'react';
import { FileText, Copy, Check, ExternalLink, Package, Loader2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config/api';
import EmptyState from '../components/common/EmptyState';

const MyLogOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/orders/myorders`, config);
            // Filter for only logs
            setOrders(data.filter(o => o.type === 'log'));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching log orders:', error);
            setLoading(false);
        }
    };

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                <p className="text-gray-400 font-medium tracking-widest">FETCHING YOUR ORDERS...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Log Orders</h1>
                    <p className="text-gray-400">View and manage your purchased accounts</p>
                </div>
                <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-sm">
                    Total Purchases: <span className="text-blue-400 font-bold">{orders.length}</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="card">
                    <EmptyState
                        icon={FileText}
                        title="No log orders found"
                        description="You haven't purchased any accounts yet. Visit the Logs shop to browse available items."
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="card p-0 overflow-hidden border-blue-500/10 hover:border-blue-500/30 transition-all group">
                            <div className="flex flex-col md:flex-row">
                                {/* Left Side - Info */}
                                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700 bg-slate-800/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white leading-tight">{order.name}</h3>
                                            <p className="text-xs text-blue-400 font-bold uppercase mt-0.5">{order.category}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Purchase Date:</span>
                                            <span className="text-slate-300">{new Date(order.soldAt || order.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Price Paid:</span>
                                            <span className="text-green-400 font-bold">${order.price}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Order ID:</span>
                                            <span className="text-slate-500 font-mono">#{order._id.slice(-8)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Credentials */}
                                <div className="p-6 flex-1 bg-slate-900/30">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Credentials / Data</span>
                                        <button
                                            onClick={() => handleCopy(order.data, order._id)}
                                            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 px-2 py-1 rounded"
                                        >
                                            {copiedId === order._id ? (
                                                <><Check size={12} /> COPIED</>
                                            ) : (
                                                <><Copy size={12} /> COPY DATA</>
                                            )}
                                        </button>
                                    </div>
                                    <div className="relative group/data">
                                        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-700 font-mono text-sm text-blue-100 overflow-x-auto whitespace-pre-wrap break-all min-h-[60px]">
                                            {order.data}
                                        </pre>
                                    </div>
                                    <div className="mt-4 flex gap-3">
                                        <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2">
                                            <ExternalLink size={14} /> LOGIN PAGE
                                        </button>
                                        <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2">
                                            <FileText size={14} /> REPORT ISSUE
                                        </button>
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

export default MyLogOrders;
