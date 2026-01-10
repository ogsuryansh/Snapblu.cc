import { useState } from 'react';
import {
    Wallet,
    ShoppingBag,
    DollarSign,
    CreditCard,
    Banknote,
    TrendingUp,
    RefreshCw,
} from 'lucide-react';

const Home = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'purchases', label: 'Purchases' },
        { id: 'deposits', label: 'Deposits' },
    ];

    const overviewStats = [
        {
            title: 'Current Balance',
            value: '$0.00',
            subtitle: 'Available balance',
            icon: Wallet,
            borderColor: 'border-l-4 border-l-blue-500',
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Total Orders',
            value: '0',
            subtitle: '0 completed',
            icon: ShoppingBag,
            borderColor: 'border-l-4 border-l-purple-500',
            iconBg: 'bg-purple-500/10',
            iconColor: 'text-purple-500',
        },
        {
            title: 'Total Spent',
            value: '$0.00',
            subtitle: '$0.00 refunded',
            icon: DollarSign,
            borderColor: 'border-l-4 border-l-green-500',
            iconBg: 'bg-green-500/10',
            iconColor: 'text-green-500',
        },
        {
            title: 'Cards Purchased',
            value: '0',
            subtitle: 'Total cards bought',
            icon: CreditCard,
            borderColor: 'border-l-4 border-l-orange-500',
            iconBg: 'bg-orange-500/10',
            iconColor: 'text-orange-500',
        },
        {
            title: 'Total Deposits',
            value: '0',
            subtitle: '0 paid, 0 pending',
            icon: Banknote,
            borderColor: 'border-l-4 border-l-blue-500',
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
            fullWidth: false,
        },
        {
            title: 'Deposit Amount',
            value: '$0.00',
            subtitle: 'Avg: $0.00',
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
                { label: 'Completed', value: '0', color: 'text-cyan-500' },
                { label: 'Refunded', value: '0', color: 'text-red-500' },
                { label: 'Partial', value: '0', color: 'text-orange-500' },
            ],
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overview of your account activity and statistics</p>
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
            {activeTab === 'overview' && (
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
                <div className="card p-12 text-center">
                    <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No purchases yet</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your purchase history will appear here.</p>
                </div>
            )}

            {activeTab === 'deposits' && (
                <div className="card p-12 text-center">
                    <Wallet size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No deposits yet</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your deposit history will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
