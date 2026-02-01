import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Wallet,
    ShoppingBag,
    DollarSign,
    CreditCard,
    Banknote,
    TrendingUp,
    RefreshCw,
} from 'lucide-react';
import API_URL from '../config/api';

const Home = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        balance: 0,
        totalOrders: 0,
        totalSpent: 0,
        cardsPurchased: 0,
        totalDeposits: 0,
        approvedDeposits: 0,
        pendingDeposits: 0,
        depositAmount: 0,
        completedOrders: 0,
        refundedOrders: 0,
        totalRefunded: 0,
        partialOrders: 0,
        orders: [],
        deposits: [],
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            // Fetch user profile for balance
            const { data: profile } = await axios.get(`${API_URL}/api/users/me`, config);

            // Fetch orders
            const { data: orders } = await axios.get(`${API_URL}/api/orders/myorders`, config);

            // Fetch transactions for total spent
            const { data: transactions } = await axios.get(`${API_URL}/api/transactions`, config);

            // Calculate stats from transactions for better accuracy
            const purchaseTxns = transactions.filter(t => t.type === 'purchase' && t.status === 'completed');
            const totalSpent = purchaseTxns.reduce((sum, t) => sum + (t.amount || 0), 0);

            const cardsPurchased = orders.filter(o => o.type === 'card').length;

            // Fetch deposits for the deposits tab
            const { data: deposits } = await axios.get(`${API_URL}/api/deposits`, config);

            // Calculate deposit stats
            const approvedDeposits = deposits.filter(d => d.status === 'approved').length;
            const pendingDeposits = deposits.filter(d => d.status === 'pending').length;

            // Calculate total deposit amount from approved deposits
            const approvedDepositsList = deposits.filter(d => d.status === 'approved');
            const totalDepositAmount = approvedDepositsList.reduce((sum, d) => sum + (d.amount || 0), 0);

            // Calculate refunded amount (from transactions)
            const refundTxns = transactions.filter(t => t.type === 'refund' && t.status === 'completed');
            const totalRefunded = refundTxns.reduce((sum, t) => sum + (t.amount || 0), 0);

            setStats({
                balance: profile.balance || 0,
                totalOrders: purchaseTxns.length, // Gross orders
                totalSpent: totalSpent, // Gross spent
                cardsPurchased: cardsPurchased,
                totalDeposits: deposits.length,
                approvedDeposits: approvedDeposits,
                pendingDeposits: pendingDeposits,
                depositAmount: totalDepositAmount,
                completedOrders: purchaseTxns.length - refundTxns.length,
                refundedOrders: refundTxns.length,
                totalRefunded: totalRefunded,
                partialOrders: 0,
                orders: orders,
                deposits: deposits,
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'purchases', label: 'Purchases' },
        { id: 'deposits', label: 'Deposits' },
    ];

    const overviewStats = [
        {
            title: 'Current Balance',
            value: `$${stats.balance.toFixed(2)}`,
            subtitle: 'Available balance',
            icon: Wallet,
            borderColor: 'border-l-4 border-l-blue-500',
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders.toString(),
            subtitle: `${stats.completedOrders} completed`,
            icon: ShoppingBag,
            borderColor: 'border-l-4 border-l-purple-500',
            iconBg: 'bg-purple-500/10',
            iconColor: 'text-purple-500',
        },
        {
            title: 'Total Spent',
            value: `$${stats.totalSpent.toFixed(2)}`,
            subtitle: `$${stats.totalRefunded.toFixed(2)} refunded`,
            icon: DollarSign,
            borderColor: 'border-l-4 border-l-green-500',
            iconBg: 'bg-green-500/10',
            iconColor: 'text-green-500',
        },
        {
            title: 'Cards Purchased',
            value: stats.cardsPurchased.toString(),
            subtitle: 'Total cards bought',
            icon: CreditCard,
            borderColor: 'border-l-4 border-l-orange-500',
            iconBg: 'bg-orange-500/10',
            iconColor: 'text-orange-500',
        },
        {
            title: 'Total Deposits',
            value: stats.totalDeposits.toString(),
            subtitle: `${stats.approvedDeposits} paid, ${stats.pendingDeposits} pending`,
            icon: Banknote,
            borderColor: 'border-l-4 border-l-blue-500',
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
            fullWidth: false,
        },
        {
            title: 'Deposit Amount',
            value: `$${stats.depositAmount.toFixed(2)}`,
            subtitle: stats.totalDeposits > 0 ? `Avg: $${(stats.depositAmount / stats.totalDeposits).toFixed(2)}` : 'Avg: $0.00',
            icon: TrendingUp,
            borderColor: 'border-l-4 border-l-cyan-500',
            iconBg: 'bg-cyan-500/10',
            iconColor: 'text-cyan-500',
            fullWidth: false,
        },
        {
            title: 'Order Status',
            value: null,
            subtitle: null,
            icon: RefreshCw,
            borderColor: 'border-l-4 border-l-teal-500',
            iconBg: 'bg-teal-500/10',
            iconColor: 'text-teal-500',
            fullWidth: false,
            isStatusCard: true,
            statusData: [
                { label: 'Completed', value: stats.completedOrders.toString(), color: 'text-cyan-500' },
                { label: 'Refunded', value: stats.refundedOrders.toString(), color: 'text-red-500' },
                { label: 'Partial', value: stats.partialOrders.toString(), color: 'text-orange-500' },
            ],
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overview of your account activity and statistics</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="p-2 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover rounded-full transition-all text-gray-600 dark:text-gray-400 hover:text-blue-500"
                    title="Refresh Stats"
                    disabled={loading}
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === tab.id
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                            : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-hover hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="card p-4 animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            ) : activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {overviewStats.slice(0, 4).map((stat, idx) => (
                        <div
                            key={idx}
                            className={`card ${stat.borderColor} hover:shadow-md transition-shadow`}
                        >
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                                    <div className={`p-1.5 rounded-lg ${stat.iconBg}`}>
                                        <stat.icon size={16} className={stat.iconColor} />
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-500">{stat.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Second Row - 3 columns */}
                    {overviewStats.slice(4).map((stat, idx) => (
                        <div
                            key={idx}
                            className={`card ${stat.borderColor} hover:shadow-md transition-shadow ${stat.isStatusCard ? 'lg:col-span-2' : ''
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                                    <div className={`p-1.5 rounded-lg ${stat.iconBg}`}>
                                        <stat.icon size={16} className={stat.iconColor} />
                                    </div>
                                </div>

                                {stat.isStatusCard ? (
                                    <div className="space-y-2">
                                        {stat.statusData.map((status, statusIdx) => (
                                            <div key={statusIdx} className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600 dark:text-gray-400">{status.label}</span>
                                                <span className={`text-sm font-semibold ${status.color}`}>
                                                    {status.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-0.5">
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-500">{stat.subtitle}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'purchases' && (
                <div className="card">
                    {stats.orders.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No purchases yet</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Your purchase history will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-dark-hover border-b border-gray-200 dark:border-dark-border">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Product</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Country</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">BIN</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Brand</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Price</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                                    {stats.orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium capitalize">
                                                {order.type === 'log' ? 'Account/Log' : order.type === 'bulk' ? 'Bulk/Lot' : order.type}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                                                {order.country || 'US'}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-blue-500">
                                                {order.type === 'card' ? order.bin : '--'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    {order.type === 'card' ? order.brand : (order.name || '---')}
                                                    {order.category === 'new' && (
                                                        <span className="bg-blue-600 text-white text-[8px] px-1 py-0.5 rounded font-bold">NEW</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${order.batch === 'refundable'
                                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                    : 'bg-slate-700 text-slate-400 border-slate-600'
                                                    }`}>
                                                    {order.batch || 'NON-REFUNDABLE'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-bold text-green-500">${order.price}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(order.soldAt || order.updatedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'deposits' && (
                <div className="card">
                    {stats.deposits.length === 0 ? (
                        <div className="p-12 text-center">
                            <Wallet size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No deposits yet</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Your deposit history will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-dark-hover border-b border-gray-200 dark:border-dark-border">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Payment Method</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                                    {stats.deposits.map((deposit) => (
                                        <tr key={deposit._id} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                                            <td className="px-4 py-3 text-sm font-bold text-green-500">${deposit.amount}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{deposit.method || 'Crypto'}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${deposit.status === 'approved'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : deposit.status === 'rejected'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {deposit.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(deposit.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
