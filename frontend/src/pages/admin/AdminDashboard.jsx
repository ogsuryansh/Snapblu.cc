import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, DollarSign, Package, ShoppingCart, TrendingUp, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStock: 0,
        totalSales: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
                setStats(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'bg-green-500',
            textColor: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20'
        },
        {
            title: 'Active Stock',
            value: stats.totalStock,
            icon: CreditCard,
            color: 'bg-blue-500',
            textColor: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            title: 'Total Sales',
            value: stats.totalSales,
            icon: ShoppingCart,
            color: 'bg-purple-500',
            textColor: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-orange-500',
            textColor: 'text-orange-500',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        }
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400 mb-8">Overview of your store's performance</p>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-800 rounded-xl"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, index) => (
                        <div key={index} className={`bg-slate-800 p-6 rounded-xl border ${card.border} shadow-lg relative overflow-hidden transition-transform hover:scale-[1.02]`}>
                            <div className="flex justify-between items-start z-10 relative">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">{card.title}</p>
                                    <h3 className="text-3xl font-bold text-white">{card.value}</h3>
                                </div>
                                <div className={`p-3 rounded-lg ${card.bg} ${card.textColor}`}>
                                    <card.icon size={24} />
                                </div>
                            </div>
                            {/* Decorative Background Blur */}
                            <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${card.bgColor} rounded-full blur-3xl opacity-20`}></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions & Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                        <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
                    </div>
                    <div className="text-slate-400 text-sm text-center py-8">
                        No recent transactions.
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-lg flex flex-col items-center gap-2 transition-colors">
                            <Package size={24} />
                            <span className="font-medium">Add Product</span>
                        </button>
                        <button className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg flex flex-col items-center gap-2 transition-colors">
                            <Users size={24} />
                            <span className="font-medium">Manage Users</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
