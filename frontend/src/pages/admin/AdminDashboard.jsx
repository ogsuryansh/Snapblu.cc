import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, DollarSign, Package, ShoppingCart, TrendingUp, CreditCard } from 'lucide-react';
import API_URL from '../../config/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStock: 0,
        totalSales: 0,
        totalRevenue: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
                const { data } = await axios.get(`${API_URL}/api/admin/stats`, config);
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
            value: `$${(stats.totalRevenue || 0).toFixed(2)}`,
            icon: DollarSign,
            color: 'bg-green-500',
            textColor: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20'
        },
        {
            title: 'Active Stock',
            value: stats.totalStock || 0,
            icon: CreditCard,
            color: 'bg-blue-500',
            textColor: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            title: 'Total Sales',
            value: stats.totalSales || 0,
            icon: ShoppingCart,
            color: 'bg-purple-500',
            textColor: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers || 0,
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
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                        <Link to="/admin/orders" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {stats.recentActivity && stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((activity) => (
                                <div key={activity._id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${activity.type === 'purchase' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {activity.type === 'purchase' ? <ShoppingCart size={16} /> : <DollarSign size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white line-clamp-1">{activity.description}</p>
                                            <p className="text-xs text-slate-500">{activity.user?.username || 'Unknown'} • {new Date(activity.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className={`text-sm font-bold ${activity.type === 'purchase' ? 'text-red-400' : 'text-green-400'}`}>
                                        {activity.type === 'purchase' ? '-' : '+'}${activity.amount}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-slate-400 text-sm text-center py-8">
                                No recent activity found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-lg flex flex-col items-center gap-2 transition-colors group shadow-lg shadow-blue-900/20"
                        >
                            <Package size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Add Product</span>
                        </button>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg flex flex-col items-center gap-2 transition-colors group"
                        >
                            <Users size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Manage Users</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
