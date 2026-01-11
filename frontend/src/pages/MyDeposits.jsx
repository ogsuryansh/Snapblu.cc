import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, Clock, CheckCircle2, XCircle, Info, Loader2 } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import EmptyState from '../components/common/EmptyState';
import API_URL from '../config/api';

const MyDeposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/deposits`, config);
            setDeposits(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching deposits:', error);
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'transactionId', label: 'Hash/ID',
            render: (row) => <span className="font-mono text-xs text-blue-500">{row.transactionId || '---'}</span>
        },
        {
            key: 'method', label: 'Method',
            render: (row) => <span className="text-xs font-bold text-slate-400 capitalize">{row.method || 'Crypto'}</span>
        },
        {
            key: 'amount', label: 'Amount', sortable: true,
            render: (row) => <span className="font-bold text-green-500">${row.amount}</span>
        },
        {
            key: 'status', label: 'Status',
            render: (row) => {
                const status = row.status?.toLowerCase();
                if (status === 'approved') return <span className="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"><CheckCircle2 size={12} /> PAID</span>;
                if (status === 'rejected') return <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20"><XCircle size={12} /> REJECTED</span>;
                return <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20"><Clock size={12} /> PENDING</span>;
            }
        },
        {
            key: 'createdAt', label: 'Date', sortable: true,
            render: (row) => <span className="text-xs text-slate-500 font-medium">{new Date(row.createdAt).toLocaleString()}</span>
        },
        {
            key: 'actions', label: 'Info',
            render: (row) => (
                <button className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors" title="View Details">
                    <Info size={14} />
                </button>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 opacity-50 grayscale">
                <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                <p className="text-gray-400 font-medium tracking-widest uppercase">Fetching Deposit History...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Deposits</h1>
                    <p className="text-gray-400">View and track your funding transactions</p>
                </div>
                <div className="bg-slate-800/50 px-6 py-3 rounded-2xl border border-slate-700 flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confirmed Total</span>
                        <span className="text-lg font-black text-white">${deposits.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.amount, 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {deposits.length === 0 ? (
                <div className="card text-center py-20 border-dashed border-slate-700 bg-transparent">
                    <Wallet size={64} className="mx-auto text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-slate-500 mb-1">No Deposits Found</h3>
                    <p className="text-slate-600 mb-6 text-sm max-w-xs mx-auto">You haven't funded your account yet. Use the deposit page to add funds and start shopping.</p>
                </div>
            ) : (
                <div className="card p-0 overflow-hidden shadow-2xl shadow-blue-500/5 border-blue-500/10">
                    <DataTable columns={columns} data={deposits} />
                </div>
            )}
        </div>
    );
};

export default MyDeposits;
