import { useState, useEffect } from 'react';
import axios from 'axios';
import { Copy, Eye, EyeOff, CheckCircle } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import API_URL from '../config/api';

const MyCardOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [revealedIds, setRevealedIds] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${API_URL}/api/orders/myorders`, config);
                // Filter only cards just in case
                const onlyCards = data.filter(item => item.type === 'card');
                setOrders(onlyCards);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const toggleReveal = (id) => {
        setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied!');
    };

    const columns = [
        {
            key: 'bin', label: 'BIN',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-mono text-blue-400 font-bold">{row.bin}</span>
                </div>
            )
        },
        {
            key: 'country', label: 'Country',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-300">{row.country || 'US'}</span>
                    {(row.country === 'US' || !row.country) && <span className="text-sm">🇺🇸</span>}
                </div>
            )
        },
        {
            key: 'details', label: 'Card Details',
            render: (row) => {
                const isRevealed = revealedIds[row._id];
                return (
                    <div className="flex items-center gap-2">
                        <div className={`font-mono text-xs p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-64 break-all ${isRevealed ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 blur-sm select-none'}`}>
                            {isRevealed ? row.data : '••••••••••••••••••••••••••••'}
                        </div>
                        <button
                            onClick={() => toggleReveal(row._id)}
                            className="p-1.5 text-gray-500 hover:text-blue-500 transition-colors"
                            title={isRevealed ? "Hide" : "Show"}
                        >
                            {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        {isRevealed && (
                            <button
                                onClick={() => copyToClipboard(row.data)}
                                className="p-1.5 text-gray-500 hover:text-green-500 transition-colors"
                                title="Copy"
                            >
                                <Copy size={16} />
                            </button>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'brand', label: 'Brand',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-bold">{row.brand}</span>
                    {row.category === 'new' && (
                        <span className="bg-blue-600 text-white text-[8px] px-1 py-0.5 rounded font-bold">NEW</span>
                    )}
                </div>
            )
        },
        {
            key: 'batch', label: 'Class',
            render: (row) => (
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${row.batch === 'refundable'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : 'bg-slate-700 text-slate-400 border-slate-600'
                    }`}>
                    {row.batch || 'NON-REFUNDABLE'}
                </span>
            )
        },
        {
            key: 'price', label: 'Price',
            render: (row) => <span className="text-green-500 font-bold">${row.price}</span>
        },
        {
            key: 'date', label: 'Date Purchased',
            render: (row) => <span className="text-xs text-gray-500">{new Date(row.soldAt).toLocaleDateString()}</span>
        }
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Card Orders</h1>
                <p className="text-gray-600 dark:text-gray-400">View and manage your purchased cards.</p>
            </div>

            <div className="card">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading orders...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>You haven't purchased any cards yet.</p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={orders}
                    />
                )}
            </div>
        </div>
    );
};

export default MyCardOrders;
