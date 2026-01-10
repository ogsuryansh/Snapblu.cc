import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight, ArrowDownLeft, Clock, Activity } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/transactions', config);
                setTransactions(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Transaction History</h1>

            {loading ? (
                <div className="text-center text-gray-500 py-10 animate-pulse">Loading activity...</div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-slate-900/50 uppercase text-xs font-bold text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-full ${tx.type === 'deposit'
                                                        ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                                                        : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                                    }`}>
                                                    {tx.type === 'deposit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                                <span className="font-medium capitalize text-gray-900 dark:text-white">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {tx.description}
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {new Date(tx.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 px-2 py-1 rounded-md text-xs font-medium">
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Activity size={32} className="text-gray-300 dark:text-gray-600" />
                                                <p>No transactions yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
