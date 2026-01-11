import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, RotateCcw, User, Calendar, Tag, Search, Loader2 } from 'lucide-react';
import API_URL from '../../config/api';
import DataTable from '../../components/common/DataTable';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [refundingId, setRefundingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/orders/all`, config);
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const handleRefund = async (orderId) => {
        if (!window.confirm('Are you sure you want to refund this order? This will return money to the user and restock the product.')) return;

        setRefundingId(orderId);
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            await axios.post(`${API_URL}/api/orders/refund/${orderId}`, {}, config);

            alert('Refund processed successfully');
            fetchOrders(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || 'Refund failed');
        } finally {
            setRefundingId(null);
        }
    };

    const filteredOrders = orders.filter(order => {
        const query = searchQuery.toLowerCase();
        return (
            (order.soldTo?.username && order.soldTo.username.toLowerCase().includes(query)) ||
            (order.name && order.name.toLowerCase().includes(query)) ||
            (order.bin && order.bin.includes(query)) ||
            (order._id && order._id.includes(query))
        );
    });

    const columns = [
        {
            key: 'user', label: 'Customer',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        <User size={12} className="text-blue-500" /> {row.soldTo?.username || 'Unknown'}
                    </span>
                    <span className="text-[10px] text-slate-500">{row.soldTo?.email}</span>
                </div>
            )
        },
        {
            key: 'product', label: 'Product Info',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-300">
                        {row.type === 'card' ? `CARD: ${row.bin} (${row.brand})` : `LOG: ${row.name}`}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-black">{row._id.slice(-8)}</span>
                </div>
            )
        },
        {
            key: 'price', label: 'Price', sortable: true,
            render: (row) => <span className="font-bold text-green-500">${row.price}</span>
        },
        {
            key: 'soldAt', label: 'Sold Date', sortable: true,
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold">{new Date(row.soldAt || row.updatedAt).toLocaleDateString()}</span>
                    <span className="text-[10px] text-slate-600">{new Date(row.soldAt || row.updatedAt).toLocaleTimeString()}</span>
                </div>
            )
        },
        {
            key: 'actions', label: 'Actions',
            render: (row) => (
                <button
                    onClick={() => handleRefund(row._id)}
                    disabled={refundingId === row._id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-[10px] font-black rounded-lg border border-red-500/20 transition-all uppercase"
                >
                    {refundingId === row._id ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
                    REFUND
                </button>
            )
        }
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <ShoppingBag className="text-blue-500" /> Order Management
                    </h1>
                    <p className="text-gray-400">Total Orders: <span className="text-blue-400 font-bold">{orders.length}</span> | View and refund customer purchases</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by user, product, bin..."
                        className="input-field pl-10 h-11"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                    <p className="text-slate-400 font-black tracking-widest uppercase">Fetching Global Ledger...</p>
                </div>
            ) : (
                <div className="card p-0 overflow-hidden border-slate-700 shadow-2xl">
                    <DataTable
                        columns={columns}
                        data={filteredOrders}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
