import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Clock, CreditCard } from 'lucide-react';

const AdminDeposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDeposits = async () => {
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/deposits', config);
            setDeposits(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeposits();
    }, []);

    const handleAction = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this deposit?`)) return;
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
            await axios.put(`http://localhost:5000/api/deposits/${id}`, { status }, config);
            fetchDeposits(); // Refresh list
        } catch (error) {
            alert('Action failed');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-8">Manage Deposits</h1>

            {loading ? (
                <div className="text-slate-500">Loading requests...</div>
            ) : (
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/50 text-xs uppercase text-slate-400">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">TXID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {deposits.map((d) => (
                                <tr key={d._id} className="hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium">
                                        {d.user?.email || 'Unknown User'}
                                    </td>
                                    <td className="px-6 py-4 text-green-400 font-bold">
                                        ${d.amount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <code className="bg-slate-900 px-2 py-1 rounded text-xs text-slate-500 font-mono max-w-[150px] truncate" title={d.transactionId}>
                                                {d.transactionId}
                                            </code>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {new Date(d.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {d.status === 'pending' && <span className="flex items-center gap-1 text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded"><Clock size={12} /> Pending</span>}
                                        {d.status === 'approved' && <span className="flex items-center gap-1 text-green-500 text-xs bg-green-500/10 px-2 py-1 rounded"><Check size={12} /> Approved</span>}
                                        {d.status === 'rejected' && <span className="flex items-center gap-1 text-red-500 text-xs bg-red-500/10 px-2 py-1 rounded"><X size={12} /> Rejected</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {d.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(d._id, 'approved')}
                                                    className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg transition-colors"
                                                    title="Approve & Add Balance"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(d._id, 'rejected')}
                                                    className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {deposits.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        No deposit requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDeposits;
